/**
 * CT Work — LIÊN KẾT SÂU trong câu trả lời của CuongMini (22/10/2026).
 *
 * Model KHÔNG được tự bịa URL. Nó viết tham chiếu, MÃ dựng link từ dữ liệu thật của dự án:
 *   • mã thẻ trần `KEY-12` (hoặc `[[issue:12]]`)          ⇒ [KEY-12](/work/<ws>/<KEY>/issue/12)     — thẻ phải tồn tại
 *   • `[[doc:3]]`                                          ⇒ [Docs #3 — tiêu đề](/work/<ws>/<KEY>/docs/3) — trang người hỏi xem được
 *   • `[[meeting:5]]`                                      ⇒ [Họp #5 — tiêu đề](…/meetings/5)
 *   • `[[unit:<id hàm>]]`                                   ⇒ [5.1 · Module.method](…/tests?tab=unit&fn=<id>)
 *   • `[[page:board|backlog|requirements|tests|…]]`        ⇒ trang mục của dự án (danh sách trắng)
 * Link Markdown model tự viết trỏ vào `/work/…` cũng được KIỂM: khác dự án, trang lạ, thẻ/trang/họp không tồn tại ⇒ bỏ
 * link, giữ chữ. Không đụng khối mã (``` … ``` và `…`). Link ngoài (https://…) giữ nguyên.
 * Giao diện (web lẫn app desktop) mở `/work/…` ngay trong app (`components/work/ai/links.ts`).
 */

import { prisma } from '../../config/database.js';
import { canViewPage, type ProjectAccess } from './permissions.js';

/** Trang mục của dự án được phép trỏ tới (thư mục `frontend/src/app/work/[ws]/[key]/*`). */
export const TRANG_MUC = new Set([
  'board', 'backlog', 'list', 'timeline', 'requirements', 'tests', 'docs', 'meetings', 'raid', 'diagrams', 'reports', 'releases',
  'resources', 'chat', 'team', 'spec', 'changes', 'approvals', 'retros', 'reviews', 'okrs', 'dashboards', 'assets', 'stages', 'submit',
  'wiegers', 'kb', 'code', 'school', 'poker', 'forms', 'present',
]);

export interface NguCanhLink { slug: string; key: string }
export interface DuLieuLink {
  issues: Set<number>;
  docs: Map<number, string>;
  meetings: Map<number, string>;
  units: Map<number, string>;
}
export interface ThamChieu { issues: number[]; docs: number[]; meetings: number[]; units: number[] }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const KHOI_MA = /```[\s\S]*?(?:```|$)|`[^`\n]+`/g;
const LINK_MD = /\[([^\]\n]{1,300})\]\(([^)\s]{1,500})\)/g;
const TOKEN = /\[\[(issue|doc|meeting|unit|page):([A-Za-z0-9_-]{1,40})\]\]/gi;

function reKey(key: string) {
  // Mã thẻ trần: không nằm sau "/" "#" "-" hay chữ (tránh /issue/KEY-1, ABCKEY-1).
  return new RegExp(`(?<![\\w/#-])${esc(key)}-(\\d{1,7})(?!\\d)`, 'g');
}

function base(c: NguCanhLink) { return `/work/${c.slug}/${c.key}`; }

/** Đường `/work/…` ⇒ loại tham chiếu (cùng dự án). null = khác dự án / không nhận ra. */
export function phanTichDuong(href: string, c: NguCanhLink): { loai: 'issue' | 'doc' | 'meeting' | 'unit' | 'page'; so?: number; trang?: string } | null {
  const m = /^\/work\/([^/?#]+)\/([^/?#]+)(\/[^?#]*)?(\?[^#]*)?(#.*)?$/.exec(href);
  if (!m) return null;
  if (decodeURIComponent(m[1]) !== c.slug || decodeURIComponent(m[2]).toUpperCase() !== c.key.toUpperCase()) return null;
  const parts = (m[3] ?? '').split('/').filter(Boolean);
  const q = new URLSearchParams(m[4]?.slice(1) ?? '');
  if (!parts.length) return { loai: 'page', trang: '' };
  const [a, b] = parts;
  const so = b && /^\d{1,7}$/.test(b) ? Number(b) : undefined;
  if (a === 'issue' && so) return { loai: 'issue', so };
  if (a === 'docs' && so) return { loai: 'doc', so };
  if (a === 'meetings' && so) return { loai: 'meeting', so };
  if (a === 'tests' && q.get('tab') === 'unit' && /^\d{1,9}$/.test(q.get('fn') ?? '')) return { loai: 'unit', so: Number(q.get('fn')) };
  if (parts.length === 1 && TRANG_MUC.has(a)) return { loai: 'page', trang: a };
  if (a === 'tests' && parts.length === 1) return { loai: 'page', trang: 'tests' };
  return null;
}

/** Chia chữ thành [phần thường, khối mã] xen kẽ — khối mã giữ nguyên. */
function tachMa(text: string): Array<{ ma: boolean; s: string }> {
  const out: Array<{ ma: boolean; s: string }> = [];
  let i = 0;
  for (const m of text.matchAll(KHOI_MA)) {
    if (m.index! > i) out.push({ ma: false, s: text.slice(i, m.index) });
    out.push({ ma: true, s: m[0] });
    i = m.index! + m[0].length;
  }
  if (i < text.length) out.push({ ma: false, s: text.slice(i) });
  return out;
}

/** THUẦN: các số thẻ / trang / họp / hàm cần tra để dựng link. */
export function thuThapThamChieu(text: string, c: NguCanhLink): ThamChieu {
  const t: ThamChieu = { issues: [], docs: [], meetings: [], units: [] };
  const add = (k: keyof ThamChieu, n: number) => { if (Number.isSafeInteger(n) && n > 0 && !t[k].includes(n) && t[k].length < 200) t[k].push(n); };
  for (const p of tachMa(text)) {
    if (p.ma) continue;
    for (const m of p.s.matchAll(LINK_MD)) {
      const d = phanTichDuong(m[2], c);
      if (d?.so) add(d.loai === 'issue' ? 'issues' : d.loai === 'doc' ? 'docs' : d.loai === 'meeting' ? 'meetings' : 'units', d.so);
      // Chữ của link (vd [KEY-1](/đường-bịa)): link bị bỏ thì mã thẻ trong chữ vẫn được dựng link THẬT.
      for (const k of m[1].matchAll(reKey(c.key))) add('issues', Number(k[1]));
    }
    for (const m of p.s.matchAll(TOKEN)) {
      const n = Number(m[2]);
      const loai = m[1].toLowerCase();
      if (loai === 'issue') add('issues', n); else if (loai === 'doc') add('docs', n); else if (loai === 'meeting') add('meetings', n); else if (loai === 'unit') add('units', n);
    }
    for (const m of p.s.replace(LINK_MD, '').matchAll(reKey(c.key))) add('issues', Number(m[1]));
  }
  return t;
}

/** THUẦN: dựng lại chữ với link đã kiểm. */
export function lienKetHoaThuan(text: string, c: NguCanhLink, d: DuLieuLink): string {
  const b = base(c);
  const nhan = (s: string) => s.replace(/[[\]]/g, '');
  const linkDoc = (n: number) => `[Docs #${n}${d.docs.get(n) ? ` — ${nhan(d.docs.get(n)!)}` : ''}](${b}/docs/${n})`;
  const linkHop = (n: number) => `[Họp #${n}${d.meetings.get(n) ? ` — ${nhan(d.meetings.get(n)!)}` : ''}](${b}/meetings/${n})`;
  const linkUnit = (n: number) => `[5.1 · ${nhan(d.units.get(n) ?? `#${n}`)}](${b}/tests?tab=unit&fn=${n})`;
  return tachMa(text).map((p) => {
    if (p.ma) return p.s;
    const giu: string[] = [];
    const cho = (s: string) => { giu.push(s); return `\u0000${giu.length - 1}\u0000`; };
    // 1. Link Markdown có sẵn.
    let s = p.s.replace(LINK_MD, (all, chu: string, href: string) => {
      if (!href.startsWith('/')) return cho(all); // link ngoài / neo — giữ nguyên
      const r = phanTichDuong(href, c);
      // Trang lạ / dự án khác / mục không tồn tại ⇒ bỏ link, giữ chữ — mã thẻ trong chữ vẫn được dựng link thật ở bước 3.
      if (!r) return chu;
      const ok = r.loai === 'page' ? true
        : r.loai === 'issue' ? d.issues.has(r.so!) : r.loai === 'doc' ? d.docs.has(r.so!) : r.loai === 'meeting' ? d.meetings.has(r.so!) : d.units.has(r.so!);
      return ok ? cho(`[${chu}](${href})`) : chu;
    });
    // 2. Token [[loai:x]].
    s = s.replace(TOKEN, (all, loaiRaw: string, arg: string) => {
      const loai = loaiRaw.toLowerCase();
      const n = Number(arg);
      if (loai === 'issue') return d.issues.has(n) ? cho(`[${c.key}-${n}](${b}/issue/${n})`) : `${c.key}-${arg}`;
      if (loai === 'doc') return d.docs.has(n) ? cho(linkDoc(n)) : `Docs #${arg}`;
      if (loai === 'meeting') return d.meetings.has(n) ? cho(linkHop(n)) : `họp #${arg}`;
      if (loai === 'unit') return d.units.has(n) ? cho(linkUnit(n)) : `hàm #${arg}`;
      const trang = arg.toLowerCase();
      return TRANG_MUC.has(trang) ? cho(`[${trang}](${b}/${trang})`) : arg;
    });
    // 3. Mã thẻ trần.
    s = s.replace(reKey(c.key), (all, so: string) => (d.issues.has(Number(so)) ? cho(`[${all}](${b}/issue/${Number(so)})`) : all));
    return s.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => giu[Number(i)]);
  }).join('');
}

/** Tra dữ liệu thật rồi dựng link (đúng quyền xem Docs của người hỏi). Lỗi tra ⇒ trả chữ gốc (không làm hỏng câu trả lời). */
export async function lienKetHoa(text: string, access: ProjectAccess, slug: string): Promise<string> {
  const c = { slug, key: access.key };
  const t = thuThapThamChieu(text, c);
  if (!t.issues.length && !t.docs.length && !t.meetings.length && !t.units.length && !/\[\[page:/i.test(text) && !text.includes('](/work/')) return text;
  try {
    const pid = access.projectId;
    const [issues, docs, meetings, units] = await Promise.all([
      t.issues.length ? prisma.workIssue.findMany({ where: { projectId: pid, number: { in: t.issues }, deletedAt: null }, select: { number: true } }) : [],
      t.docs.length ? prisma.workPage.findMany({ where: { projectId: pid, number: { in: t.docs }, deletedAt: null }, select: { number: true, title: true, visibility: true } }) : [],
      t.meetings.length ? prisma.workMeeting.findMany({ where: { projectId: pid, number: { in: t.meetings } }, select: { number: true, title: true } }) : [],
      t.units.length ? prisma.workUnitFunction.findMany({ where: { projectId: pid, id: { in: t.units } }, select: { id: true, moduleName: true, methodName: true } }) : [],
    ]);
    return lienKetHoaThuan(text, c, {
      issues: new Set(issues.map((i) => i.number)),
      docs: new Map(docs.filter((p) => canViewPage(access.role, access.workspaceRole, p.visibility)).map((p) => [p.number, p.title])),
      meetings: new Map(meetings.map((m) => [m.number, m.title])),
      units: new Map(units.map((u) => [u.id, `${u.moduleName}.${u.methodName}`])),
    });
  } catch {
    return text;
  }
}

/** Đoạn prompt dạy model cách viết tham chiếu + sơ đồ (thay cho việc tự ghép URL). */
export const LINK_VA_SO_DO_DOC = `LINKS — never write CT Work URLs yourself. Write references and the server turns them into real links (only if the item exists):
- an issue: just its key, e.g. KEY-12 (or [[issue:12]]);
- a Docs page: [[doc:3]]; a meeting: [[meeting:5]]; a Report 5.1 unit-test function: [[unit:<function id from fpt_unit_list/fpt_unit_get>]];
- a project section: [[page:board]] / [[page:backlog]] / [[page:requirements]] / [[page:tests]] / [[page:meetings]] / [[page:raid]] / [[page:diagrams]] / [[page:resources]].
External links (https://…) only when copied exactly from the data.
DIAGRAMS — when a picture explains better (flow, sequence, ERD, state, plan, dependencies), add ONE small Mermaid block (\`\`\`mermaid … \`\`\`, at most ~25 nodes; flowchart / sequenceDiagram / erDiagram / stateDiagram-v2 / gantt). Quote labels with spaces or Vietnamese: A["Đăng nhập"]. The panel renders it.`;
