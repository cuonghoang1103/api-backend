/**
 * CT Work — CTW đợt 5b K-1 (10/10/2026): bình luận đầy đủ — trả lời theo luồng, tệp trong bình luận, VOICE NOTE.
 * Backend: src/routes/work.ctw5b.routes.ts + src/services/work/commentFiles.service.ts (+ tuyến bình luận cũ thêm
 * `parentId` / `attachmentIds`). Tách riêng khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';
import { workApi, type CommentVisibility, type TiptapDoc, type WorkComment, type WorkUser } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

export const MAX_COMMENT_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_FILES_PER_COMMENT = 10;
/** Trần voice note — khớp server (commentThreads.ts). */
export const VOICE_MAX_SECONDS = 180;

export type TranscriptStatus = 'PENDING' | 'DONE' | 'NO_SPEECH' | 'NO_KEY' | 'LIMIT' | 'FAILED';

export interface CommentFile {
  id: number;
  commentId: number | null;
  fileName: string;
  mime: string;
  size: number;
  createdAt: string;
  uploader?: WorkUser | null;
  voice: { durationMs: number; transcriptStatus: TranscriptStatus; transcript: string | null; language?: string | null } | null;
}

/** Bình luận như server trả từ K-1: thêm luồng + tệp. */
export type ThreadComment = WorkComment & { parentId?: number | null; attachments?: CommentFile[] };

/** Câu cho người đọc theo trạng thái phiên âm (khớp transcriptNote ở server). */
export function transcriptNote(s: TranscriptStatus): string {
  switch (s) {
    case 'PENDING': return 'Transcribing…';
    case 'NO_SPEECH': return 'No speech detected';
    case 'NO_KEY': return 'Transcription is not available on this server — the audio is saved';
    case 'LIMIT': return 'Transcription skipped: the project reached today’s limit';
    case 'FAILED': return 'Transcription failed';
    default: return '';
  }
}

/** PUT thẳng lên URL ký sẵn (đường cũ của tệp thẻ). Lỗi mạng (CSP của app desktop, CORS) ⇒ status 0. */
function putSigned(url: string, headers: Record<string, string>, file: File, onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(Object.assign(new Error(`Upload failed (${xhr.status})`), { status: xhr.status })));
    xhr.onerror = () => reject(Object.assign(new Error('Upload failed. Check your connection.'), { status: 0 }));
    xhr.send(file);
  });
}

export const workCommentsApi = {
  add: (pid: number, num: number, body: { bodyJson: TiptapDoc; visibility?: CommentVisibility; parentId?: number | null; attachmentIds?: number[] }) =>
    d<ThreadComment>(api.post(`${B}/${pid}/issues/${num}/comments`, body)),

  /**
   * Tệp cho ô bình luận ⇒ bản nháp chờ gửi. Đi đường R2 có sẵn của thẻ (presign → PUT → complete, cờ forComment);
   * PUT thẳng R2 hỏng ở tầng mạng (app desktop chặn bằng CSP) ⇒ lùi về đường qua backend.
   */
  async uploadFile(pid: number, num: number, file: File, onProgress?: (pct: number) => void): Promise<CommentFile> {
    if (file.size > MAX_COMMENT_FILE_BYTES) throw new Error(`${file.name} is larger than 25 MB`);
    // Máy chủ không có R2 ⇒ presign báo WORK_NO_STORAGE — không còn đường nào khác.
    const pre = await d<{ uploadUrl: string; key: string; headers: Record<string, string> }>(
      api.post(`${B}/${pid}/issues/${num}/attachments/presign`, { fileName: file.name, contentType: file.type || 'application/octet-stream', size: file.size, forComment: true }),
    );
    try {
      await putSigned(pre.uploadUrl, pre.headers, file, onProgress);
      return await d<CommentFile>(api.post(`${B}/${pid}/issues/${num}/attachments/complete`, { key: pre.key, fileName: file.name, forComment: true }));
    } catch (err) {
      if ((err as { status?: number }).status !== 0) throw err;
      const form = new FormData();
      form.append('file', file, file.name);
      return d<CommentFile>(api.post(`${B}/${pid}/issues/${num}/comment-files`, form, {
        timeout: 180_000, onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
      }));
    }
  },

  /** Voice note luôn qua backend (≤ 8 MB) — server tự kiểm kiểu/dung lượng/độ dài. */
  uploadVoice: (pid: number, num: number, file: File, durationMs: number) => {
    const form = new FormData();
    form.append('audio', file, file.name);
    form.append('durationMs', String(Math.round(durationMs)));
    return d<CommentFile>(api.post(`${B}/${pid}/issues/${num}/comment-voice`, form, { timeout: 120_000 }));
  },

  discardDraft: (pid: number, aid: number) => d<{ deleted: boolean }>(api.delete(`${B}/${pid}/comment-files/${aid}`)),
  retryTranscription: (pid: number, aid: number) => d<{ status: TranscriptStatus }>(api.post(`${B}/${pid}/attachments/${aid}/transcribe`)),
  url: (pid: number, aid: number, inline = false) => workApi.attachmentUrl(pid, aid, inline),
  addPageComment: (pid: number, num: number, bodyJson: TiptapDoc, parentId?: number | null) =>
    d(api.post(`${B}/${pid}/pages/${num}/comments`, { bodyJson, ...(parentId ? { parentId } : {}) })),
};
