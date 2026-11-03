// src/secrets/load.js — Chapter 11 (11.1): get secrets to the process without putting them in the repo. loadConfig()
// reads from the environment, FAILS FAST on a missing required secret (a clear startup error beats a 3am 500), and
// never returns the raw values in a form you would log — redactedConfig() replaces each secret value before it is
// printed, so a startup banner can show WHICH config is set without ever leaking WHAT it is set to.

const REQUIRED = ['DATABASE_URL', 'JWT_SIGNING_KEY', 'SESSION_SECRET'];

/** ⇒ { config, missing }. config has the values; missing lists required keys that were absent. Caller fails if missing. */
export function loadConfig(env = {}) {
  const missing = REQUIRED.filter((k) => !env[k] || String(env[k]).trim() === '');
  const config = {};
  for (const k of REQUIRED) config[k] = env[k];
  config.PORT = env.PORT || '4800';
  return { config, missing };
}

/** A version of the config that is safe to print in a startup log — every secret value replaced by set/MISSING. */
export function redactedConfig(config) {
  const out = {};
  for (const [k, v] of Object.entries(config || {})) {
    out[k] = REQUIRED.includes(k) ? (v ? '[set]' : '[MISSING]') : v;   // secrets: show whether set, never the value
  }
  return out;
}
