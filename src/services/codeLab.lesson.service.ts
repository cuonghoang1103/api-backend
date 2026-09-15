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
import { QUY_TAC_LOI } from './labRoom/quyTacThay.js';
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
  // Bài GIẢNG của track lab211 đứng trên luật của thầy. Module 847 từng dạy
  // `entity/bo/ui` và "controller được đọc bàn phím" đúng vì prompt này không
  // biết luật — viết lại bằng tay xong thì phải chặn đường quay lại.
  const luatLab211 = /^lab211$/i.test(mod.track.slug || '') ? QUY_TAC_LOI + '\n\n' : '';

  const system =
    luatLab211 +
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

// ─── Hỏi AI về chính bài giảng đang đọc ─────────────────────────

const MAX_CAU_HOI = 1200;
const MAX_LICH_SU = 10;
/** Trần chữ của bài giảng nhét vào ngữ cảnh. Module 847 có 272 khối — nhét
 *  hết là vài trăm nghìn ký tự, vượt cửa sổ và tốn tiền vô ích. */
const MAX_BAI_GIANG = 26_000;

/** Bóc bài giảng thành chữ thuần để làm ngữ cảnh, giữ nguyên thứ tự mục.
 *  Export để kiểm được: phép cắt này hỏng thì AI trả lời lạc đề, không ai thấy. */
export function chuCuaBaiGiang(blocks: unknown, moc?: string): string {
  const ds = Array.isArray(blocks) ? (blocks as Array<Record<string, unknown>>) : [];
  const dong: string[] = [];
  for (const b of ds) {
    const loai = String(b?.type || '');
    if (loai === 'heading' || loai === 'part') dong.push(`\n## ${String(b.text || '')}`);
    else if (loai === 'prose') dong.push(plainText(String(b.html || '')));
    else if (loai === 'code') dong.push('```' + String(b.language || '') + '\n' + String(b.code || '').slice(0, 2_000) + '\n```');
    else if (loai === 'mermaid') dong.push('```mermaid\n' + String(b.code || '').slice(0, 800) + '\n```');
  }
  const tatCa = dong.join('\n');
  if (tatCa.length <= MAX_BAI_GIANG) return tatCa;
  // Người học hỏi về MỘT mục. Cắt quanh mục đó thay vì cắt từ đầu bài — cắt từ
  // đầu là luôn mất phần cuối, mà phần cuối mới là chỗ khó nên mới bị hỏi.
  const i = moc ? tatCa.toLowerCase().indexOf(moc.toLowerCase().slice(0, 60)) : -1;
  if (i < 0) return tatCa.slice(0, MAX_BAI_GIANG);
  const dau = Math.max(0, i - Math.floor(MAX_BAI_GIANG / 3));
  return tatCa.slice(dau, dau + MAX_BAI_GIANG);
}

function plainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|tr|pre)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    // Thẻ đóng biến thành dấu cách, nên `<strong>JavaBean</strong>.` ra
    // "JavaBean ." — dán lại cho câu đọc như câu, vì đây là chữ model đọc.
    .replace(/ +([.,;:!?)\]])/g, '$1')
    .replace(/([([]) +/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const NHIEM_VU_HOI = `YOUR TASK NOW: a student is reading ONE lesson of this course and does not
understand part of it. You answer about THAT lesson.

* Answer in VIETNAMESE. Keep every identifier, keyword, message string, file path and
  package name in English exactly as the lesson writes it.
* Ground every answer in the LESSON TEXT you were given. Quote its own wording when you
  explain — the student is looking at that page, so an answer that uses different words
  for the same thing makes them think there are two rules.
* If the lesson does not cover what they asked, say so in one sentence, then answer from
  the course rules — and say which part of the lesson they should read instead.
* Be concrete and short: 3-8 sentences, or a small list. This is a question asked while
  reading, not a second lecture.
* Use Markdown, and LABEL EVERY FENCE: \`\`\`java for code, \`\`\`text for a file tree or a
  console transcript. An unlabelled fence renders inline and every newline collapses.
* End with one sentence the student could SAY to the lecturer if asked about this.`;

/**
 * Trợ giảng của MỘT bài giảng: hỏi gì đáp nấy, nhưng chỉ trong phạm vi bài đó.
 *
 * Vì sao không dùng chung gia sư khoá học: gia sư khoá học đứng trên nội dung
 * Academy, còn bài giảng Code Lab là văn bản khác, và với track lab211 nó phải
 * đứng trên luật của thầy — trả lời "để trong class Manager" là dạy đúng thứ
 * làm người học bị trả bài.
 */
export async function hoiBaiGiang(
  moduleId: number,
  opts: { userId: number; question: string; muc?: string; history?: Array<{ role: 'user' | 'assistant'; content: string }> },
): Promise<{ answer: string }> {
  const cauHoi = (opts.question || '').trim();
  if (!cauHoi) throw new BadRequestError('Bạn chưa nhập câu hỏi.');
  if (cauHoi.length > MAX_CAU_HOI) throw new BadRequestError('Câu hỏi dài quá, rút gọn giúp mình.');
  if (!isAiAvailable('codelab')) throw new BadRequestError('AI đang không sẵn sàng. Thử lại sau chút nhé.');
  if (!(await checkTokenQuota(opts.userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI của hôm nay.');

  const mod = await loadModule(moduleId);
  const than = chuCuaBaiGiang(mod.lessonBlocks, opts.muc);
  if (!than.trim()) throw new BadRequestError('Mục này chưa có bài giảng để hỏi.');

  const laLab211 = /^lab211$/i.test(mod.track.slug || '');
  const system = (laLab211 ? QUY_TAC_LOI + '\n\n' : '') + NHIEM_VU_HOI;
  const nguCanh = `THE LESSON THE STUDENT IS READING\nTrack: ${mod.track.name} · Module: ${mod.name}\n`
    + (opts.muc ? `They are asking about the section: "${opts.muc}"\n` : '')
    + `\n${than}`;

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'codelab_coach', // người học đang chờ câu trả lời → model mạnh
    system,
    messages: [
      { role: 'user', content: nguCanh },
      { role: 'assistant', content: 'Mình đã đọc xong bài giảng này.' },
      ...(opts.history || []).slice(-MAX_LICH_SU),
      { role: 'user', content: cauHoi },
    ],
    maxTokens: 2_500,
    maxRetries: 1,
    timeoutMs: 120_000,
    userId: opts.userId,
  });

  const traLoi = (res.text || '').trim();
  if (!traLoi) throw new BadRequestError('AI chưa trả lời được. Thử hỏi lại giúp mình.');
  return { answer: traLoi };
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
