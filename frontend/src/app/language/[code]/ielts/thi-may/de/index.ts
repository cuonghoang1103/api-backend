/**
 * Mục lục đề phòng thi máy tính. Thêm đề mới:
 *   1. tạo `de/<id>.ts` (xem types.ts — quy ước `[[n]]`, `ev` nguyên văn),
 *   2. thêm MỘT dòng vào MUC_LUC + một `case` trong `taiDe`,
 *   3. thêm đề vào `frontend/src/lib/ielts/thiMayCham.test.ts` rồi chạy
 *      `npx tsx --test frontend/src/lib/ielts/thiMayCham.test.ts` — duyệt đủ đáp án,
 *      `ev` là chuỗi con thật, đáp án có trong bài, số câu 1–40 liên tục, đáp án chuẩn ra 40/40.
 * Nội dung đề tải lười (import() theo id) ⇒ trang chọn đề không tải cả kho.
 */
import type { De, MucDe } from './types';

export const MUC_LUC: MucDe[] = [
  { id: 'doc-01', kyNang: 'doc', ten: 'Academic Reading — Test 1', boDe: 'CuongThai Practice Tests 1', capDo: 'Band 6 → 7.5', phut: 60, soCau: 40, moTa: 'Mangroves · The shipping container · The hidden value of boredom' },
  { id: 'nghe-01', kyNang: 'nghe', ten: 'Listening — Test 1', boDe: 'CuongThai Practice Tests 1', capDo: 'Band 6 → 7.5', phut: 30, soCau: 40, moTa: 'Paddle club form · Market hall map · Urban heat project · Reef sounds lecture' },
  { id: 'viet-01', kyNang: 'viet', ten: 'Academic Writing — Test 1', boDe: 'CuongThai Practice Tests 1', capDo: 'Band 6 → 7.5', phut: 60, soCau: 2, moTa: 'Task 1 bar chart (commuting) · Task 2 discuss both views (university purpose)' },
];

export function taiDe(id: string): Promise<De> | null {
  switch (id) {
    case 'doc-01': return import('./doc-01').then((m) => m.DOC_01);
    case 'nghe-01': return import('./nghe-01').then((m) => m.NGHE_01);
    case 'viet-01': return import('./viet-01').then((m) => m.VIET_01);
    default: return null;
  }
}

export const TEN_KY_NANG: Record<MucDe['kyNang'], string> = { doc: 'Reading', nghe: 'Listening', viet: 'Writing' };
