/**
 * Nghiệp vụ MFA (TOTP) cho admin: thiết lập · bật · xác minh step-up · tắt ·
 * sinh lại mã khôi phục. Route mỏng ở `routes/mfa.routes.ts`.
 *
 * Ghi log bảo mật (bật/tắt/sai mã/dùng mã khôi phục) qua `logger` — KHÔNG
 * BAO GIỜ log mã, secret hay mã khôi phục.
 */
import { prisma } from '../../config/database.js';
import { getRedis } from '../../config/redis.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { base32Decode, base32Encode, kiemTotp, otpauthUri, sinhKhoaTotp } from './totp.js';
import { bamMaKhoiPhuc, chuanHoaMaKhoiPhuc, giaiMaSecret, maHoaSecret, sinhMaKhoiPhuc } from './maHoa.js';
import { cauHinhMfa, hanMfaAt, mfaAtConHieuLuc, type MfaClaims } from './adminMfa.js';

const ISSUER = process.env.MFA_ISSUER?.trim() || 'CuongThai';

// ─── Khoá tạm khi sai mã: 5 lần / 15 phút / user ───────────────────────────
export const SAI_TOI_DA = 5;
export const CUA_SO_SAI_GIAY = 15 * 60;

/** Redis chết thì đếm trong bộ nhớ — vẫn chặn được dò mã trên một tiến trình. */
const saiTrongBoNho = new Map<number, { n: number; het: number }>();

async function demSai(userId: number): Promise<number> {
  try {
    const r = await getRedis();
    const v = await r.get(`mfa:sai:${userId}`);
    return v ? Number(v) : 0;
  } catch {
    const m = saiTrongBoNho.get(userId);
    return m && m.het > Date.now() ? m.n : 0;
  }
}

async function ghiSai(userId: number): Promise<number> {
  try {
    const r = await getRedis();
    const k = `mfa:sai:${userId}`;
    const n = await r.incr(k);
    if (n === 1) await r.expire(k, CUA_SO_SAI_GIAY);
    return n;
  } catch {
    const m = saiTrongBoNho.get(userId);
    const con = m && m.het > Date.now() ? m : { n: 0, het: Date.now() + CUA_SO_SAI_GIAY * 1000 };
    con.n += 1;
    saiTrongBoNho.set(userId, con);
    return con.n;
  }
}

async function xoaSai(userId: number): Promise<void> {
  saiTrongBoNho.delete(userId);
  try {
    const r = await getRedis();
    await r.del(`mfa:sai:${userId}`);
  } catch { /* bộ nhớ đã xoá ở trên */ }
}

async function chanNeuDangKhoa(userId: number): Promise<void> {
  if ((await demSai(userId)) >= SAI_TOI_DA) {
    throw new AppError(
      'Nhập sai mã quá nhiều lần. Thử lại sau 15 phút. / Too many wrong codes. Try again in 15 minutes.',
      429,
      'MFA_LOCKED',
    );
  }
}

async function baoSai(userId: number, viec: string, ip?: string): Promise<never> {
  const n = await ghiSai(userId);
  logger.warn('[mfa] xác minh sai', { userId, viec, ip, lanSai: n });
  if (n >= SAI_TOI_DA) {
    logger.warn('[mfa] khoá tạm vì sai quá nhiều', { userId, ip });
    throw new AppError(
      'Nhập sai mã quá nhiều lần. Thử lại sau 15 phút. / Too many wrong codes. Try again in 15 minutes.',
      429,
      'MFA_LOCKED',
    );
  }
  throw new AppError(
    `Mã không đúng hoặc đã dùng. Còn ${SAI_TOI_DA - n} lần thử. / Invalid or already used code.`,
    400,
    'MFA_INVALID_CODE',
    { attemptsLeft: SAI_TOI_DA - n },
  );
}

// ─── Đọc user ───────────────────────────────────────────────────────────

async function taiUser(userId: number) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      mfaEnabled: true,
      mfaSecret: true,
      mfaRecoveryCodes: true,
      mfaEnabledAt: true,
      mfaLastUsedStep: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
  if (!u) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return u;
}

type UserMfa = Awaited<ReturnType<typeof taiUser>>;

function laAdmin(u: { roles: { role: { name: string } }[] }): boolean {
  return u.roles.some((r) => r.role.name.toUpperCase().replace(/^ROLE_/, '') === 'ADMIN');
}

function khoaCuaUser(u: UserMfa): Buffer {
  if (!u.mfaSecret) throw new AppError('Chưa có khoá MFA. / No MFA secret.', 400, 'MFA_NOT_SET_UP');
  try {
    return base32Decode(giaiMaSecret(u.mfaSecret, u.id));
  } catch (e) {
    // Thường là do đổi MFA_ENCRYPTION_KEY / JWT_SECRET sau khi đã bật MFA.
    logger.error('[mfa] không giải mã được secret — khoá MFA đã đổi?', {
      userId: u.id,
      error: e instanceof Error ? e.message : String(e),
    });
    throw new AppError('Không đọc được khoá MFA trên máy chủ. / Server cannot read the MFA secret.', 500, 'MFA_SECRET_UNREADABLE');
  }
}

/**
 * Kiểm mã TOTP của user và "chiếm" bước đó một cách NGUYÊN TỬ: chỉ cập nhật
 * khi `mfaLastUsedStep` còn nhỏ hơn bước vừa khớp. Hai request cùng một mã
 * chạy song song ⇒ đúng một cái thắng, cái kia thành "đã dùng".
 */
async function kiemVaChiemTotp(u: UserMfa, code: string): Promise<boolean> {
  const step = kiemTotp(khoaCuaUser(u), code, { lastUsedStep: u.mfaLastUsedStep });
  if (step === null) return false;
  const r = await prisma.user.updateMany({
    where: { id: u.id, OR: [{ mfaLastUsedStep: null }, { mfaLastUsedStep: { lt: step } }] },
    data: { mfaLastUsedStep: step },
  });
  return r.count === 1;
}

/** Tiêu một mã khôi phục — nguyên tử bằng `array_remove`. */
async function tieuMaKhoiPhuc(userId: number, ma: string): Promise<boolean> {
  const sach = chuanHoaMaKhoiPhuc(ma);
  if (!/^[a-z2-7]{10}$/.test(sach)) return false;
  const h = bamMaKhoiPhuc(sach);
  const n = await prisma.$executeRaw`
    UPDATE "users"
       SET "mfa_recovery_codes" = array_remove("mfa_recovery_codes", ${h})
     WHERE "id" = ${userId} AND ${h} = ANY("mfa_recovery_codes")`;
  return n === 1;
}

// ─── API nghiệp vụ ───────────────────────────────────────────────────────

export async function trangThai(userId: number, claims: MfaClaims | undefined) {
  const u = await taiUser(userId);
  const ch = cauHinhMfa();
  const hopLe = u.mfaEnabled && mfaAtConHieuLuc(claims?.mfaAt, { enabledAt: u.mfaEnabledAt, ttlHours: ch.ttlHours });
  return {
    isAdmin: laAdmin(u),
    enabled: u.mfaEnabled,
    enabledAt: u.mfaEnabledAt,
    pendingSetup: !u.mfaEnabled && !!u.mfaSecret,
    recoveryCodesRemaining: u.mfaEnabled ? (u.mfaRecoveryCodes?.length ?? 0) : 0,
    stepUp: {
      valid: hopLe,
      expiresAt: hopLe && claims?.mfaAt ? new Date(hanMfaAt(claims.mfaAt, ch.ttlHours) * 1000).toISOString() : null,
    },
    ttlHours: ch.ttlHours,
    enforce: ch.enforce,
  };
}

/** Sinh secret TẠM (chưa bật). Gọi lại thì thay secret tạm cũ. */
export async function batDauThietLap(userId: number, ip?: string) {
  const u = await taiUser(userId);
  if (!laAdmin(u)) throw new AppError('Chỉ tài khoản admin. / Admins only.', 403, 'FORBIDDEN');
  if (u.mfaEnabled) {
    throw new AppError('MFA đang bật — tắt trước khi thiết lập lại. / MFA already enabled.', 409, 'MFA_ALREADY_ENABLED');
  }
  const secret = base32Encode(sinhKhoaTotp());
  await prisma.user.update({
    where: { id: userId },
    data: { mfaSecret: maHoaSecret(secret, userId), mfaLastUsedStep: null, mfaRecoveryCodes: [] },
  });
  logger.info('[mfa] bắt đầu thiết lập', { userId, ip });
  return { secret, otpauthUri: otpauthUri(ISSUER, u.username || u.email, secret), issuer: ISSUER };
}

/** Xác minh mã đầu tiên ⇒ bật MFA + 10 mã khôi phục (trả MỘT lần). */
export async function batMfa(userId: number, code: string, ip?: string) {
  await chanNeuDangKhoa(userId);
  const u = await taiUser(userId);
  if (!laAdmin(u)) throw new AppError('Chỉ tài khoản admin. / Admins only.', 403, 'FORBIDDEN');
  if (u.mfaEnabled) throw new AppError('MFA đã bật. / MFA already enabled.', 409, 'MFA_ALREADY_ENABLED');
  if (!u.mfaSecret) throw new AppError('Hãy tạo khoá trước (bước setup). / Run setup first.', 400, 'MFA_NOT_SET_UP');

  const step = kiemTotp(khoaCuaUser(u), code, { lastUsedStep: u.mfaLastUsedStep });
  if (step === null) return baoSai(userId, 'enable', ip);

  const maKhoiPhuc = sinhMaKhoiPhuc();
  const nowMs = Date.now();
  const mfaAt = Math.floor(nowMs / 1000);
  // Điều kiện mfaSecret = bản vừa đọc: một lần /setup chen giữa thì bật hỏng
  // (không bật nhầm secret người dùng chưa từng quét).
  const r = await prisma.user.updateMany({
    where: { id: userId, mfaEnabled: false, mfaSecret: u.mfaSecret },
    data: {
      mfaEnabled: true,
      // Lưu đúng giây (mili = 0) để `mfaAt >= enabledAt` khớp tuyệt đối.
      mfaEnabledAt: new Date(mfaAt * 1000),
      mfaLastUsedStep: step,
      mfaRecoveryCodes: maKhoiPhuc.map(bamMaKhoiPhuc),
    },
  });
  if (r.count !== 1) throw new AppError('Thiết lập đã thay đổi — làm lại. / Setup changed, retry.', 409, 'MFA_SETUP_CHANGED');
  await xoaSai(userId);
  logger.info('[mfa] ĐÃ BẬT', { userId, ip });
  return { recoveryCodes: maKhoiPhuc, mfaAt };
}

/** Step-up: mã TOTP hoặc mã khôi phục ⇒ `mfaAt` mới để cấp token. */
export async function xacMinh(userId: number, input: { code?: string; recoveryCode?: string }, ip?: string) {
  await chanNeuDangKhoa(userId);
  const u = await taiUser(userId);
  if (!u.mfaEnabled) throw new AppError('MFA chưa bật. / MFA is not enabled.', 400, 'MFA_NOT_ENABLED');

  if (input.recoveryCode) {
    if (!(await tieuMaKhoiPhuc(userId, input.recoveryCode))) return baoSai(userId, 'verify-recovery', ip);
    logger.warn('[mfa] đã dùng một mã khôi phục', { userId, ip, conLai: Math.max(0, (u.mfaRecoveryCodes?.length ?? 1) - 1) });
  } else {
    if (!(await kiemVaChiemTotp(u, String(input.code ?? '')))) return baoSai(userId, 'verify', ip);
    logger.info('[mfa] xác minh step-up thành công', { userId, ip });
  }
  await xoaSai(userId);
  return { mfaAt: Math.floor(Date.now() / 1000), usedRecoveryCode: !!input.recoveryCode };
}

/** Tắt MFA — cần mã TOTP hoặc mã khôi phục hợp lệ. */
export async function tatMfa(userId: number, input: { code?: string; recoveryCode?: string }, ip?: string) {
  await chanNeuDangKhoa(userId);
  const u = await taiUser(userId);
  if (!u.mfaEnabled) throw new AppError('MFA chưa bật. / MFA is not enabled.', 400, 'MFA_NOT_ENABLED');
  const ok = input.recoveryCode
    ? await tieuMaKhoiPhuc(userId, input.recoveryCode)
    : await kiemVaChiemTotp(u, String(input.code ?? ''));
  if (!ok) return baoSai(userId, 'disable', ip);
  await prisma.user.update({
    where: { id: userId },
    data: { mfaEnabled: false, mfaSecret: null, mfaRecoveryCodes: [], mfaEnabledAt: null, mfaLastUsedStep: null },
  });
  await xoaSai(userId);
  logger.warn('[mfa] ĐÃ TẮT', { userId, ip, bang: input.recoveryCode ? 'recovery' : 'totp' });
}

/** Sinh lại 10 mã khôi phục (mã cũ mất hiệu lực) — cần mã TOTP. */
export async function sinhLaiMaKhoiPhuc(userId: number, code: string, ip?: string) {
  await chanNeuDangKhoa(userId);
  const u = await taiUser(userId);
  if (!u.mfaEnabled) throw new AppError('MFA chưa bật. / MFA is not enabled.', 400, 'MFA_NOT_ENABLED');
  if (!(await kiemVaChiemTotp(u, code))) return baoSai(userId, 'recovery-codes', ip);
  const ma = sinhMaKhoiPhuc();
  await prisma.user.update({ where: { id: userId }, data: { mfaRecoveryCodes: ma.map(bamMaKhoiPhuc) } });
  await xoaSai(userId);
  logger.info('[mfa] sinh lại mã khôi phục', { userId, ip });
  return { recoveryCodes: ma };
}
