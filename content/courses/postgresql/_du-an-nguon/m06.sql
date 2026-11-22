SELECT c.name,
       date_trunc('month', b.starts_at)::date AS month,
       count(*) FILTER (WHERE b.status <> 'CANCELLED') AS played_or_booked,
       count(*) FILTER (WHERE b.status = 'CANCELLED')  AS cancelled,
       sum(c.price_per_hour) FILTER (WHERE b.status <> 'CANCELLED') AS revenue_vnd
FROM bookings b JOIN courts c ON c.id = b.court_id
GROUP BY c.name, month
HAVING count(*) > 0
ORDER BY c.name, month
LIMIT 6;
