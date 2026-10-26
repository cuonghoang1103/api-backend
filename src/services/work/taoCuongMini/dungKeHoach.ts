/**
 * "Create with CuongMini" — RÁP kế hoạch từ đầu ra của model + phần mã tự tính. THUẦN (không CSDL, không mạng).
 *
 *   dự án/nhóm  ⇐ form (tên, mã, nhóm) — mã duy nhất trong không gian
 *   thành viên  ⇐ danh sách + vai đề xuất của bản tóm tắt + ghép tài khoản trong không gian (email / tên)
 *   thẻ         ⇐ khung (epic) + từng epic (story/task + việc con) + thẻ "Onboarding" mỗi người
 *   lịch/người  ⇐ lapLich.ts (sprint, giao việc, hạn, mốc, cảnh báo)
 *   trang       ⇐ model viết (điều lệ, yêu cầu, quy ước…) + mã viết (RACI, brief từng người, kế hoạch sprint, AGENTS.md,
 *                 tài nguyên, tổng quan danh mục)
 */

import { foldVi } from '../fold.js';
import {
  CAP, type AssignRule, type PlanItem, type PlanMember, type PlanPage, type PlanProject, type PlanWarning, type RosterRow, type SetupInput, type Understanding,
} from './kieu.js';
import { assignItems, buildSprints, planWarnings, scheduleItems, type SprintSlot } from './lapLich.js';
import type { EpicOut, OutlineOut } from './nhacLenh.js';

export const AGENTS_PAGE_TITLE = 'AGENTS.md — hướng dẫn cho CuongMini';

type Lang = SetupInput['overview']['language'];
/** Chữ của trang do MÃ viết theo ngôn ngữ đã chọn. */
export const tr = (lang: Lang, vi: string, en: string) => (lang === 'en' ? en : lang === 'both' ? `${vi} / ${en}` : vi);

// ─── Mã dự án ────────────────────────────────────────────────────

/** "SWP391 Nhóm 3" ⇒ "SN3" (khớp deriveKey của giao diện). */
export function deriveKey(name: string): string {
  const words = foldVi(name).toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);
  if (!words.length) return 'PRJ';
  let key = words.length > 1 ? words.map((w) => w[0]).join('') : words[0].slice(0, 3);
  key = key.replace(/^[0-9]+/, '');
  if (key.length < 2) key = (key + (words.find((w) => /^[A-Z]/.test(w)) ?? 'PRJ').slice(key.length ? 1 : 0)).slice(0, 3);
  if (!/^[A-Z]/.test(key)) key = `P${key}`;
  return key.slice(0, 10).padEnd(2, 'X');
}

/** Mã chưa ai dùng: KEY, KEY2, KEY3… (giữ ≤ 10 ký tự). */
export function uniqueKey(base: string, taken: Set<string>): string {
  const b = (/^[A-Z][A-Z0-9]{1,9}$/.test(base) ? base : deriveKey(base)).slice(0, 10);
  if (!taken.has(b)) { taken.add(b); return b; }
  for (let n = 2; n < 1000; n++) {
    const k = `${b.slice(0, 10 - String(n).length)}${n}`;
    if (!taken.has(k)) { taken.add(k); return k; }
  }
  throw new Error('No free project key');
}

export interface ResolvedProject { ref: string; name: string; key: string; topic: string; leader: string; rows: RosterRow[] }

/**
 * Dự án sẽ tạo. PROJECT: một dự án (tên trong form, trống ⇒ "CuongMini project"). WORKSPACE: theo danh sách nhóm; không
 * khai nhóm mà danh sách thành viên có cột "nhóm" ⇒ mỗi nhóm một dự án. Người không thuộc nhóm nào ⇒ cảnh báo.
 */
export function resolveProjects(input: SetupInput, takenKeys: Iterable<string>, mode: 'PROJECT' | 'WORKSPACE'): { projects: ResolvedProject[]; warnings: PlanWarning[] } {
  const taken = new Set([...takenKeys].map((k) => k.toUpperCase()));
  const warnings: PlanWarning[] = [];
  const rows = input.team.members;
  const L = (vi: string, en: string) => (input.overview.language === 'en' ? en : vi);
  if (mode === 'PROJECT') {
    const name = input.overview.name.trim() || (input.overview.courseCode ? `${input.overview.courseCode} project` : 'CuongMini project');
    return { projects: [{ ref: 'p1', name, key: uniqueKey(input.overview.key || deriveKey(name), taken), topic: '', leader: '', rows }], warnings };
  }
  let groups = input.groups;
  if (!groups.length) {
    const names = [...new Set(rows.map((r) => r.group.trim()).filter(Boolean))];
    groups = names.map((n) => ({ name: /^\d+$/.test(n) ? `${input.overview.courseCode || input.overview.name || 'Group'} ${n}` : n, key: '', topic: '', leader: '' }));
  }
  if (!groups.length) {
    warnings.push({ kind: 'MISSING_INFO', projectRef: null, ref: null, message: L('Chế độ không gian cần danh sách nhóm (hoặc cột “Nhóm” trong danh sách thành viên) — tạm lập kế hoạch một dự án.', 'Workspace mode needs a list of groups (or a “group” column in the member list). One project was planned instead.') });
    const name = input.overview.name.trim() || 'CuongMini project';
    return { projects: [{ ref: 'p1', name, key: uniqueKey(input.overview.key || deriveKey(name), taken), topic: '', leader: '', rows }], warnings };
  }
  if (groups.length > CAP.projectsPerRun) {
    warnings.push({ kind: 'CAP', projectRef: null, ref: null, message: L(`Mỗi lượt chỉ lập kế hoạch ${CAP.projectsPerRun} nhóm đầu.`, `Only the first ${CAP.projectsPerRun} groups are planned in one run.`) });
    groups = groups.slice(0, CAP.projectsPerRun);
  }
  const matchGroup = (row: RosterRow, g: { name: string }, idx: number) => {
    const a = foldVi(row.group).trim();
    if (!a) return false;
    const b = foldVi(g.name).trim();
    return a === b || b.endsWith(` ${a}`) || a === String(idx + 1) || b.includes(a) && /\d/.test(a);
  };
  const projects = groups.map((g, idx) => ({
    ref: `p${idx + 1}`, name: g.name.slice(0, 120), key: uniqueKey(g.key || deriveKey(g.name), taken), topic: g.topic, leader: g.leader,
    rows: rows.filter((r) => matchGroup(r, g, idx)),
  }));
  const placed = new Set(projects.flatMap((p) => p.rows));
  const lost = rows.filter((r) => !placed.has(r));
  if (lost.length) warnings.push({ kind: 'MISSING_INFO', projectRef: null, ref: null, message: L(`${lost.length} người không khớp nhóm nào nên chưa được xếp: `, `${lost.length} member(s) have no matching group and were left out: `) + `${lost.slice(0, 6).map((r) => r.name).join(', ')}${lost.length > 6 ? '…' : ''}` });
  for (const p of projects) if (p.rows.length > CAP.membersPerProject) {
    warnings.push({ kind: 'CAP', projectRef: p.ref, ref: null, message: L(`${p.name}: mỗi dự án chỉ xếp ${CAP.membersPerProject} người.`, `${p.name}: only ${CAP.membersPerProject} members per project are planned.`) });
    p.rows = p.rows.slice(0, CAP.membersPerProject);
  }
  return { projects, warnings };
}

// ─── Thành viên ──────────────────────────────────────────────────

export interface WsPerson { id: number; email: string | null; username: string; fullName: string | null; displayName: string | null }

const isLeaderRole = (s: string) => /(leader|lead\b|truong nhom|nhom truong|pm\b|project manager|scrum master)/.test(foldVi(s));

/** Dòng danh sách ⇒ thành viên kế hoạch: ghép tài khoản TRONG không gian (email, rồi họ tên/username khớp đúng). */
export function buildMembers(
  projects: ResolvedProject[], u: Understanding | null, ws: WsPerson[], sendInvites: boolean,
): PlanMember[] {
  const out: PlanMember[] = [];
  const used = new Set<number>();
  let n = 0;
  for (const p of projects) {
    const rows = p.rows;
    for (const r of rows) {
      n += 1;
      const em = r.email.toLowerCase();
      const fold = foldVi(r.name).trim();
      const hit = ws.find((w) => !used.has(w.id) && ((em && w.email?.toLowerCase() === em) || (!!fold && [w.fullName, w.displayName, w.username].some((x) => x && foldVi(x).trim() === fold))));
      if (hit) used.add(hit.id);
      const um = u?.team.find((t) => (r.studentId && t.studentId && t.studentId.toUpperCase() === r.studentId.toUpperCase()) || foldVi(t.name).trim() === fold);
      out.push({
        ref: `m${n}`, name: r.name, studentId: r.studentId, email: r.email, role: um?.proposedRole || r.role, skills: r.skills, level: r.level,
        hoursPerWeek: r.hoursPerWeek, prefs: r.prefs, projectRef: p.ref, leader: false,
        mapping: hit ? 'USER' : r.email && sendInvites ? 'INVITE' : 'PLACEHOLDER', userId: hit?.id ?? null, why: um?.why ?? '',
      });
    }
    // Trưởng nhóm: tên trong form nhóm > vai "Leader" > người level cao nhất (nhiều giờ nhất khi bằng nhau).
    const mine = out.filter((m) => m.projectRef === p.ref);
    const lf = foldVi(p.leader).trim();
    const lead = (lf && mine.find((m) => foldVi(m.name).trim() === lf || m.studentId.toUpperCase() === p.leader.toUpperCase()))
      || mine.find((m) => isLeaderRole(m.role))
      || [...mine].sort((a, b) => (b.level - a.level) || (b.hoursPerWeek - a.hoursPerWeek))[0];
    if (lead) {
      lead.leader = true;
      if (!lead.role || !isLeaderRole(lead.role)) lead.role = lead.role ? `Leader · ${lead.role}` : 'Leader';
    }
  }
  return out;
}

export const memberLine = (m: PlanMember) => `${m.name}${m.studentId ? ` (${m.studentId})` : ''} — ${m.role || 'member'}, level ${m.level}/5, ${m.hoursPerWeek} h/week${m.skills ? `, skills: ${m.skills}` : ''}${m.prefs ? `, wants: ${m.prefs}` : ''}${m.leader ? ' [LEADER]' : ''}`;

// ─── Thẻ từ đầu ra model ─────────────────────────────────────────

/** Khung + từng epic ⇒ PlanItem[] (ref i1, i2…). Phụ thuộc giữa epic: story ĐẦU của epic sau bị chặn bởi story CUỐI của epic trước. */
export function itemsFromModel(outline: OutlineOut, epics: Array<{ key: string; out: EpicOut | null }>, detail: SetupInput['split']['detail']): { items: PlanItem[]; keyMap: Map<string, string> } {
  const items: PlanItem[] = [];
  let n = 0;
  const next = () => `i${++n}`;
  const epicRef = new Map<string, string>();
  const keyToRef = new Map<string, string>();
  const firstOf = new Map<string, string>();
  const lastOf = new Map<string, string>();
  const base = (o: Partial<PlanItem> & Pick<PlanItem, 'ref' | 'kind' | 'title'>): PlanItem => ({
    parentRef: null, description: '', criteria: [], points: null, priority: 3, difficulty: 2, labels: [], component: '', area: '',
    assigneeRef: null, pairRef: null, sprintRef: null, milestoneRef: null, due: null, blockedBy: [], locked: false, ...o,
  });
  for (const e of outline.epics.slice(0, CAP.epicsPerProject)) {
    if (!e.title) continue;
    const ref = next();
    epicRef.set(e.key || ref, ref);
    items.push(base({ ref, kind: 'EPIC', title: e.title, description: e.description, priority: e.priority, labels: e.labels, component: e.component, area: e.area }));
  }
  for (const { key, out } of epics) {
    const parent = epicRef.get(key);
    if (!parent || !out) continue;
    const list = out.items.filter((x) => x.title).slice(0, CAP.storiesPerEpic);
    for (const s of list) {
      const ref = next();
      if (s.key) keyToRef.set(s.key, ref);
      if (!firstOf.has(parent)) firstOf.set(parent, ref);
      lastOf.set(parent, ref);
      items.push(base({
        ref, kind: s.kind, parentRef: parent, title: s.title, description: s.description, criteria: s.criteria, points: s.points, priority: s.priority,
        difficulty: s.difficulty, labels: s.labels, component: s.component, area: s.area, blockedBy: s.blockedBy,
      }));
      if (detail === 'SUBTASKS') {
        for (const st of s.subtasks.filter((x) => x.title).slice(0, CAP.subtasksPerStory)) {
          items.push(base({ ref: next(), kind: 'SUBTASK', parentRef: ref, title: st.title, area: st.area || s.area, difficulty: 1, priority: s.priority }));
        }
      }
    }
  }
  // Khoá model ⇒ ref; khoá lạ (trỏ ra ngoài epic/không có) ⇒ bỏ.
  for (const it of items) it.blockedBy = [...new Set(it.blockedBy.map((k) => keyToRef.get(k)).filter((x): x is string => !!x && x !== it.ref))];
  for (const e of outline.epics) {
    const me = epicRef.get(e.key);
    const head = me ? firstOf.get(me) : undefined;
    if (!head) continue;
    for (const d of e.dependsOn) {
      const tail = lastOf.get(epicRef.get(d) ?? '');
      const h = items.find((i) => i.ref === head)!;
      if (tail && !h.blockedBy.includes(tail)) h.blockedBy.push(tail);
    }
  }
  return { items, keyMap: keyToRef };
}

/** Thẻ "Onboarding — <Tên>" cho từng người: dựng repo, đọc Docs, nối CuongMini/CT Work. */
export function onboardingItems(members: PlanMember[], lang: Lang, startRef: number, hasRepo: boolean): PlanItem[] {
  return members.map((m, k) => ({
    ref: `ob${startRef + k}`, kind: 'TASK' as const, parentRef: null,
    title: `${tr(lang, 'Onboarding', 'Onboarding')} — ${m.name}`,
    description: tr(lang,
      `Việc đầu tiên của ${m.name}: chuẩn bị môi trường, đọc tài liệu dự án, nối CuongMini. Đọc "Brief từng thành viên" để biết bạn phụ trách gì.`,
      `${m.name}'s first task: set up the environment, read the project docs, connect CuongMini. Read “Member briefs” to see what you own.`),
    criteria: [
      ...(hasRepo ? [tr(lang, 'Clone repo, chạy được dự án ở máy mình', 'Clone the repo and run the project locally')] : []),
      tr(lang, 'Đọc Project charter, Team working agreement, Git guide', 'Read the Project charter, Team working agreement and Git guide'),
      tr(lang, 'Đọc trang AGENTS.md — hướng dẫn cho CuongMini', 'Read the “AGENTS.md — hướng dẫn cho CuongMini” page'),
      tr(lang, 'Kết nối CuongMini (app/CLI) với CT Work', 'Connect CuongMini (app/CLI) to CT Work'),
      tr(lang, 'Xem 3 việc đầu tiên của mình trên board', 'Review your first 3 tasks on the board'),
    ],
    points: 1, priority: 2, difficulty: 1, labels: ['onboarding'], component: '', area: 'pm',
    assigneeRef: m.ref, pairRef: null, sprintRef: null, milestoneRef: null, due: null, blockedBy: [], locked: false,
  }));
}

/** Trần thẻ một dự án: bỏ việc con trước, rồi story ưu tiên thấp nhất. */
export function capItems(items: PlanItem[], max: number = CAP.issuesPerProject): { items: PlanItem[]; dropped: number } {
  if (items.length <= max) return { items, dropped: 0 };
  let list = [...items];
  const before = list.length;
  const subs = list.filter((i) => i.kind === 'SUBTASK').sort((a, b) => b.priority - a.priority);
  while (list.length > max && subs.length) { const s = subs.shift()!; list = list.filter((i) => i !== s); }
  const stories = list.filter((i) => i.kind !== 'EPIC' && i.kind !== 'SUBTASK' && !i.labels.includes('onboarding')).sort((a, b) => b.priority - a.priority);
  while (list.length > max && stories.length) {
    const s = stories.shift()!;
    list = list.filter((i) => i !== s && i.parentRef !== s.ref);
  }
  const keep = new Set(list.map((i) => i.ref));
  for (const i of list) i.blockedBy = i.blockedBy.filter((b) => keep.has(b));
  return { items: list.slice(0, max), dropped: before - list.length };
}

// ─── Mốc ─────────────────────────────────────────────────────────

/** Mốc từ form + hạn deliverable trong bản tóm tắt (ngày dạng YYYY-MM-DD hoặc DD/MM/YYYY). */
export function milestonesFor(input: SetupInput, u: Understanding | null, end: string | null): PlanProject['milestones'] {
  const out: PlanProject['milestones'] = [];
  const seen = new Set<string>();
  const add = (name: string, date: string, description = '') => {
    const k = foldVi(name).trim();
    if (!name.trim() || seen.has(k)) return;
    seen.add(k);
    out.push({ ref: `v${out.length + 1}`, name: name.slice(0, 120), date, description });
  };
  for (const m of input.timeline.milestones) add(m.name, m.date);
  for (const d of u?.deliverables ?? []) {
    const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(d.due);
    const vn = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(d.due);
    const date = iso ? iso[0] : vn ? `${vn[3]}-${vn[2].padStart(2, '0')}-${vn[1].padStart(2, '0')}` : null;
    if (date) add(d.name, date, d.criteria);
  }
  if (end && !out.some((m) => m.date === end)) add('Final delivery', end);
  return out.sort((a, b) => a.date.localeCompare(b.date)).slice(0, CAP.milestones).map((m, i) => ({ ...m, ref: `v${i + 1}` }));
}

// ─── Họp ─────────────────────────────────────────────────────────

export function meetingsFor(input: SetupInput, sprints: SprintSlot[], lang: Lang): PlanProject['meetings'] {
  if (!input.split.meetings) return [];
  const t = input.timeline;
  /* 27/10/2026: kickoff = buổi ĐẦU TIÊN đúng thứ họp trong 7 ngày từ ngày bắt đầu. Trước đây startDate = endDate = ngày
     bắt đầu ⇒ dự án không bắt đầu đúng thứ họp (vd bắt đầu thứ Ba, họp thứ Hai) thì không có buổi nào ⇒ áp dụng báo
     "This repeat rule has no upcoming meetings". */
  const themNgay = (iso: string, n: number): string => new Date(Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
  const start = sprints[0]?.start ?? t.startDate;
  const end = sprints.at(-1)?.end ?? (t.endDate || null);
  if (!start) return [];
  const [h, mi] = (t.meeting?.time ?? '20:00').split(':').map(Number);
  const wd = t.meeting?.weekday ?? 1;
  const weeks = Math.max(1, t.sprintWeeks || 2);
  const out: PlanProject['meetings'] = [
    { ref: 'mt1', title: tr(lang, 'Họp khởi động dự án', 'Project kickoff'), type: 'KICKOFF', weekday: wd, hour: h, minute: mi || 0, durationMin: 60, intervalWeeks: 1, startDate: start, endDate: themNgay(start, 6),
      agenda: [tr(lang, 'Giới thiệu, vai trò', 'Introductions & roles'), tr(lang, 'Mục tiêu, phạm vi, deliverable', 'Goal, scope, deliverables'), tr(lang, 'Lịch, mốc, sprint', 'Timeline, milestones, sprints'), tr(lang, 'Cách làm việc, công cụ', 'Ways of working, tools'), tr(lang, 'Rủi ro, câu hỏi', 'Risks, Q&A')] },
    { ref: 'mt2', title: tr(lang, 'Họp nhóm hằng tuần', 'Weekly team meeting'), type: 'WEEKLY', weekday: wd, hour: h, minute: mi || 0, durationMin: t.meeting?.durationMin ?? 45, intervalWeeks: 1, startDate: start, endDate: end,
      agenda: [tr(lang, 'Mỗi người: đã làm / sẽ làm / vướng gì', 'Each member: done / next / blockers'), tr(lang, 'Xem board + burndown', 'Board & burndown'), tr(lang, 'Rủi ro mới', 'New risks'), tr(lang, 'Việc cho tuần tới', 'Actions for next week')] },
  ];
  if (input.overview.type === 'SCRUM' && sprints.length) {
    out.push({ ref: 'mt3', title: tr(lang, 'Sprint review + retro + planning', 'Sprint review + retro + planning'), type: 'PLANNING', weekday: wd, hour: h, minute: mi || 0, durationMin: 90, intervalWeeks: weeks, startDate: sprints[1]?.start ?? start, endDate: end,
      agenda: [tr(lang, 'Demo việc đã xong (review)', 'Demo finished work (review)'), tr(lang, 'Retro: giữ / bỏ / thử', 'Retro: keep / drop / try'), tr(lang, 'Chọn việc + mục tiêu sprint mới', 'Pick work + goal for the next sprint')] });
  }
  return out;
}

// ─── Trang do mã viết ────────────────────────────────────────────

const mdEsc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');

export function raciPage(p: PlanProject, members: PlanMember[], lang: Lang, stakeholders: string): PlanPage {
  const mine = members.filter((m) => m.projectRef === p.ref);
  const epics = p.items.filter((i) => i.kind === 'EPIC');
  const lead = mine.find((m) => m.leader);
  const rows: string[] = [];
  for (const e of epics) {
    const kids = p.items.filter((i) => i.parentRef === e.ref);
    const doers = new Set(kids.map((k) => k.assigneeRef).filter(Boolean) as string[]);
    const cells = mine.map((m) => {
      if (e.assigneeRef === m.ref) return lead?.ref === m.ref ? 'A/R' : 'R';
      if (lead?.ref === m.ref) return 'A';
      if (doers.has(m.ref)) return 'C';
      return 'I';
    });
    rows.push(`| ${mdEsc(e.title)} | ${cells.join(' | ')} |`);
  }
  const head = `| ${tr(lang, 'Hạng mục / deliverable', 'Work package / deliverable')} | ${mine.map((m) => mdEsc(m.name)).join(' | ')} |`;
  const sep = `|---|${mine.map(() => ':-:').join('|')}|`;
  const md = [
    `# RACI`,
    tr(lang, '**R** = làm chính · **A** = chịu trách nhiệm cuối (duyệt) · **C** = được hỏi ý kiến · **I** = được thông báo.', '**R** = Responsible · **A** = Accountable (approves) · **C** = Consulted · **I** = Informed.'),
    stakeholders ? `${tr(lang, 'Bên liên quan ngoài nhóm (giảng viên/khách) luôn ở mức I, và A cho bản nộp cuối', 'External stakeholders (lecturer/client) are I, and A for the final submission')}: ${stakeholders}` : '',
    '', mine.length ? `${head}\n${sep}\n${rows.join('\n')}` : tr(lang, '_Chưa có thành viên._', '_No members yet._'),
  ].filter((x) => x !== '').join('\n\n');
  return { ref: `${p.ref}-raci`, kind: 'RACI', title: tr(lang, 'Ma trận RACI', 'RACI matrix'), markdown: md };
}

export function memberBriefs(p: PlanProject, members: PlanMember[], lang: Lang, sprintWeeks: number): Map<string, string> {
  const out = new Map<string, string>();
  const byRef = new Map(p.items.map((i) => [i.ref, i]));
  const mByRef = new Map(members.map((m) => [m.ref, m]));
  const pts = (i: PlanItem) => i.points ?? (i.kind === 'SUBTASK' ? 0 : 1);
  const totalWeeks = Math.max(1, p.sprints.length * sprintWeeks);
  for (const m of members.filter((x) => x.projectRef === p.ref)) {
    const mine = p.items.filter((i) => i.assigneeRef === m.ref && i.kind !== 'SUBTASK' && i.kind !== 'EPIC' && !i.labels.includes('onboarding'));
    const epics = p.items.filter((i) => i.kind === 'EPIC' && i.assigneeRef === m.ref);
    const first3 = [...mine].sort((a, b) => (a.due ?? '9').localeCompare(b.due ?? '9') || a.priority - b.priority).slice(0, 3);
    const deps = new Set<string>();
    for (const i of mine) for (const b of i.blockedBy) { const who = byRef.get(b)?.assigneeRef; if (who && who !== m.ref) deps.add(mByRef.get(who)?.name ?? ''); }
    const paired = p.items.filter((i) => i.pairRef === m.ref).length;
    const load = mine.reduce((n, i) => n + pts(i), 0);
    const hoursNeeded = Math.round(load * 4);
    const hoursHave = Math.round(m.hoursPerWeek * totalWeeks);
    const L = [
      `## ${m.name}${m.studentId ? ` · ${m.studentId}` : ''} — ${m.role || tr(lang, 'thành viên', 'member')}`,
      m.why ? `_${m.why}_` : '',
      `- **${tr(lang, 'Phụ trách', 'You own')}:** ${epics.length ? epics.map((e) => e.title).join('; ') : tr(lang, 'các việc được giao bên dưới', 'the tasks below')}`,
      `- **${tr(lang, '3 việc đầu tiên', 'Your first 3 tasks')}:** ${first3.length ? first3.map((i) => `${i.title}${i.due ? ` (${tr(lang, 'hạn', 'due')} ${i.due})` : ''}`).join('; ') : '—'}`,
      `- **${tr(lang, 'Phụ thuộc vào', 'You depend on')}:** ${deps.size ? [...deps].filter(Boolean).join(', ') : '—'}`,
      paired ? `- **${tr(lang, 'Kèm cặp', 'Pairing')}:** ${tr(lang, `hỗ trợ ${paired} việc khó của bạn cùng nhóm`, `you support ${paired} hard item(s) of a teammate`)}` : '',
      `- **${tr(lang, 'Tải', 'Load')}:** ${Math.round(load)} ${tr(lang, 'điểm', 'points')} ≈ ${hoursNeeded} h · ${tr(lang, 'giờ rảnh', 'available')} ≈ ${hoursHave} h (${m.hoursPerWeek} h/${tr(lang, 'tuần', 'week')})${hoursNeeded > hoursHave * 1.1 ? ` ⚠️ ${tr(lang, 'quá tải', 'overloaded')}` : ''}`,
      m.mapping !== 'USER' ? `- _${tr(lang, 'Chưa có tài khoản CT Work — việc được ghi "Planned owner" tới khi bạn vào nhóm.', 'No CT Work account yet — your work is marked “Planned owner” until you join.')}_` : '',
    ].filter(Boolean);
    out.set(m.ref, L.join('\n'));
  }
  return out;
}

export function memberBriefsPage(p: PlanProject, briefs: Map<string, string>, lang: Lang): PlanPage {
  return { ref: `${p.ref}-briefs`, kind: 'MEMBER_BRIEFS', title: tr(lang, 'Brief từng thành viên', 'Member briefs'), markdown: `# ${tr(lang, 'Brief từng thành viên', 'Member briefs')}\n\n${[...briefs.values()].join('\n\n') || '—'}` };
}

export function sprintPlanMarkdown(p: PlanProject, lang: Lang): string {
  const rows = p.sprints.map((s) => {
    const its = p.items.filter((i) => i.sprintRef === s.ref && i.kind !== 'SUBTASK');
    const pts = its.reduce((n, i) => n + (i.points ?? 1), 0);
    return `| ${s.name} | ${s.start} → ${s.end} | ${mdEsc(s.goal || '—')} | ${its.length} | ${pts} |`;
  });
  const ms = p.milestones.map((m) => `- **${m.name}** — ${m.date}${m.description ? `: ${m.description}` : ''}`);
  return [
    `## ${tr(lang, 'Kế hoạch sprint', 'Sprint plan')}`,
    rows.length ? `| Sprint | ${tr(lang, 'Thời gian', 'Dates')} | ${tr(lang, 'Mục tiêu', 'Goal')} | ${tr(lang, 'Số việc', 'Items')} | ${tr(lang, 'Điểm', 'Points')} |\n|---|---|---|--:|--:|\n${rows.join('\n')}` : tr(lang, '_Kanban — không có sprint._', '_Kanban — no sprints._'),
    ms.length ? `## ${tr(lang, 'Mốc', 'Milestones')}\n${ms.join('\n')}` : '',
  ].filter(Boolean).join('\n\n');
}

export function agentsPage(p: PlanProject, input: SetupInput, members: PlanMember[], lang: Lang, wsSlug: string): PlanPage {
  const mine = members.filter((m) => m.projectRef === p.ref);
  const md = [
    `# AGENTS.md — ${tr(lang, 'hướng dẫn cho CuongMini', 'instructions for CuongMini')}`,
    tr(lang, 'CuongMini (app, CLI, extension) tự đọc trang này khi làm việc trong dự án. Nhóm sửa trang này để dạy CuongMini quy ước của mình.', 'CuongMini (app, CLI, extension) reads this page automatically when working in this project. Edit it to teach CuongMini your conventions.'),
    `## ${tr(lang, 'Dự án', 'Project')}\n- ${tr(lang, 'Tên', 'Name')}: ${p.name} (\`${p.key}\`)\n- ${tr(lang, 'Mục tiêu', 'Goal')}: ${p.description || input.overview.goal || '—'}${input.overview.courseCode ? `\n- ${tr(lang, 'Môn', 'Course')}: ${input.overview.courseCode}` : ''}${input.code.repoUrl ? `\n- Repo: ${input.code.repoUrl}${input.code.branch ? ` (branch \`${input.code.branch}\`)` : ''}` : ''}${input.code.stack ? `\n- Stack: ${input.code.stack}` : ''}`,
    `## ${tr(lang, 'Nhóm', 'Team')}\n${mine.map((m) => `- ${m.name}${m.studentId ? ` (${m.studentId})` : ''} — ${m.role || 'member'}`).join('\n') || '—'}`,
    `## ${tr(lang, 'Quy ước', 'Conventions')}\n- ${tr(lang, 'Nhánh', 'Branches')}: \`feature/${p.key}-<số>-mo-ta-ngan\`, \`fix/${p.key}-<số>-…\`\n- Commit: Conventional Commits ${tr(lang, 'kèm mã thẻ', 'with the issue key')} — \`feat(${p.key}-12): …\`\n- ${tr(lang, 'Mỗi PR cần ít nhất 1 người review; trưởng nhóm duyệt trước khi merge vào main.', 'Every PR needs at least one review; the leader approves before merging to main.')}${input.code.conventions ? `\n- ${input.code.conventions.replace(/\n+/g, '\n- ')}` : ''}`,
    `## ${tr(lang, 'Khi CuongMini làm một thẻ', 'When CuongMini works on an issue')}\n1. ${tr(lang, 'Đọc thẻ + tiêu chí nghiệm thu + trang liên quan trước khi sửa mã.', 'Read the issue, its acceptance criteria and linked pages before changing code.')}\n2. ${tr(lang, 'Làm nhỏ, chạy test, ghi bằng chứng vào bình luận.', 'Work in small steps, run the tests, leave evidence in a comment.')}\n3. ${tr(lang, 'Chuyển "Done" sẽ vào Review — người trong nhóm đóng thẻ.', 'Moving to “Done” lands in Review — a team member closes it.')}\n4. ${tr(lang, 'Không tự đổi phạm vi; hỏi trưởng nhóm khi chưa rõ.', 'Do not change scope on your own; ask the leader when unsure.')}`,
    `## ${tr(lang, 'Tài liệu chính', 'Key docs')}\n- ${tr(lang, 'Điều lệ dự án, Yêu cầu, Quy ước nhóm, Git guide, Checklist review, Brief từng thành viên', 'Project charter, Requirements, Team working agreement, Git guide, Code review checklist, Member briefs')}\n- Board: /work/${wsSlug}/${p.key}/board`,
  ].join('\n\n');
  return { ref: `${p.ref}-agents`, kind: 'AGENTS', title: AGENTS_PAGE_TITLE, markdown: md };
}

export function resourcesPage(p: PlanProject, sources: Array<{ name: string; kind: string; url?: string; note: string; category: string }>, lang: Lang): PlanPage {
  const rows = sources.map((s) => `| ${mdEsc(s.name)} | ${s.category} | ${s.url ? s.url : tr(lang, 'tệp đính kèm thẻ "Tài liệu dự án"', 'attached to the “Project materials” issue')} | ${mdEsc(s.note || '—')} |`);
  return {
    ref: `${p.ref}-res`, kind: 'RESOURCES_GUIDE', title: tr(lang, 'Tài nguyên & dữ liệu mẫu', 'Resources & sample data'),
    markdown: `# ${tr(lang, 'Tài nguyên & dữ liệu mẫu', 'Resources & sample data')}\n\n${tr(lang, 'Mọi tệp và link nhóm đã đưa cho CuongMini — kèm ghi chú cách dùng.', 'Every file and link given to CuongMini — with notes on how to use them.')}\n\n| ${tr(lang, 'Tên', 'Name')} | ${tr(lang, 'Loại', 'Type')} | ${tr(lang, 'Ở đâu', 'Where')} | ${tr(lang, 'Cách dùng', 'How to use')} |\n|---|---|---|---|\n${rows.join('\n') || '| — | | | |'}`,
  };
}

export function portfolioPage(projects: PlanProject[], members: PlanMember[], lang: Lang, wsSlug: string): PlanPage {
  const rows = projects.map((p) => {
    const lead = members.find((m) => m.projectRef === p.ref && m.leader);
    const n = members.filter((m) => m.projectRef === p.ref).length;
    const next = p.milestones[0];
    return `| [${mdEsc(p.name)}](/work/${wsSlug}/${p.key}/board) | \`${p.key}\` | ${lead ? mdEsc(lead.name) : '—'} | ${n} | ${p.items.filter((i) => i.kind !== 'EPIC' && i.kind !== 'SUBTASK').length} | ${next ? `${mdEsc(next.name)} (${next.date})` : '—'} |`;
  });
  const ms = [...new Map(projects.flatMap((p) => p.milestones).map((m) => [`${m.name}|${m.date}`, m])).values()].sort((a, b) => a.date.localeCompare(b.date));
  return {
    ref: 'portfolio', kind: 'OVERVIEW', title: tr(lang, 'Tổng quan danh mục (mọi nhóm)', 'Portfolio overview (all groups)'),
    markdown: `# ${tr(lang, 'Tổng quan danh mục', 'Portfolio overview')}\n\n| ${tr(lang, 'Nhóm / dự án', 'Group / project')} | ${tr(lang, 'Mã', 'Key')} | ${tr(lang, 'Trưởng nhóm', 'Leader')} | ${tr(lang, 'Người', 'People')} | ${tr(lang, 'Việc', 'Items')} | ${tr(lang, 'Mốc kế', 'Next milestone')} |\n|---|---|---|--:|--:|---|\n${rows.join('\n')}\n\n## ${tr(lang, 'Mốc chung', 'Shared milestones')}\n${ms.map((m) => `- **${m.name}** — ${m.date}`).join('\n') || '—'}\n\n${tr(lang, 'Trang workspace “Portfolio” hiện tiến độ sống của mọi dự án.', 'The workspace “Portfolio” page shows live progress of every project.')}`,
  };
}

// ─── Chốt một dự án: giao việc + lịch + cảnh báo ─────────────────

export function finalizeProject(p: PlanProject, allMembers: PlanMember[], input: SetupInput, today: string, opts: { rebuildSprints?: boolean } = {}): PlanWarning[] {
  const members = allMembers.filter((m) => m.projectRef === p.ref);
  const rules = input.team.rules as AssignRule[];
  const weeks = input.timeline.sprintWeeks || 2;
  if (opts.rebuildSprints || !p.sprints.length) {
    const slots = buildSprints(input.timeline, today);
    const goals = new Map(p.sprints.map((s) => [s.ref, s.goal]));
    p.sprints = slots.map((s) => ({ ref: s.ref, name: s.name, goal: goals.get(s.ref) ?? s.goal, start: s.start, end: s.end }));
  }
  const slots: SprintSlot[] = p.sprints.map((s) => ({ ...s, factor: 1 }));
  if (input.split.assign) assignItems(p.items, members, rules, weeks);
  const sched = scheduleItems(p, p.type === 'KANBAN' ? slots : slots, members, rules, weeks);
  if (p.type === 'KANBAN') p.sprints = [];
  return planWarnings(p, members, slots, sched, input, rules);
}
