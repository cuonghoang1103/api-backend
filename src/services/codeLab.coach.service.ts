/**
 * ============================================================
 * Code Lab — the practice coach (Pro only)
 * ============================================================
 *
 * Three things a learner cannot get from a static page:
 *
 *   askViva()      — the examiner asks ONE question about this assignment, in
 *                    one of two modes. `explain` is "tell me how your code
 *                    works"; `change` is the harder one real examiners use —
 *                    "now add this feature / swap this data structure", which
 *                    only someone who understands their own design can answer.
 *   gradeViva()     — marks the answer out of 10 with what was good, what was
 *                    missing, and the answer a strong student would have given.
 *   checkAgainstBrief() — the learner pastes their code and every requirement
 *                    in the brief is checked off one by one. This is the step
 *                    that catches "I forgot menu option 4" before the marker does.
 *
 * All three are Pro-gated inside the service, not merely at the route.
 * Nothing here is cached: a question you have already seen is worthless, and a
 * code review is about code that changes every time.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { buildProjectDigest } from './interview/projectZip.service.js';
import { isProEffective } from './pro.service.js';

export type VivaMode = 'explain' | 'change';

const MAX_CODE = 24_000;
const MAX_ANSWER = 6_000;

async function assertPro(userId: number) {
  if (!(await isProEffective(userId))) throw new ForbiddenError('This is a Pro feature.');
  if (!isAiAvailable('codelab')) throw new BadRequestError('The AI service is not available right now. Please try again shortly.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('You have reached today’s AI usage limit.');
}

async function loadExercise(id: number) {
  const ex = await prisma.codeExercise.findUnique({
    where: { id },
    select: {
      id: true, title: true, language: true, difficulty: true,
      problemHtml: true, inputSpec: true, outputSpec: true, constraints: true,
      concepts: true,
      module: { select: { name: true } },
    },
  });
  if (!ex) throw new NotFoundError('Exercise not found.');
  return ex;
}

function plain(html: string | null | undefined, cap = 7000): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|tr|pre)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
    .trim().slice(0, cap);
}

function briefOf(ex: Awaited<ReturnType<typeof loadExercise>>): string {
  const bits = [`Assignment: ${ex.title}`, `Language: ${ex.language}`, '', 'BRIEF:', plain(ex.problemHtml)];
  if (ex.inputSpec) bits.push('', 'INPUT:', plain(ex.inputSpec, 800));
  if (ex.outputSpec) bits.push('', 'OUTPUT:', plain(ex.outputSpec, 800));
  if (ex.constraints) bits.push('', 'CONSTRAINTS:', plain(ex.constraints, 800));
  return bits.join('\n');
}

/** Pull the first JSON object out of a reply that may be fenced or padded. */
function parseJson<T>(raw: string): T | null {
  const text = (raw || '').trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(body.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

// ─── 1. Ask a question ──────────────────────────────────────────

const ASK_SYSTEM = `You are a strict but fair university examiner conducting an oral defence of ONE
programming assignment. You ask exactly ONE question and nothing else.

Return ONLY JSON: {"question":"…","questionVi":"…","hint":"…","hintVi":"…","focus":"…"}

- "question" is what you say out loud. One question, 1-3 sentences. Concrete and about
  THIS assignment, never generic.
- "hint" names what a complete answer must mention, WITHOUT answering it. One sentence.
- "focus" is a two-to-four word label such as "polymorphism" or "duplicate id check".
- "questionVi" and "hintVi" are the Vietnamese of the same thing.

MODE = explain
  Ask the student to account for their own code: why a structure was chosen, what a
  particular rule does, what breaks if it is removed, where a pillar of OOP appears.

MODE = change
  Behave like an examiner who wants to see whether the student understands their own
  design. State a CONCRETE change to the requirements — a new menu option, an extra
  field, a different data structure, a new validation rule, a changed output format —
  and ask what they would change in their code and why. The change must be realistic
  for this assignment and answerable in a couple of minutes of talking.

Never ask two questions. Never include the answer.`;

export interface VivaQuestion {
  question: string; questionVi: string; hint: string; hintVi: string; focus: string; mode: VivaMode;
}

export async function askViva(
  exerciseId: number,
  opts: { userId: number; mode: VivaMode; asked?: string[] },
): Promise<VivaQuestion> {
  await assertPro(opts.userId);
  const ex = await loadExercise(exerciseId);

  const already = (opts.asked || []).slice(-8);
  const avoid = already.length
    ? `\n\nYou have already asked these — ask about something else:\n${already.map((q) => `- ${q}`).join('\n')}`
    : '';

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    system: ASK_SYSTEM,
    messages: [{ role: 'user', content: `MODE = ${opts.mode}\n\n${briefOf(ex)}${avoid}` }],
    maxTokens: 700,
    maxRetries: 1,
    timeoutMs: 60_000,
    userId: opts.userId,
  });

  const q = parseJson<Omit<VivaQuestion, 'mode'>>(res.text);
  if (!q?.question) throw new BadRequestError('The examiner could not think of a question. Try again.');
  return {
    question: q.question,
    questionVi: q.questionVi || q.question,
    hint: q.hint || '',
    hintVi: q.hintVi || q.hint || '',
    focus: q.focus || '',
    mode: opts.mode,
  };
}

// ─── 2. Grade the answer ────────────────────────────────────────

const GRADE_SYSTEM = `You are the same examiner, now marking the student's spoken answer.

Return ONLY JSON:
{"score":0-10,"verdict":"…","verdictVi":"…","good":["…"],"goodVi":["…"],
 "missing":["…"],"missingVi":["…"],"modelAnswer":"…","modelAnswerVi":"…"}

- score: 0-3 does not understand, 4-6 partially, 7-8 solid, 9-10 could teach it.
- verdict: one sentence, direct. Say plainly if the answer is wrong.
- good: 0-3 specific things the answer got right. Empty array if there were none —
  do not invent praise.
- missing: 1-4 specific things a full answer needed. This is the most useful field.
- modelAnswer: how a strong student would have answered, 3-6 sentences. Concrete
  and about this assignment.
- Every field has its Vietnamese twin.

Mark what was actually said. A confident answer that is wrong scores lower than a
hesitant one that is right. If the student answered a different question than the
one asked, say so and score accordingly.`;

export interface VivaGrade {
  score: number; verdict: string; verdictVi: string;
  good: string[]; goodVi: string[]; missing: string[]; missingVi: string[];
  modelAnswer: string; modelAnswerVi: string;
}

export async function gradeViva(
  exerciseId: number,
  opts: { userId: number; question: string; answer: string; mode: VivaMode },
): Promise<VivaGrade> {
  const answer = (opts.answer || '').trim();
  if (!answer) throw new BadRequestError('Please write an answer first.');
  if (answer.length > MAX_ANSWER) throw new BadRequestError('That answer is too long.');
  await assertPro(opts.userId);
  const ex = await loadExercise(exerciseId);

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    system: GRADE_SYSTEM,
    messages: [{
      role: 'user',
      content: `MODE = ${opts.mode}\n\n${briefOf(ex)}\n\nQUESTION ASKED:\n${opts.question}\n\nSTUDENT ANSWER:\n${answer}`,
    }],
    maxTokens: 1400,
    maxRetries: 1,
    timeoutMs: 90_000,
    userId: opts.userId,
  });

  const g = parseJson<VivaGrade>(res.text);
  if (!g || typeof g.score !== 'number') throw new BadRequestError('Could not mark that answer. Try again.');
  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String).slice(0, 5) : []);
  return {
    score: Math.max(0, Math.min(10, Math.round(g.score))),
    verdict: g.verdict || '', verdictVi: g.verdictVi || g.verdict || '',
    good: arr(g.good), goodVi: arr(g.goodVi).length ? arr(g.goodVi) : arr(g.good),
    missing: arr(g.missing), missingVi: arr(g.missingVi).length ? arr(g.missingVi) : arr(g.missing),
    modelAnswer: g.modelAnswer || '', modelAnswerVi: g.modelAnswerVi || g.modelAnswer || '',
  };
}

// ─── 3. Check the code against the brief ────────────────────────

const CHECK_SYSTEM = `You are marking a student's Java program against its assignment brief,
requirement by requirement, the way a lab examiner does.

Return ONLY JSON:
{"summary":"…","summaryVi":"…","met":0,"total":0,
 "items":[{"requirement":"…","requirementVi":"…","status":"met|partial|missing",
           "evidence":"…","evidenceVi":"…","fix":"…","fixVi":"…"}],
 "risks":["…"],"risksVi":["…"]}

- One item per DISTINCT requirement in the brief: each menu option, each validation
  rule, each output format, each named method, each stated constraint. Expect 6-20.
- "evidence": for met/partial, quote the method or line that satisfies it. Quote what
  is really in the code — never invent a line the student did not write.
- "fix": for partial/missing, one concrete sentence on what to add. Empty for met.
- "risks": things that will crash or misbehave in front of the marker — unhandled
  bad input, a missing file on first run, a duplicate id accepted. Empty array if none.
- "met" counts status == "met". "total" is items.length.
- Every field has its Vietnamese twin.

Be exact. Marking something met when it is absent is the worst thing you can do here,
because the student will stop looking for it.`;

export interface SpecCheckItem {
  requirement: string; requirementVi: string;
  status: 'met' | 'partial' | 'missing';
  evidence: string; evidenceVi: string; fix: string; fixVi: string;
}
export interface SpecCheck {
  summary: string; summaryVi: string; met: number; total: number;
  items: SpecCheckItem[]; risks: string[]; risksVi: string[];
}

export async function checkAgainstBrief(
  exerciseId: number,
  opts: { userId: number; code: string },
): Promise<SpecCheck> {
  const code = (opts.code || '').trim();
  if (!code) throw new BadRequestError('Paste your code first.');
  if (code.length > MAX_CODE) throw new BadRequestError('That is too much code — paste the main classes only.');
  await assertPro(opts.userId);
  const ex = await loadExercise(exerciseId);

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    system: CHECK_SYSTEM,
    messages: [{ role: 'user', content: `${briefOf(ex)}\n\nSTUDENT CODE:\n\`\`\`java\n${code}\n\`\`\`` }],
    maxTokens: 4000,
    maxRetries: 1,
    timeoutMs: 150_000,
    userId: opts.userId,
  });

  const r = parseJson<SpecCheck>(res.text);
  if (!r || !Array.isArray(r.items)) throw new BadRequestError('Could not review that code. Try again.');

  const items: SpecCheckItem[] = r.items.slice(0, 30).map((it) => ({
    requirement: String(it.requirement ?? ''),
    requirementVi: String(it.requirementVi ?? it.requirement ?? ''),
    status: (it.status === 'met' || it.status === 'partial' ? it.status : 'missing') as SpecCheckItem['status'],
    evidence: String(it.evidence ?? ''), evidenceVi: String(it.evidenceVi ?? it.evidence ?? ''),
    fix: String(it.fix ?? ''), fixVi: String(it.fixVi ?? it.fix ?? ''),
  })).filter((it) => it.requirement);

  const arr = (v: unknown) => (Array.isArray(v) ? v.map(String).slice(0, 8) : []);
  return {
    summary: r.summary || '', summaryVi: r.summaryVi || r.summary || '',
    // Recount rather than trust the model's arithmetic.
    met: items.filter((i) => i.status === 'met').length,
    total: items.length,
    items,
    risks: arr(r.risks), risksVi: arr(r.risksVi).length ? arr(r.risksVi) : arr(r.risks),
  };
}

// ─── 4. Check a whole PROJECT (.zip) against the brief ──────────
//
// The paste box above assumes one file. A LAB211 submission is a folder of
// packages — model/, service/, util/, a Main — and pasting it class by class
// into one textarea loses exactly what the marker looks at first: whether the
// structure matches the brief, and whether the pieces actually call each other.
//
// So the zip is digested into a tree + the source (buildProjectDigest, shared
// with the interview module: zip-slip and zip-bomb guards, build output and
// binaries dropped), and the review gains three things the paste box cannot do:
// structure against the required tree, demo risks read across files, and the
// viva questions this specific code invites.

/** Well under the model's window, and a LAB211 project is a fraction of it. */
const MAX_DIGEST = 60_000;

export interface ProjectStructureItem {
  expected: string; expectedVi: string;
  status: 'ok' | 'misplaced' | 'missing';
  actual: string; actualVi: string;
}
export interface ProjectCheck extends SpecCheck {
  structure: ProjectStructureItem[];
  vivaQuestions: string[]; vivaQuestionsVi: string[];
  files: { included: number; skipped: number; truncated: boolean; tree: string[] };
}

const PROJECT_CHECK_SYSTEM = `You are marking a student's Java PROJECT against its assignment brief,
the way a lab examiner does at a defence.

You are given the brief (which usually includes the required project tree) and a
digest of the student's uploaded project: a file tree, then each source file.

Return ONLY JSON:
{"summary":"…","summaryVi":"…","met":0,"total":0,
 "items":[{"requirement":"…","requirementVi":"…","status":"met|partial|missing",
           "evidence":"…","evidenceVi":"…","fix":"…","fixVi":"…"}],
 "structure":[{"expected":"…","expectedVi":"…","status":"ok|misplaced|missing",
               "actual":"…","actualVi":"…"}],
 "risks":["…"],"risksVi":["…"],
 "vivaQuestions":["…"],"vivaQuestionsVi":["…"]}

- "items": one per DISTINCT requirement in the brief — each menu option, each
  validation rule, each output format, each named method, each stated constraint.
  Expect 6-20.
- "evidence": for met/partial, quote the method or line that satisfies it AND name
  the file it is in, as "path/File.java: <the line>". The project has many files;
  a quote with no path is useless to someone trying to find it. Quote what is
  really there — never invent a line the student did not write.
- "fix": for partial/missing, one concrete sentence naming the file to change.
- "structure": compare the required project tree in the brief against the tree you
  were given. One entry per required class/package. "ok" = present where the brief
  says; "misplaced" = present but in another package, and "actual" says where it
  really is; "missing" = not in the project at all. If the brief states no tree,
  return an empty array rather than inventing requirements.
- "risks": what will crash or embarrass the student in a live demo — unhandled bad
  input, a data file missing on first run, a duplicate id accepted, an infinite
  loop on a wrong menu choice. Read ACROSS files: a check in Main that the service
  does not enforce is a risk. Empty array if none.
- "vivaQuestions": 3-6 questions THIS code invites, grounded in what the student
  actually wrote — the data structure they chose, a loop that could be a stream,
  a place where validation could be bypassed. Not generic Java trivia.
- "met" counts status == "met". "total" is items.length.
- Every field has its Vietnamese twin.

Be exact. Marking something met when it is absent is the worst thing you can do here,
because the student will stop looking for it.`;

export async function checkProjectAgainstBrief(
  exerciseId: number,
  opts: { userId: number; zip: Buffer; zipName?: string },
): Promise<ProjectCheck> {
  await assertPro(opts.userId);
  const ex = await loadExercise(exerciseId);

  // Throws BadRequestError with a readable message for an empty/corrupt/huge zip.
  const { digest, stats } = buildProjectDigest(opts.zip, opts.zipName);
  const body = digest.length > MAX_DIGEST
    ? digest.slice(0, MAX_DIGEST) + '\n… (digest truncated)\n'
    : digest;

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    system: PROJECT_CHECK_SYSTEM,
    messages: [{ role: 'user', content: `${briefOf(ex)}\n\nSTUDENT PROJECT:\n${body}` }],
    // Four sections instead of one, over a whole project — 4000 truncated the
    // JSON and the whole review was lost to a parse error.
    maxTokens: 8000,
    maxRetries: 1,
    timeoutMs: 300_000,
    userId: opts.userId,
  });

  const r = parseJson<ProjectCheck>(res.text);
  if (!r || !Array.isArray(r.items)) throw new BadRequestError('Could not review that project. Try again.');

  const items: SpecCheckItem[] = (r.items ?? []).slice(0, 30).map((it) => ({
    requirement: String(it.requirement ?? ''),
    requirementVi: String(it.requirementVi ?? it.requirement ?? ''),
    status: (it.status === 'met' || it.status === 'partial' ? it.status : 'missing') as SpecCheckItem['status'],
    evidence: String(it.evidence ?? ''), evidenceVi: String(it.evidenceVi ?? it.evidence ?? ''),
    fix: String(it.fix ?? ''), fixVi: String(it.fixVi ?? it.fix ?? ''),
  })).filter((it) => it.requirement);

  const structure: ProjectStructureItem[] = (Array.isArray(r.structure) ? r.structure : [])
    .slice(0, 40).map((s) => ({
      expected: String(s.expected ?? ''),
      expectedVi: String(s.expectedVi ?? s.expected ?? ''),
      status: (s.status === 'ok' || s.status === 'misplaced' ? s.status : 'missing') as ProjectStructureItem['status'],
      actual: String(s.actual ?? ''), actualVi: String(s.actualVi ?? s.actual ?? ''),
    })).filter((s) => s.expected);

  const arr = (v: unknown, n = 8) => (Array.isArray(v) ? v.map(String).slice(0, n) : []);
  const risks = arr(r.risks);
  const viva = arr(r.vivaQuestions, 6);
  return {
    summary: r.summary || '', summaryVi: r.summaryVi || r.summary || '',
    met: items.filter((i) => i.status === 'met').length,
    total: items.length,
    items,
    structure,
    risks, risksVi: arr(r.risksVi).length ? arr(r.risksVi) : risks,
    vivaQuestions: viva,
    vivaQuestionsVi: arr(r.vivaQuestionsVi, 6).length ? arr(r.vivaQuestionsVi, 6) : viva,
    files: {
      included: stats.filesIncluded,
      skipped: stats.filesSkipped,
      truncated: stats.truncated || digest.length > MAX_DIGEST,
      tree: stats.tree.slice(0, 200),
    },
  };
}
