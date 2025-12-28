-- Force reset a user's password to '12345678'
-- Prerequisite: pgcrypto extension must be enabled
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Usage: Replace 'erenatasoy04@gmail.com' with the target email
UPDATE auth.users 
SET encrypted_password = crypt('12345678', gen_salt('bf')) 
WHERE email = 'erenatasoy04@gmail.com';

-- Verify the update (check updated_at timestamp)
SELECT id, email, updated_at 
FROM auth.users 
WHERE email = 'erenatasoy04@gmail.com';
