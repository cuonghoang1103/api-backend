/**
 * CT Work — CTW đợt 7b (C8): BIỂU MẪU → THẺ. Luật thuần ở formRules.ts.
 *
 *   F-n  Người soạn (ADMIN/MEMBER, không phải agent khi mở link CÔNG KHAI) dựng form: 8 kiểu trường, ẩn/hiện theo câu trả
 *        trước, ánh xạ sang thẻ (loại, nhãn, người làm, ưu tiên, trường tuỳ chỉnh, mẫu tiêu đề).
 *   Truy cập: PUBLIC — ai có link /work/form/<token> (không tài khoản); INTERNAL — cùng link nhưng phải đăng nhập và là
 *        thành viên dự án (khách cổng bị cách ly KHÔNG gửi được). Trường "user" (chọn người) CHỈ ở form nội bộ — form công
 *        khai không được lộ danh sách thành viên.
 *   Mỗi lần gửi ⇒ một thẻ (createIssue — cửa ghi chung, có số, sự kiện, tự động hoá) + một dòng work_form_responses.
 *   Chống spam (form công khai): trần IP ở route (express-rate-limit) + trần IP TRONG DB cho từng form (5 lượt/10 phút,
 *        sống qua khởi động lại) + honeypot `website` + gửi quá nhanh (< 2 s) ⇒ trả "đã nhận" nhưng KHÔNG tạo gì.
 *   Tổng hợp: đếm lựa chọn, trung bình số, mẫu chữ; xuất .xlsx.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { putObject } from '../../config/r2.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { emitWorkEvent, type WorkActor } from './events.js';
import { xlsxTable } from './exchange.service.js';
import { createIssue } from './issueChange.js';
import { can, isClientScoped, loadProjectAccess, requireProject, type ProjectAccess } from './permissions.js';
import { projectMembers } from './projects.service.js';
import {
  describeAnswers, FORM_ACCESS, FORM_IP_MAX, FORM_IP_WINDOW_MS, formClosedReason, looksLikeBot, normalizeFields, normalizeMapping, parseFields,
  renderTitle, summarize, validateAnswers, type AnswerValue, type FileAnswer, type FormField, type FormMapping,
} from './formRules.js';

type Tx = Prisma.TransactionClient;
const fKey = (n: number) => `F-${n}`;
const newToken = () => crypto.randomBytes(18).toString('base64url');

// ─── Kho tệp thay được trong test ────────────────────────────────

type FileStore = (key: string, body: Buffer, contentType: string) => Promise<void>;
let fileStore: FileStore = async (key, body, ct) => { await putObject(key, body, ct, 'private, max-age=0, no-store'); };
export function _setFormFileStoreForTests(s: FileStore | null) {
  fileStore = s ?? (async (key, body, ct) => { await putObject(key, body, ct, 'private, max-age=0, no-store'); });
}

// ─── Quyền ───────────────────────────────────────────────────────

async function teamCtx(userId: number, projectId: number, mode: 'view' | 'edit'): Promise<ProjectAccess> {
  const access = await requireProject(userId, projectId, mode === 'edit' ? 'issue.edit' : 'project.view');
  if (isClientScoped(access) || access.role === 'CLIENT') throw new ForbiddenError('Only the project team can manage forms');
  return access;
}

// ─── Đầu vào ─────────────────────────────────────────────────────

export const formInput = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(4000).nullable().optional(),
  fields: z.array(z.record(z.unknown())).max(30).optional(),
  mapping: z.record(z.unknown()).optional(),
  access: z.enum(FORM_ACCESS).optional(),
  confirmMessage: z.string().max(500).nullable().optional(),
  collectEmail: z.boolean().optional(),
  maxResponses: z.number().int().min(1).max(100_000).nullable().optional(),
  closesAt: z.string().datetime().nullable().optional(),
});
export type FormInput = z.infer<typeof formInput>;

function fieldsOrThrow(raw: unknown): FormField[] {
  try { return normalizeFields(raw); } catch (e) { throw new BadRequestError((e as Error).message, 'WORK_FORM_BAD_FIELDS'); }
}

/** Ánh xạ phải trỏ vào dữ liệu CỦA dự án (loại, nhãn, người, trường tuỳ chỉnh). */
async function checkMapping(projectId: number, m: FormMapping, fields: FormField[]): Promise<FormMapping> {
  if (m.typeKey) {
    const t = await prisma.workIssueType.findFirst({ where: { projectId, key: m.typeKey, archived: false }, select: { level: true } });
    if (!t) throw new BadRequestError(`Issue type ${m.typeKey} does not exist in this project`, 'WORK_FORM_BAD_MAPPING');
    if (t.level !== 0) throw new BadRequestError('A form can only create standard issues (not epics or sub-tasks)', 'WORK_FORM_BAD_MAPPING');
  }
  if (m.labelIds.length) {
    const n = await prisma.workLabel.count({ where: { projectId, id: { in: m.labelIds } } });
    if (n !== m.labelIds.length) throw new BadRequestError('Some labels are not in this project', 'WORK_FORM_BAD_MAPPING');
  }
  if (m.assigneeId && !(await loadProjectAccess(m.assigneeId, projectId))) throw new BadRequestError('The assignee must be a project member', 'WORK_FORM_BAD_MAPPING');
  const cfIds = Object.keys(m.customFields).map(Number);
  if (cfIds.length) {
    const cfs = await prisma.workCustomField.findMany({ where: { projectId, id: { in: cfIds } }, select: { id: true } });
    if (cfs.length !== cfIds.length) throw new BadRequestError('Some custom fields are not in this project', 'WORK_FORM_BAD_MAPPING');
    for (const fid of Object.values(m.customFields)) if (!fields.some((f) => f.id === fid)) throw new BadRequestError(`Form field "${fid}" does not exist`, 'WORK_FORM_BAD_MAPPING');
  }
  return m;
}

function assertAccessFits(access: string, fields: FormField[]) {
  if (access === 'PUBLIC' && fields.some((f) => f.kind === 'user')) {
    throw new BadRequestError('A public form cannot have a "person" field (it would expose your member list) — make it internal or remove the field', 'WORK_FORM_PUBLIC_USER');
  }
}

// ─── Hiển thị ────────────────────────────────────────────────────

type FormRow = Prisma.WorkFormGetPayload<object>;
const publicPath = (t: string | null) => (t ? `/work/form/${t}` : null);

function formView(f: FormRow, responses: number, canEdit: boolean) {
  return {
    id: f.id, number: f.number, key: fKey(f.number), title: f.title, description: f.description, fields: parseFields(f.fields), mapping: normalizeMapping(f.mapping),
    access: f.access, status: f.status, confirmMessage: f.confirmMessage, collectEmail: f.collectEmail, maxResponses: f.maxResponses, closesAt: f.closesAt,
    // Link chỉ hiện cho người sửa được (form công khai mở ⇒ bất kỳ ai có link gửi được).
    link: canEdit ? publicPath(f.token) : null, closed: formClosedReason(f, responses), responses, rev: f.rev, createdAt: f.createdAt, updatedAt: f.updatedAt,
  };
}

async function formByRef(projectId: number, ref: number | string): Promise<FormRow> {
  const m = /^(?:F-?)?(\d{1,6})$/i.exec(String(ref));
  const f = m ? await prisma.workForm.findFirst({ where: { projectId, number: Number(m[1]), deletedAt: null } }) : null;
  if (!f) throw new NotFoundError(`Form ${String(ref)} not found`);
  return f;
}

// ─── CRUD ────────────────────────────────────────────────────────

export async function listForms(userId: number, projectId: number) {
  const access = await teamCtx(userId, projectId, 'view');
  const rows = await prisma.workForm.findMany({ where: { projectId, deletedAt: null }, orderBy: { number: 'desc' }, include: { _count: { select: { responses: true } } } });
  const canEdit = can(access.role, 'issue.edit', access.options, access.principal);
  return { forms: rows.map((f) => formView(f, f._count.responses, canEdit)), canEdit, canPublish: can(access.role, 'project.settings') && access.principal !== 'AGENT' };
}

export async function getForm(userId: number, projectId: number, ref: number | string) {
  const access = await teamCtx(userId, projectId, 'view');
  const f = await formByRef(projectId, ref);
  const n = await prisma.workFormResponse.count({ where: { formId: f.id } });
  return formView(f, n, can(access.role, 'issue.edit', access.options, access.principal));
}

export async function createForm(userId: number, projectId: number, input: FormInput) {
  const access = await teamCtx(userId, projectId, 'edit');
  const fields = fieldsOrThrow(input.fields ?? [{ id: 'title', kind: 'text', label: 'Summary', required: true }, { id: 'details', kind: 'longtext', label: 'Details', required: false }]);
  const acc = input.access ?? 'PUBLIC';
  assertAccessFits(acc, fields);
  const mapping = await checkMapping(projectId, normalizeMapping(input.mapping ?? {}), fields);
  const f = await prisma.$transaction(async (tx: Tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31701::int, ${projectId}::int)`;
    const agg = await tx.workForm.aggregate({ where: { projectId }, _max: { number: true } });
    return tx.workForm.create({
      data: {
        projectId, number: (agg._max.number ?? 0) + 1, title: input.title, description: input.description ?? null, fields: fields as unknown as Prisma.InputJsonValue,
        mapping: mapping as unknown as Prisma.InputJsonValue, access: acc, confirmMessage: input.confirmMessage ?? null, collectEmail: input.collectEmail ?? false,
        maxResponses: input.maxResponses ?? null, closesAt: input.closesAt ? new Date(input.closesAt) : null, createdById: userId,
      },
    });
  });
  await auditProject(projectId, { actorId: userId, action: 'form.create', targetType: 'project', targetId: projectId, summary: `Created form ${fKey(f.number)} "${f.title}"` });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { ...formView(f, 0, true), projectKey: access.key };
}

export async function updateForm(userId: number, projectId: number, ref: number | string, input: Partial<FormInput> & { rev?: number }) {
  await teamCtx(userId, projectId, 'edit');
  const cur = await formByRef(projectId, ref);
  const fields = input.fields !== undefined ? fieldsOrThrow(input.fields) : parseFields(cur.fields);
  const responses = await prisma.workFormResponse.count({ where: { formId: cur.id } });
  if (input.fields !== undefined && responses) {
    // Đã có câu trả lời ⇒ không xoá trường / đổi kiểu (tổng hợp cũ sẽ vỡ) — được đổi nhãn, thêm trường.
    for (const o of parseFields(cur.fields)) {
      const n = fields.find((x) => x.id === o.id);
      if (!n || n.kind !== o.kind) throw new AppError('This form already has responses — you can reword or add fields, but not remove them or change their type', 409, 'WORK_FORM_LOCKED');
    }
  }
  const acc = input.access ?? cur.access;
  assertAccessFits(acc, fields);
  if (input.access && input.access !== cur.access && cur.status === 'OPEN' && input.access === 'PUBLIC') {
    const access = await requireProject(userId, projectId, 'project.settings');
    if (access.principal === 'AGENT') throw new ForbiddenError('Only a person can open a form to the public');
  }
  const mapping = await checkMapping(projectId, input.mapping !== undefined ? normalizeMapping(input.mapping) : normalizeMapping(cur.mapping), fields);
  const r = await prisma.workForm.updateMany({
    where: { id: cur.id, ...(input.rev !== undefined ? { rev: input.rev } : {}) },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.fields !== undefined ? { fields: fields as unknown as Prisma.InputJsonValue } : {}),
      mapping: mapping as unknown as Prisma.InputJsonValue, access: acc,
      ...(input.confirmMessage !== undefined ? { confirmMessage: input.confirmMessage } : {}),
      ...(input.collectEmail !== undefined ? { collectEmail: input.collectEmail } : {}),
      ...(input.maxResponses !== undefined ? { maxResponses: input.maxResponses } : {}),
      ...(input.closesAt !== undefined ? { closesAt: input.closesAt ? new Date(input.closesAt) : null } : {}),
      rev: { increment: 1 },
    },
  });
  if (!r.count) throw new ConflictError('Someone else changed this form — reload to see their version');
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return getForm(userId, projectId, cur.number);
}

/** Mở / đóng / về nháp. Mở form CÔNG KHAI = đối ngoại ⇒ ADMIN dự án, là người (không phải agent). */
export async function setFormStatus(userId: number, projectId: number, ref: number | string, status: 'OPEN' | 'CLOSED' | 'DRAFT') {
  await teamCtx(userId, projectId, 'edit');
  const cur = await formByRef(projectId, ref);
  if (status === 'OPEN' && cur.access === 'PUBLIC') {
    const access = await requireProject(userId, projectId, 'project.settings');
    if (access.principal === 'AGENT') throw new ForbiddenError('Only a person can open a form to the public');
  }
  if (status === 'OPEN' && !parseFields(cur.fields).length) throw new BadRequestError('Add at least one field first', 'WORK_FORM_EMPTY');
  await prisma.workForm.update({ where: { id: cur.id }, data: { status, ...(status === 'OPEN' && !cur.token ? { token: newToken() } : {}), rev: { increment: 1 } } });
  await auditProject(projectId, { actorId: userId, action: `form.${status.toLowerCase()}`, targetType: 'project', targetId: projectId, summary: `Form ${fKey(cur.number)} is now ${status.toLowerCase()}` });
  return getForm(userId, projectId, cur.number);
}

/** Đổi link (link cũ chết ngay). */
export async function rotateFormLink(userId: number, projectId: number, ref: number | string) {
  await requireProject(userId, projectId, 'project.settings');
  const cur = await formByRef(projectId, ref);
  await prisma.workForm.update({ where: { id: cur.id }, data: { token: newToken(), rev: { increment: 1 } } });
  await auditProject(projectId, { actorId: userId, action: 'form.rotate', targetType: 'project', targetId: projectId, summary: `New link for form ${fKey(cur.number)}` });
  return getForm(userId, projectId, cur.number);
}

export async function deleteForm(userId: number, projectId: number, ref: number | string) {
  const access = await requireProject(userId, projectId, 'project.settings');
  if (access.principal === 'AGENT') throw new ForbiddenError('Agents cannot delete forms');
  const cur = await formByRef(projectId, ref);
  await prisma.workForm.update({ where: { id: cur.id }, data: { deletedAt: new Date(), token: null, status: 'CLOSED' } });
  await auditProject(projectId, { actorId: userId, action: 'form.delete', targetType: 'project', targetId: projectId, summary: `Deleted form ${fKey(cur.number)}` });
  return { ok: true };
}

// ─── Câu trả lời + tổng hợp ──────────────────────────────────────

async function peopleOf(projectId: number): Promise<Map<number, string>> {
  return new Map((await projectMembers(projectId)).map((m) => [m.id, displayName(m)]));
}

export async function formResponses(userId: number, projectId: number, ref: number | string, q: { limit?: number } = {}) {
  await teamCtx(userId, projectId, 'view');
  const f = await formByRef(projectId, ref);
  const [rows, total, people, project] = await Promise.all([
    prisma.workFormResponse.findMany({ where: { formId: f.id }, orderBy: { id: 'desc' }, take: Math.min(q.limit ?? 200, 1000) }),
    prisma.workFormResponse.count({ where: { formId: f.id } }),
    peopleOf(projectId),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } }),
  ]);
  const fields = parseFields(f.fields);
  const all = await prisma.workFormResponse.findMany({ where: { formId: f.id }, orderBy: { id: 'desc' }, take: 5000, select: { answers: true } });
  return {
    form: { key: fKey(f.number), title: f.title, fields },
    total,
    summary: summarize(fields, all, people),
    responses: rows.map((r) => ({
      id: r.id, createdAt: r.createdAt, issue: r.issueNumber ? { number: r.issueNumber, key: `${project.key}-${r.issueNumber}` } : null,
      respondent: r.userId ? people.get(r.userId) ?? `#${r.userId}` : r.respondentName ?? null, email: r.respondentEmail, answers: r.answers,
    })),
  };
}

export async function exportResponses(userId: number, projectId: number, ref: number | string): Promise<{ buffer: Buffer; file: string }> {
  await teamCtx(userId, projectId, 'view');
  const f = await formByRef(projectId, ref);
  const fields = parseFields(f.fields);
  const people = await peopleOf(projectId);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } });
  const rows = await prisma.workFormResponse.findMany({ where: { formId: f.id }, orderBy: { id: 'asc' }, take: 20_000 });
  const cell = (fd: FormField, v: AnswerValue | undefined) => (v === undefined ? '' : fd.kind === 'user' ? people.get(v as number) ?? `#${v}` : Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x : x.name)).join(', ') : v);
  const headers = ['Submitted', 'Issue', 'Respondent', 'Email', ...fields.map((x) => x.label)];
  const data = rows.map((r) => {
    const a = (r.answers ?? {}) as Record<string, AnswerValue>;
    return [r.createdAt.toISOString().replace('T', ' ').slice(0, 16), r.issueNumber ? `${project.key}-${r.issueNumber}` : '', r.userId ? people.get(r.userId) ?? '' : r.respondentName ?? '', r.respondentEmail ?? '', ...fields.map((fd) => cell(fd, a[fd.id]))];
  });
  return { buffer: xlsxTable(headers, data, 'Responses'), file: `${project.key}-${fKey(f.number)}-responses.xlsx` };
}

// ─── Điền form (công khai + nội bộ) ──────────────────────────────

type PublicFormRow = FormRow & { project: { name: string; key: string; deletedAt: Date | null } };

async function formByToken(token: string): Promise<PublicFormRow> {
  const f = await prisma.workForm.findFirst({ where: { token, deletedAt: null }, include: { project: { select: { name: true, key: true, deletedAt: true } } } });
  if (!f || f.project.deletedAt || f.status === 'DRAFT') throw new NotFoundError('Form not found');
  return f;
}

function fillView(f: PublicFormRow, closed: string | null, members: Array<{ id: number; name: string }> | null) {
  return {
    title: f.title, description: f.description, project: f.project.name, access: f.access, collectEmail: f.collectEmail,
    fields: closed ? [] : parseFields(f.fields), closed, members: closed ? null : members,
  };
}

/** Form công khai (không đăng nhập). Form nội bộ ⇒ 403 WORK_FORM_LOGIN (không 401: axios của web tự refresh/đẩy về trang đăng nhập khi gặp 401) để trang gọi lại đường có đăng nhập. */
export async function publicForm(token: string) {
  const f = await formByToken(token);
  if (f.access !== 'PUBLIC') throw new AppError('Sign in to fill in this form', 403, 'WORK_FORM_LOGIN');
  const n = await prisma.workFormResponse.count({ where: { formId: f.id } });
  return fillView(f, formClosedReason(f, n), null);
}

async function internalAccess(userId: number, f: PublicFormRow): Promise<ProjectAccess> {
  const access = await loadProjectAccess(userId, f.projectId);
  // Không phải thành viên ⇒ 404 như link không tồn tại (không lộ dự án).
  if (!access || isClientScoped(access) || access.role === 'CLIENT' || !can(access.role, 'issue.create', access.options, access.principal)) throw new NotFoundError('Form not found');
  return access;
}

export async function internalForm(userId: number, token: string) {
  const f = await formByToken(token);
  if (f.access === 'INTERNAL') await internalAccess(userId, f);
  const n = await prisma.workFormResponse.count({ where: { formId: f.id } });
  const fields = parseFields(f.fields);
  const members = fields.some((x) => x.kind === 'user') ? (await projectMembers(f.projectId)).map((m) => ({ id: m.id, name: displayName(m) })) : null;
  return fillView(f, formClosedReason(f, n), members);
}

export interface SubmitBody {
  answers?: unknown;
  name?: unknown;
  email?: unknown;
  /** fieldId ⇒ [{ name, type, data (base64) }] */
  files?: unknown;
  website?: unknown;
  elapsedMs?: unknown;
}

interface DecodedFile { field: string; name: string; type: string; data: Buffer }

function decodeFiles(fields: FormField[], raw: unknown): { descriptors: Record<string, FileAnswer[]>; files: DecodedFile[] } {
  const descriptors: Record<string, FileAnswer[]> = {};
  const files: DecodedFile[] = [];
  if (!raw || typeof raw !== 'object') return { descriptors, files };
  for (const f of fields.filter((x) => x.kind === 'file')) {
    const list = (raw as Record<string, unknown>)[f.id];
    if (!Array.isArray(list)) continue;
    descriptors[f.id] = [];
    for (const x of list.slice(0, 10) as Array<Record<string, unknown>>) {
      const data = typeof x?.data === 'string' ? Buffer.from(x.data.replace(/^data:[^,]*,/, ''), 'base64') : Buffer.alloc(0);
      const name = typeof x?.name === 'string' ? x.name : '';
      const type = typeof x?.type === 'string' ? x.type.toLowerCase() : '';
      descriptors[f.id].push({ name, type, size: data.length });
      files.push({ field: f.id, name, type, data });
    }
  }
  return { descriptors, files };
}

/** Nội dung tệp phải khớp kiểu khai (chữ ký đầu tệp) — không nhận .exe đổi tên thành .png. */
function sniffOk(type: string, b: Buffer): boolean {
  const head = b.subarray(0, 8).toString('hex');
  if (type === 'image/png') return head.startsWith('89504e47');
  if (type === 'image/jpeg') return head.startsWith('ffd8ff');
  if (type === 'image/gif') return head.startsWith('47494638');
  if (type === 'image/webp') return b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP';
  if (type === 'application/pdf') return b.subarray(0, 5).toString() === '%PDF-';
  if (type.includes('openxmlformats') || type === 'application/zip') return head.startsWith('504b0304');
  if (type === 'text/plain' || type === 'text/csv') return !b.includes(0);
  return false;
}

const textDoc = (lines: string[]) => ({
  type: 'doc',
  content: lines.flatMap((l) => l.split(/\n{2,}/)).filter((p) => p.trim()).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p.slice(0, 20_000) }] })),
});

async function submitCore(f: PublicFormRow, body: SubmitBody, who: { userId: number | null; ip: string; members: Set<number> }) {
  const n = await prisma.workFormResponse.count({ where: { formId: f.id } });
  const closed = formClosedReason(f, n);
  if (closed) throw new AppError('This form is no longer accepting responses', 410, 'WORK_FORM_CLOSED', { reason: closed });
  const ipHash = crypto.createHash('sha256').update(`${who.ip}|${config.jwtSecret}|ctw-form`).digest('hex');
  // Honeypot / quá nhanh ⇒ giả vờ nhận (bot không biết bị chặn để thử cách khác) — KHÔNG tạo thẻ, KHÔNG ghi dòng.
  if (!who.userId && looksLikeBot(body)) {
    logger.info('[work] form: chặn bot (honeypot/quá nhanh)', { formId: f.id });
    return { ok: true as const, issue: null, message: f.confirmMessage, dropped: true };
  }
  if (!who.userId) {
    const recent = await prisma.workFormResponse.count({ where: { formId: f.id, ipHash, createdAt: { gte: new Date(Date.now() - FORM_IP_WINDOW_MS) } } });
    if (recent >= FORM_IP_MAX) throw new AppError('Too many responses from your network. Please try again later.', 429, 'WORK_FORM_RATE_LIMIT');
  }
  const fields = parseFields(f.fields);
  const { descriptors, files } = decodeFiles(fields, body.files);
  const rawAnswers = { ...((body.answers && typeof body.answers === 'object' ? body.answers : {}) as Record<string, unknown>), ...descriptors };
  const v = validateAnswers(fields, rawAnswers, who.members);
  for (const file of files) {
    const fd = v.values[file.field];
    if (Array.isArray(fd) && !sniffOk(file.type, file.data)) v.errors.push({ id: file.field, code: 'FILE_TYPE' });
  }
  if (v.errors.length) throw new AppError('Some answers are missing or invalid', 400, 'WORK_FORM_INVALID', { errors: v.errors });
  if (!Object.keys(v.values).length) throw new AppError('Answer at least one question', 400, 'WORK_FORM_INVALID', { errors: [] });
  const email = f.collectEmail && typeof body.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ? body.email.trim().toLowerCase().slice(0, 200) : null;
  if (f.collectEmail && !who.userId && !email) throw new AppError('Please enter a valid email', 400, 'WORK_FORM_INVALID', { errors: [{ id: '__email', code: 'REQUIRED' }] });
  const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 120) : null;

  // ── tạo thẻ theo ánh xạ ──
  const mapping = normalizeMapping(f.mapping);
  const types = await prisma.workIssueType.findMany({ where: { projectId: f.projectId, archived: false, level: 0 }, select: { id: true, key: true } });
  const type = (mapping.typeKey && types.find((t) => t.key === mapping.typeKey)) || types.find((t) => t.key === 'TASK') || types[0];
  if (!type) throw new AppError('This project cannot receive requests right now', 409, 'WORK_FORM_NO_TYPE');
  const people = await peopleOf(f.projectId);
  const by = who.userId ? people.get(who.userId) ?? `#${who.userId}` : name ?? email ?? 'anonymous';
  const title = renderTitle(mapping.titleTemplate, fields, v.values, f.title, by, people);
  const lines = [
    ...describeAnswers(fields.filter((x) => x.kind !== 'file'), v.values, people),
    `Submitted via form ${fKey(f.number)} "${f.title}" by ${by}${email ? ` <${email}>` : ''}.`,
  ];
  const assignee = mapping.assigneeId && who.members.has(mapping.assigneeId) ? mapping.assigneeId : mapping.assigneeId && (await loadProjectAccess(mapping.assigneeId, f.projectId)) ? mapping.assigneeId : null;
  const actor: WorkActor = who.userId ? { kind: 'USER', userId: who.userId } : { kind: 'SYSTEM', userId: null };
  const issue = await createIssue({
    projectId: f.projectId, typeId: type.id, title, descriptionJson: textDoc(lines) as Prisma.InputJsonValue,
    priority: mapping.priority ?? undefined, assigneeId: assignee, reporterId: who.userId ?? null,
  }, actor);
  if (mapping.labelIds.length) {
    const ok = await prisma.workLabel.findMany({ where: { projectId: f.projectId, id: { in: mapping.labelIds } }, select: { id: true } });
    await prisma.workIssueLabel.createMany({ data: ok.map((l) => ({ issueId: issue.id, labelId: l.id })), skipDuplicates: true });
  }
  await applyCustomFields(f.projectId, issue.id, type.key, mapping, fields, v.values);
  // Tệp ⇒ đính kèm thẻ (khoá R2 work/<dự án>/<thẻ>/…). Lỗi kho ⇒ ghi chú, thẻ vẫn tạo.
  for (const file of files) {
    const safe = file.name.replace(/[^\w.\- ]+/g, '_').slice(-120) || 'file';
    const key = `work/${f.projectId}/${issue.id}/${crypto.randomUUID()}/${safe}`;
    try {
      await fileStore(key, file.data, file.type);
      await prisma.workAttachment.create({ data: { issueId: issue.id, uploaderId: who.userId, r2Key: key, fileName: safe, mime: file.type.slice(0, 100), size: file.data.length } });
    } catch (err) {
      logger.warn('[work] form: lưu tệp lỗi', { formId: f.id, err: (err as Error).message });
    }
  }
  const stored = { ...v.values };
  await prisma.workFormResponse.create({
    data: { formId: f.id, issueId: issue.id, issueNumber: issue.number, answers: stored as unknown as Prisma.InputJsonValue, userId: who.userId, respondentName: who.userId ? null : name, respondentEmail: email, ipHash: who.userId ? null : ipHash },
  });
  emitWorkEvent({ type: 'project.updated', projectId: f.projectId, actor });
  await auditProject(f.projectId, { actorId: who.userId, action: 'form.submit', targetType: 'issue', targetId: issue.id, summary: `${f.project.key}-${issue.number} from form ${fKey(f.number)}` });
  // Người gửi công khai không thấy số thẻ nội bộ; người trong dự án thấy để mở.
  return { ok: true as const, issue: who.userId ? { number: issue.number, key: `${f.project.key}-${issue.number}` } : null, message: f.confirmMessage, dropped: false };
}

async function applyCustomFields(projectId: number, issueId: number, typeKey: string, mapping: FormMapping, fields: FormField[], values: Record<string, AnswerValue>) {
  const ids = Object.keys(mapping.customFields).map(Number);
  if (!ids.length) return;
  const cfs = await prisma.workCustomField.findMany({ where: { projectId, id: { in: ids } } });
  for (const cf of cfs) {
    const fid = mapping.customFields[String(cf.id)];
    const fd = fields.find((x) => x.id === fid);
    const v = values[fid];
    if (!fd || v === undefined) continue;
    const keys = cf.typeKeys as string[] | null;
    if (keys?.length && !keys.includes(typeKey)) continue;
    const opts = (cf.options as Array<{ id: string; label?: string; name?: string }>) ?? [];
    const optId = (s: string) => opts.find((o) => o.id === s || (o.label ?? o.name ?? '').toLowerCase() === s.toLowerCase())?.id;
    let value: Prisma.InputJsonValue | null = null;
    switch (cf.kind) {
      case 'TEXT': value = (Array.isArray(v) ? v.map((x) => (typeof x === 'string' ? x : x.name)).join(', ') : String(v)).slice(0, 5000); break;
      case 'NUMBER': value = typeof v === 'number' ? v : Number.isFinite(Number(v)) ? Number(v) : null; break;
      case 'DATE': value = typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null; break;
      case 'USER': value = typeof v === 'number' ? v : null; break;
      case 'URL': value = typeof v === 'string' && /^https?:\/\/\S+$/i.test(v) ? v.slice(0, 1000) : null; break;
      case 'SELECT': value = typeof v === 'string' ? optId(v) ?? null : null; break;
      case 'MULTISELECT': { const a = (Array.isArray(v) ? v : [v]).map((x) => (typeof x === 'string' ? optId(x) : undefined)).filter((x): x is string => !!x); value = a.length ? a : null; break; }
      default: value = null;
    }
    if (value !== null) await prisma.workCustomValue.upsert({ where: { issueId_fieldId: { issueId, fieldId: cf.id } }, create: { issueId, fieldId: cf.id, value }, update: { value } });
  }
}

export async function submitPublicForm(token: string, body: SubmitBody, ip: string) {
  const f = await formByToken(token);
  if (f.access !== 'PUBLIC') throw new AppError('Sign in to fill in this form', 403, 'WORK_FORM_LOGIN');
  return submitCore(f, body, { userId: null, ip, members: new Set() });
}

export async function submitInternalForm(userId: number, token: string, body: SubmitBody, ip: string) {
  const f = await formByToken(token);
  if (f.access === 'INTERNAL') await internalAccess(userId, f);
  const members = new Set((await projectMembers(f.projectId)).map((m) => m.id));
  // Form công khai mà người gửi đã đăng nhập: ghi tên họ nếu là thành viên; người ngoài ⇒ như khách vô danh.
  const isMember = members.has(userId);
  return submitCore(f, body, { userId: isMember ? userId : null, ip, members: isMember ? members : new Set() });
}
