/**
 * My Language — AI enrichment for Han characters.
 *
 * The level seed gives every character its objective facts (level, strokes,
 * readings, radical, decomposition) but leaves the parts that need a teacher:
 * the Vietnamese meaning, a mnemonic that actually sticks, and the compound
 * words that put the character to work. 4,011 characters is far past what
 * anyone will hand-write, so the model does it — grounded in the facts we
 * already hold rather than inventing them.
 *
 * Used by both the admin's "AI sinh" button and scripts/hanzi-ai-enrich.mjs.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { looseJson } from './myLanguage.ai.service.js';

export interface HanziEnrichment {
  meaningVi: string;
  mnemonic: string;
  breakdown: string;
  examples: Array<{ word: string; reading: string; meaningVi: string }>;
}

interface CharFacts {
  char: string;
  lang: 'ja' | 'zh';
  level?: string | null;
  strokeCount?: number | null;
  onyomi?: string | null;
  kunyomi?: string | null;
  pinyin?: string | null;
  radical?: string | null;
  decomposition?: string | null;
  englishGloss?: string | null;
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

function buildPrompt(items: CharFacts[]): { system: string; user: string } {
  const lang = items[0]?.lang ?? 'ja';
  const isJa = lang === 'ja';
  const langName = isJa ? 'Japanese' : 'Chinese (Mandarin)';
  const readingNote = isJa
    ? '"reading" of each example word = hiragana. Keep the on/kun readings given; do NOT invent new ones.'
    : '"reading" of each example word = pinyin WITH tone marks (nǐ hǎo, not ni hao).';

  const system =
    `You write ${langName} character entries for a Vietnamese learner, in natural Vietnamese (tiếng Việt). For EACH character return:\n` +
    '- "meaningVi": nghĩa tiếng Việt, ngắn gọn (2–6 từ). Nếu chữ có nhiều nghĩa, nêu nghĩa chính trước, cách nhau bởi dấu phẩy.\n' +
    '- "mnemonic": MỘT câu (tối đa 2) giúp NHỚ MẶT CHỮ bằng tiếng Việt. Dựa vào bộ thủ và chiết tự đã cho — kể một hình ảnh nối các thành phần lại với nghĩa của chữ. ' +
    'Đây là phần quan trọng nhất: nó phải giúp người học nhìn chữ là nhớ ra, không phải chỉ dịch lại nghĩa.\n' +
    '- "breakdown": chiết tự viết lại cho người Việt đọc được, dạng "氵(nước) + 難(khó)". Dùng dữ liệu decomposition đã cho; nếu chữ là một khối không tách được thì mô tả hình dáng.\n' +
    `- "examples": 2–3 TỪ GHÉP thông dụng CÓ CHỨA chữ đó, mỗi từ {word, reading, meaningVi}. ${readingNote} ` +
    'Chọn từ mà người học ở cấp đó thật sự gặp; không bịa từ.\n' +
    'The English gloss given is a HINT for the meaning, not something to copy — write real Vietnamese, not a word-for-word gloss.\n' +
    'Return ONLY a minified JSON object: {"items":[{"char": string, "meaningVi": string, "mnemonic": string, "breakdown": string, "examples":[{"word":string,"reading":string,"meaningVi":string}]}]}. ' +
    'Escape any double-quote inside a string as \\". No text outside the JSON.';

  const lines = items.map((c) => {
    const parts = [`char: ${c.char}`];
    if (c.level) parts.push(`cấp: ${c.level}`);
    if (c.strokeCount) parts.push(`${c.strokeCount} nét`);
    if (c.onyomi) parts.push(`on: ${c.onyomi}`);
    if (c.kunyomi) parts.push(`kun: ${c.kunyomi}`);
    if (c.pinyin) parts.push(`pinyin: ${c.pinyin}`);
    if (c.radical) parts.push(`bộ thủ: ${c.radical}`);
    if (c.decomposition) parts.push(`chiết tự: ${c.decomposition}`);
    if (c.englishGloss) parts.push(`nghĩa EN (gợi ý): ${c.englishGloss}`);
    return `- ${parts.join(' | ')}`;
  });

  return { system, user: `Viết mục từ cho các chữ sau:\n${lines.join('\n')}` };
}

function parse(raw: string, want: CharFacts[]): Map<string, HanziEnrichment> {
  const out = new Map<string, HanziEnrichment>();
  const parsed = looseJson(raw);
  const items = Array.isArray(parsed.items) ? parsed.items : [];
  const wanted = new Set(want.map((w) => w.char));

  for (const it of items) {
    const o = (it ?? {}) as Record<string, unknown>;
    const char = str(o.char);
    // A character we did not ask about is a hallucination, not a bonus.
    if (!char || !wanted.has(char)) continue;
    const meaningVi = str(o.meaningVi);
    if (!meaningVi) continue;

    const examples = (Array.isArray(o.examples) ? o.examples : [])
      .map((e) => {
        const eo = (e ?? {}) as Record<string, unknown>;
        const word = str(eo.word);
        if (!word) return null;
        // An example that does not contain the character teaches nothing about
        // it — the model drifts into related-but-absent words otherwise.
        if (!word.includes(char)) return null;
        return { word: word.slice(0, 60), reading: str(eo.reading).slice(0, 80), meaningVi: str(eo.meaningVi).slice(0, 200) };
      })
      .filter((e): e is { word: string; reading: string; meaningVi: string } => e != null)
      .slice(0, 4);

    out.set(char, {
      meaningVi: meaningVi.slice(0, 200),
      mnemonic: str(o.mnemonic).slice(0, 1000),
      breakdown: str(o.breakdown).slice(0, 300),
      examples,
    });
  }
  return out;
}

/** Generate entries for a batch of characters. Throws on AI unavailable/quota. */
export async function enrichChars(userId: number, items: CharFacts[]): Promise<Map<string, HanziEnrichment>> {
  if (!items.length) return new Map();
  if (!isAiAvailable()) throw new BadRequestError('AI đang tắt — không sinh được lúc này.');
  if (!(await checkTokenQuota(userId))) throw new BadRequestError('Đã hết hạn mức token hôm nay.');

  const { system, user } = buildPrompt(items);
  let raw = '';
  try {
    const res = await llmComplete({
      step: 'generation',
      feature: 'bulk_gen',
      system,
      messages: [{ role: 'user', content: user }],
      maxTokens: Math.min(8000, items.length * 420 + 800),
      maxRetries: 1,
      timeoutMs: 90_000,
      userId,
    });
    raw = res.text;
  } catch {
    throw new BadRequestError('Sinh nội dung đang bận, vui lòng thử lại sau giây lát.');
  }

  const got = parse(raw, items);
  if (!got.size) throw new BadRequestError('Chưa đọc được kết quả, vui lòng thử lại.');
  return got;
}

/**
 * Admin: (re)generate one character and save it.
 *
 * `overwrite` guards the admin's own work — by default an existing mnemonic or
 * a Vietnamese meaning already written by hand is left alone, and only the
 * empty fields get filled.
 */
export async function adminEnrichOne(
  userId: number,
  charId: number,
  opts: { overwrite?: boolean } = {},
): Promise<{ id: number; meaningVi: string; mnemonic: string | null; breakdown: string | null; examples: unknown }> {
  const row = await prisma.langHanziChar.findUnique({
    where: { id: charId },
    include: { language: { select: { code: true } } },
  });
  if (!row) throw new NotFoundError('Không tìm thấy chữ.');
  const code = row.language.code === 'zh' ? 'zh' : 'ja';

  const got = await enrichChars(userId, [{
    char: row.char,
    lang: code,
    level: row.level,
    strokeCount: row.strokeCount,
    onyomi: row.onyomi,
    kunyomi: row.kunyomi,
    pinyin: row.pinyin,
    radical: row.radical,
    decomposition: row.breakdown,
  }]);
  const e = got.get(row.char);
  if (!e) throw new BadRequestError('AI không trả về nội dung cho chữ này.');

  const hadExamples = Array.isArray(row.examples) && (row.examples as unknown[]).length > 0;
  const updated = await prisma.langHanziChar.update({
    where: { id: charId },
    data: {
      ...(opts.overwrite || !row.mnemonic ? { mnemonic: e.mnemonic || null } : {}),
      ...(opts.overwrite ? { meaningVi: e.meaningVi } : {}),
      ...(opts.overwrite || !row.breakdown || row.breakdown === e.breakdown ? { breakdown: e.breakdown || row.breakdown } : {}),
      ...(opts.overwrite || !hadExamples ? { examples: e.examples as never } : {}),
    },
    select: { id: true, meaningVi: true, mnemonic: true, breakdown: true, examples: true },
  });
  return updated;
}
