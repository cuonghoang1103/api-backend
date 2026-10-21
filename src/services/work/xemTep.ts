/**
 * CT Work — XEM TỆP NGAY TRONG TRANG (20/10/2026).
 *
 * Trình xem tệp của CT Work (frontend `components/work/xemTep`) mở ảnh/PDF/video bằng URL ký sẵn dạng inline. Hai loại
 * cần máy chủ đọc hộ byte:
 *   - CHỮ (txt/md/csv/json/log/mã nguồn…): `fetch()` thẳng URL R2 vấp CORS (nhất là từ app://cuongthai) ⇒ backend đọc
 *     tối đa TEXT_PREVIEW_MAX byte rồi trả `text/plain` — KHÔNG BAO GIỜ trả HTML/SVG/JS với kiểu gốc từ origin của mình.
 *   - OFFICE: docx ⇒ HTML bằng mammoth (frontend lọc lại bằng DOMPurify), xlsx ⇒ bảng giá trị (readXlsx sẵn có). Không
 *     gửi tệp cho trình xem bên thứ ba (Office Online/Google) — tài liệu khách hàng không rời máy chủ.
 *
 * Quyền: route gọi hàm "tìm tệp ĐỌC ĐƯỢC" của từng nơi (thẻ, chat, lớp) — đúng hàm mà tuyến `/url` dùng.
 */

import { GetObjectCommand } from '@aws-sdk/client-s3';
import AdmZip from 'adm-zip';
import mammoth from 'mammoth';
import { config } from '../../config/env.js';
import { getR2Client } from '../../config/r2.js';
import { AppError, NotFoundError } from '../../middleware/errorHandler.js';
import { colName, readXlsx } from './xlsxStyled.js';
import { WORK_LIMITS } from './limits.js';
import { withRam } from './uploadGate.js';

/** Trần byte đọc cho xem trước dạng chữ (quá ⇒ cắt, báo `truncated`). */
export const TEXT_PREVIEW_MAX = 2 * 1024 * 1024;
/** Trần kích thước tệp Office được dựng xem trước (limits.ts, env WORK_OFFICE_PREVIEW_MAX_MB; trước 22/10/2026 là 10 MB). */
export const OFFICE_PREVIEW_MAX = WORK_LIMITS.officePreviewBytes;
/**
 * Trần tổng dung lượng GIẢI NÉN của tệp Office (chặn zip bomb). Ảnh (`word/media`, `xl/media`) chỉ tính với docx —
 * xlsx không bao giờ giải nén ảnh (readXlsx chỉ đọc phần XML).
 */
export const OFFICE_UNZIP_MAX = WORK_LIMITS.zipXmlBytes;
/** Trần HTML docx trả về (ảnh nhúng data: làm phình) — quá ⇒ bỏ ảnh. */
export const DOCX_HTML_MAX = 4 * 1024 * 1024;
export const XLSX_MAX_SHEETS = 10;
export const XLSX_MAX_ROWS = 500;
export const XLSX_MAX_COLS = 50;

export interface TepNguon { r2Key: string; fileName: string; mime: string; size: number }

// ─── Nhận loại ────────────────────────────────────────────────────

const duoi = (name: string) => {
  const base = name.toLowerCase().split(/[\\/]/).pop() ?? '';
  if (/^(dockerfile|makefile|readme|license|changelog|procfile|gemfile|\.gitignore|\.env(\..+)?|\.editorconfig)$/.test(base)) return base;
  const i = base.lastIndexOf('.');
  return i >= 0 ? base.slice(i + 1) : '';
};

/** Đuôi tệp coi là CHỮ (xem bằng khung chữ/mã/bảng). Không có html/svg ở đây: vẫn xem được dạng chữ qua nhánh text/*. */
const DUOI_CHU = new Set([
  'txt', 'text', 'md', 'markdown', 'mdx', 'csv', 'tsv', 'json', 'jsonc', 'json5', 'ndjson', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf',
  'properties', 'env', 'log', 'out', 'sql', 'graphql', 'gql', 'proto', 'js', 'mjs', 'cjs', 'jsx', 'ts', 'mts', 'cts', 'tsx', 'py', 'java',
  'kt', 'kts', 'scala', 'groovy', 'gradle', 'c', 'h', 'cc', 'cpp', 'cxx', 'hpp', 'hh', 'cs', 'go', 'rs', 'rb', 'php', 'swift', 'm', 'mm',
  'dart', 'lua', 'pl', 'r', 'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd', 'html', 'htm', 'xhtml', 'css', 'scss', 'sass', 'less', 'vue',
  'svelte', 'astro', 'tex', 'bib', 'rst', 'adoc', 'srt', 'vtt', 'diff', 'patch', 'svg', 'dockerfile', 'makefile', 'readme', 'license',
  'changelog', 'procfile', 'gemfile', '.gitignore', '.editorconfig', 'lock',
]);
const MIME_CHU = /^(text\/[\w.+-]+|application\/(json|ld\+json|xml|x-yaml|yaml|toml|javascript|x-javascript|typescript|x-sh|x-httpd-php|sql|x-sql|graphql|x-ndjson))$/i;

/** Tệp xem được dạng chữ? (Tên `.env`/`.env.local` cũng tính.) */
export function laTepChu(fileName: string, mime: string | null | undefined): boolean {
  const d = duoi(fileName);
  if (DUOI_CHU.has(d) || d.startsWith('.env')) return true;
  return MIME_CHU.test((mime ?? '').split(';')[0].trim());
}

export function laDocx(fileName: string, mime: string | null | undefined): boolean {
  return duoi(fileName) === 'docx' || (mime ?? '').startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}
export function laXlsx(fileName: string, mime: string | null | undefined): boolean {
  return duoi(fileName) === 'xlsx' || (mime ?? '').startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

/** Tên tệp cho Content-Disposition: ASCII dự phòng + filename* UTF-8 (tên tiếng Việt giữ nguyên). */
export function dispositionInline(fileName: string): string {
  const ascii = fileName.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\- ]+/g, '_').slice(-150) || 'file';
  return `inline; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName.slice(-150))}`;
}

// ─── Đọc byte từ kho ─────────────────────────────────────────────

/** Đọc tối đa `max` byte đầu của object. `truncated` = object dài hơn phần đã đọc. */
export async function docDau(key: string, max: number, size: number): Promise<{ buf: Buffer; truncated: boolean }> {
  const lay = size > max;
  try {
    const res = await getR2Client().send(new GetObjectCommand({ Bucket: config.r2.bucketName, Key: key, ...(lay ? { Range: `bytes=0-${max - 1}` } : {}) }));
    const bytes = await res.Body?.transformToByteArray();
    const buf = Buffer.from(bytes ?? new Uint8Array());
    return { buf: buf.length > max ? buf.subarray(0, max) : buf, truncated: lay || buf.length > max };
  } catch (err) {
    const name = (err as { name?: string })?.name;
    if (name === 'NoSuchKey' || name === 'NotFound') throw new NotFoundError('File not found');
    throw err;
  }
}

/** Nội dung CHỮ để xem trước. Loại không phải chữ ⇒ 415 (trình xem dùng URL inline cho ảnh/PDF/video). */
export async function noiDungChu(f: TepNguon): Promise<{ buf: Buffer; truncated: boolean }> {
  if (!laTepChu(f.fileName, f.mime)) throw new AppError('This file type cannot be previewed as text', 415, 'WORK_PREVIEW_UNSUPPORTED');
  return docDau(f.r2Key, TEXT_PREVIEW_MAX, f.size);
}

// ─── Office ──────────────────────────────────────────────────────

export type XemTruocOffice =
  | { kind: 'docx'; html: string; imagesDropped: boolean }
  | { kind: 'xlsx'; sheets: Array<{ name: string; rows: string[][]; cols: string[]; totalRows: number; totalCols: number; truncated: boolean }>; moreSheets: number };

/** Zip bomb: tổng dung lượng giải nén khai trong mục lục zip vượt trần ⇒ từ chối trước khi giải. */
export function kiemZip(buf: Buffer, max = OFFICE_UNZIP_MAX, boQuaAnh = false): void {
  let zip: AdmZip;
  try { zip = new AdmZip(buf); } catch { throw new AppError('This file is damaged or not an Office document', 422, 'WORK_PREVIEW_BAD_FILE'); }
  let total = 0;
  for (const e of zip.getEntries()) {
    if (boQuaAnh && /^xl\/media\//.test(e.entryName)) continue;
    total += e.header.size;
    if (total > max) throw new AppError('This document is too large to preview', 413, 'WORK_PREVIEW_TOO_LARGE');
  }
}

/** Bảng giá trị của xlsx (chuỗi đã định dạng), tối đa XLSX_MAX_SHEETS × XLSX_MAX_ROWS × XLSX_MAX_COLS. */
export function bangXlsx(buf: Buffer): Extract<XemTruocOffice, { kind: 'xlsx' }> {
  let sheets;
  try { sheets = readXlsx(buf); } catch (err) {
    if ((err as Error)?.message === 'XLSX_TOO_BIG') throw new AppError('This document is too large to preview', 413, 'WORK_PREVIEW_TOO_LARGE');
    throw new AppError('This file is damaged or not an Excel workbook', 422, 'WORK_PREVIEW_BAD_FILE');
  }
  const out = sheets.slice(0, XLSX_MAX_SHEETS).map((s) => {
    const nRows = Math.min(s.maxRow, XLSX_MAX_ROWS);
    const nCols = Math.min(s.maxCol, XLSX_MAX_COLS);
    const rows: string[][] = [];
    for (let r = 1; r <= nRows; r++) {
      const row: string[] = [];
      for (let c = 1; c <= nCols; c++) row.push(s.text(r, c));
      rows.push(row);
    }
    // Bỏ dòng trống ở cuối (định dạng kéo dài maxRow).
    while (rows.length && rows[rows.length - 1].every((v) => v === '')) rows.pop();
    return {
      name: s.name, rows, cols: Array.from({ length: nCols }, (_, i) => colName(i + 1)),
      totalRows: s.maxRow, totalCols: s.maxCol, truncated: s.maxRow > XLSX_MAX_ROWS || s.maxCol > XLSX_MAX_COLS,
    };
  });
  return { kind: 'xlsx', sheets: out, moreSheets: Math.max(0, sheets.length - XLSX_MAX_SHEETS) };
}

/** docx ⇒ HTML (mammoth thoát chữ sẵn; frontend vẫn lọc bằng DOMPurify). HTML quá trần ⇒ dựng lại không ảnh. */
export async function htmlDocx(buf: Buffer): Promise<Extract<XemTruocOffice, { kind: 'docx' }>> {
  try {
    // Ảnh nhúng chắc chắn làm HTML vượt trần (data: base64 ≈ 4/3 kích thước) ⇒ đi thẳng lượt không ảnh, khỏi dựng
    // một chuỗi HTML hàng chục MB rồi vứt (tệp xem trước nay tới 50 MB).
    let anh = 0;
    try { for (const e of new AdmZip(buf).getEntries()) if (/^word\/media\//.test(e.entryName)) anh += e.header.size; } catch { /* mammoth tự báo hỏng */ }
    const value = anh * 1.34 > DOCX_HTML_MAX ? null : (await mammoth.convertToHtml({ buffer: buf }, { externalFileAccess: false })).value;
    if (value !== null && value.length <= DOCX_HTML_MAX) return { kind: 'docx', html: value, imagesDropped: false };
    const boAnh = mammoth.images.imgElement(async () => ({ src: '' }));
    const { value: gon } = await mammoth.convertToHtml({ buffer: buf }, { convertImage: boAnh, externalFileAccess: false });
    return { kind: 'docx', html: gon.replace(/<img src="">/g, '').slice(0, DOCX_HTML_MAX), imagesDropped: true };
  } catch {
    throw new AppError('This file is damaged or not a Word document', 422, 'WORK_PREVIEW_BAD_FILE');
  }
}

/** Xem trước docx/xlsx. Loại khác ⇒ 415; quá OFFICE_PREVIEW_MAX ⇒ 413. */
export async function xemTruocOffice(f: TepNguon): Promise<XemTruocOffice> {
  const docx = laDocx(f.fileName, f.mime);
  const xlsx = !docx && laXlsx(f.fileName, f.mime);
  if (!docx && !xlsx) throw new AppError('This file type has no preview', 415, 'WORK_PREVIEW_UNSUPPORTED');
  if (f.size > OFFICE_PREVIEW_MAX) throw new AppError('This document is too large to preview', 413, 'WORK_PREVIEW_TOO_LARGE');
  // Dựng xem trước nằm trong RAM (tệp + phần giải nén + HTML/bảng) ⇒ giữ chỗ trong ngân sách chung với tệp tải lên.
  return withRam(Math.max(f.size, 1) * 3, async () => {
    const { buf } = await docDau(f.r2Key, OFFICE_PREVIEW_MAX + 1, f.size);
    if (buf.length > OFFICE_PREVIEW_MAX) throw new AppError('This document is too large to preview', 413, 'WORK_PREVIEW_TOO_LARGE');
    kiemZip(buf, OFFICE_UNZIP_MAX, xlsx);
    return docx ? htmlDocx(buf) : bangXlsx(buf);
  });
}
