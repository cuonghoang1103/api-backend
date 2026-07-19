SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name='User' ORDER BY ordinal_position;
SELECT indexname FROM pg_indexes WHERE tablename='User';