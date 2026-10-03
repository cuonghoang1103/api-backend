/**
 * Lời dẫn bài nghe kiểu băng đề IELTS (03/10/2026) — dùng chung cho khoá học
 * (khối `listen`), Phòng thi và Kho luyện thêm.
 *
 *   ♪ nhạc hiệu → "Welcome to Cuong Thai English. IELTS Listening. Day 3,
 *   Recording 1: Bees and why we need them." → "You will hear …" →
 *   "First, you have 28 seconds to look at questions 1 to 6." → (im lặng) →
 *   "Now listen carefully and answer questions 1 to 6." → HỘI THOẠI →
 *   "That is the end of Day 3, Recording 1. You now have thirty seconds to
 *   check your answers." → ♪ nhạc kết.
 *
 * Lời dẫn đọc bằng giọng `dan` (Azure en-GB-LibbyNeural) — khác mọi nhân vật,
 * như phát thanh viên của đề thật. Nhạc hiệu chỉ ở ĐẦU và CUỐI, không chạy nền
 * dưới lời thoại: đề IELTS thật không có nhạc nền, và nhạc lẫn vào lời làm khó
 * nghe đúng thứ người học đang tập nghe.
 *
 * Nhạc hiệu: public/audio/cuongthai-{mo,ket}.mp3 — tổng hợp bằng mã (chuỗi
 * chuông G-C-E-G → hợp âm Đô trưởng), không dùng mẫu âm thanh của ai; muốn
 * đổi nhạc hiệu thì thay hai tệp đó, giữ nguyên tên.
 */
import type { Clip } from './audio';

export const NHAC_MO = '/audio/cuongthai-mo.mp3';
export const NHAC_KET = '/audio/cuongthai-ket.mp3';

export type LoiDan = {
  /** "Day 3, Recording 1" · "Part 2" · "Recording 4". */
  so: string;
  /** Tên bài bằng tiếng Anh. */
  tieuDe: string;
  /** Tiếp sau "You will hear …" — vd "a conversation between two students." */
  boiCanh?: string;
  /** Câu hỏi đi kèm [từ, đến]. */
  cau?: [number, number];
  /** Giây để đọc câu hỏi; mặc định 10 + 3 giây mỗi câu, tối đa 30 (đề thật ~30). */
  docGiay?: number;
  /** Câu chào đầu — Phòng thi chỉ chào ở Part 1. `null` = không chào. */
  chao?: string | null;
};

const cauChu = (c?: [number, number]) =>
  !c ? null : c[0] === c[1] ? `question ${c[0]}` : `questions ${c[0]} to ${c[1]}`;

/** Các đoạn phát TRƯỚC và SAU phần hội thoại. */
export function dungLoiDan(o: LoiDan): { mo: Clip[]; ket: Clip[] } {
  const c = cauChu(o.cau);
  const doc = o.cau ? (o.docGiay ?? Math.min(30, 10 + 3 * (o.cau[1] - o.cau[0] + 1))) : 0;
  const chao = o.chao === undefined ? 'Welcome to Cuong Thai English. IELTS Listening.' : o.chao;
  const dan = (text: string): Clip => ({ text, voice: 'dan' });
  const mo: Clip[] = [
    { text: '', sfx: NHAC_MO },
    dan(`${chao ? `${chao} ` : ''}${o.so}: ${o.tieuDe.replace(/[.!?]$/, '')}.`),
    ...(o.boiCanh ? [dan(`You will hear ${o.boiCanh}`)] : []),
    ...(c && doc ? [dan(`First, you have ${doc} seconds to look at ${c}.`), { text: '', pauseMs: doc * 1000 }] : []),
    dan(c ? `Now listen carefully and answer ${c}.` : 'Now listen carefully.'),
  ];
  const ket: Clip[] = [
    dan(`That is the end of ${o.so}.${c ? ' You now have thirty seconds to check your answers.' : ''}`),
    { text: '', sfx: NHAC_KET },
  ];
  return { mo, ket };
}
