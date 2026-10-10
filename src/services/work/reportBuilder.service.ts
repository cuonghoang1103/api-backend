/**
 * CT Work — CTW đợt 8b: TRÌNH SOẠN BÁO CÁO (Reports → Builder) — mẫu, dựng số liệu cho từng khối, xem trước, xuất PDF/DOCX.
 * Phần thuần (khối, mẫu sẵn, biểu đồ SVG, kỳ) ở reportBuilder.ts; bộ vẽ PDF/DOCX ở reportBuilderExport.ts.
 *
 * Quyền: chỉ ĐỘI dự án (governanceAccess.view — khách/GUEST ⇒ 403 WORK_INTERNAL_ONLY). Lưu/sửa/xoá mẫu: người sửa được thẻ
 * (governanceAccess.edit). Agent bị chặn ở tuyến (AGENT_DENIED_ROUTES) và ở đây (assertHumanish).
 * Mọi con số do MÃ tính từ chính các hàm báo cáo đã có (reports/flowReports/testMgmt/okr/raid/search) — AI chỉ viết
 * khối "nhận xét AI" khi người bấm (hoặc lịch bật refreshOnSend), và khối đó ghi rõ là AI.
 */

import sharp from 'sharp';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { keyFromUrl } from '../../config/r2.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { governanceAccess, requireProject, type ProjectAccess } from './permissions.js';
import { projectLanguage } from './projectLanguage.js';
import { projectTimezone } from './projectTime.js';
import {
  BUILTIN_KEYS, builtinTemplate, CHART_H, CHART_W, parseLayout, periodFor, renderChartSvg,
  type BuiltinKey, type ChartSpec, type KpiKey, type Period, type ReportBlock, type ReportLayout,
} from './reportBuilder.js';
import { renderReportDocx, renderReportPdf, type BrandAssets, type ResolvedBlock, type ResolvedReport } from './reportBuilderExport.js';

const MAX_TEMPLATES = 50;
type Lang = 'en' | 'vi';
const L = (lang: Lang, en: string, vi: string) => (lang === 'vi' ? vi : en);

// ─── Quyền ───────────────────────────────────────────────────────

export async function builderCtx(userId: number, projectId: number, opts: { edit?: boolean } = {}): Promise<ProjectAccess> {
  const access = await requireProject(userId, projectId, 'project.view');
  const g = governanceAccess(access.role, access.workspaceRole);
  if (!g.view) throw new AppError('Report builder is only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  if (opts.edit && (!g.edit || access.principal === 'AGENT')) throw new ForbiddenError('You can view reports but not change report templates in this project');
  return access;
}

// ─── Mẫu ─────────────────────────────────────────────────────────

const tplView = (t: { id: number; name: string; description: string | null; layout: unknown; updatedAt: Date; createdById: number | null }) => ({
  id: t.id, ref: String(t.id), builtin: false, name: t.name, description: t.description, layout: t.layout as ReportLayout, updatedAt: t.updatedAt,
});

export async function listTemplates(userId: number, projectId: number) {
  const access = await builderCtx(userId, projectId);
  const lang = await projectLanguage(projectId) as Lang;
  const rows = await prisma.workReportTemplate.findMany({ where: { projectId }, orderBy: { updatedAt: 'desc' } });
  const g = governanceAccess(access.role, access.workspaceRole);
  return {
    language: lang,
    builtins: BUILTIN_KEYS.map((k) => { const t = builtinTemplate(k, lang); return { ref: `builtin:${k}`, key: k, builtin: true, name: t.name, description: t.description, layout: t.layout }; }),
    templates: rows.map(tplView),
    canEdit: g.edit && access.principal !== 'AGENT',
    canManage: canApprove(access),
  };
}

export function canApprove(access: ProjectAccess): boolean {
  return access.principal !== 'AGENT' && (access.role === 'ADMIN' || access.workspaceRole === 'OWNER' || access.workspaceRole === 'ADMIN');
}

/** "builtin:weekly" | "12" ⇒ bố cục. */
export async function resolveTemplate(projectId: number, ref: string, lang: Lang): Promise<{ id: number | null; builtinKey: BuiltinKey | null; name: string; layout: ReportLayout }> {
  const b = /^builtin:(\w+)$/.exec(ref);
  if (b) {
    if (!(BUILTIN_KEYS as readonly string[]).includes(b[1])) throw new NotFoundError('Template not found');
    const t = builtinTemplate(b[1] as BuiltinKey, lang);
    return { id: null, builtinKey: t.key, name: t.name, layout: t.layout };
  }
  const id = Number(ref);
  const t = Number.isInteger(id) && id > 0 ? await prisma.workReportTemplate.findFirst({ where: { id, projectId } }) : null;
  if (!t) throw new NotFoundError('Template not found');
  return { id: t.id, builtinKey: null, name: t.name, layout: parseLayout(t.layout) };
}

export async function getTemplate(userId: number, projectId: number, ref: string) {
  await builderCtx(userId, projectId);
  const t = await resolveTemplate(projectId, ref, await projectLanguage(projectId) as Lang);
  return { ref, ...t };
}

export async function createTemplate(userId: number, projectId: number, input: { name: string; description?: string | null; layout: unknown }) {
  await builderCtx(userId, projectId, { edit: true });
  if ((await prisma.workReportTemplate.count({ where: { projectId } })) >= MAX_TEMPLATES) throw new BadRequestError(`A project can have up to ${MAX_TEMPLATES} report templates`, 'WORK_LIMIT');
  const layout = validLayout(input.layout);
  const t = await prisma.workReportTemplate.create({ data: { projectId, name: input.name.trim().slice(0, 120), description: input.description?.trim().slice(0, 500) || null, layout: layout as unknown as Prisma.InputJsonValue, createdById: userId, updatedById: userId } });
  await auditProject(projectId, { actorId: userId, action: 'report_template.create', targetType: 'project', targetId: projectId, summary: `Saved report template “${t.name}”` });
  return tplView(t);
}

export async function updateTemplate(userId: number, projectId: number, id: number, input: { name?: string; description?: string | null; layout?: unknown }) {
  await builderCtx(userId, projectId, { edit: true });
  const cur = await prisma.workReportTemplate.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Template not found');
  const t = await prisma.workReportTemplate.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim().slice(0, 120) } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim().slice(0, 500) || null } : {}),
      ...(input.layout !== undefined ? { layout: validLayout(input.layout) as unknown as Prisma.InputJsonValue } : {}),
      updatedById: userId,
    },
  });
  return tplView(t);
}

export async function deleteTemplate(userId: number, projectId: number, id: number) {
  await builderCtx(userId, projectId, { edit: true });
  const cur = await prisma.workReportTemplate.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Template not found');
  await prisma.workReportTemplate.delete({ where: { id } });
  await auditProject(projectId, { actorId: userId, action: 'report_template.delete', targetType: 'project', targetId: projectId, summary: `Deleted report template “${cur.name}”` });
  return { ok: true };
}

function validLayout(v: unknown): ReportLayout {
  try { return parseLayout(v); } catch (err) {
    const first = (err as { issues?: Array<{ path: Array<string | number>; message: string }> }).issues?.[0];
    throw new BadRequestError(`Report layout: ${first ? `${first.path.join('.')}: ${first.message}` : 'invalid'}`, 'VALIDATION_ERROR');
  }
}

// ─── Dựng số liệu cho từng khối ──────────────────────────────────

const KPI_LABEL: Record<KpiKey, [string, string]> = {
  open: ['Open issues', 'Thẻ đang mở'], doneInPeriod: ['Done in period', 'Xong trong kỳ'], overdue: ['Overdue', 'Trễ hạn'], blocked: ['Blocked', 'Bị chặn'],
  velocity: ['Velocity (avg of 3)', 'Velocity (TB 3 sprint)'], sprintProgress: ['Sprint progress', 'Tiến độ sprint'], testPassRate: ['Test pass rate', 'Tỉ lệ test đạt'],
  openDefects: ['Open defects', 'Lỗi đang mở'], highRisks: ['High risks', 'Rủi ro cao'], okrProgress: ['OKR progress', 'Tiến độ OKR'],
};
const CHART_TITLE: Record<string, [string, string]> = {
  burnup: ['Sprint burnup', 'Burnup của sprint'], burndown: ['Sprint burndown', 'Burndown của sprint'], cfd: ['Cumulative flow', 'Dòng chảy tích luỹ (CFD)'],
  velocity: ['Velocity', 'Velocity'], defects: ['Defects opened vs closed', 'Lỗi mở và đóng'], testPassRate: ['Test pass rate by cycle', 'Tỉ lệ test đạt theo vòng'],
  okr: ['Objectives (OKR)', 'Mục tiêu (OKR)'], throughput: ['Throughput per week', 'Số việc xong mỗi tuần'], createdResolved: ['Created vs resolved', 'Tạo mới và hoàn thành'],
};
const COL_LABEL: Record<string, [string, string]> = {
  key: ['Key', 'Mã'], title: ['Title', 'Tiêu đề'], type: ['Type', 'Loại'], status: ['Status', 'Trạng thái'], assignee: ['Assignee', 'Người làm'],
  priority: ['Priority', 'Ưu tiên'], due: ['Due', 'Hạn'], points: ['Points', 'Điểm'],
};
const PRIORITY: Record<Lang, string[]> = { en: ['', 'Highest', 'High', 'Medium', 'Low', 'Lowest'], vi: ['', 'Rất cao', 'Cao', 'Trung bình', 'Thấp', 'Rất thấp'] };

/** Lỗi một khối (mô-đun tắt, JQL sai…) ⇒ khối đó hiện thông báo, cả báo cáo vẫn ra. */
const softFail = (err: unknown) => (err instanceof AppError ? err.message : 'Not available');

interface Ctx { userId: number; projectId: number; lang: Lang; period: Period; tz: string; accent: string | null; cache: Map<string, Promise<unknown>> }
const once = <T>(ctx: Ctx, key: string, fn: () => Promise<T>): Promise<T> => {
  if (!ctx.cache.has(key)) ctx.cache.set(key, fn());
  return ctx.cache.get(key) as Promise<T>;
};

async function pickSprint(projectId: number, sprintId?: number | null) {
  const sel = { id: true, name: true, startAt: true, endAt: true, completedAt: true, state: true } as const;
  if (sprintId) return prisma.workSprint.findFirst({ where: { id: sprintId, projectId }, select: sel });
  return (await prisma.workSprint.findFirst({ where: { projectId, state: 'ACTIVE' }, orderBy: { startAt: 'desc' }, select: sel }))
    ?? prisma.workSprint.findFirst({ where: { projectId, state: 'CLOSED' }, orderBy: { completedAt: 'desc' }, select: sel });
}

const periodStart = (p: Period) => new Date(`${p.from}T00:00:00+07:00`);
const periodEnd = (p: Period) => new Date(Date.parse(`${p.to}T00:00:00+07:00`) + 86_400_000);

async function kpiValue(ctx: Ctx, key: KpiKey): Promise<{ value: string; hint: string | null }> {
  const { userId, projectId, lang } = ctx;
  const kpis = () => once(ctx, 'kpis', async () => (await import('./flowReports.service.js')).projectKpis(userId, projectId));
  const quality = () => once(ctx, 'quality', async () => (await import('./testMgmt.service.js')).qualityDashboard(userId, projectId, { days: 30 }));
  const pct = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `${Math.round(n)}%`);
  switch (key) {
    case 'open': { const k = await kpis(); return { value: String(k.open.value), hint: k.open.previous !== null ? L(lang, `${k.open.previous} a week ago`, `${k.open.previous} tuần trước`) : null }; }
    case 'overdue': { const k = await kpis(); return { value: String(k.overdue.value), hint: L(lang, `${k.overdue.previous} a week ago`, `${k.overdue.previous} tuần trước`) }; }
    case 'blocked': { const k = await kpis(); return { value: String(k.blocked.value), hint: null }; }
    case 'sprintProgress': { const k = await kpis(); return k.sprint ? { value: pct(k.sprint.pctDone), hint: `${k.sprint.name} · ${k.sprint.done}/${k.sprint.total}` } : { value: '—', hint: L(lang, 'No active sprint', 'Không có sprint đang chạy') }; }
    case 'highRisks': { const k = await kpis(); return { value: k.highRisks === null ? '—' : String(k.highRisks), hint: k.highRisks === null ? L(lang, 'RAID is off', 'Chưa bật RAID') : null }; }
    case 'doneInPeriod': {
      const n = await prisma.workIssue.count({ where: { projectId, deletedAt: null, type: { level: { gte: 0 } }, resolvedAt: { gte: periodStart(ctx.period), lt: periodEnd(ctx.period) } } });
      return { value: String(n), hint: `${ctx.period.from} → ${ctx.period.to}`.replace('→', '-') };
    }
    case 'velocity': {
      const v = await once(ctx, 'velocity', async () => (await import('./reports.service.js')).velocity(userId, projectId));
      return { value: v.average === null ? '—' : String(v.average), hint: v.unit === 'POINTS' || !v.unit ? L(lang, 'points per sprint', 'điểm mỗi sprint') : String(v.unit).toLowerCase() };
    }
    case 'testPassRate': {
      const q = await quality();
      const last = q.cycles[q.cycles.length - 1];
      return { value: pct(last?.passRate), hint: last ? last.name : L(lang, 'No test cycle yet', 'Chưa có vòng test') };
    }
    case 'openDefects': { const q = await quality(); return { value: String(q.defects.open), hint: L(lang, `${q.defects.total} in total`, `${q.defects.total} tổng`) }; }
    case 'okrProgress': {
      const o = await once(ctx, 'okr', async () => (await import('./okr.service.js')).projectOkrs(userId, projectId));
      const objs = o.objectives as Array<{ progress: number }>;
      return objs.length ? { value: pct((objs.reduce((a, x) => a + x.progress, 0) / objs.length) * 100), hint: o.cycle ? (o.cycle as { name: string }).name : null } : { value: '—', hint: L(lang, 'No objectives', 'Chưa có mục tiêu') };
    }
  }
}

async function chartSpec(ctx: Ctx, b: Extract<ReportBlock, { type: 'chart' }>): Promise<ChartSpec> {
  const { userId, projectId, lang } = ctx;
  const title = b.title || L(lang, ...CHART_TITLE[b.chart]);
  const empty = (en: string, vi: string): ChartSpec => ({ kind: 'empty', title, message: L(lang, en, vi) });
  switch (b.chart) {
    case 'burnup': case 'burndown': {
      const s = await pickSprint(projectId, b.sprintId ?? ctx.period.sprint?.id);
      if (!s) return empty('No sprint yet', 'Chưa có sprint');
      const bd = await (await import('./reports.service.js')).burndown(userId, projectId, s.id);
      if (!bd.points.length) return empty('The sprint has not started', 'Sprint chưa bắt đầu');
      const x = bd.points.map((p) => p.day);
      const t = `${title} — ${s.name}`;
      return b.chart === 'burndown'
        ? { kind: 'line', title: t, x, series: [{ name: L(lang, 'Remaining', 'Còn lại'), values: bd.points.map((p) => p.remaining) }, { name: L(lang, 'Ideal', 'Lý tưởng'), values: bd.points.map((p) => p.ideal), color: '#94a3b8', dashed: true }] }
        : { kind: 'line', title: t, x, series: [{ name: L(lang, 'Completed', 'Đã xong'), values: bd.points.map((p) => p.done), color: '#16a34a' }, { name: L(lang, 'Scope', 'Phạm vi'), values: bd.points.map((p) => p.total), color: '#4f5bd5' }] };
    }
    case 'cfd': {
      const r = await (await import('./flowReports.service.js')).cfd(userId, projectId, { days: b.days ?? 30 });
      if (!r.points.length) return empty('No data yet', 'Chưa có dữ liệu');
      // DONE dưới cùng (giống UX-B).
      const bands = [...r.bands].reverse();
      return { kind: 'area', title, x: r.points.map((p) => String(p.day)), series: bands.map((band) => ({ name: band.name, values: r.points.map((p) => Number(p[band.key] ?? 0)), color: band.color ?? (band.category === 'DONE' ? '#16a34a' : band.category === 'IN_PROGRESS' ? '#4f5bd5' : '#cbd5e1') })) };
    }
    case 'velocity': {
      const v = await (await import('./reports.service.js')).velocity(userId, projectId);
      if (!v.sprints.length) return empty('No closed sprint yet', 'Chưa có sprint đã đóng');
      return { kind: 'bar', title, x: v.sprints.map((s) => s.name), series: [{ name: L(lang, 'Committed', 'Cam kết'), values: v.sprints.map((s) => s.committedPoints), color: '#cbd5e1' }, { name: L(lang, 'Completed', 'Hoàn thành'), values: v.sprints.map((s) => s.completedPoints), color: '#4f5bd5' }] };
    }
    case 'defects': {
      const q = await once(ctx, 'quality', async () => (await import('./testMgmt.service.js')).qualityDashboard(userId, projectId, { days: 30 }));
      const days = Math.min(b.days ?? 30, q.defectTrend.length);
      const tr = q.defectTrend.slice(-days);
      if (!tr.some((d) => d.opened || d.closed || d.openTotal)) return empty('No defects recorded', 'Chưa ghi nhận lỗi');
      return { kind: 'line', title, x: tr.map((d) => d.day), series: [{ name: L(lang, 'Opened', 'Mở'), values: tr.map((d) => d.opened), color: '#dc2626' }, { name: L(lang, 'Closed', 'Đóng'), values: tr.map((d) => d.closed), color: '#16a34a' }, { name: L(lang, 'Open total', 'Đang mở'), values: tr.map((d) => d.openTotal), color: '#f59e0b' }] };
    }
    case 'testPassRate': {
      const q = await once(ctx, 'quality', async () => (await import('./testMgmt.service.js')).qualityDashboard(userId, projectId, { days: 30 }));
      if (!q.cycles.length) return empty('No test cycle yet', 'Chưa có vòng test');
      return { kind: 'bar', title, x: q.cycles.map((c) => c.name), yMax: 100, ySuffix: '%', series: [{ name: L(lang, 'Pass rate', 'Tỉ lệ đạt'), values: q.cycles.map((c) => c.passRate ?? 0), color: '#16a34a' }, { name: L(lang, 'Executed', 'Đã chạy'), values: q.cycles.map((c) => c.progress ?? 0), color: '#94a3b8' }] };
    }
    case 'okr': {
      const o = await once(ctx, 'okr', async () => (await import('./okr.service.js')).projectOkrs(userId, projectId));
      const objs = o.objectives as Array<{ title: string; progress: number }>;
      if (!objs.length) return empty('No objectives in this cycle', 'Chưa có mục tiêu trong chu kỳ');
      return { kind: 'hbar', title, items: objs.map((x) => ({ label: x.title, value: Math.round(x.progress * 100), color: x.progress >= 0.7 ? '#16a34a' : x.progress >= 0.4 ? '#f59e0b' : '#dc2626' })), max: 100, suffix: '%' };
    }
    case 'throughput': {
      const r = await (await import('./flowReports.service.js')).throughput(userId, projectId, { weeks: 12 });
      return { kind: 'bar', title, x: r.weeks.map((w) => w.week), series: [{ name: L(lang, 'Issues done', 'Việc xong'), values: r.weeks.map((w) => w.count) }] };
    }
    case 'createdResolved': {
      const rows = await (await import('./search.service.js')).createdVsResolved(userId, projectId, b.days ?? 14);
      return { kind: 'line', title, x: rows.map((r) => r.day), series: [{ name: L(lang, 'Created', 'Tạo mới'), values: rows.map((r) => r.created), color: '#f59e0b' }, { name: L(lang, 'Resolved', 'Hoàn thành'), values: rows.map((r) => r.resolved), color: '#16a34a' }] };
    }
  }
}

async function issueRows(ctx: Ctx, b: Extract<ReportBlock, { type: 'issues' }>) {
  const { compileFor } = await import('./search.service.js');
  const { where, orderBy } = await compileFor(ctx.userId, ctx.projectId, b.jql || 'ORDER BY rank');
  const full = { AND: [{ projectId: ctx.projectId, deletedAt: null }, where] } as Prisma.WorkIssueWhereInput;
  const [total, rows, key] = await Promise.all([
    prisma.workIssue.count({ where: full }),
    prisma.workIssue.findMany({
      where: full, orderBy: orderBy as never, take: b.limit,
      select: { number: true, title: true, priority: true, dueDate: true, storyPoints: true, status: { select: { name: true } }, type: { select: { name: true } }, assignee: { select: PUBLIC_USER } },
    }),
    prisma.workProject.findUniqueOrThrow({ where: { id: ctx.projectId }, select: { key: true } }).then((p) => p.key),
  ]);
  const cell = (r: (typeof rows)[number], c: string): string => {
    switch (c) {
      case 'key': return `${key}-${r.number}`;
      case 'title': return r.title;
      case 'type': return r.type.name;
      case 'status': return r.status.name;
      case 'assignee': return r.assignee ? displayName(r.assignee) : '—';
      case 'priority': return PRIORITY[ctx.lang][r.priority] ?? '';
      case 'due': return r.dueDate ? r.dueDate.toISOString().slice(0, 10) : '';
      case 'points': return r.storyPoints === null || r.storyPoints === undefined ? '' : String(r.storyPoints);
      default: return '';
    }
  };
  return { columns: b.columns.map((c) => L(ctx.lang, ...COL_LABEL[c])), colKeys: b.columns, rows: rows.map((r) => b.columns.map((c) => cell(r, c))), total };
}

async function riskRows(ctx: Ctx, limit: number) {
  const r = await (await import('./raid.service.js')).topRisks(ctx.userId, ctx.projectId, limit);
  if (!r.enabled) return null;
  return r.items.map((x) => ({
    key: String(x.key), title: x.title, level: x.level ? String(x.level) : null, score: x.score ?? null,
    owner: x.owner ? displayName(x.owner) : null, mitigation: x.mitigation ?? null,
  }));
}

export interface RenderOptions { now?: Date; /** Lịch gửi: cho khối AI refreshOnSend gọi AI dưới tên người tạo lịch. */ refreshAi?: boolean }

/** Bố cục ⇒ báo cáo đã có số liệu (khối nào lỗi thì khối đó ghi lỗi). Biểu đồ đi kèm SVG. */
export async function resolveReport(userId: number, projectId: number, layout: ReportLayout, o: RenderOptions = {}): Promise<ResolvedReport> {
  const now = o.now ?? new Date();
  const [project, tz, plang] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true, color: true, coverUrl: true, workspace: { select: { name: true, logoUrl: true } } } }),
    projectTimezone(projectId), projectLanguage(projectId),
  ]);
  const lang = (layout.language ?? plang) as Lang;
  const sprint = layout.period === 'sprint' ? await pickSprint(projectId) : null;
  const period = periodFor(layout.period, now, tz, sprint);
  const accent = layout.options.accent ?? (project.color && /^#[0-9a-f]{6}$/i.test(project.color) ? project.color : null);
  const ctx: Ctx = { userId, projectId, lang, period, tz, accent, cache: new Map() };
  const blocks: ResolvedBlock[] = [];
  for (const b of layout.blocks) {
    try {
      switch (b.type) {
        case 'heading': blocks.push({ id: b.id, type: 'heading', text: b.text, level: b.level }); break;
        case 'text': blocks.push({ id: b.id, type: 'text', text: b.text }); break;
        case 'pageBreak': blocks.push({ id: b.id, type: 'pageBreak' }); break;
        case 'kpis': {
          const items = [];
          for (const k of b.metrics) {
            try { items.push({ key: k, label: L(lang, ...KPI_LABEL[k]), ...(await kpiValue(ctx, k)) }); } catch (err) { items.push({ key: k, label: L(lang, ...KPI_LABEL[k]), value: '—', hint: softFail(err) }); }
          }
          blocks.push({ id: b.id, type: 'kpis', title: b.title ?? null, items });
          break;
        }
        case 'chart': {
          const spec = await chartSpec(ctx, b);
          // Thanh ngang (OKR): cao theo số dòng — không để khoảng trắng lớn dưới hai mục tiêu.
          const height = spec.kind === 'hbar' ? Math.min(CHART_H, 64 + Math.min(10, spec.items.length) * 30) : undefined;
          blocks.push({ id: b.id, type: 'chart', title: spec.title, svg: renderChartSvg(spec, { accent, height }) });
          break;
        }
        case 'issues': {
          const r = await issueRows(ctx, b);
          blocks.push({ id: b.id, type: 'issues', title: b.title ?? null, columns: r.columns, colKeys: r.colKeys, rows: r.rows, total: r.total });
          break;
        }
        case 'risks': {
          const items = await riskRows(ctx, b.limit);
          blocks.push({ id: b.id, type: 'risks', title: b.title ?? L(lang, 'Top risks', 'Rủi ro hàng đầu'), items: items ?? [], note: items ? null : L(lang, 'The RAID log is turned off for this project.', 'Dự án chưa bật sổ RAID.') });
          break;
        }
        case 'ai': {
          let text = b.text ?? null;
          let at = b.generatedAt ?? null;
          if (o.refreshAi && b.refreshOnSend) {
            try { const r = await aiCommentary(userId, projectId, { audience: b.audience, language: lang }); text = r.text; at = r.generatedAt; } catch (err) { logger.info('[work] báo cáo: AI làm mới lỗi', { err: (err as Error).message }); }
          }
          if (text) blocks.push({ id: b.id, type: 'ai', title: b.title ?? L(lang, 'AI commentary', 'Nhận xét của AI'), text, generatedAt: at, note: L(lang, 'Written by AI from the numbers in this report — check before relying on it.', 'Do AI viết từ số liệu trong báo cáo — hãy kiểm lại trước khi dùng.') });
          break;
        }
      }
    } catch (err) {
      blocks.push({ id: b.id, type: 'error', message: softFail(err) });
    }
  }
  return {
    title: layout.title, subtitle: layout.subtitle ?? null, lang, period,
    project: { name: project.name, key: project.key }, workspace: { name: project.workspace.name },
    accent: accent ?? '#4f5bd5', generatedAt: now.toISOString(), options: layout.options, blocks,
    brand: { logoUrl: layout.options.logo ? project.workspace.logoUrl : null, coverUrl: layout.options.coverImage ? project.coverUrl : null },
  };
}

export async function preview(userId: number, projectId: number, input: { layout?: unknown; ref?: string }) {
  await builderCtx(userId, projectId);
  const lang = await projectLanguage(projectId) as Lang;
  const layout = input.layout !== undefined ? validLayout(input.layout) : (await resolveTemplate(projectId, input.ref ?? 'builtin:weekly', lang)).layout;
  return resolveReport(userId, projectId, layout);
}

// ─── Xuất ────────────────────────────────────────────────────────

/** Ảnh thương hiệu (logo không gian, ảnh bìa dự án) — thay được trong test. */
type AssetLoader = (url: string) => Promise<Buffer | null>;
const realLoader: AssetLoader = async (url) => {
  const key = keyFromUrl(url);
  if (!key) return null; // ảnh preset (/images/work-covers/…) nằm ở frontend ⇒ bìa vẽ bằng màu nhấn
  try {
    const { stream } = await getStorageProvider().readStream(key);
    const chunks: Buffer[] = [];
    for await (const c of stream as AsyncIterable<Buffer>) chunks.push(Buffer.from(c));
    return Buffer.concat(chunks);
  } catch { return null; }
};
let assetLoader: AssetLoader = realLoader;
export function _setBrandAssetLoaderForTests(f: AssetLoader | null) { assetLoader = f ?? realLoader; }

async function toPng(buf: Buffer | null, maxW: number): Promise<{ buffer: Buffer; width: number; height: number } | null> {
  if (!buf) return null;
  try {
    const out = await sharp(buf, { animated: false }).resize({ width: maxW, withoutEnlargement: true }).png().toBuffer({ resolveWithObject: true });
    return { buffer: out.data, width: out.info.width, height: out.info.height };
  } catch { return null; }
}

export async function brandAssets(r: ResolvedReport): Promise<BrandAssets> {
  const [logo, cover] = await Promise.all([
    r.brand.logoUrl ? assetLoader(r.brand.logoUrl).then((b) => toPng(b, 400)) : null,
    r.brand.coverUrl ? assetLoader(r.brand.coverUrl).then((b) => toPng(b, 1600)) : null,
  ]);
  // Biểu đồ: SVG (chữ là đường) ⇒ PNG 2× — đọc được trên máy chủ không có font.
  const charts = new Map<string, { buffer: Buffer; width: number; height: number }>();
  for (const b of r.blocks) {
    if (b.type !== 'chart') continue;
    try {
      const png = await sharp(Buffer.from(b.svg), { density: 144 }).png().toBuffer({ resolveWithObject: true });
      charts.set(b.id, { buffer: png.data, width: png.info.width || CHART_W * 2, height: png.info.height || CHART_H * 2 });
    } catch (err) { logger.warn('[work] báo cáo: đổi biểu đồ sang PNG lỗi', { err: (err as Error).message }); }
  }
  return { logo, cover, charts };
}

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 80) || 'report';

export async function renderReportFile(r: ResolvedReport, format: 'pdf' | 'docx'): Promise<{ buffer: Buffer; file: string; mime: string }> {
  const assets = await brandAssets(r);
  const buffer = format === 'docx' ? await renderReportDocx(r, assets) : await renderReportPdf(r, assets);
  return {
    buffer, file: `${r.project.key}_${slug(r.title)}_${r.period.to}.${format}`,
    mime: format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf',
  };
}

export async function exportReport(userId: number, projectId: number, input: { layout?: unknown; ref?: string; format: 'pdf' | 'docx' }) {
  const r = await preview(userId, projectId, input);
  const out = await renderReportFile(r, input.format);
  await auditProject(projectId, { actorId: userId, action: 'report.export', targetType: 'project', targetId: projectId, summary: `Exported report “${r.title}” as ${input.format.toUpperCase()}` });
  return out;
}

// ─── Nhận xét AI (tuỳ chọn, người bấm) ───────────────────────────

let aiOverride: ((audience: string, lang: Lang) => Promise<string>) | null = null;
export function _setAiForTests(fn: typeof aiOverride) { aiOverride = fn; }

export async function aiCommentary(userId: number, projectId: number, input: { audience: 'team' | 'teacher' | 'client'; language?: Lang }) {
  await builderCtx(userId, projectId, { edit: true });
  const lang = input.language ?? (await projectLanguage(projectId) as Lang);
  let text: string;
  if (aiOverride) text = await aiOverride(input.audience, lang);
  else {
    // weeklyReport: MÃ gom số liệu, AI chỉ viết thành văn (purpose work_digest — model rẻ), tôn trọng quota/budget sẵn có.
    const { weeklyReport } = await import('./ai.service.js');
    text = (await weeklyReport(userId, projectId, { audience: input.audience, language: lang })).report;
  }
  return { text: text.slice(0, 20_000), generatedAt: new Date().toISOString() };
}

export type { ResolvedReport };
