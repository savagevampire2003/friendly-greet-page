-- Create doctors_availability table
CREATE TABLE public.doctors_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id uuid NOT NULL REFERENCES public.doctor_registrations(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer NOT NULL DEFAULT 30,
  consultation_fee decimal(10,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctors_availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Doctors can manage their own availability" 
ON public.doctors_availability 
FOR ALL 
TO authenticated
USING (
  doctor_id IN (
    SELECT id FROM public.doctor_registrations 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Everyone can view doctor availability" 
ON public.doctors_availability 
FOR SELECT 
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_doctors_availability_updated_at
BEFORE UPDATE ON public.doctors_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();