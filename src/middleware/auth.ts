import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  roleVersion: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: number;
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
    req.userId = decoded.userId;

    // Re-verify account status from DB on every authenticated request so that
    // locking or disabling a user takes effect immediately across all devices —
    // the JWT alone is not enough because it has a long TTL.
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { enabled: true, accountNonLocked: true },
    });

    if (!dbUser) throw new UnauthorizedError('User not found');
    if (!dbUser.enabled) throw new ForbiddenError('Account is disabled');
    if (!dbUser.accountNonLocked) throw new ForbiddenError('Account is locked');

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
    } else {
      next(error);
    }
  }
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const token = extractToken(req);
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = decoded;
      req.userId = decoded.userId;
    }
  } catch {
    // Ignore invalid tokens for optional auth
  }
  next();
}

export function requireRole(...roles: string[]) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Re-verify role from database to prevent stale sessions
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { roles: { include: { role: true } } },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      if (!user.enabled) {
        throw new ForbiddenError('Account is disabled');
      }

      if (!user.accountNonLocked) {
        throw new ForbiddenError('Account is locked');
      }

      const userRoles = user.roles.map((ur) => ur.role.name.toUpperCase().replace('ROLE_', ''));
      const hasRole = roles.some((r) => userRoles.includes(r.toUpperCase().replace('ROLE_', '')));

      if (!hasRole) {
        throw new ForbiddenError('Insufficient permissions');
      }

      // Attach fresh role version for session invalidation
      req.user.roleVersion = Number(user.roleVersion);
      req.user.roles = userRoles;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAdmin(role: string = 'ROLE_ADMIN') {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = extractToken(req);
      if (!token) {
        throw new UnauthorizedError('No authentication token provided');
      }

      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = decoded;
      req.userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { roles: { include: { role: true } } },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      if (!user.enabled) {
        throw new ForbiddenError('Account is disabled');
      }

      if (!user.accountNonLocked) {
        throw new ForbiddenError('Account is locked');
      }

      const userRoles = user.roles.map((ur) => ur.role.name.toUpperCase().replace('ROLE_', ''));
      const hasRole = userRoles.includes(role.toUpperCase().replace('ROLE_', ''));

      if (!hasRole) {
        throw new ForbiddenError('Admin access required');
      }

      req.user.roleVersion = Number(user.roleVersion);
      req.user.roles = userRoles;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Token has expired'));
      } else if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError('Invalid token'));
      } else {
        next(error);
      }
    }
  };
}

export function extractToken(req: Request): string | undefined {
  // 1. Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // 2. Cookie (parsed by cookie-parser middleware in Express)
  if (req.cookies?.backend_token) {
    return req.cookies.backend_token;
  }

  // 3. Query param (for SSE streaming)
  if (req.query?.token && typeof req.query.token === 'string') {
    return req.query.token;
  }

  // 4. Raw Cookie header — fallback for Socket.IO handshake where
  //    cookie-parser middleware hasn't run. Manually parse
  //    `Cookie: backend_token=...; ...` so the realtime channel can
  //    still authenticate the user.
  if (req.headers?.cookie) {
    const cookies = parseCookieHeader(req.headers.cookie);
    if (cookies.backend_token) {
      return cookies.backend_token;
    }
  }

  return undefined;
}

function parseCookieHeader(header: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const name = part.slice(0, eq).trim();
    const raw = part.slice(eq + 1).trim();
    if (!name) continue;
    try {
      out[name] = decodeURIComponent(raw);
    } catch {
      out[name] = raw;
    }
  }
  return out;
}

export function requireCyberProfile() {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }
      await prisma.cyberProfile.upsert({
        where: { userId: req.user.userId },
        update: {},
        create: { userId: req.user.userId, level: 1, currentExp: 0, totalPoints: 0 },
      });
      await prisma.cyberInventory.upsert({
        where: { userId: req.user.userId },
        update: {},
        create: { userId: req.user.userId, pointBalance: 0 },
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}
