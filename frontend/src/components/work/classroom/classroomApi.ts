/**
 * CTW đợt 9a — client cho Stream, tài liệu lớp, lịch lớp + điểm danh. Backend: src/routes/work.ctw9a.routes.ts
 * (+ classStream / classMaterials / classCalendar.service.ts) — đổi kiểu bên này thì đổi bên kia.
 */

import { api } from '@/lib/api';
import type { TiptapDoc, WorkUser } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = (id: number) => `/work/classes/${id}`;

export interface LinkCard { url: string; title: string; kind: string; faviconUrl: string | null }
export interface ClassFile { id: number; fileName: string; mime: string; size: number; createdAt: string }
export interface StreamComment { id: number; postId: number; body: string; hidden: boolean; hiddenAt: string | null; createdAt: string; author: WorkUser; mine: boolean; canDelete: boolean }
export type PostKind = 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'QUIZ' | 'MATERIAL';
export interface StreamPost {
  id: number; kind: PostKind; title: string | null; bodyJson: TiptapDoc | null; links: LinkCard[]; refType: string | null; refId: number | null; url: string | null;
  author: WorkUser | null; files: ClassFile[]; pinned: boolean; commentsOff: boolean;
  publishAt: string; publishedAt: string | null; scheduled: boolean; editedAt: string | null; createdAt: string;
  audienceGroupIds?: number[]; forGroup: boolean; canComment: boolean;
  comments: StreamComment[]; commentCount: number;
}
export interface StreamPage {
  posts: StreamPost[]; nextBefore: string | null; manage: boolean; settings: { streamComments: boolean };
  groups: Array<{ id: number; name: string }>; myGroupId: number | null;
}
export interface PostInput {
  bodyJson?: TiptapDoc | null; title?: string | null; links?: Array<{ url: string; title?: string }>; fileIds?: number[]; removeFileIds?: number[];
  audienceGroupIds?: number[]; publishAt?: string | null; pinned?: boolean; commentsOff?: boolean;
}
export interface ClassroomSettings { streamComments: boolean; absenceThreshold: number; lateAfterMin: number; manage: boolean }

export type MaterialKind = 'SLIDE' | 'SYLLABUS' | 'FILE' | 'LINK' | 'VIDEO';
export const MATERIAL_KINDS: MaterialKind[] = ['SLIDE', 'SYLLABUS', 'FILE', 'LINK', 'VIDEO'];
export interface Topic { id: number; title: string; week: number | null; position: number }
export interface Material {
  id: number; topicId: number | null; kind: MaterialKind; title: string; description: string | null; links: LinkCard[]; position: number; draft: boolean;
  createdAt: string; updatedAt: string; author: WorkUser | null; files: ClassFile[]; viewed: boolean; views?: number; viewRate?: number | null;
}
export interface MaterialsView { manage: boolean; students: number; topics: Topic[]; materials: Material[] }
export interface MaterialInput { topicId?: number | null; kind?: MaterialKind; title?: string; description?: string | null; links?: Array<{ url: string; title?: string }>; fileIds?: number[]; removeFileIds?: number[]; draft?: boolean }
export interface Viewers { rows: Array<{ studentId: number; studentCode: string | null; fullName: string | null; user: WorkUser | null; viewedAt: string | null }>; viewed: number; total: number; rate: number | null }

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EXCUSED' | 'ABSENT';
export const ATTENDANCE_STATUSES: AttendanceStatus[] = ['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'];
export interface Recurrence { freq: 'DAILY' | 'WEEKLY' | 'MONTHLY'; interval?: number; byWeekday?: number[]; byMonthDay?: number | null; hour: number; minute: number; startDate: string; endDate?: string | null }
export interface CalSession {
  id: number; seriesId: number | null; title: string; startsAt: string; endsAt: string; location: string | null; meetingUrl: string | null; status: 'SCHEDULED' | 'CANCELLED';
  checkinOpen: boolean; marked?: number; tracked?: boolean; myStatus?: AttendanceStatus | null;
}
export interface CalItem { id: number; kind: 'DUE' | 'EVENT' | string; refType: string; refId: number; title: string; startsAt: string; endsAt: string | null; url: string | null }
export interface CalSeries { id: number; title: string; rrule: string; recurrence: Recurrence; durationMin: number; location: string | null; meetingUrl: string | null; sessions: number }
export interface CalendarView {
  manage: boolean; timezone: string; students: number; isStudent: boolean; settings: { absenceThreshold: number; lateAfterMin: number };
  sessions: CalSession[]; items: CalItem[]; series: CalSeries[];
}
export interface CheckinOpen { sessionId: number; code: string; expiresAt: string; url: string; minutes: number }
export interface SheetRow { studentId: number; studentCode: string | null; fullName: string | null; email: string | null; groupId: number | null; user: WorkUser | null; status: AttendanceStatus | null; source: string | null; checkedInAt: string | null; note: string | null }
export interface SessionSheet {
  session: { id: number; title: string; startsAt: string; endsAt: string; status: string; location: string | null };
  checkin: { code: string; expiresAt: string; url: string } | null; groups: Array<{ id: number; name: string }>; rows: SheetRow[]; counts: Record<AttendanceStatus, number>;
}
export interface StudentStat {
  id: number; studentId: number; studentCode: string | null; fullName: string | null; email: string | null; groupId: number | null; user: WorkUser | null;
  present: number; late: number; excused: number; absent: number; unmarked: number; held: number; absentPct: number | null; over: boolean;
}
export interface AttendanceStats { threshold: number; lateAfterMin: number; sessions: Array<{ id: number; title: string; startsAt: string }>; students: StudentStat[]; flagged: number }
export interface MyAttendance {
  threshold: number;
  summary: { present: number; late: number; excused: number; absent: number; held: number; absentPct: number | null; over: boolean } | null;
  sessions: Array<{ id: number; title: string; startsAt: string; status: AttendanceStatus; checkedInAt: string | null }>;
}

export const classroomKeys = {
  stream: (id: number) => ['work', 'classes', id, 'stream'] as const,
  post: (id: number, pid: number) => ['work', 'classes', id, 'stream', pid] as const,
  settings: (id: number) => ['work', 'classes', id, 'classroom-settings'] as const,
  materials: (id: number) => ['work', 'classes', id, 'materials'] as const,
  viewers: (id: number, mid: number) => ['work', 'classes', id, 'materials', mid, 'viewers'] as const,
  calendar: (id: number) => ['work', 'classes', id, 'calendar'] as const,
  sheet: (id: number, sid: number) => ['work', 'classes', id, 'sheet', sid] as const,
  stats: (id: number) => ['work', 'classes', id, 'attendance'] as const,
  mine: (id: number) => ['work', 'classes', id, 'attendance', 'me'] as const,
};

export const classroomApi = {
  settings: (id: number) => d<ClassroomSettings>(api.get(`${B(id)}/classroom-settings`)),
  updateSettings: (id: number, b: Partial<Omit<ClassroomSettings, 'manage'>>) => d<ClassroomSettings>(api.patch(`${B(id)}/classroom-settings`, b)),

  stream: (id: number, before?: string | null) => d<StreamPage>(api.get(`${B(id)}/stream${before ? `?before=${encodeURIComponent(before)}` : ''}`)),
  post: (id: number, pid: number) => d<StreamPost>(api.get(`${B(id)}/stream/${pid}`)),
  createPost: (id: number, b: PostInput) => d<StreamPost>(api.post(`${B(id)}/stream`, b)),
  updatePost: (id: number, pid: number, b: PostInput) => d<StreamPost>(api.patch(`${B(id)}/stream/${pid}`, b)),
  deletePost: (id: number, pid: number) => d<{ deleted: boolean }>(api.delete(`${B(id)}/stream/${pid}`)),
  comment: (id: number, pid: number, body: string) => d<StreamComment>(api.post(`${B(id)}/stream/${pid}/comments`, { body })),
  hideComment: (id: number, cid: number, hidden: boolean) => d<{ hidden: boolean }>(api.patch(`${B(id)}/stream-comments/${cid}`, { hidden })),
  deleteComment: (id: number, cid: number) => d<{ deleted: boolean }>(api.delete(`${B(id)}/stream-comments/${cid}`)),

  uploadFile: (id: number, file: File) => {
    if (file.size > 25 * 1024 * 1024) return Promise.reject(new Error(`${file.name} is larger than 25 MB`));
    const form = new FormData();
    form.append('file', file, file.name);
    return d<ClassFile>(api.post(`${B(id)}/stream-files`, form, { timeout: 180_000 }));
  },
  discardFile: (id: number, fid: number) => d<{ deleted: boolean }>(api.delete(`${B(id)}/stream-files/${fid}`)),
  fileUrl: (id: number, fid: number, inline = false) => d<{ url: string }>(api.get(`${B(id)}/stream-files/${fid}/url${inline ? '?inline=1' : ''}`)).then((r) => r.url),

  materials: (id: number) => d<MaterialsView>(api.get(`${B(id)}/materials`)),
  createMaterial: (id: number, b: MaterialInput) => d<Material>(api.post(`${B(id)}/materials`, b)),
  updateMaterial: (id: number, mid: number, b: MaterialInput) => d<Material>(api.patch(`${B(id)}/materials/${mid}`, b)),
  deleteMaterial: (id: number, mid: number) => d<{ deleted: boolean }>(api.delete(`${B(id)}/materials/${mid}`)),
  markViewed: (id: number, mid: number) => d<{ viewed: boolean }>(api.post(`${B(id)}/materials/${mid}/view`)),
  viewers: (id: number, mid: number) => d<Viewers>(api.get(`${B(id)}/materials/${mid}/viewers`)),
  reorderMaterials: (id: number, topicId: number | null, ids: number[]) => d<{ ok: boolean }>(api.put(`${B(id)}/materials-order`, { topicId, ids })),
  createTopic: (id: number, b: { title?: string; week?: number | null }) => d<Topic>(api.post(`${B(id)}/topics`, b)),
  updateTopic: (id: number, tid: number, b: { title?: string; week?: number | null }) => d<Topic>(api.patch(`${B(id)}/topics/${tid}`, b)),
  deleteTopic: (id: number, tid: number) => d<{ deleted: boolean }>(api.delete(`${B(id)}/topics/${tid}`)),
  reorderTopics: (id: number, ids: number[]) => d<{ ok: boolean }>(api.put(`${B(id)}/topics-order`, { ids })),

  calendar: (id: number) => d<CalendarView>(api.get(`${B(id)}/calendar`)),
  icsBlob: (id: number) => api.get(`${B(id)}/calendar.ics`, { responseType: 'blob' }).then((r) => r.data as Blob),
  createSeries: (id: number, b: { title: string; recurrence: Recurrence; durationMin?: number; location?: string | null; meetingUrl?: string | null }) => d<{ id: number; sessions: number; rrule: string }>(api.post(`${B(id)}/schedules`, b)),
  deleteSeries: (id: number, sid: number) => d<{ removedSessions: number }>(api.delete(`${B(id)}/schedules/${sid}`)),
  createSession: (id: number, b: { title?: string; startsAt: string; durationMin?: number; location?: string | null; meetingUrl?: string | null }) => d<{ id: number }>(api.post(`${B(id)}/sessions`, b)),
  updateSession: (id: number, sid: number, b: { title?: string; startsAt?: string; durationMin?: number; location?: string | null; meetingUrl?: string | null; status?: 'SCHEDULED' | 'CANCELLED' }) => d<{ ok: boolean }>(api.patch(`${B(id)}/sessions/${sid}`, b)),
  deleteSession: (id: number, sid: number) => d<{ deleted: boolean }>(api.delete(`${B(id)}/sessions/${sid}`)),
  openCheckin: (id: number, sid: number, minutes?: number) => d<CheckinOpen>(api.post(`${B(id)}/sessions/${sid}/checkin`, minutes ? { minutes } : {})),
  closeCheckin: (id: number, sid: number) => d<{ closed: boolean }>(api.delete(`${B(id)}/sessions/${sid}/checkin`)),
  sheet: (id: number, sid: number) => d<SessionSheet>(api.get(`${B(id)}/sessions/${sid}/attendance`)),
  setAttendance: (id: number, sid: number, rows: Array<{ studentId: number; status: AttendanceStatus | null; note?: string | null }>) => d<{ updated: number }>(api.put(`${B(id)}/sessions/${sid}/attendance`, { rows })),
  checkin: (id: number, code: string) => d<{ sessionId: number; title: string; status: AttendanceStatus; checkedInAt: string }>(api.post(`${B(id)}/checkin`, { code })),
  stats: (id: number) => d<AttendanceStats>(api.get(`${B(id)}/attendance`)),
  mine: (id: number) => d<MyAttendance>(api.get(`${B(id)}/attendance/me`)),
  statsXlsx: (id: number) => api.get(`${B(id)}/attendance.xlsx`, { responseType: 'blob' }).then((r) => r.data as Blob),
};

/** Mở tệp lớp: xin URL ký sẵn lúc bấm (kiểm quyền mỗi lần). */
export async function openClassFile(classId: number, f: ClassFile) {
  const inline = /^(image\/|application\/pdf|video\/|audio\/)/.test(f.mime);
  // Mở cửa sổ TRƯỚC await (Safari chặn window.open sau await), rồi trỏ tới URL ký sẵn.
  const w = typeof window !== 'undefined' ? window.open('about:blank', '_blank') : null;
  try {
    const url = await classroomApi.fileUrl(classId, f.id, inline);
    if (w) { w.opener = null; w.location.href = url; } else window.location.assign(url);
  } catch (err) {
    w?.close();
    throw err;
  }
}
