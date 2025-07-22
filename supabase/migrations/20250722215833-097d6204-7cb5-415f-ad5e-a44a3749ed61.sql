-- Create doctor registrations table
CREATE TABLE public.doctor_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  medical_license_number text NOT NULL,
  specialization text NOT NULL,
  specialty_id uuid REFERENCES public.specialties(id),
  years_of_experience integer NOT NULL,
  hospital_affiliation text,
  contact_phone text NOT NULL,
  professional_bio text,
  education_details text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on doctor registrations
ALTER TABLE public.doctor_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for doctor registrations
CREATE POLICY "Users can view own registration" 
ON public.doctor_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registration" 
ON public.doctor_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registration" 
ON public.doctor_registrations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage all registrations" 
ON public.doctor_registrations 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);