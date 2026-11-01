// RED SOMETIMES: a unit test that goes over the network to a slow server.
import { it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'node:http';
import { createHttpMailer } from '../src/lib/mailer.js';

// Stands in for a shared staging mail provider: answers in 20–140 ms, depending on its load.
const server = createServer((req, res) => {
  setTimeout(() => res.writeHead(202, { 'content-type': 'application/json' }).end('{"id":"msg-1"}'), 20 + Math.random() * 120);
});
beforeAll(() => new Promise((resolve) => server.listen(0, resolve)));
afterAll(() => new Promise((resolve) => server.close(resolve)));

it('sends the booking confirmation', { timeout: 100 }, async () => {
  const mailer = createHttpMailer({ baseUrl: 'http://127.0.0.1:' + server.address().port, apiKey: 'k' });
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booked' })).resolves.toBe('msg-1');
});
