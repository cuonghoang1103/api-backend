/**
 * JPD113 — dữ liệu cho khu luyện gõ / luyện nhận mặt chữ.
 *
 * Kana KHÔNG khai báo lại ở đây: nó dựng thẳng từ các bảng trong
 * cheatsheet.ts để bảng tra cứu và bài luyện không bao giờ lệch nhau.
 *
 * Chữ Hán thì khai báo riêng, vì bài luyện cần thứ bảng tra cứu không
 * có: danh sách romaji được CHẤP NHẬN khi gõ. Một kanji thường có vài
 * cách đọc (人 = hito / jin / nin) và người học gõ cách nào cũng phải
 * được tính đúng — chấm chặt một cách đọc duy nhất chỉ gây ức chế chứ
 * không dạy thêm được gì.
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

export type DrillSetId =
  | 'hira-base'
  | 'hira-extra'
  | 'kata-base'
  | 'kata-extra'
  | 'kana-all'
  | 'kanji';

export interface DrillItem {
  /** Ký tự hiển thị cho người học */
  char: string;
  /** Mọi romaji được tính là đúng */
  answers: string[];
  /** Cách đọc bằng kana — hiện khi trả lời sai (chỉ kanji) */
  reading?: string;
  /** Nghĩa + từ ghép, để sai một lần là nhớ luôn (chỉ kanji) */
  hint?: string;
}

export interface DrillSet {
  id: DrillSetId;
  label: string;
  sub: string;
  items: DrillItem[];
}

/* ══════════════════ KANA ══════════════════
   Một âm có thể viết bằng nhiều kiểu romaji. Bảng dưới liệt kê các
   biến thể phổ biến (Kunrei-shiki, cách gõ IME) đều được chấp nhận. */

const ROMAJI_ALIASES: Record<string, string[]> = {
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
  n: ['nn'],
};

function kanaToItems(rows: KanaCell[][]): DrillItem[] {
  return rows
    .flat()
    .filter((c) => c.kana)
    .map((c) => {
      // "o (trợ từ)" → base "o"; を còn được gõ là "wo" trên mọi IME
      const base = c.romaji.replace(/\s*\(.*\)\s*/, '').trim();
      const answers = [base, ...(ROMAJI_ALIASES[base] ?? [])];
      if (c.kana === 'を' || c.kana === 'ヲ') answers.push('wo');
      return { char: c.kana, answers };
    });
}

/** Bỏ trùng theo ký tự — ヂ/ジ cùng đọc "ji" nhưng là hai chữ khác nhau,
 *  còn cùng một chữ thì không được xuất hiện hai lần trong một vòng. */
function dedupe(items: DrillItem[]): DrillItem[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.char) ? false : (seen.add(i.char), true)));
}

/* ══════════════════ CHỮ HÁN ══════════════════
   43 chữ = trọn bộ kanji xuất hiện trong giáo trình JPD113 và trong
   14 đề FE thật. Xếp theo nhóm để người học chọn luyện từng phần. */

const KANJI_ITEMS: DrillItem[] = [
  // ── Số đếm ──
  { char: '一', answers: ['ichi', 'hito'], reading: 'いち', hint: 'một — 一日 (ついたち) ngày mùng 1' },
  { char: '二', answers: ['ni', 'futa'], reading: 'に', hint: 'hai — 二人 (ふたり) hai người' },
  { char: '三', answers: ['san', 'mi'], reading: 'さん', hint: 'ba — 三時 (さんじ) 3 giờ' },
  { char: '四', answers: ['shi', 'yon', 'yo', 'si'], reading: 'し / よん', hint: 'bốn — 四時 = よじ (KHÔNG phải よんじ)' },
  { char: '五', answers: ['go', 'itsu'], reading: 'ご', hint: 'năm — 五分 (ごふん) 5 phút' },
  { char: '六', answers: ['roku', 'mu'], reading: 'ろく', hint: 'sáu — 六分 = ろっぷん' },
  { char: '七', answers: ['shichi', 'nana', 'siti'], reading: 'しち / なな', hint: 'bảy — 七時 = しちじ' },
  { char: '八', answers: ['hachi', 'ya'], reading: 'はち', hint: 'tám — 八分 = はっぷん' },
  { char: '九', answers: ['kyuu', 'ku', 'kyu'], reading: 'きゅう / く', hint: 'chín — 九時 = くじ' },
  { char: '十', answers: ['juu', 'ju', 'too', 'to'], reading: 'じゅう', hint: 'mười — 十日 (とおか) ngày 10' },
  { char: '百', answers: ['hyaku'], reading: 'ひゃく', hint: 'trăm — 六百 = ろっぴゃく' },
  { char: '千', answers: ['sen', 'chi'], reading: 'せん', hint: 'nghìn — 三千 = さんぜん' },
  { char: '万', answers: ['man', 'ban'], reading: 'まん', hint: 'vạn (10.000) — 一万 = いちまん' },

  // ── Thứ trong tuần & thời gian ──
  { char: '月', answers: ['getsu', 'gatsu', 'tsuki'], reading: 'げつ / がつ', hint: 'trăng, tháng — 月曜日 thứ Hai' },
  { char: '火', answers: ['ka', 'hi'], reading: 'か / ひ', hint: 'lửa — 火曜日 thứ Ba' },
  { char: '水', answers: ['sui', 'mizu'], reading: 'すい / みず', hint: 'nước — 水曜日 thứ Tư' },
  { char: '木', answers: ['moku', 'ki'], reading: 'もく / き', hint: 'cây, gỗ — 木曜日 thứ Năm' },
  { char: '金', answers: ['kin', 'kane'], reading: 'きん / かね', hint: 'vàng, tiền — 金曜日 thứ Sáu' },
  { char: '土', answers: ['do', 'tsuchi'], reading: 'ど / つち', hint: 'đất — 土曜日 thứ Bảy' },
  { char: '日', answers: ['nichi', 'hi', 'bi', 'ka'], reading: 'にち / ひ', hint: 'ngày, mặt trời — 日曜日 Chủ Nhật' },
  { char: '曜', answers: ['you', 'yo'], reading: 'よう', hint: 'thứ (trong tuần) — chỉ dùng trong 曜日' },
  { char: '時', answers: ['ji', 'toki'], reading: 'じ / とき', hint: 'giờ — 66 lần trong 420 câu đề thật' },
  { char: '分', answers: ['fun', 'pun', 'bun', 'hun'], reading: 'ふん / ぷん', hint: 'phút — 1,3,4,6,8,10 đọc ぷん' },
  { char: '間', answers: ['kan', 'aida'], reading: 'かん / あいだ', hint: 'khoảng, giữa — 時間 (じかん) thời gian' },
  { char: '半', answers: ['han'], reading: 'はん', hint: 'rưỡi — 五時半 (ごじはん) 5 rưỡi' },
  { char: '何', answers: ['nani', 'nan'], reading: 'なに / なん', hint: 'gì, bao nhiêu — 57 lần trong đề thật' },
  { char: '今', answers: ['ima', 'kon'], reading: 'いま', hint: 'bây giờ — 今日 (きょう) hôm nay' },
  { char: '毎', answers: ['mai'], reading: 'まい', hint: 'mỗi — 毎日 (まいにち) mỗi ngày' },

  // ── Người, trường học, đời sống ──
  { char: '私', answers: ['watashi'], reading: 'わたし', hint: 'tôi — 86 lần, kanji nhiều nhất toàn bộ đề' },
  { char: '人', answers: ['hito', 'jin', 'nin'], reading: 'ひと / じん', hint: 'người — 日本人 (にほんじん)' },
  { char: '本', answers: ['hon', 'moto'], reading: 'ほん', hint: 'sách, gốc — 日本 (にほん) Nhật Bản' },
  { char: '学', answers: ['gaku', 'gaku'], reading: 'がく', hint: 'học — 学生 (がくせい) sinh viên' },
  { char: '生', answers: ['sei', 'nama', 'shou'], reading: 'せい / なま', hint: 'sinh, sống — 学生, 誕生日, 先生' },
  { char: '先', answers: ['sen', 'saki'], reading: 'せん', hint: 'trước — 先生 (せんせい) giáo viên' },
  { char: '校', answers: ['kou', 'ko'], reading: 'こう', hint: 'trường — 学校 (がっこう)' },
  { char: '語', answers: ['go'], reading: 'ご', hint: 'ngôn ngữ — 日本語, 英語' },
  { char: '才', answers: ['sai'], reading: 'さい', hint: 'tuổi — 20才 = はたち (bất quy tắc)' },
  { char: '円', answers: ['en'], reading: 'えん', hint: 'yên (tiền) — 1000円' },
  { char: '食', answers: ['shoku', 'ta', 'syoku'], reading: 'しょく / た', hint: 'ăn — 食べます, 食堂' },
  { char: '誕', answers: ['tan'], reading: 'たん', hint: 'sinh — 誕生日 (たんじょうび) sinh nhật' },
  { char: '字', answers: ['ji'], reading: 'じ', hint: 'chữ — 漢字 (かんじ)' },
  { char: '性', answers: ['sei'], reading: 'せい', hint: 'giới tính — 男性, 女性' },
  { char: '田', answers: ['ta', 'da'], reading: 'た', hint: 'ruộng — 田中さん (たなか)' },
  { char: '中', answers: ['naka', 'chuu', 'chu'], reading: 'なか / ちゅう', hint: 'giữa, trong — 中国 Trung Quốc' },
  { char: '大', answers: ['dai', 'oo', 'tai'], reading: 'だい / おお', hint: 'lớn — 大学 (だいがく) đại học' },
  { char: '会', answers: ['kai', 'a'], reading: 'かい', hint: 'gặp, hội — 会社 (かいしゃ) công ty' },
  { char: '社', answers: ['sha', 'sya'], reading: 'しゃ', hint: 'công ty, xã — 会社員 nhân viên' },
  { char: '国', answers: ['kuni', 'koku', 'goku'], reading: 'くに / こく', hint: 'nước — お国はどちらですか' },
  { char: '英', answers: ['ei', 'e'], reading: 'えい', hint: 'Anh — 英語 = えいご (KHÔNG phải イギリスご)' },
];

/* ══════════════════ CÁC BỘ LUYỆN ══════════════════ */

const hiraBase = kanaToItems(HIRAGANA);
const hiraExtra = dedupe([...kanaToItems(DAKUTEN), ...kanaToItems(YOUON)]);
const kataBase = kanaToItems(KATAKANA);
const kataExtra = dedupe([...kanaToItems(KATAKANA_DAKUTEN), ...kanaToItems(KATAKANA_YOUON)]);

export const DRILL_SETS: DrillSet[] = [
  {
    id: 'hira-base',
    label: 'Hiragana cơ bản',
    sub: `${hiraBase.length} chữ · học ngày 1`,
    items: hiraBase,
  },
  {
    id: 'hira-extra',
    label: 'Hiragana biến âm',
    sub: `${hiraExtra.length} chữ · âm đục + âm ghép`,
    items: hiraExtra,
  },
  {
    id: 'kata-base',
    label: 'Katakana cơ bản',
    sub: `${kataBase.length} chữ · từ mượn`,
    items: kataBase,
  },
  {
    id: 'kata-extra',
    label: 'Katakana biến âm',
    sub: `${kataExtra.length} chữ`,
    items: kataExtra,
  },
  {
    id: 'kana-all',
    label: 'Toàn bộ kana',
    sub: `${hiraBase.length + hiraExtra.length + kataBase.length + kataExtra.length} chữ · trộn lẫn`,
    items: dedupe([...hiraBase, ...hiraExtra, ...kataBase, ...kataExtra]),
  },
  {
    id: 'kanji',
    label: 'Chữ Hán',
    sub: `${KANJI_ITEMS.length} chữ · trọn bộ của môn`,
    items: KANJI_ITEMS,
  },
];

export const DRILL_STORAGE_KEY = 'jpd113:drill:v1';

/** Thống kê mỗi ký tự, dùng để ưu tiên lặp lại chữ hay sai */
export interface DrillStat {
  right: number;
  wrong: number;
}

/** Chuẩn hoá câu trả lời: bỏ hoa/thường, khoảng trắng, gạch nối và dấu ' */
export function normalizeAnswer(s: string): string {
  return s.toLowerCase().replace(/[\s\-'’]/g, '');
}

export function isCorrect(input: string, item: DrillItem): boolean {
  const v = normalizeAnswer(input);
  if (!v) return false;
  return item.answers.some((a) => normalizeAnswer(a) === v);
}

/**
 * Xếp hàng câu hỏi cho một vòng.
 *
 * Chữ từng sai được nhân bản thêm trong rổ bốc (tối đa 3 lần) nên nó
 * quay lại thường xuyên hơn — đây là toàn bộ "trí thông minh" cần có
 * cho một vòng 20 câu; không cần thuật toán SRS đầy đủ.
 */
export function buildQueue(
  items: DrillItem[],
  stats: Record<string, DrillStat>,
  size: number,
): DrillItem[] {
  const pool: DrillItem[] = [];
  for (const it of items) {
    const s = stats[it.char];
    const weight = 1 + Math.min(2, s?.wrong ?? 0);
    for (let i = 0; i < weight; i++) pool.push(it);
  }

  // Xáo trộn Fisher-Yates rồi lấy ra `size` chữ KHÁC NHAU
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const picked: DrillItem[] = [];
  const used = new Set<string>();
  for (const it of pool) {
    if (used.has(it.char)) continue;
    used.add(it.char);
    picked.push(it);
    if (picked.length >= size) break;
  }
  return picked;
}

/** 3 đáp án nhiễu + 1 đáp án đúng, đã xáo trộn */
export function buildChoices(correct: DrillItem, all: DrillItem[], reverse: boolean): string[] {
  const right = reverse ? correct.char : correct.answers[0];
  const others = all
    .filter((i) => i.char !== correct.char)
    .map((i) => (reverse ? i.char : i.answers[0]))
    .filter((v, idx, arr) => v !== right && arr.indexOf(v) === idx);

  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }

  const out = [right, ...others.slice(0, 3)];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
