ANALYZE;
EXPLAIN (COSTS OFF)
SELECT * FROM bookings WHERE member_id = 42 AND starts_at >= '2026-11-01' ORDER BY starts_at;
CREATE INDEX bookings_member_start_idx ON bookings (member_id, starts_at);
EXPLAIN (COSTS OFF)
SELECT * FROM bookings WHERE member_id = 42 AND starts_at >= '2026-11-01' ORDER BY starts_at;
