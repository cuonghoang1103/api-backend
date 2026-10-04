/**
 * CT Work — đợt S4: dạng dữ liệu của BÁO CÁO (tuần cho khách / steering nội bộ / thuyết trình) và
 * cách viết nó thành Markdown + dòng email. THUẦN — test ở finance.test.ts. Không LLM: mọi câu
 * chữ ở đây là khuôn cố định điền số liệu đã đếm.
 */

export interface ReportItem { key: string; title: string }

export interface ReportData {
  formatVersion: 1;
  audience: 'client' | 'internal';
  project: { key: string; name: string };
  period: { from: string; to: string };
  generatedAt: string;
  stages: Array<{ n: number; name: string; status: string; percent: number }> | null;
  currentStage: { n: number; name: string; status: string; percent: number } | null;
  overallPercent: number | null;
  completed: ReportItem[];
  inProgress: ReportItem[];
  waitingOnClient: Array<{ title: string; kind: 'UAT' | 'APPROVAL'; dueAt: string | null }>;
  upcoming: {
    versions: Array<{ name: string; releaseDate: string | null; items: number; done: number }>;
    payments: Array<{ number: number; name: string; amount: number | null; dueDate: string | null; status: string }> | null;
  };
  currency: string | null;
  changes: Array<{ number: number; title: string; status: string; scheduleDays: number | null; costAmount: number | null; costCurrency: string | null }> | null;
  risks: Array<{ key: string; title: string; level: string | null; response: string | null; mitigation: string | null }> | null;
  nextSteps: ReportItem[];
  counts: { completed: number; inProgress: number; open: number };
  /**
   * Đợt S5a — chỉ số TỔNG của service desk trong kỳ (mô-đun serviceDesk). Khách: chỉ yêu cầu đã chia sẻ; không mã,
   * không tên, không chi tiết vi phạm. Không có trường này (báo cáo cũ / mô-đun tắt) ⇒ không in mục nào.
   */
  serviceDesk?: { received: number; resolved: number; open: number; firstResponsePercent: number | null; resolutionPercent: number | null; csatAvg: number | null; csatCount: number } | null;
  /** Chỉ báo cáo NỘI BỘ (steering). */
  internal?: {
    overdue: Array<ReportItem & { dueDate: string | null; assignee: string | null }>;
    pendingApprovals: number;
    raid: { open: Record<string, number>; top: Array<{ key: string; title: string; score: number | null; level: string | null; owner: string | null }> } | null;
    workload: Array<{ name: string; open: number; remainingHours: number }>;
    finance: {
      currency: string; bac: number | null; actual: number; percentUsed: number | null; burnRatePerWeek: number; eac: number | null; eacMethod: string | null;
      alerts: string[]; pendingHours: number; payments: { planned: number; due: number; invoiced: number; paid: number };
    } | null;
  };
}

const money = (n: number | null | undefined, cur: string | null) =>
  n === null || n === undefined ? '—' : `${new Intl.NumberFormat('en-US', { maximumFractionDigits: cur === 'VND' ? 0 : 2 }).format(n)}${cur ? ` ${cur}` : ''}`;

const STATUS_WORD: Record<string, string> = { NOT_STARTED: 'not started', ACTIVE: 'in progress', GATE_REVIEW: 'in gate review', DONE: 'done' };

/** Markdown của báo cáo — dùng cho email, lịch sử, và là bản gốc khi người dùng không bấm "AI polish". */
export function reportMarkdown(d: ReportData): string {
  const out: string[] = [];
  const title = d.audience === 'client' ? 'Weekly update' : 'Steering status report';
  out.push(`# ${title} — ${d.project.name}`, '', `Period: ${d.period.from} → ${d.period.to}`, '');
  out.push('## Summary', '');
  const bits = [`${d.counts.completed} item${d.counts.completed === 1 ? '' : 's'} completed this period`, `${d.counts.inProgress} in progress`];
  if (d.currentStage) bits.push(`current stage: ${d.currentStage.n}. ${d.currentStage.name} (${d.currentStage.percent}%)`);
  if (d.overallPercent !== null) bits.push(`overall progress ${d.overallPercent}%`);
  out.push(`- ${bits.join(' · ')}`);
  if (d.waitingOnClient.length) out.push(`- Waiting on ${d.audience === 'client' ? 'you' : 'the client'}: ${d.waitingOnClient.length} item${d.waitingOnClient.length === 1 ? '' : 's'}`);
  out.push('');
  if (d.stages?.length) {
    out.push('## Stages', '');
    for (const s of d.stages) out.push(`- ${s.n}. ${s.name} — ${STATUS_WORD[s.status] ?? s.status.toLowerCase()} (${s.percent}%)`);
    out.push('');
  }
  out.push('## Completed', '', ...(d.completed.length ? d.completed.map((i) => `- ${i.key} ${i.title}`) : ['- Nothing completed in this period.']), '');
  out.push('## In progress', '', ...(d.inProgress.length ? d.inProgress.map((i) => `- ${i.key} ${i.title}`) : ['- Nothing in progress right now.']), '');
  if (d.waitingOnClient.length) {
    out.push(d.audience === 'client' ? '## Waiting on you' : '## Waiting on the client', '');
    for (const w of d.waitingOnClient) out.push(`- ${w.kind === 'UAT' ? 'UAT sign-off: ' : 'Approval: '}${w.title}${w.dueAt ? ` (due ${w.dueAt.slice(0, 10)})` : ''}`);
    out.push('');
  }
  if (d.upcoming.versions.length || d.upcoming.payments?.length) {
    out.push('## Upcoming milestones', '');
    for (const v of d.upcoming.versions) out.push(`- ${v.name}${v.releaseDate ? ` — ${v.releaseDate}` : ''} (${v.done}/${v.items} done)`);
    for (const p of d.upcoming.payments ?? []) out.push(`- Payment: ${p.name} — ${money(p.amount, d.currency)}${p.dueDate ? `, due ${p.dueDate}` : ''} (${p.status.toLowerCase()})`);
    out.push('');
  }
  if (d.changes?.length) {
    out.push('## Approved changes', '');
    for (const c of d.changes) out.push(`- CR-${c.number} ${c.title}${c.scheduleDays ? ` · ${c.scheduleDays > 0 ? '+' : ''}${c.scheduleDays} days` : ''}${c.costAmount ? ` · ${money(c.costAmount, c.costCurrency)}` : ''}`);
    out.push('');
  }
  if (d.serviceDesk && (d.serviceDesk.received || d.serviceDesk.resolved || d.serviceDesk.open)) {
    const s = d.serviceDesk;
    const pc = (v: number | null) => (v === null ? '—' : `${v}%`);
    out.push('## Support requests', '', `- Received ${s.received} · resolved ${s.resolved} · open ${s.open}`);
    out.push(`- Responded on time: ${pc(s.firstResponsePercent)} · resolved on time: ${pc(s.resolutionPercent)}`);
    if (s.csatCount) out.push(`- Satisfaction: ${s.csatAvg}/5 from ${s.csatCount} rating${s.csatCount === 1 ? '' : 's'}`);
    out.push('');
  }
  if (d.risks?.length) {
    out.push('## Risks', '');
    for (const r of d.risks) out.push(`- ${r.title}${r.level ? ` (${r.level.toLowerCase()})` : ''}${r.mitigation ? ` — ${r.mitigation}` : ''}`);
    out.push('');
  }
  if (d.internal) {
    const f = d.internal.finance;
    if (f) {
      out.push('## Finance', '', `- Budget ${money(f.bac, f.currency)} · actual ${money(f.actual, f.currency)}${f.percentUsed !== null ? ` (${f.percentUsed}%)` : ''} · burn ${money(f.burnRatePerWeek, f.currency)}/week · forecast ${money(f.eac, f.currency)}${f.eacMethod ? ` (${f.eacMethod})` : ''}`);
      if (f.alerts.length) out.push(`- Alerts: ${f.alerts.join(', ')}`);
      out.push(`- Payments: due ${money(f.payments.due, f.currency)} · invoiced ${money(f.payments.invoiced, f.currency)} · paid ${money(f.payments.paid, f.currency)}`, '');
    }
    if (d.internal.raid) {
      out.push('## RAID', '', `- Open: ${Object.entries(d.internal.raid.open).map(([k, v]) => `${k.toLowerCase()} ${v}`).join(' · ')}`);
      for (const r of d.internal.raid.top) out.push(`- ${r.key} ${r.title}${r.score ? ` (score ${r.score})` : ''}${r.owner ? ` — ${r.owner}` : ''}`);
      out.push('');
    }
    if (d.internal.overdue.length) {
      out.push('## Overdue', '', ...d.internal.overdue.map((i) => `- ${i.key} ${i.title}${i.dueDate ? ` (due ${i.dueDate})` : ''}${i.assignee ? ` — ${i.assignee}` : ''}`), '');
    }
    if (d.internal.workload.length) {
      out.push('## Workload', '', ...d.internal.workload.map((w) => `- ${w.name}: ${w.open} open, ~${w.remainingHours} h left`), '');
    }
  }
  out.push('## Next steps', '', ...(d.nextSteps.length ? d.nextSteps.map((i) => `- ${i.key} ${i.title}`) : ['- To be agreed at the next meeting.']), '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Vài dòng ngắn cho thân email khách (bản đầy đủ nằm trong cổng). */
export function reportEmailLines(d: ReportData): string[] {
  const lines = [`Here is the weekly update for ${d.project.name} (${d.period.from} → ${d.period.to}).`];
  lines.push(`Completed: ${d.counts.completed} · In progress: ${d.counts.inProgress}${d.overallPercent !== null ? ` · Overall progress: ${d.overallPercent}%` : ''}.`);
  if (d.currentStage) lines.push(`Current stage: ${d.currentStage.n}. ${d.currentStage.name} (${d.currentStage.percent}%).`);
  if (d.waitingOnClient.length) lines.push(`Waiting on you: ${d.waitingOnClient.map((w) => w.title).slice(0, 3).join('; ')}${d.waitingOnClient.length > 3 ? '…' : ''}.`);
  const next = d.upcoming.versions[0];
  if (next) lines.push(`Next milestone: ${next.name}${next.releaseDate ? ` on ${next.releaseDate}` : ''}.`);
  lines.push('The full report is saved in your client portal → Reports.');
  return lines;
}
