/**
 * CT Work đợt 8c (12/10/2026) — T3 PHÂN TÍCH TĨNH (SARIF) + T4 V(G) — phần có DB. Đọc báo cáo ở staticAnalysis.ts.
 *
 *   POST /projects/:pid/tests/automation/static   (token `tests:write` — cùng nhóm tuyến nhập test tự động — hoặc phiên web)
 *
 * Một lần nhập SARIF:
 *   1. Mỗi kết quả ⇒ phát hiện, CHỐNG TRÙNG theo dấu vân tay (work_static_findings UNIQUE (project, fingerprint)): đã có
 *      ⇒ cập nhật lần thấy cuối + đếm; FIXED/IGNORED vẫn giữ trạng thái (IGNORED không mở lại; FIXED mà thấy lại ⇒ OPEN).
 *   2. Phát hiện OPEN của CÙNG công cụ không còn trong lần nhập này ⇒ FIXED (đã sửa).
 *   3. Thẻ hay đề xuất: mặc định chỉ là ĐỀ XUẤT trên trang Tests → Static analysis (người bấm "Create bug"). Gửi
 *      `createIssues=true` ⇒ phát hiện MỚI mức error tự thành Bug (Activity = Review, công cụ ghi vào defect), trần 20/lần.
 *   4. Rule complexity (ESLint/PMD) ⇒ cũng ghi V(G) như báo cáo JaCoCo/lizard.
 * JaCoCo XML / lizard CSV ⇒ chỉ V(G) theo hàm (ghi đè đơn vị cùng tệp+tên; đơn vị của CÙNG nguồn không còn ⇒ xoá).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { emitWorkEvent } from './events.js';
import { createIssueAs } from './issues.service.js';
import { requireProject } from './permissions.js';
import {
  complexityRisk, complexitySummary, cyclomatic, cyclomaticFromDecisions, fixedFingerprints, parseStatic, unitKey,
  type Finding, type ParsedStatic, type StaticKind,
} from './staticAnalysis.js';

export const MAX_STATIC_ISSUES = 20;
const MAX_BYTES = 15 * 1024 * 1024;
const PER_10_MIN = 30;

export interface StaticInput {
  report: string | object;
  kind?: StaticKind | 'AUTO';
  build?: string | null;
  branch?: string | null;
  commit?: string | null;
  createIssues?: boolean;
}

const recent = new Map<number, number[]>();
function rateLimit(projectId: number) {
  const now = Date.now();
  const list = (recent.get(projectId) ?? []).filter((t) => now - t < 600_000);
  if (list.length >= PER_10_MIN) throw new AppError(`Too many imports for this project — at most ${PER_10_MIN} every 10 minutes`, 429, 'WORK_RATE_LIMIT');
  list.push(now);
  recent.set(projectId, list);
}
export function _resetStaticLimits(): void { recent.clear(); }

const cleanStr = (s: string | null | undefined, n: number) => (s ?? '').trim().slice(0, n) || null;
const para = (text: string) => ({ type: 'paragraph', content: text ? [{ type: 'text', text }] : [] });

function bugDoc(f: Pick<Finding, 'tool' | 'ruleId' | 'level' | 'message' | 'file' | 'line'> & { helpUri: string | null }, ctx: { build?: string | null; commit?: string | null }) {
  return {
    type: 'doc',
    content: [
      para(`Static analysis finding (${f.tool}, rule ${f.ruleId}, level ${f.level}).${ctx.build ? ` Build: ${ctx.build}.` : ''}${ctx.commit ? ` Commit: ${ctx.commit.slice(0, 12)}.` : ''}`),
      para(`${f.file ?? '(no file)'}${f.line ? `:${f.line}` : ''}`),
      para(f.message),
      ...(f.helpUri ? [para(`Rule documentation: ${f.helpUri}`)] : []),
      para('Opened from CT Work static analysis. Re-imports of the same finding update this bug instead of opening a new one.'),
    ],
  };
}

async function bugFor(userId: number, projectId: number, f: Omit<Finding, 'fingerprint'>, ctx: { build?: string | null; commit?: string | null }) {
  const bugType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'BUG', archived: false }, select: { id: true } });
  if (!bugType) throw new AppError('This project has no Bug issue type', 409, 'WORK_NO_BUG_TYPE');
  const issue = await createIssueAs(userId, projectId, {
    typeId: bugType.id, title: `[${f.tool}] ${f.ruleId}: ${f.message}`.slice(0, 255),
    descriptionJson: bugDoc(f, ctx) as unknown as Prisma.InputJsonValue, priority: f.level === 'error' ? 2 : 3,
  });
  await prisma.workDefectInfo.upsert({
    where: { issueId: issue.id },
    create: { issueId: issue.id, projectId, severity: f.level === 'error' ? 'MAJOR' : 'MINOR', activity: 'Review', detectedByTool: `Static analysis · ${f.tool}`.slice(0, 80), testLevel: 'COMPONENT' },
    update: {},
  });
  return issue;
}

export async function importStatic(userId: number, projectId: number, input: StaticInput, meta: { source: 'API' | 'UPLOAD'; tokenId?: number | null }) {
  await requireProject(userId, projectId, 'issue.edit');
  const raw = typeof input.report === 'string' ? input.report : JSON.stringify(input.report ?? '');
  if (!raw.trim()) throw new BadRequestError('The report is empty', 'WORK_STATIC_REPORT');
  if (Buffer.byteLength(raw) > MAX_BYTES) throw new BadRequestError('The report is larger than 15 MB', 'WORK_STATIC_REPORT');
  let parsed: ParsedStatic;
  try { parsed = parseStatic(input.report, input.kind); } catch (err) { throw new BadRequestError((err as Error).message, 'WORK_STATIC_REPORT'); }
  if (!parsed.findings.length && !parsed.complexity.length && parsed.kind !== 'SARIF') throw new BadRequestError('The report has nothing to import', 'WORK_STATIC_REPORT');
  rateLimit(projectId);
  const now = new Date();
  const ctx = { build: cleanStr(input.build, 80), commit: cleanStr(input.commit, 64) };

  const imp = await prisma.workStaticImport.create({
    data: {
      projectId, kind: parsed.kind, tools: parsed.tools.join(', ').slice(0, 200) || null, source: meta.source, build: ctx.build,
      branch: cleanStr(input.branch, 120), commitSha: ctx.commit, tokenId: meta.tokenId ?? null, createdById: userId,
    },
    select: { id: true },
  });

  // 1–2. Phát hiện.
  let newCount = 0, issuesMade = 0, capHit = 0;
  const seen = new Set<string>();
  const byFp = new Map<string, Finding>();
  for (const f of parsed.findings) if (!byFp.has(f.fingerprint)) byFp.set(f.fingerprint, f);
  const existing = new Map((await prisma.workStaticFinding.findMany({ where: { projectId, fingerprint: { in: [...byFp.keys()] } }, select: { id: true, fingerprint: true, status: true } })).map((x) => [x.fingerprint, x]));
  for (const f of byFp.values()) {
    seen.add(f.fingerprint);
    const ex = existing.get(f.fingerprint);
    if (ex) {
      await prisma.workStaticFinding.update({
        where: { id: ex.id },
        data: { lastSeenAt: now, seenCount: { increment: 1 }, line: f.line, message: f.message, level: f.level, lastImportId: imp.id, ...(ex.status === 'FIXED' ? { status: 'OPEN', fixedAt: null } : {}) },
      });
      continue;
    }
    newCount += 1;
    const row = await prisma.workStaticFinding.create({
      data: { projectId, fingerprint: f.fingerprint, tool: f.tool, ruleId: f.ruleId, level: f.level, message: f.message, file: f.file, line: f.line, helpUri: f.helpUri, lastImportId: imp.id, firstSeenAt: now, lastSeenAt: now },
      select: { id: true },
    });
    if (input.createIssues && f.level === 'error') {
      if (issuesMade >= MAX_STATIC_ISSUES) { capHit += 1; continue; }
      try {
        const issue = await bugFor(userId, projectId, f, ctx);
        await prisma.workStaticFinding.update({ where: { id: row.id }, data: { status: 'ISSUE', issueId: issue.id } });
        issuesMade += 1;
      } catch (err) {
        logger.warn('[work] static import: không tạo được bug', { projectId, err: (err as Error).message });
      }
    }
  }
  let fixedCount = 0;
  if (parsed.kind === 'SARIF' && parsed.tools.length) {
    const open = await prisma.workStaticFinding.findMany({ where: { projectId, status: 'OPEN', tool: { in: parsed.tools } }, select: { fingerprint: true } });
    const fixed = fixedFingerprints(open, seen);
    if (fixed.length) fixedCount = (await prisma.workStaticFinding.updateMany({ where: { projectId, fingerprint: { in: fixed } }, data: { status: 'FIXED', fixedAt: now } })).count;
  }

  // 4. V(G).
  const units = new Map<string, (typeof parsed.complexity)[number]>();
  for (const u of parsed.complexity) units.set(unitKey(u), u);
  for (const [k, u] of units) {
    await prisma.workCodeComplexity.upsert({
      where: { projectId_unitKey: { projectId, unitKey: k } },
      create: { projectId, unitKey: k, name: u.name, file: u.file, line: u.line, vg: u.vg, source: u.source },
      update: { name: u.name, file: u.file, line: u.line, vg: u.vg, source: u.source },
    });
  }
  if (parsed.kind !== 'SARIF' && units.size) {
    // Báo cáo JaCoCo/lizard là TOÀN BỘ mã ⇒ hàm cùng nguồn không còn trong báo cáo đã bị xoá/đổi tên.
    await prisma.workCodeComplexity.deleteMany({ where: { projectId, source: parsed.kind, unitKey: { notIn: [...units.keys()] } } });
  }

  await prisma.workStaticImport.update({ where: { id: imp.id }, data: { total: byFp.size, newCount, fixedCount, issuesMade, units: units.size } });
  await auditProject(projectId, {
    actorId: userId, action: 'tests.static_import', targetType: 'static_import', targetId: imp.id,
    summary: `Imported ${parsed.kind === 'SARIF' ? `static analysis (${parsed.tools.join(', ')}): ${byFp.size} findings, ${newCount} new, ${fixedCount} fixed` : `${parsed.kind} complexity: ${units.size} functions`}${issuesMade ? ` · ${issuesMade} bug(s)` : ''}${meta.tokenId ? ' (API token)' : ''}`.slice(0, 300),
  });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return {
    importId: imp.id, kind: parsed.kind, tools: parsed.tools, findings: byFp.size, newFindings: newCount, fixed: fixedCount, issuesCreated: issuesMade,
    issuesNotCreated: capHit, complexityUnits: units.size, complexity: units.size ? complexitySummary([...units.values()]) : null,
  };
}

// ─── Xem + thao tác trên phát hiện ───────────────────────────────

export async function overview(userId: number, projectId: number, q: { status?: string; tool?: string } = {}) {
  const access = await requireProject(userId, projectId, 'project.view');
  const where: Prisma.WorkStaticFindingWhereInput = { projectId, ...(q.status && q.status !== 'ALL' ? { status: q.status } : {}), ...(q.tool ? { tool: q.tool } : {}) };
  const [findings, counts, imports, units] = await Promise.all([
    prisma.workStaticFinding.findMany({ where, orderBy: [{ status: 'asc' }, { level: 'asc' }, { lastSeenAt: 'desc' }], take: 500 }),
    prisma.workStaticFinding.groupBy({ by: ['status', 'level'], where: { projectId }, _count: { _all: true } }),
    prisma.workStaticImport.findMany({ where: { projectId }, orderBy: { id: 'desc' }, take: 20 }),
    prisma.workCodeComplexity.findMany({ where: { projectId }, orderBy: [{ vg: 'desc' }, { name: 'asc' }], take: 2000 }),
  ]);
  const issueIds = findings.map((f) => f.issueId).filter((x): x is number => !!x);
  const issues = issueIds.length ? await prisma.workIssue.findMany({ where: { id: { in: issueIds }, deletedAt: null }, select: { id: true, number: true, resolvedAt: true } }) : [];
  const issueOf = new Map(issues.map((i) => [i.id, i]));
  const tools = await prisma.workStaticFinding.groupBy({ by: ['tool'], where: { projectId }, _count: { _all: true } });
  const sum = (pred: (c: (typeof counts)[number]) => boolean) => counts.filter(pred).reduce((a, c) => a + c._count._all, 0);
  return {
    summary: {
      open: sum((c) => c.status === 'OPEN'), openErrors: sum((c) => c.status === 'OPEN' && c.level === 'error'),
      openWarnings: sum((c) => c.status === 'OPEN' && c.level === 'warning'), fixed: sum((c) => c.status === 'FIXED'),
      ignored: sum((c) => c.status === 'IGNORED'), asIssues: sum((c) => c.status === 'ISSUE'),
      lastImportAt: imports[0]?.createdAt ?? null, tools: tools.map((t) => ({ tool: t.tool, count: t._count._all })),
    },
    findings: findings.map((f) => {
      const i = f.issueId ? issueOf.get(f.issueId) : undefined;
      return {
        id: f.id, tool: f.tool, ruleId: f.ruleId, level: f.level, message: f.message, file: f.file, line: f.line, helpUri: f.helpUri,
        status: f.status, seenCount: f.seenCount, firstSeenAt: f.firstSeenAt, lastSeenAt: f.lastSeenAt, fixedAt: f.fixedAt,
        issue: i ? { number: i.number, key: `${access.key}-${i.number}`, open: !i.resolvedAt } : null,
      };
    }),
    imports: imports.map((i) => ({ id: i.id, kind: i.kind, tools: i.tools, source: i.source, build: i.build, branch: i.branch, commitSha: i.commitSha, total: i.total, newCount: i.newCount, fixedCount: i.fixedCount, issuesMade: i.issuesMade, units: i.units, createdAt: i.createdAt })),
    complexity: {
      summary: complexitySummary(units),
      units: units.slice(0, 300).map((u) => ({ id: u.id, name: u.name, file: u.file, line: u.line, vg: u.vg, source: u.source, risk: complexityRisk(u.vg), basisPaths: u.vg, updatedAt: u.updatedAt })),
    },
  };
}

export async function setFindingStatus(userId: number, projectId: number, id: number, status: 'OPEN' | 'IGNORED') {
  await requireProject(userId, projectId, 'issue.edit');
  const f = await prisma.workStaticFinding.findFirst({ where: { id, projectId }, select: { id: true, status: true } });
  if (!f) throw new NotFoundError('Finding not found');
  if (f.status === 'ISSUE') throw new BadRequestError('This finding already became a bug — work on the bug instead', 'WORK_STATIC_HAS_ISSUE');
  await prisma.workStaticFinding.update({ where: { id }, data: { status, ...(status === 'OPEN' ? { fixedAt: null } : {}) } });
  await auditProject(projectId, { actorId: userId, action: status === 'IGNORED' ? 'tests.static_ignore' : 'tests.static_reopen', targetType: 'static_finding', targetId: id, summary: `${status === 'IGNORED' ? 'Ignored' : 'Reopened'} a static analysis finding` });
  return { id, status };
}

/** Đề xuất ⇒ thẻ Bug (một chạm). Đã có thẻ ⇒ trả thẻ đó. */
export async function findingToIssue(userId: number, projectId: number, id: number) {
  const access = await requireProject(userId, projectId, 'issue.create');
  const f = await prisma.workStaticFinding.findFirst({ where: { id, projectId } });
  if (!f) throw new NotFoundError('Finding not found');
  if (f.issueId) {
    const i = await prisma.workIssue.findFirst({ where: { id: f.issueId, deletedAt: null }, select: { number: true } });
    if (i) return { number: i.number, key: `${access.key}-${i.number}`, created: false };
  }
  const issue = await bugFor(userId, projectId, { tool: f.tool, ruleId: f.ruleId, level: f.level as Finding['level'], message: f.message, file: f.file, line: f.line, helpUri: f.helpUri }, {});
  await prisma.workStaticFinding.update({ where: { id }, data: { status: 'ISSUE', issueId: issue.id } });
  return { number: issue.number, key: `${access.key}-${issue.number}`, created: true };
}

/** Máy tính V(G) cho bài tập white-box (không lưu): đồ thị (E, N, P) hoặc số điểm quyết định. */
export function vgCalculator(input: { edges?: number; nodes?: number; components?: number; decisions?: number }) {
  try {
    const vg = input.edges !== undefined && input.nodes !== undefined
      ? cyclomatic(input.edges, input.nodes, input.components ?? 1)
      : cyclomaticFromDecisions(input.decisions ?? 0);
    return { vg, basisPaths: vg, minTestsForBranchCoverageAtMost: vg, risk: complexityRisk(vg) };
  } catch (err) {
    throw new BadRequestError((err as Error).message, 'VALIDATION_ERROR');
  }
}
