/**
 * Lặp lại ngắt quãng cho thẻ từ IELTS + lịch ôn Sổ lỗi — HÀM THUẦN (07/10/2026).
 * ─────────────────────────────────────────────────────────────────────────
 * Thẻ từ: SM-2 cải biên với 4 nút Quên / Khó / Nhớ / Dễ (phím 1–4).
 *   - Quên: về lại hàng học trong buổi (hẹn 1 phút), hệ số dễ −0.2, đếm 1 lần quên
 *     nếu thẻ đã từng nhớ.
 *   - Khó / Nhớ / Dễ: khoảng ôn tăng dần; Khó < Nhớ < Dễ ở MỌI trạng thái —
 *     bấm nút "dễ hơn" mà hẹn sớm hơn là lỗi người học thấy ngay.
 * Tách khỏi CSDL để kiểm bằng `srs.test.ts` (chạy trong `npm test`).
 *
 * Ngày tính theo giờ Việt Nam (UTC+7): container chạy UTC, mà "hôm nay" của
 * người học là 0h–24h giờ Việt Nam.
 */

export type Diem = 1 | 2 | 3 | 4;
export type TheSrs = { ease: number; khoang: number; lan: number; quen: number };

export const EASE_MIN = 1.3;
export const EASE_MAX = 3.0;
export const KHOANG_MAX = 365;
const PHUT = 60_000;
const NGAY = 86_400_000;
const VN = 7 * 3_600_000;

export const THE_MOI: TheSrs = { ease: 2.5, khoang: 0, lan: 0, quen: 0 };

const kep = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lam2 = (x: number) => Math.round(x * 100) / 100;

/** Chấm một thẻ: trả trạng thái mới + lúc đến hạn lần sau. */
export function chamThe(cu: TheSrs, diem: Diem, now: Date = new Date()): TheSrs & { hanLuc: Date } {
  let { ease, khoang, lan, quen } = cu;
  if (diem === 1) {
    if (lan > 0 || khoang >= 1) quen += 1;
    return { ease: lam2(kep(ease - 0.2, EASE_MIN, EASE_MAX)), khoang: 0, lan: 0, quen, hanLuc: new Date(now.getTime() + PHUT) };
  }
  // Khoảng cơ sở theo số lần nhớ liên tiếp — giống SM-2: 1 ngày, rồi 3 ngày, rồi × ease.
  const coSo = lan === 0 ? 1 : lan === 1 ? 3 : Math.max(khoang, 1) * ease;
  let moi: number;
  if (diem === 2) {
    moi = lan === 0 ? 1 : Math.max(Math.max(khoang, 1) * 1.2, 1);
    ease -= 0.15;
  } else if (diem === 3) {
    moi = coSo;
  } else {
    moi = lan === 0 ? 4 : coSo * 1.3;
    ease += 0.15;
  }
  // Bảo đảm thứ tự Khó < Nhớ < Dễ kể cả khi ease thấp.
  if (diem === 3) moi = Math.max(moi, (lan === 0 ? 1 : Math.max(khoang, 1) * 1.2) + 1);
  if (diem === 4) moi = Math.max(moi, coSo + 1, (lan === 0 ? 1 : Math.max(khoang, 1) * 1.2) + 2);
  moi = Math.round(kep(moi, 1, KHOANG_MAX));
  return { ease: lam2(kep(ease, EASE_MIN, EASE_MAX)), khoang: moi, lan: lan + 1, quen, hanLuc: new Date(now.getTime() + moi * NGAY) };
}

/** Thẻ đã "thuộc" (Have learned): nhớ ≥ 2 lần liên tiếp và khoảng ôn ≥ 7 ngày. */
export const daThuoc = (t: { lan: number; khoang: number }) => t.lan >= 2 && t.khoang >= 7;

/** 'YYYY-MM-DD' theo giờ Việt Nam. */
export function ngayVN(d: Date = new Date()): string {
  return new Date(d.getTime() + VN).toISOString().slice(0, 10);
}

/** Thời điểm cuối ngày hôm nay (giờ VN) — thẻ hẹn trước lúc này là "đến hạn hôm nay". */
export function cuoiNgayVN(d: Date = new Date()): Date {
  const dau = Date.parse(`${ngayVN(d)}T00:00:00.000Z`) - VN;
  return new Date(dau + NGAY - 1);
}

/** Lùi n ngày từ một khoá ngày 'YYYY-MM-DD'. */
export function luiNgay(ngay: string, n: number): string {
  return new Date(Date.parse(`${ngay}T00:00:00.000Z`) - n * NGAY).toISOString().slice(0, 10);
}

/** Chuỗi ngày học liên tiếp tính tới hôm nay (hôm nay chưa học thì tính tới hôm qua). */
export function chuoiNgay(cacNgay: Iterable<string>, homNay: string): number {
  const co = new Set(cacNgay);
  let d = co.has(homNay) ? homNay : luiNgay(homNay, 1);
  let n = 0;
  while (co.has(d)) { n += 1; d = luiNgay(d, 1); }
  return n;
}

/* ── Sổ lỗi: làm lại có giãn cách ─────────────────────────────────── */

export const ON_LAN_1_NGAY = 2;
export const ON_LAN_2_NGAY = 7;

/** Câu vừa sai (mới hoặc sai lại): chờ ≥ 2 ngày mới được làm lại. */
export function henSoLoiMoi(now: Date = new Date()) {
  return { buoc: 0, daXong: false, hanOn: new Date(now.getTime() + ON_LAN_1_NGAY * NGAY) };
}

/**
 * Kết quả một lần làm lại câu trong Sổ lỗi.
 * Đúng ở bước 0 → hẹn 7 ngày (bước 1); đúng ở bước 1 → vững (bước 2, xong).
 * Sai → về bước 0, hẹn lại 2 ngày.
 */
export function lamLaiSoLoi(buoc: number, dung: boolean, now: Date = new Date()) {
  if (!dung) return { ...henSoLoiMoi(now), saiThem: true };
  if (buoc <= 0) return { buoc: 1, daXong: false, hanOn: new Date(now.getTime() + ON_LAN_2_NGAY * NGAY), saiThem: false };
  return { buoc: 2, daXong: true, hanOn: now, saiThem: false };
}
