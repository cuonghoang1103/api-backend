SELECT column_name FROM information_schema.columns WHERE table_name='Post' ORDER BY ordinal_position;
SELECT tc.constraint_type, kcu.column_name, ccu.table_name AS refs
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name=ccu.constraint_name
WHERE tc.table_name='Post' AND tc.constraint_type='FOREIGN KEY';