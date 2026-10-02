/**
 * ============================================================
 * KEY GIA HẠN HẠN MỨC AI CODE (02/10/2026)
 * ============================================================
 *
 * Chủ web: khi bị chặn *"Bạn đã dùng hết hạn mức agent trong 5 giờ qua (4/4
 * triệu token)…"* thì cho nhập một KEY (admin đặt) để làm tiếp — *"khi làm hết
 * limit của nhập key thì nhập lại đúng key đó tiếp sẽ dùng tiếp… trừ khi tôi
 * đổi key trong admin thì key cũ không nhập được nữa"*.
 *
 * Khuôn giống cổng dự phòng (`congDuPhong.ts`), nhưng KHÁC khoá `app_settings`
 * và khác bản chất: cổng dự phòng phát VÉ (ký HMAC), còn key này GHI MỘT LẦN
 * CẤP vào bảng `agent_quota_grants`. Ba luật:
 *
 *  1. Nhập đúng key ⇒ +`soTokenMoiLan` vào trần token của cửa sổ TRƯỢT (cùng
 *     số giờ với `quota.ts`). Lần cấp trôi ra khỏi cửa sổ thì hết tính, đúng
 *     như token đã tiêu trôi ra. Nhập lại bao nhiêu lần cũng được.
 *  2. Mỗi lần cấp mang `phienBan` của key lúc đó. Admin đổi/tắt key ⇒
 *     `phienBan` tăng ⇒ key cũ sai VÀ mọi lần cấp cũ thôi tính NGAY.
 *  3. ⛔ KHÔNG nới trần TIỀN (`viTien.ts`, `tranTienNgay`, cầu dao site). Key chỉ
 *     nới trần TOKEN. Trần tiền là lưới bảo vệ ví của chủ web — một key lộ ra
 *     ngoài cũng không đốt được quá con số đó.
 */
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database.js';

const KHOA_CAU_HINH = 'agent_key_gia_han';
export const MAC_DINH_SO_TOKEN = 4_000_000;
/** Trần trên cho `soTokenMoiLan` — chặn admin gõ thừa ba số 0. */
export const TRAN_SO_TOKEN = 100_000_000;

export interface CauHinhKeyGiaHan {
  /** bcrypt của key. null = đang TẮT. */
  bam: string | null;
  /** Tăng mỗi lần đặt/đổi/tắt key. Lần cấp mang số khác ⇒ thôi tính. */
  phienBan: number;
  soTokenMoiLan: number;
}

export interface LanCap {
  soToken: number;
  phienBan: number;
  createdAt: Date;
}

/** Chỗ lưu — tách ra để kiểm thử chạy không cần Postgres. */
export interface KhoGiaHan {
  docCauHinh(): Promise<CauHinhKeyGiaHan>;
  ghiCauHinh(c: CauHinhKeyGiaHan): Promise<void>;
  themLanCap(userId: number, soToken: number, phienBan: number, luc: Date): Promise<void>;
  dsLanCap(userId: number, tu: Date): Promise<LanCap[]>;
}

const MAC_DINH: CauHinhKeyGiaHan = { bam: null, phienBan: 0, soTokenMoiLan: MAC_DINH_SO_TOKEN };

/** Đọc cấu hình phòng thủ: JSON hỏng/thiếu trường ⇒ coi như TẮT, không ném. */
export function docJsonCauHinh(raw: string | null | undefined): CauHinhKeyGiaHan {
  if (!raw) return { ...MAC_DINH };
  try {
    const v = JSON.parse(raw) as Partial<CauHinhKeyGiaHan>;
    const so = Number(v.soTokenMoiLan);
    return {
      bam: typeof v.bam === 'string' && v.bam ? v.bam : null,
      phienBan: Number.isInteger(v.phienBan) && (v.phienBan as number) >= 0 ? (v.phienBan as number) : 0,
      soTokenMoiLan: Number.isFinite(so) && so > 0 ? Math.min(TRAN_SO_TOKEN, Math.round(so)) : MAC_DINH_SO_TOKEN,
    };
  } catch {
    return { ...MAC_DINH };
  }
}

export const khoPrisma: KhoGiaHan = {
  async docCauHinh() {
    const row = await prisma.appSetting.findUnique({ where: { key: KHOA_CAU_HINH } });
    return docJsonCauHinh(row?.value);
  },
  async ghiCauHinh(c) {
    const value = JSON.stringify(c);
    await prisma.appSetting.upsert({
      where: { key: KHOA_CAU_HINH },
      update: { value },
      create: { key: KHOA_CAU_HINH, value },
    });
  },
  async themLanCap(userId, soToken, phienBan, luc) {
    await prisma.agentQuotaGrant.create({ data: { userId, soToken, phienBan, createdAt: luc } });
  },
  async dsLanCap(userId, tu) {
    return prisma.agentQuotaGrant.findMany({
      where: { userId, createdAt: { gte: tu } },
      select: { soToken: true, phienBan: true, createdAt: true },
    });
  },
};

/**
 * Tổng token gia hạn CÒN HIỆU LỰC: trong cửa sổ trượt VÀ đúng phiên bản key
 * hiện hành. Hàm thuần — mọi luật tính nằm ở đây.
 */
export function tongGiaHan(ds: LanCap[], phienBanHienTai: number, now: number, soGio: number): number {
  const tu = now - soGio * 3_600_000;
  let tong = 0;
  for (const c of ds) {
    if (c.phienBan !== phienBanHienTai) continue;
    const t = c.createdAt.getTime();
    if (t < tu || t > now) continue;
    tong += c.soToken;
  }
  return tong;
}

/**
 * Token gia hạn đang cộng vào trần của người này. Key đang TẮT ⇒ 0 (tắt cũng
 * tăng phiên bản, nên hai điều kiện trùng nhau — kiểm cả hai cho chắc).
 */
export async function tokenGiaHan(
  userId: number, soGio: number, kho: KhoGiaHan = khoPrisma, now = Date.now(),
): Promise<number> {
  const ch = await kho.docCauHinh();
  if (!ch.bam) return 0;
  const ds = await kho.dsLanCap(userId, new Date(now - soGio * 3_600_000));
  return tongGiaHan(ds, ch.phienBan, now, soGio);
}

export async function coKeyGiaHan(kho: KhoGiaHan = khoPrisma): Promise<boolean> {
  try {
    return Boolean((await kho.docCauHinh()).bam);
  } catch {
    return false;
  }
}

/** Trạng thái cho trang admin — KHÔNG trả bam. */
export async function trangThaiKeyGiaHan(kho: KhoGiaHan = khoPrisma): Promise<{
  daBat: boolean; phienBan: number; soTokenMoiLan: number;
}> {
  const ch = await kho.docCauHinh();
  return { daBat: Boolean(ch.bam), phienBan: ch.phienBan, soTokenMoiLan: ch.soTokenMoiLan };
}

/**
 * Admin đặt/đổi (`key: string`), TẮT (`key: null`), hoặc chỉ đổi số token mỗi
 * lần (`key` bỏ trống). Đặt/đổi/tắt đều tăng `phienBan` ⇒ key cũ chết và mọi
 * lần cấp cũ thôi tính. Chỉ đổi `soTokenMoiLan` thì KHÔNG tăng — lần cấp đã
 * có giữ nguyên số đã cấp, lần sau mới theo số mới.
 */
export async function datKeyGiaHan(
  o: { key?: string | null; soTokenMoiLan?: number },
  kho: KhoGiaHan = khoPrisma,
): Promise<void> {
  const cu = await kho.docCauHinh();
  const moi: CauHinhKeyGiaHan = { ...cu };
  if (o.key !== undefined) {
    moi.bam = o.key ? await bcrypt.hash(o.key, 10) : null;
    moi.phienBan = cu.phienBan + 1;
  }
  if (o.soTokenMoiLan !== undefined) {
    const so = Math.round(o.soTokenMoiLan);
    if (!(so > 0) || so > TRAN_SO_TOKEN) throw new Error('soTokenMoiLan không hợp lệ');
    moi.soTokenMoiLan = so;
  }
  await kho.ghiCauHinh(moi);
}

// ─── Người dùng nhập key ─────────────────────────────────────────────

export class KeyGiaHanLoi extends Error {
  constructor(message: string, public readonly code: 'KEY_GIA_HAN_CHUA_BAT' | 'KEY_GIA_HAN_SAI' | 'KEY_GIA_HAN_THU_QUA_NHIEU') {
    super(message);
  }
}

/**
 * Chống dò key: 5 lần sai trong 15 phút ⇒ khoá người đó 15 phút (giống cổng
 * dự phòng). Route còn một rate-limit theo người phía trước nữa.
 */
const lanSai = new Map<number, { dem: number; tu: number }>();
const CUA_SO_SAI_MS = 15 * 60 * 1000;
const SAI_TOI_DA = 5;

/** Chỉ cho kiểm thử. */
export function xoaDemSaiKeyGiaHan(): void {
  lanSai.clear();
}

/**
 * Nhập key. Đúng ⇒ ghi một lần cấp với phiên bản hiện hành, trả số token vừa
 * cộng. Sai ⇒ ném `KeyGiaHanLoi` (route dịch ra mã HTTP).
 */
export async function nhapKeyGiaHan(
  userId: number, key: string, kho: KhoGiaHan = khoPrisma, now = Date.now(),
): Promise<{ soToken: number }> {
  const ch = await kho.docCauHinh();
  if (!ch.bam) throw new KeyGiaHanLoi('Quản trị chưa bật key gia hạn.', 'KEY_GIA_HAN_CHUA_BAT');

  const sai = lanSai.get(userId);
  if (sai && now - sai.tu < CUA_SO_SAI_MS && sai.dem >= SAI_TOI_DA) {
    throw new KeyGiaHanLoi('Nhập sai quá nhiều lần. Thử lại sau 15 phút.', 'KEY_GIA_HAN_THU_QUA_NHIEU');
  }

  if (!key || key.length > 200 || !(await bcrypt.compare(key, ch.bam))) {
    const moi = sai && now - sai.tu < CUA_SO_SAI_MS ? { dem: sai.dem + 1, tu: sai.tu } : { dem: 1, tu: now };
    lanSai.set(userId, moi);
    throw new KeyGiaHanLoi('Key không đúng, hoặc đã bị quản trị đổi.', 'KEY_GIA_HAN_SAI');
  }
  lanSai.delete(userId);

  await kho.themLanCap(userId, ch.soTokenMoiLan, ch.phienBan, new Date(now));
  return { soToken: ch.soTokenMoiLan };
}
