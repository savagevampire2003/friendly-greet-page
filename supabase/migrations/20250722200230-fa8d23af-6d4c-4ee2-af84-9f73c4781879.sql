-- Fix admin permissions for doctor_registrations
-- First, let's recreate the is_admin function to be more robust
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = COALESCE(user_id, auth.uid()) AND role = 'admin'
  );
$$;

-- Drop existing admin policies and recreate them
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.doctor_registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON public.doctor_registrations;

-- Recreate admin policies with better permissions
CREATE POLICY "Admins can view all registrations" 
ON public.doctor_registrations 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can update registrations" 
ON public.doctor_registrations 
FOR UPDATE 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Also ensure admins can insert notifications
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());