-- Create doctor_registrations table
CREATE TABLE public.doctor_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  medical_license_number TEXT NOT NULL,
  specialization TEXT NOT NULL,
  years_of_experience INTEGER NOT NULL,
  hospital_affiliation TEXT,
  contact_phone TEXT NOT NULL,
  professional_bio TEXT,
  education_details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.doctor_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for doctor_registrations
CREATE POLICY "Doctors can view their own registration" 
ON public.doctor_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Doctors can insert their own registration" 
ON public.doctor_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can update their own pending registration" 
ON public.doctor_registrations 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Admin policies for doctor_registrations
CREATE POLICY "Admins can view all registrations" 
ON public.doctor_registrations 
FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update registrations" 
ON public.doctor_registrations 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can create notifications
CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_doctor_registrations_updated_at
  BEFORE UPDATE ON public.doctor_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();