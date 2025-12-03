-- Check ALL policies on user_credentials table
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_credentials';

-- Check if RLS is actually enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_credentials';

-- Try to see what the actual USING clause is
SELECT 
    tablename,
    policyname,
    roles::text,
    CASE cmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END as command,
    pg_get_expr(qual, 'user_credentials'::regclass) as using_expression,
    pg_get_expr(with_check, 'user_credentials'::regclass) as check_expression
FROM pg_policy
WHERE polrelid = 'user_credentials'::regclass;
