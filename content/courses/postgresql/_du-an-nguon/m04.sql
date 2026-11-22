INSERT INTO courts (name, kind, price_per_hour) VALUES
  ('Court 1', 'indoor', 120000), ('Court 2', 'indoor', 120000),
  ('Court 3', 'outdoor', 80000), ('Court 4', 'outdoor', 80000);
INSERT INTO members (email, full_name)
SELECT 'm' || i || '@example.com', 'Member ' || i FROM generate_series(1, 200) AS i;
INSERT INTO bookings (member_id, court_id, starts_at, ends_at, status)
SELECT 1 + (c * 31 + d * 17 + h * 13) % 200, co.court_id,
       t, t + interval '1 hour',
       CASE WHEN (d + h) % 11 = 0 THEN 'CANCELLED'
            WHEN t < '2026-11-15' THEN 'DONE' ELSE 'BOOKED' END
FROM (SELECT id AS court_id, row_number() OVER (ORDER BY id) AS c FROM courts) co,
     generate_series(0, 59) d, generate_series(6, 21) h,
     LATERAL (SELECT timestamptz '2026-10-01 00:00+07' + d * interval '1 day' + h * interval '1 hour') AS x(t)
WHERE (c * 7 + d * 3 + h) % 3 = 0;
SELECT count(*) AS bookings, count(DISTINCT member_id) AS members_who_booked FROM bookings;
INSERT INTO members (email, full_name) VALUES ('m1@example.com', 'Nguyen Van A')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name
RETURNING id, email, full_name;
