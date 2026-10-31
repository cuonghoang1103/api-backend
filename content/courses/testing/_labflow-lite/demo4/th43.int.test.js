import { it, expect, inject } from 'vitest';
import pg from 'pg';

it('tests run on the same major version as production (PostgreSQL 17) with btree_gist', async () => {
  const client = new pg.Client({ connectionString: inject('databaseUrl') });
  await client.connect();
  try {
    const version = (await client.query('SHOW server_version')).rows[0].server_version;
    const ext = (await client.query("SELECT extname FROM pg_extension WHERE extname = 'btree_gist'")).rows;
    expect(version).toMatch(/^17\./);
    expect(ext).toEqual([{ extname: 'btree_gist' }]);
  } finally {
    await client.end();
  }
});
