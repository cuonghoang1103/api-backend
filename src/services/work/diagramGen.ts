/**
 * CT Work — CTW Diagram (10/10/2026): DỰNG SƠ ĐỒ TỪ DỮ LIỆU — phần THUẦN (không DB, không LLM; test ở diagrams.test.ts).
 *
 * Nguyên tắc "chính xác, không bịa": cái gì DỮ LIỆU đã nói rõ thì mã dựng THẲNG (không qua model):
 *   USE_CASE     actor + UC (đặc tả đợt 4)              SCREEN_FLOW  màn + mũi tên (Screens & flow)
 *   ACTIVITY     các bước normal/alt/exception của UC   STATE        trạng thái + chuyển của workflow dự án / enum *Status
 *   ERD          prisma/schema.prisma · Flyway SQL · JPA @Entity (theo thứ tự ưu tiên nguồn)
 *   CLASS        lớp Java/TypeScript trong repo         DEPLOYMENT   docker-compose.yml
 *   SEQUENCE     bản NỀN rút thẳng từ luồng UC (ai làm gì, alt/opt/break đúng bước rẽ) — model chỉ chuốt lời trên nền này.
 * Mỗi bản dựng trả `sources` (dùng nguồn nào — ghi lên sơ đồ) và `allowed` (tên hợp lệ cho bước kiểm).
 *
 * Phong cách lấy từ diagram-design (MIT, © Cathryn Lavery — https://github.com/cathrynlavery/diagram-design): một tiêu
 * điểm, ≤ 9 nút mỗi sơ đồ (quá thì tách theo feature), nhãn ngắn, không trang trí thừa.
 */

import {
  diagramKey, mmId, mmLabel, mmText, type DiagramType,
} from './diagram.js';
import type { ActorLite, RuleLite, ScreenLinkLite, ScreenLite, UseCaseLite } from './srs.js';

export interface BuiltDiagram {
  type: DiagramType;
  title: string;
  mermaid: string;
  /** Nguồn đã dùng — hiện trên sơ đồ (front-matter title) và ở origin.sources. */
  sources: Array<{ kind: string; label: string; ref?: string | null }>;
  /** Tên hợp lệ cho bước kiểm "mọi thực thể có nguồn". */
  allowed: string[];
  /** Id cấu trúc không cần đối chiếu. */
  structural?: Array<string | RegExp>;
  assumptions: string[];
  /** Ghi chú cho người duyệt (cắt bớt, thiếu dữ liệu…). */
  notes: string[];
  feature?: string | null;
}

const fm = (title: string) => `---\ntitle: "${mmLabel(title, 160)}"\n---`;

// ─── UC: đọc luồng ───────────────────────────────────────────────

export interface FlowStep { id: string; text: string }
export interface Branch { at: number; code: string; kind: 'ALT' | 'EXC'; title: string; steps: FlowStep[]; returnTo: number | null }

const stripNo = (s: string) => s.replace(/^\s*(?:[-*•]\s*)?(?:\d+[A-Z]?(?:\.\d+)*[.)]?|[A-Z]\d*[.)])\s+/, '').trim();

/** Luồng chính "1. …" mỗi dòng một bước. Dòng không đánh số nối vào bước trước. */
export function parseNormalFlow(text: string | null | undefined): FlowStep[] {
  const out: FlowStep[] = [];
  for (const raw of String(text ?? '').replace(/\r\n?/g, '\n').split('\n')) {
    const l = raw.trim();
    if (!l || /^none\.?$/i.test(l)) continue;
    const m = /^(?:step\s*)?(\d{1,3})[.):]?\s+(.+)$/i.exec(l);
    if (m) out.push({ id: m[1], text: m[2].trim() });
    else if (out.length) out[out.length - 1].text += ` ${stripNo(l)}`;
    else out.push({ id: String(out.length + 1), text: stripNo(l) });
  }
  return out;
}

const RETURN_RE = /(?:return(?:s)?|go(?:es)? back|back|continue[sd]?|resume[sd]?|quay (?:lại|về)|trở lại|tiếp tục)\s+(?:to\s+|at\s+|from\s+|with\s+)?(?:the\s+)?(?:normal flow\s+)?(?:step|bước)\s*(\d{1,3})/i;

/**
 * Luồng thay thế "2A. Tiêu đề" / ngoại lệ "3E. Tiêu đề" (hoặc "E1. …" / "A1 at step 2") — các dòng sau là bước của nhánh
 * ("2A.1 …", "- …"). "Return to step 3" / "quay lại bước 3" ⇒ returnTo.
 */
export function parseBranches(text: string | null | undefined, kind: 'ALT' | 'EXC'): Branch[] {
  const out: Branch[] = [];
  const letter = kind === 'ALT' ? '[A-DF-Z]' : 'E';
  const head = new RegExp(`^(\\d{1,3})(${letter}\\d?)[.):]?\\s+(.+)$`, 'i');
  const head2 = new RegExp(`^(${kind === 'ALT' ? 'A' : 'E'})(\\d{1,2})[.):]?\\s+(.+?)(?:\\s*\\((?:at\\s+)?step\\s*(\\d{1,3})\\))?$`, 'i');
  for (const raw of String(text ?? '').replace(/\r\n?/g, '\n').split('\n')) {
    const l = raw.trim();
    if (!l || /^none\.?$/i.test(l)) continue;
    const sub = new RegExp(`^\\d{1,3}${letter}\\d?\\.\\d+`, 'i').test(l);
    const h = !sub ? head.exec(l) : null;
    if (h) { out.push({ at: Number(h[1]), code: `${h[1]}${h[2].toUpperCase()}`, kind, title: h[3].replace(/[:.]\s*$/, '').trim(), steps: [], returnTo: null }); continue; }
    const h2 = !sub && !out.length ? head2.exec(l) : null;
    if (h2) { out.push({ at: Number(h2[4] ?? 0), code: `${h2[1].toUpperCase()}${h2[2]}`, kind, title: h2[3].trim(), steps: [], returnTo: null }); continue; }
    if (!out.length) { out.push({ at: 0, code: kind === 'ALT' ? 'A' : 'E', kind, title: stripNo(l), steps: [], returnTo: null }); continue; }
    const b = out[out.length - 1];
    const t = stripNo(l);
    const r = RETURN_RE.exec(t);
    if (r) b.returnTo = Number(r[1]);
    b.steps.push({ id: `${b.code}.${b.steps.length + 1}`, text: t });
  }
  for (const b of out) {
    const r = RETURN_RE.exec(b.title);
    if (r && b.returnTo === null) b.returnTo = Number(r[1]);
  }
  return out;
}

// ─── Ai làm bước này ─────────────────────────────────────────────

export interface Performer { kind: 'ACTOR' | 'SYSTEM'; actorId?: number; name: string }

const SYSTEM_WORDS = /^(?:the\s+)?(?:system|hệ thống|server|app(?:lication)?|ứng dụng|website|web app)\b/i;
const word = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Bước bắt đầu bằng tên actor ⇒ actor đó; "System/Hệ thống/<tên hệ thống>" ⇒ hệ thống; còn lại ⇒ actor chính. */
export function performerOf(step: string, actors: ActorLite[], primary: ActorLite | null, systemName: string): Performer {
  const s = step.trim().replace(/^(?:the|then|and|next|sau đó|rồi)\s+/i, '');
  if (SYSTEM_WORDS.test(s) || (systemName && word(s).startsWith(word(systemName)))) return { kind: 'SYSTEM', name: systemName };
  const sorted = [...actors].sort((a, b) => b.name.length - a.name.length);
  for (const a of sorted) {
    const n = word(a.name);
    const w = word(s);
    if (w.startsWith(n) || w.startsWith(`${n}s `) || w.startsWith(`the ${n}`)) return a.kind === 'SYSTEM' ? { kind: 'ACTOR', actorId: a.id, name: a.name } : { kind: 'ACTOR', actorId: a.id, name: a.name };
  }
  if (/^(user|người dùng|actor)\b/i.test(s) && primary) return { kind: 'ACTOR', actorId: primary.id, name: primary.name };
  if (/^(display|show|return|send|notif|save|store|validate|check|verif|calculat|generat|redirect|creat|updat|delet|load|hiển thị|gửi|lưu|kiểm tra|thông báo|trả về|tạo|cập nhật|xoá|xóa)/i.test(s)) return { kind: 'SYSTEM', name: systemName };
  return primary ? { kind: 'ACTOR', actorId: primary.id, name: primary.name } : { kind: 'SYSTEM', name: systemName };
}

/** Actor KHÁC người làm được nhắc trong câu (vd "System emails the Lab Manager") ⇒ người nhận. */
function mentionedActor(step: string, actors: ActorLite[], not: number | undefined): ActorLite | null {
  const w = ` ${word(step)} `;
  const sorted = [...actors].sort((a, b) => b.name.length - a.name.length);
  for (const a of sorted) if (a.id !== not && w.includes(` ${word(a.name)}`)) return a;
  return null;
}

const dropSubject = (s: string, name: string) => {
  const t = s.trim().replace(/^(?:the\s+)/i, '');
  const re = new RegExp(`^(?:the\\s+)?${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i');
  const out = t.replace(re, '').replace(SYSTEM_WORDS, '').trim();
  return out ? out[0].toUpperCase() + out.slice(1) : t;
};

const isReply = (s: string) => /^(display|show|return|notif|redirect|inform|respond|present|render|hiển thị|thông báo|trả về|chuyển)/i.test(dropSubject(s, ''));

// ─── SEQUENCE từ UC (bản nền) ────────────────────────────────────

export interface UcContext {
  uc: UseCaseLite;
  actors: ActorLite[];
  rules: RuleLite[];
  systemName: string;
}

/**
 * Bản nền sequence của MỘT UC. Participant: actor chính, actor phụ, hệ thống (tên dự án). Mỗi bước luồng chính một mũi tên;
 * nhánh rẽ ở bước k đặt NGAY SAU mũi tên của bước k: một nhánh ⇒ `opt`, nhiều nhánh cùng bước ⇒ `alt … else …`, ngoại lệ ⇒
 * `break` (dừng luồng). BR nhắc trong bước ⇒ `Note over` hệ thống; BR của UC không nhắc ở bước nào ⇒ một Note ở đầu.
 */
export function sequenceFromUc(c: UcContext): BuiltDiagram {
  const { uc, actors, rules, systemName } = c;
  const primary = actors.find((a) => a.id === uc.primaryActorId) ?? null;
  const secondary = uc.secondaryActorIds.map((id) => actors.find((a) => a.id === id)).filter((a): a is ActorLite => !!a);
  const ucActors = [primary, ...secondary].filter((a): a is ActorLite => !!a);
  const pid = new Map<number, string>();
  ucActors.forEach((a, i) => pid.set(a.id, i === 0 && primary ? 'U' : `A${i}`));
  const SYS = 'SYS';
  const lines: string[] = [fm(`${uc.name} (UC-${String(uc.number).padStart(2, '0')}) — sequence`), 'sequenceDiagram', '  autonumber'];
  for (const a of ucActors) lines.push(`  ${a.kind === 'SYSTEM' ? 'participant' : 'actor'} ${pid.get(a.id)} as ${mmLabel(a.name, 60)}`);
  lines.push(`  participant ${SYS} as ${mmLabel(systemName, 60)}`);
  const ruleBy = new Map(rules.map((r) => [r.number, r]));
  const brIn = (t: string) => [...t.matchAll(/(?<![A-Za-z0-9])BR-?(\d{1,4})(?!\d)/gi)].map((m) => Number(m[1])).filter((n) => ruleBy.has(n));
  const usedBr = new Set<number>();

  const notes: string[] = [];
  const unmentioned = uc.ruleNumbers.filter((n) => ruleBy.has(n) && !`${uc.normalFlow} ${uc.alternativeFlows} ${uc.exceptionFlows}`.match(new RegExp(`BR-?0*${n}(?!\\d)`, 'i')));
  if (unmentioned.length) lines.push(`  Note over ${pid.get(primary?.id ?? -1) ?? SYS},${SYS}: Rules ${unmentioned.map((n) => `BR-${String(n).padStart(2, '0')}`).join(', ')}`);
  unmentioned.forEach((n) => usedBr.add(n));

  const arrow = (stepText: string, indent: string): string[] => {
    const p = performerOf(stepText, ucActors.length ? ucActors : actors, primary, systemName);
    const out: string[] = [];
    if (p.kind === 'ACTOR' && p.actorId !== undefined && pid.has(p.actorId)) {
      out.push(`${indent}${pid.get(p.actorId)}->>${SYS}: ${mmText(dropSubject(stepText, p.name))}`);
    } else if (p.kind === 'ACTOR') {
      out.push(`${indent}${pid.get(primary?.id ?? -1) ?? SYS}->>${SYS}: ${mmText(stepText)}`);
    } else {
      const to = mentionedActor(stepText, ucActors, undefined);
      const body = mmText(dropSubject(stepText, systemName));
      if (to && pid.has(to.id)) out.push(`${indent}${SYS}-->>${pid.get(to.id)}: ${body}`);
      else if (isReply(stepText) && primary) out.push(`${indent}${SYS}-->>${pid.get(primary.id)}: ${body}`);
      else out.push(`${indent}${SYS}->>${SYS}: ${body}`);
    }
    for (const n of brIn(stepText)) {
      usedBr.add(n);
      out.push(`${indent}Note over ${SYS}: BR-${String(n).padStart(2, '0')} ${mmText(ruleBy.get(n)!.name, 60)}`);
    }
    return out;
  };

  const normal = parseNormalFlow(uc.normalFlow);
  const branches = [...parseBranches(uc.alternativeFlows, 'ALT'), ...parseBranches(uc.exceptionFlows, 'EXC')];
  if (!normal.length) notes.push('The use case has no normal flow — only the participants are drawn.');
  const byStep = new Map<number, Branch[]>();
  const loose: Branch[] = [];
  for (const b of branches) {
    if (b.at > 0 && normal.some((s) => Number(s.id) === b.at)) byStep.set(b.at, [...(byStep.get(b.at) ?? []), b]);
    else loose.push(b);
  }
  const branchBody = (b: Branch, indent: string) => {
    const out: string[] = [];
    const steps = b.steps.filter((s) => !(RETURN_RE.test(s.text) && s.text.length < 60));
    for (const s of steps) out.push(...arrow(s.text, indent));
    if (!steps.length) out.push(`${indent}Note over ${SYS}: ${mmText(b.title, 100)}`);
    if (b.returnTo) out.push(`${indent}Note over ${SYS}: Back to step ${b.returnTo}`);
    return out;
  };
  const emitGroup = (group: Branch[]) => {
    const alts = group.filter((b) => b.kind === 'ALT');
    const exc = group.filter((b) => b.kind === 'EXC');
    if (alts.length === 1) {
      lines.push(`  opt ${alts[0].code} ${mmText(alts[0].title, 80)}`, ...branchBody(alts[0], '    '), '  end');
    } else if (alts.length > 1) {
      alts.forEach((b, i) => { lines.push(`  ${i ? 'else' : 'alt'} ${b.code} ${mmText(b.title, 80)}`); lines.push(...branchBody(b, '    ')); });
      lines.push('  end');
    }
    for (const b of exc) lines.push(`  break ${b.code} ${mmText(b.title, 80)}`, ...branchBody(b, '    '), '  end');
  };
  for (const s of normal) {
    lines.push(...arrow(s.text, '  '));
    const g = byStep.get(Number(s.id));
    if (g) emitGroup(g);
  }
  if (loose.length) { notes.push(`${loose.map((b) => b.code).join(', ')} do not say which step they branch from — drawn after the normal flow.`); emitGroup(loose); }

  const allowed = [systemName, 'System', ...ucActors.map((a) => a.name)];
  return {
    type: 'SEQUENCE', title: `${uc.name} — sequence (UC-${String(uc.number).padStart(2, '0')})`, mermaid: lines.join('\n'),
    sources: [{ kind: 'use-case', label: `UC-${String(uc.number).padStart(2, '0')} ${uc.name} — actors, normal/alternative/exception flows${usedBr.size ? `, ${[...usedBr].map((n) => `BR-${String(n).padStart(2, '0')}`).join(', ')}` : ''}`, ref: `UC-${String(uc.number).padStart(2, '0')}` }],
    allowed, structural: [SYS], assumptions: [], notes, feature: uc.feature,
  };
}

/** Số nhánh (alt + exception) của UC — bước kiểm đòi đủ chừng ấy khối alt/opt/break. */
export const branchCount = (uc: Pick<UseCaseLite, 'alternativeFlows' | 'exceptionFlows'>) =>
  parseBranches(uc.alternativeFlows, 'ALT').length + parseBranches(uc.exceptionFlows, 'EXC').length;

// ─── ACTIVITY từ UC (làn theo người làm) ─────────────────────────

export function activityFromUc(c: UcContext): BuiltDiagram {
  const { uc, actors, systemName } = c;
  const primary = actors.find((a) => a.id === uc.primaryActorId) ?? null;
  const ucActors = [primary, ...uc.secondaryActorIds.map((id) => actors.find((a) => a.id === id))].filter((a): a is ActorLite => !!a);
  const normal = parseNormalFlow(uc.normalFlow);
  const branches = [...parseBranches(uc.alternativeFlows, 'ALT'), ...parseBranches(uc.exceptionFlows, 'EXC')];
  // Không vẽ làn bằng subgraph: dagre xếp cụm + cạnh xuyên cụm rất rối. Người làm hiện bằng stereotype «Tên» trên nút,
  // bước của actor tô nền nhấn nhạt (lớp actorStep), bước của hệ thống nền trắng.
  const nodes: string[] = [];
  const actorNodes: string[] = [];
  const laneOf = (t: string) => { const p = performerOf(t, ucActors.length ? ucActors : actors, primary, systemName); return p; };
  const edges: string[] = [];
  const node = (id: string, label: string, who: Performer | null, shape: 'box' | 'dec' = 'box') => {
    if (shape === 'dec') { nodes.push(`  ${id}{"${mmLabel(label, 70)}"}`); return; }
    nodes.push(`  ${id}["«${mmLabel(who?.name ?? systemName, 40)}»<br/>${mmLabel(label, 90)}"]`);
    if (who?.kind === 'ACTOR') actorNodes.push(id);
  };
  const ids = normal.map((s) => `S${s.id}`);
  normal.forEach((s, i) => { const w = laneOf(s.text); node(ids[i], `${s.id}. ${dropSubject(s.text, w.name)}`, w); });
  edges.push(`  START(( )) --> ${ids[0] ?? 'FINISH'}`);
  const byStep = new Map<number, Branch[]>();
  for (const b of branches) if (b.at) byStep.set(b.at, [...(byStep.get(b.at) ?? []), b]);
  normal.forEach((s, i) => {
    const next = ids[i + 1] ?? 'FINISH';
    const g = byStep.get(Number(s.id));
    if (!g) { edges.push(`  ${ids[i]} --> ${next}`); return; }
    const dec = `D${s.id}`;
    node(dec, g.length === 1 ? `${g[0].title}?` : 'Outcome?', null, 'dec');
    edges.push(`  ${ids[i]} --> ${dec}`, `  ${dec} -->|"otherwise"| ${next}`);
    for (const b of g) {
      const steps = b.steps.filter((x) => !(RETURN_RE.test(x.text) && x.text.length < 60));
      const bIds = steps.map((_, k) => `B${mmId(b.code)}_${k + 1}`);
      steps.forEach((x, k) => { const w = laneOf(x.text); node(bIds[k], `${b.code}.${k + 1} ${dropSubject(x.text, w.name)}`, w); });
      const first = bIds[0];
      const end = b.kind === 'EXC' ? 'FAIL' : b.returnTo ? `S${b.returnTo}` : next;
      edges.push(`  ${dec} -->|"${mmLabel(`${b.code} ${b.title}`, 40)}"| ${first ?? end}`);
      bIds.forEach((id, k) => edges.push(`  ${id} --> ${bIds[k + 1] ?? end}`));
    }
  });
  const hasFail = edges.some((e) => /FAIL$/.test(e));
  const lines = [fm(`${uc.name} (UC-${String(uc.number).padStart(2, '0')}) — activity`), 'flowchart TB'];
  lines.push(...nodes, ...edges, '  FINISH(((End)))');
  if (hasFail) lines.push('  FAIL(((Stop)))');
  lines.push('  classDef terminal fill:#1a1a17,stroke:#1a1a17,color:#ffffff', '  class START,FINISH terminal');
  if (actorNodes.length) lines.push('  classDef actorStep fill:#eef0fb,stroke:#4f5bd5', `  class ${actorNodes.join(',')} actorStep`);
  return {
    type: 'ACTIVITY', title: `${uc.name} — activity (UC-${String(uc.number).padStart(2, '0')})`, mermaid: lines.join('\n'),
    sources: [{ kind: 'use-case', label: `UC-${String(uc.number).padStart(2, '0')} ${uc.name} — normal/alternative/exception flows`, ref: `UC-${String(uc.number).padStart(2, '0')}` }],
    allowed: [systemName, ...ucActors.map((a) => a.name), ...normal.map((s) => s.text), ...branches.flatMap((b) => [b.title, ...b.steps.map((x) => x.text)])],
    structural: [/^(START|FINISH|FAIL|D\d+|S\d+|B\w+)$/], assumptions: [], notes: normal.length ? [] : ['The use case has no normal flow.'], feature: uc.feature,
  };
}

// ─── USE CASE (flowchart theo quy ước UML) ───────────────────────

/**
 * Sơ đồ use case: actor ở hai bên (người dùng trái, hệ thống ngoài phải), UC hình viên thuốc trong khung hệ thống, mỗi
 * actor nối với UC nó tham gia. Quá 12 UC ⇒ mỗi feature một sơ đồ (gọi với `feature`).
 */
export function useCaseDiagram(d: { actors: ActorLite[]; useCases: UseCaseLite[]; systemName: string; feature?: string | null }): BuiltDiagram {
  const ucs = d.useCases.filter((u) => u.status !== 'PROPOSED' && (!d.feature || (u.feature ?? '') === d.feature)).sort((a, b) => a.number - b.number);
  const used = new Set<number>();
  for (const u of ucs) { if (u.primaryActorId) used.add(u.primaryActorId); u.secondaryActorIds.forEach((x) => used.add(x)); }
  const actors = d.actors.filter((a) => used.has(a.id)).sort((a, b) => a.position - b.position || a.id - b.id);
  const lines = [fm(`${d.systemName}${d.feature ? ` — ${d.feature}` : ''} — use cases`), 'flowchart LR'];
  const left = actors.filter((a) => a.kind !== 'SYSTEM');
  const right = actors.filter((a) => a.kind === 'SYSTEM');
  for (const a of left) lines.push(`  ACT${a.id}["«actor»<br/>${mmLabel(a.name, 50)}"]`);
  lines.push(`  subgraph SYSTEM["${mmLabel(d.systemName, 60)}"]`);
  const features = [...new Set(ucs.map((u) => u.feature ?? ''))];
  const grouped = !d.feature && features.length > 1 && ucs.length > 6;
  if (grouped) {
    features.forEach((f, i) => {
      lines.push(`    subgraph F${i + 1}["${mmLabel(f || 'General', 50)}"]`);
      for (const u of ucs.filter((x) => (x.feature ?? '') === f)) lines.push(`      UC${u.number}(["UC-${String(u.number).padStart(2, '0')} ${mmLabel(u.name, 60)}"])`);
      lines.push('    end');
    });
  } else {
    for (const u of ucs) lines.push(`    UC${u.number}(["UC-${String(u.number).padStart(2, '0')} ${mmLabel(u.name, 60)}"])`);
  }
  lines.push('  end');
  for (const a of right) lines.push(`  ACT${a.id}["«system»<br/>${mmLabel(a.name, 50)}"]`);
  // Chiều khai báo quyết định cột: người dùng (actor PERSON) --- UC ⇒ actor cột trái, UC cột giữa; hệ thống ngoài (SYSTEM)
  // khai UC --- actor ⇒ cột phải. Actor phụ là người: nét đứt, vẫn từ bên trái.
  const kindOf = new Map(actors.map((a) => [a.id, a.kind]));
  for (const u of ucs) {
    if (u.primaryActorId && used.has(u.primaryActorId)) lines.push(kindOf.get(u.primaryActorId) === 'SYSTEM' ? `  UC${u.number} --- ACT${u.primaryActorId}` : `  ACT${u.primaryActorId} --- UC${u.number}`);
    for (const s2 of u.secondaryActorIds) if (actors.some((a) => a.id === s2)) lines.push(kindOf.get(s2) === 'SYSTEM' ? `  UC${u.number} -.- ACT${s2}` : `  ACT${s2} -.- UC${u.number}`);
  }
  lines.push('  classDef actor fill:transparent,stroke:transparent,font-weight:600', `  class ${actors.map((a) => `ACT${a.id}`).join(',') || 'SYSTEM'} actor`);
  const notes: string[] = [];
  if (!ucs.length) notes.push('No approved or draft use cases yet — add use cases on the Requirements page first.');
  if (ucs.length > 12 && !d.feature) notes.push(`${ucs.length} use cases in one diagram — consider one diagram per feature (${features.filter(Boolean).join(', ')}).`);
  const orphan = ucs.filter((u) => !u.primaryActorId);
  if (orphan.length) notes.push(`No primary actor: ${orphan.map((u) => `UC-${String(u.number).padStart(2, '0')}`).join(', ')}.`);
  return {
    type: 'USE_CASE', title: `Use case diagram${d.feature ? ` — ${d.feature}` : ''}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'srs', label: `Requirements: ${actors.length} actor(s), ${ucs.length} use case(s)${d.feature ? ` in "${d.feature}"` : ''}` }],
    allowed: [d.systemName, ...actors.map((a) => a.name), ...ucs.map((u) => `UC-${String(u.number).padStart(2, '0')} ${u.name}`), ...features], structural: [/^(SYSTEM|F\d+)$/],
    assumptions: [], notes, feature: d.feature ?? null,
  };
}

// ─── SCREEN FLOW ─────────────────────────────────────────────────

export function screenFlowDiagram(d: { screens: ScreenLite[]; links: ScreenLinkLite[]; systemName: string; feature?: string | null }): BuiltDiagram {
  const list = [...d.screens].filter((s) => !d.feature || (s.feature ?? '') === d.feature).sort((a, b) => a.position - b.position || a.id - b.id);
  const ids = new Set(list.map((s) => s.id));
  const lines = [fm(`${d.systemName} — screens flow${d.feature ? ` (${d.feature})` : ''}`), 'flowchart LR'];
  const features = [...new Set(list.map((s) => s.feature ?? ''))];
  if (features.length > 1) {
    features.forEach((f, i) => {
      lines.push(`  subgraph G${i + 1}["${mmLabel(f || 'Other', 50)}"]`);
      for (const s of list.filter((x) => (x.feature ?? '') === f)) lines.push(`    SC${s.id}["${mmLabel(s.name, 60)}"]`);
      lines.push('  end');
    });
  } else for (const s of list) lines.push(`  SC${s.id}["${mmLabel(s.name, 60)}"]`);
  for (const l of d.links) if (ids.has(l.fromId) && ids.has(l.toId)) lines.push(l.label ? `  SC${l.fromId} -->|"${mmLabel(l.label, 40)}"| SC${l.toId}` : `  SC${l.fromId} --> SC${l.toId}`);
  return {
    type: 'SCREEN_FLOW', title: `Screens flow${d.feature ? ` — ${d.feature}` : ''}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'srs', label: `Screens & flow: ${list.length} screen(s), ${d.links.filter((l) => ids.has(l.fromId) && ids.has(l.toId)).length} link(s)` }],
    allowed: list.map((s) => s.name), structural: [/^G\d+$/], assumptions: [], notes: list.length ? [] : ['No screens yet — add them on Requirements › Screens flow.'], feature: d.feature ?? null,
  };
}

// ─── STATE từ workflow ───────────────────────────────────────────

export function stateFromWorkflow(w: { name: string; statuses: Array<{ id: number; name: string; category: string; position: number }>; transitions: Array<{ fromStatusId: number | null; toStatusId: number; name: string | null }> }): BuiltDiagram {
  const st = [...w.statuses].sort((a, b) => a.position - b.position);
  const id = new Map(st.map((s) => [s.id, `S${s.id}`]));
  const lines = [fm(`Workflow "${w.name}" — states`), 'stateDiagram-v2', '  direction LR'];
  for (const s of st) lines.push(`  state "${mmLabel(s.name, 50)}" as ${id.get(s.id)}`);
  const first = st.find((s) => s.category === 'TODO') ?? st[0];
  if (first) lines.push(`  [*] --> ${id.get(first.id)}`);
  const seen = new Set<string>();
  const global = w.transitions.filter((t) => t.fromStatusId === null);
  for (const t of w.transitions) {
    const to = id.get(t.toStatusId);
    if (!to) continue;
    const froms = t.fromStatusId === null ? [] : [id.get(t.fromStatusId)].filter(Boolean) as string[];
    for (const f of froms) {
      const k = `${f}>${to}`;
      if (seen.has(k) || f === to) continue;
      seen.add(k);
      lines.push(`  ${f} --> ${to}${t.name ? ` : ${mmLabel(t.name, 40)}` : ''}`);
    }
  }
  if (!w.transitions.length || (global.length && seen.size === 0)) {
    // Quy trình "đi tự do" (không khai luồng chuyển, hoặc chỉ có luồng từ mọi trạng thái): nối theo thứ tự cột.
    for (let i = 0; i + 1 < st.length; i++) lines.push(`  ${id.get(st[i].id)} --> ${id.get(st[i + 1].id)}`);
  }
  for (const s of st.filter((x) => x.category === 'DONE')) lines.push(`  ${id.get(s.id)} --> [*]`);
  const notes = global.length ? [`${global.length} transition(s) are allowed from any status — shown as the board order.`] : [];
  if (!w.transitions.length) notes.push('The workflow has no explicit transitions (any status → any status) — drawn in board order.');
  return {
    type: 'STATE', title: `Workflow states — ${w.name}`, mermaid: lines.join('\n'),
    sources: [{ kind: 'workflow', label: `Project workflow "${w.name}": ${st.length} status(es), ${w.transitions.length} transition(s)` }],
    allowed: st.map((s) => s.name), structural: [], assumptions: [], notes,
  };
}

/** Enum trạng thái của một thực thể (từ repo) ⇒ trạng thái; chuyển do model đề xuất (có bằng chứng) — xem diagrams.service. */
export function stateSkeleton(e: { entity: string; values: string[]; file: string }): BuiltDiagram {
  const lines = [fm(`${e.entity} — state machine (states from ${e.file})`), 'stateDiagram-v2', '  direction LR'];
  for (const v of e.values) lines.push(`  ${mmId(v, 'S')} : ${mmLabel(v, 40)}`);
  if (e.values[0]) lines.push(`  [*] --> ${mmId(e.values[0], 'S')}`);
  return {
    type: 'STATE', title: `${e.entity} — state machine`, mermaid: lines.join('\n'),
    sources: [{ kind: 'repo', label: `enum ${e.entity} in ${e.file}`, ref: e.file }],
    allowed: e.values, structural: [], assumptions: e.values[0] ? [`Initial state "${e.values[0]}" is the first enum value.`] : [], notes: [],
  };
}

// ─── ERD / CLASS từ mã nguồn ─────────────────────────────────────

export interface Column { name: string; type: string; pk?: boolean; fk?: boolean; uk?: boolean; nullable?: boolean }
export interface Table { name: string; columns: Column[]; file?: string }
export interface Relation { from: string; to: string; fromMany: boolean; toMany: boolean; optional: boolean; label: string }
export interface DataModel { tables: Table[]; relations: Relation[]; enums: Array<{ name: string; values: string[]; file?: string }>; source: string }

const erType = (t: string) => { const v = mmId(t.replace(/\(.*$/, '').replace(/\[\]$/, '_list').toLowerCase(), 't').slice(0, 24) || 'string'; return /^(pk|fk|uk)$/.test(v) ? 'ref' : v; };

/** prisma/schema.prisma ⇒ bảng/cột/quan hệ (model + @relation; danh sách ngược bỏ qua). */
export function parsePrismaSchema(text: string, file = 'prisma/schema.prisma'): DataModel {
  const tables: Table[] = [];
  const relations: Relation[] = [];
  const enums: DataModel['enums'] = [];
  const src = String(text ?? '').replace(/\/\/[^\n]*/g, '');
  const modelNames = new Set([...src.matchAll(/^\s*model\s+(\w+)\s*\{/gm)].map((m) => m[1]));
  for (const m of src.matchAll(/^\s*enum\s+(\w+)\s*\{([^}]*)\}/gm)) enums.push({ name: m[1], values: m[2].split(/\s+/).map((x) => x.trim()).filter((x) => /^\w+$/.test(x)), file });
  for (const m of src.matchAll(/^\s*model\s+(\w+)\s*\{([\s\S]*?)^\s*\}/gm)) {
    const name = m[1];
    const cols: Column[] = [];
    const uniqueCols = new Set<string>();
    for (const u of m[2].matchAll(/@@unique\(\s*\[([^\]]+)\]/g)) { const f = u[1].split(',').map((x) => x.trim()); if (f.length === 1) uniqueCols.add(f[0]); }
    const pkCols = new Set<string>();
    for (const u of m[2].matchAll(/@@id\(\s*\[([^\]]+)\]/g)) u[1].split(',').map((x) => x.trim()).forEach((x) => pkCols.add(x));
    const lines = m[2].split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('@@'));
    const relFields: Array<{ field: string; target: string; fields: string[]; optional: boolean }> = [];
    for (const l of lines) {
      const f = /^(\w+)\s+(\w+)(\[\])?(\?)?(.*)$/.exec(l);
      if (!f) continue;
      const [, fname, ftype, list, opt, rest] = f;
      if (modelNames.has(ftype)) {
        if (!list) {
          const rf = /@relation\([^)]*fields:\s*\[([^\]]+)\]/.exec(rest);
          if (rf) relFields.push({ field: fname, target: ftype, fields: rf[1].split(',').map((x) => x.trim()), optional: !!opt });
        }
        continue;
      }
      cols.push({ name: fname, type: list ? `${ftype}[]` : ftype, pk: /@id\b/.test(rest) || pkCols.has(fname), uk: /@unique\b/.test(rest) || uniqueCols.has(fname), nullable: !!opt });
    }
    for (const r of relFields) {
      for (const fk of r.fields) { const c = cols.find((x) => x.name === fk); if (c) c.fk = true; }
      const oneToOne = r.fields.length === 1 && (cols.find((x) => x.name === r.fields[0])?.uk ?? false);
      relations.push({ from: name, to: r.target, fromMany: !oneToOne, toMany: false, optional: r.optional, label: r.field });
    }
    const map = /@@map\("([^"]+)"\)/.exec(m[2]);
    tables.push({ name, columns: cols, file: map ? `${file} (${map[1]})` : file });
  }
  return { tables, relations, enums, source: file };
}

/** Flyway/SQL: CREATE TABLE … (cột, PRIMARY KEY, REFERENCES, FOREIGN KEY) + ALTER TABLE ADD COLUMN/CONSTRAINT FK, theo thứ tự tệp. */
export function parseSqlDdl(files: Array<{ path: string; text: string }>): DataModel {
  const tables = new Map<string, Table>();
  const relations: Relation[] = [];
  const unq = (s: string) => s.replace(/[`"[\]]/g, '').replace(/^\w+\./, '').trim();
  const addFk = (from: string, col: string, to: string) => {
    const t = tables.get(from.toLowerCase());
    const c = t?.columns.find((x) => x.name.toLowerCase() === col.toLowerCase());
    if (c) c.fk = true;
    relations.push({ from: t?.name ?? from, to: tables.get(to.toLowerCase())?.name ?? to, fromMany: !(c?.uk || c?.pk), toMany: false, optional: !!c?.nullable, label: col });
  };
  for (const f of files) {
    const sql = f.text.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const stmt of sql.split(/;\s*(?:\n|$)/)) {
      const ct = /create\s+table\s+(?:if\s+not\s+exists\s+)?([\w."`[\]]+)\s*\(([\s\S]*)\)/i.exec(stmt);
      if (ct) {
        const name = unq(ct[1]);
        const t: Table = { name, columns: [], file: f.path };
        const parts: string[] = [];
        let depth = 0;
        let cur = '';
        for (const ch of ct[2]) {
          if (ch === '(') depth++;
          if (ch === ')') depth--;
          if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
        }
        if (cur.trim()) parts.push(cur);
        const pending: Array<[string, string]> = [];
        for (const p of parts.map((x) => x.trim()).filter(Boolean)) {
          const pk = /^(?:constraint\s+\S+\s+)?primary\s+key\s*\(([^)]+)\)/i.exec(p);
          if (pk) { pk[1].split(',').map(unq).forEach((c) => { const col = t.columns.find((x) => x.name.toLowerCase() === c.toLowerCase()); if (col) col.pk = true; }); continue; }
          const fk = /^(?:constraint\s+\S+\s+)?foreign\s+key\s*\(([^)]+)\)\s*references\s+([\w."`[\]]+)/i.exec(p);
          if (fk) { pending.push([unq(fk[1].split(',')[0]), unq(fk[2])]); continue; }
          const uq = /^(?:constraint\s+\S+\s+)?unique\s*\(([^)]+)\)/i.exec(p);
          if (uq) { const cs = uq[1].split(',').map(unq); if (cs.length === 1) { const col = t.columns.find((x) => x.name.toLowerCase() === cs[0].toLowerCase()); if (col) col.uk = true; } continue; }
          if (/^(constraint|check|index|key)\b/i.test(p)) continue;
          const col = /^([\w"`[\]]+)\s+([\w]+(?:\s*\([^)]*\))?(?:\s+varying(?:\s*\([^)]*\))?)?)(.*)$/i.exec(p);
          if (!col) continue;
          const cname = unq(col[1]);
          const rest = col[3];
          t.columns.push({ name: cname, type: col[2].replace(/\s+/g, ' '), pk: /primary\s+key/i.test(rest), uk: /\bunique\b/i.test(rest), nullable: !/not\s+null|primary\s+key/i.test(rest) });
          const ref = /references\s+([\w."`[\]]+)/i.exec(rest);
          if (ref) pending.push([cname, unq(ref[1])]);
        }
        tables.set(name.toLowerCase(), t);
        for (const [c, to] of pending) addFk(name, c, to);
        continue;
      }
      const alt = /alter\s+table\s+(?:only\s+)?(?:if\s+exists\s+)?([\w."`[\]]+)\s+([\s\S]+)/i.exec(stmt);
      if (alt) {
        const name = unq(alt[1]);
        const t = tables.get(name.toLowerCase());
        for (const fk of alt[2].matchAll(/foreign\s+key\s*\(([^)]+)\)\s*references\s+([\w."`[\]]+)/gi)) addFk(name, unq(fk[1].split(',')[0]), unq(fk[2]));
        if (t) for (const ac of alt[2].matchAll(/add\s+(?:column\s+)?(?:if\s+not\s+exists\s+)?([\w"`]+)\s+([\w]+(?:\s*\([^)]*\))?)([^,]*)/gi)) {
          if (/^(constraint|primary|foreign|unique|check|index)$/i.test(ac[1])) continue;
          t.columns.push({ name: unq(ac[1]), type: ac[2], nullable: !/not\s+null/i.test(ac[3]) });
          const ref = /references\s+([\w."`[\]]+)/i.exec(ac[3]);
          if (ref) addFk(name, unq(ac[1]), unq(ref[1]));
        }
        continue;
      }
      const drop = /drop\s+table\s+(?:if\s+exists\s+)?([\w."`[\]]+)/i.exec(stmt);
      if (drop) tables.delete(unq(drop[1]).toLowerCase());
    }
  }
  const names = new Set([...tables.values()].map((t) => t.name));
  return { tables: [...tables.values()], relations: relations.filter((r) => names.has(r.from) && names.has(r.to)), enums: [], source: files.map((f) => f.path).join(', ') };
}

/** Java/Kotlin JPA: lớp có @Entity ⇒ bảng; @Id, @Column, @ManyToOne/@OneToOne(+@JoinColumn) ⇒ FK; @ManyToMany ⇒ n–n; enum *Status ⇒ enums. */
export function parseJpaEntities(files: Array<{ path: string; text: string }>): DataModel {
  const tables: Table[] = [];
  const relations: Relation[] = [];
  const enums: DataModel['enums'] = [];
  const entityNames = new Set<string>();
  for (const f of files) for (const m of f.text.matchAll(/@Entity[\s\S]{0,400}?(?:class|data class)\s+(\w+)/g)) entityNames.add(m[1]);
  for (const f of files) {
    for (const e of f.text.matchAll(/enum\s+(?:class\s+)?(\w+)\s*\{([^}]*)\}/g)) {
      const values = e[2].split(/[;]/)[0].split(',').map((x) => x.trim().replace(/\(.*$/, '')).filter((x) => /^[A-Z][A-Z0-9_]*$/.test(x));
      if (values.length) enums.push({ name: e[1], values, file: f.path });
    }
    const cm = /@Entity[\s\S]{0,400}?(?:class|data class)\s+(\w+)[^{]*\{([\s\S]*)\}\s*$/m.exec(f.text);
    if (!cm) continue;
    const name = cm[1];
    const table = /@Table\s*\(\s*name\s*=\s*"([^"]+)"/.exec(f.text)?.[1];
    const cols: Column[] = [];
    const body = cm[2];
    const fieldRe = /((?:@\w+(?:\([^)]*\))?\s*)*)(?:private|protected|public)?\s*(?:final\s+)?(?:val|var\s+)?([\w<>, ?]+?)\s+(\w+)\s*(?:=[^;]*)?;/g;
    for (const fm2 of body.matchAll(fieldRe)) {
      const ann = fm2[1] ?? '';
      const type = fm2[2].trim();
      const fname = fm2[3];
      if (/\bstatic\b/.test(type) || /@Transient/.test(ann) || /\(/.test(type)) continue;
      const inner = /<\s*(\w+)\s*>/.exec(type)?.[1];
      if (/@(ManyToOne|OneToOne)/.test(ann) && entityNames.has(type)) {
        const jc = /@JoinColumn\s*\([^)]*name\s*=\s*"([^"]+)"/.exec(ann)?.[1] ?? `${fname}_id`;
        cols.push({ name: jc, type: 'fk', fk: true, nullable: !/nullable\s*=\s*false|optional\s*=\s*false/.test(ann) });
        if (!/mappedBy/.test(ann)) relations.push({ from: name, to: type, fromMany: /ManyToOne/.test(ann), toMany: false, optional: !/nullable\s*=\s*false|optional\s*=\s*false/.test(ann), label: fname });
        continue;
      }
      if (/@ManyToMany/.test(ann) && inner && entityNames.has(inner)) {
        if (!/mappedBy/.test(ann)) relations.push({ from: name, to: inner, fromMany: true, toMany: true, optional: true, label: fname });
        continue;
      }
      if (/@OneToMany/.test(ann) || (inner && entityNames.has(inner))) continue;
      const colName = /@Column\s*\([^)]*name\s*=\s*"([^"]+)"/.exec(ann)?.[1] ?? fname;
      cols.push({ name: colName, type: type.replace(/<.*$/, ''), pk: /@Id\b/.test(ann), uk: /unique\s*=\s*true/.test(ann), nullable: !/nullable\s*=\s*false/.test(ann) && !/@Id\b/.test(ann) });
    }
    tables.push({ name, columns: cols, file: table ? `${f.path} (${table})` : f.path });
  }
  return { tables, relations, enums, source: files.map((f) => f.path).slice(0, 6).join(', ') + (files.length > 6 ? ` +${files.length - 6}` : '') };
}

/** Chọn tập bảng cho MỘT sơ đồ: lọc theo tên (entities) hoặc giữ tối đa `max` bảng nhiều quan hệ nhất. */
export function pickTables(dm: DataModel, opts: { entities?: string[]; max?: number }): { tables: Table[]; dropped: string[] } {
  if (opts.entities?.length) {
    const want = opts.entities.map((e) => e.toLowerCase());
    const tables = dm.tables.filter((t) => want.includes(t.name.toLowerCase()));
    return { tables, dropped: dm.tables.filter((t) => !tables.includes(t)).map((t) => t.name) };
  }
  const max = opts.max ?? 14;
  if (dm.tables.length <= max) return { tables: dm.tables, dropped: [] };
  const deg = new Map(dm.tables.map((t) => [t.name, 0]));
  for (const r of dm.relations) { deg.set(r.from, (deg.get(r.from) ?? 0) + 1); deg.set(r.to, (deg.get(r.to) ?? 0) + 1); }
  const keep = [...dm.tables].sort((a, b) => (deg.get(b.name) ?? 0) - (deg.get(a.name) ?? 0)).slice(0, max);
  return { tables: dm.tables.filter((t) => keep.includes(t)), dropped: dm.tables.filter((t) => !keep.includes(t)).map((t) => t.name) };
}

/** erDiagram có thuộc tính (PK/FK/UK) + quan hệ có bản số. `detail: keys` ⇒ chỉ khoá. */
export function erdFromModel(dm: DataModel, opts: { title: string; sourceLabel: string; entities?: string[]; detail?: 'full' | 'keys'; maxColumns?: number }): BuiltDiagram {
  const { tables, dropped } = pickTables(dm, { entities: opts.entities });
  const names = new Set(tables.map((t) => t.name));
  const lines = [fm(`${opts.title} — source: ${opts.sourceLabel}`), 'erDiagram'];
  const maxCols = opts.maxColumns ?? 14;
  for (const t of tables) {
    const cols = opts.detail === 'keys' ? t.columns.filter((c) => c.pk || c.fk || c.uk) : t.columns;
    lines.push(`  ${mmId(t.name, 'T')} {`);
    for (const c of cols.slice(0, maxCols)) {
      const keys = [c.pk && 'PK', c.fk && 'FK', c.uk && !c.pk && 'UK'].filter(Boolean).join(', ');
      lines.push(`    ${erType(c.type)} ${mmId(c.name, 'c')}${keys ? ` ${keys}` : ''}`);
    }
    if (cols.length > maxCols) lines.push(`    string more_${cols.length - maxCols}_columns`);
    lines.push('  }');
  }
  const seen = new Set<string>();
  for (const r of dm.relations) {
    if (!names.has(r.from) || !names.has(r.to)) continue;
    const k = `${r.from}|${r.to}|${r.label}`;
    if (seen.has(k)) continue;
    seen.add(k);
    // to (cha) ||--o{ from (con) — đọc từ phía cha: "một <to> có nhiều <from>"
    const left = r.toMany ? '}o' : (r.optional ? '|o' : '||');
    const right = r.fromMany ? 'o{' : 'o|';
    lines.push(`  ${mmId(r.to, 'T')} ${left}--${right} ${mmId(r.from, 'T')} : "${mmLabel(r.label, 30)}"`);
  }
  const notes = dropped.length ? [`${dropped.length} more table(s) not shown (${dropped.slice(0, 8).join(', ')}${dropped.length > 8 ? '…' : ''}) — generate again with a list of entities for another view.`] : [];
  return {
    type: 'ERD', title: opts.title, mermaid: lines.join('\n'),
    sources: [{ kind: 'repo', label: opts.sourceLabel }], allowed: dm.tables.map((t) => t.name), structural: [], assumptions: [], notes,
  };
}

// ─── CLASS từ mã nguồn ───────────────────────────────────────────

export interface ClassInfo { name: string; kind: 'class' | 'interface' | 'enum' | 'abstract'; extends?: string | null; implements: string[]; fields: Array<{ name: string; type: string; vis: string }>; methods: Array<{ name: string; params: string; ret: string; vis: string }>; file: string; stereotype?: string | null }

const VIS: Record<string, string> = { public: '+', private: '-', protected: '#', '': '~' };

export function parseClasses(files: Array<{ path: string; text: string }>): ClassInfo[] {
  const out: ClassInfo[] = [];
  for (const f of files) {
    const isTs = /\.(ts|tsx)$/.test(f.path);
    const text = f.text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    const re = isTs
      ? /(?:export\s+)?(?:default\s+)?(abstract\s+)?(class|interface)\s+(\w+)(?:<[^>{]*>)?(?:\s+extends\s+([\w.]+)(?:<[^>{]*>)?)?(?:\s+implements\s+([\w.,\s<>]+?))?\s*\{/g
      : /((?:@\w+(?:\([^)]*\))?\s*)*)(?:public\s+|protected\s+|private\s+)?(abstract\s+)?(?:final\s+)?(class|interface|enum|record)\s+(\w+)(?:<[^>{]*>)?(?:\s+extends\s+([\w.]+)(?:<[^>{]*>)?)?(?:\s+implements\s+([\w.,\s<>]+?))?\s*[({]/g;
    for (const m of text.matchAll(re)) {
      const ann = isTs ? '' : m[1] ?? '';
      const abs = isTs ? m[1] : m[2];
      const kw = isTs ? m[2] : m[3];
      const name = isTs ? m[3] : m[4];
      const ext = isTs ? m[4] : m[5];
      const impl = isTs ? m[5] : m[6];
      // thân lớp: từ dấu { tới dấu } khớp
      let i = (m.index ?? 0) + m[0].length;
      if (text[i - 1] === '(') { const close = text.indexOf('{', i); i = close + 1; }
      let depth = 1;
      const start = i;
      while (i < text.length && depth > 0) { if (text[i] === '{') depth++; else if (text[i] === '}') depth--; i++; }
      const body = text.slice(start, i - 1);
      const top = body.replace(/\{[^{}]*\}/g, ';').replace(/\{[^{}]*\}/g, ';').replace(/\{[^{}]*\}/g, ';');
      const fields: ClassInfo['fields'] = [];
      const methods: ClassInfo['methods'] = [];
      if (isTs) {
        for (const fm2 of top.matchAll(/(?:^|[;\n])\s*(public|private|protected)?\s*(?:readonly\s+)?(\w+)\??\s*:\s*([^;=\n]+?)\s*(?:=[^;\n]*)?[;\n]/g)) fields.push({ name: fm2[2], type: fm2[3].trim(), vis: VIS[fm2[1] ?? 'public'] });
        for (const mm of top.matchAll(/(?:^|[;\n])\s*(public|private|protected)?\s*(?:static\s+)?(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*([^;{\n]+))?/g)) if (mm[2] !== 'constructor' && !['if', 'for', 'while', 'switch', 'return', 'catch'].includes(mm[2])) methods.push({ name: mm[2], params: mm[3].replace(/:\s*[^,]+/g, '').trim(), ret: (mm[4] ?? '').trim(), vis: VIS[mm[1] ?? 'public'] });
      } else {
        for (const fm2 of top.matchAll(/(?:^|[;}\n])\s*(?:@\w+(?:\([^)]*\))?\s*)*(public|private|protected)?\s*(?:static\s+)?(?:final\s+)?([\w<>, ?[\]]+?)\s+(\w+)\s*(?:=[^;]*)?;/g)) {
          if (/\b(return|throw|new)\b/.test(fm2[2])) continue;
          fields.push({ name: fm2[3], type: fm2[2].trim(), vis: VIS[fm2[1] ?? ''] });
        }
        for (const mm of top.matchAll(/(public|private|protected)\s+(?:static\s+)?(?:final\s+)?(?:synchronized\s+)?([\w<>, ?[\]]+?)\s+(\w+)\s*\(([^)]*)\)/g)) methods.push({ name: mm[3], params: mm[4].split(',').map((p) => p.trim().split(/\s+/).pop() ?? '').filter(Boolean).join(', '), ret: mm[2].trim(), vis: VIS[mm[1]] });
        for (const p of /^\s*record\b/.test(kw) ? [] : []) void p;
      }
      const stereotype = /@Entity/.test(ann) ? 'entity' : /@(RestController|Controller)/.test(ann) ? 'controller' : /@Service/.test(ann) ? 'service' : /@Repository/.test(ann) || /Repository$/.test(name) ? 'repository' : null;
      out.push({
        name, kind: kw === 'interface' ? 'interface' : kw === 'enum' ? 'enum' : abs ? 'abstract' : 'class', extends: ext ?? null,
        implements: (impl ?? '').split(',').map((x) => x.trim().replace(/<.*$/, '')).filter(Boolean), fields: fields.slice(0, 30), methods: methods.slice(0, 30), file: f.path, stereotype,
      });
    }
  }
  return out;
}

/** classDiagram: ≤ 12 lớp (lọc theo `filter` chữ con trong tên hoặc ưu tiên entity/service), quan hệ kế thừa/hiện thực/thuộc tính. */
export function classDiagram(classes: ClassInfo[], opts: { title: string; sourceLabel: string; filter?: string | null; max?: number }): BuiltDiagram {
  const max = opts.max ?? 12;
  const f = (opts.filter ?? '').trim().toLowerCase();
  let pick = f ? classes.filter((c) => c.name.toLowerCase().includes(f) || c.file.toLowerCase().includes(f)) : classes;
  const rank = (c: ClassInfo) => (c.stereotype === 'entity' ? 0 : c.stereotype === 'service' ? 1 : c.stereotype === 'controller' ? 2 : c.stereotype === 'repository' ? 3 : 4);
  pick = [...pick].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)).slice(0, max);
  const names = new Set(pick.map((c) => c.name));
  const lines = [fm(`${opts.title} — source: ${opts.sourceLabel}`), 'classDiagram', '  direction LR'];
  for (const c of pick) {
    lines.push(`  class ${mmId(c.name, 'C')} {`);
    if (c.kind === 'interface') lines.push('    <<interface>>');
    else if (c.kind === 'abstract') lines.push('    <<abstract>>');
    else if (c.kind === 'enum') lines.push('    <<enumeration>>');
    else if (c.stereotype) lines.push(`    <<${c.stereotype}>>`);
    for (const x of c.fields.slice(0, 10)) lines.push(`    ${x.vis}${mmId(x.type.replace(/[<>, ?[\]]+/g, '_'), 'T')} ${mmId(x.name, 'f')}`);
    for (const x of c.methods.slice(0, 8)) lines.push(`    ${x.vis}${mmId(x.name, 'm')}(${x.params.replace(/[^\w, ]/g, '').slice(0, 40)})${x.ret ? ` ${mmId(x.ret.replace(/[<>, ?[\]]+/g, '_'), 'T')}` : ''}`);
    lines.push('  }');
  }
  const seen = new Set<string>();
  const rel = (s: string) => { if (!seen.has(s)) { seen.add(s); lines.push(`  ${s}`); } };
  for (const c of pick) {
    if (c.extends && names.has(c.extends)) rel(`${mmId(c.extends, 'C')} <|-- ${mmId(c.name, 'C')}`);
    for (const i of c.implements) if (names.has(i)) rel(`${mmId(i, 'C')} <|.. ${mmId(c.name, 'C')}`);
    for (const x of c.fields) {
      const inner = /<\s*(\w+)\s*>/.exec(x.type)?.[1] ?? (x.type.endsWith('[]') ? x.type.slice(0, -2) : null);
      if (inner && names.has(inner) && inner !== c.name) rel(`${mmId(c.name, 'C')} "1" --> "*" ${mmId(inner, 'C')} : ${mmId(x.name, 'f')}`);
      else if (names.has(x.type) && x.type !== c.name) rel(`${mmId(c.name, 'C')} --> ${mmId(x.type, 'C')} : ${mmId(x.name, 'f')}`);
    }
  }
  const notes = classes.length > pick.length ? [`${classes.length - pick.length} more class(es) not shown — generate again with a name filter (e.g. a feature or package).`] : [];
  return { type: 'CLASS', title: opts.title, mermaid: lines.join('\n'), sources: [{ kind: 'repo', label: opts.sourceLabel }], allowed: classes.map((c) => c.name), structural: [], assumptions: [], notes };
}

// ─── DEPLOYMENT từ docker-compose ────────────────────────────────

export interface ComposeService { name: string; image: string | null; build: boolean; ports: string[]; dependsOn: string[] }

/** docker-compose.yml tối giản: khoá dịch vụ dưới `services:`, image/build/ports/depends_on. Không chạy YAML đầy đủ. */
export function parseCompose(text: string): ComposeService[] {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out: ComposeService[] = [];
  let inServices = false;
  let svcIndent = -1;
  let cur: ComposeService | null = null;
  let list: 'ports' | 'depends_on' | null = null;
  let listIndent = -1;
  for (const raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.length - raw.trimStart().length;
    const t = raw.trim();
    if (indent === 0) { inServices = /^services\s*:/.test(t); svcIndent = -1; cur = null; continue; }
    if (!inServices) continue;
    if (svcIndent < 0) svcIndent = indent;
    if (indent === svcIndent) {
      const k = /^([\w.-]+)\s*:/.exec(t);
      if (k) { cur = { name: k[1], image: null, build: false, ports: [], dependsOn: [] }; out.push(cur); list = null; }
      continue;
    }
    if (!cur) continue;
    if (list && indent > listIndent) {
      const item = /^-\s*["']?([^"'#]+?)["']?\s*$/.exec(t);
      const key = /^([\w.-]+)\s*:/.exec(t);
      if (item) (list === 'ports' ? cur.ports : cur.dependsOn).push(item[1].trim());
      else if (key && list === 'depends_on' && indent === listIndent + 2) cur.dependsOn.push(key[1]);
      continue;
    }
    list = null;
    const kv = /^([\w.-]+)\s*:\s*(.*)$/.exec(t);
    if (!kv) continue;
    const [, k, v] = kv;
    if (k === 'image') cur.image = v.replace(/["']/g, '').trim() || null;
    else if (k === 'build') cur.build = true;
    else if (k === 'ports' || k === 'depends_on') {
      const inline = /^\[(.*)\]$/.exec(v.trim());
      if (inline) (k === 'ports' ? cur.ports : cur.dependsOn).push(...inline[1].split(',').map((x) => x.replace(/["'\s]/g, '')).filter(Boolean));
      else { list = k; listIndent = indent; }
    }
  }
  return out;
}

const isStore = (s: ComposeService) => /postgres|mysql|mariadb|mongo|redis|sqlserver|mssql|elasticsearch|minio|rabbitmq|kafka/i.test(`${s.image ?? ''} ${s.name}`);

export function deploymentFromCompose(services: ComposeService[], opts: { file: string; repo: string }): BuiltDiagram {
  const lines = [fm(`Deployment — source: ${opts.file} @ ${opts.repo}`), 'flowchart LR'];
  const exposed = services.filter((s) => s.ports.length);
  if (exposed.length) lines.push('  CLIENT["Web browser (assumed)"]');
  lines.push(`  subgraph HOST["Docker host (${mmLabel(opts.file, 40)})"]`, '    direction LR');
  for (const s of services) {
    const meta = [s.image ?? (s.build ? 'built from repo' : ''), s.ports.length ? `:${s.ports.map((p) => p.split(':').slice(-2)[0]).join(', :')}` : ''].filter(Boolean).join(' · ');
    const label = `${mmLabel(s.name, 40)}${meta ? `<br/>${mmLabel(meta, 60)}` : ''}`;
    lines.push(isStore(s) ? `    SV_${mmId(s.name)}[("${label}")]` : `    SV_${mmId(s.name)}["${label}"]`);
  }
  lines.push('  end');
  for (const s of exposed.filter((x) => !isStore(x))) lines.push(`  CLIENT -->|"HTTP ${mmLabel(s.ports[0].split(':')[0], 12)}"| SV_${mmId(s.name)}`);
  for (const s of services) for (const d of s.dependsOn) if (services.some((x) => x.name === d)) lines.push(`  SV_${mmId(s.name)} --> SV_${mmId(d)}`);
  return {
    type: 'DEPLOYMENT', title: 'Deployment diagram', mermaid: lines.join('\n'),
    sources: [{ kind: 'repo', label: `${opts.file} @ ${opts.repo} — ${services.length} service(s)`, ref: opts.file }],
    allowed: services.map((s) => s.name), structural: [/^(HOST)$/],
    assumptions: exposed.length ? ['"Web browser" is not in docker-compose — added because services publish ports.'] : [], notes: [],
  };
}

// ─── Mermaid ⇒ một khối nguồn có nhãn sơ đồ (dùng ở bản ghi) ────

export const builtKey = (n: number) => diagramKey(n);
