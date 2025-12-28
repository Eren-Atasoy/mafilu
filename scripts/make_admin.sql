-- Make a user an admin by email
-- Usage: Replace 'erenatasoy04@gmail.com' with the user's email address
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'erenatasoy04@gmail.com';

-- Verify the change
SELECT id, email, role 
FROM profiles 
WHERE email = 'erenatasoy04@gmail.com';

-- To make someone a super_admin
/*
UPDATE profiles 
SET role = 'super_admin' 
WHERE email = 'erenatasoy04@gmail.com';
*/
