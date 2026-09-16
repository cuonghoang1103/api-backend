/**
 * Pro membership service.
 * ─────────────────────────────────────────────────────────────────────────
 * "Pro" is an account-wide entitlement stored as flags on the User row
 * (mirroring the existing `musicAccess` precedent). It unlocks: the music page
 * (permanently), the AI chat Pro/Max models, Interview AI grading, and full
 * Academy access — see the gating call-sites (canAccessMusic, resolveEngineMode,
 * streamChat, assertCanAccessCourseContent).
 *
 * Admins are ALWAYS effectively Pro (highest tier), no code needed. Pro is
 * obtained three ways, recorded in `proSource`:
 *   CODE     — user redeems a ProCode an admin created
 *   ADMIN    — an admin grants it directly
 *   PURCHASE — user bought a ProPlan (ví điểm / PayOS / chuyển khoản),
 *              see billing.service.ts. Added 13/09/2026.
 *
 * `proExpiresAt = null` while `isPro = true` means a LIFETIME membership.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

const ADMIN_RE = /^(role_)?(admin|superadmin)$/i;
export function isAdminRoles(roles?: string[] | null): boolean {
  return Array.isArray(roles) && roles.some((r) => ADMIN_RE.test(String(r)));
}

export interface ProStatus {
  isAdmin: boolean;
  isPro: boolean; // raw flag on the row
  effective: boolean; // admin OR (isPro && not expired) — the real gate
  lifetime: boolean;
  expiresAt: string | null;
  source: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

async function loadUserPro(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      isPro: true,
      proExpiresAt: true,
      proSince: true,
      proSource: true,
      roles: { select: { role: { select: { name: true } } } },
    },
  });
}

function proActive(isPro: boolean, expiresAt: Date | null): boolean {
  return isPro && (!expiresAt || expiresAt > new Date());
}

/** Full status for the /pro page + admin. */
export async function getProStatus(userId?: number | null): Promise<ProStatus> {
  const empty: ProStatus = { isAdmin: false, isPro: false, effective: false, lifetime: false, expiresAt: null, source: null };
  if (!userId) return empty;
  const u = await loadUserPro(userId);
  if (!u) return empty;
  const isAdmin = isAdminRoles(u.roles.map((r) => r.role.name));
  const active = proActive(u.isPro, u.proExpiresAt);
  const effective = isAdmin || active;
  return {
    isAdmin,
    isPro: u.isPro,
    effective,
    lifetime: isAdmin ? true : active ? !u.proExpiresAt : false,
    expiresAt: u.proExpiresAt ? u.proExpiresAt.toISOString() : null,
    source: isAdmin ? 'ADMIN' : u.proSource,
  };
}

/**
 * Câu báo khi một cổng Pro từ chối.
 *
 * Người CHƯA TỪNG có Pro và người VỪA HẾT HẠN cần nghe hai câu khác nhau:
 * câu "đây là tính năng Pro" nói với người vừa hết hạn là sai chuyện — họ đã
 * trả tiền rồi, thứ họ cần biết là hạn đã hết từ bao giờ và làm gì tiếp.
 * Trước 16/09/2026 mọi cổng đều dùng chung một câu nên không phân biệt được.
 *
 * Truyền `cauMacDinh` là câu riêng của từng tính năng — nó vẫn được dùng cho
 * người chưa từng có Pro.
 */
export async function cauChanPro(userId: number | null | undefined, cauMacDinh: string): Promise<string> {
  if (!userId) return cauMacDinh;
  const u = await loadUserPro(userId).catch(() => null);
  if (!u) return cauMacDinh;
  // Hết hạn = từng bật Pro, có mốc hết hạn, và mốc đó đã qua.
  if (u.isPro && u.proExpiresAt && u.proExpiresAt <= new Date()) {
    const d = u.proExpiresAt;
    const ngay = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    return `Gói Pro của bạn đã hết hạn ngày ${ngay}. Vui lòng gia hạn hoặc nhắn tin cho admin để được cấp lại.`;
  }
  return cauMacDinh;
}

/** Fast boolean gate used by feature checks (admin OR valid Pro). One query. */
export async function isProEffective(userId?: number | null): Promise<boolean> {
  if (!userId) return false;
  const u = await loadUserPro(userId);
  if (!u) return false;
  if (isAdminRoles(u.roles.map((r) => r.role.name))) return true;
  return proActive(u.isPro, u.proExpiresAt);
}

/**
 * Người này có phải admin không.
 *
 * `isProEffective` cũng trả true cho admin, nhưng nó trộn hai câu hỏi khác
 * nhau ("có quyền Pro không" và "có phải admin không") vào một hàm. Chỗ nào
 * cần phân biệt rõ — như trần token — phải hỏi đúng câu.
 */
export async function laAdmin(userId?: number | null): Promise<boolean> {
  if (!userId) return false;
  const u = await loadUserPro(userId);
  if (!u) return false;
  return isAdminRoles(u.roles.map((r) => r.role.name));
}

/** Whether a given user id is effectively Pro — for public profile badges.
 *  (Same as isProEffective but named for the display use-case.) */
export const isProForDisplay = isProEffective;

/**
 * Grant/extend Pro on a user. `durationDays = null` → lifetime. Extending a
 * time-limited membership adds days onto the later of now / current expiry; a
 * lifetime membership stays lifetime.
 */
/**
 * Cấp Pro.
 *
 * `cheDo` quyết định cách tính hạn mới, và hai chế độ KHÁC NHAU về bản chất:
 *
 * - `'congDon'` (mặc định, giữ nguyên hành vi cũ): cộng thêm vào hạn đang có.
 *   Đây là điều đúng cho MUA HÀNG và ĐỔI MÃ — người ta trả tiền lần hai thì
 *   phải được cộng, không phải bị đặt lại. Đang vĩnh viễn thì giữ vĩnh viễn:
 *   cộng thêm vào vô hạn là vô nghĩa, mà hạ xuống hữu hạn là cướp mất quyền
 *   họ đang có.
 *
 * - `'thayThe'` (16/09/2026, chỉ admin dùng): ĐẶT LẠI hạn kể từ bây giờ, kể cả
 *   khi người đó đang vĩnh viễn. Đây là thứ cần cho việc "đổi gói" — hạ một
 *   người từ vĩnh viễn xuống 30 ngày, hay nâng từ 30 ngày lên vĩnh viễn.
 *   Trước khi có nó, cấp 30 ngày cho người đang vĩnh viễn chạy XONG mà không
 *   đổi gì cả: lệnh báo thành công, trạng thái vẫn vĩnh viễn, và không có lỗi
 *   nào để thấy.
 */
export async function grantProToUser(
  userId: number,
  durationDays: number | null,
  source: 'CODE' | 'ADMIN' | 'PURCHASE' | 'APPLE_IAP',
  cheDo: 'congDon' | 'thayThe' = 'congDon',
): Promise<ProStatus> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { isPro: true, proExpiresAt: true, proSince: true } });
  if (!u) throw new NotFoundError('User không tồn tại');

  let newExpiry: Date | null;
  if (durationDays == null) {
    newExpiry = null; // lifetime
  } else if (cheDo === 'thayThe') {
    // Đặt lại hoàn toàn: đếm từ BÂY GIỜ, bỏ qua hạn cũ lẫn trạng thái vĩnh viễn.
    newExpiry = new Date(Date.now() + durationDays * DAY_MS);
  } else if (u.isPro && u.proExpiresAt == null) {
    newExpiry = null; // already lifetime → keep lifetime
  } else {
    const base = u.isPro && u.proExpiresAt && u.proExpiresAt > new Date() ? u.proExpiresAt : new Date();
    newExpiry = new Date(base.getTime() + durationDays * DAY_MS);
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      isPro: true,
      proSince: u.proSince ?? new Date(),
      proExpiresAt: newExpiry,
      proSource: source,
    },
  });
  return getProStatus(userId);
}

/** Remove Pro from a user (admin). Does not touch admin role. */
export async function revokePro(userId: number): Promise<ProStatus> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!u) throw new NotFoundError('User không tồn tại');
  await prisma.user.update({ where: { id: userId }, data: { isPro: false, proExpiresAt: null, proSource: null } });
  return getProStatus(userId);
}

// ─── Redeem ──────────────────────────────────────────────────────────────
export async function redeemProCode(userId: number, rawCode: string): Promise<ProStatus> {
  const code = (rawCode || '').trim().toUpperCase();
  if (!code) throw new BadRequestError('Vui lòng nhập mã Pro');

  const pc = await prisma.proCode.findUnique({ where: { code } });
  if (!pc || !pc.isActive) throw new BadRequestError('Mã không hợp lệ hoặc đã bị khoá');
  if (pc.expiresAt && pc.expiresAt < new Date()) throw new BadRequestError('Mã đã hết hạn');
  if (pc.usedCount >= pc.maxUses) throw new BadRequestError('Mã đã hết lượt sử dụng');

  const already = await prisma.proRedemption.findUnique({ where: { uk_pro_redemption: { proCodeId: pc.id, userId } } });
  if (already) throw new BadRequestError('Bạn đã sử dụng mã này rồi');

  await prisma.$transaction(async (tx) => {
    await tx.proRedemption.create({ data: { proCodeId: pc.id, userId, grantedDays: pc.durationDays } });
    await tx.proCode.update({ where: { id: pc.id }, data: { usedCount: { increment: 1 } } });
  });

  const status = await grantProToUser(userId, pc.durationDays, 'CODE');

  // Best-effort: drop the code into the user's "My Code" wallet for reference.
  await prisma.userSavedCode
    .upsert({
      where: { userId_code: { userId, code } },
      create: { userId, code, label: pc.label || 'Mã Pro', codeType: 'OTHER', source: 'AUTO', note: 'Nâng cấp Pro' },
      update: { label: pc.label || 'Mã Pro' },
    })
    .catch(() => {});

  return status;
}

// ─── Admin: Pro code CRUD ──────────────────────────────────────────────────
function randomCode(len = 8): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export interface ProCodeInput {
  code?: string;
  label?: string;
  durationDays?: number | null;
  maxUses?: number;
  expiresAt?: string | null;
  note?: string | null;
}

export async function listProCodes() {
  const codes = await prisma.proCode.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { redemptions: true } } },
  });
  return codes.map((c) => ({
    id: c.id,
    code: c.code,
    label: c.label,
    durationDays: c.durationDays,
    lifetime: c.durationDays == null,
    maxUses: c.maxUses,
    usedCount: c.usedCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    note: c.note,
    redemptions: c._count.redemptions,
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function createProCode(data: ProCodeInput, adminId?: number | null) {
  let code = (data.code || '').trim().toUpperCase();
  if (code) {
    if (!/^[A-Z0-9]{4,40}$/.test(code)) throw new BadRequestError('Mã chỉ gồm chữ IN HOA và số, 4–40 ký tự');
    const dup = await prisma.proCode.findUnique({ where: { code } });
    if (dup) throw new BadRequestError('Mã này đã tồn tại');
  } else {
    // auto-generate a unique code
    for (let i = 0; i < 6; i++) {
      const candidate = 'PRO-' + randomCode(8);
      const dup = await prisma.proCode.findUnique({ where: { code: candidate } });
      if (!dup) { code = candidate; break; }
    }
    if (!code) throw new BadRequestError('Không tạo được mã, thử lại');
  }

  const maxUses = Number.isFinite(data.maxUses) && (data.maxUses as number) >= 1 ? Math.floor(data.maxUses as number) : 1;
  const durationDays =
    data.durationDays == null || data.durationDays === undefined
      ? null
      : Number.isFinite(data.durationDays) && (data.durationDays as number) > 0
        ? Math.floor(data.durationDays as number)
        : null;

  return prisma.proCode.create({
    data: {
      code,
      label: data.label?.trim() || null,
      durationDays,
      maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      note: data.note?.trim() || null,
      createdBy: adminId ?? null,
    },
  });
}

export async function updateProCode(id: number, data: Partial<ProCodeInput> & { isActive?: boolean }) {
  const existing = await prisma.proCode.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Mã không tồn tại');
  return prisma.proCode.update({
    where: { id },
    data: {
      label: data.label === undefined ? undefined : data.label?.trim() || null,
      durationDays: data.durationDays === undefined ? undefined : data.durationDays == null ? null : Math.floor(data.durationDays),
      maxUses: data.maxUses === undefined ? undefined : Math.max(1, Math.floor(data.maxUses)),
      isActive: data.isActive === undefined ? undefined : !!data.isActive,
      expiresAt: data.expiresAt === undefined ? undefined : data.expiresAt ? new Date(data.expiresAt) : null,
      note: data.note === undefined ? undefined : data.note?.trim() || null,
    },
  });
}

export async function deleteProCode(id: number) {
  await prisma.proCode.delete({ where: { id } });
  return { deleted: true };
}

/** Admin overview: users who currently hold Pro (excludes admins). */
export async function listProUsers() {
  const users = await prisma.user.findMany({
    where: { isPro: true },
    select: { id: true, username: true, fullName: true, avatarUrl: true, proSince: true, proExpiresAt: true, proSource: true },
    orderBy: { proSince: 'desc' },
    take: 500,
  });
  const now = new Date();
  return users.map((u) => ({
    id: u.id,
    username: u.username,
    fullName: u.fullName,
    avatarUrl: u.avatarUrl,
    proSince: u.proSince?.toISOString() ?? null,
    expiresAt: u.proExpiresAt?.toISOString() ?? null,
    lifetime: !u.proExpiresAt,
    expired: !!u.proExpiresAt && u.proExpiresAt <= now,
    source: u.proSource,
  }));
}
