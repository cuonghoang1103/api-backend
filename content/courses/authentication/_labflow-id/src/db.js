// src/db.js — Chapter 2: LabFlow ID moves from data/db.json to PostgreSQL 17.
// One pool per process. DATABASE_URL comes from the environment (lesson 1.5: secrets reach the process at run time).
import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10 });

/** One query, parameters always separate from the SQL text (never string concatenation). */
export const q = (text, params = []) => pool.query(text, params);
