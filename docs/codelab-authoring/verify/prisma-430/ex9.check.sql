SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('User','Post','Comment') ORDER BY table_name;
SELECT tc.table_name, ccu.table_name AS refs FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name=ccu.constraint_name
WHERE tc.constraint_type='FOREIGN KEY' AND tc.table_name IN ('Post','Comment') ORDER BY tc.table_name;
SELECT enumlabel FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid WHERE t.typname='Role' ORDER BY e.enumsortorder;