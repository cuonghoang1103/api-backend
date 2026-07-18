/**
 * EXP_Hub — ADMIN AI reference-doc generator for a CATEGORY (technology).
 *
 * Writes a complete, full-ENGLISH reference doc for a technology
 * (Overview → What it's used for → Installation & setup → Basic usage →
 * Combines well with) as an ORDERED array of typed blocks, stored on
 * SnippetCategory.docBlocks. Same preview → commit flow as the My Language
 * admin generator (myLanguage.aiGen.service): `generateCategoryDoc` returns a
 * proposal WITHOUT touching the DB; `commitCategoryDoc` persists the (possibly
 * admin-edited) blocks.
 *
 * ADMIN/EDITOR-gated at the route layer — here we only check AI availability
 * and the shared per-user token quota. Reuses the interview LLM gateway
 * (step 'generation' = strongest model, feature 'exphub') — no new vendor/key.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { looseJson } from './myLanguage.ai.service.js';

// One doc = an ordered list of these blocks. `image` is supported by the
// renderer for manual additions; the AI never invents image URLs (they'd 404).
// `links` = a card row of resources (homepage / download / docs / repo).
export interface DocLinkItem { label: string; url: string; note?: string }
export type DocBlock =
  | { type: 'heading'; text: string }
  | { type: 'prose'; html: string }
  | { type: 'code'; title?: string; language: string; code: string }
  | { type: 'mermaid'; code: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'links'; items: DocLinkItem[] };

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

// Light server-side scrub of the most dangerous bits; the public renderer also
// runs sanitizeHtml (same as Snippet.noteContent), so this is defence-in-depth,
// not the only guard.
function scrubHtml(html: string): string {
  return html
    .replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*style[\s\S]*?<\s*\/\s*style\s*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*("|')?\s*javascript:[^"'>\s]*/gi, '$1="#"')
    .slice(0, 12_000);
}

/** Validate + normalize ONE block. Returns null to drop malformed blocks. */
function normalizeBlock(raw: unknown): DocBlock | null {
  const o = (raw ?? {}) as Record<string, unknown>;
  const type = str(o.type).toLowerCase();
  if (type === 'heading') {
    const text = str(o.text).slice(0, 200);
    return text ? { type: 'heading', text } : null;
  }
  if (type === 'prose') {
    // Accept either an `html` field or a plain `text` field (wrap the latter).
    let html = str(o.html);
    if (!html && str(o.text)) html = `<p>${str(o.text)}</p>`;
    html = scrubHtml(html);
    return html ? { type: 'prose', html } : null;
  }
  if (type === 'code') {
    const code = typeof o.code === 'string' ? o.code : '';
    if (!code.trim()) return null;
    const language = (str(o.language) || 'text').slice(0, 40);
    const title = str(o.title).slice(0, 120);
    const block: DocBlock = { type: 'code', language, code: code.slice(0, 12_000) };
    if (title) (block as { title?: string }).title = title;
    return block;
  }
  if (type === 'mermaid') {
    const code = typeof o.code === 'string' ? o.code : '';
    return code.trim() ? { type: 'mermaid', code: code.slice(0, 8_000) } : null;
  }
  if (type === 'image') {
    const url = str(o.url);
    // Only allow absolute http(s) or root-relative URLs (uploaded R2 assets).
    if (!/^(https?:\/\/|\/)/i.test(url)) return null;
    const caption = str(o.caption).slice(0, 300);
    const block: DocBlock = { type: 'image', url: url.slice(0, 2000) };
    if (caption) (block as { caption?: string }).caption = caption;
    return block;
  }
  if (type === 'links') {
    const rawItems = Array.isArray(o.items) ? o.items : [];
    const items: DocLinkItem[] = [];
    for (const it of rawItems.slice(0, 12)) {
      const io = (it ?? {}) as Record<string, unknown>;
      const url = str(io.url);
      // Resource links must be absolute http(s) — reject invented/relative junk.
      if (!/^https?:\/\//i.test(url)) continue;
      const label = (str(io.label) || url).slice(0, 120);
      const item: DocLinkItem = { label, url: url.slice(0, 2000) };
      const note = str(io.note).slice(0, 200);
      if (note) item.note = note;
      items.push(item);
    }
    return items.length ? { type: 'links', items } : null;
  }
  return null;
}

function normalizeBlocks(raw: unknown): DocBlock[] {
  const arr = Array.isArray(raw) ? raw : [];
  const out: DocBlock[] = [];
  for (const b of arr.slice(0, 60)) {
    const nb = normalizeBlock(b);
    if (nb) out.push(nb);
  }
  return out;
}

async function loadCategory(categoryId: number) {
  const cat = await prisma.snippetCategory.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true, slug: true, description: true, docsUrl: true, parentId: true, parent: { select: { name: true } } },
  });
  if (!cat) throw new NotFoundError('Không tìm thấy danh mục.');
  return cat;
}

// ── Preview (no DB writes) ────────────────────────────────────────
export async function generateCategoryDoc(
  userId: number,
  body: { categoryId?: number | string },
): Promise<{ categoryId: number; name: string; blocks: DocBlock[]; model: string }> {
  const categoryId = Number(body?.categoryId) || 0;
  if (!categoryId) throw new BadRequestError('Cần chọn danh mục (công nghệ).');
  if (!isAiAvailable()) throw new BadRequestError('AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.');

  const cat = await loadCategory(categoryId);
  const groupNote = cat.parent?.name ? ` It belongs to the "${cat.parent.name}" group.` : '';
  const hint = cat.description ? `\nExisting short intro (for tone/context, do not just repeat it): ${cat.description}` : '';
  const docsNote = cat.docsUrl ? `\nOfficial docs: ${cat.docsUrl}` : '';

  const system =
    `You are a senior software engineer and technical writer producing a COMPLETE, PROFESSIONAL ` +
    `reference page, in ENGLISH, for the technology/tool "${cat.name}".${groupNote} The reader is a ` +
    `developer who wants to understand it and get productive fast. Write accurate, real, up-to-date ` +
    `content. NEVER invent APIs, packages, commands, or URLs that do not exist — if you are not sure a ` +
    `URL is real, omit it.\n\n` +
    `Cover these sections, each introduced by a "heading" block (skip a section only if it truly does ` +
    `not apply). Be thorough and practical:\n` +
    `1. Overview — what "${cat.name}" is and why it matters (2-4 sentences).\n` +
    `2. Key features — the standout capabilities, as a <ul> list.\n` +
    `3. What it's used for — concrete real-world use cases (<ul>).\n` +
    `4. Installation — the REAL install commands as "code" blocks (language "bash"), with a "title" per ` +
    `block naming the method/OS (e.g. "macOS (Homebrew)", "Ubuntu/Debian (apt)", "Windows", "npm", "pip", ` +
    `"Docker"). Give every common path a developer would actually use.\n` +
    `5. Configuration & setup — first-time setup / a minimal config file or init command (prose + code).\n` +
    `6. Basic usage — a minimal, correct, runnable example ("code" in the most relevant language).\n` +
    `7. Common commands — a short cheatsheet of everyday terminal commands ("code", language "bash", ` +
    `with brief inline comments).\n` +
    `8. Works well with — technologies/libraries it commonly combines with, and why (prose).\n` +
    `9. Resources & links — a "links" block with the REAL official homepage, download page, ` +
    `documentation, source repository (GitHub/GitLab) and package registry (npm/PyPI/crates…) when they ` +
    `exist. Each item: {label, url, note}.\n` +
    `Optionally add one "mermaid" block if a small architecture/flow diagram genuinely helps understanding.\n\n` +
    `Return ONLY a minified JSON object of this exact shape (no text outside the JSON):\n` +
    `{"blocks":[` +
    `{"type":"heading","text":string} | ` +
    `{"type":"prose","html":string} | ` +
    `{"type":"code","title":string,"language":string,"code":string} | ` +
    `{"type":"mermaid","code":string} | ` +
    `{"type":"links","items":[{"label":string,"url":string,"note":string}]}` +
    `]}\n` +
    `Rules: "prose".html uses ONLY simple tags <p><ul><ol><li><strong><em><code><a href>. Prefer a ` +
    `"links" block for external resources rather than burying URLs in prose. Aim for a rich but focused ` +
    `doc (roughly 12-22 blocks). Inside JSON strings, escape every double-quote and newline correctly so ` +
    `the JSON parses.`;

  const user =
    `Write the complete reference doc for "${cat.name}".${hint}${docsNote}\n` +
    `Include real installation commands for the common platforms, a usage example, a commands cheatsheet, ` +
    `and a Resources & links block with the official site, docs and repository.`;

  let raw = '';
  let model = 'generation';
  try {
    const res = await llmComplete({
      step: 'generation',
      feature: 'exphub',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 8000,
      maxRetries: 1,
      timeoutMs: 150_000,
      userId,
    });
    raw = res.text;
    model = res.model || model;
  } catch {
    throw new BadRequestError('Tạo tài liệu đang bận, vui lòng thử lại sau giây lát.');
  }

  const parsed = looseJson(raw) as { blocks?: unknown };
  const blocks = normalizeBlocks(parsed.blocks);
  if (!blocks.length) throw new BadRequestError('Tạo tài liệu chưa ra kết quả, vui lòng thử lại.');

  return { categoryId: cat.id, name: cat.name, blocks, model };
}

// ── Commit (persist the reviewed blocks) ──────────────────────────
export async function commitCategoryDoc(
  _userId: number,
  body: { categoryId?: number | string; blocks?: unknown; model?: string; lang?: string },
): Promise<{ categoryId: number; blocks: number }> {
  const categoryId = Number(body?.categoryId) || 0;
  if (!categoryId) throw new BadRequestError('Thiếu danh mục.');
  const blocks = normalizeBlocks(body?.blocks);
  if (!blocks.length) throw new BadRequestError('Không có nội dung tài liệu để lưu.');

  const cat = await prisma.snippetCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!cat) throw new NotFoundError('Không tìm thấy danh mục.');

  await prisma.snippetCategory.update({
    where: { id: categoryId },
    data: {
      docBlocks: blocks as unknown as Prisma.InputJsonValue,
      docLang: (str(body?.lang) || 'EN').slice(0, 8),
      docModel: (str(body?.model) || 'ai').slice(0, 80),
      docGeneratedAt: new Date(),
    },
  });

  return { categoryId, blocks: blocks.length };
}

/** Clear a category's doc (admin "delete doc"). */
export async function clearCategoryDoc(categoryId: number): Promise<void> {
  const cat = await prisma.snippetCategory.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!cat) throw new NotFoundError('Không tìm thấy danh mục.');
  await prisma.snippetCategory.update({
    where: { id: categoryId },
    data: { docBlocks: Prisma.DbNull, docLang: null, docModel: null, docGeneratedAt: null },
  });
}
