DROP SCHEMA IF EXISTS shard0 CASCADE; DROP SCHEMA IF EXISTS shard1 CASCADE; CREATE SCHEMA shard0; CREATE SCHEMA shard1;
CREATE TABLE shard0.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 0;
CREATE TABLE shard1.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 1;
CREATE INDEX ON shard0.bookings (created_at DESC, id DESC); CREATE INDEX ON shard1.bookings (created_at DESC, id DESC);
CREATE INDEX ON shard0.bookings (lab_id, start_at); CREATE INDEX ON shard1.bookings (lab_id, start_at);
CREATE INDEX ON shard0.bookings (user_id); CREATE INDEX ON shard1.bookings (user_id);
ANALYZE shard0.bookings; ANALYZE shard1.bookings;
SELECT 'shard0' AS shard, count(*), count(DISTINCT lab_id) AS labs FROM shard0.bookings UNION ALL SELECT 'shard1', count(*), count(DISTINCT lab_id) FROM shard1.bookings;
