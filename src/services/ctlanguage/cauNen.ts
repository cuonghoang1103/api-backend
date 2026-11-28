/**
 * "Câu nền" cho app iOS CT Language (28/11/2026) — đọc JSON soạn sẵn `content/ctlanguage/cau-nen/{en,ja}.json`
 * (sinh bằng `npx tsx scripts/xuat-cau-nen.mts`). Hợp đồng: ios-app/docs/ctlanguage-cau-nen-hop-dong.md.
 *   nn=en: "1000 câu nền" (đơn vị = ngày) · nn=ja: "Luyện câu Dekiru Bài 1–10" (đơn vị = bài).
 */
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';

type DonVi = { so: number; cau?: unknown[] | null } & Record<string, unknown>;
type Goi = { nn: string; donVi: DonVi[] } & Record<string, unknown>;

export const THU_MUC_CAU_NEN = path.join(process.cwd(), 'content', 'ctlanguage', 'cau-nen');
const DEM = new Map<string, { mtime: number; goi: Goi }>();

function napGoi(nn: string, thuMuc = THU_MUC_CAU_NEN): Goi {
  const f = path.join(thuMuc, `${nn}.json`);
  let mtime: number;
  try { mtime = statSync(f).mtimeMs; } catch { throw new NotFoundError('Chưa có dữ liệu câu nền cho ngôn ngữ này'); }
  const c = DEM.get(f);
  if (c && c.mtime === mtime) return c.goi;
  const goi = JSON.parse(readFileSync(f, 'utf8')) as Goi;
  DEM.set(f, { mtime, goi });
  return goi;
}

/** `so` = số ngày (en) / số bài (ja). Không có `so` ⇒ cả gói, KHÔNG kèm câu (app tự gọi tuyến lẻ — gói nhẹ). */
export function layCauNen(nn: string, so?: number, thuMuc?: string): Goi {
  if (nn !== 'en' && nn !== 'ja') throw new BadRequestError('nn phải là en hoặc ja');
  const goi = napGoi(nn, thuMuc);
  if (so === undefined) return { ...goi, donVi: goi.donVi.map((d) => ({ ...d, cau: null })) };
  if (!Number.isInteger(so) || so < 1) throw new BadRequestError('Số ngày/bài không hợp lệ');
  const d = goi.donVi.find((x) => x.so === so);
  if (!d) throw new NotFoundError('Không có ngày/bài này');
  return { ...goi, donVi: [d] };
}
