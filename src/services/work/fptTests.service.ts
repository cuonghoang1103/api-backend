/**
 * CT Work — tài liệu kiểm thử chuẩn FPT (đợt 1b, 08/10/2026): phần DB + quyền.
 *
 * Mở rộng mục Kiểm thử (Xray) của dự án — KHÔNG thay thế test case/cycle cũ:
 *   • Unit test (Report 5.1): mỗi HÀM một ma trận UTCID × (Condition | Confirmation), ô "O",
 *     loại N/A/B, P/F, ngày chạy, Defect ID; LOC ⇒ KLOC ⇒ chỉ tiêu 100 TC/KLOC (cảnh báo khi thiếu).
 *   • Integration test (Report 5.2): mỗi MODULE một bảng case (mô tả, thủ tục, dữ liệu, mong đợi,
 *     thực tế, tối đa 4 vòng chạy Passed/Failed/Pending/N/A + ngày + người kiểm).
 *   • System test (Report 5.3, đợt 3B 09/10/2026): mỗi WORKFLOW một bảng case như integration nhưng đúng 3 vòng
 *     Round 1–3 — lưu chung bảng work_it_modules với `kind = 'SYS'` (5.2 là 'INT').
 *   • Cover + Record of change dùng chung cho cả ba báo cáo (report UNIT | INT | SYS).
 *   • Xuất/nhập Excel đúng mẫu (fptTests.ts), AI gợi ý điều kiện biên cho một hàm (có trần).
 *
 * Quyền: đọc = project.view (VIEWER/TEACHER xem được để chấm); ghi = issue.edit (ADMIN/MEMBER).
 * Lưu ma trận bằng PUT thay trọn (rows/cases/marks) + khoá lạc quan theo `updatedAt` — hai người sửa
 * cùng một hàm thì người sau nhận 409 và tải lại, không ghi đè im lặng.
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { extractJson, isAiAvailable } from '../interview/llm/index.js';
import { goiAiCtWork } from './aiCong.js';
import { kiemHanMucAi } from './aiTaiTro.js';
import { emitWorkEvent } from './events.js';
import {
  buildIntegrationSheets, buildSystemSheets, buildUnitSheets, SYS_ROUNDS, CASE_RESULTS, CASE_TYPES, defaultIdPrefix, defaultSheetName, detectReport, IT_STATUSES,
  itStats, MAX_ROUNDS, parseIntegrationWorkbook, parseUnitWorkbook, requiredCases, unitStats, unitSummary, itCoverage,
  type ChangeData, type DocMeta, type ItCaseData, type ItModuleData, type ItRound, type UnitFunctionData,
} from './fptTests.js';
import { gateDelete, isUnapprovedMachineCall, type QueuedRequest } from './deleteRequests.service.js';
import { can, loadProjectAccess, requireProject } from './permissions.js';
import { putInTrash, trashGraph } from './trashBin.service.js';
import { readXlsx, writeXlsx } from './xlsxStyled.js';
import { mbText, WORK_LIMITS } from './limits.js';

export const MAX_FUNCTIONS = 500;
export const MAX_ROWS = 300;
export const MAX_CASES = 200;
export const MAX_IT_MODULES = 100;
export const MAX_IT_CASES = 500;
/** Trần tệp .xlsx nhập 5.1–5.3 — chung với mọi lần nhập của CT Work (limits.ts, env WORK_MAX_IMPORT_MB). */
export const MAX_IMPORT_BYTES = WORK_LIMITS.importBytes;

/**
 * 22/10/2026 (sự cố SWT301 — "Nhập Excel → Thay thế" xoá cứng cả bảng 5.1): mọi lệnh xoá ở đây đi qua `gateDelete`
 * (AI / token ⇒ yêu cầu chờ trưởng nhóm duyệt; hàng loạt của thành viên ⇒ yêu cầu; ADMIN hàng loạt ⇒ phải xác nhận số) và
 * để lại ảnh chụp đầy đủ trong THÙNG RÁC 30 ngày (trashBin.service) ⇒ khôi phục y nguyên. Lưu ma trận / case làm MẤT
 * UTCID, dòng, case cũng vào thùng rác (khôi phục = thêm lại vào cuối, không ghi đè).
 */
export type DeleteOutcome = { deleted: true; trashId: number } | { deleted: false; queued: QueuedRequest };

const machineDeleteError = (what: string, tool: string) => new AppError(
  `This change would delete ${what}. AI assistants and API tokens cannot delete directly — use ${tool}: it sends the deletion to the team lead for approval.`,
  409, 'WORK_DELETE_NEEDS_APPROVAL',
);

const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
const iso = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);
const toDate = (s: string | null | undefined) => (s ? new Date(`${s.slice(0, 10)}T00:00:00Z`) : null);

// ─── Cover ───────────────────────────────────────────────────────

export async function loadMeta(projectId: number): Promise<DocMeta> {
  const [p, d] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true } }),
    prisma.workFptTestDoc.findUnique({ where: { projectId } }),
  ]);
  return {
    projectName: d?.projectName || p.name,
    projectCode: d?.projectCode || p.key,
    creator: d?.creator ?? null,
    reviewer: d?.reviewer ?? null,
    version: d?.version ?? '1.0',
    unitIssueDate: iso(d?.unitIssueDate),
    intIssueDate: iso(d?.intIssueDate),
    environment: d?.environment ?? null,
    tcPerKloc: d?.tcPerKloc ?? 100,
    unitNotes: d?.unitNotes ?? null,
    intNotes: d?.intNotes ?? null,
    sysIssueDate: iso(d?.sysIssueDate),
    sysNotes: d?.sysNotes ?? null,
  };
}

/** INT = Report 5.2 (module) · SYS = Report 5.3 (workflow). */
export type ItKind = 'INT' | 'SYS';
const roundsMax = (kind: string) => (kind === 'SYS' ? SYS_ROUNDS : MAX_ROUNDS);

export async function getDoc(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const [meta, raw, changes] = await Promise.all([
    loadMeta(projectId),
    prisma.workFptTestDoc.findUnique({ where: { projectId }, select: { projectName: true, projectCode: true } }),
    prisma.workFptChange.findMany({ where: { projectId }, orderBy: [{ report: 'asc' }, { position: 'asc' }, { id: 'asc' }] }),
  ]);
  return {
    meta,
    /** Giá trị người dùng tự đặt (null ⇒ đang dùng tên/mã dự án). */
    overrides: { projectName: raw?.projectName ?? null, projectCode: raw?.projectCode ?? null },
    changes: changes.map(changeOut),
    canEdit: access.role === 'ADMIN' || access.role === 'MEMBER',
  };
}

const changeOut = (c: { id: number; report: string; effectiveDate: Date; version: string; changeItem: string | null; action: string; description: string | null; reference: string | null; position: number }) => ({
  id: c.id, report: c.report as 'UNIT' | 'INT' | 'SYS', effectiveDate: iso(c.effectiveDate)!, version: c.version, changeItem: c.changeItem,
  action: c.action, description: c.description, reference: c.reference, position: c.position,
});

export const docInput = z.object({
  projectName: z.string().trim().max(200).nullable().optional(),
  projectCode: z.string().trim().max(40).nullable().optional(),
  creator: z.string().trim().max(120).nullable().optional(),
  reviewer: z.string().trim().max(120).nullable().optional(),
  version: z.string().trim().min(1).max(20).optional(),
  unitIssueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  intIssueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  environment: z.string().max(4000).nullable().optional(),
  tcPerKloc: z.number().int().min(1).max(10000).optional(),
  unitNotes: z.string().max(4000).nullable().optional(),
  intNotes: z.string().max(4000).nullable().optional(),
  sysIssueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  sysNotes: z.string().max(4000).nullable().optional(),
});

export async function updateDoc(userId: number, projectId: number, input: z.infer<typeof docInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  const data: Prisma.WorkFptTestDocUncheckedUpdateInput = {};
  const s = (v: string | null | undefined) => (v === undefined ? undefined : v?.trim() ? v.trim() : null);
  if (input.projectName !== undefined) data.projectName = s(input.projectName);
  if (input.projectCode !== undefined) data.projectCode = s(input.projectCode);
  if (input.creator !== undefined) data.creator = s(input.creator);
  if (input.reviewer !== undefined) data.reviewer = s(input.reviewer);
  if (input.version !== undefined) data.version = input.version;
  if (input.unitIssueDate !== undefined) data.unitIssueDate = toDate(input.unitIssueDate);
  if (input.intIssueDate !== undefined) data.intIssueDate = toDate(input.intIssueDate);
  if (input.environment !== undefined) data.environment = s(input.environment);
  if (input.tcPerKloc !== undefined) data.tcPerKloc = input.tcPerKloc;
  if (input.unitNotes !== undefined) data.unitNotes = s(input.unitNotes);
  if (input.intNotes !== undefined) data.intNotes = s(input.intNotes);
  if (input.sysIssueDate !== undefined) data.sysIssueDate = toDate(input.sysIssueDate);
  if (input.sysNotes !== undefined) data.sysNotes = s(input.sysNotes);
  await prisma.workFptTestDoc.upsert({
    where: { projectId },
    create: { ...(data as Prisma.WorkFptTestDocUncheckedCreateInput), projectId },
    update: data,
  });
  touch(projectId, userId);
  return getDoc(userId, projectId);
}

export const changeInput = z.object({
  report: z.enum(['UNIT', 'INT', 'SYS']),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  version: z.string().trim().min(1).max(20),
  changeItem: z.string().trim().max(200).nullable().optional(),
  action: z.enum(['A', 'D', 'M']),
  description: z.string().max(4000).nullable().optional(),
  reference: z.string().trim().max(300).nullable().optional(),
});

export async function addChange(userId: number, projectId: number, input: z.infer<typeof changeInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  if ((await prisma.workFptChange.count({ where: { projectId } })) >= 500) throw new BadRequestError('Too many change records', 'WORK_LIMIT');
  const position = await prisma.workFptChange.count({ where: { projectId, report: input.report } });
  const c = await prisma.workFptChange.create({
    data: { projectId, report: input.report, effectiveDate: toDate(input.effectiveDate)!, version: input.version, changeItem: input.changeItem || null, action: input.action, description: input.description?.trim() || null, reference: input.reference || null, position },
  });
  touch(projectId, userId);
  return changeOut(c);
}

export async function updateChange(userId: number, projectId: number, id: number, input: Partial<z.infer<typeof changeInput>>) {
  await requireProject(userId, projectId, 'issue.edit');
  const found = await prisma.workFptChange.findFirst({ where: { id, projectId }, select: { id: true } });
  if (!found) throw new NotFoundError('Change record not found');
  const c = await prisma.workFptChange.update({
    where: { id },
    data: {
      ...(input.report ? { report: input.report } : {}),
      ...(input.effectiveDate ? { effectiveDate: toDate(input.effectiveDate)! } : {}),
      ...(input.version ? { version: input.version } : {}),
      ...(input.changeItem !== undefined ? { changeItem: input.changeItem || null } : {}),
      ...(input.action ? { action: input.action } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.reference !== undefined ? { reference: input.reference || null } : {}),
    },
  });
  touch(projectId, userId);
  return changeOut(c);
}

export async function deleteChange(userId: number, projectId: number, id: number): Promise<DeleteOutcome> {
  await requireProject(userId, projectId, 'issue.edit');
  const c = await prisma.workFptChange.findFirst({ where: { id, projectId }, select: { report: true, version: true, action: true, description: true } });
  if (!c) throw new NotFoundError('Change record not found');
  const label = `Record of change (${c.report}) v${c.version} ${c.action}${c.description ? ` — ${c.description.slice(0, 120)}` : ''}`;
  const queued = await gateDelete(userId, projectId, { kind: 'fpt.change_delete', label, params: { id }, bulk: false });
  if (queued) return { deleted: false, queued };
  const trashId = await prisma.$transaction(async (tx) => {
    const t = await trashGraph(tx, { projectId, userId, kind: 'fpt.change', label, roots: [{ table: 'work_fpt_changes', ids: [id] }] });
    const r = await tx.workFptChange.deleteMany({ where: { id, projectId } });
    if (!r.count) throw new NotFoundError('Change record not found');
    return t.trashId;
  });
  touch(projectId, userId);
  return { deleted: true, trashId };
}

// ─── Unit test: hàm ──────────────────────────────────────────────

const fnSelect = {
  id: true, moduleName: true, methodName: true, sheetName: true, description: true, preCondition: true, testRequirement: true,
  codeRef: true, loc: true, createdBy: true, executedBy: true, position: true, updatedAt: true,
} satisfies Prisma.WorkUnitFunctionSelect;

export async function listFunctions(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const [meta, fns] = await Promise.all([
    loadMeta(projectId),
    prisma.workUnitFunction.findMany({
      where: { projectId },
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      select: { ...fnSelect, cases: { select: { type: true, result: true } }, _count: { select: { rows: true } } },
    }),
  ]);
  const items = fns.map((f) => {
    const st = unitStats(f.cases);
    const req = requiredCases(f.loc, meta.tcPerKloc);
    const { cases: _c, _count, ...rest } = f;
    return { ...rest, updatedAt: f.updatedAt.toISOString(), rowCount: _count.rows, stats: st, requiredCases: req, belowNorm: req !== null && st.total < req };
  });
  return { tcPerKloc: meta.tcPerKloc, summary: unitSummary(fns, meta.tcPerKloc), functions: items };
}

export const functionInput = z.object({
  moduleName: z.string().trim().min(1).max(120),
  methodName: z.string().trim().min(1).max(120),
  sheetName: z.string().trim().max(31).nullable().optional(),
  description: z.string().max(4000).nullable().optional(),
  preCondition: z.string().max(4000).nullable().optional(),
  testRequirement: z.string().max(4000).nullable().optional(),
  codeRef: z.string().trim().max(500).nullable().optional(),
  loc: z.number().int().min(0).max(1_000_000).nullable().optional(),
  createdBy: z.string().trim().max(120).nullable().optional(),
  executedBy: z.string().trim().max(120).nullable().optional(),
  position: z.number().int().min(0).max(100_000).optional(),
});
type FunctionInput = z.infer<typeof functionInput>;

const clean = (v: string | null | undefined) => (v === undefined ? undefined : v?.trim() ? v.trim() : null);

/** Mẫu khởi đầu như sheet mẫu: Precondition + Return/Exception/Log message, 1 test case N. */
const STARTER_ROWS: Array<{ section: 'COND' | 'CONFIRM'; groupName: string; value: string | null }> = [
  { section: 'COND', groupName: 'Precondition', value: 'Connected to the server' },
  { section: 'CONFIRM', groupName: 'Return', value: null },
  { section: 'CONFIRM', groupName: 'Exception', value: null },
  { section: 'CONFIRM', groupName: 'Log message', value: null },
];

async function whoName(userId: number): Promise<string | null> {
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, fullName: true, displayName: true } });
  return u ? (u.displayName || u.fullName || u.username) : null;
}

export async function createFunction(userId: number, projectId: number, input: FunctionInput & { starter?: boolean }) {
  await requireProject(userId, projectId, 'issue.edit');
  const count = await prisma.workUnitFunction.count({ where: { projectId } });
  if (count >= MAX_FUNCTIONS) throw new BadRequestError(`A project can have at most ${MAX_FUNCTIONS} unit-tested functions`, 'WORK_LIMIT');
  const me = await whoName(userId);
  const fn = await prisma.$transaction(async (tx) => {
    const f = await tx.workUnitFunction.create({
      data: {
        projectId, moduleName: input.moduleName, methodName: input.methodName,
        sheetName: clean(input.sheetName) ?? null, description: clean(input.description) ?? null, preCondition: clean(input.preCondition) ?? null,
        testRequirement: clean(input.testRequirement) ?? null, codeRef: clean(input.codeRef) ?? null, loc: input.loc ?? null,
        createdBy: clean(input.createdBy) ?? me, executedBy: clean(input.executedBy) ?? me, position: input.position ?? count,
      },
    });
    if (input.starter !== false) {
      await tx.workUnitRow.createMany({ data: STARTER_ROWS.map((r, i) => ({ functionId: f.id, section: r.section, groupName: r.groupName, value: r.value, position: i })) });
      const c = await tx.workUnitCase.create({ data: { functionId: f.id, position: 0, type: 'N' } });
      const pre = await tx.workUnitRow.findFirst({ where: { functionId: f.id, groupName: 'Precondition' }, select: { id: true } });
      if (pre) await tx.workUnitMark.create({ data: { rowId: pre.id, caseId: c.id } });
    }
    return f;
  });
  touch(projectId, userId);
  return getFunction(userId, projectId, fn.id);
}

async function findFunction(projectId: number, id: number) {
  const f = await prisma.workUnitFunction.findFirst({ where: { id, projectId }, select: { id: true, updatedAt: true } });
  if (!f) throw new NotFoundError('Function not found');
  return f;
}

export async function getFunction(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'project.view');
  const f = await prisma.workUnitFunction.findFirst({
    where: { id, projectId },
    select: {
      ...fnSelect,
      rows: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, section: true, groupName: true, label: true, value: true } },
      cases: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, type: true, result: true, executedAt: true, defectId: true, note: true, marks: { select: { rowId: true } } } },
    },
  });
  if (!f) throw new NotFoundError('Function not found');
  const meta = await loadMeta(projectId);
  const st = unitStats(f.cases);
  const req = requiredCases(f.loc, meta.tcPerKloc);
  return {
    ...f,
    updatedAt: f.updatedAt.toISOString(),
    cases: f.cases.map(({ marks, executedAt, ...c }) => ({ ...c, executedAt: iso(executedAt), rowIds: marks.map((m) => m.rowId) })),
    stats: st,
    tcPerKloc: meta.tcPerKloc,
    requiredCases: req,
    belowNorm: req !== null && st.total < req,
  };
}

export async function updateFunction(userId: number, projectId: number, id: number, input: Partial<FunctionInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  await findFunction(projectId, id);
  await prisma.workUnitFunction.update({
    where: { id },
    data: {
      ...(input.moduleName !== undefined ? { moduleName: input.moduleName } : {}),
      ...(input.methodName !== undefined ? { methodName: input.methodName } : {}),
      ...(input.sheetName !== undefined ? { sheetName: clean(input.sheetName) } : {}),
      ...(input.description !== undefined ? { description: clean(input.description) } : {}),
      ...(input.preCondition !== undefined ? { preCondition: clean(input.preCondition) } : {}),
      ...(input.testRequirement !== undefined ? { testRequirement: clean(input.testRequirement) } : {}),
      ...(input.codeRef !== undefined ? { codeRef: clean(input.codeRef) } : {}),
      ...(input.loc !== undefined ? { loc: input.loc } : {}),
      ...(input.createdBy !== undefined ? { createdBy: clean(input.createdBy) } : {}),
      ...(input.executedBy !== undefined ? { executedBy: clean(input.executedBy) } : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
    },
  });
  touch(projectId, userId);
  return getFunction(userId, projectId, id);
}

export async function deleteFunction(userId: number, projectId: number, id: number): Promise<DeleteOutcome> {
  await requireProject(userId, projectId, 'issue.edit');
  const f = await prisma.workUnitFunction.findFirst({ where: { id, projectId }, select: { moduleName: true, methodName: true, _count: { select: { cases: true } } } });
  if (!f) throw new NotFoundError('Function not found');
  const label = `Function ${f.moduleName}.${f.methodName} (${f._count.cases} UTCID)`;
  const queued = await gateDelete(userId, projectId, { kind: 'fpt.unit_delete', label, itemCount: 1, params: { id }, bulk: false });
  if (queued) return { deleted: false, queued };
  const trashId = await prisma.$transaction(async (tx) => {
    const t = await trashGraph(tx, { projectId, userId, kind: 'fpt.unit_function', label, itemCount: 1, roots: [{ table: 'work_unit_functions', ids: [id] }] });
    const r = await tx.workUnitFunction.deleteMany({ where: { id, projectId } });
    if (!r.count) throw new NotFoundError('Function not found');
    return t.trashId;
  }, { timeout: 30_000 });
  touch(projectId, userId);
  return { deleted: true, trashId };
}

export const matrixInput = z.object({
  /** updatedAt đã tải — lệch ⇒ 409 (người khác vừa lưu). Bỏ trống = ghi đè. */
  version: z.string().optional(),
  rows: z.array(z.object({
    key: z.string().min(1).max(40),
    section: z.enum(['COND', 'CONFIRM']),
    groupName: z.string().trim().min(1).max(120),
    label: z.string().max(200).nullable().optional(),
    value: z.string().max(4000).nullable().optional(),
  })).max(MAX_ROWS),
  cases: z.array(z.object({
    key: z.string().min(1).max(40),
    type: z.enum(CASE_TYPES),
    result: z.enum(CASE_RESULTS).nullable().optional(),
    executedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    defectId: z.string().trim().max(60).nullable().optional(),
    note: z.string().max(2000).nullable().optional(),
  })).max(MAX_CASES),
  marks: z.array(z.tuple([z.string(), z.string()])).max(MAX_ROWS * MAX_CASES),
});
export type MatrixInput = z.infer<typeof matrixInput>;

/** Ghi trọn ma trận một hàm trong MỘT transaction (dòng, test case, dấu O). Dùng chung cho lưu + nhập Excel + nhân bản. */
async function writeMatrix(tx: Prisma.TransactionClient, functionId: number, m: Pick<MatrixInput, 'rows' | 'cases' | 'marks'>) {
  const rowKeys = new Set<string>(), caseKeys = new Set<string>();
  for (const r of m.rows) { if (rowKeys.has(r.key)) throw new BadRequestError(`Duplicate row key ${r.key}`, 'VALIDATION_ERROR'); rowKeys.add(r.key); }
  for (const c of m.cases) { if (caseKeys.has(c.key)) throw new BadRequestError(`Duplicate case key ${c.key}`, 'VALIDATION_ERROR'); caseKeys.add(c.key); }
  await tx.workUnitRow.deleteMany({ where: { functionId } });
  await tx.workUnitCase.deleteMany({ where: { functionId } });
  const rowId = new Map<string, number>(), caseId = new Map<string, number>();
  // createManyAndReturn (Prisma 5.14+) giữ thứ tự ⇒ ghép key ↔ id theo vị trí.
  if (m.rows.length) {
    const made = await tx.workUnitRow.createManyAndReturn({
      data: m.rows.map((r, i) => ({ functionId, section: r.section, groupName: r.groupName.trim(), label: r.label?.trim() || null, value: r.value ?? null, position: i })),
      select: { id: true, position: true },
    });
    for (const x of made) rowId.set(m.rows[x.position].key, x.id);
  }
  if (m.cases.length) {
    const made = await tx.workUnitCase.createManyAndReturn({
      data: m.cases.map((c, i) => ({ functionId, position: i, type: c.type, result: c.result ?? null, executedAt: toDate(c.executedAt ?? null), defectId: c.defectId?.trim() || null, note: c.note?.trim() || null })),
      select: { id: true, position: true },
    });
    for (const x of made) caseId.set(m.cases[x.position].key, x.id);
  }
  const seen = new Set<string>();
  const marks = m.marks
    .filter(([rk, ck]) => rowId.has(rk) && caseId.has(ck) && !seen.has(`${rk}|${ck}`) && seen.add(`${rk}|${ck}`))
    .map(([rk, ck]) => ({ rowId: rowId.get(rk)!, caseId: caseId.get(ck)! }));
  if (marks.length) await tx.workUnitMark.createMany({ data: marks });
  await tx.workUnitFunction.update({ where: { id: functionId }, data: { updatedAt: new Date() } });
}

/** Khoá của client ⇒ id dòng/case đang có ("12" của AI, "r12"/"c12" của web; khoá mới "n…"/"rn…" ⇒ null). */
const keyId = (k: string) => { const m = /^[rc]?(\d+)$/.exec(k); return m ? Number(m[1]) : null; };
export const utcidOf = (i: number) => `UTCID${String(i + 1).padStart(2, '0')}`;

export async function saveMatrix(userId: number, projectId: number, id: number, input: MatrixInput) {
  await requireProject(userId, projectId, 'issue.edit');
  const f = await findFunction(projectId, id);
  if (input.version && new Date(input.version).getTime() !== f.updatedAt.getTime()) {
    throw new AppError('Someone else changed this function a moment ago. Reload to see their changes.', 409, 'WORK_STALE');
  }
  // Lưu thay trọn ⇒ UTCID / dòng không còn trong bản gửi lên là BỊ XOÁ. Cất chúng vào thùng rác trước.
  const before = await prisma.workUnitFunction.findUniqueOrThrow({
    where: { id },
    select: {
      moduleName: true, methodName: true,
      rows: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, section: true, groupName: true, label: true, value: true } },
      cases: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, type: true, result: true, executedAt: true, defectId: true, note: true, marks: { select: { rowId: true } } } },
    },
  });
  const keptRows = new Set(input.rows.map((r) => keyId(r.key)).filter((x): x is number => x !== null));
  const keptCases = new Set(input.cases.map((c) => keyId(c.key)).filter((x): x is number => x !== null));
  const marked = new Set(before.cases.flatMap((c) => c.marks.map((m) => m.rowId)));
  const goneCases = before.cases.map((c, i) => ({ c, i })).filter(({ c }) => !keptCases.has(c.id));
  // Dòng nháp trống, không ai đánh dấu ⇒ không đáng giữ.
  const goneRows = before.rows.filter((r) => !keptRows.has(r.id) && (r.value?.trim() || r.label?.trim() || marked.has(r.id)));
  if ((goneCases.length || goneRows.length) && isUnapprovedMachineCall()) {
    throw machineDeleteError(`${goneCases.length} UTCID(s) and ${goneRows.length} row(s)`, goneCases.length ? 'fpt_unit_delete_cases' : 'fpt_unit_delete_rows');
  }
  const fn = `${before.moduleName}.${before.methodName}`;
  const trashed = await prisma.$transaction(async (tx) => {
    let t: { id: number; cases: number; rows: number } | null = null;
    if (goneCases.length || goneRows.length) {
      const what = [
        goneCases.length ? `${goneCases.map(({ i }) => utcidOf(i)).slice(0, 8).join(', ')}${goneCases.length > 8 ? '…' : ''}` : '',
        goneRows.length ? `${goneRows.length} row(s)` : '',
      ].filter(Boolean).join(' + ');
      const trashId = await putInTrash(tx, {
        projectId, userId, kind: 'fpt.unit_cases', label: `${what} of ${fn}`, itemCount: goneCases.length + goneRows.length,
        payload: {
          functionId: id, moduleName: before.moduleName, methodName: before.methodName,
          rows: before.rows,
          cases: goneCases.map(({ c, i }) => ({ utcid: utcidOf(i), type: c.type, result: c.result, executedAt: iso(c.executedAt), defectId: c.defectId, note: c.note, rowIds: c.marks.map((m) => m.rowId) })),
          removedRows: goneRows.map((r) => r.id),
        },
      });
      t = { id: trashId, cases: goneCases.length, rows: goneRows.length };
    }
    await writeMatrix(tx, id, input);
    return t;
  }, { timeout: 20_000 });
  touch(projectId, userId);
  return { ...(await getFunction(userId, projectId, id)), trashed };
}

type UnitCasesPayload = {
  functionId?: number; moduleName?: string; methodName?: string;
  rows?: Array<{ id: number; section: string; groupName: string; label: string | null; value: string | null }>;
  cases?: Array<{ utcid?: string; type: string; result: string | null; executedAt: string | null; defectId: string | null; note: string | null; rowIds: number[] }>;
  removedRows?: number[];
};

/** Thùng rác ⇒ thêm lại UTCID / dòng đã mất vào CUỐI ma trận hiện tại (dòng trùng nội dung thì dùng dòng đang có). */
export async function restoreRemovedUnitCases(tx: Prisma.TransactionClient, projectId: number, raw: Record<string, unknown>): Promise<{ restored: number; notes: string[] }> {
  const p = raw as UnitCasesPayload;
  const f = await tx.workUnitFunction.findFirst({
    where: { id: Number(p.functionId), projectId },
    select: {
      moduleName: true, methodName: true,
      rows: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
      cases: { orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { marks: true } },
    },
  });
  if (!f) throw new AppError(`The function ${p.moduleName}.${p.methodName} is no longer there — restore the function from the trash first.`, 409, 'WORK_TRASH_MISSING_PARENT');
  const m: Pick<MatrixInput, 'rows' | 'cases' | 'marks'> = {
    rows: f.rows.map((r) => ({ key: String(r.id), section: r.section as 'COND' | 'CONFIRM', groupName: r.groupName, label: r.label, value: r.value })),
    cases: f.cases.map((c) => ({ key: String(c.id), type: c.type as 'N', result: (c.result as 'P' | 'F' | null) ?? null, executedAt: iso(c.executedAt), defectId: c.defectId, note: c.note })),
    marks: f.cases.flatMap((c) => c.marks.map((x) => [String(x.rowId), String(c.id)] as [string, string])),
  };
  const norm = (v: string | null | undefined) => (v ?? '').trim();
  const rowKey = new Map<number, string>();
  let addedRows = 0;
  const need = new Set<number>([...(p.cases ?? []).flatMap((c) => c.rowIds), ...(p.removedRows ?? [])]);
  for (const rid of need) {
    const snap = p.rows?.find((r) => r.id === rid);
    if (!snap) continue;
    const same = m.rows.find((r) => r.section === snap.section && r.groupName === snap.groupName && norm(r.label) === norm(snap.label) && norm(r.value) === norm(snap.value));
    if (same) { rowKey.set(rid, same.key); continue; }
    const key = `t${rid}`;
    m.rows.push({ key, section: snap.section as 'COND' | 'CONFIRM', groupName: snap.groupName, label: snap.label, value: snap.value });
    rowKey.set(rid, key);
    addedRows++;
  }
  (p.cases ?? []).forEach((c, i) => {
    const key = `tc${i}`;
    m.cases.push({ key, type: (CASE_TYPES as readonly string[]).includes(c.type) ? (c.type as 'N') : 'N', result: c.result === 'P' || c.result === 'F' ? c.result : null, executedAt: c.executedAt, defectId: c.defectId, note: c.note });
    for (const rid of c.rowIds) { const rk = rowKey.get(rid); if (rk) m.marks.push([rk, key]); }
  });
  if (m.rows.length > MAX_ROWS || m.cases.length > MAX_CASES) {
    throw new AppError(`Restoring would exceed ${MAX_ROWS} rows / ${MAX_CASES} test cases in ${f.moduleName}.${f.methodName}. Delete some first.`, 409, 'WORK_LIMIT');
  }
  await writeMatrix(tx, Number(p.functionId), m);
  const n = p.cases?.length ?? 0;
  return { restored: n + addedRows, notes: [`${n} UTCID(s)${addedRows ? ` and ${addedRows} row(s)` : ''} added back at the end of ${f.moduleName}.${f.methodName}`] };
}

export async function duplicateFunction(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const src = await getFunction(userId, projectId, id);
  if ((await prisma.workUnitFunction.count({ where: { projectId } })) >= MAX_FUNCTIONS) throw new BadRequestError(`A project can have at most ${MAX_FUNCTIONS} unit-tested functions`, 'WORK_LIMIT');
  const copy = await prisma.$transaction(async (tx) => {
    const f = await tx.workUnitFunction.create({
      data: {
        projectId, moduleName: src.moduleName, methodName: `${src.methodName} (copy)`.slice(0, 120), sheetName: null,
        description: src.description, preCondition: src.preCondition, testRequirement: src.testRequirement, codeRef: src.codeRef,
        loc: src.loc, createdBy: src.createdBy, executedBy: src.executedBy, position: src.position + 1,
      },
    });
    await writeMatrix(tx, f.id, {
      rows: src.rows.map((r) => ({ key: String(r.id), section: r.section as 'COND' | 'CONFIRM', groupName: r.groupName, label: r.label, value: r.value })),
      cases: src.cases.map((c) => ({ key: String(c.id), type: c.type as 'N', result: null, executedAt: null, defectId: null, note: c.note })),
      marks: src.cases.flatMap((c) => c.rowIds.map((r) => [String(r), String(c.id)] as [string, string])),
    });
    return f;
  }, { timeout: 20_000 });
  touch(projectId, userId);
  return getFunction(userId, projectId, copy.id);
}

// ─── Integration test ────────────────────────────────────────────

const roundSchema = z.object({
  status: z.enum(IT_STATUSES).nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  tester: z.string().trim().max(120).nullable(),
});
const roundsOf = (v: unknown): ItRound[] => {
  const r = z.array(roundSchema).max(MAX_ROUNDS).safeParse(v);
  return r.success ? r.data : [];
};

export async function listModules(userId: number, projectId: number, kind: ItKind = 'INT') {
  await requireProject(userId, projectId, 'project.view');
  const mods = await prisma.workItModule.findMany({
    where: { projectId, kind },
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    select: { id: true, name: true, sheetName: true, idPrefix: true, description: true, preCondition: true, testRequirement: true, position: true, updatedAt: true, cases: { select: { rounds: true } } },
  });
  const tot = { passed: 0, failed: 0, pending: 0, na: 0, total: 0 };
  const modules = mods.map(({ cases, ...m }) => {
    const st = itStats(cases.map((c) => ({ rounds: roundsOf(c.rounds) })));
    tot.passed += st.passed; tot.failed += st.failed; tot.pending += st.pending; tot.na += st.na; tot.total += st.total;
    return { ...m, updatedAt: m.updatedAt.toISOString(), stats: st };
  });
  return { modules, summary: { ...tot, ...itCoverage(tot) } };
}

export const moduleInput = z.object({
  name: z.string().trim().min(1).max(120),
  sheetName: z.string().trim().max(31).nullable().optional(),
  idPrefix: z.string().trim().regex(/^[A-Za-z]{1,10}$/, 'Use 1–10 letters, e.g. AT').optional(),
  description: z.string().max(4000).nullable().optional(),
  preCondition: z.string().max(4000).nullable().optional(),
  testRequirement: z.string().max(4000).nullable().optional(),
  position: z.number().int().min(0).max(100_000).optional(),
});

export async function createModule(userId: number, projectId: number, input: z.infer<typeof moduleInput>, kind: ItKind = 'INT') {
  await requireProject(userId, projectId, 'issue.edit');
  const count = await prisma.workItModule.count({ where: { projectId, kind } });
  if (count >= MAX_IT_MODULES) throw new BadRequestError(`A project can have at most ${MAX_IT_MODULES} ${kind === 'SYS' ? 'system test workflows' : 'integration modules'}`, 'WORK_LIMIT');
  const m = await prisma.workItModule.create({
    data: {
      projectId, kind, name: input.name, sheetName: clean(input.sheetName) ?? null, idPrefix: (input.idPrefix || defaultIdPrefix(input.name)).toUpperCase(),
      description: clean(input.description) ?? null, preCondition: clean(input.preCondition) ?? null, testRequirement: clean(input.testRequirement) ?? null,
      position: input.position ?? count,
    },
  });
  touch(projectId, userId);
  return getModule(userId, projectId, m.id);
}

export async function getModule(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'project.view');
  const m = await prisma.workItModule.findFirst({
    where: { id, projectId },
    select: {
      id: true, name: true, sheetName: true, idPrefix: true, description: true, preCondition: true, testRequirement: true, position: true, updatedAt: true, kind: true,
      cases: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
    },
  });
  if (!m) throw new NotFoundError('Module not found');
  const cases = m.cases.map((c) => ({
    id: c.id, section: c.section, description: c.description, procedure: c.procedure, testData: c.testData, expected: c.expected, actual: c.actual,
    preConditions: c.preConditions, evidence: c.evidence, note: c.note, rounds: roundsOf(c.rounds),
  }));
  return { ...m, updatedAt: m.updatedAt.toISOString(), cases, stats: itStats(cases) };
}

export async function updateModule(userId: number, projectId: number, id: number, input: Partial<z.infer<typeof moduleInput>>) {
  await requireProject(userId, projectId, 'issue.edit');
  const found = await prisma.workItModule.findFirst({ where: { id, projectId }, select: { id: true } });
  if (!found) throw new NotFoundError('Module not found');
  await prisma.workItModule.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.sheetName !== undefined ? { sheetName: clean(input.sheetName) } : {}),
      ...(input.idPrefix !== undefined ? { idPrefix: input.idPrefix.toUpperCase() } : {}),
      ...(input.description !== undefined ? { description: clean(input.description) } : {}),
      ...(input.preCondition !== undefined ? { preCondition: clean(input.preCondition) } : {}),
      ...(input.testRequirement !== undefined ? { testRequirement: clean(input.testRequirement) } : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
    },
  });
  touch(projectId, userId);
  return getModule(userId, projectId, id);
}

export async function deleteModule(userId: number, projectId: number, id: number): Promise<DeleteOutcome> {
  await requireProject(userId, projectId, 'issue.edit');
  const m = await prisma.workItModule.findFirst({ where: { id, projectId }, select: { name: true, kind: true, _count: { select: { cases: true } } } });
  if (!m) throw new NotFoundError('Module not found');
  const label = `${m.kind === 'SYS' ? 'System test workflow' : 'Integration module'} ${m.name} (${m._count.cases} case)`;
  const queued = await gateDelete(userId, projectId, { kind: 'fpt.it_delete', label, params: { id }, bulk: false });
  if (queued) return { deleted: false, queued };
  const trashId = await prisma.$transaction(async (tx) => {
    const t = await trashGraph(tx, { projectId, userId, kind: 'fpt.it_module', label, roots: [{ table: 'work_it_modules', ids: [id] }] });
    const r = await tx.workItModule.deleteMany({ where: { id, projectId } });
    if (!r.count) throw new NotFoundError('Module not found');
    return t.trashId;
  }, { timeout: 30_000 });
  touch(projectId, userId);
  return { deleted: true, trashId };
}

const txt = (max: number) => z.string().max(max).nullable().optional();
export const itCasesInput = z.object({
  version: z.string().optional(),
  cases: z.array(z.object({
    section: z.string().trim().max(200).nullable().optional(),
    description: z.string().trim().min(1, 'Every test case needs a description').max(4000),
    procedure: txt(8000), testData: txt(8000), expected: txt(8000), actual: txt(8000),
    preConditions: txt(4000), evidence: txt(2000), note: txt(4000),
    rounds: z.array(roundSchema).max(MAX_ROUNDS).optional(),
  })).max(MAX_IT_CASES),
});

async function writeItCases(tx: Prisma.TransactionClient, moduleId: number, cases: ItCaseData[]) {
  await tx.workItCase.deleteMany({ where: { moduleId } });
  if (cases.length) {
    await tx.workItCase.createMany({
      data: cases.map((c, i) => ({
        moduleId, position: i, section: c.section?.trim() || null, description: c.description.trim(),
        procedure: c.procedure?.trim() || null, testData: c.testData?.trim() || null, expected: c.expected?.trim() || null,
        actual: c.actual?.trim() || null, preConditions: c.preConditions?.trim() || null, evidence: c.evidence?.trim() || null,
        note: c.note?.trim() || null, rounds: (c.rounds ?? []).slice(0, MAX_ROUNDS) as unknown as Prisma.InputJsonValue,
      })),
    });
  }
  await tx.workItModule.update({ where: { id: moduleId }, data: { updatedAt: new Date() } });
}

export async function saveItCases(userId: number, projectId: number, id: number, input: z.infer<typeof itCasesInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  const m = await prisma.workItModule.findFirst({ where: { id, projectId }, select: { updatedAt: true, kind: true } });
  if (!m) throw new NotFoundError('Module not found');
  const maxR = roundsMax(m.kind);
  if (input.cases.some((c) => (c.rounds?.length ?? 0) > maxR)) throw new BadRequestError(`This report has at most ${maxR} test rounds`, 'VALIDATION_ERROR');
  if (input.version && new Date(input.version).getTime() !== m.updatedAt.getTime()) {
    throw new AppError('Someone else changed this module a moment ago. Reload to see their changes.', 409, 'WORK_STALE');
  }
  const cases: ItCaseData[] = input.cases.map((c) => ({
    section: c.section ?? null, description: c.description, procedure: c.procedure ?? null, testData: c.testData ?? null, expected: c.expected ?? null,
    actual: c.actual ?? null, preConditions: c.preConditions ?? null, evidence: c.evidence ?? null, note: c.note ?? null, rounds: c.rounds ?? [],
  }));
  // Case không có id trong bản gửi ⇒ chỉ biết "bớt case" khi số case GIẢM; case mất = case cũ không còn bản nào cùng nội dung.
  const old = await prisma.workItCase.findMany({ where: { moduleId: id }, orderBy: [{ position: 'asc' }, { id: 'asc' }] });
  let gone: typeof old = [];
  if (cases.length < old.length) {
    const left = new Map<string, number>();
    for (const c of cases) left.set(itSig(c), (left.get(itSig(c)) ?? 0) + 1);
    gone = old.filter((c) => { const k = itSig(c); const n = left.get(k) ?? 0; if (n > 0) { left.set(k, n - 1); return false; } return true; });
  }
  if (gone.length && isUnapprovedMachineCall()) throw machineDeleteError(`${gone.length} test case(s)`, 'fpt_it_delete_cases');
  const mod = gone.length ? await prisma.workItModule.findUniqueOrThrow({ where: { id }, select: { name: true, idPrefix: true } }) : null;
  const trashed = await prisma.$transaction(async (tx) => {
    let t: { id: number; cases: number } | null = null;
    if (gone.length && mod) {
      const trashId = await putInTrash(tx, {
        projectId, userId, kind: 'fpt.it_cases', label: `${gone.length} test case(s) of ${m.kind === 'SYS' ? 'workflow' : 'module'} ${mod.name}`, itemCount: gone.length,
        payload: { moduleId: id, kind: m.kind, name: mod.name, cases: gone.map((c) => ({ ...itData(c), position: c.position })) },
      });
      t = { id: trashId, cases: gone.length };
    }
    await writeItCases(tx, id, cases);
    return t;
  }, { timeout: 20_000 });
  touch(projectId, userId);
  return { ...(await getModule(userId, projectId, id)), trashed };
}

const itData = (c: { section: string | null; description: string; procedure: string | null; testData: string | null; expected: string | null; actual: string | null; preConditions: string | null; evidence: string | null; note: string | null; rounds: unknown }): ItCaseData => ({
  section: c.section, description: c.description, procedure: c.procedure, testData: c.testData, expected: c.expected, actual: c.actual,
  preConditions: c.preConditions, evidence: c.evidence, note: c.note, rounds: Array.isArray(c.rounds) ? roundsOf(c.rounds) : [],
});
const itSig = (c: { section?: string | null; description: string; procedure?: string | null; testData?: string | null; expected?: string | null }) =>
  JSON.stringify([(c.section ?? '').trim(), c.description.trim(), (c.procedure ?? '').trim(), (c.testData ?? '').trim(), (c.expected ?? '').trim()]);

/** Thùng rác ⇒ thêm lại case 5.2/5.3 đã mất vào CUỐI module (case cùng nội dung đã có ⇒ bỏ qua, không nhân đôi). */
export async function restoreRemovedItCases(tx: Prisma.TransactionClient, projectId: number, raw: Record<string, unknown>): Promise<{ restored: number; notes: string[] }> {
  const p = raw as { moduleId?: number; name?: string; cases?: ItCaseData[] };
  const mod = await tx.workItModule.findFirst({ where: { id: Number(p.moduleId), projectId }, select: { id: true, name: true, kind: true } });
  if (!mod) throw new AppError(`${p.name ?? 'The module'} is no longer there — restore it from the trash first.`, 409, 'WORK_TRASH_MISSING_PARENT');
  const cur = (await tx.workItCase.findMany({ where: { moduleId: mod.id }, orderBy: [{ position: 'asc' }, { id: 'asc' }] })).map(itData);
  const have = new Set(cur.map(itSig));
  const add = (p.cases ?? []).filter((c) => c?.description && !have.has(itSig(c))).map((c) => ({ ...itData(c), rounds: (c.rounds ?? []).slice(0, roundsMax(mod.kind)) }));
  if (cur.length + add.length > MAX_IT_CASES) throw new AppError(`Restoring would exceed ${MAX_IT_CASES} test cases in ${mod.name}.`, 409, 'WORK_LIMIT');
  if (add.length) await writeItCases(tx, mod.id, [...cur, ...add]);
  const skipped = (p.cases?.length ?? 0) - add.length;
  return { restored: add.length, notes: [`${add.length} test case(s) added back at the end of ${mod.name}${skipped ? ` (${skipped} already there)` : ''}`] };
}

// ─── Xuất Excel ──────────────────────────────────────────────────

async function exportChanges(projectId: number, report: 'UNIT' | 'INT' | 'SYS'): Promise<ChangeData[]> {
  const rows = await prisma.workFptChange.findMany({ where: { projectId, report }, orderBy: [{ position: 'asc' }, { id: 'asc' }] });
  return rows.map((c) => ({ effectiveDate: iso(c.effectiveDate)!, version: c.version, changeItem: c.changeItem, action: c.action, description: c.description, reference: c.reference }));
}

export async function loadUnitFunctions(projectId: number, moduleName?: string): Promise<UnitFunctionData[]> {
  const fns = await prisma.workUnitFunction.findMany({
    where: { projectId, ...(moduleName ? { moduleName } : {}) },
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    include: {
      rows: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
      cases: { orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { marks: true } },
    },
  });
  return fns.map((f) => ({
    moduleName: f.moduleName, methodName: f.methodName, sheetName: f.sheetName, description: f.description, preCondition: f.preCondition,
    testRequirement: f.testRequirement, codeRef: f.codeRef, loc: f.loc, createdBy: f.createdBy, executedBy: f.executedBy,
    rows: f.rows.map((r) => ({ key: String(r.id), section: r.section as 'COND' | 'CONFIRM', groupName: r.groupName, label: r.label, value: r.value })),
    cases: f.cases.map((c) => ({ key: String(c.id), type: c.type as 'N', result: (c.result as 'P' | 'F' | null) ?? null, executedAt: iso(c.executedAt), defectId: c.defectId, note: c.note })),
    marks: f.cases.flatMap((c) => c.marks.map((m) => [String(m.rowId), String(c.id)] as [string, string])),
  }));
}

export async function loadItModules(projectId: number, kind: ItKind = 'INT'): Promise<ItModuleData[]> {
  const mods = await prisma.workItModule.findMany({
    where: { projectId, kind }, orderBy: [{ position: 'asc' }, { id: 'asc' }],
    include: { cases: { orderBy: [{ position: 'asc' }, { id: 'asc' }] } },
  });
  return mods.map((m) => ({
    name: m.name, sheetName: m.sheetName, idPrefix: m.idPrefix, description: m.description, preCondition: m.preCondition, testRequirement: m.testRequirement,
    cases: m.cases.map((c) => ({
      section: c.section, description: c.description, procedure: c.procedure, testData: c.testData, expected: c.expected, actual: c.actual,
      preConditions: c.preConditions, evidence: c.evidence, note: c.note, rounds: roundsOf(c.rounds),
    })),
  }));
}

const fileSafe = (s: string) => s.replace(/[^\p{L}\p{N}._-]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'Project';

export async function exportReport(userId: number, projectId: number, report: 'unit' | 'integration' | 'system', opts: { module?: string } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const meta = await loadMeta(projectId);
  if (report === 'unit') {
    const functions = await loadUnitFunctions(projectId, opts.module);
    const sheets = buildUnitSheets({ meta, changes: await exportChanges(projectId, 'UNIT'), functions });
    return { file: `${fileSafe(meta.projectCode)}_Report5.1_Unit_Test_Report.xlsx`, buffer: writeXlsx(sheets, { title: `${meta.projectCode} — Unit Test Report` }), count: functions.length };
  }
  if (report === 'system') {
    const workflows = (await loadItModules(projectId, 'SYS')).map((m) => ({ ...m, cases: m.cases.map((c) => ({ ...c, rounds: c.rounds.slice(0, SYS_ROUNDS) })) }));
    const sheets = buildSystemSheets({ meta, changes: await exportChanges(projectId, 'SYS'), workflows });
    return { file: `${fileSafe(meta.projectCode)}_Report5.3_System_Test_Report.xlsx`, buffer: writeXlsx(sheets, { title: `${meta.projectCode} — System Test Report` }), count: workflows.length };
  }
  const modules = await loadItModules(projectId);
  const sheets = buildIntegrationSheets({ meta, changes: await exportChanges(projectId, 'INT'), modules });
  return { file: `${fileSafe(meta.projectCode)}_Report5.2_Integration_Test_Report.xlsx`, buffer: writeXlsx(sheets, { title: `${meta.projectCode} — Integration Test Report` }), count: modules.length };
}

// ─── Nhập Excel ──────────────────────────────────────────────────

export interface ImportResult {
  report: 'unit' | 'integration' | 'system';
  dryRun: boolean;
  mode: 'append' | 'replace';
  functions?: number;
  modules?: number;
  cases: number;
  changes: number;
  warnings: string[];
  preview: Array<{ name: string; module?: string; cases: number; rows?: number }>;
  /** "Thay thế" sẽ xoá bao nhiêu thứ đang có (hàm/module của báo cáo này + Record of change của nó) — dryRun cũng trả. */
  replaceDeletes?: { items: number; changes: number };
  /** Người gọi KHÔNG được thay thế ngay (không phải ADMIN dự án, hoặc là AI/token) ⇒ "Thay thế" thành yêu cầu chờ duyệt. */
  replaceNeedsApproval?: boolean;
  /** Đã xếp hàng chờ trưởng nhóm duyệt — CHƯA nhập/xoá gì. */
  queued?: QueuedRequest;
  /** Thay thế đã chạy: mục thùng rác giữ toàn bộ dữ liệu cũ. */
  trashId?: number;
}

/** Số thứ "Thay thế" sẽ xoá + người gọi có được thay ngay không. */
async function replaceImpact(userId: number, projectId: number, report: 'unit' | 'integration' | 'system') {
  const kind: ItKind = report === 'system' ? 'SYS' : 'INT';
  const docReport = report === 'unit' ? 'UNIT' : kind;
  const [items, changes, access] = await Promise.all([
    report === 'unit' ? prisma.workUnitFunction.count({ where: { projectId } }) : prisma.workItModule.count({ where: { projectId, kind } }),
    prisma.workFptChange.count({ where: { projectId, report: docReport } }),
    loadProjectAccess(userId, projectId),
  ]);
  const needsApproval = items + changes > 0 && (isUnapprovedMachineCall() || !access || !can(access.role, 'project.settings'));
  return { items, changes, needsApproval };
}

/** Gửi lên trước khi xoá: ADMIN phải gõ số mục; thành viên / AI ⇒ yêu cầu chờ duyệt (kèm đúng tệp). */
async function gateReplace(userId: number, projectId: number, report: 'unit' | 'integration' | 'system', buf: Buffer, confirm: unknown) {
  const imp = await replaceImpact(userId, projectId, report);
  if (!imp.items && !imp.changes) return { imp, queued: null };
  const what = report === 'unit' ? 'unit-tested function(s)' : report === 'system' ? 'system test workflow(s)' : 'integration module(s)';
  const queued = await gateDelete(userId, projectId, {
    kind: 'fpt.import_replace', label: `Excel import "Replace" — deletes ${imp.items} ${what} + ${imp.changes} change record(s)`,
    itemCount: imp.items, params: { report }, file: buf, bulk: true, confirm, expectConfirm: imp.items,
  });
  return { imp, queued };
}

export async function importReport(
  userId: number, projectId: number, buf: Buffer,
  opts: { report?: 'unit' | 'integration' | 'system' | 'auto'; mode?: 'append' | 'replace'; dryRun?: boolean; confirm?: unknown },
): Promise<ImportResult> {
  await requireProject(userId, projectId, 'issue.edit');
  if (buf.length > MAX_IMPORT_BYTES) throw new BadRequestError(`The file is larger than ${mbText(MAX_IMPORT_BYTES)}`, 'WORK_IMPORT_TOO_LARGE');
  let sheets;
  try { sheets = readXlsx(buf); } catch { throw new BadRequestError('This is not an .xlsx file (Excel 2007+). Save it as .xlsx and try again.', 'WORK_IMPORT_BAD_FILE'); }
  const detected = detectReport(sheets);
  const report = !opts.report || opts.report === 'auto' ? detected : opts.report;
  if (!report) throw new BadRequestError('Could not find a unit test matrix (UTCID…) or an integration/system test sheet (Test Case ID) in this file.', 'WORK_IMPORT_UNRECOGNISED');
  const mode = opts.mode ?? 'append';
  const dryRun = !!opts.dryRun;

  if (report === 'unit') {
    const parsed = parseUnitWorkbook(sheets);
    const fns = parsed.functions.slice(0, MAX_FUNCTIONS);
    if (parsed.functions.length > MAX_FUNCTIONS) parsed.warnings.push(`Only the first ${MAX_FUNCTIONS} functions were imported`);
    for (const f of fns) {
      if (f.rows.length > MAX_ROWS) { parsed.warnings.push(`${f.methodName}: only the first ${MAX_ROWS} rows kept`); f.rows = f.rows.slice(0, MAX_ROWS); }
      if (f.cases.length > MAX_CASES) { parsed.warnings.push(`${f.methodName}: only the first ${MAX_CASES} test cases kept`); f.cases = f.cases.slice(0, MAX_CASES); }
    }
    const result: ImportResult = {
      report, dryRun, mode, functions: fns.length, cases: fns.reduce((s, f) => s + f.cases.length, 0), changes: parsed.cover.changes.length,
      warnings: parsed.warnings.slice(0, 50), preview: fns.slice(0, 200).map((f) => ({ name: f.methodName, module: f.moduleName, cases: f.cases.length, rows: f.rows.length })),
    };
    if (dryRun) {
      const imp = await replaceImpact(userId, projectId, 'unit');
      return { ...result, replaceDeletes: { items: imp.items, changes: imp.changes }, replaceNeedsApproval: imp.needsApproval };
    }
    const existing = mode === 'append' ? await prisma.workUnitFunction.count({ where: { projectId } }) : 0;
    if (existing + fns.length > MAX_FUNCTIONS) throw new BadRequestError(`This would exceed ${MAX_FUNCTIONS} functions — use "Replace" or remove some first`, 'WORK_LIMIT');
    if (mode === 'replace') {
      const g = await gateReplace(userId, projectId, 'unit', buf, opts.confirm);
      if (g.queued) return { ...result, replaceDeletes: { items: g.imp.items, changes: g.imp.changes }, replaceNeedsApproval: true, queued: g.queued };
    }
    let trashId: number | undefined;
    await prisma.$transaction(async (tx) => {
      if (mode === 'replace') {
        // Sự cố 22/10/2026: TOÀN BỘ hàm cũ vào thùng rác (một mục) TRƯỚC khi xoá — khôi phục y nguyên, giữ id.
        const fnIds = (await tx.workUnitFunction.findMany({ where: { projectId }, select: { id: true } })).map((x) => x.id);
        const chIds = (await tx.workFptChange.findMany({ where: { projectId, report: 'UNIT' }, select: { id: true } })).map((x) => x.id);
        if (fnIds.length || chIds.length) {
          trashId = (await trashGraph(tx, {
            projectId, userId, kind: 'fpt.import_replace', itemCount: fnIds.length,
            label: `Excel import "Replace" (5.1) — ${fnIds.length} function(s) + ${chIds.length} change record(s) before the import`,
            roots: [{ table: 'work_unit_functions', ids: fnIds }, { table: 'work_fpt_changes', ids: chIds }],
          })).trashId;
        }
        await tx.workUnitFunction.deleteMany({ where: { projectId } });
        await tx.workFptChange.deleteMany({ where: { projectId, report: 'UNIT' } });
      }
      await applyCover(tx, projectId, parsed.cover, { reviewer: parsed.reviewer, notes: parsed.notes, environment: parsed.environment, tcPerKloc: parsed.tcPerKloc }, 'UNIT', mode);
      let pos = existing;
      for (const f of fns) {
        const made = await tx.workUnitFunction.create({
          data: {
            projectId, moduleName: f.moduleName.slice(0, 120) || 'Module', methodName: f.methodName.slice(0, 120) || 'function', sheetName: f.sheetName?.slice(0, 31) || null,
            description: f.description, preCondition: f.preCondition, testRequirement: f.testRequirement, codeRef: null, loc: f.loc,
            createdBy: f.createdBy?.slice(0, 120) || null, executedBy: f.executedBy?.slice(0, 120) || null, position: pos++,
          },
        });
        await writeMatrix(tx, made.id, {
          rows: f.rows.map((r) => ({ ...r, groupName: r.groupName.slice(0, 120) || 'Input', label: r.label?.slice(0, 200) ?? null, value: r.value?.slice(0, 4000) ?? null })),
          cases: f.cases, marks: f.marks,
        });
      }
    }, { timeout: 120_000 });
    touch(projectId, userId);
    return { ...result, ...(trashId ? { trashId } : {}) };
  }

  const kind: ItKind = report === 'system' ? 'SYS' : 'INT';
  const docReport = kind === 'SYS' ? 'SYS' : 'INT';
  const parsed = parseIntegrationWorkbook(sheets, { system: kind === 'SYS' });
  const mods = parsed.modules.slice(0, MAX_IT_MODULES);
  for (const m of mods) if (m.cases.length > MAX_IT_CASES) { parsed.warnings.push(`${m.name}: only the first ${MAX_IT_CASES} test cases kept`); m.cases = m.cases.slice(0, MAX_IT_CASES); }
  const maxR = roundsMax(kind);
  for (const m of mods) for (const c of m.cases) if (c.rounds.length > maxR) c.rounds = c.rounds.slice(0, maxR);
  const result: ImportResult = {
    report, dryRun, mode, modules: mods.length, cases: mods.reduce((s, m) => s + m.cases.length, 0), changes: parsed.cover.changes.length,
    warnings: parsed.warnings.slice(0, 50), preview: mods.map((m) => ({ name: m.name, cases: m.cases.length })),
  };
  if (dryRun) {
    const imp = await replaceImpact(userId, projectId, report);
    return { ...result, replaceDeletes: { items: imp.items, changes: imp.changes }, replaceNeedsApproval: imp.needsApproval };
  }
  const existing = mode === 'append' ? await prisma.workItModule.count({ where: { projectId, kind } }) : 0;
  if (existing + mods.length > MAX_IT_MODULES) throw new BadRequestError(`This would exceed ${MAX_IT_MODULES} modules — use "Replace" or remove some first`, 'WORK_LIMIT');
  if (mode === 'replace') {
    const g = await gateReplace(userId, projectId, report, buf, opts.confirm);
    if (g.queued) return { ...result, replaceDeletes: { items: g.imp.items, changes: g.imp.changes }, replaceNeedsApproval: true, queued: g.queued };
  }
  let trashId: number | undefined;
  await prisma.$transaction(async (tx) => {
    if (mode === 'replace') {
      const modIds = (await tx.workItModule.findMany({ where: { projectId, kind }, select: { id: true } })).map((x) => x.id);
      const chIds = (await tx.workFptChange.findMany({ where: { projectId, report: docReport }, select: { id: true } })).map((x) => x.id);
      if (modIds.length || chIds.length) {
        trashId = (await trashGraph(tx, {
          projectId, userId, kind: 'fpt.import_replace', itemCount: modIds.length,
          label: `Excel import "Replace" (${kind === 'SYS' ? '5.3' : '5.2'}) — ${modIds.length} ${kind === 'SYS' ? 'workflow' : 'module'}(s) + ${chIds.length} change record(s) before the import`,
          roots: [{ table: 'work_it_modules', ids: modIds }, { table: 'work_fpt_changes', ids: chIds }],
        })).trashId;
      }
      await tx.workItModule.deleteMany({ where: { projectId, kind } });
      await tx.workFptChange.deleteMany({ where: { projectId, report: docReport } });
    }
    await applyCover(tx, projectId, parsed.cover, { reviewer: parsed.reviewer, notes: parsed.notes, environment: parsed.environment, tcPerKloc: null }, docReport, mode);
    let pos = existing;
    for (const m of mods) {
      const made = await tx.workItModule.create({
        data: {
          projectId, kind, name: m.name.slice(0, 120) || 'Module', sheetName: m.sheetName?.slice(0, 31) || null, idPrefix: (m.idPrefix || defaultIdPrefix(m.name)).slice(0, 10),
          description: m.description, preCondition: m.preCondition, testRequirement: m.testRequirement, position: pos++,
        },
      });
      await writeItCases(tx, made.id, m.cases.map((c) => ({ ...c, description: c.description.slice(0, 4000) })));
    }
  }, { timeout: 120_000 });
  touch(projectId, userId);
  return { ...result, ...(trashId ? { trashId } : {}) };
}

/** Cover: chỉ điền chỗ CÒN TRỐNG khi "append"; "replace" thì lấy theo tệp. Record of change thêm vào cuối. */
async function applyCover(
  tx: Prisma.TransactionClient, projectId: number,
  cover: { projectName: string | null; projectCode: string | null; creator: string | null; issueDate: string | null; version: string | null; changes: ChangeData[] },
  extra: { reviewer: string | null; notes: string | null; environment: string | null; tcPerKloc: number | null },
  report: 'UNIT' | 'INT' | 'SYS', mode: 'append' | 'replace',
) {
  const cur = await tx.workFptTestDoc.findUnique({ where: { projectId } });
  const pick = <T,>(now: T | null | undefined, incoming: T | null | undefined) => (mode === 'replace' ? (incoming ?? now ?? null) : (now ?? incoming ?? null));
  const versionIn = cover.version && /^\d+(\.\d+)?$/.test(cover.version) && !cover.version.includes('.') ? `${cover.version}.0` : cover.version;
  const data = {
    projectName: pick(cur?.projectName, cover.projectName?.slice(0, 200)),
    projectCode: pick(cur?.projectCode, cover.projectCode?.slice(0, 40)),
    creator: pick(cur?.creator, cover.creator?.slice(0, 120)),
    reviewer: pick(cur?.reviewer, extra.reviewer?.slice(0, 120)),
    environment: pick(cur?.environment, extra.environment),
    version: (mode === 'replace' ? versionIn : cur?.version ?? versionIn)?.slice(0, 20) || '1.0',
    ...(report === 'UNIT'
      ? { unitIssueDate: pick(cur?.unitIssueDate, toDate(cover.issueDate)), unitNotes: pick(cur?.unitNotes, extra.notes), ...(extra.tcPerKloc ? { tcPerKloc: mode === 'replace' || !cur ? extra.tcPerKloc : cur.tcPerKloc } : {}) }
      : report === 'SYS'
        ? { sysIssueDate: pick(cur?.sysIssueDate, toDate(cover.issueDate)), sysNotes: pick(cur?.sysNotes, extra.notes) }
        : { intIssueDate: pick(cur?.intIssueDate, toDate(cover.issueDate)), intNotes: pick(cur?.intNotes, extra.notes) }),
  };
  await tx.workFptTestDoc.upsert({ where: { projectId }, create: { projectId, ...data }, update: data });
  if (cover.changes.length) {
    const start = await tx.workFptChange.count({ where: { projectId, report } });
    await tx.workFptChange.createMany({
      data: cover.changes.slice(0, 200).map((c, i) => ({
        projectId, report, effectiveDate: toDate(c.effectiveDate)!, version: c.version.slice(0, 20), changeItem: c.changeItem?.slice(0, 200) ?? null,
        action: c.action, description: c.description, reference: c.reference?.slice(0, 300) ?? null, position: start + i,
      })),
    });
  }
}

// ─── AI gợi ý điều kiện / biên (có trần) ─────────────────────────

let askOverride: ((system: string, user: string) => Promise<string>) | null = null;
/** CHỈ cho test: thay lời gọi model. */
export function _setFptAskForTests(fn: ((system: string, user: string) => Promise<string>) | null): void { askOverride = fn; }

const aiOut = z.object({
  conditions: z.array(z.object({ group: z.string(), label: z.string().nullable().optional(), value: z.string() })).max(40).default([]),
  confirmations: z.array(z.object({ group: z.string(), label: z.string().nullable().optional(), value: z.string() })).max(30).default([]),
  cases: z.array(z.object({
    type: z.enum(CASE_TYPES),
    title: z.string().optional(),
    conditions: z.array(z.number().int().min(0)).max(40).default([]),
    confirmations: z.array(z.number().int().min(0)).max(30).default([]),
  })).max(30).default([]),
  notes: z.string().optional(),
});
export type AiSuggestion = z.infer<typeof aiOut>;

const AI_SYSTEM = `You design unit test cases in the FPT University "Report 5.1 Unit Test" format.
A function's test matrix has CONDITION rows (Precondition + one group per input parameter, one row per concrete value) and CONFIRMATION rows (groups "Return", "Exception", "Log message").
Each test case (UTCID) marks the rows that apply and has a type: N (normal), A (abnormal: invalid/null/wrong type/not found/unauthorised), B (boundary: min/max length, 0, limits, just inside/outside a range).
Rules:
- Use concrete values (e.g. "a@b.co", "", null, 255-character string), never placeholders like "valid value".
- Every case marks exactly one value per input group, and at least one confirmation.
- Cover every input with at least one A and one B case where it makes sense; 6–16 cases total.
- Reply with JSON only: {"conditions":[{"group","label","value"}],"confirmations":[{"group","label","value"}],"cases":[{"type","title","conditions":[indexes into conditions],"confirmations":[indexes into confirmations]}],"notes":"short"}.
- "label" is a short hint shown next to the value (e.g. "with space", "255 characters"); may be null.
- Write in the same language as the function description (English if unclear).`;

export async function aiSuggest(userId: number, projectId: number, id: number, input: { signature?: string | null; extra?: string | null }) {
  await requireProject(userId, projectId, 'issue.edit');
  const f = await getFunction(userId, projectId, id);
  const existing = f.rows.map((r) => `${r.section === 'COND' ? 'Condition' : 'Confirm'} › ${r.groupName}${r.label ? ` (${r.label})` : ''}: ${r.value ?? ''}`).join('\n').slice(0, 3000);
  const user = [
    `Module/class: ${f.moduleName}`,
    `Function: ${f.methodName}`,
    input.signature?.trim() ? `Signature / code:\n${input.signature.trim().slice(0, 4000)}` : '',
    f.description ? `Description: ${f.description.slice(0, 2000)}` : '',
    f.preCondition ? `Pre-condition: ${f.preCondition.slice(0, 1000)}` : '',
    f.testRequirement ? `Test requirement: ${f.testRequirement.slice(0, 2000)}` : '',
    existing ? `Rows already in the matrix (avoid duplicates):\n${existing}` : '',
    input.extra?.trim() ? `Extra instructions: ${input.extra.trim().slice(0, 1000)}` : '',
  ].filter(Boolean).join('\n\n');

  let text: string;
  if (askOverride) text = await askOverride(AI_SYSTEM, user);
  else {
    if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
    // 22/10/2026: cửa chung của CT Work — hạn mức + tài trợ Pro (aiTaiTro) và chuỗi cổng rambo → chính hãng → modelapi (aiCong).
    await kiemHanMucAi(userId, projectId);
    const r = await goiAiCtWork({
      step: 'report', system: AI_SYSTEM, messages: [{ role: 'user', content: user }], maxTokens: 2000,
      userId, feature: 'work', purpose: 'work_assistant', timeoutMs: 90_000, maxRetries: 1,
    });
    text = r.text;
  }
  let parsed: AiSuggestion;
  try {
    parsed = aiOut.parse(extractJson(text));
  } catch {
    throw new AppError('The AI reply could not be read. Try again.', 502, 'WORK_AI_BAD_REPLY');
  }
  // Bỏ chỉ số trỏ ra ngoài mảng — không để model bịa dòng không tồn tại.
  parsed.cases = parsed.cases
    .map((c) => ({ ...c, conditions: c.conditions.filter((i) => i < parsed.conditions.length), confirmations: c.confirmations.filter((i) => i < parsed.confirmations.length) }))
    .filter((c) => c.conditions.length || c.confirmations.length);
  return parsed;
}

export { defaultSheetName };
