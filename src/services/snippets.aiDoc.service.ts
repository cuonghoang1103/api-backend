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
import { sanitizeMermaid } from '../utils/mermaid.js';

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
    // Repair common AI mistakes (fences, glued diagrams, unquoted labels) so the
    // diagram renders instead of throwing a parse error in the viewer.
    const code = sanitizeMermaid(typeof o.code === 'string' ? o.code : '');
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

export function normalizeBlocks(raw: unknown): DocBlock[] {
  const arr = Array.isArray(raw) ? raw : [];
  const out: DocBlock[] = [];
  for (const b of arr.slice(0, 60)) {
    const nb = normalizeBlock(b);
    if (nb) out.push(nb);
  }
  return out;
}

// ── Depth measurement (drives the "regenerate if thin" gate) ──────
// A doc must read like a reference chapter, not a cheat-sheet. These thresholds
// are deliberately below the prompt's target (26-45 blocks) so a slightly-short
// but genuinely rich draft still passes, while the shallow ~16-block / ~2.5k-char
// cheat-sheets get a second, expanded pass.
export const DOC_MIN_BLOCKS = 22;
export const DOC_MIN_CODE = 4;
export const DOC_MIN_CHARS = 5000;

export interface DocDepth { blocks: number; chars: number; code: number; mermaid: number }

/** Measure a doc's depth: block count, approx content chars, code + diagram counts. */
export function docDepth(blocks: DocBlock[]): DocDepth {
  let chars = 0;
  let code = 0;
  let mermaid = 0;
  for (const b of blocks) {
    if (b.type === 'code') { code++; chars += b.code.length; }
    else if (b.type === 'mermaid') { mermaid++; chars += b.code.length; }
    else if (b.type === 'prose') chars += b.html.length;
    else if (b.type === 'heading') chars += b.text.length;
  }
  return { blocks: blocks.length, chars, code, mermaid };
}

/** True when a doc is too shallow to count as a professional reference. */
export function isThinDoc(blocks: DocBlock[]): boolean {
  const d = docDepth(blocks);
  return d.blocks < DOC_MIN_BLOCKS || d.code < DOC_MIN_CODE || d.chars < DOC_MIN_CHARS;
}

/** Rough total content size — used to keep the deeper of two generation drafts. */
function docWeight(blocks: DocBlock[]): number {
  const d = docDepth(blocks);
  return d.chars + d.blocks * 40 + d.code * 200 + d.mermaid * 200;
}

/**
 * Recover blocks from a TRUNCATED JSON response (comprehensive docs can exceed
 * the token budget mid-array). Walks the raw text, extracts every balanced
 * top-level `{...}` object inside the `"blocks":[ ... ]` array, and normalizes
 * whatever parsed — so a doc cut off at block 30/40 still yields 29 good blocks
 * instead of throwing. Mirrors salvageBlocks in codeLab.lesson.service.
 */
export function salvageBlocks(raw: string): DocBlock[] {
  const start = raw.indexOf('"blocks"');
  const arrStart = start >= 0 ? raw.indexOf('[', start) : raw.indexOf('[');
  if (arrStart < 0) return [];
  const objs: unknown[] = [];
  let depth = 0;
  let inStr = false;
  let esc = false;
  let objStart = -1;
  for (let i = arrStart + 1; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{') { if (depth === 0) objStart = i; depth++; continue; }
    if (ch === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        try { objs.push(JSON.parse(raw.slice(objStart, i + 1))); } catch { /* skip */ }
        objStart = -1;
      }
      continue;
    }
    if (ch === ']' && depth === 0) break; // end of blocks array
  }
  return normalizeBlocks(objs);
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
    `You are a senior software engineer and technical writer producing a COMPREHENSIVE, PROFESSIONAL, ` +
    `IN-DEPTH guide, in ENGLISH, for the technology/tool "${cat.name}".${groupNote} The reader wants to ` +
    `fully understand it AND use it end-to-end. Write a LONG, thorough, textbook-quality guide — detailed ` +
    `enough that a developer can learn it and become productive from this page alone. Be accurate and ` +
    `real; NEVER invent APIs, packages, commands, plans or URLs — omit anything you're unsure is real.\n\n` +
    `Structure it as MANY sections (each a "heading" block), adapted to what "${cat.name}" actually is. ` +
    `Cover, in a sensible order, all that apply:\n` +
    `1. Overview — what it is, why it matters, where it fits.\n` +
    `2. Key features / capabilities (<ul>).\n` +
    `3. What it's used for — concrete real-world use cases (<ul>).\n` +
    `4. Installation — REAL commands for EVERY common OS/method as "code" blocks (title per block: ` +
    `"macOS (Homebrew)", "Ubuntu (apt)", "Windows", "npm", "pip", "Docker"…).\n` +
    `5. Getting started — a step-by-step first run (setup → a first working example → how to verify it worked).\n` +
    `6. Core usage & common tasks — SEVERAL practical, annotated examples/recipes covering what people ` +
    `actually DO with it (not just one hello-world). Show real code/commands WITH expected output as ` +
    `inline comments.\n` +
    `7. Command / CLI reference — for anything with a CLI (git, docker, package managers, cloud/AI CLIs, ` +
    `dev tools): a THOROUGH list of the important commands/subcommands and what each does — the everyday ` +
    `workflow AND the useful extras. (e.g. git: clone/status/branch/checkout/merge/rebase/stash/log/diff/` +
    `reset/revert/remote/push/pull/PR; a CLI tool: install/login/auth, the main run command and its key ` +
    `flags, and any session/REPL commands with their purpose.)\n` +
    `8. Configuration — important settings / config files / env vars.\n` +
    `9. Plans, pricing & access — ONLY when it applies (a paid API with pay-as-you-go, subscription tiers ` +
    `like free / pro / higher tiers, or cloud pricing): explain how access and billing work and the ` +
    `practical differences between the tiers.\n` +
    `10. Advanced usage & best practices — real-world patterns, deeper features.\n` +
    `11. Tips, gotchas & troubleshooting — common mistakes and how to fix them.\n` +
    `12. Works well with — ecosystem it combines with, and why.\n` +
    `13. Resources & links — a "links" block with the REAL official homepage, docs, download, source repo ` +
    `and package registry when they exist ({label, url, note}).\n` +
    `Include 2-4 "mermaid" diagrams where a picture clarifies (architecture, workflow, request/response, flow).\n\n` +
    `Return ONLY a minified JSON object of this exact shape (no text outside the JSON):\n` +
    `{"blocks":[` +
    `{"type":"heading","text":string} | ` +
    `{"type":"prose","html":string} | ` +
    `{"type":"code","title":string,"language":string,"code":string} | ` +
    `{"type":"mermaid","code":string} | ` +
    `{"type":"links","items":[{"label":string,"url":string,"note":string}]}` +
    `]}\n` +
    `Rules: "prose".html uses ONLY <p><ul><ol><li><strong><em><code><a href>. Prefer a "links" block for ` +
    `external resources.\n` +
    `DEPTH IS MANDATORY — this must read like a real reference chapter, NOT a cheat-sheet. Hard minimums ` +
    `for EVERY doc: at least 26 blocks (aim 30-45); at least 6 "code" blocks with REAL, non-trivial, ` +
    `multi-line examples (installation per platform + SEVERAL usage recipes + a CLI reference where one ` +
    `exists) — never one-line snippets; at least 2 "mermaid" diagrams; and a final "links" block. Do NOT ` +
    `stop early, summarize, or thin out later sections. Inside JSON strings, escape every double-quote and ` +
    `newline correctly so the JSON parses.`;

  const user =
    `Write the complete, in-depth guide for "${cat.name}".${hint}${docsNote}\n` +
    `Be thorough: installation for common platforms, a getting-started walkthrough, several real usage ` +
    `recipes with output, a full command/CLI reference if it has one, plans/pricing if it applies, ` +
    `troubleshooting, and a Resources & links block.`;

  // Two attempts: if the first draft comes back thin (a common failure — the
  // model produces a short cheat-sheet instead of the full guide), retry ONCE
  // with an explicit expansion instruction and keep whichever draft is deeper.
  // Already-rich docs pass the gate on attempt 1, so no extra tokens are spent.
  let blocks: DocBlock[] = [];
  let model = 'generation';
  for (let attempt = 1; attempt <= 2; attempt++) {
    const content =
      attempt === 1
        ? user
        : `${user}\n\nYOUR PREVIOUS DRAFT WAS TOO SHORT. Produce the FULL comprehensive guide this time: ` +
          `at least 30 blocks, at least 6 substantial multi-line code examples (per-OS installation + ` +
          `multiple real usage recipes with output + a CLI/command reference), and at least 2 mermaid ` +
          `diagrams. Do not summarize or stop early — cover every applicable section in depth.`;
    let raw = '';
    try {
      const res = await llmComplete({
        step: 'generation',
        feature: 'exphub',
        system,
        messages: [{ role: 'user', content }],
        maxTokens: 16000,
        maxRetries: 1,
        timeoutMs: 200_000,
        userId,
      });
      raw = res.text;
      model = res.model || model;
    } catch {
      if (attempt === 1 && !blocks.length) throw new BadRequestError('Tạo tài liệu đang bận, vui lòng thử lại sau giây lát.');
      break; // a retry failure: keep the attempt-1 draft
    }

    const parsed = looseJson(raw) as { blocks?: unknown };
    let attemptBlocks = normalizeBlocks(parsed.blocks);
    // Comprehensive guides can overrun the token budget and truncate the JSON;
    // recover the balanced-brace objects rather than losing the whole doc.
    if (attemptBlocks.length < 6) {
      const salvaged = salvageBlocks(raw);
      if (salvaged.length > attemptBlocks.length) attemptBlocks = salvaged;
    }
    // Keep the deeper of the two drafts (by total content size).
    if (docWeight(attemptBlocks) > docWeight(blocks)) blocks = attemptBlocks;
    if (!isThinDoc(blocks)) break; // deep enough — don't spend a second call
  }

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
