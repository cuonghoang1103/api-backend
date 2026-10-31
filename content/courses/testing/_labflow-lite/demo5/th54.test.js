import { it, expect } from 'vitest';
import request from 'supertest';
import { makeApi } from '../test/support/api.js';
import { contractErrors } from '../test/support/contract.js';

it('BAD_JSON and a missing token also match the contract', async () => {
  const { app, bearer } = makeApi();
  const badJson = await request(app).post('/api/bookings').set('Authorization', await bearer('an'))
    .set('Content-Type', 'application/json').send('{');
  const noToken = await request(app).get('/api/bookings/1');
  expect(contractErrors('post', '/api/bookings', badJson)).toEqual([]);
  expect(contractErrors('get', '/api/bookings/{id}', noToken)).toEqual([]);
});
