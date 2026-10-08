/**
 * CT Work — CTW đợt 3A (A30): MẪU DỰ ÁN CAPSTONE (đồ án tốt nghiệp FPT SEP490 / ISP490).
 *
 * Tạo dự án với mẫu CAPSTONE ⇒ ngoài quy trình/loại thẻ (templates.ts) còn dựng sẵn — thay cho script tay của LabFlow
 * (`scripts/labflow-seed/sep490-ho-so.mjs`):
 *   - 6 GIAI ĐOẠN theo đúng lịch khung của trường (bảng "1.1 Cost & Time Estimations" của Report 2 bản gốc):
 *     Initiating → Planning & Initial Requirements → Software Design → Implementation → Verification & Validation → Closing.
 *   - 3 ITERATION (sprint "Iteration 1–3") của Stage 4.
 *   - Trang Docs theo bộ mẫu "FPT Capstone" (Report 1 → 7), gắn đúng giai đoạn nộp, dưới một trang gốc có bảng lịch nộp.
 *   - Mỗi Report một EPIC (gắn giai đoạn, mô tả trỏ về trang Docs) — WBS/Project Tracking (đợt 3B) đọc cây epic→story.
 *   - Mô-đun bật sẵn: stages, approvals, docs, raid, meetings, resources. Tests 5.1/5.2/5.3, RTM, Project Tracking
 *     luôn có (không phải mô-đun). Vai TEACHER cho giảng viên hướng dẫn: đọc mọi thứ, bình luận, duyệt cổng giai đoạn.
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { StudioModule } from './constants.js';
import { getTemplate } from './docTemplates.js';
import type { PmNode } from './docMarkdown.js';
import { createIssue } from './issueChange.js';
import { snapshotTx } from './pages.service.js';
import { tiptapToText } from './tiptapText.js';

export const CAPSTONE_MODULES: readonly StudioModule[] = ['stages', 'approvals', 'docs', 'raid', 'meetings', 'resources'];

export interface CapstoneStage { n: number; slug: string; name: string; reports: string[] }
export const CAPSTONE_STAGES: readonly CapstoneStage[] = [
  { n: 1, slug: 'project-initiating', name: 'Stage 1: Project Initiating (week 1)', reports: ['fpt-report1-project-introduction'] },
  { n: 2, slug: 'planning-requirements', name: 'Stage 2: Project Planning & Initial Requirements (weeks 2-3)', reports: ['fpt-report3-srs', 'fpt-report2-project-management-plan'] },
  { n: 3, slug: 'software-design', name: 'Stage 3: Software Design (weeks 4-5)', reports: ['fpt-report4-sds', 'fpt-report5-test-documentation'] },
  { n: 4, slug: 'implementation', name: 'Stage 4: Implementation (weeks 6-11)', reports: [] },
  { n: 5, slug: 'verification-validation', name: 'Stage 5: Verification & Validation (weeks 12-13)', reports: ['fpt-report6-user-guides'] },
  { n: 6, slug: 'closing', name: 'Stage 6: Closing (week 14)', reports: ['fpt-report7-final-report'] },
];
export const CAPSTONE_ITERATIONS = ['Iteration 1 (weeks 6-7)', 'Iteration 2 (weeks 8-9)', 'Iteration 3 (weeks 10-11)'];

/** Epic theo Report — tên + giai đoạn + trang Docs (null = việc không có trang, vd gói phần mềm). */
export const CAPSTONE_EPICS: ReadonlyArray<{ title: string; stage: number; doc: string | null; scope: string }> = [
  { title: 'Report 1 — Project Introduction', stage: 1, doc: 'fpt-report1-project-introduction', scope: 'Project information, team, background, existing solutions, opportunity, scope & limitations.' },
  { title: 'Report 2 — Project Management Plan + Project Tracking', stage: 2, doc: 'fpt-report2-project-management-plan', scope: 'Cost & time estimation (WBS in man-days), objectives, risks, processes, quality, RACI, communication, configuration management.' },
  { title: 'Report 3 — Software Requirement Specification (v0.9 → v1.2)', stage: 2, doc: 'fpt-report3-srs', scope: 'Context diagram, workflows, actors and use cases, screen authorization, use case specifications, functional and non-functional requirements, business rules, messages.' },
  { title: 'Report 4 — Software Design Specification (v1.0 → v1.3)', stage: 3, doc: 'fpt-report4-sds', scope: 'Architecture, package diagram, database design, class and sequence diagrams for every coded function, class specifications.' },
  { title: 'Report 5 — Test Documentation + 5.1 Unit / 5.2 Integration / 5.3 System Test', stage: 3, doc: 'fpt-report5-test-documentation', scope: 'Test plan (Report 5.0) and the three test workbooks — export them from Tests → FPT reports.' },
  { title: 'Software Packages v1–v3 (Implementation iterations)', stage: 4, doc: null, scope: 'Code package, unit test report, integration test cases and report, and a tagged software package at the end of each iteration.' },
  { title: 'Report 6 — Software User Guides', stage: 5, doc: 'fpt-report6-user-guides', scope: 'Deliverable package, installation guides, user manual screen by screen.' },
  { title: 'Report 7 — Final Project Report + Defense', stage: 6, doc: 'fpt-report7-final-report', scope: 'Reports 1–6 merged in their final versions, acknowledgement, deliverables; presentation slides and defense rehearsal.' },
];

const t = (text: string, marks?: PmNode['marks']): PmNode => (marks ? { type: 'text', text, marks } : { type: 'text', text });
const p = (...c: PmNode[]): PmNode => (c.length ? { type: 'paragraph', content: c } : { type: 'paragraph' });
const bold = (text: string) => t(text, [{ type: 'bold' }]);
const link = (text: string, href: string) => t(text, [{ type: 'link', attrs: { href, target: null, rel: 'noopener noreferrer nofollow' } }]);
const cell = (type: string, c: PmNode[]): PmNode => ({ type, attrs: { colspan: 1, rowspan: 1, colwidth: null }, content: [p(...c)] });

function rootDoc(rows: Array<{ stage: CapstoneStage; title: string; href: string | null }>): PmNode {
  return {
    type: 'doc',
    content: [
      p(t('Every report of the FPT Capstone (SEP490 / ISP490), in the official template headings. Each page belongs to the stage it is due in; the schedule follows the school\'s 14-week plan.')),
      { type: 'heading', attrs: { level: 2 }, content: [t('Submission schedule')] },
      {
        type: 'table',
        content: [
          { type: 'tableRow', content: ['Stage', 'Document', 'Export'].map((h) => cell('tableHeader', [t(h)])) },
          ...rows.map((r) => ({
            type: 'tableRow',
            content: [
              cell('tableCell', [t(r.stage.name)]),
              cell('tableCell', [r.href ? link(r.title, r.href) : t(r.title)]),
              cell('tableCell', [t(r.href ? 'Word (.docx) / PDF from the page menu' : 'Excel from Tests → FPT reports')]),
            ],
          })),
        ],
      },
      { type: 'heading', attrs: { level: 2 }, content: [t('How to work with these pages')] },
      {
        type: 'bulletList',
        content: [
          [bold('Keep every heading and its number'), t(' — lecturers grade against the template. Add content under the headings; copy a block for each actor, feature or class.')],
          [bold('Fill from project data'), t(' (page menu) rebuilds the Record of Changes from the page history, and fills the team, risks (RAID log) and schedule (stages, versions) where the template has those tables.')],
          [bold('Notes that start with "Guide:" or "Purpose:"'), t(' explain the template. They are left out of the Word and PDF export.')],
          [bold('Diagrams'), t(': paste or drop screenshots, or write a Mermaid block (code block, language "mermaid") — it is drawn on the page and in the export.')],
          [bold('Your supervisor'), t(': invite them to the project with the Teacher role. They can read everything, comment, and approve stage gates.')],
        ].map((c) => ({ type: 'listItem', content: [p(...c)] })),
      },
    ],
  };
}

/**
 * Dựng phần riêng của dự án Capstone (gọi NGAY sau khi tạo dự án, ngoài transaction tạo dự án). Giai đoạn + iteration +
 * cây Docs trong MỘT transaction; epic tạo sau qua createIssue (đánh số thẻ, lịch sử, sự kiện như mọi thẻ).
 */
export async function seedCapstone(userId: number, projectId: number, base: { wsSlug: string; key: string }) {
  const tpls = new Map<string, Awaited<ReturnType<typeof getTemplate>>>();
  for (const s of CAPSTONE_STAGES) for (const k of s.reports) {
    try { tpls.set(k, await getTemplate(k)); } catch { logger.warn('[work] mẫu Capstone thiếu tệp — bỏ qua', { key: k }); }
  }
  const docsBase = `/work/${base.wsSlug}/${base.key}/docs`;
  const made = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_projects WHERE id = ${projectId} FOR UPDATE`;
    const stageIds = new Map<number, number>();
    for (const s of CAPSTONE_STAGES) {
      const row = await tx.workStage.create({ data: { projectId, n: s.n, slug: s.slug, name: s.name }, select: { id: true } });
      stageIds.set(s.n, row.id);
    }
    const lastSprint = await tx.workSprint.aggregate({ where: { projectId }, _max: { position: true } });
    for (const [i, name] of CAPSTONE_ITERATIONS.entries()) {
      await tx.workSprint.create({ data: { projectId, name, position: (lastSprint._max.position ?? 0) + i + 1, goal: `Implementation ${name.split(' (')[0]}: SDS update, code + unit tests, integration tests, SRS for the next iteration, software package.` } });
    }
    let number = ((await tx.workPage.aggregate({ where: { projectId }, _max: { number: true } }))._max.number ?? 0) + 1;
    const make = async (d: { parentId: number | null; title: string; doc: PmNode; stageId?: number | null; templateKey?: string | null; position: number; note?: string }) => {
      const json = d.doc as unknown as Prisma.InputJsonValue;
      const text = tiptapToText(d.doc).slice(0, 1_000_000);
      const row = await tx.workPage.create({
        data: {
          projectId, number: number++, parentId: d.parentId, title: d.title.slice(0, 255), contentJson: json, contentText: text,
          ownerId: userId, lastEditedById: userId, stageId: d.stageId ?? null, templateKey: d.templateKey ?? null, position: d.position,
        },
        select: { id: true, number: true, title: true },
      });
      await snapshotTx(tx, row.id, userId, { title: row.title, contentJson: json, contentText: text }, 'CREATE', d.note ?? null);
      return row;
    };
    const root = await make({ parentId: null, title: 'Capstone documents (FPT)', doc: { type: 'doc', content: [p()] }, position: 0 });
    const pages = new Map<string, { number: number; title: string }>();
    let pos = 0;
    for (const s of CAPSTONE_STAGES) for (const k of s.reports) {
      const tpl = tpls.get(k);
      if (!tpl) continue;
      // Tiêu đề trang = tên Report của mẫu ("Report 2 – Project Management Plan"), không kèm tiền tố thư viện.
      const pg = await make({ parentId: root.id, title: tpl.pageTitle, doc: tpl.doc, stageId: stageIds.get(s.n) ?? null, templateKey: k, position: pos++, note: `Created from template “${tpl.title}”` });
      pages.set(k, { number: pg.number, title: pg.title });
    }
    type Row = { stage: CapstoneStage; title: string; href: string | null };
    const rows: Row[] = CAPSTONE_STAGES.flatMap((s): Row[] => (s.reports.length
      ? s.reports.filter((k) => pages.has(k)).map((k) => ({ stage: s, title: pages.get(k)!.title, href: `${docsBase}/${pages.get(k)!.number}` }))
      : [{ stage: s, title: 'Report 5.1 Unit Test · 5.2 Integration Test (each iteration)', href: null }]));
    rows.splice(rows.findIndex((r) => r.stage.n === 5) + 1, 0, { stage: CAPSTONE_STAGES[4], title: 'Report 5.3 System Test', href: null });
    const doc = rootDoc(rows);
    const json = doc as unknown as Prisma.InputJsonValue;
    const text = tiptapToText(doc);
    await tx.workPage.update({ where: { id: root.id }, data: { contentJson: json, contentText: text } });
    await tx.workPageVersion.updateMany({ where: { pageId: root.id, n: 1 }, data: { contentJson: json, contentText: text } });
    return { stageIds, pages };
  }, { timeout: 60_000, maxWait: 10_000 });

  const epicType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'EPIC' }, select: { id: true } });
  let epics = 0;
  if (epicType) {
    for (const e of CAPSTONE_EPICS) {
      const pg = e.doc ? made.pages.get(e.doc) : null;
      const descriptionJson = {
        type: 'doc',
        content: [p(t(e.scope)), ...(pg ? [p(t('Document: '), link(pg.title, `${docsBase}/${pg.number}`))] : [])],
      };
      await createIssue({ projectId, typeId: epicType.id, title: e.title, stageId: made.stageIds.get(e.stage) ?? null, descriptionJson: descriptionJson as unknown as Prisma.InputJsonValue }, { kind: 'USER', userId });
      epics++;
    }
  }
  return { stages: made.stageIds.size, iterations: CAPSTONE_ITERATIONS.length, pages: made.pages.size + 1, epics };
}
