/**
 * Registry lệnh — CTW đợt 4b (10/10/2026): SWR302 hồ sơ Wiegers + sáu liên kết. Có trên MCP (AI ngoài), Ask AI (web) và
 * agent BUILTIN; lệnh GHI ở Ask AI chỉ là ĐỀ XUẤT tới khi người bấm Apply (rồi chạy dưới quyền người bấm).
 *
 *   Đọc:  swr_overview · swr_features · swr_requirements · swr_priority · swr_glossary · swr_dictionary · swr_six_links
 *   Ghi:  swr_feature_add · swr_feature_update · swr_feature_link · swr_requirement_classify · swr_requirement_set_status
 *         (agent bị chặn trong service — người duyệt) · swr_priority_set · swr_glossary_add · swr_dictionary_add ·
 *         swr_doc_fill (điền trang mẫu Wiegers — một phiên bản mới).
 * Mỗi lệnh: `projectFor` với tuyến REST tương đương rồi gọi THẲNG service (quyền trong swr.service / srsCtx).
 */

import { z } from 'zod';
import { BadRequestError } from '../../../middleware/errorHandler.js';
import { issueNumber, projectFor, requireWrite } from '../../../mcp/context.js';
import { untrusted } from '../../../mcp/protocol.js';
import { issueArg, projectArg } from '../../../mcp/tools/read.js';
import { DATA_KINDS, feNumber, INTERFACE_KINDS, LIFECYCLE, PRIORITY3, QUALITY_ATTRS, REQ_TYPES, VS_SECTIONS } from '../swr.js';
import * as swr from '../swr.service.js';
import { defineTool, type ToolDef } from './types.js';

const json = (v: unknown) => JSON.stringify(v, null, 2);
const feArg = z.union([z.number().int().positive(), z.string().min(1).max(12)]).describe('Feature number (3) or ID ("FE-3")');
const feNo = (ref: number | string) => {
  const n = feNumber(ref);
  if (!n) throw new BadRequestError(`"${String(ref)}" is not a feature (use 3 or "FE-3")`, 'VALIDATION_ERROR');
  return n;
};
const url = (p: { workspaceSlug: string; key: string }, tab?: string) => `/work/${p.workspaceSlug}/${p.key}/wiegers${tab ? `?tab=${tab}` : ''}`;

// ─── Đọc ─────────────────────────────────────────────────────────

const overview = defineTool({
  name: 'swr_overview', title: 'SWR302 requirements package — overview', group: 'srs',
  description: 'Overview of the SWR302 (Wiegers) requirements package: counts of features FE-n, requirements, glossary terms, data dictionary entries and prioritization rows; which Wiegers document pages exist (Vision & Scope, Use Cases, Business Rules, SRS, Data Dictionary); how many of the six traceability links pass.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr']]);
    return untrusted('swr overview', json({ ...(await swr.overview(ctx.userId, p.id)), url: url(p) }));
  },
});

const features = defineTool({
  name: 'swr_features', title: 'Feature register (FE-n)', group: 'srs',
  description: 'Lists the features FE-n of Vision & Scope §2.1: scope (in / out), release, priority, epic, the use cases that realize each feature and the linked requirement issues. A feature with no use case breaks link #1.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr/features']]);
    const r = await swr.listFeatures(ctx.userId, p.id);
    return untrusted('feature register', json(r.features.map((f) => ({ id: f.key, name: f.name, description: f.description, scope: f.scope, release: f.release, priority: f.priority, epic: f.epic?.key ?? null, useCases: f.useCases.map((u) => u.key), requirements: f.issues.map((i) => i!.key) }))));
  },
});

const requirements = defineTool({
  name: 'swr_requirements', title: 'Requirements with type, attributes and status', group: 'srs',
  description: 'Lists the Requirement issues with their Wiegers classification (Business / User / Functional / Quality attribute / Constraint / External interface / Data), quality attribute or interface kind, priority, source, owner, rationale, stability, version and lifecycle status (Proposed → Approved → Implemented → Verified, Deleted / Rejected). Filter by type or status.',
  write: false,
  input: z.object({ project: projectArg, type: z.enum([...REQ_TYPES, 'UNCLASSIFIED']).optional(), status: z.enum(LIFECYCLE).optional(), text: z.string().max(200).optional() }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr/requirements']]);
    const r = await swr.listRequirements(ctx.userId, p.id, { type: a.type, lifecycle: a.status, q: a.text });
    return untrusted('requirements', json({ counts: r.counts, requirements: r.requirements.map((q) => ({ id: q.key, title: q.title, type: q.reqType, category: q.subtype, priority: q.priority, status: q.lifecycle, source: q.source, rationale: q.rationale, stability: q.stability, version: q.reqVersion, next: q.next })) }));
  },
});

const priority = defineTool({
  name: 'swr_priority', title: 'Wiegers prioritization worksheet', group: 'srs',
  description: 'Reads the prioritization worksheet (Wiegers value/cost/risk model): relative weights and, for every FE-n / UC-nn row, benefit, penalty, cost, risk (1–9), value %, cost %, risk %, priority and rank. Also lists features and use cases not yet in the worksheet.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr/priority']]);
    const r = await swr.getPriority(ctx.userId, p.id);
    return untrusted('prioritization', json({ weights: r.weights, ranked: r.ranked, orphanRows: r.rows.filter((x) => x.orphan).map((x) => x.id), missing: r.candidates }));
  },
});

const glossary = defineTool({
  name: 'swr_glossary', title: 'Glossary', group: 'srs',
  description: 'Reads the project glossary (term, definition, other names that must NOT be used, source) and any word used for two different terms.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr/glossary']]);
    const r = await swr.listGlossary(ctx.userId, p.id);
    return untrusted('glossary', json({ terms: r.terms.map((t) => ({ term: t.term, definition: t.definition, aliases: t.aliases, source: t.source })), clashes: r.clashes }));
  },
});

const dictionary = defineTool({
  name: 'swr_dictionary', title: 'Data dictionary', group: 'srs',
  description: 'Reads the data dictionary (Wiegers chapter 13): primitive elements with data type, length and values; structures with their composition ("A + B + (C) + 1:n{D}"); which use cases use each element; components not yet defined; and nouns used in use case flows that have no entry (link #4).',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr/dictionary']]);
    const r = await swr.listDictionary(ctx.userId, p.id);
    return untrusted('data dictionary', json({ elements: r.elements.map((e) => ({ name: e.name, kind: e.kind, description: e.description, composition: e.composition, dataType: e.dataType, length: e.length, values: e.values, key: e.isKey, usedIn: e.usedIn })), undefinedComponents: r.undefinedComponents, nounsWithoutEntry: r.missingNouns.slice(0, 80) }));
  },
});

const sixLinks = defineTool({
  name: 'swr_six_links', title: 'Six traceability links check', group: 'srs',
  description: 'Runs the six checks a SWR302 grader makes: (1) every FE-n realized by a UC, (2) every UC names its BR-nn by ID, (3) every functional requirement traces to a UC or FE, (4) every noun in a use case flow is in the data dictionary, (5) every prioritization row is an existing FE/UC, (6) the estimation counts equal the documents. Returns pass/fail and every break.',
  write: false,
  input: z.object({ project: projectArg }),
  run: async (ctx, a) => {
    const p = await projectFor(ctx, a.project, [['GET', '/swr/six-links']]);
    const r = await swr.getSixLinks(ctx.userId, p.id);
    return untrusted('six links', json({ passed: `${r.passed}/6`, links: r.links.map((l) => ({ n: l.n, ok: l.ok, checked: l.checked, title: l.title, gaps: l.gaps.slice(0, 40), note: l.note })), declared: r.declared, actual: r.actual, url: url(p, 'six-links') }));
  },
});

// ─── Ghi ─────────────────────────────────────────────────────────

const featureFields = {
  description: z.string().max(8000).optional(),
  scope: z.enum(['IN', 'OUT']).optional().describe('OUT = Limitations & Exclusions (§2.4)'),
  priority: z.enum(PRIORITY3).optional(),
  epic: issueArg.optional().describe('Epic that implements the feature'),
};

const featureAdd = defineTool({
  name: 'swr_feature_add', title: 'Add a feature FE-n', group: 'srs',
  description: 'Adds a feature to the feature register (Vision & Scope §2.1). It gets the next FE-n. Link it to its use cases with swr_feature_link.',
  write: true,
  input: z.object({ project: projectArg, name: z.string().min(1).max(160), ...featureFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/swr/features']]);
    const f = await swr.createFeature(ctx.userId, p.id, { name: a.name, description: a.description ?? null, scope: a.scope, priority: a.priority ?? null, ...(a.epic !== undefined ? { epic: issueNumber(p.key, a.epic) } : {}) });
    return { added: f.key, name: f.name, url: url(p, 'features') };
  },
});

const featureUpdate = defineTool({
  name: 'swr_feature_update', title: 'Change a feature', group: 'srs',
  description: 'Changes a feature FE-n: name, description, scope (IN / OUT), priority or epic.',
  write: true,
  input: z.object({ project: projectArg, feature: feArg, name: z.string().min(1).max(160).optional(), ...featureFields }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const n = feNo(a.feature);
    const p = await projectFor(ctx, a.project, [['PATCH', `/swr/features/${n}`]]);
    const f = await swr.updateFeature(ctx.userId, p.id, n, { name: a.name, description: a.description, scope: a.scope, priority: a.priority, ...(a.epic !== undefined ? { epic: issueNumber(p.key, a.epic) } : {}) });
    return { updated: f.key, name: f.name };
  },
});

const featureLink = defineTool({
  name: 'swr_feature_link', title: 'Link a feature to a use case or requirement', group: 'srs',
  description: 'Links feature FE-n to a use case ("UC-03") that realizes it (link #1) or to a requirement / story / epic issue ("FP-12") that implements it (link #3).',
  write: true,
  input: z.object({ project: projectArg, feature: feArg, useCase: z.union([z.number().int().positive(), z.string().min(1).max(12)]).optional(), issue: issueArg.optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    if ((a.useCase === undefined) === (a.issue === undefined)) throw new BadRequestError('Give either useCase or issue', 'VALIDATION_ERROR');
    const n = feNo(a.feature);
    const p = await projectFor(ctx, a.project, [['POST', `/swr/features/${n}/links`]]);
    return swr.linkFeature(ctx.userId, p.id, n, a.useCase !== undefined ? { kind: 'UC', ref: a.useCase } : { kind: 'ISSUE', ref: issueNumber(p.key, a.issue!) });
  },
});

const classify = defineTool({
  name: 'swr_requirement_classify', title: 'Classify a requirement and set its attributes', group: 'srs',
  description: `Sets the Wiegers type and attributes of a Requirement issue. type: ${REQ_TYPES.join(' | ')}. category: quality attribute when type is QUALITY (${QUALITY_ATTRS.join(', ')}), interface when EXTERNAL_INTERFACE (${INTERFACE_KINDS.join(', ')}), kind when DATA (${DATA_KINDS.join(', ')}). Each change is recorded in the issue history.`,
  write: true,
  input: z.object({
    project: projectArg, issue: issueArg, type: z.enum(REQ_TYPES).optional(), category: z.string().max(24).optional(), priority: z.enum(PRIORITY3).optional(),
    source: z.string().max(300).optional().describe('Where it came from: stakeholder, interview, document'), rationale: z.string().max(8000).optional(), stability: z.enum(PRIORITY3).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['PUT', '/swr/requirements/0']]);
    const r = await swr.setRequirementInfo(ctx.userId, p.id, issueNumber(p.key, a.issue), { reqType: a.type, subtype: a.category, priority: a.priority, source: a.source, rationale: a.rationale, stability: a.stability });
    return { requirement: r.key, type: r.reqType, category: r.subtype, status: r.lifecycle, version: r.reqVersion };
  },
});

const setStatus = defineTool({
  name: 'swr_requirement_set_status', title: 'Move a requirement through its lifecycle', group: 'srs',
  description: 'Moves a Requirement issue through the Wiegers lifecycle: Proposed → Approved → Implemented → Verified, or Deleted / Rejected (reopen to Proposed). Approving, verifying, rejecting and deleting need a person (project member or lecturer) — an AI agent cannot do it.',
  write: true,
  input: z.object({ project: projectArg, issue: issueArg, status: z.enum(LIFECYCLE), note: z.string().max(500).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/swr/requirements/0/lifecycle']]);
    const r = await swr.setLifecycle(ctx.userId, p.id, issueNumber(p.key, a.issue), a.status, a.note ?? null);
    return { requirement: r.key, status: r.lifecycle, version: r.reqVersion };
  },
});

const prioritySet = defineTool({
  name: 'swr_priority_set', title: 'Score a feature or use case in the prioritization worksheet', group: 'srs',
  description: 'Adds or updates the prioritization row of a feature ("FE-3") or use case ("UC-05"): relative benefit, penalty, cost and risk on a 1–9 scale (9 = high). Priority is recalculated with the project weights.',
  write: true,
  input: z.object({
    project: projectArg, target: z.string().min(2).max(12).describe('"FE-3" or "UC-05"'),
    benefit: z.number().int().min(1).max(9).optional(), penalty: z.number().int().min(1).max(9).optional(), cost: z.number().int().min(1).max(9).optional(), risk: z.number().int().min(1).max(9).optional(),
    note: z.string().max(300).optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const m = /^\s*(FE|UC)\s*-?\s*(\d{1,5})\s*$/i.exec(a.target);
    if (!m) throw new BadRequestError('target must be "FE-n" or "UC-nn"', 'VALIDATION_ERROR');
    const p = await projectFor(ctx, a.project, [['POST', '/swr/priority/rows']]);
    const r = await swr.upsertPriorityRow(ctx.userId, p.id, { target: { kind: m[1].toUpperCase() as 'FE' | 'UC', ref: Number(m[2]) }, benefit: a.benefit, penalty: a.penalty, cost: a.cost, risk: a.risk, note: a.note });
    const all = await swr.getPriority(ctx.userId, p.id);
    return { row: r.id, scores: { benefit: r.benefit, penalty: r.penalty, cost: r.cost, risk: r.risk }, priority: all.ranked.find((x) => x.id === r.id) ?? null };
  },
});

const glossaryAdd = defineTool({
  name: 'swr_glossary_add', title: 'Add a glossary term', group: 'srs',
  description: 'Adds a term to the project glossary with its definition and the other names people use for it (which must not be used in the documents).',
  write: true,
  input: z.object({ project: projectArg, term: z.string().min(1).max(160), definition: z.string().min(1).max(8000), aliases: z.array(z.string().min(1).max(80)).max(20).optional(), source: z.string().max(200).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/swr/glossary']]);
    const t = await swr.createTerm(ctx.userId, p.id, { term: a.term, definition: a.definition, aliases: a.aliases, source: a.source ?? null });
    return { added: t.term, url: url(p, 'glossary') };
  },
});

const dictionaryAdd = defineTool({
  name: 'swr_dictionary_add', title: 'Add a data dictionary entry', group: 'srs',
  description: 'Adds a data element to the data dictionary. Primitive: give dataType, length and values. Structure: give composition with Wiegers notation — "Request ID + Requester + (Vendor) + 1:10{Requested Chemical}"; every component must also be defined.',
  write: true,
  input: z.object({
    project: projectArg, name: z.string().min(1).max(120), description: z.string().max(8000).optional(), kind: z.enum(['PRIMITIVE', 'STRUCTURE']).optional(),
    composition: z.string().max(4000).optional(), dataType: z.string().max(60).optional(), length: z.string().max(20).optional(), values: z.string().max(4000).optional(), isKey: z.boolean().optional(),
  }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', '/swr/dictionary']]);
    const e = await swr.createElement(ctx.userId, p.id, { name: a.name, description: a.description ?? null, kind: a.kind ?? (a.composition ? 'STRUCTURE' : 'PRIMITIVE'), composition: a.composition ?? null, dataType: a.dataType ?? null, length: a.length ?? null, values: a.values ?? null, isKey: a.isKey });
    return { added: e.name, kind: e.kind, url: url(p, 'dictionary') };
  },
});

const docFill = defineTool({
  name: 'swr_doc_fill', title: 'Fill a Wiegers document page from project data', group: 'docs',
  description: 'Writes project data into a Wiegers template page — vision-scope (objectives, risks, assumptions, features, releases, exclusions, stakeholders), use-cases (list + 15-row specifications), business-rules, srs (features with functional requirements, constraints, interfaces, quality attributes, data dictionary, ERD, glossary, traceability matrix) or data-dictionary. Saves one new page version (restorable from History). create: true makes the page from the template first.',
  write: true,
  input: z.object({ project: projectArg, document: z.enum(swr.DOC_KINDS), create: z.boolean().optional(), sections: z.array(z.enum(VS_SECTIONS)).max(10).optional() }),
  run: async (ctx, a) => {
    requireWrite(ctx);
    const p = await projectFor(ctx, a.project, [['POST', `/swr/docs/${a.document}/fill`]]);
    const r = await swr.fillWiegersPage(ctx.userId, p.id, a.document, { create: a.create, sections: a.sections });
    const pg = r.page as { number?: number; currentVersion?: number };
    return { page: pg.number ?? null, created: r.created, filled: r.filled, version: pg.currentVersion ?? null, url: pg.number ? `/work/${p.workspaceSlug}/${p.key}/docs/${pg.number}` : null };
  },
});

export const SWR_COMMANDS: ToolDef[] = [
  overview, features, requirements, priority, glossary, dictionary, sixLinks,
  featureAdd, featureUpdate, featureLink, classify, setStatus, prioritySet, glossaryAdd, dictionaryAdd, docFill,
];
