/**
 * "Create with CuongMini" — phần MÃ tự tính (model không tự xếp lịch, không tự giao việc): sprint tới hạn chót,
 * giao việc theo trình độ + giờ rảnh + luật nhóm chọn, xếp story vào sprint theo năng lực và phụ thuộc ("blocks"),
 * hạn từng thẻ, mốc (version), cảnh báo quá tải / trễ hạn / người mới ôm việc khó. THUẦN — test đọc trực tiếp.
 *
 * Quy ước: 1 điểm ≈ HOURS_PER_POINT giờ làm thật. Trưởng nhóm có luật LEADER_REVIEWS ⇒ chỉ nhận ~70% sức (còn lại
 * để review PR). Thẻ người dùng đã sửa tay (`locked`) giữ nguyên người + sprint.
 */

import { foldVi } from '../fold.js';
import type { AssignRule, PlanItem, PlanMember, PlanProject, PlanWarning, SetupInput } from './kieu.js';

export const HOURS_PER_POINT = 4;
const DAY = 86_400_000;

// ─── Ngày ────────────────────────────────────────────────────────

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const parseDay = (s: string) => new Date(`${s}T00:00:00Z`);
export const addDays = (s: string, n: number) => iso(new Date(parseDay(s).getTime() + n * DAY));

/** Thứ Hai kế tiếp (hoặc hôm nay nếu là thứ Hai). */
export function nextMonday(today: string): string {
  const d = parseDay(today);
  const wd = d.getUTCDay();
  return addDays(today, wd === 1 ? 0 : (8 - wd) % 7);
}

/** Số ngày làm việc trong [from, to] (gồm cả hai đầu), trừ khoảng tránh (thi, nghỉ lễ). */
export function workingDaysBetween(from: string, to: string, workingDays: number[], avoid: Array<{ from: string; to: string }> = []): number {
  if (to < from) return 0;
  const wd = new Set(workingDays.length ? workingDays : [1, 2, 3, 4, 5]);
  let n = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) {
    if (!wd.has(parseDay(d).getUTCDay())) continue;
    if (avoid.some((a) => d >= a.from && d <= a.to)) continue;
    n += 1;
    if (n > 2000) break;
  }
  return n;
}

export interface SprintSlot { ref: string; name: string; goal: string; start: string; end: string; factor: number }

/**
 * Sprint liền nhau từ ngày bắt đầu tới hạn chót. Sprint nằm TRỌN trong khoảng tránh ⇒ bỏ (tuần thi);
 * sprint chạm một phần ⇒ `factor` < 1 (ít ngày làm hơn). Thiếu ngày ⇒ bắt đầu thứ Hai tới, kéo 10 tuần.
 */
export function buildSprints(t: SetupInput['timeline'], today: string, max = 40): SprintSlot[] {
  const start = t.startDate || nextMonday(today);
  const end = t.endDate && t.endDate > start ? t.endDate : addDays(start, 7 * 10 - 1);
  const len = Math.max(1, t.sprintWeeks || 2) * 7;
  const full = workingDaysBetween(start, addDays(start, len - 1), t.workingDays, []);
  const out: SprintSlot[] = [];
  let s = start;
  let n = 0;
  while (s <= end && out.length < max) {
    let e = addDays(s, len - 1);
    // Phần đuôi ngắn (< nửa sprint) ⇒ gộp vào sprint cuối thay vì một sprint lẻ.
    if (e >= end || addDays(e, Math.ceil(len / 2)) > end) e = end;
    const days = workingDaysBetween(s, e, t.workingDays, t.avoid);
    if (days > 0) {
      n += 1;
      out.push({ ref: `s${n}`, name: `Sprint ${n}`, goal: '', start: s, end: e, factor: Math.min(1.5, full ? days / full : 1) });
    }
    s = addDays(e, 1);
  }
  return out;
}

// ─── Sức làm ─────────────────────────────────────────────────────

/** Điểm một người làm được trong một sprint đủ ngày. */
export function pointsPerSprint(m: Pick<PlanMember, 'hoursPerWeek' | 'leader'>, sprintWeeks: number, rules: AssignRule[]): number {
  const h = Math.max(0, m.hoursPerWeek) * Math.max(1, sprintWeeks);
  const share = m.leader && rules.includes('LEADER_REVIEWS') ? 0.7 : 1;
  return (h * share) / HOURS_PER_POINT;
}

const pts = (i: PlanItem) => (i.points ?? 0) > 0 ? i.points! : i.kind === 'SUBTASK' ? 0 : 1;
/** Thẻ được tính tải/xếp sprint: story, task, bug (epic là vỏ; subtask đi theo cha). */
const schedulable = (i: PlanItem) => i.kind === 'STORY' || i.kind === 'TASK' || i.kind === 'BUG';

const AREA_WORDS: Record<string, string[]> = {
  fe: ['fe', 'frontend', 'front-end', 'ui', 'react', 'vue', 'angular', 'html', 'css', 'giao dien', 'jsp'],
  be: ['be', 'backend', 'back-end', 'api', 'server', 'java', 'spring', 'node', 'express', 'servlet', 'python', 'django', '.net', 'c#'],
  db: ['db', 'database', 'sql', 'postgres', 'mysql', 'mongo', 'csdl', 'erd', 'co so du lieu'],
  test: ['test', 'tester', 'qa', 'kiem thu', 'testing', 'selenium', 'junit'],
  doc: ['doc', 'docs', 'ba', 'business analyst', 'srs', 'tai lieu', 'report', 'bao cao', 'requirement', 'yeu cau'],
  design: ['design', 'designer', 'figma', 'ux', 'ui/ux', 'thiet ke'],
  devops: ['devops', 'deploy', 'docker', 'ci', 'cd', 'cloud', 'aws', 'vps', 'trien khai'],
  pm: ['pm', 'leader', 'truong nhom', 'scrum master', 'quan ly', 'lead'],
  mobile: ['mobile', 'android', 'ios', 'flutter', 'react native', 'kotlin', 'swift'],
};

/** Người này hợp với mảng việc ở mức nào (0..1) — dựa vào vai trò + kỹ năng + mong muốn. */
export function areaFit(m: Pick<PlanMember, 'role' | 'skills' | 'prefs'>, area: string): number {
  const a = foldVi(area).trim();
  if (!a) return 0;
  const words = AREA_WORDS[a] ?? [a];
  const hay = ` ${foldVi(`${m.role} ${m.skills} ${m.prefs}`).replace(/[,;/|]+/g, ' ')} `;
  const hit = words.some((w) => hay.includes(` ${w} `) || (w.length >= 4 && hay.includes(w)));
  if (!hit) return 0;
  return foldVi(m.prefs).includes(words[0]) || words.some((w) => w.length >= 4 && foldVi(m.prefs).includes(w)) ? 1 : 0.7;
}

// ─── Giao việc ───────────────────────────────────────────────────

/**
 * Giao story/task/bug chưa có người (không đụng thẻ `locked`). Điểm của mỗi người = tải hiện tại / sức (thấp tốt),
 * cộng thưởng hợp mảng, chủ mô-đun (MODULE_OWNER: người nhận epic giữ các con), trình độ (BY_LEVEL: việc khó cho người
 * mạnh, việc dễ cho người mới). Việc khó (difficulty 3) giao cho người level ≤ 2 ⇒ LUÔN ghép cặp người mạnh (pairRef).
 * Việc con: theo người của cha; có cặp ⇒ chia xen kẽ.
 */
export function assignItems(items: PlanItem[], members: PlanMember[], rules: AssignRule[], sprintWeeks = 2): PlanItem[] {
  if (!members.length) return items;
  const byRef = new Map(items.map((i) => [i.ref, i]));
  const cap = new Map(members.map((m) => [m.ref, Math.max(0.5, pointsPerSprint(m, sprintWeeks, rules))]));
  const load = new Map(members.map((m) => [m.ref, 0]));
  for (const i of items) if (schedulable(i) && i.assigneeRef && load.has(i.assigneeRef)) load.set(i.assigneeRef, load.get(i.assigneeRef)! + pts(i));
  const equal = rules.includes('EQUAL_LOAD');
  const byLevel = rules.includes('BY_LEVEL') || !equal;
  const moduleOwner = rules.includes('MODULE_OWNER');
  const leaderReviews = rules.includes('LEADER_REVIEWS');

  // Chủ epic: MODULE_OWNER ⇒ mỗi epic một người (xoay vòng theo người còn trống, ưu tiên hợp mảng).
  const epicOwner = new Map<string, string>();
  if (moduleOwner) {
    const epics = items.filter((i) => i.kind === 'EPIC');
    const owned = new Map(members.map((m) => [m.ref, 0]));
    for (const e of epics) {
      if (e.assigneeRef && owned.has(e.assigneeRef)) { epicOwner.set(e.ref, e.assigneeRef); owned.set(e.assigneeRef, owned.get(e.assigneeRef)! + 1); continue; }
      const pool = members.filter((m) => !(leaderReviews && m.leader && members.length > 2));
      const best = [...(pool.length ? pool : members)].sort((a, b) =>
        (owned.get(a.ref)! - owned.get(b.ref)!) || (areaFit(b, e.area) - areaFit(a, e.area)) || (b.level - a.level))[0];
      epicOwner.set(e.ref, best.ref);
      owned.set(best.ref, owned.get(best.ref)! + 1);
      if (!e.locked) e.assigneeRef = best.ref;
    }
  }
  const epicOf = (i: PlanItem): string | null => {
    let p = i.parentRef ? byRef.get(i.parentRef) : undefined;
    for (let d = 0; p && d < 4; d++) { if (p.kind === 'EPIC') return p.ref; p = p.parentRef ? byRef.get(p.parentRef) : undefined; }
    return null;
  };

  const todo = items.filter((i) => schedulable(i) && !i.locked && !i.assigneeRef)
    .sort((a, b) => (b.difficulty - a.difficulty) || (a.priority - b.priority) || (pts(b) - pts(a)));
  const strongest = () => [...members].sort((a, b) => (b.level - a.level) || (load.get(a.ref)! / cap.get(a.ref)! - load.get(b.ref)! / cap.get(b.ref)!));
  for (const it of todo) {
    let best: PlanMember | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    const owner = epicOwner.get(epicOf(it) ?? '');
    for (const m of members) {
      const ratio = (load.get(m.ref)! + pts(it)) / cap.get(m.ref)!;
      let score = ratio;
      score -= areaFit(m, it.area) * 0.35;
      if (owner && owner === m.ref) score -= 0.6;
      if (byLevel) {
        if (it.difficulty === 3) score += m.level <= 2 ? 0.9 : m.level >= 4 ? -0.25 : 0;
        if (it.difficulty === 1) score += m.level >= 4 ? 0.2 : m.level <= 2 ? -0.15 : 0;
        if (it.difficulty === 2 && m.level <= 1) score += 0.2;
      } else if (it.difficulty === 3 && m.level <= 2) score += 0.5;
      if (score < bestScore) { bestScore = score; best = m; }
    }
    if (!best) continue;
    it.assigneeRef = best.ref;
    load.set(best.ref, load.get(best.ref)! + pts(it));
    // Người mới không ôm việc khó một mình: ghép người mạnh nhất còn sức.
    if (it.difficulty === 3 && best.level <= 2 && !it.pairRef) {
      const pair = strongest().find((m) => m.ref !== best!.ref);
      if (pair) {
        it.pairRef = pair.ref;
        load.set(pair.ref, load.get(pair.ref)! + pts(it) * 0.3);
      }
    }
  }
  // Epic không có chủ ⇒ người làm nhiều điểm nhất trong epic (để có người chịu trách nhiệm).
  for (const e of items.filter((i) => i.kind === 'EPIC' && !i.assigneeRef && !i.locked)) {
    const sums = new Map<string, number>();
    // Trọng số theo trình độ: chủ epic là người chịu trách nhiệm cả mô-đun — người mới làm nhiều điểm vẫn không thành chủ.
    const lv = new Map(members.map((m) => [m.ref, m.level]));
    for (const c of items) if (epicOf(c) === e.ref && c.assigneeRef) sums.set(c.assigneeRef, (sums.get(c.assigneeRef) ?? 0) + pts(c) * ((lv.get(c.assigneeRef) ?? 3) / 3));
    const top = [...sums.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) e.assigneeRef = top[0];
  }
  // Việc con theo cha; cha có cặp ⇒ xen kẽ.
  const kidsSeen = new Map<string, number>();
  for (const s of items.filter((i) => i.kind === 'SUBTASK' && !i.locked && !i.assigneeRef)) {
    const p = s.parentRef ? byRef.get(s.parentRef) : undefined;
    if (!p?.assigneeRef) continue;
    const n = kidsSeen.get(p.ref) ?? 0;
    kidsSeen.set(p.ref, n + 1);
    s.assigneeRef = p.pairRef && n % 2 === 1 ? p.pairRef : p.assigneeRef;
  }
  return items;
}

// ─── Xếp sprint + hạn ────────────────────────────────────────────

/** Thứ tự tôn trọng "blocks": thẻ chặn đứng trước thẻ bị chặn (vòng lặp ⇒ giữ thứ tự cũ cho phần còn lại). */
export function topoOrder(items: PlanItem[]): PlanItem[] {
  const refs = new Set(items.map((i) => i.ref));
  const done = new Set<string>();
  const out: PlanItem[] = [];
  const visiting = new Set<string>();
  const byRef = new Map(items.map((i) => [i.ref, i]));
  const visit = (i: PlanItem) => {
    if (done.has(i.ref) || visiting.has(i.ref)) return;
    visiting.add(i.ref);
    for (const b of i.blockedBy) if (refs.has(b)) visit(byRef.get(b)!);
    visiting.delete(i.ref);
    done.add(i.ref);
    out.push(i);
  };
  for (const i of items) visit(i);
  return out;
}

export interface ScheduleResult { overflow: string[]; teamCapacity: number; totalPoints: number }

/**
 * Story/task/bug ⇒ sprint sớm nhất mà (1) mọi thẻ chặn nó nằm ở sprint ≤ đó, (2) người làm còn sức trong sprint đó.
 * Hết sprint ⇒ vào sprint CUỐI + ghi `overflow` (cảnh báo trễ hạn). Hạn = ngày cuối sprint; việc con theo cha;
 * epic: hạn = hạn muộn nhất của con. Mốc: thẻ gắn mốc đầu tiên có ngày ≥ hạn của nó.
 * Kanban (không sprint): vẫn tính "tuần ảo" để có hạn, nhưng sprintRef = null.
 */
export function scheduleItems(p: Pick<PlanProject, 'items' | 'milestones' | 'type'>, sprints: SprintSlot[], members: PlanMember[], rules: AssignRule[], sprintWeeks: number): ScheduleResult {
  const overflow: string[] = [];
  const items = p.items;
  const byRef = new Map(items.map((i) => [i.ref, i]));
  const slots = sprints.length ? sprints : [];
  const memberCap = new Map(members.map((m) => [m.ref, pointsPerSprint(m, sprintWeeks, rules)]));
  const teamPer = [...memberCap.values()].reduce((a, b) => a + b, 0) || 10;
  const used = slots.map(() => new Map<string, number>());
  const teamUsed = slots.map(() => 0);
  const sprintIdx = new Map<string, number>();
  const totalPoints = items.filter(schedulable).reduce((n, i) => n + pts(i), 0);

  // Thẻ khoá tay giữ sprint của nó (tính vào sức đã dùng).
  for (const it of items.filter(schedulable)) {
    const idx = it.locked && it.sprintRef ? slots.findIndex((s) => s.ref === it.sprintRef) : -1;
    if (idx >= 0) {
      sprintIdx.set(it.ref, idx);
      const who = it.assigneeRef ?? '_';
      used[idx].set(who, (used[idx].get(who) ?? 0) + pts(it));
      teamUsed[idx] += pts(it);
    }
  }
  // Thẻ onboarding: luôn sprint đầu (việc ngày đầu tiên), không xét sức.
  if (slots.length) {
    for (const it of items.filter((i) => schedulable(i) && !sprintIdx.has(i.ref) && i.labels.includes('onboarding'))) {
      sprintIdx.set(it.ref, 0);
      const who = it.assigneeRef ?? '_';
      used[0].set(who, (used[0].get(who) ?? 0) + pts(it));
      teamUsed[0] += pts(it);
    }
  }
  // Ưu tiên: thứ tự phụ thuộc, rồi epic (theo thứ tự trong kế hoạch), rồi độ ưu tiên.
  const epicPos = new Map(items.filter((i) => i.kind === 'EPIC').map((e, n) => [e.ref, n]));
  const epicOf = (i: PlanItem) => { const par = i.parentRef ? byRef.get(i.parentRef) : undefined; return par?.kind === 'EPIC' ? par.ref : par?.parentRef ?? null; };
  const queue = topoOrder(items.filter(schedulable).filter((i) => !sprintIdx.has(i.ref))
    .sort((a, b) => (a.priority - b.priority) || ((epicPos.get(epicOf(a) ?? '') ?? 99) - (epicPos.get(epicOf(b) ?? '') ?? 99))));
  if (slots.length) {
    for (const it of queue) {
      const minIdx = Math.max(0, ...it.blockedBy.map((b) => sprintIdx.get(b) ?? 0));
      const who = it.assigneeRef ?? '_';
      const capWho = (k: number) => (memberCap.get(who) ?? teamPer / Math.max(1, members.length || 3)) * slots[k].factor;
      let placed = -1;
      for (let k = minIdx; k < slots.length; k++) {
        const u = used[k].get(who) ?? 0;
        const fitsPerson = u + pts(it) <= capWho(k) + 0.01 || (u === 0 && pts(it) > capWho(k)); // thẻ to hơn sức một sprint vẫn được nhận khi người đó rảnh
        const fitsTeam = teamUsed[k] + pts(it) <= teamPer * slots[k].factor * 1.05;
        if (fitsPerson && fitsTeam) { placed = k; break; }
      }
      if (placed < 0) { placed = slots.length - 1; overflow.push(it.ref); }
      sprintIdx.set(it.ref, placed);
      used[placed].set(who, (used[placed].get(who) ?? 0) + pts(it));
      teamUsed[placed] += pts(it);
    }
  }
  const isKanban = p.type === 'KANBAN';
  for (const it of items.filter(schedulable)) {
    const k = sprintIdx.get(it.ref);
    if (k === undefined) continue;
    if (!it.locked || !it.due) it.due = slots[k].end;
    if (!it.locked) it.sprintRef = isKanban ? null : slots[k].ref;
  }
  for (const s of items.filter((i) => i.kind === 'SUBTASK')) {
    const par = s.parentRef ? byRef.get(s.parentRef) : undefined;
    if (!par) continue;
    if (!s.locked) { s.sprintRef = par.sprintRef; if (par.due) s.due = par.due; }
  }
  for (const e of items.filter((i) => i.kind === 'EPIC')) {
    const kids = items.filter((c) => c.parentRef === e.ref && c.due).map((c) => c.due!);
    if (!e.locked && kids.length) e.due = kids.sort().at(-1)!;
    e.sprintRef = null;
  }
  const ms = [...p.milestones].sort((a, b) => a.date.localeCompare(b.date));
  for (const it of items) {
    if (it.locked && it.milestoneRef) continue;
    if (!it.due || !ms.length) continue;
    const m = ms.find((x) => x.date >= it.due!) ?? ms.at(-1)!;
    it.milestoneRef = m.ref;
  }
  return { overflow, teamCapacity: teamPer * slots.reduce((n, s) => n + s.factor, 0), totalPoints };
}

// ─── Cảnh báo ────────────────────────────────────────────────────

/** Chuỗi phụ thuộc dài nhất (theo điểm) — đường găng. */
export function criticalPath(items: PlanItem[]): { refs: string[]; points: number } {
  const byRef = new Map(items.filter(schedulable).map((i) => [i.ref, i]));
  const memo = new Map<string, { refs: string[]; points: number }>();
  const walk = (ref: string, depth: number): { refs: string[]; points: number } => {
    const hit = memo.get(ref);
    if (hit) return hit;
    const it = byRef.get(ref);
    if (!it || depth > 60) return { refs: [], points: 0 };
    let best = { refs: [] as string[], points: 0 };
    for (const b of it.blockedBy) {
      const r = walk(b, depth + 1);
      if (r.points > best.points) best = r;
    }
    const out = { refs: [...best.refs, ref], points: best.points + pts(it) };
    memo.set(ref, out);
    return out;
  };
  let top = { refs: [] as string[], points: 0 };
  for (const r of byRef.keys()) { const x = walk(r, 0); if (x.points > top.points) top = x; }
  return top;
}

export function planWarnings(
  p: PlanProject, members: PlanMember[], sprints: SprintSlot[], sched: ScheduleResult, input: SetupInput, rules: AssignRule[],
): PlanWarning[] {
  const w: PlanWarning[] = [];
  // Cảnh báo viết theo ngôn ngữ nội dung đã chọn (cả hai ⇒ tiếng Việt).
  const L = (vi: string, en: string) => (input.overview.language === 'en' ? en : vi);
  const add = (kind: PlanWarning['kind'], message: string, ref: string | null = null) => w.push({ kind, projectRef: p.ref, ref, message });
  if (!input.timeline.endDate) add('MISSING_INFO', L('Chưa có hạn chót — sprint kéo 10 tuần từ ngày bắt đầu. Nhập hạn chót để lập kế hoạch ngược từ đó.', 'No final deadline was given — sprints run 10 weeks from the start date. Set the deadline to plan backwards from it.'));
  if (!input.timeline.startDate) add('MISSING_INFO', L('Chưa có ngày bắt đầu — kế hoạch bắt đầu từ thứ Hai tới.', 'No start date — the plan starts next Monday.'));
  if (!members.length) add('MISSING_INFO', L('Chưa có thành viên — chưa giao được việc. Thêm danh sách để có phân công và cân tải.', 'No team members — nothing is assigned. Add the member list to get assignments and load balancing.'));
  const sprintWeeks = input.timeline.sprintWeeks || 2;
  const loadOf = new Map<string, number>();
  for (const i of p.items) if (schedulable(i) && i.assigneeRef) loadOf.set(i.assigneeRef, (loadOf.get(i.assigneeRef) ?? 0) + pts(i));
  const totalFactor = sprints.reduce((n, s) => n + s.factor, 0) || 1;
  for (const m of members) {
    const capPts = pointsPerSprint(m, sprintWeeks, rules) * totalFactor;
    const l = loadOf.get(m.ref) ?? 0;
    if (capPts > 0 && l > capPts * 1.1) {
      add('OVERLOAD', L(`${m.name} nhận ${Math.round(l)} điểm nhưng ${Math.round(m.hoursPerWeek)} giờ/tuần chỉ vừa khoảng ${Math.round(capPts)} — chuyển bớt việc hoặc tăng giờ.`, `${m.name} has ${Math.round(l)} points but about ${Math.round(capPts)} fit in ${Math.round(m.hoursPerWeek)} h/week — move work or raise their hours.`), m.ref);
    }
    if (m.mapping === 'PLACEHOLDER' && !m.email) add('NO_EMAIL', L(`${m.name} chưa có email — việc của bạn ấy được ghi “Planned owner” tới khi có người giao.`, `${m.name} has no email — their work is kept as “Planned owner” until someone assigns it.`), m.ref);
  }
  if (sched.overflow.length) {
    add('DEADLINE', L(`${sched.overflow.length} việc không kịp trước hạn chót với sức hiện tại (${Math.round(sched.totalPoints)} điểm so với ~${Math.round(sched.teamCapacity)}). Cắt bớt phạm vi, tăng giờ hoặc lùi hạn.`, `${sched.overflow.length} item(s) do not fit before the deadline at the current capacity (${Math.round(sched.totalPoints)} points vs ~${Math.round(sched.teamCapacity)}). Cut scope, add hours, or move the deadline.`));
  }
  const cp = criticalPath(p.items);
  if (cp.refs.length >= 2 && sprints.length) {
    const minSprints = Math.ceil(cp.points / Math.max(1, Math.max(...members.map((m) => pointsPerSprint(m, sprintWeeks, rules)), 4)));
    if (minSprints > sprints.length) add('DEADLINE', L(`Chuỗi phụ thuộc dài nhất (${cp.refs.length} việc, ${Math.round(cp.points)} điểm) cần khoảng ${minSprints} sprint nhưng trước hạn chót chỉ có ${sprints.length}.`, `The longest dependency chain (${cp.refs.length} items, ${Math.round(cp.points)} points) needs about ${minSprints} sprints but only ${sprints.length} fit before the deadline.`));
  }
  const mByRef = new Map(members.map((m) => [m.ref, m]));
  if (members.length) {
    const un = p.items.filter((i) => schedulable(i) && !i.assigneeRef);
    if (un.length) add('UNASSIGNED', L(`${un.length} việc chưa có người làm.`, `${un.length} item(s) have no assignee.`));
    for (const i of p.items) {
      const a = i.assigneeRef ? mByRef.get(i.assigneeRef) : undefined;
      if (a && i.difficulty === 3 && a.level <= 2 && !i.pairRef) add('BEGINNER_HARD', L(`“${i.title}” là việc khó mà ${a.name} đang làm một mình — ghép cặp với bạn mạnh hơn.`, `“${i.title}” is hard and assigned to ${a.name} alone — pair them with a stronger member.`), i.ref);
    }
  }
  return w;
}
