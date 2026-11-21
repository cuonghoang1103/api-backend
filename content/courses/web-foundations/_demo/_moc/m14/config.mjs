// Milestone 14: read every setting ONCE, at start-up, and refuse to start if one is missing.
const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET'];

export function loadConfig(env = process.env) {
  const missing = REQUIRED.filter((key) => !env[key]);
  if (missing.length) throw new Error('Missing environment variables: ' + missing.join(', ') + ' (see .env.example)');
  if (env.NODE_ENV === 'production' && env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET is too short for production');
  return Object.freeze({
    port: Number(env.PORT || 3000),
    databaseUrl: env.DATABASE_URL,
    sessionSecret: env.SESSION_SECRET,
    isProduction: env.NODE_ENV === 'production',
  });
}

if (import.meta.url === 'file://' + process.argv[1]) {
  try {
    const config = loadConfig();
    console.log('config ok: port', config.port, '| production:', config.isProduction);
  } catch (err) {
    console.error('Refusing to start:', err.message);
    process.exit(1);
  }
}
