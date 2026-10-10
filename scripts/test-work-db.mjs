#!/usr/bin/env node
/**
 * D1 (đợt 6a): chạy MỌI tệp test DB của CT Work — `src/routes/work.*.db.test.ts` và
 * `src/services/work/**\/*.db.test.ts` — TUẦN TỰ, mỗi tệp một tiến trình, với WORK_DB_TEST=1.
 *
 * Vì sao tuần tự từng tệp: các tệp cùng dựng không gian/người dùng thật trên một Postgres và đếm
 * thông báo/email theo người — chạy song song là đua nhau. Một tiến trình mỗi tệp ⇒ một tệp treo
 * (server không đóng, prisma không ngắt) không kéo cả bộ theo; có trần thời gian mỗi tệp.
 *
 *   npm run test:work-db                      # cần DATABASE_URL trỏ Postgres đã `prisma migrate deploy`
 *   npm run test:work-db -- portal ctw1a      # chỉ các tệp có tên chứa một trong các từ
 *
 * KHÔNG BAO GIỜ trỏ vào CSDL production: test tạo + xoá dữ liệu thật (đã chặn host không phải
 * localhost/127.0.0.1/postgres trừ khi đặt WORK_DB_TEST_ALLOW_REMOTE=1).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filters = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const PER_FILE_TIMEOUT_MS = Number(process.env.WORK_DB_TEST_TIMEOUT_MS || 600_000);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.db.test.ts')) out.push(path.relative(root, p));
  }
  return out;
}

const files = [
  ...readdirSync(path.join(root, 'src/routes')).filter((n) => /^work\..+\.db\.test\.ts$/.test(n)).map((n) => `src/routes/${n}`),
  ...walk(path.join(root, 'src/services/work')),
].sort().filter((f) => !filters.length || filters.some((w) => f.includes(w)));

if (!files.length) {
  console.error('Không có tệp test DB nào khớp.');
  process.exit(1);
}

// Chốt an toàn: chỉ Postgres cục bộ / service CI (tên host `postgres` hoặc localhost).
try {
  let url = process.env.DATABASE_URL;
  if (!url) {
    const { readFileSync } = await import('node:fs');
    const m = /^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m.exec(readFileSync(path.join(root, '.env'), 'utf8'));
    url = m?.[1];
  }
  const host = url ? new URL(url).hostname : '';
  if (!['localhost', '127.0.0.1', '::1', 'postgres', ''].includes(host) && process.env.WORK_DB_TEST_ALLOW_REMOTE !== '1') {
    console.error(`Từ chối chạy: DATABASE_URL trỏ tới "${host}" — test DB chỉ chạy trên Postgres cục bộ/CI (đặt WORK_DB_TEST_ALLOW_REMOTE=1 nếu chắc chắn).`);
    process.exit(2);
  }
} catch { /* .env không có — để prisma tự báo */ }

const tsx = path.join(root, 'node_modules/.bin/tsx');
// Đợt 6: dây bẫy R2 — mọi tiến trình test nạp scripts/r2-tripwire.mjs; kết nối nào tới endpoint R2 THẬT bị chặn + ghi
// vào tệp này. Cuối bộ: tệp có dòng nào ⇒ cả bộ ĐỎ (rác thử từng lên bucket production — 10/10 dọn tay 98 tệp).
const tripLog = path.join(mkdtempSync(path.join(os.tmpdir(), 'ctw-r2-trip-')), 'hits.jsonl');
const tripImport = `--import=${path.join(root, 'scripts/r2-tripwire.mjs')}`;
const results = [];
const t0 = Date.now();
for (const f of files) {
  const t = Date.now();
  process.stdout.write(`\n━━ ${f}\n`);
  const r = spawnSync(tsx, ['--test', '--test-reporter=dot', f], {
    cwd: root, stdio: 'inherit', timeout: PER_FILE_TIMEOUT_MS,
    env: { ...process.env, WORK_DB_TEST: '1', R2_TRIPWIRE_LOG: tripLog, NODE_OPTIONS: [process.env.NODE_OPTIONS, tripImport].filter(Boolean).join(' ') },
  });
  const ok = r.status === 0;
  const why = r.error?.code === 'ETIMEDOUT' ? `quá ${PER_FILE_TIMEOUT_MS / 1000}s` : r.signal ? `tín hiệu ${r.signal}` : `exit ${r.status}`;
  results.push({ f, ok, why, s: ((Date.now() - t) / 1000).toFixed(1) });
  process.stdout.write(`${ok ? '✓' : '✗'} ${f} (${results.at(-1).s}s${ok ? '' : `, ${why}`})\n`);
}

const failed = results.filter((r) => !r.ok);
const hits = existsSync(tripLog) ? readFileSync(tripLog, 'utf8').trim().split('\n').filter(Boolean) : [];
if (hits.length) {
  console.log(`\n✗ r2-tripwire: ${hits.length} kết nối tới R2 THẬT bị chặn trong lúc test:`);
  for (const h of hits.slice(0, 20)) console.log(`  ${h}`);
  failed.push({ f: 'r2-tripwire', why: `${hits.length} kết nối tới R2 thật` });
} else {
  console.log('\n✓ r2-tripwire: 0 kết nối tới endpoint R2 thật');
}
console.log(`\n══ test:work-db — ${results.filter((r) => r.ok).length}/${results.length} tệp xanh trong ${((Date.now() - t0) / 1000).toFixed(0)}s`);
for (const r of failed) console.log(`  ✗ ${r.f} — ${r.why}`);
process.exit(failed.length ? 1 : 0);
