// cham-lab.mjs — máy chấm Lab 10B: chạy collection của bạn với API thật (phải XANH) rồi với 8 bản API bị cài bug (mỗi bản phải ĐỎ).
//   node postman/lab/cham-lab.mjs postman/lab/loi-giai.postman_collection.json
// Cần: newman (npx newman@6.2.3 hoặc NEWMAN=đường-dẫn). Mỗi bản API chạy trên một cổng riêng 4xxxx, xong là tắt.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const NEWMAN = process.env.NEWMAN ?? 'newman';
const file = path.resolve(process.argv[2] ?? 'postman/lab/khoi-dau.postman_collection.json');

export const BUGS = [
  ['B1 another student can read my booking', 'src/api/server.js', 'booking.userId === req.user.id ||', 'true ||'],
  ['B2 a lecturer passes the admin check', 'src/api/server.js', "req.user.role === role ?", "req.user.role !== 'STUDENT' ?"],
  ['B3 back-to-back bookings count as overlap', 'src/booking/service.js', 'b.start < end && start < b.end', 'b.start <= end && start <= b.end'],
  ['B4 exactly 30 seats needs approval', 'src/rules/booking.js', 'return seats > APPROVAL_SEATS;', 'return seats >= APPROVAL_SEATS;'],
  ['B5 Location points to a wrong path', 'src/api/server.js', "location('/api/bookings/' + booking.id)", "location('/api/booking/' + booking.id)"],
  ['B6 unknown fields are accepted', 'src/api/schemas.js', 'z.strictObject({', 'z.object({'],
  ['B7 rule errors answer 400, not 422', 'src/api/server.js', 'fail(res, 422, err.code)', 'fail(res, 400, err.code)'],
  ['B8 "my bookings" lists everyone', 'src/booking/myBookings.js', 'repo.listByUser(userId)', 'repo.list()'],
];

function copyApp(bug) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pmn-cham-'));
  for (const d of ['src', 'postman', 'node_modules', 'package.json']) fs.cpSync(path.join(ROOT, d), path.join(dir, d), { recursive: true, dereference: false, verbatimSymlinks: true });
  if (bug) {
    const [, f, from, to] = bug;
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    if (!src.includes(from)) throw new Error('không tìm thấy chỗ cài bug: ' + from);
    fs.writeFileSync(p, src.replace(from, to));
  }
  return dir;
}

async function startApi(dir, port) {
  const child = spawn(process.execPath, ['postman/server.js'], { cwd: dir, env: { ...process.env, PORT: String(port), ALLOW_RESET: '1' }, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`http://127.0.0.1:${port}/api/health`)).ok) return child; } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  child.kill();
  throw new Error('API không lên ở cổng ' + port);
}

function runNewman(port) {
  const out = path.join(os.tmpdir(), `pmn-newman-${port}.json`);
  const r = spawnSync(NEWMAN, ['run', file, '--env-var', `baseUrl=http://127.0.0.1:${port}`, '--reporters', 'json', '--reporter-json-export', out], { encoding: 'utf8' });
  let failed = [];
  try {
    failed = JSON.parse(fs.readFileSync(out, 'utf8')).run.failures.map((f) => f.error.test || f.error.name);
  } catch { failed = ['(không đọc được báo cáo newman: ' + (r.stderr || r.stdout).trim().split('\n')[0] + ')']; }
  fs.rmSync(out, { force: true });
  return { code: r.status, failed };
}

async function one(bug, port) {
  const dir = copyApp(bug);
  const api = await startApi(dir, port);
  try { return runNewman(port); } finally { api.kill(); fs.rmSync(dir, { recursive: true, force: true }); }
}

const base = await one(null, 43190);
console.log(`real API: ${base.code === 0 ? 'green ✓' : 'RED ✗ — ' + base.failed.slice(0, 3).join(' · ')}`);
if (base.code !== 0) { console.log('Score: 0/10 — a collection that is red on the real API proves nothing.'); process.exit(1); }
let caught = 0;
for (const [i, bug] of BUGS.entries()) {
  const r = await one(bug, 43191 + i);
  const ok = r.code !== 0;
  if (ok) caught++;
  console.log(`${ok ? 'caught ✓' : 'missed ✗'}  ${bug[0]}${ok ? '  ← ' + r.failed[0] : ''}`);
}
const score = 2 + caught;          // 2 points for a green run on the real API, 1 per bug caught
console.log(`caught ${caught}/8 · Score: ${score}/10 (pass ≥ 7)`);
process.exit(score >= 7 ? 0 : 1);
