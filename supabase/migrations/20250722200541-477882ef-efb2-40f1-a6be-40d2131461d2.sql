-- Temporarily allow authenticated users to update doctor registrations
-- This is needed because we don't have an admin user set up yet
DROP POLICY IF EXISTS "Admins can update registrations" ON public.doctor_registrations;

CREATE POLICY "Authenticated users can update registrations" 
ON public.doctor_registrations 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Also allow authenticated users to create notifications temporarily
DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (true);