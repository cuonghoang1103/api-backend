/**
 * CT Work — CTW đợt 4 (09/10/2026): RTM ĐẦY ĐỦ (A19) — phần có DB. Dòng/chỗ hở/Excel ở rtm.ts (thuần).
 *
 * Chuỗi truy vết: Req/UC ↔ mục SRS ↔ mục SDS (trang Docs) ↔ commit/PR (WorkDevActivity) ↔ test case (Xray + UTCID 5.1 +
 * 5.2 + 5.3) ↔ Bug. Hai nguồn nối:
 *   1. TỰ DÒ — trang SRS/SDS (theo mẫu FPT Report 3/4, mẫu srs/sdd, hoặc tiêu đề) nhắc "UC-03" / "KEY-12" dưới đề mục nào
 *      ⇒ mục đó; liên kết trang↔thẻ (WorkPageIssueLink) ⇒ cả trang; hàm 5.1 / module 5.2 / workflow 5.3 có mô tả, yêu cầu
 *      kiểm thử hoặc tham chiếu mã nhắc mã UC/thẻ/BR ⇒ test của yêu cầu đó; Xray: liên kết TESTS; commit/PR: thẻ + thẻ con;
 *      Bug: lỗi từ lần chạy test, Bug con, Bug liên kết, Defect ID của UTCID.
 *   2. ĐẶT TAY — WorkTraceLink (UC/thẻ/BR ⇒ SRS/SDS mục cụ thể, hàm/module test, lớp.phương thức).
 * KHÔNG ghi gì — chỉ đọc; quyền xem = đội dự án + giảng viên (srsCtx).
 */

import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { emitWorkEvent } from './events.js';
import { issueRefsIn, textBlocks } from './specFidelity.js';
import { brKey, inDocument, refsIn, ucKey, ucMissing, ucSpecSection } from './srs.js';
import { loadSrs, srsCtx } from './srs.service.js';
import {
  buildRtmSheets, evaluateRow, filterRows, GAP_CODES, GAP_LABEL, summarize,
  type GapCode, type Orphan, type RtmRow, type RuleCoverage, type TestSet,
} from './rtm.js';
import { writeXlsx } from './xlsxStyled.js';

const REQ_TYPES = ['REQUIREMENT', 'STORY'];
const uniq = <T>(xs: T[]) => [...new Set(xs)];

type DocKind = 'SRS' | 'SDS';
/** Loại trang tài liệu cho truy vết (null = không phải SRS/SDS). */
export function traceDocKind(p: { templateKey: string | null; title: string }): DocKind | null {
  const k = p.templateKey ?? '';
  if (/^fpt-report3|^srs$|requirement/i.test(k) || /\bsrs\b|report\s*3\b|requirements? spec/i.test(p.title)) return 'SRS';
  if (/^fpt-report4|^sdd$|^sds$|design/i.test(k) || /\b(sds|sdd)\b|report\s*4\b|design (spec|desc|doc)/i.test(p.title)) return 'SDS';
  return null;
}

interface Mention { kind: DocKind; page: number | null; title: string | null; heading: string | null; ref?: string | null }

/** "Doc 5 §2.1, §2.2" — gộp theo trang, đề mục có số thì chỉ lấy số (ô RTM gọn), không có số thì chữ rút gọn. */
export function compactRefs(ms: Array<Pick<Mention, 'page' | 'title' | 'heading' | 'ref'>>): string[] {
  const byPage = new Map<string, string[]>();
  const loose: string[] = [];
  for (const m of ms) {
    if (!m.page) { const t = (m.heading ?? m.ref ?? '').trim(); if (t && !loose.includes(t)) loose.push(t); continue; }
    const k = `Doc ${m.page}`;
    const list = byPage.get(k) ?? [];
    const num = m.heading ? /^((?:[IVX]+\.|\d+(?:\.\d+)*)\.?)\s/.exec(m.heading.trim())?.[1] : null;
    const label = m.heading ? (num ? `§${num}` : m.heading.trim().slice(0, 40)) : (m.title ? `(${m.title.slice(0, 40)})` : '');
    if (label && !list.includes(label)) list.push(label);
    byPage.set(k, list);
  }
  return [...[...byPage.entries()].map(([k, v]) => (v.length ? `${k} ${v.join(', ')}` : k)), ...loose];
}

/** Quét trang SRS/SDS: mã UC-n / KEY-n / BR-n nhắc dưới đề mục nào. */
async function scanDocs(projectId: number, key: string) {
  const pages = await prisma.workPage.findMany({
    where: { projectId, deletedAt: null }, orderBy: { number: 'asc' }, take: 400,
    select: { id: true, number: true, title: true, templateKey: true, contentJson: true, issueLinks: { select: { issueId: true } } },
  });
  const byUc = new Map<number, Mention[]>();
  const byIssue = new Map<number, Mention[]>();
  const byIssueId = new Map<number, Mention[]>();
  const byRule = new Map<number, Mention[]>();
  const push = (m: Map<number, Mention[]>, n: number, x: Mention) => {
    const list = m.get(n) ?? [];
    if (!list.some((y) => y.kind === x.kind && y.page === x.page && y.heading === x.heading)) list.push(x);
    m.set(n, list);
  };
  for (const p of pages) {
    const kind = traceDocKind(p);
    if (!kind) continue;
    const { blocks } = textBlocks(p.contentJson);
    const seenHeadings = new Set<string>();
    for (const b of blocks) {
      const label: Mention = { kind, page: p.number, title: p.title, heading: b.heading };
      const text = `${b.heading && !seenHeadings.has(b.heading) ? `${b.heading}\n` : ''}${b.text}`;
      if (b.heading) seenHeadings.add(b.heading);
      for (const n of refsIn(text, 'UC')) push(byUc, n, label);
      for (const n of issueRefsIn(text, key)) push(byIssue, n, label);
      for (const n of refsIn(text, 'BR')) push(byRule, n, label);
    }
    for (const l of p.issueLinks) push(byIssueId, l.issueId, { kind, page: p.number, title: p.title, heading: null });
  }
  return { byUc, byIssue, byIssueId, byRule };
}

const roundStatus = (rounds: unknown): string | null => {
  const list = Array.isArray(rounds) ? (rounds as Array<{ status?: string | null }>) : [];
  for (let i = list.length - 1; i >= 0; i--) if (list[i]?.status) return String(list[i].status);
  return null;
};

export interface RtmData {
  projectName: string;
  key: string;
  rows: RtmRow[];
  rules: RuleCoverage[];
  orphans: Orphan[];
}

/** Dựng toàn bộ RTM (KHÔNG kiểm quyền — nơi gọi kiểm). */
export async function loadRtm(projectId: number): Promise<RtmData> {
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const key = project.key;
  const srs = await loadSrs(projectId);
  const ucs = inDocument(srs.useCases);
  const sections = new Map(ucSpecSection({ actors: srs.actors, useCases: srs.useCases, rules: srs.rules }).sections.map((s) => [s.useCaseId, s.number]));
  // CTW Diagram: sequence diagram (DRAFT/APPROVED, không tính đề xuất AI chưa duyệt) của từng UC ⇒ cột SDS + chỗ hở NO_SEQUENCE.
  const seqRows = await prisma.workDiagram.findMany({ where: { projectId, deletedAt: null, diagramType: 'SEQUENCE', useCaseId: { not: null }, status: { not: 'PROPOSED' } }, orderBy: { number: 'asc' }, select: { number: true, useCaseId: true, status: true } });
  const seqOf = (ucId: number) => seqRows.filter((d) => d.useCaseId === ucId).map((d) => `D-${d.number}${d.status === 'APPROVED' ? '' : ' (draft)'}`);

  const [ucIssue, reqIssues, screens, functions, trace, docs] = await Promise.all([
    prisma.workUseCase.findMany({ where: { projectId, status: { not: 'PROPOSED' } }, select: { id: true, issueId: true } }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, type: { key: { in: REQ_TYPES } } }, orderBy: [{ number: 'asc' }], take: 2000,
      select: { id: true, number: true, title: true },
    }),
    prisma.workSrsScreen.findMany({ where: { projectId }, select: { id: true, name: true, issueId: true } }),
    prisma.workSrsFunction.findMany({ where: { projectId }, select: { id: true, name: true, issueId: true } }),
    prisma.workTraceLink.findMany({ where: { projectId }, orderBy: { id: 'asc' } }),
    scanDocs(projectId, key),
  ]);
  const ucIssueId = new Map(ucIssue.map((u) => [u.id, u.issueId]));
  const linkedIssueIds = new Set(ucIssue.map((u) => u.issueId).filter((x): x is number => !!x));

  // Thẻ gốc của mỗi dòng (UC ⇒ thẻ gắn; REQ ⇒ chính nó) + thẻ con (commit/PR/Bug của việc con tính cho yêu cầu cha).
  const baseIds = uniq([...linkedIssueIds, ...reqIssues.map((r) => r.id)]);
  const issues = baseIds.length ? await prisma.workIssue.findMany({
    where: { id: { in: baseIds } },
    select: {
      id: true, number: true, title: true, deletedAt: true, resolvedAt: true,
      status: { select: { category: true } }, fixVersion: { select: { name: true } }, sprint: { select: { name: true } },
      children: { where: { deletedAt: null }, select: { id: true, number: true, type: { select: { key: true } } } },
    },
  }) : [];
  const issueById = new Map(issues.map((i) => [i.id, i]));
  const familyOf = (id: number | null | undefined): number[] => {
    if (!id) return [];
    const i = issueById.get(id);
    return i && !i.deletedAt ? [i.id, ...i.children.map((c) => c.id)] : [];
  };
  const allIds = uniq(baseIds.flatMap((id) => familyOf(id)));

  const [dev, testLinks, bugLinks, bugChildren, unitFns, itModules] = await Promise.all([
    allIds.length ? prisma.workDevActivity.findMany({ where: { issueId: { in: allIds } }, orderBy: { updatedAt: 'desc' }, select: { issueId: true, kind: true, title: true, url: true } }) : [],
    allIds.length ? prisma.workIssueLink.findMany({
      where: { type: 'TESTS', toIssueId: { in: allIds }, fromIssue: { deletedAt: null, type: { key: 'TEST' } } },
      select: { toIssueId: true, fromIssue: { select: { id: true, number: true, title: true, testCase: { select: { id: true } } } } },
    }) : [],
    allIds.length ? prisma.workIssueLink.findMany({
      where: { OR: [{ fromIssueId: { in: allIds }, toIssue: { deletedAt: null, type: { key: 'BUG' } } }, { toIssueId: { in: allIds }, fromIssue: { deletedAt: null, type: { key: 'BUG' } } }], type: { not: 'TESTS' } },
      select: { fromIssueId: true, toIssueId: true, fromIssue: { select: { id: true, number: true, title: true, resolvedAt: true, defectInfo: { select: { severity: true } } } }, toIssue: { select: { id: true, number: true, title: true, resolvedAt: true, defectInfo: { select: { severity: true } } } } },
    }) : [],
    allIds.length ? prisma.workIssue.findMany({ where: { parentId: { in: allIds }, deletedAt: null, type: { key: 'BUG' } }, select: { id: true, number: true, title: true, resolvedAt: true, parentId: true, defectInfo: { select: { severity: true } } } }) : [],
    prisma.workUnitFunction.findMany({ where: { projectId }, orderBy: { position: 'asc' }, take: 600, select: { id: true, moduleName: true, methodName: true, sheetName: true, description: true, testRequirement: true, codeRef: true, cases: { select: { result: true, defectId: true } } } }),
    prisma.workItModule.findMany({ where: { projectId }, orderBy: { position: 'asc' }, take: 400, select: { id: true, kind: true, name: true, description: true, testRequirement: true, cases: { select: { description: true, rounds: true } } } }),
  ]);

  // Xray: lần chạy gần nhất + lỗi từ lần chạy.
  const caseIds = uniq(testLinks.map((l) => l.fromIssue.testCase?.id).filter((x): x is number => !!x));
  const [runs, runDefects] = caseIds.length ? await Promise.all([
    prisma.workTestRun.findMany({ where: { testCaseId: { in: caseIds }, status: { not: 'TODO' } }, orderBy: { updatedAt: 'desc' }, select: { testCaseId: true, status: true } }),
    prisma.workTestRunDefect.findMany({ where: { run: { testCaseId: { in: caseIds } }, issue: { deletedAt: null } }, select: { run: { select: { testCaseId: true } }, issue: { select: { id: true, number: true, title: true, resolvedAt: true, defectInfo: { select: { severity: true } } } } } }),
  ]) : [[], []];
  const lastRun = new Map<number, string>();
  for (const r of runs) if (!lastRun.has(r.testCaseId)) lastRun.set(r.testCaseId, r.status);

  // Bộ test 5.1/5.2/5.3 + chữ để dò mã.
  const unitSets = unitFns.map((f) => ({
    id: f.id, kind: 'UNIT' as const, text: `${f.moduleName}.${f.methodName}\n${f.description ?? ''}\n${f.testRequirement ?? ''}\n${f.codeRef ?? ''}`,
    defects: f.cases.map((c) => c.defectId ?? '').join(' '),
    set: {
      name: f.sheetName || f.methodName, ref: `${f.moduleName}.${f.methodName}`, cases: f.cases.length,
      passed: f.cases.filter((c) => c.result === 'P').length, failed: f.cases.filter((c) => c.result === 'F').length, notRun: f.cases.filter((c) => !c.result).length,
    } satisfies TestSet,
  }));
  const moduleSets = itModules.map((m) => {
    const st = m.cases.map((c) => roundStatus(c.rounds));
    return {
      id: m.id, kind: (m.kind === 'SYS' ? 'ST' : 'IT') as 'IT' | 'ST',
      text: `${m.name}\n${m.description ?? ''}\n${m.testRequirement ?? ''}\n${m.cases.map((c) => c.description).join('\n').slice(0, 20_000)}`,
      set: { name: m.name, cases: m.cases.length, passed: st.filter((s) => s === 'Passed').length, failed: st.filter((s) => s === 'Failed').length, notRun: st.filter((s) => !s || s === 'Pending').length } satisfies TestSet,
    };
  });

  const traceOf = (kind: 'UC' | 'ISSUE' | 'BR', id: number) => trace.filter((t) => t.sourceKind === kind && t.sourceId === id);

  const matchedUnit = new Set<number>();
  const matchedModule = new Set<number>();
  const matchedXray = new Set<number>();

  /** Mọi thứ dò được cho một nhóm thẻ + (tuỳ chọn) một số UC. */
  function collect(o: { ucNumber: number | null; ucId: number | null; issueId: number | null }) {
    const fam = familyOf(o.issueId);
    const famNumbers = fam.map((id) => issueById.get(id)?.number ?? [...issueById.values()].flatMap((i) => i.children).find((c) => c.id === id)?.number).filter((x): x is number => !!x);
    const mentionsText = (text: string) => (o.ucNumber !== null && refsIn(text, 'UC').includes(o.ucNumber)) || issueRefsIn(text, key).some((n) => famNumbers.includes(n));
    const srsM: Mention[] = [];
    const sdsM: Mention[] = [];
    const addM = (ms: Mention[] | undefined) => { for (const m of ms ?? []) (m.kind === 'SRS' ? srsM : sdsM).push(m); };
    if (o.ucNumber !== null) addM(docs.byUc.get(o.ucNumber));
    for (const n of famNumbers) addM(docs.byIssue.get(n));
    for (const id of fam) addM(docs.byIssueId.get(id));
    const manual = [...(o.ucId ? traceOf('UC', o.ucId) : []), ...(o.issueId ? traceOf('ISSUE', o.issueId) : [])];
    for (const t of manual) {
      const m: Mention = { kind: t.targetKind === 'SRS' ? 'SRS' : 'SDS', page: t.pageNumber, title: null, heading: t.heading, ref: t.ref };
      if (t.targetKind === 'SRS') srsM.push(m);
      if (t.targetKind === 'SDS') sdsM.push(m);
    }
    const unit = unitSets.filter((u) => mentionsText(u.text) || manual.some((t) => t.targetKind === 'UNIT' && t.targetId === u.id));
    const mods = moduleSets.filter((m) => mentionsText(m.text) || manual.some((t) => (t.targetKind === 'IT' || t.targetKind === 'ST') && t.targetId === m.id));
    unit.forEach((u) => matchedUnit.add(u.id));
    mods.forEach((m) => matchedModule.add(m.id));
    const devRows = dev.filter((d) => fam.includes(d.issueId));
    const xray = testLinks.filter((l) => fam.includes(l.toIssueId));
    xray.forEach((l) => matchedXray.add(l.fromIssue.id));
    const bugs = new Map<number, { key: string; title: string; open: boolean; severity: string | null }>();
    const addBug = (b: { id: number; number: number; title: string; resolvedAt: Date | null; defectInfo: { severity: string | null } | null }) => bugs.set(b.id, { key: `${key}-${b.number}`, title: b.title, open: !b.resolvedAt, severity: b.defectInfo?.severity ?? null });
    for (const d of runDefects) if (xray.some((l) => l.fromIssue.testCase?.id === d.run.testCaseId)) addBug(d.issue);
    for (const b of bugChildren) if (b.parentId && fam.includes(b.parentId)) addBug(b);
    for (const l of bugLinks) {
      if (fam.includes(l.fromIssueId)) addBug(l.toIssue);
      if (fam.includes(l.toIssueId)) addBug(l.fromIssue);
    }
    // Defect ID của UTCID ("CTW-12") trong các hàm 5.1 thuộc yêu cầu này.
    const unitDefects = uniq(unit.flatMap((u) => issueRefsIn(u.defects, key)));
    return {
      srs: compactRefs(srsM), sds: compactRefs(sdsM),
      classMethod: uniq([...manual.filter((t) => t.targetKind === 'CODE' && t.ref).map((t) => t.ref!), ...unit.map((u) => u.set.ref!)]),
      unit: unit.map((u) => u.set), integration: mods.filter((m) => m.kind === 'IT').map((m) => m.set), system: mods.filter((m) => m.kind === 'ST').map((m) => m.set),
      code: {
        commits: devRows.filter((d) => d.kind === 'COMMIT').length, prs: devRows.filter((d) => d.kind === 'PR').length, branches: devRows.filter((d) => d.kind === 'BRANCH').length,
        latest: devRows[0] ? { title: devRows[0].title, url: devRows[0].url } : null,
      },
      xray: xray.map((l) => ({ key: `${key}-${l.fromIssue.number}`, title: l.fromIssue.title, last: l.fromIssue.testCase ? lastRun.get(l.fromIssue.testCase.id) ?? null : null })),
      bugs: [...bugs.values()], unitDefects,
    };
  }

  const iterationOf = (id: number | null | undefined) => {
    const i = id ? issueById.get(id) : undefined;
    return i?.fixVersion?.name ?? i?.sprint?.name ?? '';
  };
  const rows: RtmRow[] = [];
  const ruleName = new Map(srs.rules.map((r) => [r.number, r]));
  for (const u of ucs) {
    const issueId = ucIssueId.get(u.id) ?? null;
    const iss = issueId ? issueById.get(issueId) : undefined;
    const c = collect({ ucNumber: u.number, ucId: u.id, issueId: iss && !iss.deletedAt ? issueId : null });
    const sec = sections.get(u.id);
    const scr = uniq([...screens.filter((s) => s.issueId && s.issueId === issueId).map((s) => s.name), ...functions.filter((f) => f.issueId && f.issueId === issueId).map((f) => `Non-UI: ${f.name}`)]);
    const base: Omit<RtmRow, 'status' | 'gaps'> = {
      reqId: ucKey(u.number), kind: 'UC', ucNumber: u.number, issueNumber: iss && !iss.deletedAt ? iss.number : null, issueKey: iss && !iss.deletedAt ? `${key}-${iss.number}` : null,
      requirement: u.name, feature: u.feature ?? '', rules: u.ruleNumbers.filter((n) => ruleName.has(n)).map(brKey),
      // Trang Report 3 đã có mục của UC ⇒ dùng số mục thật của trang; chưa có ⇒ số mục sẽ sinh khi xuất Report 3.
      srs: c.srs.length ? c.srs : sec ? [`Report 3 §${sec} (generated)`] : [], screens: scr, sds: [...c.sds, ...seqOf(u.id).map((k) => `Sequence ${k}`)], code: c.code, sequence: seqOf(u.id),
      classMethod: c.classMethod, unit: c.unit, integration: c.integration, system: c.system, xray: c.xray, bugs: c.bugs,
      iteration: iterationOf(issueId), issueDone: !!iss?.resolvedAt || iss?.status.category === 'DONE', ucMissing: ucMissing(u),
    };
    rows.push({ ...base, ...evaluateRow(base) });
  }
  for (const r of reqIssues) {
    if (linkedIssueIds.has(r.id)) continue;
    const iss = issueById.get(r.id);
    const c = collect({ ucNumber: null, ucId: null, issueId: r.id });
    const scr = uniq([...screens.filter((s) => s.issueId === r.id).map((s) => s.name), ...functions.filter((f) => f.issueId === r.id).map((f) => `Non-UI: ${f.name}`)]);
    const base: Omit<RtmRow, 'status' | 'gaps'> = {
      reqId: `${key}-${r.number}`, kind: 'REQ', ucNumber: null, issueNumber: r.number, issueKey: `${key}-${r.number}`,
      requirement: r.title, feature: '', rules: [], srs: c.srs, screens: scr, sds: c.sds, code: c.code, classMethod: c.classMethod,
      unit: c.unit, integration: c.integration, system: c.system, xray: c.xray, bugs: c.bugs,
      iteration: iterationOf(r.id), issueDone: !!iss?.resolvedAt || iss?.status.category === 'DONE', ucMissing: [],
    };
    rows.push({ ...base, ...evaluateRow(base) });
  }

  // Business rule ⇒ test (bảng phụ của RTM).
  const rules: RuleCoverage[] = inDocument(srs.rules).map((br) => {
    const manual = traceOf('BR', br.id);
    const mentions = (text: string) => refsIn(text, 'BR').includes(br.number);
    const unit = unitSets.filter((u) => mentions(u.text) || manual.some((t) => t.targetKind === 'UNIT' && t.targetId === u.id));
    const mods = moduleSets.filter((m) => mentions(m.text) || manual.some((t) => (t.targetKind === 'IT' || t.targetKind === 'ST') && t.targetId === m.id));
    unit.forEach((u) => matchedUnit.add(u.id));
    mods.forEach((m) => matchedModule.add(m.id));
    const r = {
      key: brKey(br.number), name: br.name, usedIn: ucs.filter((u) => u.ruleNumbers.includes(br.number)).map((u) => ucKey(u.number)),
      unit: unit.map((u) => `${u.set.ref} (${u.set.cases})`), integration: mods.filter((m) => m.kind === 'IT').map((m) => `${m.set.name} (${m.set.cases})`),
      system: mods.filter((m) => m.kind === 'ST').map((m) => `${m.set.name} (${m.set.cases})`),
    };
    return { ...r, covered: r.unit.length + r.integration.length + r.system.length > 0 };
  });

  // Test không truy ngược được về yêu cầu nào (truy vết ngược).
  const allTests = await prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'TEST' } }, select: { id: true, number: true, title: true }, take: 3000 });
  const orphans: Orphan[] = [
    ...allTests.filter((t) => !matchedXray.has(t.id)).map((t) => ({ kind: 'XRAY' as const, ref: `${key}-${t.number}`, name: t.title })),
    ...unitSets.filter((u) => !matchedUnit.has(u.id)).map((u) => ({ kind: 'UNIT' as const, ref: u.set.ref!, name: u.set.name })),
    ...moduleSets.filter((m) => !matchedModule.has(m.id)).map((m) => ({ kind: m.kind, ref: m.set.name, name: `${m.set.cases} case(s)` })),
  ];
  return { projectName: project.name, key, rows, rules, orphans };
}

export const rtmQuery = z.object({
  gap: z.enum([...GAP_CODES, 'ANY'] as [string, ...string[]]).optional(),
  status: z.string().max(20).optional(),
  q: z.string().max(200).optional(),
  kind: z.enum(['UC', 'REQ']).optional(),
});

export async function getRtm(userId: number, projectId: number, q: z.infer<typeof rtmQuery> = {}) {
  await srsCtx(userId, projectId, 'view');
  const d = await loadRtm(projectId);
  return {
    rows: filterRows(d.rows, { gap: (q.gap as GapCode | 'ANY' | undefined) ?? null, status: q.status ?? null, text: q.q ?? null, kind: q.kind ?? null }),
    summary: summarize(d.rows),
    rules: d.rules,
    orphans: d.orphans,
    gapLabels: GAP_LABEL,
    // CTW đợt 4b (R23): sáu liên kết người chấm SWR302 dò — tóm tắt cạnh RTM, chi tiết ở trang Wiegers.
    sixLinks: await (await import('./swr.service.js')).sixLinksData(projectId).then((x) => ({ passed: x.passed, ok: x.ok, links: x.links.map((l) => ({ n: l.n, key: l.key, title: l.title, ok: l.ok, errors: l.gaps.filter((g) => g.severity === 'error').length })) })).catch(() => null),
  };
}

export async function exportRtm(userId: number, projectId: number) {
  await srsCtx(userId, projectId, 'view');
  const d = await loadRtm(projectId);
  // CTW đợt 4b (R23): sheet "Six links" cuối tệp — bảng kiểm sáu liên kết + chỗ đứt (phụ lục RTM của bài SWR302).
  const swr = await import('./swr.service.js');
  const { sixLinksSheet } = await import('./swr.js');
  const six = await swr.sixLinksData(projectId);
  const buffer = writeXlsx([...buildRtmSheets({ projectName: d.projectName, rows: d.rows, rules: d.rules, orphans: d.orphans, generated: new Date().toISOString().slice(0, 10) }), sixLinksSheet(six, d.projectName)], { title: `RTM — ${d.projectName}`, creator: 'CT Work' });
  return { buffer, file: `${d.key}_RTM.xlsx` };
}

// ─── Liên kết truy vết đặt tay ───────────────────────────────────

export const traceInput = z.object({
  source: z.object({ kind: z.enum(['UC', 'ISSUE', 'BR']), ref: z.union([z.number().int().positive(), z.string().min(1).max(30)]) }),
  target: z.object({
    kind: z.enum(['SRS', 'SDS', 'UNIT', 'IT', 'ST', 'CODE']),
    pageNumber: z.number().int().positive().optional(),
    heading: z.string().max(255).optional(),
    targetId: z.number().int().positive().optional(),
    ref: z.string().max(300).optional(),
  }),
});
export type TraceInput = z.infer<typeof traceInput>;

async function sourceId(projectId: number, key: string, s: TraceInput['source']): Promise<number> {
  const num = (v: number | string, prefix: string) => (typeof v === 'number' ? v : Number(new RegExp(`^(?:${prefix}-?)?0*(\\d+)$`, 'i').exec(v.trim())?.[1] ?? NaN));
  if (s.kind === 'UC') {
    const u = await prisma.workUseCase.findFirst({ where: { projectId, number: num(s.ref, 'UC') }, select: { id: true } });
    if (!u) throw new NotFoundError('Use case not found');
    return u.id;
  }
  if (s.kind === 'BR') {
    const r = await prisma.workBusinessRule.findFirst({ where: { projectId, number: num(s.ref, 'BR') }, select: { id: true } });
    if (!r) throw new NotFoundError('Business rule not found');
    return r.id;
  }
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: num(s.ref, key), deletedAt: null }, select: { id: true } });
  if (!i) throw new NotFoundError('Issue not found');
  return i.id;
}

export async function addTraceLink(userId: number, projectId: number, input: TraceInput) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  const id = await sourceId(projectId, ctx.access.key, input.source);
  const t = input.target;
  if ((t.kind === 'SRS' || t.kind === 'SDS') && !t.pageNumber && !t.heading) throw new BadRequestError('Say which document page or section', 'VALIDATION_ERROR');
  if (t.pageNumber && !(await prisma.workPage.findFirst({ where: { projectId, number: t.pageNumber, deletedAt: null }, select: { id: true } }))) throw new BadRequestError('Document page not found', 'WORK_BAD_PAGE');
  if (t.kind === 'UNIT' && !(t.targetId && (await prisma.workUnitFunction.findFirst({ where: { id: t.targetId, projectId }, select: { id: true } })))) throw new BadRequestError('Unit-tested function not found', 'WORK_BAD_TARGET');
  if ((t.kind === 'IT' || t.kind === 'ST') && !(t.targetId && (await prisma.workItModule.findFirst({ where: { id: t.targetId, projectId, kind: t.kind === 'ST' ? 'SYS' : 'INT' }, select: { id: true } })))) throw new BadRequestError('Test module not found', 'WORK_BAD_TARGET');
  if (t.kind === 'CODE' && !t.ref?.trim()) throw new BadRequestError('Give the class.method or file path', 'VALIDATION_ERROR');
  const row = await prisma.workTraceLink.create({
    data: { projectId, sourceKind: input.source.kind, sourceId: id, targetKind: t.kind, targetId: t.targetId ?? null, pageNumber: t.pageNumber ?? null, heading: t.heading?.trim() || null, ref: t.ref?.trim() || null, createdById: userId },
  });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return row;
}

export async function listTraceLinks(userId: number, projectId: number, source?: TraceInput['source']) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const where = source ? { projectId, sourceKind: source.kind, sourceId: await sourceId(projectId, ctx.access.key, source) } : { projectId };
  return prisma.workTraceLink.findMany({ where, orderBy: { id: 'asc' }, take: 2000 });
}

export async function removeTraceLink(userId: number, projectId: number, id: number) {
  await srsCtx(userId, projectId, 'edit');
  const r = await prisma.workTraceLink.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Trace link not found');
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return { deleted: true };
}
