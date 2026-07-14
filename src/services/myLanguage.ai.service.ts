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
