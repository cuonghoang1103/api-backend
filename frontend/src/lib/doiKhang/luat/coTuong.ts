// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs
/**
 * CỜ TƯỚNG — luật đủ + bot alpha-beta.
 *
 * Bàn 9 cột × 10 hàng, chỉ số = hang*9 + cot. Cột 0–8 tính từ TRÁI phe Đỏ, hàng 0–9 tính từ phe Đỏ
 * (Đỏ ở hàng 0–4, Đen ở hàng 5–9, sông giữa hàng 4 và 5).
 * Ghế 0 = Đỏ (đi trước), ghế 1 = Đen.
 * Quân: K tướng · A sĩ · B tượng · N mã · R xe · C pháo · P tốt — hoa = Đỏ, thường = Đen.
 *
 * Kết thúc: hết nước (bị chiếu hết hoặc bí) = THUA. Lặp vị trí 3 lần = hoà (đơn giản hoá luật chiếu
 * dai/đuổi dai). 120 nửa nước liên tiếp không ăn quân = hoà ('hoa-50'). Cả hai bên không còn quân
 * qua được sông tấn công (xe/mã/pháo/tốt) = hoà ('thieu-quan').
 */
import type { CapDoBot, KetQua, LuatTro } from './kieu';
import { bayGio, laDoiTuong, laSoNguyen } from './chung';

export type QuanCoTuong = 'K' | 'A' | 'B' | 'N' | 'R' | 'C' | 'P' | 'k' | 'a' | 'b' | 'n' | 'r' | 'c' | 'p';
export type OCoTuong = [number, number]; // [cot, hang]
export interface NuocCoTuong {
  tu: OCoTuong;
  den: OCoTuong;
}
export interface TrangThaiCoTuong {
  /** 90 ô, chỉ số = hang*9 + cot. null = trống. */
  ban: (QuanCoTuong | null)[];
  /** 0 = Đỏ tới lượt, 1 = Đen. */
  luotGhe: 0 | 1;
  /** Số nửa nước liên tiếp không ăn quân. */
  nuaNuoc: number;
  /** Tổng số nửa nước đã đi. */
  soNuoc: number;
  /** Khoá vị trí từ lần ăn quân gần nhất — đếm lặp 3 lần. */
  lichSu: string[];
  nuocCuoi: NuocCoTuong | null;
}

const TG = 1, SI = 2, TU = 3, MA = 4, XE = 5, PH = 6, TO = 7;
const CHU = ['', 'k', 'a', 'b', 'n', 'r', 'c', 'p'];
const TEN = ['', 'Tướng', 'Sĩ', 'Tượng', 'Mã', 'Xe', 'Pháo', 'Tốt'];
const NUA_NUOC_HOA = 120;

interface Pos {
  b: Int8Array;
  do_: boolean; // Đỏ tới lượt
}

const W = 9, H = 10;
const ix = (c: number, r: number) => r * W + c;
const trongBan = (c: number, r: number) => c >= 0 && c < W && r >= 0 && r < H;
const trongCung = (c: number, r: number, laDo: boolean) => c >= 3 && c <= 5 && (laDo ? r >= 0 && r <= 2 : r >= 7 && r <= 9);
const benMinh = (r: number, laDo: boolean) => (laDo ? r <= 4 : r >= 5);
const quaSong = (r: number, laDo: boolean) => (laDo ? r >= 5 : r <= 4);

const THANG = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const CHEO = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
// [dc, dr, chân dc, chân dr]
const BUOC_MA = [[1, 2, 0, 1], [-1, 2, 0, 1], [1, -2, 0, -1], [-1, -2, 0, -1], [2, 1, 1, 0], [2, -1, 1, 0], [-2, 1, -1, 0], [-2, -1, -1, 0]];

const mv = (from: number, to: number) => from | (to << 7);
const tuOf = (m: number) => m & 127;
const denOf = (m: number) => m >> 7;

function sinhNuoc(p: Pos, chiAn: boolean): number[] {
  const out: number[] = [];
  const b = p.b;
  const s = p.do_ ? 1 : -1;
  const laDo = p.do_;
  const day = (from: number, c: number, r: number) => {
    const to = ix(c, r);
    const x = b[to] * s;
    if (x > 0) return;
    if (chiAn && x === 0) return;
    out.push(mv(from, to));
  };
  for (let sq = 0; sq < 90; sq++) {
    const v = b[sq];
    if (v * s <= 0) continue;
    const t = v * s;
    const c = sq % W, r = (sq - c) / W;
    switch (t) {
      case TG:
        for (const [dc, dr] of THANG) if (trongCung(c + dc, r + dr, laDo)) day(sq, c + dc, r + dr);
        break;
      case SI:
        for (const [dc, dr] of CHEO) if (trongCung(c + dc, r + dr, laDo)) day(sq, c + dc, r + dr);
        break;
      case TU:
        for (const [dc, dr] of CHEO) {
          const nc = c + 2 * dc, nr = r + 2 * dr;
          if (!trongBan(nc, nr) || !benMinh(nr, laDo)) continue;
          if (b[ix(c + dc, r + dr)] !== 0) continue; // cản mắt tượng
          day(sq, nc, nr);
        }
        break;
      case MA:
        for (const [dc, dr, lc, lr] of BUOC_MA) {
          const nc = c + dc, nr = r + dr;
          if (!trongBan(nc, nr)) continue;
          if (b[ix(c + lc, r + lr)] !== 0) continue; // cản chân mã
          day(sq, nc, nr);
        }
        break;
      case XE:
        for (const [dc, dr] of THANG) {
          let nc = c + dc, nr = r + dr;
          while (trongBan(nc, nr)) {
            const x = b[ix(nc, nr)] * s;
            if (x > 0) break;
            if (x < 0) { out.push(mv(sq, ix(nc, nr))); break; }
            if (!chiAn) out.push(mv(sq, ix(nc, nr)));
            nc += dc; nr += dr;
          }
        }
        break;
      case PH:
        for (const [dc, dr] of THANG) {
          let nc = c + dc, nr = r + dr;
          let ngoi = false;
          while (trongBan(nc, nr)) {
            const v2 = b[ix(nc, nr)];
            if (!ngoi) {
              if (v2 === 0) { if (!chiAn) out.push(mv(sq, ix(nc, nr))); }
              else ngoi = true;
            } else if (v2 !== 0) {
              if (v2 * s < 0) out.push(mv(sq, ix(nc, nr)));
              break;
            }
            nc += dc; nr += dr;
          }
        }
        break;
      case TO: {
        const tien = laDo ? 1 : -1;
        if (trongBan(c, r + tien)) day(sq, c, r + tien);
        if (quaSong(r, laDo)) {
          if (c > 0) day(sq, c - 1, r);
          if (c < 8) day(sq, c + 1, r);
        }
        break;
      }
    }
  }
  return out;
}

/** Ô (c,r) có bị bên `boiDo` tấn công không — gồm cả luật tướng đối mặt. */
function biTanCong(b: Int8Array, sq: number, boiDo: boolean): boolean {
  const s = boiDo ? 1 : -1;
  const c = sq % W, r = (sq - c) / W;
  for (const [dc, dr] of THANG) {
    let nc = c + dc, nr = r + dr;
    let thu = 0;
    while (trongBan(nc, nr)) {
      const v = b[ix(nc, nr)];
      if (v !== 0) {
        if (thu === 0) {
          if (v === s * XE) return true;
          if (v === s * TG && dc === 0) return true; // tướng đối mặt
          thu = 1;
        } else {
          if (v === s * PH) return true;
          break;
        }
      }
      nc += dc; nr += dr;
    }
  }
  for (const [dc, dr, lc, lr] of BUOC_MA) {
    const hc = c - dc, hr = r - dr;
    if (!trongBan(hc, hr) || b[ix(hc, hr)] !== s * MA) continue;
    if (b[ix(hc + lc, hr + lr)] === 0) return true;
  }
  const tien = boiDo ? 1 : -1;
  const pr = r - tien;
  if (trongBan(c, pr) && b[ix(c, pr)] === s * TO) return true;
  for (const dc of [-1, 1]) {
    const nc = c + dc;
    if (trongBan(nc, r) && b[ix(nc, r)] === s * TO && quaSong(r, boiDo)) return true;
  }
  return false;
}

function oTuong(b: Int8Array, s: number): number {
  for (let i = 0; i < 90; i++) if (b[i] === s * TG) return i;
  return -1;
}
function dangBiChieu(p: Pos): boolean {
  const k = oTuong(p.b, p.do_ ? 1 : -1);
  return k >= 0 && biTanCong(p.b, k, !p.do_);
}

function diNuoc(p: Pos, m: number): number {
  const from = tuOf(m), to = denOf(m);
  const cap = p.b[to];
  p.b[to] = p.b[from];
  p.b[from] = 0;
  p.do_ = !p.do_;
  return cap;
}
function hoanNuoc(p: Pos, m: number, cap: number): void {
  const from = tuOf(m), to = denOf(m);
  p.do_ = !p.do_;
  p.b[from] = p.b[to];
  p.b[to] = cap;
}
function hopLeSauKhiDi(p: Pos): boolean {
  // p đã đổi lượt: bên vừa đi = !p.do_
  const k = oTuong(p.b, p.do_ ? -1 : 1);
  return k >= 0 && !biTanCong(p.b, k, p.do_);
}
function nuocHopLe(p: Pos, chiAn = false): number[] {
  const res: number[] = [];
  for (const m of sinhNuoc(p, chiAn)) {
    const cap = diNuoc(p, m);
    if (hopLeSauKhiDi(p)) res.push(m);
    hoanNuoc(p, m, cap);
  }
  return res;
}

// ─── JSON ↔ nội bộ ───────────────────────────────────────────────────────────
function maQuan(ch: string | null): number {
  if (!ch) return 0;
  const i = CHU.indexOf(ch.toLowerCase());
  if (i <= 0) return 0;
  return ch === ch.toUpperCase() ? i : -i;
}
function chuQuan(v: number): QuanCoTuong | null {
  if (v === 0) return null;
  const c = CHU[Math.abs(v)];
  return (v > 0 ? c.toUpperCase() : c) as QuanCoTuong;
}
function sangPos(s: TrangThaiCoTuong): Pos {
  const b = new Int8Array(90);
  for (let i = 0; i < 90; i++) b[i] = maQuan(s.ban[i] ?? null);
  return { b, do_: s.luotGhe === 0 };
}
function khoa(p: Pos): string {
  let k = p.do_ ? 'r' : 'b';
  for (let i = 0; i < 90; i++) k += p.b[i] === 0 ? '.' : chuQuan(p.b[i]);
  return k;
}
function banTuPos(p: Pos): (QuanCoTuong | null)[] {
  const ban: (QuanCoTuong | null)[] = [];
  for (let i = 0; i < 90; i++) ban.push(chuQuan(p.b[i]));
  return ban;
}

function banDau(): Pos {
  const b = new Int8Array(90);
  const hang0 = [XE, MA, TU, SI, TG, SI, TU, MA, XE];
  for (let c = 0; c < 9; c++) {
    b[ix(c, 0)] = hang0[c];
    b[ix(c, 9)] = -hang0[c];
  }
  b[ix(1, 2)] = PH; b[ix(7, 2)] = PH;
  b[ix(1, 7)] = -PH; b[ix(7, 7)] = -PH;
  for (const c of [0, 2, 4, 6, 8]) {
    b[ix(c, 3)] = TO;
    b[ix(c, 6)] = -TO;
  }
  return { b, do_: true };
}

function thieuQuan(b: Int8Array): boolean {
  for (let i = 0; i < 90; i++) {
    const t = Math.abs(b[i]);
    if (t === XE || t === MA || t === PH || t === TO) return false;
  }
  return true;
}

function ketThucPos(p: Pos, s: TrangThaiCoTuong): KetQua | null {
  if (nuocHopLe(p).length === 0) {
    return { thang: [p.do_ ? 1 : 0], hoa: false, lyDo: dangBiChieu(p) ? 'chieu-het' : 'bi' };
  }
  if (s.lichSu.length >= 5) {
    const cuoi = s.lichSu[s.lichSu.length - 1];
    let dem = 0;
    for (const k of s.lichSu) if (k === cuoi) dem++;
    if (dem >= 3) return { thang: [], hoa: true, lyDo: 'lap-3' };
  }
  if (s.nuaNuoc >= NUA_NUOC_HOA) return { thang: [], hoa: true, lyDo: 'hoa-50' };
  if (thieuQuan(p.b)) return { thang: [], hoa: true, lyDo: 'thieu-quan' };
  return null;
}

// ─── Đánh giá + tìm kiếm ─────────────────────────────────────────────────────
const GIA = [0, 0, 200, 200, 400, 900, 450, 100];

function diemQuan(t: number, c: number, r: number, laDo: boolean): number {
  const tien = laDo ? r : 9 - r; // số hàng đã tiến
  const giua = 4 - Math.abs(c - 4);
  switch (t) {
    case TO:
      if (tien >= 5) return 200 + giua * 10 + (tien <= 8 ? (tien - 5) * 10 : 0);
      return 100;
    case MA:
      return 400 + giua * 6 + Math.min(tien, 6) * 6;
    case PH:
      return 450 + (c === 4 ? 15 : 0);
    case XE:
      return 900 + Math.min(tien, 6) * 4 + (c === 3 || c === 5 ? 6 : 0);
    default:
      return GIA[t];
  }
}

function danhGia(p: Pos): number {
  let d = 0;
  const b = p.b;
  for (let i = 0; i < 90; i++) {
    const v = b[i];
    if (v === 0) continue;
    const c = i % W, r = (i - c) / W;
    const x = diemQuan(Math.abs(v), c, r, v > 0);
    d += v > 0 ? x : -x;
  }
  return p.do_ ? d : -d;
}

const MATE = 100000;
const VO_CUC = 1e9;
interface PhienTim { p: Pos; het: number; nut: number; dung: boolean; choDung: boolean }

function sapXep(p: Pos, ms: number[]): number[] {
  const kem = ms.map((m) => {
    const v = Math.abs(p.b[denOf(m)]);
    return { m, d: v ? 10000 + GIA[v] * 10 - GIA[Math.abs(p.b[tuOf(m)])] / 10 + (v === TG ? 1e6 : 0) : 0 };
  });
  kem.sort((a, b) => b.d - a.d);
  return kem.map((x) => x.m);
}
function kiemGio(t: PhienTim): void {
  if (t.choDung && (++t.nut & 1023) === 0 && bayGio() > t.het) t.dung = true;
}
function tinhLang(t: PhienTim, alpha: number, beta: number, sauQ: number): number {
  kiemGio(t);
  if (t.dung) return 0;
  const p = t.p;
  const dung = danhGia(p);
  if (dung >= beta) return dung;
  if (dung > alpha) alpha = dung;
  if (sauQ <= 0) return alpha;
  for (const m of sapXep(p, sinhNuoc(p, true))) {
    const cap = diNuoc(p, m);
    if (!hopLeSauKhiDi(p)) { hoanNuoc(p, m, cap); continue; }
    const sc = -tinhLang(t, -beta, -alpha, sauQ - 1);
    hoanNuoc(p, m, cap);
    if (t.dung) return 0;
    if (sc >= beta) return sc;
    if (sc > alpha) alpha = sc;
  }
  return alpha;
}
function alphaBeta(t: PhienTim, sau: number, alpha: number, beta: number, ply: number): number {
  kiemGio(t);
  if (t.dung) return 0;
  if (sau <= 0) return tinhLang(t, alpha, beta, 6);
  const p = t.p;
  let soHopLe = 0;
  let tot = -VO_CUC;
  for (const m of sapXep(p, sinhNuoc(p, false))) {
    const cap = diNuoc(p, m);
    if (!hopLeSauKhiDi(p)) { hoanNuoc(p, m, cap); continue; }
    soHopLe++;
    const sc = -alphaBeta(t, sau - 1, -beta, -alpha, ply + 1);
    hoanNuoc(p, m, cap);
    if (t.dung) return 0;
    if (sc > tot) tot = sc;
    if (sc > alpha) alpha = sc;
    if (alpha >= beta) break;
  }
  if (soHopLe === 0) return -MATE + ply; // cờ tướng: bí cũng thua
  return tot;
}

function timNuocBot(p: Pos, capDo: CapDoBot, ngauNhien: () => number, lichSu: string[]): number {
  const goc = nuocHopLe(p);
  if (goc.length === 1) return goc[0];
  if (capDo === 1) {
    let tot = goc[0], diemTot = -VO_CUC;
    for (const m of goc) {
      const cap = diNuoc(p, m);
      let sc = -danhGia(p);
      if (nuocHopLe(p).length === 0) sc += MATE;
      hoanNuoc(p, m, cap);
      sc += ngauNhien() * 150;
      if (sc > diemTot) { diemTot = sc; tot = m; }
    }
    return tot;
  }
  const sauMax = capDo === 2 ? 3 : 5;
  const thoiGian = capDo === 2 ? 500 : 1200;
  const bienDo = capDo === 2 ? 20 : 0;
  const t: PhienTim = { p, het: bayGio() + thoiGian, nut: 0, dung: false, choDung: false };
  let thuTu = sapXep(p, goc);
  let ketQua: { m: number; d: number }[] = thuTu.map((m) => ({ m, d: 0 }));
  for (let sau = 1; sau <= sauMax; sau++) {
    t.choDung = sau > 1;
    const lan: { m: number; d: number }[] = [];
    let alpha = -VO_CUC;
    for (const m of thuTu) {
      const cap = diNuoc(p, m);
      let sc = -alphaBeta(t, sau - 1, -VO_CUC, -(alpha - bienDo - 1), 1);
      if (!t.dung && lichSu.length) {
        const k = khoa(p);
        let dem = 0;
        for (const x of lichSu) if (x === k) dem++;
        if (dem >= 2) sc = 0;
      }
      hoanNuoc(p, m, cap);
      if (t.dung) break;
      lan.push({ m, d: sc });
      if (sc > alpha) alpha = sc;
    }
    if (t.dung) break;
    lan.sort((a, b) => b.d - a.d);
    ketQua = lan;
    thuTu = lan.map((x) => x.m);
    if (lan[0].d > MATE - 1000) break;
  }
  const tot = ketQua[0].d;
  const ung = ketQua.filter((x) => x.d >= tot - bienDo);
  return ung[Math.floor(ngauNhien() * ung.length) % ung.length].m;
}

// ─── LuatTro ─────────────────────────────────────────────────────────────────
function docO(x: unknown): number {
  if (!Array.isArray(x) || x.length !== 2) return -1;
  const [c, r] = x;
  if (!laSoNguyen(c, 0, 8) || !laSoNguyen(r, 0, 9)) return -1;
  return ix(c, r);
}
const sangNuoc = (m: number): NuocCoTuong => {
  const a = tuOf(m), b = denOf(m);
  return { tu: [a % W, (a - (a % W)) / W], den: [b % W, (b - (b % W)) / W] };
};

/** Ký pháp Việt: "Pháo 2 bình 5", "Mã 8 tấn 7", "Xe trước tiến 1"… */
function kyPhap(p: Pos, m: number): string {
  const from = tuOf(m), to = denOf(m);
  const v = p.b[from];
  const t = Math.abs(v);
  const laDo = v > 0;
  const c = from % W, r = (from - c) / W;
  const c2 = to % W, r2 = (to - c2) / W;
  const so = (cot: number) => (laDo ? 9 - cot : cot + 1);
  // Cùng loại quân cùng cột ⇒ "trước"/"sau".
  const cungCot: number[] = [];
  for (let rr = 0; rr < H; rr++) if (p.b[ix(c, rr)] === v) cungCot.push(rr);
  let ten: string;
  if (cungCot.length >= 2 && t !== TG && t !== SI && t !== TU) {
    // sắp theo mức tiến về phía đối phương
    const thu = cungCot.sort((a, b) => (laDo ? b - a : a - b));
    const vt = thu.indexOf(r);
    ten = TEN[t] + ' ' + (vt === 0 ? 'trước' : vt === thu.length - 1 ? 'sau' : 'giữa');
  } else {
    ten = TEN[t] + ' ' + so(c);
  }
  const dr = r2 - r;
  if (dr === 0) return `${ten} bình ${so(c2)}`;
  const tien = laDo ? dr > 0 : dr < 0;
  const hd = tien ? 'tấn' : 'thoái';
  if (t === MA || t === TU || t === SI) return `${ten} ${hd} ${so(c2)}`;
  return `${ten} ${hd} ${Math.abs(dr)}`;
}

export const coTuong: LuatTro<TrangThaiCoTuong, NuocCoTuong> = {
  ma: 'co-tuong',
  soNguoi: { min: 2, max: 2 },

  khoiTao() {
    const p = banDau();
    return { ban: banTuPos(p), luotGhe: 0, nuaNuoc: 0, soNuoc: 0, lichSu: [khoa(p)], nuocCuoi: null };
  },

  luot(s) {
    return s.luotGhe;
  },

  kiemTra(s, ghe, m) {
    if (!laDoiTuong(m)) return 'Nước đi không hợp lệ';
    const from = docO(m.tu), to = docO(m.den);
    if (from < 0 || to < 0) return 'Ô không hợp lệ';
    if (coTuong.ketThuc(s)) return 'Ván đã kết thúc';
    if (ghe !== s.luotGhe) return 'Chưa tới lượt bạn';
    const p = sangPos(s);
    const v = p.b[from];
    if (v === 0 || (v > 0) !== p.do_) return 'Không có quân của bạn ở ô đó';
    const ma = mv(from, to);
    if (!sinhNuoc(p, false).includes(ma)) return 'Quân này không đi được như vậy';
    const cap = diNuoc(p, ma);
    const ok = hopLeSauKhiDi(p);
    hoanNuoc(p, ma, cap);
    if (!ok) return 'Nước này để tướng bị chiếu (hoặc hai tướng đối mặt)';
    return null;
  },

  apDung(s, _ghe, m) {
    const p = sangPos(s);
    const from = ix(m.tu[0], m.tu[1]), to = ix(m.den[0], m.den[1]);
    const cap = diNuoc(p, mv(from, to));
    const k = khoa(p);
    return {
      ban: banTuPos(p),
      luotGhe: p.do_ ? 0 : 1,
      nuaNuoc: cap !== 0 ? 0 : s.nuaNuoc + 1,
      soNuoc: s.soNuoc + 1,
      lichSu: cap !== 0 ? [k] : [...s.lichSu, k],
      nuocCuoi: { tu: [m.tu[0], m.tu[1]], den: [m.den[0], m.den[1]] },
    };
  },

  cacNuoc(s) {
    if (coTuong.ketThuc(s)) return [];
    return nuocHopLe(sangPos(s)).map(sangNuoc);
  },

  ketThuc(s) {
    return ketThucPos(sangPos(s), s);
  },

  nhinTu(s) {
    return { ...s, chieu: dangBiChieu(sangPos(s)) };
  },

  nuocBot(s, capDo, ngauNhien) {
    return sangNuoc(timNuocBot(sangPos(s), capDo, ngauNhien, s.lichSu));
  },

  moTa(s, m) {
    const p = sangPos(s);
    const from = ix(m.tu[0], m.tu[1]);
    if (p.b[from] === 0) return '?';
    return kyPhap(p, mv(from, ix(m.den[0], m.den[1])));
  },
};
