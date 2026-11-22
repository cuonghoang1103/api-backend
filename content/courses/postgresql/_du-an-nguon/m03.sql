CREATE TABLE members (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      text NOT NULL UNIQUE,
  full_name  text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE courts (
  id             int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name           text NOT NULL UNIQUE,
  kind           court_kind NOT NULL,
  price_per_hour integer NOT NULL CHECK (price_per_hour > 0)
);
CREATE TABLE bookings (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  member_id bigint NOT NULL REFERENCES members(id),
  court_id  int    NOT NULL REFERENCES courts(id),
  starts_at timestamptz NOT NULL,
  ends_at   timestamptz NOT NULL,
  status    text NOT NULL DEFAULT 'BOOKED'
            CHECK (status IN ('BOOKED', 'CANCELLED', 'DONE')),
  CHECK (ends_at > starts_at)
);
INSERT INTO courts (name, kind, price_per_hour) VALUES ('Court 1', 'indoor', 0);
INSERT INTO bookings (member_id, court_id, starts_at, ends_at)
VALUES (999, 1, now(), now() + interval '1 hour');
