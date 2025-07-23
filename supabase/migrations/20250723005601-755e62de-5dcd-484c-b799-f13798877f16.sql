-- Create doctors_availability table for doctor schedule management
CREATE TABLE public.doctors_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id uuid NOT NULL REFERENCES public.doctor_registrations(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 30,
  consultation_fee decimal(10,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent overlapping availability for same doctor/day
CREATE UNIQUE INDEX doctors_availability_unique_slot 
ON public.doctors_availability (doctor_id, day_of_week, start_time, end_time);

-- Update appointments table to include more consultation details
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS consultation_fee decimal(10,2),
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
ADD COLUMN IF NOT EXISTS consultation_type text DEFAULT 'video' CHECK (consultation_type IN ('video', 'audio', 'chat')),
ADD COLUMN IF NOT EXISTS meeting_link text,
ADD COLUMN IF NOT EXISTS prescription text,
ADD COLUMN IF NOT EXISTS diagnosis text;

-- Create consultation_sessions table for active consultations
CREATE TABLE public.consultation_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id uuid NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  session_status text NOT NULL DEFAULT 'scheduled' CHECK (session_status IN ('scheduled', 'active', 'completed', 'cancelled')),
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  session_notes text,
  recording_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.doctors_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for doctors_availability
CREATE POLICY "Doctors can manage their own availability" 
ON public.doctors_availability 
FOR ALL 
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctor_registrations 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  doctor_id IN (
    SELECT id FROM public.doctor_registrations 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Everyone can view doctor availability" 
ON public.doctors_availability 
FOR SELECT 
USING (is_active = true);

-- RLS policies for consultation_sessions
CREATE POLICY "Users can view their own consultation sessions" 
ON public.consultation_sessions 
FOR SELECT 
TO authenticated
USING (
  appointment_id IN (
    SELECT id FROM public.appointments 
    WHERE patient_id = auth.uid() 
    OR doctor_id IN (
      SELECT id FROM public.doctor_registrations 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Doctors can manage consultation sessions" 
ON public.consultation_sessions 
FOR ALL 
TO authenticated
USING (
  appointment_id IN (
    SELECT id FROM public.appointments 
    WHERE doctor_id IN (
      SELECT id FROM public.doctor_registrations 
      WHERE user_id = auth.uid()
    )
  )
)
WITH CHECK (
  appointment_id IN (
    SELECT id FROM public.appointments 
    WHERE doctor_id IN (
      SELECT id FROM public.doctor_registrations 
      WHERE user_id = auth.uid()
    )
  )
);

-- Create function to generate available time slots
CREATE OR REPLACE FUNCTION public.get_available_slots(
  p_doctor_id uuid,
  p_date date
) RETURNS TABLE (
  slot_time time,
  is_available boolean
) 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  availability_record RECORD;
  slot_start time;
  slot_end time;
  current_slot time;
  day_of_week_num integer;
BEGIN
  -- Get day of week (0 = Sunday)
  day_of_week_num := EXTRACT(DOW FROM p_date);
  
  -- Get doctor's availability for the given day
  SELECT da.start_time, da.end_time, da.slot_duration_minutes
  INTO availability_record
  FROM public.doctors_availability da
  WHERE da.doctor_id = p_doctor_id 
    AND da.day_of_week = day_of_week_num
    AND da.is_active = true;
    
  -- If no availability found, return empty
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  slot_start := availability_record.start_time;
  slot_end := availability_record.end_time;
  current_slot := slot_start;
  
  -- Generate time slots
  WHILE current_slot < slot_end LOOP
    RETURN QUERY SELECT 
      current_slot as slot_time,
      NOT EXISTS (
        SELECT 1 FROM public.appointments a
        WHERE a.doctor_id = p_doctor_id
          AND a.appointment_date = p_date
          AND a.appointment_time = current_slot
          AND a.status NOT IN ('cancelled', 'rejected')
      ) as is_available;
      
    current_slot := current_slot + (availability_record.slot_duration_minutes || ' minutes')::interval;
  END LOOP;
END;
$$;

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_doctors_availability_updated_at
BEFORE UPDATE ON public.doctors_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_sessions_updated_at
BEFORE UPDATE ON public.consultation_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for doctor profiles with availability info
CREATE OR REPLACE VIEW public.doctor_profiles_with_availability AS
SELECT 
  dr.id,
  dr.user_id,
  dr.full_name,
  dr.specialization,
  dr.specialty_id,
  s.name as specialty_name,
  s.description as specialty_description,
  dr.hospital_affiliation,
  dr.years_of_experience,
  dr.professional_bio,
  dr.education_details,
  dr.contact_phone,
  p.email,
  COALESCE(
    (SELECT AVG(da.consultation_fee) 
     FROM public.doctors_availability da 
     WHERE da.doctor_id = dr.id AND da.is_active = true), 
    0
  ) as avg_consultation_fee,
  EXISTS(
    SELECT 1 FROM public.doctors_availability da 
    WHERE da.doctor_id = dr.id AND da.is_active = true
  ) as has_availability
FROM public.doctor_registrations dr
JOIN public.profiles p ON dr.user_id = p.id
LEFT JOIN public.specialties s ON dr.specialty_id = s.id
WHERE dr.status = 'approved';

-- Policy for the new view
CREATE POLICY "Everyone can view doctor profiles with availability" 
ON public.doctor_profiles_with_availability 
FOR SELECT 
USING (true);