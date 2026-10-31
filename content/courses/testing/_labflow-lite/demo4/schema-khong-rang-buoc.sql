-- LabFlow Lite — PostgreSQL schema (Chapter 4). Applied fresh before every integration run.

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
  email      text
);
