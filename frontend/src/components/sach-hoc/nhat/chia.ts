/**
 * Chia động từ & tính từ tiếng Nhật — thuật toán + dữ liệu cho mục tra cứu
 * "Chia động từ & tính từ" của khoá Dekiru (ChiaDongTu.tsx).
 *
 * Viết bằng MÃ, không tra bảng từng động từ: đổi đuôi theo nhóm, cộng bảng ngoại
 * lệ (行く→行って, ある→ない, 来る/する, 帰る/入る/走る/知る/切る… đuôi る mà nhóm I).
 * Chữ viết có furigana `{漢字|かな}` giữ nguyên phần chữ Hán, chỉ đổi phần đuôi kana.
 *
 * Kiểm thử: `npm run dekiru:chia:test` (chia.test.ts — mọi động từ trong sách).
 * Tệp thuần (không React, không alias) để Node chạy thẳng được.
 */

export type Nhom = 1 | 2 | 3;
export type Verb = { d: string; vi: string; nhom: Nhom; bai: number };

/* ── Động từ trong sách (thể từ điển có furigana · nghĩa · nhóm · bài xuất hiện đầu) ── */
const V = (d: string, vi: string, nhom: Nhom, bai: number): Verb => ({ d, vi, nhom, bai });
export const VERBS: Verb[] = [
  V('{行|い}く', 'đi', 1, 3), V('{来|く}る', 'đến', 3, 3), V('{帰|かえ}る', 'về', 1, 3),
  V('{食|た}べる', 'ăn', 2, 3), V('{飲|の}む', 'uống', 1, 3), V('{見|み}る', 'xem, nhìn', 2, 3),
  V('する', 'làm', 3, 3), V('{買|か}う', 'mua', 1, 3), V('{聞|き}く', 'nghe; hỏi', 1, 3),
  V('{働|はたら}く', 'làm việc', 1, 3), V('{読|よ}む', 'đọc', 1, 3), V('{起|お}きる', 'thức dậy', 2, 3),
  V('{寝|ね}る', 'ngủ', 2, 3), V('{勉強|べんきょう}する', 'học', 3, 3), V('{休|やす}む', 'nghỉ', 1, 3),
  V('ある', 'có (đồ vật)', 1, 4), V('{会|あ}う', 'gặp', 1, 5), V('{作|つく}る', 'làm, nấu', 1, 5),
  V('{登|のぼ}る', 'leo', 1, 5), V('{入|はい}る', 'vào', 1, 5), V('{撮|と}る', 'chụp (ảnh)', 1, 5),
  V('{借|か}りる', 'mượn', 2, 5), V('{洗濯|せんたく}する', 'giặt giũ', 3, 5), V('{掃除|そうじ}する', 'dọn dẹp', 3, 5),
  V('{遊|あそ}ぶ', 'chơi', 1, 6),
  V('いる', 'có, ở (người, con vật)', 2, 7), V('{洗|あら}う', 'rửa', 1, 7), V('{置|お}く', 'đặt, để', 1, 7),
  V('{書|か}く', 'viết', 1, 7), V('{貸|か}す', 'cho mượn', 1, 7), V('{切|き}る', 'cắt', 1, 7),
  V('{使|つか}う', 'dùng', 1, 7), V('{手伝|てつだ}う', 'giúp', 1, 7), V('{取|と}る', 'lấy', 1, 7),
  V('わかる', 'hiểu', 1, 7), V('{出|だ}す', 'đưa ra, nộp', 1, 7), V('{入|い}れる', 'cho vào', 2, 7),
  V('{教|おし}える', 'dạy; chỉ cho', 2, 7), V('{歌|うた}う', 'hát', 1, 7), V('{吸|す}う', 'hút (thuốc)', 1, 7),
  V('{話|はな}す', 'nói chuyện', 1, 7), V('{弾|ひ}く', 'chơi (đàn)', 1, 7), V('{持|も}つ', 'cầm, mang', 1, 7),
  V('{開|あ}ける', 'mở', 2, 7), V('{閉|し}める', 'đóng', 2, 7), V('かける', 'gọi (điện); đeo (kính)', 2, 7),
  V('{住|す}む', 'sống (ở)', 1, 8), V('{送|おく}る', 'gửi', 1, 8), V('もらう', 'nhận', 1, 8),
  V('あげる', 'cho, tặng', 2, 8), V('くれる', 'cho (tôi)', 2, 8), V('{結婚|けっこん}する', 'kết hôn', 3, 8),
  V('{泳|およ}ぐ', 'bơi', 1, 9), V('{集|あつ}める', 'sưu tầm', 2, 9), V('{運転|うんてん}する', 'lái (xe)', 3, 9),
  V('{習|なら}う', 'học (có thầy)', 1, 9), V('{乗|の}る', 'lên (xe)', 1, 9), V('できる', 'có thể', 2, 9),
  V('{言|い}う', 'nói', 1, 9), V('{払|はら}う', 'trả (tiền)', 1, 9), V('{降|お}りる', 'xuống (xe)', 2, 9),
  V('{見|み}せる', 'cho xem', 2, 9),
  V('{曲|ま}がる', 'rẽ', 1, 10), V('{渡|わた}る', 'băng qua', 1, 10), V('{探|さが}す', 'tìm', 1, 10),
  V('{押|お}す', 'ấn, bấm', 1, 10), V('{座|すわ}る', 'ngồi', 1, 10), V('{立|た}つ', 'đứng', 1, 10),
  V('{捨|す}てる', 'vứt', 2, 10), V('{疲|つか}れる', 'mệt', 2, 10), V('{歩|ある}く', 'đi bộ', 1, 10),
  V('{飛|と}ぶ', 'bay', 1, 10), V('なる', 'trở nên', 1, 10),
  V('{終|お}わる', 'kết thúc', 1, 11), V('{通|かよ}う', 'đi (học, làm) đều đặn', 1, 11), V('{忘|わす}れる', 'quên', 2, 11),
  V('{始|はじ}める', 'bắt đầu (việc gì)', 2, 11), V('{消|け}す', 'tắt; xoá', 1, 11), V('つける', 'bật', 2, 11),
  V('{走|はし}る', 'chạy', 1, 12), V('{待|ま}つ', 'chờ', 1, 12), V('{浴|あ}びる', 'tắm (vòi sen)', 2, 12),
  V('{出|で}かける', 'ra ngoài', 2, 12), V('{脱|ぬ}ぐ', 'cởi', 1, 12), V('{磨|みが}く', 'đánh (răng)', 1, 12),
  V('{知|し}る', 'biết', 1, 13), V('{売|う}る', 'bán', 1, 13), V('{着|き}る', 'mặc (áo)', 2, 13),
  V('{泊|と}まる', 'trọ lại', 1, 13), V('はく', 'mặc (quần), đi (giày)', 1, 13),
  V('{思|おも}う', 'nghĩ', 1, 14), V('{笑|わら}う', 'cười', 1, 14), V('{並|なら}ぶ', 'xếp hàng', 1, 14),
  V('{出|で}る', 'ra, rời', 2, 14), V('{止|と}める', 'dừng, đỗ (xe)', 2, 14),
  V('{死|し}ぬ', 'chết', 1, 15), V('{急|いそ}ぐ', 'vội', 1, 15), V('{勝|か}つ', 'thắng', 1, 15),
  V('{始|はじ}まる', '(việc) bắt đầu', 1, 15), V('{降|ふ}る', '(mưa) rơi', 1, 15), V('{晴|は}れる', '(trời) nắng, quang', 2, 15),
];

/**
 * Đuôi る mà là nhóm I — nhìn như nhóm II (trước る là âm i/e) nhưng chia như nhóm I.
 * Học thuộc những từ trong sách: 帰る, 入る, 走る, 知る, 切る (+ 要る, 減る, 喋る, 滑る).
 */
export const NGOAI_LE_RU = ['かえる', 'はいる', 'はしる', 'しる', 'きる', 'いる', 'へる', 'しゃべる', 'すべる'];
/* きる = 切る (cắt, nhóm I) nhưng 着る (mặc) là nhóm II; いる = 要る (cần, nhóm I) nhưng いる (có) là nhóm II —
   cùng cách đọc, phải nhìn chữ Hán. Bảng VERBS ghi rõ nhóm nên không nhầm; ô tra chỉ đoán khi từ lạ. */

/* ── Hàng kana ─────────────────────────────────────────────────────────── */

const ROW: Record<string, [string, string, string, string, string]> = {
  // u:  [a, i, u, e, o]
  う: ['わ', 'い', 'う', 'え', 'お'], く: ['か', 'き', 'く', 'け', 'こ'], ぐ: ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  す: ['さ', 'し', 'す', 'せ', 'そ'], つ: ['た', 'ち', 'つ', 'て', 'と'], ぬ: ['な', 'に', 'ぬ', 'ね', 'の'],
  ぶ: ['ば', 'び', 'ぶ', 'べ', 'ぼ'], む: ['ま', 'み', 'む', 'め', 'も'], る: ['ら', 'り', 'る', 'れ', 'ろ'],
};
const I_TO_U: Record<string, string> = Object.fromEntries(Object.entries(ROW).map(([u, r]) => [r[1], u]));
const I_ROW = new Set(['い', 'き', 'ぎ', 'し', 'じ', 'ち', 'に', 'ひ', 'び', 'ぴ', 'み', 'り']);
const E_ROW = new Set(['え', 'け', 'げ', 'せ', 'ぜ', 'て', 'で', 'ね', 'へ', 'べ', 'ぺ', 'め', 'れ']);

/** Bỏ furigana: {食|た}べる → 食べる. */
export const bare = (t: string) => t.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
/** Chỉ cách đọc: {食|た}べる → たべる. */
export const reading = (t: string) => t.replace(/\{[^|}]+\|([^}]+)\}/g, '$1');

/* ── Các thể ───────────────────────────────────────────────────────────── */

export type FormKey =
  | 'masu' | 'masen' | 'mashita' | 'masendeshita' | 'mashou' | 'tai' | 'kata'
  | 'jisho' | 'nai' | 'ta' | 'nakatta' | 'te' | 'naide' | 'tara' | 'temo';

/**
 * Chia một động từ (thể từ điển, có thể có furigana) sang mọi thể trong sách.
 * Ví dụ: conjugate('{行|い}く', 1).te === '{行|い}って'.
 */
export function conjugate(d: string, nhom: Nhom): Record<FormKey, string> {
  const r = reading(d);
  let masuStem: string; // phần trước ます
  let naiStem: string; // phần trước ない
  let te: string;
  let ta: string;

  if (nhom === 3) {
    if (r.endsWith('くる') && bare(d).endsWith('来る')) {
      // 来る: đổi CẢ cách đọc chữ Hán — く・き・こ.
      const pre = d.slice(0, d.lastIndexOf('{来|'));
      masuStem = `${pre}{来|き}`; naiStem = `${pre}{来|こ}`; te = `${pre}{来|き}て`; ta = `${pre}{来|き}た`;
    } else if (r.endsWith('くる')) {
      const pre = d.slice(0, -2);
      masuStem = `${pre}き`; naiStem = `${pre}こ`; te = `${pre}きて`; ta = `${pre}きた`;
    } else {
      const pre = d.replace(/・?する$/, '');
      masuStem = `${pre}し`; naiStem = `${pre}し`; te = `${pre}して`; ta = `${pre}した`;
    }
  } else if (nhom === 2) {
    const pre = d.slice(0, -1); // bỏ る
    masuStem = pre; naiStem = pre; te = `${pre}て`; ta = `${pre}た`;
  } else {
    const u = d.slice(-1);
    const pre = d.slice(0, -1);
    const row = ROW[u];
    if (!row) throw new Error(`Không phải đuôi động từ nhóm I: ${d}`);
    masuStem = pre + row[1];
    naiStem = pre + row[0];
    // Thể て/た: う・つ・る → って · む・ぶ・ぬ → んで · く → いて · ぐ → いで · す → して.
    const tail = 'うつる'.includes(u) ? 'って' : 'むぶぬ'.includes(u) ? 'んで' : u === 'く' ? 'いて' : u === 'ぐ' ? 'いで' : 'して';
    // Ngoại lệ duy nhất: 行く → 行って (không phải 行いて).
    te = pre + (r.endsWith('いく') && (bare(d).endsWith('行く') || r === 'いく') ? 'って' : tail);
    ta = te.slice(0, -1) + (te.endsWith('で') ? 'だ' : 'た');
  }
  // ある: thể ない là ない (không phải あらない).
  const aru = nhom === 1 && r.endsWith('ある') && bare(d).endsWith('ある');
  const nai = aru ? d.slice(0, -2) + 'ない' : `${naiStem}ない`;
  const nakatta = nai.slice(0, -1) + 'かった';
  return {
    masu: `${masuStem}ます`, masen: `${masuStem}ません`, mashita: `${masuStem}ました`,
    masendeshita: `${masuStem}ませんでした`, mashou: `${masuStem}ましょう`, tai: `${masuStem}たい`,
    kata: `${masuStem}{方|かた}`,
    jisho: d, nai, ta, nakatta, te,
    naide: `${nai}で`,
    tara: `${ta}ら`,
    temo: `${te}も`,
  };
}

/* ── Nhận diện từ người học gõ ─────────────────────────────────────────── */

export type Found = { verb: Verb; known: boolean; note?: string };

/** Romaji (Hepburn, cả kiểu gõ bàn phím) → hiragana. Chữ không đổi được giữ nguyên. */
export function romajiToKana(input: string): string {
  const T: Record<string, string> = {
    kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ', gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ', sha: 'しゃ', shu: 'しゅ', sho: 'しょ', shi: 'し',
    sya: 'しゃ', syu: 'しゅ', syo: 'しょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ', ji: 'じ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
    cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ', chi: 'ち', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', tsu: 'つ', nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
    hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ', bya: 'びゃ', byu: 'びゅ', byo: 'びょ', pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
    mya: 'みゃ', myu: 'みゅ', myo: 'みょ', rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ', fu: 'ふ', dzu: 'づ',
    ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ', ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
    sa: 'さ', si: 'し', su: 'す', se: 'せ', so: 'そ', za: 'ざ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
    ta: 'た', ti: 'ち', tu: 'つ', te: 'て', to: 'と', da: 'だ', di: 'ぢ', du: 'づ', de: 'で', do: 'ど',
    na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の', ha: 'は', hi: 'ひ', hu: 'ふ', he: 'へ', ho: 'ほ',
    ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ', pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
    ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も', ya: 'や', yu: 'ゆ', yo: 'よ',
    ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ', wa: 'わ', wo: 'を', a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  };
  let s = input.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, (m) => (m === '̄' ? '~' : ''))
    .replace(/([aiueo])~/g, '$1$1').replace(/[\s'-]/g, "'");
  let out = '';
  while (s.length) {
    if (s[0] === "'") { s = s.slice(1); continue; }
    // Phụ âm đôi → っ (kk, tt, ss, pp, tch).
    if (s.length > 1 && s[0] === s[1] && /[bcdfghjkmpqrstvwxyz]/.test(s[0])) { out += 'っ'; s = s.slice(1); continue; }
    if (s.startsWith('tch')) { out += 'っ'; s = s.slice(1); continue; }
    if (s[0] === 'n' && (s.length === 1 || !/[aiueoy]/.test(s[1]))) { out += 'ん'; s = s.slice(s[1] === 'n' ? 2 : 1); continue; }
    const hit = [3, 2, 1].map((n) => s.slice(0, n)).find((k) => T[k]);
    if (!hit) { out += s[0]; s = s.slice(1); continue; }
    out += T[hit];
    s = s.slice(hit.length);
  }
  return out;
}

const norm = (t: string) => t.normalize('NFKC').trim().replace(/[。．.!！?？\s]+$/g, '').replace(/^\s+/, '');

/** Mọi dạng (chữ Hán + kana) của mọi thể của mọi động từ trong sách → các động từ (きます = 来ます VÀ 着ます). */
let formIndex: Map<string, Verb[]> | null = null;
function index() {
  if (formIndex) return formIndex;
  const m = new Map<string, Verb[]>();
  for (const v of VERBS) {
    for (const x of Object.values(conjugate(v.d, v.nhom))) {
      for (const k of new Set([bare(x), reading(x)])) {
        const list = m.get(k) ?? [];
        if (!list.includes(v)) list.push(v);
        m.set(k, list);
      }
    }
  }
  formIndex = m;
  return m;
}

/**
 * Nhận một động từ người học gõ (kana / kanji / romaji; thể ます, thể từ điển hay
 * thể khác trong sách) → các động từ khớp (có thể nhiều: きます = 来ます / 着ます).
 * Từ ngoài sách thì đoán nhóm theo quy tắc, kèm lời nhắc.
 */
export function findVerbs(input: string): Found[] {
  let t = norm(input);
  if (!t) return [];
  if (/^[a-zA-Zāīūēō'\s-]+$/.test(t)) t = romajiToKana(t);
  const hit = index().get(t);
  if (hit) return hit.map((verb) => ({ verb, known: true }));
  return guess(t);
}

function guess(t: string): Found[] {
  const one = guess1(t);
  return one ? [one] : [];
}

function guess1(t: string): Found | null {
  if (!/^[\u3040-\u30ff\u4e00-\u9fff々ー]+$/.test(t)) return null;
  if (t.endsWith('ます')) {
    const stem = t.slice(0, -2);
    if (!stem) return null;
    // …します dài (danh từ + します: さんぽします, ダンスします) → nhóm III; ngắn như はなします thì có sẵn trong sách.
    if (stem.endsWith('し') && stem.length >= 3) {
      return { verb: { d: `${stem.slice(0, -1)}する`, vi: '', nhom: 3, bai: 0 }, known: false, note: 'Đoán: danh từ + します → nhóm III. (Nếu là động từ đuôi す như 話します thì là nhóm I — 話す.)' };
    }
    const last = stem.slice(-1);
    if (E_ROW.has(last)) return { verb: { d: `${stem}る`, vi: '', nhom: 2, bai: 0 }, known: false, note: 'Đoán: trước ます là âm hàng え → nhóm II.' };
    if (I_ROW.has(last) && I_TO_U[last]) {
      return {
        verb: { d: stem.slice(0, -1) + I_TO_U[last], vi: '', nhom: 1, bai: 0 }, known: false,
        note: 'Đoán: trước ます là âm hàng い → thường là nhóm I. NHƯNG vài từ hàng い là nhóm II (見ます, 起きます, 借ります, 浴びます, できます…) — tra từ điển cho chắc.',
      };
    }
    return null;
  }
  const last = t.slice(-1);
  if (t.endsWith('する')) return { verb: { d: t, vi: '', nhom: 3, bai: 0 }, known: false, note: 'Đuôi する → nhóm III.' };
  if (last === 'る') {
    const r = reading(t);
    const before = r.slice(-2, -1);
    if ((I_ROW.has(before) || E_ROW.has(before)) && !NGOAI_LE_RU.some((x) => r.endsWith(x))) {
      return { verb: { d: t, vi: '', nhom: 2, bai: 0 }, known: false, note: 'Đoán: đuôi る, trước る là âm hàng い/え → nhóm II (trừ ngoại lệ như 帰る, 入る, 走る, 知る, 切る).' };
    }
    return { verb: { d: t, vi: '', nhom: 1, bai: 0 }, known: false, note: 'Đuôi る nhưng trước る là âm hàng あ/う/お (hoặc là từ ngoại lệ) → nhóm I.' };
  }
  if (ROW[last]) return { verb: { d: t, vi: '', nhom: 1, bai: 0 }, known: false, note: `Đuôi ${last} (không phải る) → luôn là nhóm I.` };
  return null;
}

/* ── Tính từ ───────────────────────────────────────────────────────────── */

export type AdjKey = 'hien' | 'phu' | 'qua' | 'quaPhu' | 'te' | 'bn' | 'naru' | 'ffHien' | 'ffPhu' | 'ffQua' | 'ffQuaPhu' | 'tara' | 'temo';
export type Adj = { d: string; vi: string; loai: 'i' | 'na'; bai: number };
const A = (d: string, vi: string, loai: 'i' | 'na', bai: number): Adj => ({ d, vi, loai, bai });
export const ADJS: Adj[] = [
  A('{大|おお}きい', 'to', 'i', 4), A('{小|ちい}さい', 'nhỏ', 'i', 4), A('{高|たか}い', 'cao; đắt', 'i', 4), A('{安|やす}い', 'rẻ', 'i', 4),
  A('{新|あたら}しい', 'mới', 'i', 4), A('{古|ふる}い', 'cũ', 'i', 4), A('{暑|あつ}い', 'nóng (trời)', 'i', 4), A('{寒|さむ}い', 'lạnh (trời)', 'i', 4),
  A('おいしい', 'ngon', 'i', 4), A('いい', 'tốt', 'i', 4), A('{楽|たの}しい', 'vui', 'i', 5), A('{忙|いそが}しい', 'bận', 'i', 5),
  A('{難|むずか}しい', 'khó', 'i', 5), A('おもしろい', 'thú vị', 'i', 5), A('{近|ちか}い', 'gần', 'i', 6), A('{遠|とお}い', 'xa', 'i', 6),
  A('{静|しず}か', 'yên tĩnh', 'na', 4), A('にぎやか', 'nhộn nhịp', 'na', 4), A('きれい', 'đẹp; sạch', 'na', 4), A('{有名|ゆうめい}', 'nổi tiếng', 'na', 4),
  A('{元気|げんき}', 'khoẻ', 'na', 4), A('{簡単|かんたん}', 'dễ', 'na', 5), A('{大変|たいへん}', 'vất vả', 'na', 5), A('{暇|ひま}', 'rảnh', 'na', 5),
  A('{好|す}き', 'thích', 'na', 5), A('{嫌|きら}い', 'ghét', 'na', 5), A('{上手|じょうず}', 'giỏi', 'na', 9), A('{便利|べんり}', 'tiện lợi', 'na', 14),
];

/** Chia tính từ (い: bỏ い rồi thêm đuôi · な: thêm đuôi). いい → よ… (ngoại lệ). */
export function conjugateAdj(d: string, loai: 'i' | 'na'): Record<AdjKey, string> {
  if (loai === 'i') {
    const ii = reading(d) === 'いい';
    const st = ii ? 'よ' : d.slice(0, -1);
    return {
      hien: `${d}です`, phu: `${st}くないです`, qua: `${st}かったです`, quaPhu: `${st}くなかったです`,
      te: `${st}くて`, bn: `${d} N`, naru: `${st}くなります`,
      ffHien: d, ffPhu: `${st}くない`, ffQua: `${st}かった`, ffQuaPhu: `${st}くなかった`,
      tara: `${st}かったら`, temo: `${st}くても`,
    };
  }
  return {
    hien: `${d}です`, phu: `${d}じゃありません`, qua: `${d}でした`, quaPhu: `${d}じゃありませんでした`,
    te: `${d}で`, bn: `${d}な N`, naru: `${d}になります`,
    ffHien: `${d}だ`, ffPhu: `${d}じゃない`, ffQua: `${d}だった`, ffQuaPhu: `${d}じゃなかった`,
    tara: `${d}だったら`, temo: `${d}でも`,
  };
}

/** Phần đuôi đổi của một dạng so với gốc chung — để tô màu (gốc thường, đuôi đậm). */
export function splitTail(form: string, base: string): [string, string] {
  let i = 0;
  while (i < form.length && i < base.length && form[i] === base[i]) i++;
  // Không cắt giữa một cụm furigana {…|…}.
  const open = form.lastIndexOf('{', i - 1);
  if (open >= 0 && form.indexOf('}', open) >= i) i = open;
  return [form.slice(0, i), form.slice(i)];
}

/* ── Romaji để đọc kèm (Hepburn đơn giản) ─────────────────────────────── */

const K2R: Record<string, string> = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo', しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo', ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo', びゃ: 'bya', びゅ: 'byu', びょ: 'byo', ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo', りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko', が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so', ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to', だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no', は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo', ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo', や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n',
};
export function toRomaji(markup: string): string {
  const k = reading(markup).replace(/[・\s]/g, '');
  let out = '';
  for (let i = 0; i < k.length; i++) {
    const two = k.slice(i, i + 2);
    if (K2R[two]) { out += K2R[two]; i++; continue; }
    const c = k[i];
    if (c === 'っ') { const nx = K2R[k.slice(i + 1, i + 3)] ?? K2R[k[i + 1]] ?? ''; out += nx.startsWith('ch') ? 't' : nx[0] ?? ''; continue; }
    if (c === 'ー') { out += out.slice(-1); continue; }
    out += K2R[c] ?? c;
  }
  return out;
}
