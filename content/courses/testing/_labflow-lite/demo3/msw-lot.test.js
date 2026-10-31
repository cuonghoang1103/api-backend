import { it, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const server = setupServer(http.post('https://mail.provider.example/v1/messages', () => HttpResponse.json({ id: 'm-1' })));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' })); // MSW 3 name
afterAll(() => server.close());

it('a typo in the base URL is caught instead of calling the real internet', async () => {
  const mailer = createHttpMailer({ baseUrl: 'https://mail.provider.example/api', apiKey: 'k' }); // extra "/api"
  await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('m-1');
});
