/**
 * UserProfile service — extended profile fields.
 *
 * Phase 4 add. Profile is optional 1-1 with User: legacy rows
 * don't have a profile row, and we lazily create one with
 * defaults the first time the user reads or writes. Defaults
 * are intentionally all-null so the page can show a "complete
 * your profile" empty state without needing a separate "first
 * run" code path.
 *
 * Endpoints (mounted at /api/v1/users by src/index.ts):
 *   - getOwnProfile   : returns the row + the user's displayName
 *                        fallback chain (displayName → fullName →
 *                        username)
 *   - getProfileById  : public read; the route layer is
 *                        responsible for the visibility rules
 *                        (e.g. a public profile is always
 *                        visible; a private one is owner-only)
 *   - updateOwnProfile : PATCH; partial; missing fields stay
 *                        unchanged
 *
 * Front-end uses these to drive the Phase 4 profile page (tab
 * navigation between Bài viết / Ảnh / Grid + bio header +
 * cover photo + edit modal).
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export interface ProfileResponse {
  userId: number;
  username: string;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  coverPhoto: string | null;
  location: string | null;
  websiteUrl: string | null;
  work: string | null;
  education: string | null;
  /** The PostCard / Profile-page read for owner-only flags. */
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  bio?: string | null;
  coverPhoto?: string | null;
  location?: string | null;
  websiteUrl?: string | null;
  work?: string | null;
  education?: string | null;
}

const MAX_FIELD_LEN = 500;
const MAX_BIO_LEN = 2000;
const MAX_URL_LEN = 500;

function validateInput(input: UpdateProfileInput): void {
  for (const [k, v] of Object.entries(input)) {
    if (v == null) continue;
    if (typeof v !== 'string') {
      throw new AppError(`${k} phai la chuoi hoac null`, 400, 'INVALID_FIELD');
    }
    if (k === 'bio' && v.length > MAX_BIO_LEN) {
      throw new AppError(`bio qua dai (max ${MAX_BIO_LEN})`, 400, 'BIO_TOO_LONG');
    }
    if ((k === 'websiteUrl' || k === 'coverPhoto') && v.length > MAX_URL_LEN) {
      throw new AppError(`${k} qua dai (max ${MAX_URL_LEN})`, 400, `${k.toUpperCase()}_TOO_LONG`);
    }
    if ((k === 'location' || k === 'work' || k === 'education') && v.length > MAX_FIELD_LEN) {
      throw new AppError(`${k} qua dai (max ${MAX_FIELD_LEN})`, 400, `${k.toUpperCase()}_TOO_LONG`);
    }
    if (k === 'websiteUrl' && v && !/^https?:\/\//.test(v)) {
      throw new AppError('websiteUrl phai la URL http/https', 400, 'INVALID_WEBSITE_URL');
    }
  }
}

/** Default row factory. We use upsert for create-on-read so
 *  the route doesn't have to coordinate "if not exists, insert
 *  first" race conditions. */
async function ensureProfile(userId: number) {
  return prisma.userProfile.upsert({
    where: { userId },
    create: { userId },
    update: {}, // no-op
    include: { user: false }, // we only need the profile fields
  });
}

export async function getOwnProfile(userId: number): Promise<ProfileResponse> {
  const [profile, user] = await Promise.all([
    ensureProfile(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, username: true, fullName: true, displayName: true,
        avatarUrl: true, createdAt: true, updatedAt: true,
      },
    }),
  ]);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  return {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: profile.bio,
    coverPhoto: profile.coverPhoto,
    location: profile.location,
    websiteUrl: profile.websiteUrl,
    work: profile.work,
    education: profile.education,
    isOwner: true,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

/** Public read by user id. The route layer wraps this in
 *  visibility rules (e.g. 404 if the user is private and the
 *  viewer isn't the owner). */
export async function getProfileById(userId: number, currentUserId?: number): Promise<ProfileResponse | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, username: true, fullName: true, displayName: true,
      avatarUrl: true, createdAt: true, updatedAt: true,
    },
  });
  if (!user) return null;
  // The profile row is optional — for old users we lazy-create
  // it (so the page always has *some* bio row to show). We
  // don't lazy-create on a public read though — the public
  // shouldn't mutate the DB just by being looked up.
  const profile = await prisma.userProfile.findUnique({ where: { userId } });
  return {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    bio: profile?.bio ?? null,
    coverPhoto: profile?.coverPhoto ?? null,
    location: profile?.location ?? null,
    websiteUrl: profile?.websiteUrl ?? null,
    work: profile?.work ?? null,
    education: profile?.education ?? null,
    isOwner: currentUserId === userId,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function updateOwnProfile(userId: number, input: UpdateProfileInput): Promise<ProfileResponse> {
  validateInput(input);
  // Make sure the row exists before we update (covers the
  // case where a legacy user updates their profile before
  // ever reading it).
  await ensureProfile(userId);
  const data: Record<string, unknown> = {};
  if ('bio' in input) data.bio = input.bio;
  if ('coverPhoto' in input) data.coverPhoto = input.coverPhoto;
  if ('location' in input) data.location = input.location;
  if ('websiteUrl' in input) data.websiteUrl = input.websiteUrl;
  if ('work' in input) data.work = input.work;
  if ('education' in input) data.education = input.education;
  await prisma.userProfile.update({ where: { userId }, data });
  return getOwnProfile(userId);
}
