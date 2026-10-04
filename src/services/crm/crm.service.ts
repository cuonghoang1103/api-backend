/**
 * CRM nhẹ của studio (CT Work đợt S5b, 05/10/2026) — /admin/crm. CHỈ ADMIN.
 * ─────────────────────────────────────────────────────────────────────────
 * Tổ chức · người liên hệ · deal (pipeline) · hoạt động · đề xuất có link khách.
 * Luật thuần (giai đoạn, xác suất, đồng bộ, hash, báo cáo) ở `rules.ts`.
 *
 * ĐỒNG BỘ PHIẾU ↔ DEAL (ghi lại ở docs/work-hub-plan.md "Đợt S5b"):
 *   · Phiếu mới (form công khai / nhập vai) ⇒ `ensureDealForRequest`: ghép người liên hệ
 *     theo EMAIL (chưa ẩn danh), tổ chức theo TÊN (không phân biệt hoa thường), tạo deal LEAD
 *     gắn `projectRequestId`. Hỏng ở đây KHÔNG được làm rớt phiếu (người gọi nuốt lỗi).
 *   · Đổi giai đoạn deal ⇒ trạng thái phiếu theo `requestStatusForStage` (phiếu PROJECT_CREATED khoá).
 *   · Admin đổi trạng thái phiếu ở /admin/project-requests ⇒ `syncDealFromRequest` CHỈ ĐẨY TỚI
 *     (`stageForRequestStatus`), bỏ qua cổng go/no-go vì quyết định đã do admin đưa ra ở trang phiếu.
 *   · Deal WON ⇒ "Create CT Work project": deal chưa có phiếu thì tạo PHIẾU NỘI BỘ trước
 *     (source `crm:deal-<id>`), đặt ACCEPTED, rồi gọi đúng `createWorkProjectFromRequest`.
 *
 * Không LLM ở đâu cả.
 */
import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { deleteObject, getSignedDownloadUrl } from '../../config/r2.js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { logger } from '../../utils/logger.js';
import { frontendUrl } from '../work/common.js';
import { getTemplate } from '../work/docTemplates.js';
import { baoAdmin } from '../thongBaoAdmin.service.js';
import {
  CONSENT_VERSION, createProjectRequest, createWorkProjectFromRequest, workProjectInfo, type CreatedWorkProject,
} from '../projectRequest.service.js';
import * as R from './rules.js';

// ─── Tiện ích ───────────────────────────────────────────────────

const clean = (s: string | null | undefined, max = 10_000): string | null => {
  const t = typeof s === 'string' ? s.trim() : '';
  return t ? t.slice(0, max) : null;
};
const num = (d: Prisma.Decimal | null | undefined): number | null => (d === null || d === undefined ? null : Number(d));

type Qualification = {
  scores?: Record<string, number>;
  notes?: Record<string, string>;
  risks?: string | null;
  decision?: R.QualificationDecision | null;
  conditions?: string | null;
  reason?: string | null;
  total?: number;
  hardFail?: boolean;
  decidedAt?: string | null;
  decidedById?: number | null;
  updatedAt?: string;
};
const qualOf = (j: Prisma.JsonValue | null): Qualification => (j && typeof j === 'object' && !Array.isArray(j) ? (j as Qualification) : {});

const DEAL_LIST_INCLUDE = {
  org: { select: { id: true, name: true } },
  contact: { select: { id: true, name: true, email: true, anonymizedAt: true } },
  owner: { select: { id: true, username: true, fullName: true } },
  projectRequest: { select: { id: true, code: true, status: true, workProjectId: true } },
} satisfies Prisma.CrmDealInclude;

type DealListRow = Prisma.CrmDealGetPayload<{ include: typeof DEAL_LIST_INCLUDE }>;

function dealOut(d: DealListRow, now = new Date()) {
  const value = num(d.valueAmount);
  const q = qualOf(d.qualification);
  return {
    id: d.id,
    title: d.title,
    stage: d.stage,
    packageId: d.packageId,
    value,
    currency: d.currency,
    probability: d.probability,
    effectiveProbability: R.effectiveProbability(d.stage, d.probability),
    weighted: R.weightedValue(value, d.stage, d.probability),
    expectedCloseAt: d.expectedCloseAt,
    source: d.source,
    isRoleplay: d.isRoleplay,
    lostReason: d.lostReason,
    stageChangedAt: d.stageChangedAt,
    lastActivityAt: d.lastActivityAt,
    stale: R.isStale(d.stage, d.lastActivityAt, now),
    createdAt: d.createdAt,
    wonAt: d.wonAt,
    lostAt: d.lostAt,
    ndaSigned: d.ndaSigned,
    decision: q.decision ?? null,
    org: d.org,
    contact: d.contact,
    owner: d.owner ? { id: d.owner.id, name: d.owner.fullName || d.owner.username } : null,
    request: d.projectRequest,
  };
}
export type DealView = ReturnType<typeof dealOut>;

async function touchDeal(dealId: number, at = new Date()) {
  await prisma.crmDeal.update({ where: { id: dealId }, data: { lastActivityAt: at } });
}

async function logNote(dealId: number | null, contactId: number | null, subject: string, body: string | null, actorId: number | null) {
  await prisma.crmActivity.create({
    data: { dealId, contactId, type: 'NOTE', subject: subject.slice(0, 200), body, done: true, doneAt: new Date(), createdById: actorId },
  });
  if (dealId) await touchDeal(dealId);
}

// ─── Đổi giai đoạn (lõi) ────────────────────────────────────────

interface ApplyOpts { actorId: number | null; lostReason?: string | null; skipRequestSync?: boolean; note?: string }

async function applyStage(dealId: number, from: string, to: R.DealStage, opts: ApplyOpts) {
  const now = new Date();
  const deal = await prisma.crmDeal.update({
    where: { id: dealId },
    data: {
      stage: to,
      stageChangedAt: now,
      lastActivityAt: now,
      wonAt: to === 'WON' ? now : null,
      lostAt: to === 'LOST' ? now : null,
      lostReason: to === 'LOST' ? clean(opts.lostReason, 5000) : null,
      stageChanges: { create: { fromStage: from, toStage: to, actorId: opts.actorId } },
    },
    select: { id: true, projectRequestId: true },
  });
  if (opts.note) await logNote(dealId, null, opts.note, null, opts.actorId);
  if (!opts.skipRequestSync && deal.projectRequestId) {
    const r = await prisma.projectRequest.findUnique({ where: { id: deal.projectRequestId }, select: { status: true } });
    const next = r ? R.requestStatusForStage(to, r.status as R.RequestStatus) : null;
    if (next) {
      await prisma.projectRequest.update({ where: { id: deal.projectRequestId }, data: { status: next, statusChangedAt: now } });
    }
  }
}

export async function changeStage(actorId: number, dealId: number, to: string, lostReason?: string | null) {
  const d = await prisma.crmDeal.findUnique({
    where: { id: dealId },
    select: { stage: true, qualification: true, projectRequest: { select: { status: true } } },
  });
  if (!d) throw new NotFoundError('Deal not found');
  const check = R.checkStageChange(d.stage, to, {
    lostReason,
    decision: qualOf(d.qualification).decision ?? null,
    projectCreated: d.projectRequest?.status === 'PROJECT_CREATED',
  });
  if (!check.ok) throw new BadRequestError(check.message, check.code);
  if (!check.noop) await applyStage(dealId, d.stage, to as R.DealStage, { actorId, lostReason });
  return getDeal(dealId);
}

// ─── Phiếu yêu cầu ⇒ deal ───────────────────────────────────────

async function findOrCreateOrg(name: string | null, note: string | null): Promise<number | null> {
  if (!name) return null;
  const n = name.trim();
  const found = await prisma.crmOrganization.findFirst({ where: { name: { equals: n, mode: 'insensitive' } }, orderBy: { id: 'asc' }, select: { id: true } });
  if (found) return found.id;
  return (await prisma.crmOrganization.create({ data: { name: n.slice(0, 200), note }, select: { id: true } })).id;
}

/**
 * Tạo (hoặc trả lại) deal cho một phiếu. Idempotent: UNIQUE `project_request_id` chặn
 * hai lượt song song (lượt sau dội P2002 ⇒ trả deal của lượt trước).
 */
export async function ensureDealForRequest(requestId: number): Promise<number | null> {
  const r = await prisma.projectRequest.findUnique({ where: { id: requestId }, include: { crmDeal: { select: { id: true } } } });
  if (!r) return null;
  if (r.crmDeal) return r.crmDeal.id;

  const orgId = await findOrCreateOrg(r.organization, `Từ phiếu ${r.code}`);
  const email = r.email.trim().toLowerCase();
  const consentSource = `project-request:${r.code} v${r.consentVersion ?? '?'}`;
  let contact = await prisma.crmContact.findFirst({ where: { email, anonymizedAt: null }, orderBy: { id: 'asc' } });
  if (!contact) {
    contact = await prisma.crmContact.create({
      data: {
        name: r.name.slice(0, 120), title: r.senderRole, email, phone: r.phone, orgId,
        preferredChannel: 'EMAIL', consent: r.consent, consentAt: r.consentAt, consentSource,
      },
    });
  } else {
    // Ghép theo email: chỉ ĐIỀN chỗ trống, không ghi đè thứ admin đã sửa; đồng ý mới nhất thắng.
    contact = await prisma.crmContact.update({
      where: { id: contact.id },
      data: {
        phone: contact.phone ?? r.phone,
        title: contact.title ?? r.senderRole,
        orgId: contact.orgId ?? orgId,
        ...(r.consent ? { consent: true, consentAt: r.consentAt, consentSource } : {}),
      },
    });
  }

  const startStage: R.DealStage = R.stageForRequestStatus('LEAD', r.status) ?? 'LEAD';
  const title = `${(r.organization || r.name).replace(/^\[NHẬP VAI\]\s*/, '')} — ${r.code}`.slice(0, 200);
  try {
    const deal = await prisma.crmDeal.create({
      data: {
        title: r.isRoleplay ? `[Nhập vai] ${title}`.slice(0, 200) : title,
        orgId, contactId: contact.id,
        packageId: R.packageIdFromSource(r.source),
        source: r.source ?? 'about/nhan-du-an',
        projectRequestId: r.id,
        isRoleplay: r.isRoleplay,
        stage: startStage,
        wonAt: startStage === 'WON' ? new Date() : null,
        lostAt: startStage === 'LOST' ? new Date() : null,
        lostReason: startStage === 'LOST' ? 'Phiếu đã bị từ chối trước khi có CRM' : null,
        stageChanges: { create: [{ fromStage: null, toStage: 'LEAD' }, ...(startStage !== 'LEAD' ? [{ fromStage: 'LEAD', toStage: startStage }] : [])] },
      },
      select: { id: true },
    });
    await prisma.crmActivity.create({
      data: {
        dealId: deal.id, contactId: contact.id, type: 'NOTE', done: true, doneAt: new Date(),
        subject: `Phiếu yêu cầu ${r.code} (${r.productTypes.join(', ')})`,
        body: r.needs.slice(0, 2000),
      },
    });
    return deal.id;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const again = await prisma.crmDeal.findUnique({ where: { projectRequestId: r.id }, select: { id: true } });
      return again?.id ?? null;
    }
    throw err;
  }
}

/** Admin đổi trạng thái phiếu ⇒ đẩy deal tới (không kéo lùi). Không ném — người gọi `void`. */
export async function syncDealFromRequest(requestId: number, actorId: number | null): Promise<void> {
  try {
    const dealId = await ensureDealForRequest(requestId);
    if (!dealId) return;
    const [d, r] = await Promise.all([
      prisma.crmDeal.findUnique({ where: { id: dealId }, select: { stage: true } }),
      prisma.projectRequest.findUnique({ where: { id: requestId }, select: { status: true, code: true } }),
    ]);
    if (!d || !r) return;
    const next = R.stageForRequestStatus(d.stage, r.status);
    if (!next) return;
    await applyStage(dealId, d.stage, next, {
      actorId,
      skipRequestSync: true,
      lostReason: next === 'LOST' ? `Phiếu ${r.code} bị từ chối ở /admin/project-requests` : null,
      note: `Đồng bộ từ phiếu ${r.code}: ${r.status} ⇒ ${next}`,
    });
  } catch (err) {
    logger.error('[crm] đồng bộ phiếu ⇒ deal hỏng', { requestId, error: err instanceof Error ? err.message : String(err) });
  }
}

/** Tạo deal cho mọi phiếu chưa có deal (phiếu gửi trước đợt S5b). */
export async function backfillFromRequests(): Promise<{ created: number }> {
  const rows = await prisma.projectRequest.findMany({ where: { crmDeal: null }, select: { id: true }, orderBy: { id: 'asc' }, take: 500 });
  let created = 0;
  for (const r of rows) if (await ensureDealForRequest(r.id)) created++;
  return { created };
}

// ─── Deal ───────────────────────────────────────────────────────

export interface DealInput {
  title?: string;
  orgId?: number | null;
  contactId?: number | null;
  packageId?: string | null;
  valueAmount?: number | null;
  currency?: string;
  probability?: number | null;
  expectedCloseAt?: string | null;
  ownerId?: number | null;
  source?: string | null;
  ndaSigned?: boolean;
  ndaSignedAt?: string | null;
}

async function assertRefs(input: DealInput) {
  if (input.orgId) {
    if (!(await prisma.crmOrganization.findUnique({ where: { id: input.orgId }, select: { id: true } }))) throw new BadRequestError('Organization not found', 'CRM_BAD_ORG');
  }
  if (input.contactId) {
    const c = await prisma.crmContact.findUnique({ where: { id: input.contactId }, select: { anonymizedAt: true } });
    if (!c) throw new BadRequestError('Contact not found', 'CRM_BAD_CONTACT');
    if (c.anonymizedAt) throw new BadRequestError('This contact was anonymized', 'CRM_CONTACT_ANONYMIZED');
  }
  if (input.ownerId) {
    const admin = await prisma.user.findFirst({ where: { id: input.ownerId, roles: { some: { role: { name: { in: ['ROLE_ADMIN', 'ADMIN', 'admin'] } } } } }, select: { id: true } });
    if (!admin) throw new BadRequestError('Owner must be an admin', 'CRM_BAD_OWNER');
  }
  if (input.packageId && !R.PACKAGE_IDS.includes(input.packageId)) throw new BadRequestError('Unknown package', 'CRM_BAD_PACKAGE');
}

const dateOrNull = (s: string | null | undefined) => (s ? new Date(`${s.slice(0, 10)}T00:00:00.000Z`) : null);

function dealData(input: DealInput): Prisma.CrmDealUncheckedUpdateInput {
  const data: Prisma.CrmDealUncheckedUpdateInput = {};
  if (input.title !== undefined) data.title = input.title.trim().slice(0, 200);
  if (input.orgId !== undefined) data.orgId = input.orgId;
  if (input.contactId !== undefined) data.contactId = input.contactId;
  if (input.packageId !== undefined) data.packageId = input.packageId;
  if (input.valueAmount !== undefined) data.valueAmount = input.valueAmount === null ? null : new Prisma.Decimal(input.valueAmount);
  if (input.currency !== undefined) data.currency = input.currency.toUpperCase();
  if (input.probability !== undefined) data.probability = input.probability;
  if (input.expectedCloseAt !== undefined) data.expectedCloseAt = dateOrNull(input.expectedCloseAt);
  if (input.ownerId !== undefined) data.ownerId = input.ownerId;
  if (input.source !== undefined) data.source = clean(input.source, 100);
  if (input.ndaSigned !== undefined) data.ndaSigned = input.ndaSigned;
  if (input.ndaSignedAt !== undefined) data.ndaSignedAt = dateOrNull(input.ndaSignedAt);
  return data;
}

export async function createDeal(actorId: number, input: DealInput & { title: string; stage?: string }) {
  const stage = input.stage ?? 'LEAD';
  if (!R.CREATE_STAGES.includes(stage as R.DealStage)) {
    throw new BadRequestError('New deals start at LEAD or QUALIFIED', 'CRM_BAD_STAGE');
  }
  await assertRefs(input);
  const d = await prisma.crmDeal.create({
    data: {
      ...(dealData(input) as Prisma.CrmDealUncheckedCreateInput),
      title: input.title.trim().slice(0, 200),
      stage,
      ownerId: input.ownerId === undefined ? actorId : input.ownerId,
      source: clean(input.source, 100) ?? 'manual',
      stageChanges: { create: { fromStage: null, toStage: stage, actorId } },
    },
    select: { id: true },
  });
  return getDeal(d.id);
}

export async function updateDeal(actorId: number, dealId: number, input: DealInput) {
  const cur = await prisma.crmDeal.findUnique({ where: { id: dealId }, select: { id: true } });
  if (!cur) throw new NotFoundError('Deal not found');
  await assertRefs(input);
  await prisma.crmDeal.update({ where: { id: dealId }, data: dealData(input) });
  if (input.ndaSigned !== undefined) await logNote(dealId, null, input.ndaSigned ? 'NDA đã ký' : 'Bỏ đánh dấu NDA đã ký', null, actorId);
  return getDeal(dealId);
}

export async function deleteDeal(dealId: number) {
  const d = await prisma.crmDeal.findUnique({ where: { id: dealId }, select: { ndaFileKey: true, projectRequest: { select: { status: true } } } });
  if (!d) throw new NotFoundError('Deal not found');
  if (d.projectRequest?.status === 'PROJECT_CREATED') throw new BadRequestError('This deal has a CT Work project — it cannot be deleted', 'CRM_DEAL_LOCKED');
  if (d.ndaFileKey) await deleteObject(d.ndaFileKey).catch(() => {});
  await prisma.crmDeal.delete({ where: { id: dealId } });
}

export interface DealFilter {
  q?: string;
  stage?: string;
  ownerId?: number;
  source?: string;
  packageId?: string;
  stale?: boolean;
  roleplay?: 'only' | 'exclude';
  orgId?: number;
  contactId?: number;
}

function dealWhere(f: DealFilter): Prisma.CrmDealWhereInput {
  const where: Prisma.CrmDealWhereInput = {};
  if (f.stage) where.stage = f.stage;
  if (f.ownerId) where.ownerId = f.ownerId;
  if (f.packageId) where.packageId = f.packageId;
  if (f.orgId) where.orgId = f.orgId;
  if (f.contactId) where.contactId = f.contactId;
  if (f.source) where.source = { startsWith: f.source === '(manual)' ? 'manual' : f.source };
  if (f.roleplay === 'only') where.isRoleplay = true;
  if (f.roleplay === 'exclude') where.isRoleplay = false;
  if (f.stale) {
    where.stage = f.stage && R.isOpen(f.stage) ? f.stage : { in: R.OPEN_STAGES };
    where.lastActivityAt = { lt: new Date(Date.now() - R.STALE_DAYS * 86_400_000) };
  }
  if (f.q) {
    const q = f.q.trim();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { org: { name: { contains: q, mode: 'insensitive' } } },
      { contact: { name: { contains: q, mode: 'insensitive' } } },
      { contact: { email: { contains: q, mode: 'insensitive' } } },
      { projectRequest: { code: { contains: q, mode: 'insensitive' } } },
    ];
  }
  return where;
}

export async function listDeals(f: DealFilter, page = 1, limit = 50) {
  const where = dealWhere(f);
  const [rows, total] = await Promise.all([
    prisma.crmDeal.findMany({ where, include: DEAL_LIST_INCLUDE, orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * limit, take: limit }),
    prisma.crmDeal.count({ where }),
  ]);
  const now = new Date();
  return { items: rows.map((d) => dealOut(d, now)), total, page, limit };
}

/** Kanban: mọi deal mở + deal đóng trong 60 ngày gần nhất, kèm tổng cột (tách theo tiền tệ). */
export async function pipeline(f: DealFilter) {
  const since = new Date(Date.now() - 60 * 86_400_000);
  const where: Prisma.CrmDealWhereInput = {
    AND: [dealWhere({ ...f, stage: undefined, stale: undefined }), { OR: [{ stage: { in: R.OPEN_STAGES } }, { stageChangedAt: { gte: since } }] }],
  };
  const rows = await prisma.crmDeal.findMany({ where, include: DEAL_LIST_INCLUDE, orderBy: [{ stageChangedAt: 'desc' }], take: 1000 });
  const now = new Date();
  const deals = rows.map((d) => dealOut(d, now)).filter((d) => !f.stale || d.stale);
  const totals = R.columnTotals(deals.map((d) => ({ stage: d.stage, value: d.value, currency: d.currency, probability: d.probability })));
  return { stages: R.DEAL_STAGES, deals, totals };
}

export async function getDeal(dealId: number) {
  const d = await prisma.crmDeal.findUnique({
    where: { id: dealId },
    include: {
      ...DEAL_LIST_INCLUDE,
      contact: { select: { id: true, name: true, email: true, phone: true, title: true, preferredChannel: true, consent: true, consentAt: true, anonymizedAt: true } },
      activities: { orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 300 },
      proposals: { orderBy: { version: 'desc' } },
      stageChanges: { orderBy: [{ at: 'asc' }, { id: 'asc' }] },
    },
  });
  if (!d) throw new NotFoundError('Deal not found');
  const now = new Date();
  const base = dealOut(d as unknown as DealListRow, now);
  const workProject = d.projectRequest?.workProjectId ? await workProjectInfo(d.projectRequest.workProjectId) : null;
  return {
    ...base,
    contact: d.contact,
    qualification: qualOf(d.qualification),
    qualificationScore: R.scoreQualification(qualOf(d.qualification).scores ?? {}),
    ndaSignedAt: d.ndaSignedAt,
    ndaFileName: d.ndaFileName,
    hasNdaFile: !!d.ndaFileKey,
    activities: d.activities,
    dueTasks: d.activities.filter((a) => a.type === 'TASK' && !a.done).sort((a, b) => (a.dueAt?.getTime() ?? Infinity) - (b.dueAt?.getTime() ?? Infinity)),
    proposals: d.proposals.map((p) => proposalOut(p, now)),
    stageChanges: d.stageChanges,
    workProject,
  };
}

// ─── Bảng đánh giá phù hợp ──────────────────────────────────────

export interface QualificationInput {
  scores: Record<string, number | null>;
  notes?: Record<string, string>;
  risks?: string | null;
  decision?: R.QualificationDecision | null;
  conditions?: string | null;
  reason?: string | null;
}

export async function saveQualification(actorId: number, dealId: number, input: QualificationInput) {
  const d = await prisma.crmDeal.findUnique({ where: { id: dealId }, select: { qualification: true } });
  if (!d) throw new NotFoundError('Deal not found');
  const scores: Record<string, number> = {};
  for (const c of R.QUALIFICATION_CRITERIA) {
    const v = input.scores[String(c.n)];
    if (v === 0 || v === 1 || v === 2) scores[String(c.n)] = v;
  }
  const s = R.scoreQualification(scores);
  const decision = input.decision ?? null;
  const check = R.checkDecision(decision, s, input.conditions);
  if (!check.ok) throw new BadRequestError(check.message, check.code);
  const prev = qualOf(d.qualification);
  const notes: Record<string, string> = {};
  for (const [k, v] of Object.entries(input.notes ?? {})) if (typeof v === 'string' && v.trim()) notes[k] = v.trim().slice(0, 1000);
  const q: Qualification = {
    scores, notes,
    risks: clean(input.risks, 5000),
    decision,
    conditions: clean(input.conditions, 2000),
    reason: clean(input.reason, 2000),
    total: s.total,
    hardFail: s.hardFail,
    decidedAt: decision ? (prev.decision === decision && prev.decidedAt ? prev.decidedAt : new Date().toISOString()) : null,
    decidedById: decision ? actorId : null,
    updatedAt: new Date().toISOString(),
  };
  await prisma.crmDeal.update({ where: { id: dealId }, data: { qualification: q as unknown as Prisma.InputJsonValue } });
  if (decision && decision !== prev.decision) {
    await logNote(dealId, null, `Go/no-go: ${decision} (${s.total}/${s.max})`, q.reason ?? null, actorId);
  }
  return getDeal(dealId);
}

// ─── NDA (tệp trên R2, KHÔNG công khai — tải bằng URL ký 10 phút) ──

const NDA_MAX = 15 * 1024 * 1024;
const NDA_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export async function uploadNda(actorId: number, dealId: number, file: { buffer: Buffer; originalname: string; mimetype: string; size: number }) {
  const d = await prisma.crmDeal.findUnique({ where: { id: dealId }, select: { ndaFileKey: true, ndaSignedAt: true } });
  if (!d) throw new NotFoundError('Deal not found');
  const storage = getStorageProvider();
  if (storage.kind !== 'r2') throw new BadRequestError('NDA files need cloud storage (R2), which is not configured here', 'CRM_NO_STORAGE');
  if (!file.size || file.size > NDA_MAX) throw new BadRequestError('NDA file must be 15 MB or smaller', 'CRM_FILE_TOO_LARGE');
  if (!NDA_TYPES.includes(file.mimetype)) throw new BadRequestError('NDA must be a PDF, Word document or image', 'CRM_BAD_FILE_TYPE');
  const safe = file.originalname.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'nda.pdf';
  const key = `crm/nda/${dealId}/${crypto.randomUUID()}/${safe}`;
  await storage.put(key, file.buffer, file.mimetype);
  await prisma.crmDeal.update({
    where: { id: dealId },
    data: { ndaFileKey: key, ndaFileName: file.originalname.slice(0, 255), ndaSigned: true, ndaSignedAt: d.ndaSignedAt ?? dateOrNull(new Date().toISOString()) },
  });
  if (d.ndaFileKey) await deleteObject(d.ndaFileKey).catch(() => {});
  await logNote(dealId, null, `Tải lên NDA: ${file.originalname.slice(0, 150)}`, null, actorId);
  return getDeal(dealId);
}

export async function ndaUrl(dealId: number) {
  const d = await prisma.crmDeal.findUnique({ where: { id: dealId }, select: { ndaFileKey: true, ndaFileName: true } });
  if (!d?.ndaFileKey) throw new NotFoundError('No NDA file');
  return getSignedDownloadUrl(d.ndaFileKey, 600, d.ndaFileName ?? undefined);
}

export async function deleteNda(actorId: number, dealId: number) {
  const d = await prisma.crmDeal.findUnique({ where: { id: dealId }, select: { ndaFileKey: true } });
  if (!d) throw new NotFoundError('Deal not found');
  if (d.ndaFileKey) await deleteObject(d.ndaFileKey).catch(() => {});
  await prisma.crmDeal.update({ where: { id: dealId }, data: { ndaFileKey: null, ndaFileName: null } });
  await logNote(dealId, null, 'Xoá tệp NDA', null, actorId);
  return getDeal(dealId);
}

// ─── Hoạt động ──────────────────────────────────────────────────

export interface ActivityInput { dealId?: number | null; contactId?: number | null; type: string; subject: string; body?: string | null; dueAt?: string | null; done?: boolean }

export async function createActivity(actorId: number, input: ActivityInput) {
  if (!input.dealId && !input.contactId) throw new BadRequestError('Attach the activity to a deal or a contact', 'CRM_BAD_ACTIVITY');
  if (input.dealId && !(await prisma.crmDeal.findUnique({ where: { id: input.dealId }, select: { id: true } }))) throw new NotFoundError('Deal not found');
  let contactId = input.contactId ?? null;
  if (contactId && !(await prisma.crmContact.findUnique({ where: { id: contactId }, select: { id: true } }))) throw new NotFoundError('Contact not found');
  if (!contactId && input.dealId) contactId = (await prisma.crmDeal.findUnique({ where: { id: input.dealId }, select: { contactId: true } }))?.contactId ?? null;
  const isTask = input.type === 'TASK';
  // Việc đã làm (gọi, họp, ghi chú) mặc định "xong"; TASK là việc phải làm ⇒ mặc định chưa xong.
  const done = input.done ?? !isTask;
  const a = await prisma.crmActivity.create({
    data: {
      dealId: input.dealId ?? null, contactId, type: input.type, subject: input.subject.trim().slice(0, 200),
      body: clean(input.body, 20_000), dueAt: input.dueAt ? new Date(input.dueAt) : null,
      done, doneAt: done ? new Date() : null, createdById: actorId,
    },
  });
  if (a.dealId) await touchDeal(a.dealId);
  return a;
}

export async function updateActivity(actorId: number, id: number, input: Partial<Pick<ActivityInput, 'subject' | 'body' | 'dueAt' | 'done'>>) {
  const cur = await prisma.crmActivity.findUnique({ where: { id } });
  if (!cur) throw new NotFoundError('Activity not found');
  const data: Prisma.CrmActivityUpdateInput = {};
  if (input.subject !== undefined) data.subject = input.subject.trim().slice(0, 200);
  if (input.body !== undefined) data.body = clean(input.body, 20_000);
  if (input.dueAt !== undefined) {
    data.dueAt = input.dueAt ? new Date(input.dueAt) : null;
    data.notifiedAt = null; // đổi hạn ⇒ được báo lại khi tới hạn mới
  }
  if (input.done !== undefined) { data.done = input.done; data.doneAt = input.done ? new Date() : null; }
  const a = await prisma.crmActivity.update({ where: { id }, data });
  if (a.dealId && input.done) await touchDeal(a.dealId);
  void actorId;
  return a;
}

export async function deleteActivity(id: number) {
  const r = await prisma.crmActivity.deleteMany({ where: { id } });
  if (!r.count) throw new NotFoundError('Activity not found');
}

/** Việc (TASK) chưa xong, hạn trong `days` ngày tới hoặc đã quá hạn. */
export async function dueTasks(days = 7) {
  const until = new Date(Date.now() + days * 86_400_000);
  return prisma.crmActivity.findMany({
    where: { type: 'TASK', done: false, dueAt: { lte: until } },
    orderBy: { dueAt: 'asc' },
    take: 100,
    include: { deal: { select: { id: true, title: true, stage: true } }, contact: { select: { id: true, name: true } } },
  });
}

// ─── Đề xuất ────────────────────────────────────────────────────

type ProposalRow = Prisma.CrmProposalGetPayload<Record<string, never>>;
function proposalOut(p: ProposalRow, now = new Date()) {
  return {
    id: p.id, dealId: p.dealId, version: p.version, title: p.title, content: p.content, status: p.status,
    linkState: R.proposalLinkState(p, now),
    url: p.token && !p.tokenRevokedAt ? frontendUrl(`/proposal/${p.token}`) : null,
    tokenExpiresAt: p.tokenExpiresAt, tokenRevokedAt: p.tokenRevokedAt, contentHash: p.contentHash,
    sentAt: p.sentAt, viewedAt: p.viewedAt, respondedAt: p.respondedAt,
    responseName: p.responseName, responseNote: p.responseNote, responseIp: p.responseIp, responseUserAgent: p.responseUserAgent,
    createdAt: p.createdAt, updatedAt: p.updatedAt,
  };
}

export async function createProposal(actorId: number, dealId: number, fromVersion?: number | null) {
  const deal = await prisma.crmDeal.findUnique({
    where: { id: dealId },
    select: { id: true, title: true, org: { select: { name: true } }, projectRequest: { select: { code: true } }, proposals: { select: { version: true, title: true, content: true } } },
  });
  if (!deal) throw new NotFoundError('Deal not found');
  const version = deal.proposals.reduce((m, p) => Math.max(m, p.version), 0) + 1;
  let title: string;
  let content: string;
  if (fromVersion) {
    const src = deal.proposals.find((p) => p.version === fromVersion);
    if (!src) throw new NotFoundError('Source version not found');
    title = src.title;
    content = src.content.replace(/\| v\d+ \|/, `| v${version} |`);
  } else {
    const [tp, tq] = await Promise.all([getTemplate('de-xuat-giai-phap'), getTemplate('bao-gia')]);
    title = `Đề xuất giải pháp — ${deal.title}`.slice(0, 200);
    content = R.composeProposalMarkdown(tp.markdown, tq.markdown, {
      dealTitle: deal.title, orgName: deal.org?.name ?? null, requestCode: deal.projectRequest?.code ?? null,
      version, date: new Date().toISOString().slice(0, 10),
    });
  }
  try {
    const p = await prisma.crmProposal.create({ data: { dealId, version, title, content, createdById: actorId } });
    return proposalOut(p);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('Another version was just created — reload');
    throw err;
  }
}

export async function updateProposal(id: number, input: { title?: string; content?: string }) {
  const p = await prisma.crmProposal.findUnique({ where: { id }, select: { status: true } });
  if (!p) throw new NotFoundError('Proposal not found');
  if (p.status !== 'DRAFT') throw new AppError('Sent proposals are frozen — create a new version to change them', 409, 'CRM_PROPOSAL_FROZEN');
  const data: Prisma.CrmProposalUpdateInput = {};
  if (input.title !== undefined) data.title = input.title.trim().slice(0, 200);
  if (input.content !== undefined) data.content = input.content;
  return proposalOut(await prisma.crmProposal.update({ where: { id }, data }));
}

export async function deleteProposal(id: number) {
  const p = await prisma.crmProposal.findUnique({ where: { id }, select: { status: true } });
  if (!p) throw new NotFoundError('Proposal not found');
  if (p.status !== 'DRAFT') throw new AppError('Only drafts can be deleted', 409, 'CRM_PROPOSAL_FROZEN');
  await prisma.crmProposal.delete({ where: { id } });
}

/**
 * Gửi: đóng băng nội dung (hash), cấp token có hạn, thu hồi link của các bản đã gửi trước
 * (khách chỉ thấy bản mới nhất), đẩy deal tới PROPOSAL nếu còn ở sau. Cần go/no-go = GO.
 */
export async function sendProposal(actorId: number, id: number, days = R.PROPOSAL_TTL_DAYS_DEFAULT) {
  const p = await prisma.crmProposal.findUnique({ where: { id }, include: { deal: { select: { id: true, stage: true, qualification: true, projectRequest: { select: { status: true } } } } } });
  if (!p) throw new NotFoundError('Proposal not found');
  if (p.status !== 'DRAFT') throw new AppError('This version was already sent', 409, 'CRM_PROPOSAL_FROZEN');
  if (!p.content.trim()) throw new BadRequestError('The proposal is empty', 'CRM_PROPOSAL_EMPTY');
  const decision = qualOf(p.deal.qualification).decision ?? null;
  if (decision !== 'GO' && decision !== 'GO_CONDITIONAL') {
    throw new BadRequestError('Complete the go/no-go qualification (GO) before sending a proposal', 'CRM_QUALIFICATION_REQUIRED');
  }
  if (!R.isOpen(p.deal.stage)) throw new BadRequestError('The deal is closed', 'CRM_DEAL_CLOSED');
  const ttl = Math.min(R.PROPOSAL_TTL_DAYS_MAX, Math.max(1, Math.round(days)));
  const now = new Date();
  const token = crypto.randomBytes(24).toString('base64url');
  const hash = R.proposalHash({ dealId: p.dealId, version: p.version, title: p.title, content: p.content });
  await prisma.$transaction([
    prisma.crmProposal.updateMany({ where: { dealId: p.dealId, status: 'SENT', tokenRevokedAt: null }, data: { tokenRevokedAt: now } }),
    prisma.crmProposal.update({
      where: { id },
      data: { status: 'SENT', token, tokenExpiresAt: new Date(now.getTime() + ttl * 86_400_000), contentHash: hash, sentAt: now },
    }),
  ]);
  const idx = R.OPEN_STAGES.indexOf(p.deal.stage as R.DealStage);
  if (idx < R.OPEN_STAGES.indexOf('PROPOSAL')) {
    await applyStage(p.dealId, p.deal.stage, 'PROPOSAL', { actorId });
  }
  await logNote(p.dealId, null, `Đã gửi đề xuất v${p.version} — link hết hạn sau ${ttl} ngày`, null, actorId);
  return proposalOut(await prisma.crmProposal.findUniqueOrThrow({ where: { id } }));
}

export async function revokeProposal(actorId: number, id: number) {
  const p = await prisma.crmProposal.findUnique({ where: { id }, select: { dealId: true, version: true, token: true } });
  if (!p) throw new NotFoundError('Proposal not found');
  if (!p.token) throw new BadRequestError('This version has no link', 'CRM_PROPOSAL_NOT_SENT');
  const row = await prisma.crmProposal.update({ where: { id }, data: { tokenRevokedAt: new Date() } });
  await logNote(p.dealId, null, `Thu hồi link đề xuất v${p.version}`, null, actorId);
  return proposalOut(row);
}

// ── Trang khách /proposal/[token] ──

const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

/** Bản CÔNG KHAI — danh sách trắng (không email/SĐT/giá trị deal/ghi chú nội bộ). */
export async function publicProposal(token: string) {
  if (!TOKEN_RE.test(token)) throw new NotFoundError('Proposal not found');
  const p = await prisma.crmProposal.findUnique({ where: { token }, include: { deal: { select: { org: { select: { name: true } } } } } });
  if (!p) throw new NotFoundError('Proposal not found');
  const state = R.proposalLinkState(p);
  if (state === 'REVOKED' || state === 'NOT_SENT') throw new NotFoundError('Proposal not found');
  if (state === 'EXPIRED') throw new AppError('This proposal link has expired', 410, 'PROPOSAL_EXPIRED');
  if (!p.viewedAt) await prisma.crmProposal.update({ where: { id: p.id }, data: { viewedAt: new Date() } });
  const hash = R.proposalHash({ dealId: p.dealId, version: p.version, title: p.title, content: p.content });
  return {
    title: p.title, version: p.version, content: p.content, status: p.status,
    sentAt: p.sentAt, expiresAt: p.tokenExpiresAt, contentHash: p.contentHash,
    integrity: hash === p.contentHash,
    orgName: p.deal.org?.name?.replace(/^\[NHẬP VAI\]\s*/, '') ?? null,
    respondedAt: p.respondedAt, responseName: p.status === 'SENT' ? null : p.responseName,
  };
}

export async function respondProposal(
  token: string,
  input: { decision: 'ACCEPT' | 'DECLINE'; name: string; note?: string | null; contentHash: string },
  meta: { ip: string | null; userAgent: string | null },
) {
  if (!TOKEN_RE.test(token)) throw new NotFoundError('Proposal not found');
  const p = await prisma.crmProposal.findUnique({ where: { token }, include: { deal: { select: { id: true, stage: true, title: true } } } });
  if (!p) throw new NotFoundError('Proposal not found');
  const state = R.proposalLinkState(p);
  if (state === 'REVOKED' || state === 'NOT_SENT') throw new NotFoundError('Proposal not found');
  if (p.status !== 'SENT') throw new AppError('This proposal was already answered', 409, 'PROPOSAL_ALREADY_RESPONDED');
  if (state === 'EXPIRED') throw new AppError('This proposal link has expired', 410, 'PROPOSAL_EXPIRED');
  const hash = R.proposalHash({ dealId: p.dealId, version: p.version, title: p.title, content: p.content });
  // Khách chỉ "ký" được ĐÚNG nội dung đã xem: hash gửi lên phải khớp hash lúc gửi VÀ hash tính lại bây giờ.
  if (input.contentHash !== p.contentHash || hash !== p.contentHash) {
    throw new AppError('The proposal content changed — reload the page', 409, 'PROPOSAL_CHANGED');
  }
  const status = input.decision === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';
  const now = new Date();
  const won = await prisma.crmProposal.updateMany({
    where: { id: p.id, status: 'SENT', tokenRevokedAt: null },
    data: {
      status, respondedAt: now,
      responseName: input.name.trim().slice(0, 120), responseNote: clean(input.note, 5000),
      responseIp: meta.ip?.slice(0, 64) ?? null, responseUserAgent: meta.userAgent?.slice(0, 500) ?? null,
    },
  });
  if (!won.count) throw new AppError('This proposal was already answered', 409, 'PROPOSAL_ALREADY_RESPONDED');

  const label = status === 'ACCEPTED' ? 'CHẤP THUẬN' : 'TỪ CHỐI';
  await logNote(p.dealId, null, `Khách ${label} đề xuất v${p.version} — ${input.name.trim().slice(0, 80)}`,
    `Thời điểm: ${now.toISOString()}\nIP: ${meta.ip ?? '—'}\nHash nội dung: ${hash}${input.note ? `\nLời nhắn: ${input.note.slice(0, 2000)}` : ''}`, null);
  if (status === 'ACCEPTED') {
    const idx = R.OPEN_STAGES.indexOf(p.deal.stage as R.DealStage);
    if (idx >= 0 && idx < R.OPEN_STAGES.indexOf('NEGOTIATION')) {
      await applyStage(p.dealId, p.deal.stage, 'NEGOTIATION', { actorId: null });
    }
  }
  void baoAdmin({
    loai: 'KHAC',
    tieuDe: `Khách ${label} đề xuất v${p.version} — ${p.deal.title}`.slice(0, 200),
    noiDung: `${input.name.trim().slice(0, 80)}${input.note ? `: ${input.note.slice(0, 300)}` : ''}`,
    duongDan: `/admin/crm?deal=${p.dealId}`,
    mucDo: 'can_xu_ly',
    entityId: p.dealId,
    khoaChongTrung: `CRM_PROPOSAL:${p.id}`,
  });
  return { status, respondedAt: now, contentHash: hash };
}

// ─── Tạo dự án CT Work từ deal WON ──────────────────────────────

export async function createWorkProjectFromDeal(actorId: number, dealId: number): Promise<CreatedWorkProject & { requestId: number }> {
  const d = await prisma.crmDeal.findUnique({
    where: { id: dealId },
    include: { contact: true, org: true, projectRequest: { select: { id: true, status: true } } },
  });
  if (!d) throw new NotFoundError('Deal not found');
  if (d.stage !== 'WON') throw new BadRequestError('Only WON deals can become a CT Work project', 'CRM_NOT_WON');

  let requestId = d.projectRequest?.id ?? null;
  if (!requestId) {
    // Deal không đến từ phiếu ⇒ tạo PHIẾU NỘI BỘ để tái dùng nguyên luồng createWorkProjectFromRequest.
    const email = d.contact?.email;
    if (!email) throw new BadRequestError('The deal’s contact needs an email before creating a project', 'CRM_CONTACT_EMAIL_REQUIRED');
    const req = await createProjectRequest(
      {
        name: d.contact?.name ?? d.org?.name ?? d.title,
        email,
        phone: d.contact?.phone ?? null,
        organization: d.org?.name ?? null,
        senderRole: d.contact?.title ?? null,
        productTypes: (d.packageId && R.PACKAGE_PRODUCT_TYPES[d.packageId]) || ['OTHER'],
        needs: `Phiếu NỘI BỘ tạo từ deal CRM #${d.id}: ${d.title}`,
        consentVersion: d.contact?.consent ? CONSENT_VERSION : 'crm-internal',
        source: `crm:deal-${d.id}`,
      },
      { ip: null, userAgent: 'crm', isRoleplay: d.isRoleplay },
    );
    requestId = req.id;
    try {
      await prisma.crmDeal.update({ where: { id: d.id }, data: { projectRequestId: req.id } });
    } catch (err) {
      await prisma.projectRequest.delete({ where: { id: req.id } }).catch(() => {});
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('Another click is creating this project — reload');
      throw err;
    }
    await prisma.projectRequest.update({ where: { id: req.id }, data: { status: 'ACCEPTED', statusChangedAt: new Date() } });
    await logNote(d.id, null, `Tạo phiếu nội bộ ${req.code} cho deal`, null, actorId);
  } else if (d.projectRequest && d.projectRequest.status !== 'ACCEPTED' && d.projectRequest.status !== 'PROJECT_CREATED') {
    await prisma.projectRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED', statusChangedAt: new Date() } });
  }

  const result = await createWorkProjectFromRequest(actorId, requestId);
  if (!result.alreadyExisted) await logNote(d.id, null, `Đã tạo dự án CT Work ${result.key}`, result.url, actorId);
  return { ...result, requestId };
}

// ─── Tổ chức ────────────────────────────────────────────────────

export interface OrgInput { name?: string; industry?: string | null; size?: string | null; website?: string | null; taxCode?: string | null; note?: string | null }

function orgData(i: OrgInput) {
  const data: Prisma.CrmOrganizationUpdateInput = {};
  if (i.name !== undefined) data.name = i.name.trim().slice(0, 200);
  if (i.industry !== undefined) data.industry = clean(i.industry, 120);
  if (i.size !== undefined) data.size = clean(i.size, 30);
  if (i.website !== undefined) data.website = clean(i.website, 300);
  if (i.taxCode !== undefined) data.taxCode = clean(i.taxCode, 20);
  if (i.note !== undefined) data.note = clean(i.note, 20_000);
  return data;
}

export async function listOrgs(q?: string, page = 1, limit = 50) {
  const where: Prisma.CrmOrganizationWhereInput = q
    ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { industry: { contains: q, mode: 'insensitive' } }, { taxCode: { contains: q } }] }
    : {};
  const [items, total] = await Promise.all([
    prisma.crmOrganization.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * limit, take: limit, include: { _count: { select: { contacts: true, deals: true } } } }),
    prisma.crmOrganization.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function createOrg(i: OrgInput & { name: string }) {
  return prisma.crmOrganization.create({ data: orgData(i) as Prisma.CrmOrganizationCreateInput });
}

export async function updateOrg(id: number, i: OrgInput) {
  if (!(await prisma.crmOrganization.findUnique({ where: { id }, select: { id: true } }))) throw new NotFoundError('Organization not found');
  return prisma.crmOrganization.update({ where: { id }, data: orgData(i) });
}

export async function getOrg(id: number) {
  const o = await prisma.crmOrganization.findUnique({
    where: { id },
    include: { contacts: { orderBy: { name: 'asc' } }, deals: { include: DEAL_LIST_INCLUDE, orderBy: { updatedAt: 'desc' } } },
  });
  if (!o) throw new NotFoundError('Organization not found');
  return { ...o, deals: o.deals.map((d) => dealOut(d)) };
}

export async function deleteOrg(id: number) {
  const r = await prisma.crmOrganization.deleteMany({ where: { id } });
  if (!r.count) throw new NotFoundError('Organization not found');
}

// ─── Người liên hệ + quyền của chủ thể dữ liệu ──────────────────

export interface ContactInput {
  orgId?: number | null; name?: string; title?: string | null; email?: string | null; phone?: string | null;
  preferredChannel?: string | null; consent?: boolean; consentSource?: string | null; note?: string | null;
}

async function contactData(i: ContactInput, cur?: { consent: boolean } | null) {
  if (i.orgId) {
    if (!(await prisma.crmOrganization.findUnique({ where: { id: i.orgId }, select: { id: true } }))) throw new BadRequestError('Organization not found', 'CRM_BAD_ORG');
  }
  const data: Prisma.CrmContactUncheckedUpdateInput = {};
  if (i.orgId !== undefined) data.orgId = i.orgId;
  if (i.name !== undefined) data.name = i.name.trim().slice(0, 120);
  if (i.title !== undefined) data.title = clean(i.title, 120);
  if (i.email !== undefined) data.email = clean(i.email, 254)?.toLowerCase() ?? null;
  if (i.phone !== undefined) data.phone = clean(i.phone, 30);
  if (i.preferredChannel !== undefined) data.preferredChannel = i.preferredChannel;
  if (i.note !== undefined) data.note = clean(i.note, 20_000);
  if (i.consent !== undefined && i.consent !== cur?.consent) {
    // Thời điểm đồng ý / rút đồng ý do HỆ THỐNG ghi, không nhận từ client.
    data.consent = i.consent;
    data.consentAt = new Date();
    data.consentSource = clean(i.consentSource, 120) ?? (i.consent ? 'admin: ghi nhận đồng ý' : 'admin: khách rút đồng ý');
  }
  return data;
}

export async function listContacts(q?: string, orgId?: number, page = 1, limit = 50, includeAnonymized = false) {
  const where: Prisma.CrmContactWhereInput = {
    ...(includeAnonymized ? {} : { anonymizedAt: null }),
    ...(orgId ? { orgId } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }, { org: { name: { contains: q, mode: 'insensitive' } } }] } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.crmContact.findMany({ where, orderBy: { updatedAt: 'desc' }, skip: (page - 1) * limit, take: limit, include: { org: { select: { id: true, name: true } }, _count: { select: { deals: true } } } }),
    prisma.crmContact.count({ where }),
  ]);
  return { items, total, page, limit };
}

export async function createContact(i: ContactInput & { name: string }) {
  const data = await contactData(i, null);
  return prisma.crmContact.create({ data: data as Prisma.CrmContactUncheckedCreateInput });
}

export async function updateContact(id: number, i: ContactInput) {
  const cur = await prisma.crmContact.findUnique({ where: { id }, select: { consent: true, anonymizedAt: true } });
  if (!cur) throw new NotFoundError('Contact not found');
  if (cur.anonymizedAt) throw new BadRequestError('This contact was anonymized', 'CRM_CONTACT_ANONYMIZED');
  return prisma.crmContact.update({ where: { id }, data: await contactData(i, cur) });
}

export async function getContact(id: number) {
  const c = await prisma.crmContact.findUnique({
    where: { id },
    include: {
      org: { select: { id: true, name: true } },
      deals: { include: DEAL_LIST_INCLUDE, orderBy: { updatedAt: 'desc' } },
      activities: { orderBy: { createdAt: 'desc' }, take: 200 },
    },
  });
  if (!c) throw new NotFoundError('Contact not found');
  return { ...c, deals: c.deals.map((d) => dealOut(d)) };
}

/** Phiếu yêu cầu thuộc về người này: phiếu gắn với deal của họ + phiếu cùng email. */
async function requestsOfContact(c: { id: number; email: string | null }) {
  const viaDeals = await prisma.crmDeal.findMany({ where: { contactId: c.id, projectRequestId: { not: null } }, select: { projectRequestId: true } });
  const ids = viaDeals.map((d) => d.projectRequestId!).filter(Boolean);
  return prisma.projectRequest.findMany({
    where: { OR: [{ id: { in: ids } }, ...(c.email ? [{ email: { equals: c.email, mode: 'insensitive' as const } }] : [])] },
    orderBy: { id: 'asc' },
  });
}

/**
 * Quyền truy cập dữ liệu (Luật BVDLCN 91/2025): MỌI thứ hệ thống lưu về người này — hồ sơ,
 * tổ chức, deal, hoạt động, đề xuất của các deal đó, phiếu yêu cầu (cùng email).
 */
export async function exportContact(id: number) {
  const c = await prisma.crmContact.findUnique({ where: { id }, include: { org: true, activities: { orderBy: { createdAt: 'asc' } } } });
  if (!c) throw new NotFoundError('Contact not found');
  const deals = await prisma.crmDeal.findMany({
    where: { contactId: id },
    include: { proposals: { orderBy: { version: 'asc' } }, stageChanges: { orderBy: { at: 'asc' } }, activities: { orderBy: { createdAt: 'asc' } } },
  });
  const requests = await requestsOfContact(c);
  return {
    exportedAt: new Date().toISOString(),
    legalBasis: 'Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15; Nghị định 356/2025/NĐ-CP — quyền được truy cập/nhận bản sao dữ liệu',
    controller: 'cuongthai.com studio',
    contact: { ...c, activities: undefined },
    contactActivities: c.activities,
    deals: deals.map((d) => ({ ...d, valueAmount: num(d.valueAmount) })),
    projectRequests: requests,
  };
}

/**
 * Xoá / ẩn danh hoá theo yêu cầu chủ thể dữ liệu. GIỮ số liệu deal (giá trị, giai đoạn, ngày) cho báo cáo.
 *   · Hồ sơ: xoá tên/email/SĐT/chức vụ/ghi chú, đồng ý = false, đặt anonymizedAt (`delete` ⇒ xoá hẳn dòng).
 *   · Hoạt động gắn người này: xoá nội dung (giữ loại + ngày) — chúng thường chứa lời người đó nói.
 *   · Deal của người này: tiêu đề còn mang tên người ⇒ đổi thành "Deal #id" khi deal KHÔNG có tổ chức.
 *   · Đề xuất chưa được chấp thuận: xoá IP/user-agent/tên người phản hồi. Đề xuất ĐÃ chấp thuận giữ
 *     làm bằng chứng giao kết (nghĩa vụ hợp đồng) — báo lại cho admin.
 *   · Phiếu yêu cầu (cùng email / gắn deal): chưa thành dự án ⇒ XOÁ CỨNG (như purge 12 tháng);
 *     đã thành dự án ⇒ GIỮ (hồ sơ hợp đồng) và báo lại.
 */
export async function eraseContact(actorId: number, id: number, mode: 'anonymize' | 'delete') {
  const c = await prisma.crmContact.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
  if (!c) throw new NotFoundError('Contact not found');
  const requests = await requestsOfContact(c);
  const keptRequests = requests.filter((r) => r.status === 'PROJECT_CREATED' || r.workProjectId).map((r) => r.code);
  const deletableReq = requests.filter((r) => r.status !== 'PROJECT_CREATED' && !r.workProjectId).map((r) => r.id);
  const deals = await prisma.crmDeal.findMany({ where: { contactId: id }, select: { id: true, orgId: true } });
  const dealIds = deals.map((d) => d.id);
  const keptProposals = await prisma.crmProposal.count({ where: { dealId: { in: dealIds }, status: 'ACCEPTED' } });

  await prisma.$transaction(async (tx) => {
    await tx.crmActivity.updateMany({ where: { contactId: id }, data: { subject: '[Đã ẩn danh]', body: null } });
    for (const d of deals) if (!d.orgId) await tx.crmDeal.update({ where: { id: d.id }, data: { title: `Deal #${d.id} (ẩn danh)` } });
    await tx.crmProposal.updateMany({
      where: { dealId: { in: dealIds }, status: { not: 'ACCEPTED' } },
      data: { responseIp: null, responseUserAgent: null, responseName: null, responseNote: null },
    });
    if (deletableReq.length) await tx.projectRequest.deleteMany({ where: { id: { in: deletableReq } } });
    if (mode === 'delete') {
      await tx.crmContact.delete({ where: { id } });
    } else {
      await tx.crmContact.update({
        where: { id },
        data: { name: R.ANONYMIZED_NAME, title: null, email: null, phone: null, note: null, preferredChannel: null, consent: false, consentSource: 'đã ẩn danh theo yêu cầu', anonymizedAt: new Date() },
      });
    }
  });
  logger.info('[crm] xoá/ẩn danh người liên hệ', { contactId: id, mode, actorId, deletedRequests: deletableReq.length, keptRequests: keptRequests.length });
  return { mode, deals: dealIds.length, deletedRequests: deletableReq.length, keptRequests, keptAcceptedProposals: keptProposals };
}

// ─── Báo cáo ────────────────────────────────────────────────────

export async function report(opts: { from?: Date; to?: Date; includeRoleplay?: boolean }) {
  const where: Prisma.CrmDealWhereInput = {
    ...(opts.includeRoleplay ? {} : { isRoleplay: false }),
    ...(opts.from || opts.to ? { createdAt: { ...(opts.from ? { gte: opts.from } : {}), ...(opts.to ? { lt: opts.to } : {}) } } : {}),
  };
  const rows = await prisma.crmDeal.findMany({
    where,
    select: {
      id: true, stage: true, valueAmount: true, currency: true, probability: true, source: true, packageId: true,
      createdAt: true, wonAt: true, lostAt: true, expectedCloseAt: true, stageChanges: { select: { toStage: true } },
    },
  });
  return R.buildReport(rows.map((d) => ({
    id: d.id, stage: d.stage, value: num(d.valueAmount), currency: d.currency, probability: d.probability,
    source: d.source, packageId: d.packageId, createdAt: d.createdAt, wonAt: d.wonAt, lostAt: d.lostAt,
    expectedCloseAt: d.expectedCloseAt, stagesVisited: d.stageChanges.map((s) => s.toStage),
  })));
}

export async function owners() {
  const users = await prisma.user.findMany({
    where: { roles: { some: { role: { name: { in: ['ROLE_ADMIN', 'ADMIN', 'admin'] } } } } },
    select: { id: true, username: true, fullName: true },
    orderBy: { id: 'asc' },
    take: 50,
  });
  return users.map((u) => ({ id: u.id, name: u.fullName || u.username }));
}

// ─── Cron (không LLM) ───────────────────────────────────────────

/**
 * TASK tới hạn ⇒ báo admin (hộp thư + Telegram) ĐÚNG MỘT LẦN mỗi hạn: "giành" dòng bằng
 * updateMany có điều kiện `notifiedAt = null` trước khi báo, nên hai tiến trình không báo trùng.
 */
export async function notifyDueTasks(now = new Date()): Promise<number> {
  const due = await prisma.crmActivity.findMany({
    where: { type: 'TASK', done: false, notifiedAt: null, dueAt: { lte: now } },
    orderBy: { dueAt: 'asc' },
    take: 50,
    include: { deal: { select: { id: true, title: true } } },
  });
  let n = 0;
  for (const a of due) {
    const claim = await prisma.crmActivity.updateMany({ where: { id: a.id, notifiedAt: null }, data: { notifiedAt: now } });
    if (!claim.count) continue;
    n++;
    await baoAdmin({
      loai: 'KHAC',
      tieuDe: `Việc CRM tới hạn: ${a.subject}`.slice(0, 200),
      noiDung: a.deal ? `Deal: ${a.deal.title}` : null,
      duongDan: a.dealId ? `/admin/crm?deal=${a.dealId}` : '/admin/crm?tab=tasks',
      mucDo: 'can_xu_ly',
      entityId: a.id,
      khoaChongTrung: `CRM_TASK:${a.id}:${a.dueAt?.toISOString() ?? ''}`,
    });
  }
  return n;
}

/** Tóm tắt deal "stale" (mở, > 14 ngày không hoạt động) — tối đa một tin mỗi ngày. */
export async function notifyStaleDeals(now = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - R.STALE_DAYS * 86_400_000);
  const stale = await prisma.crmDeal.findMany({
    where: { stage: { in: R.OPEN_STAGES }, lastActivityAt: { lt: cutoff }, isRoleplay: false },
    select: { title: true },
    take: 20,
  });
  if (!stale.length) return 0;
  await baoAdmin({
    loai: 'KHAC',
    tieuDe: `${stale.length} deal CRM không có hoạt động quá ${R.STALE_DAYS} ngày`,
    noiDung: stale.slice(0, 8).map((d) => `• ${d.title}`).join('\n'),
    duongDan: '/admin/crm?tab=deals&stale=1',
    mucDo: 'thuong',
    khoaChongTrung: `CRM_STALE:${now.toISOString().slice(0, 10)}`,
  });
  return stale.length;
}
