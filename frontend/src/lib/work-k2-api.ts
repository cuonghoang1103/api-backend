/**
 * CT Work K-2 — họp: agenda có cấu trúc, RSVP, điểm danh, ghi âm có đồng ý, phiên âm, biên bản AI.
 * Backend: src/routes/work.ctwk2.routes.ts + services/work/meetingRec.service.ts (+ meetingRules.ts). Kiểu khớp service.
 * Khoá query nằm dưới ['work','gov',pid,…] ⇒ sự kiện socket `governance.updated` làm tươi luôn.
 */
import { api } from './api';
import type { WorkUser } from './work-api';

const B = '/work';
type Env<T> = { data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type Rsvp = 'YES' | 'NO' | 'MAYBE';
export type Attendance = 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT';
export type ChunkStatus = 'PENDING' | 'DONE' | 'NO_SPEECH' | 'NO_KEY' | 'LIMIT' | 'FAILED';

export interface AgendaItem {
  id: string; title: string; presenterId: number | null; minutes: number | null; ref: string | null;
  refInfo?: { kind: 'issue' | 'page' | 'url' | 'text'; number?: number; url?: string } | null;
}
export interface RoomAttendee {
  userId: number; invited: boolean; rsvp: Rsvp | null; rsvpNote: string | null; rsvpAt: string | null;
  attendance: Attendance | null; attendanceSource: 'AUTO' | 'MANUAL' | null; joinedAt: string | null; leftAt: string | null; present: boolean;
  user: WorkUser;
}
export interface Progress { total: number; done: number; pending: number; failed: number; noKey: number; limit: number; percent: number }
export interface RoomRecording {
  id: number; source: 'LIVE' | 'UPLOAD'; status: 'CONSENT' | 'RECORDING' | 'ENDED' | 'STOPPED'; fileName: string | null;
  startedById: number | null; startedAt: string | null; endedAt: string | null; durationMs: number; expiresAt: string | null; audioDeleted: boolean; createdAt: string;
  consents: Array<{ userId: number; decision: 'AGREED' | 'DECLINED'; at: string }>;
  consent: { waiting: number[]; declined: number[]; agreed: number[]; canBegin: boolean };
  progress: Progress;
  chunks: Array<{ seq: number; status: ChunkStatus; startMs: number; durationMs: number; hasAudio: boolean; error: string | null; attempts: number }>;
  mine: boolean;
}
export interface Evidence { lineId: string; n: number; at: string; quote: string; speakerId: number | null }
export interface ProposedItem { text: string; evidence: Evidence[]; unsupported: boolean }
export interface ProposedAction extends ProposedItem { ownerId: number | null; ownerName: string | null; due: string | null }
export interface MinutesContent {
  summary: string; decisions: ProposedItem[]; actions: ProposedAction[]; openIssues: ProposedItem[];
  unsupportedCount: number; lineCount: number; truncated: boolean;
}
export interface MinutesDraft {
  id: number; status: 'PROPOSED' | 'APPLIED' | 'DISMISSED'; language: 'vi' | 'en'; content: MinutesContent | null; model: string | null;
  createdById: number | null; createdAt: string; decidedAt: string | null; decidedById: number | null;
}
export interface MeetingSettings {
  audioRetentionDays: number; sttDailyLimit: number | null; effectiveSttDailyLimit: number; reminderMinutes: number; remindInChat: boolean;
  canManage?: boolean; sttConfigured?: boolean;
}
export interface Room {
  number: number;
  meId: number;
  agenda: AgendaItem[]; agendaMinutes: number;
  recordingUrl: string | null;
  attendees: RoomAttendee[];
  tracked: boolean;
  me: { rsvp: Rsvp | null; rsvpNote: string | null; attendance: Attendance | null; joinedAt: string | null; leftAt: string | null; invited: boolean; present: boolean } | null;
  recordings: RoomRecording[];
  drafts: MinutesDraft[];
  settings: MeetingSettings;
  sttConfigured: boolean;
  can: { edit: boolean; chair: boolean; record: boolean; ai: boolean; manageSettings: boolean };
}
export interface TranscriptLine { id: string; n: number; startMs: number; endMs: number; text: string; speakerId: number | null; seq: number; at: string }
export interface Transcript {
  recordings: Array<{ id: number; source: 'LIVE' | 'UPLOAD'; fileName: string | null; startedAt: string | null; lines: TranscriptLine[]; progress: Progress }>;
  speakers: WorkUser[];
}
export interface AttendanceReport {
  from: string; to: string;
  meetings: Array<{ number: number; title: string; status: string; startsAt: string; tracked: boolean; cells: Record<string, Attendance | null> }>;
  people: Array<{ userId: number; user: WorkUser | null; invited: number; tracked: number; present: number; late: number; excused: number; absent: number; unmarked: number; rsvpYes: number; rsvpNo: number; rsvpMaybe: number; rate: number | null }>;
}

export const k2Keys = {
  room: (pid: number, num: number) => ['work', 'gov', pid, 'k2', 'room', num] as const,
  transcript: (pid: number, num: number) => ['work', 'gov', pid, 'k2', 'transcript', num] as const,
  attendance: (pid: number, from: string, to: string) => ['work', 'gov', pid, 'k2', 'attendance', from, to] as const,
  settings: (pid: number) => ['work', 'gov', pid, 'k2', 'settings'] as const,
};

const M = (pid: number, num: number) => `${B}/projects/${pid}/meetings/${num}`;

export const k2Api = {
  room: (pid: number, num: number) => d<Room>(api.get(`${M(pid, num)}/room`)),
  setAgenda: (pid: number, num: number, items: Array<Omit<AgendaItem, 'refInfo' | 'id'> & { id?: string }>) => d<Room>(api.put(`${M(pid, num)}/agenda-items`, { items })),
  setRecordingLink: (pid: number, num: number, url: string | null) => d<Room>(api.put(`${M(pid, num)}/recording-link`, { url })),
  rsvp: (pid: number, num: number, rsvp: Rsvp, note?: string | null) => d<Room>(api.post(`${M(pid, num)}/rsvp`, { rsvp, note: note || null })),
  join: (pid: number, num: number) => d<{ url: string | null; attendance: Attendance; room: Room }>(api.post(`${M(pid, num)}/join`, {})),
  leave: (pid: number, num: number) => d<Room>(api.post(`${M(pid, num)}/leave`, {})),
  mark: (pid: number, num: number, items: Array<{ userId: number; attendance: Attendance | null }>) => d<Room>(api.put(`${M(pid, num)}/attendance`, { items })),
  startRecording: (pid: number, num: number, body: { source: 'LIVE' | 'UPLOAD'; fileName?: string | null; confirmConsent?: boolean }) =>
    d<{ recordingId: number; room: Room }>(api.post(`${M(pid, num)}/recordings`, body)),
  consent: (pid: number, num: number, rid: number, agree: boolean) => d<Room>(api.post(`${M(pid, num)}/recordings/${rid}/consent`, { agree })),
  begin: (pid: number, num: number, rid: number) => d<Room>(api.post(`${M(pid, num)}/recordings/${rid}/begin`, {})),
  end: (pid: number, num: number, rid: number) => d<Room>(api.post(`${M(pid, num)}/recordings/${rid}/end`, {})),
  retry: (pid: number, num: number, rid: number) => d<{ queued: number }>(api.post(`${M(pid, num)}/recordings/${rid}/retry`, {})),
  deleteAudio: (pid: number, num: number, rid: number) => d<Room>(api.delete(`${M(pid, num)}/recordings/${rid}/audio`)),
  uploadChunk: (pid: number, num: number, rid: number, blob: Blob, meta: { seq: number; startMs: number; durationMs: number; speakerId?: number | null; fileName: string }) => {
    const form = new FormData();
    form.append('audio', blob, meta.fileName);
    form.append('seq', String(meta.seq));
    form.append('startMs', String(Math.round(meta.startMs)));
    form.append('durationMs', String(Math.round(meta.durationMs)));
    if (meta.speakerId) form.append('speakerId', String(meta.speakerId));
    // Cùng cách gửi voice note K-1 (work-comments-api.ts) — axios tự gắn boundary cho FormData.
    return d<{ seq: number; status: ChunkStatus; duplicate: boolean }>(api.post(`${M(pid, num)}/recordings/${rid}/chunks`, form, { timeout: 120_000 }));
  },
  chunkAudio: (pid: number, num: number, rid: number, seq: number) => d<{ url: string; mime: string }>(api.get(`${M(pid, num)}/recordings/${rid}/chunks/${seq}/audio`)),
  transcript: (pid: number, num: number) => d<Transcript>(api.get(`${M(pid, num)}/transcript`)),
  assignSpeakers: (pid: number, num: number, rid: number, items: Array<{ lineId: string; speakerId: number | null }>) => d<Transcript>(api.put(`${M(pid, num)}/recordings/${rid}/speakers`, { items })),
  propose: (pid: number, num: number, language: 'vi' | 'en') => d<{ draftId: number; content: MinutesContent; model: string | null }>(api.post(`${M(pid, num)}/minutes-ai`, { language }, { timeout: 180_000 })),
  apply: (pid: number, num: number, did: number, body: { skipDecisions?: number[]; skipActions?: number[]; createIssues?: boolean }) =>
    d<{ applied: true; created: Array<{ key: string; title: string }>; room: Room }>(api.post(`${M(pid, num)}/minutes-ai/${did}/apply`, body)),
  dismiss: (pid: number, num: number, did: number) => d<Room>(api.post(`${M(pid, num)}/minutes-ai/${did}/dismiss`, {})),
  exportMinutes: async (pid: number, num: number, format: 'docx' | 'pdf', lang: 'vi' | 'en') => {
    const r = await api.get(`${M(pid, num)}/minutes-export`, { params: { format, lang }, responseType: 'blob' });
    const blob = r.data as Blob;
    const cd = String(r.headers['content-disposition'] ?? '');
    const name = decodeURIComponent(/filename\*=UTF-8''([^;]+)/.exec(cd)?.[1] ?? `meeting-${num}.${format}`);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },
  attendance: (pid: number, from: string, to: string) => d<AttendanceReport>(api.get(`${B}/projects/${pid}/meetings-attendance`, { params: { from, to } })),
  settings: (pid: number) => d<MeetingSettings>(api.get(`${B}/projects/${pid}/meeting-settings`)),
  saveSettings: (pid: number, body: Partial<Pick<MeetingSettings, 'audioRetentionDays' | 'sttDailyLimit' | 'reminderMinutes' | 'remindInChat'>>) =>
    d<MeetingSettings>(api.put(`${B}/projects/${pid}/meeting-settings`, body)),
};
