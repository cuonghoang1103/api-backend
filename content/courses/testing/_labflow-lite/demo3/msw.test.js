import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const API = 'https://mail.provider.example';
const sent = [];
const server = setupServer(
  http.post(API + '/v1/messages', async ({ request }) => {
    sent.push({ auth: request.headers.get('authorization'), body: await request.json() });
    return HttpResponse.json({ id: 'msg-42' }, { status: 202 });
  }),
);

beforeAll(() => server.listen({ onUnhandledFrame: 'error' })); // any other request fails the test
afterEach(() => { server.resetHandlers(); sent.length = 0; });
afterAll(() => server.close());

describe('createHttpMailer (real fetch, fake network)', () => {
  const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });

  it('posts JSON with the API key and returns the message id', async () => {
    await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).resolves.toBe('msg-42');
    expect(sent).toEqual([{ auth: 'Bearer test-key', body: { to: 'an@fpt.edu.vn', subject: 'Hi' } }]);
  });

  it('429 from the provider becomes RATE_LIMITED', async () => {
    server.use(http.post(API + '/v1/messages', () => new HttpResponse(null, { status: 429 })));
    await expect(mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' })).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('500 becomes MAIL_FAILED and keeps the status as the cause', async () => {
    server.use(http.post(API + '/v1/messages', () => new HttpResponse(null, { status: 500 })));
    const error = await mailer.send({ to: 'an@fpt.edu.vn', subject: 'Hi' }).catch((e) => e);
    expect(error).toMatchObject({ code: 'MAIL_FAILED', cause: { message: 'HTTP 500' } });
  });
});
