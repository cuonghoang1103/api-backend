#!/usr/bin/env node
/**
 * Dựng một CSDL TEST mới tinh từ `prisma/migrations/**` (đợt 8c, 12/10/2026) — cho `test:work-db` ở CI và ở bộ kiểm
 * trước push của `deploy-nha.sh` (`scripts/kiem-ci-truoc-push.sh`).
 *
 *   DATABASE_URL=postgresql://…/ctw_test node scripts/db-test-tu-migration.mjs
 *
 * Vì sao không `prisma migrate deploy`: lịch sử migration của repo KHÔNG phát lại được trên CSDL trống (đo 12/10):
 *   - `20260706130000_add_music_and_profile` (đã deploy) tạo UNIQUE `post_music_post_id_key` rồi một index thường
 *     CÙNG TÊN ⇒ P3018/42P07 — cùng gốc với P3006 của `migrate dev` (CLAUDE.md);
 *   - vài bảng từng được tạo ngoài migration (vd `maker_devices` mà `20260813081500_add_maker_conversations` tham
 *     chiếu) ⇒ "relation does not exist".
 * Hệ quả đo thật 10/10: job "CT Work DB tests" của ci-lint.yml ĐỎ ở bước migrate từ đợt 6a tới nay — chưa test DB nào
 * từng chạy trên CI. Luật repo cấm sửa migration đã deploy, cấm `migrate resolve`/`db push`. Nên script này:
 *   1. áp TỪNG tệp migration theo thứ tự bằng `psql` (mỗi câu tự commit, câu hỏng chỉ ghi lại rồi đi tiếp) — giữ được
 *      mọi thứ schema.prisma không diễn tả (extension pgvector/pg_trgm, trigger tsvector, chỉ mục GIN, dữ liệu mặc định);
 *      câu trùng tên ở migration music được vá TRONG BỘ NHỚ thành `IF NOT EXISTS` (tệp trên đĩa không đổi);
 *   2. LẤP phần còn thiếu bằng `prisma migrate diff --from-url <csdl test> --to-schema-datamodel prisma/schema.prisma
 *      --script` (công cụ CLAUDE.md dùng để soi lệch) rồi áp script đó;
 *      — CHỈ phần THÊM (bảng/kiểu/chỉ mục/cột/ràng buộc), xem `phanThem`;
 *   3. KIỂM lại: diff lần hai không còn phần THÊM nào ⇒ đủ mọi bảng/cột code cần; còn thiếu ⇒ exit 1.
 * Không ghi `_prisma_migrations`: CSDL này chỉ để test rồi DROP.
 *
 * Chốt an toàn: chỉ nhận host cục bộ / dịch vụ CI (`localhost`, `127.0.0.1`, `::1`, `postgres`) và CSDL phải TRỐNG
 * (không có bảng nào trong schema public) — không bao giờ đè lên CSDL đang dùng.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Vá trong bộ nhớ các câu KHÔNG phát lại được trên CSDL trống. Khoá = tên thư mục migration. */
export const VA_MIGRATION = {
  '20260706130000_add_music_and_profile': (sql) =>
    sql.replace('CREATE INDEX "post_music_post_id_key"', 'CREATE INDEX IF NOT EXISTS "post_music_post_id_key"'),
};

/**
 * CHỈ giữ phần THÊM của script diff: tạo bảng/kiểu/chỉ mục, thêm cột/ràng buộc, thêm giá trị enum. Bỏ mọi DROP/ALTER
 * COLUMN: phần đó là lệch CÓ CHỦ Ý giữa migration và schema (cột tsvector GENERATED do migration tay thêm, schema
 * không khai) — production cũng mang đúng lệch đó, áp vào thì xoá mất cột tìm kiếm.
 * THUẦN — test ở scripts/db-test-tu-migration.test.mjs.
 */
export function phanThem(sql) {
  const cau = sql.replace(/^--.*$/gm, '').split(/;\s*\n/).map((x) => x.trim()).filter(Boolean);
  const giu = [];
  for (const c of cau) {
    if (/^CREATE (TABLE|TYPE|INDEX|UNIQUE INDEX|EXTENSION)\b/i.test(c) || /^ALTER TYPE\b[\s\S]*\bADD VALUE\b/i.test(c)) { giu.push(c); continue; }
    const m = /^(ALTER TABLE\s+\S+)\s+([\s\S]*)$/i.exec(c);
    if (!m) continue;
    const them = m[2].split(/,\s*\n/).map((x) => x.trim()).filter((x) => /^ADD\s+(COLUMN|CONSTRAINT)\b/i.test(x));
    if (them.length) giu.push(`${m[1]} ${them.join(',\n')}`);
  }
  return giu.map((c) => `${c};`).join('\n');
}
function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error('Cần DATABASE_URL trỏ tới một CSDL test TRỐNG.'); process.exit(2); }
  const u = new URL(url);
  if (!['localhost', '127.0.0.1', '::1', '[::1]', 'postgres'].includes(u.hostname)) {
    console.error(`Từ chối: "${u.hostname}" không phải Postgres cục bộ/CI.`); process.exit(2);
  }

  const migDir = path.join(root, 'prisma/migrations');
  const dirs = readdirSync(migDir).filter((d) => statSync(path.join(migDir, d)).isDirectory()).sort();

  // psql không hiểu tham số `schema` của Prisma trong URI.
  const psqlUrl = new URL(url); psqlUrl.search = '';
  const coPsql = spawnSync('psql', ['--version'], { encoding: 'utf8' }).status === 0;
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ctw-mig-'));

  function chay(sqlFile, dungKhiLoi = true) {
    if (coPsql) {
      return spawnSync('psql', [psqlUrl.toString(), '-X', '-q', '-v', `ON_ERROR_STOP=${dungKhiLoi ? 1 : 0}`, '-f', sqlFile], { encoding: 'utf8', env: { ...process.env, PGOPTIONS: '-c client_min_messages=warning' } });
    }
    return spawnSync(path.join(root, 'node_modules/.bin/prisma'), ['db', 'execute', '--url', url, '--file', sqlFile], { encoding: 'utf8', cwd: root });
  }

  const prismaBin = path.join(root, 'node_modules/.bin/prisma');
  function diffSql() {
    const out = path.join(tmp, `diff-${Date.now()}.sql`);
    const r = spawnSync(prismaBin, ['migrate', 'diff', '--from-url', url, '--to-schema-datamodel', path.join(root, 'prisma/schema.prisma'), '--script', '--output', out], { encoding: 'utf8', cwd: root });
    if (r.status !== 0) throw new Error(`prisma migrate diff hỏng:\n${r.stderr || r.stdout}`);
    return readFileSync(out, 'utf8');
  }

  const loiCua = (r) => (`${r.stderr ?? ''}`.match(/ERROR: .*/g) ?? []);

  try {
    // CSDL phải trống.
    const kiem = path.join(tmp, 'kiem.sql');
    writeFileSync(kiem, `DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public') THEN RAISE EXCEPTION 'CSDL_KHONG_TRONG'; END IF; END $$;`);
    const k = chay(kiem);
    if (k.status !== 0) {
      console.error(/CSDL_KHONG_TRONG/.test(`${k.stdout}${k.stderr}`) ? 'Từ chối: CSDL đã có bảng — script này chỉ dựng CSDL test MỚI.' : `Không nối được CSDL:\n${k.stderr || k.stdout}`);
      process.exit(2);
    }
    const t0 = Date.now();
    const hong = [];
    for (const d of dirs) {
      const f = path.join(migDir, d, 'migration.sql');
      let sql;
      try { sql = readFileSync(f, 'utf8'); } catch { continue; }
      const va = VA_MIGRATION[d];
      if (va) sql = va(sql);
      const tf = path.join(tmp, `${d}.sql`);
      writeFileSync(tf, sql);
      const r = chay(tf, false);
      const loi = loiCua(r);
      if (r.status !== 0 || loi.length) hong.push({ d, loi: loi.length ? loi : [String(r.stderr || r.stdout).slice(-300)] });
    }
    console.log(`· ${dirs.length} migration đã phát lại (${((Date.now() - t0) / 1000).toFixed(0)}s, ${coPsql ? 'psql' : 'prisma db execute'}); ${hong.length} tệp có câu hỏng:`);
    for (const h of hong) console.log(`    ${h.d}: ${h.loi[0]}${h.loi.length > 1 ? ` (+${h.loi.length - 1})` : ''}`);

    // Lấp phần THIẾU so với schema.prisma (bảng/cột/chỉ mục mà lịch sử migration không tạo được).
    const lap = phanThem(diffSql());
    if (lap) {
      const lf = path.join(tmp, 'lap.sql');
      writeFileSync(lf, lap);
      const r = chay(lf, false);
      const loi = loiCua(r);
      console.log(`· đã lấp phần thiếu bằng migrate diff (${lap.split(';\n').length} câu${loi.length ? `, ${loi.length} câu hỏng: ${loi[0]}` : ''})`);
    }
    // Còn lệch chỉ mục/khoá ngoại (cùng tên, khác định nghĩa — production cũng thế) thì bỏ qua; còn THIẾU bảng/kiểu/cột
    // thì code chạy trên CSDL này sẽ vỡ ⇒ dừng.
    const conThieu = phanThem(diffSql()).split(';\n').filter((c) => /^CREATE (TABLE|TYPE)\b|\bADD\s+COLUMN\b/i.test(c)).join(';\n');
    if (conThieu) { console.error(`✗ CSDL test vẫn THIẾU so với schema.prisma:\n${conThieu.slice(0, 2000)}`); process.exit(1); }
    console.log(`✓ CSDL test đủ mọi bảng/cột của schema.prisma trong ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
