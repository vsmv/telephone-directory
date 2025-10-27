

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_contact_deletion"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    admin_count INTEGER;
    user_role TEXT;
BEGIN
    -- Check if this is an admin user
    SELECT role INTO user_role FROM public.user_profiles WHERE email = OLD.email;
    
    -- ABSOLUTE PROTECTION: Never allow deletion of system admin
    IF OLD.email = 'admin@actrec.gov.in' THEN
        RAISE EXCEPTION 'SYSTEM ADMIN PROTECTED: Cannot delete the system administrator account (admin@actrec.gov.in). This account is permanently protected and cannot be removed.';
    END IF;
    
    -- If deleting any admin, check if it's the last one
    IF user_role = 'admin' THEN
        SELECT COUNT(*) INTO admin_count FROM public.user_profiles WHERE role = 'admin';
        IF admin_count <= 1 THEN
            RAISE EXCEPTION 'LAST ADMIN PROTECTION: Cannot delete the last administrator. At least one admin must remain in the system.';
        END IF;
    END IF;
    
    -- Safe to delete - clean up related records in all 3 tables
    BEGIN
        DELETE FROM public.user_profiles WHERE email = OLD.email;
        DELETE FROM public.learning_plans WHERE email = OLD.email;
        DELETE FROM public.patentable_ideas WHERE email = OLD.email;
    EXCEPTION
        WHEN OTHERS THEN
            -- Continue even if cleanup fails
            NULL;
    END;
    
    RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_contact_deletion"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_contact_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- ABSOLUTE PROTECTION: Never allow email change of system admin
    IF OLD.email = 'admin@actrec.gov.in' AND NEW.email != OLD.email THEN
        RAISE EXCEPTION 'SYSTEM ADMIN PROTECTED: Cannot change email of system administrator account. This email is permanently protected.';
    END IF;
    
    -- If email changed, update all related tables
    IF OLD.email != NEW.email THEN
        BEGIN
            -- Update user_profiles table
            UPDATE public.user_profiles 
            SET email = NEW.email 
            WHERE email = OLD.email;
            
            -- Update learning_plans table
            UPDATE public.learning_plans 
            SET email = NEW.email 
            WHERE email = OLD.email;
            
            -- Update patentable_ideas table
            UPDATE public.patentable_ideas 
            SET email = NEW.email 
            WHERE email = OLD.email;
            
        EXCEPTION
            WHEN OTHERS THEN
                -- If update fails, allow contact update but log issue
                RAISE NOTICE 'Warning: Could not update all related records for email change from % to %', OLD.email, NEW.email;
        END;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_contact_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_contact"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Create user profile only if it doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE email = NEW.email) THEN
        INSERT INTO public.user_profiles (id, email, role)
        VALUES (gen_random_uuid(), NEW.email, 'regular');
    END IF;
    
    -- Create learning plans only if email column exists and records don't exist
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'learning_plans' 
            AND column_name = 'email' 
            AND table_schema = 'public'
        ) THEN
            INSERT INTO public.learning_plans (email, title, description, category, status)
            SELECT NEW.email, 'Professional Development', 'Professional development for ' || NEW.name, 'Professional', 'not-started'
            WHERE NOT EXISTS (SELECT 1 FROM public.learning_plans WHERE email = NEW.email AND title = 'Professional Development');
            
            INSERT INTO public.learning_plans (email, title, description, category, status)
            SELECT NEW.email, 'Technical Training', 'Technical training for ' || NEW.department, 'Technical', 'not-started'
            WHERE NOT EXISTS (SELECT 1 FROM public.learning_plans WHERE email = NEW.email AND title = 'Technical Training');
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            NULL;
    END;
    
    -- Create patentable ideas only if email column exists and records don't exist
    BEGIN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'patentable_ideas' 
            AND column_name = 'email' 
            AND table_schema = 'public'
        ) THEN
            INSERT INTO public.patentable_ideas (email, title, description, category, status)
            SELECT NEW.email, 'Innovation - ' || NEW.department, 'Innovation ideas for ' || NEW.department, NEW.department, 'draft'
            WHERE NOT EXISTS (SELECT 1 FROM public.patentable_ideas WHERE email = NEW.email AND title = 'Innovation - ' || NEW.department);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            NULL;
    END;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_contact"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    -- Ensure idempotent insert into user_profiles (use NEW.id from auth.users)
    INSERT INTO public.user_profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'regular')
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email
    ;

    -- Create a contact record (idempotent by email)
    INSERT INTO public.contacts (
        id,
        name,
        department,
        designation,
        phone_number,
        extension,
        email,
        location,
        institution
    ) VALUES (
        uuid_generate_v4(),
        NEW.email,
        'To be updated',
        'To be updated',
        'To be updated',
        'To be updated',
        NEW.email,
        'To be updated',
        'ACTREC'
    ) ON CONFLICT (email) DO NOTHING;

    -- Create initial learning plan (idempotent by email + title)
    INSERT INTO public.learning_plans (
        email,
        title,
        description,
        category,
        status
    ) VALUES (
        NEW.email,
        'Initial Learning Plan',
        'Default learning plan created on user registration',
        'General',
        'not-started'
    ) ON CONFLICT (email, title) DO NOTHING;

    -- Create initial patentable idea (idempotent by email + title)
    INSERT INTO public.patentable_ideas (
        email,
        title,
        description,
        category,
        status
    ) VALUES (
        NEW.email,
        'Initial Patent Idea',
        'Default patentable idea created on user registration',
        'General',
        'draft'
    ) ON CONFLICT (email, title) DO NOTHING;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_config"("setting_name" "text", "setting_value" "text", "is_local" boolean) RETURNS "text"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT set_config(setting_name, setting_value, is_local);
$$;


ALTER FUNCTION "public"."set_config"("setting_name" "text", "setting_value" "text", "is_local" boolean) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."contacts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "department" "text" NOT NULL,
    "designation" "text" NOT NULL,
    "phone_number" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "email" "text" NOT NULL,
    "location" "text" NOT NULL,
    "institution" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contacts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."learning_plans" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email" "text",
    "status" "text" DEFAULT 'not-started'::"text"
);


ALTER TABLE "public"."learning_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patentable_ideas" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email" "text",
    "status" "text" DEFAULT 'draft'::"text"
);


ALTER TABLE "public"."patentable_ideas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "text" DEFAULT 'regular'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_profiles_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'regular'::"text"])))
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_extension_email_key" UNIQUE ("extension", "email");



ALTER TABLE ONLY "public"."contacts"
    ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."learning_plans"
    ADD CONSTRAINT "learning_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patentable_ideas"
    ADD CONSTRAINT "patentable_ideas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_contacts_department" ON "public"."contacts" USING "btree" ("department");



CREATE INDEX "idx_contacts_designation" ON "public"."contacts" USING "btree" ("designation");



CREATE INDEX "idx_contacts_email" ON "public"."contacts" USING "btree" ("email");



CREATE INDEX "idx_contacts_extension" ON "public"."contacts" USING "btree" ("extension");



CREATE INDEX "idx_contacts_name" ON "public"."contacts" USING "btree" ("name");



CREATE INDEX "idx_contacts_search" ON "public"."contacts" USING "gin" ("to_tsvector"('"english"'::"regconfig", (((((("name" || ' '::"text") || "department") || ' '::"text") || "designation") || ' '::"text") || "email")));



CREATE INDEX "idx_learning_plans_category" ON "public"."learning_plans" USING "btree" ("category");



CREATE INDEX "idx_learning_plans_created_by" ON "public"."learning_plans" USING "btree" ("created_by");



CREATE INDEX "idx_learning_plans_title" ON "public"."learning_plans" USING "btree" ("title");



CREATE INDEX "idx_patentable_ideas_category" ON "public"."patentable_ideas" USING "btree" ("category");



CREATE INDEX "idx_patentable_ideas_created_by" ON "public"."patentable_ideas" USING "btree" ("created_by");



CREATE INDEX "idx_patentable_ideas_title" ON "public"."patentable_ideas" USING "btree" ("title");



CREATE OR REPLACE TRIGGER "on_contact_created" AFTER INSERT ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_contact"();



CREATE OR REPLACE TRIGGER "on_contact_deleted" BEFORE DELETE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_contact_deletion"();



CREATE OR REPLACE TRIGGER "on_contact_updated" AFTER UPDATE ON "public"."contacts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_contact_update"();



CREATE POLICY "Anon users can delete profiles" ON "public"."user_profiles" FOR DELETE TO "anon" USING (true);



CREATE POLICY "Anon users can insert profiles" ON "public"."user_profiles" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Anon users can update profiles" ON "public"."user_profiles" FOR UPDATE TO "anon" USING (true);



CREATE POLICY "Anon users can view profiles" ON "public"."user_profiles" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Authenticated users can view contacts" ON "public"."contacts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view profiles" ON "public"."user_profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Service role can do everything" ON "public"."user_profiles" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Users can delete their own learning plans" ON "public"."learning_plans" FOR DELETE USING ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can delete their own patentable ideas" ON "public"."patentable_ideas" FOR DELETE USING ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can insert their own learning plans" ON "public"."learning_plans" FOR INSERT WITH CHECK ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can insert their own patentable ideas" ON "public"."patentable_ideas" FOR INSERT WITH CHECK ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can update their own learning plans" ON "public"."learning_plans" FOR UPDATE USING ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can update their own patentable ideas" ON "public"."patentable_ideas" FOR UPDATE USING ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can view their own learning plans" ON "public"."learning_plans" FOR SELECT USING ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



CREATE POLICY "Users can view their own patentable ideas" ON "public"."patentable_ideas" FOR SELECT USING ((("email" = "current_setting"('app.current_user_email'::"text", true)) OR (EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."email" = "current_setting"('app.current_user_email'::"text", true)) AND ("user_profiles"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."learning_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patentable_ideas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_contact_deletion"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_contact_deletion"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_contact_deletion"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_contact_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_contact_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_contact_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_contact"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_contact"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_contact"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_config"("setting_name" "text", "setting_value" "text", "is_local" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."set_config"("setting_name" "text", "setting_value" "text", "is_local" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_config"("setting_name" "text", "setting_value" "text", "is_local" boolean) TO "service_role";


















GRANT ALL ON TABLE "public"."contacts" TO "anon";
GRANT ALL ON TABLE "public"."contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."contacts" TO "service_role";



GRANT ALL ON TABLE "public"."learning_plans" TO "anon";
GRANT ALL ON TABLE "public"."learning_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."learning_plans" TO "service_role";



GRANT ALL ON TABLE "public"."patentable_ideas" TO "anon";
GRANT ALL ON TABLE "public"."patentable_ideas" TO "authenticated";
GRANT ALL ON TABLE "public"."patentable_ideas" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
