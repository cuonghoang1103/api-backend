/**
 * ============================================================
 * Sticker Service — Chat sticker packs
 * ============================================================
 *
 * Stickers are grouped into packs. Pack/sticker images are uploaded
 * by an ADMIN and stored in our own storage (R2 in prod) — never
 * hotlinked from a third party. The chat picker lists active packs;
 * a message sends a sticker by storing its URL in Message.mediaUrl
 * with mediaKind = 'sticker'.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { uploadImage, deleteByUrl, type UploadInput } from '../storage/uploadService.js';

export interface StickerPackDTO {
  id: number;
  slug: string;
  name: string;
  coverUrl: string | null;
  stickerCount?: number;
  isActive?: boolean;
}

export interface StickerDTO {
  id: number;
  packId: number;
  url: string;
  label: string | null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || `pack-${Date.now()}`;
}

// ─── Public reads ────────────────────────────────────────────

export async function listActivePacks(): Promise<StickerPackDTO[]> {
  const packs = await prisma.stickerPack.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { stickers: true } } },
  });
  // Only surface packs that actually have stickers, so the picker
  // never shows an empty tab.
  return packs
    .filter((p) => p._count.stickers > 0)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      coverUrl: p.coverUrl,
      stickerCount: p._count.stickers,
    }));
}

export async function listStickers(packId: number): Promise<StickerDTO[]> {
  const stickers = await prisma.sticker.findMany({
    where: { packId },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  });
  return stickers.map((s) => ({ id: s.id, packId: s.packId, url: s.url, label: s.label }));
}

// ─── Admin writes ────────────────────────────────────────────

export async function createPack(
  adminId: number,
  data: { name: string; slug?: string },
): Promise<StickerPackDTO> {
  const name = (data.name ?? '').trim();
  if (!name) throw new AppError('Tên pack là bắt buộc', 400, 'VALIDATION_ERROR');
  let slug = data.slug?.trim() ? slugify(data.slug) : slugify(name);

  // Ensure slug uniqueness (append a counter if taken).
  const existing = await prisma.stickerPack.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const pack = await prisma.stickerPack.create({
    data: { name, slug, createdBy: adminId },
  });
  return { id: pack.id, slug: pack.slug, name: pack.name, coverUrl: pack.coverUrl };
}

/** Upload one image and attach it to a pack. Stores to our storage. */
export async function addSticker(
  packId: number,
  file: UploadInput,
  label?: string,
): Promise<StickerDTO> {
  const pack = await prisma.stickerPack.findUnique({ where: { id: packId } });
  if (!pack) throw new AppError('Pack không tồn tại', 404, 'PACK_NOT_FOUND');

  const uploaded = await uploadImage(file, 'images/sticker', { subPrefix: pack.slug });

  const sticker = await prisma.sticker.create({
    data: { packId, url: uploaded.url, label: label?.trim() || null },
  });

  // Auto-set the pack cover to the first sticker.
  if (!pack.coverUrl) {
    await prisma.stickerPack.update({ where: { id: packId }, data: { coverUrl: uploaded.url } });
  }

  return { id: sticker.id, packId: sticker.packId, url: sticker.url, label: sticker.label };
}

export async function updatePack(
  packId: number,
  data: { name?: string; isActive?: boolean; coverUrl?: string },
): Promise<void> {
  await prisma.stickerPack.update({
    where: { id: packId },
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.coverUrl !== undefined ? { coverUrl: data.coverUrl } : {}),
    },
  });
}

export async function deleteSticker(stickerId: number): Promise<void> {
  const sticker = await prisma.sticker.findUnique({ where: { id: stickerId } });
  if (!sticker) return;
  await prisma.sticker.delete({ where: { id: stickerId } });
  // Best-effort: remove the stored image. Never block on storage.
  void deleteByUrl(sticker.url).catch(() => {});
}

export async function deletePack(packId: number): Promise<void> {
  const stickers = await prisma.sticker.findMany({ where: { packId }, select: { url: true } });
  await prisma.stickerPack.delete({ where: { id: packId } }); // cascade deletes stickers
  void Promise.all(stickers.map((s) => deleteByUrl(s.url).catch(() => {})));
}

/** Admin listing: includes inactive packs + counts. */
export async function listAllPacksForAdmin(): Promise<StickerPackDTO[]> {
  const packs = await prisma.stickerPack.findMany({
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { stickers: true } } },
  });
  return packs.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    coverUrl: p.coverUrl,
    stickerCount: p._count.stickers,
    isActive: p.isActive,
  }));
}
