/**
 * CT Work đợt 7a — OKR · planning poker · retro board · timer.
 * Backend: src/routes/work.ctw7a.routes.ts (+ okr/poker/retro/timer.service.ts). Kiểu khớp service.
 */
import { api } from './api';
import type { WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `${B}/projects/${pid}`;

export const agileKeys = {
  okrProject: (pid: number, cycle?: number | null) => ['work', 'agile', 'okr', 'p', pid, cycle ?? 0] as const,
  okrWorkspace: (wid: number, cycle?: number | null) => ['work', 'agile', 'okr', 'w', wid, cycle ?? 0] as const,
  okrAll: ['work', 'agile', 'okr'] as const,
  poker: (pid: number) => ['work', 'agile', 'poker', pid] as const,
  pokerRoom: (pid: number, sid: number) => ['work', 'agile', 'poker', pid, sid] as const,
  retros: (pid: number) => ['work', 'agile', 'retro', pid] as const,
  retro: (pid: number, rid: number) => ['work', 'agile', 'retro', pid, rid] as const,
  timer: ['work', 'agile', 'timer'] as const,
};

// ─── OKR ─────────────────────────────────────────────────────────

export type KrMetric = 'PERCENT' | 'NUMBER' | 'BOOLEAN';
export type KrSource = 'MANUAL' | 'ISSUES' | 'POINTS';
export type OkrStatus = 'NOT_STARTED' | 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' | 'DONE' | 'SCORED';
export interface OkrCycle { id: number; name: string; startDate: string; endDate: string; status: 'ACTIVE' | 'CLOSED'; createdById: number | null }
export interface KrLink { id: number; kind: 'ISSUE' | 'EPIC' | 'SPRINT'; missing?: boolean; hidden?: boolean; key?: string; number?: number; title?: string; done?: boolean; sprintId?: number; name?: string; projectId?: number }
export interface KrCheckin { id: number; weekStart: string; value: number; progress: number; confidence: number; note: string | null; at: string; user: WorkUser | null }
export interface KeyResult {
  id: number; title: string; metric: KrMetric; unit: string | null; startValue: number; targetValue: number; currentValue: number; source: KrSource;
  owner: WorkUser | null; position: number; progress: number; score: number | null; suggestedScore: number;
  linkSummary: { done: number; total: number; unit: 'issues' | 'points' } | null; confidence: number | null; canCheckin: boolean;
  links: KrLink[]; checkins: KrCheckin[];
}
export interface Objective {
  id: number; cycleId: number; projectId: number | null; project: { key: string; name: string } | null; parent: { id: number; title: string } | null;
  title: string; description: string | null; owner: WorkUser | null; position: number; progress: number; expected: number; status: OkrStatus;
  confidence: number | null; score: number | null; scoreBand: 'RED' | 'YELLOW' | 'GREEN' | null; scoreNote: string | null; scoredAt: string | null;
  suggestedScore: number | null; canEdit: boolean; keyResults: KeyResult[];
}
export interface OkrDashboard {
  objectives: number; keyResults: number; statusCounts: Partial<Record<OkrStatus, number>>; avgProgress: number; avgScore: number | null; avgConfidence: number | null;
  weeks: Array<{ week: string; actual: number | null; expected: number; confidence: number | null }>;
}
export interface OkrView {
  scope: 'project' | 'workspace'; workspaceId: number; projectId?: number; cycles: OkrCycle[]; cycle: OkrCycle | null;
  canEdit: boolean; canCreateCycle: boolean; canManageCycle: boolean; alignTo?: Array<{ id: number; title: string }>;
  projects?: Array<{ id: number; key: string; name: string }>; objectives: Objective[]; dashboard: OkrDashboard;
}
export interface KrInput { title: string; metric?: KrMetric; unit?: string | null; startValue?: number; targetValue?: number; source?: KrSource; ownerId?: number | null }

// ─── Poker ───────────────────────────────────────────────────────

export type PokerDeck = 'FIBONACCI' | 'TSHIRT';
export type PokerState = 'PENDING' | 'VOTING' | 'REVEALED' | 'ESTIMATED' | 'SKIPPED';
export interface PokerDistribution {
  counts: Array<{ value: string; count: number }>; voters: number; numeric: number; average: number | null; median: number | null;
  consensus: boolean; mode: string | null; low: string | null; high: string | null; suggested: string | null;
}
export interface PokerVote { user: WorkUser | null; value: string }
export interface PokerItem {
  id: number; position: number; state: PokerState; round: number;
  issue: { number: number; title: string; storyPoints: number | null; type: { key: string; name: string; color: string }; status: { name: string; category: string }; description: string | null };
  finalValue: string | null; finalPoints: number | null; previousPoints: number | null; estimatedBy: WorkUser | null; estimatedAt: string | null;
  voted: number[]; myVote: string | null; votes: PokerVote[] | null; distribution: PokerDistribution | null;
  rounds: Array<{ round: number; votes: PokerVote[]; distribution: PokerDistribution }>;
}
export interface PokerRoom {
  id: number; projectId: number; title: string; deck: PokerDeck; cards: Array<{ value: string; points: number | null }>; status: 'OPEN' | 'CLOSED';
  sprint: { id: number; name: string } | null; currentItemId: number | null; timerEndsAt: string | null; serverNow: string; createdAt: string; closedAt: string | null;
  facilitator: WorkUser | null; me: { canVote: boolean; canFacilitate: boolean }; voters: WorkUser[]; items: PokerItem[];
}
export interface PokerSessionRow {
  id: number; title: string; deck: PokerDeck; status: 'OPEN' | 'CLOSED'; sprint: { id: number; name: string | null } | null; createdBy: WorkUser | null;
  createdAt: string; closedAt: string | null; items: number; estimated: number; points: number;
}
export interface PokerSuggestion { suggested: string | null; points: number | null; basis: Array<{ key: string; title: string; points: number; similarity: number }>; kind: 'suggestion'; note: string }

// ─── Retro ───────────────────────────────────────────────────────

export type RetroTemplate = 'SSC' | 'MSG' | 'FOUR_L';
export const RETRO_TEMPLATES: Record<RetroTemplate, string[]> = {
  SSC: ['START', 'STOP', 'CONTINUE'], MSG: ['MAD', 'SAD', 'GLAD'], FOUR_L: ['LIKED', 'LEARNED', 'LACKED', 'LONGED_FOR'],
};
export interface RetroCard { id: number; column: string; body: string; groupId: number | null; position: number; votes: number; myVotes: number; mine: boolean; author: WorkUser | null; createdAt?: string }
export interface RetroAction { id: number; cardId: number | null; title: string; assignee: WorkUser | null; issue: { id: number; number: number; title: string; status: { name: string; category: string } } | null; createdAt: string }
export interface Retro {
  id: number; projectId: number; title: string; template: RetroTemplate; columns: string[]; sprint: { id: number; name: string; state: string } | null;
  anonymous: boolean; votesPerPerson: number; lockAt: string | null; locked: boolean; lockedManually: boolean; summary: string | null; summaryAt: string | null; createdAt: string;
  facilitator: WorkUser | null; me: { canWrite: boolean; canFacilitate: boolean; canUseAi: boolean; votesLeft: number; votesUsed: number };
  cards: RetroCard[]; actions: RetroAction[];
}
export interface RetroRow { id: number; title: string; template: RetroTemplate; anonymous: boolean; sprint: { id: number; name: string | null } | null; locked: boolean; lockAt: string | null; cards: number; actions: number; hasSummary: boolean; createdBy: WorkUser | null; createdAt: string }

// ─── Timer ───────────────────────────────────────────────────────

export interface RunningTimer {
  id: number; projectId: number; issueNumber: number; issueKey: string; issueTitle: string; projectKey: string; projectName: string; workspaceSlug: string; url: string;
  startedAt: string; running: boolean; runningSince: string | null; elapsedSec: number; activity: string | null; note: string | null;
  remindAfterMin: number; overdue: boolean; serverNow: string;
}

async function download(url: string, fallback: string) {
  const r = await api.get(url, { responseType: 'blob' });
  const cd = String(r.headers['content-disposition'] ?? '');
  const name = decodeURIComponent(/filename\*=UTF-8''([^;]+)/.exec(cd)?.[1] ?? fallback);
  const href = URL.createObjectURL(r.data as Blob);
  const a = document.createElement('a');
  a.href = href; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}

export const agileApi = {
  // OKR
  projectOkrs: (pid: number, cycle?: number | null) => d<OkrView>(api.get(`${P(pid)}/okrs`, { params: cycle ? { cycle } : {} })),
  workspaceOkrs: (wid: number, cycle?: number | null) => d<OkrView>(api.get(`${B}/workspaces/${wid}/okrs`, { params: cycle ? { cycle } : {} })),
  createCycle: (wid: number, body: { name: string; startDate: string; endDate: string }) => d<{ id: number }>(api.post(`${B}/workspaces/${wid}/okr-cycles`, body)),
  updateCycle: (wid: number, cid: number, body: { name?: string; startDate?: string; endDate?: string; status?: 'ACTIVE' | 'CLOSED' }) => d<{ ok: true; autoScored: number }>(api.patch(`${B}/workspaces/${wid}/okr-cycles/${cid}`, body)),
  createObjective: (scope: { pid?: number; wid?: number }, body: { cycleId: number; title: string; description?: string | null; ownerId?: number | null; parentId?: number | null; keyResults?: KrInput[] }) =>
    d<{ id: number }>(api.post(scope.pid ? `${P(scope.pid)}/okrs/objectives` : `${B}/workspaces/${scope.wid}/okrs/objectives`, body)),
  updateObjective: (oid: number, body: { title?: string; description?: string | null; ownerId?: number | null; parentId?: number | null }) => d<{ ok: true }>(api.patch(`${B}/okrs/objectives/${oid}`, body)),
  deleteObjective: (oid: number) => d<{ ok: true }>(api.delete(`${B}/okrs/objectives/${oid}`)),
  addKr: (oid: number, body: KrInput) => d<{ ok: true }>(api.post(`${B}/okrs/objectives/${oid}/key-results`, body)),
  updateKr: (kid: number, body: Partial<KrInput>) => d<{ ok: true }>(api.patch(`${B}/okrs/key-results/${kid}`, body)),
  deleteKr: (kid: number) => d<{ ok: true }>(api.delete(`${B}/okrs/key-results/${kid}`)),
  setLinks: (kid: number, links: Array<{ kind: 'ISSUE' | 'EPIC' | 'SPRINT'; projectId?: number; number?: number; sprintId?: number }>) => d<{ ok: true; links: number }>(api.put(`${B}/okrs/key-results/${kid}/links`, { links })),
  checkin: (kid: number, body: { value?: number; confidence: number; note?: string | null }) => d<{ ok: true; progress: number }>(api.post(`${B}/okrs/key-results/${kid}/checkins`, body)),
  score: (oid: number, body: { krScores: Array<{ id: number; score: number }>; score?: number | null; note?: string | null }) => d<{ ok: true; score: number; band: string }>(api.post(`${B}/okrs/objectives/${oid}/score`, body)),
  // Poker
  pokerList: (pid: number) => d<{ canCreate: boolean; sessions: PokerSessionRow[] }>(api.get(`${P(pid)}/poker`)),
  pokerCreate: (pid: number, body: { title: string; deck: PokerDeck; sprintId?: number | null; issues?: number[] }) => d<{ id: number; items: number }>(api.post(`${P(pid)}/poker`, body)),
  pokerRoom: (pid: number, sid: number) => d<PokerRoom>(api.get(`${P(pid)}/poker/${sid}`)),
  pokerDelete: (pid: number, sid: number) => d<{ ok: true }>(api.delete(`${P(pid)}/poker/${sid}`)),
  pokerAdd: (pid: number, sid: number, issues: number[]) => d<{ added: number }>(api.post(`${P(pid)}/poker/${sid}/items`, { issues })),
  pokerTimer: (pid: number, sid: number, seconds: number) => d<{ timerEndsAt: string | null }>(api.post(`${P(pid)}/poker/${sid}/timer`, { seconds })),
  pokerClose: (pid: number, sid: number) => d<{ ok: true }>(api.post(`${P(pid)}/poker/${sid}/close`)),
  pokerRemove: (pid: number, sid: number, iid: number) => d<{ ok: true }>(api.delete(`${P(pid)}/poker/${sid}/items/${iid}`)),
  pokerAct: (pid: number, sid: number, iid: number, act: 'start' | 'reveal' | 'revote' | 'skip') => d<{ ok: true }>(api.post(`${P(pid)}/poker/${sid}/items/${iid}/${act}`)),
  pokerVote: (pid: number, sid: number, iid: number, value: string | null) => d<{ ok: true }>(api.post(`${P(pid)}/poker/${sid}/items/${iid}/vote`, { value })),
  pokerFinalize: (pid: number, sid: number, iid: number, value: string) => d<{ ok: true; storyPoints: number }>(api.post(`${P(pid)}/poker/${sid}/items/${iid}/finalize`, { value })),
  pokerSuggest: (pid: number, sid: number, iid: number) => d<PokerSuggestion>(api.get(`${P(pid)}/poker/${sid}/items/${iid}/suggest`)),
  // Retro
  retroList: (pid: number) => d<{ canCreate: boolean; retros: RetroRow[] }>(api.get(`${P(pid)}/retros`)),
  retroCreate: (pid: number, body: { title: string; template: RetroTemplate; sprintId?: number | null; anonymous: boolean; votesPerPerson: number; lockAt?: string | null }) => d<{ id: number }>(api.post(`${P(pid)}/retros`, body)),
  retro: (pid: number, rid: number) => d<Retro>(api.get(`${P(pid)}/retros/${rid}`)),
  retroUpdate: (pid: number, rid: number, body: { title?: string; anonymous?: boolean; votesPerPerson?: number; lockAt?: string | null; locked?: boolean; sprintId?: number | null }) => d<{ ok: true }>(api.patch(`${P(pid)}/retros/${rid}`, body)),
  retroDelete: (pid: number, rid: number) => d<{ ok: true }>(api.delete(`${P(pid)}/retros/${rid}`)),
  cardAdd: (pid: number, rid: number, body: { column: string; body: string }) => d<{ id: number }>(api.post(`${P(pid)}/retros/${rid}/cards`, body)),
  cardUpdate: (pid: number, rid: number, cid: number, body: { body?: string; column?: string; groupId?: number | null }) => d<{ ok: true }>(api.patch(`${P(pid)}/retros/${rid}/cards/${cid}`, body)),
  cardDelete: (pid: number, rid: number, cid: number) => d<{ ok: true }>(api.delete(`${P(pid)}/retros/${rid}/cards/${cid}`)),
  cardVote: (pid: number, rid: number, cid: number, delta: 1 | -1) => d<{ votesLeft: number; mine: number }>(api.post(`${P(pid)}/retros/${rid}/cards/${cid}/vote`, { delta })),
  actionAdd: (pid: number, rid: number, body: { title: string; cardId?: number | null; assigneeId?: number | null; createIssue?: boolean }) => d<{ id: number; issueNumber: number | null }>(api.post(`${P(pid)}/retros/${rid}/actions`, body)),
  actionDelete: (pid: number, rid: number, aid: number) => d<{ ok: true }>(api.delete(`${P(pid)}/retros/${rid}/actions/${aid}`)),
  retroSummary: (pid: number, rid: number, language: 'en' | 'vi') => d<{ summary: string; actions: Array<{ type: string; title?: string; assignee?: string }> }>(api.post(`${P(pid)}/retros/${rid}/summary`, { language })),
  retroExport: (pid: number, rid: number) => download(`${P(pid)}/retros/${rid}/export.docx`, 'retro.docx'),
  // Timer
  myTimer: () => d<{ timer: RunningTimer | null }>(api.get(`${B}/me/timer`)),
  timerStart: (pid: number, num: number, body: { activity?: string | null; switch?: boolean } = {}) => d<{ timer: RunningTimer; switched: { minutes: number; issueKey: string } | null }>(api.post(`${P(pid)}/issues/${num}/timer`, body)),
  timerPause: () => d<{ timer: RunningTimer | null }>(api.post(`${B}/me/timer/pause`)),
  timerResume: () => d<{ timer: RunningTimer | null }>(api.post(`${B}/me/timer/resume`)),
  timerStop: (body: { activity?: string | null; note?: string | null; minutes?: number } = {}) => d<{ minutes: number; capped: boolean; issueKey: string; worklog: { id: number } | null }>(api.post(`${B}/me/timer/stop`, body)),
  timerDiscard: () => d<{ discarded: true }>(api.post(`${B}/me/timer/discard`)),
  timerPatch: (body: { activity?: string | null; note?: string | null }) => d<{ timer: RunningTimer | null }>(api.patch(`${B}/me/timer`, body)),
};
