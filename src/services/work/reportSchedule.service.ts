/**
 * CT Work — CTW đợt 8b: LỊCH TỰ GỬI báo cáo của Builder (work_report_send_plans) + NHẬT KÝ GỬI (work_report_deliveries).
 *
 *   - Kỳ: WEEKLY (thứ + giờ + múi giờ; gửi bù trong ngày nếu máy chủ tắt đúng giờ) hoặc SPRINT (sprint vừa đóng trong 3 ngày).
 *   - MỖI KỲ MỘT LẦN: trước khi gửi, ghi dòng nhật ký với UNIQUE (lịch, khoá kỳ) — hai tiến trình cron chạy chồng chỉ một
 *     bên ghi được, bên kia bỏ qua (P2002). Gửi tay ("Send now") dùng khoá `manual:<thời điểm>` nên không chặn bản tự động.
 *   - Kênh: email (khung workEmail, kèm PDF/DOCX) · webhook chat của dự án (tóm tắt + link) · kênh Slack (đăng tệp).
 *   - NGƯỜI NHẬN NGOÀI HỆ THỐNG (email không phải thành viên dự án) ⇒ PENDING tới khi OWNER/ADMIN duyệt; người tạo là
 *     OWNER/ADMIN thì coi như đã duyệt. Chỉ người nhận APPROVED mới được gửi. Thành viên dự án ⇒ APPROVED ngay.
 *   - Báo cáo dựng DƯỚI TÊN người tạo lịch (đúng quyền của họ). Họ mất quyền dự án ⇒ lượt gửi FAILED, ghi lý do.
 *   - Agent: cấm (AGENT_DENIED_ROUTES `/report-plans`) + chặn ở đây.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { emailService } from '../email.service.js';
import { auditProject } from './audit.js';
import { displayName, frontendUrl, PUBLIC_USER } from './common.js';
import { loadProjectAccess } from './permissions.js';
import { projectLanguage } from './projectLanguage.js';
import { renderWorkEmail, WORK_FROM_NAME } from './workEmail.js';
import { SCHEDULE_CADENCES, scheduleDue, validEmail } from './reportBuilder.js';
import { builderCtx, canApprove, renderReportFile, resolveReport, resolveTemplate } from './reportBuilder.service.js';

const MAX_PLANS = 20;
const MAX_RECIPIENTS = 30;
type Lang = 'en' | 'vi';

export interface Recipient { email: string; userId: number | null; external: boolean; status: 'APPROVED' | 'PENDING' | 'REJECTED'; decidedById: number | null; decidedAt: string | null }

export const planInput = z.object({
  name: z.string().trim().min(1).max(120),
  templateRef: z.string().regex(/^(builtin:\w+|\d+)$/, 'Pick a template'),
  cadence: z.enum(SCHEDULE_CADENCES).default('WEEKLY'),
  weekday: z.number().int().min(1).max(7).default(5),
  hour: z.number().int().min(0).max(23).default(16),
  timezone: z.string().max(64).refine((tz) => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; } }, 'Unknown time zone').default('Asia/Ho_Chi_Minh'),
  format: z.enum(['pdf', 'docx']).default('pdf'),
  recipients: z.array(z.string().trim().toLowerCase().max(254)).max(MAX_RECIPIENTS).default([]),
  chatHookIds: z.array(z.number().int().positive()).max(10).default([]),
  slackChannelIds: z.array(z.number().int().positive()).max(10).default([]),
  enabled: z.boolean().default(true),
});
export type PlanInput = z.infer<typeof planInput>;

const recipientsOf = (v: unknown): Recipient[] => (Array.isArray(v) ? (v as Recipient[]).filter((r) => r && typeof r.email === 'string') : []);
const idsOf = (v: unknown): number[] => (Array.isArray(v) ? v.filter((x): x is number => Number.isInteger(x)) : []);

async function humanCtx(userId: number, projectId: number) {
  const access = await builderCtx(userId, projectId, { edit: true });
  if (access.principal === 'AGENT') throw new ForbiddenError('AI agents cannot schedule or send reports');
  return access;
}

/** Email ⇒ thành viên ĐỘI dự án (không khách) ⇒ người nhận nội bộ. */
async function memberByEmail(projectId: number, email: string): Promise<number | null> {
  const u = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' }, kind: 'HUMAN' }, select: { id: true } });
  if (!u) return null;
  const a = await loadProjectAccess(u.id, projectId);
  return a && a.role !== 'CLIENT' ? u.id : null;
}

async function buildRecipients(projectId: number, emails: string[], prev: Recipient[], actor: { id: number; approver: boolean }): Promise<Recipient[]> {
  const out: Recipient[] = [];
  for (const raw of [...new Set(emails.map((e) => e.trim().toLowerCase()))]) {
    if (!validEmail(raw)) throw new BadRequestError(`“${raw}” is not a valid email address`, 'VALIDATION_ERROR');
    const old = prev.find((r) => r.email === raw);
    const userId = await memberByEmail(projectId, raw);
    if (userId) { out.push({ email: raw, userId, external: false, status: 'APPROVED', decidedById: null, decidedAt: null }); continue; }
    if (old && old.external) { out.push(old); continue; }
    out.push(actor.approver
      ? { email: raw, userId: null, external: true, status: 'APPROVED', decidedById: actor.id, decidedAt: new Date().toISOString() }
      : { email: raw, userId: null, external: true, status: 'PENDING', decidedById: null, decidedAt: null });
  }
  return out;
}

async function checkTargets(projectId: number, input: Pick<PlanInput, 'chatHookIds' | 'slackChannelIds'>) {
  if (input.chatHookIds.length && (await prisma.workChatHook.count({ where: { projectId, id: { in: input.chatHookIds } } })) !== input.chatHookIds.length) throw new BadRequestError('Pick chat webhooks of this project', 'VALIDATION_ERROR');
  if (input.slackChannelIds.length && (await prisma.workSlackChannel.count({ where: { projectId, id: { in: input.slackChannelIds } } })) !== input.slackChannelIds.length) throw new BadRequestError('Pick Slack channels of this project', 'VALIDATION_ERROR');
}

type PlanRow = Prisma.WorkReportSendPlanGetPayload<{ include: { template: { select: { name: true } } } }>;

function planView(p: PlanRow, builtinName: string | null) {
  return {
    id: p.id, name: p.name, templateRef: p.templateId ? String(p.templateId) : p.builtinKey ? `builtin:${p.builtinKey}` : null,
    templateName: p.template?.name ?? builtinName, cadence: p.cadence, weekday: p.weekday, hour: p.hour, timezone: p.timezone, format: p.format,
    recipients: recipientsOf(p.recipients), chatHookIds: idsOf(p.chatHookIds), slackChannelIds: idsOf(p.slackChannelIds),
    enabled: p.enabled, lastRunAt: p.lastRunAt, lastPeriodKey: p.lastPeriodKey, createdAt: p.createdAt,
    pendingApprovals: recipientsOf(p.recipients).filter((r) => r.status === 'PENDING').length,
  };
}

export async function listPlans(userId: number, projectId: number) {
  const access = await builderCtx(userId, projectId);
  const lang = await projectLanguage(projectId) as Lang;
  const [plans, hooks, slack, deliveries] = await Promise.all([
    prisma.workReportSendPlan.findMany({ where: { projectId }, orderBy: { id: 'asc' }, include: { template: { select: { name: true } } } }),
    prisma.workChatHook.findMany({ where: { projectId }, select: { id: true, kind: true, name: true } }),
    prisma.workSlackChannel.findMany({ where: { projectId }, select: { id: true, channelName: true } }),
    listDeliveriesRaw(projectId, 30),
  ]);
  const { builtinTemplate } = await import('./reportBuilder.js');
  return {
    plans: plans.map((p) => planView(p, p.builtinKey ? builtinTemplate(p.builtinKey as never, lang).name : null)),
    chatHooks: hooks, slackChannels: slack.map((c) => ({ id: c.id, name: c.channelName })),
    deliveries, canEdit: access.principal !== 'AGENT', canApprove: canApprove(access),
  };
}

export async function createPlan(userId: number, projectId: number, input: PlanInput) {
  const access = await humanCtx(userId, projectId);
  if ((await prisma.workReportSendPlan.count({ where: { projectId } })) >= MAX_PLANS) throw new BadRequestError(`A project can have up to ${MAX_PLANS} report schedules`, 'WORK_LIMIT');
  const tpl = await resolveTemplate(projectId, input.templateRef, await projectLanguage(projectId) as Lang);
  await checkTargets(projectId, input);
  const recipients = await buildRecipients(projectId, input.recipients, [], { id: userId, approver: canApprove(access) });
  const p = await prisma.workReportSendPlan.create({
    data: {
      projectId, templateId: tpl.id, builtinKey: tpl.builtinKey, name: input.name, cadence: input.cadence, weekday: input.weekday, hour: input.hour,
      timezone: input.timezone, format: input.format, recipients: recipients as unknown as Prisma.InputJsonValue, chatHookIds: input.chatHookIds,
      slackChannelIds: input.slackChannelIds, enabled: input.enabled, createdById: userId,
    },
    include: { template: { select: { name: true } } },
  });
  const pending = recipients.filter((r) => r.status === 'PENDING').length;
  await auditProject(projectId, { actorId: userId, action: 'report_plan.create', targetType: 'project', targetId: projectId, summary: `Scheduled report “${p.name}” (${p.cadence.toLowerCase()})${pending ? ` — ${pending} outside recipient(s) waiting for approval` : ''}` });
  return planView(p, tpl.builtinKey ? tpl.name : null);
}

export async function updatePlan(userId: number, projectId: number, id: number, input: Partial<PlanInput>) {
  const access = await humanCtx(userId, projectId);
  const cur = await prisma.workReportSendPlan.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Schedule not found');
  const lang = await projectLanguage(projectId) as Lang;
  const tpl = input.templateRef ? await resolveTemplate(projectId, input.templateRef, lang) : null;
  await checkTargets(projectId, { chatHookIds: input.chatHookIds ?? [], slackChannelIds: input.slackChannelIds ?? [] });
  const recipients = input.recipients ? await buildRecipients(projectId, input.recipients, recipientsOf(cur.recipients), { id: userId, approver: canApprove(access) }) : null;
  const p = await prisma.workReportSendPlan.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(tpl ? { templateId: tpl.id, builtinKey: tpl.builtinKey } : {}),
      ...(input.cadence ? { cadence: input.cadence } : {}), ...(input.weekday !== undefined ? { weekday: input.weekday } : {}),
      ...(input.hour !== undefined ? { hour: input.hour } : {}), ...(input.timezone ? { timezone: input.timezone } : {}),
      ...(input.format ? { format: input.format } : {}), ...(recipients ? { recipients: recipients as unknown as Prisma.InputJsonValue } : {}),
      ...(input.chatHookIds ? { chatHookIds: input.chatHookIds } : {}), ...(input.slackChannelIds ? { slackChannelIds: input.slackChannelIds } : {}),
      ...(input.enabled !== undefined ? { enabled: input.enabled } : {}),
    },
    include: { template: { select: { name: true } } },
  });
  return planView(p, p.builtinKey ? (await import('./reportBuilder.js')).builtinTemplate(p.builtinKey as never, lang).name : null);
}

export async function deletePlan(userId: number, projectId: number, id: number) {
  await humanCtx(userId, projectId);
  const cur = await prisma.workReportSendPlan.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Schedule not found');
  await prisma.workReportSendPlan.delete({ where: { id } });
  await auditProject(projectId, { actorId: userId, action: 'report_plan.delete', targetType: 'project', targetId: projectId, summary: `Deleted report schedule “${cur.name}”` });
  return { ok: true };
}

/** OWNER/ADMIN duyệt (hoặc từ chối) người nhận ngoài hệ thống. */
export async function decideRecipient(userId: number, projectId: number, id: number, input: { email: string; approve: boolean }) {
  const access = await builderCtx(userId, projectId);
  if (!canApprove(access)) throw new ForbiddenError('Only a project or workspace owner/admin can approve outside recipients');
  const cur = await prisma.workReportSendPlan.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Schedule not found');
  const list = recipientsOf(cur.recipients);
  const r = list.find((x) => x.email === input.email.trim().toLowerCase());
  if (!r) throw new NotFoundError('Recipient not found');
  if (!r.external) throw new BadRequestError('Project members do not need approval', 'VALIDATION_ERROR');
  r.status = input.approve ? 'APPROVED' : 'REJECTED';
  r.decidedById = userId;
  r.decidedAt = new Date().toISOString();
  await prisma.workReportSendPlan.update({ where: { id }, data: { recipients: list as unknown as Prisma.InputJsonValue } });
  await auditProject(projectId, { actorId: userId, action: input.approve ? 'report_plan.approve_recipient' : 'report_plan.reject_recipient', targetType: 'project', targetId: projectId, summary: `${input.approve ? 'Approved' : 'Rejected'} ${r.email} as a recipient of “${cur.name}”` });
  return { ok: true, recipient: r };
}

// ─── Gửi ─────────────────────────────────────────────────────────

interface DetailRow { channel: 'email' | 'chat' | 'slack'; target: string; ok: boolean; error?: string | null }

/** Thư (thay được trong test — mặc định emailService của Resend). */
type Mailer = (m: { to: string; subject: string; html: string; text: string; attachments: Array<{ filename: string; content: string; contentType: string }> }) => Promise<{ success: boolean; error?: string }>;
const realMailer: Mailer = (m) => emailService.send({ ...m, fromName: WORK_FROM_NAME });
let mailer: Mailer = realMailer;
export function _setReportMailerForTests(f: Mailer | null) { mailer = f ?? realMailer; }

const fmtDay = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;

async function deliverPlan(plan: Prisma.WorkReportSendPlanGetPayload<object>, deliveryId: number, actorId: number, auto: boolean) {
  const detail: DetailRow[] = [];
  const access = await loadProjectAccess(actorId, plan.projectId);
  if (!access || access.role === 'CLIENT') throw new AppError('The person who created this schedule no longer has access to the project', 403, 'WORK_REPORT_OWNER_GONE');
  const lang = await projectLanguage(plan.projectId) as Lang;
  const tpl = await resolveTemplate(plan.projectId, plan.templateId ? String(plan.templateId) : `builtin:${plan.builtinKey ?? 'weekly'}`, lang);
  const report = await resolveReport(actorId, plan.projectId, tpl.layout, { refreshAi: auto });
  const file = await renderReportFile(report, plan.format === 'docx' ? 'docx' : 'pdf');
  const fileKey = `work/${plan.projectId}/reports/${deliveryId}-${crypto.randomUUID().slice(0, 8)}/${file.file}`;
  try { await getStorageProvider().put(fileKey, file.buffer, file.mime); } catch (err) { logger.warn('[work] báo cáo: lưu tệp lỗi', { err: (err as Error).message }); }
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: plan.projectId }, select: { name: true, key: true, coverUrl: true, workspace: { select: { slug: true } } } });
  const link = frontendUrl(`/work/${project.workspace.slug}/${project.key}/reports/builder?tab=log`);
  const vi = lang === 'vi';
  const period = `${fmtDay(report.period.from)} – ${fmtDay(report.period.to)}`;
  const kpiLine = report.blocks.flatMap((b) => (b.type === 'kpis' ? b.items.slice(0, 4).map((k) => `${k.label}: ${k.value}`) : [])).slice(0, 4).join(' · ');

  // Email — chỉ người nhận đã duyệt.
  for (const r of recipientsOf(plan.recipients)) {
    if (r.status !== 'APPROVED') continue;
    const mail = renderWorkEmail({
      lang, preheader: `${report.title} — ${project.name} (${period})`,
      heading: `${report.title} — ${project.name}`,
      lines: [vi ? `Báo cáo kỳ ${period} đính kèm trong thư này (${plan.format.toUpperCase()}).` : `The report for ${period} is attached (${plan.format.toUpperCase()}).`, ...(kpiLine ? [kpiLine] : [])],
      details: [{ label: vi ? 'Dự án' : 'Project', value: `${project.name} (${project.key})` }, { label: vi ? 'Kỳ' : 'Period', value: period }],
      cta: r.external ? null : { label: vi ? 'Mở trong CT Work' : 'Open in CT Work', url: link },
      reason: vi ? `Bạn nhận thư này vì có tên trong lịch gửi báo cáo “${plan.name}” của dự án ${project.name}.` : `You get this email because you are on the “${plan.name}” report schedule of ${project.name}.`,
      ignore: vi ? 'Không muốn nhận nữa? Trả lời thư này hoặc báo người quản lý dự án.' : 'Do not want these? Reply to this email or tell the project manager.',
    });
    try {
      const res = await mailer({ to: r.email, subject: `${report.title} — ${project.name} (${period})`, html: mail.html, text: mail.text, attachments: [{ filename: file.file, content: file.buffer.toString('base64'), contentType: file.mime }] });
      detail.push({ channel: 'email', target: r.email, ok: res.success, error: res.success ? null : res.error ?? 'failed' });
    } catch (err) {
      detail.push({ channel: 'email', target: r.email, ok: false, error: (err as Error).message.slice(0, 200) });
    }
  }
  // Webhook chat — tóm tắt + link (webhook không nhận tệp).
  const hookIds = idsOf(plan.chatHookIds);
  if (hookIds.length) {
    const { deliverHook } = await import('./chatHooks.service.js');
    for (const h of await prisma.workChatHook.findMany({ where: { projectId: plan.projectId, id: { in: hookIds }, enabled: true }, select: { id: true, kind: true, url: true, name: true } })) {
      const res = await deliverHook(h, { title: `📊 ${report.title} — ${project.name}`, text: [period, kpiLine].filter(Boolean).join('\n'), url: link, color: 0x4f5bd5, footer: `${plan.name} · CT Work` }, true);
      detail.push({ channel: 'chat', target: h.name, ok: res.ok, error: res.error ?? null });
    }
  }
  // Slack — đăng tệp.
  const slackIds = idsOf(plan.slackChannelIds);
  if (slackIds.length) {
    const { postFile } = await import('./slack.service.js');
    for (const c of await prisma.workSlackChannel.findMany({ where: { projectId: plan.projectId, id: { in: slackIds }, enabled: true }, include: { install: { select: { installedById: true } } } })) {
      const res = await postFile(c, { name: file.file, buffer: file.buffer, title: report.title, comment: `${report.title} — ${project.name} (${period})${kpiLine ? `\n${kpiLine}` : ''}` });
      detail.push({ channel: 'slack', target: `#${c.channelName}`, ok: res.ok, error: res.error ?? null });
    }
  }
  const okN = detail.filter((d) => d.ok).length;
  const status = !detail.length ? 'SKIPPED' : okN === detail.length ? 'SENT' : okN ? 'PARTIAL' : 'FAILED';
  await prisma.workReportDelivery.update({ where: { id: deliveryId }, data: { status, detail: detail as unknown as Prisma.InputJsonValue, fileName: file.file, fileKey, title: `${report.title} (${period})`.slice(0, 255), finishedAt: new Date() } });
  return { status, detail };
}

async function runOne(plan: Prisma.WorkReportSendPlanGetPayload<object>, periodKey: string, trigger: 'AUTO' | 'MANUAL', actorId: number) {
  let delivery: { id: number };
  try {
    delivery = await prisma.workReportDelivery.create({ data: { projectId: plan.projectId, scheduleId: plan.id, periodKey, trigger, status: 'RUNNING', title: plan.name, triggeredById: trigger === 'MANUAL' ? actorId : null } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') return null; // kỳ này đã gửi / đang gửi
    throw err;
  }
  await prisma.workReportSendPlan.update({ where: { id: plan.id }, data: { lastRunAt: new Date(), lastPeriodKey: periodKey } });
  try {
    const r = await deliverPlan(plan, delivery.id, actorId, trigger === 'AUTO');
    return { deliveryId: delivery.id, ...r };
  } catch (err) {
    const msg = err instanceof Error ? err.message.slice(0, 300) : 'failed';
    await prisma.workReportDelivery.update({ where: { id: delivery.id }, data: { status: 'FAILED', detail: [{ channel: 'email', target: '-', ok: false, error: msg }] as unknown as Prisma.InputJsonValue, finishedAt: new Date() } });
    logger.warn('[work] báo cáo tự gửi lỗi', { planId: plan.id, err: msg });
    return { deliveryId: delivery.id, status: 'FAILED', detail: [] };
  }
}

/** Gửi ngay (người bấm). */
export async function sendNow(userId: number, projectId: number, id: number) {
  await humanCtx(userId, projectId);
  const plan = await prisma.workReportSendPlan.findFirst({ where: { id, projectId } });
  if (!plan) throw new NotFoundError('Schedule not found');
  const r = await runOne(plan, `manual:${Date.now()}`, 'MANUAL', userId);
  await auditProject(projectId, { actorId: userId, action: 'report_plan.send', targetType: 'project', targetId: projectId, summary: `Sent report “${plan.name}” now (${r?.status ?? 'skipped'})` });
  return r;
}

/** Cron (mỗi giờ): mọi lịch tới hạn ⇒ gửi đúng một lần mỗi kỳ. */
export async function runDueReportPlans(now = new Date(), opts: { projectIds?: number[] } = {}): Promise<number> {
  const plans = await prisma.workReportSendPlan.findMany({
    where: { enabled: true, project: { deletedAt: null, archivedAt: null, workspace: { deletedAt: null } }, ...(opts.projectIds ? { projectId: { in: opts.projectIds } } : {}) },
    take: 5000,
  });
  let sent = 0;
  for (const p of plans) {
    try {
      const last = p.cadence === 'SPRINT' ? await prisma.workSprint.findFirst({ where: { projectId: p.projectId, state: 'CLOSED' }, orderBy: { completedAt: 'desc' }, select: { id: true, completedAt: true } }) : null;
      const due = scheduleDue(p, now, last);
      if (!due.due || !p.createdById) continue;
      const r = await runOne(p, due.periodKey, 'AUTO', p.createdById);
      if (r) sent += 1;
    } catch (err) {
      logger.warn('[work] lịch báo cáo lỗi', { planId: p.id, err: (err as Error).message });
    }
  }
  return sent;
}

// ─── Nhật ký ─────────────────────────────────────────────────────

async function listDeliveriesRaw(projectId: number, take: number) {
  const rows = await prisma.workReportDelivery.findMany({ where: { projectId }, orderBy: { id: 'desc' }, take, include: { schedule: { select: { name: true } } } });
  const ids = [...new Set(rows.map((r) => r.triggeredById).filter((x): x is number => !!x))];
  const users = new Map((await prisma.user.findMany({ where: { id: { in: ids } }, select: PUBLIC_USER })).map((u) => [u.id, displayName(u)]));
  return rows.map((r) => ({
    id: r.id, scheduleId: r.scheduleId, schedule: r.schedule?.name ?? null, periodKey: r.periodKey, trigger: r.trigger, status: r.status, title: r.title,
    detail: r.detail, fileName: r.fileName, hasFile: !!r.fileKey, by: r.triggeredById ? users.get(r.triggeredById) ?? null : null, createdAt: r.createdAt, finishedAt: r.finishedAt,
  }));
}

export async function listDeliveries(userId: number, projectId: number) {
  await builderCtx(userId, projectId);
  return listDeliveriesRaw(projectId, 100);
}

export async function deliveryFile(userId: number, projectId: number, id: number) {
  await builderCtx(userId, projectId);
  const d = await prisma.workReportDelivery.findFirst({ where: { id, projectId } });
  if (!d?.fileKey || !d.fileName) throw new NotFoundError('File not found');
  const { stream } = await getStorageProvider().readStream(d.fileKey);
  const chunks: Buffer[] = [];
  for await (const c of stream as AsyncIterable<Buffer>) chunks.push(Buffer.from(c));
  return { buffer: Buffer.concat(chunks), file: d.fileName, mime: d.fileName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'application/pdf' };
}
