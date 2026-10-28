/**
 * codelab-sql-node.mjs — máy chấm SQL của Code Lab chạy trong NODE (29/10/2026).
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 * Dùng CHÍNH bộ chạy + bộ so của trình duyệt (frontend/src/components/code-lab/cham/sqlRunner.ts,
 * chamSql.ts, sqlSoSanh.ts — nạp bằng tsx) với PGlite bản Node, để:
 *   - bộ xuất đề (codelab-xuat-de.mjs) DỰNG `mongDoi` của mọi kiểm SQL bằng cách chạy LỜI GIẢI — tác giả
 *     không chép tay bảng kết quả, và bảng đó khớp từng byte với cái trình duyệt sẽ so;
 *   - kiểm nhanh lời giải/khởi đầu không cần Chromium (test, soạn đề).
 *
 * PGlite KHÔNG nằm trong package.json của repo (26 MB — không đáng đưa vào ảnh Docker backend chỉ để soạn
 * đề). Lần đầu chạy, script tự cài đúng phiên bản ghim (PGLITE_PHIEN_BAN) vào ~/.cache/cuongthai-pglite/<bản>
 * (`npm i --prefix`, không đụng node_modules/lock của repo). Đặt PGLITE_DIR=<thư mục chứa node_modules> để
 * dùng bản có sẵn.
 *
 * Máy chấm SQL KHÔNG chạy trên VPS: mã người học không bao giờ chạy trên máy chủ (src/services/codeLab.cham.ts).
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHAM = path.join(GOC, 'frontend/src/components/code-lab/cham');

let _mod = null;
/** Nạp các mô-đun TS của máy chấm (qua tsx). */
export async function napMayCham() {
  if (_mod) return _mod;
  const { tsImport } = await import('tsx/esm/api');
  const [runner, cham, soSanh, loi] = await Promise.all(['sqlRunner.ts', 'chamSql.ts', 'sqlSoSanh.ts', 'sqlLoi.ts']
    .map((t) => tsImport(pathToFileURL(path.join(CHAM, t)).href, import.meta.url)));
  _mod = { runner, cham, soSanh, loi };
  return _mod;
}

/** Thư mục node_modules có @electric-sql/pglite đúng bản ghim (cài nếu thiếu). */
async function thuMucPglite(phienBan) {
  const ung = [process.env.PGLITE_DIR, GOC, path.join(os.homedir(), '.cache/cuongthai-pglite', phienBan)].filter(Boolean);
  for (const d of ung) {
    const pj = path.join(d, 'node_modules/@electric-sql/pglite/package.json');
    if (fs.existsSync(pj) && JSON.parse(fs.readFileSync(pj, 'utf8')).version === phienBan) return d;
  }
  const dich = ung[ung.length - 1];
  fs.mkdirSync(dich, { recursive: true });
  if (!fs.existsSync(path.join(dich, 'package.json'))) fs.writeFileSync(path.join(dich, 'package.json'), '{"private":true}\n');
  console.error(`[sql] cài @electric-sql/pglite@${phienBan} vào ${dich} (một lần)…`);
  execFileSync('npm', ['i', '--prefix', dich, `@electric-sql/pglite@${phienBan}`, '--no-audit', '--no-fund', '--save-exact'], { stdio: 'inherit' });
  return dich;
}

let _may = null;
/** Máy SQL (một phiên PGlite dùng lại) — cùng giao diện `chay(kb)` với worker trình duyệt. */
export async function layMaySql() {
  if (_may) return _may;
  const { runner } = await napMayCham();
  const d = await thuMucPglite(runner.PGLITE_PHIEN_BAN);
  const req = createRequire(path.join(d, 'package.json'));
  const goi = (ten) => import(pathToFileURL(req.resolve(ten)).href);
  const [{ PGlite }, { citext }] = await Promise.all([goi('@electric-sql/pglite'), goi('@electric-sql/pglite/contrib/citext')]);
  // eslint-disable-next-line no-new-func
  const CL = new Function(`${runner.SQL_RUNNER_SRC}\nreturn __CL_SQL__;`)();
  _may = await CL.tao(PGlite, citext);
  return _may;
}

/**
 * Chạy một kiểm với các tệp cho trước. Trả { dat, thay, bang, loiDe, truoc } — `bang` là bảng THỰC đã chuẩn
 * hoá (dùng làm mongDoi khi chạy lời giải). `mong` null ⇒ không so.
 */
export async function chayKiemSql(tj, k, files, mong = null) {
  const { cham } = await napMayCham();
  if (k.kiem === 'ma-nguon') return { dat: null, boQua: 'ma-nguon' };
  const tep = cham.tepCuaKiem(tj, k, files);
  const sql = files[tep];
  if (sql == null) return { dat: false, thay: `thiếu tệp ${tep}` };
  const truoc = cham.kiemTruocKhiChay(sql);
  if (truoc) return { dat: false, thay: truoc.vi, truoc };
  const kb = cham.dungKichBan(tj, k, sql);
  const may = await layMaySql();
  const kq = await may.chay(kb);
  return cham.danhGiaKichBan(k, kb, sql, kq, mong);
}

const CAN_MONG = new Set(['ket-qua', 'sau-lenh']);

/**
 * Điền `mongDoi` cho mọi kiểm SQL của một đề đã xuất (JSON payload) bằng LỜI GIẢI. Trả danh sách lỗi
 * (lời giải lỗi/không đạt, cú pháp riêng một hệ trong lời giải…). Kiểm đã có `mongDoi` viết tay: so lời giải
 * với nó (không ghi đè).
 */
export async function dienMongDoiSql(ex, saiMau = []) {
  const tj = ex.testsJson;
  const loi = [];
  if (!tj || tj.loai !== 'sql') return loi;
  const giai = Object.fromEntries((ex.solutionCodeJson || []).map((b) => [b.name, b.code]));
  const dau = Object.fromEntries((ex.starterCodeJson || []).map((b) => [b.name, b.code]));
  for (const [i, k] of (tj.kiem || []).entries()) {
    if (k.kiem === 'ma-nguon') continue;
    const vietTay = k.mongDoi && Array.isArray(k.mongDoi.cot);
    const r = await chayKiemSql(tj, k, giai, vietTay ? k.mongDoi : null);
    if (r.loiDe) { loi.push(`kiểm #${i + 1} "${k.moTa}": ${r.loiDe}`); continue; }
    if (r.truoc) { loi.push(`kiểm #${i + 1} "${k.moTa}": LỜI GIẢI không qua kiểm trước khi chạy — ${r.truoc.vi.replace(/\n/g, ' ')}`); continue; }
    if (!r.dat) { loi.push(`kiểm #${i + 1} "${k.moTa}": lời giải không đạt — ${String(r.thay ?? '').split('\n')[0]}`); continue; }
    if (!vietTay && CAN_MONG.has(k.kiem)) {
      if (!r.bang) { loi.push(`kiểm #${i + 1}: lời giải không trả bảng`); continue; }
      k.mongDoi = r.bang;
    }
    if (CAN_MONG.has(k.kiem) && k.mongDoi.hang.length === 0 && !k.choPhepRong) loi.push(`kiểm #${i + 1} "${k.moTa}": bảng mong đợi RỖNG — kiểm yếu (khai choPhepRong: true nếu cố ý)`);
    // khởi đầu phải trượt kiểm này? — không bắt buộc từng kiểm (codelab-kiem-cham-trinh-duyet kiểm cả đề)
    void dau;
  }
  // câu SAI mẫu (lỗi hay gặp) phải trượt ít nhất một kiểm — chứng minh bộ kiểm bắt được đúng lỗi đề cảnh báo
  for (const [j, sai] of (saiMau || []).entries()) {
    const tepSai = typeof sai === 'string' ? { [tj.tepChinh || 'query.sql']: sai } : sai;
    const files = { ...giai, ...tepSai };
    let truot = 0;
    for (const k of tj.kiem || []) {
      if (k.kiem === 'ma-nguon') {
        const re = new RegExp(String(k.khop), 'i');
        const t = k.tep ? [k.tep] : Object.keys(files);
        const khop = t.some((x) => re.test(String(files[x] ?? '').replace(/--[^\n]*/g, '')));
        if (k.phuDinh ? khop : !khop) truot++;
        continue;
      }
      const r = await chayKiemSql(tj, k, files, k.mongDoi ?? null);
      if (!r.dat) truot++;
    }
    if (!truot) loi.push(`câu sai mẫu #${j + 1} lại ĐẠT mọi kiểm — bộ kiểm không bắt được lỗi này: ${String(Object.values(tepSai)[0]).replace(/\s+/g, ' ').slice(0, 120)}`);
  }
  return loi;
}
