/**
 * Khoá CHÍNH của từng ngôn ngữ (09/11/2026) — bấm một ngôn ngữ ở /language là vào thẳng lộ trình học theo ngày,
 * không qua trang kỹ năng trung gian. Trang kỹ năng cũ vẫn mở được bằng `/language/<code>?hub=1` (và từ nút
 * 🧰 Công cụ trong khoá học).
 */
export type KhoaChinh = { href: string; ten: string; mota: string; capDo: string };

export const KHOA_CHINH: Record<string, KhoaChinh> = {
  ja: {
    href: '/language/ja/dekiru',
    ten: 'できる日本語 → N2',
    mota: 'Bài 0–15 theo sách trên lớp (JPD113 · JPD123), Bài 16–55 lên N4 → N3 → N2, thi thử từng chặng.',
    capDo: 'Từ số 0 → JLPT N2',
  },
  en: {
    href: '/language/en/ielts',
    ten: 'IELTS nền tảng',
    mota: 'Lộ trình theo ngày từ số 0: ngữ pháp, từ vựng, nghe, đọc, viết, nói — có gia sư AI giảng từng trang.',
    capDo: 'Từ số 0 → IELTS 5.0+',
  },
  zh: {
    href: '/language/zh/ch',
    ten: 'CH · Tiếng Trung',
    mota: 'Pinyin, thanh điệu, hội thoại, chữ Hán (xem nét, tập viết), nghe, nói — theo cấp HSK.',
    capDo: 'Từ số 0 → HSK 6',
  },
};

/** Khoá phụ cùng ngôn ngữ — hiện trong 🧰 Công cụ của khoá chính. */
export const KHOA_PHU: Record<string, { href: string; ten: string }[]> = {
  ja: [{ href: '/language/ja/jp', ten: 'JP · Từ 0 đến N1 (khoá JLPT tự học)' }],
};
