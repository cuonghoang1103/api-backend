-- Lab 9 · C2 — run ONCE, right after the first `prisma migrate resolve` / `migrate deploy` created shop._prisma_migrations.
-- The default privileges of roles.sql (step 3) also handed the APP role the migration history: it could rewrite it.
\pset pager off
SELECT has_table_privilege('ctshop_app', 'shop._prisma_migrations', 'DELETE') AS app_can_delete_history;
REVOKE ALL ON shop._prisma_migrations FROM ctshop_app;
SELECT has_table_privilege('ctshop_app', 'shop._prisma_migrations', 'DELETE') AS app_can_delete_history;
