// Server-side configuration: read once at start-up, fail fast if something is missing.
const required = ['DATABASE_URL', 'PAYMENT_SECRET'];

const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error('Missing environment variables: ' + missing.join(', '));
  console.error('Copy .env.example to .env and fill them in.');
  process.exit(1);
}

export const config = {
  databaseUrl: process.env.DATABASE_URL,
  paymentSecret: process.env.PAYMENT_SECRET,
  port: Number(process.env.PORT ?? 3000),
};

// Never print secrets — print that they exist
console.log('config ok · port', config.port, '· database', new URL(config.databaseUrl).host, '· payment secret', config.paymentSecret ? 'set (' + config.paymentSecret.length + ' chars)' : 'missing');
