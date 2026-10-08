/**
 * CT Work — THƯ VIỆN MẪU TÀI LIỆU (đợt S2a).
 *
 * Nguồn: `content/quy-trinh/mau/*.md` + `catalog.json`. Đây là BẢN SAO của
 * `frontend/public/quy-trinh/mau/*.md` (trang /about/quy-trinh tải bản đó):
 * ảnh Docker backend chỉ chép `content/` (Dockerfile.backend, tầng runner),
 * KHÔNG có `frontend/public`. Test `docTemplates.test.ts` bắt hai nơi lệch nhau.
 *
 * Ánh xạ mẫu ↔ giai đoạn KHÔNG chép tay: đọc từ chính
 * `content/quy-trinh/client-project-template.json` (mục "Mẫu tài liệu" trong mô
 * tả epic của từng giai đoạn có link `/quy-trinh/mau/<key>.md`) — cùng file mà
 * phiếu khách → dự án CLIENT dùng để dựng giai đoạn.
 *
 * Đọc đĩa một lần rồi giữ trong bộ nhớ (36 tệp, ~400KB).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { markdownToTiptap, type PmNode } from './docMarkdown.js';

export const TEMPLATE_DIR = path.resolve(process.env.WORK_DOC_TEMPLATE_DIR || 'content/quy-trinh/mau');
const CLIENT_TEMPLATE_PATH = path.resolve(process.env.CLIENT_PROJECT_TEMPLATE_PATH || 'content/quy-trinh/client-project-template.json');

export interface TemplateStageRef { n: number; slug: string; title: string; titleEn: string }

export interface DocTemplateInfo {
  key: string;
  /** Tên tiếng Anh (giao diện CT Work là tiếng Anh). */
  title: string;
  titleVi: string;
  /** Giai đoạn của quy trình nhận dự án dùng mẫu này (theo thứ tự). */
  stages: TemplateStageRef[];
  /** Số đề mục (##, ###…) — cho thư viện mẫu hiện "12 sections". */
  sections: number;
  /** Đoạn mở đầu (dòng "Mục đích") — xem trước trong thư viện. */
  summary: string;
  /** CTW đợt 3A: nhóm trong thư viện ("FPT Capstone"); null = mẫu quy trình studio. */
  group: string | null;
}

export interface DocTemplate extends DocTemplateInfo {
  /** Tiêu đề trang tạo từ mẫu: mẫu FPT ⇒ "Report 2 – Project Management Plan" (đúng tên trên bìa bản gốc). */
  pageTitle: string;
  markdown: string;
  /** Nội dung TipTap, đã bỏ tiêu đề # đầu (trang có ô tiêu đề riêng). */
  doc: PmNode;
}

interface Catalog { templates: Array<{ key: string; titleVi: string; titleEn: string; group?: string }> }
interface ClientTpl { stages: Array<{ n: number; slug: string; title: string; titleEn?: string; epic?: { description?: string } }> }

let cache: Promise<Map<string, DocTemplate>> | null = null;

/** Khoá mẫu nhắc tới trong một đoạn mô tả (link …/quy-trinh/mau/<key>.md), theo thứ tự, không trùng. */
export function templateKeysIn(text: string | undefined | null): string[] {
  const out: string[] = [];
  for (const m of (text ?? '').matchAll(/quy-trinh\/mau\/([a-z0-9-]+)\.md/g)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Giai đoạn (slug) ⇒ các khoá mẫu, đọc từ client-project-template.json. Thiếu file ⇒ rỗng. */
export async function stageTemplateMap(): Promise<Map<string, { stage: TemplateStageRef; keys: string[] }>> {
  let raw: string;
  try {
    raw = await fs.readFile(CLIENT_TEMPLATE_PATH, 'utf8');
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return new Map();
    throw err;
  }
  const t = JSON.parse(raw) as ClientTpl;
  const out = new Map<string, { stage: TemplateStageRef; keys: string[] }>();
  for (const s of [...(t.stages ?? [])].sort((a, b) => a.n - b.n)) {
    out.set(s.slug, { stage: { n: s.n, slug: s.slug, title: s.title, titleEn: s.titleEn || s.title }, keys: templateKeysIn(s.epic?.description) });
  }
  return out;
}

function summaryOf(md: string): string {
  const m = /\*\*(?:Mục đích|Purpose):\*\*\s*([^\n]+)/i.exec(md);
  return (m?.[1] ?? '').replace(/\*\*/g, '').trim().slice(0, 300);
}

async function load(): Promise<Map<string, DocTemplate>> {
  const catalog = JSON.parse(await fs.readFile(path.join(TEMPLATE_DIR, 'catalog.json'), 'utf8')) as Catalog;
  const stageMap = await stageTemplateMap();
  const stagesOf = (key: string) => [...stageMap.values()].filter((v) => v.keys.includes(key)).map((v) => v.stage);
  const out = new Map<string, DocTemplate>();
  for (const c of catalog.templates) {
    const markdown = await fs.readFile(path.join(TEMPLATE_DIR, `${c.key}.md`), 'utf8');
    const { doc } = markdownToTiptap(markdown, { dropTitle: true });
    out.set(c.key, {
      key: c.key, title: c.titleEn, titleVi: c.titleVi, stages: stagesOf(c.key),
      sections: (markdown.match(/^#{2,6} /gm) ?? []).length,
      summary: summaryOf(markdown),
      group: c.group ?? null,
      pageTitle: c.titleEn.replace(/^FPT Capstone — /, '').replace(/^Report (\d)\.?: /, 'Report $1 – '),
      markdown, doc,
    });
  }
  return out;
}

export async function allTemplates(): Promise<Map<string, DocTemplate>> {
  if (!cache) cache = load().catch((err) => { cache = null; throw err; });
  return cache;
}

/** Danh sách cho thư viện mẫu (không kèm nội dung). */
export async function listTemplates(): Promise<DocTemplateInfo[]> {
  return [...(await allTemplates()).values()].map(({ markdown: _m, doc: _d, pageTitle: _p, ...info }) => info);
}

export async function getTemplate(key: string): Promise<DocTemplate> {
  const t = (await allTemplates()).get(key);
  if (!t) throw new NotFoundError('Template not found');
  return t;
}

/** Chỉ cho test: xoá bộ nhớ đệm. */
export function _resetTemplateCache(): void {
  cache = null;
}
