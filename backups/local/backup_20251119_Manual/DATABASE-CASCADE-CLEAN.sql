-- 🔧 DATABASE-LEVEL CASCADE FUNCTIONS (CLEAN VERSION)
-- This implements automatic user_credentials creation at the database level

-- =====================================================
-- STEP 1: Create function to generate secure passwords
-- =====================================================

CREATE OR REPLACE FUNCTION generate_secure_password()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    password TEXT := '';
    i INTEGER;
BEGIN
    -- Generate 12 character password
    FOR i IN 1..12 LOOP
        password := password || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    RETURN password;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: Create trigger function for user_profiles
-- =====================================================

CREATE OR REPLACE FUNCTION auto_create_user_credentials()
RETURNS TRIGGER AS $$
DECLARE
    generated_password TEXT;
BEGIN
    -- Generate a secure password
    generated_password := generate_secure_password();
    
    -- Insert into user_credentials
    INSERT INTO user_credentials (email, password_hash)
    VALUES (NEW.email, generated_password)
    ON CONFLICT (email) DO NOTHING;
    
    -- Log the password (for development)
    RAISE NOTICE 'Auto-created credentials for %: password = %', NEW.email, generated_password;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 3: Create trigger on user_profiles table
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_auto_create_credentials ON user_profiles;

-- Create new trigger
CREATE TRIGGER trigger_auto_create_credentials
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_user_credentials();

-- =====================================================
-- STEP 4: Create cascade delete function
-- =====================================================

CREATE OR REPLACE FUNCTION cascade_delete_user_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete from user_credentials
    DELETE FROM user_credentials WHERE email = OLD.email;
    
    -- Delete from learning_plans
    DELETE FROM learning_plans WHERE email = OLD.email;
    
    -- Delete from patentable_ideas
    DELETE FROM patentable_ideas WHERE email = OLD.email;
    
    -- Delete from contacts
    DELETE FROM contacts WHERE email = OLD.email;
    
    RAISE NOTICE 'Cascade deleted all data for user: %', OLD.email;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 5: Create cascade delete trigger
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_cascade_delete_user ON user_profiles;

-- Create cascade delete trigger
CREATE TRIGGER trigger_cascade_delete_user
    BEFORE DELETE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION cascade_delete_user_data();

-- =====================================================
-- STEP 6: Create cascade update function for email changes
-- =====================================================

CREATE OR REPLACE FUNCTION cascade_update_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if email actually changed
    IF OLD.email != NEW.email THEN
        -- Update user_credentials
        UPDATE user_credentials 
        SET email = NEW.email, updated_at = NOW()
        WHERE email = OLD.email;
        
        -- Update learning_plans
        UPDATE learning_plans 
        SET email = NEW.email, updated_at = NOW()
        WHERE email = OLD.email;
        
        -- Update patentable_ideas
        UPDATE patentable_ideas 
        SET email = NEW.email, updated_at = NOW()
        WHERE email = OLD.email;
        
        -- Update contacts
        UPDATE contacts 
        SET email = NEW.email, updated_at = NOW()
        WHERE email = OLD.email;
        
        RAISE NOTICE 'Cascade updated email from % to %', OLD.email, NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 7: Create cascade update trigger
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_cascade_update_email ON user_profiles;

-- Create cascade update trigger
CREATE TRIGGER trigger_cascade_update_email
    AFTER UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION cascade_update_email();

-- =====================================================
-- STEP 8: Show current triggers
-- =====================================================

SELECT 'ACTIVE TRIGGERS:' as info;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('user_profiles', 'contacts')
ORDER BY event_object_table, trigger_name;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 
    '🎉 DATABASE-LEVEL CASCADE IMPLEMENTED!' as status,
    'user_credentials will be auto-created when user_profiles are inserted' as feature1,
    'All related data will be cascade deleted when user is deleted' as feature2,
    'Email changes will cascade across all tables' as 