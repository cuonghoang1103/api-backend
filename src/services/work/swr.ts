/**
 * CT Work — CTW đợt 4b (10/10/2026): SWR302 "HỒ SƠ WIEGERS" + "DỮ LIỆU & SÁU LIÊN KẾT" — phần THUẦN (không DB), test ở
 * swr.test.ts. Phần có DB ở swr.service.ts.
 *
 *   R5  Feature FE-n · nối FE ↔ UC (liên kết tay + UC.feature ghi "FE-3" hoặc đúng tên feature)
 *   R6  Phân loại yêu cầu (Business/User/Functional/Quality/Constraint/External interface/Data) + vòng đời
 *       Proposed → Approved → Implemented → Verified, Deleted/Rejected (Wiegers ch.27, Figure 27-2)
 *   R12 Bảng ưu tiên Wiegers: value = benefit·wB + penalty·wP; priority = value% / (cost%·wC + risk%·wR) — đúng công thức
 *       sheet "Template" của `Requirements Prioritization Spreadsheet.xlsx`; xuất xlsx giữ công thức
 *   R16 Data Dictionary (ký hiệu Wiegers ch.13: "A + B", "(tuỳ chọn)", "1:10{lặp}", "\"literal\"") ⇒ mô hình dữ liệu cho ERD
 *   R23 Sáu liên kết người chấm dò (`content/academy/swr302/assignment.mjs` — "The six traceability links a grader checks")
 *   R4  Vision & Scope điền từ dữ liệu; R25 điền các mẫu Wiegers (Use Cases, Business Rules, SRS, Data Dictionary)
 */

import type { PmNode } from './docMarkdown.js';
import { plainText } from './docExport.js';
import { buildTable, replaceTableAfterHeading, tableRowsText } from './docFill.js';
import type { DataModel } from './diagramGen.js';
import {
  brKey, findHeading, inDocument, refsIn, sectionEnd, ucKey,
  type ActorLite, type RuleLite, type UseCaseLite,
} from './srs.js';
import { XSheet, type XStyle } from './xlsxStyled.js';

// ─── Hằng số ─────────────────────────────────────────────────────

export const REQ_TYPES = ['BUSINESS', 'USER', 'FUNCTIONAL', 'QUALITY', 'CONSTRAINT', 'EXTERNAL_INTERFACE', 'DATA'] as const;
export type ReqType = (typeof REQ_TYPES)[number];
export const REQ_TYPE_LABEL: Record<ReqType, string> = {
  BUSINESS: 'Business requirement', USER: 'User requirement', FUNCTIONAL: 'Functional requirement', QUALITY: 'Quality attribute',
  CONSTRAINT: 'Constraint', EXTERNAL_INTERFACE: 'External interface', DATA: 'Data requirement',
};
/** Thuộc tính chất lượng Wiegers ch.14 (Table 14-1: bên ngoài + bên trong). */
export const QUALITY_ATTRS = [
  'AVAILABILITY', 'INSTALLABILITY', 'INTEGRITY', 'INTEROPERABILITY', 'PERFORMANCE', 'RELIABILITY', 'ROBUSTNESS', 'SAFETY', 'SECURITY', 'USABILITY',
  'EFFICIENCY', 'MODIFIABILITY', 'PORTABILITY', 'REUSABILITY', 'SCALABILITY', 'VERIFIABILITY',
] as const;
export const INTERFACE_KINDS = ['USER', 'SOFTWARE', 'HARDWARE', 'COMMUNICATIONS'] as const;
/** Yêu cầu dữ liệu (SRS §4): REPORT = đặc tả một báo cáo (đếm vào liên kết #6), còn lại theo §4.4. */
export const DATA_KINDS = ['REPORT', 'ACQUISITION', 'INTEGRITY', 'RETENTION', 'DISPOSAL'] as const;
export const LIFECYCLE = ['PROPOSED', 'APPROVED', 'IMPLEMENTED', 'VERIFIED', 'DELETED', 'REJECTED'] as const;
export type Lifecycle = (typeof LIFECYCLE)[number];
export const LIFECYCLE_LABEL: Record<Lifecycle, string> = {
  PROPOSED: 'Proposed', APPROVED: 'Approved', IMPLEMENTED: 'Implemented', VERIFIED: 'Verified', DELETED: 'Deleted', REJECTED: 'Rejected',
};
/**
 * Luồng chuyển hợp lệ (Wiegers Figure 27-2). Thêm hai đường quay lui có thật: thực thi bị trả lại (IMPLEMENTED ⇒ APPROVED),
 * kiểm lại không đạt (VERIFIED ⇒ IMPLEMENTED), và mở lại một yêu cầu đã bỏ/bác (⇒ PROPOSED).
 */
export const LIFECYCLE_NEXT: Record<Lifecycle, readonly Lifecycle[]> = {
  PROPOSED: ['APPROVED', 'REJECTED', 'DELETED'],
  APPROVED: ['IMPLEMENTED', 'DELETED'],
  IMPLEMENTED: ['VERIFIED', 'APPROVED', 'DELETED'],
  VERIFIED: ['IMPLEMENTED', 'DELETED'],
  DELETED: ['PROPOSED'],
  REJECTED: ['PROPOSED'],
};
export const canMove = (from: string, to: string) => (LIFECYCLE_NEXT[from as Lifecycle] ?? []).includes(to as Lifecycle);
/** Yêu cầu còn "sống" (đi vào tài liệu và vào kiểm liên kết). */
export const isLive = (lifecycle: string) => lifecycle !== 'DELETED' && lifecycle !== 'REJECTED';

export const PRIORITY3 = ['HIGH', 'MEDIUM', 'LOW'] as const;
export const P3_LABEL: Record<string, string> = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };
export const RULE_TYPES = ['Fact', 'Constraint', 'Action enabler', 'Inference', 'Computation'] as const;

export const feKey = (n: number) => `FE-${n}`;

/** "FE-3" / "fe3" / "3" / 3 ⇒ 3. */
export function feNumber(ref: unknown): number | null {
  if (typeof ref === 'number') return Number.isInteger(ref) && ref > 0 ? ref : null;
  const m = /^\s*(?:FE\s*-?\s*)?0*(\d{1,5})\s*$/i.exec(String(ref ?? ''));
  return m ? Number(m[1]) : null;
}
export const feRefsIn = (text: string | null | undefined) =>
  [...new Set([...String(text ?? '').matchAll(/(?<![A-Za-z0-9])FE-?(\d{1,4})(?![0-9])/gi)].map((m) => Number(m[1])))];

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
/** Số ít đơn giản để so danh từ ("Requests" = "Request", "Addresses" = "Address"). */
export function singular(word: string): string {
  const w = norm(word);
  return w.split(' ').map((p, i, a) => (i < a.length - 1 ? p : p.replace(/(ss)$/, '$1').replace(/(?<=[^s])ies$/, 'y').replace(/(?<=(?:ch|sh|x|ss|z))es$/, '').replace(/(?<=[^s])s$/, ''))).join(' ');
}

// ─── Feature ↔ UC ────────────────────────────────────────────────

export interface FeatureLite { id: number; number: number; name: string; description: string | null; scope: string; priority: string | null; versionId: number | null; epicIssueId: number | null; position: number }
export interface FeatureLinkLite { featureId: number; kind: string; targetId: number }

/** FE ⇒ id các UC hiện thực nó: liên kết tay + UC.feature chứa "FE-n" hoặc đúng tên feature (không phân biệt hoa thường). */
export function featureUseCases(features: FeatureLite[], links: FeatureLinkLite[], ucs: Array<Pick<UseCaseLite, 'id' | 'feature'>>): Map<number, number[]> {
  const out = new Map<number, number[]>(features.map((f) => [f.id, []]));
  const add = (fid: number, uid: number) => { const a = out.get(fid); if (a && !a.includes(uid)) a.push(uid); };
  const ucIds = new Set(ucs.map((u) => u.id));
  for (const l of links) if (l.kind === 'UC' && ucIds.has(l.targetId)) add(l.featureId, l.targetId);
  const byNum = new Map(features.map((f) => [f.number, f.id]));
  const byName = new Map(features.map((f) => [norm(f.name), f.id]));
  for (const u of ucs) {
    if (!u.feature) continue;
    for (const n of feRefsIn(u.feature)) { const fid = byNum.get(n); if (fid) add(fid, u.id); }
    const fid = byName.get(norm(u.feature.replace(/(?<![A-Za-z0-9])FE-?\d+\s*[:\-–—]?\s*/i, '')));
    if (fid) add(fid, u.id);
  }
  return out;
}

// ─── R12 Bảng ưu tiên Wiegers ────────────────────────────────────

export interface Weights { benefit: number; penalty: number; cost: number; risk: number }
export const DEFAULT_WEIGHTS: Weights = { benefit: 1, penalty: 1, cost: 1, risk: 1 };
export interface PriorityIn { id: number; label: string; benefit: number; penalty: number; cost: number; risk: number }
export interface PriorityOut extends PriorityIn { totalValue: number; valuePct: number; costPct: number; riskPct: number; priority: number; rank: number }

const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Đúng công thức sheet Template: D=B·$B$1+C·$C$1, E=100·D/ΣD, G=100·F/ΣF, I=100·H/ΣH, J=E/(G·$F$1+I·$H$1). */
export function computePriorities(rows: PriorityIn[], w: Weights): PriorityOut[] {
  const tv = rows.map((r) => r.benefit * w.benefit + r.penalty * w.penalty);
  const sumV = tv.reduce((a, b) => a + b, 0);
  const sumC = rows.reduce((a, r) => a + r.cost, 0);
  const sumR = rows.reduce((a, r) => a + r.risk, 0);
  const out = rows.map((r, i) => {
    const valuePct = sumV ? (100 * tv[i]) / sumV : 0;
    const costPct = sumC ? (100 * r.cost) / sumC : 0;
    const riskPct = sumR ? (100 * r.risk) / sumR : 0;
    const den = costPct * w.cost + riskPct * w.risk;
    return { ...r, totalValue: r3(tv[i]), valuePct: r3(valuePct), costPct: r3(costPct), riskPct: r3(riskPct), priority: den ? r3(valuePct / den) : 0, rank: 0 };
  });
  [...out].sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label)).forEach((r, i) => { r.rank = i + 1; });
  return out;
}

export const scoreOk = (n: unknown) => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= 9;

// ─── R16 Data Dictionary ─────────────────────────────────────────

export interface DataElementLite { id: number; name: string; description: string | null; kind: string; composition: string | null; dataType: string | null; length: string | null; values: string | null; isKey: boolean; position: number }
export interface CompPart { name: string; optional: boolean; min: number; max: number | 'n'; repeating: boolean; literal: boolean }

/**
 * "Request ID + Requester + (Vendor) + 1:10{Requested Chemical} + \"-\"" ⇒ các thành phần. Ký hiệu Wiegers ch.13:
 * "+" nối, "( )" tuỳ chọn, "min:max{ }" nhóm lặp (max "n" = không giới hạn), chuỗi trong ngoặc kép = literal.
 */
export function parseComposition(text: string | null | undefined): CompPart[] {
  const out: CompPart[] = [];
  for (const raw of String(text ?? '').replace(/\r?\n/g, ' ').split('+')) {
    let s = raw.trim();
    if (!s) continue;
    if (/^["“”'].*["“”']$/.test(s)) { out.push({ name: s.replace(/^["“”']|["“”']$/g, ''), optional: false, min: 1, max: 1, repeating: false, literal: true }); continue; }
    let optional = false;
    let min = 1;
    let max: number | 'n' = 1;
    let repeating = false;
    const opt = /^\((.*)\)$/.exec(s);
    if (opt) { optional = true; min = 0; s = opt[1].trim(); }
    const rep = /^(\d+|n)?\s*:\s*(\d+|n)?\s*\{(.*)\}$/i.exec(s) ?? /^\{(.*)\}$/.exec(s);
    if (rep) {
      repeating = true;
      if (rep.length === 4) {
        min = rep[1] && rep[1].toLowerCase() !== 'n' ? Number(rep[1]) : (optional ? 0 : 1);
        max = rep[2] && rep[2].toLowerCase() !== 'n' ? Number(rep[2]) : 'n';
        s = rep[3].trim();
      } else { min = 0; max = 'n'; s = rep[1].trim(); }
      const inner = /^\((.*)\)$/.exec(s);
      if (inner) { optional = true; s = inner[1].trim(); }
    }
    if (s) out.push({ name: s, optional, min, max, repeating, literal: false });
  }
  return out;
}

/** "Composition or Data Type" của mẫu: cấu trúc ⇒ composition (mỗi thành phần một dòng "+ …"), nguyên thuỷ ⇒ kiểu. */
export function compositionText(e: Pick<DataElementLite, 'kind' | 'composition' | 'dataType'>): string {
  if (e.kind === 'STRUCTURE') {
    const parts = String(e.composition ?? '').split('+').map((x) => x.trim()).filter(Boolean);
    return parts.map((p, i) => (i ? `+ ${p}` : p)).join('\n');
  }
  return e.dataType ?? '';
}

const ddKey = (s: string) => singular(s);

/** Thành phần nhắc trong cấu trúc mà chưa có mục riêng ("Each data item that appears in a structure must itself be defined"). */
export function undefinedComponents(elements: DataElementLite[]): Array<{ structure: string; component: string }> {
  const names = new Set(elements.map((e) => ddKey(e.name)));
  const out: Array<{ structure: string; component: string }> = [];
  for (const e of elements) {
    if (e.kind !== 'STRUCTURE') continue;
    for (const p of parseComposition(e.composition)) if (!p.literal && !names.has(ddKey(p.name))) out.push({ structure: e.name, component: p.name });
  }
  return out;
}

const PRIM_TYPE = (t: string | null) => {
  const s = (t ?? '').toLowerCase();
  if (/int|number|numeric|decimal|float|money|currency|amount/.test(s)) return /int/.test(s) ? 'int' : 'decimal';
  if (/date|time|mm\/dd|dd\/mm|yyyy/.test(s)) return /time/.test(s) ? 'datetime' : 'date';
  if (/bool|yes\/no|true|flag/.test(s)) return 'boolean';
  return 'string';
};

/**
 * Data Dictionary ⇒ mô hình dữ liệu cho ERD (Diagram Studio nguồn "dictionary"): mỗi CẤU TRÚC một thực thể; thành phần
 * nguyên thuỷ ⇒ thuộc tính (PK nếu isKey); thành phần là cấu trúc ⇒ quan hệ — nhóm lặp "1:n{X}" ⇒ một–nhiều (X là phía
 * nhiều), cấu trúc đơn ⇒ thực thể này tham chiếu X (FK).
 */
export function ddToDataModel(elements: DataElementLite[]): DataModel {
  const byKey = new Map(elements.map((e) => [ddKey(e.name), e]));
  const structs = elements.filter((e) => e.kind === 'STRUCTURE').sort((a, b) => a.position - b.position || a.id - b.id);
  const tables: DataModel['tables'] = [];
  const relations: DataModel['relations'] = [];
  for (const s of structs) {
    const columns: DataModel['tables'][number]['columns'] = [];
    for (const p of parseComposition(s.composition)) {
      if (p.literal) continue;
      const el = byKey.get(ddKey(p.name));
      if (el?.kind === 'STRUCTURE') {
        if (p.repeating) relations.push({ from: el.name, to: s.name, fromMany: p.max === 'n' || p.max > 1, toMany: false, optional: p.min === 0, label: 'contains' });
        else {
          relations.push({ from: s.name, to: el.name, fromMany: true, toMany: false, optional: p.optional, label: 'has' });
          columns.push({ name: `${el.name} ID`, type: 'int', fk: true, nullable: p.optional });
        }
        continue;
      }
      columns.push({ name: p.name, type: PRIM_TYPE(el?.dataType ?? null), pk: !!el?.isKey, nullable: p.optional });
    }
    tables.push({ name: s.name, columns });
  }
  return { tables, relations, enums: [], source: 'Data Dictionary' };
}

// ─── R23 Danh từ trong luồng UC (liên kết #4) ────────────────────

const STOP = new Set([
  'the', 'a', 'an', 'if', 'when', 'then', 'else', 'and', 'or', 'system', 'user', 'step', 'steps', 'use', 'case', 'uc', 'br', 'fe', 'yes', 'no', 'ok',
  'none', 'end', 'go', 'return', 'returns', 'after', 'before', 'otherwise', 'for', 'each', 'all', 'this', 'that', 'it', 'in', 'on', 'at', 'to', 'of',
  'is', 'are', 'not', 'from', 'with', 'by', 'as', 'be', 'click', 'clicks', 'select', 'selects', 'enter', 'enters', 'submit', 'submits', 'open', 'opens',
  'display', 'displays', 'show', 'shows', 'save', 'saves', 'create', 'creates', 'update', 'updates', 'delete', 'deletes', 'view', 'views', 'search',
  'login', 'log', 'logout', 'page', 'screen', 'button', 'form', 'list', 'message', 'error', 'success', 'cancel', 'confirm', 'back', 'next', 'home',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december', 'pre', 'post', 'alternative', 'exception', 'normal', 'flow', 'precondition', 'postcondition',
]);

/**
 * Danh từ ỨNG VIÊN trong một đoạn luồng UC: cụm Viết Hoa giữa câu (1–4 từ), cụm Viết Hoa ≥ 2 từ ở đầu câu, và chữ trong
 * ngoặc kép. Đây là PHÉP DÒ (heuristic) — người dùng bỏ qua được từng danh từ (ignoredNouns).
 */
export function nounCandidates(text: string | null | undefined): string[] {
  const out = new Set<string>();
  const src = String(text ?? '');
  for (const m of src.matchAll(/["“]([^"”\n]{2,60})["”]/g)) out.add(m[1].trim());
  for (const line of src.split(/\n/)) {
    const body = line.replace(/^\s*(?:\d+(?:\.\d+)*(?:\.?[A-Z]\d*)?\.?|[A-Z]{2,4}-\d+:?|[-*•])\s*/, '');
    for (const sentence of body.split(/(?<=[.!?;:])\s+/)) {
      const words = sentence.split(/\s+/).filter(Boolean);
      let run: string[] = [];
      let startIdx = -1;
      const flush = (endIdx: number) => {
        if (run.length) {
          const atStart = startIdx === 0;
          const cleaned = run.map((w) => w.replace(/[^\p{L}\p{N}'’-]/gu, '')).filter(Boolean);
          const keep = cleaned.filter((w) => !STOP.has(w.toLowerCase()));
          if (keep.length && (!atStart || keep.length >= 2) && !(keep.length === 1 && keep[0].length < 3)) {
            // bỏ từ dừng ở hai đầu cụm
            let a = 0; let b = cleaned.length;
            while (a < b && STOP.has(cleaned[a].toLowerCase())) a++;
            while (b > a && STOP.has(cleaned[b - 1].toLowerCase())) b--;
            const phrase = cleaned.slice(a, b).join(' ');
            if (phrase && !/^[A-Z]{2,5}-?\d+$/i.test(phrase) && !/^\d/.test(phrase)) out.add(phrase);
          }
        }
        run = [];
        startIdx = -1;
        void endIdx;
      };
      words.forEach((w, i) => {
        const bare = w.replace(/^[("'“]+|[)"'”.,!?;:]+$/g, '');
        const cap = bare.length >= 2 && /^\p{Lu}[\p{L}\p{N}'’-]*$/u.test(bare);
        if (cap && !/^(UC|BR|FE)-?\d+$/i.test(bare)) {
          if (!run.length) startIdx = i;
          run.push(bare);
          if (/[.,!?;:)"”]$/.test(w)) flush(i);
        } else flush(i);
      });
      flush(words.length);
    }
  }
  return [...out].filter((x) => x.length <= 60);
}

export interface NounGap { noun: string; useCases: string[] }

/** Danh từ dùng trong luồng UC mà Data Dictionary chưa có (theo tên/glossary alias ⇒ tên chuẩn). */
export function nounsWithoutDd(input: {
  useCases: Array<Pick<UseCaseLite, 'number' | 'name' | 'normalFlow' | 'alternativeFlows' | 'exceptionFlows' | 'preconditions' | 'postconditions' | 'status'>>;
  dataElements: Array<{ name: string }>;
  glossary: Array<{ term: string; aliases: string[] }>;
  ignore: string[]; actors: string[]; screens: string[]; systemName: string;
}): NounGap[] {
  const dd = new Set(input.dataElements.map((e) => singular(e.name)));
  // Glossary nối cách gọi khác ⇒ thuật ngữ chuẩn: "FC" ⇒ "Fulfillment Center" (có trong DD thì coi như có).
  const alias = new Map<string, string>();
  for (const g of input.glossary) for (const a of g.aliases) alias.set(singular(a), singular(g.term));
  const skip = new Set([...input.ignore, ...input.actors, ...input.screens, input.systemName].filter(Boolean).map(singular));
  const hits = new Map<string, NounGap>();
  for (const u of inDocument(input.useCases)) {
    const text = [u.preconditions, u.normalFlow, u.alternativeFlows, u.exceptionFlows, u.postconditions].filter(Boolean).join('\n');
    for (const n of nounCandidates(text)) {
      const k = singular(n);
      if (!k || skip.has(k) || dd.has(k) || dd.has(alias.get(k) ?? '\0')) continue;
      // "Requester Name" có trong DD ⇒ "Requester" (phần đầu) cũng coi là đã định nghĩa nếu là cấu trúc cha — chỉ khớp đúng tên.
      const g = hits.get(k) ?? { noun: n, useCases: [] };
      if (!g.useCases.includes(ucKey(u.number))) g.useCases.push(ucKey(u.number));
      hits.set(k, g);
    }
  }
  return [...hits.values()].sort((a, b) => b.useCases.length - a.useCases.length || a.noun.localeCompare(b.noun));
}

// ─── R23 Sáu liên kết ────────────────────────────────────────────

export const SIX_LINKS = [
  { n: 1, key: 'FE_UC', title: 'Every feature FE-n in Vision & Scope §2.1 is realized by at least one UC-nn' },
  { n: 2, key: 'UC_BR', title: 'Every UC-nn names the BR-nn rules that constrain it, by ID only' },
  { n: 3, key: 'FR_TRACE', title: 'Every SRS functional requirement traces back to a UC-nn or an FE-n' },
  { n: 4, key: 'NOUN_DD', title: 'Every noun used in a use case flow has an entry in the data dictionary' },
  { n: 5, key: 'PRIORITY_REF', title: 'Every row of the prioritization worksheet is an existing FE-n or UC-nn' },
  { n: 6, key: 'COUNTS', title: 'The counts inside the estimation tool equal what deliverables 2, 4 and 6 actually contain' },
] as const;
export type SixKey = (typeof SIX_LINKS)[number]['key'];

/** code + params ⇒ giao diện dịch được (detail = câu tiếng Anh cho xlsx/MCP). */
export interface LinkGap { ref: string; detail: string; severity: 'error' | 'warning'; code?: string; params?: Record<string, string | number> }
export interface LinkResult { n: number; key: SixKey; title: string; checked: number; ok: boolean; gaps: LinkGap[]; note?: string }

export interface RequirementLite {
  issueId: number; key: string; number: number; title: string; text: string; reqType: string; lifecycle: string; parentId: number | null;
}
export interface PriorityRowLite { id: number; targetKind: string; targetId: number }
export const COUNT_KEYS = ['useCases', 'screens', 'reports', 'interfacingSystems'] as const;
export type CountKey = (typeof COUNT_KEYS)[number];
export const COUNT_LABEL: Record<CountKey, string> = {
  useCases: 'Process Flows and/or Use Cases', screens: 'Screens/User interfaces', reports: 'Reports', interfacingSystems: 'Interfacing Systems',
};

export interface SixLinksInput {
  features: FeatureLite[];
  featureLinks: FeatureLinkLite[];
  useCases: Array<UseCaseLite & { issueId?: number | null }>;
  rules: RuleLite[];
  requirements: RequirementLite[];
  dataElements: Array<{ name: string }>;
  glossary: Array<{ term: string; aliases: string[] }>;
  priorityRows: PriorityRowLite[];
  declared: Partial<Record<CountKey, number | null>> | null;
  actual: Partial<Record<CountKey, number>>;
  actors: ActorLite[];
  screens: Array<{ name: string }>;
  systemName: string;
  ignoredNouns: string[];
  /** Thẻ (id) ⇒ cha (id) để FR dưới một epic đã gắn FE coi như truy được. */
  issueParent?: Map<number, number | null>;
}

export function sixLinks(d: SixLinksInput): { links: LinkResult[]; passed: number; ok: boolean } {
  const ucs = inDocument(d.useCases);
  const inScope = d.features.filter((f) => f.scope !== 'OUT');
  const feUc = featureUseCases(d.features, d.featureLinks, ucs);
  const res = (k: SixKey, checked: number, gaps: LinkGap[], note?: string): LinkResult => {
    const def = SIX_LINKS.find((x) => x.key === k)!;
    return { n: def.n, key: k, title: def.title, checked, gaps, ok: !gaps.some((g) => g.severity === 'error'), ...(note ? { note } : {}) };
  };

  // 1. FE → UC
  const l1: LinkGap[] = inScope.filter((f) => !(feUc.get(f.id) ?? []).length).map((f) => ({ ref: feKey(f.number), detail: `${f.name}: no use case realizes this feature`, severity: 'error' as const, code: 'FE_NO_UC', params: { name: f.name } }));
  const r1 = res('FE_UC', inScope.length, l1, inScope.length ? undefined : 'No features yet — add FE-n in the feature register (Vision & Scope §2.1).');
  if (!inScope.length) r1.ok = false;

  // 2. UC → BR (theo mã)
  const ruleNos = new Set(d.rules.map((r) => r.number));
  const l2: LinkGap[] = [];
  const used = new Set<number>();
  for (const u of ucs) {
    u.ruleNumbers.forEach((n) => used.add(n));
    const text = [u.preconditions, u.normalFlow, u.alternativeFlows, u.exceptionFlows, u.postconditions, u.trigger, u.description].filter(Boolean).join('\n');
    const mentioned = refsIn(text, 'BR');
    const unknown = mentioned.filter((n) => !ruleNos.has(n));
    const unlinked = mentioned.filter((n) => ruleNos.has(n) && !u.ruleNumbers.includes(n));
    unlinked.forEach((n) => used.add(n));
    if (unknown.length) l2.push({ ref: ucKey(u.number), detail: `mentions ${unknown.map(brKey).join(', ')} — no such rule`, severity: 'error', code: 'BR_UNKNOWN', params: { list: unknown.map(brKey).join(', ') } });
    if (unlinked.length) l2.push({ ref: ucKey(u.number), detail: `flow mentions ${unlinked.map(brKey).join(', ')} but the Business Rules field does not list it`, severity: 'error', code: 'BR_UNLISTED', params: { list: unlinked.map(brKey).join(', ') } });
    if (!u.ruleNumbers.length && !mentioned.length) l2.push({ ref: ucKey(u.number), detail: 'names no business rule', severity: 'warning', code: 'UC_NO_BR' });
  }
  for (const r of inDocument(d.rules)) if (!used.has(r.number)) l2.push({ ref: brKey(r.number), detail: `${r.name}: no use case references this rule`, severity: 'warning', code: 'BR_UNUSED', params: { name: r.name } });
  const r2 = res('UC_BR', ucs.length, l2);

  // 3. FR → UC | FE
  const frs = d.requirements.filter((q) => q.reqType === 'FUNCTIONAL' && isLive(q.lifecycle));
  const ucByIssue = new Set(ucs.map((u) => u.issueId).filter((x): x is number => !!x));
  const issueOfFeature = new Set(d.featureLinks.filter((l) => l.kind === 'ISSUE').map((l) => l.targetId));
  for (const f of d.features) if (f.epicIssueId) issueOfFeature.add(f.epicIssueId);
  const ucNos = new Set(ucs.map((u) => u.number));
  const feNos = new Set(d.features.map((f) => f.number));
  const l3: LinkGap[] = [];
  for (const q of frs) {
    let ok = ucByIssue.has(q.issueId) || issueOfFeature.has(q.issueId);
    let p = q.parentId;
    for (let hop = 0; !ok && p && hop < 4; hop++) { ok = issueOfFeature.has(p) || ucByIssue.has(p); p = d.issueParent?.get(p) ?? null; }
    if (!ok) ok = refsIn(`${q.title}\n${q.text}`, 'UC').some((n) => ucNos.has(n)) || feRefsIn(`${q.title}\n${q.text}`).some((n) => feNos.has(n));
    if (!ok) l3.push({ ref: q.key, detail: `${q.title}: not linked to any UC-nn or FE-n`, severity: 'error', code: 'FR_UNTRACED', params: { title: q.title } });
  }
  const r3x = res('FR_TRACE', frs.length, l3, frs.length ? undefined : 'No functional requirements classified yet — set the type of REQUIREMENT issues to Functional.');

  // 4. danh từ → DD
  const gaps4 = nounsWithoutDd({
    useCases: ucs, dataElements: d.dataElements, glossary: d.glossary, ignore: d.ignoredNouns,
    actors: d.actors.map((a) => a.name), screens: d.screens.map((s) => s.name), systemName: d.systemName,
  });
  const l4: LinkGap[] = gaps4.map((g) => ({ ref: g.noun, detail: `used in ${g.useCases.join(', ')} — not in the data dictionary`, severity: 'error', code: 'NOUN_MISSING', params: { ucs: g.useCases.join(', ') } }));
  const r4 = res('NOUN_DD', ucs.length, l4, 'Nouns are detected from Capitalized phrases and "quoted" terms in the flows. Ignore a noun that is not data.');

  // 5. dòng ưu tiên → FE | UC đang có
  const feIds = new Set(d.features.map((f) => f.id));
  const ucIds = new Set(ucs.map((u) => u.id));
  const l5: LinkGap[] = [];
  for (const r of d.priorityRows) {
    const exists = r.targetKind === 'FE' ? feIds.has(r.targetId) : r.targetKind === 'UC' ? ucIds.has(r.targetId) : false;
    if (!exists) l5.push({ ref: `row ${r.id}`, detail: r.targetKind === 'FE' || r.targetKind === 'UC' ? `${r.targetKind} no longer exists (deleted or not approved)` : 'not an FE-n or UC-nn', severity: 'error', code: r.targetKind === 'FE' || r.targetKind === 'UC' ? 'ROW_GONE' : 'ROW_BAD', params: { kind: r.targetKind } });
  }
  const r5 = res('PRIORITY_REF', d.priorityRows.length, l5, d.priorityRows.length ? undefined : 'The prioritization worksheet is empty.');
  if (!d.priorityRows.length) r5.ok = false;

  // 6. số đếm ước lượng = thực tế
  const l6: LinkGap[] = [];
  let checked6 = 0;
  for (const k of COUNT_KEYS) {
    const want = d.declared?.[k];
    const have = d.actual[k];
    if (want === null || want === undefined || have === undefined) continue;
    checked6++;
    if (want !== have) l6.push({ ref: COUNT_LABEL[k], detail: `estimation tool says ${want}, the documents contain ${have}`, severity: 'error', code: 'COUNT_MISMATCH', params: { want, have, key: k } });
  }
  const r6 = res('COUNTS', checked6, l6, checked6 ? undefined : 'Enter the counts you typed into the Requirements Estimation Tool to compare them.');
  if (!checked6) r6.ok = false;

  const links = [r1, r2, r3x, r4, r5, r6];
  const passed = links.filter((l) => l.ok).length;
  return { links, passed, ok: passed === links.length };
}

// ─── Nút TipTap ──────────────────────────────────────────────────

const t = (text: string): PmNode => ({ type: 'text', text });
const para = (text: string): PmNode => (text ? { type: 'paragraph', content: [t(text)] } : { type: 'paragraph' });
const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level }, content: [t(text)] });
const isGuide = (n: PmNode) => n.type === 'blockquote' && /^\s*(Guide|Purpose|Hướng dẫn|Mục đích)\s*:/i.test(plainText(n));

/** Gộp bảng mới vào bảng cũ theo cột khoá: ô mới rỗng ⇒ giữ ô người đã gõ (không xoá công sức bằng một ô trống). */
export function mergeByKey(old: PmNode | null, header: string[], rows: string[][], keyCol = 0): PmNode {
  const prev = old ? tableRowsText(old) : [];
  const oldHead = prev[0] ?? [];
  const byKey = new Map(prev.slice(1).map((r) => [norm(r[keyCol] ?? ''), r]));
  return buildTable(header, rows.map((r) => {
    const o = byKey.get(norm(r[keyCol] ?? ''));
    if (!o) return r;
    return r.map((v, ci) => {
      if (v) return v;
      const oi = oldHead.indexOf(header[ci]);
      return oi >= 0 ? o[oi] ?? '' : '';
    });
  }));
}

/** Đổi "<Project>" trong tiêu đề/đề mục mẫu thành tên dự án. */
export function nameProject(doc: PmNode, projectName: string): number {
  let n = 0;
  const walk = (x: PmNode) => {
    if (typeof x.text === 'string' && x.text.includes('<Project>')) { x.text = x.text.replace(/<Project>/g, projectName); n++; }
    for (const c of x.content ?? []) walk(c);
  };
  for (const b of doc.content ?? []) if (b.type === 'heading' || b.type === 'paragraph') walk(b);
  return n;
}

export interface RevisionRow { name: string; date: string; reason: string; version: string }
export const revisionTable = (rows: RevisionRow[]) => buildTable(['Name', 'Date', 'Reason For Changes', 'Version'], rows.map((r) => [r.name, r.date, r.reason, r.version]));

/** Thay TOÀN BỘ thân của một đề mục (giữ ghi chú hướng dẫn ở đầu). */
export function replaceSectionBody(doc: PmNode, match: RegExp, nodes: PmNode[]): boolean {
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, match);
  if (i < 0) return false;
  const end = sectionEnd(blocks, i);
  const guides = blocks.slice(i + 1, end).filter(isGuide);
  blocks.splice(i + 1, end - (i + 1), ...guides, ...nodes);
  doc.content = blocks;
  return true;
}

/** Bỏ hẳn một mục (đề mục + thân) — dùng cho phần "Use Case Field Guidance" khi xuất bản đã có dữ liệu. */
export function dropSection(doc: PmNode, match: RegExp): boolean {
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, match);
  if (i < 0) return false;
  blocks.splice(i, sectionEnd(blocks, i) - i);
  doc.content = blocks;
  return true;
}

// ─── R4 Vision & Scope ───────────────────────────────────────────

export interface ReleaseLite { id: number; name: string; releaseDate: Date | null; status: string; position: number }
export interface RaidLite { number: number; type: string; title: string; description: string | null; probability: number | null; impact: number | null; mitigation: string | null }
export interface VisionScopeData {
  features: FeatureLite[];
  releases: ReleaseLite[];
  risks: RaidLite[];
  assumptions: RaidLite[];
  objectives: Array<{ key: string; title: string; source: string | null; rationale: string | null }>;
  stakeholders: Array<{ name: string; description: string | null }>;
  useCaseCount: Map<number, number>;
}

export const VS_SECTIONS = ['objectives', 'risks', 'assumptions', 'features', 'initialRelease', 'laterReleases', 'limitations', 'stakeholders'] as const;
export type VsSection = (typeof VS_SECTIONS)[number];
export const VS_SECTION_LABEL: Record<VsSection, string> = {
  objectives: '1.3 Business Objectives', risks: '1.6 Business Risks', assumptions: '1.7 Business Assumptions and Dependencies', features: '2.1 Major Features',
  initialRelease: '2.2 Scope of Initial Release', laterReleases: '2.3 Scope of Subsequent Releases', limitations: '2.4 Limitations and Exclusions',
  stakeholders: '3.1 Stakeholder Profiles',
};

const ddmmyyyy = (d: Date | null) => (d ? `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}` : '');
const level5 = (v: number | null) => (v === null ? '' : v >= 4 ? 'High' : v >= 3 ? 'Medium' : 'Low');

/** Thứ tự bản phát hành: có ngày trước (sớm ⇒ muộn), rồi theo vị trí. */
export const sortReleases = (rs: ReleaseLite[]) => [...rs].sort((a, b) => (a.releaseDate && b.releaseDate ? a.releaseDate.getTime() - b.releaseDate.getTime() : a.releaseDate ? -1 : b.releaseDate ? 1 : 0) || a.position - b.position || a.id - b.id);

export function applyVisionScopeFill(doc: PmNode, d: VisionScopeData, only?: VsSection[]): VsSection[] {
  const want = (s: VsSection) => !only?.length || only.includes(s);
  const done: VsSection[] = [];
  const feats = [...d.features].sort((a, b) => a.number - b.number);
  const inScope = feats.filter((f) => f.scope !== 'OUT');
  const rel = sortReleases(d.releases);
  const relName = new Map(rel.map((r) => [r.id, r]));
  const releaseOf = (f: FeatureLite) => (f.versionId ? relName.get(f.versionId) ?? null : null);
  const used = rel.filter((r) => inScope.some((f) => f.versionId === r.id));
  const first = used[0] ?? null;

  if (want('objectives') && d.objectives.length) {
    const rows = d.objectives.map((o, i) => [`BO-${i + 1}`, o.title, o.rationale ?? '', `${o.key}${o.source ? ` · ${o.source}` : ''}`]);
    if (replaceTableAfterHeading(doc, /^Business Objectives$/i, (old) => mergeByKey(old, ['ID', 'Business Objective', 'Measure / Target', 'Source'], rows))) done.push('objectives');
  }
  if (want('risks') && d.risks.length) {
    const rows = d.risks.map((r) => [`RI-${r.number}`, r.description ? `${r.title} — ${r.description}`.slice(0, 600) : r.title, level5(r.probability), level5(r.impact), r.mitigation ?? '']);
    if (replaceTableAfterHeading(doc, /^Business Risks$/i, (old) => mergeByKey(old, ['ID', 'Risk', 'Probability', 'Impact', 'Mitigation'], rows))) done.push('risks');
  }
  if (want('assumptions') && d.assumptions.length) {
    const rows = d.assumptions.map((a) => [`${a.type === 'DEPENDENCY' ? 'DE' : 'AS'}-${a.number}`, a.type === 'DEPENDENCY' ? 'Dependency' : 'Assumption', a.description ? `${a.title} — ${a.description}`.slice(0, 600) : a.title]);
    if (replaceTableAfterHeading(doc, /^Business Assumptions and Dependencies$/i, (old) => mergeByKey(old, ['ID', 'Type', 'Assumption / Dependency'], rows))) done.push('assumptions');
  }
  if (want('features') && feats.length) {
    const rows = inScope.map((f) => [feKey(f.number), f.name, f.description ?? '', releaseOf(f)?.name ?? 'Not scheduled', f.priority ? P3_LABEL[f.priority] ?? f.priority : '']);
    if (replaceTableAfterHeading(doc, /^Major Features$/i, (old) => mergeByKey(old, ['ID', 'Feature', 'Description', 'Release', 'Priority'], rows))) done.push('features');
  }
  if (want('initialRelease') && first) {
    const rows = inScope.filter((f) => f.versionId === first.id).map((f) => [feKey(f.number), f.name, `${first.name}${first.releaseDate ? ` (${ddmmyyyy(first.releaseDate)})` : ''}`, f.description ?? '']);
    if (rows.length && replaceTableAfterHeading(doc, /^Scope of Initial Release$/i, (old) => mergeByKey(old, ['ID', 'Feature', 'Release', 'Scope in this release'], rows))) done.push('initialRelease');
  }
  if (want('laterReleases') && (used.length > 1 || inScope.some((f) => !releaseOf(f)))) {
    const rows = used.slice(1).map((r) => [r.name, ddmmyyyy(r.releaseDate), r.status === 'RELEASED' ? 'Released' : 'Planned', inScope.filter((f) => f.versionId === r.id).map((f) => `${feKey(f.number)} ${f.name}`).join('\n')]);
    const later = inScope.filter((f) => !releaseOf(f));
    if (later.length) rows.push(['Not scheduled', '', 'Deferred', later.map((f) => `${feKey(f.number)} ${f.name}`).join('\n')]);
    if (rows.length && replaceTableAfterHeading(doc, /^Scope of Subsequent Releases$/i, (old) => mergeByKey(old, ['Release', 'Planned date', 'Status', 'Features'], rows))) done.push('laterReleases');
  }
  if (want('limitations')) {
    const out = feats.filter((f) => f.scope === 'OUT');
    const rows = out.map((f, i) => [`LI-${i + 1}`, `${f.name} (${feKey(f.number)})`, f.description ?? '']);
    if (rows.length && replaceTableAfterHeading(doc, /^Limitations and Exclusions$/i, (old) => mergeByKey(old, ['ID', 'Limitation / Exclusion', 'Rationale'], rows))) done.push('limitations');
  }
  if (want('stakeholders') && d.stakeholders.length) {
    const rows = d.stakeholders.map((s) => [s.name, s.description ?? '', '', '', '']);
    if (replaceTableAfterHeading(doc, /^Stakeholder Profiles$/i, (old) => mergeByKey(old, ['Stakeholder', 'Major Value', 'Attitudes', 'Major Interests', 'Constraints'], rows))) done.push('stakeholders');
  }
  return done;
}

// ─── R25 Các mẫu Wiegers khác ────────────────────────────────────

const cellNodes = (text: string | null | undefined, bold = false): PmNode[] => {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.replace(/\s+$/, ''));
  const kept = lines.filter((l, i) => l || (i > 0 && lines[i - 1]));
  if (!kept.length || (kept.length === 1 && !kept[0])) return [{ type: 'paragraph' }];
  return kept.map((l) => (l ? { type: 'paragraph', content: [bold ? { type: 'text', text: l, marks: [{ type: 'bold' }] } : t(l)] } : { type: 'paragraph' }));
};
const tcell = (type: 'tableHeader' | 'tableCell', content: PmNode[], colspan = 1): PmNode => ({ type, attrs: { colspan, rowspan: 1, colwidth: null }, content });

export const WIEGERS_UC_ROWS = [
  'UC ID and Name:', 'Created By:', 'Primary Actor:', 'Trigger:', 'Description:', 'Preconditions:', 'Postconditions:', 'Normal Flow:',
  'Alternative Flows:', 'Exceptions:', 'Priority:', 'Frequency of Use:', 'Business Rules:', 'Other Information:', 'Assumptions:',
] as const;

export interface UcDocExtra { createdBy: string | null; createdAt: Date | null }

/** Bảng đặc tả UC đúng "Use Case Template" của Wiegers (Chapter 8): 15 hàng, 4 cột; BR chỉ ghi MÃ (không chép nội dung). */
export function wiegersUcTable(u: UseCaseLite, actorName: (id: number | null) => string | null, extra: UcDocExtra): PmNode {
  const secondary = u.secondaryActorIds.map((id) => actorName(id)).filter((x): x is string => !!x);
  const wide = (label: string, value: string | null | undefined): PmNode => ({ type: 'tableRow', content: [tcell('tableHeader', cellNodes(label, true)), tcell('tableCell', cellNodes(value), 3)] });
  const pair = (l1: string, v1: string, l2: string, v2: string): PmNode => ({
    type: 'tableRow', content: [tcell('tableHeader', cellNodes(l1, true)), tcell('tableCell', cellNodes(v1)), tcell('tableHeader', cellNodes(l2, true)), tcell('tableCell', cellNodes(v2))],
  });
  return {
    type: 'table',
    content: [
      wide('UC ID and Name:', `${ucKey(u.number)}: ${u.name}`),
      pair('Created By:', extra.createdBy ?? '', 'Date Created:', ddmmyyyy(extra.createdAt)),
      pair('Primary Actor:', actorName(u.primaryActorId) ?? '', 'Secondary Actors:', secondary.join(', ') || 'None'),
      wide('Trigger:', u.trigger),
      wide('Description:', u.description),
      wide('Preconditions:', u.preconditions),
      wide('Postconditions:', u.postconditions),
      wide('Normal Flow:', u.normalFlow),
      wide('Alternative Flows:', u.alternativeFlows || 'None'),
      wide('Exceptions:', u.exceptionFlows || 'None'),
      wide('Priority:', P3_LABEL[u.priority] ?? u.priority),
      wide('Frequency of Use:', ''),
      wide('Business Rules:', u.ruleNumbers.map(brKey).join(', ') || 'None'),
      wide('Other Information:', ''),
      wide('Assumptions:', ''),
    ],
  };
}

export interface WiegersData {
  projectName: string;
  actors: ActorLite[];
  useCases: UseCaseLite[];
  ucExtra: Map<number, UcDocExtra>;
  rules: RuleLite[];
  features: FeatureLite[];
  featureLinks: FeatureLinkLite[];
  requirements: Array<RequirementLite & { subtype: string | null; priority: string | null; source: string | null; rationale: string | null }>;
  dataElements: DataElementLite[];
  glossary: Array<{ term: string; definition: string; aliases: string[] }>;
  assumptions: RaidLite[];
  revisions: RevisionRow[];
  /** UC id ⇒ thẻ (id). */
  ucIssue: Map<number, number | null>;
}

export const WIEGERS_DOCS = ['swr-vision-scope', 'swr-use-cases', 'swr-business-rules', 'swr-srs', 'swr-data-dictionary'] as const;
export type WiegersDoc = (typeof WIEGERS_DOCS)[number];

const sortedUcs = (d: Pick<WiegersData, 'useCases'>) => inDocument(d.useCases).sort((a, b) => a.number - b.number);

function ruleType(category: string | null): string {
  const c = (category ?? '').toLowerCase();
  return RULE_TYPES.find((x) => c.includes(x.toLowerCase())) ?? (category ?? '');
}

/** Mã yêu cầu (FR/NFR) theo mẫu SRS: dùng mã thẻ (KEY-12) — chính là định danh duy nhất đi khắp RTM. */
function reqRows(list: WiegersData['requirements']) {
  return list.map((q) => [q.key, q.text ? `${q.title} — ${q.text}`.slice(0, 1200) : q.title, q.priority ? P3_LABEL[q.priority] ?? q.priority : '', q.source ?? '']);
}

export function ddTable(elements: DataElementLite[]): PmNode {
  const rows = [...elements].sort((a, b) => a.name.localeCompare(b.name)).map((e) => [e.name, e.description ?? '', compositionText(e), e.kind === 'STRUCTURE' ? '' : e.length ?? '', e.kind === 'STRUCTURE' ? '' : e.values ?? '']);
  return buildTable(['Data Element', 'Description', 'Composition or Data Type', 'Length', 'Values'], rows);
}

export const glossaryTable = (g: WiegersData['glossary']) =>
  buildTable(['Term', 'Definition'], [...g].sort((a, b) => a.term.localeCompare(b.term)).map((x) => [x.term, `${x.definition}${x.aliases.length ? ` (also called: ${x.aliases.join(', ')})` : ''}`]));

/** erDiagram Mermaid của mô hình dữ liệu logic (SRS §4.1) — cùng bộ dựng với Diagram Studio. */
export function logicalModelMermaid(elements: DataElementLite[], erd: (dm: DataModel) => string): string | null {
  const dm = ddToDataModel(elements);
  return dm.tables.length ? erd(dm) : null;
}

export interface FillResult { filled: string[] }

/** Điền một mẫu Wiegers (biến đổi tại chỗ `doc`). `erd` = hàm dựng erDiagram (tiêm vào để phần thuần không phụ thuộc). */
export function applyWiegersFill(kind: WiegersDoc, doc: PmNode, d: WiegersData, opts: { erd?: (dm: DataModel) => string; forExport?: boolean } = {}): string[] {
  const filled: string[] = [];
  if (nameProject(doc, d.projectName)) filled.push('project name');
  if (d.revisions.length && replaceTableAfterHeading(doc, /^Revision History$/i, () => revisionTable(d.revisions))) filled.push('revision history');
  const actors = [...d.actors].sort((a, b) => a.position - b.position || a.id - b.id);
  const actorName = (id: number | null) => (id ? actors.find((a) => a.id === id)?.name ?? null : null);
  const ucs = sortedUcs(d);
  const rules = inDocument(d.rules).sort((a, b) => a.number - b.number);
  const live = d.requirements.filter((q) => isLive(q.lifecycle));

  if (kind === 'swr-use-cases') {
    if (ucs.length) {
      const rows = ucs.map((u) => [actorName(u.primaryActorId) ?? '', u.secondaryActorIds.map(actorName).filter(Boolean).join(', '), `${ucKey(u.number)} ${u.name}`, u.description ?? '']);
      if (replaceTableAfterHeading(doc, /^Use Case List$/i, () => buildTable(['Primary Actor', 'Secondary actor', 'Use Case name', 'Description'], rows))) filled.push('use case list');
      const nodes = ucs.flatMap((u) => [heading(2, `${ucKey(u.number)}: ${u.name}`), wiegersUcTable(u, actorName, d.ucExtra.get(u.id) ?? { createdBy: null, createdAt: null })]);
      if (replaceSectionBody(doc, /^Use Case Template$/i, nodes)) filled.push('use case specifications');
      if (opts.forExport) dropSection(doc, /^Use Case Field Guidance$/i);
    }
  } else if (kind === 'swr-business-rules') {
    if (rules.length) {
      const rows = rules.map((r) => [brKey(r.number), r.definition ? (r.definition.toLowerCase().startsWith(r.name.toLowerCase()) ? r.definition : `${r.name}: ${r.definition}`) : r.name, ruleType(r.category), '', '']);
      if (replaceTableAfterHeading(doc, /^Business Rules for /i, (old) => mergeByKey(old, ['ID', 'Rule Definition', 'Type of Rule', 'Static or Dynamic', 'Source'], rows))) filled.push('business rules');
    }
  } else if (kind === 'swr-data-dictionary') {
    if (d.dataElements.length && replaceTableAfterHeading(doc, /^Data Dictionary for /i, () => ddTable(d.dataElements))) filled.push('data dictionary');
  } else if (kind === 'swr-srs') {
    const feats = [...d.features].filter((f) => f.scope !== 'OUT').sort((a, b) => a.number - b.number);
    if (feats.length && replaceTableAfterHeading(doc, /^Project Scope$/i, () => buildTable(['ID', 'Feature', 'Description'], feats.map((f) => [feKey(f.number), f.name, f.description ?? ''])))) filled.push('project scope');
    const people = actors.filter((a) => a.kind !== 'SYSTEM');
    if (people.length && replaceTableAfterHeading(doc, /^User Classes and Characteristics$/i, (old) => mergeByKey(old, ['User Class', 'Characteristics'], people.map((a) => [a.name, a.description ?? ''])))) filled.push('user classes');
    const cons = live.filter((q) => q.reqType === 'CONSTRAINT');
    if (cons.length && replaceTableAfterHeading(doc, /^Design and Implementation Constraints$/i, () => buildTable(['ID', 'Constraint', 'Priority', 'Source'], reqRows(cons)))) filled.push('constraints');
    if (d.assumptions.length && replaceTableAfterHeading(doc, /^Assumptions and Dependencies$/i, () => buildTable(['ID', 'Type', 'Assumption / Dependency'], d.assumptions.map((a) => [`${a.type === 'DEPENDENCY' ? 'DE' : 'AS'}-${a.number}`, a.type === 'DEPENDENCY' ? 'Dependency' : 'Assumption', a.title])))) filled.push('assumptions');
    // 3. System Features: mỗi FE một mục 3.n (Description + Functional Requirements).
    const fr = live.filter((q) => q.reqType === 'FUNCTIONAL');
    if (feats.length || fr.length) {
      const feUc = featureUseCases(d.features, d.featureLinks, ucs);
      const issueFe = new Map<number, number>();
      for (const l of d.featureLinks) if (l.kind === 'ISSUE') issueFe.set(l.targetId, l.featureId);
      for (const f of d.features) if (f.epicIssueId && !issueFe.has(f.epicIssueId)) issueFe.set(f.epicIssueId, f.id);
      const ucOfIssue = new Map<number, number>();
      for (const u of ucs) { const iss = d.ucIssue.get(u.id); if (iss) ucOfIssue.set(iss, u.id); }
      const featureOfReq = (q: RequirementLite): number | null => {
        if (issueFe.has(q.issueId)) return issueFe.get(q.issueId)!;
        if (q.parentId && issueFe.has(q.parentId)) return issueFe.get(q.parentId)!;
        const uc = ucOfIssue.get(q.issueId);
        if (uc) for (const [fid, ids] of feUc) if (ids.includes(uc)) return fid;
        const n = feRefsIn(`${q.title}\n${q.text}`)[0];
        return n ? d.features.find((f) => f.number === n)?.id ?? null : null;
      };
      const groups = new Map<number | null, typeof fr>();
      for (const q of fr) { const k = featureOfReq(q); groups.set(k, [...(groups.get(k) ?? []), q]); }
      const nodes: PmNode[] = [];
      feats.forEach((f, i) => {
        const n = `3.${i + 1}`;
        const ucList = (feUc.get(f.id) ?? []).map((id) => ucs.find((u) => u.id === id)).filter(Boolean).map((u) => `${ucKey(u!.number)} ${u!.name}`);
        nodes.push(heading(2, `${n} ${f.name} (${feKey(f.number)})`));
        nodes.push(heading(3, `${n}.1 Description`));
        nodes.push(para(`${f.description ?? ''}${f.priority ? ` Priority: ${P3_LABEL[f.priority] ?? f.priority}.` : ''}`.trim()));
        if (ucList.length) nodes.push(para(`Use cases: ${ucList.join('; ')}.`));
        nodes.push(heading(3, `${n}.2 Functional Requirements`));
        nodes.push(buildTable(['ID', 'Requirement', 'Priority', 'Source'], reqRows(groups.get(f.id) ?? [])));
      });
      const orphan = groups.get(null) ?? [];
      if (orphan.length) {
        const n = `3.${feats.length + 1}`;
        nodes.push(heading(2, `${n} Other Functional Requirements`));
        nodes.push(heading(3, `${n}.1 Description`), para('Functional requirements not yet traced to a feature (see the six-links check).'));
        nodes.push(heading(3, `${n}.2 Functional Requirements`), buildTable(['ID', 'Requirement', 'Priority', 'Source'], reqRows(orphan)));
      }
      if (replaceSectionBody(doc, /^System Features$/i, nodes)) filled.push('system features');
    }
    if (d.dataElements.length) {
      if (opts.erd) {
        const mm = logicalModelMermaid(d.dataElements, opts.erd);
        if (mm) {
          const blocks = doc.content ?? [];
          const i = findHeading(blocks, /^Logical Data Model$/i);
          if (i >= 0) {
            const end = sectionEnd(blocks, i);
            const keep = blocks.slice(i + 1, end).filter((b) => isGuide(b) || b.type === 'image');
            blocks.splice(i + 1, end - (i + 1), ...keep, { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [t(mm)] });
            doc.content = blocks;
            filled.push('logical data model');
          }
        }
      }
      if (replaceTableAfterHeading(doc, /^Data Dictionary$/i, () => ddTable(d.dataElements))) filled.push('data dictionary');
    }
    const ifc = live.filter((q) => q.reqType === 'EXTERNAL_INTERFACE');
    const IFC: Array<[string, RegExp]> = [['USER', /^User Interfaces$/i], ['SOFTWARE', /^Software Interfaces$/i], ['HARDWARE', /^Hardware Interfaces$/i], ['COMMUNICATIONS', /^Communications Interfaces$/i]];
    for (const [k, re] of IFC) {
      const xs = ifc.filter((q) => (q.subtype ?? 'SOFTWARE') === k);
      if (xs.length && replaceTableAfterHeading(doc, re, () => buildTable(['ID', 'Requirement', 'Priority', 'Source'], reqRows(xs)))) filled.push(`${k.toLowerCase()} interfaces`);
    }
    const qa = live.filter((q) => q.reqType === 'QUALITY');
    const QA: Array<[string, RegExp]> = [['USABILITY', /^Usability/i], ['PERFORMANCE', /^Performance/i], ['SECURITY', /^Security/i], ['SAFETY', /^Safety/i]];
    for (const [k, re] of QA) {
      const xs = qa.filter((q) => q.subtype === k);
      if (xs.length && replaceTableAfterHeading(doc, re, () => buildTable(['ID', 'Requirement', 'Priority', 'Source'], reqRows(xs)))) filled.push(k.toLowerCase());
    }
    const others = qa.filter((q) => !QA.some(([k]) => k === q.subtype));
    if (others.length && replaceTableAfterHeading(doc, /^(\[Others as relevant\]|Other Quality Attributes)$/i, () => buildTable(['ID', 'Quality Attribute', 'Requirement', 'Priority'], others.map((q) => [q.key, q.subtype ? q.subtype.charAt(0) + q.subtype.slice(1).toLowerCase() : 'Other', q.text ? `${q.title} — ${q.text}`.slice(0, 1200) : q.title, q.priority ? P3_LABEL[q.priority] ?? q.priority : ''])))) filled.push('other quality attributes');
    const reports = live.filter((q) => q.reqType === 'DATA' && q.subtype === 'REPORT');
    if (reports.length && replaceTableAfterHeading(doc, /^Reports$/i, () => buildTable(['ID', 'Report', 'Priority', 'Source'], reqRows(reports)))) filled.push('reports');
    const data = live.filter((q) => q.reqType === 'DATA' && q.subtype !== 'REPORT');
    if (data.length &&replaceTableAfterHeading(doc, /^Data Acquisition, Integrity, Retention, and Disposal$/i, () => buildTable(['ID', 'Requirement', 'Priority', 'Source'], reqRows(data)))) filled.push('data requirements');
    if (d.glossary.length && replaceTableAfterHeading(doc, /^Appendix A: Glossary$/i, () => glossaryTable(d.glossary))) filled.push('glossary');
    // Phụ lục C: ma trận truy vết FE → UC → FR → BR (liên kết #1/#2/#3 trong một bảng người chấm đọc 30 giây).
    if (feats.length) {
      const feUc = featureUseCases(d.features, d.featureLinks, ucs);
      const ucOfIssue = new Map<number, number>();
      for (const u of ucs) { const iss = d.ucIssue.get(u.id); if (iss) ucOfIssue.set(iss, u.id); }
      const rows = feats.map((f) => {
        const us = (feUc.get(f.id) ?? []).map((id) => ucs.find((u) => u.id === id)!).filter(Boolean);
        const frs = fr.filter((q) => us.some((u) => d.ucIssue.get(u.id) === q.issueId) || d.featureLinks.some((l) => l.kind === 'ISSUE' && l.featureId === f.id && (l.targetId === q.issueId || l.targetId === q.parentId)) || (f.epicIssueId && (q.parentId === f.epicIssueId || q.issueId === f.epicIssueId)));
        const brs = [...new Set(us.flatMap((u) => u.ruleNumbers))].sort((a, b) => a - b);
        return [`${feKey(f.number)} ${f.name}`, us.map((u) => ucKey(u.number)).join(', '), frs.map((q) => q.key).join(', '), brs.map(brKey).join(', ')];
      });
      if (replaceTableAfterHeading(doc, /^Appendix C: Requirements Traceability Matrix$/i, () => buildTable(['Feature', 'Use Cases', 'Functional Requirements', 'Business Rules'], rows))) filled.push('traceability matrix');
    }
  }
  return filled;
}

// ─── XLSX ────────────────────────────────────────────────────────

const CAL = (sz = 10, b = false): XStyle['font'] => ({ name: 'Arial', sz, b });
const HEAD: XStyle = { font: CAL(10, true), fill: 'C0C0C0', border: 'thin', align: { h: 'center', v: 'center', wrap: true } };
const CELL: XStyle = { font: CAL(), border: 'thin', align: { v: 'top', wrap: true } };
const NUM: XStyle = { font: CAL(), border: 'thin', align: { h: 'center', v: 'top' } };
const PCT: XStyle = { font: CAL(), border: 'thin', align: { h: 'center', v: 'top' }, numFmt: '0.0' };
const PRI: XStyle = { font: CAL(), border: 'thin', align: { h: 'center', v: 'top' }, numFmt: '0.00' };
const TOT: XStyle = { font: CAL(10, true), border: 'thin', align: { h: 'center', v: 'top' }, numFmt: '0.0' };

const DESCRIPTION = [
  'Requirements Prioritization Model', '', 'Karl Wiegers', '',
  'This spreadsheet contains a simple model for estimating the relative priorities of implementing specific features or',
  'requirements in a software system. The priority is considered to be a function of how desirable it is to include a specific',
  'feature (where desirability considers both the benefit the feature would provide to the customer, and the penalty you might',
  'incur in the customer\'s eyes if the feature is omitted), and both the relative cost and technical risk associated with',
  'implementing the feature. Every proposed feature is rated for each of the four dimensions (benefit, penalty, cost, risk) on a',
  'relative scale of 1-9 (9 is high). You can also adjust the weighting factors for each of these four dimensions in row 1.',
  '',
  'After entering the relative numbers for all the features, the relative priority for each feature is calculated by considering',
  'the percentage of the weighted feature desirability (or value), cost, and risk attributable to each feature. Sort the list',
  'descending by the "Priority" column to bring the top priority items to the top of the list.',
  '',
  'Do not use this approach for features that you know must be included for any reason (political, competitive advantage,',
  'regulatory or contractual requirement, etc.). Only use it to differentiate among requirements that are not "absolutely must do"s.',
  '',
  'Generated by CT Work from the project\'s prioritization worksheet — every row is an existing FE-n or UC-nn (six links, #5).',
];

/**
 * Bảng ưu tiên đúng layout sheet "Template" của `Requirements Prioritization Spreadsheet.xlsx`: A1 "Relative Weights:",
 * B1/C1/F1/H1 trọng số; hàng 3 tiêu đề A..J; dữ liệu từ hàng 4 với CÔNG THỨC gốc (kèm giá trị tính sẵn); hàng Totals.
 */
export function prioritySheets(rows: PriorityOut[], w: Weights, projectName: string): XSheet[] {
  const desc = new XSheet('Description');
  desc.width(1, 110);
  DESCRIPTION.forEach((line, i) => desc.set(i + 1, 1, line, i === 0 ? { font: CAL(14, true) } : i === 2 ? { font: { name: 'Arial', sz: 10, i: true } } : { font: CAL() }));
  desc.set(DESCRIPTION.length + 2, 1, `Project: ${projectName}`, { font: CAL(10, true) });

  const sh = new XSheet('Prioritization');
  [52, 11, 11, 10, 9, 11, 9, 11, 9, 10].forEach((wd, i) => sh.width(i + 1, wd));
  sh.set(1, 1, 'Relative Weights:', { font: CAL(10, true) });
  sh.set(1, 2, w.benefit, NUM); sh.set(1, 3, w.penalty, NUM); sh.set(1, 6, w.cost, NUM); sh.set(1, 8, w.risk, NUM);
  ['Feature', 'Relative Benefit', 'Relative Penalty', 'Total Value', 'Value %', 'Relative Cost', 'Cost %', 'Relative Risk', 'Risk %', 'Priority'].forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  sh.height(3, 28);
  const first = 4;
  const sorted = [...rows].sort((a, b) => a.rank - b.rank);
  const last = first + Math.max(sorted.length, 1) - 1;
  const tot = last + 1;
  sorted.forEach((r, k) => {
    const row = first + k;
    sh.set(row, 1, r.label, CELL);
    sh.set(row, 2, r.benefit, NUM);
    sh.set(row, 3, r.penalty, NUM);
    sh.set(row, 4, { f: `B${row}*$B$1+C${row}*$C$1`, v: r.totalValue }, NUM);
    sh.set(row, 5, { f: `100*D${row}/$D$${tot}`, v: r.valuePct }, PCT);
    sh.set(row, 6, r.cost, NUM);
    sh.set(row, 7, { f: `100*F${row}/$F$${tot}`, v: r.costPct }, PCT);
    sh.set(row, 8, r.risk, NUM);
    sh.set(row, 9, { f: `100*H${row}/$H$${tot}`, v: r.riskPct }, PCT);
    sh.set(row, 10, { f: `E${row}/(G${row}*$F$1+I${row}*$H$1)`, v: r.priority }, PRI);
  });
  if (!sorted.length) sh.set(first, 1, '<List each feature or use case to be prioritized — FE-n or UC-nn>', CELL);
  const sum = (c: string, v: number) => ({ f: `SUM(${c}${first}:${c}${last})`, v: r3(v) });
  sh.set(tot, 1, 'Totals', { ...CELL, font: CAL(10, true) });
  sh.set(tot, 2, sum('B', sorted.reduce((a, r) => a + r.benefit, 0)), TOT);
  sh.set(tot, 3, sum('C', sorted.reduce((a, r) => a + r.penalty, 0)), TOT);
  sh.set(tot, 4, sum('D', sorted.reduce((a, r) => a + r.totalValue, 0)), TOT);
  sh.set(tot, 5, sum('E', sorted.reduce((a, r) => a + r.valuePct, 0)), TOT);
  sh.set(tot, 6, sum('F', sorted.reduce((a, r) => a + r.cost, 0)), TOT);
  sh.set(tot, 7, sum('G', sorted.reduce((a, r) => a + r.costPct, 0)), TOT);
  sh.set(tot, 8, sum('H', sorted.reduce((a, r) => a + r.risk, 0)), TOT);
  sh.set(tot, 9, sum('I', sorted.reduce((a, r) => a + r.riskPct, 0)), TOT);
  sh.set(tot, 10, sum('J', sorted.reduce((a, r) => a + r.priority, 0)), TOT);
  sh.freeze = { col: 1, row: 3 };
  return [desc, sh];
}

export function glossarySheet(g: Array<{ term: string; definition: string; aliases: string[]; source: string | null }>, projectName: string): XSheet {
  const sh = new XSheet('Glossary');
  [28, 70, 28, 24].forEach((wd, i) => sh.width(i + 1, wd));
  sh.set(1, 1, `Glossary — ${projectName}`, { font: CAL(12, true) });
  ['Term', 'Definition', 'Also called (do not use)', 'Source'].forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  [...g].sort((a, b) => a.term.localeCompare(b.term)).forEach((x, k) => [x.term, x.definition, x.aliases.join(', '), x.source ?? ''].forEach((v, i) => sh.set(4 + k, i + 1, v, CELL)));
  sh.freeze = { col: 1, row: 3 };
  return sh;
}

/** Data Dictionary đúng 5 cột mẫu Wiegers + sheet "Usage" (phần tử ⇒ UC dùng nó) + "Notation". */
export function ddSheets(elements: DataElementLite[], usage: Map<string, string[]>, projectName: string): XSheet[] {
  const sh = new XSheet('Data Dictionary');
  [26, 44, 32, 9, 40].forEach((wd, i) => sh.width(i + 1, wd));
  sh.set(1, 1, `Data Dictionary for ${projectName}`, { font: CAL(12, true) });
  ['Data Element', 'Description', 'Composition or Data Type', 'Length', 'Values'].forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  const sorted = [...elements].sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach((e, k) => [e.name, e.description ?? '', compositionText(e), e.kind === 'STRUCTURE' ? '' : e.length ?? '', e.kind === 'STRUCTURE' ? '' : e.values ?? ''].forEach((v, i) => sh.set(4 + k, i + 1, v, CELL)));
  sh.freeze = { col: 1, row: 3 };
  const us = new XSheet('Usage');
  [26, 12, 50].forEach((wd, i) => us.width(i + 1, wd));
  ['Data Element', 'Kind', 'Used in use cases'].forEach((h, i) => us.set(1, i + 1, h, HEAD));
  sorted.forEach((e, k) => [e.name, e.kind === 'STRUCTURE' ? 'Structure' : 'Primitive', (usage.get(e.name) ?? []).join(', ')].forEach((v, i) => us.set(2 + k, i + 1, v, CELL)));
  const nt = new XSheet('Notation');
  nt.width(1, 18); nt.width(2, 90);
  [['Notation', 'Meaning'], ['A + B', 'Data structure: A followed by B'], ['(A)', 'Optional element'], ['m:n{A}', 'Repeating group: at least m, at most n instances of A ("n" = no upper limit)'], ['"x"', 'Literal text, e.g. separators in a phone number'], ['Length / Values', 'Left blank for data structures (Wiegers, Guidance for Data Dictionaries)']]
    .forEach((r, k) => r.forEach((v, i) => nt.set(1 + k, i + 1, v, k ? CELL : HEAD)));
  return [sh, us, nt];
}

export function featureSheet(rows: Array<{ key: string; name: string; description: string | null; scope: string; release: string; priority: string | null; useCases: string[]; requirements: string[]; epic: string | null }>, projectName: string): XSheet {
  const sh = new XSheet('Features');
  [8, 34, 50, 12, 18, 10, 26, 26, 12].forEach((wd, i) => sh.width(i + 1, wd));
  sh.set(1, 1, `Feature register (Vision & Scope §2.1) — ${projectName}`, { font: CAL(12, true) });
  ['ID', 'Feature', 'Description', 'Scope', 'Release', 'Priority', 'Use cases', 'Requirements', 'Epic'].forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  rows.forEach((r, k) => [r.key, r.name, r.description ?? '', r.scope === 'OUT' ? 'Out of scope' : 'In scope', r.release, r.priority ? P3_LABEL[r.priority] ?? r.priority : '', r.useCases.join(', '), r.requirements.join(', '), r.epic ?? ''].forEach((v, i) => sh.set(4 + k, i + 1, v, CELL)));
  sh.freeze = { col: 2, row: 3 };
  return sh;
}

export function sixLinksSheet(r: ReturnType<typeof sixLinks>, projectName: string): XSheet {
  const sh = new XSheet('Six links');
  [5, 70, 10, 10, 26, 70].forEach((wd, i) => sh.width(i + 1, wd));
  sh.set(1, 1, `Six traceability links a grader checks — ${projectName} (${r.passed}/6 passed)`, { font: CAL(12, true) });
  ['#', 'Link', 'Checked', 'Result', 'Where it breaks', 'Detail'].forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  let row = 4;
  const BAD: XStyle = { ...CELL, font: { name: 'Arial', sz: 10, color: '9C0006' }, fill: 'FFC7CE' };
  const GOOD: XStyle = { ...CELL, font: { name: 'Arial', sz: 10, color: '006100' }, fill: 'C6EFCE' };
  for (const l of r.links) {
    sh.set(row, 1, l.n, NUM); sh.set(row, 2, l.title, CELL); sh.set(row, 3, l.checked, NUM); sh.set(row, 4, l.ok ? 'OK' : 'BROKEN', l.ok ? GOOD : BAD);
    const errs = l.gaps.slice(0, 200);
    if (!errs.length) { sh.set(row, 5, '', CELL); sh.set(row, 6, l.note ?? '', CELL); row++; continue; }
    errs.forEach((g, k) => {
      if (k) { sh.set(row, 1, '', CELL); sh.set(row, 2, '', CELL); sh.set(row, 3, '', CELL); sh.set(row, 4, '', CELL); }
      sh.set(row, 5, g.ref, g.severity === 'error' ? BAD : CELL); sh.set(row, 6, `${g.severity === 'warning' ? '(warning) ' : ''}${g.detail}`, CELL); row++;
    });
  }
  sh.freeze = { col: 2, row: 3 };
  return sh;
}

/** Chữ thuần của bảng (đọc lại bảng đã điền — test). */
export const tableText = (n: PmNode) => tableRowsText(n);
export { plainText };
