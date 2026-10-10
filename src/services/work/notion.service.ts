/**
 * CT Work — CTW đợt 8b: NOTION ⇄ CT Work. Token của NGƯỜI dùng (kết nối OAuth "notion" — khung 8a, ctw8bProviders.ts);
 * chuyển block thuần ở notionBlocks.ts. Mọi lời gọi mạng đi qua `providerJson`/`oauthFetch` của 8a ⇒ test thay bằng
 * `_setOAuthFetchForTests` (KHÔNG bao giờ gọi Notion thật trong test — dây bẫy của 8a ném lỗi nếu quên).
 *
 *   search          — tìm trang / database người dùng đã chia sẻ cho integration.
 *   importPage      — trang Notion (kèm trang con, tuỳ chọn) ⇒ trang Docs (createPage: quyền sửa Docs của dự án). Ảnh do
 *                     Notion lưu ⇒ tải về kho ảnh của dự án (docs3a.uploadImage ⇒ lớp storage R2/sandbox); ảnh ngoài https
 *                     giữ link (Docs nhận ảnh https) — KHÔNG tải URL tuỳ ý về máy chủ (chống SSRF).
 *   exportPage      — trang Docs ⇒ trang Notion mới dưới trang cha người dùng chọn. Ảnh của dự án tải lên Notion bằng
 *                     File Upload API; hỏng ⇒ chữ thay thế + cảnh báo.
 *   database*       — database Notion ⇒ thẻ: xem schema + ghép thuộc tính ⇒ trường ⇒ xem trước ⇒ nhập. Dùng lại bộ nhập 7b
 *                     (importer.runImport, nguồn NOTION) ⇒ không trùng theo externalId (= id trang Notion của hàng).
 *
 * Agent: khung 8a chặn ở assertHuman + tuyến /notion nằm trong AGENT_DENIED_ROUTES.
 */

import { prisma } from '../../config/database.js';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { liveConnection, logOAuth, oauthFetch, providerJson, toUserError, providerClient, getProvider, type LiveConnection } from './oauth/index.js';
import { NOTION_API, NOTION_VERSION, registerCtw8bProviders } from './ctw8bProviders.js';
import {
  chunkBlocks, notionPageTitle, notionRowsToTable, notionToTiptap, suggestNotionMapping, tiptapToNotion,
  type NotionBlock, type NotionDbRow,
} from './notionBlocks.js';
import { DOC_IMAGE_SRC_RE } from './docMarkdown.js';
import { readImageBytes, uploadImage } from './docs3a.service.js';
import { createPage, getPage, updatePage } from './pages.service.js';
import { parseTable, type ColumnMapping } from './importParsers.js';
import { runImport } from './importer.service.js';
import { requireProject } from './permissions.js';

registerCtw8bProviders();

const MAX_BLOCKS = 3000;
const MAX_DEPTH = 8;
const MAX_CHILD_PAGES = 25;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_DB_ROWS = 2000;

const headers = (extra: Record<string, string> = {}) => ({ 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json', ...extra });
const nid = (s: string) => {
  // Nhận id dạng có/không gạch, hoặc URL Notion (lấy 32 hex cuối).
  const m = /([0-9a-f]{32})(?:\?|$)/i.exec(s.replace(/-/g, '')) ?? /([0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12})/i.exec(s);
  if (!m) throw new BadRequestError('Paste a Notion page link or id', 'NOTION_BAD_ID');
  const h = m[1].replace(/-/g, '').toLowerCase();
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

async function conn(userId: number): Promise<LiveConnection> {
  return liveConnection(userId, 'notion');
}

async function nGet<T>(c: LiveConnection, path: string): Promise<T> {
  try { return await providerJson<T>(c, `${NOTION_API}${path}`, { headers: headers() }); } catch (err) { throw toUserError(err, 'Notion'); }
}
async function nSend<T>(c: LiveConnection, method: 'POST' | 'PATCH', path: string, body: unknown): Promise<T> {
  try { return await providerJson<T>(c, `${NOTION_API}${path}`, { method, headers: headers(), body: JSON.stringify(body) }); } catch (err) { throw toUserError(err, 'Notion'); }
}

/** Trạng thái cho giao diện: máy chủ đã cấu hình chưa, người này đã kết nối chưa. */
export async function status(userId: number) {
  registerCtw8bProviders();
  const def = getProvider('notion')!;
  const c = await prisma.workOAuthConnection.findUnique({ where: { userId_provider: { userId, provider: 'notion' } }, select: { status: true, accountName: true, accountEmail: true } });
  return { configured: !!providerClient(def), connected: !!c && c.status === 'ACTIVE', account: c ? { name: c.accountName, email: c.accountEmail, status: c.status } : null };
}

// ─── Tìm ─────────────────────────────────────────────────────────

export async function search(userId: number, input: { query?: string; kind?: 'page' | 'database' }) {
  const c = await conn(userId);
  const r = await nSend<{ results: Array<Record<string, any>> }>(c, 'POST', '/search', {
    query: (input.query ?? '').slice(0, 200), page_size: 30,
    filter: { property: 'object', value: input.kind === 'database' ? 'database' : 'page' },
    sort: { direction: 'descending', timestamp: 'last_edited_time' },
  });
  return (r.results ?? []).map((x) => ({
    id: String(x.id), kind: x.object === 'database' ? 'database' : 'page',
    title: x.object === 'database' ? (x.title ?? []).map((t: { plain_text?: string }) => t.plain_text ?? '').join('') || 'Untitled' : notionPageTitle(x),
    url: typeof x.url === 'string' ? x.url : null, lastEdited: x.last_edited_time ?? null,
    icon: x.icon?.type === 'emoji' ? x.icon.emoji : null,
  }));
}

// ─── Kéo cây block ───────────────────────────────────────────────

async function children(c: LiveConnection, blockId: string, counter: { n: number }, depth = 0): Promise<NotionBlock[]> {
  const out: NotionBlock[] = [];
  let cursor: string | null = null;
  do {
    const r: { results: NotionBlock[]; has_more?: boolean; next_cursor?: string | null } = await nGet(c, `/blocks/${blockId}/children?page_size=100${cursor ? `&start_cursor=${encodeURIComponent(cursor)}` : ''}`);
    for (const b of r.results ?? []) {
      if (++counter.n > MAX_BLOCKS) throw new BadRequestError(`This Notion page is too large (over ${MAX_BLOCKS} blocks)`, 'NOTION_TOO_LARGE');
      // Trang con: KHÔNG kéo nội dung ở đây (nhập riêng nếu người dùng chọn).
      if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database' && depth < MAX_DEPTH) b.children = await children(c, String(b.id), counter, depth + 1);
      out.push(b);
    }
    cursor = r.has_more ? r.next_cursor ?? null : null;
  } while (cursor);
  return out;
}

/** Ảnh Notion tự lưu (URL ký S3 hạn 1 giờ) — chỉ tải từ máy chủ tệp của Notion, không URL tuỳ ý. */
const NOTION_FILE_HOSTS = [/\.amazonaws\.com$/i, /(^|\.)notion\.so$/i, /(^|\.)notion-static\.com$/i, /(^|\.)notionusercontent\.com$/i];
export function isNotionFileUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && NOTION_FILE_HOSTS.some((re) => re.test(u.hostname));
  } catch { return false; }
}

async function download(url: string): Promise<Buffer | null> {
  try {
    const res = await oauthFetch(url, { method: 'GET' });
    if (!res.ok) return null;
    const len = Number(res.headers.get('content-length') ?? 0);
    if (len > MAX_IMAGE_BYTES) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length > MAX_IMAGE_BYTES ? null : buf;
  } catch { return null; }
}

async function resolveImages(userId: number, projectId: number, blocks: NotionBlock[]): Promise<Map<NotionBlock, string>> {
  const out = new Map<NotionBlock, string>();
  const walk = async (list: NotionBlock[]) => {
    for (const b of list) {
      if (b.type === 'image') {
        const p = (b.image ?? {}) as Record<string, any>;
        if (p.type === 'external' && typeof p.external?.url === 'string' && /^https:\/\/[^\s"'<>]+$/i.test(p.external.url)) out.set(b, p.external.url.slice(0, 2000));
        else if (p.type === 'file' && typeof p.file?.url === 'string' && isNotionFileUrl(p.file.url)) {
          const buf = await download(p.file.url);
          if (buf) {
            try {
              const name = decodeURIComponent(new URL(p.file.url).pathname.split('/').pop() || 'notion-image').slice(0, 80);
              const up = await uploadImage(userId, projectId, buf, name);
              out.set(b, up.url);
            } catch (err) { logger.info('[work] notion: ảnh không nhận', { err: (err as Error).message }); }
          }
        }
      }
      if (b.children) await walk(b.children);
    }
  };
  await walk(blocks);
  return out;
}

// ─── Nhập trang ──────────────────────────────────────────────────

export interface ImportPageInput { pageId: string; includeChildren?: boolean; parentNumber?: number | null }

export async function importPage(userId: number, projectId: number, input: ImportPageInput) {
  await requireProject(userId, projectId, 'project.view');
  const c = await conn(userId);
  const warnings: string[] = [];
  const created: Array<{ number: number; title: string }> = [];
  const budget = { pages: 0 };

  const one = async (pageId: string, parentNumber: number | null, depth: number): Promise<{ number: number; title: string }> => {
    const page = await nGet<Record<string, any>>(c, `/pages/${pageId}`);
    const title = notionPageTitle(page as never).slice(0, 255);
    const blocks = await children(c, pageId, { n: 0 });
    // Tạo trang trước (để trang con có cha), ghi nội dung sau khi biết số của trang con.
    const shell = await createPage(userId, projectId, { title, parentNumber, contentJson: { type: 'doc', content: [{ type: 'paragraph' }] } });
    budget.pages += 1;
    const labels = new Map<string, string>();
    const first = notionToTiptap(blocks);
    if (input.includeChildren && depth < 3) {
      for (const cp of first.childPages) {
        if (budget.pages >= MAX_CHILD_PAGES) { warnings.push(`Stopped after ${MAX_CHILD_PAGES} pages — import the rest separately`); break; }
        try {
          const sub = await one(cp.id, shell.number, depth + 1);
          labels.set(cp.id, `DOC-${sub.number}`);
        } catch (err) {
          warnings.push(`Sub-page “${cp.title}” was skipped: ${(err as Error).message}`);
        }
      }
    }
    const images = await resolveImages(userId, projectId, blocks);
    const r = notionToTiptap(blocks, { imageSrc: (b) => images.get(b) ?? null, childPageLabel: (b) => labels.get(String(b.id)) ?? null });
    warnings.push(...r.warnings.map((w) => `${title}: ${w}`));
    await updatePage(userId, projectId, shell.number, { contentJson: r.doc, versionNote: 'Imported from Notion' });
    created.push({ number: shell.number, title });
    return { number: shell.number, title };
  };

  const root = await one(nid(input.pageId), input.parentNumber ?? null, 0);
  await logOAuth({ userId, provider: 'notion', kind: 'pull', entityType: 'page', entityId: root.number, projectId, summary: `Imported Notion page “${root.title}”${created.length > 1 ? ` with ${created.length - 1} sub-page(s)` : ''} into Docs` });
  return { page: root, pages: created.reverse(), warnings: [...new Set(warnings)].slice(0, 100) };
}

// ─── Xuất trang ──────────────────────────────────────────────────

/** Tải ảnh của dự án lên Notion (File Upload API) ⇒ id file_upload. */
async function uploadToNotion(c: LiveConnection, projectId: number, src: string): Promise<string | null> {
  const m = DOC_IMAGE_SRC_RE.exec(src);
  if (!m || Number(m[1]) !== projectId) return null;
  try {
    const img = await readImageBytes(projectId, Number(m[2]));
    const fu = await nSend<{ id: string; upload_url?: string }>(c, 'POST', '/file_uploads', { mode: 'single_part', filename: img.fileName, content_type: img.mime });
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(img.buffer)], { type: img.mime }), img.fileName);
    const res = await oauthFetch(fu.upload_url ?? `${NOTION_API}/file_uploads/${fu.id}/send`, {
      method: 'POST', headers: { Authorization: `Bearer ${c.accessToken}`, 'Notion-Version': NOTION_VERSION }, body: form,
    });
    return res.ok ? fu.id : null;
  } catch (err) {
    logger.info('[work] notion: tải ảnh lên lỗi', { err: (err as Error).message });
    return null;
  }
}

export async function exportPage(userId: number, projectId: number, pageNumber: number, input: { parentPageId: string }) {
  const page = await getPage(userId, projectId, pageNumber);
  const c = await conn(userId);
  const parent = nid(input.parentPageId);
  // Ảnh: tải lên trước, rồi chuyển đổi (bộ chuyển thuần nhận bảng src ⇒ id).
  const srcs = new Set<string>();
  const walk = (n: any) => { if (n?.type === 'image' && typeof n.attrs?.src === 'string') srcs.add(n.attrs.src); (n?.content ?? []).forEach(walk); };
  walk(page.contentJson);
  const uploaded = new Map<string, string | null>();
  for (const s of [...srcs].slice(0, 50)) uploaded.set(s, await uploadToNotion(c, projectId, s));
  const out = tiptapToNotion(page.contentJson, { imageUpload: (s) => uploaded.get(s) ?? null });
  const [first, ...rest] = chunkBlocks(out.blocks);
  const created = await nSend<{ id: string; url?: string }>(c, 'POST', '/pages', {
    parent: { page_id: parent },
    properties: { title: { title: [{ type: 'text', text: { content: page.title.slice(0, 2000) } }] } },
    children: first ?? [],
  });
  for (const chunk of rest) await nSend(c, 'PATCH', `/blocks/${created.id}/children`, { children: chunk });
  await logOAuth({ userId, provider: 'notion', kind: 'push', entityType: 'page', entityId: page.number, projectId, summary: `Exported DOC-${page.number} “${page.title}” to Notion` });
  return { notionPageId: created.id, url: created.url ?? null, blocks: out.blocks.length, warnings: out.warnings };
}

// ─── Database ⇒ thẻ ──────────────────────────────────────────────

async function loadDatabase(c: LiveConnection, dbId: string) {
  const db = await nGet<{ title?: Array<{ plain_text?: string }>; properties?: Record<string, { type: string; name?: string }> }>(c, `/databases/${dbId}`);
  const schema = Object.entries(db.properties ?? {}).map(([name, p]) => ({ name, type: p.type }));
  // Cột tiêu đề lên đầu (dễ ghép).
  schema.sort((a, b) => (a.type === 'title' ? -1 : b.type === 'title' ? 1 : 0));
  const rows: NotionDbRow[] = [];
  let cursor: string | null = null;
  do {
    const r: { results: NotionDbRow[]; has_more?: boolean; next_cursor?: string | null } = await nSend(c, 'POST', `/databases/${dbId}/query`, { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) });
    rows.push(...(r.results ?? []));
    if (rows.length > MAX_DB_ROWS) throw new BadRequestError(`This database has more than ${MAX_DB_ROWS} rows — filter it in Notion first`, 'NOTION_TOO_LARGE');
    cursor = r.has_more ? r.next_cursor ?? null : null;
  } while (cursor);
  return { title: (db.title ?? []).map((t) => t.plain_text ?? '').join('') || 'Untitled', schema, rows };
}

export interface DbImportInput {
  databaseId: string;
  mapping?: Record<string, number | null>;
  people?: Record<string, number | null>;
  statuses?: Record<string, number>;
  dryRun?: boolean;
}

export async function importDatabase(userId: number, projectId: number, input: DbImportInput) {
  const access = await requireProject(userId, projectId, 'project.settings');
  if (access.principal === 'AGENT') throw new AppError('Agents cannot run bulk imports', 403, 'FORBIDDEN');
  const c = await conn(userId);
  const dbId = nid(input.databaseId);
  const db = await loadDatabase(c, dbId);
  const table = notionRowsToTable(db.schema, db.rows);
  if (table.length < 2) throw new BadRequestError('The Notion database has no rows', 'WORK_IMPORT_EMPTY');
  const cols = db.schema.filter((s) => !['button', 'files', 'verification'].includes(s.type));
  const suggested = suggestNotionMapping(cols);
  const mapping = { ...suggested, ...(input.mapping ?? {}), externalId: 0 } as ColumnMapping;
  let parsed;
  try { parsed = parseTable(table, mapping); } catch (e) { throw new BadRequestError((e as Error).message, 'WORK_IMPORT_BAD_FILE'); }
  const out = await runImport(userId, projectId, {
    source: 'NOTION', fileName: `Notion: ${db.title}`.slice(0, 255), content: '-', encoding: 'text', dryRun: input.dryRun ?? true,
    people: input.people, statuses: input.statuses, mapping: mapping as never,
  }, { ...parsed, source: 'NOTION' });
  if (!(input.dryRun ?? true)) {
    await logOAuth({ userId, provider: 'notion', kind: 'pull', entityType: 'project', entityId: projectId, projectId, summary: `Imported the Notion database “${db.title}” as issues` });
  }
  return { database: { id: dbId, title: db.title, rows: db.rows.length, properties: cols }, ...out };
}
