/**
 * Kiểu dữ liệu chung của máy chấm Code Lab trong trình duyệt (đợt Academy 28/10/2026).
 * Lược đồ đầy đủ: content/codelab/README.md (+ web-foundations-practice/nguon/_luoc-do.mjs).
 */

/** Một kiểm (mục kiểm) như tác giả viết trong testsJson.kiem — để mở cho mọi loại. */
export interface Kiem {
  /** Chỉ số GỐC trong bộ kiểm đủ (máy chủ gắn) — kết quả Chạy thử/Nộp dùng nó. */
  i?: number;
  moTa: string;
  kiem?: string;
  an?: boolean;
  /** Chức năng (thang điểm) mà kiểm này thuộc về: `thangDiem[].ma`. */
  nhom?: string;
  [k: string]: unknown;
}

export interface ThangDiemMuc { ma: string; ten: string; diem: number; moTa?: string }

export interface TestsJson {
  loai: string;
  phienBan?: number;
  kiem?: Kiem[];
  thangDiem?: ThangDiemMuc[];
  /** Máy chủ gắn: tổng số kiểm của đề + số kiểm ẩn (chỉ chạy lúc Nộp). */
  soKiem?: number;
  soAn?: number;
  [k: string]: unknown;
}

export interface KetQuaKiem {
  /** Chỉ số gốc. */
  i: number;
  dat: boolean;
  /** Bỏ qua (máy chấm không làm được kiểm này ở đây) — không tính đạt, không tính trượt khi Chạy thử. */
  boQua?: string;
  an?: boolean;
  nhom?: string | null;
  moTa?: string;
  /** "Thấy gì" — giá trị nhận được / lý do trượt. Kiểm ẩn: để trống khi hiện. */
  thay?: string;
  /** Giá trị mong đợi (chỉ kiểm mẫu, loại js/console) — để hiện "mong đợi vs nhận". */
  mong?: string;
  ms?: number;
  /** Loại 'sql' (29/10/2026): bảng mong đợi / nhận được (≤ 30 dòng) + dòng thiếu/thừa — TestPanel vẽ bảng so. Kiểm ẩn: không có. */
  bangSql?: {
    mong?: { cot: string[]; hang: unknown[][]; tong?: number };
    thay?: { cot: string[]; hang: unknown[][]; tong?: number };
    thieu?: unknown[][];
    thua?: unknown[][];
    dongLech?: number;
  };
}

export type TepMap = Record<string, string>;

export interface DiemNhom { ma: string; ten: string; diem: number; dat: number; tong: number; diemDat: number }
export interface Diem { score: number; maxScore: number; nhom: DiemNhom[] }

/** Loại chấm chạy được trong trình duyệt hôm nay. */
export const LOAI_TRINH_DUYET = new Set(['dom', 'js', 'console', 'module', 'react', 'choice', 'order', 'table', 'sql']);
export const LOAI_TINH = new Set(['choice', 'order', 'table']);
/** Loại chờ máy chấm máy chủ (máy Linux nhà) — giao diện ghi "sắp có". */
export const LOAI_MAY_CHU = new Set(['java', 'tsql', 'bash', 'sql-pg', 'python', 'text-ai']);

export const TEN_LOAI: Record<string, string> = {
  dom: 'HTML/CSS · chấm DOM',
  js: 'JavaScript · gọi hàm',
  console: 'JavaScript · so output',
  module: 'ES modules',
  react: 'React · chấm giao diện',
  choice: 'Trắc nghiệm',
  order: 'Sắp xếp',
  table: 'Điền bảng',
  sql: 'SQL · PostgreSQL WASM (chế độ SQL Server)',
  python: 'Python',
  java: 'Java',
  tsql: 'T-SQL',
  'sql-pg': 'PostgreSQL',
  bash: 'Bash',
  'text-ai': 'Tự luận · AI chấm',
  manual: 'Tự đánh dấu',
};
