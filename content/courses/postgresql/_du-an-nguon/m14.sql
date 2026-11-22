CREATE ROLE booking_app NOLOGIN;
GRANT SELECT, INSERT, UPDATE ON bookings TO booking_app;
GRANT SELECT ON courts, members TO booking_app;
SET ROLE booking_app;
SELECT count(*) FROM bookings;
DELETE FROM bookings WHERE id = 1;
DROP TABLE bookings;
RESET ROLE;
