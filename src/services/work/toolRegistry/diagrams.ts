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
 * Mỗi lệnh: `projectFor` với tuyến REST tương đương rồi gọi THẲNG service (quyền trong diagrams.service).
 */

import { z } from 'zod';
import { BadRequestError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor, requireWrite } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { DIAGRAM_STATUSES, DIAGRAM_TYPES, GENERATABLE } from '../diagram.js';
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
  description: 'Reads one diagram: its Mermaid source (current version), syntax check, where it came from (sources, assumptions), linked use case/issue/page, pending AI proposals, open comments, and links to the drawn SVG/PNG image when available.',
  write: false,
  input: z.object({ project: projectArg, diagram: dRef }),
  run: async (ctx, a) => {
    const n = dNo(a.diagram);
    const p = await projectFor(ctx, a.project, [['GET', `/diagrams/${n}`]]);
    const d = await dg.diagramForAi(ctx.userId, p.id, n);
    // CTW đợt 8c: ảnh vẽ sẵn (SVG/PNG) — tải bằng GET /api/v1/work/projects/<id>/diagrams/<n>/image.(svg|png) với cùng token.
    const img = d.format === 'MERMAID' ? await import('../diagramRender.service.js').then((x) => x.renderStatus(d.source)) : null;
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
  description: 'Changes a diagram: a new Mermaid source (saved as a new version — an AI agent\'s change to a person\'s diagram becomes a PROPOSED version waiting for review), title/description/feature, linked use case or issue; or redraw:true to redraw it from current project data (always a proposal).',
  write: true,
  input: z.object({
    project: projectArg, diagram: dRef, mermaid: z.string().max(60_000).optional(), title: z.string().max(200).optional(), description: z.string().max(8000).optional(),
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
    const out = await dg.updateDiagram(ctx.userId, p.id, n, {
      source: a.mermaid, title: a.title, description: a.description, feature: a.feature, note: a.note,
      useCase: ucNo(a.useCase), issueNumber: a.issue !== undefined ? issueNumber(p.key, a.issue) : undefined,
      origin: a.mermaid !== undefined && ctx.agent ? { generator: 'agent', at: new Date().toISOString() } : undefined,
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

export const DIAGRAM_COMMANDS: ToolDef[] = [diagramList, diagramGet, diagramGenerate, diagramUpdate, diagramFill];
