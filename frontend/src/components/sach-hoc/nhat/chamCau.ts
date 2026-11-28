/**
 * Chấm câu gõ + tiến độ của khối "Luyện câu 2 chiều" (LuyenCau.tsx) — tách riêng, không React,
 * để kiểm thử bằng `npm run dekiru:chamcau:test`.
 *
 * Chấm câu Việt→Nhật / nghe–chép: người học gõ bằng kana, chữ Hán, trộn cả hai, hoặc romaji.
 *  - Đáp án viết `{漢字|かな}` ⇒ so cách ĐỌC (kana) của đáp án với cách đọc của câu gõ.
 *  - Chữ Hán người học gõ được đổi ra kana bằng TỪ ĐIỂN dựng từ chính các câu của bài (mọi cặp {漢字|かな}
 *    trong bộ câu + vài chữ quen), nên 私は学生です / わたしはがくせいです / 私はがくせいです đều đúng.
 *  - Dấu câu, khoảng trắng, "——" của câu hỏi–đáp bị bỏ qua.
 *  - Katakana gõ thành hiragana / thiếu trường âm (がっこ ≠ がっこう) / sai đúng 1 chữ ⇒ "gần đúng" (không tính là đúng,
 *    nhưng nói rõ sai chỗ nào) — trừ khi gõ ROMAJI: romaji vốn không phân biệt được trường âm, katakana và は/わ.
 */
// @ts-expect-error — Node chạy thẳng tệp .ts (strip-types, cho luyenCau.test.ts) nên phải ghi đuôi .ts; tsc của Next không cho.
import { bare, reading, romajiToKana } from './chia.ts';

export type KetQua = { kq: 'dung' | 'gan' | 'sai'; ghi?: string };

const toHira = (t: string) => t.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
const KANJI_RUN = /[一-鿿㐀-䶿々0-9０-９]+/g;

/** Bỏ dấu câu / khoảng trắng / gạch nối hỏi–đáp; NFKC (số toàn khổ → số thường). GIỮ katakana, trường âm, số. */
export function gon(t: string): string {
  return t.normalize('NFKC').toLowerCase()
    .replace(/\*\*|==|~~/g, '')
    .replace(/[\s。、，,.．!！?？「」『』（）()［］[\]・…—–\-―~～:：;；"'“”‘’]/g, '');
}

/** Gộp trường âm + っ + katakana ⇒ dạng "lỏng" (chỉ để nhận ra lỗi nhỏ). */
function long(t: string): string {
  return toHira(t).replace(/ー/g, '').replace(/っ/g, '').replace(/[ぁぃぅぇぉ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 1))
    .replace(/([おこそとのほもよろごぞどぼぽょ])[うお]/g, '$1')
    .replace(/([うくすつぬふむゆるぐずづぶぷゅ])う/g, '$1')
    .replace(/([あかさたなはまやらわがざだばぱゃ])あ/g, '$1')
    .replace(/([いきしちにひみりぎじびぴ])い/g, '$1')
    .replace(/([えけせてねへめれげぜでべぺ])[えい]/g, '$1');
}
/** Romaji không phân biệt は/わ, へ/え, を/お (trợ từ) — áp lên CẢ HAI phía khi người học gõ romaji. */
const troTu = (t: string) => t.replace(/は/g, 'わ').replace(/へ/g, 'え').replace(/を/g, 'お');

/** Romaji → kana. Sửa "nn + nguyên âm" (konnichiwa) trước khi đổi. */
export function roSangKana(t: string): string {
  const nho: Record<string, string> = { a: 'ぁ', i: 'ぃ', e: 'ぇ', o: 'ぉ' };
  // fa/fi/fe/fo (インフォメーション, フィルム…) — bảng romaji gốc chỉ có fu.
  return romajiToKana(t.toLowerCase().replace(/nn(?=[aiueoy])/g, "n'n").replace(/f([aieo])/g, (_m, v: string) => 'ふ' + nho[v])
    // ti / di = てぃ / でぃ (パーティー, コメディー) — đúng cách romaji của bài viết (luyenCauDsl.R); chi / ji mới là ち / じ.
    .replace(/([td])i/g, (_m, c: string) => (c === 't' ? 'て' : 'で') + 'ぃ'));
}

/** Từ điển chữ Hán → cách đọc, dựng từ mọi cặp {漢字|かな} của bộ câu (+ `them`). */
export function tuDien(cauJa: string[], them: Record<string, string[]> = {}): Map<string, string[]> {
  const m = new Map<string, string[]>();
  const add = (k: string, r: string) => {
    const ks = k.normalize('NFKC');
    const l = m.get(ks) ?? [];
    if (!l.includes(r)) l.push(r);
    m.set(ks, l);
  };
  for (const ja of cauJa) for (const x of ja.matchAll(/\{([^|}]+)\|([^}]+)\}/g)) {
    add(x[1], x[2]);
    // Số chữ Hán {三百|さんびゃく} ⇒ người học gõ "300" cũng đọc ra さんびゃく.
    const so = soHan(x[1]);
    if (so !== null) add(String(so), x[2]);
  }
  for (const [k, rs] of Object.entries(them)) for (const r of rs) add(k, r);
  return m;
}

/** Số viết bằng chữ Hán (一〜九・十・百・千・万) → số; không phải số thì null. */
export function soHan(t: string): number | null {
  if (!/^[一二三四五六七八九十百千万]+$/.test(t)) return null;
  const D: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  const U: Record<string, number> = { 十: 10, 百: 100, 千: 1000 };
  let tong = 0, nhom = 0, so = 0;
  for (const ch of t) {
    if (D[ch]) so = D[ch];
    else if (U[ch]) { nhom += (so || 1) * U[ch]; so = 0; }
    else if (ch === '万') { tong += (nhom + so || 1) * 10000; nhom = 0; so = 0; }
  }
  return tong + nhom + so;
}

/** Chữ quen ngoài bộ câu (người học có thể gõ chữ Hán của IME cho từ mà đáp án viết kana). */
export const CHU_QUEN: Record<string, string[]> = {
  私: ['わたし'], 何: ['なん', 'なに'], 人: ['じん', 'ひと', 'にん'], 才: ['さい'], 歳: ['さい'], 名前: ['なまえ'], 学生: ['がくせい'],
  先生: ['せんせい'], 日本: ['にほん'], 日本語: ['にほんご'], 日本人: ['にほんじん'], 学校: ['がっこう'], 大学: ['だいがく'],
  会社員: ['かいしゃいん'], 会社: ['かいしゃ'], 国: ['くに'], 趣味: ['しゅみ'], 誕生日: ['たんじょうび'], 今: ['いま'],
  毎日: ['まいにち'], 時: ['じ'], 分: ['ふん', 'ぷん'], 半: ['はん'], 円: ['えん'], 本: ['ほん'], 水: ['みず'],
  行: ['い'], 来: ['き', 'く', 'こ'], 見: ['み'], 食: ['た'], 飲: ['の'], 買: ['か'], 読: ['よ'], 聞: ['き'], 書: ['か'],
  話: ['はな'], 帰: ['かえ'], 休: ['やす'], 友達: ['ともだち'], 家族: ['かぞく'], 部屋: ['へや'], 駅: ['えき'],
  電車: ['でんしゃ'], 車: ['くるま'], 山: ['やま'], 川: ['かわ'], 東京: ['とうきょう'], 町: ['まち'], 天気: ['てんき'],
  今日: ['きょう'], 明日: ['あした'], 昨日: ['きのう'], 週末: ['しゅうまつ'], 映画: ['えいが'], 音楽: ['おんがく'],
  料理: ['りょうり'], 旅行: ['りょこう'], 勉強: ['べんきょう'], 図書館: ['としょかん'], 朝: ['あさ'], 晩: ['ばん'],
  夜: ['よる'], 昼: ['ひる'], 午前: ['ごぜん'], 午後: ['ごご'], 上: ['うえ'], 下: ['した'], 中: ['なか'], 外: ['そと'],
  前: ['まえ'], 後: ['うし', 'あと', 'ご'], 右: ['みぎ'], 左: ['ひだり'], 大: ['おお'], 小: ['ちい'], 好: ['す'],
};

/** Mọi cách đọc có thể của câu gõ (thay từng cụm chữ Hán bằng cách đọc trong từ điển; tối đa 64 dạng). */
export function cachDoc(input: string, td: Map<string, string[]>): string[] {
  let acc = [''];
  let i = 0;
  const s = input.normalize('NFKC');
  for (const m of s.matchAll(KANJI_RUN)) {
    const run = m[0];
    const pre = s.slice(i, m.index);
    acc = acc.map((a) => a + pre);
    i = (m.index ?? 0) + run.length;
    // Số cũng tra từ điển: đáp án viết {19|じゅうきゅう}{才|さい} ⇒ "19さい" / "19才" đều đọc ra じゅうきゅうさい.
    acc = acc.flatMap((a) => docCum(run, td).map((r) => a + r)).slice(0, 64);
  }
  return acc.map((a) => a + s.slice(i));
}
/** Đọc một cụm chữ Hán liền nhau: khớp dài nhất trước; chữ không có trong từ điển giữ nguyên. */
function docCum(run: string, td: Map<string, string[]>): string[] {
  if (!run) return [''];
  for (let len = run.length; len >= 1; len--) {
    const head = run.slice(0, len);
    const rs = td.get(head);
    if (rs) {
      const tail = docCum(run.slice(len), td);
      return rs.flatMap((r) => tail.map((t) => r + t)).slice(0, 64);
    }
  }
  return docCum(run.slice(1), td).map((t) => run[0] + t);
}

/** Khoảng cách sửa (Levenshtein) — câu ngắn, làm thẳng. */
export function khoangCach(a: string, b: string): number {
  const A = [...a], B = [...b];
  let prev = Array.from({ length: B.length + 1 }, (_, j) => j);
  for (let i = 1; i <= A.length; i++) {
    const cur = [i];
    for (let j = 1; j <= B.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[B.length];
}

/** Cách đọc chuẩn (kana, đã gọn) của đáp án và các cách viết khác. */
export function dapAnDoc(ja: string, alt: string[] = []): string[] {
  return [...new Set([ja, ...alt].map((x) => gon(reading(x))))];
}

/**
 * Chấm một câu gõ. `td` = từ điển chữ Hán của bộ câu (tuDien). Trả 'dung' / 'gan' (kèm ghi chú) / 'sai'.
 */
export function chamCau(input: string, ja: string, alt: string[] = [], td: Map<string, string[]> = new Map()): KetQua {
  const raw = input.trim();
  if (!gon(raw)) return { kq: 'sai', ghi: 'Bạn chưa gõ gì.' };
  const laRomaji = /[a-z]/i.test(raw.normalize('NFKC')) && !/[぀-ヿ一-鿿]/.test(raw);
  const dich = laRomaji ? [gon(roSangKana(raw))] : cachDoc(raw, td).map(gon);
  const dap = dapAnDoc(ja, alt);
  // Gõ ĐÚNG chữ Hán / đúng nguyên văn một đáp án (không qua từ điển).
  const nguyen = [ja, ...alt].map((x) => gon(bare(x)));
  if (!laRomaji && nguyen.includes(gon(raw))) return { kq: 'dung' };
  if (dich.some((x) => dap.includes(x))) return { kq: 'dung' };
  if (laRomaji) {
    // Chữ Latin còn lại trong đáp án (ABC, DVD, Tシャツ) cũng đổi qua romaji → kana như câu gõ, rồi mới so lỏng.
    const lo = (t: string) => long(troTu(toHira(t).replace(/[a-z]+/g, (m) => roSangKana(m))));
    if (dich.some((x) => dap.some((d) => lo(x) === lo(d)))) return { kq: 'dung' };
  }
  // Gần đúng: chỉ khác katakana ↔ hiragana.
  if (!laRomaji && dich.some((x) => dap.some((d) => toHira(x) === toHira(d)))) {
    return { kq: 'gan', ghi: 'Gần đúng — từ ngoại lai phải viết bằng **katakana** (vd. テニス, không phải てにす).' };
  }
  // Gần đúng: thiếu/thừa trường âm hoặc っ.
  if (dich.some((x) => dap.some((d) => long(x) === long(d)))) {
    return { kq: 'gan', ghi: 'Gần đúng — để ý **trường âm** (おう・えい・ー) và **âm ngắt っ**: so lại từng chữ với đáp án.' };
  }
  // Gần đúng: sai đúng 1 chữ ở câu đủ dài (thường là trợ từ).
  let best = Infinity;
  for (const x of dich) for (const d of dap) best = Math.min(best, khoangCach(laRomaji ? troTu(x) : x, laRomaji ? troTu(d) : d));
  const dai = Math.min(...dap.map((d) => [...d].length));
  if (best === 1 && dai >= 5) return { kq: 'gan', ghi: 'Gần đúng — **sai một chữ** (hay gặp nhất: trợ từ は・が・を・に・で・へ・の・と・も). So lại với đáp án.' };
  return { kq: 'sai' };
}

/* ── Tiến độ ────────────────────────────────────────────────────────────── */

/** Khoá ổn định của một câu: băm nội dung tiếng Nhật (đổi thứ tự câu không mất tiến độ). */
export function khoaCau(ja: string): string {
  const t = gon(bare(ja));
  let h = 2166136261;
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}

/** [chuỗi đúng liên tiếp, số lần sai, ngày cuối (yyyymmdd)] */
export type TrangThai = [number, number, number];
export type Kho = { c: Record<string, TrangThai>; xp: number; ngay: number[]; homNay?: [number, number] };
export const KHO_RONG = (): Kho => ({ c: {}, xp: 0, ngay: [] });
export const DA_THUOC = 2;

export function ngaySo(d = new Date()): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** Ghi một lượt trả lời; trả kho mới. `diem` = XP cộng thêm khi đúng. */
export function ghiLuot(kho: Kho, khoa: string, dung: boolean, diem: number, hom = ngaySo()): Kho {
  const cu = kho.c[khoa] ?? [0, 0, 0];
  const moi: TrangThai = dung ? [cu[0] + 1, cu[1], hom] : [0, cu[1] + 1, hom];
  const ngay = kho.ngay.includes(hom) ? kho.ngay : [...kho.ngay, hom].slice(-90);
  const homNay: [number, number] = kho.homNay?.[0] === hom ? [hom, kho.homNay[1] + 1] : [hom, 1];
  return { c: { ...kho.c, [khoa]: moi }, xp: kho.xp + (dung ? diem : 1), ngay, homNay };
}

/** Chuỗi ngày học liên tiếp tính tới hôm nay (hôm nay chưa học thì tính tới hôm qua). */
export function chuoiNgay(ngay: number[], hom = new Date()): number {
  const co = new Set(ngay);
  const d = new Date(hom);
  if (!co.has(ngaySo(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (co.has(ngaySo(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
