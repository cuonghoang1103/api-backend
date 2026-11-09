/**
 * Lộ trình dựng THẲNG TỪ KHOÁ HỌC CHÍNH (09/11/2026): ngôn ngữ có khoá chính (lib/khoaChinh.ts) thì "lộ trình"
 * = danh sách bài của khoá (`course.days`), chia CHẶNG (Sách → N4 → N3 → N2 · Pinyin → HSK 1 · IELTS nền tảng
 * → về đích), đánh dấu bài kiểm tra chặng / thi thử. Thuần dữ liệu + hàm thuần — cả bản 3D lẫn 2D cùng đọc.
 *
 * Số bài hiển thị: khoá Nhật/Trung có "Bài 0" nên `course.shownNum(n) = n − 1`; IELTS đánh từ Ngày 1.
 */
import type { Course } from '@/components/sach-hoc/course';
import { isReady } from '@/components/sach-hoc/manifest';
import type { Day } from '@/components/sach-hoc/types';

/** Cùng luật với `dayDone` ở sach-hoc/TongQuan.tsx (chép 3 dòng thay vì kéo cả module giao diện ấy vào trang). */
const dayDone = (d: Day, done: string[]) => {
  const ready = d.lessons.filter(isReady);
  return ready.length > 0 && ready.every((l) => done.includes(l.id));
};

export type LoaiNut = 'bai' | 'kiemtra' | 'thithu' | 'khotu';

export type ChangDef = {
  key: string;
  ten: string;
  mota: string;
  /** Màu nhận diện chặng (điểm nhấn; chữ vẫn theo theme). */
  mau: string;
  /** Khoảng SỐ BÀI HIỂN THỊ [từ, đến] (inclusive). `den` = Infinity ⇒ tới hết. */
  tu: number;
  den: number;
  kiemTra?: number[];
  thiThu?: number[];
  /** Nhãn phụ gắn vào một bài (vd. "JPD113 · Bài 1–3"). */
  nhan?: { bai: number; text: string }[];
  loai?: LoaiNut;
};

export const CHANG_THEO_MA: Record<string, ChangDef[]> = {
  ja: [
    { key: 'sach', ten: 'Sách trên lớp', mota: 'できる日本語 Bài 0–15 — đúng giáo trình JPD113 · JPD123', mau: '#f472b6', tu: 0, den: 15,
      nhan: [{ bai: 1, text: 'JPD113 · Bài 1–3' }, { bai: 4, text: 'JPD123 · Bài 4–7' }] },
    { key: 'n4', ten: 'JLPT N4', mota: 'Bài 16–25 — thể khả năng, ý chí, cho–nhận, bị động, sai khiến, kính ngữ cơ bản', mau: '#22c55e', tu: 16, den: 25, kiemTra: [20], thiThu: [25] },
    { key: 'n3', ten: 'JLPT N3', mota: 'Bài 26–40 — ngữ pháp trung cấp, đọc hiểu & nghe hiểu theo đề', mau: '#3b82f6', tu: 26, den: 40, kiemTra: [30, 35], thiThu: [40] },
    { key: 'n2', ten: 'JLPT N2', mota: 'Bài 41–55 — ngữ pháp N2, văn bình luận, email công việc, thi thử trọn đề', mau: '#8b5cf6', tu: 41, den: 55, kiemTra: [45, 50], thiThu: [55] },
    { key: 'khotu', ten: 'Kho từ vựng', mota: 'Từ theo chủ đề — ôn thêm sau khi xong lộ trình', mau: '#f59e0b', tu: 56, den: Infinity, loai: 'khotu' },
  ],
  zh: [
    { key: 'pinyin', ten: 'Pinyin & thanh điệu', mota: 'Bài 0 — phát âm, 4 thanh, nét chữ cơ bản', mau: '#f97316', tu: 0, den: 0 },
    { key: 'hsk1', ten: 'HSK 1', mota: 'Bài 1–20 — 150 từ, 20 chủ đề giao tiếp, thi thử HSK 1', mau: '#ef4444', tu: 1, den: 20, thiThu: [20] },
    { key: 'hsk2', ten: 'HSK 2', mota: 'Bài 21–40', mau: '#3b82f6', tu: 21, den: 40, thiThu: [40] },
    { key: 'hsk3', ten: 'HSK 3+', mota: 'Bài 41 trở đi', mau: '#8b5cf6', tu: 41, den: Infinity },
  ],
  en: [
    { key: 'nen', ten: 'Nền tảng', mota: 'Ngày 1–5 — ngữ pháp lõi, từ vựng theo chủ đề, nghe Part 1–2', mau: '#22c55e', tu: 1, den: 5 },
    { key: 'but', ten: 'Bứt phá', mota: 'Ngày 6–10 — đọc dạng bài, viết Task 1, nói Part 1–2', mau: '#3b82f6', tu: 6, den: 10 },
    { key: 'dich', ten: 'Về đích', mota: 'Ngày 11–15 — bài luận, Listening Part 3–4, phòng thi thử', mau: '#8b5cf6', tu: 11, den: Infinity },
  ],
};

export type NutLoTrinh = {
  /** `Day.n` — tham số `?buoi=` khi mở bài. */
  n: number;
  /** Số bài hiển thị (Bài 0… / Ngày 1…). */
  so: number;
  title: string;
  loai: LoaiNut;
  chang: number;
  xong: boolean;
  /** Có nội dung để học chưa. */
  sanSang: boolean;
  hienTai: boolean;
  nhan?: string;
};

export type ChangLoTrinh = ChangDef & { idx: number; nut: NutLoTrinh[]; xong: number };

export type LoTrinh = { chang: ChangLoTrinh[]; nut: NutLoTrinh[]; hienTai: NutLoTrinh | null; xong: number; tong: number; pct: number };

const tieuDeBuoi = (d: Day) => d.title ?? d.lessons.map((l) => l.title).slice(0, 2).join(' · ');

/** Bài thi thử nhận ra từ tiêu đề khi chặng không khai (総復習 / "thi thử"). */
const laThiThu = (title: string) => /総復習|thi thử/i.test(title);

export function dungLoTrinh(code: string, course: Course, done: string[]): LoTrinh {
  const defs = CHANG_THEO_MA[code] ?? [{ key: 'tatca', ten: course.title, mota: '', mau: '#8b5cf6', tu: -Infinity, den: Infinity }];
  const so = (n: number) => (course.shownNum ? course.shownNum(n) : n);
  const days = course.days;

  const nut: NutLoTrinh[] = [];
  let daGapChuaXong = false;
  for (const d of days) {
    const s = so(d.n);
    let ci = defs.findIndex((c) => s >= c.tu && s <= c.den);
    if (ci < 0) ci = defs.length - 1;
    const c = defs[ci];
    const title = tieuDeBuoi(d);
    const loai: LoaiNut = c.loai ?? (c.thiThu?.includes(s) || laThiThu(title) ? 'thithu' : c.kiemTra?.includes(s) ? 'kiemtra' : 'bai');
    const xong = dayDone(d, done);
    const sanSang = d.lessons.some(isReady);
    const hienTai = !xong && !daGapChuaXong && sanSang;
    if (hienTai) daGapChuaXong = true;
    nut.push({ n: d.n, so: s, title, loai, chang: ci, xong, sanSang, hienTai, nhan: c.nhan?.find((x) => x.bai === s)?.text });
  }
  // Mọi bài xong ⇒ "hiện tại" là bài cuối (gấu đứng ở đích).
  if (!daGapChuaXong && nut.length) nut[nut.length - 1].hienTai = true;

  const chang: ChangLoTrinh[] = defs
    .map((c, idx) => ({ ...c, idx, nut: nut.filter((x) => x.chang === idx), xong: 0 }))
    .filter((c) => c.nut.length > 0)
    .map((c) => ({ ...c, xong: c.nut.filter((x) => x.xong).length }));
  // Chặng rỗng bị bỏ ⇒ đánh lại chỉ số chặng cho nút.
  const map = new Map(chang.map((c, i) => [c.idx, i]));
  for (const x of nut) x.chang = map.get(x.chang) ?? 0;
  chang.forEach((c, i) => { c.idx = i; });

  const xong = nut.filter((x) => x.xong).length;
  const tong = nut.length;
  return { chang, nut, hienTai: nut.find((x) => x.hienTai) ?? null, xong, tong, pct: tong ? Math.round((xong / tong) * 100) : 0 };
}

/** Lời Bíp nói trên trang lộ trình theo tiến độ. */
export function loiBip(lt: LoTrinh, donVi: string): string {
  if (!lt.tong) return 'Lộ trình đang được soạn — quay lại sau nhé!';
  if (lt.xong === 0) return `Chào bạn! Mình là Bíp. Lộ trình có ${lt.tong} ${donVi.toLowerCase()}, bắt đầu từ ${donVi} ${lt.nut[0]?.so ?? 0} nha 🌱`;
  if (lt.xong >= lt.tong) return 'Bạn đi hết lộ trình rồi — Bíp phục sát đất! 🏆';
  const ht = lt.hienTai;
  return `Bạn xong ${lt.xong}/${lt.tong} rồi! Hôm nay học tiếp ${donVi} ${ht?.so ?? ''} nhé 💪`;
}
