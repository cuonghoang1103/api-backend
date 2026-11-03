-- sql/003_refresh.sql — Chapter 5: refresh tokens, in families, each stored only as a digest (lesson 1.3).
-- One row per refresh token ever issued; a family is one login on one device. A token is "current" while used_at IS NULL.
CREATE TABLE refresh_tokens (
  id          text        PRIMARY KEY,                 -- rt_<random> — the row id, safe to log
  family_id   text        NOT NULL,                    -- fam_<random> — all tokens from one login share it
  user_id     text        NOT NULL REFERENCES users(id),
  digest      text        NOT NULL,                    -- SHA-256 of the token; the token itself is never stored
  created_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz NOT NULL,                    -- the family's absolute end (30 days); a rotated token keeps it
  used_at     timestamptz,                             -- when this token was rotated away (NULL = the current, live token)
  replaced_by text,                                    -- the id of the token that replaced it (for the grace window, 5.5)
  revoked_at  timestamptz,                             -- set on every token of a family when the family is revoked
  ip          inet,
  user_agent  text
);
CREATE UNIQUE INDEX refresh_tokens_digest_idx ON refresh_tokens (digest);           -- look a presented token up by its digest
CREATE INDEX refresh_tokens_family_idx ON refresh_tokens (family_id);               -- revoke a whole family at once
CREATE INDEX refresh_tokens_user_idx ON refresh_tokens (user_id);                   -- the devices page, and "sign out everywhere"
