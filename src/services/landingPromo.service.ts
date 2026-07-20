/**
 * Landing promo videos — admin-managed clips shown in the marquee on "/".
 *
 * Public read returns only active rows in display order. Admin CRUD is thin:
 * the video bytes are already in R2 (uploaded via the shared presign flow),
 * so we only store the URL + presentation metadata. No user data, no FK.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

const ORDER = [{ order: 'asc' as const }, { id: 'asc' as const }];

function str(v: unknown, max: number): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s ? s.slice(0, max) : undefined;
}

/**
 * Claim the R2 objects a promo points at.
 *
 * The presigned large-file path records every upload as a PENDING row with a
 * 24h TTL, and a cron deletes the object when that expires. Only the social
 * feed ever marked its uploads CONFIRMED, so a promo video was uploaded, shown
 * correctly, and then silently deleted from R2 four hours later — the card kept
 * its poster (small files skip that path) and lost its clip, which is exactly
 * how this surfaced. Claiming the key here is what makes the upload permanent.
 */
async function confirmUploads(...urls: Array<string | undefined | null>): Promise<void> {
  const keys = urls
    .filter((u): u is string => !!u)
    .map((u) => {
      try {
        // Stored URLs are absolute (https://media.../video/u1/xxx.mp4); the
        // PendingUpload row keys them by the path without the leading slash.
        return new URL(u).pathname.replace(/^\/+/, '');
      } catch {
        return u.replace(/^\/+/, '');
      }
    })
    .filter(Boolean);
  if (!keys.length) return;
  await prisma.pendingUpload.updateMany({
    where: { r2Key: { in: keys }, status: 'PENDING' },
    data: { status: 'CONFIRMED' },
  });
}

export async function listActivePromos() {
  return prisma.landingPromo.findMany({ where: { isActive: true }, orderBy: ORDER });
}

export async function listAllPromos() {
  return prisma.landingPromo.findMany({ orderBy: ORDER });
}

export async function createPromo(input: Record<string, unknown>) {
  const title = str(input.title, 160);
  const videoUrl = str(input.videoUrl, 500);
  if (!title) throw new BadRequestError('Tiêu đề không được trống');
  if (!videoUrl) throw new BadRequestError('Thiếu video (videoUrl)');
  await confirmUploads(videoUrl, str(input.posterUrl, 500));
  return prisma.landingPromo.create({
    data: {
      title,
      videoUrl,
      tagline: str(input.tagline, 255) ?? null,
      posterUrl: str(input.posterUrl, 500) ?? null,
      href: str(input.href, 255) ?? null,
      accent: str(input.accent, 16) ?? null,
      featureKey: str(input.featureKey, 48) ?? null,
      isActive: input.isActive === undefined ? true : Boolean(input.isActive),
      order: Number.isFinite(Number(input.order)) ? Number(input.order) : 0,
    },
  });
}

export async function updatePromo(id: number, input: Record<string, unknown>) {
  const existing = await prisma.landingPromo.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Không tìm thấy promo');
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) { const t = str(input.title, 160); if (!t) throw new BadRequestError('Tiêu đề không được trống'); data.title = t; }
  if (input.videoUrl !== undefined) { const v = str(input.videoUrl, 500); if (!v) throw new BadRequestError('Thiếu video'); data.videoUrl = v; await confirmUploads(v); }
  if (input.posterUrl !== undefined) await confirmUploads(str(input.posterUrl, 500));
  if (input.tagline !== undefined) data.tagline = str(input.tagline, 255) ?? null;
  if (input.posterUrl !== undefined) data.posterUrl = str(input.posterUrl, 500) ?? null;
  if (input.href !== undefined) data.href = str(input.href, 255) ?? null;
  if (input.accent !== undefined) data.accent = str(input.accent, 16) ?? null;
  if (input.featureKey !== undefined) data.featureKey = str(input.featureKey, 48) ?? null;
  if (input.isActive !== undefined) data.isActive = Boolean(input.isActive);
  if (input.order !== undefined && Number.isFinite(Number(input.order))) data.order = Number(input.order);
  return prisma.landingPromo.update({ where: { id }, data });
}

export async function deletePromo(id: number) {
  await prisma.landingPromo.delete({ where: { id } }).catch(() => { throw new NotFoundError('Không tìm thấy promo'); });
  return { deleted: true };
}

export async function reorderPromos(ids: unknown) {
  if (!Array.isArray(ids)) throw new BadRequestError('ids phải là mảng');
  await prisma.$transaction(
    ids.map((id, i) => prisma.landingPromo.update({ where: { id: Number(id) }, data: { order: i } })),
  );
  return listAllPromos();
}
