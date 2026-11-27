/**
 * CT Work — dm5 G2 (27/11/2026): client cho hồ sơ SRS/SDS/Report 2-3-4-6-7 & truy vết. Backend: src/routes/work.dm5b.routes.ts
 * (+ autofill Report 2 ở work.docs3a.routes.ts). Kiểu khớp srsMessages.service / sds.service / dm5b.service / finalReport.
 */

import { api } from '@/lib/api';
import type { QuestionView } from '@/lib/work-ctw4-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

export type SmType = 'ERROR' | 'WARNING' | 'INFO' | 'CONFIRMATION' | 'SUCCESS';
export const SM_TYPES: SmType[] = ['ERROR', 'WARNING', 'INFO', 'CONFIRMATION', 'SUCCESS'];
export interface SystemMessage {
  id: number; number: number; key: string; msgType: SmType; context: string | null; text: string; textEn: string | null; httpStatus: number | null;
  status: 'PROPOSED' | 'DRAFT' | 'APPROVED'; aiModel: string | null; version: number; updatedAt: string;
  useCases: Array<{ id: number; key: string; name: string }>; mentionedIn: string[];
}
export interface SystemMessageInput { msgType?: SmType; context?: string | null; text?: string; textEn?: string | null; httpStatus?: number | null; useCases?: string[]; status?: 'DRAFT' | 'APPROVED'; version?: number }

export interface DbField { no: number; field: string; pk: boolean; fk: boolean; un: boolean; nn: boolean; description: string }
export interface DbTableDesign { name: string; comment: string | null; fields: DbField[]; constraints: string[] }
export interface DbDesign { source: { kind: 'DIAGRAM' | 'REPO'; label: string; diagram?: number; files?: string[]; problems: string[] }; tables: DbTableDesign[] }

export interface FinalCheck { code: string; severity: 'error' | 'warning'; report: number | null; message: string; items: string[] }
export interface SubmitItem { n: number; key: string; title: string; ok: boolean | null; details: string[] }
export interface SubmitCheck {
  items: SubmitItem[]; passed: number; failed: number; notApplicable: number; reports: number[];
  ucNames: Array<{ uc: string; name: string; issue: string | null; issueTitle: string | null; ok: boolean; problem: string | null }>;
}
export type RaciMode = 'people' | 'roles' | 'honest';
export type Report4Part = 'database' | 'diagrams' | 'classes';

export const workDm5bKeys = {
  messages: (pid: number) => ['work', 'dm5b', pid, 'messages'] as const,
  submit: (pid: number) => ['work', 'dm5b', pid, 'submit'] as const,
  finalChecks: (pid: number) => ['work', 'dm5b', pid, 'final-checks'] as const,
  dbDesign: (pid: number, diagram: number | null) => ['work', 'dm5b', pid, 'db-design', diagram] as const,
};

export const workDm5bApi = {
  // B9
  messages: (pid: number) => d<{ items: SystemMessage[]; unknown: Array<{ key: string; mentionedIn: string[] }>; types: SmType[]; canEdit: boolean; canApprove: boolean }>(api.get(`${B}/${pid}/srs/messages`)),
  createMessage: (pid: number, body: SystemMessageInput & { text: string }) => d<SystemMessage>(api.post(`${B}/${pid}/srs/messages`, body)),
  updateMessage: (pid: number, ref: string, body: SystemMessageInput) => d<SystemMessage>(api.patch(`${B}/${pid}/srs/messages/${encodeURIComponent(ref)}`, body)),
  deleteMessage: (pid: number, ref: string) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/srs/messages/${encodeURIComponent(ref)}`)),
  // B16/B17
  dbDesign: (pid: number, q: { diagram?: number | null; fromRepo?: boolean }) => d<DbDesign>(api.get(`${B}/${pid}/sds/db-design`, { params: { ...(q.diagram ? { diagram: q.diagram } : {}), ...(q.fromRepo ? { fromRepo: 'true' } : {}) } })),
  fillDbDesign: (pid: number, body: { diagram?: number | null; fromRepo?: boolean; page?: number | null; version?: number }) => d<{ page: { number: number; title: string; version: number | null }; tables: number; source: DbDesign['source'] }>(api.post(`${B}/${pid}/sds/db-design/fill`, body)),
  fillReport4: (pid: number, body: { parts?: Report4Part[]; diagram?: number | null; fromRepo?: boolean; page?: number | null; version?: number }) => d<{ filled: string[]; skipped: Array<{ part: Report4Part; reason: string }>; page: { number: number; title: string; version: number | null } }>(api.post(`${B}/${pid}/sds/report4/fill`, body)),
  // B20 · B19 · B14
  fillReport6: (pid: number, body: { page?: number | null; version?: number } = {}) => d<{ added: string[]; kept: string[]; warnings: Array<{ heading: string; suggestion: string | null }>; changed: boolean; page: { number: number; title: string; version: number | null } }>(api.post(`${B}/${pid}/report6/fill`, body)),
  finalChecks: (pid: number) => d<{ checks: FinalCheck[]; errors: number; warnings: number; reports: number[] }>(api.get(`${B}/${pid}/final-report/checks`)),
  submitCheck: (pid: number) => d<SubmitCheck>(api.get(`${B}/${pid}/submit-check`)),
  // B15
  supersedeAdr: (pid: number, num: number, by: number) => d<{ superseded: string; by: string }>(api.post(`${B}/${pid}/pages/${num}/adr/supersede`, { by })),
  // B5 · B2
  questionToQna: (pid: number, session: number, qid: string, body: { targetRef?: string | null; askedTo?: string | null; due?: string | null } = {}) => d<{ question: QuestionView; created: boolean }>(api.post(`${B}/${pid}/swr/elicitation/${session}/questions/${qid}/qna`, body)),
  seedHats: (pid: number) => d<{ added: number; owner: number | null }>(api.post(`${B}/${pid}/swr/stakeholders/seed-hats`, {})),
  // B18 PlantUML: SVG do máy render tự host vẽ (chuỗi SVG đã làm sạch).
  renderPlantUml: (pid: number, source: string) => api.post<string>(`${B}/${pid}/diagrams/plantuml/render`, { source }, { responseType: 'text' }).then((r) => String(r.data)),
  importFromRepo: (pid: number, path: string) => d<unknown>(api.post(`${B}/${pid}/diagrams/import-repo`, { path })),
  raciPreset: (pid: number, preset: 'requirements' | 'report2') => d<{ added: number }>(api.post(`${B}/${pid}/swr/raci/activities/preset`, { preset })),
};
