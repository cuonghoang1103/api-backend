/**
 * CT Work — dm5 G2 (27/11/2026): phần có DB của
 *   B14  submitCheck   "Soát trước nộp": tên UC ↔ thẻ ↔ WBS + checklist 10 lỗi bút đỏ (mẫu sep490-red-pen-checklist) — chỉ ĐỌC.
 *   B20  fillReport6   khung "3. User Manual" của Report 6 theo actor → màn (một phiên bản trang mới).
 *   B15  supersedeAdr  ADR cũ "Superseded by ADR-00m" (+ trạng thái trang ARCHIVED), ADR mới "Supersedes ADR-00n".
 * Thuần ở dm5bDocs.ts / adr.ts / finalReport.ts / swr.ts.
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { adrKey, adrNumberOf, isAdrTemplate, markSuperseded, markSupersedes } from './adr.js';
import type { PmNode } from './docMarkdown.js';
import { fillUserGuide, ucNameChecks } from './dm5bDocs.js';
import { finalChecks } from './finalReport.js';
import { docCtx, getPage, updatePage } from './pages.service.js';
import { findReportPage, loadSrs, srsCtx } from './srs.service.js';
import { inDocument, refsIn, smKey } from './srs.js';
import { ucLint } from './swr.js';

export interface SubmitItem { n: number; key: string; title: string; ok: boolean | null; details: string[] }

/** B14: soát trước nộp — mỗi mục xanh (ok) / đỏ (lỗi, kèm chi tiết) / xám (null = chưa áp dụng được). */
export async function submitCheck(userId: number, projectId: number) {
  await srsCtx(userId, projectId, 'view');
  await docCtx(userId, projectId);
  const srs = await loadSrs(projectId);
  const ucs = inDocument(srs.useCases);
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const linked = ucs.filter((u) => u.issueKey).map((u) => Number(u.issueKey!.slice(p.key.length + 1)));
  const issues = linked.length ? await prisma.workIssue.findMany({ where: { projectId, number: { in: linked }, deletedAt: null }, select: { number: true, title: true } }) : [];
  const titleOf = new Map(issues.map((i) => [`${p.key}-${i.number}`, i.title]));
  const names = ucNameChecks(ucs, (k) => titleOf.get(k) ?? null);

  // Report 1–6 (như Report 7 ghép) cho mã lạ / chữ mẫu / số test.
  const { finalFacts } = await import('./finalReport.service.js');
  const sources: Array<{ n: number; doc: unknown; label: string }> = [];
  for (const n of [1, 2, 3, 4, 5, 6] as const) {
    const pg = await findReportPage(projectId, n);
    if (!pg) continue;
    const page = await getPage(userId, projectId, pg.number).catch(() => null);
    if (page) sources.push({ n, doc: page.contentJson, label: `Doc ${page.number}` });
  }
  const checks = finalChecks(sources, await finalFacts(projectId));
  const by = (code: string) => checks.filter((c) => c.code === code);
  const lints = ucs.flatMap((u) => ucLint(u, { systemName: p.name, messageNumbers: inDocument(srs.systemMessages ?? []).map((m) => m.number) }));
  const lint = (code: string) => lints.filter((g) => g.code === code).map((g) => `${g.ref}: ${g.detail}`);

  const msgs = inDocument(srs.systemMessages ?? []);
  const mentioned = new Set(ucs.flatMap((u) => refsIn([u.normalFlow, u.alternativeFlows, u.exceptionFlows, u.description].filter(Boolean).join('\n'), 'SM')));
  const unusedSm = msgs.filter((m) => !m.useCaseIds.length && !mentioned.has(m.number)).map((m) => `${smKey(m.number)} is not used by any use case`);

  const quality = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, requirementInfo: { reqType: 'QUALITY', lifecycle: { notIn: ['DELETED', 'REJECTED'] } } },
    select: { number: true, title: true, nfrSpec: { select: { scale: true, meter: true, mustValue: true } } }, take: 500,
  });
  const unmeasured = quality.filter((q) => !q.nfrSpec || q.nfrSpec.mustValue === null || !q.nfrSpec.scale.trim() || !q.nfrSpec.meter.trim()).map((q) => `${p.key}-${q.number} ${q.title}: no scale / meter / Must value`);

  // Record of Changes của Report 3 có nhắc mọi CR đã IMPLEMENTED chạm SRS?
  const r3 = sources.find((s) => s.n === 3);
  const r3page = r3 ? await findReportPage(projectId, 3) : null;
  let rocMissing: string[] | null = null;
  if (r3 && r3page) {
    const { implementedCrsFor } = await import('./docs3a.service.js');
    const pg = await prisma.workPage.findFirst({ where: { projectId, number: r3page.number }, select: { id: true, templateKey: true, title: true } });
    const crs = pg ? await implementedCrsFor(projectId, pg) : [];
    const text = JSON.stringify(r3.doc ?? '');
    rocMissing = crs.filter((c) => !new RegExp(`CR-${c.number}\\b`).test(text)).map((c) => `CR-${c.number} ${c.title} is implemented but not in the Record of Changes`);
  }

  const item = (n: number, key: string, title: string, details: string[] | null): SubmitItem => ({ n, key, title, ok: details === null ? null : !details.length, details: details ?? [] });
  const items: SubmitItem[] = [
    item(1, 'UC_NAMES', 'Use case names are identical in the SRS, the issues and the WBS', ucs.length ? names.filter((x) => !x.ok).map((x) => x.problem === 'NO_ISSUE' ? `${x.uc} ${x.name}: no linked requirement issue (missing from the WBS)` : `${x.uc} "${x.name}" ≠ issue ${x.issue} "${x.issueTitle}"`) : null),
    item(2, 'CODES_EXIST', 'Every UC/BR/SM/FE code used in the reports exists', sources.length ? by('CODE_UNKNOWN').flatMap((c) => c.items).concat(by('CODE_DUPLICATE').flatMap((c) => c.items)).concat(lint('SM_UNKNOWN')) : null),
    item(3, 'NO_TEMPLATE_TEXT', 'No template text left ("<…>", "Feature name", "TBD", "Member 1")', sources.length ? by('TEMPLATE_LEFTOVER').map((c) => `${c.message}: ${c.items.join(', ')}`) : null),
    item(4, 'NO_SYSTEM_WORD', 'Use case flows use the system\'s name, not the word "System"', ucs.length ? lint('SYSTEM_SUBJECT') : null),
    item(5, 'STEP_REFS', 'Alternative / Exception step codes point to real Normal Flow steps', ucs.length ? lint('STEP_REF_UNKNOWN') : null),
    item(6, 'CLEAN_POSTCONDITIONS', 'Postconditions describe data state only (no BR-xx / SM-xx)', ucs.length ? lint('CODE_IN_POSTCONDITION') : null),
    item(7, 'SYSTEM_MESSAGES', 'System messages (SM-xx) exist and each one is used by a use case', msgs.length || mentioned.size ? [...unusedSm, ...lint('SM_UNKNOWN')] : ['No system messages yet — add them under Requirements › System messages (Report 3 §5.2)']),
    item(8, 'NFR_MEASURABLE', 'Every quality requirement (NFR) has a scale, a meter and a Must value', quality.length ? unmeasured : null),
    item(9, 'TEST_NUMBERS', 'Test totals and pass rates in the reports equal the test data', sources.some((s) => s.n === 5) ? [...by('TEST_COUNT_MISMATCH'), ...by('PASS_RATE_MISMATCH')].map((c) => c.message) : null),
    item(10, 'RECORD_OF_CHANGES', 'Record of Changes lists every implemented change request', rocMissing),
  ];
  return {
    items, ucNames: names,
    passed: items.filter((i) => i.ok === true).length, failed: items.filter((i) => i.ok === false).length, notApplicable: items.filter((i) => i.ok === null).length,
    reports: sources.map((s) => s.n),
  };
}

/** B20: khung User Manual của Report 6 — MỘT phiên bản trang mới. */
export async function fillReport6(userId: number, projectId: number, input: { page?: number | null; version?: number } = {}) {
  await srsCtx(userId, projectId, 'view');
  const pg = input.page ? { number: input.page } : await findReportPage(projectId, 6);
  if (!pg) throw new NotFoundError('This project has no Report 6 page — create it from the "FPT Capstone" template in Docs');
  const page = await getPage(userId, projectId, pg.number);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  const srs = await loadSrs(projectId);
  if (!srs.screens.length) throw new BadRequestError('No screens in the SRS yet — add them under Requirements › Screens', 'WORK_NO_SCREENS');
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const r = fillUserGuide(doc, srs);
  if (!r) throw new BadRequestError(`Page DOC-${page.number} has no "User Manual" heading — use the Report 6 template`, 'WORK_NO_SECTION');
  if (!r.added.length) return { ...r, page: { number: page.number, title: page.title, version: page.currentVersion ?? null }, changed: false };
  const updated = await updatePage(userId, projectId, page.number, { contentJson: doc, version: input.version ?? page.version, versionNote: `User manual frame from the SRS screens (${r.added.length} section${r.added.length === 1 ? '' : 's'} added)` });
  return { ...r, page: { number: page.number, title: page.title, version: (updated as { currentVersion?: number }).currentVersion ?? null }, changed: true };
}

/** B15: trang ADR `oldNum` bị thay bởi trang ADR `newNum` — ghi vào bảng trường của cả hai, ADR cũ chuyển ARCHIVED. */
export async function supersedeAdr(userId: number, projectId: number, oldNum: number, newNum: number) {
  if (oldNum === newNum) throw new BadRequestError('An ADR cannot supersede itself', 'VALIDATION_ERROR');
  const [a, b] = await Promise.all([getPage(userId, projectId, oldNum), getPage(userId, projectId, newNum)]);
  if (!a.canEdit || !b.canEdit) throw new ForbiddenError('You can read these pages but not edit them');
  const na = adrNumberOf(a.title);
  const nb = adrNumberOf(b.title);
  if (na === null || nb === null || (!isAdrTemplate(a.templateKey) && !/^ADR-/i.test(a.title)) || (!isAdrTemplate(b.templateKey) && !/^ADR-/i.test(b.title))) {
    throw new BadRequestError('Both pages must be numbered ADRs (created from the ADR template)', 'WORK_NOT_ADR');
  }
  const da = JSON.parse(JSON.stringify(a.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const db = JSON.parse(JSON.stringify(b.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const okA = markSuperseded(da, nb);
  const okB = markSupersedes(db, na);
  if (!okA) da.content = [{ type: 'paragraph', content: [{ type: 'text', text: `Status: Superseded by ${adrKey(nb)}`, marks: [{ type: 'bold' }] }] }, ...(da.content ?? [])];
  if (!okB) db.content = [...(db.content ?? []), { type: 'paragraph', content: [{ type: 'text', text: `Supersedes ${adrKey(na)}` }] }];
  await updatePage(userId, projectId, oldNum, { contentJson: da, version: a.version, status: 'ARCHIVED', versionNote: `Superseded by ${adrKey(nb)}` });
  await updatePage(userId, projectId, newNum, { contentJson: db, version: b.version, versionNote: `Supersedes ${adrKey(na)}` });
  return { superseded: adrKey(na), by: adrKey(nb), pages: { old: oldNum, new: newNum } };
}
