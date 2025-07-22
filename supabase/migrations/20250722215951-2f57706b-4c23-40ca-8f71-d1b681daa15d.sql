-- Create function to update timestamps with search_path set for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_specialties_updated_at
BEFORE UPDATE ON public.specialties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_registrations_updated_at
BEFORE UPDATE ON public.doctor_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_analyses_updated_at
BEFORE UPDATE ON public.medical_analyses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create view for approved doctors with complete information
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