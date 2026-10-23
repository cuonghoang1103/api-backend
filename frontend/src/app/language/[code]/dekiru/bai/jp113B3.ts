/**
 * JPD113 — BÀI 3 (スケジュール · Lịch trình) — khoá できる日本語 (`/language/ja/dekiru`).
 * Ba bộ nội dung trong một tệp:
 *   JP113_B3  8 lesson `s113-b3-NN-…` — "Buổi học theo khung lớp": giảng từng buổi bằng chữ, ngữ pháp, ví dụ + romaji,
 *             hội thoại, lỗi hay mắc, cách nhớ, "cô hay hỏi gì", bài tập có đáp án.
 *   LT_B3     13 lesson `lt-b3-…` — Luyện thêm Bài 3, mỗi lesson đi 🟢 Dễ → 🟡 Vừa → 🔴 Khó.
 *   ON_113     6 lesson `on113-…` — Ôn thi JPD113 (Bài 1–3): cấu trúc đề, ngữ pháp + từ vựng, đọc to, mẫu trả lời, đề luyện.
 *
 * TRUNG THỰC VỀ NGUỒN: người học KHÔNG có slide thật của cô JPD113. Phần "Buổi học theo khung lớp" do mình soạn theo
 * trình tự sách (できる日本語 初級 Bài 3, ポイント 16–23) + khung buổi học của JPD123 (cùng sách, cùng cô) — không phải
 * slide thật của cô JPD113 và không khẳng định "cô chiếu đúng thế". Cấu trúc đề thi lấy từ bản "Hướng dẫn ôn tập thi nói
 * môn JPD113" (09/06/2025) cô gửi. Mọi câu, hội thoại, bài đọc, kịch bản nghe đều VIẾT MỚI (không chép sách/CD/đề).
 *
 * Cách soạn: câu tiếng Nhật viết bằng "DSL từ" — các từ cách nhau bằng dấu cách, chữ Hán luôn {漢字|かな},
 * `^` đầu từ = viết hoa romaji (tên riêng), `-` trong từ = gạch nối romaji. `J()` bỏ dấu cách → chữ Nhật;
 * `R()` sinh romaji (は→wa, へ→e, を→o, ー kéo dài, っ gấp đôi) nên romaji LUÔN khớp đúng kana cạnh nó.
 * Chữ Hán của lớp Bài 3 (hanLop.ts): 時 分 月 火 水 木 金 土 曜 朝 晩.
 */
import type { Block, Ex, Lesson, Role, Voice } from '@/components/sach-hoc/types';

/* ══════════════ romaji tự động từ furigana ══════════════ */

const KS: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo', た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho', ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po', ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n',
};
const KS_SMALL: Record<string, string> = { ゃ: 'a', ゅ: 'u', ょ: 'o' };
const KS_FOREIGN: Record<string, string> = {
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', うぃ: 'wi', うぇ: 'we', うぉ: 'wo', てぃ: 'ti', でぃ: 'di',
  でゅ: 'dyu', ちぇ: 'che', しぇ: 'she', じぇ: 'je', つぁ: 'tsa', とぅ: 'tu', どぅ: 'du',
};
const WA_COMBO = new Set(['では', 'には', 'とは', 'へは', 'からは', 'までは', 'こんにちは', 'こんばんは']);

function kanaToRo(src: string): string {
  const s = src.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const cs = [...s];
  let out = '';
  let sokuon = false;
  const push = (r: string) => {
    if (sokuon) { out += /^ch/.test(r) ? 't' + r : r[0] + r; sokuon = false; } else out += r;
  };
  for (let i = 0; i < cs.length; i++) {
    const c = cs[i];
    const n = cs[i + 1];
    if (c === 'っ') { sokuon = true; continue; }
    if (c === 'ー') { const m = out.match(/[aiueo]$/); if (m) out += m[0]; continue; }
    if (n && KS_FOREIGN[c + n]) { push(KS_FOREIGN[c + n]); i++; continue; }
    if (c === 'ん') {
      const nx = cs[i + 1];
      push(nx && /[あいうえおやゆよ]/.test(nx) ? "n'" : 'n');
      continue;
    }
    if (KS[c] !== undefined && n && KS_SMALL[n]) {
      const base = KS[c];
      const y = KS_SMALL[n];
      push(/^(shi|chi|ji)$/.test(base) ? base.slice(0, -1) + y : base.slice(0, -1) + 'y' + y);
      i++;
      continue;
    }
    if (KS[c] !== undefined) { push(KS[c]); continue; }
    const PUN: Record<string, string> = { '。': '.', '、': ',', '？': '?', '！': '!', '…': '...', '「': '"', '」': '"', '〜': '~', '～': '~', '＿': '_' };
    if (PUN[c] !== undefined) { out += PUN[c]; continue; }
    if (/[ぁぃぅぇぉ]/.test(c)) continue;
    if (/[（）()・\s]/.test(c)) continue;
    out += c;
  }
  return out;
}
const reading = (t: string) => t.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2');

/** Một "từ" (token) của DSL → [chữ Nhật, romaji]. */
function tok(t: string): [string, string] {
  let cap = false;
  let x = t;
  if (x.startsWith('^')) { cap = true; x = x.slice(1); }
  const ja = x.replace(/-/g, '');
  const body = reading(x).replace(/[。、？！「」]+$/, '');
  const tail = reading(x).slice(body.length);
  let rom: string;
  if (body === 'は' || WA_COMBO.has(body)) rom = body === 'は' ? 'wa' : kanaToRo(body.slice(0, -1)) + 'wa';
  else if (body === 'へ') rom = 'e';
  else rom = body.split('-').map(kanaToRo).join('-');
  rom += kanaToRo(tail);
  if (cap) rom = rom.charAt(0).toUpperCase() + rom.slice(1);
  return [ja, rom];
}

const toks = (s: string) => s.trim().split(/\s+/).filter(Boolean);
/** Chữ Nhật (bỏ dấu cách của DSL). */
const J = (s: string): string => toks(s).map((t) => tok(t)[0]).join('');
/** Romaji (viết hoa đầu câu). */
const R = (s: string): string => {
  let out = '';
  let start = true;
  for (const t of toks(s)) {
    let r = tok(t)[1];
    if (start && r) { r = r.charAt(0).toUpperCase() + r.slice(1); start = false; }
    out += (out ? ' ' : '') + r;
    if (/[.?!]["]?$/.test(r)) start = true;
  }
  return out;
};
/** Các mảnh (chip) của câu DSL. */
const chipsOf = (s: string): string[] => toks(s).map((t) => tok(t)[0]);

/* ══════════════ dựng khối ══════════════ */

const E = (s: string, vi: string): Ex => ({ en: J(s), ro: R(s), vi });
type Who = 'f' | 'm';
const VOICE: Record<Who, Voice> = { f: 'ja-nu', m: 'ja-nam' };
const ROLE: Record<Who, Role> = { f: 'a', m: 'b' };
/** Dòng hội thoại. */
const D = (who: string, g: Who, s: string, vi: string) => ({ who, role: ROLE[g], text: J(s), ro: R(s), vi });
/** Dòng nghe. */
const L = (who: string, g: Who, s: string, vi: string) => ({ who, voice: VOICE[g], text: J(s), ro: R(s), vi });
const LS = (id: string, title: string, lines: ReturnType<typeof L>[], note?: string): Block => ({ t: 'listen', id, title, note, lines });
const DLG = (title: string, lines: ReturnType<typeof D>[]): Block => ({ t: 'dialogue', title, lines });
const RK = (s: string, vi: string) => ({ text: J(s), ro: R(s), vi });
/** Ghép câu: `s` = các từ cách nhau bằng dấu cách (mỗi từ = một mảnh); `extra` = mảnh gây nhiễu (DSL). */
const BD = (vi: string, s: string, extra: string[] = [], alt: string[] = []) => ({
  vi,
  chips: [...chipsOf(s), ...extra.flatMap(chipsOf)],
  answer: chipsOf(s),
  alt: alt.length ? alt.map(chipsOf) : undefined,
  ro: R(s),
});
const BUILD = (id: string, title: string, items: ReturnType<typeof BD>[]): Block => ({ t: 'build', id, title, items });
const READK = (id: string, title: string, note: string | undefined, items: ReturnType<typeof RK>[]): Block => ({ t: 'readkanji', id, title, note, items });

/** Đáp án gõ tay: viết một lần bằng {漢字|かな}; sinh đủ cách viết chữ Hán / kana. */
const V = (...xs: string[]): string[] => {
  const out = new Set<string>();
  for (const x of xs) {
    const slots = x
      .split(/(\{[^|}]+\|[^}]+\})/)
      .filter(Boolean)
      .map((p) => {
        const m = /^\{([^|}]+)\|([^}]+)\}$/.exec(p);
        return m ? [m[1], m[2]] : [p];
      });
    const n = slots.filter((s) => s.length > 1).length;
    if (n <= 8) {
      let acc = [''];
      for (const s of slots) acc = acc.flatMap((a) => s.map((c) => a + c));
      acc.forEach((a) => out.add(a));
    } else {
      out.add(slots.map((s) => s[0]).join(''));
      out.add(slots.map((s) => s[s.length - 1]).join(''));
      slots.forEach((s, i) => {
        if (s.length > 1) out.add(slots.map((t, j) => (j === i ? t[1] : t[0])).join(''));
      });
    }
  }
  return [...out];
};
/** Câu gõ: `ans` có thể là nhiều dạng (mỗi phần tử một cách đúng, viết bằng {漢字|かな}). */
const A = (q: string, ans: string | string[], hint?: string) => ({ q, answers: V(...(Array.isArray(ans) ? ans : [ans])), hint });
const QZ = (id: string, title: string, kind: 'fill' | 'translate', items: ReturnType<typeof A>[], grammar?: string): Block => ({ t: 'quiz', id, title, kind, grammar, items });

/**
 * Trắc nghiệm: `ok` = đáp án đúng; `bad` = các đáp án sai, viết trong MỘT chuỗi cách nhau " | ";
 * vị trí đáp án đúng xoay vòng theo số thứ tự câu (không dồn một chỗ).
 */
let MC_N = 0;
const Q = (q: string, ok: string, bad: string, why: string, at?: number) => {
  const b = bad.split(' | ');
  const pos = at ?? (MC_N++ * 5 + 1) % (b.length + 1);
  const options = [...b];
  options.splice(Math.min(pos, options.length), 0, ok);
  return { q, options, correct: Math.min(pos, b.length), why };
};
const MC = (id: string, title: string, items: ReturnType<typeof Q>[]): Block => ({ t: 'mcq', id, title, items });

const H = (text: string): Block => ({ t: 'h', text });
const P = (text: string): Block => ({ t: 'p', text });
const NOTE = (title: string, items: string[]): Block => ({ t: 'note', title, items });
const TABLE = (head: string[], rows: string[][], caption?: string): Block => ({ t: 'table', head, rows, caption });
const EXS = (items: Ex[]): Block => ({ t: 'examples', items });
const RECAP = (title: string, items: string[]): Block => ({ t: 'recap', title, items });
const PASSAGE = (title: string, paras: string[], intro?: string): Block => ({ t: 'passage', title, intro, paras: paras.map((p) => ({ text: J(p) })) });
const SPEAK = (id: string, questions: string[]): Block => ({ t: 'speak', id, part: '1', questions });
const WRITE = (id: string, title: string, chars: string[], note?: string, goi?: Record<string, string>): Block => ({ t: 'write', id, title, chars, note, goi });
const LV = {
  de: '🟢 MỨC DỄ',
  vua: '🟡 MỨC VỪA',
  kho: '🔴 MỨC KHÓ',
};

/** Phủ định lịch sự của tính từ い (stem = DSL bỏ い cuối) và tính từ な (stem = nguyên từ). */
const NI = (stem: string): string[] => [`${stem}くないです`, `${stem}くありません`];
const NN = (stem: string): string[] => [`${stem}じゃありません`, `${stem}ではありません`, `${stem}じゃないです`, `${stem}ではないです`];

/** Sắp lượt thoại: mỗi chip là MỘT lượt nói nguyên câu, `lines` theo đúng thứ tự hội thoại. */
const BDT = (vi: string, lines: string[]) => ({ vi, chips: lines.map(J), answer: lines.map(J), alt: undefined as string[][] | undefined, ro: lines.map(R).join(' ') });
/** Dòng hội thoại kiểu giám thị / thí sinh. */
const DX = (who: string, role: Role, s: string, vi: string) => ({ who, role, text: J(s), ro: R(s), vi });

/** Đoạn đọc: [câu DSL, nghĩa Việt][] → khối passage (có furigana) + khối examples (romaji + nghĩa). */
const PSG = (title: string, sents: [string, string][], intro?: string): Block[] => [
  { t: 'passage', title, intro, paras: [{ text: sents.map(([s]) => J(s)).join('') }] },
  { t: 'examples', items: sents.map(([s, vi]) => E(s, vi)) },
];
/** Cả đoạn thành MỘT mục readkanji (không furigana khi hiện). */
const RKP = (sents: [string, string][]) => RK(sents.map(([s]) => s).join(' '), sents.map(([, v]) => v).join(' '));
/** Câu đúng / sai — 3 lựa chọn. */
const TF = (stmt: string, ans: 'Đúng' | 'Sai' | 'Không có trong bài', why: string) =>
  Q(`Đúng hay sai? 「${stmt}」`, ans, ['Đúng', 'Sai', 'Không có trong bài'].filter((x) => x !== ans).join(' | '), why);

/* ══════════════ dụng cụ riêng của Bài 3 ══════════════ */

const KNUM = '〇一二三四五六七八九';
/** Số nguyên 1–99 → số kanji (45 → 四十五). */
const numKanji = (n: number): string =>
  n < 10 ? KNUM[n] : n < 20 ? '十' + (n % 10 ? KNUM[n % 10] : '') : n < 100 ? KNUM[Math.floor(n / 10)] + '十' + (n % 10 ? KNUM[n % 10] : '') : String(n);
const kn = (s: string): string => s.replace(/\d+/g, (m) => numKanji(Number(m)));
/**
 * Đáp án gõ có số: viết bằng CHỮ SỐ trong {..|..} (vd `{9時|くじ}`); tự thêm bản số kanji ({九時|くじ}).
 * (Máy chấm chỉ đổi số toàn khổ → bán khổ, không đổi 9 ↔ 九.)
 */
const AD = (q: string, ans: string | string[], hint?: string) => A(q, (Array.isArray(ans) ? ans : [ans]).flatMap((a) => [a, kn(a)]), hint);
/** Ô bảng: chữ Nhật (furigana) + (romaji) sinh tự động từ DSL. */
const JR = (s: string): string => `${J(s)} (${R(s)})`;

/** Khối mở đầu mỗi lesson. */
const HOW = (items: string[]) => NOTE('Học thế nào (cách học bài này)', items);
/** Nhắc nguồn — dùng trong các buổi "theo khung lớp". */
const NGUON = 'Bài này do mình soạn theo trình tự sách + khung buổi học JPD123, **không phải slide thật của cô JPD113**: nội dung ngữ pháp và từ vựng đúng sách và danh sách từ cô phát; thứ tự các mục chỉ là gợi ý học.';

const SH3 = ['Mục (theo trình tự sách)', 'Giải thích bằng chữ'];
const slides3 = (caption: string, rows: string[][]): Block => ({ t: 'table', caption, head: SH3, rows });
const ASK = (items: string[]): Block => ({ t: 'note', title: '🎤 Cô hay hỏi gì (theo đề mẫu thi nói JPD113 — Lesson 3)', items });

/** Bảng có cột cuối là câu tiếng Nhật viết bằng DSL (J() bỏ dấu cách, giữ furigana). */
const TABLEJ = (head: string[], rows: string[][], caption?: string): Block =>
  TABLE(head, rows.map((r) => [...r.slice(0, -1), r[r.length - 1] === '—' ? '—' : J(r[r.length - 1])]), caption);
/** Như TABLEJ nhưng câu tiếng Nhật (DSL) nằm ở CỘT THỨ HAI. */
const TABLEJ1 = (head: string[], rows: string[][], caption?: string): Block =>
  TABLE(head, rows.map((r) => [r[0], J(r[1]), ...r.slice(2)]), caption);

/* ═══════════════════════════════════════════════════════════════════
 *        PHẦN A — BUỔI HỌC THEO KHUNG LỚP (JP113_B3)
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────── Buổi 0 — Đọc trước ───────── */

const S_00: Lesson = {
  id: 's113-b3-00-doc-truoc-lo-trinh',
  kind: 'intro',
  title: 'Buổi 0 — Đọc trước: Bài 3 スケジュール học thế nào, gồm 7 buổi (theo khung lớp)',
  goal: 'Biết Bài 3 gồm những gì, 7 buổi theo thứ tự nào, ポイント 16–23 nằm ở buổi nào và thi nói JPD113 hỏi gì về Bài 3.',
  minutes: 15,
  blocks: [
    HOW([
      'Đây là lesson **mở đầu**: đọc 10 phút rồi học tuần tự Buổi 1 → Buổi 7. Mỗi buổi có phần giảng bằng chữ, ví dụ có romaji, hội thoại, lỗi hay mắc, bài tập có đáp án.',
      'Mỗi buổi đi theo nhịp: **đọc bảng giảng → xem ví dụ, nói to → làm bài tập → xem 🎤 cô hay hỏi gì**. Bài tập nào sai thì đọc phần giải thích rồi làm lại đúng câu đó.',
      'Học xong cả 7 buổi mới sang `lt-b3-…` (Luyện thêm Dễ → Vừa → Khó) và `on113-…` (Ôn thi JPD113 Bài 1–3).',
    ]),
    NOTE('Nguồn của bài này — đọc kỹ để khỏi hiểu nhầm', [
      '**Bài này do mình soạn theo trình tự sách + khung buổi học JPD123, không phải slide thật của cô.** Lớp JPD113 của cô có thể chia buổi và chiếu slide khác.',
      'Thứ **đúng chắc**: ngữ pháp (ポイント 16–23), danh sách 80 từ mới của cô (file "Từ mới bài 3"), chữ Hán Bài 3 của lớp (`hanLop.ts`) và cấu trúc đề thi nói (file "Hướng dẫn ôn tập thi nói môn JPD113", 09/06/2025).',
      'Thứ **chỉ là gợi ý**: chia ra 7 buổi và thứ tự các mục trong buổi. Khung này mượn từ cách cô dạy JPD123 (cùng sách Dekiru Nihongo, mỗi buổi 135 phút) — khi có slide thật của cô JPD113, hãy so lại.',
      'Mọi câu ví dụ, hội thoại, bài tập là **viết mới**, không chép sách hay đề.',
    ]),
    RECAP('Bài 3 trong một phút', [
      'Chủ đề: **スケジュール** (lịch trình). Ba tình huống: ① hỏi **giờ mở cửa** và ngày nghỉ (何時までですか) ② hỏi–nói **lịch cả năm** và kế hoạch nghỉ (私のスケジュール) ③ kể **một ngày** của mình (どんな毎日？).',
      'Đây là bài **động từ đầu tiên**: Vます／Vません, và 6 trợ từ **へ・を・に・で・から〜まで・や〜など**, cộng câu phủ định **何も／どこへも**.',
      'Phải đọc được **giờ, phút, thứ, tháng, ngày** — câu nào của Bài 3 cũng có một trong năm thứ đó. Đọc sai giờ là mất điểm ngay (4 giờ = よじ, 9 giờ = くじ).',
      'Thi nói JPD113 **chắc chắn có câu hỏi Lesson 3**: "〜は何時から何時までですか", "毎朝何時に食べますか", "休みの日、何をしますか"…',
    ]),
    { t: 'h', text: 'Bảy buổi của Bài 3' },
    TABLE(
      ['Buổi', 'Nội dung', 'ポイント / mục', 'Lesson'],
      [
        ['1', 'Đọc giờ, phút, 午前／午後, hỏi giờ mở cửa **何時から何時まで**', 'Chuẩn bị ① · ポイント 21 (giờ)', '`s113-b3-01-…`'],
        ['2', 'Thứ, tháng, ngày; lịch cả năm của trường **いつからいつまで**', 'Chuẩn bị ② · ポイント 21 (ngày)', '`s113-b3-02-…`'],
        ['3', 'Động từ **Vます／Vません** và 14 động từ; **へ** (đi đâu), **を** (làm gì)', 'ポイント 16, 17, 18', '`s113-b3-03-…`'],
        ['4', '**に** chỉ mốc giờ; **で** chỉ nơi làm; kể một ngày', 'ポイント 19, 20', '`s113-b3-04-…`'],
        ['5', '**や〜など** (liệt kê); **何も／どこへも** + ません', 'ポイント 22, 23', '`s113-b3-05-…`'],
        ['6', 'Chữ Hán của lớp: 時 分 月 火 水 木 金 土 曜 朝 晩; gom 80 từ theo nhóm', 'Chữ Hán · từ vựng', '`s113-b3-06-…`'],
        ['7', 'Ôn Bài 3 và **thi nói Lesson 3**: 10 dạng câu hỏi', 'Tổng ôn', '`s113-b3-07-…`'],
      ],
      'Lộ trình 7 buổi',
    ),
    { t: 'h', text: 'Tám ポイント trên một trang' },
    TABLE(
      ['PT', 'Công thức', 'Ví dụ + romaji'],
      [
        ['16', 'N は V ます／ません', JR('{私|わたし} は {毎朝|まいあさ} {新聞|しんぶん} を {読|よ}みます。')],
        ['17', 'N（nơi）へ いきます／きます／かえります', JR('{夏休|なつやす}み、 {国|くに} へ {帰|かえ}ります。')],
        ['18', 'N を V ます', JR('{朝|あさ}、 コーヒー を {飲|の}みます。')],
        ['19', 'N（giờ・ngày）に V ます', JR('{七時|しちじ} に {起|お}きます。')],
        ['20', 'N（nơi）で V ます', JR('{図書館|としょかん} で {勉強|べんきょう}します。')],
        ['21', '〜 から 〜 まで', JR('{九時|くじ} から {三時|さんじ} まで です。')],
        ['22', 'N1 や N2 など', JR('パン や {果物|くだもの} など を {食|た}べます。')],
        ['23', '何も／どこへも V ません', JR('{朝|あさ}、 {何|なに}も {食|た}べません。')],
      ],
    ),
    MC('s113-b3-00-kt', 'Kiểm tra nhanh trước khi học (6 câu)', [
      Q('Bài 3 của Dekiru Nihongo có tên là gì?', 'スケジュール (Lịch trình)', 'しゅみ (Sở thích) | かいもの (Mua sắm) | わたしのくに (Quê tôi)', 'Bài 3 = スケジュール; Bài 1 là giới thiệu bản thân, Bài 2 mua sắm.'),
      Q('Bài 3 có bao nhiêu ポイント ngữ pháp?', '8 (từ 16 đến 23)', '6 (từ 1 đến 6) | 9 (từ 7 đến 15) | 13 (từ 24 đến 36)', 'Bài 1: PT 1–6, Bài 2: PT 7–15, Bài 3: PT 16–23.'),
      Q('Cách đọc giờ nào đúng?', '{四時|よじ}', '{四時|よんじ} | {四時|しじ} | {四時|よっじ}', '4 giờ = よじ (không phải よんじ).'),
      Q('「{何時|なんじ}から{何時|なんじ}までですか」 dùng để hỏi gì?', 'Giờ mở cửa từ mấy giờ đến mấy giờ', 'Hôm nay là thứ mấy | Giá bao nhiêu tiền | Ở tầng mấy', 'から = từ, まで = đến; 何時 = mấy giờ.'),
      Q('Bài này (do mình soạn) có phải slide thật của cô JPD113 không?', 'Không — soạn theo trình tự sách và khung JPD123', 'Có — chép nguyên từ slide của cô | Có — nhưng đã đổi tên | Là đề thi thật', 'Đã ghi rõ ở đầu bài: không phải slide thật của cô.'),
      Q('Thi nói JPD113 (bản 06/2025) chấm bao nhiêu điểm phần Reading?', '40 điểm', '30 điểm | 45 điểm | 60 điểm', 'READING 40 · TALKING 55 · PRESENTING 5 (xem `on113-cau-truc`).'),
    ]),
  ],
};

/* ───────── Buổi 1 — Giờ & hỏi giờ mở cửa ───────── */

const S_01: Lesson = {
  id: 's113-b3-01-doc-gio-hoi-gio-mo-cua',
  kind: 'grammar',
  title: 'Buổi 1 — Đọc giờ, phút và hỏi giờ mở cửa 何時から何時まで (theo khung lớp)',
  goal: 'Đọc đúng giờ và phút (kể cả các số bất quy tắc), nói được 午前／午後, hỏi và trả lời "mở từ mấy giờ đến mấy giờ" bằng 〜から〜まで.',
  minutes: 40,
  blocks: [
    HOW([
      NGUON,
      'Thứ tự học: **bảng giờ → bảng phút → 午前／午後 → mẫu から〜まで → hội thoại → bài tập**. Mỗi bảng đọc to hai lượt, lượt hai che cột romaji.',
      'Bẫy lớn nhất buổi này là **ba giờ bất quy tắc (4・7・9)** và **ぷん／ふん**. Làm hết bài tập đọc giờ rồi mới sang phần hội thoại.',
    ]),
    RECAP('Buổi 1 học gì?', [
      'Đọc **giờ**: ichiji… nhưng **よじ** (4), **しちじ** (7), **くじ** (9). Đọc **phút**: có số đọc **ふん**, có số đọc **ぷん** (っぷん).',
      '**午前** (sáng, trước 12 giờ trưa) và **午後** (chiều–tối) đứng **trước** giờ. **半** = rưỡi (30 phút).',
      'Mẫu hỏi: **〜は 何時から 何時までですか** → trả lời **〜から 〜までです**. Dùng khi gọi điện hỏi thư viện, ngân hàng, bưu điện, bệnh viện, nhà thi đấu.',
      'Từ mới của buổi: 今・午前・午後・昼・時間・〜時・〜分・〜時半・銀行・体育館・図書館・病院・郵便局.',
    ]),
    { t: 'h', text: 'Từng mục của buổi 1 — kèm giải thích' },
    slides3('Các mục học (theo trình tự sách)', [
      ['**Mục tiêu Bài 3 (できる)**: hỏi giờ mở cửa · nói kế hoạch · kể một ngày', 'Đầu bài sách ghi ba việc làm được. Buổi 1 làm việc thứ nhất: **hỏi giờ mở cửa và ngày nghỉ** của một nơi công cộng. Hai việc còn lại ở Buổi 2 và Buổi 4.'],
      ['Từ mới nhóm "何時までですか": **今・午前・午後・昼・銀行・体育館・図書館・病院・郵便局・授業・テスト・休み・時間**', 'Nhóm này toàn là **nơi** và **mốc thời gian**. Đọc to một lượt: *ima · gozen · gogo · hiru · ginkō · taiikukan · toshokan · byōin · yūbinkyoku · jugyō · tesuto · yasumi · jikan.* 体育館 dài nhất — chia 4 khúc: tai-i-ku-kan.'],
      ['Bảng **～時**: 1 giờ → 12 giờ, **何時** (mấy giờ?)', 'Chỉ **ba số bất quy tắc**: 4 giờ = **よ**じ, 7 giờ = **しち**じ, 9 giờ = **く**じ. Còn lại đọc số bình thường + じ. 12 giờ = じゅうにじ.'],
      ['Bảng **～分**: 1 phút → 10 phút, 15, 20, 30, 40, 45, **何分**', 'Phút đọc **ふん** hoặc **ぷん** tuỳ số cuối: 1・3・4・6・8・10 → **ぷん** (っぷん), 2・5・7・9 → **ふん**. 8 phút có hai cách (はっぷん／はちふん), thi nên dùng **はっぷん**.'],
      ['**半** (rưỡi) và **午前／午後**', '**七時半** = 7 giờ rưỡi (không nói 七時三十分 trong hội thoại thường). 午前／午後 đứng trước giờ: *gozen kuji* = 9 giờ sáng, *gogo sanji* = 3 giờ chiều.'],
      ['Mẫu **今、何時ですか**', 'Hỏi giờ hiện tại. Trả lời trọn câu: **今、九時十五分です。** Giám thị thi nói rất hay chỉ vào đồng hồ trên tranh rồi hỏi câu này.'],
      ['Hội thoại gọi điện: **そちらは何時から何時までですか**', '**そちら** = "phía bên đó" (cách nói lịch sự khi gọi điện). Nghe xong con số thì **nhắc lại để xác nhận** ("午後十時までですか") — rất tự nhiên.'],
      ['Mẫu **〜から 〜まで**', '**から** = từ (điểm đầu), **まで** = đến (điểm cuối). Luôn đi cặp *kara … made*. Dùng cho giờ ở buổi này, cho thứ và ngày ở Buổi 2.'],
      ['Hỏi **休みは何曜日ですか**', 'Hỏi ngày nghỉ của nơi đó. Học đầy đủ tên các thứ ở Buổi 2; buổi này chỉ cần nhận ra từ hỏi **何曜日** (thứ mấy).'],
    ]),
    { t: 'h', text: 'Bảng giờ — ba chỗ bất quy tắc' },
    TABLE(
      ['Giờ', 'Đọc', 'Giờ', 'Đọc'],
      [
        ['{一時|いちじ}', JR('いちじ'), '{七時|しちじ}', JR('しちじ') + ' ⚠'],
        ['{二時|にじ}', JR('にじ'), '{八時|はちじ}', JR('はちじ')],
        ['{三時|さんじ}', JR('さんじ'), '{九時|くじ}', JR('くじ') + ' ⚠'],
        ['{四時|よじ}', JR('よじ') + ' ⚠', '{十時|じゅうじ}', JR('じゅうじ')],
        ['{五時|ごじ}', JR('ごじ'), '{十一時|じゅういちじ}', JR('じゅういちじ')],
        ['{六時|ろくじ}', JR('ろくじ'), '{十二時|じゅうにじ}', JR('じゅうにじ')],
      ],
      '～時 (giờ) — ⚠ là chỗ bất quy tắc',
    ),
    TABLE(
      ['Phút', 'Đọc', 'Phút', 'Đọc'],
      [
        ['{一分|いっぷん}', JR('いっぷん'), '{七分|ななふん}', JR('ななふん')],
        ['{二分|にふん}', JR('にふん'), '{八分|はっぷん}', JR('はっぷん')],
        ['{三分|さんぷん}', JR('さんぷん'), '{九分|きゅうふん}', JR('きゅうふん')],
        ['{四分|よんぷん}', JR('よんぷん'), '{十分|じゅっぷん}', JR('じゅっぷん')],
        ['{五分|ごふん}', JR('ごふん'), '{十五分|じゅうごふん}', JR('じゅうごふん')],
        ['{六分|ろっぷん}', JR('ろっぷん'), '{三十分|さんじゅっぷん}', JR('さんじゅっぷん') + ' = ' + J('{半|はん}')],
      ],
      '～分 (phút) — ぷん／ふん',
    ),
    { t: 'h', text: 'Ngữ pháp buổi 1 — công thức và ví dụ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: '［午前／午後］ ～時 ～分 です。',
          vi: 'Nói giờ. Hỏi: 今、何時ですか。',
          examples: [
            E('{今|いま}、 {四時|よじ} {五分|ごふん} です。', 'Bây giờ là 4 giờ 5 phút.'),
            E('{午前|ごぜん} {八時|はちじ} {四十五分|よんじゅうごふん} です。', '8 giờ 45 sáng.'),
            E('{午後|ごご} {七時半|しちじはん} です。', '7 giờ rưỡi chiều (tối).'),
          ],
        },
        {
          formula: 'N は ［時］ から ［時］ まで です。 ／ N は 何時 から 何時 まで です か。',
          vi: 'N mở (làm việc) từ … đến …; hỏi giờ mở cửa.',
          examples: [
            E('{図書館|としょかん} は {九時|くじ} から {七時|しちじ} まで です。', 'Thư viện mở từ 9 giờ đến 7 giờ.'),
            E('{銀行|ぎんこう} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Ngân hàng làm việc từ mấy giờ đến mấy giờ?'),
            E('{体育館|たいいくかん} は {午前|ごぜん} {七時|しちじ} から {午後|ごご} {十時|じゅうじ} まで です。', 'Nhà thi đấu mở từ 7 giờ sáng đến 10 giờ tối.'),
          ],
        },
      ],
    },
    DLG('Hội thoại 1 — Gọi điện hỏi giờ bệnh viện', [
      D('リン', 'f', 'もしもし、 すみません。 そちら は {何時|なんじ} から {何時|なんじ} まで です か。', 'Alô, xin lỗi. Bên anh mở từ mấy giờ đến mấy giờ ạ?'),
      D('{受付|うけつけ}', 'm', '{病院|びょういん} は {午前|ごぜん} {九時|くじ} から {午後|ごご} {四時|よじ} まで です。', 'Bệnh viện từ 9 giờ sáng đến 4 giờ chiều.'),
      D('リン', 'f', '{午後|ごご} {四時|よじ} まで です か。 {休|やす}み は いつ です か。', 'Đến 4 giờ chiều ạ. Khi nào nghỉ ạ?'),
      D('{受付|うけつけ}', 'm', '{日曜日|にちようび} です。', 'Chủ nhật.'),
      D('リン', 'f', 'ありがとう ございます。', 'Cảm ơn anh.'),
    ]),
    DLG('Hội thoại 2 — Hỏi giờ bạn cùng lớp', [
      D('パク', 'f', 'すみません。 {今|いま}、 {何時|なんじ} です か。', 'Xin lỗi, bây giờ mấy giờ ạ?'),
      D('ダニエル', 'm', '{十二時|じゅうにじ} {十分|じゅっぷん} です。', '12 giờ 10 phút.'),
      D('パク', 'f', '{昼|ひる} {休|やす}み は {何時|なんじ} まで です か。', 'Nghỉ trưa đến mấy giờ?'),
      D('ダニエル', 'm', '{一時|いちじ} まで です。', 'Đến 1 giờ.'),
    ]),
    NOTE('Lỗi hay mắc — "sai" ở buổi 1 (mất điểm khi nói)', [
      '~~よんじ~~, ~~きゅうじ~~ → **よじ**, **くじ**. 4 phút lại là **よんぷん**, 9 phút là **きゅうふん** (khác với giờ!).',
      '~~じゅうぷん~~, ~~ろくぷん~~ → **じゅっぷん**, **ろっぷん**. 10 và 6 phút phải có **っ**.',
      'Quên **午前／午後** hoặc đặt sau giờ (~~九時午前~~). Đúng: **午前九時**.',
      'Nói ~~七時から九時でです~~, ~~から…までに~~: sau まで **không** có に; câu kết thúc bằng **です** (một lần).',
      'Giám thị hỏi 今、何時ですか mà trả lời cụt "九時". Nên nói trọn câu: **今、九時です。**',
    ]),
    NOTE('Cách nhớ', [
      '**Ba giờ khác thường**: nhớ câu "**よ・しち・く**" (4 – 7 – 9). Nói to 5 lần trước khi đi thi.',
      '**Phút có っぷん**: 1・3・6・8・10 và 20・30・40… (số tròn chục) — nhớ nhóm "いっ・さん・ろっ・はっ・じゅっ". 4 phút là よんぷん (không có っ).',
      '**から** = điểm đầu (nhìn chữ か như "ka" = ở đầu: *kara* = từ), **まで** = điểm cuối: *made* — đọc "kara … made" như một cặp.',
    ]),
    QZ('s113-b3-01-doc', 'Viết cách đọc bằng hiragana (buổi 1)', 'fill', [
      A('4:05 → đọc là gì?', 'よじごふん'),
      A('7:30 → đọc là gì?', 'しちじはん'),
      A('9:10 → đọc là gì?', 'くじじゅっぷん'),
      A('10:06 → đọc là gì?', 'じゅうじろっぷん'),
      A('午後3:45 → đọc là gì?', 'ごごさんじよんじゅうごふん'),
      A('午前8:08 → đọc là gì?', ['ごぜんはちじはっぷん', 'ごぜんはちじはちふん']),
    ]),
    MC('s113-b3-01-mcq', 'Chọn đáp án (buổi 1)', [
      Q('「{図書館|としょかん}は {九時|くじ}（　）{七時|しちじ}までです。」', 'から', 'まで | に | を', '"Từ 9 giờ" = 九時**から**.'),
      Q('「{銀行|ぎんこう}は {三時|さんじ}（　）です。」 (đến 3 giờ)', 'まで', 'から | で | へ', '"Đến 3 giờ" = 三時**まで**.'),
      Q('7 giờ rưỡi nói là…', '{七時半|しちじはん}', '{七時|ななじ}はん | {七時三|しちじさん}ふん | {七半|しちはん}', '七時 = しちじ, 半 = はん → しちじはん.'),
      Q('「{午後|ごご}」 nghĩa là…', 'Buổi chiều (sau 12 giờ trưa)', 'Buổi sáng | Buổi trưa | Nửa đêm', '午前 = sáng; 午後 = chiều.'),
      Q('「{十分|じゅっぷん}」 đúng hay sai nếu đọc là じゅうふん?', 'Sai — phải đọc じゅっぷん', 'Đúng | Đúng khi nói nhanh | Chỉ đúng với 10 giờ', '10 phút = じゅっぷん (っぷん).'),
      Q('Nhà thi đấu = …', '{体育館|たいいくかん}', '{図書館|としょかん} | {郵便局|ゆうびんきょく} | {病院|びょういん}', '体育館 = たいいくかん. 図書館 = thư viện; 郵便局 = bưu điện; 病院 = bệnh viện.'),
    ]),
    ASK([
      '「{今|いま}、{何時|なんじ}ですか。」 — Cô chỉ đồng hồ hoặc tranh: nhớ ba giờ bất quy tắc và nói **trọn câu**.',
      '「{図書館|としょかん}は{何時|なんじ}から{何時|なんじ}までですか。」 — mẫu số 1 của Lesson 3 trong đề mẫu JPD113.',
      '「{昼休|ひるやす}みは{何時|なんじ}から{何時|なんじ}までですか。」 — bạn trả lời theo trường mình, ví dụ **十二時から一時までです**.',
    ]),
  ],
};

/* ───────── Buổi 2 — Thứ · tháng · ngày · lịch cả năm ───────── */

const S_02: Lesson = {
  id: 's113-b3-02-thu-thang-ngay-lich-nam',
  kind: 'grammar',
  title: 'Buổi 2 — Thứ, tháng, ngày và lịch cả năm của trường いつからいつまで (theo khung lớp)',
  goal: 'Đọc đúng thứ trong tuần, tháng và ngày (kể cả ngày bất quy tắc), hỏi–đáp về lịch trường/ngày nghỉ bằng いつ・何曜日・何月何日 và 〜から〜まで.',
  minutes: 45,
  blocks: [
    HOW([
      NGUON,
      'Buổi này học **thuộc lòng** khá nhiều: 7 thứ, 3 tháng bất quy tắc (4・7・9), 15 ngày bất quy tắc. Chia nhỏ: mỗi lượt học một bảng, nói to, che cột đọc rồi tự kiểm.',
      'Làm bài tập đọc ngày **bằng miệng trước**, gõ sau. Ngày tháng là dạng câu hỏi thi nói rất hay gặp (tranh lịch + "テストはいつですか").',
    ]),
    RECAP('Buổi 2 học gì?', [
      '**Thứ**: 月 火 水 木 金 土 日 + 曜日 (げつ・か・すい・もく・きん・ど・にち + ようび). Hỏi: **何曜日**.',
      '**Tháng**: số + がつ; bất quy tắc **4 = し, 7 = しち, 9 = く**. Hỏi: **何月**. **Ngày**: 1–10, 14, 20, 24 đọc riêng; còn lại số + にち. Hỏi: **何日**.',
      'Thứ tự khi nói ngày: **tháng trước, ngày sau** (五月二十日). Hỏi cả hai: **何月何日**; hỏi chung: **いつ**.',
      'Mẫu **いつから いつまで** cho kỳ nghỉ; từ mới: スケジュール・アルバイト・スキー・パーティー・バーベキュー・花火・お花見・ホームステイ・お祭り・海・公園・桜・お酒・おすし・バス・お弁当・留学生・一年・春夏秋冬・ゴールデンウイーク.',
    ]),
    { t: 'h', text: 'Từng mục của buổi 2 — kèm giải thích' },
    slides3('Các mục học (theo trình tự sách)', [
      ['Từ mới nhóm "私のスケジュール"', 'Nhóm sự kiện: *sukejūru* lịch · *arubaito* làm thêm · *sukī* trượt tuyết · *pātī* tiệc · *bābekyū* BBQ · *hanabi* pháo hoa · *ohanami* ngắm hoa · *hōmusutei* homestay · *omatsuri* lễ hội. Nơi/vật: *umi* biển · *kōen* công viên · *sakura* hoa anh đào · *osake* rượu · *osushi* sushi · *basu* xe buýt · *obentō* cơm hộp · *ryūgakusei* du học sinh · *ichinen* một năm.'],
      ['Bốn mùa **春・夏・秋・冬** + **ゴールデンウイーク**', '*haru · natsu · aki · fuyu*. Ghép với 休み: *haruyasumi, natsuyasumi, akiyasumi, fuyuyasumi* = nghỉ xuân/hè/thu/đông. **ゴールデンウイーク** (Tuần lễ Vàng) là chuỗi ngày nghỉ cuối tháng 4 – đầu tháng 5 ở Nhật.'],
      ['**カレンダー**: bảng 7 thứ', 'Mỗi thứ mang tên một "hành": 月 trăng · 火 lửa · 水 nước · 木 cây · 金 kim loại · 土 đất · 日 mặt trời. Đây cũng chính là 7 chữ Hán lớp cần nhận mặt (Buổi 6).'],
      ['Bảng **tháng**: 一月 → 十二月, **何月**', 'Quy tắc: số + がつ. Ba chỗ cần nhớ: **四月 = しがつ**, **七月 = しちがつ**, **九月 = くがつ** (giống 4・7・9 giờ).'],
      ['Bảng **ngày**: 1 → 31, **何日**', 'Ngày 1–10 là dãy đọc cổ: *tsuitachi, futsuka, mikka, yokka, itsuka, muika, nanoka, yōka, kokonoka, tōka*. Thêm **14 = jūyokka, 20 = hatsuka, 24 = nijūyokka**. Còn lại số + *nichi*.'],
      ['Câu **N は ［ngày］ です** (sự kiện bằng danh từ)', 'Ví dụ *Ohanami wa shigatsu nanoka desu* = Buổi ngắm hoa là ngày 7 tháng 4. Sự kiện **không cần động từ**: chỉ cần danh từ + です.'],
      ['Hỏi **いつ／何月何日／何曜日**', '*Itsu* hỏi chung (bao giờ). *Nangatsu nannichi* hỏi tháng và ngày. *Nan\'yōbi* hỏi thứ. Cả ba trả lời được cùng một câu: nói ngày hoặc nói thứ tuỳ câu hỏi.'],
      ['Bảng **lịch cả năm** (thầy giới thiệu) + hội thoại', 'Nhìn bảng lịch, hỏi **「〜はいつですか」**, **「どこへ行きますか」**, **「何をしますか」**. Nghỉ dài hỏi: **「夏休みはいつからいつまでですか」**.'],
      ['Nói về kế hoạch nghỉ: **夏休み、国へ帰りますか。**', 'Mở đầu bằng thời điểm rồi hỏi Có/Không. Trả lời trọn: **はい、帰ります／いいえ、帰りません**. (Động từ học kỹ ở Buổi 3.)'],
    ]),
    { t: 'h', text: 'Ba bảng cần thuộc' },
    TABLE(
      ['Thứ', 'Đọc', 'Tháng', 'Đọc'],
      [
        ['{月曜日|げつようび}', JR('げつようび'), '{一月|いちがつ} / {二月|にがつ} / {三月|さんがつ}', 'ichigatsu / nigatsu / sangatsu'],
        ['{火曜日|かようび}', JR('かようび'), '{四月|しがつ} ⚠', 'shigatsu'],
        ['{水曜日|すいようび}', JR('すいようび'), '{五月|ごがつ} / {六月|ろくがつ}', 'gogatsu / rokugatsu'],
        ['{木曜日|もくようび}', JR('もくようび'), '{七月|しちがつ} ⚠', 'shichigatsu'],
        ['{金曜日|きんようび}', JR('きんようび'), '{八月|はちがつ}', 'hachigatsu'],
        ['{土曜日|どようび}', JR('どようび'), '{九月|くがつ} ⚠', 'kugatsu'],
        ['{日曜日|にちようび}', JR('にちようび'), '{十月|じゅうがつ} / {十一月|じゅういちがつ} / {十二月|じゅうにがつ}', 'jūgatsu / jūichigatsu / jūnigatsu'],
      ],
      'Thứ và tháng (⚠ = bất quy tắc)',
    ),
    TABLE(
      ['Ngày', 'Đọc', 'Ngày', 'Đọc'],
      [
        ['{一日|ついたち}', 'tsuitachi', '{九日|ここのか}', 'kokonoka'],
        ['{二日|ふつか}', 'futsuka', '{十日|とおか}', 'tōka'],
        ['{三日|みっか}', 'mikka', '{十四日|じゅうよっか}', 'jūyokka'],
        ['{四日|よっか}', 'yokka', '{二十日|はつか}', 'hatsuka'],
        ['{五日|いつか}', 'itsuka', '{二十四日|にじゅうよっか}', 'nijūyokka'],
        ['{六日|むいか}', 'muika', '{十七日|じゅうしちにち} / {十九日|じゅうくにち}', 'jūshichinichi / jūkunichi'],
        ['{七日|なのか}', 'nanoka', '{三十日|さんじゅうにち} / {三十一日|さんじゅういちにち}', 'sanjūnichi / sanjūichinichi'],
        ['{八日|ようか}', 'yōka', '{何日|なんにち}', 'nannichi (ngày mấy?)'],
      ],
      'Ngày trong tháng — phải học thuộc',
    ),
    TABLE(
      ['Ngày', 'Sự kiện (ví dụ mới)', 'Làm gì'],
      [
        [J('{四月|しがつ} {七日|なのか}'), 'お{花見|はなみ}', J('{公園|こうえん} で {桜|さくら} を {見|み}ます。')],
        [J('{五月|ごがつ} {二日|ふつか}') + '〜' + J('{六日|むいか}'), 'ゴールデンウイーク', J('{海|うみ} へ {行|い}きます。')],
        [J('{六月|ろくがつ} {十日|とおか}'), 'バーベキュー', J('{公園|こうえん} で します。')],
        [J('{七月|しちがつ} {二十日|はつか}') + '〜' + J('{八月|はちがつ} {三十一日|さんじゅういちにち}'), '{夏休|なつやす}み', '—'],
        [J('{九月|くがつ} {十四日|じゅうよっか}'), 'テスト', '—'],
        [J('{十二月|じゅうにがつ} {二十四日|にじゅうよっか}'), 'パーティー', J('おすし を {食|た}べます。')],
      ],
      'Bảng lịch ví dụ (viết mới) — dùng cho hội thoại bên dưới',
    ),
    { t: 'h', text: 'Ngữ pháp buổi 2 — công thức và ví dụ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は ［月］［日］ です。 ／ N は いつ です か。',
          vi: 'Sự kiện N diễn ra vào ngày … ; hỏi bao giờ. Tháng nói TRƯỚC, ngày SAU.',
          examples: [
            E('お{花見|はなみ} は {四月|しがつ} {七日|なのか} です。', 'Buổi ngắm hoa vào ngày 7 tháng 4.'),
            E('テスト は いつ です か。', 'Bài kiểm tra bao giờ?'),
            E('{九月|くがつ} {十四日|じゅうよっか} です。', 'Ngày 14 tháng 9.'),
            E('パーティー は {何月|なんがつ} {何日|なんにち} です か。', 'Bữa tiệc là ngày mấy tháng mấy?'),
          ],
        },
        {
          formula: 'N は いつ から いつ まで です か。 —— ～ から ～ まで です。',
          vi: 'Kỳ nghỉ/sự kiện kéo dài từ bao giờ đến bao giờ.',
          examples: [
            E('{夏休|なつやす}み は いつ から いつ まで です か。', 'Nghỉ hè từ bao giờ đến bao giờ?'),
            E('{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。', 'Từ 20 tháng 7 đến 31 tháng 8.'),
            E('{銀行|ぎんこう} は {月曜日|げつようび} から {金曜日|きんようび} まで です。', 'Ngân hàng làm từ thứ Hai đến thứ Sáu.'),
          ],
        },
        {
          formula: '{休|やす}み は {何曜日|なんようび} です か。 —— ～曜日 です。',
          vi: 'Ngày nghỉ là thứ mấy. Hai ngày nghỉ nối bằng と.',
          examples: [
            E('{郵便局|ゆうびんきょく} の {休|やす}み は {何曜日|なんようび} です か。', 'Bưu điện nghỉ vào thứ mấy?'),
            E('{土曜日|どようび} と {日曜日|にちようび} です。', 'Thứ Bảy và Chủ nhật.'),
          ],
        },
      ],
    },
    DLG('Hội thoại 1 — Thầy giới thiệu lịch của trường', [
      D('{山田|やまだ}{先生|せんせい}', 'm', 'これ は {学校|がっこう} の スケジュール です。 {五月|ごがつ} {二日|ふつか} から {六日|むいか} まで ゴールデンウイーク です。', 'Đây là lịch của trường. Từ 2 đến 6 tháng 5 là Tuần lễ Vàng.'),
      D('アンナ', 'f', 'ゴールデンウイーク、 どこ へ {行|い}きます か。', 'Tuần lễ Vàng thì (chúng ta) đi đâu ạ?'),
      D('{山田|やまだ}{先生|せんせい}', 'm', '{学校|がっこう} は {休|やす}み です。 {海|うみ} へ {行|い}きます か。', 'Trường nghỉ. Các em đi biển không?'),
      D('アンナ', 'f', 'はい、 {海|うみ} へ {行|い}きます。 {先生|せんせい}、 {夏休|なつやす}み は いつ から いつ まで です か。', 'Vâng, em đi biển. Thưa thầy, nghỉ hè từ bao giờ đến bao giờ ạ?'),
      D('{山田|やまだ}{先生|せんせい}', 'm', '{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。', 'Từ 20 tháng 7 đến 31 tháng 8.'),
    ]),
    DLG('Hội thoại 2 — Nghỉ xuân đi đâu?', [
      D('ダニエル', 'm', '^パク-さん、 {春休|はるやす}み、 どこ へ {行|い}きます か。', 'Park, nghỉ xuân bạn đi đâu?'),
      D('パク', 'f', '{京都|きょうと} へ {行|い}きます。 お{花見|はなみ} を します。', 'Mình đi Kyoto. Mình ngắm hoa.'),
      D('ダニエル', 'm', 'いい です ね。 いつ から いつ まで です か。', 'Hay nhỉ. Từ bao giờ đến bao giờ?'),
      D('パク', 'f', '{三月|さんがつ} {二十日|はつか} から {四月|しがつ} {四日|よっか} まで です。', 'Từ 20 tháng 3 đến 4 tháng 4.'),
    ]),
    NOTE('Lỗi hay mắc — "sai" ở buổi 2 (mất điểm khi nói)', [
      '~~しちがつ~~ cho tháng 4 → **しがつ**; ~~ななにち~~ cho ngày 7 → **なのか**; ~~ここのにち~~ cho ngày 9 → **ここのか**.',
      'Ngày 20 là **はつか** (không phải ~~にじゅうにち~~); ngày 24 là **にじゅうよっか** (không phải ~~にじゅうよんにち~~).',
      'Đảo thứ tự: ~~二十日五月~~ → **五月二十日**. Tiếng Nhật luôn nói ngày **lớn → nhỏ** (tháng rồi mới ngày).',
      'Lẫn hai câu hỏi: **何曜日** (thứ mấy) trả lời bằng thứ; **何日／いつ** trả lời bằng ngày. Đừng đáp "げつようびです" cho câu hỏi "何月何日".',
      'Nối hai ngày nghỉ bằng **と**: 土曜日と日曜日. (**や** dành cho "…và vân vân", học ở Buổi 5.)',
    ]),
    NOTE('Cách nhớ', [
      '**Thứ** = bảy hành của lịch: trăng–lửa–nước–cây–kim–đất–mặt trời; nói luôn theo thứ tự này như đọc bài vè.',
      '**Ngày 2–10** nhớ như một bài hát: *futsu – mik – yok – itsu – mui – nano – yō – kokono – tō* + ka. Đọc to 5 lần mỗi ngày.',
      '**4・7・9** xuất hiện 3 lần (giờ, tháng, ngày 14/24/17/19): thấy 4, 7, 9 là dừng lại hỏi "chỗ này có bất quy tắc không?".',
    ]),
    QZ('s113-b3-02-doc', 'Viết cách đọc bằng hiragana (buổi 2)', 'fill', [
      A('4月 → ?', 'しがつ'),
      A('9月 → ?', 'くがつ'),
      A('7月 → ?', 'しちがつ'),
      A('6日 → ?', 'むいか'),
      A('20日 → ?', 'はつか'),
      A('24日 → ?', 'にじゅうよっか'),
      A('5月3日 → ?', 'ごがつみっか'),
      A('水曜日 → ?', 'すいようび'),
    ]),
    QZ('s113-b3-02-dich', 'Dịch Việt → Nhật (buổi 2)', 'translate', [
      AD('Nghỉ hè từ ngày 20 tháng 7 đến ngày 31 tháng 8.', ['{夏休|なつやす}みは{7月|しちがつ}{20日|はつか}から{8月|はちがつ}{31日|さんじゅういちにち}までです。'], '夏休み・から・まで'),
      AD('Bưu điện nghỉ vào thứ Bảy và Chủ nhật.', ['{郵便局|ゆうびんきょく}の{休|やす}みは{土曜日|どようび}と{日曜日|にちようび}です。', '{郵便局|ゆうびんきょく}は{土曜日|どようび}と{日曜日|にちようび}が{休|やす}みです。'], '休み・と'),
      AD('Bài kiểm tra là ngày 14 tháng 9.', ['テストは{9月|くがつ}{14日|じゅうよっか}です。'], '9月・14日'),
      AD('Ngân hàng làm việc từ thứ Hai đến thứ Sáu.', ['{銀行|ぎんこう}は{月曜日|げつようび}から{金曜日|きんようび}までです。'], 'から・まで'),
    ], 'N は ［ngày］ です ／ N は 〜から 〜まで です'),
    MC('s113-b3-02-mcq', 'Chọn đáp án (buổi 2)', [
      Q('「{夏休|なつやす}みは（　）から（　）までですか。」', 'いつ / いつ', '{何時|なんじ} / {何時|なんじ} | どこ / どこ | {何|なに} / {何|なに}', 'Hỏi thời điểm của kỳ nghỉ: いつ.'),
      Q('「{十日|とおか}」 đọc là…', 'とおか', 'じゅうにち | とうか | じゅっか', 'Ngày 10 = とおか.'),
      Q('Chọn cách nói đúng "ngày 24 tháng 12":', '{十二月|じゅうにがつ}{二十四日|にじゅうよっか}', '{二十四日|にじゅうよっか}{十二月|じゅうにがつ} | {十二月|じゅうにがつ}{二十四日|にじゅうよんにち} | {十二|じゅうに}{月|つき}{二十四|にじゅうよん}', 'Tháng trước, ngày sau; 24 = にじゅうよっか.'),
      Q('「{休|やす}みは{何曜日|なんようび}ですか。」 trả lời đúng là…', '{日曜日|にちようび}です。', '{五月|ごがつ}です。 | {九時|くじ}です。 | {海|うみ}です。', 'Hỏi thứ → trả lời thứ.'),
      Q('「{木曜日|もくようび}」 chữ 「{木|き}」 nghĩa là…', 'Cây', 'Nước | Lửa | Đất', '木 = cây (MỘC).'),
      Q('「テストは（　）ですか。」 — 「{十二月|じゅうにがつ}{十四日|じゅうよっか}です。」', 'いつ', 'どこ | {何|なに} | {何時|なんじ}', 'Trả lời bằng ngày → câu hỏi いつ／何月何日.'),
    ]),
    ASK([
      '「{夏休|なつやす}みはいつからいつまでですか。」 — trả lời bằng ngày của trường bạn: **七月から八月まで**.',
      '「{休|やす}みは{何曜日|なんようび}ですか。」 — nhớ nối hai ngày bằng **と**.',
      '「テストはいつですか。」 — nói đủ **tháng + ngày** (五月二十日) và đọc đúng ngày bất quy tắc.',
    ]),
  ],
};

/* ───────── Buổi 3 — Vます／Vません · へ · を ───────── */

const S_03: Lesson = {
  id: 's113-b3-03-dong-tu-masu-he-wo',
  kind: 'grammar',
  title: 'Buổi 3 — Động từ ます／ません, trợ từ へ (đi đâu) và を (làm gì) — ポイント 16–18 (theo khung lớp)',
  goal: 'Dùng 14 động từ của Bài 3 ở dạng ます／ません／ますか, nói được "đi/đến/về đâu" bằng へ và "làm/ăn/xem/uống cái gì" bằng を.',
  minutes: 50,
  blocks: [
    HOW([
      NGUON,
      'Học **14 động từ trước** (nhóm G của từ vựng), đọc to từng cặp ます／ません. Sau đó mới học trợ từ: へ gắn với 行・来・帰, を gắn với các động từ còn lại.',
      'Khi làm bài tập, **gạch chân động từ cuối câu trước** rồi mới chọn trợ từ — cách nhanh nhất để không nhầm へ／を／に／で.',
    ]),
    RECAP('Buổi 3 học gì?', [
      '**ポイント 16**: động từ lịch sự **Vます** (làm / sẽ làm / thói quen), **Vません** (không), **Vますか** (hỏi Có/Không). Động từ **không đổi theo ngôi** và đứng **cuối câu**.',
      '**ポイント 17**: **N（nơi）へ 行きます／来ます／帰ります** — へ chỉ **hướng đi tới**, đọc là **e**. Hỏi: **どこへ行きますか**.',
      '**ポイント 18**: **N を V** — を đánh dấu **vật bị tác động** (ăn cái gì, xem cái gì). Hỏi: **何を〜ますか**. Danh từ + **します** (スキーをします) là kiểu "làm/chơi".',
      '14 động từ: 行く・帰る・飲む・食べる・見る・する・買う・聞く・働く・読む・起きる・寝る・勉強する・来る (đây là thể từ điển, trong bài chỉ dùng ます).',
    ]),
    { t: 'h', text: 'Từng mục của buổi 3 — kèm giải thích' },
    slides3('Các mục học (theo trình tự sách)', [
      ['Bảng **14 động từ** (表 動詞)', 'Mỗi động từ có thể từ điển [ ], nhóm 1/2/3 và nghĩa. Bài 3 chỉ cần **ます** và **ません**. Nhóm 1: 行・帰・飲・買・聞・働・読; nhóm 2: 食・見・起・寝; nhóm 3: する・勉強する・来る.'],
      ['**ポイント 16** — N は V ます／ません', 'Động từ lịch sự dùng với cô giáo, người mới quen, trong phòng thi. Một dạng ます diễn tả **cả thói quen lẫn việc sẽ làm**: *Maiasa asagohan o tabemasu* (mỗi sáng tôi ăn sáng) / *Natsuyasumi kuni e kaerimasu* (nghỉ hè tôi về nước).'],
      ['Câu hỏi Có/Không: **Vますか → はい、Vます／いいえ、Vません**', 'Trả lời bằng **chính động từ** đó, không dùng ~~はい、そうです~~. Thi nói: quên はい／いいえ bị trừ điểm.'],
      ['**ポイント 17** — N（nơi）**へ** 行きます／来ます／帰ります', 'へ viết là *he* nhưng **đọc e** khi làm trợ từ. 行く = đi ra khỏi chỗ mình; 来る = đến chỗ người nói; 帰る = về nhà/về nước mình.'],
      ['Hỏi đường đi: **どこへ 行きますか**', 'Trả lời bằng nơi + へ + động từ: *Umi e ikimasu*. Có thể nói **に** thay **へ** (どこに行きますか) — cũng đúng.'],
      ['**ポイント 18** — N **を** V ます', 'を (đọc *o*) đứng sau **cái bị tác động**: パン**を**食べます, テレビ**を**見ます, CD**を**聞きます, 新聞**を**読みます, 牛乳**を**飲みます, お弁当**を**買います.'],
      ['Hỏi **何を〜ますか**', '何 trước を đọc **なに**: *Nani o tabemasu ka.* Trả lời: *Pan o tabemasu.*'],
      ['**N をします** (スキー・インターネット・アルバイト・ホームステイ・バーベキュー)', 'します = làm/chơi. Danh từ nào đi với します thì dịch thành động từ tương ứng: スキーをします = trượt tuyết, インターネットをします = lên mạng.'],
      ['Trật tự câu: **N は ［khi nào］ ［đâu］ ［cái gì］ V**', 'Khung cả bài: *Watashi wa [asa] [toshokan e] ikimasu*. Thời điểm đứng gần đầu; động từ luôn cuối. Buổi 4 sẽ thêm に và で vào khung này.'],
    ]),
    { t: 'h', text: 'Bảng 14 động từ' },
    TABLE(
      ['Nhóm', 'Ý nghĩa', 'ます', 'ません'],
      [
        ['1', 'đi', JR('{行|い}きます'), JR('{行|い}きません')],
        ['1', 'về', JR('{帰|かえ}ります'), JR('{帰|かえ}りません')],
        ['1', 'uống', JR('{飲|の}みます'), JR('{飲|の}みません')],
        ['1', 'mua', JR('{買|か}います'), JR('{買|か}いません')],
        ['1', 'nghe (hỏi)', JR('{聞|き}きます'), JR('{聞|き}きません')],
        ['1', 'làm việc', JR('{働|はたら}きます'), JR('{働|はたら}きません')],
        ['1', 'đọc', JR('{読|よ}みます'), JR('{読|よ}みません')],
        ['2', 'ăn', JR('{食|た}べます'), JR('{食|た}べません')],
        ['2', 'xem', JR('{見|み}ます'), JR('{見|み}ません')],
        ['2', 'thức dậy', JR('{起|お}きます'), JR('{起|お}きません')],
        ['2', 'ngủ', JR('{寝|ね}ます'), JR('{寝|ね}ません')],
        ['3', 'làm, chơi', JR('します'), JR('しません')],
        ['3', 'học', JR('{勉強|べんきょう}します'), JR('{勉強|べんきょう}しません')],
        ['3', 'đến', JR('{来|き}ます'), JR('{来|き}ません')],
      ],
      'Chỉ đổi đuôi: ます → ません',
    ),
    { t: 'h', text: 'Ngữ pháp buổi 3 — công thức và ví dụ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N は V ます。 ／ N は V ません。 ／ N は V ます か。',
          vi: 'Làm / không làm / hỏi Có–Không. Trả lời: はい、Vます。 いいえ、Vません。',
          examples: [
            E('{私|わたし} は {毎日|まいにち} {日本語|にほんご} を {勉強|べんきょう}します。', 'Hằng ngày tôi học tiếng Nhật.'),
            E('{私|わたし} は お{酒|さけ} を {飲|の}みません。', 'Tôi không uống rượu.'),
            E('{朝|あさ}ご{飯|はん} を {食|た}べます か。', 'Bạn có ăn sáng không?'),
            E('はい、 {食|た}べます。', 'Có, tôi ăn.'),
          ],
        },
        {
          formula: 'N（nơi） へ いきます／きます／かえります。 ／ どこ へ いきます か。',
          vi: 'Đi / đến / về (hướng tới) N. Hỏi nơi đến: どこへ.',
          examples: [
            E('{日曜日|にちようび}、 {公園|こうえん} へ {行|い}きます。', 'Chủ nhật tôi đi công viên.'),
            E('{六時|ろくじ} に うち へ {帰|かえ}ります。', 'Tôi về nhà lúc 6 giờ.'),
            E('ゴールデンウイーク、 どこ へ {行|い}きます か。', 'Tuần lễ Vàng bạn đi đâu?'),
          ],
        },
        {
          formula: 'N を V ます。 ／ {何|なに} を V ます か。',
          vi: 'Làm gì với N; hỏi "cái gì".',
          examples: [
            E('{朝|あさ}、 {牛乳|ぎゅうにゅう} を {飲|の}みます。', 'Buổi sáng tôi uống sữa.'),
            E('{夜|よる}、 テレビ を {見|み}ます。', 'Buổi tối tôi xem ti vi.'),
            E('{何|なに} を {買|か}います か。', 'Bạn mua gì?'),
            E('インターネット を します。', 'Tôi lên mạng.'),
          ],
        },
      ],
    },
    DLG('Hội thoại 1 — Cuối tuần đi đâu', [
      D('アンナ', 'f', '^ナタポン-さん、 {日曜日|にちようび}、 どこ へ {行|い}きます か。', 'Nattapon, Chủ nhật bạn đi đâu?'),
      D('ナタポン', 'm', '{図書館|としょかん} へ {行|い}きます。 {本|ほん} を {読|よ}みます。', 'Mình đi thư viện. Mình đọc sách.'),
      D('アンナ', 'f', 'へえ。 インターネット も します か。', 'Ồ. Bạn cũng lên mạng à?'),
      D('ナタポン', 'm', 'いいえ、 しません。 アンナ-さん は？', 'Không, mình không. Còn Anna?'),
      D('アンナ', 'f', '{私|わたし} は {海|うみ} へ {行|い}きます。', 'Mình đi biển.'),
    ]),
    DLG('Hội thoại 2 — Buổi sáng của Park', [
      D('ダニエル', 'm', '^パク-さん は {毎朝|まいあさ}、 {何|なに} を {食|た}べます か。', 'Park, sáng nào bạn cũng ăn gì?'),
      D('パク', 'f', 'パン と サラダ を {食|た}べます。 そして、 {牛乳|ぎゅうにゅう} を {飲|の}みます。', 'Mình ăn bánh mì và salad. Rồi uống sữa.'),
      D('ダニエル', 'm', 'コーヒー も {飲|の}みます か。', 'Bạn cũng uống cà phê chứ?'),
      D('パク', 'f', 'いいえ、 {飲|の}みません。', 'Không, mình không uống.'),
    ]),
    BUILD('s113-b3-03-xep', 'Ghép câu theo thứ tự (buổi 3)', [
      BD('Buổi sáng tôi uống sữa.', '{朝|あさ}、 {牛乳|ぎゅうにゅう} を {飲|の}みます。', ['が']),
      BD('Chủ nhật tôi đi thư viện.', '{日曜日|にちようび}、 {図書館|としょかん} へ {行|い}きます。', ['を']),
      BD('Buổi tối tôi không xem ti vi.', '{夜|よる}、 テレビ を {見|み}ません。', ['へ']),
      BD('Bạn mua gì?', '{何|なに} を {買|か}います か。', ['へ']),
    ]),
    NOTE('Lỗi hay mắc — "sai" ở buổi 3 (mất điểm khi nói)', [
      'Đọc へ là *he*: sai. Đọc **e** (「がっこう**え**」). Tương tự **は** chủ đề đọc **wa**, **を** đọc **o**.',
      '~~図書館を行きます~~, ~~図書館で行きます~~ → **図書館へ行きます**. Động từ đi/đến/về đi với **へ** (hoặc に), không phải を hay で.',
      '~~うちへ行きます~~ khi nói về **nhà mình** → dùng **帰ります**: *Uchi e kaerimasu*.',
      '~~パンへ食べます~~ → **パンを食べます**. Món ăn/vật bị tác động đi với **を**.',
      'Trả lời câu hỏi Vますか bằng ~~はい、そうです~~ → **はい、Vます**. Quên はい／いいえ bị trừ điểm.',
      'Nhầm 来ます (kimasu — 2 chữ) với 聞きます (kikimasu — 3 chữ).',
    ]),
    NOTE('Cách nhớ', [
      '**へ・を・に・で** = "bốn cái móc" của động từ. Buổi này nhớ hai: **へ** = hướng đi (mũi tên →), **を** = "cái bị đụng tới" (hai chấm = hai tay cầm vật).',
      '**Ba nhóm**: nhóm 3 chỉ có 3 loại (します, 来ます, N+します) — học thuộc ngay. Nhóm 2 là những động từ có đuôi **え** + ます (たべ・ね) và hai ngoại lệ **み・お**きます. Phần còn lại là nhóm 1.',
      'Phủ định rất dễ: đổi **ます → ません**, mọi động từ, không ngoại lệ.',
    ]),
    QZ('s113-b3-03-phu-dinh', 'Chuyển sang phủ định (buổi 3)', 'fill', [
      A('{行|い}きます → ?', '{行|い}きません'),
      A('{飲|の}みます → ?', '{飲|の}みません'),
      A('{食|た}べます → ?', '{食|た}べません'),
      A('します → ?', 'しません'),
      A('{勉強|べんきょう}します → ?', '{勉強|べんきょう}しません'),
      A('{寝|ね}ます → ?', '{寝|ね}ません'),
      A('{来|き}ます → ?', '{来|き}ません'),
      A('{働|はたら}きます → ?', '{働|はたら}きません'),
    ]),
    MC('s113-b3-03-mcq', 'Chọn trợ từ (buổi 3)', [
      Q('{私|わたし}は {図書館|としょかん}（　）{行|い}きます。', 'へ', 'を | で | が', 'Đi đâu → へ.'),
      Q('{朝|あさ}、パン（　）{食|た}べます。', 'を', 'へ | で | に', 'Ăn cái gì → を.'),
      Q('{夜|よる}、テレビ（　）{見|み}ます。', 'を', 'へ | で | の', 'Xem cái gì → を.'),
      Q('ゴールデンウイーク、どこ（　）{行|い}きますか。', 'へ', 'を | が | も', 'Hỏi nơi đến: どこへ.'),
      Q('「{毎朝|まいあさ}、{新聞|しんぶん}を{読|よ}みますか。」 trả lời "không":', 'いいえ、{読|よ}みません。', 'いいえ、そうじゃありません。 | はい、{読|よ}みません。 | いいえ、{読|よ}みます。', 'Trả lời bằng chính động từ ở dạng phủ định.'),
      Q('Động từ nào KHÔNG thuộc nhóm 2?', '{帰|かえ}ります', '{食|た}べます | {見|み}ます | {寝|ね}ます', '帰る là nhóm 1 (dù trông giống nhóm 2); 食・見・寝 là nhóm 2.'),
    ]),
    ASK([
      '「{朝|あさ}ご{飯|はん}を{食|た}べますか。」 → **はい、食べます／いいえ、食べません**. Nhớ はい／いいえ.',
      '「{何|なに}を{飲|の}みますか。」 / 「{何|なに}を{買|か}いますか。」 — trả lời **N を V**.',
      '「{日曜日|にちようび}、どこへ{行|い}きますか。」 — **nơi + へ + 行きます**.',
    ]),
  ],
};

/* ───────── Buổi 4 — に (giờ) · で (nơi làm) · kể một ngày ───────── */

const S_04: Lesson = {
  id: 's113-b3-04-ni-gio-de-noi-ke-mot-ngay',
  kind: 'grammar',
  title: 'Buổi 4 — Trợ từ に (mốc giờ) và で (nơi làm việc), kể một ngày của mình — ポイント 19–20 (theo khung lớp)',
  goal: 'Nói và hỏi được "làm lúc mấy giờ" bằng 〜時に, "làm ở đâu" bằng 〜で, phân biệt へ／に／で, rồi kể trọn một ngày từ lúc thức dậy đến lúc đi ngủ.',
  minutes: 50,
  blocks: [
    HOW([
      NGUON,
      'Buổi này là chỗ **nhầm trợ từ nhiều nhất** của Bài 3. Học theo cặp đối chiếu: **へ** (đích đến) ≠ **で** (nơi làm việc); **に** (mốc giờ) có mặt ở 七時**に** nhưng vắng mặt ở 毎朝.',
      'Đọc bài mẫu "Một ngày của tôi" to hai lần, rồi **che đi và tự kể** một ngày của chính bạn theo khung 5 câu.',
    ]),
    RECAP('Buổi 4 học gì?', [
      '**ポイント 19**: **N（giờ・ngày）に V** — chỉ **mốc thời gian cụ thể** (七時に, 六時半に, 五月三日に). Hỏi: **何時に〜ますか**.',
      '**ポイント 20**: **N（nơi）で V** — chỉ **nơi diễn ra hành động** (図書館で勉強します). Hỏi: **どこで〜ますか**.',
      'KHÔNG dùng に với từ chỉ thời gian chung: 毎日・毎朝・毎晩・今・朝・昼・夜 (nói thẳng: **毎朝、七時に起きます**).',
      'Từ mới trong ngữ cảnh: 朝・夜・毎日・毎朝・毎晩・朝ご飯・昼ごはん・家（うち）・会社・学校・コンビニ・起きます・寝ます・働きます.',
    ]),
    { t: 'h', text: 'Từng mục của buổi 4 — kèm giải thích' },
    slides3('Các mục học (theo trình tự sách)', [
      ['Nhóm từ "どんな毎日？"', '*asa · yoru · mainichi · maiasa · maiban · asagohan · hirugohan · uchi · kaisha · gakkō · konbini · gyūnyū · kudamono · sarada · chīzu · intānetto · shinbun · terebi · shīdī · dībuidī*. Học theo cụm: **毎**+朝/晩/日, **朝／昼ご飯** (bữa) khác **朝／昼** (buổi).'],
      ['**ポイント 19** — N（giờ・ngày）**に** V', 'に đánh dấu **một điểm cụ thể** trên trục thời gian: *Shichiji ni okimasu* (dậy lúc 7 giờ), *Kayōbi ni arubaito o shimasu* (thứ Ba tôi làm thêm), *Gogatsu mikka ni …* (ngày 3 tháng 5).'],
      ['Hỏi **何時に〜ますか**', 'Trả lời **〜時に**: *Nanji ni okimasu ka — Rokuji han ni okimasu.* Hỏi khoảng thời gian thì dùng から〜まで (Buổi 1).'],
      ['Khi nào KHÔNG dùng に', 'Với 毎日・毎朝・毎晩・今・朝・昼・夜・今日・夏休み… **không** thêm に. Nếu có cả hai thì để thời điểm chung trước, giờ cụ thể sau: **朝、七時に起きます。**'],
      ['**ポイント 20** — N（nơi）**で** V', 'で đánh dấu **sân khấu của hành động**: *Toshokan de benkyō shimasu*, *Konbini de arubaito o shimasu*, *Uchi de terebi o mimasu*, *Gakkō de hirugohan o tabemasu*.'],
      ['Hỏi **どこで〜ますか**', 'Trả lời **N で V**: *Doko de hatarakimasu ka — Kaisha de hatarakimasu.* Đừng trả lời bằng へ.'],
      ['**So sánh へ ↔ で ↔ に**', 'へ = hướng tới (đi/đến/về) · で = nơi làm việc khác · に = mốc giờ. Cùng một câu có thể đủ cả ba: **七時に、学校へ行きます。学校で勉強します。**'],
      ['Bài mẫu **私の一日**', 'Kể theo thời gian: dậy → ăn sáng → đến trường → học → làm thêm → về nhà → ngủ. Mỗi dòng một động từ, dùng に cho giờ, で cho nơi, へ cho đích, を cho vật.'],
    ]),
    TABLE(
      ['Cụm', 'Có に?', 'Ví dụ'],
      [
        ['{七時|しちじ} / {六時半|ろくじはん}', '**Có** に', JR('{七時|しちじ} に {起|お}きます。')],
        ['{月曜日|げつようび} / {五月|ごがつ} {三日|みっか}', 'có thể có に', JR('{火曜日|かようび} に アルバイト を します。')],
        ['{毎朝|まいあさ} / {毎晩|まいばん} / {毎日|まいにち}', '**Không** に', JR('{毎晩|まいばん}、 {十一時|じゅういちじ} に {寝|ね}ます。')],
        ['{朝|あさ} / {昼|ひる} / {夜|よる} / {今|いま}', '**Không** に', JR('{夜|よる}、 インターネット を します。')],
      ],
      'Khi nào dùng に với thời gian',
    ),
    { t: 'h', text: 'Ngữ pháp buổi 4 — công thức và ví dụ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（giờ・ngày） に V ます。 ／ {何時|なんじ} に V ます か。',
          vi: 'Làm việc V vào đúng lúc đó.',
          examples: [
            E('{毎朝|まいあさ}、 {六時半|ろくじはん} に {起|お}きます。', 'Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.'),
            E('{何時|なんじ} に {寝|ね}ます か。', 'Bạn ngủ lúc mấy giờ?'),
            E('{十一時|じゅういちじ} に {寝|ね}ます。', 'Tôi ngủ lúc 11 giờ.'),
          ],
        },
        {
          formula: 'N（nơi） で V ます。 ／ どこ で V ます か。',
          vi: 'Làm việc V tại nơi N.',
          examples: [
            E('{図書館|としょかん} で {勉強|べんきょう}します。', 'Tôi học ở thư viện.'),
            E('コンビニ で アルバイト を します。', 'Tôi làm thêm ở cửa hàng tiện lợi.'),
            E('どこ で {昼|ひる}ごはん を {食|た}べます か。', 'Bạn ăn trưa ở đâu?'),
            E('{学校|がっこう} で {食|た}べます。', 'Tôi ăn ở trường.'),
          ],
        },
        {
          formula: '［giờ］ に ［nơi］ へ V。 ／ ［nơi］ で ［vật］ を V。',
          vi: 'Một câu có thể chứa đủ に・へ・で・を — thứ tự: thời gian, nơi, vật, động từ.',
          examples: [
            E('{八時|はちじ} に {学校|がっこう} へ {来|き}ます。', 'Tôi đến trường lúc 8 giờ.'),
            E('{昼|ひる}、 {学校|がっこう} で おすし を {食|た}べます。', 'Buổi trưa tôi ăn sushi ở trường.'),
          ],
        },
      ],
    },
    { t: 'h', text: 'Bài mẫu — {私|わたし}の{一日|いちにち} (một ngày của tôi)' },
    ...PSG('{私|わたし}の{一日|いちにち}', [
      ['{私|わたし} は {留学生|りゅうがくせい} です。', 'Tôi là du học sinh.'],
      ['{毎朝|まいあさ}、 {六時半|ろくじはん} に {起|お}きます。', 'Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.'],
      ['パン と {果物|くだもの} を {食|た}べます。', 'Tôi ăn bánh mì và hoa quả.'],
      ['{八時|はちじ} に {学校|がっこう} へ {行|い}きます。', 'Tám giờ tôi đến trường.'],
      ['{学校|がっこう} で {日本語|にほんご} を {勉強|べんきょう}します。', 'Ở trường tôi học tiếng Nhật.'],
      ['{午後|ごご}、 コンビニ で アルバイト を します。', 'Buổi chiều tôi làm thêm ở cửa hàng tiện lợi.'],
      ['{毎晩|まいばん}、 {十一時|じゅういちじ} に {寝|ね}ます。', 'Tối nào tôi cũng ngủ lúc 11 giờ.'],
    ], 'Đọc to; chú ý に đi với giờ, で đi với nơi.'),
    DLG('Hội thoại 1 — Buổi sáng của Lin', [
      D('ワン', 'f', '^リン-さん は {毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', 'Lin, sáng nào bạn cũng dậy lúc mấy giờ?'),
      D('リン', 'f', '{六時半|ろくじはん} に {起|お}きます。', 'Mình dậy lúc 6 giờ rưỡi.'),
      D('ワン', 'f', '{朝|あさ}ご{飯|はん} を {食|た}べます か。', 'Bạn có ăn sáng không?'),
      D('リン', 'f', 'はい、 パン と {果物|くだもの} を {食|た}べます。', 'Có, mình ăn bánh mì và hoa quả.'),
      D('ワン', 'f', '{昼|ひる}ごはん は どこ で {食|た}べます か。', 'Bữa trưa bạn ăn ở đâu?'),
      D('リン', 'f', '{学校|がっこう} で {食|た}べます。', 'Mình ăn ở trường.'),
    ]),
    DLG('Hội thoại 2 — Làm thêm ở đâu, lúc nào', [
      D('ダニエル', 'm', 'アルバイト は どこ で します か。', 'Bạn làm thêm ở đâu?'),
      D('アンナ', 'f', 'コンビニ で します。', 'Ở cửa hàng tiện lợi.'),
      D('ダニエル', 'm', '{何曜日|なんようび} に します か。', 'Làm vào thứ mấy?'),
      D('アンナ', 'f', '{火曜日|かようび} と {木曜日|もくようび} です。 {四時|よじ} から {九時|くじ} まで {働|はたら}きます。', 'Thứ Ba và thứ Năm. Mình làm từ 4 đến 9 giờ.'),
    ]),
    NOTE('Lỗi hay mắc — "sai" ở buổi 4 (mất điểm khi nói)', [
      '~~毎朝に起きます~~ → **毎朝、七時に起きます**. Không có に sau 毎朝／毎晩／毎日／朝／夜.',
      '~~七時で起きます~~ hay ~~七時を起きます~~ → **七時に起きます**. Mốc giờ luôn là に.',
      '~~図書館に勉強します~~ → **図書館で勉強します**. Nơi làm việc là で, không phải に.',
      '~~学校で行きます~~ → **学校へ行きます**. Đích đến là へ (hoặc に), không phải で.',
      'Nói giờ mà quên じ: ~~七に起きます~~ → **七時に**.',
    ]),
    NOTE('Cách nhớ', [
      '**に** = một **dấu chấm** trên đồng hồ ("đúng lúc đó"); **で** = một **sân khấu** (hành động diễn ra trong đó).',
      'Hỏi gì trả lời đúng cái đó: **何時に** → 〜時に; **どこで** → 〜で; **どこへ** → 〜へ; **何を** → 〜を.',
      'Kể một ngày theo khung 5 câu: ① dậy mấy giờ ② ăn gì ③ đến đâu mấy giờ ④ làm gì ở đâu ⑤ ngủ mấy giờ.',
    ]),
    QZ('s113-b3-04-dich', 'Dịch Việt → Nhật (buổi 4)', 'translate', [
      AD('Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.', ['{毎朝|まいあさ}、{6時半|ろくじはん}に{起|お}きます。', '{私|わたし}は{毎朝|まいあさ}{6時半|ろくじはん}に{起|お}きます。'], '毎朝・に・起きます'),
      AD('Tôi học ở thư viện.', ['{図書館|としょかん}で{勉強|べんきょう}します。', '{私|わたし}は{図書館|としょかん}で{勉強|べんきょう}します。'], 'で'),
      AD('Tối nào tôi cũng ngủ lúc 11 giờ.', ['{毎晩|まいばん}、{11時|じゅういちじ}に{寝|ね}ます。', '{私|わたし}は{毎晩|まいばん}{11時|じゅういちじ}に{寝|ね}ます。'], '毎晩・に・寝ます'),
      AD('Buổi chiều tôi làm thêm ở cửa hàng tiện lợi.', ['{午後|ごご}、コンビニでアルバイトをします。', '{午後|ごご}はコンビニでアルバイトをします。'], 'アルバイトをします'),
      AD('Bạn ăn trưa ở đâu?', ['{昼|ひる}ごはんはどこで{食|た}べますか。', 'どこで{昼|ひる}ごはんを{食|た}べますか。'], 'どこで'),
    ], 'N に V ／ N で V'),
    MC('s113-b3-04-mcq', 'Chọn trợ từ (buổi 4)', [
      Q('{毎朝|まいあさ}、{七時|しちじ}（　）{起|お}きます。', 'に', 'で | を | X', 'Giờ cụ thể → に.'),
      Q('{図書館|としょかん}（　）{勉強|べんきょう}します。', 'で', 'に | へ | を', 'Nơi làm việc → で.'),
      Q('{毎晩|まいばん}（　）{十一時|じゅういちじ}に{寝|ね}ます。', 'X (không cần trợ từ)', 'に | で | を', 'Sau 毎晩 không thêm に.'),
      Q('{八時|はちじ}に{学校|がっこう}（　）{来|き}ます。', 'へ', 'で | を | が', 'Đích đến → へ.'),
      Q('{会社|かいしゃ}（　）{働|はたら}きます。', 'で', 'へ | を | に', 'Nơi làm việc → で.'),
      Q('「{何時|なんじ}に{寝|ね}ますか。」 trả lời:', '{十一時|じゅういちじ}に{寝|ね}ます。', '{十一時|じゅういちじ}で{寝|ね}ます。 | {十一時|じゅういちじ}を{寝|ね}ます。 | {十一時|じゅういちじ}へ{寝|ね}ます。', '何時に → 〜時に.'),
      Q('「どこで{働|はたら}きますか。」 trả lời:', 'コンビニで{働|はたら}きます。', 'コンビニへ{働|はたら}きます。 | コンビニを{働|はたら}きます。 | コンビニが{働|はたら}きます。', 'どこで → 〜で.'),
    ]),
    ASK([
      '「{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。」 / 「{何時|なんじ}に{寝|ね}ますか。」 — trả lời **〜時に**. (Hai câu này có trong đề mẫu JPD113.)',
      '「{図書館|としょかん}で{何|なに}をしますか。」 — **N を V ます**: *Hon o yomimasu*.',
      '「{昼|ひる}ごはんはどこで{食|た}べますか。」 — **学校で**／**うちで**.',
    ]),
  ],
};

/* ───────── Buổi 5 — や〜など · 何も／どこへも ───────── */

const S_05: Lesson = {
  id: 's113-b3-05-ya-nado-nanimo-dokoemo',
  kind: 'grammar',
  title: 'Buổi 5 — や〜など (liệt kê) và 何も／どこへも〜ません (không … gì cả) — ポイント 22–23 (theo khung lớp)',
  goal: 'Liệt kê vài thứ tiêu biểu bằng N1 や N2 など, và trả lời phủ định hoàn toàn "không ăn gì cả / không đi đâu cả" bằng 何も・どこへも + ません.',
  minutes: 40,
  blocks: [
    HOW([
      NGUON,
      'Hai điểm ngữ pháp cuối của Bài 3 đều **ngắn** nhưng thi nói rất hay hỏi vì chúng làm câu trả lời "ra dáng": thay vì chỉ nói *Pan o tabemasu*, bạn nói *Pan ya kudamono nado o tabemasu*.',
      'Học xong thì đi ôn lại **nhóm từ ăn uống & giải trí** (牛乳・果物・サラダ・チーズ・新聞・テレビ・CD・DVD・インターネット) vì hai mẫu này dùng chủ yếu với chúng.',
    ]),
    RECAP('Buổi 5 học gì?', [
      '**ポイント 22**: **N1 や N2（など）を V** — liệt kê **một vài ví dụ tiêu biểu**, ý là "… và những thứ tương tự". Khác **と** liệt kê **đủ hết**.',
      '**ポイント 23**: **何も V ません** = không … gì cả; **どこ（へ）も 行きません** = không đi đâu cả. Phải đi cùng động từ **phủ định**.',
      'Câu hỏi tương ứng: **何を〜ますか → 何も〜ません**; **どこへ〜ますか → どこへも〜ません**.',
      'Thán từ phản ứng trong hội thoại: **いいですね**（hay nhỉ, khen）・**えっ**（ơ, hả）・**へえ**（ồ, thế à）.',
    ]),
    { t: 'h', text: 'Từng mục của buổi 5 — kèm giải thích' },
    slides3('Các mục học (theo trình tự sách)', [
      ['Nhóm từ ăn uống: **（お）酒・（お）すし・（お）弁当・朝ご飯・昼ごはん・牛乳・果物・サラダ・チーズ**', '*osake · osushi · obentō · asagohan · hirugohan · gyūnyū · kudamono · sarada · chīzu*. Có お trước là cách nói lịch sự, dùng được cả hai (おすし／すし).'],
      ['Nhóm giải trí: **インターネット・新聞・テレビ・CD・DVD**', 'Đi với động từ: インターネットを**します**, 新聞を**読みます**, テレビ／DVDを**見ます**, CDを**聞きます**. Tập ghép cặp từ–động từ này!'],
      ['**ポイント 22** — N1 **や** N2 （**など**）を V', '*Pan ya kudamono nado o tabemasu.* や nối **vài ví dụ**, không nhất thiết hết; **など** (= vân vân) ở cuối cho rõ ý "còn nữa". Có thể bỏ など nhưng を vẫn giữ.'],
      ['**や** ↔ **と**', 'と = chỉ **đúng hai thứ đó** (パンとサラダを食べます: chỉ bánh mì và salad). や = **ví dụ** (パンやサラダを食べます: bánh mì, salad…và có thể thêm). Thi nói dùng や／など nghe tự nhiên hơn.'],
      ['Hỏi **何を〜ますか** và trả lời bằng や', '*Nani o tabemasu ka — Pan ya kudamono nado o tabemasu.*'],
      ['**ポイント 23** — **何も** V ません', '*Asa, nanimo tabemasen* = Buổi sáng tôi không ăn gì cả. **Bỏ を** khi có 何も (không nói ~~何もを~~). 何も **bắt buộc** đi với phủ định.'],
      ['**どこ（へ）も** 行きません', '*Nichiyōbi, doko e mo ikimasen* = Chủ nhật tôi không đi đâu cả. Có thể nói **どこも** hoặc **どこへも**; trong sách giữ **へ**: どこ**へ**も.'],
      ['Thán từ: **いいですね・えっ・へえ**', 'いいですね = khen kế hoạch của người khác. えっ = bất ngờ, hơi không tin. へえ = thấy thú vị. Dùng đúng chỗ làm hội thoại sống động và được cô khen.'],
      ['Luyện tổng hợp: kể cuối tuần của mình', 'Dùng đủ: thời điểm, へ／で／を, や〜など, 何も／どこへも. Mẫu ở phần "Bài mẫu" bên dưới.'],
    ]),
    { t: 'h', text: 'Ngữ pháp buổi 5 — công thức và ví dụ' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 や N2 （など） を V ます。',
          vi: 'Làm V với N1, N2… (vài ví dụ tiêu biểu).',
          examples: [
            E('{朝|あさ}、 パン や {果物|くだもの} など を {食|た}べます。', 'Buổi sáng tôi ăn bánh mì, hoa quả, v.v.'),
            E('{日曜日|にちようび}、 テレビ や DVD を {見|み}ます。', 'Chủ nhật tôi xem ti vi, DVD (và những thứ tương tự).'),
            E('コンビニ で お{弁当|べんとう} や サラダ など を {買|か}います。', 'Ở cửa hàng tiện lợi tôi mua cơm hộp, salad, v.v.'),
          ],
        },
        {
          formula: '{何|なに} も V ません。 ／ どこ （へ） も {行|い}きません。',
          vi: 'Không … gì cả / không đi đâu cả (phủ định hoàn toàn).',
          examples: [
            E('{朝|あさ}、 {何|なに}も {食|た}べません。', 'Buổi sáng tôi không ăn gì cả.'),
            E('{夜|よる}、 {何|なに}も しません。', 'Buổi tối tôi không làm gì cả.'),
            E('{日曜日|にちようび}、 どこ へ も {行|い}きません。', 'Chủ nhật tôi không đi đâu cả.'),
            E('{夏休|なつやす}み、 どこ も {行|い}きません。', 'Nghỉ hè tôi không đi đâu hết.'),
          ],
        },
      ],
    },
    TABLE(
      ['Câu hỏi', 'Trả lời bình thường', 'Trả lời "không … gì cả"'],
      [
        ['{何|なに}を{食|た}べますか。', JR('パン や チーズ など を {食|た}べます。'), JR('{何|なに}も {食|た}べません。')],
        ['{何|なに}を{飲|の}みますか。', JR('{牛乳|ぎゅうにゅう} や コーヒー を {飲|の}みます。'), JR('{何|なに}も {飲|の}みません。')],
        ['どこへ{行|い}きますか。', JR('{海|うみ} や {公園|こうえん} へ {行|い}きます。'), JR('どこ へ も {行|い}きません。')],
        ['{何|なに}をしますか。', JR('テレビ や DVD を {見|み}ます。'), JR('{何|なに}も しません。')],
      ],
      'Cặp hỏi–đáp (viết mới)',
    ),
    { t: 'h', text: 'Bài mẫu — {私|わたし}の{週末|しゅうまつ} (cuối tuần của tôi)' },
    ...PSG('{私|わたし}の{週末|しゅうまつ}', [
      ['{土曜日|どようび}、 {私|わたし} は コンビニ で アルバイト を します。', 'Thứ Bảy tôi làm thêm ở cửa hàng tiện lợi.'],
      ['{昼|ひる}ごはん は お{弁当|べんとう} や サラダ など を {食|た}べます。', 'Bữa trưa tôi ăn cơm hộp, salad, v.v.'],
      ['{夜|よる}、 うち で テレビ や DVD を {見|み}ます。', 'Buổi tối ở nhà tôi xem ti vi, DVD.'],
      ['{日曜日|にちようび} は どこ へ も {行|い}きません。', 'Chủ nhật tôi không đi đâu cả.'],
      ['うち で {日本語|にほんご} を {勉強|べんきょう}します。', 'Tôi học tiếng Nhật ở nhà.'],
      ['{何|なに}も {飲|の}みません。 ジュース も {飲|の}みません。', 'Tôi không uống gì cả. Nước ép cũng không uống.'],
    ], 'Có đủ や／など, 何も, どこへも.'),
    DLG('Hội thoại 1 — Bữa sáng', [
      D('ナタポン', 'm', '^ダニエル-さん、 {朝|あさ}ご{飯|はん} は {何|なに} を {食|た}べます か。', 'Daniel, bữa sáng bạn ăn gì?'),
      D('ダニエル', 'm', 'パン や チーズ など を {食|た}べます。', 'Mình ăn bánh mì, phô mai, v.v.'),
      D('ナタポン', 'm', '{何|なに} を {飲|の}みます か。', 'Bạn uống gì?'),
      D('ダニエル', 'm', '{牛乳|ぎゅうにゅう} や コーヒー を {飲|の}みます。', 'Mình uống sữa, cà phê.'),
      D('ナタポン', 'm', 'へえ、 いい です ね。', 'Ồ, hay nhỉ.'),
    ]),
    DLG('Hội thoại 2 — Nghỉ hè không đi đâu', [
      D('ナタポン', 'm', '^リン-さん、 {夏休|なつやす}み、 どこ へ {行|い}きます か。', 'Lin, nghỉ hè bạn đi đâu?'),
      D('リン', 'f', 'どこ へ も {行|い}きません。 うち で {勉強|べんきょう}します。', 'Mình không đi đâu cả. Mình học ở nhà.'),
      D('ナタポン', 'm', 'えっ。 アルバイト も しません か。', 'Hả. Bạn cũng không làm thêm à?'),
      D('リン', 'f', 'はい、 しません。 {何|なに}も しません。', 'Vâng, không. Mình không làm gì cả.'),
    ]),
    NOTE('Lỗi hay mắc — "sai" ở buổi 5 (mất điểm khi nói)', [
      '~~何もを食べません~~ → **何も食べません**. Có 何も thì bỏ を.',
      '~~何も食べます~~ (khẳng định) → sai. **何も／どこへも phải đi với ません.**',
      '~~パンやサラダとを食べます~~ → **パンやサラダなどを食べます**. や đi với など, không đi với と.',
      'Dùng や khi chỉ có **một** thứ: ~~パンやを食べます~~. や cần ít nhất hai danh từ.',
      '~~どこでも行きません~~ → **どこへも行きません** (hoặc どこも). Đừng nhầm で với へ.',
      'Hỏi **何を飲みますか** mà đáp ~~何も飲みますか~~: nhớ 何も + **ません**.',
    ]),
    NOTE('Cách nhớ', [
      '**や** = "nhón vài món", **と** = "đủ hai món". Kết bằng **など** = "vân vân" nên thêm.',
      '**何も／どこへも** = chữ **も** + **ません** là một bộ khoá: thấy も ở đây thì cuối câu phải là phủ định.',
      'Trong phòng thi, có thể mở rộng một câu trả lời cụt thành hai câu: **何も食べません。コーヒーを飲みます。** (phủ định rồi nói điều có làm).',
    ]),
    QZ('s113-b3-05-dich', 'Dịch Việt → Nhật (buổi 5)', 'translate', [
      AD('Buổi sáng tôi ăn bánh mì, hoa quả, v.v.', ['{朝|あさ}、パンや{果物|くだもの}などを{食|た}べます。', '{私|わたし}は{朝|あさ}、パンや{果物|くだもの}などを{食|た}べます。'], 'や・など'),
      AD('Chủ nhật tôi không đi đâu cả.', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。', '{日曜日|にちようび}、どこも{行|い}きません。'], 'どこへも'),
      AD('Buổi tối tôi không làm gì cả.', ['{夜|よる}、{何|なに}もしません。', '{夜|よる}は{何|なに}もしません。'], '何も'),
      AD('Tôi uống sữa và cà phê (ví dụ).', ['{牛乳|ぎゅうにゅう}やコーヒーを{飲|の}みます。', '{牛乳|ぎゅうにゅう}やコーヒーなどを{飲|の}みます。'], 'や'),
    ], 'N1 や N2 など を V ／ 何も・どこへも Vません'),
    MC('s113-b3-05-mcq', 'Chọn đáp án (buổi 5)', [
      Q('{朝|あさ}、パン（　）{果物|くだもの}などを{食|た}べます。', 'や', 'と | を | が', 'Liệt kê ví dụ + など → や.'),
      Q('{朝|あさ}、{何|なに}（　）{食|た}べません。', 'も', 'を | が | に', '何も + ません.'),
      Q('{日曜日|にちようび}、どこへ（　）{行|い}きません。', 'も', 'を | で | が', 'どこへも + ません.'),
      Q('「{何|なに}を{飲|の}みますか。」 — Câu trả lời đúng nghĩa "không uống gì":', '{何|なに}も{飲|の}みません。', '{何|なに}を{飲|の}みません。 | {何|なに}も{飲|の}みます。 | どこへも{飲|の}みません。', '何も + 飲みません.'),
      Q('「パンとサラダを{食|た}べます」 khác 「パンやサラダを{食|た}べます」 ở chỗ…', 'と = đúng hai thứ; や = ví dụ (còn nữa)', 'と = vài thứ; や = đúng hai thứ | Hai câu y hệt | と dùng cho đồ uống', 'と liệt kê đủ; や liệt kê ví dụ.'),
      Q('Câu nào SAI?', '{何|なに}も{食|た}べます。', '{何|なに}も{食|た}べません。 | どこへも{行|い}きません。 | パンやサラダなどを{食|た}べます。', '何も cần phủ định.'),
    ]),
    ASK([
      '「{朝|あさ}ご{飯|はん}に{何|なに}を{食|た}べますか。」 — trả lời bằng **や／など** cho tự nhiên.',
      '「{休|やす}みの{日|ひ}、どこへ{行|い}きますか。」 — có thể đáp **どこへも行きません。うちで〜を〜**.',
      '「{毎朝|まいあさ}、コーヒーを{飲|の}みますか。」 — **いいえ、飲みません**; thêm một câu: **牛乳を飲みます**.',
    ]),
  ],
};

/* ───────── Buổi 6 — Chữ Hán của lớp Bài 3 ───────── */

const S_06: Lesson = {
  id: 's113-b3-06-chu-han-gio-thu-buoi',
  kind: 'kanji',
  title: 'Buổi 6 — Chữ Hán Bài 3: 時 分 月 火 水 木 金 土 曜 朝 晩 (theo khung lớp)',
  goal: 'Nhận mặt, đọc và hiểu nghĩa 11 chữ Hán chỉ giờ, tháng, thứ trong tuần, buổi sáng/tối; đọc được câu KHÔNG furigana như phần Reading của đề thi.',
  minutes: 40,
  blocks: [
    HOW([
      NGUON,
      'Danh sách 11 chữ Bài 3 trên web (`hanLop.ts`) là **danh sách dự kiến**, chọn từ chữ Hán xuất hiện trong từ vựng và ngữ pháp Bài 3 — chưa phải ảnh slide chữ Hán của cô. Khi có slide thật, hãy so lại.',
      'Học chữ Hán **theo từ**, không học chữ rời: 月曜日・五月・朝ご飯・毎晩. Đề Reading có **4 từ chữ Hán gạch chân không furigana (12 điểm)** — đọc sai một chữ mất cả từ.',
      'Cách học: chạm vào thẻ chữ ở khối dưới để xem **thứ tự nét**; đọc to các từ đi chung; làm bài đọc không furigana; cuối cùng tập viết.',
    ]),
    RECAP('Buổi 6 học gì?', [
      '**Giờ & thời gian**: 時 (ジ/とき) · 分 (フン,プン/わ-かる) — 何時, 時間, 十分.',
      '**Lịch**: 月 火 水 木 金 土 (+ 日 đã học Bài 1) + 曜 — 月曜日 … 土曜日, 何曜日. Mỗi chữ có hai đời: nghĩa thiên nhiên (trăng, lửa, nước, cây, kim, đất) và tên thứ.',
      '**Buổi trong ngày**: 朝 (あさ, チョウ) — 毎朝, 朝ご飯; 晩 (バン) — 毎晩, 今晩, 晩ご飯.',
      'Lưu ý 月 vừa là **trăng/tháng** (月 = がつ trong 五月), vừa là **thứ Hai** (げつ trong 月曜日).',
    ]),
    TABLE(
      ['Chữ', 'Hán Việt · nghĩa', 'On', 'Kun', 'Từ đi chung trong Bài 3'],
      [
        ['時', 'THỜI · thời gian; giờ', 'ジ', 'とき', '{何時|なんじ} · {時間|じかん} · {七時半|しちじはん}'],
        ['分', 'PHÂN · phút; chia', 'フン・ブン', 'わ・かる', '{十分|じゅっぷん} · {何分|なんぷん}'],
        ['月', 'NGUYỆT · trăng; tháng', 'ゲツ・ガツ', 'つき', '{月曜日|げつようび} · {五月|ごがつ}'],
        ['火', 'HOẢ · lửa', 'カ', 'ひ', '{火曜日|かようび} · {花火|はなび}'],
        ['水', 'THUỶ · nước', 'スイ', 'みず', '{水曜日|すいようび}'],
        ['木', 'MỘC · cây, gỗ', 'モク・ボク', 'き', '{木曜日|もくようび}'],
        ['金', 'KIM · vàng, kim loại; tiền', 'キン', 'かね', '{金曜日|きんようび}'],
        ['土', 'THỔ · đất', 'ド', 'つち', '{土曜日|どようび}'],
        ['曜', 'DIỆU · ngày trong tuần', 'ヨウ', '—', '{何曜日|なんようび} · {日曜日|にちようび}'],
        ['朝', 'TRIÊU · buổi sáng', 'チョウ', 'あさ', '{毎朝|まいあさ} · {朝|あさ}ご{飯|はん}'],
        ['晩', 'VÃN · buổi tối', 'バン', '—', '{毎晩|まいばん} · {今晩|こんばん}'],
      ],
      '11 chữ Hán của lớp Bài 3 (chữ 日 đã học từ Bài 1)',
    ),
    { t: 'hanlop', bai: 3 },
    { t: 'h', text: 'Từng mục của buổi 6 — kèm giải thích' },
    slides3('Các mục học (theo trình tự sách)', [
      ['**時 và 分** — hai chữ giờ giấc', '時 = 日 (mặt trời) + 寺 (chùa): chùa đánh chuông báo giờ. 分 = 八 (tách đôi) + 刀 (dao): chia nhỏ → phút. Trong từ ghép đọc on: *ji, fun/pun*; hiếm khi đọc kun.'],
      ['**月火水木金土** — sáu "hành"', 'Nhớ bằng hình: 月 vầng trăng · 火 ngọn lửa · 水 dòng nước · 木 cái cây · 金 kim loại dưới mái nhà · 土 mầm cây mọc từ đất. Cộng **日** thành bảy thứ; cộng **曜日** thành tên thứ.'],
      ['**曜** — chỉ nhận mặt', 'Nhiều nét (18) nên không bắt buộc viết, nhưng **曜日** xuất hiện ở mọi đề: nhớ hình cả khối "日 + 羽 + 隹".'],
      ['**朝 và 晩** — hai đầu của ngày', '朝 có 月 bên phải (trăng chưa lặn: sáng sớm). 晩 có 日 bên trái + 免 (mặt trời "thoát đi" → tối). Từ hay gặp: **毎朝・毎晩・朝ご飯・今朝・今晩**.'],
      ['Cặp dễ nhầm **月 / 日 / 目**, **木 / 本 / 休**, **土 / 士**', '月 (trăng) vs 日 (mặt trời): 日 vuông, 月 có hai vạch trong. 木 (cây) vs 本 (sách) thêm nét ngang dưới. 土 nét dưới DÀI hơn nét trên, 士 ngược lại.'],
      ['Đọc theo từ: **月曜日 = げつ·よう·び**', 'Thứ trong tuần đọc **on** (げつ, か, すい, もく, きん, ど, にち) + ようび. Tháng đọc **số + がつ**. Hai nghĩa của 月 tách bạch bằng từ đi kèm.'],
    ]),
    READK('s113-b3-06-doc', 'Đọc câu KHÔNG furigana (buổi 6)', 'Nhìn 5 giây, đọc to một hơi; sau đó bấm hiện cách đọc để tự chấm. Dừng ở chữ nào thì chữ đó chưa thuộc.', [
      RK('{今|いま}、 {九時|くじ} {十分|じゅっぷん} です。', 'Bây giờ là 9 giờ 10 phút.'),
      RK('{月曜日|げつようび} から {金曜日|きんようび} まで {学校|がっこう} へ {行|い}きます。', 'Từ thứ Hai đến thứ Sáu tôi đi học.'),
      RK('{土曜日|どようび} と {日曜日|にちようび} は {休|やす}み です。', 'Thứ Bảy và Chủ nhật là ngày nghỉ.'),
      RK('{毎朝|まいあさ}、 {七時半|しちじはん} に {起|お}きます。', 'Sáng nào tôi cũng dậy lúc 7 giờ rưỡi.'),
      RK('{毎晩|まいばん}、 {十一時|じゅういちじ} に {寝|ね}ます。', 'Tối nào tôi cũng ngủ lúc 11 giờ.'),
      RK('{火曜日|かようび} と {木曜日|もくようび} に アルバイト を します。', 'Thứ Ba và thứ Năm tôi làm thêm.'),
      RK('{水曜日|すいようび} の {午後|ごご}、 {図書館|としょかん} へ {行|い}きます。', 'Chiều thứ Tư tôi đi thư viện.'),
      RK('{朝|あさ}ご{飯|はん} は {何時|なんじ} です か。', 'Bữa sáng là mấy giờ?'),
      RK('{五月|ごがつ} の {金曜日|きんようび} は バス {旅行|りょこう} です。', 'Thứ Sáu của tháng 5 là chuyến đi xe buýt.'),
      RK('{花火|はなび} は {夜|よる} に {見|み}ます。', 'Pháo hoa thì xem vào buổi tối.'),
    ]),
    QZ('s113-b3-06-go', 'Viết cách đọc bằng hiragana (buổi 6)', 'fill', [
      A('火曜日 → ?', 'かようび'),
      A('水曜日 → ?', 'すいようび'),
      A('木曜日 → ?', 'もくようび'),
      A('金曜日 → ?', 'きんようび'),
      A('土曜日 → ?', 'どようび'),
      A('毎朝 → ?', 'まいあさ'),
      A('毎晩 → ?', 'まいばん'),
      A('何曜日 → ?', 'なんようび'),
      A('十分 → ?', 'じゅっぷん'),
      A('花火 → ?', 'はなび'),
    ]),
    MC('s113-b3-06-mcq', 'Chọn đáp án (buổi 6)', [
      Q('「{月曜日|げつようび}」 đọc là…', 'げつようび', 'つきようび | がつようび | げっようび', '月 trong tên thứ đọc げつ.'),
      Q('「{五月|ごがつ}」 — 「月」 đọc là…', 'がつ', 'げつ | つき | ぐつ', 'Tháng: số + がつ.'),
      Q('「かようび」 viết là…', '{火曜日|かようび}', '{水曜日|すいようび} | {木曜日|もくようび} | {月曜日|げつようび}', '火 (lửa) → か.'),
      Q('「どようび」 viết là…', '{土曜日|どようび}', '{士曜日|しようび} | {上曜日|じょうようび} | {工曜日|こうようび}', '土: nét ngang dưới dài hơn nét trên (士 thì ngược lại).'),
      Q('Chữ 「晩」 trong 「{毎晩|まいばん}」 nghĩa là…', 'Buổi tối', 'Buổi sáng | Buổi trưa | Cả ngày', '晩 = ばん = tối.'),
      Q('Chữ 「朝」 trong 「{毎朝|まいあさ}」 nghĩa là…', 'Buổi sáng', 'Buổi tối | Buổi trưa | Ban đêm', '朝 = あさ = sáng.'),
    ]),
    WRITE('s113-b3-06-viet', 'Tập viết chữ Hán Bài 3', ['時', '分', '月', '火', '水', '木', '金', '土', '曜', '朝', '晩'], 'Viết theo thứ tự nét, đọc to cách đọc khi viết.', {
      '時': 'じ · giờ',
      '分': 'ふん · phút',
      '月': 'げつ/がつ · trăng, tháng',
      '火': 'か · lửa',
      '水': 'すい · nước',
      '木': 'もく · cây',
      '金': 'きん · vàng',
      '土': 'ど · đất',
      '曜': 'よう · ngày trong tuần',
      '朝': 'あさ · buổi sáng',
      '晩': 'ばん · buổi tối',
    }),
    NOTE('Lỗi hay mắc — "sai" ở buổi 6 (mất điểm khi đọc)', [
      '月曜日 đọc ~~つきようび~~ → **げつようび**. 五月 đọc ~~ごげつ~~ → **ごがつ** (tháng = がつ, thứ = げつ).',
      '水曜日 ~~みずようび~~ → **すいようび**; 金曜日 ~~かねようび~~ → **きんようび**; 木曜日 ~~きようび~~ → **もくようび** — thứ trong tuần đọc **on**.',
      '朝ご飯 ~~あさごはん~~ đúng; nhưng 朝 đứng một mình có thể đọc あさ; 毎朝 = **まい·あさ** (không phải ~~まいちょう~~).',
      '時 trong 時間 đọc **じ** (じかん), không đọc とき. 十分 có hai cách đọc: **じゅっぷん** (10 phút) và **じゅうぶん** (đủ, đầy đủ) — trong Bài 3 luôn là 10 phút.',
    ]),
    ASK([
      '(Reading) Cô chỉ vào **4 từ chữ Hán gạch chân** — thường là thứ/ngày/giờ: 月曜日・毎朝・九時・十分.',
      '(Talking) Cô có thể hỏi 「{今日|きょう}は{何曜日|なんようび}ですか。」 — trả lời bằng thứ, đọc đúng on-yomi.',
    ]),
  ],
};

/* ───────── Buổi 7 — Ôn Bài 3 và thi nói Lesson 3 ───────── */

const S_07: Lesson = {
  id: 's113-b3-07-on-bai-3-thi-noi-lesson-3',
  kind: 'review',
  title: 'Buổi 7 — Ôn Bài 3 và luyện thi nói Lesson 3: 10 dạng câu hỏi mẫu (theo khung lớp)',
  goal: 'Ôn lại ポイント 16–23 trong một trang, trả lời trôi chảy 10 dạng câu hỏi Lesson 3 của đề mẫu thi nói JPD113 và sửa các lỗi hay mất điểm.',
  minutes: 45,
  blocks: [
    HOW([
      NGUON,
      'Buổi cuối: **không học gì mới**, chỉ gom lại và nói. Đọc bảng tổng kết, rồi mở `lt-b3-noi-viet` và `on113-noi-mau` để thu âm từng câu.',
      'Với mỗi câu hỏi trong bảng 10 dạng, hãy **nói to một câu trả lời của chính bạn** (đừng đọc mẫu). Tự thu âm, nghe lại, hỏi: "Có はい／いいえ không? Có trợ từ đúng không? Có đọc đúng giờ không?"',
    ]),
    RECAP('Tổng ôn Bài 3 trong một phút', [
      '**Khung câu**: N は ［thời điểm］（に）［nơi］（へ／で）［vật］（を）V ます／ません — động từ luôn cuối.',
      '**Trợ từ**: へ (hướng) · を (vật) · に (mốc giờ/ngày) · で (nơi làm) · から〜まで (từ…đến) · や〜など (liệt kê) · も (cũng, học Bài 1).',
      '**Phủ định hoàn toàn**: 何も／どこへも + ません. **Đọc số**: 4・7・9 giờ; ぷん／ふん; ngày 1–10, 14, 20, 24.',
      '**Thi nói JPD113**: Reading 40 · Talking 55 · Presenting 5 (xem `on113-cau-truc`).',
    ]),
    { t: 'h', text: '10 dạng câu hỏi Lesson 3 của đề mẫu thi nói JPD113' },
    P('Mười dạng này lấy từ "Hướng dẫn ôn tập thi nói môn JPD113" (09/06/2025), mục Sample Questions — Lesson 3. Cột "Gợi ý trả lời" là câu mẫu của mình (viết mới), bạn thay bằng thông tin thật của bạn.'),
    TABLE(
      ['#', 'Câu hỏi giám thị', 'Gợi ý trả lời (thay bằng của bạn)'],
      [
        ['1', JR('〜 は {何時|なんじ} から {何時|なんじ} まで です か。'), JR('{図書館|としょかん} は {九時|くじ} から {五時|ごじ} まで です。')],
        ['2', JR('〜 は {何曜日|なんようび} から {何曜日|なんようび} まで です か。'), JR('{月曜日|げつようび} から {金曜日|きんようび} まで です。')],
        ['3', JR('〜 は いつ から いつ まで です か。'), JR('{夏休|なつやす}み は {七月|しちがつ} から {八月|はちがつ} まで です。')],
        ['4', JR('{図書館|としょかん} で {何|なに} を します か。'), JR('{本|ほん} を {読|よ}みます。 {勉強|べんきょう}も します。')],
        ['5', JR('〜 の {休|やす}み は {何曜日|なんようび} です か。 / いつ です か。'), JR('{休|やす}み は {日曜日|にちようび} です。')],
        ['6', JR('A さん は {休|やす}み の {日|ひ}、 {何|なに} を します か。'), JR('{海|うみ} へ {行|い}きます。 サッカー を します。')],
        ['7', JR('A さん は {毎朝|まいあさ}、 {何時|なんじ} に {食|た}べます か。'), JR('{七時|しちじ} に {朝|あさ}ご{飯|はん} を {食|た}べます。')],
        ['8', JR('A さん は {何|なに} を {買|か}います か。 / {見|み}ます か。 / {読|よ}みます か。 / {聞|き}きます か。'), JR('パン を {買|か}います。 テレビ を {見|み}ます。')],
        ['9', JR('A さん は {毎朝|まいあさ}、 パン を {食|た}べます か。 / {日本語|にほんご} を {勉強|べんきょう}します か。'), JR('はい、 {食|た}べます。')],
        ['10', JR('A さん は どこ へ {行|い}きます か。'), JR('{日曜日|にちようび}、 {公園|こうえん} へ {行|い}きます。')],
      ],
      'Đề mẫu Lesson 3 + gợi ý trả lời',
    ),
    NOTE('Quy tắc vàng khi trả lời (theo tiêu chí chấm của bản hướng dẫn 06/2025)', [
      'Trả lời **bằng câu đầy đủ** kết thúc です／ます. Trả lời cụt một từ dễ bị trừ điểm.',
      'Câu **Có/Không** (số 9): **bắt buộc はい／いいえ** — quên bị trừ tới 5 điểm.',
      '**Sai trợ từ trừ 2 điểm**; dùng sai từ vựng (ngữ pháp đúng) tối đa 3 điểm; lỗi làm hiểu sai cả câu mất toàn bộ điểm câu đó.',
      'Được xin giám thị **nhắc lại câu hỏi tối đa 2 lần** không trừ điểm: 「もう一度お願いします。」 (hoặc nói tiếng Việt cũng được).',
    ]),
    DLG('Mẫu hỏi–đáp liền mạch (thí sinh + giám thị)', [
      DX('Giám thị', 'examiner', '{図書館|としょかん} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Thư viện mở từ mấy giờ đến mấy giờ?'),
      DX('Thí sinh', 'candidate', '{九時|くじ} から {五時|ごじ} まで です。', 'Từ 9 giờ đến 5 giờ.'),
      DX('Giám thị', 'examiner', '{休|やす}み は {何曜日|なんようび} です か。', 'Nghỉ vào thứ mấy?'),
      DX('Thí sinh', 'candidate', '{日曜日|にちようび} です。', 'Chủ nhật.'),
      DX('Giám thị', 'examiner', '{毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', 'Sáng nào bạn cũng dậy lúc mấy giờ?'),
      DX('Thí sinh', 'candidate', '{六時半|ろくじはん} に {起|お}きます。', 'Tôi dậy lúc 6 giờ rưỡi.'),
      DX('Giám thị', 'examiner', '{休|やす}み の {日|ひ}、 {何|なに} を します か。', 'Ngày nghỉ bạn làm gì?'),
      DX('Thí sinh', 'candidate', '{海|うみ} へ {行|い}きます。 サッカー を します。', 'Tôi đi biển. Tôi chơi bóng đá.'),
    ]),
    SPEAK('s113-b3-07-noi', [
      'としょかんは なんじから なんじまでですか。',
      'まいあさ、なんじに おきますか。',
      'やすみの ひ、なにを しますか。',
      'あさ、なにを たべますか。',
      'にちようびは どこへ いきますか。',
    ]),
    { t: 'h', text: 'Bảng ôn ngữ pháp — kiểm tra nhanh' },
    MC('s113-b3-07-mcq', 'Ôn tổng hợp Bài 3 (10 câu)', [
      Q('{私|わたし}は {毎日|まいにち} {日本語|にほんご}（　）{勉強|べんきょう}します。', 'を', 'へ | で | に', 'Học cái gì → を (hoặc nói 日本語を勉強します).'),
      Q('{日曜日|にちようび}、{海|うみ}（　）{行|い}きます。', 'へ', 'を | で | が', 'Đích đến → へ.'),
      Q('{七時|しちじ}（　）{起|お}きます。', 'に', 'で | を | へ', 'Mốc giờ → に.'),
      Q('{図書館|としょかん}（　）{勉強|べんきょう}します。', 'で', 'に | へ | を', 'Nơi làm việc → で.'),
      Q('{銀行|ぎんこう}は {月曜日|げつようび}（　）{金曜日|きんようび}（　）です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ … đến …'),
      Q('{朝|あさ}、パン（　）{果物|くだもの}などを{食|た}べます。', 'や', 'が | に | へ', 'や + など.'),
      Q('{夜|よる}、{何|なに}（　）{食|た}べません。', 'も', 'を | が | で', '何も + ません.'),
      Q('4 giờ đọc là…', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = よじ.'),
      Q('Ngày 20 tháng 7 đọc là…', 'しちがつ はつか', 'ななつき にじゅうにち | しちがつ にじゅうにち | しちがつ ふつか', '7月 = しちがつ; 20日 = はつか.'),
      Q('Trả lời câu 「{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}みますか」 (không uống):', 'いいえ、{飲|の}みません。', 'いいえ、そうじゃありません。 | はい、{飲|の}みません。 | いいえ、{飲|の}みます。', 'Trả lời bằng động từ phủ định.'),
    ]),
    NOTE('Lỗi hay mắc — "sai" toàn Bài 3 (chốt lại)', [
      'Đọc giờ: ~~よんじ~~ ~~きゅうじ~~; phút: ~~じゅうぷん~~ ~~ろくぷん~~. Ngày: ~~にじゅうにち~~ cho 20.',
      'Trợ từ: へ↔で (đích ↔ nơi làm), に↔で (mốc giờ ↔ nơi), を↔へ (vật ↔ hướng). Đọc へ là e, を là o, は là wa.',
      'Thêm に vào 毎朝・毎晩・朝・夜; dùng 何もを; dùng 何も với khẳng định.',
      'Quên はい／いいえ; trả lời cụt; im lặng quá 5 giây.',
    ]),
    ASK([
      'Cô thường hỏi **1 trong 10 dạng** bảng trên, rồi hỏi tiếp một câu ngắn về chính bạn (「A さんは…」 là bạn).',
      'Có thể xen câu của Bài 1–2 (「お{国|くに}はどちらですか」「これはいくらですか」) — xem `on113-ngu-phap-tu-vung`.',
    ]),
  ],
};


/* ═══════════════════════════════════════════════════════════════════
 *        PHẦN B — LUYỆN THÊM BÀI 3 (LT_B3)
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────── 0. LỘ TRÌNH ───────── */

const L_LO_TRINH: Lesson = {
  id: 'lt-b3-lo-trinh',
  kind: 'review',
  title: 'Luyện thêm Bài 3 — đọc trước: lộ trình 7 ngày, cách dùng, kiểm tra đầu vào',
  goal: 'Biết bộ luyện Bài 3 (スケジュール) gồm những gì, học theo thứ tự nào, và biết mình đang yếu kỹ năng nào để luyện đúng chỗ.',
  minutes: 15,
  blocks: [
    HOW([
      'Bộ này dành cho bạn **học lại từ đầu**: mỗi lesson đi từ 🟢 **Dễ** (nhận mặt) → 🟡 **Vừa** (dùng trong câu) → 🔴 **Khó** (trộn nhiều điểm như đề thi).',
      'Làm **đủ cả ba mức** theo thứ tự. Nhảy thẳng lên mức Khó khi chưa vững mức Dễ là cách chắc chắn nhất để nản.',
      'Câu nào sai: đọc phần giải thích (why) **rồi làm lại đúng câu đó**. Sai ba lần cùng một chỗ thì quay lại buổi học tương ứng trong `s113-b3-…`.',
      'Mọi câu tiếng Nhật đều có romaji và nghĩa. Bật furigana khi mới học; **tắt furigana khi làm mức Khó** để quen với đề không furigana.',
    ]),
    RECAP('Đọc 1 phút trước khi luyện', [
      'Bài 3 = **スケジュール**: giờ giấc, thứ–tháng–ngày, 14 động từ ます, sáu trợ từ (へ・を・に・で・から〜まで・や〜など) và 何も／どこへも.',
      'Thi nói JPD113 hỏi trực tiếp **Lesson 3** (10 dạng câu hỏi mẫu); phần Reading hay có thứ/giờ bằng chữ Hán không furigana.',
      'Điểm dễ nhất: **đọc giờ & ngày** (4・7・9 giờ; ngày 1–10, 14, 20, 24) và **trợ từ**. Mỗi chỗ đúng là một điểm chắc.',
    ]),
    { t: 'h', text: 'Bài 3 gồm những kỹ năng nào?' },
    TABLE(
      ['Thứ tự', 'Lesson', 'Luyện gì', 'Ra trong đề thi nào'],
      [
        ['1', '`lt-b3-tu-vung`', '80 từ của cô: nhận mặt → điền câu → gõ từ', 'Đọc hiểu, nghe, tự trả lời thi nói'],
        ['2', '`lt-b3-chu-han`', '11 chữ Hán lớp: 時 分 月 火 水 木 金 土 曜 朝 晩', 'Reading — 4 từ chữ Hán không furigana (12 điểm)'],
        ['3', '`lt-b3-ngu-phap-gio-ngay`', 'Đọc giờ, phút, thứ, tháng, ngày', 'Mọi phần (câu nào cũng có giờ/ngày)'],
        ['4–6', '`lt-b3-ngu-phap-1/2/3`', 'ポイント 16–23, từng nhóm một', 'Trợ từ · chọn đáp án · tự nói'],
        ['7', '`lt-b3-ngu-phap-tron`', 'Trộn tất cả ポイント: sửa câu sai, dịch hai chiều', 'Thi nói + bài viết'],
        ['8', '`lt-b3-hoi-thoai`', '6 hội thoại mới: hiểu, điền, sắp lượt, tự nói', 'Thi nói Q&A'],
        ['9', '`lt-b3-doc-hieu`', '6 đoạn đọc ngắn → dài', 'Reading đọc to (100–110 ký tự)'],
        ['10', '`lt-b3-nghe`', '10 đoạn nghe: chậm → bẫy (đổi ý, tự sửa giờ)', 'Nghe hiểu / nghe điền'],
        ['11', '`lt-b3-noi-viet`', 'Câu hỏi thi nói kiểu cô + bài viết 3–5 câu', 'Thi nói (Talking 55 điểm)'],
        ['12', '`lt-b3-de-tong-hop`', 'Đề đủ phần, có giờ + thang điểm tự chấm', 'Giả lập bài kiểm tra'],
      ],
    ),
    { t: 'h', text: 'Lịch gợi ý 7 ngày (mỗi ngày 45–60 phút)' },
    TABLE(
      ['Ngày', 'Làm'],
      [
        ['1', 'Từ vựng (cả ba mức) + đọc giờ/ngày mức Dễ'],
        ['2', 'Đọc giờ/ngày mức Vừa–Khó + chữ Hán mức Dễ–Vừa'],
        ['3', 'Ngữ pháp 1 (ポイント 16–18) + nghe 1–4'],
        ['4', 'Ngữ pháp 2 (ポイント 19–20) + hội thoại 1–3'],
        ['5', 'Ngữ pháp 3 (ポイント 21–23) + trộn + đọc hiểu 1–4 + nghe 5–10'],
        ['6', 'Hội thoại 4–6 + nói & viết (thu âm, đọc to)'],
        ['7', 'Đề tổng hợp trong 60 phút, không nhìn đáp án; chấm điểm; luyện lại phần dưới 70%'],
      ],
    ),
    NOTE('Mẹo học: thứ tự ưu tiên khi sắp thi', [
      'Điểm dễ nhất: **trợ từ** (へ・を・に・で・から・まで・や・も) và **từ để hỏi** (何時・何曜日・いつ・どこ・何).',
      'Điểm hay mất nhất: **4・7・9 giờ**, **ぷん／ふん**, **ngày bất quy tắc**, và nhầm **へ ↔ で ↔ に**.',
      'Thi nói: học thuộc **khung** câu trả lời rồi thay từ. Nói câu **đúng** và liền mạch, đừng cố nói dài.',
    ]),
    MC('lt-b3-lt-vao', 'Kiểm tra đầu vào (12 câu, 8 phút) — sai nhóm nào thì ưu tiên luyện nhóm đó', [
      Q('Từ vựng — 「{午後|ごご}」 nghĩa là gì?', 'Buổi chiều (PM)', 'Buổi sáng (AM) | Buổi trưa | Buổi tối muộn', '午前 = AM; 午後 = PM.'),
      Q('Từ vựng — Từ nào chỉ **bưu điện**?', '{郵便局|ゆうびんきょく}', '{銀行|ぎんこう} | {病院|びょういん} | {図書館|としょかん}', '郵便局 = bưu điện; 銀行 = ngân hàng; 病院 = bệnh viện; 図書館 = thư viện.'),
      Q('Đọc giờ — 4 giờ là…', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = よじ.'),
      Q('Đọc phút — 10 phút là…', 'じゅっぷん', 'じゅうふん | じっふん | じゅうぷん', '10 phút = じゅっぷん.'),
      Q('Đọc ngày — ngày 20 là…', 'はつか', 'にじゅうにち | ふたじゅうか | にじゅっか', '20日 = はつか.'),
      Q('Chữ Hán — 「{火曜日|かようび}」 là thứ mấy?', 'Thứ Ba', 'Thứ Hai | Thứ Tư | Thứ Năm', '火 = lửa → thứ Ba.'),
      Q('Trợ từ — {図書館|としょかん}＿＿ {勉強|べんきょう}します。', 'で', 'へ | を | が', 'Nơi làm việc → で.'),
      Q('Trợ từ — {毎朝|まいあさ}、{七時|しちじ}＿＿ {起|お}きます。', 'に', 'で | を | へ', 'Mốc giờ → に.'),
      Q('Trợ từ — {日曜日|にちようび}、{公園|こうえん}＿＿ {行|い}きます。', 'へ', 'を | で | の', 'Đi đâu → へ.'),
      Q('から・まで — 「Ngân hàng làm từ 9 giờ đến 3 giờ」', '{銀行|ぎんこう}は {九時|くじ}から {三時|さんじ}までです。', '{銀行|ぎんこう}は {九時|くじ}まで {三時|さんじ}からです。 | {銀行|ぎんこう}は {九時|くじ}に {三時|さんじ}までです。 | {銀行|ぎんこう}を {九時|くじ}から {三時|さんじ}へです。', 'từ = から; đến = まで.'),
      Q('や・など — 「Tôi ăn bánh mì, hoa quả, v.v.」', 'パンや{果物|くだもの}などを{食|た}べます。', 'パンと{果物|くだもの}などを{食|た}べます。 | パンや{果物|くだもの}をなどを{食|た}べます。 | パンが{果物|くだもの}などを{食|た}べます。', 'や + など + を.'),
      Q('{何|なに}も — 「Buổi sáng tôi không ăn gì cả」', '{朝|あさ}、{何|なに}も{食|た}べません。', '{朝|あさ}、{何|なに}を{食|た}べません。 | {朝|あさ}、{何|なに}も{食|た}べます。 | {朝|あさ}、どこへも{食|た}べません。', '何も + ません.'),
    ]),
    NOTE('Chấm điểm đầu vào', [
      '10–12 đúng: bạn khá vững → làm thẳng mức Vừa–Khó, dành nhiều thời gian cho nghe/nói.',
      '6–9 đúng: làm từ mức Dễ của lesson bạn sai.',
      'Dưới 6: làm lần lượt từ lesson 1; mỗi ngày không quá 2 lesson.',
    ]),
  ],
};

/* ───────── 1. TỪ VỰNG ───────── */

const L_TU_VUNG: Lesson = {
  id: 'lt-b3-tu-vung',
  kind: 'vocab',
  title: 'Luyện thêm Bài 3 — Từ vựng: nhận mặt → điền câu → gõ từ (đủ 80 từ của cô, 118 câu)',
  goal: 'Nhận ra và dùng đúng 80 từ trong danh sách "Từ mới bài 3" của cô — từ nhìn mặt chữ đến tự gõ từ khi chỉ có nghĩa tiếng Việt.',
  minutes: 60,
  blocks: [
    HOW([
      'Làm 🟢 Dễ bằng cách **nhìn chữ, nói to cách đọc, rồi mới chọn nghĩa**. Đừng đoán — nói ra miệng mới nhớ.',
      '🟡 Vừa: mỗi từ phải nằm trong câu. Đề thi luôn cho từ trong câu, ít khi cho từ đơn lẻ.',
      '🔴 Khó: tự gõ từ khi chỉ có nghĩa Việt; từ gõ sai thì viết lại 3 lần bằng tay.',
      'Lỗi hay mắc: nhầm **来ます (2 chữ き・ます) ↔ 聞きます (3 chữ)**; **朝 (buổi) ↔ 朝ご飯 (bữa)**; **昼 ↔ 昼ごはん**; **午前 ↔ 午後**; **何** (なに／なん) và **何も**.',
    ]),
    TABLE(
      ['Nhóm', 'Số từ', 'Ví dụ'],
      [
        ['A. Thời gian', '15', '今・午前・午後・昼・時間・〜時・〜分・〜時半・〜曜日・朝・夜・毎日・毎朝・毎晩・1年'],
        ['B. Nơi chốn', '11', '銀行・体育館・図書館・病院・郵便局・海・公園・家（うち）・会社・学校・コンビニ'],
        ['C. Trường học & lịch', '6', '授業・テスト・休み・スケジュール・アルバイト・留学生'],
        ['D. Sự kiện, mùa', '14', 'スキー・パーティー・バーベキュー・花火・お花見・ホームステイ・お祭り・桜・バス・春夏秋冬・ゴールデンウイーク'],
        ['E. Ăn uống & giải trí', '14', 'お酒・おすし・お弁当・朝ご飯・昼ごはん・牛乳・果物・サラダ・チーズ・インターネット・新聞・テレビ・CD・DVD'],
        ['F. Từ hỏi / phủ định', '3', '何・何も・どこ（へ）も'],
        ['G. 14 động từ', '14', '行く・帰る・飲む・食べる・見る・する・買う・聞く・働く・読む・起きる・寝る・勉強する・来る'],
        ['H. Cảm thán', '3', 'いいですね・えっ・へえ'],
      ],
      '80 từ = 15 + 11 + 6 + 14 + 14 + 3 + 14 + 3',
    ),

    H(`${LV.de} — A. Nhìn từ, chọn nghĩa (16 câu)`),
    MC('lt-b3-tv-nhan-mat', 'A. Nhận mặt từ: chọn nghĩa đúng', [
      Q('{今|いま}', 'Bây giờ', 'Hôm qua | Mỗi ngày | Buổi sáng', '今 = いま = bây giờ.'),
      Q('{午前|ごぜん}', 'Buổi sáng (AM)', 'Buổi chiều (PM) | Buổi trưa | Buổi tối', '午前 = trước 12 giờ trưa; 午後 = sau 12 giờ.'),
      Q('{午後|ごご}', 'Buổi chiều (PM)', 'Buổi sáng (AM) | Nửa đêm | Mỗi chiều', '午後 = ごご.'),
      Q('{昼|ひる}', 'Buổi trưa, ban ngày', 'Buổi tối | Buổi sáng | Cả đêm', '昼 = ひる.'),
      Q('{時間|じかん}', 'Thời gian, giờ giấc', 'Thứ trong tuần | Ngày nghỉ | Bài kiểm tra', '時間 = じかん.'),
      Q('{毎朝|まいあさ}', 'Mỗi sáng', 'Mỗi tối | Mỗi ngày | Mỗi tuần', '毎朝 = まい + あさ.'),
      Q('{毎晩|まいばん}', 'Mỗi tối', 'Mỗi sáng | Mỗi ngày | Mỗi năm', '毎晩 = まいばん.'),
      Q('{銀行|ぎんこう}', 'Ngân hàng', 'Bưu điện | Bệnh viện | Thư viện', '銀行 = ぎんこう.'),
      Q('{体育館|たいいくかん}', 'Nhà thi đấu, nhà tập', 'Thư viện | Công viên | Trường học', '体育館 = たいいくかん.'),
      Q('{図書館|としょかん}', 'Thư viện', 'Nhà thi đấu | Ngân hàng | Công ty', '図書館 = としょかん.'),
      Q('{病院|びょういん}', 'Bệnh viện', 'Thư viện | Bưu điện | Cửa hàng', '病院 = びょういん.'),
      Q('{郵便局|ゆうびんきょく}', 'Bưu điện', 'Ngân hàng | Bệnh viện | Công viên', '郵便局 = ゆうびんきょく.'),
      Q('{授業|じゅぎょう}', 'Giờ học, tiết học', 'Bài kiểm tra | Ngày nghỉ | Việc làm thêm', '授業 = じゅぎょう.'),
      Q('{留学生|りゅうがくせい}', 'Du học sinh', 'Giáo viên | Nhân viên công ty | Học sinh tiểu học', '留学生 = りゅうがくせい.'),
      Q('お{祭|まつ}り', 'Lễ hội', 'Bữa tiệc | Pháo hoa | Ngắm hoa', 'お祭り = おまつり.'),
      Q('{花火|はなび}', 'Pháo hoa', 'Hoa anh đào | Lễ hội | Biển', '花火 = はなび = "hoa" + "lửa".'),
    ]),

    H(`${LV.de} — B. Nghe nghĩa Việt, chọn từ (16 câu)`),
    MC('lt-b3-tv-nghia-tu', 'B. Từ nghĩa Việt chọn từ Nhật', [
      Q('Trường học', '{学校|がっこう}', '{会社|かいしゃ} | {病院|びょういん} | {公園|こうえん}', '学校 = がっこう.'),
      Q('Công ty', '{会社|かいしゃ}', '{学校|がっこう} | {銀行|ぎんこう} | {体育館|たいいくかん}', '会社 = かいしゃ.'),
      Q('Cửa hàng tiện lợi', 'コンビニ', 'スーパー | レストラン | ホテル', 'コンビニ = konbini.'),
      Q('Biển', '{海|うみ}', '{川|かわ} | {山|やま} | {公園|こうえん}', '海 = うみ.'),
      Q('Công viên', '{公園|こうえん}', '{海|うみ} | {学校|がっこう} | {図書館|としょかん}', '公園 = こうえん.'),
      Q('Hoa anh đào', '{桜|さくら}', '{花火|はなび} | お{祭|まつ}り | お{花見|はなみ}', '桜 = さくら (hoa); お花見 = hoạt động ngắm hoa.'),
      Q('Xe buýt', 'バス', 'タクシー | ビル | チーズ', 'バス = basu.'),
      Q('Mùa xuân', '{春|はる}', '{夏|なつ} | {秋|あき} | {冬|ふゆ}', '春 = はる.'),
      Q('Mùa thu', '{秋|あき}', '{春|はる} | {夏|なつ} | {冬|ふゆ}', '秋 = あき.'),
      Q('Mùa đông', '{冬|ふゆ}', '{春|はる} | {夏|なつ} | {秋|あき}', '冬 = ふゆ.'),
      Q('Sữa bò', '{牛乳|ぎゅうにゅう}', '{果物|くだもの} | チーズ | お{酒|さけ}', '牛乳 = ぎゅうにゅう.'),
      Q('Hoa quả', '{果物|くだもの}', '{牛乳|ぎゅうにゅう} | サラダ | パン', '果物 = くだもの.'),
      Q('Tờ báo', '{新聞|しんぶん}', 'テレビ | CD | DVD', '新聞 = しんぶん.'),
      Q('Cơm hộp', 'お{弁当|べんとう}', 'おすし | サラダ | お{酒|さけ}', 'お弁当 = おべんとう.'),
      Q('Bữa sáng', '{朝|あさ}ご{飯|はん}', '{昼|ひる}ごはん | {朝|あさ} | {毎朝|まいあさ}', '朝ご飯 = あさごはん (bữa); 朝 = buổi.'),
      Q('Việc làm thêm', 'アルバイト', 'テスト | パーティー | スケジュール', 'アルバイト = arubaito.'),
    ]),

    H(`${LV.de} — C. Đọc từ chữ Hán (14 câu)`),
    MC('lt-b3-tv-doc', 'C. Chữ Hán → cách đọc', [
      Q('「{夏|なつ}」 đọc là…', 'なつ', 'あき | ふゆ | はる', '夏 = なつ (mùa hè).'),
      Q('「{秋|あき}」 đọc là…', 'あき', 'なつ | ふゆ | はる', '秋 = あき.'),
      Q('「{冬|ふゆ}」 đọc là…', 'ふゆ', 'なつ | あき | はる', '冬 = ふゆ.'),
      Q('「{果物|くだもの}」 đọc là…', 'くだもの', 'かぶつ | かもの | くだぶつ', '果物 = くだもの.'),
      Q('「{牛乳|ぎゅうにゅう}」 đọc là…', 'ぎゅうにゅう', 'うしちち | ぎゅうにゅ | ぎゅうにゆう', '牛乳 = ぎゅうにゅう.'),
      Q('「{新聞|しんぶん}」 đọc là…', 'しんぶん', 'しんもん | しんぶ | しんぷん', '新聞 = しんぶん.'),
      Q('「{授業|じゅぎょう}」 đọc là…', 'じゅぎょう', 'じゅうぎょう | しゅぎょう | じゅげょう', '授業 = じゅぎょう.'),
      Q('「{郵便局|ゆうびんきょく}」 đọc là…', 'ゆうびんきょく', 'ゆうびんぎょく | ゆびんきょく | ゆうべんきょく', '郵便局 = ゆうびんきょく.'),
      Q('「{体育館|たいいくかん}」 đọc là…', 'たいいくかん', 'たいくかん | たいいくがん | てえいくかん', '体育館 = たいいくかん.'),
      Q('「{留学生|りゅうがくせい}」 đọc là…', 'りゅうがくせい', 'りゅがくせい | りゅうかくせい | るうがくせい', '留学生 = りゅうがくせい.'),
      Q('「{花火|はなび}」 đọc là…', 'はなび', 'はなひ | はなか | かび', '花火 = はなび (火 đọc び, đục hoá).'),
      Q('「お{花見|はなみ}」 đọc là…', 'おはなみ', 'おはなび | おばなみ | おはなげん', '花見 = はなみ.'),
      Q('「{毎晩|まいばん}」 đọc là…', 'まいばん', 'まいよる | まいあさ | まいにち', '毎晩 = まいばん.'),
      Q('「{家|うち}」 trong bài 3 đọc là…', 'うち', 'いえ | か | や', '家 = うち (nhà mình): うちへ帰ります.'),
    ]),

    H(`${LV.vua} — D. Điền từ vào câu (16 câu)`),
    MC('lt-b3-tv-dien', 'D. Chọn từ hợp nghĩa nhất', [
      Q('＿＿＿の {休|やす}みは {日曜日|にちようび}です。', '{図書館|としょかん}', 'スキー | バーベキュー | パーティー', 'Chỗ có ngày nghỉ là một nơi chốn → 図書館 (thư viện nghỉ Chủ nhật).'),
      Q('{朝|あさ}ご{飯|はん}に パンと＿＿＿を {食|た}べます。', '{果物|くだもの}', '{新聞|しんぶん} | DVD | {花火|はなび}', 'Ăn → 果物 (hoa quả).'),
      Q('{毎朝|まいあさ}＿＿＿を {読|よ}みます。', '{新聞|しんぶん}', '{牛乳|ぎゅうにゅう} | {果物|くだもの} | サラダ', 'Đọc → 新聞.'),
      Q('{夜|よる}、 うちで ＿＿＿を {見|み}ます。', 'テレビ', 'お{弁当|べんとう} | {牛乳|ぎゅうにゅう} | {海|うみ}', 'Xem → テレビ.'),
      Q('{冬|ふゆ}は ＿＿＿を します。', 'スキー', 'バーベキュー | {花火|はなび} | お{花見|はなみ}', 'Mùa đông → trượt tuyết.'),
      Q('{春|はる}、 {公園|こうえん}で ＿＿＿を {見|み}ます。', '{桜|さくら}', '{雪|ゆき} | {花火|はなび} | {新聞|しんぶん}', 'Mùa xuân → hoa anh đào.'),
      Q('{夏|なつ}、 {夜|よる}に ＿＿＿を {見|み}ます。', '{花火|はなび}', '{桜|さくら} | スキー | {牛乳|ぎゅうにゅう}', 'Mùa hè → pháo hoa.'),
      Q('＿＿＿は {月曜日|げつようび}です。 (bài kiểm tra)', 'テスト', 'パーティー | バス | お{酒|さけ}', 'テスト = bài kiểm tra.'),
      Q('{夏|なつ}の ＿＿＿は {八月|はちがつ}です。 (kỳ nghỉ)', '{休|やす}み', 'テスト | アルバイト | {授業|じゅぎょう}', '夏の休み (夏休み) = kỳ nghỉ hè.'),
      Q('{土曜日|どようび}、 コンビニで ＿＿＿を します。', 'アルバイト', 'ホームステイ | スキー | バーベキュー', 'アルバイトをします = làm thêm.'),
      Q('{北海道|ほっかいどう}で ＿＿＿を します。 (ở cùng gia đình Nhật)', 'ホームステイ', 'アルバイト | テスト | {授業|じゅぎょう}', 'ホームステイをします.'),
      Q('{銀行|ぎんこう}は ＿＿＿から {三時|さんじ}までです。', '{九時|くじ}', '{九分|きゅうふん} | {九日|ここのか} | {九月|くがつ}', 'Giờ mở cửa: 九時から三時まで (cùng đơn vị giờ).'),
      Q('{学校|がっこう}の ＿＿＿は {九時|くじ}からです。', '{授業|じゅぎょう}', '{留学生|りゅうがくせい} | {牛乳|ぎゅうにゅう} | {海|うみ}', 'Giờ học → 授業.'),
      Q('ゴールデンウイークは ＿＿＿の {休|やす}みです。', '{春|はる}', '{冬|ふゆ} | {秋|あき} | {夜|よる}', 'GW cuối tháng 4 – đầu tháng 5 (mùa xuân).'),
      Q('A：{夏休|なつやす}み、 {北海道|ほっかいどう}へ {行|い}きます。 B：＿＿＿ね。', 'いいです', 'ありません | えっ | へえ', 'Khen kế hoạch: いいですね.'),
      Q('A：{毎晩|まいばん}、 {二時|にじ}に {寝|ね}ます。 B：＿＿＿、 そうですか。', 'えっ', 'いいです | はい | あの', 'Bất ngờ: えっ.'),
    ]),

    H(`${LV.vua} — E. Gõ hiragana cho từ chữ Hán (12 câu)`),
    QZ('lt-b3-tv-go', 'E. Viết cách đọc bằng hiragana', 'fill', [
      A('午前 → ?', 'ごぜん'),
      A('午後 → ?', 'ごご'),
      A('時間 → ?', 'じかん'),
      A('銀行 → ?', 'ぎんこう'),
      A('図書館 → ?', 'としょかん'),
      A('病院 → ?', 'びょういん'),
      A('学校 → ?', 'がっこう'),
      A('会社 → ?', 'かいしゃ'),
      A('公園 → ?', 'こうえん'),
      A('朝ご飯 → ?', 'あさごはん'),
      A('桜 → ?', 'さくら'),
      A('春 → ?', 'はる'),
    ]),

    H(`${LV.vua} — F. 14 động từ: dạng ません và nhóm (12 câu)`),
    MC('lt-b3-tv-dongtu', 'F. Động từ', [
      Q('{行|い}きます → phủ định', '{行|い}きません', '{行|い}かません | {行|い}きないです | {行|い}くません', 'ます → ません.'),
      Q('{食|た}べます → phủ định', '{食|た}べません', '{食|た}べないです | {食|た}びません | {食|た}べくません', 'ます → ません.'),
      Q('します → phủ định', 'しません', 'しないです | せません | しくません', 'します → しません.'),
      Q('{来|き}ます → phủ định', '{来|き}ません', '{来|こ}ません | {来|き}ないです | {来|く}ません', '来ます → 来ません (き).'),
      Q('「{帰|かえ}ります」 nghĩa là…', 'Về', 'Đi | Đến | Mua', '帰る = về.'),
      Q('「{買|か}います」 nghĩa là…', 'Mua', 'Bán | Đọc | Nghe', '買う = mua.'),
      Q('「{聞|き}きます」 nghĩa là…', 'Nghe', 'Đến | Đọc | Xem', '聞く = nghe (cũng là hỏi).'),
      Q('「{働|はたら}きます」 nghĩa là…', 'Làm việc', 'Học | Ngủ | Chơi', '働く = làm việc.'),
      Q('Động từ nhóm 3 là…', 'します', '{食|た}べます | {読|よ}みます | {起|お}きます', 'します, 来ます, N+します là nhóm 3.'),
      Q('Động từ nhóm 1 là…', '{飲|の}みます', '{食|た}べます | {見|み}ます | {寝|ね}ます', '飲む nhóm 1.'),
      Q('「{起|お}きます」 là gì?', 'Thức dậy', 'Đi ngủ | Đọc | Về', '起きる = thức dậy; 寝る = ngủ.'),
      Q('「{勉強|べんきょう}します」 phủ định là…', '{勉強|べんきょう}しません', '{勉強|べんきょう}ません | {勉強|べんきょう}しないです | {勉強|べんきょう}くません', 'N + しません.'),
    ]),

    H(`${LV.kho} — G. Tự gõ từ từ nghĩa Việt (12 câu)`),
    QZ('lt-b3-tv-go-tu', 'G. Gõ từ tiếng Nhật (hiragana hoặc chữ Hán)', 'translate', [
      A('Bưu điện', '{郵便局|ゆうびんきょく}'),
      A('Thư viện', '{図書館|としょかん}'),
      A('Ngân hàng', '{銀行|ぎんこう}'),
      A('Bệnh viện', '{病院|びょういん}'),
      A('Mỗi sáng', '{毎朝|まいあさ}'),
      A('Mỗi tối', '{毎晩|まいばん}'),
      A('Nhà (nhà mình)', ['うち', '{家|うち}']),
      A('Du học sinh', '{留学生|りゅうがくせい}'),
      A('Hoa quả', '{果物|くだもの}'),
      A('Sữa bò', '{牛乳|ぎゅうにゅう}'),
      A('Pháo hoa', '{花火|はなび}'),
      A('Bữa trưa (ăn trưa)', ['{昼|ひる}ごはん', '{昼|ひる}ご{飯|はん}']),
    ]),

    H(`${LV.kho} — H. Cặp dễ nhầm và khác loại (10 câu)`),
    MC('lt-b3-tv-nham', 'H. Phân biệt', [
      Q('Từ nào KHÁC LOẠI? {銀行|ぎんこう} / {郵便局|ゆうびんきょく} / {牛乳|ぎゅうにゅう} / {病院|びょういん}', '{牛乳|ぎゅうにゅう}', '{銀行|ぎんこう} | {郵便局|ゆうびんきょく} | {病院|びょういん}', '3 từ kia là nơi chốn.'),
      Q('Từ nào KHÁC LOẠI? {春|はる} / {夏|なつ} / {秋|あき} / {海|うみ}', '{海|うみ}', '{春|はる} | {夏|なつ} | {秋|あき}', '3 từ kia là mùa.'),
      Q('Từ nào KHÁC LOẠI? パン / チーズ / サラダ / テレビ', 'テレビ', 'パン | チーズ | サラダ', '3 từ kia là đồ ăn.'),
      Q('Từ nào KHÁC LOẠI? {新聞|しんぶん} / テレビ / CD / お{酒|さけ}', 'お{酒|さけ}', '{新聞|しんぶん} | テレビ | CD', '3 từ kia là đồ để đọc/xem/nghe; お酒 là đồ uống.'),
      Q('「{朝|あさ}」 và 「{朝|あさ}ご{飯|はん}」 khác nhau ở…', '{朝|あさ} = buổi sáng; {朝|あさ}ご{飯|はん} = bữa sáng', '{朝|あさ} = buổi tối; {朝|あさ}ご{飯|はん} = bữa trưa | Hai từ giống hệt | {朝|あさ}ご{飯|はん} = ngày hôm qua', '朝ご飯 = bữa sáng (ăn).'),
      Q('「ききます」 (nghe) viết bằng chữ Hán là…', '{聞|き}きます', '{来|き}ます | {起|お}きます | {行|い}きます', '聞きます = ききます (kikimasu, nghe); 来ます chỉ đọc きます (kimasu, đến).'),
      Q('「{昼|ひる}」 và 「{昼|ひる}ごはん」 — "ăn trưa" nói là…', '{昼|ひる}ごはんを{食|た}べます', '{昼|ひる}を{食|た}べます | {昼|ひる}の{食|た}べます | {昼|ひる}ごはんを{見|み}ます', 'Bữa trưa = 昼ごはん; đi với 食べます.'),
      Q('「何」 trước 「を」 đọc là…', 'なに', 'なん | か | なの', '何を = なにを.'),
      Q('「何」 trong 「何時」 đọc là…', 'なん', 'なに | か | なの', '何時 = なんじ.'),
      Q('「どこ（へ）も」 đi với…', 'Động từ phủ định', 'Động từ khẳng định | Danh từ | Tính từ い', 'どこへも + ません.'),
    ]),

    H(`${LV.kho} — I. Từ trong ngữ cảnh: chọn nghĩa của cả câu (10 câu)`),
    MC('lt-b3-tv-cau', 'I. Hiểu nghĩa câu', [
      Q('「{冬休|ふゆやす}み、 {北海道|ほっかいどう}でスキーをします。」 Câu này nói gì?', 'Nghỉ đông tôi trượt tuyết ở Hokkaido', 'Nghỉ đông tôi ở nhà | Tôi mua đồ trượt tuyết | Nghỉ đông tôi đi biển', 'スキーをします = trượt tuyết (ở 北海道).'),
      Q('「{毎晩|まいばん}、 インターネットをします。」', 'Tối nào tôi cũng lên mạng', 'Mỗi sáng tôi đọc báo | Tối nay tôi xem DVD | Tôi không dùng mạng', 'インターネットをします = lên mạng.'),
      Q('「ゴールデンウイーク、 バーベキューをします。」', 'Tuần lễ Vàng tôi nướng BBQ', 'Tuần lễ Vàng tôi đi làm | Mùa xuân tôi đi ngủ sớm | Tôi mua BBQ', 'バーベキューをします.'),
      Q('「{銀行|ぎんこう}の {時間|じかん}は {九時|くじ}から {三時|さんじ}までです。」', 'Ngân hàng làm việc từ 9 đến 3 giờ', 'Ngân hàng đóng cửa lúc 9 giờ | Ngân hàng mở 3 giờ | Ngân hàng nghỉ vào thứ ba', '時間 = giờ làm việc.'),
      Q('「{留学生|りゅうがくせい}パーティーは {六月|ろくがつ}です。」', 'Tiệc du học sinh vào tháng 6', 'Lễ hội mùa hè tháng 6 | Bài kiểm tra tháng 6 | Du học sinh về nước tháng 6', 'パーティー = tiệc.'),
      Q('「{朝|あさ}、 {何|なに}も {食|た}べません。」', 'Buổi sáng tôi không ăn gì', 'Buổi sáng tôi ăn nhiều | Tôi không ăn tối | Tôi chỉ uống', '何も + ません.'),
      Q('「{日曜日|にちようび}は どこへも {行|い}きません。」', 'Chủ nhật tôi không đi đâu cả', 'Chủ nhật tôi đi nhiều nơi | Chủ nhật tôi ở trường | Tôi đi mọi nơi', 'どこへも + ません.'),
      Q('「お{弁当|べんとう}や サラダなどを {買|か}います。」', 'Tôi mua cơm hộp, salad…', 'Tôi bán cơm hộp | Tôi chỉ mua salad | Tôi nấu cơm', 'や…など + 買います.'),
      Q('「{春|はる}の {休|やす}みは {三月|さんがつ}です。」', 'Nghỉ xuân vào tháng 3', 'Nghỉ hè vào tháng 3 | Tháng 3 trời rét | Tháng 3 có lễ hội', '春休み = nghỉ xuân.'),
      Q('「{一年|いちねん}の スケジュール」 là…', 'Lịch cả năm', 'Lịch hằng tuần | Lịch hôm nay | Lịch thi', '1年 = một năm.'),
    ]),
  ],
};

/* ───────── 2. CHỮ HÁN ───────── */

const L_CHU_HAN: Lesson = {
  id: 'lt-b3-chu-han',
  kind: 'kanji',
  title: 'Luyện thêm Bài 3 — Chữ Hán của lớp: 時 分 月 火 水 木 金 土 曜 朝 晩 (đọc, nghĩa, chọn chữ, đọc câu)',
  goal: 'Đọc đúng, hiểu nghĩa và nhận mặt 11 chữ Hán Bài 3 trong từ ghép và trong câu KHÔNG có furigana, như phần Reading của đề thi.',
  minutes: 45,
  blocks: [
    HOW([
      'Học chữ Hán **theo từ**: 月曜日 = げつようび, 毎朝 = まいあさ. Đừng cố thuộc âm từng chữ rời.',
      'Mức 🟢 Dễ chỉ hỏi **từ ghép quen**; 🟡 Vừa bắt đầu có **chữ nhiễu** (chữ na ná) và **một chữ nhiều cách đọc**; 🔴 Khó đọc **câu không furigana**.',
      'Danh sách 11 chữ lấy từ `hanLop.ts` (Bài 3) — là danh sách **dự kiến** của web, chưa phải ảnh slide chữ Hán của cô JPD113.',
      'Lỗi hay mắc: **月** đọc *gatsu* trong 五月 nhưng *getsu* trong 月曜日; **分** là *fun* sau 2・5・7・9 nhưng *pun* sau 1・3・4・6・8・10; **時** là *ji* trong 時間.',
    ]),
    TABLE(
      ['Chữ', 'Hán Việt · nghĩa', 'On (ON)', 'Kun (KUN)', 'Từ cô hay gặp'],
      [
        ['時', 'THỜI · thời gian; giờ', 'ジ', 'とき', '何時 なんじ · 時間 じかん · 七時半 しちじはん'],
        ['分', 'PHÂN · phút; chia', 'フン・プン・ブン', 'わ·かる', '十分 じゅっぷん · 何分 なんぷん · 半分 はんぶん'],
        ['月', 'NGUYỆT · trăng; tháng', 'ゲツ・ガツ', 'つき', '月曜日 げつようび · 五月 ごがつ'],
        ['火', 'HOẢ · lửa', 'カ', 'ひ', '火曜日 かようび · 花火 はなび'],
        ['水', 'THUỶ · nước', 'スイ', 'みず', '水曜日 すいようび · 水 みず'],
        ['木', 'MỘC · cây, gỗ', 'モク・ボク', 'き', '木曜日 もくようび · 木 き'],
        ['金', 'KIM · vàng; tiền', 'キン', 'かね', '金曜日 きんようび · お金 おかね'],
        ['土', 'THỔ · đất', 'ド', 'つち', '土曜日 どようび · 土 つち'],
        ['曜', 'DIỆU · ngày trong tuần', 'ヨウ', '—', '何曜日 なんようび · 日曜日 にちようび'],
        ['朝', 'TRIÊU · buổi sáng', 'チョウ', 'あさ', '毎朝 まいあさ · 朝ご飯 あさごはん'],
        ['晩', 'VÃN · buổi tối', 'バン', '—', '毎晩 まいばん · 今晩 こんばん'],
      ],
    ),

    H(`${LV.de} — A. Đọc từ ghép quen (14 câu)`),
    MC('lt-b3-han-doc-tu', 'A. Từ ghép → cách đọc', [
      Q('「月曜日」 đọc là…', 'げつようび', 'つきようび | がつようび | げっようび', '月 trong tên thứ đọc げつ.'),
      Q('「火曜日」 đọc là…', 'かようび', 'ひようび | かぶようび | ほようび', '火 = か.'),
      Q('「水曜日」 đọc là…', 'すいようび', 'みずようび | すうようび | みいようび', '水 = すい.'),
      Q('「木曜日」 đọc là…', 'もくようび', 'きようび | ぼくようび | もうようび', '木 = もく.'),
      Q('「金曜日」 đọc là…', 'きんようび', 'かねようび | こんようび | ぎんようび', '金 = きん.'),
      Q('「土曜日」 đọc là…', 'どようび', 'つちようび | とようび | どうようび', '土 = ど.'),
      Q('「何曜日」 đọc là…', 'なんようび', 'なにようび | なにようひ | かようび', '何 trước よう đọc なん.'),
      Q('「毎朝」 đọc là…', 'まいあさ', 'まいちょう | まいあし | まいにち', '朝 = あさ.'),
      Q('「毎晩」 đọc là…', 'まいばん', 'まいよる | まいぱん | まいあさ', '晩 = ばん.'),
      Q('「時間」 đọc là…', 'じかん', 'ときかん | じげん | とけん', '時 = じ.'),
      Q('「何時」 đọc là…', 'なんじ', 'なにじ | なんとき | なにとき', '何時 = なんじ.'),
      Q('「十分」 (10 phút) đọc là…', 'じゅっぷん', 'じゅうふん | じゅうぷん | じっふん', '10 phút: っぷん.'),
      Q('「花火」 đọc là…', 'はなび', 'はなか | はなひ | かか', '火 đục hoá び.'),
      Q('「七時半」 đọc là…', 'しちじはん', 'ななじはん | しちときはん | しちじぱん', '時 = じ, 半 = はん.'),
    ]),

    H(`${LV.de} — B. Hán Việt và nghĩa của chữ (11 câu)`),
    MC('lt-b3-han-nghia', 'B. Nghĩa của từng chữ', [
      Q('Chữ 「時」 (THỜI) nghĩa là…', 'Thời gian; giờ', 'Phút | Buổi sáng | Ngày', '時 = giờ.'),
      Q('Chữ 「分」 (PHÂN) trong 「十分」 nghĩa là…', 'Phút', 'Giờ | Tháng | Ngày', '分 = phút (và "chia").'),
      Q('Chữ 「月」 (NGUYỆT) nghĩa là…', 'Trăng; tháng', 'Mặt trời | Lửa | Nước', '月 = trăng/tháng.'),
      Q('Chữ 「火」 (HOẢ) nghĩa là…', 'Lửa', 'Nước | Cây | Đất', '火 = lửa.'),
      Q('Chữ 「水」 (THUỶ) nghĩa là…', 'Nước', 'Lửa | Cây | Vàng', '水 = nước.'),
      Q('Chữ 「木」 (MỘC) nghĩa là…', 'Cây, gỗ', 'Đất | Nước | Trăng', '木 = cây.'),
      Q('Chữ 「金」 (KIM) nghĩa là…', 'Vàng, kim loại; tiền', 'Lửa | Cây | Đất', '金 = vàng/tiền.'),
      Q('Chữ 「土」 (THỔ) nghĩa là…', 'Đất', 'Cây | Vàng | Nước', '土 = đất.'),
      Q('Chữ 「曜」 (DIỆU) xuất hiện trong…', 'Tên các thứ trong tuần', 'Tên các tháng | Tên các mùa | Giờ giấc', '曜日 = thứ.'),
      Q('Chữ 「朝」 (TRIÊU) nghĩa là…', 'Buổi sáng', 'Buổi tối | Buổi trưa | Nửa đêm', '朝 = あさ.'),
      Q('Chữ 「晩」 (VÃN) nghĩa là…', 'Buổi tối', 'Buổi sáng | Buổi trưa | Cả ngày', '晩 = ばん.'),
    ]),

    H(`${LV.vua} — C. Nghe cách đọc, chọn chữ ĐÚNG giữa chữ nhiễu (12 câu)`),
    MC('lt-b3-han-chon-chu', 'C. Cách đọc → chọn chữ Hán đúng', [
      Q('「じかん」 viết là…', '時間', '待間 | 持間 | 寺間', '時 = 日 + 寺 (bên trái là 日).'),
      Q('「かようび」 viết là…', '火曜日', '水曜日 | 木曜日 | 犬曜日', '火 = lửa. 水 có nét móc ở giữa.'),
      Q('「すいようび」 viết là…', '水曜日', '氷曜日 | 永曜日 | 木曜日', '氷 (băng) có thêm một chấm; 永 khác hình.'),
      Q('「もくようび」 viết là…', '木曜日', '本曜日 | 末曜日 | 未曜日', '木 = cây, không có nét ngang thêm.'),
      Q('「どようび」 viết là…', '土曜日', '士曜日 | 王曜日 | 工曜日', '土: nét ngang dưới dài hơn nét trên (士 ngược lại).'),
      Q('「きんようび」 viết là…', '金曜日', '全曜日 | 余曜日 | 令曜日', '金 có hai chấm dưới.'),
      Q('「げつようび」 viết là…', '月曜日', '日曜日 | 目曜日 | 用曜日', '月 có hai vạch trong; 日 vuông; 目 ba vạch.'),
      Q('「まいあさ」 viết là…', '毎朝', '毎期 | 毎潮 | 毎明', '朝 = 十日十 + 月.'),
      Q('「まいばん」 viết là…', '毎晩', '毎晴 | 毎暗 | 毎勉', '晩: 日 + 免.'),
      Q('「なんじ」 viết là…', '何時', '何待 | 何持 | 何時分', '何時 = nanji.'),
      Q('「じゅっぷん」 viết là…', '十分', '十今 | 十公 | 十令', '分 = 八 + 刀.'),
      Q('「にちようび」 viết là…', '日曜日', '日躍日 | 日輝日 | 月曜日', '曜: 日 + 羽 + 隹.'),
    ]),

    H(`${LV.vua} — D. Một chữ, nhiều cách đọc (10 câu)`),
    MC('lt-b3-han-bay', 'D. Cẩn thận: cùng chữ, khác cách đọc', [
      Q('「五月」 — chữ 「月」 đọc là gì?', 'がつ', 'げつ | つき | げっ', 'Tháng: số + がつ.'),
      Q('「月曜日」 — chữ 「月」 đọc là gì?', 'げつ', 'がつ | つき | げっ', 'Trong tên thứ: げつ.'),
      Q('「月」 đứng một mình (mặt trăng) đọc là…', 'つき', 'げつ | がつ | ひ', '月 một mình = つき.'),
      Q('「三分」 — chữ 「分」 đọc là gì?', 'ぷん', 'ふん | ぶん | わけ', '3 phút: さんぷん.'),
      Q('「五分」 — chữ 「分」 đọc là gì?', 'ふん', 'ぷん | ぶん | わけ', '5 phút: ごふん.'),
      Q('「半分」 (một nửa) — 「分」 đọc là…', 'ぶん', 'ふん | ぷん | わ', '半分 = はんぶん.'),
      Q('「何時」 — chữ 「時」 đọc là gì?', 'じ', 'とき | しょう | じゅう', '時 = じ (giờ).'),
      Q('「火」 trong 「花火」 đọc là…', 'び', 'か | ひ | ほ', '花火 = はなび (đục hoá).'),
      Q('「火」 trong 「火曜日」 đọc là…', 'か', 'び | ひ | ほ', '火曜日 = かようび.'),
      Q('「朝」 trong 「朝ご飯」 đọc là…', 'あさ', 'ちょう | あし | あす', '朝ご飯 = あさごはん.'),
    ]),

    H(`${LV.vua} — E. Gõ hiragana cho chữ Hán (12 câu)`),
    QZ('lt-b3-han-go', 'E. Viết cách đọc bằng hiragana', 'fill', [
      A('月曜日 → ?', 'げつようび'),
      A('火曜日 → ?', 'かようび'),
      A('水曜日 → ?', 'すいようび'),
      A('木曜日 → ?', 'もくようび'),
      A('金曜日 → ?', 'きんようび'),
      A('土曜日 → ?', 'どようび'),
      A('五月 → ?', 'ごがつ'),
      A('毎朝 → ?', 'まいあさ'),
      A('毎晩 → ?', 'まいばん'),
      A('時間 → ?', 'じかん'),
      A('何曜日 → ?', 'なんようび'),
      A('花火 → ?', 'はなび'),
    ]),

    H(`${LV.kho} — F. Đọc to câu KHÔNG furigana (14 câu)`),
    READK('lt-b3-han-doc-cau', 'F. Đọc câu, rồi bấm hiện cách đọc để tự chấm', 'Nhìn 5 giây, đọc to không ngập ngừng; nếu dừng ở chữ nào thì chữ đó chưa thuộc.', [
      RK('{今|いま}、 {何時|なんじ} です か。', 'Bây giờ mấy giờ?'),
      RK('{九時|くじ} {十分|じゅっぷん} です。', '9 giờ 10 phút.'),
      RK('{月曜日|げつようび} から {金曜日|きんようび} まで です。', 'Từ thứ Hai đến thứ Sáu.'),
      RK('{土曜日|どようび} は {休|やす}み です。', 'Thứ Bảy là ngày nghỉ.'),
      RK('{火曜日|かようび} に アルバイト を します。', 'Thứ Ba tôi làm thêm.'),
      RK('{水曜日|すいようび} は {授業|じゅぎょう} が あります。', 'Thứ Tư có giờ học.'),
      RK('{木曜日|もくようび} の {午後|ごご}、 {図書館|としょかん} へ {行|い}きます。', 'Chiều thứ Năm tôi đi thư viện.'),
      RK('{毎朝|まいあさ}、 {七時半|しちじはん} に {起|お}きます。', 'Sáng nào tôi cũng dậy lúc 7 giờ rưỡi.'),
      RK('{毎晩|まいばん}、 {十一時|じゅういちじ} に {寝|ね}ます。', 'Tối nào tôi cũng ngủ lúc 11 giờ.'),
      RK('{朝|あさ}ご{飯|はん} は {何時|なんじ} です か。', 'Bữa sáng là mấy giờ?'),
      RK('{五月|ごがつ} {三日|みっか} は お{花見|はなみ} です。', 'Ngày 3 tháng 5 là buổi ngắm hoa.'),
      RK('{金曜日|きんようび} の {夜|よる}、 {花火|はなび} を {見|み}ます。', 'Tối thứ Sáu tôi xem pháo hoa.'),
      RK('{休|やす}み は {何曜日|なんようび} です か。', 'Ngày nghỉ là thứ mấy?'),
      RK('{私|わたし} は {日曜日|にちようび} に {海|うみ} へ {行|い}きます。', 'Chủ nhật tôi đi biển.'),
    ]),

    H(`${LV.kho} — G. Đọc to cả đoạn không furigana (3 đoạn, giống phần Reading)`),
    READK('lt-b3-han-doc-doan', 'G. Đoạn ngắn — đọc liền một hơi', 'Giống đề Reading thi nói: chuẩn bị ít giây rồi đọc to một lượt, không dừng. Ngắt đúng chỗ 「、」 và 「。」.', [
      RK('{私|わたし} は ワン です。 {月曜日|げつようび} から {金曜日|きんようび} まで {学校|がっこう} へ {行|い}きます。 {毎朝|まいあさ} {九時|くじ} から {十二時半|じゅうにじはん} まで {日本語|にほんご} を {勉強|べんきょう}します。', 'Tôi là Wan. Từ thứ Hai đến thứ Sáu tôi đi học. Sáng nào cũng học tiếng Nhật từ 9 giờ đến 12 giờ rưỡi.'),
      RK('{水曜日|すいようび} と {土曜日|どようび}、 コンビニ で アルバイト を します。 {四時|よじ} から {八時|はちじ} まで {働|はたら}きます。 {日曜日|にちようび} は {休|やす}み です。', 'Thứ Tư và thứ Bảy tôi làm thêm ở cửa hàng tiện lợi. Tôi làm từ 4 đến 8 giờ. Chủ nhật tôi nghỉ.'),
      RK('{毎晩|まいばん}、 {八時|はちじ} から {十時|じゅうじ} まで {勉強|べんきょう}します。 {十一時|じゅういちじ} に {寝|ね}ます。 {土曜日|どようび} の {夜|よる} は {花火|はなび} を {見|み}ます。', 'Tối nào tôi cũng học từ 8 đến 10 giờ. Tôi ngủ lúc 11 giờ. Tối thứ Bảy tôi xem pháo hoa.'),
    ]),

    H(`${LV.kho} — H. Chọn cách đọc của từ trong 【 】 (10 câu)`),
    MC('lt-b3-han-trong-cau', 'H. Cách đọc đúng của từ trong ngoặc', [
      Q('【月曜日】は {授業|じゅぎょう}が あります。', 'げつようび', 'つきようび | がつようび | げっようび', '月曜日 = げつようび.'),
      Q('{会社|かいしゃ}は 【金曜日】までです。', 'きんようび', 'かねようび | こんようび | ぎんようび', '金曜日 = きんようび.'),
      Q('【毎朝】、 {牛乳|ぎゅうにゅう}を {飲|の}みます。', 'まいあさ', 'まいちょう | まいあし | まいにち', '毎朝 = まいあさ.'),
      Q('【毎晩】、 テレビを {見|み}ます。', 'まいばん', 'まいよる | まいぱん | まいあさ', '毎晩 = まいばん.'),
      Q('{今|いま}、 【何時】ですか。', 'なんじ', 'なにじ | なんとき | なにとき', '何時 = なんじ.'),
      Q('【五月】は {休|やす}みです。', 'ごがつ', 'ごげつ | いつつき | ごつき', '五月 = ごがつ.'),
      Q('【十分】、 {勉強|べんきょう}します。', 'じゅっぷん', 'じゅうぶん | じゅうふん | じっぷん', 'Ở Bài 3: 10 phút = じゅっぷん.'),
      Q('{夏|なつ}、 【花火】を {見|み}ます。', 'はなび', 'はなひ | かか | はなか', '花火 = はなび.'),
      Q('【土曜日】と {日曜日|にちようび}は {休|やす}みです。', 'どようび', 'つちようび | とようび | どうようび', '土曜日 = どようび.'),
      Q('【木曜日】に アルバイトを します。', 'もくようび', 'きようび | ぼくようび | もうようび', '木曜日 = もくようび.'),
    ]),

    H(`${LV.kho} — I. Nhóm, nghĩa, mẹo (6 câu)`),
    MC('lt-b3-han-nhom', 'I. Câu hỏi tổng hợp về 11 chữ Hán', [
      Q('Chữ nào KHÔNG nằm trong dãy bảy thứ (曜日)?', '朝', '月 | 火 | 水', '朝 là buổi sáng; 月火水木金土 là sáu thứ.'),
      Q('Cặp chữ nào chỉ BUỔI TRONG NGÀY?', '朝・晩', '火・水 | 時・分 | 木・金', '朝 (sáng), 晩 (tối).'),
      Q('Cặp chữ nào chỉ ĐƠN VỊ GIỜ GIẤC?', '時・分', '朝・晩 | 月・火 | 金・土', '時 (giờ), 分 (phút).'),
      Q('Chữ nào nghĩa gốc là "lửa"?', '火', '水 | 木 | 土', '火 = lửa.'),
      Q('Chữ nào đọc là 「み·ず」 khi đứng một mình?', '水', '火 | 木 | 金', '水 = みず.'),
      Q('Chữ 「月」 trong 「五月」 và 「月曜日」 khác nhau ở…', 'Cách đọc: がつ ↔ げつ', 'Nghĩa: lửa ↔ nước | Cách viết | Không khác gì', 'Cùng chữ, hai cách đọc on.'),
    ]),

    H('Luyện viết tay (không bắt buộc, nhưng giúp nhớ lâu)'),
    WRITE('lt-b3-han-viet', 'Viết từ có chữ Hán Bài 3', ['時間', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '毎朝', '毎晩'], 'Viết theo thứ tự nét, đọc to từng chữ khi viết.', {
      '時間': 'じかん · thời gian',
      '月曜日': 'げつようび · thứ Hai',
      '火曜日': 'かようび · thứ Ba',
      '水曜日': 'すいようび · thứ Tư',
      '木曜日': 'もくようび · thứ Năm',
      '金曜日': 'きんようび · thứ Sáu',
      '土曜日': 'どようび · thứ Bảy',
      '毎朝': 'まいあさ · mỗi sáng',
      '毎晩': 'まいばん · mỗi tối',
    }),
  ],
};


/* ───────── 3. NGỮ PHÁP 0 — ĐỌC GIỜ, PHÚT, THỨ, THÁNG, NGÀY ───────── */

const L_NP_GIO: Lesson = {
  id: 'lt-b3-ngu-phap-gio-ngay',
  kind: 'grammar',
  title: 'Luyện thêm Bài 3 — Đọc giờ, phút, thứ, tháng, ngày (午前／午後 · 半 · 何時 · 何曜日 · 何月何日)',
  goal: 'Đọc và nói đúng giờ, phút, thứ, tháng, ngày (kể cả các số bất quy tắc 4・7・9, ぷん／ふん, ngày 1–10・14・20・24) — từ nhận biết đến tự gõ và tự nói.',
  minutes: 60,
  blocks: [
    HOW([
      'Học **thuộc lòng** bốn bảng: giờ (ba số lạ 4・7・9), phút (ふん／ぷん), tháng (4・7・9) và ngày (15 số lạ). Mỗi bảng đọc to hai lượt, lượt hai che cột đọc.',
      'Mức Dễ chỉ hỏi cách đọc một con số; Vừa gộp giờ + phút + 午前／午後; Khó là **tình huống thật** (đọc lịch, tính giờ, sắp câu).',
      'Lỗi hay mắc: ~~よんじ~~, ~~きゅうじ~~, ~~じゅうぷん~~, ~~ろくぷん~~, ngày 20 là ~~にじゅうにち~~, tháng 4 là ~~よんがつ~~.',
    ]),
    TABLE(
      ['Bảng', 'Bất quy tắc cần nhớ'],
      [
        ['Giờ ～時', '**4 = よじ** · **7 = しちじ** · **9 = くじ** (còn lại: số + じ)'],
        ['Phút ～分', '**ぷん**: 1・3・4・6・8・10 và các số tròn chục (いっぷん・さんぷん・よんぷん・ろっぷん・はっぷん・じゅっぷん・にじゅっぷん) · **ふん**: 2・5・7・9 (にふん・ごふん・ななふん・きゅうふん・じゅうごふん)'],
        ['Rưỡi', '30 phút = **半**: 七時半 = しちじはん'],
        ['Tháng ～月', '**4 = しがつ** · **7 = しちがつ** · **9 = くがつ**'],
        ['Ngày ～日', '1 ついたち · 2 ふつか · 3 みっか · 4 よっか · 5 いつか · 6 むいか · 7 なのか · 8 ようか · 9 ここのか · 10 とおか · 14 じゅうよっか · 20 はつか · 24 にじゅうよっか; còn lại số + にち'],
        ['Thứ ～曜日', '月 げつ · 火 か · 水 すい · 木 もく · 金 きん · 土 ど · 日 にち + ようび'],
      ],
      'Bảng nhớ nhanh',
    ),

    H(`${LV.de} — A. Đọc giờ (14 câu)`),
    MC('lt-b3-gio-a', 'A. Chọn cách đọc đúng của giờ', [
      Q('1:00', 'いちじ', 'ひとじ | いっじ | いちとき', '1 giờ = いちじ.'),
      Q('2:00', 'にじ', 'ふたじ | にちじ | ふじ', '2 giờ = にじ.'),
      Q('3:00', 'さんじ', 'みっじ | さんとき | さじ', '3 giờ = さんじ.'),
      Q('4:00', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = よじ.'),
      Q('5:00', 'ごじ', 'いつじ | ごとき | ごうじ', '5 giờ = ごじ.'),
      Q('6:00', 'ろくじ', 'むじ | ろっじ | ろくとき', '6 giờ = ろくじ.'),
      Q('7:00', 'しちじ', 'ななじ | しじ | しちとき', '7 giờ = しちじ (sách dùng しちじ).'),
      Q('8:00', 'はちじ', 'はっじ | やじ | はちとき', '8 giờ = はちじ.'),
      Q('9:00', 'くじ', 'きゅうじ | くうじ | ここのじ', '9 giờ = くじ.'),
      Q('10:00', 'じゅうじ', 'じゅじ | とおじ | じっじ', '10 giờ = じゅうじ.'),
      Q('11:00', 'じゅういちじ', 'じゅういっじ | じゅうひとじ | いちじゅうじ', '11 giờ = じゅういちじ.'),
      Q('12:00', 'じゅうにじ', 'じゅうふたじ | にじゅうじ | じゅうにとき', '12 giờ = じゅうにじ.'),
      Q('Hỏi "mấy giờ?" nói là…', '{何時|なんじ}', '{何分|なんぷん} | {何日|なんにち} | {何月|なんがつ}', '何時 = なんじ.'),
      Q('Câu nào đọc SAI?', '4:00 よんじ', '4:00 よじ | 9:00 くじ | 7:00 しちじ', '4 giờ phải là よじ.'),
    ]),

    H(`${LV.de} — B. Đọc phút (14 câu)`),
    MC('lt-b3-gio-b', 'B. Chọn cách đọc đúng của phút', [
      Q('1 phút', 'いっぷん', 'いちふん | いちぷん | ひとふん', '1 phút = いっぷん.'),
      Q('2 phút', 'にふん', 'にぷん | ふたふん | にっぷん', '2 phút = にふん.'),
      Q('3 phút', 'さんぷん', 'さんふん | みっぷん | さっぷん', '3 phút = さんぷん.'),
      Q('4 phút', 'よんぷん', 'よんふん | よっぷん | しふん', '4 phút = よんぷん.'),
      Q('5 phút', 'ごふん', 'ごぷん | ごっぷん | いつふん', '5 phút = ごふん.'),
      Q('6 phút', 'ろっぷん', 'ろくふん | ろくぷん | むっぷん', '6 phút = ろっぷん.'),
      Q('7 phút', 'ななふん', 'ななぷん | しちふん | なっぷん', '7 phút = ななふん (しちふん cũng nghe nhưng khi thi dùng ななふん).'),
      Q('8 phút', 'はっぷん', 'はちぷん | はっふん | やっぷん', '8 phút = はっぷん (hoặc はちふん).'),
      Q('9 phút', 'きゅうふん', 'きゅうぷん | くふん | くぷん', '9 phút = きゅうふん.'),
      Q('10 phút', 'じゅっぷん', 'じゅうふん | じゅうぷん | じっふん', '10 phút = じゅっぷん.'),
      Q('15 phút', 'じゅうごふん', 'じゅうごぷん | じゅっごふん | じゅうごっぷん', '15 phút = じゅうごふん (ふん vì tận cùng 5).'),
      Q('20 phút', 'にじゅっぷん', 'にじゅうふん | にじゅうぷん | にじっぷん', '20 phút = にじゅっぷん.'),
      Q('30 phút (nói gọn) là…', 'はん', 'さんじゅうぷん | ごじゅっぷん | じゅうごふん', '半 = はん = 30 phút.'),
      Q('45 phút', 'よんじゅうごふん', 'よんじゅっぷん | よんじゅうごぷん | しじゅうごふん', '45 phút = よんじゅうごふん.'),
    ]),

    H(`${LV.de} — C. Đọc thứ và tháng (12 câu)`),
    MC('lt-b3-gio-c', 'C. Thứ và tháng', [
      Q('Thứ Hai', 'げつようび', 'かようび | どようび | にちようび', '月曜日.'),
      Q('Thứ Ba', 'かようび', 'すいようび | もくようび | げつようび', '火曜日.'),
      Q('Thứ Tư', 'すいようび', 'もくようび | かようび | きんようび', '水曜日.'),
      Q('Thứ Năm', 'もくようび', 'きんようび | どようび | すいようび', '木曜日.'),
      Q('Thứ Sáu', 'きんようび', 'もくようび | どようび | げつようび', '金曜日.'),
      Q('Thứ Bảy', 'どようび', 'にちようび | きんようび | かようび', '土曜日.'),
      Q('Chủ nhật', 'にちようび', 'どようび | げつようび | すいようび', '日曜日.'),
      Q('Tháng 4', 'しがつ', 'よんがつ | よがつ | しいがつ', '4月 = しがつ.'),
      Q('Tháng 7', 'しちがつ', 'ななつき | ななにち | しがつ', '7月 = しちがつ.'),
      Q('Tháng 9', 'くがつ', 'きゅうがつ | ここのがつ | くつき', '9月 = くがつ.'),
      Q('Tháng 12', 'じゅうにがつ', 'じゅうにつき | じゅうふたがつ | にじゅうがつ', '12月 = じゅうにがつ.'),
      Q('Hỏi "thứ mấy?" nói là…', '{何曜日|なんようび}', '{何月|なんがつ} | {何日|なんにち} | {何時|なんじ}', '何曜日 = なんようび.'),
    ]),

    H(`${LV.vua} — D. Đọc ngày trong tháng (16 câu)`),
    MC('lt-b3-gio-d', 'D. Chọn cách đọc đúng của ngày', [
      Q('1日 (mồng 1)', 'ついたち', 'いちにち | ひとひ | いっか', 'Ngày mồng 1 = ついたち.'),
      Q('2日', 'ふつか', 'ふたか | にか | にじつ', '2日 = ふつか.'),
      Q('3日', 'みっか', 'さんか | みつか | さんにち', '3日 = みっか.'),
      Q('4日', 'よっか', 'よんか | しにち | よんにち', '4日 = よっか.'),
      Q('5日', 'いつか', 'ごにち | ごか | いっか', '5日 = いつか.'),
      Q('6日', 'むいか', 'ろくにち | ろっか | むっか', '6日 = むいか.'),
      Q('7日', 'なのか', 'しちにち | ななにち | なぬか', '7日 = なのか.'),
      Q('8日', 'ようか', 'はちにち | やっか | はっか', '8日 = ようか.'),
      Q('9日', 'ここのか', 'くにち | きゅうにち | ここにち', '9日 = ここのか.'),
      Q('10日', 'とおか', 'じゅうにち | とうか | じゅっか', '10日 = とおか.'),
      Q('14日', 'じゅうよっか', 'じゅうよんにち | じゅうしにち | じゅうよんか', '14日 = じゅうよっか.'),
      Q('20日', 'はつか', 'にじゅうにち | ふたじゅうか | にじゅっか', '20日 = はつか.'),
      Q('24日', 'にじゅうよっか', 'にじゅうよんにち | にじゅうしにち | はつよっか', '24日 = にじゅうよっか.'),
      Q('17日', 'じゅうしちにち', 'じゅうななにち | じゅうしちか | じゅうなのか', '17日 = じゅうしちにち.'),
      Q('30日', 'さんじゅうにち', 'さんじゅっか | みそか | さんじゅうか', '30日 = さんじゅうにち.'),
      Q('Hỏi "ngày mấy?" nói là…', '{何日|なんにち}', '{何曜日|なんようび} | {何月|なんがつ} | {何時|なんじ}', '何日 = なんにち.'),
    ]),

    H(`${LV.vua} — E. Nói giờ đầy đủ — gõ hiragana (12 câu)`),
    QZ('lt-b3-gio-e', 'E. Gõ cách đọc đầy đủ bằng hiragana', 'fill', [
      A('4:05 → ?', 'よじごふん'),
      A('7:30 → ?', 'しちじはん'),
      A('9:10 → ?', 'くじじゅっぷん'),
      A('午前8:45 → ?', 'ごぜんはちじよんじゅうごふん'),
      A('午後3:20 → ?', 'ごごさんじにじゅっぷん'),
      A('午前6:06 → ?', 'ごぜんろくじろっぷん'),
      A('午後10:00 → ?', 'ごごじゅうじ'),
      A('1:01 → ?', 'いちじいっぷん'),
      A('12:08 → ?', ['じゅうにじはっぷん', 'じゅうにじはちふん']),
      A('5月3日 → ?', 'ごがつみっか'),
      A('4月20日 → ?', 'しがつはつか'),
      A('9月24日 → ?', 'くがつにじゅうよっか'),
    ]),

    H(`${LV.vua} — F. Chọn câu hỏi phù hợp với câu trả lời (10 câu)`),
    MC('lt-b3-gio-f', 'F. Từ để hỏi', [
      Q('A：＿＿＿ですか。 B：{七時半|しちじはん}です。', '{今|いま}、{何時|なんじ}', '{何月|なんがつ}{何日|なんにち} | {何曜日|なんようび} | どこ', 'Trả lời bằng giờ → hỏi 何時.'),
      Q('A：{休|やす}みは＿＿＿ですか。 B：{水曜日|すいようび}です。', '{何曜日|なんようび}', '{何時|なんじ} | {何分|なんぷん} | {何日|なんにち}', 'Thứ → 何曜日.'),
      Q('A：テストは＿＿＿ですか。 B：{六月|ろくがつ}{二日|ふつか}です。', '{何月何日|なんがつなんにち}', '{何曜日|なんようび} | {何時|なんじ} | {何|なに}', 'Tháng ngày → 何月何日.'),
      Q('A：{夏休|なつやす}みは＿＿＿ですか。 B：{八月|はちがつ}からです。', 'いつ', 'どこ | {何|なに} | だれ', '"Khi nào" → いつ (câu trả lời có thể là tháng/ngày/thứ).'),
      Q('A：{図書館|としょかん}は＿＿＿から＿＿＿までですか。 B：{九時|くじ}から{七時|しちじ}までです。', '{何時|なんじ}', '{何曜日|なんようび} | {何月|なんがつ} | いつ', 'Giờ → 何時.'),
      Q('A：{銀行|ぎんこう}は＿＿＿から＿＿＿までですか。 B：{月曜日|げつようび}から{金曜日|きんようび}までです。', '{何曜日|なんようび}', '{何時|なんじ} | {何分|なんぷん} | {何日|なんにち}', 'Thứ → 何曜日.'),
      Q('A：{夏休|なつやす}みは＿＿＿から＿＿＿までですか。 B：{七月|しちがつ}から{八月|はちがつ}までです。', 'いつ / いつ', '{何時|なんじ} / {何時|なんじ} | どこ / どこ | {何|なに} / {何|なに}', 'Tháng → いつ.'),
      Q('Hỏi "mấy phút?" nói là…', '{何分|なんぷん}', '{何時|なんじ} | {何日|なんにち} | {何月|なんがつ}', '何分 = なんぷん (đọc ぷん, không phải なんふん).'),
      Q('A：＿＿＿に {起|お}きますか。 B：{六時|ろくじ}に {起|お}きます。', '{何時|なんじ}', '{何曜日|なんようび} | {何月|なんがつ} | どこ', '起きます kèm giờ → 何時に.'),
      Q('A：＿＿＿に {行|い}きますか。 B：{図書館|としょかん}へ {行|い}きます。', 'どこ', '{何時|なんじ} | いつ | {何|なに}', 'Nơi đến → どこへ／どこに.'),
    ]),

    H(`${LV.kho} — G. Đọc lịch/bảng giờ (8 câu)`),
    TABLE(
      ['Nơi', 'Ngày mở', 'Giờ mở', 'Nghỉ'],
      [
        ['{図書館|としょかん}', '{月曜日|げつようび}〜{金曜日|きんようび}', '{九時|くじ}〜{七時|しちじ}', '{日曜日|にちようび}'],
        ['{図書館|としょかん}', '{土曜日|どようび}', '{十時|じゅうじ}〜{五時|ごじ}', '—'],
        ['{体育館|たいいくかん}', '{火曜日|かようび}〜{日曜日|にちようび}', '{午前|ごぜん}{七時|しちじ}〜{午後|ごご}{十時|じゅうじ}', '{月曜日|げつようび}'],
        ['{郵便局|ゆうびんきょく}', '{月曜日|げつようび}〜{金曜日|きんようび}', '{九時|くじ}〜{五時|ごじ}', '{土曜日|どようび}・{日曜日|にちようび}'],
      ],
      'Bảng giờ mở cửa (viết mới)',
    ),
    MC('lt-b3-gio-g', 'G. Đọc bảng rồi trả lời', [
      Q('{図書館|としょかん}の {休|やす}みは {何曜日|なんようび}ですか。', '{日曜日|にちようび}です', '{月曜日|げつようび}です | {土曜日|どようび}です | {水曜日|すいようび}です', 'Bảng: 日曜日 nghỉ.'),
      Q('{図書館|としょかん}は {土曜日|どようび}、 {何時|なんじ}までですか。', '{五時|ごじ}までです', '{七時|しちじ}までです | {十時|じゅうじ}までです | {九時|くじ}までです', 'Thứ Bảy 10–5 giờ.'),
      Q('{体育館|たいいくかん}は {何時|なんじ}から{何時|なんじ}までですか。', '{午前|ごぜん}{七時|しちじ}から{午後|ごご}{十時|じゅうじ}までです', '{九時|くじ}から{七時|しちじ}までです | {午前|ごぜん}{十時|じゅうじ}から{午後|ごご}{五時|ごじ}までです | {午後|ごご}{七時|しちじ}から{午前|ごぜん}{十時|じゅうじ}までです', '7 giờ sáng – 10 giờ tối.'),
      Q('{体育館|たいいくかん}の {休|やす}みは？', '{月曜日|げつようび}です', '{日曜日|にちようび}です | {火曜日|かようび}です | {土曜日|どようび}です', 'Nghỉ thứ Hai.'),
      Q('{郵便局|ゆうびんきょく}は {何曜日|なんようび}から{何曜日|なんようび}までですか。', '{月曜日|げつようび}から{金曜日|きんようび}まで', '{月曜日|げつようび}から{土曜日|どようび}まで | {火曜日|かようび}から{日曜日|にちようび}まで | {土曜日|どようび}から{日曜日|にちようび}まで', 'Mở thứ Hai – thứ Sáu.'),
      Q('{日曜日|にちようび}に {休|やす}みの ところは？ (chọn đủ)', '{図書館|としょかん}と{郵便局|ゆうびんきょく}', '{体育館|たいいくかん}だけ | {体育館|たいいくかん}と{図書館|としょかん} | どこも {休|やす}みじゃありません', 'Chủ nhật: 図書館 nghỉ, 郵便局 nghỉ (土・日), 体育館 vẫn mở (火〜日).'),
      Q('{月曜日|げつようび}に {休|やす}みの ところは？', '{体育館|たいいくかん}', '{図書館|としょかん} | {郵便局|ゆうびんきょく} | どこも {休|やす}みじゃありません', 'Thứ Hai: 図書館 mở, 郵便局 mở, 体育館 nghỉ.'),
      Q('{郵便局|ゆうびんきょく}は {九時|くじ}から {何時|なんじ}までですか。', '{五時|ごじ}', '{七時|しちじ} | {十時|じゅうじ} | {三時|さんじ}', '9–5 giờ.'),
    ]),

    H(`${LV.kho} — H. Dịch Việt → Nhật (gõ tay, 8 câu)`),
    QZ('lt-b3-gio-h', 'H. Dịch sang tiếng Nhật', 'translate', [
      AD('Bây giờ là 9 giờ 20 phút.', ['{今|いま}、{9時|くじ}{20分|にじゅっぷん}です。', '{今|いま}は{9時|くじ}{20分|にじゅっぷん}です。'], '今・何時'),
      AD('Bây giờ là 4 giờ 5 phút.', ['{今|いま}、{4時|よじ}{5分|ごふん}です。'], '4時 = よじ'),
      AD('Thư viện mở từ 9 giờ đến 7 giờ.', ['{図書館|としょかん}は{9時|くじ}から{7時|しちじ}までです。'], 'から・まで'),
      AD('Ngày nghỉ là thứ Hai.', ['{休|やす}みは{月曜日|げつようび}です。'], '休み・曜日'),
      AD('Ngày 20 tháng 4 là buổi ngắm hoa.', ['{4月|しがつ}{20日|はつか}はお{花見|はなみ}です。'], '4月・20日'),
      AD('Bài kiểm tra là ngày 24 tháng 7.', ['テストは{7月|しちがつ}{24日|にじゅうよっか}です。'], '7月・24日'),
      AD('Ngân hàng làm từ thứ Hai đến thứ Sáu.', ['{銀行|ぎんこう}は{月曜日|げつようび}から{金曜日|きんようび}までです。'], 'から・まで'),
      AD('Bưu điện làm đến 5 giờ.', ['{郵便局|ゆうびんきょく}は{5時|ごじ}までです。'], 'まで'),
    ], '～は ［giờ／ngày］ です ／ ～から ～まで'),

    H(`${LV.kho} — I. Ghép câu (6 câu)`),
    BUILD('lt-b3-gio-i', 'I. Ghép các mảnh thành câu đúng', [
      BD('Bây giờ là 7 giờ rưỡi.', '{今|いま}、 {七時半|しちじはん} です。', ['を']),
      BD('Nhà thi đấu mở từ 7 giờ sáng đến 10 giờ tối.', '{体育館|たいいくかん} は {午前|ごぜん} {七時|しちじ} から {午後|ごご} {十時|じゅうじ} まで です。', ['に']),
      BD('Ngày nghỉ là thứ Bảy và Chủ nhật.', '{休|やす}み は {土曜日|どようび} と {日曜日|にちようび} です。', ['が']),
      BD('Kỳ nghỉ hè từ ngày 20 tháng 7 đến ngày 31 tháng 8.', '{夏休|なつやす}み は {七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。', ['に']),
      BD('Bài kiểm tra là ngày 14 tháng 9.', 'テスト は {九月|くがつ} {十四日|じゅうよっか} です。', ['を']),
      BD('Mấy giờ thì bạn thức dậy mỗi sáng?', '{毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', ['で']),
    ]),
  ],
};


/* ───────── 4. NGỮ PHÁP 1 — ポイント 16–18 ───────── */

const L_NP1: Lesson = {
  id: 'lt-b3-ngu-phap-1',
  kind: 'grammar',
  title: 'Luyện thêm Bài 3 — Ngữ pháp 1: Vます／ません, へ (đi đâu), を (làm gì) — ポイント 16–18',
  goal: 'Chia ます／ません cho 14 động từ, chọn đúng へ／を, phân biệt 行く・来る・帰る và trả lời câu hỏi Có/Không đúng cách — từ nhận biết đến tự viết câu.',
  minutes: 60,
  blocks: [
    HOW([
      'Trước khi làm, nhớ **hai việc**: ① đổi **ます → ません** cho phủ định (mọi động từ); ② **gạch chân động từ cuối câu** rồi mới chọn trợ từ.',
      'Hai trợ từ của bài này: **へ** (đi/đến/về đâu — đọc *e*) và **を** (vật bị tác động — đọc *o*). Gặp 行きます・来ます・帰ります → へ; gặp 食べます・飲みます・見ます・読みます・聞きます・買います → を.',
      'Lỗi hay mắc: ~~図書館を行きます~~, ~~パンへ食べます~~, trả lời ~~はい、そうです~~ cho câu hỏi động từ, và 帰る nhầm là nhóm 2.',
    ]),
    TABLE(
      ['', 'Khẳng định', 'Phủ định', 'Hỏi'],
      [
        ['Động từ', '{食|た}べます', '{食|た}べません', '{食|た}べますか'],
        ['Đi／đến／về', '{学校|がっこう}へ{行|い}きます', '{学校|がっこう}へ{行|い}きません', 'どこへ{行|い}きますか'],
        ['Vật bị tác động', 'パンを{食|た}べます', 'パンを{食|た}べません', '{何|なに}を{食|た}べますか'],
        ['N + します', 'スキーをします', 'スキーをしません', '{何|なに}をしますか'],
      ],
      'Bốn dòng cần thuộc lòng',
    ),

    H(`${LV.de} — A. Chia phủ định (14 câu)`),
    MC('lt-b3-g1-phu-dinh', 'A. Chọn dạng ません đúng', [
      Q('{行|い}きます → phủ định', '{行|い}きません', '{行|い}かません | {行|い}きないです | {行|い}くません', 'ます → ません.'),
      Q('{帰|かえ}ります → phủ định', '{帰|かえ}りません', '{帰|かえ}らません | {帰|かえ}らないです | {帰|かえ}りくません', 'ます → ません.'),
      Q('{飲|の}みます → phủ định', '{飲|の}みません', '{飲|の}まません | {飲|の}みないです | {飲|の}むません', 'ます → ません.'),
      Q('{食|た}べます → phủ định', '{食|た}べません', '{食|た}べないです | {食|た}びません | {食|た}べくません', 'ます → ません.'),
      Q('{見|み}ます → phủ định', '{見|み}ません', '{見|み}ないです | {見|み}らません | {見|み}くません', 'ます → ません.'),
      Q('します → phủ định', 'しません', 'しないです | せません | しくません', 'ます → ません.'),
      Q('{買|か}います → phủ định', '{買|か}いません', '{買|か}わません | {買|か}わないです | {買|か}うません', 'ます → ません.'),
      Q('{聞|き}きます → phủ định', '{聞|き}きません', '{聞|き}かません | {聞|き}かないです | {聞|き}くません', 'ます → ません.'),
      Q('{働|はたら}きます → phủ định', '{働|はたら}きません', '{働|はたら}かません | {働|はたら}かないです | {働|はたら}くません', 'ます → ません.'),
      Q('{読|よ}みます → phủ định', '{読|よ}みません', '{読|よ}まません | {読|よ}まないです | {読|よ}むません', 'ます → ません.'),
      Q('{起|お}きます → phủ định', '{起|お}きません', '{起|お}かません | {起|お}きないです | {起|お}くません', 'ます → ません.'),
      Q('{寝|ね}ます → phủ định', '{寝|ね}ません', '{寝|ね}らません | {寝|ね}ないです | {寝|ね}くません', 'ます → ません.'),
      Q('{勉強|べんきょう}します → phủ định', '{勉強|べんきょう}しません', '{勉強|べんきょう}ません | {勉強|べんきょう}しないです | {勉強|べんきょう}くません', 'Danh từ + しません.'),
      Q('{来|き}ます → phủ định', '{来|き}ません', '{来|こ}ません | {来|き}ないです | {来|く}ません', '来ます → 来ません (đọc きません).'),
    ]),

    H(`${LV.de} — B. Chọn trợ từ へ／を／X (14 câu)`),
    MC('lt-b3-g1-tro-tu', 'B. Điền trợ từ', [
      Q('{私|わたし}は {図書館|としょかん}＿＿ {行|い}きます。', 'へ', 'を | で | が', 'Đi đâu → へ.'),
      Q('{私|わたし}は パン＿＿ {食|た}べます。', 'を', 'へ | で | が', 'Ăn cái gì → を.'),
      Q('{私|わたし}は テレビ＿＿ {見|み}ます。', 'を', 'へ | で | の', 'Xem cái gì → を.'),
      Q('{私|わたし}は {会社|かいしゃ}＿＿ {来|き}ます。', 'へ', 'を | で | が', 'Đến đâu → へ.'),
      Q('{私|わたし}は うち＿＿ {帰|かえ}ります。', 'へ', 'を | で | が', 'Về đâu → へ.'),
      Q('{私|わたし}は {牛乳|ぎゅうにゅう}＿＿ {飲|の}みます。', 'を', 'へ | で | に', 'Uống cái gì → を.'),
      Q('{私|わたし}は {新聞|しんぶん}＿＿ {読|よ}みます。', 'を', 'へ | で | が', 'Đọc cái gì → を.'),
      Q('{私|わたし}は CD＿＿ {聞|き}きます。', 'を', 'へ | で | の', 'Nghe cái gì → を.'),
      Q('{私|わたし}は スキー＿＿ します。', 'を', 'へ | で | が', 'N + を + します.'),
      Q('{私|わたし}は インターネット＿＿ します。', 'を', 'へ | で | に', 'N + を + します.'),
      Q('ゴールデンウイーク、 どこ＿＿ {行|い}きますか。', 'へ', 'を | が | も', 'どこへ.'),
      Q('{夏休|なつやす}み、 {国|くに}＿＿ {帰|かえ}りますか。', 'へ', 'を | で | が', 'Về nước → 国へ帰ります.'),
      Q('{何|なに}＿＿ {買|か}いますか。', 'を', 'へ | が | で', '何を〜ますか.'),
      Q('{私|わたし}は {毎日|まいにち}、 {日本語|にほんご}＿＿ {勉強|べんきょう}します。', 'を', 'へ | で | が', '日本語を勉強します.'),
    ]),

    H(`${LV.de} — C. Động từ hợp với danh từ (10 câu)`),
    MC('lt-b3-g1-ghep', 'C. Chọn động từ thích hợp', [
      Q('{新聞|しんぶん}を＿＿＿', '{読|よ}みます', '{飲|の}みます | {食|た}べます | {聞|き}きます', '新聞を読みます.'),
      Q('{牛乳|ぎゅうにゅう}を＿＿＿', '{飲|の}みます', '{食|た}べます | {読|よ}みます | {見|み}ます', '牛乳を飲みます.'),
      Q('サラダを＿＿＿', '{食|た}べます', '{飲|の}みます | {聞|き}きます | {読|よ}みます', 'サラダを食べます.'),
      Q('テレビを＿＿＿', '{見|み}ます', '{聞|き}きます | {読|よ}みます | {飲|の}みます', 'テレビを見ます.'),
      Q('CDを＿＿＿', '{聞|き}きます', '{見|み}ます | {読|よ}みます | {食|た}べます', 'CDを聞きます.'),
      Q('お{弁当|べんとう}を＿＿＿', '{買|か}います', '{聞|き}きます | {見|み}ます | {行|い}きます', 'お弁当を買います (cũng 食べます).'),
      Q('{学校|がっこう}へ＿＿＿', '{行|い}きます', '{読|よ}みます | {飲|の}みます | {食|た}べます', '学校へ行きます.'),
      Q('{日本語|にほんご}を＿＿＿', '{勉強|べんきょう}します', '{起|お}きます | {寝|ね}ます | {働|はたら}きます', '日本語を勉強します.'),
      Q('{会社|かいしゃ}で＿＿＿', '{働|はたら}きます', '{寝|ね}ます | {起|お}きます | {帰|かえ}ります', '会社で働きます.'),
      Q('{七時|しちじ}に＿＿＿', '{起|お}きます', '{読|よ}みます | {飲|の}みます | {買|か}います', '七時に起きます.'),
    ]),

    H(`${LV.vua} — D. Chia theo ngữ cảnh — gõ tay (10 câu)`),
    QZ('lt-b3-g1-go-phu-dinh', 'D. Viết dạng phủ định', 'fill', [
      A('{私|わたし}は パンを（{食|た}べます）。 → ?', '{食|た}べません', 'Vません'),
      A('{私|わたし}は お{酒|さけ}を（{飲|の}みます）。 → ?', '{飲|の}みません'),
      A('{私|わたし}は {新聞|しんぶん}を（{読|よ}みます）。 → ?', '{読|よ}みません'),
      A('{私|わたし}は テレビを（{見|み}ます）。 → ?', '{見|み}ません'),
      A('{私|わたし}は {日曜日|にちようび}、 {会社|かいしゃ}へ（{行|い}きます）。 → ?', '{行|い}きません'),
      A('{私|わたし}は {土曜日|どようび}、 {学校|がっこう}へ（{来|き}ます）。 → ?', '{来|き}ません'),
      A('{私|わたし}は {毎日|まいにち}、 インターネットを（します）。 → ?', 'しません'),
      A('{私|わたし}は {夜|よる}、 {勉強|べんきょう}（します）。 → ?', 'しません'),
      A('{私|わたし}は {十二時|じゅうにじ}まで（{起|お}きます）。 → ?', '{起|お}きません'),
      A('{私|わたし}は {十二時|じゅうにじ}に（{寝|ね}ます）。 → ?', '{寝|ね}ません'),
    ], 'ます → ません'),

    H(`${LV.vua} — E. Điền trợ từ — gõ tay (12 câu)`),
    QZ('lt-b3-g1-go-tro-tu', 'E. Gõ trợ từ vào chỗ trống', 'fill', [
      A('{私|わたし}は {海|うみ}（　）{行|い}きます。', ['へ', 'に'], 'đi đâu'),
      A('{私|わたし}は サラダ（　）{食|た}べます。', 'を'),
      A('{私|わたし}は {学校|がっこう}（　）{来|き}ます。', ['へ', 'に']),
      A('{私|わたし}は {国|くに}（　）{帰|かえ}ります。', ['へ', 'に']),
      A('{私|わたし}は {朝|あさ}ご{飯|はん}（　）{食|た}べます。', 'を'),
      A('{私|わたし}は {果物|くだもの}（　）{買|か}います。', 'を'),
      A('{私|わたし}は CD（　）{聞|き}きます。', 'を'),
      A('{私|わたし}は バーベキュー（　）します。', 'を'),
      A('{私|わたし}は ホームステイ（　）します。', 'を'),
      A('{私|わたし}は アルバイト（　）します。', 'を'),
      A('{公園|こうえん}（　）{行|い}きますか。', ['へ', 'に']),
      A('{何|なに}（　）{読|よ}みますか。', 'を'),
    ], 'へ／を'),

    H(`${LV.vua} — F. Hỏi – đáp Có/Không (10 câu)`),
    MC('lt-b3-g1-hoi-dap', 'F. Chọn câu trả lời đúng', [
      Q('「パンを{食|た}べますか。」 → 「はい、＿＿＿」', '{食|た}べます。', '{食|た}べません。 | そうです。 | {食|た}べますか。', 'Trả lời bằng chính động từ.'),
      Q('「お{酒|さけ}を{飲|の}みますか。」 → 「いいえ、＿＿＿」', '{飲|の}みません。', '{飲|の}みます。 | そうです。 | {飲|の}みますか。', 'Phủ định: 飲みません.'),
      Q('「{新聞|しんぶん}を{読|よ}みますか。」 → 「いいえ、＿＿＿」', '{読|よ}みません。', '{読|よ}みます。 | そうじゃありません。 | {読|よ}みですか。', 'Phủ định: 読みません.'),
      Q('「{日曜日|にちようび}、 {学校|がっこう}へ{行|い}きますか。」 → 「はい、＿＿＿」', '{行|い}きます。', '{行|い}きません。 | そうです。 | {行|い}きますか。', 'Khẳng định: 行きます.'),
      Q('「どこへ{行|い}きますか。」', '{海|うみ}へ{行|い}きます。', '{海|うみ}を{行|い}きます。 | はい、{行|い}きます。 | {海|うみ}で{行|い}きます。', 'Trả lời nơi + へ.'),
      Q('「{何|なに}を{飲|の}みますか。」', '{牛乳|ぎゅうにゅう}を{飲|の}みます。', '{牛乳|ぎゅうにゅう}へ{飲|の}みます。 | はい、{飲|の}みます。 | {牛乳|ぎゅうにゅう}で{飲|の}みます。', 'Trả lời vật + を.'),
      Q('「{何|なに}を{見|み}ますか。」', 'テレビを{見|み}ます。', 'テレビへ{見|み}ます。 | はい、{見|み}ます。 | テレビが{見|み}ます。', 'Trả lời vật + を.'),
      Q('「{毎日|まいにち}、 インターネットをしますか。」 → 「いいえ、＿＿＿」', 'しません。', 'します。 | そうです。 | しないです。', 'Phủ định lịch sự: しません.'),
      Q('「{夏休|なつやす}み、 {国|くに}へ{帰|かえ}りますか。」 → 「はい、＿＿＿」', '{帰|かえ}ります。', '{帰|かえ}りません。 | そうです。 | {帰|かえ}りますか。', '帰ります.'),
      Q('「{八時|はちじ}に{学校|がっこう}へ{来|き}ますか。」 → 「いいえ、＿＿＿」', '{来|き}ません。', '{来|き}ます。 | そうです。 | {来|く}ません。', '来ません (đọc きません).'),
    ]),

    H(`${LV.vua} — G. Câu nào đúng? (8 câu)`),
    MC('lt-b3-g1-sua', 'G. Chọn câu đúng', [
      Q('Câu nào đúng?', '{私|わたし}は {図書館|としょかん}へ {行|い}きます。', '{私|わたし}は {図書館|としょかん}を {行|い}きます。 | {私|わたし}は {図書館|としょかん}が {行|い}きます。 | {私|わたし}は {図書館|としょかん}の {行|い}きます。', 'Đi đâu → へ.'),
      Q('Câu nào đúng?', '{私|わたし}は パンを {食|た}べます。', '{私|わたし}は パンへ {食|た}べます。 | {私|わたし}は パンで {食|た}べます。 | {私|わたし}は パンの {食|た}べます。', 'Ăn gì → を.'),
      Q('Câu nào đúng? (về nhà)', 'うちへ {帰|かえ}ります。', 'うちへ {行|い}きます。 | うちを {帰|かえ}ります。 | うちで {帰|かえ}ります。', 'Về nhà mình → 帰ります.'),
      Q('Câu nào đúng?', '{何|なに}を {食|た}べますか。', '{何|なに}へ {食|た}べますか。 | {何|なに}が {食|た}べますか。 | {何|なに}で {食|た}べますか。', '何を〜ますか.'),
      Q('Câu nào đúng?', 'どこへ {行|い}きますか。', 'どこを {行|い}きますか。 | どこで {行|い}きますか。 | どこが {行|い}きますか。', 'どこへ行きますか.'),
      Q('Câu nào đúng?', 'スキーを します。', 'スキーへ します。 | スキーが します。 | スキーに します。', 'N + を + します.'),
      Q('Câu nào đúng khi trả lời 「コーヒーを{飲|の}みますか」 (không uống)?', 'いいえ、{飲|の}みません。', 'いいえ、そうです。 | いいえ、{飲|の}みます。 | はい、{飲|の}みません。', 'いいえ + động từ phủ định.'),
      Q('Câu nào đúng?', '{私|わたし}は {毎朝|まいあさ} {新聞|しんぶん}を {読|よ}みます。', '{私|わたし}は {毎朝|まいあさ} {新聞|しんぶん}へ {読|よ}みます。 | {私|わたし}は {毎朝|まいあさ} {新聞|しんぶん}で {読|よ}みます。 | {私|わたし}は {毎朝|まいあさ} {新聞|しんぶん}の {読|よ}みます。', '読む → を.'),
    ]),

    H(`${LV.kho} — H. Dịch Việt → Nhật (gõ tay, 8 câu)`),
    QZ('lt-b3-g1-dich', 'H. Dịch sang tiếng Nhật', 'translate', [
      AD('Tôi uống sữa mỗi sáng.', ['{毎朝|まいあさ}、{牛乳|ぎゅうにゅう}を{飲|の}みます。', '{私|わたし}は{毎朝|まいあさ}{牛乳|ぎゅうにゅう}を{飲|の}みます。'], '毎朝・を'),
      AD('Chủ nhật tôi đi thư viện.', ['{日曜日|にちようび}、{図書館|としょかん}へ{行|い}きます。', '{私|わたし}は{日曜日|にちようび}{図書館|としょかん}へ{行|い}きます。'], 'へ'),
      AD('Tôi không xem ti vi.', ['{私|わたし}はテレビを{見|み}ません。', 'テレビを{見|み}ません。'], '見ません'),
      AD('Bạn mua gì?', ['{何|なに}を{買|か}いますか。', 'あなたは{何|なに}を{買|か}いますか。'], '何を'),
      AD('Nghỉ hè tôi về nước.', ['{夏休|なつやす}み、{国|くに}へ{帰|かえ}ります。', '{私|わたし}は{夏休|なつやす}み、{国|くに}へ{帰|かえ}ります。'], '帰ります'),
      AD('Buổi tối tôi nghe CD.', ['{夜|よる}、CDを{聞|き}きます。', '{私|わたし}は{夜|よる}CDを{聞|き}きます。'], '聞きます'),
      AD('Hằng ngày tôi học tiếng Nhật.', ['{毎日|まいにち}、{日本語|にほんご}を{勉強|べんきょう}します。', '{私|わたし}は{毎日|まいにち}{日本語|にほんご}を{勉強|べんきょう}します。'], '勉強します'),
      AD('Bạn có ăn sáng không?', ['{朝|あさ}ご{飯|はん}を{食|た}べますか。', 'あなたは{朝|あさ}ご{飯|はん}を{食|た}べますか。'], '朝ご飯'),
    ], 'N は N を V ます ／ N へ V ます'),

    H(`${LV.kho} — I. Ghép câu (8 câu)`),
    BUILD('lt-b3-g1-ghep-cau', 'I. Ghép các mảnh thành câu đúng', [
      BD('Tôi đọc báo.', '{私|わたし} は {新聞|しんぶん} を {読|よ}みます。', ['へ']),
      BD('Tôi đi biển vào nghỉ hè.', '{夏休|なつやす}み、 {海|うみ} へ {行|い}きます。', ['を']),
      BD('Tôi không uống rượu.', '{私|わたし} は お{酒|さけ} を {飲|の}みません。', ['へ']),
      BD('Bạn đi đâu?', 'どこ へ {行|い}きます か。', ['を']),
      BD('Tôi xem DVD ở nhà vào Chủ nhật.', '{日曜日|にちようび}、 うち で DVD を {見|み}ます。', ['へ']),
      BD('Tôi về nhà lúc 6 giờ.', '{六時|ろくじ} に うち へ {帰|かえ}ります。', ['を']),
      BD('Lin đến trường lúc 8 giờ.', '^リン-さん は {八時|はちじ} に {学校|がっこう} へ {来|き}ます。', ['を']),
      BD('Bạn lên mạng hằng ngày không?', '{毎日|まいにち}、 インターネット を します か。', ['へ']),
    ]),

    H(`${LV.kho} — J. {行|い}きます／{来|き}ます／{帰|かえ}ります (8 câu)`),
    MC('lt-b3-g1-iku-kuru', 'J. Chọn động từ chuyển động đúng', [
      Q('{私|わたし}は {毎朝|まいあさ} {八時|はちじ}に {学校|がっこう}へ＿＿＿。 (đang nói ở trường)', '{来|き}ます', '{行|い}きます | {帰|かえ}ります | {飲|の}みます', 'Đến chỗ người nói đang ở → 来ます.'),
      Q('{六時|ろくじ}に うちへ＿＿＿。', '{帰|かえ}ります', '{来|き}ます | {行|い}きます | {寝|ね}ます', 'Về nhà mình → 帰ります.'),
      Q('{日曜日|にちようび}、 {公園|こうえん}へ＿＿＿。', '{行|い}きます', '{帰|かえ}ります | {来|き}ます | {見|み}ます', 'Đi nơi khác → 行きます.'),
      Q('{夏休|なつやす}み、 {国|くに}へ＿＿＿。', '{帰|かえ}ります', '{来|き}ます | {行|い}きます | {起|お}きます', 'Về nước → 帰ります.'),
      Q('アンナさんが {私|わたし}の うちへ＿＿＿。 (đến nhà tôi)', '{来|き}ます', '{帰|かえ}ります | {行|い}きます | {読|よ}みます', 'Đến chỗ người nói → 来ます.'),
      Q('{会社|かいしゃ}へ＿＿＿。 (đi làm)', '{行|い}きます', '{帰|かえ}ります | {寝|ね}ます | {見|み}ます', '会社へ行きます.'),
      Q('「うちへ{行|い}きます」 khi nói về NHÀ MÌNH là…', 'Không tự nhiên — nên nói {帰|かえ}ります', 'Hoàn toàn đúng | Sai ngữ pháp | Chỉ đúng với trẻ em', 'Về nhà mình dùng 帰ります.'),
      Q('「{来|き}ます」 đọc là…', 'きます', 'らいます | くります | こます', '来ます = きます.'),
    ]),
  ],
};


/* ───────── 5. NGỮ PHÁP 2 — ポイント 19–20 ───────── */

const L_NP2: Lesson = {
  id: 'lt-b3-ngu-phap-2',
  kind: 'grammar',
  title: 'Luyện thêm Bài 3 — Ngữ pháp 2: に (mốc giờ／ngày) và で (nơi làm), phân biệt へ／に／で — ポイント 19–20',
  goal: 'Biết khi nào thêm に sau thời gian, khi nào KHÔNG; dùng で cho nơi hành động; phân biệt へ／に／で và hỏi–đáp 何時に・どこで — từ nhận biết đến tự viết câu.',
  minutes: 60,
  blocks: [
    HOW([
      'Ba câu hỏi tự hỏi khi gặp một chỗ trống: ① **Đó là giờ/ngày cụ thể không?** → に. ② **Đó là nơi diễn ra hành động không?** → で. ③ **Đó là nơi đến (đi/đến/về)?** → へ.',
      'Thời gian **chung chung** (毎日・毎朝・毎晩・朝・昼・夜・今) **không thêm に**. Có cả hai thì đặt chung trước, giờ sau: **朝、七時に起きます。**',
      'Lỗi hay mắc: ~~毎朝に起きます~~, ~~図書館に勉強します~~, ~~学校で行きます~~, ~~七時で寝ます~~.',
    ]),
    TABLE(
      ['Loại từ', 'Trợ từ', 'Ví dụ'],
      [
        ['Giờ/ngày cụ thể', 'に', '{七時|しちじ}**に**{起|お}きます · {火曜日|かようび}**に**アルバイトをします'],
        ['Thời gian chung', '（không có）', '{毎朝|まいあさ}、{夜|よる}、{今|いま}、{毎日|まいにち}'],
        ['Nơi làm việc', 'で', '{図書館|としょかん}**で**{勉強|べんきょう}します · コンビニ**で**{働|はたら}きます'],
        ['Nơi đến', 'へ（に）', '{学校|がっこう}**へ**{来|き}ます · {海|うみ}**へ**{行|い}きます'],
      ],
      'Ba vị trí, ba trợ từ',
    ),

    H(`${LV.de} — A. Có cần に không? (12 câu)`),
    MC('lt-b3-g2-ni-khong', 'A. Chọn に hoặc X (không cần)', [
      Q('{七時|しちじ}＿＿ {起|お}きます。', 'に', 'X (không cần) | で | を', 'Giờ cụ thể → に.'),
      Q('{毎朝|まいあさ}＿＿、 {七時|しちじ}に {起|お}きます。', 'X (không cần)', 'に | で | を', 'Sau 毎朝 không thêm に.'),
      Q('{毎晩|まいばん}＿＿、 {十一時|じゅういちじ}に {寝|ね}ます。', 'X (không cần)', 'に | で | を', 'Sau 毎晩 không thêm に.'),
      Q('{毎日|まいにち}＿＿、 {勉強|べんきょう}します。', 'X (không cần)', 'に | で | へ', 'Sau 毎日 không thêm に.'),
      Q('{朝|あさ}＿＿、 パンを {食|た}べます。', 'X (không cần)', 'に | で | へ', 'Sau 朝 (buổi chung) không thêm に.'),
      Q('{夜|よる}＿＿、 テレビを {見|み}ます。', 'X (không cần)', 'に | で | へ', 'Sau 夜 không thêm に.'),
      Q('{今|いま}＿＿、 {何時|なんじ}ですか。', 'X (không cần)', 'に | で | を', 'Sau 今 không thêm に.'),
      Q('{六時半|ろくじはん}＿＿ {起|お}きます。', 'に', 'X (không cần) | で | を', '6 giờ rưỡi → に.'),
      Q('{火曜日|かようび}＿＿ アルバイトを します。', 'に', 'で | を | へ', 'Thứ cụ thể → に (có thể bỏ nhưng nên có).'),
      Q('{五月|ごがつ}{三日|みっか}＿＿ お{花見|はなみ}を します。', 'に', 'で | を | X (không cần)', 'Ngày tháng cụ thể → に.'),
      Q('{八時|はちじ}＿＿ {学校|がっこう}へ {来|き}ます。', 'に', 'で | を | X (không cần)', '8 giờ → に.'),
      Q('{何時|なんじ}＿＿ {寝|ね}ますか。', 'に', 'で | を | X (không cần)', 'Hỏi giờ → 何時に.'),
    ]),

    H(`${LV.de} — B. Chọn に／で／へ／を (14 câu)`),
    MC('lt-b3-g2-chon', 'B. Điền trợ từ', [
      Q('{図書館|としょかん}＿＿ {勉強|べんきょう}します。', 'で', 'に | へ | を', 'Nơi làm việc → で.'),
      Q('{図書館|としょかん}＿＿ {行|い}きます。', 'へ', 'で | を | が', 'Đích đến → へ.'),
      Q('コンビニ＿＿ {働|はたら}きます。', 'で', 'へ | を | に', 'Nơi làm việc → で.'),
      Q('{会社|かいしゃ}＿＿ {行|い}きます。', 'へ', 'で | を | が', 'Đích đến → へ.'),
      Q('{学校|がっこう}＿＿ お{弁当|べんとう}を {食|た}べます。', 'で', 'へ | に | が', 'Nơi ăn → で.'),
      Q('うち＿＿ テレビを {見|み}ます。', 'で', 'へ | に | が', 'Nơi xem → で.'),
      Q('{公園|こうえん}＿＿ バーベキューを します。', 'で', 'へ | に | が', 'Nơi nướng → で.'),
      Q('{海|うみ}＿＿ {行|い}きます。', 'へ', 'で | を | が', 'Đích đến → へ.'),
      Q('{六時|ろくじ}＿＿ うちへ {帰|かえ}ります。', 'に', 'で | を | が', 'Giờ → に.'),
      Q('{十一時|じゅういちじ}＿＿ {寝|ね}ます。', 'に', 'で | を | が', 'Giờ → に.'),
      Q('{日曜日|にちようび}＿＿ {公園|こうえん}＿＿ {行|い}きます。', 'に / へ', 'で / を | へ / に | を / で', 'Thứ → に; đích → へ.'),
      Q('{午後|ごご}、 コンビニ＿＿ アルバイト＿＿ します。', 'で / を', 'に / を | へ / で | を / で', 'Nơi → で; vật → を.'),
      Q('{朝|あさ}、 {家|うち}＿＿ コーヒー＿＿ {飲|の}みます。', 'で / を', 'を / で | に / を | へ / で', 'Nơi → で; vật → を.'),
      Q('どこ＿＿ {勉強|べんきょう}しますか。', 'で', 'へ | を | が', 'Hỏi nơi làm việc → どこで.'),
    ]),

    H(`${LV.vua} — C. Điền trợ từ — gõ tay (12 câu)`),
    QZ('lt-b3-g2-go', 'C. Gõ trợ từ vào chỗ trống (nếu không cần, gõ X)', 'fill', [
      A('{毎朝|まいあさ}、 {六時|ろくじ}（　）{起|お}きます。', 'に'),
      A('{毎晩|まいばん}（　）、 {十時|じゅうじ}に {寝|ね}ます。', ['X', 'x', 'Ｘ']),
      A('{図書館|としょかん}（　）{勉強|べんきょう}します。', 'で'),
      A('{学校|がっこう}（　）{来|き}ます。', ['へ', 'に']),
      A('{会社|かいしゃ}（　）{働|はたら}きます。', 'で'),
      A('{七時半|しちじはん}（　）{朝|あさ}ご{飯|はん}を {食|た}べます。', 'に'),
      A('{水曜日|すいようび}（　）{図書館|としょかん}へ {行|い}きます。', 'に'),
      A('{昼|ひる}（　）、 うちで ごはんを {食|た}べます。 ※ chỉ gõ trợ từ sau 昼 (không cần thì gõ X)', ['X', 'x', 'Ｘ']),
      A('どこ（　）{昼|ひる}ごはんを {食|た}べますか。', 'で'),
      A('{何時|なんじ}（　）{起|お}きますか。', 'に'),
      A('コンビニ（　）アルバイトを します。', 'で'),
      A('{九時|くじ}（　）{学校|がっこう}（　）{来|き}ます。 (gõ hai trợ từ cách nhau bằng dấu cách)', ['に へ', 'に に']),
    ], 'に／で／へ／X'),

    H(`${LV.vua} — D. Hỏi – đáp {何時|なんじ}に・どこで (10 câu)`),
    MC('lt-b3-g2-hoi-dap', 'D. Chọn câu trả lời đúng', [
      Q('「{何時|なんじ}に{起|お}きますか。」', '{七時|しちじ}に{起|お}きます。', '{七時|しちじ}で{起|お}きます。 | {七時|しちじ}を{起|お}きます。 | {七時|しちじ}へ{起|お}きます。', '何時に → 〜時に.'),
      Q('「どこで{勉強|べんきょう}しますか。」', '{図書館|としょかん}で{勉強|べんきょう}します。', '{図書館|としょかん}へ{勉強|べんきょう}します。 | {図書館|としょかん}を{勉強|べんきょう}します。 | {図書館|としょかん}に{勉強|べんきょう}します。', 'どこで → 〜で.'),
      Q('「どこで{働|はたら}きますか。」', 'コンビニで{働|はたら}きます。', 'コンビニへ{働|はたら}きます。 | コンビニを{働|はたら}きます。 | コンビニの{働|はたら}きます。', 'どこで → 〜で.'),
      Q('「{何曜日|なんようび}にアルバイトをしますか。」', '{火曜日|かようび}にします。', '{火曜日|かようび}でします。 | {火曜日|かようび}をします。 | {火曜日|かようび}へします。', '何曜日に → 〜曜日に.'),
      Q('「{昼|ひる}ごはんは どこで{食|た}べますか。」', '{学校|がっこう}で{食|た}べます。', '{学校|がっこう}へ{食|た}べます。 | {学校|がっこう}を{食|た}べます。 | {学校|がっこう}が{食|た}べます。', 'どこで → 〜で.'),
      Q('「{何時|なんじ}に{寝|ね}ますか。」', '{十一時|じゅういちじ}に{寝|ね}ます。', '{十一時|じゅういちじ}で{寝|ね}ます。 | {十一時|じゅういちじ}へ{寝|ね}ます。 | {十一時|じゅういちじ}を{寝|ね}ます。', '何時に → 〜時に.'),
      Q('「どこへ{行|い}きますか。」', '{公園|こうえん}へ{行|い}きます。', '{公園|こうえん}で{行|い}きます。 | {公園|こうえん}を{行|い}きます。 | {公園|こうえん}の{行|い}きます。', 'どこへ → 〜へ.'),
      Q('「{毎朝|まいあさ}、 {何時|なんじ}に{学校|がっこう}へ{来|き}ますか。」', '{八時|はちじ}に{来|き}ます。', '{八時|はちじ}へ{来|き}ます。 | {八時|はちじ}で{来|き}ます。 | {八時|はちじ}を{来|き}ます。', '何時に → 〜時に.'),
      Q('「{図書館|としょかん}で{何|なに}をしますか。」', '{本|ほん}を{読|よ}みます。', '{本|ほん}で{読|よ}みます。 | {本|ほん}へ{読|よ}みます。 | {本|ほん}に{読|よ}みます。', '何を → 〜を.'),
      Q('「{夜|よる}、 うちで{何|なに}をしますか。」', 'テレビを{見|み}ます。', 'テレビで{見|み}ます。 | テレビへ{見|み}ます。 | テレビに{見|み}ます。', '何を → 〜を.'),
    ]),

    H(`${LV.vua} — E. Câu nào đúng? (8 câu)`),
    MC('lt-b3-g2-sua', 'E. Chọn câu đúng', [
      Q('Câu nào đúng?', '{毎朝|まいあさ}、 {七時|しちじ}に {起|お}きます。', '{毎朝|まいあさ}に、 {七時|しちじ}に {起|お}きます。 | {毎朝|まいあさ}、 {七時|しちじ}で {起|お}きます。 | {毎朝|まいあさ}を、 {七時|しちじ}に {起|お}きます。', 'Sau 毎朝 không có に.'),
      Q('Câu nào đúng?', '{図書館|としょかん}で {勉強|べんきょう}します。', '{図書館|としょかん}に {勉強|べんきょう}します。 | {図書館|としょかん}を {勉強|べんきょう}します。 | {図書館|としょかん}の {勉強|べんきょう}します。', 'Nơi làm → で.'),
      Q('Câu nào đúng?', '{学校|がっこう}へ {行|い}きます。', '{学校|がっこう}で {行|い}きます。 | {学校|がっこう}を {行|い}きます。 | {学校|がっこう}が {行|い}きます。', 'Đích → へ.'),
      Q('Câu nào đúng?', '{十一時|じゅういちじ}に {寝|ね}ます。', '{十一時|じゅういちじ}で {寝|ね}ます。 | {十一時|じゅういちじ}を {寝|ね}ます。 | {十一時|じゅういちじ}の {寝|ね}ます。', 'Giờ → に.'),
      Q('Câu nào đúng?', '{夜|よる}、 うちで テレビを {見|み}ます。', '{夜|よる}に、 うちへ テレビを {見|み}ます。 | {夜|よる}で、 うちに テレビを {見|み}ます。 | {夜|よる}を、 うちで テレビへ {見|み}ます。', '夜 (chung) + nơi で + vật を.'),
      Q('Câu nào đúng?', '{月曜日|げつようび}に {図書館|としょかん}へ {行|い}きます。', '{月曜日|げつようび}で {図書館|としょかん}へ {行|い}きます。 | {月曜日|げつようび}を {図書館|としょかん}へ {行|い}きます。 | {月曜日|げつようび}に {図書館|としょかん}で {行|い}きます。', 'Thứ → に; đích → へ.'),
      Q('Câu nào đúng? (sáng tôi ăn ở nhà)', '{朝|あさ}、 うちで {食|た}べます。', '{朝|あさ}に、 うちへ {食|た}べます。 | {朝|あさ}を、 うちで {食|た}べます。 | {朝|あさ}で、 うちに {食|た}べます。', 'Sau 朝 không có に; nơi ăn = で.'),
      Q('Câu nào SAI?', '{毎晩|まいばん}に {十一時|じゅういちじ}に {寝|ね}ます。', '{毎晩|まいばん}、 {十一時|じゅういちじ}に {寝|ね}ます。 | {毎晩|まいばん}は {十一時|じゅういちじ}に {寝|ね}ます。 | {十一時|じゅういちじ}に {寝|ね}ます。', '毎晩に là sai.'),
    ]),

    H(`${LV.kho} — F. Dịch Việt → Nhật (gõ tay, 8 câu)`),
    QZ('lt-b3-g2-dich', 'F. Dịch sang tiếng Nhật', 'translate', [
      AD('Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.', ['{毎朝|まいあさ}、{6時半|ろくじはん}に{起|お}きます。', '{私|わたし}は{毎朝|まいあさ}{6時半|ろくじはん}に{起|お}きます。'], '毎朝・に'),
      AD('Tôi học ở thư viện.', ['{図書館|としょかん}で{勉強|べんきょう}します。'], 'で'),
      AD('Tôi ngủ lúc 11 giờ.', ['{11時|じゅういちじ}に{寝|ね}ます。'], '時に'),
      AD('Buổi chiều tôi làm việc ở công ty.', ['{午後|ごご}、{会社|かいしゃ}で{働|はたら}きます。', '{午後|ごご}は{会社|かいしゃ}で{働|はたら}きます。'], 'で・働きます'),
      AD('Bạn ăn trưa ở đâu?', ['{昼|ひる}ごはんはどこで{食|た}べますか。', 'どこで{昼|ひる}ごはんを{食|た}べますか。'], 'どこで'),
      AD('Tôi đến trường lúc 8 giờ.', ['{8時|はちじ}に{学校|がっこう}へ{来|き}ます。', '{私|わたし}は{8時|はちじ}に{学校|がっこう}へ{来|き}ます。'], 'に・へ'),
      AD('Thứ Ba tôi làm thêm ở cửa hàng tiện lợi.', ['{火曜日|かようび}に、コンビニでアルバイトをします。', '{火曜日|かようび}、コンビニでアルバイトをします。', '{火曜日|かようび}にコンビニでアルバイトをします。'], 'に・で'),
      AD('Mấy giờ bạn thức dậy mỗi sáng?', ['{毎朝|まいあさ}、{何時|なんじ}に{起|お}きますか。', '{何時|なんじ}に{起|お}きますか。'], '何時に'),
    ], 'N に V ／ N で V'),

    H(`${LV.kho} — G. Ghép câu (8 câu)`),
    BUILD('lt-b3-g2-ghep', 'G. Ghép các mảnh thành câu đúng', [
      BD('Sáng nào tôi cũng ăn sáng ở nhà.', '{毎朝|まいあさ}、 うち で {朝|あさ}ご{飯|はん} を {食|た}べます。', ['に']),
      BD('Tôi đi ngủ lúc 11 giờ.', '{十一時|じゅういちじ} に {寝|ね}ます。', ['で']),
      BD('Tôi học tiếng Nhật ở trường.', '{学校|がっこう} で {日本語|にほんご} を {勉強|べんきょう}します。', ['へ']),
      BD('Tôi đến công ty lúc 9 giờ.', '{九時|くじ} に {会社|かいしゃ} へ {行|い}きます。', ['で']),
      BD('Chiều thứ Bảy tôi làm thêm ở cửa hàng tiện lợi.', '{土曜日|どようび} の {午後|ごご}、 コンビニ で アルバイト を します。', ['へ']),
      BD('Bạn học ở đâu?', 'どこ で {勉強|べんきょう}します か。', ['へ']),
      BD('Bạn ngủ lúc mấy giờ mỗi tối?', '{毎晩|まいばん}、 {何時|なんじ} に {寝|ね}ます か。', ['で']),
      BD('Tôi ăn trưa ở trường.', '{昼|ひる}ごはん は {学校|がっこう} で {食|た}べます。', ['へ']),
    ]),

    H(`${LV.kho} — H. Điền trợ từ trong đoạn văn (10 câu)`),
    ...PSG('{私|わたし}の{一日|いちにち} (có chỗ trống)', [
      ['{私|わたし} は {毎朝|まいあさ}、 {六時|ろくじ} ① {起|お}きます。', 'Sáng nào tôi cũng dậy lúc 6 giờ.'],
      ['{朝|あさ}ご{飯|はん} ② {食|た}べます。', 'Tôi ăn sáng.'],
      ['{八時|はちじ} ③ {学校|がっこう} ④ {行|い}きます。', 'Tám giờ tôi đến trường.'],
      ['{学校|がっこう} ⑤ {日本語|にほんご} ⑥ {勉強|べんきょう}します。', 'Ở trường tôi học tiếng Nhật.'],
      ['{午後|ごご}、 コンビニ ⑦ {働|はたら}きます。', 'Buổi chiều tôi làm việc ở cửa hàng tiện lợi.'],
      ['{毎晩|まいばん}、 {十一時|じゅういちじ} ⑧ {寝|ね}ます。', 'Tối nào tôi cũng ngủ lúc 11 giờ.'],
    ], 'Điền ① ～ ⑧ ở bài tập bên dưới.'),
    MC('lt-b3-g2-doan', 'H. Chọn trợ từ cho chỗ trống ① ～ ⑧', [
      Q('①', 'に', 'で | を | へ', '六時 → に.'),
      Q('②', 'を', 'に | で | へ', '朝ご飯 → を.'),
      Q('③', 'に', 'で | を | が', '八時 → に.'),
      Q('④', 'へ', 'で | を | が', '学校へ行きます.'),
      Q('⑤', 'で', 'に | へ | を', '学校で勉強 → で.'),
      Q('⑥', 'を', 'に | で | へ', '日本語を勉強 → を.'),
      Q('⑦', 'で', 'へ | を | に', 'コンビニで働く → で.'),
      Q('⑧', 'に', 'で | を | へ', '十一時に寝ます → に.'),
      Q('Chỗ nào KHÔNG cần trợ từ trong đoạn? ({毎朝|まいあさ} / {毎晩|まいばん})', 'Sau {毎朝|まいあさ} và {毎晩|まいばん}', 'Sau {八時|はちじ} | Sau {学校|がっこう} | Sau {午後|ごご}', '毎朝・毎晩 là thời gian chung → không に.'),
      Q('「{午後|ごご}、 コンビニ（⑦）{働|はたら}きます」 — 午後 sau có に không?', 'Không, vì {午後|ごご} là buổi chung', 'Có, bắt buộc に | Có, nếu đổi thành で | Chỉ có với {午前|ごぜん}', '午後 (buổi) không thêm に.'),
    ]),
  ],
};


/* ───────── 6. NGỮ PHÁP 3 — ポイント 21–23 ───────── */

const L_NP3: Lesson = {
  id: 'lt-b3-ngu-phap-3',
  kind: 'grammar',
  title: 'Luyện thêm Bài 3 — Ngữ pháp 3: 〜から〜まで, N1 や N2 など, 何も／どこへも〜ません — ポイント 21–23',
  goal: 'Dùng đúng から／まで cho giờ, thứ, ngày; liệt kê bằng や〜など (khác と); trả lời phủ định hoàn toàn bằng 何も／どこへも — từ nhận biết đến tự viết câu.',
  minutes: 60,
  blocks: [
    HOW([
      '**から** = từ (điểm đầu), **まで** = đến (điểm cuối). Luôn đi **cặp**; sau まで **không** thêm に. Có thể chỉ dùng một nửa: 九時**から**です (bắt đầu từ 9 giờ), 三時**まで**です (đến 3 giờ).',
      '**や** liệt kê **ví dụ** (còn nữa) và hay đi với **など**; **と** liệt kê **đủ**. **何も／どこへも** bắt buộc đi với **ません**, và **bỏ を**.',
      'Lỗi hay mắc: ~~九時までから~~ (đảo), ~~何もを食べません~~, ~~何も食べます~~, ~~パンやサラダとを~~.',
    ]),
    TABLE(
      ['Điểm', 'Công thức', 'Ví dụ'],
      [
        ['21', '〜 から 〜 まで', '{九時|くじ}から{三時|さんじ}まで · {月曜日|げつようび}から{金曜日|きんようび}まで'],
        ['21', 'いつから いつまで', '{夏休|なつやす}みは いつから いつまでですか'],
        ['22', 'N1 や N2 （など）を V', 'パンや{果物|くだもの}などを{食|た}べます'],
        ['23', '何も V ません', '{朝|あさ}、{何|なに}も{食|た}べません'],
        ['23', 'どこ（へ）も {行|い}きません', '{日曜日|にちようび}、どこへも{行|い}きません'],
      ],
      'Ba điểm của buổi này',
    ),

    H(`${LV.de} — A. から／まで (12 câu)`),
    MC('lt-b3-g3-kara-made', 'A. Chọn から hoặc まで', [
      Q('{図書館|としょかん}は {九時|くじ}＿＿ です。 (bắt đầu từ 9 giờ)', 'から', 'まで | に | を', 'Điểm đầu → から.'),
      Q('{銀行|ぎんこう}は {三時|さんじ}＿＿ です。 (đến 3 giờ)', 'まで', 'から | に | へ', 'Điểm cuối → まで.'),
      Q('{九時|くじ}＿＿ {五時|ごじ}＿＿ {働|はたら}きます。', 'から / まで', 'まで / から | に / へ | を / が', 'Từ 9 đến 5.'),
      Q('{月曜日|げつようび}＿＿ {金曜日|きんようび}＿＿ です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ thứ Hai đến thứ Sáu.'),
      Q('{夏休|なつやす}みは いつ＿＿ いつ＿＿ ですか。', 'から / まで', 'まで / から | に / で | を / が', 'Từ bao giờ đến bao giờ.'),
      Q('{七月|しちがつ}{二十日|はつか}＿＿ {八月|はちがつ}{三十一日|さんじゅういちにち}＿＿ です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ 20/7 đến 31/8.'),
      Q('{何時|なんじ}＿＿ {何時|なんじ}＿＿ ですか。', 'から / まで', 'まで / から | に / で | を / が', 'Từ mấy giờ đến mấy giờ.'),
      Q('{何曜日|なんようび}＿＿ {何曜日|なんようび}＿＿ ですか。', 'から / まで', 'まで / から | に / で | を / が', 'Từ thứ mấy đến thứ mấy.'),
      Q('{体育館|たいいくかん}は {午後|ごご}{十時|じゅうじ}＿＿ です。', 'まで', 'から | に | が', 'Đến 10 giờ tối.'),
      Q('{授業|じゅぎょう}は {九時|くじ}＿＿ です。', 'から', 'まで | に | が', 'Bắt đầu từ 9 giờ.'),
      Q('Sau 「まで」 có thêm 「に」 không?', 'Không (~~{九時|くじ}までに~~ là mẫu khác, chưa học)', 'Có, luôn có | Chỉ có với {午後|ごご} | Chỉ có với thứ', 'Bài 3 chỉ dùng まで.'),
      Q('「A から B まで」 — thứ tự đúng là…', 'から (đầu) → まで (cuối)', 'まで (đầu) → から (cuối) | から の あとに まで なし | まで だけ', 'Điểm đầu から, điểm cuối まで.'),
    ]),

    H(`${LV.de} — B. や ↔ と, など (10 câu)`),
    MC('lt-b3-g3-ya-to', 'B. Liệt kê', [
      Q('パン＿＿ サラダ＿＿ {食|た}べます。 (đúng 2 món, hết)', 'と / を', 'や / など | が / を | に / を', 'と = liệt kê đủ.'),
      Q('パン＿＿ {果物|くだもの}＿＿ などを {食|た}べます。 (ví dụ)', 'や', 'と | が | に', 'や + など = ví dụ.'),
      Q('{牛乳|ぎゅうにゅう}＿＿ コーヒー＿＿ などを {飲|の}みます。', 'や', 'と | を | が', 'や … など.'),
      Q('{朝|あさ}、 パンや サラダ＿＿ を {食|た}べます。', 'など', 'と | に | で', '…や…などを.'),
      Q('テレビ＿＿ DVD＿＿ などを {見|み}ます。', 'や', 'と | を | に', 'や … など.'),
      Q('「パンや サラダを {食|た}べます」 nghĩa là…', 'Ăn bánh mì, salad (và có thể thêm món khác)', 'Chỉ ăn bánh mì và salad, không gì khác | Không ăn bánh mì | Ăn salad trước bánh mì', 'や = ví dụ, còn nữa.'),
      Q('「パンと サラダを {食|た}べます」 nghĩa là…', 'Ăn bánh mì và salad (đúng hai món)', 'Ăn nhiều món khác | Không ăn salad | Chỉ ăn bánh mì', 'と = liệt kê đủ.'),
      Q('Câu nào đúng?', 'パンや{果物|くだもの}などを{食|た}べます。', 'パンや{果物|くだもの}とを{食|た}べます。 | パンや{果物|くだもの}をなどを{食|た}べます。 | パンが{果物|くだもの}などを{食|た}べます。', 'や + など + を.'),
      Q('「など」 nghĩa là…', 'Vân vân (v.v.)', 'Cũng | Chỉ | Khoảng', 'など = những thứ tương tự.'),
      Q('や cần ít nhất mấy danh từ?', 'Hai', 'Một | Ba | Không cần', 'N1 や N2.'),
    ]),

    H(`${LV.de} — C. {何|なに}を ↔ {何|なに}も, どこへ ↔ どこへも (12 câu)`),
    MC('lt-b3-g3-nanimo', 'C. Chọn を／も', [
      Q('{朝|あさ}、 {何|なに}＿＿ {食|た}べません。 (không ăn gì cả)', 'も', 'を | が | に', '何も + ません.'),
      Q('{朝|あさ}、 {何|なに}＿＿ {食|た}べますか。 (ăn gì?)', 'を', 'も | が | に', '何を + ますか.'),
      Q('{日曜日|にちようび}、 どこへ＿＿ {行|い}きません。', 'も', 'を | が | で', 'どこへも + ません.'),
      Q('{日曜日|にちようび}、 どこ＿＿ {行|い}きますか。', 'へ', 'を | も | が', 'どこへ + ますか.'),
      Q('{夜|よる}、 {何|なに}も＿＿。', '{勉強|べんきょう}しません', '{勉強|べんきょう}します | {勉強|べんきょう}しますか | {勉強|べんきょう}ます', '何も + phủ định.'),
      Q('「{何|なに}を{飲|の}みますか。」 → 「＿＿＿」 (không uống gì)', '{何|なに}も{飲|の}みません。', '{何|なに}を{飲|の}みません。 | {何|なに}も{飲|の}みます。 | どこへも{飲|の}みません。', '何も飲みません.'),
      Q('「どこへ{行|い}きますか。」 → 「＿＿＿」 (không đi đâu)', 'どこへも{行|い}きません。', 'どこを{行|い}きません。 | どこへ{行|い}きます。 | {何|なに}も{行|い}きません。', 'どこへも行きません.'),
      Q('「{何|なに}もを{食|た}べません」 là…', 'Sai — bỏ を', 'Đúng | Đúng khi nói nhanh | Chỉ đúng với お{弁当|べんとう}', '{何|なに}も + V, không có を.'),
      Q('「{何|なに}も{食|た}べます」 là…', 'Sai — {何|なに}も phải đi với ません', 'Đúng | Chỉ đúng buổi sáng | Đúng nếu thêm ね', '何も luôn đi với phủ định.'),
      Q('「どこも{行|い}きません」 so với 「どこへも{行|い}きません」…', 'Cùng nghĩa (không đi đâu cả)', 'Khác hoàn toàn | Câu đầu sai | Câu sau sai', 'どこも／どこへも đều dùng được.'),
      Q('「{夏休|なつやす}み、 どこへも{行|い}きません。」 nghĩa là…', 'Nghỉ hè tôi không đi đâu cả', 'Nghỉ hè tôi đi mọi nơi | Nghỉ hè tôi về nước | Nghỉ hè tôi ngủ', 'どこへも + ません.'),
      Q('「{朝|あさ}、 {何|なに}も{食|た}べません。コーヒーを{飲|の}みます。」 — ý đúng là…', 'Không ăn gì, chỉ uống cà phê', 'Ăn rồi uống cà phê | Không uống gì | Không ăn lẫn không uống', '2 câu liên tiếp.'),
    ]),

    H(`${LV.vua} — D. Gõ trợ từ／từ (12 câu)`),
    QZ('lt-b3-g3-go', 'D. Gõ vào chỗ trống', 'fill', [
      A('{図書館|としょかん}は {九時|くじ}（　）{七時|しちじ}です。 (từ… đến…)', 'から'),
      A('{銀行|ぎんこう}は {月曜日|げつようび}から {金曜日|きんようび}（　）です。', 'まで'),
      A('{夏休|なつやす}みは いつ（　）いつまでですか。', 'から'),
      A('{夏休|なつやす}みは いつから いつ（　）ですか。', 'まで'),
      A('パン（　）{果物|くだもの}などを {食|た}べます。', 'や'),
      A('{牛乳|ぎゅうにゅう}や コーヒー（　）を {飲|の}みます。', 'など'),
      A('{朝|あさ}、 {何|なに}（　）{食|た}べません。', 'も'),
      A('{日曜日|にちようび}、 どこへ（　）{行|い}きません。', 'も'),
      A('{夜|よる}、 {何|なに}（　）しません。', 'も'),
      A('テレビ（　）DVDなどを {見|み}ます。', 'や'),
      A('{何時|なんじ}から{何時|なんじ}（　）ですか。', 'まで'),
      A('{何曜日|なんようび}（　）{何曜日|なんようび}までですか。', 'から'),
    ], 'から／まで ・ や／など ・ 何も／どこへも'),

    H(`${LV.vua} — E. Hỏi – đáp (10 câu)`),
    MC('lt-b3-g3-hoi-dap', 'E. Chọn câu trả lời đúng', [
      Q('「{図書館|としょかん}は {何時|なんじ}から{何時|なんじ}までですか。」', '{九時|くじ}から{七時|しちじ}までです。', '{九時|くじ}まで{七時|しちじ}からです。 | {九時|くじ}に{七時|しちじ}までです。 | {九時|くじ}から{七時|しちじ}にです。', 'から → まで theo thứ tự.'),
      Q('「{銀行|ぎんこう}は {何曜日|なんようび}から{何曜日|なんようび}までですか。」', '{月曜日|げつようび}から{金曜日|きんようび}までです。', '{月曜日|げつようび}まで{金曜日|きんようび}からです。 | {九時|くじ}から{三時|さんじ}までです。 | {月曜日|げつようび}に{金曜日|きんようび}です。', 'Hỏi thứ → trả lời thứ.'),
      Q('「{夏休|なつやす}みは いつからいつまでですか。」', '{七月|しちがつ}{二十日|はつか}から{八月|はちがつ}{三十一日|さんじゅういちにち}までです。', '{七月|しちがつ}{二十日|はつか}までから{八月|はちがつ}です。 | {七時|しちじ}から{八時|はちじ}までです。 | {月曜日|げつようび}です。', 'Hỏi いつ → trả lời ngày/tháng.'),
      Q('「{朝|あさ}、 {何|なに}を{食|た}べますか。」', 'パンや{果物|くだもの}などを{食|た}べます。', 'パンや{果物|くだもの}などへ{食|た}べます。 | パンが{果物|くだもの}などを{食|た}べます。 | パンと{果物|くだもの}などで{食|た}べます。', 'や…など + を.'),
      Q('「{朝|あさ}、 {何|なに}を{飲|の}みますか。」 → "không uống gì"', '{何|なに}も{飲|の}みません。', '{何|なに}を{飲|の}みません。 | {何|なに}も{飲|の}みます。 | どこも{飲|の}みません。', '何も + ません.'),
      Q('「{日曜日|にちようび}、 どこへ{行|い}きますか。」 → "không đi đâu"', 'どこへも{行|い}きません。', 'どこを{行|い}きません。 | {何|なに}も{行|い}きません。 | どこへ{行|い}きます。', 'どこへも + ません.'),
      Q('「{休|やす}みの{日|ひ}、 {何|なに}をしますか。」', 'テレビやDVDを{見|み}ます。', 'テレビやDVDへ{見|み}ます。 | テレビやDVDで{見|み}ます。 | テレビやDVDが{見|み}ます。', 'や + を.'),
      Q('「{昼|ひる}{休|やす}みは {何時|なんじ}までですか。」', '{一時|いちじ}までです。', '{一時|いちじ}からです。 | {一時|いちじ}にです。 | {一日|いちにち}です。', 'まで.'),
      Q('「{図書館|としょかん}で {何|なに}を しますか。」', '{本|ほん}や{新聞|しんぶん}を{読|よ}みます。', '{本|ほん}や{新聞|しんぶん}へ{読|よ}みます。 | {本|ほん}や{新聞|しんぶん}で{読|よ}みます。 | {本|ほん}と{新聞|しんぶん}が{読|よ}みます。', 'や + を.'),
      Q('「{毎日|まいにち}、 インターネットを しますか。」 → "không"', 'いいえ、しません。', 'いいえ、そうです。 | はい、しません。 | いいえ、します。', 'いいえ + しません.'),
    ]),

    H(`${LV.vua} — F. Câu nào đúng? (8 câu)`),
    MC('lt-b3-g3-sua', 'F. Chọn câu đúng', [
      Q('Câu nào đúng?', '{銀行|ぎんこう}は {九時|くじ}から {三時|さんじ}までです。', '{銀行|ぎんこう}は {九時|くじ}まで {三時|さんじ}からです。 | {銀行|ぎんこう}は {九時|くじ}に {三時|さんじ}までです。 | {銀行|ぎんこう}を {九時|くじ}から {三時|さんじ}までです。', 'から → まで.'),
      Q('Câu nào đúng?', '{朝|あさ}、 {何|なに}も {食|た}べません。', '{朝|あさ}、 {何|なに}もを {食|た}べません。 | {朝|あさ}、 {何|なに}も {食|た}べます。 | {朝|あさ}、 {何|なに}へも {食|た}べません。', '何も + V ません.'),
      Q('Câu nào đúng?', '{日曜日|にちようび}、 どこへも {行|い}きません。', '{日曜日|にちようび}、 どこへも {行|い}きます。 | {日曜日|にちようび}、 どこをも {行|い}きません。 | {日曜日|にちようび}、 どこでも {行|い}きません。', 'どこへも + ません.'),
      Q('Câu nào đúng?', 'パンや サラダなどを {食|た}べます。', 'パンや サラダとを {食|た}べます。 | パンが サラダなどを {食|た}べます。 | パンや サラダなどに {食|た}べます。', 'や…などを.'),
      Q('Câu nào đúng?', '{休|やす}みは {土曜日|どようび}と {日曜日|にちようび}です。', '{休|やす}みは {土曜日|どようび}や {日曜日|にちようび}です。 | {休|やす}みは {土曜日|どようび}に {日曜日|にちようび}です。 | {休|やす}みは {土曜日|どようび}を {日曜日|にちようび}です。', 'Hai ngày nghỉ cố định → と.'),
      Q('Câu nào đúng?', '{夏休|なつやす}みは いつから いつまでですか。', '{夏休|なつやす}みは いつまで いつからですか。 | {夏休|なつやす}みは いつに いつまでですか。 | {夏休|なつやす}みは いつから いつにですか。', 'Thứ tự から → まで.'),
      Q('Câu nào SAI?', '{何|なに}を {食|た}べません。 (nghĩa "không ăn gì cả")', '{何|なに}も {食|た}べません。 | {何|なに}を {食|た}べますか。 | {朝|あさ}ご{飯|はん}を {食|た}べません。', '"Không ăn gì cả" phải là 何も食べません.'),
      Q('Câu nào đúng?', 'ここで {何|なに}も しません。', 'ここで {何|なに}を しません。 | ここへ {何|なに}も しません。 | ここで {何|なに}も します。', '何も + しません.'),
    ]),

    H(`${LV.kho} — G. Dịch Việt → Nhật (gõ tay, 8 câu)`),
    QZ('lt-b3-g3-dich', 'G. Dịch sang tiếng Nhật', 'translate', [
      AD('Thư viện mở từ 9 giờ đến 7 giờ.', ['{図書館|としょかん}は{9時|くじ}から{7時|しちじ}までです。'], 'から・まで'),
      AD('Nghỉ hè từ tháng 7 đến tháng 8.', ['{夏休|なつやす}みは{7月|しちがつ}から{8月|はちがつ}までです。'], 'から・まで'),
      AD('Buổi sáng tôi ăn bánh mì, hoa quả, v.v.', ['{朝|あさ}、パンや{果物|くだもの}などを{食|た}べます。'], 'や・など'),
      AD('Tôi uống sữa, cà phê, v.v.', ['{牛乳|ぎゅうにゅう}やコーヒーなどを{飲|の}みます。', '{私|わたし}は{牛乳|ぎゅうにゅう}やコーヒーなどを{飲|の}みます。'], 'や・など'),
      AD('Buổi sáng tôi không ăn gì cả.', ['{朝|あさ}、{何|なに}も{食|た}べません。', '{朝|あさ}は{何|なに}も{食|た}べません。'], '何も'),
      AD('Chủ nhật tôi không đi đâu cả.', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。', '{日曜日|にちようび}、どこも{行|い}きません。'], 'どこへも'),
      AD('Buổi tối tôi không làm gì cả.', ['{夜|よる}、{何|なに}もしません。', '{夜|よる}は{何|なに}もしません。'], '何も'),
      AD('Ngân hàng làm từ thứ Hai đến thứ Sáu.', ['{銀行|ぎんこう}は{月曜日|げつようび}から{金曜日|きんようび}までです。'], 'から・まで'),
    ], 'から／まで ・ や／など ・ 何も／どこへも'),

    H(`${LV.kho} — H. Ghép câu (8 câu)`),
    BUILD('lt-b3-g3-ghep', 'H. Ghép các mảnh thành câu đúng', [
      BD('Nhà thi đấu mở từ thứ Ba đến Chủ nhật.', '{体育館|たいいくかん} は {火曜日|かようび} から {日曜日|にちようび} まで です。', ['に']),
      BD('Buổi trưa tôi ăn cơm hộp, salad, v.v.', '{昼|ひる}、 お{弁当|べんとう} や サラダ など を {食|た}べます。', ['と']),
      BD('Buổi sáng tôi không uống gì cả.', '{朝|あさ}、 {何|なに} も {飲|の}みません。', ['を']),
      BD('Chủ nhật tôi không đi đâu cả.', '{日曜日|にちようび}、 どこ へ も {行|い}きません。', ['を']),
      BD('Ngày nghỉ hè từ khi nào đến khi nào?', '{夏休|なつやす}み は いつ から いつ まで です か。', ['に']),
      BD('Buổi tối tôi xem ti vi, DVD, v.v.', '{夜|よる}、 テレビ や DVD など を {見|み}ます。', ['と']),
      BD('Giờ học từ 9 giờ đến 12 giờ.', '{授業|じゅぎょう} は {九時|くじ} から {十二時|じゅうにじ} まで です。', ['に']),
      BD('Tối nay tôi không làm gì cả.', '{今晩|こんばん}、 {何|なに} も しません。', ['を']),
    ]),

    H(`${LV.kho} — I. Biến thành câu phủ định hoàn toàn — gõ tay (8 câu)`),
    QZ('lt-b3-g3-phu-dinh-hoan-toan', 'I. Viết lại thành "không … gì cả／không … đâu cả"', 'translate', [
      A('{朝|あさ}、 パンを{食|た}べます。 → "không ăn gì cả"', ['{朝|あさ}、{何|なに}も{食|た}べません。', '{朝|あさ}は{何|なに}も{食|た}べません。']),
      A('{夜|よる}、 テレビを{見|み}ます。 → "không xem gì cả"', ['{夜|よる}、{何|なに}も{見|み}ません。', '{夜|よる}は{何|なに}も{見|み}ません。']),
      A('{日曜日|にちようび}、 {公園|こうえん}へ{行|い}きます。 → "không đi đâu cả"', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。', '{日曜日|にちようび}、どこも{行|い}きません。']),
      A('{毎朝|まいあさ}、 {牛乳|ぎゅうにゅう}を{飲|の}みます。 → "không uống gì cả"', ['{毎朝|まいあさ}、{何|なに}も{飲|の}みません。']),
      A('{夏休|なつやす}み、 {国|くに}へ{帰|かえ}ります。 → "không đi đâu cả"', ['{夏休|なつやす}み、どこへも{行|い}きません。', '{夏休|なつやす}み、どこも{行|い}きません。']),
      A('{土曜日|どようび}、 アルバイトをします。 → "không làm gì cả"', ['{土曜日|どようび}、{何|なに}もしません。', '{土曜日|どようび}は{何|なに}もしません。']),
      A('{昼|ひる}、 サラダを{食|た}べます。 → "không ăn gì cả"', ['{昼|ひる}、{何|なに}も{食|た}べません。', '{昼|ひる}は{何|なに}も{食|た}べません。']),
      A('{休|やす}みの{日|ひ}、 {海|うみ}へ{行|い}きます。 → "không đi đâu cả"', ['{休|やす}みの{日|ひ}、どこへも{行|い}きません。', '{休|やす}みの{日|ひ}はどこへも{行|い}きません。', '{休|やす}みの{日|ひ}、どこも{行|い}きません。']),
    ], '何も／どこへも + ません (bỏ を)'),
  ],
};


/* ───────── 7. NGỮ PHÁP TRỘN ───────── */

const L_NP_TRON: Lesson = {
  id: 'lt-b3-ngu-phap-tron',
  kind: 'grammar',
  title: 'Luyện thêm Bài 3 — Ngữ pháp trộn: trợ từ · từ để hỏi · sửa câu sai · dịch hai chiều (ポイント 16–23)',
  goal: 'Trộn tất cả ポイント của Bài 3 như đề thật: chọn trợ từ (kể cả X), từ để hỏi, sửa lỗi, hiểu nghĩa câu và dịch Việt ↔ Nhật.',
  minutes: 70,
  blocks: [
    HOW([
      'Bài trộn nên làm sau khi đã xong ba lesson ngữ pháp 1–3. Đừng tra bảng khi làm; câu nào do dự thì đánh dấu, làm xong rồi mới kiểm.',
      'Quy trình cho câu trợ từ: ① gạch chân **động từ cuối câu** ② xác định ô trống là **mốc giờ / nơi làm / nơi đến / vật / điểm đầu–cuối / liệt kê / phủ định hoàn toàn** ③ chọn trợ từ ④ đọc lại cả câu.',
      'Lỗi hay mắc: nhầm **へ／で／に** (đích ↔ nơi làm ↔ mốc giờ), thêm **に** sau 毎朝, quên **X**, dùng **何を** thay **何も**, quên **はい／いいえ**.',
    ]),
    TABLE(
      ['Ô trống là…', 'Trợ từ', 'Ví dụ'],
      [
        ['Mốc giờ／ngày cụ thể', 'に', '{七時|しちじ}**に**{起|お}きます'],
        ['Nơi làm việc／ăn／học', 'で', '{図書館|としょかん}**で**{勉強|べんきょう}します'],
        ['Nơi đến', 'へ', '{学校|がっこう}**へ**{行|い}きます'],
        ['Vật bị tác động', 'を', 'パン**を**{食|た}べます'],
        ['Điểm đầu／điểm cuối', 'から／まで', '{九時|くじ}**から**{三時|さんじ}**まで**'],
        ['Liệt kê ví dụ', 'や（など）', 'パン**や**{果物|くだもの}**など**'],
        ['Phủ định hoàn toàn', '何も／どこへも', '{何|なに}**も**{食|た}べません'],
        ['Thời gian chung／đã có に', 'X', '{毎朝|まいあさ}X、{七時|しちじ}に…'],
      ],
      'Bảng quyết định trợ từ',
    ),

    H(`${LV.de} — A. Trợ từ tổng hợp (20 câu)`),
    MC('lt-b3-tron-tro-tu', 'A. Chọn trợ từ đúng (các ô trống cách nhau bằng " / ")', [
      Q('{私|わたし}は {毎朝|まいあさ}＿＿、 {七時|しちじ}＿＿ {起|お}きます。', 'X / に', 'に / に | で / を | X / で', '毎朝 không に; 七時 → に.'),
      Q('{図書館|としょかん}＿＿ {本|ほん}＿＿ {読|よ}みます。', 'で / を', 'へ / を | に / が | で / が', 'Nơi → で; vật → を.'),
      Q('{日曜日|にちようび}、 {公園|こうえん}＿＿ {行|い}きます。', 'へ', 'で | を | が', 'Đích → へ.'),
      Q('{銀行|ぎんこう}は {九時|くじ}＿＿ {三時|さんじ}＿＿ です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ… đến…'),
      Q('{朝|あさ}、 パン＿＿ {果物|くだもの}＿＿ などを {食|た}べます。', 'や / X', 'と / を | が / に | や / を', 'や + 果物 + など を (X ở giữa là không có trợ từ thêm).'),
      Q('{朝|あさ}、 {何|なに}＿＿ {食|た}べません。', 'も', 'を | が | に', '何も + ません.'),
      Q('{日曜日|にちようび}、 どこ＿＿ {行|い}きません。', 'へも', 'へを | でも | をも', 'どこへも + ません.'),
      Q('{夜|よる}、 うち＿＿ テレビ＿＿ {見|み}ます。', 'で / を', 'へ / を | に / が | で / が', 'Nơi → で; vật → を.'),
      Q('{六時|ろくじ}＿＿ うち＿＿ {帰|かえ}ります。', 'に / へ', 'で / を | に / で | を / へ', 'Giờ → に; đích → へ.'),
      Q('コンビニ＿＿ アルバイト＿＿ します。', 'で / を', 'へ / を | に / が | で / が', 'Nơi → で; vật → を.'),
      Q('{何時|なんじ}＿＿ {寝|ね}ますか。', 'に', 'で | を | へ', '何時に.'),
      Q('どこ＿＿ {勉強|べんきょう}しますか。', 'で', 'へ | を | に', 'どこで.'),
      Q('どこ＿＿ {行|い}きますか。', 'へ', 'で | を | が', 'どこへ.'),
      Q('{何|なに}＿＿ {飲|の}みますか。', 'を', 'も | へ | で', '何を.'),
      Q('{毎晩|まいばん}＿＿、 インターネット＿＿ します。', 'X / を', 'に / を | で / を | X / へ', '毎晩 không に; インターネットをします.'),
      Q('{休|やす}みは {土曜日|どようび}＿＿ {日曜日|にちようび}です。', 'と', 'や | を | が', 'Hai ngày cố định → と.'),
      Q('{水曜日|すいようび}＿＿ {午後|ごご}、 {図書館|としょかん}＿＿ {行|い}きます。', 'の / へ', 'に / で | を / へ | の / で', '水曜日の午後 = chiều thứ Tư.'),
      Q('{八時|はちじ}＿＿ {学校|がっこう}＿＿ {来|き}ます。', 'に / へ', 'で / を | に / で | を / へ', 'Giờ → に; đích → へ.'),
      Q('{牛乳|ぎゅうにゅう}＿＿ コーヒー＿＿ などを {飲|の}みます。', 'や / X', 'と / を | が / に | や / を', 'や + コーヒー + など を.'),
      Q('{昼|ひる}＿＿、 {学校|がっこう}＿＿ お{弁当|べんとう}＿＿ {食|た}べます。', 'X / で / を', 'に / で / を | X / へ / を | X / で / が', '昼 không に; 学校で; お弁当を.'),
    ]),

    H(`${LV.de} — B. Từ để hỏi (10 câu)`),
    MC('lt-b3-tron-tu-hoi', 'B. Chọn từ để hỏi theo câu trả lời', [
      Q('A：＿＿＿ に {起|お}きますか。 B：{七時|しちじ}に {起|お}きます。', '{何時|なんじ}', '{何|なに} | どこ | いつ', 'Trả lời giờ → 何時に.'),
      Q('A：＿＿＿ へ {行|い}きますか。 B：{海|うみ}へ {行|い}きます。', 'どこ', '{何時|なんじ} | {何|なに} | だれ', 'Trả lời nơi → どこへ.'),
      Q('A：＿＿＿ を {飲|の}みますか。 B：{牛乳|ぎゅうにゅう}を {飲|の}みます。', '{何|なに}', 'どこ | {何時|なんじ} | いつ', 'Vật → 何を.'),
      Q('A：＿＿＿ で {勉強|べんきょう}しますか。 B：{図書館|としょかん}で {勉強|べんきょう}します。', 'どこ', '{何|なに} | {何時|なんじ} | いつ', 'Nơi → どこで.'),
      Q('A：{休|やす}みは ＿＿＿ ですか。 B：{日曜日|にちようび}です。', '{何曜日|なんようび}', '{何時|なんじ} | {何月|なんがつ} | {何日|なんにち}', 'Thứ → 何曜日.'),
      Q('A：テストは ＿＿＿ ですか。 B：{九月|くがつ}{十四日|じゅうよっか}です。', '{何月何日|なんがつなんにち}', '{何曜日|なんようび} | {何時|なんじ} | どこ', 'Tháng ngày → 何月何日.'),
      Q('A：{夏休|なつやす}みは ＿＿＿ から ＿＿＿ までですか。 B：{七月|しちがつ}から{八月|はちがつ}までです。', 'いつ / いつ', '{何時|なんじ} / {何時|なんじ} | どこ / どこ | {何|なに} / {何|なに}', 'Kỳ nghỉ: いつからいつまで.'),
      Q('A：＿＿＿ から ＿＿＿ まで {働|はたら}きますか。 B：{四時|よじ}から{九時|くじ}まで。', '{何時|なんじ} / {何時|なんじ}', 'いつ / いつ | どこ / どこ | {何曜日|なんようび} / {何曜日|なんようび}', 'Giờ → 何時.'),
      Q('A：{朝|あさ}、 ＿＿＿ を {食|た}べますか。 B：パンや{果物|くだもの}などを{食|た}べます。', '{何|なに}', 'どこ | いつ | {何時|なんじ}', '何を.'),
      Q('「{何|なに}」 và 「{何|なん}」 — 「{何時|なんじ}」 đọc là…', 'なんじ', 'なにじ | なんとき | なにとき', '何 trước じ/よう/が/で đọc なん.'),
    ]),

    H(`${LV.vua} — C. Tìm lỗi sai (10 câu)`),
    MC('lt-b3-tron-sua', 'C. Câu nào đúng?', [
      Q('Câu nào đúng?', '{毎朝|まいあさ}、 {七時|しちじ}に {起|お}きます。', '{毎朝|まいあさ}に、 {七時|しちじ}に {起|お}きます。 | {毎朝|まいあさ}、 {七時|しちじ}で {起|お}きます。 | {毎朝|まいあさ}、 {七時|しちじ}を {起|お}きます。', '毎朝 không に; 七時に.'),
      Q('Câu nào đúng?', '{図書館|としょかん}で {勉強|べんきょう}します。', '{図書館|としょかん}へ {勉強|べんきょう}します。 | {図書館|としょかん}を {勉強|べんきょう}します。 | {図書館|としょかん}が {勉強|べんきょう}します。', 'Nơi → で.'),
      Q('Câu nào đúng?', '{日曜日|にちようび}、 どこへも {行|い}きません。', '{日曜日|にちようび}、 どこへを {行|い}きません。 | {日曜日|にちようび}、 どこでも {行|い}きません。 | {日曜日|にちようび}、 どこへも {行|い}きます。', 'どこへも + ません.'),
      Q('Câu nào đúng?', '{銀行|ぎんこう}は {九時|くじ}から {三時|さんじ}までです。', '{銀行|ぎんこう}は {九時|くじ}まで {三時|さんじ}からです。 | {銀行|ぎんこう}は {九時|くじ}から {三時|さんじ}にです。 | {銀行|ぎんこう}を {九時|くじ}から {三時|さんじ}までです。', 'から → まで.'),
      Q('Câu nào đúng?', '{朝|あさ}ご{飯|はん}を {食|た}べます。', '{朝|あさ}ご{飯|はん}へ {食|た}べます。 | {朝|あさ}ご{飯|はん}で {食|た}べます。 | {朝|あさ}ご{飯|はん}に {食|た}べます。', '食べる + を.'),
      Q('Câu nào đúng?', '{十一時|じゅういちじ}に {寝|ね}ます。', '{十一時|じゅういちじ}で {寝|ね}ます。 | {十一時|じゅういちじ}を {寝|ね}ます。 | {十一時|じゅういちじ}へ {寝|ね}ます。', 'Giờ → に.'),
      Q('Câu nào đúng?', 'パンや サラダなどを {食|た}べます。', 'パンとサラダなどを {食|た}べます。 | パンや サラダとを {食|た}べます。 | パンを サラダなどを {食|た}べます。', 'や…など.'),
      Q('Câu nào đúng?', '{何|なに}も {飲|の}みません。', '{何|なに}を {飲|の}みません。 (nghĩa: không uống gì cả) | {何|なに}も {飲|の}みます。 | {何|なに}もを {飲|の}みません。', '何も + ません.'),
      Q('Câu nào đúng? (trả lời "không")', 'いいえ、 {読|よ}みません。', 'いいえ、 そうです。 | はい、 {読|よ}みません。 | いいえ、 {読|よ}みます。', 'いいえ + phủ định.'),
      Q('Câu nào đúng? (về nhà)', 'うちへ {帰|かえ}ります。', 'うちを {帰|かえ}ります。 | うちで {帰|かえ}ります。 | うちが {帰|かえ}ります。', 'Về nhà → へ帰ります.'),
    ]),

    H(`${LV.vua} — D. Hiểu nghĩa câu (8 câu)`),
    MC('lt-b3-tron-nghia', 'D. Nhật → Việt', [
      Q('「{夏休|なつやす}みは {七月|しちがつ}から {八月|はちがつ}までです。」', 'Nghỉ hè từ tháng 7 đến tháng 8', 'Nghỉ hè vào tháng 7 và 8 mỗi ngày | Từ tháng 8 đến tháng 7 nghỉ hè | Nghỉ hè kéo dài đến tháng 7', 'から…まで = từ…đến.'),
      Q('「{毎朝|まいあさ}、 {七時|しちじ}に {起|お}きます。」', 'Sáng nào tôi cũng dậy lúc 7 giờ', 'Mỗi tối tôi ngủ lúc 7 giờ | Sáng tôi dậy sau 7 giờ | Tôi dậy trước 7 giờ', '毎朝 + 七時に起きます.'),
      Q('「{日曜日|にちようび}は どこへも {行|い}きません。」', 'Chủ nhật tôi không đi đâu cả', 'Chủ nhật tôi đi nhiều nơi | Chủ nhật tôi đi thư viện | Chủ nhật tôi nghỉ làm', 'どこへも + ません.'),
      Q('「パンや {果物|くだもの}などを {食|た}べます。」', 'Tôi ăn bánh mì, hoa quả, v.v.', 'Tôi ăn bánh mì và hoa quả, không gì khác | Tôi không ăn bánh mì | Tôi mua bánh mì và hoa quả', 'や…など = ví dụ.'),
      Q('「{図書館|としょかん}で {勉強|べんきょう}します。」', 'Tôi học ở thư viện', 'Tôi đi thư viện | Tôi mượn sách thư viện | Tôi làm việc ở thư viện', 'で = nơi làm.'),
      Q('「{朝|あさ}、 {何|なに}も {食|た}べません。」', 'Buổi sáng tôi không ăn gì cả', 'Buổi sáng tôi ăn nhiều | Tôi ăn sáng ở đâu cũng được | Tôi không ăn trưa', '何も + ません.'),
      Q('「{休|やす}みの {日|ひ}、 {海|うみ}へ {行|い}きます。」', 'Ngày nghỉ tôi đi biển', 'Ngày nghỉ tôi ở nhà | Ngày nghỉ tôi mua biển | Ngày nghỉ tôi đi bơi ở trường', '休みの日 = ngày nghỉ.'),
      Q('「{銀行|ぎんこう}は {月曜日|げつようび}から {金曜日|きんようび}までです。」', 'Ngân hàng làm việc từ thứ Hai đến thứ Sáu', 'Ngân hàng nghỉ thứ Hai đến thứ Sáu | Ngân hàng chỉ mở thứ Sáu | Ngân hàng mở cả tuần', 'から…まで.'),
    ]),

    H(`${LV.kho} — E. Dịch Việt → Nhật (gõ tay, 10 câu)`),
    QZ('lt-b3-tron-dich', 'E. Dịch sang tiếng Nhật', 'translate', [
      AD('Bây giờ là 9 giờ 20 phút.', ['{今|いま}、{9時|くじ}{20分|にじゅっぷん}です。'], '今・何時'),
      AD('Thư viện mở từ 9 giờ đến 7 giờ. Thứ Bảy là ngày nghỉ.', ['{図書館|としょかん}は{9時|くじ}から{7時|しちじ}までです。{土曜日|どようび}は{休|やす}みです。'], 'から・まで'),
      AD('Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.', ['{毎朝|まいあさ}、{6時半|ろくじはん}に{起|お}きます。'], '毎朝・に'),
      AD('Tôi ăn bánh mì và hoa quả ở nhà.', ['うちでパンや{果物|くだもの}を{食|た}べます。', 'うちでパンと{果物|くだもの}を{食|た}べます。', 'うちでパンや{果物|くだもの}などを{食|た}べます。'], 'で・や'),
      AD('Chủ nhật tôi không đi đâu cả.', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。'], 'どこへも'),
      AD('Tôi học tiếng Nhật ở trường từ 9 giờ đến 12 giờ.', ['{学校|がっこう}で{9時|くじ}から{12時|じゅうにじ}まで{日本語|にほんご}を{勉強|べんきょう}します。', '{9時|くじ}から{12時|じゅうにじ}まで{学校|がっこう}で{日本語|にほんご}を{勉強|べんきょう}します。'], 'で・から・まで'),
      AD('Thứ Ba và thứ Năm tôi làm thêm.', ['{火曜日|かようび}と{木曜日|もくようび}にアルバイトをします。', '{火曜日|かようび}と{木曜日|もくようび}、アルバイトをします。'], 'と・に'),
      AD('Nghỉ hè bạn có về nước không?', ['{夏休|なつやす}み、{国|くに}へ{帰|かえ}りますか。', '{夏休|なつやす}みは{国|くに}へ{帰|かえ}りますか。'], '帰ります'),
      AD('Buổi tối tôi không ăn gì cả.', ['{夜|よる}、{何|なに}も{食|た}べません。', '{夜|よる}は{何|なに}も{食|た}べません。'], '何も'),
      AD('Bạn ngủ lúc mấy giờ mỗi tối?', ['{毎晩|まいばん}、{何時|なんじ}に{寝|ね}ますか。', '{毎晩|まいばん}は{何時|なんじ}に{寝|ね}ますか。'], '何時に'),
    ], 'ポイント 16–23'),

    H(`${LV.kho} — F. Ghép câu (8 câu)`),
    BUILD('lt-b3-tron-ghep', 'F. Ghép các mảnh thành câu đúng', [
      BD('Sáng nào tôi cũng đọc báo ở nhà.', '{毎朝|まいあさ}、 うち で {新聞|しんぶん} を {読|よ}みます。', ['に']),
      BD('Thứ Bảy tôi đi thư viện lúc 9 giờ.', '{土曜日|どようび}、 {九時|くじ} に {図書館|としょかん} へ {行|い}きます。', ['で']),
      BD('Tôi làm thêm ở cửa hàng tiện lợi từ 4 giờ đến 9 giờ.', 'コンビニ で {四時|よじ} から {九時|くじ} まで アルバイト を します。', ['へ']),
      BD('Mỗi tối tôi không xem ti vi.', '{毎晩|まいばん}、 テレビ を {見|み}ません。', ['に']),
      BD('Ngày nghỉ tôi không đi đâu cả.', '{休|やす}みの{日|ひ}、 どこ へ も {行|い}きません。', ['を']),
      BD('Bạn làm việc ở đâu?', 'どこ で {働|はたら}きます か。', ['へ']),
      BD('Buổi sáng tôi uống sữa hoặc cà phê, v.v.', '{朝|あさ}、 {牛乳|ぎゅうにゅう} や コーヒー など を {飲|の}みます。', ['と']),
      BD('Tối nay tôi làm gì?', '{今晩|こんばん}、 {何|なに} を します か。', ['も']),
    ]),

    H(`${LV.kho} — G. Điền trợ từ trong đoạn văn (8 câu)`),
    ...PSG('{私|わたし}の{月曜日|げつようび} (có chỗ trống)', [
      ['{月曜日|げつようび} ① 、 {私|わたし} は {六時半|ろくじはん} ② {起|お}きます。', 'Thứ Hai, tôi dậy lúc 6 giờ rưỡi.'],
      ['パン ③ {牛乳|ぎゅうにゅう} ④ などを {食|た}べます。', 'Tôi ăn bánh mì, sữa, v.v.'],
      ['{八時|はちじ} に {学校|がっこう} ⑤ {行|い}きます。', 'Tám giờ tôi đến trường.'],
      ['{九時|くじ} ⑥ {十二時|じゅうにじ} ⑦ {勉強|べんきょう}します。', 'Từ 9 giờ đến 12 giờ tôi học.'],
      ['{夜|よる}、 テレビ ⑧ {見|み}ません。', 'Buổi tối tôi không xem ti vi.'],
    ], 'Điền ① ～ ⑧ ở bài tập bên dưới (X = không cần trợ từ).'),
    MC('lt-b3-tron-doan', 'G. Chọn trợ từ cho chỗ trống ① ～ ⑧', [
      Q('① ({月曜日|げつようび}＿＿、 …)', 'X (không cần)', 'に | で | を', 'Mở đầu câu có dấu 、: thứ làm chủ đề, không cần trợ từ.'),
      Q('② ({六時半|ろくじはん}＿＿)', 'に', 'で | を | X (không cần)', 'Giờ → に.'),
      Q('③ (パン＿＿{牛乳|ぎゅうにゅう}…)', 'や', 'と | を | に', 'や … など.'),
      Q('④ (パン や {牛乳|ぎゅうにゅう}＿＿ などを …)', 'X (không cần)', 'を | に | で', 'Ngay sau 牛乳 là など, không cần thêm trợ từ.'),
      Q('⑤ ({学校|がっこう}＿＿{行|い}きます)', 'へ', 'で | を | が', 'Đích → へ.'),
      Q('⑥ ({九時|くじ}＿＿)', 'から', 'まで | に | を', 'Điểm đầu → から.'),
      Q('⑦ ({十二時|じゅうにじ}＿＿)', 'まで', 'から | に | を', 'Điểm cuối → まで.'),
      Q('⑧ (テレビ＿＿{見|み}ません)', 'を', 'へ | で | に', 'Xem cái gì → を.'),
    ]),
  ],
};


/* ───────── 8. HỘI THOẠI ───────── */

const L_HOI_THOAI: Lesson = {
  id: 'lt-b3-hoi-thoai',
  kind: 'conversation',
  title: 'Luyện thêm Bài 3 — Hội thoại: 6 đoạn mới (giờ mở cửa · thứ & giờ · lịch trường · ngày nghỉ · buổi sáng · làm thêm) + tự nói',
  goal: 'Hiểu, điền, sắp xếp lượt thoại và tự nói được các hội thoại quanh giờ mở cửa, lịch trường, ngày nghỉ, thói quen buổi sáng và việc làm thêm — với nhân vật quen thuộc của sách.',
  minutes: 60,
  blocks: [
    HOW([
      'Mỗi hội thoại: ① **nghe/đọc cả đoạn** (bật romaji nếu cần) ② trả lời câu hỏi hiểu ③ làm bài điền ④ **sắp lượt thoại** ⑤ che lời thoại, **đóng vai một người** và nói lại.',
      'Đóng vai là cách nhanh nhất để thi nói: bạn học thuộc **khung hỏi – đáp** thay vì từng chữ. Thay thông tin trong khung bằng thông tin của chính bạn.',
      'Lỗi hay mắc: quên **はい／いいえ**; nhầm **へ／で／に**; thêm **に** sau 毎朝; đọc sai giờ 4・7・9.',
    ]),
    TABLE(
      ['Hội thoại', 'Người nói', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'リン ↔ nhân viên', 'Gọi điện hỏi giờ thư viện', '何時から何時まで · 休み'],
        ['2', 'アンナ ↔ nhân viên ngân hàng', 'Ngân hàng và bưu điện làm việc lúc nào', '何曜日から何曜日まで · と'],
        ['3', 'ダニエル ↔ 田中先生', 'Hỏi lịch trường: thi, nghỉ hè, Tuần lễ Vàng', 'いつ · 何月何日 · いつからいつまで'],
        ['4', 'パク ↔ ナタポン', 'Ngày nghỉ làm gì', 'や〜など · どこへも · を／へ／で'],
        ['5', 'ワン ↔ アンナ', 'Buổi sáng của Anna', '何時に · 何も · 昼ごはん'],
        ['6', 'ダニエル ↔ パク', 'Làm thêm ở đâu, lúc nào', 'で · 何曜日に · 〜から〜まで'],
      ],
    ),

    H(`${LV.de} — Hội thoại 1: Gọi điện hỏi giờ thư viện`),
    DLG('Hội thoại 1 — さくら図書館', [
      D('{受付|うけつけ}', 'm', 'はい、 さくら {図書館|としょかん} です。', 'Vâng, thư viện Sakura xin nghe.'),
      D('リン', 'f', 'あのう、 すみません。 そちら は {何時|なんじ} から {何時|なんじ} まで です か。', 'Dạ, xin lỗi. Bên anh mở từ mấy giờ đến mấy giờ ạ?'),
      D('{受付|うけつけ}', 'm', '{午前|ごぜん} {九時|くじ} から {午後|ごご} {七時|しちじ} まで です。', 'Từ 9 giờ sáng đến 7 giờ tối.'),
      D('リン', 'f', '{午後|ごご} {七時|しちじ} まで です か。 {休|やす}み は いつ です か。', 'Đến 7 giờ tối ạ. Khi nào nghỉ ạ?'),
      D('{受付|うけつけ}', 'm', '{月曜日|げつようび} です。', 'Thứ Hai.'),
      D('リン', 'f', '{月曜日|げつようび} です か。 ありがとう ございます。', 'Thứ Hai ạ. Cảm ơn anh.'),
    ]),
    MC('lt-b3-ht-1', 'Hiểu hội thoại 1 và điền chỗ trống (6 câu)', [
      Q('リンさんは どこの {時間|じかん}を {聞|き}きますか。', '{図書館|としょかん}', '{銀行|ぎんこう} | {病院|びょういん} | {郵便局|ゆうびんきょく}', 'さくら図書館.'),
      Q('{図書館|としょかん}は {何時|なんじ}から {何時|なんじ}までですか。', '{午前|ごぜん}{九時|くじ}から{午後|ごご}{七時|しちじ}まで', '{午前|ごぜん}{七時|しちじ}から{午後|ごご}{九時|くじ}まで | {午前|ごぜん}{九時|くじ}から{午後|ごご}{五時|ごじ}まで | {午後|ごご}{九時|くじ}から{午前|ごぜん}{七時|しちじ}まで', '9–19 giờ.'),
      Q('{図書館|としょかん}の {休|やす}みは？', '{月曜日|げつようび}', '{日曜日|にちようび} | {土曜日|どようび} | {火曜日|かようび}', '月曜日です.'),
      Q('リン：そちらは {何時|なんじ}＿＿ {何時|なんじ}＿＿ですか。', 'から / まで', 'まで / から | に / で | を / が', 'Từ… đến…'),
      Q('リン：{休|やす}みは＿＿＿ですか。', 'いつ', 'どこ | {何|なに} | だれ', 'Khi nào → いつ.'),
      Q('「{午後|ごご}{七時|しちじ}」 đọc là…', 'ごごしちじ', 'ごごななじ | ごごしじ | ごぜんしちじ', '7 giờ = しちじ.'),
    ]),
    BUILD('lt-b3-ht-1-xep', 'Sắp xếp lượt thoại 1 cho đúng thứ tự', [
      BDT('Chào → hỏi giờ → trả lời → hỏi ngày nghỉ.', [
        'はい、 さくら {図書館|としょかん} です。',
        'そちら は {何時|なんじ} から {何時|なんじ} まで です か。',
        '{午前|ごぜん} {九時|くじ} から {午後|ごご} {七時|しちじ} まで です。',
        '{休|やす}み は いつ です か。',
      ]),
    ]),

    H(`${LV.de} — Hội thoại 2: Ngân hàng và bưu điện`),
    DLG('Hội thoại 2 — 銀行で', [
      D('アンナ', 'f', 'すみません。 {銀行|ぎんこう} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。', 'Xin lỗi. Ngân hàng làm việc từ thứ mấy đến thứ mấy ạ?'),
      D('{銀行|ぎんこう}の{人|ひと}', 'm', '{月曜日|げつようび} から {金曜日|きんようび} まで です。 {土曜日|どようび} と {日曜日|にちようび} は {休|やす}み です。', 'Từ thứ Hai đến thứ Sáu. Thứ Bảy và Chủ nhật nghỉ.'),
      D('アンナ', 'f', '{時間|じかん} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Giờ làm việc từ mấy giờ đến mấy giờ ạ?'),
      D('{銀行|ぎんこう}の{人|ひと}', 'm', '{午前|ごぜん} {九時|くじ} から {午後|ごご} {三時|さんじ} まで です。', 'Từ 9 giờ sáng đến 3 giờ chiều.'),
      D('アンナ', 'f', '{郵便局|ゆうびんきょく} は {何時|なんじ} まで です か。', 'Còn bưu điện đến mấy giờ ạ?'),
      D('{銀行|ぎんこう}の{人|ひと}', 'm', '{午後|ごご} {五時|ごじ} まで です。', 'Đến 5 giờ chiều.'),
    ]),
    MC('lt-b3-ht-2', 'Hiểu hội thoại 2 và điền chỗ trống (6 câu)', [
      Q('{銀行|ぎんこう}は {何曜日|なんようび}から {何曜日|なんようび}までですか。', '{月曜日|げつようび}から{金曜日|きんようび}まで', '{月曜日|げつようび}から{土曜日|どようび}まで | {火曜日|かようび}から{日曜日|にちようび}まで | {土曜日|どようび}から{日曜日|にちようび}まで', '月〜金.'),
      Q('{銀行|ぎんこう}の {休|やす}みは？', '{土曜日|どようび}と{日曜日|にちようび}', '{日曜日|にちようび}だけ | {金曜日|きんようび}と{土曜日|どようび} | {月曜日|げつようび}と{火曜日|かようび}', '土・日.'),
      Q('{銀行|ぎんこう}は {何時|なんじ}までですか。', '{午後|ごご}{三時|さんじ}', '{午後|ごご}{五時|ごじ} | {午後|ごご}{九時|くじ} | {午前|ごぜん}{三時|さんじ}', '午後三時まで.'),
      Q('{郵便局|ゆうびんきょく}は {何時|なんじ}までですか。', '{午後|ごご}{五時|ごじ}', '{午後|ごご}{三時|さんじ} | {午後|ごご}{九時|くじ} | {午前|ごぜん}{五時|ごじ}', '午後五時まで.'),
      Q('{銀行|ぎんこう}の{人|ひと}：{土曜日|どようび}＿＿ {日曜日|にちようび}は {休|やす}みです。', 'と', 'や | を | が', 'Hai ngày cố định → と.'),
      Q('{時間|じかん}は {何時|なんじ}から ＿＿＿ ですか。 (hỏi điểm cuối)', '{何時|なんじ}まで', '{何時|なんじ}に | {何時|なんじ}を | {何時|なんじ}で', '何時から何時まで.'),
    ]),
    BUILD('lt-b3-ht-2-xep', 'Sắp xếp lượt thoại 2 cho đúng thứ tự', [
      BDT('Hỏi ngày → trả lời → hỏi giờ → trả lời.', [
        '{銀行|ぎんこう} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。',
        '{月曜日|げつようび} から {金曜日|きんようび} まで です。',
        '{時間|じかん} は {何時|なんじ} から {何時|なんじ} まで です か。',
        '{午前|ごぜん} {九時|くじ} から {午後|ごご} {三時|さんじ} まで です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 3: Hỏi lịch trường`),
    DLG('Hội thoại 3 — 先生にしつもん', [
      D('ダニエル', 'm', '{田中|たなか}{先生|せんせい}、 テスト は いつ です か。', 'Thưa thầy Tanaka, bao giờ có bài kiểm tra ạ?'),
      D('{田中|たなか}{先生|せんせい}', 'm', '{十二月|じゅうにがつ} {十四日|じゅうよっか} です。', 'Ngày 14 tháng 12.'),
      D('ダニエル', 'm', '{夏休|なつやす}み は いつ から いつ まで です か。', 'Nghỉ hè từ bao giờ đến bao giờ ạ?'),
      D('{田中|たなか}{先生|せんせい}', 'm', '{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。', 'Từ 20 tháng 7 đến 31 tháng 8.'),
      D('ダニエル', 'm', 'ゴールデンウイーク も {休|やす}み です か。', 'Tuần lễ Vàng cũng nghỉ ạ?'),
      D('{田中|たなか}{先生|せんせい}', 'm', 'はい、 {休|やす}み です。 {五月|ごがつ} {二日|ふつか} から {六日|むいか} まで です。', 'Vâng, nghỉ. Từ 2 đến 6 tháng 5.'),
      D('ダニエル', 'm', 'いい です ね。', 'Hay quá nhỉ.'),
    ]),
    MC('lt-b3-ht-3', 'Hiểu hội thoại 3 và điền chỗ trống (6 câu)', [
      Q('テストは いつですか。', '{十二月|じゅうにがつ}{十四日|じゅうよっか}', '{十二月|じゅうにがつ}{四日|よっか} | {十月|じゅうがつ}{十四日|じゅうよっか} | {二月|にがつ}{十四日|じゅうよっか}', '12月14日.'),
      Q('{夏休|なつやす}みは いつからいつまでですか。', '{七月|しちがつ}{二十日|はつか}から{八月|はちがつ}{三十一日|さんじゅういちにち}', '{七月|しちがつ}{二日|ふつか}から{八月|はちがつ}{三十日|さんじゅうにち} | {六月|ろくがつ}{二十日|はつか}から{七月|しちがつ}{三十一日|さんじゅういちにち} | {七月|しちがつ}{二十日|はつか}から{九月|くがつ}{三十一日|さんじゅういちにち}', '7/20〜8/31.'),
      Q('ゴールデンウイークは？', '{五月|ごがつ}{二日|ふつか}から{六日|むいか}まで', '{四月|しがつ}{二日|ふつか}から{六日|むいか}まで | {五月|ごがつ}{二日|ふつか}から{十六日|じゅうろくにち}まで | {五月|ごがつ}{三日|みっか}から{七日|なのか}まで', '5/2〜5/6.'),
      Q('ダニエル：テストは＿＿＿ですか。', 'いつ', 'どこ | {何|なに} | {何時|なんじ}', 'Khi nào → いつ.'),
      Q('「{二十日|はつか}」 đọc là…', 'はつか', 'にじゅうにち | ふたじゅうか | にじゅっか', '20日 = はつか.'),
      Q('ダニエル：ゴールデンウイーク＿＿ {休|やす}みですか。', 'も', 'を | が | に', '"Cũng" → も.'),
    ]),
    BUILD('lt-b3-ht-3-xep', 'Sắp xếp lượt thoại 3 cho đúng thứ tự', [
      BDT('Hỏi bài kiểm tra → trả lời → hỏi nghỉ hè → trả lời.', [
        'テスト は いつ です か。',
        '{十二月|じゅうにがつ} {十四日|じゅうよっか} です。',
        '{夏休|なつやす}み は いつ から いつ まで です か。',
        '{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 4: Ngày nghỉ làm gì`),
    DLG('Hội thoại 4 — 休みの日', [
      D('パク', 'f', '^ナタポン-さん、 {休|やす}みの{日|ひ}、 {何|なに} を します か。', 'Nattapon, ngày nghỉ bạn làm gì?'),
      D('ナタポン', 'm', 'テレビ や DVD を {見|み}ます。 インターネット も します。', 'Mình xem ti vi, DVD. Mình cũng lên mạng.'),
      D('パク', 'f', 'どこ へ も {行|い}きません か。', 'Bạn không đi đâu cả à?'),
      D('ナタポン', 'm', 'はい、 どこ へ も {行|い}きません。 パク-さん は？', 'Vâng, mình không đi đâu cả. Còn Park?'),
      D('パク', 'f', '{私|わたし} は {日曜日|にちようび}、 {公園|こうえん} へ {行|い}きます。 バーベキュー を します。', 'Chủ nhật mình đi công viên. Mình nướng BBQ.'),
      D('ナタポン', 'm', 'いい です ね。', 'Hay nhỉ.'),
    ]),
    MC('lt-b3-ht-4', 'Hiểu hội thoại 4 và điền chỗ trống (6 câu)', [
      Q('ナタポンさんは {休|やす}みの{日|ひ} {何|なに}を しますか。', 'テレビやDVDを{見|み}ます', '{公園|こうえん}で バーベキューを します | {図書館|としょかん}で {勉強|べんきょう}します | {海|うみ}へ {行|い}きます', 'テレビやDVD + インターネット.'),
      Q('ナタポンさんは {休|やす}みの{日|ひ}、 どこへ {行|い}きますか。', 'どこへも{行|い}きません', '{公園|こうえん}へ{行|い}きます | {海|うみ}へ{行|い}きます | {図書館|としょかん}へ{行|い}きます', 'どこへも行きません.'),
      Q('パクさんは {日曜日|にちようび}に どこへ {行|い}きますか。', '{公園|こうえん}', '{海|うみ} | {図書館|としょかん} | {会社|かいしゃ}', '公園へ.'),
      Q('パクさんは {公園|こうえん}で {何|なに}を しますか。', 'バーベキュー', 'スキー | アルバイト | ホームステイ', 'バーベキューをします.'),
      Q('パク：どこ＿＿ {行|い}きませんか。', 'へも', 'でも | をも | にも', 'どこへも…ません.'),
      Q('ナタポン：テレビ＿＿ DVD＿＿ {見|み}ます。', 'や / を', 'と / へ | が / を | や / が', 'や…を.'),
    ]),
    BUILD('lt-b3-ht-4-xep', 'Sắp xếp lượt thoại 4 cho đúng thứ tự', [
      BDT('Hỏi ngày nghỉ → trả lời → hỏi đi đâu → trả lời.', [
        '{休|やす}みの{日|ひ}、 {何|なに} を します か。',
        'テレビ や DVD を {見|み}ます。',
        'どこ へ も {行|い}きません か。',
        'はい、 どこ へ も {行|い}きません。',
      ]),
    ]),

    H(`${LV.kho} — Hội thoại 5: Buổi sáng của Anna`),
    DLG('Hội thoại 5 — 朝', [
      D('ワン', 'f', '^アンナ-さん は {毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', 'Anna, sáng nào bạn cũng dậy lúc mấy giờ?'),
      D('アンナ', 'f', '{六時半|ろくじはん} に {起|お}きます。', 'Mình dậy lúc 6 giờ rưỡi.'),
      D('ワン', 'f', '{朝|あさ}ご{飯|はん} を {食|た}べます か。', 'Bạn có ăn sáng không?'),
      D('アンナ', 'f', 'いいえ、 {何|なに}も {食|た}べません。 コーヒー を {飲|の}みます。', 'Không, mình không ăn gì cả. Mình uống cà phê.'),
      D('ワン', 'f', 'えっ、 そう です か。 {昼|ひる}ごはん は？', 'Hả, vậy à. Còn bữa trưa?'),
      D('アンナ', 'f', '{学校|がっこう} で {食|た}べます。 お{弁当|べんとう} や サラダ など を {食|た}べます。', 'Mình ăn ở trường. Mình ăn cơm hộp, salad, v.v.'),
    ]),
    MC('lt-b3-ht-5', 'Hiểu hội thoại 5 và điền chỗ trống (8 câu)', [
      Q('アンナさんは {毎朝|まいあさ} {何時|なんじ}に {起|お}きますか。', '{六時半|ろくじはん}', '{六時|ろくじ} | {七時半|しちじはん} | {九時|くじ}', '6 giờ rưỡi.'),
      Q('アンナさんは {朝|あさ}ご{飯|はん}を {食|た}べますか。', 'いいえ、{何|なに}も{食|た}べません', 'はい、パンを{食|た}べます | はい、{果物|くだもの}を{食|た}べます | はい、サラダを{食|た}べます', '何も食べません.'),
      Q('{朝|あさ}、 アンナさんは {何|なに}を {飲|の}みますか。', 'コーヒー', '{牛乳|ぎゅうにゅう} | お{酒|さけ} | ジュース', 'コーヒーを飲みます.'),
      Q('{昼|ひる}ごはんは どこで {食|た}べますか。', '{学校|がっこう}', 'うち | {会社|かいしゃ} | {公園|こうえん}', '学校で.'),
      Q('{昼|ひる}ごはんに {何|なに}を {食|た}べますか。', 'お{弁当|べんとう}や サラダ', 'パンや {牛乳|ぎゅうにゅう} | おすしや {果物|くだもの} | チーズや CD', 'お弁当やサラダなど.'),
      Q('アンナ：{何|なに}＿＿ {食|た}べません。', 'も', 'を | が | に', '何も…ません.'),
      Q('ワン：{毎朝|まいあさ}、 {何時|なんじ}＿＿ {起|お}きますか。', 'に', 'で | を | へ', '何時に.'),
      Q('ワン：えっ、 そうですか。 — 「えっ」 は？', 'Ngạc nhiên', 'Đồng ý | Cảm ơn | Xin lỗi', 'えっ = ơ, hả.'),
    ]),
    BUILD('lt-b3-ht-5-xep', 'Sắp xếp lượt thoại 5 cho đúng thứ tự', [
      BDT('Hỏi giờ dậy → trả lời → hỏi ăn sáng → trả lời.', [
        '{毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。',
        '{六時半|ろくじはん} に {起|お}きます。',
        '{朝|あさ}ご{飯|はん} を {食|た}べます か。',
        'いいえ、 {何|なに}も {食|た}べません。',
      ]),
    ]),

    H(`${LV.kho} — Hội thoại 6: Làm thêm ở đâu, lúc nào`),
    DLG('Hội thoại 6 — アルバイト', [
      D('ダニエル', 'm', '^パク-さん、 アルバイト は どこ で します か。', 'Park, bạn làm thêm ở đâu?'),
      D('パク', 'f', 'コンビニ で します。', 'Mình làm ở cửa hàng tiện lợi.'),
      D('ダニエル', 'm', '{何曜日|なんようび} に します か。', 'Làm vào thứ mấy?'),
      D('パク', 'f', '{火曜日|かようび} と {木曜日|もくようび} です。', 'Thứ Ba và thứ Năm.'),
      D('ダニエル', 'm', '{何時|なんじ} から {何時|なんじ} まで {働|はたら}きます か。', 'Bạn làm từ mấy giờ đến mấy giờ?'),
      D('パク', 'f', '{午後|ごご} {五時|ごじ} から {九時|くじ} まで {働|はたら}きます。', 'Từ 5 giờ chiều đến 9 giờ.'),
      D('ダニエル', 'm', '{毎晩|まいばん}、 {何時|なんじ} に {寝|ね}ます か。', 'Tối nào bạn ngủ lúc mấy giờ?'),
      D('パク', 'f', '{十一時|じゅういちじ} に {寝|ね}ます。', 'Mình ngủ lúc 11 giờ.'),
    ]),
    MC('lt-b3-ht-6', 'Hiểu hội thoại 6 và điền chỗ trống (8 câu)', [
      Q('パクさんは どこで アルバイトを しますか。', 'コンビニ', '{図書館|としょかん} | {銀行|ぎんこう} | {学校|がっこう}', 'コンビニで.'),
      Q('アルバイトは {何曜日|なんようび}ですか。', '{火曜日|かようび}と{木曜日|もくようび}', '{月曜日|げつようび}と{水曜日|すいようび} | {土曜日|どようび}と{日曜日|にちようび} | {金曜日|きんようび}だけ', '火・木.'),
      Q('アルバイトは {何時|なんじ}から {何時|なんじ}までですか。', '{午後|ごご}{五時|ごじ}から{九時|くじ}まで', '{午前|ごぜん}{五時|ごじ}から{九時|くじ}まで | {午後|ごご}{四時|よじ}から{九時|くじ}まで | {午後|ごご}{五時|ごじ}から{十時|じゅうじ}まで', '17〜21時.'),
      Q('パクさんは {毎晩|まいばん} {何時|なんじ}に {寝|ね}ますか。', '{十一時|じゅういちじ}', '{十時|じゅうじ} | {十二時|じゅうにじ} | {九時|くじ}', '11時.'),
      Q('ダニエル：アルバイトは どこ＿＿ しますか。', 'で', 'へ | を | に', 'Nơi làm → で.'),
      Q('ダニエル：{何曜日|なんようび}＿＿ しますか。', 'に', 'で | を | へ', 'Thứ cụ thể → に.'),
      Q('パク：{午後|ごご}{五時|ごじ}＿＿ {九時|くじ}＿＿ {働|はたら}きます。', 'から / まで', 'まで / から | に / で | を / が', 'Từ… đến…'),
      Q('「{五時|ごじ}」 đọc là…', 'ごじ', 'いつじ | ごとき | ごうじ', '5 giờ.'),
    ]),
    BUILD('lt-b3-ht-6-xep', 'Sắp xếp lượt thoại 6 cho đúng thứ tự', [
      BDT('Hỏi nơi làm → trả lời → hỏi ngày → trả lời.', [
        'アルバイト は どこ で します か。',
        'コンビニ で します。',
        '{何曜日|なんようび} に します か。',
        '{火曜日|かようび} と {木曜日|もくようび} です。',
      ]),
    ]),

    H(`${LV.kho} — Tự nói: đóng vai và trả lời về chính bạn`),
    NOTE('Cách tự nói', [
      'Che lời thoại, bấm 🎤 và **trả lời bằng thông tin thật của bạn**. Mỗi câu trả lời nói thành **một câu trọn** (không chỉ một từ).',
      'Sau đó đổi vai: bạn là người hỏi — đọc to câu hỏi, rồi tự đáp. Hai lượt như vậy cho mỗi hội thoại.',
    ]),
    SPEAK('lt-b3-ht-noi-1', [
      'としょかんは なんじから なんじまでですか。',
      'ぎんこうは なんようびから なんようびまでですか。',
      'なつやすみは いつから いつまでですか。',
      'やすみは なんようびですか。',
    ]),
    SPEAK('lt-b3-ht-noi-2', [
      'やすみの ひ、なにを しますか。',
      'まいあさ、なんじに おきますか。',
      'あさごはんは なにを たべますか。',
      'まいばん、なんじに ねますか。',
    ]),
    SPEAK('lt-b3-ht-noi-3', [
      'アルバイトは どこで しますか。',
      'なんようびに しますか。',
      'ひるごはんは どこで たべますか。',
      'にちようびは どこへ いきますか。',
    ]),
  ],
};


/* ───────── 9. ĐỌC HIỂU ───────── */

const R3_1: [string, string][] = [
  ['^リン-さん は {留学生|りゅうがくせい} です。', 'Lin là du học sinh.'],
  ['{毎朝|まいあさ}、 {六時|ろくじ} に {起|お}きます。', 'Sáng nào chị cũng dậy lúc 6 giờ.'],
  ['{朝|あさ}ご{飯|はん} は {何|なに}も {食|た}べません。', 'Bữa sáng chị không ăn gì cả.'],
  ['{牛乳|ぎゅうにゅう} を {飲|の}みます。', 'Chị uống sữa.'],
  ['{七時|しちじ} に {学校|がっこう} へ {行|い}きます。', '7 giờ chị đến trường.'],
];
const R3_2: [string, string][] = [
  ['^パク-さん は {夏休|なつやす}み、 {北海道|ほっかいどう} へ {行|い}きます。', 'Park đi Hokkaido vào kỳ nghỉ hè.'],
  ['{北海道|ほっかいどう} で ホームステイ を します。', 'Ở Hokkaido chị ở homestay.'],
  ['{八月|はちがつ} {五日|いつか} から {十五日|じゅうごにち} まで です。', 'Từ ngày 5 đến ngày 15 tháng 8.'],
  ['{夜|よる}、 {花火|はなび} や バーベキュー など を します。', 'Buổi tối chị chơi pháo hoa, nướng BBQ, v.v.'],
  ['{国|くに} へ {帰|かえ}りません。', 'Chị không về nước.'],
];
const R3_3: [string, string][] = [
  ['さくら {図書館|としょかん} の {時間|じかん} です。', 'Đây là giờ mở cửa thư viện Sakura.'],
  ['{月曜日|げつようび} から {金曜日|きんようび} まで、 {九時|くじ} から {七時|しちじ} まで です。', 'Thứ Hai đến thứ Sáu, từ 9 đến 7 giờ.'],
  ['{土曜日|どようび} は {十時|じゅうじ} から {五時|ごじ} まで です。', 'Thứ Bảy từ 10 đến 5 giờ.'],
  ['{日曜日|にちようび} は {休|やす}み です。', 'Chủ nhật nghỉ.'],
  ['{図書館|としょかん} で {本|ほん} や {新聞|しんぶん} を {読|よ}みます。', 'Ở thư viện có thể đọc sách, báo, v.v.'],
];
const R3_4: [string, string][] = [
  ['^ダニエル-さん は {月曜日|げつようび} から {金曜日|きんようび} まで {学校|がっこう} へ {行|い}きます。', 'Daniel đi học từ thứ Hai đến thứ Sáu.'],
  ['{授業|じゅぎょう} は {九時|くじ} から {十二時|じゅうにじ} まで です。', 'Giờ học từ 9 đến 12 giờ.'],
  ['{火曜日|かようび} と {木曜日|もくようび} の {午後|ごご}、 コンビニ で {働|はたら}きます。', 'Chiều thứ Ba và thứ Năm anh làm ở cửa hàng tiện lợi.'],
  ['{四時|よじ} から {八時|はちじ} まで です。', 'Từ 4 đến 8 giờ.'],
  ['{土曜日|どようび} は {図書館|としょかん} で {勉強|べんきょう}します。', 'Thứ Bảy anh học ở thư viện.'],
  ['{日曜日|にちようび} は どこ へ も {行|い}きません。 うち で テレビ を {見|み}ます。', 'Chủ nhật anh không đi đâu cả. Anh xem ti vi ở nhà.'],
];
const R3_5: [string, string][] = [
  ['これ は {学校|がっこう} の {一年|いちねん} の スケジュール です。', 'Đây là lịch cả năm của trường.'],
  ['{四月|しがつ} {七日|なのか} は お{花見|はなみ} です。 {公園|こうえん} で {桜|さくら} を {見|み}ます。', 'Ngày 7 tháng 4 là buổi ngắm hoa. Chúng ta ngắm hoa anh đào ở công viên.'],
  ['{五月|ごがつ} {二日|ふつか} から {六日|むいか} まで ゴールデンウイーク で、 {休|やす}み です。', 'Từ 2 đến 6 tháng 5 là Tuần lễ Vàng, nghỉ.'],
  ['{六月|ろくがつ} {十日|とおか} は {留学生|りゅうがくせい} パーティー です。', 'Ngày 10 tháng 6 là tiệc du học sinh.'],
  ['{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで {夏休|なつやす}み です。', 'Từ 20 tháng 7 đến 31 tháng 8 là nghỉ hè.'],
  ['{十二月|じゅうにがつ} {十四日|じゅうよっか} は テスト です。', 'Ngày 14 tháng 12 là bài kiểm tra.'],
];
const R3_6: [string, string][] = [
  ['{私|わたし} は ワン です。 {留学生|りゅうがくせい} です。', 'Tôi là Wan. Tôi là du học sinh.'],
  ['{月曜日|げつようび} から {金曜日|きんようび} まで、 {学校|がっこう} へ {行|い}きます。', 'Từ thứ Hai đến thứ Sáu tôi đi học.'],
  ['{毎朝|まいあさ}、 {九時|くじ} から {十二時半|じゅうにじはん} まで {日本語|にほんご} を {勉強|べんきょう}します。', 'Sáng nào tôi cũng học tiếng Nhật từ 9 giờ đến 12 giờ rưỡi.'],
  ['{水曜日|すいようび} と {土曜日|どようび}、 コンビニ で アルバイト を します。 {四時|よじ} から {八時|はちじ} まで {働|はたら}きます。', 'Thứ Tư và thứ Bảy tôi làm thêm ở cửa hàng tiện lợi. Tôi làm từ 4 đến 8 giờ.'],
  ['{週末|しゅうまつ}、 {図書館|としょかん} へ {行|い}きます。 {図書館|としょかん} で {本|ほん} を {読|よ}みます。', 'Cuối tuần tôi đi thư viện. Ở thư viện tôi đọc sách.'],
  ['{日曜日|にちようび} は どこ へ も {行|い}きません。', 'Chủ nhật tôi không đi đâu cả.'],
];

const L_DOC_HIEU: Lesson = {
  id: 'lt-b3-doc-hieu',
  kind: 'reading',
  title: 'Luyện thêm Bài 3 — Đọc hiểu: 6 đoạn từ ngắn đến dài (có furigana → không furigana)',
  goal: 'Đọc hiểu đoạn văn ngắn về một ngày, một tuần, kỳ nghỉ và lịch trường: trả lời câu hỏi chọn đáp án và đúng/sai, rồi đọc to đoạn dài không furigana như phần Reading của thi nói.',
  minutes: 55,
  blocks: [
    HOW([
      'Đọc đoạn **hai lần**: lần 1 chỉ hiểu ý chính (ai, ở đâu, lúc nào), lần 2 mới đọc câu hỏi và **tìm câu trả lời trong bài** (đừng đoán theo hiểu biết riêng).',
      'Câu đúng/sai có lựa chọn thứ ba **"Không có trong bài"**: nếu bài không nói gì về điều đó thì chọn nó, dù ngoài đời điều đó có thể đúng.',
      'Đoạn 5–6 là mức Khó: có phần đọc to **không furigana**. Đề Reading thật dài khoảng 100–110 ký tự: có 4 từ chữ Hán gạch chân (không furigana), 4 từ katakana, 70–80 chữ hiragana; **đọc sai một ký tự trừ 0,2 điểm**.',
    ]),

    H(`${LV.de} — Đoạn 1: リンさんの{朝|あさ}`),
    ...PSG('リンさんの{朝|あさ}', R3_1),
    MC('lt-b3-dh-1', 'Câu hỏi đoạn 1 (6 câu)', [
      Q('リンさんは {毎朝|まいあさ} {何時|なんじ}に {起|お}きますか。', '{六時|ろくじ}', '{七時|しちじ} | {八時|はちじ} | {五時|ごじ}', '六時に起きます.'),
      Q('リンさんは {朝|あさ}ご{飯|はん}を {食|た}べますか。', 'いいえ、{何|なに}も{食|た}べません', 'はい、{食|た}べます | はい、パンを{食|た}べます | はい、{果物|くだもの}を{食|た}べます', '何も食べません.'),
      Q('リンさんは {何|なに}を {飲|の}みますか。', '{牛乳|ぎゅうにゅう}', 'コーヒー | お{酒|さけ} | ジュース', '牛乳を飲みます.'),
      Q('リンさんは {何時|なんじ}に {学校|がっこう}へ {行|い}きますか。', '{七時|しちじ}', '{六時|ろくじ} | {八時|はちじ} | {九時|くじ}', '七時に行きます.'),
      TF('リンさんは {留学生|りゅうがくせい}です。', 'Đúng', 'Câu 1 của bài.'),
      TF('リンさんは {毎朝|まいあさ}パンを{食|た}べます。', 'Sai', 'Bài nói 何も食べません.'),
    ]),

    H(`${LV.de} — Đoạn 2: パクさんの{夏休|なつやす}み`),
    ...PSG('パクさんの{夏休|なつやす}み', R3_2),
    MC('lt-b3-dh-2', 'Câu hỏi đoạn 2 (7 câu)', [
      Q('パクさんは {夏休|なつやす}み、 どこへ {行|い}きますか。', '{北海道|ほっかいどう}', '{京都|きょうと} | {海|うみ} | {国|くに}', '北海道へ行きます.'),
      Q('パクさんは {北海道|ほっかいどう}で {何|なに}を しますか。', 'ホームステイ', 'スキー | アルバイト | テスト', 'ホームステイをします.'),
      Q('{夏休|なつやす}みは いつからいつまでですか。', '{八月|はちがつ}{五日|いつか}から{十五日|じゅうごにち}まで', '{八月|はちがつ}{十五日|じゅうごにち}から{五日|いつか}まで | {七月|しちがつ}{五日|いつか}から{十五日|じゅうごにち}まで | {八月|はちがつ}{一日|ついたち}から{十日|とおか}まで', '8/5〜8/15.'),
      Q('{夜|よる}、 {何|なに}を しますか。', '{花火|はなび}や バーベキュー', 'テレビや DVD | {新聞|しんぶん}や {本|ほん} | {桜|さくら}や お{花見|はなみ}', '{花火|はなび}やバーベキューなど.'),
      TF('パクさんは {国|くに}へ {帰|かえ}ります。', 'Sai', '国へ帰りません.'),
      TF('パクさんは {北海道|ほっかいどう}で ホームステイを します。', 'Đúng', 'Câu 2.'),
      TF('パクさんは {北海道|ほっかいどう}で スキーを します。', 'Không có trong bài', 'Bài không nói スキー.'),
    ]),

    H(`${LV.vua} — Đoạn 3: さくら{図書館|としょかん}の{時間|じかん}`),
    ...PSG('さくら{図書館|としょかん}の{時間|じかん}', R3_3),
    MC('lt-b3-dh-3', 'Câu hỏi đoạn 3 (8 câu)', [
      Q('{月曜日|げつようび}から{金曜日|きんようび}まで、 {何時|なんじ}から{何時|なんじ}までですか。', '{九時|くじ}から{七時|しちじ}まで', '{十時|じゅうじ}から{五時|ごじ}まで | {九時|くじ}から{五時|ごじ}まで | {七時|しちじ}から{九時|くじ}まで', '平日 9–19.'),
      Q('{土曜日|どようび}は {何時|なんじ}から{何時|なんじ}までですか。', '{十時|じゅうじ}から{五時|ごじ}まで', '{九時|くじ}から{七時|しちじ}まで | {九時|くじ}から{五時|ごじ}まで | {十時|じゅうじ}から{七時|しちじ}まで', '土曜 10–17.'),
      Q('{図書館|としょかん}の {休|やす}みは？', '{日曜日|にちようび}', '{土曜日|どようび} | {月曜日|げつようび} | {金曜日|きんようび}', '日曜日は休み.'),
      Q('{図書館|としょかん}で {何|なに}を よみますか。', '{本|ほん}や{新聞|しんぶん}', 'DVD や CD | パン や {果物|くだもの} | テレビ や インターネット', '本や新聞など.'),
      Q('Giờ đóng cửa của ngày thường và của thứ Bảy khác nhau thế nào?', 'Ngày thường 7 giờ; thứ Bảy 5 giờ', 'Hai ngày giống nhau | Thứ Bảy muộn hơn ngày thường | Chủ nhật đóng lúc 5 giờ', 'Ngày thường đến 19 giờ, thứ Bảy đến 17 giờ.'),
      TF('{図書館|としょかん}は {日曜日|にちようび}も {九時|くじ}からです。', 'Sai', '日曜日は休み.'),
      TF('{図書館|としょかん}は {九時|くじ}から {七時|しちじ}まで ({月曜日|げつようび}〜{金曜日|きんようび})。', 'Đúng', 'Câu 2.'),
      TF('{図書館|としょかん}で DVDを {見|み}ます。', 'Không có trong bài', 'Bài chỉ nói 本や新聞を読みます, không nhắc DVD.'),
    ]),

    H(`${LV.vua} — Đoạn 4: ダニエルさんの{一週間|いっしゅうかん}`),
    ...PSG('ダニエルさんの{一週間|いっしゅうかん}', R3_4),
    MC('lt-b3-dh-4', 'Câu hỏi đoạn 4 (8 câu)', [
      Q('ダニエルさんの {授業|じゅぎょう}は {何時|なんじ}から{何時|なんじ}までですか。', '{九時|くじ}から{十二時|じゅうにじ}まで', '{九時|くじ}から{五時|ごじ}まで | {十二時|じゅうにじ}から{四時|よじ}まで | {四時|よじ}から{八時|はちじ}まで', '9–12.'),
      Q('アルバイトは {何曜日|なんようび}ですか。', '{火曜日|かようび}と{木曜日|もくようび}', '{月曜日|げつようび}と{水曜日|すいようび} | {土曜日|どようび}と{日曜日|にちようび} | {金曜日|きんようび}', '火・木.'),
      Q('アルバイトは {何時|なんじ}から{何時|なんじ}までですか。', '{四時|よじ}から{八時|はちじ}まで', '{九時|くじ}から{十二時|じゅうにじ}まで | {四時|よじ}から{九時|くじ}まで | {五時|ごじ}から{八時|はちじ}まで', '4–8.'),
      Q('アルバイトは どこで しますか。', 'コンビニ', '{図書館|としょかん} | {会社|かいしゃ} | {銀行|ぎんこう}', 'コンビニで.'),
      Q('{土曜日|どようび}、 どこで {勉強|べんきょう}しますか。', '{図書館|としょかん}', 'うち | {学校|がっこう} | コンビニ', '図書館で.'),
      Q('{日曜日|にちようび}は どこへ {行|い}きますか。', 'どこへも{行|い}きません', '{図書館|としょかん}へ{行|い}きます | {公園|こうえん}へ{行|い}きます | {海|うみ}へ{行|い}きます', 'どこへも行きません.'),
      TF('ダニエルさんは {水曜日|すいようび}に アルバイトを します。', 'Sai', '火曜日と木曜日.'),
      TF('ダニエルさんは {日曜日|にちようび}、 うちで テレビを {見|み}ます。', 'Đúng', 'Câu cuối.'),
    ]),

    H(`${LV.kho} — Đoạn 5: {学校|がっこう}の{一年|いちねん}`),
    ...PSG('{学校|がっこう}の{一年|いちねん}', R3_5, 'Đoạn dài hơn: nhớ ghi lại ngày–sự kiện khi đọc.'),
    MC('lt-b3-dh-5', 'Câu hỏi đoạn 5 (9 câu)', [
      Q('お{花見|はなみ}は いつですか。', '{四月|しがつ}{七日|なのか}', '{四月|しがつ}{七日|なぬか} | {五月|ごがつ}{七日|なのか} | {四月|しがつ}{十七日|じゅうしちにち}', '4月7日 (なのか).'),
      Q('お{花見|はなみ}は どこで しますか。', '{公園|こうえん}', '{海|うみ} | {学校|がっこう} | {図書館|としょかん}', '公園で桜を見ます.'),
      Q('ゴールデンウイークは いつからいつまでですか。', '{五月|ごがつ}{二日|ふつか}から{六日|むいか}まで', '{五月|ごがつ}{二日|ふつか}から{十六日|じゅうろくにち}まで | {四月|しがつ}{二日|ふつか}から{六日|むいか}まで | {五月|ごがつ}{三日|みっか}から{七日|なのか}まで', '5/2〜5/6.'),
      Q('{留学生|りゅうがくせい}パーティーは いつですか。', '{六月|ろくがつ}{十日|とおか}', '{六月|ろくがつ}{四日|よっか} | {七月|しちがつ}{十日|とおか} | {六月|ろくがつ}{二十日|はつか}', '6月10日 (とおか).'),
      Q('{夏休|なつやす}みは いつからいつまでですか。', '{七月|しちがつ}{二十日|はつか}から{八月|はちがつ}{三十一日|さんじゅういちにち}まで', '{七月|しちがつ}{二日|ふつか}から{八月|はちがつ}{三十日|さんじゅうにち}まで | {六月|ろくがつ}{二十日|はつか}から{七月|しちがつ}{三十一日|さんじゅういちにち}まで | {七月|しちがつ}{二十日|はつか}から{九月|くがつ}{三十一日|さんじゅういちにち}まで', '7/20〜8/31.'),
      Q('テストは いつですか。', '{十二月|じゅうにがつ}{十四日|じゅうよっか}', '{十二月|じゅうにがつ}{四日|よっか} | {十月|じゅうがつ}{十四日|じゅうよっか} | {二月|にがつ}{十四日|じゅうよっか}', '12月14日.'),
      TF('{五月|ごがつ}の ゴールデンウイークは {休|やす}みです。', 'Đúng', 'ゴールデンウイークで、休み.'),
      TF('{六月|ろくがつ}{十日|とおか}は テストです。', 'Sai', 'パーティーの日.'),
      TF('{学校|がっこう}の スケジュールに バーベキューが あります。', 'Không có trong bài', 'Không nhắc đến BBQ.'),
    ]),

    H(`${LV.kho} — Đoạn 6: ワンさんの{一週間|いっしゅうかん} (dài nhất)`),
    ...PSG('ワンさんの{一週間|いっしゅうかん}', R3_6, 'Đoạn khoảng 110 ký tự — cùng độ dài với phần Reading của đề.'),
    MC('lt-b3-dh-6', 'Câu hỏi đoạn 6 (9 câu)', [
      Q('ワンさんは {何|なん}ですか。', '{留学生|りゅうがくせい}', '{会社員|かいしゃいん} | {先生|せんせい} | {銀行|ぎんこう}の{人|ひと}', '留学生.'),
      Q('{日本語|にほんご}の {勉強|べんきょう}は {何時|なんじ}から{何時|なんじ}までですか。', '{九時|くじ}から{十二時半|じゅうにじはん}まで', '{九時|くじ}から{十二時|じゅうにじ}まで | {四時|よじ}から{八時|はちじ}まで | {十時|じゅうじ}から{十二時半|じゅうにじはん}まで', '9–12:30.'),
      Q('アルバイトは {何曜日|なんようび}ですか。', '{水曜日|すいようび}と{土曜日|どようび}', '{火曜日|かようび}と{木曜日|もくようび} | {月曜日|げつようび}と{金曜日|きんようび} | {土曜日|どようび}と{日曜日|にちようび}', '水・土.'),
      Q('アルバイトは {何時|なんじ}までですか。', '{八時|はちじ}', '{四時|よじ} | {九時|くじ} | {十二時|じゅうにじ}', '四時から八時まで.'),
      Q('{週末|しゅうまつ}、 どこへ {行|い}きますか。', '{図書館|としょかん}', '{公園|こうえん} | {海|うみ} | コンビニ', '図書館へ.'),
      Q('{図書館|としょかん}で {何|なに}を しますか。', '{本|ほん}を{読|よ}みます', '{勉強|べんきょう}します | アルバイトを します | テレビを {見|み}ます', '本を読みます.'),
      Q('{日曜日|にちようび}は？', 'どこへも{行|い}きません', '{図書館|としょかん}へ{行|い}きます | アルバイトを します | {学校|がっこう}へ{行|い}きます', 'どこへも行きません.'),
      TF('ワンさんは {日曜日|にちようび}に アルバイトを します。', 'Sai', 'Chủ nhật không đi đâu cả; làm thêm vào thứ Tư và thứ Bảy.'),
      TF('ワンさんは コンビニで {働|はたら}きます。', 'Đúng', 'コンビニでアルバイト.'),
    ]),

    H(`${LV.kho} — Đọc to KHÔNG furigana (3 đoạn)`),
    READK('lt-b3-dh-doc-to', 'Đọc to, rồi bấm hiện cách đọc để tự chấm', 'Nhìn 30 giây (như thi), rồi đọc một hơi. Đọc sai một ký tự bị trừ 0,2 điểm — chú ý giờ (4・7・9), ngày bất quy tắc, katakana dài.', [
      RKP(R3_1),
      RKP(R3_4),
      RKP(R3_6),
    ]),
  ],
};


/* ───────── 10. NGHE ───────── */

const L_NGHE: Lesson = {
  id: 'lt-b3-nghe',
  kind: 'listening',
  title: 'Luyện thêm Bài 3 — Nghe: 10 đoạn mới, từ chậm đơn giản đến bẫy (tự sửa giờ, đổi thứ, so sánh hai người)',
  goal: 'Nghe hiểu hội thoại về giờ, thứ, ngày, lịch học–làm thêm và thói quen hằng ngày; bắt được thông tin cuối cùng khi người nói tự sửa — đúng dạng nghe điền / nghe chọn của đề.',
  minutes: 60,
  blocks: [
    HOW([
      'Nghe **hai lần**. Lần 1: chỉ ghi **giờ, thứ, ngày, tên nơi** ra giấy. Lần 2: mới đọc câu hỏi. Tuyệt đối **không bật lời thoại** trước khi trả lời xong.',
      'Đoạn 7–9 có **bẫy**: người nói **tự sửa** (「八時から… あっ、七時からです」), **đổi ý** (「月曜日… いいえ、火曜日です」) hoặc phải **so sánh hai người**. Nhớ: **thông tin CUỐI CÙNG** mới đúng.',
      'Lỗi hay mắc: nhầm **四時 (よじ) ↔ 九時 (くじ)** vì nghe gần giống; nhầm **しちじ ↔ いちじ**; nhầm **40 phút ↔ 14 phút**; quên **午前／午後**.',
    ]),
    RECAP('Bảng đoạn nghe', [
      '① ～ ③ 🟢 chậm, đơn giản: hỏi giờ, giờ thư viện, bưu điện.',
      '④ ～ ⑥ 🟡 thói quen buổi sáng, ngày nghỉ, làm thêm.',
      '⑦ ～ ⑨ 🔴 bẫy: tự sửa giờ, đổi thứ, so sánh hai người.',
      '⑩ 🔴 hội thoại dài (もう一度聞こう): 8 câu hỏi.',
    ]),

    H(`${LV.de} — ① ～ ③`),
    LS('lt-b3-ng-01', '① Hỏi giờ', [
      L('ダニエル', 'm', 'すみません。 {今|いま}、 {何時|なんじ} です か。', 'Xin lỗi, bây giờ mấy giờ ạ?'),
      L('リン', 'f', '{九時|くじ} {十五分|じゅうごふん} です。', '9 giờ 15 phút.'),
      L('ダニエル', 'm', 'ありがとう ございます。 {授業|じゅぎょう} は {九時半|くじはん} から です。', 'Cảm ơn bạn. Giờ học bắt đầu từ 9 giờ rưỡi.'),
      L('リン', 'f', 'そう です か。', 'Vậy à.'),
    ]),
    LS('lt-b3-ng-02', '② Giờ thư viện', [
      L('アンナ', 'f', 'すみません。 {図書館|としょかん} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Xin lỗi. Thư viện mở từ mấy giờ đến mấy giờ ạ?'),
      L('{受付|うけつけ}', 'm', '{九時|くじ} から {七時|しちじ} まで です。', 'Từ 9 giờ đến 7 giờ.'),
      L('アンナ', 'f', '{休|やす}み は {何曜日|なんようび} です か。', 'Nghỉ vào thứ mấy ạ?'),
      L('{受付|うけつけ}', 'm', '{日曜日|にちようび} です。', 'Chủ nhật.'),
    ]),
    LS('lt-b3-ng-03', '③ Bưu điện', [
      L('パク', 'f', '{郵便局|ゆうびんきょく} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。', 'Bưu điện làm từ thứ mấy đến thứ mấy ạ?'),
      L('{受付|うけつけ}', 'm', '{月曜日|げつようび} から {金曜日|きんようび} まで です。 {土曜日|どようび} と {日曜日|にちようび} は {休|やす}み です。', 'Từ thứ Hai đến thứ Sáu. Thứ Bảy và Chủ nhật nghỉ.'),
      L('パク', 'f', '{何時|なんじ} まで です か。', 'Đến mấy giờ ạ?'),
      L('{受付|うけつけ}', 'm', '{午後|ごご} {五時|ごじ} まで です。', 'Đến 5 giờ chiều.'),
    ]),
    MC('lt-b3-ng-q1', 'Câu hỏi ① ～ ③ (9 câu)', [
      Q('① {今|いま}、 {何時|なんじ}ですか。', '{九時|くじ}{十五分|じゅうごふん}', '{九時|くじ}{五十分|ごじゅっぷん} | {九時半|くじはん} | {十時|じゅうじ}{十五分|じゅうごふん}', '9時15分.'),
      Q('① {授業|じゅぎょう}は {何時|なんじ}からですか。', '{九時半|くじはん}', '{九時|くじ}{十五分|じゅうごふん} | {十時|じゅうじ} | {八時半|はちじはん}', '9時半から.'),
      Q('② {図書館|としょかん}は {何時|なんじ}から {何時|なんじ}までですか。', '{九時|くじ}から{七時|しちじ}まで', '{七時|しちじ}から{九時|くじ}まで | {九時|くじ}から{五時|ごじ}まで | {十時|じゅうじ}から{七時|しちじ}まで', '9–7.'),
      Q('② {図書館|としょかん}の {休|やす}みは？', '{日曜日|にちようび}', '{月曜日|げつようび} | {土曜日|どようび} | {金曜日|きんようび}', '日曜日.'),
      Q('③ {郵便局|ゆうびんきょく}は {何曜日|なんようび}から{何曜日|なんようび}までですか。', '{月曜日|げつようび}から{金曜日|きんようび}', '{月曜日|げつようび}から{土曜日|どようび} | {火曜日|かようび}から{日曜日|にちようび} | {土曜日|どようび}から{日曜日|にちようび}', '月〜金.'),
      Q('③ {郵便局|ゆうびんきょく}の {休|やす}みは？', '{土曜日|どようび}と{日曜日|にちようび}', '{日曜日|にちようび}だけ | {金曜日|きんようび}と{土曜日|どようび} | {月曜日|げつようび}', '土・日.'),
      Q('③ {郵便局|ゆうびんきょく}は {何時|なんじ}までですか。', '{午後|ごご}{五時|ごじ}', '{午後|ごご}{三時|さんじ} | {午前|ごぜん}{五時|ごじ} | {午後|ごご}{九時|くじ}', '午後5時まで.'),
      Q('② アンナの質問: 「{休|やす}みは＿＿＿ですか」 — chỗ trống là gì?', '{何曜日|なんようび}', '{何時|なんじ} | {何月|なんがつ} | {何日|なんにち}', '日曜日と答える → 何曜日.'),
      Q('① 「{十五分|じゅうごふん}」 đọc là…', 'じゅうごふん', 'じゅうごぷん | じゅっぷん | じゅうふん', '15 phút = じゅうごふん.'),
    ]),

    H(`${LV.vua} — ④ ～ ⑥`),
    LS('lt-b3-ng-04', '④ Buổi sáng của Wan', [
      L('ナタポン', 'm', '^ワン-さん は {毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', 'Wan, sáng nào bạn cũng dậy lúc mấy giờ?'),
      L('ワン', 'f', '{七時|しちじ} に {起|お}きます。', 'Mình dậy lúc 7 giờ.'),
      L('ナタポン', 'm', '{朝|あさ}ご{飯|はん} を {食|た}べます か。', 'Bạn có ăn sáng không?'),
      L('ワン', 'f', 'はい、 パン や {果物|くだもの} を {食|た}べます。 {牛乳|ぎゅうにゅう} も {飲|の}みます。', 'Có, mình ăn bánh mì, hoa quả. Mình cũng uống sữa.'),
    ]),
    LS('lt-b3-ng-05', '⑤ Chủ nhật của Park', [
      L('ダニエル', 'm', '^パク-さん、 {日曜日|にちようび}、 どこ へ {行|い}きます か。', 'Park, Chủ nhật bạn đi đâu?'),
      L('パク', 'f', 'どこ へ も {行|い}きません。 うち で テレビ や DVD を {見|み}ます。', 'Mình không đi đâu cả. Mình xem ti vi, DVD ở nhà.'),
      L('ダニエル', 'm', 'へえ。 インターネット も します か。', 'Ồ. Bạn cũng lên mạng chứ?'),
      L('パク', 'f', 'はい、 します。', 'Có, mình có.'),
    ]),
    LS('lt-b3-ng-06', '⑥ Việc làm thêm của Daniel', [
      L('アンナ', 'f', '^ダニエル-さん、 アルバイト は {何曜日|なんようび} です か。', 'Daniel, bạn làm thêm vào thứ mấy?'),
      L('ダニエル', 'm', '{火曜日|かようび} と {木曜日|もくようび} です。', 'Thứ Ba và thứ Năm.'),
      L('アンナ', 'f', '{何時|なんじ} から {何時|なんじ} まで です か。', 'Từ mấy giờ đến mấy giờ?'),
      L('ダニエル', 'm', '{四時|よじ} から {八時|はちじ} まで です。 コンビニ で {働|はたら}きます。', 'Từ 4 giờ đến 8 giờ. Mình làm ở cửa hàng tiện lợi.'),
    ]),
    MC('lt-b3-ng-q2', 'Câu hỏi ④ ～ ⑥ (9 câu)', [
      Q('④ ワンさんは {何時|なんじ}に {起|お}きますか。', '{七時|しちじ}', '{六時|ろくじ} | {八時|はちじ} | {九時|くじ}', '七時.'),
      Q('④ ワンさんは {朝|あさ}ご{飯|はん}に {何|なに}を {食|た}べますか。', 'パンや{果物|くだもの}', 'パンや{牛乳|ぎゅうにゅう} | {何|なに}も{食|た}べません | おすしや サラダ', 'パンや果物.'),
      Q('④ ワンさんは {何|なに}を {飲|の}みますか。', '{牛乳|ぎゅうにゅう}', 'コーヒー | お{酒|さけ} | ジュース', '牛乳も飲みます.'),
      Q('⑤ パクさんは {日曜日|にちようび}、 どこへ {行|い}きますか。', 'どこへも{行|い}きません', '{公園|こうえん}へ{行|い}きます | {海|うみ}へ{行|い}きます | {図書館|としょかん}へ{行|い}きます', 'どこへも行きません.'),
      Q('⑤ パクさんは うちで {何|なに}を しますか。', 'テレビや DVD を {見|み}ます', '{新聞|しんぶん}を{読|よ}みます | {勉強|べんきょう}します | アルバイトを します', 'テレビやDVD.'),
      Q('⑤ パクさんは インターネットを しますか。', 'はい、します', 'いいえ、しません | わかりません | テレビだけ します', 'はい、します.'),
      Q('⑥ ダニエルさんの アルバイトは {何曜日|なんようび}ですか。', '{火曜日|かようび}と{木曜日|もくようび}', '{月曜日|げつようび}と{水曜日|すいようび} | {土曜日|どようび}と{日曜日|にちようび} | {金曜日|きんようび}', '火・木.'),
      Q('⑥ アルバイトは {何時|なんじ}から {何時|なんじ}までですか。', '{四時|よじ}から{八時|はちじ}まで', '{九時|くじ}から{八時|はちじ}まで | {四時|よじ}から{九時|くじ}まで | {五時|ごじ}から{八時|はちじ}まで', '四時〜八時.'),
      Q('⑥ アルバイトは どこで しますか。', 'コンビニ', '{銀行|ぎんこう} | {図書館|としょかん} | {学校|がっこう}', 'コンビニで.'),
    ]),

    H(`${LV.kho} — ⑦ ～ ⑨ (bẫy)`),
    LS('lt-b3-ng-07', '⑦ Bẫy: tự sửa giờ', [
      L('リン', 'f', 'すみません。 {体育館|たいいくかん} は {何時|なんじ} から です か。', 'Xin lỗi. Nhà thi đấu mở từ mấy giờ ạ?'),
      L('{受付|うけつけ}', 'm', '{午前|ごぜん} {八時|はちじ} から です。 あっ、 すみません。 {午前|ごぜん} {七時|しちじ} から です。', 'Từ 8 giờ sáng. À, xin lỗi, từ 7 giờ sáng.'),
      L('リン', 'f', '{午前|ごぜん} {七時|しちじ} から です ね。 {何時|なんじ} まで です か。', 'Từ 7 giờ sáng nhỉ. Đến mấy giờ ạ?'),
      L('{受付|うけつけ}', 'm', '{午後|ごご} {十時|じゅうじ} まで です。', 'Đến 10 giờ tối.'),
    ]),
    LS('lt-b3-ng-08', '⑧ Bẫy: đổi thứ', [
      L('ナタポン', 'm', '{田中|たなか}{先生|せんせい}、 テスト は {月曜日|げつようび} です か。', 'Thầy Tanaka, bài kiểm tra vào thứ Hai ạ?'),
      L('{田中|たなか}{先生|せんせい}', 'm', 'いいえ、 {火曜日|かようび} です。 {十二月|じゅうにがつ} {十四日|じゅうよっか} です。', 'Không, thứ Ba. Ngày 14 tháng 12.'),
      L('ナタポン', 'm', '{火曜日|かようび} です ね。 {何時|なんじ} から です か。', 'Thứ Ba nhỉ. Từ mấy giờ ạ?'),
      L('{田中|たなか}{先生|せんせい}', 'm', '{九時半|くじはん} から です。', 'Từ 9 giờ rưỡi.'),
    ]),
    LS('lt-b3-ng-09', '⑨ Bẫy: so sánh hai người', [
      L('ワン', 'f', '^アンナ-さん は {何時|なんじ} に {寝|ね}ます か。', 'Anna, bạn ngủ lúc mấy giờ?'),
      L('アンナ', 'f', '{十一時|じゅういちじ} に {寝|ね}ます。 ワン-さん は？', 'Mình ngủ lúc 11 giờ. Còn Wan?'),
      L('ワン', 'f', '{私|わたし} は {十二時|じゅうにじ} に {寝|ね}ます。', 'Mình ngủ lúc 12 giờ.'),
      L('アンナ', 'f', 'えっ、 {十二時|じゅうにじ} です か。 {何時|なんじ} に {起|お}きます か。', 'Hả, 12 giờ à. Bạn dậy lúc mấy giờ?'),
      L('ワン', 'f', '{七時|しちじ} に {起|お}きます。 アンナ-さん は？', 'Mình dậy lúc 7 giờ. Còn Anna?'),
      L('アンナ', 'f', '{私|わたし} は {六時半|ろくじはん} に {起|お}きます。', 'Mình dậy lúc 6 giờ rưỡi.'),
    ]),
    MC('lt-b3-ng-q3', 'Câu hỏi ⑦ ～ ⑨ (10 câu)', [
      Q('⑦ {体育館|たいいくかん}は {何時|なんじ}からですか。 (thông tin CUỐI)', '{午前|ごぜん}{七時|しちじ}', '{午前|ごぜん}{八時|はちじ} | {午後|ごご}{七時|しちじ} | {午前|ごぜん}{九時|くじ}', 'Người nhân viên tự sửa: 7 giờ.'),
      Q('⑦ {体育館|たいいくかん}は {何時|なんじ}までですか。', '{午後|ごご}{十時|じゅうじ}', '{午後|ごご}{九時|くじ} | {午前|ごぜん}{十時|じゅうじ} | {午後|ごご}{八時|はちじ}', '午後10時.'),
      Q('⑧ テストは {何曜日|なんようび}ですか。', '{火曜日|かようび}', '{月曜日|げつようび} | {水曜日|すいようび} | {金曜日|きんようび}', 'Thầy sửa: 火曜日.'),
      Q('⑧ テストは {何月何日|なんがつなんにち}ですか。', '{十二月|じゅうにがつ}{十四日|じゅうよっか}', '{十二月|じゅうにがつ}{四日|よっか} | {十月|じゅうがつ}{十四日|じゅうよっか} | {十二月|じゅうにがつ}{二十四日|にじゅうよっか}', '12月14日.'),
      Q('⑧ テストは {何時|なんじ}からですか。', '{九時半|くじはん}', '{九時|くじ} | {十時|じゅうじ} | {八時半|はちじはん}', '9時半.'),
      Q('⑨ Ai đi ngủ muộn hơn?', 'ワン (12 giờ)', 'アンナ (11 giờ) | Hai người như nhau | Không biết', 'ワン 12時, アンナ 11時.'),
      Q('⑨ Ai dậy sớm hơn?', 'アンナ (6 giờ rưỡi)', 'ワン (7 giờ) | Hai người như nhau | Không biết', 'アンナ 6時半, ワン 7時.'),
      Q('⑨ アンナさんは {何時|なんじ}に {寝|ね}ますか。', '{十一時|じゅういちじ}', '{十二時|じゅうにじ} | {十時|じゅうじ} | {六時半|ろくじはん}', '11時.'),
      Q('⑨ ワンさんは {何時|なんじ}に {起|お}きますか。', '{七時|しちじ}', '{六時半|ろくじはん} | {十二時|じゅうにじ} | {八時|はちじ}', '7時.'),
      Q('⑦ Câu 「あっ、すみません」 báo hiệu điều gì?', 'Người nói sắp sửa lại thông tin vừa nói', 'Người nói muốn kết thúc cuộc gọi | Người nói hỏi lại | Người nói cảm ơn', 'Sau あっ/すみません thường là thông tin đúng → lấy thông tin CUỐI.'),
    ]),

    H(`${LV.kho} — ⑩ Hội thoại dài ({聞|き}こう)`),
    LS('lt-b3-ng-10', '⑩ Một tuần của Daniel', [
      L('パク', 'f', '^ダニエル-さん は {毎日|まいにち}、 {何時|なんじ} に {学校|がっこう} へ {来|き}ます か。', 'Daniel, mỗi ngày bạn đến trường lúc mấy giờ?'),
      L('ダニエル', 'm', '{八時半|はちじはん} に {来|き}ます。', 'Mình đến lúc 8 giờ rưỡi.'),
      L('パク', 'f', '{授業|じゅぎょう} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Giờ học từ mấy giờ đến mấy giờ?'),
      L('ダニエル', 'm', '{九時|くじ} から {十二時|じゅうにじ} まで です。 {昼|ひる}ごはん は {学校|がっこう} で {食|た}べます。', 'Từ 9 đến 12 giờ. Mình ăn trưa ở trường.'),
      L('パク', 'f', '{午後|ごご} は {何|なに} を します か。', 'Buổi chiều bạn làm gì?'),
      L('ダニエル', 'm', '{月曜日|げつようび} と {水曜日|すいようび} は {図書館|としょかん} で {勉強|べんきょう}します。 {火曜日|かようび} と {木曜日|もくようび} は コンビニ で アルバイト を します。', 'Thứ Hai và thứ Tư mình học ở thư viện. Thứ Ba và thứ Năm mình làm thêm ở cửa hàng tiện lợi.'),
      L('パク', 'f', '{何時|なんじ} から {何時|なんじ} まで です か。', 'Từ mấy giờ đến mấy giờ?'),
      L('ダニエル', 'm', '{五時|ごじ} から {九時|くじ} まで です。', 'Từ 5 giờ đến 9 giờ.'),
      L('パク', 'f', '{金曜日|きんようび} は？', 'Còn thứ Sáu?'),
      L('ダニエル', 'm', 'どこ へ も {行|い}きません。 うち で インターネット を します。', 'Mình không đi đâu cả. Mình lên mạng ở nhà.'),
    ]),
    MC('lt-b3-ng-q4', 'Câu hỏi ⑩ (8 câu)', [
      Q('ダニエルさんは {何時|なんじ}に {学校|がっこう}へ {来|き}ますか。', '{八時半|はちじはん}', '{八時|はちじ} | {九時|くじ} | {七時半|しちじはん}', '8時半.'),
      Q('{授業|じゅぎょう}は {何時|なんじ}から {何時|なんじ}までですか。', '{九時|くじ}から{十二時|じゅうにじ}まで', '{九時|くじ}から{五時|ごじ}まで | {十二時|じゅうにじ}から{五時|ごじ}まで | {八時半|はちじはん}から{十二時|じゅうにじ}まで', '9–12.'),
      Q('{昼|ひる}ごはんは どこで {食|た}べますか。', '{学校|がっこう}', 'うち | コンビニ | {図書館|としょかん}', '学校で.'),
      Q('{月曜日|げつようび}と{水曜日|すいようび}の {午後|ごご}は？', '{図書館|としょかん}で{勉強|べんきょう}', 'コンビニで アルバイト | うちで テレビ | {公園|こうえん}で バーベキュー', '月・水は図書館.'),
      Q('アルバイトは {何曜日|なんようび}ですか。', '{火曜日|かようび}と{木曜日|もくようび}', '{月曜日|げつようび}と{水曜日|すいようび} | {土曜日|どようび}と{日曜日|にちようび} | {金曜日|きんようび}', '火・木.'),
      Q('アルバイトは {何時|なんじ}から {何時|なんじ}までですか。', '{五時|ごじ}から{九時|くじ}まで', '{四時|よじ}から{八時|はちじ}まで | {五時|ごじ}から{八時|はちじ}まで | {九時|くじ}から{五時|ごじ}まで', '5–9.'),
      Q('{金曜日|きんようび}は？', 'どこへも{行|い}きません。うちでインターネットをします', 'アルバイトを します | {図書館|としょかん}で {勉強|べんきょう}します | {学校|がっこう}へ {行|い}きます', 'どこへも行きません.'),
      Q('{火曜日|かようび}の {午後|ごご}{五時|ごじ}から{九時|くじ}まで、 ダニエルさんは {何|なに}を しますか。', 'コンビニで{働|はたら}きます', '{図書館|としょかん}で{勉強|べんきょう}します | うちで{寝|ね}ます | {学校|がっこう}へ{行|い}きます', '火・木 17–21 アルバイト.'),
    ]),
  ],
};


/* ───────── 11. NÓI & VIẾT ───────── */

const L_NOI_VIET: Lesson = {
  id: 'lt-b3-noi-viet',
  kind: 'speaking',
  title: 'Luyện thêm Bài 3 — Nói & viết: 5 bộ câu hỏi thi nói (3 câu có tranh + 1 câu cá nhân) · đọc to · bài viết 3–5 câu',
  goal: 'Trả lời trôi chảy câu hỏi thi nói Lesson 3 (có tranh và cá nhân) bằng câu đầy đủ, đọc to đoạn văn đúng ngắt nghỉ, và viết được đoạn 3–5 câu kể về một ngày, một tuần, kỳ nghỉ của mình.',
  minutes: 60,
  blocks: [
    HOW([
      'Thi nói JPD113 (bản hướng dẫn 06/2025): **3 câu có tranh (15 điểm/câu) + 1 câu không tranh (10 điểm)**. Mỗi bộ dưới đây mô phỏng đúng 4 câu đó. Che đáp án, bấm 🎤, nói, nghe lại, rồi so với mẫu.',
      'Luôn trả lời bằng **câu đầy đủ** kết thúc です／ます, nhắc lại danh từ của câu hỏi. Câu Có/Không **phải có はい／いいえ**. Sai trợ từ trừ 2 điểm; im lặng quá lâu mất điểm lưu loát.',
      'Được xin giám thị nhắc lại câu hỏi **tối đa 2 lần** không bị trừ: 「もう一度お願いします。」',
      'Lỗi hay mắc: đọc sai giờ 4・7・9; nói thiếu 午前／午後; thêm に sau 毎朝; trả lời cụt "九時から五時" mà không có です.',
    ]),
    TABLE(
      ['Bộ', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'Biển hiệu thư viện (giờ + ngày nghỉ)', '何時から何時まで · 休み · 〜で何をしますか'],
        ['2', 'Bảng giờ ngân hàng/bưu điện', '何曜日から何曜日まで · 何時まで · と'],
        ['3', 'Tờ lịch trường', 'いつ · いつからいつまで · 何月何日'],
        ['4', 'Một ngày của Lin (tranh các giờ)', '何時に · を · で · 何も'],
        ['5', 'Ngày nghỉ của Tom (tranh sở thích)', 'や〜など · どこへ · どこへも'],
      ],
    ),

    H(`${LV.de} — Bộ 1: Biển hiệu thư viện`),
    TABLEJ(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Biển 「さくら図書館」', 'ここ は どこ です か。'],
        ['2', 'Dòng chữ 「9:00 – 19:00」', '{何時|なんじ} から {何時|なんじ} まで です か。'],
        ['3', 'Dòng chữ 「月曜日 休み」', '{休|やす}み は {何曜日|なんようび} です か。'],
        ['Cá nhân', '—', '{図書館|としょかん} で {何|なに} を します か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 1', [
      DX('Giám thị', 'examiner', 'ここ は どこ です か。', 'Đây là đâu?'),
      DX('Thí sinh', 'candidate', 'ここ は さくら {図書館|としょかん} です。', 'Đây là thư viện Sakura.'),
      DX('Giám thị', 'examiner', '{何時|なんじ} から {何時|なんじ} まで です か。', 'Từ mấy giờ đến mấy giờ?'),
      DX('Thí sinh', 'candidate', '{九時|くじ} から {七時|しちじ} まで です。', 'Từ 9 giờ đến 7 giờ.'),
      DX('Giám thị', 'examiner', '{休|やす}み は {何曜日|なんようび} です か。', 'Nghỉ vào thứ mấy?'),
      DX('Thí sinh', 'candidate', '{休|やす}み は {月曜日|げつようび} です。', 'Ngày nghỉ là thứ Hai.'),
      DX('Giám thị', 'examiner', '{図書館|としょかん} で {何|なに} を します か。', 'Bạn làm gì ở thư viện?'),
      DX('Thí sinh', 'candidate', '{本|ほん} を {読|よ}みます。 {勉強|べんきょう} も します。', 'Tôi đọc sách. Tôi cũng học bài.'),
    ]),
    SPEAK('lt-b3-nv-1', [
      'ここは どこですか。',
      'なんじから なんじまでですか。',
      'やすみは なんようびですか。',
      'としょかんで なにを しますか。',
    ]),

    H(`${LV.de} — Bộ 2: Ngân hàng và bưu điện`),
    TABLEJ(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Biển ngân hàng 「月〜金　9:00–15:00」', '{銀行|ぎんこう} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。'],
        ['2', 'Cùng biển đó', '{銀行|ぎんこう} は {何時|なんじ} から {何時|なんじ} まで です か。'],
        ['3', 'Biển bưu điện 「土・日 休み　〜17:00」', '{郵便局|ゆうびんきょく} の {休|やす}み は {何曜日|なんようび} です か。'],
        ['Cá nhân', '—', 'あなた は {銀行|ぎんこう} へ {行|い}きます か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 2', [
      DX('Giám thị', 'examiner', '{銀行|ぎんこう} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。', 'Ngân hàng làm từ thứ mấy đến thứ mấy?'),
      DX('Thí sinh', 'candidate', '{月曜日|げつようび} から {金曜日|きんようび} まで です。', 'Từ thứ Hai đến thứ Sáu.'),
      DX('Giám thị', 'examiner', '{銀行|ぎんこう} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Từ mấy giờ đến mấy giờ?'),
      DX('Thí sinh', 'candidate', '{九時|くじ} から {三時|さんじ} まで です。', 'Từ 9 giờ đến 3 giờ.'),
      DX('Giám thị', 'examiner', '{郵便局|ゆうびんきょく} の {休|やす}み は {何曜日|なんようび} です か。', 'Bưu điện nghỉ thứ mấy?'),
      DX('Thí sinh', 'candidate', '{土曜日|どようび} と {日曜日|にちようび} です。', 'Thứ Bảy và Chủ nhật.'),
      DX('Giám thị', 'examiner', 'あなた は {銀行|ぎんこう} へ {行|い}きます か。', 'Bạn có đi ngân hàng không?'),
      DX('Thí sinh', 'candidate', 'はい、 {月曜日|げつようび} に {行|い}きます。', 'Có, thứ Hai tôi đi.'),
    ]),
    SPEAK('lt-b3-nv-2', [
      'ぎんこうは なんようびから なんようびまでですか。',
      'ぎんこうは なんじから なんじまでですか。',
      'ゆうびんきょくの やすみは なんようびですか。',
      'あなたは ぎんこうへ いきますか。',
    ]),

    H(`${LV.vua} — Bộ 3: Tờ lịch trường`),
    TABLEJ(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Tờ lịch: 「12月14日 テスト」', 'テスト は いつ です か。'],
        ['2', 'Tờ lịch: 「7/20 〜 8/31 夏休み」', '{夏休|なつやす}み は いつ から いつ まで です か。'],
        ['3', 'Tờ lịch: 「5/2 〜 5/6 ゴールデンウイーク」', 'ゴールデンウイーク は いつ から いつ まで です か。'],
        ['Cá nhân', '—', 'あなた の {国|くに} の {夏休|なつやす}み は いつ です か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 3', [
      DX('Giám thị', 'examiner', 'テスト は いつ です か。', 'Bao giờ có bài kiểm tra?'),
      DX('Thí sinh', 'candidate', 'テスト は {十二月|じゅうにがつ} {十四日|じゅうよっか} です。', 'Bài kiểm tra là ngày 14 tháng 12.'),
      DX('Giám thị', 'examiner', '{夏休|なつやす}み は いつ から いつ まで です か。', 'Nghỉ hè từ bao giờ đến bao giờ?'),
      DX('Thí sinh', 'candidate', '{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。', 'Từ 20 tháng 7 đến 31 tháng 8.'),
      DX('Giám thị', 'examiner', 'ゴールデンウイーク は いつ から いつ まで です か。', 'Tuần lễ Vàng từ bao giờ đến bao giờ?'),
      DX('Thí sinh', 'candidate', '{五月|ごがつ} {二日|ふつか} から {六日|むいか} まで です。', 'Từ 2 đến 6 tháng 5.'),
      DX('Giám thị', 'examiner', 'あなた の {国|くに} の {夏休|なつやす}み は いつ です か。', 'Nghỉ hè ở nước bạn là khi nào?'),
      DX('Thí sinh', 'candidate', 'ベトナム の {夏休|なつやす}み は {六月|ろくがつ} から {八月|はちがつ} まで です。', 'Nghỉ hè ở Việt Nam từ tháng 6 đến tháng 8.'),
    ]),
    SPEAK('lt-b3-nv-3', [
      'テストは いつですか。',
      'なつやすみは いつから いつまでですか。',
      'ゴールデンウイークは いつから いつまでですか。',
      'あなたの くにの なつやすみは いつですか。',
    ]),

    H(`${LV.vua} — Bộ 4: Một ngày của Lin`),
    TABLEJ(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Lin trên giường, đồng hồ 6:00', 'リン-さん は {何時|なんじ} に {起|お}きます か。'],
        ['2', 'Lin ăn bánh mì, uống sữa, đồng hồ 6:30', 'リン-さん は {朝|あさ} {何|なに} を {食|た}べます か。'],
        ['3', 'Lin ở trường 9:00–12:00', 'リン-さん は {学校|がっこう} で {何|なに} を します か。'],
        ['Cá nhân', '—', 'あなた は {毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 4', [
      DX('Giám thị', 'examiner', 'リン-さん は {何時|なんじ} に {起|お}きます か。', 'Lin dậy lúc mấy giờ?'),
      DX('Thí sinh', 'candidate', 'リン-さん は {六時|ろくじ} に {起|お}きます。', 'Lin dậy lúc 6 giờ.'),
      DX('Giám thị', 'examiner', 'リン-さん は {朝|あさ} {何|なに} を {食|た}べます か。', 'Buổi sáng Lin ăn gì?'),
      DX('Thí sinh', 'candidate', 'パン を {食|た}べます。 {牛乳|ぎゅうにゅう} も {飲|の}みます。', 'Lin ăn bánh mì. Cũng uống sữa.'),
      DX('Giám thị', 'examiner', 'リン-さん は {学校|がっこう} で {何|なに} を します か。', 'Lin làm gì ở trường?'),
      DX('Thí sinh', 'candidate', '{九時|くじ} から {十二時|じゅうにじ} まで {勉強|べんきょう}します。', 'Lin học từ 9 đến 12 giờ.'),
      DX('Giám thị', 'examiner', 'あなた は {毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', 'Sáng nào bạn dậy lúc mấy giờ?'),
      DX('Thí sinh', 'candidate', '{私|わたし} は {毎朝|まいあさ}、 {六時半|ろくじはん} に {起|お}きます。', 'Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.'),
    ]),
    SPEAK('lt-b3-nv-4', [
      'リンさんは なんじに おきますか。',
      'リンさんは あさ なにを たべますか。',
      'リンさんは がっこうで なにを しますか。',
      'あなたは まいあさ、なんじに おきますか。',
    ]),

    H(`${LV.kho} — Bộ 5: Ngày nghỉ của Tom`),
    TABLEJ(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Tom ở công viên, đang nướng BBQ', 'トム-さん は どこ で バーベキュー を します か。'],
        ['2', 'Tom đang xem ti vi và DVD ở nhà', 'トム-さん は うち で {何|なに} を {見|み}ます か。'],
        ['3', 'Tom đứng ở nhà, không đi đâu (dấu ×)', 'トム-さん は {月曜日|げつようび}、 どこ へ {行|い}きます か。'],
        ['Cá nhân', '—', 'あなた は {休|やす}みの{日|ひ}、 {何|なに} を します か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 5', [
      DX('Giám thị', 'examiner', 'トム-さん は どこ で バーベキュー を します か。', 'Tom nướng BBQ ở đâu?'),
      DX('Thí sinh', 'candidate', '{公園|こうえん} で します。', 'Anh ấy nướng ở công viên.'),
      DX('Giám thị', 'examiner', 'トム-さん は うち で {何|なに} を {見|み}ます か。', 'Tom xem gì ở nhà?'),
      DX('Thí sinh', 'candidate', 'テレビ や DVD を {見|み}ます。', 'Anh ấy xem ti vi, DVD.'),
      DX('Giám thị', 'examiner', 'トム-さん は {月曜日|げつようび}、 どこ へ {行|い}きます か。', 'Thứ Hai Tom đi đâu?'),
      DX('Thí sinh', 'candidate', 'どこ へ も {行|い}きません。', 'Anh ấy không đi đâu cả.'),
      DX('Giám thị', 'examiner', 'あなた は {休|やす}みの{日|ひ}、 {何|なに} を します か。', 'Ngày nghỉ bạn làm gì?'),
      DX('Thí sinh', 'candidate', '{私|わたし} は {海|うみ} へ {行|い}きます。 サッカー を します。', 'Tôi đi biển. Tôi chơi bóng đá.'),
    ]),
    SPEAK('lt-b3-nv-5', [
      'トムさんは どこで バーベキューを しますか。',
      'トムさんは うちで なにを みますか。',
      'トムさんは げつようび、どこへ いきますか。',
      'あなたは やすみの ひ、なにを しますか。',
    ]),

    H(`${LV.kho} — Đọc to (Reading 40 điểm)`),
    TABLE(
      ['Phần', 'Số lượng', 'Điểm', 'Cách chấm (theo bản 06/2025)'],
      [
        ['Chữ Hán gạch chân', '4 từ', '12', 'Không furigana; sai là mất điểm từ'],
        ['Katakana', '4 từ', '12', 'Đọc đúng, kể cả trường âm ー'],
        ['Hiragana', '70–80 chữ', '16', 'Đọc sai một ký tự trừ 0,2 điểm'],
      ],
      'Bài đọc dài khoảng 100–110 ký tự; được chuẩn bị 30 giây rồi đọc',
    ),
    READK('lt-b3-nv-doc', 'Đọc to ba đoạn (mô phỏng Reading) rồi bấm hiện cách đọc để tự chấm', 'Nhìn 30 giây, đọc liền một hơi. Tự thu âm rồi so với cách đọc.', [
      RK('{私|わたし} は マリヤム です。 イタリア{人|じん} です。 {月曜日|げつようび} から {金曜日|きんようび} まで、 {学校|がっこう} へ {行|い}きます。 {毎朝|まいあさ} {九時|くじ} から フランス{語|ご} を {勉強|べんきょう}します。', 'Tôi là Mariam. Tôi là người Ý. Từ thứ Hai đến thứ Sáu tôi đi học. Sáng nào cũng từ 9 giờ tôi học tiếng Pháp.'),
      RK('{週末|しゅうまつ}、 {図書館|としょかん} へ {行|い}きます。 {図書館|としょかん} で {本|ほん} を {読|よ}みます。 コンビニ で アルバイト も します。 {日曜日|にちようび} は {休|やす}み です。', 'Cuối tuần tôi đi thư viện. Ở thư viện tôi đọc sách. Tôi cũng làm thêm ở cửa hàng tiện lợi. Chủ nhật là ngày nghỉ.'),
      RK('{夏休|なつやす}み は {七月|しちがつ} {二十日|はつか} から です。 {北海道|ほっかいどう} へ {行|い}きます。 ホームステイ を します。 {花火|はなび} や バーベキュー など を します。', 'Nghỉ hè bắt đầu từ ngày 20 tháng 7. Tôi đi Hokkaido. Tôi ở homestay. Tôi chơi pháo hoa, nướng BBQ, v.v.'),
    ]),

    H(`${LV.kho} — Viết 3–5 câu: kể một ngày / một tuần / kỳ nghỉ`),
    NOTE('Khung 5 câu để viết (hoặc nói) về chính bạn', [
      '**Câu 1 — giới thiệu:** {私|わたし}は ___ です。___の{学生|がくせい}です。',
      '**Câu 2 — thời gian:** {毎朝|まいあさ}、___{時|じ}に{起|お}きます。 ／ ___{曜日|ようび}から___{曜日|ようび}まで、___へ{行|い}きます。',
      '**Câu 3 — việc làm + nơi:** ___で ___を ___ます。（vd. {図書館|としょかん}で{本|ほん}を{読|よ}みます。）',
      '**Câu 4 — liệt kê hoặc phủ định:** ___や___などを___ます。 ／ {日曜日|にちようび}は{何|なに}もしません。',
      '**Câu 5 — kế hoạch:** {夏休|なつやす}み、___へ{行|い}きます。',
    ]),
    ...PSG('{私|わたし}の{夏休|なつやす}み (bài viết mẫu)', [
      ['{私|わたし} は ダニエル です。 {留学生|りゅうがくせい} です。', 'Tôi là Daniel. Tôi là du học sinh.'],
      ['{夏休|なつやす}み は {七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。', 'Kỳ nghỉ hè từ 20 tháng 7 đến 31 tháng 8.'],
      ['{七月|しちがつ}、 {国|くに} へ {帰|かえ}ります。', 'Tháng 7 tôi về nước.'],
      ['{国|くに} で アルバイト を します。', 'Ở nước tôi làm thêm.'],
      ['{八月|はちがつ} は どこ へ も {行|い}きません。', 'Tháng 8 tôi không đi đâu cả.'],
    ], 'Có đủ: thời gian から〜まで, へ, で, を, どこへも.'),
    QZ('lt-b3-nv-viet', 'Viết câu theo khung (tự đối chiếu với mẫu)', 'translate', [
      AD('Sáng nào tôi cũng dậy lúc 7 giờ.', ['{毎朝|まいあさ}、{7時|しちじ}に{起|お}きます。', '{私|わたし}は{毎朝|まいあさ}{7時|しちじ}に{起|お}きます。'], '毎朝・に'),
      AD('Tôi học ở thư viện từ 9 giờ đến 12 giờ.', ['{図書館|としょかん}で{9時|くじ}から{12時|じゅうにじ}まで{勉強|べんきょう}します。', '{9時|くじ}から{12時|じゅうにじ}まで{図書館|としょかん}で{勉強|べんきょう}します。'], 'で・から・まで'),
      AD('Ngày nghỉ tôi xem ti vi, DVD, v.v.', ['{休|やす}みの{日|ひ}、テレビやDVDなどを{見|み}ます。', '{休|やす}みの{日|ひ}は、テレビやDVDなどを{見|み}ます。'], 'や・など'),
      AD('Chủ nhật tôi không đi đâu cả.', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。'], 'どこへも'),
      AD('Thứ Ba và thứ Năm tôi làm thêm ở cửa hàng tiện lợi.', ['{火曜日|かようび}と{木曜日|もくようび}、コンビニでアルバイトをします。', '{火曜日|かようび}と{木曜日|もくようび}にコンビニでアルバイトをします。'], 'と・で'),
      AD('Nghỉ hè tôi đi biển.', ['{夏休|なつやす}み、{海|うみ}へ{行|い}きます。', '{夏休|なつやす}みは{海|うみ}へ{行|い}きます。'], 'へ'),
    ], '～に／で／へ／を／から〜まで'),
    NOTE('Danh sách tự chấm bài viết', [
      '☐ Mọi câu kết thúc bằng **です／ます／ません** (không bỏ lửng).',
      '☐ **Giờ** có じ（4・7・9 đúng）; **ngày** đúng cách đọc; **thứ** viết đủ 曜日.',
      '☐ **に** chỉ sau giờ/ngày cụ thể; **で** sau nơi; **へ** sau nơi đến; **を** sau vật.',
      '☐ Có ít nhất một câu dùng **から〜まで** và một câu dùng **や〜など** hoặc **何も／どこへも**.',
    ]),
  ],
};


/* ───────── 12. ĐỀ TỔNG HỢP ───────── */

const R3_DE: [string, string][] = [
  ['ひまわり {体育館|たいいくかん} の {時間|じかん} です。', 'Đây là giờ mở cửa nhà thi đấu Himawari.'],
  ['{火曜日|かようび} から {日曜日|にちようび} まで です。', 'Từ thứ Ba đến Chủ nhật.'],
  ['{午前|ごぜん} {九時|くじ} から {午後|ごご} {九時|くじ} まで です。', 'Từ 9 giờ sáng đến 9 giờ tối.'],
  ['{月曜日|げつようび} は {休|やす}み です。', 'Thứ Hai nghỉ.'],
  ['{体育館|たいいくかん} で テニス や サッカー など を します。', 'Ở nhà thi đấu có thể chơi quần vợt, bóng đá, v.v.'],
];

const L_DE: Lesson = {
  id: 'lt-b3-de-tong-hop',
  kind: 'review',
  title: 'Luyện thêm Bài 3 — Đề tổng hợp (60 phút, 100 điểm): từ vựng · chữ Hán · giờ–ngày · trợ từ · từ hỏi · nghe · đọc hiểu · dịch',
  goal: 'Làm một đề đủ phần theo form kiểm tra của cô, bấm giờ, tự chấm bằng thang điểm và biết phần nào cần luyện lại.',
  minutes: 60,
  blocks: [
    HOW([
      '**Thời gian: 60 phút.** Bấm giờ thật. Không xem lại bài học, không mở đáp án cho đến khi làm xong cả đề.',
      'Làm theo thứ tự các phần; câu nào bí quá 1 phút thì đánh dấu, làm tiếp, quay lại sau. Phần nghe: nghe tối đa 2 lần.',
      'Cuối đề có **bảng thang điểm tự chấm** và hướng dẫn luyện lại theo phần yếu. Đề này mô phỏng bài kiểm tra Bài 3; thi nói JPD113 xem `on113-…`.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Số câu', 'Điểm/câu', 'Tối đa'],
      [
        ['A', 'Từ vựng', '10', '1', '10'],
        ['B', 'Chữ Hán (đọc + chọn chữ)', '10', '1', '10'],
        ['C', 'Đọc giờ, thứ, ngày', '10', '1', '10'],
        ['D', 'Điền trợ từ (có X)', '10', '1', '10'],
        ['E', 'Từ để hỏi', '6', '1', '6'],
        ['F', 'Chọn đáp án đúng', '10', '1', '10'],
        ['G', 'Chia từ (gõ tay)', '4', '2', '8'],
        ['H', 'Nghe (2 đoạn)', '6', '2', '12'],
        ['I', 'Đọc hiểu', '6', '1,5', '9'],
        ['J', 'Dịch Việt → Nhật (gõ tay)', '3', '3', '9'],
        ['K', 'Dịch Nhật → Việt', '3', '2', '6'],
        ['', '**Tổng**', '78', '', '**100**'],
      ],
      'Cấu trúc đề tổng hợp Bài 3',
    ),

    H('Phần A — Từ vựng (10 câu × 1 điểm)'),
    MC('lt-b3-de-a', 'A. Từ vựng', [
      Q('「{体育館|たいいくかん}」の{意味|いみ}は？', 'Nhà thi đấu', 'Thư viện | Bưu điện | Bệnh viện', '体育館 = nhà thi đấu.'),
      Q('「{留学生|りゅうがくせい}」の{意味|いみ}は？', 'Du học sinh', 'Giáo viên | Nhân viên | Học sinh tiểu học', '留学生 = du học sinh.'),
      Q('「{午後|ごご}」の{反対|はんたい}は？', '{午前|ごぜん}', '{昼|ひる} | {夜|よる} | {朝|あさ}', 'PM ↔ AM.'),
      Q('{違|ちが}う{種類|しゅるい}の{言葉|ことば}は？ {春|はる} / {夏|なつ} / {秋|あき} / {海|うみ}', '{海|うみ}', '{春|はる} | {夏|なつ} | {秋|あき}', '3 từ kia là mùa.'),
      Q('{毎朝|まいあさ}、＿＿＿を{読|よ}みます。', '{新聞|しんぶん}', '{牛乳|ぎゅうにゅう} | {果物|くだもの} | チーズ', 'Đọc → báo.'),
      Q('{夏|なつ}、 {夜|よる}に＿＿＿を{見|み}ます。', '{花火|はなび}', '{桜|さくら} | スキー | サラダ', 'Mùa hè → pháo hoa.'),
      Q('「アルバイト」の{意味|いみ}は？', 'Việc làm thêm', 'Bài kiểm tra | Bữa tiệc | Kỳ nghỉ', 'アルバイト = làm thêm.'),
      Q('「{家|うち}」は？', 'Nhà (nhà mình)', 'Trường học | Công ty | Công viên', '家 = うち.'),
      Q('「{働|はたら}きます」の{意味|いみ}は？', 'Làm việc', 'Học | Ngủ | Nghe', '働く = làm việc.'),
      Q('「ゴールデンウイーク」は？', 'Tuần lễ Vàng (nghỉ dài ở Nhật)', 'Một loại trà | Tên một ngôi chùa | Kỳ thi cuối năm', 'GW = Tuần lễ Vàng.'),
    ]),

    H('Phần B — Chữ Hán (10 câu × 1 điểm)'),
    MC('lt-b3-de-b', 'B. Chữ Hán: 5 câu đọc + 5 câu chọn chữ', [
      Q('「月曜日」の読み方は？', 'げつようび', 'つきようび | がつようび | げっようび', '月 = げつ.'),
      Q('「金曜日」の読み方は？', 'きんようび', 'かねようび | こんようび | ぎんようび', '金 = きん.'),
      Q('「五月」の読み方は？', 'ごがつ', 'ごげつ | いつつき | ごつき', '月 = がつ.'),
      Q('「毎晩」の読み方は？', 'まいばん', 'まいよる | まいぱん | まいあさ', '晩 = ばん.'),
      Q('「何時」の読み方は？', 'なんじ', 'なにじ | なんとき | なにとき', '何時 = なんじ.'),
      Q('「かようび」を漢字で かくと？', '火曜日', '水曜日 | 木曜日 | 犬曜日', '火 = lửa.'),
      Q('「どようび」を漢字で かくと？', '土曜日', '士曜日 | 王曜日 | 工曜日', '土: nét dưới dài.'),
      Q('「まいあさ」を漢字で かくと？', '毎朝', '毎期 | 毎潮 | 毎明', '朝.'),
      Q('「じゅっぷん」を漢字で かくと？', '十分', '十今 | 十公 | 十令', '分.'),
      Q('「すいようび」を漢字で かくと？', '水曜日', '氷曜日 | 永曜日 | 木曜日', '水.'),
    ]),

    H('Phần C — Đọc giờ, thứ, ngày (10 câu × 1 điểm)'),
    MC('lt-b3-de-c', 'C. Cách đọc', [
      Q('4:00', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = よじ.'),
      Q('9:00', 'くじ', 'きゅうじ | くうじ | ここのじ', '9 giờ = くじ.'),
      Q('7:30', 'しちじはん', 'ななじはん | しちじさんぷん | しちじさんじゅっぷん', '7 giờ rưỡi = しちじはん.'),
      Q('10 phút', 'じゅっぷん', 'じゅうふん | じゅうぷん | じっふん', 'じゅっぷん.'),
      Q('6 phút', 'ろっぷん', 'ろくふん | ろくぷん | むっぷん', 'ろっぷん.'),
      Q('Tháng 4', 'しがつ', 'よんがつ | よがつ | しいがつ', 'しがつ.'),
      Q('Tháng 9', 'くがつ', 'きゅうがつ | ここのがつ | くつき', 'くがつ.'),
      Q('Ngày 2', 'ふつか', 'ふたか | にか | にじつ', 'ふつか.'),
      Q('Ngày 20', 'はつか', 'にじゅうにち | ふたじゅうか | にじゅっか', 'はつか.'),
      Q('Ngày 24', 'にじゅうよっか', 'にじゅうよんにち | にじゅうしにち | はつよっか', 'にじゅうよっか.'),
    ]),

    H('Phần D — Điền trợ từ (10 câu × 1 điểm; X = không cần)'),
    MC('lt-b3-de-d', 'D. Trợ từ', [
      Q('{毎朝|まいあさ}＿＿、 {七時|しちじ}＿＿ {起|お}きます。', 'X / に', 'に / に | で / を | X / で', '毎朝 không に; 七時に.'),
      Q('{図書館|としょかん}＿＿ {本|ほん}＿＿ {読|よ}みます。', 'で / を', 'へ / を | に / が | で / が', 'Nơi で; vật を.'),
      Q('{日曜日|にちようび}、 {公園|こうえん}＿＿ {行|い}きます。', 'へ', 'で | を | が', 'Đích へ.'),
      Q('{銀行|ぎんこう}は {九時|くじ}＿＿ {三時|さんじ}＿＿ です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ… đến…'),
      Q('{朝|あさ}、 パン＿＿ {果物|くだもの}＿＿ などを {食|た}べます。', 'や / X', 'と / を | が / に | や / を', 'や + など を.'),
      Q('{朝|あさ}、 {何|なに}＿＿ {食|た}べません。', 'も', 'を | が | に', '何も…ません.'),
      Q('{日曜日|にちようび}、 どこ＿＿ {行|い}きません。', 'へも', 'へを | でも | をも', 'どこへも…ません.'),
      Q('{学校|がっこう}＿＿ お{弁当|べんとう}＿＿ {食|た}べます。', 'で / を', 'へ / を | に / が | で / が', 'Nơi で; vật を.'),
      Q('{十一時|じゅういちじ}＿＿ {寝|ね}ます。', 'に', 'で | を | へ', 'Giờ に.'),
      Q('{休|やす}みは {土曜日|どようび}＿＿ {日曜日|にちようび}です。', 'と', 'や | を | が', 'Hai ngày nghỉ cố định → と.'),
    ]),

    H('Phần E — Từ để hỏi (6 câu × 1 điểm)'),
    MC('lt-b3-de-e', 'E. Chọn từ để hỏi', [
      Q('A：＿＿＿に {起|お}きますか。 B：{七時|しちじ}に{起|お}きます。', '{何時|なんじ}', 'どこ | {何|なに} | いつ', '七時 → 何時.'),
      Q('A：＿＿＿へ {行|い}きますか。 B：{海|うみ}へ{行|い}きます。', 'どこ', '{何|なに} | {何時|なんじ} | だれ', '海 → どこ.'),
      Q('A：＿＿＿を {飲|の}みますか。 B：{牛乳|ぎゅうにゅう}を{飲|の}みます。', '{何|なに}', 'どこ | {何時|なんじ} | いつ', '牛乳 → 何.'),
      Q('A：{休|やす}みは＿＿＿ですか。 B：{水曜日|すいようび}です。', '{何曜日|なんようび}', '{何時|なんじ} | {何月|なんがつ} | {何日|なんにち}', '水曜日 → 何曜日.'),
      Q('A：テストは＿＿＿ですか。 B：{六月|ろくがつ}{二日|ふつか}です。', '{何月何日|なんがつなんにち}', '{何曜日|なんようび} | {何時|なんじ} | どこ', '6月2日 → 何月何日.'),
      Q('A：＿＿＿で {勉強|べんきょう}しますか。 B：{図書館|としょかん}です。', 'どこ', '{何|なに} | {何時|なんじ} | いつ', '図書館 → どこ.'),
    ]),

    H('Phần F — Chọn đáp án đúng (10 câu × 1 điểm)'),
    MC('lt-b3-de-f', 'F. Ngữ pháp', [
      Q('Câu nào đúng?', '{私|わたし}は {図書館|としょかん}へ {行|い}きます。', '{私|わたし}は {図書館|としょかん}を {行|い}きます。 | {私|わたし}は {図書館|としょかん}が {行|い}きます。 | {私|わたし}は {図書館|としょかん}の {行|い}きます。', 'へ.'),
      Q('「パンを{食|た}べますか。」 → 「いいえ、＿＿＿」', '{食|た}べません。', '{食|た}べます。 | そうです。 | {食|た}べですか。', 'Phủ định.'),
      Q('Câu nào đúng?', '{毎晩|まいばん}、 {十一時|じゅういちじ}に {寝|ね}ます。', '{毎晩|まいばん}に、 {十一時|じゅういちじ}に {寝|ね}ます。 | {毎晩|まいばん}、 {十一時|じゅういちじ}で {寝|ね}ます。 | {毎晩|まいばん}を、 {十一時|じゅういちじ}に {寝|ね}ます。', '毎晩 không に.'),
      Q('「{図書館|としょかん}は {何時|なんじ}から{何時|なんじ}までですか。」', '{九時|くじ}から{七時|しちじ}までです。', '{九時|くじ}まで{七時|しちじ}からです。 | {九時|くじ}に{七時|しちじ}までです。 | {七時|しちじ}を{九時|くじ}までです。', 'から → まで.'),
      Q('Câu nào đúng?', '{朝|あさ}、 {何|なに}も {食|た}べません。', '{朝|あさ}、 {何|なに}も {食|た}べます。 | {朝|あさ}、 {何|なに}もを {食|た}べません。 | {朝|あさ}、 {何|なに}へも {食|た}べません。', '何も + ません.'),
      Q('Câu nào đúng?', 'パンや サラダなどを {食|た}べます。', 'パンと サラダなどを {食|た}べます。 | パンや サラダとを {食|た}べます。 | パンが サラダなどを {食|た}べます。', 'や…などを.'),
      Q('「うち」(nhà mình) — động từ phù hợp để "về"…', '{帰|かえ}ります', '{行|い}きます | {来|き}ます | {見|み}ます', 'Về nhà mình → 帰ります.'),
      Q('「{何|なに}を{見|み}ますか。」 → 「＿＿＿」', 'テレビを{見|み}ます。', 'テレビへ{見|み}ます。 | テレビで{見|み}ます。 | はい、{見|み}ます。', 'Trả lời vật + を.'),
      Q('Câu nào đúng?', '{会社|かいしゃ}で {働|はたら}きます。', '{会社|かいしゃ}へ {働|はたら}きます。 | {会社|かいしゃ}を {働|はたら}きます。 | {会社|かいしゃ}が {働|はたら}きます。', 'Nơi làm việc で.'),
      Q('Câu nào đúng?', '{夏休|なつやす}みは {七月|しちがつ}から {八月|はちがつ}までです。', '{夏休|なつやす}みは {七月|しちがつ}まで {八月|はちがつ}からです。 | {夏休|なつやす}みは {七月|しちがつ}に {八月|はちがつ}までです。 | {夏休|なつやす}みを {七月|しちがつ}から {八月|はちがつ}までです。', 'から → まで.'),
    ]),

    H('Phần G — Chia từ (4 câu × 2 điểm, gõ tay)'),
    QZ('lt-b3-de-g', 'G. Chia từ trong ngoặc theo yêu cầu', 'fill', [
      A('{夜|よる}、 {何|なに}も（{食|た}べます）。 ※ phủ định', '{食|た}べません'),
      A('{日曜日|にちようび}、 どこへも（{行|い}きます）。 ※ phủ định', '{行|い}きません'),
      A('{私|わたし}は {図書館|としょかん}で {日本語|にほんご}を（{勉強|べんきょう}します）。 ※ phủ định', '{勉強|べんきょう}しません'),
      A('{毎朝|まいあさ}、 {何時|なんじ}に（{起|お}きます）。 ※ thêm 「か」 để hỏi', '{起|お}きますか'),
    ], 'ます → ません ／ ます + か'),

    H('Phần H — Nghe (2 đoạn, 6 câu × 2 điểm)'),
    LS('lt-b3-de-ng-1', 'Đoạn 1 — Trung tâm thể thao', [
      L('ワン', 'f', 'すみません。 スポーツ センター は {何時|なんじ} から {何時|なんじ} まで です か。', 'Xin lỗi. Trung tâm thể thao mở từ mấy giờ đến mấy giờ ạ?'),
      L('{受付|うけつけ}', 'm', '{午前|ごぜん} {九時|くじ} から {午後|ごご} {九時|くじ} まで です。', 'Từ 9 giờ sáng đến 9 giờ tối.'),
      L('ワン', 'f', '{休|やす}み は いつ です か。', 'Khi nào nghỉ ạ?'),
      L('{受付|うけつけ}', 'm', '{水曜日|すいようび} です。', 'Thứ Tư.'),
      L('ワン', 'f', '{水曜日|すいようび} です ね。 ありがとう ございます。', 'Thứ Tư nhỉ. Cảm ơn anh.'),
    ]),
    LS('lt-b3-de-ng-2', 'Đoạn 2 — Cuối tuần', [
      L('リン', 'f', '^ダニエル-さん、 {土曜日|どようび} は {何|なに} を します か。', 'Daniel, thứ Bảy bạn làm gì?'),
      L('ダニエル', 'm', '{十時|じゅうじ} に {図書館|としょかん} へ {行|い}きます。 {本|ほん} を {読|よ}みます。', 'Mình đi thư viện lúc 10 giờ. Mình đọc sách.'),
      L('リン', 'f', '{日曜日|にちようび} は？', 'Còn Chủ nhật?'),
      L('ダニエル', 'm', 'どこ へ も {行|い}きません。 うち で テレビ を {見|み}ます。', 'Mình không đi đâu cả. Mình xem ti vi ở nhà.'),
    ]),
    MC('lt-b3-de-h', 'H. Câu hỏi nghe', [
      Q('Đoạn 1 — スポーツセンターは {何時|なんじ}から {何時|なんじ}までですか。', '{午前|ごぜん}{九時|くじ}から{午後|ごご}{九時|くじ}', '{午前|ごぜん}{七時|しちじ}から{午後|ごご}{九時|くじ} | {午前|ごぜん}{九時|くじ}から{午後|ごご}{五時|ごじ} | {午後|ごご}{九時|くじ}から{午前|ごぜん}{九時|くじ}', '9–21.'),
      Q('Đoạn 1 — {休|やす}みは？', '{水曜日|すいようび}', '{木曜日|もくようび} | {月曜日|げつようび} | {火曜日|かようび}', '水曜日.'),
      Q('Đoạn 1 — Wan hỏi những gì?', 'Giờ mở cửa và ngày nghỉ', 'Giá vé và địa chỉ | Tên và quốc tịch | Thời tiết và quần áo', 'Hỏi giờ mở cửa và ngày nghỉ.'),
      Q('Đoạn 2 — ダニエルさんは {土曜日|どようび}、 {何時|なんじ}に どこへ {行|い}きますか。', '{十時|じゅうじ}に{図書館|としょかん}へ', '{十時|じゅうじ}に{公園|こうえん}へ | {九時|くじ}に{図書館|としょかん}へ | {十時|じゅうじ}に{学校|がっこう}へ', '10時に図書館へ.'),
      Q('Đoạn 2 — {土曜日|どようび}、 {図書館|としょかん}で {何|なに}を しますか。', '{本|ほん}を{読|よ}みます', '{勉強|べんきょう}します | テレビを{見|み}ます | アルバイトを します', '本を読みます.'),
      Q('Đoạn 2 — {日曜日|にちようび}は？', 'どこへも{行|い}きません。うちでテレビを{見|み}ます', '{図書館|としょかん}へ{行|い}きます | アルバイトを します | {公園|こうえん}へ{行|い}きます', 'どこへも行きません; うちでテレビ.'),
    ]),

    H('Phần I — Đọc hiểu (6 câu × 1,5 điểm)'),
    ...PSG('ひまわり{体育館|たいいくかん}', R3_DE),
    MC('lt-b3-de-i', 'I. Câu hỏi đọc hiểu', [
      Q('{体育館|たいいくかん}の {休|やす}みは {何曜日|なんようび}ですか。', '{月曜日|げつようび}', '{火曜日|かようび} | {日曜日|にちようび} | {土曜日|どようび}', '月曜日は休み.'),
      Q('{体育館|たいいくかん}は {何時|なんじ}から {何時|なんじ}までですか。', '{午前|ごぜん}{九時|くじ}から{午後|ごご}{九時|くじ}', '{午前|ごぜん}{七時|しちじ}から{午後|ごご}{十時|じゅうじ} | {午後|ごご}{九時|くじ}から{午前|ごぜん}{九時|くじ} | {午前|ごぜん}{九時|くじ}から{午後|ごご}{五時|ごじ}', '9–21.'),
      Q('{体育館|たいいくかん}は {何曜日|なんようび}から {何曜日|なんようび}までですか。', '{火曜日|かようび}から{日曜日|にちようび}', '{月曜日|げつようび}から{金曜日|きんようび} | {月曜日|げつようび}から{日曜日|にちようび} | {土曜日|どようび}から{日曜日|にちようび}', '火〜日.'),
      Q('{体育館|たいいくかん}で {何|なに}を しますか。', 'テニスや サッカー', 'スキーや バーベキュー | {勉強|べんきょう}や アルバイト | テレビや DVD', 'テニスやサッカーなど.'),
      TF('{体育館|たいいくかん}は {日曜日|にちようび}も {九時|くじ}から {九時|くじ}までです。', 'Đúng', '火〜日, 9〜21.'),
      TF('{体育館|たいいくかん}で スキーを します。', 'Không có trong bài', 'Bài không nhắc スキー.'),
    ]),

    H('Phần J — Dịch Việt → Nhật (3 câu × 3 điểm, gõ tay)'),
    QZ('lt-b3-de-j', 'J. Dịch sang tiếng Nhật', 'translate', [
      AD('Thư viện mở từ 9 giờ đến 7 giờ. Chủ nhật nghỉ.', ['{図書館|としょかん}は{9時|くじ}から{7時|しちじ}までです。{日曜日|にちようび}は{休|やす}みです。'], 'から・まで・休み'),
      AD('Sáng nào tôi cũng dậy lúc 6 giờ rưỡi. Tôi uống sữa.', ['{毎朝|まいあさ}、{6時半|ろくじはん}に{起|お}きます。{牛乳|ぎゅうにゅう}を{飲|の}みます。', '{私|わたし}は{毎朝|まいあさ}{6時半|ろくじはん}に{起|お}きます。{牛乳|ぎゅうにゅう}を{飲|の}みます。'], '毎朝・に・を'),
      AD('Thứ Bảy tôi làm thêm ở cửa hàng tiện lợi. Chủ nhật tôi không đi đâu cả.', ['{土曜日|どようび}、コンビニでアルバイトをします。{日曜日|にちようび}はどこへも{行|い}きません。', '{土曜日|どようび}に、コンビニでアルバイトをします。{日曜日|にちようび}は、どこへも{行|い}きません。'], 'で・どこへも'),
    ], 'ポイント 16–23'),

    H('Phần K — Dịch Nhật → Việt (3 câu × 2 điểm)'),
    MC('lt-b3-de-k', 'K. Chọn nghĩa đúng', [
      Q('「{銀行|ぎんこう}は {月曜日|げつようび}から{金曜日|きんようび}まで、 {九時|くじ}から{三時|さんじ}までです。」', 'Ngân hàng làm từ thứ Hai đến thứ Sáu, từ 9 đến 3 giờ', 'Ngân hàng nghỉ thứ Hai đến thứ Sáu | Ngân hàng mở 9 giờ tối | Ngân hàng đóng vào thứ Bảy', 'から…まで ×2.'),
      Q('「{朝|あさ}、 パンや {果物|くだもの}などを {食|た}べます。 {牛乳|ぎゅうにゅう}を {飲|の}みます。」', 'Buổi sáng tôi ăn bánh mì, hoa quả, v.v. và uống sữa', 'Buổi sáng tôi không ăn gì cả | Buổi tối tôi ăn bánh mì | Tôi mua bánh mì và sữa', 'や…など + を.'),
      Q('「{夏休|なつやす}み、 どこへも {行|い}きません。 うちで {勉強|べんきょう}します。」', 'Nghỉ hè tôi không đi đâu cả. Tôi học ở nhà', 'Nghỉ hè tôi đi nhiều nơi | Nghỉ hè tôi về nước | Nghỉ hè tôi làm thêm ở nhà', 'どこへも + ません; うちで.'),
    ]),

    H('Bảng chấm điểm tự đánh giá'),
    TABLE(
      ['Phần', 'Số câu đúng', '× điểm/câu', 'Điểm của bạn'],
      [
        ['A. Từ vựng', '___ / 10', '× 1', '___'],
        ['B. Chữ Hán', '___ / 10', '× 1', '___'],
        ['C. Giờ, thứ, ngày', '___ / 10', '× 1', '___'],
        ['D. Trợ từ', '___ / 10', '× 1', '___'],
        ['E. Từ để hỏi', '___ / 6', '× 1', '___'],
        ['F. Chọn đáp án', '___ / 10', '× 1', '___'],
        ['G. Chia từ', '___ / 4', '× 2', '___'],
        ['H. Nghe', '___ / 6', '× 2', '___'],
        ['I. Đọc hiểu', '___ / 6', '× 1,5', '___'],
        ['J. Dịch V→N', '___ / 3', '× 3', '___'],
        ['K. Dịch N→V', '___ / 3', '× 2', '___'],
        ['', '', '**Tổng**', '___ / 100'],
      ],
    ),
    TABLE(
      ['Tổng điểm', 'Đánh giá', 'Việc cần làm'],
      [
        ['90–100', 'Xuất sắc', 'Chỉ cần ôn lại câu sai; chuyển sang luyện nói (on113-noi-mau).'],
        ['80–89', 'Tốt', 'Ôn phần dưới 80% của chính bạn.'],
        ['70–79', 'Đạt', 'Làm lại các lesson ngữ pháp 1–3 mức Vừa.'],
        ['60–69', 'Cần ôn', 'Làm lại từ vựng + đọc giờ/ngày mức Dễ–Vừa, rồi làm lại đề sau 2 ngày.'],
        ['Dưới 60', 'Chưa đạt', 'Bắt đầu lại từ lộ trình ngày 1, làm chậm, đừng bỏ qua mức Dễ.'],
      ],
    ),
    NOTE('Cách luyện lại theo phần yếu', [
      'Từ vựng (A) hay sai → `lt-b3-tu-vung` mức Vừa–Khó, đặc biệt nhóm nơi chốn và đồ ăn.',
      'Chữ Hán (B) hay sai → `lt-b3-chu-han` mức Vừa; nhớ thứ trong tuần đọc on (げつ・か・すい・もく・きん・ど).',
      'Giờ–ngày (C) hay sai → `lt-b3-ngu-phap-gio-ngay` mức Dễ–Vừa; học thuộc 4・7・9 và ngày 1–10.',
      'Trợ từ (D) & Từ hỏi (E) hay sai → `lt-b3-ngu-phap-tron` phần A–B.',
      'Nghe (H) hay sai → `lt-b3-nghe` đoạn 7–9 (bẫy); luôn nhớ thông tin CUỐI.',
      'Dịch (J) hay sai → `lt-b3-ngu-phap-tron` phần E và `lt-b3-noi-viet` phần viết.',
    ]),
  ],
};


/* ═══════════════════════════════════════════════════════════════════
 *        PHẦN C — ÔN THI JPD113 (BÀI 1–3) (ON_113)
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────── 1. CẤU TRÚC ĐỀ · ĐIỂM · CHIẾN LƯỢC ───────── */

const O_CAU_TRUC: Lesson = {
  id: 'on113-cau-truc',
  kind: 'review',
  title: 'Ôn thi JPD113 (Bài 1–3) — cấu trúc đề thi nói, cách tính điểm, 27 câu hỏi mẫu, chiến lược và lịch ôn',
  goal: 'Biết đề thi nói JPD113 gồm những phần nào, chấm thế nào, 27 câu hỏi mẫu của cô thuộc dạng gì, và có sẵn chiến lược + lịch ôn 7 ngày để học trước khi thi.',
  minutes: 30,
  blocks: [
    HOW([
      'Lesson này **nền móng**: đọc kỹ bảng cấu trúc và điểm, rồi học theo chiến lược từng phần. Các lesson sau (`on113-ngu-phap-tu-vung`, `on113-doc-to`, `on113-noi-mau`, `on113-de-tong-hop`) là phần luyện.',
      'Nguồn: "Hướng dẫn ôn tập thi nói môn JPD113" (bản 09/06/2025) cô gửi. Con số chấm điểm dưới đây lấy từ bản đó.',
      'Phạm vi môn JPD113 là **Bài 1–3** (tự giới thiệu · mua sắm & gọi món · lịch trình). Đề thi nói chỉ dùng từ và ngữ pháp trong ba bài này.',
    ]),
    NOTE('Lưu ý: hai bản cơ cấu điểm khác nhau', [
      'Bản hướng dẫn **09/06/2025** (cô gửi, mới nhất): **READING 40 · TALKING 55 · PRESENTING 5**. Đây là bản bài này dùng.',
      'Trang `/tech-trends/on-thi-jpd113` của web còn ghi cơ cấu **30 · 60 · 10** (bản cũ hơn). Nếu kỳ của bạn dùng bản nào, hãy hỏi lại cô/giám thị; phần luyện (đọc to, trả lời trọn câu, chào hỏi) giống nhau ở cả hai bản.',
    ]),
    RECAP('Đọc 1 phút trước khi ôn', [
      '**Hình thức**: vấn đáp 1–1 giám thị – sinh viên, khoảng **5–7 phút** (đã gồm thời gian chấm). Giám thị **ghi âm** để phúc tra. Không mang điện thoại vào phòng thi.',
      '**READING 40 điểm**: đọc to một đoạn khoảng **100–110 ký tự**, chuẩn bị **30 giây**. **TALKING 55 điểm**: trả lời **4 câu** — **3 câu có tranh (15 điểm/câu) + 1 câu không tranh (10 điểm)**. **PRESENTING 5 điểm**: chào bằng tiếng Nhật khi vào và trước khi ra.',
      'Không được đổi bài đọc và câu hỏi. Mỗi câu hỏi được **xin nhắc lại tối đa 2 lần** không bị trừ điểm (nói tiếng Nhật hoặc tiếng Việt đều được).',
      'Tránh ba lỗi nặng nhất: **quên はい／いいえ**, **sai trợ từ** (trừ 2 điểm), **đọc sai ký tự** khi Reading (trừ 0,2 điểm/ký tự).',
    ]),
    { t: 'h', text: '1. Cấu trúc đề thi nói' },
    TABLE(
      ['Phần', 'Điểm', 'Làm gì', 'Chuẩn bị'],
      [
        ['READING', '40', 'Giám thị chọn một bài; bạn chuẩn bị **30 giây**; rồi **đọc to** (không có câu hỏi kèm). Bài dài khoảng 100–110 ký tự.', 'Đọc to mỗi ngày; quen chữ Hán không furigana và katakana'],
        ['TALKING — có tranh', '15 × 3', '3 câu hỏi cho sẵn, mỗi tranh một câu: nhân vật/ biển hiệu/ đồ vật/ giờ–lịch/ nhà hàng.', 'Học khung câu trả lời đủ dạng Bài 1–3'],
        ['TALKING — không tranh', '10', '1 câu hỏi cá nhân hoặc hỏi từ (vd. 毎朝何時に食べますか).', 'Chuẩn bị hồ sơ cá nhân và câu trả lời mẫu'],
        ['PRESENTING', '5', 'Chào hỏi bằng tiếng Nhật khi **vào** phòng và **trước khi rời** phòng; tác phong, thái độ.', 'Tập 3 câu chào ở `on113-noi-mau`'],
      ],
      'Cơ cấu đề (bản 09/06/2025)',
    ),
    { t: 'h', text: '2. Cách chấm Reading (40 điểm)' },
    TABLE(
      ['Nội dung', 'Lưu ý', 'Điểm tối đa'],
      [
        ['Đọc chữ Hán', '**4 từ** viết bằng chữ Hán được gạch chân; chữ không gạch chân sẽ có furigana', '12'],
        ['Đọc katakana', '**4 từ** viết bằng katakana', '12'],
        ['Đọc hiragana', '**70–80 chữ** hiragana; **sai một ký tự trừ 0,2 điểm**', '16'],
      ],
    ),
    { t: 'h', text: '3. Cách chấm Talking (55 điểm)' },
    TABLE(
      ['Loại lỗi', 'Bị trừ'],
      [
        ['Lỗi sai **ảnh hưởng tới việc hiểu toàn bộ nội dung**', 'Mất toàn bộ điểm của câu đó'],
        ['Lỗi sai **không làm thay đổi cách hiểu câu** (vd. trả lời Có/Không mà quên はい／いいえ)', 'Trừ tối đa 5 điểm'],
        ['Đúng ngữ pháp, hiểu câu hỏi nhưng **dùng sai từ vựng** để trả lời', 'Tối đa được 3 điểm'],
        ['**Sai trợ từ**', 'Trừ 2 điểm'],
        ['Lưu loát, phát âm', '2 điểm mỗi câu'],
        ['Ngập ngừng khi đọc/ trả lời', 'Trừ không quá 5% cho mỗi đầu điểm'],
      ],
    ),
    { t: 'h', text: '4. 27 câu hỏi mẫu của cô (Sample Questions)' },
    P('Cô liệt kê câu hỏi mẫu theo từng Lesson; phần "＿＿" là tên bạn/bạn cùng lớp hoặc nhân vật trong tranh. Câu hỏi **thi thật** thuộc đúng các dạng này.'),
    TABLEJ1(
      ['Lesson', 'Câu hỏi mẫu', 'Nghĩa'],
      [
        ['1', 'カリナ-さん は なんさい です か。', 'Karina bao nhiêu tuổi?'],
        ['1', '＿＿ さん の おしごと は なん です か。', 'Công việc của ＿＿ là gì?'],
        ['1', '＿＿ さん は {学生|がくせい} です か。', '＿＿ có phải sinh viên không?'],
        ['1', '＿＿ さん は どこ の きょうし です か。', '＿＿ là giáo viên của trường nào?'],
        ['1', '＿＿ さん の お{国|くに} は どちら です か。', 'Nước của ＿＿ là nước nào?'],
        ['1', '＿＿ さん は ＿＿ じん です か。', '＿＿ có phải người ＿＿ không?'],
        ['1', '＿＿ さん の しゅみ は なん です か。', 'Sở thích của ＿＿ là gì?'],
        ['1', '＿＿ さん の しゅみ は テニス です か。', 'Sở thích của ＿＿ là tennis phải không?'],
        ['1', '＿＿ さん の たんじょうび は いつ です か。', 'Sinh nhật của ＿＿ khi nào?'],
        ['1', '＿＿ は なんがつ なんにち です か。', 'Ngày ＿＿ là ngày mấy tháng mấy?'],
        ['2', 'これ は なん の りょうり です か。', 'Đây là món gì?'],
        ['2', '＿＿ は だれ の です か。', '＿＿ là của ai?'],
        ['2', 'これ は どこ の ＿＿ です か。', 'Đây là ＿＿ của hãng/nước nào?'],
        ['2', '＿＿ は いくら です か。', '＿＿ giá bao nhiêu?'],
        ['2', 'ここ は レストラン です。 ご{注文|ちゅうもん} ください。', 'Đây là nhà hàng. Mời gọi món.'],
        ['2', 'レストラン は なんかい／どこ です か。', 'Nhà hàng ở tầng mấy/ở đâu?'],
        ['2', 'これ は ベトナム{語|ご} で なん です か。', 'Cái này tiếng Việt là gì?'],
        ['3', '～ は {何時|なんじ} から {何時|なんじ} まで です か。', '～ từ mấy giờ đến mấy giờ?'],
        ['3', '～ は {何曜日|なんようび} から {何曜日|なんようび} まで です か。', '～ từ thứ mấy đến thứ mấy?'],
        ['3', '～ は いつ から いつ まで です か。', '～ từ bao giờ đến bao giờ?'],
        ['3', '{図書館|としょかん} で {何|なに} を します か。', 'Bạn làm gì ở thư viện?'],
        ['3', '～ の {休|やす}み は {何曜日|なんようび} です か。／ いつ です か。', 'Ngày nghỉ của ～ là thứ mấy/khi nào?'],
        ['3', 'A さん は {休|やす}みの{日|ひ}、 {何|なに} を します か。', 'Ngày nghỉ A làm gì?'],
        ['3', 'A さん は {毎朝|まいあさ}、 {何時|なんじ} に {食|た}べます か。', 'Sáng nào A cũng ăn lúc mấy giờ?'],
        ['3', 'A さん は {何|なに} を {買|か}います か。／ {見|み}ます か。／ {読|よ}みます か。／ {聞|き}きます か。', 'A mua/xem/đọc/nghe gì?'],
        ['3', 'A さん は {毎朝|まいあさ}、 パン を {食|た}べます か。／ {日本語|にほんご} を {勉強|べんきょう}します か。', 'Sáng nào A ăn bánh mì/học tiếng Nhật không?'],
        ['3', 'A さん は どこ へ {行|い}きます か。', 'A đi đâu?'],
      ],
      'Câu hỏi mẫu Lesson 1–3 (rút gọn dạng; cột "Nghĩa" là tiếng Việt)',
    ),
    NOTE('Cách dùng danh sách 27 câu', [
      'Mỗi câu hỏi → chuẩn bị **một câu trả lời trọn bằng thông tin THẬT của bạn** (tên, tuổi, nước, giờ dậy…). Câu trả lời thật dễ nhớ hơn câu học thuộc của người khác.',
      'Câu hỏi có tranh: giám thị cầm tranh nên có thể hỏi bằng これ／この; bạn đáp bằng それ／その (tuỳ vị trí tranh) — xem `on113-noi-mau`.',
      'Mỗi dạng Lesson 3 đã có bài luyện riêng ở `s113-b3-07-…` và `lt-b3-noi-viet`.',
    ]),
    { t: 'h', text: '5. Chiến lược từng phần' },
    TABLE(
      ['Phần', 'Làm theo thứ tự', 'Bẫy cần tránh'],
      [
        ['**Chào hỏi (5đ)**', 'Gõ cửa → 「しつれいします」→ chào → 「よろしくお願いします」; cuối: 「ありがとうございました。しつれいします」', 'Quên chào khi ra; vào mà không nói gì'],
        ['**Reading (40đ)**', '30 giây: lướt **4 từ chữ Hán gạch chân**, **4 katakana**, rồi đọc thầm cả đoạn một lần. Khi đọc: **chậm vừa, đều**, ngắt đúng 、 và 。', 'Đọc sai một ký tự (−0,2); đọc は là ha thay vì wa; nuốt trường âm ー／ゅう; ngập ngừng giữa câu'],
        ['**Talking có tranh (15đ×3)**', 'Nghe **từ để hỏi** (どこ/なに/いつ/いくら/なんじ) → nhìn tranh tìm thông tin → trả lời **trọn câu**', 'Trả lời cụt; nhìn nhầm tranh; đọc sai số (giá, giờ)'],
        ['**Talking không tranh (10đ)**', 'Nghe câu hỏi → trả lời trọn câu bằng khung đã học; Có/Không **bắt buộc はい／いいえ**', 'Quên はい／いいえ (−5); sai trợ từ (−2); im lặng quá lâu'],
        ['**Khi không nghe rõ**', '「もう一度お願いします」(tối đa 2 lần, không trừ điểm)', 'Đoán bừa; im lặng'],
      ],
    ),
    { t: 'h', text: '6. Lịch ôn 7 ngày trước khi thi' },
    TABLE(
      ['Ngày', 'Việc chính', 'Lesson'],
      [
        ['1', 'Đọc cấu trúc đề + chiến lược; làm bài kiểm tra cuối lesson này', '`on113-cau-truc`'],
        ['2', 'Ngữ pháp & từ vựng Bài 1–2; làm hết mục A, C', '`on113-ngu-phap-tu-vung`'],
        ['3', 'Ngữ pháp & từ vựng Bài 3; số–giờ–giá; làm mục B, D', '`on113-ngu-phap-tu-vung`'],
        ['4', 'Reading: đọc to 6 đoạn, thu âm, so với cách đọc', '`on113-doc-to`'],
        ['5', 'Talking: nói 27 câu mẫu bằng thông tin của bạn; 3 bộ tranh', '`on113-noi-mau`'],
        ['6', '**Làm thử đề tổng hợp bấm giờ**, không xem đáp án giữa chừng', '`on113-de-tong-hop`'],
        ['7', 'Chữa câu sai; xem danh sách lỗi mất điểm; diễn thử cả buổi thi từ chào đến chào', '`on113-loi-mat-diem` + `on113-noi-mau`'],
      ],
    ),
    MC('on113-ct-kt', 'Kiểm tra: bạn nhớ cấu trúc đề chưa? (8 câu)', [
      Q('Thi nói JPD113 (bản 06/2025) chia điểm thế nào?', 'Reading 40 · Talking 55 · Presenting 5', 'Reading 30 · Talking 60 · Presenting 10 | Reading 45 · Talking 45 · Presenting 10 | Reading 50 · Talking 50', 'Theo hướng dẫn 09/06/2025.'),
      Q('Phần Talking có mấy câu hỏi?', '4 câu (3 có tranh + 1 không tranh)', '3 câu (1 có tranh) | 5 câu không tranh | 2 câu có tranh', '3 × 15 + 10 = 55.'),
      Q('Thời gian chuẩn bị bài Reading là…', '30 giây', '10 giây | 20 giây | 1 phút', 'JPD113: 30 giây.'),
      Q('Đọc sai một ký tự hiragana trong Reading bị trừ…', '0,2 điểm', '1 điểm | 2 điểm | Không trừ', 'Mỗi ký tự trừ 0,2.'),
      Q('Quên はい／いいえ ở câu Có/Không bị trừ…', 'Tối đa 5 điểm', '2 điểm | Mất toàn bộ điểm câu | Không bị trừ', 'Lỗi không thay đổi cách hiểu: trừ tối đa 5.'),
      Q('Sai trợ từ bị trừ…', '2 điểm', '5 điểm | 0,2 điểm | Mất toàn bộ điểm câu', 'Sai trợ từ trừ 2 điểm.'),
      Q('Được xin giám thị nhắc lại câu hỏi tối đa…', '2 lần, không bị trừ điểm', '1 lần | 3 lần | Không được', 'Tối đa 2 lần.'),
      Q('Phần Presenting (5 điểm) chấm gì?', 'Chào bằng tiếng Nhật khi vào và trước khi rời phòng, tác phong', 'Chữ viết tay | Tốc độ đọc | Độ dài câu trả lời', 'Chào hỏi + tác phong.'),
    ]),
  ],
};


/* ───────── 2. NGỮ PHÁP & TỪ VỰNG B1–3 TỔNG HỢP ───────── */

const O_NGP_TV: Lesson = {
  id: 'on113-ngu-phap-tu-vung',
  kind: 'review',
  title: 'Ôn thi JPD113 (Bài 1–3) — ngữ pháp ポイント 1–23 và từ vựng tổng hợp, số–giờ–giá–tầng–tuổi',
  goal: 'Có trong một lesson toàn bộ ngữ pháp Bài 1–3 (23 ポイント), nhóm từ vựng trọng tâm và cách đọc số cần cho thi nói — kèm bài tập tự kiểm tra từ nhận biết đến tự gõ.',
  minutes: 70,
  blocks: [
    HOW([
      'Đọc bảng ポイント 1–23 **một lượt** để nhớ lại, rồi làm bài tập. Câu nào sai thì quay lại lesson gốc (`b1-ngu-phap`, `b2-ngu-phap`, `b3-ngu-phap`).',
      'Thi nói không hỏi ngữ pháp thuần, nhưng **sai trợ từ trừ 2 điểm mỗi lần** — nên phần trợ từ phải chắc nhất.',
      'Số–giờ–giá–tầng–tuổi là chỗ mất điểm nhiều: làm mục D thật kỹ, đọc to từng đáp án.',
    ]),
    { t: 'h', text: '1. Ngữ pháp Bài 1–3 trên một trang' },
    TABLE(
      ['PT', 'Công thức', 'Ví dụ + romaji'],
      [
        ['1', 'N1 は N2 です', JR('{私|わたし} は アンナ です。')],
        ['2', 'N1 は N2 ですか／はい・いいえ', JR('{学生|がくせい} です か。')],
        ['3', 'どちら／いつ／何 ですか', JR('お{国|くに} は どちら です か。')],
        ['4', 'N1 の N2', JR('{私|わたし} の {趣味|しゅみ} は テニス です。')],
        ['5', 'N1 と N2', JR('パン と {牛乳|ぎゅうにゅう} を ください。')],
        ['6', 'N も', JR('{私|わたし} も {学生|がくせい} です。')],
        ['7', 'これ／それ／あれ', JR('これ は いくら です か。')],
        ['8', 'この／その／あの N', JR('この かばん は いくら です か。')],
        ['9', 'ここ／そこ／あそこ／どこ', JR('レストラン は どこ です か。')],
        ['10', 'N を（～つ）ください', JR('コーヒー を {二|ふた}つ ください。')],
        ['11', 'いくら', JR('これ は いくら です か。')],
        ['12', '何の N', JR('これ は {何|なん} の りょうり です か。')],
        ['13', 'どこの N', JR('これ は どこ の ビール です か。')],
        ['14', '誰の N', JR('これ は だれ の です か。')],
        ['15', 'N（～語）で', JR('ベトナム{語|ご} で {何|なん} です か。')],
        ['16', 'N は V ます／ません', JR('{朝|あさ}、 {何|なに}も {食|た}べません。')],
        ['17', 'N（nơi）へ 行きます／来ます／帰ります', JR('{公園|こうえん} へ {行|い}きます。')],
        ['18', 'N を V ます', JR('テレビ を {見|み}ます。')],
        ['19', 'N（giờ・ngày）に V ます', JR('{七時|しちじ} に {起|お}きます。')],
        ['20', 'N（nơi）で V ます', JR('{図書館|としょかん} で {勉強|べんきょう}します。')],
        ['21', '〜から〜まで', JR('{九時|くじ} から {五時|ごじ} まで です。')],
        ['22', 'N1 や N2 など', JR('パン や {果物|くだもの} など を {食|た}べます。')],
        ['23', '何も／どこ（へ）も〜ません', JR('どこ へ も {行|い}きません。')],
      ],
    ),
    { t: 'h', text: '2. Từ vựng trọng tâm theo chủ đề (Bài 1–3)' },
    TABLE(
      ['Chủ đề', 'Từ cần chắc'],
      [
        ['Nước, người', '{日本|にほん} · {韓国|かんこく} · {中国|ちゅうごく} · アメリカ · イタリア · オーストラリア · ベトナム · タイ · ブラジル · ロシア · インド · ドイツ · フランス · 〜{人|じん} · 〜{語|ご}'],
        ['Việc, trường', '{学生|がくせい} · {先生|せんせい} · {教師|きょうし} · {会社員|かいしゃいん} · {高校|こうこう} · {大学|だいがく} · {日本語学校|にほんごがっこう} · {留学生|りゅうがくせい}'],
        ['Sở thích', '{趣味|しゅみ} · スポーツ · サッカー · テニス · {水泳|すいえい} · {映画|えいが} · {音楽|おんがく} · {読書|どくしょ} · {旅行|りょこう} · {料理|りょうり}'],
        ['Mua sắm, nơi chốn', 'スーパー · レストラン · きっさてん · トイレ · レジ · エレベーター · エスカレーター · {地下|ちか} · 〜{階|かい} · 〜{屋|や} · {100円|ひゃくえん}ショップ'],
        ['Đồ vật, thực phẩm', 'カメラ · {携帯電話|けいたいでんわ} · パソコン · かばん · くつ · {時計|とけい} · {財布|さいふ} · パン · ケーキ · {卵|たまご} · {魚|さかな} · {肉|にく} · {野菜|やさい}'],
        ['Gọi món', 'カレー · スープ · ハンバーグ · ご{飯|はん} · ライス · ジュース · コーヒー · {紅茶|こうちゃ} · ビール · {注文|ちゅうもん} · いらっしゃいませ · ください'],
        ['Giờ, lịch (B3)', '{今|いま} · {午前|ごぜん} · {午後|ごご} · {時間|じかん} · 〜{時|じ} · 〜{分|ふん} · 〜{曜日|ようび} · {毎日|まいにち} · {毎朝|まいあさ} · {毎晩|まいばん} · {休|やす}み · スケジュール · アルバイト'],
        ['Nơi chốn (B3)', '{銀行|ぎんこう} · {体育館|たいいくかん} · {図書館|としょかん} · {病院|びょういん} · {郵便局|ゆうびんきょく} · {学校|がっこう} · {会社|かいしゃ} · コンビニ · {海|うみ} · {公園|こうえん}'],
        ['14 động từ (B3)', '{行|い}きます · {帰|かえ}ります · {飲|の}みます · {食|た}べます · {見|み}ます · します · {買|か}います · {聞|き}きます · {働|はたら}きます · {読|よ}みます · {起|お}きます · {寝|ね}ます · {勉強|べんきょう}します · {来|き}ます'],
      ],
    ),
    { t: 'h', text: '3. Số, giờ, giá, tầng, tuổi — bảng đọc' },
    TABLE(
      ['Loại', 'Đọc', 'Ví dụ'],
      [
        ['Giá tiền', 'Số + えん; chú ý 300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3.000 さんぜん · 4.500 よんせんごひゃく · 8.000 はっせん · 10.000 いちまん', '{四千五百円|よんせんごひゃくえん} · {六百円|ろっぴゃくえん} · {三千円|さんぜんえん}'],
        ['Tầng', '1 いっかい · 2 にかい · 3 さんがい · 4 よんかい · 5 ごかい · 6 ろっかい · 7 ななかい · 8 はっかい · 10 じゅっかい · B1 ちかいっかい', 'レストランは {三階|さんがい} です。'],
        ['Tuổi', '1 いっさい · 8 はっさい · 10 じゅっさい · **20 = はたち** · 19 じゅうきゅうさい', '{二十歳|はたち} · {十九歳|じゅうきゅうさい}'],
        ['Giờ', '**4 よじ · 7 しちじ · 9 くじ**', '{四時|よじ} · {七時|しちじ} · {九時|くじ}'],
        ['Phút', 'ぷん: 1・3・4・6・8・10 — ふん: 2・5・7・9・15', '{十分|じゅっぷん} · {五分|ごふん}'],
        ['Tháng, ngày', '4月 しがつ · 7月 しちがつ · 9月 くがつ · ngày 1–10・14・20・24 đọc riêng', '{四月|しがつ}{四日|よっか}'],
      ],
    ),

    H(`${LV.de} — A. Ngữ pháp Bài 1–2 (14 câu)`),
    MC('on113-np-a', 'A. Chọn đáp án đúng', [
      Q('{私|わたし}＿＿ アンナです。', 'は', 'を | の | へ', 'N1 は N2 です.'),
      Q('{私|わたし}＿＿ {趣味|しゅみ}は {音楽|おんがく}です。', 'の', 'は | を | と', 'N1 の N2.'),
      Q('パン＿＿ {牛乳|ぎゅうにゅう}を ください。', 'と', 'の | は | も', 'N1 と N2.'),
      Q('アンナさんは {学生|がくせい}です。ダニエルさん＿＿ {学生|がくせい}です。', 'も', 'は | の | と', '"Cũng" → も.'),
      Q('お{国|くに}は＿＿＿ですか。', 'どちら', 'いつ | いくら | だれ', 'Hỏi nước → どちら.'),
      Q('{誕生日|たんじょうび}は＿＿＿ですか。', 'いつ', 'どちら | いくら | どこ', 'Hỏi ngày → いつ.'),
      Q('(cái ở gần người NGHE) ＿＿は いくらですか。', 'それ', 'これ | あれ | どれ', 'Gần người nghe → それ.'),
      Q('(cái ở xa cả hai người) ＿＿{本|ほん}は いくらですか。', 'あの', 'この | その | どの', 'Xa cả hai → あの.'),
      Q('レストランは＿＿＿ですか。 — {三階|さんがい}です。', 'どこ', 'いくら | だれ | {何|なに}', 'Hỏi nơi → どこ.'),
      Q('コーヒー＿＿ {二|ふた}つ ください。', 'を', 'は | の | も', 'N を ください.'),
      Q('これは＿＿＿ですか。 — {千円|せんえん}です。', 'いくら', 'だれ | どこ | {何|なん}', 'Hỏi giá → いくら.'),
      Q('これは{何|なん}＿＿ りょうりですか。 — {魚|さかな}の りょうりです。', 'の', 'を | で | と', '何の N.'),
      Q('これは＿＿＿ のですか。 — アンナさんのです。', 'だれ', 'いくら | どこ | {何|なに}', 'Hỏi chủ sở hữu → だれの.'),
      Q('ベトナム{語|ご}＿＿ {何|なん}ですか。', 'で', 'を | の | が', 'N (〜語) で.'),
    ]),

    H(`${LV.de} — B. Ngữ pháp Bài 3 (10 câu)`),
    MC('on113-np-b', 'B. Chọn đáp án đúng', [
      Q('{私|わたし}は {毎日|まいにち}、 {日本語|にほんご}＿＿ {勉強|べんきょう}します。', 'を', 'へ | で | に', '勉強する + を.'),
      Q('{日曜日|にちようび}、 {公園|こうえん}＿＿ {行|い}きます。', 'へ', 'を | で | が', 'Đích → へ.'),
      Q('{七時|しちじ}＿＿ {起|お}きます。', 'に', 'で | を | へ', 'Giờ → に.'),
      Q('{図書館|としょかん}＿＿ {勉強|べんきょう}します。', 'で', 'に | へ | を', 'Nơi làm → で.'),
      Q('{銀行|ぎんこう}は {九時|くじ}＿＿ {三時|さんじ}＿＿ です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ… đến…'),
      Q('{朝|あさ}、 パン＿＿ {果物|くだもの}などを {食|た}べます。', 'や', 'と | が | に', 'や + など.'),
      Q('{朝|あさ}、 {何|なに}＿＿ {食|た}べません。', 'も', 'を | が | に', '何も + ません.'),
      Q('「{毎朝|まいあさ}、 {新聞|しんぶん}を{読|よ}みますか。」 — いいえ、＿＿＿', '{読|よ}みません。', '{読|よ}みます。 | そうじゃありません。 | {読|よ}みですか。', 'Phủ định.'),
      Q('{毎朝|まいあさ}＿＿、 {七時|しちじ}に {起|お}きます。', 'X (không cần)', 'に | で | を', '毎朝 không に.'),
      Q('{家|うち}（nhà mình）へ… — động từ đúng:', '{帰|かえ}ります', '{行|い}きます | {来|き}ます | {見|み}ます', 'Về nhà mình → 帰ります.'),
    ]),

    H(`${LV.vua} — C. Từ vựng tổng hợp Bài 1–3 (14 câu)`),
    MC('on113-tv-c', 'C. Từ vựng', [
      Q('「{韓国|かんこく}」は？', 'Hàn Quốc', 'Trung Quốc | Thái Lan | Nga', '韓国 = かんこく.'),
      Q('「{会社員|かいしゃいん}」は？', 'Nhân viên công ty', 'Giáo viên | Sinh viên | Bác sĩ', '会社員 = かいしゃいん.'),
      Q('「{趣味|しゅみ}」は？', 'Sở thích', 'Công việc | Sinh nhật | Nghề', '趣味 = しゅみ.'),
      Q('「{誕生日|たんじょうび}」は？', 'Sinh nhật', 'Kỳ nghỉ | Ngày mai | Tuổi', '誕生日 = たんじょうび.'),
      Q('「ハンバーグ」は？', 'Bít tết/bánh thịt băm kiểu Nhật', 'Một loại cà phê | Một loại bánh ngọt | Một loại rau', 'ハンバーグ = hamburg steak.'),
      Q('「{携帯電話|けいたいでんわ}」は？', 'Điện thoại di động', 'Máy ảnh | Đồng hồ | Máy tính', '携帯電話 = けいたいでんわ.'),
      Q('「{財布|さいふ}」は？', 'Ví tiền', 'Cặp sách | Giày | Đồng hồ', '財布 = さいふ.'),
      Q('「{銀行|ぎんこう}」は？', 'Ngân hàng', 'Bưu điện | Bệnh viện | Thư viện', '銀行 = ぎんこう.'),
      Q('「{午後|ごご}」は？', 'Buổi chiều (PM)', 'Buổi sáng (AM) | Buổi trưa | Mỗi chiều', '午後 = ごご.'),
      Q('「{毎晩|まいばん}」は？', 'Mỗi tối', 'Mỗi sáng | Mỗi ngày | Mỗi tuần', '毎晩 = まいばん.'),
      Q('「{注文|ちゅうもん}」は？', 'Gọi món', 'Thanh toán | Mời vào | Cảm ơn', '注文 = ちゅうもん.'),
      Q('「{留学生|りゅうがくせい}」は？', 'Du học sinh', 'Học sinh cấp ba | Giáo viên | Nhân viên', '留学生 = りゅうがくせい.'),
      Q('「{地下一階|ちかいっかい}」 — "B1" đọc là…', 'ちかいっかい', 'じげいっかい | ちかひとかい | しもいっかい', '地下1階 = ちかいっかい.'),
      Q('「{食|た}べます」は？', 'Ăn', 'Uống | Xem | Mua', '食べる = ăn.'),
    ]),

    H(`${LV.vua} — D. Số, giá, tầng, tuổi, giờ — đọc cho đúng (12 câu)`),
    MC('on113-so-d', 'D. Cách đọc', [
      Q('4.500円', 'よんせんごひゃくえん', 'よんせんごびゃくえん | しせんごひゃくえん | よんせんごひゃくいん', '4.500 = よんせん ごひゃく.'),
      Q('600円', 'ろっぴゃくえん', 'ろくひゃくえん | ろっひゃくえん | ろくびゃくえん', '600 = ろっぴゃく.'),
      Q('800円', 'はっぴゃくえん', 'はちひゃくえん | はっひゃくえん | はちびゃくえん', '800 = はっぴゃく.'),
      Q('3.000円', 'さんぜんえん', 'さんせんえん | みっせんえん | さんぜんいん', '3.000 = さんぜん.'),
      Q('10.000円', 'いちまんえん', 'じゅうせんえん | ひゃくせんえん | いっまんえん', '10.000 = いちまん.'),
      Q('3階', 'さんがい', 'さんかい | みっかい | さんがく', '3階 = さんがい.'),
      Q('6階', 'ろっかい', 'ろくかい | ろくがい | ろっがい', '6階 = ろっかい.'),
      Q('8階', 'はっかい', 'はちかい | はっがい | はちがい', '8階 = はっかい.'),
      Q('20歳', 'はたち', 'にじゅっさい | にじゅうさい | ふたちさい', '20歳 = はたち.'),
      Q('8歳', 'はっさい', 'はちさい | はっざい | やっさい', '8歳 = はっさい.'),
      Q('9:00', 'くじ', 'きゅうじ | くうじ | ここのじ', '9時 = くじ.'),
      Q('4月4日', 'しがつよっか', 'よんがつよっか | しがつよんにち | しがつしにち', '4月 = しがつ; 4日 = よっか.'),
    ]),

    H(`${LV.kho} — E. Dịch Việt → Nhật (gõ tay, 12 câu)`),
    QZ('on113-tv-e', 'E. Dịch sang tiếng Nhật', 'translate', [
      A('Tôi là Cường. Tôi là người Việt Nam.', ['{私|わたし}はクオンです。ベトナム{人|じん}です。', 'クオンです。ベトナム{人|じん}です。', '{私|わたし}はクオンです。ベトナムじんです。'], 'N は N です'),
      A('Sở thích của tôi là âm nhạc.', ['{私|わたし}の{趣味|しゅみ}は{音楽|おんがく}です。', '{趣味|しゅみ}は{音楽|おんがく}です。'], 'N の N'),
      A('Cái này giá bao nhiêu?', ['これはいくらですか。'], 'いくら'),
      A('Cho tôi hai cái bánh mì.', ['パンを{二|ふた}つください。', 'パンを2つください。'], '〜つ・ください'),
      A('Nhà hàng ở tầng 3.', ['レストランは{三階|さんがい}です。', 'レストランは3{階|かい}です。', 'レストランは3{階|がい}です。'], '〜階'),
      AD('Sinh nhật tôi là ngày 4 tháng 8.', ['{私|わたし}の{誕生日|たんじょうび}は{8月|はちがつ}{4日|よっか}です。', '{誕生日|たんじょうび}は{8月|はちがつ}{4日|よっか}です。'], '8月・4日'),
      AD('Thư viện mở từ 9 giờ đến 7 giờ.', ['{図書館|としょかん}は{9時|くじ}から{7時|しちじ}までです。'], 'から・まで'),
      AD('Sáng nào tôi cũng ăn bánh mì.', ['{毎朝|まいあさ}、パンを{食|た}べます。', '{私|わたし}は{毎朝|まいあさ}パンを{食|た}べます。'], '毎朝・を'),
      AD('Chủ nhật tôi không đi đâu cả.', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。'], 'どこへも'),
      A('Cái này là của ai?', ['これは{誰|だれ}のですか。', 'これはだれのですか。'], 'だれの'),
      A('Cái này là món gì?', ['これは{何|なん}の{料理|りょうり}ですか。', 'これは{何|なん}のりょうりですか。'], '何の'),
      A('Tôi 20 tuổi.', ['{私|わたし}は{二十歳|はたち}です。', '{私|わたし}は20{歳|さい}です。', '{二十歳|はたち}です。'], 'はたち'),
    ], 'ポイント 1–23'),
  ],
};


/* ───────── 3. ĐỌC TO (READING 40 ĐIỂM) ───────── */

const O_DOC_TO: Lesson = {
  id: 'on113-doc-to',
  kind: 'reading',
  title: 'Ôn thi JPD113 (Bài 1–3) — Reading 40 điểm: đọc to chữ Hán · katakana · hiragana, 6 đoạn luyện và bẫy phát âm',
  goal: 'Đọc to trôi chảy, không sai ký tự một đoạn 100–110 ký tự có 4 từ chữ Hán không furigana, 4 từ katakana và 70–80 chữ hiragana, trong 30 giây chuẩn bị.',
  minutes: 60,
  blocks: [
    HOW([
      'Reading là phần **dễ lấy điểm nhất** nếu luyện đúng: bạn biết trước dạng bài (web có sẵn 13 đoạn trong ngân hàng thi nói của môn, cùng các đoạn tương tự) và chỉ cần **đọc đúng, đều, không ngập ngừng**.',
      'Mỗi lượt: ① nhìn 30 giây (như thi) ② đọc to một hơi ③ bấm hiện cách đọc để tự chấm ④ đọc lại chỗ vấp 3 lần. **Thu âm** rồi nghe lại.',
      'Sai một ký tự trừ 0,2 điểm — nên **chậm vừa và chính xác** quan trọng hơn nhanh.',
    ]),
    RECAP('Điểm Reading và cách chấm', [
      '**4 từ chữ Hán** được gạch chân (không furigana): **12 điểm**. Chữ không gạch chân thì có furigana.',
      '**4 từ katakana**: **12 điểm**. **70–80 chữ hiragana**: **16 điểm**, sai một ký tự **trừ 0,2**.',
      'Chuẩn bị **30 giây**: lướt qua 4 chữ Hán, 4 katakana, rồi đọc thầm cả đoạn một lượt.',
    ]),
    { t: 'h', text: '1. Những chỗ hay vấp khi đọc to' },
    TABLE(
      ['Chỗ vấp', 'Đọc đúng', 'Ví dụ'],
      [
        ['は làm trợ từ', '**wa** (không phải ha)', JR('{私|わたし} は グエン です。')],
        ['へ làm trợ từ', '**e** (không phải he)', JR('{公園|こうえん} へ {行|い}きます。')],
        ['を', '**o**', JR('テレビ を {見|み}ます。')],
        ['Trường âm ー', 'Kéo dài đúng một nhịp', 'オーストラリア · コーヒー · サッカー · スーパー'],
        ['っ (âm ngắt)', 'Ngừng nửa nhịp trước phụ âm', 'サッカー · {学校|がっこう} · {十分|じゅっぷん}'],
        ['ゃ ゅ ょ (âm ghép)', 'Đọc liền một âm', 'きゅう · しゅみ · ちゅうごく · りょこう'],
        ['4・7・9 giờ', 'よじ · しちじ · くじ', JR('{四時|よじ} · {七時|しちじ} · {九時|くじ}')],
        ['Ngày bất quy tắc', 'ついたち · ふつか · … · はつか', '{四日|よっか} · {十日|とおか} · {二十日|はつか}'],
        ['Tuổi 20', '**はたち**', '{二十歳|はたち}'],
        ['Tên nước katakana dài', 'Chia khúc: オー・スト・ラ・リ・ア', 'オーストラリア · アメリカ · イタリア'],
      ],
    ),
    { t: 'h', text: '2. Katakana trong Bài 1–3 — luyện đọc' },
    READK('on113-dt-kata', 'Đọc to các nhóm katakana (nhìn trước, rồi bấm hiện cách đọc)', 'Katakana chiếm 12 điểm. Chú ý trường âm ー và âm ngắt ッ.', [
      RK('アメリカ、 イタリア、 オーストラリア、 ベトナム、 タイ、 ブラジル、 ロシア、 インド、 ドイツ、 フランス', 'Các nước (Mỹ, Ý, Úc, Việt Nam, Thái, Brazil, Nga, Ấn Độ, Đức, Pháp).'),
      RK('サッカー、 テニス、 スポーツ', 'Môn thể thao (bóng đá, quần vợt, thể thao).'),
      RK('スーパー、 レストラン、 コンビニ、 トイレ、 エレベーター、 エスカレーター', 'Nơi và thiết bị (siêu thị, nhà hàng, cửa hàng tiện lợi, nhà vệ sinh, thang máy, thang cuốn).'),
      RK('カメラ、 パソコン、 ペン、 かばん', 'Đồ dùng (máy ảnh, máy tính, bút, cặp).'),
      RK('コーヒー、 ジュース、 ビール、 ワイン、 ライス、 カレー、 スープ、 ハンバーグ、 ケーキ、 パン', 'Đồ ăn uống (cà phê, nước ép, bia, rượu vang, cơm, cà ri, súp, hamburg, bánh, bánh mì).'),
      RK('スケジュール、 アルバイト、 パーティー、 バーベキュー、 ホームステイ、 ゴールデンウイーク、 インターネット、 テレビ、 サラダ、 チーズ', 'Từ Bài 3 (lịch, làm thêm, tiệc, BBQ, homestay, Tuần lễ Vàng, internet, ti vi, salad, phô mai).'),
    ]),
    { t: 'h', text: '3. Sáu đoạn luyện (mức Dễ → Khó)' },
    NOTE('Mỗi đoạn có "4 từ chữ Hán có thể bị gạch chân"', [
      'Trong đề thật, giám thị chọn **4 từ chữ Hán** trong đoạn để gạch chân; bạn không thấy furigana của chúng. Dưới mỗi đoạn mình nêu 4 từ dễ bị chọn để bạn kiểm tra riêng.',
      'Cách kiểm: che cách đọc, đọc to cả đoạn, rồi nhìn bảng "4 từ" để chắc bạn đọc đúng từng từ.',
    ]),
    READK('on113-dt-1', 'Đoạn 1 (Dễ) — tự giới thiệu', 'Bài tự giới thiệu: khuôn quen thuộc nhất của ngân hàng Reading.', [
      RK('はじめまして。 {私|わたし} は グエン です。 ベトナム{人|じん} です。 {大学|だいがく} の {学生|がくせい} です。 {趣味|しゅみ} は サッカー と {音楽|おんがく} です。 よろしく お{願|ねが}い します。', 'Rất vui được gặp. Tôi là Nguyễn. Tôi là người Việt Nam. Tôi là sinh viên đại học. Sở thích của tôi là bóng đá và âm nhạc. Mong được giúp đỡ.'),
    ]),
    NOTE('Đoạn 1 — 4 từ chữ Hán dễ bị chọn', [
      '{私|わたし} (watashi) · {大学|だいがく} (daigaku) · {学生|がくせい} (gakusei) · {趣味|しゅみ} (shumi) · {音楽|おんがく} (ongaku). Katakana: グエン・ベトナム・サッカー.',
    ]),
    READK('on113-dt-2', 'Đoạn 2 (Dễ) — đi siêu thị', 'Có số tiền: đọc đúng せんごひゃく.', [
      RK('{私|わたし} は {日曜日|にちようび}、 スーパー へ {行|い}きます。 パン と {牛乳|ぎゅうにゅう} を {買|か}います。 {卵|たまご} も {買|か}います。 {千五百円|せんごひゃくえん} です。', 'Chủ nhật tôi đi siêu thị. Tôi mua bánh mì và sữa. Tôi cũng mua trứng. Hết 1.500 yên.'),
    ]),
    NOTE('Đoạn 2 — 4 từ chữ Hán dễ bị chọn', [
      '{日曜日|にちようび} (nichiyōbi) · {牛乳|ぎゅうにゅう} (gyūnyū) · {卵|たまご} (tamago) · {千五百円|せんごひゃくえん} (sengohyaku-en). Katakana: スーパー・パン.',
    ]),
    READK('on113-dt-3', 'Đoạn 3 (Vừa) — nhà hàng', 'Hai món, hai mức giá: chú ý はっぴゃく／よんひゃく.', [
      RK('ここ は レストラン です。 {私|わたし} は カレー と コーヒー を {注文|ちゅうもん}します。 カレー は {八百円|はっぴゃくえん} です。 コーヒー は {四百円|よんひゃくえん} です。', 'Đây là nhà hàng. Tôi gọi cà ri và cà phê. Cà ri 800 yên. Cà phê 400 yên.'),
    ]),
    NOTE('Đoạn 3 — 4 từ chữ Hán dễ bị chọn', [
      '{私|わたし} (watashi) · {注文|ちゅうもん} (chūmon) · {八百円|はっぴゃくえん} (happyaku-en) · {四百円|よんひゃくえん} (yonhyaku-en). Katakana: レストラン・カレー・コーヒー.',
    ]),
    READK('on113-dt-4', 'Đoạn 4 (Vừa) — một tuần ở trường', 'Có thứ, giờ, nơi, phủ định.', [
      RK('{私|わたし} は {月曜日|げつようび} から {金曜日|きんようび} まで {学校|がっこう} へ {行|い}きます。 {毎朝|まいあさ}、 {七時|しちじ} に {起|お}きます。 {図書館|としょかん} で {勉強|べんきょう}します。 {日曜日|にちようび} は どこ へ も {行|い}きません。', 'Từ thứ Hai đến thứ Sáu tôi đi học. Sáng nào tôi cũng dậy lúc 7 giờ. Tôi học ở thư viện. Chủ nhật tôi không đi đâu cả.'),
    ]),
    NOTE('Đoạn 4 — 4 từ chữ Hán dễ bị chọn', [
      '{月曜日|げつようび} (getsuyōbi) · {金曜日|きんようび} (kin\'yōbi) · {毎朝|まいあさ} (maiasa) · {七時|しちじ} (shichiji) · {図書館|としょかん} (toshokan).',
    ]),
    READK('on113-dt-5', 'Đoạn 5 (Khó) — hội thoại hai vai', 'Đọc hai vai với giọng hơi khác nhau; chú ý ngắt ở 。 và ？', [
      RK('A： {朝|あさ}ご{飯|はん} は {何|なに} を {食|た}べます か。 B： パン と {果物|くだもの} を {食|た}べます。 A： {何時|なんじ} に {食|た}べます か。 B： {七時半|しちじはん} に {食|た}べます。', 'A: Bữa sáng bạn ăn gì? B: Mình ăn bánh mì và hoa quả. A: Bạn ăn lúc mấy giờ? B: Mình ăn lúc 7 giờ rưỡi.'),
    ]),
    NOTE('Đoạn 5 — 4 từ chữ Hán dễ bị chọn', [
      '{朝|あさ}ご{飯|はん} (asagohan) · {何|なに} (nani) · {果物|くだもの} (kudamono) · {七時半|しちじはん} (shichiji han).',
    ]),
    READK('on113-dt-6', 'Đoạn 6 (Khó) — mọi số viết bằng chữ Hán', 'Mẹo: trước khi đọc, khoanh mọi chữ Hán chỉ số và đọc thầm một lượt (10 giây).', [
      RK('{私|わたし} は {毎朝|まいあさ} {六時半|ろくじはん} に {起|お}きます。 {九時|くじ} から {十二時|じゅうにじ} まで {日本語|にほんご} を {勉強|べんきょう}します。 {土曜日|どようび} と {日曜日|にちようび} は {休|やす}み です。 {四月|しがつ} {四日|よっか} は {私|わたし} の {誕生日|たんじょうび} です。', 'Sáng nào tôi cũng dậy lúc 6 giờ rưỡi. Tôi học tiếng Nhật từ 9 giờ đến 12 giờ. Thứ Bảy và Chủ nhật là ngày nghỉ. Ngày 4 tháng 4 là sinh nhật của tôi.'),
    ]),
    NOTE('Đoạn 6 — 4 từ chữ Hán dễ bị chọn', [
      '{六時半|ろくじはん} (rokuji han) · {九時|くじ} (kuji) · {十二時|じゅうにじ} (jūniji) · {四月|しがつ} (shigatsu) · {四日|よっか} (yokka).',
    ]),
    MC('on113-dt-mc', 'Kiểm tra cách đọc (12 câu)', [
      Q('「{私|わたし}は」 — chữ 「は」 đọc là…', 'わ (wa)', 'は (ha) | ば (ba) | ぱ (pa)', 'は trợ từ chủ đề đọc wa.'),
      Q('「{学校|がっこう}へ」 — chữ 「へ」 đọc là…', 'え (e)', 'へ (he) | べ (be) | ぺ (pe)', 'へ trợ từ đọc e.'),
      Q('「テレビを」 — chữ 「を」 đọc là…', 'お (o)', 'う (u) | わ (wa) | ん (n)', 'を đọc o.'),
      Q('「オーストラリア」 đọc là…', 'おーすとらりあ', 'おすとらりあ | おうすとらりあ | おーすとらいあ', 'オー = kéo dài o; ス・ト・ラ・リ・ア.'),
      Q('「コーヒー」 đọc là…', 'こーひー', 'こひ | こうひい | こーひ', 'コー・ヒー.'),
      Q('「サッカー」 đọc là…', 'さっかー', 'さかー | さーっかー | さっかあ', 'サッ(ngắt)カー.'),
      Q('「ゴールデンウイーク」 đọc là…', 'ごーるでんういーく', 'ごるでんういく | ごーるでんうぃーく | ごーるどういーく', 'ゴールデン・ウイーク.'),
      Q('「{十分|じゅっぷん}」 (10 phút) đọc là…', 'じゅっぷん', 'じゅうふん | じゅうぷん | じっふん', 'じゅっぷん.'),
      Q('「{二十歳|はたち}」 đọc là…', 'はたち', 'にじゅっさい | にじゅうさい | ふたちさい', '20 tuổi = はたち.'),
      Q('「{七時半|しちじはん}」 đọc là…', 'しちじはん', 'ななじはん | しちじさんじゅうぷん | しちじぱん', '7 giờ rưỡi.'),
      Q('「{八百円|はっぴゃくえん}」 đọc là…', 'はっぴゃくえん', 'はちひゃくえん | はっひゃくえん | はちびゃくえん', '800 = はっぴゃく.'),
      Q('「{千五百円|せんごひゃくえん}」 đọc là…', 'せんごひゃくえん', 'いっせんごひゃくえん | せんごびゃくえん | ちごひゃくえん', '1.500 = せんごひゃく (không đọc いっせん).'),
    ]),
  ],
};


/* ───────── 4. NÓI — MẪU TRẢ LỜI (TALKING 55 + PRESENTING 5) ───────── */

const O_NOI_MAU: Lesson = {
  id: 'on113-noi-mau',
  kind: 'speaking',
  title: 'Ôn thi JPD113 (Bài 1–3) — Talking: mẫu trả lời 27 câu hỏi, 3 bộ tranh, chào hỏi, câu cứu hộ và buổi thi diễn thử',
  goal: 'Trả lời trọn câu, đúng trợ từ, có はい／いいえ cho 27 câu hỏi mẫu của cô (giới thiệu bản thân · mua sắm & gọi món · lịch trình), nhìn tranh trả lời được, và diễn thử trọn một buổi thi từ chào đến chào.',
  minutes: 75,
  blocks: [
    HOW([
      'Học theo vòng: ① đọc mẫu ② **thay bằng thông tin thật của bạn** ③ che mẫu, bấm 🎤, nói to ④ nghe lại, đối chiếu ⑤ lặp 3 lần. Mẫu dưới đây là **gợi ý viết mới** (không phải đáp án chính thức) — tên và số liệu là ví dụ.',
      'Chấm điểm Talking (bản 06/2025): lỗi làm hiểu sai câu → mất toàn bộ điểm; quên はい／いいえ → trừ tối đa 5; sai trợ từ → trừ 2; dùng sai từ vựng → tối đa 3. Mỗi câu còn **2 điểm lưu loát/phát âm**.',
      'Công thức vàng: **trả lời trọn câu bằng です／ます** + (nếu còn thời gian) **thêm một câu phụ**. Câu hỏi Có/Không: **はい、〜です。／いいえ、〜じゃありません。〜です。**',
    ]),
    { t: 'h', text: '0. Chuẩn bị "hồ sơ" của bạn (làm một lần, dùng cho cả ba Lesson)' },
    TABLE(
      ['Thông tin', 'Khung câu', 'Ví dụ để thay'],
      [
        ['Tên', JR('{私|わたし} は ＿＿ です。'), 'クオン · ナム · リン'],
        ['Nước', JR('＿＿ です。 / ＿＿{人|じん} です。'), 'ベトナム · ベトナム{人|じん}'],
        ['Nghề, trường', JR('＿＿ の {学生|がくせい} です。'), 'FPT{大学|だいがく} の {学生|がくせい}'],
        ['Tuổi', JR('＿＿ です。'), '{二十歳|はたち} · {二十一歳|にじゅういっさい} · {十九歳|じゅうきゅうさい}'],
        ['Sinh nhật', JR('＿＿ です。'), '{八月|はちがつ} {四日|よっか}'],
        ['Sở thích', JR('{私|わたし} の {趣味|しゅみ} は ＿＿ です。'), '{音楽|おんがく} · サッカー · {映画|えいが}'],
        ['Giờ dậy/ngủ', JR('{毎朝|まいあさ}、 ＿＿ に {起|お}きます。'), '{六時半|ろくじはん} · {七時|しちじ} / {十一時|じゅういちじ}'],
        ['Bữa sáng', JR('{朝|あさ}、 ＿＿ を {食|た}べます。'), 'パン · {果物|くだもの} · {何|なに}も…ません'],
        ['Ngày nghỉ', JR('{休|やす}みの{日|ひ}、 ＿＿ へ {行|い}きます。 / ＿＿ を します。'), '{公園|こうえん} · {海|うみ} · テレビ · サッカー'],
      ],
    ),

    { t: 'h', text: '1. Chào hỏi (Presenting 5 điểm)' },
    DLG('Vào phòng thi — rời phòng thi', [
      DX('Thí sinh', 'candidate', 'しつれい します。', 'Em xin phép (vào ạ).'),
      DX('Giám thị', 'examiner', 'どうぞ。 おかけ ください。', 'Mời vào. Mời ngồi.'),
      DX('Thí sinh', 'candidate', 'はじめまして。 ＿＿ です。 よろしく お{願|ねが}い します。', 'Rất vui được gặp. Em là ＿＿. Mong được giúp đỡ.'),
      DX('Giám thị', 'examiner', 'それでは、 はじめます。', 'Vậy chúng ta bắt đầu.'),
      DX('Giám thị', 'examiner', 'これで おわり です。', 'Kết thúc ở đây.'),
      DX('Thí sinh', 'candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn ạ. Em xin phép (ra ạ).'),
    ]),
    NOTE('Mẹo chào hỏi', [
      'Chào **ngay khi vào** và **trước khi ra** — cả hai lần đều tính vào 5 điểm Presenting.',
      'Không nói さん với chính mình: 「クオンです」, không phải ~~クオンさんです~~.',
    ]),

    { t: 'h', text: '2. Lesson 1 — giới thiệu bản thân (10 câu mẫu)' },
    TABLEJ1(
      ['#', 'Câu hỏi giám thị', 'Gợi ý trả lời'],
      [
        ['1', 'カリナ-さん は なんさい です か。', 'カリナ-さん は {二十歳|はたち} です。'],
        ['2', 'ワン-さん の おしごと は なん です か。', 'ワン-さん は {会社員|かいしゃいん} です。'],
        ['3', 'ワン-さん は {学生|がくせい} です か。', 'いいえ、 {学生|がくせい} じゃ ありません。 {会社員|かいしゃいん} です。'],
        ['4', 'ワン-さん は どこ の きょうし です か。', 'ワン-さん は さくら{日本語学校|にほんごがっこう} の きょうし です。'],
        ['5', 'ワン-さん の お{国|くに} は どちら です か。', '{中国|ちゅうごく} です。'],
        ['6', 'ワン-さん は {中国|ちゅうごく}{人|じん} です か。', 'はい、 {中国|ちゅうごく}{人|じん} です。'],
        ['7', 'ワン-さん の しゅみ は なん です か。', 'ワン-さん の {趣味|しゅみ} は {映画|えいが} です。'],
        ['8', 'ワン-さん の しゅみ は テニス です か。', 'いいえ、 テニス じゃ ありません。 {映画|えいが} です。'],
        ['9', 'ワン-さん の たんじょうび は いつ です か。', '{九月|くがつ} {十日|とおか} です。'],
        ['10', 'テスト は なんがつ なんにち です か。', '{十二月|じゅうにがつ} {十四日|じゅうよっか} です。'],
      ],
      'Mẫu trả lời Lesson 1 (tên, nước, ngày là ví dụ)',
    ),
    DLG('Hỏi–đáp mẫu Lesson 1 (cặp Có/Không và danh từ)', [
      DX('Giám thị', 'examiner', 'お{名前|なまえ} は？', 'Tên em là gì?'),
      DX('Thí sinh', 'candidate', '{私|わたし} は クオン です。', 'Em là Cường ạ.'),
      DX('Giám thị', 'examiner', 'お{国|くに} は どちら です か。', 'Em đến từ nước nào?'),
      DX('Thí sinh', 'candidate', 'ベトナム です。 ハノイ です。', 'Em đến từ Việt Nam. Từ Hà Nội ạ.'),
      DX('Giám thị', 'examiner', '{会社員|かいしゃいん} です か。', 'Em là nhân viên công ty à?'),
      DX('Thí sinh', 'candidate', 'いいえ、 {会社員|かいしゃいん} じゃ ありません。 {学生|がくせい} です。', 'Không ạ, em không phải nhân viên công ty. Em là sinh viên.'),
      DX('Giám thị', 'examiner', 'しゅみ は なん です か。', 'Sở thích của em là gì?'),
      DX('Thí sinh', 'candidate', '{私|わたし} の {趣味|しゅみ} は {音楽|おんがく} と サッカー です。', 'Sở thích của em là âm nhạc và bóng đá.'),
    ]),
    SPEAK('on113-nm-l1', [
      'おなまえは？',
      'おくにはどちらですか。',
      'おしごとはなんですか。',
      'なんさいですか。',
      'たんじょうびはいつですか。',
      'しゅみはなんですか。',
      'しゅみはテニスですか。',
      'がくせいですか。',
    ]),

    { t: 'h', text: '3. Lesson 2 — mua sắm và gọi món (7 câu mẫu)' },
    TABLE(
      ['#', 'Câu hỏi giám thị', 'Gợi ý trả lời'],
      [
        ['1', J('これ は なん の りょうり です か。'), JR('{魚|さかな} の りょうり です。')],
        ['2', J('この かばん は だれ の です か。'), JR('アンナ-さん の かばん です。')],
        ['3', J('これ は どこ の ビール です か。'), JR('ドイツ の ビール です。')],
        ['4', J('この {時計|とけい} は いくら です か。'), JR('{二万六千円|にまんろくせんえん} です。')],
        ['5', J('ここ は レストラン です。 ご{注文|ちゅうもん} ください。'), JR('カレー を ひとつ と、 コーヒー を ひとつ ください。')],
        ['6', J('レストラン は なんかい です か。'), JR('レストラン は {三階|さんがい} です。')],
        ['7', J('これ は ベトナム{語|ご} で なん です か。'), 'ベトナム{語|ご}で「＿＿」です。 (nói từ tiếng Việt vào chỗ ＿＿)'],
      ],
      'Mẫu trả lời Lesson 2 (đồ vật, giá là ví dụ)',
    ),
    NOTE('Chú ý khi trả lời Lesson 2', [
      'Giá tiền: đọc từng chữ số, **không nuốt**: 四千五百円 = よんせん ごひゃく えん. 600 = ろっぴゃく, 800 = はっぴゃく, 3.000 = さんぜん.',
      'Tầng: 1 いっかい · 3 **さんがい** · 6 ろっかい · 8 はっかい · B1 ちかいっかい.',
      'これ／それ／あれ đổi theo người cầm: giám thị cầm tranh nên hỏi 「これは何ですか」; bạn nhìn tranh trong tay giám thị → trả lời 「それは〜です」 (hoặc nhắc lại danh từ).',
      'Gọi món: 「〜をください」「〜を一つお願いします」; số đếm vật: ひとつ・ふたつ・みっつ.',
    ]),
    SPEAK('on113-nm-l2', [
      'これはなんのりょうりですか。',
      'このかばんはだれのですか。',
      'これはどこのビールですか。',
      'このとけいはいくらですか。',
      'ここはレストランです。ごちゅうもんください。',
      'レストランはなんかいですか。',
      'これはベトナムごでなんですか。',
    ]),

    { t: 'h', text: '4. Lesson 3 — lịch trình (10 câu mẫu)' },
    TABLEJ1(
      ['#', 'Câu hỏi giám thị', 'Gợi ý trả lời'],
      [
        ['1', '{図書館|としょかん} は {何時|なんじ} から {何時|なんじ} まで です か。', '{九時|くじ} から {七時|しちじ} まで です。'],
        ['2', '{銀行|ぎんこう} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。', '{月曜日|げつようび} から {金曜日|きんようび} まで です。'],
        ['3', '{夏休|なつやす}み は いつ から いつ まで です か。', '{七月|しちがつ} {二十日|はつか} から {八月|はちがつ} {三十一日|さんじゅういちにち} まで です。'],
        ['4', '{図書館|としょかん} で {何|なに} を します か。', '{本|ほん} を {読|よ}みます。 {勉強|べんきょう} も します。'],
        ['5', '{郵便局|ゆうびんきょく} の {休|やす}み は {何曜日|なんようび} です か。', '{土曜日|どようび} と {日曜日|にちようび} です。'],
        ['6', 'ワン-さん は {休|やす}みの{日|ひ}、 {何|なに} を します か。', '{海|うみ} へ {行|い}きます。 サッカー を します。'],
        ['7', 'ワン-さん は {毎朝|まいあさ}、 {何時|なんじ} に {食|た}べます か。', '{七時|しちじ} に {朝|あさ}ご{飯|はん} を {食|た}べます。'],
        ['8', 'ワン-さん は {何|なに} を {買|か}います か。', 'パン と {牛乳|ぎゅうにゅう} を {買|か}います。'],
        ['9', 'ワン-さん は {毎朝|まいあさ}、 パン を {食|た}べます か。', 'はい、 {食|た}べます。 ／ いいえ、 {食|た}べません。 {何|なに}も {食|た}べません。'],
        ['10', 'ワン-さん は どこ へ {行|い}きます か。', '{日曜日|にちようび}、 {公園|こうえん} へ {行|い}きます。'],
      ],
      'Mẫu trả lời Lesson 3 (thông tin là ví dụ)',
    ),
    NOTE('Trả lời "quên はい／いいえ" bị trừ tối đa 5 điểm', [
      'Câu 9 là câu Có/Không: bắt đầu bằng **はい／いいえ** rồi mới nói động từ. Nếu trả lời "không", thêm vế thứ hai: **いいえ、食べません。コーヒーを飲みます。**',
      'Câu 7: nói **giờ + に**: ~~七時で~~ sai; 七時**に**.',
      'Câu 3: **いつ**から**いつ**まで — đọc tháng–ngày đúng (7月 しちがつ, 20日 はつか).',
    ]),
    SPEAK('on113-nm-l3', [
      'としょかんは なんじから なんじまでですか。',
      'ぎんこうは なんようびから なんようびまでですか。',
      'なつやすみは いつから いつまでですか。',
      'としょかんで なにを しますか。',
      'ゆうびんきょくの やすみは なんようびですか。',
      'やすみの ひ、なにを しますか。',
      'まいあさ、なんじに たべますか。',
      'なにを かいますか。',
      'まいあさ、パンを たべますか。',
      'どこへ いきますか。',
    ]),

    { t: 'h', text: '5. Ba bộ tranh mô phỏng (mỗi bộ 3 câu có tranh + 1 câu cá nhân)' },
    TABLEJ(
      ['Bộ', 'Bạn nhìn thấy (mô tả tranh)', 'Câu hỏi'],
      [
        ['A', 'Thẻ nhân vật: パク · 二十五歳 · 先生 · かんこく', 'パク-さん は {先生|せんせい} です か。'],
        ['A', '(cùng thẻ)', 'パク-さん は なんさい です か。'],
        ['A', '(cùng thẻ)', 'パク-さん の お{国|くに} は どちら です か。'],
        ['B', 'Chiếc đồng hồ: 持ち主 ダニエル · 20.000円', 'これ は だれ の とけい です か。'],
        ['B', '(cùng tranh)', 'この とけい は いくら です か。'],
        ['B', 'Tờ sơ đồ tầng: 1F スーパー · 3F レストラン', 'レストラン は なんかい です か。'],
        ['C', 'Biển 「ひまわり体育館　7:30–21:30　休み 木曜日」', 'ここ は どこ です か。'],
        ['C', '(cùng biển)', '{何時|なんじ} から {何時|なんじ} まで です か。'],
        ['C', '(cùng biển)', '{休|やす}み は {何曜日|なんようび} です か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ A (thẻ nhân vật)', [
      DX('Giám thị', 'examiner', 'パク-さん は {先生|せんせい} です か。', 'Park có phải giáo viên không?'),
      DX('Thí sinh', 'candidate', 'はい、 パク-さん は {先生|せんせい} です。', 'Vâng, Park là giáo viên.'),
      DX('Giám thị', 'examiner', 'パク-さん は なんさい です か。', 'Park bao nhiêu tuổi?'),
      DX('Thí sinh', 'candidate', 'パク-さん は {二十五歳|にじゅうごさい} です。', 'Park 25 tuổi.'),
      DX('Giám thị', 'examiner', 'パク-さん の お{国|くに} は どちら です か。', 'Park đến từ nước nào?'),
      DX('Thí sinh', 'candidate', '{韓国|かんこく} です。', 'Từ Hàn Quốc.'),
    ]),
    DLG('Mẫu trả lời — Bộ B (đồ vật và tầng)', [
      DX('Giám thị', 'examiner', 'これ は だれ の とけい です か。', 'Đây là đồng hồ của ai?'),
      DX('Thí sinh', 'candidate', 'ダニエル-さん の とけい です。', 'Là đồng hồ của Daniel.'),
      DX('Giám thị', 'examiner', 'この とけい は いくら です か。', 'Đồng hồ này giá bao nhiêu?'),
      DX('Thí sinh', 'candidate', '{二万円|にまんえん} です。', '20.000 yên.'),
      DX('Giám thị', 'examiner', 'レストラン は なんかい です か。', 'Nhà hàng ở tầng mấy?'),
      DX('Thí sinh', 'candidate', 'レストラン は {三階|さんがい} です。', 'Nhà hàng ở tầng 3.'),
    ]),
    DLG('Mẫu trả lời — Bộ C (biển hiệu giờ)', [
      DX('Giám thị', 'examiner', 'ここ は どこ です か。', 'Đây là đâu?'),
      DX('Thí sinh', 'candidate', 'ここ は ひまわり {体育館|たいいくかん} です。', 'Đây là nhà thi đấu Himawari.'),
      DX('Giám thị', 'examiner', '{何時|なんじ} から {何時|なんじ} まで です か。', 'Từ mấy giờ đến mấy giờ?'),
      DX('Thí sinh', 'candidate', '{午前|ごぜん} {七時半|しちじはん} から {午後|ごご} {九時半|くじはん} まで です。', 'Từ 7 giờ rưỡi sáng đến 9 giờ rưỡi tối.'),
      DX('Giám thị', 'examiner', '{休|やす}み は {何曜日|なんようび} です か。', 'Nghỉ vào thứ mấy?'),
      DX('Thí sinh', 'candidate', '{休|やす}み は {木曜日|もくようび} です。', 'Ngày nghỉ là thứ Năm.'),
    ]),
    SPEAK('on113-nm-tranh', [
      'パクさんは せんせいですか。',
      'パクさんは なんさいですか。',
      'これは だれの とけいですか。',
      'このとけいは いくらですか。',
      'ここは どこですか。',
      'なんじから なんじまでですか。',
      'やすみは なんようびですか。',
    ]),

    { t: 'h', text: '6. Công thức Có/Không và câu cứu hộ' },
    TABLE(
      ['Tình huống', 'Công thức', 'Mẫu'],
      [
        ['Câu hỏi danh từ ～ですか — Có', 'はい、～です。', JR('はい、 {学生|がくせい} です。')],
        ['Câu hỏi danh từ — Không', 'いいえ、～じゃありません。＋ sự thật đúng', JR('いいえ、 {学生|がくせい} じゃ ありません。 {先生|せんせい} です。')],
        ['Câu hỏi động từ ～ますか — Có', 'はい、～ます。', JR('はい、 {食|た}べます。')],
        ['Câu hỏi động từ — Không', 'いいえ、～ません。＋ vế thứ hai', JR('いいえ、 {食|た}べません。 {何|なに}も {食|た}べません。')],
        ['Không nghe rõ', 'もう{一度|いちど} お{願|ねが}いします。', 'Xin nhắc lại ạ (tối đa 2 lần, không trừ điểm)'],
        ['Giám thị nói nhanh', 'ゆっくり お{願|ねが}いします。', 'Xin nói chậm lại ạ'],
        ['Cần nghĩ vài giây', 'ちょっと {待|ま}って ください。', 'Xin đợi em một chút ạ'],
        ['Thật sự bí', 'すみません、 わかりません。', 'Xin lỗi, em không hiểu ạ — tốt hơn im lặng'],
      ],
    ),

    { t: 'h', text: '7. Buổi thi diễn thử trọn vẹn (từ chào đến chào)' },
    DLG('Diễn thử — một buổi thi giả định', [
      DX('Thí sinh', 'candidate', 'しつれい します。', 'Em xin phép (vào).'),
      DX('Giám thị', 'examiner', 'どうぞ。 おかけ ください。', 'Mời vào, mời ngồi.'),
      DX('Thí sinh', 'candidate', 'はじめまして。 クオン です。 よろしく お{願|ねが}い します。', 'Rất vui được gặp. Em là Cường. Mong được giúp đỡ.'),
      DX('Giám thị', 'examiner', 'それでは、 はじめます。', 'Vậy chúng ta bắt đầu. (Em chuẩn bị 30 giây rồi đọc to đoạn Reading — chưa có trong kịch bản này.)'),
      DX('Giám thị', 'examiner', 'この {人|ひと} の お{国|くに} は どちら です か。', '(Tranh 1) Nước của người này là nước nào?'),
      DX('Thí sinh', 'candidate', '{韓国|かんこく} です。', 'Hàn Quốc ạ.'),
      DX('Giám thị', 'examiner', 'この とけい は いくら です か。', '(Tranh 2) Chiếc đồng hồ này giá bao nhiêu?'),
      DX('Thí sinh', 'candidate', '{二万円|にまんえん} です。', '20.000 yên ạ.'),
      DX('Giám thị', 'examiner', '{体育館|たいいくかん} は {何時|なんじ} から {何時|なんじ} まで です か。', '(Tranh 3) Nhà thi đấu mở từ mấy giờ đến mấy giờ?'),
      DX('Thí sinh', 'candidate', '{午前|ごぜん} {七時半|しちじはん} から {午後|ごご} {九時半|くじはん} まで です。', 'Từ 7 giờ rưỡi sáng đến 9 giờ rưỡi tối ạ.'),
      DX('Giám thị', 'examiner', '{毎朝|まいあさ}、 {何時|なんじ} に {起|お}きます か。', '(Không tranh) Sáng nào em cũng dậy lúc mấy giờ?'),
      DX('Thí sinh', 'candidate', '{毎朝|まいあさ}、 {六時半|ろくじはん} に {起|お}きます。', 'Sáng nào em cũng dậy lúc 6 giờ rưỡi ạ.'),
      DX('Giám thị', 'examiner', 'これ で おわり です。', 'Kết thúc ở đây.'),
      DX('Thí sinh', 'candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn ạ. Em xin phép (ra ạ).'),
    ]),
    NOTE('Cách dùng buổi diễn thử', [
      'Tìm một người bạn làm giám thị (hoặc tự thu âm câu hỏi). Chỉ dùng **câu hỏi**, tự trả lời bằng thông tin của bạn.',
      'Bấm giờ: cả buổi (đọc + 4 câu + chào) trong **5–7 phút**. Nghe lại để bắt lỗi: quên はい／いいえ, trợ từ sai, đọc sai giờ/số, im lặng quá 5 giây.',
    ]),
  ],
};


/* ───────── 5. ĐỀ LUYỆN TỔNG HỢP BÀI 1–3 ───────── */

const R_ON_DE: [string, string][] = [
  ['^マリア-さん は イタリア{人|じん} です。', 'Maria là người Ý.'],
  ['{大学|だいがく} の {学生|がくせい} です。', 'Cô là sinh viên đại học.'],
  ['{趣味|しゅみ} は {料理|りょうり} です。', 'Sở thích của cô là nấu ăn.'],
  ['{月曜日|げつようび} から {金曜日|きんようび} まで、 {大学|だいがく} へ {行|い}きます。', 'Từ thứ Hai đến thứ Sáu cô đi học.'],
  ['{毎朝|まいあさ}、 {八時|はちじ} に {学校|がっこう} へ {来|き}ます。', 'Sáng nào cô cũng đến trường lúc 8 giờ.'],
  ['{日曜日|にちようび} は どこ へ も {行|い}きません。 うち で テレビ を {見|み}ます。', 'Chủ nhật cô không đi đâu cả. Cô xem ti vi ở nhà.'],
];

const O_DE: Lesson = {
  id: 'on113-de-tong-hop',
  kind: 'review',
  title: 'Ôn thi JPD113 (Bài 1–3) — Đề luyện tổng hợp (45 phút, 100 điểm, 77 câu): từ vựng · chữ Hán · số–giờ–giá · trợ từ · từ hỏi · hội thoại · đọc hiểu · nghe · dịch · ghép câu',
  goal: 'Làm một đề đủ phần phủ toàn bộ Bài 1–3, bấm giờ, tự chấm bằng thang điểm và biết phần nào cần luyện lại trước khi thi nói JPD113.',
  minutes: 45,
  blocks: [
    HOW([
      '**Thời gian: 45 phút.** Bấm giờ thật. Không xem lại bài học, không mở đáp án cho đến khi làm xong cả đề.',
      'Làm theo thứ tự; câu nào bí quá 1 phút thì đánh dấu, làm tiếp, quay lại sau. Phần nghe: nghe tối đa 2 lần.',
      'Đề này là bài viết–nghe **để kiểm tra kiến thức nền** cho thi nói JPD113 (bản hướng dẫn 06/2025 chỉ có thi nói). Sau khi xong, luyện nói ở `on113-noi-mau`.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Số câu', 'Điểm/câu', 'Tối đa'],
      [
        ['A', 'Từ vựng Bài 1–3', '10', '1', '10'],
        ['B', 'Chữ Hán (đọc + chọn chữ)', '8', '1', '8'],
        ['C', 'Số, giờ, giá, tầng, tuổi', '10', '1', '10'],
        ['D', 'Điền trợ từ', '10', '1', '10'],
        ['E', 'Từ để hỏi', '8', '1', '8'],
        ['F', 'Chọn câu đáp phù hợp', '8', '1', '8'],
        ['G', 'Đọc hiểu', '6', '1', '6'],
        ['H', 'Nghe (2 đoạn)', '4', '2', '8'],
        ['I', 'Dịch Việt → Nhật (gõ tay)', '6', '3', '18'],
        ['J', 'Ghép câu', '7', '1', '7'],
        ['K', 'Đọc to (tự chấm)', '—', '—', '7'],
        ['', '**Tổng**', '77', '', '**100**'],
      ],
      'Cấu trúc đề luyện',
    ),

    H('Phần A — Từ vựng (10 câu × 1 điểm)'),
    MC('on113-de-a', 'A. Từ vựng', [
      Q('「{趣味|しゅみ}」の{意味|いみ}は？', 'Sở thích', 'Công việc | Sinh nhật | Quê quán', '趣味 = しゅみ.'),
      Q('「{誕生日|たんじょうび}」の{意味|いみ}は？', 'Sinh nhật', 'Ngày nghỉ | Tuổi | Ngày mai', '誕生日.'),
      Q('「{会社員|かいしゃいん}」の{意味|いみ}は？', 'Nhân viên công ty', 'Giáo viên | Sinh viên | Thư ký', '会社員.'),
      Q('「{財布|さいふ}」の{意味|いみ}は？', 'Ví tiền', 'Cặp sách | Đồng hồ | Giày', '財布.'),
      Q('「{地下|ちか}」の{意味|いみ}は？', 'Tầng hầm', 'Tầng thượng | Tầng 1 | Sân', '地下.'),
      Q('「{毎朝|まいあさ}」の{意味|いみ}は？', 'Mỗi sáng', 'Mỗi tối | Mỗi ngày | Mỗi tuần', '毎朝.'),
      Q('「{郵便局|ゆうびんきょく}」の{意味|いみ}は？', 'Bưu điện', 'Ngân hàng | Bệnh viện | Thư viện', '郵便局.'),
      Q('{違|ちが}う{種類|しゅるい}の{言葉|ことば}は？ カレー / スープ / ハンバーグ / エレベーター', 'エレベーター', 'カレー | スープ | ハンバーグ', '3 từ kia là món ăn.'),
      Q('{違|ちが}う{種類|しゅるい}の{言葉|ことば}は？ {映画|えいが} / {音楽|おんがく} / {水泳|すいえい} / ライス', 'ライス', '{映画|えいが} | {音楽|おんがく} | {水泳|すいえい}', '3 từ kia là sở thích.'),
      Q('{夏|なつ}、 {夜|よる}に＿＿＿を{見|み}ます。', '{花火|はなび}', '{桜|さくら} | スキー | サラダ', 'Pháo hoa.'),
    ]),

    H('Phần B — Chữ Hán (8 câu × 1 điểm)'),
    MC('on113-de-b', 'B. Chữ Hán', [
      Q('「韓国」の読み方は？', 'かんこく', 'かんくに | かんごく | はんこく', '韓国 = かんこく.'),
      Q('「中国」の読み方は？', 'ちゅうごく', 'ちゅうこく | なかくに | じゅうごく', '中国.'),
      Q('「大学」の読み方は？', 'だいがく', 'おおがく | たいがく | だいかく', '大学.'),
      Q('「先生」の読み方は？', 'せんせい', 'さきせい | せんしょう | せんなま', '先生.'),
      Q('「毎晩」の読み方は？', 'まいばん', 'まいよる | まいぱん | まいあさ', '毎晩.'),
      Q('「木曜日」の読み方は？', 'もくようび', 'きようび | ぼくようび | もうようび', '木曜日.'),
      Q('「しゅみ」を漢字で かくと？', '趣味', '起味 | 趨味 | 越味', '趣味.'),
      Q('「たんじょうび」を漢字で かくと？', '誕生日', '延生日 | 誕主日 | 誕生月', '誕生日.'),
    ]),

    H('Phần C — Số, giờ, giá, tầng, tuổi (10 câu × 1 điểm)'),
    MC('on113-de-c', 'C. Cách đọc', [
      Q('450円', 'よんひゃくごじゅうえん', 'よんびゃくごじゅうえん | よんひゃくごじゅういん | しひゃくごじゅうえん', '450 = よんひゃくごじゅう.'),
      Q('3.000円', 'さんぜんえん', 'さんせんえん | みっせんえん | さんぜんいん', 'さんぜん.'),
      Q('600円', 'ろっぴゃくえん', 'ろくひゃくえん | ろっひゃくえん | ろくびゃくえん', 'ろっぴゃく.'),
      Q('10.000円', 'いちまんえん', 'じゅうせんえん | ひゃくせんえん | いっまんえん', 'いちまん.'),
      Q('3階', 'さんがい', 'さんかい | みっかい | さんがく', 'さんがい.'),
      Q('6階', 'ろっかい', 'ろくかい | ろくがい | ろっがい', 'ろっかい.'),
      Q('20歳', 'はたち', 'にじゅっさい | にじゅうさい | ふたちさい', 'はたち.'),
      Q('7:00', 'しちじ', 'ななじ | しじ | しちとき', 'しちじ.'),
      Q('7月', 'しちがつ', 'ななつき | ななにち | しがつ', 'しちがつ.'),
      Q('20日', 'はつか', 'にじゅうにち | ふたじゅうか | にじゅっか', 'はつか.'),
    ]),

    H('Phần D — Điền trợ từ (10 câu × 1 điểm)'),
    MC('on113-de-d', 'D. Trợ từ', [
      Q('{私|わたし}＿＿ タンです。', 'は', 'を | の | へ', 'N は N です.'),
      Q('{私|わたし}＿＿ {趣味|しゅみ}は {音楽|おんがく}です。', 'の', 'は | を | と', 'N の N.'),
      Q('パン＿＿ {牛乳|ぎゅうにゅう}を ください。', 'と', 'の | は | も', 'N と N.'),
      Q('これは だれ＿＿ ですか。', 'の', 'を | が | へ', 'だれの.'),
      Q('{日曜日|にちようび}、 {公園|こうえん}＿＿ {行|い}きます。', 'へ', 'で | を | が', 'Đích へ.'),
      Q('{図書館|としょかん}＿＿ {勉強|べんきょう}します。', 'で', 'へ | を | が', 'Nơi で.'),
      Q('{七時|しちじ}＿＿ {起|お}きます。', 'に', 'で | を | へ', 'Giờ に.'),
      Q('{九時|くじ}＿＿ {五時|ごじ}＿＿ です。', 'から / まで', 'まで / から | に / で | を / が', 'Từ… đến…'),
      Q('{朝|あさ}、 {何|なに}＿＿ {食|た}べません。', 'も', 'を | が | に', '何も…ません.'),
      Q('{朝|あさ}、 パン＿＿ サラダなどを {食|た}べます。', 'や', 'と | が | に', 'や + など.'),
    ]),

    H('Phần E — Từ để hỏi (8 câu × 1 điểm)'),
    MC('on113-de-e', 'E. Chọn từ để hỏi', [
      Q('A：お{国|くに}は＿＿＿ですか。 B：ベトナムです。', 'どちら', 'いつ | いくら | だれ', 'Nước → どちら.'),
      Q('A：これは＿＿＿ですか。 B：{八百円|はっぴゃくえん}です。', 'いくら', 'だれ | どこ | {何|なん}', 'Giá → いくら.'),
      Q('A：これは＿＿＿のですか。 B：アンナさんのです。', 'だれ', 'いくら | どこ | {何|なに}', 'Chủ sở hữu → だれの.'),
      Q('A：＿＿＿に {起|お}きますか。 B：{七時|しちじ}に{起|お}きます。', '{何時|なんじ}', 'どこ | {何|なに} | いつ', '七時 → 何時.'),
      Q('A：{休|やす}みは＿＿＿ですか。 B：{水曜日|すいようび}です。', '{何曜日|なんようび}', '{何時|なんじ} | {何月|なんがつ} | {何日|なんにち}', '水曜日 → 何曜日.'),
      Q('A：{誕生日|たんじょうび}は＿＿＿ですか。 B：{八月|はちがつ}{四日|よっか}です。', 'いつ', 'どちら | いくら | どこ', 'Ngày → いつ.'),
      Q('A：レストランは＿＿＿ですか。 B：{三階|さんがい}です。', 'どこ', 'いくら | だれ | {何|なに}', 'Nơi → どこ.'),
      Q('A：これは＿＿＿のりょうりですか。 B：{魚|さかな}のりょうりです。', '{何|なん}', 'どこ | だれ | いくら', '何の N.'),
    ]),

    H('Phần F — Chọn câu đáp phù hợp (8 câu × 1 điểm)'),
    MC('on113-de-f', 'F. Hội thoại', [
      Q('「お{国|くに}は どちらですか。」', 'ベトナムです。', 'はい、そうです。 | {千円|せんえん}です。 | {七時|しちじ}です。', 'Hỏi nước → tên nước.'),
      Q('「{趣味|しゅみ}は テニスですか。」 (không phải)', 'いいえ、テニスじゃありません。サッカーです。', 'はい、テニスじゃありません。 | いいえ、テニスです。 | テニスは {日曜日|にちようび}です。', 'いいえ + じゃありません + sự thật.'),
      Q('「これは いくらですか。」', '{八百円|はっぴゃくえん}です。', 'ベトナムです。 | {八時|はちじ}です。 | アンナさんのです。', 'Hỏi giá → số tiền.'),
      Q('「この かばんは だれのですか。」', 'アンナさんのです。', '{千円|せんえん}です。 | ベトナムです。 | {三階|さんがい}です。', 'Hỏi chủ sở hữu.'),
      Q('「レストランは なんかいですか。」', '{三階|さんがい}です。', '{三時|さんじ}です。 | {三百円|さんびゃくえん}です。 | {三日|みっか}です。', 'Hỏi tầng.'),
      Q('「{図書館|としょかん}は {何時|なんじ}から {何時|なんじ}までですか。」', '{九時|くじ}から{七時|しちじ}までです。', '{月曜日|げつようび}から{金曜日|きんようび}までです。 | {九百円|きゅうひゃくえん}です。 | はい、そうです。', 'Hỏi giờ.'),
      Q('「{毎朝|まいあさ}、 パンを{食|た}べますか。」 (không ăn)', 'いいえ、{食|た}べません。', 'いいえ、{食|た}べます。 | はい、{食|た}べません。 | いいえ、そうです。', 'いいえ + 食べません.'),
      Q('「{日曜日|にちようび}、 どこへ{行|い}きますか。」 (không đi đâu)', 'どこへも{行|い}きません。', '{何|なに}も{行|い}きません。 | どこを{行|い}きません。 | どこへ{行|い}きます。', 'どこへも + ません.'),
    ]),

    H('Phần G — Đọc hiểu (6 câu × 1 điểm)'),
    ...PSG('マリアさん', R_ON_DE),
    MC('on113-de-g', 'G. Câu hỏi đọc hiểu', [
      Q('マリアさんは どこの {人|ひと}ですか。', 'イタリア{人|じん}', 'ベトナム{人|じん} | {中国|ちゅうごく}{人|じん} | {日本|にほん}{人|じん}', 'イタリア人.'),
      Q('マリアさんの {趣味|しゅみ}は？', '{料理|りょうり}', 'サッカー | {音楽|おんがく} | {映画|えいが}', '料理.'),
      Q('マリアさんは {何|なん}ですか。', '{大学|だいがく}の{学生|がくせい}', '{会社員|かいしゃいん} | {先生|せんせい} | {銀行|ぎんこう}の{人|ひと}', '大学の学生.'),
      Q('マリアさんは {毎朝|まいあさ} {何時|なんじ}に {学校|がっこう}へ {来|き}ますか。', '{八時|はちじ}', '{七時|しちじ} | {九時|くじ} | {六時|ろくじ}', '八時.'),
      TF('マリアさんは {日曜日|にちようび}、 {公園|こうえん}へ{行|い}きます。', 'Sai', 'どこへも行きません.'),
      TF('マリアさんは うちで テレビを{見|み}ます。', 'Đúng', 'Câu cuối.'),
    ]),

    H('Phần H — Nghe (2 đoạn, 4 câu × 2 điểm)'),
    LS('on113-de-ng-1', 'Đoạn 1 — Ở cửa hàng', [
      L('アンナ', 'f', 'すみません。 この とけい は いくら です か。', 'Xin lỗi. Chiếc đồng hồ này giá bao nhiêu ạ?'),
      L('{店員|てんいん}', 'm', '{二万円|にまんえん} です。', '20.000 yên.'),
      L('アンナ', 'f', 'じゃ、 その とけい は？', 'Vậy chiếc đồng hồ kia thì sao?'),
      L('{店員|てんいん}', 'm', 'これ は {一万五千円|いちまんごせんえん} です。', 'Cái này 15.000 yên.'),
      L('アンナ', 'f', 'じゃ、 これ を ください。', 'Vậy cho tôi cái này.'),
    ]),
    LS('on113-de-ng-2', 'Đoạn 2 — Hỏi giờ bơi', [
      L('ダニエル', 'm', 'すみません。 プール は {何時|なんじ} から {何時|なんじ} まで です か。', 'Xin lỗi. Bể bơi mở từ mấy giờ đến mấy giờ ạ?'),
      L('{受付|うけつけ}', 'f', '{午前|ごぜん} {十時|じゅうじ} から {午後|ごご} {八時|はちじ} まで です。', 'Từ 10 giờ sáng đến 8 giờ tối.'),
      L('ダニエル', 'm', '{休|やす}み は {何曜日|なんようび} です か。', 'Nghỉ vào thứ mấy ạ?'),
      L('{受付|うけつけ}', 'f', '{月曜日|げつようび} です。', 'Thứ Hai.'),
    ]),
    MC('on113-de-h', 'H. Câu hỏi nghe', [
      Q('Đoạn 1 — Chiếc đồng hồ đầu tiên giá bao nhiêu?', '{二万円|にまんえん}', '{一万五千円|いちまんごせんえん} | {二千円|にせんえん} | {五万円|ごまんえん}', '20.000 yên.'),
      Q('Đoạn 1 — Anna mua chiếc nào?', 'Chiếc 15.000 yên', 'Chiếc 20.000 yên | Cả hai | Không mua', 'これをください = cái 15.000 yên.'),
      Q('Đoạn 2 — プールは {何時|なんじ}から {何時|なんじ}までですか。', '{午前|ごぜん}{十時|じゅうじ}から{午後|ごご}{八時|はちじ}', '{午前|ごぜん}{八時|はちじ}から{午後|ごご}{十時|じゅうじ} | {午前|ごぜん}{十時|じゅうじ}から{午後|ごご}{六時|ろくじ} | {午後|ごご}{十時|じゅうじ}から{午前|ごぜん}{八時|はちじ}', '10–20 giờ.'),
      Q('Đoạn 2 — プールの {休|やす}みは？', '{月曜日|げつようび}', '{火曜日|かようび} | {日曜日|にちようび} | {金曜日|きんようび}', '月曜日.'),
    ]),

    H('Phần I — Dịch Việt → Nhật (6 câu × 3 điểm, gõ tay)'),
    QZ('on113-de-i', 'I. Dịch sang tiếng Nhật', 'translate', [
      A('Tôi là Linh. Tôi là người Việt Nam. Tôi là sinh viên.', ['{私|わたし}はリンです。ベトナム{人|じん}です。{学生|がくせい}です。', 'リンです。ベトナム{人|じん}です。{学生|がくせい}です。'], 'N は N です'),
      A('Cái này giá bao nhiêu? — 800 yên.', ['これはいくらですか。{八百円|はっぴゃくえん}です。', 'これはいくらですか。800{円|えん}です。'], 'いくら'),
      A('Nhà hàng ở tầng 3. Cho tôi cà ri và cà phê.', ['レストランは{三階|さんがい}です。カレーとコーヒーをください。', 'レストランは3{階|がい}です。カレーとコーヒーをください。'], '階・ください'),
      AD('Thư viện mở từ 9 giờ đến 7 giờ. Ngày nghỉ là thứ Hai.', ['{図書館|としょかん}は{9時|くじ}から{7時|しちじ}までです。{休|やす}みは{月曜日|げつようび}です。'], 'から・まで'),
      AD('Sáng nào tôi cũng dậy lúc 7 giờ. Tôi ăn bánh mì, hoa quả, v.v.', ['{毎朝|まいあさ}、{7時|しちじ}に{起|お}きます。パンや{果物|くだもの}などを{食|た}べます。'], '毎朝・に・や'),
      A('Ngày nghỉ tôi không đi đâu cả. Tôi xem ti vi ở nhà.', ['{休|やす}みの{日|ひ}、どこへも{行|い}きません。うちでテレビを{見|み}ます。', '{休|やす}みの{日|ひ}はどこへも{行|い}きません。うちでテレビを{見|み}ます。'], 'どこへも・で・を'),
    ], 'ポイント 1–23'),

    H('Phần J — Ghép câu (7 câu × 1 điểm)'),
    BUILD('on113-de-j', 'J. Ghép các mảnh thành câu đúng', [
      BD('Nước của bạn là nước nào?', 'お{国|くに} は どちら です か。', ['を']),
      BD('Sở thích của tôi là âm nhạc.', '{私|わたし} の {趣味|しゅみ} は {音楽|おんがく} です。', ['が']),
      BD('Cho tôi hai cái bánh mì.', 'パン を {二|ふた}つ ください。', ['に']),
      BD('Nhà hàng ở tầng 3.', 'レストラン は {三階|さんがい} です。', ['を']),
      BD('Thư viện mở từ 9 giờ đến 7 giờ.', '{図書館|としょかん} は {九時|くじ} から {七時|しちじ} まで です。', ['に']),
      BD('Sáng nào tôi cũng đọc báo ở nhà.', '{毎朝|まいあさ}、 うち で {新聞|しんぶん} を {読|よ}みます。', ['に']),
      BD('Chủ nhật tôi không đi đâu cả.', '{日曜日|にちようび}、 どこ へ も {行|い}きません。', ['を']),
    ]),

    H('Phần K — Đọc to (7 điểm, tự chấm)'),
    READK('on113-de-k', 'K. Đọc to đoạn bên dưới (chuẩn bị 30 giây) rồi bấm hiện cách đọc để tự chấm', 'Tự chấm: sai mỗi ký tự trừ 0,2; ngập ngừng giữa câu trừ thêm. Tối đa 7 điểm: 7 = không sai ký tự nào và đọc đều.', [
      RK('{私|わたし} は ダニエル です。 オーストラリア{人|じん} です。 {月曜日|げつようび} から {金曜日|きんようび} まで、 {大学|だいがく} へ {行|い}きます。 {毎朝|まいあさ} {七時|しちじ} に {起|お}きます。 コーヒー を {飲|の}みます。 {土曜日|どようび} は サッカー を します。', 'Tôi là Daniel. Tôi là người Úc. Từ thứ Hai đến thứ Sáu tôi đi học. Sáng nào tôi cũng dậy lúc 7 giờ. Tôi uống cà phê. Thứ Bảy tôi chơi bóng đá.'),
    ]),

    H('Bảng chấm điểm tự đánh giá'),
    TABLE(
      ['Phần', 'Số câu đúng', '× điểm/câu', 'Điểm của bạn'],
      [
        ['A. Từ vựng', '___ / 10', '× 1', '___'],
        ['B. Chữ Hán', '___ / 8', '× 1', '___'],
        ['C. Số–giờ–giá', '___ / 10', '× 1', '___'],
        ['D. Trợ từ', '___ / 10', '× 1', '___'],
        ['E. Từ để hỏi', '___ / 8', '× 1', '___'],
        ['F. Chọn câu đáp', '___ / 8', '× 1', '___'],
        ['G. Đọc hiểu', '___ / 6', '× 1', '___'],
        ['H. Nghe', '___ / 4', '× 2', '___'],
        ['I. Dịch V→N', '___ / 6', '× 3', '___'],
        ['J. Ghép câu', '___ / 7', '× 1', '___'],
        ['K. Đọc to', '(tự chấm)', '/ 7', '___'],
        ['', '', '**Tổng**', '___ / 100'],
      ],
    ),
    TABLE(
      ['Tổng điểm', 'Đánh giá', 'Việc cần làm'],
      [
        ['90–100', 'Xuất sắc', 'Chuyển hẳn sang luyện nói: diễn thử cả buổi thi 3 lần.'],
        ['80–89', 'Tốt', 'Ôn phần dưới 80% của chính bạn, rồi luyện nói.'],
        ['70–79', 'Đạt', 'Làm lại `on113-ngu-phap-tu-vung` mục A–D và `lt-b3-ngu-phap-tron`.'],
        ['60–69', 'Cần ôn', 'Làm lại lesson Dễ–Vừa của Bài 1–3, rồi làm lại đề sau 2 ngày.'],
        ['Dưới 60', 'Chưa đạt', 'Bắt đầu lại từ lộ trình ngày 1, làm chậm, đừng bỏ qua mức Dễ.'],
      ],
    ),
    NOTE('Cách luyện lại theo phần yếu', [
      'Từ vựng (A) hay sai → `on113-ngu-phap-tu-vung` mục C và `lt-b3-tu-vung`.',
      'Số–giờ–giá (C) hay sai → bảng "Số, giờ, giá, tầng, tuổi" ở `on113-ngu-phap-tu-vung` mục 3.',
      'Trợ từ (D) hay sai → `lt-b3-ngu-phap-tron`; nhớ sai trợ từ mất 2 điểm mỗi lần khi thi nói.',
      'Nghe (H) hay sai → `lt-b3-nghe`; ghi con số ra giấy khi nghe.',
      'Dịch (I) và Đọc to (K) hay sai → `on113-noi-mau`, `on113-doc-to` và `lt-b3-noi-viet`.',
    ]),
  ],
};


/* ───────── 6. LỖI HAY MẤT ĐIỂM ───────── */

const O_LOI: Lesson = {
  id: 'on113-loi-mat-diem',
  kind: 'review',
  title: 'Ôn thi JPD113 (Bài 1–3) — Phòng khám lỗi: những lỗi hay mất điểm trong thi nói và cách sửa',
  goal: 'Nhận ra và sửa 20 lỗi hay gặp nhất của Bài 1–3 (đọc số, trợ từ, はい／いいえ, phủ định, từ hỏi) — cùng bảng điểm bị trừ cho từng loại lỗi.',
  minutes: 35,
  blocks: [
    HOW([
      'Lesson này **tổng hợp lỗi** đã xuất hiện ở mọi buổi và mọi bộ luyện. Đọc bảng trước, rồi làm mục "Tìm lỗi" để thử mắt.',
      'Sau khi làm đề `on113-de-tong-hop` và diễn thử `on113-noi-mau`, nghe lại bản thu âm và **đánh dấu lỗi vào bảng** dưới đây — lỗi nào lặp lại hai lần thì học riêng.',
      'Quy đổi điểm theo hướng dẫn 06/2025: sai trợ từ −2; quên はい／いいえ tối đa −5; sai từ vựng (ngữ pháp đúng) chỉ còn tối đa 3 điểm; sai làm hiểu sai cả câu = mất điểm câu đó; Reading sai ký tự −0,2.',
    ]),
    { t: 'h', text: '1. Hai mươi lỗi hay gặp' },
    TABLE(
      ['#', 'Lỗi', 'Sửa', 'Thiệt hại'],
      [
        ['1', 'Đọc 4 giờ là ~~よんじ~~', '**よじ**', 'Sai từ → mất điểm câu/từ'],
        ['2', 'Đọc 9 giờ là ~~きゅうじ~~', '**くじ**', 'như trên'],
        ['3', 'Đọc 10 phút là ~~じゅうふん~~', '**じゅっぷん**', 'như trên'],
        ['4', 'Đọc ngày 20 là ~~にじゅうにち~~', '**はつか**', 'như trên'],
        ['5', 'Đọc tuổi 20 là ~~にじゅっさい~~', '**はたち**', 'như trên'],
        ['6', 'Đọc 3 tầng là ~~さんかい~~', '**さんがい**', 'như trên'],
        ['7', 'Đọc 600 yên là ~~ろくひゃく~~', '**ろっぴゃく**', 'như trên'],
        ['8', 'Đọc は là ha, へ là he', '**wa**, **e**', 'Reading −0,2/ký tự'],
        ['9', 'Câu hỏi Có/Không mà quên はい／いいえ', 'Bắt đầu bằng **はい／いいえ**', '−5'],
        ['10', 'Trả lời câu hỏi động từ bằng ~~はい、そうです~~', '**はい、〜ます**', '−5'],
        ['11', 'Phủ định danh từ dùng ~~〜ません~~', '**〜じゃありません**', 'sai ngữ pháp'],
        ['12', 'Phủ định động từ dùng ~~〜じゃありません~~', '**〜ません**', 'sai ngữ pháp'],
        ['13', '図書館**を**行きます / 図書館**で**行きます', '図書館**へ**行きます', '−2 (trợ từ)'],
        ['14', '図書館**に**勉強します', '図書館**で**勉強します', '−2'],
        ['15', '毎朝**に**起きます / 七時**で**起きます', '毎朝、七時**に**起きます', '−2'],
        ['16', '~~何もを~~食べません / ~~何も~~食べます', '**何も**食べません', '−2 hoặc mất câu'],
        ['17', '~~パンとサラダとを~~; ~~パンやサラダとを~~', 'パン**や**サラダ**など**を', '−2'],
        ['18', 'Hỏi giá trả lời ~~三階です~~ / hỏi tầng trả lời ~~八百円です~~', 'いくら→円; なんかい→階', 'mất điểm câu'],
        ['19', 'Nói さん với chính mình: ~~クオンさんです~~', '**クオンです**', 'Mất điểm tác phong'],
        ['20', 'Trả lời cụt một từ / im lặng quá 5 giây', 'Câu đầy đủ; xin nhắc lại **もう一度お願いします**', 'Mất điểm lưu loát (2đ/câu)'],
      ],
    ),

    H('2. Tìm lỗi — câu nào đúng? (16 câu)'),
    MC('on113-loi-mc', 'Chọn câu đúng', [
      Q('Câu nào đúng?', '{図書館|としょかん}へ {行|い}きます。', '{図書館|としょかん}を {行|い}きます。 | {図書館|としょかん}で {行|い}きます。 | {図書館|としょかん}が {行|い}きます。', 'Đích đến → へ.'),
      Q('Câu nào đúng?', '{図書館|としょかん}で {勉強|べんきょう}します。', '{図書館|としょかん}に {勉強|べんきょう}します。 | {図書館|としょかん}を {勉強|べんきょう}します。 | {図書館|としょかん}へ {勉強|べんきょう}します。', 'Nơi làm → で.'),
      Q('Câu nào đúng?', '{毎朝|まいあさ}、 {七時|しちじ}に {起|お}きます。', '{毎朝|まいあさ}に、 {七時|しちじ}に {起|お}きます。 | {毎朝|まいあさ}、 {七時|しちじ}で {起|お}きます。 | {毎朝|まいあさ}を、 {七時|しちじ}に {起|お}きます。', '毎朝 không に.'),
      Q('Câu nào đúng?', '{朝|あさ}、 {何|なに}も {食|た}べません。', '{朝|あさ}、 {何|なに}もを {食|た}べません。 | {朝|あさ}、 {何|なに}も {食|た}べます。 | {朝|あさ}、 {何|なに}へも {食|た}べません。', '何も + ません.'),
      Q('「{学生|がくせい}ですか。」 — "Không, tôi là giáo viên." Câu nào đúng?', 'いいえ、{学生|がくせい}じゃありません。{先生|せんせい}です。', 'いいえ、{学生|がくせい}ません。{先生|せんせい}です。 | はい、そうです。{先生|せんせい}です。 | いいえ、{学生|がくせい}です。', 'Danh từ phủ định → じゃありません.'),
      Q('「{食|た}べますか。」 — "Không ăn." Câu nào đúng?', 'いいえ、{食|た}べません。', 'いいえ、{食|た}べじゃありません。 | はい、そうじゃありません。 | いいえ、{食|た}べますか。', 'Động từ phủ định → ません.'),
      Q('Giờ 4:00 đọc…', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = よじ.'),
      Q('Giờ 9:00 đọc…', 'くじ', 'きゅうじ | くうじ | ここのじ', '9 giờ = くじ.'),
      Q('Ngày 20 đọc…', 'はつか', 'にじゅうにち | にじゅっか | ふたじゅうか', '20 日 = はつか.'),
      Q('3 tầng đọc…', 'さんがい', 'さんかい | みっかい | さんがく', 'さんがい.'),
      Q('800 yên đọc…', 'はっぴゃくえん', 'はちひゃくえん | はっひゃくえん | はちびゃくえん', 'はっぴゃく.'),
      Q('Câu nào có lỗi trợ từ?', '{日曜日|にちようび}、 {公園|こうえん}で {行|い}きます。', '{日曜日|にちようび}、 {公園|こうえん}へ {行|い}きます。 | {日曜日|にちようび}、 {公園|こうえん}で {勉強|べんきょう}します。 | {日曜日|にちようび}に {公園|こうえん}へ {行|い}きます。', 'Đi đâu → へ (không で).'),
      Q('Câu nào có lỗi trợ từ?', '{毎晩|まいばん}に、 テレビを {見|み}ます。', '{毎晩|まいばん}、 テレビを {見|み}ます。 | {夜|よる}、 テレビを {見|み}ます。 | {七時|しちじ}に テレビを {見|み}ます。', '毎晩に là sai.'),
      Q('Giám thị hỏi 「お{国|くに}は どちらですか」. Bạn nên nói…', 'ベトナムです。', 'ベトナムさんです。 | ベトナムですか。 | はい、そうです。', 'Trả lời tên nước + です; không さん, không はい.'),
      Q('Không nghe rõ câu hỏi, bạn nên…', 'Nói 「もう{一度|いちど}お{願|ねが}いします」', 'Đoán bừa | Im lặng | Nói tiếng Việt dài', 'Xin nhắc lại tối đa 2 lần, không bị trừ điểm.'),
      Q('Cách chào đúng khi vào phòng thi là…', 'しつれいします。はじめまして。…です。よろしくお{願|ねが}いします。', 'Không nói gì rồi ngồi | こんにちは、さようなら | おやすみなさい', 'Presenting 5 điểm.'),
    ]),

    H('3. Sửa câu — gõ lại cho đúng (8 câu)'),
    QZ('on113-loi-go', 'Viết lại câu cho đúng', 'translate', [
      A('~~毎朝に七時に起きます。~~ → ?', ['{毎朝|まいあさ}、{七時|しちじ}に{起|お}きます。', '{毎朝|まいあさ}{七時|しちじ}に{起|お}きます。'], 'bỏ に sau 毎朝'),
      A('~~図書館に勉強します。~~ → ?', ['{図書館|としょかん}で{勉強|べんきょう}します。'], 'で'),
      A('~~学校で行きます。~~ → ?', ['{学校|がっこう}へ{行|い}きます。', '{学校|がっこう}に{行|い}きます。'], 'へ'),
      A('~~何もを食べません。~~ → ?', ['{何|なに}も{食|た}べません。'], 'bỏ を'),
      A('~~私は学生ません。~~ → ?', ['{私|わたし}は{学生|がくせい}じゃありません。', '{私|わたし}は{学生|がくせい}ではありません。'], 'danh từ + じゃありません'),
      A('~~パンとサラダとを食べます。~~ (liệt kê ví dụ) → ?', ['パンやサラダなどを{食|た}べます。', 'パンとサラダを{食|た}べます。'], 'や…など を'),
      A('~~日曜日、どこでも行きません。~~ → ?', ['{日曜日|にちようび}、どこへも{行|い}きません。', '{日曜日|にちようび}はどこへも{行|い}きません。'], 'どこへも'),
      A('~~クオンさんです。~~ (tự giới thiệu) → ?', ['クオンです。', '{私|わたし}はクオンです。'], 'không さん'),
    ], 'Sửa lỗi'),
    NOTE('Cách dùng bảng lỗi sau mỗi lần luyện', [
      'Sau mỗi buổi thu âm, ghi **số lỗi (1–20)** bạn mắc vào giấy. Sau 3 buổi, những số lặp lại ≥ 2 lần là **lỗi thật sự của bạn** — đọc riêng, nói riêng 10 lần.',
      'Ba lỗi đáng sợ nhất theo bản chấm điểm: **#9 quên はい／いいえ (−5)**, **#13–17 sai trợ từ (−2 mỗi lần)**, **#1–7 đọc sai số/giờ** (mất cả câu).',
    ]),
  ],
};

/* ═══════════════════ XUẤT ═══════════════════ */
export const JP113_B3: Lesson[] = [S_00,S_01,S_02,S_03,S_04,S_05,S_06,S_07];
export const LT_B3: Lesson[] = [L_LO_TRINH,L_TU_VUNG,L_CHU_HAN,L_NP_GIO,L_NP1,L_NP2,L_NP3,L_NP_TRON,L_HOI_THOAI,L_DOC_HIEU,L_NGHE,L_NOI_VIET,L_DE];
export const ON_113: Lesson[] = [O_CAU_TRUC,O_NGP_TV,O_DOC_TO,O_NOI_MAU,O_DE,O_LOI];
