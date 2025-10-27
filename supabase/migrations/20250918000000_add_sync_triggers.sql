-- Function to handle new contact creation
CREATE OR REPLACE FUNCTION public.handle_new_contact()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a user profile if it doesn't exist
    INSERT INTO public.user_profiles (id, email, role)
    VALUES (uuid_generate_v4(), NEW.email, 'regular')
    ON CONFLICT (email) DO NOTHING;

    -- Create empty learning plan entry
    INSERT INTO public.learning_plans (email, title, description, category, status)
    VALUES (NEW.email, 'Initial Learning Plan', 'Default learning plan created on contact creation', 'General', 'not-started');

    -- Create empty patentable idea entry
    INSERT INTO public.patentable_ideas (email, title, description, category, status)
    VALUES (NEW.email, 'Initial Patent Idea', 'Default patentable idea created on contact creation', 'General', 'draft');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for contact creation
DROP TRIGGER IF EXISTS on_contact_created ON public.contacts;
CREATE TRIGGER on_contact_created
    AFTER INSERT ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_contact();

-- Function to handle contact deletion (though CASCADE should handle this)
CREATE OR REPLACE FUNCTION public.handle_contact_deleted()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete user profile
    DELETE FROM public.user_profiles WHERE email = OLD.email;
    
    -- Delete learning plans (although this should happen automatically due to CASCADE)
    DELETE FROM public.learning_plans WHERE email = OLD.email;
    
    -- Delete patentable ideas (although this should happen automatically due to CASCADE)
    DELETE FROM public.patentable_ideas WHERE email = OLD.email;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for contact deletion
DROP TRIGGER IF EXISTS on_contact_deleted ON public.contacts;
CREATE TRIGGER on_contact_deleted
    BEFORE DELETE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.handle_contact_deleted();