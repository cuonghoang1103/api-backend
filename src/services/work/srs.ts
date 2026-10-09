/**
 * CT Work — CTW đợt 4 (09/10/2026): phần THUẦN của SRS có cấu trúc (A6 + A7) — không DB, test ở ctw4.test.ts.
 *
 * Dữ liệu (actor, use case, business rule, màn hình, ma trận phân quyền màn, Non-UI) ⇒ nội dung TipTap đặt vào ĐÚNG
 * đề mục của mẫu FPT Report 3 (`content/quy-trinh/mau/fpt-report3-srs.md`, đối chiếu tệp gốc
 * `Report3_Software Requirement Specification.docx`):
 *
 *   1.3.1 Actors                 bảng  # · Actor · Description
 *   1.3.2 Use Cases (UC)         bảng  ID · Use Case · Feature · Use Case Description
 *   1.4.1 Screens Flow           khối Mermaid (vẽ được trên trang + bản xuất) + bảng Screen · Feature · Navigates to · Description
 *   1.4.2 Screen Authorization   bảng  Screen × Actor (dấu X)
 *   1.4.3 Non-UI Functions       bảng  Feature · System Function · Description
 *   2.   Use Case Specifications mỗi actor chính một mục "2.n <Actor> Features", mỗi UC một mục "2.n.m <tên>" + bảng 4 cột
 *                                đúng 7 hàng của mẫu (Primary Actors | … | Secondary Actors | …, Description, Preconditions,
 *                                Postconditions, Normal Sequence/Flow, Alternative Sequences/Flows, Exception Flows) rồi
 *                                3 hàng bổ sung có nhãn (Trigger, Priority, Business Rules) — 7 hàng đầu y hệt mẫu.
 *   5.1 Business Rules           bảng  ID · Rule Name · Rule Definition
 *
 * Đề mục so theo CHỮ (bỏ số thứ tự) như docFill.replaceTableAfterHeading — trang không theo mẫu thì không đụng gì.
 * UC trạng thái PROPOSED (AI/agent đề xuất, chưa ai duyệt) KHÔNG bao giờ vào tài liệu.
 */

import type { PmNode } from './docMarkdown.js';
import { plainText } from './docExport.js';
import { buildTable, replaceTableAfterHeading } from './docFill.js';

export const UC_STATUSES = ['PROPOSED', 'DRAFT', 'APPROVED'] as const;
export type UcStatus = (typeof UC_STATUSES)[number];
export const UC_PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'] as const;
export type UcPriority = (typeof UC_PRIORITIES)[number];
export const ACTOR_KINDS = ['PERSON', 'SYSTEM'] as const;
export const SEVERITIES = ['CRITICAL', 'MAJOR', 'MINOR', 'TRIVIAL'] as const;
export type Severity = (typeof SEVERITIES)[number];
export const SEVERITY_LABEL: Record<Severity, string> = { CRITICAL: 'Critical', MAJOR: 'Major', MINOR: 'Minor', TRIVIAL: 'Trivial' };

const pad = (n: number) => String(n).padStart(2, '0');
export const ucKey = (n: number) => `UC-${pad(n)}`;
export const brKey = (n: number) => `BR-${pad(n)}`;

/** "UC-03" / "uc3" / "3" / 3 ⇒ 3 (null nếu không phải). */
export function refNumber(ref: unknown, prefix: 'UC' | 'BR'): number | null {
  if (typeof ref === 'number') return Number.isInteger(ref) && ref > 0 ? ref : null;
  const m = new RegExp(`^\\s*(?:${prefix}\\s*-?\\s*)?0*(\\d{1,5})\\s*$`, 'i').exec(String(ref ?? ''));
  const n = m ? Number(m[1]) : NaN;
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Mọi mã UC-xx / BR-xx nhắc trong một đoạn chữ (để tự dò truy vết). */
export function refsIn(text: string, prefix: 'UC' | 'BR'): number[] {
  const re = new RegExp(`(?<![A-Za-z0-9])${prefix}-?(\\d{1,4})(?![0-9])`, 'gi');
  return [...new Set([...String(text ?? '').matchAll(re)].map((m) => Number(m[1])))];
}

// ─── Kiểu dữ liệu đầu vào (đã đọc từ DB) ─────────────────────────

export interface ActorLite { id: number; name: string; description: string | null; kind: string; position: number }
export interface UseCaseLite {
  id: number; number: number; name: string; feature: string | null; description: string | null; trigger: string | null;
  preconditions: string | null; postconditions: string | null; normalFlow: string | null; alternativeFlows: string | null;
  exceptionFlows: string | null; priority: string; status: string; primaryActorId: number | null; secondaryActorIds: number[];
  ruleNumbers: number[]; issueKey?: string | null;
}
export interface RuleLite { id: number; number: number; name: string; definition: string | null; category: string | null; status: string }
export interface ScreenLite { id: number; name: string; feature: string | null; description: string | null; position: number }
export interface ScreenLinkLite { fromId: number; toId: number; label: string | null }
export interface FunctionLite { id: number; feature: string | null; name: string; description: string | null; position: number }
export interface SrsData {
  actors: ActorLite[];
  useCases: UseCaseLite[];
  rules: RuleLite[];
  screens: ScreenLite[];
  links: ScreenLinkLite[];
  /** [screenId, actorId] có dấu X. */
  auth: Array<[number, number]>;
  functions: FunctionLite[];
}

/** UC/BR đi vào tài liệu: bỏ đề xuất chưa duyệt. */
export const inDocument = <T extends { status: string }>(xs: T[]) => xs.filter((x) => x.status !== 'PROPOSED');

// ─── Nút TipTap ──────────────────────────────────────────────────

const t = (text: string): PmNode => ({ type: 'text', text });
const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level }, content: [t(text)] });
/** Chữ nhiều dòng ⇒ nhiều đoạn trong MỘT ô (giữ "1. …" / "2A. …" mỗi dòng một đoạn như mẫu). */
function cellParas(text: string | null | undefined, bold = false): PmNode[] {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, '')).filter((l, i, a) => l || (i > 0 && a[i - 1]));
  if (!lines.length) return [{ type: 'paragraph' }];
  return lines.map((l) => (l ? { type: 'paragraph', content: [bold ? { type: 'text', text: l, marks: [{ type: 'bold' }] } : t(l)] } : { type: 'paragraph' }));
}
const cell = (type: 'tableHeader' | 'tableCell', content: PmNode[], colspan = 1): PmNode => ({ type, attrs: { colspan, rowspan: 1, colwidth: null }, content });

const PRIORITY_TEXT: Record<string, string> = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

/** Bảng đặc tả UC — 4 cột, 7 hàng đầu đúng mẫu Report 3 (hàng 2–7 gộp 3 ô phải), rồi Trigger / Priority / Business Rules. */
export function ucSpecTable(uc: UseCaseLite, actorName: (id: number | null) => string | null, rules: Map<number, RuleLite>): PmNode {
  const secondary = uc.secondaryActorIds.map((id) => actorName(id)).filter((x): x is string => !!x);
  const row = (label: string, value: string | null | undefined): PmNode => ({
    type: 'tableRow', content: [cell('tableHeader', cellParas(label, true)), cell('tableCell', cellParas(value), 3)],
  });
  const brs = uc.ruleNumbers.map((n) => rules.get(n)).filter((r): r is RuleLite => !!r).map((r) => `${brKey(r.number)}: ${r.name}`);
  return {
    type: 'table',
    content: [
      {
        type: 'tableRow',
        content: [
          cell('tableHeader', cellParas('Primary Actors', true)), cell('tableCell', cellParas(actorName(uc.primaryActorId) ?? '')),
          cell('tableHeader', cellParas('Secondary Actors', true)), cell('tableCell', cellParas(secondary.length ? secondary.join(', ') : 'None')),
        ],
      },
      row('Description', uc.description),
      row('Preconditions', uc.preconditions),
      row('Postconditions', uc.postconditions),
      row('Normal Sequence/Flow', uc.normalFlow),
      row('Alternative Sequences/Flows', uc.alternativeFlows || 'None'),
      row('Exception Flows', uc.exceptionFlows || 'None'),
      row('Trigger', uc.trigger),
      row('Priority', PRIORITY_TEXT[uc.priority] ?? uc.priority),
      row('Business Rules', brs.length ? brs.join('\n') : 'None'),
    ],
  };
}

export interface UcSection { useCaseId: number; number: string; actor: string }

/**
 * Mục "2. Use Case Specifications": nhóm theo actor chính (thứ tự actor), UC không có actor chính ⇒ nhóm "Common".
 * Trả nội dung (H3 + H4 + bảng) và số mục của từng UC ("2.1.3") — RTM dùng làm cột "SRS UC §".
 */
export function ucSpecSection(d: Pick<SrsData, 'actors' | 'useCases' | 'rules'>): { nodes: PmNode[]; sections: UcSection[] } {
  const actors = [...d.actors].sort((a, b) => a.position - b.position || a.id - b.id);
  const byId = new Map(actors.map((a) => [a.id, a]));
  const actorName = (id: number | null) => (id ? byId.get(id)?.name ?? null : null);
  const rules = new Map(d.rules.map((r) => [r.number, r]));
  const ucs = inDocument(d.useCases).sort((a, b) => a.number - b.number);
  const groups: Array<{ name: string; items: UseCaseLite[] }> = [];
  for (const a of actors) {
    const items = ucs.filter((u) => u.primaryActorId === a.id);
    if (items.length) groups.push({ name: a.name, items });
  }
  const orphan = ucs.filter((u) => !u.primaryActorId || !byId.has(u.primaryActorId));
  if (orphan.length) groups.push({ name: 'Common', items: orphan });
  const nodes: PmNode[] = [];
  const sections: UcSection[] = [];
  groups.forEach((g, gi) => {
    nodes.push(heading(3, `2.${gi + 1} ${g.name} Features`));
    g.items.forEach((u, ui) => {
      const num = `2.${gi + 1}.${ui + 1}`;
      nodes.push(heading(4, `${num} ${u.name} (${ucKey(u.number)})`));
      nodes.push(ucSpecTable(u, actorName, rules));
      sections.push({ useCaseId: u.id, number: num, actor: g.name });
    });
  });
  return { nodes, sections };
}

export function actorsTable(actors: ActorLite[]): PmNode {
  const rows = [...actors].sort((a, b) => a.position - b.position || a.id - b.id)
    .map((a, i) => [String(i + 1), a.name, a.description ?? '']);
  return buildTable(['#', 'Actor', 'Description'], rows);
}

export function useCasesTable(ucs: UseCaseLite[]): PmNode {
  const rows = inDocument(ucs).sort((a, b) => a.number - b.number).map((u) => [ucKey(u.number), u.name, u.feature ?? '', u.description ?? '']);
  return buildTable(['ID', 'Use Case', 'Feature', 'Use Case Description'], rows);
}

export function rulesTable(rules: RuleLite[]): PmNode {
  const rows = inDocument(rules).sort((a, b) => a.number - b.number).map((r) => [brKey(r.number), r.name, r.definition ?? '']);
  return buildTable(['ID', 'Rule Name', 'Rule Definition'], rows);
}

export function functionsTable(fns: FunctionLite[]): PmNode {
  const rows = [...fns].sort((a, b) => a.position - b.position || a.id - b.id).map((f) => [f.feature ?? '', f.name, f.description ?? '']);
  return buildTable(['Feature', 'System Function', 'Description'], rows);
}

const sortScreens = (s: ScreenLite[]) => [...s].sort((a, b) => a.position - b.position || a.id - b.id);
const sortActors = (s: ActorLite[]) => [...s].sort((a, b) => a.position - b.position || a.id - b.id);

/** Ma trận Screen Authorization: hàng = màn, cột = actor, "X" khi được phép — đúng bảng 1.4.2 của mẫu. */
export function authTable(screens: ScreenLite[], actors: ActorLite[], auth: Array<[number, number]>): PmNode {
  const set = new Set(auth.map(([s, a]) => `${s}:${a}`));
  const cols = sortActors(actors);
  return buildTable(['Screen', ...cols.map((a) => a.name)], sortScreens(screens).map((s) => [s.name, ...cols.map((a) => (set.has(`${s.id}:${a.id}`) ? 'X' : ''))]));
}

/** Nhãn an toàn cho Mermaid (bỏ ngoặc kép/xuống dòng). */
const mm = (s: string) => s.replace(/["\n\r[\]{}|<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60) || '…';

/** Screens Flow dạng Mermaid `flowchart LR` — mỗi màn một nút, mỗi liên kết một mũi tên có nhãn. */
export function screensFlowMermaid(screens: ScreenLite[], links: ScreenLinkLite[]): string {
  const list = sortScreens(screens);
  const id = new Map(list.map((s, i) => [s.id, `S${i + 1}`]));
  const lines = ['flowchart LR'];
  for (const s of list) lines.push(`  ${id.get(s.id)}["${mm(s.name)}"]`);
  for (const l of links) {
    const a = id.get(l.fromId);
    const b = id.get(l.toId);
    if (!a || !b) continue;
    lines.push(l.label ? `  ${a} -->|"${mm(l.label)}"| ${b}` : `  ${a} --> ${b}`);
  }
  return lines.join('\n');
}

export function screensTable(screens: ScreenLite[], links: ScreenLinkLite[]): PmNode {
  const name = new Map(screens.map((s) => [s.id, s.name]));
  return buildTable(['Screen', 'Feature', 'Navigates to', 'Description'], sortScreens(screens).map((s) => [
    s.name, s.feature ?? '',
    links.filter((l) => l.fromId === s.id && name.has(l.toId)).map((l) => `${name.get(l.toId)}${l.label ? ` (${l.label})` : ''}`).join(', '),
    s.description ?? '',
  ]));
}

// ─── Đặt vào trang Report 3 ──────────────────────────────────────

const stripNum = (s: string) => s.replace(/^(?:[IVX]+\.|\d+(?:\.\d+)*\.?)\s+/, '').trim();
const headingLevel = (n: PmNode) => Number(n.attrs?.level ?? 1);

/** Chỉ số đề mục đầu tiên khớp (chữ, bỏ số thứ tự) — -1 nếu không có. */
export function findHeading(blocks: PmNode[], match: RegExp, from = 0): number {
  for (let i = from; i < blocks.length; i++) if (blocks[i].type === 'heading' && match.test(stripNum(plainText(blocks[i])))) return i;
  return -1;
}

/** Vùng thân của đề mục i: từ i+1 tới trước đề mục kế có mức ≤ mức của nó. */
export function sectionEnd(blocks: PmNode[], i: number): number {
  const lv = headingLevel(blocks[i]);
  let j = i + 1;
  while (j < blocks.length && !(blocks[j].type === 'heading' && headingLevel(blocks[j]) <= lv)) j++;
  return j;
}

const isGuide = (n: PmNode) => n.type === 'blockquote' && /^\s*(Guide|Purpose|Hướng dẫn|Mục đích)\s*:/i.test(plainText(n));
const isMermaidBlock = (n: PmNode) => n.type === 'codeBlock' && String(n.attrs?.language ?? '').toLowerCase() === 'mermaid';

/** Screens Flow: thay khối Mermaid đầu tiên + bảng đầu tiên của mục (ảnh người dán giữ nguyên); chưa có thì chèn. */
function fillScreensFlow(doc: PmNode, screens: ScreenLite[], links: ScreenLinkLite[]): boolean {
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, /^Screens? Flow$/i);
  if (i < 0) return false;
  const end = sectionEnd(blocks, i);
  // Chỉ thân TRỰC TIẾP của mục (trước đề mục con đầu tiên).
  let bodyEnd = i + 1;
  while (bodyEnd < end && blocks[bodyEnd].type !== 'heading') bodyEnd++;
  const code: PmNode = { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [t(screensFlowMermaid(screens, links))] };
  const table = screensTable(screens, links);
  const mi = blocks.slice(i + 1, bodyEnd).findIndex(isMermaidBlock);
  const ti = blocks.slice(i + 1, bodyEnd).findIndex((b) => b.type === 'table');
  if (mi >= 0) blocks[i + 1 + mi] = code;
  if (ti >= 0) blocks[i + 1 + ti] = table;
  // Thiếu thì chèn — thứ tự: sơ đồ rồi bảng; sau ghi chú hướng dẫn (nếu có).
  if (mi < 0 && ti < 0) {
    let at = i + 1;
    while (at < bodyEnd && isGuide(blocks[at])) at++;
    blocks.splice(at, 0, code, table);
  } else if (mi < 0) {
    blocks.splice(i + 1 + ti, 0, code);
  } else if (ti < 0) {
    blocks.splice(i + 1 + mi + 1, 0, table);
  }
  doc.content = blocks;
  return true;
}

/** "2. Use Case Specifications": thay TOÀN BỘ thân (giữ ghi chú hướng dẫn ở đầu) bằng mục sinh từ dữ liệu. */
function fillUcSpecs(doc: PmNode, nodes: PmNode[]): boolean {
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, /^Use Case Specifications?$/i);
  if (i < 0) return false;
  const end = sectionEnd(blocks, i);
  const guides = blocks.slice(i + 1, end).filter(isGuide);
  blocks.splice(i + 1, end - (i + 1), ...guides, ...nodes);
  doc.content = blocks;
  return true;
}

export const SRS_FILL_SECTIONS = ['actors', 'useCases', 'screensFlow', 'screenAuthorization', 'nonUi', 'ucSpecs', 'businessRules'] as const;
export type SrsFillSection = (typeof SRS_FILL_SECTIONS)[number];
export const SRS_SECTION_LABEL: Record<SrsFillSection, string> = {
  actors: 'Actors', useCases: 'Use Cases (UC)', screensFlow: 'Screens Flow', screenAuthorization: 'Screen Authorization',
  nonUi: 'Non-UI Functions', ucSpecs: 'Use Case Specifications', businessRules: 'Business Rules',
};

/**
 * Điền dữ liệu SRS vào một BẢN SAO nội dung trang (biến đổi tại chỗ `doc`). Phần nào chưa có dữ liệu thì để nguyên mẫu
 * (không xoá bảng người đã gõ tay bằng một bảng rỗng). Trả các phần đã điền.
 */
export function applySrsFill(doc: PmNode, d: SrsData, only?: SrsFillSection[]): SrsFillSection[] {
  const want = (s: SrsFillSection) => !only?.length || only.includes(s);
  const done: SrsFillSection[] = [];
  const ucs = inDocument(d.useCases);
  const rules = inDocument(d.rules);
  if (want('actors') && d.actors.length && replaceTableAfterHeading(doc, /^Actors$/i, () => actorsTable(d.actors))) done.push('actors');
  if (want('useCases') && ucs.length && replaceTableAfterHeading(doc, /^Use Cases\s*\(UC\)$/i, () => useCasesTable(ucs))) done.push('useCases');
  if (want('screensFlow') && d.screens.length && fillScreensFlow(doc, d.screens, d.links)) done.push('screensFlow');
  if (want('screenAuthorization') && d.screens.length && d.actors.length && replaceTableAfterHeading(doc, /^Screen Authori[sz]ation$/i, () => authTable(d.screens, d.actors, d.auth))) done.push('screenAuthorization');
  if (want('nonUi') && d.functions.length && replaceTableAfterHeading(doc, /^Non-?UI Functions$/i, () => functionsTable(d.functions))) done.push('nonUi');
  if (want('ucSpecs') && ucs.length && fillUcSpecs(doc, ucSpecSection({ actors: d.actors, useCases: ucs, rules }).nodes)) done.push('ucSpecs');
  if (want('businessRules') && rules.length && replaceTableAfterHeading(doc, /^Business Rules$/i, () => rulesTable(rules))) done.push('businessRules');
  return done;
}

// ─── Kiểm UC (chỗ hở của đặc tả) ─────────────────────────────────

/** Ô bắt buộc của bảng đặc tả còn trống — RTM hiện "UC spec incomplete". */
export function ucMissing(u: Pick<UseCaseLite, 'primaryActorId' | 'description' | 'preconditions' | 'postconditions' | 'normalFlow'>): string[] {
  const out: string[] = [];
  if (!u.primaryActorId) out.push('primary actor');
  if (!u.description?.trim()) out.push('description');
  if (!u.preconditions?.trim()) out.push('preconditions');
  if (!u.postconditions?.trim()) out.push('postconditions');
  if (!u.normalFlow?.trim()) out.push('normal flow');
  return out;
}

/** Chữ thuần một ô bảng (đọc lại bảng đã xuất — test). */
export const nodeText = plainText;
