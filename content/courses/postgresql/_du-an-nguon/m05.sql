INSERT INTO members (email, full_name) VALUES ('new@example.com', 'Never Booked');
SELECT m.full_name, count(b.id) AS bookings
FROM members m LEFT JOIN bookings b ON b.member_id = m.id
GROUP BY m.id ORDER BY bookings, m.id LIMIT 3;
SELECT b.starts_at, c.name AS court, m.full_name
FROM bookings b
JOIN courts  c ON c.id = b.court_id
JOIN members m ON m.id = b.member_id
WHERE b.status = 'BOOKED'
ORDER BY b.starts_at, c.name LIMIT 3;
