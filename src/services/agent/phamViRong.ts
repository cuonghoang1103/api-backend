/**
 * Phạm vi CT Work "tất cả dự án" / "cả workspace" của người KHÔNG Pro.
 *
 * Ở phạm vi này app không gửi mã dự án, nên máy chủ tự chọn dự án được tài trợ: người dùng phải thuộc ÍT NHẤT MỘT dự án
 * có hạn mức nhóm hoặc có admin web tài trợ. Không có dự án nào ⇒ vẫn khoá như trước, không có đường hỏi "ngoài dự án".
 * Thứ tự cố định theo mã dự án để một người luôn tính tiền vào cùng một dự án (trừ khi dự án đó chạm trần).
 * Muốn chọn đúng dự án tính tiền: gắn thư mục bằng `/ctwork project`.
 */
import { duAnNhomCuaNguoi } from './hanMucNhom.js';
import { duAnTaiTroCuaNguoi } from './taiTroAdmin.js';

export interface DuAnTaiTroDuoc { projectId: number; key: string }

/** Thuần: gộp hai nguồn, bỏ trùng, xếp theo mã dự án. */
export function gopDuAnPhamViRong(nhom: DuAnTaiTroDuoc[], taiTro: DuAnTaiTroDuoc[]): DuAnTaiTroDuoc[] {
  const theoId = new Map<number, DuAnTaiTroDuoc>();
  for (const d of [...nhom, ...taiTro]) {
    if (!theoId.has(d.projectId)) theoId.set(d.projectId, { projectId: d.projectId, key: d.key });
  }
  return [...theoId.values()].sort((a, b) => a.projectId - b.projectId);
}

/** Các dự án người này dùng CuongMini được nhờ tài trợ. Rỗng = không có dự án nào. */
export async function duAnChoPhamViRong(userId: number): Promise<DuAnTaiTroDuoc[]> {
  const [nhom, taiTro] = await Promise.all([
    duAnNhomCuaNguoi(userId).catch(() => []),
    duAnTaiTroCuaNguoi(userId).catch(() => []),
  ]);
  return gopDuAnPhamViRong(nhom, taiTro);
}
