-- sql/002_sessions.sql — Chapter 3: each column of a session row answers one question someone will ask in production.
ALTER TABLE sessions
  ADD COLUMN expires_at   timestamptz NOT NULL DEFAULT now() + interval '12 hours', -- absolute end: no session outlives a work day
  ADD COLUMN last_seen_at timestamptz NOT NULL DEFAULT now(),                       -- idle end = last_seen_at + 30 minutes
  ADD COLUMN auth_at      timestamptz NOT NULL DEFAULT now(),                       -- when the password was last proven (step-up, 3.3)
  ADD COLUMN ip           inet,                                                     -- "is this you?" on the devices page (Chapter 5)
  ADD COLUMN user_agent   text;
CREATE INDEX sessions_user_id_idx ON sessions (user_id);                             -- "sign out everywhere" without a full scan
