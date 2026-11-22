SELECT 0.1::float8 + 0.2::float8 = 0.3 AS float_equal,
       0.1::numeric + 0.2::numeric = 0.3 AS numeric_equal;
SET TIME ZONE 'Asia/Ho_Chi_Minh';
SELECT '2026-11-22 23:30'::timestamptz AS local_input,
       '2026-11-22 23:30'::timestamptz AT TIME ZONE 'UTC' AS stored_as_utc;
CREATE TYPE court_kind AS ENUM ('indoor', 'outdoor');
SELECT 'rooftop'::court_kind;
