import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from './mailer.js';

const API = 'https://mail.provider.example';
const requests = [];
const ok = http.post(API + '/v1/messages', async ({ request }) => {
  requests.push({ auth: request.headers.get('authorization'), body: await request.json() });
  return HttpResponse.json({ id: 'msg-42' }, { status: 202 });
});
const server = setupServer(ok);
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => { server.resetHandlers(); requests.length = 0; });
afterAll(() => server.close());
const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });
const reply = (status) => server.use(http.post(API + '/v1/messages', () => new HttpResponse(null, { status })));

describe('createHttpMailer', () => {
  it('posts { to, subject } with a Bearer key and returns the id', async () => {
    await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('msg-42');
    expect(requests).toEqual([{ auth: 'Bearer test-key', body: { to: 'an@fpt.edu.vn', subject: 'Hi' } }]);
  });

  it('429 → RATE_LIMITED', async () => {
    reply(429);
    await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it.each([400, 503])('%i → MAIL_FAILED with the status as the cause', async (status) => {
    reply(status);
    await expect(mailer.send({ to: 'a@b.c', subject: 'Hi' }))
      .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: 'HTTP ' + status } });
  });
});
