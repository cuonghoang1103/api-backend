import type { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { Hocuspocus, type onChangePayload } from '@hocuspocus/server';
import { Redis } from '@hocuspocus/extension-redis';
import { TiptapTransformer } from '@hocuspocus/transformer';
import { generateHTML } from '@tiptap/html';
import * as Y from 'yjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import {
  canEditSharedNote,
  resolveNoteAccess,
} from '../services/notesShare.service.js';
import {
  authenticateNoteRealtimeToken,
  type NoteRealtimeContext,
} from '../services/notesRealtime.service.js';
import { noteRealtimeExtensions } from '../services/notesRealtimeSchema.js';

const WS_PATH = '/notes-collaboration';
const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;
const LIVE_PERMISSION_TTL_MS = 5_000;
const pendingUpdates = new Map<number, number>();
const lastActorByNote = new Map<number, number>();
const resettingNotes = new Set<number>();
const resetEpochs = new Map<number, number>();
let initialized = false;
let collaborationServer: Hocuspocus | null = null;

/** Force active clients to reconnect and re-run live permission checks. */
export function invalidateNoteCollaborationDocument(noteId: number) {
  if (!Number.isInteger(noteId) || noteId <= 0) return;
  collaborationServer?.closeConnections(`note:${noteId}`);
}

/**
 * Guard an out-of-band content replacement (version restore / legacy REST
 * editor). Active Yjs rooms are closed and their stale final onStore is
 * ignored until the caller has replaced Note.contentJson and deleted the old
 * compacted state.
 */
export async function beginNoteCollaborationReset(noteId: number) {
  if (!Number.isInteger(noteId) || noteId <= 0) return;
  resettingNotes.add(noteId);
  resetEpochs.set(noteId, (resetEpochs.get(noteId) ?? 0) + 1);
  const active = collaborationServer?.documents.get(`note:${noteId}`);
  collaborationServer?.closeConnections(`note:${noteId}`);
  // Capture the exact merged state before an intentional REST replacement.
  // The ordinary debounced onStore is suppressed by resettingNotes.
  if (active) {
    await materializeDocument(noteId, active, lastActorByNote.get(noteId));
  }
}

export function endNoteCollaborationReset(noteId: number) {
  const epoch = resetEpochs.get(noteId);
  // WebSocket close + Hocuspocus unload completes asynchronously. Keep the
  // reset gate briefly so its final stale onStore cannot recreate old state.
  setTimeout(() => {
    if (resetEpochs.get(noteId) !== epoch) return;
    resettingNotes.delete(noteId);
    resetEpochs.delete(noteId);
  }, 2000).unref();
}

function noteIdFromName(documentName: string): number {
  const match = /^note:(\d+)$/.exec(documentName);
  const noteId = Number(match?.[1]);
  if (!match || !Number.isInteger(noteId) || noteId <= 0) {
    throw new Error('Tên tài liệu không hợp lệ');
  }
  return noteId;
}

function emptyDocument() {
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}

async function materializeDocument(
  noteId: number,
  document: Y.Doc,
  actorId?: number,
) {
  const state = Y.encodeStateAsUpdate(document);
  if (state.byteLength > MAX_DOCUMENT_BYTES) {
    throw new Error(`Tài liệu ${noteId} vượt giới hạn trạng thái CRDT 4 MB`);
  }
  const stateVector = Y.encodeStateVector(document);
  const json = TiptapTransformer.fromYdoc(document, 'default') as Prisma.InputJsonObject;
  const html = generateHTML(json, noteRealtimeExtensions);
  const realtimeTitle = document.getMap<unknown>('metadata').get('title');
  const title = typeof realtimeTitle === 'string'
    ? (realtimeTitle.trim() || 'Untitled').slice(0, 300)
    : undefined;
  const updateCount = Math.max(1, pendingUpdates.get(noteId) ?? 1);

  await prisma.$transaction(async (tx) => {
    const current = await tx.note.findFirst({
      where: { id: noteId, deletedAt: null },
    });
    if (!current) throw new Error(`Ghi chú ${noteId} không còn tồn tại`);
    const snapshotActorId = actorId ?? current.userId;

    await tx.noteCollaborationDocument.upsert({
      where: { noteId },
      create: {
        noteId,
        state: Buffer.from(state),
        stateVector: Buffer.from(stateVector),
        byteSize: state.byteLength,
        updateCount,
      },
      update: {
        state: Buffer.from(state),
        stateVector: Buffer.from(stateVector),
        byteSize: state.byteLength,
        updateCount: { increment: updateCount },
      },
    });

    const updated = await tx.note.update({
      where: { id: noteId },
      data: { contentJson: json, contentHtml: html, ...(title ? { title } : {}) },
    });
    const latest = await tx.noteVersion.findFirst({
      where: { noteId },
      orderBy: { version: 'desc' },
      select: { id: true, origin: true, createdAt: true },
    });
    const withinWindow = latest?.origin === 'AUTO_SAVE'
      && Date.now() - latest.createdAt.getTime() < 5 * 60 * 1000;
    if (withinWindow) {
      await tx.noteVersion.update({
        where: { id: latest.id },
        data: {
          userId: snapshotActorId,
          title: updated.title,
          contentJson: json,
          contentHtml: html,
          tags: updated.tags,
        },
      });
    } else {
      const numbered = await tx.note.update({
        where: { id: noteId },
        data: { version: { increment: 1 } },
      });
      await tx.noteVersion.create({
        data: {
          noteId,
          userId: snapshotActorId,
          version: numbered.version,
          title: numbered.title,
          contentJson: json,
          contentHtml: html,
          tags: numbered.tags,
          origin: 'AUTO_SAVE',
        },
      });
    }
  });

  pendingUpdates.delete(noteId);

  // Real-time edits land here rather than through updateNote, so the wiki
  // backlink index has to be rebuilt from this path too or `[[…]]` typed in a
  // collaborative session would never register.
  const { syncNoteReferences } = await import('../services/notesHierarchy.service.js');
  void syncNoteReferences(noteId);
}

/**
 * Attach the Notes collaboration endpoint to the existing HTTP server.
 * Socket.IO remains on /socket.io and Maker Lab remains on /device-ws.
 */
export function initNotesCollaborationGateway(httpServer: HttpServer) {
  if (initialized) return;
  initialized = true;

  const redisExtension = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    prefix: 'cuongthai:notes-collaboration',
    options: {
      password: config.redisPassword || undefined,
      db: config.redisDb,
      maxRetriesPerRequest: null,
    },
  });

  const hocuspocus = new Hocuspocus({
    name: 'notes-collaboration',
    quiet: true,
    stopOnSignals: false,
    debounce: 1500,
    maxDebounce: 10000,
    extensions: [redisExtension],
    async onAuthenticate({ token, documentName, connection }) {
      const noteId = noteIdFromName(documentName);
      if (resettingNotes.has(noteId)) throw new Error('Tài liệu đang được đồng bộ lại, vui lòng thử lại');
      const context = await authenticateNoteRealtimeToken(token, documentName);
      connection.readOnly = !canEditSharedNote(context.permission);
      return context;
    },
    async beforeHandleMessage({ documentName, context, connection }) {
      const noteId = noteIdFromName(documentName);
      const realtimeContext = context as NoteRealtimeContext | undefined;
      if (!realtimeContext || realtimeContext.noteId !== noteId) {
        throw new Error('Phiên cộng tác không hợp lệ');
      }
      if (Date.now() - realtimeContext.permissionCheckedAt < LIVE_PERMISSION_TTL_MS) return;

      // Share invalidation closes local rooms immediately. This periodic live
      // check is the cross-instance safety net during zero-downtime overlap:
      // the first later message is rejected before an old editor update can
      // be applied on another backend process.
      const access = await resolveNoteAccess(realtimeContext.userId, noteId);
      if (access.permission !== realtimeContext.permission) {
        throw new Error('Quyền truy cập tài liệu vừa được thay đổi');
      }
      realtimeContext.permissionCheckedAt = Date.now();
      connection.readOnly = !canEditSharedNote(access.permission);
    },
    async onLoadDocument({ documentName }) {
      const noteId = noteIdFromName(documentName);
      const [stored, note] = await Promise.all([
        prisma.noteCollaborationDocument.findUnique({
          where: { noteId },
          select: { state: true },
        }),
        prisma.note.findFirst({
          where: { id: noteId, deletedAt: null },
          select: { contentJson: true, title: true },
        }),
      ]);
      if (!note) throw new Error('Ghi chú không tồn tại');
      if (stored) {
        const loaded = new Y.Doc();
        Y.applyUpdate(loaded, new Uint8Array(stored.state));
        // The regular Note row remains the source of truth for renames made
        // from the sidebar or older clients while no realtime room was open.
        loaded.getMap('metadata').set('title', note.title);
        return loaded;
      }
      const seeded = TiptapTransformer.toYdoc(
        note.contentJson ?? emptyDocument(),
        'default',
        noteRealtimeExtensions,
      );
      seeded.getMap('metadata').set('title', note.title);
      return seeded;
    },
    async onChange(payload: onChangePayload) {
      const noteId = noteIdFromName(payload.documentName);
      const context = payload.context as NoteRealtimeContext | undefined;
      if (context?.userId) lastActorByNote.set(noteId, context.userId);
      pendingUpdates.set(noteId, (pendingUpdates.get(noteId) ?? 0) + 1);
    },
    async onStoreDocument({ documentName, document, context }) {
      const noteId = noteIdFromName(documentName);
      if (resettingNotes.has(noteId)) {
        pendingUpdates.delete(noteId);
        return;
      }
      const realtimeContext = context as NoteRealtimeContext | undefined;
      await materializeDocument(
        noteId,
        document,
        realtimeContext?.userId ?? lastActorByNote.get(noteId),
      );
    },
    async afterUnloadDocument({ documentName }) {
      const noteId = noteIdFromName(documentName);
      lastActorByNote.delete(noteId);
      pendingUpdates.delete(noteId);
    },
  });
  collaborationServer = hocuspocus;

  const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_DOCUMENT_BYTES });
  httpServer.on('upgrade', (request, socket, head) => {
    let pathname = '';
    try {
      pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    } catch {
      return;
    }
    if (pathname !== WS_PATH) return;
    wss.handleUpgrade(request, socket, head, (websocket) => {
      hocuspocus.handleConnection(websocket, request);
    });
  });

  wss.on('error', (error) => {
    logger.error('Notes collaboration WebSocket error', { error: error.message });
  });
  logger.info('Notes collaboration gateway attached', { path: WS_PATH });
}
