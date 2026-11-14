/**
 * Phần dùng chung của scripts/gop-y/*.mjs — đường MÁY cho Claude điều phối đọc/đối chiếu/đăng góp ý khoá học.
 * Xem docs/gop-y-khoa-hoc.md.
 *
 * Cấu hình (KHÔNG có biến env mới cho backend — dùng lại INTERNAL_API_TOKEN):
 *   INTERNAL_API_TOKEN   khoá nội bộ, TRÙNG giá trị trong /opt/cuonghoangdev/.env của prod.
 *                        Không đặt env ⇒ đọc tệp ~/.config/cuongthai/internal-api-token (một dòng).
 *   GOP_Y_API            gốc web, mặc định https://cuongthai.com (thử local: http://localhost:3001).
 *
 * ⚠️ Không bao giờ in khoá ra màn hình / tệp kết quả.
 */
import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const GOC_REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const GOC_API = (process.env.GOP_Y_API || 'https://cuongthai.com').replace(/\/+$/, '');

export function layKhoa() {
  if (process.env.INTERNAL_API_TOKEN?.trim()) return process.env.INTERNAL_API_TOKEN.trim();
  const tep = path.join(os.homedir(), '.config', 'cuongthai', 'internal-api-token');
  if (existsSync(tep)) {
    const k = readFileSync(tep, 'utf8').trim();
    if (k) return k;
  }
  console.error(
    '✗ Thiếu khoá nội bộ: đặt INTERNAL_API_TOKEN (cùng giá trị với prod) hoặc ghi vào ~/.config/cuongthai/internal-api-token.\n' +
      '  Lưu ý: route /api/v1/internal/* trả 404 khi khoá sai HOẶC khi backend chưa đặt INTERNAL_API_TOKEN.',
  );
  process.exit(2);
}

/** Gọi /api/v1/internal/<duong>. Lỗi ⇒ ném Error có thông điệp của máy chủ (không kèm khoá). */
export async function goiNoiBo(method, duong, body) {
  const res = await fetch(`${GOC_API}/api/v1/internal${duong}`, {
    method,
    headers: { 'content-type': 'application/json', 'x-internal-token': layKhoa(), accept: 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const goiY = res.status === 404 && /\/course-suggestions/.test(duong) && !json?.code
      ? ' (404 trần = khoá sai, backend chưa đặt INTERNAL_API_TOKEN, hoặc bản deploy chưa có tính năng)'
      : '';
    const e = new Error(`HTTP ${res.status} ${json?.code ?? ''} ${json?.message ?? ''}${goiY}`.trim());
    e.status = res.status;
    e.body = json;
    throw e;
  }
  return json.data;
}

/** Đọc cờ dạng `--ten gia-tri` / `--co` (boolean). */
export function docCo(argv = process.argv.slice(2)) {
  const co = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const ten = a.slice(2);
    const tiep = argv[i + 1];
    if (tiep === undefined || tiep.startsWith('--')) co[ten] = true;
    else { co[ten] = tiep; i++; }
  }
  return co;
}

// ─────────────────────── tìm tệp nội dung của khoá ───────────────────────

let chiMuc = null;

/**
 * Chỉ mục slug khoá ⇒ { tep, thuMuc[] } từ content/courses/*.mjs + content/academy/*.mjs: đọc `slug: '…'` đầu tiên
 * sau `course:` và các thư mục con được `import … from './x/…'` (vd SWP391.mjs ⇒ ./swp391/).
 */
function dungChiMuc() {
  if (chiMuc) return chiMuc;
  chiMuc = new Map();
  for (const nhom of ['content/courses', 'content/academy']) {
    const goc = path.join(GOC_REPO, nhom);
    if (!existsSync(goc)) continue;
    for (const ten of readdirSync(goc)) {
      if (!ten.endsWith('.mjs') || ten.startsWith('_')) continue;
      const tep = path.join(goc, ten);
      let chu = '';
      try { chu = readFileSync(tep, 'utf8'); } catch { continue; }
      const sauCourse = chu.slice(Math.max(0, chu.search(/\bcourse\s*:/)));
      const m = sauCourse.match(/\bslug\s*:\s*['"]([^'"]+)['"]/);
      const thuMuc = new Set();
      for (const im of chu.matchAll(/from\s+['"]\.\/([^/'"]+)\//g)) {
        const tm = path.join(goc, im[1]);
        if (existsSync(tm) && statSync(tm).isDirectory()) thuMuc.add(realpathSync.native(tm));
      }
      const coBan = path.join(goc, ten.replace(/\.mjs$/, ''));
      // macOS không phân biệt hoa/thường: SWP391/ và swp391/ là MỘT thư mục ⇒ realpath để khỏi trùng.
      if (existsSync(coBan) && statSync(coBan).isDirectory()) thuMuc.add(realpathSync.native(coBan));
      const muc = { tep, thuMuc: [...thuMuc], ma: ten.replace(/\.mjs$/, '') };
      if (m) chiMuc.set(m[1], muc);
      chiMuc.set(`ma:${muc.ma.toUpperCase()}`, muc);
    }
  }
  return chiMuc;
}

function lietKeTep(thuMuc, out = []) {
  for (const ten of readdirSync(thuMuc)) {
    const p = path.join(thuMuc, ten);
    const st = statSync(p);
    if (st.isDirectory()) lietKeTep(p, out);
    else if (/\.(mjs|md|json)$/.test(ten)) out.push(p);
  }
  return out;
}

const rel = (p) => path.relative(GOC_REPO, p);

/**
 * Tệp nội dung của một khoá + (nếu có) tệp chứa bài cụ thể.
 * @returns {{ tepKhoa: string[], thuMucKhoa: string[], tepBai: string[] }}
 */
export function timTepNoiDung(course, lesson) {
  const cm = dungChiMuc();
  const muc = cm.get(course.slug) || (course.courseCode ? cm.get(`ma:${course.courseCode.toUpperCase()}`) : null);
  if (!muc) return { tepKhoa: [], thuMucKhoa: [], tepBai: [] };
  const tepBai = [];
  if (lesson) {
    const kim = [lesson.slug, lesson.title?.split('|||').pop()?.trim()].filter((x) => x && x.length >= 6);
    const ung = [muc.tep, ...muc.thuMuc.flatMap((t) => lietKeTep(t))];
    for (const k of kim) {
      for (const p of ung) {
        try { if (readFileSync(p, 'utf8').includes(k) && !tepBai.includes(rel(p))) tepBai.push(rel(p)); } catch { /* bỏ */ }
      }
      if (tepBai.length) break; // khớp slug là đủ chắc, không cần dò theo tiêu đề
    }
  }
  return { tepKhoa: [rel(muc.tep)], thuMucKhoa: muc.thuMuc.map(rel), tepBai: tepBai.slice(0, 10) };
}
