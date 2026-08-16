import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  canEditSharedNote,
  resolveNoteAccess,
  type NoteAccessRole,
} from './notesShare.service.js';

const TOKEN_ISSUER = 'cuongthai-notes';
const TOKEN_AUDIENCE = 'notes-collaboration';
const TOKEN_TTL_SECONDS = 5 * 60;

export interface NoteRealtimeTokenPayload {
  kind: 'note-collaboration';
  userId: number;
  noteId: number;
  roleVersion: number;
  iat?: number;
  exp?: number;
}

export interface NoteRealtimeContext {
  userId: number;
  noteId: number;
  permission: NoteAccessRole;
  permissionCheckedAt: number;
  displayName: string;
  avatarUrl: string | null;
}

function assertNoteId(noteId: number) {
  if (!Number.isInteger(noteId) || noteId <= 0) {
    throw new AppError('noteId is invalid', 400, 'INVALID_NOTE_ID');
  }
}

export async function createNoteRealtimeToken(userId: number, noteId: number) {
  assertNoteId(noteId);
  const access = await resolveNoteAccess(userId, noteId);
  const [shareCount, user] = await Promise.all([
    // Whether anyone else can reach this page decides if the client may fall
    // back to plain REST editing when the socket cannot be reached. A private
    // page has no second writer to diverge from; a shared one always does.
    prisma.noteSubjectShare.count({ where: { subjectId: access.subjectId } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        fullName: true,
        avatarUrl: true,
        roleVersion: true,
        enabled: true,
        accountNonLocked: true,
      },
    }),
  ]);
  if (!user || !user.enabled || !user.accountNonLocked) {
    throw new AppError('Phiên đăng nhập không hợp lệ', 401, 'INVALID_SESSION');
  }

  const payload: NoteRealtimeTokenPayload = {
    kind: 'note-collaboration',
    userId,
    noteId,
    roleVersion: Number(user.roleVersion),
  };
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: TOKEN_TTL_SECONDS,
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  });

  return {
    token,
    expiresIn: TOKEN_TTL_SECONDS,
    documentName: `note:${noteId}`,
    websocketPath: '/notes-collaboration',
    permission: access.permission,
    canEdit: canEditSharedNote(access.permission),
    // False = nobody else can open this page, so the client is allowed to
    // degrade to REST autosave if the socket never comes up.
    isShared: shareCount > 0,
    user: {
      id: user.id,
      name: user.displayName || user.fullName || user.username,
      avatarUrl: user.avatarUrl,
    },
  };
}

export async function authenticateNoteRealtimeToken(
  token: string,
  documentName: string,
): Promise<NoteRealtimeContext> {
  if (!token) throw new Error('Thiếu mã phiên cộng tác');
  const decoded = jwt.verify(token, config.jwtSecret, {
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  }) as NoteRealtimeTokenPayload;

  const match = /^note:(\d+)$/.exec(documentName);
  const noteId = Number(match?.[1]);
  if (!match || decoded.kind !== 'note-collaboration' || decoded.noteId !== noteId) {
    throw new Error('Mã phiên không khớp tài liệu');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      username: true,
      displayName: true,
      fullName: true,
      avatarUrl: true,
      roleVersion: true,
      enabled: true,
      accountNonLocked: true,
    },
  });
  if (
    !user
    || !user.enabled
    || !user.accountNonLocked
    || Number(user.roleVersion) !== Number(decoded.roleVersion)
  ) {
    throw new Error('Phiên đăng nhập đã hết hiệu lực');
  }

  // Re-check the live share on every document authentication. Revoking or
  // downgrading a share therefore takes effect when the provider reconnects,
  // even if the five-minute token itself has not expired yet.
  const access = await resolveNoteAccess(user.id, noteId);
  return {
    userId: user.id,
    noteId,
    permission: access.permission,
    permissionCheckedAt: Date.now(),
    displayName: user.displayName || user.fullName || user.username,
    avatarUrl: user.avatarUrl,
  };
}
