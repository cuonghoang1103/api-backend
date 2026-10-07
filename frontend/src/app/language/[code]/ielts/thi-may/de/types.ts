/**
 * Kiểu dữ liệu ĐỀ của phòng thi máy tính (computer-delivered) — 07/10/2026.
 * ─────────────────────────────────────────────────────────────────────────
 * Thêm đề = thêm MỘT tệp `de/<id>.ts` xuất một `De` + một dòng trong
 * `de/index.ts`. Không đụng giao diện, không đụng CSDL.
 *
 * Quy ước:
 *  - Ô trống trong câu/ghi chú/bảng/sơ đồ viết `[[n]]` (n = số câu).
 *  - `huongDan` cho phép **đậm**; xuống dòng bằng `\n`.
 *  - `dapAn[n].a` = MỌI cách viết chấp nhận (chính tả Anh/Mỹ, số viết chữ…).
 *    Không tự nhận từ đồng nghĩa — đề thật bắt chép nguyên văn.
 *  - `dapAn[n].ev` = câu/cụm NGUYÊN VĂN trong bài đọc (hoặc lời thoại) chứa
 *    bằng chứng — phải là chuỗi con đúng từng ký tự để tô sáng khi xem lại
 *    (`cham.test.ts` kiểm điều này cho mọi đề).
 *  - Bản quyền: đề TỰ SOẠN theo đúng DẠNG câu hỏi thật, không chép đề nào.
 */
import type { Voice } from '@/components/sach-hoc/types';

export type Opt = { k: string; t: string };

/** "ONE WORD ONLY" = { tu: 1 }; "NO MORE THAN TWO WORDS AND/OR A NUMBER" = { tu: 2, so: true }. */
export type GioiHan = { tu: number; so?: boolean; chiSo?: boolean };

export type DangCau =
  | 'note' | 'form' | 'sentence' | 'summary' | 'table' | 'flow' | 'diagram' | 'short'
  | 'summary-box' | 'mcq' | 'mcq2' | 'tfng' | 'ynng' | 'heading'
  | 'match-info' | 'match-feature' | 'match-ending' | 'map';

export const TEN_DANG: Record<DangCau, string> = {
  note: 'Note completion', form: 'Form completion', sentence: 'Sentence completion', summary: 'Summary completion',
  table: 'Table completion', flow: 'Flow-chart completion', diagram: 'Diagram labelling', short: 'Short answer',
  'summary-box': 'Summary completion (word box)', mcq: 'Multiple choice (one answer)', mcq2: 'Multiple choice (two answers)',
  tfng: 'True / False / Not Given', ynng: 'Yes / No / Not Given', heading: 'Matching headings',
  'match-info': 'Matching information', 'match-feature': 'Matching features', 'match-ending': 'Matching sentence endings',
  map: 'Map / plan labelling',
};

/** Dạng phải GÕ chữ (chấm theo giới hạn số từ + chính tả). */
export const DANG_GO = new Set<DangCau>(['note', 'form', 'sentence', 'summary', 'table', 'flow', 'diagram', 'short']);

/* ── Hình vẽ SVG đơn giản (sơ đồ, bản đồ) ─────────────────────────── */
export type Net =
  | { t: 'rect'; x: number; y: number; w: number; h: number; nhan?: string; nen?: string; bo?: number }
  | { t: 'circle'; x: number; y: number; r: number; nen?: string; nhan?: string }
  | { t: 'line'; d: [number, number][]; mui?: boolean; dut?: boolean; day?: number; mau?: string }
  | { t: 'path'; d: string; nen?: string; mau?: string; day?: number }
  | { t: 'text'; x: number; y: number; s: string; co?: number; dam?: boolean; giua?: boolean; nghieng?: boolean }
  /** Ô điền số câu n (sơ đồ) — đặt tâm tại x,y. */
  | { t: 'o'; n: number; x: number; y: number }
  /** Chữ cái trên bản đồ (A–I). */
  | { t: 'chu'; k: string; x: number; y: number };
export type Hinh = { w: number; h: number; ve: Net[]; chuThich?: string };

export type Nhom = {
  id: string;
  tu: number;
  den: number;
  dang: DangCau;
  huongDan: string;
  gioiHan?: GioiHan;
  tieuDe?: string;
  /** Ghi chú / câu / tóm tắt / lưu đồ — mỗi phần tử một dòng, có `[[n]]`. Dòng bắt đầu `## ` là tiêu đề nhỏ, `• ` gạch đầu dòng, `→ ` bước lưu đồ. */
  dong?: string[];
  bang?: { dau: string[]; hang: string[][] };
  /** Câu hỏi từng dòng (TFNG, MCQ, nối…). `chon` riêng cho MCQ. */
  cau?: { n: number; s: string; chon?: Opt[] }[];
  /** Hộp lựa chọn dùng chung (danh sách tiêu đề, người, đoạn kết, từ tóm tắt, chữ trên bản đồ). */
  hop?: { tieuDe?: string; ds: Opt[]; ghiChu?: string };
  /** Chọn HAI đáp án cho các câu `ns`. */
  nhieu?: { ns: number[]; s: string; chon: Opt[] };
  hinh?: Hinh;
};

export type DapAn = { a: string[]; vi: string; ev?: string };

export type Doan = { nhan?: string; s: string };

export type PhanDoc = {
  so: number;
  tieuDe: string;
  phuDe?: string;
  gioiThieu: string;
  doan: Doan[];
  nhom: Nhom[];
};

export type LoiNghe = { ai: string; giong: Voice; s: string };
export type PhanNghe = {
  so: number;
  tieuDe: string;
  /** Câu dẫn tiếng Anh kiểu băng đề: "You will hear…". */
  dan: string;
  /** Bối cảnh tiếng Việt cho chế độ luyện. */
  boiCanh: string;
  /** Giây đọc trước câu hỏi. */
  docTruoc: number;
  loi: LoiNghe[];
  nhom: Nhom[];
};

/* ── Writing ──────────────────────────────────────────────────────── */
export type BieuDoCot = {
  loai: 'cot';
  tieuDe: string;
  donVi: string;
  nhom: string[];
  chuoi: { ten: string; so: number[] }[];
  max: number;
  buoc: number;
};
export type BieuDoBang = { loai: 'bang'; tieuDe: string; dau: string[]; hang: string[][] };
export type BieuDo = BieuDoCot | BieuDoBang;

export type TaskViet = {
  so: 1 | 2;
  phut: number;
  minTu: number;
  de: string;
  bieuDo?: BieuDo;
  /** Số liệu dạng chữ — gửi kèm cho AI chấm để kiểm độ chính xác. */
  moTaSo?: string;
  goiY: string[];
  mau: { band: string; s: string; phanTich: string[] };
};

type DeChung = { id: string; ten: string; boDe: string; capDo: string; moTa: string };
export type DeDoc = DeChung & { kyNang: 'doc'; phut: number; phan: PhanDoc[]; dapAn: Record<number, DapAn> };
export type DeNghe = DeChung & { kyNang: 'nghe'; phut: number; phan: PhanNghe[]; dapAn: Record<number, DapAn> };
export type DeViet = DeChung & { kyNang: 'viet'; phut: number; task: TaskViet[] };
export type De = DeDoc | DeNghe | DeViet;
export type KyNang = De['kyNang'];

/** Mục lục (nhẹ) — trang chọn đề không phải tải nội dung đề. */
export type MucDe = { id: string; kyNang: KyNang; ten: string; boDe: string; capDo: string; phut: number; soCau: number; moTa: string };
