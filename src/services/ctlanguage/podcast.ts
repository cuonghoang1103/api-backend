/**
 * CT Language — PODCAST theo cấp (16/11/2026): nạp kịch bản tĩnh `content/ctlanguage/podcast/<nn>/<id>.json`
 * (khuôn + luật: `podcastThuan.ts`) một lần; tệp hỏng bị bỏ + ghi log (một tệp sai không làm sập cả mục).
 */
import fs from 'node:fs';
import path from 'node:path';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { CAP_PODCAST, DANH_MUC_PODCAST, MA_DANH_MUC, NN_PODCAST, danhMucCua, kiemTap, soSanhTap, tomTatTap, type NnPodcast, type TapPodcast } from './podcastThuan.js';
import { kiemNn } from './tuDien.js';

export const THU_MUC_PODCAST = path.join(process.cwd(), 'content', 'ctlanguage', 'podcast');

let khoTap: TapPodcast[] | null = null;

export function napPodcast(thuMuc = THU_MUC_PODCAST): TapPodcast[] {
  const ra: TapPodcast[] = [];
  for (const nn of NN_PODCAST) {
    let tep: string[] = [];
    try { tep = fs.readdirSync(path.join(thuMuc, nn)).filter((f) => f.endsWith('.json')).sort(); } catch { /* chưa có */ }
    for (const f of tep) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(thuMuc, nn, f), 'utf8')) as TapPodcast;
        const loi = kiemTap(t);
        if (t.nn !== nn) loi.push('nn khác thư mục');
        if (`${t.id}.json` !== f) loi.push('tên tệp khác id');
        if (loi.length) { logger.error('[ctl-podcast] bỏ tập sai khuôn', { tep: `${nn}/${f}`, loi: loi.slice(0, 3) }); continue; }
        ra.push(t);
      } catch (e) {
        logger.error('[ctl-podcast] không đọc được tệp', { tep: `${nn}/${f}`, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }
  return ra.sort(soSanhTap);
}

function kho(): TapPodcast[] { return (khoTap ??= napPodcast()); }
/** Test: thay kho. */
export function _datKhoPodcast(k: TapPodcast[] | null) { khoTap = k; }

/**
 * Danh sách tập (tóm tắt) gom theo cấp, trong MỘT danh mục (`danhMuc`, mặc định "doi-song") + bảng danh mục kèm số tập.
 * `nn` bỏ trống ⇒ cả ba ngôn ngữ (tuyến không tham số: smoke-test deploy gọi). App bản cũ (chưa biết danh mục) không
 * gửi `danhMuc` ⇒ nhận đúng "Đời sống" như trước.
 */
export function danhSachPodcast(nnV?: unknown, danhMucV?: unknown) {
  const nn = nnV === undefined || nnV === '' ? null : (kiemNn(String(nnV)) as NnPodcast);
  const dm = typeof danhMucV === 'string' && MA_DANH_MUC.includes(danhMucV) ? danhMucV : 'doi-song';
  const theoNn = kho().filter((t) => !nn || t.nn === nn);
  const ds = theoNn.filter((t) => danhMucCua(t) === dm);
  const cap = (nn ? [nn] : [...NN_PODCAST]).flatMap((n) => CAP_PODCAST[n].map((c) => ({
    nn: n, cap: c, tap: ds.filter((t) => t.nn === n && t.cap === c).map(tomTatTap),
  }))).filter((g) => g.tap.length);
  const danhMuc = DANH_MUC_PODCAST.map((d) => ({ ...d, soTap: theoNn.filter((t) => danhMucCua(t) === d.ma).length }))
    .filter((d) => d.soTap > 0 || d.ma === 'doi-song');
  return { tong: ds.length, tongTatCa: theoNn.length, danhMucDangXem: dm, danhMuc, cap };
}

export function chiTietTap(nnV: string, id: string): TapPodcast {
  const nn = kiemNn(nnV) as NnPodcast;
  const t = kho().find((x) => x.nn === nn && x.id === id);
  if (!t) throw new NotFoundError('Không tìm thấy tập podcast này');
  return t;
}
