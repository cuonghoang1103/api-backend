/**
 * CT Work — CTW đợt 6b (11/10/2026) SWR-3 "SRS chuyên sâu": MÔ HÌNH PHÂN TÍCH dựng THẲNG từ dữ liệu (phần THUẦN — không DB,
 * không LLM; test ở swr6b.test.ts). Wiegers & Beatty ch.5 (context diagram), ch.12 (DFD, state diagram, event-response
 * table, feature tree) — cùng nguyên tắc "chính xác, không bịa" của diagramGen.ts:
 *
 *   CONTEXT       DFD mức 0: MỘT tiến trình (hệ thống) ở giữa, thực thể ngoài = actor (người dùng trái, hệ thống ngoài phải),
 *                 luồng vào = UC actor khởi phát (hoặc cấu trúc dữ liệu UC nhắc tới), luồng ra = UC actor tham gia phụ.
 *   DFD1          DFD mức 1: mỗi feature trong phạm vi = một tiến trình n.0, kho dữ liệu D1… = cấu trúc Data Dictionary mà
 *                 UC của feature nhắc tới, thực thể ngoài = actor của các UC đó.
 *   STATE         sơ đồ trạng thái của một thực thể: trạng thái = "Values" của phần tử DD (vd "Order Status"), chuyển = UC
 *                 có tiền điều kiện nhắc trạng thái A và hậu điều kiện nhắc trạng thái B (nhãn = UC). Không dò được chuyển nào
 *                 ⇒ nối theo thứ tự Values và GHI RÕ là giả định.
 *   FEATURE_TREE  hệ thống → FE-n → UC thuộc feature (cây chức năng ch.5).
 *   EVENT_RESPONSE bảng sự kiện–phản hồi: mỗi UC = một sự kiện (trigger), loại Business / Signal / Temporal, trạng thái hệ
 *                 thống trước (tiền điều kiện), phản hồi (hậu điều kiện / bước cuối).
 * Thiếu dữ liệu nguồn ⇒ hàm trả `missing` (service đổi thành 422 WORK_DIAGRAM_NO_SOURCE song ngữ như Diagram Studio).
 *
 * Phong cách diagram-design (MIT, © Cathryn Lavery): một tiêu điểm, nhãn ngắn, không trang trí thừa; tiến trình hình tròn,
 * thực thể ngoài hình chữ nhật, kho dữ liệu hình trụ (ký hiệu Yourdon/DeMarco gần nhất Mermaid vẽ được).
 */

import { mmId, mmLabel } from './diagram.js';
import type { BuiltDiagram } from './diagramGen.js';
import { parseNormalFlow } from './diagramGen.js';
import type { ActorLite, UseCaseLite } from './srs.js';
import { ucKey } from './srs.js';
import type { DataElementLite, FeatureLinkLite, FeatureLite } from './swr.js';
import { featureUseCases } from './swr.js';

export const MODEL_KINDS = ['CONTEXT', 'DFD1', 'STATE', 'ACTIVITY', 'FEATURE_TREE'] as const;
export type ModelKind = (typeof MODEL_KINDS)[number];
/** Loại sơ đồ Diagram Studio của từng mô hình. */
export const MODEL_DIAGRAM_TYPE: Record<ModelKind, 'DATA_FLOW' | 'STATE' | 'ACTIVITY' | 'FLOWCHART'> = {
  CONTEXT: 'DATA_FLOW', DFD1: 'DATA_FLOW', STATE: 'STATE', ACTIVITY: 'ACTIVITY', FEATURE_TREE: 'FLOWCHART',
};
export const MODEL_LABEL: Record<ModelKind, string> = {
  CONTEXT: 'Context diagram (DFD level 0)', DFD1: 'Data flow diagram (level 1)', STATE: 'State diagram', ACTIVITY: 'Activity diagram', FEATURE_TREE: 'Feature tree',
};

/** Thiếu dữ liệu: câu EN/VI + chỗ cần mở. */
export interface Missing { missing: { en: string; vi: string; fix: 'requirements' | 'wiegers' } }
export const isMissing = (x: unknown): x is Missing => !!x && typeof x === 'object' && 'missing' in (x as object);
const miss = (en: string, vi: string, fix: Missing['missing']['fix'] = 'requirements'): Missing => ({ missing: { en, vi, fix } });

const fm = (title: string) => `---\ntitle: "${mmLabel(title, 160)}"\n---`;
const live = (ucs: UseCaseLite[]) => ucs.filter((u) => u.status !== 'PROPOSED').sort((a, b) => a.number - b.number);
const listLabel = (xs: string[], max = 3) => (xs.length <= max ? xs.join(', ') : `${xs.slice(0, max).join(', ')} +${xs.length - max}`);
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Cấu trúc DD (kind STRUCTURE) mà luồng/điều kiện của UC nhắc tới (đúng cụm từ, có thể số nhiều). */
export function structuresOf(uc: UseCaseLite, elements: DataElementLite[]): DataElementLite[] {
  const text = [uc.description, uc.trigger, uc.preconditions, uc.normalFlow, uc.alternativeFlows, uc.exceptionFlows, uc.postconditions].filter(Boolean).join('\n');
  return elements.filter((e) => e.kind === 'STRUCTURE' && new RegExp(`(?<![\\p{L}\\p{N}])${escRe(e.name)}(?:e?s)?(?![\\p{L}\\p{N}])`, 'iu').test(text));
}

// ─── CONTEXT (DFD mức 0) ─────────────────────────────────────────

export function contextDiagram(d: { systemName: string; actors: ActorLite[]; useCases: UseCaseLite[]; dataElements: DataElementLite[] }): BuiltDiagram | Missing {
  const ucs = live(d.useCases);
  if (!ucs.length) return miss('A context diagram needs actors and use cases — add them on Requirements › Use cases first.', 'Sơ đồ ngữ cảnh cần actor và use case — thêm ở Requirements › Use cases trước.');
  const used = new Set<number>();
  for (const u of ucs) { if (u.primaryActorId) used.add(u.primaryActorId); u.secondaryActorIds.forEach((x) => used.add(x)); }
  const actors = d.actors.filter((a) => used.has(a.id)).sort((a, b) => a.position - b.position || a.id - b.id);
  if (!actors.length) return miss('No use case has an actor yet — set the primary actor of each use case on Requirements › Use cases.', 'Chưa use case nào có actor — đặt actor chính cho từng use case ở Requirements › Use cases.');
  const lines = [fm(`${d.systemName} — context diagram (DFD level 0)`), 'flowchart LR'];
  const people = actors.filter((a) => a.kind !== 'SYSTEM');
  const systems = actors.filter((a) => a.kind === 'SYSTEM');
  for (const a of people) lines.push(`  E${a.id}["${mmLabel(a.name, 50)}"]`);
  lines.push(`  SYS(("0<br/>${mmLabel(d.systemName, 50)}"))`);
  for (const a of systems) lines.push(`  E${a.id}["${mmLabel(a.name, 50)}"]`);
  const flows: string[] = [];
  let flowCount = 0;
  for (const a of actors) {
    const starts = ucs.filter((u) => u.primaryActorId === a.id);
    const joins = ucs.filter((u) => u.secondaryActorIds.includes(a.id));
    // Luồng dữ liệu đặt tên bằng DỮ LIỆU khi DD có (Wiegers: mũi tên là dữ liệu, không phải hành động); chưa có ⇒ tên UC.
    const label = (list: UseCaseLite[]) => {
      const data = [...new Set(list.flatMap((u) => structuresOf(u, d.dataElements).map((e) => e.name)))];
      return mmLabel(listLabel(data.length ? data : list.map((u) => `${ucKey(u.number)} ${u.name}`)), 90);
    };
    // Actor khởi phát UC ⇒ dữ liệu VÀO hệ thống; actor tham gia phụ (người hay hệ thống ngoài) ⇒ hệ thống gửi dữ liệu RA.
    if (starts.length) { flows.push(`  E${a.id} -->|"${label(starts)}"| SYS`); flowCount++; }
    if (joins.length) { flows.push(`  SYS -->|"${label(joins)}"| E${a.id}`); flowCount++; }
  }
  lines.push(...flows);
  lines.push('  classDef process fill:#eef0fb,stroke:#4f5bd5,stroke-width:1.5px,color:#1a1a17,font-weight:600', '  class SYS process');
  lines.push('  classDef external fill:transparent,stroke:#1a1a17,stroke-width:1px', `  class ${actors.map((a) => `E${a.id}`).join(',')} external`);
  return {
    type: 'DATA_FLOW', title: `Context diagram — ${d.systemName}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'srs', label: `Requirements: ${actors.length} actor(s), ${ucs.length} use case(s)${d.dataElements.some((e) => e.kind === 'STRUCTURE') ? ', Data Dictionary structures' : ''}` }],
    allowed: [d.systemName, ...actors.map((a) => a.name)], structural: [/^SYS$/],
    assumptions: [], notes: flowCount ? [] : ['No data flows: no use case links an actor to the system.'],
  };
}

// ─── DFD mức 1 ───────────────────────────────────────────────────

export function dfdLevel1(d: { systemName: string; actors: ActorLite[]; useCases: UseCaseLite[]; features: FeatureLite[]; featureLinks: FeatureLinkLite[]; dataElements: DataElementLite[] }): BuiltDiagram | Missing {
  const feats = d.features.filter((f) => f.scope !== 'OUT').sort((a, b) => a.number - b.number);
  if (!feats.length) return miss('A level-1 DFD has one process per feature — add features (FE-n) on Wiegers › Features first.', 'DFD mức 1 vẽ mỗi feature một tiến trình — thêm feature (FE-n) ở Wiegers › Features trước.', 'wiegers');
  const ucs = live(d.useCases);
  const feUc = featureUseCases(d.features, d.featureLinks, ucs);
  if (!feats.some((f) => (feUc.get(f.id) ?? []).length)) return miss('No feature has a use case yet — link use cases to features (link #1) first.', 'Chưa feature nào có use case — gắn use case cho feature (liên kết #1) trước.', 'wiegers');
  const structures = d.dataElements.filter((e) => e.kind === 'STRUCTURE').sort((a, b) => a.position - b.position || a.id - b.id);
  const storeId = new Map(structures.map((e, i) => [e.id, i + 1]));
  const lines = [fm(`${d.systemName} — data flow diagram (level 1)`), 'flowchart LR'];
  const usedActors = new Set<number>();
  const usedStores = new Set<number>();
  const edges: string[] = [];
  const procIds: string[] = [];
  const notes: string[] = [];
  feats.forEach((f, i) => {
    const pid = `P${i + 1}`;
    const fucs = (feUc.get(f.id) ?? []).map((id) => ucs.find((u) => u.id === id)).filter((u): u is UseCaseLite => !!u);
    procIds.push(pid);
    lines.push(`  ${pid}(("${i + 1}.0<br/>${mmLabel(f.name, 40)}"))`);
    if (!fucs.length) notes.push(`${f.name} (FE-${f.number}) has no use case — drawn without flows.`);
    const byActor = new Map<number, { in: UseCaseLite[]; out: UseCaseLite[] }>();
    for (const u of fucs) {
      if (u.primaryActorId) { const x = byActor.get(u.primaryActorId) ?? { in: [], out: [] }; x.in.push(u); byActor.set(u.primaryActorId, x); }
      for (const s of u.secondaryActorIds) { const x = byActor.get(s) ?? { in: [], out: [] }; x.out.push(u); byActor.set(s, x); }
    }
    for (const [aid, x] of byActor) {
      if (!d.actors.some((a) => a.id === aid)) continue;
      usedActors.add(aid);
      if (x.in.length) edges.push(`  E${aid} -->|"${mmLabel(listLabel(x.in.map((u) => ucKey(u.number))), 60)}"| ${pid}`);
      if (x.out.length) edges.push(`  ${pid} -->|"${mmLabel(listLabel(x.out.map((u) => ucKey(u.number))), 60)}"| E${aid}`);
    }
    const stores = [...new Map(fucs.flatMap((u) => structuresOf(u, structures)).map((e) => [e.id, e])).values()];
    for (const e of stores) {
      usedStores.add(e.id);
      edges.push(`  ${pid} <-->|"${mmLabel(e.name, 40)}"| DS${storeId.get(e.id)}`);
    }
  });
  const actors = d.actors.filter((a) => usedActors.has(a.id)).sort((a, b) => a.position - b.position || a.id - b.id);
  for (const a of actors) lines.push(`  E${a.id}["${mmLabel(a.name, 50)}"]`);
  for (const e of structures.filter((x) => usedStores.has(x.id))) lines.push(`  DS${storeId.get(e.id)}[("D${storeId.get(e.id)} ${mmLabel(e.name, 40)}")]`);
  lines.push(...edges);
  lines.push('  classDef process fill:#eef0fb,stroke:#4f5bd5,stroke-width:1.5px,color:#1a1a17', `  class ${procIds.join(',')} process`);
  if (actors.length) lines.push('  classDef external fill:transparent,stroke:#1a1a17,stroke-width:1px', `  class ${actors.map((a) => `E${a.id}`).join(',')} external`);
  if (!usedStores.size) notes.push('No data store: no use case of these features mentions a Data Dictionary structure by name.');
  return {
    type: 'DATA_FLOW', title: `Data flow diagram (level 1) — ${d.systemName}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'srs', label: `Features: ${feats.length}, use cases: ${ucs.length}, Data Dictionary structures: ${usedStores.size}` }],
    allowed: [d.systemName, ...feats.map((f) => f.name), ...actors.map((a) => a.name), ...structures.map((e) => e.name)],
    structural: [/^P\d+$/, /^DS\d+$/], assumptions: [], notes,
  };
}

// ─── STATE của một thực thể (từ Values của DD) ───────────────────

/** "Pending, Approved | Rejected; Fulfilled" ⇒ ['Pending','Approved','Rejected','Fulfilled'] (bỏ trùng, giữ thứ tự). */
export function parseStateValues(values: string | null | undefined): string[] {
  const raw = String(values ?? '').replace(/^\s*(?:one of|values?|trạng thái)\s*:?\s*/i, '');
  const parts = raw.split(/\s*(?:[,;|/\n]|\s+or\s+|\s+hoặc\s+|→|->)\s*/i).map((x) => x.replace(/^["'“”]+|["'“”.]+$/g, '').trim()).filter((x) => x && x.length <= 60);
  return [...new Map(parts.map((p) => [p.toLowerCase(), p])).values()];
}

/** Phần tử DD có thể làm nguồn sơ đồ trạng thái: nguyên thuỷ, ≥ 2 giá trị, tên gợi "status/state/trạng thái" trước. */
export function stateCandidates(elements: DataElementLite[]): Array<{ name: string; values: string[] }> {
  return elements.filter((e) => e.kind !== 'STRUCTURE').map((e) => ({ name: e.name, values: parseStateValues(e.values) })).filter((x) => x.values.length >= 2)
    .sort((a, b) => Number(/status|state|trạng thái|tình trạng/i.test(b.name)) - Number(/status|state|trạng thái|tình trạng/i.test(a.name)) || a.name.localeCompare(b.name));
}

export function entityStateDiagram(d: { element: string; elements: DataElementLite[]; useCases: UseCaseLite[] }): BuiltDiagram | Missing {
  const cands = stateCandidates(d.elements);
  if (!cands.length) {
    return miss('A state diagram needs a Data Dictionary element that lists its states as Values (e.g. "Order Status" = "Pending, Approved, Shipped") — add one on Wiegers › Data dictionary first.',
      'Sơ đồ trạng thái cần một phần tử Data Dictionary liệt kê trạng thái ở cột Values (vd "Order Status" = "Pending, Approved, Shipped") — thêm ở Wiegers › Data dictionary trước.', 'wiegers');
  }
  const pick = cands.find((c) => c.name.toLowerCase() === d.element.trim().toLowerCase()) ?? (d.element.trim() ? null : cands[0]);
  if (!pick) return miss(`"${d.element}" has no list of values in the Data Dictionary — choose one of: ${cands.map((c) => c.name).join(', ')}.`, `"${d.element}" không có danh sách giá trị trong Data Dictionary — chọn một trong: ${cands.map((c) => c.name).join(', ')}.`, 'wiegers');
  const states = pick.values;
  const ids = new Map(states.map((s, i) => [s.toLowerCase(), `S${i + 1}`]));
  const find = (text: string | null | undefined) => states.filter((s) => new RegExp(`(?<![\\p{L}\\p{N}])${escRe(s)}(?![\\p{L}\\p{N}])`, 'iu').test(String(text ?? '')));
  const transitions: Array<{ from: string; to: string; label: string }> = [];
  for (const u of live(d.useCases)) {
    const pre = find(u.preconditions);
    const post = find(u.postconditions);
    for (const a of pre) for (const b of post) if (a.toLowerCase() !== b.toLowerCase()) transitions.push({ from: a, to: b, label: `${ucKey(u.number)} ${u.name}` });
    // Không có tiền điều kiện mang trạng thái nhưng hậu điều kiện có ⇒ UC TẠO thực thể ở trạng thái đó (từ [*]).
    if (!pre.length && post.length === 1 && !transitions.some((t) => t.to.toLowerCase() === post[0].toLowerCase())) transitions.push({ from: '[*]', to: post[0], label: `${ucKey(u.number)} ${u.name}` });
  }
  const entity = pick.name.replace(/\s*(status|state|trạng thái|tình trạng)\s*$/i, '').trim() || pick.name;
  const lines = [fm(`${entity} — state diagram (states from Data Dictionary "${pick.name}")`), 'stateDiagram-v2', '  direction LR'];
  for (const s of states) lines.push(`  state "${mmLabel(s, 40)}" as ${ids.get(s.toLowerCase())}`);
  const notes: string[] = [];
  const assumptions: string[] = [];
  const seen = new Set<string>();
  if (transitions.length) {
    const hasStart = transitions.some((t) => t.from === '[*]');
    if (!hasStart) lines.push(`  [*] --> ${ids.get(states[0].toLowerCase())}`);
    for (const t of transitions) {
      const f = t.from === '[*]' ? '[*]' : ids.get(t.from.toLowerCase())!;
      const k = `${f}>${ids.get(t.to.toLowerCase())}>${t.label}`;
      if (seen.has(k)) continue;
      seen.add(k);
      lines.push(`  ${f} --> ${ids.get(t.to.toLowerCase())} : ${mmLabel(t.label, 50).replace(/:/g, ' ')}`);
    }
    const reached = new Set(transitions.flatMap((t) => [t.from.toLowerCase(), t.to.toLowerCase()]));
    const lonely = states.filter((s, i) => i > 0 && !reached.has(s.toLowerCase()));
    if (lonely.length) notes.push(`No use case moves the ${entity.toLowerCase()} into or out of: ${lonely.join(', ')} — mention these states in a use case's preconditions/postconditions.`);
  } else {
    lines.push(`  [*] --> ${ids.get(states[0].toLowerCase())}`);
    for (let i = 0; i + 1 < states.length; i++) lines.push(`  ${ids.get(states[i].toLowerCase())} --> ${ids.get(states[i + 1].toLowerCase())}`);
    assumptions.push(`No use case names these states in its preconditions and postconditions — the transitions follow the order of the Values list (assumed).`);
  }
  const outgoing = new Set(transitions.filter((t) => t.from !== '[*]').map((t) => t.from.toLowerCase()));
  const finals = transitions.length ? states.filter((s) => !outgoing.has(s.toLowerCase()) && transitions.some((t) => t.to.toLowerCase() === s.toLowerCase())) : [states[states.length - 1]];
  for (const s of finals) lines.push(`  ${ids.get(s.toLowerCase())} --> [*]`);
  return {
    type: 'STATE', title: `State diagram — ${entity}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'dictionary', label: `Data Dictionary "${pick.name}": ${states.length} state(s); ${transitions.length} transition(s) from use case pre/postconditions` }],
    allowed: states, structural: [], assumptions, notes,
  };
}

/** Chủ thể của một sơ đồ trạng thái (tên phần tử DD) — để mỗi thực thể một mô hình. */
export const stateSubject = (element: string) => element.trim().slice(0, 160);

// ─── FEATURE TREE ────────────────────────────────────────────────

export function featureTree(d: { systemName: string; features: FeatureLite[]; featureLinks: FeatureLinkLite[]; useCases: UseCaseLite[] }): BuiltDiagram | Missing {
  const feats = d.features.filter((f) => f.scope !== 'OUT').sort((a, b) => a.number - b.number);
  if (!feats.length) return miss('A feature tree needs features (FE-n) — add them on Wiegers › Features first.', 'Cây chức năng cần feature (FE-n) — thêm ở Wiegers › Features trước.', 'wiegers');
  const ucs = live(d.useCases);
  const feUc = featureUseCases(d.features, d.featureLinks, ucs);
  const lines = [fm(`${d.systemName} — feature tree`), 'flowchart LR', `  ROOT["${mmLabel(d.systemName, 50)}"]`];
  const leaves: string[] = [];
  for (const f of feats) {
    lines.push(`  F${f.number}["FE-${f.number} ${mmLabel(f.name, 50)}"]`, `  ROOT --> F${f.number}`);
    for (const id of feUc.get(f.id) ?? []) {
      const u = ucs.find((x) => x.id === id);
      if (!u) continue;
      const nid = `U${f.number}_${u.number}`;
      leaves.push(nid);
      lines.push(`  ${nid}["${ucKey(u.number)} ${mmLabel(u.name, 50)}"]`, `  F${f.number} --> ${nid}`);
    }
  }
  // Không dùng hình viên thuốc ([…]) cho UC: theme CT Work tô path của nó thành khối đen. Màu nền cố định ⇒ chữ cố định.
  lines.push('  classDef root fill:#4f5bd5,stroke:#4f5bd5,color:#ffffff,font-weight:600', '  class ROOT root');
  lines.push('  classDef feature fill:#eef0fb,stroke:#4f5bd5,color:#1a1a17', `  class ${feats.map((f) => `F${f.number}`).join(',')} feature`);
  if (leaves.length) lines.push('  classDef uc fill:#ffffff,stroke:#cfccc4,color:#1a1a17', `  class ${leaves.join(',')} uc`);
  const empty = feats.filter((f) => !(feUc.get(f.id) ?? []).length);
  return {
    type: 'FLOWCHART', title: `Feature tree — ${d.systemName}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'srs', label: `Features: ${feats.length} in scope, ${leaves.length} use-case leaf/leaves` }],
    allowed: [d.systemName, ...feats.map((f) => `FE-${f.number} ${f.name}`), ...ucs.map((u) => `${ucKey(u.number)} ${u.name}`)],
    structural: [/^ROOT$/], assumptions: [],
    notes: empty.length ? [`No use case yet under: ${empty.map((f) => `FE-${f.number}`).join(', ')}.`] : [],
  };
}

// ─── EVENT–RESPONSE TABLE ────────────────────────────────────────

export type EventType = 'BUSINESS' | 'SIGNAL' | 'TEMPORAL';
export interface EventRow { ref: string; event: string; type: EventType; state: string; response: string; actor: string | null }

const TEMPORAL = /(?<![\p{L}])(every|each (day|week|month|night|hour)|daily|weekly|monthly|nightly|hourly|at \d{1,2}(:\d{2})?|scheduled|end of (the )?(day|week|month)|hằng (ngày|tuần|tháng)|hàng (ngày|tuần|tháng)|mỗi (ngày|tuần|tháng|giờ|đêm)|định kỳ|lúc \d{1,2}(h|:\d{2}))(?![\p{L}])/iu;
const firstLine = (s: string | null | undefined) => String(s ?? '').split(/\n+/).map((x) => x.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim()).filter(Boolean)[0] ?? '';

/** Mỗi UC (không phải đề xuất) = một sự kiện. Sự kiện theo giờ ⇒ TEMPORAL; actor chính là hệ thống ngoài ⇒ SIGNAL. */
export function eventResponseTable(d: { actors: ActorLite[]; useCases: UseCaseLite[] }): EventRow[] {
  return live(d.useCases).map((u) => {
    const actor = d.actors.find((a) => a.id === u.primaryActorId) ?? null;
    const trig = (u.trigger ?? '').trim();
    const type: EventType = TEMPORAL.test(`${trig} ${u.description ?? ''}`) ? 'TEMPORAL' : actor?.kind === 'SYSTEM' ? 'SIGNAL' : 'BUSINESS';
    const steps = parseNormalFlow(u.normalFlow);
    const response = (u.postconditions ?? '').trim() ? (u.postconditions ?? '').trim().replace(/\s*\n\s*/g, '; ') : steps.length ? steps[steps.length - 1].text : '';
    return {
      ref: ucKey(u.number),
      event: trig || `${actor?.name ?? 'User'} requests to ${u.name.charAt(0).toLowerCase()}${u.name.slice(1)}`,
      type, state: firstLine(u.preconditions) || '—', response: response || '—', actor: actor?.name ?? null,
    };
  });
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = { BUSINESS: 'Business event', SIGNAL: 'Signal event', TEMPORAL: 'Temporal event' };

/** Id an toàn cho chủ thể (dùng ở khoá subject của work_srs_models khi cần). */
export const subjectKey = (s: string) => mmId(s, 'X');
