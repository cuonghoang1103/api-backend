/**
 * ============================================================
 * HAI MẮT GC9A01 240×240 — port `firmware/src/eyes.cpp`
 * ============================================================
 *
 * Giữ nguyên tên hằng, tên tham số và THỨ TỰ VẼ của bản C, để đặt hai
 * file cạnh nhau soi được từng dòng.
 *
 * ── CHỖ CỐ Ý KHÁC BẢN C ──
 *
 * Bản C vẽ theo **10 dải cao 24 px**, mỗi dải một lần bơm SPI, và giữ
 * ba bản sao của cùng một hình (`hienTai` / `dangVe` / `daVe`). Toàn bộ
 * bộ máy ấy tồn tại vì một khung đầy đủ mất tới 56 ms trải trên nhiều
 * lần gọi `loop()` — vẽ thẳng từ `hienTai` thì dải trên lấy hình lúc
 * t=0 còn dải dưới lấy hình lúc t=56 ms, và con ngươi bị cắt làm đôi
 * theo chiều ngang.
 *
 * Canvas vẽ cả khung trong một lần, đồng bộ. Không có khe thời gian
 * nào để hình bị xé, nên ở đây chỉ còn MỘT bản `hienTai` và không có
 * dải. Bỏ đi bộ máy ba bản sao không làm mất gì về hình ảnh — nó chỉ
 * làm mất một lớp phức tạp không còn lý do tồn tại.
 */

import { Gfx } from './gfx';
import { rgb565, tron565 } from './mau';

// ─── Kích thước & hình học ───────────────────────────────
const W = 240;
const H = 240;
const CX = 120;
const CY = 120;
const R_VIEN_NGOAI = 119; // mép kính
const R_VIEN_TRONG = 98;  // mép trong của vành ống kính
const R_MONG = 68;        // mống mắt lúc bình thường
const R_DONG_TU = 26;     // đồng tử lúc bình thường
const TRUOT_TOI_DA = R_VIEN_TRONG - R_MONG - 8;

// ─── Màu ─────────────────────────────────────────────────
const C_NEN = rgb565(0, 0, 0);
const C_VIEN_TOI = rgb565(18, 22, 30);   // thân ống kính
const C_VIEN_SANG = rgb565(64, 74, 92);  // gờ kim loại bắt sáng
const C_DONG_TU = rgb565(2, 4, 8);
const C_LOE = rgb565(255, 255, 255);

/**
 * Mống mắt: SÁNG Ở RÌA, TỐI VÀO GIỮA — đúng cách ống kính thật bắt
 * sáng. Ngược lại (tối rìa, sáng giữa) trông như đèn pin, không như mắt.
 */
interface Mau { ria: number; giua: number }
const M_XANH: Mau = { ria: rgb565(150, 245, 255), giua: rgb565(0, 60, 130) };
const M_AM: Mau   = { ria: rgb565(255, 214, 130), giua: rgb565(120, 45, 0) };
const M_DO: Mau   = { ria: rgb565(255, 130, 96), giua: rgb565(130, 8, 0) };
const M_HONG: Mau = { ria: rgb565(255, 160, 210), giua: rgb565(140, 0, 70) };
const M_LUC: Mau  = { ria: rgb565(150, 255, 180), giua: rgb565(0, 100, 40) };
const M_XAM: Mau  = { ria: rgb565(150, 160, 175), giua: rgb565(35, 40, 50) };

export enum Dang { D_TRON = 0, D_TIM, D_SAO, D_XOAY, D_NHAM, D_CUOI }

export enum Expr {
  NEUTRAL, HAPPY, SAD, ANGRY, SURPRISED, SLEEPY, LOVE, THINKING, CONFUSED, WINK,
  LISTENING, SPEAKING, SCANNING, CHARGING, BOOTING, ERROR, LOWBAT, OFF,
  CURIOUS, SCARED, DIZZY, SUSPICIOUS, EXCITED, BORED, SHY, PROUD, ANNOYED, SLEEPING,
}

export const TEN_EXPR: string[] = [
  'neutral', 'happy', 'sad', 'angry', 'surprised', 'sleepy', 'love',
  'thinking', 'confused', 'wink', 'listening', 'speaking', 'scanning',
  'charging', 'booting', 'error', 'lowbat', 'off', 'curious', 'scared',
  'dizzy', 'suspicious', 'excited', 'bored', 'shy', 'proud', 'annoyed',
  'sleeping',
];

/**
 * Hình dạng mắt tại một thời điểm.
 *
 * Nghiêng định nghĩa theo TRONG/NGOÀI chứ không theo trái/phải, vì cảm
 * xúc là đối xứng gương: giận thì hai mép TRONG cùng chúi xuống, buồn
 * thì hai mép NGOÀI cùng chúi. Lưu theo trái/phải thì mỗi biểu cảm phải
 * khai hai lần và sai một dấu là mặt méo.
 */
export interface Hinh {
  miTren: number; miDuoi: number;
  nghiengTren: number; nghiengDuoi: number;
  rMong: number; rDongTu: number;
  nhinX: number; nhinY: number;
  mau: Mau;
  dang: Dang;
  sang: number;
}

function hinhMacDinh(): Hinh {
  return {
    miTren: 0.06, miDuoi: 0.04,
    nghiengTren: 0, nghiengDuoi: 0,
    rMong: R_MONG, rDongTu: R_DONG_TU,
    nhinX: 0, nhinY: 0,
    mau: M_XANH, dang: Dang.D_TRON, sang: 1.0,
  };
}

const tien = (a: number, b: number, k: number): number => a + (b - a) * k;

/** Hình đích cho một biểu cảm. `t` = giây kể từ lúc vào biểu cảm đó. */
function hinhCua(e: Expr, t: number, mucAmMuot: number): Hinh {
  const h = hinhMacDinh();
  switch (e) {
    case Expr.NEUTRAL: break;
    case Expr.HAPPY:
      // ⚠️ Mí gần như MỞ HẲN, dù mắt cười trông như đang nheo. Nét cong
      // của D_CUOI CHÍNH LÀ con mắt; đặt mí 0,42 thì mí đen phủ lên đúng
      // nét ấy và mắt vui thành mắt nhắm tịt.
      h.miDuoi = 0.03; h.miTren = 0.03; h.rMong = R_MONG + 6; h.dang = Dang.D_CUOI; break;
    case Expr.SAD:
      h.miTren = 0.34; h.nghiengTren = 0.85; h.nhinY = 0.42;
      h.rMong = R_MONG - 4; h.mau = M_XANH; h.sang = 0.72; break;
    case Expr.ANGRY:
      // Mép TRONG chúi xuống — dấu ÂM. Đây là dấu hiệu duy nhất phân
      // biệt giận với buồn nếu chỉ nhìn mí trên.
      h.miTren = 0.22; h.nghiengTren = -0.95; h.miDuoi = 0.10;
      h.rMong = R_MONG - 8; h.rDongTu = R_DONG_TU - 7; h.mau = M_DO; break;
    case Expr.SURPRISED:
      h.miTren = 0; h.miDuoi = 0; h.rMong = R_MONG + 14; h.rDongTu = R_DONG_TU + 12; break;
    case Expr.SLEEPY:
      h.miTren = 0.60 + 0.06 * Math.sin(t * 1.6); h.miDuoi = 0.14;
      h.nhinY = 0.30; h.rMong = R_MONG - 6; h.sang = 0.55; break;
    case Expr.SLEEPING:
      h.miTren = 0.04; h.miDuoi = 0.04; h.dang = Dang.D_NHAM; h.sang = 0.35; break;
    case Expr.LOVE:
      h.dang = Dang.D_TIM; h.mau = M_HONG;
      h.rMong = R_MONG + 8 + 7 * Math.sin(t * 5.0); h.miTren = 0.02; break;
    case Expr.THINKING:
      h.nhinX = 0.55 * Math.sin(t * 0.9); h.nhinY = -0.45;
      h.miTren = 0.18; h.rMong = R_MONG - 3; break;
    case Expr.CONFUSED:
      h.miTren = 0.24; h.nghiengTren = 0.6; h.nhinX = 0.35; h.rMong = R_MONG - 2; break;
    case Expr.WINK:
      h.miDuoi = 0.03; h.dang = Dang.D_CUOI; break;
    case Expr.LISTENING:
      h.rMong = R_MONG + 8 + 3 * Math.sin(t * 3.2); h.rDongTu = R_DONG_TU + 4;
      h.miTren = 0.02; h.mau = M_LUC; break;
    case Expr.SPEAKING:
      // Đồng tử NẢY theo biên độ tiếng — thứ làm con robot trông như
      // đang thật sự phát ra âm thanh chứ không phải mở loa.
      h.rDongTu = R_DONG_TU + 2 + 16 * mucAmMuot;
      h.rMong = R_MONG + 4 + 5 * mucAmMuot; h.miTren = 0.04; break;
    case Expr.SCANNING:
      h.rMong = R_MONG + 2; h.rDongTu = R_DONG_TU - 10; h.mau = M_LUC; h.miTren = 0; break;
    case Expr.CHARGING:
      h.mau = M_LUC; h.sang = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.2));
      h.miTren = 0.30; h.miDuoi = 0.30; break;
    case Expr.BOOTING: {
      // Mống mở dần như khẩu độ máy ảnh.
      const k = t < 1.2 ? t / 1.2 : 1.0;
      h.rMong = R_MONG * k; h.rDongTu = R_DONG_TU * k;
      h.miTren = 0.5 * (1 - k); h.miDuoi = 0.5 * (1 - k); break;
    }
    case Expr.ERROR:
      h.mau = M_DO; h.rMong = R_MONG - 10; h.rDongTu = R_DONG_TU - 12;
      h.sang = t % 0.5 < 0.25 ? 1.0 : 0.35; break;
    case Expr.LOWBAT:
      h.mau = M_AM; h.sang = 0.30 + 0.25 * (0.5 + 0.5 * Math.sin(t * 1.1));
      h.miTren = 0.42; h.rMong = R_MONG - 10; break;
    case Expr.OFF:
      h.sang = 0; h.miTren = 0.5; h.miDuoi = 0.5; h.rMong = 0; break;
    case Expr.CURIOUS:
      h.miTren = 0.10; h.nghiengTren = -0.35; h.rMong = R_MONG + 6;
      h.nhinX = 0.30 * Math.sin(t * 1.4); break;
    case Expr.SCARED:
      h.miTren = 0; h.miDuoi = 0; h.rMong = R_MONG + 16; h.rDongTu = R_DONG_TU - 12;
      h.nhinX = 0.10 * Math.sin(t * 22.0);  // run
      h.nhinY = 0.06 * Math.sin(t * 27.0); break;
    case Expr.DIZZY:
      h.dang = Dang.D_XOAY; h.mau = M_XAM; h.rMong = R_MONG + 4; break;
    case Expr.SUSPICIOUS:
      h.miTren = 0.40; h.miDuoi = 0.26; h.nghiengTren = -0.30;
      h.nhinX = 0.55; h.rMong = R_MONG - 6; break;
    case Expr.EXCITED:
      h.dang = Dang.D_SAO; h.mau = M_AM; h.rMong = R_MONG + 10; h.miTren = 0; break;
    case Expr.BORED:
      h.miTren = 0.52; h.nhinX = 0.5 * Math.sin(t * 0.35); h.nhinY = 0.25;
      h.rMong = R_MONG - 4; h.sang = 0.7; break;
    case Expr.SHY:
      h.miTren = 0.40; h.nhinY = 0.55; h.nhinX = -0.35; h.mau = M_HONG;
      h.rMong = R_MONG - 2; break;
    case Expr.PROUD:
      h.miDuoi = 0.30; h.miTren = 0.06; h.rMong = R_MONG + 4; h.mau = M_AM; break;
    case Expr.ANNOYED:
      h.miTren = 0.46; h.nghiengTren = -0.55; h.nhinX = 0.42; h.rMong = R_MONG - 6; break;
  }
  return h;
}

/** Nội suy hình. Xem chú thích về `dang` bên dưới — nó KHÔNG nội suy được. */
function tienHinh(a: Hinh, b: Hinh, k: number): void {
  a.miTren = tien(a.miTren, b.miTren, k);
  a.miDuoi = tien(a.miDuoi, b.miDuoi, k);
  a.nghiengTren = tien(a.nghiengTren, b.nghiengTren, k);
  a.nghiengDuoi = tien(a.nghiengDuoi, b.nghiengDuoi, k);
  a.rMong = tien(a.rMong, b.rMong, k);
  a.rDongTu = tien(a.rDongTu, b.rDongTu, k);
  a.nhinX = tien(a.nhinX, b.nhinX, k);
  a.nhinY = tien(a.nhinY, b.nhinY, k);
  a.sang = tien(a.sang, b.sang, k);
  a.mau = { ria: tron565(a.mau.ria, b.mau.ria, k), giua: tron565(a.mau.giua, b.mau.giua, k) };

  // Dạng KHÔNG nội suy được — nửa trái tim nửa hình tròn là hình gì?
  // Nhảy thẳng.
  //
  // ⚠️ Bản C đầu tiên chỉ cho nhảy khi mí đã khép quá 55% ("giấu cú đổi
  // sau một cái chớp"). Ý hay, nhưng những biểu cảm CẦN đổi dạng lại
  // đúng là những cái mở mắt to nhất: EXCITED (ngôi sao) mí = 0, LOVE
  // (trái tim) mí = 0,02. Điều kiện không bao giờ đúng, nên trái tim và
  // ngôi sao KHÔNG BAO GIỜ hiện ra — mà nhìn màn vẫn thấy một con mắt
  // bình thường, không có gì báo là thiếu.
  a.dang = b.dang;
}

/** Chớp: khép NHANH, mở CHẬM hơn. Ngược lại trông như bị giật. */
function heSoChop(troi: number): number {
  const KHEP = 70, GIU = 24, MO = 130;
  if (troi < KHEP) return troi / KHEP;
  if (troi < KHEP + GIU) return 1.0;
  if (troi < KHEP + GIU + MO) return 1.0 - (troi - KHEP - GIU) / MO;
  return -1.0; // xong
}

// ============================================================
// Hình cơ bản
// ============================================================

/** Đĩa đặc. Bản C dựng bằng các đường ngang; canvas có sẵn cung tròn. */
function dia(g: Gfx, cx: number, cy: number, r: number, c: number): void {
  g.fillCircle(cx, cy, r, c);
}

/**
 * Vành khuyên. Phải là VÀNH thật, không phải "đĩa ngoài rồi đĩa trong
 * màu nền" — vành được vẽ ĐÈ lên mống mắt, nên tô ruột bằng màu nền sẽ
 * khoét một lỗ đen vào giữa con mắt.
 */
function vanh(
  g: Gfx, cx: number, cy: number, rNgoai: number, rTrong: number, c: number,
): void {
  if (rNgoai <= 0) return;
  if (rTrong <= 0) return dia(g, cx, cy, rNgoai, c);
  g.fillRing(cx, cy, rNgoai, rTrong, c);
}

/** Trái tim, cho biểu cảm love. */
function traiTim(g: Gfx, cx: number, cy: number, r: number, c: number): void {
  const rr = Math.trunc((r * 55) / 100);
  dia(g, cx - rr + 2, cy - Math.trunc(rr / 2), rr, c);
  dia(g, cx + rr - 2, cy - Math.trunc(rr / 2), rr, c);
  // Mũi nhọn phía dưới, dựng bằng các đường ngang thu hẹp dần.
  const yD = cy + r;
  const yT = cy - Math.trunc(rr / 2);
  for (let y = yT; y <= yD; y++) {
    const k = (y - yT) / (yD - yT + 1);
    const nua = Math.trunc((2 * rr - 2) * (1.0 - k));
    if (nua > 0) g.fillRect(cx - nua, y, 2 * nua + 1, 1, c);
  }
}

/** Ngôi sao 5 cánh, cho biểu cảm excited. */
function ngoiSao(g: Gfx, cx: number, cy: number, r: number, c: number): void {
  const rTrong = r * 0.42;
  let px = 0, py = 0;
  for (let i = 0; i <= 10; i++) {
    const gg = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i & 1 ? rTrong : r;
    const x = cx + Math.trunc(Math.cos(gg) * rr);
    const y = cy + Math.trunc(Math.sin(gg) * rr);
    if (i > 0) g.fillTriangle(cx, cy, px, py, x, y, c);
    px = x; py = y;
  }
}

/** Xoáy ốc, cho biểu cảm dizzy. */
function xoayOc(g: Gfx, cx: number, cy: number, r: number, pha: number, c: number): void {
  let px = cx, py = cy;
  for (let i = 1; i <= 90; i++) {
    const gg = pha + i * 0.28;
    const rr = (r * i) / 90.0;
    const x = cx + Math.trunc(Math.cos(gg) * rr);
    const y = cy + Math.trunc(Math.sin(gg) * rr);
    g.drawLine(px, py, x, y, c);
    g.drawLine(px, py + 1, x, y + 1, c);
    px = x; py = y;
  }
}

/**
 * Mí mắt — một NỬA MẶT PHẲNG cắt theo hình tròn của kính.
 *
 * ⚠️ 0,45 chứ không phải 0,62. Độ dốc càng lớn thì một bên càng bị quét
 * sạch: ở 0,62 thì đầu này của mí chênh đầu kia tới 148 px trên bề ngang
 * 240 — mắt giận biến thành hai mảnh vụn ở góc thay vì một con mắt gườm.
 *
 * Chép nguyên vòng quét từng hàng của bản C thay vì dựng path: dấu và
 * biên của nó đã phải sửa một lần rồi (xem `veMot`), nên chỗ này ưu tiên
 * "soi được từng dòng" hơn là gọn.
 */
function mi(g: Gfx, phan: number, nghieng: number, tren: boolean, c: number): void {
  if (phan <= 0.001) return;
  const doc = nghieng * 0.45; // ~24° ở mức tối đa
  // phan=0 → mép nằm ngoài kính (không che gì), phan=1 → che hết.
  const yMep = tren
    ? CY - R_VIEN_NGOAI + phan * 2 * R_VIEN_NGOAI
    : CY + R_VIEN_NGOAI - phan * 2 * R_VIEN_NGOAI;

  for (let y = CY - R_VIEN_NGOAI; y <= CY + R_VIEN_NGOAI; y++) {
    const dy = y - CY;
    const dxK = Math.trunc(Math.sqrt(R_VIEN_NGOAI * R_VIEN_NGOAI - dy * dy));
    const xT = CX - dxK, xP = CX + dxK;

    let a: number, b: number; // đoạn bị che trên hàng này
    if (Math.abs(doc) < 0.001) {
      const che = tren ? y < yMep : y > yMep;
      if (!che) continue;
      a = xT; b = xP;
    } else {
      const xb = CX + (y - yMep) / doc;
      const phaiCuaBien = tren ? doc > 0 : doc < 0;
      if (phaiCuaBien) {
        a = Math.max(xT, Math.ceil(xb));
        b = xP;
      } else {
        a = xT;
        b = Math.min(xP, Math.floor(xb));
      }
      if (a > b) continue;
    }
    g.fillRect(a, y, b - a + 1, 1, c);
  }
}

// ============================================================
// Vẽ một con mắt
// ============================================================

interface NgoaiCanh {
  bieuCam: Expr;
  wifiOk: boolean;
  serverOk: boolean;
  pinPct: number;
}

function veMot(g: Gfx, h: Hinh, t: number, guong: boolean, nc: NgoaiCanh): void {
  const pha = tron565;
  g.fillScreen(C_NEN);

  // ── 1. Thân ống kính ──
  // Ba vành lồng nhau, sáng dần ra ngoài. Đây là thứ biến cái màn tròn
  // phẳng thành một ỐNG KÍNH có chiều sâu — bỏ nó đi thì mắt trông như
  // hình vẽ trên giấy.
  vanh(g, CX, CY, R_VIEN_NGOAI, R_VIEN_NGOAI - 4, C_VIEN_SANG);
  vanh(g, CX, CY, R_VIEN_NGOAI - 4, R_VIEN_NGOAI - 11, C_VIEN_TOI);
  vanh(g, CX, CY, R_VIEN_NGOAI - 11, R_VIEN_TRONG, pha(C_VIEN_TOI, C_NEN, 0.55));

  if (h.sang > 0.02 && h.rMong > 1) {
    const mx = CX + Math.trunc(h.nhinX * TRUOT_TOI_DA);
    const my = CY + Math.trunc(h.nhinY * TRUOT_TOI_DA * 0.8);
    const rM = Math.trunc(h.rMong);

    const cRia = pha(C_NEN, h.mau.ria, h.sang);
    const cGiua = pha(C_NEN, h.mau.giua, h.sang);

    switch (h.dang) {
      case Dang.D_TIM:
        traiTim(g, mx, my, rM, cRia);
        break;

      case Dang.D_SAO:
        ngoiSao(g, mx, my, rM + 8, cRia);
        break;

      case Dang.D_XOAY:
        dia(g, mx, my, rM, pha(C_NEN, C_VIEN_TOI, 0.8));
        xoayOc(g, mx, my, rM - 2, t * 3.2, cRia);
        break;

      case Dang.D_NHAM:
      case Dang.D_CUOI: {
        // Một nét cong dày thay cho cả con mắt. Cong theo PARABOL chứ
        // không theo cung tròn — parabol dẹt ở giữa, cong nhanh ở hai
        // đầu, giống nét vẽ tay hơn.
        const len = h.dang === Dang.D_CUOI;
        const nua = rM + 12;
        const day = len ? 13 : 9;
        for (let dx = -nua; dx <= nua; dx++) {
          const u = dx / nua;
          const cong = Math.trunc((len ? -1 : 1) * 26 * (u * u - 0.5));
          g.fillRect(mx + dx, my + cong - Math.trunc(day / 2), 1, day, cRia);
        }
        break;
      }

      default: {
        // ── Mống mắt: 14 lớp gradient ──
        // Sáng ở rìa, tối vào giữa. Vẽ từ ngoài vào trong, lớp sau đè
        // lớp trước — rẻ hơn tính khoảng cách từng điểm, và ở 14 lớp thì
        // mắt thường không thấy bậc.
        const LOP = 14;
        for (let i = 0; i < LOP; i++) {
          const k = i / (LOP - 1);
          const r = Math.trunc(rM * (1.0 - k * 0.92));
          dia(g, mx, my, r, pha(cRia, cGiua, k));
        }
        // Vành tối ngoài cùng: tách mống khỏi thân ống kính.
        vanh(g, mx, my, rM, rM - 3, pha(cRia, C_NEN, 0.55));

        // ── Vân toả tia ──
        // ⚠️ RẤT MỜ (0,12) và KHÔNG chạm vào đồng tử. Bản đầu để 0,25 và
        // kéo tia từ sát mép đồng tử ra tới mép mống: ở cỡ thu nhỏ trông
        // ổn, nhưng phóng lên đúng 240 px thì nó thành cái NAN HOA XE
        // ĐẠP — mắt hoá bánh xe. Vân là chất liệu, không phải hoa văn;
        // thấy được nó nghĩa là đã quá tay.
        if (rM > 26) {
          const cVan = pha(cRia, C_LOE, 0.12);
          const r0 = Math.trunc(h.rDongTu) + 4;
          const r1 = rM - 7;
          if (r1 > r0) {
            for (let i = 0; i < 28; i++) {
              const gg = i * ((2 * Math.PI) / 28) + t * 0.12;
              const c_ = Math.cos(gg), s_ = Math.sin(gg);
              g.drawLine(
                mx + Math.trunc(c_ * r0), my + Math.trunc(s_ * r0),
                mx + Math.trunc(c_ * r1), my + Math.trunc(s_ * r1), cVan,
              );
            }
          }
          // Rãnh tối ăn theo vòng: cái làm thấu kính trông có TẦNG, thay
          // vì một mảng màu phẳng dán lên.
          vanh(g, mx, my, rM - 11, rM - 14, pha(cRia, cGiua, 0.55));
        }

        // ── Đồng tử ──
        dia(g, mx, my, Math.trunc(h.rDongTu), C_DONG_TU);

        // ── Đốm loé ──
        // ⚠️ ĐỪNG BỎ HAI CHẤM NÀY. Chúng rẻ nhất trên cả màn hình mà
        // quyết định nhiều nhất: có chúng thì mắt trông ướt và có hồn,
        // không có thì nó là hai cái lỗ đen.
        //
        // Luôn nằm ở TRÊN-TRÁI cho CẢ HAI mắt, không lật gương: nguồn
        // sáng trong phòng là một, nên phản chiếu phải cùng phía. Lật
        // đối xứng là lỗi mắt người bắt được ngay dù không gọi tên được.
        {
          // 0,34 chứ không 0,42: đốm to quá thì nó ăn hết nửa đồng tử và
          // phần đen còn lại trông như bị lệch tâm.
          const rL = Math.max(4, Math.trunc(h.rDongTu * 0.34));
          dia(
            g, mx - Math.trunc(h.rDongTu * 0.42), my - Math.trunc(h.rDongTu * 0.46), rL,
            pha(C_NEN, C_LOE, h.sang),
          );
          // Đốm phụ phải TRẮNG hẳn. Bản đầu để 0,55 nên nó ra màu xám, và
          // xám nằm trên nền mống xanh thì đọc thành một vết bẩn chứ
          // không thành phản chiếu.
          dia(
            g, mx + Math.trunc(rM * 0.40), my + Math.trunc(rM * 0.38), Math.max(3, Math.trunc(rL / 2)),
            pha(C_NEN, C_LOE, h.sang * 0.92),
          );
        }
        break;
      }
    }
  }

  // ── Hiệu ứng riêng của vài trạng thái ──
  if (nc.bieuCam === Expr.SCANNING) {
    // Vạch quét chạy dọc, có vệt mờ phía sau — đúng kiểu máy quét.
    const y = CY - R_VIEN_TRONG + ((t * 190.0) % (2 * R_VIEN_TRONG));
    for (let k = 0; k < 7; k++) {
      const yy = Math.trunc(y) - k;
      const dy = yy - CY;
      if (Math.abs(dy) >= R_VIEN_TRONG) continue;
      const dx = Math.trunc(Math.sqrt(R_VIEN_TRONG * R_VIEN_TRONG - dy * dy));
      g.fillRect(CX - dx, yy, 2 * dx + 1, 1, pha(C_NEN, rgb565(140, 255, 170), 1.0 - k * 0.14));
    }
  } else if (nc.bieuCam === Expr.ERROR) {
    // Nhiễu sọc. KHÔNG dùng số ngẫu nhiên, để hai mắt nhiễu GIỐNG NHAU —
    // hai kiểu nhiễu khác nhau trông như một màn hỏng chứ không như một
    // lỗi hệ thống.
    for (let k = 0; k < 3; k++) {
      const yy = (t * 300 + k * 79) % H;
      g.fillRect(0, Math.trunc(yy), W, 1, pha(C_NEN, rgb565(255, 60, 40), 0.75));
    }
  }

  // ── 2. Mí mắt — vẽ SAU CÙNG vì nó che mọi thứ ──
  //
  // ⚠️ DẤU Ở ĐÂY TỪNG NGƯỢC, và ngược theo kiểu khó thấy nhất: mặt vẫn
  // có biểu cảm, chỉ là SAI biểu cảm. Giận thì hai mép NGOÀI chúi xuống
  // (thành ra trông buồn ngơ ngác), buồn thì hai mép TRONG chúi xuống
  // (trông như đang gườm).
  //
  // Quy ước: `nghieng` dương = mép NGOÀI đi xuống. Mắt TRÁI có mép ngoài
  // ở bên trái màn (x nhỏ) → cần độ dốc ÂM. Vì vậy mắt TRÁI mới là cái
  // bị đảo dấu, chứ không phải mắt phải.
  const ngT = guong ? h.nghiengTren : -h.nghiengTren;
  const ngD = guong ? h.nghiengDuoi : -h.nghiengDuoi;
  mi(g, h.miTren, ngT, true, C_NEN);
  mi(g, h.miDuoi, ngD, false, C_NEN);

  // ── 3. Chỉ báo trạng thái ở rìa dưới ──
  // Đặt trên VÀNH ống kính chứ không đè lên mống: nó là thông tin phụ,
  // không được tranh chỗ với biểu cảm.
  if (!guong) {
    // Mắt trái: hai chấm WiFi / server.
    dia(g, CX - 13, CY + 108, 4, nc.wifiOk ? rgb565(0, 210, 90) : rgb565(150, 30, 20));
    dia(g, CX + 13, CY + 108, 4, nc.serverOk ? rgb565(0, 210, 90) : rgb565(150, 30, 20));
  } else if (nc.pinPct >= 0) {
    // Mắt phải: cung pin chạy theo rìa dưới. Màu chở thông tin — liếc
    // một cái là biết, khỏi đọc số.
    const c = nc.pinPct > 50 ? rgb565(0, 210, 90) : nc.pinPct > 20 ? rgb565(255, 170, 0) : rgb565(230, 40, 30);
    const n = 1 + Math.trunc((nc.pinPct * 11) / 100);
    for (let i = 0; i < n; i++) {
      const gg = Math.PI * (0.30 + (0.40 * i) / 11.0);
      dia(g, CX - Math.trunc(Math.cos(gg) * 108), CY + Math.trunc(Math.sin(gg) * 108), 3, c);
    }
  }
}

// ============================================================
// Điều khiển hai mắt
// ============================================================

const nn = (): number => Math.floor(Math.random() * 0x7fffffff);

export class HaiMat {
  private gT: Gfx;
  private gP: Gfx;

  private bieuCam = Expr.BOOTING;
  private bieuCamNen = Expr.NEUTRAL;
  private hetHanLuc = 0;
  private phaBatDau = 0;

  private hT: Hinh = hinhMacDinh();
  private hP: Hinh = hinhMacDinh();

  private nhinX = 0; private nhinY = 0;
  private nhinDichX = 0; private nhinDichY = 0;
  private liecX = 0; private liecY = 0;
  private liecTiepLuc = 0;

  private dangChop = false;
  private chopBatDau = 0;
  private chopConLai = 0;
  private chopTiepLuc = 0;

  /** Mắt nháy riêng: -1 không ai, 0 mắt trái, 1 mắt phải. */
  private nhamRieng = -1;
  private nhamRiengToi = 0;

  private mucAm = 0;
  private mucAmMuot = 0;

  private wifiOk = false;
  private serverOk = false;
  private pinPct = -1;

  constructor(ctxTrai: CanvasRenderingContext2D, ctxPhai: CanvasRenderingContext2D) {
    this.gT = new Gfx(ctxTrai, W, H);
    this.gP = new Gfx(ctxPhai, W, H);
    const now = performance.now();
    this.phaBatDau = now;
    this.henChopTiep(now);
    this.henLiecTiep(now);
  }

  private henChopTiep(now: number): void {
    this.chopTiepLuc = now + 2400 + (nn() % 3800);
  }

  private henLiecTiep(now: number): void {
    this.liecTiepLuc = now + 700 + (nn() % 2600);
    // Liếc VI MÔ — biên độ 0,07 và 0,05, tức vài pixel. Mắt đứng tuyệt
    // đối yên đọc thành "đơ", còn liếc rộng đọc thành "lơ đãng".
    this.liecX = (((nn() % 200) - 100) / 100.0) * 0.07;
    this.liecY = (((nn() % 200) - 100) / 100.0) * 0.05;
  }

  // ─── API ─────────────────────────────────────────────────

  set(e: Expr, ms = 0): void {
    if (ms === 0) this.bieuCamNen = e;
    this.bieuCam = e;
    this.hetHanLuc = ms ? performance.now() + ms : 0;
    this.phaBatDau = performance.now();
  }

  setByName(name: string, ms = 0): boolean {
    const i = TEN_EXPR.indexOf(name);
    if (i < 0) return false;
    this.set(i as Expr, ms);
    return true;
  }

  look(x: number, y: number): void {
    this.nhinDichX = Math.max(-1, Math.min(1, x));
    this.nhinDichY = Math.max(-1, Math.min(1, y));
  }

  /** Nháy MỘT mắt. `matTrai = true` → mắt trái nhắm. */
  wink(matTrai = true): void {
    this.nhamRieng = matTrai ? 0 : 1;
    this.nhamRiengToi = performance.now() + 420;
  }

  /**
   * Biên độ tiếng đang phát, để đồng tử nảy theo.
   *
   * Nhận mức THÔ như firmware (0..~30000), rồi tự nén log — nén ở đây
   * chứ không ở chỗ gọi, để chỗ gọi chỉ việc đưa số đo được.
   */
  setLevel(mucAm: number): void {
    this.mucAm = mucAm;
  }

  setStatus(w: boolean, s: boolean): void {
    this.wifiOk = w;
    this.serverOk = s;
  }

  setBattery(pct: number): void {
    this.pinPct = pct;
  }

  current(): Expr {
    return this.bieuCam;
  }

  // ─── Vòng cập nhật ───────────────────────────────────────

  loop(now = performance.now()): void {
    const t = (now - this.phaBatDau) / 1000.0;

    if (this.hetHanLuc && now > this.hetHanLuc) {
      this.hetHanLuc = 0;
      this.set(this.bieuCamNen, 0);
      return;
    }

    // Nén log: tiếng nói trải rộng hàng chục lần về biên độ, nén tuyến
    // tính thì đồng tử chỉ nảy ở mấy đỉnh to nhất rồi đứng im.
    // Lên NHANH (0,55) xuống CHẬM (0,14): giống cách cơ thật giãn ra.
    {
      const m = this.mucAm <= 0 ? 0 : Math.min(1.0, Math.log(1.0 + this.mucAm / 4000.0) / 4.8);
      this.mucAmMuot = m > this.mucAmMuot
        ? tien(this.mucAmMuot, m, 0.55)
        : tien(this.mucAmMuot, m, 0.14);
    }

    if (now > this.liecTiepLuc) this.henLiecTiep(now);

    if (
      !this.dangChop && this.chopConLai === 0 && now > this.chopTiepLuc &&
      this.bieuCam !== Expr.SLEEPING && this.bieuCam !== Expr.OFF && this.bieuCam !== Expr.BOOTING
    ) {
      this.chopConLai = nn() % 7 === 0 ? 2 : 1; // thi thoảng chớp đúp
      this.henChopTiep(now);
    }
    if (!this.dangChop && this.chopConLai > 0) {
      this.dangChop = true;
      this.chopBatDau = now;
    }

    let pheChop = 0;
    if (this.dangChop) {
      const k = heSoChop(now - this.chopBatDau);
      if (k < 0) {
        this.dangChop = false;
        if (this.chopConLai) this.chopConLai--;
      } else {
        pheChop = k;
      }
    }

    if (this.nhamRieng >= 0 && now > this.nhamRiengToi) this.nhamRieng = -1;

    this.nhinX = tien(this.nhinX, this.nhinDichX, 0.18);
    this.nhinY = tien(this.nhinY, this.nhinDichY, 0.18);

    const dich = hinhCua(this.bieuCam, t, this.mucAmMuot);
    dich.nhinX = Math.max(-1, Math.min(1, dich.nhinX + this.nhinX + this.liecX));
    dich.nhinY = Math.max(-1, Math.min(1, dich.nhinY + this.nhinY + this.liecY));

    // Nói và nghe đổi hình NHANH hơn (0,42): con ngươi phải bám kịp
    // biên độ tiếng, chậm hơn thì nó nảy trễ và trông như lồng tiếng.
    const k = this.bieuCam === Expr.SPEAKING || this.bieuCam === Expr.LISTENING ? 0.42 : 0.22;

    const lo = (h: Hinh, nhamCaiNay: boolean): Hinh => {
      const d: Hinh = { ...dich, mau: { ...dich.mau } };
      if (nhamCaiNay) {
        d.dang = Dang.D_NHAM;
        d.miTren = 0.04;
        d.miDuoi = 0.04;
      } else if (pheChop > 0) {
        d.miTren = d.miTren + (0.52 - d.miTren) * pheChop;
        d.miDuoi = d.miDuoi + (0.50 - d.miDuoi) * pheChop;
        if (pheChop > 0.6) d.rMong = d.rMong * (1.0 - (pheChop - 0.6) * 0.5);
      }
      tienHinh(h, d, k);
      return h;
    };

    lo(this.hT, this.nhamRieng === 0);
    lo(this.hP, this.nhamRieng === 1);

    const nc: NgoaiCanh = {
      bieuCam: this.bieuCam,
      wifiOk: this.wifiOk,
      serverOk: this.serverOk,
      pinPct: this.pinPct,
    };
    veMot(this.gT, this.hT, t, false, nc);
    veMot(this.gP, this.hP, t, true, nc);
  }
}
