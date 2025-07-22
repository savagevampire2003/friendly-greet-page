-- Create specialties table for dynamic specialty management
CREATE TABLE public.specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on specialties
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

-- Policies for specialties table
CREATE POLICY "Everyone can view specialties" 
ON public.specialties 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage specialties" 
ON public.specialties 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert some default specialties
INSERT INTO public.specialties (name, description) VALUES
('Cardiologist', 'Heart and cardiovascular system specialist'),
('Dermatologist', 'Skin, hair, and nail specialist'),
('Hematologist', 'Blood disorders specialist'),
('Neurologist', 'Nervous system specialist'),
('Orthopedist', 'Bone and joint specialist'),
('Pediatrician', 'Children''s health specialist'),
('Psychiatrist', 'Mental health specialist'),
('Radiologist', 'Medical imaging specialist'),
('Urologist', 'Urinary system specialist'),
('Gynecologist', 'Women''s reproductive health specialist');

-- Add trigger for updated_at
CREATE TRIGGER update_specialties_updated_at
BEFORE UPDATE ON public.specialties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update doctor_registrations table to reference specialties
ALTER TABLE public.doctor_registrations 
ADD COLUMN specialty_id uuid REFERENCES public.specialties(id);

-- For existing records, try to match specialization text to specialty names
UPDATE public.doctor_registrations 
SET specialty_id = (
  SELECT id FROM public.specialties 
  WHERE LOWER(name) = LOWER(doctor_registrations.specialization)
  LIMIT 1
);