/**
 * CT Work — đợt S4: dạng dữ liệu của BÁO CÁO (tuần cho khách / steering nội bộ / thuyết trình) và
 * cách viết nó thành Markdown + dòng email. THUẦN — test ở finance.test.ts. Không LLM: mọi câu
 * chữ ở đây là khuôn cố định điền số liệu đã đếm.
 */

export interface ReportItem { key: string; title: string }

export interface ReportData {
  formatVersion: 1;
  audience: 'client' | 'internal';
  /** CTW-14: ngôn ngữ chữ khuôn (projectLanguage lúc dựng). Thiếu = 'en' (báo cáo cũ). */
  language?: 'en' | 'vi';
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

const STATUS_WORD: Record<'en' | 'vi', Record<string, string>> = {
  en: { NOT_STARTED: 'not started', ACTIVE: 'in progress', GATE_REVIEW: 'in gate review', DONE: 'done' },
  vi: { NOT_STARTED: 'chưa bắt đầu', ACTIVE: 'đang làm', GATE_REVIEW: 'đang chờ duyệt cổng', DONE: 'đã xong' },
};

/**
 * CTW-14 (08/10/2026): chữ khuôn của báo cáo theo NGÔN NGỮ DỰ ÁN (`d.language`, đặt lúc dựng báo cáo từ
 * projectLanguage). Thiếu trường (báo cáo cũ đã lưu) ⇒ tiếng Anh như trước.
 */
const T = {
  en: {
    weekly: 'Weekly update', steering: 'Steering status report', period: 'Period', summary: 'Summary',
    completedThis: (n: number) => `${n} item${n === 1 ? '' : 's'} completed this period`, inProgressN: (n: number) => `${n} in progress`,
    currentStage: 'current stage', overall: 'overall progress',
    waitingOn: (client: boolean, n: number) => `Waiting on ${client ? 'you' : 'the client'}: ${n} item${n === 1 ? '' : 's'}`,
    stages: 'Stages', completed: 'Completed', nothingCompleted: 'Nothing completed in this period.', inProgress: 'In progress', nothingInProgress: 'Nothing in progress right now.',
    waitingHead: (client: boolean) => (client ? 'Waiting on you' : 'Waiting on the client'), uat: 'UAT sign-off: ', approval: 'Approval: ', due: 'due',
    milestones: 'Upcoming milestones', done: 'done', payment: 'Payment', changes: 'Approved changes', days: 'days',
    support: 'Support requests', received: 'Received', resolved: 'resolved', open: 'open', respondedOnTime: 'Responded on time', resolvedOnTime: 'resolved on time',
    satisfaction: (avg: number | null, n: number) => `Satisfaction: ${avg}/5 from ${n} rating${n === 1 ? '' : 's'}`,
    risks: 'Risks', nextSteps: 'Next steps', nextTbd: 'To be agreed at the next meeting.',
    emailIntro: (name: string, from: string, to: string) => `Here is the weekly update for ${name} (${from} → ${to}).`,
    emailCounts: 'Completed', emailInProgress: 'In progress', emailOverall: 'Overall progress', emailStage: 'Current stage', emailWaiting: 'Waiting on you',
    emailNext: (name: string, date: string | null) => `Next milestone: ${name}${date ? ` on ${date}` : ''}.`, emailFull: 'The full report is saved in your client portal → Reports.',
  },
  vi: {
    weekly: 'Cập nhật hằng tuần', steering: 'Báo cáo tình trạng dự án', period: 'Kỳ báo cáo', summary: 'Tóm tắt',
    completedThis: (n: number) => `${n} hạng mục hoàn thành trong kỳ`, inProgressN: (n: number) => `${n} đang làm`,
    currentStage: 'giai đoạn hiện tại', overall: 'tiến độ chung',
    waitingOn: (client: boolean, n: number) => `Đang chờ ${client ? 'anh/chị' : 'khách hàng'}: ${n} hạng mục`,
    stages: 'Các giai đoạn', completed: 'Đã hoàn thành', nothingCompleted: 'Chưa có hạng mục nào hoàn thành trong kỳ.', inProgress: 'Đang thực hiện', nothingInProgress: 'Hiện không có hạng mục nào đang làm.',
    waitingHead: (client: boolean) => (client ? 'Đang chờ anh/chị' : 'Đang chờ khách hàng'), uat: 'Nghiệm thu (UAT): ', approval: 'Phê duyệt: ', due: 'hạn',
    milestones: 'Mốc sắp tới', done: 'xong', payment: 'Thanh toán', changes: 'Thay đổi đã duyệt', days: 'ngày',
    support: 'Yêu cầu hỗ trợ', received: 'Đã nhận', resolved: 'đã xử lý', open: 'đang mở', respondedOnTime: 'Phản hồi đúng hạn', resolvedOnTime: 'xử lý đúng hạn',
    satisfaction: (avg: number | null, n: number) => `Mức hài lòng: ${avg}/5 từ ${n} đánh giá`,
    risks: 'Rủi ro', nextSteps: 'Bước tiếp theo', nextTbd: 'Sẽ thống nhất ở buổi họp tới.',
    emailIntro: (name: string, from: string, to: string) => `Cập nhật hằng tuần của dự án ${name} (${from} → ${to}).`,
    emailCounts: 'Đã hoàn thành', emailInProgress: 'Đang làm', emailOverall: 'Tiến độ chung', emailStage: 'Giai đoạn hiện tại', emailWaiting: 'Đang chờ anh/chị',
    emailNext: (name: string, date: string | null) => `Mốc tiếp theo: ${name}${date ? ` vào ${date}` : ''}.`, emailFull: 'Báo cáo đầy đủ lưu trong cổng khách hàng → Reports.',
  },
};

const PAYMENT_WORD_VI: Record<string, string> = { PLANNED: 'dự kiến', DUE: 'đến hạn', INVOICED: 'đã xuất hoá đơn', PAID: 'đã thanh toán', CANCELLED: 'đã huỷ' };

/** Markdown của báo cáo — dùng cho email, lịch sử, và là bản gốc khi người dùng không bấm "AI polish". */
export function reportMarkdown(d: ReportData): string {
  const lang = d.language === 'vi' ? 'vi' : 'en';
  const t = T[lang];
  const out: string[] = [];
  const client = d.audience === 'client';
  const title = client ? t.weekly : t.steering;
  out.push(`# ${title} — ${d.project.name}`, '', `${t.period}: ${d.period.from} → ${d.period.to}`, '');
  out.push(`## ${t.summary}`, '');
  const bits = [t.completedThis(d.counts.completed), t.inProgressN(d.counts.inProgress)];
  if (d.currentStage) bits.push(`${t.currentStage}: ${d.currentStage.n}. ${d.currentStage.name} (${d.currentStage.percent}%)`);
  if (d.overallPercent !== null) bits.push(`${t.overall} ${d.overallPercent}%`);
  out.push(`- ${bits.join(' · ')}`);
  if (d.waitingOnClient.length) out.push(`- ${t.waitingOn(client, d.waitingOnClient.length)}`);
  out.push('');
  if (d.stages?.length) {
    out.push(`## ${t.stages}`, '');
    for (const s of d.stages) out.push(`- ${s.n}. ${s.name} — ${STATUS_WORD[lang][s.status] ?? s.status.toLowerCase()} (${s.percent}%)`);
    out.push('');
  }
  out.push(`## ${t.completed}`, '', ...(d.completed.length ? d.completed.map((i) => `- ${i.key} ${i.title}`) : [`- ${t.nothingCompleted}`]), '');
  out.push(`## ${t.inProgress}`, '', ...(d.inProgress.length ? d.inProgress.map((i) => `- ${i.key} ${i.title}`) : [`- ${t.nothingInProgress}`]), '');
  if (d.waitingOnClient.length) {
    out.push(`## ${t.waitingHead(client)}`, '');
    for (const w of d.waitingOnClient) out.push(`- ${w.kind === 'UAT' ? t.uat : t.approval}${w.title}${w.dueAt ? ` (${t.due} ${w.dueAt.slice(0, 10)})` : ''}`);
    out.push('');
  }
  if (d.upcoming.versions.length || d.upcoming.payments?.length) {
    out.push(`## ${t.milestones}`, '');
    for (const v of d.upcoming.versions) out.push(`- ${v.name}${v.releaseDate ? ` — ${v.releaseDate}` : ''} (${v.done}/${v.items} ${t.done})`);
    for (const p of d.upcoming.payments ?? []) out.push(`- ${t.payment}: ${p.name} — ${money(p.amount, d.currency)}${p.dueDate ? `, ${t.due} ${p.dueDate}` : ''} (${lang === 'vi' ? PAYMENT_WORD_VI[p.status] ?? p.status.toLowerCase() : p.status.toLowerCase()})`);
    out.push('');
  }
  if (d.changes?.length) {
    out.push(`## ${t.changes}`, '');
    for (const c of d.changes) out.push(`- CR-${c.number} ${c.title}${c.scheduleDays ? ` · ${c.scheduleDays > 0 ? '+' : ''}${c.scheduleDays} ${t.days}` : ''}${c.costAmount ? ` · ${money(c.costAmount, c.costCurrency)}` : ''}`);
    out.push('');
  }
  if (d.serviceDesk && (d.serviceDesk.received || d.serviceDesk.resolved || d.serviceDesk.open)) {
    const s = d.serviceDesk;
    const pc = (v: number | null) => (v === null ? '—' : `${v}%`);
    out.push(`## ${t.support}`, '', `- ${t.received} ${s.received} · ${t.resolved} ${s.resolved} · ${t.open} ${s.open}`);
    out.push(`- ${t.respondedOnTime}: ${pc(s.firstResponsePercent)} · ${t.resolvedOnTime}: ${pc(s.resolutionPercent)}`);
    if (s.csatCount) out.push(`- ${t.satisfaction(s.csatAvg, s.csatCount)}`);
    out.push('');
  }
  if (d.risks?.length) {
    out.push(`## ${t.risks}`, '');
    for (const r of d.risks) out.push(`- ${r.title}${r.level ? ` (${r.level.toLowerCase()})` : ''}${r.mitigation ? ` — ${r.mitigation}` : ''}`);
    out.push('');
  }
  // Phần NỘI BỘ (steering) chỉ nhân viên đọc — giữ tiếng Anh như giao diện CT Work.
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
  out.push(`## ${t.nextSteps}`, '', ...(d.nextSteps.length ? d.nextSteps.map((i) => `- ${i.key} ${i.title}`) : [`- ${t.nextTbd}`]), '');
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Vài dòng ngắn cho thân email khách (bản đầy đủ nằm trong cổng). */
export function reportEmailLines(d: ReportData): string[] {
  const t = T[d.language === 'vi' ? 'vi' : 'en'];
  const lines = [t.emailIntro(d.project.name, d.period.from, d.period.to)];
  lines.push(`${t.emailCounts}: ${d.counts.completed} · ${t.emailInProgress}: ${d.counts.inProgress}${d.overallPercent !== null ? ` · ${t.emailOverall}: ${d.overallPercent}%` : ''}.`);
  if (d.currentStage) lines.push(`${t.emailStage}: ${d.currentStage.n}. ${d.currentStage.name} (${d.currentStage.percent}%).`);
  if (d.waitingOnClient.length) lines.push(`${t.emailWaiting}: ${d.waitingOnClient.map((w) => w.title).slice(0, 3).join('; ')}${d.waitingOnClient.length > 3 ? '…' : ''}.`);
  const next = d.upcoming.versions[0];
  if (next) lines.push(t.emailNext(next.name, next.releaseDate));
  lines.push(t.emailFull);
  return lines;
}
