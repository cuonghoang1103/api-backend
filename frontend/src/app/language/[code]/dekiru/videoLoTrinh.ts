/**
 * 🎬 Lộ trình xem video của MỘT bài Dekiru — xếp theo thứ tự HỌC, đánh số 1…N, không lặp video (23/10/2026,
 * người học: "nhiều video xếp lộn xộn, không biết học từ đâu"). Dựng từ `videos.ts` (sinh tự động): không phải sửa tay
 * mỗi khi thêm video. Một video gắn ở nhiều bài (dùng lại) chỉ hiện MỘT lần, ở nhóm có thứ tự học sớm nhất.
 */
import type { Lesson, VideoMuc } from '@/components/sach-hoc/types';
import { VIDEO_NEO } from './videos';

export type MucVideo = { id: string; tieuDe: string; giay?: number; lessonId: string };
export type NhomVideo = { ten: string; mota: string; videos: MucVideo[] };

/** [hạng, tên nhóm, mô tả] — hạng càng nhỏ càng học trước. */
const NHOM: Array<[RegExp, number, string, string]> = [
  [/^b\d+-hoi-thoai$/, 1, '① Hội thoại — nghe và hiểu tình huống', 'Xem đầu tiên: biết bài này nói về chuyện gì.'],
  [/^b\d+-tu-vung$/, 2, '② Từ vựng — học từ trước khi học câu', 'Từ vựng của bài, chia theo chủ đề.'],
  [/^b\d+-ngu-phap$/, 3, '③ Ngữ pháp — từng điểm một', 'Học đúng thứ tự ポイント; xem xong làm bài tập nhỏ trong bài.'],
  [/^b\d+-(kanji|han-lop)$/, 4, '④ Chữ Hán của lớp', 'Cách đọc, nghĩa và từ thường gặp của chữ Hán lớp học.'],
  [/^b\d+-nghe$/, 5, '⑤ Luyện nghe', 'Nghe có chủ đích, làm đề.'],
  [/^b\d+-noi$/, 6, '⑥ Luyện nói — dạng câu hỏi thi', 'Tập nói theo dạng thi, tự ghi âm đối chiếu.'],
  [/^(slot-|slide-tong-hop-|s113-)/, 7, '⑦ Ôn lại theo từng buổi của cô', 'Xem khi muốn ôn đúng buổi trên lớp hoặc đối chiếu slide.'],
  [/^(bt-|on-giua-ky|chia-the-te-)/, 8, '⑧ Chữa bài tập & đề của cô', 'Làm đề trước, rồi xem video để so đáp án và cách làm.'],
  [/^(cuoi-ky|ck-)/, 9, '⑨ Ôn cuối kỳ (cả Bài 4–7)', 'Tuần trước kỳ thi: cấu trúc đề, ngữ pháp, chữ Hán, thi nói.'],
  [/^lt-/, 10, '⑩ Luyện thêm', 'Bài luyện thêm từ dễ đến khó.'],
];

const hang = (lessonId: string) => NHOM.find(([re]) => re.test(lessonId)) ?? null;

/** Nhóm video của bài thứ `dayN` (buổi n = Bài n − 1). Buổi cuối (Bài 7) gom thêm video ôn cuối kỳ. */
export function videoLoTrinh(lessons: Lesson[], dayN: number): NhomVideo[] {
  const ids = new Set(lessons.map((l) => l.id));
  const cuoiKy = dayN === 8;
  const thu: Array<{ r: number; ten: string; mota: string; v: MucVideo; src: string; ord: number }> = [];
  let ord = 0;
  for (const [lessonId, theoNeo] of Object.entries(VIDEO_NEO)) {
    const h = hang(lessonId);
    if (!h || !(ids.has(lessonId) || (cuoiKy && h[1] === 9))) continue;
    for (const ds of Object.values(theoNeo)) {
      for (const v of ds as VideoMuc[]) {
        thu.push({ r: h[1], ten: h[2], mota: h[3], src: v.src, ord: ord++, v: { id: v.id ?? v.src, tieuDe: v.tieuDe, giay: v.thoiLuongGiay, lessonId } });
      }
    }
  }
  const daCo = new Set<string>();
  const ra = new Map<number, NhomVideo>();
  for (const x of thu.sort((a, b) => a.r - b.r || a.ord - b.ord)) {
    if (daCo.has(x.src)) continue;
    daCo.add(x.src);
    const g = ra.get(x.r) ?? { ten: x.ten, mota: x.mota, videos: [] };
    g.videos.push(x.v);
    ra.set(x.r, g);
  }
  return [...ra.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => g);
}
