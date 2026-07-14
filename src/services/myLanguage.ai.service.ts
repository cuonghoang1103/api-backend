/**
 * My Language — AI services (gia sư AI).
 *
 * Reuses the Interview LLM gateway (provider-agnostic, retry/backoff, circuit
 * breaker, cost logging to InterviewLLMCallLog, per-user daily token quota,
 * kill-switch, STATIC degrade). NO new env / vendor / key — same
 * ANTHROPIC_API_KEY / LLM_BASE_URL / LLM_MODEL_INTERVIEW as the interview.
 *
 * All features here are gated to Pro/Max (isProEffective) + AI availability.
 *
 * Phase 1: explainConcept() — a Vietnamese-language tutor that explains a
 * grammar point or a vocab word (fresh examples + usage tips). Content is
 * STATIC (admin-authored) so explanations are cached in-memory keyed by the
 * item's updatedAt — repeat views cost zero tokens.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../middleware/errorHandler.js';
import { isProEffective } from './pro.service.js';
import { llmComplete, checkTokenQuota, isAiAvailable, extractJson } from './interview/llm/index.js';
import { transcribeWithGroq, serverSttEnabled } from './interview/voice/stt.js';

export type ExplainKind = 'grammar' | 'vocab';

export interface ExplainExample {
  text: string;
  reading?: string; // furigana / romaji / pinyin — for CJK
  translation?: string; // Vietnamese meaning
}
export interface ExplainResult {
  kind: ExplainKind;
  title: string;
  summary: string; // 1–2 câu tóm tắt
  explanation: string; // markdown, tiếng Việt
  examples: ExplainExample[];
  tips: string[]; // lỗi thường gặp / mẹo dùng
}

// ── In-memory cache (per backend instance) ────────────────────────
// Static content → cache the explanation keyed by item + updatedAt so admin
// edits invalidate automatically and repeat views never re-bill the LLM.
const CACHE = new Map<string, ExplainResult>();
const CACHE_CAP = 500;
function cacheGet(key: string): ExplainResult | undefined {
  return CACHE.get(key);
}
function cacheSet(key: string, val: ExplainResult): void {
  if (CACHE.size >= CACHE_CAP) {
    const first = CACHE.keys().next().value;
    if (first !== undefined) CACHE.delete(first);
  }
  CACHE.set(key, val);
}

/** Map an ISO language code to an English language name the model reasons over. */
function languageName(code: string, fallback?: string | null): string {
  const c = (code || '').toLowerCase();
  if (c === 'en') return 'English';
  if (c === 'ja') return 'Japanese';
  if (c === 'zh') return 'Chinese (Mandarin)';
  if (c === 'ko') return 'Korean';
  if (c === 'fr') return 'French';
  return fallback || code || 'the target language';
}
function isCjk(code: string): boolean {
  const c = (code || '').toLowerCase();
  return c === 'ja' || c === 'zh' || c === 'ko';
}

// ── Prompt builders ───────────────────────────────────────────────
const JSON_SHAPE =
  'Return ONLY a single minified JSON object (no markdown fences, no commentary) with this exact shape: ' +
  '{"summary": string, "explanation": string, "examples": [{"text": string, "reading": string, "translation": string}], "tips": [string]}. ' +
  '"explanation" is Markdown. "summary" is 1–2 sentences. Provide 2–4 fresh examples (NOT copied from the material). "tips" has 2–4 short items.';

function systemPrompt(code: string): string {
  const langName = languageName(code);
  const cjk = isCjk(code);
  const readingNote = cjk
    ? `Because ${langName} uses a non-Latin script, every example's "reading" MUST give the pronunciation (${code === 'ja' ? 'furigana in hiragana + romaji' : code === 'zh' ? 'pinyin with tone marks' : 'romanization'}). "translation" is the Vietnamese meaning.`
    : `"reading" may be an empty string for ${langName}. "translation" is the Vietnamese meaning of the example.`;
  return (
    `You are a warm, precise language tutor helping a Vietnamese speaker learn ${langName}. ` +
    `ALWAYS write every explanation, summary, and tip in natural Vietnamese (tiếng Việt) — only the example sentences themselves stay in ${langName}. ` +
    `Be accurate, concise, and encouraging; never invent facts. ${readingNote} ${JSON_SHAPE}`
  );
}

function grammarUserPrompt(code: string, g: { title: string; structure: string; level?: string | null; explanationText?: string | null }): string {
  const cjk = isCjk(code);
  const focus = cjk
    ? 'Nêu rõ sắc thái/ngữ cảnh dùng, mức độ lịch sự/trang trọng, và so sánh với các cấu trúc gần giống dễ nhầm.'
    : 'Nêu rõ khi nào dùng, sắc thái, và so sánh với các cấu trúc gần giống dễ nhầm (near-synonymous structures).';
  return (
    `Explain this ${languageName(code)} grammar point for a Vietnamese learner.\n` +
    `Title: ${g.title}\n` +
    `Structure: ${g.structure}\n` +
    (g.level ? `Level: ${g.level}\n` : '') +
    (g.explanationText ? `Existing note (may be terse): ${g.explanationText}\n` : '') +
    `\nYêu cầu: giải thích ý nghĩa & cách dùng bằng tiếng Việt. ${focus} Đưa ví dụ MỚI. "tips" là các lỗi người Việt hay mắc.`
  );
}

function vocabUserPrompt(
  code: string,
  w: { word: string; meaningVi: string; pronunciations: string[]; example?: string | null },
): string {
  const cjk = isCjk(code);
  const focus =
    code === 'ja'
      ? 'Nếu là Hán tự (kanji), tách nghĩa từng chữ + âm on/kun. Nêu sắc thái, mức lịch sự, và cách dùng tự nhiên.'
      : cjk
        ? 'Nếu là chữ Hán, tách nghĩa từng chữ. Nêu sắc thái và cách dùng tự nhiên.'
        : 'Nêu các từ gần nghĩa (near-synonyms) và khác biệt, các cụm đi kèm thường gặp (collocations), và sắc thái.';
  return (
    `Explain this ${languageName(code)} vocabulary item for a Vietnamese learner.\n` +
    `Word: ${w.word}\n` +
    `Known meaning (VI): ${w.meaningVi}\n` +
    (w.pronunciations.length ? `Pronunciations: ${w.pronunciations.join(', ')}\n` : '') +
    (w.example ? `Existing example: ${w.example}\n` : '') +
    `\nYêu cầu: giải thích nghĩa sâu hơn bằng tiếng Việt. ${focus} Đưa ví dụ câu MỚI. "tips" là mẹo nhớ hoặc lỗi hay gặp.`
  );
}

// ── Shape / validate the model's JSON defensively ─────────────────
function normalize(kind: ExplainKind, title: string, raw: unknown): ExplainResult {
  const o = (raw ?? {}) as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
  const examplesRaw = Array.isArray(o.examples) ? o.examples : [];
  const examples: ExplainExample[] = examplesRaw
    .slice(0, 6)
    .map((e) => {
      const eo = (e ?? {}) as Record<string, unknown>;
      const text = str(eo.text);
      if (!text) return null;
      const reading = str(eo.reading);
      const translation = str(eo.translation);
      return { text, ...(reading ? { reading } : {}), ...(translation ? { translation } : {}) };
    })
    .filter((e): e is ExplainExample => e != null);
  const tips = (Array.isArray(o.tips) ? o.tips : []).map(str).filter(Boolean).slice(0, 6);
  return {
    kind,
    title,
    summary: str(o.summary),
    explanation: str(o.explanation),
    examples,
    tips,
  };
}

function toPlainText(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'string') {
    // TipTap explanation may be an HTML string — strip tags for the prompt.
    const t = v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return t || null;
  }
  try {
    const t = JSON.stringify(v).replace(/[{}[\]"]/g, ' ').replace(/\s+/g, ' ').trim();
    return t ? t.slice(0, 600) : null;
  } catch {
    return null;
  }
}

/**
 * Explain a grammar point or vocab word with the AI tutor.
 * Pro/Max only; degrades with a friendly error when AI is off.
 */
export async function explainConcept(
  userId: number,
  body: { languageCode?: string; kind?: string; itemId?: number | string },
): Promise<ExplainResult> {
  const kind = body?.kind === 'grammar' || body?.kind === 'vocab' ? (body.kind as ExplainKind) : null;
  const itemId = Number(body?.itemId);
  if (!kind) throw new BadRequestError('kind phải là "grammar" hoặc "vocab".');
  if (!Number.isInteger(itemId) || itemId <= 0) throw new BadRequestError('itemId không hợp lệ.');

  // Gate: AI on + Pro + under daily quota.
  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Gia sư AI dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  let code: string;
  let title: string;
  let updatedAt: Date;
  let system: string;
  let user: string;

  if (kind === 'grammar') {
    const g = await prisma.langGrammarPoint.findUnique({ where: { id: itemId }, include: { language: true } });
    if (!g) throw new NotFoundError('Không tìm thấy điểm ngữ pháp.');
    code = g.language.code;
    title = g.title;
    updatedAt = g.updatedAt;
    system = systemPrompt(code);
    user = grammarUserPrompt(code, {
      title: g.title,
      structure: g.structure,
      level: g.level,
      explanationText: toPlainText(g.explanation),
    });
  } else {
    const w = await prisma.langVocabWord.findUnique({
      where: { id: itemId },
      include: { pronunciations: { orderBy: { order: 'asc' } }, category: { include: { language: true } } },
    });
    if (!w) throw new NotFoundError('Không tìm thấy từ vựng.');
    code = w.category.language.code;
    title = w.word;
    updatedAt = w.updatedAt;
    system = systemPrompt(code);
    user = vocabUserPrompt(code, {
      word: w.word,
      meaningVi: w.meaningVi,
      pronunciations: w.pronunciations.map((p) => `${p.type}: ${p.value}`),
      example: w.exampleSentence,
    });
  }

  const cacheKey = `${kind}:${itemId}:${updatedAt.getTime()}`;
  const hit = cacheGet(cacheKey);
  if (hit) return hit;

  let result: ExplainResult;
  try {
    const res = await llmComplete({
      step: 'interview', // cheap/fast model (haiku) — enough for explanations
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 1200,
      maxRetries: 1,
      timeoutMs: 30_000,
      userId,
    });
    result = normalize(kind, title, extractJson(res.text));
  } catch {
    throw new BadRequestError('Gia sư AI đang bận, vui lòng thử lại sau giây lát.');
  }

  if (!result.explanation && result.examples.length === 0) {
    throw new BadRequestError('Không tạo được lời giải thích, vui lòng thử lại.');
  }

  cacheSet(cacheKey, result);
  return result;
}

// ── Phase 2: Pronunciation scoring (Groq Whisper + LLM) ───────────
export type PronounceVerdict = 'good' | 'ok' | 'poor';
export interface PronunciationResult {
  target: string;
  heard: string; // what the STT actually transcribed
  score: number; // 0–100
  verdict: PronounceVerdict;
  feedback: string; // tiếng Việt
  tips: string[];
}

/** Map an ISO language code to the Whisper language code (bcp-47 short). */
function whisperLang(code: string): string {
  const c = (code || '').toLowerCase();
  if (c === 'ja' || c === 'en' || c === 'zh' || c === 'ko' || c === 'fr' || c === 'vi') return c;
  return 'en';
}

/**
 * Score how well the learner pronounced `target`: transcribe their recording
 * with Groq Whisper, then have the LLM compare heard-vs-target and grade it.
 * Pro/Max only; needs STT_PROVIDER=groq (degrades with a friendly error).
 */
export async function scorePronunciation(
  userId: number,
  input: { audio: Buffer; filename: string; mimetype: string; languageCode?: string; target?: string; reading?: string },
): Promise<PronunciationResult> {
  const target = (input.target || '').trim();
  const code = (input.languageCode || '').trim();
  if (!target) throw new BadRequestError('Thiếu nội dung cần đọc.');
  if (!input.audio?.length) throw new BadRequestError('Thiếu audio.');

  // Gate: AI on + Pro + under daily quota.
  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Chấm phát âm dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');
  if (!serverSttEnabled()) throw new BadRequestError('Chấm phát âm cần bật STT (Groq) — hiện chưa khả dụng.');

  // Transcribe. NO target hint: hinting Whisper with the answer makes it "hear"
  // the answer even when mispronounced, which would hide real errors.
  let heard = '';
  try {
    const tr = await transcribeWithGroq(input.audio, input.filename, input.mimetype, { language: whisperLang(code) });
    heard = tr.text.trim();
  } catch {
    throw new BadRequestError('Không nhận dạng được giọng nói, vui lòng thu âm lại rõ hơn.');
  }
  if (!heard) {
    return { target, heard: '', score: 0, verdict: 'poor', feedback: 'Không nghe rõ giọng đọc. Hãy thu âm ở nơi yên tĩnh và đọc to, rõ hơn nhé.', tips: [] };
  }

  const langName = languageName(code);
  const readingLine = input.reading ? `Cách đọc chuẩn: ${input.reading}\n` : '';
  const system =
    `You are a supportive pronunciation coach for a Vietnamese speaker learning ${langName}. ` +
    `You are given the TARGET the learner tried to read aloud and HEARD — what a speech-to-text engine transcribed from their recording. ` +
    `Judge how close their pronunciation was, being fair about STT noise. ALWAYS write feedback and tips in natural Vietnamese (tiếng Việt). ` +
    `Return ONLY a minified JSON object: {"score": number (0-100), "verdict": "good"|"ok"|"poor", "feedback": string, "tips": [string]}. ` +
    `score ≥85 → "good", 60–84 → "ok", <60 → "poor". Keep feedback to 1–3 sentences; 1–3 short tips on the specific sounds/words to fix.`;
  const user = `TARGET: ${target}\n${readingLine}HEARD (STT): ${heard}`;

  let parsed: Record<string, unknown> = {};
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 600,
      maxRetries: 1,
      timeoutMs: 30_000,
      userId,
    });
    parsed = extractJson<Record<string, unknown>>(res.text);
  } catch {
    throw new BadRequestError('Chấm phát âm đang bận, vui lòng thử lại sau giây lát.');
  }

  const rawScore = Number(parsed.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0;
  const verdict: PronounceVerdict =
    parsed.verdict === 'good' || parsed.verdict === 'ok' || parsed.verdict === 'poor'
      ? (parsed.verdict as PronounceVerdict)
      : score >= 85 ? 'good' : score >= 60 ? 'ok' : 'poor';
  const feedback = typeof parsed.feedback === 'string' ? parsed.feedback.trim() : '';
  const tips = (Array.isArray(parsed.tips) ? parsed.tips : [])
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter(Boolean)
    .slice(0, 5);

  return { target, heard, score, verdict, feedback, tips };
}

// ── Phase 3a: AI-generated quiz from a vocab set ──────────────────
export interface AiQuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
export interface AiQuiz {
  questions: AiQuizQuestion[];
}

/**
 * Generate a context-aware multiple-choice quiz from the learner's vocab set.
 * Smarter than the static word↔meaning quiz: usage-in-context, JA readings/
 * particles, EN CEFR usage. Pro/Max only; not cached (variety each run).
 */
export async function generateQuiz(
  userId: number,
  body: { languageCode?: string; categoryId?: number | string; count?: number | string },
): Promise<AiQuiz> {
  const code = (body?.languageCode || '').trim();
  if (!code) throw new BadRequestError('Thiếu mã ngôn ngữ.');
  const count = Math.max(3, Math.min(10, Number(body?.count) || 6));
  const categoryId = Number(body?.categoryId);

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Quiz AI dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const words = await prisma.langVocabWord.findMany({
    where: {
      category: { language: { code }, ...(Number.isInteger(categoryId) && categoryId > 0 ? { id: categoryId } : {}) },
    },
    include: { pronunciations: { orderBy: { order: 'asc' } } },
    take: 24,
    orderBy: { id: 'asc' },
  });
  if (words.length < 4) throw new BadRequestError('Cần ít nhất 4 từ để tạo quiz. Hãy chọn chủ đề có nhiều từ hơn.');

  const cjk = isCjk(code);
  const list = words
    .map((w) => {
      const reading = w.pronunciations.map((p) => `${p.type}:${p.value}`).join(' / ');
      return `- ${w.word}${reading ? ` (${reading})` : ''} = ${w.meaningVi}${w.exampleSentence ? ` | vd: ${w.exampleSentence}` : ''}`;
    })
    .join('\n');

  const styleNote = cjk
    ? `Vì ${languageName(code)} dùng chữ không phải Latinh, hãy TRỘN thêm câu hỏi về CÁCH ĐỌC (đọc đúng của từ) và ${code === 'ja' ? 'trợ từ / thể lịch sự' : 'thanh điệu / cách dùng'}.`
    : `Trộn câu hỏi dùng-từ-trong-ngữ-cảnh (điền chỗ trống, "câu nào dùng đúng"), không chỉ hỏi nghĩa.`;
  const system =
    `You are a language quiz generator for a Vietnamese speaker learning ${languageName(code)}. ` +
    `Create exactly ${count} multiple-choice questions (each with EXACTLY 4 options, one correct) that test real understanding of the given words. ` +
    `${styleNote} Question prompts and explanations MUST be in Vietnamese (tiếng Việt); the ${languageName(code)} words/sentences themselves stay in ${languageName(code)}. ` +
    `Distractors must be plausible. Return ONLY a minified JSON object: ` +
    `{"questions":[{"prompt":string,"options":[string,string,string,string],"correctIndex":number,"explanation":string}]}. correctIndex is 0-based.`;
  const user = `Danh sách từ vựng:\n${list}`;

  let parsed: { questions?: unknown };
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 1500,
      maxRetries: 1,
      timeoutMs: 40_000,
      userId,
    });
    parsed = extractJson<{ questions?: unknown }>(res.text);
  } catch {
    throw new BadRequestError('Tạo quiz đang bận, vui lòng thử lại sau giây lát.');
  }

  const rawQs = Array.isArray(parsed.questions) ? parsed.questions : [];
  const questions: AiQuizQuestion[] = rawQs
    .map((q) => {
      const qo = (q ?? {}) as Record<string, unknown>;
      const prompt = typeof qo.prompt === 'string' ? qo.prompt.trim() : '';
      const options = (Array.isArray(qo.options) ? qo.options : [])
        .map((o) => (typeof o === 'string' ? o.trim() : ''))
        .filter(Boolean)
        .slice(0, 4);
      let correctIndex = Number(qo.correctIndex);
      if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;
      const explanation = typeof qo.explanation === 'string' ? qo.explanation.trim() : '';
      if (!prompt || options.length < 2) return null;
      return { prompt, options, correctIndex, ...(explanation ? { explanation } : {}) };
    })
    .filter((q): q is AiQuizQuestion => q != null)
    .slice(0, count);

  if (!questions.length) throw new BadRequestError('Không tạo được quiz, vui lòng thử lại.');
  return { questions };
}

// ── Phase 3b: Grade a free-text answer ────────────────────────────
export interface AiGradeResult {
  score: number; // 0–100
  verdict: PronounceVerdict; // good | ok | poor
  feedback: string;
  corrected: string; // improved version of the learner's answer ('' if none)
}

/** Grade a learner's free-text answer against a question (+ optional sample). */
export async function gradeAnswer(
  userId: number,
  body: { languageCode?: string; prompt?: string; answer?: string; sampleAnswer?: string },
): Promise<AiGradeResult> {
  const code = (body?.languageCode || '').trim();
  const prompt = (body?.prompt || '').trim();
  const answer = (body?.answer || '').trim();
  const sample = (body?.sampleAnswer || '').trim();
  if (!answer) throw new BadRequestError('Bạn chưa viết câu trả lời.');
  if (!prompt) throw new BadRequestError('Thiếu câu hỏi.');

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Chấm bài AI dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const system =
    `You are a supportive teacher grading a Vietnamese learner's free-text answer to a ${languageName(code)} reading-comprehension question. ` +
    `Judge correctness AND language quality fairly. ALWAYS write feedback in Vietnamese (tiếng Việt). ` +
    `Return ONLY a minified JSON object: {"score": number (0-100), "verdict": "good"|"ok"|"poor", "feedback": string, "corrected": string}. ` +
    `"corrected" = an improved/corrected version of the learner's answer in ${languageName(code)} (empty string if the answer is already good). ` +
    `score ≥85 → "good", 60–84 → "ok", <60 → "poor". Keep feedback to 1–3 sentences.`;
  const user = `QUESTION: ${prompt}\nLEARNER ANSWER: ${answer}${sample ? `\nSAMPLE ANSWER: ${sample}` : ''}`;

  let parsed: Record<string, unknown> = {};
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 700,
      maxRetries: 1,
      timeoutMs: 30_000,
      userId,
    });
    parsed = extractJson<Record<string, unknown>>(res.text);
  } catch {
    throw new BadRequestError('Chấm bài đang bận, vui lòng thử lại sau giây lát.');
  }

  const rawScore = Number(parsed.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0;
  const verdict: PronounceVerdict =
    parsed.verdict === 'good' || parsed.verdict === 'ok' || parsed.verdict === 'poor'
      ? (parsed.verdict as PronounceVerdict)
      : score >= 85 ? 'good' : score >= 60 ? 'ok' : 'poor';
  const feedback = typeof parsed.feedback === 'string' ? parsed.feedback.trim() : '';
  const corrected = typeof parsed.corrected === 'string' ? parsed.corrected.trim() : '';

  return { score, verdict, feedback, corrected };
}
