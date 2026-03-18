-- Grant admin role to Alex Lawton's accounts
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('6a468a85-688e-4c98-b615-f42a2ebb40cb', 'admin'),
  ('0bd3d298-f1e1-4cd5-80b4-8fae48754c08', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;