// ⛔ BẢN CHÉP — sửa ở src/services/doiKhang/luat/ rồi chạy scripts/dong-bo-luat-doi-khang.mjs
/**
 * CARO 15×15 — 5 quân liền trở lên (ngang/dọc/chéo) thắng, bị chặn hai đầu vẫn tính (luật phổ thông
 * VN). Đầy bàn = hoà. Ghế 0 = X đi trước, ghế 1 = O.
 * Ô: [x, y], x = cột 0–14 (A–O), y = hàng 0–14 (hiển thị 1–15). Chỉ số mảng = y*15 + x.
 */
import type { CapDoBot, LuatTro } from './kieu';
import { laDoiTuong, laSoNguyen } from './chung';

export const CO_CARO = 15;
export interface NuocCaro {
  o: [number, number];
}
export interface TrangThaiCaro {
  n: number;
  /** 225 ô: 0 trống, 1 = quân ghế 0 (X), 2 = quân ghế 1 (O). Chỉ số = y*15 + x. */
  ban: number[];
  luotGhe: 0 | 1;
  soNuoc: number;
  nuocCuoi: [number, number] | null;
  /** Khi có người thắng: ghế thắng + các ô của đường thắng (để tô sáng). */
  thang: { ghe: number; duong: [number, number][] } | null;
}

const NN = CO_CARO;
/** Trọng số kết quả dò 2 tầng khi trộn với điểm tham lam (cấp 3) — đo 05/10: 0,2–2 cho kết quả ngang nhau. */
const HE_SO_DO = 0.5;
const HUONG = [[1, 0], [0, 1], [1, 1], [1, -1]];
const trong = (x: number, y: number) => x >= 0 && x < NN && y >= 0 && y < NN;

function timDuong(ban: number[], x: number, y: number, quan: number): [number, number][] | null {
  for (const [dx, dy] of HUONG) {
    const duong: [number, number][] = [[x, y]];
    for (const k of [1, -1]) {
      let cx = x + dx * k, cy = y + dy * k;
      while (trong(cx, cy) && ban[cy * NN + cx] === quan) {
        duong.push([cx, cy]);
        cx += dx * k;
        cy += dy * k;
      }
    }
    if (duong.length >= 5) return duong.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  return null;
}

// ─── Bot: chấm điểm mẫu ──────────────────────────────────────────────────────
function diemMau(lien: number, mo: number): number {
  if (lien >= 5) return 10_000_000;
  if (mo === 0) return 0;
  switch (lien) {
    case 4: return mo === 2 ? 1_000_000 : 100_000;
    case 3: return mo === 2 ? 10_000 : 1_000;
    case 2: return mo === 2 ? 500 : 50;
    default: return mo === 2 ? 10 : 2;
  }
}

/** Điểm một hướng nếu `quan` đặt vào ô trống (x,y). Nhận cả dạng có một khe (X X _ X X, X X _ X). */
function diemHuong(ban: number[], x: number, y: number, dx: number, dy: number, quan: number): number {
  let lien = 1;
  const ben: { mo: boolean; sau: number; moSau: boolean }[] = [];
  for (const k of [1, -1]) {
    let cx = x + dx * k, cy = y + dy * k;
    while (trong(cx, cy) && ban[cy * NN + cx] === quan) { lien++; cx += dx * k; cy += dy * k; }
    const mo = trong(cx, cy) && ban[cy * NN + cx] === 0;
    let sau = 0, moSau = false;
    if (mo) {
      let nx = cx + dx * k, ny = cy + dy * k;
      while (trong(nx, ny) && ban[ny * NN + nx] === quan) { sau++; nx += dx * k; ny += dy * k; }
      moSau = trong(nx, ny) && ban[ny * NN + nx] === 0;
    }
    ben.push({ mo, sau, moSau });
  }
  if (lien >= 5) return 10_000_000;
  let d = diemMau(lien, (ben[0].mo ? 1 : 0) + (ben[1].mo ? 1 : 0));
  for (let i = 0; i < 2; i++) {
    const b = ben[i];
    if (!b.mo || b.sau === 0) continue;
    const tong = lien + b.sau;
    if (tong >= 4) d = Math.max(d, 100_000); // lấp khe là đủ 5 ⇒ một nước "bốn"
    else if (tong === 3) d = Math.max(d, ben[1 - i].mo && b.moSau ? 8_000 : 800);
    else d = Math.max(d, ben[1 - i].mo && b.moSau ? 300 : 30);
  }
  return d;
}

/** Điểm nếu `quan` đặt vào ô trống (x,y) — cộng bốn hướng. */
function diemO(ban: number[], x: number, y: number, quan: number): number {
  let tong = 0;
  for (const [dx, dy] of HUONG) tong += diemHuong(ban, x, y, dx, dy, quan);
  return tong;
}

function ungVien(ban: number[]): number[] {
  const out: number[] = [];
  let coQuan = false;
  for (let i = 0; i < NN * NN; i++) {
    if (ban[i] !== 0) { coQuan = true; continue; }
    const x = i % NN, y = (i - x) / NN;
    let gan = false;
    for (let dy = -2; dy <= 2 && !gan; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const cx = x + dx, cy = y + dy;
        if (trong(cx, cy) && ban[cy * NN + cx] !== 0) { gan = true; break; }
      }
    }
    if (gan) out.push(i);
  }
  if (!coQuan) out.push(7 * NN + 7);
  if (out.length === 0) for (let i = 0; i < NN * NN; i++) if (ban[i] === 0) out.push(i);
  return out;
}

function chamDiem(ban: number[], i: number, ta: number, dich: number, heSoThu: number): number {
  const x = i % NN, y = (i - x) / NN;
  return diemO(ban, x, y, ta) + diemO(ban, x, y, dich) * heSoThu;
}

function chonBot(s: TrangThaiCaro, capDo: CapDoBot, ngauNhien: () => number): number {
  const ban = [...s.ban];
  const ta = s.luotGhe === 0 ? 1 : 2;
  const dich = 3 - ta;
  const uv = ungVien(ban);
  if (uv.length === 1) return uv[0];
  if (capDo === 1) {
    let tot = uv[0], d = -1;
    for (const i of uv) {
      const sc = chamDiem(ban, i, ta, dich, 0.5) * (0.4 + ngauNhien());
      if (sc > d) { d = sc; tot = i; }
    }
    return tot;
  }
  const xep = uv
    .map((i) => ({ i, d: chamDiem(ban, i, ta, dich, 0.9) + ngauNhien() }))
    .sort((a, b) => b.d - a.d);
  const diem = (i: number, q: number) => { const x = i % NN; return diemO(ban, x, (i - x) / NN, q); };
  // Ưu tiên chắc chắn: thắng ngay → chặn 5 → tạo bốn mở (thắng chắc).
  for (const { i } of xep) if (diem(i, ta) >= 10_000_000) return i;
  for (const { i } of xep) if (diem(i, dich) >= 10_000_000) return i;
  for (const { i } of xep) if (diem(i, ta) >= 1_000_000) return i;
  if (capDo === 2) return xep[0].i;
  // Cấp 3: dò 2 tầng (minimax): ta đi một trong các ứng viên tốt nhất, đối thủ đáp bằng các nước tốt
  // nhất của họ, rồi chấm thế cờ khi tới lượt ta.
  const tamPhan = (qTa: number, qDich: number): number => {
    let taMax = 0, dichMax = 0, dichThang = 0;
    for (const j of ungVien(ban)) {
      const a = diem(j, qTa), b = diem(j, qDich);
      if (a > taMax) taMax = a;
      if (b > dichMax) dichMax = b;
      if (b >= 10_000_000) dichThang++;
    }
    if (taMax >= 10_000_000) return 1e9;
    if (dichThang >= 2) return -1e9;
    if (taMax >= 1_000_000 && dichThang === 0) return 5e8;
    return taMax - dichMax * 0.9;
  };
  let tot = xep[0].i, diemTot = -Infinity;
  for (const { i, d } of xep.slice(0, 10)) {
    ban[i] = ta;
    let xauNhat = Infinity;
    if (timDuong(ban, i % NN, Math.floor(i / NN), ta)) xauNhat = 2e9;
    else {
      const dap = ungVien(ban)
        .map((j) => ({ j, d: diem(j, dich) + diem(j, ta) * 0.9 }))
        .sort((a, b) => b.d - a.d)
        .slice(0, 8);
      for (const { j } of dap) {
        ban[j] = dich;
        const v = timDuong(ban, j % NN, Math.floor(j / NN), dich) ? -2e9 : tamPhan(ta, dich);
        ban[j] = 0;
        if (v < xauNhat) xauNhat = v;
      }
    }
    ban[i] = 0;
    // Thế thắng/thua chắc thì theo dò; còn lại trộn với điểm tham lam (giữ thế tích luỹ).
    const gia = Math.abs(xauNhat) >= 1e8 ? xauNhat : d + xauNhat * HE_SO_DO;
    if (gia > diemTot) { diemTot = gia; tot = i; }
  }
  return tot;
}

const COT = 'ABCDEFGHIJKLMNO';


export const caro: LuatTro<TrangThaiCaro, NuocCaro> = {
  ma: 'caro',
  soNguoi: { min: 2, max: 2 },

  khoiTao() {
    return { n: NN, ban: new Array<number>(NN * NN).fill(0), luotGhe: 0, soNuoc: 0, nuocCuoi: null, thang: null };
  },

  luot(s) {
    return s.luotGhe;
  },

  kiemTra(s, ghe, m) {
    if (!laDoiTuong(m) || !Array.isArray(m.o) || m.o.length !== 2) return 'Nước đi không hợp lệ';
    const [x, y] = m.o as unknown[];
    if (!laSoNguyen(x, 0, NN - 1) || !laSoNguyen(y, 0, NN - 1)) return 'Ô ngoài bàn cờ';
    if (caro.ketThuc(s)) return 'Ván đã kết thúc';
    if (ghe !== s.luotGhe) return 'Chưa tới lượt bạn';
    if (s.ban[y * NN + x] !== 0) return 'Ô này đã có quân';
    return null;
  },

  apDung(s, ghe, m) {
    const [x, y] = m.o;
    const ban = [...s.ban];
    const quan = ghe === 0 ? 1 : 2;
    ban[y * NN + x] = quan;
    const duong = timDuong(ban, x, y, quan);
    return {
      n: NN,
      ban,
      luotGhe: s.luotGhe === 0 ? 1 : 0,
      soNuoc: s.soNuoc + 1,
      nuocCuoi: [x, y],
      thang: duong ? { ghe, duong } : null,
    };
  },

  cacNuoc(s) {
    if (caro.ketThuc(s)) return [];
    const out: NuocCaro[] = [];
    for (let i = 0; i < NN * NN; i++) if (s.ban[i] === 0) out.push({ o: [i % NN, Math.floor(i / NN)] });
    return out;
  },

  ketThuc(s) {
    if (s.thang) return { thang: [s.thang.ghe], hoa: false, lyDo: 'nam-lien' };
    if (s.soNuoc >= NN * NN) return { thang: [], hoa: true, lyDo: 'day-ban' };
    return null;
  },

  nhinTu(s) {
    return s;
  },

  nuocBot(s, capDo, ngauNhien) {
    const i = chonBot(s, capDo, ngauNhien);
    return { o: [i % NN, Math.floor(i / NN)] };
  },

  moTa(_s, m) {
    return COT[m.o[0]] + String(m.o[1] + 1);
  },
};
