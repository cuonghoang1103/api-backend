/**
 * CT Language — THƯ VIỆN NGỮ PHÁP (15/11/2026): nạp nội dung từ repo + các truy vấn của tuyến.
 * Nội dung tĩnh `content/ctlanguage/ngu-phap/<nn>/*.json` (KHÔNG CSDL, không migration) — nạp một lần lúc gọi đầu;
 * tệp / điểm hỏng bị bỏ + ghi log (một điểm sai không được làm sập cả thư viện). Luật thuần: `nguPhapThuan.ts`.
 * "Đã học / đã lưu" nằm TRÊN MÁY app (KhoNguPhapMay) — máy chủ không giữ trạng thái người dùng.
 */
import fs from 'node:fs';
import path from 'node:path';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import {
  CAP_NGU_PHAP, NN_NGU_PHAP, TEN_CAP_NGU_PHAP, kiemDiem, timNguPhap, tomTatDiem,
  type DiemDaNap, type NnNguPhap, type TepNguPhap, type TomTatNguPhap,
} from './nguPhapThuan.js';

export const THU_MUC_NGU_PHAP = path.join(process.cwd(), 'content', 'ctlanguage', 'ngu-phap');

interface KhoNguPhap { ds: DiemDaNap[]; theoId: Map<string, DiemDaNap> }
let khoNp: KhoNguPhap | null = null;

/** Nạp mọi điểm hợp lệ, theo thứ tự cấp (dễ → khó) rồi tên tệp rồi thứ tự soạn. */
export function napNguPhap(thuMuc = THU_MUC_NGU_PHAP): KhoNguPhap {
  const tam: (DiemDaNap & { _f: string; _i: number })[] = [];
  for (const nn of NN_NGU_PHAP) {
    let tep: string[] = [];
    try { tep = fs.readdirSync(path.join(thuMuc, nn)).filter((f) => f.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })); } catch { /* chưa có thư mục */ }
    for (const f of tep) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(thuMuc, nn, f), 'utf8')) as TepNguPhap;
        if (t.nn !== nn || !CAP_NGU_PHAP[nn].includes(t.cap) || !Array.isArray(t.diem)) { logger.error('[ctl-ngu-phap] bỏ tệp sai khuôn', { tep: `${nn}/${f}` }); continue; }
        t.diem.forEach((d, i) => {
          const loi = kiemDiem(d, nn, t.cap);
          if (loi.length) { logger.error('[ctl-ngu-phap] bỏ điểm không hợp lệ', { tep: `${nn}/${f}`, id: d?.id, loi: loi.slice(0, 3) }); return; }
          tam.push({ ...d, nn, cap: t.cap, _f: f, _i: i });
        });
      } catch (e) {
        logger.error('[ctl-ngu-phap] không đọc được tệp', { tep: `${nn}/${f}`, error: e instanceof Error ? e.message : String(e) });
      }
    }
  }
  const thuTu = (d: DiemDaNap) => NN_NGU_PHAP.indexOf(d.nn) * 100 + CAP_NGU_PHAP[d.nn].indexOf(d.cap);
  tam.sort((a, b) => thuTu(a) - thuTu(b)); // sort ổn định ⇒ trong một cấp giữ thứ tự tệp + thứ tự soạn
  const theoId = new Map<string, DiemDaNap>();
  const ds: DiemDaNap[] = [];
  for (const { _f, _i, ...d } of tam) {
    if (theoId.has(d.id)) { logger.error('[ctl-ngu-phap] bỏ id trùng', { id: d.id, tep: _f }); continue; }
    // `soSanh` trỏ hụt (điểm kia bị bỏ) ⇒ lọc ở lúc trả, không bỏ cả điểm.
    theoId.set(d.id, d);
    ds.push(d);
  }
  return { ds, theoId };
}

function kho(): KhoNguPhap { return (khoNp ??= napNguPhap()); }
/** Test: thay kho. */
export function _datKhoNguPhap(k: KhoNguPhap | null) { khoNp = k; }

export function docNnNguPhap(v: unknown): NnNguPhap {
  const s = String(v ?? '');
  if (!(NN_NGU_PHAP as readonly string[]).includes(s)) throw new BadRequestError('nn phải là en, ja hoặc zh');
  return s as NnNguPhap;
}

/** Số điểm theo ngôn ngữ / cấp — tuyến không tham số (smoke-test deploy gọi). */
export function tongQuan() {
  const k = kho();
  return {
    tong: k.ds.length,
    ngonNgu: NN_NGU_PHAP.map((nn) => ({
      nn,
      tong: k.ds.filter((d) => d.nn === nn).length,
      cap: CAP_NGU_PHAP[nn].map((cap) => ({ cap, ten: TEN_CAP_NGU_PHAP[cap]?.ten ?? cap, soDiem: k.ds.filter((d) => d.nn === nn && d.cap === cap).length })),
    })),
  };
}

/** Danh mục một ngôn ngữ: cấp → nhóm → điểm (tóm tắt). Nhẹ (~100 byte/điểm) ⇒ app tải một lần, lọc + tìm trên máy. */
export function danhMuc(nnV: unknown) {
  const nn = docNnNguPhap(nnV);
  const cuaNn = kho().ds.filter((d) => d.nn === nn);
  return {
    nn,
    tong: cuaNn.length,
    cap: CAP_NGU_PHAP[nn].map((cap) => {
      const trong = cuaNn.filter((d) => d.cap === cap);
      const nhom: { ten: string; diem: TomTatNguPhap[] }[] = [];
      for (const d of trong) {
        let n = nhom.find((x) => x.ten === d.nhom);
        if (!n) { n = { ten: d.nhom, diem: [] }; nhom.push(n); }
        n.diem.push(tomTatDiem(d));
      }
      return { cap, ten: TEN_CAP_NGU_PHAP[cap]?.ten ?? cap, moTa: TEN_CAP_NGU_PHAP[cap]?.moTa ?? '', soDiem: trong.length, nhom };
    }).filter((c) => c.soDiem > 0),
  };
}

/** Chi tiết một điểm + tóm tắt các điểm "so sánh với" + điểm liền trước / sau trong cùng cấp. */
export function chiTiet(idV: unknown) {
  const k = kho();
  const d = k.theoId.get(String(idV ?? ''));
  if (!d) throw new NotFoundError('Không tìm thấy điểm ngữ pháp này.');
  const cungCap = k.ds.filter((x) => x.nn === d.nn && x.cap === d.cap);
  const i = cungCap.indexOf(d);
  // Điểm khác trỏ `soSanh` về đây cũng là "dễ nhầm" (liên kết hai chiều dù người soạn chỉ ghi một chiều).
  const nguoc = k.ds.filter((x) => x.id !== d.id && (x.soSanh ?? []).includes(d.id)).map((x) => x.id);
  const idSoSanh = [...new Set([...(d.soSanh ?? []), ...nguoc])];
  return {
    ...d,
    tenCap: TEN_CAP_NGU_PHAP[d.cap]?.ten ?? d.cap,
    soSanh: idSoSanh.map((id) => k.theoId.get(id)).filter((x): x is DiemDaNap => !!x).slice(0, 6).map(tomTatDiem),
    truoc: i > 0 ? tomTatDiem(cungCap[i - 1]!) : null,
    sau: i < cungCap.length - 1 ? tomTatDiem(cungCap[i + 1]!) : null,
  };
}

/** Tìm theo mẫu / nghĩa / từ khoá. `nn` bỏ trống ⇒ tìm cả ba ngôn ngữ. */
export function tim(qV: unknown, nnV: unknown, toiDaV?: unknown, chacV?: unknown) {
  const q = String(qV ?? '').trim().slice(0, 60);
  const nn = nnV === undefined || nnV === '' ? null : docNnNguPhap(nnV);
  if (!q) return { q, items: [] as TomTatNguPhap[] };
  const n = Number(toiDaV);
  const ds = nn ? kho().ds.filter((d) => d.nn === nn) : kho().ds;
  return { q, items: timNguPhap(ds, q, Number.isFinite(n) && n > 0 ? n : 20, chacV === '1' || chacV === 'true') };
}
