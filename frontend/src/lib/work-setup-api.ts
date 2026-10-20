/**
 * CT Work — "Create with CuongMini" (20/10/2026). Backend: src/routes/work.taoCuongMini.routes.ts +
 * src/services/work/taoCuongMini/*. Kiểu ở đây phải khớp taoCuongMini/kieu.ts.
 * Vé mở khoá CuongMini Optimum (48 h) giữ ở trình duyệt (sessionStorage, bọc try/catch) và gửi kèm từng yêu cầu.
 */
import { api } from './api';
import type { ProjectKind, ProjectTemplate, ProjectType } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type SetupModelId = 'cm-sonic' | 'cm-optimum';
export type DraftStatus = 'DRAFT' | 'READING' | 'UNDERSTOOD' | 'PLANNING' | 'READY' | 'APPLYING' | 'APPLIED' | 'FAILED' | 'CANCELLED';
export type SourceCategory = 'BRIEF' | 'TEMPLATE' | 'CODE' | 'SAMPLE' | 'ROSTER' | 'OTHER';
export type AssignRule = 'BY_LEVEL' | 'EQUAL_LOAD' | 'MODULE_OWNER' | 'LEADER_REVIEWS';
export type DetailLevel = 'EPICS' | 'STORIES' | 'SUBTASKS';
export type Lang = 'vi' | 'en' | 'both';

export interface RosterRow { name: string; studentId: string; email: string; role: string; skills: string; level: number; hoursPerWeek: number; prefs: string; group: string }
export interface GroupInput { name: string; key: string; topic: string; leader: string }

export interface SetupInput {
  overview: { name: string; key: string; template: ProjectTemplate; type: ProjectType; kind: ProjectKind; courseCode: string; className: string; semester: string; stakeholders: string; language: Lang; goal: string };
  brief: { text: string; functional: string; nonFunctional: string; rubric: string; deliverables: string[] };
  team: { members: RosterRow[]; rules: AssignRule[]; rulesText: string; sendInvites: boolean };
  timeline: {
    startDate: string; endDate: string; milestones: Array<{ name: string; date: string }>; sprintWeeks: number; workingDays: number[];
    avoid: Array<{ name: string; from: string; to: string }>; meeting: { weekday: number; time: string; durationMin: number } | null;
  };
  code: { repoUrl: string; branch: string; stack: string; conventions: string };
  split: { prompt: string; detail: DetailLevel; criteria: boolean; points: boolean; tests: boolean; risks: boolean; meetings: boolean; pages: boolean; assign: boolean; onboarding: boolean };
  groups: GroupInput[];
  reviewFirst: boolean;
}

export const emptyRow = (): RosterRow => ({ name: '', studentId: '', email: '', role: '', skills: '', level: 3, hoursPerWeek: 8, prefs: '', group: '' });

export function defaultInput(o: Partial<SetupInput['overview']> = {}): SetupInput {
  return {
    overview: { name: '', key: '', template: 'SWP391', type: 'SCRUM', kind: 'SCHOOL', courseCode: '', className: '', semester: '', stakeholders: '', language: 'vi', goal: '', ...o },
    brief: { text: '', functional: '', nonFunctional: '', rubric: '', deliverables: [] },
    team: { members: [], rules: ['BY_LEVEL', 'LEADER_REVIEWS'], rulesText: '', sendInvites: false },
    timeline: { startDate: '', endDate: '', milestones: [], sprintWeeks: 2, workingDays: [1, 2, 3, 4, 5], avoid: [], meeting: null },
    code: { repoUrl: '', branch: '', stack: '', conventions: '' },
    split: { prompt: '', detail: 'SUBTASKS', criteria: true, points: true, tests: true, risks: true, meetings: true, pages: true, assign: true, onboarding: true },
    groups: [],
    reviewFirst: false,
  };
}

export interface Understanding {
  goal: string; scopeIn: string[]; scopeOut: string[];
  deliverables: Array<{ name: string; due: string; criteria: string }>; grading: string[];
  tech: { stack: string[]; repoFindings: string[] };
  team: Array<{ name: string; studentId: string; group: string; proposedRole: string; why: string }>;
  timeline: string[]; strategy: string[]; assumptions: string[]; risks: string[];
  questions: Array<{ q: string; answer: string }>; notes: string;
}

export type ItemKind = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK';
export interface PlanItem {
  ref: string; kind: ItemKind; parentRef: string | null; title: string; description: string; criteria: string[]; points: number | null; priority: number;
  difficulty: number; labels: string[]; component: string; area: string; assigneeRef: string | null; pairRef: string | null; sprintRef: string | null;
  milestoneRef: string | null; due: string | null; blockedBy: string[]; locked: boolean;
}
export interface PlanMember {
  ref: string; name: string; studentId: string; email: string; role: string; skills: string; level: number; hoursPerWeek: number; prefs: string;
  projectRef: string; leader: boolean; mapping: 'USER' | 'INVITE' | 'PLACEHOLDER'; userId: number | null; why: string;
}
export interface PlanPage { ref: string; kind: string | null; title: string; markdown: string }
export interface PlanProject {
  ref: string; name: string; key: string; template: ProjectTemplate; type: ProjectType; kind: ProjectKind; description: string;
  sprints: Array<{ ref: string; name: string; goal: string; start: string; end: string }>;
  milestones: Array<{ ref: string; name: string; date: string; description: string }>;
  labels: Array<{ name: string; color: string }>;
  components: Array<{ name: string; description: string; ownerRef: string | null }>;
  items: PlanItem[];
  pages: PlanPage[];
  tests: Array<{ ref: string; title: string; preconditions: string; steps: Array<{ action: string; expected: string }>; storyRef: string | null }>;
  risks: Array<{ ref: string; title: string; description: string; category: string; probability: number; impact: number; mitigation: string; ownerRef: string | null }>;
  meetings: Array<{ ref: string; title: string; type: string; weekday: number; hour: number; minute: number; durationMin: number; intervalWeeks: number; startDate: string; endDate: string | null; agenda: string[] }>;
  resources: Array<{ title: string; url: string; group: string; note: string }>;
  dod: string[];
}
export interface PlanWarning { kind: 'MISSING_INFO' | 'OVERLOAD' | 'DEADLINE' | 'UNASSIGNED' | 'BEGINNER_HARD' | 'CAP' | 'NO_EMAIL' | 'SOURCE'; projectRef: string | null; ref: string | null; message: string }
export interface SetupPlan { projects: PlanProject[]; members: PlanMember[]; portfolio: PlanPage | null; warnings: PlanWarning[] }

export interface SetupSource {
  id: string; kind: 'FILE' | 'LINK' | 'REPO'; category: SourceCategory; name: string; note: string; mime?: string; size?: number; url?: string;
  status: 'OK' | 'EMPTY' | 'ERROR' | 'PRIVATE'; error?: string; chars: number; addedAt: string;
}
export interface ProgressStep { key: string; status: 'pending' | 'running' | 'done' | 'skipped' | 'error'; detail?: string; at?: string }
export interface ApplyResult {
  projects: Array<{ id: number; key: string; name: string; url: string; issues: number; pages: number; sprints: number; tests: number; risks: number; meetings: number; resources: number; files: number; invited: number; added: number; planned: number }>;
  invites: { sent: number; added: number; skipped: number; reason?: string };
}
export interface SetupDraft {
  id: number; workspaceId: number; mode: 'PROJECT' | 'WORKSPACE'; status: DraftStatus; title: string; model: SetupModelId;
  input: SetupInput; understanding: Understanding | null; plan: SetupPlan | null; progress: ProgressStep[]; result: ApplyResult | null;
  error: string | null; failedPhase: 'READING' | 'PLANNING' | 'APPLYING' | null; busy: boolean; sources: SetupSource[];
  usage: { calls: number; usd: number; fallback: number }; createdAt: string; updatedAt: string; appliedAt: string | null;
}
export interface DraftSummary { id: number; mode: string; status: DraftStatus; title: string; updatedAt: string; result: ApplyResult | null }
export interface RosterParse { rows: RosterRow[]; headerFound: boolean; columns: Array<string | null>; warnings: string[] }
export interface SetupModelOption { id: SetupModelId; name: string; locked: boolean; available: boolean; default: boolean }

// ─── Vé khoá (Optimum) ───────────────────────────────────────────

const VE_KEY = 'ctw-cuongmini-ve';
export function getTicket(): string | undefined {
  try { return sessionStorage.getItem(VE_KEY) || localStorage.getItem(VE_KEY) || undefined; } catch { return undefined; }
}
export function setTicket(v: string | null): void {
  try {
    if (v) { sessionStorage.setItem(VE_KEY, v); localStorage.setItem(VE_KEY, v); } else { sessionStorage.removeItem(VE_KEY); localStorage.removeItem(VE_KEY); }
  } catch { /* trình duyệt chặn lưu ⇒ chỉ dùng trong lượt này */ }
}

const withVe = <T extends object>(b: T) => ({ ...b, ve: getTicket() });

export const setupKeys = {
  draft: (id: number) => ['work', 'setup', 'draft', id] as const,
  drafts: (wsId: number) => ['work', 'setup', 'drafts', wsId] as const,
  models: (wsId: number) => ['work', 'setup', 'models', wsId] as const,
};

export const setupApi = {
  models: (wsId: number) => d<SetupModelOption[]>(api.get(`${B}/workspaces/${wsId}/setup/models`, { headers: { 'x-cuongmini-ve': getTicket() ?? '' } })),
  unlock: (wsId: number, matKhau: string) => d<{ ve: string; hetHan: string; unlocked: boolean }>(api.post(`${B}/workspaces/${wsId}/setup/unlock`, { matKhau, ve: getTicket() })),
  parseRosterText: (wsId: number, text: string) => d<RosterParse>(api.post(`${B}/workspaces/${wsId}/setup/roster`, { text })),
  parseRosterFile: (wsId: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return d<RosterParse>(api.post(`${B}/workspaces/${wsId}/setup/roster`, fd));
  },
  drafts: (wsId: number) => d<DraftSummary[]>(api.get(`${B}/workspaces/${wsId}/setup-drafts`)),
  create: (wsId: number, body: { mode: 'PROJECT' | 'WORKSPACE'; input: SetupInput; model?: SetupModelId }) => d<SetupDraft>(api.post(`${B}/workspaces/${wsId}/setup-drafts`, body)),
  get: (id: number) => d<SetupDraft>(api.get(`${B}/setup-drafts/${id}`)),
  patch: (id: number, body: Partial<{ input: SetupInput; understanding: Understanding; plan: SetupPlan; model: SetupModelId; mode: 'PROJECT' | 'WORKSPACE' }>) => d<SetupDraft>(api.patch(`${B}/setup-drafts/${id}`, body)),
  remove: (id: number) => d<{ deleted: boolean }>(api.delete(`${B}/setup-drafts/${id}`)),
  addFile: (id: number, file: File, category: SourceCategory, note: string, onProgress?: (pct: number) => void) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    fd.append('category', category);
    if (note) fd.append('note', note);
    return d<{ draft: SetupDraft; source: SetupSource; roster: RosterParse | null }>(api.post(`${B}/setup-drafts/${id}/files`, fd, {
      timeout: 10 * 60_000, onUploadProgress: (e) => { if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100)); },
    }));
  },
  addLink: (id: number, body: { url: string; category: SourceCategory; note?: string; branch?: string }) => d<{ draft: SetupDraft; source: SetupSource }>(api.post(`${B}/setup-drafts/${id}/links`, body, { timeout: 120_000 })),
  removeSource: (id: number, sid: string) => d<SetupDraft>(api.delete(`${B}/setup-drafts/${id}/sources/${encodeURIComponent(sid)}`)),
  understand: (id: number, body: { reread?: string; model?: SetupModelId } = {}) => d<SetupDraft>(api.post(`${B}/setup-drafts/${id}/understand`, withVe(body))),
  accept: (id: number, body: { understanding?: Understanding; reviewFirst?: boolean; sendInvites?: boolean }) => d<SetupDraft>(api.post(`${B}/setup-drafts/${id}/accept`, withVe(body))),
  revise: (id: number, instruction: string) => d<SetupDraft>(api.post(`${B}/setup-drafts/${id}/revise`, withVe({ instruction }))),
  rebalance: (id: number) => d<SetupDraft>(api.post(`${B}/setup-drafts/${id}/rebalance`, {})),
  apply: (id: number, body: { sendInvites?: boolean } = {}) => d<SetupDraft>(api.post(`${B}/setup-drafts/${id}/apply`, body)),
  cancel: (id: number) => d<SetupDraft>(api.post(`${B}/setup-drafts/${id}/cancel`, {})),
};
