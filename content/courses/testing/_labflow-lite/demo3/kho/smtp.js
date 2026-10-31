export async function sendMail(to, subject) {
  const res = await fetch(process.env.MAIL_API_URL + '/v1/messages', { method: 'POST', body: JSON.stringify({ to, subject }) });
  if (!res.ok) throw new Error('MAIL_FAILED');
}
