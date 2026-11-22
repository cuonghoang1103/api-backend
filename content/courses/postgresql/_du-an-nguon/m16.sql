CREATE TABLE audit_log (
  at         timestamptz NOT NULL DEFAULT now(),
  booking_id bigint REFERENCES bookings(id),
  note       text
);
SELECT c.conrelid::regclass AS table_name, a.attname AS fk_column_without_index
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND i.indkey[0] = a.attnum
  )
ORDER BY 1, 2;
SELECT relname AS table_without_primary_key
FROM pg_class t
WHERE t.relkind = 'r' AND t.relnamespace = 'public'::regnamespace
  AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = t.oid AND contype = 'p');
