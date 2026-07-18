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
export type DocBlock =
  | { type: 'heading'; text: string }
  | { type: 'prose'; html: string }
  | { type: 'code'; title?: string; language: string; code: string }
  | { type: 'mermaid'; code: string }
  | { type: 'image'; url: string; caption?: string };

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
    `You are a senior software engineer writing a CONCISE BUT COMPLETE reference page, in ENGLISH, ` +
    `for the technology/tool "${cat.name}".${groupNote} The reader is a developer who wants to understand ` +
    `what it is and get productive fast. Write accurate, real, up-to-date content — never invent APIs, ` +
    `packages, or commands that do not exist.\n\n` +
    `Structure the page as these sections, each introduced by a "heading" block:\n` +
    `1. Overview — what "${cat.name}" is, in 2-4 sentences.\n` +
    `2. What it's used for — the main use cases (a short <ul> list is good).\n` +
    `3. Installation & setup — the REAL install/setup commands. Put commands in "code" blocks with ` +
    `language "bash". Note OS/package-manager differences briefly when they matter.\n` +
    `4. Basic usage — a minimal, correct "hello world"-level code example in the most relevant language.\n` +
    `5. Works well with — technologies/libraries it commonly combines with, and why (prose).\n` +
    `Optionally add one "mermaid" block if a small architecture/flow diagram genuinely helps.\n\n` +
    `Return ONLY a minified JSON object of this exact shape (no text outside the JSON):\n` +
    `{"blocks":[{"type":"heading","text":string} | {"type":"prose","html":string} | ` +
    `{"type":"code","title":string,"language":string,"code":string} | {"type":"mermaid","code":string}]}\n` +
    `Rules: "prose".html uses ONLY simple tags <p><ul><ol><li><strong><em><code><a href>. Keep the whole ` +
    `doc focused (roughly 6-14 blocks). Inside JSON strings, escape every double-quote and newline correctly ` +
    `so the JSON parses.`;

  const user = `Write the reference doc for "${cat.name}".${hint}${docsNote}`;

  let raw = '';
  let model = 'generation';
  try {
    const res = await llmComplete({
      step: 'generation',
      feature: 'exphub',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 5000,
      maxRetries: 1,
      timeoutMs: 120_000,
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
