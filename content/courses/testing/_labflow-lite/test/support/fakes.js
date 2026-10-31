// A FAKE mailer: a small working implementation that keeps sent mail in memory instead of calling a provider.
export function createFakeMailer() {
  const outbox = [];
  return {
    outbox,
    async send(mail) {
      outbox.push(mail);
      return 'msg-' + outbox.length;
    },
  };
}
