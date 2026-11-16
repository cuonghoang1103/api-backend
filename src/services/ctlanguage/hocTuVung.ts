/**
 * CT Language — MỤC HỌC TỪ VỰNG: lộ trình chia BÀI (10–15 từ) dễ → khó (16/11/2026).
 *
 * User: "Một mục học từ vựng riêng: ấn vào học, kiểm tra, luyện… mục tiêu mỗi ngày, đánh dấu, quản lý; học xong không bị
 * trùng; kho đủ để dùng và thi IELTS từ 0 tới 8.0, theo chủ đề, giao tiếp." Máy chủ chỉ PHỤC VỤ NỘI DUNG TĨNH (không lưu
 * trạng thái người dùng — "đã học / đã biết" nằm trên máy app, như thư viện ngữ pháp).
 *
 * Nguồn từ (không thêm tệp nội dung nào ở đây):
 *   · kho chủ đề `content/ctlanguage/chu-de-tu/` (`chuDeTu.ts`, có cấp từng từ);
 *   · bộ BỔ SUNG `content/ctlanguage/tu-vung/<nn>/*.json` (`tuVungThuan.ts` — IELTS B2–C1, HSK5–6…; có `cumTu`/`hoTu`/
 *     `ghiChu`). Thư mục trống / chưa có ⇒ lộ trình chỉ gồm kho chủ đề, không lỗi.
 * Hai cách xếp, CÙNG một luật "mỗi từ thuộc đúng MỘT bài" (khoá từ: en chữ thường · ja/zh nguyên chữ — app tính y hệt):
 *   · `theo=cap`     — cấp dễ → khó (en A1→C2 · ja N5→N1 · zh HSK1→6); trong cấp gom theo chủ đề; nhóm < 10 từ dồn vào
 *                      bài "Tổng hợp <cấp>". Từ có ở nhiều chủ đề / nhiều cấp ⇒ lấy cấp DỄ NHẤT, chủ đề ĐẦU TIÊN.
 *   · `theo=chu-de`  — mỗi chủ đề (đúng thứ tự danh mục) rồi các bộ bổ sung; trong chủ đề xếp dễ → khó.
 * Mỗi bài gợi ý MỘT điểm ngữ pháp cùng cấp có thật trong thư viện (`nguPhap.ts`), xoay vòng trong cấp.
 * Id bài ổn định: `<nn>-<cấp>-<mã chủ đề>-<n>` · `<nn>-<cấp>-tong-hop-<n>` · `<nn>-cd-<mã>-<n>` (bộ bổ sung: mã `bs-<mã>`).
 * Tiến độ bài trên app tính theo TỪ (danh sách khoá `k` gửi kèm lộ trình) ⇒ nội dung đổi không làm hỏng gì.
 */
import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { CAP_CUA, NHAN_LOAI, hienThi, urlAnh, type NnCdt } from './chuDeTuThuan.js';
import { chuDeCua, idAm } from './chuDeTu.js';
import { danhMuc as danhMucNguPhap } from './nguPhap.js';
import { kiemBoTu, type BoTuBoSung } from './tuVungThuan.js';

export const THU_MUC_BO_SUNG = path.join(process.cwd(), 'content', 'ctlanguage', 'tu-vung');
export const NN_HTV = ['en', 'ja', 'zh'] as const;

/** Từ nguồn (hợp hai khuôn). */
export interface TuNguonHtv {
  chu: string;
  doc?: string;
  nghia: string;
  loai?: string;
  cap?: string;
  capUoc?: boolean;
  viDu?: string;
  viDuDoc?: string;
  viDuNghia?: string;
  cumTu?: string[];
  hoTu?: string[];
  ghiChu?: string;
  anh?: string;
}

/** Một nhóm nguồn: một chủ đề hoặc một bộ bổ sung. */
export interface NhomNguonHtv {
  ma: string;
  ten: string;
  moTa: string;
  bieuTuong: string;
  anh: string | null;
  boSung: boolean;
  tu: TuNguonHtv[];
}

export interface DiemNguPhapGoiY { id: string; tieuDe: string; nghia: string; cap: string }

export interface TuTrongBai extends TuNguonHtv { k: string; cap: string; capUoc: boolean; nguon: string }

export interface BaiHtv {
  id: string;
  ten: string;
  moTa: string;
  cap: string;
  /** "A1" hoặc "A1–B1" (bài theo chủ đề trải nhiều cấp). */
  nhanCap: string;
  nhom: string;
  bieuTuong: string;
  anh: string | null;
  nguPhap: DiemNguPhapGoiY | null;
  tu: TuTrongBai[];
}

export interface NhomBaiHtv { ma: string; ten: string; moTa: string; bieuTuong: string; anh: string | null; bai: BaiHtv[] }

export interface LoTrinhHtv { nn: NnCdt; theo: 'cap' | 'chu-de'; nhom: NhomBaiHtv[] }

export interface KhoHtv { nn: NnCdt; theoCap: LoTrinhHtv; theoChuDe: LoTrinhHtv; bai: Map<string, { bai: BaiHtv; theo: 'cap' | 'chu-de'; ke: string | null; truoc: string | null }> }

/** Khoá so trùng / định danh từ — app tính đúng như vậy (en chữ thường, gộp khoảng trắng; ja/zh nguyên chữ). */
export function khoaTuHtv(nn: string, chu: string): string {
  const s = chu.normalize('NFC').trim().replace(/\s+/g, ' ');
  return nn === 'en' ? s.toLowerCase() : s;
}

/** Tên + mô tả từng cấp (en kèm band IELTS tương ứng — mốc tham khảo theo bảng quy đổi CEFR ↔ IELTS). */
export const TEN_CAP_HTV: Record<string, { ten: string; moTa: string; bieuTuong: string }> = {
  A1: { ten: 'A1 · Mới bắt đầu', moTa: 'Từ sống còn hằng ngày · IELTS ~2.0–3.0', bieuTuong: '1.circle.fill' },
  A2: { ten: 'A2 · Sơ cấp', moTa: 'Giao tiếp quen thuộc · IELTS ~3.5–4.0', bieuTuong: '2.circle.fill' },
  B1: { ten: 'B1 · Trung cấp', moTa: 'Tự xoay xở mọi tình huống · IELTS ~4.5–5.5', bieuTuong: '3.circle.fill' },
  B2: { ten: 'B2 · Trung cao cấp', moTa: 'Bàn luận, học thuật nhẹ · IELTS ~6.0–6.5', bieuTuong: '4.circle.fill' },
  C1: { ten: 'C1 · Nâng cao', moTa: 'Học thuật, viết luận · IELTS ~7.0–8.0', bieuTuong: '5.circle.fill' },
  C2: { ten: 'C2 · Thành thạo', moTa: 'Sắc thái tinh tế · IELTS 8.5+', bieuTuong: '6.circle.fill' },
  N5: { ten: 'N5 · Nhập môn', moTa: 'Từ cơ bản nhất của JLPT', bieuTuong: '5.circle.fill' },
  N4: { ten: 'N4 · Sơ cấp', moTa: 'Sinh hoạt hằng ngày', bieuTuong: '4.circle.fill' },
  N3: { ten: 'N3 · Trung cấp', moTa: 'Đọc hiểu đời sống, công việc', bieuTuong: '3.circle.fill' },
  N2: { ten: 'N2 · Trung cao cấp', moTa: 'Báo chí, công sở', bieuTuong: '2.circle.fill' },
  N1: { ten: 'N1 · Cao cấp', moTa: 'Văn viết, chuyên sâu', bieuTuong: '1.circle.fill' },
  HSK1: { ten: 'HSK 1 · Nhập môn', moTa: 'Câu chào, số, người, đồ vật quanh mình', bieuTuong: '1.circle.fill' },
  HSK2: { ten: 'HSK 2 · Sơ cấp', moTa: 'Sinh hoạt, mua bán, đi lại', bieuTuong: '2.circle.fill' },
  HSK3: { ten: 'HSK 3 · Trung cấp', moTa: 'Trường lớp, công việc, cảm xúc', bieuTuong: '3.circle.fill' },
  HSK4: { ten: 'HSK 4 · Trung cao cấp', moTa: 'Bàn luận đời sống, xã hội', bieuTuong: '4.circle.fill' },
  HSK5: { ten: 'HSK 5 · Cao cấp', moTa: 'Báo chí, văn viết, chủ đề trừu tượng', bieuTuong: '5.circle.fill' },
  HSK6: { ten: 'HSK 6 · Thành thạo', moTa: 'Thành ngữ, văn chính luận', bieuTuong: '6.circle.fill' },
};

export const BAI_TOI_THIEU = 10;
export const BAI_TOI_DA = 15;

/** Chia `n` từ thành các bài 10–15 từ, đều nhau. n < 10 ⇒ một bài (nhóm lẻ cuối cùng); 16–19 (không chia được 10–15)
 *  ⇒ hai bài 8–10 từ. Nhóm chủ đề 16–19 từ trong lộ trình theo cấp thì KHÔNG đi đường này: 12 từ thành bài, phần dư dồn
 *  vào "Tổng hợp". */
export function chiaDeu(n: number): number[] {
  if (n <= 0) return [];
  if (n <= BAI_TOI_DA) return [n];
  if (n < 2 * BAI_TOI_THIEU) return [Math.ceil(n / 2), Math.floor(n / 2)];
  let k = Math.ceil(n / (BAI_TOI_DA - 1));
  while (k > 1 && Math.floor(n / k) < BAI_TOI_THIEU) k--;
  const goc = Math.floor(n / k), du = n % k;
  return Array.from({ length: k }, (_, i) => goc + (i < du ? 1 : 0));
}

function cat<T>(ds: readonly T[], co: number[]): T[][] {
  const ra: T[][] = [];
  let i = 0;
  for (const c of co) { ra.push(ds.slice(i, i + c)); i += c; }
  return ra;
}

/** Cấp mặc định của từ không ghi cấp: cấp giữa (en B1 · ja N3 · zh HSK3), đánh dấu ước lượng. */
const capGiua = (nn: NnCdt) => CAP_CUA[nn][2]!;

/**
 * Dựng hai lộ trình từ các nhóm nguồn (đúng thứ tự) + điểm ngữ pháp của ngôn ngữ (đúng thứ tự thư viện). THUẦN — test gọi.
 */
export function dungKhoHtv(nn: NnCdt, nguon: readonly NhomNguonHtv[], nguPhap: readonly DiemNguPhapGoiY[]): KhoHtv {
  const caps = CAP_CUA[nn];
  const capIdx = (c: string | undefined) => { const i = c ? caps.indexOf(c) : -1; return i >= 0 ? i : -1; };

  // 1) Mỗi từ thuộc đúng một nơi: cấp dễ nhất; cùng cấp ⇒ nhóm nguồn đầu tiên.
  type Chon = { tu: TuTrongBai; ni: number; ci: number; vi: number };
  const chon = new Map<string, Chon>();
  nguon.forEach((g, ni) => g.tu.forEach((t, vi) => {
    if (!t?.chu?.trim() || !t.nghia?.trim()) return;
    const k = khoaTuHtv(nn, t.chu);
    let ci = capIdx(t.cap);
    const uoc = ci < 0 || !!t.capUoc;
    if (ci < 0) ci = caps.indexOf(capGiua(nn));
    const co = chon.get(k);
    if (co && co.ci <= ci) return;
    chon.set(k, { tu: { ...t, k, cap: caps[ci]!, capUoc: uoc, nguon: g.ma }, ni, ci, vi });
  }));
  const tatCa = [...chon.values()].sort((a, b) => a.ni - b.ni || a.vi - b.vi);

  // 2) Điểm ngữ pháp theo cấp (cấp không có ⇒ cấp gần nhất phía dưới, rồi phía trên); xoay vòng.
  const npTheoCap = caps.map((c) => nguPhap.filter((d) => d.cap === c));
  const demNp = new Map<string, number>();
  const goiNp = (theo: string, ci: number): DiemNguPhapGoiY | null => {
    let j = ci;
    while (j >= 0 && !npTheoCap[j]!.length) j--;
    if (j < 0) { j = ci; while (j < caps.length && !npTheoCap[j]!.length) j++; }
    const ds = npTheoCap[j];
    if (!ds?.length) return null;
    const khoa = `${theo}:${j}`;
    const n = demNp.get(khoa) ?? 0;
    demNp.set(khoa, n + 1);
    return ds[n % ds.length]!;
  };

  const nhanCap = (tu: TuTrongBai[]) => {
    const is = tu.map((t) => caps.indexOf(t.cap));
    const lo = Math.min(...is), hi = Math.max(...is);
    return lo === hi ? caps[lo]! : `${caps[lo]}–${caps[hi]}`;
  };

  // 3) Theo cấp.
  const theoCap: NhomBaiHtv[] = [];
  caps.forEach((cap, ci) => {
    const trong = tatCa.filter((c) => c.ci === ci);
    if (!trong.length) return;
    const bai: BaiHtv[] = [];
    const caLe: Chon[] = [];
    const theoNhom = new Map<number, Chon[]>();
    for (const c of trong) theoNhom.set(c.ni, [...(theoNhom.get(c.ni) ?? []), c]);
    for (const [ni, ds] of [...theoNhom.entries()].sort((a, b) => a[0] - b[0])) {
      if (ds.length < BAI_TOI_THIEU) { caLe.push(...ds); continue; }
      let giu = ds;
      if (ds.length > BAI_TOI_DA && ds.length < 2 * BAI_TOI_THIEU) { giu = ds.slice(0, 12); caLe.push(...ds.slice(12)); }
      const g = nguon[ni]!;
      const phan = cat(giu, chiaDeu(giu.length));
      phan.forEach((p, i) => bai.push({
        id: `${nn}-${cap.toLowerCase()}-${g.ma}-${i + 1}`,
        ten: phan.length > 1 ? `${g.ten} · ${i + 1}` : g.ten,
        moTa: g.moTa, cap, nhanCap: cap, nhom: g.ma, bieuTuong: g.bieuTuong, anh: g.anh,
        nguPhap: null, tu: p.map((c) => c.tu),
      }));
    }
    const phanLe = cat(caLe, chiaDeu(caLe.length));
    phanLe.forEach((p, i) => {
      const ten = [...new Set(p.map((c) => nguon[c.ni]!.ten))];
      bai.push({
        id: `${nn}-${cap.toLowerCase()}-tong-hop-${i + 1}`,
        ten: `Tổng hợp ${cap}${phanLe.length > 1 ? ` · ${i + 1}` : ''}`,
        moTa: ten.slice(0, 4).join(' · ') + (ten.length > 4 ? ' …' : ''),
        cap, nhanCap: cap, nhom: 'tong-hop', bieuTuong: 'square.stack.3d.up.fill', anh: null, nguPhap: null, tu: p.map((c) => c.tu),
      });
    });
    for (const b of bai) b.nguPhap = goiNp('cap', ci);
    const t = TEN_CAP_HTV[cap];
    theoCap.push({ ma: cap, ten: t?.ten ?? cap, moTa: t?.moTa ?? '', bieuTuong: t?.bieuTuong ?? 'circle.fill', anh: null, bai });
  });

  // 4) Theo chủ đề: mỗi nhóm nguồn giữ những từ thuộc về nó, xếp dễ → khó.
  const theoChuDe: NhomBaiHtv[] = [];
  nguon.forEach((g, ni) => {
    const ds = tatCa.filter((c) => c.ni === ni).sort((a, b) => a.ci - b.ci || a.vi - b.vi);
    if (!ds.length) return;
    const phan = cat(ds, chiaDeu(ds.length));
    const bai: BaiHtv[] = phan.map((p, i) => {
      const tu = p.map((c) => c.tu);
      return {
        id: `${nn}-cd-${g.ma}-${i + 1}`,
        ten: phan.length > 1 ? `${g.ten} · ${i + 1}` : g.ten,
        moTa: g.moTa, cap: tu[0]!.cap, nhanCap: nhanCap(tu), nhom: g.ma, bieuTuong: g.bieuTuong, anh: g.anh,
        nguPhap: goiNp('chu-de', Math.min(...p.map((c) => c.ci))), tu,
      };
    });
    theoChuDe.push({ ma: g.ma, ten: g.ten, moTa: g.moTa, bieuTuong: g.bieuTuong, anh: g.anh, bai });
  });

  const bai = new Map<string, { bai: BaiHtv; theo: 'cap' | 'chu-de'; ke: string | null; truoc: string | null }>();
  for (const [theo, nhom] of [['cap', theoCap], ['chu-de', theoChuDe]] as const) {
    const phang = nhom.flatMap((n) => n.bai);
    phang.forEach((b, i) => bai.set(b.id, { bai: b, theo, ke: phang[i + 1]?.id ?? null, truoc: phang[i - 1]?.id ?? null }));
  }
  return { nn, theoCap: { nn, theo: 'cap', nhom: theoCap }, theoChuDe: { nn, theo: 'chu-de', nhom: theoChuDe }, bai };
}

// ─── Nạp nguồn (đĩa) ──────────────────────────────────────────────────────────────────────────────────────────────

export function napBoSung(nn: NnCdt, thuMuc = THU_MUC_BO_SUNG): BoTuBoSung[] {
  let tep: string[] = [];
  try { tep = fs.readdirSync(path.join(thuMuc, nn)).filter((f) => f.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })); } catch { return []; }
  const ra: BoTuBoSung[] = [];
  for (const f of tep) {
    try {
      const b = JSON.parse(fs.readFileSync(path.join(thuMuc, nn, f), 'utf8')) as BoTuBoSung;
      const loi = kiemBoTu(b);
      if (b?.nn !== nn) loi.push('nn khác thư mục');
      if (loi.length) { logger.error('[ctl-hoc-tu-vung] bỏ bộ bổ sung sai khuôn', { tep: `${nn}/${f}`, loi: loi.slice(0, 3) }); continue; }
      ra.push(b);
    } catch (e) {
      logger.error('[ctl-hoc-tu-vung] không đọc được bộ bổ sung', { tep: `${nn}/${f}`, error: e instanceof Error ? e.message : String(e) });
    }
  }
  // Dễ → khó theo cấp chủ đạo, rồi tên tệp.
  return ra.sort((a, b) => CAP_CUA[nn].indexOf(a.cap) - CAP_CUA[nn].indexOf(b.cap));
}

const BIEU_TUONG_BO: Record<string, string> = { ielts: 'graduationcap.fill', 'giao-tiep': 'bubble.left.and.bubble.right.fill', hsk: 'character.book.closed.fill', jlpt: 'character.book.closed.fill' };

export function nguonCua(nn: NnCdt, thuMucBoSung = THU_MUC_BO_SUNG): NhomNguonHtv[] {
  const chuDe: NhomNguonHtv[] = chuDeCua(nn).map(({ c, tep }) => {
    const h = hienThi(c, nn);
    return { ma: c.ma, ten: h.ten, moTa: h.moTa, bieuTuong: c.bieuTuong, anh: h.anh, boSung: false, tu: tep.tu };
  });
  const boSung: NhomNguonHtv[] = napBoSung(nn, thuMucBoSung).map((b) => ({
    ma: `bs-${b.ma}`, ten: b.ten, moTa: b.moTa, bieuTuong: BIEU_TUONG_BO[b.nhom] ?? 'books.vertical.fill', anh: null, boSung: true, tu: b.tu,
  }));
  return [...chuDe, ...boSung];
}

function nguPhapCua(nn: NnCdt): DiemNguPhapGoiY[] {
  try {
    return danhMucNguPhap(nn).cap.flatMap((c) => c.nhom.flatMap((n) => n.diem.map((d) => ({ id: d.id, tieuDe: d.tieuDe, nghia: d.nghia, cap: c.cap }))));
  } catch (e) {
    logger.warn('[ctl-hoc-tu-vung] không đọc được thư viện ngữ pháp', { nn, error: e instanceof Error ? e.message : String(e) });
    return [];
  }
}

const KHO = new Map<NnCdt, KhoHtv>();
const _ten = new Map<NnCdt, [string, string][]>();
const DEM = new Map<string, { luc: number; v: unknown }>();
export function khoHtv(nn: NnCdt): KhoHtv {
  let k = KHO.get(nn);
  if (!k) { k = dungKhoHtv(nn, nguonCua(nn), nguPhapCua(nn)); KHO.set(nn, k); }
  return k;
}
/** Test: xoá kho đã dựng (lần gọi tới dựng lại từ đĩa) hoặc đặt sẵn một kho. */
export function _datKhoHtv(nn?: NnCdt, k?: KhoHtv) {
  DEM.clear(); _ten.clear();
  if (!nn) { KHO.clear(); return; }
  if (k) KHO.set(nn, k); else KHO.delete(nn);
}

export function docNnHtv(v: unknown): NnCdt {
  const s = String(v ?? '');
  if (!(NN_HTV as readonly string[]).includes(s)) throw new BadRequestError('nn phải là en, ja hoặc zh', 'CTL_NN_SAI');
  return s as NnCdt;
}

// ─── Phục vụ ──────────────────────────────────────────────────────────────────────────────────────────────────────

function tomTatBai(b: BaiHtv) {
  return {
    id: b.id, ten: b.ten, moTa: b.moTa, cap: b.cap, nhanCap: b.nhanCap, nhom: b.nhom, bieuTuong: b.bieuTuong,
    anhUrl: urlAnh(b.anh), soTu: b.tu.length, mau: b.tu.slice(0, 3).map((t) => t.chu), k: b.tu.map((t) => t.k), nguPhap: b.nguPhap,
  };
}

/** Tổng quan cả ba ngôn ngữ (tuyến không tham số — smoke-test deploy gọi). */
export function tongQuanHtv() {
  return {
    ngonNgu: NN_HTV.map((nn) => {
      const k = khoHtv(nn);
      return {
        nn,
        tongTu: k.theoCap.nhom.reduce((s, n) => s + n.bai.reduce((x, b) => x + b.tu.length, 0), 0),
        soBai: k.theoCap.nhom.reduce((s, n) => s + n.bai.length, 0),
        cap: k.theoCap.nhom.map((n) => ({ ma: n.ma, soTu: n.bai.reduce((x, b) => x + b.tu.length, 0), soBai: n.bai.length })),
      };
    }),
  };
}

/** Lộ trình một ngôn ngữ (`theo=cap` mặc định | `chu-de`). */
export function loTrinhHtv(nnV: unknown, theoV: unknown) {
  const nn = docNnHtv(nnV);
  const theo = theoV === 'chu-de' ? 'chu-de' : 'cap';
  const lt = theo === 'cap' ? khoHtv(nn).theoCap : khoHtv(nn).theoChuDe;
  const nhom = lt.nhom.map((n) => ({
    ma: n.ma, ten: n.ten, moTa: n.moTa, bieuTuong: n.bieuTuong, anhUrl: urlAnh(n.anh),
    soTu: n.bai.reduce((s, b) => s + b.tu.length, 0), soBai: n.bai.length, bai: n.bai.map(tomTatBai),
  }));
  return {
    nn, theo,
    tongTu: nhom.reduce((s, n) => s + n.soTu, 0),
    soBai: nhom.reduce((s, n) => s + n.soBai, 0),
    nhom,
  };
}

/** IPA lấy từ từ điển có khi mang ngoặc 『…』 + khoảng trắng thừa ("/ 『wɒts jɔːr neɪm』 /") ⇒ gọn lại "/wɒts jɔːr neɪm/". */
export function lamSachDoc(d: string | null): string | null {
  if (!d) return null;
  const s = d.replace(/[『』「」]/g, '').replace(/\s+/g, ' ').replace(/\/\s+/g, '/').replace(/\s+\//g, '/').trim();
  return s || null;
}

/** Một bài: từ đủ trường + id mục từ điển (khớp chữ) hoặc id âm ổn định; bài kế / trước trong cùng lộ trình. */
export async function baiHtv(nnV: unknown, idV: unknown) {
  const nn = docNnHtv(nnV);
  const id = String(idV ?? '').slice(0, 120);
  const muc = khoHtv(nn).bai.get(id);
  if (!muc) throw new NotFoundError('Không có bài từ vựng này.');
  const k = `${nn}:${id}`, dem = DEM.get(k);
  if (dem && Date.now() - dem.luc < 6 * 3600_000) return dem.v;
  const { bai: b } = muc;
  let theoChu = new Map<string, { id: number; doc: string | null; hanViet: string | null }>();
  try {
    const ds = await prisma.ctlTu.findMany({
      where: { nn, chu: { in: b.tu.map((t) => t.chu) } }, orderBy: { uuTien: 'desc' },
      select: { id: true, chu: true, doc: true, hanViet: true },
    });
    for (const m of ds) if (!theoChu.has(m.chu)) theoChu.set(m.chu, m);
  } catch (e) {
    // CSDL hỏng ⇒ vẫn phục vụ bài (id âm), không nhớ đệm kết quả thiếu.
    logger.warn('[ctl-hoc-tu-vung] không gắn được id từ điển', { id, error: e instanceof Error ? e.message : String(e) });
    theoChu = new Map();
  }
  const ten = new Map(nguonTen(nn));
  const v = {
    ...tomTatBai(b),
    theo: muc.theo, ke: muc.ke, truoc: muc.truoc,
    tu: b.tu.map((t) => {
      const m = theoChu.get(t.chu);
      return {
        k: t.k,
        id: m?.id ?? idAm(nn, t.chu), coTrongTuDien: !!m,
        chu: t.chu,
        doc: lamSachDoc(t.doc || m?.doc || null),
        hanViet: m?.hanViet ?? null,
        nghia: t.nghia,
        loai: t.loai ?? null, nhanLoai: t.loai ? (NHAN_LOAI as Record<string, string>)[t.loai] ?? null : null,
        cap: t.cap, capUoc: t.capUoc,
        viDu: t.viDu || null, viDuDoc: t.viDuDoc || null, viDuNghia: t.viDuNghia || null,
        cumTu: t.cumTu?.length ? t.cumTu : null, hoTu: t.hoTu?.length ? t.hoTu : null, ghiChu: t.ghiChu || null,
        anhUrl: urlAnh(t.anh), chuDe: ten.get(t.nguon) ?? null,
      };
    }),
  };
  if (theoChu.size || !b.tu.length) DEM.set(k, { luc: Date.now(), v });
  return v;
}

function nguonTen(nn: NnCdt): [string, string][] {
  let t = _ten.get(nn);
  if (!t) {
    t = khoHtv(nn).theoChuDe.nhom.map((n) => [n.ma, n.ten] as [string, string]);
    _ten.set(nn, t);
  }
  return t;
}
