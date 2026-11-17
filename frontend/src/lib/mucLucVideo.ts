/**
 * ============================================================
 * MỤC LỤC VIDEO + "HỎI ĐÚNG ĐOẠN NÀY" — phần THUẦN (test được, không React)
 * ============================================================
 *
 * Người dùng 17/11/2026: "trong video chia ra từng phần, từng chủ đề, có phút:giây để bấm vào hỏi đúng phần đó".
 *
 * Mục lục (`parts`) sinh sẵn lúc dựng phụ đề (`scripts/phu-de-tu-video-rieng.lib.mjs › chiaChuong`), nạp vào
 * `lesson_own_transcripts`. Ở đây chỉ: tìm chương đang phát, dựng ĐOẠN để hỏi (theo chương, hoặc ±30 s quanh chỗ đang
 * xem), câu hỏi mẫu + khoá cache của từng kiểu hỏi.
 *
 * ⚠️ `khoaCacheDoan` PHẢI giống hệt bản máy chủ (`src/services/video/phuDeRieng.ts`) — máy chủ kiểm khoá khớp mốc và
 * BỎ cache nếu lệch, nên lệch một ký tự là mọi chip theo chương mất cache âm thầm (vẫn chạy, chỉ đắt hơn).
 */
import { moc } from './mocThoiGian';

export interface PhanMucLuc { t: number; den?: number; ten: string }
export interface DoanHoi { tu: number; den: number; ten?: string }
export interface CauPhuDe { t: number; vi?: string; en?: string }

/** Mốc kết thúc của chương i: `den` nếu có, không thì đầu chương sau, không thì hết video. */
export function denCua(parts: PhanMucLuc[], i: number, thoiLuong?: number | null): number {
  const p = parts[i];
  if (!p) return 0;
  const d = p.den ?? parts[i + 1]?.t ?? thoiLuong ?? p.t + 60;
  return Number.isFinite(d) && d > p.t ? d : p.t + 60;
}

/** Chương đang phát ở giây `giay` (-1 khi chưa tới chương nào). */
export function chiSoDangXem(parts: PhanMucLuc[], giay: number | null | undefined): number {
  if (giay == null || !Number.isFinite(giay) || !parts.length) return -1;
  let ra = -1;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].t <= giay + 0.25) ra = i;
    else break;
  }
  return ra;
}

/** Đoạn để hỏi của MỘT chương. */
export function doanCuaPhan(parts: PhanMucLuc[], i: number, thoiLuong?: number | null): DoanHoi {
  const p = parts[i];
  return { tu: Math.max(0, Math.round(p.t * 10) / 10), den: Math.round(denCua(parts, i, thoiLuong) * 10) / 10, ten: p.ten };
}

/** "Hỏi đoạn đang xem": ±`banKinh` giây quanh chỗ đang xem, kẹp trong [0, thời lượng]. */
export function doanQuanhGiay(giay: number, thoiLuong?: number | null, banKinh = 30): DoanHoi {
  const g = Math.max(0, Math.floor(giay));
  const het = thoiLuong && Number.isFinite(thoiLuong) ? Math.floor(thoiLuong) : g + banKinh;
  const tu = Math.max(0, g - banKinh);
  const den = Math.max(tu + 5, Math.min(het, g + banKinh));
  return { tu, den };
}

/** Khoá cache của một kiểu hỏi trên một đoạn — GIỐNG HỆT `khoaCacheDoan` ở máy chủ. */
export function khoaCacheDoan(kieu: string, d: DoanHoi): string {
  return `${kieu}@${Math.round(d.tu)}-${Math.round(d.den)}`.slice(0, 40);
}

/** "3:20 – 5:10" */
export function nhanDoan(d: DoanHoi): string {
  return `${moc(d.tu)} – ${moc(d.den)}`;
}

/** Mốc của đoạn viết theo cú pháp gia sư dùng — `[3:20 - 5:10]` thành nút tua được trong câu trả lời. */
export function mocDoan(d: DoanHoi): string {
  return `[${moc(d.tu)} - ${moc(d.den)}]`;
}

/** Các câu phụ đề nằm trong đoạn (để hiện "lời giảng" của một chương ngay trong mục lục). */
export function cauTrongDoan<T extends CauPhuDe>(cues: T[], d: DoanHoi): T[] {
  return cues.filter((c) => Number.isFinite(c.t) && c.t >= d.tu - 0.5 && c.t < d.den);
}

/**
 * Bốn kiểu hỏi nhanh trên một đoạn — đúng bốn câu người học hay cần nhất (người dùng nêu: "giải thích chậm và dễ
 * hơn", "ví dụ đời thường", "tóm tắt phần này", "đố mình 3 câu"). `kieu` ngắn vì khoá cache máy chủ cắt ở 30 ký tự.
 */
export const HOI_NHANH_DOAN: { kieu: string; nhan: string; cau: (d: DoanHoi) => string }[] = [
  {
    kieu: 'pgt', nhan: 'Giải thích dễ hiểu',
    cau: (d) => `Giải thích chậm và dễ hiểu đoạn ${mocDoan(d)}${d.ten ? ` “${d.ten}”` : ''} của video: ý chính là gì, vì sao quan trọng.`,
  },
  {
    kieu: 'pvd', nhan: 'Ví dụ đời thường',
    cau: (d) => `Cho mình một ví dụ đời thường để hiểu đoạn ${mocDoan(d)}${d.ten ? ` “${d.ten}”` : ''} của video.`,
  },
  {
    kieu: 'ptt', nhan: 'Tóm tắt đoạn này',
    cau: (d) => `Tóm tắt đoạn ${mocDoan(d)}${d.ten ? ` “${d.ten}”` : ''} của video thành vài ý chính, kèm thuật ngữ cần nhớ.`,
  },
  {
    kieu: 'pdo', nhan: 'Đố mình 3 câu',
    cau: (d) => `Đố mình 3 câu về đoạn ${mocDoan(d)}${d.ten ? ` “${d.ten}”` : ''} của video (đáp án để ở cuối, sau dòng "Đáp án").`,
  },
];

/** Câu hỏi tiếp theo sau một câu trả lời — không cache (phụ thuộc mạch hội thoại). */
export const HOI_TIEP: { nhan: string; cau: string }[] = [
  { nhan: 'Giải thích chậm và dễ hơn', cau: 'Giải thích lại chậm hơn và dễ hiểu hơn, như cho người mới bắt đầu.' },
  { nhan: 'Cho ví dụ đời thường', cau: 'Cho mình một ví dụ đời thường cho ý vừa rồi.' },
  { nhan: 'Tóm tắt phần này', cau: 'Tóm tắt phần vừa rồi thành 3–5 ý chính.' },
  { nhan: 'Đố mình 3 câu', cau: 'Đố mình 3 câu ngắn về phần vừa rồi (đáp án để ở cuối, sau dòng "Đáp án").' },
];

/** Câu + khoá cache "Tóm tắt video" — TRÙNG phòng học video (`MucVideo.tsx`) ⇒ dùng chung một câu trả lời đã cache. */
export const CAU_TOM_TAT_VIDEO = 'Tóm tắt video này theo các phần có mốc thời gian.';
export const KHOA_TOM_TAT_VIDEO = 'video_tomtat';
