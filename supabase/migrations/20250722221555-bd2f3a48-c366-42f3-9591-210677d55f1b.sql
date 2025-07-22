-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role text DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin'));

-- Create index for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = ''
AS $$
begin
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'full_name', 
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'patient')
  );
  RETURN new;
END;
$$;