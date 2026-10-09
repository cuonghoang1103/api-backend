/**
 * CT Work — đợt S4: Tài chính dự án · Báo cáo khách/steering · Thuyết trình · Xuất trọn dự án. Backend:
 * src/routes/work.s4.routes.ts + services/work/{finance,clientReports,projectExport}.service.ts.
 * Tách khỏi work-api.ts để không giẫm phiên khác; kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { WorkUser } from './work-api';
import { translate as wtr, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => wtr(currentWorkLocale(), k, v);

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const q = (o: Record<string, string | number | undefined | null>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

// ═══ Kiểu ═══════════════════════════════════════════════════════════

export type Currency = 'VND' | 'USD';
export type RateScope = 'DEFAULT' | 'ROLE' | 'TEAM' | 'USER';
export type TimesheetStatus = 'SUBMITTED' | 'APPROVED' | 'RETURNED' | 'REOPENED';
export type BudgetCategory = 'LABOR' | 'EQUIPMENT' | 'SERVICES' | 'OTHER';
export type ExpenseCategory = 'EQUIPMENT' | 'SERVICES' | 'LICENSE' | 'TRAVEL' | 'OTHER';
export type PaymentStatus = 'PLANNED' | 'DUE' | 'INVOICED' | 'PAID';
export type PaymentTrigger = 'MANUAL' | 'UAT' | 'STAGE_GATE';

export interface FinanceAccess { manage: boolean; ownTimesheet: boolean; review: 'ALL' | 'TEAM' | null }

export interface FinanceSettings {
  currency: Currency | null;
  contractValue: number | null;
  budgetTotal: number | null;
  alertLevel: number;
  access: FinanceAccess;
  notice: string;
  formula: string;
}

export interface Rate {
  id: number; scope: RateScope; projectRole: string | null; teamId: number | null; userId: number | null; hourlyRate: number;
  effectiveFrom: string | null; note: string | null; createdAt: string;
  team: { id: number; key: string; name: string } | null; user: WorkUser | null;
}

export interface Timesheet {
  id: number; userId: number; userName: string; weekStart: string; weekEnd: string; status: TimesheetStatus; totalMinutes: number;
  note: string | null; submittedAt: string | null; decidedAt: string | null; decidedById: number | null; returnReason: string | null;
  reopenedAt: string | null; reopenReason: string | null; approvedCost?: number | null; version: number;
}

export interface WeekView {
  weekStart: string; weekEnd: string; days: string[]; user: WorkUser | null;
  rows: Array<{ issueId: number; key: string; title: string; byDay: Record<string, number>; totalMin: number }>;
  logs: Array<{ id: number; minutes: number; startedAt: string; day: string; note: string | null; issueKey: string; issueNumber: number; issueTitle: string }>;
  totalMin: number; byDay: Record<string, number>;
  timesheet: Timesheet | null; locked: boolean;
  /** approve (CTW-38, tuỳ chọn cho backend cũ): false khi tuần chưa kết thúc — chỉ Return được. */
  can: { submit: boolean; withdraw: boolean; review: boolean; reopen: boolean; approve?: boolean };
}

export interface BudgetSummary {
  bac: number | null; actual: number; laborCost: number; expenseCost: number; remaining: number | null; percentUsed: number | null;
  burnRatePerWeek: number; percentComplete: number | null; ev: number | null; cpi: number | null; eac: number | null;
  eacMethod: 'CPI' | 'BURN_RATE' | null; vac: number | null; alerts: Array<'WARN' | 'OVER' | 'FORECAST_OVER'>; alertLevel: 0 | 80 | 100;
}

export interface BudgetLine { id: number; name: string; category: BudgetCategory; stageId: number | null; amount: number; note: string | null }

export interface FinanceSummary {
  currency: Currency; contractValue: number | null; budgetTotal: number | null;
  summary: BudgetSummary;
  approvedMinutes: number; unpricedMinutes: number; pendingMinutes: number; pendingTimesheets: number; plannedEnd: string | null;
  byStage: Array<{ id: number | null; label: string; status: string | null; budget: number; actual: number }>;
  byCategory: Array<{ category: BudgetCategory; budget: number; actual: number }>;
  byPerson: Array<{ userId: number; name: string; minutes: number; cost: number }>;
  weekly: Array<{ weekStart: string; labor: number; expenses: number }>;
  budgetLines: BudgetLine[];
  payments: { planned: number; due: number; invoiced: number; paid: number };
  formula: string; notice: string;
}

export interface Expense {
  id: number; spentOn: string; category: ExpenseCategory; description: string; vendor: string | null; amount: number;
  budgetLineId: number | null; stageId: number | null; createdAt: string;
  budgetLine: { id: number; name: string } | null; stage: { id: number; n: number; name: string } | null;
}

export interface PaymentMilestone {
  id: number; number: number; name: string; percent: number | null; amount: number | null; trigger: PaymentTrigger;
  versionId: number | null; stageId: number | null; dueDate: string | null; status: PaymentStatus; becameDueAt: string | null;
  triggeredByApprovalId: number | null; invoiceNumber: string | null; invoicedAt: string | null; paidAt: string | null;
  clientVisible: boolean; note: string | null; computedAmount: number | null; overdue: boolean;
  version: { id: number; name: string } | null; stage: { id: number; n: number; name: string } | null;
}

export interface PaymentInput {
  name?: string; percent?: number | null; amount?: number | null; trigger?: PaymentTrigger; versionId?: number | null; stageId?: number | null;
  dueDate?: string | null; clientVisible?: boolean; note?: string | null;
}

// Báo cáo
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

export interface ReportSchedule {
  enabled: boolean; weekday: number; hour: number; timezone: string; includeRisks: boolean; includeChanges: boolean;
  clientPortal: boolean; recipients: number; canEdit: boolean;
  /** CTW-3: bật lần đầu phải xem trước + xác nhận; câu mô tả lịch gửi. */
  needsConfirmation?: boolean; cadence?: string; confirmedAt?: string | null;
}

export interface ReportRow {
  id: number; number: number; kind: 'CLIENT_WEEKLY' | 'STEERING'; source: 'AUTO' | 'MANUAL'; periodStart: string; periodEnd: string; title: string;
  aiPolished: boolean; clientVisible: boolean; sentAt: string | null; recipientCount: number; createdAt: string;
}
export interface ReportDetail extends ReportRow { data: ReportData; bodyMarkdown: string | null }

export interface PresentPayload {
  mode: 'client' | 'internal'; financeIncluded: boolean; data: ReportData; description: string | null;
  demoCandidates: Array<{ key: string; number: number; title: string; type: string; summary: string | null }>;
}

// Xuất trọn
export interface ProjectExportRow {
  id: number; status: 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED' | 'EXPIRED'; progress: number; stage: string | null; includeFiles: boolean;
  fileName: string | null; size: number | null; tableCounts: Record<string, number> | null; attachmentCount: number; attachmentBytes: number;
  filesIncluded: number; error: string | null; expiresAt: string | null; createdAt: string; startedAt: string | null; finishedAt: string | null;
}

// Cổng khách
export interface PortalPayment {
  number: number; name: string; percent: number | null; amount: number | null; dueDate: string | null; status: PaymentStatus;
  invoiceNumber: string | null; paidAt: string | null; becameDueAt: string | null;
}

// ═══ Khoá query ═════════════════════════════════════════════════════

export const s4Keys = {
  all: (pid: number) => ['work', 's4', pid] as const,
  settings: (pid: number) => ['work', 's4', pid, 'settings'] as const,
  summary: (pid: number) => ['work', 's4', pid, 'summary'] as const,
  rates: (pid: number) => ['work', 's4', pid, 'rates'] as const,
  week: (pid: number, week: string, userId?: number | null) => ['work', 's4', pid, 'week', week, userId ?? 0] as const,
  timesheets: (pid: number, status?: string) => ['work', 's4', pid, 'timesheets', status ?? ''] as const,
  expenses: (pid: number) => ['work', 's4', pid, 'expenses'] as const,
  payments: (pid: number) => ['work', 's4', pid, 'payments'] as const,
  schedule: (pid: number) => ['work', 's4', pid, 'schedule'] as const,
  preview: (pid: number, from: string, to: string) => ['work', 's4', pid, 'preview', from, to] as const,
  history: (pid: number, kind?: string) => ['work', 's4', pid, 'history', kind ?? ''] as const,
  report: (pid: number, id: number) => ['work', 's4', pid, 'report', id] as const,
  steering: (pid: number, from: string, to: string) => ['work', 's4', pid, 'steering', from, to] as const,
  present: (pid: number, mode: string) => ['work', 's4', pid, 'present', mode] as const,
  exports: (pid: number) => ['work', 's4', pid, 'exports'] as const,
  portalPayments: (pid: number, asClient: boolean) => ['work', 'portal', pid, 'payments', asClient] as const,
  portalReports: (pid: number, asClient: boolean) => ['work', 'portal', pid, 'reports', asClient] as const,
  portalReport: (pid: number, id: number, asClient: boolean) => ['work', 'portal', pid, 'report', id, asClient] as const,
};

// ═══ API ════════════════════════════════════════════════════════════

const P = (pid: number) => `${B}/projects/${pid}`;

export const s4Api = {
  // Tài chính
  settings: (pid: number) => d<FinanceSettings>(api.get(`${P(pid)}/finance/settings`)),
  updateSettings: (pid: number, body: { currency?: Currency; contractValue?: number | null; budgetTotal?: number | null }) =>
    d<FinanceSettings>(api.put(`${P(pid)}/finance/settings`, body)),
  summary: (pid: number) => d<FinanceSummary>(api.get(`${P(pid)}/finance/summary`)),
  rates: (pid: number) => d<{ currency: Currency; rates: Rate[] }>(api.get(`${P(pid)}/finance/rates`)),
  createRate: (pid: number, body: { scope: RateScope; projectRole?: string | null; teamId?: number | null; userId?: number | null; hourlyRate: number; effectiveFrom?: string | null; note?: string | null }) =>
    d<{ currency: Currency; rates: Rate[] }>(api.post(`${P(pid)}/finance/rates`, body)),
  updateRate: (pid: number, id: number, body: { hourlyRate?: number; effectiveFrom?: string | null; note?: string | null }) =>
    d<{ currency: Currency; rates: Rate[] }>(api.patch(`${P(pid)}/finance/rates/${id}`, body)),
  deleteRate: (pid: number, id: number) => d<{ currency: Currency; rates: Rate[] }>(api.delete(`${P(pid)}/finance/rates/${id}`)),
  week: (pid: number, week?: string, userId?: number | null) => d<WeekView>(api.get(`${P(pid)}/finance/timesheet${q({ week, userId })}`)),
  timesheets: (pid: number, status?: TimesheetStatus) => d<{ items: Timesheet[]; access: FinanceAccess }>(api.get(`${P(pid)}/finance/timesheets${q({ status })}`)),
  submitWeek: (pid: number, weekStart: string, note?: string | null) => d<Timesheet>(api.post(`${P(pid)}/finance/timesheets/submit`, { weekStart, note })),
  withdrawWeek: (pid: number, id: number) => d<{ withdrawn: true }>(api.post(`${P(pid)}/finance/timesheets/${id}/withdraw`, {})),
  approveWeek: (pid: number, id: number) => d<{ approved: true; minutes: number; unpricedMinutes: number }>(api.post(`${P(pid)}/finance/timesheets/${id}/approve`, {})),
  returnWeek: (pid: number, id: number, reason: string) => d<{ returned: true }>(api.post(`${P(pid)}/finance/timesheets/${id}/return`, { reason })),
  reopenWeek: (pid: number, id: number, reason: string) => d<{ reopened: true }>(api.post(`${P(pid)}/finance/timesheets/${id}/reopen`, { reason })),
  createBudgetLine: (pid: number, body: { name: string; category?: BudgetCategory; stageId?: number | null; amount: number; note?: string | null }) =>
    d<BudgetLine>(api.post(`${P(pid)}/finance/budget-lines`, body)),
  updateBudgetLine: (pid: number, id: number, body: Partial<{ name: string; category: BudgetCategory; stageId: number | null; amount: number; note: string | null }>) =>
    d<BudgetLine>(api.patch(`${P(pid)}/finance/budget-lines/${id}`, body)),
  deleteBudgetLine: (pid: number, id: number) => d<{ deleted: true }>(api.delete(`${P(pid)}/finance/budget-lines/${id}`)),
  expenses: (pid: number) => d<Expense[]>(api.get(`${P(pid)}/finance/expenses`)),
  createExpense: (pid: number, body: { spentOn: string; category?: ExpenseCategory; description: string; vendor?: string | null; amount: number; budgetLineId?: number | null; stageId?: number | null }) =>
    d<Expense>(api.post(`${P(pid)}/finance/expenses`, body)),
  deleteExpense: (pid: number, id: number) => d<{ deleted: true }>(api.delete(`${P(pid)}/finance/expenses/${id}`)),
  payments: (pid: number) => d<{ currency: Currency; contractValue: number | null; items: PaymentMilestone[]; notice: string }>(api.get(`${P(pid)}/finance/payments`)),
  createPayment: (pid: number, body: PaymentInput & { name: string }) => d<{ currency: Currency; contractValue: number | null; items: PaymentMilestone[] }>(api.post(`${P(pid)}/finance/payments`, body)),
  updatePayment: (pid: number, num: number, body: PaymentInput) => d<{ currency: Currency; contractValue: number | null; items: PaymentMilestone[] }>(api.patch(`${P(pid)}/finance/payments/${num}`, body)),
  deletePayment: (pid: number, num: number) => d<{ currency: Currency; contractValue: number | null; items: PaymentMilestone[] }>(api.delete(`${P(pid)}/finance/payments/${num}`)),
  setPaymentStatus: (pid: number, num: number, status: PaymentStatus, invoiceNumber?: string | null) =>
    d<{ currency: Currency; contractValue: number | null; items: PaymentMilestone[] }>(api.post(`${P(pid)}/finance/payments/${num}/status`, { status, invoiceNumber })),
  exportXlsx: async (pid: number) => {
    const res = await api.get(`${P(pid)}/finance/export.xlsx`, { responseType: 'blob', timeout: 120_000 });
    const cd = String(res.headers['content-disposition'] ?? '');
    const name = /filename="([^"]+)"/.exec(cd)?.[1] ?? 'finance.xlsx';
    return { blob: res.data as Blob, fileName: name };
  },

  // Báo cáo
  schedule: (pid: number) => d<ReportSchedule>(api.get(`${P(pid)}/reports/client-weekly/schedule`)),
  updateSchedule: (pid: number, body: Partial<Pick<ReportSchedule, 'enabled' | 'weekday' | 'hour' | 'timezone' | 'includeRisks' | 'includeChanges'>> & { confirm?: boolean }) =>
    d<ReportSchedule>(api.put(`${P(pid)}/reports/client-weekly/schedule`, body)),
  preview: (pid: number, from?: string, to?: string) => d<{ data: ReportData; markdown: string; recipients: number; clientPortal: boolean }>(api.get(`${P(pid)}/reports/client-weekly/preview${q({ from, to })}`)),
  send: (pid: number, body: { from?: string; to?: string; bodyMarkdown?: string | null; aiPolished?: boolean }) => d<ReportDetail>(api.post(`${P(pid)}/reports/client-weekly/send`, body)),
  /** CTW-8: language tuỳ chọn — thiếu ⇒ theo ngôn ngữ dự án. */
  polish: (pid: number, language?: 'en' | 'vi') => d<{ markdown: string; language?: 'en' | 'vi' }>(api.post(`${P(pid)}/reports/client-weekly/polish`, language ? { language } : {}, { timeout: 120_000 })),
  history: (pid: number, kind?: 'CLIENT_WEEKLY' | 'STEERING') => d<ReportRow[]>(api.get(`${P(pid)}/reports/history${q({ kind })}`)),
  report: (pid: number, id: number) => d<ReportDetail>(api.get(`${P(pid)}/reports/history/${id}`)),
  steering: (pid: number, from?: string, to?: string) => d<{ data: ReportData; markdown: string; financeIncluded: boolean }>(api.get(`${P(pid)}/reports/steering${q({ from, to })}`)),
  present: (pid: number, mode: 'client' | 'internal') => d<PresentPayload>(api.get(`${P(pid)}/present${q({ mode })}`)),

  // Xuất trọn
  exports: (pid: number) => d<{ items: ProjectExportRow[]; maxFileBytes: number; formatVersion: number }>(api.get(`${P(pid)}/exports`)),
  startExport: (pid: number, includeFiles: boolean) => d<ProjectExportRow>(api.post(`${P(pid)}/exports`, { includeFiles })),
  exportLink: (pid: number, id: number) => d<{ url: string; expiresAt: string }>(api.post(`${P(pid)}/exports/${id}/link`, {})),

  // Cổng khách
  portalPayments: (pid: number, asClient: boolean) => d<{ enabled: boolean; currency: Currency | null; items: PortalPayment[] }>(api.get(`${P(pid)}/portal/payments${asClient ? '?as=client' : ''}`)),
  portalReports: (pid: number, asClient: boolean) => d<{ enabled: boolean; items: Array<{ id: number; number: number; periodStart: string; periodEnd: string; title: string; sentAt: string | null; createdAt: string }> }>(api.get(`${P(pid)}/portal/reports${asClient ? '?as=client' : ''}`)),
  portalReport: (pid: number, id: number, asClient: boolean) => d<{ id: number; number: number; periodStart: string; periodEnd: string; title: string; sentAt: string | null; data: ReportData; bodyMarkdown: string | null; aiPolished: boolean }>(api.get(`${P(pid)}/portal/reports/${id}${asClient ? '?as=client' : ''}`)),
};

// ═══ Định dạng ══════════════════════════════════════════════════════

/** Tiền theo đơn vị dự án: VND không lẻ, USD 2 số lẻ. */
export function fmtMoney(n: number | null | undefined, currency: string | null | undefined): string {
  if (n === null || n === undefined) return '—';
  const cur = currency ?? '';
  const digits = cur === 'VND' ? 0 : 2;
  return `${new Intl.NumberFormat(currentWorkLocale() === 'vi' ? 'vi-VN' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits }).format(n)}${cur ? ` ${cur}` : ''}`;
}

export const fmtHours = (min: number) => `${Math.round((min / 60) * 10) / 10} h`;

export const NO_INVOICE_NOTICE = 'CT Work only tracks project money. It does not issue invoices — in Vietnam, e-invoices must be issued through a licensed e-invoice provider. Record the invoice number from that system here.';

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = { get PLANNED() { return wt('finance.psPlanned'); }, get DUE() { return wt('finance.psDue'); }, get INVOICED() { return wt('finance.psInvoiced'); }, get PAID() { return wt('finance.psPaid'); } };
export const TIMESHEET_STATUS_LABEL: Record<TimesheetStatus, string> = { get SUBMITTED() { return wt('finance.tsSubmitted'); }, get APPROVED() { return wt('finance.tsApprovedSt'); }, get RETURNED() { return wt('finance.tsReturned'); }, get REOPENED() { return wt('finance.tsReopened'); } };
export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Thứ Hai của tuần chứa ngày `day` (YYYY-MM-DD). */
export function mondayOf(day: string): string {
  const dt = new Date(`${day}T00:00:00Z`);
  const dow = (dt.getUTCDay() + 6) % 7;
  return new Date(dt.getTime() - dow * 86_400_000).toISOString().slice(0, 10);
}
export const addDays = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
/** Hôm nay theo giờ VN. */
export const todayVn = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
