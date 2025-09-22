-- Update admin password hash for bcrypt compatibility
-- Password: AdminPassword123! 
-- Generated using standard bcrypt with 12 rounds
UPDATE admin_users 
SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYlqh1L8mr1We'
WHERE email = 'v.pasiuta@thedigital.gov.ua';