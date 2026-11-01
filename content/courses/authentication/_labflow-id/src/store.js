// src/store.js — the simplest possible "database": one JSON file, data/db.json.
// Good enough to see every problem of lesson 0.3 with your own eyes; Chapter 2 moves to PostgreSQL.
import fs from 'node:fs';
import path from 'node:path';

const FILE = process.env.DB_FILE ?? 'data/db.json';

export function load() {
  if (!fs.existsSync(FILE)) return { users: [], sessions: [] };
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

export function save(db) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2) + '\n');
}
