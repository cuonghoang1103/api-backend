WITH RECURSIVE hours(h) AS (
  SELECT 6
  UNION ALL
  SELECT h + 1 FROM hours WHERE h < 21
),
slots AS (
  SELECT timestamptz '2026-11-25 00:00+07' + h * interval '1 hour' AS starts_at FROM hours
)
SELECT to_char(s.starts_at, 'HH24:MI') AS free_on_court_1
FROM slots s
WHERE NOT EXISTS (
  SELECT 1 FROM bookings b
  WHERE b.court_id = (SELECT id FROM courts WHERE name = 'Court 1') AND b.status <> 'CANCELLED' AND b.starts_at = s.starts_at
)
ORDER BY s.starts_at;
