import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type { AuthResponse, JwtPayload } from '../types/index.js';
import { emailService } from './email.service.js';
import { generateOtp, verifyOtp, getOtpTtl, type OtpType } from './otp.service.js';
import { logger } from '../utils/logger.js';

const SALT_ROUNDS = 12;

/* ─── Account security constants ────────────────────────────────────── */
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MIN_PASSWORD_LENGTH = 12;

// Bcrypt hash of a placeholder — used to keep timing consistent when user
// doesn't exist (so attackers can't probe which usernames are valid by timing).
const DUMMY_HASH = '$2b$12$abcdefghijklmnopqrstuuOYxRbV4GF.6bqQwL3c2nQr5YjKp8g3O';

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate password complexity. Returns list of human-readable errors.
 *
 * Policy (bảo mật cao):
 * - Tối thiểu 12 ký tự
 * - Có ít nhất 1 chữ hoa
 * - Có ít nhất 1 chữ thường
 * - Có ít nhất 1 chữ số
 * - Có ít nhất 1 ký tự đặc biệt
 * - Không chứa username hoặc email
 */
export function validatePasswordStrength(
  password: string,
  username?: string,
  email?: string,
): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ hoa (A-Z)');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ thường (a-z)');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ số (0-9)');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*...)');
  }

  // Personal info check
  const lower = password.toLowerCase();
  if (username && lower.includes(username.toLowerCase())) {
    errors.push('Mật khẩu không được chứa username');
  }
  if (email) {
    const local = email.split('@')[0]?.toLowerCase();
    if (local && local.length > 3 && lower.includes(local)) {
      errors.push('Mật khẩu không được chứa phần local của email');
    }
  }

  return { valid: errors.length === 0, errors };
}

export class AuthService {
  // ─── Credentials Login ──────────────────────────────────
  async login(
    username: string,
    password: string,
    meta?: { ip?: string; userAgent?: string },
  ): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { roles: { include: { role: true } } },
    });

    // ─── Account lockout check (priority #1) ─────────────
    if (user) {
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        const minutesLeft = Math.ceil(
          (user.lockoutUntil.getTime() - Date.now()) / 60000,
        );
        throw new AppError(
          `Tài khoản bị tạm khoá do nhập sai mật khẩu quá nhiều lần. Vui lòng thử lại sau ${minutesLeft} phút.`,
          429,
          'ACCOUNT_LOCKED',
        );
      }
    }

    if (!user) {
      // Run dummy bcrypt to keep timing consistent (prevent user enumeration)
      await bcrypt.compare(password, DUMMY_HASH);
      throw new AppError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.enabled) {
      throw new AppError('Account is disabled', 403, 'ACCOUNT_DISABLED');
    }

    if (!user.accountNonLocked) {
      throw new AppError('Account is locked', 403, 'ACCOUNT_LOCKED');
    }

    if (!user.password) {
      throw new AppError('This account uses OAuth. Please sign in with Google or GitHub.', 401, 'OAUTH_ACCOUNT');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      // ─── Increment failed login counter ────────────────
      const newFailedCount = user.failedLoginCount + 1;
      const shouldLock = newFailedCount >= MAX_FAILED_LOGINS;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: shouldLock ? 0 : newFailedCount,
          lockoutUntil: shouldLock
            ? new Date(Date.now() + LOCKOUT_DURATION_MS)
            : user.lockoutUntil,
          lastFailedLoginAt: new Date(),
        },
      });

      if (shouldLock) {
        throw new AppError(
          `Bạn đã nhập sai mật khẩu ${MAX_FAILED_LOGINS} lần. Tài khoản bị khoá ${LOCKOUT_DURATION_MS / 60000} phút.`,
          429,
          'ACCOUNT_LOCKED',
        );
      }

      const remaining = MAX_FAILED_LOGINS - newFailedCount;
      throw new AppError(
        `Sai mật khẩu. Còn ${remaining} lần thử trước khi tài khoản bị khoá.`,
        401,
        'INVALID_CREDENTIALS',
      );
    }

    // ─── Reset failure counter + update login tracking on success ─
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockoutUntil: null,
        lastFailedLoginAt: null,
        lastLoginAt: new Date(),
        lastLoginIp: meta?.ip ?? null,
        lastLoginUserAgent: meta?.userAgent?.slice(0, 500) ?? null,
      },
    });

    // ─── Check email verification (block login if not verified) ─
    if (!user.emailVerified) {
      throw new AppError(
        'Email chưa được xác thực. Vui lòng kiểm tra hộp thư và click link xác thực.',
        403,
        'EMAIL_NOT_VERIFIED',
        // Forward the user's email so the frontend can redirect to
        // /verify-otp?email=... with a valid value. Without this the
        // client would have to use the login form's `username` field,
        // which is the username (not the email) and breaks the OTP
        // lookup.
        { email: user.email },
      );
    }

    return this.buildAuthResponse(user);
  }

  // ─── Register ──────────────────────────────────────────
  async register(data: {
    username: string;
    password: string;
    email: string;
    fullName?: string;
  }): Promise<AuthResponse> {
    // Validate password strength first
    const passwordCheck = validatePasswordStrength(
      data.password,
      data.username,
      data.email,
    );
    if (!passwordCheck.valid) {
      throw new AppError(passwordCheck.errors[0]!, 400, 'WEAK_PASSWORD');
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === data.username) {
        throw new AppError('Username already exists', 409, 'USERNAME_EXISTS');
      }
      throw new AppError('Email already exists', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
        fullName: data.fullName,
        emailVerified: false, // Bắt buộc xác thực
        roles: {
          // DB seed tạo role name = 'user' / 'admin' (lowercase, không
          // có tiền tố ROLE_). Cũ — trước đây ghi 'ROLE_USER' — không
          // match với row nào trong bảng roles → prisma.user.create()
          // fail với "No 'Role' record(s) found for nested connect".
          // Hardcode 'user' (không 'ROLE_USER') để khớp với seed.
          create: {
            role: { connect: { name: 'user' } },
          },
        },
      },
      include: { roles: { include: { role: true } } },
    });

    // ─── Send 6-digit OTP via email (best-effort) ──────
    const otpResult = await generateOtp(user.email, 'verify');
    const otpToSend = otpResult.devCode ?? (await getLatestOtpForLog(user.email, 'verify'));
 if (process.env.NODE_ENV === 'development' && otpResult.devCode) {
 logger.info('register dev OTP', { email: user.email, otp: otpResult.devCode });
 }
    // Always log OTP at INFO level (server console) for any new
    // account — this is the operational fallback when the email
    // provider (Resend) bounces the message because the sending
    // domain isn't verified yet. Without it, a user who registered
    // successfully has no way to verify their email and is stuck.
    // We don't expose the OTP in the HTTP response — it's only in
    // server logs (and in dev mode, also in the local console).
    //
    // SECURITY NOTE (2026-06-17): The OTP used to be logged UNCONDITIONALLY
    // (success or failure of email send), which leaks the OTP to any
    // stdout / log aggregator / Sentry capture. We now only log it when
    // the email send FAILED — i.e. when ops actually needs it as a
    // fallback. When email sends succeed, the user gets the OTP via
    // the normal channel and we don't need a server-side copy.
    if (otpToSend) {
      const sendResult = await emailService.sendOtpEmail({
        to: user.email,
        fullName: user.fullName ?? undefined,
        otp: otpToSend,
        type: 'verify',
      });
      if (!sendResult.success) {
        // Email send failed — admin needs a way to help the user verify.
        // Log only a masked version: first+last digit so the user can
        // confirm which code they're looking at, but the full code is
        // never written to stdout / log aggregator / Sentry.
        const masked = otpToSend.length >= 4
          ? `${otpToSend[0]}***${otpToSend[otpToSend.length - 1]}`
          : `***`;
 if (process.env.NODE_ENV === 'development') {
 logger.warn('register email failed', {
 email: user.email,
 maskedOtp: masked,
 hint: 'Full OTP logged only in DEV console. In production: retrieve from /api/admin/users/{id}/otp or DB.',
 error: sendResult.error,
 });
 logger.info('register FULL OTP (dev only)', { email: user.email, otp: otpToSend });
 } else {
 logger.warn('register email failed', {
 email: user.email,
 maskedOtp: masked,
 hint: 'Full OTP: check /api/admin/users endpoint or database directly.',
 error: sendResult.error,
 });
 }
      }
    }

    const authResponse = this.buildAuthResponse(user);
    return authResponse;
  }

  // ─── Verify Email via 6-digit OTP ──────────────────
  async verifyEmailOtp(email: string, code: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      throw new AppError('Invalid verification code', 400, 'INVALID_OTP');
    }
    if (user.emailVerified) {
      throw new AppError('Email đã được xác thực trước đó', 400, 'ALREADY_VERIFIED');
    }

    const result = await verifyOtp(email, code, 'verify');
    if (!result.valid) {
      const msg =
        result.reason === 'TOO_MANY_ATTEMPTS'
          ? 'Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.'
          : result.reason === 'NOT_FOUND'
          ? 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu mã mới.'
          : 'Mã xác thực không chính xác.';
      throw new AppError(msg, 400, 'INVALID_OTP');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifiedAt: new Date() },
    });
  }

  // ─── Resend Verification OTP ──────────────────────────
  async resendVerificationOtp(email: string): Promise<{ sent: boolean; ttl: number }> {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      // Don't reveal if email exists
      return { sent: false, ttl: 0 };
    }
    if (user.emailVerified) {
      return { sent: false, ttl: 0 };
    }

    const result = await generateOtp(email, 'verify');
    if (result.sent && result.devCode) {
      await emailService.sendOtpEmail({
        to: user.email,
        fullName: user.fullName ?? undefined,
        otp: result.devCode,
        type: 'verify',
      });
    } else if (result.sent) {
      // Production: devCode not in result, fetch latest OTP for email
      const otp = await getLatestOtpForLog(email, 'verify');
      if (otp) {
        await emailService.sendOtpEmail({
          to: user.email,
          fullName: user.fullName ?? undefined,
          otp,
          type: 'verify',
        });
      }
    }
    const ttl = await getOtpTtl(email, 'verify');
    return { sent: result.sent, ttl };
  }

  // ─── Verify Email ──────────────────────────────────────
  async verifyEmail(token: string): Promise<void> {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new AppError('Invalid verification token', 400, 'INVALID_TOKEN');
    }
    if (verificationToken.used) {
      throw new AppError('Verification token has already been used', 400, 'TOKEN_USED');
    }
    if (verificationToken.expiresAt < new Date()) {
      throw new AppError('Verification token has expired. Please request a new one.', 400, 'TOKEN_EXPIRED');
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: true, emailVerifiedAt: new Date() },
      }),
      prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { used: true },
      }),
    ]);
  }

  // ─── Resend Verification Email ─────────────────────────
  async resendVerificationEmail(email: string): Promise<{ sent: boolean }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists (security)
      return { sent: false };
    }
    if (user.emailVerified) {
      return { sent: false };
    }

    // Invalidate any old tokens
    await prisma.emailVerificationToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = uuidv4();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS),
      },
    });

    await emailService.sendVerificationEmail({
      to: user.email,
      fullName: user.fullName ?? undefined,
      token,
    });

    return { sent: true };
  }

  // ─── OAuth Register / Login ─────────────────────────────
  async oauthRegister(data: {
    email: string;
    fullName?: string;
    provider: string;
    providerId: string;
  }): Promise<AuthResponse> {
    let user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { roles: { include: { role: true } } },
    });

    if (user) {
      // Link OAuth to existing account
      // NOTE: OAuth users are auto-verified because the provider confirmed the email
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: data.provider,
          providerId: data.providerId,
          emailVerified: true, // OAuth provider đã verify email
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
          ...(data.fullName && !user.fullName ? { fullName: data.fullName } : {}),
        },
        include: { roles: { include: { role: true } } },
      });
    } else {
      // Create new OAuth user (auto-verified)
      // NOTE: roles table stores names as lowercase ('user', 'admin') —
      // using 'ROLE_USER' (the historical Spring Security convention)
      // would fail with "Role not found" on this DB. Connect by id 2
      // (the seeded USER role) to be safe across renames.
      user = await prisma.user.create({
        data: {
          username: data.email.split('@')[0] + '_' + Date.now().toString(36),
          email: data.email,
          fullName: data.fullName || data.email.split('@')[0],
          provider: data.provider,
          providerId: data.providerId,
          emailVerified: true, // OAuth provider đã verify email
          emailVerifiedAt: new Date(),
          roles: {
            create: { role: { connect: { name: 'user' } } },
          },
        },
        include: { roles: { include: { role: true } } },
      });
    }

    return this.buildAuthResponse(user);
  }

  // ─── Get Role by Email ─────────────────────────────────
  async getRoleByEmail(email: string): Promise<{
    id: number;
    username: string;
    email: string;
    primaryRole: string;
    roleVersion: number;
    emailVerified: boolean;
  }> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true }, orderBy: { roleId: 'asc' } } },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      primaryRole: user.roles[0]?.role.name || 'ROLE_USER',
      roleVersion: Number(user.roleVersion),
      emailVerified: user.emailVerified,
    };
  }

  // ─── Get User Profile ───────────────────────────────────
  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      // displayName is the user-facing "Tên" shown in the UI.
      // Falls back to fullName then username when not set so
      // callers always have a non-empty value.
      displayName: user.displayName ?? user.fullName ?? user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      birthYear: user.birthYear,
      phone: user.phone,
      socialLinks: user.socialLinks,
      provider: user.provider,
      emailVerified: user.emailVerified,
      // Whether other users (with no prior thread) can DM this user
      allowMessagesFromStrangers: user.allowMessagesFromStrangers,
      coverPhotoUrl: user.coverPhotoUrl,
      lastActiveAt: user.lastActiveAt,
      roles: user.roles.map((ur) => ur.role.name),
      role: user.roles[0]?.role.name || 'ROLE_USER',
      roleVersion: Number(user.roleVersion),
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  // ─── Update Profile ─────────────────────────────────────
  // Validates and normalises the extended profile fields.
  // - displayName: trimmed, max 100 chars.
  // - gender: must be one of MALE/FEMALE/OTHER or null to clear.
  // - birthYear: 1900..currentYear, or null to clear.
  // - phone: 10-20 chars (digits, spaces, +, - allowed), or null.
  // - socialLinks: object with at most the whitelisted keys; each
  //   value must be a string URL (validated with new URL()).
  // Throws AppError 400 with a specific message on validation
  // failure so the frontend can render the field-level error.
  async updateProfile(userId: number, data: {
    fullName?: string | null;
    email?: string;
    bio?: string | null;
    avatarUrl?: string | null;
    displayName?: string | null;
    gender?: string | null;
    birthYear?: number | null;
    phone?: string | null;
    socialLinks?: Record<string, string> | null;
    allowMessagesFromStrangers?: boolean;
    coverPhotoUrl?: string | null;
  }) {
    const updates: Record<string, unknown> = {};

    if (data.fullName !== undefined) {
      const trimmed = data.fullName?.trim() || null;
      if (trimmed && trimmed.length > 100) {
        throw new AppError('Full name must be 100 characters or less', 400, 'INVALID_FULLNAME');
      }
      updates.fullName = trimmed;
    }

    if (data.email !== undefined) {
      const email = data.email?.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError('Invalid email', 400, 'INVALID_EMAIL');
      }
      // Ensure unique
      const existing = await prisma.user.findFirst({ where: { email, NOT: { id: userId } } });
      if (existing) {
        throw new AppError('Email already in use', 409, 'EMAIL_TAKEN');
      }
      updates.email = email;
    }

    if (data.bio !== undefined) {
      updates.bio = data.bio?.trim() || null;
    }

    if (data.avatarUrl !== undefined) {
      updates.avatarUrl = data.avatarUrl?.trim() || null;
    }

    if (data.displayName !== undefined) {
      const trimmed = data.displayName?.trim() || null;
      if (trimmed && trimmed.length > 100) {
        throw new AppError('Display name must be 100 characters or less', 400, 'INVALID_DISPLAYNAME');
      }
      updates.displayName = trimmed;
    }

    if (data.gender !== undefined) {
      const allowed = ['MALE', 'FEMALE', 'OTHER', null];
      if (!allowed.includes(data.gender ?? null)) {
        throw new AppError("Gender must be MALE, FEMALE, OTHER or null", 400, 'INVALID_GENDER');
      }
      updates.gender = data.gender ?? null;
    }

    if (data.birthYear !== undefined) {
      if (data.birthYear === null) {
        updates.birthYear = null;
      } else {
        const year = Number(data.birthYear);
        const currentYear = new Date().getFullYear();
        if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
          throw new AppError(`Birth year must be between 1900 and ${currentYear}`, 400, 'INVALID_BIRTH_YEAR');
        }
        updates.birthYear = year;
      }
    }

    if (data.phone !== undefined) {
      const trimmed = data.phone?.trim() || null;
      if (trimmed && !/^[\d+\-\s()]{10,20}$/.test(trimmed)) {
        throw new AppError('Phone must be 10-20 characters (digits, +, -, spaces)', 400, 'INVALID_PHONE');
      }
      updates.phone = trimmed;
    }

    if (data.socialLinks !== undefined) {
      if (data.socialLinks === null) {
        updates.socialLinks = null;
      } else {
        // Whitelist the supported keys so a malicious payload can't
        // dump arbitrary data into the JSONB column.
        const whitelist = ['github', 'twitter', 'linkedin', 'website', 'youtube', 'facebook'];
        const cleaned: Record<string, string> = {};
        for (const key of whitelist) {
          const v = data.socialLinks[key];
          if (v && typeof v === 'string' && v.trim()) {
            const trimmed = v.trim();
            try {
              new URL(trimmed);
              cleaned[key] = trimmed;
            } catch {
              throw new AppError(`Invalid URL for social link "${key}"`, 400, 'INVALID_SOCIAL_URL');
            }
          }
        }
        updates.socialLinks = Object.keys(cleaned).length > 0 ? cleaned : null;
      }
    }

    if (data.allowMessagesFromStrangers !== undefined) {
      // Boolean coercion is strict — anything other than a real
      // boolean is treated as "off" so a malicious client can't
      // bypass the privacy flag with a truthy non-bool.
      updates.allowMessagesFromStrangers = !!data.allowMessagesFromStrangers;
    }

    if (data.coverPhotoUrl !== undefined) {
      updates.coverPhotoUrl = data.coverPhotoUrl?.trim() || null;
    }

    return prisma.user.update({
      where: { id: userId },
      data: updates,
      include: { roles: { include: { role: true } } },
    });
  }

  // ─── Change Password ───────────────────────────────────
  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.password) {
      throw new AppError('Password not set for this account', 400);
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
    }

    // Re-validate new password strength
    const passwordCheck = validatePasswordStrength(newPassword, user.username, user.email);
    if (!passwordCheck.valid) {
      throw new AppError(passwordCheck.errors[0]!, 400, 'WEAK_PASSWORD');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, roleVersion: { increment: 1 } },
    });
  }

  // ─── Forgot Password (sends 6-digit OTP) ─────────────
  async forgotPassword(email: string): Promise<{ sent: boolean; ttl: number }> {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return { sent: false, ttl: 0 }; // Don't reveal if user exists

    const result = await generateOtp(email, 'reset');
    if (result.sent && result.devCode) {
      await emailService.sendOtpEmail({
        to: user.email,
        fullName: user.fullName ?? undefined,
        otp: result.devCode,
        type: 'reset',
      });
    } else if (result.sent) {
      const otp = await getLatestOtpForLog(email, 'reset');
      if (otp) {
        await emailService.sendOtpEmail({
          to: user.email,
          fullName: user.fullName ?? undefined,
          otp,
          type: 'reset',
        });
      }
    }
    const ttl = await getOtpTtl(email, 'reset');
    return { sent: result.sent, ttl };
  }

  // ─── Reset Password via OTP ─────────────────────
  async resetPasswordWithOtp(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      throw new AppError('Invalid reset code', 400, 'INVALID_OTP');
    }

    const result = await verifyOtp(email, code, 'reset');
    if (!result.valid) {
      const msg =
        result.reason === 'TOO_MANY_ATTEMPTS'
          ? 'Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.'
          : result.reason === 'NOT_FOUND'
          ? 'Mã đặt lại không tồn tại hoặc đã hết hạn.'
          : 'Mã đặt lại không chính xác.';
      throw new AppError(msg, 400, 'INVALID_OTP');
    }

    // Re-validate new password strength
    const passwordCheck = validatePasswordStrength(newPassword, user.username, user.email);
    if (!passwordCheck.valid) {
      throw new AppError(passwordCheck.errors[0]!, 400, 'WEAK_PASSWORD');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        roleVersion: { increment: 1 },
        failedLoginCount: 0,
        lockoutUntil: null,
      },
    });
  }

  // ─── Reset Password ─────────────────────────────────────
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new AppError('Reset token has expired', 400, 'TOKEN_EXPIRED');
    }

    if (resetToken.used) {
      throw new AppError('Reset token has already been used', 400, 'TOKEN_USED');
    }

    // Re-validate new password strength
    const passwordCheck = validatePasswordStrength(
      newPassword,
      resetToken.user.username,
      resetToken.user.email,
    );
    if (!passwordCheck.valid) {
      throw new AppError(passwordCheck.errors[0]!, 400, 'WEAK_PASSWORD');
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
          roleVersion: { increment: 1 },
          failedLoginCount: 0, // Reset on successful password reset
          lockoutUntil: null,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);
  }

  // ─── Token Generation ──────────────────────────────────
  private generateTokens(user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    roleVersion: bigint;
  }): { token: string; refreshToken: string } {
    const payload: JwtPayload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      roleVersion: Number(user.roleVersion),
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      config.jwtRefreshSecret,
      { expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] } as jwt.SignOptions,
    );

    return { token, refreshToken };
  }

  // ─── Build Auth Response ───────────────────────────────
  private buildAuthResponse(user: {
    id: number;
    username: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    roles: { role: { name: string } }[];
    roleVersion: bigint;
  }): AuthResponse {
    const roles = user.roles.map((ur) => ur.role.name);
    const { token, refreshToken } = this.generateTokens({
      id: user.id,
      username: user.username,
      email: user.email,
      roles,
      roleVersion: user.roleVersion,
    });

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || undefined,
      avatarUrl: user.avatarUrl || undefined,
      roles,
      role: roles[0] || 'ROLE_USER',
      roleVersion: Number(user.roleVersion),
      token,
      refreshToken,
    };
  }
}

// ─── Internal helpers (module-level) ──────────────────

/**
 * Read the latest OTP from Redis. Used in production where the
 * OTP service's generateOtp() doesn't return the code (it goes
 * directly to the email). Only call AFTER generateOtp().
 *
 * Returns the code or null if not found.
 */
async function getLatestOtpForLog(email: string, type: OtpType): Promise<string | null> {
  const { getRedis } = await import('../config/redis.js');
  const redis = await getRedis();
  const normalized = email.toLowerCase().trim();
  const key = `otp:${type}:${normalized}`;
  return redis.get(key);
}

export const authService = new AuthService();
