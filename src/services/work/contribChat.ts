/**
 * CT Work — Đóng góp: BỘ CẮM số liệu KÊNH CHAT DỰ ÁN (K-3).
 *
 * K-3 làm kênh chat SONG SONG (bảng `work_channels` / `work_channel_messages` / `work_channel_files`). Gói Đóng góp
 * không phụ thuộc mã của K-3: đọc thẳng bảng bằng SQL thô và HỎI TRƯỚC bảng có tồn tại không (`to_regclass`) — CSDL
 * chưa áp migration của K-3 (hoặc K-3 đổi kế hoạch) ⇒ trả rỗng, các chỉ số chat hiện "—" chứ không vỡ trang.
 * K-3 đổi tên cột ⇒ chỉ sửa tệp này.
 *
 * Chỉ tin người (`kind = 'USER'`), chưa xoá. Tin SYSTEM (gọi nhóm, tạo thẻ) không tính công cho ai.
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export interface ChatMessageRow { id: number; channelId: number; parentId: number | null; authorId: number; mentions: number[]; createdAt: Date }
export interface ChatVoiceRow { uploaderId: number; createdAt: Date }

let known: boolean | null = null;

/** Bảng chat của K-3 đã có trong CSDL chưa. Chỉ nhớ kết quả "có" (migration áp sau khi máy chủ chạy vẫn được nhận). */
export async function chatAvailable(): Promise<boolean> {
  if (known) return true;
  try {
    const r = await prisma.$queryRaw<Array<{ ok: boolean }>>`SELECT (to_regclass('public.work_channel_messages') IS NOT NULL AND to_regclass('public.work_channels') IS NOT NULL) AS ok`;
    known = !!r[0]?.ok;
  } catch {
    known = false;
  }
  return known;
}

/** Tin của người trong mọi kênh của dự án, trong [from, to]. */
export async function chatMessages(projectId: number, from: Date, to: Date): Promise<ChatMessageRow[] | null> {
  if (!(await chatAvailable())) return null;
  try {
    const rows = await prisma.$queryRaw<Array<{ id: number; channel_id: number; parent_id: number | null; author_id: number; mentions: number[] | null; created_at: Date }>>(Prisma.sql`
      SELECT m.id, m.channel_id, m.parent_id, m.author_id, m.mentions, m.created_at
      FROM work_channel_messages m JOIN work_channels c ON c.id = m.channel_id
      WHERE c.project_id = ${projectId} AND m.author_id IS NOT NULL AND m.deleted_at IS NULL AND m.kind = 'USER'
        AND m.created_at >= ${from} AND m.created_at <= ${to}`);
    return rows.map((r) => ({ id: r.id, channelId: r.channel_id, parentId: r.parent_id, authorId: r.author_id, mentions: r.mentions ?? [], createdAt: r.created_at }));
  } catch (err) {
    logger.warn('[work] contrib: đọc tin chat lỗi — bỏ qua số liệu chat', { err: (err as Error).message });
    return null;
  }
}

/** Voice note gửi trong chat (tệp có độ dài, đã gắn vào tin). */
export async function chatVoiceNotes(projectId: number, from: Date, to: Date): Promise<ChatVoiceRow[]> {
  if (!(await chatAvailable())) return [];
  try {
    const rows = await prisma.$queryRaw<Array<{ uploader_id: number; created_at: Date }>>(Prisma.sql`
      SELECT f.uploader_id, f.created_at
      FROM work_channel_files f JOIN work_channels c ON c.id = f.channel_id
      WHERE c.project_id = ${projectId} AND f.uploader_id IS NOT NULL AND f.message_id IS NOT NULL AND f.duration_ms IS NOT NULL
        AND f.created_at >= ${from} AND f.created_at <= ${to}`);
    return rows.map((r) => ({ uploaderId: r.uploader_id, createdAt: r.created_at }));
  } catch {
    return [];
  }
}
