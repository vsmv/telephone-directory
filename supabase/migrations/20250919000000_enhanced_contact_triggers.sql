-- Enhanced Contact Triggers for Production-Ready Record Management
-- This migration creates a comprehensive trigger system that properly integrates with Supabase Auth

-- Drop existing triggers to recreate them
DROP TRIGGER IF EXISTS on_contact_created ON public.contacts;
DROP TRIGGER IF EXISTS on_contact_deleted ON public.contacts;

-- Enhanced function to handle new contact creation
CREATE OR REPLACE FUNCTION public.handle_new_contact()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default learning plan entries for the contact
    INSERT INTO public.learning_plans (email, title, description, category, status, target_completion_date)
    VALUES 
        (NEW.email, 'Professional Development Plan', 'Comprehensive professional development roadmap for ' || NEW.name, 'Professional', 'not-started', CURRENT_DATE + INTERVAL '6 months'),
        (NEW.email, 'Technical Skills Enhancement', 'Technical skills development plan for ' || NEW.department, 'Technical', 'not-started', CURRENT_DATE + INTERVAL '3 months'),
        (NEW.email, 'Research Methodology Training', 'Research methodology and best practices training', 'Research', 'not-started', CURRENT_DATE + INTERVAL '4 months')
    ON CONFLICT (email, title) DO NOTHING;
    
    -- Create default patentable idea entries for the contact
    INSERT INTO public.patentable_ideas (email, title, description, category, status)
    VALUES 
        (NEW.email, 'Innovation Opportunity - ' || NEW.department, 'Potential innovation ideas in ' || NEW.department || ' department', NEW.department, 'draft'),
        (NEW.email, 'Process Improvement Initiative', 'Process improvement opportunities identified by ' || NEW.name, 'Process', 'draft'),
        (NEW.email, 'Research Collaboration Idea', 'Collaborative research opportunities in ' || NEW.institution, 'Research', 'draft')
    ON CONFLICT (email, title) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function to handle contact deletion with admin protection
CREATE OR REPLACE FUNCTION public.handle_contact_deleted()
RETURNS TRIGGER AS $$
DECLARE
    admin_count INTEGER;
    user_role TEXT;
BEGIN
    -- Check if this contact has a corresponding user profile and their role
    SELECT role INTO user_role FROM public.user_profiles WHERE email = OLD.email;
    
    -- If user is admin, check if they are the last admin
    IF user_role = 'admin' THEN
        SELECT COUNT(*) INTO admin_count FROM public.user_profiles WHERE role = 'admin';
        
        IF admin_count <= 1 THEN
            RAISE EXCEPTION 'Cannot delete the last administrator contact. At least one admin must remain in the system.';
        END IF;
    END IF;
    
    -- Delete corresponding user profile if it exists
    DELETE FROM public.user_profiles WHERE email = OLD.email;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile when contact is created (for demo/testing)
CREATE OR REPLACE FUNCTION public.create_user_profile_for_contact()
RETURNS TRIGGER AS $$
DECLARE
    auth_user_id UUID;
BEGIN
    -- Check if there's already a user profile for this email
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE email = NEW.email) THEN
        -- Try to find existing auth user with this email
        SELECT id INTO auth_user_id FROM auth.users WHERE email = NEW.email LIMIT 1;
        
        IF auth_user_id IS NOT NULL THEN
            -- Create user profile linked to existing auth user
            INSERT INTO public.user_profiles (id, email, role)
            VALUES (auth_user_id, NEW.email, 'regular')
            ON CONFLICT (email) DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create enhanced triggers
CREATE TRIGGER on_contact_created
    AFTER INSERT ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_contact();

CREATE TRIGGER on_contact_deleted
    BEFORE DELETE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.handle_contact_deleted();

CREATE TRIGGER on_contact_user_profile_sync
    AFTER INSERT ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.create_user_profile_for_contact();

-- Function to get system statistics
CREATE OR REPLACE FUNCTION public.get_system_statistics()
RETURNS TABLE (
    total_contacts INTEGER,
    total_user_profiles INTEGER,
    admin_users INTEGER,
    regular_users INTEGER,
    total_learning_plans INTEGER,
    total_patentable_ideas INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM public.contacts),
        (SELECT COUNT(*)::INTEGER FROM public.user_profiles),
        (SELECT COUNT(*)::INTEGER FROM public.user_profiles WHERE role = 'admin'),
        (SELECT COUNT(*)::INTEGER FROM public.user_profiles WHERE role = 'regular'),
        (SELECT COUNT(*)::INTEGER FROM public.learning_plans),
        (SELECT COUNT(*)::INTEGER FROM public.patentable_ideas);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_system_statistics() TO authenticated;