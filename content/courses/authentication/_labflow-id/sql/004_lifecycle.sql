-- sql/004_lifecycle.sql — Chapter 6: the account lifecycle. A user is created unverified; email verification and
-- password reset both use ONE-TIME tokens, stored only as a digest (lesson 1.3), single-use and short-lived.
ALTER TABLE users
  ADD COLUMN email_verified_at timestamptz,                       -- null until the address is proven (lesson 6.2)
  ADD COLUMN status            text NOT NULL DEFAULT 'active';     -- active | deleted (lesson 6.5)

CREATE TABLE one_time_tokens (
  id         text        PRIMARY KEY,                             -- ott_<random> — the row id, safe to log
  user_id    text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose    text        NOT NULL,                                -- 'verify_email' | 'reset_password'
  digest     text        NOT NULL,                                -- SHA-256 of the token; the token itself is emailed, never stored
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,                                -- 30 min for verify, 15 min for reset
  used_at    timestamptz                                         -- set when consumed; a used token is rejected (single-use)
);
CREATE UNIQUE INDEX one_time_tokens_digest_idx ON one_time_tokens (digest);
CREATE INDEX one_time_tokens_user_idx ON one_time_tokens (user_id, purpose);
