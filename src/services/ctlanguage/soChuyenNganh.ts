/**
 * CT Language — SỔ TAY CHUYÊN NGÀNH (15/11/2026): nạp bộ từ tĩnh + gắn mục từ điển lúc phục vụ.
 * Nội dung `content/ctlanguage/so-chuyen-nganh/<nn>/<ma>.json` (khuôn + luật: `soChuyenNganhThuan.ts`) — nạp một lần;
 * tệp hỏng bị bỏ + ghi log (một tệp sai không làm sập cả mục). Chi tiết bộ gắn `id` mục `ctl_tu` THẬT theo chữ (id từ
 * điển đổi mỗi lần nhập lại nên tệp không ghi id); không khớp ⇒ id ÂM ổn định `idAm` (như chủ đề từ vựng), app tự tra
 * lại theo chữ. Kết quả gắn id nhớ 6 giờ.
 */
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { idAm } from './chuDeTu.js';
import { NN_SCN, kiemBo, tomTatBo, type BoChuyenNganh, type NnScn } from './soChuyenNganhThuan.js';
import { kiemNn } from './tuDien.js';

export const THU_MUC_SCN = path.join(process.cwd(), 'content', 'ctlanguage', 'so-chuyen-nganh');

let khoScn: BoChuyenNganh[] | null = null;

export function napSoChuyenNganh(thuMuc = THU_MUC_SCN): BoChuyenNganh[] {
  const ra: BoChuyenNganh[] = [];
  for (const nn of NN_SCN) {
    let tep: string[] = [];
    try { tep = fs.readdirSync(path.join(thuMuc, nn)).filter((f) => f.endsWith('.json')).sort(); } catch { /* chưa có */ }
    for (const f of tep) {
      try {
        const b = JSON.parse(fs.readFileSync(path.join(thuMuc, nn, f), 'utf8')) as BoChuyenNganh;
        const loi = kiemBo(b);
        if (b.nn !== nn) loi.push('nn khác thư mục');
        if (loi.length) { logger.error('[ctl-scn] bỏ bộ sai khuôn', { tep: `${nn}/${f}`, loi: loi.slice(0, 3) }); continue; }
        ra.push(b);
      } catch (e) {
        logger.error('[ctl-scn] không đọc được tệp', { tep: `${nn}/${f}`, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }
  return ra.sort((a, b) => NN_SCN.indexOf(a.nn) - NN_SCN.indexOf(b.nn) || a.thuTu - b.thuTu || a.ma.localeCompare(b.ma));
}

function kho(): BoChuyenNganh[] { return (khoScn ??= napSoChuyenNganh()); }
/** Test: thay kho. */
export function _datKhoScn(k: BoChuyenNganh[] | null) { khoScn = k; DEM.clear(); }

/** Danh sách bộ — `nn` bỏ trống ⇒ cả ba ngôn ngữ (tuyến không tham số: smoke-test deploy gọi). */
export function danhSach(nnV?: unknown) {
  const nn = nnV === undefined || nnV === '' ? null : (kiemNn(String(nnV)) as NnScn);
  const ds = kho().filter((b) => !nn || b.nn === nn);
  return {
    tong: ds.length,
    soTu: ds.reduce((s, b) => s + b.tu.length, 0),
    bo: ds.map(tomTatBo),
  };
}

const DEM = new Map<string, { luc: number; v: unknown }>();

/** Chi tiết một bộ, mỗi từ gắn id mục từ điển (khớp chữ) hoặc id âm ổn định. */
export async function chiTietBo(nnV: string, ma: string) {
  const nn = kiemNn(nnV) as NnScn;
  const b = kho().find((x) => x.nn === nn && x.ma === ma);
  if (!b) throw new NotFoundError('Không có bộ từ này.');
  const k = `${nn}:${ma}`, dem = DEM.get(k);
  if (dem && Date.now() - dem.luc < 6 * 3600_000) return dem.v;
  let theoChu = new Map<string, { id: number; doc: string | null; hanViet: string | null }>();
  try {
    const muc = await prisma.ctlTu.findMany({
      where: { nn, chu: { in: b.tu.map((t) => t.chu) } }, orderBy: { uuTien: 'desc' },
      select: { id: true, chu: true, doc: true, hanViet: true },
    });
    for (const m of muc) if (!theoChu.has(m.chu)) theoChu.set(m.chu, m);
  } catch (e) {
    // CSDL hỏng ⇒ vẫn phục vụ bộ (id âm), không làm chết màn — không nhớ đệm kết quả thiếu.
    logger.warn('[ctl-scn] không gắn được id từ điển', { error: e instanceof Error ? e.message : String(e) });
    theoChu = new Map();
  }
  const v = {
    ...tomTatBo(b),
    tu: b.tu.map((t) => {
      const m = theoChu.get(t.chu);
      return {
        id: m?.id ?? idAm(nn, t.chu),
        coTrongTuDien: !!m,
        chu: t.chu,
        // Cách đọc soạn tay (ja/zh đã đối chiếu từ điển) thắng; thiếu (en cụm từ) ⇒ IPA của từ điển.
        doc: t.doc || m?.doc || null,
        hanViet: t.hanViet ?? m?.hanViet ?? null,
        nghiaVi: t.nghia,
        nhom: t.nhom ?? null,
        viDu: t.viDu ?? null,
        viDuDoc: t.viDuDoc ?? null,
        viDuNghia: t.viDuNghia ?? null,
      };
    }),
  };
  if (theoChu.size || !b.tu.length) DEM.set(k, { luc: Date.now(), v });
  return v;
}
