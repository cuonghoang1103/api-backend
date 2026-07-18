/**
 * Code Lab — NTU-style LESSON generator (per module).
 *
 * Produces a comprehensive, textbook-chapter tutorial for a module — the way
 * NTU's programming notes read: motivation, each concept explained in prose,
 * annotated code with its OUTPUT, old-vs-new comparisons, edge cases and a
 * best-practices summary. Stored as the SAME DocBlock array Exp Hub docs use
 * ({type: heading|prose|code|mermaid|image|links}) so the frontend renders it
 * with the shared DocBlocksView, above the module's exercises.
 *
 * ADMIN/EDITOR-gated at the route layer. Reuses the interview LLM gateway
 * (step 'generation', feature 'exphub') + the DocBlock validation from
 * snippets.aiDoc.service — no new vendor/key.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { looseJson } from './myLanguage.ai.service.js';
import { normalizeBlocks, type DocBlock } from './snippets.aiDoc.service.js';

/**
 * Recover complete top-level block objects from a possibly-truncated JSON string
 * by BALANCED-BRACE counting (quote-agnostic, same trick as the My Language
 * generator). When a long lesson truncates mid-JSON, the valid prefix of blocks
 * still survives instead of the whole response being lost.
 */
function salvageBlocks(raw: string): unknown[] {
  const text = String(raw || '');
  const start = text.indexOf('"blocks"');
  const s = start >= 0 ? text.slice(start) : text;
  const objs: unknown[] = [];
  let depth = 0;
  let from = -1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '{') {
      if (depth === 0) from = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0 && from >= 0) {
        const o = looseJson(s.slice(from, i + 1));
        if (o && Object.keys(o).length) objs.push(o);
        from = -1;
      } else if (depth < 0) {
        depth = 0;
      }
    }
  }
  return objs;
}

async function loadModule(moduleId: number) {
  const mod = await prisma.codeModule.findUnique({
    where: { id: moduleId },
    include: { track: { include: { group: true } } },
  });
  if (!mod) throw new NotFoundError('Module not found.');
  return mod;
}

// ── Preview (no DB write) ─────────────────────────────────────────
export async function generateLesson(
  userId: number,
  body: { moduleId?: number | string },
): Promise<{ moduleId: number; moduleName: string; blocks: DocBlock[]; model: string }> {
  const moduleId = Number(body?.moduleId) || 0;
  if (!moduleId) throw new BadRequestError('A module is required.');
  if (!isAiAvailable()) throw new BadRequestError('AI is currently disabled. Please try again later.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Daily AI limit reached. Please try again tomorrow.');

  const mod = await loadModule(moduleId);
  const lang = mod.track.language;
  const ctx = mod.description ? `\nModule context: ${mod.description}` : '';

  const system =
    `You are a senior university programming instructor writing a COMPREHENSIVE, textbook-chapter ` +
    `TUTORIAL in ENGLISH — in the style of NTU's "programming notes" (ehchua). This is a LESSON to teach ` +
    `the module "${mod.name}" of the track "${mod.track.name}" (language/tech: ${lang}, group: ` +
    `"${mod.track.group.name}"). Write it long and thorough — a learner should be able to learn the topic ` +
    `from this page alone.\n\n` +
    `Cover the module in several sections (each introduced by a "heading" block). For each concept:\n` +
    `- Explain WHAT it is and WHY it matters (prose).\n` +
    `- Show ANNOTATED "code" blocks — real, correct ${lang} code, with the OUTPUT shown as inline comments ` +
    `(e.g. // => [1, 4, 9]). Prefer several small, focused examples over one big dump.\n` +
    `- Where useful, contrast the OLD vs NEW / wrong vs right approach.\n` +
    `- Call out common mistakes, edge cases and gotchas.\n` +
    `Open with a short "Introduction" (what you'll learn + prerequisites) and close with a ` +
    `"Best practices & summary" section. Add a "mermaid" block only if a small diagram genuinely helps, ` +
    `and a final "links" block with official docs / references.\n\n` +
    `NEVER invent APIs, packages, syntax or output that do not exist — code and output must be real.\n\n` +
    `Return ONLY a minified JSON object of this exact shape (no text outside the JSON):\n` +
    `{"blocks":[` +
    `{"type":"heading","text":string} | ` +
    `{"type":"prose","html":string} | ` +
    `{"type":"code","title":string,"language":string,"code":string} | ` +
    `{"type":"mermaid","code":string} | ` +
    `{"type":"links","items":[{"label":string,"url":string,"note":string}]}` +
    `]}\n` +
    `"prose".html uses ONLY <p><ul><ol><li><strong><em><code><a href>. Aim for a rich but focused ` +
    `chapter of roughly 12-18 blocks — thorough, but keep it complete rather than sprawling. Inside JSON ` +
    `strings, escape every double-quote and newline so the JSON parses.`;

  const user = `Write the full lesson for the module "${mod.name}" (${lang}).${ctx}`;

  let raw = '';
  let model = 'generation';
  try {
    const res = await llmComplete({
      step: 'generation',
      feature: 'exphub',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 12000,
      maxRetries: 1,
      timeoutMs: 200_000,
      userId,
    });
    raw = res.text;
    model = res.model || model;
  } catch {
    throw new BadRequestError('Lesson generation is busy, please try again shortly.');
  }

  const parsed = looseJson(raw) as { blocks?: unknown };
  let blocks = normalizeBlocks(parsed.blocks);
  // Salvage: if the whole-array parse failed (usually the tail truncated mid-JSON
  // on a long lesson), recover each complete top-level block object by balanced
  // brace counting so the valid prefix still survives.
  if (!blocks.length) blocks = normalizeBlocks(salvageBlocks(raw));
  if (!blocks.length) throw new BadRequestError('Lesson generation returned nothing, please retry.');

  return { moduleId: mod.id, moduleName: mod.name, blocks, model };
}

// ── Commit ────────────────────────────────────────────────────────
export async function commitLesson(
  _userId: number,
  body: { moduleId?: number | string; blocks?: unknown; model?: string },
): Promise<{ moduleId: number; blocks: number }> {
  const moduleId = Number(body?.moduleId) || 0;
  if (!moduleId) throw new BadRequestError('Missing module.');
  const blocks = normalizeBlocks(body?.blocks);
  if (!blocks.length) throw new BadRequestError('No lesson content to save.');

  const mod = await prisma.codeModule.findUnique({ where: { id: moduleId }, select: { id: true } });
  if (!mod) throw new NotFoundError('Module not found.');

  await prisma.codeModule.update({
    where: { id: moduleId },
    data: {
      lessonBlocks: blocks as unknown as Prisma.InputJsonValue,
      lessonModel: (typeof body?.model === 'string' && body.model.trim() ? body.model.trim() : 'ai').slice(0, 80),
      lessonGeneratedAt: new Date(),
    },
  });

  return { moduleId, blocks: blocks.length };
}

/** Public: full lesson for one module (empty block list when none). */
export async function getModuleLesson(moduleId: number) {
  const mod = await prisma.codeModule.findUnique({
    where: { id: moduleId },
    select: { id: true, name: true, lessonBlocks: true, lessonModel: true, lessonGeneratedAt: true },
  });
  if (!mod) throw new NotFoundError('Module not found.');
  return {
    id: mod.id,
    name: mod.name,
    blocks: Array.isArray(mod.lessonBlocks) ? mod.lessonBlocks : [],
    lessonGeneratedAt: mod.lessonGeneratedAt,
  };
}

/** Clear a module's lesson (admin). */
export async function clearLesson(moduleId: number): Promise<void> {
  const mod = await prisma.codeModule.findUnique({ where: { id: moduleId }, select: { id: true } });
  if (!mod) throw new NotFoundError('Module not found.');
  await prisma.codeModule.update({
    where: { id: moduleId },
    data: { lessonBlocks: Prisma.DbNull, lessonModel: null, lessonGeneratedAt: null },
  });
}
