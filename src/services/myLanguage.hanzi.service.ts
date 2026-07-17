/**
 * My Language — Han character (kanji / hanzi) writing practice.
 *
 * Stroke geometry is NOT stored in the DB — free datasets already have it, and
 * this module serves it from our OWN origin because the CSP blocks third-party
 * hosts (the same trap that killed the GIF picker). Japanese and Chinese need
 * different sources; see getStrokeData. The DB holds only what stroke data
 * cannot know — the Vietnamese meaning, the mnemonic, the admin's illustrations
 * — and how each learner is doing.
 */
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
import path from 'node:path';
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

const require = createRequire(import.meta.url);

export interface HanziExample { word: string; reading?: string; meaningVi: string }
export interface HanziImage { url: string; caption?: string }

export interface HanziCharDto {
  id: number;
  char: string;
  level: string | null;
  strokeCount: number | null;
  onyomi: string | null;
  kunyomi: string | null;
  pinyin: string | null;
  meaningVi: string;
  mnemonic: string | null;
  radical: string | null;
  breakdown: string | null;
  examples: HanziExample[];
  images: HanziImage[];
  note: string | null;
  order: number;
  progress?: { attempts: number; mistakes: number; bestMistakes: number | null; learned: boolean } | null;
}

function toDto(row: {
  id: number; char: string; level: string | null; strokeCount: number | null;
  onyomi: string | null; kunyomi: string | null; pinyin: string | null;
  meaningVi: string; mnemonic: string | null; radical: string | null; breakdown: string | null;
  examples: unknown; images: unknown; note: string | null; order: number;
  progress?: Array<{ attempts: number; mistakes: number; bestMistakes: number | null; learned: boolean }>;
}): HanziCharDto {
  return {
    id: row.id,
    char: row.char,
    level: row.level,
    strokeCount: row.strokeCount,
    onyomi: row.onyomi,
    kunyomi: row.kunyomi,
    pinyin: row.pinyin,
    meaningVi: row.meaningVi,
    mnemonic: row.mnemonic,
    radical: row.radical,
    breakdown: row.breakdown,
    examples: Array.isArray(row.examples) ? (row.examples as HanziExample[]) : [],
    images: Array.isArray(row.images) ? (row.images as HanziImage[]) : [],
    note: row.note,
    order: row.order,
    progress: row.progress?.[0]
      ? {
          attempts: row.progress[0].attempts,
          mistakes: row.progress[0].mistakes,
          bestMistakes: row.progress[0].bestMistakes,
          learned: row.progress[0].learned,
        }
      : null,
  };
}

async function languageId(code: string): Promise<number> {
  const lang = await prisma.language.findUnique({ where: { code: String(code || '').trim() }, select: { id: true } });
  if (!lang) throw new NotFoundError('Không tìm thấy ngôn ngữ.');
  return lang.id;
}

// ─── Public reads ────────────────────────────────────────────────

/** Characters for a language, newest progress folded in when signed in. */
export async function listChars(
  code: string,
  opts: { level?: string; userId?: number } = {},
): Promise<{ levels: string[]; chars: HanziCharDto[] }> {
  const langId = await languageId(code);
  const where = { languageId: langId, ...(opts.level ? { level: opts.level } : {}) };

  const [rows, levelRows] = await Promise.all([
    prisma.langHanziChar.findMany({
      where,
      orderBy: [{ order: 'asc' }, { strokeCount: 'asc' }, { id: 'asc' }],
      include: opts.userId
        ? { progress: { where: { userId: opts.userId }, select: { attempts: true, mistakes: true, bestMistakes: true, learned: true } } }
        : undefined,
    }),
    // Distinct levels for the chip bar — same pattern as the other sections.
    prisma.langHanziChar.findMany({
      where: { languageId: langId, level: { not: null } },
      select: { level: true },
      distinct: ['level'],
    }),
  ]);

  return {
    levels: levelRows.map((r) => r.level).filter((l): l is string => !!l),
    chars: rows.map((r) => toDto(r as never)),
  };
}

export async function getChar(id: number, userId?: number): Promise<HanziCharDto> {
  const row = await prisma.langHanziChar.findUnique({
    where: { id },
    include: userId
      ? { progress: { where: { userId }, select: { attempts: true, mistakes: true, bestMistakes: true, learned: true } } }
      : undefined,
  });
  if (!row) throw new NotFoundError('Không tìm thấy chữ.');
  return toDto(row as never);
}

// ─── Stroke data (served from our origin) ────────────────────────

/**
 * Japanese kanji index, built once from data/hanzi-graphics-ja.txt.gz.
 *
 * Japanese needs its OWN source. The `hanzi-writer-data` npm package is built
 * from Chinese forms and simply has no shinjitai: 気, 読 and 毎 are absent, and
 * serving their Chinese ancestors (氣, 讀, 每) would animate the wrong character
 * — a learner would be taught to write a kanji that does not exist in Japanese.
 * `hanzi-writer-data-jp` looks like the answer but ships no data at all (47KB
 * stub). So the Japanese set is vendored from animCJK, whose graphicsJa.txt is
 * already in hanzi-writer's format and under the same Arphic licence.
 *
 * Held as raw JSON strings rather than parsed objects: they are handed straight
 * to res.send(), so parsing them here would cost memory to produce nothing.
 * Built lazily — a deploy that never serves a kanji never pays the 100ms.
 */
let jaIndex: Map<string, string> | null = null;
let jaLoading: Promise<Map<string, string>> | null = null;

function indexFile(text: string, map: Map<string, string>): void {
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const at = line.indexOf('"character":"');
    if (at < 0) continue;
    const end = line.indexOf('"', at + 13);
    if (end < 0) continue;
    map.set(line.slice(at + 13, end), line);
  }
}

async function loadJaIndex(): Promise<Map<string, string>> {
  if (jaIndex) return jaIndex;
  // Concurrent first requests must not each decompress 22MB.
  if (jaLoading) return jaLoading;
  jaLoading = (async () => {
    const map = new Map<string, string>();
    // Kanji and kana ship as two files upstream (graphicsJa / graphicsJaKana)
    // but are one namespace to a learner: the writing screen asks for a
    // character, not for which file it lives in.
    //
    // Loaded independently: a missing kana file must cost us kana, not kanji.
    // Failing the whole index would turn one absent asset into a dead feature
    // that was working — exactly the stale-build class of outage that has bitten
    // this deploy before.
    for (const name of ['hanzi-graphics-ja.txt.gz', 'kana-graphics-ja.txt.gz']) {
      try {
        const raw = await readFile(path.join(process.cwd(), 'data', name));
        indexFile(gunzipSync(raw).toString('utf8'), map);
      } catch (err) {
        console.error(`[hanzi] không đọc được data/${name}:`, (err as Error).message);
      }
    }
    if (!map.size) {
      // Both files gone: report it rather than caching an empty index forever.
      jaLoading = null;
      throw new Error('Không nạp được dữ liệu nét tiếng Nhật (data/*.txt.gz).');
    }
    jaIndex = map;
    jaLoading = null;
    return map;
  })();
  return jaLoading;
}

/** Kana, plus the marks that behave like kana when writing: ー and small tsu. */
const KANA_RE = /[\u3040-\u309F\u30A0-\u30FF]/u;

const zhCache = new Map<string, string>();
const ZH_CACHE_CAP = 400;

/**
 * Stroke geometry for one character, as a JSON string in hanzi-writer's format.
 *
 * Served from our own origin: the CSP forbids third-party hosts, so the
 * library's default CDN loader would be blocked outright (the same way the GIF
 * picker died). `lang` picks the source — Japanese and Chinese disagree about
 * what some characters look like.
 */
export async function getStrokeData(char: string, lang: 'ja' | 'zh' = 'ja'): Promise<string> {
  const c = String(char || '').trim();
  // Exactly one grapheme. Anything else is either a mistake or an attempt to
  // walk the filesystem — `..` and `/` must never reach path.join below.
  if (!c || [...c].length !== 1) throw new BadRequestError('Chỉ nhận đúng 1 ký tự.');
  const isHan = /\p{Script=Han}/u.test(c);
  const isKana = KANA_RE.test(c);
  // Still a whitelist, just a wider one: only Han or kana ever reach the
  // path.join below, so `..` and `/` remain impossible.
  if (!isHan && !isKana) throw new BadRequestError('Ký tự không phải chữ Hán hoặc kana.');
  // Only the Japanese set has kana; hanzi-writer-data is Han-only.
  if (isKana && lang !== 'ja') throw new BadRequestError('Kana chỉ có trong tiếng Nhật.');

  if (lang === 'ja') {
    const idx = await loadJaIndex();
    const hit = idx.get(c);
    if (!hit) throw new NotFoundError(`Chưa có dữ liệu nét cho chữ "${c}".`);
    return hit;
  }

  const cached = zhCache.get(c);
  if (cached) return cached;
  let dir: string;
  try {
    dir = path.dirname(require.resolve('hanzi-writer-data/package.json'));
  } catch {
    throw new BadRequestError('Chưa cài dữ liệu nét chữ (hanzi-writer-data).');
  }
  try {
    const json = await readFile(path.join(dir, `${c}.json`), 'utf8');
    if (zhCache.size >= ZH_CACHE_CAP) {
      const first = zhCache.keys().next().value;
      if (first !== undefined) zhCache.delete(first);
    }
    zhCache.set(c, json);
    return json;
  } catch {
    // 9,575 chars is a lot but not everything — a rare hanzi legitimately misses.
    throw new NotFoundError(`Chưa có dữ liệu nét cho chữ "${c}".`);
  }
}

// ─── Progress ────────────────────────────────────────────────────

/** Record one finished quiz run. `mistakes` is strokes drawn wrong in that run. */
export async function recordAttempt(
  userId: number,
  body: { charId?: number; mistakes?: number; fromMemory?: boolean },
): Promise<{ attempts: number; mistakes: number; bestMistakes: number | null; learned: boolean }> {
  const charId = Number(body?.charId);
  if (!Number.isInteger(charId) || charId <= 0) throw new BadRequestError('Thiếu chữ.');
  const mistakes = Math.max(0, Math.min(200, Math.round(Number(body?.mistakes ?? 0)) || 0));
  const exists = await prisma.langHanziChar.findUnique({ where: { id: charId }, select: { id: true } });
  if (!exists) throw new NotFoundError('Không tìm thấy chữ.');

  const prev = await prisma.langHanziProgress.findUnique({
    where: { uk_lang_hanzi_progress: { userId, charId } },
    select: { attempts: true, mistakes: true, bestMistakes: true, learned: true },
  });

  // "Learned" means one clean run FROM MEMORY — tracing with the outline shown
  // proves nothing, so a flawless traced run must not unlock it.
  const cleanFromMemory = !!body?.fromMemory && mistakes === 0;
  const best = prev?.bestMistakes == null ? mistakes : Math.min(prev.bestMistakes, mistakes);

  const row = await prisma.langHanziProgress.upsert({
    where: { uk_lang_hanzi_progress: { userId, charId } },
    create: {
      userId, charId, attempts: 1, mistakes, bestMistakes: mistakes, learned: cleanFromMemory,
    },
    update: {
      attempts: { increment: 1 },
      mistakes: { increment: mistakes },
      bestMistakes: best,
      ...(cleanFromMemory ? { learned: true } : {}),
      lastAt: new Date(),
    },
    select: { attempts: true, mistakes: true, bestMistakes: true, learned: true },
  });
  return row;
}

/**
 * Characters this learner should write again, weakest first.
 *
 * Deliberately NOT wired into LangUserProgress/LangItemType: that enum has no
 * HANZI member and adding one is a migration for a queue this table can already
 * answer. LangHanziProgress records every run, so "needs work" is a query, not
 * new state:
 *   - never written cleanly from memory (learned = false) → always due
 *   - written cleanly but untouched for a week → due again (it fades)
 * Ordered by mistakes so the character that keeps going wrong comes back first.
 */
export async function getReviewQueue(
  code: string,
  userId: number,
  limit = 30,
): Promise<{ count: number; chars: HanziCharDto[] }> {
  const langId = await languageId(code);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const rows = await prisma.langHanziProgress.findMany({
    where: {
      userId,
      char: { languageId: langId },
      OR: [{ learned: false }, { learned: true, lastAt: { lt: weekAgo } }],
    },
    include: { char: true },
    // A char failed 12 times matters more than one failed twice; among equals,
    // the one left alone longest goes first.
    orderBy: [{ mistakes: 'desc' }, { lastAt: 'asc' }],
    take: limit,
  });

  return {
    count: rows.length,
    chars: rows.map((r) =>
      toDto({
        ...r.char,
        progress: [{ attempts: r.attempts, mistakes: r.mistakes, bestMistakes: r.bestMistakes, learned: r.learned }],
      } as never),
    ),
  };
}

export async function getStats(code: string, userId: number): Promise<{ total: number; learned: number; attempted: number }> {
  const langId = await languageId(code);
  const [total, rows] = await Promise.all([
    prisma.langHanziChar.count({ where: { languageId: langId } }),
    prisma.langHanziProgress.findMany({
      where: { userId, char: { languageId: langId } },
      select: { learned: true },
    }),
  ]);
  return { total, learned: rows.filter((r) => r.learned).length, attempted: rows.length };
}

// ─── Admin CRUD ──────────────────────────────────────────────────

function cleanExamples(v: unknown): HanziExample[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((e): HanziExample | null => {
      const o = (e ?? {}) as Record<string, unknown>;
      const word = typeof o.word === 'string' ? o.word.trim() : '';
      if (!word) return null;
      return {
        word: word.slice(0, 60),
        reading: typeof o.reading === 'string' ? o.reading.trim().slice(0, 80) : undefined,
        meaningVi: typeof o.meaningVi === 'string' ? o.meaningVi.trim().slice(0, 200) : '',
      };
    })
    .filter((e): e is HanziExample => e != null)
    .slice(0, 12);
}
function cleanImages(v: unknown): HanziImage[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((e): HanziImage | null => {
      const o = (e ?? {}) as Record<string, unknown>;
      const url = typeof o.url === 'string' ? o.url.trim() : '';
      if (!url) return null;
      return { url: url.slice(0, 500), caption: typeof o.caption === 'string' ? o.caption.trim().slice(0, 160) : undefined };
    })
    .filter((e): e is HanziImage => e != null)
    .slice(0, 3); // 1–3 illustrations, as specified
}
const str = (v: unknown, max: number): string | null => {
  const s = typeof v === 'string' ? v.trim() : '';
  return s ? s.slice(0, max) : null;
};

export async function adminList(code: string): Promise<HanziCharDto[]> {
  const langId = await languageId(code);
  const rows = await prisma.langHanziChar.findMany({
    where: { languageId: langId },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });
  return rows.map((r) => toDto(r as never));
}

export async function adminCreate(code: string, body: Record<string, unknown>): Promise<HanziCharDto> {
  const langId = await languageId(code);
  const char = String(body?.char ?? '').trim();
  if (!char || [...char].length !== 1) throw new BadRequestError('Cần đúng 1 ký tự Hán.');
  const meaningVi = String(body?.meaningVi ?? '').trim();
  if (!meaningVi) throw new BadRequestError('Cần nghĩa tiếng Việt.');

  // The unique index is the real guard; checking first only buys a clear message.
  const dupe = await prisma.langHanziChar.findFirst({ where: { languageId: langId, char }, select: { id: true } });
  if (dupe) throw new BadRequestError(`Chữ "${char}" đã có rồi.`);

  const max = await prisma.langHanziChar.aggregate({ where: { languageId: langId }, _max: { order: true } });
  const row = await prisma.langHanziChar.create({
    data: {
      languageId: langId,
      char,
      level: str(body?.level, 20),
      strokeCount: Number.isFinite(Number(body?.strokeCount)) ? Math.max(1, Math.min(64, Number(body.strokeCount))) : null,
      onyomi: str(body?.onyomi, 120),
      kunyomi: str(body?.kunyomi, 120),
      pinyin: str(body?.pinyin, 120),
      meaningVi,
      mnemonic: str(body?.mnemonic, 4000),
      radical: str(body?.radical, 16),
      breakdown: str(body?.breakdown, 2000),
      examples: cleanExamples(body?.examples) as never,
      images: cleanImages(body?.images) as never,
      note: str(body?.note, 2000),
      order: (max._max.order ?? -1) + 1,
    },
  });
  return toDto(row as never);
}

export async function adminUpdate(id: number, body: Record<string, unknown>): Promise<HanziCharDto> {
  const exists = await prisma.langHanziChar.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw new NotFoundError('Không tìm thấy chữ.');
  const row = await prisma.langHanziChar.update({
    where: { id },
    data: {
      // Only overwrite what the caller actually sent — a PATCH that omits
      // `images` must not wipe the illustrations.
      ...(body?.level !== undefined ? { level: str(body.level, 20) } : {}),
      ...(body?.strokeCount !== undefined
        ? { strokeCount: Number.isFinite(Number(body.strokeCount)) ? Math.max(1, Math.min(64, Number(body.strokeCount))) : null }
        : {}),
      ...(body?.onyomi !== undefined ? { onyomi: str(body.onyomi, 120) } : {}),
      ...(body?.kunyomi !== undefined ? { kunyomi: str(body.kunyomi, 120) } : {}),
      ...(body?.pinyin !== undefined ? { pinyin: str(body.pinyin, 120) } : {}),
      ...(body?.meaningVi !== undefined ? { meaningVi: String(body.meaningVi ?? '').trim() || 'Chưa có nghĩa' } : {}),
      ...(body?.mnemonic !== undefined ? { mnemonic: str(body.mnemonic, 4000) } : {}),
      ...(body?.radical !== undefined ? { radical: str(body.radical, 16) } : {}),
      ...(body?.breakdown !== undefined ? { breakdown: str(body.breakdown, 2000) } : {}),
      ...(body?.examples !== undefined ? { examples: cleanExamples(body.examples) as never } : {}),
      ...(body?.images !== undefined ? { images: cleanImages(body.images) as never } : {}),
      ...(body?.note !== undefined ? { note: str(body.note, 2000) } : {}),
      ...(body?.order !== undefined && Number.isFinite(Number(body.order)) ? { order: Number(body.order) } : {}),
    },
  });
  return toDto(row as never);
}

export async function adminDelete(id: number): Promise<{ id: number }> {
  await prisma.langHanziChar.delete({ where: { id } }).catch(() => {
    throw new NotFoundError('Không tìm thấy chữ.');
  });
  return { id };
}
