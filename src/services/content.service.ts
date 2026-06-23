/**
 * Content Creator service helpers.
 *
 * Owns the two reusable building blocks used by the admin
 * content routes:
 * • `replaceChildren` — idempotent list re-sync. Pass a fresh
 * array from the editor, we delete children that are no
 * longer in the list and upsert the rest. This is the same
 * pattern admin.projects uses for milestones/features/etc.
 * and is what gives us "no duplicates, no data loss" on
 * rapid autosave.
 * • `slugify` + `ensureUniqueContentSlug` — slug generation
 * for the editor. Mirrors `admin.routes.ts` style.
 *
 * Kept deliberately small — anything model-specific (e.g.
 * computing the next order, mapping JSON columns) lives in the
 * route handler so the service stays generic.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

// ─── slug helpers ────────────────────────────────────────────────────────────

export function slugify(value: string): string {
 return value
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '')
 .toLowerCase()
 .trim()
 .replace(/[^a-z0-9\s-]/g, '')
 .replace(/\s+/g, '-')
 .replace(/-+/g, '-');
}

/**
 * Resolve a unique slug for a content project. If the base is
 * already taken (by another project, since `slug` is unique) we
 * append `-2`, `-3`, ... until a free slot is found. Passing
 * `excludeId` lets PUT keep the same slug when the title hasn't
 * changed.
 */
export async function ensureUniqueContentSlug(
 baseValue: string,
 excludeId?: number,
): Promise<string> {
 const base = slugify(baseValue) || `content-${Date.now()}`;
 let candidate = base;
 let suffix = 2;

 // Cap retries to avoid an infinite loop on a malicious seed.
 while (suffix < 1000) {
 const conflict = await prisma.contentProject.findFirst({
 where: {
 slug: candidate,
 ...(excludeId ? { NOT: { id: excludeId } } : {}),
 },
 select: { id: true },
 });
 if (!conflict) return candidate;
 candidate = `${base}-${suffix++}`;
 }
 throw new AppError('Could not allocate a unique slug', 500, 'SLUG_RETRIES_EXHAUSTED');
}

// ─── replaceChildren ─────────────────────────────────────────────────────────

/**
 * Idempotent list sync for one-to-many children.
 *
 * The pattern: the client always sends the *full* desired list
 * for a child relation. We diff against the existing rows in
 * the DB and:
 * • rows present in DB but missing from payload → delete
 * • rows present in both → upsert (preserves id, updates fields)
 * • rows missing in DB but in payload → create
 *
 * Why this is the right shape for an autosaving editor:
 * 1. Re-ordering is just "send the list in the new order";
 * we rewrite `order` on every row in a single transaction.
 * 2. Deleting a row is just "omit it from the list"; no
 * DELETE call needed from the client.
 * 3. Resubmitting the same payload is a no-op (everything
 * upserts to its existing values).
 *
 * `items` is an array of objects that *must* include an `id`
 * for existing rows. The helper accepts a single `id` value of
 * `string | number | undefined` — we coerce to number.
 *
 * `createData(item)` / `updateData(item)` translate the client
 * payload into the Prisma input shape. They are split so the
 * caller can omit generated/default fields from `create` (e.g.
 * the parent FK, the timestamp).
 */
export type ReplaceableChild = { id?: number | string | null } & Record<string, unknown>;

type Delegate = {
 findMany: (args: { where: Record<string, unknown>; select: { id: true } }) => Promise<Array<{ id: number }>>;
 create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
 update: (args: { where: { id: number }; data: Record<string, unknown> }) => Promise<unknown>;
 deleteMany: (args: { where: { id: { in: number[] } } }) => Promise<unknown>;
};

export interface ReplaceChildrenConfig<T extends ReplaceableChild> {
 /** Prisma model delegate (e.g. prisma.productionDay). */
 delegate: Delegate;
 /** Where-clause fragment selecting the parent's children (e.g. { projectId: id }). */
 parentWhere: Record<string, unknown>;
 /** Full desired state from the client. */
 items: T[];
 /** Translate an item to Prisma.create input (no id/timestamps). */
 createData: (item: T, order: number) => Record<string, unknown>;
 /** Translate an item to Prisma.update input (no id). */
 updateData: (item: T, order: number) => Record<string, unknown>;
 /** Whether to delete rows that are absent from `items`. Default: true. */
 deleteMissing?: boolean;
}

export async function replaceChildren<T extends ReplaceableChild>(
 config: ReplaceChildrenConfig<T>,
): Promise<void> {
 const { delegate, parentWhere, items, createData, updateData, deleteMissing = true } = config;

 // 1. Read existing child ids.
 const existing = await delegate.findMany({ where: parentWhere, select: { id: true } });
 const existingIds = new Set(existing.map((r) => r.id));

 // 2. Build the set of ids the client wants to keep.
 const payloadIds = new Set<number>();
 for (const item of items) {
 if (item.id == null) continue;
 const numeric = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
 if (Number.isFinite(numeric) && numeric > 0) payloadIds.add(numeric);
 }

 // 3. Delete rows that exist in DB but not in payload.
 if (deleteMissing) {
 const toDelete = [...existingIds].filter((id) => !payloadIds.has(id));
 if (toDelete.length > 0) {
 await delegate.deleteMany({ where: { id: { in: toDelete } } });
 }
 }

 // 4. Upsert remaining rows in payload order.
 for (let i = 0; i < items.length; i += 1) {
 const item = items[i];
 const order = i;
 const numericId =
 item.id == null
 ? null
 : typeof item.id === 'string'
 ? parseInt(item.id, 10)
 : item.id;

 if (numericId && existingIds.has(numericId)) {
 await delegate.update({ where: { id: numericId }, data: updateData(item, order) });
 } else {
 await delegate.create({ data: createData(item, order) });
 }
 }
}

// ─── JSON column helpers ─────────────────────────────────────────────────────

/**
 * Coerce an incoming value into a Prisma.InputJsonValue. We
 * accept `null`/`undefined` (treated as "don't touch") and any
 * JSON-serialisable object; strings/arrays are passed through
 * after a defensive `JSON.parse` to normalise them.
 */
export function toJsonInput(
 value: unknown,
): { ok: true; value: Prisma.InputJsonValue | typeof Prisma.JsonNull | null } | { ok: false; reason: string } {
 if (value === undefined) return { ok: true, value: null };
 if (value === null) return { ok: true, value: Prisma.JsonNull };
 if (typeof value === 'string') {
 try {
 const parsed = JSON.parse(value);
 return { ok: true, value: parsed as Prisma.InputJsonValue };
 } catch {
 return { ok: false, reason: 'Invalid JSON string' };
 }
 }
 // Arrays / objects: trust the client shape, Prisma will reject
 // any non-JSON-serialisable values itself.
 try {
 JSON.stringify(value);
 return { ok: true, value: value as Prisma.InputJsonValue };
 } catch {
 return { ok: false, reason: 'Value is not JSON-serialisable' };
 }
}

// ─── date helpers ────────────────────────────────────────────────────────────

/**
 * Convert a date-shaped input to a JS Date or null.
 *
 * • null / undefined / '' → null
 * • ISO string or timestamp number → new Date(value)
 * • Anything else → null (we don't throw; the editor's
 * date picker never produces garbage, and bad input should
 * fail loudly at the DB level via Prisma's type check).
 */
export function toDateOrNull(value: unknown): Date | null {
 if (value == null || value === '') return null;
 if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
 if (typeof value === 'number' || typeof value === 'string') {
 const d = new Date(value);
 return Number.isNaN(d.getTime()) ? null : d;
 }
 return null;
}

/**
 * Phase 7: shape `ContentPerformance` for the editor.
 *
 * The Prisma model uses flat `views / likes / comments / shares`
 * column names (because that's what the DB has stored since
 * the original schema). The editor speaks in *total* semantics
 * (`totalViews / totalLikes / ...`) so the UI labels stay
 * consistent regardless of which project / which page renders
 * the metrics.
 *
 * We also normalise `platformMetrics` from `Json` to a plain
 * object so the React tree can `.map` over it without worrying
 * about Prisma's `JsonValue` type union.
 */
export function shapePerformance<
 T extends {
 views: number;
 likes: number;
 comments: number;
 shares: number;
 ctr: number | null;
 watchTimeSec: number | null;
 platformMetrics: unknown;
 lessonsLearned: string | null;
 }
>(p: T) {
 return {
 ...p,
 totalViews: p.views,
 totalLikes: p.likes,
 totalComments: p.comments,
 totalShares: p.shares,
 platformMetrics:
 p.platformMetrics && typeof p.platformMetrics === 'object'
 ? (p.platformMetrics as Record<string, unknown>)
 : null,
 };
}
