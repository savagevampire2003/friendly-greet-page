-- Add missing columns to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS consultation_fee decimal(10,2),
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
ADD COLUMN IF NOT EXISTS consultation_type text DEFAULT 'video' CHECK (consultation_type IN ('video', 'audio', 'chat')),
ADD COLUMN IF NOT EXISTS meeting_link text,
ADD COLUMN IF NOT EXISTS prescription text,
ADD COLUMN IF NOT EXISTS diagnosis text;

-- Create get_available_slots function
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