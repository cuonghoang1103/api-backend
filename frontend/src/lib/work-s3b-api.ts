/**
 * CT Work — đợt S3b: Yêu cầu thay đổi (CR) · Sổ RAID · Cuộc họp. Backend:
 * src/routes/work.governance.routes.ts + services/work/{changeRequests,raid,meetings}.service.ts.
 * Tách khỏi work-api.ts để không giẫm phiên khác; kiểu ở đây phải khớp service.
 */
import { api } from './api';
import type { ApprovalMode, StatusCategory, TiptapDoc, WorkApproval, WorkUser } from './work-api';
import { translate as wtr, type WKey } from '@/components/work/i18n/core';
import { currentWorkLocale } from '@/components/work/i18n/store';
const wt = (k: WKey, v?: Record<string, string | number>) => wtr(currentWorkLocale(), k, v);

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const q = (o: Record<string, string | number | undefined>) => {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
};

// ═══ Kiểu ═══════════════════════════════════════════════════════════

export type CrStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'IMPLEMENTED';
export type CrUrgency = 'LOW' | 'MEDIUM' | 'HIGH';
export type CrLinkRole = 'AFFECTED' | 'IMPLEMENTS';

export interface CrRow {
  id: number;
  number: number;
  key: string;
  title: string;
  status: CrStatus;
  urgency: CrUrgency;
  scheduleDays: number | null;
  costAmount: number | null;
  costCurrency: string | null;
  clientVisible: boolean;
  submittedAt: string | null;
  decidedAt: string | null;
  implementedAt: string | null;
  createdAt: string;
  updatedAt: string;
  owner: WorkUser | null;
  requester: WorkUser | null;
  pendingApprovalId: number | null;
  waitingDays: number | null;
}

export interface CrTotals {
  approvedCount: number;
  approvedDays: number;
  approvedCost: Array<{ currency: string; amount: number }>;
  pending: number;
  byStatus: Record<string, number>;
}

export interface CrList { items: CrRow[]; totals: CrTotals; canEdit: boolean; canRequestApproval: boolean; portalOn: boolean }

export interface CrLink {
  id: number;
  role: CrLinkRole;
  createdAt: string;
  issue: { number: number; key: string; title: string; done: boolean; status: { name: string; category: StatusCategory }; type: { key: string; name: string; color: string; icon: string } } | null;
  stage: { id: number; n: number; name: string; status: string } | null;
  version: { id: number; name: string; status: string; releaseDate: string | null } | null;
}

export interface CrDetail extends CrRow {
  descriptionJson: TiptapDoc | null;
  reason: string | null;
  impactScope: string | null;
  impactRisk: string | null;
  alternatives: string | null;
  clientSharedAt: string | null;
  version: number;
  createdBy: WorkUser | null;
  sourceIssue: { number: number; title: string; key: string } | null;
  links: CrLink[];
  risks: Array<{ number: number; type: string; title: string; status: string; probability: number | null; impact: number | null }>;
  canEdit: boolean;
  canDelete: boolean;
  canRequestApproval: boolean;
  portalOn: boolean;
  approvalsOn: boolean;
  suggestions: Array<{ title: string; description: string; typeKey: 'STORY' | 'TASK' }>;
}

export interface CrPatch {
  title?: string;
  descriptionJson?: TiptapDoc | null;
  reason?: string | null;
  urgency?: CrUrgency;
  impactScope?: string | null;
  scheduleDays?: number | null;
  costAmount?: number | null;
  costCurrency?: string | null;
  impactRisk?: string | null;
  alternatives?: string | null;
  ownerId?: number | null;
  requesterId?: number | null;
}

/** Bản CR khách đọc trong phê duyệt của họ (cổng khách) — chỉ khi đã chia sẻ. */
export interface CrForClient {
  key: string; number: number; title: string; status: CrStatus; descriptionJson: TiptapDoc | null; reason: string | null; urgency: CrUrgency;
  impactScope: string | null; scheduleDays: number | null; costAmount: number | null; costCurrency: string | null; impactRisk: string | null; alternatives: string | null;
}

export type RaidType = 'RISK' | 'ASSUMPTION' | 'ISSUE' | 'DEPENDENCY';
export type RaidResponse = 'AVOID' | 'MITIGATE' | 'TRANSFER' | 'ACCEPT';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RaidItem {
  id: number;
  number: number;
  key: string;
  type: RaidType;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  probability: number | null;
  impact: number | null;
  response: RaidResponse | null;
  mitigation: string | null;
  trigger: string | null;
  reviewDate: string | null;
  /** Đợt S4: rủi ro được nêu trong báo cáo tuần cho khách (chỉ RISK). */
  clientVisible?: boolean;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  createdById: number | null;
  owner: WorkUser | null;
  score: number | null;
  level: RiskLevel | null;
  closed: boolean;
  reviewDue: boolean;
  linkCount: number;
}

export interface RaidList {
  today: string;
  items: RaidItem[];
  matrix: number[][];
  counts: Record<RaidType, { total: number; open: number }>;
  reviewDue: number;
  highRisks: number;
  thresholds: { HIGH: number; MEDIUM: number };
  canEdit: boolean;
}

export interface RaidDetail extends RaidItem {
  createdBy: WorkUser | null;
  links: Array<{
    id: number;
    issue: { number: number; key: string; title: string; done: boolean; status: { name: string; category: StatusCategory } } | null;
    stage: { id: number; n: number; name: string; status: string } | null;
    changeRequest: { number: number; key: string; title: string; status: CrStatus } | null;
  }>;
  history: Array<{ id: number; field: string; fromValue: string | null; toValue: string | null; createdAt: string; actor: WorkUser | null }>;
  statuses: string[];
  canEdit: boolean;
  canDelete: boolean;
}

export interface RaidPatch {
  type?: RaidType;
  title?: string;
  description?: string | null;
  category?: string | null;
  ownerId?: number | null;
  status?: string;
  probability?: number | null;
  impact?: number | null;
  response?: RaidResponse | null;
  mitigation?: string | null;
  trigger?: string | null;
  reviewDate?: string | null;
  clientVisible?: boolean;
}

export type MeetingType = 'KICKOFF' | 'DAILY' | 'WEEKLY' | 'DEMO' | 'RETRO' | 'STEERING' | 'CLIENT' | 'ELICITATION' | 'OTHER';
export type MeetingStatus = 'SCHEDULED' | 'DONE' | 'CANCELLED';

export interface MeetingRow {
  id: number;
  number: number;
  key: string;
  title: string;
  type: MeetingType;
  typeLabel: string;
  status: MeetingStatus;
  startsAt: string;
  endsAt: string;
  timezone: string;
  location: string | null;
  meetingUrl: string | null;
  provider: 'MEET' | 'ZOOM' | 'TEAMS' | 'JITSI' | 'OTHER' | null;
  minutesShared: boolean;
  createdAt: string;
  updatedAt: string;
  organizer: WorkUser | null;
  attendees: WorkUser[];
  actionCount: number;
  actionsOpen: number;
}

export interface MeetingAction {
  id: number;
  position: number;
  text: string;
  dueDate: string | null;
  assignee: WorkUser | null;
  issue: { number: number; key: string; title: string; done: boolean; status: { name: string; category: StatusCategory } } | null;
}

export interface MeetingDetail extends Omit<MeetingRow, 'attendees'> {
  agendaJson: TiptapDoc | null;
  minutesJson: TiptapDoc | null;
  minutesSharedAt: string | null;
  sequence: number;
  version: number;
  decisions: string[];
  attendees: Array<WorkUser & { isClient: boolean }>;
  hasClients: boolean;
  actions: MeetingAction[];
  previous: { number: number; title: string; startsAt: string } | null;
  next: Array<{ number: number; title: string; startsAt: string }>;
  canEdit: boolean;
  canDelete: boolean;
  canCreateIssues: boolean;
  canUseAi: boolean;
  portalOn: boolean;
}

export interface MeetingPatch {
  title?: string;
  type?: MeetingType;
  status?: MeetingStatus;
  startsAt?: string;
  endsAt?: string;
  timezone?: string;
  location?: string | null;
  meetingUrl?: string | null;
  agendaJson?: TiptapDoc | null;
  minutesJson?: TiptapDoc | null;
  decisions?: string[];
}

export interface PortalMeeting extends MeetingRow {
  shared?: boolean;
  agendaJson?: TiptapDoc | null;
  minutesJson?: TiptapDoc | null;
  decisions?: string[];
  actions?: Array<{ id: number; text: string; dueDate: string | null; assignee: WorkUser | null }>;
  minutesSharedAt?: string | null;
}

export interface IssueGovernance {
  changeRequests: Array<{ number: number; title: string; status: CrStatus; scheduleDays: number | null; role: CrLinkRole }> | null;
  risks: Array<{ number: number; type: RaidType; title: string; status: string; probability: number | null; impact: number | null; score: number | null }> | null;
}

// ═══ Khoá cache ════════════════════════════════════════════════════

export const govKeys = {
  all: (pid: number) => ['work', 'gov', pid] as const,
  changes: (pid: number, status?: string) => ['work', 'gov', pid, 'changes', status ?? ''] as const,
  change: (pid: number, num: number) => ['work', 'gov', pid, 'change', num] as const,
  raid: (pid: number) => ['work', 'gov', pid, 'raid'] as const,
  raidItem: (pid: number, num: number) => ['work', 'gov', pid, 'raid-item', num] as const,
  topRisks: (pid: number) => ['work', 'gov', pid, 'top-risks'] as const,
  meetings: (pid: number, scope: string) => ['work', 'gov', pid, 'meetings', scope] as const,
  meeting: (pid: number, num: number) => ['work', 'gov', pid, 'meeting', num] as const,
  issue: (pid: number, num: number) => ['work', 'gov', pid, 'issue', num] as const,
  portalMeetings: (pid: number, asClient: boolean) => ['work', 'portal', pid, 'meetings', asClient] as const,
  portalMeeting: (pid: number, num: number, asClient: boolean) => ['work', 'portal', pid, 'meeting', num, asClient] as const,
};

// ═══ Gọi API ═══════════════════════════════════════════════════════

/** Tải một tệp .ics (cần đăng nhập ⇒ không dùng <a href> trần). */
async function downloadIcs(path: string, fallbackName: string) {
  const res = await api.get(path, { responseType: 'blob' });
  const cd = String(res.headers?.['content-disposition'] ?? '');
  const name = /filename="([^"]+)"/.exec(cd)?.[1] ?? fallbackName;
  const url = URL.createObjectURL(res.data as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const govApi = {
  // CR
  changes: (pid: number, status?: CrStatus) => d<CrList>(api.get(`${B}/projects/${pid}/changes${q({ status })}`)),
  change: (pid: number, num: number) => d<CrDetail>(api.get(`${B}/projects/${pid}/changes/${num}`)),
  createChange: (pid: number, body: CrPatch & { title: string; sourceIssueNumber?: number | null; useTemplate?: boolean }) =>
    d<CrDetail>(api.post(`${B}/projects/${pid}/changes`, body)),
  updateChange: (pid: number, num: number, body: CrPatch & { version?: number }) => d<CrDetail>(api.patch(`${B}/projects/${pid}/changes/${num}`, body)),
  deleteChange: (pid: number, num: number) => d<{ deleted: true }>(api.delete(`${B}/projects/${pid}/changes/${num}`)),
  setChangeStatus: (pid: number, num: number, status: CrStatus) => d<CrDetail>(api.post(`${B}/projects/${pid}/changes/${num}/status`, { status })),
  shareChange: (pid: number, num: number, visible: boolean) => d<CrDetail>(api.put(`${B}/projects/${pid}/changes/${num}/client-visible`, { visible })),
  requestChangeApproval: (pid: number, num: number, body: { approverIds: number[]; mode?: ApprovalMode; title?: string; description?: string | null; dueAt?: string | null }) =>
    d<WorkApproval>(api.post(`${B}/projects/${pid}/changes/${num}/approval`, body)),
  linkChange: (pid: number, num: number, body: { role?: CrLinkRole; issueNumber?: number; stageId?: number; versionId?: number }) =>
    d<CrDetail>(api.post(`${B}/projects/${pid}/changes/${num}/links`, body)),
  unlinkChange: (pid: number, num: number, linkId: number) => d<CrDetail>(api.delete(`${B}/projects/${pid}/changes/${num}/links/${linkId}`)),
  implementChange: (pid: number, num: number, items: Array<{ title: string; description?: string | null; typeKey?: string; assigneeId?: number | null; dueDate?: string | null }>) =>
    d<{ created: Array<{ number: number; key: string; title: string }>; changeRequest: CrDetail }>(api.post(`${B}/projects/${pid}/changes/${num}/implement`, { items })),
  issueGovernance: (pid: number, num: number) => d<IssueGovernance>(api.get(`${B}/projects/${pid}/issues/${num}/governance`)),

  // RAID
  raid: (pid: number) => d<RaidList>(api.get(`${B}/projects/${pid}/raid`)),
  topRisks: (pid: number, limit = 5) => d<{ enabled: boolean; items: RaidItem[] }>(api.get(`${B}/projects/${pid}/raid/top${q({ limit })}`)),
  raidItem: (pid: number, num: number) => d<RaidDetail>(api.get(`${B}/projects/${pid}/raid/${num}`)),
  createRaid: (pid: number, body: RaidPatch & { type: RaidType; title: string }) => d<RaidDetail>(api.post(`${B}/projects/${pid}/raid`, body)),
  updateRaid: (pid: number, num: number, body: RaidPatch & { version?: number }) => d<RaidDetail>(api.patch(`${B}/projects/${pid}/raid/${num}`, body)),
  deleteRaid: (pid: number, num: number) => d<{ deleted: true }>(api.delete(`${B}/projects/${pid}/raid/${num}`)),
  linkRaid: (pid: number, num: number, body: { issueNumber?: number; stageId?: number; crNumber?: number }) => d<RaidDetail>(api.post(`${B}/projects/${pid}/raid/${num}/links`, body)),
  unlinkRaid: (pid: number, num: number, linkId: number) => d<RaidDetail>(api.delete(`${B}/projects/${pid}/raid/${num}/links/${linkId}`)),
  starterRisks: (pid: number) => d<{ added: number; total: number }>(api.post(`${B}/projects/${pid}/raid/starter`, {})),

  // Họp
  meetings: (pid: number, scope: 'upcoming' | 'past' | 'all' = 'all') =>
    d<{ items: MeetingRow[]; canEdit: boolean; portalOn: boolean; now: string }>(api.get(`${B}/projects/${pid}/meetings${q({ scope })}`)),
  meeting: (pid: number, num: number) => d<MeetingDetail>(api.get(`${B}/projects/${pid}/meetings/${num}`)),
  createMeeting: (pid: number, body: MeetingPatch & { title: string; startsAt: string; endsAt: string; attendeeIds?: number[]; useTemplate?: boolean; sendInvites?: boolean }) =>
    d<MeetingDetail>(api.post(`${B}/projects/${pid}/meetings`, body)),
  updateMeeting: (pid: number, num: number, body: MeetingPatch & { version?: number }) => d<MeetingDetail>(api.patch(`${B}/projects/${pid}/meetings/${num}`, body)),
  deleteMeeting: (pid: number, num: number) => d<{ deleted: true }>(api.delete(`${B}/projects/${pid}/meetings/${num}`)),
  setAttendees: (pid: number, num: number, userIds: number[]) => d<MeetingDetail>(api.put(`${B}/projects/${pid}/meetings/${num}/attendees`, { userIds })),
  setActions: (pid: number, num: number, items: Array<{ id?: number; text: string; assigneeId?: number | null; dueDate?: string | null }>) =>
    d<MeetingDetail>(api.put(`${B}/projects/${pid}/meetings/${num}/actions`, { items })),
  createIssues: (pid: number, num: number, actionIds?: number[]) =>
    d<{ created: Array<{ actionId: number; number: number; key: string; title: string }>; meeting: MeetingDetail }>(api.post(`${B}/projects/${pid}/meetings/${num}/actions/issues`, { actionIds })),
  suggestActions: (pid: number, num: number) =>
    d<{ reply: string; proposals: Array<{ text: string; assigneeId: number | null; dueDate: string | null }> }>(api.post(`${B}/projects/${pid}/meetings/${num}/actions/suggest`, {})),
  shareMinutes: (pid: number, num: number, shared: boolean) => d<MeetingDetail>(api.post(`${B}/projects/${pid}/meetings/${num}/share`, { shared })),
  duplicateMeeting: (pid: number, num: number, weeks = 1) => d<MeetingDetail>(api.post(`${B}/projects/${pid}/meetings/${num}/duplicate`, { weeks })),
  sendInvites: (pid: number, num: number) => d<{ sent: number }>(api.post(`${B}/projects/${pid}/meetings/${num}/invites`, {})),
  downloadIcs: (pid: number, num: number) => downloadIcs(`${B}/projects/${pid}/meetings/${num}/ics`, `meeting-${num}.ics`),

  // Cổng khách
  portalMeetings: (pid: number, asClient?: boolean) =>
    d<{ enabled: boolean; staffView?: boolean; items: PortalMeeting[] }>(api.get(`${B}/projects/${pid}/portal/meetings${q({ as: asClient ? 'client' : undefined })}`)),
  portalMeeting: (pid: number, num: number, asClient?: boolean) =>
    d<PortalMeeting>(api.get(`${B}/projects/${pid}/portal/meetings/${num}${q({ as: asClient ? 'client' : undefined })}`)),
  downloadPortalIcs: (pid: number, num: number, asClient?: boolean) =>
    downloadIcs(`${B}/projects/${pid}/portal/meetings/${num}/ics${q({ as: asClient ? 'client' : undefined })}`, `meeting-${num}.ics`),
};

// ═══ Nhãn ═════════════════════════════════════════════════════════

export const CR_STATUS_LABEL: Record<CrStatus, string> = {
  get DRAFT() { return wt('gov.crDraft'); }, get SUBMITTED() { return wt('gov.crSubmitted'); }, get UNDER_REVIEW() { return wt('gov.crReview'); }, get APPROVED() { return wt('gov.crApproved'); }, get REJECTED() { return wt('gov.crRejected'); }, get IMPLEMENTED() { return wt('gov.crImplemented'); },
};
export const CR_STATUSES: CrStatus[] = ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED'];
export const RAID_LABEL: Record<RaidType, { one: string; many: string }> = {
  RISK: { get one() { return wt('gov.risk'); }, get many() { return wt('gov.risks'); } }, ASSUMPTION: { get one() { return wt('gov.assumption'); }, get many() { return wt('gov.assumptions'); } },
  ISSUE: { get one() { return wt('gov.issueR'); }, get many() { return wt('gov.issuesR'); } }, DEPENDENCY: { get one() { return wt('gov.dependency'); }, get many() { return wt('gov.dependencies'); } },
};
export const RAID_TYPES: RaidType[] = ['RISK', 'ASSUMPTION', 'ISSUE', 'DEPENDENCY'];
export const RAID_STATUS_LABEL: Record<string, string> = {
  get OPEN() { return wt('gov.rsOpen'); }, get MONITORING() { return wt('gov.rsMonitoring'); }, get MITIGATED() { return wt('gov.rsMitigated'); }, get CLOSED() { return wt('gov.rsClosed'); }, get UNVALIDATED() { return wt('gov.rsUnvalidated'); }, get VALIDATED() { return wt('gov.rsValidated'); }, get INVALID() { return wt('gov.rsInvalid'); },
};
export const RAID_RESPONSE_LABEL: Record<RaidResponse, string> = { get AVOID() { return wt('gov.rrAvoid'); }, get MITIGATE() { return wt('gov.rrMitigate'); }, get TRANSFER() { return wt('gov.rrTransfer'); }, get ACCEPT() { return wt('gov.rrAccept'); } };
export const MEETING_TYPE_LABEL: Record<MeetingType, string> = {
  get KICKOFF() { return wt('gov.mtKickoff'); }, get DAILY() { return wt('gov.mtDaily'); }, get WEEKLY() { return wt('gov.mtWeekly'); }, get DEMO() { return wt('gov.mtDemo'); }, get RETRO() { return wt('gov.mtRetro'); }, get STEERING() { return wt('gov.mtSteering'); }, get CLIENT() { return wt('gov.mtClient'); }, get ELICITATION() { return wt('gov.mtElicitation'); }, get OTHER() { return wt('gov.mtOther'); },
};
export const MEETING_TYPES: MeetingType[] = ['KICKOFF', 'DAILY', 'WEEKLY', 'DEMO', 'RETRO', 'STEERING', 'CLIENT', 'ELICITATION', 'OTHER'];
