// grade-lab11.mjs — chấm Lab 11 (10 điểm, phần chấm được bằng máy): design doc + OpenAPI cho API sự kiện CLB
// node lab/grade-lab11.mjs <design-doc.md> <openapi.yaml>
// Phần "nói" (làm rõ, đánh đổi, quản lý thời gian) chấm bằng thang 6 tiêu chí của bài 11.1 — máy không chấm được.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parse } from 'yaml';

const [docPath, apiPath] = process.argv.slice(2);
if (!docPath || !apiPath) { console.error('dùng: node lab/grade-lab11.mjs <design-doc.md> <openapi.yaml>'); process.exit(2); }
const doc = readFileSync(docPath, 'utf8');
let api = null, parseError = null;
try { api = parse(readFileSync(apiPath, 'utf8')); } catch (e) { parseError = e.message.split('\n')[0]; }

const results = [];
const check = (name, fn) => {
  let ok = false, why = '';
  try { [ok, why] = fn(); } catch (e) { why = 'lỗi khi kiểm: ' + e.message; }
  results.push({ name, ok, why });
};

// ---------- đọc design doc ----------
const sections = {};
for (const part of doc.split(/^## /m).slice(1)) {
  const m = part.match(/^(\d)\.\s*([^\n]*)\n([\s\S]*)$/);
  if (m) sections[m[1]] = m[3].split('\n').filter((l) => !/TODO|^\s*>/.test(l)).join('\n').trim();
}
// ---------- tiện ích OpenAPI ----------
const deref = (x) => {
  let o = x;
  for (let i = 0; o && o.$ref && i < 10; i++) o = o.$ref.replace(/^#\//, '').split('/').reduce((a, k) => a?.[k], api);
  return o;
};
const ops = () => Object.entries(api?.paths ?? {}).flatMap(([p, item]) =>
  ['get', 'post', 'put', 'patch', 'delete'].filter((m) => item[m]).map((m) => ({ path: p, method: m, op: item[m], params: [...(item.parameters ?? []), ...(item[m].parameters ?? [])].map(deref) })));
const find = (method, re) => ops().find((o) => o.method === method && re.test(o.path));
const responses = (o) => Object.entries(o.op.responses ?? {}).map(([code, r]) => [code, deref(r)]);
const schemaOf = (r) => deref(Object.values(r?.content ?? {})[0]?.schema);
const props = (s) => {                                              // gộp properties của allOf
  s = deref(s); if (!s) return {};
  return Object.assign({}, ...(s.allOf ?? []).map(props), s.properties ?? {});
};

check('Design doc: đủ 6 mục, mỗi mục ≥ 150 ký tự nội dung thật', () => {
  const missing = ['1', '2', '3', '4', '5', '6'].filter((k) => (sections[k] ?? '').length < 150);
  return [missing.length === 0, missing.length ? `mục thiếu hoặc quá ngắn: ${missing.join(', ')}` : 'đủ'];
});
check('Ước lượng: ≥ 2 con số theo giây và nói rõ ĐỈNH', () => {
  const s = sections['2'] ?? '';
  const rates = s.match(/\d[\d.,]*\s*(req\/s|request\/s|lượt\/s|\/s|QPS|rps)/gi) ?? [];
  const peak = /đỉnh|peak|spike/i.test(s);
  return [rates.length >= 2 && peak, `${rates.length} con số/giây${peak ? ', có đỉnh' : ', KHÔNG nói đỉnh'}`];
});
check('OpenAPI 3.1 đọc được và lint 0 lỗi (redocly)', () => {
  if (!api) return [false, `YAML hỏng: ${parseError}`];
  if (!/^3\.1\./.test(String(api.openapi))) return [false, `openapi: ${api.openapi}`];
  const r = spawnSync('npx', ['redocly', 'lint', apiPath], { encoding: 'utf8' });
  const m = (r.stdout + r.stderr).match(/(\d+) errors?/);
  return [r.status === 0, r.status === 0 ? '0 lỗi' : `${m ? m[1] : '?'} lỗi lint`];
});
check('Tài nguyên: /v1/…, danh từ, có events, registrations, check-ins', () => {
  const paths = Object.keys(api?.paths ?? {});
  const verb = /^(get|create|update|delete|register|add|remove|list|fetch|do|set|checkin)([A-Z_-]|$)/i;
  const bad = paths.filter((p) => !p.startsWith('/v1/') || p.split('/').some((seg) => !seg.startsWith('{') && verb.test(seg)));
  const need = ['/events', '/registrations', '/check-ins'].filter((n) => !paths.some((p) => p.includes(n)));
  return [paths.length > 0 && !bad.length && !need.length, bad.length ? `đường có động từ/thiếu /v1: ${bad.join(', ')}` : need.length ? `thiếu: ${need.join(', ')}` : `${paths.length} đường đúng kiểu`];
});
check('Lỗi: mọi 4xx/5xx là application/problem+json; đăng ký có 409 và 422', () => {
  const bad = [];
  for (const o of ops()) for (const [code, r] of responses(o))
    if (/^[45]/.test(code) && !(r?.content && Object.keys(r.content).every((t) => t === 'application/problem+json'))) bad.push(`${o.method.toUpperCase()} ${o.path} ${code}`);
  const reg = find('post', /\/registrations$/);
  const codes = reg ? Object.keys(reg.op.responses ?? {}) : [];
  const ok = reg && !bad.length && codes.includes('409') && codes.includes('422');
  return [ok, !reg ? 'không có POST …/registrations' : bad.length ? `không phải problem+json: ${bad.slice(0, 3).join('; ')}${bad.length > 3 ? ' …' : ''}` : `409 ${codes.includes('409') ? '✓' : '✗'} 422 ${codes.includes('422') ? '✓' : '✗'}`];
});
check('Phân trang: mọi danh sách có limit + cursor và page.next, không trả mảng trần', () => {
  const lists = [], bad = [];
  for (const o of ops().filter((x) => x.method === 'get')) {
    const s = schemaOf(responses(o).find(([c]) => c === '200')?.[1]);
    if (s?.type === 'array') { bad.push(`${o.path} trả mảng trần`); continue; }
    const p = props(s);
    if (deref(p.data)?.type !== 'array') continue;
    lists.push(o.path);
    const names = o.params.map((x) => x?.name);
    const hasNext = 'next' in p || 'next' in props(p.page);
    if (!names.includes('limit') || !names.includes('cursor') || !hasNext) bad.push(`${o.path} thiếu ${['limit', 'cursor'].filter((n) => !names.includes(n)).concat(hasNext ? [] : ['next']).join('/')}`);
  }
  return [lists.length >= 2 && !bad.length, bad.length ? bad.join('; ') : `${lists.length} danh sách`];
});
check('Idempotency-Key trên POST đăng ký và POST check-in', () => {
  const miss = [['đăng ký', find('post', /\/registrations$/)], ['check-in', find('post', /\/check-?ins$/)]]
    .filter(([, o]) => !o || !o.params.some((x) => x?.in === 'header' && /^idempotency-key$/i.test(x.name))).map(([n]) => n);
  return [!miss.length, miss.length ? `thiếu ở: ${miss.join(', ')}` : 'có ở cả hai'];
});
check('Bảo mật: có securitySchemes + security; check-in khai 403', () => {
  const schemes = Object.keys(api?.components?.securitySchemes ?? {});
  const global = (api?.security ?? []).length > 0;
  const ci = find('post', /\/check-?ins$/);
  const ok = schemes.length && (global || ops().every((o) => o.op.security)) && ci && '403' in (ci.op.responses ?? {});
  return [Boolean(ok), `schemes: ${schemes.join(',') || '—'} · security toàn cục: ${global ? 'có' : 'không'} · check-in 403: ${ci && '403' in (ci.op.responses ?? {}) ? 'có' : 'không'}`];
});
check('Giới hạn tần suất: đăng ký khai 429 kèm header Retry-After', () => {
  const reg = find('post', /\/registrations$/);
  const r = reg && deref(reg.op.responses?.['429']);
  const ok = r && Object.keys(r.headers ?? {}).some((h) => /^retry-after$/i.test(h));
  return [Boolean(ok), !r ? 'không có 429' : ok ? '429 + Retry-After' : '429 thiếu Retry-After'];
});
check('Hàng chờ khi hết chỗ: trạng thái WAITLISTED (hoặc 202) trong hợp đồng + doc nói về hàng chờ', () => {
  const reg = find('post', /\/registrations$/);
  const ok2xx = reg && responses(reg).filter(([c]) => /^20[012]$/.test(c));
  const enumHas = ok2xx?.some(([, r]) => (deref(props(schemaOf(r)).status)?.enum ?? []).includes('WAITLISTED'));
  const has202 = ok2xx?.some(([c]) => c === '202');
  const docOk = /waitlist|hàng chờ/i.test(doc);
  return [Boolean((enumHas || has202) && docOk), `hợp đồng: ${enumHas ? 'WAITLISTED' : has202 ? '202' : 'không'} · doc: ${docOk ? 'có' : 'không'}`];
});

let score = 0;
for (const [i, r] of results.entries()) { if (r.ok) score++; console.log(`${r.ok ? '✓' : '✗'} ${String(i + 1).padStart(2)}. ${r.name} — ${r.why}`); }
console.log(`ĐIỂM: ${score}/10`);
process.exitCode = score === 10 ? 0 : 1;
