/**
 * CTW K-3b — luật THUẦN của đồng soạn thảo Docs (không DB, test được bằng `npm test`):
 *
 *   - `collabRoomMode`  ai vào phòng Yjs của một trang, sửa hay chỉ xem;
 *   - `mergeBlocks`     gộp ba chiều theo KHỐI cấp cao nhất khi một tác vụ máy chủ (Fill from project, Report 2–7,
 *                       Wiegers, Diagram fill, @latest…) ghi đè trang mà người khác đang gõ;
 *   - `blockAuthors`    tác giả theo đoạn rút từ chính cấu trúc Yjs (clientID của từng ký tự còn sống).
 */

import { createHash } from 'node:crypto';
import * as Y from 'yjs';
import { stableStringify } from './studio.js';

// ─── Quyền vào phòng ─────────────────────────────────────────────

export type CollabMode = 'edit' | 'read' | 'deny';

export interface CollabRoomInput {
  /** null = không vào được dự án (người ngoài) */
  role: string | null;
  principal: 'HUMAN' | 'AGENT';
  /** isClientScoped(access) — khách cổng bị cách ly */
  clientScoped: boolean;
  docsModule: boolean;
  /** docAccess(...) */
  view: 'ALL' | 'CLIENT' | null;
  edit: boolean;
  pageVisibility: string;
  pageStatus: string;
  pageDeleted: boolean;
  /** khoá chỉnh sửa cá nhân (editLock) của chính người này ở dự án */
  editLocked: boolean;
  /** công tắc dự án + trang */
  collabEnabled: boolean;
}

/**
 * Luật:
 *   - agent, người ngoài, mô-đun docs tắt, trang đã xoá, collab tắt ⇒ deny (agent ghi qua REST/registry, đi Yjs ở máy chủ);
 *   - không đọc được trang ⇒ deny (như 404 của REST);
 *   - khách cổng (CLIENT / GUEST bị cách ly) ⇒ deny: phòng phát con trỏ + TÊN người trong đội, mà cổng khách che tên
 *     người ngoài phạm vi (clientPeople.ts). Khách vẫn đọc trang CLIENT qua REST như cũ;
 *   - sửa được (MEMBER+/ADMIN), trang chưa ARCHIVED, không khoá chỉnh sửa ⇒ edit; còn lại (VIEWER, TEACHER…) ⇒ read.
 */
export function collabRoomMode(i: CollabRoomInput): { mode: CollabMode; reason: string } {
  if (i.principal === 'AGENT') return { mode: 'deny', reason: 'AI agents edit documents through the API, not the live editor' };
  if (!i.role) return { mode: 'deny', reason: 'Project not found' };
  if (!i.docsModule) return { mode: 'deny', reason: 'The docs module is turned off for this project' };
  if (i.pageDeleted) return { mode: 'deny', reason: 'Document not found' };
  if (i.view === null || (i.view === 'CLIENT' && i.pageVisibility !== 'CLIENT')) return { mode: 'deny', reason: 'Document not found' };
  // Người đọc bị giới hạn (khách cổng CLIENT, GUEST không phải giảng viên) đọc trang CLIENT qua REST như cũ.
  if (i.clientScoped || i.view === 'CLIENT') return { mode: 'deny', reason: 'Live editing is not available in the client portal' };
  if (!i.collabEnabled) return { mode: 'deny', reason: 'Live editing is turned off for this document' };
  if (!i.edit) return { mode: 'read', reason: 'You can read this document but not edit it' };
  if (i.pageStatus === 'ARCHIVED') return { mode: 'read', reason: 'This document is archived' };
  if (i.editLocked) return { mode: 'read', reason: 'Editing is locked for this project' };
  return { mode: 'edit', reason: '' };
}

/** Công tắc theo dự án: settings.collab.enabled (mặc định BẬT). */
export function projectCollabOn(settings: unknown): boolean {
  const c = settings && typeof settings === 'object' ? (settings as Record<string, unknown>).collab : null;
  if (!c || typeof c !== 'object') return true;
  return (c as Record<string, unknown>).enabled !== false;
}

// ─── Băm nội dung ────────────────────────────────────────────────

export function contentHashOf(doc: unknown): string {
  return createHash('sha256').update(stableStringify(doc ?? null)).digest('hex');
}

// ─── Gộp ba chiều theo khối ──────────────────────────────────────

export interface PmJson { type?: string; content?: PmJson[]; [k: string]: unknown }

const EMPTY_DOC: PmJson = { type: 'doc', content: [{ type: 'paragraph' }] };

function blocksOf(d: unknown): PmJson[] {
  const doc = d as PmJson | null;
  return Array.isArray(doc?.content) ? doc!.content : [];
}

/** Cặp chỉ số trùng nhau (LCS) giữa hai dãy khoá. O(n·m) — trang Docs vài trăm khối là cùng. */
function lcsPairs(a: string[], b: string[]): Array<[number, number]> {
  const n = a.length;
  const m = b.length;
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: Array<[number, number]> = [];
  for (let i = 0, j = 0; i < n && j < m;) {
    if (a[i] === b[j]) { out.push([i, j]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  return out;
}

export interface MergeResult {
  doc: PmJson;
  /** số đoạn thay đổi (thay/chèn/xoá) đã áp sạch */
  applied: number;
  /** số đoạn đụng chỗ người khác vừa sửa ⇒ GIỮ bản của họ và chèn bản mới ngay sau (không mất chữ của ai) */
  conflicts: number;
}

/**
 * Gộp ba chiều theo khối cấp cao nhất: `base` = nội dung tác vụ máy chủ đã đọc, `next` = nội dung nó muốn ghi,
 * `live` = nội dung đang có trong phòng Yjs (có thể đã có chữ người khác gõ sau khi base được đọc).
 *
 * Mỗi đoạn thay đổi base→next được áp lên live NẾU vùng tương ứng trong live còn nguyên như base; nếu không (có người
 * vừa sửa đúng chỗ đó) thì giữ bản của người đó và chèn các khối mới ngay sau — "đi qua Yjs, không ghi đè".
 */
export function mergeBlocks(base: unknown, live: unknown, next: unknown): MergeResult {
  const B = blocksOf(base);
  const L = blocksOf(live);
  const N = blocksOf(next);
  const kb = B.map(stableStringify);
  const kl = L.map(stableStringify);
  const kn = N.map(stableStringify);
  const wrap = (content: PmJson[]): PmJson => ({ ...(next as PmJson ?? EMPTY_DOC), type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] });
  if (kb.join('\u0000') === kl.join('\u0000')) {
    return { doc: wrap(N), applied: kb.join('\u0000') === kn.join('\u0000') ? 0 : 1, conflicts: 0 };
  }
  // base ↔ live: khối nào của base còn nguyên trong live, ở đâu.
  const b2l = new Map<number, number>();
  for (const [i, j] of lcsPairs(kb, kl)) b2l.set(i, j);
  // base → next: các đoạn thay đổi giữa hai mốc trùng.
  const bn = lcsPairs(kb, kn);
  type Hunk = { bs: number; be: number; ns: number; ne: number };
  const hunks: Hunk[] = [];
  let pb = 0;
  let pn = 0;
  for (const [i, j] of [...bn, [kb.length, kn.length] as [number, number]]) {
    if (i > pb || j > pn) hunks.push({ bs: pb, be: i, ns: pn, ne: j });
    pb = i + 1;
    pn = j + 1;
  }
  // Áp từ cuối lên đầu để chỉ số của live không lệch.
  const out = [...L];
  const outKeys = [...kl];
  let applied = 0;
  let conflicts = 0;
  for (const h of hunks.reverse()) {
    const fresh = N.slice(h.ns, h.ne);
    // Vị trí trong live: các khối base bị thay còn NGUYÊN và liền nhau trong live ⇒ thay đúng chỗ đó. Chèn thuần ⇒ ngay
    // sau mốc trước (bs-1), không có thì ngay trước mốc sau (be).
    const prev = h.bs > 0 ? b2l.get(h.bs - 1) : -1;
    const nextAnchor = h.be < B.length ? b2l.get(h.be) : L.length;
    const removed = Array.from({ length: h.be - h.bs }, (_, k) => b2l.get(h.bs + k));
    if (!removed.length) {
      const at = prev !== undefined ? prev + 1 : nextAnchor ?? out.length;
      out.splice(at, 0, ...fresh);
      outKeys.splice(at, 0, ...fresh.map(stableStringify));
      applied++;
      continue;
    }
    const first = removed[0];
    if (first !== undefined && removed.every((x, k) => x === first + k)) {
      out.splice(first, removed.length, ...fresh);
      outKeys.splice(first, removed.length, ...fresh.map(stableStringify));
      applied++;
      continue;
    }
    // Đụng chỗ người khác vừa sửa: khối họ đã sửa GIỮ NGUYÊN; khối base còn nguyên trong vùng đó thì thay như dự định;
    // khối mới chèn vào chỗ khối nguyên đầu tiên (hoặc ngay sau vùng). Không xoá chữ của ai.
    conflicts++;
    const mapped = removed.filter((x): x is number => x !== undefined).sort((a, b) => b - a);
    for (const x of mapped) { out.splice(x, 1); outKeys.splice(x, 1); }
    const add = fresh.filter((n) => !outKeys.includes(stableStringify(n)));
    if (!add.length) continue;
    const at = mapped.length ? Math.min(...mapped) : nextAnchor ?? (prev !== undefined ? prev + 1 : out.length);
    out.splice(at, 0, ...add);
    outKeys.splice(at, 0, ...add.map(stableStringify));
  }
  return { doc: wrap(out), applied, conflicts };
}

// ─── Tác giả theo đoạn ───────────────────────────────────────────

export interface BlockAuthor { index: number; type: string; preview: string; chars: Record<string, number> }

/** Đếm số ký tự CÒN SỐNG theo clientID Yjs trong từng khối cấp cao nhất của `fragment`. */
export function blockAuthors(fragment: Y.XmlFragment): BlockAuthor[] {
  const out: BlockAuthor[] = [];
  fragment.toArray().forEach((node, index) => {
    const chars: Record<string, number> = {};
    const text: string[] = [];
    const add = (client: number, n: number) => { chars[client] = (chars[client] ?? 0) + n; };
    const walk = (n: Y.XmlElement | Y.XmlText | Y.XmlHook) => {
      if (n instanceof Y.XmlText) {
        let item = (n as unknown as { _start: Y.Item | null })._start;
        while (item) {
          if (!item.deleted && item.content instanceof Y.ContentString) {
            add(item.id.client, item.length);
            if (text.join('').length < 120) text.push(item.content.str);
          }
          item = item.right as Y.Item | null;
        }
        return;
      }
      if (n instanceof Y.XmlElement) {
        const kids = n.toArray();
        // Khối không chữ (ảnh, sơ đồ nhúng, đường kẻ) ⇒ tác giả = người tạo khối.
        if (!kids.length && n._item) add(n._item.id.client, 1);
        kids.forEach((k) => walk(k as Y.XmlElement | Y.XmlText));
      }
    };
    walk(node as Y.XmlElement | Y.XmlText);
    out.push({ index, type: node instanceof Y.XmlElement ? node.nodeName : 'text', preview: text.join('').replace(/\s+/g, ' ').trim().slice(0, 100), chars });
  });
  return out;
}

/** clientID trong một bản cập nhật Yjs (để gán cho đúng NGƯỜI của kết nối đã gửi nó). */
export function clientIdsOfUpdate(update: Uint8Array): number[] {
  try {
    const { structs } = Y.decodeUpdate(update);
    return [...new Set(structs.map((s) => s.id.client))];
  } catch {
    return [];
  }
}
