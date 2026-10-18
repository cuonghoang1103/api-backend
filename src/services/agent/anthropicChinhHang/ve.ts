/**
 * KHOÁ + VÉ của các model CuongMini cần khoá (18/10/2026).
 *
 * HAI mật khẩu, do admin đặt trên trang admin (không bao giờ nằm trong mã/log):
 *   • KHOÁ CHUNG (`anthropic_chinh_hang_mat_khau` — giữ đúng khoá cũ của cổng
 *     chính hãng 17/10) — mở MỌI model không thuộc nhóm free, trừ Invisible.
 *   • KHOÁ INVISIBLE (`cuongmini_khoa_invisible`) — chỉ mở CuongMini Invisible 5.1.
 *
 * Vé = `ca.<userId>.<phiên bản>.<hạn ms>.<HMAC>` (khoá chung) hoặc
 *      `ci.<…>` (Invisible). Chữ ký trên `<tiền tố>:<nội dung>` ⇒ không dùng
 *      lẫn được. **Sống 48 giờ** rồi tự chết (chủ app chốt); vé có hạn xa hơn
 *      48 giờ (vé 30 ngày đời cũ) bị coi là chết ⇒ người dùng nhập lại một lần.
 *
 * App chỉ giữ MỘT chuỗi (`agentAnthropicVe` / `congAnthropicVe`). Chuỗi đó là
 * một BÓ vé nối bằng `~`: mở khoá xong máy chủ trả bó mới = vé cũ còn sống của
 * loại khác + vé vừa cấp. Nhờ vậy app cũ không phải sửa đường gửi vé.
 *
 * Admin đổi (hoặc tắt) mật khẩu ⇒ phiên bản đổi ⇒ mọi vé cũ của loại đó chết
 * ngay. Không đổi ⇒ nhập lại vẫn vào. Bộ đếm thử sai DÙNG CHUNG với các cổng
 * khác (5 lần sai / 15 phút).
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

import { prisma } from '../../../config/database.js';
import { MoKhoaLoi, dangKhoaThuSai, ghiThuSai, ky, phienBan, xoaThuSai } from '../congDuPhong.js';

export type LoaiVe = 'chung' | 'invisible';

const KHOA_MAT_KHAU: Record<LoaiVe, string> = {
  chung: 'anthropic_chinh_hang_mat_khau',
  invisible: 'cuongmini_khoa_invisible',
};
const TIEN_TO: Record<LoaiVe, string> = { chung: 'ca', invisible: 'ci' };
/** 48 giờ — chủ app chốt 18/10/2026. */
export const HAN_VE_MS = 48 * 60 * 60 * 1000;
/** Lệch đồng hồ cho phép giữa các tiến trình. */
const LECH_MS = 5 * 60 * 1000;
const TRAN_BO = 600;

async function docBam(loai: LoaiVe): Promise<string | null> {
  const row = await prisma.appSetting.findUnique({ where: { key: KHOA_MAT_KHAU[loai] } });
  return row?.value || null;
}

export async function daBatMatKhau(loai: LoaiVe): Promise<boolean> {
  return Boolean(await docBam(loai).catch(() => null));
}
/** Tên cũ (17/10) — khoá chung. */
export async function daBatMatKhauAnthropic(): Promise<boolean> {
  return daBatMatKhau('chung');
}

/** Đặt mật khẩu mới (vé cũ của loại đó chết theo), hoặc `null` để TẮT loại đó với người thường. */
export async function datMatKhau(loai: LoaiVe, matKhau: string | null): Promise<void> {
  const value = matKhau ? await bcrypt.hash(matKhau, 10) : null;
  await prisma.appSetting.upsert({
    where: { key: KHOA_MAT_KHAU[loai] },
    update: { value },
    create: { key: KHOA_MAT_KHAU[loai], value },
  });
}
/** Tên cũ (17/10) — khoá chung. */
export async function datMatKhauAnthropic(matKhau: string | null): Promise<void> {
  return datMatKhau('chung', matKhau);
}

/** Mật khẩu `matKhau` có trùng khoá CÒN LẠI không (admin không được đặt hai khoá giống nhau). */
export async function trungMatKhauKhac(loai: LoaiVe, matKhau: string): Promise<boolean> {
  const bam = await docBam(loai === 'chung' ? 'invisible' : 'chung').catch(() => null);
  return Boolean(bam && (await bcrypt.compare(matKhau, bam)));
}

/** Ký một vé (thuần — test dùng được với `bam` giả). */
export function kyVe(loai: LoaiVe, userId: number, bam: string, now = Date.now()): { ve: string; het: number } {
  const het = now + HAN_VE_MS;
  const noiDung = `${userId}.${phienBan(bam)}.${het}`;
  const tt = TIEN_TO[loai];
  return { ve: `${tt}.${noiDung}.${ky(`${tt}:${noiDung}`)}`, het };
}

/** Một vé có đúng chữ ký, đúng người, còn hạn (≤ 48 giờ) không — CHƯA so phiên bản mật khẩu. */
export function docMotVe(ve: string, userId: number, now = Date.now()): { loai: LoaiVe; pb: string; het: number } | null {
  const phan = ve.split('.');
  if (phan.length !== 5) return null;
  const [tt, uid, pb, hetStr, chuKy] = phan as [string, string, string, string, string];
  const loai = (Object.keys(TIEN_TO) as LoaiVe[]).find((l) => TIEN_TO[l] === tt);
  if (!loai) return null;
  const het = Number(hetStr);
  if (Number(uid) !== userId || !(het > now) || het > now + HAN_VE_MS + LECH_MS) return null;
  const a = Buffer.from(chuKy);
  const b = Buffer.from(ky(`${tt}:${uid}.${pb}.${hetStr}`));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return { loai, pb, het };
}

function tachBo(bo: unknown): string[] {
  if (typeof bo !== 'string' || !bo || bo.length > TRAN_BO) return [];
  return bo.split('~').map((x) => x.trim()).filter(Boolean).slice(0, 4);
}

export interface QuyenVe { chung: boolean; invisible: boolean; hetHan: Partial<Record<LoaiVe, number>> }

/**
 * Bó vé mở được gì cho người này — đối chiếu phiên bản mật khẩu HIỆN HÀNH
 * (admin đổi mật khẩu ⇒ vé cũ chết). `docBamFn` thay được trong test.
 */
export async function docBoVe(
  userId: number,
  bo: unknown,
  docBamFn: (l: LoaiVe) => Promise<string | null> = docBam,
  now = Date.now(),
): Promise<QuyenVe> {
  const ra: QuyenVe = { chung: false, invisible: false, hetHan: {} };
  for (const v of tachBo(bo)) {
    const d = docMotVe(v, userId, now);
    if (!d || ra[d.loai]) continue;
    const bam = await docBamFn(d.loai).catch(() => null);
    if (bam && phienBan(bam) === d.pb) { ra[d.loai] = true; ra.hetHan[d.loai] = d.het; }
  }
  return ra;
}

/** Tên cũ (17/10): vé có mở KHOÁ CHUNG không. */
export async function veAnthropicHopLe(userId: number, ve: unknown): Promise<boolean> {
  return (await docBoVe(userId, ve)).chung;
}

export interface KetQuaMoKhoa {
  /** BÓ vé mới (app thay chuỗi đang giữ bằng chuỗi này). */
  ve: string;
  hetHan: string;
  mo: { chung: boolean; invisible: boolean };
}

/**
 * Nhập mật khẩu. Máy chủ thử CẢ HAI mật khẩu — app không phải biết người dùng
 * đang gõ khoá nào. Khớp loại nào thì cấp vé loại đó (admin đặt trùng ⇒ cả hai).
 *
 * `canMo` (tuỳ chọn): loại khoá model người dùng vừa bấm cần. Mật khẩu đúng
 * nhưng không mở được loại đó ⇒ báo sai cho ĐÚNG model đó (không tính thử sai).
 */
export async function moKhoa(
  userId: number,
  matKhau: string,
  o: { boCu?: unknown; canMo?: LoaiVe } = {},
): Promise<KetQuaMoKhoa> {
  const [bamChung, bamInv] = await Promise.all([docBam('chung'), docBam('invisible')]);
  if (!bamChung && !bamInv) throw new MoKhoaLoi('Quản trị chưa đặt khoá model CuongMini.', 'CHUA_BAT');
  if (o.canMo && !(o.canMo === 'chung' ? bamChung : bamInv)) {
    throw new MoKhoaLoi('Quản trị chưa đặt khoá cho model này.', 'CHUA_BAT');
  }
  const now = Date.now();
  if (dangKhoaThuSai(userId, now)) throw new MoKhoaLoi('Nhập sai quá nhiều lần. Thử lại sau 15 phút.', 'THU_QUA_NHIEU');

  const khop: Record<LoaiVe, boolean> = {
    chung: Boolean(matKhau && bamChung && (await bcrypt.compare(matKhau, bamChung))),
    invisible: Boolean(matKhau && bamInv && (await bcrypt.compare(matKhau, bamInv))),
  };
  if (!khop.chung && !khop.invisible) {
    ghiThuSai(userId, now);
    throw new MoKhoaLoi('Sai khoá.', 'SAI_MAT_KHAU');
  }
  xoaThuSai(userId);
  if (o.canMo && !khop[o.canMo]) {
    throw new MoKhoaLoi(o.canMo === 'invisible'
      ? 'Khoá này không mở được model này — model này có khoá riêng.'
      : 'Khoá này chỉ mở model riêng của nó, không mở model này.', 'SAI_MAT_KHAU');
  }

  /* Giữ vé CÒN SỐNG của loại không vừa nhập. */
  const cu = await docBoVe(userId, o.boCu);
  const bo: string[] = [];
  let het = 0;
  for (const loai of ['chung', 'invisible'] as const) {
    if (khop[loai]) {
      const k = kyVe(loai, userId, (loai === 'chung' ? bamChung : bamInv)!, now);
      bo.push(k.ve);
      het = Math.max(het, k.het);
    } else if (cu[loai]) {
      const v = tachBo(o.boCu).find((x) => docMotVe(x, userId, now)?.loai === loai);
      if (v) bo.push(v);
    }
  }
  return {
    ve: bo.join('~'),
    hetHan: new Date(het).toISOString(),
    mo: { chung: khop.chung || cu.chung, invisible: khop.invisible || cu.invisible },
  };
}

/** Tên cũ (17/10). */
export async function moKhoaAnthropic(userId: number, matKhau: string): Promise<{ ve: string; hetHan: string }> {
  const k = await moKhoa(userId, matKhau);
  return { ve: k.ve, hetHan: k.hetHan };
}
