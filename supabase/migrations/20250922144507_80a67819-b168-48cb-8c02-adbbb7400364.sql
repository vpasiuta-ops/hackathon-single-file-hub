-- Generate new password hash using bcrypt with salt rounds 10
-- Password: AdminPassword123!
UPDATE admin_users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE email = 'v.pasiuta@thedigital.gov.ua';