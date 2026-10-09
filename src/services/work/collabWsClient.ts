/**
 * CTW K-3b — client Yjs TỐI GIẢN nói giao thức Hocuspocus v2 qua `ws` (không cần trình duyệt, không cần
 * @hocuspocus/provider vốn chỉ cài ở frontend). Dùng cho test DB (`work.ctwk3b.db.test.ts`) và phép đo tải
 * (`scripts/ctw-k3b-tai.mts`). Không dùng trong mã chạy thật.
 *
 * Khung tin: varString(tên tài liệu) · varUint(loại) · thân. Loại: 0 Sync · 1 Awareness · 2 Auth · 8 SyncStatus.
 */

import WebSocket from 'ws';
import * as Y from 'yjs';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';

export interface CollabTestClient {
  doc: Y.Doc;
  /** 'read-write' | 'readonly' khi đã xác thực */
  scope: Promise<string>;
  synced: Promise<void>;
  closed: Promise<{ code: number; reason: string }>;
  denied: string | null;
  close(): void;
  /** chờ tới khi điều kiện đúng (mặc định tối đa 5 giây) */
  until(cond: () => boolean, ms?: number): Promise<void>;
}

export function connectCollab(url: string, documentName: string, token: string, doc = new Y.Doc()): CollabTestClient {
  const ws = new WebSocket(url);
  ws.binaryType = 'arraybuffer';
  let resolveScope!: (s: string) => void;
  let rejectScope!: (e: Error) => void;
  let resolveSynced!: () => void;
  let resolveClosed!: (v: { code: number; reason: string }) => void;
  const scope = new Promise<string>((res, rej) => { resolveScope = res; rejectScope = rej; });
  const synced = new Promise<void>((res) => { resolveSynced = res; });
  const closed = new Promise<{ code: number; reason: string }>((res) => { resolveClosed = res; });
  scope.catch(() => {});
  const client: CollabTestClient = {
    doc, scope, synced, closed, denied: null,
    close: () => ws.close(),
    until: async (cond, ms = 5000) => {
      const t0 = Date.now();
      while (!cond()) {
        if (Date.now() - t0 > ms) throw new Error('timeout waiting for condition');
        await new Promise((r) => setTimeout(r, 20));
      }
    },
  };
  const send = (type: number, write: (e: encoding.Encoder) => void) => {
    const e = encoding.createEncoder();
    encoding.writeVarString(e, documentName);
    encoding.writeVarUint(e, type);
    write(e);
    if (ws.readyState === WebSocket.OPEN) ws.send(encoding.toUint8Array(e));
  };
  const onUpdate = (update: Uint8Array, origin: unknown) => {
    if (origin === 'remote') return;
    send(0, (e) => syncProtocol.writeUpdate(e, update));
  };
  ws.on('open', () => {
    send(2, (e) => { encoding.writeVarUint(e, 0); encoding.writeVarString(e, token); });
    send(0, (e) => syncProtocol.writeSyncStep1(e, doc));
  });
  ws.on('message', (data: ArrayBuffer) => {
    const d = decoding.createDecoder(new Uint8Array(data));
    decoding.readVarString(d);
    const type = decoding.readVarUint(d);
    if (type === 2) {
      const sub = decoding.readVarUint(d);
      const text = decoding.readVarString(d);
      if (sub === 2) resolveScope(text);
      else { client.denied = text; rejectScope(new Error(text)); }
      return;
    }
    if (type === 0 || type === 4) {
      const reply = encoding.createEncoder();
      encoding.writeVarString(reply, documentName);
      encoding.writeVarUint(reply, 0);
      const kind = syncProtocol.readSyncMessage(d, reply, doc, 'remote');
      if (encoding.length(reply) > documentName.length + 2 && kind === syncProtocol.messageYjsSyncStep1) ws.send(encoding.toUint8Array(reply));
      if (kind === syncProtocol.messageYjsSyncStep2) resolveSynced();
    }
  });
  ws.on('close', (code, reason) => {
    doc.off('update', onUpdate);
    rejectScope(new Error(`closed ${code}`));
    resolveClosed({ code, reason: reason.toString() });
  });
  ws.on('error', () => {});
  doc.on('update', onUpdate);
  return client;
}
