/**
 * CT Work — CTW Diagram (10/10/2026): NHẬP sơ đồ — phần THUẦN (test ở diagrams.test.ts).
 *
 *   .drawio / .xml (draw.io, kể cả trang nén base64+deflate)  ⇒ IR (nút, cạnh, khung) ⇒ Mermaid flowchart (hoặc sequence
 *                                                              khi tệp vẽ lifeline) + "sổ trung thực" (gộp/bỏ gì)
 *   .excalidraw (JSON)                                          ⇒ giữ NGUYÊN làm sơ đồ Excalidraw; tuỳ chọn chuyển Mermaid
 *   .mmd / .md có khối ```mermaid                               ⇒ Mermaid (dò loại)
 *
 * KHÔNG nhúng/gửi gì tới diagrams.net — mọi thứ xử lý trên máy chủ CT Work.
 *
 * Cách đọc draw.io (giải nén payload, gỡ <object>/<UserObject>, nhãn HTML ⇒ chữ, nhận dạng hình, nhãn cạnh là đỉnh con của
 * cạnh, mũi tên chỉ có đầu ⇒ đảo chiều) chuyển thể từ `scripts/drawio_extract.py` và `scripts/excalidraw_extract.py` của
 * diagram-design (MIT, © 2025 Cathryn Lavery — https://github.com/cathrynlavery/diagram-design). Nội dung tệp là DỮ LIỆU
 * KHÔNG TIN CẬY: không theo link, không chạy gì trong nhãn; DTD/ENTITY bị từ chối; giải nén có trần.
 */

import zlib from 'node:zlib';
import { mmId, mmLabel, mermaidKind, typeFromMermaid, type DiagramType } from './diagram.js';

export const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
const MAX_XML_BYTES = 16 * 1024 * 1024;
const MAX_CELLS = 10_000;

export interface IrNode { id: string; label: string; shape: string; parent: string | null; container: boolean; x: number; y: number; w: number; h: number; dashed: boolean }
export interface IrEdge { id: string; source: string; target: string; label: string; dashed: boolean; bidirectional: boolean }
export interface IrPage { name: string; nodes: IrNode[]; edges: IrEdge[] }

export class ImportError extends Error {}

// ─── XML tối giản (thuộc tính của mxCell/object) ─────────────────

const decodeXml = (s: string) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&amp;/g, '&');

function attrs(tag: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of tag.matchAll(/([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) out[m[1]] = decodeXml(m[3] ?? m[4] ?? '');
  return out;
}

function inflate(payload: string): string | null {
  let raw: Buffer;
  try { raw = Buffer.from(payload.trim(), 'base64'); } catch { return null; }
  if (!raw.length) return null;
  for (const fn of [zlib.inflateRawSync, zlib.inflateSync, zlib.gunzipSync]) {
    try {
      const out = fn(raw, { maxOutputLength: MAX_XML_BYTES }).toString('utf8');
      try { return decodeURIComponent(out); } catch { return out; }
    } catch { /* thử cách khác */ }
  }
  return null;
}

/** Nhãn draw.io thường là HTML ⇒ chữ thuần nhiều dòng. */
export function cleanLabel(v: string | undefined): string {
  if (!v) return '';
  let t = v.replace(/<br\s*\/?>|<\/p\s*>|<\/div\s*>/gi, '\n').replace(/<[^>]+>/g, '');
  t = decodeXml(t).replace(/\u00a0/g, ' ');
  return t.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).filter(Boolean).join('\n').trim();
}

function parseStyle(style: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of String(style ?? '').split(';')) {
    const p = part.trim();
    if (!p) continue;
    const i = p.indexOf('=');
    if (i < 0) out[p] = '1'; else out[p.slice(0, i).trim()] = p.slice(i + 1).trim();
  }
  return out;
}

const SHAPE_KEYS: Array<[string, string]> = [
  ['swimlane', 'swimlane'], ['ellipse', 'ellipse'], ['rhombus', 'rhombus'], ['cylinder', 'cylinder'], ['cylinder3', 'cylinder'],
  ['hexagon', 'hexagon'], ['cloud', 'cloud'], ['actor', 'actor'], ['umlActor', 'actor'], ['note', 'note'], ['document', 'document'],
  ['datastore', 'cylinder'], ['umlLifeline', 'lifeline'], ['umlFrame', 'frame'], ['table', 'table'], ['tableRow', 'table-row'],
  ['partialRectangle', 'table-row'], ['parallelogram', 'parallelogram'], ['process', 'process'], ['image', 'image'], ['text', 'text'], ['group', 'group'],
];

function classifyShape(st: Record<string, string>): string {
  const raw = st.shape ?? '';
  if (raw) {
    for (const [k, n] of SHAPE_KEYS) if (raw === k || raw.startsWith(k)) return n;
    if (/^mxgraph\.(aws|azure|gcp|kubernetes)/.test(raw)) return 'icon';
    if (/^mxgraph\.flowchart\.decision/.test(raw)) return 'rhombus';
    if (/^mxgraph\.flowchart\.(start|terminator)/.test(raw)) return 'ellipse';
    if (/^mxgraph\.flowchart\.database/.test(raw)) return 'cylinder';
    return 'rect';
  }
  for (const [k, n] of SHAPE_KEYS) if (k in st) return n;
  return 'rect';
}

/** Lấy <mxfile>/<mxGraphModel> từ: XML thô, trang nén, SVG xuất từ draw.io (thuộc tính content), PNG có chunk mxfile. */
export function loadMxfile(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  if (buf.length > MAX_IMPORT_BYTES) throw new ImportError(`The file is too large (max ${MAX_IMPORT_BYTES / 1024 / 1024} MB)`);
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    let pos = 8;
    while (pos + 8 <= buf.length) {
      const len = buf.readUInt32BE(pos);
      const type = buf.subarray(pos + 4, pos + 8).toString('latin1');
      const body = buf.subarray(pos + 8, pos + 8 + len);
      pos += 12 + len;
      if (type === 'IEND') break;
      if (type !== 'tEXt' && type !== 'zTXt' && type !== 'iTXt') continue;
      const z = body.indexOf(0);
      if (body.subarray(0, z).toString('latin1').toLowerCase() !== 'mxfile') continue;
      let val: Buffer = body.subarray(z + 1);
      if (type === 'zTXt') val = zlib.inflateSync(val.subarray(1), { maxOutputLength: MAX_XML_BYTES });
      if (type === 'iTXt') { const flag = val[0]; const rest = val.subarray(2); const parts = rest.toString('latin1').split('\0'); const tail = Buffer.from(parts.slice(2).join('\0'), 'latin1'); val = flag === 1 ? zlib.inflateSync(tail, { maxOutputLength: MAX_XML_BYTES }) : tail; }
      const s = val.toString('utf8');
      try { return decodeURIComponent(s); } catch { return s; }
    }
    throw new ImportError('This PNG has no embedded draw.io diagram (export it from draw.io with "Include a copy of my diagram")');
  }
  const text = buf.toString('utf8').replace(/^\uFEFF/, '').trim();
  if (/<!DOCTYPE|<!ENTITY/i.test(text)) throw new ImportError('DTD and entity declarations are not supported');
  if (text.includes('<mxfile') || text.includes('<mxGraphModel')) return text;
  if (text.slice(0, 2000).includes('<svg')) {
    const m = /\bcontent\s*=\s*"([^"]*)"/i.exec(text) ?? /\bcontent\s*=\s*'([^']*)'/i.exec(text);
    const c = m ? decodeXml(m[1]) : '';
    if (c.includes('<mxfile') || c.includes('<mxGraphModel')) return c;
    throw new ImportError('This SVG has no embedded draw.io diagram');
  }
  const inflated = inflate(text);
  if (inflated?.includes('<mxGraphModel')) return inflated;
  throw new ImportError('This is not a draw.io file (no mxfile or mxGraphModel found)');
}

/** Các trang của tệp draw.io ⇒ IR. */
export function parseDrawio(input: Buffer | string): IrPage[] {
  const xml = loadMxfile(input);
  const pages: Array<{ name: string; model: string }> = [];
  const diagRe = /<diagram\b([^>]*)>([\s\S]*?)<\/diagram>/g;
  let any = false;
  for (const m of xml.matchAll(diagRe)) {
    any = true;
    if (pages.length >= 100) throw new ImportError('Too many pages (max 100)');
    const a = attrs(m[1]);
    let model = m[2];
    if (!model.includes('<mxGraphModel')) {
      const inf = inflate(model);
      if (!inf) continue;
      if (/<!DOCTYPE|<!ENTITY/i.test(inf)) throw new ImportError('DTD and entity declarations are not supported');
      model = inf;
    }
    pages.push({ name: a.name || `Page-${pages.length + 1}`, model });
  }
  if (!any) pages.push({ name: 'Page-1', model: xml });
  return pages.map((p) => parseModel(p.name, p.model));
}

function parseModel(name: string, model: string): IrPage {
  const cells: Array<{ id: string; a: Record<string, string>; value: string; geom: Record<string, string>; relative: boolean; offset: [number, number] }> = [];
  // <object …><mxCell …>…</mxCell></object>  hoặc  <mxCell …/> / <mxCell …>…</mxCell>
  const re = /<(object|UserObject)\b([^>]*)>([\s\S]*?)<\/\1>|<mxCell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/mxCell>)/g;
  for (const m of model.matchAll(re)) {
    if (cells.length > MAX_CELLS) throw new ImportError(`Too many shapes on page "${name}" (max ${MAX_CELLS})`);
    let a: Record<string, string>;
    let inner: string;
    let value: string;
    let id: string;
    if (m[1]) {
      const oa = attrs(m[2]);
      const cm = /<mxCell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/mxCell>)/.exec(m[3]);
      if (!cm) continue;
      a = attrs(cm[1]);
      inner = cm[2] ?? '';
      value = oa.label ?? '';
      id = oa.id || a.id || '';
    } else {
      a = attrs(m[4]);
      inner = m[5] ?? '';
      value = a.value ?? '';
      id = a.id ?? '';
    }
    if (!id) continue;
    const g = /<mxGeometry\b([^>]*?)(?:\/>|>([\s\S]*?)<\/mxGeometry>)/.exec(inner);
    const geom = g ? attrs(g[1]) : {};
    const off = g?.[2] ? /<mxPoint\b([^>]*as="offset"[^>]*)\/?>/.exec(g[2]) : null;
    const oa = off ? attrs(off[1]) : {};
    cells.push({ id, a, value, geom, relative: geom.relative === '1', offset: [Number(oa.x ?? 0), Number(oa.y ?? 0)] });
  }
  const byId = new Map(cells.map((c) => [c.id, c]));
  const nodes: IrNode[] = [];
  const edgeLabels = new Map<string, string[]>();
  for (const c of cells) {
    if (c.a.edge === '1' || c.a.vertex !== '1') continue;
    const st = parseStyle(c.a.style);
    const parent = c.a.parent ?? null;
    const pc = parent ? byId.get(parent) : undefined;
    if (pc?.a.edge === '1' || 'edgeLabel' in st) {
      const t = cleanLabel(c.value);
      if (t && parent) edgeLabels.set(parent, [...(edgeLabels.get(parent) ?? []), t]);
      continue;
    }
    const num = (k: string) => (Number.isFinite(Number(c.geom[k])) ? Number(c.geom[k]) : 0);
    nodes.push({
      id: c.id, label: cleanLabel(c.value), shape: classifyShape(st), parent, container: st.container === '1' || 'swimlane' in st || st.shape === 'swimlane',
      x: num('x'), y: num('y'), w: num('width'), h: num('height'), dashed: st.dashed === '1',
    });
  }
  // toạ độ tuyệt đối (con nằm trong cha)
  const nm = new Map(nodes.map((n) => [n.id, n]));
  const absCache = new Map<string, [number, number]>();
  const abs = (n: IrNode, depth = 0): [number, number] => {
    if (absCache.has(n.id)) return absCache.get(n.id)!;
    const p = n.parent ? nm.get(n.parent) : undefined;
    const base: [number, number] = p && depth < 20 ? abs(p, depth + 1) : [0, 0];
    const v: [number, number] = [base[0] + n.x, base[1] + n.y];
    absCache.set(n.id, v);
    return v;
  };
  for (const n of nodes) { const [x, y] = abs(n); n.x = x; n.y = y; }
  const edges: IrEdge[] = [];
  for (const c of cells) {
    if (c.a.edge !== '1') continue;
    const st = parseStyle(c.a.style);
    let src = c.a.source ?? '';
    let tgt = c.a.target ?? '';
    // cạnh nối vào nhãn/đỉnh con của bảng ⇒ lên tới nút gần nhất có trong danh sách
    const up = (id: string) => { let cur = id; for (let i = 0; i < 10 && cur && !nm.has(cur); i++) cur = byId.get(cur)?.a.parent ?? ''; return nm.has(cur) ? cur : ''; };
    src = up(src);
    tgt = up(tgt);
    if (!src || !tgt) continue;
    const startArrow = st.startArrow && st.startArrow !== 'none';
    const endArrow = st.endArrow === undefined ? true : st.endArrow !== 'none';
    if (startArrow && !endArrow) [src, tgt] = [tgt, src];
    const label = [cleanLabel(c.value), ...(edgeLabels.get(c.id) ?? [])].filter(Boolean).join(' ');
    edges.push({ id: c.id, source: src, target: tgt, label, dashed: st.dashed === '1', bidirectional: !!startArrow && endArrow });
  }
  return { name, nodes, edges };
}

// ─── IR ⇒ Mermaid ────────────────────────────────────────────────

export interface Fidelity { kept: number; merged: string[]; dropped: string[]; notes: string[] }

const SHAPE_MM: Record<string, (id: string, l: string) => string> = {
  rhombus: (id, l) => `${id}{"${l}"}`, ellipse: (id, l) => `${id}(["${l}"])`, cylinder: (id, l) => `${id}[("${l}")]`,
  hexagon: (id, l) => `${id}{{"${l}"}}`, actor: (id, l) => `${id}["«actor»<br/>${l}"]`, document: (id, l) => `${id}[/"${l}"/]`,
  parallelogram: (id, l) => `${id}[/"${l}"/]`, note: (id, l) => `${id}>"${l}"]`, cloud: (id, l) => `${id}(("${l}"))`,
};

/** IR một trang ⇒ Mermaid. Có lifeline ⇒ sequence; còn lại ⇒ flowchart (khung/swimlane ⇒ subgraph). */
export function irToMermaid(page: IrPage): { mermaid: string; type: DiagramType; fidelity: Fidelity } {
  const fid: Fidelity = { kept: 0, merged: [], dropped: [], notes: [] };
  const lifelines = page.nodes.filter((n) => n.shape === 'lifeline');
  if (lifelines.length >= 2) {
    const ll = [...lifelines].sort((a, b) => a.x - b.x);
    const pid = new Map(ll.map((n, i) => [n.id, `P${i + 1}`]));
    const ownerOf = (id: string) => { let cur: IrNode | undefined = page.nodes.find((n) => n.id === id); for (let i = 0; i < 10 && cur && !pid.has(cur.id); i++) cur = page.nodes.find((n) => n.id === cur!.parent); return cur && pid.has(cur.id) ? pid.get(cur.id)! : null; };
    const lines = ['sequenceDiagram'];
    for (const n of ll) lines.push(`  participant ${pid.get(n.id)} as ${mmLabel(n.label.split('\n')[0] || pid.get(n.id)!, 60)}`);
    const msgs = page.edges.map((e) => ({ e, a: ownerOf(e.source), b: ownerOf(e.target), y: Math.min(page.nodes.find((n) => n.id === e.source)?.y ?? 0, page.nodes.find((n) => n.id === e.target)?.y ?? 0) }))
      .filter((m) => m.a && m.b).sort((x, y) => x.y - y.y);
    for (const m of msgs) lines.push(`  ${m.a}${m.e.dashed ? '-->>' : '->>'}${m.b}: ${mmLabel(m.e.label, 100) || ' '}`);
    fid.kept = ll.length;
    fid.notes.push(`Read ${ll.length} lifelines and ${msgs.length} messages; message order follows the vertical position in the drawing.`);
    const skipped = page.edges.length - msgs.length;
    if (skipped > 0) fid.dropped.push(`${skipped} connector(s) not attached to a lifeline`);
    return { mermaid: lines.join('\n'), type: 'SEQUENCE', fidelity: fid };
  }
  const usable = page.nodes.filter((n) => n.shape !== 'table-row' && n.shape !== 'text' || n.label);
  const containers = new Set(usable.filter((n) => n.container).map((n) => n.id));
  const ids = new Map<string, string>();
  const used = new Set<string>();
  for (const n of usable) {
    let id = mmId(n.label.split('\n')[0] || n.shape, 'N').slice(0, 24) || 'N';
    while (used.has(id)) id = `${id}_${used.size}`;
    used.add(id);
    ids.set(n.id, id);
  }
  const tableRows = page.nodes.filter((n) => n.shape === 'table-row');
  if (tableRows.length) fid.merged.push(`${tableRows.length} table row(s) folded into their table`);
  const empty = usable.filter((n) => !n.label && !n.container && !page.edges.some((e) => e.source === n.id || e.target === n.id));
  for (const n of empty) { fid.dropped.push(`unlabelled ${n.shape} with no connectors`); ids.delete(n.id); }
  const horizontal = (() => {
    const xs = usable.map((n) => n.x);
    const ys = usable.map((n) => n.y);
    return Math.max(...xs, 0) - Math.min(...xs, 0) > Math.max(...ys, 0) - Math.min(...ys, 0);
  })();
  const lines = [`flowchart ${horizontal ? 'LR' : 'TB'}`];
  const childrenOf = (pid: string | null) => usable.filter((n) => ids.has(n.id) && (n.parent ?? null) === pid);
  const emit = (n: IrNode, indent: string) => {
    const id = ids.get(n.id)!;
    const label = mmLabel(n.label.replace(/\n/g, ' · '), 90) || ' ';
    if (containers.has(n.id)) {
      lines.push(`${indent}subgraph ${id}["${label}"]`);
      for (const c of childrenOf(n.id)) emit(c, `${indent}  `);
      lines.push(`${indent}end`);
    } else {
      lines.push(`${indent}${(SHAPE_MM[n.shape] ?? ((i: string, l: string) => `${i}["${l}"]`))(id, label)}`);
    }
    fid.kept++;
  };
  const roots = usable.filter((n) => ids.has(n.id) && !(n.parent && containers.has(n.parent) && ids.has(n.parent)));
  for (const n of roots) emit(n, '  ');
  let edgesKept = 0;
  for (const e of page.edges) {
    const a = ids.get(e.source);
    const b = ids.get(e.target);
    if (!a || !b) { fid.dropped.push(`connector ${e.label ? `"${e.label}"` : e.id} (end shape not kept)`); continue; }
    const arrow = e.bidirectional ? '<-->' : e.dashed ? '-.->' : '-->';
    lines.push(e.label ? `  ${a} ${arrow}|"${mmLabel(e.label, 40)}"| ${b}` : `  ${a} ${arrow} ${b}`);
    edgesKept++;
  }
  fid.notes.push(`${fid.kept} shape(s) and ${edgesKept} connector(s) kept; positions, colours and fonts are not carried over — CT Work lays the diagram out again.`);
  const kind: DiagramType = page.nodes.some((n) => n.shape === 'table') ? 'ERD' : page.nodes.some((n) => n.shape === 'swimlane') ? 'SWIMLANE' : page.nodes.some((n) => n.shape === 'rhombus') ? 'ACTIVITY' : 'FLOWCHART';
  if (kind === 'ERD') fid.notes.push('The drawing looks like a data model (table shapes) — kept as a flowchart; redraw it as an erDiagram for Report 4.');
  return { mermaid: lines.join('\n'), type: kind === 'ERD' ? 'FLOWCHART' : kind, fidelity: fid };
}

// ─── Excalidraw ⇒ IR ⇒ Mermaid ───────────────────────────────────

interface ExEl { id: string; type: string; text?: string; originalText?: string; containerId?: string | null; x?: number; y?: number; width?: number; height?: number; isDeleted?: boolean; startBinding?: { elementId?: string } | null; endBinding?: { elementId?: string } | null; boundElements?: Array<{ id: string; type: string }> | null; strokeStyle?: string; startArrowhead?: string | null; endArrowhead?: string | null; frameId?: string | null; name?: string | null }

export function excalidrawToIr(json: string | unknown): IrPage {
  const o = (typeof json === 'string' ? JSON.parse(json) : json) as { elements?: ExEl[] };
  const els = (o.elements ?? []).filter((e) => e && !e.isDeleted);
  if (els.length > MAX_CELLS) throw new ImportError(`Too many elements (max ${MAX_CELLS})`);
  const texts = els.filter((e) => e.type === 'text');
  const labelOf = (id: string) => texts.filter((t) => t.containerId === id).map((t) => (t.originalText ?? t.text ?? '').trim()).join(' ').trim();
  const SHAPES: Record<string, string> = { rectangle: 'rect', ellipse: 'ellipse', diamond: 'rhombus', frame: 'frame', image: 'image' };
  const nodes: IrNode[] = [];
  for (const e of els) {
    if (SHAPES[e.type]) nodes.push({ id: e.id, label: e.type === 'frame' ? (e.name ?? '') : labelOf(e.id), shape: SHAPES[e.type], parent: e.frameId ?? null, container: e.type === 'frame', x: e.x ?? 0, y: e.y ?? 0, w: e.width ?? 0, h: e.height ?? 0, dashed: e.strokeStyle === 'dashed' });
  }
  // chữ đứng một mình (không trong hình) — giữ như nút nếu có mũi tên nối vào
  for (const t of texts.filter((x) => !x.containerId)) nodes.push({ id: t.id, label: (t.originalText ?? t.text ?? '').trim(), shape: 'text', parent: t.frameId ?? null, container: false, x: t.x ?? 0, y: t.y ?? 0, w: t.width ?? 0, h: t.height ?? 0, dashed: false });
  const has = new Set(nodes.map((n) => n.id));
  const edges: IrEdge[] = [];
  for (const e of els) {
    if (e.type !== 'arrow' && e.type !== 'line') continue;
    let a = e.startBinding?.elementId ?? '';
    let b = e.endBinding?.elementId ?? '';
    if (!has.has(a) || !has.has(b)) continue;
    const start = !!e.startArrowhead;
    const end = e.type === 'arrow' ? e.endArrowhead !== null : !!e.endArrowhead;
    if (start && !end) [a, b] = [b, a];
    edges.push({ id: e.id, source: a, target: b, label: labelOf(e.id), dashed: e.strokeStyle === 'dashed' || e.strokeStyle === 'dotted', bidirectional: start && end });
  }
  const linked = new Set(edges.flatMap((e) => [e.source, e.target]));
  return { name: 'Excalidraw', nodes: nodes.filter((n) => n.shape !== 'text' || linked.has(n.id)), edges };
}

// ─── Mermaid / Markdown ──────────────────────────────────────────

/** .mmd ⇒ nguyên văn; .md ⇒ khối ```mermaid đầu tiên (hoặc mọi khối, chọn theo `index`). */
export function extractMermaid(text: string, index = 0): { mermaid: string; blocks: number } {
  const src = String(text ?? '').replace(/^\uFEFF/, '');
  const blocks = [...src.matchAll(/```+\s*mermaid[^\n]*\n([\s\S]*?)```+/gi)].map((m) => m[1].trim());
  if (blocks.length) return { mermaid: blocks[Math.min(index, blocks.length - 1)], blocks: blocks.length };
  if (!mermaidKind(src)) throw new ImportError('No Mermaid diagram found — the file should start with a diagram keyword (flowchart, sequenceDiagram, erDiagram…) or contain a ```mermaid block');
  return { mermaid: src.trim(), blocks: 1 };
}

export interface ImportResult {
  format: 'MERMAID' | 'EXCALIDRAW';
  type: DiagramType;
  source: string;
  title: string;
  fidelity: Fidelity;
  pages?: string[];
}

/** Một điểm vào: tên tệp + nội dung (base64 hoặc chữ) ⇒ sơ đồ để lưu. */
export function importFile(input: { fileName: string; content: string; base64?: boolean; page?: number; to?: 'mermaid' | 'native' }): ImportResult {
  const name = input.fileName.toLowerCase();
  const buf = input.base64 ? Buffer.from(input.content, 'base64') : Buffer.from(input.content, 'utf8');
  if (buf.length > MAX_IMPORT_BYTES) throw new ImportError(`The file is too large (max ${MAX_IMPORT_BYTES / 1024 / 1024} MB)`);
  const title = input.fileName.replace(/\.(drawio|xml|excalidraw|json|mmd|mermaid|md|png|svg)(\.(xml|png|svg))?$/i, '').replace(/[_-]+/g, ' ').trim().slice(0, 180) || 'Imported diagram';
  if (/\.excalidraw(\.json)?$/.test(name) || (/\.json$/.test(name) && buf.toString('utf8').includes('"excalidraw"'))) {
    const json = buf.toString('utf8');
    let parsed: unknown;
    try { parsed = JSON.parse(json); } catch { throw new ImportError('This .excalidraw file is not valid JSON'); }
    if (input.to === 'mermaid') {
      const r = irToMermaid(excalidrawToIr(parsed));
      return { format: 'MERMAID', type: r.type, source: r.mermaid, title, fidelity: r.fidelity };
    }
    const els = (parsed as { elements?: unknown[] }).elements;
    if (!Array.isArray(els)) throw new ImportError('Excalidraw JSON needs an "elements" array');
    return { format: 'EXCALIDRAW', type: 'WHITEBOARD', source: json, title, fidelity: { kept: els.length, merged: [], dropped: [], notes: ['Kept as an Excalidraw drawing — edit it in the whiteboard editor.'] } };
  }
  if (/\.(drawio|xml)(\.(png|svg))?$|\.drawio\.(png|svg)$/.test(name) || buf.toString('utf8', 0, 4000).includes('<mxfile') || buf.toString('utf8', 0, 4000).includes('<mxGraphModel')) {
    const pages = parseDrawio(buf);
    const pi = Math.min(Math.max(input.page ?? 0, 0), Math.max(pages.length - 1, 0));
    const page = pages[pi];
    if (!page || (!page.nodes.length && !page.edges.length)) throw new ImportError('The draw.io page is empty (or only has images) — nothing to import');
    const r = irToMermaid(page);
    if (pages.length > 1) r.fidelity.notes.push(`Imported page ${pi + 1} of ${pages.length} ("${page.name}") — import again with another page for the rest.`);
    return { format: 'MERMAID', type: r.type, source: r.mermaid, title: pages.length > 1 ? `${title} — ${page.name}` : title, fidelity: r.fidelity, pages: pages.map((p) => p.name) };
  }
  const { mermaid, blocks } = extractMermaid(buf.toString('utf8'));
  return { format: 'MERMAID', type: typeFromMermaid(mermaid), source: mermaid, title, fidelity: { kept: 1, merged: [], dropped: [], notes: blocks > 1 ? [`The file has ${blocks} Mermaid blocks — imported the first one.`] : [] } };
}
