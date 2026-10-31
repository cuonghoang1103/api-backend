// Adapter around the e-mail provider's HTTP API. The rest of LabFlow Lite only sees mailer.send({ to, subject }).
export class MailError extends Error {
  constructor(code, options) {
    super(code, options);
    this.name = 'MailError';
    this.code = code;
  }
}

export function createHttpMailer({ baseUrl, apiKey }) {
  return {
    async send({ to, subject }) {
      const res = await fetch(baseUrl + '/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + apiKey },
        body: JSON.stringify({ to, subject }),
      });
      if (res.status === 429) throw new MailError('RATE_LIMITED');
      if (!res.ok) throw new MailError('MAIL_FAILED', { cause: new Error('HTTP ' + res.status) });
      const body = await res.json();
      return body.id;
    },
  };
}
