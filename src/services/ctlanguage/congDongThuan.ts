/**
 * CT Language — CỘNG ĐỒNG: phần logic THUẦN (không CSDL, không mạng) — kiểm bằng `congDongThuan.test.ts`.
 * Điểm "Nổi bật", huy hiệu, điểm xếp hạng, thẻ chủ đề (danh sách trắng theo ngôn ngữ), @nhắc tên, đoạn trích.
 * App iOS chép lại danh sách thẻ (`Modules/CongDong/MoHinhCD.swift › TheCD`) — đổi ở đây thì đổi cả hai.
 */
import type { NnTuDien } from './tuDien.js';

export const LOAI_BAI = ['hoi', 'thao-luan', 'chia-se', 'tim-ban'] as const;
export type LoaiBai = (typeof LOAI_BAI)[number];
export const docLoai = (v: unknown): LoaiBai => ((LOAI_BAI as readonly string[]).includes(String(v)) ? (String(v) as LoaiBai) : 'hoi');

export interface TheCD { ma: string; ten: string }
const THE_CHUNG: TheCD[] = [
  { ma: 'ngu-phap', ten: 'Ngữ pháp' }, { ma: 'tu-vung', ten: 'Từ vựng' }, { ma: 'phat-am', ten: 'Phát âm' },
  { ma: 'giao-tiep', ten: 'Giao tiếp' }, { ma: 'thi-cu', ten: 'Thi cử' }, { ma: 'kinh-nghiem', ten: 'Kinh nghiệm' },
  { ma: 'tai-lieu', ten: 'Tài liệu' },
];
const THE_RIENG: Record<NnTuDien, TheCD[]> = {
  en: [{ ma: 'ielts', ten: 'IELTS' }, { ma: 'toeic', ten: 'TOEIC' }, { ma: 'viet', ten: 'Viết' }, { ma: 'nghe', ten: 'Nghe' }],
  ja: [
    { ma: 'n5', ten: 'N5' }, { ma: 'n4', ten: 'N4' }, { ma: 'n3', ten: 'N3' }, { ma: 'n2', ten: 'N2' }, { ma: 'n1', ten: 'N1' },
    { ma: 'kanji', ten: 'Kanji' }, { ma: 'kana', ten: 'Kana' },
  ],
  zh: [
    { ma: 'hsk1', ten: 'HSK1' }, { ma: 'hsk2', ten: 'HSK2' }, { ma: 'hsk3', ten: 'HSK3' }, { ma: 'hsk4', ten: 'HSK4' },
    { ma: 'hsk5', ten: 'HSK5' }, { ma: 'hsk6', ten: 'HSK6' }, { ma: 'han-tu', ten: 'Hán tự' }, { ma: 'pinyin', ten: 'Pinyin' },
  ],
};
export const THE_TOI_DA = 4;
export const theCuaNn = (nn: NnTuDien): TheCD[] => [...THE_RIENG[nn], ...THE_CHUNG];

/** Chỉ giữ thẻ trong danh sách trắng của `nn`, bỏ trùng, tối đa `THE_TOI_DA`. Thẻ lạ bị bỏ im lặng (không 400). */
export function locThe(nn: NnTuDien, goc: unknown): string[] {
  if (!Array.isArray(goc)) return [];
  const hop = new Set(theCuaNn(nn).map((t) => t.ma));
  const ra: string[] = [];
  for (const x of goc) {
    const m = String(x ?? '').trim().toLowerCase();
    if (hop.has(m) && !ra.includes(m)) ra.push(m);
    if (ra.length >= THE_TOI_DA) break;
  }
  return ra;
}

/**
 * Điểm "Nổi bật" = (thích×2 + trả lời×3 + xem×0,1 [trần 500 lượt] + BTV 5 + 1) ÷ (giờ tuổi + 2)^1,4.
 * Kiểu Hacker News: tương tác kéo lên, thời gian kéo xuống — bài mới ít tương tác vẫn có chỗ, bài cũ nhiều thích dần lùi.
 */
export function diemNoiBat(b: { soThich: number; soTraLoi: number; soXem: number; btv: boolean; createdAt: Date }, bayGio = new Date()): number {
  const tho = b.soThich * 2 + b.soTraLoi * 3 + Math.min(b.soXem, 500) * 0.1 + (b.btv ? 5 : 0) + 1;
  const gio = Math.max(0, (bayGio.getTime() - b.createdAt.getTime()) / 3_600_000);
  return tho / Math.pow(gio + 2, 1.4);
}

/** Điểm giúp đỡ cho bảng xếp hạng: trả lời ×2, mỗi lượt thích trả lời +1, câu trả lời hay nhất +10. */
export const diemXepHang = (d: { traLoi: number; duocThich: number; hayNhat: number }) => d.traLoi * 2 + d.duocThich + d.hayNhat * 10;
export const KHOANG_XEP_HANG = { tuan: 7, thang: 30 } as const;
export type KhoangXepHang = keyof typeof KHOANG_XEP_HANG;
export const docKhoang = (v: unknown): KhoangXepHang => (v === 'thang' ? 'thang' : 'tuan');
/** Mốc bắt đầu: 7 / 30 ngày gần nhất (cuốn chiếu — không reset đầu tuần, bảng không trống trơn sáng thứ Hai). */
export const tuNgayXepHang = (k: KhoangXepHang, bayGio = new Date()) => new Date(bayGio.getTime() - KHOANG_XEP_HANG[k] * 86_400_000);

export interface HuyHieu { ma: 'btv' | 'chuyen-gia' | 'hay-giup' | 'tich-cuc' | 'nguoi-moi' | 'pro'; ten: string }
/** Huy hiệu theo thứ tự ưu tiên (phần tử đầu = huy hiệu hiện cạnh tên trên thẻ bài). */
export function huyHieu(d: { soBai: number; soTraLoi: number; soHayNhat: number; laPro: boolean; laAdmin: boolean }): HuyHieu[] {
  const ra: HuyHieu[] = [];
  if (d.laAdmin) ra.push({ ma: 'btv', ten: 'BTV' });
  if (d.soHayNhat >= 15) ra.push({ ma: 'chuyen-gia', ten: 'Chuyên gia' });
  else if (d.soHayNhat >= 3) ra.push({ ma: 'hay-giup', ten: 'Hay giúp đỡ' });
  if (d.soTraLoi >= 20) ra.push({ ma: 'tich-cuc', ten: 'Tích cực' });
  if (!d.laAdmin && d.soBai + d.soTraLoi < 3) ra.push({ ma: 'nguoi-moi', ten: 'Người mới' });
  if (d.laPro && !d.laAdmin) ra.push({ ma: 'pro', ten: 'Pro' });
  return ra;
}

/** `@ten_dang_nhap` trong câu trả lời ⇒ danh sách username (chữ thường, không trùng, tối đa 5). Email `a@b.c` không tính. */
export function timNhac(noiDung: string): string[] {
  const ra: string[] = [];
  for (const m of noiDung.matchAll(/(^|[^\p{L}\p{N}_.@])@([A-Za-z0-9_.]{3,40})/gu)) {
    const u = m[2].replace(/\.+$/, '').toLowerCase();
    if (u.length >= 3 && !ra.includes(u)) ra.push(u);
    if (ra.length >= 5) break;
  }
  return ra;
}

/** Đoạn trích cho bảng tin: gộp khoảng trắng, cắt ở ranh giới từ gần `n`. */
export function trich(s: string, n = 280): string {
  const g = s.replace(/\s+/g, ' ').trim();
  if (g.length <= n) return g;
  const cat = g.slice(0, n);
  const sp = cat.lastIndexOf(' ');
  return `${(sp > n * 0.6 ? cat.slice(0, sp) : cat).trimEnd()}…`;
}
