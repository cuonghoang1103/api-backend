/**
 * Phase 3 — personalized questions from a CV and/or Job Description.
 *
 * Generates ad-hoc interview questions tailored to the candidate, each bundled
 * with a model answer + grading rubric + keyword lists so the normal grader can
 * score them WITHOUT a bank question. The specs are stored on the session's
 * `config.personalized` JSON (no migration); `answer()` falls back to them when
 * a turn has no bank question. Requires the AI gateway + Pro (gated by caller).
 */
import { llmComplete, extractJson } from './llm/index.js';
import type { RubricCriterion } from './scoring.js';

export type PersonalizedType = 'CONCEPTUAL' | 'CODING' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'SCENARIO';
const VALID_TYPES: PersonalizedType[] = ['CONCEPTUAL', 'CODING', 'SYSTEM_DESIGN', 'BEHAVIORAL', 'SCENARIO'];

export interface PersonalizedQuestion {
  questionText: string;
  type: PersonalizedType;
  referenceAnswer: string;
  rubric: RubricCriterion[];
  mustMention: string[];
  shouldMention: string[];
  redFlags: string[];
  /** Phase 8 project interview: 1 = knowledge/theory+code round, 2 = coding/project round. */
  round?: 1 | 2;
}

function toStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean).slice(0, 12) : [];
}

export async function generatePersonalizedQuestions(opts: {
  userId: number;
  cv?: string;
  jd?: string;
  trackName: string;
  level: string;
  count: number;
  language: 'VI' | 'EN';
}): Promise<PersonalizedQuestion[]> {
  const langName = opts.language === 'EN' ? 'English' : 'Vietnamese';
  const system =
    `You are a senior technical interviewer designing a PERSONALIZED interview. Using the candidate's CV and/or the target Job Description, write exactly ${opts.count} interview questions tailored to them for a ${opts.level} ${opts.trackName} role. Favour questions that probe the technologies/experience in the CV and the requirements in the JD; mix conceptual, practical, and behavioural where relevant. For EACH question also produce a concise model answer and a grading rubric. Write ALL text in ${langName}.\n` +
    'Return ONLY JSON of this EXACT shape:\n' +
    '{"questions":[{"questionText":string,"type":"CONCEPTUAL"|"CODING"|"SYSTEM_DESIGN"|"BEHAVIORAL"|"SCENARIO","referenceAnswer":string,"rubric":[{"id":"c1","criterion":string,"weight":number}],"mustMention":[string],"shouldMention":[string],"redFlags":[string]}]}\n' +
    'Rules: pick "type" per question (use "CODING" for write-code questions, "SYSTEM_DESIGN" for design, etc.); rubric ids are "c1","c2",…; weights sum to ~1.0; mustMention = the key technical keywords a strong answer MUST contain (short, 3-8 items); shouldMention = nice-to-have keywords; redFlags = common wrong beliefs. Keep each questionText to 1-3 sentences. No prose outside the JSON.';

  const parts: string[] = [];
  if (opts.cv?.trim()) parts.push(`CANDIDATE CV:\n${opts.cv.slice(0, 16000)}`);
  if (opts.jd?.trim()) parts.push(`JOB DESCRIPTION:\n${opts.jd.slice(0, 16000)}`);
  const user = parts.join('\n\n') || `No CV/JD text provided; produce solid general questions for a ${opts.level} ${opts.trackName}.`;

  const res = await llmComplete({
    step: 'generation', // Opus 4.8 — same strong model as the other Pro modes
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: Math.min(32000, opts.count * 3750 + 5000),
    maxRetries: 0,
    timeoutMs: 240_000,
    userId: opts.userId,
  });

  let parsed: { questions?: unknown };
  try {
    parsed = extractJson<{ questions?: unknown }>(res.text);
  } catch {
    throw new Error('AI trả về JSON không hợp lệ');
  }
  const raw = Array.isArray(parsed?.questions) ? (parsed.questions as unknown[]) : [];

  const out: PersonalizedQuestion[] = [];
  for (const item of raw) {
    const o = item as Record<string, unknown>;
    const questionText = String(o.questionText ?? '').trim();
    if (!questionText) continue;
    const rubric: RubricCriterion[] = Array.isArray(o.rubric)
      ? (o.rubric as unknown[])
          .map((r, i) => {
            const rr = r as Record<string, unknown>;
            return { id: String(rr?.id || `c${i + 1}`), criterion: String(rr?.criterion || '').trim(), weight: Number(rr?.weight) || 0 };
          })
          .filter((r) => r.criterion)
      : [];
    const type = (VALID_TYPES as string[]).includes(String(o.type)) ? (String(o.type) as PersonalizedType) : 'CONCEPTUAL';
    out.push({
      questionText,
      type,
      referenceAnswer: String(o.referenceAnswer ?? '').trim(),
      rubric: rubric.length ? rubric : [{ id: 'c1', criterion: opts.language === 'EN' ? 'Correctness & depth' : 'Chính xác & chiều sâu', weight: 1 }],
      mustMention: toStrArr(o.mustMention),
      shouldMention: toStrArr(o.shouldMention),
      redFlags: toStrArr(o.redFlags),
    });
  }
  if (!out.length) throw new Error('Không sinh được câu hỏi cá nhân hoá');
  return out.slice(0, opts.count);
}

/**
 * Phase 8 — a TWO-ROUND interview generated from the candidate's own project
 * (a Markdown doc). Uses the STRONGEST model (Opus, step 'generation') to read
 * the whole doc deeply. Round 1 = theory/knowledge + code understanding about
 * the project; Round 2 = pure coding / practical / problem-solving in the project.
 */
/** Shared reviewer persona + probe-style toolbox for the project interview. */
function projectReviewerContext(level: string, langName: string): string {
  return (
    'You are a senior technical interviewer running an interview based ENTIRELY on the candidate\'s OWN project, described in the Markdown document below (it may be a hand-written doc OR an auto-extracted PROJECT DIGEST containing the real source code). Read the WHOLE document and understand its architecture, tech stack, data model, key decisions, and trade-offs.\n' +
    'If the project is a SMALL/FOUNDATIONAL exercise (e.g. Java core/OOP practice, plain HTML/CSS/JS, a console app), act as a STRICT CODE REVIEWER probing DEEP understanding: reference concrete classes/functions/lines from the code and ask WHY it works, what the underlying language/CS fundamentals are (OOP principles, inheritance vs composition, collections & complexity, memory, event loop/closures, CSS cascade/specificity, DOM…), what breaks in edge cases, and how the candidate would improve it. The goal is to verify the candidate truly understands their own code and the theory beneath it — not just that it runs.\n' +
    'USE THESE PROBE STYLES LIBERALLY (they expose real understanding, quote the actual code in the question):\n' +
    '- EXECUTION TRACE: "Walk through what happens, step by step, when <this specific method/line in their code> runs — order of execution, what is in memory, what is printed."\n' +
    '- WHAT-IF MUTATION: "If we changed <this exact line> to <a concrete plausible variant>, would it still compile/run? What exactly would happen and WHY?" (e.g. remove @Override/final/static/await, change extends to implements, replace ArrayList with LinkedList, swap == for equals, let for var).\n' +
    '- REORDERING: "If we swapped <these two specific statements/methods/CSS rules>, would behaviour change? Why or why not?"\n' +
    '- PREDICT OUTPUT: "What EXACTLY does this snippet from your project print/return with input X? Explain each step."\n' +
    '- THEORY-FROM-CODE: pick a fundamental the code demonstrates (polymorphism, closure, hoisting, specificity, GC…) and ask them to explain the general rule AND point to where their own code relies on it.\n' +
    '- ALTERNATIVES: "You solved <specific thing> with <their approach> — name at least two OTHER viable ways to do it, compare the trade-offs, and say when each would win."\n' +
    '- JUSTIFY THE DESIGN: "WHY did you choose <specific choice visible in their code>? A reviewer challenges it — defend it or concede, with technical arguments."\n' +
    `Difficulty target: ${level}. Write ALL text in ${langName}.\n` +
    'For EACH question produce a DETAILED TEACHING model answer (referenceAnswer), structured as: (1) the direct answer/expected behaviour, (2) WHY — the underlying mechanism/theory, (3) alternatives or what-would-change variations with trade-offs, (4) common mistakes/misconceptions on this exact point, and finally (5) a short "📚 Gợi ý học thêm:" (or "📚 Further study:" in English) line listing 2-3 concrete topics/exercises the candidate should review to master this. The answer must be complete enough that a candidate who got it wrong fully understands after reading it.\n' +
    'Return ONLY JSON of this EXACT shape:\n' +
    '{"questions":[{"round":1|2,"questionText":string,"type":"CONCEPTUAL"|"CODING"|"SYSTEM_DESIGN"|"BEHAVIORAL"|"SCENARIO","referenceAnswer":string,"rubric":[{"id":"c1","criterion":string,"weight":number}],"mustMention":[string],"shouldMention":[string],"redFlags":[string]}]}\n' +
    'Rules: rubric ids "c1","c2",…; weights sum ~1.0; mustMention = key technical keywords a strong answer MUST contain; keep questionText concise (1-4 sentences); questions must be specific to THIS project, not generic. No prose outside the JSON.'
  );
}

/** Map one raw model item into a PersonalizedQuestion (shared by both rounds). */
function mapProjectQuestion(item: unknown, forcedRound: 1 | 2, language: 'VI' | 'EN'): PersonalizedQuestion | null {
  const o = item as Record<string, unknown>;
  const questionText = String(o?.questionText ?? '').trim();
  if (!questionText) return null;
  const rubric: RubricCriterion[] = Array.isArray(o.rubric)
    ? (o.rubric as unknown[])
        .map((r, i) => {
          const rr = r as Record<string, unknown>;
          return { id: String(rr?.id || `c${i + 1}`), criterion: String(rr?.criterion || '').trim(), weight: Number(rr?.weight) || 0 };
        })
        .filter((r) => r.criterion)
    : [];
  // Round 2 is the coding round — force CODING so it renders the code editor.
  const type: PersonalizedType = forcedRound === 2 ? 'CODING' : ((VALID_TYPES as string[]).includes(String(o.type)) ? (String(o.type) as PersonalizedType) : 'CONCEPTUAL');
  return {
    questionText,
    type,
    round: forcedRound,
    referenceAnswer: String(o.referenceAnswer ?? '').trim(),
    rubric: rubric.length ? rubric : [{ id: 'c1', criterion: language === 'EN' ? 'Correctness & depth' : 'Chính xác & chiều sâu', weight: 1 }],
    mustMention: toStrArr(o.mustMention),
    shouldMention: toStrArr(o.shouldMention),
    redFlags: toStrArr(o.redFlags),
  };
}

export async function generateProjectQuestions(opts: {
  userId: number;
  md: string;
  level: string;
  language: 'VI' | 'EN';
  round1Count: number;
  round2Count: number;
}): Promise<PersonalizedQuestion[]> {
  const langName = opts.language === 'EN' ? 'English' : 'Vietnamese';
  const context = projectReviewerContext(opts.level, langName);
  // Read a LONG project doc (Opus has a huge context) so it understands deeply.
  const doc = `PROJECT DOCUMENT (Markdown):\n\n${opts.md.slice(0, 100000)}`;

  // ONE CALL PER ROUND, run in PARALLEL. Each round gets its own full token
  // budget, so answers stay detailed even at high question counts, generation
  // wall-time is roughly halved, and a malformed response only loses one round.
  const roundSpec: Record<1 | 2, string> = {
    1:
      `This call generates ROUND 1 ONLY (set round=1 on every question): exactly ${opts.round1Count} questions that mix theory/knowledge AND code understanding ABOUT THIS PROJECT — why decisions were made, how components work, trade-offs, edge cases, the specific technologies used. Favour EXECUTION TRACE / WHAT-IF MUTATION / REORDERING / PREDICT OUTPUT / THEORY-FROM-CODE / ALTERNATIVES / JUSTIFY-THE-DESIGN probes. Types may be CONCEPTUAL, SCENARIO, or CODING.`,
    2:
      `This call generates ROUND 2 ONLY (set round=2 on every question): exactly ${opts.round2Count} questions that are PURELY coding & hands-on problem-solving INSIDE this project — quote a concrete function/section of THEIR code and ask them to: implement a specific extension of it, refactor it a stated way (and explain what must change elsewhere), fix a bug you plant or foresee in it, optimise it (state the target), or adapt it to a new requirement. Advanced and practical; almost all should be type=CODING.`,
  };

  const genRound = async (round: 1 | 2, count: number): Promise<PersonalizedQuestion[]> => {
    if (count <= 0) return [];
    const res = await llmComplete({
      step: 'generation', // Opus 4.8 — deepest reading of the project
      system: context + '\n\n' + roundSpec[round],
      messages: [{ role: 'user', content: doc }],
      maxTokens: Math.min(30000, count * 3200 + 5000),
      maxRetries: 0,
      timeoutMs: 285_000,
      userId: opts.userId,
    });
    let parsed: { questions?: unknown };
    try {
      parsed = extractJson<{ questions?: unknown }>(res.text);
    } catch {
      return []; // one bad round must not sink the other — handled below
    }
    const raw = Array.isArray(parsed?.questions) ? (parsed.questions as unknown[]) : [];
    return raw.map((it) => mapProjectQuestion(it, round, opts.language)).filter((q): q is PersonalizedQuestion => q !== null);
  };

  const [r1, r2] = await Promise.all([genRound(1, opts.round1Count), genRound(2, opts.round2Count)]);
  const out = [...r1, ...r2];
  if (!out.length) throw new Error('Không sinh được câu hỏi từ project');
  return out;
}
