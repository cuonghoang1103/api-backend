/**
 * CT Work — client cho CỔNG NỘP BÀI (trang Nộp bài + cấu hình cổng).
 * Backend: src/routes/work.routes.ts (/projects/:pid/submissions, /submissions/download)
 * + src/services/work/submitGate.ts. Cấu hình cổng đi qua PATCH /projects/:pid { settings: { submitGate } }.
 * Tách khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const P = (pid: number) => `/work/projects/${pid}`;

export interface SubmitGateConfig {
  enabled: boolean;
  mode: 'soft' | 'hard';
  minAttachments: number;
  typeKeys: string[] | null;
}

export interface SubmissionFile { id: number; fileName: string; mime: string; size: number }
export interface SubmissionItem {
  key: string; number: number; title: string; type: string; status: string;
  statusCategory: 'TODO' | 'IN_PROGRESS' | 'DONE';
  done: boolean; dueDate: string | null; resolvedAt: string | null;
  onTime: boolean | null; overdue: boolean;
  attachmentCount: number; submitted: boolean; attachments: SubmissionFile[];
}
export interface SubmissionMember {
  username: string | null; name: string; kind: string | null;
  total: number; submitted: number; doneCount: number;
  onTime: number; onTimeOf: number; overdue: number; files: number;
  items: SubmissionItem[];
}
export interface SubmissionsView {
  project: { key: string; name: string };
  gate: SubmitGateConfig;
  canConfig: boolean;
  totals: { members: number; issues: number; submitted: number; files: number; overdue: number };
  members: SubmissionMember[];
}

export const submitKeys = {
  all: (pid: number) => ['work', 'submit', pid] as const,
};

export const submitApi = {
  list: (pid: number) => d<SubmissionsView>(api.get(`${P(pid)}/submissions`)),
  setGate: (pid: number, gate: SubmitGateConfig) =>
    d<{ id: number }>(api.patch(`${P(pid)}`, { settings: { submitGate: gate } })),
  /** Tải tất cả deliverable (zip). Trả blob để tạo link tải. */
  async downloadAll(pid: number): Promise<void> {
    const res = await api.get(`${P(pid)}/submissions/download`, { responseType: 'blob' });
    const blob = new Blob([res.data as BlobPart], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cd = (res.headers as Record<string, string> | undefined)?.['content-disposition'] ?? '';
    a.download = /filename="?([^"]+)"?/.exec(cd)?.[1] ?? 'submissions.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
  /** Tải báo cáo CSV (người × thẻ × đã nộp × đúng hạn) — cho cô / đính kèm báo cáo. */
  async downloadReport(pid: number): Promise<void> {
    const res = await api.get(`${P(pid)}/submissions/report.csv`, { responseType: 'blob' });
    const blob = new Blob([res.data as BlobPart], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cd = (res.headers as Record<string, string> | undefined)?.['content-disposition'] ?? '';
    a.download = /filename="?([^"]+)"?/.exec(cd)?.[1] ?? 'submissions.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },
  /** Link tải một tệp đính kèm (dùng endpoint sẵn có). */
  fileUrl: (pid: number, attachmentId: number) => d<{ url: string }>(api.get(`${P(pid)}/attachments/${attachmentId}/url`)),
};
