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
  if (!isAiAvailable('bulk_gen')) throw new BadRequestError('AI is currently disabled. Please try again later.');
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
    `ALWAYS open with a thorough "Introduction" section (heading "Introduction") — several paragraphs that ` +
    `orient the learner: what this topic is, why it matters, where it's used in the real world, what they ` +
    `will be able to do after, and the prerequisites. This on-ramp is required on EVERY lesson.\n` +
    `ILLUSTRATE like a textbook: include SEVERAL "mermaid" diagrams throughout (not just one) wherever a ` +
    `picture clarifies a concept — e.g. process/compilation flows, architecture/component diagrams, the ` +
    `request/response or data flow, control flow (loops and if/else as flowcharts), state machines, or how ` +
    `pieces relate. Aim for roughly 2-4 diagrams per lesson. Keep mermaid syntax simple and valid ` +
    `(graph TD / flowchart LR / sequenceDiagram). MERMAID LABEL RULES (critical — a broken diagram fails to ` +
    `render): every node label must be PLAIN TEXT — NO parentheses, quotes, square brackets, pipes, %, *, /, or ` +
    `code/array/object literals inside a label (write "array of 5 numbers", not "[1,2,3,4,5]"). One diagram per ` +
    `mermaid block; never append a stray trailing "end" or a "caption:" line.\n` +
    `Close with a "Best practices & summary" section and a final "links" block with official docs / references.\n\n` +
    `DEPTH REQUIREMENTS (a thin lesson is a FAILED lesson): cover EVERY major sub-topic of this module, each ` +
    `in its own section with explanation AND runnable annotated code. Include AT LEAST 8 annotated "code" ` +
    `blocks and AT LEAST 3 "mermaid" diagrams. For ADVANCED topics go deeper, not shorter — real-world usage, ` +
    `internals, trade-offs, performance and pitfalls. Do NOT skim or summarise; teach thoroughly.\n\n` +
    `NEVER invent APIs, packages, syntax or output that do not exist — code and output must be real.\n\n` +
    `Return ONLY a minified JSON object of this exact shape (no text outside the JSON):\n` +
    `{"blocks":[` +
    `{"type":"heading","text":string} | ` +
    `{"type":"prose","html":string} | ` +
    `{"type":"code","title":string,"language":string,"code":string} | ` +
    `{"type":"mermaid","code":string} | ` +
    `{"type":"links","items":[{"label":string,"url":string,"note":string}]}` +
    `]}\n` +
    `"prose".html uses ONLY <p><ul><ol><li><strong><em><code><a href>. Aim for a rich, complete chapter of ` +
    `roughly 28-45 blocks (thorough intro + several diagrams + many annotated examples). Inside JSON ` +
    `strings, escape every double-quote and newline so the JSON parses.`;

  const user = `Write the full lesson for the module "${mod.name}" (${lang}).${ctx}`;

  let model = 'generation';
  // One generation attempt → normalized (+salvage) blocks. Salvage: if the whole
  // array failed to parse (long lessons can truncate mid-JSON), recover each
  // complete top-level block object by balanced-brace counting.
  const runGen = async (nudge: string): Promise<DocBlock[]> => {
    let raw = '';
    const res = await llmComplete({
      step: 'generation', feature: 'bulk_gen', system,
      messages: [{ role: 'user', content: user + nudge }],
      maxTokens: 12000, maxRetries: 1, timeoutMs: 200_000, userId,
    });
    raw = res.text;
    model = res.model || model;
    const parsed = looseJson(raw) as { blocks?: unknown };
    let b = normalizeBlocks(parsed.blocks);
    if (!b.length) b = normalizeBlocks(salvageBlocks(raw));
    return b;
  };

  let blocks: DocBlock[];
  try {
    blocks = await runGen('');
  } catch {
    throw new BadRequestError('Lesson generation is busy, please try again shortly.');
  }

  // DEPTH GATE: a thin lesson is a defect. If shallow, try once more (deeper) and
  // keep whichever draft is richer.
  const codeCount = (bs: DocBlock[]) => bs.filter((b) => b.type === 'code').length;
  const charCount = (bs: DocBlock[]) => bs.reduce((n, b: any) => n + (b.html?.length || 0) + (b.code?.length || 0) + (b.text?.length || 0), 0);
  if (blocks.length < 22 || codeCount(blocks) < 6 || charCount(blocks) < 12000) {
    try {
      const deeper = await runGen('\n\nThe first draft was TOO SHALLOW and would be rejected. Produce a MUCH ' +
        'deeper, longer lesson: at least 30 blocks, at least 8 annotated code examples, at least 3 diagrams, ' +
        'covering EVERY sub-topic of the module thoroughly with real-world usage and pitfalls.');
      if (charCount(deeper) > charCount(blocks)) blocks = deeper;
    } catch { /* keep the first draft */ }
  }

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
