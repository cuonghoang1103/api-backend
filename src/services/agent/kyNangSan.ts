/**
 * ============================================================
 * KHO KỸ NĂNG CỦA AI CODE — phục vụ từ máy chủ (26/09/2026)
 * ============================================================
 *
 * Kỹ năng cài sẵn của AI Code (deploy, máy chủ SSH, database, kiểm thử…) sống
 * ở `src/services/agent/kyNangSan/*.md` — NGUỒN DUY NHẤT. App desktop tải
 * danh sách này mỗi lượt (đệm 10 phút) và chỉ dùng bản đóng gói của nó khi
 * không tải được. Nhờ vậy sửa một kỹ năng = deploy backend, có hiệu lực cho
 * mọi người dùng trong vòng 10 phút, không phải phát hành lại app.
 *
 * Ảnh Docker của backend chép cả `src/` (xem `Dockerfile.backend`), nên thư
 * mục này có mặt lúc chạy. Đọc lười và đệm theo `mtime` của thư mục: deploy
 * mới là container mới, còn khi chạy dev thì sửa file thấy ngay.
 */
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface KyNangSan { ten: string; moTa: string; than: string }

const THU_MUC = path.resolve(process.cwd(), 'src', 'services', 'agent', 'kyNangSan');
/** Tên phải gõ được và khớp lại được — cùng luật với app (`kyNang.ts`). */
const TEN_HOP_LE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const MAX_BYTE = 128 * 1024;

let dem: { mtime: number; ds: KyNangSan[]; phienBan: string } | null = null;

/** Tách phần đầu YAML tối giản (`name`, `description`) — cùng cách app làm. */
export function tachDau(noiDung: string): { ten: string | null; moTa: string | null; than: string } {
  if (!noiDung.startsWith('---')) return { ten: null, moTa: null, than: noiDung };
  const het = noiDung.indexOf('\n---', 3);
  if (het < 0) return { ten: null, moTa: null, than: noiDung };
  const dau = noiDung.slice(3, het);
  const than = noiDung.slice(noiDung.indexOf('\n', het + 1) + 1);
  const lay = (k: string): string | null => {
    const m = new RegExp(`^\\s*${k}\\s*:\\s*(.+)$`, 'm').exec(dau);
    return m ? m[1]!.trim().replace(/^["']|["']$/g, '') : null;
  };
  return { ten: lay('name'), moTa: lay('description'), than };
}

export async function dsKyNangSan(): Promise<{ ds: KyNangSan[]; phienBan: string }> {
  const st = await fs.stat(THU_MUC).catch(() => null);
  if (!st) return { ds: [], phienBan: 'trong' };
  if (dem && dem.mtime === st.mtimeMs) return dem;
  const ten = (await fs.readdir(THU_MUC)).filter((f) => f.endsWith('.md')).sort();
  const ds: KyNangSan[] = [];
  const bam = createHash('sha256');
  for (const f of ten) {
    const tho = await fs.readFile(path.join(THU_MUC, f), 'utf8').catch(() => null);
    if (tho === null || Buffer.byteLength(tho) > MAX_BYTE) continue;
    const { ten: t, moTa, than } = tachDau(tho);
    /* Không `name` hợp lệ / không mô tả / thân rỗng ⇒ BỎ: model chọn kỹ năng
       chỉ dựa vào mô tả, một mục thiếu mô tả là rác trong mọi lượt. */
    if (!t || !TEN_HOP_LE.test(t) || !moTa?.trim() || !than.trim()) continue;
    ds.push({ ten: t, moTa: moTa.trim().slice(0, 300), than: than.trim() });
    bam.update(tho);
  }
  dem = { mtime: st.mtimeMs, ds, phienBan: bam.digest('hex').slice(0, 12) };
  return dem;
}
