/**
 * Tên + nhóm cổng của model (menu `/model`). Tách khỏi `lenh.ts` vì file đó nạp
 * `ct-lenh` (alias của esbuild) — test chạy bằng tsx không nạp được.
 */
import { L } from './i18n';

/** Tên model do máy chủ khai ⇒ tên thương hiệu CuongThai (như extension). */
export const doiTenModel = (ten: string): string => ten.replace(/^Claude Sonnet\b/, 'Cuong Sonnet').replace(/^Claude Opus\b/, 'CuongMini Max')
  .replace(/^Claude Haiku\b/, 'Cuong Haiku').replace(/^Claude Fable\b/, 'Cuong Fable');

/**
 * Tên hiện của một model. 18/10/2026: máy chủ gửi TÊN CuongMini cho mọi model (kể cả cổng
 * chính hãng — "CuongMini Code Max") ⇒ hiện nguyên. Đổi tên "Claude …" chỉ còn cho máy chủ cũ.
 */
export const tenModel = (m: { ten: string; cong?: string }): string => (m.cong === 'anthropic' ? L(m.ten, m.ten.replace(/ · chính hãng$/, ' · official')) : doiTenModel(m.ten));

/**
 * Mô tả model do MÁY CHỦ khai (chỉ tiếng Việt — `src/services/agent/models.ts`, `anthropicChinhHang/cauHinh.ts`) ⇒
 * tiếng Anh khi giao diện English. Khớp NGUYÊN câu; câu mới chưa dịch giữ nguyên (QA 18/10: menu /model English lẫn Việt).
 */
const MO_MODEL_EN = new Map<string, string>([
  ['Mặc định — rẻ nhất, đo 1,76 mỗi việc trên vòng lặp gọi tool', 'Default — cheapest, measured 1.76 per task in the tool loop'],
  ['Mạnh nhất — đắt gấp 2,3 lần (4,07/việc). Để dành việc khó', 'Strongest — 2.3× the cost (4.07/task). Save it for hard tasks'],
  ['Nhà khác — rẻ hơn GPT 5.6 Sol cũ ~4 lần (đo 27/09). Khi cần ý kiến thứ hai', 'Another vendor — ~4× cheaper than the old GPT 5.6 Sol. For a second opinion'],
  ['Nhẹ nhất — việc vặt, sửa một file, hỏi nhanh', 'Lightest — small chores, one-file edits, quick questions'],
  ['Nhanh nhất trong đo thật (2,4s tới chữ đầu) — việc thường ngày', 'Fastest measured (2.4s to first token) — everyday work'],
  ['MẶC ĐỊNH — cân bằng nhất giữa nhanh và giỏi', 'DEFAULT — best balance of speed and skill'],
  ['Nặng — việc cần suy luận nhiều bước', 'Heavy — multi-step reasoning'],
  ['Nặng hơn — refactor lớn, đọc cả kiến trúc', 'Heavier — big refactors, whole-architecture reading'],
  ['Thế hệ trước (4,7s tới chữ đầu) — nay Max 5 rẻ và tốt hơn', 'Previous generation (4.7s to first token) — Max 5 is now cheaper and better'],
  ['MỚI — mạnh nhất cho việc thường, rẻ và tốt hơn Max 4.8', 'NEW — strongest for everyday work, cheaper and better than Max 4.8'],
  ['⚠ Tốn token GẤP 3,5 LẦN — chỉ dùng cho việc cực khó. Có hạn mức riêng', '⚠ Uses 3.5× the tokens — only for extremely hard tasks. Has its own quota'],
  ['Tự bật khi cổng chính gặp sự cố — không cần mật khẩu, có hạn mức riêng', 'Turns on by itself when the main gateway fails — no password, its own quota'],
  ['Cân bằng — nhanh (1,8s tới chữ đầu), $2/$10 mỗi triệu token', 'Balanced — fast (1.8s to first token), $2/$10 per million tokens'],
  ['Mạnh — việc khó, refactor lớn. $4/$20 mỗi triệu token', 'Strong — hard tasks, big refactors. $4/$20 per million tokens'],
  ['⚠ Đắt nhất ($10/$50) — chỉ cho việc cực khó', '⚠ Most expensive ($10/$50) — only for extremely hard tasks'],
]);
export const moModel = (mo: string | undefined, moEn?: string): string => (mo ? L(mo, moEn || MO_MODEL_EN.get(mo) || mo) : '');

/** Nhóm cổng của model — thứ tự hiện trong menu `/model`. */
export const NHOM_CONG = ['chinh', 'anthropic', 'modelapi'] as const;
export type NhomCong = typeof NHOM_CONG[number];
export const nhomCong = (m: { cong?: string }): NhomCong => (m.cong === 'anthropic' ? 'anthropic' : m.cong === 'modelapi' ? 'modelapi' : 'chinh');
export function tenNhomCong(n: NhomCong): string {
  /* 18/10/2026: chỉ tên CuongMini — không lộ tên nhà cung cấp. */
  return n === 'anthropic' ? 'CuongMini Code Max' : n === 'modelapi' ? 'CuongMini Core' : 'CuongMini';
}
