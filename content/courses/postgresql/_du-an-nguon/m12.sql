ALTER TABLE bookings ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
CREATE FUNCTION touch_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER bookings_touch BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE VIEW member_upcoming AS
SELECT b.id, b.member_id, c.name AS court, b.starts_at
FROM bookings b JOIN courts c ON c.id = b.court_id
WHERE b.status = 'BOOKED';
UPDATE bookings SET updated_at = '2000-01-01' WHERE id = (SELECT min(id) FROM bookings);
SELECT id, updated_at > '2026-01-01' AS trigger_overrode_it FROM bookings WHERE id = (SELECT min(id) FROM bookings);
SELECT court, to_char(starts_at, 'YYYY-MM-DD HH24:MI') AS starts FROM member_upcoming WHERE member_id = 42 ORDER BY starts_at LIMIT 2;
