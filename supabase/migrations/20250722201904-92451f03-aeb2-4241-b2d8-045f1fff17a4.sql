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

-- Create view for approved doctors with specialty info
CREATE OR REPLACE VIEW public.approved_doctors AS
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
  p.email
FROM public.doctor_registrations dr
JOIN public.profiles p ON dr.user_id = p.id
LEFT JOIN public.specialties s ON dr.specialty_id = s.id
WHERE dr.status = 'approved';

-- Enable RLS on the view
ALTER VIEW public.approved_doctors SET (security_barrier = true);

-- Policy for approved doctors view
CREATE POLICY "Everyone can view approved doctors" 
ON public.approved_doctors 
FOR SELECT 
USING (true);