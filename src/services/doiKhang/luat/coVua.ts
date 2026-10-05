/**
 * CỜ VUA — luật đủ + bot alpha-beta. Tự viết, không thư viện.
 *
 * Ghế 0 = Trắng (đi trước), ghế 1 = Đen.
 * Bàn: mảng 64 ô, chỉ số = hang*8 + cot; hang 0 = hàng "1" (phía Trắng), cot 0 = cột "a".
 * Quân: chữ FEN — hoa = Trắng (P N B R Q K), thường = Đen.
 */
import type { CapDoBot, KetQua, LuatTro } from './kieu.js';
import { bayGio, laDoiTuong } from './chung.js';

export type QuanCoVua = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K' | 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PhongCap = 'q' | 'r' | 'b' | 'n';
export interface NuocCoVua {
  tu: string;
  den: string;
  phong?: PhongCap;
}
export interface TrangThaiCoVua {
  /** 64 ô, chỉ số = hang*8 + cot (hang 0 = hàng 1, cot 0 = cột a). null = ô trống. */
  ban: (QuanCoVua | null)[];
  luotMau: 'w' | 'b';
  /** Quyền nhập thành còn lại, tập con của "KQkq" theo thứ tự đó ('' = hết). */
  nhapThanh: string;
  /** Ô bắt tốt qua đường (vd 'e3') hoặc null. */
  enPassant: string | null;
  /** Số nửa nước từ lần ăn quân / đi tốt gần nhất (luật 50 nước khi ≥ 100). */
  nuaNuoc: number;
  /** Số nước đầy đủ theo FEN (bắt đầu 1, tăng sau nước của Đen). */
  soNuoc: number;
  /** Khoá vị trí từ nước không đảo ngược được gần nhất — dùng đếm lặp 3 lần. */
  lichSu: string[];
  nuocCuoi: { tu: string; den: string } | null;
}

// ─── Biểu diễn nội bộ ────────────────────────────────────────────────────────
const P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
const CHU = ['', 'p', 'n', 'b', 'r', 'q', 'k'];

interface Pos {
  b: Int8Array;
  w: boolean;
  cs: number; // 1=K 2=Q 4=k 8=q
  ep: number;
  half: number;
  full: number;
}
interface Undo {
  cap: number;
  cs: number;
  ep: number;
  half: number;
  full: number;
  quan: number;
}

const COT = 'abcdefgh';
function tenO(sq: number): string {
  return COT[sq & 7] + String((sq >> 3) + 1);
}
function oTuTen(t: string): number {
  if (typeof t !== 'string' || !/^[a-h][1-8]$/.test(t)) return -1;
  return (t.charCodeAt(1) - 49) * 8 + (t.charCodeAt(0) - 97);
}

function taoBuocNhay(off: number[][]): number[][] {
  const out: number[][] = [];
  for (let sq = 0; sq < 64; sq++) {
    const r = sq >> 3, c = sq & 7;
    const ds: number[] = [];
    for (const [dc, dr] of off) {
      const nc = c + dc, nr = r + dr;
      if (nc >= 0 && nc < 8 && nr >= 0 && nr < 8) ds.push(nr * 8 + nc);
    }
    out.push(ds);
  }
  return out;
}
function taoTia(dirs: number[][]): number[][][] {
  const out: number[][][] = [];
  for (let sq = 0; sq < 64; sq++) {
    const r = sq >> 3, c = sq & 7;
    const tia: number[][] = [];
    for (const [dc, dr] of dirs) {
      const ray: number[] = [];
      let nc = c + dc, nr = r + dr;
      while (nc >= 0 && nc < 8 && nr >= 0 && nr < 8) {
        ray.push(nr * 8 + nc);
        nc += dc;
        nr += dr;
      }
      tia.push(ray);
    }
    out.push(tia);
  }
  return out;
}
const MA = taoBuocNhay([[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]]);
const VUA = taoBuocNhay([[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]);
const TIA_XE = taoTia([[1, 0], [-1, 0], [0, 1], [0, -1]]);
const TIA_TUONG = taoTia([[1, 1], [1, -1], [-1, 1], [-1, -1]]);

// Mặt nạ quyền nhập thành: đi khỏi / bị ăn ở ô này thì mất quyền tương ứng.
const MAT_NA_NT = new Array<number>(64).fill(15);
MAT_NA_NT[0] = 15 & ~2;
MAT_NA_NT[7] = 15 & ~1;
MAT_NA_NT[4] = 15 & ~3;
MAT_NA_NT[56] = 15 & ~8;
MAT_NA_NT[63] = 15 & ~4;
MAT_NA_NT[60] = 15 & ~12;

const F_EP = 1, F_NT = 2, F_DOI = 4;
function mv(from: number, to: number, promo = 0, flag = 0): number {
  return from | (to << 6) | (promo << 12) | (flag << 15);
}
const tuOf = (m: number) => m & 63;
const denOf = (m: number) => (m >> 6) & 63;
const phongOf = (m: number) => (m >> 12) & 7;
const coOf = (m: number) => (m >> 15) & 7;

function biTanCong(b: Int8Array, sq: number, boiTrang: boolean): boolean {
  const s = boiTrang ? 1 : -1;
  const r = sq >> 3, c = sq & 7;
  const pr = boiTrang ? r - 1 : r + 1;
  if (pr >= 0 && pr < 8) {
    if (c > 0 && b[pr * 8 + c - 1] === s * P) return true;
    if (c < 7 && b[pr * 8 + c + 1] === s * P) return true;
  }
  for (const t of MA[sq]) if (b[t] === s * N) return true;
  for (const t of VUA[sq]) if (b[t] === s * K) return true;
  for (const ray of TIA_XE[sq]) {
    for (const t of ray) {
      const v = b[t];
      if (v !== 0) {
        if (v === s * R || v === s * Q) return true;
        break;
      }
    }
  }
  for (const ray of TIA_TUONG[sq]) {
    for (const t of ray) {
      const v = b[t];
      if (v !== 0) {
        if (v === s * B || v === s * Q) return true;
        break;
      }
    }
  }
  return false;
}

function oVua(b: Int8Array, s: number): number {
  for (let i = 0; i < 64; i++) if (b[i] === s * K) return i;
  return -1;
}

function dangBiChieu(p: Pos): boolean {
  const ks = oVua(p.b, p.w ? 1 : -1);
  return ks >= 0 && biTanCong(p.b, ks, !p.w);
}

/** Nước giả hợp lệ (chưa kiểm tự để vua bị chiếu). chiAn = chỉ nước ăn quân + phong cấp. */
function sinhNuoc(p: Pos, chiAn: boolean): number[] {
  const out: number[] = [];
  const b = p.b;
  const s = p.w ? 1 : -1;
  for (let sq = 0; sq < 64; sq++) {
    const v = b[sq];
    if (v * s <= 0) continue;
    const t = v * s;
    if (t === P) {
      const r = sq >> 3, c = sq & 7;
      const huong = 8 * s;
      const hangPhong = p.w ? 7 : 0;
      const hangDau = p.w ? 1 : 6;
      const mot = sq + huong;
      if (b[mot] === 0) {
        if (mot >> 3 === hangPhong) {
          for (const pr of [Q, R, B, N]) out.push(mv(sq, mot, pr));
        } else if (!chiAn) {
          out.push(mv(sq, mot));
          if (r === hangDau && b[mot + huong] === 0) out.push(mv(sq, mot + huong, 0, F_DOI));
        }
      }
      for (const dc of [-1, 1]) {
        const nc = c + dc;
        if (nc < 0 || nc > 7) continue;
        const to = mot + dc;
        if (b[to] * s < 0) {
          if (to >> 3 === hangPhong) for (const pr of [Q, R, B, N]) out.push(mv(sq, to, pr));
          else out.push(mv(sq, to));
        } else if (to === p.ep && b[to] === 0) {
          out.push(mv(sq, to, 0, F_EP));
        }
      }
    } else if (t === N || t === K) {
      for (const to of (t === N ? MA : VUA)[sq]) {
        const x = b[to] * s;
        if (x > 0) continue;
        if (chiAn && x === 0) continue;
        out.push(mv(sq, to));
      }
      if (t === K && !chiAn) {
        if (p.w && sq === 4) {
          if (p.cs & 1 && b[5] === 0 && b[6] === 0 && b[7] === R &&
            !biTanCong(b, 4, false) && !biTanCong(b, 5, false) && !biTanCong(b, 6, false)) out.push(mv(4, 6, 0, F_NT));
          if (p.cs & 2 && b[1] === 0 && b[2] === 0 && b[3] === 0 && b[0] === R &&
            !biTanCong(b, 4, false) && !biTanCong(b, 3, false) && !biTanCong(b, 2, false)) out.push(mv(4, 2, 0, F_NT));
        } else if (!p.w && sq === 60) {
          if (p.cs & 4 && b[61] === 0 && b[62] === 0 && b[63] === -R &&
            !biTanCong(b, 60, true) && !biTanCong(b, 61, true) && !biTanCong(b, 62, true)) out.push(mv(60, 62, 0, F_NT));
          if (p.cs & 8 && b[57] === 0 && b[58] === 0 && b[59] === 0 && b[56] === -R &&
            !biTanCong(b, 60, true) && !biTanCong(b, 59, true) && !biTanCong(b, 58, true)) out.push(mv(60, 58, 0, F_NT));
        }
      }
    } else {
      const tias = t === B ? [TIA_TUONG[sq]] : t === R ? [TIA_XE[sq]] : [TIA_XE[sq], TIA_TUONG[sq]];
      for (const nhom of tias) {
        for (const ray of nhom) {
          for (const to of ray) {
            const x = b[to] * s;
            if (x > 0) break;
            if (x < 0) {
              out.push(mv(sq, to));
              break;
            }
            if (!chiAn) out.push(mv(sq, to));
          }
        }
      }
    }
  }
  return out;
}

function diNuoc(p: Pos, m: number): Undo {
  const from = tuOf(m), to = denOf(m), pr = phongOf(m), f = coOf(m);
  const b = p.b;
  const quan = b[from];
  const u: Undo = { cap: b[to], cs: p.cs, ep: p.ep, half: p.half, full: p.full, quan };
  b[to] = quan;
  b[from] = 0;
  if (f & F_EP) {
    const capSq = to + (p.w ? -8 : 8);
    u.cap = b[capSq];
    b[capSq] = 0;
  }
  if (pr) b[to] = p.w ? pr : -pr;
  if (f & F_NT) {
    if (to === 6) { b[5] = b[7]; b[7] = 0; }
    else if (to === 2) { b[3] = b[0]; b[0] = 0; }
    else if (to === 62) { b[61] = b[63]; b[63] = 0; }
    else if (to === 58) { b[59] = b[56]; b[56] = 0; }
  }
  p.ep = f & F_DOI ? (from + to) >> 1 : -1;
  p.cs &= MAT_NA_NT[from] & MAT_NA_NT[to];
  p.half = quan === P || quan === -P || u.cap !== 0 ? 0 : p.half + 1;
  if (!p.w) p.full++;
  p.w = !p.w;
  return u;
}

function hoanNuoc(p: Pos, m: number, u: Undo): void {
  const from = tuOf(m), to = denOf(m), f = coOf(m);
  const b = p.b;
  p.w = !p.w;
  b[from] = u.quan;
  if (f & F_EP) {
    b[to] = 0;
    b[to + (p.w ? -8 : 8)] = u.cap;
  } else {
    b[to] = u.cap;
  }
  if (f & F_NT) {
    if (to === 6) { b[7] = b[5]; b[5] = 0; }
    else if (to === 2) { b[0] = b[3]; b[3] = 0; }
    else if (to === 62) { b[63] = b[61]; b[61] = 0; }
    else if (to === 58) { b[56] = b[59]; b[59] = 0; }
  }
  p.cs = u.cs;
  p.ep = u.ep;
  p.half = u.half;
  p.full = u.full;
}

function nuocHopLe(p: Pos, chiAn = false): number[] {
  const res: number[] = [];
  const s = p.w ? 1 : -1;
  for (const m of sinhNuoc(p, chiAn)) {
    const u = diNuoc(p, m);
    const ks = oVua(p.b, s);
    if (ks < 0 || !biTanCong(p.b, ks, p.w)) res.push(m);
    hoanNuoc(p, m, u);
  }
  return res;
}

// ─── Chuyển đổi trạng thái JSON ↔ nội bộ ─────────────────────────────────────
function maQuan(ch: string | null): number {
  if (!ch) return 0;
  const i = CHU.indexOf(ch.toLowerCase());
  if (i <= 0) return 0;
  return ch === ch.toUpperCase() ? i : -i;
}
function chuQuan(v: number): QuanCoVua | null {
  if (v === 0) return null;
  const c = CHU[Math.abs(v)];
  return (v > 0 ? c.toUpperCase() : c) as QuanCoVua;
}
function csTuChuoi(x: string): number {
  let cs = 0;
  if (x.includes('K')) cs |= 1;
  if (x.includes('Q')) cs |= 2;
  if (x.includes('k')) cs |= 4;
  if (x.includes('q')) cs |= 8;
  return cs;
}
function csThanhChuoi(cs: number): string {
  return (cs & 1 ? 'K' : '') + (cs & 2 ? 'Q' : '') + (cs & 4 ? 'k' : '') + (cs & 8 ? 'q' : '');
}
function sangPos(s: TrangThaiCoVua): Pos {
  const b = new Int8Array(64);
  for (let i = 0; i < 64; i++) b[i] = maQuan(s.ban[i] ?? null);
  return {
    b,
    w: s.luotMau === 'w',
    cs: csTuChuoi(s.nhapThanh),
    ep: s.enPassant ? oTuTen(s.enPassant) : -1,
    half: s.nuaNuoc,
    full: s.soNuoc,
  };
}
function khoaViTri(p: Pos): string {
  let k = '';
  for (let i = 0; i < 64; i++) k += p.b[i] === 0 ? '.' : chuQuan(p.b[i]);
  k += p.w ? 'w' : 'b';
  k += csThanhChuoi(p.cs);
  // Ô qua đường chỉ tính khi thật có tốt kề bên bắt được (đúng luật FIDE gần đủ).
  if (p.ep >= 0) {
    const s = p.w ? 1 : -1;
    const hang = p.ep - 8 * s;
    const c = p.ep & 7;
    if ((c > 0 && p.b[hang - 1] === s * P) || (c < 7 && p.b[hang + 1] === s * P)) k += tenO(p.ep);
  }
  return k;
}
function tuPos(p: Pos, lichSu: string[], nuocCuoi: TrangThaiCoVua['nuocCuoi']): TrangThaiCoVua {
  const ban: (QuanCoVua | null)[] = [];
  for (let i = 0; i < 64; i++) ban.push(chuQuan(p.b[i]));
  return {
    ban,
    luotMau: p.w ? 'w' : 'b',
    nhapThanh: csThanhChuoi(p.cs),
    enPassant: p.ep >= 0 ? tenO(p.ep) : null,
    nuaNuoc: p.half,
    soNuoc: p.full,
    lichSu,
    nuocCuoi,
  };
}

/** Nạp vị trí từ FEN (dùng cho test / bài thế). */
export function tuFen(fen: string): TrangThaiCoVua {
  const [banF, mau = 'w', nt = '-', ep = '-', half = '0', full = '1'] = fen.trim().split(/\s+/);
  const b = new Int8Array(64);
  const hangs = banF.split('/');
  if (hangs.length !== 8) throw new Error('FEN sai');
  for (let i = 0; i < 8; i++) {
    const r = 7 - i;
    let c = 0;
    for (const ch of hangs[i]) {
      if (/[1-8]/.test(ch)) c += Number(ch);
      else {
        b[r * 8 + c] = maQuan(ch);
        c++;
      }
    }
  }
  const p: Pos = {
    b,
    w: mau === 'w',
    cs: nt === '-' ? 0 : csTuChuoi(nt),
    ep: ep === '-' ? -1 : oTuTen(ep),
    half: Number(half) || 0,
    full: Number(full) || 1,
  };
  return tuPos(p, [khoaViTri(p)], null);
}

const FEN_DAU = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// ─── Kết thúc ván ────────────────────────────────────────────────────────────
function thieuQuan(b: Int8Array): boolean {
  const nhe: { t: number; mauO: number }[] = [];
  for (let i = 0; i < 64; i++) {
    const t = Math.abs(b[i]);
    if (t === 0 || t === K) continue;
    if (t === P || t === R || t === Q) return false;
    nhe.push({ t, mauO: ((i >> 3) + (i & 7)) & 1 });
  }
  if (nhe.length <= 1) return true;
  // Chỉ còn tượng, tất cả cùng màu ô ⇒ không thể chiếu hết.
  return nhe.every((x) => x.t === B) && nhe.every((x) => x.mauO === nhe[0].mauO);
}

function ketThucPos(p: Pos, lichSu: string[]): KetQua | null {
  const hl = nuocHopLe(p);
  if (hl.length === 0) {
    if (dangBiChieu(p)) return { thang: [p.w ? 1 : 0], hoa: false, lyDo: 'chieu-het' };
    return { thang: [], hoa: true, lyDo: 'het-nuoc' };
  }
  if (p.half >= 100) return { thang: [], hoa: true, lyDo: 'hoa-50' };
  if (lichSu.length >= 5) {
    const cuoi = lichSu[lichSu.length - 1];
    let dem = 0;
    for (const k of lichSu) if (k === cuoi) dem++;
    if (dem >= 3) return { thang: [], hoa: true, lyDo: 'lap-3' };
  }
  if (thieuQuan(p.b)) return { thang: [], hoa: true, lyDo: 'thieu-quan' };
  return null;
}

// ─── Đánh giá + tìm kiếm ─────────────────────────────────────────────────────
const GIA = [0, 100, 320, 330, 500, 900, 0];
// Bảng vị trí nhìn từ phía Trắng, hàng 8 trước (a8..h8, …, a1..h1).
const BANG: number[][] = [
  [],
  [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5,
    0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30,
    -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
  [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10,
    -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
  [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5,
    -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
  [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5,
    0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
  [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30,
    -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20],
];
const VUA_CUOI = [-50, -40, -30, -20, -20, -30, -40, -50, -30, -20, -10, 0, 0, -10, -20, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30, 0, 0, 0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50];

/** Điểm nhìn từ bên đang tới lượt (centipawn). */
function danhGia(p: Pos): number {
  const b = p.b;
  let nangTrang = 0, nangDen = 0;
  for (let i = 0; i < 64; i++) {
    const v = b[i];
    if (v > 1 && v < K) nangTrang += GIA[v];
    else if (v < -1 && v > -K) nangDen += GIA[-v];
  }
  const tanCuoc = nangTrang + nangDen <= 2600;
  let d = 0;
  for (let i = 0; i < 64; i++) {
    const v = b[i];
    if (v === 0) continue;
    const t = v > 0 ? v : -v;
    const idx = v > 0 ? (7 - (i >> 3)) * 8 + (i & 7) : i;
    const bang = t === K && tanCuoc ? VUA_CUOI : BANG[t];
    const x = GIA[t] + bang[idx];
    d += v > 0 ? x : -x;
  }
  return p.w ? d : -d;
}

const MATE = 100000;
const VO_CUC = 1e9;

interface PhienTim {
  p: Pos;
  het: number;
  nut: number;
  dung: boolean;
  choDung: boolean;
}

function diemSap(p: Pos, m: number): number {
  const to = denOf(m);
  let v = Math.abs(p.b[to]);
  if (coOf(m) & F_EP) v = P;
  const pr = phongOf(m);
  let d = 0;
  if (v) d += 10000 + GIA[v] * 10 - GIA[Math.abs(p.b[tuOf(m)])] / 10;
  if (pr) d += 8000 + GIA[pr];
  return d;
}
function sapXep(p: Pos, ms: number[]): number[] {
  const kem = ms.map((m) => ({ m, d: diemSap(p, m) }));
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
  const s = p.w ? 1 : -1;
  for (const m of sapXep(p, sinhNuoc(p, true))) {
    const u = diNuoc(p, m);
    const ks = oVua(p.b, s);
    if (ks >= 0 && biTanCong(p.b, ks, p.w)) {
      hoanNuoc(p, m, u);
      continue;
    }
    const sc = -tinhLang(t, -beta, -alpha, sauQ - 1);
    hoanNuoc(p, m, u);
    if (t.dung) return 0;
    if (sc >= beta) return sc;
    if (sc > alpha) alpha = sc;
  }
  return alpha;
}

function alphaBeta(t: PhienTim, sau: number, alpha: number, beta: number, ply: number): number {
  kiemGio(t);
  if (t.dung) return 0;
  const p = t.p;
  if (sau <= 0) return tinhLang(t, alpha, beta, 6);
  if (p.half >= 100) return 0;
  const s = p.w ? 1 : -1;
  let soHopLe = 0;
  let tot = -VO_CUC;
  for (const m of sapXep(p, sinhNuoc(p, false))) {
    const u = diNuoc(p, m);
    const ks = oVua(p.b, s);
    if (ks >= 0 && biTanCong(p.b, ks, p.w)) {
      hoanNuoc(p, m, u);
      continue;
    }
    soHopLe++;
    const sc = -alphaBeta(t, sau - 1, -beta, -alpha, ply + 1);
    hoanNuoc(p, m, u);
    if (t.dung) return 0;
    if (sc > tot) tot = sc;
    if (sc > alpha) alpha = sc;
    if (alpha >= beta) break;
  }
  if (soHopLe === 0) return dangBiChieu(p) ? -MATE + ply : 0;
  return tot;
}

function timNuocBot(p: Pos, capDo: CapDoBot, ngauNhien: () => number, lichSu: string[]): number {
  const goc = nuocHopLe(p);
  if (goc.length === 1) return goc[0];
  if (capDo === 1) {
    let tot = goc[0], diemTot = -VO_CUC;
    for (const m of goc) {
      const u = diNuoc(p, m);
      let sc = -danhGia(p);
      if (nuocHopLe(p).length === 0 && dangBiChieu(p)) sc += MATE;
      hoanNuoc(p, m, u);
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
      const u = diNuoc(p, m);
      let sc = -alphaBeta(t, sau - 1, -VO_CUC, -(alpha - bienDo - 1), 1);
      // Tránh tự đi vào lặp 3 lần khi đang hơn.
      if (!t.dung && lichSu.length) {
        const k = khoaViTri(p);
        let dem = 0;
        for (const x of lichSu) if (x === k) dem++;
        if (dem >= 2) sc = 0;
      }
      hoanNuoc(p, m, u);
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

// ─── Giao tiếp LuatTro ───────────────────────────────────────────────────────
const PHONG_MA: Record<PhongCap, number> = { q: Q, r: R, b: B, n: N };
const MA_PHONG: Record<number, PhongCap> = { [Q]: 'q', [R]: 'r', [B]: 'b', [N]: 'n' };

function sangNuoc(m: number): NuocCoVua {
  const n: NuocCoVua = { tu: tenO(tuOf(m)), den: tenO(denOf(m)) };
  const pr = phongOf(m);
  if (pr) n.phong = MA_PHONG[pr];
  return n;
}
function timMa(p: Pos, n: NuocCoVua): number | null {
  const from = oTuTen(n.tu), to = oTuTen(n.den);
  const pr = n.phong ? PHONG_MA[n.phong] : 0;
  for (const m of nuocHopLe(p)) {
    if (tuOf(m) === from && denOf(m) === to && phongOf(m) === pr) return m;
  }
  return null;
}

export const coVua: LuatTro<TrangThaiCoVua, NuocCoVua> = {
  ma: 'co-vua',
  soNguoi: { min: 2, max: 2 },

  khoiTao() {
    return tuFen(FEN_DAU);
  },

  luot(s) {
    return s.luotMau === 'w' ? 0 : 1;
  },

  kiemTra(s, ghe, m) {
    if (!laDoiTuong(m)) return 'Nước đi không hợp lệ';
    const { tu, den, phong } = m;
    if (typeof tu !== 'string' || typeof den !== 'string' || oTuTen(tu) < 0 || oTuTen(den) < 0) return 'Ô không hợp lệ';
    if (phong !== undefined && phong !== 'q' && phong !== 'r' && phong !== 'b' && phong !== 'n') return 'Quân phong cấp không hợp lệ';
    if (coVua.ketThuc(s)) return 'Ván đã kết thúc';
    if (ghe !== coVua.luot(s)) return 'Chưa tới lượt bạn';
    const p = sangPos(s);
    const from = oTuTen(tu), to = oTuTen(den);
    const v = p.b[from];
    if (v === 0 || (v > 0) !== p.w) return 'Không có quân của bạn ở ô đó';
    const hl = nuocHopLe(p).filter((x) => tuOf(x) === from && denOf(x) === to);
    if (hl.length === 0) return 'Nước đi không hợp lệ';
    const canPhong = hl.some((x) => phongOf(x) !== 0);
    if (canPhong && phong === undefined) return 'Hãy chọn quân phong cấp';
    if (!canPhong && phong !== undefined) return 'Nước này không phong cấp';
    return null;
  },

  apDung(s, _ghe, m) {
    const p = sangPos(s);
    const ma = timMa(p, m);
    if (ma === null) throw new Error('Nước không hợp lệ');
    diNuoc(p, ma);
    const k = khoaViTri(p);
    const lichSu = p.half === 0 ? [k] : [...s.lichSu, k];
    return tuPos(p, lichSu, { tu: tenO(tuOf(ma)), den: tenO(denOf(ma)) });
  },

  cacNuoc(s) {
    if (coVua.ketThuc(s)) return [];
    return nuocHopLe(sangPos(s)).map(sangNuoc);
  },

  ketThuc(s) {
    return ketThucPos(sangPos(s), s.lichSu);
  },

  nhinTu(s) {
    return { ...s, chieu: dangBiChieu(sangPos(s)) };
  },

  nuocBot(s, capDo, ngauNhien) {
    const p = sangPos(s);
    return sangNuoc(timNuocBot(p, capDo, ngauNhien, s.lichSu));
  },

  moTa(s, m) {
    const p = sangPos(s);
    const ma = timMa(p, m);
    if (ma === null) return `${m.tu}–${m.den}`;
    const quan = Math.abs(p.b[tuOf(ma)]);
    const an = p.b[denOf(ma)] !== 0 || (coOf(ma) & F_EP) !== 0;
    let chu: string;
    if (coOf(ma) & F_NT) chu = denOf(ma) % 8 === 6 ? 'O-O' : 'O-O-O';
    else {
      chu = (quan === P ? '' : CHU[quan].toUpperCase()) + m.tu + (an ? '×' : '–') + m.den;
      if (phongOf(ma)) chu += '=' + CHU[phongOf(ma)].toUpperCase();
    }
    diNuoc(p, ma);
    if (dangBiChieu(p)) chu += nuocHopLe(p).length === 0 ? '#' : '+';
    return chu;
  },
};

/** Đếm nút perft — chỉ để kiểm bộ sinh nước. */
export function perftCoVua(s: TrangThaiCoVua, sau: number): number {
  const p = sangPos(s);
  const dem = (d: number): number => {
    const ms = nuocHopLe(p);
    if (d === 1) return ms.length;
    let n = 0;
    for (const m of ms) {
      const u = diNuoc(p, m);
      n += dem(d - 1);
      hoanNuoc(p, m, u);
    }
    return n;
  };
  return sau <= 0 ? 1 : dem(sau);
}
