// app.mjs — bài 11.2: bản chạy được của câu trả lời phỏng vấn "thiết kế API rút gọn link"
// PORT=4120 REDIRECT=302|301 CODE=random|counter node interview/shortener/app.mjs
import express from 'express';
import { toBase62, randomCode } from './codes.mjs';
import pg from 'pg';
import { createClient } from 'redis';

const PORT = Number(process.env.PORT ?? 4120);
const BASE = process.env.SHORT_BASE ?? `http://localhost:${PORT}`;
const REDIRECT = Number(process.env.REDIRECT ?? 302);              // 302: mỗi lượt bấm đi qua server ⇒ đếm được
const CODE = process.env.CODE ?? 'random';
const CLICKS = process.env.CLICKS ?? 'memory';                       // memory | pg (UPDATE mỗi lượt bấm) | stream (XADD vào Redis Stream)
const [LIMIT, WINDOW] = (process.env.CREATE_LIMIT ?? '5/60').split('/').map(Number);
const USERS = { tok_an: 'usr_1', tok_bin: 'usr_2', tok_lan: 'usr_3' };               // token GIẢ như LabFlow (chỉ để học)
const DAY_MS = Number(process.env.DAY_MS ?? 86_400_000);             // CHỈ để thử 410: DAY_MS=2000 ⇒ “một ngày” = 2 s
const RESERVED = new Set(['v1', 'api', 'admin', 'login', 'health']);

const links = new Map();                                            // code ⇒ { code, url, owner, createdAt, expiresAt, clicks, seq }
let seq = 0, retries = 0;

// Bài 11.3: ba cách đếm lượt bấm trên đường nóng
const db = CLICKS === 'pg' ? new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 10 }) : null;
if (db) await db.query('CREATE SCHEMA IF NOT EXISTS ivs; DROP TABLE IF EXISTS ivs.link_clicks; CREATE TABLE ivs.link_clicks (code text PRIMARY KEY, clicks bigint NOT NULL DEFAULT 0)');
const redis = CLICKS === 'stream' ? await createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' }).connect() : null;
async function countClick(l) {
  if (db) return db.query('UPDATE ivs.link_clicks SET clicks = clicks + 1 WHERE code = $1', [l.code]);   // một dòng nóng
  if (redis) return redis.xAdd('short:clicks', '*', { code: l.code, at: String(Date.now()) });           // worker gộp theo phút
  l.clicks++;
}

const problem = (res, status, code, detail, more = {}) =>
  res.status(status).type('application/problem+json')
    .json({ type: `https://short.example/problems/${code.toLowerCase().replaceAll('_', '-')}`, title: code, status, detail, code, ...more });

const auth = (req, res, next) => {
  const user = USERS[(req.get('authorization') ?? '').replace(/^Bearer /, '')];
  if (!user) return problem(res, 401, 'UNAUTHENTICATED', 'Bearer token required');
  req.user = user; next();
};

const buckets = new Map();                                          // xô token theo người dùng (bài 5.3)
const createLimit = (req, res, next) => {
  const t = Date.now() / 1000, rate = LIMIT / WINDOW;
  const b = buckets.get(req.user) ?? { tokens: LIMIT, at: t };
  b.tokens = Math.min(LIMIT, b.tokens + (t - b.at) * rate); b.at = t; buckets.set(req.user, b);
  res.set('RateLimit-Policy', `"create";q=${LIMIT};w=${WINDOW}`);
  if (b.tokens < 1) {
    const wait = Math.ceil((1 - b.tokens) / rate);
    res.set('Retry-After', String(wait));
    return problem(res, 429, 'RATE_LIMITED', `Too many links; retry in ${wait} s`);
  }
  b.tokens -= 1; next();
};

function newCode() {
  if (CODE === 'counter') return toBase62(1_000_000 + seq);         // không trùng, nhưng đoán được
  for (;;) {                                                        // ngẫu nhiên 7 ký tự: trùng thì thử lại
    const c = randomCode(7);
    if (!links.has(c)) return c;
    retries++;
  }
}

const view = (l) => ({ code: l.code, shortUrl: `${BASE}/${l.code}`, url: l.url, createdAt: l.createdAt, expiresAt: l.expiresAt, clicks: l.clicks });
const alive = (l) => l && !(l.expiresAt && Date.parse(l.expiresAt) <= Date.now());

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '4kb' }));

app.post('/v1/links', auth, createLimit, async (req, res) => {
  const { url, alias, ttlDays } = req.body ?? {};
  if (typeof url !== 'string' || url.length > 2048 || !/^https?:\/\/[^\s/?#]+(?:[/?#]\S*)?$/i.test(url))
    return problem(res, 422, 'INVALID_URL', 'url must be an absolute http(s) URL of at most 2048 characters');
  if (url.toLowerCase().startsWith(BASE.toLowerCase()))
    return problem(res, 422, 'INVALID_URL', 'A short link cannot point to another short link');
  if (alias !== undefined && (!/^[A-Za-z0-9_-]{4,30}$/.test(alias) || RESERVED.has(alias.toLowerCase())))
    return problem(res, 422, 'INVALID_ALIAS', 'alias: 4–30 characters A–Z a–z 0–9 _ -, not a reserved word');
  if (alias !== undefined && links.has(alias))
    return problem(res, 409, 'ALIAS_TAKEN', `“${alias}” is already used`);
  if (ttlDays !== undefined && !(Number.isInteger(ttlDays) && ttlDays >= 1 && ttlDays <= 365))
    return problem(res, 422, 'INVALID_TTL', 'ttlDays: an integer from 1 to 365');
  const now = new Date();
  const l = { code: alias ?? newCode(), url, owner: req.user, seq: ++seq, clicks: 0, createdAt: now.toISOString(),
    expiresAt: ttlDays ? new Date(now.getTime() + ttlDays * DAY_MS).toISOString() : null };
  links.set(l.code, l);
  if (db) await db.query('INSERT INTO ivs.link_clicks (code) VALUES ($1)', [l.code]);
  res.status(201).location(`/v1/links/${l.code}`).json(view(l));
});

app.get('/v1/links', auth, (req, res) => {                         // danh sách của tôi, cursor = seq cuối trang (bài 3.2)
  const limit = Math.min(Number(req.query.limit ?? 20), 100);
  const after = Number(req.query.cursor ?? Infinity);
  const mine = [...links.values()].filter((l) => l.owner === req.user && l.seq < after).sort((a, b) => b.seq - a.seq);
  const page = mine.slice(0, limit);
  res.json({ data: page.map(view), page: { limit, next: mine.length > limit ? String(page.at(-1).seq) : null } });
});

app.get('/v1/links/:code', auth, (req, res) => {
  const l = links.get(req.params.code);
  if (!l || l.owner !== req.user) return problem(res, 404, 'NOT_FOUND', 'No such link');   // của người khác ⇒ 404 (bài 6.2)
  res.json(view(l));
});

app.delete('/v1/links/:code', auth, (req, res) => {
  const l = links.get(req.params.code);
  if (!l || l.owner !== req.user) return problem(res, 404, 'NOT_FOUND', 'No such link');
  links.delete(l.code);
  res.status(204).end();
});

app.get('/debug/stats', (req, res) => res.json({ links: links.size, retries, clicks: [...links.values()].reduce((s, l) => s + l.clicks, 0) }));

app.get('/:code', async (req, res) => {                                   // đường nóng: tra một Map, trả chuyển hướng
  const l = links.get(req.params.code);
  if (!l) return res.status(404).type('text/plain').send('Not found\n');
  if (!alive(l)) return res.status(410).type('text/plain').send('This link has expired\n');
  await countClick(l);                                              // memory: l.clicks++ · pg: UPDATE · stream: XADD
  res.redirect(REDIRECT, l.url);
});

app.listen(PORT, () => console.log(`shortener :${PORT} REDIRECT=${REDIRECT} CODE=${CODE} CLICKS=${CLICKS}`));
