/**
 * CT Work K-3 (10/10/2026) — client API cho KÊNH CHAT DỰ ÁN. Backend: src/routes/work.ctwk3.routes.ts +
 * src/services/work/chat.service.ts. Tách riêng khỏi lib/work-api.ts để không giẫm tệp nhiều phiên cùng sửa.
 */

import { api } from '@/lib/api';
import type { WorkUser } from '@/lib/work-api';

type Env<T> = { success: boolean; data: T };
const d = <T,>(p: Promise<{ data: Env<T> }>) => p.then((r) => r.data.data);
const B = '/work/projects';

export const CHAT_MAX_FILE_BYTES = 25 * 1024 * 1024;
export const CHAT_MAX_FILES = 10;
export const CHAT_MAX_BODY = 8000;
export const CHAT_VOICE_MAX_SECONDS = 180;
export const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '👀', '🙏', '✅', '🔥'] as const;

export type ChannelKind = 'PUBLIC' | 'PRIVATE' | 'CLIENT';
export type MuteChoice = '30m' | '1h' | '8h' | 'tomorrow' | 'forever' | 'custom' | 'off';
export type NotifyMode = 'ALL' | 'MENTIONS';
export type TranscriptStatus = 'PENDING' | 'DONE' | 'NO_SPEECH' | 'NO_KEY' | 'LIMIT' | 'FAILED';

export interface ChatChannel {
  id: number; name: string; topic: string | null; kind: ChannelKind; isGeneral: boolean; archived: boolean;
  lastMessageAt: string | null; unread: number; mentions: number; badge: number; lastReadId: number;
  muted: boolean; mutedUntil: string | null; mutedForever: boolean; notify: 'DEFAULT' | 'ALL' | 'MENTIONS';
  member: boolean; canPost: boolean; canManage: boolean; call: { url: string; startedAt: string } | null;
}

export interface ChannelList {
  channels: ChatChannel[];
  total: number;
  me: { audience: 'TEAM' | 'CLIENT'; canCreate: boolean; canCreateClient: boolean; canModerate: boolean };
}

export interface ChatFile {
  id: number; fileName: string; mime: string; size: number; createdAt: string;
  voice: { durationMs: number; transcriptStatus: TranscriptStatus; transcript: string | null; language?: string | null } | null;
}

export interface RefPreview {
  t: 'issue' | 'test' | 'doc' | 'meeting';
  key: string; n: number; url: string; title: string; project?: string;
  status?: { name: string; category: string } | null;
  assignee?: { id: number; name: string; avatarUrl: string | null } | null;
  type?: { key: string; name: string; color: string } | null;
  when?: string | null;
}

export interface ChatReaction { emoji: string; count: number; mine: boolean; users: Array<{ id: number; name: string }> }

export interface ChatMessage {
  id: number; channelId: number; kind: 'USER' | 'SYSTEM'; parentId: number | null; replyCount: number; lastReplyAt: string | null;
  createdAt: string; editedAt: string | null; deleted: boolean; clientKey: string | null;
  body: string; author: WorkUser | null; mentions: number[];
  meta: { type?: string; url?: string; key?: string; number?: number; title?: string; from?: { channelId: number; channel: string; messageId: number; author: string | null } } | null;
  pinned: { at: string; byId: number | null } | null;
  reactions: ChatReaction[]; files: ChatFile[];
  links: Array<{ url: string; domain: string; title: string | null }>;
  previews: RefPreview[];
  /** Chỉ phía client: tin đang chờ gửi (hàng chờ ngoại tuyến) / gửi lỗi. */
  local?: 'sending' | 'failed';
}

export interface ChatPage { messages: ChatMessage[]; hasMoreBefore: boolean; hasMoreAfter: boolean }

export interface ChatMember extends WorkUser { role: string | null; online: boolean | null }

export interface ChatPrefs {
  mutedUntil: string | null; mutedForever: boolean; notify: NotifyMode; sound: boolean; desktop: boolean; emailDigest: boolean;
  quietStart: number | null; quietEnd: number | null; quietNow: boolean;
}

/** Sự kiện `work:chat:notify` (phòng riêng của người nhận) — server đã tính `alert` theo cài đặt của chính người đó. */
export interface ChatNotify {
  projectId: number; projectKey: string; projectName: string; channelId: number; channelName: string;
  messageId: number; parentId: number | null; author: WorkUser | null; authorName: string; excerpt: string; url: string;
  mention: boolean; alert: boolean; sound: boolean; desktop: boolean; counts: boolean;
}

export const chatKeys = {
  all: ['work', 'chat'] as const,
  channels: (pid: number) => ['work', 'chat', pid, 'channels'] as const,
  messages: (pid: number, cid: number) => ['work', 'chat', pid, 'messages', cid] as const,
  thread: (pid: number, cid: number, mid: number) => ['work', 'chat', pid, 'thread', cid, mid] as const,
  pinned: (pid: number, cid: number) => ['work', 'chat', pid, 'pinned', cid] as const,
  members: (pid: number, cid: number) => ['work', 'chat', pid, 'members', cid] as const,
  search: (pid: number, cid: number, q: string) => ['work', 'chat', pid, 'search', cid, q] as const,
  unread: ['work', 'chat', 'unread'] as const,
  prefs: ['work', 'chat', 'prefs'] as const,
};

export const chatApi = {
  unread: () => d<{ total: number; projects: Array<{ projectId: number; unread: number; mentions: number }> }>(api.get('/work/chat/unread')),
  prefs: () => d<ChatPrefs>(api.get('/work/chat/prefs')),
  setPrefs: (body: Partial<{ mute: MuteChoice; until: string | null; notify: NotifyMode; sound: boolean; desktop: boolean; emailDigest: boolean }>) =>
    d<ChatPrefs>(api.put('/work/chat/prefs', body)),

  channels: (pid: number, archived = false) => d<ChannelList>(api.get(`${B}/${pid}/chat/channels${archived ? '?archived=1' : ''}`)),
  createChannel: (pid: number, body: { name: string; topic?: string | null; kind: ChannelKind; memberIds?: number[] }) =>
    d<{ id: number; name: string; kind: ChannelKind }>(api.post(`${B}/${pid}/chat/channels`, body)),
  updateChannel: (pid: number, cid: number, body: { name?: string; topic?: string | null; archived?: boolean }) => d(api.patch(`${B}/${pid}/chat/channels/${cid}`, body)),
  members: (pid: number, cid: number) => d<ChatMember[]>(api.get(`${B}/${pid}/chat/channels/${cid}/members`)),
  setMembers: (pid: number, cid: number, body: { add?: number[]; remove?: number[] }) => d<ChatMember[]>(api.put(`${B}/${pid}/chat/channels/${cid}/members`, body)),
  setNotify: (pid: number, cid: number, body: { mute?: MuteChoice; until?: string | null; notify?: 'DEFAULT' | 'ALL' | 'MENTIONS' }) =>
    d<{ channelId: number; mutedUntil: string | null; mutedForever: boolean; notify: string }>(api.put(`${B}/${pid}/chat/channels/${cid}/notify`, body)),
  read: (pid: number, cid: number, messageId?: number) => d<{ lastReadId: number }>(api.post(`${B}/${pid}/chat/channels/${cid}/read`, messageId ? { messageId } : {})),
  readAll: (pid: number) => d(api.post(`${B}/${pid}/chat/read-all`, {})),

  messages: (pid: number, cid: number, q: { before?: number; after?: number; around?: number; limit?: number } = {}) => {
    const p = new URLSearchParams(Object.entries(q).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString();
    return d<ChatPage>(api.get(`${B}/${pid}/chat/channels/${cid}/messages${p ? `?${p}` : ''}`));
  },
  message: (pid: number, cid: number, mid: number) => d<ChatMessage>(api.get(`${B}/${pid}/chat/channels/${cid}/messages/${mid}`)),
  thread: (pid: number, cid: number, mid: number) => d<{ root: ChatMessage; replies: ChatMessage[] }>(api.get(`${B}/${pid}/chat/channels/${cid}/messages/${mid}/thread`)),
  send: (pid: number, cid: number, body: { body: string; parentId?: number | null; fileIds?: number[]; clientKey?: string | null }) =>
    d<ChatMessage>(api.post(`${B}/${pid}/chat/channels/${cid}/messages`, body)),
  edit: (pid: number, cid: number, mid: number, body: string) => d<ChatMessage>(api.patch(`${B}/${pid}/chat/channels/${cid}/messages/${mid}`, { body })),
  remove: (pid: number, cid: number, mid: number) => d(api.delete(`${B}/${pid}/chat/channels/${cid}/messages/${mid}`)),
  react: (pid: number, cid: number, mid: number, emoji: string, active?: boolean) =>
    d<{ messageId: number; reactions: ChatReaction[] }>(api.put(`${B}/${pid}/chat/channels/${cid}/messages/${mid}/reactions/${encodeURIComponent(emoji)}`, active === undefined ? {} : { active })),
  pin: (pid: number, cid: number, mid: number, pinned: boolean) => d(api.put(`${B}/${pid}/chat/channels/${cid}/messages/${mid}/pin`, { pinned })),
  pinned: (pid: number, cid: number) => d<ChatMessage[]>(api.get(`${B}/${pid}/chat/channels/${cid}/pinned`)),
  search: (pid: number, cid: number, q: string) => d<ChatMessage[]>(api.get(`${B}/${pid}/chat/channels/${cid}/search?q=${encodeURIComponent(q)}`)),
  createIssue: (pid: number, cid: number, mid: number, body: { typeId: number; title?: string | null }) =>
    d<{ number: number; key: string; url: string }>(api.post(`${B}/${pid}/chat/channels/${cid}/messages/${mid}/issue`, body)),
  forward: (pid: number, cid: number, mid: number, body: { toChannelId: number; note?: string | null }) =>
    d<ChatMessage>(api.post(`${B}/${pid}/chat/channels/${cid}/messages/${mid}/forward`, body)),
  call: (pid: number, cid: number, url?: string | null) => d<{ url: string; reused: boolean }>(api.post(`${B}/${pid}/chat/channels/${cid}/call`, url ? { url } : {})),

  /** Tệp LUÔN qua backend (≤ 25 MB) — chạy cả app desktop (CSP chặn PUT thẳng R2). */
  uploadFile: (pid: number, cid: number, file: File, onProgress?: (pct: number) => void) => {
    if (file.size > CHAT_MAX_FILE_BYTES) return Promise.reject(new Error(`${file.name} is larger than 25 MB`));
    const form = new FormData();
    form.append('file', file, file.name);
    return d<ChatFile>(api.post(`${B}/${pid}/chat/channels/${cid}/files`, form, {
      timeout: 180_000, onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
    }));
  },
  uploadVoice: (pid: number, cid: number, file: File, durationMs: number) => {
    const form = new FormData();
    form.append('audio', file, file.name);
    form.append('durationMs', String(Math.round(durationMs)));
    return d<ChatFile>(api.post(`${B}/${pid}/chat/channels/${cid}/voice`, form, { timeout: 120_000 }));
  },
  discardFile: (pid: number, fid: number) => d(api.delete(`${B}/${pid}/chat/files/${fid}`)),
  fileUrl: (pid: number, fid: number, inline = false) => d<{ url: string }>(api.get(`${B}/${pid}/chat/files/${fid}/url${inline ? '?inline=1' : ''}`)).then((r) => r.url),
  retryTranscription: (pid: number, fid: number) => d<{ status: TranscriptStatus }>(api.post(`${B}/${pid}/chat/files/${fid}/transcribe`, {})),
};

/** Đường dẫn trang chat (dùng cho thông báo, "copy link", chia sẻ). */
export const chatPath = (ws: string, key: string, channelId?: number, messageId?: number, threadId?: number | null) =>
  `/work/${ws}/${key}/chat${channelId ? `?c=${channelId}${messageId ? `&m=${messageId}` : ''}${threadId ? `&t=${threadId}` : ''}` : ''}`;
