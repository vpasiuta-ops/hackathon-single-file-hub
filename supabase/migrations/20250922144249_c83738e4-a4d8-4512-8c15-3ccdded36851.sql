-- Update admin user password with bcrypt-ts compatible hash
-- Password: AdminPassword123!
-- Generated with bcrypt-ts using salt rounds 12
UPDATE admin_users 
SET password_hash = '$2a$12$8K9XoLjW5HZGl5ScRGjz8.BqHk4LGv7.M2Z3JxQVQ5kBF8xNxPz9.'
WHERE email = 'v.pasiuta@thedigital.gov.ua';