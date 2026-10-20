/**
 * Trình xem tệp CT Work — NGUỒN tệp: mỗi nơi có tệp tải lên (thẻ, bình luận, bằng chứng test, chat, lớp học, cổng
 * khách) đổi dòng của mình thành một `TepXem`. URL ký sẵn xin LÚC CẦN (mở/đổi tệp/tải), không lúc dựng danh sách:
 * URL của khách cổng chỉ sống 2 phút, của nhân viên 10 phút.
 */

import { api } from '@/lib/api';
import { userName, workApi, type WorkUser } from '@/lib/work-api';
import { chatApi } from '@/lib/work-chat-api';
import type { XemTruocOffice } from './kieu';
import { giaiMa } from './loaiTep';

export type { XemTruocOffice } from './kieu';

export interface TepXem {
  /** Khoá duy nhất trong danh sách (React key). */
  id: string;
  fileName: string;
  mime?: string | null;
  size?: number | null;
  createdAt?: string | null;
  /** Tên người tải lên (đã định dạng). */
  uploader?: string | null;
  /** URL ký sẵn: `inline` ⇒ xem trong trang; không ⇒ tải về đúng tên (Content-Disposition: attachment). */
  url: (inline: boolean) => Promise<string>;
  /** Byte chữ qua máy chủ (≤ 2 MB) — markdown/csv/json/mã/chữ thường. Không có ⇒ loại chữ hiện thẻ "tải về". */
  noiDung?: () => Promise<{ text: string; truncated: boolean; size: number | null }>;
  /** Xem trước docx/xlsx dựng ở máy chủ. */
  xemTruoc?: () => Promise<XemTruocOffice>;
}

/** Lỗi trả về khi xin `responseType: arraybuffer` là byte JSON ⇒ đọc lại để workError() thấy `code`/`message`. */
function docLaiLoi(err: unknown): never {
  const e = err as { response?: { data?: unknown } };
  const d = e?.response?.data;
  if (d instanceof ArrayBuffer) {
    try { e.response!.data = JSON.parse(new TextDecoder().decode(d)); } catch { /* giữ nguyên */ }
  }
  throw err;
}

async function layChu(path: string) {
  try {
    const r = await api.get<ArrayBuffer>(path, { responseType: 'arraybuffer' });
    const h = r.headers as Record<string, string | undefined>;
    const size = Number(h['x-file-size']);
    return { text: giaiMa(r.data), truncated: h['x-preview-truncated'] === '1', size: Number.isFinite(size) ? size : null };
  } catch (err) {
    return docLaiLoi(err);
  }
}
const layXemTruoc = (path: string) => api.get<{ data: XemTruocOffice }>(path).then((r) => r.data.data);

/** Hai tuyến xem của một nơi có tệp (`…/content`, `…/preview`). */
const hai = (goc: string) => ({ noiDung: () => layChu(`${goc}/content`), xemTruoc: () => layXemTruoc(`${goc}/preview`) });

type Dong = { id: number; fileName: string; mime?: string | null; size?: number | null; createdAt?: string | null; uploader?: Pick<WorkUser, 'username' | 'fullName' | 'displayName'> | null };
const chung = (k: string, f: Dong) => ({
  id: `${k}${f.id}`, fileName: f.fileName, mime: f.mime ?? null, size: f.size ?? null, createdAt: f.createdAt ?? null,
  uploader: f.uploader ? userName(f.uploader) : null,
});

/** Đính kèm thẻ, tệp bình luận, bằng chứng lần chạy test, tệp cổng khách — cùng bảng `work_attachments`. */
export function tepDinhKem(pid: number, f: Dong): TepXem {
  return { ...chung('a', f), url: (inline) => workApi.attachmentUrl(pid, f.id, inline), ...hai(`/work/projects/${pid}/attachments/${f.id}`) };
}

/** Tệp tin nhắn kênh chat dự án. */
export function tepChat(pid: number, f: Dong): TepXem {
  return { ...chung('c', f), url: (inline) => chatApi.fileUrl(pid, f.id, inline), ...hai(`/work/projects/${pid}/chat/files/${f.id}`) };
}

/** Tệp bảng tin / tài liệu lớp. */
export function tepBangTinLop(classId: number, f: Dong): TepXem {
  const goc = `/work/classes/${classId}/stream-files/${f.id}`;
  return {
    ...chung('s', f),
    url: (inline) => api.get<{ data: { url: string } }>(`${goc}/url${inline ? '?inline=1' : ''}`).then((r) => r.data.data.url),
    ...hai(goc),
  };
}

/** Tệp đề bài + bài nộp của lớp. */
export function tepBaiTapLop(classId: number, f: Dong): TepXem {
  const goc = `/work/classes/${classId}/files/${f.id}`;
  return {
    ...chung('f', f),
    url: (inline) => api.get<{ data: { url: string } }>(`${goc}${inline ? '?inline=1' : ''}`).then((r) => r.data.data.url),
    ...hai(goc),
  };
}

/** Ảnh đã có sẵn địa chỉ (ảnh trong nội dung mô tả/bình luận/Docs — `/api/v1/work/projects/:pid/images/:id`). */
export function anhCoSan(src: string, name: string): TepXem {
  return { id: `img:${src}`, fileName: name, mime: 'image/*', url: async () => src };
}
