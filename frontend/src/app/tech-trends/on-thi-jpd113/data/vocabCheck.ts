/**
 * Chấm bài "Viết đáp án" của tab Từ vựng.
 *
 * Nguyên tắc: chấm phải KHOAN DUNG. Mục đích là kiểm tra người học có
 * nhớ từ hay không, chứ không phải bắt lỗi chính tả — chấm chặt quá thì
 * người ta bỏ tính năng chứ không học thêm được gì.
 *
 * Vì thế:
 *  - Chiều Nhật→Việt: nghĩa "Học sinh, sinh viên" thì gõ "học sinh" hay
 *    "sinh viên" đều đúng; gõ không dấu ("hoc sinh") cũng đúng.
 *  - Chiều Việt→Nhật: gõ kanji (私), kana (わたし) hay romaji (watashi)
 *    đều đúng — người học có thể chưa gõ được kanji bằng bộ gõ.
 */

import { tokenize, tokensToRomaji } from './typing';
import type { VocabWord } from './vocab';

/* ══════════════════ TIẾNG VIỆT ══════════════════ */

function stripDiacritics(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

function normalizeVi(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,;!?"'’“”()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Một nghĩa có thể viết nhiều kiểu. "Học sinh, sinh viên" cho ra
 * ["học sinh, sinh viên", "học sinh", "sinh viên"] — gõ kiểu nào cũng đúng.
 */
export function viAnswers(meaning: string): string[] {
  const whole = normalizeVi(meaning);
  const parts = meaning
    .split(/[,;/]|\bhoặc\b/)
    .map(normalizeVi)
    .filter((p) => p.length >= 2);
  // Bỏ phần chú thích trong ngoặc: "giáo viên (nghề nghiệp)" → cũng nhận "giáo viên"
  const noParen = normalizeVi(meaning.replace(/[（(][^）)]*[）)]/g, ''));
  return [...new Set([whole, noParen, ...parts])].filter(Boolean);
}

export function checkVi(input: string, word: VocabWord): boolean {
  const given = normalizeVi(input);
  if (!given) return false;
  const givenNo = stripDiacritics(given);
  return viAnswers(word.meaning).some((a) => a === given || stripDiacritics(a) === givenNo);
}

/* ══════════════════ TIẾNG NHẬT ══════════════════ */

function normalizeJa(s: string): string {
  return s
    .replace(/[（(][^）)]*[）)]/g, '') // bỏ phần （お） trong （お）名前
    .replace(/[～〜~]/g, '') // bỏ dấu ～ của ～人, ～語
    .replace(/[\s　]/g, '')
    .trim();
}

/** Katakana → hiragana, để gõ nhầm bảng vẫn được tính đúng */
function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/**
 * Mọi cách viết được chấp nhận cho một từ: dạng chuẩn, cách đọc kana,
 * romaji của cách đọc, và biến thể bỏ tiền tố lịch sự お/ご.
 */
export function jaAnswers(word: VocabWord): string[] {
  const out = new Set<string>();
  const add = (v: string) => {
    const n = normalizeJa(v);
    if (n) {
      out.add(n);
      out.add(kataToHira(n));
    }
  };

  add(word.word);
  add(word.kana);

  // （お）名前 → cũng nhận なまえ (không có お lịch sự)
  const kanaNorm = normalizeJa(word.kana);
  if (/^[おご]/.test(kanaNorm) && kanaNorm.length > 2) add(kanaNorm.slice(1));

  // Romaji của cách đọc — cho người chưa quen gõ kana
  const romaji = tokensToRomaji(tokenize(kanaNorm)).toLowerCase();
  if (romaji) out.add(romaji);
  const romajiNoPrefix = /^[おご]/.test(kanaNorm)
    ? tokensToRomaji(tokenize(kanaNorm.slice(1))).toLowerCase()
    : '';
  if (romajiNoPrefix) out.add(romajiNoPrefix);

  return [...out];
}

export function checkJa(input: string, word: VocabWord): boolean {
  const raw = normalizeJa(input);
  if (!raw) return false;
  const candidates = new Set([raw, kataToHira(raw), raw.toLowerCase()]);
  const answers = jaAnswers(word);
  for (const c of candidates) {
    if (answers.includes(c)) return true;
  }
  return false;
}
