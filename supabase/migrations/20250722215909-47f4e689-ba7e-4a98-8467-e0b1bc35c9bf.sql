-- Create remaining tables
CREATE TABLE public.appointments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctor_registrations(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
CREATE POLICY "Users can view own appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = patient_id OR auth.uid() = (SELECT user_id FROM public.doctor_registrations WHERE id = doctor_id));

CREATE POLICY "Patients can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = patient_id OR auth.uid() = (SELECT user_id FROM public.doctor_registrations WHERE id = doctor_id));

-- Create notifications table
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create medical analyses table
CREATE TABLE public.medical_analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  analysis_type text NOT NULL,
  analysis_result jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medical analyses
ALTER TABLE public.medical_analyses ENABLE ROW LEVEL SECURITY;

-- Policies for medical analyses
CREATE POLICY "Users can view own analyses" 
ON public.medical_analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analyses" 
ON public.medical_analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses" 
ON public.medical_analyses 
FOR UPDATE 
USING (auth.uid() = user_id);