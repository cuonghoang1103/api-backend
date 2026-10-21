/**
 * CT Work — NGÂN SÁCH RAM cho tệp đi qua backend + bộ đọc JSON lớn (22/10/2026).
 *
 * Trần tệp nâng lên 50–100 MB (`limits.ts`) thì thứ phải giữ máy sống là TỔNG byte đang nằm trong RAM cùng lúc, không
 * phải trần từng tệp: container backend 2 GB, heap 1,5 GB. Ba tải 100 MB song song qua `multer.memoryStorage()` +
 * vài báo cáo JSON 100 MB (chuỗi + object ≈ 3× thân) là đủ làm kernel giết container (exit 137).
 *
 * `workUploadGate` (gắn ở index.ts TRƯỚC `express.json` 10 MB toàn cục, trên `/api/v1/work`):
 *   1. Request ghi (POST/PUT/PATCH) có thân > 1 MB ⇒ GIỮ CHỖ trong ngân sách `WORK_UPLOAD_RAM_MB` theo Content-Length
 *      (JSON × 3, thân thô/multipart × 1,2) TRƯỚC khi đọc byte nào; trả lại khi response xong/đứt. Hết chỗ ⇒ 503
 *      `WORK_UPLOAD_BUSY` + Retry-After (người dùng thử lại sau ít giây) — thay vì cả web chết vì OOM.
 *      Request đầu tiên luôn được nhận dù lớn hơn ngân sách (không bao giờ kẹt vĩnh viễn).
 *   2. Đường nhận tệp DẠNG JSON (báo cáo CI/phân tích tĩnh, sơ đồ/Excel base64, form…) được đọc bằng bộ JSON có trần
 *      riêng lấy từ `limits.ts` — bộ 10 MB toàn cục đứng sau sẽ bỏ qua vì thân đã đọc.
 *
 * Không giữ chỗ: nhập cả dự án (`/workspaces/:id/imports` — multer GHI ĐĨA) và MCP (JSON ≤ 10 MB như cũ).
 * Đính kèm từ trình duyệt đi thẳng R2 bằng URL ký sẵn nên không qua đây.
 */

import express, { type NextFunction, type Request, type Response } from 'express';
import { AppError } from '../../middleware/errorHandler.js';
import { mbText, WORK_LIMITS } from './limits.js';

let inFlight = 0;
const SMALL_BODY = 1024 * 1024;
/** Thân không khai Content-Length (chunked) ⇒ đoán chỗ giữ; bộ đọc phía sau vẫn tự cắt theo trần của nó. */
const UNKNOWN_LEN_GUESS = 32 * 1024 * 1024;

export const ramInFlight = () => inFlight;

/** Giữ `bytes` trong ngân sách. Trả hàm trả chỗ, hoặc ném 503 khi đầy (trừ khi đang trống — luôn cho một việc chạy). */
export function reserveRam(bytes: number): () => void {
  const need = Math.max(0, Math.ceil(bytes));
  if (inFlight > 0 && inFlight + need > WORK_LIMITS.uploadRamBytes) {
    throw new AppError('The server is busy processing other large files. Please try again in a few seconds.', 503, 'WORK_UPLOAD_BUSY', { retryAfterSec: 15 });
  }
  inFlight += need;
  let done = false;
  return () => { if (!done) { done = true; inFlight -= need; } };
}

/** Chạy `fn` trong khi giữ `bytes` (xem trước Office…). */
export async function withRam<T>(bytes: number, fn: () => Promise<T>): Promise<T> {
  const release = reserveRam(bytes);
  try { return await fn(); } finally { release(); }
}

const b64 = (bytes: number) => Math.ceil((bytes * 4) / 3);
const SLACK = 1024 * 1024;

type BigJson = { re: RegExp; file: () => number; enc: 'text' | 'base64' | 'double' };
/** Đường nhận tệp dạng JSON ⇒ trần TỆP (byte) + cách nó nằm trong thân. Đường tính từ `/api/v1/work`. */
const BIG_JSON: BigJson[] = [
  // Báo cáo CI: report + coverage trong cùng một thân.
  { re: /^\/projects\/\d+\/tests\/automation\/import$/, file: () => WORK_LIMITS.importBytes, enc: 'double' },
  // Phân tích tĩnh: SARIF gửi thẳng làm thân, hoặc { report }.
  { re: /^\/projects\/\d+\/tests\/automation\/static$/, file: () => WORK_LIMITS.importBytes, enc: 'text' },
  // Sơ đồ (drawio/png/svg/excalidraw…) — base64 trong JSON.
  { re: /^\/projects\/\d+\/diagrams\/import$/, file: () => WORK_LIMITS.importBytes, enc: 'base64' },
  // Nhập CSV (Jira…) — chữ trong JSON; nhập Trello/Asana/Jira/CSV/Excel (Excel đi base64).
  { re: /^\/projects\/\d+\/imports$/, file: () => WORK_LIMITS.importBytes, enc: 'base64' },
  { re: /^\/projects\/\d+\/import$/, file: () => WORK_LIMITS.importBytes, enc: 'text' },
  // Lớp học: danh sách lớp, sổ điểm, ngân hàng câu hỏi (csv hoặc xlsx base64), ảnh câu hỏi.
  { re: /^\/classes\/\d+\/roster\/(preview|import)$/, file: () => WORK_LIMITS.importBytes, enc: 'base64' },
  { re: /^\/classes\/\d+\/gradebook\/import(\/preview)?$/, file: () => WORK_LIMITS.importBytes, enc: 'base64' },
  { re: /^\/classes\/\d+\/quiz-bank\/import$/, file: () => WORK_LIMITS.importBytes, enc: 'base64' },
  { re: /^\/classes\/\d+\/quiz-bank\/image$/, file: () => WORK_LIMITS.imageBytes, enc: 'base64' },
  // Form (nội bộ + công khai): tệp đi base64.
  { re: /^\/(public\/)?forms\/[^/]+\/responses$/, file: () => WORK_LIMITS.formTotalBytes, enc: 'base64' },
];

/** Trần thân JSON của một đường + trần tệp tương ứng (null = đường thường, để bộ 10 MB toàn cục lo). */
export function bigJsonLimit(path: string): { body: number; file: number } | null {
  const hit = BIG_JSON.find((x) => x.re.test(path));
  if (!hit) return null;
  const file = hit.file();
  const body = hit.enc === 'base64' ? b64(file) : hit.enc === 'double' ? 2 * file : file;
  return { body: body + SLACK, file };
}

const NO_GATE = [/^\/workspaces\/\d+\/imports(\/|$)/, /^\/mcp(\/|$)/];
const parsers = new Map<number, ReturnType<typeof express.json>>();
const jsonParser = (limit: number) => {
  let p = parsers.get(limit);
  if (!p) { p = express.json({ limit }); parsers.set(limit, p); }
  return p;
};

export function workUploadGate(req: Request, res: Response, next: NextFunction): void {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method) || NO_GATE.some((re) => re.test(req.path))) { next(); return; }
  const lenHeader = req.headers['content-length'];
  const len = lenHeader === undefined ? NaN : Number(lenHeader);
  const chunked = !Number.isFinite(len) && /chunked/i.test(String(req.headers['transfer-encoding'] ?? ''));
  const limit = bigJsonLimit(req.path);
  const isJson = req.is('application/json') === 'application/json' || /\+json\b/i.test(String(req.headers['content-type'] ?? ''));

  // Báo sớm (trước khi đọc byte nào) khi thân khai báo vượt trần JSON của đường này.
  if (limit !== null && isJson && Number.isFinite(len) && len > limit.body) {
    next(new AppError(`The file is too large (max ${mbText(limit.file)})`, 413, 'WORK_FILE_TOO_LARGE'));
    return;
  }

  const body = Number.isFinite(len) ? len : chunked ? UNKNOWN_LEN_GUESS : 0;
  let release: (() => void) | null = null;
  if (body > SMALL_BODY) {
    try { release = reserveRam(body * (isJson ? 3 : 1.2)); } catch (err) {
      res.setHeader('Retry-After', '15');
      next(err);
      return;
    }
    res.once('finish', release);
    res.once('close', release);
  }

  if (limit === null || !isJson) { next(); return; }
  jsonParser(limit.body)(req, res, (err?: unknown) => {
    const e = err as { type?: string; status?: number } | undefined;
    if (e?.type === 'entity.too.large') { next(new AppError(`The file is too large (max ${mbText(limit.file)})`, 413, 'WORK_FILE_TOO_LARGE')); return; }
    next(err as Error | undefined);
  });
}
