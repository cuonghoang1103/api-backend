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
