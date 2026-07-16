/**
 * My Language — ADMIN AI content generation.
 *
 * Lets an admin generate real learning content (vocab / grammar / conversation /
 * Q&A / reading-questions) with an LLM, then review (preview → tick → commit).
 * Modeled on the interview question generator: existing items are fed to the
 * prompt AND filtered by a normalized key so nothing duplicates what's there.
 *
 * ADMIN-gated at the route layer (adminRouter uses requireRole('ADMIN')), so
 * here we only check AI availability + the shared token quota — NOT Pro.
 * Reuses the interview LLM gateway (step 'generation' = strongest model) — no
 * new vendor/key. Inserts via the existing create* helpers in myLanguage.service.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { looseJson } from './myLanguage.ai.service.js';
import {
  createVocabWord,
  createGrammar,
  createConversation,
  createQna,
  createReading,
  updateReading,
} from './myLanguage.service.js';

// 'reading' = comprehension questions for one existing article;
// 'reading-article' = a whole new reading passage (+ translation + questions).
export type GenSection = 'vocab' | 'grammar' | 'conversation' | 'qna' | 'reading' | 'reading-article';
const SECTIONS: GenSection[] = ['vocab', 'grammar', 'conversation', 'qna', 'reading', 'reading-article'];

export interface GenProposal {
  key: string;
  summary: string;
  data: Record<string, unknown>;
}

function languageName(code: string, fallback?: string | null): string {
  const c = (code || '').toLowerCase();
  if (c === 'en') return 'English';
  if (c === 'ja') return 'Japanese';
  if (c === 'zh') return 'Chinese (Mandarin)';
  if (c === 'ko') return 'Korean';
  if (c === 'fr') return 'French';
  return fallback || code || 'the target language';
}
function pronNote(code: string): string {
  const c = (code || '').toLowerCase();
  if (c === 'ja') return 'Pronunciations MUST include {"type":"hiragana","value":...} and {"type":"romaji","value":...}.';
  if (c === 'zh') return 'Pronunciations MUST include {"type":"pinyin","value":...} (with tone marks).';
  if (c === 'ko') return 'Pronunciations MUST include {"type":"romaja","value":...}.';
  return 'Pronunciations may be an empty array or include {"type":"IPA","value":...}.';
}
function norm(s: unknown): string {
  return String(s ?? '').trim().toLowerCase().slice(0, 120);
}
function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}
function toPlainText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  try {
    return JSON.stringify(v).replace(/[{}[\]"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 3000);
  } catch {
    return '';
  }
}
function genId(i: number): string {
  return `q_${Date.now().toString(36)}_${i}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Per-item salvage: when the whole {items:[...]} JSON won't parse (one item's
 * unescaped inner double-quote breaks the entire array), pull each top-level
 * `{...}` object out by BALANCED BRACE counting (quote-agnostic) so valid items
 * survive. Each object is then parsed leniently by the caller (looseJson).
 */
function extractObjects(raw: string): string[] {
  const text = String(raw || '');
  const start = text.indexOf('"items"');
  const s = start >= 0 ? text.slice(start) : text;
  const objs: string[] = [];
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
        objs.push(s.slice(from, i + 1));
        from = -1;
      } else if (depth < 0) {
        depth = 0;
      }
    }
  }
  // Drop the very first object if it's the outer wrapper (no useful fields).
  return objs;
}

async function loadLanguage(code: string): Promise<{ id: number; code: string }> {
  const lang = await prisma.language.findUnique({ where: { code: String(code || '').trim() }, select: { id: true, code: true } });
  if (!lang) throw new NotFoundError('Không tìm thấy ngôn ngữ.');
  return lang;
}

// ── Existing keys (dedup) + a short sample string for the prompt ───
async function existingContext(section: GenSection, languageId: number, categoryId?: number, articleId?: number): Promise<{ keys: Set<string>; sample: string }> {
  if (section === 'vocab') {
    const rows = await prisma.langVocabWord.findMany({
      where: categoryId ? { categoryId } : { category: { languageId } },
      select: { word: true },
      orderBy: { id: 'desc' },
      take: 200,
    });
    return { keys: new Set(rows.map((r) => norm(r.word))), sample: rows.slice(0, 120).map((r) => r.word).join(', ') };
  }
  if (section === 'grammar') {
    const rows = await prisma.langGrammarPoint.findMany({ where: { languageId }, select: { title: true }, orderBy: { id: 'desc' }, take: 150 });
    return { keys: new Set(rows.map((r) => norm(r.title))), sample: rows.slice(0, 80).map((r) => r.title).join('; ') };
  }
  if (section === 'conversation') {
    const rows = await prisma.langConversationItem.findMany({ where: { languageId }, select: { question: true }, orderBy: { id: 'desc' }, take: 150 });
    return { keys: new Set(rows.map((r) => norm(r.question))), sample: rows.slice(0, 80).map((r) => r.question).join('; ') };
  }
  if (section === 'qna') {
    const rows = await prisma.langQnaItem.findMany({ where: { languageId }, select: { question: true }, orderBy: { id: 'desc' }, take: 150 });
    return { keys: new Set(rows.map((r) => norm(r.question))), sample: rows.slice(0, 80).map((r) => r.question).join('; ') };
  }
  if (section === 'reading-article') {
    const rows = await prisma.langReadingArticle.findMany({ where: { languageId }, select: { title: true }, orderBy: { id: 'desc' }, take: 150 });
    return { keys: new Set(rows.map((r) => norm(r.title))), sample: rows.slice(0, 80).map((r) => r.title).join('; ') };
  }
  // reading — existing questions on the article
  const article = await prisma.langReadingArticle.findUnique({ where: { id: articleId ?? 0 }, select: { questions: true } });
  const qs = Array.isArray(article?.questions) ? (article!.questions as Array<Record<string, unknown>>) : [];
  return { keys: new Set(qs.map((q) => norm(q.prompt))), sample: qs.map((q) => String(q.prompt ?? '')).join('; ') };
}

/** Friendly "already full" message per section when dedup leaves nothing new. */
function fullMessage(section: GenSection, level: string, topic: string): string {
  const lv = level ? `cấp ${level}` : 'cấp này';
  const tp = topic ? ` (chủ đề "${topic}")` : '';
  if (section === 'grammar') return `Ngữ pháp ${lv} có vẻ đã đầy đủ${tp} — AI không tìm thêm được điểm mới. Thử cấp độ hoặc chủ đề khác.`;
  if (section === 'vocab') return `Danh mục này có vẻ đã đủ từ cho ${lv}${tp} — AI không tìm thêm được từ mới. Thử đổi chủ đề/cấp độ.`;
  if (section === 'conversation') return `Hội thoại ${lv}${tp} có vẻ đã đầy đủ — không có mẫu câu mới. Thử chủ đề/cấp độ khác.`;
  if (section === 'qna') return `Q&A ${lv}${tp} có vẻ đã đầy đủ — không có câu mới. Thử chủ đề/cấp độ khác.`;
  if (section === 'reading-article') return `Bài đọc ${lv}${tp} có vẻ đã đủ — trùng tiêu đề đã có. Thử chủ đề khác.`;
  return 'Câu hỏi cho bài đọc này có vẻ đã đầy đủ — thử lại hoặc thêm thủ công.';
}

// ── Per-section prompt + item normalizer ──────────────────────────
function buildPrompts(section: GenSection, code: string, count: number, level: string, topic: string, sample: string, articleText?: string): { system: string; user: string } {
  const langName = languageName(code);
  const lv = level ? ` at level ${level}` : '';
  const tp = topic ? ` on the topic "${topic}"` : '';
  const viNote = `Explanations, meanings and notes MUST be in Vietnamese (tiếng Việt); the ${langName} text stays in ${langName}.`;
  const noDup = sample ? `\n\nThese ALREADY EXIST — do NOT duplicate or paraphrase them:\n${sample}` : '';
  let shape = '';
  let intro = '';
  if (section === 'vocab') {
    intro = `Generate ${count} ${langName} vocabulary entries${lv}${tp}. ${pronNote(code)} ${viNote}`;
    shape = '{"items":[{"word":string,"meaningVi":string,"exampleSentence":string,"exampleMeaning":string,"note":string,"pronunciations":[{"type":string,"value":string}]}]}';
  } else if (section === 'grammar') {
    intro = `Generate ${count} ${langName} grammar points${lv}${tp}. "explanation" is a SHORT PLAIN-TEXT explanation in Vietnamese (2-4 sentences, NO HTML tags). "examples" each: sentence (in ${langName}), pronunciation (reading), meaningVi. ${viNote}`;
    shape = '{"items":[{"level":string,"title":string,"structure":string,"explanation":string,"examples":[{"sentence":string,"pronunciation":string,"meaningVi":string}],"commonMistakes":string,"comparedWith":string}]}';
  } else if (section === 'conversation') {
    intro = `Generate ${count} ${langName} daily-conversation Q/A pairs${lv}${tp}. Include the reading (pronunciation) for both lines and the Vietnamese meaning. ${viNote}`;
    shape = '{"items":[{"question":string,"answer":string,"questionPronunciation":string,"answerPronunciation":string,"meaningVi":string}]}';
  } else if (section === 'qna') {
    intro = `Generate ${count} ${langName} FAQ-style question/answer pairs${lv}${tp}. Include the reading of the answer and the Vietnamese meaning. ${viNote}`;
    shape = '{"items":[{"question":string,"answer":string,"pronunciation":string,"meaningVi":string}]}';
  } else if (section === 'reading-article') {
    intro =
      `Write ${count} complete, engaging ${langName} reading passage(s)${lv}${tp} for learners. ` +
      `Each passage: a "title" in ${langName}; "content" = the passage as an HTML string of several <p> paragraphs in ${langName} (length appropriate to the level — short for A1/N5, longer for B2+); ` +
      '"translation" = a faithful Vietnamese translation, also an HTML string of <p> paragraphs aligned to the content; ' +
      '"questions" = 3-5 comprehension questions based on the passage (mix "mc" with 4 options + 0-based correctIndex, and "open" with sampleAnswer). Prompts/explanations in Vietnamese.';
    shape = '{"items":[{"title":string,"content":string,"translation":string,"questions":[{"kind":"mc","prompt":string,"options":[string,string,string,string],"correctIndex":number,"explanation":string}|{"kind":"open","prompt":string,"sampleAnswer":string,"explanation":string}]}]}';
  } else {
    intro = `Generate ${count} comprehension questions STRICTLY based on the ${langName} reading passage below. Mix multiple-choice and open questions. For "mc": 4 options + 0-based correctIndex. Prompts/explanations in Vietnamese; keep option text faithful to the passage. ${viNote}\n\nPASSAGE:\n${(articleText || '').slice(0, 3500)}`;
    shape = '{"items":[{"kind":"mc","prompt":string,"options":[string,string,string,string],"correctIndex":number,"explanation":string} | {"kind":"open","prompt":string,"sampleAnswer":string,"explanation":string}]}';
  }
  return {
    system:
      `You are an expert ${langName} teacher creating high-quality learning content for Vietnamese learners. ${intro} ` +
      'CRITICAL: inside every JSON string value, NEVER use the raw double-quote character ("). If you need to quote something, use single quotes or the corner brackets 「」/『』. Do not add any text outside the JSON. ' +
      `Return ONLY a minified JSON object with this exact shape: ${shape}`,
    user: `Hãy tạo nội dung.${noDup}`,
  };
}

/** Normalize + validate the comprehension-question objects on an AI article. */
function normReadingQuestions(raw: unknown): Array<Record<string, unknown>> {
  const arr = Array.isArray(raw) ? raw : [];
  const out: Array<Record<string, unknown>> = [];
  for (const q of arr.slice(0, 6)) {
    const qo = (q ?? {}) as Record<string, unknown>;
    const prompt = str(qo.prompt);
    if (!prompt) continue;
    if (qo.kind === 'open') {
      out.push({ kind: 'open', prompt, sampleAnswer: str(qo.sampleAnswer), explanation: str(qo.explanation) });
    } else {
      const options = (Array.isArray(qo.options) ? qo.options : []).map(str).filter(Boolean).slice(0, 4);
      if (options.length < 2) continue;
      let ci = Number(qo.correctIndex);
      if (!Number.isInteger(ci) || ci < 0 || ci >= options.length) ci = 0;
      out.push({ kind: 'mc', prompt, options, correctIndex: ci, explanation: str(qo.explanation) });
    }
  }
  return out;
}

function normalizeItem(section: GenSection, raw: unknown): GenProposal | null {
  const o = (raw ?? {}) as Record<string, unknown>;
  if (section === 'vocab') {
    const word = str(o.word);
    const meaningVi = str(o.meaningVi);
    if (!word || !meaningVi) return null;
    const pronunciations = (Array.isArray(o.pronunciations) ? o.pronunciations : [])
      .map((p) => ({ type: str((p as Record<string, unknown>)?.type), value: str((p as Record<string, unknown>)?.value) }))
      .filter((p) => p.type && p.value)
      .slice(0, 4);
    const data = { word, meaningVi, exampleSentence: str(o.exampleSentence), exampleMeaning: str(o.exampleMeaning), note: str(o.note), pronunciations };
    return { key: norm(word), summary: `${word} — ${meaningVi}`, data };
  }
  if (section === 'grammar') {
    const title = str(o.title);
    const structure = str(o.structure);
    if (!title || !structure) return null;
    const examples = (Array.isArray(o.examples) ? o.examples : [])
      .map((e) => ({ sentence: str((e as Record<string, unknown>)?.sentence), pronunciation: str((e as Record<string, unknown>)?.pronunciation), meaningVi: str((e as Record<string, unknown>)?.meaningVi) }))
      .filter((e) => e.sentence)
      .slice(0, 6);
    const data = { level: str(o.level), title, structure, explanation: str(o.explanation), examples, commonMistakes: str(o.commonMistakes), comparedWith: str(o.comparedWith) };
    return { key: norm(title), summary: `${title}  ·  ${structure}`, data };
  }
  if (section === 'conversation') {
    const question = str(o.question);
    const answer = str(o.answer);
    if (!question || !answer) return null;
    const data = { question, answer, questionPronunciation: str(o.questionPronunciation), answerPronunciation: str(o.answerPronunciation), meaningVi: str(o.meaningVi) };
    return { key: norm(question), summary: `${question} → ${answer}`, data };
  }
  if (section === 'qna') {
    const question = str(o.question);
    const answer = str(o.answer);
    if (!question || !answer) return null;
    const data = { question, answer, pronunciation: str(o.pronunciation), meaningVi: str(o.meaningVi) };
    return { key: norm(question), summary: `${question} → ${answer}`, data };
  }
  if (section === 'reading-article') {
    const title = str(o.title);
    const content = str(o.content);
    if (!title || !content) return null;
    const questions = normReadingQuestions(o.questions);
    const data = { title, content, translation: str(o.translation), questions };
    const words = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return { key: norm(title), summary: `${title}  ·  ~${words} từ · ${questions.length} câu hỏi`, data };
  }
  // reading question (for an existing article)
  const prompt = str(o.prompt);
  if (!prompt) return null;
  const kind = o.kind === 'open' ? 'open' : 'mc';
  if (kind === 'mc') {
    const options = (Array.isArray(o.options) ? o.options : []).map(str).filter(Boolean).slice(0, 4);
    if (options.length < 2) return null;
    let correctIndex = Number(o.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) correctIndex = 0;
    const data = { kind: 'mc', prompt, options, correctIndex, explanation: str(o.explanation) };
    return { key: norm(prompt), summary: `[Trắc nghiệm] ${prompt}`, data };
  }
  const data = { kind: 'open', prompt, sampleAnswer: str(o.sampleAnswer), explanation: str(o.explanation) };
  return { key: norm(prompt), summary: `[Tự luận] ${prompt}`, data };
}

// ── Preview (no DB writes) ────────────────────────────────────────
export async function adminGenerate(
  userId: number,
  body: { languageCode?: string; section?: string; categoryId?: number | string; articleId?: number | string; level?: string; topic?: string; count?: number | string },
): Promise<{ section: GenSection; items: GenProposal[] }> {
  const section = SECTIONS.includes(body?.section as GenSection) ? (body!.section as GenSection) : null;
  if (!section) throw new BadRequestError('Mục không hợp lệ.');
  const level = str(body?.level);
  const topic = str(body?.topic);
  // Reading passages are long, so cap their per-call count lower; the rest go up to 25.
  const reqCount = Math.max(1, Math.min(25, Number(body?.count) || 6));
  const count = section === 'reading-article' ? Math.min(reqCount, 4) : reqCount;
  const categoryId = Number(body?.categoryId) || undefined;
  const articleId = Number(body?.articleId) || undefined;
  if (section === 'vocab' && !categoryId) throw new BadRequestError('Cần chọn danh mục từ vựng.');
  if (section === 'reading' && !articleId) throw new BadRequestError('Cần chọn bài đọc.');

  if (!isAiAvailable()) throw new BadRequestError('AI hiện đang tắt. Vui lòng thử lại sau.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.');

  const lang = await loadLanguage(String(body?.languageCode ?? ''));
  const { keys, sample } = await existingContext(section, lang.id, categoryId, articleId);

  let articleText: string | undefined;
  if (section === 'reading') {
    const article = await prisma.langReadingArticle.findUnique({ where: { id: articleId! }, select: { content: true, translation: true, title: true } });
    if (!article) throw new NotFoundError('Không tìm thấy bài đọc.');
    articleText = `${article.title}\n${toPlainText(article.content)}\n${toPlainText(article.translation)}`.trim();
    if (!articleText) throw new BadRequestError('Bài đọc chưa có nội dung để tạo câu hỏi.');
  }

  const { system, user } = buildPrompts(section, lang.code, count, level, topic, sample, articleText);

  // Scale maxTokens to the batch so the JSON is NEVER truncated (the old fixed
  // 2600 cap cut long grammar/vocab output mid-string → parse failure).
  const perItem = section === 'reading-article' ? 1400 : section === 'grammar' || section === 'conversation' ? 450 : 220;
  const maxTokens = Math.min(8000, 800 + count * perItem);

  let raw = '';
  try {
    const res = await llmComplete({ step: 'generation', system, messages: [{ role: 'user', content: user }], maxTokens, maxRetries: 1, timeoutMs: 90_000, userId });
    raw = res.text;
  } catch {
    throw new BadRequestError('Tạo nội dung đang bận, vui lòng thử lại sau giây lát.');
  }

  const parsed = looseJson(raw) as { items?: unknown };
  let rawItems: unknown[] = Array.isArray(parsed.items) ? parsed.items : [];
  // Salvage: whole-array parse failed (usually one item's unescaped quote broke
  // the JSON) → recover each valid object individually. This is what fixes the
  // grammar "0 items → đã đầy đủ" false failure.
  if (!rawItems.length) {
    rawItems = extractObjects(raw)
      .map((o) => looseJson(o))
      .filter((o) => o && Object.keys(o).length > 0);
  }

  const seen = new Set(keys);
  const items: GenProposal[] = [];
  for (const rawItem of rawItems) {
    const p = normalizeItem(section, rawItem);
    if (!p) continue;
    if (seen.has(p.key)) continue; // dedup vs existing + within batch
    seen.add(p.key);
    items.push(p);
    if (items.length >= count) break;
  }
  if (!items.length) {
    // "Already full" is only honest when the model DID return items and dedup
    // removed every one. If it returned nothing parseable, this is a generation
    // failure and must read as retryable — a fresh category has no existing
    // keys, so "full" is impossible there by definition, yet callers that
    // believe it strand the unit at zero forever.
    if (!rawItems.length) throw new BadRequestError('Tạo nội dung chưa ra kết quả, vui lòng thử lại.');
    throw new BadRequestError(fullMessage(section, level, topic));
  }
  return { section, items };
}

// ── Commit (insert selected) ──────────────────────────────────────
export async function adminCommit(
  userId: number,
  body: { languageCode?: string; section?: string; categoryId?: number | string; articleId?: number | string; items?: unknown; level?: string },
): Promise<{ created: number; skipped: number }> {
  // Level tag: stamp the request-level onto every committed item so sections
  // can be browsed/deep-linked by level (items may also carry their own).
  const reqLevel = typeof body?.level === 'string' && body.level.trim() ? body.level.trim().slice(0, 20) : undefined;
  const section = SECTIONS.includes(body?.section as GenSection) ? (body!.section as GenSection) : null;
  if (!section) throw new BadRequestError('Mục không hợp lệ.');
  const categoryId = Number(body?.categoryId) || undefined;
  const articleId = Number(body?.articleId) || undefined;
  const items = Array.isArray(body?.items) ? (body!.items as Array<Record<string, unknown>>) : [];
  if (!items.length) throw new BadRequestError('Không có mục nào để lưu.');
  if (section === 'vocab' && !categoryId) throw new BadRequestError('Thiếu chủ đề từ vựng.');
  if (section === 'reading' && !articleId) throw new BadRequestError('Thiếu bài đọc.');

  const lang = await loadLanguage(String(body?.languageCode ?? ''));
  const { keys } = await existingContext(section, lang.id, categoryId, articleId);

  let created = 0;
  let skipped = 0;

  if (section === 'reading') {
    const article = await prisma.langReadingArticle.findUnique({ where: { id: articleId! }, select: { questions: true } });
    if (!article) throw new NotFoundError('Không tìm thấy bài đọc.');
    const existing = Array.isArray(article.questions) ? (article.questions as Array<Record<string, unknown>>) : [];
    const toAdd: Array<Record<string, unknown>> = [];
    items.forEach((data, i) => {
      const key = norm(data.prompt);
      if (!key || keys.has(key)) { skipped++; return; }
      keys.add(key);
      if (data.kind === 'open') {
        toAdd.push({ id: genId(i), kind: 'open', prompt: str(data.prompt), sampleAnswer: str(data.sampleAnswer), explanation: str(data.explanation) || undefined });
      } else {
        const options = (Array.isArray(data.options) ? data.options : []).map(str).filter(Boolean).slice(0, 4);
        if (options.length < 2) { skipped++; return; }
        let ci = Number(data.correctIndex);
        if (!Number.isInteger(ci) || ci < 0 || ci >= options.length) ci = 0;
        toAdd.push({ id: genId(i), kind: 'mc', prompt: str(data.prompt), options, correctIndex: ci, explanation: str(data.explanation) || undefined });
      }
      created++;
    });
    if (toAdd.length) await updateReading(articleId!, { questions: [...existing, ...toAdd] });
    return { created, skipped };
  }

  if (section === 'reading-article') {
    for (const [i, data] of items.entries()) {
      const key = norm(data.title);
      if (!key || keys.has(key)) { skipped++; continue; }
      try {
        const questions = normReadingQuestions(data.questions).map((q, j) => ({ ...q, id: genId(i * 100 + j) }));
        await createReading(lang.id, {
          title: str(data.title),
          type: 'TEXT',
          content: str(data.content),
          translation: str(data.translation) || null,
          questions: questions.length ? questions : null,
          level: str(data.level) || reqLevel,
        });
        keys.add(key);
        created++;
      } catch {
        skipped++;
      }
    }
    return { created, skipped };
  }

  for (const data of items) {
    const key = norm(section === 'vocab' ? data.word : (data as { question?: unknown; title?: unknown }).question ?? data.title);
    if (!key || keys.has(key)) { skipped++; continue; }
    try {
      if (section === 'vocab') await createVocabWord(categoryId!, data);
      else if (section === 'grammar') await createGrammar(lang.id, { ...data, level: (data as { level?: unknown }).level || reqLevel });
      else if (section === 'conversation') await createConversation(lang.id, { ...data, level: reqLevel });
      else if (section === 'qna') await createQna(lang.id, { ...data, level: reqLevel });
      keys.add(key);
      created++;
    } catch {
      skipped++;
    }
  }
  return { created, skipped };
}
