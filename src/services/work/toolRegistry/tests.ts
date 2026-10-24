/**
 * Registry lệnh — KIỂM THỬ (đợt 3C): Report 5.1 Unit (ma trận UTCID), 5.2 Integration, 5.3 System (đợt 3B) và test
 * case/cycle/run kiểu Xray. Mỗi lệnh: `projectFor` với tuyến REST tương đương (rào chắn agent + cổng khách y như REST)
 * rồi gọi THẲNG fptTests.service / tests.service — cùng hàm, cùng quyền (đọc = project.view, ghi = issue.edit),
 * cùng khoá lạc quan (ma trận ghi trọn bằng saveMatrix với `version` vừa đọc ⇒ người khác vừa lưu ⇒ 409, không đè).
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { projectFor, requirePerson, requireWrite, type McpCtx } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { projectArg } from '../../../mcp/tools/read.js';
import * as fpt from '../fptTests.service.js';
import { CASE_RESULTS, CASE_TYPES, IT_STATUSES, MAX_ROUNDS, SYS_ROUNDS } from '../fptTests.js';
import * as tests from '../tests.service.js';
import { defineTool, mcpOnly, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const dateArg = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD');
const today = () => new Date().toISOString().slice(0, 10);
const fold = (s: string | null | undefined) => (s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

// ─── 5.1 Unit test: tham chiếu hàm / dòng / UTCID ─────────────────

const fnArg = z.union([z.number().int().positive(), z.string().min(1).max(250)])
  .describe('Function id from fpt_unit_list, or "Module.method" / "method"');

/** id hàm từ số, "12", "Module.method" hoặc "method" (phải duy nhất). Không thấy ⇒ 404 kèm gợi ý. */
export async function functionIdOf(projectId: number, ref: number | string): Promise<number> {
  if (typeof ref === 'number') return ref;
  const s = ref.trim();
  if (/^\d+$/.test(s)) return Number(s);
  const all = await prisma.workUnitFunction.findMany({ where: { projectId }, select: { id: true, moduleName: true, methodName: true }, take: 600 });
  const dot = s.lastIndexOf('.');
  const hits = dot > 0
    ? all.filter((f) => fold(f.moduleName) === fold(s.slice(0, dot)) && fold(f.methodName) === fold(s.slice(dot + 1)))
    : all.filter((f) => fold(f.methodName) === fold(s));
  if (hits.length === 1) return hits[0].id;
  if (hits.length > 1) throw new AppError(`Several functions are called "${s}" — use the id or "Module.method"`, 400, 'WORK_AMBIGUOUS', { ids: hits.map((h) => h.id) });
  throw new NotFoundError(`Unit-tested function "${s}" not found — call fpt_unit_list`);
}

const rowRef = z.union([
  z.number().int().positive().describe('Row id from the LATEST fpt_unit_get / tool result (row ids change after every save)'),
  z.object({ group: z.string().min(1).max(120), value: z.string().max(4000).nullable().optional() }).describe('Row by group + value'),
]);
const caseRef = z.union([z.number().int().positive(), z.string().min(1).max(20)])
  .describe('UTCID like "UTCID03" (or 3 = the 3rd case)');

type Fn = Awaited<ReturnType<typeof fpt.getFunction>>;
type MatrixRow = fpt.MatrixInput['rows'][number];
type MatrixCase = fpt.MatrixInput['cases'][number];
interface Matrix { version: string; rows: MatrixRow[]; cases: MatrixCase[]; marks: Array<[string, string]> }

const MAX_CASES_ARG = 200;
/** Gợi ý máy sinh (ngoài khối untrusted) — model tìm ra lệnh sửa/xoá (sự cố 21/10: "không có tool xoá/ẩn UTCID"). */
const UNIT_HINT = 'Edit this sheet: header fields (Executed By, Created By, LOC, description…) ⇒ fpt_unit_update_function · results/type/date ⇒ fpt_unit_record_results · '
  + 'remove/delete/hide UTCIDs ⇒ fpt_unit_delete_cases (notRun=true = all draft UTCIDs) · remove rows ⇒ fpt_unit_delete_rows (unused=true) · edit rows ⇒ fpt_unit_update_rows · reorder ⇒ fpt_unit_move.';
const utcid = (i: number) => `UTCID${String(i + 1).padStart(2, '0')}`;

function toMatrix(f: Fn): Matrix {
  return {
    version: f.updatedAt,
    rows: f.rows.map((r) => ({ key: String(r.id), section: r.section as 'COND' | 'CONFIRM', groupName: r.groupName, label: r.label, value: r.value })),
    cases: f.cases.map((c) => ({ key: String(c.id), type: c.type as MatrixCase['type'], result: (c.result as MatrixCase['result']) ?? null, executedAt: c.executedAt, defectId: c.defectId, note: c.note })),
    marks: f.cases.flatMap((c) => c.rowIds.map((r) => [String(r), String(c.id)] as [string, string])),
  };
}

function rowKeyOf(m: Matrix, ref: z.infer<typeof rowRef>): string {
  if (typeof ref === 'number') {
    if (!m.rows.some((r) => r.key === String(ref))) throw new BadRequestError(`Row ${ref} is not in this function`, 'WORK_BAD_ROW');
    return String(ref);
  }
  const hit = m.rows.filter((r) => fold(r.groupName) === fold(ref.group) && (ref.value === undefined || fold(r.value) === fold(ref.value)));
  if (hit.length !== 1) {
    throw new BadRequestError(`${hit.length ? 'Several rows match' : 'No row matches'} ${ref.group}${ref.value !== undefined ? ` = ${ref.value}` : ''} — use the row id from fpt_unit_get`, 'WORK_BAD_ROW');
  }
  return hit[0].key;
}

function caseKeyOf(m: Matrix, ref: z.infer<typeof caseRef>): string {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  const c = Number.isInteger(n) ? m.cases[n - 1] : undefined;
  if (!c) throw new BadRequestError(`${String(ref)} is not a test case of this function (it has ${m.cases.length})`, 'WORK_BAD_CASE');
  return c.key;
}

/** Ma trận cho model: dòng có id, UTCID có danh sách dòng đánh "O". */
function matrixView(f: Fn) {
  return {
    function: {
      id: f.id, module: f.moduleName, method: f.methodName, sheetName: f.sheetName, loc: f.loc, codeRef: f.codeRef, createdBy: f.createdBy, executedBy: f.executedBy,
      description: f.description, preCondition: f.preCondition, testRequirement: f.testRequirement,
    },
    rows: f.rows.map((r) => ({ row: r.id, section: r.section === 'COND' ? 'condition' : 'confirmation', group: r.groupName, label: r.label, value: r.value })),
    cases: f.cases.map((c, i) => ({ utcid: utcid(i), type: c.type, result: c.result, executedAt: c.executedAt, defectId: c.defectId, note: c.note, O: c.rowIds })),
    stats: f.stats, requiredCases: f.requiredCases, belowNorm: f.belowNorm,
  };
}

async function unitCtx(ctx: McpCtx, project: string, ref: number | string, write: boolean) {
  if (write) requireWrite(ctx);
  const p0 = await projectFor(ctx, project, []);
  const id = await functionIdOf(p0.id, ref);
  const p = await projectFor(ctx, project, write ? [['PUT', `/fpt-tests/unit/${id}/matrix`]] : [['GET', `/fpt-tests/unit/${id}`]]);
  return { p, id };
}

async function saveAndView(ctx: McpCtx, projectId: number, id: number, m: Matrix) {
  const f = await fpt.saveMatrix(ctx.userId, projectId, id, m);
  return matrixView(f);
}

const unitList = defineTool({
  name: 'fpt_unit_list', title: 'List unit-tested functions (Report 5.1)', group: 'tests',
  description: 'Lists the functions of the FPT "Report 5.1 Unit Test" with LOC, number of test cases (UTCID), passed/failed and whether the 100 TC/KLOC norm is met.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/fpt-tests/unit']]);
    const r = await fpt.listFunctions(ctx.userId, p.id);
    const rows = r.functions.map((f) => ({
      id: f.id, module: f.moduleName, method: f.methodName, loc: f.loc, cases: f.stats.total, passed: f.stats.passed, failed: f.stats.failed,
      notRun: f.stats.total - f.stats.passed - f.stats.failed, createdBy: f.createdBy, executedBy: f.executedBy,
      requiredCases: f.requiredCases, belowNorm: f.belowNorm,
    }));
    return `${rows.length} function(s); norm ${r.tcPerKloc} TC/KLOC. Names are user data. Edit/delete: fpt_unit_update_function (Executed By, LOC…), fpt_unit_delete_cases (remove draft UTCIDs), fpt_unit_delete_function.\n${untrusted('unit test functions', json({ summary: r.summary, functions: rows }))}`;
  },
});

const unitGet = defineTool({
  name: 'fpt_unit_get', title: 'Get a unit test matrix (Report 5.1)', group: 'tests',
  description: 'Reads one function\'s test matrix: condition/confirmation rows (with row ids), every UTCID with type N/A/B, result P/F and the rows marked "O".',
  write: false,
  input: z.object({ project: projectArg, function: fnArg }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, false);
    return `${UNIT_HINT}\n${untrusted('unit test matrix', json(matrixView(await fpt.getFunction(ctx.userId, p.id, id))))}`;
  },
});

const unitCreate = defineTool({
  name: 'fpt_unit_create_function', title: 'Add a function to Report 5.1', group: 'tests',
  description: 'Adds a function (class/module + method) to the unit test report. By default it starts with the template rows (Precondition, Return, Exception, Log message) and one normal case.',
  write: true,
  input: z.object({
    project: projectArg,
    moduleName: z.string().min(1).max(120).describe('Class / module, e.g. "UserService"'),
    methodName: z.string().min(1).max(120).describe('Method, e.g. "register"'),
    description: z.string().max(4000).optional(),
    preCondition: z.string().max(4000).optional(),
    testRequirement: z.string().max(4000).optional(),
    codeRef: z.string().max(500).optional(),
    loc: z.number().int().min(0).max(1_000_000).optional().describe('Lines of code (drives the 100 TC/KLOC norm)'),
    starter: z.boolean().optional().describe('Start from the template rows (default true)'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/fpt-tests/unit']]);
    const f = await fpt.createFunction(ctx.userId, p.id, {
      moduleName: a.moduleName, methodName: a.methodName, description: a.description ?? null, preCondition: a.preCondition ?? null,
      testRequirement: a.testRequirement ?? null, codeRef: a.codeRef ?? null, loc: a.loc ?? null, starter: a.starter,
    });
    return { created: { id: f.id, function: `${f.moduleName}.${f.methodName}` }, matrix: matrixView(f) };
  },
});

const newRow = z.object({
  section: z.enum(['condition', 'confirmation']),
  group: z.string().min(1).max(120).describe('Condition: "Precondition" or a parameter name; confirmation: "Return" | "Exception" | "Log message"'),
  label: z.string().max(200).nullable().optional(),
  value: z.string().max(4000).nullable().optional().describe('Concrete value, e.g. "a@b.co", "" or null'),
});

const unitAddCases = defineTool({
  name: 'fpt_unit_add_cases', title: 'Add UTCIDs to a unit test matrix', group: 'tests',
  description: 'Adds rows (condition/confirmation values) and test cases (UTCID) to a function in one save. Each case has a type (N normal, A abnormal, B boundary) and the rows it marks "O" — existing row ids, or {group, value} of an existing or new row. Optional result P/F.',
  write: true,
  input: z.object({
    project: projectArg, function: fnArg,
    rows: z.array(newRow).max(60).optional().describe('New rows to add first (an identical row that already exists is reused)'),
    cases: z.array(z.object({
      type: z.enum(CASE_TYPES),
      O: z.array(rowRef).min(1).max(60).describe('Rows this case marks "O"'),
      result: z.enum(CASE_RESULTS).nullable().optional(),
      executedAt: dateArg.nullable().optional(),
      note: z.string().max(2000).nullable().optional(),
    })).min(1).max(40),
  }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    let seq = 0;
    for (const r of a.rows ?? []) {
      const section = r.section === 'condition' ? 'COND' : 'CONFIRM';
      const dup = m.rows.find((x) => x.section === section && fold(x.groupName) === fold(r.group) && fold(x.value) === fold(r.value));
      if (dup) continue;
      // Dòng mới đứng NGAY SAU dòng cuối cùng cùng nhóm (giữ khối Condition/Confirmation liền nhau như mẫu).
      const lastSame = m.rows.map((x, i) => [x, i] as const).filter(([x]) => x.section === section && fold(x.groupName) === fold(r.group)).pop();
      const lastSec = m.rows.map((x, i) => [x, i] as const).filter(([x]) => x.section === section).pop();
      const at = lastSame ? lastSame[1] + 1 : lastSec ? lastSec[1] + 1 : section === 'COND' ? 0 : m.rows.length;
      m.rows.splice(at, 0, { key: `n${++seq}`, section, groupName: r.group.trim(), label: r.label?.trim() || null, value: r.value ?? null });
    }
    const added: string[] = [];
    for (const c of a.cases) {
      const key = `c${++seq}`;
      m.cases.push({ key, type: c.type, result: c.result ?? null, executedAt: c.executedAt ?? (c.result ? today() : null), defectId: null, note: c.note ?? null });
      for (const ref of c.O) m.marks.push([rowKeyOf(m, ref), key]);
      added.push(utcid(m.cases.length - 1));
    }
    const view = await saveAndView(ctx, p.id, id, m);
    return { added, matrix: view };
  },
});

const unitMark = defineTool({
  name: 'fpt_unit_mark', title: 'Set or clear "O" marks', group: 'tests',
  description: 'Marks (on=true, default) or clears the "O" of one UTCID on the given rows of a unit test matrix.',
  write: true,
  input: z.object({ project: projectArg, function: fnArg, case: caseRef, rows: z.array(rowRef).min(1).max(60), on: z.boolean().optional() }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    const ck = caseKeyOf(m, a.case);
    const rks = a.rows.map((r) => rowKeyOf(m, r));
    if (a.on === false) m.marks = m.marks.filter(([rk, c]) => !(c === ck && rks.includes(rk)));
    else for (const rk of rks) if (!m.marks.some(([r, c]) => r === rk && c === ck)) m.marks.push([rk, ck]);
    return { matrix: await saveAndView(ctx, p.id, id, m) };
  },
});

const unitResults = defineTool({
  name: 'fpt_unit_record_results', title: 'Record unit test results', group: 'tests',
  description: 'Records the result (P passed / F failed, or null to clear), execution date, defect id, note and type (N/A/B) of UTCIDs. Only the fields you pass change. "Executed By" of the function: fpt_unit_update_function.',
  write: true,
  input: z.object({
    project: projectArg, function: fnArg,
    results: z.array(z.object({
      case: caseRef, result: z.enum(CASE_RESULTS).nullable().optional(), type: z.enum(CASE_TYPES).optional(),
      executedAt: dateArg.nullable().optional(), defectId: z.string().max(60).nullable().optional(), note: z.string().max(2000).nullable().optional(),
    })).min(1).max(100),
  }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    for (const r of a.results) {
      const c = m.cases.find((x) => x.key === caseKeyOf(m, r.case))!;
      if (r.result !== undefined) c.result = r.result;
      if (r.type !== undefined) c.type = r.type;
      c.executedAt = r.executedAt !== undefined ? r.executedAt : r.result ? (c.executedAt ?? today()) : c.executedAt;
      if (r.defectId !== undefined) c.defectId = r.defectId;
      if (r.note !== undefined) c.note = r.note;
    }
    return { matrix: await saveAndView(ctx, p.id, id, m) };
  },
});

const unitSuggest = defineTool({
  name: 'fpt_unit_suggest', title: 'Suggest boundary/abnormal tests for a function', group: 'tests',
  surfaces: { builtin: false },
  description: 'Asks CT Work\'s test-design helper (the same "AI suggest" as the Unit test page) for condition rows and N/A/B cases of a function. Returns a SUGGESTION only — nothing is saved; add what you keep with fpt_unit_add_cases.',
  write: false,
  input: z.object({ project: projectArg, function: fnArg, signature: z.string().max(4000).optional().describe('Signature or code of the function'), extra: z.string().max(1000).optional() }),
  run: async (ctx, a) => {
    const p0 = await projectFor(ctx, a.project, []);
    const id = await functionIdOf(p0.id, a.function);
    const p = await projectFor(ctx, a.project, [['POST', `/fpt-tests/unit/${id}/ai-suggest`]]);
    const s = await fpt.aiSuggest(ctx.userId, p.id, id, { signature: a.signature ?? null, extra: a.extra ?? null });
    // Đổi chỉ số sang {group, value} để model dán thẳng vào fpt_unit_add_cases.
    const cond = s.conditions.map((c) => ({ section: 'condition' as const, group: c.group, label: c.label ?? null, value: c.value }));
    const conf = s.confirmations.map((c) => ({ section: 'confirmation' as const, group: c.group, label: c.label ?? null, value: c.value }));
    const cases = s.cases.map((c) => ({
      type: c.type, title: c.title,
      O: [...c.conditions.map((i) => ({ group: cond[i].group, value: cond[i].value })), ...c.confirmations.map((i) => ({ group: conf[i].group, value: conf[i].value }))],
    }));
    return { note: 'Suggestion only — nothing saved. Pass rows + cases to fpt_unit_add_cases to keep them.', rows: [...cond, ...conf], cases, notes: s.notes ?? null };
  },
});

// ─── 5.1 — sửa / xoá / sắp xếp (21/10/2026: CuongMini ngang quyền người) ─────
//
// Sự cố gốc: CuongMini đối chiếu 5 ma trận, 41/41 UTCID đã P, nhưng KHÔNG điền được "Executed By" và KHÔNG xoá được 4 dòng
// nháp — chỉ có thêm/đánh dấu/ghi kết quả. Nay đủ như trang Unit test: sửa trường của hàm (PATCH), sửa/xoá/dời dòng & UTCID
// (ghi trọn ma trận bằng saveMatrix + `version` vừa đọc ⇒ 409 nếu người khác vừa lưu, dấu "O" của dòng/case bị xoá đi theo),
// nhân bản, xoá hàm. Xoá = `destructive` (client luôn hỏi) + chỉ token NGƯỜI (agent không xoá).

const fnFields = {
  moduleName: z.string().min(1).max(120).optional().describe('Class / module'),
  methodName: z.string().min(1).max(120).optional(),
  sheetName: z.string().max(31).nullable().optional().describe('Excel sheet name (null = automatic)'),
  description: z.string().max(4000).nullable().optional(),
  preCondition: z.string().max(4000).nullable().optional(),
  testRequirement: z.string().max(4000).nullable().optional(),
  codeRef: z.string().max(500).nullable().optional().describe('Where the code lives, e.g. "src/auth/AuthService.java#verifyEmail"'),
  loc: z.number().int().min(0).max(1_000_000).nullable().optional().describe('Lines of code (drives the 100 TC/KLOC norm)'),
  createdBy: z.string().max(120).nullable().optional().describe('"Created By" on the sheet'),
  executedBy: z.string().max(120).nullable().optional().describe('"Executed By" on the sheet — who ran the tests'),
};

const unitUpdateFn = defineTool({
  name: 'fpt_unit_update_function', title: 'Edit a function of Report 5.1', group: 'tests',
  description: 'Edits the header fields of a unit-tested function (the sheet header): Executed By, Created By, LOC, description, pre-condition, test requirement, code reference, class/method name, sheet name, position. Only the fields you pass change; null clears a field.',
  write: true,
  input: z.object({ project: projectArg, function: fnArg, ...fnFields, position: z.number().int().min(1).max(100_000).optional().describe('1 = first sheet') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await functionIdOf(p0.id, a.function);
    const p = await projectFor(ctx, a.project, [['PATCH', `/fpt-tests/unit/${id}`]]);
    const { project: _p, function: _f, position, ...rest } = a;
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) if (v !== undefined) patch[k] = v;
    if (position !== undefined) patch.position = position - 1;
    if (!Object.keys(patch).length) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
    const parsed = fpt.functionInput.partial().parse(patch);
    return { updated: Object.keys(patch), matrix: matrixView(await fpt.updateFunction(ctx.userId, p.id, id, parsed)) };
  },
});

const unitUpdateRows = defineTool({
  name: 'fpt_unit_update_rows', title: 'Edit condition/confirmation rows', group: 'tests',
  description: 'Edits rows of a unit test matrix (row id from fpt_unit_get, or {group, value}): group (e.g. a parameter name or "Return"), label, value, section. The "O" marks stay on the row.',
  write: true,
  input: z.object({
    project: projectArg, function: fnArg,
    rows: z.array(z.object({
      row: rowRef, group: z.string().min(1).max(120).optional(), label: z.string().max(200).nullable().optional(),
      value: z.string().max(4000).nullable().optional(), section: z.enum(['condition', 'confirmation']).optional(),
    })).min(1).max(60),
  }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    const keys = a.rows.map((r) => rowKeyOf(m, r.row)); // tra hết TRƯỚC khi sửa (sửa value làm đổi kết quả tra theo {group,value})
    a.rows.forEach((r, i) => {
      const row = m.rows.find((x) => x.key === keys[i])!;
      if (r.group !== undefined) row.groupName = r.group.trim();
      if (r.label !== undefined) row.label = r.label?.trim() || null;
      if (r.value !== undefined) row.value = r.value;
      if (r.section !== undefined) row.section = r.section === 'condition' ? 'COND' : 'CONFIRM';
    });
    return { matrix: await saveAndView(ctx, p.id, id, m) };
  },
});

const unitDeleteRows = defineTool({
  name: 'fpt_unit_delete_rows', title: 'Delete rows of a unit test matrix', group: 'tests',
  description: 'DESTRUCTIVE: removes / deletes condition or confirmation rows (draft input values, Return/Exception/Log lines) of a Report 5.1 unit test matrix (row ids or {group, value}) together with their "O" marks. unused=true deletes every row that no UTCID marks (leftover draft rows). The user must confirm.',
  write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, function: fnArg, rows: z.array(rowRef).max(120).optional(), unused: z.boolean().optional() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    if (!a.rows?.length && !a.unused) throw new BadRequestError('Pass rows to delete, or unused: true', 'VALIDATION_ERROR');
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    const drop = new Set((a.rows ?? []).map((r) => rowKeyOf(m, r)));
    if (a.unused) for (const r of m.rows) if (!m.marks.some(([rk]) => rk === r.key)) drop.add(r.key);
    const gone = m.rows.filter((r) => drop.has(r.key)).map((r) => ({ row: Number(r.key), section: r.section === 'COND' ? 'condition' : 'confirmation', group: r.groupName, value: r.value }));
    if (!gone.length) return { deleted: [], note: 'No row matched — nothing changed.' };
    m.rows = m.rows.filter((r) => !drop.has(r.key));
    m.marks = m.marks.filter(([rk]) => !drop.has(rk));
    return { deleted: gone, matrix: await saveAndView(ctx, p.id, id, m) };
  },
});

const unitDeleteCases = defineTool({
  name: 'fpt_unit_delete_cases', title: 'Delete UTCIDs of a unit test matrix', group: 'tests',
  description: 'DESTRUCTIVE: removes / deletes / hides test cases (UTCID columns) of a Report 5.1 unit test matrix with their "O" marks — e.g. draft or duplicate UTCIDs; the remaining cases are renumbered UTCID01… in order. notRun=true deletes every UTCID without a result (draft cases). There is no "hide" in the template: deleting is how a UTCID goes away. The user must confirm.',
  write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, function: fnArg, cases: z.array(caseRef).max(MAX_CASES_ARG).optional(), notRun: z.boolean().optional() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    if (!a.cases?.length && !a.notRun) throw new BadRequestError('Pass cases to delete, or notRun: true', 'VALIDATION_ERROR');
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    const drop = new Set((a.cases ?? []).map((c) => caseKeyOf(m, c)));
    if (a.notRun) for (const c of m.cases) if (!c.result) drop.add(c.key);
    const gone = m.cases.map((c, i) => [c, i] as const).filter(([c]) => drop.has(c.key)).map(([c, i]) => ({ utcid: utcid(i), type: c.type, result: c.result ?? null }));
    if (!gone.length) return { deleted: [], note: 'No case matched — nothing changed.' };
    m.cases = m.cases.filter((c) => !drop.has(c.key));
    m.marks = m.marks.filter(([, ck]) => !drop.has(ck));
    return { deleted: gone, note: 'Remaining cases are renumbered from UTCID01.', matrix: await saveAndView(ctx, p.id, id, m) };
  },
});

const unitMove = defineTool({
  name: 'fpt_unit_move', title: 'Reorder a row or UTCID', group: 'tests',
  description: 'Moves one test case (UTCID) or one row to another position (1 = first) in a unit test matrix. Cases are renumbered by position.',
  write: true,
  input: z.object({ project: projectArg, function: fnArg, case: caseRef.optional(), row: rowRef.optional(), to: z.number().int().min(1).max(1000) }),
  run: async (ctx, a) => {
    if ((a.case === undefined) === (a.row === undefined)) throw new BadRequestError('Pass exactly one of case or row', 'VALIDATION_ERROR');
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    const list: Array<{ key: string }> = a.case !== undefined ? m.cases : m.rows;
    const key = a.case !== undefined ? caseKeyOf(m, a.case) : rowKeyOf(m, a.row!);
    const from = list.findIndex((x) => x.key === key);
    const [it] = list.splice(from, 1);
    list.splice(Math.min(a.to - 1, list.length), 0, it);
    return { matrix: await saveAndView(ctx, p.id, id, m) };
  },
});

const unitDuplicate = defineTool({
  name: 'fpt_unit_duplicate_function', title: 'Duplicate a function sheet', group: 'tests',
  description: 'Copies a unit-tested function (rows, cases and "O" marks; results are cleared) as "<method> (copy)" — handy for an overload or a similar method. Rename it with fpt_unit_update_function.',
  write: true,
  input: z.object({ project: projectArg, function: fnArg }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await functionIdOf(p0.id, a.function);
    const p = await projectFor(ctx, a.project, [['POST', `/fpt-tests/unit/${id}/duplicate`]]);
    const f = await fpt.duplicateFunction(ctx.userId, p.id, id);
    return { created: { id: f.id, function: `${f.moduleName}.${f.methodName}` }, matrix: matrixView(f) };
  },
});

const unitDeleteFn = defineTool({
  name: 'fpt_unit_delete_function', title: 'Delete a function from Report 5.1', group: 'tests',
  description: 'DESTRUCTIVE, cannot be undone: deletes a unit-tested function (its whole sheet: rows, UTCIDs, results). The user must confirm. To drop only some cases use fpt_unit_delete_cases.',
  write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, function: fnArg }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    requireWrite(ctx);
    const p0 = await projectFor(ctx, a.project, []);
    const id = await functionIdOf(p0.id, a.function);
    const p = await projectFor(ctx, a.project, [['DELETE', `/fpt-tests/unit/${id}`]]);
    const f = await fpt.getFunction(ctx.userId, p.id, id);
    await fpt.deleteFunction(ctx.userId, p.id, id);
    return { deleted: { id, function: `${f.moduleName}.${f.methodName}`, cases: f.cases.length } };
  },
});

// ─── Bìa + Record of change (chung 5.1/5.2/5.3) ───────────────────

const docGet = defineTool({
  name: 'fpt_doc_get', title: 'Test report cover + record of change', group: 'tests',
  description: 'Reads the cover of the FPT test reports (project name/code, creator, reviewer, version, issue dates, environment, TC/KLOC norm, notes) and the "Record of change" rows (id, report UNIT/INT/SYS, date, version, A/D/M, description).',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/fpt-tests/doc']]);
    return untrusted('test report cover', json(await fpt.getDoc(ctx.userId, p.id)));
  },
});

const docUpdate = defineTool({
  name: 'fpt_doc_update', title: 'Edit the test report cover', group: 'tests',
  description: 'Edits the cover of the FPT test reports: projectName, projectCode, creator, reviewer, version, unitIssueDate / intIssueDate / sysIssueDate (YYYY-MM-DD), environment, tcPerKloc, unitNotes / intNotes / sysNotes. Only the fields you pass change.',
  write: true,
  input: fpt.docInput.extend({ project: projectArg }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PUT', '/fpt-tests/doc']]);
    const { project: _p, ...body } = a;
    if (!Object.values(body).some((v) => v !== undefined)) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
    return untrusted('test report cover', json(await fpt.updateDoc(ctx.userId, p.id, body)));
  },
});

const changeFields = {
  report: z.enum(['UNIT', 'INT', 'SYS']).describe('UNIT = 5.1, INT = 5.2, SYS = 5.3'),
  effectiveDate: dateArg, version: z.string().min(1).max(20),
  changeItem: z.string().max(200).nullable().optional(), action: z.enum(['A', 'D', 'M']).describe('A added · D deleted · M modified'),
  description: z.string().max(4000).nullable().optional(), reference: z.string().max(300).nullable().optional(),
};

const changeAdd = defineTool({
  name: 'fpt_change_add', title: 'Add a "Record of change" row', group: 'tests',
  description: 'Adds a row to the "Record of change" sheet of a test report (date, version, A/D/M, change item, description).',
  write: true,
  input: z.object({ project: projectArg, ...changeFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/fpt-tests/changes']]);
    const { project: _p, ...body } = a;
    return { created: await fpt.addChange(ctx.userId, p.id, body) };
  },
});

const changeUpdate = defineTool({
  name: 'fpt_change_update', title: 'Edit a "Record of change" row', group: 'tests',
  description: 'Edits a "Record of change" row by its id (from fpt_doc_get). Only the fields you pass change.',
  write: true,
  input: z.object({ project: projectArg, id: z.number().int().positive(), ...Object.fromEntries(Object.entries(changeFields).map(([k, v]) => [k, (v as z.ZodTypeAny).optional()])) as { [K in keyof typeof changeFields]: z.ZodOptional<(typeof changeFields)[K]> } }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', `/fpt-tests/changes/${a.id}`]]);
    const { project: _p, id, ...body } = a;
    return { updated: await fpt.updateChange(ctx.userId, p.id, id, body) };
  },
});

const changeDelete = defineTool({
  name: 'fpt_change_delete', title: 'Delete a "Record of change" row', group: 'tests',
  description: 'DESTRUCTIVE: deletes a "Record of change" row by id (from fpt_doc_get). The user must confirm.',
  write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, id: z.number().int().positive() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['DELETE', `/fpt-tests/changes/${a.id}`]]);
    await fpt.deleteChange(ctx.userId, p.id, a.id);
    return { deleted: a.id };
  },
});

// ─── 5.2 Integration / 5.3 System ─────────────────────────────────

const kindArg = z.enum(['integration', 'system']).describe('integration = Report 5.2 · system = Report 5.3 (both have 4 rounds)');
const KIND = { integration: 'INT', system: 'SYS' } as const;
const moduleArg = z.union([z.number().int().positive(), z.string().min(1).max(120)]).describe('Module/workflow id from fpt_it_list, or its name');

async function moduleIdOf(projectId: number, kind: 'INT' | 'SYS', ref: number | string): Promise<number> {
  if (typeof ref === 'number') return ref;
  if (/^\d+$/.test(ref.trim())) return Number(ref.trim());
  const hits = await prisma.workItModule.findMany({ where: { projectId, kind, name: { equals: ref.trim(), mode: 'insensitive' } }, select: { id: true } });
  if (hits.length === 1) return hits[0].id;
  throw new NotFoundError(`${kind === 'SYS' ? 'System test workflow' : 'Integration module'} "${ref}" not found — call fpt_it_list`);
}

type Mod = Awaited<ReturnType<typeof fpt.getModule>>;
const caseId = (m: Mod, i: number) => `${m.idPrefix}${String(i + 1).padStart(2, '0')}`;
function moduleView(m: Mod) {
  return {
    module: { id: m.id, kind: m.kind === 'SYS' ? 'system' : 'integration', name: m.name, idPrefix: m.idPrefix, description: m.description, preCondition: m.preCondition, testRequirement: m.testRequirement, rounds: m.kind === 'SYS' ? SYS_ROUNDS : MAX_ROUNDS },
    cases: m.cases.map((c, i) => ({ id: caseId(m, i), section: c.section, description: c.description, procedure: c.procedure, testData: c.testData, expected: c.expected, actual: c.actual, preConditions: c.preConditions, note: c.note, rounds: c.rounds })),
    stats: m.stats,
  };
}

async function itCtx(ctx: McpCtx, project: string, kind: 'INT' | 'SYS', ref: number | string, write: boolean) {
  if (write) requireWrite(ctx);
  const p0 = await projectFor(ctx, project, []);
  const id = await moduleIdOf(p0.id, kind, ref);
  const seg = kind === 'SYS' ? 'system' : 'integration';
  const p = await projectFor(ctx, project, write ? [['PUT', `/fpt-tests/${seg}/${id}/cases`]] : [['GET', `/fpt-tests/${seg}/${id}`]]);
  const m = await fpt.getModule(ctx.userId, p.id, id);
  if (m.kind !== kind) throw new NotFoundError(`That is not a ${seg} test ${kind === 'SYS' ? 'workflow' : 'module'}`);
  return { p, id, m };
}

const casesPayload = (m: Mod) => m.cases.map((c) => ({
  section: c.section, description: c.description, procedure: c.procedure, testData: c.testData, expected: c.expected, actual: c.actual,
  preConditions: c.preConditions, evidence: c.evidence, note: c.note, rounds: c.rounds,
}));

const itList = defineTool({
  name: 'fpt_it_list', title: 'List integration modules / system workflows', group: 'tests',
  description: 'Lists Report 5.2 integration test modules or Report 5.3 system test workflows with pass/fail counts per round.',
  write: false,
  input: z.object({ project: projectArg, kind: kindArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', `/fpt-tests/${a.kind}`]]);
    const r = await fpt.listModules(ctx.userId, p.id, KIND[a.kind]);
    const rows = r.modules.map((m) => ({ id: m.id, name: m.name, idPrefix: m.idPrefix, cases: m.stats.total, stats: m.stats }));
    return untrusted(`${a.kind} test modules`, json({ summary: r.summary, modules: rows }));
  },
});

const itGet = defineTool({
  name: 'fpt_it_get', title: 'Get an integration/system test sheet', group: 'tests',
  description: 'Reads one Report 5.2 module or Report 5.3 workflow: every test case (ID, procedure, data, expected, actual) and its round results.',
  write: false,
  input: z.object({ project: projectArg, kind: kindArg, module: moduleArg }),
  run: async (ctx, a) => {
    const { m } = await itCtx(ctx, a.project, KIND[a.kind], a.module, false);
    return `Edit this sheet: fpt_it_update_cases (fields, clear a round) · fpt_it_record_round · remove/delete cases ⇒ fpt_it_delete_cases (notRun=true = never run) · reorder ⇒ fpt_it_move_case · header ⇒ fpt_it_update_module.\n${untrusted(`${a.kind} test sheet`, json(moduleView(m)))}`;
  },
});

const itCreate = defineTool({
  name: 'fpt_it_create_module', title: 'Add an integration module / system workflow', group: 'tests',
  description: 'Adds a Report 5.2 integration module or a Report 5.3 system test workflow (a sheet). idPrefix (letters) builds the case ids, e.g. AT → AT01.',
  write: true,
  input: z.object({
    project: projectArg, kind: kindArg, name: z.string().min(1).max(120),
    idPrefix: z.string().regex(/^[A-Za-z]{1,10}$/).optional(), description: z.string().max(4000).optional(),
    preCondition: z.string().max(4000).optional(), testRequirement: z.string().max(4000).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/fpt-tests/${a.kind}`]]);
    const m = await fpt.createModule(ctx.userId, p.id, {
      name: a.name, idPrefix: a.idPrefix, description: a.description ?? null, preCondition: a.preCondition ?? null, testRequirement: a.testRequirement ?? null,
    }, KIND[a.kind]);
    return { created: { id: m.id, name: m.name, idPrefix: m.idPrefix }, sheet: moduleView(m) };
  },
});

const itAddCases = defineTool({
  name: 'fpt_it_add_cases', title: 'Add test cases (steps) to a 5.2/5.3 sheet', group: 'tests',
  description: 'Appends test cases to an integration module or system workflow: description, procedure (numbered steps), test data, expected result, pre-conditions. Existing cases are kept.',
  write: true,
  input: z.object({
    project: projectArg, kind: kindArg, module: moduleArg,
    cases: z.array(z.object({
      section: z.string().max(200).nullable().optional(), description: z.string().min(1).max(4000),
      procedure: z.string().max(8000).nullable().optional(), testData: z.string().max(8000).nullable().optional(),
      expected: z.string().max(8000).nullable().optional(), preConditions: z.string().max(4000).nullable().optional(), note: z.string().max(4000).nullable().optional(),
    })).min(1).max(60),
  }),
  run: async (ctx, a) => {
    const { p, id, m } = await itCtx(ctx, a.project, KIND[a.kind], a.module, true);
    const cases = [...casesPayload(m), ...a.cases.map((c) => ({
      section: c.section ?? null, description: c.description, procedure: c.procedure ?? null, testData: c.testData ?? null, expected: c.expected ?? null,
      actual: null, preConditions: c.preConditions ?? null, evidence: null, note: c.note ?? null, rounds: [],
    }))];
    const after = await fpt.saveItCases(ctx.userId, p.id, id, { version: m.updatedAt, cases });
    return { added: a.cases.map((_, i) => caseId(after, m.cases.length + i)), sheet: moduleView(after) };
  },
});

const itRound = defineTool({
  name: 'fpt_it_record_round', title: 'Record a test round result', group: 'tests',
  description: 'Records the result of test cases in a round (Passed / Failed / Pending / N/A) with date, tester and actual result. Recording round N adds the round if it is not there yet (5.2 and 5.3 have up to 4 rounds).',
  write: true,
  input: z.object({
    project: projectArg, kind: kindArg, module: moduleArg,
    results: z.array(z.object({
      case: z.union([z.number().int().positive(), z.string().min(1).max(20)]).describe('Case id like "AT03" or its position (3)'),
      round: z.number().int().min(1).max(MAX_ROUNDS),
      status: z.enum(IT_STATUSES),
      date: dateArg.nullable().optional(), tester: z.string().max(120).nullable().optional(), actual: z.string().max(8000).nullable().optional(),
    })).min(1).max(200),
  }),
  run: async (ctx, a) => {
    const kind = KIND[a.kind];
    const { p, id, m } = await itCtx(ctx, a.project, kind, a.module, true);
    const max = kind === 'SYS' ? SYS_ROUNDS : MAX_ROUNDS;
    const cases = casesPayload(m);
    const me = await prisma.user.findUnique({ where: { id: ctx.userId }, select: { username: true, displayName: true, fullName: true } });
    for (const r of a.results) {
      if (r.round > max) throw new BadRequestError(`This report has at most ${max} rounds`, 'VALIDATION_ERROR');
      const n = typeof r.case === 'number' ? r.case : Number(/(\d+)\s*$/.exec(r.case)?.[1] ?? NaN);
      const c = Number.isInteger(n) ? cases[n - 1] : undefined;
      if (!c) throw new BadRequestError(`${String(r.case)} is not a case of this sheet (it has ${cases.length})`, 'WORK_BAD_CASE');
      const rounds = [...c.rounds];
      while (rounds.length < r.round) rounds.push({ status: null, date: null, tester: null });
      rounds[r.round - 1] = { status: r.status, date: r.date ?? today(), tester: r.tester ?? (me ? (me.displayName || me.fullName || me.username) : null) };
      c.rounds = rounds;
      if (r.actual !== undefined) c.actual = r.actual;
    }
    const after = await fpt.saveItCases(ctx.userId, p.id, id, { version: m.updatedAt, cases });
    return { sheet: moduleView(after) };
  },
});

// ─── 5.2/5.3 — sửa / xoá / sắp xếp (21/10/2026) ──────────────────

/** "AT03" / 3 ⇒ chỉ số 0-based của case trong sheet. */
function itIndex(m: Mod, ref: number | string): number {
  const n = typeof ref === 'number' ? ref : Number(/(\d+)\s*$/.exec(ref)?.[1] ?? NaN);
  if (!Number.isInteger(n) || n < 1 || n > m.cases.length) throw new BadRequestError(`${String(ref)} is not a case of this sheet (it has ${m.cases.length})`, 'WORK_BAD_CASE');
  return n - 1;
}
const itCaseRef = z.union([z.number().int().positive(), z.string().min(1).max(20)]).describe('Case id like "AT03" or its position (3)');

const itUpdateModule = defineTool({
  name: 'fpt_it_update_module', title: 'Edit an integration module / system workflow', group: 'tests',
  description: 'Edits the header of a Report 5.2 module or 5.3 workflow: name, idPrefix (case ids, e.g. AT → AT01), sheet name, description, pre-condition, test requirement, position. Only the fields you pass change.',
  write: true,
  input: z.object({
    project: projectArg, kind: kindArg, module: moduleArg,
    name: z.string().min(1).max(120).optional(), idPrefix: z.string().regex(/^[A-Za-z]{1,10}$/).optional(), sheetName: z.string().max(31).nullable().optional(),
    description: z.string().max(4000).nullable().optional(), preCondition: z.string().max(4000).nullable().optional(), testRequirement: z.string().max(4000).nullable().optional(),
    position: z.number().int().min(1).max(100_000).optional().describe('1 = first sheet'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const kind = KIND[a.kind];
    const p0 = await projectFor(ctx, a.project, []);
    const id = await moduleIdOf(p0.id, kind, a.module);
    const p = await projectFor(ctx, a.project, [['PATCH', `/fpt-tests/${a.kind}/${id}`]]);
    const cur = await fpt.getModule(ctx.userId, p.id, id);
    if (cur.kind !== kind) throw new NotFoundError(`That is not a ${a.kind} test ${kind === 'SYS' ? 'workflow' : 'module'}`);
    const { project: _p, kind: _k, module: _m, position, ...rest } = a;
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rest)) if (v !== undefined) patch[k] = v;
    if (position !== undefined) patch.position = position - 1;
    if (!Object.keys(patch).length) throw new BadRequestError('Nothing to change — pass at least one field', 'VALIDATION_ERROR');
    return { updated: Object.keys(patch), sheet: moduleView(await fpt.updateModule(ctx.userId, p.id, id, fpt.moduleInput.partial().parse(patch))) };
  },
});

const itUpdateCases = defineTool({
  name: 'fpt_it_update_cases', title: 'Edit test cases of a 5.2/5.3 sheet', group: 'tests',
  description: 'Edits existing test cases of an integration module / system workflow (case id like "AT03" or position): section, description, procedure, test data, expected, actual, pre-conditions, evidence, note. clearRound = N empties that round\'s result. Round results: fpt_it_record_round.',
  write: true,
  input: z.object({
    project: projectArg, kind: kindArg, module: moduleArg,
    cases: z.array(z.object({
      case: itCaseRef,
      section: z.string().max(200).nullable().optional(), description: z.string().min(1).max(4000).optional(),
      procedure: z.string().max(8000).nullable().optional(), testData: z.string().max(8000).nullable().optional(),
      expected: z.string().max(8000).nullable().optional(), actual: z.string().max(8000).nullable().optional(),
      preConditions: z.string().max(4000).nullable().optional(), evidence: z.string().max(8000).nullable().optional(), note: z.string().max(4000).nullable().optional(),
      clearRound: z.number().int().min(1).max(MAX_ROUNDS).optional(),
    })).min(1).max(100),
  }),
  run: async (ctx, a) => {
    const { p, id, m } = await itCtx(ctx, a.project, KIND[a.kind], a.module, true);
    const cases = casesPayload(m);
    for (const u of a.cases) {
      const c = cases[itIndex(m, u.case)];
      const { case: _c, clearRound, ...fields } = u;
      for (const [k, v] of Object.entries(fields)) if (v !== undefined) (c as Record<string, unknown>)[k] = v;
      if (clearRound !== undefined && c.rounds[clearRound - 1]) c.rounds = c.rounds.map((r, i) => (i === clearRound - 1 ? { status: null, date: null, tester: null } : r));
    }
    const after = await fpt.saveItCases(ctx.userId, p.id, id, { version: m.updatedAt, cases });
    return { sheet: moduleView(after) };
  },
});

const itDeleteCases = defineTool({
  name: 'fpt_it_delete_cases', title: 'Delete test cases of a 5.2/5.3 sheet', group: 'tests',
  description: 'DESTRUCTIVE: deletes test cases (by id like "AT03" or position) from an integration module / system workflow; the rest are renumbered. notRun=true deletes every case with no round result. The user must confirm.',
  write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, kind: kindArg, module: moduleArg, cases: z.array(itCaseRef).max(200).optional(), notRun: z.boolean().optional() }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    if (!a.cases?.length && !a.notRun) throw new BadRequestError('Pass cases to delete, or notRun: true', 'VALIDATION_ERROR');
    const { p, id, m } = await itCtx(ctx, a.project, KIND[a.kind], a.module, true);
    const drop = new Set((a.cases ?? []).map((c) => itIndex(m, c)));
    if (a.notRun) m.cases.forEach((c, i) => { if (!c.rounds.some((r) => r?.status)) drop.add(i); });
    if (!drop.size) return { deleted: [], note: 'No case matched — nothing changed.' };
    const gone = [...drop].sort((x, y) => x - y).map((i) => ({ id: caseId(m, i), description: m.cases[i].description }));
    const cases = casesPayload(m).filter((_, i) => !drop.has(i));
    const after = await fpt.saveItCases(ctx.userId, p.id, id, { version: m.updatedAt, cases });
    return { deleted: gone, note: 'Remaining cases are renumbered.', sheet: moduleView(after) };
  },
});

const itMoveCase = defineTool({
  name: 'fpt_it_move_case', title: 'Reorder a 5.2/5.3 test case', group: 'tests',
  description: 'Moves one test case of an integration module / system workflow to another position (1 = first). Case ids follow the order.',
  write: true,
  input: z.object({ project: projectArg, kind: kindArg, module: moduleArg, case: itCaseRef, to: z.number().int().min(1).max(1000) }),
  run: async (ctx, a) => {
    const { p, id, m } = await itCtx(ctx, a.project, KIND[a.kind], a.module, true);
    const cases = casesPayload(m);
    const [c] = cases.splice(itIndex(m, a.case), 1);
    cases.splice(Math.min(a.to - 1, cases.length), 0, c);
    return { sheet: moduleView(await fpt.saveItCases(ctx.userId, p.id, id, { version: m.updatedAt, cases })) };
  },
});

const itDeleteModule = defineTool({
  name: 'fpt_it_delete_module', title: 'Delete an integration module / system workflow', group: 'tests',
  description: 'DESTRUCTIVE, cannot be undone: deletes a Report 5.2 module or 5.3 workflow with all its test cases and round results. The user must confirm.',
  write: true, destructive: true, personOnly: true, surfaces: { ask: false, builtin: false },
  input: z.object({ project: projectArg, kind: kindArg, module: moduleArg }),
  run: async (ctx, a) => {
    await requirePerson(ctx, 'delete test data');
    requireWrite(ctx);
    const kind = KIND[a.kind];
    const p0 = await projectFor(ctx, a.project, []);
    const id = await moduleIdOf(p0.id, kind, a.module);
    const p = await projectFor(ctx, a.project, [['DELETE', `/fpt-tests/${a.kind}/${id}`]]);
    const m = await fpt.getModule(ctx.userId, p.id, id);
    if (m.kind !== kind) throw new NotFoundError(`That is not a ${a.kind} test ${kind === 'SYS' ? 'workflow' : 'module'}`);
    await fpt.deleteModule(ctx.userId, p.id, id);
    return { deleted: { id, name: m.name, cases: m.cases.length } };
  },
});

// ─── Test case / cycle / run kiểu Xray ────────────────────────────

const testList = defineTool({
  name: 'test_list', title: 'List test cases', group: 'tests',
  description: 'Lists the project\'s test cases (Xray style TEST issues) with their requirement links and last run status. Optional text query.',
  write: false,
  input: z.object({ project: projectArg, query: z.string().max(200).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/tests']]);
    const r = await tests.listTests(ctx.userId, p.id, a.query);
    return untrusted('test cases', json(r));
  },
});

const testGet = defineTool({
  name: 'test_get', title: 'Get a test case', group: 'tests',
  description: 'Reads one test case: preconditions, steps (action / data / expected), linked requirements and recent runs.',
  write: false,
  input: z.object({ project: projectArg, test: z.union([z.number().int().positive(), z.string().min(1).max(40)]).describe('Test issue number or key') }),
  run: async (ctx, a) => {
    const n = typeof a.test === 'number' ? a.test : Number(/(\d+)\s*$/.exec(a.test)?.[1] ?? NaN);
    if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(a.test)}" is not a test number`, 'VALIDATION_ERROR');
    const p = await projectFor(ctx, a.project, [['GET', `/tests/${n}`]]);
    return untrusted('test case', json(await tests.getTest(ctx.userId, p.id, n)));
  },
});

const testCreate = defineTool({
  name: 'test_create', title: 'Create a test case', group: 'tests',
  description: 'Creates a test case (TEST issue) with steps (action, test data, expected result) and optionally links the requirement/story it verifies.',
  write: true,
  input: z.object({
    project: projectArg, title: z.string().min(1).max(255), preconditions: z.string().max(5000).optional(),
    steps: z.array(z.object({ action: z.string().min(1).max(2000), data: z.string().max(2000).nullable().optional(), expected: z.string().max(2000).nullable().optional() })).min(1).max(50),
    requirement: z.union([z.number().int().positive(), z.string().min(1).max(40)]).optional().describe('Issue number/key of the story or requirement it verifies'),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/tests']]);
    const reqKey = a.requirement === undefined ? null : typeof a.requirement === 'number' ? `${p.key}-${a.requirement}` : /^\d+$/.test(a.requirement.trim()) ? `${p.key}-${a.requirement.trim()}` : a.requirement.trim().toUpperCase();
    const t = await tests.createTest(ctx.userId, p.id, {
      title: a.title, preconditions: a.preconditions ?? null,
      steps: a.steps.map((s) => ({ action: s.action, data: s.data ?? null, expected: s.expected ?? null })),
      requirementKeys: reqKey ? [reqKey] : [],
    });
    return { created: `${p.key}-${t.number}`, number: t.number, url: `/work/${p.workspaceSlug}/${p.key}/tests/${t.number}` };
  },
});

const testCycles = defineTool({
  name: 'test_cycles', title: 'Test cycles and runs', group: 'tests',
  description: 'Without cycle: lists test cycles with progress and pass rate. With cycle: its runs (run id, test, status, defects). Read one run\'s steps with test_run.',
  write: false,
  input: z.object({ project: projectArg, cycle: z.number().int().positive().optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', a.cycle ? `/test-cycles/${a.cycle}` : '/test-cycles']]);
    return untrusted('test cycles', json(a.cycle ? await tests.getCycle(ctx.userId, p.id, a.cycle) : await tests.listCycles(ctx.userId, p.id)));
  },
});

const testRun = defineTool({
  name: 'test_run', title: 'Get a test run', group: 'tests',
  description: 'Reads one test run: status, comment and every step with its id, expected result, status and actual result.',
  write: false,
  input: z.object({ project: projectArg, run: z.number().int().positive() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', `/test-runs/${a.run}`]]);
    return untrusted('test run', json(await tests.getRun(ctx.userId, p.id, a.run)));
  },
});

const cycleCreate = defineTool({
  name: 'test_cycle_create', title: 'Create a test cycle', group: 'tests',
  description: 'Creates a test cycle (execution) with one run per listed test case.',
  write: true,
  input: z.object({
    project: projectArg, name: z.string().min(1).max(120), tests: z.array(z.number().int().positive()).max(500).describe('Test issue numbers'),
    environment: z.string().max(120).optional(), build: z.string().max(120).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/test-cycles']]);
    const c = await tests.createCycle(ctx.userId, p.id, { name: a.name, numbers: a.tests, environment: a.environment ?? null, build: a.build ?? null });
    return { cycle: c.id, url: `/work/${p.workspaceSlug}/${p.key}/tests?cycle=${c.id}` };
  },
});

const runRecord = defineTool({
  name: 'test_run_record', title: 'Record a test run result', group: 'tests',
  description: 'Records the result of a test run: overall status and/or each step (by step id or position) with PASS / FAIL / BLOCKED / SKIP and the actual result. Step results also update the run status.',
  write: true,
  input: z.object({
    project: projectArg, run: z.number().int().positive(),
    status: z.enum(tests.RUN_STATUSES).optional(), comment: z.string().max(5000).nullable().optional(),
    steps: z.array(z.object({ step: z.number().int().positive().describe('Step id, or position (1, 2, …) when smaller than the first id'), status: z.enum(tests.STEP_STATUSES).optional(), actual: z.string().max(5000).nullable().optional() })).max(100).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PATCH', `/test-runs/${a.run}`], ...(a.steps?.length ? [['PATCH', `/test-runs/${a.run}/steps/0`] as [string, string]] : [])]);
    let run = await tests.getRun(ctx.userId, p.id, a.run);
    for (const s of a.steps ?? []) {
      const st = run.steps.find((x) => x.id === s.step) ?? run.steps.find((x) => x.position === s.step - 1);
      if (!st) throw new BadRequestError(`Step ${s.step} is not in run ${a.run}`, 'WORK_BAD_STEP');
      run = await tests.updateStepResult(ctx.userId, p.id, a.run, st.id, { status: s.status, actual: s.actual });
    }
    if (a.status !== undefined || a.comment !== undefined) run = await tests.updateRun(ctx.userId, p.id, a.run, { status: a.status, comment: a.comment });
    return { run: run.id, status: run.status, steps: run.steps.map((s) => ({ id: s.id, status: s.status, actual: s.actual })) };
  },
});

export const TEST_COMMANDS: ToolDef[] = [
  unitList, unitGet, unitCreate, unitAddCases, unitMark, unitResults, unitSuggest,
  ...[unitUpdateFn, unitUpdateRows, unitDeleteRows, unitDeleteCases, unitMove, unitDuplicate, unitDeleteFn].map(mcpOnly),
  ...[docGet, docUpdate, changeAdd, changeUpdate, changeDelete].map(mcpOnly),
  itList, itGet, itCreate, itAddCases, itRound,
  ...[itUpdateModule, itUpdateCases, itDeleteCases, itMoveCase, itDeleteModule].map(mcpOnly),
  testList, testGet, testCreate, testCycles, testRun, cycleCreate, runRecord,
];
