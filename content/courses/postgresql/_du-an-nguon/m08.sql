SELECT day, revenue_vnd,
       sum(revenue_vnd) OVER (ORDER BY day) AS running_total,
       rank() OVER (ORDER BY revenue_vnd DESC) AS best_day_rank
FROM (
  SELECT b.starts_at::date AS day, sum(c.price_per_hour) AS revenue_vnd
  FROM bookings b JOIN courts c ON c.id = b.court_id
  WHERE c.name = 'Court 1' AND b.status <> 'CANCELLED' AND b.starts_at < '2026-10-06'
  GROUP BY day
) d
ORDER BY day;
SELECT starts_at::date AS day,
       starts_at::date - lag(starts_at::date) OVER (ORDER BY starts_at) AS days_since_previous
FROM bookings WHERE member_id = 42 ORDER BY starts_at LIMIT 5;
