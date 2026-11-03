-- 006_oidc.sql — Chapter 8: LabFlow ID as an OIDC provider. Registered relying parties (clients). Authorization codes
-- are short-lived and single-use, so they live in memory (src/oidc/provider.js), not in a table.
CREATE TABLE oauth_clients (
  client_id     text PRIMARY KEY,
  name          text        NOT NULL,
  redirect_uris text        NOT NULL,              -- JSON array; redirect_uri is matched EXACTLY against this list (8.3)
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- The cross-course client: LabFlow API (the course's API Design project) signs users in via LabFlow ID.
INSERT INTO oauth_clients (client_id, name, redirect_uris) VALUES
  ('labflow-api', 'LabFlow API', '["http://localhost:4810/callback"]');
