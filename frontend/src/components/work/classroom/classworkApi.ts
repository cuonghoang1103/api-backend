/**
 * CTW đợt 9b — client cho Bài tập lớp (giao / nộp / chấm / trả) + Sổ điểm.
 * Backend: src/routes/work.ctw9b.routes.ts (+ classwork / classGradebook.service.ts) — đổi kiểu bên này thì đổi bên kia.
 */

import { api } from '@/lib/api';
import type { TiptapDoc, WorkUser } from '@/lib/work-api';
import type { RubricCriterion } from '@/components/work/teaching/teachingApi';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);

export type AssignmentKind = 'INDIVIDUAL' | 'GROUP';
export type PublishState = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
export type WorkState = 'RETURNED' | 'TURNED_IN' | 'LATE' | 'MISSING' | 'ASSIGNED';

export interface ClassFile { id: number; fileName: string; mime: string; size: number; uploaderId: number; createdAt: string }
export interface SubmissionLink { url: string; label: string }
export interface StudentGrade { points: number | null; rawPoints: number | null; penaltyPct: number | null; scores: Record<string, number> | null; returnedAt: string | null }

export interface AssignmentBase {
  id: number; classId: number; authorId: number | null; title: string; description: TiptapDoc | null; descriptionText: string | null;
  kind: AssignmentKind; category: string; topic: string | null; maxPoints: number; rubricId: number | null; dueAt: string | null;
  publishAt: string | null; announcedAt: string | null; allowLate: boolean; latePenaltyPct: number; latePenaltyMaxPct: number;
  targetAll: boolean; targetGroupIds: number[]; targetStudentIds: number[]; createdAt: string; updatedAt: string; state: PublishState;
}
export interface AssignmentListItem extends Omit<AssignmentBase, 'description'> {
  description?: TiptapDoc | null;
  files: number;
  counts?: { assigned: number; turnedIn: number; late: number; missing: number; returned: number; graded: number };
  my?: { state: WorkState; late: boolean; submittedAt: string | null; grade: StudentGrade | null };
}
export interface AssignmentList { manage: boolean; assignments: AssignmentListItem[] }

export interface SubmissionVersion { id: number; version: number; action: 'TURN_IN' | 'UNSUBMIT'; text: string | null; links: SubmissionLink[]; late: boolean; createdAt: string; actor: WorkUser | null; files: ClassFile[] }
export interface PrivateComment { id: number; body: string; createdAt: string; author: WorkUser | null; mine: boolean }
export interface MySubmission {
  needsGroup: boolean; canTurnIn?: boolean; lateIfNow?: boolean; penaltyIfNow?: number;
  id?: number | null; state?: WorkState; status?: string; text?: string | null; links?: SubmissionLink[]; files?: ClassFile[];
  late?: boolean; submittedAt?: string | null; version?: number; versions?: SubmissionVersion[]; comments?: PrivateComment[]; grade?: StudentGrade | null;
}
export interface AssignmentDetail extends AssignmentBase {
  manage: boolean;
  files: ClassFile[];
  rubric: { id: number; name: string; criteria: RubricCriterion[]; scaleMax: number } | null;
  author: WorkUser | null;
  groups?: Array<{ id: number; number: number; name: string }>;
  students?: Array<{ id: number; fullName: string | null; studentCode: string | null; groupId: number | null; userId: number | null }>;
  submission?: MySubmission;
}

export interface AssignmentInput {
  title?: string; description?: TiptapDoc | null; kind?: AssignmentKind; category?: string; topic?: string | null; maxPoints?: number;
  rubricId?: number | null; dueAt?: string | null; publish?: 'NOW' | 'SCHEDULE' | 'DRAFT'; publishAt?: string | null;
  allowLate?: boolean; latePenaltyPct?: number; latePenaltyMaxPct?: number; targetAll?: boolean; targetGroupIds?: number[]; targetStudentIds?: number[];
}

export interface SubmissionRow {
  ownerKey: string; submissionId: number | null; group: { id: number; number: number; name: string } | null;
  members: Array<{ userId: number; seatId: number; studentCode: string | null; name: string; draftPoints: number | null; returnedPoints: number | null; memberPoints: number | null }>;
  state: WorkState; status: string; late: boolean; submittedAt: string | null; version: number; points: number | null; penaltyPct: number;
  returnedAt: string | null; returnedPoints: number | null; graded: boolean; regradedSinceReturn: boolean; comments: number; files: number;
}
export interface SubmissionList { assignment: { id: number; title: string; kind: AssignmentKind; maxPoints: number; dueAt: string | null; rubricId: number | null }; rows: SubmissionRow[] }

export interface SubmissionDetail {
  ownerKey: string;
  assignment: { id: number; title: string; kind: AssignmentKind; maxPoints: number; dueAt: string | null; latePenaltyPct: number; latePenaltyMaxPct: number };
  rubric: { id: number; name: string; criteria: RubricCriterion[]; scaleMax: number } | null;
  members: Array<{ userId: number; studentCode: string | null; name: string; user: WorkUser | null }>;
  submission: null | {
    id: number; status: string; text: string | null; links: SubmissionLink[]; submittedAt: string | null; late: boolean; version: number;
    points: number | null; scores: Record<string, number>; memberPoints: Record<string, number>; penaltyPct: number;
    returnedAt: string | null; returnedPoints: number | null; files: ClassFile[];
  };
  state: WorkState;
  versions: SubmissionVersion[];
  comments: PrivateComment[];
}

export interface GradeInput { ownerKey: string; points?: number | null; scores?: Record<string, number | null>; memberPoints?: Record<string, number | null>; penaltyPct?: number }

export type GradebookMode = 'POINTS' | 'CATEGORY' | 'TOPIC';
export type CellState = 'RETURNED' | 'GRADED' | 'TURNED_IN' | 'LATE' | 'MISSING' | 'ASSIGNED' | 'NOT_ASSIGNED';
export interface GradebookItem { key: string; kind: string; refId: number; title: string; category: string; topic: string | null; maxPoints: number; dueAt: string | null; importable: boolean; link?: Record<string, string> }
export interface GradebookCell { itemKey: string; userId: number; points: number | null; released: boolean; state: CellState; late?: boolean }
export interface GradebookRow { userId: number; seatId: number; name: string; studentCode: string | null; group: { id: number; number: number; name: string } | null; cells: Record<string, GradebookCell>; total: number | null; byGroup: Record<string, number | null> }
export interface Gradebook {
  manage: boolean; settings: { mode: GradebookMode; weights: Record<string, number>; missingAsZero: boolean };
  groupsForWeights: string[]; categories: string[]; topics: string[]; items: GradebookItem[]; rows: GradebookRow[]; classAverage: number | null;
}
export interface GradeImportPreview {
  columns: Array<{ col: number; header: string; itemKey: string | null; reason?: 'NO_MATCH' | 'NOT_IMPORTABLE' }>;
  rows: Array<{ line: number; userId: number | null; who: string; values: Array<{ itemKey: string; points: number | null }>; errors: string[] }>;
  valid: number; invalid: number; cells: number; written?: number;
}
export interface Deadline { kind: 'ASSIGNMENT'; refId: number; title: string; at: string; topic: string | null; link: Record<string, string> }

export const classworkKeys = {
  list: (classId: number) => ['work', 'class', classId, 'assignments'] as const,
  one: (classId: number, aid: number) => ['work', 'class', classId, 'assignment', aid] as const,
  subs: (classId: number, aid: number) => ['work', 'class', classId, 'assignment', aid, 'subs'] as const,
  sub: (classId: number, aid: number, owner: string) => ['work', 'class', classId, 'assignment', aid, 'sub', owner] as const,
  gradebook: (classId: number) => ['work', 'class', classId, 'gradebook'] as const,
};

const base = (classId: number) => `/work/classes/${classId}`;
const upload = <T,>(url: string, file: File) => {
  const fd = new FormData();
  fd.append('file', file, file.name);
  // Không đặt Content-Type: interceptor ở lib/api.ts gỡ nó để trình duyệt tự sinh boundary.
  return d<T>(api.post(url, fd));
};

export const classworkApi = {
  list: (classId: number) => d<AssignmentList>(api.get(`${base(classId)}/assignments`)),
  get: (classId: number, aid: number) => d<AssignmentDetail>(api.get(`${base(classId)}/assignments/${aid}`)),
  create: (classId: number, b: AssignmentInput) => d<AssignmentDetail>(api.post(`${base(classId)}/assignments`, b)),
  update: (classId: number, aid: number, b: AssignmentInput) => d<AssignmentDetail>(api.patch(`${base(classId)}/assignments/${aid}`, b)),
  remove: (classId: number, aid: number) => d<{ deleted: boolean }>(api.delete(`${base(classId)}/assignments/${aid}`)),
  uploadAssignmentFile: (classId: number, aid: number, file: File) => upload<ClassFile>(`${base(classId)}/assignments/${aid}/files`, file),
  removeAssignmentFile: (classId: number, aid: number, fid: number) => d<{ deleted: boolean }>(api.delete(`${base(classId)}/assignments/${aid}/files/${fid}`)),
  fileUrl: (classId: number, fid: number) => d<{ url: string; fileName: string }>(api.get(`${base(classId)}/files/${fid}`)),

  saveDraft: (classId: number, aid: number, b: { text?: string | null; links?: Array<string | SubmissionLink> }) => d<AssignmentDetail>(api.put(`${base(classId)}/assignments/${aid}/my`, b)),
  uploadMyFile: (classId: number, aid: number, file: File) => upload<ClassFile>(`${base(classId)}/assignments/${aid}/my/files`, file),
  removeMyFile: (classId: number, aid: number, fid: number) => d<{ deleted: boolean }>(api.delete(`${base(classId)}/assignments/${aid}/my/files/${fid}`)),
  turnIn: (classId: number, aid: number) => d<AssignmentDetail>(api.post(`${base(classId)}/assignments/${aid}/my/turn-in`)),
  unsubmit: (classId: number, aid: number) => d<AssignmentDetail>(api.post(`${base(classId)}/assignments/${aid}/my/unsubmit`)),

  submissions: (classId: number, aid: number) => d<SubmissionList>(api.get(`${base(classId)}/assignments/${aid}/submissions`)),
  submission: (classId: number, aid: number, owner: string) => d<SubmissionDetail>(api.get(`${base(classId)}/assignments/${aid}/submissions/${owner}`)),
  grade: (classId: number, aid: number, b: GradeInput) => d<SubmissionDetail>(api.put(`${base(classId)}/assignments/${aid}/grade`, b)),
  returnWork: (classId: number, aid: number, ownerKeys: string[]) => d<{ returned: number }>(api.post(`${base(classId)}/assignments/${aid}/return`, { ownerKeys })),
  comment: (classId: number, b: { submissionId?: number; assignmentId?: number; body: string }) => d<{ id: number }>(api.post(`${base(classId)}/submission-comments`, b)),

  gradebook: (classId: number) => d<Gradebook>(api.get(`${base(classId)}/gradebook`)),
  gradebookSettings: (classId: number, b: { mode?: GradebookMode; weights?: Record<string, number>; missingAsZero?: boolean }) => d<Gradebook>(api.put(`${base(classId)}/gradebook/settings`, b)),
  exportGradebook: async (classId: number) => (await api.get(`${base(classId)}/gradebook.xlsx`, { responseType: 'blob' })).data as Blob,
  importPreview: (classId: number, b: { xlsxBase64?: string; csv?: string }) => d<GradeImportPreview>(api.post(`${base(classId)}/gradebook/import/preview`, b)),
  importGrades: (classId: number, b: { xlsxBase64?: string; csv?: string; confirm: true }) => d<GradeImportPreview>(api.post(`${base(classId)}/gradebook/import`, b)),
  deadlines: (classId: number) => d<Deadline[]>(api.get(`${base(classId)}/deadlines`)),
};

/** Tệp xlsx/csv ⇒ thân yêu cầu nhập điểm. */
export async function readGradeFile(file: File): Promise<{ xlsxBase64?: string; csv?: string }> {
  if (/\.csv$/i.test(file.name)) return { csv: await file.text() };
  const buf = new Uint8Array(await file.arrayBuffer());
  let s = '';
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { xlsxBase64: btoa(s) };
}

/** Datetime-local (giờ máy) ⇄ ISO. */
export const toLocalInput = (iso: string | null | undefined) => {
  if (!iso) return '';
  const dt = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}T${p(dt.getHours())}:${p(dt.getMinutes())}`;
};
export const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);
