/**
 * CT Work — RESOURCES (06/10/2026, mô-đun `resources`): LUẬT THUẦN, không chạm DB/mạng ⇒ test bằng bảng
 * (resourceRules.test.ts).
 *
 *   - normalizeUrl   : chỉ http / https / mailto, ≤ 2000 ký tự; "github.com/a/b" (thiếu scheme) ⇒ https://
 *   - detectKind     : github, gitlab, figma, gdrive, gdocs, youtube, notion, unity, freesound, mixamo, polyhaven… theo host
 *   - faviconFor     : URL favicon của Google (chỉ LƯU URL, không tải về)
 *   - githubRepoOf   : github.com/{owner}/{repo} ⇒ owner/repo (bỏ .git, bỏ đường dẫn hệ thống như /orgs, /settings)
 *   - parseImport    : danh sách Markdown (`## Nhóm` + `- [Tiêu đề](url) #tag`) hoặc CSV (`title, url, group, tags`)
 *   - extractPageInfo: <title> / OpenGraph từ HTML (cho nút "Add link" tự điền tiêu đề)
 *   - matchesQuery   : tìm BỎ DẤU tiếng Việt (foldVi — cùng hàm với ô tìm thẻ/trang)
 *   - blockedAddress : IP nội bộ/loopback/link-local/CGNAT/metadata ⇒ chặn (chống SSRF), kể cả IPv4 ánh xạ IPv6 dạng hex
 */

import { isIP } from 'node:net';
import { ipBiCam } from '../agent/webTool.js';
import { foldVi } from './fold.js';

export const RESOURCE_URL_MAX = 2000;
export const RESOURCE_TITLE_MAX = 200;
export const RESOURCE_TAGS_MAX = 20;
export const RESOURCE_TAG_LEN = 40;
/** Trần số dòng một lần nhập hàng loạt. */
export const IMPORT_MAX_ROWS = 500;

/** Nhóm mặc định khi dự án mở mô-đun lần đầu (sửa/xoá/đổi tên/kéo-thả được). */
export const DEFAULT_GROUPS: Array<{ name: string; icon: string; color: string }> = [
  { name: 'Source code', icon: '💻', color: '#2563eb' },
  { name: 'Docs', icon: '📄', color: '#0891b2' },
  { name: 'Design', icon: '🎨', color: '#db2777' },
  { name: 'Audio', icon: '🎧', color: '#7c3aed' },
  { name: '3D & Images', icon: '🧊', color: '#ea580c' },
  { name: 'References', icon: '📚', color: '#65a30d' },
  { name: 'Environments', icon: '🌐', color: '#0d9488' },
  { name: 'Meetings & calendars', icon: '📅', color: '#ca8a04' },
];

// ─── URL ─────────────────────────────────────────────────────────

/**
 * Chuẩn hoá URL người dán. Trả null nếu không hợp lệ / sai giao thức / quá dài.
 * Thiếu scheme mà trông như tên miền ("github.com/x/y", "www.figma.com/file/…") ⇒ thêm https://.
 */
export function normalizeUrl(raw: string): string | null {
  let s = String(raw ?? '').trim();
  if (!s) return null;
  // Dấu <> bao quanh kiểu Markdown autolink.
  if (s.startsWith('<') && s.endsWith('>')) s = s.slice(1, -1).trim();
  if (/^mailto:/i.test(s)) {
    const addr = s.slice(7).split('?')[0];
    if (!/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(decodeURIComponent(addr))) return null;
    return s.length <= RESOURCE_URL_MAX ? `mailto:${s.slice(7)}` : null;
  }
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) {
    if (!/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[/?#]|$)/i.test(s)) return null;
    s = `https://${s}`;
  }
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (!u.hostname) return null;
  // Không cho nhét tài khoản/mật khẩu vào link chia sẻ cho cả đội.
  if (u.username || u.password) return null;
  const out = u.toString();
  return out.length <= RESOURCE_URL_MAX ? out : null;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

const hostIs = (host: string, ...domains: string[]) => domains.some((d) => host === d || host.endsWith(`.${d}`));

/** Các loại tự nhận (frontend có biểu tượng cho từng loại). */
export const RESOURCE_KINDS = [
  'github', 'gitlab', 'bitbucket', 'figma', 'gdrive', 'gdocs', 'gsheets', 'gslides', 'youtube', 'notion', 'unity', 'freesound',
  'mixamo', 'polyhaven', 'sketchfab', 'onedrive', 'dropbox', 'trello', 'miro', 'canva', 'vercel', 'npm', 'stackoverflow',
  'meet', 'zoom', 'calendar', 'mail', 'link',
] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export function detectKind(url: string): ResourceKind {
  if (/^mailto:/i.test(url)) return 'mail';
  const h = hostOf(url);
  let path = '';
  try { path = new URL(url).pathname; } catch { /* để trống */ }
  if (hostIs(h, 'github.com', 'githubusercontent.com', 'github.io')) return 'github';
  if (hostIs(h, 'gitlab.com')) return 'gitlab';
  if (hostIs(h, 'bitbucket.org')) return 'bitbucket';
  if (hostIs(h, 'figma.com')) return 'figma';
  if (h === 'docs.google.com') {
    if (path.startsWith('/spreadsheets')) return 'gsheets';
    if (path.startsWith('/presentation')) return 'gslides';
    return 'gdocs';
  }
  if (h === 'calendar.google.com') return 'calendar';
  if (h === 'meet.google.com') return 'meet';
  if (hostIs(h, 'drive.google.com')) return 'gdrive';
  if (hostIs(h, 'youtube.com', 'youtu.be')) return 'youtube';
  if (hostIs(h, 'notion.so', 'notion.site')) return 'notion';
  if (hostIs(h, 'unity.com', 'unity3d.com')) return 'unity';
  if (hostIs(h, 'freesound.org')) return 'freesound';
  if (hostIs(h, 'mixamo.com')) return 'mixamo';
  if (hostIs(h, 'polyhaven.com')) return 'polyhaven';
  if (hostIs(h, 'sketchfab.com')) return 'sketchfab';
  if (hostIs(h, 'onedrive.live.com', '1drv.ms', 'sharepoint.com')) return 'onedrive';
  if (hostIs(h, 'dropbox.com')) return 'dropbox';
  if (hostIs(h, 'trello.com')) return 'trello';
  if (hostIs(h, 'miro.com')) return 'miro';
  if (hostIs(h, 'canva.com')) return 'canva';
  if (hostIs(h, 'vercel.app', 'vercel.com')) return 'vercel';
  if (hostIs(h, 'npmjs.com')) return 'npm';
  if (hostIs(h, 'stackoverflow.com')) return 'stackoverflow';
  if (hostIs(h, 'zoom.us')) return 'zoom';
  if (hostIs(h, 'meet.jit.si')) return 'meet';
  if (hostIs(h, 'outlook.office.com', 'outlook.live.com') && path.includes('calendar')) return 'calendar';
  return 'link';
}

/** Favicon (Google s2) — chỉ lưu URL, không tải về. mailto ⇒ null. */
export function faviconFor(url: string): string | null {
  if (!/^https?:/i.test(url)) return null;
  const h = hostOf(url);
  return h ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(h)}&sz=64` : null;
}

/** Đường dẫn cấp 1 của github.com KHÔNG phải tên chủ repo. */
const GITHUB_RESERVED = new Set([
  'orgs', 'settings', 'marketplace', 'explore', 'topics', 'trending', 'collections', 'sponsors', 'features', 'about', 'pricing',
  'login', 'join', 'notifications', 'new', 'search', 'pulls', 'issues', 'codespaces', 'enterprise', 'apps', 'site', 'contact', 'security',
]);

/** github.com/{owner}/{repo}[/…] ⇒ { owner, repo, canonical }. Không phải repo ⇒ null. */
export function githubRepoOf(url: string): { owner: string; repo: string; canonical: string } | null {
  let u: URL;
  try { u = new URL(url); } catch { return null; }
  const h = u.hostname.toLowerCase().replace(/^www\./, '');
  if (h !== 'github.com') return null;
  const [owner, rawRepo] = u.pathname.split('/').filter(Boolean);
  if (!owner || !rawRepo || GITHUB_RESERVED.has(owner.toLowerCase())) return null;
  const repo = rawRepo.replace(/\.git$/i, '');
  if (!/^[A-Za-z0-9-]{1,39}$/.test(owner) || !/^[A-Za-z0-9._-]{1,100}$/.test(repo)) return null;
  return { owner, repo, canonical: `https://github.com/${owner}/${repo}` };
}

/** Tiêu đề dự phòng khi không lấy được <title>: owner/repo cho GitHub, còn lại host + đoạn cuối đường dẫn. */
export function titleFromUrl(url: string): string {
  if (/^mailto:/i.test(url)) return url.slice(7).split('?')[0];
  const gh = githubRepoOf(url);
  if (gh) return `${gh.owner}/${gh.repo}`;
  try {
    const u = new URL(url);
    const last = decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() ?? '').replace(/[-_]+/g, ' ').trim();
    const host = u.hostname.replace(/^www\./, '');
    return (last && last.length <= 80 ? `${host} · ${last}` : host).slice(0, RESOURCE_TITLE_MAX);
  } catch {
    return url.slice(0, RESOURCE_TITLE_MAX);
  }
}

// ─── Nhúng / xem trước inline ────────────────────────────────────

export type EmbedAspect = '16:9' | '4:3' | 'auto';
export interface EmbedInfo { embeddable: boolean; embedUrl: string | null; aspect?: EmbedAspect }

const NO_EMBED: EmbedInfo = { embeddable: false, embedUrl: null };

/** id YouTube từ watch?v= / youtu.be/<id> / /embed/<id> / /shorts/<id> / /live/<id>. */
function youtubeId(u: URL): string | null {
  const h = u.hostname.toLowerCase().replace(/^www\./, '');
  let id: string | null = null;
  if (h === 'youtu.be') {
    id = u.pathname.split('/').filter(Boolean)[0] ?? null;
  } else if (h === 'youtube.com' || h.endsWith('.youtube.com')) {
    const v = u.searchParams.get('v');
    if (v) id = v;
    else {
      const p = u.pathname.split('/').filter(Boolean);
      if ((p[0] === 'embed' || p[0] === 'shorts' || p[0] === 'live') && p[1]) id = p[1];
    }
  }
  return id && /^[A-Za-z0-9_-]{5,20}$/.test(id) ? id : null;
}

/** id Google Drive từ /file/d/<id>/… hoặc ?id=<id> (open?id=, uc?id=). */
function gdriveId(u: URL): string | null {
  const m = /\/file\/d\/([A-Za-z0-9_-]+)/.exec(u.pathname) ?? /\/d\/([A-Za-z0-9_-]+)/.exec(u.pathname);
  const id = m?.[1] ?? u.searchParams.get('id');
  return id && /^[A-Za-z0-9_-]+$/.test(id) ? id : null;
}

/**
 * Link nhúng/xem-trước inline (iframe) cho một tài nguyên. THUẦN, không chạm mạng/DB. Chỉ sinh embedUrl cho các nhà
 * cung cấp cho phép nhúng; mọi thứ khác (github, notion riêng tư, mail, link chung) ⇒ không nhúng được.
 * Host đích luôn là tên miền công khai cố định (youtube-nocookie / figma / docs|drive.google / canva / vimeo / loom),
 * nhưng vẫn soi địa chỉ nguồn qua chốt chống SSRF — không bao giờ sinh embedUrl cho host nội bộ.
 */
export function embedInfoFor(kind: string, url: string): EmbedInfo {
  let u: URL;
  try { u = new URL(url); } catch { return NO_EMBED; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return NO_EMBED;
  const host = u.hostname.replace(/^\[|\]$/g, '');
  if (blockedHostname(host) || (isIP(host) && blockedAddress(host))) return NO_EMBED;
  const h = host.toLowerCase().replace(/^www\./, '');

  if (kind === 'youtube') {
    const id = youtubeId(u);
    return id ? { embeddable: true, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, aspect: '16:9' } : NO_EMBED;
  }
  if (kind === 'figma') {
    return { embeddable: true, embedUrl: `https://www.figma.com/embed?embed_host=ctwork&url=${encodeURIComponent(u.toString())}`, aspect: 'auto' };
  }
  if (kind === 'gdrive') {
    const id = gdriveId(u);
    return id ? { embeddable: true, embedUrl: `https://drive.google.com/file/d/${id}/preview`, aspect: 'auto' } : NO_EMBED;
  }
  if ((kind === 'gdocs' || kind === 'gsheets' || kind === 'gslides') && h === 'docs.google.com') {
    const base = u.pathname.replace(/\/(edit|view|htmlview|preview|comment)?\/?$/, '');
    return { embeddable: true, embedUrl: `https://docs.google.com${base}/preview`, aspect: 'auto' };
  }
  if (kind === 'canva') {
    const m = /\/design\/([A-Za-z0-9_-]+)/.exec(u.pathname);
    return m ? { embeddable: true, embedUrl: `https://www.canva.com/design/${m[1]}/view?embed`, aspect: '16:9' } : NO_EMBED;
  }
  // Vimeo / Loom KHÔNG phải loại riêng (detectKind ⇒ 'link'), nhận theo host.
  if (h === 'vimeo.com' || h === 'player.vimeo.com') {
    const m = /(\d{6,})/.exec(u.pathname);
    return m ? { embeddable: true, embedUrl: `https://player.vimeo.com/video/${m[1]}`, aspect: '16:9' } : NO_EMBED;
  }
  if (h === 'loom.com') {
    const p = u.pathname.split('/').filter(Boolean);
    const id = (p[0] === 'share' || p[0] === 'embed') ? p[1] : null;
    return id && /^[A-Za-z0-9]+$/.test(id) ? { embeddable: true, embedUrl: `https://www.loom.com/embed/${id}`, aspect: '16:9' } : NO_EMBED;
  }
  return NO_EMBED;
}

// ─── Nhãn ────────────────────────────────────────────────────────

/** Bỏ '#', cắt khoảng trắng, bỏ trùng (không phân biệt hoa thường), tối đa 20 nhãn × 40 ký tự. */
export function normTags(tags: unknown): string[] {
  const arr = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(/[;,|]/) : [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of arr) {
    const v = String(t ?? '').trim().replace(/^#+/, '').replace(/\s+/g, '-').slice(0, RESOURCE_TAG_LEN);
    if (!v) continue;
    const k = v.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
    if (out.length >= RESOURCE_TAGS_MAX) break;
  }
  return out;
}

// ─── Nhập hàng loạt ──────────────────────────────────────────────

export interface ImportRow { title: string | null; url: string; group: string | null; tags: string[]; description: string | null; line: number }
export interface ImportError { line: number; message: string }

/** Một dòng CSV ⇒ các ô (hỗ trợ "ô có, dấu phẩy" và "" thoát). */
export function splitCsvLine(line: string, sep = ','): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"' && !cur.trim()) { q = true; cur = ''; }
    else if (c === sep) { out.push(cur.trim()); cur = ''; }
    else cur += c;
  }
  out.push(cur.trim());
  return out;
}

/** Trông như CSV: dòng đầu có cột "url" (title, url, group, tags), hoặc mọi dòng có dấu phân cách và một ô là URL. */
export function looksLikeCsv(text: string): boolean {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return false;
  const first = lines[0].toLowerCase();
  if (/^[#*\-+]|^\d+[.)]\s/.test(lines[0])) return false;
  if (/(^|[,;\t])\s*"?url"?\s*([,;\t]|$)/.test(first)) return true;
  return lines.every((l) => /[,\t;]/.test(l) && /https?:\/\/|mailto:/i.test(l) && !/^\s*[-*+]\s/.test(l) && !/\]\(/.test(l));
}

const MD_LINK = /\[([^\]]{0,300})\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/;
const BARE_URL = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]|mailto:[^\s<>()]+)/i;

/** Tách "#tag" khỏi một đoạn chữ. */
function pullTags(text: string): { rest: string; tags: string[] } {
  const tags: string[] = [];
  const rest = text.replace(/(^|\s)#([\p{L}\p{N}_-]{1,40})/gu, (_m, sp: string, t: string) => { tags.push(t); return sp; });
  return { rest: rest.replace(/\s{2,}/g, ' ').trim(), tags };
}

function parseMarkdown(text: string): { rows: ImportRow[]; errors: ImportError[] } {
  const rows: ImportRow[] = [];
  const errors: ImportError[] = [];
  let group: string | null = null;
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    const n = idx + 1;
    if (!line) return;
    const h = /^#{1,6}\s+(.+?)\s*#*$/.exec(line);
    if (h) { group = h[1].replace(/\*\*|__/g, '').trim().slice(0, 80) || null; return; }
    // Dòng "**Nhóm**" hoặc "Nhóm:" đứng riêng (không có link) cũng là tiêu đề nhóm.
    const item = line.replace(/^(?:[-*+]|\d+[.)])\s+(?:\[[ xX]\]\s+)?/, '');
    const md = MD_LINK.exec(item);
    let url: string | null = null;
    let title: string | null = null;
    let rest = item;
    if (md) {
      url = md[2];
      title = md[1].replace(/[*_`]/g, '').trim() || null;
      rest = (item.slice(0, md.index) + ' ' + item.slice(md.index + md[0].length)).trim();
    } else {
      const b = BARE_URL.exec(item);
      if (!b) {
        const g = /^(?:\*\*|__)(.+?)(?:\*\*|__):?$/.exec(line) ?? /^([^:]{1,80}):$/.exec(line);
        if (g) { group = g[1].trim(); return; }
        errors.push({ line: n, message: 'No link found on this line' });
        return;
      }
      url = b[1];
      const before = item.slice(0, b.index).replace(/[:\-–—|]\s*$/, '').trim();
      rest = item.slice(b.index + b[0].length).trim();
      title = before.replace(/[*_`]/g, '').trim() || null;
    }
    const { rest: desc0, tags } = pullTags(rest);
    const desc = desc0.replace(/^[:\-–—|]\s*/, '').trim();
    const norm = normalizeUrl(url);
    if (!norm) { errors.push({ line: n, message: `Not a valid http(s) or mailto link: ${url.slice(0, 80)}` }); return; }
    rows.push({ title: title?.slice(0, RESOURCE_TITLE_MAX) ?? null, url: norm, group, tags: normTags(tags), description: desc ? desc.slice(0, 2000) : null, line: n });
  });
  return { rows, errors };
}

function parseCsv(text: string): { rows: ImportRow[]; errors: ImportError[] } {
  const rows: ImportRow[] = [];
  const errors: ImportError[] = [];
  const lines = text.split(/\r?\n/);
  const firstIdx = lines.findIndex((l) => l.trim());
  if (firstIdx < 0) return { rows, errors };
  const sep = lines[firstIdx].includes('\t') ? '\t' : (lines[firstIdx].split(';').length > lines[firstIdx].split(',').length ? ';' : ',');
  const head = splitCsvLine(lines[firstIdx], sep).map((c) => c.toLowerCase().replace(/^"|"$/g, ''));
  const hasHeader = head.includes('url');
  const col = (name: string, fallback: number) => (hasHeader ? head.indexOf(name) : fallback);
  const iTitle = col('title', 0), iUrl = col('url', 1), iGroup = col('group', 2), iTags = col('tags', 3), iDesc = col('description', 4);
  for (let i = hasHeader ? firstIdx + 1 : firstIdx; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const c = splitCsvLine(lines[i], sep);
    let urlCell = iUrl >= 0 ? c[iUrl] ?? '' : '';
    let titleCell = iTitle >= 0 ? c[iTitle] ?? '' : '';
    // Không có tiêu đề cột: chấp nhận "url" đứng một mình hoặc đổi chỗ title/url.
    if (!hasHeader && !normalizeUrl(urlCell) && normalizeUrl(titleCell)) [urlCell, titleCell] = [titleCell, urlCell];
    const norm = normalizeUrl(urlCell);
    if (!norm) { errors.push({ line: i + 1, message: urlCell ? `Not a valid http(s) or mailto link: ${urlCell.slice(0, 80)}` : 'The url column is empty' }); continue; }
    const tagCell = iTags >= 0 ? c[iTags] ?? '' : '';
    rows.push({
      title: titleCell.trim().slice(0, RESOURCE_TITLE_MAX) || null,
      url: norm,
      group: (iGroup >= 0 ? c[iGroup] ?? '' : '').trim().slice(0, 80) || null,
      tags: normTags(tagCell.split(/[;|,]|\s+/)),
      description: (iDesc >= 0 ? c[iDesc] ?? '' : '').trim().slice(0, 2000) || null,
      line: i + 1,
    });
  }
  return { rows, errors };
}

/** Markdown hoặc CSV (tự nhận nếu `format` = auto). Quá IMPORT_MAX_ROWS dòng ⇒ cắt + báo lỗi. */
export function parseImport(text: string, format: 'auto' | 'markdown' | 'csv' = 'auto'): { format: 'markdown' | 'csv'; rows: ImportRow[]; errors: ImportError[] } {
  const f = format === 'auto' ? (looksLikeCsv(text) ? 'csv' : 'markdown') : format;
  const r = f === 'csv' ? parseCsv(text) : parseMarkdown(text);
  if (r.rows.length > IMPORT_MAX_ROWS) {
    r.errors.push({ line: r.rows[IMPORT_MAX_ROWS].line, message: `Only the first ${IMPORT_MAX_ROWS} links are imported at once` });
    r.rows = r.rows.slice(0, IMPORT_MAX_ROWS);
  }
  return { format: f, ...r };
}

// ─── Tiêu đề trang (HTML) ────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => { const n = parseInt(h, 16); return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ''; })
    .replace(/&#(\d+);/g, (_m, d: string) => { const n = Number(d); return n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ''; })
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function metaContent(html: string, key: string): string | null {
  const re = new RegExp(`<meta\\b[^>]*(?:property|name)\\s*=\\s*["']${key}["'][^>]*>`, 'i');
  const tag = re.exec(html)?.[0];
  if (!tag) return null;
  const c = /content\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(tag);
  return c ? (c[1] ?? c[2] ?? null) : null;
}

/** <title> / og:title / og:description từ phần đầu một trang HTML. */
export function extractPageInfo(html: string): { title: string | null; description: string | null; siteName: string | null } {
  const clean = (v: string | null) => {
    if (!v) return null;
    const t = decodeEntities(v).replace(/\s+/g, ' ').trim();
    return t || null;
  };
  const og = clean(metaContent(html, 'og:title')) ?? clean(metaContent(html, 'twitter:title'));
  const tt = clean(/<title\b[^>]*>([\s\S]{0,1000}?)<\/title>/i.exec(html)?.[1] ?? null);
  const description = clean(metaContent(html, 'og:description')) ?? clean(metaContent(html, 'description'));
  return {
    title: (og ?? tt)?.slice(0, RESOURCE_TITLE_MAX) ?? null,
    description: description?.slice(0, 500) ?? null,
    siteName: clean(metaContent(html, 'og:site_name'))?.slice(0, 80) ?? null,
  };
}

// ─── Tìm (bỏ dấu) ────────────────────────────────────────────────

/** Mọi từ của câu tìm phải có trong tiêu đề/mô tả/url/nhãn/tên nhóm — so sau khi bỏ dấu tiếng Việt. */
export function matchesQuery(r: { title: string; description?: string | null; url: string; tags?: string[]; groupName?: string | null; kind?: string }, q: string): boolean {
  const words = foldVi(q).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = foldVi([r.title, r.description ?? '', r.url, ...(r.tags ?? []).map((t) => `#${t} ${t}`), r.groupName ?? '', r.kind ?? ''].join(' \n '));
  return words.every((w) => hay.includes(w));
}

// ─── Chống SSRF ──────────────────────────────────────────────────

/**
 * Địa chỉ IP thuộc dải KHÔNG được gọi (nội bộ, loopback, link-local + metadata đám mây, CGNAT, multicast).
 * Dùng `ipBiCam` của agent (một danh sách cho cả web) + vá đường vòng IPv4 ánh xạ IPv6 dạng HEX
 * (`[::ffff:7f00:1]` — WHATWG URL viết lại `::ffff:127.0.0.1` thành dạng này) và NAT64 (64:ff9b::/96).
 */
export function blockedAddress(ip: string): boolean {
  const s = ip.toLowerCase().replace(/^\[|\]$/g, '').split('%')[0];
  if (isIP(s) === 6) {
    const g = expandIpv6(s);
    if (!g) return true;
    const v4 = (hi: number, lo: number) => `${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`;
    const zeros = (n: number) => g.slice(0, n).every((x) => x === 0);
    // ::ffff:a.b.c.d (ánh xạ) · ::a.b.c.d (tương thích, cũ) · 64:ff9b::a.b.c.d (NAT64) ⇒ soi phần IPv4 bên trong.
    if (zeros(5) && g[5] === 0xffff) return ipBiCam(v4(g[6], g[7]));
    if (zeros(6) && (g[6] !== 0 || g[7] > 1)) return ipBiCam(v4(g[6], g[7]));
    if (g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((x) => x === 0)) return ipBiCam(v4(g[6], g[7]));
  }
  return ipBiCam(s);
}

/** "::ffff:7f00:1" ⇒ 8 nhóm số 16-bit (nhận cả đuôi IPv4 chấm). Sai dạng ⇒ null. */
export function expandIpv6(s: string): number[] | null {
  let str = s;
  const dotted = /(\d+\.\d+\.\d+\.\d+)$/.exec(str);
  if (dotted) {
    const p = dotted[1].split('.').map(Number);
    if (p.some((n) => n > 255)) return null;
    str = str.slice(0, dotted.index) + `${((p[0] << 8) | p[1]).toString(16)}:${((p[2] << 8) | p[3]).toString(16)}`;
  }
  const halves = str.split('::');
  if (halves.length > 2) return null;
  const part = (x: string) => (x ? x.split(':') : []);
  const head = part(halves[0]);
  const tail = halves.length === 2 ? part(halves[1]) : [];
  const fill = 8 - head.length - tail.length;
  if ((halves.length === 1 && fill !== 0) || fill < 0) return null;
  const all = [...head, ...Array(halves.length === 2 ? fill : 0).fill('0'), ...tail];
  if (all.length !== 8 || all.some((x) => !/^[0-9a-f]{1,4}$/.test(x))) return null;
  return all.map((x) => parseInt(x, 16));
}

/** Tên host luôn bị chặn trước cả khi phân giải (rẻ hơn, và rõ ràng trong thông báo lỗi). */
export function blockedHostname(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  return h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal') || h === 'metadata.google.internal';
}

// ─── Kiểm link ───────────────────────────────────────────────────

/**
 * Kết quả một lần kiểm ⇒ trạng thái. Chỉ 404/410 và tên miền không tồn tại mới là BROKEN; lỗi mạng tạm thời,
 * 5xx, 429 ⇒ UNKNOWN (không báo động oan). GitHub/GitLab trả 404 cho repo PRIVATE với người lạ ⇒ UNKNOWN.
 */
export function linkStatusFrom(result: { status?: number; error?: 'DNS' | 'TIMEOUT' | 'NETWORK' | 'BLOCKED' }, kind: string): 'OK' | 'BROKEN' | 'UNKNOWN' {
  if (result.error === 'DNS') return 'BROKEN';
  if (result.error) return 'UNKNOWN';
  const st = result.status ?? 0;
  if (st >= 200 && st < 400) return 'OK';
  if (st === 401 || st === 403) return 'OK'; // tồn tại, chỉ cần đăng nhập (Figma, Drive riêng tư…)
  if (st === 404 || st === 410) return kind === 'github' || kind === 'gitlab' || kind === 'bitbucket' ? 'UNKNOWN' : 'BROKEN';
  return 'UNKNOWN';
}
