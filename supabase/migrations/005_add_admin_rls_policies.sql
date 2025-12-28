-- Create is_admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND (role = 'admin' OR role = 'super_admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- Add Admin policies for Movies table
CREATE POLICY "Admins can select all movies" 
ON movies FOR SELECT 
TO authenticated 
USING ( is_admin() );

CREATE POLICY "Admins can update all movies" 
ON movies FOR UPDATE 
TO authenticated 
USING ( is_admin() );

CREATE POLICY "Admins can delete all movies" 
ON movies FOR DELETE 
TO authenticated 
USING ( is_admin() );
