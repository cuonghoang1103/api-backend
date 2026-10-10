/**
 * CT Work — CTW đợt 6b (11/10/2026): SWR-3 "SRS chuyên sâu" + SWR-4 "Elicitation & stakeholder" — phần THUẦN (không DB,
 * không LLM; test ở swr6b.test.ts). Phần có DB ở swrElic.service.ts (stakeholder/RACI/phiên/khảo sát/báo cáo) và
 * srsDeep.service.ts (mô hình, prototype, checklist chất lượng, NFR, chèn vào SRS).
 *
 *   R3  Stakeholder: lưới quyền lực × quan tâm (Mendelow, Wiegers ch.2), thái độ, champion; RACI theo hoạt động yêu cầu.
 *   R1  Phiên elicitation 6 kỹ thuật (Wiegers ch.7) + câu hỏi gợi ý theo kỹ thuật + câu "nguồn" ghi vào yêu cầu.
 *   R1  AI đề xuất yêu cầu từ transcript/ghi chú: prompt + kiểm bằng chứng (trích dẫn phải có thật ở dòng đã nêu).
 *   R2  Khảo sát: 6 loại câu hỏi, kiểm câu trả lời, tổng hợp, xuất xlsx (Responses / Summary / Questions).
 *   R7  NFR có số đo: ISO/IEC 25010:2023 (9 đặc tính + đặc tính con) + Planguage (Scale/Meter/Must/Plan/Wish) + mẫu.
 *       Checklist chất lượng yêu cầu 8 tiêu chí (Wiegers ch.11 + ISO/IEC/IEEE 29148 §5.2.5): chấm TỰ ĐỘNG phần đo được.
 *   Xuất: báo cáo elicitation (TipTap ⇒ docExport .docx/.pdf) + chèn mô hình/NFR/stakeholder vào mẫu SRS Wiegers.
 */

import { z } from 'zod';
import { blocksFor, isPlaced, type PlacedDiagram } from './diagramFill.js';
import { buildTable, replaceTableAfterHeading } from './docFill.js';
import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import { acceptanceCriteria, findVagueTerms, isMeasurable, jaccard, mentionsQuality } from './specFidelity.js';
import { findHeading, sectionEnd } from './srs.js';
import { EVENT_TYPE_LABEL, type EventRow } from './srsModels.js';
import { mergeByKey, P3_LABEL, type ReqType } from './swr.js';
import { XSheet, type XStyle } from './xlsxStyled.js';

// ─── Stakeholder ─────────────────────────────────────────────────

export const STAKEHOLDER_KINDS = ['PERSON', 'GROUP', 'ORG'] as const;
export type StakeholderKind = (typeof STAKEHOLDER_KINDS)[number];
export const ATTITUDES = ['CHAMPION', 'SUPPORTER', 'NEUTRAL', 'CRITIC', 'BLOCKER'] as const;
export type Attitude = (typeof ATTITUDES)[number];
export const ATTITUDE_LABEL: Record<Attitude, string> = { CHAMPION: 'Champion', SUPPORTER: 'Supporter', NEUTRAL: 'Neutral', CRITIC: 'Critic', BLOCKER: 'Blocker' };
export const shKey = (n: number) => `SH-${n}`;
export function shNumber(ref: unknown): number | null {
  const m = /^\s*(?:SH\s*-?\s*)?(\d{1,6})\s*$/i.exec(String(ref ?? ''));
  return m ? Number(m[1]) : null;
}

/** Ngưỡng "cao" trên thang 1–5: ≥ 4. Mức 3 (mặc định) là "chưa rõ" ⇒ ô Monitor, nhắc người dùng chấm lại. */
export const HIGH = 4;
export const QUADRANTS = ['MANAGE_CLOSELY', 'KEEP_SATISFIED', 'KEEP_INFORMED', 'MONITOR'] as const;
export type Quadrant = (typeof QUADRANTS)[number];
export const QUADRANT_LABEL: Record<Quadrant, string> = {
  MANAGE_CLOSELY: 'Manage closely', KEEP_SATISFIED: 'Keep satisfied', KEEP_INFORMED: 'Keep informed', MONITOR: 'Monitor',
};
/** Lưới Mendelow: quyền lực (influence) × quan tâm (interest). */
export function quadrantOf(influence: number, interest: number): Quadrant {
  const p = influence >= HIGH;
  const i = interest >= HIGH;
  return p && i ? 'MANAGE_CLOSELY' : p ? 'KEEP_SATISFIED' : i ? 'KEEP_INFORMED' : 'MONITOR';
}

export interface StakeholderLite {
  id: number; number: number; name: string; role: string | null; organization: string | null; kind: string; userClass: string | null;
  influence: number; interest: number; attitude: string | null; isChampion: boolean; decisionRights: string | null;
  majorValue: string | null; interests: string | null; constraints: string | null; contact: string | null; notes: string | null;
}

export const shLabel = (s: Pick<StakeholderLite, 'name' | 'role'>) => (s.role ? `${s.name} (${s.role})` : s.name);

/** Lời nhắc của sổ stakeholder (không chặn lưu): chưa có champion, người quyền lực cao mà thái độ phản đối… */
export function registerWarnings(list: StakeholderLite[]): Array<{ code: string; params?: Record<string, string | number> }> {
  const out: Array<{ code: string; params?: Record<string, string | number> }> = [];
  if (!list.length) return out;
  if (!list.some((s) => s.isChampion || s.attitude === 'CHAMPION')) out.push({ code: 'NO_CHAMPION' });
  if (!list.some((s) => s.decisionRights?.trim())) out.push({ code: 'NO_DECIDER' });
  for (const s of list) if (s.influence >= HIGH && (s.attitude === 'BLOCKER' || s.attitude === 'CRITIC')) out.push({ code: 'POWERFUL_CRITIC', params: { name: s.name, key: shKey(s.number) } });
  const unrated = list.filter((s) => s.influence === 3 && s.interest === 3).length;
  if (unrated) out.push({ code: 'UNRATED', params: { n: unrated } });
  return out;
}

// ─── RACI ────────────────────────────────────────────────────────

export const RACI_ROLES = ['R', 'A', 'C', 'I'] as const;
export type RaciRole = (typeof RACI_ROLES)[number];
/** Hoạt động yêu cầu mặc định (Wiegers ch.1/ch.28 + CCB). Người dùng thêm/bớt được. */
export const DEFAULT_RACI_ACTIVITIES = [
  'Elicit requirements', 'Analyze and model requirements', 'Write the SRS', 'Review and validate requirements',
  'Approve the requirements baseline', 'Decide on change requests', 'Accept the delivered product',
];

export interface RaciProblem { activity: string; code: 'NO_A' | 'MANY_A' | 'NO_R'; count: number }
/** Mỗi hoạt động: đúng MỘT A (người chịu trách nhiệm cuối), ít nhất một R. */
export function raciProblems(activities: Array<{ id: number; name: string }>, cells: Array<{ activityId: number; role: string }>): RaciProblem[] {
  const out: RaciProblem[] = [];
  for (const a of activities) {
    const mine = cells.filter((c) => c.activityId === a.id);
    const as = mine.filter((c) => c.role === 'A').length;
    if (!as) out.push({ activity: a.name, code: 'NO_A', count: 0 });
    if (as > 1) out.push({ activity: a.name, code: 'MANY_A', count: as });
    if (!mine.some((c) => c.role === 'R')) out.push({ activity: a.name, code: 'NO_R', count: 0 });
  }
  return out;
}

// ─── Phiên elicitation ───────────────────────────────────────────

export const TECHNIQUES = ['INTERVIEW', 'WORKSHOP', 'SURVEY', 'OBSERVATION', 'DOCUMENT_ANALYSIS', 'PROTOTYPE'] as const;
export type Technique = (typeof TECHNIQUES)[number];
export const TECHNIQUE_LABEL: Record<Technique, string> = {
  INTERVIEW: 'Interview', WORKSHOP: 'Workshop', SURVEY: 'Survey / questionnaire', OBSERVATION: 'Observation', DOCUMENT_ANALYSIS: 'Document analysis', PROTOTYPE: 'Prototype review',
};
export const SESSION_STATUSES = ['PLANNED', 'DONE', 'CANCELLED'] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];
export const elcKey = (n: number) => `ELC-${n}`;
export function elcNumber(ref: unknown): number | null {
  const m = /^\s*(?:ELC\s*-?\s*)?(\d{1,6})\s*$/i.exec(String(ref ?? ''));
  return m ? Number(m[1]) : null;
}

/** Câu hỏi gợi ý theo kỹ thuật (Wiegers ch.7 "Elicitation techniques", 3G.2 của khoá SWR302). */
export const QUESTION_BANK: Record<Technique, string[]> = {
  INTERVIEW: [
    'Walk me through a typical day: which tasks do you do most often?',
    'What problems or delays do you run into with the current way of working?',
    'What would make you say the new system is a success?',
    'Which information do you need to finish this task, and where does it come from?',
    'What must never happen (errors, data loss, security)?',
    'Who else should we talk to about this?',
  ],
  WORKSHOP: [
    'Agree on the scope: which features are in, which are out?',
    'List the user classes and their main tasks (use cases).',
    'For each use case: trigger, preconditions, normal flow, exceptions.',
    'Which business rules apply, and who owns them?',
    'Which open questions need a decision, by whom and by when?',
  ],
  SURVEY: [
    'How often do you perform this task?',
    'How satisfied are you with the current process (1–5)?',
    'Which features matter most to you?',
    'What is the biggest problem you want the new system to solve?',
  ],
  OBSERVATION: [
    'Which steps does the user do that nobody mentioned in interviews?',
    'Where does the user wait, re-type data or use a workaround?',
    'Which tools, paper forms or spreadsheets are used alongside the system?',
    'How long does each task take?',
  ],
  DOCUMENT_ANALYSIS: [
    'Which existing documents describe the process (forms, reports, regulations)?',
    'Which data fields appear on each form or report?',
    'Which business rules or legal constraints do the documents state?',
    'What in the documents is outdated or contradicts what users said?',
  ],
  PROTOTYPE: [
    'Can you complete the task on this screen without help?',
    'What is missing or confusing on this screen?',
    'Is the order of the steps right?',
    'Which data should be shown, hidden or validated here?',
  ],
};

export const sessionQuestionInput = z.object({
  id: z.string().max(12).optional(),
  text: z.string().trim().min(1).max(1000),
  answer: z.string().max(8000).nullable().optional(),
});
export interface SessionQuestion { id: string; text: string; answer: string | null }

/** Câu hỏi có id ổn định (q1, q2… — giữ id cũ, cấp id mới cho câu mới). */
export function normalizeQuestions(raw: unknown): SessionQuestion[] {
  const arr = Array.isArray(raw) ? raw : [];
  const used = new Set<string>();
  const out: SessionQuestion[] = [];
  for (const r of arr.slice(0, 100)) {
    const q = r as { id?: unknown; text?: unknown; answer?: unknown };
    const text = String(q.text ?? '').trim().slice(0, 1000);
    if (!text) continue;
    let id = typeof q.id === 'string' && /^q\d{1,4}$/.test(q.id) && !used.has(q.id) ? q.id : '';
    if (!id) { let n = out.length + 1; while (used.has(`q${n}`)) n++; id = `q${n}`; }
    used.add(id);
    const answer = typeof q.answer === 'string' && q.answer.trim() ? q.answer.trim().slice(0, 8000) : null;
    out.push({ id, text, answer });
  }
  return out;
}

const ddmmyyyy = (d: Date | null | undefined) => (d ? `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}` : '');

/** Câu ghi vào trường "Source" của yêu cầu: "ELC-3 Interview, 12/10/2026 — Lan (Fulfillment Manager)" (assignment.mjs: mạnh hơn "we discussed it"). */
export function sourceText(s: { number: number; technique: string; scheduledAt: Date | null; title: string; aiSimulated?: boolean }, who?: Pick<StakeholderLite, 'name' | 'role'> | null): string {
  const tech = TECHNIQUE_LABEL[s.technique as Technique] ?? s.technique;
  const when = ddmmyyyy(s.scheduledAt);
  return `${elcKey(s.number)} ${tech}${s.aiSimulated ? ' (AI-simulated)' : ''}${when ? `, ${when}` : ''}${who ? ` — ${shLabel(who)}` : ` — ${s.title}`}`.slice(0, 300);
}

// ─── AI đề xuất yêu cầu từ phiên ─────────────────────────────────

export const PROPOSAL_TYPES = ['BUSINESS', 'USER', 'FUNCTIONAL', 'QUALITY', 'CONSTRAINT', 'EXTERNAL_INTERFACE', 'DATA'] as const satisfies readonly ReqType[];
export const proposalsOut = z.object({
  requirements: z.array(z.object({
    title: z.string().min(3).max(300),
    text: z.string().max(4000).optional().nullable(),
    type: z.string().max(30).optional().nullable(),
    priority: z.string().max(10).optional().nullable(),
    stakeholder: z.string().max(160).optional().nullable(),
    evidence: z.array(z.object({ line: z.number().int().min(1), quote: z.string().max(400) })).max(5).optional().nullable(),
  })).max(40),
  notes: z.array(z.string().max(400)).max(10).optional().nullable(),
});
export type ProposalsOut = z.infer<typeof proposalsOut>;

export interface SourceLine { n: number; text: string; who?: string | null }

/** Nguồn cho AI: transcript (họp K-2) + câu trả lời đã ghi + ghi chú — đánh số dòng để AI dẫn bằng chứng. */
export function sourceLines(input: { transcript: Array<{ text: string; who?: string | null }>; questions: SessionQuestion[]; notes: string | null; outcome?: string | null }): { lines: SourceLine[]; truncated: boolean } {
  const lines: SourceLine[] = [];
  const push = (text: string, who: string | null = null) => { const t = text.replace(/\s+/g, ' ').trim(); if (t) lines.push({ n: lines.length + 1, text: t.slice(0, 600), who }); };
  for (const l of input.transcript) push(l.text, l.who ?? null);
  for (const q of input.questions) if (q.answer) push(`Q: ${q.text} — A: ${q.answer}`);
  for (const p of String(input.notes ?? '').split(/\n+/)) push(p);
  for (const p of String(input.outcome ?? '').split(/\n+/)) push(p);
  let size = 0;
  let keep = lines.length;
  for (let i = 0; i < lines.length; i++) { size += lines[i].text.length + 12; if (size > 40_000) { keep = i; break; } }
  return { lines: lines.slice(0, keep), truncated: keep < lines.length };
}

export function proposalsPrompt(input: {
  language: 'vi' | 'en'; title: string; technique: string; objective: string | null; systemName: string;
  stakeholders: Array<{ key: string; name: string; role: string | null }>; lines: SourceLine[]; truncated: boolean;
  existing: string[];
}): { system: string; user: string } {
  const lang = input.language === 'vi' ? 'Vietnamese' : 'English';
  const system = [
    'You are a senior business analyst following Wiegers & Beatty, "Software Requirements" (3rd ed.).',
    'From the numbered source lines of ONE elicitation session, extract candidate requirements that the stakeholders actually stated or clearly implied.',
    'Rules:',
    '- Never invent needs that are not supported by the source. Every requirement MUST cite 1–3 evidence items: the source line number and a short exact quote from that line.',
    `- Write titles as one requirement statement in ${lang} ("The system shall …" / "Hệ thống phải …" for functional; a measurable statement for quality attributes).`,
    `- type is one of: ${PROPOSAL_TYPES.join(', ')}. priority is HIGH, MEDIUM or LOW when the source says how important it is, otherwise omit it.`,
    '- stakeholder: the stakeholder key (e.g. "SH-2") or name who raised it, if known.',
    '- Skip anything already in the existing requirement list.',
    '- Answer with ONE JSON object only: {"requirements":[{"title":"…","text":"…","type":"FUNCTIONAL","priority":"HIGH","stakeholder":"SH-2","evidence":[{"line":3,"quote":"…"}]}],"notes":["…"]}',
  ].join('\n');
  const user = [
    `System: ${input.systemName}`,
    `Session: ${input.title} (${TECHNIQUE_LABEL[input.technique as Technique] ?? input.technique})`,
    input.objective ? `Objective: ${input.objective}` : '',
    `Stakeholders: ${input.stakeholders.map((s) => `${s.key} ${s.name}${s.role ? ` (${s.role})` : ''}`).join('; ') || 'none recorded'}`,
    input.existing.length ? `Existing requirements (do not repeat):\n${input.existing.slice(0, 80).map((x) => `- ${x}`).join('\n')}` : '',
    `Source lines${input.truncated ? ' (truncated)' : ''}:`,
    ...input.lines.map((l) => `${l.n}. ${l.who ? `[${l.who}] ` : ''}${l.text}`),
  ].filter(Boolean).join('\n');
  return { system, user };
}

const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export interface CheckedProposal {
  title: string; text: string | null; reqType: ReqType; priority: 'HIGH' | 'MEDIUM' | 'LOW' | null; stakeholderId: number | null;
  evidence: Array<{ line: number; quote: string; verified: boolean }>; verified: boolean;
}

/**
 * Kiểm đề xuất của model: bằng chứng phải trỏ đúng dòng có thật và trích dẫn phải nằm trong dòng đó (so sau khi bỏ dấu/hoa
 * thường). Đề xuất KHÔNG có bằng chứng nào đúng ⇒ bỏ (không bịa). Trùng tên một yêu cầu đã có (jaccard ≥ 0.8) ⇒ bỏ.
 */
export function checkProposals(raw: ProposalsOut, lines: SourceLine[], stakeholders: Array<{ id: number; number: number; name: string }>, existing: string[]): { kept: CheckedProposal[]; dropped: number } {
  const byLine = new Map(lines.map((l) => [l.n, fold(l.text)]));
  const kept: CheckedProposal[] = [];
  let dropped = 0;
  for (const r of raw.requirements) {
    const ev = (r.evidence ?? []).map((e) => {
      const line = byLine.get(e.line);
      const q = fold(e.quote);
      return { line: e.line, quote: e.quote.slice(0, 400), verified: !!line && q.length >= 3 && line.includes(q) };
    });
    const title = r.title.trim();
    if (!ev.some((e) => e.verified) || existing.some((x) => jaccard(x, title) >= 0.8) || kept.some((k) => jaccard(k.title, title) >= 0.8)) { dropped++; continue; }
    const t = String(r.type ?? '').toUpperCase().replace(/[\s-]+/g, '_');
    const reqType = ((PROPOSAL_TYPES as readonly string[]).includes(t) ? t : t === 'NON_FUNCTIONAL' || t === 'NFR' ? 'QUALITY' : 'FUNCTIONAL') as ReqType;
    const p = String(r.priority ?? '').toUpperCase();
    const ref = String(r.stakeholder ?? '').trim();
    const n = shNumber(ref);
    const sh = (n ? stakeholders.find((s) => s.number === n) : null) ?? (ref ? stakeholders.find((s) => fold(s.name) === fold(ref) || fold(ref).includes(fold(s.name))) : null) ?? null;
    kept.push({
      title: title.slice(0, 300), text: r.text?.trim() ? r.text.trim().slice(0, 4000) : null, reqType,
      priority: p === 'HIGH' || p === 'MEDIUM' || p === 'LOW' ? p : null, stakeholderId: sh?.id ?? null,
      evidence: ev.filter((e) => e.verified).slice(0, 3), verified: true,
    });
  }
  return { kept: kept.slice(0, 30), dropped };
}

// ─── Khảo sát ────────────────────────────────────────────────────

export const QUESTION_KINDS = ['TEXT', 'LONG_TEXT', 'SINGLE', 'MULTI', 'SCALE', 'YES_NO'] as const;
export type QuestionKind = (typeof QUESTION_KINDS)[number];
export const SURVEY_STATUSES = ['DRAFT', 'OPEN', 'CLOSED'] as const;
export const svKey = (n: number) => `SV-${n}`;

export const surveyQuestion = z.object({
  id: z.string().regex(/^[a-z0-9_-]{1,16}$/i).optional(),
  kind: z.enum(QUESTION_KINDS),
  text: z.string().trim().min(1).max(500),
  help: z.string().max(500).nullable().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string().trim().min(1).max(200)).max(20).optional(),
  scaleMax: z.number().int().min(3).max(10).optional(),
});
export type SurveyQuestionIn = z.infer<typeof surveyQuestion>;
export interface SurveyQuestion { id: string; kind: QuestionKind; text: string; help: string | null; required: boolean; options: string[]; scaleMax: number }

/** Chuẩn hoá + kiểm danh sách câu hỏi (id ổn định, lựa chọn đủ ≥ 2, không trùng). Trả lỗi đầu tiên (chuỗi) nếu sai. */
export function normalizeSurveyQuestions(list: SurveyQuestionIn[]): { questions: SurveyQuestion[]; error: string | null } {
  const used = new Set<string>();
  const out: SurveyQuestion[] = [];
  for (const [i, q] of list.entries()) {
    let id = q.id && !used.has(q.id) ? q.id : '';
    if (!id) { let n = i + 1; while (used.has(`q${n}`)) n++; id = `q${n}`; }
    used.add(id);
    const options = [...new Set((q.options ?? []).map((o) => o.trim()).filter(Boolean))];
    if ((q.kind === 'SINGLE' || q.kind === 'MULTI') && options.length < 2) return { questions: [], error: `Question ${i + 1} ("${q.text.slice(0, 40)}") needs at least two options` };
    out.push({ id, kind: q.kind, text: q.text.trim(), help: q.help?.trim() || null, required: q.required ?? false, options: q.kind === 'SINGLE' || q.kind === 'MULTI' ? options : [], scaleMax: q.kind === 'SCALE' ? q.scaleMax ?? 5 : 5 });
  }
  if (!out.length) return { questions: [], error: 'A survey needs at least one question' };
  return { questions: out, error: null };
}

export function parseSurveyQuestions(raw: unknown): SurveyQuestion[] {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((r) => r as SurveyQuestion).filter((q) => q && typeof q.id === 'string' && (QUESTION_KINDS as readonly string[]).includes(q.kind));
}

export type Answer = string | string[] | number | boolean;
/** Kiểm câu trả lời theo câu hỏi. Câu không có trong khảo sát bị bỏ; câu bắt buộc thiếu ⇒ lỗi theo id. */
export function validateAnswers(questions: SurveyQuestion[], raw: unknown): { answers: Record<string, Answer>; errors: Array<{ id: string; code: 'REQUIRED' | 'INVALID' }> } {
  const src = (raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}) as Record<string, unknown>;
  const answers: Record<string, Answer> = {};
  const errors: Array<{ id: string; code: 'REQUIRED' | 'INVALID' }> = [];
  for (const q of questions) {
    const v = src[q.id];
    const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
    if (empty) { if (q.required) errors.push({ id: q.id, code: 'REQUIRED' }); continue; }
    if (q.kind === 'TEXT' || q.kind === 'LONG_TEXT') {
      if (typeof v !== 'string') { errors.push({ id: q.id, code: 'INVALID' }); continue; }
      const t = v.trim().slice(0, q.kind === 'TEXT' ? 500 : 5000);
      if (t) answers[q.id] = t; else if (q.required) errors.push({ id: q.id, code: 'REQUIRED' });
    } else if (q.kind === 'SINGLE') {
      if (typeof v !== 'string' || !q.options.includes(v)) { errors.push({ id: q.id, code: 'INVALID' }); continue; }
      answers[q.id] = v;
    } else if (q.kind === 'MULTI') {
      const list = Array.isArray(v) ? v : [v];
      if (!list.every((x) => typeof x === 'string' && q.options.includes(x))) { errors.push({ id: q.id, code: 'INVALID' }); continue; }
      answers[q.id] = [...new Set(list as string[])];
    } else if (q.kind === 'SCALE') {
      const n = typeof v === 'string' ? Number(v) : v;
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > q.scaleMax) { errors.push({ id: q.id, code: 'INVALID' }); continue; }
      answers[q.id] = n;
    } else if (q.kind === 'YES_NO') {
      const b = v === true || v === 'yes' || v === 'true' ? true : v === false || v === 'no' || v === 'false' ? false : null;
      if (b === null) { errors.push({ id: q.id, code: 'INVALID' }); continue; }
      answers[q.id] = b;
    }
  }
  return { answers, errors };
}

export interface QuestionSummary {
  id: string; kind: QuestionKind; text: string; answered: number;
  counts?: Array<{ option: string; n: number; pct: number }>;
  average?: number | null; distribution?: number[];
  yes?: number; no?: number;
  texts?: string[];
}

export function summarizeSurvey(questions: SurveyQuestion[], responses: Array<{ answers: unknown }>): QuestionSummary[] {
  const rows = responses.map((r) => (r.answers && typeof r.answers === 'object' ? r.answers : {}) as Record<string, Answer>);
  return questions.map((q) => {
    const vals = rows.map((r) => r[q.id]).filter((v) => v !== undefined && v !== null && v !== '');
    const base: QuestionSummary = { id: q.id, kind: q.kind, text: q.text, answered: vals.length };
    const pct = (n: number) => (vals.length ? Math.round((n / vals.length) * 1000) / 10 : 0);
    if (q.kind === 'SINGLE' || q.kind === 'MULTI') {
      base.counts = q.options.map((o) => { const n = vals.filter((v) => (Array.isArray(v) ? v.includes(o) : v === o)).length; return { option: o, n, pct: pct(n) }; });
    } else if (q.kind === 'SCALE') {
      const nums = vals.filter((v): v is number => typeof v === 'number');
      base.average = nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100 : null;
      base.distribution = Array.from({ length: q.scaleMax }, (_, i) => nums.filter((n) => n === i + 1).length);
    } else if (q.kind === 'YES_NO') {
      base.yes = vals.filter((v) => v === true).length;
      base.no = vals.filter((v) => v === false).length;
    } else {
      base.texts = vals.map(String).slice(0, 500);
    }
    return base;
  });
}

const XF = (sz = 10, b = false): XStyle['font'] => ({ name: 'Arial', sz, b });
const HEAD: XStyle = { font: XF(10, true), fill: 'C0C0C0', border: 'thin', align: { h: 'center', v: 'center', wrap: true } };
const CELL: XStyle = { font: XF(), border: 'thin', align: { v: 'top', wrap: true } };
const NUM: XStyle = { font: XF(), border: 'thin', align: { h: 'center', v: 'top' } };
const DEC: XStyle = { font: XF(), border: 'thin', align: { h: 'center', v: 'top' }, numFmt: '0.00' };
const WHEN: XStyle = { font: XF(), border: 'thin', align: { v: 'top' }, numFmt: 'dd/mm/yyyy hh:mm' };

const answerText = (q: SurveyQuestion, v: Answer | undefined): string | number => {
  if (v === undefined || v === null) return '';
  if (Array.isArray(v)) return v.join('; ');
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (q.kind === 'SCALE' && typeof v === 'number') return v;
  return String(v);
};

/** Ba sheet: Responses (một hàng một lượt) · Summary (đếm/trung bình) · Questions (loại, bắt buộc, lựa chọn). */
export function surveySheets(s: { key: string; title: string; collectName: boolean }, questions: SurveyQuestion[], responses: Array<{ createdAt: Date; respondentName: string | null; answers: unknown }>, projectName: string): XSheet[] {
  const r = new XSheet('Responses');
  const head = ['#', 'Submitted (GMT+7)', ...(s.collectName ? ['Name'] : []), ...questions.map((q, i) => `Q${i + 1}. ${q.text}`)];
  head.forEach((h, i) => { r.set(3, i + 1, h, HEAD); r.width(i + 1, i === 0 ? 6 : i === 1 ? 18 : 30); });
  r.set(1, 1, `${s.key} ${s.title} — ${projectName} (${responses.length} response${responses.length === 1 ? '' : 's'})`, { font: XF(12, true) });
  responses.forEach((x, k) => {
    const a = (x.answers && typeof x.answers === 'object' ? x.answers : {}) as Record<string, Answer>;
    let c = 1;
    r.set(4 + k, c++, k + 1, NUM);
    // Số ngày Excel CÓ phần giờ (excelSerial của xlsxStyled chỉ lấy ngày) — giờ Việt Nam (GMT+7).
    r.set(4 + k, c++, (x.createdAt.getTime() + 7 * 3_600_000 - Date.UTC(1899, 11, 30)) / 86_400_000, WHEN);
    if (s.collectName) r.set(4 + k, c++, x.respondentName ?? '', CELL);
    for (const q of questions) { const v = answerText(q, a[q.id]); r.set(4 + k, c++, v, typeof v === 'number' ? NUM : CELL); }
  });
  r.freeze = { col: 2, row: 3 };

  const sm = new XSheet('Summary');
  [8, 60, 30, 12, 12].forEach((w, i) => sm.width(i + 1, w));
  sm.set(1, 1, `Summary — ${s.key} ${s.title}`, { font: XF(12, true) });
  ['#', 'Question', 'Answer / option', 'Count', '% / average'].forEach((h, i) => sm.set(3, i + 1, h, HEAD));
  let row = 4;
  summarizeSurvey(questions, responses).forEach((q, i) => {
    const put = (opt: string, n: number | string, p: number | string | null, style: XStyle = NUM) => {
      sm.set(row, 1, `Q${i + 1}`, NUM); sm.set(row, 2, q.text, CELL); sm.set(row, 3, opt, CELL); sm.set(row, 4, n, NUM); sm.set(row, 5, p ?? '', style); row++;
    };
    if (q.counts) for (const c of q.counts) put(c.option, c.n, c.pct);
    else if (q.distribution) { put('Average', q.answered, q.average ?? '', DEC); q.distribution.forEach((n, k) => put(String(k + 1), n, q.answered ? Math.round((n / q.answered) * 1000) / 10 : 0)); }
    else if (q.yes !== undefined) { put('Yes', q.yes, q.answered ? Math.round((q.yes / q.answered) * 1000) / 10 : 0); put('No', q.no ?? 0, q.answered ? Math.round(((q.no ?? 0) / q.answered) * 1000) / 10 : 0); }
    else put('Text answers (see Responses)', q.answered, '');
  });
  sm.freeze = { col: 2, row: 3 };

  const qs = new XSheet('Questions');
  [6, 60, 14, 10, 50].forEach((w, i) => qs.width(i + 1, w));
  ['#', 'Question', 'Type', 'Required', 'Options / scale'].forEach((h, i) => qs.set(1, i + 1, h, HEAD));
  questions.forEach((q, k) => [k + 1, q.text, q.kind.replace('_', ' ').toLowerCase(), q.required ? 'Yes' : 'No', q.kind === 'SCALE' ? `1–${q.scaleMax}` : q.options.join('; ')].forEach((v, i) => qs.set(2 + k, i + 1, v, i === 0 ? NUM : CELL)));
  return [r, sm, qs];
}

// ─── NFR có số đo (ISO/IEC 25010:2023 + Planguage) ───────────────

export const ISO_CHARACTERISTICS = [
  'FUNCTIONAL_SUITABILITY', 'PERFORMANCE_EFFICIENCY', 'COMPATIBILITY', 'INTERACTION_CAPABILITY', 'RELIABILITY', 'SECURITY',
  'MAINTAINABILITY', 'FLEXIBILITY', 'SAFETY',
] as const;
export type IsoCharacteristic = (typeof ISO_CHARACTERISTICS)[number];
export const ISO_LABEL: Record<IsoCharacteristic, string> = {
  FUNCTIONAL_SUITABILITY: 'Functional suitability', PERFORMANCE_EFFICIENCY: 'Performance efficiency', COMPATIBILITY: 'Compatibility',
  INTERACTION_CAPABILITY: 'Interaction capability (usability)', RELIABILITY: 'Reliability', SECURITY: 'Security',
  MAINTAINABILITY: 'Maintainability', FLEXIBILITY: 'Flexibility (portability)', SAFETY: 'Safety',
};
export const ISO_SUBS: Record<IsoCharacteristic, string[]> = {
  FUNCTIONAL_SUITABILITY: ['Functional completeness', 'Functional correctness', 'Functional appropriateness'],
  PERFORMANCE_EFFICIENCY: ['Time behaviour', 'Resource utilization', 'Capacity'],
  COMPATIBILITY: ['Co-existence', 'Interoperability'],
  INTERACTION_CAPABILITY: ['Appropriateness recognizability', 'Learnability', 'Operability', 'User error protection', 'User engagement', 'Inclusivity', 'User assistance', 'Self-descriptiveness'],
  RELIABILITY: ['Faultlessness', 'Availability', 'Fault tolerance', 'Recoverability'],
  SECURITY: ['Confidentiality', 'Integrity', 'Non-repudiation', 'Accountability', 'Authenticity', 'Resistance'],
  MAINTAINABILITY: ['Modularity', 'Reusability', 'Analysability', 'Modifiability', 'Testability'],
  FLEXIBILITY: ['Adaptability', 'Scalability', 'Installability', 'Replaceability'],
  SAFETY: ['Operational constraint', 'Risk identification', 'Fail safe', 'Hazard warning', 'Safe integration'],
};
/** Nhóm chất lượng Wiegers (4b) ⇒ đặc tính ISO 25010. */
export const WIEGERS_TO_ISO: Record<string, IsoCharacteristic> = {
  AVAILABILITY: 'RELIABILITY', INSTALLABILITY: 'FLEXIBILITY', INTEGRITY: 'SECURITY', INTEROPERABILITY: 'COMPATIBILITY', PERFORMANCE: 'PERFORMANCE_EFFICIENCY',
  RELIABILITY: 'RELIABILITY', ROBUSTNESS: 'RELIABILITY', SAFETY: 'SAFETY', SECURITY: 'SECURITY', USABILITY: 'INTERACTION_CAPABILITY',
  EFFICIENCY: 'PERFORMANCE_EFFICIENCY', MODIFIABILITY: 'MAINTAINABILITY', PORTABILITY: 'FLEXIBILITY', REUSABILITY: 'MAINTAINABILITY',
  SCALABILITY: 'FLEXIBILITY', VERIFIABILITY: 'MAINTAINABILITY',
};
/** Ngược lại (để tự đặt nhóm Wiegers khi người chọn đặc tính ISO). */
export const ISO_TO_WIEGERS: Record<IsoCharacteristic, string> = {
  FUNCTIONAL_SUITABILITY: 'VERIFIABILITY', PERFORMANCE_EFFICIENCY: 'PERFORMANCE', COMPATIBILITY: 'INTEROPERABILITY', INTERACTION_CAPABILITY: 'USABILITY',
  RELIABILITY: 'RELIABILITY', SECURITY: 'SECURITY', MAINTAINABILITY: 'MODIFIABILITY', FLEXIBILITY: 'PORTABILITY', SAFETY: 'SAFETY',
};
export const COMPARATORS = ['<=', '>=', '='] as const;
export const VERIFICATIONS = ['TEST', 'ANALYSIS', 'INSPECTION', 'DEMONSTRATION'] as const;
export type Verification = (typeof VERIFICATIONS)[number];
export const VERIFICATION_LABEL: Record<Verification, string> = { TEST: 'Test', ANALYSIS: 'Analysis', INSPECTION: 'Inspection', DEMONSTRATION: 'Demonstration' };

export interface NfrTemplate {
  id: string; characteristic: IsoCharacteristic; sub: string; title: string; scale: string; meter: string; unit: string;
  comparator: '<=' | '>=' | '='; must: number; plan: number; conditions: string; verification: Verification;
}
/** Mẫu NFR có số (người dùng sửa số/điều kiện cho dự án của mình) — mỗi mẫu một thước đo kiểm được. */
export const NFR_TEMPLATES: NfrTemplate[] = [
  { id: 'perf-response', characteristic: 'PERFORMANCE_EFFICIENCY', sub: 'Time behaviour', title: 'Page response time', scale: '95th-percentile server response time of the main pages', meter: 'Load test (k6 / JMeter) replaying the main user journey for 10 minutes', unit: 'ms', comparator: '<=', must: 2000, plan: 1000, conditions: '100 concurrent users on the production-sized server', verification: 'TEST' },
  { id: 'perf-throughput', characteristic: 'PERFORMANCE_EFFICIENCY', sub: 'Capacity', title: 'Concurrent users', scale: 'Concurrent active users served with < 1% errors', meter: 'Step load test increasing users every 2 minutes until the error rate passes 1%', unit: 'users', comparator: '>=', must: 200, plan: 500, conditions: 'Default deployment (1 app server, 1 database)', verification: 'TEST' },
  { id: 'perf-memory', characteristic: 'PERFORMANCE_EFFICIENCY', sub: 'Resource utilization', title: 'Server memory', scale: 'Peak resident memory of the application process', meter: 'Container metrics (docker stats / Prometheus) during the load test', unit: 'MB', comparator: '<=', must: 1024, plan: 512, conditions: 'During the 100-user load test', verification: 'TEST' },
  { id: 'rel-availability', characteristic: 'RELIABILITY', sub: 'Availability', title: 'Monthly availability', scale: 'Share of 1-minute health checks answered with HTTP 200 in a calendar month', meter: 'External uptime monitor pinging /health every minute', unit: '%', comparator: '>=', must: 99.5, plan: 99.9, conditions: 'Excluding announced maintenance windows', verification: 'ANALYSIS' },
  { id: 'rel-recovery', characteristic: 'RELIABILITY', sub: 'Recoverability', title: 'Recovery time', scale: 'Time from a server crash to the service answering again (RTO)', meter: 'Recovery drill: stop the app container and time the restore', unit: 'minutes', comparator: '<=', must: 30, plan: 10, conditions: 'Database backup not older than 24 h', verification: 'DEMONSTRATION' },
  { id: 'rel-data-loss', characteristic: 'RELIABILITY', sub: 'Recoverability', title: 'Maximum data loss', scale: 'Age of the newest restorable backup (RPO)', meter: 'Restore the latest backup on a staging server and compare timestamps', unit: 'hours', comparator: '<=', must: 24, plan: 1, conditions: 'Daily automated backup', verification: 'DEMONSTRATION' },
  { id: 'sec-auth', characteristic: 'SECURITY', sub: 'Resistance', title: 'Brute-force lockout', scale: 'Failed login attempts allowed before the account is locked for 15 minutes', meter: 'Automated test sending wrong passwords', unit: 'attempts', comparator: '<=', must: 5, plan: 5, conditions: 'Per account, within 15 minutes', verification: 'TEST' },
  { id: 'sec-vuln', characteristic: 'SECURITY', sub: 'Resistance', title: 'Known vulnerabilities', scale: 'High or critical findings of an OWASP ZAP baseline scan / npm audit', meter: 'CI security scan on every release', unit: 'findings', comparator: '<=', must: 0, plan: 0, conditions: 'Release candidate build', verification: 'TEST' },
  { id: 'sec-confidentiality', characteristic: 'SECURITY', sub: 'Confidentiality', title: 'Encrypted traffic', scale: 'Share of endpoints served only over TLS 1.2+', meter: 'SSL Labs / testssl.sh scan of the public host', unit: '%', comparator: '=', must: 100, plan: 100, conditions: 'Public production host', verification: 'INSPECTION' },
  { id: 'use-learn', characteristic: 'INTERACTION_CAPABILITY', sub: 'Learnability', title: 'First-time task completion', scale: 'Share of first-time users who complete the main task without help', meter: 'Usability test with 5–8 representative users', unit: '%', comparator: '>=', must: 80, plan: 95, conditions: 'Users from the main user class, no training', verification: 'TEST' },
  { id: 'use-time', characteristic: 'INTERACTION_CAPABILITY', sub: 'Operability', title: 'Task time', scale: 'Median time for a trained user to complete the main task', meter: 'Timed usability session', unit: 'minutes', comparator: '<=', must: 3, plan: 2, conditions: 'Trained user, typical data', verification: 'TEST' },
  { id: 'use-a11y', characteristic: 'INTERACTION_CAPABILITY', sub: 'Inclusivity', title: 'Accessibility', scale: 'WCAG 2.2 AA violations reported by axe on the main pages', meter: 'axe-core automated scan in CI', unit: 'violations', comparator: '<=', must: 0, plan: 0, conditions: 'Light and dark theme, 1440 px and 390 px', verification: 'TEST' },
  { id: 'comp-browser', characteristic: 'COMPATIBILITY', sub: 'Co-existence', title: 'Supported browsers', scale: 'Share of the main journeys passing on the last two versions of Chrome, Firefox, Safari and Edge', meter: 'Cross-browser end-to-end test run', unit: '%', comparator: '=', must: 100, plan: 100, conditions: 'Desktop and mobile layouts', verification: 'TEST' },
  { id: 'maint-coverage', characteristic: 'MAINTAINABILITY', sub: 'Testability', title: 'Unit test coverage', scale: 'Statement coverage of the business-logic packages', meter: 'Coverage report (JaCoCo / c8) in CI', unit: '%', comparator: '>=', must: 70, plan: 85, conditions: 'Every merge to main', verification: 'ANALYSIS' },
  { id: 'flex-install', characteristic: 'FLEXIBILITY', sub: 'Installability', title: 'Deployment time', scale: 'Time for a new team member to deploy the system on a clean server from the README', meter: 'Timed deployment drill', unit: 'minutes', comparator: '<=', must: 60, plan: 20, conditions: 'Ubuntu server with Docker installed', verification: 'DEMONSTRATION' },
  { id: 'safety-confirm', characteristic: 'SAFETY', sub: 'Fail safe', title: 'Destructive actions', scale: 'Share of irreversible actions (delete, submit payment) that ask for confirmation', meter: 'Inspection of every destructive action in the UI', unit: '%', comparator: '=', must: 100, plan: 100, conditions: 'All roles', verification: 'INSPECTION' },
];

export interface NfrSpecLite {
  characteristic: string; subCharacteristic: string | null; scale: string; meter: string; unit: string | null; comparator: string;
  mustValue: number | null; planValue: number | null; wishValue: number | null; conditions: string | null; verification: string;
}

const num = (v: number) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 1000) / 1000));
const COMP_WORD: Record<string, string> = { '<=': 'at most', '>=': 'at least', '=': 'exactly' };
export const nfrMeasured = (s: NfrSpecLite | null | undefined) => !!s && s.mustValue !== null && !!s.scale.trim() && !!s.meter.trim();

/** Câu NFR đọc được trong SRS: "<scale> shall be at most 2000 ms (target 1000 ms) under <conditions>. Verified by test: <meter>." */
export function nfrStatement(s: NfrSpecLite): string {
  const u = s.unit ? ` ${s.unit}` : '';
  const must = s.mustValue !== null ? `${COMP_WORD[s.comparator] ?? s.comparator} ${num(s.mustValue)}${u}` : '(no threshold yet)';
  const plan = s.planValue !== null && s.planValue !== s.mustValue ? ` (target ${num(s.planValue)}${u})` : '';
  const wish = s.wishValue !== null ? ` (wish ${num(s.wishValue)}${u})` : '';
  const cond = s.conditions?.trim() ? ` under ${s.conditions.trim().replace(/\.$/, '')}` : '';
  return `${s.scale.trim().replace(/\.$/, '')} shall be ${must}${plan}${wish}${cond}. Verified by ${(VERIFICATION_LABEL[s.verification as Verification] ?? s.verification).toLowerCase()}: ${s.meter.trim().replace(/\.$/, '')}.`;
}

/** Bảng Planguage (Tag · Scale · Meter · Must · Plan · Wish) — Wiegers ch.14. */
export function planguageRows(list: Array<{ key: string; title: string; spec: NfrSpecLite }>): string[][] {
  const v = (x: number | null, u: string | null) => (x === null ? '' : `${num(x)}${u ? ` ${u}` : ''}`);
  return list.map(({ key, title, spec }) => [
    `${key} ${title}`, `${ISO_LABEL[spec.characteristic as IsoCharacteristic] ?? spec.characteristic}${spec.subCharacteristic ? ` › ${spec.subCharacteristic}` : ''}`,
    spec.scale, spec.meter, `${spec.comparator} ${v(spec.mustValue, spec.unit)}`.trim(), v(spec.planValue, spec.unit), v(spec.wishValue, spec.unit),
    VERIFICATION_LABEL[spec.verification as Verification] ?? spec.verification,
  ]);
}

// ─── Checklist chất lượng yêu cầu ────────────────────────────────

export const QUALITY_CRITERIA = ['unambiguous', 'complete', 'consistent', 'verifiable', 'feasible', 'necessary', 'prioritized', 'traceable'] as const;
export type QualityCriterion = (typeof QUALITY_CRITERIA)[number];
/** Tiêu chí người tự chấm (máy không đo được) — vẫn có thể kèm phần tự động (consistent: trùng lặp). */
export const MANUAL_CRITERIA: readonly QualityCriterion[] = ['feasible', 'consistent', 'necessary'];

export interface QualityInput {
  title: string; text: string; reqType: string | null; priority: string | null; taskItems: number;
  nfr: NfrSpecLite | null; traced: boolean; hasSource: boolean; duplicates: string[];
  manual: Partial<Record<QualityCriterion, boolean | null>>;
}
export interface CriterionResult { key: QualityCriterion; status: 'pass' | 'fail' | 'unchecked'; auto: boolean; reasons: Array<{ code: string; params?: Record<string, string | number> }> }
export interface QualityResult { criteria: CriterionResult[]; passed: number; total: number; score: number; vague: Array<{ match: string; hint: string; replace: string | null }> }

/**
 * Chấm 8 tiêu chí. TỰ ĐỘNG: rõ ràng (từ mơ hồ), đầy đủ (mô tả + không chỗ trống + tiêu chí chấp nhận cho yêu cầu chức năng),
 * nhất quán (trùng gần với yêu cầu khác), kiểm chứng được (AC / NFR có ngưỡng), cần thiết (có nguồn/lý do), ưu tiên, truy vết.
 * Khả thi = người chấm. Người đánh dấu tay thắng phần tự động ở tiêu chí MANUAL_CRITERIA (false ⇒ trượt dù máy thấy ổn).
 */
export function qualityCheck(i: QualityInput): QualityResult {
  const full = `${i.title}\n${i.text}`;
  const hits = findVagueTerms(full).filter((h) => h.term.rule !== 'weak_modal' || h.term.term === 'should' || h.term.term === 'may');
  const vague = hits.map((h) => ({ match: h.match, hint: h.term.hint, replace: h.term.replace ?? null }));
  const placeholders = hits.filter((h) => h.term.rule === 'placeholder');
  const ac = acceptanceCriteria(i.text, i.taskItems);
  const isQuality = i.reqType === 'QUALITY';
  const res: CriterionResult[] = [];
  const add = (key: QualityCriterion, ok: boolean | null, reasons: CriterionResult['reasons'], auto = true) =>
    res.push({ key, status: ok === null ? 'unchecked' : ok ? 'pass' : 'fail', auto, reasons });
  const man = (k: QualityCriterion) => (i.manual[k] === undefined ? null : i.manual[k] ?? null);

  const unamb = hits.filter((h) => h.term.rule !== 'placeholder');
  add('unambiguous', !unamb.length, unamb.length ? [{ code: 'VAGUE', params: { words: [...new Set(unamb.map((h) => h.match))].slice(0, 6).join(', ') } }] : []);

  const completeReasons: CriterionResult['reasons'] = [];
  if (i.text.trim().length < 20) completeReasons.push({ code: 'NO_DESCRIPTION' });
  if (placeholders.length) completeReasons.push({ code: 'PLACEHOLDER', params: { words: [...new Set(placeholders.map((h) => h.match))].join(', ') } });
  if (!isQuality && (i.reqType === 'FUNCTIONAL' || i.reqType === 'USER' || !i.reqType) && !ac.has) completeReasons.push({ code: 'NO_AC' });
  add('complete', !completeReasons.length, completeReasons);

  const m = man('consistent');
  const consistentReasons: CriterionResult['reasons'] = i.duplicates.length ? [{ code: 'DUPLICATE', params: { list: i.duplicates.slice(0, 5).join(', ') } }] : [];
  if (m === false) consistentReasons.push({ code: 'MARKED_CONFLICT' });
  add('consistent', !consistentReasons.length, consistentReasons);

  const verReasons: CriterionResult['reasons'] = [];
  if (isQuality) {
    if (!nfrMeasured(i.nfr) && !isMeasurable(full)) verReasons.push({ code: 'NFR_NO_METRIC' });
  } else {
    if (!ac.has && !isMeasurable(full)) verReasons.push({ code: 'NO_AC' });
    if (mentionsQuality(full) && !isMeasurable(full)) verReasons.push({ code: 'QUALITY_WORD_NO_NUMBER' });
  }
  add('verifiable', !verReasons.length, verReasons);

  const f = man('feasible');
  add('feasible', f, f === false ? [{ code: 'MARKED_INFEASIBLE' }] : f === null ? [{ code: 'NEEDS_REVIEW' }] : [], false);

  const n = man('necessary');
  const necReasons: CriterionResult['reasons'] = [];
  if (!i.hasSource && n !== true) necReasons.push({ code: 'NO_SOURCE' });
  if (n === false) necReasons.push({ code: 'MARKED_UNNEEDED' });
  add('necessary', !necReasons.length, necReasons);

  add('prioritized', !!i.priority, i.priority ? [] : [{ code: 'NO_PRIORITY' }]);
  add('traceable', i.traced, i.traced ? [] : [{ code: 'NOT_TRACED' }]);

  const passed = res.filter((r) => r.status === 'pass').length;
  return { criteria: res, passed, total: res.length, score: Math.round((passed / res.length) * 100), vague };
}

export const aiFixOut = z.object({
  rewrite: z.string().min(3).max(4000),
  acceptanceCriteria: z.array(z.string().max(600)).max(10).optional().nullable(),
  metric: z.object({ scale: z.string().max(400), meter: z.string().max(400), unit: z.string().max(24).optional().nullable(), comparator: z.enum(COMPARATORS).optional().nullable(), must: z.number().optional().nullable(), plan: z.number().optional().nullable() }).optional().nullable(),
  notes: z.array(z.string().max(400)).max(8).optional().nullable(),
});
export type AiFix = z.infer<typeof aiFixOut>;

export function aiFixPrompt(input: { language: 'vi' | 'en'; key: string; title: string; text: string; reqType: string | null; failing: CriterionResult[]; vague: QualityResult['vague'] }): { system: string; user: string } {
  const lang = input.language === 'vi' ? 'Vietnamese' : 'English';
  return {
    system: [
      'You are a requirements quality reviewer (Wiegers & Beatty ch.11, ISO/IEC/IEEE 29148). Rewrite ONE requirement so that it passes the failing criteria.',
      '- Keep the stakeholder intent. Do not add features. Put concrete numbers only where the original implies a quality; mark them as "[confirm]" so a person checks them.',
      '- Functional: one "shall" statement + 2–5 acceptance criteria in Given/When/Then.',
      '- Quality attribute: a measurable metric (scale, meter, threshold with unit).',
      `- Write in ${lang}. Answer with ONE JSON object only: {"rewrite":"…","acceptanceCriteria":["Given … When … Then …"],"metric":{"scale":"…","meter":"…","unit":"ms","comparator":"<=","must":2000,"plan":1000},"notes":["…"]}`,
    ].join('\n'),
    user: [
      `${input.key} (${input.reqType ?? 'unclassified'}): ${input.title}`,
      input.text ? `Description:\n${input.text.slice(0, 4000)}` : 'Description: (empty)',
      `Failing: ${input.failing.map((c) => `${c.key} [${c.reasons.map((r) => r.code).join(', ')}]`).join('; ')}`,
      input.vague.length ? `Vague words: ${input.vague.map((v) => v.match).join(', ')}` : '',
    ].filter(Boolean).join('\n'),
  };
}

// ─── Nút TipTap ──────────────────────────────────────────────────

const t = (text: string): PmNode => ({ type: 'text', text });
const para = (text: string): PmNode => (text ? { type: 'paragraph', content: [t(text)] } : { type: 'paragraph' });
const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level }, content: [t(text)] });
const isGuide = (n: PmNode) => n.type === 'blockquote' && /^\s*(Guide|Purpose|Hướng dẫn|Mục đích)\s*:/i.test(plainText(n));
const MARK = /^\s*\[CT Work\]/;
/** Khối CT Work đặt (sơ đồ nhúng / đoạn có tiền tố "[CT Work]" / bảng ngay sau đoạn đó) — để điền lại không nhân đôi. */
const isOurs = (n: PmNode) => isPlaced(n) || (n.type === 'paragraph' && MARK.test(plainText(n)));

/** Thay phần CT Work đặt trong THÂN TRỰC TIẾP của một đề mục (trước đề mục con đầu), giữ chữ người viết. */
function placeInSection(doc: PmNode, match: RegExp, nodes: PmNode[], at: 'intro' | 'end' = 'intro'): boolean {
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, match);
  if (i < 0) return false;
  const end = sectionEnd(blocks, i);
  let bodyEnd = i + 1;
  while (bodyEnd < end && blocks[bodyEnd].type !== 'heading') bodyEnd++;
  // Bỏ các khối cũ của mình (+ bảng đứng ngay sau đoạn "[CT Work]").
  for (let k = bodyEnd - 1; k > i; k--) {
    if (isOurs(blocks[k])) {
      const drop = blocks[k].type === 'paragraph' && MARK.test(plainText(blocks[k])) && blocks[k + 1]?.type === 'table' && k + 1 < bodyEnd ? 2 : 1;
      blocks.splice(k, drop);
      bodyEnd -= drop;
    }
  }
  let pos = i + 1;
  if (at === 'end') pos = bodyEnd;
  else {
    while (pos < bodyEnd && isGuide(blocks[pos])) pos++;
    while (pos < bodyEnd && blocks[pos].type === 'paragraph') pos++;
  }
  blocks.splice(pos, 0, ...nodes);
  doc.content = blocks;
  return true;
}

// ─── Chèn vào SRS Wiegers ────────────────────────────────────────

export interface SrsDeepData {
  projectId: number;
  stakeholders: StakeholderLite[];
  models: Array<{ kind: string; subject: string; diagram: PlacedDiagram }>;
  events: EventRow[];
  nfr: Array<{ key: string; title: string; subtype: string | null; priority: string | null; spec: NfrSpecLite }>;
  mockups: Array<{ screen: string; title: string | null; kind: string; src: string | null; url: string | null; status: string; reviewer: string | null }>;
}

const MODEL_ORDER = ['CONTEXT', 'DFD1', 'FEATURE_TREE', 'STATE', 'ACTIVITY'];

/**
 * Bổ sung SRS Wiegers (biến đổi tại chỗ, chạy SAU applyWiegersFill của 4b):
 *   2.1 Product Perspective  ⇐ context diagram (đã duyệt)
 *   2.2 User Classes          ⇐ thêm bảng sổ stakeholder (vai, ảnh hưởng/quan tâm, champion, quyền quyết định)
 *   5.1 User Interfaces       ⇐ prototype đã xác nhận của từng màn (ảnh / link)
 *   6.x Quality Attributes    ⇐ NFR có số đo (câu Planguage đầy đủ) thay cho dòng chữ
 *   Appendix B Analysis Models ⇐ DFD mức 1, feature tree, state, activity + bảng event–response + bảng Planguage
 */
export function applySrsDeepFill(doc: PmNode, d: SrsDeepData): string[] {
  const filled: string[] = [];
  const ofKind = (k: string) => d.models.filter((m) => m.kind === k).map((m) => m.diagram);
  const ctx = ofKind('CONTEXT');
  if (ctx.length && placeInSection(doc, /^Product Perspective$/i, ctx.flatMap((x) => blocksFor(x, d.projectId)))) filled.push('context diagram');

  if (d.stakeholders.length) {
    // Lớp người dùng có trong sổ stakeholder mà bảng User Classes chưa có ⇒ thêm dòng (giữ dòng người đã gõ). Làm TRƯỚC khi
    // đặt bảng stakeholder để "bảng đầu tiên sau đề mục" vẫn là bảng User Classes của mẫu.
    const classes = [...new Set(d.stakeholders.map((s) => s.userClass?.trim()).filter((x): x is string => !!x))];
    if (classes.length) {
      replaceTableAfterHeading(doc, /^User Classes and Characteristics$/i, (old) => {
        if (!old) return null;
        const prev = (old.content ?? []).slice(1).map((r) => (r.content ?? []).map((c) => plainText(c).trim()));
        const have = new Set(prev.map((r) => (r[0] ?? '').toLowerCase()).filter(Boolean));
        const add = classes.filter((c) => !have.has(c.toLowerCase())).map((c) => [c, d.stakeholders.filter((s) => s.userClass?.trim() === c).map((s) => s.name).join(', ')]);
        if (!add.length) return null;
        return mergeByKey(old, ['User Class', 'Characteristics'], [...prev.filter((r) => r.some(Boolean)).map((r) => [r[0] ?? '', r[1] ?? '']), ...add]);
      });
    }
    const rows = [...d.stakeholders].sort((a, b) => a.number - b.number).map((s) => [
      shKey(s.number), shLabel(s), s.userClass ?? '', `${s.influence}/5 · ${s.interest}/5 — ${QUADRANT_LABEL[quadrantOf(s.influence, s.interest)]}`,
      [s.isChampion ? 'Product champion' : '', s.attitude ? ATTITUDE_LABEL[s.attitude as Attitude] ?? s.attitude : ''].filter(Boolean).join(', '), s.decisionRights ?? '',
    ]);
    if (placeInSection(doc, /^User Classes and Characteristics$/i, [para('[CT Work] Stakeholder register (influence × interest, champions, decision rights):'), buildTable(['ID', 'Stakeholder', 'User class', 'Influence · Interest', 'Attitude', 'Decision rights'], rows)], 'end')) filled.push('stakeholders');
  }

  const shown = d.mockups.filter((m) => m.status === 'APPROVED');
  if (shown.length) {
    const nodes: PmNode[] = [para(`[CT Work] Approved prototypes (${shown.length}) — each screen was confirmed before coding:`)];
    for (const m of shown) {
      nodes.push({ type: 'paragraph', content: [{ type: 'text', text: `${m.screen}${m.title ? ` — ${m.title}` : ''}`, marks: [{ type: 'bold' }] }, t(m.reviewer ? ` (approved by ${m.reviewer})` : '')] });
      if (m.kind === 'IMAGE' && m.src) nodes.push({ type: 'image', attrs: { src: m.src, alt: `ctw-mockup ${m.screen}`, title: m.screen } });
      else if (m.url) nodes.push({ type: 'paragraph', content: [{ type: 'text', text: m.url, marks: [{ type: 'link', attrs: { href: m.url } }] }] });
    }
    if (placeInSection(doc, /^User Interfaces$/i, nodes)) filled.push('prototypes');
  }

  if (d.nfr.length) {
    const QA: Array<[string, RegExp]> = [['USABILITY', /^Usability/i], ['PERFORMANCE', /^Performance/i], ['SECURITY', /^Security/i], ['SAFETY', /^Safety/i]];
    const row = (q: SrsDeepData['nfr'][number]) => [q.key, `${q.title} — ${nfrStatement(q.spec)}`, `${ISO_LABEL[q.spec.characteristic as IsoCharacteristic] ?? q.spec.characteristic}${q.spec.subCharacteristic ? ` › ${q.spec.subCharacteristic}` : ''}`, q.priority ? P3_LABEL[q.priority] ?? q.priority : ''];
    let n = 0;
    for (const [k, re] of QA) {
      const xs = d.nfr.filter((q) => q.subtype === k || (!q.subtype && WIEGERS_TO_ISO[k] === q.spec.characteristic && k !== 'SAFETY'));
      if (xs.length && replaceTableAfterHeading(doc, re, () => buildTable(['ID', 'Requirement (measurable)', 'ISO/IEC 25010', 'Priority'], xs.map(row)))) n++;
    }
    const others = d.nfr.filter((q) => !QA.some(([k]) => q.subtype === k || (!q.subtype && WIEGERS_TO_ISO[k] === q.spec.characteristic && k !== 'SAFETY')));
    if (others.length && replaceTableAfterHeading(doc, /^(\[Others as relevant\]|Other Quality Attributes)$/i, () => buildTable(['ID', 'Requirement (measurable)', 'ISO/IEC 25010', 'Priority'], others.map(row)))) n++;
    if (n) filled.push('measurable quality attributes');
  }

  const analysis: PmNode[] = [];
  for (const kind of MODEL_ORDER.filter((k) => k !== 'CONTEXT')) for (const dg of ofKind(kind)) analysis.push(...blocksFor(dg, d.projectId));
  if (d.events.length) {
    analysis.push(para(`[CT Work] Event-response table (${d.events.length} events, from the use cases):`));
    analysis.push(buildTable(['Event', 'Event type', 'System state', 'Response', 'Source'], d.events.map((e) => [e.event, EVENT_TYPE_LABEL[e.type], e.state, e.response, e.ref])));
  }
  if (d.nfr.length) {
    analysis.push(para('[CT Work] Quality attributes in Planguage (Scale = what is measured, Meter = how, Must = minimum acceptable, Plan = target, Wish = ideal):'));
    analysis.push(buildTable(['Tag', 'ISO/IEC 25010', 'Scale', 'Meter', 'Must', 'Plan', 'Wish', 'Verification'], planguageRows(d.nfr)));
  }
  if (analysis.length && placeInSection(doc, /^Appendix B: Analysis Models$/i, analysis)) filled.push('analysis models');
  return filled;
}

/** V&S §3.1 Stakeholder Profiles từ sổ stakeholder (thay danh sách actor của 4b khi sổ đã có người). */
export function stakeholderProfiles(list: StakeholderLite[]): Array<{ name: string; description: string | null; attitude: string; interests: string; constraints: string }> {
  return [...list].sort((a, b) => a.number - b.number).map((s) => ({
    name: shLabel(s),
    description: s.majorValue ?? s.notes ?? null,
    attitude: [s.isChampion ? 'Product champion' : '', s.attitude ? ATTITUDE_LABEL[s.attitude as Attitude] ?? s.attitude : ''].filter(Boolean).join('; '),
    interests: [s.interests ?? '', `${QUADRANT_LABEL[quadrantOf(s.influence, s.interest)]} (influence ${s.influence}/5, interest ${s.interest}/5)`].filter(Boolean).join(' — '),
    constraints: [s.constraints ?? '', s.decisionRights ? `Decides: ${s.decisionRights}` : ''].filter(Boolean).join('; '),
  }));
}

// ─── Báo cáo elicitation (.docx/.pdf) ────────────────────────────

export interface ReportSession {
  key: string; title: string; technique: string; status: string; when: string; duration: number | null; location: string | null;
  objective: string | null; plan: string | null; aiSimulated: boolean;
  participants: Array<{ key: string; name: string; role: string | null; rolePlayed: string | null }>;
  questions: SessionQuestion[]; notes: string | null; outcome: string | null; meeting: string | null; survey: string | null;
  requirements: Array<{ key: string; title: string; status: string; stakeholder: string | null }>;
  pending: number;
}
export interface ReportData {
  projectName: string; generatedAt: Date;
  stakeholders: StakeholderLite[];
  raci: { activities: string[]; rows: Array<{ name: string; roles: string[] }> };
  sessions: ReportSession[];
  surveys: Array<{ key: string; title: string; status: string; responses: number; summary: QuestionSummary[] }>;
  trace: Array<{ requirement: string; title: string; sessions: string; stakeholders: string }>;
}

const multiline = (text: string | null | undefined): PmNode[] => String(text ?? '').split(/\n+/).map((x) => x.trim()).filter(Boolean).map((x) => para(x));

export function elicitationReportDoc(d: ReportData): PmNode {
  const c: PmNode[] = [];
  c.push(heading(1, `Requirements Elicitation Report — ${d.projectName}`));
  c.push(para(`Generated by CT Work on ${ddmmyyyy(d.generatedAt)}. ${d.sessions.length} session(s), ${d.stakeholders.length} stakeholder(s), ${d.trace.length} requirement(s) traced to their source.`));
  c.push(heading(1, '1. Summary'));
  c.push(buildTable(['Session', 'Technique', 'Date', 'Status', 'Participants', 'Requirements'], d.sessions.map((s) => [
    `${s.key} ${s.title}`, `${TECHNIQUE_LABEL[s.technique as Technique] ?? s.technique}${s.aiSimulated ? ' (AI-simulated)' : ''}`, s.when, s.status.charAt(0) + s.status.slice(1).toLowerCase(),
    String(s.participants.length), `${s.requirements.length}${s.pending ? ` (+${s.pending} pending)` : ''}`,
  ])));
  c.push(heading(1, '2. Stakeholders'));
  if (d.stakeholders.length) {
    c.push(buildTable(['ID', 'Stakeholder', 'Organization', 'User class', 'Influence', 'Interest', 'Strategy', 'Attitude'], [...d.stakeholders].sort((a, b) => a.number - b.number).map((s) => [
      shKey(s.number), shLabel(s), s.organization ?? '', s.userClass ?? '', String(s.influence), String(s.interest), QUADRANT_LABEL[quadrantOf(s.influence, s.interest)],
      [s.isChampion ? 'Champion' : '', s.attitude ? ATTITUDE_LABEL[s.attitude as Attitude] ?? s.attitude : ''].filter(Boolean).join(', '),
    ])));
    const grid = QUADRANTS.map((q) => [QUADRANT_LABEL[q], d.stakeholders.filter((s) => quadrantOf(s.influence, s.interest) === q).map((s) => s.name).join(', ') || '—']);
    c.push(heading(2, '2.1 Power × interest grid'));
    c.push(buildTable(['Strategy', 'Stakeholders'], grid));
  } else c.push(para('No stakeholders recorded yet.'));
  if (d.raci.activities.length && d.raci.rows.length) {
    c.push(heading(2, '2.2 RACI matrix'));
    c.push(buildTable(['Activity', ...d.raci.rows.map((r) => r.name)], d.raci.activities.map((a, i) => [a, ...d.raci.rows.map((r) => r.roles[i] ?? '')])));
  }
  c.push(heading(1, '3. Sessions'));
  d.sessions.forEach((s, i) => {
    c.push(heading(2, `3.${i + 1} ${s.key} ${s.title}`));
    c.push(buildTable(['Field', 'Value'], [
      ['Technique', `${TECHNIQUE_LABEL[s.technique as Technique] ?? s.technique}${s.aiSimulated ? ' (AI-simulated stakeholder — transcript kept as evidence)' : ''}`],
      ['Date', s.when || '—'], ['Duration', s.duration ? `${s.duration} minutes` : '—'], ['Location', s.location ?? '—'],
      ['Participants', s.participants.map((p) => `${p.key} ${p.name}${p.role ? ` (${p.role})` : ''}${p.rolePlayed ? ` — plays ${p.rolePlayed}` : ''}`).join('\n') || '—'],
      ['Objective', s.objective ?? '—'], ['Recording', s.meeting ?? '—'], ['Survey', s.survey ?? '—'],
    ]));
    if (s.plan) { c.push(heading(3, 'Plan')); c.push(...multiline(s.plan)); }
    if (s.questions.length) {
      c.push(heading(3, 'Questions and answers'));
      c.push(buildTable(['#', 'Question', 'Answer'], s.questions.map((q, k) => [String(k + 1), q.text, q.answer ?? ''])));
    }
    if (s.notes) { c.push(heading(3, 'Notes')); c.push(...multiline(s.notes)); }
    if (s.outcome) { c.push(heading(3, 'Outcome')); c.push(...multiline(s.outcome)); }
    c.push(heading(3, 'Requirements from this session'));
    if (s.requirements.length) c.push(buildTable(['Requirement', 'Title', 'Status', 'Raised by'], s.requirements.map((r) => [r.key, r.title, r.status, r.stakeholder ?? ''])));
    else c.push(para(s.pending ? `${s.pending} proposal(s) waiting for review.` : 'None yet.'));
  });
  if (d.surveys.length) {
    c.push(heading(1, '4. Surveys'));
    d.surveys.forEach((s, i) => {
      c.push(heading(2, `4.${i + 1} ${s.key} ${s.title} (${s.responses} response${s.responses === 1 ? '' : 's'})`));
      const rows: string[][] = [];
      for (const q of s.summary) {
        if (q.counts) rows.push([q.text, q.counts.map((x) => `${x.option}: ${x.n} (${x.pct}%)`).join('\n')]);
        else if (q.distribution) rows.push([q.text, `Average ${q.average ?? '—'} of ${q.distribution.length} (${q.answered} answers)`]);
        else if (q.yes !== undefined) rows.push([q.text, `Yes ${q.yes} · No ${q.no ?? 0}`]);
        else rows.push([q.text, (q.texts ?? []).slice(0, 5).join('\n') + ((q.texts?.length ?? 0) > 5 ? `\n… +${(q.texts?.length ?? 0) - 5} more` : '')]);
      }
      c.push(buildTable(['Question', 'Result'], rows));
    });
  }
  c.push(heading(1, `${d.surveys.length ? 5 : 4}. Requirement traceability to sources`));
  c.push(d.trace.length ? buildTable(['Requirement', 'Title', 'Elicitation session(s)', 'Stakeholder(s)'], d.trace.map((r) => [r.requirement, r.title, r.sessions, r.stakeholders])) : para('No requirement is linked to a session or stakeholder yet.'));
  return { type: 'doc', content: c };
}
