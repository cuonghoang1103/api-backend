import { it, expect } from 'vitest';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import { inject } from 'vitest';

it('SQLite stores the text "thirty" in an INTEGER column', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('CREATE TABLE bookings (id INTEGER PRIMARY KEY, seats INTEGER NOT NULL)');
  db.prepare('INSERT INTO bookings (seats) VALUES (?)').run('thirty');
  expect(db.prepare('SELECT seats, typeof(seats) AS type FROM bookings').get()).toEqual({ seats: 'thirty', type: 'text' });
});

it('PostgreSQL refuses it: 22P02 invalid input syntax for type integer', async () => {
  const client = new pg.Client({ connectionString: inject('databaseUrl') });
  await client.connect();
  try {
    await expect(client.query('INSERT INTO bookings (lab, date, start_time, end_time, seats, role, status, minutes) ' +
      "VALUES ('BE-201', '2026-11-16', '08:00', '10:00', $1, 'STUDENT', 'CONFIRMED', 120)", ['thirty']))
      .rejects.toMatchObject({ code: '22P02', message: 'invalid input syntax for type integer: "thirty"' });
  } finally {
    await client.end();
  }
});
