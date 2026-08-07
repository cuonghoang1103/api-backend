#!/usr/bin/env node
/**
 * Đếm quy mô mã nguồn thật của repo → `frontend/src/data/codebaseStats.json`.
 *
 * ─── VÌ SAO PHẢI SINH RA FILE, KHÔNG ĐẾM LÚC CHẠY ──────────────────────────
 * Trang /about muốn khoe những con số mà chỉ REPO mới biết: bao nhiêu commit,
 * bao nhiêu trang, bao nhiêu bảng dữ liệu. Container production KHÔNG đếm được:
 * `.dockerignore` loại `.git`, và `deploy.sh` cũng `--exclude='.git/'` khi
 * rsync. Nên số phải chốt ở MÁY LOCAL, trước lúc đẩy đi.
 *
 * ─── KHI NÀO CHẠY ──────────────────────────────────────────────────────────
 * `deploy.sh` gọi script này TRƯỚC bước rsync, nên mỗi lần deploy là số tự tươi
 * lại. Chạy tay: `npm run gen:codebase-stats`.
 *
 * ⚠️ ĐỪNG sửa tay file JSON sinh ra. Sửa tay = số bịa, đúng cái bệnh mà cả
 * trang /about đang được chữa. Muốn thêm chỉ số thì thêm phép ĐẾM ở đây.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'frontend', 'src', 'data', 'codebaseStats.json');

/** Chạy lệnh, trả `null` nếu hỏng. Một phép đếm hỏng KHÔNG được làm hỏng cả
 *  deploy — trang about sẽ tự ẩn ô đó đi. */
function sh(cmd, args) {
  try {
    return execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function count(cmd, args) {
  const out = sh(cmd, args);
  if (out === null) return null;
  const n = Number(out);
  return Number.isFinite(n) ? n : null;
}

/** Duyệt cây thư mục, đếm file khớp `match`. Bỏ qua thư mục sinh tự động. */
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', 'host-cache', 'uploads']);
function walk(dir, match, acc = { files: 0, lines: 0 }) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (e.name.startsWith('.next') || SKIP_DIRS.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) { walk(full, match, acc); continue; }
    if (!match(e.name)) continue;
    acc.files++;
    try {
      // Đếm dòng bằng cách đếm ký tự xuống dòng — không tách mảng, đỡ tốn bộ nhớ
      // trên những file lớn (có file dữ liệu đề thi vài MB).
      const buf = readFileSync(full);
      let n = 0;
      for (let i = 0; i < buf.length; i++) if (buf[i] === 10) n++;
      acc.lines += n;
    } catch { /* file đọc không được thì chỉ không cộng dòng */ }
  }
  return acc;
}

const isSource = (name) => /\.(ts|tsx|js|jsx|mjs)$/.test(name) && !/\.d\.ts$/.test(name);

// ── Git ──────────────────────────────────────────────────────────────────────
const commits = count('git', ['rev-list', '--count', 'HEAD']);

/** ⚠️ BẪY: `git log --reverse --max-count=1` KHÔNG trả commit đầu tiên. Git cắt
 *  `--max-count` TRƯỚC rồi mới đảo, nên nó trả commit MỚI NHẤT — bản đầu của
 *  script này báo "dựng trong 1 ngày" cho một repo 1803 commit. Đi từ commit
 *  gốc (`--max-parents=0`) thì không có chỗ nào để hiểu nhầm. */
const rootCommit = (sh('git', ['rev-list', '--max-parents=0', 'HEAD']) || '').split('\n').filter(Boolean).pop();
const firstCommitDate = rootCommit
  ? sh('git', ['show', '-s', '--format=%ad', '--date=short', rootCommit])
  : null;
const lastCommitDate = sh('git', ['log', '-1', '--format=%ad', '--date=short']);

// ── Đếm từ cây thư mục ───────────────────────────────────────────────────────
const appDir = join(ROOT, 'frontend', 'src', 'app');
const pages = walk(appDir, (n) => n === 'page.tsx').files || null;
const apiRouters = walk(join(ROOT, 'src', 'routes'), (n) => n.endsWith('.routes.ts')).files || null;

let migrations = null;
try {
  migrations = readdirSync(join(ROOT, 'prisma', 'migrations'), { withFileTypes: true })
    .filter((e) => e.isDirectory()).length;
} catch { /* thư mục không có → null */ }

let prismaModels = null;
try {
  const schema = readFileSync(join(ROOT, 'prisma', 'schema.prisma'), 'utf8');
  prismaModels = (schema.match(/^model\s+\w+/gm) || []).length || null;
} catch { /* schema không đọc được → null */ }

const backend = walk(join(ROOT, 'src'), isSource);
const frontend = walk(join(ROOT, 'frontend', 'src'), isSource);
const sourceFiles = backend.files + frontend.files || null;
const sourceLines = backend.lines + frontend.lines || null;

/** Số ngày từ commit đầu tới nay — dùng để nói "dựng trong N ngày" mà không
 *  phải nhớ sửa. */
let daysBuilding = null;
if (firstCommitDate) {
  const start = Date.parse(`${firstCommitDate}T00:00:00Z`);
  if (Number.isFinite(start)) daysBuilding = Math.max(1, Math.round((Date.now() - start) / 86_400_000));
}

const stats = {
  _comment: 'SINH TỰ ĐỘNG bởi scripts/gen-codebase-stats.mjs — đừng sửa tay.',
  commits,
  firstCommitDate,
  lastCommitDate,
  daysBuilding,
  pages,
  apiRouters,
  prismaModels,
  migrations,
  sourceFiles,
  sourceLines,
  generatedAt: new Date().toISOString(),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');

const shown = Object.entries(stats)
  .filter(([k]) => !k.startsWith('_') && k !== 'generatedAt')
  .map(([k, v]) => `${k}=${v}`)
  .join('  ');
console.log(`✓ codebaseStats.json  ${shown}`);
