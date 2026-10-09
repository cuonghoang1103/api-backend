/**
 * CT Work — CTW Diagram (10/10/2026): ĐẶT SƠ ĐỒ ĐÃ DUYỆT VÀO TÀI LIỆU — phần THUẦN (test ở diagrams.test.ts).
 *
 *   Report 3 (SRS)  1.3.3 Use Case Diagrams ← USE_CASE      1.5 Entity Relationship Diagram ← ERD
 *                   1.2 Main Workflows ← ACTIVITY/SWIMLANE không gắn UC
 *   Report 4 (SDS)  1.1 Software Architecture ← DEPLOYMENT/ARCHITECTURE/DATA_FLOW      1.3 Database Design ← ERD
 *                   2. Detailed Design ← mỗi feature một mục "2.k <Feature>" có "Class Diagram" (CLASS) + "Sequence Diagram"
 *                   (SEQUENCE theo UC của feature) — feature chưa có mục thì tạo ở cuối "2. Detailed Design".
 *
 * Khối đặt vào: Mermaid ⇒ khối code `mermaid` có dòng đầu `%% ctw-diagram:<id>@<v>` (ghim phiên bản ĐÃ DUYỆT); Excalidraw ⇒
 * ảnh xem trước (alt `ctw-diagram:…`). Mỗi khối kèm một dòng chú thích "Figure: D-n …". Điền lại ⇒ GỠ khối ctw-diagram cũ
 * trong mục rồi đặt khối mới — chữ/ảnh người tự viết trong mục giữ nguyên.
 */

import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import { diagramKey, embedAlt, embedSource, parseEmbed, type DiagramType } from './diagram.js';
import { findHeading, sectionEnd } from './srs.js';

export interface PlacedDiagram {
  id: number;
  number: number;
  title: string;
  type: DiagramType;
  format: 'MERMAID' | 'EXCALIDRAW';
  version: number;
  source: string;
  feature?: string | null;
  useCase?: { number: number; name: string } | null;
  previewImageId?: number | null;
}

const t = (text: string): PmNode => ({ type: 'text', text });
const heading = (level: number, text: string): PmNode => ({ type: 'heading', attrs: { level }, content: [t(text)] });
const CAPTION_RE = /^Figure\s*:?\s*D-\d+\b/;

const isGuide = (n: PmNode) => n.type === 'blockquote' && /^\s*(Guide|Purpose|Hướng dẫn|Mục đích)\s*:/i.test(plainText(n));
/** Khối do CT Work đặt (khối Mermaid có dòng nhúng / ảnh có alt ctw-diagram / dòng chú thích "Figure: D-n"). */
export const isPlaced = (n: PmNode) => (n.type === 'codeBlock' && parseEmbed(plainText(n)) !== null)
  || (n.type === 'image' && /^ctw-diagram:\d+@/.test(String(n.attrs?.alt ?? '')))
  || (n.type === 'paragraph' && CAPTION_RE.test(plainText(n).trim()));

export function captionOf(d: PlacedDiagram): string {
  const uc = d.useCase ? `UC-${String(d.useCase.number).padStart(2, '0')} ${d.useCase.name} — ` : '';
  return `Figure: ${diagramKey(d.number)} ${uc}${d.title} (v${d.version})`;
}

/** Khối (sơ đồ + chú thích) của một sơ đồ. projectId cần cho ảnh Excalidraw. */
export function blocksFor(d: PlacedDiagram, projectId: number, mode: 'latest' | 'pinned' = 'pinned'): PmNode[] {
  const cap: PmNode = { type: 'paragraph', content: [{ type: 'text', text: captionOf(d), marks: [{ type: 'italic' }] }] };
  if (d.format === 'MERMAID') {
    return [{ type: 'codeBlock', attrs: { language: 'mermaid' }, content: [t(embedSource(d, d.version, d.source, mode))] }, cap];
  }
  if (d.previewImageId) {
    return [{ type: 'image', attrs: { src: `/api/v1/work/projects/${projectId}/images/${d.previewImageId}`, alt: embedAlt(d, d.version, mode), title: `${diagramKey(d.number)} ${d.title}` } }, cap];
  }
  return [{ type: 'paragraph', content: [t(`${diagramKey(d.number)} ${d.title} — Excalidraw drawing without a preview; open it in Diagram Studio and save once to create the picture.`)] }, cap];
}

/** Thay khối đã đặt trong THÂN TRỰC TIẾP của mục `i` (trước đề mục con đầu tiên). Trả true nếu có đặt. */
function placeUnder(blocks: PmNode[], i: number, nodes: PmNode[]): void {
  const end = sectionEnd(blocks, i);
  let bodyEnd = i + 1;
  while (bodyEnd < end && blocks[bodyEnd].type !== 'heading') bodyEnd++;
  let at = -1;
  for (let k = bodyEnd - 1; k > i; k--) if (isPlaced(blocks[k])) { blocks.splice(k, 1); at = k; bodyEnd--; }
  if (at < 0) {
    at = i + 1;
    while (at < bodyEnd && isGuide(blocks[at])) at++;
    // sau chữ người viết (nếu có) — sơ đồ thường đứng sau đoạn giới thiệu
    while (at < bodyEnd && !isPlaced(blocks[at]) && blocks[at].type === 'paragraph') at++;
  }
  blocks.splice(Math.min(at, bodyEnd), 0, ...nodes);
}

const byNumber = (a: PlacedDiagram, b: PlacedDiagram) => (a.useCase?.number ?? 0) - (b.useCase?.number ?? 0) || a.number - b.number;

function fillSection(doc: PmNode, re: RegExp, list: PlacedDiagram[], projectId: number): boolean {
  if (!list.length) return false;
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, re);
  if (i < 0) return false;
  placeUnder(blocks, i, [...list].sort(byNumber).flatMap((d) => blocksFor(d, projectId)));
  doc.content = blocks;
  return true;
}

const stripNum = (s: string) => s.replace(/^(?:[IVX]+\.|\d+(?:\.\d+)*\.?)\s+/, '').trim();

/** Report 4 "2. Detailed Design": mỗi feature một mục có Class Diagram + Sequence Diagram. */
function fillDetailedDesign(doc: PmNode, classes: PlacedDiagram[], sequences: PlacedDiagram[], projectId: number): boolean {
  if (!classes.length && !sequences.length) return false;
  const blocks = doc.content ?? [];
  const top = findHeading(blocks, /^Detailed Design$/i);
  if (top < 0) return false;
  const lv = Number(blocks[top].attrs?.level ?? 2);
  const features = [...new Set([...sequences, ...classes].map((d) => (d.feature ?? '').trim() || 'General'))];
  const featureOf = (d: PlacedDiagram) => (d.feature ?? '').trim() || 'General';
  const secNo = /^((?:\d+\.)*\d+)\.?\s/.exec(plainText(blocks[top]).trim())?.[1] ?? '2';
  for (const f of features) {
    let end = sectionEnd(blocks, top);
    let fi = -1;
    for (let k = top + 1; k < end; k++) if (blocks[k].type === 'heading' && Number(blocks[k].attrs?.level) === lv + 1 && stripNum(plainText(blocks[k])).toLowerCase() === f.toLowerCase()) { fi = k; break; }
    if (fi < 0) {
      // Mục mẫu "Feature name" (bỏ ở cuối nếu trống) không tính vào số thứ tự.
      const n = blocks.slice(top + 1, end).filter((b) => b.type === 'heading' && Number(b.attrs?.level) === lv + 1 && !/^feature name$/i.test(stripNum(plainText(b)))).length + 1;
      blocks.splice(end, 0, heading(lv + 1, `${secNo}.${n} ${f}`), heading(lv + 2, `${secNo}.${n}.1 Class Diagram`), heading(lv + 2, `${secNo}.${n}.2 Sequence Diagram`));
      fi = end;
      end = sectionEnd(blocks, top);
    }
    const fEnd = sectionEnd(blocks, fi);
    const sub = (re: RegExp) => { for (let k = fi + 1; k < fEnd; k++) if (blocks[k].type === 'heading' && re.test(stripNum(plainText(blocks[k])))) return k; return -1; };
    const cls = classes.filter((d) => featureOf(d) === f);
    const seq = sequences.filter((d) => featureOf(d) === f);
    const ci = sub(/^Class Diagrams?$/i);
    if (ci >= 0 && cls.length) placeUnder(blocks, ci, cls.sort(byNumber).flatMap((d) => blocksFor(d, projectId)));
    const si = sub(/^Sequence Diagrams?$/i);
    if (si >= 0 && seq.length) placeUnder(blocks, si, seq.sort(byNumber).flatMap((d) => blocksFor(d, projectId)));
  }
  // Mục mẫu "2.1 Feature name" còn trống (chỉ hướng dẫn) ⇒ bỏ khi đã có mục feature thật.
  const end = sectionEnd(blocks, top);
  for (let k = top + 1; k < end; k++) {
    if (!(blocks[k].type === 'heading' && Number(blocks[k].attrs?.level) === lv + 1 && /^feature name$/i.test(stripNum(plainText(blocks[k]))))) continue;
    const e = sectionEnd(blocks, k);
    const body = blocks.slice(k + 1, e).filter((b) => b.type !== 'heading' && !isGuide(b) && !(b.type === 'paragraph' && !plainText(b).trim()));
    if (!body.length && features.length) blocks.splice(k, e - k);
    break;
  }
  doc.content = blocks;
  return true;
}

export const FILL_LABEL = {
  useCaseDiagrams: 'Use Case Diagrams', erd: 'Entity Relationship Diagram', workflows: 'Main Workflows',
  architecture: 'Software Architecture', database: 'Database Design', detailedDesign: 'Detailed Design (class + sequence)',
} as const;
export type FillPart = keyof typeof FILL_LABEL;

/** Đặt sơ đồ đã duyệt vào bản sao nội dung trang Report 3 hoặc 4 (biến đổi tại chỗ). Trả các phần đã đặt. */
export function applyDiagramFill(doc: PmNode, report: 3 | 4, diagrams: PlacedDiagram[], projectId: number): FillPart[] {
  const of = (...types: DiagramType[]) => diagrams.filter((d) => types.includes(d.type));
  const done: FillPart[] = [];
  if (report === 3) {
    if (fillSection(doc, /^Use Case Diagrams?$/i, of('USE_CASE'), projectId)) done.push('useCaseDiagrams');
    if (fillSection(doc, /^(Entity Relationship Diagram|ERD|Conceptual Data Model)$/i, of('ERD'), projectId)) done.push('erd');
    if (fillSection(doc, /^Main Workflows?$/i, of('ACTIVITY', 'SWIMLANE').filter((d) => !d.useCase), projectId)) done.push('workflows');
  } else {
    if (fillSection(doc, /^Software Architecture$/i, of('DEPLOYMENT', 'ARCHITECTURE', 'DATA_FLOW'), projectId)) done.push('architecture');
    if (fillSection(doc, /^Database Design$/i, of('ERD'), projectId)) done.push('database');
    if (fillDetailedDesign(doc, of('CLASS'), of('SEQUENCE'), projectId)) done.push('detailedDesign');
  }
  return done;
}

// ─── Đồng bộ khối nhúng khi sơ đồ đổi phiên bản ──────────────────

/**
 * Duyệt mọi khối của trang: khối Mermaid `%% ctw-diagram:<id>@latest` của sơ đồ `d` ⇒ thay nguồn bằng phiên bản mới;
 * ảnh `ctw-diagram:<id>@latest` ⇒ đổi src sang ảnh xem trước mới. Khối ghim phiên bản (`@3`) giữ nguyên. Trả số khối đã đổi.
 */
export function syncEmbedsInDoc(doc: PmNode, d: PlacedDiagram, projectId: number): number {
  let changed = 0;
  const walk = (n: PmNode) => {
    if (n.type === 'codeBlock') {
      const e = parseEmbed(plainText(n));
      if (e && e.id === d.id && e.mode === 'latest' && d.format === 'MERMAID') {
        const next = embedSource(d, d.version, d.source, 'latest');
        if (plainText(n) !== next) { n.content = [t(next)]; changed++; }
      }
      return;
    }
    if (n.type === 'image') {
      const m = /^ctw-diagram:(\d+)@latest\b/.exec(String(n.attrs?.alt ?? ''));
      if (m && Number(m[1]) === d.id && d.previewImageId) {
        const src = `/api/v1/work/projects/${projectId}/images/${d.previewImageId}`;
        if (n.attrs?.src !== src) { n.attrs = { ...(n.attrs ?? {}), src, alt: embedAlt(d, d.version, 'latest') }; changed++; }
      }
      return;
    }
    for (const c of n.content ?? []) walk(c);
  };
  walk(doc);
  return changed;
}

/** Chèn một khối nhúng vào trang: sau đề mục `heading` (khớp chữ, bỏ số) hoặc cuối trang. */
export function insertEmbed(doc: PmNode, d: PlacedDiagram, projectId: number, opts: { mode: 'latest' | 'pinned'; heading?: string | null }): { placed: 'heading' | 'end' } {
  const blocks = doc.content ?? [];
  const nodes = blocksFor(d, projectId, opts.mode);
  if (opts.heading) {
    const want = stripNum(opts.heading).toLowerCase();
    const i = blocks.findIndex((b) => b.type === 'heading' && stripNum(plainText(b)).toLowerCase() === want);
    if (i >= 0) {
      const end = sectionEnd(blocks, i);
      let bodyEnd = i + 1;
      while (bodyEnd < end && blocks[bodyEnd].type !== 'heading') bodyEnd++;
      blocks.splice(bodyEnd, 0, ...nodes);
      doc.content = blocks;
      return { placed: 'heading' };
    }
  }
  blocks.push(...nodes);
  doc.content = blocks;
  return { placed: 'end' };
}

/** Đề mục của trang (để người chọn chỗ chèn). */
export const headingsOf = (doc: PmNode | null | undefined) => (doc?.content ?? []).filter((b) => b.type === 'heading').map((b) => ({ level: Number(b.attrs?.level ?? 1), text: plainText(b).trim() })).filter((h) => h.text);
