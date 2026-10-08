/**
 * Registry lệnh — KIỂM THỬ (đợt 3C): Report 5.1 Unit (ma trận UTCID), 5.2 Integration, 5.3 System (đợt 3B) và test
 * case/cycle/run kiểu Xray. Mỗi lệnh: `projectFor` với tuyến REST tương đương (rào chắn agent + cổng khách y như REST)
 * rồi gọi THẲNG fptTests.service / tests.service — cùng hàm, cùng quyền (đọc = project.view, ghi = issue.edit),
 * cùng khoá lạc quan (ma trận ghi trọn bằng saveMatrix với `version` vừa đọc ⇒ người khác vừa lưu ⇒ 409, không đè).
 */

import { z } from 'zod';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../../middleware/errorHandler.js';
import { projectFor, requireWrite, type McpCtx } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { projectArg } from '../../../mcp/tools/read.js';
import * as fpt from '../fptTests.service.js';
import { CASE_RESULTS, CASE_TYPES, IT_STATUSES, MAX_ROUNDS, SYS_ROUNDS } from '../fptTests.js';
import * as tests from '../tests.service.js';
import { defineTool, type ToolDef } from './types.js';

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
  z.number().int().positive().describe('Row id from fpt_unit_get'),
  z.object({ group: z.string().min(1).max(120), value: z.string().max(4000).nullable().optional() }).describe('Row by group + value'),
]);
const caseRef = z.union([z.number().int().positive(), z.string().min(1).max(20)])
  .describe('UTCID like "UTCID03" (or 3 = the 3rd case)');

type Fn = Awaited<ReturnType<typeof fpt.getFunction>>;
type MatrixRow = fpt.MatrixInput['rows'][number];
type MatrixCase = fpt.MatrixInput['cases'][number];
interface Matrix { version: string; rows: MatrixRow[]; cases: MatrixCase[]; marks: Array<[string, string]> }

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
    function: { id: f.id, module: f.moduleName, method: f.methodName, loc: f.loc, description: f.description, preCondition: f.preCondition, testRequirement: f.testRequirement },
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
      requiredCases: f.requiredCases, belowNorm: f.belowNorm,
    }));
    return `${rows.length} function(s); norm ${r.tcPerKloc} TC/KLOC. Names are user data.\n${untrusted('unit test functions', json({ summary: r.summary, functions: rows }))}`;
  },
});

const unitGet = defineTool({
  name: 'fpt_unit_get', title: 'Get a unit test matrix (Report 5.1)', group: 'tests',
  description: 'Reads one function\'s test matrix: condition/confirmation rows (with row ids), every UTCID with type N/A/B, result P/F and the rows marked "O".',
  write: false,
  input: z.object({ project: projectArg, function: fnArg }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, false);
    return untrusted('unit test matrix', json(matrixView(await fpt.getFunction(ctx.userId, p.id, id))));
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
  description: 'Records the result (P passed / F failed, or null to clear), execution date, defect id and note of UTCIDs.',
  write: true,
  input: z.object({
    project: projectArg, function: fnArg,
    results: z.array(z.object({
      case: caseRef, result: z.enum(CASE_RESULTS).nullable(),
      executedAt: dateArg.nullable().optional(), defectId: z.string().max(60).nullable().optional(), note: z.string().max(2000).nullable().optional(),
    })).min(1).max(100),
  }),
  run: async (ctx, a) => {
    const { p, id } = await unitCtx(ctx, a.project, a.function, true);
    const m = toMatrix(await fpt.getFunction(ctx.userId, p.id, id));
    for (const r of a.results) {
      const c = m.cases.find((x) => x.key === caseKeyOf(m, r.case))!;
      c.result = r.result;
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

// ─── 5.2 Integration / 5.3 System ─────────────────────────────────

const kindArg = z.enum(['integration', 'system']).describe('integration = Report 5.2 (4 rounds) · system = Report 5.3 (3 rounds)');
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
    return untrusted(`${a.kind} test sheet`, json(moduleView(m)));
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
  description: 'Records the result of test cases in a round (Passed / Failed / Pending / N/A) with date, tester and actual result. Recording round N adds the round if it is not there yet (5.2 has up to 4 rounds, 5.3 has 3).',
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
  itList, itGet, itCreate, itAddCases, itRound,
  testList, testGet, testCreate, testCycles, testRun, cycleCreate, runRecord,
];
