/**
 * Content Creator — Idea Bank service helpers.
 *
 * Phase 5. Lightweight CRUD + the special "promote to
 * ContentProject" transition. The ideas table is much
 * smaller than ContentProject so the helpers here are
 * trivial, but we still want a single place that owns
 * the queries (route handler stays thin).
 *
 * Why "promote" needs care
 * ─────────────────────────
 * The user clicks "Promote to project" on a card. We:
 * 1. Create a new ContentProject (status=IDEA) seeded
 * from the idea's title/hook/notes/tags.
 * 2. Update the idea: status=PROMOTED,
 * promotedToProjectId=<new id>, promotedAt=now.
 * Both writes need to land atomically — otherwise the
 * idea could end up marked PROMOTED but pointing at a
 * non-existent project id (or vice versa). We do them
 * in a single `prisma.$transaction`.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';

/** Input shape for `createIdea`. Mirrors the model's
 * writable fields — anything that should be set by the
 * server defaults (status, createdAt, updatedAt) is
 * omitted. */
export type CreateIdeaInput = {
 title: string;
 hook?: string | null;
 notes?: string | null;
 score?: number | null;
 suggestedType?:
 | 'VLOG'
 | 'AFFILIATE'
 | 'CODE'
 | 'REVIEW'
 | 'IDEA'
 | 'OTHER'
 | null;
 tags?: string[];
};

/** Update shape — every field optional so the editor can
 * PATCH any subset. Same convention as the project
 * PATCH. */
export type UpdateIdeaInput = Partial<CreateIdeaInput> & {
 status?: 'CAPTURED' | 'REFINED' | 'PROMOTED' | 'ARCHIVED';
};

/** Build the Prisma `where` fragment for a list query.
 * Kept as a helper so the route handler stays
 * declarative. */
export function buildIdeaListWhere(params: {
 status?: 'CAPTURED' | 'REFINED' | 'PROMOTED' | 'ARCHIVED';
 search?: string;
 tag?: string;
}): Prisma.ContentIdeaWhereInput {
 const where: Prisma.ContentIdeaWhereInput = {};
 if (params.status) where.status = params.status;
 if (params.tag) where.tags = { has: params.tag };
 if (params.search) {
 const q = params.search.trim();
 if (q.length > 0) {
 where.OR = [
 { title: { contains: q, mode: 'insensitive' } },
 { hook: { contains: q, mode: 'insensitive' } },
 { notes: { contains: q, mode: 'insensitive' } },
 ];
 }
 }
 return where;
}

/** Lightweight list query (no child relations — ideas
 * are flat, no need to JOIN). */
export async function listIdeas(params: {
 status?: 'CAPTURED' | 'REFINED' | 'PROMOTED' | 'ARCHIVED';
 search?: string;
 tag?: string;
 take?: number;
 skip?: number;
}) {
 const where = buildIdeaListWhere(params);
 const [items, total] = await prisma.$transaction([
 prisma.contentIdea.findMany({
 where,
 orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
 take: Math.min(params.take ?? 50, 200),
 skip: params.skip ?? 0,
 }),
 prisma.contentIdea.count({ where }),
 ]);
 return { items, total };
}

export async function getIdea(id: number) {
 return prisma.contentIdea.findUnique({ where: { id } });
}

export async function createIdea(input: CreateIdeaInput) {
 return prisma.contentIdea.create({
 data: {
 title: input.title,
 hook: input.hook ?? null,
 notes: input.notes ?? null,
 score: input.score ?? null,
 suggestedType: input.suggestedType ?? null,
 tags: input.tags ?? [],
 },
 });
}

export async function updateIdea(id: number, input: UpdateIdeaInput) {
 // Strip undefined values so Prisma doesn't try to
 // `set undefined` on optional fields. Anything that
 // is `null` should clear, anything that is a string
 // or array should replace.
 const data: Prisma.ContentIdeaUpdateInput = {};
 if (input.title !== undefined) data.title = input.title;
 if (input.hook !== undefined) data.hook = input.hook;
 if (input.notes !== undefined) data.notes = input.notes;
 if (input.score !== undefined) data.score = input.score;
 if (input.suggestedType !== undefined) {
 data.suggestedType = input.suggestedType;
 }
 if (input.tags !== undefined) data.tags = input.tags;
 if (input.status !== undefined) data.status = input.status;
 return prisma.contentIdea.update({ where: { id }, data });
}

export async function deleteIdea(id: number) {
 // Null out the back-pointer on the project first so
 // the project doesn't keep a dangling reference (we
 // set the FK on the project side to null on idea
 // delete, but the field on the project is the array
 // of promotedFromIdeas — disconnect keeps the project
 // alive but unlinks the idea).
 await prisma.contentIdea.update({
 where: { id },
 data: { promotedToProject: { disconnect: true } },
 });
 return prisma.contentIdea.delete({ where: { id } });
}

/** Promote an idea to a brand-new ContentProject.
 *
 * Returns `{ idea, project }` so the route can navigate
 * the user to the new project editor in one go.
 *
 * Rules:
 * - The new project starts in status=IDEA (the user
 * just clicked "promote" — it hasn't been touched).
 * - The new project's `type` is taken from
 * `idea.suggestedType`, falling back to OTHER.
 * - Title comes from idea.title; mainHook from
 * idea.hook; concept from idea.notes (long form
 * makes a decent opening concept paragraph).
 * - Tags are copied.
 * - The idea is marked PROMOTED and gets a back-
 * pointer to the new project.
 */
export async function promoteIdea(ideaId: number) {
 const idea = await prisma.contentIdea.findUnique({
 where: { id: ideaId },
 });
 if (!idea) {
 const err = new Error('Idea not found');
 (err as Error & { statusCode?: number }).statusCode = 404;
 throw err;
 }
 if (idea.promotedToProjectId) {
 const err = new Error('Idea already promoted');
 (err as Error & { statusCode?: number }).statusCode = 409;
 throw err;
 }

 return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
 // Generate a slug from the title. The project model
 // has a unique constraint on slug, so we just use
 // the title verbatim; admin/projects/[id] will rename
 // if there's a collision. The editor handles 409
 // gracefully by letting the user tweak the title.
 const slug = slugifyIdeaTitle(idea.title);

 const project = await tx.contentProject.create({
 data: {
 slug,
 title: idea.title,
 type: idea.suggestedType ?? 'OTHER',
 status: 'IDEA',
 // Reuse the idea's date as the ideaDate so the
 // timeline makes sense (this is "when the user
 // first thought of it").
 ideaDate: idea.createdAt,
 // Hoist the idea's free-form notes into the
 // `concept` slot. It's the closest semantic
 // match (a long-form description) and the user
 // can rewrite it inside the editor.
 concept: idea.notes,
 mainHook: idea.hook,
 tags: idea.tags,
 },
 });

 const updated = await tx.contentIdea.update({
 where: { id: idea.id },
 data: {
 status: 'PROMOTED',
 promotedToProjectId: project.id,
 promotedAt: new Date(),
 },
 });

 return { idea: updated, project };
 });
}

/** Turn an idea title into a URL-safe slug. Mirrors
 * `slugify` in `content.service.ts` but inlined here
 * so the idea routes don't have to import the project
 * service. */
function slugifyIdeaTitle(input: string): string {
 return input
 .toLowerCase()
 .trim()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '')
 .replace(/[^a-z0-9]+/g, '-')
 .replace(/^-+|-+$/g, '')
 .slice(0, 100);
}
