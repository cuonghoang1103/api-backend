/**
 * ============================================================
 * Code Lab — AI explanation of a single exercise (Pro only)
 * ============================================================
 *
 * Two operations:
 *   explainExercise() — a structured walkthrough of ONE exercise: what it is
 *     really asking, how to approach it, which APIs it needs, and the traps.
 *     The result is cached ON THE EXERCISE, not per user: the explanation is a
 *     property of the assignment, so the second reader gets it instantly and
 *     free. `force` regenerates it.
 *   askFollowUp() — the learner did not understand part of that explanation and
 *     asks about it. The cached explanation is passed as context so the answer
 *     continues the same lesson instead of starting a new one. Not cached; a
 *     conversation is per-person and per-moment.
 *
 * Both are Pro-gated at the route. The service still re-checks, because a
 * service that trusts its caller for entitlement is one refactor away from
 * being free for everyone.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { isProEffective } from './pro.service.js';
import { normalizeBlocks, type DocBlock } from './snippets.aiDoc.service.js';

const MAX_QUESTION = 1200;
const MAX_HISTORY = 12;

async function assertPro(userId: number | null | undefined) {
  if (!(await isProEffective(userId))) {
    throw new ForbiddenError('AI explanation is a Pro feature.');
  }
  if (!isAiAvailable()) {
    throw new BadRequestError('The AI service is not configured.');
  }
  if (userId && !(await checkTokenQuota(userId))) {
    throw new BadRequestError('You have reached today’s AI usage limit.');
  }
}

async function loadExercise(id: number) {
  const ex = await prisma.codeExercise.findUnique({
    where: { id },
    select: {
      id: true, title: true, language: true, difficulty: true,
      problemHtml: true, inputSpec: true, outputSpec: true, constraints: true,
      concepts: true, starterCodeJson: true, solutionCodeJson: true,
      aiExplanationJson: true, aiExplainedAt: true,
      module: { select: { name: true } },
      track: { select: { name: true } },
    },
  });
  if (!ex) throw new NotFoundError('Exercise not found.');
  return ex;
}

/** Strip tags so the model reads the brief as prose, not as markup. */
function plain(html: string | null | undefined, cap = 6000): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|tr|pre)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, cap);
}

function briefFor(ex: Awaited<ReturnType<typeof loadExercise>>): string {
  const parts = [
    `Track: ${ex.track?.name ?? ''}`,
    `Module: ${ex.module?.name ?? ''}`,
    `Exercise: ${ex.title}`,
    `Language: ${ex.language}`,
    `Difficulty: ${ex.difficulty}`,
    '',
    'BRIEF:',
    plain(ex.problemHtml),
  ];
  if (ex.inputSpec) parts.push('', 'INPUT:', plain(ex.inputSpec, 1000));
  if (ex.outputSpec) parts.push('', 'OUTPUT:', plain(ex.outputSpec, 1000));
  if (ex.constraints) parts.push('', 'CONSTRAINTS:', plain(ex.constraints, 1000));
  const starter = Array.isArray(ex.starterCodeJson) ? (ex.starterCodeJson as Array<{ name?: string; code?: string }>) : [];
  for (const b of starter.slice(0, 2)) {
    if (b?.code) parts.push('', `STARTER (${b.name ?? 'code'}):`, String(b.code).slice(0, 3000));
  }
  return parts.join('\n');
}

const EXPLAIN_SYSTEM = `You are a patient university lab tutor explaining ONE programming assignment to a
student who is about to attempt it. The student is Vietnamese and studying in English.

Return ONLY a JSON array of blocks, no prose around it. Each block is one of:
  {"type":"heading","text":"…","textVi":"…"}
  {"type":"prose","html":"<p>…</p>","htmlVi":"<p>…</p>"}
  {"type":"code","language":"java","title":"…","titleVi":"…","code":"…"}

Rules:
- Every heading and prose block MUST carry both the English field and its Vietnamese
  companion. Code is written once; its comments stay in English.
- 8 to 16 blocks. Cover, in this order: what the brief is really asking in one
  paragraph; the data you must model; the steps to build it; the specific Java
  APIs needed and why; the two or three mistakes that lose marks here; and how an
  examiner would test it.
- DO NOT give the finished solution. Give the shape, the decisions and the traps.
  A short illustrative snippet of one technique is fine; a complete working
  program is not.
- prose html may use only <p> <ul> <ol> <li> <code> <strong> <em>.
- Be concrete about THIS assignment. Generic advice that would fit any exercise
  is worthless here.`;

/** The cached explanation, if one exists. Free to read — generating cost the
 *  tokens, and hiding the result from non-Pro readers would waste them. */
export async function readExplanation(exerciseId: number): Promise<{
  blocks: DocBlock[]; cached: boolean; generatedAt: Date | null;
}> {
  const ex = await loadExercise(exerciseId);
  const blocks = Array.isArray(ex.aiExplanationJson) ? (ex.aiExplanationJson as unknown as DocBlock[]) : [];
  return { blocks, cached: blocks.length > 0, generatedAt: ex.aiExplainedAt };
}

/** Generate (or return the cached) structured explanation for one exercise. */
export async function explainExercise(
  exerciseId: number,
  opts: { userId: number; force?: boolean },
): Promise<{ blocks: DocBlock[]; cached: boolean; generatedAt: Date | null }> {
  const ex = await loadExercise(exerciseId);

  const cached = Array.isArray(ex.aiExplanationJson) ? (ex.aiExplanationJson as unknown as DocBlock[]) : null;
  if (cached?.length && !opts.force) {
    return { blocks: cached, cached: true, generatedAt: ex.aiExplainedAt };
  }

  await assertPro(opts.userId);

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    system: EXPLAIN_SYSTEM,
    messages: [{ role: 'user', content: briefFor(ex) }],
    maxTokens: 3500,
    maxRetries: 1,
    timeoutMs: 120_000,
    userId: opts.userId,
  });

  const blocks = normalizeBlocks(parseBlocks(res.text));
  if (!blocks.length) throw new BadRequestError('The AI returned nothing usable. Please try again.');

  await prisma.codeExercise.update({
    where: { id: exerciseId },
    data: {
      aiExplanationJson: blocks as unknown as Prisma.InputJsonValue,
      aiExplainedAt: new Date(),
    },
  });
  return { blocks, cached: false, generatedAt: new Date() };
}

/** Pull the JSON array out of a reply that may be fenced or padded with prose. */
function parseBlocks(raw: string): unknown {
  const text = (raw || '').trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('[');
  const end = body.lastIndexOf(']');
  if (start < 0 || end <= start) return [];
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return [];
  }
}

const CHAT_SYSTEM = `You are the same lab tutor, now answering a follow-up question about an
explanation the student has just read. Answer in BOTH languages: first English, then the
same answer in Vietnamese under a line that reads "Tiếng Việt:".

Keep it short and concrete — a few sentences, plus a small code snippet only when it
genuinely clarifies. Refer back to the explanation the student is looking at. Never hand
over a complete solution to the assignment; guide instead. If the question is not about
this assignment or about programming, say so briefly and steer back.`;

export interface FollowUpMessage { role: 'user' | 'assistant'; content: string }

/** Answer a follow-up about the cached explanation. Not stored. */
export async function askFollowUp(
  exerciseId: number,
  opts: { userId: number; question: string; history?: FollowUpMessage[] },
): Promise<{ answer: string }> {
  const question = (opts.question || '').trim();
  if (!question) throw new BadRequestError('Please type a question.');
  if (question.length > MAX_QUESTION) throw new BadRequestError('That question is too long.');

  await assertPro(opts.userId);
  const ex = await loadExercise(exerciseId);

  const explanation = Array.isArray(ex.aiExplanationJson)
    ? (ex.aiExplanationJson as unknown as DocBlock[])
    : [];
  const explanationText = explanation
    .map((b) => (b.type === 'heading' ? `## ${b.text}` : b.type === 'prose' ? plain(b.html, 1500) : b.type === 'code' ? b.code.slice(0, 800) : ''))
    .filter(Boolean)
    .join('\n')
    .slice(0, 8000);

  const messages: FollowUpMessage[] = [
    {
      role: 'user',
      content:
        `THE ASSIGNMENT\n${briefFor(ex).slice(0, 4000)}\n\n` +
        `THE EXPLANATION THE STUDENT IS READING\n${explanationText || '(not generated yet)'}`,
    },
    { role: 'assistant', content: 'Understood. I have the assignment and the explanation in front of me.' },
    ...(opts.history || []).slice(-MAX_HISTORY),
    { role: 'user', content: question },
  ];

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    system: CHAT_SYSTEM,
    messages,
    maxTokens: 1200,
    maxRetries: 1,
    timeoutMs: 90_000,
    userId: opts.userId,
  });

  const answer = (res.text || '').trim();
  if (!answer) throw new BadRequestError('The AI returned nothing. Please try again.');
  return { answer };
}
