/**
 * CT Language — TỪ VỰNG THEO CHỦ ĐỀ: nạp nội dung tĩnh (15/11/2026).
 *
 * Trước 15/11 đây là 14 chủ đề × 12 từ soạn tay ngay trong mã. Nay nội dung nằm ở `content/ctlanguage/chu-de-tu/`
 * (danh mục chung `_chu-de.json` + `<nn>/<ma>.json`; khuôn + luật: `chuDeTuThuan.ts`, cách dựng: `_KHUON.md`).
 * Nạp MỘT lần; tệp hỏng bị bỏ + ghi log (một tệp sai không làm sập cả mục). Danh mục hỏng ⇒ không có chủ đề nào
 * (khối "Từ vựng theo chủ đề" của app tự ẩn — như máy chủ cũ chưa có tuyến).
 * Lúc phục vụ (`khamPha.ts › chuDe`), mỗi từ được gắn `id` mục từ điển THẬT (khớp chữ) để app mở trang từ / lưu sổ;
 * không khớp ⇒ id ÂM ổn định (`idAm`), app tự tra lại theo chữ như thẻ của bộ từ có sẵn.
 */
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../../utils/logger.js';
import { NN_CDT, kiemDanhMuc, kiemTep, type ChuDeDanhMuc, type DanhMucChuDe, type NnCdt, type TepChuDe } from './chuDeTuThuan.js';

export type NnChuDe = NnCdt;

export const THU_MUC_CDT = path.join(process.cwd(), 'content', 'ctlanguage', 'chu-de-tu');

export interface KhoChuDe {
  danhMuc: DanhMucChuDe;
  /** nn ⇒ mã ⇒ tệp. Chủ đề thiếu tệp ở một ngôn ngữ thì không hiện ở ngôn ngữ đó. */
  tep: Record<NnCdt, Map<string, TepChuDe>>;
}

export function napChuDeTu(thuMuc = THU_MUC_CDT): KhoChuDe {
  const rong: KhoChuDe = { danhMuc: { nhomLon: [], chuDe: [] }, tep: { en: new Map(), ja: new Map(), zh: new Map() } };
  let dm: DanhMucChuDe;
  try {
    dm = JSON.parse(fs.readFileSync(path.join(thuMuc, '_chu-de.json'), 'utf8')) as DanhMucChuDe;
    const loi = kiemDanhMuc(dm);
    if (loi.length) { logger.error('[ctl-chu-de] danh mục sai khuôn — tắt chủ đề', { loi: loi.slice(0, 5) }); return rong; }
  } catch (e) {
    logger.error('[ctl-chu-de] không đọc được danh mục', { error: e instanceof Error ? e.message : String(e) });
    return rong;
  }
  const kho: KhoChuDe = { danhMuc: dm, tep: { en: new Map(), ja: new Map(), zh: new Map() } };
  for (const nn of NN_CDT) {
    for (const c of dm.chuDe) {
      const f = path.join(thuMuc, nn, `${c.ma}.json`);
      if (!fs.existsSync(f)) continue;
      try {
        const t = JSON.parse(fs.readFileSync(f, 'utf8')) as TepChuDe;
        const loi = kiemTep(t, dm);
        if (t.nn !== nn) loi.push('nn khác thư mục');
        if (t.ma !== c.ma) loi.push('ma khác tên tệp');
        if (loi.length) { logger.error('[ctl-chu-de] bỏ tệp sai khuôn', { tep: `${nn}/${c.ma}.json`, loi: loi.slice(0, 3) }); continue; }
        kho.tep[nn].set(c.ma, t);
      } catch (e) {
        logger.error('[ctl-chu-de] không đọc được tệp', { tep: `${nn}/${c.ma}.json`, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }
  return kho;
}

let khoCdt: KhoChuDe | null = null;
export function khoChuDe(): KhoChuDe { return (khoCdt ??= napChuDeTu()); }
/** Test: thay kho (null ⇒ nạp lại từ đĩa ở lần gọi tới). */
export function _datKhoChuDe(k: KhoChuDe | null) { khoCdt = k; }

/** Các chủ đề CÓ tệp ở ngôn ngữ này, đúng thứ tự danh mục. */
export function chuDeCua(nn: NnCdt): { c: ChuDeDanhMuc; tep: TepChuDe }[] {
  const k = khoChuDe();
  return k.danhMuc.chuDe.flatMap((c) => { const tep = k.tep[nn].get(c.ma); return tep ? [{ c, tep }] : []; });
}

/** id ÂM ổn định cho từ không có trong từ điển (băm FNV-1a của "nn:chữ") — app tự tra lại theo chữ khi mở. */
export function idAm(nn: string, chu: string): number {
  let h = 0x811c9dc5;
  for (const c of `${nn}:${chu}`) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return -(100_000_000 + (h % 800_000_000));
}
