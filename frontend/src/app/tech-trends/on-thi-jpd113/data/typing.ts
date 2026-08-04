/**
 * JPD113 — luyện gõ cả đoạn văn.
 *
 * VÌ SAO GÕ BẰNG ROMAJI: người học chưa cài bộ gõ tiếng Nhật, và ở trình
 * độ này việc chuyển kana → âm mới là kỹ năng cần rèn. Người học nhìn
 * đoạn văn THẬT (có kanji), gõ theo CÁCH ĐỌC bằng romaji; mỗi kana gõ
 * đúng thì sáng xanh.
 *
 * Bảng romaji dựng thẳng từ các bảng kana trong cheatsheet.ts — một
 * nguồn duy nhất, nên bảng tra cứu, bài luyện từng chữ và bài gõ đoạn
 * văn không bao giờ lệch nhau.
 */

import {
  HIRAGANA,
  KATAKANA,
  DAKUTEN,
  YOUON,
  KATAKANA_DAKUTEN,
  KATAKANA_YOUON,
  type KanaCell,
} from './cheatsheet';

/* ══════════════════ BẢNG ROMAJI ══════════════════ */

/** Các kiểu viết romaji khác đều phải được chấp nhận, không chỉ Hepburn */
const ALIASES: Record<string, string[]> = {
  shi: ['si'],
  chi: ['ti'],
  tsu: ['tu'],
  fu: ['hu'],
  ji: ['zi', 'di'],
  zu: ['du'],
  sha: ['sya'],
  shu: ['syu'],
  sho: ['syo'],
  cha: ['tya'],
  chu: ['tyu'],
  cho: ['tyo'],
  ja: ['zya', 'jya'],
  ju: ['zyu', 'jyu'],
  jo: ['zyo', 'jyo'],
};

function collect(rows: KanaCell[][], into: Map<string, string[]>) {
  for (const cell of rows.flat()) {
    if (!cell.kana) continue;
    const base = cell.romaji.replace(/\s*\(.*\)\s*/, '').trim();
    const list = [base, ...(ALIASES[base] ?? [])];
    if (cell.kana === 'を' || cell.kana === 'ヲ') list.push('wo');
    // Chỉ ghi lần đầu: ヂ và ジ cùng đọc "ji" nhưng là hai ký tự khác nhau
    if (!into.has(cell.kana)) into.set(cell.kana, list);
  }
}

/** kana → mọi romaji được tính là đúng */
export const KANA_ROMAJI: Map<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  collect(YOUON, m);
  collect(KATAKANA_YOUON, m);
  collect(HIRAGANA, m);
  collect(KATAKANA, m);
  collect(DAKUTEN, m);
  collect(KATAKANA_DAKUTEN, m);
  // ん/ン gõ "n" hoặc "nn" — mọi IME đều nhận cả hai
  m.set('ん', ['n', 'nn']);
  m.set('ン', ['n', 'nn']);
  return m;
})();

/** Dấu câu và khoảng trắng — người gõ không phải nhập, tự nhảy qua */
const SKIP_CHARS = new Set([
  '。', '、', '「', '」', '『', '』', '（', '）', '・', '！', '？', '　', ' ', '\n', '，', '．',
]);

export type TokenKind = 'kana' | 'sokuon' | 'choon' | 'skip';

export interface Token {
  /** Ký tự (hoặc cặp ký tự với âm ghép) hiển thị trên màn hình */
  char: string;
  kind: TokenKind;
  /** Mọi chuỗi romaji được chấp nhận cho token này */
  answers: string[];
}

/**
 * Cắt chuỗi kana thành các token gõ được.
 *
 * Thứ tự thử rất quan trọng: phải khớp âm ghép (2 ký tự như きゃ) TRƯỚC
 * khi khớp 1 ký tự, nếu không き và ゃ bị tách rời và không ai gõ nổi.
 */
export function tokenize(reading: string): Token[] {
  const out: Token[] = [];
  const chars = [...reading];

  for (let i = 0; i < chars.length; i++) {
    const two = chars[i] + (chars[i + 1] ?? '');

    // 1. Âm ghép (きゃ, シュ…)
    if (KANA_ROMAJI.has(two)) {
      out.push({ char: two, kind: 'kana', answers: KANA_ROMAJI.get(two)! });
      i++;
      continue;
    }

    const c = chars[i];

    // 2. Âm ngắt っ/ッ — gõ bằng cách NHÂN ĐÔI phụ âm đầu của token kế tiếp
    if (c === 'っ' || c === 'ッ') {
      const nextTwo = (chars[i + 1] ?? '') + (chars[i + 2] ?? '');
      const nextRomaji =
        KANA_ROMAJI.get(nextTwo)?.[0] ?? KANA_ROMAJI.get(chars[i + 1] ?? '')?.[0] ?? '';
      const consonant = nextRomaji[0];
      out.push({
        char: c,
        kind: 'sokuon',
        answers: consonant ? [consonant] : [],
      });
      continue;
    }

    // 3. Trường âm katakana ー
    if (c === 'ー') {
      out.push({ char: c, kind: 'choon', answers: ['-'] });
      continue;
    }

    // 4. Dấu câu — tự nhảy qua
    if (SKIP_CHARS.has(c)) {
      out.push({ char: c, kind: 'skip', answers: [] });
      continue;
    }

    // 5. Kana đơn
    const single = KANA_ROMAJI.get(c);
    if (single) {
      out.push({ char: c, kind: 'kana', answers: single });
      continue;
    }

    // 6. Ký tự lạ (kanji lọt vào bản kana, chữ Latinh…) — vẫn hiện nhưng
    //    tự nhảy qua, để một lỗi dữ liệu không làm kẹt cả bài.
    out.push({ char: c, kind: 'skip', answers: [] });
  }

  return out;
}

/** Ghép romaji chuẩn của cả bài — dùng cho bộ kiểm và gợi ý */
export function tokensToRomaji(tokens: Token[]): string {
  return tokens.map((t) => (t.kind === 'skip' ? '' : t.answers[0] ?? '')).join('');
}

/**
 * Buffer người gõ có khớp token không.
 *  'match'   — đủ đúng, sang token kế
 *  'prefix'  — đang gõ dở (đã gõ "sh" của "shi"), chờ tiếp
 *  'wrong'   — sai
 */
export function matchToken(buffer: string, token: Token): 'match' | 'prefix' | 'wrong' {
  const b = buffer.toLowerCase();
  if (!b) return 'prefix';
  for (const a of token.answers) {
    if (b === a) return 'match';
  }
  for (const a of token.answers) {
    if (a.startsWith(b)) return 'prefix';
  }
  return 'wrong';
}

/* ══════════════════ GIẢI THÍCH LỖI HAY GẶP ══════════════════ */

/** Vì sao người học gõ sai đúng những ký tự này */
export const KANA_TRAPS: Record<string, string> = {
  し: 'し = shi, KHÔNG phải "si". Đây là ký tự bị gõ sai nhiều nhất.',
  ち: 'ち = chi, không phải "ti".',
  つ: 'つ = tsu, không phải "tu". Chú ý phân biệt với っ (tsu nhỏ = nhịp nghỉ).',
  ふ: 'ふ = fu, không phải "hu". Âm thật nằm giữa "f" và "h" tiếng Việt.',
  を: 'を = o (gõ "o" hoặc "wo"). Chỉ dùng làm trợ từ tân ngữ, không bao giờ nằm trong từ.',
  は: 'は đọc "ha" trong từ, nhưng đọc "wa" khi làm trợ từ chủ đề — cách GÕ vẫn là "ha".',
  へ: 'へ đọc "he" trong từ, "e" khi làm trợ từ chỉ hướng — cách GÕ vẫn là "he".',
  ん: 'ん gõ "n" (hoặc "nn"). Nó là một nhịp riêng: せんせい = 4 nhịp.',
  っ: 'っ là nhịp NGHỈ — gõ bằng cách nhân đôi phụ âm ngay sau nó: がっこう = ga-k-kou.',
  ー: 'ー là gạch kéo dài của katakana — gõ dấu trừ "-". コーヒー = ko-hi-.',
  じ: 'じ = ji (hoặc "zi").',
  ぬ: 'ぬ = nu. Rất dễ nhầm mặt chữ với め (me).',
  め: 'め = me. Rất dễ nhầm mặt chữ với ぬ (nu).',
  ソ: 'ソ = so. Nét dài đi từ TRÊN XUỐNG. Đừng nhầm với ン (n).',
  ン: 'ン = n. Nét dài đi từ DƯỚI LÊN. Đừng nhầm với ソ (so).',
  シ: 'シ = shi. Ba nét, nét dài đi từ dưới lên. Đừng nhầm với ツ (tsu).',
  ツ: 'ツ = tsu. Ba nét, nét dài đi từ trên xuống. Đừng nhầm với シ (shi).',
};

/* ══════════════════ NGÂN HÀNG ĐOẠN VĂN ══════════════════ */

export interface PassageNote {
  term: string;
  reading?: string;
  meaning: string;
  /** Trỏ về đúng chỗ trong giáo trình để tra sâu hơn */
  ref: string;
}

export interface TypingPassage {
  id: string;
  /** 1 = dễ nhất → 5 = khó nhất */
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  /** Bài này ở đâu ra trong giáo trình */
  source: string;
  /** Bản gốc — có kanji, đúng như đề thi in ra */
  text: string;
  /** Bản kana đầy đủ — ĐÂY là thứ người học gõ */
  reading: string;
  vi: string;
  notes: PassageNote[];
}

export const TYPING_PASSAGES: TypingPassage[] = [
  /* ─────────── CẤP 1 — câu ngắn, toàn hiragana ─────────── */
  {
    id: 'p1-aisatsu',
    level: 1,
    title: 'Chào hỏi cơ bản',
    source: 'Chương 3 · Bài 3.1 — Chào hỏi & câu trong lớp',
    text: 'おはようございます。こんにちは。こんばんは。',
    reading: 'おはようございます。こんにちは。こんばんは。',
    vi: 'Chào buổi sáng. Xin chào. Chào buổi tối.',
    notes: [
      { term: 'おはようございます', meaning: 'Chào buổi sáng (lịch sự)', ref: 'Bài 3.1' },
      { term: 'こんにちは', meaning: 'Xin chào (ban ngày) — は ở cuối đọc là "wa"', ref: 'Bài 3.1' },
      { term: 'こんばんは', meaning: 'Chào buổi tối — cũng kết thúc bằng は đọc "wa"', ref: 'Bài 3.1' },
    ],
  },
  {
    id: 'p1-jikoshoukai',
    level: 1,
    title: 'Tự giới thiệu ngắn nhất',
    source: 'Chương 4 · Bài 4.1 — は, です & の',
    text: 'はじめまして。わたしは アンです。よろしく おねがいします。',
    reading: 'はじめまして。わたしは アンです。よろしく おねがいします。',
    vi: 'Rất vui được gặp. Tôi là An. Mong được giúp đỡ.',
    notes: [
      { term: 'はじめまして', meaning: 'Câu chào lần đầu gặp mặt', ref: 'Bài 3.1' },
      { term: 'わたし', reading: '私', meaning: 'tôi — kanji xuất hiện nhiều nhất trong đề thi', ref: 'Bài 7.3' },
      { term: 'は', meaning: 'trợ từ chủ đề, GÕ "ha" nhưng ĐỌC "wa"', ref: 'Bài 4.1' },
    ],
  },
  {
    id: 'p1-gakusei',
    level: 1,
    title: 'Nghề nghiệp & quốc tịch',
    source: 'Chương 4 · Bài 4.3 — Quốc tịch & nghề nghiệp',
    text: 'わたしは がくせいです。ベトナムじんです。',
    reading: 'わたしは がくせいです。ベトナムじんです。',
    vi: 'Tôi là sinh viên. Tôi là người Việt Nam.',
    notes: [
      { term: 'がくせい', reading: '学生', meaning: 'học sinh, sinh viên — Hán-Việt: HỌC SINH', ref: 'Bài 4.3' },
      { term: '～じん', reading: '～人', meaning: 'người nước ~ (ベトナムじん = người Việt)', ref: 'Bài 4.3' },
    ],
  },
  {
    id: 'p1-shumi',
    level: 1,
    title: 'Sở thích',
    source: 'Chương 4 · Bài 4.1 — の nối danh từ',
    text: 'わたしの しゅみは おんがくと どくしょです。',
    reading: 'わたしの しゅみは おんがくと どくしょです。',
    vi: 'Sở thích của tôi là âm nhạc và đọc sách.',
    notes: [
      { term: 'の', meaning: 'trợ từ nối hai danh từ, nghĩa "của"', ref: 'Bài 4.1' },
      { term: 'と', meaning: 'và — liệt kê ĐẦY ĐỦ, khác với や…など (liệt kê ví dụ)', ref: 'Bài 5.6' },
      { term: 'しゅみ', meaning: 'sở thích — có âm ghép しゅ (shu)', ref: 'Bài 1.2' },
    ],
  },

  /* ─────────── CẤP 2 — thêm katakana, âm ngắt, trường âm ─────────── */
  {
    id: 'p2-katakana',
    level: 2,
    title: 'Đồ vật viết bằng katakana',
    source: 'Chương 2 · Bài 2.1 — Katakana & khi nào dùng',
    text: 'テレビと パソコンと カメラが あります。',
    reading: 'テレビと パソコンと カメラが あります。',
    vi: 'Có ti-vi, máy tính và máy ảnh.',
    notes: [
      { term: 'テレビ', meaning: 'ti-vi — từ mượn nên viết katakana', ref: 'Bài 2.1' },
      { term: 'パソコン', meaning: 'máy tính cá nhân (personal computer)', ref: 'Bài 2.1' },
      { term: 'あります', meaning: 'có (đồ vật, không phải người)', ref: 'Bài 5.1' },
    ],
  },
  {
    id: 'p2-choon',
    level: 2,
    title: 'Trường âm katakana — gạch ー',
    source: 'Chương 1 · Bài 1.3 — Trường âm',
    text: 'コーヒーと ケーキを ください。',
    reading: 'コーヒーと ケーキを ください。',
    vi: 'Cho tôi cà phê và bánh ngọt.',
    notes: [
      { term: 'ー', meaning: 'gạch kéo dài của katakana — khi gõ thì nhấn dấu trừ "-"', ref: 'Bài 1.3' },
      { term: 'を', meaning: 'trợ từ tân ngữ — gõ "o" hoặc "wo"', ref: 'Bài 5.4' },
      { term: '～を ください', meaning: 'Cho tôi ~ (mẫu câu gọi món)', ref: 'Bài 3.3' },
    ],
  },
  {
    id: 'p2-sokuon',
    level: 2,
    title: 'Âm ngắt っ — nhịp nghỉ',
    source: 'Chương 1 · Bài 1.2 — Âm ngắt',
    text: 'がっこうへ いきます。きっては ゆうびんきょくです。',
    reading: 'がっこうへ いきます。きっては ゆうびんきょくです。',
    vi: 'Tôi đi đến trường. Tem thì (mua) ở bưu điện.',
    notes: [
      { term: 'っ', meaning: 'nhịp NGHỈ — gõ bằng cách nhân đôi phụ âm sau nó: がっこう = ga-k-kou', ref: 'Bài 1.2' },
      { term: 'へ', meaning: 'trợ từ chỉ hướng — GÕ "he" nhưng ĐỌC "e"', ref: 'Bài 5.4' },
      { term: 'ゆうびんきょく', reading: '郵便局', meaning: 'bưu điện — có âm ghép きょ', ref: 'Từ vựng nơi chốn' },
    ],
  },
  {
    id: 'p2-kazu',
    level: 2,
    title: 'Giá tiền & con số',
    source: 'Chương 3 · Bài 3.3 — Tiền & giá cả',
    text: 'これは ろっぴゃくえんです。それは はっせんえんです。',
    reading: 'これは ろっぴゃくえんです。それは はっせんえんです。',
    vi: 'Cái này 600 yên. Cái kia 8000 yên.',
    notes: [
      { term: 'ろっぴゃく', reading: '六百', meaning: '600 — biến âm, KHÔNG đọc ろくひゃく', ref: 'Bài 3.2' },
      { term: 'はっせん', reading: '八千', meaning: '8000 — biến âm từ はち + せん', ref: 'Bài 3.2' },
      { term: 'これ / それ', meaning: 'cái này / cái đó — đứng một mình, không kèm danh từ', ref: 'Bài 5.1' },
    ],
  },

  /* ─────────── CẤP 3 — đoạn ngắn có kanji ─────────── */
  {
    id: 'p3-jikan',
    level: 3,
    title: 'Giờ giấc trong ngày',
    source: 'Chương 3 · Bài 3.4 — Ngày, giờ & tuổi',
    text: 'まいあさ 六時半に おきます。よる 十一時に ねます。',
    reading: 'まいあさ ろくじはんに おきます。よる じゅういちじに ねます。',
    vi: 'Mỗi sáng tôi dậy lúc 6 rưỡi. Buổi tối 11 giờ tôi đi ngủ.',
    notes: [
      { term: '六時半', reading: 'ろくじはん', meaning: '6 giờ rưỡi — 半 (はん) = rưỡi', ref: 'Bài 3.4' },
      { term: 'に', meaning: 'trợ từ đánh dấu MỐC GIỜ cụ thể', ref: 'Bài 5.4' },
      { term: 'まいあさ', reading: '毎朝', meaning: 'mỗi sáng', ref: 'Từ vựng thời gian' },
    ],
  },
  {
    id: 'p3-youbi',
    level: 3,
    title: 'Lịch học trong tuần',
    source: 'Chương 3 · Bài 3.5 — Ngày trong tuần',
    text: '月曜日から 金曜日まで 学校で 日本語を べんきょうします。',
    reading: 'げつようびから きんようびまで がっこうで にほんごを べんきょうします。',
    vi: 'Từ thứ Hai đến thứ Sáu, tôi học tiếng Nhật ở trường.',
    notes: [
      { term: '～から ～まで', meaning: 'từ… đến… — dùng cho cả giờ giấc lẫn nơi chốn', ref: 'Bài 6.4' },
      { term: 'で', meaning: 'trợ từ chỉ NƠI DIỄN RA hành động (khác に là đích đến)', ref: 'Bài 5.4' },
      { term: '日本語', reading: 'にほんご', meaning: 'tiếng Nhật — Hán-Việt: NHẬT BẢN NGỮ', ref: 'Bài 4.4' },
    ],
  },
  {
    id: 'p3-tanjoubi',
    level: 3,
    title: 'Sinh nhật & tuổi',
    source: 'Chương 3 · Bài 3.4 — Ngày & tuổi',
    text: 'わたしの 誕生日は 八月 四日です。二十歳です。',
    reading: 'わたしの たんじょうびは はちがつ よっかです。はたちです。',
    vi: 'Sinh nhật tôi là ngày 4 tháng 8. Tôi 20 tuổi.',
    notes: [
      { term: '四日', reading: 'よっか', meaning: 'ngày mùng 4 — bất quy tắc, phải học vẹt', ref: 'Bài 3.4' },
      { term: '二十歳', reading: 'はたち', meaning: '20 tuổi — bất quy tắc HOÀN TOÀN, ra đề rất nhiều', ref: 'Bài 3.4' },
      { term: '誕生日', reading: 'たんじょうび', meaning: 'sinh nhật — Hán-Việt: ĐẢN SINH NHẬT', ref: 'Bài 7.3' },
    ],
  },
  {
    id: 'p3-kaimono',
    level: 3,
    title: 'Hỏi đường & mua sắm',
    source: 'Chương 5 · Bài 5.3 — Từ để hỏi',
    text: 'すみません、トイレは どこですか。三階に あります。',
    reading: 'すみません、トイレは どこですか。さんがいに あります。',
    vi: 'Xin lỗi, nhà vệ sinh ở đâu ạ? — Ở tầng 3.',
    notes: [
      { term: 'どこ', meaning: 'ở đâu — một trong 6 từ để hỏi bắt buộc thuộc', ref: 'Bài 5.3' },
      { term: '三階', reading: 'さんがい', meaning: 'tầng 3 — đọc GAI chứ không phải かい, bẫy kinh điển', ref: 'Bài 3.6' },
      { term: 'すみません', meaning: 'Xin lỗi / cho hỏi — mở đầu mọi câu hỏi với người lạ', ref: 'Bài 3.1' },
    ],
  },

  /* ─────────── CẤP 4 — bài đọc thật của đề thi nói ─────────── */
  {
    id: 'p4-anna',
    level: 4,
    title: 'Bài đọc 1 — Anna tự giới thiệu',
    source: 'Ngân hàng thi nói · Bài đọc số 1',
    text: 'はじめまして、私はアンナです。オーストラリア人です。さくら日本語学校の学生です。ことし、二十歳です。',
    reading:
      'はじめまして、わたしはアンナです。オーストラリアじんです。さくらにほんごがっこうのがくせいです。ことし、はたちです。',
    vi: 'Rất vui được gặp, tôi là Anna. Tôi là người Úc. Tôi là học sinh trường Nhật ngữ Sakura. Năm nay tôi 20 tuổi.',
    notes: [
      { term: 'オーストラリア', meaning: 'Úc — katakana dài, có trường âm ー ngay đầu', ref: 'Bài 4.3' },
      { term: '二十歳', reading: 'はたち', meaning: '20 tuổi — bất quy tắc', ref: 'Bài 3.4' },
      { term: '学校', reading: 'がっこう', meaning: 'trường học — có âm ngắt っ', ref: 'Bài 7.3' },
    ],
  },
  {
    id: 'p4-kim',
    level: 4,
    title: 'Bài đọc 2 — Giới thiệu người khác',
    source: 'Ngân hàng thi nói · Bài đọc số 2',
    text: 'みなさん、おはようございます。こちらはキムさんです。キムさんはかんこく人です。キムさんのしゅみはすいえいとテニスです。',
    reading:
      'みなさん、おはようございます。こちらはキムさんです。キムさんはかんこくじんです。キムさんのしゅみはすいえいとテニスです。',
    vi: 'Chào buổi sáng mọi người. Đây là anh/chị Kim. Kim là người Hàn Quốc. Sở thích của Kim là bơi lội và tennis.',
    notes: [
      { term: 'こちら', meaning: 'bản lịch sự của ここ, dùng để GIỚI THIỆU NGƯỜI', ref: 'Bài 5.5' },
      { term: 'かんこく', reading: '韓国', meaning: 'Hàn Quốc — Hán-Việt: HÀN QUỐC', ref: 'Từ vựng quốc gia' },
      { term: 'すいえい', reading: '水泳', meaning: 'bơi lội', ref: 'Từ vựng sở thích' },
    ],
  },
  {
    id: 'p4-tanaka',
    level: 4,
    title: 'Bài đọc 10 — Thầy Tanaka đi làm',
    source: 'Ngân hàng thi nói · Bài đọc số 10',
    text: 'たなかさんは毎日会社にいきます。会社でたなかさんは日本語をおしえます。せいとはベトナム人です。',
    reading:
      'たなかさんはまいにちかいしゃにいきます。かいしゃでたなかさんはにほんごをおしえます。せいとはベトナムじんです。',
    vi: 'Anh Tanaka mỗi ngày đi đến công ty. Ở công ty anh Tanaka dạy tiếng Nhật. Học trò là người Việt Nam.',
    notes: [
      { term: '会社に いきます', meaning: 'ĐI ĐẾN công ty — に đánh dấu đích đến', ref: 'Bài 5.4' },
      { term: '会社で おしえます', meaning: 'DẠY Ở công ty — で đánh dấu nơi hành động diễn ra', ref: 'Bài 5.4' },
      { term: '会社', reading: 'かいしゃ', meaning: 'công ty — Hán-Việt: HỘI XÃ', ref: 'Bài 7.3' },
    ],
  },
  {
    id: 'p4-gupta',
    level: 4,
    title: 'Bài đọc 13 — Gupta học nhạc ở Nhật',
    source: 'Ngân hàng thi nói · Bài đọc số 13',
    text: '私はグプタです。アメリカ人です。私は日本の大学でおんがくをべんきょうします。日曜日、こうえんでサッカーをします。',
    reading:
      'わたしはグプタです。アメリカじんです。わたしはにほんのだいがくでおんがくをべんきょうします。にちようび、こうえんでサッカーをします。',
    vi: 'Tôi là Gupta. Tôi là người Mỹ. Tôi học âm nhạc ở một trường đại học tại Nhật. Chủ Nhật tôi đá bóng ở công viên.',
    notes: [
      { term: '大学', reading: 'だいがく', meaning: 'đại học — Hán-Việt: ĐẠI HỌC', ref: 'Bài 7.3' },
      { term: 'サッカー', meaning: 'bóng đá — có cả âm ngắt ッ lẫn trường âm ー', ref: 'Bài 2.1' },
      { term: 'こうえん', reading: '公園', meaning: 'công viên — Hán-Việt: CÔNG VIÊN', ref: 'Từ vựng nơi chốn' },
    ],
  },

  /* ─────────── CẤP 5 — bài khó nhất ─────────── */
  {
    id: 'p5-ichinichi',
    level: 5,
    title: 'Bài đọc 9 — MỌI số viết bằng kanji (khó nhất)',
    source: 'Ngân hàng thi nói · Bài đọc số 9',
    text: '月曜日から金曜日まで、まいにち九時から四時まで日本語を勉強します。あさ七時におきます。よる十一時にねます。',
    reading:
      'げつようびからきんようびまで、まいにちくじからよじまでにほんごをべんきょうします。あさしちじにおきます。よるじゅういちじにねます。',
    vi: 'Từ thứ Hai đến thứ Sáu, mỗi ngày tôi học tiếng Nhật từ 9 giờ đến 4 giờ. Sáng 7 giờ tôi dậy. Tối 11 giờ tôi đi ngủ.',
    notes: [
      { term: '九時', reading: 'くじ', meaning: '9 giờ — KHÔNG phải きゅうじ', ref: 'Bài 3.4' },
      { term: '四時', reading: 'よじ', meaning: '4 giờ — KHÔNG phải よんじ hay しじ', ref: 'Bài 3.4' },
      { term: '七時', reading: 'しちじ', meaning: '7 giờ — dùng âm しち chứ không phải なな', ref: 'Bài 3.4' },
      { term: '勉強', reading: 'べんきょう', meaning: 'học tập — Hán-Việt "MIỄN CƯỠNG" nhưng nghĩa khác hẳn', ref: 'Bài 7.3' },
    ],
  },
  {
    id: 'p5-tanaka-week',
    level: 5,
    title: 'Bài đọc 5 — Một tuần của anh Tanaka',
    source: 'Ngân hàng thi nói · Bài đọc số 5',
    text: '月曜日から金曜日まで、会社へいきます。あさ、ごぜん九時からごご五時はんまで会社ではたらきます。日曜日、こうえんでテニスをします。',
    reading:
      'げつようびからきんようびまで、かいしゃへいきます。あさ、ごぜんくじからごごごじはんまでかいしゃではたらきます。にちようび、こうえんでテニスをします。',
    vi: 'Từ thứ Hai đến thứ Sáu tôi đi đến công ty. Buổi sáng, tôi làm việc ở công ty từ 9 giờ sáng đến 5 rưỡi chiều. Chủ Nhật tôi chơi tennis ở công viên.',
    notes: [
      { term: 'ごぜん / ごご', meaning: 'sáng (AM) / chiều (PM)', ref: 'Bài 3.4' },
      { term: '九時', reading: 'くじ', meaning: '9 giờ — chỗ vấp kinh điển của bài này', ref: 'Bài 3.4' },
      { term: 'はたらきます', reading: '働きます', meaning: 'làm việc — đi với で (nơi làm)', ref: 'Bài 6.2' },
    ],
  },
  {
    id: 'p5-restaurant',
    level: 5,
    title: 'Bài đọc 7 — Kính ngữ nhà hàng (dài nhất)',
    source: 'Ngân hàng thi nói · Bài đọc số 7',
    text: 'いらっしゃいませ。なんめいさまですか。きんえんせきをおねがいします。かしこまりました。しょうしょうおまちください。',
    reading:
      'いらっしゃいませ。なんめいさまですか。きんえんせきをおねがいします。かしこまりました。しょうしょうおまちください。',
    vi: 'Xin mời vào. Quý khách mấy người ạ? — Cho tôi chỗ cấm hút thuốc. — Vâng ạ. Xin đợi một chút.',
    notes: [
      { term: 'いらっしゃいませ', meaning: 'Câu chào khách của nhà hàng — có っ, học như một khối âm', ref: 'Bài đọc 7' },
      { term: 'かしこまりました', meaning: '“Vâng ạ” trong kính ngữ phục vụ', ref: 'Bài đọc 7' },
      { term: 'しょうしょうおまちください', meaning: 'Xin đợi một chút — có hai âm ghép しょ liền nhau', ref: 'Bài đọc 7' },
    ],
  },
  {
    id: 'p5-full-intro',
    level: 5,
    title: 'Tự giới thiệu đầy đủ — bài tổng duyệt',
    source: 'Tổng hợp Chương 3–6',
    text: 'はじめまして。私はクオンです。ベトナム人です。日本語学校の学生です。誕生日は八月四日です。まいあさ六時半におきて、バスで学校へいきます。しゅみはおんがくとサッカーです。どうぞよろしくおねがいします。',
    reading:
      'はじめまして。わたしはクオンです。ベトナムじんです。にほんごがっこうのがくせいです。たんじょうびははちがつよっかです。まいあさろくじはんにおきて、バスでがっこうへいきます。しゅみはおんがくとサッカーです。どうぞよろしくおねがいします。',
    vi: 'Rất vui được gặp. Tôi là Cường. Tôi là người Việt Nam. Tôi là học sinh trường tiếng Nhật. Sinh nhật tôi là ngày 4 tháng 8. Mỗi sáng tôi dậy lúc 6 rưỡi rồi đi học bằng xe buýt. Sở thích của tôi là âm nhạc và bóng đá. Rất mong được giúp đỡ.',
    notes: [
      { term: 'クオン', meaning: 'Cường viết bằng katakana — xem bảng tra tên ở tab Thi nói', ref: 'Tra tên katakana' },
      { term: 'で', meaning: 'ở đây là PHƯƠNG TIỆN: バスで = bằng xe buýt', ref: 'Bài 6.3' },
      { term: '八月四日', reading: 'はちがつ よっか', meaning: 'ngày 4 tháng 8 — cả tháng lẫn ngày đều phải nhớ', ref: 'Bài 3.4' },
      { term: 'どうぞよろしくおねがいします', meaning: 'Câu chốt bài tự giới thiệu — thuộc lòng để dùng trong phòng thi', ref: 'Bài 3.1' },
    ],
  },
];

export const TYPING_STORAGE_KEY = 'jpd113:typing:v1';

export const LEVEL_META: Record<number, { label: string; color: string }> = {
  1: { label: 'Cấp 1 · Câu ngắn', color: '#4ade80' },
  2: { label: 'Cấp 2 · Katakana & số', color: '#22d3ee' },
  3: { label: 'Cấp 3 · Có kanji', color: '#8b5cf6' },
  4: { label: 'Cấp 4 · Bài đọc thật', color: '#fb923c' },
  5: { label: 'Cấp 5 · Khó nhất', color: '#f43f5e' },
};
