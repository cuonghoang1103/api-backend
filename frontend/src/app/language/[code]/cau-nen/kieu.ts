/**
 * Kiểu dữ liệu của lộ trình "1000 câu nền — dịch 2 chiều" (`/language/en/cau-nen`, 28/11/2026).
 *
 * TS THUẦN, không import gì ngoài kiểu: tệp dữ liệu `du-lieu/ngayN.ts` chạy được bằng
 * `node --experimental-strip-types` (bộ kiểm `scripts/cau-nen-kiem.mts`) và xuất ra JSON cho app iOS
 * CT Language (`public/sach-hoc/cau-nen/*.json`, sinh lúc build) mà không phải chép lại nội dung.
 *
 * Chữ trong `y`, `giai`, `loi` hiểu cú pháp nhỏ: `**đậm**`, `~~câu sai~~` (gạch, tô đỏ).
 */

import type { Block } from '@/components/sach-hoc/types';

/** Một câu luyện dịch hai chiều. */
export type Cau = {
  /** `cn<ngày>-<số 2 chữ số>`, vd `cn1-07`. KHÔNG đổi id đã phát hành: tiến độ ôn lặp gắn theo id. */
  id: string;
  /** Câu tiếng Việt tự nhiên (không dịch từng chữ từ câu Anh). */
  vi: string;
  /** Câu Anh–Mỹ chuẩn, tự nhiên như người bản xứ nói. Đây là câu được đọc to (TTS). */
  en: string;
  /** Các cách nói ĐÚNG khác (dùng để chấm). Không cần ghi dạng rút gọn I'm/I am — bộ chấm tự mở. */
  alt?: string[];
  /** Khung câu, vd "S + am/is/are + a/an + N". */
  khung: string;
  /** Lỗi người Việt hay mắc ở câu này, vd "~~I am student~~ — thiếu a". */
  loi?: string;
  /** Gợi ý từ, vd "kỹ sư = engineer (bắt đầu bằng nguyên âm ⇒ an)". */
  goi?: string;
};

/** Một dòng so sánh trật tự Việt – Anh. */
export type SoSanh = {
  /** Câu tiếng Việt. */
  vi: string;
  /** Kiểu dịch từng chữ (SAI) — hiện gạch đỏ. */
  tungChu: string;
  /** Câu Anh đúng. */
  en: string;
  /** Vì sao — một câu ngắn. */
  viSao: string;
};

/** Phần (a) "Khung câu hôm nay". */
export type BaiKhung = {
  /** Ý giảng ngắn (3–6 ý). */
  y: string[];
  /** Công thức + nghĩa. */
  khung: { mau: string; vi: string }[];
  /** 2–4 dòng: tiếng Việt → dịch từng chữ (sai) → câu đúng. */
  soSanh: SoSanh[];
  /** 3–4 câu ví dụ có giọng đọc. */
  viDu: { en: string; vi: string }[];
  /** Mẹo nhớ / ghi chú cuối (tuỳ chọn). */
  meo?: string[];
};

/** Một từ vựng của ngày. `anh` = tên ảnh (Fluent Emoji trong scripts/hinh/fluent-catalog.json, hoặc `ai-…` khai
 *  prompt ở scripts/hinh/ai/cau-nen.json) — ảnh ở https://media.cuongthai.com/hoc/hinh/<anh>.webp. */
export type TuVung = {
  w: string;
  vi: string;
  /** n · v · adj · adv · phr · prep · pron … */
  loai: string;
  anh?: string;
  /** Câu ví dụ ngắn (đọc to được) + nghĩa. */
  ex: string;
  exVi: string;
};

/** Một lượt trong đoạn hội thoại ngắn (dùng lại các câu của ngày). `vai` A / B ⇒ hai giọng khác nhau. */
export type LuotThoai = { vai: 'A' | 'B'; ten: string; en: string; vi: string };

/** Phần ✍️ "Viết tay" — người học viết vào vở / iPad rồi tự dò. */
export type PhanViet = {
  /** Cách đặt câu khi viết (viết hoa, dấu câu, trật tự…), 3–5 ý. */
  y: string[];
  /** Lỗi chính tả hay gặp: "~~studen~~ → **student**". */
  chinhTa: string[];
  /** Đề viết đoạn 3–5 câu (tiếng Việt). */
  de: string;
  /** Đoạn mẫu: mỗi phần tử một câu Anh + nghĩa. */
  mau: { en: string; vi: string }[];
};

export type NgayCauNen = {
  n: number;
  /** Tên ngày, vd "be + danh từ / tính từ". */
  ten: string;
  /** Một câu: học xong ngày này nói được gì. */
  mucTieu: string;
  /** Ngày ôn (5, 10, 15, 20, 25, 29) hoặc kiểm tra cuối (30). */
  on?: boolean;
  bai: BaiKhung;
  /** 📊 Ngữ pháp giảng kỹ: khối của bộ khung sách-học (table · patterns · sodo · note · rule · examples) —
   *  web dựng bằng `Blocks`, app iOS đã đọc được đúng các khối này (ChuSachHoc.swift). */
  nguPhap?: Block[];
  /** 🖼️ 12–20 từ vựng nền có ảnh. */
  tuVung?: TuVung[];
  /** 💬 Đoạn hội thoại ngắn dùng lại câu của ngày. */
  hoiThoai?: { tieuDe: string; luot: LuotThoai[] };
  /** ✍️ Hướng dẫn viết tay + đoạn mẫu. */
  viet?: PhanViet;
  cau: Cau[];
};

/** Một dòng mục lục (muc-luc.ts) — nhẹ, không kèm câu. */
export type MucNgay = { n: number; ten: string; khung: string; on?: boolean; soCau: number; /** Ảnh thẻ ngày (Fluent Emoji). */ anh: string };
