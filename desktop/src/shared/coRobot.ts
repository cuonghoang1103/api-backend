/**
 * Cỡ robot theo % — dùng CHUNG cho con robot nổi (main) và con trong app
 * (renderer). Một khoá `robotCo` cho cả hai con: chỉnh một con mà con kia
 * đứng nguyên là người dùng phải nhớ mình đang chỉnh cái nào.
 *
 * 20–100%, bước 5 (chủ app 03/10/2026: "kích thước chưa được 20%–100% chuẩn").
 * Thay 4 nấc cũ 100/82/66/52 (`odinCo`) — khoá cũ vẫn đọc làm dự phòng.
 */
export const CO_TOI_THIEU = 20;
export const CO_TOI_DA = 100;
export const BUOC_CO = 5;

/** Nấc cũ 0–3 (100/82/66/52) đổi sang %, làm tròn về bước 5. */
const NAC_CU = [100, 80, 65, 50] as const;

/** Kẹp về [20, 100] và làm tròn về bội số của 5. */
export function chuanPhanTram(v: unknown): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? v : CO_TOI_DA;
  const tron = Math.round(n / BUOC_CO) * BUOC_CO;
  return Math.max(CO_TOI_THIEU, Math.min(CO_TOI_DA, tron));
}

/** Cỡ % từ thiết đặt: `robotCo` (mới) thắng, chưa có thì đổi từ nấc `odinCo` cũ. */
export function phanTramTuThietDat(s: { robotCo?: unknown; odinCo?: unknown }): number {
  if (typeof s.robotCo === 'number') return chuanPhanTram(s.robotCo);
  if (typeof s.odinCo === 'number') {
    return NAC_CU[Math.max(0, Math.min(3, Math.round(s.odinCo)))] ?? CO_TOI_DA;
  }
  return CO_TOI_DA;
}
