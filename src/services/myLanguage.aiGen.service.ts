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
import { llmComplete, checkTokenQuota, isAiAvailable, extractJson } from './interview/llm/index.js';
import {
  createVocabWord,
  createGrammar,
  createConversation,
  createQna,
  updateReading,
} from './myLanguage.service.js';

export type GenSection = 'vocab' | 'grammar' | 'conversation' | 'qna' | 'reading';
const SECTIONS: GenSection[] = ['vocab', 'grammar', 'conversation', 'qna', 'reading'];

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
  if (c === 'ja') return `Pronunciations MUST include {"type":"hiragana","value":...} and {"type":"romaji","value":...}.`;
  if (c === 'zh') return `Pronunciations MUST include {"type":"pinyin","value":...} (with tone marks).`;
  if (c === 'ko') return `Pronunciations MUST include {"type":"romaja","value":...}.`;
  return `Pronunciations may be an empty array or include {"type":"IPA","value":...}.`;
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
  // reading — existing questions on the article
  const article = await prisma.langReadingArticle.findUnique({ where: { id: articleId ?? 0 }, select: { questions: true } });
  const qs = Array.isArray(article?.questions) ? (article!.questions as Array<Record<string, unknown>>) : [];
  return { keys: new Set(qs.map((q) => norm(q.prompt))), sample: qs.map((q) => String(q.prompt ?? '')).join('; ') };
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
    shape = `{"items":[{"word":string,"meaningVi":string,"exampleSentence":string,"exampleMeaning":string,"note":string,"pronunciations":[{"type":string,"value":string}]}]}`;
  } else if (section === 'grammar') {
    intro = `Generate ${count} ${langName} grammar points${lv}${tp}. "explanation" is a SHORT HTML string in Vietnamese (use <p>, <ul><li>). "examples" each: sentence (in ${langName}), pronunciation (reading), meaningVi. ${viNote}`;
    shape = `{"items":[{"level":string,"title":string,"structure":string,"explanation":string,"examples":[{"sentence":string,"pronunciation":string,"meaningVi":string}],"commonMistakes":string,"comparedWith":string}]}`;
  } else if (section === 'conversation') {
    intro = `Generate ${count} ${langName} daily-conversation Q/A pairs${lv}${tp}. Include the reading (pronunciation) for both lines and the Vietnamese meaning. ${viNote}`;
    shape = `{"items":[{"question":string,"answer":string,"questionPronunciation":string,"answerPronunciation":string,"meaningVi":string}]}`;
  } else if (section === 'qna') {
    intro = `Generate ${count} ${langName} FAQ-style question/answer pairs${lv}${tp}. Include the reading of the answer and the Vietnamese meaning. ${viNote}`;
    shape = `{"items":[{"question":string,"answer":string,"pronunciation":string,"meaningVi":string}]}`;
  } else {
    intro = `Generate ${count} comprehension questions STRICTLY based on the ${langName} reading passage below. Mix multiple-choice and open questions. For "mc": 4 options + 0-based correctIndex. Prompts/explanations in Vietnamese; keep option text faithful to the passage. ${viNote}\n\nPASSAGE:\n${(articleText || '').slice(0, 3500)}`;
    shape = `{"items":[{"kind":"mc","prompt":string,"options":[string,string,string,string],"correctIndex":number,"explanation":string} | {"kind":"open","prompt":string,"sampleAnswer":string,"explanation":string}]}`;
  }
  return {
    system: `You are an expert ${langName} teacher creating high-quality learning content for Vietnamese learners. ${intro} Return ONLY a minified JSON object with this exact shape: ${shape}`,
    user: `Hãy tạo nội dung.${noDup}`,
  };
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
  // reading question
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
  const count = Math.max(3, Math.min(12, Number(body?.count) || 6));
  const categoryId = Number(body?.categoryId) || undefined;
  const articleId = Number(body?.articleId) || undefined;
  if (section === 'vocab' && !categoryId) throw new BadRequestError('Cần chọn chủ đề từ vựng.');
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

  const { system, user } = buildPrompts(section, lang.code, count, str(body?.level), str(body?.topic), sample, articleText);

  let parsed: { items?: unknown };
  try {
    const res = await llmComplete({ step: 'generation', system, messages: [{ role: 'user', content: user }], maxTokens: 2600, maxRetries: 1, timeoutMs: 60_000, userId });
    parsed = extractJson<{ items?: unknown }>(res.text);
  } catch {
    throw new BadRequestError('Tạo nội dung đang bận, vui lòng thử lại sau giây lát.');
  }

  const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
  const seen = new Set(keys);
  const items: GenProposal[] = [];
  for (const raw of rawItems) {
    const p = normalizeItem(section, raw);
    if (!p) continue;
    if (seen.has(p.key)) continue; // dedup vs existing + within batch
    seen.add(p.key);
    items.push(p);
    if (items.length >= count) break;
  }
  if (!items.length) throw new BadRequestError('Không tạo được nội dung mới (có thể đã trùng hết). Thử đổi chủ đề/cấp độ.');
  return { section, items };
}

// ── Commit (insert selected) ──────────────────────────────────────
export async function adminCommit(
  userId: number,
  body: { languageCode?: string; section?: string; categoryId?: number | string; articleId?: number | string; items?: unknown },
): Promise<{ created: number; skipped: number }> {
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

  for (const data of items) {
    const key = norm(section === 'vocab' ? data.word : (data as { question?: unknown; title?: unknown }).question ?? data.title);
    if (!key || keys.has(key)) { skipped++; continue; }
    try {
      if (section === 'vocab') await createVocabWord(categoryId!, data);
      else if (section === 'grammar') await createGrammar(lang.id, data);
      else if (section === 'conversation') await createConversation(lang.id, data);
      else if (section === 'qna') await createQna(lang.id, data);
      keys.add(key);
      created++;
    } catch {
      skipped++;
    }
  }
  return { created, skipped };
}
