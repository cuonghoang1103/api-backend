/**
 * "Create with CuongMini" (20/10/2026) — bản nháp + các job nền.
 *
 *   DRAFT ──(Đọc & tóm tắt)──▶ READING ──▶ UNDERSTOOD ──(Chấp nhận)──▶ PLANNING ──▶ READY ──(Tạo)──▶ APPLYING ──▶ APPLIED
 *                                                                        └── reviewFirst = false (mặc định) ⇒ tạo luôn ─┘
 *   Lỗi ⇒ FAILED (+ failedPhase, "thử lại" chạy đúng pha). Huỷ ⇒ về trạng thái ổn định trước đó (READING→DRAFT…).
 *
 * Job chạy TRONG tiến trình (Map id ⇒ AbortController), tiến độ ghi CSDL từng bước ⇒ tải lại trang vẫn thấy; máy chủ
 * khởi động lại giữa chừng ⇒ lần đọc sau thấy job "mồ côi" (BUSY, không ai chạy, im > 3 phút) ⇒ FAILED để chạy lại.
 * Quyền: chỉ NGƯỜI TẠO bản nháp, và người đó phải tạo được dự án trong không gian (workspace.createProject — agent bị chặn).
 */

import crypto from 'node:crypto';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { logger } from '../../../utils/logger.js';
import { assertHumanActor, requireWorkspace } from '../permissions.js';
import { foldVi } from '../fold.js';
import {
  BUSY, CAP, PAGE_KINDS, setupInput, setupPlan, understanding as understandingSchema,
  type DraftStatus, type PlanItem, type PlanMember, type PlanPage, type PlanProject, type PlanWarning, type ProgressStep, type SetupInput, type SetupPlan,
  type SetupSource, type SourceCategory, type Understanding, type UsageCall,
} from './kieu.js';
import { goiModel, kiemModelTruoc, SETUP_MODELS, type SetupModelId } from './goiModel.js';
import {
  epicOut, epicPrompt, formText, outlineOut, outlinePrompt, PAGE_SETS, pagesOut, pagesPrompt, readJson, reviseOut, revisePrompt, sourcesText,
  testsOut, testsPrompt, TEN_THU, understandingOut, understandingText, understandPrompt, type EpicOut, type OutlineOut,
} from './nhacLenh.js';
import {
  agentsPage, buildMembers, capItems, finalizeProject, itemsFromModel, meetingsFor, memberBriefs, memberBriefsPage, memberLine, milestonesFor,
  onboardingItems, portfolioPage, raciPage, resolveProjects, resourcesPage, sprintPlanMarkdown, tr, type WsPerson,
} from './dungKeHoach.js';
import { buildSprints, HOURS_PER_POINT, iso, pointsPerSprint } from './lapLich.js';
import { extractUpload, readLink, readRepo, supportedFile } from './docNguon.js';
import { classifyLink, normalizeLink, parseRepoUrl } from './lienKet.js';
import { parseRosterFile, parseRosterText, type RosterParse } from './danhSach.js';
import type { z } from 'zod';
import { tooLargeMessage } from '../limits.js';

type Draft = NonNullable<Awaited<ReturnType<typeof prisma.workSetupDraft.findUnique>>>;

const jobs = new Map<number, AbortController>();
const STALE_MS = 3 * 60_000;
const today = () => iso(new Date(Date.now() + 7 * 3600_000));

// ─── Quyền + trình bày ───────────────────────────────────────────

async function own(userId: number, id: number): Promise<Draft> {
  await assertHumanActor(userId, 'set up projects with CuongMini');
  const d = await prisma.workSetupDraft.findUnique({ where: { id } });
  if (!d || d.createdById !== userId) throw new NotFoundError('Draft not found');
  await requireWorkspace(userId, d.workspaceId, 'workspace.createProject');
  return d;
}

const sourcesOf = (d: Pick<Draft, 'sources'>) => (Array.isArray(d.sources) ? d.sources : []) as unknown as SetupSource[];
const inputOf = (d: Pick<Draft, 'input'>): SetupInput => setupInput.parse(d.input ?? {});

function present(d: Draft) {
  const usage = (Array.isArray(d.usage) ? d.usage : []) as unknown as UsageCall[];
  return {
    id: d.id, workspaceId: d.workspaceId, mode: d.mode, status: d.status as DraftStatus, title: d.title, model: d.model,
    input: d.input, understanding: d.understanding, plan: d.plan, progress: d.progress, result: d.result, error: d.error, failedPhase: d.failedPhase,
    busy: BUSY.includes(d.status as DraftStatus),
    // Không bao giờ trả chữ đã rút hay khoá R2 về client.
    sources: sourcesOf(d).map(({ text: _t, r2Key: _k, ...s }) => s),
    usage: { calls: usage.length, usd: Math.round(usage.reduce((n, u) => n + (u.usd || 0), 0) * 10_000) / 10_000, fallback: usage.filter((u) => u.path === 'modelapi').length },
    createdAt: d.createdAt, updatedAt: d.updatedAt, appliedAt: d.appliedAt,
  };
}

/** Job mồ côi (máy chủ khởi động lại giữa chừng) ⇒ FAILED để người dùng chạy lại. */
async function healStale(d: Draft): Promise<Draft> {
  if (!BUSY.includes(d.status as DraftStatus) || jobs.has(d.id) || Date.now() - d.updatedAt.getTime() < STALE_MS) return d;
  return prisma.workSetupDraft.update({
    where: { id: d.id },
    data: { status: 'FAILED', failedPhase: d.status, error: 'The job was interrupted (server restart). Run it again — nothing was half-created.' },
  });
}

// ─── CRUD ────────────────────────────────────────────────────────

export async function createDraft(userId: number, workspaceId: number, body: { mode?: 'PROJECT' | 'WORKSPACE'; input?: unknown; model?: string }) {
  await assertHumanActor(userId, 'set up projects with CuongMini');
  await requireWorkspace(userId, workspaceId, 'workspace.createProject');
  const mine = await prisma.workSetupDraft.count({ where: { workspaceId, createdById: userId, status: { not: 'APPLIED' } } });
  if (mine >= 30) throw new BadRequestError('You have too many unfinished CuongMini drafts here — delete some first', 'WORK_LIMIT');
  const input = setupInput.parse(body.input ?? {});
  const d = await prisma.workSetupDraft.create({
    data: {
      workspaceId, createdById: userId, mode: body.mode === 'WORKSPACE' ? 'WORKSPACE' : 'PROJECT', title: input.overview.name.slice(0, 160),
      model: SETUP_MODELS.includes(body.model as SetupModelId) ? body.model! : 'cm-sonic', input: input as unknown as Prisma.InputJsonValue,
    },
  });
  return present(d);
}

export async function listDrafts(userId: number, workspaceId: number) {
  await requireWorkspace(userId, workspaceId, 'workspace.createProject');
  const rows = await prisma.workSetupDraft.findMany({
    where: { workspaceId, createdById: userId }, orderBy: { updatedAt: 'desc' }, take: 20,
    select: { id: true, mode: true, status: true, title: true, updatedAt: true, result: true },
  });
  return rows;
}

export async function getDraft(userId: number, id: number) {
  return present(await healStale(await own(userId, id)));
}

function assertIdle(d: Draft) {
  if (BUSY.includes(d.status as DraftStatus)) throw new AppError('CuongMini is still working on this draft — wait or cancel it first', 409, 'WORK_SETUP_BUSY');
}
function assertNotApplied(d: Draft) {
  if (d.status === 'APPLIED') throw new AppError('This draft was already used to create projects — start a new one', 409, 'WORK_SETUP_APPLIED');
}

export async function updateDraft(userId: number, id: number, body: { input?: unknown; understanding?: unknown; plan?: unknown; model?: string; mode?: 'PROJECT' | 'WORKSPACE' }) {
  const d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  const data: Prisma.WorkSetupDraftUpdateInput = {};
  if (body.input !== undefined) {
    const input = setupInput.parse(body.input);
    data.input = input as unknown as Prisma.InputJsonValue;
    data.title = (input.overview.name || d.title).slice(0, 160);
  }
  if (body.mode) data.mode = body.mode === 'WORKSPACE' ? 'WORKSPACE' : 'PROJECT';
  if (body.model !== undefined) {
    if (!SETUP_MODELS.includes(body.model as SetupModelId)) throw new BadRequestError('Unknown model', 'VALIDATION_ERROR');
    data.model = body.model;
  }
  if (body.understanding !== undefined) data.understanding = understandingSchema.parse(body.understanding) as unknown as Prisma.InputJsonValue;
  if (body.plan !== undefined) {
    const plan = parsePlan(body.plan);
    const input = body.input !== undefined ? setupInput.parse(body.input) : inputOf(d);
    plan.warnings = recomputeWarnings(plan, input);
    data.plan = plan as unknown as Prisma.InputJsonValue;
  }
  return present(await prisma.workSetupDraft.update({ where: { id }, data }));
}

export async function deleteDraft(userId: number, id: number) {
  const d = await own(userId, id);
  assertIdle(d);
  await dropSourceObjects(sourcesOf(d));
  await prisma.workSetupDraft.delete({ where: { id } });
  return { deleted: true };
}

async function dropSourceObjects(list: SetupSource[]) {
  const keys = list.map((s) => s.r2Key).filter((k): k is string => !!k);
  if (!keys.length) return;
  const { commentStore } = await import('../commentFiles.service.js');
  for (const k of keys) await commentStore().del(k).catch(() => undefined);
}

function parsePlan(raw: unknown): SetupPlan {
  const r = setupPlan.safeParse(raw);
  if (!r.success) {
    const f = r.error.issues[0];
    throw new BadRequestError(`Plan is invalid at ${f?.path.join('.') || 'root'}: ${f?.message ?? 'bad value'}`, 'VALIDATION_ERROR');
  }
  const plan = r.data;
  for (const p of plan.projects) {
    const refs = new Set(p.items.map((i) => i.ref));
    if (refs.size !== p.items.length) throw new BadRequestError(`Duplicate item ref in ${p.key}`, 'VALIDATION_ERROR');
    for (const i of p.items) {
      if (i.parentRef && !refs.has(i.parentRef)) i.parentRef = null;
      i.blockedBy = i.blockedBy.filter((b) => refs.has(b) && b !== i.ref);
      if (i.kind === 'SUBTASK' && !i.parentRef) i.kind = 'TASK';
      if (i.kind === 'EPIC') i.parentRef = null;
    }
  }
  return plan;
}

/** Cảnh báo sau khi người dùng sửa tay (không xếp lại gì): quá tải, chưa giao, người mới ôm việc khó, quá hạn chót. */
function recomputeWarnings(plan: SetupPlan, input: SetupInput): PlanWarning[] {
  const out: PlanWarning[] = plan.warnings.filter((w) => w.kind === 'MISSING_INFO' || w.kind === 'CAP' || w.kind === 'SOURCE');
  const mByRef = new Map(plan.members.map((m) => [m.ref, m]));
  const deadline = input.timeline.endDate;
  const L = (vi: string, en: string) => (input.overview.language === 'en' ? en : vi);
  for (const p of plan.projects) {
    const members = plan.members.filter((m) => m.projectRef === p.ref);
    const load = new Map<string, number>();
    const work = p.items.filter((i) => i.kind === 'STORY' || i.kind === 'TASK' || i.kind === 'BUG');
    for (const i of work) if (i.assigneeRef) load.set(i.assigneeRef, (load.get(i.assigneeRef) ?? 0) + (i.points ?? 1));
    const weeks = Math.max(1, p.sprints.length * (input.timeline.sprintWeeks || 2));
    for (const m of members) {
      const cap = (m.hoursPerWeek * weeks) / 4;
      if ((load.get(m.ref) ?? 0) > cap * 1.1) out.push({ kind: 'OVERLOAD', projectRef: p.ref, ref: m.ref, message: L(`${m.name} nhận ${Math.round(load.get(m.ref)!)} điểm nhưng ${m.hoursPerWeek} giờ/tuần chỉ vừa khoảng ${Math.round(cap)}.`, `${m.name} has ${Math.round(load.get(m.ref)!)} points but about ${Math.round(cap)} fit in ${m.hoursPerWeek} h/week.`) });
    }
    const un = work.filter((i) => !i.assigneeRef).length;
    if (un && members.length) out.push({ kind: 'UNASSIGNED', projectRef: p.ref, ref: null, message: L(`${un} việc chưa có người làm.`, `${un} item(s) have no assignee.`) });
    for (const i of work) {
      const a = i.assigneeRef ? mByRef.get(i.assigneeRef) : undefined;
      if (a && i.difficulty === 3 && a.level <= 2 && !i.pairRef) out.push({ kind: 'BEGINNER_HARD', projectRef: p.ref, ref: i.ref, message: L(`“${i.title}” là việc khó mà ${a.name} đang làm một mình — ghép cặp.`, `“${i.title}” is hard and assigned to ${a.name} alone — pair them.`) });
    }
    const late = deadline ? work.filter((i) => i.due && i.due > deadline).length : 0;
    if (late) out.push({ kind: 'DEADLINE', projectRef: p.ref, ref: null, message: L(`${late} việc có hạn sau hạn chót (${deadline}).`, `${late} item(s) are due after the final deadline (${deadline}).`) });
  }
  return out.slice(0, 400);
}

// ─── Nguồn: tệp, link, danh sách thành viên ──────────────────────

export async function addFile(userId: number, id: number, f: { buffer: Buffer; fileName: string; mime: string }, meta: { category: SourceCategory; note?: string }) {
  const d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  const list = sourcesOf(d);
  if (list.length >= CAP.sources) throw new BadRequestError(`At most ${CAP.sources} files and links per draft`, 'WORK_LIMIT');
  if (f.buffer.length > CAP.fileBytes) throw new AppError(tooLargeMessage(CAP.fileBytes), 413, 'WORK_FILE_TOO_LARGE');
  if (!supportedFile(f.fileName)) throw new BadRequestError('Unsupported file type — use PDF, DOCX, XLSX, PPTX, ZIP, images or text files', 'WORK_BAD_UPLOAD');
  const sid = crypto.randomUUID().slice(0, 12);
  let r2Key: string | undefined;
  try {
    const { assertCommentStorage, commentStore } = await import('../commentFiles.service.js');
    assertCommentStorage();
    r2Key = `work/setup/${d.workspaceId}/${d.id}/${sid}/${f.fileName.replace(/[^\w.\- ]/g, '_').slice(-120)}`;
    await commentStore().put(r2Key, f.buffer, f.mime || 'application/octet-stream');
  } catch (e) {
    // Không có kho tệp (máy dev không R2): vẫn đọc chữ, chỉ không đính kèm được vào dự án.
    logger.warn('[tao-cuongmini] không lưu được tệp lên kho', { error: (e as Error).message });
    r2Key = undefined;
  }
  let roster: RosterParse | null = null;
  let read: Awaited<ReturnType<typeof extractUpload>>;
  if (meta.category === 'ROSTER') {
    roster = /\.(xlsx|xlsm|csv|tsv|txt)$/i.test(f.fileName) ? parseRosterFile(f.buffer, f.fileName) : null;
    read = roster ? { text: roster.rows.map((r) => `${r.name} | ${r.studentId} | ${r.email} | ${r.role} | ${r.level}`).join('\n'), status: roster.rows.length ? 'OK' : 'EMPTY' }
      : await extractUpload(f.buffer, f.fileName, f.mime, { userId, ocrImages: true });
  } else {
    read = await extractUpload(f.buffer, f.fileName, f.mime, { userId, ocrImages: meta.category !== 'SAMPLE' && meta.category !== 'CODE' });
  }
  const src: SetupSource = {
    id: sid, kind: 'FILE', category: meta.category, name: f.fileName.slice(0, 200), note: (meta.note ?? '').slice(0, 500), mime: f.mime.slice(0, 100), size: f.buffer.length,
    r2Key, status: read.status, error: read.error ?? (r2Key ? undefined : 'Stored as text only (file storage is not configured here)'), chars: read.text.length, text: read.text, addedAt: new Date().toISOString(),
  };
  const fresh = await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } });
  const next = [...sourcesOf(fresh), src];
  // Repo phát hiện stack ⇒ điền ô stack nếu người dùng chưa gõ.
  const input = inputOf(fresh);
  if (read.stack?.length && !input.code.stack) input.code.stack = read.stack.join(', ');
  const saved = await prisma.workSetupDraft.update({ where: { id }, data: { sources: next as unknown as Prisma.InputJsonValue, input: input as unknown as Prisma.InputJsonValue } });
  return { draft: present(saved), source: { ...src, text: undefined, r2Key: undefined }, roster };
}

export async function addLink(userId: number, id: number, body: { url: string; category: SourceCategory; note?: string; branch?: string }) {
  const d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  const list = sourcesOf(d);
  if (list.length >= CAP.sources) throw new BadRequestError(`At most ${CAP.sources} files and links per draft`, 'WORK_LIMIT');
  const url = normalizeLink(body.url);
  if (!url) throw new BadRequestError('Enter a valid http(s) link', 'VALIDATION_ERROR');
  if (list.some((s) => s.url === url)) throw new AppError('This link is already in the draft', 409, 'WORK_SETUP_DUPLICATE');
  const repo = parseRepoUrl(url, body.branch);
  const read = repo ? await readRepo(url, body.branch) : await readLink(url);
  const kind = classifyLink(url);
  const src: SetupSource = {
    id: crypto.randomUUID().slice(0, 12), kind: repo ? 'REPO' : 'LINK', category: repo ? 'CODE' : body.category,
    name: (read.title || (repo ? repo.repo : url.replace(/^https?:\/\//, ''))).slice(0, 200), note: (body.note ?? '').slice(0, 500), url,
    status: read.status, error: read.error ?? (kind === 'web' && !read.text ? 'Saved as a resource link (web pages are not read)' : undefined), chars: read.text.length, text: read.text,
    addedAt: new Date().toISOString(),
  };
  const fresh = await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } });
  const input = inputOf(fresh);
  if (repo && !input.code.repoUrl) { input.code.repoUrl = url; if (body.branch) input.code.branch = body.branch; }
  if (read.stack?.length && !input.code.stack) input.code.stack = read.stack.join(', ');
  const saved = await prisma.workSetupDraft.update({ where: { id }, data: { sources: [...sourcesOf(fresh), src] as unknown as Prisma.InputJsonValue, input: input as unknown as Prisma.InputJsonValue } });
  return { draft: present(saved), source: { ...src, text: undefined } };
}

export async function removeSource(userId: number, id: number, sid: string) {
  const d = await own(userId, id);
  assertIdle(d);
  const list = sourcesOf(d);
  const s = list.find((x) => x.id === sid);
  if (!s) throw new NotFoundError('Source not found');
  await dropSourceObjects([s]);
  const saved = await prisma.workSetupDraft.update({ where: { id }, data: { sources: list.filter((x) => x.id !== sid) as unknown as Prisma.InputJsonValue } });
  return present(saved);
}

export async function parseRoster(userId: number, workspaceId: number, body: { text?: string; file?: { buffer: Buffer; fileName: string } }) {
  await assertHumanActor(userId, 'set up projects with CuongMini');
  await requireWorkspace(userId, workspaceId, 'workspace.createProject');
  if (body.file) return parseRosterFile(body.file.buffer, body.file.fileName);
  return parseRosterText(body.text ?? '');
}

// ─── Job ─────────────────────────────────────────────────────────

interface Job {
  id: number;
  userId: number;
  signal: AbortSignal;
  steps: ProgressStep[];
  usage: UsageCall[];
  step(key: string, status: ProgressStep['status'], detail?: string): Promise<void>;
  call(o: { step: string; system: string; user: string; maxTokens: number }): Promise<string>;
}

function startJob(d: Draft, phase: 'READING' | 'PLANNING' | 'APPLYING', ve: unknown, run: (j: Job) => Promise<void>, onCancel: DraftStatus) {
  const ctl = new AbortController();
  jobs.set(d.id, ctl);
  const usage = (Array.isArray(d.usage) ? d.usage : []) as unknown as UsageCall[];
  const job: Job = {
    id: d.id, userId: d.createdById, signal: ctl.signal, steps: [], usage,
    async step(key, status, detail) {
      const at = new Date().toISOString();
      const cur = job.steps.find((s) => s.key === key);
      if (cur) Object.assign(cur, { status, detail: detail ?? cur.detail, at });
      else job.steps.push({ key, status, detail, at });
      await prisma.workSetupDraft.update({ where: { id: d.id }, data: { progress: job.steps as unknown as Prisma.InputJsonValue, usage: job.usage as unknown as Prisma.InputJsonValue } }).catch(() => undefined);
    },
    async call(o) {
      if (ctl.signal.aborted) throw new AppError('Cancelled', 499, 'WORK_SETUP_CANCELLED');
      const r = await goiModel({ userId: d.createdById, modelId: d.model as SetupModelId, ve, ...o, signal: ctl.signal });
      job.usage.push(r.call);
      return r.text;
    },
  };
  void (async () => {
    await prisma.workSetupDraft.update({ where: { id: d.id }, data: { status: phase, error: null, failedPhase: null, cancelRequested: false, progress: [] } });
    try {
      await run(job);
    } catch (e) {
      const cancelled = ctl.signal.aborted || (e as { code?: string }).code === 'WORK_SETUP_CANCELLED';
      const msg = cancelled ? 'Cancelled.' : (e as Error).message?.slice(0, 600) || 'Something went wrong';
      if (!cancelled) logger.warn('[tao-cuongmini] job lỗi', { id: d.id, phase, error: (e as Error).message, code: (e as { code?: string }).code });
      await prisma.workSetupDraft.update({
        where: { id: d.id },
        data: cancelled
          ? { status: onCancel, error: msg, progress: job.steps as unknown as Prisma.InputJsonValue, usage: job.usage as unknown as Prisma.InputJsonValue }
          : { status: 'FAILED', failedPhase: phase, error: msg, progress: job.steps as unknown as Prisma.InputJsonValue, usage: job.usage as unknown as Prisma.InputJsonValue },
      }).catch(() => undefined);
    } finally {
      jobs.delete(d.id);
    }
  })();
}

/** Test: chờ job của một bản nháp chạy xong. */
export async function _waitJob(id: number, timeoutMs = 60_000): Promise<void> {
  const t0 = Date.now();
  while (jobs.has(id) && Date.now() - t0 < timeoutMs) await new Promise((r) => setTimeout(r, 25));
}

export async function cancelJob(userId: number, id: number) {
  const d = await own(userId, id);
  const ctl = jobs.get(id);
  if (!ctl) {
    if (BUSY.includes(d.status as DraftStatus)) await healStale(d);
    return getDraft(userId, id);
  }
  await prisma.workSetupDraft.update({ where: { id }, data: { cancelRequested: true } });
  ctl.abort();
  return present(await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } }));
}

/** Gọi model + đọc JSON; hỏng ⇒ hỏi lại MỘT lần với lời nhắc gắt hơn. */
async function askJson<T>(j: Job, o: { step: string; system: string; user: string; maxTokens: number }, schema: z.ZodType<T, z.ZodTypeDef, unknown>): Promise<T> {
  const first = await j.call(o);
  const a = readJson(first, schema);
  if (a) return a;
  const again = await j.call({ ...o, step: `${o.step}:retry`, user: `${o.user}\n\nIMPORTANT: your previous reply was not valid JSON. Reply with ONE JSON object only — no prose, no code fences.` });
  const b = readJson(again, schema);
  if (b) return b;
  throw new AppError('CuongMini returned an answer that could not be read. Try again.', 502, 'WORK_AI_BAD_OUTPUT');
}

function sourcesForModel(d: Draft, budget: number) {
  return sourcesText(sourcesOf(d).filter((s) => s.text && s.status === 'OK').map((s) => ({ name: s.name, category: s.category, note: s.note, text: s.text! })), budget);
}

// ─── Bước 1: đọc & tóm tắt ───────────────────────────────────────

export async function startUnderstand(userId: number, id: number, body: { reread?: string; ve?: unknown; model?: string }) {
  let d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  if (body.model && SETUP_MODELS.includes(body.model as SetupModelId)) d = await prisma.workSetupDraft.update({ where: { id }, data: { model: body.model } });
  const input = inputOf(d);
  if (!input.overview.name && !input.brief.text && !input.overview.goal && !sourcesOf(d).some((s) => s.status === 'OK')) {
    throw new BadRequestError('Give CuongMini at least a project name, a goal, a brief or a file to read', 'WORK_SETUP_EMPTY');
  }
  await kiemModelTruoc(userId, d.model as SetupModelId, body.ve);
  const back: DraftStatus = d.understanding ? 'UNDERSTOOD' : 'DRAFT';
  startJob(d, 'READING', body.ve, async (j) => {
    await j.step('read', 'running');
    // Repo trong form mà chưa đọc ⇒ đọc bây giờ.
    if (input.code.repoUrl && parseRepoUrl(input.code.repoUrl) && !sourcesOf(d).some((s) => s.kind === 'REPO')) {
      const r = await readRepo(input.code.repoUrl, input.code.branch || null);
      const src: SetupSource = { id: crypto.randomUUID().slice(0, 12), kind: 'REPO', category: 'CODE', name: r.title || input.code.repoUrl, note: '', url: normalizeLink(input.code.repoUrl) ?? input.code.repoUrl, status: r.status, error: r.error, chars: r.text.length, text: r.text, addedAt: new Date().toISOString() };
      const fresh = await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } });
      d = await prisma.workSetupDraft.update({ where: { id }, data: { sources: [...sourcesOf(fresh), src] as unknown as Prisma.InputJsonValue } });
    }
    const ok = sourcesOf(d).filter((s) => s.status === 'OK');
    await j.step('read', 'done', `${ok.length} source(s), ${Math.round(ok.reduce((n, s) => n + s.chars, 0) / 1000)}k characters`);
    await j.step('understand', 'running');
    const { system, user } = understandPrompt(input, sourcesForModel(d, CAP.contextChars), { reread: body.reread, today: today() });
    const out = await askJson(j, { step: 'understand', system, user, maxTokens: 12_000 }, understandingOut);
    const u: Understanding = understandingSchema.parse({ ...out, notes: '' });
    // Mọi người trong danh sách đều có mặt (model bỏ sót ⇒ thêm lại với vai trong danh sách).
    for (const m of input.team.members) {
      const f = foldVi(m.name).trim();
      if (!u.team.some((t) => foldVi(t.name).trim() === f || (m.studentId && t.studentId.toUpperCase() === m.studentId.toUpperCase()))) {
        u.team.push({ name: m.name, studentId: m.studentId, group: m.group, proposedRole: m.role || 'Member', why: '' });
      }
    }
    // Giữ câu trả lời người dùng đã gõ cho câu hỏi trùng (đọc lại).
    const prev = d.understanding ? understandingSchema.safeParse(d.understanding) : null;
    if (prev?.success) {
      for (const q of u.questions) {
        const old = prev.data.questions.find((x) => foldVi(x.q) === foldVi(q.q));
        if (old?.answer && !q.answer) q.answer = old.answer;
      }
      u.notes = prev.data.notes;
    }
    await j.step('understand', 'done');
    await prisma.workSetupDraft.update({ where: { id }, data: { status: 'UNDERSTOOD', understanding: u as unknown as Prisma.InputJsonValue, usage: j.usage as unknown as Prisma.InputJsonValue, progress: j.steps as unknown as Prisma.InputJsonValue } });
  }, back);
  return present(await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } }));
}

// ─── Bước 2: chấp nhận ⇒ lập kế hoạch (⇒ tạo luôn nếu không xem trước) ───

export async function acceptUnderstanding(userId: number, id: number, body: { understanding?: unknown; ve?: unknown; reviewFirst?: boolean; sendInvites?: boolean }) {
  let d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  const u = understandingSchema.parse(body.understanding ?? d.understanding ?? null);
  const input = inputOf(d);
  if (body.reviewFirst !== undefined) input.reviewFirst = body.reviewFirst;
  if (body.sendInvites !== undefined) input.team.sendInvites = body.sendInvites;
  d = await prisma.workSetupDraft.update({ where: { id }, data: { understanding: u as unknown as Prisma.InputJsonValue, input: input as unknown as Prisma.InputJsonValue } });
  await kiemModelTruoc(userId, d.model as SetupModelId, body.ve);
  if (!input.reviewFirst) await assertCanApplyCount(d.workspaceId, d.mode, input);
  startJob(d, 'PLANNING', body.ve, async (j) => {
    const plan = await buildPlan(j, d, input, u);
    await prisma.workSetupDraft.update({ where: { id }, data: { plan: plan as unknown as Prisma.InputJsonValue, status: 'READY', usage: j.usage as unknown as Prisma.InputJsonValue, progress: j.steps as unknown as Prisma.InputJsonValue } });
    if (!input.reviewFirst) {
      await prisma.workSetupDraft.update({ where: { id }, data: { status: 'APPLYING' } });
      await runApply(j, { ...d, plan: plan as unknown as Prisma.JsonValue }, input, plan);
    }
  }, 'UNDERSTOOD');
  return present(await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } }));
}

async function assertCanApplyCount(workspaceId: number, mode: string, input: SetupInput) {
  const n = mode === 'WORKSPACE' ? Math.max(1, Math.min(CAP.projectsPerRun, input.groups.length || new Set(input.team.members.map((m) => m.group).filter(Boolean)).size || 1)) : 1;
  const have = await prisma.workProject.count({ where: { workspaceId, deletedAt: null } });
  if (have + n > 100) throw new BadRequestError(`This workspace can hold ${100 - have} more project(s) — ${n} were requested`, 'WORK_LIMIT');
}

/** Chạy hàm với tối đa `n` việc song song (giữ thứ tự kết quả). */
async function pool<T, R>(list: T[], n: number, fn: (x: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(list.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(n, list.length) }, async () => {
    while (next < list.length) { const i = next++; out[i] = await fn(list[i], i); }
  }));
  return out;
}

interface TopicOut { outline: OutlineOut; epics: Array<{ key: string; out: EpicOut | null }>; tests: z.infer<typeof testsOut> | null; pages: PlanPage[] }

async function buildPlan(j: Job, d: Draft, input: SetupInput, u: Understanding): Promise<SetupPlan> {
  const lang = input.overview.language;
  const L = (vi: string, en: string) => (lang === 'en' ? en : vi);
  await j.step('prepare', 'running');
  const wsKeys = (await prisma.workProject.findMany({ where: { workspaceId: d.workspaceId }, select: { key: true } })).map((p) => p.key);
  const { projects: resolved, warnings } = resolveProjects(input, wsKeys, d.mode === 'WORKSPACE' ? 'WORKSPACE' : 'PROJECT');
  const wsPeople: WsPerson[] = (await prisma.workMember.findMany({
    where: { workspaceId: d.workspaceId, role: { not: 'GUEST' } },
    select: { user: { select: { id: true, email: true, username: true, fullName: true, displayName: true, kind: true } } },
  })).filter((m) => m.user.kind !== 'AGENT').map((m) => ({ id: m.user.id, email: m.user.email, username: m.user.username, fullName: m.user.fullName, displayName: m.user.displayName }));
  const members = buildMembers(resolved, u, wsPeople, input.team.sendInvites);
  const sprintSlots = input.overview.type === 'KANBAN' ? [] : buildSprints(input.timeline, today());
  const end = input.timeline.endDate || sprintSlots.at(-1)?.end || null;
  const milestones = milestonesFor(input, u, end);
  const uText = understandingText(u);
  const stackLine = input.code.stack || u.tech.stack.join(', ');
  await j.step('prepare', 'done', `${resolved.length} project(s) · ${members.length} member(s) · ${sprintSlots.length} sprint(s)`);

  // Nhóm cùng đề tài dùng chung một lượt sinh (lớp 8 nhóm cùng đề ⇒ 1 lượt, không 8).
  const topics = [...new Set(resolved.map((p) => p.topic.trim()))];
  const maxEpics = Math.max(5, Math.min(CAP.epicsPerProject, Math.floor(40 / topics.length) || 5, 12));
  const sourceBudget = Math.max(20_000, Math.floor(80_000 / topics.length));
  const topicOut = new Map<string, TopicOut>();
  for (const [ti, topic] of topics.entries()) {
    const sample = resolved.find((p) => p.topic.trim() === topic)!;
    const label = topics.length > 1 ? ` (${ti + 1}/${topics.length})` : '';
    const teamText = members.filter((m) => m.projectRef === sample.ref).map(memberLine).join('\n');
    await j.step(`outline:${ti}`, 'running', `${tr(lang, 'Lập khung epic', 'Planning epics')}${label}`);
    const src = sourcesForModel(d, sourceBudget);
    // Sức nhóm (điểm) cho cả lịch: như cảnh báo OVERLOAD của lapLich — model phải lập kế hoạch VỪA sức này.
    const doi = members.filter((m) => m.projectRef === sample.ref);
    const heSo = sprintSlots.length ? sprintSlots.reduce((n, x) => n + x.factor, 0) : 5;
    const capacity = doi.length ? doi.reduce((n, m) => n + pointsPerSprint(m, input.timeline.sprintWeeks || 2, input.team.rules), 0) * heSo : null;
    const op = outlinePrompt({
      input, understanding: uText, project: { name: topics.length > 1 && topic ? sample.name : resolved[0].name, topic },
      sprints: sprintSlots, milestones, members: teamText, sources: src, maxEpics, capacity, hoursPerPoint: HOURS_PER_POINT,
    });
    const outline = await askJson(j, { step: `outline:${ti}`, ...op, maxTokens: 12_000 }, outlineOut);
    outline.epics = outline.epics.filter((e) => e.title).slice(0, maxEpics).map((e, k) => ({ ...e, key: e.key || `E${k + 1}` }));
    if (!outline.epics.length) throw new AppError('CuongMini could not find any work packages in the brief — add more detail and try again.', 422, 'WORK_SETUP_EMPTY_PLAN');
    await j.step(`outline:${ti}`, 'done', `${outline.epics.length} epic(s)${label}`);

    const epicSrc = sourcesForModel(d, Math.min(20_000, sourceBudget));
    let done = 0;
    await j.step(`epics:${ti}`, 'running', `0/${outline.epics.length}${label}`);
    const perEpic = Math.max(4, Math.min(CAP.storiesPerEpic, Math.floor((CAP.issuesPerProject - 40) / outline.epics.length / (input.split.detail === 'SUBTASKS' ? 4 : 1))));
    const epics = await pool(outline.epics, 3, async (e) => {
      const ep = epicPrompt({
        input, understanding: uText, epic: { key: e.key, title: e.title, description: e.description, area: e.area, milestone: e.milestone },
        otherEpics: outline.epics.filter((x) => x !== e).map((x) => `- ${x.key}: ${x.title}`).join('\n'),
        components: outline.components.map((c) => c.name), labels: outline.labels.map((l) => l.name), members: teamText, sources: epicSrc, maxItems: perEpic,
        budget: e.points || (capacity ? (capacity * 0.85) / outline.epics.length : null),
      });
      let out: EpicOut | null = null;
      try { out = await askJson(j, { step: `epic:${ti}:${e.key}`, ...ep, maxTokens: 10_000 }, epicOut); } catch (err) {
        if (j.signal.aborted) throw err;
        warnings.push({ kind: 'SOURCE', projectRef: null, ref: null, message: L(`Chưa tách được epic “${e.title}” (${(err as Error).message.slice(0, 120)}) — epic được tạo không có story.`, `Epic “${e.title}” could not be broken down (${(err as Error).message.slice(0, 120)}) — it was created without stories.`) });
      }
      done += 1;
      await j.step(`epics:${ti}`, 'running', `${done}/${outline.epics.length}${label}`);
      return { key: e.key, out };
    });
    await j.step(`epics:${ti}`, 'done', `${epics.reduce((n, e) => n + (e.out?.items.length ?? 0), 0)} item(s)${label}`);

    let tests: z.infer<typeof testsOut> | null = null;
    if (input.split.tests && input.split.detail !== 'EPICS') {
      await j.step(`tests:${ti}`, 'running');
      const stories = epics.flatMap((e) => e.out?.items ?? []).filter((s) => s.kind !== 'TASK').slice(0, 120)
        .map((s) => `${s.key} | ${s.title} | ${s.criteria.slice(0, 4).join('; ')}`).join('\n');
      try { tests = await askJson(j, { step: `tests:${ti}`, ...testsPrompt({ input, project: sample.name, stories, max: 30 }), maxTokens: 10_000 }, testsOut); } catch (err) {
        if (j.signal.aborted) throw err;
        warnings.push({ kind: 'SOURCE', projectRef: null, ref: null, message: L('Lần này chưa tạo được test case.', 'Test cases could not be generated this time.') });
      }
      await j.step(`tests:${ti}`, 'done', `${tests?.tests.length ?? 0} test case(s)`);
    }

    const pagesFromModel: PlanPage[] = [];
    if (input.split.pages) {
      await j.step(`pages:${ti}`, 'running');
      const facts = [
        uText, `Project: ${sample.name}`, stackLine ? `Stack: ${stackLine}` : '', input.code.repoUrl ? `Repo: ${input.code.repoUrl}` : '',
        input.code.conventions ? `Team conventions: ${input.code.conventions}` : '',
        `Epics:\n${outline.epics.map((e) => `- ${e.title} (by ${e.milestone || 'end'})`).join('\n')}`,
        `Definition of Done:\n${outline.dod.map((x) => `- ${x}`).join('\n')}`, `Definition of Ready:\n${outline.dor.map((x) => `- ${x}`).join('\n')}`,
        `Sprints: ${sprintSlots.map((s) => `${s.name} ${s.start}→${s.end}`).join('; ') || 'Kanban'}`, `Milestones: ${milestones.map((m) => `${m.name} ${m.date}`).join('; ') || '—'}`,
        `Meetings: ${meetingsFor(input, sprintSlots, lang).map((m) => `${m.title} ${TEN_THU[m.weekday]} ${m.hour}:${String(m.minute).padStart(2, '0')} every ${m.intervalWeeks} week(s)`).join('; ') || '—'}`,
        topics.length === 1 ? `Team:\n${teamText}` : 'Team: several groups use this plan — refer to “the leader” and “members” instead of names.',
        input.overview.stakeholders ? `Stakeholders: ${input.overview.stakeholders}` : '',
      ].filter(Boolean).join('\n\n');
      const viet = (set: readonly string[], step: string) => askJson(j, { step, ...pagesPrompt({ input, set, project: sample.name, facts }), maxTokens: 14_000 }, pagesOut);
      const sets = await pool(Object.values(PAGE_SETS), 4, async (set, k) => {
        try {
          return await viet(set, `pages:${ti}:${k}`);
        } catch (err) {
          if (j.signal.aborted) throw err;
          // Cả nhóm hỏng (thường do bị cắt) ⇒ viết lại TỪNG trang; trang nào vẫn hỏng mới báo.
          const le = await Promise.all(set.map((kind) => viet([kind], `pages:${ti}:${k}:${kind}`).catch((e2) => { if (j.signal.aborted) throw e2; return null; })));
          const hong = set.filter((_, i) => !le[i]?.pages.length);
          if (hong.length) warnings.push({ kind: 'SOURCE', projectRef: null, ref: null, message: L(`Một số trang Docs chưa viết được (${hong.join(', ')}).`, `Some Docs pages could not be written (${hong.join(', ')}).`) });
          return { pages: le.flatMap((x) => x?.pages ?? []) };
        }
      });
      for (const s of sets) for (const pg of s?.pages ?? []) {
        if (!pg.title || !pg.markdown.trim()) continue;
        const kind = (PAGE_KINDS as readonly string[]).includes(pg.kind) ? pg.kind as PlanPage['kind'] : null;
        pagesFromModel.push({ ref: `pg${pagesFromModel.length + 1}`, kind, title: pg.title, markdown: pg.markdown });
      }
      await j.step(`pages:${ti}`, 'done', `${pagesFromModel.length} page(s)`);
    }
    topicOut.set(topic, { outline, epics, tests, pages: pagesFromModel });
  }

  // ── Ráp từng dự án (mã: người, sprint, hạn, trang RACI/brief/AGENTS…).
  await j.step('assemble', 'running');
  const wsSlug = (await prisma.workSpace.findUniqueOrThrow({ where: { id: d.workspaceId }, select: { slug: true } })).slug;
  const projects: PlanProject[] = [];
  const allWarnings: PlanWarning[] = [...warnings];
  const srcList = sourcesOf(d).map((s) => ({ name: s.name, kind: s.kind, url: s.url, note: s.note, category: s.category }));
  for (const r of resolved) {
    const t = topicOut.get(r.topic.trim())!;
    const mine = members.filter((m) => m.projectRef === r.ref);
    const { items: modelItems, keyMap } = itemsFromModel(t.outline, t.epics, input.split.detail);
    const ob = input.split.onboarding ? onboardingItems(mine, lang, 1, !!input.code.repoUrl) : [];
    const capped = capItems([...ob, ...modelItems]);
    if (capped.dropped) allWarnings.push({ kind: 'CAP', projectRef: r.ref, ref: null, message: L(`Bỏ ${capped.dropped} việc ưu tiên thấp để không vượt ${CAP.issuesPerProject} thẻ mỗi dự án.`, `${capped.dropped} lower-priority item(s) were left out to stay under ${CAP.issuesPerProject} issues per project.`) });
    const byName = (name: string) => { const f = foldVi(name).trim(); return f ? mine.find((m) => foldVi(m.name).trim() === f || foldVi(m.name).includes(f))?.ref ?? null : null; };
    const p: PlanProject = {
      ref: r.ref, name: r.name, key: r.key, template: input.overview.template, type: input.overview.type === 'TESTING' ? 'SCRUM' : input.overview.type, kind: input.overview.kind,
      description: (t.outline.description || u.goal).slice(0, 5000),
      sprints: sprintSlots.map((s, k) => ({ ref: s.ref, name: s.name, goal: t.outline.sprintGoals[k] ?? '', start: s.start, end: s.end })),
      milestones,
      labels: [...t.outline.labels.filter((l) => l.name).map((l) => ({ name: l.name.toLowerCase().slice(0, 50), color: /^#[0-9a-f]{6}$/i.test(l.color) ? l.color : '#64748b' })), { name: 'onboarding', color: '#0ea5e9' }],
      components: t.outline.components.filter((c) => c.name).map((c) => ({ name: c.name, description: c.description, ownerRef: null })),
      items: capped.items,
      pages: [],
      tests: (t.tests?.tests ?? []).filter((x) => x.title).slice(0, CAP.tests).map((x, k) => ({ ref: `t${k + 1}`, title: x.title, preconditions: x.preconditions, steps: x.steps.filter((s) => s.action), storyRef: keyMap.get(x.story) ?? null })),
      risks: input.split.risks ? t.outline.risks.filter((x) => x.title).slice(0, CAP.risks).map((x, k) => ({ ref: `r${k + 1}`, title: x.title, description: x.description, category: x.category, probability: x.probability, impact: x.impact, mitigation: x.mitigation, ownerRef: byName(x.owner) ?? mine.find((m) => m.leader)?.ref ?? null })) : [],
      meetings: meetingsFor(input, sprintSlots, lang),
      resources: [],
      dod: t.outline.dod,
    };
    allWarnings.push(...finalizeProject(p, members, input, today()));
    // Chủ mô-đun = người làm nhiều nhất trong epic cùng mô-đun.
    for (const comp of p.components) {
      const owner = p.items.find((i) => i.kind === 'EPIC' && i.component && foldVi(i.component) === foldVi(comp.name))?.assigneeRef;
      comp.ownerRef = owner ?? null;
    }
    // Trang: model viết + mã viết.
    const glossary = t.outline.glossary.length ? `# ${tr(lang, 'Thuật ngữ', 'Glossary')}\n\n| ${tr(lang, 'Thuật ngữ', 'Term')} | ${tr(lang, 'Nghĩa', 'Meaning')} |\n|---|---|\n${t.outline.glossary.map((g) => `| ${g.term.replace(/\|/g, '/')} | ${g.meaning.replace(/\|/g, '/')} |`).join('\n')}` : '';
    const dodPage = `# Definition of Ready & Definition of Done\n\n## Definition of Ready\n${t.outline.dor.map((x) => `- [ ] ${x}`).join('\n') || '—'}\n\n## Definition of Done\n${t.outline.dod.map((x) => `- [ ] ${x}`).join('\n') || '—'}`;
    p.pages = [
      ...t.pages.map((pg, k) => ({ ...pg, ref: `${r.ref}-pg${k + 1}`, markdown: pg.kind === 'COMMUNICATION' ? `${pg.markdown}\n\n${sprintPlanMarkdown(p, lang)}` : pg.markdown })),
      ...(t.pages.some((x) => x.kind === 'COMMUNICATION') ? [] : [{ ref: `${r.ref}-sprints`, kind: 'COMMUNICATION' as const, title: tr(lang, 'Kế hoạch sprint & mốc', 'Sprint plan & milestones'), markdown: `# ${tr(lang, 'Kế hoạch sprint & mốc', 'Sprint plan & milestones')}\n\n${sprintPlanMarkdown(p, lang)}` }]),
      { ref: `${r.ref}-dod`, kind: 'DOR_DOD' as const, title: 'Definition of Ready & Done', markdown: dodPage },
      ...(glossary ? [{ ref: `${r.ref}-gl`, kind: 'GLOSSARY' as const, title: tr(lang, 'Thuật ngữ', 'Glossary'), markdown: glossary }] : []),
      raciPage(p, members, lang, input.overview.stakeholders),
      memberBriefsPage(p, memberBriefs(p, members, lang, input.timeline.sprintWeeks || 2), lang),
      agentsPage(p, input, members, lang, wsSlug),
      ...(srcList.length ? [resourcesPage(p, srcList, lang)] : []),
    ].slice(0, CAP.pages);
    projects.push(p);
  }
  const plan: SetupPlan = {
    projects, members,
    portfolio: projects.length > 1 ? portfolioPage(projects, members, lang, wsSlug) : null,
    warnings: allWarnings.slice(0, 400),
  };
  await j.step('assemble', 'done', `${projects.reduce((n, p) => n + p.items.length, 0)} item(s)`);
  return parsePlan(plan);
}

// ─── Sửa theo lời nhắn + cân lại ─────────────────────────────────

export async function revise(userId: number, id: number, body: { instruction: string; ve?: unknown }) {
  const d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  if (!d.plan) throw new BadRequestError('There is no plan to revise yet', 'WORK_SETUP_NO_PLAN');
  const instruction = body.instruction.trim();
  if (!instruction) throw new BadRequestError('Tell CuongMini what to change', 'VALIDATION_ERROR');
  await kiemModelTruoc(userId, d.model as SetupModelId, body.ve);
  const input = inputOf(d);
  startJob(d, 'PLANNING', body.ve, async (j) => {
    await j.step('revise', 'running');
    const plan = parsePlan(d.plan);
    const lines: string[] = [];
    for (const p of plan.projects) {
      const mByRef = new Map(plan.members.map((m) => [m.ref, m.name]));
      const sByRef = new Map(p.sprints.map((s) => [s.ref, s.name]));
      lines.push(`## ${p.key} — ${p.name}`);
      for (const i of p.items.slice(0, 700)) lines.push(`${p.key}:${i.ref} | ${i.kind} | ${i.parentRef ? `${p.key}:${i.parentRef}` : '-'} | ${i.title}${i.locked ? ' [locked]' : ''} | ${i.assigneeRef ? mByRef.get(i.assigneeRef) ?? '-' : '-'} | ${i.sprintRef ? sByRef.get(i.sprintRef) ?? '-' : '-'} | ${i.points ?? '-'}`);
    }
    const out = await askJson(j, { step: 'revise', ...revisePrompt({ input, instruction, plan: lines.join('\n').slice(0, 120_000) }), maxTokens: 10_000 }, reviseOut);
    const changed = applyOps(plan, out);
    for (const p of plan.projects.filter((x) => changed.has(x.ref))) finalizeProject(p, plan.members, input, today());
    plan.warnings = recomputeWarnings(plan, input);
    await j.step('revise', 'done', out.note || `${out.ops.length} change(s)`);
    await prisma.workSetupDraft.update({ where: { id }, data: { plan: plan as unknown as Prisma.InputJsonValue, status: 'READY', usage: j.usage as unknown as Prisma.InputJsonValue, progress: j.steps as unknown as Prisma.InputJsonValue } });
  }, 'READY');
  return present(await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } }));
}

/** Thao tác của model ⇒ kế hoạch. Trả tập dự án bị đổi. Không đụng thẻ khoá tay (trừ khi xoá). */
export function applyOps(plan: SetupPlan, out: z.infer<typeof reviseOut>): Set<string> {
  const changed = new Set<string>();
  const split = (ref: string) => { const m = /^([A-Z][A-Z0-9]{1,9}):(.+)$/.exec(ref.trim()); return m ? { key: m[1], ref: m[2] } : plan.projects.length === 1 ? { key: plan.projects[0].key, ref: ref.trim() } : null; };
  let n = 0;
  for (const op of out.ops) {
    const at = op.op === 'add' ? split(op.item?.parentRef || op.ref || '') : split(op.ref);
    const p = at ? plan.projects.find((x) => x.key === at.key) : op.op === 'add' && plan.projects.length === 1 ? plan.projects[0] : undefined;
    if (!p) continue;
    if (op.op === 'remove') {
      const gone = new Set([at!.ref]);
      for (let k = 0; k < 3; k++) for (const i of p.items) if (i.parentRef && gone.has(i.parentRef)) gone.add(i.ref);
      p.items = p.items.filter((i) => !gone.has(i.ref));
      for (const i of p.items) i.blockedBy = i.blockedBy.filter((b) => !gone.has(b));
      changed.add(p.ref);
      continue;
    }
    if (op.op === 'update') {
      const it = p.items.find((i) => i.ref === at!.ref);
      if (!it || it.locked) continue;
      const s = op.set;
      if (s.title) it.title = s.title;
      if (s.description !== undefined && s.description) it.description = s.description;
      if (s.points !== undefined && s.points !== null) it.points = s.points;
      if (s.priority !== undefined) it.priority = s.priority;
      if (s.difficulty !== undefined) it.difficulty = s.difficulty;
      if (s.labels) it.labels = s.labels;
      if (s.criteria) it.criteria = s.criteria;
      if (s.area) it.area = s.area;
      if (s.assignee) {
        const f = foldVi(s.assignee).trim();
        const m = plan.members.find((x) => x.projectRef === p.ref && foldVi(x.name).trim() === f);
        if (m) { it.assigneeRef = m.ref; it.locked = true; }
      }
      if (s.sprint) {
        const sp = p.sprints.find((x) => foldVi(x.name) === foldVi(s.sprint!));
        if (sp) { it.sprintRef = sp.ref; it.due = sp.end; it.locked = true; }
      }
      changed.add(p.ref);
      continue;
    }
    if (op.op === 'add' && op.item?.title) {
      if (p.items.length >= CAP.issuesPerProject) continue;
      const parentRef = op.item.parentRef ? split(op.item.parentRef)?.ref ?? null : null;
      const parent = parentRef ? p.items.find((i) => i.ref === parentRef) : undefined;
      let kind = op.item.kind;
      if (kind === 'SUBTASK' && !parent) kind = 'TASK';
      if (kind === 'EPIC') { /* epic không có cha */ }
      const ref = `a${Date.now().toString(36)}${n++}`;
      p.items.push({
        ref, kind, parentRef: kind === 'EPIC' ? null : parent?.ref ?? null, title: op.item.title, description: op.item.description, criteria: op.item.criteria,
        points: op.item.points, priority: op.item.priority, difficulty: op.item.difficulty, labels: [], component: '', area: op.item.area,
        assigneeRef: null, pairRef: null, sprintRef: null, milestoneRef: null, due: null, blockedBy: [], locked: false,
      });
      changed.add(p.ref);
    }
  }
  return changed;
}

/** Giao lại người cho thẻ chưa khoá + xếp lịch lại (không gọi model). */
export async function rebalance(userId: number, id: number) {
  const d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  if (!d.plan) throw new BadRequestError('There is no plan yet', 'WORK_SETUP_NO_PLAN');
  const input = inputOf(d);
  const plan = parsePlan(d.plan);
  const kept = plan.warnings.filter((w) => w.kind === 'MISSING_INFO' || w.kind === 'CAP' || w.kind === 'SOURCE');
  const w: PlanWarning[] = [];
  for (const p of plan.projects) {
    for (const i of p.items) if (!i.locked) { i.assigneeRef = i.labels.includes('onboarding') ? i.assigneeRef : null; i.pairRef = null; }
    w.push(...finalizeProject(p, plan.members, input, today()));
  }
  plan.warnings = [...kept, ...w].slice(0, 400);
  return present(await prisma.workSetupDraft.update({ where: { id }, data: { plan: plan as unknown as Prisma.InputJsonValue } }));
}

// ─── Bước 3: tạo ─────────────────────────────────────────────────

export async function startApply(userId: number, id: number, body: { sendInvites?: boolean }) {
  const d = await own(userId, id);
  assertIdle(d);
  assertNotApplied(d);
  if (!d.plan) throw new BadRequestError('Generate the plan first', 'WORK_SETUP_NO_PLAN');
  const input = inputOf(d);
  if (body.sendInvites !== undefined) input.team.sendInvites = body.sendInvites;
  const plan = parsePlan(d.plan);
  await assertCanApplyCount(d.workspaceId, 'PROJECT', { ...input, groups: plan.projects.map(() => ({ name: 'x', key: '', topic: '', leader: '' })) });
  // Gửi lời mời đổi ý sau khi lập kế hoạch ⇒ cập nhật cách ghép người (có email ⇒ INVITE).
  for (const m of plan.members) if (m.mapping !== 'USER') m.mapping = m.email && input.team.sendInvites ? 'INVITE' : 'PLACEHOLDER';
  await prisma.workSetupDraft.update({ where: { id }, data: { input: input as unknown as Prisma.InputJsonValue, plan: plan as unknown as Prisma.InputJsonValue } });
  startJob(d, 'APPLYING', null, (j) => runApply(j, d, input, plan), 'READY');
  return present(await prisma.workSetupDraft.findUniqueOrThrow({ where: { id } }));
}

async function runApply(j: Job, d: Draft, input: SetupInput, plan: SetupPlan) {
  const ws = await prisma.workSpace.findUniqueOrThrow({ where: { id: d.workspaceId }, select: { slug: true } });
  const { applyPlan } = await import('./apDung.js');
  await j.step('create', 'running');
  const res = await applyPlan({
    userId: d.createdById, workspaceId: d.workspaceId, wsSlug: ws.slug, plan, sources: sourcesOf(d), usage: j.usage, modelId: d.model as SetupModelId,
    lang: input.overview.language, sendInvites: input.team.sendInvites, sprintWeeks: input.timeline.sprintWeeks || 2, draftId: d.id, signal: j.signal,
    progress: (key, status, detail) => j.step(key, status, detail),
  });
  await j.step('create', 'done', `${res.projects.length} project(s)`);
  await prisma.workSetupDraft.update({
    where: { id: d.id },
    data: { status: 'APPLIED', appliedAt: new Date(), result: res as unknown as Prisma.InputJsonValue, plan: plan as unknown as Prisma.InputJsonValue, usage: j.usage as unknown as Prisma.InputJsonValue, progress: j.steps as unknown as Prisma.InputJsonValue },
  });
}

/** Dùng trong test + công cụ: thành viên kế hoạch theo dự án. */
export const _membersOf = (plan: SetupPlan, ref: string): PlanMember[] => plan.members.filter((m) => m.projectRef === ref);
export type { PlanItem };
export { formText };
