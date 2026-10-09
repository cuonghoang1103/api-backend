/**
 * CTW K-3b — ĐỒNG SOẠN THẢO REALTIME cho Docs của CT Work (Hocuspocus + Yjs + Redis), chép khuôn Notes
 * (`notes-collaboration.gateway.ts`).
 *
 * Đường WebSocket: `/notes-collaboration/work-docs` — nằm DƯỚI tiền tố `location /notes-collaboration` sẵn có của nginx
 * (prefix match, đã có Upgrade/timeout 24h) ⇒ không phải sửa nginx. Gateway Notes so khớp ĐÚNG đường của nó nên không
 * giành kết nối này.
 *
 * Tài liệu `workpage:<pageId>`:
 *   - xác thực: mã phiên 5 phút do REST cấp (collab.service.ts), kiểm lại quyền MỖI 5 GIÂY khi có tin (thu hồi vai,
 *     khoá chỉnh sửa, lưu trữ trang… có hiệu lực ngay cả khi socket còn sống);
 *   - nạp: trạng thái Yjs trong work_page_collab; chưa có ⇒ gieo từ work_pages.content_json (trang cũ); trang bị sửa
 *     NGOÀI phiên (băm lệch) ⇒ khớp lại bằng diff (updateYFragment), không bỏ lịch sử Yjs ⇒ bản offline của client vẫn
 *     gộp đúng;
 *   - lưu (debounce 1,5 s, tối đa 10 s): trạng thái Yjs + work_pages.content_json/content_text/title/version ⇒ lịch sử,
 *     xuất docx/pdf, tìm kiếm, RTM, spec review, phê duyệt (băm nội dung) chạy y như cũ. Bản chụp work_page_versions
 *     tối đa mỗi SNAPSHOT_EVERY_MS + khi người cuối rời phòng + mỗi lần tác vụ máy chủ ghi (có ghi chú);
 *   - tác vụ máy chủ (Fill from project, Report 2–7, Wiegers, Diagram fill, @latest, khôi phục phiên bản) ghi QUA Yjs
 *     bằng `applyPageContentViaCollab` (gộp ba chiều theo khối ⇒ không đè chữ người đang gõ).
 */

import type { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { Hocuspocus, type Extension, type onChangePayload } from '@hocuspocus/server';
import { Redis } from '@hocuspocus/extension-redis';
import * as Y from 'yjs';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { contentHashOf, mergeBlocks, clientIdsOfUpdate, type PmJson } from '../services/work/collabRules.js';
import { EMPTY_DOC, docJson, normalizeDoc, seedDoc, writeJsonInto } from '../services/work/collabDoc.js';
import { tiptapToText } from '../services/work/tiptapText.js';
import { stableStringify } from '../services/work/studio.js';

export const WORK_COLLAB_PATH = '/notes-collaboration/work-docs';
export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
const LIVE_PERMISSION_TTL_MS = 5_000;
/** Bản chụp phiên bản tối đa mỗi 5 phút trong một phiên sửa chung (đổi người viết vẫn gộp theo snapshotTx). */
export const SNAPSHOT_EVERY_MS = 5 * 60 * 1000;
const MAX_CLIENT_USERS = 4000;

/** Ngữ cảnh một kết nối người dùng (do onAuthenticate trả). */
export interface WorkCollabContext {
  userId: number;
  projectId: number;
  pageId: number;
  mode: 'edit' | 'read';
  checkedAt: number;
}

/** Ngữ cảnh kết nối TRỰC TIẾP của máy chủ (tác vụ tự điền / khôi phục). */
interface ServerWriteContext {
  system: true;
  userId: number;
  note?: string | null;
  kind?: 'EDIT' | 'RESTORE' | 'MANUAL';
}

type AnyContext = Partial<WorkCollabContext> & Partial<ServerWriteContext>;

export interface WorkCollabHooks {
  /** Quyền hiện tại của người dùng với trang — trả 'deny' ⇒ ngắt. Tách ra để test được không cần HTTP. */
  authenticate(token: string, documentName: string): Promise<WorkCollabContext>;
  recheck(ctx: WorkCollabContext): Promise<'edit' | 'read' | 'deny'>;
}

let server: Hocuspocus | null = null;
let hooks: WorkCollabHooks | null = null;
const pending = new Map<number, { count: number; actor: number | null; clients: Map<number, number> }>();

export function pageIdFromName(documentName: string): number {
  const m = /^workpage:(\d+)$/.exec(documentName);
  const id = Number(m?.[1]);
  if (!m || !Number.isInteger(id) || id <= 0) throw new Error('Invalid document name');
  return id;
}
export const docNameOf = (pageId: number) => `workpage:${pageId}`;

export function workCollabServer(): Hocuspocus | null {
  return server;
}

// ─── Nạp ─────────────────────────────────────────────────────────

/**
 * Bảo đảm trang có dòng work_page_collab với trạng thái Yjs. Hai tiến trình cùng gieo một lúc ⇒ chỉ một bản thắng
 * (create + bắt trùng khoá), bên thua nạp lại bản đã lưu — hai lần gieo độc lập mà bị gộp sẽ NHÂN ĐÔI nội dung.
 */
export async function ensureCollabRow(pageId: number): Promise<{ createdAt: Date; disabled: boolean } | null> {
  const row = await prisma.workPageCollab.findUnique({ where: { pageId }, select: { createdAt: true, disabled: true, state: true } });
  if (row?.state) return { createdAt: row.createdAt, disabled: row.disabled };
  const page = await prisma.workPage.findFirst({ where: { id: pageId, deletedAt: null }, select: { contentJson: true, title: true } });
  if (!page) return null;
  const doc = seedDoc(page.contentJson, page.title);
  const state = Y.encodeStateAsUpdate(doc);
  const data = {
    state: Buffer.from(state), stateVector: Buffer.from(Y.encodeStateVector(doc)), byteSize: state.byteLength,
    contentHash: contentHashOf(page.contentJson ?? null),
  };
  doc.destroy();
  if (row) {
    // Dòng có sẵn (vd tạo do bật/tắt công tắc) nhưng chưa có trạng thái ⇒ chỉ điền khi vẫn còn trống.
    await prisma.workPageCollab.updateMany({ where: { pageId, state: null }, data });
  } else {
    try {
      await prisma.workPageCollab.create({ data: { pageId, ...data } });
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) throw err;
    }
  }
  const fresh = await prisma.workPageCollab.findUnique({ where: { pageId }, select: { createdAt: true, disabled: true } });
  return fresh;
}

async function loadDoc(pageId: number): Promise<Y.Doc> {
  const page = await prisma.workPage.findFirst({ where: { id: pageId, deletedAt: null }, select: { contentJson: true, title: true } });
  if (!page) throw new Error('Document not found');
  await ensureCollabRow(pageId);
  const row = await prisma.workPageCollab.findUnique({ where: { pageId }, select: { state: true, contentHash: true, disabled: true } });
  if (!row?.state) throw new Error('Could not prepare the live document');
  if (row.disabled) throw new Error('Live editing is turned off for this document');
  const doc = new Y.Doc();
  Y.applyUpdate(doc, new Uint8Array(row.state));
  // Trang bị sửa ngoài phiên cộng tác ⇒ khớp lại bằng diff (không gieo lại: gieo lại sẽ nhân đôi bản offline của client).
  const hash = contentHashOf(page.contentJson ?? null);
  if (row.contentHash !== hash) {
    try {
      writeJsonInto(doc, page.contentJson);
    } catch (err) {
      logger.warn('[work-collab] không khớp lại được nội dung ngoài phiên', { pageId, err: (err as Error).message });
    }
  }
  const meta = doc.getMap<unknown>('metadata');
  if (meta.get('title') !== page.title) meta.set('title', page.title);
  return doc;
}

// ─── Lưu (Yjs ⇒ trang + phiên bản) ───────────────────────────────

export interface MaterializeOptions {
  actorId: number | null;
  /** ép một bản chụp phiên bản (người cuối rời phòng, tác vụ máy chủ) */
  forceSnapshot?: boolean;
  note?: string | null;
  kind?: 'EDIT' | 'RESTORE' | 'MANUAL';
  /** clientID Yjs ⇒ userId mới thấy từ lần lưu trước */
  clients?: Map<number, number>;
  updateCount?: number;
}

/**
 * Ghi trạng thái Yjs + nội dung trang. Trả `changed` (nội dung/tiêu đề trang thật sự đổi) để gateway báo realtime.
 * Không đổi gì ⇒ chỉ cập nhật trạng thái Yjs (rẻ), không đụng version/phiên bản.
 */
export async function materializePage(pageId: number, doc: Y.Doc, opts: MaterializeOptions): Promise<{ changed: boolean; snapshot: number | null; projectId: number | null; number: number | null }> {
  const state = Y.encodeStateAsUpdate(doc);
  if (state.byteLength > MAX_DOCUMENT_BYTES) throw new Error(`Document ${pageId} exceeds the 8 MB live-editing limit`);
  const json = docJson(doc);
  const text = tiptapToText(json).slice(0, 1_000_000);
  const rawTitle = doc.getMap<unknown>('metadata').get('title');
  const title = typeof rawTitle === 'string' ? (rawTitle.trim() || 'Untitled').slice(0, 255) : null;
  const hash = contentHashOf(json);
  const { snapshotTx } = await import('../services/work/pages.service.js');

  return prisma.$transaction(async (tx) => {
    const page = await tx.workPage.findFirst({ where: { id: pageId, deletedAt: null }, select: { id: true, projectId: true, number: true, title: true, contentJson: true, contentText: true, version: true } });
    if (!page) return { changed: false, snapshot: null, projectId: null, number: null };
    const row = await tx.workPageCollab.findUnique({ where: { pageId }, select: { clientUsers: true, lastSnapshotAt: true } });
    const users: Record<string, number> = { ...((row?.clientUsers as Record<string, number> | null) ?? {}) };
    for (const [c, u] of opts.clients ?? []) users[String(c)] = u;
    // Chỉ giữ clientID còn ký tự trong tài liệu (mỗi tab mỗi phiên một clientID ⇒ không cho phình mãi).
    const alive = new Set([...doc.store.clients.keys()].map(String));
    const pruned = Object.fromEntries(Object.entries(users).filter(([c]) => alive.has(c)).slice(-MAX_CLIENT_USERS));

    const bodyChanged = stableStringify(json) !== stableStringify(page.contentJson);
    const titleChanged = title !== null && title !== page.title;
    const changed = bodyChanged || titleChanged;
    const now = new Date();
    const due = !row?.lastSnapshotAt || now.getTime() - row.lastSnapshotAt.getTime() >= SNAPSHOT_EVERY_MS;
    let snapshot: number | null = null;

    if (changed) {
      await tx.workPage.update({
        where: { id: pageId },
        data: {
          ...(bodyChanged ? { contentJson: json as Prisma.InputJsonValue, contentText: text } : {}),
          ...(titleChanged ? { title: title! } : {}),
          ...(opts.actorId ? { lastEditedById: opts.actorId } : {}),
          version: { increment: 1 },
        },
      });
    }
    const wantSnapshot = (changed && (due || opts.forceSnapshot)) || (opts.forceSnapshot && !!opts.note);
    if (wantSnapshot) {
      const cur = { title: title ?? page.title, contentJson: json, contentText: text };
      snapshot = await snapshotTx(tx, pageId, opts.actorId, cur, opts.kind ?? (opts.note ? 'MANUAL' : 'EDIT'), opts.note ?? null, now);
    }
    await tx.workPageCollab.upsert({
      where: { pageId },
      create: {
        pageId, state: Buffer.from(state), stateVector: Buffer.from(Y.encodeStateVector(doc)), byteSize: state.byteLength,
        updateCount: opts.updateCount ?? 0, contentHash: hash, clientUsers: pruned, lastSnapshotAt: wantSnapshot ? now : null,
      },
      update: {
        state: Buffer.from(state), stateVector: Buffer.from(Y.encodeStateVector(doc)), byteSize: state.byteLength,
        updateCount: { increment: opts.updateCount ?? 0 }, contentHash: hash, clientUsers: pruned,
        ...(wantSnapshot ? { lastSnapshotAt: now } : {}),
      },
    });
    return { changed, snapshot, projectId: page.projectId, number: page.number };
  }, { timeout: 20_000 });
}

async function storeAndEmit(pageId: number, document: Y.Doc, context: AnyContext | undefined, clientsCount: number) {
  const p = pending.get(pageId);
  pending.delete(pageId);
  const actor = context?.system ? context.userId ?? null : p?.actor ?? context?.userId ?? null;
  const clients = new Map(p?.clients ?? []);
  const r = await materializePage(pageId, document, {
    actorId: actor,
    clients,
    updateCount: p?.count ?? 0,
    // Người cuối rời phòng ⇒ chụp phiên bản ngay (lịch sử không trễ 5 phút sau khi ai cũng đã đóng tab).
    forceSnapshot: clientsCount === 0 || !!context?.system,
    note: context?.system ? context.note ?? null : null,
    kind: context?.system ? context.kind : undefined,
  });
  if ((r.changed || r.snapshot) && r.projectId && r.number && actor) {
    const { emitWorkEvent } = await import('../services/work/events.js');
    emitWorkEvent({ type: 'page.updated', projectId: r.projectId, pageId, number: r.number, action: 'updated', actor: { kind: 'USER', userId: actor } });
  }
}

// ─── Ghi từ máy chủ (tự điền / khôi phục) ────────────────────────

/** Trang này đang (hoặc đã từng) đồng soạn ⇒ mọi ghi nội dung từ máy chủ phải đi qua Yjs. */
export async function collabActiveFor(pageId: number): Promise<boolean> {
  if (!server) return false;
  if (server.documents.has(docNameOf(pageId))) return true;
  const row = await prisma.workPageCollab.findUnique({ where: { pageId }, select: { disabled: true, state: true } });
  return !!row?.state && !row.disabled;
}

/**
 * Ghi nội dung do máy chủ tính (Fill/Report/Wiegers/Diagram/@latest/khôi phục) VÀO Yjs:
 *   - mode 'merge'  : gộp ba chiều base→next lên nội dung đang sống (không đè chữ người đang gõ);
 *   - mode 'replace': ghi y hệt `next` (khôi phục phiên bản — chủ trang/ADMIN chủ động chọn), vẫn bằng diff.
 * Trả null khi trang không ở chế độ cộng tác (gọi nơi khác cứ ghi REST như cũ).
 */
export async function applyPageContentViaCollab(input: {
  pageId: number; base: unknown; next: unknown; actorId: number; mode: 'merge' | 'replace';
  title?: string; note?: string | null; kind?: 'EDIT' | 'RESTORE' | 'MANUAL';
}): Promise<{ doc: PmJson; conflicts: number } | null> {
  if (!server || !(await collabActiveFor(input.pageId))) return null;
  const ctx: ServerWriteContext = { system: true, userId: input.actorId, note: input.note ?? null, kind: input.kind };
  const conn = await server.openDirectConnection(docNameOf(input.pageId), ctx);
  let result: { doc: PmJson; conflicts: number } = { doc: { ...EMPTY_DOC }, conflicts: 0 };
  try {
    await conn.transact((document) => {
      // clientID mới cho MỖI lần ghi của máy chủ ⇒ tác giả theo đoạn ghi đúng người bấm (không gộp mọi tác vụ vào một).
      document.clientID = Math.floor(Math.random() * 0xffffffff) >>> 0;
      const p = pending.get(input.pageId) ?? { count: 0, actor: null, clients: new Map() };
      p.clients.set(document.clientID, input.actorId);
      pending.set(input.pageId, p);
      const live = docJson(document);
      // So khối phải cùng MỘT dạng chuẩn: JSON lấy từ Yjs có thêm attrs mặc định (colspan, marks attrs {}…) mà JSON
      // gốc của trang/mẫu không có ⇒ không chuẩn hoá thì khối nào cũng "khác" và mọi đoạn tự điền thành xung đột (nhân đôi bảng).
      const canon = (j: unknown) => { const t = seedDoc(j, ''); try { return docJson(t); } finally { t.destroy(); } };
      const merged = input.mode === 'replace' ? { doc: normalizeDoc(input.next), conflicts: 0 } : mergeBlocks(canon(input.base), live, canon(input.next));
      writeJsonInto(document, merged.doc);
      if (input.title) document.getMap('metadata').set('title', input.title.slice(0, 255));
      result = { doc: docJson(document), conflicts: 'conflicts' in merged ? merged.conflicts : 0 };
    }, 'ctw-server');
  } finally {
    await conn.disconnect();
  }
  return result;
}

/** Ghi ngay trạng thái đang sống (trước khi xuất/tóm tắt đọc từ DB). Không có phòng trong tiến trình này ⇒ không làm gì. */
export async function flushPageCollab(pageId: number): Promise<boolean> {
  const d = server?.documents.get(docNameOf(pageId));
  if (!d) return false;
  await storeAndEmit(pageId, d, undefined, d.getConnectionsCount());
  return true;
}

/** Đóng mọi kết nối của trang (đổi quyền, tắt collab) ⇒ client kết nối lại và tự hỏi quyền mới. */
export function closePageCollab(pageId: number) {
  server?.closeConnections(docNameOf(pageId));
}

/** Đang có ai trong phòng (tiến trình này) — để test/đo. */
export function liveConnectionCount(pageId: number): number {
  return server?.documents.get(docNameOf(pageId))?.getConnectionsCount() ?? 0;
}

// ─── Khởi tạo ────────────────────────────────────────────────────

export function createWorkCollabServer(h: WorkCollabHooks, opts: { redis?: boolean; debounce?: number; maxDebounce?: number } = {}): Hocuspocus {
  hooks = h;
  const extensions: Extension[] = [];
  if (opts.redis !== false) {
    extensions.push(new Redis({
      host: config.redisHost,
      port: config.redisPort,
      prefix: 'cuongthai:work-docs-collaboration',
      options: { password: config.redisPassword || undefined, db: config.redisDb, maxRetriesPerRequest: null },
    }));
  }
  const instance = new Hocuspocus({
    name: 'work-docs-collaboration',
    quiet: true,
    stopOnSignals: false,
    debounce: opts.debounce ?? 1500,
    maxDebounce: opts.maxDebounce ?? 10_000,
    extensions,
    async onAuthenticate({ token, documentName, connection }) {
      pageIdFromName(documentName);
      const ctx = await hooks!.authenticate(token, documentName);
      connection.readOnly = ctx.mode !== 'edit';
      return ctx;
    },
    async beforeHandleMessage({ documentName, context, connection }) {
      const pageId = pageIdFromName(documentName);
      const ctx = context as AnyContext | undefined;
      if (ctx?.system) return;
      if (!ctx || ctx.pageId !== pageId || !ctx.userId) throw new Error('Invalid live-editing session');
      if (Date.now() - (ctx.checkedAt ?? 0) < LIVE_PERMISSION_TTL_MS) return;
      const mode = await hooks!.recheck(ctx as WorkCollabContext);
      if (mode === 'deny') throw new Error('Your access to this document has changed');
      (ctx as WorkCollabContext).mode = mode;
      (ctx as WorkCollabContext).checkedAt = Date.now();
      connection.readOnly = mode !== 'edit';
    },
    async onLoadDocument({ documentName }) {
      return loadDoc(pageIdFromName(documentName));
    },
    async onChange(payload: onChangePayload) {
      const pageId = pageIdFromName(payload.documentName);
      const ctx = payload.context as AnyContext | undefined;
      const p = pending.get(pageId) ?? { count: 0, actor: null, clients: new Map<number, number>() };
      p.count++;
      // Gán clientID của bản cập nhật cho NGƯỜI của kết nối đã gửi (máy chủ quyết, không tin client tự khai).
      if (ctx?.userId && !ctx.system) {
        p.actor = ctx.userId;
        for (const c of clientIdsOfUpdate(payload.update)) if (!p.clients.has(c)) p.clients.set(c, ctx.userId);
      }
      pending.set(pageId, p);
    },
    async onStoreDocument({ documentName, document, context, clientsCount }) {
      await storeAndEmit(pageIdFromName(documentName), document, context as AnyContext | undefined, clientsCount);
    },
    async afterUnloadDocument({ documentName }) {
      pending.delete(pageIdFromName(documentName));
    },
  });
  server = instance;
  return instance;
}

/** Gắn một máy chủ Hocuspocus vào `upgrade` của HTTP server, chỉ nhận đúng WORK_COLLAB_PATH (test dùng lại). */
export function attachWorkCollab(httpServer: HttpServer, instance: Hocuspocus) {
  const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_DOCUMENT_BYTES });
  httpServer.on('upgrade', (request, socket, head) => {
    let pathname = '';
    try {
      pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
    } catch {
      return;
    }
    if (pathname !== WORK_COLLAB_PATH) return;
    wss.handleUpgrade(request, socket, head, (ws) => instance.handleConnection(ws, request));
  });
  wss.on('error', (error) => logger.error('Work docs collaboration WebSocket error', { error: error.message }));
  return wss;
}

let attached = false;
/** Gắn vào HTTP server sẵn có (index.ts). Idempotent. */
export async function initWorkDocsCollaborationGateway(httpServer: HttpServer) {
  if (attached) return;
  attached = true;
  const svc = await import('../services/work/collab.service.js');
  const instance = createWorkCollabServer({ authenticate: svc.authenticateCollabToken, recheck: svc.recheckCollab });
  attachWorkCollab(httpServer, instance);
  logger.info('Work docs collaboration gateway attached', { path: WORK_COLLAB_PATH });
}

/** Test: tháo máy chủ (để test sau không ghi qua Yjs). */
export function resetWorkCollabForTests() {
  server = null;
  hooks = null;
  pending.clear();
}
export { docJson as docJsonForTests } from '../services/work/collabDoc.js';
