// demo11/secrets.mjs — secrets to the process, and never into a log (Chapter 11, 11.1).
import { loadConfig, redactedConfig } from '../src/secrets/load.js';

// 1. A process started with a secret MISSING fails fast, with a clear message — not a 3am 500 deep in a request.
const bad = loadConfig({ JWT_SIGNING_KEY: 'k' });
console.log('Startup with DATABASE_URL and SESSION_SECRET unset:');
console.log(`  missing required secrets: ${JSON.stringify(bad.missing)}  ⇒ refuse to start (exit non-zero)\n`);

// 2. A process started correctly can print a startup banner that shows WHICH config is set, never WHAT it is.
const good = loadConfig({ DATABASE_URL: 'postgres://labflow:s3cr3t-pw@db/labflow', JWT_SIGNING_KEY: 'ed25519:AAAA....', SESSION_SECRET: 'long-random-session-secret' });
console.log('Startup with all secrets set — the banner you CAN log:');
console.log('  ' + JSON.stringify(redactedConfig(good.config)));
console.log('  (DATABASE_URL shows [set], never postgres://…:s3cr3t-pw@…)\n');

console.log('⇒ Secrets reach the process from the environment (the VPS .env, a secrets manager), never the repo.');
console.log('  A missing one is a loud startup failure; a present one is logged as [set], never as its value.');
