// LabFlow v0 — one global database connection for the whole app (2019). Lesson 10.2: the first dependency to break.
import pg from 'pg';

const url = process.env.LEGACY_DATABASE_URL ?? 'postgres://labflow:labflow@127.0.0.1:54399/labflow_v0';

export const db = {
  async all(sql) {
    const client = new pg.Client(url);
    await client.connect();
    try {
      return (await client.query(sql)).rows;
    } finally {
      await client.end();
    }
  },
};
