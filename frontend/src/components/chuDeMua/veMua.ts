/**
 * BỘ VẼ chủ đề mùa — Canvas 2D thuần, chép từ app iOS (HinhMua.swift + NenMua.swift, nhánh ios-gop 459b974).
 * Toàn bộ là hình tự vẽ (Path2D), không ảnh, không tài sản bản quyền.
 *
 * Hạt KHÔNG có trạng thái: vị trí = hàm của (chỉ số, thời gian) ⇒ mỗi khung chỉ vẽ, không cập nhật gì; đứng yên
 * thì vẽ một thời điểm cố định (hạt rải sẵn) — không phải nền trống.
 *
 * Chỉ được nạp qua next/dynamic (NenMuaCanvas, thẻ xem trước ở Cài đặt) ⇒ người dùng Mặc định không tải tệp này.
 */

import type { Mua } from '@/lib/chuDeMua/logic';

export type KieuNen = 'trang' | 'xemThu';

export interface TuyChonVe {
  w: number;
  h: number;
  /** giây */
  t: number;
  mua: Mua;
  kieu: KieuNen;
  toi: boolean;
  chay: boolean;
  /** khoảng chừa: đỉnh (thanh điều hướng), đáy (thanh tab di động) */
  dinh: number;
  day: number;
  /** số hạt cơ sở cho màn cỡ điện thoại */
  hatCoSo?: number;
  /** Mép TRÊN (px) của nút nổi ở góc dưới phải / trái (robot CuongMini, "Ask CuongMini", trình nhạc…) — đo từ DOM
   *  ở NenMuaCanvas. Trang trí góc dưới đứng LÊN TRÊN mép này thay vì nằm sau nút. */
  tranhPhai?: number;
  tranhTrai?: number;
}

// ── Hình đơn vị (hộp [-0,5…0,5]) ────────────────────────────────────────────────────────────────

const canhHoa = (() => {
  const p = new Path2D();
  p.moveTo(0, 0.5);
  p.bezierCurveTo(0.40, 0.25, 0.44, -0.32, 0.12, -0.48);
  p.lineTo(0, -0.34);
  p.lineTo(-0.12, -0.48);
  p.bezierCurveTo(-0.44, -0.32, -0.40, 0.25, 0, 0.5);
  p.closePath();
  return p;
})();

const laPhong = (() => {
  const phai: [number, number][] = [
    [0, -0.5], [0.07, -0.30], [0.17, -0.38], [0.15, -0.17], [0.40, -0.31], [0.33, -0.12], [0.49, -0.06],
    [0.30, 0.06], [0.36, 0.18], [0.14, 0.13], [0.05, 0.24], [0.02, 0.21], [0.02, 0.5],
  ];
  const p = new Path2D();
  p.moveTo(phai[0][0], phai[0][1]);
  for (const d of phai.slice(1)) p.lineTo(d[0], d[1]);
  for (const d of [...phai].reverse().slice(0, -1)) p.lineTo(-d[0], d[1]);
  p.closePath();
  return p;
})();

const ganLa = (() => {
  const p = new Path2D();
  p.moveTo(0, 0.32); p.lineTo(0, -0.40);
  p.moveTo(0, 0.08); p.lineTo(0.34, -0.22);
  p.moveTo(0, 0.08); p.lineTo(-0.34, -0.22);
  return p;
})();

const bongTuyet = (() => {
  const p = new Path2D();
  for (let k = 0; k < 6; k++) {
    const g = (k * Math.PI) / 3;
    const d = (r: number, lech = 0): [number, number] => [Math.sin(g + lech) * r, -Math.cos(g + lech) * r];
    const a = d(0.5);
    p.moveTo(0, 0); p.lineTo(a[0], a[1]);
    const goc = d(0.28);
    p.moveTo(goc[0], goc[1]); p.lineTo(goc[0] + Math.sin(g + 0.7) * 0.15, goc[1] - Math.cos(g + 0.7) * 0.15);
    p.moveTo(goc[0], goc[1]); p.lineTo(goc[0] + Math.sin(g - 0.7) * 0.15, goc[1] - Math.cos(g - 0.7) * 0.15);
  }
  return p;
})();

const lapLanh = (() => {
  const p = new Path2D();
  p.moveTo(0, -0.5);
  p.quadraticCurveTo(0.07, -0.07, 0.5, 0);
  p.quadraticCurveTo(0.07, 0.07, 0, 0.5);
  p.quadraticCurveTo(-0.07, 0.07, -0.5, 0);
  p.quadraticCurveTo(-0.07, -0.07, 0, -0.5);
  p.closePath();
  return p;
})();

function sao5(trong = 0.42) {
  const p = new Path2D();
  for (let k = 0; k < 10; k++) {
    const r = k % 2 === 0 ? 0.5 : 0.5 * trong;
    const g = (k * Math.PI) / 5;
    if (k === 0) p.moveTo(Math.sin(g) * r, -Math.cos(g) * r);
    else p.lineTo(Math.sin(g) * r, -Math.cos(g) * r);
  }
  p.closePath();
  return p;
}
const sao = sao5();
const saoBien = sao5(0.5);

function haiAu(vo: number) {
  const p = new Path2D();
  const y = -0.18 * vo;
  p.moveTo(-0.5, y);
  p.quadraticCurveTo(-0.22, -0.32 + y, 0, 0.08);
  p.quadraticCurveTo(0.22, -0.32 + y, 0.5, y);
  return p;
}

const may = (() => {
  const p = new Path2D();
  const elip = (x: number, y: number, w: number, h: number) => {
    p.moveTo(x + w, y + h / 2);
    p.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  };
  elip(-0.5, -0.05, 0.42, 0.32);
  elip(-0.26, -0.28, 0.50, 0.50);
  elip(0.06, -0.12, 0.44, 0.38);
  p.moveTo(-0.42 + 0.12, 0.04);
  p.roundRect?.(-0.42, 0.04, 0.86, 0.24, 0.12);
  return p;
})();

// ── Tiện ích ───────────────────────────────────────────────────────────────────────────────────

/** Số giả ngẫu nhiên ỔN ĐỊNH theo chỉ số (giống `ngauNhien` bên iOS). */
function nn(i: number, k: number) {
  const x = Math.sin((i * 127 + k * 311) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}
function tronTru(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

type Ctx = CanvasRenderingContext2D;

function to(c: Ctx, p: Path2D, mau: string, x: number, y: number, co: number, goc = 0, latX = 1, doMo = 1) {
  c.save();
  c.globalAlpha *= doMo;
  c.translate(x, y);
  if (goc) c.rotate(goc);
  c.scale(co * latX, co);
  c.fillStyle = mau;
  c.fill(p);
  c.restore();
}
function net(c: Ctx, p: Path2D, mau: string, x: number, y: number, co: number, goc: number, day: number, doMo = 1) {
  c.save();
  c.globalAlpha *= doMo;
  c.translate(x, y);
  if (goc) c.rotate(goc);
  c.scale(co, co);
  c.strokeStyle = mau;
  c.lineWidth = day / co;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke(p);
  c.restore();
}
function tron(c: Ctx, x: number, y: number, r: number, mau: string, doMo = 1) {
  c.save();
  c.globalAlpha *= doMo;
  c.fillStyle = mau;
  c.beginPath();
  c.arc(x, y, Math.max(r, 0.1), 0, Math.PI * 2);
  c.fill();
  c.restore();
}
function elip(c: Ctx, x: number, y: number, w: number, h: number, mau: string) {
  c.fillStyle = mau;
  c.beginPath();
  c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  c.fill();
}
function hcn(c: Ctx, x: number, y: number, w: number, h: number, mau: string, bo = 0) {
  c.fillStyle = mau;
  c.beginPath();
  if (bo && c.roundRect) c.roundRect(x, y, w, h, bo);
  else c.rect(x, y, w, h);
  c.fill();
}
function tamGiac(c: Ctx, a: [number, number], b: [number, number], d: [number, number], mau: string) {
  c.fillStyle = mau;
  c.beginPath();
  c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]);
  c.closePath();
  c.fill();
}
function duong(c: Ctx, p: Path2D, mau: string, day: number) {
  c.strokeStyle = mau;
  c.lineWidth = day;
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.stroke(p);
}
function cum(c: Ctx, x: number, y: number, k: number, xoay: number, ve: () => void, doMo = 1) {
  c.save();
  c.globalAlpha *= doMo;
  c.translate(x, y);
  if (xoay) c.rotate(xoay);
  c.scale(k, k);
  ve();
  c.restore();
}
function hoa5(c: Ctx, mau: string, x: number, y: number, co: number, goc = 0, doMo = 1) {
  c.save();
  c.globalAlpha *= doMo;
  c.translate(x, y);
  if (goc) c.rotate(goc);
  c.scale(co, co);
  c.fillStyle = mau;
  for (let k = 0; k < 5; k++) {
    c.save();
    c.rotate((k * Math.PI * 2) / 5);
    c.translate(0, -0.25);
    c.scale(0.5, 0.5);
    c.fill(canhHoa);
    c.restore();
  }
  c.restore();
}

// ── Màu trang trí (sáng / tối) — giống BoMauTrangTri bên iOS ────────────────────────────────────

const HAT: Record<Mua, { sang: string[]; toi: string[] }> = {
  xuan: { sang: ['#F7A8C0', '#F9C1D3', '#F5C542', '#F3B0C8'], toi: ['#F48FB1', '#F8BBD0', '#FFD54F', '#F06292'] },
  ha: { sang: ['#6FB8DE', '#8CCDEB', '#E9B53C'], toi: ['#BFE9FF', '#7FD3F5', '#FFE08A'] },
  thu: { sang: ['#E0662A', '#C94A2C', '#E8A33A', '#F2A9BE'], toi: ['#F0864A', '#E0603C', '#F2B655', '#F6B3C8'] },
  dong: { sang: ['#9DBDE3', '#B4CDEA'], toi: ['#FFFFFF', '#DDEBFF'] },
};

// ── Bộ vẽ chính ────────────────────────────────────────────────────────────────────────────────

export function veMua(c: Ctx, o: TuyChonVe) {
  const { w, h, t, mua, kieu, toi, chay } = o;
  const nho = w < 640;
  const k = kieu === 'xemThu' ? Math.max(0.42, Math.min(w, h) / 300) : Math.min(Math.max(Math.min(w, h) / 410, 0.85), 1.15);
  const dinh = kieu === 'xemThu' ? 0 : o.dinh;
  const day = kieu === 'xemThu' ? h : h - o.day;
  const ds = toi ? HAT[mua].toi : HAT[mua].sang;
  // Lề hai bên cột nội dung (~1200px giữa). Trang trí phía TRÊN chỉ vẽ trong lề này (thanh điều hướng desktop trong
  // suốt, hàng tiêu đề/breadcrumb nằm ngay dưới) — màn hẹp không có lề ⇒ chỉ còn trang trí đáy + hạt.
  const le = kieu === 'xemThu' ? w : Math.max(0, (w - 1200) / 2);
  // Đáy riêng cho từng góc: nâng lên trên nút nổi nếu có (chừa 8px).
  const dayPhai = kieu === 'xemThu' ? day : Math.min(day, (o.tranhPhai ?? Infinity) - 8);
  const dayTrai = kieu === 'xemThu' ? day : Math.min(day, (o.tranhTrai ?? Infinity) - 8);
  const S = { c, w, h, t, mua, kieu, toi, chay, k, dinh, day, ds, nho, le, dayPhai, dayTrai };

  veSauHat(S);
  veHat(S, o.hatCoSo ?? (nho ? 12 : 18));
  // Trang trí góc: trên màn nhỏ mờ hơn (nội dung chiếm gần hết bề ngang).
  c.save();
  c.globalAlpha = kieu === 'xemThu' ? 1 : nho ? 0.6 : 0.9;
  veGoc(S);
  c.restore();
}

type S = {
  c: Ctx; w: number; h: number; t: number; mua: Mua; kieu: KieuNen; toi: boolean; chay: boolean;
  k: number; dinh: number; day: number; ds: string[]; nho: boolean; le: number;
  dayPhai: number; dayTrai: number;
};

function veHat(s: S, coSo: number) {
  const { c, w, h, t, mua, kieu, ds } = s;
  const n = kieu === 'xemThu'
    ? 8
    : Math.round(coSo * Math.min(Math.max((w * h) / (390 * 844), 1), 2));
  const tiLe = kieu === 'xemThu' ? 0.6 : 1;
  for (let i = 0; i < n; i++) {
    const r1 = nn(i, 1), r2 = nn(i, 2), r3 = nn(i, 3), r4 = nn(i, 4), r5 = nn(i, 5), r6 = nn(i, 6);
    const len = mua === 'ha'; // hạ: bong bóng / nắng bay LÊN
    const vanToc = (mua === 'dong' ? 16 + r2 * 22 : 20 + r2 * 26) * (kieu === 'xemThu' ? 0.55 : 1);
    const bien = 30;
    const quang = h + bien * 2;
    let y = ((r3 * quang + t * vanToc) % quang) - bien;
    if (len) y = h - y;
    const lac = Math.sin(t * (0.35 + r4 * 0.55) + r5 * 6.28) * (8 + r6 * 20) * tiLe;
    const x = r1 * w + lac;
    const goc = t * (0.25 + r4 * 0.8) * (r5 > 0.5 ? 1 : -1) + r6 * 6.28;
    // Vùng giữa (nơi nội dung) mờ hẳn — hạt sống chủ yếu ở lề.
    const lechGiua = Math.abs(x / Math.max(w, 1) - 0.5) * 2;
    const doMo = kieu === 'xemThu' ? 0.9 : (0.22 + 0.68 * tronTru(0.2, 0.85, lechGiua));
    const m = ds[i % ds.length];
    const sz = (7 + r2 * 9) * tiLe;

    switch (mua) {
      case 'xuan':
        if (i % 3 === 0) {
          hoa5(c, m, x, y, sz * 1.35, goc, doMo);
          tron(c, x, y, sz * 0.16, '#E8A317', doMo);
        } else {
          to(c, canhHoa, m, x, y, sz, goc, Math.max(0.25, Math.abs(Math.cos(goc * 1.3))), doMo);
        }
        break;
      case 'thu':
        if (i % 2 === 0) {
          const lat = Math.cos(goc * 1.2);
          to(c, laPhong, m, x, y, sz * 1.7, goc, Math.abs(lat) < 0.2 ? (lat < 0 ? -0.2 : 0.2) : lat, doMo);
        } else {
          to(c, canhHoa, '#F4A7BE', x, y, sz * 0.95, goc, Math.max(0.25, Math.abs(Math.cos(goc * 1.4))), doMo);
        }
        break;
      case 'dong':
        if (i % 4 === 0) net(c, bongTuyet, m, x, y, sz * 1.7, goc * 0.4, 1.4 * tiLe, doMo);
        else tron(c, x, y, (1.6 + r2 * 2.6) * tiLe, m, doMo * 0.95);
        break;
      case 'ha':
        if (i % 3 === 0) {
          const nhay = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.6 + r5 * 6));
          to(c, lapLanh, ds[2 % ds.length], x, y, sz * 1.1, 0, 1, doMo * nhay);
        } else {
          const r = (3 + r2 * 5) * tiLe;
          c.save();
          c.globalAlpha *= doMo * 0.9;
          c.strokeStyle = m;
          c.lineWidth = 1.2;
          c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke();
          c.fillStyle = 'rgba(255,255,255,0.85)';
          c.beginPath(); c.arc(x - r * 0.3, y - r * 0.3, r * 0.45, 0, Math.PI * 2); c.fill();
          c.restore();
        }
        break;
    }
  }
}

// ── Lớp sau hạt ────────────────────────────────────────────────────────────────────────────────

function veSauHat(s: S) {
  if (s.mua === 'xuan') veXuanSau(s);
  else if (s.mua === 'ha') veHaSau(s);
  else if (s.mua === 'thu') veThuSau(s);
  else veDongSau(s);
}

function veXuanSau(s: S) {
  const { c, w, h, t, k, kieu, chay, dinh } = s;
  if (kieu !== 'trang' || !chay) return;
  // Pháo hoa nhẹ — mỗi 7 giây một chùm, ở dải lề (né cột giữa).
  const chuKy = 7;
  const lan = Math.floor(t / chuKy);
  const tau = t - lan * chuKy;
  if (tau >= 2.2) return;
  const r = nn(lan, 11);
  const x0 = r < 0.5 ? w * (0.04 + r * 0.3) : w * (0.81 + (r - 0.5) * 0.3);
  const tam = [x0, dinh + 40 + nn(lan, 12) * h * 0.22];
  const mau = ['#F5B700', '#E53935', '#F06292'][lan % 3];
  const tienDo = 1 - Math.pow(1 - Math.min(tau / 1.5, 1), 3);
  const bk = 62 * k * tienDo;
  const doMo = Math.max(0, 1 - tau / 2.2) * 0.8;
  for (let j = 0; j < 16; j++) {
    const g = (j / 16) * Math.PI * 2;
    tron(c, tam[0] + Math.cos(g) * bk, tam[1] + Math.sin(g) * bk + tau * tau * 6, 2.3 * k, mau, doMo);
    tron(c, tam[0] + Math.cos(g) * bk * 0.6, tam[1] + Math.sin(g) * bk * 0.6 + tau * tau * 4, 1.3 * k, mau, doMo * 0.6);
  }
}

function veHaSau(s: S) {
  const { c, w, h, t, k, kieu, dinh, toi } = s;
  // Mây + hải âu: trên trang chỉ trôi trong hai lề (không băng qua hàng tiêu đề); màn hẹp không có lề ⇒ bỏ.
  const coLe = kieu === 'xemThu' || s.le >= 90;
  c.save();
  if (kieu === 'trang' && coLe) {
    c.beginPath();
    c.rect(0, 0, s.le, h);
    c.rect(w - s.le, 0, s.le, h);
    c.clip();
  }
  if (coLe) {
    // Mây trôi ở dải trên.
    for (let j = 0; j < 2; j++) {
      const rong = (j === 0 ? 120 : 90) * k;
      const vt = ((t * (6 + j * 3) + j * 340) % (w + rong * 2)) - rong;
      to(c, may, '#FFFFFF', vt, dinh + (j === 0 ? 26 : 70) * k, rong, 0, 1, kieu === 'xemThu' ? 0.85 : toi ? 0.22 : 0.75);
    }
    // Hải âu bay ngang mỗi 18 giây.
    if (kieu === 'trang') {
      const tau = t % 18;
      if (tau < 11) {
        for (let j = 0; j < 2; j++) {
          const x = -40 + ((w + 80) * (tau - j * 0.6)) / 11;
          const y = dinh + 90 * k + Math.sin(tau * 1.1 + j) * 10 + j * 18;
          net(c, haiAu(Math.sin(t * 7 + j)), toi ? '#A9C3D3' : '#3A4E5C', x, y, (22 - j * 5) * k, 0, 2, 0.75);
        }
      }
    }
  }
  c.restore();
  // Sóng ở đáy.
  const song: [string, number][] = [['#9FD9F0', 0.55], ['#5DBBE3', 0.5], ['#2C93CB', 0.5]];
  song.forEach(([m, a], j) => {
    const cao = (kieu === 'xemThu' ? 10 : 22) + j * (kieu === 'xemThu' ? 5 : 11) * k;
    const goc0 = h - cao;
    c.save();
    c.globalAlpha *= toi ? a * 0.6 : a;
    c.fillStyle = m;
    c.beginPath();
    c.moveTo(0, h);
    for (let x = 0; x <= w + 12; x += 12) {
      c.lineTo(x, goc0 + Math.sin(x / (46 * k) + t * (0.8 + j * 0.25) + j * 1.7) * (3 + j) * k);
    }
    c.lineTo(w, h);
    c.closePath();
    c.fill();
    c.restore();
  });
}

function veThuSau(s: S) {
  const { c, w, k, kieu, dinh } = s;
  // Trăng rằm góc trên phải.
  const r = 24 * k;
  if (kieu !== 'xemThu' && s.le < 90) return;
  const tam = kieu === 'xemThu' ? [w - 34 * k, 30 * k] : [w - s.le * 0.62, dinh + 40 * k];
  let g = c.createRadialGradient(tam[0], tam[1], r * 0.8, tam[0], tam[1], r * 2.2);
  g.addColorStop(0, 'rgba(255,233,176,0.55)');
  g.addColorStop(1, 'rgba(255,233,176,0)');
  c.fillStyle = g;
  c.beginPath(); c.arc(tam[0], tam[1], r * 2.2, 0, Math.PI * 2); c.fill();
  g = c.createRadialGradient(tam[0] - r * 0.3, tam[1] - r * 0.3, 1, tam[0] - r * 0.3, tam[1] - r * 0.3, r * 1.3);
  g.addColorStop(0, '#FFF1C4');
  g.addColorStop(1, '#F4C95D');
  c.fillStyle = g;
  c.beginPath(); c.arc(tam[0], tam[1], r, 0, Math.PI * 2); c.fill();
  c.save();
  c.globalAlpha *= 0.35;
  elip(c, tam[0] - r * 0.45, tam[1] - r * 0.3, r * 0.42, r * 0.36, '#E8C47E');
  elip(c, tam[0] + r * 0.15, tam[1] + r * 0.2, r * 0.3, r * 0.26, '#E8C47E');
  c.restore();
}

function veDongSau(s: S) {
  const { w, k, kieu, dinh } = s;
  // Đèn dây chăng ngang mép trên, nhấp nháy.
  const y0 = dinh + (kieu === 'xemThu' ? 6 : 4);
  const vong = (kieu === 'xemThu' ? 10 : 22) * k;
  if (kieu === 'xemThu') denDay(s, 0, w, y0, vong);
  else if (s.le >= 90) { denDay(s, 0, s.le, y0, vong * 0.8); denDay(s, w - s.le, w, y0, vong * 0.8); }
  veTuyetDong(s);
}

/** Một dây đèn võng từ x=a tới x=b. */
function denDay(s: S, xa: number, xb: number, y0: number, vong: number) {
  const { c, t, k, chay, toi } = s;
  const w = xb - xa;
  const doan = Math.max(1, Math.floor(w / (170 * k)));
  c.save();
  c.translate(xa, 0);
  c.save();
  c.globalAlpha *= 0.6;
  c.strokeStyle = toi ? '#5C7A66' : '#2F4F3A';
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(-10, y0);
  for (let j = 0; j < doan; j++) {
    const a = (j / doan) * (w + 20) - 10;
    const b = ((j + 1) / doan) * (w + 20) - 10;
    c.quadraticCurveTo((a + b) / 2, y0 + vong * 2, b, y0);
  }
  c.stroke();
  c.restore();
  const mauDen = ['#E53935', '#F9C74F', '#43A047', '#42A5F5'];
  const buoc = 34 * k;
  for (let x = 10, i = 0; x < w; x += buoc, i++) {
    const tl = ((x + 10) / (w + 20)) * doan;
    const u = tl - Math.floor(tl);
    const y = y0 + vong * 2 * 2 * u * (1 - u) * 0.98 + 4 * k;
    const nhay = chay ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.4 + i * 1.9)) : 0.9;
    const m = mauDen[i % mauDen.length];
    tron(c, x, y + 3 * k, 7 * k, m, nhay * 0.25);
    c.save();
    c.globalAlpha *= nhay;
    hcn(c, x - 2.6 * k, y, 5.2 * k, 7.5 * k, m, 2.6 * k);
    c.restore();
  }
  c.restore();
}

function veTuyetDong(s: S) {
  const { c, w, h, k, kieu, toi } = s;
  // Tuyết đọng ở đáy.
  const cao = (kieu === 'xemThu' ? 10 : 20) * k;
  c.beginPath();
  c.moveTo(0, h);
  c.lineTo(0, h - cao);
  c.bezierCurveTo(w * 0.18, h - cao * 1.9, w * 0.36, h - cao * 0.2, w * 0.55, h - cao * 0.7);
  c.bezierCurveTo(w * 0.72, h - cao * 1.3, w * 0.88, h - cao * 1.6, w, h - cao * 1.2);
  c.lineTo(w, h);
  c.closePath();
  c.fillStyle = toi ? 'rgba(220,232,247,0.55)' : '#FFFFFF';
  c.fill();
  c.strokeStyle = 'rgba(157,189,227,0.6)';
  c.lineWidth = 1;
  c.stroke();
}

// ── Trang trí 4 góc ────────────────────────────────────────────────────────────────────────────

function veGoc(s0: S) {
  const { c, w, h, t, kieu, dinh } = s0;
  const xTrai = 4;
  const xPhai = w - 4;
  // Góc TRÊN: chỉ khi có lề đủ rộng, thu nhỏ cho vừa lề, treo ngay dưới thanh điều hướng.
  const tren = kieu === 'xemThu' || s0.le >= 90;
  const kt = kieu === 'xemThu' ? s0.k : Math.min(s0.k, s0.le / 140);
  const st: S = { ...s0, k: kt };
  const dinhGoc = kieu === 'xemThu' ? dinh : dinh + 6;
  const s = s0;
  const k = s0.k;
  // Góc dưới: nếu nút nổi đẩy trang trí lên quá cao (quá nửa màn) thì bỏ hẳn góc đó — không để nó lơ lửng giữa nội dung.
  const dP = s0.dayPhai, dT = s0.dayTrai;
  const phai = kieu === 'xemThu' || dP >= h * 0.5;
  const trai = kieu === 'xemThu' || dT >= h * 0.5;
  switch (s.mua) {
    case 'xuan':
      if (tren) {
        canhHoaGoc(st, xTrai - 8 * kt, dinhGoc - (kieu === 'xemThu' ? 44 * kt : 10 * kt), false, '#F48FB1', '#C2185B');
        denLong(st, xPhai - 70 * kt, dinhGoc - 4, 30 * kt, 0);
        denLong(st, xPhai - 30 * kt, dinhGoc - 4, 52 * kt, 1.7);
      }
      if (trai) baoLiXi(s, xTrai + 30 * k, dT - 30 * k);
      if (phai) canhHoaGoc(s, xPhai + 8 * k, dP + (dP < s0.day ? -2 : 4) * k, true, '#F7C531', '#C77800', true);
      break;
    case 'ha':
      if (tren) matTroi(st, kieu === 'xemThu' ? xPhai - 56 * kt : w - s0.le / 2, dinhGoc + 40 * kt);
      if (trai) oBaiBien(s, xTrai + 44 * k, dT - 4 * k);
      if (phai) bongBien(s, xPhai - 46 * k, (kieu === 'xemThu' ? h : dP) - 30 * k);
      break;
    case 'thu':
      if (tren) {
        canhHoaGoc(st, xTrai - 8 * kt, dinhGoc - (kieu === 'xemThu' ? 44 * kt : 10 * kt), false, '#F8BBD0', '#D81B60');
        denOngSao(st, xPhai - (kieu === 'xemThu' ? 96 : 40) * kt, dinhGoc - 4, 34 * kt);
      }
      if (trai) dongLa(s, xTrai + 40 * k, dT - 8 * k);
      if (phai) canhPhong(s, xPhai - 20 * k, dP);
      break;
    case 'dong':
      if (trai) cayThong(s, xTrai + 46 * k, dT - 2 * k);
      if (phai) {
        nguoiTuyet(s, xPhai - 96 * k, dP - 4 * k);
        chimCanhCut(s, xPhai - 40 * k, dP - 2 * k);
      }
      if (kieu === 'trang' && tren) net(c, bongTuyet, '#7FA8D8', w - s0.le / 2, dinhGoc + 90 * kt, 30 * kt, t * 0.15, 2, 0.5);
      break;
  }
}

function canhHoaGoc(s: S, gx: number, gy: number, latNgang: boolean, mauHoa: string, mauNhuy: string, huongLen = false) {
  const { c, t, k, chay } = s;
  const lac = chay ? Math.sin(t * 0.9) * 0.02 : 0;
  cum(c, gx, gy, k, lac, () => {
    c.save();
    c.scale(latNgang ? -1 : 1, huongLen ? -1 : 1);
    const than = new Path2D();
    than.moveTo(0, 0); than.bezierCurveTo(50, 6, 96, 54, 150, 58);
    duong(c, than, '#6B4226', 5);
    const nhanh = new Path2D();
    nhanh.moveTo(70, 26); nhanh.quadraticCurveTo(88, 24, 104, 6);
    nhanh.moveTo(112, 50); nhanh.quadraticCurveTo(112, 70, 128, 86);
    duong(c, nhanh, '#6B4226', 3);
    const hoa: [number, number, number][] = [[40, 12, 22], [78, 34, 26], [104, 6, 20], [126, 86, 20], [150, 58, 24], [60, 20, 14], [120, 48, 16]];
    hoa.forEach(([x, y, sz], j) => {
      hoa5(c, mauHoa, x, y, sz, j * 0.7);
      tron(c, x, y, sz * 0.13, mauNhuy);
    });
    tron(c, 92, 40, 3.5, mauHoa);
    tron(c, 138, 70, 3, mauHoa);
    c.restore();
  });
}

function denLong(s: S, nx: number, ny: number, day: number, pha: number) {
  const { c, t, k, chay } = s;
  const xoay = chay ? Math.sin(t * 1.2 + pha) * 0.07 : 0.03;
  cum(c, nx, ny, k, xoay, () => {
    const L = day / k;
    const soi = new Path2D(); soi.moveTo(0, 0); soi.lineTo(0, L);
    duong(c, soi, '#8D6E63', 1.2);
    hcn(c, -8, L, 16, 5, '#E0A800', 1.5);
    const g = c.createRadialGradient(-3, L + 16, 2, -3, L + 16, 22);
    g.addColorStop(0, '#FF5A4E'); g.addColorStop(1, '#C62828');
    c.fillStyle = g;
    c.beginPath(); c.ellipse(0, L + 21, 16, 17, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = 'rgba(158,27,27,0.6)'; c.lineWidth = 1;
    c.beginPath(); c.ellipse(0, L + 21, 8, 17, 0, 0, Math.PI * 2); c.stroke();
    hcn(c, -8, L + 36, 16, 5, '#E0A800', 1.5);
    const tua = new Path2D();
    for (const dx of [-3, 0, 3]) { tua.moveTo(dx, L + 41); tua.lineTo(dx * 1.3, L + 56); }
    duong(c, tua, '#E53935', 1.6);
  });
}

function baoLiXi(s: S, x: number, y: number) {
  const { c, k } = s;
  cum(c, x, y, k, -0.18, () => {
    hcn(c, -15, -21, 30, 42, '#D32F2F', 4);
    c.fillStyle = '#A51C1C';
    c.beginPath();
    c.moveTo(-15, -17); c.quadraticCurveTo(0, -2, 15, -17); c.lineTo(15, -21); c.lineTo(-15, -21); c.closePath();
    c.fill();
    tron(c, 0, 3, 7, '#F5C542');
    c.strokeStyle = '#C62828'; c.lineWidth = 1.2;
    c.beginPath(); c.arc(0, 3, 4.5, 0, Math.PI * 2); c.stroke();
  });
  cum(c, x + 26 * k, y + 6 * k, k * 0.8, 0.22, () => {
    hcn(c, -15, -21, 30, 42, '#E53935', 4);
    tron(c, 0, 3, 7, '#F5C542');
  });
}

function matTroi(s: S, x: number, y: number) {
  const { c, t, k, chay } = s;
  const quay = chay ? t * 0.12 : 0.2;
  cum(c, x, y, k, 0, () => {
    let g = c.createRadialGradient(0, 0, 18, 0, 0, 64);
    g.addColorStop(0, 'rgba(255,213,79,0.55)'); g.addColorStop(1, 'rgba(255,213,79,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, 64, 0, Math.PI * 2); c.fill();
    c.save();
    c.rotate(quay);
    c.fillStyle = 'rgba(255,179,0,0.85)';
    for (let j = 0; j < 12; j++) {
      const a = (j / 12) * Math.PI * 2;
      const r = j % 2 === 0 ? 44 : 38;
      c.beginPath();
      c.moveTo(Math.cos(a - 0.12) * 28, Math.sin(a - 0.12) * 28);
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      c.lineTo(Math.cos(a + 0.12) * 28, Math.sin(a + 0.12) * 28);
      c.closePath();
      c.fill();
    }
    c.restore();
    g = c.createRadialGradient(-6, -6, 2, -6, -6, 30);
    g.addColorStop(0, '#FFF3B0'); g.addColorStop(1, '#FFC107');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, 24, 0, Math.PI * 2); c.fill();
  });
}

function oBaiBien(s: S, x: number, y: number) {
  const { c, k } = s;
  cum(c, x, y, k, 0, () => {
    elip(c, -60, -12, 130, 30, '#F3D9A4');
    const can = new Path2D(); can.moveTo(0, 4); can.lineTo(8, -60);
    duong(c, can, '#8D6E63', 2.4);
    c.save();
    c.rotate(0.12);
    for (let j = 0; j < 4; j++) {
      const a0 = Math.PI + (j * Math.PI) / 4 - 0.12;
      c.fillStyle = j % 2 === 0 ? '#E53935' : '#FFF8E1';
      c.beginPath(); c.moveTo(8, -60); c.arc(8, -60, 40, a0, a0 + Math.PI / 4); c.closePath(); c.fill();
    }
    c.restore();
    to(c, saoBien, '#FF8A50', 40, -2, 16, 0.3);
  });
}

function bongBien(s: S, x: number, y: number) {
  const { c, t, k, chay } = s;
  const nhun = chay ? Math.sin(t * 1.5) * 3 : 0;
  cum(c, x, y + nhun, k, chay ? Math.sin(t * 0.8) * 0.2 : 0, () => {
    const r = 14;
    const mau = ['#E53935', '#FFFFFF', '#1E88E5', '#FFFFFF', '#FDD835', '#FFFFFF'];
    for (let j = 0; j < 6; j++) {
      c.fillStyle = mau[j];
      c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, (j * Math.PI) / 3, ((j + 1) * Math.PI) / 3); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(0,0,0,0.15)'; c.lineWidth = 1;
    c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
  });
}

function denOngSao(s: S, nx: number, ny: number, day: number) {
  const { c, t, k, chay } = s;
  const xoay = chay ? Math.sin(t * 1.1) * 0.08 : 0.04;
  cum(c, nx, ny, k, xoay, () => {
    const L = day / k;
    const soi = new Path2D(); soi.moveTo(0, 0); soi.lineTo(0, L);
    duong(c, soi, '#8D6E63', 1.2);
    const ty = L + 16;
    const g = c.createRadialGradient(0, ty, 6, 0, ty, 28);
    g.addColorStop(0, 'rgba(255,213,79,0.5)'); g.addColorStop(1, 'rgba(255,213,79,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, ty, 28, 0, Math.PI * 2); c.fill();
    to(c, sao, '#F9C846', 0, ty, 34);
    net(c, sao, '#D84315', 0, ty, 34, 0, 1.4);
    tron(c, 0, ty, 4, '#E53935');
    const tua = new Path2D();
    tua.moveTo(-4, L + 30); tua.lineTo(-6, L + 44);
    tua.moveTo(4, L + 30); tua.lineTo(6, L + 44);
    duong(c, tua, '#E53935', 1.6);
  });
}

const LA_DONG: [number, number, number, number, string][] = [
  [-34, -6, 26, -0.6, '#C94A2C'], [-8, -10, 30, 0.2, '#E0662A'], [20, -6, 26, 0.9, '#E8A33A'],
  [-20, -22, 24, -0.2, '#D9572B'], [8, -26, 22, 0.5, '#F0A030'], [40, -4, 20, 1.4, '#C94A2C'],
];
function dongLa(s: S, x: number, y: number) {
  const { c, k } = s;
  cum(c, x, y, k, 0, () => {
    for (const [lx, ly, sz, g, m] of LA_DONG) {
      to(c, laPhong, m, lx, ly, sz, g);
      net(c, ganLa, 'rgba(122,46,18,0.5)', lx, ly, sz, g, 0.8);
    }
  });
}

function canhPhong(s: S, x: number, y: number) {
  const { c, t, k, chay } = s;
  const lac = chay ? Math.sin(t * 0.9 + 1) * 0.03 : 0;
  cum(c, x, y, k, lac, () => {
    const than = new Path2D(); than.moveTo(10, 6); than.quadraticCurveTo(-6, -50, -40, -96);
    duong(c, than, '#6B4226', 3.5);
    const la: [number, number, number, number, string][] = [[-40, -100, 28, -0.4, '#E0662A'], [-18, -62, 24, -1.1, '#C94A2C'], [-8, -34, 22, 0.8, '#E8A33A']];
    for (const [lx, ly, sz, g, m] of la) {
      to(c, laPhong, m, lx, ly, sz, g);
      net(c, ganLa, 'rgba(122,46,18,0.5)', lx, ly, sz, g, 0.8);
    }
  });
}

function cayThong(s: S, x: number, y: number) {
  const { c, t, k, chay } = s;
  cum(c, x, y, k, 0, () => {
    hcn(c, -6, -14, 12, 14, '#6D4C41', 2);
    tamGiac(c, [0, -66], [-42, -14], [42, -14], '#2E7D32');
    tamGiac(c, [0, -88], [-34, -42], [34, -42], '#388E3C');
    tamGiac(c, [0, -108], [-26, -66], [26, -66], '#43A047');
    const qua: [number, number, string][] = [[-18, -22, '#E53935'], [14, -30, '#FDD835'], [-8, -50, '#42A5F5'], [16, -56, '#E53935'], [-6, -78, '#FDD835'], [24, -20, '#42A5F5']];
    qua.forEach(([qx, qy, m], j) => tron(c, qx, qy, 3.6, m, chay ? 0.6 + 0.4 * Math.sin(t * 2 + j * 1.3) : 1));
    const sang = chay ? 0.85 + 0.15 * Math.sin(t * 3) : 1;
    to(c, sao, '#FFD54F', 0, -110, 18 * sang, chay ? Math.sin(t) * 0.1 : 0);
  });
}

function nguoiTuyet(s: S, x: number, y: number) {
  const { c, k } = s;
  cum(c, x, y, k * 0.9, 0, () => {
    const vien = '#9DBDE3';
    c.lineWidth = 1.2; c.strokeStyle = vien;
    elip(c, -18, -34, 36, 34, '#FFFFFF');
    c.beginPath(); c.ellipse(0, -17, 18, 17, 0, 0, Math.PI * 2); c.stroke();
    elip(c, -13, -58, 26, 26, '#FFFFFF');
    c.beginPath(); c.ellipse(0, -45, 13, 13, 0, 0, Math.PI * 2); c.stroke();
    hcn(c, -12, -38, 24, 5, '#2E7D32', 2.5);
    hcn(c, -10, -64, 20, 4, '#263238', 1);
    hcn(c, -6.5, -76, 13, 13, '#263238', 2);
    tron(c, -4.5, -48, 1.6, '#263238');
    tron(c, 4.5, -48, 1.6, '#263238');
    tamGiac(c, [0, -45], [0, -42], [9, -43], '#FB8C00');
    for (const by of [-26, -18, -10]) tron(c, 0, by, 1.6, '#263238');
  });
}

function chimCanhCut(s: S, x: number, y: number) {
  const { c, t, k, chay } = s;
  const lac = chay ? Math.sin(t * 2.2) * 0.07 : 0;
  cum(c, x, y, k, lac, () => {
    const den = '#1F2A36';
    elip(c, -12, -8, 11, 7, '#FB8C00');
    elip(c, 1, -8, 11, 7, '#FB8C00');
    c.save(); c.translate(-19, -34); c.rotate(0.35); elip(c, -4, -12, 8, 26, den); c.restore();
    c.save(); c.translate(19, -34); c.rotate(-0.35 + (chay ? Math.sin(t * 3) * 0.15 : 0)); elip(c, -4, -12, 8, 26, den); c.restore();
    elip(c, -19, -64, 38, 60, den);
    elip(c, -13, -50, 26, 44, '#FAFAFA');
    elip(c, -12, -58, 11, 12, '#FAFAFA');
    elip(c, 1, -58, 11, 12, '#FAFAFA');
    tron(c, -5, -52, 2.2, den);
    tron(c, 5, -52, 2.2, den);
    tron(c, -4.3, -52.8, 0.8, '#FFFFFF');
    tron(c, 5.7, -52.8, 0.8, '#FFFFFF');
    tamGiac(c, [-4, -47], [4, -47], [0, -42], '#FB8C00');
    tron(c, -10, -45, 2.4, '#F48FB1', 0.7);
    tron(c, 10, -45, 2.4, '#F48FB1', 0.7);
    hcn(c, -15, -40, 30, 6, '#E53935', 3);
    hcn(c, 5, -37, 6, 14, '#C62828', 2.5);
    tamGiac(c, [-14, -60], [14, -60], [6, -78], '#E53935');
    hcn(c, -15, -63, 30, 5, '#FFFFFF', 2.5);
    tron(c, 6, -79, 3.4, '#FFFFFF');
  });
}
