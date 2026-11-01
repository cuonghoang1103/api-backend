// diff.mjs — bài 7.4: so hai phiên bản openapi.yaml, tìm thay đổi PHÁ VỠ client cũ (luật của bài 4.1)
// Dùng: node openapi/diff.mjs <cũ.yaml> <mới.yaml>   — có thay đổi phá vỡ ⇒ exit 1 (để CI chặn)
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

const load = (f) => parse(readFileSync(f, 'utf8'));
const [oldDoc, newDoc] = process.argv.slice(2).map(load);
const out = [];
const say = (kind, where, msg) => out.push({ kind, line: `${{ break: '✗ PHÁ VỠ', warn: '⚠ CẨN THẬN', ok: '✓ an toàn' }[kind]}  ${where}: ${msg}` });

// $ref nội bộ ⇒ object thật (đủ cho tài liệu một tệp)
const deref = (doc, s) => (s?.$ref ? deref(doc, s.$ref.split('/').slice(1).reduce((x, k) => x[k], doc)) : s);
const typeOf = (s) => [].concat(s?.type ?? 'any').sort().join('|');

// dir = 'req' (client GỬI) hoặc 'res' (client NHẬN): cùng một thay đổi, hai chiều có luật ngược nhau
function schemas(where, a, b, dir) {
  a = deref(oldDoc, a); b = deref(newDoc, b);
  if (!a || !b) return;
  if (typeOf(a) !== typeOf(b)) return say('break', where, `kiểu ${typeOf(a)} ⇒ ${typeOf(b)}`);
  if (a.enum || b.enum) {
    const removed = (a.enum ?? []).filter((v) => !(b.enum ?? []).includes(v));
    const added = (b.enum ?? []).filter((v) => !(a.enum ?? []).includes(v));
    if (removed.length) say(dir === 'req' ? 'break' : 'warn', where, `bỏ giá trị ${removed.join(', ')}`);
    if (added.length) say(dir === 'res' ? 'warn' : 'ok', where, `thêm giá trị ${added.join(', ')}${dir === 'res' ? ' — client cũ có xử lý giá trị lạ không? (bài 4.1)' : ''}`);
  }
  const pa = a.properties ?? {}, pb = b.properties ?? {};
  const ra = new Set(a.required ?? []), rb = new Set(b.required ?? []);
  for (const k of Object.keys(pa)) {
    if (!(k in pb)) say(dir === 'res' ? 'break' : (b.additionalProperties === false ? 'break' : 'warn'), `${where}.${k}`,
      dir === 'res' ? 'trường bị bỏ khỏi câu trả lời' : 'trường bị bỏ khỏi request (client cũ còn gửi ⇒ 400)');
    else schemas(`${where}.${k}`, pa[k], pb[k], dir);
  }
  for (const k of Object.keys(pb)) {
    if (k in pa) continue;
    if (dir === 'req' && rb.has(k)) say('break', `${where}.${k}`, 'trường BẮT BUỘC mới trong request');
    else say('ok', `${where}.${k}`, dir === 'req' ? 'trường tuỳ chọn mới' : 'trường mới trong câu trả lời');
  }
  for (const k of rb) if (dir === 'req' && k in pa && !ra.has(k)) say('break', `${where}.${k}`, 'trước tuỳ chọn, nay bắt buộc');
  for (const k of ra) if (dir === 'res' && k in pb && !rb.has(k)) say('break', `${where}.${k}`, 'trước luôn có, nay có thể vắng');
  if (a.items || b.items) schemas(`${where}[]`, a.items, b.items, dir);
}

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
for (const [path, item] of Object.entries(oldDoc.paths)) {
  for (const m of METHODS.filter((x) => item[x])) {
    const where = `${m.toUpperCase()} ${path}`;
    const op = newDoc.paths[path]?.[m];
    if (!op) { say('break', where, 'thao tác bị xoá'); continue; }
    const pa = item[m].parameters ?? [], pb = op.parameters ?? [];
    for (const p of pb.map((x) => deref(newDoc, x))) {
      const old = pa.map((x) => deref(oldDoc, x)).find((q) => q.name === p.name && q.in === p.in);
      if (!old && p.required) say('break', where, `tham số bắt buộc mới ${p.name}`);
      else if (old) schemas(`${where} ?${p.name}`, old.schema, p.schema, 'req');
    }
    const ba = item[m].requestBody?.content?.['application/json']?.schema;
    const bb = op.requestBody?.content?.['application/json']?.schema;
    if (ba && bb) schemas(`${where} body`, ba, bb, 'req');
    for (const [code, r] of Object.entries(item[m].responses)) {
      if (!code.startsWith('2')) continue;
      const rn = op.responses[code];
      if (!rn) { say('break', where, `không còn trả ${code}`); continue; }
      schemas(`${where} → ${code}`, deref(oldDoc, r).content?.['application/json']?.schema,
        deref(newDoc, rn).content?.['application/json']?.schema, 'res');
    }
  }
}
for (const [path, item] of Object.entries(newDoc.paths))
  for (const m of METHODS.filter((x) => item[x] && !oldDoc.paths[path]?.[x])) say('ok', `${m.toUpperCase()} ${path}`, 'thao tác mới');
const seen = new Set();
for (const o of out) if (!seen.has(o.line)) { seen.add(o.line); console.log(o.line); }
const breaking = out.filter((o) => o.kind === 'break').length;
console.log(breaking ? `✗ ${breaking} thay đổi phá vỡ — không được phát hành vào /v2` : '✓ không có thay đổi phá vỡ');
process.exit(breaking ? 1 : 0);
