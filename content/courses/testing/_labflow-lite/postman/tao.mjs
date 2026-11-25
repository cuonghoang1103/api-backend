// tao.mjs — viết collection Postman v2.1 từ mô tả gọn (để soạn bài; người học bấm trong Postman sẽ ra đúng JSON này).
import fs from 'node:fs';
export const js = (f) => {
  const t = f.toString();
  const body = t.slice(t.indexOf('{') + 1, t.lastIndexOf('}'));
  const lines = body.split('\n').filter((l, i, a) => l.trim() || (i > 0 && i < a.length - 1));
  const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
  return lines.map((l) => l.slice(pad).trimEnd());
};
export function req(name, method, url, { body, auth, test, pre, headers = [] } = {}) {
  const r = { name, request: { method, header: [...headers], url } };
  if (body !== undefined) {
    r.request.body = { mode: 'raw', raw: typeof body === 'string' ? body : JSON.stringify(body, null, 2), options: { raw: { language: 'json' } } };
  }
  if (auth === 'none') r.request.auth = { type: 'noauth' };
  else if (auth) r.request.auth = { type: 'bearer', bearer: [{ key: 'token', value: auth, type: 'string' }] };
  r.event = [];
  if (pre) r.event.push({ listen: 'prerequest', script: { type: 'text/javascript', exec: js(pre) } });
  if (test) r.event.push({ listen: 'test', script: { type: 'text/javascript', exec: js(test) } });
  return r;
}
export function collection(name, items, { vars = [], auth, test, pre } = {}) {
  const c = { info: { name, schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' }, item: items };
  if (auth) c.auth = { type: 'bearer', bearer: [{ key: 'token', value: auth, type: 'string' }] };
  c.event = [];
  if (pre) c.event.push({ listen: 'prerequest', script: { type: 'text/javascript', exec: js(pre) } });
  if (test) c.event.push({ listen: 'test', script: { type: 'text/javascript', exec: js(test) } });
  c.variable = vars.map(([key, value]) => ({ key, value }));
  return c;
}
export const folder = (name, item, extra = {}) => ({ name, item, ...extra });
export const save = (file, c) => fs.writeFileSync(file, JSON.stringify(c, null, 2) + '\n');
