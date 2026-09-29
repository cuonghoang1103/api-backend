/**
 * Kiểu dữ liệu chữ Hán cho khoá tiếng Nhật — dùng chung cho:
 *  - khối `hanlop` (thẻ "Chữ Hán của lớp" như slide của cô),
 *  - thẻ chi tiết bật lên khi chạm vào MỘT chữ Hán bất kỳ trong khoá (KanjiSheet).
 *
 * Nguồn dữ liệu của một khoá (vd. Dekiru) chia hai phần, tải CHẬM qua `course.kanji()`:
 *  - `han`  : chữ của lớp, soạn tay (Hán Việt, On/Kun kiểu cô viết, nghĩa, cách nhớ, từ đi chung);
 *  - phần sinh tự động lúc build (quét mọi bài): chữ → từ vựng chứa nó, câu ví dụ,
 *    và âm On/Kun/Hán Việt lấy từ các bảng chữ Hán sẵn có của từng bài.
 *
 * ⚠️ Tệp này chỉ có kiểu (và hàm thuần) — script Node đọc được, không alias `@/`.
 */

/** Một từ đi chung với chữ Hán: `w` viết `{漢字|かな}`, `ro` romaji, `vi` nghĩa. `bang` = cô chép trên bảng. */
export type HanTuTu = { w: string; ro: string; vi: string; bang?: boolean };

/** Một chữ Hán của lớp — soạn tay theo slide/bảng của cô. */
export type HanTu = {
  /** Âm Hán Việt, IN HOA: 'HẬU'. */
  hv: string;
  /** Nghĩa tiếng Việt ngắn: 'sau, phía sau'. */
  nghia: string;
  /** Nghĩa tiếng Anh như slide ('back / after') — không bắt buộc. */
  en?: string;
  /** Âm On viết katakana: ['ゴ', 'コウ']. */
  on: string[];
  /** Âm Kun viết hiragana, `・` tách phần gốc và đuôi như cô viết: ['あと', 'うし・ろ'], ['み・ます']. */
  kun: string[];
  /** Cách nhớ bằng hình (1–2 câu, tiếng Việt). */
  nho: string;
  /** 2–5 từ đi chung, ưu tiên từ trong sách và từ cô chép. */
  tu: HanTuTu[];
};

/** Một từ vựng trong khoá có chứa chữ Hán — sinh tự động, `n` = số bài. */
export type KanjiWord = { w: string; ro: string; vi: string; n: number };
/** Câu ví dụ (từ câu ví dụ của từ vựng) — sinh tự động. */
export type KanjiEx = { text: string; ro: string; vi: string; n: number };
/** Âm/nghĩa lấy từ bảng chữ Hán của bài — sinh tự động, cho chữ không có trong `han`. */
export type KanjiBang = { hv?: string; on?: string; kun?: string; nghia?: string; n: number };

/** Phần sinh tự động (bai/kanjiIndex.ts của khoá). */
export type KanjiIndex = {
  tu: Record<string, KanjiWord[]>;
  vd: Record<string, KanjiEx[]>;
  bang: Record<string, KanjiBang>;
};

/** Danh sách chữ Hán của lớp cho một bài. `nguon`: 'slide' = khớp slide của cô, 'du-kien' = dự kiến. */
export type HanLopBai = { chars: string; nguon: 'slide' | 'du-kien' };

export type KanjiDict = KanjiIndex & {
  han: Record<string, HanTu>;
  /** Số bài → danh sách chữ của lớp. */
  lop: Record<number, HanLopBai>;
};

export const IS_KANJI = /[一-鿿㐀-䶿]/;

/** Chữ → bài (trong danh sách lớp) đầu tiên dạy nó. */
export function lopOf(d: KanjiDict): Map<string, number> {
  const m = new Map<string, number>();
  for (const [n, b] of Object.entries(d.lop).sort((a, z) => Number(a[0]) - Number(z[0]))) {
    for (const c of b.chars) if (!m.has(c)) m.set(c, Number(n));
  }
  return m;
}
