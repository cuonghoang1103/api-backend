-- sql/001_users.sql — Chapter 2: users live in PostgreSQL; the password column holds a self-describing hash string.
CREATE TABLE users (
  id                   text PRIMARY KEY,                 -- usr_1, usr_2 … (same ids as the other LabFlow courses)
  email                text NOT NULL UNIQUE,             -- stored lower-case
  name                 text NOT NULL,
  role                 text NOT NULL DEFAULT 'STUDENT',  -- STUDENT | LAB_MANAGER
  password_hash        text NOT NULL,                    -- $argon2id$v=19$m=…,t=…,p=…$salt$hash
  must_change_password boolean NOT NULL DEFAULT false,   -- set when the password is found in a breach list (lesson 2.4)
  created_at           timestamptz NOT NULL DEFAULT now()
);
CREATE SEQUENCE user_seq;

-- Sessions keep the v0.1 design (only a SHA-256 digest of the token). Chapter 3 adds expiry, last_seen, ip/ua.
CREATE TABLE sessions (
  digest     text PRIMARY KEY,
  user_id    text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
