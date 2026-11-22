SELECT jsonb_pretty(jsonb_build_object(
  'member', m.full_name,
  'bookings', (SELECT jsonb_agg(jsonb_build_object('court', c.name, 'at', to_char(b.starts_at, 'YYYY-MM-DD HH24:MI'))
                                ORDER BY b.starts_at)
               FROM (SELECT * FROM bookings WHERE member_id = m.id ORDER BY starts_at LIMIT 2) b
               JOIN courts c ON c.id = b.court_id)
)) AS document_view
FROM members m WHERE m.id = 42;
