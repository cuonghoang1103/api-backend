/**
 * CT Work — CTW đợt 4b (R27): MẪU DỰ ÁN SWR302 nâng cấp. Tạo dự án mẫu SWR302 ⇒ ngoài loại thẻ + MoSCoW (templates.ts)
 * còn dựng sẵn đúng khung của bài Assignment (`content/academy/swr302/assignment.mjs`):
 *   - 8 GIAI ĐOẠN = tuần 2 → tuần 9 (bài A.5 "the eight-week plan"), mỗi tuần một mục tiêu "What exists by Friday";
 *   - 8 EPIC = 8 deliverable (bài A.1), gắn đúng tuần hạn chót, mô tả trỏ về trang Docs/trang Wiegers;
 *   - Trang Docs "SWR302 requirements package": lịch tuần, bảng RACI năm người (bài A.4 — mỗi hàng đúng một A), sáu liên kết;
 *     dưới nó 5 trang theo mẫu Wiegers (V&S, Use Cases, Business Rules, SRS, Data Dictionary) gắn đúng tuần;
 *   - Definition of Done của dự án = sáu liên kết người chấm dò (settings.definitionOfDone);
 *   - Mô-đun bật sẵn: stages, docs, raid, meetings, resources.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { StudioModule } from './constants.js';
import type { PmNode } from './docMarkdown.js';
import { getTemplate } from './docTemplates.js';
import { createIssue } from './issueChange.js';
import { snapshotTx } from './pages.service.js';
import { SIX_LINKS } from './swr.js';
import { tiptapToText } from './tiptapText.js';

export const SWR302_MODULES: readonly StudioModule[] = ['stages', 'docs', 'raid', 'meetings', 'resources'];

export interface SwrWeek { week: number; slug: string; name: string; focus: string; byFriday: string; docs: string[] }
/** Bài A.5 — kế hoạch tám tuần (Week · Focus · What exists by Friday). */
export const SWR302_WEEKS: readonly SwrWeek[] = [
  { week: 2, slug: 'week-2', name: 'Week 2: Topic, team & first elicitation', focus: 'Topic issued. Read the brief, form the team, assign roles. Run the first elicitation session. Agree the glossary and the shared fact sheet of numbers.', byFriday: 'Role assignment, glossary v0.1, fact sheet v0.1, interview 1 notes', docs: [] },
  { week: 3, slug: 'week-3', name: 'Week 3: Vision & Scope draft', focus: 'Vision & Scope drafted: background, opportunity, objectives with baselines, success metrics, vision statement. Second elicitation session (stakeholders, constraints).', byFriday: 'Deliverable 1 draft (§1 complete, §2–3 outlined)', docs: ['swr-vision-scope'] },
  { week: 4, slug: 'week-4', name: 'Week 4: Vision & Scope baselined + use case list', focus: 'Features FE-n, release scope, exclusions, stakeholder profiles, project priorities. Use case list agreed and split between M2 and M3.', byFriday: 'Deliverable 1 baselined; use case list (14+ names, actors, one-line descriptions)', docs: [] },
  { week: 5, slug: 'week-5', name: 'Week 5: Use cases + business rules', focus: 'Use case specifications written in parallel with business rules — every flow step that mentions a policy becomes a BR-n. M4 starts harvesting data elements.', byFriday: '~half the use case specs; business rules v0.1; data dictionary v0.1', docs: ['swr-use-cases', 'swr-business-rules', 'swr-data-dictionary'] },
  { week: 6, slug: 'week-6', name: 'Week 6: Use cases & rules complete', focus: 'Use cases finished and cross-reviewed (M2 ↔ M3). Use case diagram drawn. Rules classified into the five types. M1 starts the SRS skeleton.', byFriday: 'Deliverables 2 and 3 complete, SRS §1–2 drafted', docs: ['swr-srs'] },
  { week: 7, slug: 'week-7', name: 'Week 7: SRS features, data dictionary, mock-ups', focus: 'SRS system features and quality attributes. Data dictionary finished. Mock-ups for the three complex use cases. M5 starts prioritization against the stable feature list.', byFriday: 'SRS §3–6 drafted, Deliverables 5 and 6 complete, prioritization v0.1', docs: [] },
  { week: 8, slug: 'week-8', name: 'Week 8: SRS complete, estimation, six links', focus: 'SRS finished. Counts collected and fed into the estimation tool. Traceability matrix built. Whole-team review against the six traceability links.', byFriday: 'Deliverables 4, 7, 8 complete; traceability matrix; all six checks passed', docs: [] },
  { week: 9, slug: 'week-9', name: 'Week 9: Presentation', focus: 'Rehearse with each owner presenting their own deliverable. Prepare for questions, not just slides.', byFriday: 'Submitted package + slides + rehearsed Q&A', docs: [] },
];

/** Bài A.1 — 8 deliverable; tuần = hạn hoàn tất theo A.5; doc = trang mẫu Wiegers (null = tệp ngoài: mock-up, xlsx). */
export const SWR302_EPICS: ReadonlyArray<{ n: number; title: string; week: number; doc: string | null; scope: string }> = [
  { n: 1, title: 'D1 — Vision & Scope', week: 4, doc: 'swr-vision-scope', scope: 'Business requirements (BO-n, SM-n), vision statement, risks, features FE-n with release scope, limitations, stakeholder profiles, project priorities. Fill it from Requirements → Wiegers.' },
  { n: 2, title: 'D2 — Use case diagram & specifications (≥10)', week: 6, doc: 'swr-use-cases', scope: 'Use case list and one Wiegers specification per use case; every UC names its BR-nn by ID; draw the diagram in Diagram Studio.' },
  { n: 3, title: 'D3 — Business rules (all five types)', week: 6, doc: 'swr-business-rules', scope: 'BR-nn catalog: fact, constraint, action enabler, inference, computation — static/dynamic and source for each.' },
  { n: 4, title: 'D4 — Software Requirements Specification', week: 8, doc: 'swr-srs', scope: 'System features with functional requirements, data requirements, external interfaces, quality attributes (Planguage), glossary and the traceability matrix appendix.' },
  { n: 5, title: 'D5 — Data dictionary', week: 7, doc: 'swr-data-dictionary', scope: 'Every noun used in a use case flow defined: description, composition or data type, length, values.' },
  { n: 6, title: 'D6 — Mock-ups for the three most complex use cases', week: 7, doc: null, scope: 'Screens for the three most complex use cases, linked to the use cases and screens of Requirements.' },
  { n: 7, title: 'D7 — Requirements prioritization (Wiegers spreadsheet)', week: 8, doc: null, scope: 'Benefit / penalty / cost / risk for every FE-n or UC-nn — export the spreadsheet from Requirements → Wiegers → Prioritization.' },
  { n: 8, title: 'D8 — Requirements estimation', week: 8, doc: null, scope: 'Counts of use cases, screens, reports and interfacing systems typed into the estimation tool must equal deliverables 2, 4 and 6 (six links #6).' },
];

/** Bài A.4 — RACI cho 8 deliverable (M1 Leader · M2 UC-A · M3 UC-B/Rules · M4 Data/UX · M5 Planning). */
export const SWR302_RACI: ReadonlyArray<[string, string, string, string, string, string]> = [
  ['1 · Vision & Scope', 'R/A', 'C', 'C', 'C', 'C'],
  ['2 · Use cases + diagram', 'A', 'R', 'R', 'C', 'I'],
  ['3 · Business rules', 'C', 'C', 'R/A', 'I', 'I'],
  ['4 · SRS', 'R/A', 'C', 'C', 'R (§4, §5.1)', 'C'],
  ['5 · Data dictionary', 'C', 'C', 'C', 'R/A', 'I'],
  ['6 · Mock-ups', 'C', 'C', 'I', 'R/A', 'I'],
  ['7 · Prioritization', 'C', 'C', 'C', 'C', 'R/A'],
  ['8 · Estimation', 'C', 'I', 'I', 'C', 'R/A'],
];

/** Definition of Done của dự án SWR302 = sáu liên kết (đọc trên Board/thẻ Task; kiểm tự động ở trang Wiegers). */
export const SWR302_DOD = SIX_LINKS.map((l) => `Link ${l.n}: ${l.title}`);

const t = (text: string, marks?: PmNode['marks']): PmNode => (marks ? { type: 'text', text, marks } : { type: 'text', text });
const p = (...c: PmNode[]): PmNode => (c.length ? { type: 'paragraph', content: c } : { type: 'paragraph' });
const bold = (text: string) => t(text, [{ type: 'bold' }]);
const link = (text: string, href: string) => t(text, [{ type: 'link', attrs: { href, target: null, rel: 'noopener noreferrer nofollow' } }]);
const cell = (type: string, c: PmNode[]): PmNode => ({ type, attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [p(...c)] });
const table = (head: string[], rows: PmNode[][][]): PmNode => ({
  type: 'table',
  content: [{ type: 'tableRow', content: head.map((h) => cell('tableHeader', [t(h)])) }, ...rows.map((r) => ({ type: 'tableRow', content: r.map((c) => cell('tableCell', c)) }))],
});
const h2 = (text: string): PmNode => ({ type: 'heading', attrs: { level: 2 }, content: [t(text)] });

export function packageDoc(pages: Map<string, { number: number; title: string }>, base: { docs: string; wiegers: string }): PmNode {
  const docLink = (k: string | null) => (k && pages.has(k) ? [link(pages.get(k)!.title, `${base.docs}/${pages.get(k)!.number}`)] : []);
  return {
    type: 'doc',
    content: [
      p(t('The SWR302 group assignment (20%): eight deliverables, one internally consistent requirements package, weeks 2 → 9. Templates follow Wiegers & Beatty, '), bold('Software Requirements'), t(' (3rd ed.).')),
      h2('Eight-week plan'),
      table(['Week', 'Focus', 'What exists by Friday', 'Documents'], SWR302_WEEKS.map((w) => [[t(String(w.week))], [t(w.focus)], [t(w.byFriday)], w.docs.flatMap((k, i) => (i ? [t(' · '), ...docLink(k)] : docLink(k)))])),
      h2('Deliverables'),
      table(['#', 'Deliverable', 'Due', 'Where'], SWR302_EPICS.map((e) => [[t(String(e.n))], [t(e.title.replace(/^D\d — /, ''))], [t(`Week ${e.week}`)], e.doc ? docLink(e.doc) : [link('Requirements → Wiegers', base.wiegers)]])),
      h2('RACI — five people, eight deliverables'),
      p(t('R = does the work · A = accountable, one person only · C = consulted before it is written · I = informed after. Exactly one A per row: when the lecturer asks "who decided this?", the A answers.')),
      table(['Deliverable', 'M1 Leader', 'M2 UC-A', 'M3 UC-B/Rules', 'M4 Data/UX', 'M5 Planning'], SWR302_RACI.map((r) => r.map((x) => [t(x)]))),
      h2('Definition of Done — the six traceability links'),
      p(t('Marks are lost far more often to inconsistency between documents than to weak content inside one. CT Work checks all six automatically: '), link('Requirements → Wiegers → Six links', `${base.wiegers}?tab=six-links`), t('.')),
      { type: 'orderedList', attrs: { start: 1 }, content: SIX_LINKS.map((l) => ({ type: 'listItem', content: [p(t(l.title))] })) },
    ],
  };
}

/** Dựng phần riêng của dự án SWR302 (sau khi tạo dự án, ngoài transaction tạo dự án). */
export async function seedSwr302(userId: number, projectId: number, base: { wsSlug: string; key: string }) {
  const keys = [...new Set(SWR302_WEEKS.flatMap((w) => w.docs))];
  const tpls = new Map<string, Awaited<ReturnType<typeof getTemplate>>>();
  for (const k of keys) {
    try { tpls.set(k, await getTemplate(k)); } catch { logger.warn('[work] mẫu SWR302 thiếu tệp — bỏ qua', { key: k }); }
  }
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, settings: true } });
  const docsBase = `/work/${base.wsSlug}/${base.key}/docs`;
  const wiegersBase = `/work/${base.wsSlug}/${base.key}/wiegers`;
  const made = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_projects WHERE id = ${projectId} FOR UPDATE`;
    const stageIds = new Map<number, number>();
    for (const [i, w] of SWR302_WEEKS.entries()) {
      const row = await tx.workStage.create({ data: { projectId, n: i + 1, slug: w.slug, name: w.name }, select: { id: true } });
      stageIds.set(w.week, row.id);
    }
    let number = ((await tx.workPage.aggregate({ where: { projectId }, _max: { number: true } }))._max.number ?? 0) + 1;
    const make = async (d: { parentId: number | null; title: string; doc: PmNode; stageId?: number | null; templateKey?: string | null; position: number; note?: string }) => {
      const json = d.doc as unknown as Prisma.InputJsonValue;
      const text = tiptapToText(d.doc).slice(0, 1_000_000);
      const row = await tx.workPage.create({
        data: { projectId, number: number++, parentId: d.parentId, title: d.title.slice(0, 255), contentJson: json, contentText: text, ownerId: userId, lastEditedById: userId, stageId: d.stageId ?? null, templateKey: d.templateKey ?? null, position: d.position },
        select: { id: true, number: true, title: true },
      });
      await snapshotTx(tx, row.id, userId, { title: row.title, contentJson: json, contentText: text }, 'CREATE', d.note ?? null);
      return row;
    };
    const root = await make({ parentId: null, title: 'SWR302 requirements package', doc: { type: 'doc', content: [p()] }, position: 0 });
    const pages = new Map<string, { number: number; title: string }>();
    let pos = 0;
    for (const w of SWR302_WEEKS) for (const k of w.docs) {
      const tpl = tpls.get(k);
      if (!tpl) continue;
      const title = tpl.pageTitle.replace(/<Project>/g, project.name);
      const pg = await make({ parentId: root.id, title, doc: tpl.doc, stageId: stageIds.get(w.week) ?? null, templateKey: k, position: pos++, note: `Created from template “${tpl.title}”` });
      pages.set(k, { number: pg.number, title: pg.title });
    }
    const doc = packageDoc(pages, { docs: docsBase, wiegers: wiegersBase });
    const json = doc as unknown as Prisma.InputJsonValue;
    const text = tiptapToText(doc);
    await tx.workPage.update({ where: { id: root.id }, data: { contentJson: json, contentText: text } });
    await tx.workPageVersion.updateMany({ where: { pageId: root.id, n: 1 }, data: { contentJson: json, contentText: text } });
    // DoD = sáu liên kết; giữ mọi khoá cài đặt khác (mô-đun, MoSCoW…).
    const cur = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
    const settings = { ...((cur.settings as Record<string, unknown> | null) ?? {}), definitionOfDone: SWR302_DOD, swr302: { weeks: SWR302_WEEKS.length, deliverables: SWR302_EPICS.length } };
    await tx.workProject.update({ where: { id: projectId }, data: { settings: settings as Prisma.InputJsonValue } });
    return { stageIds, pages };
  }, { timeout: 60_000, maxWait: 10_000 });

  const epicType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'EPIC' }, select: { id: true } });
  let epics = 0;
  if (epicType) {
    for (const e of SWR302_EPICS) {
      const pg = e.doc ? made.pages.get(e.doc) : null;
      const descriptionJson = {
        type: 'doc',
        content: [p(t(e.scope)), p(t('Document: '), ...(pg ? [link(pg.title, `${docsBase}/${pg.number}`)] : [link('Requirements → Wiegers', wiegersBase)])), p(t(`Due: end of week ${e.week}.`))],
      };
      await createIssue({ projectId, typeId: epicType.id, title: e.title, stageId: made.stageIds.get(e.week) ?? null, descriptionJson: descriptionJson as unknown as Prisma.InputJsonValue }, { kind: 'USER', userId });
      epics++;
    }
  }
  return { stages: made.stageIds.size, pages: made.pages.size + 1, epics };
}
