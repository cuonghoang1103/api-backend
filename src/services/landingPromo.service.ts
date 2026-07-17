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
  if (input.videoUrl !== undefined) { const v = str(input.videoUrl, 500); if (!v) throw new BadRequestError('Thiếu video'); data.videoUrl = v; }
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
