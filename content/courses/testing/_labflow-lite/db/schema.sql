-- LabFlow Lite — PostgreSQL schema (Chapter 4). Applied fresh before every integration run.
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- lets "lab WITH =" join a GiST exclusion constraint

CREATE TABLE bookings (
  id         serial PRIMARY KEY,
  lab        text    NOT NULL,
  date       date    NOT NULL,
  start_time time    NOT NULL,
  end_time   time    NOT NULL,
  seats      int     NOT NULL CHECK (seats > 0),
  role       text    NOT NULL,
  status     text    NOT NULL,
  minutes    int     NOT NULL,
  email      text,
  user_id    text,              -- Chapter 11: who booked it (My bookings)
  -- BR-04 in the database: no two bookings of one lab may overlap. Bounds [) = the end minute is free.
  CONSTRAINT no_overlap EXCLUDE USING gist (
    lab WITH =,
    tsrange(date + start_time, date + end_time, '[)') WITH &&
  ) WHERE (status <> 'CANCELLED')   -- Chapter 11: a cancelled booking frees its slot
);

CREATE INDEX bookings_by_user ON bookings (user_id, date, start_time);   -- Chapter 11: GET /api/bookings
