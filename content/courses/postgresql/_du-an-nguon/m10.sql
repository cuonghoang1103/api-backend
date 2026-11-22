EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF, SUMMARY OFF)
SELECT c.name, count(*)
FROM bookings b JOIN courts c ON c.id = b.court_id
WHERE b.status = 'BOOKED'
GROUP BY c.name;
