import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { buildApp, isThirsty } from './app.mjs';

describe('isThirsty (unit)', () => {
  const p = { everyDays: 7 };
  test('exactly on the due day counts as thirsty (edge case)', () => {
    assert.equal(isThirsty(p, new Date('2026-11-15T08:00:00Z'), new Date('2026-11-22T08:00:00Z')), true);
  });
  test('one minute before the due time is not thirsty', () => {
    assert.equal(isThirsty(p, new Date('2026-11-15T08:00:00Z'), new Date('2026-11-22T07:59:00Z')), false);
  });
});

describe('POST /plants (HTTP)', () => {
  test('201 and the plant appears in the list', async () => {
    const app = buildApp();
    const res = await request(app).post('/plants').send({ name: 'Fern', everyDays: 3 }).expect(201);
    assert.equal(res.body.name, 'Fern');
    const list = await request(app).get('/plants').expect(200);
    assert.equal(list.body.length, 1);
  });
  test('400 with a readable message for a bad body', async () => {
    const res = await request(buildApp()).post('/plants').send({ name: 'F', everyDays: 3 }).expect(400);
    assert.match(res.body.error.message, /at least 2/);
  });
});
