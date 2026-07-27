/**
 * Exam Room — PE (Practical Exam) grading.
 *
 * Three graders, all going through the shared interactive LLM gateway
 * (feature 'interview' basket, so a rate-limit here can't starve batch jobs):
 *   • gradeCode    — student uploads a .zip of source files → AI grades against
 *                    the author's reference solution + expected output + rubric.
 *   • gradeWrite   — English essay graded by rubric.
 *   • gradeSpeaking— audio → Groq Whisper transcript → AI grades content +
 *                    pronunciation (STT-aware, like My Language but exam-scoped).
 *
 * Feedback strings come back bilingual as "EN|||VI" so the client's EN/VN
 * toggle works everywhere. Every grader degrades to a graceful error (never a
 * hang) when AI is off, and returns a normalized 0..points score.
 */
import AdmZip from 'adm-zip';
import { llmComplete, isAiAvailable, aiOffReason, extractJson, checkTokenQuota } from './interview/llm/index.js';
import { transcribeWithGroq } from './interview/voice/stt.js';
import { AppError } from '../middleware/errorHandler.js';

function ensureAi() {
  if (!isAiAvailable('interview')) {
    const reason = aiOffReason('interview');
    throw new AppError(
      reason === 'circuit'
        ? 'AI đang tạm nghỉ sau lỗi cổng; thử lại sau ít phút.'
        : reason === 'static'
          ? 'AI đang tắt trên máy chủ này.'
          : 'AI chưa được cấu hình trên máy chủ này.',
      503,
    );
  }
}

export interface PeGradeResult {
  score: number;          // 0..question.points
  maxScore: number;       // question.points
  percent: number;        // 0..100
  verdict: 'excellent' | 'good' | 'pass' | 'weak' | 'fail';
  summary: string;        // "EN|||VI"
  criteria: Array<{ id: string; name: string; score: number; maxScore: number; comment: string }>;
  suggestions: string[];  // each "EN|||VI"
  // Extras
  transcript?: string;    // speaking
}

// ── Shared JSON grade schema parsing ──────────────────────────────────
interface RawGrade {
  score?: number; // 0..100
  verdict?: string;
  summary?: string;
  criteria?: Array<{ id?: string; name?: string; score?: number; maxScore?: number; comment?: string }>;
  suggestions?: string[];
}

const GRADE_JSON_SPEC =
  'Return ONLY a minified JSON object (no prose, no code fences): ' +
  '{"score": number (0-100), "verdict": "excellent"|"good"|"pass"|"weak"|"fail", ' +
  '"summary": string, "criteria": [{"id": string, "name": string, "score": number, "maxScore": number, "comment": string}], ' +
  '"suggestions": [string]}. ' +
  'EVERY human-readable string ("summary", each "name"/"comment", each suggestion) MUST be bilingual in the exact form "English text|||Tiếng Việt" — English first, then three pipes, then Vietnamese. Keep each concise but concrete.';

function verdictFromPercent(p: number): PeGradeResult['verdict'] {
  if (p >= 90) return 'excellent';
  if (p >= 75) return 'good';
  if (p >= 50) return 'pass';
  if (p >= 30) return 'weak';
  return 'fail';
}

function normalizeGrade(raw: RawGrade, points: number): Omit<PeGradeResult, 'transcript'> {
  const pct = Math.max(0, Math.min(100, Number(raw.score) || 0));
  const score = Math.round((pct / 100) * points * 100) / 100;
  const criteria = Array.isArray(raw.criteria)
    ? raw.criteria.slice(0, 12).map((c, i) => ({
        id: String(c.id ?? `c${i + 1}`),
        name: String(c.name ?? `Criterion ${i + 1}`),
        score: Math.max(0, Number(c.score) || 0),
        maxScore: Math.max(1, Number(c.maxScore) || 4),
        comment: String(c.comment ?? ''),
      }))
    : [];
  const suggestions = Array.isArray(raw.suggestions) ? raw.suggestions.slice(0, 8).map(String) : [];
  const verdict = (['excellent', 'good', 'pass', 'weak', 'fail'] as const).includes(raw.verdict as never)
    ? (raw.verdict as PeGradeResult['verdict'])
    : verdictFromPercent(pct);
  return { score, maxScore: points, percent: pct, verdict, summary: String(raw.summary ?? ''), criteria, suggestions };
}

async function callGrader(userId: number, system: string, user: string): Promise<RawGrade> {
  const first = await llmComplete({
    step: 'interview', feature: 'interview', system,
    messages: [{ role: 'user', content: user }],
    maxTokens: 2200, userId, maxRetries: 1, timeoutMs: 45_000,
  });
  try {
    return extractJson<RawGrade>(first.text);
  } catch {
    const retry = await llmComplete({
      step: 'interview', feature: 'interview', system,
      messages: [
        { role: 'user', content: user },
        { role: 'assistant', content: first.text },
        { role: 'user', content: 'Your previous output was not valid JSON. Return ONLY the JSON object — no prose, no code fences.' },
      ],
      maxTokens: 2200, userId, maxRetries: 0, timeoutMs: 30_000,
    });
    return extractJson<RawGrade>(retry.text);
  }
}

// ── 1) CODE — unzip + grade ───────────────────────────────────────────
/** Extract text source files from an uploaded zip (skips binaries, caps size). */
export function extractCodeFromZip(buffer: Buffer): { files: Array<{ name: string; content: string }>; combined: string } {
  let zip: AdmZip;
  try {
    zip = new AdmZip(buffer);
  } catch {
    throw new AppError('File .zip không đọc được. Hãy nén lại và thử lần nữa.', 400);
  }
  const TEXT_EXT = /\.(c|h|cpp|cc|hpp|cs|java|py|js|jsx|ts|tsx|go|rb|php|sql|txt|md|html|css|kt|swift|rs|dart|m|scala)$/i;
  const files: Array<{ name: string; content: string }> = [];
  let total = 0;
  const MAX_TOTAL = 60_000; // chars — keeps the prompt bounded
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;
    const name = entry.entryName;
    if (/(^|\/)(__MACOSX|\.git)\//.test(name) || /(^|\/)\._/.test(name)) continue;
    if (!TEXT_EXT.test(name)) continue;
    if (total >= MAX_TOTAL) break;
    let content = '';
    try {
      content = entry.getData().toString('utf8');
    } catch {
      continue;
    }
    if (content.length > 20_000) content = content.slice(0, 20_000) + '\n/* …truncated… */';
    total += content.length;
    files.push({ name, content });
  }
  if (!files.length) throw new AppError('Không tìm thấy file mã nguồn trong .zip (chỉ nhận .c/.java/.py/.js…).', 400);
  const combined = files.map((f) => `===== FILE: ${f.name} =====\n${f.content}`).join('\n\n');
  return { files, combined };
}

export async function gradeCode(params: {
  userId: number;
  points: number;
  prompt: string;
  language: string | null;
  expectedOutput: string | null;
  sampleSolution: string | null;
  rubric: unknown;
  submittedCode: string;
}): Promise<PeGradeResult> {
  ensureAi();
  if (!(await checkTokenQuota(params.userId))) throw new AppError('Bạn đã đạt giới hạn AI trong ngày. Thử lại vào ngày mai nhé.', 429);
  const system =
    'You are a strict but fair FPTU practical-exam (PE) code grader. You are given a programming problem, an optional reference solution, the expected console I/O, an optional rubric, and the student\'s submitted source code. ' +
    'Judge CORRECTNESS first (does it solve the problem and match the expected output/behaviour?), then code quality, edge cases, and adherence to the requirements. Be concrete: cite what works and what fails. ' +
    GRADE_JSON_SPEC;
  const rubricText = Array.isArray(params.rubric) && params.rubric.length
    ? `\n\nRUBRIC:\n${(params.rubric as Array<{ id?: string; criterion?: string; weight?: number }>).map((c) => `- ${c.id ?? ''} (weight ${c.weight ?? 1}): ${c.criterion ?? ''}`).join('\n')}`
    : '';
  const user = [
    `LANGUAGE: ${params.language || 'unspecified'}`,
    `PROBLEM:\n${params.prompt}`,
    params.expectedOutput ? `EXPECTED OUTPUT / EXAMPLE I/O:\n${params.expectedOutput}` : '',
    params.sampleSolution ? `REFERENCE SOLUTION (author):\n${params.sampleSolution}` : '',
    rubricText,
    `STUDENT SUBMISSION:\n${params.submittedCode}`,
    'Grade now.',
  ].filter(Boolean).join('\n\n');
  const raw = await callGrader(params.userId, system, user);
  return normalizeGrade(raw, params.points);
}

// ── 2) WRITE — English essay ──────────────────────────────────────────
export async function gradeWrite(params: {
  userId: number;
  points: number;
  prompt: string;
  rubric: unknown;
  essay: string;
}): Promise<PeGradeResult> {
  ensureAi();
  if (!(await checkTokenQuota(params.userId))) throw new AppError('Bạn đã đạt giới hạn AI trong ngày. Thử lại vào ngày mai nhé.', 429);
  if (params.essay.trim().length < 20) throw new AppError('Bài viết quá ngắn để chấm.', 400);
  const system =
    'You are an FPTU practical-exam (PE) writing grader for an English academic-writing task. Grade the student\'s English essay against the prompt for: task response/relevance, organization & coherence, grammar & mechanics, vocabulary & style, and (if applicable) academic conventions. Be encouraging but honest. ' +
    GRADE_JSON_SPEC;
  const rubricText = Array.isArray(params.rubric) && params.rubric.length
    ? `\n\nRUBRIC:\n${(params.rubric as Array<{ id?: string; criterion?: string; weight?: number }>).map((c) => `- ${c.id ?? ''} (weight ${c.weight ?? 1}): ${c.criterion ?? ''}`).join('\n')}`
    : '';
  const user = [`PROMPT:\n${params.prompt}`, rubricText, `STUDENT ESSAY (English):\n${params.essay}`, 'Grade now.'].filter(Boolean).join('\n\n');
  const raw = await callGrader(params.userId, system, user);
  return normalizeGrade(raw, params.points);
}

// ── 3) SPEAK — transcribe + grade content & pronunciation ─────────────
export async function transcribeExamAudio(audio: Buffer, filename: string, mimetype: string, language: string = 'en'): Promise<string> {
  if (!audio?.length) throw new AppError('Không nhận được audio', 400);
  const r = await transcribeWithGroq(audio, filename, mimetype, { language });
  return (r?.text || '').trim();
}

export async function gradeSpeaking(params: {
  userId: number;
  points: number;
  prompt: string;
  speakingPrompts: Array<{ text: string }>;
  transcripts: string[]; // one per speaking sub-prompt (already transcribed)
  rubric: unknown;
  language?: string; // ISO-639-1 the student answered in, e.g. 'ja' — defaults to English
}): Promise<PeGradeResult> {
  ensureAi();
  if (!(await checkTokenQuota(params.userId))) throw new AppError('Bạn đã đạt giới hạn AI trong ngày. Thử lại vào ngày mai nhé.', 429);
  const joined = params.transcripts.map((t) => t.trim()).join(' ');
  if (joined.length < 3) throw new AppError('Không nghe rõ phần trả lời. Hãy thu âm ở nơi yên tĩnh và nói to, rõ hơn.', 400);
  const isJa = params.language === 'ja';
  const system = isJa
    ? 'You are a supportive Japanese (JLPT A1.1 / FPTU JPD113) speaking-exam grader. The student answered speaking questions in Japanese (mix of hiragana/katakana/kanji, romanized filler words possible); you are given the auto-transcribed text (via Japanese speech-to-text, so tolerate STT noise — missing particles, wrong kanji homophones, romaji leaking through). Grade: content correctness (right grammar pattern for the question — は/です/の/も/か, これ/それ/あれ vs この/その/あの, を/に/で/へ, ます/ません), whether the answer matches the fact asked (name/country/job/age/birthday/price/floor/day/time), and natural word order. Be lenient on STT artifacts, but flag real grammar mistakes (wrong particle, wrong demonstrative form, missing です/ます) as concrete tips in Vietnamese. ' +
        GRADE_JSON_SPEC
    : 'You are a supportive FPTU speaking-exam grader. The student answered speaking questions in English; you are given the auto-transcribed text (via speech-to-text, so tolerate minor STT noise). Grade: content & relevance to the questions, fluency & coherence, grammar, and vocabulary. Give pronunciation-oriented tips where the transcript hints at issues, but be fair about STT limits. ' +
        GRADE_JSON_SPEC;
  const qa = params.speakingPrompts.map((p, i) => `Q${i + 1}: ${p.text}\nA${i + 1} (transcribed): ${params.transcripts[i] || '(no answer)'}`).join('\n\n');
  const rubricText = Array.isArray(params.rubric) && params.rubric.length
    ? `\n\nRUBRIC / MODEL ANSWERS (use to check factual correctness, not as the only acceptable wording):\n${(params.rubric as Array<{ id?: string; criterion?: string; weight?: number }>).map((c) => `- ${c.id ?? ''} (weight ${c.weight ?? 1}): ${c.criterion ?? ''}`).join('\n')}`
    : '';
  const user = [`TASK / PROBLEM:\n${params.prompt}`, `QUESTIONS & TRANSCRIBED ANSWERS:\n${qa}`, rubricText, 'Grade now.'].filter(Boolean).join('\n\n');
  const raw = await callGrader(params.userId, system, user);
  const g = normalizeGrade(raw, params.points);
  return { ...g, transcript: joined };
}

// ── Speaking question auto-generation (when the paper has none) ────────
/** Generate exam speaking sub-questions derived from a problem/topic. */
export async function generateSpeakingQuestions(userId: number, prompt: string, count = 4): Promise<Array<{ text: string }>> {
  ensureAi();
  const system =
    'You generate speaking-exam questions for an English oral test. Given a topic/problem, produce natural, escalating questions (warm-up → opinion → deeper follow-up) a student answers aloud in English. ' +
    'Return ONLY a JSON array of objects: [{"text": "English question|||Câu hỏi tiếng Việt"}]. Each "text" MUST be bilingual "English|||Tiếng Việt".';
  const user = `TOPIC / PROBLEM:\n${prompt}\n\nGenerate exactly ${count} questions.`;
  const res = await llmComplete({ step: 'interview', feature: 'interview', system, messages: [{ role: 'user', content: user }], maxTokens: 900, userId, maxRetries: 1, timeoutMs: 30_000 });
  try {
    const arr = extractJson<Array<{ text?: string }>>(res.text);
    return (Array.isArray(arr) ? arr : []).slice(0, count).map((q) => ({ text: String(q.text ?? '') })).filter((q) => q.text);
  } catch {
    return [];
  }
}
