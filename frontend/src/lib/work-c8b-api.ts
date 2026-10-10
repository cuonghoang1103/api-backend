/**
 * CT Work — CTW đợt 8b (12/10/2026): client cho Reports → Builder, lịch tự gửi, Notion, Slack. Backend:
 * src/routes/work.ctw8b.routes.ts — kiểu ở đây khớp reportBuilder/reportSchedule/notion/slack.service.ts. Tách khỏi
 * work-api.ts để không giẫm phiên khác. Kết nối OAuth (start/ngắt) dùng `workConnectionsApi` của 8a (work-c8a-api.ts).
 */

import { api } from '@/lib/api';
import type { ImportPreview, ImportReport, MapField } from '@/lib/work-ctw7b-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

// ─── Bố cục báo cáo (khớp reportBuilder.ts) ──────────────────────

export const KPI_KEYS = ['open', 'doneInPeriod', 'overdue', 'blocked', 'velocity', 'sprintProgress', 'testPassRate', 'openDefects', 'highRisks', 'okrProgress'] as const;
export type KpiKey = (typeof KPI_KEYS)[number];
export const CHART_KEYS = ['burnup', 'burndown', 'cfd', 'velocity', 'defects', 'testPassRate', 'okr', 'throughput', 'createdResolved'] as const;
export type ChartKey = (typeof CHART_KEYS)[number];
export const ISSUE_COLUMNS = ['key', 'title', 'type', 'status', 'assignee', 'priority', 'due', 'points'] as const;
export type IssueColumn = (typeof ISSUE_COLUMNS)[number];
export const PERIODS = ['week', 'last14', 'last30', 'sprint'] as const;
export type PeriodKind = (typeof PERIODS)[number];

export type ReportBlock =
  | { id: string; type: 'heading'; text: string; level: 1 | 2 | 3 }
  | { id: string; type: 'text'; text: string }
  | { id: string; type: 'kpis'; title?: string | null; metrics: KpiKey[] }
  | { id: string; type: 'chart'; chart: ChartKey; title?: string | null; days?: number | null; sprintId?: number | null }
  | { id: string; type: 'issues'; title?: string | null; jql: string; columns: IssueColumn[]; limit: number }
  | { id: string; type: 'risks'; title?: string | null; limit: number }
  | { id: string; type: 'ai'; title?: string | null; audience: 'team' | 'teacher' | 'client'; text?: string | null; generatedAt?: string | null; refreshOnSend: boolean }
  | { id: string; type: 'pageBreak' };
export type BlockType = ReportBlock['type'];

export interface ReportLayout {
  version?: 1; title: string; subtitle?: string | null; period: PeriodKind; language?: 'en' | 'vi' | null;
  options: { cover: boolean; toc: boolean; logo: boolean; coverImage: boolean; accent?: string | null };
  blocks: ReportBlock[];
}

export interface TemplateRow { ref: string; id?: number; key?: string; builtin: boolean; name: string; description: string | null; layout: ReportLayout; updatedAt?: string }
export interface TemplateList { language: 'en' | 'vi'; builtins: TemplateRow[]; templates: TemplateRow[]; canEdit: boolean; canManage: boolean }

export type ResolvedBlock =
  | { id: string; type: 'heading'; text: string; level: number }
  | { id: string; type: 'text'; text: string }
  | { id: string; type: 'pageBreak' }
  | { id: string; type: 'kpis'; title: string | null; items: Array<{ key: string; label: string; value: string; hint: string | null }> }
  | { id: string; type: 'chart'; title: string; svg: string }
  | { id: string; type: 'issues'; title: string | null; columns: string[]; colKeys: string[]; rows: string[][]; total: number }
  | { id: string; type: 'risks'; title: string; items: Array<{ key: string; title: string; level: string | null; score: number | null; owner: string | null; mitigation: string | null }>; note: string | null }
  | { id: string; type: 'ai'; title: string; text: string; generatedAt: string | null; note: string }
  | { id: string; type: 'error'; message: string };
export interface ResolvedReport {
  title: string; subtitle: string | null; lang: 'en' | 'vi'; period: { from: string; to: string; kind: PeriodKind; sprint: { id: number; name: string } | null };
  project: { name: string; key: string }; workspace: { name: string }; accent: string; generatedAt: string; blocks: ResolvedBlock[];
}

const download = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
const fileNameOf = (cd: string | undefined, fallback: string) => {
  const m = /filename\*=UTF-8''([^;]+)/i.exec(cd ?? '');
  return m ? decodeURIComponent(m[1]) : fallback;
};

export const reportBuilderApi = {
  templates: (pid: number) => d<TemplateList>(api.get(`${B}/${pid}/report-builder/templates`)),
  create: (pid: number, body: { name: string; description?: string | null; layout: ReportLayout }) => d<TemplateRow>(api.post(`${B}/${pid}/report-builder/templates`, body)),
  update: (pid: number, id: number, body: { name?: string; description?: string | null; layout?: ReportLayout }) => d<TemplateRow>(api.patch(`${B}/${pid}/report-builder/templates/${id}`, body)),
  remove: (pid: number, id: number) => d<{ ok: true }>(api.delete(`${B}/${pid}/report-builder/templates/${id}`)),
  preview: (pid: number, layout: ReportLayout) => d<ResolvedReport>(api.post(`${B}/${pid}/report-builder/preview`, { layout })),
  ai: (pid: number, audience: 'team' | 'teacher' | 'client') => d<{ text: string; generatedAt: string }>(api.post(`${B}/${pid}/report-builder/ai`, { audience })),
  exportFile: async (pid: number, layout: ReportLayout, format: 'pdf' | 'docx') => {
    const r = await api.post(`${B}/${pid}/report-builder/export`, { layout, format }, { responseType: 'blob' });
    download(r.data as Blob, fileNameOf(r.headers['content-disposition'] as string | undefined, `report.${format}`));
  },
};

// ─── Lịch tự gửi ─────────────────────────────────────────────────

export interface Recipient { email: string; userId: number | null; external: boolean; status: 'APPROVED' | 'PENDING' | 'REJECTED'; decidedById: number | null; decidedAt: string | null }
export interface SendPlan {
  id: number; name: string; templateRef: string | null; templateName: string | null; cadence: 'WEEKLY' | 'SPRINT'; weekday: number; hour: number; timezone: string;
  format: 'pdf' | 'docx'; recipients: Recipient[]; chatHookIds: number[]; slackChannelIds: number[]; enabled: boolean; lastRunAt: string | null;
  lastPeriodKey: string | null; createdAt: string; pendingApprovals: number;
}
export interface PlanBody {
  name: string; templateRef: string; cadence: 'WEEKLY' | 'SPRINT'; weekday: number; hour: number; timezone: string; format: 'pdf' | 'docx';
  recipients: string[]; chatHookIds: number[]; slackChannelIds: number[]; enabled: boolean;
}
export interface Delivery {
  id: number; scheduleId: number | null; schedule: string | null; periodKey: string; trigger: 'AUTO' | 'MANUAL'; status: 'RUNNING' | 'SENT' | 'PARTIAL' | 'FAILED' | 'SKIPPED';
  title: string; detail: Array<{ channel: 'email' | 'chat' | 'slack'; target: string; ok: boolean; error?: string | null }>; fileName: string | null; hasFile: boolean;
  by: string | null; createdAt: string; finishedAt: string | null;
}
export interface PlanList {
  plans: SendPlan[]; chatHooks: Array<{ id: number; kind: string; name: string }>; slackChannels: Array<{ id: number; name: string }>;
  deliveries: Delivery[]; canEdit: boolean; canApprove: boolean;
}

export const reportPlansApi = {
  list: (pid: number) => d<PlanList>(api.get(`${B}/${pid}/report-plans`)),
  create: (pid: number, body: PlanBody) => d<SendPlan>(api.post(`${B}/${pid}/report-plans`, body)),
  update: (pid: number, id: number, body: Partial<PlanBody>) => d<SendPlan>(api.patch(`${B}/${pid}/report-plans/${id}`, body)),
  remove: (pid: number, id: number) => d<{ ok: true }>(api.delete(`${B}/${pid}/report-plans/${id}`)),
  send: (pid: number, id: number) => d<{ deliveryId: number; status: string } | null>(api.post(`${B}/${pid}/report-plans/${id}/send`)),
  decide: (pid: number, id: number, email: string, approve: boolean) => d<{ ok: true }>(api.post(`${B}/${pid}/report-plans/${id}/recipients/decide`, { email, approve })),
  deliveries: (pid: number) => d<Delivery[]>(api.get(`${B}/${pid}/report-plans/deliveries`)),
  file: async (pid: number, id: number, name: string) => {
    const r = await api.get(`${B}/${pid}/report-plans/deliveries/${id}/file`, { responseType: 'blob' });
    download(r.data as Blob, name);
  },
};

// ─── Notion ──────────────────────────────────────────────────────

export interface NotionStatus { configured: boolean; connected: boolean; account: { name: string | null; email: string | null; status: string } | null }
export interface NotionItem { id: string; kind: 'page' | 'database'; title: string; url: string | null; lastEdited: string | null; icon: string | null }
export type NotionDbPreview = ImportPreview & { database: { id: string; title: string; rows: number; properties: Array<{ name: string; type: string }> } };
export type NotionDbReport = ImportReport & { database: { id: string; title: string; rows: number } };

export const notionApi = {
  status: () => d<NotionStatus>(api.get('/work/notion/status')),
  search: (query: string, kind: 'page' | 'database') => d<NotionItem[]>(api.post('/work/notion/search', { query, kind })),
  importPage: (pid: number, body: { pageId: string; includeChildren: boolean; parentNumber?: number | null }) =>
    d<{ page: { number: number; title: string }; pages: Array<{ number: number; title: string }>; warnings: string[] }>(api.post(`${B}/${pid}/notion/import-page`, body)),
  exportPage: (pid: number, body: { pageNumber: number; parentPageId: string }) => d<{ url: string | null; blocks: number; warnings: string[] }>(api.post(`${B}/${pid}/notion/export-page`, body)),
  previewDb: (pid: number, body: { databaseId: string; mapping?: Partial<Record<MapField, number | null>>; people?: Record<string, number | null>; statuses?: Record<string, number> }) =>
    d<NotionDbPreview>(api.post(`${B}/${pid}/notion/import-database`, { ...body, dryRun: true })),
  importDb: (pid: number, body: { databaseId: string; mapping?: Partial<Record<MapField, number | null>>; people?: Record<string, number | null>; statuses?: Record<string, number> }) =>
    d<NotionDbReport>(api.post(`${B}/${pid}/notion/import-database`, { ...body, dryRun: false })),
};

// ─── Slack ───────────────────────────────────────────────────────

export const SLACK_EVENTS = ['issue.created', 'issue.assigned', 'issue.done', 'comment.created'] as const;
export interface SlackWorkspace {
  configured: { oauth: boolean; signing: boolean }; canManage: boolean;
  install: { teamId: string; teamName: string; installedBy: string | null; createdAt: string } | null;
  myConnection: { teamId: string | null; teamName: string | null; status: string } | null;
  commandUrl: string; eventsUrl: string;
}
export interface SlackChannel { id: number; channelId: string; channelName: string; events: string[]; intake: boolean; enabled: boolean; lastSentAt: string | null; lastError: string | null }
export interface ProjectSlack { configured: { oauth: boolean; signing: boolean }; install: { teamName: string } | null; canManage: boolean; channels: SlackChannel[] }

export const slackApi = {
  workspace: (wsid: number) => d<SlackWorkspace>(api.get(`/work/workspaces/${wsid}/slack`)),
  link: (wsid: number) => d<{ teamId: string; teamName: string }>(api.post(`/work/workspaces/${wsid}/slack/link`)),
  unlink: (wsid: number) => d<{ ok: true }>(api.delete(`/work/workspaces/${wsid}/slack`)),
  project: (pid: number) => d<ProjectSlack>(api.get(`${B}/${pid}/slack`)),
  available: (pid: number) => d<Array<{ id: string; name: string; private: boolean; member: boolean }>>(api.get(`${B}/${pid}/slack/available`)),
  add: (pid: number, body: { channelId: string; channelName: string; events: string[]; intake: boolean }) => d<SlackChannel>(api.post(`${B}/${pid}/slack/channels`, body)),
  update: (pid: number, id: number, body: Partial<Pick<SlackChannel, 'events' | 'intake' | 'enabled'>>) => d<SlackChannel>(api.patch(`${B}/${pid}/slack/channels/${id}`, body)),
  remove: (pid: number, id: number) => d<{ ok: true }>(api.delete(`${B}/${pid}/slack/channels/${id}`)),
  test: (pid: number, id: number) => d<{ ok: true }>(api.post(`${B}/${pid}/slack/channels/${id}/test`)),
};
