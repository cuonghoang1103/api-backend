/**
 * CT Work — CTW đợt 7b (C21): KNOWLEDGE BASE cho service desk / cổng khách. Luật chấm điểm ở kbRules.ts.
 *
 *   Bài viết = MỘT trang Docs có sẵn (không chép nội dung — sửa trang là bài cập nhật theo), gắn chuyên mục + từ khoá.
 *   audience CLIENT ⇒ khách cổng thấy — trang PHẢI ở chế độ hiển thị "Client" (cùng luật với Docs: khách chỉ đọc trang
 *   CLIENT); đổi trang về Internal ⇒ bài tự ẩn với khách. audience INTERNAL ⇒ chỉ đội dự án (tra cứu nội bộ của desk).
 *   Trang xoá/ẩn hoặc bài chưa đăng ⇒ khách không thấy, không tìm ra, không bình chọn được (404 như không tồn tại).
 *
 *   Khách (qua /projects/:pid/portal/kb/** — danh sách trắng `/portal/**` của cổng khách):
 *     danh sách + tìm kiếm + chuyên mục · đọc bài (đếm lượt xem) · "Hữu ích / Không" (một phiếu mỗi người, đổi được) ·
 *     gợi ý khi gõ yêu cầu mới (deflection) · "Bài này giải quyết được" ⇒ đếm deflected (không gửi yêu cầu).
 *   Đội dự án (trang /work/<ws>/<KEY>/kb): chuyên mục, thêm trang làm bài, số liệu (xem, hữu ích %, deflection).
 *
 * Xem trước như khách (?as=client) ⇒ thấy đúng như khách, CHỈ ĐỌC (không đếm, không bình chọn).
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { emitWorkEvent } from './events.js';
import { foldVi } from './fold.js';
import { excerpt, rankArticles, tokens } from './kbRules.js';
import { can, isClientScoped, requireProject, type ProjectAccess } from './permissions.js';

type ArticleRow = Prisma.WorkKbArticleGetPayload<{ include: { category: true } }>;
interface PageLite { id: number; number: number; title: string; visibility: string; status: string; contentText: string | null; updatedAt: Date; deletedAt: Date | null }

// ─── Quyền ───────────────────────────────────────────────────────

async function staffCtx(userId: number, projectId: number, edit = false): Promise<ProjectAccess> {
  const access = await requireProject(userId, projectId, edit ? 'page.edit' : 'project.view');
  if (isClientScoped(access) || access.role === 'CLIENT') throw new ForbiddenError('Only the project team can manage the knowledge base');
  return access;
}

/** Ai đang đọc qua cổng: khách thật / nhân viên xem trước (chỉ thấy bài cho khách) / nhân viên (thấy mọi bài đã đăng). */
async function readerCtx(userId: number, projectId: number, asClient: boolean) {
  const access = await requireProject(userId, projectId, 'project.view');
  const scoped = isClientScoped(access) || access.role === 'CLIENT';
  const preview = !scoped && asClient;
  return { access, clientView: scoped || preview, preview };
}

// ─── Dữ liệu ─────────────────────────────────────────────────────

async function pagesById(projectId: number, ids: number[]): Promise<Map<number, PageLite>> {
  if (!ids.length) return new Map();
  const rows = await prisma.workPage.findMany({ where: { projectId, id: { in: ids } }, select: { id: true, number: true, title: true, visibility: true, status: true, contentText: true, updatedAt: true, deletedAt: true } });
  return new Map(rows.map((p) => [p.id, p]));
}

/** Bài khách thấy được: đã đăng + audience CLIENT + trang còn sống ở chế độ CLIENT. */
function visibleTo(a: { published: boolean; audience: string }, page: PageLite | undefined, clientView: boolean): page is PageLite {
  if (!page || page.deletedAt) return false;
  if (!clientView) return true;
  return a.published && a.audience === 'CLIENT' && page.visibility === 'CLIENT';
}

function articleView(a: ArticleRow, page: PageLite, staff: boolean, q = '') {
  const votes = a.helpful + a.notHelpful;
  return {
    id: a.id, title: page.title, pageNumber: page.number, category: a.category ? { id: a.category.id, name: a.category.name } : null,
    excerpt: excerpt(page.contentText ?? '', q), updatedAt: page.updatedAt,
    ...(staff ? {
      audience: a.audience, published: a.published, keywords: a.keywords, pageVisibility: page.visibility, pageStatus: page.status,
      views: a.views, helpful: a.helpful, notHelpful: a.notHelpful, deflected: a.deflected, helpfulPercent: votes ? Math.round((a.helpful / votes) * 100) : null,
      // Bài cho khách mà trang lại Internal ⇒ khách KHÔNG thấy — báo cho đội.
      hiddenFromClients: a.audience === 'CLIENT' && (page.visibility !== 'CLIENT' || !a.published),
    } : {}),
  };
}

async function loadArticles(projectId: number) {
  const rows = await prisma.workKbArticle.findMany({ where: { projectId }, include: { category: true }, orderBy: [{ categoryId: 'asc' }, { id: 'asc' }] });
  const pages = await pagesById(projectId, rows.map((r) => r.pageId));
  return { rows, pages };
}

// ─── Đội dự án ───────────────────────────────────────────────────

export async function overview(userId: number, projectId: number) {
  const access = await staffCtx(userId, projectId);
  const [{ rows, pages }, categories, candidates] = await Promise.all([
    loadArticles(projectId),
    prisma.workKbCategory.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { _count: { select: { articles: true } } } }),
    prisma.workPage.findMany({ where: { projectId, deletedAt: null }, orderBy: { title: 'asc' }, take: 500, select: { id: true, number: true, title: true, visibility: true } }),
  ]);
  const used = new Set(rows.map((r) => r.pageId));
  const articles = rows.filter((r) => { const p = pages.get(r.pageId); return p && !p.deletedAt; }).map((r) => articleView(r, pages.get(r.pageId)!, true));
  return {
    canEdit: can(access.role, 'page.edit', access.options, access.principal),
    categories: categories.map((c) => ({ id: c.id, name: c.name, description: c.description, position: c.position, articles: c._count.articles })),
    articles,
    pages: candidates.filter((p) => !used.has(p.id)).map((p) => ({ number: p.number, title: p.title, visibility: p.visibility })),
    totals: {
      articles: articles.length, forClients: articles.filter((a) => a.audience === 'CLIENT' && !a.hiddenFromClients).length,
      views: articles.reduce((s, a) => s + (a.views ?? 0), 0), deflected: articles.reduce((s, a) => s + (a.deflected ?? 0), 0),
      helpful: articles.reduce((s, a) => s + (a.helpful ?? 0), 0), notHelpful: articles.reduce((s, a) => s + (a.notHelpful ?? 0), 0),
    },
  };
}

export const categoryInput = z.object({ name: z.string().trim().min(1).max(80), description: z.string().max(300).nullable().optional(), position: z.number().int().min(0).max(1000).optional() });

export async function createCategory(userId: number, projectId: number, input: z.infer<typeof categoryInput>) {
  await staffCtx(userId, projectId, true);
  try {
    const c = await prisma.workKbCategory.create({ data: { projectId, name: input.name, description: input.description ?? null, position: input.position ?? (await prisma.workKbCategory.count({ where: { projectId } })) } });
    return { id: c.id, name: c.name, description: c.description, position: c.position };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A category with that name already exists');
    throw err;
  }
}

export async function updateCategory(userId: number, projectId: number, id: number, input: Partial<z.infer<typeof categoryInput>>) {
  await staffCtx(userId, projectId, true);
  const r = await prisma.workKbCategory.updateMany({ where: { id, projectId }, data: { ...(input.name !== undefined ? { name: input.name } : {}), ...(input.description !== undefined ? { description: input.description } : {}), ...(input.position !== undefined ? { position: input.position } : {}) } }).catch((err) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('A category with that name already exists');
    throw err;
  });
  if (!r.count) throw new NotFoundError('Category not found');
  return { ok: true };
}

export async function deleteCategory(userId: number, projectId: number, id: number) {
  await staffCtx(userId, projectId, true);
  const r = await prisma.workKbCategory.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Category not found');
  return { ok: true };
}

export const articleInput = z.object({
  pageNumber: z.number().int().positive(),
  categoryId: z.number().int().positive().nullable().optional(),
  audience: z.enum(['CLIENT', 'INTERNAL']).optional(),
  published: z.boolean().optional(),
  keywords: z.string().max(500).nullable().optional(),
});

async function checkCategory(projectId: number, id: number | null | undefined) {
  if (!id) return;
  if (!(await prisma.workKbCategory.findFirst({ where: { id, projectId }, select: { id: true } }))) throw new BadRequestError('Category not found in this project', 'WORK_KB_BAD_CATEGORY');
}

function assertPageFits(audience: string, page: { visibility: string }) {
  if (audience === 'CLIENT' && page.visibility !== 'CLIENT') {
    throw new BadRequestError('Clients can only read pages shared with them — set the page visibility to "Client" in Docs first, or make this an internal article', 'WORK_KB_PAGE_INTERNAL');
  }
}

export async function addArticle(userId: number, projectId: number, input: z.infer<typeof articleInput>) {
  await staffCtx(userId, projectId, true);
  const page = await prisma.workPage.findFirst({ where: { projectId, number: input.pageNumber, deletedAt: null }, select: { id: true, visibility: true, title: true } });
  if (!page) throw new NotFoundError('Page not found');
  const audience = input.audience ?? (page.visibility === 'CLIENT' ? 'CLIENT' : 'INTERNAL');
  assertPageFits(audience, page);
  await checkCategory(projectId, input.categoryId);
  try {
    const a = await prisma.workKbArticle.create({ data: { projectId, pageId: page.id, categoryId: input.categoryId ?? null, audience, published: input.published ?? true, keywords: input.keywords?.trim() || null, createdById: userId } });
    await auditProject(projectId, { actorId: userId, action: 'kb.add', targetType: 'project', targetId: projectId, summary: `Added "${page.title.slice(0, 120)}" to the knowledge base (${audience.toLowerCase()})` });
    emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
    return { id: a.id };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('This page is already in the knowledge base');
    throw err;
  }
}

export async function updateArticle(userId: number, projectId: number, id: number, input: Partial<Omit<z.infer<typeof articleInput>, 'pageNumber'>>) {
  await staffCtx(userId, projectId, true);
  const a = await prisma.workKbArticle.findFirst({ where: { id, projectId } });
  if (!a) throw new NotFoundError('Article not found');
  const page = (await pagesById(projectId, [a.pageId])).get(a.pageId);
  if (!page || page.deletedAt) throw new NotFoundError('The page of this article was deleted');
  if (input.audience) assertPageFits(input.audience, page);
  await checkCategory(projectId, input.categoryId);
  await prisma.workKbArticle.update({
    where: { id },
    data: {
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}), ...(input.audience ? { audience: input.audience } : {}),
      ...(input.published !== undefined ? { published: input.published } : {}), ...(input.keywords !== undefined ? { keywords: input.keywords?.trim() || null } : {}),
    },
  });
  return { ok: true };
}

export async function removeArticle(userId: number, projectId: number, id: number) {
  await staffCtx(userId, projectId, true);
  const r = await prisma.workKbArticle.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Article not found');
  return { ok: true };
}

// ─── Đọc (khách qua cổng + đội dự án) ────────────────────────────

async function readable(projectId: number, clientView: boolean) {
  const { rows, pages } = await loadArticles(projectId);
  return rows
    .filter((r) => (clientView ? true : r.published) && visibleTo(r, pages.get(r.pageId), clientView))
    .map((r) => ({ row: r, page: pages.get(r.pageId)! }));
}

export async function browse(userId: number, projectId: number, q: { q?: string; category?: number; asClient?: boolean } = {}) {
  const ctx = await readerCtx(userId, projectId, q.asClient === true);
  const list = await readable(projectId, ctx.clientView);
  const inCat = q.category ? list.filter((x) => x.row.categoryId === q.category) : list;
  const query = (q.q ?? '').trim();
  const ordered = query
    ? rankArticles(inCat.map((x) => ({ id: x.row.id, title: x.page.title, content: x.page.contentText ?? '', keywords: x.row.keywords, helpful: x.row.helpful, notHelpful: x.row.notHelpful })), query, { limit: 50 })
      .map((r) => inCat.find((x) => x.row.id === r.id)!)
    : inCat;
  const cats = new Map<number, { id: number; name: string; description: string | null; count: number }>();
  for (const x of list) if (x.row.category) { const c = cats.get(x.row.category.id) ?? { id: x.row.category.id, name: x.row.category.name, description: x.row.category.description, count: 0 }; c.count += 1; cats.set(c.id, c); }
  return {
    query, categories: [...cats.values()].sort((a, b) => a.name.localeCompare(b.name)),
    articles: ordered.map((x) => articleView(x.row, x.page, false, query)),
    total: list.length,
  };
}

async function articleFor(projectId: number, id: number, clientView: boolean) {
  const a = await prisma.workKbArticle.findFirst({ where: { id, projectId }, include: { category: true } });
  const page = a ? (await pagesById(projectId, [a.pageId])).get(a.pageId) : undefined;
  if (!a || !visibleTo(a, page, clientView) || (!clientView && !a.published)) throw new NotFoundError('Article not found');
  return { a, page: page! };
}

export async function readArticle(userId: number, projectId: number, id: number, opts: { asClient?: boolean } = {}) {
  const ctx = await readerCtx(userId, projectId, opts.asClient === true);
  const { a, page } = await articleFor(projectId, id, ctx.clientView);
  const full = await prisma.workPage.findUniqueOrThrow({ where: { id: page.id }, select: { contentJson: true } });
  if (!ctx.preview) await prisma.workKbArticle.update({ where: { id: a.id }, data: { views: { increment: 1 } } });
  const mine = await prisma.workKbVote.findUnique({ where: { articleId_userId: { articleId: a.id, userId } } }).catch(() => null);
  const related = (await readable(projectId, ctx.clientView)).filter((x) => x.row.id !== a.id && (x.row.categoryId === a.categoryId || tokens(`${page.title} ${a.keywords ?? ''}`).some((t) => foldVi(x.page.title).includes(t)))).slice(0, 5);
  return {
    ...articleView(a, page, false), contentJson: full.contentJson, myVote: mine ? (mine.helpful ? 'HELPFUL' : 'NOT_HELPFUL') : null, canVote: !ctx.preview,
    related: related.map((x) => ({ id: x.row.id, title: x.page.title })),
  };
}

export async function vote(userId: number, projectId: number, id: number, helpful: boolean, opts: { asClient?: boolean } = {}) {
  const ctx = await readerCtx(userId, projectId, opts.asClient === true);
  if (ctx.preview) throw new BadRequestError('Preview as client is read-only', 'WORK_PREVIEW_READONLY');
  const { a } = await articleFor(projectId, id, ctx.clientView);
  await prisma.$transaction(async (tx) => {
    await tx.workKbVote.upsert({ where: { articleId_userId: { articleId: a.id, userId } }, create: { articleId: a.id, userId, helpful }, update: { helpful } });
    // Đếm lại từ phiếu (không cộng dồn) ⇒ đổi phiếu không làm lệch số.
    const [yes, no] = await Promise.all([tx.workKbVote.count({ where: { articleId: a.id, helpful: true } }), tx.workKbVote.count({ where: { articleId: a.id, helpful: false } })]);
    await tx.workKbArticle.update({ where: { id: a.id }, data: { helpful: yes, notHelpful: no } });
  });
  return { ok: true, myVote: helpful ? 'HELPFUL' : 'NOT_HELPFUL' };
}

/** Gợi ý khi khách gõ yêu cầu (deflection) — tối đa 5 bài đủ liên quan. */
export async function suggest(userId: number, projectId: number, q: string, opts: { asClient?: boolean } = {}) {
  const ctx = await readerCtx(userId, projectId, opts.asClient === true);
  if (tokens(q).length === 0) return { articles: [] };
  const list = await readable(projectId, ctx.clientView);
  const ranked = rankArticles(list.map((x) => ({ id: x.row.id, title: x.page.title, content: x.page.contentText ?? '', keywords: x.row.keywords, helpful: x.row.helpful, notHelpful: x.row.notHelpful })), q, { limit: 5, deflect: true });
  return { articles: ranked.map((r) => ({ id: r.id, title: r.title, excerpt: excerpt(r.content, q, 160) })) };
}

/** Khách bấm "Bài này giải quyết được" trong form yêu cầu ⇒ đếm một lần deflection (không tạo yêu cầu). */
export async function markDeflected(userId: number, projectId: number, id: number, opts: { asClient?: boolean } = {}) {
  const ctx = await readerCtx(userId, projectId, opts.asClient === true);
  if (ctx.preview) throw new BadRequestError('Preview as client is read-only', 'WORK_PREVIEW_READONLY');
  const { a } = await articleFor(projectId, id, ctx.clientView);
  await prisma.workKbArticle.update({ where: { id: a.id }, data: { deflected: { increment: 1 } } });
  return { ok: true };
}
