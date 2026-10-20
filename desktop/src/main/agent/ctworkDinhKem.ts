/**
 * ============================================================
 * ĐÍNH KÈM FILE TRÊN MÁY LÊN CT WORK — `attach_file { path }` (20/10/2026)
 * ============================================================
 *
 * Trước đây model phải tự mã hoá base64 rồi nhét vào tham số — nó không làm được với ảnh/PDF thật, nên trả lời
 * "mình không đính kèm được, bạn lưu PNG rồi kéo vào giúp" (NT-13). Nay model chỉ đưa ĐƯỜNG DẪN; CuongMini tự:
 *   • đọc file qua đúng nhà tù đường dẫn của tool đọc (`moTrongNguc`): trong dự án, thư mục ngoài người dùng đã kéo
 *     vào, thư mục tải (web_tai), thư mục ảnh dán trong chat (`dinh-kem/`) — `.env`, khoá… vẫn bị chặn;
 *   • ≤ 6 MB ⇒ một lời gọi `attach_file` có base64; lớn hơn ⇒ `attach_file{sizeBytes}` ⇒ PUT thẳng lên URL ký sẵn
 *     ⇒ `attach_complete` — model không phải biết ba bước đó.
 * Thẻ duyệt hiện TÊN + CỠ file, không bao giờ hiện chuỗi base64.
 *
 * Ảnh người dùng DÁN/KÉO vào khung chat chỉ là data URL trong tin nhắn ⇒ `luuAnhChat` lưu ra `dinh-kem/` và
 * vòng lặp ghi chú đường dẫn vào câu hỏi, để model đính kèm được đúng tấm đó.
 */
import { app } from 'electron';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { LoiNguc, moTrongNguc, timThuMucNgoai } from './jail';
import { rutJson } from './ctworkVe';

/** Trần base64 một lời gọi của máy chủ (`MCP_INLINE_FILE_MAX`). */
export const TRAN_INLINE = 6 * 1024 * 1024;
/** Trần cứng một file đính kèm qua URL ký sẵn. */
export const TRAN_TEP = 200 * 1024 * 1024;

/** Thư mục lưu ảnh dán trong chat (đọc được cho `attach_file{path}`). */
export function thuMucDinhKem(): string { return path.join(app.getPath('userData'), 'dinh-kem'); }

const LOAI: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  bmp: 'image/bmp', heic: 'image/heic', avif: 'image/avif', ico: 'image/x-icon',
  pdf: 'application/pdf', txt: 'text/plain', log: 'text/plain', md: 'text/markdown', csv: 'text/csv', tsv: 'text/tab-separated-values',
  json: 'application/json', xml: 'application/xml', yaml: 'application/yaml', yml: 'application/yaml', html: 'text/html', sql: 'application/sql',
  zip: 'application/zip', gz: 'application/gzip', tar: 'application/x-tar', '7z': 'application/x-7z-compressed', rar: 'application/vnd.rar',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', mp3: 'audio/mpeg', wav: 'audio/wav',
  drawio: 'application/xml', puml: 'text/plain', mmd: 'text/plain',
};
/** Kiểu MIME theo đuôi file (không rõ ⇒ application/octet-stream). */
export function loaiTheoTen(ten: string): string {
  return LOAI[path.extname(ten).slice(1).toLowerCase()] ?? 'application/octet-stream';
}

export interface TepDinhKem { duong: string; ten: string; loai: string; kichThuoc: number }

/** "1,2 MB" · "340 KB". */
export function coChu(n: number): string {
  if (n >= 1024 * 1024) return `${(n / 1048576).toFixed(1)} MB`;
  if (n >= 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
}

/**
 * Đường dẫn model đưa ⇒ file thật được phép đọc. Tương đối ⇒ trong dự án. Tuyệt đối (hoặc `~/…`) ⇒ phải nằm trong
 * dự án / thư mục ngoài đã cấp / thư mục tải / thư mục ảnh dán. Ném `LoiNguc` kèm cách gỡ.
 */
export async function timTepDinhKem(p: string, o: { goc: string | null; thuMucTai?: string | null; thuMucAnh?: string }): Promise<TepDinhKem> {
  let tho = String(p ?? '').trim().replace(/^file:\/\//, '');
  if (!tho) throw new LoiNguc('Thiếu đường dẫn file.');
  if (tho === '~' || tho.startsWith('~/')) tho = path.join(os.homedir(), tho.slice(1));
  let dich: string | null = null;
  if (!path.isAbsolute(tho)) {
    if (!o.goc) throw new LoiNguc('Chưa mở thư mục dự án — đưa đường dẫn TUYỆT ĐỐI của file.');
    dich = await moTrongNguc(o.goc, tho, { phaiCoThat: true });
  } else {
    const ds: string[] = [];
    if (o.goc) ds.push(o.goc);
    const ngoai = o.goc ? timThuMucNgoai(o.goc, tho) : null;
    if (ngoai) ds.push(ngoai.goc);
    if (o.thuMucTai) ds.push(o.thuMucTai);
    ds.push(o.thuMucAnh ?? thuMucDinhKem());
    for (const r of ds) {
      const rel = path.relative(r, tho);
      if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) continue;
      dich = await moTrongNguc(r, rel, { phaiCoThat: true });
      break;
    }
    if (!dich) {
      throw new LoiNguc(`"${p}" nằm ngoài các thư mục CuongMini được đọc (dự án đang mở, thư mục người dùng đã kéo vào, thư mục tải, ảnh dán trong chat). `
        + 'Nhờ người dùng KÉO file (hoặc thư mục chứa nó) vào khung chat rồi gọi lại — đừng bảo họ tự tải lên web.');
    }
  }
  const st = await fs.stat(dich);
  if (!st.isFile()) throw new LoiNguc(`"${p}" không phải file.`);
  if (st.size <= 0) throw new LoiNguc(`"${p}" rỗng.`);
  if (st.size > TRAN_TEP) throw new LoiNguc(`"${p}" nặng ${coChu(st.size)}, quá trần ${coChu(TRAN_TEP)}.`);
  return { duong: dich, ten: path.basename(dich), loai: loaiTheoTen(dich), kichThuoc: st.size };
}

/** Tham số model đưa có đường dẫn file (thay base64) không. */
export function coDuongDan(args: Record<string, unknown>): string | null {
  const v = args.path ?? args.duong_dan;
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

/** Tham số gửi máy chủ (bỏ path / base64 / sizeBytes, điền fileName + contentType). */
export function thamSoGoc(args: Record<string, unknown>, tep: TepDinhKem): Record<string, unknown> {
  const { path: _p, duong_dan: _d, base64: _b, sizeBytes: _s, ...con } = args;
  return {
    ...con,
    fileName: typeof args.fileName === 'string' && args.fileName.trim() ? args.fileName.trim().slice(0, 255) : tep.ten.slice(0, 255),
    contentType: typeof args.contentType === 'string' && args.contentType.trim() ? args.contentType.trim().slice(0, 100) : tep.loai,
  };
}

/** Tham số cho THẺ DUYỆT / nhật ký: base64 ⇒ "<base64 ~N KB>" (không bao giờ đổ chuỗi dài ra màn hình). */
export function thamSoHien(args: Record<string, unknown>, tep?: TepDinhKem | null): Record<string, unknown> {
  const { base64, ...con } = args;
  return {
    ...con,
    ...(typeof base64 === 'string' ? { base64: `<base64 ~${coChu(Math.floor(base64.length * 3 / 4))}>` } : {}),
    ...(tep ? { fileName: con.fileName ?? tep.ten, kichThuoc: coChu(tep.kichThuoc) } : {}),
  };
}

export type GoiCtwork = (tool: string, args: Record<string, unknown>) => Promise<{ noiDung: string; loi: boolean }>;
export type DayLen = (url: string, o: { method: string; headers: Record<string, string>; than: Buffer }) => Promise<{ ok: boolean; status: number; loi?: string }>;

const dayLenThat: DayLen = async (url, o) => {
  try {
    const r = await fetch(url, { method: o.method, headers: o.headers, body: o.than, signal: AbortSignal.timeout(10 * 60_000) });
    return { ok: r.ok, status: r.status, ...(r.ok ? {} : { loi: (await r.text().catch(() => '')).slice(0, 200) }) };
  } catch (e) {
    return { ok: false, status: 0, loi: (e as Error).message };
  }
};

/**
 * Gửi `tep` lên CT Work theo `args` của model (`project`, `issue`, `for?`, `testRun?`…). `goi` = gọi tool của server
 * ctwork (đã được người dùng duyệt). ≤ 6 MB ⇒ base64 một lời gọi; lớn hơn ⇒ URL ký sẵn + `attach_complete`.
 */
export async function guiTepLenCtwork(args: Record<string, unknown>, tep: TepDinhKem, goi: GoiCtwork, dayLen: DayLen = dayLenThat): Promise<{ noiDung: string; loi: boolean }> {
  const goc = thamSoGoc(args, tep);
  const than = await fs.readFile(tep.duong);
  if (than.length <= TRAN_INLINE) return goi('attach_file', { ...goc, base64: than.toString('base64') });
  const r1 = await goi('attach_file', { ...goc, sizeBytes: than.length });
  if (r1.loi) return r1;
  const pre = (rutJson(r1.noiDung) as { presign?: { url?: unknown; key?: unknown; headers?: unknown; method?: unknown } } | null)?.presign;
  if (!pre || typeof pre.url !== 'string' || typeof pre.key !== 'string') {
    return { noiDung: `LỖI: máy chủ không trả URL tải lên cho ${tep.ten} (${coChu(tep.kichThuoc)}). Trả về: ${r1.noiDung.slice(0, 300)}`, loi: true };
  }
  const headers: Record<string, string> = {};
  if (pre.headers && typeof pre.headers === 'object') for (const [k, v] of Object.entries(pre.headers)) if (typeof v === 'string') headers[k] = v;
  if (!Object.keys(headers).some((k) => k.toLowerCase() === 'content-type')) headers['Content-Type'] = String(goc.contentType);
  const put = await dayLen(pre.url, { method: typeof pre.method === 'string' ? pre.method : 'PUT', headers, than });
  if (!put.ok) return { noiDung: `LỖI: tải ${tep.ten} lên kho tệp hỏng (HTTP ${put.status}${put.loi ? `: ${put.loi}` : ''}).`, loi: true };
  return goi('attach_complete', {
    project: goc.project, issue: goc.issue, key: pre.key, fileName: goc.fileName,
    ...(goc.for !== undefined ? { for: goc.for } : {}), ...(goc.testRun !== undefined ? { testRun: goc.testRun } : {}),
  });
}

// ─── Ảnh dán / kéo vào khung chat ⇒ file trên máy ─────────────────

const DUOI_MIME: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/heic': 'heic', 'image/avif': 'avif', 'image/bmp': 'bmp', 'image/svg+xml': 'svg' };
const GIU_ANH_MS = 7 * 24 * 3600 * 1000;

/**
 * Lưu ảnh data URL của câu hỏi ra `dinh-kem/<ngày-giờ>-<n>.<đuôi>` (quyền 0600), dọn ảnh cũ hơn 7 ngày. Trả đường dẫn
 * đã lưu (bỏ qua ảnh hỏng). Không bao giờ ném — lưu hỏng thì câu hỏi vẫn đi như thường.
 */
export async function luuAnhChat(dataUrls: readonly string[] | undefined, thuMuc = thuMucDinhKem()): Promise<string[]> {
  if (!dataUrls?.length) return [];
  const ra: string[] = [];
  try {
    await fs.mkdir(thuMuc, { recursive: true, mode: 0o700 });
    const d = new Date();
    const so = (n: number) => String(n).padStart(2, '0');
    const nhan = `${d.getFullYear()}${so(d.getMonth() + 1)}${so(d.getDate())}-${so(d.getHours())}${so(d.getMinutes())}${so(d.getSeconds())}`;
    let i = 0;
    for (const u of dataUrls) {
      i += 1;
      const m = /^data:([^;,]+)(?:;[^,]*)?,(.*)$/s.exec(String(u ?? ''));
      if (!m) continue;
      const than = Buffer.from(m[2]!, 'base64');
      if (!than.length) continue;
      const f = path.join(thuMuc, `${nhan}-${Math.random().toString(36).slice(2, 6)}-${i}.${DUOI_MIME[m[1]!.toLowerCase()] ?? 'png'}`);
      await fs.writeFile(f, than, { mode: 0o600 });
      ra.push(f);
    }
    void donAnhCu(thuMuc);
  } catch { /* lưu hỏng ⇒ câu hỏi vẫn đi */ }
  return ra;
}

async function donAnhCu(thuMuc: string): Promise<void> {
  try {
    const han = Date.now() - GIU_ANH_MS;
    for (const t of await fs.readdir(thuMuc)) {
      const f = path.join(thuMuc, t);
      const st = await fs.stat(f).catch(() => null);
      if (st?.isFile() && st.mtimeMs < han) await fs.rm(f, { force: true }).catch(() => undefined);
    }
  } catch { /* bỏ qua */ }
}

/** Ghi chú nối sau câu hỏi khi có ảnh dán đã lưu. */
export function ghiChuAnhChat(ds: readonly string[]): string {
  if (!ds.length) return '';
  return `\n\n[App: ${ds.length === 1 ? 'ảnh' : `${ds.length} ảnh`} người dùng dán đã lưu trên máy: ${ds.join(', ')} — cần đính kèm lên CT Work thì gọi attach_file với \`path\` là đường dẫn này (đừng bảo người dùng tự lưu/tải lên).]`;
}
