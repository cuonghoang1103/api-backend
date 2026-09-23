/**
 * CT Work — tìm thẻ ở MỌI dự án người gọi xem được (trang /work/search + ⌘K).
 *
 *   GET /work/search?jql=&q=&limit=&offset=
 *   GET /work/search/facets
 *
 * Nguyên tắc:
 *   - Quyền: chỉ dự án mà effectiveProjectRole() cho vai trò (cùng một luật với
 *     loadProjectAccess) — không bao giờ lộ dự án người gọi không thấy.
 *     Dự án lưu trữ bị bỏ, TRỪ khi được gọi tên ở `project = X` / `project IN (…)`.
 *   - JQL dịch THEO TỪNG dự án (tên trạng thái/loại/nhãn tra trong dự án đó).
 *     Tên vắng mặt ở một dự án ⇒ dự án đó khớp rỗng; chỉ báo lỗi khi tên vắng
 *     mặt ở MỌI dự án được quét (kèm "did you mean").
 *   - Dự án cho ra cùng một điều kiện (vd `priority = High`) gộp thành một câu
 *     truy vấn; điều kiện "không khớp gì" thì bỏ hẳn dự án đó.
 *   - Phân trang xuyên dự án: mỗi nhóm lấy (offset + limit) dòng đầu theo đúng
 *     thứ tự, trộn trong bộ nhớ rồi cắt. Trần: 200 dự án, 1000 dòng sâu.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { PUBLIC_USER } from './common.js';
import type { ProjectRole, ProjectVisibility, WorkspaceRole } from './constants.js';
import {
  compileJql, JqlError, normalizeField, ORDERABLE_FIELDS, parseJql, projectScope, quoteIfNeeded, suggest,
  type JqlContext, type JqlMiss, type JqlNode, type JqlQuery,
} from './jql.js';
import { effectiveProjectRole } from './permissions.js';
import { jqlHttpError } from './search.service.js';

export const MAX_PROJECTS = 200;
export const MAX_LIMIT = 100;
/** offset + limit tối đa — sâu hơn thì phải thu hẹp truy vấn. */
export const MAX_DEPTH = 1000;
const POOL = 6;

type W = Prisma.WorkIssueWhereInput;

// ─── Dự án thấy được ─────────────────────────────────────────────

export interface VisibleProject {
  id: number;
  key: string;
  name: string;
  archived: boolean;
  updatedAt: Date;
  workspace: { id: number; slug: string; name: string };
}

/** Mọi dự án (kể cả lưu trữ) người gọi có vai trò — cùng luật với loadProjectAccess. */
export async function visibleProjects(userId: number): Promise<VisibleProject[]> {
  const ms = await prisma.workMember.findMany({
    where: { userId, workspace: { deletedAt: null } },
    select: {
      role: true,
      workspace: {
        select: {
          id: true, slug: true, name: true,
          projects: {
            where: { deletedAt: null },
            select: { id: true, key: true, name: true, visibility: true, archivedAt: true, updatedAt: true, members: { where: { userId }, select: { role: true } } },
          },
        },
      },
    },
  });
  const out: VisibleProject[] = [];
  for (const m of ms) {
    for (const p of m.workspace.projects) {
      const role = effectiveProjectRole({
        workspaceRole: m.role as WorkspaceRole,
        projectRole: (p.members[0]?.role ?? null) as ProjectRole | null,
        visibility: p.visibility as ProjectVisibility,
      });
      if (!role) continue;
      out.push({
        id: p.id, key: p.key, name: p.name, archived: !!p.archivedAt, updatedAt: p.updatedAt,
        workspace: { id: m.workspace.id, slug: m.workspace.slug, name: m.workspace.name },
      });
    }
  }
  return out;
}

// ─── Bảng tra JQL cho nhiều dự án (mỗi bảng MỘT câu truy vấn) ─────

async function batchContexts(userId: number, projects: VisibleProject[], known: string[], onMissing: (m: JqlMiss) => void) {
  const ids = projects.map((p) => p.id);
  const wsIds = [...new Set(projects.map((p) => p.workspace.id))];
  const [statuses, types, labels, components, sprints, fields, members] = await Promise.all([
    prisma.workStatus.findMany({ where: { workflow: { projectId: { in: ids } } }, select: { id: true, name: true, category: true, workflow: { select: { projectId: true } } } }),
    prisma.workIssueType.findMany({ where: { projectId: { in: ids } }, select: { id: true, key: true, name: true, projectId: true } }),
    prisma.workLabel.findMany({ where: { projectId: { in: ids } }, select: { id: true, name: true, projectId: true } }),
    prisma.workComponent.findMany({ where: { projectId: { in: ids } }, select: { id: true, name: true, projectId: true } }),
    prisma.workSprint.findMany({ where: { projectId: { in: ids } }, select: { id: true, name: true, state: true, projectId: true } }),
    prisma.workCustomField.findMany({ where: { projectId: { in: ids } }, select: { id: true, name: true, kind: true, options: true, projectId: true } }),
    // Người theo KHÔNG GIAN: `assignee = bob` ở dự án bob không vào được thì khớp rỗng, không sao.
    prisma.workMember.findMany({ where: { workspaceId: { in: wsIds } }, select: { workspaceId: true, user: { select: { id: true, username: true } } } }),
  ]);
  const by = <T, K>(rows: T[], key: (r: T) => K) => {
    const m = new Map<K, T[]>();
    for (const r of rows) m.set(key(r), [...(m.get(key(r)) ?? []), r]);
    return m;
  };
  const st = by(statuses, (s) => s.workflow.projectId);
  const ty = by(types, (t) => t.projectId);
  const lb = by(labels, (l) => l.projectId);
  const cp = by(components, (c) => c.projectId);
  const sp = by(sprints, (s) => s.projectId);
  const cf = by(fields, (f) => f.projectId);
  const mb = by(members, (m) => m.workspaceId);
  const now = new Date();
  return new Map<number, JqlContext>(projects.map((p) => [p.id, {
    projectKey: p.key, projectName: p.name, userId, now, knownProjects: known, onMissing,
    statuses: (st.get(p.id) ?? []).map(({ id, name, category }) => ({ id, name, category })),
    types: (ty.get(p.id) ?? []).map(({ id, key, name }) => ({ id, key, name })),
    labels: (lb.get(p.id) ?? []).map(({ id, name }) => ({ id, name })),
    components: (cp.get(p.id) ?? []).map(({ id, name }) => ({ id, name })),
    sprints: (sp.get(p.id) ?? []).map(({ id, name, state }) => ({ id, name, state })),
    customFields: (cf.get(p.id) ?? []).map((f) => ({ id: f.id, name: f.name, kind: f.kind, options: (f.options as Array<{ id: string; label: string }>) ?? [] })),
    members: (mb.get(p.workspace.id) ?? []).map((m) => m.user),
  }]));
}

// ─── Sắp xếp xuyên dự án ─────────────────────────────────────────

type OrderField = (typeof ORDERABLE_FIELDS)[number];
interface OrderSpec { field: OrderField; dir: 'asc' | 'desc' }

const ROW_SELECT = {
  id: true, number: true, title: true, priority: true, storyPoints: true, dueDate: true, resolvedAt: true,
  createdAt: true, updatedAt: true, rank: true, projectId: true,
  status: { select: { id: true, name: true, category: true, color: true } },
  type: { select: { id: true, key: true, name: true, icon: true, color: true } },
  assignee: { select: PUBLIC_USER },
  project: { select: { key: true } },
} satisfies Prisma.WorkIssueSelect;
type Row = Prisma.WorkIssueGetPayload<{ select: typeof ROW_SELECT }>;

/** ORDER BY của Prisma KHỚP với bộ so sánh bên dưới — lệch nhau là trộn trang sai. */
function dbOrder(order: OrderSpec[]): Prisma.WorkIssueOrderByWithRelationInput[] {
  const out: Prisma.WorkIssueOrderByWithRelationInput[] = [];
  for (const { field, dir } of order) {
    switch (field) {
      case 'key': out.push({ project: { key: dir } }, { projectId: dir }, { number: dir }); break;
      case 'project': out.push({ project: { key: dir } }); break;
      case 'priority': out.push({ priority: dir }); break;
      case 'created': out.push({ createdAt: dir }); break;
      case 'updated': out.push({ updatedAt: dir }); break;
      case 'due': out.push({ dueDate: { sort: dir, nulls: 'last' } }); break;
      case 'resolved': out.push({ resolvedAt: { sort: dir, nulls: 'last' } }); break;
      case 'points': out.push({ storyPoints: { sort: dir, nulls: 'last' } }); break;
      case 'summary': out.push({ title: dir }); break;
      case 'status': out.push({ status: { name: dir } }); break;
      case 'assignee': out.push({ assignee: { username: dir } }); break;
      case 'rank': out.push({ rank: dir }); break;
    }
  }
  return [...out, { project: { key: 'asc' } }, { projectId: 'asc' }, { number: 'asc' }];
}

const txt = (a: string, b: string) => a.localeCompare(b, 'en', { sensitivity: 'base' });

function compareRows(order: OrderSpec[]) {
  // Null: Postgres mặc định ASC ⇒ null cuối, DESC ⇒ null đầu; cột có `nulls: 'last'` luôn cuối.
  const cmpNullable = <T>(a: T | null, b: T | null, dir: 'asc' | 'desc', f: (x: T, y: T) => number, nullsLast: boolean) => {
    if (a === null && b === null) return 0;
    if (a === null) return nullsLast || dir === 'asc' ? 1 : -1;
    if (b === null) return nullsLast || dir === 'asc' ? -1 : 1;
    const r = f(a, b);
    return dir === 'asc' ? r : -r;
  };
  const num = (x: number, y: number) => x - y;
  const time = (x: Date, y: Date) => x.getTime() - y.getTime();
  return (a: Row, b: Row): number => {
    for (const { field, dir } of order) {
      let r = 0;
      switch (field) {
        case 'key': r = cmpNullable(a.project.key, b.project.key, dir, txt, false) || cmpNullable(a.projectId, b.projectId, dir, num, false) || cmpNullable(a.number, b.number, dir, num, false); break;
        case 'project': r = cmpNullable(a.project.key, b.project.key, dir, txt, false); break;
        case 'priority': r = cmpNullable(a.priority, b.priority, dir, num, false); break;
        case 'created': r = cmpNullable(a.createdAt, b.createdAt, dir, time, false); break;
        case 'updated': r = cmpNullable(a.updatedAt, b.updatedAt, dir, time, false); break;
        case 'due': r = cmpNullable(a.dueDate, b.dueDate, dir, time, true); break;
        case 'resolved': r = cmpNullable(a.resolvedAt, b.resolvedAt, dir, time, true); break;
        case 'points': r = cmpNullable(a.storyPoints, b.storyPoints, dir, num, true); break;
        case 'summary': r = cmpNullable(a.title, b.title, dir, txt, false); break;
        case 'status': r = cmpNullable(a.status.name, b.status.name, dir, txt, false); break;
        case 'assignee': r = cmpNullable(a.assignee?.username ?? null, b.assignee?.username ?? null, dir, txt, false); break;
        case 'rank': r = cmpNullable(a.rank, b.rank, dir, (x, y) => (x < y ? -1 : x > y ? 1 : 0), false); break;
      }
      if (r) return r;
    }
    return txt(a.project.key, b.project.key) || a.projectId - b.projectId || a.number - b.number;
  };
}

// ─── Tiện ích ────────────────────────────────────────────────────

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++;
      out[k] = await fn(items[k]);
    }
  }));
  return out;
}

function eachClause(n: JqlNode | null, fn: (c: Extract<JqlNode, { kind: 'clause' }>) => void) {
  if (!n) return;
  if (n.kind === 'clause') fn(n);
  else if (n.kind === 'not') eachClause(n.child, fn);
  else n.children.forEach((c) => eachClause(c, fn));
}

const NONE_JSON = JSON.stringify({ id: { in: [] } });
const KEY_RE = /^([A-Za-z][A-Za-z0-9]*)-(\d+)$/;

function parseOrThrow(jql: string): JqlQuery {
  try {
    return parseJql(jql.slice(0, 4000));
  } catch (err) {
    if (err instanceof JqlError) throw jqlHttpError(err);
    throw err;
  }
}

// ─── Tìm ─────────────────────────────────────────────────────────

export interface GlobalSearchInput { jql?: string; q?: string; limit?: number; offset?: number }

export type MatchKind = 'key' | 'title' | 'description';

export async function globalSearch(userId: number, input: GlobalSearchInput) {
  const limit = Math.min(Math.max(input.limit ?? 50, 1), MAX_LIMIT);
  const offset = Math.min(Math.max(input.offset ?? 0, 0), MAX_DEPTH - limit);
  const need = offset + limit;
  const q = (input.q ?? '').trim().slice(0, 200);
  const parsed = parseOrThrow(input.jql ?? '');

  const all = await visibleProjects(userId);
  const known = [...new Set(all.flatMap((p) => [p.key, p.name]))];
  const lc = (s: string) => s.toLowerCase();

  // `project = X` với X không thuộc dự án nào thấy được ⇒ lỗi ngay (kể cả khi lọc trước ra rỗng).
  eachClause(parsed.where, (c) => {
    if (normalizeField(c.field) !== 'project') return;
    for (const v of c.values) {
      if (v.kind !== 'literal' || known.some((k) => lc(k) === lc(v.value))) continue;
      const hit = suggest(v.value, known);
      throw jqlHttpError(new JqlError(hit ? `No project "${v.value}". Did you mean ${quoteIfNeeded(hit)}?` : `No project "${v.value}"`, v.pos ?? c.pos, hit ? quoteIfNeeded(hit) : undefined));
    }
  });

  // ORDER BY: kiểm tên trường trước khi quét (lỗi trỏ đúng chỗ).
  const order: OrderSpec[] = parsed.orderBy.map((o, i) => {
    const f = (normalizeField(o.field) ?? lc(o.field)) as OrderField;
    if ((ORDERABLE_FIELDS as readonly string[]).includes(f)) return { field: f, dir: o.dir };
    const hit = suggest(o.field, [...ORDERABLE_FIELDS]);
    throw jqlHttpError(new JqlError(hit ? `Cannot order by "${o.field}". Did you mean ${hit}?` : `Cannot order by "${o.field}"`, parsed.orderPos?.[i] ?? 0, hit));
  });
  const ranked = !!q && !order.length; // có q mà không ORDER BY ⇒ xếp theo độ khớp
  const effOrder: OrderSpec[] = order.length ? order : [{ field: 'updated', dir: 'desc' }];

  // Phạm vi dự án.
  const scope = projectScope(parsed);
  const named = (p: VisibleProject, names: string[]) => names.includes(lc(p.key)) || names.includes(lc(p.name));
  let targets = all.filter((p) => (scope.include ? named(p, scope.include) : !p.archived) && !named(p, scope.exclude));
  targets.sort((a, b) => Number(a.archived) - Number(b.archived) || b.updatedAt.getTime() - a.updatedAt.getTime());
  const truncated = targets.length > MAX_PROJECTS;
  targets = targets.slice(0, MAX_PROJECTS);
  const byId = new Map(targets.map((p) => [p.id, p]));
  const empty = { items: [], total: 0, offset, limit, hasMore: false, projectsSearched: targets.length, truncated, ranked };
  if (!targets.length) return empty;

  // Dịch JQL theo từng dự án, gộp dự án cùng điều kiện.
  let groups: Array<{ ids: number[]; where: W }>;
  if (!parsed.where) {
    groups = [{ ids: targets.map((p) => p.id), where: {} }];
  } else {
    const misses = new Map<number, { miss: JqlMiss; count: number; candidates: Set<string> }>();
    let current = 0;
    const seen = new Set<string>();
    const onMissing = (m: JqlMiss) => {
      // Một dự án chỉ tính một lần cho mỗi vị trí.
      const tag = `${current}:${m.pos}`;
      if (seen.has(tag)) return;
      seen.add(tag);
      const e = misses.get(m.pos) ?? { miss: m, count: 0, candidates: new Set<string>() };
      e.count += 1;
      m.candidates.forEach((c) => e.candidates.add(c));
      misses.set(m.pos, e);
    };
    const ctxs = await batchContexts(userId, targets, known, onMissing);
    const byWhere = new Map<string, { ids: number[]; where: W }>();
    try {
      for (const p of targets) {
        current = p.id;
        const { where } = compileJql(parsed, ctxs.get(p.id)!);
        const k = JSON.stringify(where);
        if (k === NONE_JSON) continue;
        const g = byWhere.get(k) ?? { ids: [], where };
        g.ids.push(p.id);
        byWhere.set(k, g);
      }
    } catch (err) {
      if (err instanceof JqlError) throw jqlHttpError(err);
      throw err;
    }
    // Tên vắng mặt ở MỌI dự án được quét ⇒ lỗi thật.
    const fatal = [...misses.values()].filter((e) => e.count >= targets.length).sort((a, b) => a.miss.pos - b.miss.pos)[0];
    if (fatal) {
      const hit = suggest(fatal.miss.value, [...fatal.candidates]);
      throw jqlHttpError(new JqlError(hit ? `${fatal.miss.message}. Did you mean ${quoteIfNeeded(hit)}?` : fatal.miss.message, fatal.miss.pos, hit ? quoteIfNeeded(hit) : undefined));
    }
    groups = [...byWhere.values()];
  }
  if (!groups.length) return empty;

  // Chữ tự do: khoá chính xác > tiêu đề bắt đầu bằng > tiêu đề chứa > mô tả chứa.
  const keyMatch = KEY_RE.exec(q);
  const onlyNumber = /^\d{1,9}$/.test(q) ? Number(q) : null;
  const contains = (s: string) => ({ contains: s, mode: 'insensitive' as const });
  const keyWhere = (ids: number[]): W | null => {
    if (keyMatch) {
      const pids = ids.filter((id) => lc(byId.get(id)!.key) === lc(keyMatch[1]));
      return pids.length ? { projectId: { in: pids }, number: Number(keyMatch[2]) } : null;
    }
    return onlyNumber !== null ? { number: onlyNumber } : null;
  };
  const textWhere = (ids: number[]): W | null => {
    if (!q) return null;
    const k = keyWhere(ids);
    return { OR: [...(k ? [k] : []), { title: contains(q) }, { descriptionText: contains(q) }] };
  };

  const scoreOf = (r: Row): { score: number; match: MatchKind } => {
    const t = lc(r.title);
    const s = lc(q);
    if (keyMatch && lc(r.project.key) === lc(keyMatch[1]) && r.number === Number(keyMatch[2])) return { score: 4, match: 'key' };
    if (onlyNumber !== null && r.number === onlyNumber) return { score: 3.5, match: 'key' };
    if (t.startsWith(s)) return { score: 3, match: 'title' };
    if (t.includes(s)) return { score: 2, match: 'title' };
    return { score: 1, match: 'description' };
  };

  const results = await pool(groups, POOL, async (g) => {
    const base: W = { AND: [{ projectId: { in: g.ids }, deletedAt: null }, g.where] };
    const tw = textWhere(g.ids);
    const full: W = tw ? { AND: [base, tw] } : base;
    const total = await prisma.workIssue.count({ where: full });
    if (!total) return { total, rows: [] as Row[] };
    if (!ranked) {
      const rows = await prisma.workIssue.findMany({ where: full, orderBy: dbOrder(effOrder), take: need, select: ROW_SELECT });
      return { total, rows };
    }
    // Theo bậc: mỗi bậc lấy đủ `need` dòng mới nhất ⇒ top-N toàn cục luôn đúng.
    const byUpdated = dbOrder([{ field: 'updated', dir: 'desc' }]);
    const tiers: W[] = [
      ...(keyWhere(g.ids) ? [keyWhere(g.ids)!] : []),
      { title: { startsWith: q, mode: 'insensitive' } },
      { title: contains(q), NOT: { title: { startsWith: q, mode: 'insensitive' } } },
    ];
    const got: Row[] = [];
    for (const t of tiers) {
      got.push(...await prisma.workIssue.findMany({ where: { AND: [base, t] }, orderBy: byUpdated, take: need, select: ROW_SELECT }));
    }
    const uniq = new Map(got.map((r) => [r.id, r]));
    if (uniq.size < need) {
      const rest = await prisma.workIssue.findMany({
        where: { AND: [base, { descriptionText: contains(q) }, { NOT: { title: contains(q) } }] },
        orderBy: byUpdated, take: need, select: ROW_SELECT,
      });
      rest.forEach((r) => uniq.set(r.id, r));
    }
    return { total, rows: [...uniq.values()] };
  });

  const total = results.reduce((s, r) => s + r.total, 0);
  const cmp = compareRows(effOrder);
  const merged = results.flatMap((r) => r.rows).map((r) => ({ r, ...(q ? scoreOf(r) : { score: 0, match: undefined }) }));
  merged.sort((a, b) => (ranked ? b.score - a.score : 0) || cmp(a.r, b.r));
  const page = merged.slice(offset, offset + limit);

  return {
    items: page.map(({ r, match }) => {
      const p = byId.get(r.projectId)!;
      return {
        id: r.id,
        key: `${p.key}-${r.number}`,
        number: r.number,
        title: r.title,
        priority: r.priority,
        storyPoints: r.storyPoints,
        dueDate: r.dueDate ? r.dueDate.toISOString().slice(0, 10) : null,
        resolvedAt: r.resolvedAt,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        status: r.status,
        type: r.type,
        assignee: r.assignee,
        project: { id: p.id, key: p.key, name: p.name, archived: p.archived },
        workspace: { slug: p.workspace.slug, name: p.workspace.name },
        url: `/work/${p.workspace.slug}/${p.key}/issue/${r.number}`,
        ...(match ? { match } : {}),
      };
    }),
    total,
    offset,
    limit,
    hasMore: offset + limit < Math.min(total, MAX_DEPTH),
    projectsSearched: targets.length,
    truncated,
    ranked,
  };
}

// ─── Dữ liệu cho bộ lọc ──────────────────────────────────────────

const CAT_ORDER: Record<string, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };

export async function searchFacets(userId: number) {
  const all = await visibleProjects(userId);
  const active = all.filter((p) => !p.archived).slice(0, MAX_PROJECTS);
  const ids = active.map((p) => p.id);
  const wsIds = [...new Set(active.map((p) => p.workspace.id))];
  const [statuses, types, members] = await Promise.all([
    prisma.workStatus.findMany({ where: { workflow: { projectId: { in: ids } } }, select: { name: true, category: true, color: true, workflow: { select: { projectId: true } } } }),
    prisma.workIssueType.findMany({ where: { projectId: { in: ids }, archived: false }, orderBy: [{ level: 'desc' }, { position: 'asc' }], select: { key: true, name: true, icon: true, color: true, projectId: true } }),
    prisma.workMember.findMany({ where: { workspaceId: { in: wsIds } }, take: 500, select: { user: { select: PUBLIC_USER } } }),
  ]);

  // Gộp theo TÊN (không phân biệt hoa thường): "Done" ở 5 dự án là một mục.
  const st = new Map<string, { name: string; category: string; color: string; projects: Set<number> }>();
  for (const s of statuses) {
    const k = s.name.toLowerCase();
    const e = st.get(k) ?? { name: s.name, category: s.category, color: s.color, projects: new Set<number>() };
    e.projects.add(s.workflow.projectId);
    st.set(k, e);
  }
  const ty = new Map<string, { key: string; name: string; icon: string; color: string; projects: Set<number> }>();
  for (const t of types) {
    const k = t.name.toLowerCase();
    const e = ty.get(k) ?? { key: t.key, name: t.name, icon: t.icon, color: t.color, projects: new Set<number>() };
    e.projects.add(t.projectId);
    ty.set(k, e);
  }
  const users = new Map(members.map((m) => [m.user.id, m.user]));

  return {
    projects: all
      .slice()
      .sort((a, b) => Number(a.archived) - Number(b.archived) || a.key.localeCompare(b.key))
      .map((p) => ({ id: p.id, key: p.key, name: p.name, archived: p.archived, workspace: { slug: p.workspace.slug, name: p.workspace.name } })),
    statuses: [...st.values()]
      .sort((a, b) => (CAT_ORDER[a.category] ?? 9) - (CAT_ORDER[b.category] ?? 9) || b.projects.size - a.projects.size || a.name.localeCompare(b.name))
      .map(({ projects, ...s }) => ({ ...s, projectCount: projects.size })),
    types: [...ty.values()]
      .sort((a, b) => b.projects.size - a.projects.size || a.name.localeCompare(b.name))
      .map(({ projects, ...t }) => ({ ...t, projectCount: projects.size })),
    assignees: [...users.values()].sort((a, b) => (a.displayName || a.fullName || a.username).localeCompare(b.displayName || b.fullName || b.username)),
  };
}
