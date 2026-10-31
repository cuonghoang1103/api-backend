import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createHttpMailer } from '../src/lib/mailer.js';

const API = 'https://mail.provider.example';
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
const mailer = createHttpMailer({ baseUrl: API, apiKey: 'test-key' });

describe('practice 3.2', () => {
  it('400 from the provider is MAIL_FAILED with "HTTP 400" as the cause', async () => {
    server.use(http.post(API + '/v1/messages', () => HttpResponse.json({ error: 'bad address' }, { status: 400 })));
    await expect(mailer.send({ to: 'not-an-email', subject: 'Hi' }))
      .rejects.toMatchObject({ code: 'MAIL_FAILED', cause: { message: 'HTTP 400' } });
  });

  it('sends the subject in the JSON body', async () => {
    let body;
    server.use(http.post(API + '/v1/messages', async ({ request }) => {
      body = await request.json();
      return HttpResponse.json({ id: 'm-9' }, { status: 202 });
    }));
    await mailer.send({ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201' });
    expect(body).toEqual({ to: 'an@fpt.edu.vn', subject: 'Booking confirmed: BE-201' });
  });
});
