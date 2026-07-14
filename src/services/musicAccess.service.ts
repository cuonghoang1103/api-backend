/**
 * Music access control — governs who can see the /music page.
 *
 * A single global mode (AppSetting "music_access_mode") + a per-user
 * flag (User.musicAccess) used only in SPECIFIC mode:
 *   - ADMIN_ONLY (default): only admins.
 *   - SPECIFIC:  admins + users with musicAccess = true.
 *   - EVERYONE:  everyone, including logged-out guests.
 * Admins always have access regardless of mode.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export type MusicAccessMode = 'ADMIN_ONLY' | 'SPECIFIC' | 'EVERYONE';

const MODE_KEY = 'music_access_mode';
const VALID_MODES: MusicAccessMode[] = ['ADMIN_ONLY', 'SPECIFIC', 'EVERYONE'];

function isAdminRoles(roles: string[] | undefined | null): boolean {
  return (roles ?? []).some((r) => /^(role_)?(admin|superadmin)$/i.test(r || ''));
}

export async function getMusicAccessMode(): Promise<MusicAccessMode> {
  const row = await prisma.appSetting.findUnique({ where: { key: MODE_KEY } });
  const v = (row?.value ?? 'ADMIN_ONLY') as MusicAccessMode;
  return VALID_MODES.includes(v) ? v : 'ADMIN_ONLY';
}

export async function setMusicAccessMode(mode: MusicAccessMode): Promise<MusicAccessMode> {
  if (!VALID_MODES.includes(mode)) {
    throw new AppError('Chế độ không hợp lệ', 400, 'INVALID_MUSIC_MODE');
  }
  await prisma.appSetting.upsert({
    where: { key: MODE_KEY },
    update: { value: mode },
    create: { key: MODE_KEY, value: mode },
  });
  return mode;
}

/** Whether the given viewer (userId + token roles) can see the music page. */
export async function canAccessMusic(
  userId: number | undefined | null,
  roles: string[] | undefined | null,
): Promise<boolean> {
  const mode = await getMusicAccessMode();
  if (mode === 'EVERYONE') return true;
  if (!userId) return false;
  if (isAdminRoles(roles)) return true;
  // Pro members always have access, regardless of mode (a Pro perk). The
  // existing admin per-user grant (musicAccess) is untouched.
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { musicAccess: true, isPro: true, proExpiresAt: true },
  });
  if (u && u.isPro && (!u.proExpiresAt || u.proExpiresAt > new Date())) return true;
  if (mode === 'ADMIN_ONLY') return false;
  // SPECIFIC — check the per-user flag.
  return !!u?.musicAccess;
}

export async function setUserMusicAccess(userId: number, allowed: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { musicAccess: allowed },
    select: { id: true, username: true, musicAccess: true },
  });
}
