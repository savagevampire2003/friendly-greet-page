-- Create view for doctor profiles with availability info (without RLS policy)
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