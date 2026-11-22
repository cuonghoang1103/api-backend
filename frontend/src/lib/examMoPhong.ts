/**
 * Phòng thi mô phỏng (Exam Room › /exam/mo-phong) — tiện ích phía trình duyệt, 22/11/2026.
 *
 * ⚠ `kiemTenTep` là BẢN SAO của `kiemTenTepZip` ở `src/services/exam/moPhong.ts` (máy chủ kiểm lại y
 *   hệt khi nhận file). Sửa luật thì sửa cả hai — test `src/services/exam/moPhong.test.ts` giữ bản máy chủ.
 */
import { strToU8, unzipSync, zipSync } from 'fflate';

/** Môn có phòng thi mô phỏng (khớp `MO_PHONG_MON` ở src/services/exam/moPhongConfig.ts). */
export const MO_PHONG_MON = ['FER202'] as const;
export const coMoPhong = (courseCode: string | null | undefined) =>
  !!courseCode && (MO_PHONG_MON as readonly string[]).includes(courseCode.toUpperCase());
export const duongMoPhong = (courseCode: string) => `/exam/mo-phong?course=${encodeURIComponent(courseCode.toUpperCase())}`;

export const ZIP_TRAN_BYTE = 20 * 1024 * 1024;

export interface KiemZip { loi: string[]; canhBao: string[]; goc: string | null; soTep: number }

export function kiemTenTep(entries: string[]): KiemZip {
  const ten = entries.map((e) => e.replace(/\\/g, '/')).filter((e) => !e.endsWith('/'));
  const loi: string[] = [];
  const canhBao: string[] = [];
  const nm = ten.filter((e) => /(^|\/)node_modules\//.test(e));
  if (nm.length) loi.push(`The zip still contains node_modules (${nm.length} files). Delete node_modules and zip again.|||File zip còn thư mục node_modules (${nm.length} tệp). Xoá node_modules rồi nén lại.`);
  const pkg = ten.filter((e) => /(^|\/)package\.json$/.test(e) && !/(^|\/)node_modules\//.test(e))
    .sort((a, b) => a.split('/').length - b.split('/').length)[0] ?? null;
  const goc = pkg ? pkg.replace(/package\.json$/, '') : null;
  if (!pkg) loi.push('No package.json found — zip the project folder itself (the one you ran npm start in).|||Không thấy package.json — hãy nén đúng thư mục dự án (thư mục bạn chạy npm start).');
  if (goc != null && !ten.some((e) => e.startsWith(`${goc}src/`))) canhBao.push('No src/ folder next to package.json — is this the right project?|||Không có thư mục src/ cạnh package.json — có đúng dự án không?');
  if (ten.some((e) => /(^|\/)(build|dist)\//.test(e))) canhBao.push('The zip includes build/ or dist/ output — not needed, you can delete it.|||Zip có thư mục build/ hoặc dist/ — không cần, có thể xoá.');
  if (ten.some((e) => /(^|\/)\.git\//.test(e))) canhBao.push('The zip includes the .git folder — not needed.|||Zip có thư mục .git — không cần.');
  return { loi, canhBao, goc, soTep: ten.length };
}

/** Kiểm file người học chọn TRƯỚC khi tải lên: đuôi, kích thước, chữ ký ZIP, node_modules, package.json. */
export async function kiemFileZip(file: File): Promise<KiemZip & { kichThuoc: number }> {
  const base = { loi: [] as string[], canhBao: [] as string[], goc: null, soTep: 0, kichThuoc: file.size };
  if (!/\.zip$/i.test(file.name)) return { ...base, loi: ['Only .zip is accepted (not .rar / .7z).|||Chỉ nhận file .zip (không nhận .rar / .7z).'] };
  if (file.size > ZIP_TRAN_BYTE) {
    return { ...base, loi: [`File is ${(file.size / 1048576).toFixed(1)} MB (> 20 MB) — usually node_modules is still inside.|||File ${(file.size / 1048576).toFixed(1)} MB (> 20 MB) — thường là còn node_modules bên trong.`] };
  }
  const buf = new Uint8Array(await file.arrayBuffer());
  if (buf[0] !== 0x50 || buf[1] !== 0x4b) return { ...base, loi: ['This is not a real ZIP file (renamed .rar/.7z?). Compress again as ZIP.|||Đây không phải file ZIP thật (đổi đuôi từ .rar/.7z?). Hãy nén lại bằng ZIP.'] };
  const ten: string[] = [];
  try {
    // filter trả false ⇒ fflate chỉ đọc mục lục, không giải nén nội dung.
    unzipSync(buf, { filter: (f) => { ten.push(f.name); return false; } });
  } catch {
    return { ...base, loi: ['The zip could not be read — compress it again.|||Không đọc được file zip — hãy nén lại.'] };
  }
  return { ...kiemTenTep(ten), kichThuoc: file.size };
}

/** Lấy tệp mã nguồn (src/** + tệp gốc nhỏ) từ zip cho máy chấm Code Lab trong trình duyệt. */
export async function tepTuZip(file: File, goc: string): Promise<Record<string, string>> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const OK = /\.(js|jsx|ts|tsx|css|json)$/i;
  const out = unzipSync(buf, {
    filter: (f) => f.name.startsWith(goc) && OK.test(f.name) && !/(^|\/)(node_modules|build|dist|\.git)\//.test(f.name) && f.originalSize < 400_000,
  });
  const dec = new TextDecoder();
  const tep: Record<string, string> = {};
  for (const [k, v] of Object.entries(out)) {
    const rel = k.slice(goc.length);
    if (rel.startsWith('src/') || rel === 'package.json') tep[rel] = dec.decode(v);
  }
  return tep;
}

/** Given của đề lấy từ Code Lab: dựng zip ngay trong trình duyệt từ tệp khởi đầu + database.json. */
export function dungGivenZip(given: { files: { name: string; code: string }[]; db: unknown }, ten: string): Blob {
  const files: Record<string, Uint8Array> = {};
  const goc = ten.replace(/\.zip$/i, '');
  for (const f of given.files) files[`${goc}/${f.name.replace(/^\/+/, '')}`] = strToU8(f.code);
  if (given.db != null) files[`${goc}/database.json`] = strToU8(JSON.stringify(given.db, null, 2));
  files[`${goc}/README-MOCK.txt`] = strToU8([
    'cuongthai.com — Mock exam room (practice only, not an official exam).',
    '1. npm create vite@latest / or copy these files into your React project (src/).',
    '2. npm install react-router-dom react-bootstrap bootstrap axios',
    '3. npx json-server --watch database.json --port 9999',
    '4. npm start (or npm run dev)',
    '5. Before submitting: delete node_modules, then zip the project folder.',
  ].join('\n'));
  const z = zipSync(files, { level: 6 });
  return new Blob([z.slice().buffer as ArrayBuffer], { type: 'application/zip' });
}

export function dinhDangGiay(s: number): string {
  const t = Math.max(0, Math.floor(s));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${p(h)}:${p(m)}:${p(sec)}` : `${p(m)}:${p(sec)}`;
}
