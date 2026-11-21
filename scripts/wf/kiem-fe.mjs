#!/usr/bin/env node
/**
 * kiem-fe.mjs — CHẠY THẬT mọi câu hỏi tiếng Anh kiểu FE của khoá Web Foundations có trường `chay`
 * (content/courses/web-foundations/_on-tap/fe*.mjs) và so output với phương án đúng.
 *   node scripts/wf/kiem-fe.mjs      ⇒ "… chạy thật N: N đúng, 0 sai"
 * kieu: js (Node 22.23 qua ~/.nvm, TZ mặc định Asia/Ho_Chi_Minh, đổi bằng chay.tz) · html (Chromium/Playwright, gom console)
 *       sql / sqlloi (node:sqlite) · ts (tsc --strict của repo trong thư mục tạm: `loi` phải lỗi, `dung` phải sạch) · semver.
 */
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const GOC = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const require = createRequire(GOC + '/package.json');
const { FE_THO, FE_CUOI_THO } = await import(GOC + '/content/courses/web-foundations/_on-tap/fe.mjs');
const NODE22 = process.env.HOME + '/.nvm/versions/node/v22.23.3/bin/node';
const TSC = GOC + '/node_modules/.bin/tsc';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kiemfe-'));
const all = [...Object.values(FE_THO).flat(), ...FE_CUOI_THO];
let ok = 0, bad = 0, html = [];
const dung = (q) => q.options[q.correctIndex].split('|||')[0];
const report = (q, got, pass) => { if (pass) ok++; else { bad++; console.log('✗', q.id, '| got:', JSON.stringify(got), '| expected:', JSON.stringify(dung(q))); } };
for (const q of all) {
  const c = q.chay; if (!c) continue;
  if (c.kieu === 'js') {
    const f = path.join(tmp, q.id + '.mjs'); fs.writeFileSync(f, c.ma || q.code);
    let out = '';
    try { out = execFileSync(NODE22, ['--no-warnings', f], { env: { ...process.env, TZ: c.tz || 'Asia/Ho_Chi_Minh' }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { out = (e.stdout || '') + ' [exit ' + e.status + '] ' + (e.stderr || '').split('\n')[0]; }
    const got = out.trim().split('\n').join(' ');
    report(q, got, got === dung(q));
  } else if (c.kieu === 'sql') {
    const { DatabaseSync } = await import('node:sqlite');
    const db = new DatabaseSync(':memory:'); db.exec(c.setup);
    const rows = db.prepare(q.code).all();
    const got = rows.map((r) => Object.values(r).join(c.noiCot || ', ')).join(c.noi);
    report(q, got, got === dung(q));
  } else if (c.kieu === 'sqlloi') {
    const { DatabaseSync } = await import('node:sqlite');
    const db = new DatabaseSync(':memory:'); db.exec(c.setup);
    let msg = 'no error'; try { db.exec(c.sai); } catch (e) { msg = e.message; }
    report(q, msg, /UNIQUE constraint failed/.test(msg));
  } else if (c.kieu === 'semver') {
    const semver = require('semver');
    const allowed = q.options.filter((o) => semver.satisfies(o, c.range));
    report(q, allowed.join(','), allowed.length === 1 && allowed[0] === dung(q));
  } else if (c.kieu === 'ts') {
    const run = (src) => { const f = path.join(tmp, q.id + Math.random().toString(36).slice(2) + '.ts'); fs.writeFileSync(f, src + '\nexport {};\n');
      try { execFileSync(TSC, ['--noEmit', '--strict', '--target', 'es2022', '--lib', 'es2022', f], { encoding: 'utf8', cwd: tmp }); return 0; } catch (e) { return (e.stdout || '').split('\n').filter((l) => l.includes('error TS')).length || 1; } };
    let pass = true; const notes = [];
    if (c.loi) { const n = run(c.loi); notes.push('loi=' + n); if (!n) pass = false; }
    for (const d of c.dung || []) { const n = run(d); notes.push('dung=' + n); if (n) pass = false; }
    report(q, notes.join(' '), pass);
  } else if (c.kieu === 'html') html.push(q);
}
if (html.length) {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const http = await import('node:http');
  const srv = http.createServer((req, res) => { const q = html.find((x) => req.url === '/' + x.id); res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end('<!doctype html><meta charset="utf-8">' + (q ? q.chay.ma : '')); });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  for (const q of html) {
    const p = await b.newPage(); const logs = [];
    p.on('console', (m) => logs.push(m.text()));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/' + q.id); await p.waitForTimeout(200);
    const got = logs.join(' '); report(q, got, got === dung(q)); await p.close();
  }
  await b.close(); srv.close();
}
const total = all.length, coCode = all.filter((q) => q.code).length, coChay = all.filter((q) => q.chay).length;
console.log(`tổng ${total} câu (${Object.values(FE_THO).map((x) => x.length).join('/')} + cuối ${FE_CUOI_THO.length}); có code ${coCode}; chạy thật ${coChay}: ${ok} đúng, ${bad} sai`);
const pos = [0, 0, 0, 0]; all.forEach((q) => pos[q.correctIndex]++); console.log('phân bố đáp án A/B/C/D:', pos.join('/'));
const thieu = all.filter((q) => q.code && !q.chay); if (thieu.length) console.log('câu có code mà chưa chạy:', thieu.map((q) => q.id).join(', '));
const ids = all.map((q) => q.id); if (new Set(ids).size !== ids.length) console.log('TRÙNG id!');
