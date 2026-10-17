/**
 * Registry lệnh — CTW Diagram (10/10/2026). Có trên MCP (AI ngoài), Ask AI (web) và agent BUILTIN.
 *
 *   Đọc:  diagram_list · diagram_get
 *   Ghi:  diagram_generate — CT Work vẽ từ CHÍNH dữ liệu dự án (UC/actor/BR/màn/workflow/repo/Docs), kiểm "mọi thực thể có
 *                            nguồn", lưu thành sơ đồ PROPOSED (người duyệt trong Diagram Studio). Ask AI: chỉ là ĐỀ XUẤT tới khi
 *                            người bấm Apply.
 *         diagram_update   — sửa nguồn Mermaid / tiêu đề / liên kết, hoặc `redraw: true` để vẽ lại từ dữ liệu. Agent sửa sơ đồ
 *                            người đã làm ⇒ phiên bản PROPOSED chờ người nhận.
 *         diagram_fill_report — đặt sơ đồ ĐÃ DUYỆT vào trang Report 3/4 (một phiên bản trang mới).
 *   Database designer (17/10/2026 — sơ đồ định dạng SQL):
 *         diagram_sql_export — đọc: script cho SQL Server/PostgreSQL/MySQL/SQLite/MongoDB/Mermaid/DBML/JSON + kiểm thiết kế
 *         diagram_sql_create — ghi: tạo sơ đồ CSDL từ câu CREATE TABLE (agent ⇒ PROPOSED)
 * Mỗi lệnh: `projectFor` với tuyến REST tương đương rồi gọi THẲNG service (quyền trong diagrams.service).
 */

import { z } from 'zod';
import { BadRequestError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor, requireWrite } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { DIAGRAM_STATUSES, DIAGRAM_TYPES, GENERATABLE } from '../diagram.js';
import { analyzeSql, EXPORT_TARGETS, exportModel, joinMeta, SOURCE_DIALECTS, splitMeta, sqlToMermaid } from '../sqlDesign/index.js';
import * as dg from '../diagrams.service.js';
import { refNumber } from '../srs.js';
import { defineTool, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const dRef = z.union([z.number().int().positive(), z.string().min(1).max(12)]).describe('Diagram number (3) or key ("D-3")');
const dNo = (ref: number | string) => {
  const n = typeof ref === 'number' ? ref : Number(/^\s*(?:D-?)?0*(\d{1,6})\s*$/i.exec(String(ref))?.[1] ?? NaN);
  if (!Number.isInteger(n) || n <= 0) throw new BadRequestError(`"${String(ref)}" is not a diagram (use 3 or "D-3")`, 'VALIDATION_ERROR');
  return n;
};
const ucArg = z.union([z.number().int().positive(), z.string().min(1).max(12)]).describe('Use case number (5) or ID ("UC-05")');
const ucNo = (ref: number | string | undefined) => (ref === undefined ? undefined : refNumber(ref, 'UC') ?? (() => { throw new BadRequestError(`"${String(ref)}" is not a use case`, 'VALIDATION_ERROR'); })());
const url = (p: { workspaceSlug: string; key: string }, n: number) => `/work/${p.workspaceSlug}/${p.key}/diagrams?d=${n}`;

const diagramList = defineTool({
  name: 'diagram_list', title: 'List diagrams', group: 'docs',
  description: 'Lists the project\'s diagrams (D-n): type (sequence, use case, ERD, class, activity, state, deployment…), title, status (PROPOSED = AI draft waiting for review / DRAFT / APPROVED), current and approved version, linked use case / issue / page, open comments, pending AI proposals.',
  write: false,
  input: z.object({ project: projectArg, type: z.enum(DIAGRAM_TYPES).optional(), status: z.enum(DIAGRAM_STATUSES).optional(), useCase: ucArg.optional(), text: z.string().max(200).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/diagrams']]);
    const r = await dg.listDiagrams(ctx.userId, p.id, { type: a.type, status: a.status, useCase: ucNo(a.useCase) ?? null, text: a.text });
    return untrusted('diagram list', json(r.items.map((d) => ({
      key: d.key, type: d.type, title: d.title, status: d.status, version: d.currentVersion, approvedVersion: d.approvedVersion, format: d.format,
      useCase: d.useCase?.key ?? null, issue: d.issue?.key ?? null, page: d.page ? `Doc ${d.page.number}` : null, feature: d.feature,
      openComments: d.openComments, pendingProposals: d.pendingProposals, assumptions: d.assumptions, updatedBy: d.updatedBy?.name ?? null, url: url(p, d.number),
    }))));
  },
});

const diagramGet = defineTool({
  name: 'diagram_get', title: 'Read one diagram', group: 'docs',
  description: 'Reads one diagram: its source (Mermaid, or real SQL CREATE TABLE statements for database designs — then also a table/relationship summary and design checks), syntax check, where it came from (sources, assumptions), linked use case/issue/page, pending AI proposals, open comments, and links to the drawn SVG/PNG image when available.',
  write: false,
  input: z.object({ project: projectArg, diagram: dRef }),
  run: async (ctx, a) => {
    const n = dNo(a.diagram);
    const p = await projectFor(ctx, a.project, [['GET', `/diagrams/${n}`]]);
    const d = await dg.diagramForAi(ctx.userId, p.id, n);
    // CTW đợt 8c: ảnh vẽ sẵn (SVG/PNG) — tải bằng GET /api/v1/work/projects/<id>/diagrams/<n>/image.(svg|png) với cùng token.
    const mm = d.format === 'MERMAID' ? d.source : d.format === 'SQL' ? sqlToMermaid(d.source) : null;
    const img = mm ? await import('../diagramRender.service.js').then((x) => x.renderStatus(mm)) : null;
    const api = `/api/v1/work/projects/${p.id}/diagrams/${n}/image`;
    return untrusted(`diagram D-${n}`, json({ ...d, url: url(p, n), image: img ? { svg: img.svg ? `${api}.svg?version=${d.version}` : null, png: img.png ? `${api}.png?version=${d.version}` : null, drawn: img.svg || img.png, note: img.svg || img.png ? 'Image of the current version (same token). Without ?version the approved version is returned.' : 'Not drawn yet — someone has to open the diagram once in CT Work.' } : null }));
  },
});

const genInput = {
  type: z.enum(GENERATABLE).describe('SEQUENCE needs useCase · USE_CASE (optionally per feature) · ERD (repo → Data Dictionary → Docs) · CLASS (repo) · ACTIVITY (useCase, or the project workflow) · STATE (project workflow, or entities:["Reservation"] for an entity status enum in the repo) · SCREEN_FLOW · DEPLOYMENT (docker-compose → Docs) · ARCHITECTURE · DATA_FLOW'),
  useCase: ucArg.optional(),
  feature: z.string().max(120).optional().describe('Feature group (use case diagram / screen flow per feature; package filter for CLASS)'),
  entities: z.array(z.string().max(80)).max(30).optional().describe('ERD: only these tables · STATE: the entity whose status enum to use'),
  source: z.enum(['auto', 'repo', 'dictionary', 'docs', 'workflow']).optional(),
  instruction: z.string().max(1000).optional().describe('Extra request for AI-drawn types (architecture, data flow, ERD from Docs)'),
  title: z.string().max(200).optional(),
};

const diagramGenerate = defineTool({
  name: 'diagram_generate', title: 'Draw a diagram from project data', group: 'docs',
  description: 'CT Work draws a diagram from THIS project\'s own data — use cases, actors, business rules, screens, workflow, the connected GitHub/GitLab repository (Prisma schema, Flyway SQL, JPA entities, classes, docker-compose) and Docs — checks that every actor/entity/use case in it exists in that data (anything else is labelled "(assumed)"), and saves it as a PROPOSED diagram for a person to approve in Diagram Studio. Example: {"type":"SEQUENCE","useCase":"UC-05"}.',
  write: true,
  input: z.object({ project: projectArg, ...genInput, issue: issueArg.optional().describe('Issue to link (defaults to the use case\'s issue)') }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/diagrams/generate']]);
    const r = await dg.generateDiagram(ctx.userId, p.id, {
      type: a.type, useCase: a.useCase ?? null, feature: a.feature ?? null, entities: a.entities ?? null, source: a.source ?? null,
      instruction: a.instruction ?? null, title: a.title ?? null, issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : null,
    });
    const d = r.diagram as { key: string; number: number; title: string; status: string };
    return { proposed: d.key, title: d.title, status: d.status, review: url(p, d.number), sources: r.check.sources.map((s) => s.label), assumptions: r.check.assumptions, notes: r.check.notes, drawnBy: r.check.usedAi ? `AI (${r.check.model ?? 'model'})` : 'CT Work from data (no AI)', repairedOnce: r.check.repaired };
  },
});

const diagramUpdate = defineTool({
  name: 'diagram_update', title: 'Update a diagram', group: 'docs',
  description: 'Changes a diagram: a new Mermaid source — or `sql` for a database design (SQL format) — (saved as a new version — an AI agent\'s change to a person\'s diagram becomes a PROPOSED version waiting for review), title/description/feature, linked use case or issue; or redraw:true to redraw it from current project data (always a proposal).',
  write: true,
  input: z.object({
    project: projectArg, diagram: dRef, mermaid: z.string().max(60_000).optional(), sql: z.string().max(200_000).optional().describe('Database designs only: the full SQL (CREATE TABLE …, ALTER TABLE … ADD CONSTRAINT, CREATE INDEX …)'), title: z.string().max(200).optional(), description: z.string().max(8000).optional(),
    feature: z.string().max(120).optional(), useCase: ucArg.optional(), issue: issueArg.optional(), note: z.string().max(300).optional(),
    redraw: z.boolean().optional(), ...Object.fromEntries(Object.entries(genInput).filter(([k]) => k !== 'type' && k !== 'useCase' && k !== 'feature' && k !== 'title')),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = dNo(a.diagram);
    const p = await projectFor(ctx, a.project, [['PATCH', `/diagrams/${n}`]]);
    if (a.redraw) {
      const cur = await dg.getDiagram(ctx.userId, p.id, n);
      if (!(GENERATABLE as readonly string[]).includes(cur.type)) throw new BadRequestError(`${cur.typeLabel} diagrams cannot be redrawn from data`, 'VALIDATION_ERROR');
      const r = await dg.generateDiagram(ctx.userId, p.id, {
        type: cur.type as (typeof GENERATABLE)[number], useCase: a.useCase ?? cur.useCase?.number ?? null, feature: a.feature ?? cur.feature, update: n,
        entities: (a as { entities?: string[] }).entities ?? null, source: (a as { source?: 'auto' }).source ?? null, instruction: (a as { instruction?: string }).instruction ?? null,
      });
      return { diagram: `D-${n}`, proposedVersion: (r.diagram as { proposedVersion?: number }).proposedVersion ?? null, review: url(p, n), assumptions: r.check.assumptions };
    }
    let source = a.sql ?? a.mermaid;
    if (a.sql !== undefined) {
      const cur = await dg.getDiagram(ctx.userId, p.id, n);
      if (cur.format !== 'SQL') throw new BadRequestError(`D-${n} is a ${cur.format} diagram — send "mermaid", not "sql"`, 'VALIDATION_ERROR');
      source = joinMeta(a.sql, splitMeta(cur.source).meta); // giữ hệ quản trị + vị trí bảng người đã kéo
    }
    const out = await dg.updateDiagram(ctx.userId, p.id, n, {
      source, title: a.title, description: a.description, feature: a.feature, note: a.note,
      useCase: ucNo(a.useCase), issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : undefined,
      origin: source !== undefined && ctx.agent ? { generator: 'agent', at: new Date().toISOString() } : undefined,
    });
    return { diagram: out.key, version: out.currentVersion, proposedVersion: out.proposedVersion, lint: out.lint ? { ok: out.lint.ok, errors: out.lint.errors.slice(0, 5) } : null, review: url(p, n) };
  },
});

const diagramFill = defineTool({
  name: 'diagram_fill_report', title: 'Put approved diagrams into Report 3/4', group: 'docs',
  description: 'Places the APPROVED diagrams into the project\'s FPT Report 3 (use case diagrams, ERD, main workflows) or Report 4 (software architecture, database design, and per feature: class + sequence diagrams) as one new page version.',
  write: true,
  input: z.object({ project: projectArg, report: z.union([z.literal(3), z.literal(4)]) }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/diagrams/fill-report']]);
    return dg.fillReport(ctx.userId, p.id, a.report);
  },
});

const diagramSqlExport = defineTool({
  name: 'diagram_sql_export', title: 'Export a database design as scripts', group: 'docs',
  description: 'For a database design diagram (SQL format): returns a runnable script for another database — sqlserver, postgres, mysql (8), sqlite, mongodb (collections with $jsonSchema validators + indexes), mermaid (ERD), dbml or json — with type mapping (NVARCHAR→VARCHAR, IDENTITY→GENERATED AS IDENTITY/AUTO_INCREMENT, BIT→BOOLEAN…), tables ordered parents first, a re-runnable DROP preamble and conversion notes; plus the design checks (missing PK, unindexed FK, FLOAT money, 1NF…).',
  write: false,
  input: z.object({
    project: projectArg, diagram: dRef, target: z.enum(EXPORT_TARGETS), naming: z.enum(['keep', 'snake', 'lower']).optional().describe('Rename tables/columns (snake_case is idiomatic for PostgreSQL)'),
    drop: z.boolean().optional().describe('Include DROP TABLE IF EXISTS first (default true — deletes data when run)'), database: z.string().max(80).optional(),
  }),
  run: async (ctx, a) => {
    const n = dNo(a.diagram);
    const p = await projectFor(ctx, a.project, [['GET', `/diagrams/${n}`]]);
    const d = await dg.getDiagram(ctx.userId, p.id, n);
    if (d.format !== 'SQL') throw new BadRequestError(`D-${n} is not a database design (format ${d.format}) — only SQL diagrams can be exported as scripts`, 'VALIDATION_ERROR');
    const an = analyzeSql(d.source);
    const r = exportModel(an.parse.model, { target: a.target, naming: a.naming, drop: a.drop, database: a.database ?? null, title: d.title, lang: 'en' });
    return untrusted(`D-${n} as ${a.target}`, json({
      fileName: r.fileName, target: a.target, sourceDialect: an.parse.dialect, tables: an.parse.model.tables.length,
      parseErrors: an.parse.errors.slice(0, 10).map((e) => ({ line: e.span?.line ?? null, message: e.message.en })),
      notes: r.notes.map((x) => x.en), designChecks: an.lint.slice(0, 25).map((x) => ({ severity: x.severity, code: x.code, message: x.message.en, why: x.why?.en })),
      script: r.text,
    }));
  },
});

const diagramSqlCreate = defineTool({
  name: 'diagram_sql_create', title: 'Create a database design from SQL', group: 'docs',
  description: 'Creates a database design diagram (ERD drawn live from real SQL) from CREATE TABLE / ALTER TABLE … ADD CONSTRAINT / CREATE INDEX statements in SQL Server, PostgreSQL, MySQL or SQLite syntax. An AI agent\'s diagram is saved as PROPOSED for a person to accept. Returns the parse problems and design checks so you can fix the SQL with diagram_update {sql}.',
  write: true,
  input: z.object({
    project: projectArg, title: z.string().min(1).max(200), sql: z.string().min(1).max(200_000), dialect: z.enum(SOURCE_DIALECTS).optional().describe('Default: detected from the syntax'),
    description: z.string().max(8000).optional(), issue: issueArg.optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/diagrams']]);
    const an = analyzeSql(a.sql, { dialect: a.dialect });
    if (!an.parse.model.tables.length) throw new BadRequestError('No CREATE TABLE found — send table definitions', 'VALIDATION_ERROR');
    const d = await dg.createDiagram(ctx.userId, p.id, {
      format: 'SQL', type: 'ERD', title: a.title, description: a.description ?? null, source: joinMeta(a.sql, { dialect: an.parse.dialect }),
      issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : undefined, origin: ctx.agent ? { generator: 'agent', at: new Date().toISOString() } : undefined,
    });
    return {
      diagram: d.key, status: d.status, review: url(p, d.number), dialect: an.parse.dialect, tables: an.parse.model.tables.map((t) => t.name),
      parseErrors: an.parse.errors.slice(0, 10).map((e) => ({ line: e.span?.line ?? null, message: e.message.en })),
      designChecks: an.lint.slice(0, 15).map((x) => ({ severity: x.severity, code: x.code, message: x.message.en })),
    };
  },
});

export const DIAGRAM_COMMANDS: ToolDef[] = [diagramList, diagramGet, diagramGenerate, diagramUpdate, diagramFill, diagramSqlExport, diagramSqlCreate];
