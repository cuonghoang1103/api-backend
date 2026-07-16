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
import { llmComplete, checkTokenQuota, isAiAvailable, extractJson, type LLMMessage } from './interview/llm/index.js';
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
 * Tolerant JSON parse for LLM output. `extractJson` throws on the common
 * failure modes of conversational content (unescaped inner double-quotes,
 * smart quotes, trailing commas, stray prose) — which surfaced as "AI đang
 * bận" after a few turns. Try extractJson, then a light repair, else {}.
 */
export function looseJson(text: string): Record<string, unknown> {
  try {
    return extractJson<Record<string, unknown>>(text);
  } catch {
    /* fall through to repair */
  }
  try {
    let t = String(text || '').replace(/```(?:json)?/gi, '').trim();
    const a = t.indexOf('{');
    const b = t.lastIndexOf('}');
    if (a >= 0 && b > a) t = t.slice(a, b + 1);
    t = t
      .replace(/[“”]/g, '"') // smart double quotes → "
      .replace(/[‘’]/g, '\'') // smart single quotes → '
      .replace(/[\x00-\x1F]+/g, ' ') // control chars (incl. raw newlines)
      .replace(/,\s*([}\]])/g, '$1'); // trailing commas
    return JSON.parse(t) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Last-resort: pull a single string field's value even from broken JSON. */
export function grabField(text: string, field: string): string {
  const re = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"\\s*(?:,\\s*"\\w+"\\s*:|}\\s*$|}\\s*[,\\]])`, 'm');
  const m = String(text || '').match(re);
  return m ? m[1].replace(/\\"/g, '"').replace(/\s+/g, ' ').trim() : '';
}

/** Strip JSON/markdown scaffolding to salvage plain text (role-play fallback). */
function salvageText(text: string): string {
  let t = String(text || '').replace(/```(?:json)?/gi, '').trim();
  const grabbed = grabField(t, 'reply');
  if (grabbed) return grabbed;
  // Otherwise drop obvious JSON braces/keys and return what's left.
  t = t.replace(/^\s*\{/, '').replace(/\}\s*$/, '').replace(/"\w+"\s*:/g, '').replace(/["{}]/g, '').trim();
  return t.slice(0, 500);
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
    result = normalize(kind, title, looseJson(res.text));
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
    'You are given the TARGET the learner tried to read aloud and HEARD — what a speech-to-text engine transcribed from their recording. ' +
    'Judge how close their pronunciation was, being fair about STT noise. ALWAYS write feedback and tips in natural Vietnamese (tiếng Việt). ' +
    'Return ONLY a minified JSON object: {"score": number (0-100), "verdict": "good"|"ok"|"poor", "feedback": string, "tips": [string]}. ' +
    'score ≥85 → "good", 60–84 → "ok", <60 → "poor". Keep feedback to 1–3 sentences; 1–3 short tips on the specific sounds/words to fix.';
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
    parsed = looseJson(res.text);
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
    : 'Trộn câu hỏi dùng-từ-trong-ngữ-cảnh (điền chỗ trống, "câu nào dùng đúng"), không chỉ hỏi nghĩa.';
  const system =
    `You are a language quiz generator for a Vietnamese speaker learning ${languageName(code)}. ` +
    `Create exactly ${count} multiple-choice questions (each with EXACTLY 4 options, one correct) that test real understanding of the given words. ` +
    `${styleNote} Question prompts and explanations MUST be in Vietnamese (tiếng Việt); the ${languageName(code)} words/sentences themselves stay in ${languageName(code)}. ` +
    'Distractors must be plausible. Return ONLY a minified JSON object: ' +
    '{"questions":[{"prompt":string,"options":[string,string,string,string],"correctIndex":number,"explanation":string}]}. correctIndex is 0-based.';
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
    parsed = looseJson(res.text) as { questions?: unknown };
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
    'Judge correctness AND language quality fairly. ALWAYS write feedback in Vietnamese (tiếng Việt). ' +
    'Return ONLY a minified JSON object: {"score": number (0-100), "verdict": "good"|"ok"|"poor", "feedback": string, "corrected": string}. ' +
    `"corrected" = an improved/corrected version of the learner's answer in ${languageName(code)} (empty string if the answer is already good). ` +
    'score ≥85 → "good", 60–84 → "ok", <60 → "poor". Keep feedback to 1–3 sentences.';
  const user = `QUESTION: ${prompt}\nLEARNER ANSWER: ${answer}${sample ? `\nSAMPLE ANSWER: ${sample}` : ''}`;

  let parsed: Record<string, unknown> = {};
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 900,
      maxRetries: 1,
      timeoutMs: 30_000,
      userId,
    });
    parsed = looseJson(res.text);
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

// ── Phase 4a: Writing feedback ────────────────────────────────────
export interface WritingCorrection {
  original: string;
  suggestion: string;
  note: string;
}
export interface WritingFeedback {
  score: number; // 0–100
  level: string; // e.g. "B1" / "N4" / '' when unsure
  verdict: PronounceVerdict;
  feedback: string;
  corrected: string; // full rewritten version in the target language
  corrections: WritingCorrection[];
}

/** Grade a free composition: score + level + specific corrections + rewrite. */
export async function gradeWriting(
  userId: number,
  body: { languageCode?: string; text?: string; prompt?: string },
): Promise<WritingFeedback> {
  const code = (body?.languageCode || '').trim();
  const text = (body?.text || '').trim();
  const prompt = (body?.prompt || '').trim();
  if (!text) throw new BadRequestError('Bạn chưa viết gì.');
  if (text.length > 4000) throw new BadRequestError('Bài viết quá dài (tối đa ~4000 ký tự).');

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Chấm bài viết dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const langName = languageName(code);
  const focus =
    code === 'ja'
      ? 'Chú trọng trợ từ (は/が/を/に…), thể lịch sự (ます/です ↔ thể thường), trật tự từ và cách diễn đạt tự nhiên.'
      : isCjk(code)
        ? 'Chú trọng ngữ pháp, trật tự từ và cách diễn đạt tự nhiên.'
        : 'Chú trọng ngữ pháp, chính tả, collocation, và ước lượng band/CEFR.';
  const system =
    `You are a supportive writing teacher for a Vietnamese speaker learning ${langName}. ${focus} ` +
    `Grade the composition fairly and ALWAYS write feedback/notes in Vietnamese (tiếng Việt); the ${langName} text (corrected + suggestions) stays in ${langName}. ` +
    'Return ONLY a minified JSON object: {"score": number (0-100), "level": string, "verdict": "good"|"ok"|"poor", "feedback": string, "corrected": string, "corrections": [{"original": string, "suggestion": string, "note": string}]}. ' +
    'Escape any double-quote inside a string as \\". No text outside the JSON. ' +
    `"level" is a short proficiency estimate (e.g. "B1", "N4") or "" if unsure. "corrected" is the full improved version in ${langName}. ` +
    '"corrections" lists up to 8 specific fixes (original phrase → suggestion + a short VI note). score ≥85 → "good", 60–84 → "ok", <60 → "poor".';
  const user = `${prompt ? `ĐỀ BÀI: ${prompt}\n\n` : ''}BÀI VIẾT:\n${text}`;

  let raw = '';
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 1900,
      maxRetries: 1,
      timeoutMs: 45_000,
      userId,
    });
    raw = res.text;
  } catch {
    throw new BadRequestError('Chấm bài đang bận, vui lòng thử lại sau giây lát.');
  }

  const parsed = looseJson(raw);
  const rawScore = Number(parsed.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : 0;
  const verdict: PronounceVerdict =
    parsed.verdict === 'good' || parsed.verdict === 'ok' || parsed.verdict === 'poor'
      ? (parsed.verdict as PronounceVerdict)
      : score >= 85 ? 'good' : score >= 60 ? 'ok' : 'poor';
  const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
  const corrections = (Array.isArray(parsed.corrections) ? parsed.corrections : [])
    .map((c) => {
      const co = (c ?? {}) as Record<string, unknown>;
      const original = str(co.original);
      const suggestion = str(co.suggestion);
      const note = str(co.note);
      if (!original && !suggestion) return null;
      return { original, suggestion, note };
    })
    .filter((c): c is WritingCorrection => c != null)
    .slice(0, 8);

  const feedback = str(parsed.feedback) || grabField(raw, 'feedback');
  const corrected = str(parsed.corrected) || grabField(raw, 'corrected');
  if (!feedback && !corrected && !corrections.length) {
    throw new BadRequestError('Chưa đọc được kết quả chấm, vui lòng thử lại.');
  }
  return { score, level: str(parsed.level), verdict, feedback, corrected, corrections };
}

// ── Phase 4b: Role-play conversation (multi-turn) ─────────────────
export interface RolePlayReply {
  reply: string; // target language
  translation: string; // Vietnamese
  correction: string; // gentle fix of the learner's last message ('' if none)
}

/** One role-play chat turn. History is passed each call (stateless). */
export async function rolePlayTurn(
  userId: number,
  body: { languageCode?: string; scenario?: string; history?: unknown; message?: string },
): Promise<RolePlayReply> {
  const code = (body?.languageCode || '').trim();
  const scenario = (body?.scenario || '').trim();
  const message = (body?.message || '').trim();
  if (!scenario) throw new BadRequestError('Thiếu tình huống.');

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Hội thoại AI dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const rawHistory = Array.isArray(body?.history) ? body!.history : [];
  const history: LLMMessage[] = rawHistory
    .map((m) => {
      const mo = (m ?? {}) as Record<string, unknown>;
      const role = mo.role === 'assistant' ? 'assistant' : mo.role === 'user' ? 'user' : null;
      const content = typeof mo.content === 'string' ? mo.content.trim() : '';
      if (!role || !content) return null;
      return { role, content } as LLMMessage;
    })
    .filter((m): m is LLMMessage => m != null)
    .slice(-12);

  const messages: LLMMessage[] = [...history];
  if (message) messages.push({ role: 'user', content: message });
  // Anthropic requires a non-empty array whose FIRST message is 'user' (the
  // opener is an assistant turn, so history can start with assistant) and a
  // trailing 'user' turn.
  if (!messages.length || messages[0].role === 'assistant') {
    messages.unshift({ role: 'user', content: '(Hãy bắt đầu cuộc hội thoại theo tình huống.)' });
  }
  if (messages[messages.length - 1].role === 'assistant') messages.push({ role: 'user', content: '(Tiếp tục.)' });

  const langName = languageName(code);
  const readingNote = isCjk(code) ? ` Với ${langName}, "reply" dùng chữ chuẩn (kèm cách đọc nếu hữu ích).` : '';
  const system =
    `You are a friendly role-play partner helping a Vietnamese speaker practice conversational ${langName}. ` +
    `Stay in character for this scenario: "${scenario}". Reply in ${langName} with SHORT, natural, realistic lines (1–2 sentences), and keep the conversation going by asking or responding naturally.${readingNote} ` +
    'Also gently correct the learner\'s LAST message if it has mistakes. ' +
    'Return ONLY a minified JSON object: {"reply": string, "translation": string, "correction": string}. ' +
    'Escape any double-quote inside a string as \\". No text outside the JSON. ' +
    `"reply" is your in-character line in ${langName}. "translation" is its Vietnamese meaning. "correction" is a brief, encouraging fix (in Vietnamese) of the learner's last message, or "" if it was fine or there was none.`;

  let raw = '';
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages,
      maxTokens: 800,
      maxRetries: 1,
      timeoutMs: 30_000,
      userId,
    });
    raw = res.text;
  } catch {
    // Genuine LLM/network failure (rare) — the only case that hard-fails now.
    throw new BadRequestError('Hội thoại AI đang bận, vui lòng thử lại sau giây lát.');
  }

  const parsed = looseJson(raw);
  const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
  // Never hard-fail on a parse issue: fall back to the raw reply so the chat
  // keeps flowing (translation/correction just come through best-effort).
  const reply = s(parsed.reply) || grabField(raw, 'reply') || salvageText(raw);
  if (!reply) throw new BadRequestError('AI chưa trả lời được, vui lòng thử lại.');
  return {
    reply,
    translation: s(parsed.translation) || grabField(raw, 'translation'),
    correction: s(parsed.correction) || grabField(raw, 'correction'),
  };
}

// ── Phase 5a: Translation (VI ⇄ target language) ──────────────────
export interface TranslateAlternative {
  text: string;
  note: string; // when to prefer this wording
}
export interface TranslateResult {
  translation: string;
  reading: string; // romaji / pinyin for CJK output; '' otherwise
  literal: string; // word-for-word gloss back into Vietnamese, to learn from
  notes: string; // grammar/register explanation, in Vietnamese
  alternatives: TranslateAlternative[];
}

/** Translate between Vietnamese and the language being learnt.
 *  `direction` 'to' = VI → target, 'from' = target → VI. Pro/Max only. */
export async function translateText(
  userId: number,
  body: { languageCode?: string; text?: string; direction?: 'to' | 'from'; tone?: string },
): Promise<TranslateResult> {
  const code = (body?.languageCode || '').trim();
  const text = (body?.text || '').trim();
  const direction = body?.direction === 'from' ? 'from' : 'to';
  const tone = (body?.tone || '').trim().slice(0, 40);
  if (!text) throw new BadRequestError('Bạn chưa nhập nội dung cần dịch.');
  if (text.length > 4000) throw new BadRequestError('Nội dung quá dài (tối đa ~4000 ký tự).');

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Dịch văn bản dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const langName = languageName(code);
  const src = direction === 'to' ? 'Vietnamese' : langName;
  const dst = direction === 'to' ? langName : 'Vietnamese';
  // Reading only makes sense for CJK output; asking for it on Vietnamese output
  // invites the model to invent one.
  const wantsReading = direction === 'to' && isCjk(code);
  const readingLabel = code === 'ja' ? 'romaji' : code === 'zh' ? 'pinyin (có dấu thanh)' : 'phiên âm';
  const register =
    code === 'ja'
      ? 'Chọn thể phù hợp (です/ます vs thể thường) theo ngữ cảnh và nêu rõ đã chọn thể nào trong "notes".'
      : isCjk(code)
        ? 'Chú ý mức độ trang trọng và lượng từ (measure words) cho đúng.'
        : 'Chú ý register (trang trọng/thân mật), collocation và mạo từ cho tự nhiên.';

  const system =
    `You are a professional translator working between Vietnamese and ${langName}, serving a Vietnamese speaker who is LEARNING ${langName}. ` +
    `Translate from ${src} into ${dst}. Produce a translation a native speaker would actually write — accurate, grammatical and natural, never word-for-word. ${register} ` +
    (tone ? `Desired tone/register: ${tone}. ` : '') +
    'ALWAYS write "literal" and "notes" in Vietnamese (tiếng Việt). ' +
    'Return ONLY a minified JSON object: {"translation": string, "reading": string, "literal": string, "notes": string, "alternatives": [{"text": string, "note": string}]}. ' +
    (wantsReading
      ? `"reading" = ${readingLabel} of the translation. `
      : '"reading" = "" (empty string; do not invent one). ') +
    '"literal" = nghĩa sát từng phần của bản dịch, giải thích bằng tiếng Việt để người học đối chiếu. ' +
    '"notes" = giải thích ngắn bằng tiếng Việt: ngữ pháp/cấu trúc đáng chú ý, sắc thái, lỗi người Việt hay mắc ở câu này. ' +
    '"alternatives" = tối đa 3 cách diễn đạt khác (trang trọng hơn/thân mật hơn/ngắn gọn hơn), mỗi cách kèm "note" tiếng Việt nói khi nào nên dùng. ' +
    'Escape any double-quote inside a string as \\". No text outside the JSON.';
  const user = `NỘI DUNG (${src} → ${dst}):\n${text}`;

  let raw = '';
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 2200,
      maxRetries: 1,
      timeoutMs: 45_000,
      userId,
    });
    raw = res.text;
  } catch {
    throw new BadRequestError('Dịch đang bận, vui lòng thử lại sau giây lát.');
  }

  const parsed = looseJson(raw);
  const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
  const alternatives = (Array.isArray(parsed.alternatives) ? parsed.alternatives : [])
    .map((a): TranslateAlternative | null => {
      const o = a as Record<string, unknown>;
      const t = s(o?.text);
      return t ? { text: t, note: s(o?.note) } : null;
    })
    .filter((a): a is TranslateAlternative => a != null)
    .slice(0, 3);

  const translation = s(parsed.translation) || grabField(raw, 'translation');
  if (!translation) throw new BadRequestError('Chưa đọc được bản dịch, vui lòng thử lại.');
  return {
    translation,
    reading: wantsReading ? s(parsed.reading) || grabField(raw, 'reading') : '',
    literal: s(parsed.literal) || grabField(raw, 'literal'),
    notes: s(parsed.notes) || grabField(raw, 'notes'),
    alternatives,
  };
}

// ── Phase 5b: Grammar check (proofreading) ────────────────────────
export interface GrammarIssue {
  original: string;
  suggestion: string;
  type: string; // e.g. "Trợ từ", "Chia động từ", "Trật tự từ"
  severity: 'error' | 'warning' | 'style';
  explanation: string; // in Vietnamese
}
export interface GrammarCheckResult {
  score: number; // 0–100
  verdict: PronounceVerdict;
  corrected: string;
  summary: string; // overall assessment, in Vietnamese
  issues: GrammarIssue[];
}

/** Proofread text in the target language: rate it, list every issue with a fix
 *  and a Vietnamese explanation, and return a corrected version. Pro/Max only. */
export async function grammarCheck(
  userId: number,
  body: { languageCode?: string; text?: string },
): Promise<GrammarCheckResult> {
  const code = (body?.languageCode || '').trim();
  const text = (body?.text || '').trim();
  if (!text) throw new BadRequestError('Bạn chưa nhập nội dung cần kiểm tra.');
  if (text.length > 4000) throw new BadRequestError('Nội dung quá dài (tối đa ~4000 ký tự).');

  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Kiểm tra ngữ pháp dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');

  const langName = languageName(code);
  const focus =
    code === 'ja'
      ? 'Soi kỹ trợ từ (は/が/を/に/で/へ), thể lịch sự vs thể thường (nhất quán trong cả đoạn), chia động từ/tính từ, tự động từ vs tha động từ, và trật tự từ.'
      : code === 'zh'
        ? 'Soi kỹ lượng từ (measure words), trật tự từ, 了/着/过, 把/被, bổ ngữ, và cách dùng hư từ.'
        : 'Soi kỹ thì và sự hoà hợp chủ ngữ–động từ, mạo từ (a/an/the), giới từ, số ít/số nhiều, collocation và dấu câu.';

  const system =
    `You are a meticulous ${langName} proofreader for a Vietnamese learner. Check the text for grammar, spelling, word choice and naturalness. ${focus} ` +
    'Be precise and complete: report EVERY real issue, but never invent one — if the text is already correct, return an empty "issues" array and say so in "summary". ' +
    'Judge only the language, never the opinions expressed. ' +
    `Keep "original", "suggestion" and "corrected" in ${langName}; ALWAYS write "type", "explanation" and "summary" in Vietnamese (tiếng Việt). ` +
    'Return ONLY a minified JSON object: {"score": number (0-100), "verdict": "good"|"ok"|"poor", "corrected": string, "summary": string, "issues": [{"original": string, "suggestion": string, "type": string, "severity": "error"|"warning"|"style", "explanation": string}]}. ' +
    '"original" = đúng đoạn văn bản gốc bị lỗi (trích nguyên văn, đủ ngắn để định vị). ' +
    '"severity": "error" = sai ngữ pháp thật sự, "warning" = dùng được nhưng không tự nhiên, "style" = gợi ý văn phong. ' +
    '"score" = độ chuẩn xác tổng thể (100 = không lỗi). "corrected" = toàn bộ văn bản đã sửa. ' +
    'Escape any double-quote inside a string as \\". No text outside the JSON.';
  const user = `VĂN BẢN (${langName}):\n${text}`;

  let raw = '';
  try {
    const res = await llmComplete({
      step: 'interview',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: 2400,
      maxRetries: 1,
      timeoutMs: 45_000,
      userId,
    });
    raw = res.text;
  } catch {
    throw new BadRequestError('Kiểm tra ngữ pháp đang bận, vui lòng thử lại sau giây lát.');
  }

  const parsed = looseJson(raw);
  const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
  const issues = (Array.isArray(parsed.issues) ? parsed.issues : [])
    .map((i): GrammarIssue | null => {
      const o = i as Record<string, unknown>;
      const original = s(o?.original);
      const suggestion = s(o?.suggestion);
      if (!original && !suggestion) return null;
      const sev = s(o?.severity);
      return {
        original,
        suggestion,
        type: s(o?.type),
        severity: sev === 'error' || sev === 'warning' || sev === 'style' ? sev : 'warning',
        explanation: s(o?.explanation),
      };
    })
    .filter((i): i is GrammarIssue => i != null)
    .slice(0, 20);

  const rawScore = Number(parsed.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, Math.round(rawScore))) : issues.length ? 0 : 100;
  const v = s(parsed.verdict);
  const verdict: PronounceVerdict =
    v === 'good' || v === 'ok' || v === 'poor' ? v : score >= 85 ? 'good' : score >= 60 ? 'ok' : 'poor';
  const corrected = s(parsed.corrected) || grabField(raw, 'corrected');
  const summary = s(parsed.summary) || grabField(raw, 'summary');
  if (!summary && !corrected && !issues.length) {
    throw new BadRequestError('Chưa đọc được kết quả kiểm tra, vui lòng thử lại.');
  }
  // A clean text legitimately has no issues — fall back to echoing the input so
  // the UI always has something to show.
  return { score, verdict, corrected: corrected || text, summary, issues };
}

// ── Phase 4c: Plain transcription (voice input for role-play) ─────
/** Transcribe audio to text (no scoring). Pro/Max only; needs Groq STT. */
export async function transcribe(
  userId: number,
  input: { audio: Buffer; filename: string; mimetype: string; languageCode?: string },
): Promise<{ text: string }> {
  if (!input.audio?.length) throw new BadRequestError('Thiếu audio.');
  if (!isAiAvailable()) throw new BadRequestError('Gia sư AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await isProEffective(userId))) throw new ForbiddenError('Nhập bằng giọng nói dành cho tài khoản Pro/Max.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Bạn đã dùng hết hạn mức AI hôm nay. Thử lại vào ngày mai nhé.');
  if (!serverSttEnabled()) throw new BadRequestError('Nhập bằng giọng nói cần bật STT (Groq) — hiện chưa khả dụng.');
  try {
    const tr = await transcribeWithGroq(input.audio, input.filename, input.mimetype, { language: whisperLang(input.languageCode || '') });
    return { text: tr.text.trim() };
  } catch {
    throw new BadRequestError('Không nhận dạng được giọng nói, vui lòng thử lại.');
  }
}
