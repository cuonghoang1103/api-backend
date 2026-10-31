import pg from 'pg';
// One pool for the whole app, created when the module is imported.
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
