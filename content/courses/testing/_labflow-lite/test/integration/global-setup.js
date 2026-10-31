// Integration tests: one throwaway PostgreSQL per run, with a fresh schema.
//  - TEST_DATABASE_URL set (lesson 4.2: docker compose) → use that database
//  - otherwise (lesson 4.3) → start a container with Testcontainers and stop it afterwards
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function setup({ provide }) {
  let url = process.env.TEST_DATABASE_URL;
  let container;
  if (!url) {
    const t0 = Date.now();
    container = await new PostgreSqlContainer('postgres:17').start();
    url = container.getConnectionUri();
    console.log('[setup] PostgreSQL container ready in ' + (Date.now() - t0) + ' ms');
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query('DROP TABLE IF EXISTS bookings');
  await client.query(readFileSync(process.env.TST_SCHEMA ?? 'db/schema.sql', 'utf8'));
  await client.end();
  provide('databaseUrl', url);
  return async () => { if (container) await container.stop(); };
}
