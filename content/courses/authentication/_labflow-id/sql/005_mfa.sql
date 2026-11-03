-- 005_mfa.sql — Chapter 7: a second factor. TOTP secrets, single-use recovery codes, and passkeys (WebAuthn credentials).
-- A user may have at most one TOTP secret (confirmed only after they prove one code), many recovery codes, many passkeys.

CREATE TABLE totp_secrets (
  user_id      text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret       text        NOT NULL,                 -- base32, the shared seed; treat as a credential
  confirmed_at timestamptz,                           -- null until the user verifies one code (lesson 7.3)
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE recovery_codes (
  id       bigserial PRIMARY KEY,
  user_id  text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  digest   text        NOT NULL,                      -- SHA-256 of the code; the plaintext is shown once
  used_at  timestamptz
);
CREATE INDEX recovery_codes_user ON recovery_codes (user_id);

CREATE TABLE passkeys (
  id           text PRIMARY KEY,                       -- the credential id (base64url), unique per authenticator
  user_id      text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key   text        NOT NULL,                   -- COSE public key, base64
  counter      bigint      NOT NULL DEFAULT 0,         -- signature counter, for clone detection (lesson 7.5)
  transports   text,                                   -- JSON array: how the authenticator can be reached
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);
CREATE INDEX passkeys_user ON passkeys (user_id);
