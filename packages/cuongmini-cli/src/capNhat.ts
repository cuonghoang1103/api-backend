/**
 * KIỂM BẢN MỚI — tối đa 1 lần/ngày, chạy nền, không bao giờ chặn lúc mở.
 * Đọc `latest.json` cạnh gói cài (`https://cuongthai.com/cli/latest.json`),
 * có bản mới ⇒ nhắc chạy lại lệnh cài (lệnh cài chạy lại = cập nhật).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { damBaoThuMuc, thuMucGoc } from './phien';

export const CLI_BASE = (): string => (process.env.CUONGMINI_BASE_URL || 'https://cuongthai.com/cli').replace(/\/$/, '');
export const MOT_NGAY = 24 * 3600 * 1000;

export const LENH_CAI = {
  unix: 'curl -fsSL https://cuongthai.com/cli/install.sh | bash',
  windows: 'irm https://cuongthai.com/cli/install.ps1 | iex',
};
export const lenhCaiChoMay = (): string => (process.platform === 'win32' ? LENH_CAI.windows : LENH_CAI.unix);

/** So sánh `a` với `b` theo semver đơn giản (bỏ hậu tố `-dev`…). >0 = a mới hơn. */
export function soSanhPhienBan(a: string, b: string): number {
  const tach = (s: string) => s.replace(/^v/, '').split('-')[0]!.split('.').map((x) => Number.parseInt(x, 10) || 0);
  const x = tach(a);
  const y = tach(b);
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) {
    const d = (x[i] ?? 0) - (y[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

interface BoNhoKiem { luc: number; banMoi: string | null }
const duongBoNho = (): string => path.join(thuMucGoc(), 'kiem-cap-nhat.json');

export function canKiemLai(lucCuoi: number | null | undefined, bayGio = Date.now()): boolean {
  return !lucCuoi || bayGio - lucCuoi >= MOT_NGAY || lucCuoi > bayGio;
}

/** Bản mới hơn bản đang chạy (hoặc `null`). Lỗi mạng ⇒ im lặng `null`. */
export async function kiemCapNhat(phienBan: string, epKiem = false): Promise<string | null> {
  if (!epKiem && (process.env.CUONGMINI_KHONG_KIEM_CAP_NHAT === '1' || phienBan.endsWith('-dev'))) return null;
  let nho: BoNhoKiem | null = null;
  try { nho = JSON.parse(readFileSync(duongBoNho(), 'utf8')) as BoNhoKiem; } catch { /* chưa có */ }
  let banMoi = nho?.banMoi ?? null;
  if (epKiem || canKiemLai(nho?.luc)) {
    try {
      const r = await fetch(`${CLI_BASE()}/latest.json`, { signal: AbortSignal.timeout(4000), headers: { 'cache-control': 'no-cache' } });
      const j = await r.json() as { version?: string };
      banMoi = typeof j.version === 'string' ? j.version : null;
      damBaoThuMuc(thuMucGoc());
      writeFileSync(duongBoNho(), JSON.stringify({ luc: Date.now(), banMoi } satisfies BoNhoKiem));
    } catch {
      return null;
    }
  }
  return banMoi && soSanhPhienBan(banMoi, phienBan) > 0 ? banMoi : null;
}
