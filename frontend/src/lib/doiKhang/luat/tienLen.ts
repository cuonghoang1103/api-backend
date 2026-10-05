// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs
/**
 * TIẾN LÊN MIỀN NAM — 2–4 người, 13 lá/người (2–3 người vẫn 13 lá, phần còn lại không chia).
 *
 * Lá: hạng + chất, vd '3S', 'TD' (T = 10), '2H'. Hạng 3<4<…<T<J<Q<K<A<2; chất S♠ < C♣ < D♦ < H♥.
 * Bộ: rác (1 lá) · đôi · ba (sám) · tứ quý · sảnh ≥3 lá liên tiếp (không chứa 2) · đôi thông ≥3 đôi
 * liên tiếp (không chứa 2).
 * Chặn: cùng loại + cùng số lá + lá cao nhất lớn hơn. Chặt heo: 3 đôi thông chặt 1 heo; tứ quý chặt
 * heo / đôi heo / 3 đôi thông; 4 đôi thông chặt heo, đôi heo, tứ quý, 3 đôi thông.
 * Bỏ lượt = mất quyền trong vòng đó; mọi người còn lại bỏ hết ⇒ người đánh cuối đi tự do (nếu người
 * đó đã về thì người kế tiếp còn bài đi tự do).
 * Ván đầu (`nguoiDiTruoc === null`): người cầm lá nhỏ nhất được chia (3♠ khi đủ 4 người) đi trước
 * và nước đầu phải chứa lá đó. Ván sau: máy chủ đặt `nguoiDiTruoc` = người về nhất ván trước, đi tự do.
 * Ván kết thúc khi chỉ còn một người cầm bài; `thuHang` = thứ tự về.
 */
import type { CapDoBot, KetQua, LuatTro } from './kieu';
import { laDoiTuong, taoNgauNhien } from './chung';

export type LoaiBo = 'rac' | 'doi' | 'ba' | 'tu-quy' | 'sanh' | 'doi-thong';
export type NuocTienLen = { loai: 'danh'; la: string[] } | { loai: 'bo' };
export interface BoTrenBan {
  ghe: number;
  la: string[];
  loai: LoaiBo;
}
export interface TrangThaiTienLen {
  soNguoi: number;
  /** Bài trên tay từng ghế, đã sắp tăng dần. */
  bai: string[][];
  /** Ghế tới lượt (khi chưa ai đi và `nguoiDiTruoc` ≠ null thì lượt là `nguoiDiTruoc`). */
  luotGhe: number;
  /** Bộ đang phải chặn; null = đang đi tự do. */
  banTren: BoTrenBan | null;
  /** Ai đã bỏ lượt trong vòng hiện tại. */
  boLuot: boolean[];
  /** Thứ tự về (ghế), người đầu = nhất. */
  daVe: number[];
  /** Máy chủ đặt cho ván sau = người về nhất ván trước. null = ván đầu (luật lá nhỏ nhất). */
  nguoiDiTruoc: number | null;
  /** Lá nhỏ nhất được chia — bắt buộc trong nước đầu của ván đầu. */
  laDau: string;
  /** Số nước đã đi (gồm cả bỏ lượt). */
  soNuoc: number;
  nuocCuoi: { ghe: number; nuoc: NuocTienLen } | null;
}

/** Dạng ghế `ghe` nhìn thấy — bài người khác chỉ lộ số lá (lộ hết khi ván xong). */
export interface NhinTienLen {
  soNguoi: number;
  gheCuaToi: number | null;
  /** Bài của mình (null với người xem). */
  baiCuaToi: string[] | null;
  soLa: number[];
  luot: number;
  banTren: BoTrenBan | null;
  boLuot: boolean[];
  daVe: number[];
  nguoiDiTruoc: number | null;
  /** Lá bắt buộc phải có trong nước sắp đi (chỉ nước đầu ván đầu), không thì null. */
  laBatBuoc: string | null;
  soNuoc: number;
  nuocCuoi: { ghe: number; nuoc: NuocTienLen } | null;
  /** Bài mọi ghế — chỉ khi ván đã kết thúc. */
  baiLo: string[][] | null;
}

const HANG = '3456789TJQKA2';
const CHAT = 'SCDH';
const HEO = 12;

export function giaTriLa(la: string): number {
  return HANG.indexOf(la[0]) * 4 + CHAT.indexOf(la[1]);
}
const hangLa = (la: string) => HANG.indexOf(la[0]);
function laHopLe(x: unknown): x is string {
  return typeof x === 'string' && x.length === 2 && HANG.includes(x[0]) && CHAT.includes(x[1]);
}
const sapLa = (ds: string[]) => [...ds].sort((a, b) => giaTriLa(a) - giaTriLa(b));

interface Bo {
  loai: LoaiBo;
  so: number; // số lá
  cao: number; // giá trị lá cao nhất
}

export function nhanBo(la: string[]): Bo | null {
  const n = la.length;
  if (n === 0) return null;
  const ls = sapLa(la);
  const hs = ls.map(hangLa);
  const cao = giaTriLa(ls[n - 1]);
  if (n === 1) return { loai: 'rac', so: 1, cao };
  if (hs.every((h) => h === hs[0])) {
    if (n === 2) return { loai: 'doi', so: 2, cao };
    if (n === 3) return { loai: 'ba', so: 3, cao };
    if (n === 4) return { loai: 'tu-quy', so: 4, cao };
    return null;
  }
  if (hs[n - 1] === HEO) return null;
  if (n >= 3) {
    let sanh = true;
    for (let i = 1; i < n; i++) if (hs[i] !== hs[i - 1] + 1) { sanh = false; break; }
    if (sanh) return { loai: 'sanh', so: n, cao };
  }
  if (n >= 6 && n % 2 === 0) {
    let dt = true;
    for (let i = 0; i < n; i += 2) {
      if (hs[i] !== hs[i + 1]) { dt = false; break; }
      if (i > 0 && hs[i] !== hs[i - 2] + 1) { dt = false; break; }
    }
    if (dt) return { loai: 'doi-thong', so: n, cao };
  }
  return null;
}

/** `moi` có chặn được `cu` không. */
export function chanDuoc(moi: Bo, cu: Bo): boolean {
  if (moi.loai === cu.loai && moi.so === cu.so) return moi.cao > cu.cao;
  const heo1 = cu.loai === 'rac' && Math.floor(cu.cao / 4) === HEO;
  const heo2 = cu.loai === 'doi' && Math.floor(cu.cao / 4) === HEO;
  const ba_dt = cu.loai === 'doi-thong' && cu.so === 6;
  if (moi.loai === 'doi-thong' && moi.so === 6) return heo1;
  if (moi.loai === 'tu-quy') return heo1 || heo2 || ba_dt;
  if (moi.loai === 'doi-thong' && moi.so === 8) return heo1 || heo2 || ba_dt || cu.loai === 'tu-quy';
  return false;
}

function nhanBoTren(b: BoTrenBan): Bo {
  return nhanBo(b.la) as Bo;
}

function laBatBuoc(s: TrangThaiTienLen): string | null {
  return s.soNuoc === 0 && s.nguoiDiTruoc === null ? s.laDau : null;
}
function luotCua(s: TrangThaiTienLen): number {
  return s.soNuoc === 0 && s.nguoiDiTruoc !== null ? s.nguoiDiTruoc : s.luotGhe;
}
function daXong(s: TrangThaiTienLen): boolean {
  return s.daVe.length >= s.soNguoi;
}

/** Mọi bộ đánh được từ một tay bài (chưa lọc theo bàn). */
function moiBo(tay: string[]): string[][] {
  const out: string[][] = [];
  const theoHang: string[][] = Array.from({ length: 13 }, () => []);
  for (const la of sapLa(tay)) theoHang[hangLa(la)].push(la);
  // rác
  for (const la of sapLa(tay)) out.push([la]);
  // đôi / ba / tứ quý
  const toHop = (ds: string[], k: number): string[][] => {
    const res: string[][] = [];
    const f = (i: number, cur: string[]) => {
      if (cur.length === k) { res.push([...cur]); return; }
      for (let j = i; j < ds.length; j++) { cur.push(ds[j]); f(j + 1, cur); cur.pop(); }
    };
    f(0, []);
    return res;
  };
  for (let h = 0; h < 13; h++) {
    const g = theoHang[h];
    for (let k = 2; k <= Math.min(4, g.length); k++) out.push(...toHop(g, k));
  }
  // sảnh
  for (let dau = 0; dau < HEO; dau++) {
    let chon: string[][] = [[]];
    for (let h = dau; h < HEO && theoHang[h].length > 0; h++) {
      const moi: string[][] = [];
      for (const c of chon) for (const la of theoHang[h]) moi.push([...c, la]);
      chon = moi;
      if (h - dau + 1 >= 3) out.push(...chon);
    }
  }
  // đôi thông
  for (let dau = 0; dau < HEO; dau++) {
    let chon: string[][] = [[]];
    for (let h = dau; h < HEO && theoHang[h].length >= 2; h++) {
      const cap = toHop(theoHang[h], 2);
      const moi: string[][] = [];
      for (const c of chon) for (const d of cap) moi.push([...c, ...d]);
      chon = moi;
      if (h - dau + 1 >= 3) out.push(...chon);
    }
  }
  return out;
}

function cacNuocDanh(s: TrangThaiTienLen): string[][] {
  const ghe = luotCua(s);
  const bb = laBatBuoc(s);
  const tren = s.banTren ? nhanBoTren(s.banTren) : null;
  return moiBo(s.bai[ghe]).filter((ls) => {
    if (bb && !ls.includes(bb)) return false;
    if (!tren) return true;
    const b = nhanBo(ls);
    return !!b && chanDuoc(b, tren);
  });
}

function kePhai(s: TrangThaiTienLen, tu: number, dk: (g: number) => boolean): number {
  for (let i = 1; i <= s.soNguoi; i++) {
    const g = (tu + i) % s.soNguoi;
    if (dk(g)) return g;
  }
  return -1;
}

function chuyenLuot(s: TrangThaiTienLen, tu: number): void {
  const conBai = (g: number) => !s.daVe.includes(g);
  if (!s.banTren) {
    s.luotGhe = conBai(tu) ? tu : kePhai(s, tu, conBai);
    return;
  }
  const chu = s.banTren.ghe;
  const ung = (g: number) => conBai(g) && !s.boLuot[g] && g !== chu;
  const k = kePhai(s, tu, ung);
  if (k >= 0) {
    s.luotGhe = k;
    return;
  }
  // Hết vòng.
  s.banTren = null;
  s.boLuot = s.boLuot.map(() => false);
  s.luotGhe = conBai(chu) ? chu : kePhai(s, chu, conBai);
}

const KY_CHAT: Record<string, string> = { S: '♠', C: '♣', D: '♦', H: '♥' };
const tenHang = (h: string) => (h === 'T' ? '10' : h);
export function tenLa(la: string): string {
  return tenHang(la[0]) + KY_CHAT[la[1]];
}

// ─── Bot ─────────────────────────────────────────────────────────────────────
/** Số nhóm tối thiểu (tham lam) để đánh hết một tay — càng ít càng tốt. */
function soNhom(tay: string[]): number {
  const dem = new Array<number>(13).fill(0);
  for (const la of tay) dem[hangLa(la)]++;
  let nhom = 0;
  for (let h = 0; h < 13; h++) if (dem[h] === 4) { nhom++; dem[h] = 0; }
  for (;;) {
    let tot = 0, dauTot = -1;
    for (let dau = 0; dau < HEO; dau++) {
      let d = 0;
      while (dau + d < HEO && dem[dau + d] > 0) d++;
      if (d > tot) { tot = d; dauTot = dau; }
    }
    if (tot < 3) break;
    for (let h = dauTot; h < dauTot + tot; h++) dem[h]--;
    nhom++;
  }
  for (let h = 0; h < 13; h++) if (dem[h] > 0) nhom++;
  return nhom;
}
function soBom(tay: string[]): number {
  const dem = new Array<number>(13).fill(0);
  for (const la of tay) dem[hangLa(la)]++;
  return dem.filter((x) => x === 4).length;
}

function chonBot(s: TrangThaiTienLen, capDo: CapDoBot, ngauNhien: () => number): NuocTienLen {
  const ghe = luotCua(s);
  const tay = s.bai[ghe];
  const nuoc = cacNuocDanh(s);
  const duocBo = !!s.banTren;
  if (nuoc.length === 0) return { loai: 'bo' };
  const het = nuoc.find((ls) => ls.length === tay.length);
  if (het) return { loai: 'danh', la: het };

  if (capDo === 1) {
    let tot = nuoc[0], d = Infinity;
    for (const ls of nuoc) {
      const b = nhanBo(ls) as Bo;
      const x = b.cao * 10 + ls.length;
      if (x < d) { d = x; tot = ls; }
    }
    return { loai: 'danh', la: tot };
  }

  const doiThu = [];
  for (let g = 0; g < s.soNguoi; g++) if (g !== ghe && !s.daVe.includes(g)) doiThu.push(s.bai[g].length);
  const itNhat = doiThu.length ? Math.min(...doiThu) : 13;
  const nguyHiem = capDo === 3 && itNhat <= 2;
  const nhomTruoc = soNhom(tay);
  const bomTruoc = soBom(tay);
  const tren = s.banTren ? nhanBoTren(s.banTren) : null;
  const tayCaoNhat = giaTriLa(tay[tay.length - 1]);

  let tot: string[] | null = null;
  let diemTot = Infinity;
  for (const ls of nuoc) {
    const b = nhanBo(ls) as Bo;
    const con = tay.filter((x) => !ls.includes(x));
    const nhomSau = soNhom(con);
    let d = nhomSau * 100 + Math.floor(b.cao / 4) * 3 - ls.length;
    const coHeo = ls.some((x) => hangLa(x) === HEO);
    const laBom = b.loai === 'tu-quy' || (b.loai === 'doi-thong' && b.so >= 6);
    const choiHeo = tren && Math.floor(tren.cao / 4) === HEO;
    if (!nguyHiem && nhomSau > 1) {
      if (coHeo) d += 150;
      if (laBom) d += choiHeo ? 40 : 200;
      if (!laBom && soBom(con) < bomTruoc) d += 120;
    }
    if (nguyHiem) {
      if (tren) d -= b.cao; // chặn bằng bộ mạnh nhất
      else if (itNhat === 1 && b.loai === 'rac' && b.cao !== tayCaoNhat) d += 300;
      else if (itNhat === 2 && b.loai === 'doi') d += 150;
    }
    d += ngauNhien() * 5;
    if (d < diemTot) { diemTot = d; tot = ls; }
  }
  if (duocBo && !nguyHiem) {
    const diemBo = nhomTruoc * 100 + 30;
    if (diemBo < diemTot) return { loai: 'bo' };
  }
  return { loai: 'danh', la: tot ?? nuoc[0] };
}

// ─── LuatTro ─────────────────────────────────────────────────────────────────
export const tienLen: LuatTro<TrangThaiTienLen, NuocTienLen> = {
  ma: 'tien-len',
  soNguoi: { min: 2, max: 4 },

  khoiTao(soNguoi, seed) {
    const n = Math.max(2, Math.min(4, Math.floor(soNguoi) || 2));
    const bo: string[] = [];
    for (const h of HANG) for (const c of CHAT) bo.push(h + c);
    const rnd = taoNgauNhien(seed);
    for (let i = bo.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [bo[i], bo[j]] = [bo[j], bo[i]];
    }
    const bai: string[][] = [];
    for (let g = 0; g < n; g++) bai.push(sapLa(bo.slice(g * 13, g * 13 + 13)));
    let laDau = '', gheDau = 0, nho = Infinity;
    for (let g = 0; g < n; g++) {
      const v = giaTriLa(bai[g][0]);
      if (v < nho) { nho = v; laDau = bai[g][0]; gheDau = g; }
    }
    return {
      soNguoi: n,
      bai,
      luotGhe: gheDau,
      banTren: null,
      boLuot: new Array<boolean>(n).fill(false),
      daVe: [],
      nguoiDiTruoc: null,
      laDau,
      soNuoc: 0,
      nuocCuoi: null,
    };
  },

  luot(s) {
    return luotCua(s);
  },

  kiemTra(s, ghe, m) {
    if (!laDoiTuong(m)) return 'Nước đi không hợp lệ';
    if (daXong(s)) return 'Ván đã kết thúc';
    if (ghe !== luotCua(s)) return 'Chưa tới lượt bạn';
    if (m.loai === 'bo') {
      if (!s.banTren) return 'Bạn đang được đi tự do — phải đánh một bộ';
      return null;
    }
    if (m.loai !== 'danh') return 'Nước đi không hợp lệ';
    const la = m.la;
    if (!Array.isArray(la) || la.length === 0 || la.length > 13) return 'Chưa chọn lá nào';
    if (!la.every(laHopLe)) return 'Lá bài không hợp lệ';
    if (new Set(la).size !== la.length) return 'Lá bị trùng';
    const tay = s.bai[ghe] ?? [];
    if (!la.every((x) => tay.includes(x))) return 'Bạn không có lá đó';
    const b = nhanBo(la);
    if (!b) return 'Bộ bài không hợp lệ';
    const bb = laBatBuoc(s);
    if (bb && !la.includes(bb)) return `Nước đầu phải có lá ${tenLa(bb)}`;
    if (s.banTren && !chanDuoc(b, nhanBoTren(s.banTren))) return 'Bộ này không chặn được bài trên bàn';
    return null;
  },

  apDung(s, ghe, m) {
    const n: TrangThaiTienLen = {
      ...s,
      bai: s.bai.map((x) => [...x]),
      boLuot: [...s.boLuot],
      daVe: [...s.daVe],
      banTren: s.banTren ? { ...s.banTren, la: [...s.banTren.la] } : null,
      soNuoc: s.soNuoc + 1,
      nuocCuoi: { ghe, nuoc: m.loai === 'bo' ? { loai: 'bo' } : { loai: 'danh', la: sapLa(m.la) } },
    };
    if (m.loai === 'bo') {
      n.boLuot[ghe] = true;
      chuyenLuot(n, ghe);
      return n;
    }
    const la = sapLa(m.la);
    n.bai[ghe] = n.bai[ghe].filter((x) => !la.includes(x));
    n.banTren = { ghe, la, loai: (nhanBo(la) as Bo).loai };
    if (n.bai[ghe].length === 0) n.daVe.push(ghe);
    const con = [];
    for (let g = 0; g < n.soNguoi; g++) if (!n.daVe.includes(g)) con.push(g);
    if (con.length <= 1) {
      n.daVe.push(...con);
      return n;
    }
    chuyenLuot(n, ghe);
    return n;
  },

  cacNuoc(s) {
    if (daXong(s)) return [];
    const ds: NuocTienLen[] = cacNuocDanh(s).map((la) => ({ loai: 'danh', la }));
    if (s.banTren) ds.push({ loai: 'bo' });
    return ds;
  },

  ketThuc(s): KetQua | null {
    if (!daXong(s)) return null;
    return { thang: [s.daVe[0]], hoa: false, lyDo: 'het-bai', thuHang: [...s.daVe] };
  },

  nhinTu(s, ghe): NhinTienLen {
    const xong = daXong(s);
    return {
      soNguoi: s.soNguoi,
      gheCuaToi: ghe,
      baiCuaToi: ghe !== null && ghe >= 0 && ghe < s.soNguoi ? [...s.bai[ghe]] : null,
      soLa: s.bai.map((x) => x.length),
      luot: luotCua(s),
      banTren: s.banTren,
      boLuot: [...s.boLuot],
      daVe: [...s.daVe],
      nguoiDiTruoc: s.nguoiDiTruoc,
      laBatBuoc: laBatBuoc(s),
      soNuoc: s.soNuoc,
      nuocCuoi: s.nuocCuoi,
      baiLo: xong ? s.bai.map((x) => [...x]) : null,
    };
  },

  nuocBot(s, capDo, ngauNhien) {
    return chonBot(s, capDo, ngauNhien);
  },

  moTa(s, m) {
    if (m.loai === 'bo') return 'Bỏ lượt';
    const la = sapLa(m.la);
    const b = nhanBo(la);
    if (!b) return la.map(tenLa).join(' ');
    const dau = tenHang(la[0][0]), cuoi = tenHang(la[la.length - 1][0]);
    let chu: string;
    switch (b.loai) {
      case 'rac': chu = tenLa(la[0]); break;
      case 'doi': chu = `Đôi ${dau}`; break;
      case 'ba': chu = `Sám ${dau}`; break;
      case 'tu-quy': chu = `Tứ quý ${dau}`; break;
      case 'sanh': chu = `Sảnh ${dau}–${cuoi}`; break;
      default: chu = `${la.length / 2} đôi thông ${dau}–${cuoi}`;
    }
    if (s.banTren) {
      const tren = nhanBoTren(s.banTren);
      if (tren.loai !== b.loai || tren.so !== b.so) chu += ' (chặt)';
    }
    return chu;
  },
};
