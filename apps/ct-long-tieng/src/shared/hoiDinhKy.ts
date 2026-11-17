/**
 * Nhịp hỏi máy chủ — hàm thuần, có test.
 *
 *  • Có việc đang chạy + cửa sổ đang mở ⇒ 3 s (thấy tiến độ nhích).
 *  • Có việc đang chạy + cửa sổ ẩn ⇒ 15 s (vẫn phải hỏi để TỰ TẢI về và báo xong).
 *  • Không việc nào chạy + cửa sổ mở ⇒ 30 s. Cửa sổ ẩn ⇒ NGỪNG (null) cho tới khi mở lại.
 *  • Lỗi mạng liên tiếp ⇒ lùi theo cấp số nhân, trần 2 phút — mất mạng một buổi không thành ngàn yêu cầu hỏng.
 */
export interface DauVaoNhip {
  dangChay: boolean;
  cuaSoHien: boolean;
  loiLienTiep: number;
}

export const NHIP = { nhanh: 3_000, an: 15_000, ranh: 30_000, tranLoi: 120_000 } as const;

export function tinhNhip({ dangChay, cuaSoHien, loiLienTiep }: DauVaoNhip): number | null {
  if (!dangChay && !cuaSoHien) return null;
  const goc = dangChay ? (cuaSoHien ? NHIP.nhanh : NHIP.an) : NHIP.ranh;
  if (loiLienTiep <= 0) return goc;
  return Math.min(NHIP.tranLoi, Math.max(goc, 5_000 * 2 ** (Math.min(loiLienTiep, 10) - 1)));
}

/** Dòng tiến độ yt-dlp theo `--progress-template "download:CTLT|%(progress.downloaded_bytes)s|%(progress.total_bytes)s|%(progress.total_bytes_estimate)s"`. */
export function docDongYtDlp(dong: string): { daNhan: number; tong: number | null } | null {
  const m = /^CTLT\|([^|]*)\|([^|]*)\|([^|]*)\s*$/.exec(dong.trim());
  if (!m) return null;
  const n = (s: string) => {
    const v = Number(s);
    return Number.isFinite(v) && v > 0 ? v : null;
  };
  const daNhan = n(m[1]);
  if (daNhan === null) return null;
  return { daNhan, tong: n(m[2]) ?? n(m[3]) };
}
