CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (court_id WITH =, tstzrange(starts_at, ends_at) WITH &&)
  WHERE (status <> 'CANCELLED');
-- someone tries to book Court 1 half an hour into an existing booking
BEGIN;
INSERT INTO bookings (member_id, court_id, starts_at, ends_at)
SELECT 7, court_id, starts_at + interval '30 minutes', ends_at + interval '30 minutes'
FROM bookings
WHERE court_id = (SELECT id FROM courts WHERE name = 'Court 1') AND status = 'BOOKED'
ORDER BY starts_at LIMIT 1;
ROLLBACK;
