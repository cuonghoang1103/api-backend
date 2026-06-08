import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import type { AuthResponse, JwtPayload } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 12;

export class AuthService {
  // ─── Credentials Login ──────────────────────────────────
  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
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
      throw new AppError('Invalid username or password', 401, 'INVALID_CREDENTIALS');
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
        roles: {
          create: {
            role: { connect: { name: 'ROLE_USER' } },
          },
        },
      },
      include: { roles: { include: { role: true } } },
    });

    return this.buildAuthResponse(user);
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
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: data.provider,
          providerId: data.providerId,
          ...(data.fullName && !user.fullName ? { fullName: data.fullName } : {}),
        },
        include: { roles: { include: { role: true } } },
      });
    } else {
      // Create new OAuth user
      user = await prisma.user.create({
        data: {
          username: data.email.split('@')[0] + '_' + Date.now().toString(36),
          email: data.email,
          fullName: data.fullName || data.email.split('@')[0],
          provider: data.provider,
          providerId: data.providerId,
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
      roles: user.roles.map((ur) => ur.role.name),
      role: user.roles[0]?.role.name || 'ROLE_USER',
      roleVersion: Number(user.roleVersion),
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

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword, roleVersion: { increment: 1 } },
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
