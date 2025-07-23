-- Remove the conflicting policy that was just created
DROP POLICY IF EXISTS "Everyone can view approved doctor profiles" ON public.doctor_registrations;

-- Check if there are other security definer views and fix them
-- The doctor_registrations table already has proper RLS policies, so we don't need additional ones