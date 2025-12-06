SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '87ef597f-4b5f-40b5-92ee-d9ce8d95961b', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ravi@rediffmail.com","user_id":"e590164e-f9a8-4e6e-b854-c44f02010965","user_phone":""}}', '2025-09-09 11:45:17.617294+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b91272e9-5ce7-4de6-b97c-e670a65b9b59', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ravi@example.com","user_id":"c792396d-c1b0-4bda-83c0-598dc414bada","user_phone":""}}', '2025-09-09 11:58:42.28477+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cfdcb29-04f0-42ce-941f-fb66048c5894', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rani@example.com","user_id":"14bbbb05-831f-4e2a-bb2f-18b197f3cde2","user_phone":""}}', '2025-09-09 11:58:43.007953+00', ''),
	('00000000-0000-0000-0000-000000000000', '6905710a-7ba6-435b-a490-94f6550b98a3', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"john@example.com","user_id":"e36f5309-bee6-445c-959a-828ca2d30c75","user_phone":""}}', '2025-09-09 11:58:43.734354+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a5579db-e536-4f49-8765-b9459e641fae', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"hari@gmail.com","user_id":"6d5fbac6-949b-4bbc-88ea-8bed31910d45","user_phone":""}}', '2025-09-09 12:01:24.204808+00', ''),
	('00000000-0000-0000-0000-000000000000', '36d0f882-c6d4-4ca7-9e12-411e589d28de', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"final.verify@example.com","user_id":"b8142d1f-1294-4e4e-a7f8-0f551cd8136c","user_phone":""}}', '2025-09-09 20:53:09.089204+00', ''),
	('00000000-0000-0000-0000-000000000000', '6de6961d-f881-49b1-9042-553cdcab795c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sync.test.1757451723044@example.com","user_id":"8a764ef2-61a4-49fe-9237-05054cf9c6a3","user_phone":""}}', '2025-09-09 21:02:05.022454+00', ''),
	('00000000-0000-0000-0000-000000000000', '91ff8f33-042a-490e-b173-2bd5eb1ce51a', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"demo.user.1757451810687@example.com","user_id":"c9e1e884-9f6d-4c0e-9d9d-e94b2f531648","user_phone":""}}', '2025-09-09 21:03:34.15655+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f354e31-8dc0-4715-96be-57b9d51082f4', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"demo.user.1757451810687@example.com","user_id":"c9e1e884-9f6d-4c0e-9d9d-e94b2f531648","user_phone":""}}', '2025-09-09 21:12:51.087145+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f89044e-e209-47f9-bc1b-29373c2ce835', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sync.test.1757451723044@example.com","user_id":"8a764ef2-61a4-49fe-9237-05054cf9c6a3","user_phone":""}}', '2025-09-09 21:12:51.397822+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f7ad31b3-3801-4d4d-b8a5-0710d3c488af', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"final.verify@example.com","user_id":"b8142d1f-1294-4e4e-a7f8-0f551cd8136c","user_phone":""}}', '2025-09-09 21:12:51.705795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e42b28d3-b0d5-4835-9a77-6acea935be7e', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"hari@gmail.com","user_id":"6d5fbac6-949b-4bbc-88ea-8bed31910d45","user_phone":""}}', '2025-09-09 21:12:52.076798+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ce5c35ed-682b-4287-b42e-8db2fafdf5b0', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"john@example.com","user_id":"e36f5309-bee6-445c-959a-828ca2d30c75","user_phone":""}}', '2025-09-09 21:12:52.492628+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad074c1e-8a5e-4c2e-9e7e-ec04b1c3f16f', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rani@example.com","user_id":"14bbbb05-831f-4e2a-bb2f-18b197f3cde2","user_phone":""}}', '2025-09-09 21:12:52.846749+00', ''),
	('00000000-0000-0000-0000-000000000000', '20bb8606-98cb-4aff-9c51-ee9fd2548775', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ravi@example.com","user_id":"c792396d-c1b0-4bda-83c0-598dc414bada","user_phone":""}}', '2025-09-09 21:12:53.205951+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cbb51174-d159-4269-86ac-8888ad36c162', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ravi@rediffmail.com","user_id":"e590164e-f9a8-4e6e-b854-c44f02010965","user_phone":""}}', '2025-09-09 21:12:53.518619+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8bdf450-6cd0-4780-8fa1-fd4e8ad4aa06', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sync.test.1757452537939@example.com","user_id":"026562d8-fab1-4260-b62c-70a862e05474","user_phone":""}}', '2025-09-09 21:15:44.041554+00', ''),
	('00000000-0000-0000-0000-000000000000', '586a94b7-33e7-440c-898a-6513e9c5acf8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"direct.test.1757452578110@example.com","user_id":"adafa0f9-e4ee-47ac-ab2d-519d81264af7","user_phone":""}}', '2025-09-09 21:16:20.032156+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd6f88060-d976-4915-aa95-932c9765e4ba', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"direct.test.1757452578110@example.com","user_id":"adafa0f9-e4ee-47ac-ab2d-519d81264af7","user_phone":""}}', '2025-09-09 21:17:18.218826+00', ''),
	('00000000-0000-0000-0000-000000000000', '2628c51f-8997-4898-9ac7-7100e3dc15cd', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sync.test.1757452537939@example.com","user_id":"026562d8-fab1-4260-b62c-70a862e05474","user_phone":""}}', '2025-09-09 21:25:18.483019+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd20ba875-3137-4a3f-987a-eee5074dc1b5', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test.contact@example.com","user_id":"3d092218-64b5-4e49-a415-ffeb96a47ee2","user_phone":""}}', '2025-09-09 21:30:11.788319+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da311078-60ed-4aeb-87f8-fd222cfcf63e', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test.contact@example.com","user_id":"3d092218-64b5-4e49-a415-ffeb96a47ee2","user_phone":""}}', '2025-09-09 21:31:07.671155+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f8a80d7-789f-44f0-9a5f-f52b0ee81713', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test.contact@example.com","user_id":"7685df94-248e-4c73-941e-2223d40ae0af","user_phone":""}}', '2025-09-09 21:31:15.346488+00', ''),
	('00000000-0000-0000-0000-000000000000', '03e88114-da19-4109-84a1-dbd06fbbed23', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"trigger.test@example.com","user_id":"9887cc9b-173f-48f0-9f40-839f496616eb","user_phone":""}}', '2025-09-09 21:31:52.980383+00', ''),
	('00000000-0000-0000-0000-000000000000', '0a7d765a-7318-4169-b906-153f0f3cde43', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"trigger.test@example.com","user_id":"9887cc9b-173f-48f0-9f40-839f496616eb","user_phone":""}}', '2025-09-09 21:31:53.57375+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7b36fb6-4e41-41d2-afe3-49162c953219', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"trigger.test@example.com","user_id":"e83dbf0d-cc22-4af3-8f5f-7f92337fd97a","user_phone":""}}', '2025-09-09 21:32:29.182979+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0f0dd17-2ab9-46c4-9492-cc7186c1bb71', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"trigger.test@example.com","user_id":"e83dbf0d-cc22-4af3-8f5f-7f92337fd97a","user_phone":""}}', '2025-09-09 21:33:15.99137+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f8bbc2c-2cfd-4f49-bc28-48202c5d14db', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test.contact@example.com","user_id":"7685df94-248e-4c73-941e-2223d40ae0af","user_phone":""}}', '2025-09-09 21:33:16.355058+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3d8f537-d2e6-4aca-a91f-07cc91ceae9e', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test.contact@example.com","user_id":"8224fd5f-bc04-4c95-b895-60546052d5a9","user_phone":""}}', '2025-09-09 21:33:24.170679+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2838c14-0c8f-4ee3-a179-d4de5d4c38ed', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"workflow.demo@example.com","user_id":"eacac3ed-c916-49a1-9aad-463495073905","user_phone":""}}', '2025-09-09 21:34:03.198484+00', ''),
	('00000000-0000-0000-0000-000000000000', '25050336-f1e5-4ca7-abe2-2febdbeb4695', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"workflow.demo@example.com","user_id":"eacac3ed-c916-49a1-9aad-463495073905","user_phone":""}}', '2025-09-09 21:34:08.363606+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b5723fb5-1157-4f12-a941-ad00e3ba15cc', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"test.contact@example.com","user_id":"8224fd5f-bc04-4c95-b895-60546052d5a9","user_phone":""}}', '2025-09-09 21:34:25.286672+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a5e33d6c-7f92-4c5e-90d3-edcd499e7e87', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test@example.com","user_id":"a27d996c-2ea0-4740-9058-19df939116c3","user_phone":""}}', '2025-09-12 06:44:14.124634+00', ''),
	('00000000-0000-0000-0000-000000000000', '24022c52-1069-4f3c-a99d-a524a4b3789b', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test2@example.com","user_id":"e77e144b-b773-4290-89f2-379b7203d9d2","user_phone":""}}', '2025-09-12 06:45:51.307296+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c15ec784-9d5c-49af-bb8b-64f5661454aa', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"pragati@actrec.gov.in","user_id":"97e26d3e-d918-40fa-a808-c62ac7906461","user_phone":""}}', '2025-09-12 08:30:36.629609+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c5371a9-4a76-497e-9265-0191168c5041', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"priya.sharma@actrec.gov.in","user_id":"2aa6b231-a669-44de-ba19-bfc71ca5eb22","user_phone":""}}', '2025-09-12 08:30:38.939889+00', ''),
	('00000000-0000-0000-0000-000000000000', '2b348232-ff67-41db-aac5-3a0e579d2c90', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"prashant.bhat@actrec.gov.in","user_id":"f051c7fc-1ba4-4241-add1-87fc2b1131b2","user_phone":""}}', '2025-09-12 08:30:40.682495+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e8647c6e-abb3-4b0d-b0c2-8725f29eafb1', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"rajesh.kumar@actrec.gov.in","user_id":"9beb7c52-995f-49a5-9e41-0b35625c8981","user_phone":""}}', '2025-09-12 08:30:42.931084+00', ''),
	('00000000-0000-0000-0000-000000000000', '1bac8c9e-599b-4bd6-9fb9-c9e5732cc0d7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"anita.desai@actrec.gov.in","user_id":"652d4b52-6c25-49d3-9787-21869a69d3d4","user_phone":""}}', '2025-09-12 08:30:44.6427+00', ''),
	('00000000-0000-0000-0000-000000000000', '694e623a-3554-4a40-a0d7-16435d430df7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test.user@actrec.gov.in","user_id":"6e6f262d-1d00-427f-873d-6cf45b63f57f","user_phone":""}}', '2025-09-12 10:37:49.808126+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f67695f9-f663-4ac2-8c28-9e99ac7d88a2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"trigger.test2@actrec.gov.in","user_id":"23f6c5e3-2dce-4efb-b540-95091fff4529","user_phone":""}}', '2025-09-12 10:39:47.15826+00', ''),
	('00000000-0000-0000-0000-000000000000', '26facb01-3a4b-49e1-b260-5ed807bf9b17', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sync-test@example.com","user_id":"94e627ca-9463-4c7f-8435-d8cbaf5b26be","user_phone":""}}', '2025-09-12 18:11:39.293186+00', ''),
	('00000000-0000-0000-0000-000000000000', '350a8aa3-ca03-4c7f-8384-c8c1423e7115', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sync-test-fresh@example.com","user_id":"ace68ca1-c6a2-41e5-bb30-ed5916ef4e04","user_phone":""}}', '2025-09-12 18:13:59.787405+00', ''),
	('00000000-0000-0000-0000-000000000000', '7496acc5-7163-4298-89f7-b2649aacfd92', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test-sync-fix-bulk-1@example.com","user_id":"fb4907fc-5ffb-44fb-b1af-4506849a3c3e","user_phone":""}}', '2025-09-12 18:33:34.581844+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5fe8841-545a-47d4-bbb4-afb47ae0ea74', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"test-sync-fix-bulk-2@example.com","user_id":"1922f5bc-9849-4e04-a521-9251e59c1033","user_phone":""}}', '2025-09-12 18:33:35.950673+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e9aa93f-5bb7-4e28-9b3e-5cac6f52f8eb', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"test-sync-fix-bulk-1@example.com","user_id":"fb4907fc-5ffb-44fb-b1af-4506849a3c3e","user_phone":""}}', '2025-09-12 18:41:56.99084+00', ''),
	('00000000-0000-0000-0000-000000000000', '57fe4684-e256-4f1c-aded-daf5ec1bf85e', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ravi@gmail.com","user_id":"53456ad6-9dfb-43c0-b437-c542b2222fca","user_phone":""}}', '2025-09-12 19:06:12.542541+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c05cc71-ff3f-428e-a0fc-581a24ecc110', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"simple-sync-test@example.com","user_id":"624955ba-82cf-4b49-b328-aa3db142ed62","user_phone":""}}', '2025-09-12 19:19:28.825014+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a888a776-5c8a-4497-9867-ac9c14caef25', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"simple-sync-test@example.com","user_id":"624955ba-82cf-4b49-b328-aa3db142ed62","user_phone":""}}', '2025-09-12 19:19:29.62198+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e093ee31-f299-4678-bd96-a76557f5c8ac', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"direct-test@example.com","user_id":"ae202854-0aed-41dc-8498-f53794d31ce6","user_phone":""}}', '2025-09-12 19:25:18.33654+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c419efb1-e5a6-4e23-ba68-7ae6d942e9f5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"direct-test@example.com","user_id":"ae202854-0aed-41dc-8498-f53794d31ce6","user_phone":""}}', '2025-09-12 19:25:19.176083+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e66d1cd-e209-4ecf-b8a1-6ef732f912f3', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"auth-trigger-test@example.com","user_id":"34ed23fc-96c3-43e6-b717-99f7a2383f45","user_phone":""}}', '2025-09-12 19:26:37.998146+00', ''),
	('00000000-0000-0000-0000-000000000000', '62334d2f-9b5d-417f-b498-be909ecdabf5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"auth-trigger-test@example.com","user_id":"34ed23fc-96c3-43e6-b717-99f7a2383f45","user_phone":""}}', '2025-09-12 19:26:42.253341+00', ''),
	('00000000-0000-0000-0000-000000000000', '8db19cb1-7ffb-4aa8-bdfa-f04f7618cf40', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"direct-test@example.com","user_id":"e175afc3-2818-454f-a88d-6cf160675941","user_phone":""}}', '2025-09-12 19:27:39.647416+00', ''),
	('00000000-0000-0000-0000-000000000000', '2199e12c-96cf-407b-af3e-a5a69ddedcaa', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"direct-test@example.com","user_id":"e175afc3-2818-454f-a88d-6cf160675941","user_phone":""}}', '2025-09-12 19:27:40.477106+00', ''),
	('00000000-0000-0000-0000-000000000000', '881ebd09-c415-4bc5-9f0e-54e62e93d9c7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"updated-test@example.com","user_id":"dc297d8e-7304-4ffd-bdaa-8fd55774a2a3","user_phone":""}}', '2025-09-12 19:28:05.379741+00', ''),
	('00000000-0000-0000-0000-000000000000', '09b34bcf-3412-4d24-89b7-9a342bbecf48', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"service-test-single@example.com","user_id":"4d0b7151-1365-4160-8416-e90a54bb0ecb","user_phone":""}}', '2025-09-12 19:29:20.348989+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ecd28e1-ed7b-4a24-9474-4f84c920f186', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"service-test-bulk-1@example.com","user_id":"157c98fb-4769-4694-a86c-9e52d6d0548b","user_phone":""}}', '2025-09-12 19:29:24.154657+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa055bd0-eee2-463a-9550-aeb1f68a77d2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"service-test-bulk-2@example.com","user_id":"eefd6db4-6987-46d1-a7c8-0eaa67cc4779","user_phone":""}}', '2025-09-12 19:29:26.982308+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e74fd2e0-cbac-4b06-b331-7720484de5e7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"workflow-test-direct@example.com","user_id":"e289395b-24ba-4e23-9cd1-b86f9a4bef87","user_phone":""}}', '2025-09-12 19:30:58.193523+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c16b354-6c52-481c-aa84-09123013dd51', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"demo-test-single@example.com","user_id":"1ed44f75-252d-4bd4-849d-3133d88ff130","user_phone":""}}', '2025-09-12 19:32:20.793497+00', ''),
	('00000000-0000-0000-0000-000000000000', '9867fc5b-5ef1-4f73-8321-62fb7c8a5061', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"demo-test-bulk-1@example.com","user_id":"89ddf7b2-abb6-4da8-9def-b59da2f3d68d","user_phone":""}}', '2025-09-12 19:32:24.691636+00', ''),
	('00000000-0000-0000-0000-000000000000', '4abf6ee6-6de3-4e6d-9d98-cfaf32dfdc26', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"demo-test-bulk-2@example.com","user_id":"dcc90069-2586-40e2-bd4d-3a25b3c19004","user_phone":""}}', '2025-09-12 19:32:27.504366+00', ''),
	('00000000-0000-0000-0000-000000000000', '97587b60-32a0-4638-b8b2-22885b04c6fe', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"demo-test-delete@example.com","user_id":"29d7f10a-5934-404a-8444-3ab31a750c5d","user_phone":""}}', '2025-09-12 19:32:31.363428+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'ace68ca1-c6a2-41e5-bb30-ed5916ef4e04', 'authenticated', 'authenticated', 'sync-test-fresh@example.com', '$2a$10$D7spd7BZtL3chl3Nhrt8yOe4dO6F2X8caeFEhJdzBndMuvyAldmNG', '2025-09-12 18:13:59.795571+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 18:13:59.77178+00', '2025-09-12 18:13:59.798475+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a27d996c-2ea0-4740-9058-19df939116c3', 'authenticated', 'authenticated', 'test@example.com', '$2a$10$tS2rZql4eXuRPs8fezSPPe4NlPsgS8Vd7O19ZIkdzm6SFzvhVSwn2', '2025-09-12 06:44:14.147244+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 06:44:14.075198+00', '2025-09-12 06:44:14.150779+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '652d4b52-6c25-49d3-9787-21869a69d3d4', 'authenticated', 'authenticated', 'anita.desai@actrec.gov.in', '$2a$10$GNf3PQh0mebVJVd5H1kDQupltvev9JKIrqA8wVi6GT7qTG7i38US.', '2025-09-12 08:30:44.643804+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 08:30:44.639902+00', '2025-09-12 08:30:44.645822+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e77e144b-b773-4290-89f2-379b7203d9d2', 'authenticated', 'authenticated', 'test2@example.com', '$2a$10$w0RpFqa5ZzRqvouN8rWZneCwNVJSRBTW4oEScd3HfqUydxYog4bjS', '2025-09-12 06:45:51.310212+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 06:45:51.297943+00', '2025-09-12 06:45:51.312942+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '97e26d3e-d918-40fa-a808-c62ac7906461', 'authenticated', 'authenticated', 'pragati@actrec.gov.in', '$2a$10$DZt7QtkcfdqwiQwI/yxWsumVUl1JyRULBr4kUZF41ClBzjNS8Ykj.', '2025-09-12 08:30:36.63999+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 08:30:36.59621+00', '2025-09-12 08:30:36.645865+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6e6f262d-1d00-427f-873d-6cf45b63f57f', 'authenticated', 'authenticated', 'test.user@actrec.gov.in', '$2a$10$4yVuhkKPneCcXq2/o3sxfOT72n/h4DDFsSrhGm1p5W.x4/g23xc3S', '2025-09-12 10:37:49.814251+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 10:37:49.77071+00', '2025-09-12 10:37:49.817663+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '2aa6b231-a669-44de-ba19-bfc71ca5eb22', 'authenticated', 'authenticated', 'priya.sharma@actrec.gov.in', '$2a$10$rCsq/arp1c6LENI1QsPq1u1bihHTTne.DTNbuFq.qQh3I3PJgNt2e', '2025-09-12 08:30:38.94285+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 08:30:38.937787+00', '2025-09-12 08:30:38.943551+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '53456ad6-9dfb-43c0-b437-c542b2222fca', 'authenticated', 'authenticated', 'ravi@gmail.com', '$2a$10$HE5JnWP/AJ0sUPb09S.Tweu/EeK/SAw7Wk3GCb4LLCrcMYEWJv.kC', '2025-09-12 19:06:12.555901+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:06:12.502538+00', '2025-09-12 19:06:12.556853+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f051c7fc-1ba4-4241-add1-87fc2b1131b2', 'authenticated', 'authenticated', 'prashant.bhat@actrec.gov.in', '$2a$10$NtmCKJj4cCUPB6mLMkNDlOXYJxH8a1OY9ltT1RR.q6Ux2RhHEPj3q', '2025-09-12 08:30:40.684861+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 08:30:40.680368+00', '2025-09-12 08:30:40.68801+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '23f6c5e3-2dce-4efb-b540-95091fff4529', 'authenticated', 'authenticated', 'trigger.test2@actrec.gov.in', '$2a$10$X9E5Mc7cqtMvZCCAgKIU8OXXaK5nMlcJnxymT/ZnZ9T1KolXbe0vq', '2025-09-12 10:39:47.159907+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 10:39:47.153387+00', '2025-09-12 10:39:47.164721+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9beb7c52-995f-49a5-9e41-0b35625c8981', 'authenticated', 'authenticated', 'rajesh.kumar@actrec.gov.in', '$2a$10$mxD4EYfORemlfh25c1tAten5pc0DfpavO4VCMrin8xAcbZMKq1mUC', '2025-09-12 08:30:42.932171+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 08:30:42.926486+00', '2025-09-12 08:30:42.932869+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '94e627ca-9463-4c7f-8435-d8cbaf5b26be', 'authenticated', 'authenticated', 'sync-test@example.com', '$2a$10$JYsorNkUhNZun3kPKjOFVuDeT07IZGl.drGnj6eeNuO/JHj19TOde', '2025-09-12 18:11:39.298704+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 18:11:39.278876+00', '2025-09-12 18:11:39.304117+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '4d0b7151-1365-4160-8416-e90a54bb0ecb', 'authenticated', 'authenticated', 'service-test-single@example.com', '$2a$10$fpMCNUf5zhKYnsqCPhKc0eKbeNrCtzV5OzcmXGCUNnYN2s6RCM6Yq', '2025-09-12 19:29:20.350507+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:29:20.344317+00', '2025-09-12 19:29:20.351874+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1922f5bc-9849-4e04-a521-9251e59c1033', 'authenticated', 'authenticated', 'test-sync-fix-bulk-2@example.com', '$2a$10$COKN5XsjK0b8m3JnYliAzOd8rWgkvsuAPodknZqVifKFL0bzgZrPa', '2025-09-12 18:33:35.954214+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 18:33:35.947234+00', '2025-09-12 18:33:35.955626+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'fb4907fc-5ffb-44fb-b1af-4506849a3c3e', 'authenticated', 'authenticated', 'test-sync-fix-bulk-1@example.com', '$2a$10$eexp7vx0O7cmbWlBEkx6fuEMUSjHn8RgCeYOevpHpZGorUltZRpdi', '2025-09-12 18:33:34.594959+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 18:33:34.540791+00', '2025-09-12 18:41:56.972799+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e289395b-24ba-4e23-9cd1-b86f9a4bef87', 'authenticated', 'authenticated', 'workflow-test-direct@example.com', '$2a$10$b1ukbvat4vBz8kU1KtbfT.WWht0xjvWKUUUq8O8U7JqUDqlK/BvKC', '2025-09-12 19:30:58.19691+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:30:58.180417+00', '2025-09-12 19:30:58.198546+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'dc297d8e-7304-4ffd-bdaa-8fd55774a2a3', 'authenticated', 'authenticated', 'updated-test@example.com', '$2a$10$zkFoIrI/x0re1/dRNPOh9e6PKraE2b6Ue5kyq6xE2xGsiDF1k6l3e', '2025-09-12 19:28:05.382055+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:28:05.376223+00', '2025-09-12 19:28:05.382749+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'eefd6db4-6987-46d1-a7c8-0eaa67cc4779', 'authenticated', 'authenticated', 'service-test-bulk-2@example.com', '$2a$10$OszRkkJzhMqpNHz69VK1dehDHhP36FvgzZy.Avp2sslxE8xZH5ocW', '2025-09-12 19:29:26.983697+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:29:26.978961+00', '2025-09-12 19:29:26.985093+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '157c98fb-4769-4694-a86c-9e52d6d0548b', 'authenticated', 'authenticated', 'service-test-bulk-1@example.com', '$2a$10$VHNMovfth/125oPS1ZGkaujh4d7CSV.Rdgofz.GlRj/1j6kH5Klo.', '2025-09-12 19:29:24.156371+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:29:24.151429+00', '2025-09-12 19:29:24.157583+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1ed44f75-252d-4bd4-849d-3133d88ff130', 'authenticated', 'authenticated', 'demo-test-single@example.com', '$2a$10$mnoOrwao2JO1kXC2xlyqheF5uqLINabss/oiUgZiMPa92o.z53tiK', '2025-09-12 19:32:20.794969+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:32:20.789401+00', '2025-09-12 19:32:20.795869+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '89ddf7b2-abb6-4da8-9def-b59da2f3d68d', 'authenticated', 'authenticated', 'demo-test-bulk-1@example.com', '$2a$10$WQKFV5Mbg6QyaakXK.9XWOp5HSOeOakSEFmSx4jnBgphwnEcmswPK', '2025-09-12 19:32:24.692713+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:32:24.689496+00', '2025-09-12 19:32:24.693457+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'dcc90069-2586-40e2-bd4d-3a25b3c19004', 'authenticated', 'authenticated', 'demo-test-bulk-2@example.com', '$2a$10$04khMjt82HOeoJf7WZV8h.jPIkSmvKIbu4AbuA4c6dzC7bSzTV.eG', '2025-09-12 19:32:27.51009+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:32:27.502159+00', '2025-09-12 19:32:27.510885+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '29d7f10a-5934-404a-8444-3ab31a750c5d', 'authenticated', 'authenticated', 'demo-test-delete@example.com', '$2a$10$TuXRtOJg3bgkYRh9nKUlde0vP10m0H4gF1lM8R/dA2lZ7j8wjmyHm', '2025-09-12 19:32:31.364436+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-09-12 19:32:31.360637+00', '2025-09-12 19:32:31.365175+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a27d996c-2ea0-4740-9058-19df939116c3', 'a27d996c-2ea0-4740-9058-19df939116c3', '{"sub": "a27d996c-2ea0-4740-9058-19df939116c3", "email": "test@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 06:44:14.113288+00', '2025-09-12 06:44:14.113354+00', '2025-09-12 06:44:14.113354+00', 'e4b53441-9a93-4a85-a07c-44dc1186dba5'),
	('e77e144b-b773-4290-89f2-379b7203d9d2', 'e77e144b-b773-4290-89f2-379b7203d9d2', '{"sub": "e77e144b-b773-4290-89f2-379b7203d9d2", "email": "test2@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 06:45:51.30509+00', '2025-09-12 06:45:51.305164+00', '2025-09-12 06:45:51.305164+00', '0bdf01dc-906a-46d7-ac5a-611bc5cac734'),
	('97e26d3e-d918-40fa-a808-c62ac7906461', '97e26d3e-d918-40fa-a808-c62ac7906461', '{"sub": "97e26d3e-d918-40fa-a808-c62ac7906461", "email": "pragati@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 08:30:36.622471+00', '2025-09-12 08:30:36.62253+00', '2025-09-12 08:30:36.62253+00', '9fb729b1-49e4-4d23-9cf2-8603fe7a0bba'),
	('2aa6b231-a669-44de-ba19-bfc71ca5eb22', '2aa6b231-a669-44de-ba19-bfc71ca5eb22', '{"sub": "2aa6b231-a669-44de-ba19-bfc71ca5eb22", "email": "priya.sharma@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 08:30:38.93907+00', '2025-09-12 08:30:38.939123+00', '2025-09-12 08:30:38.939123+00', '7bab3081-e77e-4da3-a20e-ed2a12801bad'),
	('f051c7fc-1ba4-4241-add1-87fc2b1131b2', 'f051c7fc-1ba4-4241-add1-87fc2b1131b2', '{"sub": "f051c7fc-1ba4-4241-add1-87fc2b1131b2", "email": "prashant.bhat@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 08:30:40.681666+00', '2025-09-12 08:30:40.681715+00', '2025-09-12 08:30:40.681715+00', '4002f7b8-d625-41fb-ac7d-a60ba8af5fad'),
	('9beb7c52-995f-49a5-9e41-0b35625c8981', '9beb7c52-995f-49a5-9e41-0b35625c8981', '{"sub": "9beb7c52-995f-49a5-9e41-0b35625c8981", "email": "rajesh.kumar@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 08:30:42.928466+00', '2025-09-12 08:30:42.929618+00', '2025-09-12 08:30:42.929618+00', 'c7b38eb1-abec-420e-b6c6-9d0a51d94eac'),
	('652d4b52-6c25-49d3-9787-21869a69d3d4', '652d4b52-6c25-49d3-9787-21869a69d3d4', '{"sub": "652d4b52-6c25-49d3-9787-21869a69d3d4", "email": "anita.desai@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 08:30:44.641819+00', '2025-09-12 08:30:44.641871+00', '2025-09-12 08:30:44.641871+00', '4401ad20-0cb4-4b27-80b2-5750ef1f6cf7'),
	('6e6f262d-1d00-427f-873d-6cf45b63f57f', '6e6f262d-1d00-427f-873d-6cf45b63f57f', '{"sub": "6e6f262d-1d00-427f-873d-6cf45b63f57f", "email": "test.user@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 10:37:49.803323+00', '2025-09-12 10:37:49.804014+00', '2025-09-12 10:37:49.804014+00', 'dffde3d6-32af-4c50-898a-b7110a159d5c'),
	('23f6c5e3-2dce-4efb-b540-95091fff4529', '23f6c5e3-2dce-4efb-b540-95091fff4529', '{"sub": "23f6c5e3-2dce-4efb-b540-95091fff4529", "email": "trigger.test2@actrec.gov.in", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 10:39:47.156462+00', '2025-09-12 10:39:47.156519+00', '2025-09-12 10:39:47.156519+00', '752147fe-eb4f-4392-a7d1-5645709dba87'),
	('94e627ca-9463-4c7f-8435-d8cbaf5b26be', '94e627ca-9463-4c7f-8435-d8cbaf5b26be', '{"sub": "94e627ca-9463-4c7f-8435-d8cbaf5b26be", "email": "sync-test@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 18:11:39.2914+00', '2025-09-12 18:11:39.291463+00', '2025-09-12 18:11:39.291463+00', '3147a87e-f965-486b-97b9-065fce28b166'),
	('ace68ca1-c6a2-41e5-bb30-ed5916ef4e04', 'ace68ca1-c6a2-41e5-bb30-ed5916ef4e04', '{"sub": "ace68ca1-c6a2-41e5-bb30-ed5916ef4e04", "email": "sync-test-fresh@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 18:13:59.784522+00', '2025-09-12 18:13:59.784581+00', '2025-09-12 18:13:59.784581+00', 'a15c489c-15db-402c-a14e-6e4e60b04ca6'),
	('fb4907fc-5ffb-44fb-b1af-4506849a3c3e', 'fb4907fc-5ffb-44fb-b1af-4506849a3c3e', '{"sub": "fb4907fc-5ffb-44fb-b1af-4506849a3c3e", "email": "test-sync-fix-bulk-1@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 18:33:34.575789+00', '2025-09-12 18:33:34.576521+00', '2025-09-12 18:33:34.576521+00', 'fcb3a3f3-656a-4954-8da0-e525bb05ab65'),
	('1922f5bc-9849-4e04-a521-9251e59c1033', '1922f5bc-9849-4e04-a521-9251e59c1033', '{"sub": "1922f5bc-9849-4e04-a521-9251e59c1033", "email": "test-sync-fix-bulk-2@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 18:33:35.949783+00', '2025-09-12 18:33:35.949837+00', '2025-09-12 18:33:35.949837+00', '202741c4-f6f1-4144-bd67-3e1efdb96b94'),
	('53456ad6-9dfb-43c0-b437-c542b2222fca', '53456ad6-9dfb-43c0-b437-c542b2222fca', '{"sub": "53456ad6-9dfb-43c0-b437-c542b2222fca", "email": "ravi@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:06:12.531507+00', '2025-09-12 19:06:12.531574+00', '2025-09-12 19:06:12.531574+00', 'abea0ccf-e7e8-4c42-b607-7ae2e7cc18d5'),
	('dc297d8e-7304-4ffd-bdaa-8fd55774a2a3', 'dc297d8e-7304-4ffd-bdaa-8fd55774a2a3', '{"sub": "dc297d8e-7304-4ffd-bdaa-8fd55774a2a3", "email": "updated-test@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:28:05.377601+00', '2025-09-12 19:28:05.377661+00', '2025-09-12 19:28:05.377661+00', 'ac1365b6-dca9-4cf5-bb53-4ef672cb6f55'),
	('4d0b7151-1365-4160-8416-e90a54bb0ecb', '4d0b7151-1365-4160-8416-e90a54bb0ecb', '{"sub": "4d0b7151-1365-4160-8416-e90a54bb0ecb", "email": "service-test-single@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:29:20.347427+00', '2025-09-12 19:29:20.34749+00', '2025-09-12 19:29:20.34749+00', '25ef52d7-a2ea-489c-bec3-6f2a2d65cad2'),
	('157c98fb-4769-4694-a86c-9e52d6d0548b', '157c98fb-4769-4694-a86c-9e52d6d0548b', '{"sub": "157c98fb-4769-4694-a86c-9e52d6d0548b", "email": "service-test-bulk-1@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:29:24.153377+00', '2025-09-12 19:29:24.153426+00', '2025-09-12 19:29:24.153426+00', 'ef68a88c-b017-4402-ae7c-54e08fd1cbe5'),
	('eefd6db4-6987-46d1-a7c8-0eaa67cc4779', 'eefd6db4-6987-46d1-a7c8-0eaa67cc4779', '{"sub": "eefd6db4-6987-46d1-a7c8-0eaa67cc4779", "email": "service-test-bulk-2@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:29:26.980848+00', '2025-09-12 19:29:26.980898+00', '2025-09-12 19:29:26.980898+00', 'd2f95524-33fa-494c-99bd-8231903c1b9c'),
	('e289395b-24ba-4e23-9cd1-b86f9a4bef87', 'e289395b-24ba-4e23-9cd1-b86f9a4bef87', '{"sub": "e289395b-24ba-4e23-9cd1-b86f9a4bef87", "email": "workflow-test-direct@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:30:58.19243+00', '2025-09-12 19:30:58.19249+00', '2025-09-12 19:30:58.19249+00', '94e25f43-e52d-4e54-86ba-77bcfaada4b8'),
	('1ed44f75-252d-4bd4-849d-3133d88ff130', '1ed44f75-252d-4bd4-849d-3133d88ff130', '{"sub": "1ed44f75-252d-4bd4-849d-3133d88ff130", "email": "demo-test-single@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:32:20.791809+00', '2025-09-12 19:32:20.791862+00', '2025-09-12 19:32:20.791862+00', '4510d850-7844-4b4e-b1ee-195458d0c508'),
	('89ddf7b2-abb6-4da8-9def-b59da2f3d68d', '89ddf7b2-abb6-4da8-9def-b59da2f3d68d', '{"sub": "89ddf7b2-abb6-4da8-9def-b59da2f3d68d", "email": "demo-test-bulk-1@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:32:24.690803+00', '2025-09-12 19:32:24.690858+00', '2025-09-12 19:32:24.690858+00', '217305b7-c04c-4f9e-8f5e-e0dfa6e5bc6a'),
	('dcc90069-2586-40e2-bd4d-3a25b3c19004', 'dcc90069-2586-40e2-bd4d-3a25b3c19004', '{"sub": "dcc90069-2586-40e2-bd4d-3a25b3c19004", "email": "demo-test-bulk-2@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:32:27.503486+00', '2025-09-12 19:32:27.503547+00', '2025-09-12 19:32:27.503547+00', '3a378c3e-e111-4693-a5a6-67f9caa4beff'),
	('29d7f10a-5934-404a-8444-3ab31a750c5d', '29d7f10a-5934-404a-8444-3ab31a750c5d', '{"sub": "29d7f10a-5934-404a-8444-3ab31a750c5d", "email": "demo-test-delete@example.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-12 19:32:31.362571+00', '2025-09-12 19:32:31.36262+00', '2025-09-12 19:32:31.36262+00', '377a224d-f60c-43eb-ba1d-d8cbdaa645e3');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."contacts" ("id", "name", "department", "designation", "phone_number", "extension", "email", "location", "institution", "created_at", "updated_at") VALUES
	('9ac4ddcb-05ea-438b-80e6-f1daf40eb201', 'Jeyarish', 'Bioinformatics', 'IT Department', '9481519832', '5601', 'jeyarish.venki@gmail.com', 'Kharghar', 'ARCTEC', '2025-12-03 16:55:42.469788+00', '2025-12-03 16:55:42.469788+00'),
	('7dd07983-39f8-46ae-b58a-c664b8bb516e', 'Venkatesh Gopalan', 'IT DEPARTMENT', 'SERVER MAINTENANCE', '8431515002', '5090', 'vsmv1@rediffmail.com', 'Parel', 'TMC', '2025-12-03 18:03:56.83486+00', '2025-12-04 11:31:55.814+00'),
	('8c6fcd05-be85-4bc9-bc7e-019204f3695d', 'Dr.Giridhar', 'Oncology Department', 'Chief Doctor', '8585858585', '6908', 'giri@rediffmail.com', 'Parel', 'ARCTEC', '2025-12-04 11:31:20.387029+00', '2025-12-04 11:31:54.911+00'),
	('67a2c86f-43ac-4766-bbb7-07335c3aa8d1', 'Dr. Demo Test', 'Research', 'Scientist', '', '5700', 'demo.test@actrec.gov.in', 'Sixth Floor', 'ACTREC', '2025-12-04 11:32:46.075335+00', '2025-12-04 11:32:46.075335+00'),
	('e65e8043-5e5f-4cb7-896f-357d530878fb', 'John Doe', 'IT Department', 'Senior Developer', '', '101', 'john.doe@actrec.gov.in', 'Mumbai', 'ACTREC', '2025-12-04 11:32:46.109982+00', '2025-12-04 11:32:46.109982+00'),
	('2f33a993-aa55-48ff-94de-98509b28700a', 'Mary Kom', 'Human Resources', 'HR Head', '', '301', 'mary.kom@actrec.gov.in', 'Admin Block', 'ACTREC', '2025-12-04 11:32:46.149499+00', '2025-12-04 11:32:46.149499+00'),
	('1ebbeb69-f9d9-49f3-bcc2-b709d2382332', 'Peter Jones', 'Medical Physics', 'Physicist', '', '201', 'peter.jones@actrec.gov.in', 'Second Floor', 'ACTREC', '2025-12-04 11:32:46.159496+00', '2025-12-04 11:32:46.159496+00'),
	('40beeeff-24bc-4662-baa4-6baf16325c4b', 'Jane Smith', 'Administration', 'Office Manager', '', '102', 'jane.smith@actrec.gov.in', 'Navi Mumbai', 'ACTREC', '2025-12-04 11:32:46.351241+00', '2025-12-04 11:32:46.351241+00');


--
-- Data for Name: learning_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."learning_plans" ("id", "title", "description", "category", "created_by", "created_at", "updated_at", "email", "status", "target_completion_date") VALUES
	('42fa3748-fab6-4f3d-bd5c-6b5a7f098996', 'test', 'Test desc', 'Clinical Training', NULL, '2025-12-03 16:56:41.205085+00', '2025-12-03 16:56:41.205085+00', 'jeyarish.venki@gmail.com', 'not-started', NULL),
	('3d22dc52-654e-4f43-b18d-cf7b8a70685d', 'Enhancing Tumour treatment using AI ', 'AI and disease management shall be integrated', 'Laboratory Skills', NULL, '2025-12-03 18:07:09.495318+00', '2025-12-03 18:07:09.495318+00', 'jeyarish.venki@gmail.com', 'in-progress', NULL),
	('eba60795-ca5c-487b-88f1-25dab8cc5375', 'Yoga Therapy', 'Using Yoga for post surgery Quick Healing', 'Other', NULL, '2025-12-04 11:36:14.540402+00', '2025-12-04 11:36:14.540402+00', 'jeyarish.venki@gmail.com', 'not-started', NULL);


--
-- Data for Name: patentable_ideas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."patentable_ideas" ("id", "title", "description", "category", "created_by", "created_at", "updated_at", "email", "status") VALUES
	('da857817-eb77-4e10-84ce-7bf7a7e2ae30', 'Breast Cancer Detection', 'Using blood sample - preRNA ', 'Diagnostic Tool', NULL, '2025-12-04 11:34:51.19778+00', '2025-12-04 11:34:51.19778+00', 'jeyarish.venki@gmail.com', 'draft'),
	('08398ab7-72a9-4e5d-90c1-6eb53722e35f', 'Diagnosis of Lung Cancer using Radiology X rays', 'Lung Cancer using Radiology X rays and scans', 'Diagnostic Tool', NULL, '2025-12-03 18:08:18.234472+00', '2025-12-03 18:08:18.234472+00', 'jeyarish.venki@gmail.com', 'under-review');


--
-- Data for Name: user_credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_credentials" ("id", "email", "password", "created_at", "updated_at") VALUES
	(99, 'jeyarish.venki@gmail.com', 'Welcome123$', '2025-12-03 16:55:42.469788', '2025-12-03 17:38:25.150864'),
	(106, 'vsmv1@rediffmail.com', 'Z9tD8qajuckp', '2025-12-03 18:03:56.83486', '2025-12-03 18:05:17.05267'),
	(116, 'john.doe@actrec.gov.in', '7BHtnndIKYAg', '2025-12-04 11:32:46.109982', '2025-12-04 11:32:46.109982'),
	(117, 'mary.kom@actrec.gov.in', '*F3VzvIy!YSC', '2025-12-04 11:32:46.149499', '2025-12-04 11:32:46.149499'),
	(118, 'peter.jones@actrec.gov.in', 'UD7lRgZ5A*!u', '2025-12-04 11:32:46.159496', '2025-12-04 11:32:46.159496'),
	(119, 'jane.smith@actrec.gov.in', '1u8hyZjJ&Rw1', '2025-12-04 11:32:46.351241', '2025-12-04 11:37:00.296236'),
	(114, 'giri@rediffmail.com', '%%WkHaUPu@Q2', '2025-12-04 11:31:20.387029', '2025-12-04 11:37:00.986734'),
	(115, 'demo.test@actrec.gov.in', '0T!$tIh0x%om', '2025-12-04 11:32:46.075335', '2025-12-04 11:37:12.021481');


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("id", "email", "role", "created_at", "updated_at") VALUES
	('9ac4ddcb-05ea-438b-80e6-f1daf40eb201', 'jeyarish.venki@gmail.com', 'admin', '2025-12-03 16:55:42.469788+00', '2025-12-03 16:56:05.385+00'),
	('7dd07983-39f8-46ae-b58a-c664b8bb516e', 'vsmv1@rediffmail.com', 'regular', '2025-12-03 18:03:56.83486+00', '2025-12-03 18:04:32.144+00'),
	('e65e8043-5e5f-4cb7-896f-357d530878fb', 'john.doe@actrec.gov.in', 'regular', '2025-12-04 11:32:46.109982+00', '2025-12-04 11:32:46.109982+00'),
	('2f33a993-aa55-48ff-94de-98509b28700a', 'mary.kom@actrec.gov.in', 'regular', '2025-12-04 11:32:46.149499+00', '2025-12-04 11:32:46.149499+00'),
	('1ebbeb69-f9d9-49f3-bcc2-b709d2382332', 'peter.jones@actrec.gov.in', 'regular', '2025-12-04 11:32:46.159496+00', '2025-12-04 11:32:46.159496+00'),
	('40beeeff-24bc-4662-baa4-6baf16325c4b', 'jane.smith@actrec.gov.in', 'regular', '2025-12-04 11:32:46.351241+00', '2025-12-04 11:36:46.501+00'),
	('67a2c86f-43ac-4766-bbb7-07335c3aa8d1', 'demo.test@actrec.gov.in', 'regular', '2025-12-04 11:32:46.075335+00', '2025-12-04 11:36:48.772+00'),
	('8c6fcd05-be85-4bc9-bc7e-019204f3695d', 'giri@rediffmail.com', 'admin', '2025-12-04 11:31:20.387029+00', '2025-12-05 09:19:19.403596+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: user_credentials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_credentials_id_seq"', 124, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
