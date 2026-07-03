import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

// Slugify a category name into a URL-safe id (ASCII-fold Vietnamese so
// "Giải trí" → "giai-tri"). Mirrors the approach used elsewhere.
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Public list — only active categories, ordered for the feed pills. */
export async function listActiveCategories() {
  return prisma.videoCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    select: { id: true, name: true, slug: true, sortOrder: true },
  });
}

/** Admin list — every category (active + hidden) with a post count. */
export async function listAllCategories() {
  return prisma.videoCategory.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { posts: true } } },
  });
}

export async function createCategory(data: { name: string; sortOrder?: number; isActive?: boolean }) {
  const name = data.name?.trim();
  if (!name) throw new BadRequestError('Category name is required');
  const slug = slugify(name);
  if (!slug) throw new BadRequestError('Category name must contain letters or numbers');

  const clash = await prisma.videoCategory.findFirst({ where: { OR: [{ name }, { slug }] } });
  if (clash) throw new BadRequestError('A category with this name already exists');

  return prisma.videoCategory.create({
    data: { name, slug, sortOrder: data.sortOrder ?? 0, isActive: data.isActive ?? true },
  });
}

export async function updateCategory(
  id: number,
  data: { name?: string; sortOrder?: number; isActive?: boolean },
) {
  const existing = await prisma.videoCategory.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Category not found');

  const updateData: { name?: string; slug?: string; sortOrder?: number; isActive?: boolean } = {};
  if (data.name !== undefined) {
    const name = data.name.trim();
    if (!name) throw new BadRequestError('Category name is required');
    const slug = slugify(name);
    if (!slug) throw new BadRequestError('Category name must contain letters or numbers');
    const clash = await prisma.videoCategory.findFirst({
      where: { OR: [{ name }, { slug }], NOT: { id } },
    });
    if (clash) throw new BadRequestError('A category with this name already exists');
    updateData.name = name;
    updateData.slug = slug;
  }
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  return prisma.videoCategory.update({ where: { id }, data: updateData });
}

/**
 * Delete a category. Posts keep existing — the FK is `onDelete: SetNull`
 * so their videoCategoryId is cleared automatically (videos aren't lost).
 */
export async function deleteCategory(id: number) {
  const existing = await prisma.videoCategory.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Category not found');
  await prisma.videoCategory.delete({ where: { id } });
  return { id };
}
