/**
 * CT Work đợt 7c — TST-2 "Công cụ & tự động": nhập kết quả test tự động từ CI vào Xray của dự án.
 *
 *   POST /projects/:pid/tests/automation/import   (token API scope `tests:write`, hoặc phiên web có quyền sửa thẻ)
 *
 * Một lần nhập:
 *   1. Đọc báo cáo (JUnit XML / Playwright JSON / Jest-Vitest JSON — testResults.ts) + độ phủ nếu có (lcov/JaCoCo/Cobertura).
 *   2. KHỚP test tự động theo khoá `suite::tên` (work_auto_tests) ⇒ test case Xray có sẵn; chưa có ⇒ TẠO thẻ Test loại
 *      AUTOMATED (trần MAX_NEW_CASES mỗi lần — phần còn lại tạo ở lần sau, kết quả vẫn ghi lịch sử).
 *   3. Tạo test cycle "CI · <build>" (hoặc nhập thêm vào cycle chưa xong cùng tên khi gửi `cycle`), mỗi test một run
 *      PASS/FAIL/SKIP + lời nhắn lỗi.
 *   4. Lịch sử P/F/S/R ⇒ đánh dấu FLAKY (đỏ/xanh xen kẽ — `flakiness`).
 *   5. Bug cho lỗi MỚI, CHỐNG TRÙNG ba lớp: (a) test đã có bug còn mở ⇒ gắn run vào bug đó; (b) cùng chữ ký lỗi
 *      (suite + dòng lỗi chuẩn hoá) đã có bug mở trong dự án / trong lần nhập này ⇒ gắn vào; (c) test flaky ⇒ KHÔNG mở bug
 *      (chỉ đánh dấu). Trần MAX_NEW_BUGS mỗi lần nhập (CI đỏ cả loạt không xả 500 bug).
 *   6. Báo luật tự động: tín hiệu `test.failed` cho từng test đỏ (không flaky, trần 20).
 *
 * Mỗi dự án nhập TUẦN TỰ (khoá trong tiến trình) — hai job CI gửi cùng lúc không tạo trùng test case.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { emitWorkEvent } from './events.js';
import { createIssueAs } from './issues.service.js';
import { requireProject } from './permissions.js';
import { emitAutomationSignal } from './automationSignals.js';
import {
  failSignature, flakiness, historyChar, keyHash, parseCoverage, parseReport, pushHistory, summarize, testKey,
  type CoverageFormat, type ParsedCoverage, type ResultFormat, type TestResult,
} from './testResults.js';

export const MAX_NEW_CASES = 1000;
export const MAX_NEW_BUGS = 20;
const MAX_REPORT_BYTES = 10 * 1024 * 1024;
const IMPORTS_PER_10_MIN = 30;

export interface ImportInput {
  report: string | object;
  format?: ResultFormat | 'AUTO';
  build?: string | null;
  branch?: string | null;
  commit?: string | null;
  runUrl?: string | null;
  environment?: string | null;
  /** Tên cycle — có cycle CHƯA XONG cùng tên ⇒ nhập thêm vào đó (gộp nhiều job CI). Không gửi ⇒ cycle mới mỗi lần. */
  cycle?: string | null;
  createBugs?: boolean;
  coverage?: { report: string; format?: CoverageFormat | 'AUTO' } | null;
}

export interface ImportMeta { source: 'API' | 'UPLOAD'; tokenId?: number | null }

// ─── Khoá tuần tự theo dự án + trần lượt ─────────────────────────

const chains = new Map<number, Promise<unknown>>();
function serial<T>(projectId: number, fn: () => Promise<T>): Promise<T> {
  const prev = chains.get(projectId) ?? Promise.resolve();
  const run = prev.catch(() => undefined).then(fn);
  chains.set(projectId, run);
  void run.finally(() => { if (chains.get(projectId) === run) chains.delete(projectId); }).catch(() => undefined);
  return run;
}
const recent = new Map<number, number[]>();
function rateLimit(projectId: number) {
  const now = Date.now();
  const list = (recent.get(projectId) ?? []).filter((t) => now - t < 600_000);
  if (list.length >= IMPORTS_PER_10_MIN) throw new AppError(`Too many imports for this project — at most ${IMPORTS_PER_10_MIN} every 10 minutes`, 429, 'WORK_RATE_LIMIT');
  list.push(now);
  recent.set(projectId, list);
}
/** Test: xoá trần lượt giữa các ca. */
export function _resetImportLimits(): void { recent.clear(); }

const DEFECT_ACTIVITY: Record<ResultFormat, string> = { JUNIT: 'UT', JEST: 'UT', PLAYWRIGHT: 'ST' };
const TOOL_LABEL: Record<ResultFormat, string> = { JUNIT: 'CI · JUnit', JEST: 'CI · Jest/Vitest', PLAYWRIGHT: 'CI · Playwright' };
const cleanStr = (s: string | null | undefined, n: number) => (s ?? '').trim().slice(0, n) || null;

const para = (text: string) => ({ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] });
const heading = (text: string) => ({ type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text }] });
const codeBlock = (text: string) => ({ type: 'codeBlock', attrs: { language: 'text' }, content: text ? [{ type: 'text', text }] : [] });

function bugDoc(r: TestResult, input: ImportInput, format: ResultFormat) {
  const ctx = [
    input.build && `Build: ${input.build}`, input.branch && `Branch: ${input.branch}`, input.commit && `Commit: ${input.commit.slice(0, 12)}`,
    input.environment && `Environment: ${input.environment}`,
  ].filter(Boolean).join(' · ');
  return {
    type: 'doc',
    content: [
      para(`Automated test failed in CI (${TOOL_LABEL[format]}).${ctx ? ` ${ctx}.` : ''}`),
      heading('Test'),
      para(`${r.suite ? `${r.suite} › ` : ''}${r.name}${r.file ? ` (${r.file})` : ''}`),
      heading('Failure'),
      para(r.message ?? 'Failed'),
      ...(r.details ? [codeBlock(r.details)] : []),
      ...(input.runUrl ? [heading('CI run'), para(input.runUrl)] : []),
      para('Opened automatically by CT Work test automation. Re-runs of the same failure are linked here instead of opening a new bug.'),
    ],
  };
}

async function openBug(projectId: number, issueId: number | null): Promise<{ id: number; number: number } | null> {
  if (!issueId) return null;
  return prisma.workIssue.findFirst({ where: { id: issueId, projectId, deletedAt: null, resolvedAt: null }, select: { id: true, number: true } });
}

export async function importResults(userId: number, projectId: number, input: ImportInput, meta: ImportMeta) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const raw = typeof input.report === 'string' ? input.report : JSON.stringify(input.report ?? '');
  if (!raw.trim()) throw new BadRequestError('The report is empty', 'WORK_TEST_REPORT');
  if (Buffer.byteLength(raw) > MAX_REPORT_BYTES) throw new BadRequestError('The report is larger than 10 MB', 'WORK_TEST_REPORT');
  let parsed;
  try { parsed = parseReport(input.report, input.format); } catch (err) {
    throw new BadRequestError((err as Error).message, 'WORK_TEST_REPORT');
  }
  let coverage: ParsedCoverage | null = null;
  if (input.coverage?.report?.trim()) {
    if (Buffer.byteLength(input.coverage.report) > MAX_REPORT_BYTES) throw new BadRequestError('The coverage report is larger than 10 MB', 'WORK_COVERAGE_REPORT');
    try { coverage = parseCoverage(input.coverage.report, input.coverage.format); } catch (err) {
      throw new BadRequestError(`Coverage: ${(err as Error).message}`, 'WORK_COVERAGE_REPORT');
    }
  }
  if (!parsed.results.length && !coverage) throw new BadRequestError('The report has no test results', 'WORK_TEST_REPORT');
  const testType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'TEST', archived: false }, select: { id: true } });
  if (!testType) throw new AppError('Test management is not enabled for this project — enable it on the Tests page first', 409, 'WORK_TESTS_DISABLED');
  rateLimit(projectId);
  return serial(projectId, () => doImport(userId, projectId, access.key, input, meta, parsed.format, parsed.results, parsed.durationMs, coverage));
}

async function doImport(
  userId: number, projectId: number, key: string, input: ImportInput, meta: ImportMeta,
  format: ResultFormat, resultsIn: TestResult[], durationMs: number | null, coverage: ParsedCoverage | null,
) {
  // Cùng khoá xuất hiện hai lần (chạy lại trong cùng báo cáo) ⇒ lấy lần CUỐI, đánh dấu đã chạy lại.
  const byKey = new Map<string, TestResult>();
  for (const r of resultsIn) {
    const k = testKey(r);
    const prev = byKey.get(k);
    byKey.set(k, prev && prev.status === 'FAIL' && r.status === 'PASS' ? { ...r, retried: true } : r);
  }
  const results = [...byKey.entries()];
  const now = new Date();

  // 1. Khớp / tạo test tự động + test case.
  const hashes = results.map(([k]) => keyHash(k));
  const existing = await prisma.workAutoTest.findMany({ where: { projectId, keyHash: { in: hashes } } });
  const byHash = new Map(existing.map((e) => [e.keyHash, e]));
  const liveCases = new Set((await prisma.workTestCase.findMany({
    where: { id: { in: existing.map((e) => e.testCaseId).filter((x): x is number => !!x) }, issue: { deletedAt: null } },
    select: { id: true },
  })).map((c) => c.id));
  const testType = (await prisma.workIssueType.findFirst({ where: { projectId, key: 'TEST', archived: false }, select: { id: true } }))!;
  let newCases = 0;
  let deferredCases = 0;
  const rows: Array<{ r: TestResult; at: { id: number; testCaseId: number | null; history: string; bugIssueId: number | null; lastStatus: string | null; flaky: boolean }; testIssueId: number | null }> = [];
  for (const [k, r] of results) {
    const h = keyHash(k);
    let at = byHash.get(h) ?? null;
    let testCaseId = at?.testCaseId && liveCases.has(at.testCaseId) ? at.testCaseId : null;
    if (!testCaseId) {
      if (newCases < MAX_NEW_CASES) {
        const title = `${r.suite ? `${r.suite} › ` : ''}${r.name}`.slice(0, 255);
        const issue = await createIssueAs(userId, projectId, { typeId: testType.id, title });
        const tc = await prisma.workTestCase.upsert({
          where: { issueId: issue.id },
          create: { issueId: issue.id, kind: 'AUTOMATED', preconditions: r.file ? `Automated test in ${r.file}` : null },
          update: { kind: 'AUTOMATED' },
          select: { id: true },
        });
        testCaseId = tc.id;
        newCases += 1;
      } else {
        deferredCases += 1;
      }
    }
    if (!at) {
      at = await prisma.workAutoTest.upsert({
        where: { projectId_keyHash: { projectId, keyHash: h } },
        create: { projectId, keyHash: h, key: k, suite: r.suite?.slice(0, 300) ?? null, name: r.name.slice(0, 500), file: r.file?.slice(0, 500) ?? null, testCaseId, lastSeenAt: now },
        update: {},
      });
    } else if (at.testCaseId !== testCaseId && testCaseId) {
      at = await prisma.workAutoTest.update({ where: { id: at.id }, data: { testCaseId } });
    }
    const tcIssue = testCaseId ? await prisma.workTestCase.findUnique({ where: { id: testCaseId }, select: { issueId: true } }) : null;
    rows.push({ r, at: { id: at.id, testCaseId, history: at.history, bugIssueId: at.bugIssueId, lastStatus: at.lastStatus, flaky: at.flaky }, testIssueId: tcIssue?.issueId ?? null });
  }

  // 2. Cycle.
  const cycleName = (input.cycle?.trim() || `CI · ${input.build?.trim() || input.branch?.trim() || now.toISOString().slice(0, 16).replace('T', ' ')}`).slice(0, 120);
  let cycle = input.cycle?.trim()
    ? await prisma.workTestCycle.findFirst({ where: { projectId, name: cycleName, state: { not: 'DONE' } }, orderBy: { id: 'desc' }, select: { id: true } })
    : null;
  const newCycle = !cycle;
  if (!cycle) {
    cycle = await prisma.workTestCycle.create({
      data: {
        projectId, name: cycleName, environment: cleanStr(input.environment, 120) ?? (input.branch ? `branch ${input.branch}`.slice(0, 120) : null),
        build: cleanStr(input.build ?? input.commit?.slice(0, 12), 80), state: input.cycle?.trim() ? 'IN_PROGRESS' : 'DONE',
        startAt: now, endAt: input.cycle?.trim() ? null : now, createdById: userId,
      },
      select: { id: true },
    });
  }

  // 3. Run + lịch sử + flaky + bug.
  const createBugs = input.createBugs !== false;
  const bugType = createBugs ? await prisma.workIssueType.findFirst({ where: { projectId, key: 'BUG', archived: false }, select: { id: true } }) : null;
  const sigBugs = new Map<string, { id: number; number: number }>();
  let newBugs = 0, linkedBugs = 0, flakyNow = 0, bugCapHit = 0;
  const failedForSignals: Array<{ issueId: number; name: string; message: string | null }> = [];
  const report: Array<{ key: string; name: string; status: string; flaky: boolean; bug: number | null; newBug: boolean }> = [];

  for (const { r, at, testIssueId } of rows) {
    const history = pushHistory(at.history, historyChar(r));
    const fl = flakiness(history);
    if (fl.flaky) flakyNow += 1;
    const sig = r.status === 'FAIL' ? failSignature(r) : null;
    let bug: { id: number; number: number } | null = null;
    let isNewBug = false;
    if (r.status === 'FAIL' && createBugs) {
      bug = await openBug(projectId, at.bugIssueId);
      if (!bug && sig) {
        bug = sigBugs.get(sig) ?? null;
        if (!bug) {
          const same = await prisma.workAutoTest.findMany({ where: { projectId, failSignature: sig, bugIssueId: { not: null } }, select: { bugIssueId: true }, take: 20 });
          for (const s of same) { bug = await openBug(projectId, s.bugIssueId); if (bug) break; }
        }
      }
      if (!bug && !fl.flaky && bugType) {
        if (newBugs < MAX_NEW_BUGS) {
          try {
            const issue = await createIssueAs(userId, projectId, {
              typeId: bugType.id, title: `[CI] ${r.name} fails`.slice(0, 255),
              descriptionJson: bugDoc(r, input, format) as unknown as Prisma.InputJsonValue, priority: 2,
            });
            bug = { id: issue.id, number: issue.number };
            isNewBug = true;
            newBugs += 1;
            await prisma.workDefectInfo.upsert({
              where: { issueId: issue.id },
              create: { issueId: issue.id, projectId, severity: 'MAJOR', activity: DEFECT_ACTIVITY[format], detectedByTool: TOOL_LABEL[format], testLevel: format === 'PLAYWRIGHT' ? 'SYSTEM' : 'COMPONENT' },
              update: {},
            });
            if (testIssueId) {
              await prisma.workIssueLink.createMany({ data: [{ fromIssueId: testIssueId, toIssueId: issue.id, type: 'RELATES', createdById: userId }], skipDuplicates: true }).catch(() => undefined);
            }
          } catch (err) {
            logger.warn('[work] test import: không tạo được bug', { projectId, err: (err as Error).message });
          }
        } else {
          bugCapHit += 1;
        }
      }
      if (bug && !isNewBug) linkedBugs += 1;
      if (bug && sig) sigBugs.set(sig, bug);
    }
    await prisma.workAutoTest.update({
      where: { id: at.id },
      data: {
        history, lastStatus: r.status, lastDurationMs: r.durationMs, flaky: fl.flaky, flakyScore: fl.score, lastSeenAt: now,
        ...(r.status === 'FAIL' ? { failSignature: sig, ...(bug ? { bugIssueId: bug.id } : {}) } : {}),
      },
    });
    if (at.testCaseId) {
      const comment = r.status === 'FAIL'
        ? `${r.message ?? 'Failed'}${fl.flaky ? ' — flaky (alternating pass/fail)' : ''}`.slice(0, 2000)
        : r.retried ? 'Passed after a retry (possible flaky test)' : r.status === 'SKIP' ? (r.message ?? 'Skipped') : null;
      const run = await prisma.workTestRun.upsert({
        where: { uk_work_test_run: { cycleId: cycle.id, testCaseId: at.testCaseId } },
        create: { cycleId: cycle.id, testCaseId: at.testCaseId, status: r.status, executedById: userId, executedAt: now, comment },
        update: { status: r.status, executedById: userId, executedAt: now, comment },
        select: { id: true },
      });
      if (bug) await prisma.workTestRunDefect.createMany({ data: [{ runId: run.id, issueId: bug.id }], skipDuplicates: true });
    }
    if (r.status === 'FAIL' && !fl.flaky && testIssueId) failedForSignals.push({ issueId: testIssueId, name: r.name, message: r.message });
    report.push({ key: `${r.suite ?? ''}::${r.name}`.slice(0, 300), name: r.name, status: r.status, flaky: fl.flaky, bug: bug?.number ?? null, newBug: isNewBug });
  }

  const sum = summarize(rows.map((x) => x.r));
  const imp = await prisma.workTestImport.create({
    data: {
      projectId, cycleId: cycle.id, format, source: meta.source,
      build: cleanStr(input.build, 80), branch: cleanStr(input.branch, 120), commitSha: cleanStr(input.commit, 64), runUrl: safeUrl(input.runUrl),
      total: sum.total, passed: sum.passed, failed: sum.failed, skipped: sum.skipped, flaky: flakyNow, durationMs,
      newBugs, linkedBugs,
      coveragePct: coverage?.linePct ?? null, coverageBranchPct: coverage?.branchPct ?? null, coverageFormat: coverage?.format ?? null,
      coverageDetail: coverage ? ({ lines: coverage.lines, branches: coverage.branches, modules: coverage.modules } as unknown as Prisma.InputJsonValue) : undefined,
      tokenId: meta.tokenId ?? null, createdById: userId,
    },
    select: { id: true },
  });
  await auditProject(projectId, {
    actorId: userId, action: 'tests.import', targetType: 'test_import', targetId: imp.id,
    summary: `Imported ${format} results: ${sum.passed} passed, ${sum.failed} failed, ${sum.skipped} skipped${newBugs ? ` · ${newBugs} new bug${newBugs === 1 ? '' : 's'}` : ''}${meta.tokenId ? ' (API token)' : ''}`,
    detail: { cycleId: cycle.id, tokenId: meta.tokenId ?? null, coverage: coverage?.linePct ?? null },
  });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  // 4. Tín hiệu cho luật tự động (không chặn phản hồi; lỗi chỉ ghi log ở phía nghe).
  for (const f of failedForSignals.slice(0, 20)) {
    emitAutomationSignal({
      signal: 'test.failed', projectId, issueIds: [f.issueId], actorUserId: userId,
      data: { test: f.name, message: f.message ?? '', cycle: cycleName, build: input.build ?? '', key: `${key}` },
    });
  }
  return {
    importId: imp.id, cycleId: cycle.id, cycleName, newCycle, format,
    ...sum, flaky: flakyNow, newTestCases: newCases, deferredTestCases: deferredCases, newBugs, linkedBugs, bugsNotCreated: bugCapHit,
    coverage: coverage ? { format: coverage.format, linePct: coverage.linePct, branchPct: coverage.branchPct } : null,
    tests: report.slice(0, 200),
  };
}

function safeUrl(u: string | null | undefined): string | null {
  const s = (u ?? '').trim();
  if (!s) return null;
  try {
    const x = new URL(s);
    return x.protocol === 'https:' || x.protocol === 'http:' ? s.slice(0, 500) : null;
  } catch { return null; }
}

// ─── Xem ─────────────────────────────────────────────────────────

const num = (d: Prisma.Decimal | null) => (d === null ? null : Number(d));

export async function overview(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const [imports, tests] = await Promise.all([
    prisma.workTestImport.findMany({ where: { projectId }, orderBy: { id: 'desc' }, take: 30 }),
    prisma.workAutoTest.findMany({ where: { projectId }, orderBy: [{ flaky: 'desc' }, { flakyScore: 'desc' }, { lastSeenAt: 'desc' }], take: 500 }),
  ]);
  const caseIds = tests.map((t) => t.testCaseId).filter((x): x is number => !!x);
  const bugIds = tests.map((t) => t.bugIssueId).filter((x): x is number => !!x);
  const [cases, bugs, people] = await Promise.all([
    caseIds.length ? prisma.workTestCase.findMany({ where: { id: { in: caseIds }, issue: { deletedAt: null } }, select: { id: true, issue: { select: { number: true } } } }) : [],
    bugIds.length ? prisma.workIssue.findMany({ where: { id: { in: bugIds }, deletedAt: null }, select: { id: true, number: true, title: true, resolvedAt: true } }) : [],
    prisma.user.findMany({ where: { id: { in: [...new Set(imports.map((i) => i.createdById).filter((x): x is number => !!x))] } }, select: PUBLIC_USER }),
  ]);
  const caseNo = new Map(cases.map((c) => [c.id, c.issue.number]));
  const bugOf = new Map(bugs.map((b) => [b.id, b]));
  const latestCov = imports.find((i) => i.coveragePct !== null) ?? null;
  return {
    imports: imports.map((i) => ({
      id: i.id, createdAt: i.createdAt, format: i.format, source: i.source, build: i.build, branch: i.branch, commitSha: i.commitSha, runUrl: i.runUrl,
      cycleId: i.cycleId, total: i.total, passed: i.passed, failed: i.failed, skipped: i.skipped, flaky: i.flaky, durationMs: i.durationMs,
      newBugs: i.newBugs, linkedBugs: i.linkedBugs, coveragePct: num(i.coveragePct), coverageBranchPct: num(i.coverageBranchPct), coverageFormat: i.coverageFormat,
      passRate: i.total - i.skipped > 0 ? Math.round((i.passed / (i.total - i.skipped)) * 100) : null,
      by: people.find((p) => p.id === i.createdById) ?? null, viaToken: !!i.tokenId,
    })),
    tests: tests.map((t) => {
      const b = t.bugIssueId ? bugOf.get(t.bugIssueId) : undefined;
      return {
        id: t.id, suite: t.suite, name: t.name, file: t.file, history: t.history, lastStatus: t.lastStatus, lastDurationMs: t.lastDurationMs,
        flaky: t.flaky, flakyScore: t.flakyScore, lastSeenAt: t.lastSeenAt,
        testNumber: t.testCaseId ? caseNo.get(t.testCaseId) ?? null : null,
        bug: b ? { number: b.number, title: b.title, open: !b.resolvedAt } : null,
      };
    }),
    summary: {
      automated: tests.length,
      flaky: tests.filter((t) => t.flaky).length,
      failing: tests.filter((t) => t.lastStatus === 'FAIL').length,
      lastImportAt: imports[0]?.createdAt ?? null,
      lastPassRate: imports[0] && imports[0].total - imports[0].skipped > 0 ? Math.round((imports[0].passed / (imports[0].total - imports[0].skipped)) * 100) : null,
      coverage: latestCov ? { pct: num(latestCov.coveragePct), branchPct: num(latestCov.coverageBranchPct), format: latestCov.coverageFormat, at: latestCov.createdAt, modules: ((latestCov.coverageDetail as { modules?: unknown[] } | null)?.modules ?? []).slice(0, 20) } : null,
    },
  };
}

/** Bỏ cờ flaky (đã sửa test) — xoá lịch sử để tính lại từ đầu. */
export async function resetFlaky(userId: number, projectId: number, autoTestId: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const r = await prisma.workAutoTest.updateMany({ where: { id: autoTestId, projectId }, data: { flaky: false, flakyScore: 0, history: '' } });
  if (!r.count) throw new NotFoundError('Automated test not found');
  await auditProject(projectId, { actorId: userId, action: 'tests.flaky_reset', targetType: 'auto_test', targetId: autoTestId, summary: 'Cleared the flaky flag of an automated test' });
  return { reset: true };
}
