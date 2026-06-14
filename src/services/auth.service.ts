import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type { AuthResponse, JwtPayload } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';
import { emailService } from './email.service.js';

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
          create: {
            role: { connect: { name: 'ROLE_USER' } },
          },
        },
      },
      include: { roles: { include: { role: true } } },
    });

    // ─── Send verification email (best-effort) ───────────
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

    return this.buildAuthResponse(user);
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
            create: { role: { connect: { name: 'ROLE_USER' } } },
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
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      provider: user.provider,
      emailVerified: user.emailVerified,
      roles: user.roles.map((ur) => ur.role.name),
      role: user.roles[0]?.role.name || 'ROLE_USER',
      roleVersion: Number(user.roleVersion),
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  // ─── Update Profile ─────────────────────────────────────
  async updateProfile(userId: number, data: {
    fullName?: string;
    email?: string;
    bio?: string;
    avatarUrl?: string;
  }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
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

  // ─── Forgot Password ────────────────────────────────────
  async forgotPassword(email: string): Promise<string | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null; // Don't reveal if user exists

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    // Send via Resend
    await emailService.sendPasswordResetEmail({
      to: user.email,
      fullName: user.fullName ?? undefined,
      token,
    });

    return token;
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

export const authService = new AuthService();
