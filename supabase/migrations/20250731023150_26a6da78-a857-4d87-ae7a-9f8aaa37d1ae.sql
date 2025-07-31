-- Fix function search path by recreating with proper search path
-- First, drop policies that depend on the functions
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all consents" ON public.user_consents;

-- Now drop and recreate the functions with proper search path
DROP FUNCTION IF EXISTS public.has_role(_user_id UUID, _role app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;

-- Recreate security definer function for role checking with proper search path
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Recreate function to get current user role with proper search path  
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = 'public'
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Recreate the admin policies with the updated functions
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all consents" 
ON public.user_consents 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));