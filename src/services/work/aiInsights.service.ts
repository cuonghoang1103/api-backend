/**
 * CT Work — số liệu cho 3 công cụ AI của đồ án (25/09/2026):
 *   • Soát Req trước khi nộp (req_review)
 *   • Sức khoẻ nhóm / cảnh báo sớm (team_health)
 *   • Danh sách màn hình theo vai cho chế độ luyện bảo vệ (defenseScope)
 *
 * NGUYÊN TẮC: MÃ tính mọi con số và mọi vấn đề; model chỉ sắp xếp + diễn giải.
 * Cùng nguồn Req với file Project Tracking (loadRequirements) ⇒ AI nói "S22 thiếu
 * Evidence" thì file Excel cũng đang thiếu đúng chỗ đó.
 */

import { prisma } from '../../config/database.js';
import { loadRequirements, PHASE_LABELS, type ReqRow } from './projectTracking.service.js';

const DAY = 86_400_000;
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);
const today = () => { const d = new Date(); d.setUTCHours(0, 0, 0, 0); return d; };

/** Iteration "hiện tại": version chưa tới hạn gần nhất; hết thì cái cuối cùng. */
function currentIteration(rows: ReqRow[], wanted?: string | null): string | null {
  if (wanted?.trim()) return wanted.trim();
  const versions = new Map<string, Date | null>();
  for (const r of rows) if (r.version) versions.set(r.version.name, r.version.releaseDate);
  const now = today().getTime();
  const upcoming = [...versions.entries()].filter(([, d]) => d && d.getTime() >= now).sort((a, b) => a[1]!.getTime() - b[1]!.getTime());
  if (upcoming.length) return upcoming[0][0];
  const any = [...new Set(rows.map((r) => r.iteration).filter(Boolean))].sort();
  return any.at(-1) ?? null;
}

/** Vấn đề của MỘT Req, theo luật SWP391 (DoD + mẫu 5 việc/Req). */
export function reqProblems(r: ReqRow): string[] {
  const p: string[] = [];
  if (!r.assigneeId && !r.pic) p.push('no PIC/assignee');
  if (!r.screen) p.push('no Screen ID');
  if (r.unhappyCount < 3) p.push(`only ${r.unhappyCount} unhappy acceptance criteria (need ≥ 3)`);
  if (!/^L[23]\b/i.test(String(r.quality))) p.push(r.quality ? `Quality ${r.quality} (need L2+)` : 'Quality not set (need L2+)');
  r.phases.forEach((ph, i) => { if (ph && ph !== 'Done') p.push(`${PHASE_LABELS[i]} ${ph.toLowerCase()}`); });
  if (!r.done) p.push(`status ${r.status}`);
  if (!String(r.evidence).trim()) p.push('no Evidence link');
  return p;
}

export async function reqReviewFacts(projectId: number, iteration?: string | null): Promise<{ text: string; iteration: string | null; total: number; ready: number }> {
  const { project, rows } = await loadRequirements(projectId);
  const it = currentIteration(rows, iteration);
  const scope = it ? rows.filter((r) => r.iteration === it) : rows;
  const due = scope.find((r) => r.version?.releaseDate)?.version?.releaseDate ?? null;
  const daysLeft = due ? Math.ceil((due.getTime() - today().getTime()) / DAY) : null;
  const withProblems = scope.map((r) => ({ r, problems: reqProblems(r) }));
  const ready = withProblems.filter((x) => !x.problems.length).length;
  const lines = withProblems.map(({ r, problems }) =>
    `${r.key} ${r.screen} "${r.title}" PIC=${r.pic || '—'} planned=${num(r.planned)} quality=${r.quality || '—'} → ${problems.length ? problems.join('; ') : 'READY'}`);
  const text = [
    `Requirement check for ${project.name} (${project.key}), iteration ${it ?? 'all'}${due ? `, due ${due.toISOString().slice(0, 10)} (${daysLeft} day(s) left)` : ''}.`,
    `Rules: each Req needs a PIC, a Screen ID, ≥ 3 "Unhappy:" acceptance criteria, Quality L2 or better, SRS/SDS/Coding/Test/Integrate sub-tasks Done, status Done and an Evidence link.`,
    `${scope.length} requirement(s), ${ready} ready, ${scope.length - ready} with problems. (All counts computed by code — do not change them.)`,
    ...lines,
  ].join('\n');
  return { text, iteration: it, total: scope.length, ready };
}

export async function teamHealthFacts(projectId: number): Promise<{ text: string }> {
  const { project, rows } = await loadRequirements(projectId);
  const it = currentIteration(rows);
  const now = Date.now();
  const scope = it ? rows.filter((r) => r.iteration === it) : rows;
  const v = scope.find((r) => r.version)?.version;
  const elapsed = v?.startDate && v?.releaseDate
    ? Math.min(1, Math.max(0, (now - v.startDate.getTime()) / Math.max(DAY, v.releaseDate.getTime() - v.startDate.getTime())))
    : null;

  // LOC dự kiến vs đã xong, theo PIC
  const byPic = new Map<string, ReqRow[]>();
  for (const r of scope) byPic.set(r.pic || '(unassigned)', [...(byPic.get(r.pic || '(unassigned)') ?? []), r]);
  const people = [...byPic.entries()].map(([pic, list]) => {
    const planned = list.reduce((s, r) => s + num(r.planned), 0);
    const doneLoc = list.filter((r) => r.done).reduce((s, r) => s + num(r.planned), 0);
    const expected = elapsed === null ? null : Math.round(planned * elapsed);
    const behind = expected !== null && expected > 0 && doneLoc < expected * 0.7;
    return `${pic}: ${list.filter((r) => r.done).length}/${list.length} Req done, ${doneLoc}/${planned} planned LOC done${expected !== null ? `, expected ≈ ${expected} by now` : ''}${behind ? ' → BEHIND' : ''}`;
  });

  // Việc treo: đang làm mà 3 ngày không đổi gì và không có commit/PR nào gắn vào
  const stale = await prisma.workIssue.findMany({
    where: {
      projectId, deletedAt: null, status: { category: 'IN_PROGRESS' }, updatedAt: { lt: new Date(now - 3 * DAY) },
      NOT: { devActivity: { some: { updatedAt: { gte: new Date(now - 3 * DAY) } } } },
    },
    orderBy: { updatedAt: 'asc' }, take: 25,
    select: { number: true, title: true, updatedAt: true, assignee: { select: { username: true } } },
  });
  const overdue = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, dueDate: { lt: today() }, status: { category: { not: 'DONE' } } },
    orderBy: { dueDate: 'asc' }, take: 25,
    select: { number: true, title: true, dueDate: true, assignee: { select: { username: true } } },
  });
  const text = [
    `Team health for ${project.name} (${project.key}), iteration ${it ?? 'all'}${v?.releaseDate ? ` (ends ${v.releaseDate.toISOString().slice(0, 10)})` : ''}${elapsed !== null ? `, ${Math.round(elapsed * 100)}% of the iteration has passed` : ''}.`,
    'All numbers below are computed by code — do not change them. "BEHIND" = done LOC under 70% of what the elapsed time implies.',
    'Per person (requirements of this iteration):', ...(people.length ? people : ['(no requirements found — label issues "Req" or fill Screen ID)']),
    `In progress but untouched for 3+ days and no commit/PR in 3 days (${stale.length}):`,
    ...stale.map((s) => `${project.key}-${s.number} "${s.title}" @${s.assignee?.username ?? 'unassigned'} last change ${s.updatedAt.toISOString().slice(0, 10)}`),
    `Overdue and not done (${overdue.length}):`,
    ...overdue.map((o) => `${project.key}-${o.number} "${o.title}" @${o.assignee?.username ?? 'unassigned'} due ${o.dueDate!.toISOString().slice(0, 10)}`),
  ].join('\n');
  return { text };
}

/** Màn hình của một vai (C1…C5, hoặc 'me' = việc giao cho mình) cho chế độ luyện bảo vệ. */
export async function defenseScope(projectId: number, userId: number, focus: string): Promise<string> {
  const { rows } = await loadRequirements(projectId);
  const mine = focus === 'me'
    ? rows.filter((r) => r.assigneeId === userId)
    : focus === 'all' ? rows : rows.filter((r) => r.pic.toUpperCase().startsWith(focus.toUpperCase()));
  const list = (mine.length ? mine : rows).slice(0, 40);
  return list.map((r) => `${r.screen || r.key} ${r.title} (${r.wf || 'WF?'}, ${r.iteration || 'no iteration'}, PIC ${r.pic || '—'})`).join('\n') || '(no requirements labelled "Req" yet)';
}
