// Shared Text-to-Speech helper for the Notes vocab / flashcard features.
//
// Why this exists: the browser SpeechSynthesis API defaults to an
// English voice, so Japanese (kana/kanji) and Chinese (Hanzi) terms were
// read with an English voice → gibberish. This module:
//   • detects the language of a vocab entry from its script,
//   • waits for voices to load (getVoices() is empty until the
//     'voiceschanged' event fires on many browsers),
//   • picks a matching installed voice, and
//   • refuses to read a CJK term with a mismatched English voice,
//     signalling the caller to show a "no voice installed" hint instead.
//
// Used ONLY by the Notes feature (VocabTable + FlashcardReview). It does
// not touch any global/shared behaviour.

export type VocabLang = 'ja-JP' | 'zh-CN' | 'en-US' | 'ru-RU' | 'th-TH';

const KANA = /[぀-ヿ]/; // hiragana + katakana
const HAN = /[㐀-䶿一-鿿豈-﫿]/; // CJK ideographs
const CYRILLIC = /[Ѐ-ӿ]/;
const THAI = /[฀-๿]/;

/**
 * Best-effort language detection from script. Both the term and its
 * reading (furigana / pinyin) are considered so a kanji-only Japanese
 * word that carries a kana reading is still recognised as Japanese
 * rather than Chinese.
 *
 * Rules:
 *   • any kana (in term OR reading) → Japanese
 *   • Han characters without kana    → Mandarin Chinese
 *   • Cyrillic → Russian, Thai → Thai
 *   • otherwise (Latin, etc.)        → English  (unchanged default)
 */
export function detectVocabLang(term?: string | null, reading?: string | null): VocabLang {
  const both = `${term ?? ''} ${reading ?? ''}`;
  if (KANA.test(both)) return 'ja-JP';
  if (HAN.test(term ?? '')) return 'zh-CN';
  if (CYRILLIC.test(both)) return 'ru-RU';
  if (THAI.test(both)) return 'th-TH';
  return 'en-US';
}

// Cache the voice-loading promise so repeated clicks don't each register
// a new 'voiceschanged' listener. Reset on empty so a later attempt can
// retry once the OS finishes installing voices.
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const ready = synth.getVoices();
  if (ready.length) return Promise.resolve(ready);
  if (voicesPromise) return voicesPromise;
  voicesPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let settled = false;
    const finish = (v: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      synth.removeEventListener?.('voiceschanged', onChange);
      resolve(v);
    };
    const onChange = () => {
      const v = synth.getVoices();
      if (v.length) finish(v);
    };
    synth.addEventListener?.('voiceschanged', onChange);
    // Safety net: some browsers never fire 'voiceschanged'.
    setTimeout(() => finish(synth.getVoices()), 1500);
  });
  voicesPromise.then((v) => {
    if (!v.length) voicesPromise = null; // allow a retry next time
  });
  return voicesPromise;
}

// Per-language name hints for the HIGHEST-quality installed voices, best
// first. Chrome ships network "Google …" voices (very natural); macOS/iOS
// ship premium named voices (Kyoko/O-ren/Otoya for JA, Samantha/Ava/Allison
// for EN); Windows ships "… Natural"/"Online" neural voices. We score by
// these so learners hear a clear, native-sounding voice instead of whatever
// happens to be first in the list.
const VOICE_HINTS: Record<string, string[]> = {
  ja: ['google 日本語', 'google japanese', 'kyoko', 'o-ren', 'oren', 'otoya', 'hattori', 'sora', 'nanami', 'ayumi', 'natural', 'neural', 'online', 'enhanced', 'premium', 'google'],
  en: ['google us english', 'google uk english', 'samantha', 'ava', 'allison', 'evan', 'nathan', 'aaron', 'jenny', 'aria', 'guy', 'natural', 'neural', 'online', 'enhanced', 'premium', 'google', 'siri'],
  zh: ['google 普通话', 'google mandarin', 'tingting', 'meijia', 'sinji', 'xiaoxiao', 'yunyang', 'natural', 'neural', 'online', 'google'],
  ru: ['google русский', 'milena', 'yuri', 'natural', 'neural', 'google'],
  th: ['google', 'kanya', 'narisa', 'natural', 'neural'],
};

function scoreVoice(v: SpeechSynthesisVoice, prefix: string, want: string): number {
  const name = (v.name || '').toLowerCase();
  const vlang = (v.lang || '').toLowerCase().replace('_', '-');
  let s = 0;
  // Exact region match (ja-JP, en-US) beats a generic prefix match.
  if (vlang === want) s += 40;
  else if (vlang.startsWith(prefix)) s += 15;
  // For English, prefer US then GB accents for clarity.
  if (prefix === 'en') {
    if (vlang === 'en-us') s += 12;
    else if (vlang === 'en-gb') s += 6;
  }
  // Quality by known high-fidelity voice names (best first → higher score).
  const hints = VOICE_HINTS[prefix] ?? [];
  hints.forEach((h, i) => {
    if (name.includes(h)) s += (hints.length - i) * 4;
  });
  // Network (non-local) voices on Chrome are the natural "Google" ones.
  if (v.localService === false) s += 8;
  // Penalise obviously low-quality / novelty voices.
  if (/(compact|eloquence|zarvox|albert|bad news|bells|bahh|boing|jester|whisper|wobble|organ|cellos|trinoids|deranged|hysterical)/.test(name)) s -= 25;
  return s;
}

function pickVoice(voices: SpeechSynthesisVoice[], lang: VocabLang): SpeechSynthesisVoice | null {
  const want = lang.toLowerCase();
  const prefix = want.slice(0, 2);
  const candidates = voices.filter((v) => (v.lang || '').toLowerCase().replace('_', '-').startsWith(prefix));
  if (!candidates.length) return null;
  candidates.sort((a, b) => scoreVoice(b, prefix, want) - scoreVoice(a, prefix, want));
  return candidates[0] ?? null;
}

export interface SpeakResult {
  /** Whether something was actually spoken. */
  ok: boolean;
  /** Detected language. */
  lang: VocabLang;
  /** True when a non-English voice was needed but none is installed. */
  missingVoice: boolean;
}

/**
 * Speak a vocab entry with the correct voice/language.
 * - For Chinese, speaks the Hanzi term (pinyin readings can't be voiced
 *   correctly by a zh voice).
 * - For Japanese / others, prefers the reading (furigana / phonetic)
 *   then falls back to the term — matching the prior behaviour.
 * Returns a result so the caller can surface a "no voice installed" hint.
 */
export async function speakVocabEntry(
  entry: { term?: string | null; reading?: string | null },
  opts: { rate?: number; forceLang?: VocabLang } = {},
): Promise<SpeakResult> {
  const lang = opts.forceLang ?? detectVocabLang(entry.term, entry.reading);
  const text =
    lang === 'zh-CN'
      ? (entry.term || entry.reading || '')
      : (entry.reading || entry.term || '');

  if (typeof window === 'undefined' || !window.speechSynthesis || !text.trim()) {
    return { ok: false, lang, missingVoice: false };
  }
  const synth = window.speechSynthesis;
  const voices = await loadVoices();
  const voice = pickVoice(voices, lang);

  // Don't read a CJK/foreign term with a mismatched English voice — that
  // produces gibberish. Tell the caller so it can show a hint instead.
  if (!voice && lang !== 'en-US') {
    return { ok: false, lang, missingVoice: true };
  }

  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  if (voice) u.voice = voice;
  if (opts.rate) u.rate = opts.rate;
  synth.cancel();
  synth.speak(u);
  return { ok: true, lang, missingVoice: false };
}

/** Vietnamese label for a language, used in the "no voice" hint. */
export function langLabel(lang: VocabLang): string {
  switch (lang) {
    case 'ja-JP': return 'tiếng Nhật';
    case 'zh-CN': return 'tiếng Trung';
    case 'ru-RU': return 'tiếng Nga';
    case 'th-TH': return 'tiếng Thái';
    default: return 'tiếng Anh';
  }
}
