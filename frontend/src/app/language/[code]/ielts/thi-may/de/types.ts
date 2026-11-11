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
import type { Figure } from '@/app/tech-trends/ielts/data/types';

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
  /**
   * Hình Task 1 đủ 7 dạng (12/11/2026) — line · bar · pie · table · process · map (+ mixed = 2 hình) — vẽ bằng FigureView của
   * kho luyện. Dùng THAY `bieuDo` (cột/bảng cũ). Mixed charts: đặt hình thứ hai vào `figure2`.
   */
  figure?: Figure;
  figure2?: Figure;
  /** Số liệu dạng chữ — gửi kèm cho AI chấm để kiểm độ chính xác. */
  moTaSo?: string;
  goiY: string[];
  mau: { band: string; s: string; phanTich: string[] };
};

type DeChung = { id: string; ten: string; boDe: string; capDo: string; moTa: string };
export type DeDoc = DeChung & { kyNang: 'doc'; phut: number; phan: PhanDoc[]; dapAn: Record<number, DapAn> };
export type DeNghe = DeChung & { kyNang: 'nghe'; phut: number; phan: PhanNghe[]; dapAn: Record<number, DapAn> };
export type DeViet = DeChung & { kyNang: 'viet'; phut: number; task: TaskViet[] };
/** Mọi loại đề phòng thi (12/11/2026 thêm Speaking `noi` + sàng lọc `sangloc` của Đề 0). */
export type De = DeDoc | DeNghe | DeViet | DeNoi | DeSangLoc;
export type KyNang = De['kyNang'];

/* ── Speaking (12/11/2026) — giám khảo AI hỏi theo đúng 3 Part ─────────────────────────────── */
/** Câu trả lời mẫu kèm phân tích theo 4 tiêu chí (FC · LR · GRA · P). */
export type MauNoi = { part: 1 | 2 | 3; cau: string; band: string; s: string; phanTich: string[] };
export type DeNoi = DeChung & {
  kyNang: 'noi';
  /** Tổng phút ước tính (11–14). */
  phut: number;
  /** Part 1 (4–5'): 2–3 chủ đề quen thuộc, mỗi chủ đề 3–5 câu. */
  part1: { chuDe: string; cau: string[] }[];
  /** Part 2: thẻ đề (dòng đầu "Describe…", các dòng "You should say:" + gợi ý), 1' chuẩn bị + 1–2' nói, 1–2 câu chốt. */
  part2: { cueCard: string; goiY: string[]; cauChot: string[] };
  /** Part 3 (4–5'): 2 chủ đề trừu tượng nối Part 2, mỗi chủ đề 2–4 câu, khó dần (fact → opinion → compare → hypothesise). */
  part3: { chuDe: string; cau: string[] }[];
  /** Câu trả lời mẫu (ít nhất 1 cho mỗi Part) — người học xem SAU khi thi. */
  mau: MauNoi[];
};

/* ── Sàng lọc 10 phút của test đầu vào (Đề 0) — dùng lại khung PhanDoc (mcq + tfng) ───────── */
export type MucCefr = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2';
export type DeSangLoc = DeChung & {
  kyNang: 'sangloc';
  phut: number;
  /** Một phần: nhóm mcq ngữ pháp/từ vựng (câu 1–25) + đoạn đọc ngắn ~120 từ với TFNG (câu 26–30). */
  phan: PhanDoc[];
  dapAn: Record<number, DapAn>;
  /** Mức CEFR của từng câu mcq — để tính "band ngữ pháp" và luật xếp lớp. */
  mucCau: Record<number, MucCefr>;
};

/**
 * Bộ đề đủ 4 kỹ năng ("Đề N", docs/ielts-lo-trinh-0-8.md mục 4.2): gom id các tệp đề từng kỹ năng.
 * Thi đủ đề = Listening → Reading → Writing → (nghỉ) → Speaking, như thi thật.
 */
export type BoDeDu = {
  id: string;
  so: number;
  ten: string;
  capDo: string;
  /** Vị trí trong lộ trình, vd "Thi cuối Tập 1 (Ngày 15)". */
  viTri: string;
  sangLoc?: string;
  nghe: string;
  doc: string;
  viet: string;
  noi: string;
};

/** Mục lục (nhẹ) — trang chọn đề không phải tải nội dung đề. `dang`: các dạng câu có trong đề (hiện trên thẻ đề). */
export type MucDe = { id: string; kyNang: KyNang; ten: string; boDe: string; capDo: string; phut: number; soCau: number; moTa: string; dang?: DangCau[] };
