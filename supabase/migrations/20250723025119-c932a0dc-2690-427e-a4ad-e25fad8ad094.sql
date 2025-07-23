-- Fix the security definer view by removing SECURITY DEFINER
DROP VIEW IF EXISTS public.doctor_profiles_with_availability;

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

-- Add RLS policy for the view since we removed SECURITY DEFINER
CREATE POLICY "Everyone can view approved doctor profiles" 
ON public.doctor_registrations 
FOR SELECT 
USING (status = 'approved');