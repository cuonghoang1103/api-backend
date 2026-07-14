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
    `Return ONLY JSON of this EXACT shape:\n` +
    `{"questions":[{"questionText":string,"type":"CONCEPTUAL"|"CODING"|"SYSTEM_DESIGN"|"BEHAVIORAL"|"SCENARIO","referenceAnswer":string,"rubric":[{"id":"c1","criterion":string,"weight":number}],"mustMention":[string],"shouldMention":[string],"redFlags":[string]}]}\n` +
    `Rules: pick "type" per question (use "CODING" for write-code questions, "SYSTEM_DESIGN" for design, etc.); rubric ids are "c1","c2",…; weights sum to ~1.0; mustMention = the key technical keywords a strong answer MUST contain (short, 3-8 items); shouldMention = nice-to-have keywords; redFlags = common wrong beliefs. Keep each questionText to 1-3 sentences. No prose outside the JSON.`;

  const parts: string[] = [];
  if (opts.cv?.trim()) parts.push(`CANDIDATE CV:\n${opts.cv.slice(0, 6000)}`);
  if (opts.jd?.trim()) parts.push(`JOB DESCRIPTION:\n${opts.jd.slice(0, 6000)}`);
  const user = parts.join('\n\n') || `No CV/JD text provided; produce solid general questions for a ${opts.level} ${opts.trackName}.`;

  const res = await llmComplete({
    step: 'generation',
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 4000,
    maxRetries: 1,
    timeoutMs: 60_000,
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
export async function generateProjectQuestions(opts: {
  userId: number;
  md: string;
  level: string;
  language: 'VI' | 'EN';
  round1Count: number;
  round2Count: number;
}): Promise<PersonalizedQuestion[]> {
  const langName = opts.language === 'EN' ? 'English' : 'Vietnamese';
  const system =
    `You are a senior technical interviewer designing a TWO-ROUND interview based ENTIRELY on the candidate's OWN project, described in the Markdown document below. Read the WHOLE document and understand its architecture, tech stack, data model, key decisions, and trade-offs.\n` +
    `ROUND 1 (round=1): exactly ${opts.round1Count} questions that mix theory/knowledge AND code understanding ABOUT THIS PROJECT — why decisions were made, how components work, trade-offs, edge cases, the specific technologies used. Types may be CONCEPTUAL, SCENARIO, or CODING.\n` +
    `ROUND 2 (round=2): exactly ${opts.round2Count} questions that are PURELY coding & hands-on problem-solving in or closely related to this project — implement, extend, refactor, debug, or optimise a concrete piece of it; advanced and practical. Almost all should be type=CODING.\n` +
    `Difficulty target: ${opts.level}. Write ALL text in ${langName}. For EACH question also produce a concise model answer + grading rubric.\n` +
    `Return ONLY JSON of this EXACT shape:\n` +
    `{"questions":[{"round":1|2,"questionText":string,"type":"CONCEPTUAL"|"CODING"|"SYSTEM_DESIGN"|"BEHAVIORAL"|"SCENARIO","referenceAnswer":string,"rubric":[{"id":"c1","criterion":string,"weight":number}],"mustMention":[string],"shouldMention":[string],"redFlags":[string]}]}\n` +
    `Rules: rubric ids "c1","c2",…; weights sum ~1.0; mustMention = key technical keywords a strong answer MUST contain; keep questionText concise (1-4 sentences); questions must be specific to THIS project, not generic. No prose outside the JSON.`;
  const user = `PROJECT DOCUMENT (Markdown):\n\n${opts.md.slice(0, 40000)}`;

  const res = await llmComplete({
    step: 'generation', // Opus 4.8 — deepest reading of the project
    system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 8000,
    maxRetries: 1,
    timeoutMs: 120_000,
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
    const round: 1 | 2 = Number(o.round) === 2 ? 2 : 1;
    const rubric: RubricCriterion[] = Array.isArray(o.rubric)
      ? (o.rubric as unknown[])
          .map((r, i) => {
            const rr = r as Record<string, unknown>;
            return { id: String(rr?.id || `c${i + 1}`), criterion: String(rr?.criterion || '').trim(), weight: Number(rr?.weight) || 0 };
          })
          .filter((r) => r.criterion)
      : [];
    // Round 2 is the coding round — force CODING so it renders the code editor.
    const type: PersonalizedType = round === 2 ? 'CODING' : ((VALID_TYPES as string[]).includes(String(o.type)) ? (String(o.type) as PersonalizedType) : 'CONCEPTUAL');
    out.push({
      questionText,
      type,
      round,
      referenceAnswer: String(o.referenceAnswer ?? '').trim(),
      rubric: rubric.length ? rubric : [{ id: 'c1', criterion: opts.language === 'EN' ? 'Correctness & depth' : 'Chính xác & chiều sâu', weight: 1 }],
      mustMention: toStrArr(o.mustMention),
      shouldMention: toStrArr(o.shouldMention),
      redFlags: toStrArr(o.redFlags),
    });
  }
  if (!out.length) throw new Error('Không sinh được câu hỏi từ project');
  // Round 1 first, then round 2.
  out.sort((a, b) => (a.round ?? 1) - (b.round ?? 1));
  return out;
}
