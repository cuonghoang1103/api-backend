/**
 * BỘ LUYỆN THÊM Bài 4 + Bài 5 — khoá できる日本語 (`/language/ja/dekiru`), môn JPD123.
 *
 * Mỗi bài có một dãy lesson `lt-b4-…` / `lt-b5-…`; mỗi lesson đi từ 🟢 DỄ → 🟡 VỪA → 🔴 KHÓ:
 *   lộ trình · từ vựng · chữ Hán của lớp · ngữ pháp từng nhóm ポイント + trộn · hội thoại ·
 *   đọc hiểu · nghe · nói & viết · đề tổng hợp (có giờ + thang điểm tự chấm).
 *
 * Mọi câu, hội thoại, đoạn đọc, kịch bản nghe đều VIẾT MỚI (không chép sách/CD/đề của cô).
 * Khuôn dạng bám bài kiểm tra giữa kỳ B4–5 và đề cuối kỳ JPD123 (xem ../SOAN-BAI.md).
 *
 * Cách soạn: câu tiếng Nhật viết bằng "DSL từ" — các từ cách nhau bằng dấu cách, chữ Hán luôn
 * {漢字|かな}, `^` đầu từ = viết hoa romaji (tên riêng), `-` trong từ = gạch nối romaji (bỏ khỏi chữ Nhật).
 * Hàm `J()` bỏ dấu cách → chữ Nhật; `R()` sinh romaji (は→wa, へ→e, を→o, ー→kéo dài, っ→gấp đôi) — nên
 * romaji LUÔN khớp đúng chữ kana ở cạnh nó.
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

/* ═══════════════════════════════════════════════════════════════════
 *                         BÀI 4 — LUYỆN THÊM
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────── 0. LỘ TRÌNH ───────── */

const B4_LO_TRINH: Lesson = {
  id: 'lt-b4-lo-trinh',
  kind: 'review',
  title: 'Luyện thêm Bài 4 — đọc trước: lộ trình 7 ngày, cách dùng, kiểm tra đầu vào',
  goal: 'Biết bộ luyện Bài 4 gồm những gì, học theo thứ tự nào, và biết mình đang yếu ở kỹ năng nào để luyện đúng chỗ.',
  minutes: 15,
  blocks: [
    RECAP('Đọc 1 phút trước khi luyện', [
      'Bộ này dành cho bạn **học lại từ đầu**: mỗi bài đi từ 🟢 **Dễ** (nhận mặt) → 🟡 **Vừa** (dùng trong câu) → 🔴 **Khó** (trộn nhiều điểm như đề thi).',
      'Làm **đủ cả ba mức** theo thứ tự. Nhảy thẳng lên mức Khó khi chưa vững mức Dễ là cách chắc chắn nhất để nản.',
      'Câu nào sai: đọc phần giải thích (why) **rồi làm lại câu đó**. Sai ba lần cùng một chỗ thì quay lại bài học gốc `b4-ngu-phap`.',
      'Mọi câu tiếng Nhật đều có romaji và nghĩa. Bật furigana khi mới học; **tắt furigana khi làm mức Khó** để quen với đề thật.',
    ]),
    H('Bài 4 gồm những kỹ năng nào?'),
    TABLE(
      ['Thứ tự', 'Lesson', 'Luyện gì', 'Ra trong đề thi nào'],
      [
        ['1', '`lt-b4-tu-vung`', '72 từ của cô: nhận mặt → điền câu → gõ từ', 'Giữa kỳ (từ vựng), cuối kỳ (chọn đáp án)'],
        ['2', '`lt-b4-chu-han`', '9 chữ Hán lớp: 京 名 前 国 男 東 女 区 市', 'Giữa kỳ + cuối kỳ (chọn cách đọc / chọn chữ)'],
        ['3–5', '`lt-b4-ngu-phap-1/2/3`', 'ポイント 24–36, từng nhóm một', 'Trợ từ · chọn đáp án · chia từ'],
        ['6', '`lt-b4-ngu-phap-tron`', 'Trộn tất cả ポイント: sửa câu sai, dịch hai chiều', 'Phần dịch + chia từ cuối kỳ'],
        ['7', '`lt-b4-hoi-thoai`', '6 hội thoại mới: hiểu, điền, sắp lượt, tự nói', 'Thi nói (Q&A)'],
        ['8', '`lt-b4-doc-hieu`', '6 đoạn đọc ngắn → dài', 'Đọc hiểu cuối kỳ + Reading thi nói'],
        ['9', '`lt-b4-nghe`', '10 đoạn nghe: chậm → bẫy (đổi ý, số, giờ)', 'Nghe giữa kỳ + cuối kỳ'],
        ['10', '`lt-b4-noi-viet`', 'Câu hỏi thi nói kiểu cô + bài viết 3–5 câu', 'Thi nói + phần viết'],
        ['11', '`lt-b4-de-tong-hop`', 'Đề đủ phần, có giờ + thang điểm tự chấm', 'Giả lập bài kiểm tra'],
      ],
    ),
    H('Lịch gợi ý 7 ngày (mỗi ngày 45–60 phút)'),
    TABLE(
      ['Ngày', 'Làm'],
      [
        ['1', 'Từ vựng (cả ba mức) + chữ Hán mức Dễ'],
        ['2', 'Chữ Hán mức Vừa–Khó + ngữ pháp 1 (ポイント 24–27)'],
        ['3', 'Ngữ pháp 2 (ポイント 28–31) + nghe 1–4'],
        ['4', 'Ngữ pháp 3 (ポイント 32–36) + hội thoại 1–3'],
        ['5', 'Ngữ pháp trộn + đọc hiểu 1–4 + nghe 5–10'],
        ['6', 'Hội thoại 4–6 + nói & viết (thu âm, đọc to)'],
        ['7', 'Đề tổng hợp trong 45 phút, không nhìn đáp án; chấm điểm; luyện lại phần dưới 70%'],
      ],
    ),
    NOTE('Mẹo học: thứ tự ưu tiên khi sắp thi', [
      'Điểm dễ nhất: **trợ từ** (は・が・を・に・で・へ・と・の・も・から・まで) và **từ để hỏi**. Mỗi câu đúng là một điểm chắc chắn.',
      'Điểm hay mất nhất: chia **tính từ** (い bỏ い thêm くない; な dùng じゃありません; いい → よくない) và **phân biệt 暑い/熱い, 暖かい/温かい**.',
      'Thi nói: học thuộc **khung** câu trả lời rồi thay từ. Đừng cố nói câu dài, nói câu **đúng** và liền mạch.',
    ]),
    MC('lt-b4-lt-vao', 'Kiểm tra đầu vào (12 câu, 8 phút) — sai nhóm nào thì ưu tiên luyện nhóm đó', [
      Q('Từ vựng — 「{北|きた}」 nghĩa là gì?', 'Phía bắc', 'Phía nam | Phía đông | Phía tây', '**北 = きた** = bắc.'),
      Q('Từ vựng — Từ nào chỉ **nhà thờ**?', '{教会|きょうかい}', '{神社|じんじゃ} | お{寺|てら} | お{城|しろ}', '教会 = nhà thờ; 神社 = đền Thần đạo; お寺 = chùa; お城 = lâu đài.'),
      Q('Chữ Hán — 「{東京|とうきょう}」 đọc là gì?', 'とうきょう', 'ひがしきょう | とうけい | ひがしけい', '東 đọc とう khi nằm trong từ ghép: とう・きょう.'),
      Q('Chữ Hán — Chữ nào đọc là 「くに」?', '国', '回 | 困 | 図', '国 (quốc) = nước, くに.'),
      Q('Trợ từ — ハノイ＿＿ ベトナム＿＿ {北|きた}です。', 'は / の', 'が / を | に / で | と / も', 'ハノイ**は** ベトナム**の** 北です.'),
      Q('Tính từ — 「この{町|まち}は {大|おお}きいです」 phủ định là…', 'あまり {大|おお}きくないです', 'あまり {大|おお}きいじゃありません | あまり {大|おお}きくです | あまり {大|おお}いくないです', 'Tính từ い: bỏ い cuối, thêm **くない**.'),
      Q('Tính từ — 「きれい」 là tính từ gì và đứng trước danh từ thế nào?', 'Tính từ な: きれいな {町|まち}', 'Tính từ い: きれいい {町|まち} | Tính từ な: きれいの {町|まち} | Tính từ い: きれい {町|まち}ね', 'きれい đuôi い nhưng là **tính từ な** → thêm な trước danh từ.'),
      Q('あります — {箱根|はこね}＿＿ {温泉|おんせん}＿＿ あります。', 'に / が', 'で / を | は / に | を / が', 'Nơi tồn tại + **に**; vật tồn tại + **が**.'),
      Q('Thời gian — 「Từ nhà đến ga đi bộ 10 phút」 là…', 'うちから {駅|えき}まで {歩|ある}いて {十分|じゅっぷん}です。', 'うちから {駅|えき}まで {歩|ある}いて で {十分|じゅっぷん}です。 | うちまで {駅|えき}から {歩|ある}いて {十分|じゅっぷん}です。 | うちから {駅|えき}に {歩|ある}いで {十分|じゅっぷん}です。', '歩いて **không** thêm で.'),
      Q('どんな — 「ホイアンは どんな ところですか。」 trả lời được bằng…', 'きれいな ところです', 'きれいです ところです | きれいに ところです | きれい ところです', 'Trả lời bằng **tính từ + danh từ** (ポイント 25).'),
      Q('そして／が — 「ここは {静|しず}かです。＿＿、きれいです。」', 'そして', 'どう | が | から', 'Hai ý cùng chiều → **そして**.'),
      Q('ね — {友達|ともだち}が 「{今日|きょう}は {暑|あつ}いです。」 Bạn đồng tình bằng…', 'そうですね。', 'そうですか。 | そうですが。 | そうでした。', '**そうですね** = đồng tình ("ừ nhỉ").'),
    ]),
    NOTE('Chấm điểm đầu vào', [
      '10–12 đúng: bạn khá vững → làm thẳng mức Vừa–Khó, dành nhiều thời gian cho nghe/nói.',
      '6–9 đúng: làm từ mức Dễ của lesson bạn sai.',
      'Dưới 6: làm lần lượt từ lesson 1; mỗi ngày không quá 2 lesson.',
    ]),
  ],
};

/* ───────── 1. TỪ VỰNG ───────── */

const B4_TU_VUNG: Lesson = {
  id: 'lt-b4-tu-vung',
  kind: 'vocab',
  title: 'Luyện thêm Bài 4 — Từ vựng: nhận mặt → điền câu → gõ từ (96 câu)',
  goal: 'Nhận ra và dùng đúng 72 từ trong danh sách Bài 4 của cô — từ nhìn mặt chữ đến tự gõ từ khi chỉ có nghĩa tiếng Việt.',
  minutes: 50,
  blocks: [
    NOTE('Cách học bài này', [
      'Làm 🟢 Dễ bằng cách **nhìn chữ, nói to cách đọc, rồi mới chọn nghĩa**. Đừng đoán, nói ra miệng mới nhớ.',
      '🟡 Vừa: mỗi từ phải nằm trong câu. Đừng học từ đơn lẻ — đề thi luôn cho từ trong câu.',
      '🔴 Khó: tự gõ từ khi chỉ có nghĩa Việt; từ gõ sai thì viết lại 3 lần bằng tay.',
      'Lỗi hay mắc: nhầm cặp **暑い (thời tiết) / 熱い (đồ vật)**, **暖かい (thời tiết) / 温かい (đồ ăn uống)**; và quên きれい・有名 đuôi い nhưng là tính từ な.',
    ]),

    H(`${LV.de} — A. Nhìn từ, chọn nghĩa (16 câu)`),
    MC('lt-b4-tv-nhan-mat', 'A. Nhận mặt từ: chọn nghĩa đúng', [
      Q('{北|きた}', 'Phía bắc', 'Phía nam | Phía đông | Phía tây', '北 = きた (bắc). Nam = みなみ, đông = ひがし, tây = にし.'),
      Q('{西|にし}', 'Phía tây', 'Phía đông | Chính giữa | Phía bắc', '西 = にし = tây. Đông là 東 (ひがし).'),
      Q('{真|ま}ん{中|なか}', 'Chính giữa', 'Phía bắc | Phía nam | Phía tây', '真ん中 = まんなか = ở giữa (ベトナムの真ん中 = miền Trung).'),
      Q('{電車|でんしゃ}', 'Tàu điện', 'Ô tô | Máy bay | Xe đạp', '電車 = でんしゃ. Ô tô là 車 (くるま).'),
      Q('{新幹線|しんかんせん}', 'Tàu cao tốc Shinkansen', 'Tàu điện thường | Xe buýt | Máy bay', '新幹線 = しんかんせん, tàu siêu tốc của Nhật.'),
      Q('{飛行機|ひこうき}', 'Máy bay', 'Tàu thuỷ | Ô tô | Nhà ga', '飛行機 = ひこうき. Nhớ: **こう** kéo dài.'),
      Q('{駅|えき}', 'Nhà ga', 'Thành phố | Toà nhà | Sân bay', '駅 = えき = ga tàu.'),
      Q('{温泉|おんせん}', 'Suối nước nóng', 'Sông | Núi | Biển', '温泉 = おんせん. Hakone nổi tiếng với 温泉.'),
      Q('{神社|じんじゃ}', 'Đền Thần đạo', 'Chùa | Nhà thờ | Lâu đài', '神社 = じんじゃ (đền); お寺 = chùa.'),
      Q('{教会|きょうかい}', 'Nhà thờ', 'Chùa | Đền | Toà nhà cao tầng', '教会 = きょうかい = nhà thờ Thiên Chúa.'),
      Q('お{城|しろ}', 'Lâu đài, thành cổ', 'Chùa | Núi | Ga tàu', 'お城 = おしろ, như Himeji-jou.'),
      Q('{緑|みどり}', 'Màu xanh lá; cây xanh', 'Mưa | Tuyết | Đồ ăn', '緑が多い = nhiều cây xanh.'),
      Q('{少|すく}ない', 'Ít', 'Nhiều | Rẻ | Mới', '少ない = ít (trái nghĩa 多い). Dùng: 人が少ないです.'),
      Q('{低|ひく}い', 'Thấp', 'Cao | Nhỏ | Cũ', '低い = ひくい = thấp (về độ cao).'),
      Q('にぎやか', 'Náo nhiệt', 'Yên tĩnh | Nổi tiếng | Sạch sẽ', 'にぎやか = nhộn nhịp; trái nghĩa 静か.'),
      Q('{冷|つめ}たいです', 'Lạnh (đồ ăn uống)', 'Nóng | Ấm | Cay', '冷たい = つめたい = lạnh/mát khi chạm vào hay uống.'),
    ]),

    H(`${LV.de} — B. Nghe nghĩa Việt, chọn từ (16 câu)`),
    MC('lt-b4-tv-nghia-tu', 'B. Từ nghĩa Việt chọn từ Nhật', [
      Q('Mưa', '{雨|あめ}', '{雪|ゆき} | {川|かわ} | {山|やま}', '雨 = あめ. 雪 = tuyết.'),
      Q('Tuyết', '{雪|ゆき}', '{雨|あめ} | {緑|みどり} | {日|ひ}', '雪 = ゆき.'),
      Q('Con sông', '{川|かわ}', '{山|やま} | {町|まち} | {駅|えき}', '川 = かわ. 山 = núi.'),
      Q('Ngọn núi', '{山|やま}', '{川|かわ} | {雪|ゆき} | ビル', '山 = やま.'),
      Q('Toà nhà (cao tầng)', 'ビル', 'ところ | おしろ | えき', 'ビル = building.'),
      Q('Thành phố, thị trấn nơi mình sống', '{町|まち}', '{駅|えき} | {人|ひと} | ところ', '町 = まち.'),
      Q('Ô tô', '{車|くるま}', '{電車|でんしゃ} | {新幹線|しんかんせん} | {飛行機|ひこうき}', '車 = くるま. Ba từ còn lại là các phương tiện khác (電車 có chữ 車 nhưng chỉ tàu điện).'),
      Q('Chùa', 'お{寺|てら}', '{神社|じんじゃ} | {教会|きょうかい} | お{城|しろ}', 'お寺 = おてら = chùa Phật giáo.'),
      Q('Mới', '{新|あたら}しい', '{古|ふる}い | {大|おお}きい | {高|たか}い', '新しい = あたらしい (đọc dài: a-ta-ra-shii).'),
      Q('Cũ, cổ', '{古|ふる}い', '{新|あたら}しい | {低|ひく}い | {少|すく}ない', '古い = ふるい.'),
      Q('To, lớn', '{大|おお}きい', '{小|ちい}さい | {多|おお}い | {高|たか}い', '大きい = おおきい. Cẩn thận おおきい (to) và おおい (nhiều) đều có おお.'),
      Q('Nhỏ, bé', '{小|ちい}さい', '{大|おお}きい | {少|すく}ない | {低|ひく}い', '小さい = ちいさい.'),
      Q('Yên tĩnh', '{静|しず}か', 'にぎやか | きれい | {有名|ゆうめい}', '静か = しずか (tính từ な).'),
      Q('Nổi tiếng', '{有名|ゆうめい}', '{静|しず}か | きれい | にぎやか', '有名 = ゆうめい (tính từ な, đuôi い nhưng KHÔNG phải tính từ い).'),
      Q('Suốt cả năm, quanh năm', '{一年中|いちねんじゅう}', '{毎日|まいにち} | {今年|ことし} | {去年|きょねん}', '一年中 = いちねんじゅう.'),
      Q('Rất', 'とても', 'あまり | {少|すこ}し | どう', 'とても = rất (đi với câu khẳng định).'),
    ]),

    H(`${LV.vua} — C. Chọn từ KHÁC loại (8 câu)`),
    MC('lt-b4-tv-khac-loai', 'C. Một từ khác loại với ba từ còn lại', [
      Q('Chọn từ KHÁC loại: {電車|でんしゃ} / {新幹線|しんかんせん} / {飛行機|ひこうき} / {山|やま}', '{山|やま}', '{電車|でんしゃ} | {新幹線|しんかんせん} | {飛行機|ひこうき}', '3 từ kia là **phương tiện**; 山 là cảnh vật.'),
      Q('Chọn từ KHÁC loại: {北|きた} / {南|みなみ} / {駅|えき} / {東|ひがし}', '{駅|えき}', '{北|きた} | {南|みなみ} | {東|ひがし}', '北・南・東 là **phương hướng**; 駅 là địa điểm.'),
      Q('Chọn từ KHÁC loại: {甘|あま}い / {辛|から}い / {苦|にが}い / {涼|すず}しい', '{涼|すず}しい', '{甘|あま}い | {辛|から}い | {苦|にが}い', '甘い・辛い・苦い là **vị giác**; 涼しい là cảm giác thời tiết.'),
      Q('Chọn từ KHÁC loại: {雨|あめ} / {雪|ゆき} / {温泉|おんせん} / {天気|てんき}', '{温泉|おんせん}', '{雨|あめ} | {雪|ゆき} | {天気|てんき}', '雨・雪・天気 nói về **thời tiết**; 温泉 là nơi chốn.'),
      Q('Chọn từ KHÁC loại: お{寺|てら} / {神社|じんじゃ} / {教会|きょうかい} / {緑|みどり}', '{緑|みどり}', 'お{寺|てら} | {神社|じんじゃ} | {教会|きょうかい}', '3 từ kia là **công trình tôn giáo**; 緑 là màu/cây xanh.'),
      Q('Chọn từ KHÁC loại: {暑|あつ}い / {寒|さむ}い / {涼|すず}しい / {古|ふる}い', '{古|ふる}い', '{暑|あつ}い | {寒|さむ}い | {涼|すず}しい', '3 từ kia nói về **nhiệt độ thời tiết**; 古い nói tuổi/độ cũ.'),
      Q('Chọn từ KHÁC loại (tính từ な): きれい / {静|しず}か / {有名|ゆうめい} / {新|あたら}しい', '{新|あたら}しい', 'きれい | {静|しず}か | {有名|ゆうめい}', '3 từ kia là **tính từ な**; 新しい là tính từ い.'),
      Q('Chọn từ KHÁC loại: とても / あまり / {少|すこ}し / どんな', 'どんな', 'とても | あまり | {少|すこ}し', '3 từ kia là **phó từ mức độ**; どんな là từ để hỏi.'),
    ]),

    H(`${LV.vua} — D. Điền từ vào câu (16 câu)`),
    MC('lt-b4-tv-dien-tu', 'D. Chọn từ điền vào chỗ trống', [
      Q('{東京|とうきょう}から{京都|きょうと}まで＿＿＿で{行|い}きます。 (rất nhanh, khoảng 2 tiếng rưỡi)', '{新幹線|しんかんせん}', '{山|やま} | {雪|ゆき} | {教会|きょうかい}', 'Chỉ 新幹線 là phương tiện đi được liên tỉnh nhanh.'),
      Q('{箱根|はこね}に＿＿＿があります。 ({温|あたた}かいお{湯|ゆ}に{入|はい}れます)', '{温泉|おんせん}', '{駅|えき} | ビル | {緑|みどり}', 'Tắm nước nóng ở Hakone → 温泉.'),
      Q('ハノイは ベトナムの＿＿＿です。 (Hà Nội ở phía bắc)', '{北|きた}', '{南|みなみ} | {西|にし} | {東|ひがし}', 'Hà Nội ở **北**.'),
      Q('ホーチミンは ベトナムの＿＿＿です。', '{南|みなみ}', '{北|きた} | {東|ひがし} | {西|にし}', 'TP.HCM ở phía nam → 南.'),
      Q('ダナンは ベトナムの＿＿＿です。', '{真|ま}ん{中|なか}', '{北|きた} | {南|みなみ} | {西|にし}', 'Đà Nẵng ở miền Trung → 真ん中.'),
      Q('うちから{駅|えき}まで＿＿＿{十分|じゅっぷん}です。 (đi bộ)', '{歩|ある}いて', '{歩|ある}いで | {車|くるま}で | {電車|でんしゃ}', '歩いて không thêm で.'),
      Q('ハノイから ダナンまで＿＿＿ですか。 (hỏi mất bao lâu)', 'どのくらい', 'どんな | どう | いくつ', 'Hỏi thời gian đi đường → どのくらい.'),
      Q('この{町|まち}は＿＿＿が{多|おお}いです。 (nhiều cây xanh)', '{緑|みどり}', '{雪|ゆき} | {電車|でんしゃ} | {飛行機|ひこうき}', '緑が多い = nhiều cây xanh.'),
      Q('{北海道|ほっかいどう}は{冬|ふゆ}、＿＿＿が{多|おお}いです。 (trắng xoá)', '{雪|ゆき}', '{緑|みどり} | {駅|えき} | {電車|でんしゃ}', '冬 + 雪が多い = mùa đông nhiều tuyết.'),
      Q('{今日|きょう}は{天気|てんき}が＿＿＿です。 ({晴|は}れて{気持|きも}ちがいい)', 'いい', '{少|すく}ない | {低|ひく}い | {多|おお}い', '天気がいい = thời tiết đẹp.'),
      Q('{夏|なつ}は＿＿＿{日|ひ}が{多|おお}いです。 (ngày nóng nực)', '{暑|あつ}い', '{熱|あつ}い | {冷|つめ}たいです | {甘|あま}い', 'Thời tiết nóng → **暑い**. 熱い dùng cho đồ vật.'),
      Q('コーヒーは＿＿＿です。 (vừa pha xong, bốc khói)', '{熱|あつ}い', '{暑|あつ}い | {涼|すず}しい | {寒|さむ}い', 'Đồ uống nóng → **熱い**.'),
      Q('ケーキは＿＿＿です。 (nhiều đường)', '{甘|あま}い', '{苦|にが}い | {辛|から}い | {低|ひく}い', 'ケーキ → 甘い.'),
      Q('カレーは＿＿＿です。 (cho nhiều ớt)', '{辛|から}い', '{甘|あま}い | {苦|にが}い | {冷|つめ}たいです', 'カレー → 辛い.'),
      Q('レモンは＿＿＿です。', 'すっぱい', '{甘|あま}い | {苦|にが}い | {暖|あたた}かい', 'レモン → すっぱい (chua).'),
      Q('{私|わたし}の{町|まち}は＿＿＿ところです。 (không ồn ào, yên bình)', '{静|しず}かな', '{静|しず}かい | {静|しず}かの | {静|しず}く', 'Tính từ な + な + danh từ: 静かな ところ.'),
    ]),

    H(`${LV.vua} — E. Từ trái nghĩa (10 câu)`),
    MC('lt-b4-tv-trai-nghia', 'E. Chọn từ TRÁI NGHĨA', [
      Q('{新|あたら}しい ↔ ?', '{古|ふる}い', '{大|おお}きい | {低|ひく}い | {少|すく}ない', 'Mới ↔ cũ.'),
      Q('{大|おお}きい ↔ ?', '{小|ちい}さい', '{低|ひく}い | {古|ふる}い | {少|すく}ない', 'To ↔ nhỏ.'),
      Q('(Núi) {高|たか}い ↔ ?', '{低|ひく}い', '{小|ちい}さい | {少|すく}ない | {安|やす}い', 'Cao ↔ thấp (về độ cao).'),
      Q('{多|おお}い ↔ ?', '{少|すく}ない', '{小|ちい}さい | {低|ひく}い | {古|ふる}い', 'Nhiều ↔ ít.'),
      Q('にぎやか ↔ ?', '{静|しず}か', 'きれい | {有名|ゆうめい} | {古|ふる}い', 'Náo nhiệt ↔ yên tĩnh.'),
      Q('{暑|あつ}い(thời tiết) ↔ ?', '{寒|さむ}い', '{冷|つめ}たいです | {熱|あつ}い | {甘|あま}い', 'Nóng ↔ lạnh (thời tiết).'),
      Q('{熱|あつ}い(đồ uống) ↔ ?', '{冷|つめ}たいです', '{寒|さむ}い | {涼|すず}しい | {暖|あたた}かい', 'Nóng (đồ uống) ↔ lạnh (đồ uống).'),
      Q('{北|きた} ↔ ?', '{南|みなみ}', '{東|ひがし} | {西|にし} | {真|ま}ん{中|なか}', 'Bắc ↔ nam.'),
      Q('{東|ひがし} ↔ ?', '{西|にし}', '{南|みなみ} | {北|きた} | {真|ま}ん{中|なか}', 'Đông ↔ tây.'),
      Q('{天気|てんき}がいい ↔ ?', '{天気|てんき}が{悪|わる}い', '{天気|てんき}が{多|おお}い | {天気|てんき}が{低|ひく}い | {天気|てんき}が{少|すく}ない', 'いい ↔ 悪い (わるい).'),
    ]),

    H(`${LV.kho} — F. Tự gõ từ khi chỉ có nghĩa Việt (12 câu)`),
    QZ('lt-b4-tv-go', 'F. Gõ từ tiếng Nhật (bằng chữ Hán hoặc hiragana)', 'translate', [
      A('Nhà ga', '{駅|えき}'),
      A('Tàu điện', '{電車|でんしゃ}'),
      A('Máy bay', '{飛行機|ひこうき}'),
      A('Suối nước nóng', '{温泉|おんせん}'),
      A('Lâu đài (thêm お lịch sự)', ['お{城|しろ}', 'おしろ']),
      A('Nhiều (đi với が: người nhiều)', '{多|おお}い'),
      A('Yên tĩnh (tính từ な)', '{静|しず}か'),
      A('Nổi tiếng (tính từ な)', '{有名|ゆうめい}'),
      A('Mát mẻ (thời tiết)', '{涼|すず}しい'),
      A('Ngọt', '{甘|あま}い'),
      A('Đắng', '{苦|にが}い'),
      A('Suốt cả năm', '{一年中|いちねんじゅう}'),
    ]),

    H(`${LV.kho} — G. Đúng chỗ dùng: {暑|あつ}い/{熱|あつ}い, {暖|あたた}かい/{温|あたた}かい (10 câu)`),
    MC('lt-b4-tv-cap-nham', 'G. Chọn chữ ĐÚNG chỗ (cặp hay nhầm)', [
      Q('{夏|なつ}は＿＿＿ですね。 (thời tiết)', '{暑|あつ}い', '{熱|あつ}い | {冷|つめ}たいです | {甘|あま}い', 'Thời tiết → 暑い.'),
      Q('この ラーメンは＿＿＿ですね。 (vừa nấu xong)', '{熱|あつ}い', '{暑|あつ}い | {寒|さむ}い | {涼|すず}しい', 'Đồ vật/đồ ăn nóng → 熱い.'),
      Q('{春|はる}は＿＿＿です。 (thời tiết dễ chịu)', '{暖|あたた}かい', '{温|あたた}かい | {熱|あつ}い | {冷|つめ}たいです', 'Thời tiết ấm → 暖かい (bộ 日).'),
      Q('＿＿＿ お{茶|ちゃ}を{飲|の}みます。', '{温|あたた}かい', '{暖|あたた}かい | {暑|あつ}い | {寒|さむ}い', 'Đồ uống ấm → 温かい (bộ 氵).'),
      Q('{冬|ふゆ}は＿＿＿です。 (thời tiết)', '{寒|さむ}い', '{冷|つめ}たいです | {熱|あつ}い | {辛|から}い', 'Thời tiết lạnh → 寒い.'),
      Q('ジュースは＿＿＿です。 (để tủ lạnh)', '{冷|つめ}たいです', '{寒|さむ}い | {涼|すず}しい | {暑|あつ}い', 'Đồ uống lạnh → 冷たい.'),
      Q('{秋|あき}は＿＿＿です。 (mát mẻ dễ chịu)', '{涼|すず}しい', '{冷|つめ}たいです | {熱|あつ}い | {辛|から}い', 'Thời tiết mát → 涼しい.'),
      Q('「{暖|あたた}かい」 と 「{温|あたた}かい」 の{違|ちが}いは？', '{暖|あたた}かい=thời tiết, {温|あたた}かい=đồ ăn uống', '{暖|あたた}かい=đồ ăn uống, {温|あたた}かい=thời tiết | Hai từ giống hệt nhau | {暖|あたた}かい=đắt, {温|あたた}かい=rẻ', 'Cùng đọc あたたかい, nhưng chữ khác nhau theo đối tượng.'),
      Q('「{暑|あつ}い」 と 「{熱|あつ}い」 の{違|ちが}いは？', '{暑|あつ}い=thời tiết, {熱|あつ}い=đồ vật/đồ ăn', '{暑|あつ}い=đồ vật, {熱|あつ}い=thời tiết | Hai từ giống hệt nhau | {暑|あつ}い=ngọt, {熱|あつ}い=cay', 'Cùng đọc あつい.'),
      Q('＿＿＿ {日|ひ}に、{冷|つめ}たい ジュースを{飲|の}みます。', '{暑|あつ}い', '{寒|さむ}い | {熱|あつ}い | {苦|にが}い', 'Ngày nóng bức (thời tiết) → 暑い; uống nước lạnh.'),
    ]),

    H(`${LV.kho} — H. Đọc câu, hiểu nghĩa (8 câu)`),
    MC('lt-b4-tv-hieu-cau', 'H. Chọn nghĩa đúng của câu', [
      Q('{箱根|はこね}に{温泉|おんせん}があります。', 'Ở Hakone có suối nước nóng.', 'Hakone là suối nước nóng lớn nhất. | Tôi đi suối nước nóng ở Hakone. | Hakone không có suối nước nóng.', 'に + あります = ở … có …'),
      Q('{京都|きょうと}は {古|ふる}い お{寺|てら}が {多|おお}いです。', 'Kyoto có nhiều chùa cổ.', 'Kyoto có ít chùa cũ. | Kyoto có chùa mới. | Chùa cổ ở Kyoto rất đắt.', '古いお寺 + 多い = nhiều chùa cổ.'),
      Q('{北海道|ほっかいどう}は{冬|ふゆ}、{雪|ゆき}が{多|おお}いです。', 'Hokkaido mùa đông nhiều tuyết.', 'Hokkaido mùa đông ít tuyết. | Hokkaido mùa hè nhiều mưa. | Hokkaido ở phía nam.', '冬 + 雪が多い.'),
      Q('{私|わたし}の{町|まち}は{大|おお}きくないですが、{緑|みどり}が{多|おお}いです。', 'Thành phố tôi không lớn nhưng nhiều cây xanh.', 'Thành phố tôi lớn và nhiều cây xanh. | Thành phố tôi nhỏ và ít cây xanh. | Thành phố tôi lớn nhưng ít cây xanh.', '大きくない + が + 緑が多い.'),
      Q('{駅|えき}から {歩|ある}いて {五分|ごふん}です。', 'Từ ga đi bộ 5 phút.', 'Từ ga đi tàu 5 phút. | Đến ga mất 5 tiếng. | Ga cách 5 km.', '歩いて五分 = đi bộ 5 phút.'),
      Q('この{山|やま}は {低|ひく}いですが、{有名|ゆうめい}です。', 'Ngọn núi này thấp nhưng nổi tiếng.', 'Ngọn núi này cao và nổi tiếng. | Ngọn núi này thấp nên không ai biết. | Ngọn núi này cao nhưng yên tĩnh.', '低い + が + 有名.'),
      Q('この{町|まち}は{一年中|いちねんじゅう}{暑|あつ}いです。', 'Thị trấn này quanh năm nóng.', 'Thị trấn này mùa hè nóng. | Thị trấn này mùa đông rất lạnh. | Thị trấn này suốt năm lạnh.', '一年中 = quanh năm.'),
      Q('この カレーは あまり {辛|から}くないです。', 'Món cà ri này không cay lắm.', 'Món cà ri này rất cay. | Món cà ri này hơi ngọt. | Món cà ri này không ngon.', 'あまり + 辛くない = không cay lắm.'),
    ]),
  ],
};

/* ───────── 2. CHỮ HÁN CỦA LỚP ───────── */

const B4_CHU_HAN: Lesson = {
  id: 'lt-b4-chu-han',
  kind: 'kanji',
  title: 'Luyện thêm Bài 4 — Chữ Hán của lớp: 京 名 前 国 男 東 女 区 市 (đọc, nghĩa, chọn chữ, đọc câu)',
  goal: 'Đọc đúng, hiểu nghĩa và nhận mặt 9 chữ Hán Bài 4 của lớp (đúng bộ slide cô) trong từ ghép và trong câu KHÔNG có furigana, như đề thi.',
  minutes: 45,
  blocks: [
    NOTE('Cách học bài này', [
      'Học chữ Hán **theo từ**: 東京 = とうきょう, 名前 = なまえ. Đừng cố thuộc âm từng chữ rời.',
      'Bảng dưới là bản tóm tắt; mức 🟢 Dễ chỉ hỏi **từ ghép quen**; 🟡 Vừa bắt đầu có **chữ nhiễu** (chữ na ná); 🔴 Khó đọc **câu không furigana**.',
      'Lỗi hay mắc: 名前 đọc **なまえ** (kun + kun, không phải めいぜん); 男女 đọc **だんじょ** (on); 前日 đọc **ぜんじつ**; 市 đọc **し** nhưng 市場 đọc **いちば**.',
    ]),
    TABLE(
      ['Chữ', 'Hán Việt · nghĩa', 'On (ON)', 'Kun (KUN)', 'Từ cô ghi'],
      [
        ['京', 'KINH · kinh đô', 'キョウ・ケイ', '—', '東京 とうきょう · 京都 きょうと'],
        ['名', 'DANH · tên', 'メイ・ミョウ', 'な', '名前 なまえ · お名前 おなまえ · 有名 ゆうめい'],
        ['前', 'TIỀN · trước', 'ゼン', 'まえ', '名前 · 前日 ぜんじつ · 駅前 えきまえ'],
        ['国', 'QUỐC · nước', 'コク（ゴク）', 'くに', 'お国 おくに · 韓国 かんこく · 中国 ちゅうごく'],
        ['男', 'NAM · đàn ông', 'ダン', 'おとこ', '男の人 おとこのひと · 男女 だんじょ'],
        ['東', 'ĐÔNG · phía đông', 'トウ', 'ひがし', '東京 · 東 ひがし'],
        ['女', 'NỮ · phụ nữ', 'ジョ', 'おんな', '女の人 おんなのひと · 男女 だんじょ'],
        ['区', 'KHU · quận', 'ク', '—', '新宿区 しんじゅくく · 〜区 〜く'],
        ['市', 'THỊ · thành phố; chợ', 'シ', 'いち', 'ハノイ市 ハノイし · 市場 いちば'],
      ],
    ),

    H(`${LV.de} — A. Đọc từ ghép quen (12 câu)`),
    MC('lt-b4-han-doc-tu', 'A. Từ ghép → cách đọc', [
      Q('「東京」 đọc là…', 'とうきょう', 'ひがしきょう | とうけい | ひがしけい', '東 = **とう** (on) khi ghép; 京 = **きょう**.'),
      Q('「京都」 đọc là…', 'きょうと', 'けいと | きょうつ | みやこと', '京都 = きょうと, cố đô Kyoto.'),
      Q('「名前」 đọc là…', 'なまえ', 'めいぜん | なぜん | めいまえ', '名 = な, 前 = まえ (đọc kun cả hai).'),
      Q('「お国」 đọc là…', 'おくに', 'おこく | おぐに | おごく', 'お + 国 (くに).'),
      Q('「中国」 đọc là…', 'ちゅうごく', 'ちゅうこく | なかくに | じゅうごく', 'On: ごく (đục) khi ghép sau 中.'),
      Q('「男の人」 đọc là…', 'おとこのひと', 'おんなのひと | だんのひと | おとこのじん', '男 = おとこ.'),
      Q('「女の人」 đọc là…', 'おんなのひと', 'おとこのひと | じょのひと | おんなのじん', '女 = おんな.'),
      Q('「男女」 đọc là…', 'だんじょ', 'おとこおんな | たんじょ | だんおんな', 'Hai chữ ghép → on: **だん・じょ**.'),
      Q('「前日」 đọc là…', 'ぜんじつ', 'まえび | ぜんにち | さきじつ', '前 = ぜん, 日 = じつ → ぜんじつ (hôm trước).'),
      Q('「駅前」 đọc là…', 'えきまえ', 'えきぜん | やくまえ | えきさき', '駅前 = trước nhà ga.'),
      Q('「新宿区」 đọc là…', 'しんじゅくく', 'しんしゅくく | しんじゅくし | しんじゅくくう', 'Hậu tố 区 đọc **く**.'),
      Q('「ハノイ市」 đọc là…', 'ハノイし', 'ハノイいち | ハノイく | ハノイまち', 'Hậu tố 市 (thành phố) đọc **し**.'),
    ]),

    H(`${LV.de} — B. Hán Việt và nghĩa của chữ (8 câu)`),
    MC('lt-b4-han-nghia', 'B. Nghĩa của từng chữ', [
      Q('Chữ 「京」 (KINH) nghĩa là…', 'Kinh đô', 'Cái tên | Phía trước | Thành phố', 'KINH = thủ đô, kinh đô → 東京, 京都.'),
      Q('Chữ 「名」 (DANH) nghĩa là…', 'Tên', 'Nước | Trước | Quận', 'DANH = tên; 有名 = có tên tuổi = nổi tiếng.'),
      Q('Chữ 「前」 (TIỀN) nghĩa là…', 'Phía trước; trước', 'Phía đông | Đàn ông | Nước', '前 = まえ.'),
      Q('Chữ 「国」 (QUỐC) nghĩa là…', 'Nước, quốc gia', 'Kinh đô | Quận | Phụ nữ', '国 = くに.'),
      Q('Chữ 「男」 (NAM) nghĩa là…', 'Đàn ông, con trai', 'Phụ nữ | Đông | Tên', '男 = おとこ.'),
      Q('Chữ 「東」 (ĐÔNG) nghĩa là…', 'Phía đông', 'Phía tây | Phía trước | Chợ', '東 = ひがし. Tây = 西.'),
      Q('Chữ 「区」 (KHU) nghĩa là…', 'Khu, quận (thành phố lớn)', 'Thành phố | Nước | Kinh đô', '区 = quận (Tokyo có 23 区).'),
      Q('Chữ 「市」 (THỊ) nghĩa là…', 'Thành phố; chợ', 'Quận | Làng | Phía trước', '市 = し (thành phố hành chính), いち (chợ).'),
    ]),

    H(`${LV.vua} — C. Nghe cách đọc, chọn chữ ĐÚNG giữa chữ nhiễu (12 câu)`),
    MC('lt-b4-han-chon-chu', 'C. Cách đọc → chọn chữ Hán đúng', [
      Q('「とうきょう」 viết là…', '東京', '束京 | 東景 | 車京', '東 = 木 (cây) có 日 (mặt trời) ở giữa; 束 (bó) có 口 chứ không phải 日 — nhìn kỹ.'),
      Q('「なまえ」 viết là…', '名前', '各前 | 名育 | 石前', '名 có 夕 + 口; 各 là chữ khác.'),
      Q('「くに」 viết là…', '国', '回 | 困 | 図', '国 = khung 口 bao quanh 玉 (ngọc/lãnh thổ).'),
      Q('「おとこのひと」 viết là…', '男の人', '女の人 | 田の人 | 界の人', '男 = 田 (ruộng) + 力 (sức): người có sức làm ruộng.'),
      Q('「おんなのひと」 viết là…', '女の人', '男の人 | 安の人 | 好の人', '女 là hình người phụ nữ ngồi.'),
      Q('「ハノイ＿」 (thành phố) — 「し」 viết là…', '市', '布 | 巾 | 帝', '市: nét chấm trên 巾 (mũ).'),
      Q('「しんじゅく＿」 (quận) — 「く」 viết là…', '区', '図 | 匹 | 医', '区: ngoặc 匚 chứa 乂.'),
      Q('「ひがし」 viết là…', '東', '束 | 車 | 来', '東 = mặt trời 日 mọc sau cây 木 → phía đông.'),
      Q('「ぜんじつ」 viết là…', '前日', '先日 | 後日 | 前月', '先日 đọc せんじつ (hôm nọ) — khác 前日 ぜんじつ (hôm trước).'),
      Q('「ちゅうごく」 viết là…', '中国', '中回 | 申国 | 中困', '中 (giữa) + 国 (nước).'),
      Q('「きょうと」 viết là…', '京都', '東都 | 京部 | 景都', '京都 = 京 + 都.'),
      Q('「だんじょ」 viết là…', '男女', '女男 | 田女 | 男安', '男 trước 女 trong từ này: 男女.'),
    ]),

    H(`${LV.vua} — D. Từ ghép dễ đọc sai (8 câu)`),
    MC('lt-b4-han-bay', 'D. Cẩn thận: cùng chữ, khác cách đọc', [
      Q('「名前」 — chữ 「名」 đọc là gì?', 'な', 'めい | みょう | ぜん', 'Trong 名前 cả hai chữ đọc kun: な・まえ.'),
      Q('「有名」 — chữ 「名」 đọc là gì?', 'めい', 'な | みょう | まえ', 'Trong 有名 (ゆうめい) 名 đọc on: **めい**.'),
      Q('「前」 trong 「前日」 đọc là gì?', 'ぜん', 'まえ | さき | せん', '前日 = ぜん・じつ.'),
      Q('「前」 trong 「駅前」 đọc là gì?', 'まえ', 'ぜん | せん | さき', '駅前 = えき・まえ.'),
      Q('「国」 trong 「お国」 đọc là gì?', 'くに', 'こく | ごく | きく', 'お国 = おくに.'),
      Q('「国」 trong 「中国」 đọc là gì?', 'ごく', 'くに | こく | ぐに', '中国 = ちゅう・ごく.'),
      Q('「市」 trong 「市場」 đọc là gì?', 'いち', 'し | ち | いし', '市場 = いちば (cái chợ).'),
      Q('「市」 trong 「ハノイ市」 đọc là gì?', 'し', 'いち | ち | しい', 'Địa danh + 市 = し.'),
    ]),

    H(`${LV.vua} — E. Gõ hiragana cho chữ Hán (10 câu)`),
    QZ('lt-b4-han-go', 'E. Viết cách đọc bằng hiragana', 'fill', [
      A('東京 → ?', 'とうきょう'),
      A('京都 → ?', 'きょうと'),
      A('名前 → ?', 'なまえ'),
      A('お国 → ?', 'おくに'),
      A('韓国 → ?', 'かんこく'),
      A('男の人 → ?', 'おとこのひと'),
      A('女の人 → ?', 'おんなのひと'),
      A('男女 → ?', 'だんじょ'),
      A('前日 → ?', 'ぜんじつ'),
      A('駅前 → ?', 'えきまえ'),
    ]),

    H(`${LV.kho} — F. Đọc to câu KHÔNG furigana (14 câu)`),
    READK('lt-b4-han-doc-cau', 'F. Đọc câu, rồi bấm hiện cách đọc để tự chấm', 'Nhìn 5 giây, đọc to không ngập ngừng; nếu dừng ở chữ nào thì chữ đó chưa thuộc.', [
      RK('{東京|とうきょう} は {日本|にほん} の {東|ひがし} に あります。', 'Tokyo nằm ở phía đông Nhật Bản.'),
      RK('お{名前|なまえ} は {何|なん} ですか。', 'Tên bạn là gì?'),
      RK('{私|わたし} の {国|くに} は ベトナム です。', 'Nước tôi là Việt Nam.'),
      RK('あの {男|おとこ} の {人|ひと} は {先生|せんせい} です。', 'Người đàn ông kia là giáo viên.'),
      RK('あの {女|おんな} の {人|ひと} は {学生|がくせい} です。', 'Người phụ nữ kia là sinh viên.'),
      RK('{新宿区|しんじゅくく} は {東京|とうきょう} の {区|く} です。', 'Shinjuku là một quận của Tokyo.'),
      RK('ハノイ-{市|し} は ベトナム の {北|きた} です。', 'Thành phố Hà Nội ở phía bắc Việt Nam.'),
      RK('{中国|ちゅうごく} と {韓国|かんこく} は {日本|にほん} の {西|にし} です。', 'Trung Quốc và Hàn Quốc ở phía tây Nhật Bản.'),
      RK('{京都|きょうと} は {東京|とうきょう} の {西|にし} に あります。', 'Kyoto nằm ở phía tây Tokyo.'),
      RK('{駅|えき} の {前|まえ} に {大|おお}きい ビル が あります。', 'Trước nhà ga có một toà nhà lớn.'),
      RK('{男女|だんじょ} の {学生|がくせい} が {多|おお}い です。', 'Có nhiều sinh viên nam và nữ.'),
      RK('この {市|し} は {緑|みどり} が {多|おお}い です。', 'Thành phố này nhiều cây xanh.'),
      RK('{前日|ぜんじつ} は {日曜日|にちようび} です。', 'Hôm trước là Chủ nhật.'),
      RK('{私|わたし} の {名前|なまえ} は リン です。 {国|くに} は ベトナム です。', 'Tên tôi là Linh. Nước tôi là Việt Nam.'),
    ]),

    H(`${LV.kho} — G. Đọc to cả đoạn không furigana (3 đoạn, giống phần Reading)`),
    READK('lt-b4-han-doc-doan', 'G. Đoạn ngắn — đọc liền một hơi', 'Giống đề Reading thi nói: chuẩn bị ít giây rồi đọc to một lượt, không dừng. Ngắt đúng chỗ 「、」 và 「。」.', [
      RK('{私|わたし} の {国|くに} は ベトナム です。 {私|わたし} の {町|まち} は ダナン-{市|し} です。 ベトナム の {真|ま}ん{中|なか} です。 ハノイ から {飛行機|ひこうき} で {一時間|いちじかん} くらい です。', 'Nước tôi là Việt Nam. Thành phố tôi là Đà Nẵng, ở miền Trung. Từ Hà Nội đi máy bay khoảng một tiếng.'),
      RK('{東京|とうきょう} は {日本|にほん} の {東|ひがし} に あります。 {大|おお}きい {町|まち} です。 {二十三|にじゅうさん} の {区|く} が あります。 {新宿区|しんじゅくく} は {有名|ゆうめい} です。', 'Tokyo nằm ở phía đông Nhật Bản. Là một thành phố lớn. Có 23 quận. Quận Shinjuku nổi tiếng.'),
      RK('ワン-さん の {国|くに} は {中国|ちゅうごく} です。 {北京|ペキン} です。 {北京|ペキン} は {中国|ちゅうごく} の {北|きた} です。 {名前|なまえ} は ワン です。', 'Nước của chị Vương là Trung Quốc, ở Bắc Kinh. Bắc Kinh ở phía bắc Trung Quốc. Tên chị là Vương.'),
    ]),

    H(`${LV.kho} — H. Chọn cách đọc của từ trong 【 】 (10 câu)`),
    MC('lt-b4-han-trong-cau', 'H. Cách đọc đúng của từ trong ngoặc', [
      Q('あの【男】の{人|ひと}は だれですか。', 'おとこ', 'おんな | だん | じょ', '男 một mình trước の → おとこ.'),
      Q('【東】の{国|くに}、{日本|にほん}へ ようこそ。', 'ひがし', 'にし | みなみ | きた', '東 → ひがし (đứng một mình, nghĩa phía đông).'),
      Q('お【名前】は？', 'なまえ', 'めいまえ | なぜん | みょうぜん', '名前 = なまえ.'),
      Q('{新宿|しんじゅく}【区】', 'く', 'し | いち | まち', '区 = く.'),
      Q('ハノイ【市】', 'し', 'いち | く | ちょう', '市 (thành phố) = し.'),
      Q('【前日】は にちようびです。', 'ぜんじつ', 'まえび | ぜんにち | さきじつ', '前日 = ぜんじつ.'),
      Q('【男女】の{学生|がくせい}です。', 'だんじょ', 'たんじょ | おとこおんな | だんおんな', '男女 = だんじょ.'),
      Q('【中国】は ひろいです。', 'ちゅうごく', 'ちゅうこく | なかくに | じゅうごく', '中国 = ちゅうごく (ごく đục).'),
      Q('【京都】は ふるい {町|まち}です。', 'きょうと', 'けいと | みやこ | きょうつ', '京都 = きょうと.'),
      Q('【駅前】に ビルが あります。', 'えきまえ', 'えきぜん | やくまえ | えきさき', '駅前 = えきまえ.'),
    ]),

    H(`${LV.kho} — I. Chữ Hán thông minh: nhóm, nghĩa, mẹo (6 câu)`),
    MC('lt-b4-han-nhom', 'I. Câu hỏi tổng hợp về 9 chữ Hán', [
      Q('Chữ nào chỉ PHƯƠNG HƯỚNG?', '東', '名 | 前 | 市', '東 = phía đông.'),
      Q('Cặp chữ nào đều chỉ GIỚI TÍNH?', '男・女', '京・区 | 名・前 | 国・市', '男 (nam), 女 (nữ).'),
      Q('Cặp chữ nào dùng làm HẬU TỐ địa danh hành chính (〜quận, 〜thành phố)?', '区・市', '男・女 | 名・前 | 東・京', '〜区 (く), 〜市 (し).'),
      Q('Từ nào đọc ghép hoàn toàn bằng KUN (cả hai chữ)?', '名前（なまえ）', '東京（とうきょう） | 男女（だんじょ） | 前日（ぜんじつ）', '名前 = な + まえ; ba từ kia đọc on.'),
      Q('Từ nào có nghĩa "nổi tiếng"?', '有名', '名前 | 国名 | 男名', '有名 = ゆうめい (有 = có, 名 = tên).'),
      Q('Chữ 「国」 trong 「韓国」 giúp ta biết đây là…', 'Tên một nước', 'Tên một quận | Một cái tên người | Tên một ngày', '〜国 (こく) = nước: 韓国, 中国, 外国.'),
    ]),

    H('Luyện viết tay (không bắt buộc, nhưng giúp nhớ lâu)'),
    WRITE('lt-b4-han-viet', 'Viết từ có chữ Hán Bài 4', ['東京', '京都', '名前', '国', '男', '女', '区', '市'], 'Viết theo thứ tự nét, đọc to từng chữ khi viết.', {
      '東京': 'とうきょう · Tokyo',
      '京都': 'きょうと · Kyoto',
      '名前': 'なまえ · tên',
      '国': 'くに · nước',
      '男': 'おとこ · đàn ông',
      '女': 'おんな · phụ nữ',
      '区': 'ku · quận',
      '市': 'し · thành phố',
    }),
  ],
};

/* ───────── 3. NGỮ PHÁP 1 — ポイント 24–27 ───────── */

const B4_NP1: Lesson = {
  id: 'lt-b4-ngu-phap-1',
  kind: 'grammar',
  title: 'Luyện thêm Bài 4 — Ngữ pháp 1: tính từ い／な, đứng trước danh từ, "mùa/tháng, …", とても・あまり (ポイント 24–27)',
  goal: 'Chia và dùng đúng tính từ い／な (khẳng định, phủ định, trước danh từ), nói đặc điểm của nơi chốn theo mùa và dùng とても／少し／あまり — từ nhận biết đến tự viết câu.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      'Trước khi làm, nhớ **hai bộ chia**: tính từ **い** → bỏ い + **くない**です; tính từ **な** → **じゃありません**. Đặt hai dòng này lên bàn và nói to mỗi lần chia.',
      'Hai chữ thần chú: **とても** (rất) đi với câu **khẳng định**, **あまり** (không … lắm) đi với câu **phủ định**. Thấy あまり mà cuối câu khẳng định là sai.',
      'Lỗi hay mắc: **いい → よくない** (không phải ~~いくない~~); **きれい・有名** đuôi い nhưng là tính từ **な**; thêm **な** trước danh từ với tính từ な.',
    ]),
    TABLE(
      ['', 'Khẳng định', 'Phủ định', 'Trước danh từ'],
      [
        ['Tính từ い', '大きいです', '大きくないです', '大きい 町'],
        ['いい (bất quy tắc)', 'いいです', 'よくないです', 'いい 町'],
        ['Tính từ な', '静かです', '静かじゃありません', '静かな 町'],
      ],
      'Bốn dòng cần thuộc lòng',
    ),
    EXS([
      E('この {町|まち} は {大|おお}きい です。', 'Thành phố này lớn.'),
      E('この {町|まち} は あまり {大|おお}きくない です。', 'Thành phố này không lớn lắm.'),
      E('ハノイ は {冬|ふゆ}、 {少|すこ}し {寒|さむ}い です。', 'Hà Nội mùa đông hơi lạnh.'),
      E('{京都|きょうと} は {静|しず}かな {町|まち} です。', 'Kyoto là thành phố yên tĩnh.'),
    ]),

    H(`${LV.de} — A. Chia phủ định (14 câu)`),
    MC('lt-b4-g1-phu-dinh', 'A. Chọn dạng phủ định đúng', [
      Q('{大|おお}きい → phủ định lịch sự', '{大|おお}きくないです', '{大|おお}きいくないです | {大|おお}きいじゃありません | {大|おお}きなくないです', 'Tính từ い: **bỏ い + くない**です.'),
      Q('{高|たか}い → phủ định lịch sự', '{高|たか}くないです', '{高|たか}いくないです | {高|たか}いじゃありません | {高|たか}ないです', '高い → 高く + ないです.'),
      Q('{新|あたら}しい → phủ định lịch sự', '{新|あたら}しくないです', '{新|あたら}しいくないです | {新|あたら}しいじゃありません | {新|あたら}しないです', '新しい → 新しく + ないです.'),
      Q('{小|ちい}さい → phủ định lịch sự', '{小|ちい}さくないです', '{小|ちい}さいくないです | {小|ちい}さいじゃありません | {小|ちい}さなくないです', '小さい → 小さく + ないです.'),
      Q('{古|ふる}い → phủ định lịch sự', '{古|ふる}くないです', '{古|ふる}いくないです | {古|ふる}いじゃありません | {古|ふる}ないです', '古い → 古く + ないです.'),
      Q('{多|おお}い → phủ định lịch sự', '{多|おお}くないです', '{多|おお}いくないです | {多|おお}いじゃありません | {多|おお}ないです', '多い → 多く + ないです.'),
      Q('{少|すく}ない → phủ định lịch sự', '{少|すく}なくないです', '{少|すく}ないくないです | {少|すく}ないじゃありません | {少|すく}くないです', '少ない → 少なく + ないです (đuôi ない: ない → なく).'),
      Q('いい → phủ định lịch sự', 'よくないです', 'いくないです | いいくないです | いいじゃありません', 'いい là bất quy tắc: **よくない**.'),
      Q('{寒|さむ}い → phủ định lịch sự', '{寒|さむ}くないです', '{寒|さむ}いくないです | {寒|さむ}いじゃありません | {寒|さむ}ないです', '寒い → 寒く + ないです.'),
      Q('{静|しず}か → phủ định lịch sự', '{静|しず}かじゃありません', '{静|しず}かくないです | {静|しず}かないです | {静|しず}かいじゃありません', 'Tính từ な: + **じゃありません** (như danh từ).'),
      Q('きれい → phủ định lịch sự', 'きれいじゃありません', 'きれいくないです | きれくないです | きれいなじゃありません', 'きれい là tính từ な → きれい**じゃありません**.'),
      Q('にぎやか → phủ định lịch sự', 'にぎやかじゃありません', 'にぎやかくないです | にぎやかないです | にぎやかなじゃありません', 'にぎやか là tính từ な.'),
      Q('{有名|ゆうめい} → phủ định lịch sự', '{有名|ゆうめい}じゃありません', '{有名|ゆうめい}くないです | {有名|ゆうめい}いじゃありません | {有名|ゆうめい}ないです', '有名 là tính từ な (đuôi い nhưng KHÔNG bỏ い).'),
      Q('{低|ひく}い → phủ định lịch sự', '{低|ひく}くないです', '{低|ひく}いくないです | {低|ひく}いじゃありません | {低|ひく}ないです', '低い → 低く + ないです.'),
    ]),

    H(`${LV.de} — B. Tính từ い hay tính từ な? (10 câu)`),
    MC('lt-b4-g1-loai', 'B. Phân loại tính từ', [
      Q('きれい là…', 'Tính từ な (きれいな ～)', 'Tính từ い (きれいい ～) | Danh từ | Động từ', 'きれい đuôi い nhưng thuộc **nhóm な**.'),
      Q('{有名|ゆうめい} là…', 'Tính từ な ({有名|ゆうめい}な ～)', 'Tính từ い | Danh từ không đổi | Động từ', '有名 là tính từ な.'),
      Q('{静|しず}か là…', 'Tính từ な', 'Tính từ い | Động từ | Trạng từ', '静か → 静かな ところ.'),
      Q('にぎやか là…', 'Tính từ な', 'Tính từ い | Động từ | Danh từ', 'にぎやか → にぎやかな 町.'),
      Q('{新|あたら}しい là…', 'Tính từ い', 'Tính từ な | Danh từ | Động từ', 'Đuôi しい → tính từ い.'),
      Q('{大|おお}きい là…', 'Tính từ い', 'Tính từ な | Danh từ | Động từ', '大きい: tính từ い.'),
      Q('{低|ひく}い là…', 'Tính từ い', 'Tính từ な | Danh từ | Động từ', '低い: tính từ い.'),
      Q('{暑|あつ}い là…', 'Tính từ い', 'Tính từ な | Danh từ | Động từ', '暑い: tính từ い.'),
      Q('いい là…', 'Tính từ い (bất quy tắc: よくない)', 'Tính từ な | Danh từ | Động từ', 'いい phủ định là よくない.'),
      Q('{少|すく}ない là…', 'Tính từ い', 'Tính từ な | Danh từ | Động từ', '少ない: tính từ い (phủ định 少なくない).'),
    ]),

    H(`${LV.de} — C. Tính từ + danh từ (12 câu)`),
    MC('lt-b4-g1-truoc-dt', 'C. Chọn dạng đúng trước danh từ', [
      Q('{京都|きょうと}は＿＿＿ {町|まち}です。 (cổ kính)', '{古|ふる}い', '{古|ふる}いな | {古|ふる}く | {古|ふる}の', 'Tính từ い đứng thẳng trước danh từ.'),
      Q('{京都|きょうと}は＿＿＿ {町|まち}です。 (yên tĩnh)', '{静|しず}かな', '{静|しず}か | {静|しず}かい | {静|しず}かの', 'Tính từ な + **な** + danh từ.'),
      Q('ここは＿＿＿ ところです。 (đẹp)', 'きれいな', 'きれい | きれいい | きれいの', 'きれい (な) → きれいな ところ.'),
      Q('{富士山|ふじさん}は＿＿＿ {山|やま}です。 (nổi tiếng)', '{有名|ゆうめい}な', '{有名|ゆうめい} | {有名|ゆうめい}い | {有名|ゆうめい}の', '有名な 山.'),
      Q('あれは＿＿＿ ビルです。 (cao)', '{高|たか}い', '{高|たか}な | {高|たか}く | {高|たか}の', '高い ビル.'),
      Q('あれは＿＿＿ お{城|しろ}です。 (to)', '{大|おお}きい', '{大|おお}きいな | {大|おお}きく | {大|おお}きくな', '大きい お城 (tính từ い đứng thẳng trước danh từ).'),
      Q('ここは＿＿＿ ところです。 (nhộn nhịp)', 'にぎやかな', 'にぎやか | にぎやかい | にぎやかの', 'にぎやかな ところ.'),
      Q('これは＿＿＿ {教会|きょうかい}です。 (mới)', '{新|あたら}しい', '{新|あたら}しいな | {新|あたら}しく | {新|あたら}しの', '新しい 教会.'),
      Q('＿＿＿ {町|まち}ですね。 (nhỏ)', '{小|ちい}さい', '{小|ちい}さいな | {小|ちい}さく | {小|ちい}さの', '小さい 町.'),
      Q('これは＿＿＿ {天気|てんき}です。 (tốt)', 'いい', 'いいな | よくな | いくい', 'いい 天気 (いい + danh từ, giữ nguyên).'),
      Q('ここは＿＿＿ 川ですね。 (đẹp, sạch)', 'きれいな', 'きれい | きれいい | きれくないです', 'きれいな 川.'),
      Q('ここは＿＿＿ {山|やま}ですか。 (thấp)', '{低|ひく}い', '{低|ひく}な | {低|ひく}く | {低|ひく}い な', '低い 山.'),
    ]),

    H(`${LV.vua} — D. Chia theo ngữ cảnh (12 câu, gõ tay)`),
    QZ('lt-b4-g1-chia', 'D. Điền dạng đúng của từ trong ngoặc', 'fill', [
      A('この{町|まち}は あまり（{大|おお}きいです）。', NI('{大|おお}き'), 'あまり + phủ định'),
      A('{私|わたし}の{町|まち}の{山|やま}は あまり（{高|たか}いです）。', NI('{高|たか}'), 'あまり + phủ định'),
      A('あの ビルは あまり（{新|あたら}しいです）。', NI('{新|あたら}し')),
      A('この{川|かわ}は あまり（きれいです）。', NN('きれい')),
      A('{私|わたし}の{町|まち}は あまり（{静|しず}かです）。', NN('{静|しず}か')),
      A('この{公園|こうえん}は あまり（{有名|ゆうめい}です）。', NN('{有名|ゆうめい}')),
      A('この カレーは あまり（おいしいです）。', NI('おいし')),
      A('ダナンは あまり（{寒|さむ}いです）。', NI('{寒|さむ}')),
      A('この{町|まち}は あまり（にぎやかです）。', NN('にぎやか')),
      A('{私|わたし}の{町|まち}は{緑|みどり}が あまり（{多|おお}いです）。', NI('{多|おお}')),
      A('この{町|まち}は{人|ひと}が あまり（{少|すく}ないです）。', ['{少|すく}なくないです', '{少|すく}なくありません']),
      A('{今日|きょう}は{天気|てんき}が あまり（いいです）。', ['よくないです', 'よくありません']),
    ], 'N は あまり ＋ Aくないです／Aじゃありません'),

    H(`${LV.vua} — E. Hỏi – đáp (10 câu)`),
    MC('lt-b4-g1-hoi-dap', 'E. Chọn câu trả lời đúng', [
      Q('「ハノイは にぎやかですか。」 → 「いいえ、＿＿＿」', 'にぎやかじゃありません。', 'にぎやかくないです。 | にぎやかないです。 | にぎやかなじゃありません。', 'Tính từ な → じゃありません.'),
      Q('「この カレーは {辛|から}いですか。」 → 「はい、＿＿＿」', '{辛|から}いです。', '{辛|から}くです。 | {辛|から}いくないです。 | {辛|から}いですか。', 'Khẳng định tính từ い: giữ nguyên + です.'),
      Q('「あの ビルは {高|たか}いですか。」 → 「いいえ、＿＿＿」', '{高|たか}くないです。', '{高|たか}いくないです。 | {高|たか}いじゃありません。 | {高|たか}ないです。', '高い → 高くない.'),
      Q('「{日本|にほん}の{夏|なつ}は {暑|あつ}いですか。」 → 「はい、＿＿＿」', 'とても{暑|あつ}いです。', 'とても{暑|あつ}くないです。 | あまり{暑|あつ}いです。 | とても{暑|あつ}です。', 'とても + khẳng định.'),
      Q('「{町|まち}は {緑|みどり}が {多|おお}いですか。」 → 「いいえ、＿＿＿」', 'あまり{多|おお}くないです。', 'あまり{多|おお}いです。 | とても{多|おお}くないです。 | あまり{多|おお}いくないです。', 'あまり + phủ định.'),
      Q('「{天気|てんき}は いいですか。」 → 「いいえ、＿＿＿」', 'よくないです。', 'いくないです。 | いいくないです。 | よいじゃありません。', 'いい → よくない.'),
      Q('「この{山|やま}は {有名|ゆうめい}ですか。」 → 「はい、＿＿＿」', '{有名|ゆうめい}です。', '{有名|ゆうめい}いです。 | {有名|ゆうめい}なです。 | {有名|ゆうめい}くです。', 'Tính từ な khẳng định = từ + です.'),
      Q('「{北海道|ほっかいどう}の{冬|ふゆ}は {寒|さむ}いですか。」 → 「はい、＿＿＿」', 'とても{寒|さむ}いです。', 'とても{寒|さむ}くないです。 | あまり{寒|さむ}いです。 | とても{寒|さむ}です。', 'とても + khẳng định.'),
      Q('「{駅|えき}は {大|おお}きいですか。」 → 「いいえ、＿＿＿」', 'あまり{大|おお}きくないです。', 'あまり{大|おお}きいです。 | とても{大|おお}きくないです。 | あまり{大|おお}きなです。', 'あまり + phủ định.'),
      Q('「ここは {静|しず}かですか。」 → 「いいえ、＿＿＿」', 'あまり{静|しず}かじゃありません。', 'あまり{静|しず}かです。 | とても{静|しず}かじゃありません。 | あまり{静|しず}かくないです。', 'あまり + phủ định (な: じゃありません).'),
    ]),

    H(`${LV.vua} — F. Mùa／tháng, とても・{少|すこ}し・あまり (10 câu)`),
    MC('lt-b4-g1-mua', 'F. Chọn câu đúng ý', [
      Q('Câu nào = "Hà Nội mùa đông không lạnh lắm"?', 'ハノイは{冬|ふゆ}、あまり{寒|さむ}くないです。', 'ハノイは{冬|ふゆ}、あまり{寒|さむ}いです。 | ハノイは{冬|ふゆ}、とても{寒|さむ}くないです。 | ハノイは{冬|ふゆ}、{寒|さむ}くないあまりです。', 'あまり + phủ định (-くない).'),
      Q('Câu nào = "Đà Nẵng mùa hè rất nóng"?', 'ダナンは{夏|なつ}、とても{暑|あつ}いです。', 'ダナンは{夏|なつ}、あまり{暑|あつ}いです。 | ダナンは{夏|なつ}、とても{暑|あつ}くないです。 | ダナンは{夏|なつ}、{暑|あつ}いとてもです。', 'とても + khẳng định.'),
      Q('Câu nào = "Đà Nẵng quanh năm nóng"?', 'ダナンは{一年中|いちねんじゅう}、{暑|あつ}いです。', 'ダナンは{一年中|いちねんじゅう}が{暑|あつ}いです。 | ダナンは{一年中|いちねんじゅう}を{暑|あつ}いです。 | ダナンは{一年中|いちねんじゅう}と{暑|あつ}いです。', '一年中 đặt sau は, có dấu 、, không cần trợ từ.'),
      Q('この{町|まち}は{冬|ふゆ}、＿＿＿ {雪|ゆき}が{多|おお}いです。', 'とても', 'あまり | どう | どんな', 'Cuối câu 多い (khẳng định) → とても.'),
      Q('この{町|まち}は{夏|なつ}、＿＿＿ {暑|あつ}くないです。', 'あまり', 'とても | どう | どんな', 'Cuối câu 暑くない (phủ định) → あまり.'),
      Q('この スープは＿＿＿ {辛|から}いです。 (cay nhẹ)', '{少|すこ}し', 'あまり | どう | どんな', '少し + khẳng định = hơi, một chút.'),
      Q('ハノイは{夏|なつ}、{暑|あつ}いです。 {冬|ふゆ}は＿＿＿です。 (không lạnh lắm)', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}くないです | あまり{寒|さむ}い | とても{寒|さむ}くありません', 'あまり + くない.'),
      Q('Câu nào ĐÚNG ngữ pháp?', 'ハノイは{冬|ふゆ}、{雨|あめ}が{少|すく}ないです。', 'ハノイは{冬|ふゆ}、{雨|あめ}を{少|すく}ないです。 | ハノイは{冬|ふゆ}、{雨|あめ}が{少|すく}ないくないです。 | ハノイが{冬|ふゆ}を、{雨|あめ}は{少|すく}ないです。', 'Nơi は mùa、 N が A: **を** không đi với tính từ, và 少ない không thêm くない.'),
      Q('Câu nào = "Thành phố tôi nhiều người"?', '{私|わたし}の{町|まち}は{人|ひと}が{多|おお}いです。', '{私|わたし}の{町|まち}は{人|ひと}を{多|おお}いです。 | {私|わたし}の{町|まち}が{人|ひと}は{多|おお}いです。 | {私|わたし}の{町|まち}は{人|ひと}に{多|おお}いです。', 'N1 は N2 **が** A.'),
      Q('Câu nào = "Núi này cao"?', 'この{山|やま}は{高|たか}いです。', 'この{山|やま}を{高|たか}いです。 | この{山|やま}は{高|たか}いくです。 | この{山|やま}に{高|たか}いです。', 'N は A です.'),
    ]),

    H(`${LV.vua} — G. Ghép câu (8 câu)`),
    BUILD('lt-b4-g1-ghep', 'G. Sắp xếp các mảnh thành câu đúng', [
      BD('Thành phố tôi nhiều cây xanh.', '{私|わたし}の {町|まち} は {緑|みどり} が {多|おお}い です。', ['を', 'に']),
      BD('Món này không cay lắm.', 'この {料理|りょうり} は あまり {辛|から}くない です。', ['とても', '{辛|から}いくない']),
      BD('Hà Nội mùa đông không lạnh lắm.', 'ハノイ は {冬|ふゆ}、 あまり {寒|さむ}くない です。', ['とても']),
      BD('Đà Nẵng quanh năm nóng.', 'ダナン は {一年中|いちねんじゅう}、 {暑|あつ}い です。', ['が', 'あまり']),
      BD('Kyoto là thành phố cổ nổi tiếng.', '{京都|きょうと} は {有名|ゆうめい}な {古|ふる}い {町|まち} です。', ['の']),
      BD('Công viên này yên tĩnh.', 'この {公園|こうえん} は {静|しず}か です。', ['{静|しず}かい', 'な']),
      BD('Ngọn núi này không cao.', 'この {山|やま} は {高|たか}くない です。', ['{高|たか}いくない', 'を']),
      BD('Thời tiết hôm nay không tốt.', '{今日|きょう} は {天気|てんき} が よくない です。', ['いくない', 'を']),
    ]),

    H(`${LV.kho} — H. Tìm câu SAI (10 câu)`),
    MC('lt-b4-g1-sai', 'H. Câu nào SAI?', [
      Q('Câu nào SAI?', 'この{町|まち}は{大|おお}きいじゃありません。', 'この{町|まち}は{静|しず}かです。 | この{町|まち}はにぎやかじゃありません。 | この{町|まち}は{古|ふる}くないです。', 'Tính từ い phủ định là 大き**くない**, không dùng じゃありません.'),
      Q('Câu nào SAI?', '{富士山|ふじさん}は{高|たか}いくないです。', '{富士山|ふじさん}は{高|たか}いです。 | {富士山|ふじさん}は{高|たか}くないです。 | {富士山|ふじさん}は{高|たか}い{山|やま}です。', 'Phải bỏ い: 高いくない → 高**く**ない.'),
      Q('Câu nào SAI?', 'きれい{町|まち}です。', 'きれいな{町|まち}です。 | {古|ふる}い{町|まち}です。 | {静|しず}かな{町|まち}です。', 'Tính từ な thiếu な trước danh từ.'),
      Q('Câu nào SAI?', 'いくない{天気|てんき}です。', 'いい{天気|てんき}です。 | よくない{天気|てんき}です。 | {天気|てんき}がいいです。', 'いい → よくない, không phải いくない.'),
      Q('Câu nào SAI?', '{有名|ゆうめい}のお{寺|てら}です。', '{有名|ゆうめい}なお{寺|てら}です。 | {古|ふる}いお{寺|てら}です。 | {大|おお}きいお{寺|てら}です。', '有名 là tính từ な → 有名**な**お寺.'),
      Q('Câu nào SAI?', 'とても{寒|さむ}くないです。', 'とても{寒|さむ}いです。 | あまり{寒|さむ}くないです。 | {少|すこ}し{寒|さむ}いです。', 'とても không đi với phủ định (dùng あまり).'),
      Q('Câu nào SAI?', 'あまり{静|しず}かです。', 'あまり{静|しず}かじゃありません。 | とても{静|しず}かです。 | {少|すこ}し{静|しず}かです。', 'あまり phải đi với phủ định.'),
      Q('Câu nào SAI?', '{私|わたし}の{町|まち}は{人|ひと}を{多|おお}いです。', '{私|わたし}の{町|まち}は{人|ひと}が{多|おお}いです。 | {私|わたし}の{町|まち}は{人|ひと}が{少|すく}ないです。 | {私|わたし}の{町|まち}は{緑|みどり}が{多|おお}いです。', 'Đặc điểm của nơi chốn: N1 は N2 **が** A.'),
      Q('Câu nào SAI?', '{低|ひく}いな{山|やま}です。', '{低|ひく}い{山|やま}です。 | {高|たか}い{山|やま}です。 | {小|ちい}さい{山|やま}です。', 'Tính từ い không thêm な.'),
      Q('Câu nào SAI?', '{静|しず}かなです。', '{静|しず}かな ところです。 | {静|しず}かです。 | {静|しず}かじゃありません。', '静かな phải đi trước danh từ; cuối câu dùng 静かです.'),
    ]),

    H(`${LV.kho} — I. Dịch Việt → Nhật (6 câu)`),
    QZ('lt-b4-g1-dich', 'I. Dịch sang tiếng Nhật (gõ bằng chữ Hán hoặc hiragana)', 'translate', [
      A('Thành phố của tôi không lớn lắm.', ['{私|わたし}の{町|まち}はあまり{大|おお}きくないです。', '{私|わたし}の{町|まち}はあまり{大|おお}きくありません。', '{町|まち}はあまり{大|おお}きくないです。'], '町 · 大きい · あまり'),
      A('Hà Nội mùa hè rất nóng.', 'ハノイは{夏|なつ}、とても{暑|あつ}いです。', '夏 · 暑い · とても'),
      A('Kyoto là một thành phố cổ.', '{京都|きょうと}は{古|ふる}い{町|まち}です。', '古い + N'),
      A('Công viên này không yên tĩnh lắm.', NN('この{公園|こうえん}はあまり{静|しず}か').slice(0, 2), '公園 · 静か · あまり'),
      A('Thành phố tôi nhiều cây xanh.', '{私|わたし}の{町|まち}は{緑|みどり}が{多|おお}いです。', '緑 · 多い · が'),
      A('Hôm nay thời tiết không tốt.', ['{今日|きょう}は{天気|てんき}がよくないです。', '{今日|きょう}は{天気|てんき}がよくありません。'], 'いい → よくない'),
    ], 'N は (N が) A ／ あまり + phủ định ／ とても + khẳng định'),

    H(`${LV.kho} — J. Nhật → Việt (6 câu)`),
    MC('lt-b4-g1-hieu', 'J. Chọn nghĩa đúng của câu', [
      Q('この{町|まち}は あまり{静|しず}かじゃありません。', 'Thị trấn này không yên tĩnh lắm.', 'Thị trấn này rất yên tĩnh. | Thị trấn này không đẹp lắm. | Thị trấn này hơi ồn ào nhưng đẹp.', 'あまり + じゃありません = không … lắm.'),
      Q('ダナンは{冬|ふゆ}、{少|すこ}し{寒|さむ}いです。', 'Đà Nẵng mùa đông hơi lạnh.', 'Đà Nẵng mùa đông rất lạnh. | Đà Nẵng mùa đông không lạnh. | Đà Nẵng mùa hè hơi nóng.', '少し + khẳng định = hơi.'),
      Q('{私|わたし}の{町|まち}は{人|ひと}が{少|すく}なくないです。', 'Thành phố tôi không ít người (khá đông).', 'Thành phố tôi nhiều người nhưng nhỏ. | Thành phố tôi rất ít người. | Thành phố tôi không có người.', '少なくない = không ít.'),
      Q('{京都|きょうと}は{有名|ゆうめい}な{古|ふる}い{町|まち}です。', 'Kyoto là thành phố cổ nổi tiếng.', 'Kyoto là thành phố mới nổi tiếng. | Kyoto là thành phố cổ không nổi tiếng. | Kyoto là thành phố nhỏ và yên tĩnh.', '有名な + 古い + 町.'),
      Q('{今日|きょう}は{天気|てんき}がよくないです。', 'Hôm nay thời tiết không tốt.', 'Hôm nay thời tiết rất đẹp. | Hôm nay trời không nóng. | Hôm nay có tuyết.', 'よくない = không tốt.'),
      Q('この{山|やま}は{低|ひく}いです。', 'Ngọn núi này thấp.', 'Ngọn núi này rất cao. | Ngọn núi này không thấp. | Ngọn núi này nổi tiếng.', '低い = thấp.'),
    ]),
  ],
};

/* ───────── 4. NGỮ PHÁP 2 — ポイント 28–31 ───────── */

const B4_NP2: Lesson = {
  id: 'lt-b4-ngu-phap-2',
  kind: 'grammar',
  title: 'Luyện thêm Bài 4 — Ngữ pháp 2: に～があります, phương hướng, から～まで どのくらい, で (ポイント 28–31)',
  goal: 'Nói được ở đâu có gì, thành phố nằm ở hướng nào của nước, đi từ A đến B bằng gì và mất bao lâu — nhận biết, điền, ghép câu rồi tự dịch.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      'Ba khung câu cần nói **không cần nghĩ**: ① 「N1 **に** N2 **が** あります」 ② 「N1 は N2 の 北／南／東／西／真ん中 です」 ③ 「N1 **から** N2 **まで** (phương tiện **で**) thời gian くらい です」.',
      'Mỗi khung chỉ có **một chỗ đổi từ**. Học cách thay từ, đừng học thuộc cả câu.',
      'Lỗi hay mắc: dùng **で** thay **に** (~~箱根で温泉があります~~); thêm **で** sau 歩いて (~~歩いてで~~); nhầm **～時 (giờ) / ～時間 (khoảng giờ)**; đọc sai **ぷん／ふん** (3分 さんぷん, 5分 ごふん, 10分 じゅっぷん).',
    ]),
    TABLE(
      ['Khung', 'Công thức', 'Ví dụ'],
      [
        ['Có gì ở đâu', 'N1 に N2 が あります', '箱根に温泉があります'],
        ['Hướng', 'N1 は N2 の 北／南／東／西／真ん中 です', 'ハノイはベトナムの北です'],
        ['Từ – đến', 'N1 から N2 まで (N3 で) ～ くらい です', '東京から京都まで新幹線で二時間半くらいです'],
        ['Hỏi', 'どのくらい ですか ／ 何が ありますか ／ どこですか', ''],
      ],
      'Ba khung + câu hỏi',
    ),
    EXS([
      E('{箱根|はこね} に {温泉|おんせん} が あります。', 'Ở Hakone có suối nước nóng.'),
      E('ハノイ は ベトナム の {北|きた} です。', 'Hà Nội ở phía bắc Việt Nam.'),
      E('うち から {駅|えき} まで {歩|ある}いて {十分|じゅっぷん} です。', 'Từ nhà đến ga đi bộ 10 phút.'),
      E('{東京|とうきょう} から {京都|きょうと} まで {新幹線|しんかんせん} で {二時間半|にじかんはん} くらい です。', 'Từ Tokyo đến Kyoto đi Shinkansen khoảng hai tiếng rưỡi.'),
    ]),

    H(`${LV.de} — A. Trợ từ trong 「N1 に N2 が あります」 (12 câu)`),
    MC('lt-b4-g2-aru', 'A. Chọn cặp trợ từ đúng', [
      Q('{箱根|はこね}＿＿ {温泉|おんせん}＿＿ あります。', 'に / が', 'で / が | に / を | が / に', 'Nơi tồn tại + **に**; vật tồn tại + **が**.'),
      Q('{私|わたし}の{町|まち}＿＿ {川|かわ}＿＿ あります。', 'に / が', 'で / を | を / が | は / を', 'に (nơi) + が (vật).'),
      Q('ハノイ＿＿ {何|なに}＿＿ ありますか。', 'に / が', 'で / を | に / を | が / に', 'Hỏi có gì: 何 + **が** ありますか.'),
      Q('{公園|こうえん}＿＿ {山|やま}＿＿ ありません。', 'に / が', 'で / を | に / を | を / が', 'Phủ định: ありません, vẫn là に … が.'),
      Q('{京都|きょうと}＿＿ お{寺|てら}＿＿ {多|おお}いです。', 'に / が', 'で / を | に / を | を / が', 'N1 に N2 が + tính từ: ở … có nhiều … (đặc điểm).', 0),
      Q('{町|まち}の{北|きた}＿＿ {山|やま}＿＿ あります。', 'に / が', 'で / を | に / を | を / が', 'に + が.'),
      Q('{駅|えき}の{前|まえ}＿＿ ビル＿＿ あります。', 'に / が', 'で / を | に / を | を / が', 'に + が.'),
      Q('ここ＿＿ {教会|きょうかい}＿＿ ありません。', 'に / が', 'で / を | に / を | を / が', 'に + が + ありません.'),
      Q('この{町|まち}＿＿ {神社|じんじゃ}＿＿ ありますか。', 'に / が', 'で / を | に / を | を / が', 'Câu hỏi có/không: に … が ありますか.'),
      Q('{山|やま}の{上|うえ}＿＿ お{城|しろ}＿＿ あります。', 'に / が', 'で / を | に / を | を / が', 'に + が.'),
      Q('{川|かわ}＿＿ {北|きた}＿＿ {駅|えき}＿＿ あります。', 'の / に / が', 'は / で / を | を / に / が | の / で / を', 'Phía bắc của sông có ga: 川の北に 駅が あります.'),
      Q('{日本|にほん}＿＿ {温泉|おんせん}＿＿ {多|おお}いです。', 'に / が', 'で / を | に / を | を / が', 'Nơi (に) + đặc điểm (が + 多い).'),
    ]),

    H(`${LV.de} — B. Phương hướng (10 câu)`),
    MC('lt-b4-g2-huong', 'B. Chọn hướng đúng', [
      Q('ハノイは ベトナムの＿＿＿です。', '{北|きた}', '{南|みなみ} | {東|ひがし} | {真|ま}ん{中|なか}', 'Hà Nội ở miền Bắc.'),
      Q('ホーチミンは ベトナムの＿＿＿です。', '{南|みなみ}', '{北|きた} | {西|にし} | {真|ま}ん{中|なか}', 'TP.HCM ở miền Nam.'),
      Q('ダナンは ベトナムの＿＿＿です。', '{真|ま}ん{中|なか}', '{北|きた} | {南|みなみ} | {西|にし}', 'Đà Nẵng ở miền Trung.'),
      Q('{北海道|ほっかいどう}は {日本|にほん}の＿＿＿です。', '{北|きた}', '{南|みなみ} | {東|ひがし} | {西|にし}', 'Hokkaido ở phía bắc Nhật.'),
      Q('{沖縄|おきなわ}は {日本|にほん}の＿＿＿です。', '{南|みなみ}', '{北|きた} | {東|ひがし} | {真|ま}ん{中|なか}', 'Okinawa ở phía nam Nhật.'),
      Q('パースは オーストラリアの＿＿＿です。', '{西|にし}', '{東|ひがし} | {北|きた} | {真|ま}ん{中|なか}', 'Perth ở phía tây nước Úc.'),
      Q('シドニーは オーストラリアの＿＿＿です。', '{東|ひがし}', '{西|にし} | {北|きた} | {真|ま}ん{中|なか}', 'Sydney ở phía đông nước Úc.'),
      Q('{京都|きょうと}は {東京|とうきょう}の＿＿＿です。', '{西|にし}', '{東|ひがし} | {北|きた} | {真|ま}ん{中|なか}', 'Kyoto nằm ở phía tây Tokyo.'),
      Q('{北京|ペキン}は {中国|ちゅうごく}の＿＿＿です。', '{北|きた}', '{南|みなみ} | {西|にし} | {真|ま}ん{中|なか}', 'Bắc Kinh ở phía bắc Trung Quốc.'),
      Q('「ホイアンは ベトナムの {真|ま}ん{中|なか}です」 — ホイアンは どこ？', 'Miền Trung', 'Miền Bắc | Miền Nam | Phía tây', '真ん中 = ở giữa.'),
    ]),

    H(`${LV.de} — C. Phương tiện + で (10 câu)`),
    MC('lt-b4-g2-de', 'C. Có cần で không?', [
      Q('{電車|でんしゃ}＿＿ {行|い}きます。', 'で', 'を | が | へ', 'Phương tiện + で.'),
      Q('{飛行機|ひこうき}＿＿ {東京|とうきょう}へ{行|い}きます。', 'で', 'を | が | へ', 'Phương tiện + で.'),
      Q('{新幹線|しんかんせん}＿＿ {京都|きょうと}へ{行|い}きます。', 'で', 'を | が | へ', 'Phương tiện + で.'),
      Q('{車|くるま}＿＿ {行|い}きます。', 'で', 'を | が | へ', 'Phương tiện + で.'),
      Q('{歩|ある}いて＿＿ {学校|がっこう}へ{行|い}きます。', 'X (không điền gì)', 'で | を | が', 'Đi bộ: 歩いて đã đủ, KHÔNG thêm で.'),
      Q('うちから{駅|えき}まで{歩|ある}いて＿＿ {十分|じゅっぷん}です。', 'X (không điền gì)', 'で | を | が', '歩いて + thời gian, không で.'),
      Q('{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}＿＿ {二時間半|にじかんはん}です。', 'で', 'を | が | X (không điền gì)', 'Có phương tiện thì thêm で.'),
      Q('ハノイから ダナンまで {飛行機|ひこうき}＿＿ {一時間半|いちじかんはん}くらいです。', 'で', 'を | が | X (không điền gì)', 'Phương tiện + で.'),
      Q('{駅|えき}から{学校|がっこう}まで バス＿＿ {十五分|じゅうごふん}です。', 'で', 'を | が | X (không điền gì)', 'バス (xe buýt) + で.'),
      Q('{町|まち}から{山|やま}まで {自転車|じてんしゃ}＿＿ {三十分|さんじゅっぷん}です。', 'で', 'を | が | X (không điền gì)', 'Xe đạp cũng là phương tiện → で.'),
    ]),

    H(`${LV.de} — D. Đọc giờ và phút (10 câu)`),
    MC('lt-b4-g2-so', 'D. Cách đọc đúng', [
      Q('「{十分|じゅっぷん}」 đọc là…', 'じゅっぷん', 'じゅうふん | じゅっふん | じゅうぷん', '10 phút: **じゅっぷん** (âm ngắt + ぷん).'),
      Q('「3 phút」 đọc là…', 'さんぷん', 'さんふん | さぷん | さんぷ', '3 phút = さん**ぷ**ん.'),
      Q('「5 phút」 đọc là…', 'ごふん', 'ごぷん | ごっぷん | ごぶん', '5 phút = ご**ふ**ん.'),
      Q('「6 phút」 đọc là…', 'ろっぷん', 'ろくふん | ろくぷん | ろふん', '6 phút = **ろっぷん**.'),
      Q('「8 phút」 đọc là…', 'はっぷん', 'はっふん | はちぷん | はふん', '8 phút = **はっぷん**.'),
      Q('「30 phút」 đọc là…', 'さんじゅっぷん', 'さんじゅうふん | さんじゅうぷん | さんじゅふん', '30 phút = さんじゅっぷん.'),
      Q('「1 tiếng」 đọc là…', 'いちじかん', 'ひとじかん | いちじ | いちかん', '1 tiếng = いち**じかん**.'),
      Q('「4 tiếng」 đọc là…', 'よじかん', 'よんじかん | しじかん | よんかん', '4 tiếng = **よ**じかん.'),
      Q('「9 tiếng」 đọc là…', 'くじかん', 'きゅうじかん | きゅじかん | くうじかん', '9 tiếng = **く**じかん (cũng như 9 giờ = くじ: số 9 đọc く).'),
      Q('「2 tiếng rưỡi」 đọc là…', 'にじかんはん', 'にじはん | にじかんなかば | にはんじかん', '～時間 + 半 → にじかんはん. (にじはん = 2 giờ 30!)'),
    ]),

    H(`${LV.vua} — E. Điền từ còn thiếu (12 câu, gõ tay)`),
    QZ('lt-b4-g2-dien', 'E. Gõ một từ/trợ từ vào chỗ trống', 'fill', [
      A('ホーチミンは ベトナム＿＿ {南|みなみ}です。 (trợ từ)', 'の'),
      A('{箱根|はこね}＿＿ {温泉|おんせん}があります。 (trợ từ)', 'に'),
      A('{箱根|はこね}に{温泉|おんせん}＿＿ あります。 (trợ từ)', 'が'),
      A('ハノイに {何|なに}＿＿ ありますか。 (trợ từ)', 'が'),
      A('{東京|とうきょう}から{京都|きょうと}まで{新幹線|しんかんせん}＿＿ {二時間半|にじかんはん}くらいです。 (trợ từ)', 'で'),
      A('うちから{学校|がっこう}＿＿ {二十分|にじゅっぷん}です。 (trợ từ)', 'まで'),
      A('うち＿＿ {学校|がっこう}まで{二十分|にじゅっぷん}です。 (trợ từ)', 'から'),
      A('うちから{駅|えき}まで＿＿ {十分|じゅっぷん}です。 (đi bộ)', '{歩|ある}いて'),
      A('ハノイから ダナンまで ＿＿＿ ですか。 (hỏi: mất bao lâu)', 'どのくらい'),
      A('ダナンは ベトナムの＿＿＿です。 (miền Trung)', '{真|ま}ん{中|なか}'),
      A('{駅|えき}から{学校|がっこう}まで {電車|でんしゃ}で {十五分|じゅうごふん}＿＿＿です。 (khoảng)', ['くらい', 'ぐらい']),
      A('ここに {教会|きょうかい}が ＿＿＿。 (không có)', 'ありません'),
    ]),

    H(`${LV.vua} — F. Hỏi – đáp (10 câu)`),
    MC('lt-b4-g2-hoi-dap', 'F. Chọn câu trả lời hợp lý', [
      Q('「ハノイは どこですか。」', 'ベトナムの{北|きた}です。', 'ベトナムで{北|きた}です。 | ベトナムを{北|きた}です。 | ベトナムの{北|きた}があります。', 'Hỏi vị trí: N は N の 北 です.'),
      Q('「ダナンから ホイアンまで どのくらいですか。」', '{車|くるま}で{一時間|いちじかん}くらいです。', '{車|くるま}を{一時間|いちじかん}くらいです。 | {車|くるま}で{一時|いちじ}くらいです。 | {車|くるま}に{一時間|いちじかん}です。', 'Phương tiện で + thời gian (tiếng) くらい.'),
      Q('「{箱根|はこね}に {何|なに}が ありますか。」', '{温泉|おんせん}があります。', '{温泉|おんせん}を あります。 | {温泉|おんせん}で あります。 | {温泉|おんせん}は ありません です。', '何が → ～が あります.'),
      Q('「この{町|まち}に {神社|じんじゃ}が ありますか。」 (không có)', 'いいえ、ありません。', 'いいえ、いません。 | いいえ、ありますん。 | いいえ、じゃありません。', 'Không có: ありません. (います dùng cho người, học ở Bài 7.)'),
      Q('「うちから {学校|がっこう}まで どのくらいですか。」', '{歩|ある}いて{二十分|にじゅっぷん}くらいです。', '{歩|ある}いてで{二十分|にじゅっぷん}です。 | {歩|ある}いて{二十|にじゅう}ふんです。 | {歩|ある}いて{二十時間|にじゅうじかん}です。', '歩いて + thời gian, không で.'),
      Q('「ハノイは ベトナムの どこですか。」', '{北|きた}です。', '{北|きた}があります。 | {北|きた}を います。 | {北|きた}でした。', 'Hỏi lại cụ thể: ～の どこですか → trả lời hướng.'),
      Q('「お{国|くに}は どちらですか。」', 'ベトナムです。', 'ベトナムが あります。 | ベトナムで。 | ベトナムを です。', 'どちら = nước nào/ở đâu (lịch sự) → ベトナムです.'),
      Q('「{東京|とうきょう}から {大阪|おおさか}まで {何|なに}で {行|い}きますか。」', '{新幹線|しんかんせん}で{行|い}きます。', '{新幹線|しんかんせん}を{行|い}きます。 | {新幹線|しんかんせん}が{行|い}きます。 | {新幹線|しんかんせん}へ{行|い}きます。', '何で ～ = bằng phương tiện gì? → ～で.'),
      Q('「{京都|きょうと}は {東京|とうきょう}の どこですか。」', '{西|にし}です。', '{西|にし}が あります。 | {西|にし}を です。 | {西|にし}で あります。', '～の どこ → hướng.'),
      Q('「ここから {駅|えき}まで どのくらいですか。」', '{五分|ごふん}くらいです。', '{五時|ごじ}くらいです。 | {五円|ごえん}くらいです。 | {五人|ごにん}くらいです。', 'Mất bao lâu → ～分／～時間.'),
    ]),

    H(`${LV.vua} — G. Ghép câu (10 câu)`),
    BUILD('lt-b4-g2-ghep', 'G. Sắp xếp các mảnh thành câu', [
      BD('Hà Nội ở phía bắc Việt Nam.', 'ハノイ は ベトナム の {北|きた} です。', ['に', 'が']),
      BD('Ở Hakone có suối nước nóng.', '{箱根|はこね} に {温泉|おんせん} が あります。', ['で', 'を']),
      BD('Từ nhà đến trường mất 20 phút.', 'うち から {学校|がっこう} まで {二十分|にじゅっぷん} です。', ['で']),
      BD('Từ Hà Nội đến Đà Nẵng đi máy bay khoảng một tiếng rưỡi.', 'ハノイ から ダナン まで {飛行機|ひこうき} で {一時間半|いちじかんはん} くらい です。', ['を']),
      BD('Từ ga đến trường đi bộ 5 phút.', '{駅|えき} から {学校|がっこう} まで {歩|ある}いて {五分|ごふん} です。', ['で']),
      BD('Ở thành phố tôi không có nhà thờ.', '{私|わたし}の {町|まち} に {教会|きょうかい} が ありません。', ['で', 'を']),
      BD('Từ Tokyo đến Kyoto đi Shinkansen khoảng hai tiếng rưỡi.', '{東京|とうきょう} から {京都|きょうと} まで {新幹線|しんかんせん} で {二時間半|にじかんはん} くらい です。', ['を']),
      BD('TP. Hồ Chí Minh ở phía nam Việt Nam.', 'ホーチミン は ベトナム の {南|みなみ} です。', ['が']),
      BD('Trong công viên có sông không?', '{公園|こうえん} に {川|かわ} が ありますか。', ['で']),
      BD('Ở Hà Nội có gì?', 'ハノイ に {何|なに} が ありますか。', ['を']),
    ]),

    H(`${LV.vua} — H. Đọc thông tin rồi trả lời (8 câu)`),
    MC('lt-b4-g2-doc-tt', 'H. Đọc kỹ, chọn đáp án', [
      Q('ベトナムの{北|きた}は ハノイ、{南|みなみ}は ホーチミンです。 ホーチミンは どこですか。', 'ベトナムの{南|みなみ}です。', 'ベトナムの{北|きた}です。 | ベトナムの{真|ま}ん{中|なか}です。 | ベトナムの{西|にし}です。', 'Thông tin: 南 = ホーチミン.'),
      Q('うちから{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}です。 {駅|えき}から{会社|かいしゃ}まで{電車|でんしゃ}で{三十分|さんじゅっぷん}です。 うちから{駅|えき}まで {何|なん}で {行|い}きますか。', '{歩|ある}いて{行|い}きます。', '{電車|でんしゃ}で{行|い}きます。 | {車|くるま}で{行|い}きます。 | {飛行機|ひこうき}で{行|い}きます。', 'Nhà → ga: 歩いて.'),
      Q('うちから{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}。 {駅|えき}から{会社|かいしゃ}まで{電車|でんしゃ}で{三十分|さんじゅっぷん}。 Tổng thời gian từ nhà đến công ty là?', '{四十分|よんじゅっぷん}', '{三十分|さんじゅっぷん} | {二十分|にじゅっぷん} | {一時間|いちじかん}', '10 + 30 = 40 phút.'),
      Q('{東京|とうきょう}から{京都|きょうと}まで{新幹線|しんかんせん}で{二時間半|にじかんはん}くらいです。 {車|くるま}は {五時間|ごじかん}くらいです。 Cái nào nhanh hơn?', '{新幹線|しんかんせん}（2 tiếng rưỡi < 5 tiếng）', '{車|くるま}（5 tiếng < 2 tiếng rưỡi） | Bằng nhau | Không biết', 'Ít giờ hơn = nhanh hơn.'),
      Q('「{北|きた}に {山|やま}、{南|みなみ}に {海|うみ}が あります。」 {海|うみ}は どこですか。', '{南|みなみ}', '{北|きた} | {東|ひがし} | {西|にし}', '南に 海.'),
      Q('「{駅|えき}の{前|まえ}に ビルが あります。 ビルの{中|なか}に {銀行|ぎんこう}が あります。」 {銀行|ぎんこう}は どこに ありますか。', 'ビルの{中|なか}', '{駅|えき}の{前|まえ}（ビルの外） | 駅の中 | 山の上', 'ビルの中に 銀行.'),
      Q('{私|わたし}の{町|まち}は ダナンです。 ハノイから{飛行機|ひこうき}で{一時間半|いちじかんはん}くらいです。 ダナンは ベトナムの どこですか。', '{真|ま}ん{中|なか}', '{北|きた} | {南|みなみ} | {西|にし}', 'Đà Nẵng ở miền Trung.'),
      Q('{学校|がっこう}から{駅|えき}まで バスで {十五分|じゅうごふん}です。 {歩|ある}いて {四十分|よんじゅっぷん}です。 Cách nào nhanh hơn?', 'バス', '{歩|ある}いて | Bằng nhau | {電車|でんしゃ}', '15 phút < 40 phút.'),
    ]),

    H(`${LV.kho} — I. Tìm câu SAI (10 câu)`),
    MC('lt-b4-g2-sai', 'I. Câu nào SAI?', [
      Q('Câu nào SAI?', '{箱根|はこね}で{温泉|おんせん}があります。', '{箱根|はこね}に{温泉|おんせん}があります。 | {箱根|はこね}に{温泉|おんせん}がありません。 | {箱根|はこね}に{何|なに}がありますか。', 'Nơi tồn tại dùng **に**, không dùng で.'),
      Q('Câu nào SAI?', 'うちから{駅|えき}まで{歩|ある}いてで{十分|じゅっぷん}です。', 'うちから{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}です。 | うちから{駅|えき}まで{電車|でんしゃ}で{十分|じゅっぷん}です。 | うちから{駅|えき}まで{十分|じゅっぷん}です。', '歩いて không thêm で.'),
      Q('Câu nào SAI?', 'ハノイはベトナム{北|きた}です。', 'ハノイはベトナムの{北|きた}です。 | ホーチミンはベトナムの{南|みなみ}です。 | ダナンはベトナムの{真|ま}ん{中|なか}です。', 'Thiếu **の** giữa nước và hướng.'),
      Q('Câu nào SAI?', '{電車|でんしゃ}を{行|い}きます。', '{電車|でんしゃ}で{行|い}きます。 | {飛行機|ひこうき}で{行|い}きます。 | {歩|ある}いて{行|い}きます。', 'Phương tiện đi kèm **で**, không dùng を.'),
      Q('Câu nào SAI?', '{町|まち}に {何|なに}を ありますか。', '{町|まち}に {何|なに}が ありますか。 | {町|まち}に {川|かわ}が あります。 | {町|まち}に {川|かわ}が ありません。', 'あります đi với **が** (vật tồn tại).'),
      Q('Câu nào SAI?', '{東京|とうきょう}にから{京都|きょうと}まで{二時間半|にじかんはん}です。', '{東京|とうきょう}から{京都|きょうと}まで{二時間半|にじかんはん}です。 | {東京|とうきょう}から{京都|きょうと}まで{新幹線|しんかんせん}で{二時間半|にじかんはん}です。 | {東京|とうきょう}から{京都|きょうと}までどのくらいですか。', 'から đứng ngay sau địa điểm, không có に.'),
      Q('Câu nào SAI?', '{十分|じゅっぷん}は「じゅうふん」と{読|よ}みます。', '{十分|じゅっぷん}は「じゅっぷん」と{読|よ}みます。 | {三分|さんぷん}は「さんぷん」と{読|よ}みます。 | {五分|ごふん}は「ごふん」と{読|よ}みます。', '10 phút = じゅっぷん (âm ngắt).'),
      Q('Câu nào SAI?', '{二時間半|にじかんはん}は「にじはん」と{読|よ}みます。', '{二時間半|にじかんはん}は「にじかんはん」と{読|よ}みます。 | {二時半|にじはん}は「にじはん」です。 | {二時間|にじかん}は「にじかん」です。', '2 tiếng rưỡi = にじかんはん; にじはん = 2 giờ rưỡi.'),
      Q('Câu nào SAI?', '{学校|がっこう}から{家|いえ}まで どのくらいが ですか。', '{学校|がっこう}から{家|いえ}まで どのくらいですか。 | ハノイから ダナンまで どのくらいですか。 | うちから{駅|えき}まで どのくらいですか。', 'どのくらい + ですか (không có が).'),
      Q('Câu nào SAI?', 'ここに ビルを あります。', 'ここに ビルが あります。 | ここに ビルが ありません。 | ここに ビルが ありますか。', 'ビルが あります (が, không phải を).'),
    ]),

    H(`${LV.kho} — J. Dịch Việt → Nhật (6 câu)`),
    QZ('lt-b4-g2-dich', 'J. Dịch sang tiếng Nhật', 'translate', [
      A('Ở Hakone có suối nước nóng.', '{箱根|はこね}に{温泉|おんせん}があります。', '箱根 · 温泉 · に…が'),
      A('Hà Nội ở phía bắc Việt Nam.', 'ハノイはベトナムの{北|きた}です。', 'の + 北'),
      A('Từ nhà đến trường đi bộ 15 phút.', ['うちから{学校|がっこう}まで{歩|ある}いて{十五分|じゅうごふん}です。', 'うちから{学校|がっこう}まで{歩|ある}いて{十五分|じゅうごふん}くらいです。'], '歩いて · 十五分'),
      A('Từ Tokyo đến Kyoto đi Shinkansen khoảng hai tiếng rưỡi.', ['{東京|とうきょう}から{京都|きょうと}まで{新幹線|しんかんせん}で{二時間半|にじかんはん}くらいです。', '{東京|とうきょう}から{京都|きょうと}まで{新幹線|しんかんせん}で{二時間半|にじかんはん}です。'], 'で + 二時間半'),
      A('Ở thành phố tôi có một ngôi chùa cổ.', ['{私|わたし}の{町|まち}に{古|ふる}いお{寺|てら}があります。', '{私|わたし}の{町|まち}に{古|ふる}い{寺|てら}があります。'], '古いお寺 + があります'),
      A('Từ Hà Nội đến Đà Nẵng mất bao lâu?', 'ハノイからダナンまでどのくらいですか。', 'どのくらい'),
    ], 'N1 に N2 が あります ／ N1 は N2 の 北 です ／ N1 から N2 まで N3 で ～ くらい です'),

    H(`${LV.kho} — K. Nhật → Việt (6 câu)`),
    MC('lt-b4-g2-hieu', 'K. Chọn nghĩa đúng', [
      Q('{町|まち}の{北|きた}に {山|やま}が あります。', 'Ở phía bắc thành phố có núi.', 'Ở phía nam thành phố có núi. | Núi ở bắc cao lắm. | Thành phố ở phía bắc núi.', '北に 山が あります.'),
      Q('{駅|えき}から{学校|がっこう}まで {歩|ある}いて {二十分|にじゅっぷん}くらいです。', 'Từ ga đến trường đi bộ khoảng 20 phút.', 'Từ ga đến trường đi tàu 20 phút. | Từ trường đến ga đi bộ 2 phút. | Ga cách trường 20 km.', '歩いて + 二十分.'),
      Q('ダナンは ベトナムの {真|ま}ん{中|なか}です。', 'Đà Nẵng ở miền Trung Việt Nam.', 'Đà Nẵng ở miền Bắc. | Đà Nẵng ở miền Nam. | Đà Nẵng ở trung tâm Hà Nội.', '真ん中 = ở giữa.'),
      Q('{東京|とうきょう}から {大阪|おおさか}まで {飛行機|ひこうき}で {一時間|いちじかん}くらいです。', 'Từ Tokyo đến Osaka đi máy bay khoảng một tiếng.', 'Từ Tokyo đến Osaka đi tàu một tiếng. | Từ Osaka đến Tokyo mất một ngày. | Tokyo gần Osaka lắm.', '飛行機で 一時間.'),
      Q('この{町|まち}に {駅|えき}と {神社|じんじゃ}が あります。', 'Ở thị trấn này có ga và đền.', 'Thị trấn này ở gần ga và đền. | Ga ở trong đền. | Tôi đi đền bằng tàu.', 'に … が あります (liệt kê bằng と).'),
      Q('ここに {温泉|おんせん}が ありません。', 'Ở đây không có suối nước nóng.', 'Ở đây có suối nước nóng. | Suối nước nóng ở xa. | Đi suối nước nóng ở đây.', 'ありません = không có.'),
    ]),

    H(`${LV.kho} — L. Phép tính thời gian đi đường (8 câu)`),
    MC('lt-b4-g2-tinh', 'L. Tính tổng thời gian', [
      Q('うち→{駅|えき} {歩|ある}いて{十分|じゅっぷん}／{駅|えき}→{会社|かいしゃ} {電車|でんしゃ}で{三十分|さんじゅっぷん}。 うち→{会社|かいしゃ} は？', '{四十分|よんじゅっぷん}', '{三十分|さんじゅっぷん} | {二十分|にじゅっぷん} | {一時間|いちじかん}', '10 + 30 = 40.'),
      Q('うち→{駅|えき} {歩|ある}いて{五分|ごふん}／{駅|えき}→{学校|がっこう} {電車|でんしゃ}で{十五分|じゅうごふん}。 うち→{学校|がっこう} は？', '{二十分|にじゅっぷん}', '{十分|じゅっぷん} | {三十分|さんじゅっぷん} | {四十分|よんじゅっぷん}', '5 + 15 = 20.'),
      Q('{東京|とうきょう}→{京都|きょうと} {新幹線|しんかんせん}で{二時間半|にじかんはん}／{京都|きょうと}→{大阪|おおさか} {電車|でんしゃ}で{三十分|さんじゅっぷん}。 {東京|とうきょう}→{大阪|おおさか} は？', '{三時間|さんじかん}', '{二時間|にじかん} | {二時間半|にじかんはん} | {四時間|よじかん}', '2h30 + 30 phút = 3h.'),
      Q('{家|いえ}→{駅|えき} {車|くるま}で{十分|じゅっぷん}／{駅|えき}→{会社|かいしゃ} {電車|でんしゃ}で{五十分|ごじゅっぷん}。 {家|いえ}→{会社|かいしゃ} は？', '{一時間|いちじかん}', '{四十分|よんじゅっぷん} | {三十分|さんじゅっぷん} | {二時間|にじかん}', '10 + 50 = 60 phút = 1 tiếng.'),
      Q('「{一時間半|いちじかんはん}」は {何分|なんぷん}？', '90 phút', '30 phút | 60 phút | 150 phút', '1 tiếng + 30 phút = 90 phút.'),
      Q('{飛行機|ひこうき}で{三時間|さんじかん}、{電車|でんしゃ}で{五時間|ごじかん}。 Cái nào nhanh hơn?', '{飛行機|ひこうき}', '{電車|でんしゃ} | Bằng nhau | Không biết', 'Ít giờ hơn = nhanh hơn.'),
      Q('「うちから{駅|えき}まで{歩|ある}いて{二十分|にじゅっぷん}」。 {駅|えき}から{学校|がっこう}まで{十分|じゅっぷん}。 うちから{学校|がっこう}まで は？', '{三十分|さんじゅっぷん}', '{十分|じゅっぷん} | {二十分|にじゅっぷん} | {四十分|よんじゅっぷん}', '20 + 10 = 30.'),
      Q('{飛行機|ひこうき}で{一時間半|いちじかんはん}。 {電車|でんしゃ}で{二時間|にじかん}。 Chênh lệch thời gian là?', '30 phút', '1 tiếng | 15 phút | 2 tiếng', '2h − 1h30 = 30 phút.'),
    ]),
  ],
};

/* ───────── 5. NGỮ PHÁP 3 — ポイント 32–36 ───────── */

const B4_NP3: Lesson = {
  id: 'lt-b4-ngu-phap-3',
  kind: 'grammar',
  title: 'Luyện thêm Bài 4 — Ngữ pháp 3: どんな N, どうですか, そして, ～が、～, ～ね (ポイント 32–36)',
  goal: 'Hỏi và trả lời "là nơi như thế nào / thế nào", nối hai ý cùng chiều (そして) hoặc ngược chiều (が), và đồng tình bằng ね／そうですね — từ nhận biết đến tự viết.',
  minutes: 55,
  blocks: [
    NOTE('Cách học bài này', [
      '**どんな + danh từ**: luôn đi với danh từ (どんな ところ, どんな 町) → trả lời bằng **tính từ + danh từ**. **どう**: đứng một mình, hỏi cảm nhận/tình trạng → trả lời bằng tính từ.',
      '**そして** nối hai ý **cùng chiều** (tốt + tốt, hoặc xấu + xấu); **が** nối hai ý **ngược chiều** (xấu → tốt, hoặc tốt → xấu). Hỏi mình: "ý thứ hai cùng hướng hay ngược hướng với ý thứ nhất?"',
      'Lỗi hay mắc: trả lời どんな bằng ~~きれいです~~ (thiếu danh từ); đặt が ở đầu câu (が đặt **trong** câu, ngay sau です); dùng そうですか thay そうですね để đồng tình.',
    ]),
    TABLE(
      ['Mẫu', 'Hỏi', 'Trả lời'],
      [
        ['どんな N', 'ホイアンは どんな 町ですか。', 'きれいな 町です。'],
        ['どう', 'ベトナムの 夏は どうですか。', 'とても 暑いです。'],
        ['そして', '', 'ここは 静かです。そして、きれいです。'],
        ['が', '', 'ここは 古いですが、きれいです。'],
        ['ね', '今日は 暑いですね。', 'そうですね。'],
      ],
      'Năm mẫu cần nhớ',
    ),
    EXS([
      E('ホイアン は どんな {町|まち} です か。', 'Hội An là thành phố như thế nào?'),
      E('ベトナム の {夏|なつ} は どう です か。', 'Mùa hè ở Việt Nam thế nào?'),
      E('ここ は {静|しず}か です。 そして、 きれい です。', 'Nơi này yên tĩnh. Và đẹp nữa.'),
      E('この {町|まち} は {小|ちい}さい です が、 {有名|ゆうめい} です。', 'Thành phố này nhỏ nhưng nổi tiếng.'),
    ]),

    H(`${LV.de} — A. どんな hay どう? (10 câu)`),
    MC('lt-b4-g3-donna', 'A. Chọn từ để hỏi đúng', [
      Q('ホイアンは＿＿＿ {町|まち}ですか。', 'どんな', 'どう | {何|なに} | どこ', 'Có danh từ 町 phía sau → **どんな**.'),
      Q('ベトナムの{夏|なつ}は＿＿＿ですか。', 'どう', 'どんな | {何|なに} | どこ', 'Không có danh từ đi sau → **どう**.'),
      Q('{京都|きょうと}は＿＿＿ ところですか。', 'どんな', 'どう | {何|なに} | どこ', 'どんな + ところ.'),
      Q('{日本|にほん}の{冬|ふゆ}は＿＿＿ですか。', 'どう', 'どんな | {何|なに} | どこ', 'どう (hỏi cảm nhận).'),
      Q('ダナンの{料理|りょうり}は＿＿＿ですか。', 'どう', 'どんな | どこ | いくら', 'Hỏi cảm nhận về món ăn → どう.'),
      Q('ハノイは＿＿＿ {町|まち}ですか。', 'どんな', 'どう | どこ | いくら', 'どんな 町.'),
      Q('この{公園|こうえん}は＿＿＿ですか。 (hỏi cảm nhận)', 'どう', 'どんな | どこ | {何|なに}', 'Hỏi cảm nhận, không có danh từ sau → どう.'),
      Q('{北海道|ほっかいどう}は＿＿＿ ところですか。', 'どんな', 'どう | どこ | いくら', 'どんな ところ.'),
      Q('{町|まち}の{天気|てんき}は＿＿＿ですか。', 'どう', 'どんな | どこ | {何|なに}', 'Hỏi tình trạng thời tiết → どう.'),
      Q('{富士山|ふじさん}は＿＿＿ {山|やま}ですか。', 'どんな', 'どう | どこ | {何|なに}', 'どんな 山.'),
    ]),

    H(`${LV.de} — B. そして hay が? (12 câu)`),
    MC('lt-b4-g3-soshite', 'B. Chọn từ nối đúng', [
      Q('ここは{古|ふる}いです。＿＿＿、{有名|ゆうめい}です。', 'そして', 'が | を | どう', 'Cổ + nổi tiếng = hai ý tốt cùng chiều → そして.'),
      Q('この{町|まち}は{小|ちい}さいです＿＿、{静|しず}かです。', 'が', 'そして | を | どう', 'Nhỏ (hơi tiêu cực) → yên tĩnh (tích cực) = ngược chiều → が.'),
      Q('ここは{大|おお}きいです。＿＿＿、にぎやかです。', 'そして', 'が | を | どう', 'Lớn + nhộn nhịp: cùng chiều.'),
      Q('このカレーは{辛|から}いです＿＿、おいしいです。', 'が', 'そして | を | どう', 'Cay (khó ăn) nhưng ngon: ngược chiều.'),
      Q('この{山|やま}は{低|ひく}いです＿＿、{有名|ゆうめい}です。', 'が', 'そして | を | どう', 'Thấp nhưng nổi tiếng: ngược chiều.'),
      Q('{京都|きょうと}は{静|しず}かです。＿＿＿、きれいです。', 'そして', 'が | を | どう', 'Yên tĩnh + đẹp.'),
      Q('{町|まち}は{新|あたら}しいです＿＿、{緑|みどり}が{少|すく}ないです。', 'が', 'そして | を | どう', 'Mới (tốt) nhưng ít cây xanh (không tốt): ngược chiều.'),
      Q('ここは{寒|さむ}いです。＿＿＿、{雪|ゆき}が{多|おお}いです。', 'そして', 'が | を | どう', 'Lạnh + nhiều tuyết: cùng chiều.'),
      Q('この{公園|こうえん}は{広|ひろ}くないです＿＿、きれいです。', 'が', 'そして | を | どう', 'Không rộng (kém) nhưng đẹp (tốt): ngược chiều.'),
      Q('この{食|た}べ{物|もの}は{甘|あま}いです。＿＿＿、おいしいです。', 'そして', 'が | を | どう', 'Ngọt + ngon: cùng chiều.'),
      Q('ホイアンは{古|ふる}い{町|まち}です。＿＿＿、{夜|よる}は きれいです。', 'そして', 'が | を | どう', 'Cùng chiều.'),
      Q('この{駅|えき}は{大|おお}きくないです＿＿、きれいです。', 'が', 'そして | を | どう', 'Không lớn nhưng đẹp: ngược chiều.'),
    ]),

    H(`${LV.de} — C. Đồng tình với ね (6 câu)`),
    MC('lt-b4-g3-ne', 'C. Chọn câu đáp lại đúng', [
      Q('「{今日|きょう}は {暑|あつ}いですね。」 → Bạn cũng thấy vậy:', 'そうですね。', 'そうですか。 | そうですが。 | そうでしたね。', 'Đồng tình → **そうですね**.'),
      Q('「ここは {静|しず}かですね。」 → Bạn cũng thấy vậy:', 'そうですね。', 'そうですか。 | そうですが。 | そうですよ。', 'そうですね = ừ nhỉ.'),
      Q('「この カレーは おいしいですね。」 → Bạn đồng ý:', 'そうですね。', 'そうですか。 | そうですが。 | そうでしたか。', 'そうですね.'),
      Q('「{冬|ふゆ}は {寒|さむ}いですね。」 → Bạn đồng ý:', 'そうですね。', 'そうですか。 | そうですが。 | そうでしたね。', 'そうですね。'),
      Q('「{京都|きょうと}は {古|ふる}い{町|まち}ですね。」 → Bạn đồng ý:', 'そうですね。', 'そうですか。 | そうですが。 | そうでしたね。', 'そうですね.'),
      Q('「{山|やま}が きれいですね。」 → Bạn đồng ý:', 'ええ、そうですね。', 'ええ、そうですか。 | ええ、そうですが。 | ええ、そうでした。', 'ええ、そうですね = vâng, đúng nhỉ.'),
    ]),

    H(`${LV.vua} — D. Hỏi – đáp (8 câu)`),
    MC('lt-b4-g3-hoi-dap', 'D. Chọn câu trả lời đúng', [
      Q('「ホイアンは どんな {町|まち}ですか。」', 'きれいな{町|まち}です。', 'きれいです。 | きれいなです。 | きれいな{町|まち}ですね。', 'Trả lời どんな bằng **tính từ + danh từ**.'),
      Q('「ダナンの{夏|なつ}は どうですか。」', 'とても{暑|あつ}いです。', 'とても{暑|あつ}い{町|まち}です。 | とても{暑|あつ}くないです。 | あまり{暑|あつ}いです。', 'どう → tính từ.'),
      Q('「{京都|きょうと}は どんな ところですか。」', '{古|ふる}いお{寺|てら}が{多|おお}いところです。', '{古|ふる}いお{寺|てら}が{多|おお}いです ところ。 | {古|ふる}いお{寺|てら}が{多|おお}い です。 | {古|ふる}いお{寺|てら}を{多|おお}いところです。', 'Câu mô tả + ところ (N が A ところ).'),
      Q('「{北海道|ほっかいどう}の{冬|ふゆ}は どうですか。」', '{寒|さむ}いです。そして、{雪|ゆき}が{多|おお}いです。', '{寒|さむ}いです。が、{雪|ゆき}が{多|おお}いです。 | {寒|さむ}い{冬|ふゆ}です。 | {寒|さむ}い です と {雪|ゆき}です。', 'Lạnh + nhiều tuyết: cùng chiều → そして.'),
      Q('「この{町|まち}は どうですか。」 (nhỏ nhưng yên tĩnh)', '{小|ちい}さいですが、{静|しず}かです。', '{小|ちい}さいです。そして、{静|しず}かです。 | {小|ちい}さいがです、{静|しず}か。 | が {小|ちい}さいです、{静|しず}かです。', 'Hơi ngược chiều → が.'),
      Q('「ベトナムの{料理|りょうり}は どうですか。」', 'おいしいです。', 'おいしいです{料理|りょうり}。 | おいしいですか。 | どうですか。', 'Trả lời bằng tính từ.'),
      Q('「ホーチミンは どんな {町|まち}ですか。」', 'にぎやかな{町|まち}です。', 'にぎやかです{町|まち}。 | にぎやかい{町|まち}です。 | にぎやかの{町|まち}です。', 'にぎやか(な) + 町.'),
      Q('「{私|わたし}は {学生|がくせい}です。 マルコさんは？」 (hỏi lại)', 'マルコさんは どうですか。', 'マルコさんは どんなですか。 | マルコさんは {何|なに}ですか。 | マルコさんを どうですか。', '～は どうですか còn dùng để hỏi lại: "Còn ～ thì sao?"'),
    ]),

    H(`${LV.vua} — E. Nối hai câu (8 câu, gõ tay)`),
    QZ('lt-b4-g3-noi', 'E. Nối hai ý thành một câu / hai câu', 'translate', [
      A('Nối bằng が: 「この{町|まち}は{小|ちい}さいです。」「{有名|ゆうめい}です。」', ['この{町|まち}は{小|ちい}さいですが、{有名|ゆうめい}です。', 'この{町|まち}は{小|ちい}さいですが{有名|ゆうめい}です。'], 'が + dấu 、'),
      A('Nối bằng そして: 「ここは{静|しず}かです。」「きれいです。」', ['ここは{静|しず}かです。そして、きれいです。', 'ここは{静|しず}かです。そしてきれいです。'], 'そして、'),
      A('Nối bằng が: 「この{山|やま}は{低|ひく}いです。」「{有名|ゆうめい}です。」', ['この{山|やま}は{低|ひく}いですが、{有名|ゆうめい}です。', 'この{山|やま}は{低|ひく}いですが{有名|ゆうめい}です。']),
      A('Nối bằng そして: 「ハノイは{大|おお}きいです。」「にぎやかです。」', ['ハノイは{大|おお}きいです。そして、にぎやかです。', 'ハノイは{大|おお}きいです。そしてにぎやかです。']),
      A('Nối bằng が: 「カレーは{辛|から}いです。」「おいしいです。」', ['カレーは{辛|から}いですが、おいしいです。', 'カレーは{辛|から}いですがおいしいです。']),
      A('Nối bằng そして: 「{冬|ふゆ}は{寒|さむ}いです。」「{雪|ゆき}が{多|おお}いです。」', ['{冬|ふゆ}は{寒|さむ}いです。そして、{雪|ゆき}が{多|おお}いです。', '{冬|ふゆ}は{寒|さむ}いです。そして{雪|ゆき}が{多|おお}いです。']),
      A('Nối bằng が: 「{町|まち}は{新|あたら}しいです。」「{緑|みどり}が{少|すく}ないです。」', ['{町|まち}は{新|あたら}しいですが、{緑|みどり}が{少|すく}ないです。', '{町|まち}は{新|あたら}しいですが{緑|みどり}が{少|すく}ないです。']),
      A('Nối bằng そして: 「{京都|きょうと}は{古|ふる}いです。」「{有名|ゆうめい}です。」', ['{京都|きょうと}は{古|ふる}いです。そして、{有名|ゆうめい}です。', '{京都|きょうと}は{古|ふる}いです。そして{有名|ゆうめい}です。']),
    ]),

    H(`${LV.vua} — F. Ghép câu (8 câu)`),
    BUILD('lt-b4-g3-ghep', 'F. Sắp xếp các mảnh thành câu', [
      BD('Hội An là thành phố như thế nào?', 'ホイアン は どんな {町|まち} です か。', ['どう', 'どこ']),
      BD('Mùa hè ở Đà Nẵng thế nào?', 'ダナン の {夏|なつ} は どう です か。', ['どんな', '{何|なに}']),
      BD('Nơi này yên tĩnh. Và đẹp nữa.', 'ここ は {静|しず}か です。 そして、 きれい です。', ['が、']),
      BD('Thành phố này nhỏ nhưng nổi tiếng.', 'この {町|まち} は {小|ちい}さい です が、 {有名|ゆうめい} です。', ['そして、']),
      BD('Hôm nay nóng nhỉ.', '{今日|きょう} は {暑|あつ}い です ね。', ['が', 'を']),
      BD('Ừ, đúng nhỉ.', 'ええ、 そう です ね。', ['か', 'が']),
      BD('Món cà ri này cay nhưng ngon.', 'この カレー は {辛|から}い です が、 おいしい です。', ['そして、']),
      BD('Kyoto là thành phố cổ kính và nổi tiếng.', '{京都|きょうと} は {古|ふる}い {町|まち} です。 そして、 {有名|ゆうめい} です。', ['が、']),
    ]),

    H(`${LV.vua} — G. Hội thoại ngắn: điền chỗ trống (6 câu)`),
    MC('lt-b4-g3-hoi-thoai', 'G. Điền câu hợp lý vào hội thoại', [
      Q('A：ホイアンは どんな {町|まち}ですか。 B：＿＿＿', '{古|ふる}い{町|まち}です。', 'きれいです{町|まち}です。 | とても{古|ふる}いですか。 | どうですか。', 'Hỏi どんな 町 → trả lời **tính từ + 町**.'),
      Q('A：{今日|きょう}は {寒|さむ}いですね。 B：＿＿＿', 'ええ、そうですね。', 'ええ、そうですか。 | ええ、どうですか。 | ええ、どんなですか。', 'Đồng tình = そうですね.'),
      Q('A：{冬|ふゆ}は どうですか。 B：＿＿＿', '{寒|さむ}いです。そして、{雪|ゆき}が{多|おお}いです。', '{寒|さむ}い{冬|ふゆ}です と。 | どんな {寒|さむ}いです。 | が {寒|さむ}いです。', 'どう → trả lời tính từ + (そして／が) thêm ý.'),
      Q('A：この ビルは {大|おお}きいですか。 B：いいえ、＿＿＿ {新|あたら}しいです。', '{大|おお}きくないですが、', '{大|おお}きいですが、 | {大|おお}きくないです。そして、 | {大|おお}きくないから、', 'Không lớn (kém) nhưng mới (tốt) → が.'),
      Q('A：ダナンの{夏|なつ}は どうですか。 B：＿＿＿', 'とても{暑|あつ}いです。', 'とても{暑|あつ}くないです。 | とても{暑|あつ}いです ね か。 | とても{暑|あつ}いです です。', 'とても + khẳng định.'),
      Q('A：ここは どんな ところですか。 B：＿＿＿ ところです。', '{静|しず}かな', '{静|しず}か | {静|しず}かい | {静|しず}かが', 'Tính từ な + な + ところ.'),
    ]),

    H(`${LV.kho} — H. Tìm câu SAI (8 câu)`),
    MC('lt-b4-g3-sai', 'H. Câu nào SAI?', [
      Q('Câu nào SAI?', '「ホイアンは どんな {町|まち}ですか。」「きれいです{町|まち}です。」', '「ホイアンは どんな {町|まち}ですか。」「きれいな{町|まち}です。」 | 「ホイアンは どんな {町|まち}ですか。」「{古|ふる}い{町|まち}です。」 | 「ホイアンは どんな {町|まち}ですか。」「{小|ちい}さい{町|まち}です。」', 'Phải bỏ です: きれい**な** 町.'),
      Q('Câu nào SAI?', 'ベトナムの{夏|なつ}は どんなですか。', 'ベトナムの{夏|なつ}は どうですか。 | ベトナムは どんな{国|くに}ですか。 | ハノイは どんな{町|まち}ですか。', 'どんな phải có danh từ phía sau.'),
      Q('Câu nào SAI?', 'が、この{町|まち}は{小|ちい}さいです。', 'この{町|まち}は{小|ちい}さいですが、{有名|ゆうめい}です。 | この{町|まち}は{小|ちい}さいです。そして、きれいです。 | この{町|まち}は{小|ちい}さいですが、{静|しず}かです。', 'が không đứng đầu câu; đặt ngay sau です.'),
      Q('Câu nào SAI?', '「{暑|あつ}いですね。」「そうですが。」', '「{暑|あつ}いですね。」「そうですね。」 | 「{寒|さむ}いですね。」「ええ、そうですね。」 | 「きれいですね。」「そうですね。」', 'Đồng tình = そうですね (không phải そうですが).'),
      Q('Câu nào SAI?', 'この{山|やま}は どんなですか。', 'この{山|やま}は どんな{山|やま}ですか。 | この{山|やま}は どうですか。 | この{山|やま}は {高|たか}いですか。', 'どんな phải có danh từ đi sau.'),
      Q('Câu nào SAI?', 'ここは{静|しず}かですが、{有名|ゆうめい}じゃありませんが。', 'ここは{静|しず}かですが、{有名|ゆうめい}じゃありません。 | ここは{静|しず}かです。そして、{有名|ゆうめい}です。 | ここは{静|しず}かですが、きれいです。', 'Không có が thừa ở cuối câu.'),
      Q('Câu nào SAI?', 'この{町|まち}は{大|おお}きいですが、そして、にぎやかです。', 'この{町|まち}は{大|おお}きいです。そして、にぎやかです。 | この{町|まち}は{大|おお}きくないですが、にぎやかです。 | この{町|まち}は{大|おお}きいですが、{静|しず}かです。', 'Không dùng が và そして cùng lúc.'),
      Q('Câu nào SAI?', 'ダナンの{夏|なつ}は どう{町|まち}ですか。', 'ダナンの{夏|なつ}は どうですか。 | ダナンは どんな{町|まち}ですか。 | ダナンは どうですか。', 'どう + danh từ là sai, phải dùng どんな + danh từ.'),
    ]),
  ],
};

/* ───────── 6. NGỮ PHÁP 4 — TRỘN ポイント 24–36 ───────── */

const B4_TRON: Lesson = {
  id: 'lt-b4-ngu-phap-tron',
  kind: 'grammar',
  title: 'Luyện thêm Bài 4 — Ngữ pháp trộn: trợ từ · từ để hỏi · chọn đáp án · chia từ · sửa câu · dịch (đúng form đề)',
  goal: 'Làm bài ngữ pháp Bài 4 như đề thi: nhiều ポイント trộn trong cùng một phần — điền trợ từ (có X), chọn từ để hỏi, chọn đáp án, chia từ, tìm câu sai và dịch hai chiều.',
  minutes: 70,
  blocks: [
    NOTE('Cách học bài này', [
      'Đây là bài **trộn**: đừng làm khi chưa xong ba bài ngữ pháp 1–3. Làm từng phần như một đề: giới hạn thời gian 20 phút cho mỗi mức.',
      'Khi điền trợ từ, **luôn hỏi "ô này cần trợ từ không?"**. Đề thi có chỗ phải điền **X** (không cần trợ từ), ví dụ sau 歩いて, sau 冬、一年中 (đứng trước dấu 、).',
      'Lỗi hay mắc: nhầm **どんな** (cần danh từ) với **どう**; bỏ quên **な** sau tính từ な; viết ~~いくない~~; để **あまり** đi với câu khẳng định.',
    ]),

    H(`${LV.de} — A. Điền trợ từ (có X) (14 câu)`),
    MC('lt-b4-tr-tro-tu', 'A. Chọn trợ từ đúng — X nghĩa là không cần điền', [
      Q('ハノイ＿＿ ベトナムの{北|きた}です。', 'は', 'を | で | X', 'N は N の 北 です.'),
      Q('ハノイは ベトナム＿＿ {北|きた}です。', 'の', 'は | に | X', 'Nước の hướng.'),
      Q('{箱根|はこね}＿＿ {温泉|おんせん}があります。', 'に', 'で | を | X', 'Nơi tồn tại: に.'),
      Q('{箱根|はこね}に{温泉|おんせん}＿＿ あります。', 'が', 'を | に | X', 'Vật tồn tại: が.'),
      Q('{東京|とうきょう}から{京都|きょうと}＿＿ {二時間半|にじかんはん}くらいです。', 'まで', 'から | で | X', 'から … まで.'),
      Q('{新幹線|しんかんせん}＿＿ {京都|きょうと}へ{行|い}きます。', 'で', 'を | が | X', 'Phương tiện + で.'),
      Q('{歩|ある}いて＿＿ {学校|がっこう}へ{行|い}きます。', 'X', 'で | を | に', '歩いて không thêm で.'),
      Q('ハノイは{冬|ふゆ}＿＿、{少|すこ}し{寒|さむ}いです。', 'X', 'の | に | を', 'Mùa + 、 (không cần trợ từ).'),
      Q('ベトナム＿＿ {夏|なつ}は{暑|あつ}いです。', 'の', 'は | が | X', 'ベトナムの夏 (danh từ の danh từ).'),
      Q('この{町|まち}は{緑|みどり}＿＿ {多|おお}いです。', 'が', 'を | に | X', 'N1 は N2 が A.'),
      Q('ダナンは{一年中|いちねんじゅう}＿＿、{暑|あつ}いです。', 'X', 'は | に | を', '一年中 không cần trợ từ.'),
      Q('{富士山|ふじさん}は{高|たか}い＿＿ {山|やま}です。', 'X', 'な | の | が', 'Tính từ い đứng thẳng trước danh từ.'),
      Q('ここは{静|しず}か＿＿ ところです。', 'な', 'の | い | X', 'Tính từ な + な + danh từ.'),
      Q('うち＿＿ {学校|がっこう}まで{二十分|にじゅっぷん}です。', 'から', 'まで | で | X', 'から (xuất phát) … まで.'),
    ]),

    H(`${LV.vua} — B. Từ để hỏi (12 câu)`),
    MC('lt-b4-tr-hoi', 'B. Nhìn câu trả lời để chọn từ để hỏi', [
      Q('A：ダナンは＿＿＿ですか。 B：ベトナムの{真|ま}ん{中|なか}です。', 'どこ', 'どう | どんな | {何|なん}', 'Trả lời bằng vị trí → どこ.'),
      Q('A：ダナンの{夏|なつ}は＿＿＿ですか。 B：とても{暑|あつ}いです。', 'どう', 'どこ | どんな | {何|なん}', 'Trả lời bằng tính từ, hỏi cảm nhận → どう.'),
      Q('A：ダナンは＿＿＿ {町|まち}ですか。 B：きれいな{町|まち}です。', 'どんな', 'どう | どこ | {何|なん}', 'Có 町 → どんな.'),
      Q('A：{箱根|はこね}に＿＿＿ ありますか。 B：{温泉|おんせん}があります。', '{何|なに}が', '{何|なに}を | どこが | どうが', '何が ありますか = có gì?'),
      Q('A：うちから{学校|がっこう}まで＿＿＿ですか。 B：{二十分|にじゅっぷん}です。', 'どのくらい', 'どう | どんな | どこ', 'Thời gian → どのくらい.'),
      Q('A：＿＿＿ で {行|い}きますか。 B：{電車|でんしゃ}で{行|い}きます。', '{何|なん}', 'どう | どんな | どこ', '何で = bằng phương tiện gì.'),
      Q('A：お{国|くに}は＿＿＿ですか。 B：ベトナムです。', 'どちら', 'どう | どんな | どれ', 'Hỏi nước lịch sự → どちら.'),
      Q('A：{大阪|おおさか}は{東京|とうきょう}の＿＿＿ですか。 B：{西|にし}です。', 'どこ', 'どう | どんな | {何|なに}', 'Hỏi vị trí/hướng → どこ.'),
      Q('A：この{料理|りょうり}は＿＿＿ですか。 B：{辛|から}いです。', 'どう', 'どこ | どんな | {何|なに}', 'Hỏi vị → どう.'),
      Q('A：{京都|きょうと}は＿＿＿ ところですか。 B：{古|ふる}いお{寺|てら}が{多|おお}いところです。', 'どんな', 'どう | どこ | {何|なん}', 'どんな ところ.'),
      Q('A：この{町|まち}の{冬|ふゆ}は＿＿＿ですか。 B：{寒|さむ}いです。', 'どう', 'どんな | どこ | {何|なん}', 'どう.'),
      Q('A：あなたの{町|まち}は＿＿＿ ところですか。 B：{静|しず}かなところです。', 'どんな', 'どう | どこ | {何|なん}', 'どんな ところ.'),
    ]),

    H(`${LV.vua} — C. Chọn đáp án đúng (ngữ pháp + từ vựng) (12 câu)`),
    MC('lt-b4-tr-chon', 'C. Chọn đáp án đúng nhất', [
      Q('この{公園|こうえん}は あまり＿＿＿。', '{広|ひろ}くないです', '{広|ひろ}いです | {広|ひろ}いくないです | {広|ひろ}かったです', 'あまり + phủ định (くない).'),
      Q('{奈良|なら}には＿＿＿ お{寺|てら}が{多|おお}いです。', '{古|ふる}い', '{古|ふる}いな | {古|ふる}く | {古|ふる}かった', 'い + danh từ.'),
      Q('{冬|ふゆ}、{北海道|ほっかいどう}は＿＿＿ {雪|ゆき}が{多|おお}いです。', 'とても', 'あまり | どう | どんな', 'Khẳng định → とても.'),
      Q('この ラーメンは＿＿＿です。 (vừa nấu xong)', '{熱|あつ}い', '{暑|あつ}い | {寒|さむ}い | {涼|すず}しい', 'Đồ ăn nóng → 熱い.'),
      Q('{私|わたし}の{町|まち}に{駅|えき}＿＿＿ ありません。', 'が', 'を | で | へ', 'に … が ありません.'),
      Q('A：{暑|あつ}いですね。 B：＿＿＿', 'ええ、そうですね。', 'ええ、そうですか。 | ええ、どうですか。 | ええ、どんなですか。', 'Đồng tình.'),
      Q('{奈良|なら}は{小|ちい}さい{町|まち}です＿＿＿、{有名|ゆうめい}です。', 'が', 'そして | を | と', 'Nhỏ nhưng nổi tiếng.'),
      Q('{京都|きょうと}は {古|ふる}い{町|まち}です。＿＿＿、きれいです。', 'そして', 'が | を | どう', 'Cổ + đẹp: cùng chiều.'),
      Q('{横浜|よこはま}は {東京|とうきょう}の＿＿＿です。 (cách Tokyo khoảng 30 phút về phía nam)', '{南|みなみ}', '{北|きた} | {西|にし} | {真|ま}ん{中|なか}', 'Yokohama ở phía nam Tokyo.'),
      Q('{学校|がっこう}から{駅|えき}まで＿＿＿ {五分|ごふん}です。', '{歩|ある}いて', '{歩|ある}いで | {歩|ある}く | {歩|ある}きます', '歩いて (đi bộ) + thời gian.'),
      Q('{日光|にっこう}は {東京|とうきょう}の＿＿＿ です。 (phía có núi và đền, đi tàu khoảng 2 tiếng)', '{北|きた}', '{南|みなみ} | {西|にし} | {東|ひがし}', 'Nikko ở phía bắc Tokyo.'),
      Q('A：{京都|きょうと}は どんな {町|まち}ですか。 B：＿＿＿', '{古|ふる}い{町|まち}です。', '{古|ふる}いです {町|まち}。 | {古|ふる}く{町|まち}です。 | {古|ふる}いな{町|まち}です。', 'Tính từ い + 町.'),
    ]),

    H(`${LV.vua} — D. Chia từ trong ngoặc (10 câu, gõ tay)`),
    QZ('lt-b4-tr-chia', 'D. Điền dạng đúng của từ trong ngoặc', 'fill', [
      A('{京都|きょうと}は（{静|しず}か）{町|まち}です。', '{静|しず}かな', 'tính từ な + 名詞'),
      A('ここは（きれい）ところです。', 'きれいな'),
      A('あれは（{古|ふる}い）お{寺|てら}です。', '{古|ふる}い', 'tính từ い: giữ nguyên'),
      A('あれは（{有名|ゆうめい}です）お{寺|てら}です。', '{有名|ゆうめい}な', 'trước danh từ'),
      A('{今日|きょう}は{天気|てんき}が あまり（いいです）。', ['よくないです', 'よくありません']),
      A('この{町|まち}は（にぎやかです）ところです。', 'にぎやかな'),
      A('ここに{川|かわ}が（あります）。 (phủ định)', 'ありません'),
      A('{町|まち}は あまり（{静|しず}かです）。', NN('{静|しず}か')),
      A('この カレーは あまり（おいしいです）。', NI('おいし')),
      A('この{町|まち}は{人|ひと}が あまり（{多|おお}いです）。', NI('{多|おお}')),
    ]),

    H(`${LV.kho} — E. Tìm câu SAI (8 câu)`),
    MC('lt-b4-tr-sai', 'E. Câu nào SAI?', [
      Q('Câu nào SAI?', 'ベトナムは {夏|なつ}を、{暑|あつ}いです。', 'ベトナムは {夏|なつ}、{暑|あつ}いです。 | ベトナムの {夏|なつ}は {暑|あつ}いです。 | ベトナムは {一年中|いちねんじゅう}、{暑|あつ}いです。', 'Mùa không cần trợ từ を.'),
      Q('Câu nào SAI?', 'この{町|まち}は{静|しず}かいです。', 'この{町|まち}は{静|しず}かです。 | この{町|まち}は{静|しず}かな{町|まち}です。 | この{町|まち}は{静|しず}かじゃありません。', '静か + い là sai (tính từ な).'),
      Q('Câu nào SAI?', '{富士山|ふじさん}は あまり{高|たか}いです。', '{富士山|ふじさん}は とても{高|たか}いです。 | {富士山|ふじさん}は あまり{高|たか}くないです。 | {富士山|ふじさん}は {少|すこ}し{高|たか}いです。', 'あまり + khẳng định là sai.'),
      Q('Câu nào SAI?', 'うちから{駅|えき}を{歩|ある}いて{十分|じゅっぷん}です。', 'うちから{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}です。 | うちから{学校|がっこう}まで{十分|じゅっぷん}です。 | ハノイからダナンまで{二時間|にじかん}です。', 'から … まで, không dùng を.'),
      Q('Câu nào SAI?', '{京都|きょうと}は {有名|ゆうめい}い {町|まち}です。', '{京都|きょうと}は {有名|ゆうめい}な {町|まち}です。 | {京都|きょうと}は {古|ふる}い {町|まち}です。 | {京都|きょうと}は {静|しず}かな {町|まち}です。', '有名 là tính từ な → 有名な 町.'),
      Q('Câu nào SAI?', 'この{町|まち}は どんなですか。', 'この{町|まち}は どんな{町|まち}ですか。 | この{町|まち}は どうですか。 | この{町|まち}は {大|おお}きいですか。', 'どんな + danh từ.'),
      Q('Câu nào SAI?', '{箱根|はこね}で{温泉|おんせん}があります。', '{箱根|はこね}に{温泉|おんせん}があります。 | {箱根|はこね}に{何|なに}がありますか。 | {箱根|はこね}に{温泉|おんせん}がありません。', 'に … が あります.'),
      Q('Câu nào SAI?', 'ハノイはベトナム{北|きた}です。', 'ハノイはベトナムの{北|きた}です。 | ホーチミンはベトナムの{南|みなみ}です。 | ダナンはベトナムの{真|ま}ん{中|なか}です。', 'Thiếu の.'),
    ]),

    H(`${LV.kho} — F. Dịch Việt → Nhật (8 câu)`),
    QZ('lt-b4-tr-dich', 'F. Dịch sang tiếng Nhật', 'translate', [
      A('Ở thành phố tôi có một ngôi chùa cổ.', ['{私|わたし}の{町|まち}に{古|ふる}いお{寺|てら}があります。', '{私|わたし}の{町|まち}に{古|ふる}い{寺|てら}があります。']),
      A('Từ ga đến trường đi bộ khoảng 15 phút.', ['{駅|えき}から{学校|がっこう}まで{歩|ある}いて{十五分|じゅうごふん}くらいです。', '{駅|えき}から{学校|がっこう}まで{歩|ある}いて{十五分|じゅうごふん}です。']),
      A('Hà Nội mùa đông không lạnh lắm.', ['ハノイは{冬|ふゆ}、あまり{寒|さむ}くないです。', 'ハノイは{冬|ふゆ}、あまり{寒|さむ}くありません。']),
      A('Kyoto là thành phố cổ và nổi tiếng. (nối bằng そして)', ['{京都|きょうと}は{古|ふる}い{町|まち}です。そして、{有名|ゆうめい}です。', '{京都|きょうと}は{古|ふる}い{町|まち}です。そして{有名|ゆうめい}です。']),
      A('Quê bạn là nơi như thế nào?', ['お{国|くに}はどんなところですか。', 'あなたの{町|まち}はどんなところですか。', 'あなたの{国|くに}はどんなところですか。']),
      A('Từ Tokyo đến Osaka đi Shinkansen khoảng ba tiếng.', ['{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}で{三時間|さんじかん}くらいです。', '{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}で{三時間|さんじかん}です。']),
      A('Thành phố này nhỏ nhưng nhiều cây xanh.', ['この{町|まち}は{小|ちい}さいですが、{緑|みどり}が{多|おお}いです。', 'この{町|まち}は{小|ちい}さいですが{緑|みどり}が{多|おお}いです。']),
      A('Hôm nay nóng nhỉ. – Ừ, đúng nhỉ.', ['{今日|きょう}は{暑|あつ}いですね。ええ、そうですね。', '{今日|きょう}は{暑|あつ}いですね。そうですね。']),
    ], 'Dùng đủ: に…があります · の + hướng · から…まで · あまり + phủ định · そして／が · ね'),

    H(`${LV.kho} — G. Nhật → Việt (6 câu)`),
    MC('lt-b4-tr-hieu', 'G. Chọn bản dịch đúng', [
      Q('{私|わたし}の{町|まち}は{大|おお}きくないですが、{緑|みどり}が{多|おお}いです。', 'Thành phố tôi không lớn nhưng nhiều cây xanh.', 'Thành phố tôi lớn và nhiều cây xanh. | Thành phố tôi nhỏ và ít cây xanh. | Thành phố tôi không có cây xanh.', '大きくない + が + 緑が多い.'),
      Q('{冬|ふゆ}、{京都|きょうと}は{寒|さむ}いです。そして、{雪|ゆき}が{少|すく}ないです。', 'Mùa đông Kyoto lạnh. Và ít tuyết.', 'Mùa đông Kyoto nóng và nhiều tuyết. | Mùa đông Kyoto lạnh nên nhiều tuyết. | Mùa hè Kyoto lạnh.', '寒い + 雪が少ない.'),
      Q('{駅|えき}から{学校|がっこう}まで{電車|でんしゃ}で{十五分|じゅうごふん}くらいです。', 'Từ ga đến trường đi tàu điện khoảng 15 phút.', 'Từ trường đến ga đi bộ 15 phút. | Từ ga đến trường mất 50 phút. | Đi tàu 15 tiếng.', '電車で + 十五分.'),
      Q('{箱根|はこね}に{温泉|おんせん}と{神社|じんじゃ}が あります。', 'Ở Hakone có suối nước nóng và đền.', 'Hakone là tên của một ngôi đền. | Hakone có suối nước nóng nhưng không có đền. | Tôi đi suối nước nóng ở Hakone.', 'と = liệt kê (và …).'),
      Q('{沖縄|おきなわ}は {日本|にほん}の{南|みなみ}です。{冬|ふゆ}も あまり{寒|さむ}くないです。', 'Okinawa ở phía nam Nhật. Mùa đông cũng không lạnh lắm.', 'Okinawa ở phía bắc Nhật. Mùa đông rất lạnh. | Okinawa ở phía đông Nhật. Mùa đông tuyết nhiều. | Okinawa lạnh quanh năm.', '南 + 寒くない.'),
      Q('{町|まち}の{北|きた}に {山|やま}があります。{山|やま}は {高|たか}くないですが、{有名|ゆうめい}です。', 'Ở phía bắc thành phố có núi. Núi không cao nhưng nổi tiếng.', 'Ở phía nam thành phố có núi cao. | Núi rất cao và nổi tiếng. | Núi thấp và không ai biết.', '高くない + が + 有名.'),
    ]),

    H(`${LV.kho} — H. Đọc hiểu có chỗ trống (6 câu, như phần V đề cuối kỳ)`),
    PASSAGE('私の町', [
      '{私|わたし}の {町|まち}は ダナン です。 ベトナム の （①） です。 ダナン は {海|うみ}が きれい です。 （②）、 {山|やま}も あります。 {町|まち}は {大|おお}きく ありません（③）、 にぎやか です。 ダナン の {夏|なつ}は （④） {暑|あつ}い です。 {冬|ふゆ}は （⑤） {寒|さむ}くない です。',
    ], 'Đọc đoạn văn rồi chọn từ cho các chỗ trống.'),
    MC('lt-b4-tr-doan', 'H. Điền ① ～ ⑤ và một câu hiểu', [
      Q('① に入る言葉は？', '{真|ま}ん{中|なか}', '{北|きた} | {南|みなみ} | {西|にし}', 'Đà Nẵng ở miền Trung.'),
      Q('② に入る言葉は？', 'そして', 'が | どう | どんな', 'Biển đẹp + núi nữa: cùng chiều.'),
      Q('③ に入る言葉は？', 'が', 'そして | を | と', 'Không lớn nhưng nhộn nhịp: ngược chiều.'),
      Q('④ に入る言葉は？', 'とても', 'あまり | どう | どんな', 'Cuối câu 暑い (khẳng định).'),
      Q('⑤ に入る言葉は？', 'あまり', 'とても | どう | どんな', 'Cuối câu 寒くない (phủ định).'),
      Q('ダナンは どんな {町|まち}ですか。', '{海|うみ}がきれいな{町|まち}', '{冬|ふゆ}がとても{寒|さむ}い{町|まち} | {山|やま}が{高|たか}い{町|まち} | とても{大|おお}きい{町|まち}', 'Bài nói: 海がきれいです (biển đẹp).'),
    ]),

    H(`${LV.kho} — I. Ghép câu dài (8 câu)`),
    BUILD('lt-b4-tr-ghep', 'I. Sắp xếp các mảnh thành câu (câu dài hơn)', [
      BD('Ở thành phố tôi có một ngôi chùa cổ. Và nó nổi tiếng.', '{私|わたし}の {町|まち} に {古|ふる}い お{寺|てら} が あります。 そして、 {有名|ゆうめい} です。', ['が、']),
      BD('Từ ga đến nhà tôi đi bộ khoảng 15 phút.', '{駅|えき} から うち まで {歩|ある}いて {十五分|じゅうごふん} くらい です。', ['で']),
      BD('Hà Nội mùa đông không lạnh lắm nhưng mùa hè rất nóng.', 'ハノイ は {冬|ふゆ}、 あまり {寒|さむ}くない です が、 {夏|なつ}、 とても {暑|あつ}い です。', ['そして、']),
      BD('Kyoto ở phía tây Tokyo. Là thành phố cổ.', '{京都|きょうと} は {東京|とうきょう} の {西|にし} です。 {古|ふる}い {町|まち} です。', ['に']),
      BD('Quê tôi là nơi yên tĩnh. Ở đó có núi và sông.', '{私|わたし}の {町|まち} は {静|しず}かな ところ です。 {山|やま} と {川|かわ} が あります。', ['で']),
      BD('Mùa hè ở Hokkaido không nóng lắm.', '{北海道|ほっかいどう} は {夏|なつ}、 あまり {暑|あつ}くない です。', ['とても']),
      BD('Từ Tokyo đến Osaka đi Shinkansen khoảng ba tiếng.', '{東京|とうきょう} から {大阪|おおさか} まで {新幹線|しんかんせん} で {三時間|さんじかん} くらい です。', ['を']),
      BD('Hôm nay nóng nhỉ. Ừ, đúng nhỉ.', '{今日|きょう} は {暑|あつ}い です ね。 ええ、 そう です ね。', ['が']),
    ]),
  ],
};

/* ───────── 7. HỘI THOẠI ───────── */

const B4_HOI_THOAI: Lesson = {
  id: 'lt-b4-hoi-thoai',
  kind: 'conversation',
  title: 'Luyện thêm Bài 4 — Hội thoại: 6 đoạn mới (quê quán · thành phố · thời tiết · món ăn · đi lại · có gì) + tự nói',
  goal: 'Hiểu, điền, sắp xếp lượt thoại và tự nói được các hội thoại quanh quê quán, thành phố, thời tiết, món ăn và thời gian đi lại — với nhân vật quen thuộc của sách.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      'Mỗi hội thoại: ① **nghe/đọc cả đoạn** (bật romaji nếu cần) ② trả lời câu hỏi hiểu ③ làm bài điền ④ **sắp lượt thoại** ⑤ che lời thoại, **đóng vai một người** và nói lại.',
      'Đóng vai là cách nhanh nhất để thi nói: bạn học thuộc **khung hỏi – đáp** thay vì từng chữ. Thay từ trong khung bằng quê quán của chính bạn.',
      'Lỗi hay mắc: trả lời **どんな** bằng một tính từ trơ trọi; dùng **で** sau 歩いて; quên **の** giữa nước và hướng; trả lời câu có **ね** bằng そうですか thay vì そうですね.',
    ]),
    TABLE(
      ['Hội thoại', 'Người nói', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'マルコ ↔ パク', 'Quê Ý ở đâu, bay bao lâu', 'どちら · の + hướng · から～まで'],
        ['2', 'ワン ↔ ナタポン', 'Chiang Mai thế nào', 'どんな · あまり + phủ định · が'],
        ['3', 'アンナ ↔ ダニエル', 'Mùa đông / mùa hè', 'どう · とても · あまり · そして'],
        ['4', 'リン ↔ パク', 'Món ăn Hàn – Việt', '辛い · 熱い／暑い · が'],
        ['5', '西川先生 ↔ ダニエル', 'Từ nhà đến trường', '歩いて · 電車で · 分'],
        ['6', '木村 ↔ リン', 'Đà Nẵng có gì', 'に～があります · ね'],
      ],
    ),

    H(`${LV.de} — Hội thoại 1: Quê ở đâu, bay bao lâu`),
    DLG('Hội thoại 1 — マルコさんの国', [
      D('パク', 'f', '^マルコ-さん、 お{国|くに} は どちら です か。', 'Anh Marco, quê anh ở đâu?'),
      D('マルコ', 'm', 'イタリア です。 ミラノ です。', 'Ý. Là Milan.'),
      D('パク', 'f', 'ミラノ は イタリア の どこ です か。', 'Milan ở đâu của nước Ý?'),
      D('マルコ', 'm', 'イタリア の {北|きた} です。', 'Ở phía bắc nước Ý.'),
      D('パク', 'f', 'そう です か。 {日本|にほん} から ミラノ まで どのくらい です か。', 'Vậy à. Từ Nhật đến Milan mất bao lâu?'),
      D('マルコ', 'm', '{飛行機|ひこうき} で {十二時間|じゅうにじかん} くらい です。', 'Đi máy bay khoảng 12 tiếng.'),
      D('パク', 'f', 'へえ、 {大|おお}きい {町|まち} です か。', 'Ồ, là thành phố lớn à?'),
      D('マルコ', 'm', 'いいえ、 あまり {大|おお}きくない です が、 {有名|ゆうめい}な {教会|きょうかい} が あります。', 'Không, không lớn lắm nhưng có một nhà thờ nổi tiếng.'),
    ]),
    MC('lt-b4-ht-1', 'Hiểu hội thoại 1 và điền chỗ trống (6 câu)', [
      Q('マルコさんの{国|くに}は？', 'イタリア', 'フランス | スペイン | ギリシャ', 'イタリアです。'),
      Q('ミラノは イタリアの どこですか。', '{北|きた}', '{南|みなみ} | {西|にし} | {真|ま}ん{中|なか}', 'イタリアの北.'),
      Q('{日本|にほん}からミラノまで {飛行機|ひこうき}で どのくらいですか。', '{十二時間|じゅうにじかん}くらい', '{二十分|にじゅっぷん}くらい | {二時間|にじかん}くらい | {十二日|じゅうににち}くらい', '十二時間 = じゅうにじかん.'),
      Q('ミラノは どんな {町|まち}ですか。', 'あまり{大|おお}きくないですが、{有名|ゆうめい}な{教会|きょうかい}があります', '{大|おお}きい{町|まち}で{温泉|おんせん}が{多|おお}いです | とても{大|おお}きい{町|まち}です | {小|ちい}さい{町|まち}で{緑|みどり}が{多|おお}いです', 'あまり大きくない + が + 有名な教会.'),
      Q('パク：ミラノは イタリアの＿＿＿ですか。', 'どこ', 'どう | どんな | {何|なに}', 'Hỏi vị trí/hướng → どこ.'),
      Q('マルコ：いいえ、あまり{大|おお}きくない＿＿＿、{有名|ゆうめい}な{教会|きょうかい}があります。', 'ですが', 'です。そして | ですから | です', 'Không lớn (kém) nhưng có nhà thờ nổi tiếng (tốt) → が.'),
    ]),
    BUILD('lt-b4-ht-1-xep', 'Sắp xếp lượt thoại 1 cho đúng thứ tự', [
      BDT('Hỏi quê ở đâu → trả lời → hỏi vị trí → trả lời.', [
        '^マルコ-さん、 お{国|くに} は どちら です か。',
        'イタリア です。 ミラノ です。',
        'ミラノ は イタリア の どこ です か。',
        'イタリア の {北|きた} です。',
      ]),
    ]),

    H(`${LV.de} — Hội thoại 2: Chiang Mai là nơi thế nào`),
    DLG('Hội thoại 2 — ナタポンさんの町', [
      D('ワン', 'f', '^ナタポン-さん の {町|まち} は どんな ところ です か。', 'Thành phố của anh Natapon là nơi như thế nào?'),
      D('ナタポン', 'm', 'チェンマイ です。 タイ の {北|きた} です。 {山|やま} が {多|おお}い です。 そして、 {古|ふる}い お{寺|てら} も あります。', 'Là Chiang Mai. Ở phía bắc Thái Lan. Nhiều núi. Và cũng có chùa cổ.'),
      D('ワン', 'f', 'きれいな ところ です ね。 {大|おお}きい です か。', 'Là nơi đẹp nhỉ. Có lớn không?'),
      D('ナタポン', 'm', 'いいえ、 あまり {大|おお}きくない です が、 にぎやか です。', 'Không, không lớn lắm nhưng nhộn nhịp.'),
      D('ワン', 'f', 'そう です か。 いい ところ です ね。', 'Vậy à. Là nơi tốt nhỉ.'),
    ]),
    MC('lt-b4-ht-2', 'Hiểu hội thoại 2 và điền chỗ trống (6 câu)', [
      Q('チェンマイは タイの どこですか。', '{北|きた}', '{南|みなみ} | {東|ひがし} | {真|ま}ん{中|なか}', 'タイの北.'),
      Q('チェンマイに 多いのは？', '{山|やま}', '{海|うみ} | {川|かわ} | {温泉|おんせん}', '山が多い.'),
      Q('チェンマイに あるものは？', '{古|ふる}いお{寺|てら}', '{高|たか}いビル | {新幹線|しんかんせん} | {教会|きょうかい}', '古いお寺もあります.'),
      Q('チェンマイは 大きいですか。', 'いいえ、あまり{大|おお}きくないです', 'はい、とても{大|おお}きい | はい、{少|すこ}し{大|おお}きい | いいえ、とても{小|ちい}さい', 'あまり大きくない.'),
      Q('ワン：＿＿＿ ところですね。 (nhận xét: nơi đẹp)', 'きれいな', 'きれい | きれいい | きれくないです', 'きれいな + ところ.'),
      Q('ナタポン：{大|おお}きくないです＿＿＿、にぎやかです。', 'が', 'そして | を | に', 'Không lớn nhưng nhộn nhịp: が.'),
    ]),
    BUILD('lt-b4-ht-2-xep', 'Sắp xếp lượt thoại 2 cho đúng thứ tự', [
      BDT('Hỏi như thế nào → trả lời → hỏi có lớn không → trả lời.', [
        '^ナタポン-さん の {町|まち} は どんな ところ です か。',
        'チェンマイ です。 タイ の {北|きた} です。',
        '{大|おお}きい です か。',
        'いいえ、 あまり {大|おお}きくない です が、 にぎやか です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 3: Mùa đông và mùa hè`),
    DLG('Hội thoại 3 — モスクワとパース', [
      D('ダニエル', 'm', 'アンナ-さん、 モスクワ の {冬|ふゆ} は どう です か。', 'Anna, mùa đông ở Moscow thế nào?'),
      D('アンナ', 'f', 'とても {寒|さむ}い です。 そして、 {雪|ゆき} が {多|おお}い です。 ダニエル-さん の パース は どう です か。', 'Rất lạnh. Và nhiều tuyết. Còn Perth của anh Daniel thì sao?'),
      D('ダニエル', 'm', 'パース の {冬|ふゆ} は あまり {寒|さむ}くない です が、 {夏|なつ} は とても {暑|あつ}い です。', 'Mùa đông ở Perth không lạnh lắm nhưng mùa hè rất nóng.'),
      D('アンナ', 'f', 'いい です ね。 モスクワ の {夏|なつ} は あまり {暑|あつ}くない です。 {涼|すず}しい です。', 'Hay nhỉ. Mùa hè ở Moscow không nóng lắm. Mát mẻ.'),
    ]),
    MC('lt-b4-ht-3', 'Hiểu hội thoại 3 và điền chỗ trống (6 câu)', [
      Q('モスクワの{冬|ふゆ}は どうですか。', 'とても{寒|さむ}くて{雪|ゆき}が{多|おお}い', 'あまり{寒|さむ}くないです | とても{暑|あつ}い | {涼|すず}しい', '寒い + 雪が多い.'),
      Q('パースの{冬|ふゆ}は どうですか。', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}い | とても{暑|あつ}い | {雪|ゆき}が{多|おお}い', 'パースの冬はあまり寒くない.'),
      Q('パースの{夏|なつ}は どうですか。', 'とても{暑|あつ}い', 'あまり{暑|あつ}くないです | {涼|すず}しい | {寒|さむ}い', 'とても暑い.'),
      Q('モスクワの{夏|なつ}は どうですか。', '{涼|すず}しい', 'とても{暑|あつ}い | とても{寒|さむ}い | {雪|ゆき}が{多|おお}い', 'あまり暑くない。涼しい。'),
      Q('アンナ：とても{寒|さむ}いです。＿＿＿、{雪|ゆき}が{多|おお}いです。', 'そして', 'が | を | と', 'Lạnh + nhiều tuyết: cùng chiều → そして.'),
      Q('ダニエル：{冬|ふゆ}は あまり{寒|さむ}くないです＿＿＿、{夏|なつ}は とても{暑|あつ}いです。', 'が', 'そして | を | に', 'Đối lập đông/hè → が.'),
    ]),
    BUILD('lt-b4-ht-3-xep', 'Sắp xếp lượt thoại 3 cho đúng thứ tự', [
      BDT('Hỏi mùa đông → trả lời và hỏi lại → trả lời → đồng tình.', [
        'アンナ-さん、 モスクワ の {冬|ふゆ} は どう です か。',
        'とても {寒|さむ}い です。 ダニエル-さん の パース は どう です か。',
        'パース の {冬|ふゆ} は あまり {寒|さむ}くない です。',
        'いい です ね。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 4: Món ăn (nóng/cay/lạnh)`),
    DLG('Hội thoại 4 — サムゲタンとフォー', [
      D('リン', 'f', 'パク-さん、 {韓国|かんこく} の {料理|りょうり} は {辛|から}い です か。', 'Chị Park, món Hàn có cay không?'),
      D('パク', 'f', 'ええ、 {辛|から}い です が、 おいしい です。 サムゲタン は とりにく の スープ です。', 'Có, cay nhưng ngon. Samgyetang là món súp thịt gà.'),
      D('パク', 'f', '{熱|あつ}い スープ です。 {暑|あつ}い {日|ひ} に {食|た}べます。', 'Là món súp nóng. Người ta ăn vào ngày nóng bức.'),
      D('リン', 'f', 'へえ、 {暑|あつ}い {日|ひ} に {熱|あつ}い スープ です か。', 'Ồ, ngày nóng mà ăn súp nóng à?'),
      D('パク', 'f', 'ええ。 ベトナム の フォー も {熱|あつ}い スープ です か。', 'Vâng. Phở Việt Nam cũng là súp nóng à?'),
      D('リン', 'f', 'はい、 {熱|あつ}い です。 あまり {辛|から}くない です。', 'Vâng, nóng. Không cay lắm.'),
    ]),
    MC('lt-b4-ht-4', 'Hiểu hội thoại 4 và điền chỗ trống (6 câu)', [
      Q('サムゲタンは どんな スープですか。', 'とりにくの{熱|あつ}いスープ', '{冷|つめ}たいスープ | {甘|あま}いスープ | {苦|にが}いスープ', 'とりにく (thịt gà) + 熱い.'),
      Q('サムゲタンは いつ {食|た}べますか。', '{暑|あつ}い{日|ひ}', '{寒|さむ}い{日|ひ} | {雪|ゆき}の{日|ひ} | {雨|あめ}の{日|ひ}', '暑い日に食べます.'),
      Q('{韓国|かんこく}の{料理|りょうり}は どうですか。', '{辛|から}いですが、おいしいです', 'あまり{辛|から}くないです | {甘|あま}いです | おいしくないです', '辛いですが、おいしいです.'),
      Q('フォーは {辛|から}いですか。', 'あまり{辛|から}くないです', 'とても{辛|から}い | {冷|つめ}たいです | {苦|にが}い', 'あまり辛くない.'),
      Q('パク：サムゲタンは＿＿＿ スープです。 (nóng, vừa múc)', '{熱|あつ}い', '{暑|あつ}い | {寒|さむ}い | {涼|すず}しい', 'Đồ ăn nóng → 熱い.'),
      Q('パク：＿＿＿ {日|ひ}に{食|た}べます。 (ngày nóng bức)', '{暑|あつ}い', '{熱|あつ}い | {冷|つめ}たいです | {甘|あま}い', 'Thời tiết nóng → 暑い.'),
    ]),
    BUILD('lt-b4-ht-4-xep', 'Sắp xếp lượt thoại 4 cho đúng thứ tự', [
      BDT('Hỏi món Hàn có cay không → trả lời → hỏi lại phở → trả lời.', [
        'パク-さん、 {韓国|かんこく} の {料理|りょうり} は {辛|から}い です か。',
        'ええ、 {辛|から}い です が、 おいしい です。',
        'ベトナム の フォー は {辛|から}い です か。',
        'いいえ、 あまり {辛|から}くない です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 5: Từ nhà đến trường`),
    DLG('Hội thoại 5 — 西川先生とダニエル', [
      D('西川先生', 'm', 'ダニエル-さん、 うち から {学校|がっこう} まで どのくらい です か。', 'Daniel, từ nhà đến trường mất bao lâu?'),
      D('ダニエル', 'm', 'うち から {駅|えき} まで {歩|ある}いて {十分|じゅっぷん} です。 {駅|えき} から {学校|がっこう} まで {電車|でんしゃ} で {三十分|さんじゅっぷん} くらい です。', 'Từ nhà đến ga đi bộ 10 phút. Từ ga đến trường đi tàu điện khoảng 30 phút.'),
      D('西川先生', 'm', 'そう です か。 {四十分|よんじゅっぷん} です ね。', 'Vậy à. Là 40 phút nhỉ.'),
      D('ダニエル', 'm', 'はい、 そう です。', 'Vâng, đúng ạ.'),
    ]),
    MC('lt-b4-ht-5', 'Hiểu hội thoại 5 và điền chỗ trống (6 câu)', [
      Q('うちから{駅|えき}まで、{何|なん}で{行|い}きますか。 (ダニエルさん)', '{歩|ある}いて', '{電車|でんしゃ}で | バスで | {車|くるま}で', 'うちから駅まで歩いて十分.'),
      Q('{駅|えき}から{学校|がっこう}まで {電車|でんしゃ}で どのくらいですか。', '{三十分|さんじゅっぷん}くらい', '{十分|じゅっぷん} | {四十分|よんじゅっぷん} | {一時間|いちじかん}', '電車で三十分くらい.'),
      Q('うちから{学校|がっこう}まで どのくらいですか。', '{四十分|よんじゅっぷん}', '{三十分|さんじゅっぷん} | {二十分|にじゅっぷん} | {一時間|いちじかん}', '10 + 30 = 40.'),
      Q('{十分|じゅっぷん}の{読|よ}み{方|かた}は？', 'じゅっぷん', 'じゅうふん | じゅっふん | じゅうぷん', '10 phút = じゅっぷん.'),
      Q('ダニエル：うちから{駅|えき}まで＿＿＿ {十分|じゅっぷん}です。', '{歩|ある}いて', '{歩|ある}いで | {歩|ある}く | {歩|ある}きます', '歩いて + thời gian.'),
      Q('{先生|せんせい}：{四十分|よんじゅっぷん}です＿＿＿。 (xác nhận, tìm sự đồng tình)', 'ね', 'か | が | を', 'ね = nhỉ.'),
    ]),
    BUILD('lt-b4-ht-5-xep', 'Sắp xếp lượt thoại 5 cho đúng thứ tự', [
      BDT('Hỏi bao lâu → trả lời theo hai chặng → xác nhận tổng → đáp.', [
        'ダニエル-さん、 うち から {学校|がっこう} まで どのくらい です か。',
        'うち から {駅|えき} まで {歩|ある}いて {十分|じゅっぷん} です。 {駅|えき} から {学校|がっこう} まで {電車|でんしゃ} で {三十分|さんじゅっぷん} くらい です。',
        'そう です か。 {四十分|よんじゅっぷん} です ね。',
        'はい、 そう です。',
      ]),
    ]),

    H(`${LV.kho} — Hội thoại 6: Đà Nẵng có gì`),
    DLG('Hội thoại 6 — 木村さんとリン', [
      D('木村', 'm', 'リン-さん の {町|まち} は ダナン です ね。 ダナン に {何|なに} が あります か。', 'Chị Linh quê ở Đà Nẵng nhỉ. Ở Đà Nẵng có gì?'),
      D('リン', 'f', 'きれいな {海|うみ} と {山|やま} が あります。 {古|ふる}い お{寺|てら} も あります。', 'Có biển đẹp và núi. Cũng có chùa cổ.'),
      D('木村', 'm', '{温泉|おんせん} は あります か。', 'Có suối nước nóng không?'),
      D('リン', 'f', 'いいえ、 ありません が、 {海|うみ} が とても きれい です。', 'Không có, nhưng biển rất đẹp.'),
      D('木村', 'm', 'いい ところ です ね。', 'Nơi tốt nhỉ.'),
      D('リン', 'f', 'ええ、 そう です ね。', 'Vâng, đúng vậy.'),
    ]),
    MC('lt-b4-ht-6', 'Hiểu hội thoại 6 và điền chỗ trống (6 câu)', [
      Q('ダナンに ないのは？', '{温泉|おんせん}', '{海|うみ} | {山|やま} | {古|ふる}いお{寺|てら}', '温泉はありません.'),
      Q('ダナンの{海|うみ}は どうですか。', 'とてもきれい', 'あまりきれいじゃありません | とても{古|ふる}い | {小|ちい}さい', '海がとてもきれいです.'),
      Q('ダナンに あるのは？', '{海|うみ}と{山|やま}', '{温泉|おんせん}と{山|やま} | {教会|きょうかい}と{海|うみ} | ビルと{川|かわ}', 'きれいな海と山、古いお寺があります.'),
      Q('{木村|きむら}：ダナンに{何|なに}＿＿＿ ありますか。', 'が', 'を | で | へ', '何が あります.'),
      Q('リン：いいえ、ありません＿＿＿、{海|うみ}がとてもきれいです。', 'が', 'そして | を | に', 'ない (kém) nhưng biển đẹp: が.'),
      Q('リン：「ええ、＿＿＿。」 (đồng tình)', 'そうですね', 'そうですか | そうですが | そうでした', 'そうですね.'),
    ]),
    BUILD('lt-b4-ht-6-xep', 'Sắp xếp lượt thoại 6 cho đúng thứ tự', [
      BDT('Hỏi có gì → trả lời → hỏi suối nước nóng → trả lời.', [
        'ダナン に {何|なに} が あります か。',
        'きれいな {海|うみ} と {山|やま} が あります。',
        '{温泉|おんせん} は あります か。',
        'いいえ、 ありません が、 {海|うみ} が とても きれい です。',
      ]),
    ]),

    H(`${LV.kho} — Chọn câu đáp lại (10 câu)`),
    MC('lt-b4-ht-dap', 'Chọn câu đáp lại tự nhiên nhất', [
      Q('A：お{国|くに}は どちらですか。', 'ベトナムです。', 'ベトナムが あります。 | ベトナムで あります。 | ベトナムを です。', 'Hỏi quê → tên nước.'),
      Q('A：ダナンは ベトナムの どこですか。', '{真|ま}ん{中|なか}です。', '{真|ま}ん{中|なか}が あります。 | {真|ま}ん{中|なか}を です。 | {真|ま}ん{中|なか}いです。', 'Trả lời vị trí.'),
      Q('A：うちから{学校|がっこう}まで どのくらいですか。', '{歩|ある}いて{十五分|じゅうごふん}くらいです。', '{歩|ある}いてで{十五分|じゅうごふん}です。 | {歩|ある}いて{十五時間|じゅうごじかん}です。 | {歩|ある}くで{十五分|じゅうごふん}です。', '歩いて + thời gian.'),
      Q('A：{京都|きょうと}は どんな ところですか。', '{古|ふる}いお{寺|てら}が{多|おお}いところです。', '{古|ふる}いな{町|まち}です。 | とても{寒|さむ}いなところです。 | {古|ふる}いお{寺|てら}です ところ。', 'Câu mô tả + ところ.'),
      Q('A：{冬|ふゆ}は どうですか。', '{寒|さむ}いです。', '{寒|さむ}い ところです ですか。 | どうですか。 | {寒|さむ}い{冬|ふゆ}ですか。', 'Hỏi どう → tính từ.'),
      Q('A：{暑|あつ}いですね。', 'ええ、そうですね。', 'ええ、そうですか。 | ええ、どうですか。 | ええ、あります。', 'Đồng tình.'),
      Q('A：{箱根|はこね}に{何|なに}が ありますか。', '{温泉|おんせん}が あります。', '{温泉|おんせん}を あります。 | {温泉|おんせん}で あります。 | {温泉|おんせん}か あります。', '何が → ～が あります.'),
      Q('A：この カレーは {辛|から}いですか。 (rất cay)', 'はい、とても{辛|から}いです。', 'はい、とても{辛|から}くないです。 | はい、あまり{辛|から}いです。 | はい、とても{辛|から}です。', 'とても + khẳng định.'),
      Q('A：{町|まち}は {大|おお}きいですか。', 'いいえ、あまり{大|おお}きくないです。', 'いいえ、あまり{大|おお}きいです。 | いいえ、とても{大|おお}きくないです。 | いいえ、{大|おお}きいじゃありません。', 'あまり + くない.'),
      Q('A：ここは {静|しず}かですか。', 'いいえ、あまり{静|しず}かじゃありません。', 'いいえ、あまり{静|しず}かくないです。 | いいえ、あまり{静|しず}かです。 | いいえ、とても{静|しず}かじゃありません。', 'な: じゃありません.'),
    ]),

    H(`${LV.kho} — Câu còn thiếu trong hội thoại ngắn (8 câu)`),
    MC('lt-b4-ht-thieu', 'Chọn lượt thoại phù hợp để điền vào chỗ trống', [
      Q('A：うちから{駅|えき}まで {何|なん}で {行|い}きますか。 B：＿＿＿', '{歩|ある}いて{行|い}きます。', '{歩|ある}いてで{行|い}きます。 | {歩|ある}きを{行|い}きます。 | {歩|ある}いてが です。', '歩いて đã là phương thức, không thêm で.'),
      Q('A：ハノイの{夏|なつ}は どうですか。 B：＿＿＿', 'とても{暑|あつ}いです。', 'とても{暑|あつ}くないです。 | あまり{暑|あつ}いです。 | とても{暑|あつ}です。', 'とても + khẳng định.'),
      Q('A：{箱根|はこね}に {温泉|おんせん}が ありますか。 B：＿＿＿', 'はい、あります。', 'はい、ありません。 | はい、あるますか。 | はい、ありますです。', 'Có: はい、あります.'),
      Q('A：この{町|まち}は {静|しず}かですか。 B：いいえ、＿＿＿', 'あまり{静|しず}かじゃありません。', 'あまり{静|しず}かです。 | とても{静|しず}かじゃありません。 | あまり{静|しず}くないです。', 'Tính từ な: じゃありません.'),
      Q('A：ホイアンは どんな{町|まち}ですか。 B：＿＿＿', '{古|ふる}い{町|まち}です。', '{古|ふる}いところ{町|まち}です。 | どうです。 | {古|ふる}いな{町|まち}です。', 'Tính từ + 町.'),
      Q('A：{今日|きょう}は {寒|さむ}いですね。 B：＿＿＿', 'ええ、そうですね。', 'ええ、そうですか。 | ええ、あります。 | ええ、どんなですね。', 'Đồng tình.'),
      Q('A：{東京|とうきょう}から {京都|きょうと}まで どのくらいですか。 B：＿＿＿', '{新幹線|しんかんせん}で{二時間半|にじかんはん}くらいです。', '{新幹線|しんかんせん}を{二時間半|にじかんはん}です。 | {新幹線|しんかんせん}で{二時半|にじはん}です。 | {新幹線|しんかんせん}に{二時間半|にじかんはん}です。', 'で + ～時間半. (二時半 = 2:30 giờ).'),
      Q('A：{町|まち}の{北|きた}に {何|なに}が ありますか。 B：＿＿＿', '{山|やま}が あります。', '{山|やま}を あります。 | {山|やま}に あります。 | {山|やま}で あります。', '～が あります.'),
    ]),

    H(`${LV.kho} — Tự nói: đóng vai thí sinh`),
    P('Dưới đây là **ba bản trả lời mẫu** cho cùng bộ câu hỏi (quê Hà Nội / Đà Nẵng / TP.HCM). Chọn bản gần với bạn nhất, **thay từ** bằng thông tin của bạn, rồi che lời thoại và tự nói. Bấm 🎤 ở phần dưới để thu âm.'),
    DLG('Mẫu A — quê ở Hà Nội', [
      DX('Giám thị', 'examiner', 'お{国|くに} は どちら です か。', 'Bạn đến từ nước nào?'),
      DX('Thí sinh', 'candidate', 'ベトナム です。 ハノイ です。', 'Việt Nam. Là Hà Nội.'),
      DX('Giám thị', 'examiner', 'ハノイ は ベトナム の どこ です か。', 'Hà Nội ở đâu của Việt Nam?'),
      DX('Thí sinh', 'candidate', 'ベトナム の {北|きた} です。', 'Ở phía bắc Việt Nam.'),
      DX('Giám thị', 'examiner', 'ハノイ は どんな {町|まち} です か。', 'Hà Nội là thành phố như thế nào?'),
      DX('Thí sinh', 'candidate', '{大|おお}きい {町|まち} です。 そして、 にぎやか です。', 'Là thành phố lớn. Và nhộn nhịp.'),
      DX('Giám thị', 'examiner', 'ハノイ の {冬|ふゆ} は どう です か。', 'Mùa đông Hà Nội thế nào?'),
      DX('Thí sinh', 'candidate', '{少|すこ}し {寒|さむ}い です が、 {雪|ゆき} は あまり {多|おお}くない です。', 'Hơi lạnh nhưng tuyết không nhiều lắm.'),
    ]),
    DLG('Mẫu B — quê ở Đà Nẵng', [
      DX('Giám thị', 'examiner', 'ダナン は どんな {町|まち} です か。', 'Đà Nẵng là thành phố như thế nào?'),
      DX('Thí sinh', 'candidate', 'きれいな {町|まち} です。 {海|うみ} と {山|やま} が あります。', 'Là thành phố đẹp. Có biển và núi.'),
      DX('Giám thị', 'examiner', 'ハノイ から ダナン まで どのくらい です か。', 'Từ Hà Nội đến Đà Nẵng mất bao lâu?'),
      DX('Thí sinh', 'candidate', '{飛行機|ひこうき} で {一時間半|いちじかんはん} くらい です。', 'Đi máy bay khoảng một tiếng rưỡi.'),
      DX('Giám thị', 'examiner', 'ダナン の {夏|なつ} は どう です か。', 'Mùa hè Đà Nẵng thế nào?'),
      DX('Thí sinh', 'candidate', 'とても {暑|あつ}い です。', 'Rất nóng.'),
    ]),
    DLG('Mẫu C — quê ở TP. Hồ Chí Minh', [
      DX('Giám thị', 'examiner', 'ホーチミン は ベトナム の どこ です か。', 'TP.HCM ở đâu của Việt Nam?'),
      DX('Thí sinh', 'candidate', 'ベトナム の {南|みなみ} です。', 'Ở phía nam Việt Nam.'),
      DX('Giám thị', 'examiner', 'ホーチミン に {何|なに} が あります か。', 'Ở TP.HCM có gì?'),
      DX('Thí sinh', 'candidate', '{高|たか}い ビル と {古|ふる}い {教会|きょうかい} が あります。', 'Có toà nhà cao và nhà thờ cổ.'),
      DX('Giám thị', 'examiner', 'ホーチミン は {一年中|いちねんじゅう}、 {暑|あつ}い です か。', 'TP.HCM quanh năm nóng à?'),
      DX('Thí sinh', 'candidate', 'はい、 {一年中|いちねんじゅう}、 {暑|あつ}い です。', 'Vâng, quanh năm nóng.'),
    ]),
    SPEAK('lt-b4-ht-noi', [
      'おくには どちらですか。',
      'あなたの まちは ベトナムの どこですか。',
      'あなたの まちは どんな ところですか。',
      'あなたの まちに なにが ありますか。',
      'あなたの まちの なつは どうですか。',
      'あなたの まちの ふゆは どうですか。',
      'うちから がっこうまで どのくらいですか。',
      'ハノイから あなたの まちまで どのくらいですか。',
      'ベトナムの りょうりは からいですか。',
      'きょうは あついですね。',
    ]),
  ],
};

/* ───────── 8. ĐỌC HIỂU ───────── */

const R4_1: [string, string][] = [
  ['^リン-さん の {町|まち} は ダナン です。', 'Thành phố của Linh là Đà Nẵng.'],
  ['ベトナム の {真|ま}ん{中|なか} です。', 'Ở miền Trung Việt Nam.'],
  ['{海|うみ} が きれい です。', 'Biển đẹp.'],
];
const R4_2: [string, string][] = [
  ['^パク-さん の {町|まち} は プサン です。', 'Thành phố của chị Park là Busan.'],
  ['{韓国|かんこく} の {南|みなみ} です。', 'Nằm ở phía nam Hàn Quốc.'],
  ['{大|おお}きい {町|まち} です。', 'Là thành phố lớn.'],
  ['そして、 にぎやか です。', 'Và nhộn nhịp.'],
  ['{夏|なつ} は {暑|あつ}い です。', 'Mùa hè nóng.'],
  ['{冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa đông không lạnh lắm.'],
  ['{海|うみ} が きれい です が、 {山|やま} は あまり {高|たか}くない です。', 'Biển đẹp nhưng núi không cao lắm.'],
];
const R4_3: [string, string][] = [
  ['{日本|にほん} の {北|きた} に {北海道|ほっかいどう} が あります。', 'Ở phía bắc Nhật Bản có Hokkaido.'],
  ['{北海道|ほっかいどう} の {冬|ふゆ} は とても {寒|さむ}い です。', 'Mùa đông ở Hokkaido rất lạnh.'],
  ['{雪|ゆき} が {多|おお}い です。', 'Tuyết nhiều.'],
  ['{夏|なつ} は あまり {暑|あつ}くない です。', 'Mùa hè không nóng lắm.'],
  ['{涼|すず}しい です。', 'Mát mẻ.'],
  ['{日本|にほん} の {南|みなみ} に {沖縄|おきなわ} が あります。', 'Ở phía nam Nhật Bản có Okinawa.'],
  ['{沖縄|おきなわ} の {冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa đông ở Okinawa không lạnh lắm.'],
  ['{夏|なつ} は とても {暑|あつ}い です。', 'Mùa hè rất nóng.'],
  ['{海|うみ} が きれい です。', 'Biển đẹp.'],
];
const R4_4: [string, string][] = [
  ['ホイアン は ダナン の {南|みなみ} です。', 'Hội An nằm ở phía nam Đà Nẵng.'],
  ['ダナン から {車|くるま} で {三十分|さんじゅっぷん} くらい です。', 'Từ Đà Nẵng đi ô tô khoảng 30 phút.'],
  ['ダナン から ホイアン まで {電車|でんしゃ} は ありません。', 'Từ Đà Nẵng đến Hội An không có tàu điện.'],
  ['{小|ちい}さい です が、 とても {有名|ゆうめい}な {町|まち} です。', 'Là thị trấn nhỏ nhưng rất nổi tiếng.'],
  ['{古|ふる}い お{寺|てら} が {多|おお}い です。', 'Có nhiều chùa cổ.'],
  ['{川|かわ} が きれい です。', 'Sông đẹp.'],
  ['{夜|よる} は にぎやか です。', 'Buổi tối nhộn nhịp.'],
];
const R4_5: [string, string][] = [
  ['{私|わたし}の {町|まち} は チェンマイ です。', 'Thành phố của tôi là Chiang Mai.'],
  ['タイ の {北|きた} です。', 'Nằm ở phía bắc Thái Lan.'],
  ['バンコク から {飛行機|ひこうき} で {一時間|いちじかん} くらい です。', 'Từ Bangkok đi máy bay khoảng một tiếng.'],
  ['チェンマイ は {大|おお}きく ありません が、 とても {有名|ゆうめい} です。', 'Chiang Mai không lớn nhưng rất nổi tiếng.'],
  ['{山|やま} が {多|おお}い です。', 'Nhiều núi.'],
  ['そして、 {古|ふる}い お{寺|てら} も あります。', 'Và cũng có chùa cổ.'],
  ['{冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa đông không lạnh lắm.'],
  ['{夏|なつ} は {暑|あつ}い です。', 'Mùa hè nóng.'],
  ['{町|まち} の {北|きた} に {温泉|おんせん} も あります。', 'Ở phía bắc thành phố cũng có suối nước nóng.'],
];
const R4_6: [string, string][] = [
  ['ミラ-さん の {町|まち} は {大|おお}きい です。', 'Thành phố của Mira lớn.'],
  ['{高|たか}い ビル が {多|おお}い です。', 'Nhiều toà nhà cao.'],
  ['{緑|みどり} は あまり {多|おお}くない です。', 'Cây xanh không nhiều lắm.'],
  ['{冬|ふゆ} は {寒|さむ}い です。', 'Mùa đông lạnh.'],
  ['ケン-さん の {町|まち} は {小|ちい}さい です。', 'Thành phố của Ken nhỏ.'],
  ['{静|しず}か です。', 'Yên tĩnh.'],
  ['そして、 {緑|みどり} が {多|おお}い です。', 'Và nhiều cây xanh.'],
  ['ビル は {少|すく}ない です。', 'Ít toà nhà cao.'],
  ['{冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa đông không lạnh lắm.'],
];

const B4_DOC_HIEU: Lesson = {
  id: 'lt-b4-doc-hieu',
  kind: 'reading',
  title: 'Luyện thêm Bài 4 — Đọc hiểu: 6 đoạn từ ngắn đến dài (có furigana → không furigana)',
  goal: 'Đọc hiểu đoạn văn ngắn về thành phố, thời tiết và đi lại: trả lời câu hỏi chọn đáp án và đúng/sai, rồi đọc to đoạn dài không furigana như phần Reading của thi nói.',
  minutes: 55,
  blocks: [
    NOTE('Cách học bài này', [
      'Đọc đoạn **hai lần**: lần 1 chỉ hiểu ý chính (nơi nào, như thế nào), lần 2 mới đọc câu hỏi và **tìm câu trả lời trong bài** (đừng đoán theo hiểu biết riêng).',
      'Câu đúng/sai có lựa chọn thứ ba **"Không có trong bài"**: nếu bài không nói gì về điều đó thì chọn nó, dù ngoài đời điều đó có thể đúng.',
      'Đoạn 5–6 là mức Khó: có phần đọc to **không furigana**. Nhìn 20 giây rồi đọc một hơi, như thi nói.',
    ]),

    H(`${LV.de} — Đoạn 1: リンさんの{町|まち}`),
    ...PSG('リンさんの{町|まち}', R4_1),
    MC('lt-b4-dh-1', 'Câu hỏi đoạn 1 (6 câu)', [
      Q('リンさんの{町|まち}は？', 'ダナン', 'ハノイ | ホーチミン | ホイアン', '1 câu: ダナンです.'),
      Q('ダナンは ベトナムの どこですか。', '{真|ま}ん{中|なか}', '{北|きた} | {南|みなみ} | {西|にし}', 'ベトナムの真ん中.'),
      Q('きれいなのは？', '{海|うみ}', '{山|やま} | {川|かわ} | {緑|みどり}', '海がきれい.'),
      TF('ダナンは ベトナムの {北|きた}です。', 'Sai', 'Bài nói 真ん中, không phải 北.'),
      TF('ダナンは {海|うみ}が きれいです。', 'Đúng', '海がきれいです.'),
      TF('ダナンは {大|おお}きい{町|まち}です。', 'Không có trong bài', 'Bài không nói ダナン lớn hay nhỏ.'),
    ]),

    H(`${LV.de} — Đoạn 2: パクさんの{町|まち}`),
    ...PSG('パクさんの{町|まち}', R4_2),
    MC('lt-b4-dh-2', 'Câu hỏi đoạn 2 (8 câu)', [
      Q('プサンは {韓国|かんこく}の どこですか。', '{南|みなみ}', '{北|きた} | {東|ひがし} | {真|ま}ん{中|なか}', '韓国の南.'),
      Q('プサンの{夏|なつ}は？', '{暑|あつ}い', '{寒|さむ}い | {涼|すず}しい | あまり{暑|あつ}くないです', '夏は暑いです.'),
      Q('プサンの{冬|ふゆ}は？', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}い | {暑|あつ}い | {雪|ゆき}が{多|おお}い', '冬はあまり寒くない.'),
      Q('{山|やま}は どうですか。', 'あまり{高|たか}くないです', 'とても{高|たか}い | {古|ふる}い | {有名|ゆうめい}', '山はあまり高くない.'),
      TF('プサンは {小|ちい}さい{町|まち}です。', 'Sai', 'Bài nói 大きい町.'),
      TF('プサンは {海|うみ}が きれいです。', 'Đúng', '海がきれいですが…'),
      TF('プサンに {温泉|おんせん}が あります。', 'Không có trong bài', 'Không nhắc đến 温泉.'),
      Q('「{大|おお}きい{町|まち}です。そして、にぎやかです。」 の 「そして」 は？', 'Thêm ý cùng chiều', 'Nêu ý ngược lại | Hỏi cảm nhận | Đồng tình', 'Lớn + nhộn nhịp = cùng chiều.'),
    ]),

    H(`${LV.vua} — Đoạn 3: {日本|にほん}の{北|きた}と{南|みなみ}`),
    ...PSG('{日本|にほん}の{北|きた}と{南|みなみ}', R4_3),
    MC('lt-b4-dh-3', 'Câu hỏi đoạn 3 (9 câu)', [
      Q('{北海道|ほっかいどう}は {日本|にほん}の どこですか。', '{北|きた}', '{南|みなみ} | {東|ひがし} | {西|にし}', '日本の北に北海道.'),
      Q('{北海道|ほっかいどう}の{冬|ふゆ}は？', 'とても{寒|さむ}い', 'あまり{寒|さむ}くないです | {暑|あつ}い | {涼|すず}しい', 'とても寒い.'),
      Q('{北海道|ほっかいどう}の{夏|なつ}は？', 'あまり{暑|あつ}くないです', 'とても{暑|あつ}い | とても{寒|さむ}い | {雪|ゆき}が{多|おお}い', 'あまり暑くない。涼しい.'),
      Q('{沖縄|おきなわ}の{冬|ふゆ}は？', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}い | {雪|ゆき}が{多|おお}い | {涼|すず}しい', 'あまり寒くない.'),
      Q('{沖縄|おきなわ}の{夏|なつ}は？', 'とても{暑|あつ}い', 'あまり{暑|あつ}くないです | {寒|さむ}い | {涼|すず}しい', 'とても暑い.'),
      TF('{沖縄|おきなわ}は {日本|にほん}の {北|きた}です。', 'Sai', '沖縄 ở 南.'),
      TF('{北海道|ほっかいどう}は {雪|ゆき}が {多|おお}いです。', 'Đúng', '雪が多い.'),
      TF('{沖縄|おきなわ}に {温泉|おんせん}が あります。', 'Không có trong bài', 'Không nhắc đến.'),
      Q('{冬|ふゆ}、とても{寒|さむ}い{町|まち}は どちらですか。', '{北海道|ほっかいどう}', '{沖縄|おきなわ} | Cả hai | Không bên nào', 'Hokkaido: とても寒い.'),
    ]),

    H(`${LV.vua} — Đoạn 4: ホイアン`),
    ...PSG('ホイアン', R4_4),
    MC('lt-b4-dh-4', 'Câu hỏi đoạn 4 (8 câu)', [
      Q('ホイアンは ダナンの どこですか。', '{南|みなみ}', '{北|きた} | {東|ひがし} | {西|にし}', 'ダナンの南.'),
      Q('ダナンから ホイアンまで {車|くるま}で どのくらいですか。', '{三十分|さんじゅっぷん}くらい', '{十分|じゅっぷん}くらい | {三時間|さんじかん}くらい | {三日|みっか}くらい', '車で三十分くらい.'),
      Q('ホイアンは どんな{町|まち}ですか。', 'Nhỏ nhưng rất nổi tiếng', 'Lớn và mới | Nhỏ và không ai biết | Lớn và yên tĩnh', '小さいですが、とても有名.'),
      Q('{多|おお}いのは？', '{古|ふる}いお{寺|てら}', '{高|たか}いビル | {新|あたら}しい{駅|えき} | {温泉|おんせん}', '古いお寺が多い.'),
      Q('{夜|よる}は どうですか。', 'にぎやか', '{静|しず}か | {寒|さむ}い | {暑|あつ}い', '夜はにぎやか.'),
      TF('ホイアンの{川|かわ}は きれいじゃありません。', 'Sai', '川がきれいです.'),
      TF('ダナンからホイアンまで {電車|でんしゃ}が あります。', 'Sai', '電車はありません.'),
      Q('ダナンからホイアンへは {何|なん}で {行|い}きますか。', '{車|くるま}', '{電車|でんしゃ} | {新幹線|しんかんせん} | {飛行機|ひこうき}', '車で行きます (電車はない).'),
    ]),

    H(`${LV.kho} — Đoạn 5: チェンマイ (có đọc to không furigana)`),
    ...PSG('チェンマイ', R4_5, 'Đoạn dài hơn: nhớ tìm nơi + đặc điểm + khí hậu.'),
    MC('lt-b4-dh-5', 'Câu hỏi đoạn 5 (9 câu)', [
      Q('チェンマイは タイの どこですか。', '{北|きた}', '{南|みなみ} | {東|ひがし} | {真|ま}ん{中|なか}', 'タイの北.'),
      Q('バンコクから チェンマイまで {飛行機|ひこうき}で どのくらいですか。', '{一時間|いちじかん}くらい', '{十分|じゅっぷん}くらい | {十時間|じゅうじかん}くらい | {一日|いちにち}くらい', '一時間くらい.'),
      Q('チェンマイは どんな{町|まち}ですか。', 'Không lớn nhưng rất nổi tiếng', 'Lớn và nổi tiếng | Nhỏ và không ai biết | Mới và yên tĩnh', '大きくありませんが、とても有名.'),
      Q('{多|おお}いのは？', '{山|やま}', '{海|うみ} | {川|かわ} | ビル', '山が多い.'),
      Q('{冬|ふゆ}は？', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}い | {雪|ゆき}が{多|おお}い | {暑|あつ}い', '冬はあまり寒くない.'),
      Q('{夏|なつ}は？', '{暑|あつ}い', '{寒|さむ}い | {涼|すず}しい | あまり{暑|あつ}くないです', '夏は暑い.'),
      Q('{温泉|おんせん}は どこに ありますか。', '{町|まち}の{北|きた}', '{町|まち}の{南|みなみ} | バンコク | {山|やま}の{上|うえ}', '町の北に温泉もあります.'),
      TF('チェンマイに {古|ふる}いお{寺|てら}が あります。', 'Đúng', '古いお寺もあります.'),
      TF('チェンマイは {海|うみ}が きれいです。', 'Không có trong bài', 'Không nhắc đến biển.'),
    ]),
    READK('lt-b4-dh-5-doc', 'Đọc to đoạn 5 không furigana', 'Nhìn 20 giây, rồi đọc một hơi. Nhớ ngắt ở 「、」「。」 và kéo dài đúng ở ー, おお, ゆうめい.', [RKP(R4_5)]),

    H(`${LV.kho} — Đoạn 6: ミラさんの{町|まち}とケンさんの{町|まち}`),
    ...PSG('ミラさんの{町|まち}とケンさんの{町|まち}', R4_6, 'So sánh hai thành phố: lưu ý mỗi người có đặc điểm riêng.'),
    MC('lt-b4-dh-6', 'Câu hỏi đoạn 6 (9 câu)', [
      Q('ミラさんの{町|まち}は？', '{大|おお}きい', '{小|ちい}さい | {静|しず}か | {緑|みどり}が{多|おお}い', 'ミラさんの町は大きい.'),
      Q('ケンさんの{町|まち}は？', '{小|ちい}さい', '{大|おお}きい | にぎやか | ビルが{多|おお}い', 'ケンさんの町は小さい.'),
      Q('{緑|みどり}が{多|おお}いのは？', 'ケンさんの{町|まち}', 'ミラさんの{町|まち} | Cả hai | Không bên nào', 'ケンさんの町: 緑が多い.'),
      Q('{高|たか}いビルが{多|おお}いのは？', 'ミラさんの{町|まち}', 'ケンさんの{町|まち} | Cả hai | Không bên nào', 'ミラさんの町.'),
      Q('{冬|ふゆ}、あまり{寒|さむ}くないのは？', 'ケンさんの{町|まち}', 'ミラさんの{町|まち} | Cả hai | Không bên nào', 'ケンさん: 冬はあまり寒くない.'),
      Q('ミラさんの{町|まち}の{冬|ふゆ}は？', '{寒|さむ}い', 'あまり{寒|さむ}くないです | {暑|あつ}い | {涼|すず}しい', '冬は寒いです.'),
      TF('ケンさんの{町|まち}は {高|たか}いビルが{多|おお}いです。', 'Sai', 'ケンさんの町: ビルは少ない.'),
      TF('ミラさんの{町|まち}の{冬|ふゆ}は {寒|さむ}いです。', 'Đúng', 'ミラさん: 冬は寒いです.'),
      TF('ミラさんの{町|まち}に {川|かわ}が あります。', 'Không có trong bài', 'Bài không nhắc đến sông.'),
      Q('{静|しず}かな{町|まち}は どちらですか。', 'ケンさんの{町|まち}', 'ミラさんの{町|まち} | Cả hai | Không bên nào', 'ケンさんの町が静か.'),
    ]),
    READK('lt-b4-dh-6-doc', 'Đọc to đoạn 6 không furigana', undefined, [RKP(R4_6)]),

    H(`${LV.kho} — Đọc lướt: tìm thông tin giữa các đoạn (8 câu)`),
    MC('lt-b4-dh-tong', 'Tìm nhanh trong 6 đoạn đã đọc', [
      Q('Đoạn nào nói về thành phố có {温泉|おんせん}？', 'Đoạn 5 (チェンマイ)', 'Đoạn 1 (ダナン) | Đoạn 2 (プサン) | Đoạn 4 (ホイアン)', 'Đoạn 5: 町の北に温泉もあります.'),
      Q('Đoạn nào nhắc đến {車|くるま}で{三十分|さんじゅっぷん}？', 'Đoạn 4 (ホイアン)', 'Đoạn 1 | Đoạn 2 | Đoạn 6', 'Đoạn 4: ダナンから車で三十分.'),
      Q('Hai nơi nào nằm ở {南|みなみ} của một nơi khác?', 'プサン (Hàn Quốc) và ホイアン (so với Đà Nẵng)', 'ダナンとチェンマイ | 北海道と沖縄 | ミラさんの町とケンさんの町', 'プサン: 韓国の南; ホイアン: ダナンの南.'),
      Q('Nơi nào {冬|ふゆ}にあまり{寒|さむ}くない？ (chọn đáp án ĐÚNG nhất)', 'プサン, {沖縄|おきなわ}, チェンマイ', '{北海道|ほっかいどう}, ミラさんの{町|まち} | ダナン, ミラさんの{町|まち} | ホイアン, {北海道|ほっかいどう}', 'プサン・沖縄・チェンマイ đều: 冬はあまり寒くない.'),
      Q('Nơi nào mùa đông rất lạnh?', '{北海道|ほっかいどう}', 'プサン | チェンマイ | {沖縄|おきなわ}', '北海道の冬はとても寒い.'),
      Q('Đoạn nào có 「{夜|よる}はにぎやか」?', 'Đoạn 4 (ホイアン)', 'Đoạn 1 | Đoạn 3 | Đoạn 5', 'Đoạn 4.'),
      Q('Đoạn nào so sánh HAI THÀNH PHỐ (町) với nhau?', 'Đoạn 6', 'Đoạn 1 | Đoạn 2 | Đoạn 5', 'Đoạn 6: ミラさんの町 và ケンさんの町.'),
      Q('Từ nào KHÔNG xuất hiện ở đoạn nào trong 6 đoạn?', '{新幹線|しんかんせん}', '{電車|でんしゃ} | {飛行機|ひこうき} | {温泉|おんせん}', '新幹線 không xuất hiện; 電車 (đoạn 4), 飛行機 (đoạn 5), 温泉 (đoạn 5) có.'),
    ]),
  ],
};

/* ───────── 9. NGHE ───────── */

const B4_NGHE: Lesson = {
  id: 'lt-b4-nghe',
  kind: 'listening',
  title: 'Luyện thêm Bài 4 — Nghe: 10 đoạn mới, từ chậm đơn giản đến bẫy (đổi ý, tự sửa số, cộng thời gian)',
  goal: 'Nghe hiểu hội thoại về quê quán, đi lại, thời tiết, món ăn và nơi chốn; bắt được thông tin cuối cùng khi người nói sửa lại số hay đổi ý — đúng dạng nghe điền / nghe chọn của đề.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      'Nghe **hai lần**. Lần 1: chỉ ghi **số, tên nơi, hướng** ra giấy. Lần 2: mới đọc câu hỏi. Tuyệt đối **không bật lời thoại** trước khi trả lời xong.',
      'Đoạn 6–9 có **bẫy**: người nói **sửa lại** (「いいえ、十四分です」), **đổi ý** (「新幹線で……いいえ、バスで」), hoặc phải **cộng** hai con số. Nhớ: **thông tin CUỐI CÙNG** mới đúng.',
      'Lỗi hay mắc: nhầm **40 phút (よんじゅっぷん)** với **14 phút (じゅうよんぷん)**; nhầm **9 tiếng くじかん** với **4 tiếng よじかん**; nhầm **暑い/寒い**.',
    ]),
    RECAP('Bảng đoạn nghe', [
      '① ～ ③ 🟢 chậm, đơn giản: quê quán, hướng, thời gian đi đường.',
      '④ ～ ⑦ 🟡 tính từ, có/không có, thời tiết, vị giác.',
      '⑧ ～ ⑨ 🔴 bẫy: tự sửa số, cộng hai chặng.',
      '⑩ 🔴 hội thoại dài (もう一度聞こう): 8 câu hỏi.',
    ]),

    H(`${LV.de} — ① ～ ③`),
    LS('lt-b4-ng-01', '① Quê của Carlos', [
      L('パク', 'f', '^カルロス-さん、 お{国|くに} は どちら です か。', 'Anh Carlos, quê anh ở đâu?'),
      L('カルロス', 'm', 'ブラジル です。 リオ です。', 'Brazil. Là Rio.'),
      L('パク', 'f', 'リオ は ブラジル の どこ です か。', 'Rio ở đâu của Brazil?'),
      L('カルロス', 'm', 'ブラジル の {東|ひがし} です。', 'Ở phía đông Brazil.'),
    ]),
    LS('lt-b4-ng-02', '② Đi làm bằng gì', [
      L('ワン', 'f', 'マルコ-さん、 うち から {会社|かいしゃ} まで {何|なん} で {行|い}きます か。', 'Marco, từ nhà đến công ty anh đi bằng gì?'),
      L('マルコ', 'm', '{電車|でんしゃ} で {行|い}きます。', 'Tôi đi tàu điện.'),
      L('ワン', 'f', 'どのくらい です か。', 'Mất bao lâu?'),
      L('マルコ', 'm', '{三十分|さんじゅっぷん} くらい です。', 'Khoảng 30 phút.'),
    ]),
    LS('lt-b4-ng-03', '③ Hà Nội và Đà Nẵng', [
      L('リン', 'f', 'ハノイ から ダナン まで {飛行機|ひこうき} で {一時間半|いちじかんはん} くらい です。', 'Từ Hà Nội đến Đà Nẵng đi máy bay khoảng một tiếng rưỡi.'),
      L('ダニエル', 'm', 'ダナン は ベトナム の どこ です か。', 'Đà Nẵng ở đâu của Việt Nam?'),
      L('リン', 'f', '{真|ま}ん{中|なか} です。 {海|うみ} が きれい です。', 'Ở miền Trung. Biển đẹp.'),
    ]),
    MC('lt-b4-ng-q1', 'Câu hỏi ① ～ ③ (9 câu)', [
      Q('① カルロスさんの{国|くに}は？', 'ブラジル', 'ベトナム | イタリア | {中国|ちゅうごく}', 'ブラジルです.'),
      Q('① リオは ブラジルの どこ？', '{東|ひがし}', '{西|にし} | {北|きた} | {南|みなみ}', 'ブラジルの東.'),
      Q('① カルロスさんの{町|まち}は？', 'リオ', 'サンパウロ | ハノイ | ダナン', 'リオです.'),
      Q('② マルコさんは {何|なん}で {行|い}きますか。', '{電車|でんしゃ}', '{車|くるま} | {歩|ある}いて | {新幹線|しんかんせん}', '電車で行きます.'),
      Q('② どのくらいですか。', '{三十分|さんじゅっぷん}くらい', '{十三分|じゅうさんぷん}くらい | {三時間|さんじかん}くらい | {三分|さんぷん}くらい', 'さんじゅっぷん = 30 phút.'),
      Q('③ ハノイからダナンまで {飛行機|ひこうき}で？', '{一時間半|いちじかんはん}くらい', '{二時間|にじかん}くらい | {十五分|じゅうごふん}くらい | {三時間半|さんじかんはん}くらい', 'いちじかんはん = 1 tiếng rưỡi.'),
      Q('③ ダナンは ベトナムの どこ？', '{真|ま}ん{中|なか}', '{北|きた} | {南|みなみ} | {西|にし}', '真ん中.'),
      Q('③ ダナンの {海|うみ}は？', 'きれい', 'きたない | {小|ちい}さい | {高|たか}い', '海がきれい.'),
      Q('② Con số 「さんじゅっぷん」 là bao nhiêu?', '30 phút', '13 phút | 3 phút | 3 tiếng', '三十分 = 30 phút.'),
    ]),

    H(`${LV.vua} — ④ ～ ⑦`),
    LS('lt-b4-ng-04', '④ Thị trấn của thầy Nishikawa', [
      L('アンナ', 'f', '{西川|にしかわ}{先生|せんせい} の {町|まち} は どんな ところ です か。', 'Thị trấn của thầy Nishikawa là nơi như thế nào?'),
      L('西川先生', 'm', '{小|ちい}さい {町|まち} です。 {緑|みどり} が {多|おお}い です。 そして、 {静|しず}か です。', 'Là thị trấn nhỏ. Nhiều cây xanh. Và yên tĩnh.'),
      L('アンナ', 'f', 'にぎやか です か。', 'Có nhộn nhịp không ạ?'),
      L('西川先生', 'm', 'いいえ、 あまり にぎやか じゃありません。', 'Không, không nhộn nhịp lắm.'),
    ]),
    LS('lt-b4-ng-05', '⑤ Bắc Kinh tháng 8 và tháng 12', [
      L('ワン', 'f', '{北京|ペキン} の {八月|はちがつ} は とても {暑|あつ}い です。 そして、 {雨|あめ} が {少|すく}ない です。', 'Tháng 8 ở Bắc Kinh rất nóng. Và ít mưa.'),
      L('パク', 'f', '{十二月|じゅうにがつ} は どう です か。', 'Còn tháng 12 thì sao?'),
      L('ワン', 'f', '{寒|さむ}い です が、 {雪|ゆき} は あまり {多|おお}くない です。', 'Lạnh nhưng tuyết không nhiều lắm.'),
    ]),
    LS('lt-b4-ng-06', '⑥ Cà ri và bánh ngọt', [
      L('マルコ', 'm', 'この カレー は {辛|から}い です か。', 'Món cà ri này có cay không?'),
      L('リン', 'f', 'はい、 {辛|から}い です。 この ケーキ は {甘|あま}い です が、 あまり おいしくない です。', 'Có, cay. Còn bánh này ngọt nhưng không ngon lắm.'),
      L('マルコ', 'm', 'そう です か。 カレー を {食|た}べます。', 'Vậy à. Tôi ăn cà ri.'),
    ]),
    LS('lt-b4-ng-07', '⑦ Trước ga có gì', [
      L('ダニエル', 'm', '{駅|えき} の {前|まえ} に {何|なに} が あります か。', 'Trước ga có gì?'),
      L('パク', 'f', 'ビル が あります。 {教会|きょうかい} は ありません。', 'Có toà nhà. Không có nhà thờ.'),
      L('ダニエル', 'm', '{駅|えき} の {北|きた} は？', 'Còn phía bắc ga?'),
      L('パク', 'f', '{山|やま} が あります。 {神社|じんじゃ} も あります。', 'Có núi. Cũng có đền.'),
    ]),
    MC('lt-b4-ng-q2', 'Câu hỏi ④ ～ ⑦ (12 câu)', [
      Q('④ {西川|にしかわ}{先生|せんせい}の{町|まち}に {多|おお}いのは？', '{緑|みどり}', 'ビル | {川|かわ} | {温泉|おんせん}', '緑が多い.'),
      Q('④ {町|まち}は にぎやかですか。', 'いいえ、あまり', 'はい、とても | はい、{少|すこ}し | いいえ、まったく', 'あまりにぎやかじゃありません.'),
      Q('④ {町|まち}の {大|おお}きさは？', '{小|ちい}さい', '{大|おお}きい | とても{大|おお}きい | {高|たか}い', '小さい町.'),
      Q('⑤ {北京|ペキン}の{八月|はちがつ}は？', 'とても{暑|あつ}い', 'あまり{暑|あつ}くないです | {寒|さむ}い | {涼|すず}しい', '八月 = とても暑い.'),
      Q('⑤ {八月|はちがつ}の{雨|あめ}は？', '{少|すく}ない', '{多|おお}い | {雪|ゆき}です | ない', '雨が少ない.'),
      Q('⑤ {十二月|じゅうにがつ}の{雪|ゆき}は？', 'あまり{多|おお}くないです', 'とても{多|おお}い | まったくないです | {暑|あつ}い', '雪はあまり多くない.'),
      Q('⑥ カレーは？', '{辛|から}い', '{甘|あま}い | {苦|にが}い | すっぱい', 'カレーは辛い.'),
      Q('⑥ ケーキは？', '{甘|あま}いが、あまりおいしくないです', '{甘|あま}くて おいしい | {辛|から}い | すっぱい', '甘いですが、あまりおいしくない.'),
      Q('⑥ マルコさんは {何|なに}を{食|た}べますか。', 'カレー', 'ケーキ | サムゲタン | スープ', 'カレーを食べます.'),
      Q('⑦ {駅|えき}の{前|まえ}に あるのは？', 'ビル', '{教会|きょうかい} | {山|やま} | {神社|じんじゃ}', 'ビルがあります (教会はない).'),
      Q('⑦ {駅|えき}の{前|まえ}に ないのは？', '{教会|きょうかい}', 'ビル | {山|やま} | {神社|じんじゃ}', '教会はありません.'),
      Q('⑦ {駅|えき}の{北|きた}に あるのは？', '{山|やま}と{神社|じんじゃ}', 'ビルと{教会|きょうかい} | {川|かわ}と{温泉|おんせん} | {山|やま}だけ', '山と神社.'),
    ]),

    H(`${LV.kho} — ⑧ ～ ⑨ (bẫy: tự sửa và cộng số)`),
    LS('lt-b4-ng-08', '⑧ Từ nhà đến công ty (bẫy: tự sửa số)', [
      L('ワン', 'f', 'マルコ-さん、 うち から {会社|かいしゃ} まで どのくらい です か。', 'Marco, từ nhà đến công ty mất bao lâu?'),
      L('マルコ', 'm', '{電車|でんしゃ} で {四十分|よんじゅっぷん} くらい です。', 'Đi tàu điện khoảng 40 phút.'),
      L('マルコ', 'm', 'あ、 すみません。 {四十分|よんじゅっぷん} じゃ ありません。 {十四分|じゅうよんぷん} です。', 'À, xin lỗi. Không phải 40 phút. Là 14 phút.'),
    ]),
    LS('lt-b4-ng-09', '⑨ Đi học (bẫy: cộng và tự sửa)', [
      L('西川先生', 'm', 'ナタポン-さん、 うち から {学校|がっこう} まで {歩|ある}いて どのくらい です か。', 'Natapon, từ nhà đến trường đi bộ mất bao lâu?'),
      L('ナタポン', 'm', '{十五分|じゅうごふん} です。 あ、 いいえ、 {十分|じゅっぷん} です。', 'Mười lăm phút. À không, mười phút.'),
      L('西川先生', 'm', 'そう です か。 {学校|がっこう} から {駅|えき} まで は？', 'Vậy à. Còn từ trường đến ga?'),
      L('ナタポン', 'm', '{駅|えき} から {学校|がっこう} まで バス で {二十分|にじゅっぷん} です。', 'Từ ga đến trường đi xe buýt 20 phút.'),
      L('西川先生', 'm', '{三十分|さんじゅっぷん} です ね。', 'Là 30 phút nhỉ.'),
    ]),
    MC('lt-b4-ng-q3', 'Câu hỏi ⑧ ～ ⑨ (8 câu)', [
      Q('⑧ マルコさんの うちから{会社|かいしゃ}まで、{最後|さいご}に{言|い}った{時間|じかん}は？', '{十四分|じゅうよんぷん}', '{四十分|よんじゅっぷん} | {四分|よんぷん} | {四十四分|よんじゅうよんぷん}', 'Người nói **sửa lại** thành 14 phút (じゅうよんぷん).'),
      Q('⑧ 「よんじゅっぷん」 は？', '40 phút', '14 phút | 4 phút | 4 tiếng', 'よんじゅっぷん = 40; じゅうよんぷん = 14.'),
      Q('⑧ マルコさんは {何|なに}で {会社|かいしゃ}へ{行|い}きますか。', '{電車|でんしゃ}', '{車|くるま} | バス | {歩|ある}いて', '電車で.'),
      Q('⑨ うちから{学校|がっこう}まで {歩|ある}いて？ ({最後|さいご}に{言|い}った{時間|じかん})', '{十分|じゅっぷん}', '{十五分|じゅうごふん} | {二十分|にじゅっぷん} | {五分|ごふん}', '15 phút → sửa thành 10 phút.'),
      Q('⑨ {駅|えき}から{学校|がっこう}まで {何|なん}で？', 'バス', '{電車|でんしゃ} | {歩|ある}いて | {車|くるま}', 'バスで.'),
      Q('⑨ {駅|えき}から{学校|がっこう}まで？', '{二十分|にじゅっぷん}', '{十分|じゅっぷん} | {三十分|さんじゅっぷん} | {二分|にふん}', 'バスで二十分.'),
      Q('⑨ Tổng thời gian từ nhà đến trường (theo đoạn nghe) là?', '30 phút', '35 phút | 25 phút | 20 phút', '10 (đi bộ, đã sửa) + 20 (xe buýt) = 30 phút.'),
      Q('⑨ Nếu nghe nhầm mà giữ 15 phút thì tổng sẽ là? (đây là cái bẫy)', '35 phút', '30 phút | 25 phút | 20 phút', '15 + 20 = 35 — SAI vì người nói đã sửa 15 thành 10.'),
    ]),

    H(`${LV.kho} — ⑩ Hội thoại dài ({もう一度|もういちど}{聞|き}こう)`),
    LS('lt-b4-ng-10', '⑩ Hội An là nơi thế nào', [
      L('マルコ', 'm', 'リン-さん、 ホイアン は どんな ところ です か。', 'Linh, Hội An là nơi như thế nào?'),
      L('リン', 'f', '{小|ちい}さい {町|まち} です が、 とても {有名|ゆうめい} です。 {古|ふる}い お{寺|てら} が {多|おお}い です。', 'Là thị trấn nhỏ nhưng rất nổi tiếng. Nhiều chùa cổ.'),
      L('マルコ', 'm', 'ダナン から どのくらい です か。', 'Từ Đà Nẵng mất bao lâu?'),
      L('リン', 'f', '{車|くるま} で {三十分|さんじゅっぷん} くらい です。 バス は {四十五分|よんじゅうごふん} です。', 'Đi ô tô khoảng 30 phút. Xe buýt 45 phút.'),
      L('マルコ', 'm', '{電車|でんしゃ} は あります か。', 'Có tàu điện không?'),
      L('リン', 'f', 'いいえ、 ありません。', 'Không, không có.'),
      L('マルコ', 'm', 'そう です か。 ホイアン の {夏|なつ} は どう です か。', 'Vậy à. Mùa hè ở Hội An thế nào?'),
      L('リン', 'f', 'とても {暑|あつ}い です。 {冬|ふゆ} は あまり {寒|さむ}くない です。', 'Rất nóng. Mùa đông không lạnh lắm.'),
      L('マルコ', 'm', '{夜|よる} は どう です か。', 'Buổi tối thì sao?'),
      L('リン', 'f', 'にぎやか です。 そして、 {川|かわ} が きれい です。', 'Nhộn nhịp. Và sông đẹp.'),
    ]),
    MC('lt-b4-ng-q4', 'Câu hỏi ⑩ (8 câu)', [
      Q('ホイアンは どんな{町|まち}ですか。', 'Nhỏ nhưng rất nổi tiếng', 'Lớn và mới | Nhỏ và không nổi tiếng | Lớn và yên tĩnh', '小さいですが、とても有名.'),
      Q('{多|おお}いのは？', '{古|ふる}いお{寺|てら}', '{高|たか}いビル | {温泉|おんせん} | {教会|きょうかい}', '古いお寺が多い.'),
      Q('ダナンから {車|くるま}で？', '{三十分|さんじゅっぷん}くらい', '{十三分|じゅうさんぷん}くらい | {四十五分|よんじゅうごふん}くらい | {三時間|さんじかん}くらい', '車で三十分.'),
      Q('バスで？', '{四十五分|よんじゅうごふん}', '{三十分|さんじゅっぷん} | {十五分|じゅうごふん} | {四十分|よんじゅっぷん}', 'バスは四十五分.'),
      Q('{電車|でんしゃ}は？', 'ない', 'ある | {三十分|さんじゅっぷん}で{行|い}ける | わからない', '電車はありません.'),
      Q('{夏|なつ}は？', 'とても{暑|あつ}い', 'あまり{暑|あつ}くないです | {涼|すず}しい | {寒|さむ}い', '夏はとても暑い.'),
      Q('{冬|ふゆ}は？', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}い | {雪|ゆき}が{多|おお}い | {暑|あつ}い', '冬はあまり寒くない.'),
      Q('{夜|よる}は？', 'Nhộn nhịp, sông đẹp', 'Yên tĩnh | Tối và vắng | Không có sông', '夜はにぎやか。川がきれい.'),
    ]),

    H(`${LV.kho} — Nghe điền chỗ trống (6 câu, như dạng Slot 30)`),
    QZ('lt-b4-ng-dien', 'Nghe lại ①, ②, ⑤ rồi điền (gõ bằng chữ Hán hoặc hiragana)', 'fill', [
      A('① パク：カルロスさん、おくには＿＿＿ですか。', ['どちら', 'どこ']),
      A('① カルロス：ブラジル＿＿＿ {東|ひがし}です。', 'の'),
      A('② ワン：うちから{会社|かいしゃ}まで{何|なん}＿＿＿ {行|い}きますか。', 'で'),
      A('② マルコ：{三十分|さんじゅっぷん}＿＿＿です。', ['くらい', 'ぐらい']),
      A('⑤ ワン：{北京|ペキン}の{八月|はちがつ}はとても＿＿＿です。', '{暑|あつ}い'),
      A('⑤ ワン：{雪|ゆき}はあまり＿＿＿です。 (nhiều)', ['{多|おお}くない']),
    ]),
  ],
};

/* ───────── 10. NÓI & VIẾT ───────── */

const R4_A1: [string, string][] = [
  ['{私|わたし}の {国|くに} は ベトナム です。', 'Nước tôi là Việt Nam.'],
  ['{私|わたし}の {町|まち} は ハノイ です。', 'Thành phố của tôi là Hà Nội.'],
  ['ベトナム の {北|きた} です。', 'Nằm ở phía bắc Việt Nam.'],
  ['ハノイ は {大|おお}きい {町|まち} です。 そして、 にぎやか です。', 'Hà Nội là thành phố lớn. Và nhộn nhịp.'],
  ['{高|たか}い ビル が {多|おお}い です。', 'Có nhiều toà nhà cao.'],
  ['{古|ふる}い {教会|きょうかい} も あります。', 'Cũng có nhà thờ cổ.'],
  ['{夏|なつ} は とても {暑|あつ}い です が、 {冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa hè rất nóng nhưng mùa đông không lạnh lắm.'],
];
const R4_A2: [string, string][] = [
  ['{東京|とうきょう} から {京都|きょうと} まで {新幹線|しんかんせん} で {二時間半|にじかんはん} くらい です。', 'Từ Tokyo đến Kyoto đi Shinkansen khoảng hai tiếng rưỡi.'],
  ['{京都|きょうと} は {古|ふる}い {町|まち} です。', 'Kyoto là thành phố cổ.'],
  ['お{寺|てら} と {神社|じんじゃ} が {多|おお}い です。', 'Có nhiều chùa và đền.'],
  ['とても {有名|ゆうめい}な ところ です。', 'Là nơi rất nổi tiếng.'],
  ['{冬|ふゆ} は {寒|さむ}い です。', 'Mùa đông lạnh.'],
  ['{夏|なつ} は とても {暑|あつ}い です。', 'Mùa hè rất nóng.'],
];
const R4_A3: [string, string][] = [
  ['ベトナム の {料理|りょうり} は おいしい です。', 'Món ăn Việt Nam ngon.'],
  ['あまり {辛|から}く ありません。', 'Không cay lắm.'],
  ['フォー は {熱|あつ}い スープ です。', 'Phở là món súp nóng.'],
  ['ベトナム の コーヒー は {甘|あま}い です。 そして、 {少|すこ}し {苦|にが}い です。', 'Cà phê Việt Nam ngọt. Và hơi đắng.'],
  ['{暑|あつ}い {日|ひ} に {冷|つめ}たい コーヒー を {飲|の}みます。', 'Vào ngày nóng tôi uống cà phê lạnh.'],
];

const B4_NOI_VIET: Lesson = {
  id: 'lt-b4-noi-viet',
  kind: 'speaking',
  title: 'Luyện thêm Bài 4 — Nói & viết: 4 bộ câu hỏi thi nói (3 câu có tranh + 1 câu cá nhân) · đọc to · bài viết 3–5 câu',
  goal: 'Trả lời trôi chảy câu hỏi thi nói Bài 4 (có tranh và cá nhân) bằng câu đầy đủ, đọc to đoạn văn đúng ngắt nghỉ, và viết được đoạn 3–5 câu giới thiệu quê, thời tiết, đi lại, món ăn.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      'Thi nói chấm **câu đầy đủ, đúng ngữ pháp, trôi chảy**. Luôn trả lời bằng một câu hoàn chỉnh (「ベトナムの北です」), không chỉ nói từ trơ trọi (「北」).',
      'Mỗi bộ có **3 câu hỏi có tranh** (bạn nhìn tranh rồi trả lời) và **1 câu cá nhân** (về chính bạn). Làm thật: che đáp án, bấm 🎤, nói, nghe lại, rồi so với mẫu.',
      'Mẹo: giám thị được nhắc lại câu hỏi 3 lần, mỗi lần bạn **không được im quá 10 giây**. Chưa nghe rõ → nói 「もう一度お願いします。」',
      'Lỗi hay mắc: nói tên thành phố thay vì hướng; thiếu **の** (ベトナム**の**北); dùng **で** sau 歩いて; trả lời どんな bằng một từ thay vì tính từ + danh từ.',
    ]),
    TABLE(
      ['Bộ', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'Quê ở đâu, đi lại, nơi như thế nào', 'どこ · から～まで · どんな'],
        ['2', 'Thời tiết theo tháng', 'どう · とても · あまり'],
        ['3', 'Món ăn và vị', '辛い · 熱い · 甘い · そして · が'],
        ['4', 'Có gì ở đâu, đi lại, thời gian', 'に～があります · 歩いて · くらい'],
      ],
    ),

    H(`${LV.de} — Bộ 1: Quê quán và đi lại`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Bản đồ Việt Nam, chấm đỏ ở GIỮA, ghi 「フエ」 (Huế)', 'フエ は ベトナム の どこ です か。'],
        ['2', 'Biểu tượng tàu điện, ghi 「ハノイ → フエ　12時間」', 'ハノイ から フエ まで {電車|でんしゃ} で どのくらい です か。'],
        ['3', 'Một ngôi chùa cổ bên cạnh núi', 'フエ は どんな {町|まち} です か。'],
        ['Cá nhân', '—', 'あなた の {町|まち} は どこ です か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 1', [
      DX('Giám thị', 'examiner', 'フエ は ベトナム の どこ です か。', 'Huế ở đâu của Việt Nam?'),
      DX('Thí sinh', 'candidate', 'ベトナム の {真|ま}ん{中|なか} です。', 'Ở miền Trung Việt Nam.'),
      DX('Giám thị', 'examiner', 'ハノイ から フエ まで {電車|でんしゃ} で どのくらい です か。', 'Từ Hà Nội đến Huế đi tàu mất bao lâu?'),
      DX('Thí sinh', 'candidate', '{十二時間|じゅうにじかん} くらい です。', 'Khoảng 12 tiếng.'),
      DX('Giám thị', 'examiner', 'フエ は どんな {町|まち} です か。', 'Huế là thành phố như thế nào?'),
      DX('Thí sinh', 'candidate', '{古|ふる}い お{寺|てら} が {多|おお}い {静|しず}かな {町|まち} です。', 'Là thành phố yên tĩnh có nhiều chùa cổ.'),
      DX('Giám thị', 'examiner', 'あなた の {町|まち} は どこ です か。', 'Thành phố của bạn ở đâu?'),
      DX('Thí sinh', 'candidate', '{私|わたし}の {町|まち} は ダナン です。 ベトナム の {真|ま}ん{中|なか} です。', 'Thành phố của tôi là Đà Nẵng. Ở miền Trung Việt Nam.'),
    ]),
    SPEAK('lt-b4-nv-1', [
      'フエは ベトナムの どこですか。',
      'ハノイから フエまで でんしゃで どのくらいですか。',
      'フエは どんな まちですか。',
      'あなたの まちは どこですか。',
    ]),

    H(`${LV.vua} — Bộ 2: Thời tiết theo tháng`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Hokkaido phủ tuyết, ghi 「一月」', '{北海道|ほっかいどう} の {一月|いちがつ} は どう です か。'],
        ['2', 'Biển Okinawa, mặt trời to, ghi 「七月」', '{沖縄|おきなわ} の {七月|しちがつ} は どう です か。'],
        ['3', 'Trời mưa, ghi 「六月」', '{六月|ろくがつ} の {天気|てんき} は どう です か。'],
        ['Cá nhân', '—', 'あなた の {国|くに} の {夏|なつ} は どう です か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 2', [
      DX('Giám thị', 'examiner', '{北海道|ほっかいどう} の {一月|いちがつ} は どう です か。', 'Tháng 1 ở Hokkaido thế nào?'),
      DX('Thí sinh', 'candidate', 'とても {寒|さむ}い です。 そして、 {雪|ゆき} が {多|おお}い です。', 'Rất lạnh. Và nhiều tuyết.'),
      DX('Giám thị', 'examiner', '{沖縄|おきなわ} の {七月|しちがつ} は どう です か。', 'Tháng 7 ở Okinawa thế nào?'),
      DX('Thí sinh', 'candidate', 'とても {暑|あつ}い です。 {海|うみ} が きれい です。', 'Rất nóng. Biển đẹp.'),
      DX('Giám thị', 'examiner', '{六月|ろくがつ} の {天気|てんき} は どう です か。', 'Thời tiết tháng 6 thế nào?'),
      DX('Thí sinh', 'candidate', '{雨|あめ} が {多|おお}い です。 {天気|てんき} は あまり よくない です。', 'Mưa nhiều. Thời tiết không tốt lắm.'),
      DX('Giám thị', 'examiner', 'あなた の {国|くに} の {夏|なつ} は どう です か。', 'Mùa hè ở nước bạn thế nào?'),
      DX('Thí sinh', 'candidate', 'ベトナム の {夏|なつ} は とても {暑|あつ}い です が、 {海|うみ} が きれい です。', 'Mùa hè ở Việt Nam rất nóng nhưng biển đẹp.'),
    ]),
    SPEAK('lt-b4-nv-2', [
      'ほっかいどうの いちがつは どうですか。',
      'おきなわの しちがつは どうですか。',
      'ろくがつの てんきは どうですか。',
      'あなたの くにの なつは どうですか。',
    ]),

    H(`${LV.vua} — Bộ 3: Món ăn và vị`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Đĩa cà ri màu đỏ, có ớt', 'この カレー は どう です か。'],
        ['2', 'Cây kem lạnh', 'アイスクリーム は どう です か。'],
        ['3', 'Nồi súp gà nóng bốc khói (サムゲタン)', 'サムゲタン は どんな {料理|りょうり} です か。'],
        ['Cá nhân', '—', 'あなた の {国|くに} の {料理|りょうり} は どう です か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 3', [
      DX('Giám thị', 'examiner', 'この カレー は どう です か。', 'Món cà ri này thế nào?'),
      DX('Thí sinh', 'candidate', '{辛|から}い です が、 おいしい です。', 'Cay nhưng ngon.'),
      DX('Giám thị', 'examiner', 'アイスクリーム は どう です か。', 'Kem thế nào?'),
      DX('Thí sinh', 'candidate', '{冷|つめ}たい です。 そして、 {甘|あま}い です。', 'Lạnh. Và ngọt.'),
      DX('Giám thị', 'examiner', 'サムゲタン は どんな {料理|りょうり} です か。', 'Samgyetang là món như thế nào?'),
      DX('Thí sinh', 'candidate', 'とりにく の スープ です。 {熱|あつ}い です。', 'Là súp thịt gà. Nóng.'),
      DX('Giám thị', 'examiner', 'あなた の {国|くに} の {料理|りょうり} は どう です か。', 'Món ăn nước bạn thế nào?'),
      DX('Thí sinh', 'candidate', 'ベトナム の {料理|りょうり} は あまり {辛|から}くない です が、 おいしい です。', 'Món ăn Việt Nam không cay lắm nhưng ngon.'),
    ]),
    SPEAK('lt-b4-nv-3', [
      'この カレーは どうですか。',
      'アイスクリームは どうですか。',
      'サムゲタンは どんな りょうりですか。',
      'あなたの くにの りょうりは どうですか。',
    ]),

    H(`${LV.kho} — Bộ 4: Có gì, đi lại, thời gian`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Tranh thị trấn: núi ở phía bắc, một con sông, nhà ga', 'この {町|まち} に {何|なに} が あります か。'],
        ['2', 'Người đi bộ, ghi 「うち → えき　10分」', 'うち から {駅|えき} まで どのくらい です か。'],
        ['3', 'Mũi tên Tokyo → Kyoto, ghi 「新幹線　2時間半」', '{東京|とうきょう} から {京都|きょうと} まで どのくらい です か。'],
        ['Cá nhân', '—', '{学校|がっこう} まで {何|なん} で {行|い}きます か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 4', [
      DX('Giám thị', 'examiner', 'この {町|まち} に {何|なに} が あります か。', 'Thị trấn này có gì?'),
      DX('Thí sinh', 'candidate', '{山|やま} と {川|かわ} と {駅|えき} が あります。', 'Có núi, sông và ga.'),
      DX('Giám thị', 'examiner', 'うち から {駅|えき} まで どのくらい です か。', 'Từ nhà đến ga mất bao lâu?'),
      DX('Thí sinh', 'candidate', '{歩|ある}いて {十分|じゅっぷん} です。', 'Đi bộ 10 phút.'),
      DX('Giám thị', 'examiner', '{東京|とうきょう} から {京都|きょうと} まで どのくらい です か。', 'Từ Tokyo đến Kyoto mất bao lâu?'),
      DX('Thí sinh', 'candidate', '{新幹線|しんかんせん} で {二時間半|にじかんはん} くらい です。', 'Đi Shinkansen khoảng hai tiếng rưỡi.'),
      DX('Giám thị', 'examiner', '{学校|がっこう} まで {何|なん} で {行|い}きます か。', 'Bạn đi đến trường bằng gì?'),
      DX('Thí sinh', 'candidate', 'バス で {行|い}きます。 うち から {学校|がっこう} まで {二十分|にじゅっぷん} くらい です。', 'Tôi đi xe buýt. Từ nhà đến trường khoảng 20 phút.'),
    ]),
    SPEAK('lt-b4-nv-4', [
      'この まちに なにが ありますか。',
      'うちから えきまで どのくらいですか。',
      'とうきょうから きょうとまで どのくらいですか。',
      'がっこうまで なんで いきますか。',
    ]),

    H(`${LV.vua} — Chọn câu trả lời đạt điểm (10 câu)`),
    MC('lt-b4-nv-chon', 'Câu trả lời nào đạt điểm cao nhất?', [
      Q('Giám thị: 「フエは ベトナムの どこですか。」', 'ベトナムの{真|ま}ん{中|なか}です。', '{真|ま}ん{中|なか}。 | ベトナムの{真|ま}ん{中|なか}が あります。 | フエです。', 'Câu đầy đủ: N の hướng です.'),
      Q('Giám thị: 「ハノイから ダナンまで {飛行機|ひこうき}で どのくらいですか。」', '{一時間半|いちじかんはん}くらいです。', '{一時半|いちじはん}くらいです。 | {飛行機|ひこうき}を{一時間半|いちじかんはん}です。 | {一時間半|いちじかんはん}が あります。', '一時間半 (1 tiếng rưỡi) ≠ 一時半 (1 giờ 30).'),
      Q('Giám thị: 「ダナンは どんな {町|まち}ですか。」', 'きれいな{町|まち}です。', 'きれいです{町|まち}。 | きれいな です。 | きれい{町|まち}です。', 'Tính từ な + な + 町.'),
      Q('Giám thị: 「ダナンの{夏|なつ}は どうですか。」', 'とても{暑|あつ}いです。', 'とても{暑|あつ}くないです。 | あまり{暑|あつ}いです。 | {暑|あつ}い{夏|なつ}です。', 'どう → tính từ; とても + khẳng định.'),
      Q('Giám thị: 「この カレーは どうですか。」 (cay nhưng ngon)', '{辛|から}いですが、おいしいです。', '{辛|から}くですが、おいしいです。 | {辛|から}いです、が おいしいです。 | が {辛|から}いです。', 'Cay nhưng ngon: …ですが、….'),
      Q('Giám thị: 「うちから{駅|えき}まで どのくらいですか。」 (đi bộ 10 phút)', '{歩|ある}いて{十分|じゅっぷん}です。', '{歩|ある}いてで{十分|じゅっぷん}です。 | {歩|ある}いて{十分|じゅうふん}です。 | {歩|ある}くで{十分|じゅっぷん}です。', '歩いて + じゅっぷん.'),
      Q('Giám thị: 「この{町|まち}に{何|なに}が ありますか。」 (núi và sông)', '{山|やま}と{川|かわ}が あります。', '{山|やま}と{川|かわ}を あります。 | {山|やま}と{川|かわ}で あります。 | {山|やま}と{川|かわ}は います。', '～が あります.'),
      Q('Bạn chưa nghe rõ câu hỏi. Nên nói:', 'もう{一度|いちど}お{願|ねが}いします。', 'わかりません。 | …… (im lặng) | ごめんなさい、{帰|かえ}ります。', 'Xin giám thị nhắc lại (được tối đa 3 lần).'),
      Q('Giám thị: 「{暑|あつ}いですね。」', 'ええ、そうですね。', 'ええ、そうですか。 | はい、あります。 | いいえ、どうですか。', 'Đồng tình với ね.'),
      Q('Bạn lỡ nói sai một chữ. Nên làm gì?', 'Sửa nhanh rồi nói tiếp', 'Im lặng mãi | Bỏ cuộc | Nói lại từ đầu bằng tiếng Việt', 'Nói trôi chảy được tính điểm; sửa nhanh rồi tiếp tục.'),
    ]),

    H(`${LV.kho} — Đọc to (Reading) — 3 mã đề mới`),
    P('Đề Reading: bốc thăm mã (A-1, A-2…), **chuẩn bị 20 giây**, rồi đọc to khoảng 150 chữ. Dưới đây mỗi mã có **bản có furigana + romaji** (để học) và **bản không furigana** (để thi thử).'),
    H('Mã A-1 — ハノイ'),
    ...PSG('A-1 ハノイ', R4_A1),
    READK('lt-b4-nv-a1', 'A-1 — đọc không furigana', 'Chuẩn bị 20 giây, đọc một hơi. Chú ý おおきい・ゆうめい・きょうかい.', [RKP(R4_A1)]),
    H('Mã A-2 — {京都|きょうと}'),
    ...PSG('A-2 {京都|きょうと}', R4_A2),
    READK('lt-b4-nv-a2', 'A-2 — đọc không furigana', 'Chú ý 二時間半 = にじかんはん; 新幹線 = しんかんせん.', [RKP(R4_A2)]),
    H('Mã A-3 — ベトナムの{料理|りょうり}'),
    ...PSG('A-3 ベトナムの{料理|りょうり}', R4_A3),
    READK('lt-b4-nv-a3', 'A-3 — đọc không furigana', 'Chú ý 冷たい = つめたい; 甘い = あまい; 苦い = にがい.', [RKP(R4_A3)]),
    NOTE('Tiêu chí đọc to tự chấm', [
      'Đọc không dừng quá 2 giây giữa chừng.',
      'Kéo dài đúng chỗ **ー・おお・ゆう・きょう**; ngắt rõ **っ** (ngắt nửa nhịp): じゅっぷん, ろっぷん.',
      'Nghe lại thu âm: giọng xuống ở 「。」, lên nhẹ ở 「か」.',
    ]),

    H(`${LV.vua} — Viết đoạn 3–5 câu (có mẫu)`),
    P('Phần viết cuối kỳ có câu dịch Việt → Nhật; luyện viết đoạn ngắn giúp bạn nhớ khung câu. **Viết trước, so mẫu sau.** Mỗi đề có mẫu 3–5 câu bên dưới.'),
    NOTE('Đề viết 1 — Giới thiệu thành phố của bạn (4–5 câu)', [
      'Gợi ý ý: tên thành phố · ở đâu · lớn hay nhỏ · có gì · mùa hè/mùa đông thế nào.',
    ]),
    EXS([
      E('{私|わたし}の {町|まち} は ダナン です。', 'Thành phố của tôi là Đà Nẵng.'),
      E('ベトナム の {真|ま}ん{中|なか} です。', 'Ở miền Trung Việt Nam.'),
      E('{海|うみ} と {山|やま} が あります。', 'Có biển và núi.'),
      E('{夏|なつ} は とても {暑|あつ}い です が、 {冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa hè rất nóng nhưng mùa đông không lạnh lắm.'),
    ]),
    NOTE('Đề viết 2 — Đi từ nhà đến trường (3 câu)', [
      'Gợi ý ý: đi bằng gì · mất bao lâu · đi bộ đoạn nào.',
    ]),
    EXS([
      E('うち から {駅|えき} まで {歩|ある}いて {十分|じゅっぷん} です。', 'Từ nhà đến ga đi bộ 10 phút.'),
      E('{駅|えき} から {学校|がっこう} まで {電車|でんしゃ} で {二十分|にじゅっぷん} くらい です。', 'Từ ga đến trường đi tàu điện khoảng 20 phút.'),
      E('うち から {学校|がっこう} まで {三十分|さんじゅっぷん} くらい です。', 'Từ nhà đến trường khoảng 30 phút.'),
    ]),
    NOTE('Đề viết 3 — Món ăn của nước bạn (4 câu)', [
      'Gợi ý ý: món nào · vị thế nào · nóng hay lạnh · bạn thấy sao.',
    ]),
    EXS([
      E('ベトナム の フォー は {熱|あつ}い スープ です。', 'Phở Việt Nam là món súp nóng.'),
      E('あまり {辛|から}くない です。', 'Không cay lắm.'),
      E('そして、 おいしい です。', 'Và ngon.'),
      E('{暑|あつ}い {日|ひ} に {冷|つめ}たい コーヒー を {飲|の}みます。', 'Vào ngày nóng tôi uống cà phê lạnh.'),
    ]),
    QZ('lt-b4-nv-viet', 'Dịch câu viết (gõ bằng chữ Hán hoặc hiragana)', 'translate', [
      A('Thành phố của tôi là Đà Nẵng. Ở miền Trung Việt Nam.', ['{私|わたし}の{町|まち}はダナンです。ベトナムの{真|ま}ん{中|なか}です。', '{私|わたし}の{町|まち}はダナンです。ベトナムの{真|ま}ん{中|なか}にあります。']),
      A('Có biển và núi.', ['{海|うみ}と{山|やま}があります。', '{海|うみ}と{山|やま}が{多|おお}いです。']),
      A('Từ ga đến trường đi tàu điện khoảng 20 phút.', ['{駅|えき}から{学校|がっこう}まで{電車|でんしゃ}で{二十分|にじゅっぷん}ぐらいです。', '{駅|えき}から{学校|がっこう}まで{電車|でんしゃ}で{二十分|にじゅっぷん}くらいです。', '{駅|えき}から{学校|がっこう}まで{電車|でんしゃ}で{二十分|にじゅっぷん}です。']),
      A('Phở là món súp nóng.', 'フォーは{熱|あつ}いスープです。'),
      A('Món ăn Việt Nam không cay lắm.', ['ベトナムの{料理|りょうり}はあまり{辛|から}くないです。', 'ベトナムの{料理|りょうり}はあまり{辛|から}くありません。']),
      A('Mùa hè rất nóng nhưng mùa đông không lạnh lắm.', ['{夏|なつ}はとても{暑|あつ}いですが、{冬|ふゆ}はあまり{寒|さむ}くないです。', '{夏|なつ}はとても{暑|あつ}いですが{冬|ふゆ}はあまり{寒|さむ}くないです。']),
    ], 'Dùng đủ: の + hướng · から…まで · あまり + phủ định · が (nhưng)'),
    MC('lt-b4-nv-sua', 'Chọn bài viết đúng nhất (5 câu)', [
      Q('Bài viết nào ĐÚNG?', '{私|わたし}の{町|まち}は{小|ちい}さいですが、{静|しず}かです。', '{私|わたし}の{町|まち}は{小|ちい}さいくないですが、{静|しず}かです。 | {私|わたし}の{町|まち}は{小|ちい}さいが、{静|しず}かですが。 | {私|わたし}の{町|まち}を{小|ちい}さいですが、{静|しず}かです。', 'Câu đúng ngữ pháp, が nối ngược chiều.'),
      Q('Bài viết nào ĐÚNG?', 'うちから{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}です。', 'うちから{駅|えき}まで{歩|ある}いてで{十分|じゅっぷん}です。 | うちを{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}です。 | うちから{駅|えき}に{歩|ある}いて{十分|じゅっぷん}です。', 'から…まで + 歩いて + thời gian.'),
      Q('Bài viết nào ĐÚNG?', 'ハノイは ベトナムの{北|きた}です。', 'ハノイは ベトナム{北|きた}です。 | ハノイは ベトナムを{北|きた}です。 | ハノイが ベトナムの{北|きた}あります。', 'Thiếu の là lỗi; を/あります sai.'),
      Q('Bài viết nào ĐÚNG?', '{冬|ふゆ}は あまり{寒|さむ}くないです。', '{冬|ふゆ}は あまり{寒|さむ}いです。 | {冬|ふゆ}は とても{寒|さむ}くないです。 | {冬|ふゆ}を あまり{寒|さむ}くないです。', 'あまり + phủ định.'),
      Q('Bài viết nào ĐÚNG?', 'ここに {神社|じんじゃ}が あります。', 'ここで {神社|じんじゃ}が あります。 | ここに {神社|じんじゃ}を あります。 | ここに {神社|じんじゃ}は います。', 'に … が あります.'),
    ]),
  ],
};

/* ───────── 11. ĐỀ TỔNG HỢP ───────── */

const R4_DE: [string, string][] = [
  ['{私|わたし}の {町|まち} は リオ です。', 'Thành phố của tôi là Rio.'],
  ['ブラジル の {東|ひがし} です。', 'Nằm ở phía đông Brazil.'],
  ['{大|おお}きい {町|まち} です。', 'Là thành phố lớn.'],
  ['そして、 {海|うみ} が きれい です。', 'Và biển đẹp.'],
  ['{山|やま} も {多|おお}い です が、 あまり {高|たか}く ありません。', 'Cũng có nhiều núi nhưng không cao lắm.'],
  ['{夏|なつ} は とても {暑|あつ}い です。 {冬|ふゆ} は あまり {寒|さむ}くない です。', 'Mùa hè rất nóng. Mùa đông không lạnh lắm.'],
];

const B4_DE: Lesson = {
  id: 'lt-b4-de-tong-hop',
  kind: 'review',
  title: 'Luyện thêm Bài 4 — Đề tổng hợp (60 phút, 100 điểm): từ vựng · chữ Hán · ngữ pháp · nghe · đọc hiểu · dịch',
  goal: 'Làm một đề đủ phần theo form kiểm tra giữa kỳ / cuối kỳ của cô, bấm giờ, tự chấm bằng thang điểm và biết phần nào cần luyện lại.',
  minutes: 60,
  blocks: [
    RECAP('Đọc trước khi làm đề', [
      '**Thời gian: 60 phút.** Bấm giờ thật. Không xem lại bài học, không mở đáp án cho đến khi làm xong cả đề.',
      'Làm theo thứ tự các phần; câu nào bí quá 1 phút thì đánh dấu, làm tiếp, quay lại sau.',
      'Cuối đề có **bảng thang điểm tự chấm** và hướng dẫn luyện lại theo phần yếu.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Số câu', 'Điểm/câu', 'Tối đa'],
      [
        ['A', 'Từ vựng', '10', '1', '10'],
        ['B', 'Chữ Hán (đọc + chọn chữ)', '10', '1,5', '15'],
        ['C', 'Điền trợ từ (có X)', '8', '1', '8'],
        ['D', 'Từ để hỏi', '6', '1', '6'],
        ['E', 'Chọn đáp án đúng', '10', '1', '10'],
        ['F', 'Chia từ (gõ tay)', '4', '2', '8'],
        ['G', 'Nghe (2 đoạn)', '5', '2', '10'],
        ['H', 'Đọc hiểu', '6', '1,5', '9'],
        ['I', 'Dịch Việt → Nhật (gõ tay)', '4', '3', '12'],
        ['J', 'Dịch Nhật → Việt', '4', '3', '12'],
        ['', '**Tổng**', '67', '', '**100**'],
      ],
      'Cấu trúc đề tổng hợp Bài 4',
    ),

    H('Phần A — Từ vựng (10 câu × 1 điểm)'),
    MC('lt-b4-de-a', 'A. Từ vựng', [
      Q('「{教会|きょうかい}」の{意味|いみ}は？', 'Nhà thờ', 'Chùa | Đền | Lâu đài', '教会 = nhà thờ.'),
      Q('「{緑|みどり}」の{意味|いみ}は？', 'Cây xanh; màu xanh lá', 'Mưa | Tuyết | Đồ ăn', '緑 = みどり.'),
      Q('「{少|すく}ない」の{反対|はんたい}は？', '{多|おお}い', '{小|ちい}さい | {低|ひく}い | {古|ふる}い', 'Ít ↔ nhiều.'),
      Q('{違|ちが}う{種類|しゅるい}の{言葉|ことば}は？ {北|きた} / {南|みなみ} / {駅|えき} / {東|ひがし}', '{駅|えき}', '{北|きた} | {南|みなみ} | {東|ひがし}', '3 từ kia chỉ hướng.'),
      Q('＿＿＿ お{茶|ちゃ}を{飲|の}みます。 (vừa pha, bốc khói)', '{熱|あつ}い', '{暑|あつ}い | {寒|さむ}い | {涼|すず}しい', 'Đồ uống nóng → 熱い.'),
      Q('「すっぱい」は どんな{味|あじ}？', 'Chua', 'Ngọt | Cay | Đắng', 'すっぱい = chua.'),
      Q('{東京|とうきょう}から{京都|きょうと}まで＿＿＿で{行|い}きます。', '{新幹線|しんかんせん}', '{温泉|おんせん} | {神社|じんじゃ} | {川|かわ}', 'Phương tiện: 新幹線.'),
      Q('「{静|しず}か」の{反対|はんたい}は？', 'にぎやか', 'きれい | {有名|ゆうめい} | {古|ふる}い', 'Yên tĩnh ↔ nhộn nhịp.'),
      Q('「{一年中|いちねんじゅう}」の{意味|いみ}は？', 'Quanh năm', 'Mỗi tuần | Năm ngoái | Năm sau', '一年中 = suốt một năm.'),
      Q('「メロン」は？', 'Dưa lưới (loại dưa vàng Nhật)', 'Một loại bánh | Một loại cá | Một địa danh', 'メロン = dưa lưới.'),
    ]),

    H('Phần B — Chữ Hán (10 câu × 1,5 điểm)'),
    MC('lt-b4-de-b', 'B. Chữ Hán: 5 câu đọc + 5 câu chọn chữ', [
      Q('「男の人」の読み方は？', 'おとこのひと', 'おんなのひと | だんのひと | おとこのじん', '男 = おとこ.'),
      Q('「ハノイ市」の読み方は？', 'ハノイし', 'ハノイいち | ハノイく | ハノイまち', '市 = し.'),
      Q('「名前」の読み方は？', 'なまえ', 'めいぜん | なぜん | めいまえ', '名前 = なまえ.'),
      Q('「お国」の読み方は？', 'おくに', 'おこく | おぐに | おごく', 'お + 国.'),
      Q('「東」の読み方は？ (đứng một mình)', 'ひがし', 'とう | にし | みなみ', '東 = ひがし.'),
      Q('「とうきょうえき」を漢字で かくと？', '東京駅', '束京駅 | 東景駅 | 車京駅', '東京駅.'),
      Q('「なまえ」を漢字で かくと？', '名前', '各前 | 名育 | 石前', '名前.'),
      Q('「おんなのひと」を漢字で かくと？', '女の人', '男の人 | 安の人 | 好の人', '女の人.'),
      Q('「ちゅうごく」を漢字で かくと？', '中国', '中回 | 申国 | 中困', '中国.'),
      Q('「しんじゅくく」を漢字で かくと？', '新宿区', '新宿市 | 新宿図 | 新宿匹', '新宿区 (quận Shinjuku).'),
    ]),

    H('Phần C — Điền trợ từ (8 câu × 1 điểm; X = không cần)'),
    MC('lt-b4-de-c', 'C. Trợ từ', [
      Q('{私|わたし}の{町|まち}＿＿ {古|ふる}いお{寺|てら}＿＿ あります。', 'に / が', 'で / を | は / を | に / を', 'に (nơi) … が (vật).'),
      Q('ハノイ＿＿ ベトナム＿＿ {北|きた}です。', 'は / の', 'が / に | は / を | に / の', 'N は N の hướng.'),
      Q('{電車|でんしゃ}＿＿ {行|い}きます。', 'で', 'を | が | X', 'Phương tiện + で.'),
      Q('{歩|ある}いて＿＿ {十分|じゅっぷん}です。', 'X', 'で | を | が', '歩いて không thêm で.'),
      Q('{冬|ふゆ}＿＿、{寒|さむ}いです。', 'X', 'は | を | に', 'Mùa + 、 không cần trợ từ.'),
      Q('{東京|とうきょう}＿＿ {京都|きょうと}＿＿ {新幹線|しんかんせん}で{二時間半|にじかんはん}です。', 'から / まで', 'に / を | で / に | まで / から', 'から … まで.'),
      Q('この{町|まち}は{緑|みどり}＿＿ {多|おお}いです。', 'が', 'を | に | X', 'N1 は N2 が A.'),
      Q('{静|しず}か＿＿ ところです。', 'な', 'の | い | X', 'Tính từ な + な + danh từ.'),
    ]),

    H('Phần D — Từ để hỏi (6 câu × 1 điểm)'),
    MC('lt-b4-de-d', 'D. Chọn từ để hỏi', [
      Q('A：{京都|きょうと}は {東京|とうきょう}の＿＿＿ですか。 B：{西|にし}です。', 'どこ', 'どう | どんな | {何|なに}', 'Vị trí/hướng → どこ.'),
      Q('A：{京都|きょうと}は＿＿＿ {町|まち}ですか。 B：{古|ふる}い{町|まち}です。', 'どんな', 'どう | どこ | {何|なに}', 'どんな + 町.'),
      Q('A：{冬|ふゆ}は＿＿＿ですか。 B：{寒|さむ}いです。', 'どう', 'どんな | どこ | {何|なに}', 'どう (cảm nhận).'),
      Q('A：{駅|えき}の{前|まえ}に＿＿＿ ありますか。 B：ビルが あります。', '{何|なに}が', '{何|なに}を | どこが | どうが', '何が あります.'),
      Q('A：うちから{駅|えき}まで＿＿＿ですか。 B：{歩|ある}いて{十分|じゅっぷん}です。', 'どのくらい', 'どう | どんな | どこ', 'Thời gian → どのくらい.'),
      Q('A：＿＿＿ で{行|い}きますか。 B：{電車|でんしゃ}で{行|い}きます。', '{何|なん}', 'どう | どんな | どこ', '何で.'),
    ]),

    H('Phần E — Chọn đáp án đúng (10 câu × 1 điểm)'),
    MC('lt-b4-de-e', 'E. Ngữ pháp và từ vựng', [
      Q('この{公園|こうえん}は あまり＿＿＿。', '{大|おお}きくないです', '{大|おお}きいです | {大|おお}きいくないです | {大|おお}きかったです', 'あまり + phủ định.'),
      Q('ホーチミンは ベトナム＿＿＿ {南|みなみ}です。', 'の', 'は | を | に', 'Nước の hướng.'),
      Q('A：{今日|きょう}は {寒|さむ}いですね。 B：ええ、＿＿＿。', 'そうですね', 'そうですか | そうですが | そうでした', 'Đồng tình.'),
      Q('ここは{静|しず}かです。＿＿＿、きれいです。', 'そして', 'が | を | どう', 'Cùng chiều → そして.'),
      Q('{小|ちい}さい{町|まち}です＿＿＿、{有名|ゆうめい}です。', 'が', 'そして | を | に', 'Ngược chiều → が.'),
      Q('うちから{学校|がっこう}まで＿＿＿ {二十分|にじゅっぷん}です。', '{歩|ある}いて', '{歩|ある}いで | {歩|ある}くで | {歩|ある}いてで', '歩いて + thời gian.'),
      Q('{箱根|はこね}に＿＿＿ ありますか。', '{何|なに}が', '{何|なに}を | どうが | どんなが', '何が ありますか.'),
      Q('{夏|なつ}、ダナンは＿＿＿ {暑|あつ}いです。', 'とても', 'あまり | どう | どんな', 'Khẳng định → とても.'),
      Q('コーヒーは＿＿＿ です。 (vừa pha)', '{熱|あつ}い', '{暑|あつ}い | {寒|さむ}い | {涼|すず}しい', 'Đồ uống nóng.'),
      Q('{富士山|ふじさん}は＿＿＿ {山|やま}です。', '{有名|ゆうめい}な', '{有名|ゆうめい} | {有名|ゆうめい}い | {有名|ゆうめい}の', '有名 là tính từ な → 有名な.'),
    ]),

    H('Phần F — Chia từ trong ngoặc (4 câu × 2 điểm, gõ tay)'),
    QZ('lt-b4-de-f', 'F. Điền dạng đúng', 'fill', [
      A('この{町|まち}は（{静|しず}か）ところです。', '{静|しず}かな'),
      A('{今日|きょう}は{天気|てんき}が あまり（いいです）。', ['よくないです', 'よくありません']),
      A('ここに{駅|えき}が（あります）。 (phủ định)', 'ありません'),
      A('あの ビルは あまり（{高|たか}いです）。', NI('{高|たか}')),
    ]),

    H('Phần G — Nghe (5 câu × 2 điểm)'),
    P('Nghe mỗi đoạn **hai lần**, rồi trả lời.'),
    LS('lt-b4-de-g1', 'Đoạn 1 — Sapporo', [
      L('ナタポン', 'm', '{西川|にしかわ}{先生|せんせい}、 サッポロ は {日本|にほん} の どこ です か。', 'Thầy Nishikawa, Sapporo ở đâu của Nhật Bản?'),
      L('西川先生', 'm', '{北海道|ほっかいどう} に あります。 {日本|にほん} の {北|きた} です。', 'Ở Hokkaido. Phía bắc Nhật Bản.'),
      L('ナタポン', 'm', 'サッポロ の {冬|ふゆ} は どう です か。', 'Mùa đông Sapporo thế nào?'),
      L('西川先生', 'm', 'とても {寒|さむ}い です。 そして、 {雪|ゆき} が {多|おお}い です。', 'Rất lạnh. Và nhiều tuyết.'),
      L('ナタポン', 'm', '{東京|とうきょう} から サッポロ まで {飛行機|ひこうき} で どのくらい です か。', 'Từ Tokyo đến Sapporo đi máy bay mất bao lâu?'),
      L('西川先生', 'm', '{一時間半|いちじかんはん} くらい です。', 'Khoảng một tiếng rưỡi.'),
    ]),
    LS('lt-b4-de-g2', 'Đoạn 2 — Đi Hội An (bẫy: đổi ý)', [
      L('リン', 'f', 'あした、 ホイアン へ {行|い}きます か。 バス で {行|い}きます か。', 'Ngày mai anh đi Hội An à? Anh đi bằng xe buýt à?'),
      L('マルコ', 'm', 'はい、 バス で ……あ、 いいえ、 {車|くるま} で {行|い}きます。 バス は {四十五分|よんじゅうごふん} です が、 {車|くるま} は {三十分|さんじゅっぷん} です。', 'Vâng, bằng xe buýt… à không, đi ô tô. Xe buýt 45 phút còn ô tô 30 phút.'),
      L('リン', 'f', 'そう です か。 ホイアン は {古|ふる}い {町|まち} です ね。', 'Vậy à. Hội An là thị trấn cổ nhỉ.'),
      L('マルコ', 'm', 'ええ、 そう です ね。', 'Vâng, đúng nhỉ.'),
    ]),
    MC('lt-b4-de-g', 'G. Câu hỏi nghe', [
      Q('サッポロは どこですか。', '{日本|にほん}の{北|きた}（{北海道|ほっかいどう}）', '{日本|にほん}の{南|みなみ} | {日本|にほん}の{西|にし} | {日本|にほん}の{真|ま}ん{中|なか}', '北海道.'),
      Q('サッポロの{冬|ふゆ}は？', 'とても{寒|さむ}くて{雪|ゆき}が{多|おお}い', 'あまり{寒|さむ}くないです | {暑|あつ}い | {雪|ゆき}が{少|すく}ない', '寒い + 雪が多い.'),
      Q('{東京|とうきょう}からサッポロまで {飛行機|ひこうき}で？', '{一時間半|いちじかんはん}くらい', '{二時間|にじかん}くらい | {十五分|じゅうごふん}くらい | {三時間|さんじかん}くらい', '一時間半.'),
      Q('マルコさんは {最後|さいご}に {何|なに}で{行|い}くと{言|い}いましたか。', '{車|くるま}', 'バス | {電車|でんしゃ} | {歩|ある}いて', 'バス → 車 (đổi ý).'),
      Q('{車|くるま}で どのくらいですか。', '{三十分|さんじゅっぷん}', '{四十五分|よんじゅうごふん} | {十三分|じゅうさんぷん} | {三時間|さんじかん}', '車は三十分.'),
    ]),

    H('Phần H — Đọc hiểu (6 câu × 1,5 điểm)'),
    ...PSG('リオ', R4_DE),
    MC('lt-b4-de-h', 'H. Câu hỏi đọc hiểu', [
      Q('リオは ブラジルの どこですか。', '{東|ひがし}', '{西|にし} | {北|きた} | {南|みなみ}', 'ブラジルの東.'),
      Q('リオは どんな{町|まち}ですか。', '{大|おお}きい{町|まち}', '{小|ちい}さい{町|まち} | {古|ふる}い{町|まち} | {静|しず}かな{町|まち}', '大きい町.'),
      Q('きれいなのは？', '{海|うみ}', '{山|やま} | {川|かわ} | ビル', '海がきれい.'),
      Q('{山|やま}は どうですか。', '{多|おお}いですが、あまり{高|たか}くないです', '{少|すく}なくて{高|たか}い | {多|おお}くて{高|たか}い | ない', '山も多いですが、あまり高くありません.'),
      Q('{冬|ふゆ}は？', 'あまり{寒|さむ}くないです', 'とても{寒|さむ}い | {暑|あつ}い | {雪|ゆき}が{多|おお}い', '冬はあまり寒くない.'),
      TF('リオに {温泉|おんせん}が あります。', 'Không có trong bài', 'Không nhắc đến 温泉.'),
    ]),

    H('Phần I — Dịch Việt → Nhật (4 câu × 3 điểm, gõ tay)'),
    QZ('lt-b4-de-i', 'I. Dịch sang tiếng Nhật', 'translate', [
      A('Từ nhà đến ga đi bộ 15 phút.', ['うちから{駅|えき}まで{歩|ある}いて{十五分|じゅうごふん}です。', 'うちから{駅|えき}まで{歩|ある}いて{十五分|じゅうごふん}くらいです。']),
      A('Hà Nội ở phía bắc Việt Nam.', 'ハノイはベトナムの{北|きた}です。'),
      A('Món ăn này không cay lắm nhưng ngon.', ['この{料理|りょうり}はあまり{辛|から}くないですが、おいしいです。', 'この{料理|りょうり}はあまり{辛|から}くありませんが、おいしいです。']),
      A('Ở thành phố tôi có sông và núi.', ['{私|わたし}の{町|まち}に{川|かわ}と{山|やま}があります。', '{私|わたし}の{町|まち}に{山|やま}と{川|かわ}があります。']),
    ]),

    H('Phần J — Dịch Nhật → Việt (4 câu × 3 điểm)'),
    MC('lt-b4-de-j', 'J. Chọn bản dịch đúng', [
      Q('{駅|えき}の{前|まえ}に{大|おお}きいビルが あります。', 'Trước ga có một toà nhà lớn.', 'Toà nhà lớn ở sau ga. | Ga nằm trước toà nhà. | Tôi đi đến ga bằng toà nhà.', '駅の前に … があります.'),
      Q('この{町|まち}は{静|しず}かですが、あまりきれいじゃありません。', 'Thị trấn này yên tĩnh nhưng không đẹp lắm.', 'Thị trấn này yên tĩnh và rất đẹp. | Thị trấn này ồn ào nhưng đẹp. | Thị trấn này yên tĩnh và sạch sẽ.', '静か + が + あまりきれいじゃない.'),
      Q('{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}で{三時間|さんじかん}くらいです。', 'Từ Tokyo đến Osaka đi Shinkansen khoảng ba tiếng.', 'Từ Osaka đến Tokyo đi máy bay ba tiếng. | Tokyo cách Osaka ba km. | Đi Shinkansen từ Tokyo mất ba ngày.', '新幹線で三時間.'),
      Q('{冬|ふゆ}は{寒|さむ}いですね。 — ええ、そうですね。', 'Mùa đông lạnh nhỉ. – Vâng, đúng nhỉ.', 'Mùa đông lạnh không? – Vâng, lạnh. | Mùa đông rất nóng. – Vâng. | Mùa đông ở đâu? – Ở đây.', 'ね + そうですね = đồng tình.'),
    ]),

    H('Bảng chấm điểm tự đánh giá'),
    TABLE(
      ['Phần', 'Số câu đúng', '× điểm/câu', 'Điểm của bạn'],
      [
        ['A. Từ vựng', '___ / 10', '× 1', '___'],
        ['B. Chữ Hán', '___ / 10', '× 1,5', '___'],
        ['C. Trợ từ', '___ / 8', '× 1', '___'],
        ['D. Từ để hỏi', '___ / 6', '× 1', '___'],
        ['E. Chọn đáp án', '___ / 10', '× 1', '___'],
        ['F. Chia từ', '___ / 4', '× 2', '___'],
        ['G. Nghe', '___ / 5', '× 2', '___'],
        ['H. Đọc hiểu', '___ / 6', '× 1,5', '___'],
        ['I. Dịch V→N', '___ / 4', '× 3', '___'],
        ['J. Dịch N→V', '___ / 4', '× 3', '___'],
        ['', '', '**Tổng**', '___ / 100'],
      ],
    ),
    TABLE(
      ['Tổng điểm', 'Đánh giá', 'Việc cần làm'],
      [
        ['90–100', 'Xuất sắc', 'Chỉ cần ôn lại câu sai; chuyển sang luyện nói/nghe.'],
        ['80–89', 'Tốt', 'Ôn phần dưới 80% của chính bạn.'],
        ['70–79', 'Đạt', 'Làm lại các lesson ngữ pháp 1–3 mức Vừa.'],
        ['60–69', 'Cần ôn', 'Làm lại lesson từ vựng + chữ Hán mức Dễ–Vừa, rồi làm lại đề này sau 2 ngày.'],
        ['Dưới 60', 'Chưa đạt', 'Bắt đầu lại từ lộ trình ngày 1, làm chậm, đừng bỏ qua mức Dễ.'],
      ],
    ),
    NOTE('Cách luyện lại theo phần yếu', [
      'Từ vựng (A) hay sai → `lt-b4-tu-vung` mức Vừa–Khó, đặc biệt các cặp 暑い/熱い, 暖かい/温かい.',
      'Chữ Hán (B) hay sai → `lt-b4-chu-han` mức Vừa; nhìn BỘ chữ để loại đáp án nhiễu.',
      'Trợ từ (C) & Từ hỏi (D) hay sai → `lt-b4-ngu-phap-tron` phần A–B.',
      'Nghe (G) hay sai → `lt-b4-nghe` đoạn 8–9 (bẫy); luôn nhớ thông tin CUỐI.',
      'Dịch (I) hay sai → `lt-b4-ngu-phap-tron` phần F và `lt-b4-noi-viet` phần viết.',
    ]),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *                         BÀI 5 — LUYỆN THÊM
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────── 0. LỘ TRÌNH ───────── */

const B5_LO_TRINH: Lesson = {
  id: 'lt-b5-lo-trinh',
  kind: 'review',
  title: 'Luyện thêm Bài 5 — đọc trước: lộ trình 7 ngày, cách dùng, kiểm tra đầu vào',
  goal: 'Biết bộ luyện Bài 5 gồm những gì, học theo thứ tự nào, và biết mình yếu kỹ năng nào để luyện đúng chỗ.',
  minutes: 15,
  blocks: [
    RECAP('Đọc 1 phút trước khi luyện', [
      'Bài 5 là bài **kể chuyện quá khứ** (đã làm gì, thấy thế nào) + **thích/muốn** + **đi để làm gì** + **lý do**. Đây là bài nói nhiều nhất trong thi nói.',
      'Mỗi lesson đi 🟢 **Dễ** → 🟡 **Vừa** → 🔴 **Khó**. Làm đủ ba mức theo thứ tự; sai câu nào thì đọc phần giải thích rồi làm lại câu đó.',
      'Mọi câu tiếng Nhật đều có romaji và nghĩa. **Tắt furigana khi làm mức Khó** để quen đề thật.',
      'Quá khứ là chỗ mất điểm nhiều nhất: tính từ い (かった), tính từ な／danh từ (でした), động từ (ました／ませんでした) — đều phải thuộc **cả khẳng định và phủ định**.',
    ]),
    H('Bài 5 gồm những kỹ năng nào?'),
    TABLE(
      ['Thứ tự', 'Lesson', 'Luyện gì', 'Ra trong đề thi nào'],
      [
        ['1', '`lt-b5-tu-vung`', '61 từ của cô: thời gian · nơi chốn · động từ · tính từ', 'Giữa kỳ + cuối kỳ'],
        ['2', '`lt-b5-chu-han`', '12 chữ Hán lớp: 先 週 毎 午 後 見 食 飲 買 物 行 休', 'Chọn cách đọc / chọn chữ'],
        ['3', '`lt-b5-ngu-phap-1`', 'ポイント 37–38: quá khứ động từ + tính từ／danh từ', 'Chia từ · chọn đáp án'],
        ['4', '`lt-b5-ngu-phap-2`', 'ポイント 39–41: 好き／嫌い · ほしい · ～たい', 'Trợ từ が／を · chia'],
        ['5', '`lt-b5-ngu-phap-3`', 'ポイント 42, 43, 46: ～に行きます · どこか · と', 'Trợ từ · hỏi–đáp'],
        ['6', '`lt-b5-ngu-phap-4`', 'ポイント 44, 45, 47: どうして · それから · から', 'Nối câu · lý do'],
        ['7', '`lt-b5-ngu-phap-tron`', 'Trộn tất cả: trợ từ · từ hỏi · chọn · chia · sửa · dịch', 'Giữa kỳ + cuối kỳ'],
        ['8', '`lt-b5-hoi-thoai`', '6 hội thoại mới + tự nói', 'Thi nói (Q&A)'],
        ['9', '`lt-b5-doc-hieu`', '6 đoạn từ ngắn → dài', 'Đọc hiểu + Reading'],
        ['10', '`lt-b5-nghe`', '10 đoạn nghe có bẫy (đổi ý, số, giờ)', 'Nghe'],
        ['11', '`lt-b5-noi-viet`', '4 bộ câu hỏi thi nói + bài viết', 'Thi nói + phần viết'],
        ['12', '`lt-b5-de-tong-hop`', 'Đề đủ phần có giờ + thang điểm', 'Giả lập bài kiểm tra'],
      ],
    ),
    H('Lịch gợi ý 7 ngày (mỗi ngày 45–60 phút)'),
    TABLE(
      ['Ngày', 'Làm'],
      [
        ['1', 'Từ vựng (cả ba mức) + chữ Hán mức Dễ'],
        ['2', 'Chữ Hán Vừa–Khó + ngữ pháp 1 (quá khứ)'],
        ['3', 'Ngữ pháp 2 (好き・ほしい・たい) + nghe 1–4'],
        ['4', 'Ngữ pháp 3–4 (に行きます・どこか・と・どうして・それから・から)'],
        ['5', 'Ngữ pháp trộn + hội thoại 1–4 + đọc hiểu 1–4'],
        ['6', 'Hội thoại 5–6 + nghe 5–10 + nói & viết (thu âm)'],
        ['7', 'Đề tổng hợp 60 phút, không nhìn đáp án; chấm điểm; luyện lại phần yếu'],
      ],
    ),
    NOTE('Mẹo học: ưu tiên khi sắp thi', [
      'Bảng quá khứ 4 loại (V／イA／ナA／N) là **điểm chắc chắn nhất** nếu thuộc. Viết ra giấy, dán lên tường.',
      'Trợ từ trong câu kể: **で** (nơi làm), **に** (gặp ai/đến nơi/thời điểm), **を** (đối tượng), **と** (cùng ai), **が** (thích/muốn/ほしい), **へ** (hướng đến).',
      'Lỗi hay mắc: ~~高いでした~~ (đúng: 高かったです); ~~きれいかったです~~ (đúng: きれいでした); ~~コーヒーを好きです~~ (đúng: コーヒーが好きです).',
    ]),
    MC('lt-b5-lt-vao', 'Kiểm tra đầu vào (12 câu, 8 phút) — sai nhóm nào thì ưu tiên luyện nhóm đó', [
      Q('Từ vựng — 「{先週|せんしゅう}」 nghĩa là gì?', 'Tuần trước', 'Tuần sau | Cuối tuần | Hôm kia', '先週 = せんしゅう = tuần trước.'),
      Q('Từ vựng — Từ nào nghĩa là **bạn cùng phòng**?', 'ルームメイト', '{恋人|こいびと} | {家族|かぞく} | {友達|ともだち}', 'ルームメイト = roommate.'),
      Q('Chữ Hán — 「{毎日|まいにち}」 đọc là gì?', 'まいにち', 'ごにち | まいひ | めいにち', '毎 = まい, 日 = にち.'),
      Q('Chữ Hán — 「{食事|しょくじ}」 đọc là gì?', 'しょくじ', 'しょくごと | たべごと | しょうじ', '食事 = しょくじ.'),
      Q('Quá khứ — 「{食|た}べます」 → quá khứ phủ định:', '{食|た}べませんでした', '{食|た}べません | {食|た}べなかったです | {食|た}べますでした', 'ます → ませんでした.'),
      Q('Quá khứ — 「{高|たか}いです」 → quá khứ:', '{高|たか}かったです', '{高|たか}いでした | {高|たか}くでした | {高|たか}かったでした', 'Tính từ い: い → かったです.'),
      Q('Quá khứ — 「{静|しず}かです」 → quá khứ:', '{静|しず}かでした', '{静|しず}かかったです | {静|しず}かいでした | {静|しず}かだったでした', 'Tính từ な: です → でした.'),
      Q('が — コーヒー＿＿ {好|す}きです。', 'が', 'を | に | で', '好き đi với が.'),
      Q('～たい — 「{飲|の}みます」 → muốn uống:', '{飲|の}みたいです', '{飲|の}むたいです | {飲|の}みますたいです | {飲|の}んだいです', 'Bỏ ます + たいです.'),
      Q('～に行きます — {買|か}い{物|もの}＿＿ {行|い}きます。', 'に', 'を | で | が', 'Mục đích của 行きます: ～に.'),
      Q('どこか — 「どこか{行|い}きましたか。」 trả lời "không đi đâu cả":', 'いいえ、どこも{行|い}きませんでした。', 'いいえ、どこか{行|い}きませんでした。 | いいえ、どこへも{行|い}きます。 | いいえ、どこが{行|い}きませんでした。', 'どこ(へ)も + phủ định.'),
      Q('から — "Vì bận nên không đi":', '{忙|いそが}しいですから、{行|い}きません。', '{行|い}きませんから、{忙|いそが}しいです。 | {忙|いそが}しいが、{行|い}きません。 | {忙|いそが}しいを{行|い}きません。', 'Lý do + から、kết quả.'),
    ]),
    NOTE('Chấm điểm đầu vào', [
      '10–12 đúng: khá vững → làm thẳng mức Vừa–Khó, dành thời gian cho nghe/nói.',
      '6–9 đúng: làm từ mức Dễ của lesson bạn sai.',
      'Dưới 6: làm lần lượt từ lesson 1; mỗi ngày không quá 2 lesson.',
    ]),
  ],
};

/* ───────── 1. TỪ VỰNG ───────── */

const B5_TU_VUNG: Lesson = {
  id: 'lt-b5-tu-vung',
  kind: 'vocab',
  title: 'Luyện thêm Bài 5 — Từ vựng: nhận mặt → điền câu → gõ từ (100 câu)',
  goal: 'Nhận ra và dùng đúng 61 từ trong danh sách Bài 5 của cô — thời gian, nơi chốn, động từ ngày nghỉ, tính từ cảm tưởng — từ nhìn mặt chữ đến tự gõ từ.',
  minutes: 55,
  blocks: [
    NOTE('Cách học bài này', [
      'Nhóm theo **chủ đề** khi học: thời gian (sắp trên một đường thẳng: おととい → 昨日 → 今日 → 明日 → あさって), nơi chốn, động từ ngày nghỉ, tính từ cảm tưởng.',
      '🟡 Vừa: mỗi từ phải nằm **trong câu**, kèm đúng trợ từ (友達**に**会います, 山**に**登ります, 温泉**に**入ります).',
      '🔴 Khó: tự gõ từ khi chỉ có nghĩa Việt. Từ gõ sai thì viết lại 3 lần bằng tay.',
      'Lỗi hay mắc: nhầm **今朝 (けさ)** với 今日; **今晩 (こんばん)** với 今夜; **昨日 (きのう)** ≠ **去年 (きょねん)**; **高い**: cao *hoặc* đắt; và **いい／よい** (気持ちがいい).',
    ]),

    H(`${LV.de} — A. Nhìn từ, chọn nghĩa (16 câu)`),
    MC('lt-b5-tv-nhan-mat', 'A. Nhận mặt từ: chọn nghĩa đúng', [
      Q('{今日|きょう}', 'Hôm nay', 'Hôm qua | Ngày mai | Ngày kia', '今日 = きょう.'),
      Q('{昨日|きのう}', 'Hôm qua', 'Hôm nay | Hôm kia | Năm ngoái', '昨日 = きのう.'),
      Q('おととい', 'Hôm kia', 'Hôm qua | Ngày mai | Ngày kia', 'おととい = 2 ngày trước.'),
      Q('あさって', 'Ngày kia', 'Ngày mai | Hôm kia | Cuối tuần', 'あさって = 2 ngày sau.'),
      Q('{先週|せんしゅう}', 'Tuần trước', 'Tuần sau | Cuối tuần | Tuần này', '先 = trước; 週 = tuần.'),
      Q('{週末|しゅうまつ}', 'Cuối tuần', 'Đầu tuần | Mỗi tuần | Tuần trước', '週末 = しゅうまつ.'),
      Q('{今朝|けさ}', 'Sáng nay', 'Tối nay | Sáng mai | Sáng hôm qua', '今朝 = けさ (đặc biệt).'),
      Q('{先月|せんげつ}', 'Tháng trước', 'Tháng sau | Tháng này | Năm ngoái', '先月 = せんげつ.'),
      Q('{去年|きょねん}', 'Năm ngoái', 'Năm nay | Năm sau | Tháng trước', '去年 = きょねん.'),
      Q('{来年|らいねん}', 'Năm sau', 'Năm ngoái | Năm nay | Tháng sau', '来年 = らいねん.'),
      Q('{今度|こんど}', 'Lần tới, lần này', 'Hôm qua | Tối nay | Cuối tuần', '今度 = こんど: "lần tới" khi nói về kế hoạch.'),
      Q('{今晩|こんばん}', 'Tối nay', 'Sáng nay | Tối qua | Tối mai', '今晩 = こんばん.'),
      Q('{恋人|こいびと}', 'Người yêu', 'Gia đình | Bạn cùng phòng | Bạn bè', '恋人 = こいびと.'),
      Q('{美術館|びじゅつかん}', 'Bảo tàng mỹ thuật', 'Trung tâm thương mại | Thư viện | Nhà ga', '美術館 = びじゅつかん.'),
      Q('ルームメイト', 'Bạn cùng phòng', 'Người yêu | Gia đình | Đồng nghiệp', 'Katakana của roommate: ルームメイト.'),
      Q('{景色|けしき}', 'Phong cảnh', 'Tranh | Ảnh | Thời tiết', '景色 = けしき.'),
    ]),

    H(`${LV.de} — B. Nghĩa Việt → chọn từ (16 câu)`),
    MC('lt-b5-tv-nghia-tu', 'B. Từ nghĩa Việt chọn từ Nhật', [
      Q('Nhà (ngôi nhà)', '{家|いえ}', '{部屋|へや} | {町|まち} | {駅|えき}', '家 = いえ.'),
      Q('Căn phòng', '{部屋|へや}', '{家|いえ} | {町|まち} | {駅|えき}', '部屋 = へや.'),
      Q('Gia đình', '{家族|かぞく}', '{友達|ともだち} | {恋人|こいびと} | {家|いえ}', '家族 = かぞく.'),
      Q('Bạn bè', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | ルームメイト', '友達 = ともだち.'),
      Q('Một mình', '{一人|ひとり}で', '{二人|ふたり}で | {友達|ともだち}と | {家族|かぞく}と', '一人で = ひとりで.'),
      Q('Mua sắm', '{買|か}い{物|もの}します', '{洗濯|せんたく}します | {掃除|そうじ}します | {食事|しょくじ}します', '買い物する = mua sắm.'),
      Q('Giặt giũ', '{洗濯|せんたく}します', '{掃除|そうじ}します | {買|か}い{物|もの}します | {食事|しょくじ}します', '洗濯 = せんたく.'),
      Q('Dọn dẹp, lau dọn', '{掃除|そうじ}します', '{洗濯|せんたく}します | {食事|しょくじ}します | {買|か}い{物|もの}します', '掃除 = そうじ.'),
      Q('Leo, trèo (núi)', '{登|のぼ}ります', '{入|はい}ります | {撮|と}ります | {借|か}ります', '登る = のぼる.'),
      Q('Vào, bước vào', '{入|はい}ります', '{登|のぼ}ります | {撮|と}ります | {借|か}ります', '入る = はいる.'),
      Q('Chụp (ảnh)', '{撮|と}ります', '{登|のぼ}ります | {入|はい}ります | {借|か}ります', '撮る = とる.'),
      Q('Mượn, vay', '{借|か}ります', '{撮|と}ります | {作|つく}ります | {買|か}います', '借りる = かりる. Đừng nhầm 買う (mua).'),
      Q('Gặp, gặp gỡ', '{会|あ}います', '{作|つく}ります | {借|か}ります | {撮|と}ります', '会う = あう (友達**に**会います).'),
      Q('Làm, nấu (món ăn)', '{作|つく}ります', '{会|あ}います | {撮|と}ります | {入|はい}ります', '作る = つくる.'),
      Q('Cảm cúm', '{風邪|かぜ}', '{天気|てんき} | {景色|けしき} | {写真|しゃしん}', '風邪 = かぜ.'),
      Q('Xe đạp', '{自転車|じてんしゃ}', '{電車|でんしゃ} | {新幹線|しんかんせん} | {飛行機|ひこうき}', '自転車 = じてんしゃ.'),
    ]),

    H(`${LV.vua} — C. Chọn từ KHÁC loại (8 câu)`),
    MC('lt-b5-tv-khac-loai', 'C. Một từ khác loại với ba từ còn lại', [
      Q('Chọn từ KHÁC loại: {昨日|きのう} / {今朝|けさ} / {先月|せんげつ} / {部屋|へや}', '{部屋|へや}', '{昨日|きのう} | {今朝|けさ} | {先月|せんげつ}', '3 từ kia chỉ **thời gian**; 部屋 chỉ nơi chốn.'),
      Q('Chọn từ KHÁC loại: {忙|いそが}しい / {楽|たの}しい / {難|むずか}しい / {風邪|かぜ}', '{風邪|かぜ}', '{忙|いそが}しい | {楽|たの}しい | {難|むずか}しい', '3 từ kia là tính từ い; 風邪 là danh từ.'),
      Q('Chọn từ KHÁC loại: {簡単|かんたん} / {大変|たいへん} / {暇|ひま} / {高|たか}い', '{高|たか}い', '{簡単|かんたん} | {大変|たいへん} | {暇|ひま}', '3 từ kia là tính từ な; 高い là tính từ い.'),
      Q('Chọn từ KHÁC loại: {家族|かぞく} / {恋人|こいびと} / {友達|ともだち} / {景色|けしき}', '{景色|けしき}', '{家族|かぞく} | {恋人|こいびと} | {友達|ともだち}', '3 từ kia là **người**; 景色 là cảnh vật.'),
      Q('Chọn từ KHÁC loại: {登|のぼ}ります / {入|はい}ります / {撮|と}ります / {写真|しゃしん}', '{写真|しゃしん}', '{登|のぼ}ります | {入|はい}ります | {撮|と}ります', '3 từ kia là động từ; 写真 là danh từ.'),
      Q('Chọn từ KHÁC loại: {美術館|びじゅつかん} / デパート / {部屋|へや} / {絵|え}', '{絵|え}', '{美術館|びじゅつかん} | デパート | {部屋|へや}', '3 từ kia là **nơi chốn**; 絵 là bức tranh.'),
      Q('Chọn từ KHÁC loại: {好|す}き / {嫌|きら}い / ほしい / それから', 'それから', '{好|す}き | {嫌|きら}い | ほしい', '3 từ kia nói **cảm giác** (thích, ghét, muốn có); それから là từ nối.'),
      Q('Chọn từ KHÁC loại: {買|か}い{物|もの} / {洗濯|せんたく} / {掃除|そうじ} / {去年|きょねん}', '{去年|きょねん}', '{買|か}い{物|もの} | {洗濯|せんたく} | {掃除|そうじ}', '3 từ kia là việc làm với します; 去年 là thời gian.'),
    ]),

    H(`${LV.vua} — D. Điền từ vào câu (16 câu)`),
    MC('lt-b5-tv-dien-tu', 'D. Chọn từ điền vào chỗ trống', [
      Q('{今日|きょう}は{日曜日|にちようび}です。＿＿＿ は{月曜日|げつようび}です。', '{明日|あした}', '{昨日|きのう} | おととい | {去年|きょねん}', 'Ngày mai.'),
      Q('{今日|きょう}は{水曜日|すいようび}です。＿＿＿ は{火曜日|かようび}でした。', '{昨日|きのう}', '{明日|あした} | あさって | {来年|らいねん}', 'Hôm qua.'),
      Q('{今日|きょう}は{日曜日|にちようび}です。{金曜日|きんようび}は＿＿＿でした。', 'おととい', '{昨日|きのう} | {明日|あした} | あさって', 'Chủ nhật − 2 ngày = Thứ sáu → おととい.'),
      Q('{去年|きょねん}は{二千二十五年|にせんにじゅうごねん}でした。＿＿＿ は{二千二十六年|にせんにじゅうろくねん}です。', '{今年|ことし}', '{来年|らいねん} | {先月|せんげつ} | {去年|きょねん}', 'Năm nay.'),
      Q('{友達|ともだち}と＿＿＿ で {買|か}い{物|もの}しました。', 'デパート', '{美術館|びじゅつかん} | {部屋|へや} | {風邪|かぜ}', 'Mua sắm ở trung tâm thương mại.'),
      Q('{絵|え}を{見|み}に＿＿＿ へ{行|い}きます。', '{美術館|びじゅつかん}', 'デパート | {部屋|へや} | {自転車|じてんしゃ}', 'Xem tranh → bảo tàng.'),
      Q('{昨日|きのう}は＿＿＿ でした。うちで{寝|ね}ました。', '{風邪|かぜ}', '{景色|けしき} | {写真|しゃしん} | {絵|え}', 'Ở nhà ngủ vì cảm cúm.'),
      Q('{日曜日|にちようび}は{雨|あめ}でした。＿＿＿ がよくなかったです。', '{天気|てんき}', '{絵|え} | {部屋|へや} | {服|ふく}', '天気がよくなかった.'),
      Q('＿＿＿ で{学校|がっこう}へ{行|い}きます。 (xe 2 bánh, đạp)', '{自転車|じてんしゃ}', '{服|ふく} | {絵|え} | {景色|けしき}', '自転車で行きます.'),
      Q('{山|やま}の＿＿＿ はきれいです。', '{景色|けしき}', '{風邪|かぜ} | {自転車|じてんしゃ} | {服|ふく}', '山の景色.'),
      Q('スマホで＿＿＿ を{撮|と}りました。', '{写真|しゃしん}', '{服|ふく} | {天気|てんき} | {風邪|かぜ}', '写真を撮りました.'),
      Q('{温泉|おんせん}に＿＿＿ ます。 (stem)', '{入|はい}り', '{登|のぼ}り | {撮|と}り | {借|か}り', '温泉に入ります.'),
      Q('{山|やま}に＿＿＿ ます。 (stem)', '{登|のぼ}り', '{入|はい}り | {撮|と}り | {借|か}り', '山に登ります.'),
      Q('{友達|ともだち}に ペンを＿＿＿ ます。 (mượn)', '{借|か}り', '{登|のぼ}り | {作|つく}り | {撮|と}り', '借ります = mượn.'),
      Q('カレーを＿＿＿ ます。 (nấu)', '{作|つく}り', '{会|あ}い | {登|のぼ}り | {入|はい}り', '作ります = làm, nấu.'),
      Q('{友達|ともだち}に＿＿＿ ます。 (gặp)', '{会|あ}い', '{作|つく}り | {撮|と}り | {入|はい}り', '会います.'),
    ]),

    H(`${LV.vua} — E. Từ trái nghĩa và cặp từ (10 câu)`),
    MC('lt-b5-tv-trai-nghia', 'E. Chọn từ TRÁI NGHĨA / từ đối ứng', [
      Q('{高|たか}い (giá đắt) ↔ ?', '{安|やす}い', '{低|ひく}い | {小|ちい}さい | {古|ふる}い', 'Đắt ↔ rẻ.'),
      Q('{簡単|かんたん} ↔ ?', '{難|むずか}しい', '{大変|たいへん} | {暇|ひま} | {楽|たの}しい', 'Dễ ↔ khó.'),
      Q('{忙|いそが}しい ↔ ?', '{暇|ひま}', '{楽|たの}しい | {簡単|かんたん} | {大変|たいへん}', 'Bận ↔ rảnh.'),
      Q('{好|す}き ↔ ?', '{嫌|きら}い', 'ほしい | {楽|たの}しい | {暇|ひま}', 'Thích ↔ ghét.'),
      Q('{昨日|きのう} ↔ ?', '{明日|あした}', '{今朝|けさ} | {去年|きょねん} | おととい', 'Hôm qua ↔ ngày mai.'),
      Q('おととい ↔ ?', 'あさって', '{昨日|きのう} | {明日|あした} | {先週|せんしゅう}', 'Hôm kia ↔ ngày kia.'),
      Q('{先週|せんしゅう} ↔ ?', '{来週|らいしゅう}', '{先月|せんげつ} | {今朝|けさ} | {去年|きょねん}', 'Tuần trước ↔ tuần sau.'),
      Q('{去年|きょねん} ↔ ?', '{来年|らいねん}', '{今朝|けさ} | {先月|せんげつ} | {今晩|こんばん}', 'Năm ngoái ↔ năm sau.'),
      Q('{先月|せんげつ} ↔ ?', '{来月|らいげつ}', '{去年|きょねん} | {今朝|けさ} | {今晩|こんばん}', 'Tháng trước ↔ tháng sau.'),
      Q('{今朝|けさ} ↔ ? (cùng ngày)', '{今晩|こんばん}', '{昨日|きのう} | {来年|らいねん} | {先週|せんしゅう}', 'Sáng nay ↔ tối nay.'),
    ]),

    H(`${LV.vua} — F. Sắp thứ tự thời gian (6 câu)`),
    MC('lt-b5-tv-thu-tu', 'F. Thứ tự đúng từ quá khứ đến tương lai', [
      Q('Thứ tự đúng (xưa → nay → sau):', 'おととい → {昨日|きのう} → {今日|きょう} → {明日|あした} → あさって', '{昨日|きのう} → おととい → {今日|きょう} → あさって → {明日|あした} | あさって → {明日|あした} → {今日|きょう} → {昨日|きのう} → おととい | {今日|きょう} → {昨日|きのう} → おととい → {明日|あした} → あさって', 'Hôm kia → hôm qua → hôm nay → ngày mai → ngày kia.'),
      Q('Thứ tự đúng:', '{去年|きょねん} → {今年|ことし} → {来年|らいねん}', '{来年|らいねん} → {今年|ことし} → {去年|きょねん} | {今年|ことし} → {去年|きょねん} → {来年|らいねん} | {去年|きょねん} → {来年|らいねん} → {今年|ことし}', 'Năm ngoái → năm nay → năm sau.'),
      Q('Thứ tự đúng:', '{先月|せんげつ} → {今月|こんげつ} → {来月|らいげつ}', '{今月|こんげつ} → {先月|せんげつ} → {来月|らいげつ} | {来月|らいげつ} → {今月|こんげつ} → {先月|せんげつ} | {先月|せんげつ} → {来月|らいげつ} → {今月|こんげつ}', 'Tháng trước → tháng này → tháng sau.'),
      Q('Thứ tự đúng:', '{先週|せんしゅう} → {今週|こんしゅう} → {来週|らいしゅう}', '{今週|こんしゅう} → {先週|せんしゅう} → {来週|らいしゅう} | {来週|らいしゅう} → {今週|こんしゅう} → {先週|せんしゅう} | {先週|せんしゅう} → {来週|らいしゅう} → {今週|こんしゅう}', 'Tuần trước → tuần này → tuần sau.'),
      Q('Sáng nay (けさ) trong ngày thuộc…', 'Hôm nay', 'Hôm qua | Ngày mai | Tuần trước', '今朝 = sáng hôm nay.'),
      Q('「{今度|こんど}」 trong câu 「{今度|こんど}の{休|やす}みに」 nghĩa là…', 'Kỳ nghỉ tới', 'Kỳ nghỉ trước | Kỳ nghỉ năm ngoái | Kỳ nghỉ hôm qua', '今度 = lần tới/sắp tới.'),
    ]),

    H(`${LV.kho} — G. Tự gõ từ khi chỉ có nghĩa Việt (12 câu)`),
    QZ('lt-b5-tv-go', 'G. Gõ từ tiếng Nhật (chữ Hán hoặc hiragana)', 'translate', [
      A('Hôm nay', '{今日|きょう}'),
      A('Hôm qua', '{昨日|きのう}'),
      A('Cuối tuần', '{週末|しゅうまつ}'),
      A('Gia đình', '{家族|かぞく}'),
      A('Bạn bè', '{友達|ともだち}'),
      A('Người yêu', '{恋人|こいびと}'),
      A('Xe đạp', '{自転車|じてんしゃ}'),
      A('Phong cảnh', '{景色|けしき}'),
      A('Thú vị, hay', 'おもしろい'),
      A('Vui', '{楽|たの}しい'),
      A('Bận', '{忙|いそが}しい'),
      A('Rảnh rỗi (tính từ な)', '{暇|ひま}'),
    ]),

    H(`${LV.kho} — H. Động từ + trợ từ đi kèm (10 câu)`),
    MC('lt-b5-tv-dong-tu', 'H. Chọn trợ từ đúng', [
      Q('{友達|ともだち}＿＿ {会|あ}います。', 'に', 'を | で | が', '会います đi với に.'),
      Q('{山|やま}＿＿ {登|のぼ}ります。', 'に', 'が | で | と', '登ります đi với に (theo bài học của cô).'),
      Q('{温泉|おんせん}＿＿ {入|はい}ります。', 'に', 'を | で | が', '入ります đi với に.'),
      Q('{写真|しゃしん}＿＿ {撮|と}ります。', 'を', 'に | で | が', '撮ります: tân ngữ + を.'),
      Q('ご{飯|はん}＿＿ {作|つく}ります。', 'を', 'に | で | が', '作ります: tân ngữ + を.'),
      Q('デパート＿＿ {買|か}い{物|もの}しました。', 'で', 'を | に | が', 'Nơi làm hành động + で.'),
      Q('うち＿＿ {洗濯|せんたく}します。', 'で', 'を | に | が', 'で (nơi làm).'),
      Q('ルームメイト＿＿ {掃除|そうじ}します。', 'と', 'を | に | が', 'と = cùng ai.'),
      Q('{友達|ともだち}＿＿ ペンを{借|か}ります。', 'に', 'を | で | が', '友達に借ります (mượn từ bạn).'),
      Q('{恋人|こいびと}＿＿ {映画|えいが}を{見|み}ます。', 'と', 'に | で | が', 'と = cùng người yêu.'),
    ]),

    H(`${LV.kho} — I. Đọc câu, hiểu nghĩa (8 câu)`),
    MC('lt-b5-tv-hieu-cau', 'I. Chọn nghĩa đúng của câu', [
      Q('{先週|せんしゅう}の{週末|しゅうまつ}、{家族|かぞく}と{食事|しょくじ}しました。', 'Cuối tuần trước tôi dùng bữa cùng gia đình.', 'Cuối tuần sau tôi dùng bữa cùng gia đình. | Hôm qua tôi đi ăn một mình. | Cuối tuần trước tôi nấu ăn ở nhà.', '先週の週末 = cuối tuần trước.'),
      Q('{今朝|けさ}、{部屋|へや}を{掃除|そうじ}しました。', 'Sáng nay tôi đã dọn phòng.', 'Tối nay tôi sẽ dọn phòng. | Sáng mai tôi dọn nhà. | Hôm qua tôi giặt đồ.', '今朝 = sáng nay.'),
      Q('{去年|きょねん}、{日本|にほん}の{山|やま}に{登|のぼ}りました。', 'Năm ngoái tôi đã leo núi ở Nhật.', 'Năm sau tôi sẽ leo núi ở Nhật. | Năm nay tôi tắm suối nước nóng. | Hôm qua tôi chụp ảnh núi.', '去年 + 登りました.'),
      Q('{景色|けしき}がよかったですから、{写真|しゃしん}を{撮|と}りました。', 'Vì phong cảnh đẹp nên tôi đã chụp ảnh.', 'Vì ảnh đẹp nên tôi ngắm phong cảnh. | Phong cảnh không đẹp nên không chụp. | Tôi chụp ảnh rồi mới ngắm cảnh.', 'Lý do + から.'),
      Q('{今度|こんど}の{休|やす}みに、{恋人|こいびと}と{美術館|びじゅつかん}へ{行|い}きます。', 'Kỳ nghỉ tới tôi sẽ đến bảo tàng mỹ thuật cùng người yêu.', 'Kỳ nghỉ trước tôi đã đến bảo tàng với gia đình. | Tôi đi bảo tàng một mình hôm qua. | Kỳ nghỉ tới tôi đi siêu thị.', '今度 + 行きます.'),
      Q('{風邪|かぜ}でしたから、{家|いえ}で{寝|ね}ました。', 'Vì bị cảm nên tôi ngủ ở nhà.', 'Vì ngủ ở nhà nên tôi bị cảm. | Tôi bị cảm nên đi chơi. | Tôi ngủ ở nhà, chẳng bị cảm.', '風邪でした + から.'),
      Q('{自転車|じてんしゃ}で{公園|こうえん}へ{行|い}きました。', 'Tôi đã đạp xe đến công viên.', 'Tôi đi bộ đến công viên. | Tôi sẽ đi xe buýt đến công viên. | Tôi đã mượn xe đạp.', '自転車で行きました.'),
      Q('{明日|あした}は{暇|ひま}ですから、{洗濯|せんたく}します。', 'Ngày mai rảnh nên tôi sẽ giặt đồ.', 'Hôm qua rảnh nên tôi giặt đồ. | Ngày mai bận nên không giặt đồ. | Ngày mai tôi giặt đồ cùng bạn.', '暇 + から.'),
    ]),
  ],
};

/* ───────── 2. CHỮ HÁN CỦA LỚP ───────── */

const B5_CHU_HAN: Lesson = {
  id: 'lt-b5-chu-han',
  kind: 'kanji',
  title: 'Luyện thêm Bài 5 — Chữ Hán của lớp: 先 週 毎 午 後 見 食 飲 買 物 行 休 (đọc, nghĩa, chọn chữ, đọc câu)',
  goal: 'Đọc đúng, hiểu nghĩa và nhận mặt 12 chữ Hán Bài 5 của lớp (khớp slide cô) trong từ ghép và trong câu KHÔNG có furigana, như đề thi.',
  minutes: 50,
  blocks: [
    NOTE('Cách học bài này', [
      'Học chữ Hán **theo từ**: 先生 = せんせい, 毎日 = まいにち, 買い物 = かいもの. Đừng cố thuộc âm từng chữ rời.',
      '🟢 Dễ: từ ghép quen và nghĩa. 🟡 Vừa: chữ nhiễu (na ná) + từ đặc biệt. 🔴 Khó: đọc câu và cả đoạn **không furigana**.',
      'Lỗi hay mắc: 先週 **せんしゅう** (trường âm); 午前 **ごぜん** / 午後 **ごご**; 毎年 **まいとし**; 休日 **きゅうじつ**; 食べ物 **たべもの** (たべ + もの) nhưng 人物 **じんぶつ** (on).',
    ]),
    TABLE(
      ['Chữ', 'Hán Việt · nghĩa', 'On', 'Kun', 'Từ cô ghi'],
      [
        ['先', 'TIÊN · trước', 'セン', 'さき', '先生 せんせい · 先日 せんじつ · 先月 せんげつ · 先週 せんしゅう'],
        ['週', 'CHU · tuần', 'シュウ', '—', '一週間 いっしゅうかん · 先週 · 毎週 まいしゅう · 週末 しゅうまつ'],
        ['毎', 'MỖI · mỗi', 'マイ', '—', '毎日 まいにち · 毎週 · 毎年 まいとし · 毎月 まいつき'],
        ['午', 'NGỌ · buổi trưa', 'ゴ', '—', '午前 ごぜん · 午後 ごご'],
        ['後', 'HẬU · sau', 'ゴ・コウ', 'あと・うし(ろ)', '午後 · 前後 ぜんご · 後ろ うしろ · 後で あとで'],
        ['見', 'KIẾN · nhìn', 'ケン', 'み(ます)', '見ます みます · 見学 けんがく · 見えます みえます · 見せます みせます · 見物 けんぶつ'],
        ['食', 'THỰC · ăn', 'ショク', 'た(べます)', '食事 しょくじ · 食べます たべます · 食べ物 たべもの · 飲食 いんしょく'],
        ['飲', 'ẨM · uống', 'イン', 'の(みます)', '飲みます のみます · 飲み物 のみもの · 飲み水 のみみず · 飲食'],
        ['買', 'MÃI · mua', 'バイ', 'か(います)', '買います かいます · 買い物 かいもの'],
        ['物', 'VẬT · đồ vật', 'ブツ・モツ', 'もの', '買い物 · 食べ物 · 飲み物 · 人物 じんぶつ · 見物'],
        ['行', 'HÀNH · đi', 'コウ・ギョウ', 'い(きます)', '行きます いきます'],
        ['休', 'HƯU · nghỉ', 'キュウ', 'やす(み)', '休み やすみ · 休日 きゅうじつ · 休みます やすみます'],
      ],
    ),

    H(`${LV.de} — A. Từ ghép → cách đọc (12 câu)`),
    MC('lt-b5-han-doc-tu', 'A. Từ ghép → cách đọc', [
      Q('「先生」 đọc là…', 'せんせい', 'さきせい | せんしょう | さきなま', '先 = せん (on).'),
      Q('「先週」 đọc là…', 'せんしゅう', 'さきしゅう | せんしゅ | せんしゅー', 'せん・しゅう (trường âm しゅう).'),
      Q('「毎日」 đọc là…', 'まいにち', 'まいひ | めいにち | ごにち', '毎 = まい.'),
      Q('「毎週」 đọc là…', 'まいしゅう', 'まいしゅ | まいしゅー | めいしゅう', 'まい・しゅう.'),
      Q('「午前」 đọc là…', 'ごぜん', 'ごまえ | うまえ | ごせん', '午 = ご; 前 = ぜん → ごぜん (a.m.).'),
      Q('「午後」 đọc là…', 'ごご', 'ごあと | うご | ごうしろ', '午 = ご; 後 = ご → ごご (p.m.).'),
      Q('「食べます」 đọc là…', 'たべます', 'しょくべます | たびます | たべまず', '食 + べます → たべます.'),
      Q('「飲みます」 đọc là…', 'のみます', 'いんみます | のめます | のんます', '飲 + みます → のみます.'),
      Q('「買い物」 đọc là…', 'かいもの', 'ばいぶつ | かいぶつ | かいもつ', '買い (kun) + 物 (もの).'),
      Q('「行きます」 đọc là…', 'いきます', 'ぎょうきます | こうきます | いけます', '行 + きます → いきます.'),
      Q('「休み」 đọc là…', 'やすみ', 'きゅうみ | やすめ | ひろみ', '休み = やすみ (kỳ nghỉ).'),
      Q('「見ます」 đọc là…', 'みます', 'けんます | げんます | みえます', '見 + ます → みます.'),
    ]),

    H(`${LV.de} — B. Hán Việt và nghĩa (10 câu)`),
    MC('lt-b5-han-nghia', 'B. Nghĩa của từng chữ', [
      Q('Chữ 「先」 (TIÊN) nghĩa là…', 'Trước', 'Sau | Mỗi | Tuần', '先週 = tuần trước.'),
      Q('Chữ 「週」 (CHU) nghĩa là…', 'Tuần', 'Tháng | Năm | Ngày', '週 = tuần.'),
      Q('Chữ 「毎」 (MỖI) nghĩa là…', 'Mỗi, hằng', 'Trước | Sau | Cả', '毎日 = mỗi ngày.'),
      Q('Chữ 「午」 (NGỌ) nghĩa là…', 'Buổi trưa, giữa ngày', 'Buổi tối | Buổi sáng sớm | Nửa đêm', '午前・午後 chia theo trưa 12h.'),
      Q('Chữ 「後」 (HẬU) nghĩa là…', 'Sau; phía sau', 'Trước | Giữa | Bên phải', '後ろ = phía sau; 午後 = buổi chiều.'),
      Q('Chữ 「見」 (KIẾN) nghĩa là…', 'Nhìn, xem', 'Nghe | Nói | Ăn', '見ます = xem.'),
      Q('Chữ 「食」 (THỰC) nghĩa là…', 'Ăn', 'Uống | Nấu | Mua', '食べます.'),
      Q('Chữ 「飲」 (ẨM) nghĩa là…', 'Uống', 'Ăn | Nấu | Mua', '飲みます.'),
      Q('Chữ 「買」 (MÃI) nghĩa là…', 'Mua', 'Bán | Ăn | Mượn', '買います.'),
      Q('Chữ 「休」 (HƯU) nghĩa là…', 'Nghỉ ngơi', 'Đi | Đứng | Chạy', '休み = kỳ nghỉ.'),
    ]),

    H(`${LV.vua} — C. Nghe cách đọc, chọn chữ ĐÚNG giữa chữ nhiễu (12 câu)`),
    MC('lt-b5-han-chon-chu', 'C. Cách đọc → chọn chữ Hán đúng', [
      Q('「せんしゅう」 viết là…', '先週', '洗週 | 先周 | 光週', '先 (TIÊN) khác 洗 (rửa) và 光; 週 khác 周.'),
      Q('「まいにち」 viết là…', '毎日', '母日 | 梅日 | 海日', '毎 (mỗi) khác 母 (mẹ).'),
      Q('「ごご」 viết là…', '午後', '牛後 | 干後 | 午役', '午 (ngọ) khác 牛 (bò) và 干.'),
      Q('「うしろ」 viết là…', '後ろ', '役ろ | 復ろ | 従ろ', '後 (HẬU) khác 役 và 復.'),
      Q('「けんがく」 viết là…', '見学', '貝学 | 目学 | 具学', '見 khác 貝 (sò), 目 (mắt).'),
      Q('「しょくじ」 viết là…', '食事', '良事 | 飲事 | 飯事', '食 (ăn) khác 飲 (uống).'),
      Q('「のみもの」 viết là…', '飲み物', '飯み物 | 食み物 | 飲み牧', '飲 (uống) có 欠 bên phải; 食 là ăn.'),
      Q('「かいもの」 viết là…', '買い物', '貝い物 | 員い物 | 買い牧', '買 có 貝 ở dưới và 罒 phía trên; 貝 một mình là sò.'),
      Q('「たべもの」 viết là…', '食べ物', '飲べ物 | 良べ物 | 食べ牧', '食べ物 = đồ ăn.'),
      Q('「きゅうじつ」 viết là…', '休日', '体日 | 林日 | 作日', '休 = 亻 + 木 (người dựa cây nghỉ); 体 là chữ khác.'),
      Q('「いんしょく」 viết là…', '飲食', '食飲 | 飯食 | 飲良', '飲食 (ẩm thực): 飲 trước 食.'),
      Q('「せんげつ」 viết là…', '先月', '洗月 | 光月 | 失月', '先月.'),
    ]),

    H(`${LV.vua} — D. Từ đặc biệt dễ đọc sai (10 câu)`),
    MC('lt-b5-han-bay', 'D. Cẩn thận: cách đọc không theo quy tắc', [
      Q('「毎年」 đọc là…', 'まいとし', 'まいどし | まいとせ | めいとし', 'Theo bảng của cô: 毎年 = まいとし (hằng năm).'),
      Q('「先日」 đọc là…', 'せんじつ', 'せんにち | さきひ | せんび', '先日 = hôm nọ.'),
      Q('「一週間」 đọc là…', 'いっしゅうかん', 'いちしゅうかん | ひとしゅうかん | いっしゅかん', '一 + 週間 → いっしゅうかん (âm ngắt).'),
      Q('「前後」 đọc là…', 'ぜんご', 'まえあと | ぜんあと | まえご', '前後 = trước sau, khoảng.'),
      Q('「見物」 đọc là…', 'けんぶつ', 'けんもの | みぶつ | みもつ', '見物 = けんぶつ (tham quan, ngắm).'),
      Q('「人物」 đọc là…', 'じんぶつ', 'ひともの | にんぶつ | じんもの', '人物 = nhân vật.'),
      Q('「飲み水」 đọc là…', 'のみみず', 'いんすい | のむすい | のみすい', '飲み水 = nước uống.'),
      Q('「見えます」 đọc là…', 'みえます', 'けんえます | みれます | みられます', '見えます = nhìn thấy được.'),
      Q('「見せます」 đọc là…', 'みせます', 'けんせます | みえます | みます', '見せます = cho xem.'),
      Q('「後で」 đọc là…', 'あとで', 'うしろで | ごで | のちで', '後で = lát nữa; 後ろ = phía sau.'),
    ]),

    H(`${LV.vua} — E. Gõ hiragana cho chữ Hán (12 câu)`),
    QZ('lt-b5-han-go', 'E. Viết cách đọc bằng hiragana', 'fill', [
      A('先生 → ?', 'せんせい'),
      A('先月 → ?', 'せんげつ'),
      A('毎週 → ?', 'まいしゅう'),
      A('午前 → ?', 'ごぜん'),
      A('午後 → ?', 'ごご'),
      A('見学 → ?', 'けんがく'),
      A('食事 → ?', 'しょくじ'),
      A('飲み物 → ?', 'のみもの'),
      A('買い物 → ?', 'かいもの'),
      A('食べ物 → ?', 'たべもの'),
      A('休日 → ?', 'きゅうじつ'),
      A('一週間 → ?', 'いっしゅうかん'),
    ]),

    H(`${LV.kho} — F. Đọc to câu KHÔNG furigana (14 câu)`),
    READK('lt-b5-han-doc-cau', 'F. Đọc câu, rồi bấm hiện cách đọc để tự chấm', 'Nhìn 5 giây, đọc to không ngập ngừng; chữ nào dừng lại là chữ chưa thuộc.', [
      RK('{先週|せんしゅう} の {週末|しゅうまつ}、 {友達|ともだち} と {映画|えいが} を {見|み}ました。', 'Cuối tuần trước tôi đã xem phim cùng bạn.'),
      RK('{毎朝|まいあさ}、 コーヒー を {飲|の}みます。', 'Sáng nào tôi cũng uống cà phê.'),
      RK('{午後|ごご}、 デパート で {服|ふく} を {買|か}いました。', 'Buổi chiều tôi đã mua quần áo ở trung tâm thương mại.'),
      RK('{昨日|きのう} は {学校|がっこう} を {休|やす}みました。', 'Hôm qua tôi đã nghỉ học.'),
      RK('{休|やす}みの {日|ひ}、 {一人|ひとり} で {買|か}い{物|もの} に {行|い}きます。', 'Ngày nghỉ tôi đi mua sắm một mình.'),
      RK('{先生|せんせい} の {後|うし}ろ に {絵|え} が あります。', 'Phía sau cô giáo có một bức tranh.'),
      RK('{毎晩|まいばん}、 {家族|かぞく} と {食事|しょくじ} を します。', 'Tối nào tôi cũng dùng bữa cùng gia đình.'),
      RK('{飲|の}み{物|もの} は {何|なに} が いい です か。', 'Bạn muốn đồ uống gì?'),
      RK('{来週|らいしゅう}、 {日本|にほん} の {大学|だいがく} を {見学|けんがく} します。', 'Tuần sau tôi đi tham quan một trường đại học Nhật.'),
      RK('{後|あと} で {昼|ひる}ご{飯|はん} を {食|た}べます。', 'Lát nữa tôi ăn trưa.'),
      RK('{毎週|まいしゅう} {日曜日|にちようび} は {美術館|びじゅつかん} へ {絵|え} を {見|み}に {行|い}きます。', 'Chủ nhật hằng tuần tôi đến bảo tàng mỹ thuật xem tranh.'),
      RK('ここ は {食|た}べ{物|もの} も {飲|の}み{物|もの} も {高|たか}い です。', 'Ở đây đồ ăn lẫn đồ uống đều đắt.'),
      RK('{毎年|まいとし}、 {家族|かぞく} と {温泉|おんせん} に {入|はい}ります。', 'Hằng năm tôi tắm suối nước nóng cùng gia đình.'),
      RK('{先月|せんげつ}、 {京都|きょうと} へ {行|い}きました。 {古|ふる}い お{寺|てら} を {見物|けんぶつ} しました。', 'Tháng trước tôi đã đi Kyoto. Tôi đã tham quan những ngôi chùa cổ.'),
    ]),

    H(`${LV.kho} — G. Đọc to cả đoạn không furigana (3 đoạn)`),
    READK('lt-b5-han-doc-doan', 'G. Đoạn ngắn — đọc liền một hơi', 'Như đề Reading thi nói: chuẩn bị ít giây rồi đọc một lượt, ngắt đúng 「、」「。」.', [
      RK('{先週|せんしゅう} の {日曜日|にちようび}、 {友達|ともだち} と {東京|とうきょう} へ {行|い}きました。 デパート で {買|か}い{物|もの} を しました。 それから、 {食事|しょくじ} を しました。 とても {楽|たの}しかった です。', 'Chủ nhật tuần trước tôi đã đi Tokyo với bạn. Tôi mua sắm ở trung tâm thương mại. Sau đó dùng bữa. Rất vui.'),
      RK('{毎週|まいしゅう} {土曜日|どようび}、 {一人|ひとり} で {美術館|びじゅつかん} へ {絵|え} を {見|み}に {行|い}きます。 {午後|ごご} は {家|いえ} で {洗濯|せんたく} を します。 {休|やす}みの {日|ひ} は {忙|いそが}しい です が、 {楽|たの}しい です。', 'Thứ bảy hằng tuần tôi đi bảo tàng một mình để xem tranh. Buổi chiều giặt đồ ở nhà. Ngày nghỉ bận nhưng vui.'),
      RK('{昨日|きのう} は {休|やす}みでした。 {午前|ごぜん} は {掃除|そうじ} を しました。 {午後|ごご} は {友達|ともだち} と {食|た}べ{物|もの} を {買|か}い に {行|い}きました。 {飲|の}み{物|もの} も {買|か}いました。', 'Hôm qua là ngày nghỉ. Buổi sáng tôi dọn dẹp. Buổi chiều tôi đi mua đồ ăn cùng bạn. Cũng mua đồ uống.'),
    ]),

    H(`${LV.kho} — H. Chọn cách đọc của từ trong 【 】 (10 câu)`),
    MC('lt-b5-han-trong-cau', 'H. Cách đọc đúng của từ trong ngoặc', [
      Q('【先週】は あめでした。', 'せんしゅう', 'さきしゅう | せんしゅ | さんしゅう', '先週 = せんしゅう.'),
      Q('【毎日】べんきょうします。', 'まいにち', 'まいひ | めいにち | ごにち', '毎日 = まいにち.'),
      Q('【午前】は がっこうです。', 'ごぜん', 'ごまえ | うまえ | ごせん', '午前 = ごぜん.'),
      Q('【午後】は やすみです。', 'ごご', 'ごあと | ごうしろ | うご', '午後 = ごご.'),
      Q('【買い物】に いきます。', 'かいもの', 'ばいぶつ | かいぶつ | かいもつ', '買い物.'),
      Q('【食べ物】は なにが すきですか。', 'たべもの', 'しょくぶつ | たべぶつ | くいもの', '食べ物 = たべもの.'),
      Q('【飲み物】を かいます。', 'のみもの', 'いんぶつ | のみぶつ | のむもの', '飲み物 = のみもの.'),
      Q('つくえの【後ろ】', 'うしろ', 'あとろ | ごろ | のちろ', '後ろ = うしろ.'),
      Q('【休日】は かぞくと しょくじします。', 'きゅうじつ', 'やすみひ | きゅうにち | ひろび', '休日 = きゅうじつ.'),
      Q('こうじょうを【見学】します。', 'けんがく', 'みがく | けんがっ | みがくえ', '見学 = けんがく.'),
    ]),

    H(`${LV.kho} — I. Nhóm chữ, mẹo nhớ (6 câu)`),
    MC('lt-b5-han-nhom', 'I. Câu hỏi tổng hợp về 12 chữ Hán', [
      Q('Hai chữ cùng bộ 食 (liên quan ăn uống)?', '食・飲', '買・物 | 先・後 | 行・休', '食 và 飲 đều có bộ 食 (ăn).'),
      Q('Chữ nào gồm người (亻) dựa vào cây (木) = nghỉ ngơi?', '休', '行 | 物 | 後', '休 = 亻 + 木.'),
      Q('Chữ nào KHÔNG liên quan đến thời gian?', '物', '先 | 毎 | 午', '先・毎・午 đi cùng từ thời gian; 物 = đồ vật.'),
      Q('Từ nào có nghĩa "tham quan học tập"?', '見学', '見物 | 買い物 | 食事', '見学 = けんがく.'),
      Q('Cặp từ đối nghĩa: 午前 ↔ ?', '午後', '先週 | 毎日 | 休み', 'A.M. ↔ P.M.'),
      Q('「前後」 trong 「六時前後」 nghĩa là…', 'Khoảng 6 giờ', 'Trước 6 giờ | Sau 6 giờ | Đúng 6 giờ', '前後 = khoảng (trước sau).'),
    ]),

    H('Luyện viết tay'),
    WRITE('lt-b5-han-viet', 'Viết từ có chữ Hán Bài 5', ['先生', '先週', '毎日', '午後', '見ます', '食べます', '飲み物', '買い物', '行きます', '休み'], 'Viết đúng thứ tự nét và đọc to từng từ khi viết.', {
      '先生': 'せんせい · cô giáo',
      '先週': 'せんしゅう · tuần trước',
      '毎日': 'まいにち · mỗi ngày',
      '午後': 'ごご · buổi chiều',
      '見ます': 'みます · xem',
      '食べます': 'たべます · ăn',
      '飲み物': 'のみもの · đồ uống',
      '買い物': 'かいもの · mua sắm',
      '行きます': 'いきます · đi',
      '休み': 'やすみ · kỳ nghỉ',
    }),
  ],
};

/* ───────── 3. NGỮ PHÁP 1 — ポイント 37–38 ───────── */

const B5_NP1: Lesson = {
  id: 'lt-b5-ngu-phap-1',
  kind: 'grammar',
  title: 'Luyện thêm Bài 5 — Ngữ pháp 1: quá khứ động từ (ました／ませんでした), tính từ い／な, danh từ, ～はどうでしたか (ポイント 37–38)',
  goal: 'Chia thành thạo quá khứ khẳng định và phủ định của động từ, tính từ い, tính từ な và danh từ; hỏi và kể "đã làm gì, thấy thế nào" đúng như đề thi.',
  minutes: 65,
  blocks: [
    NOTE('Cách học bài này', [
      '**Học thuộc một bảng**: V ます → ました／ませんでした · イA い → かったです／くなかったです (いい → よかったです／よくなかったです) · ナA／N です → でした／じゃありませんでした. Đọc to cả bảng mỗi ngày.',
      'Nhìn **từ chỉ thời gian** để biết thì: 昨日・先週・今朝・去年 → quá khứ; 明日・来週・今晩・今度 → ます (hiện tại/tương lai).',
      'Lỗi hay mắc: ~~高いでした~~ (đúng: 高かったです); ~~きれいかったです~~ (đúng: きれいでした); ~~いいかったです~~ (đúng: よかったです); ~~食べませんでしたです~~ (không thêm です sau ませんでした).',
    ]),
    TABLE(
      ['Loại', 'Hiện tại +', 'Hiện tại −', 'Quá khứ +', 'Quá khứ −'],
      [
        ['Động từ', '食べます', '食べません', '食べました', '食べませんでした'],
        ['Tính từ い', '高いです', '高くないです', '高かったです', '高くなかったです'],
        ['いい', 'いいです', 'よくないです', 'よかったです', 'よくなかったです'],
        ['Tính từ な', '静かです', '静かじゃありません', '静かでした', '静かじゃありませんでした'],
        ['Danh từ', '雨です', '雨じゃありません', '雨でした', '雨じゃありませんでした'],
      ],
      'Bảng quá khứ 5 dòng cần thuộc lòng',
    ),
    EXS([
      E('{昨日|きのう} {友達|ともだち} に {会|あ}いました。', 'Hôm qua tôi đã gặp bạn.'),
      E('{日曜日|にちようび} は どこ へ も {行|い}きませんでした。', 'Chủ nhật tôi đã không đi đâu cả.'),
      E('{映画|えいが} は おもしろかった です。', 'Bộ phim đã hay.'),
      E('{昨日|きのう} は {雨|あめ} でした。', 'Hôm qua trời mưa.'),
    ]),

    H(`${LV.de} — A. Quá khứ của động từ (14 câu)`),
    MC('lt-b5-g1-dong-tu', 'A. Chọn dạng quá khứ đúng', [
      Q('{食|た}べます → quá khứ khẳng định', '{食|た}べました', '{食|た}べませんでした | {食|た}べたです | {食|た}べるました', 'ます → ました.'),
      Q('{飲|の}みます → quá khứ khẳng định', '{飲|の}みました', '{飲|の}みませんでした | {飲|の}んだです | {飲|の}みるました', 'ます → ました.'),
      Q('{行|い}きます → quá khứ khẳng định', '{行|い}きました', '{行|い}きませんでした | {行|い}ったです | {行|い}くました', 'ます → ました.'),
      Q('{見|み}ます → quá khứ phủ định', '{見|み}ませんでした', '{見|み}ました | {見|み}ません | {見|み}なかったです', 'ます → ませんでした.'),
      Q('{買|か}います → quá khứ phủ định', '{買|か}いませんでした', '{買|か}いました | {買|か}いません | {買|か}わなかったです', 'ます → ませんでした.'),
      Q('{会|あ}います → quá khứ khẳng định', '{会|あ}いました', '{会|あ}いませんでした | {会|あ}ったです | {会|あ}うました', 'ます → ました.'),
      Q('{作|つく}ります → quá khứ phủ định', '{作|つく}りませんでした', '{作|つく}りました | {作|つく}りません | {作|つく}らなかったです', 'ます → ませんでした.'),
      Q('{登|のぼ}ります → quá khứ khẳng định', '{登|のぼ}りました', '{登|のぼ}りませんでした | {登|のぼ}ったです | {登|のぼ}るました', 'ます → ました.'),
      Q('{入|はい}ります → quá khứ phủ định', '{入|はい}りませんでした', '{入|はい}りました | {入|はい}りません | {入|はい}らなかったです', 'ます → ませんでした.'),
      Q('{撮|と}ります → quá khứ khẳng định', '{撮|と}りました', '{撮|と}りませんでした | {撮|と}ったです | {撮|と}るました', 'ます → ました.'),
      Q('{借|か}ります → quá khứ phủ định', '{借|か}りませんでした', '{借|か}りました | {借|か}りません | {借|か}りなかったです', 'ます → ませんでした.'),
      Q('{洗濯|せんたく}します → quá khứ khẳng định', '{洗濯|せんたく}しました', '{洗濯|せんたく}しませんでした | {洗濯|せんたく}したです | {洗濯|せんたく}するました', 'します → しました.'),
      Q('{掃除|そうじ}します → quá khứ phủ định', '{掃除|そうじ}しませんでした', '{掃除|そうじ}しました | {掃除|そうじ}しません | {掃除|そうじ}しなかったです', 'します → しませんでした.'),
      Q('{食事|しょくじ}します → quá khứ khẳng định', '{食事|しょくじ}しました', '{食事|しょくじ}しませんでした | {食事|しょくじ}したです | {食事|しょくじ}するました', 'します → しました.'),
    ]),

    H(`${LV.de} — B. Từ chỉ thời gian quyết định thì (10 câu)`),
    MC('lt-b5-g1-thoi-gian', 'B. Chọn thì đúng theo từ chỉ thời gian', [
      Q('{昨日|きのう}、{友達|ともだち}に＿＿＿。', '{会|あ}いました', '{会|あ}います | {会|あ}いません | {会|あ}いたいです', '昨日 → quá khứ.'),
      Q('{明日|あした}、{友達|ともだち}に＿＿＿。', '{会|あ}います', '{会|あ}いました | {会|あ}いませんでした | {会|あ}わなかったです', '明日 → ます.'),
      Q('{先週|せんしゅう}の{日曜日|にちようび}、{映画|えいが}を＿＿＿。', '{見|み}ました', '{見|み}ます | {見|み}ません | {見|み}ませんです', '先週 → quá khứ.'),
      Q('{来週|らいしゅう}の{日曜日|にちようび}、{映画|えいが}を＿＿＿。', '{見|み}ます', '{見|み}ました | {見|み}ませんでした | {見|み}たです', '来週 → ます.'),
      Q('{今朝|けさ}、コーヒーを＿＿＿。', '{飲|の}みました', '{飲|の}みます | {飲|の}みません | {飲|の}みたいです', '今朝 (đã qua) → ました.'),
      Q('{今晩|こんばん}、{友達|ともだち}と{食事|しょくじ}＿＿＿。', 'します', 'しました | しませんでした | した', '今晩 (sắp tới) → ます.'),
      Q('おととい、デパートへ＿＿＿。', '{行|い}きました', '{行|い}きます | {行|い}きません | {行|い}きたいです', 'おととい → quá khứ.'),
      Q('あさって、{家族|かぞく}と＿＿＿。 ({食事|しょくじ})', '{食事|しょくじ}します', '{食事|しょくじ}しました | {食事|しょくじ}しませんでした | {食事|しょくじ}しなかった', 'あさって → ます.'),
      Q('{去年|きょねん}、{日本|にほん}へ＿＿＿。', '{来|き}ました', '{来|き}ます | {来|き}ません | {来|き}たいです', '去年 → quá khứ (来ました).'),
      Q('{来年|らいねん}、{日本|にほん}へ＿＿＿。', '{来|き}ます', '{来|き}ました | {来|き}ませんでした | {来|き}ませんです', '来年 → ます.'),
    ]),

    H(`${LV.de} — C. Quá khứ của tính từ い／な／danh từ (14 câu)`),
    MC('lt-b5-g1-tinh-tu', 'C. Chọn dạng quá khứ khẳng định đúng', [
      Q('{高|たか}いです → quá khứ', '{高|たか}かったです', '{高|たか}いでした | {高|たか}くでした | {高|たか}かったでした', 'い → かったです.'),
      Q('{安|やす}いです → quá khứ', '{安|やす}かったです', '{安|やす}いでした | {安|やす}くでした | {安|やす}かったでした', 'い → かったです.'),
      Q('{楽|たの}しいです → quá khứ', '{楽|たの}しかったです', '{楽|たの}しいでした | {楽|たの}しくでした | {楽|たの}しかったでした', 'しい → しかったです.'),
      Q('{難|むずか}しいです → quá khứ', '{難|むずか}しかったです', '{難|むずか}しいでした | {難|むずか}しくでした | {難|むずか}しかったでした', 'しい → しかったです.'),
      Q('{忙|いそが}しいです → quá khứ', '{忙|いそが}しかったです', '{忙|いそが}しいでした | {忙|いそが}しくでした | {忙|いそが}しかったでした', 'しい → しかったです.'),
      Q('おもしろいです → quá khứ', 'おもしろかったです', 'おもしろいでした | おもしろくでした | おもしろかったでした', 'い → かったです.'),
      Q('いいです → quá khứ', 'よかったです', 'いかったです | いいでした | いいかったです', 'いい → よかったです (bất quy tắc).'),
      Q('{気持|きも}ちがいいです → quá khứ', '{気持|きも}ちがよかったです', '{気持|きも}ちがいかったです | {気持|きも}ちがいいでした | {気持|きも}ちがよいでした', 'Chứa いい → よかった.'),
      Q('{簡単|かんたん}です → quá khứ', '{簡単|かんたん}でした', '{簡単|かんたん}かったです | {簡単|かんたん}いでした | {簡単|かんたん}くでした', 'Tính từ な: です → でした.'),
      Q('{大変|たいへん}です → quá khứ', '{大変|たいへん}でした', '{大変|たいへん}かったです | {大変|たいへん}いでした | {大変|たいへん}くでした', 'Tính từ な.'),
      Q('{暇|ひま}です → quá khứ', '{暇|ひま}でした', '{暇|ひま}かったです | {暇|ひま}いでした | {暇|ひま}くでした', 'Tính từ な.'),
      Q('{静|しず}かです → quá khứ', '{静|しず}かでした', '{静|しず}かかったです | {静|しず}かいでした | {静|しず}かくでした', 'Tính từ な.'),
      Q('{学生|がくせい}です → quá khứ', '{学生|がくせい}でした', '{学生|がくせい}かったです | {学生|がくせい}いでした | {学生|がくせい}くでした', 'Danh từ: です → でした.'),
      Q('{雨|あめ}です → quá khứ', '{雨|あめ}でした', '{雨|あめ}かったです | {雨|あめ}いでした | {雨|あめ}くでした', 'Danh từ.'),
    ]),

    H(`${LV.vua} — D. Quá khứ phủ định (12 câu)`),
    MC('lt-b5-g1-phu-dinh', 'D. Chọn dạng quá khứ phủ định đúng', [
      Q('{高|たか}いです → quá khứ phủ định', '{高|たか}くなかったです', '{高|たか}かったくないです | {高|たか}くないでした | {高|たか}いじゃありませんでした', 'い → くなかったです.'),
      Q('{忙|いそが}しいです → quá khứ phủ định', '{忙|いそが}しくなかったです', '{忙|いそが}しかったくないです | {忙|いそが}しくないでした | {忙|いそが}しいじゃありませんでした', 'い → くなかったです.'),
      Q('いいです → quá khứ phủ định', 'よくなかったです', 'いくなかったです | いいくなかったです | よかったくないです', 'いい → よくなかった.'),
      Q('{楽|たの}しいです → quá khứ phủ định', '{楽|たの}しくなかったです', '{楽|たの}しくないでした | {楽|たの}しかったじゃありません | {楽|たの}しいくなかったです', 'い → くなかったです.'),
      Q('{簡単|かんたん}です → quá khứ phủ định', '{簡単|かんたん}じゃありませんでした', '{簡単|かんたん}くなかったです | {簡単|かんたん}じゃありません | {簡単|かんたん}かったです', 'な: じゃありませんでした.'),
      Q('{暇|ひま}です → quá khứ phủ định', '{暇|ひま}じゃありませんでした', '{暇|ひま}くなかったです | {暇|ひま}じゃなかったでした | {暇|ひま}でしたじゃありません', 'な: じゃありませんでした.'),
      Q('{雨|あめ}です → quá khứ phủ định', '{雨|あめ}じゃありませんでした', '{雨|あめ}くなかったです | {雨|あめ}ではありませんです | {雨|あめ}じゃありません', 'Danh từ: じゃありませんでした.'),
      Q('{静|しず}かです → quá khứ phủ định', '{静|しず}かじゃありませんでした', '{静|しず}かくなかったです | {静|しず}かないでした | {静|しず}かじゃありません', 'な: じゃありませんでした.'),
      Q('{行|い}きます → quá khứ phủ định', '{行|い}きませんでした', '{行|い}きませんでしたです | {行|い}かなかったです | {行|い}きません', 'ます → ませんでした (không thêm です).'),
      Q('{食|た}べます → quá khứ phủ định', '{食|た}べませんでした', '{食|た}べませんでしたです | {食|た}べなかったです | {食|た}べません', 'ませんでした.'),
      Q('おもしろいです → quá khứ phủ định', 'おもしろくなかったです', 'おもしろいくなかったです | おもしろくないでした | おもしろかったじゃありません', 'い → くなかったです.'),
      Q('{安|やす}いです → quá khứ phủ định', '{安|やす}くなかったです', '{安|やす}いくなかったです | {安|やす}くないでした | {安|やす}かったじゃありません', 'い → くなかったです.'),
    ]),

    H(`${LV.vua} — E. Chia quá khứ theo ngữ cảnh (14 câu, gõ tay)`),
    QZ('lt-b5-g1-chia', 'E. Điền dạng đúng của từ trong ngoặc', 'fill', [
      A('{昨日|きのう}、{友達|ともだち}に（{会|あ}います）。', '{会|あ}いました'),
      A('{先週|せんしゅう}、デパートで{服|ふく}を（{買|か}います）。', '{買|か}いました'),
      A('{今朝|けさ}、コーヒーを（{飲|の}みます）。', '{飲|の}みました'),
      A('{日曜日|にちようび}、どこへも（{行|い}きます）。 (phủ định)', '{行|い}きませんでした'),
      A('{昨日|きのう}の{映画|えいが}は（おもしろいです）。', 'おもしろかったです'),
      A('その{本|ほん}は（{高|たか}いです）。', '{高|たか}かったです'),
      A('テストは（{難|むずか}しいです）。', '{難|むずか}しかったです'),
      A('{先週|せんしゅう}は（{忙|いそが}しいです）。', '{忙|いそが}しかったです'),
      A('{昨日|きのう}の{天気|てんき}は（いいです）。', 'よかったです'),
      A('{日曜日|にちようび}は（{雨|あめ}です）。', '{雨|あめ}でした'),
      A('{昨日|きのう}は（{暇|ひま}です）。', '{暇|ひま}でした'),
      A('その{町|まち}は（{静|しず}かです）。', '{静|しず}かでした'),
      A('テストは（{簡単|かんたん}です）。 (phủ định)', ['{簡単|かんたん}じゃありませんでした', '{簡単|かんたん}ではありませんでした']),
      A('{映画|えいが}は（おもしろいです）。 (phủ định)', ['おもしろくなかったです', 'おもしろくありませんでした']),
    ], 'ます → ました／ませんでした · イA → かったです／くなかったです · ナA／N → でした／じゃありませんでした'),

    H(`${LV.vua} — F. Hỏi – đáp về quá khứ (10 câu)`),
    MC('lt-b5-g1-hoi-dap', 'F. Chọn câu trả lời đúng', [
      Q('「{昨日|きのう}、{何|なに}を しましたか。」', '{友達|ともだち}と{映画|えいが}を{見|み}ました。', '{友達|ともだち}と{映画|えいが}を{見|み}ます。 | {友達|ともだち}と{映画|えいが}を{見|み}ませんです。 | {友達|ともだち}と{映画|えいが}は{見|み}たいです。', 'Hỏi quá khứ → trả lời ました.'),
      Q('「{映画|えいが}は どうでしたか。」', 'おもしろかったです。', 'おもしろいでした。 | おもしろくでした。 | おもしろかったでしたか。', 'Quá khứ của tính từ い.'),
      Q('「{昨日|きのう}は {忙|いそが}しかったですか。」 (không bận)', 'いいえ、{忙|いそが}しくなかったです。', 'いいえ、{忙|いそが}しくないでした。 | いいえ、{忙|いそが}しかったじゃありません。 | いいえ、{忙|いそが}しくなかったでした。', 'い → くなかったです.'),
      Q('「{日曜日|にちようび}は {雨|あめ}でしたか。」 (không mưa)', 'いいえ、{雨|あめ}じゃありませんでした。', 'いいえ、{雨|あめ}くなかったです。 | いいえ、{雨|あめ}じゃありません。 | いいえ、{雨|あめ}じゃなかったでした。', 'Danh từ quá khứ phủ định.'),
      Q('「テストは {簡単|かんたん}でしたか。」 (khó)', 'いいえ、{簡単|かんたん}じゃありませんでした。', 'いいえ、{簡単|かんたん}くなかったです。 | いいえ、{簡単|かんたん}じゃありません。 | いいえ、{簡単|かんたん}かったじゃありません。', 'な: じゃありませんでした.'),
      Q('「{昨日|きのう}、コーヒーを {飲|の}みましたか。」 (không)', 'いいえ、{飲|の}みませんでした。', 'いいえ、{飲|の}みません。 | いいえ、{飲|の}みませんでしたです。 | いいえ、{飲|の}みなかったですか。', 'ませんでした.'),
      Q('「{先週|せんしゅう}、どこか {行|い}きましたか。」 (đi Kyoto)', 'はい、{京都|きょうと}へ{行|い}きました。', 'はい、{京都|きょうと}へ{行|い}きます。 | はい、{京都|きょうと}を{行|い}きませんでした。 | はい、{京都|きょうと}で{行|い}きました。', 'はい + nơi đã đi.'),
      Q('「{天気|てんき}は どうでしたか。」 (tốt)', 'よかったです。', 'いかったです。 | いいでした。 | よいでしたか。', 'いい → よかった.'),
      Q('「{昨日|きのう}のパーティーは どうでしたか。」 (vui)', '{楽|たの}しかったです。', '{楽|たの}しいでした。 | {楽|たの}しくでした。 | {楽|たの}しいかったです。', 'しい → しかった.'),
      Q('「{昨日|きのう}は {暇|ひま}でしたか。」 (rảnh)', 'はい、{暇|ひま}でした。', 'はい、{暇|ひま}かったです。 | はい、{暇|ひま}です。 | はい、{暇|ひま}でしたです。', 'な: でした.'),
    ]),

    H(`${LV.vua} — G. Ghép câu (8 câu)`),
    BUILD('lt-b5-g1-ghep', 'G. Sắp xếp các mảnh thành câu', [
      BD('Hôm qua tôi đã gặp bạn.', '{昨日|きのう} {友達|ともだち} に {会|あ}いました。', ['を', '{会|あ}います']),
      BD('Chủ nhật tôi đã không đi đâu cả.', '{日曜日|にちようび} は どこ へ も {行|い}きませんでした。', ['{行|い}きました']),
      BD('Bộ phim đã hay.', '{映画|えいが} は おもしろかった です。', ['おもしろい', 'でした']),
      BD('Hôm qua trời mưa.', '{昨日|きのう} は {雨|あめ} でした。', ['かったです']),
      BD('Bài kiểm tra đã khó.', 'テスト は {難|むずか}しかった です。', ['{難|むずか}しい', 'でした']),
      BD('Sáng nay tôi đã uống cà phê.', '{今朝|けさ}、 コーヒー を {飲|の}みました。', ['{飲|の}みます']),
      BD('Hôm qua thời tiết đã đẹp.', '{昨日|きのう} は {天気|てんき} が よかった です。', ['いかった']),
      BD('Tuần trước tôi đã rảnh.', '{先週|せんしゅう} は {暇|ひま} でした。', ['かったです']),
    ]),

    H(`${LV.kho} — H. Tìm câu SAI (10 câu)`),
    MC('lt-b5-g1-sai', 'H. Câu nào SAI?', [
      Q('Câu nào SAI?', '{映画|えいが}は おもしろいでした。', '{映画|えいが}は おもしろかったです。 | {映画|えいが}は おもしろくなかったです。 | {映画|えいが}は おもしろいです。', 'Tính từ い: おもしろ**かった**です.'),
      Q('Câu nào SAI?', '{昨日|きのう}は {暇|ひま}かったです。', '{昨日|きのう}は {暇|ひま}でした。 | {昨日|きのう}は {忙|いそが}しかったです。 | {昨日|きのう}は {暇|ひま}じゃありませんでした。', '暇 là tính từ な → 暇**でした**.'),
      Q('Câu nào SAI?', '{天気|てんき}は いいかったです。', '{天気|てんき}は よかったです。 | {天気|てんき}は よくなかったです。 | {天気|てんき}は いいです。', 'いい → よかった.'),
      Q('Câu nào SAI?', '{昨日|きのう}は どこも {行|い}きませんでしたです。', '{昨日|きのう}は どこも {行|い}きませんでした。 | {昨日|きのう}は どこへも {行|い}きませんでした。 | {昨日|きのう}は どこも {行|い}きません。', 'ませんでした không thêm です.'),
      Q('Câu nào SAI?', '{日曜日|にちようび}は {雨|あめ}かったです。', '{日曜日|にちようび}は {雨|あめ}でした。 | {日曜日|にちようび}は {雨|あめ}じゃありませんでした。 | {日曜日|にちようび}は {天気|てんき}がよかったです。', 'Danh từ → でした.'),
      Q('Câu nào SAI?', '{高|たか}くないでした。', '{高|たか}くなかったです。 | {高|たか}かったです。 | {高|たか}くないです。', 'Phủ định quá khứ tính từ い: くなかったです.'),
      Q('Câu nào SAI?', '{明日|あした}、{友達|ともだち}に {会|あ}いました。', '{昨日|きのう}、{友達|ともだち}に {会|あ}いました。 | {明日|あした}、{友達|ともだち}に {会|あ}います。 | {先週|せんしゅう}、{友達|ともだち}に {会|あ}いました。', '明日 (tương lai) không đi với ました.'),
      Q('Câu nào SAI?', '{昨日|きのう}は {静|しず}かくなかったです。', '{昨日|きのう}は {静|しず}かじゃありませんでした。 | {昨日|きのう}は {静|しず}かでした。 | {昨日|きのう}は {静|しず}かではありませんでした。', 'Tính từ な phủ định quá khứ: じゃありませんでした (không dùng くなかった).'),
      Q('Câu nào SAI?', '{昨日|きのう}は {楽|たの}しいでした。', '{昨日|きのう}は {楽|たの}しかったです。 | {昨日|きのう}は {楽|たの}しくなかったです。 | {昨日|きのう}は {忙|いそが}しかったです。', '楽しい → 楽しかったです.'),
      Q('Câu nào SAI?', '{先週|せんしゅう}、{美術館|びじゅつかん}へ {行|い}きません。', '{先週|せんしゅう}、{美術館|びじゅつかん}へ {行|い}きませんでした。 | {先週|せんしゅう}、{美術館|びじゅつかん}へ {行|い}きました。 | {来週|らいしゅう}、{美術館|びじゅつかん}へ {行|い}きません。', '先週 (quá khứ) + 行きません là sai thì.'),
    ]),

    H(`${LV.kho} — I. Dịch Việt → Nhật (6 câu)`),
    QZ('lt-b5-g1-dich', 'I. Dịch sang tiếng Nhật', 'translate', [
      A('Hôm qua tôi đã gặp bạn.', ['{昨日|きのう}、{友達|ともだち}に{会|あ}いました。', '{昨日|きのう}{友達|ともだち}に{会|あ}いました。', '{私|わたし}は{昨日|きのう}、{友達|ともだち}に{会|あ}いました。', '{昨日|きのう}、{友達|ともだち}と{会|あ}いました。'], '昨日 · 友達に会います'),
      A('Chủ nhật tôi đã không đi đâu cả.', ['{日曜日|にちようび}はどこへも{行|い}きませんでした。', '{日曜日|にちようび}はどこも{行|い}きませんでした。', '{日曜日|にちようび}はどこにも{行|い}きませんでした。'], 'どこへも + phủ định'),
      A('Bộ phim đã không hay.', ['{映画|えいが}はおもしろくなかったです。', '{映画|えいが}はおもしろくありませんでした。'], 'おもしろい'),
      A('Hôm qua trời mưa.', '{昨日|きのう}は{雨|あめ}でした。', '雨です → でした'),
      A('Bài kiểm tra tuần trước đã khó.', ['{先週|せんしゅう}のテストは{難|むずか}しかったです。', 'テストは{難|むずか}しかったです。'], '難しい'),
      A('Hôm qua tôi đã rảnh.', ['{昨日|きのう}は{暇|ひま}でした。', '{昨日|きのう}、{暇|ひま}でした。'], '暇です'),
    ], 'V ました／ませんでした · イA かったです／くなかったです · ナA／N でした／じゃありませんでした'),

    H(`${LV.kho} — J. Nhật → Việt (6 câu)`),
    MC('lt-b5-g1-hieu', 'J. Chọn nghĩa đúng', [
      Q('{先週|せんしゅう}の{日曜日|にちようび}は {雨|あめ}でしたから、どこへも {行|い}きませんでした。', 'Chủ nhật tuần trước trời mưa nên tôi không đi đâu cả.', 'Chủ nhật tuần sau trời mưa nên không đi. | Chủ nhật tuần trước tôi đi đâu cũng mưa. | Hôm qua trời mưa nên tôi ở nhà.', '雨でした + から + 行きませんでした.'),
      Q('{昨日|きのう}の{映画|えいが}は おもしろくなかったです。', 'Bộ phim hôm qua đã không hay.', 'Bộ phim hôm qua rất hay. | Bộ phim ngày mai không hay. | Tôi không xem phim hôm qua.', 'おもしろくなかった.'),
      Q('テストは {難|むずか}しかったですが、{楽|たの}しかったです。', 'Bài kiểm tra khó nhưng vui.', 'Bài kiểm tra dễ và vui. | Bài kiểm tra không khó và không vui. | Bài kiểm tra khó nên buồn.', '難しかった + が + 楽しかった.'),
      Q('{昨日|きのう}は {暇|ひま}でしたから、{洗濯|せんたく}しました。', 'Hôm qua rảnh nên tôi đã giặt đồ.', 'Hôm qua bận nên không giặt đồ. | Ngày mai rảnh nên tôi giặt đồ. | Hôm qua tôi giặt đồ xong mới rảnh.', '暇でした + から.'),
      Q('{山|やま}の{景色|けしき}は きれいでした。', 'Phong cảnh trên núi đã đẹp.', 'Phong cảnh trên núi sẽ đẹp. | Phong cảnh trên núi không đẹp. | Tôi leo núi cùng bạn.', 'きれいでした.'),
      Q('{旅行|りょこう}は たいへんでしたが、{景色|けしき}は よかったです。', 'Chuyến đi vất vả nhưng phong cảnh đẹp.', 'Chuyến đi dễ nhưng cảnh không đẹp. | Chuyến đi vui và cảnh đẹp. | Chuyến đi vất vả nên cảnh không đẹp.', 'たいへんでした + が + よかったです.'),
    ]),
  ],
};

/* ───────── 4. NGỮ PHÁP 2 — ポイント 39–41 ───────── */

const B5_NP2: Lesson = {
  id: 'lt-b5-ngu-phap-2',
  kind: 'grammar',
  title: 'Luyện thêm Bài 5 — Ngữ pháp 2: N が 好きです／嫌いです, N が ほしいです, V たいです (ポイント 39–41)',
  goal: 'Nói và hỏi được mình thích gì, ghét gì, muốn có gì, muốn làm gì — đúng trợ từ が／を, chia đúng ～たい (khẳng định, phủ định) và hỏi lại người khác.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      '**Thích, ghét, muốn có** đi với **が** (không phải を): コーヒー**が**好きです, パソコン**が**ほしいです. Đọc to cả cụm 「N が 好き／ほしい」.',
      '**～たい** = bỏ ます + たい (飲みます → 飲み**たい**です). 〜たい chia như **tính từ い**: たくないです (phủ định), たかったです (đã muốn).',
      '**ほしい** và **～たい** dùng cho **người nói** và **người được hỏi** (tôi, bạn). Không dùng để nói về ý muốn của người thứ ba.',
      'Lỗi hay mắc: ~~コーヒーを好きです~~ (đúng: が); ~~飲むたいです~~ (đúng: 飲みたいです); ~~ほしいくないです~~ (đúng: ほしくないです); ~~あまり好きです~~ (đúng: あまり好きじゃありません).',
    ]),
    TABLE(
      ['Mẫu', 'Khẳng định', 'Phủ định', 'Hỏi'],
      [
        ['N が 好きです', 'コーヒーが好きです', 'コーヒーはあまり好きじゃありません', '何が好きですか'],
        ['N が 嫌いです', '雨が嫌いです', '—', 'どんな食べ物が嫌いですか'],
        ['N が ほしいです', '自転車がほしいです', '自転車はほしくないです', '何がほしいですか'],
        ['V たいです', '日本へ行きたいです', '日本へ行きたくないです', 'どこへ行きたいですか'],
      ],
      'Bốn mẫu cần thuộc lòng',
    ),
    EXS([
      E('{私|わたし} は コーヒー が {好|す}き です。', 'Tôi thích cà phê.'),
      E('{私|わたし} は {新|あたら}しい {服|ふく} が ほしい です。', 'Tôi muốn có quần áo mới.'),
      E('{今度|こんど} の {休|やす}みに、 {京都|きょうと} へ {行|い}きたい です。', 'Kỳ nghỉ tới tôi muốn đi Kyoto.'),
      E('{私|わたし} は {雨|あめ} が {嫌|きら}い です。', 'Tôi ghét mưa.'),
    ]),

    H(`${LV.de} — A. Trợ từ が／を／に／へ (14 câu)`),
    MC('lt-b5-g2-tro-tu', 'A. Chọn trợ từ đúng', [
      Q('コーヒー＿＿ {好|す}きです。', 'が', 'を | に | で', '好き đi với が.'),
      Q('{私|わたし}は サッカー＿＿ {好|す}きです。', 'が', 'を | に | で', '好き đi với が.'),
      Q('{私|わたし}は {雨|あめ}＿＿ {嫌|きら}いです。', 'が', 'を | に | で', '嫌い đi với が.'),
      Q('{新|あたら}しい{服|ふく}＿＿ ほしいです。', 'が', 'を | に | で', 'ほしい đi với が.'),
      Q('パソコン＿＿ ほしいです。', 'が', 'を | に | で', 'ほしい đi với が.'),
      Q('{何|なに}＿＿ ほしいですか。', 'が', 'を | に | で', 'ほしい đi với が (cả khi hỏi).'),
      Q('{何|なに}＿＿ {好|す}きですか。', 'が', 'を | に | で', '好き đi với が.'),
      Q('コーヒー＿＿ {飲|の}みたいです。', 'を', 'に | で | へ', '飲みたい: tân ngữ + を.'),
      Q('{映画|えいが}＿＿ {見|み}たいです。', 'を', 'に | で | へ', '見たい: tân ngữ + を.'),
      Q('{京都|きょうと}＿＿ {行|い}きたいです。', 'へ', 'を | が | で', 'Điểm đến + へ (hoặc に).'),
      Q('{友達|ともだち}＿＿ {会|あ}いたいです。', 'に', 'を | で | へ', '会います đi với に → 会いたい vẫn に.'),
      Q('{温泉|おんせん}＿＿ {入|はい}りたいです。', 'に', 'を | で | へ', '入ります đi với に → 入りたい vẫn に.'),
      Q('{写真|しゃしん}＿＿ {撮|と}りたいです。', 'を', 'に | で | へ', '撮る: 写真を撮る.'),
      Q('{山|やま}＿＿ {登|のぼ}りたいです。', 'に', 'が | で | と', '登ります đi với に (theo bài của cô).'),
    ]),

    H(`${LV.de} — B. Chia ～たいです (12 câu)`),
    MC('lt-b5-g2-tai', 'B. Chọn dạng ～たいです đúng', [
      Q('{飲|の}みます → muốn uống', '{飲|の}みたいです', '{飲|の}むたいです | {飲|の}みますたいです | {飲|の}まいたいです', 'Bỏ ます + たいです.'),
      Q('{食|た}べます → muốn ăn', '{食|た}べたいです', '{食|た}べるたいです | {食|た}べますたいです | {食|た}べいたいです', 'Bỏ ます + たいです.'),
      Q('{行|い}きます → muốn đi', '{行|い}きたいです', '{行|い}くたいです | {行|い}きますたいです | {行|い}かたいです', 'Bỏ ます + たいです.'),
      Q('{見|み}ます → muốn xem', '{見|み}たいです', '{見|み}るたいです | {見|み}ますたいです | {見|み}いたいです', 'Bỏ ます + たいです.'),
      Q('{買|か}います → muốn mua', '{買|か}いたいです', '{買|か}うたいです | {買|か}いますたいです | {買|か}わたいです', 'Bỏ ます + たいです.'),
      Q('{会|あ}います → muốn gặp', '{会|あ}いたいです', '{会|あ}うたいです | {会|あ}いますたいです | {会|あ}わたいです', 'Bỏ ます + たいです.'),
      Q('{作|つく}ります → muốn làm/nấu', '{作|つく}りたいです', '{作|つく}るたいです | {作|つく}りますたいです | {作|つく}らたいです', 'Bỏ ます + たいです.'),
      Q('{登|のぼ}ります → muốn leo', '{登|のぼ}りたいです', '{登|のぼ}るたいです | {登|のぼ}りますたいです | {登|のぼ}らたいです', 'Bỏ ます + たいです.'),
      Q('{入|はい}ります → muốn vào', '{入|はい}りたいです', '{入|はい}るたいです | {入|はい}りますたいです | {入|はい}らたいです', 'Bỏ ます + たいです.'),
      Q('{撮|と}ります → muốn chụp', '{撮|と}りたいです', '{撮|と}るたいです | {撮|と}りますたいです | {撮|と}らたいです', 'Bỏ ます + たいです.'),
      Q('{洗濯|せんたく}します → muốn giặt', '{洗濯|せんたく}したいです', '{洗濯|せんたく}するたいです | {洗濯|せんたく}しますたいです | {洗濯|せんたく}さたいです', 'します → したいです.'),
      Q('{買|か}い{物|もの}します → muốn mua sắm', '{買|か}い{物|もの}したいです', '{買|か}い{物|もの}するたいです | {買|か}い{物|もの}しますたいです | {買|か}い{物|もの}さたいです', 'します → したいです.'),
    ]),

    H(`${LV.de} — C. Phủ định (10 câu)`),
    MC('lt-b5-g2-phu-dinh', 'C. Chọn dạng phủ định đúng', [
      Q('{飲|の}みたいです → phủ định', '{飲|の}みたくないです', '{飲|の}みたいくないです | {飲|の}みたいじゃありません | {飲|の}みたくありませんです', 'たい → たくないです (như tính từ い).'),
      Q('{行|い}きたいです → phủ định', '{行|い}きたくないです', '{行|い}きたいくないです | {行|い}きたいじゃありません | {行|い}きないたいです', 'たい → たくないです.'),
      Q('ほしいです → phủ định', 'ほしくないです', 'ほしいくないです | ほしいじゃありません | ほしじゃないです', 'ほしい → ほしくないです.'),
      Q('{好|す}きです → phủ định nhẹ', 'あまり{好|す}きじゃありません', 'あまり{好|す}きです | {好|す}きくないです | あまり{好|す}いくないです', 'Tính từ な: じゃありません; あまり + phủ định.'),
      Q('{嫌|きら}いです → phủ định ("không ghét")', '{嫌|きら}いじゃありません', '{嫌|きら}くないです | {嫌|きら}いくないです | {嫌|きら}いない', 'Tính từ な: じゃありません.'),
      Q('{見|み}たいです → phủ định', '{見|み}たくないです', '{見|み}たいくないです | {見|み}ないたいです | {見|み}たいじゃありません', 'たい → たくない.'),
      Q('{食|た}べたいです → phủ định', '{食|た}べたくないです', '{食|た}べたいくないです | {食|た}べないたいです | {食|た}べたいじゃありません', 'たい → たくない.'),
      Q('{会|あ}いたいです → phủ định', '{会|あ}いたくないです', '{会|あ}いたいくないです | {会|あ}わないたいです | {会|あ}いたいじゃありません', 'たい → たくない.'),
      Q('{買|か}い{物|もの}したいです → phủ định', '{買|か}い{物|もの}したくないです', '{買|か}い{物|もの}したいくないです | {買|か}い{物|もの}しないたいです | {買|か}い{物|もの}したいじゃありません', 'たい → たくない.'),
      Q('{入|はい}りたいです → phủ định', '{入|はい}りたくないです', '{入|はい}りたいくないです | {入|はい}らないたいです | {入|はい}りたいじゃありません', 'たい → たくない.'),
    ]),

    H(`${LV.vua} — D. Chia theo ngữ cảnh (12 câu, gõ tay)`),
    QZ('lt-b5-g2-chia', 'D. Điền dạng đúng của từ trong ngoặc', 'fill', [
      A('{日本|にほん}へ（{行|い}きます）。 (muốn)', '{行|い}きたいです'),
      A('コーヒーを（{飲|の}みます）。 (muốn)', '{飲|の}みたいです'),
      A('{今度|こんど}の{休|やす}みに、{友達|ともだち}に（{会|あ}います）。 (muốn)', '{会|あ}いたいです'),
      A('{写真|しゃしん}を（{撮|と}ります）。 (muốn)', '{撮|と}りたいです'),
      A('{温泉|おんせん}に（{入|はい}ります）。 (muốn)', '{入|はい}りたいです'),
      A('{私|わたし}は {新|あたら}しい{服|ふく}が（ほしいです）。 (phủ định)', ['ほしくないです', 'ほしくありません']),
      A('{私|わたし}は コーヒーが（{好|す}きです）。 (phủ định, あまり)', ['あまり{好|す}きじゃありません', 'あまり{好|す}きではありません']),
      A('{私|わたし}は {雨|あめ}が（{嫌|きら}いです）。 (phủ định)', ['{嫌|きら}いじゃありません', '{嫌|きら}いではありません']),
      A('{今日|きょう}は どこへも（{行|い}きます）。 (không muốn)', ['{行|い}きたくないです', '{行|い}きたくありません']),
      A('{映画|えいが}を（{見|み}ます）。 (không muốn)', ['{見|み}たくないです', '{見|み}たくありません']),
      A('{恋人|こいびと}が（ほしいです）。 (phủ định)', ['ほしくないです', 'ほしくありません']),
      A('{家|いえ}で（{洗濯|せんたく}します）。 (không muốn)', ['{洗濯|せんたく}したくないです', '{洗濯|せんたく}したくありません']),
    ], 'Nがほしい → ほしくない ・ Vたい → Vたくない ・ N が好き → あまり好きじゃありません'),

    H(`${LV.vua} — E. Hỏi – đáp (10 câu)`),
    MC('lt-b5-g2-hoi-dap', 'E. Chọn câu trả lời đúng', [
      Q('「{何|なに}が {好|す}きですか。」', 'コーヒーが{好|す}きです。', 'コーヒーを{好|す}きです。 | コーヒーが{好|す}きいです。 | コーヒーは{好|す}きですか。', '好き đi với が.'),
      Q('「{何|なに}が ほしいですか。」', '{自転車|じてんしゃ}が ほしいです。', '{自転車|じてんしゃ}を ほしいです。 | {自転車|じてんしゃ}が ほしいくないです。 | {自転車|じてんしゃ}に ほしいです。', 'ほしい đi với が.'),
      Q('「どこへ {行|い}きたいですか。」', '{京都|きょうと}へ {行|い}きたいです。', '{京都|きょうと}を {行|い}きたいです。 | {京都|きょうと}へ {行|い}くたいです。 | {京都|きょうと}で {行|い}きます。', '行きたい: へ + 行きたいです.'),
      Q('「{何|なに}を {食|た}べたいですか。」', 'カレーを {食|た}べたいです。', 'カレーが {食|た}べるたいです。 | カレーを {食|た}べないです。 | カレーに {食|た}べたいです。', '食べたいです.'),
      Q('「{雨|あめ}が {好|す}きですか。」 (không thích lắm)', 'いいえ、あまり{好|す}きじゃありません。', 'いいえ、{好|す}きくないです。 | いいえ、あまり{好|す}きです。 | いいえ、{好|す}きじゃありませんでした。', 'あまり + じゃありません.'),
      Q('「パソコンが ほしいですか。」 (không)', 'いいえ、ほしくないです。', 'いいえ、ほしいくないです。 | いいえ、ほしじゃありません。 | いいえ、ほしくありませんでした。', 'ほしい → ほしくない.'),
      Q('「{温泉|おんせん}に {入|はい}りたいですか。」 (không)', 'いいえ、{入|はい}りたくないです。', 'いいえ、{入|はい}りたいくないです。 | いいえ、{入|はい}らないです。 | いいえ、{入|はい}りませんでした。', 'たい → たくない.'),
      Q('「どんな {食|た}べ{物|もの}が {好|す}きですか。」', '{甘|あま}い{食|た}べ{物|もの}が{好|す}きです。', '{甘|あま}い{食|た}べ{物|もの}を{好|す}きです。 | {甘|あま}いが{食|た}べ{物|もの}が{好|す}きです。 | {甘|あま}い{食|た}べ{物|もの}が{好|す}きいです。', 'どんな N が 好きですか → ～が好きです.'),
      Q('「{今度|こんど}の{休|やす}みに、{何|なに}を したいですか。」', '{友達|ともだち}に{会|あ}いたいです。', '{友達|ともだち}を{会|あ}いたいです。 | {友達|ともだち}に{会|あ}うたいです。 | {友達|ともだち}が{会|あ}いたいです。', '会いたいです (に + 会いたい).'),
      Q('「{何|なに}が {嫌|きら}いですか。」', '{雨|あめ}が{嫌|きら}いです。', '{雨|あめ}を{嫌|きら}いです。 | {雨|あめ}が{嫌|きら}いいです。 | {雨|あめ}は{嫌|きら}いでした。', '嫌い đi với が.'),
    ]),

    H(`${LV.vua} — F. が／を／に／へ trộn lẫn (10 câu)`),
    MC('lt-b5-g2-tron-tro-tu', 'F. Chọn trợ từ đúng cho từng chỗ', [
      Q('{私|わたし}は サッカー＿＿ {好|す}きです。', 'が', 'を | に | へ', '好き + が.'),
      Q('{私|わたし}は {映画|えいが}＿＿ {見|み}たいです。', 'を', 'が | に | へ', '見たい + を.'),
      Q('{私|わたし}は {新|あたら}しい{自転車|じてんしゃ}＿＿ ほしいです。', 'が', 'を | に | へ', 'ほしい + が.'),
      Q('{私|わたし}は {日本|にほん}＿＿ {行|い}きたいです。', 'へ', 'を | が | で', '行きたい + へ.'),
      Q('{私|わたし}は {友達|ともだち}＿＿ {会|あ}いたいです。', 'に', 'を | が | へ', '会いたい + に.'),
      Q('{私|わたし}は {海|うみ}＿＿ {好|す}きですが、{山|やま}＿＿ あまり {好|す}きじゃありません。', 'が / は', 'を / が | が / を | に / は', '海**が**好き; 山**は** (đối chiếu hai thứ).'),
      Q('{恋人|こいびと}＿＿ {美術館|びじゅつかん}＿＿ {行|い}きたいです。', 'と / へ', 'に / を | が / に | を / が', 'と (cùng ai) / へ (đến đâu).'),
      Q('{何|なに}＿＿ {食|た}べたいですか。', 'を', 'へ | に | で', '何を 食べたい.'),
      Q('{何|なに}＿＿ {好|す}きですか。', 'が', 'を | に | で', '何が 好き.'),
      Q('{何|なに}＿＿ ほしいですか。', 'が', 'を | に | で', '何が ほしい.'),
    ]),

    H(`${LV.vua} — G. Ghép câu (8 câu)`),
    BUILD('lt-b5-g2-ghep', 'G. Sắp xếp các mảnh thành câu', [
      BD('Tôi thích cà phê.', '{私|わたし} は コーヒー が {好|す}き です。', ['を', 'に']),
      BD('Tôi ghét mưa.', '{私|わたし} は {雨|あめ} が {嫌|きら}い です。', ['を']),
      BD('Tôi muốn có xe đạp mới.', '{私|わたし} は {新|あたら}しい {自転車|じてんしゃ} が ほしい です。', ['を']),
      BD('Kỳ nghỉ tới tôi muốn đi Kyoto.', '{今度|こんど} の {休|やす}みに、 {京都|きょうと} へ {行|い}きたい です。', ['を']),
      BD('Tôi muốn gặp bạn.', '{友達|ともだち} に {会|あ}いたい です。', ['を']),
      BD('Tôi không muốn đi đâu cả.', 'どこ へ も {行|い}きたくない です。', ['{行|い}きたい']),
      BD('Tôi không thích rượu lắm.', 'お{酒|さけ} は あまり {好|す}き じゃありません。', ['が']),
      BD('Bạn muốn ăn gì?', '{何|なに} を {食|た}べたい です か。', ['が']),
    ]),

    H(`${LV.kho} — H. Tìm câu SAI (10 câu)`),
    MC('lt-b5-g2-sai', 'H. Câu nào SAI?', [
      Q('Câu nào SAI?', '{私|わたし}は コーヒーを {好|す}きです。', '{私|わたし}は コーヒーが {好|す}きです。 | {私|わたし}は コーヒーを {飲|の}みたいです。 | {私|わたし}は コーヒーが ほしいです。', '好き đi với が.'),
      Q('Câu nào SAI?', '{私|わたし}は {飲|の}むたいです。', '{私|わたし}は {飲|の}みたいです。 | {私|わたし}は {行|い}きたいです。 | {私|わたし}は {見|み}たいです。', 'V ます bỏ ます + たい (飲み + たい).'),
      Q('Câu nào SAI?', 'ほしいくないです。', 'ほしくないです。 | {行|い}きたくないです。 | {見|み}たくないです。', 'ほしい → ほしくない.'),
      Q('Câu nào SAI?', '{私|わたし}は {自転車|じてんしゃ}を ほしいです。', '{私|わたし}は {自転車|じてんしゃ}が ほしいです。 | {私|わたし}は {自転車|じてんしゃ}で {行|い}きたいです。 | {私|わたし}は {自転車|じてんしゃ}を {見|み}たいです。', 'ほしい đi với が.'),
      Q('Câu nào SAI?', 'あまり {好|す}きです。', 'あまり {好|す}きじゃありません。 | とても {好|す}きです。 | {少|すこ}し {好|す}きです。', 'あまり + phủ định.'),
      Q('Câu nào SAI?', '{友達|ともだち}を {会|あ}いたいです。', '{友達|ともだち}に {会|あ}いたいです。 | {友達|ともだち}と {映画|えいが}を {見|み}たいです。 | {友達|ともだち}と {食事|しょくじ}したいです。', '会います đi với に.'),
      Q('Câu nào SAI?', '{日本|にほん}へ {行|い}きたいでした。', '{日本|にほん}へ {行|い}きたかったです。 | {日本|にほん}へ {行|い}きたいです。 | {日本|にほん}へ {行|い}きたくないです。', 'Quá khứ của たい: たかったです.'),
      Q('Câu nào SAI?', 'ミンさんは ケーキが ほしいです。 (nói về người thứ ba)', '{私|わたし}は ケーキが ほしいです。 | あなたは ケーキが ほしいですか。 | ケーキが ほしいですか。', 'ほしい dùng cho ngôi 1 (tôi) và ngôi 2 (bạn), không dùng để khẳng định ý muốn của người thứ ba.'),
      Q('Câu nào SAI?', '{何|なに}を {好|す}きですか。', '{何|なに}が {好|す}きですか。 | {何|なに}が ほしいですか。 | {何|なに}を {食|た}べたいですか。', '何が 好き (が, không phải を).'),
      Q('Câu nào SAI?', '{嫌|きら}くないです。', '{嫌|きら}いじゃありません。 | {好|す}きじゃありません。 | {嫌|きら}いです。', '嫌い là tính từ な → 嫌いじゃありません.'),
    ]),

    H(`${LV.kho} — I. Dịch Việt → Nhật (6 câu)`),
    QZ('lt-b5-g2-dich', 'I. Dịch sang tiếng Nhật', 'translate', [
      A('Tôi thích cà phê.', ['{私|わたし}はコーヒーが{好|す}きです。', 'コーヒーが{好|す}きです。'], 'N が 好き'),
      A('Tôi muốn có xe đạp mới.', ['{私|わたし}は{新|あたら}しい{自転車|じてんしゃ}がほしいです。', '{新|あたら}しい{自転車|じてんしゃ}がほしいです。'], 'N が ほしい'),
      A('Kỳ nghỉ tới tôi muốn đi Kyoto.', ['{今度|こんど}の{休|やす}みに、{京都|きょうと}へ{行|い}きたいです。', '{今度|こんど}の{休|やす}みに{京都|きょうと}へ{行|い}きたいです。', '{今度|こんど}の{休|やす}み、{京都|きょうと}へ{行|い}きたいです。'], '行きたい'),
      A('Tôi không thích mưa lắm.', ['{私|わたし}は{雨|あめ}があまり{好|す}きじゃありません。', '{雨|あめ}はあまり{好|す}きじゃありません。', '{雨|あめ}があまり{好|す}きじゃありません。', '{私|わたし}は{雨|あめ}はあまり{好|す}きじゃありません。'], 'あまり + phủ định'),
      A('Bạn muốn ăn gì?', ['{何|なに}を{食|た}べたいですか。', 'あなたは{何|なに}を{食|た}べたいですか。'], '何を + Vたい'),
      A('Tôi không muốn đi đâu cả.', ['どこへも{行|い}きたくないです。', 'どこも{行|い}きたくないです。', '{私|わたし}はどこへも{行|い}きたくないです。'], 'どこへも + 行きたくない'),
    ]),

    H(`${LV.kho} — J. Nhật → Việt (6 câu)`),
    MC('lt-b5-g2-hieu', 'J. Chọn nghĩa đúng', [
      Q('{私|わたし}は {山|やま}が {好|す}きですから、{山|やま}に {登|のぼ}りたいです。', 'Vì tôi thích núi nên tôi muốn leo núi.', 'Vì tôi muốn leo núi nên tôi thích núi. | Tôi ghét núi nên không leo. | Tôi thích núi nhưng không muốn leo.', 'Lý do + から.'),
      Q('{新|あたら}しい{服|ふく}が ほしいですが、{高|たか}いです。', 'Tôi muốn có quần áo mới nhưng đắt.', 'Tôi không muốn quần áo mới vì đắt. | Quần áo mới rẻ nên tôi muốn. | Tôi có quần áo mới rồi.', 'ほしい + が + 高い.'),
      Q('{週末|しゅうまつ}は どこへも {行|い}きたくないです。', 'Cuối tuần tôi không muốn đi đâu cả.', 'Cuối tuần tôi muốn đi mọi nơi. | Cuối tuần tôi đã không đi đâu. | Cuối tuần sau tôi muốn đi.', 'どこへも + 行きたくない.'),
      Q('{私|わたし}は ケーキが あまり {好|す}きじゃありません。', 'Tôi không thích bánh ngọt lắm.', 'Tôi rất thích bánh ngọt. | Tôi không có bánh ngọt. | Tôi muốn ăn bánh ngọt.', 'あまり好きじゃない.'),
      Q('{友達|ともだち}と {映画|えいが}を {見|み}たいです。', 'Tôi muốn xem phim cùng bạn.', 'Tôi đã xem phim cùng bạn. | Bạn muốn xem phim. | Tôi không muốn xem phim.', '見たいです.'),
      Q('{雨|あめ}が {嫌|きら}いですから、{今日|きょう}は {家|いえ}で {寝|ね}ます。', 'Vì ghét mưa nên hôm nay tôi ngủ ở nhà.', 'Hôm nay mưa nên tôi thích ở nhà. | Tôi ghét nhà nên đi chơi. | Tôi ngủ ở nhà vì thích mưa.', '嫌い + から.'),
    ]),
  ],
};

/* ───────── 5. NGỮ PHÁP 3 — ポイント 42, 43, 46 ───────── */

const B5_NP3: Lesson = {
  id: 'lt-b5-ngu-phap-3',
  kind: 'grammar',
  title: 'Luyện thêm Bài 5 — Ngữ pháp 3: ～へ ～に行きます, どこか行きましたか, N と V／一人で (ポイント 42, 43, 46)',
  goal: 'Nói và hỏi đi đâu để làm gì, có đi đâu không, đi cùng ai hay đi một mình — dùng đúng へ／に／と／で và dạng V(ます) bỏ ます + に.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      '**Đi để làm gì**: 「Nơi **へ** [V(ます) bỏ ます／danh từ hoạt động] **に** 行きます」: 買います → 買い**に**; 買い物 → 買い物**に**; 食事 → 食事**に**. Chỉ có **một** に (mục đích) và **một** へ (điểm đến).',
      '**どこか** (đâu đó) → trả lời 「はい、**〜へ** 行きました」 hoặc 「いいえ、**どこ(へ)も** 行きませんでした」. どこ(へ)も **luôn đi với phủ định**.',
      '**と** = cùng với người: 友達**と** 映画を見ました. **一人で** = một mình (dùng で, không dùng と). Hỏi người đi cùng: 誰**と**〜ましたか.',
      'Lỗi hay mắc: ~~買うに行きます~~ (đúng: 買いに); ~~友達に映画を見ました~~ (khi đi cùng: と); ~~一人と~~ (đúng: 一人で); ~~どこも行きました~~ (どこも + phủ định).',
    ]),
    TABLE(
      ['Mẫu', 'Ví dụ', 'Hỏi'],
      [
        ['N1 へ V(ます)に 行きます', 'デパートへ 服を 買いに 行きます', 'どこへ 何を しに 行きますか'],
        ['N1 へ N2 に 行きます', '京都へ 旅行に 行きます', ''],
        ['どこか ～ ましたか', 'はい、京都へ行きました ／ いいえ、どこへも行きませんでした', 'どこか 行きましたか'],
        ['N(人)と V', '友達と 食事しました ／ 一人で 行きました', '誰と しましたか'],
      ],
      'Bốn mẫu cần thuộc lòng',
    ),
    EXS([
      E('デパート へ {服|ふく} を {買|か}い に {行|い}きます。', 'Tôi đi trung tâm thương mại để mua quần áo.'),
      E('{京都|きょうと} へ {旅行|りょこう} に {行|い}きます。', 'Tôi đi Kyoto du lịch.'),
      E('{日曜日|にちようび}、 どこ か {行|い}きました か。', 'Chủ nhật bạn có đi đâu không?'),
      E('{友達|ともだち} と {食事|しょくじ} しました。', 'Tôi đã dùng bữa cùng bạn.'),
    ]),

    H(`${LV.de} — A. Dạng V(ます) bỏ ます + に (12 câu)`),
    MC('lt-b5-g3-ni', 'A. Chọn dạng đúng trước に', [
      Q('デパートへ {服|ふく}を＿＿＿に{行|い}きます。 ({買|か}います)', '{買|か}い', '{買|か}う | {買|か}います | {買|か}って', 'V ます bỏ ます + に.'),
      Q('{美術館|びじゅつかん}へ {絵|え}を＿＿＿に{行|い}きます。 ({見|み}ます)', '{見|み}', '{見|み}る | {見|み}ます | {見|み}て', 'V ます bỏ ます + に.'),
      Q('{駅|えき}へ {友達|ともだち}に＿＿＿に{行|い}きます。 ({会|あ}います)', '{会|あ}い', '{会|あ}う | {会|あ}います | {会|あ}って', 'V ます bỏ ます + に.'),
      Q('{海|うみ}へ {写真|しゃしん}を＿＿＿に{行|い}きます。 ({撮|と}ります)', '{撮|と}り', '{撮|と}る | {撮|と}ります | {撮|と}って', 'V ます bỏ ます + に.'),
      Q('{図書館|としょかん}へ {本|ほん}を＿＿＿に{行|い}きます。 ({借|か}ります)', '{借|か}り', '{借|か}りる | {借|か}ります | {借|か}りて', 'V ます bỏ ます + に.'),
      Q('{公園|こうえん}へ ご{飯|はん}を＿＿＿に{行|い}きます。 ({食|た}べます)', '{食|た}べ', '{食|た}べる | {食|た}べます | {食|た}べて', 'V ます bỏ ます + に.'),
      Q('レストランへ＿＿＿に{行|い}きます。 (dùng bữa)', '{食事|しょくじ}', '{食事|しょくじ}します | {食事|しょくじ}を | {食事|しょくじ}する', 'Danh từ hoạt động + に.'),
      Q('デパートへ＿＿＿に{行|い}きます。 (mua sắm)', '{買|か}い{物|もの}', '{買|か}い{物|もの}します | {買|か}い{物|もの}を | {買|か}い{物|もの}する', 'Danh từ hoạt động + に.'),
      Q('{京都|きょうと}へ＿＿＿に{行|い}きます。 (du lịch)', '{旅行|りょこう}', '{旅行|りょこう}します | {旅行|りょこう}を | {旅行|りょこう}する', 'Danh từ hoạt động + に.'),
      Q('うちへ {昼|ひる}ご{飯|はん}を＿＿＿に{帰|かえ}ります。 ({食|た}べます)', '{食|た}べ', '{食|た}べる | {食|た}べます | {食|た}べて', 'に cũng đi với 帰ります.'),
      Q('{日本|にほん}へ {勉強|べんきょう}＿＿＿ {来|き}ました。', 'に', 'を | で | が', 'N hoạt động + に + 来ます.'),
      Q('{公園|こうえん}へ お{花見|はなみ}＿＿＿ {行|い}きます。', 'に', 'を | で | が', 'お花見 + に + 行きます.'),
    ]),

    H(`${LV.de} — B. へ／に／と／で／を (12 câu)`),
    MC('lt-b5-g3-tro-tu', 'B. Chọn trợ từ đúng', [
      Q('{友達|ともだち}＿＿ {映画|えいが}を{見|み}ました。 (cùng bạn)', 'と', 'に | で | が', 'と = cùng với.'),
      Q('{公園|こうえん}＿＿ {行|い}きました。', 'へ', 'を | が | で', 'Điểm đến + へ.'),
      Q('{一人|ひとり}＿＿ {行|い}きました。', 'で', 'と | に | を', '一人で = một mình.'),
      Q('{家族|かぞく}＿＿ {食事|しょくじ}しました。 (cùng gia đình)', 'と', 'に | で | が', 'と = cùng với.'),
      Q('デパート＿＿ {買|か}い{物|もの}しました。', 'で', 'を | に | が', 'Nơi làm hành động + で.'),
      Q('{誰|だれ}＿＿ {行|い}きましたか。', 'と', 'に | で | が', '誰と = cùng ai.'),
      Q('{友達|ともだち}＿＿ {会|あ}いました。 (gặp bạn)', 'に', 'で | を | が', '会います đi với に.'),
      Q('{恋人|こいびと}＿＿ {美術館|びじゅつかん}＿＿ {行|い}きました。', 'と / へ', 'に / を | で / に | が / へ', 'と (cùng ai) + へ (đến đâu).'),
      Q('{昨日|きのう}、{家|いえ}＿＿ {洗濯|せんたく}しました。', 'で', 'を | に | が', 'Nơi làm: で.'),
      Q('{京都|きょうと}＿＿ {旅行|りょこう}＿＿ {行|い}きました。', 'へ / に', 'を / に | で / に | に / へ', 'へ (điểm đến) + に (mục đích).'),
      Q('{友達|ともだち}の{家|いえ}＿＿ ケーキ＿＿ {食|た}べました。', 'で / を', 'に / を | で / が | を / で', 'Nơi làm: で; tân ngữ: を.'),
      Q('{誰|だれ}＿＿ {会|あ}いましたか。', 'に', 'で | を | が', '会います + に (gặp ai).'),
    ]),

    H(`${LV.de} — C. どこか … ましたか (10 câu)`),
    MC('lt-b5-g3-dokoka', 'C. Chọn câu trả lời đúng', [
      Q('「{日曜日|にちようび}、どこか {行|い}きましたか。」 (đi Kyoto)', 'はい、{京都|きょうと}へ{行|い}きました。', 'はい、どこか{行|い}きました。 | はい、{京都|きょうと}へ{行|い}きません。 | はい、{京都|きょうと}を{行|い}きませんでした。', 'はい + nói luôn nơi đã đi.'),
      Q('「{日曜日|にちようび}、どこか {行|い}きましたか。」 (không đi đâu)', 'いいえ、どこへも{行|い}きませんでした。', 'いいえ、どこへ{行|い}きました。 | いいえ、どこか{行|い}きませんでした。 | いいえ、どこへも{行|い}きました。', 'どこへも + phủ định.'),
      Q('「{昨日|きのう}、どこか {行|い}きましたか。」 (không đi đâu)', 'いいえ、どこも{行|い}きませんでした。', 'いいえ、どこも{行|い}きました。 | いいえ、どこが{行|い}きませんでした。 | いいえ、どこを{行|い}きませんでした。', 'どこも + phủ định.'),
      Q('どこ＿＿も {行|い}きませんでした。', 'へ', 'を | が | で', 'どこへも (hoặc どこも).'),
      Q('「どこか {行|い}きましたか」 の{意味|いみ}は？', 'Bạn có đi đâu (đó) không?', 'Bạn đã đi đâu? | Bạn sẽ đi đâu? | Bạn đi bằng gì?', 'どこか = một nơi nào đó chưa xác định.'),
      Q('「どこへ {行|い}きましたか」 の{意味|いみ}は？', 'Bạn đã đi đâu?', 'Bạn có đi đâu không? | Bạn sẽ đi đâu? | Bạn đi bằng gì?', 'どこへ = đi đâu (hỏi nơi cụ thể).'),
      Q('「どこか {行|い}きましたか」 → はい／いいえ が いる？', 'Cần はい／いいえ (câu hỏi có/không)', 'Không cần | Chỉ cần はい | Chỉ cần いいえ', 'どこか… ですか là câu hỏi Yes/No.'),
      Q('「どこへ {行|い}きましたか」 → はい／いいえ が いる？', 'Không cần — trả lời nơi chốn luôn', 'Cần はい | Cần いいえ | Cần cả hai', 'どこへ là từ để hỏi → trả lời thẳng nơi chốn.'),
      Q('「{週末|しゅうまつ}、どこか {行|い}きましたか。」 (đi biển)', 'はい、{海|うみ}へ{行|い}きました。', 'はい、{海|うみ}を{行|い}きました。 | はい、{海|うみ}へ{行|い}きます。 | はい、{海|うみ}で{行|い}きました。', 'はい、〜へ行きました.'),
      Q('「{今朝|けさ}、どこか {行|い}きましたか。」 (không)', 'いいえ、どこへも{行|い}きませんでした。', 'いいえ、どこへも{行|い}きません。 | いいえ、どこへ{行|い}きませんでした。 | いいえ、どこか{行|い}きませんでした。', 'Quá khứ phủ định.'),
    ]),

    H(`${LV.vua} — D. Điền từ (12 câu, gõ tay)`),
    QZ('lt-b5-g3-dien', 'D. Điền từ vào chỗ trống', 'fill', [
      A('デパートへ {服|ふく}を（{買|か}います）に{行|い}きます。', '{買|か}い'),
      A('{美術館|びじゅつかん}へ {絵|え}を（{見|み}ます）に{行|い}きます。', '{見|み}'),
      A('{海|うみ}へ {写真|しゃしん}を（{撮|と}ります）に{行|い}きました。', '{撮|と}り'),
      A('{駅|えき}へ {友達|ともだち}に（{会|あ}います）に{行|い}きます。', '{会|あ}い'),
      A('{京都|きょうと}へ（{旅行|りょこう}します）に{行|い}きます。 (bỏ します)', '{旅行|りょこう}'),
      A('{友達|ともだち}＿＿ {映画|えいが}を{見|み}ました。 (trợ từ)', 'と'),
      A('{一人|ひとり}＿＿ {行|い}きました。 (trợ từ)', 'で'),
      A('{誰|だれ}＿＿ {食事|しょくじ}しましたか。 (trợ từ)', 'と'),
      A('{公園|こうえん}＿＿ {行|い}きました。 (trợ từ chỉ hướng)', ['へ', 'に']),
      A('{日曜日|にちようび}、どこ＿＿ {行|い}きましたか。 (một nơi nào đó)', 'か'),
      A('いいえ、どこ＿＿も{行|い}きませんでした。 (trợ từ)', ['へ', 'に']),
      A('{日本|にほん}へ {勉強|べんきょう}＿＿{来|き}ました。 (trợ từ mục đích)', 'に'),
    ]),

    H(`${LV.vua} — E. Hỏi – đáp (10 câu)`),
    MC('lt-b5-g3-hoi-dap', 'E. Chọn câu trả lời đúng', [
      Q('「どこへ {何|なに}を しに {行|い}きましたか。」 (đi biển chụp ảnh)', '{海|うみ}へ{写真|しゃしん}を{撮|と}りに{行|い}きました。', '{海|うみ}へ{写真|しゃしん}を{撮|と}るに{行|い}きました。 | {海|うみ}を{写真|しゃしん}に{撮|と}り{行|い}きました。 | {海|うみ}で{写真|しゃしん}を{撮|と}って{行|い}きます。', '撮り + に + 行きました.'),
      Q('「{誰|だれ}と {行|い}きましたか。」 (một mình)', '{一人|ひとり}で{行|い}きました。', '{一人|ひとり}と{行|い}きました。 | {一人|ひとり}に{行|い}きました。 | {一人|ひとり}を{行|い}きました。', '一人で.'),
      Q('「{誰|だれ}と {食事|しょくじ}しましたか。」 (cùng gia đình)', '{家族|かぞく}と{食事|しょくじ}しました。', '{家族|かぞく}に{食事|しょくじ}しました。 | {家族|かぞく}で{食事|しょくじ}しました。 | {家族|かぞく}が{食事|しょくじ}しました。', '家族と.'),
      Q('「どこへ {買|か}い{物|もの}に {行|い}きましたか。」', 'デパートへ{行|い}きました。', 'デパートを{行|い}きました。 | デパートで{行|い}きました。 | デパートが{行|い}きました。', 'へ + 行きました.'),
      Q('「{昨日|きのう}、どこで {食事|しょくじ}しましたか。」', 'レストランで{食事|しょくじ}しました。', 'レストランへ{食事|しょくじ}しました。 | レストランと{食事|しょくじ}しました。 | レストランを{食事|しょくじ}しました。', 'Nơi làm hành động: で.'),
      Q('「{何|なに}を しに {京都|きょうと}へ {行|い}きましたか。」', '{旅行|りょこう}に{行|い}きました。', '{旅行|りょこう}を{行|い}きました。 | {旅行|りょこう}で{行|い}きました。 | {旅行|りょこう}が{行|い}きました。', '旅行に行きました.'),
      Q('「{週末|しゅうまつ}、{誰|だれ}に {会|あ}いましたか。」', '{友達|ともだち}に{会|あ}いました。', '{友達|ともだち}を{会|あ}いました。 | {友達|ともだち}で{会|あ}いました。 | {友達|ともだち}が{会|あ}いました。', '会う đi với に: 友達**に**会いました.'),
      Q('「{一人|ひとり}で {行|い}きましたか。」 (không, cùng bạn)', 'いいえ、{友達|ともだち}と{行|い}きました。', 'いいえ、{友達|ともだち}に{行|い}きました。 | いいえ、{友達|ともだち}で{行|い}きました。 | いいえ、{友達|ともだち}を{行|い}きました。', 'と = cùng.'),
      Q('「{家|いえ}へ {何|なに}を しに {帰|かえ}りましたか。」', '{昼|ひる}ご{飯|はん}を{食|た}べに{帰|かえ}りました。', '{昼|ひる}ご{飯|はん}を{食|た}べるに{帰|かえ}りました。 | {昼|ひる}ご{飯|はん}を{食|た}べにを{帰|かえ}りました。 | {昼|ひる}ご{飯|はん}で{食|た}べに{帰|かえ}りました。', '食べ + に + 帰りました.'),
      Q('「{今度|こんど}の{休|やす}みに、どこへ {何|なに}を しに {行|い}きますか。」', '{山|やま}へ{登|のぼ}りに{行|い}きます。', '{山|やま}を{登|のぼ}りに{行|い}きます。 | {山|やま}へ{登|のぼ}るに{行|い}きます。 | {山|やま}で{登|のぼ}りに{行|い}きました。', '登り + に + 行きます (山へ).'),
    ]),

    H(`${LV.vua} — F. Ghép câu (10 câu)`),
    BUILD('lt-b5-g3-ghep', 'F. Sắp xếp các mảnh thành câu', [
      BD('Tôi đi trung tâm thương mại để mua quần áo.', 'デパート へ {服|ふく} を {買|か}い に {行|い}きます。', ['を', '{買|か}う']),
      BD('Tôi đi bảo tàng mỹ thuật để xem tranh.', '{美術館|びじゅつかん} へ {絵|え} を {見|み} に {行|い}きます。', ['で']),
      BD('Tôi đi Kyoto du lịch.', '{京都|きょうと} へ {旅行|りょこう} に {行|い}きます。', ['を']),
      BD('Tôi đi ăn cùng bạn.', '{友達|ともだち} と {食事|しょくじ} に {行|い}きます。', ['に']),
      BD('Chủ nhật bạn có đi đâu không?', '{日曜日|にちようび}、 どこ か {行|い}きました か。', ['を']),
      BD('Không, tôi không đi đâu cả.', 'いいえ、 どこ へ も {行|い}きませんでした。', ['{行|い}きました']),
      BD('Tôi đã đi biển một mình.', '{一人|ひとり} で {海|うみ} へ {行|い}きました。', ['と']),
      BD('Bạn đã dùng bữa với ai?', '{誰|だれ} と {食事|しょくじ} しました か。', ['に']),
      BD('Tôi đã gặp bạn ở ga.', '{駅|えき} で {友達|ともだち} に {会|あ}いました。', ['と']),
      BD('Tôi về nhà để ăn trưa.', 'うち へ {昼|ひる}ご{飯|はん} を {食|た}べ に {帰|かえ}ります。', ['を']),
    ]),

    H(`${LV.kho} — G. Tìm câu SAI (10 câu)`),
    MC('lt-b5-g3-sai', 'G. Câu nào SAI?', [
      Q('Câu nào SAI?', 'デパートへ {服|ふく}を {買|か}うに {行|い}きます。', 'デパートへ {服|ふく}を {買|か}いに {行|い}きます。 | デパートへ {買|か}い{物|もの}に {行|い}きます。 | デパートへ {服|ふく}の {買|か}い{物|もの}に {行|い}きます。', 'Phải dùng V bỏ ます: 買い + に.'),
      Q('Câu nào SAI?', '{友達|ともだち}に {映画|えいが}を {見|み}ました。 (nghĩa: cùng bạn)', '{友達|ともだち}と {映画|えいが}を {見|み}ました。 | {一人|ひとり}で {映画|えいが}を {見|み}ました。 | {家族|かぞく}と {映画|えいが}を {見|み}ました。', 'Cùng với ai → と, không phải に.'),
      Q('Câu nào SAI?', '{一人|ひとり}と {行|い}きました。', '{一人|ひとり}で {行|い}きました。 | {友達|ともだち}と {行|い}きました。 | {家族|かぞく}と {行|い}きました。', 'Một mình → 一人で.'),
      Q('Câu nào SAI?', 'どこも {行|い}きました。', 'どこも {行|い}きませんでした。 | どこかへ {行|い}きました。 | どこへも {行|い}きませんでした。', 'どこ(へ)も + phủ định.'),
      Q('Câu nào SAI?', '{日曜日|にちようび}、どこかを {行|い}きましたか。', '{日曜日|にちようび}、どこか {行|い}きましたか。 | {日曜日|にちようび}、どこかへ {行|い}きましたか。 | {日曜日|にちようび}、どこへ {行|い}きましたか。', 'どこか(へ) — không dùng を.'),
      Q('Câu nào SAI?', '{京都|きょうと}へ {旅行|りょこう}を {行|い}きます。', '{京都|きょうと}へ {旅行|りょこう}に {行|い}きます。 | {京都|きょうと}へ {行|い}きます。 | {京都|きょうと}へ {旅行|りょこう}に {行|い}きました。', 'Mục đích của 行きます: に (không phải を).'),
      Q('Câu nào SAI?', '{駅|えき}へ {友達|ともだち}を {会|あ}いに {行|い}きます。', '{駅|えき}へ {友達|ともだち}に {会|あ}いに {行|い}きます。 | {駅|えき}へ {買|か}い{物|もの}に {行|い}きます。 | {駅|えき}へ {写真|しゃしん}を {撮|と}りに {行|い}きます。', '会います đi với に: 友達**に**会いに行きます.'),
      Q('Câu nào SAI?', '{誰|だれ}で {食事|しょくじ}しましたか。', '{誰|だれ}と {食事|しょくじ}しましたか。 | {誰|だれ}に {会|あ}いましたか。 | {誰|だれ}と {行|い}きましたか。', 'Cùng ai → 誰と.'),
      Q('Câu nào SAI?', '{日本|にほん}へ {勉強|べんきょう}を {来|き}ました。', '{日本|にほん}へ {勉強|べんきょう}に {来|き}ました。 | {日本|にほん}へ {旅行|りょこう}に {来|き}ました。 | {日本|にほん}へ {仕事|しごと}に {来|き}ました。', 'Mục đích: に (không phải を).'),
      Q('Câu nào SAI?', '{海|うみ}へ {写真|しゃしん}を {撮|と}りに {行|い}きません。 (nói về hôm qua)', '{海|うみ}へ {写真|しゃしん}を {撮|と}りに {行|い}きませんでした。 | {海|うみ}へ {写真|しゃしん}を {撮|と}りに {行|い}きました。 | {海|うみ}へ {行|い}きました。', 'Quá khứ cần ませんでした.'),
    ]),

    H(`${LV.kho} — H. Dịch Việt → Nhật (6 câu)`),
    QZ('lt-b5-g3-dich', 'H. Dịch sang tiếng Nhật', 'translate', [
      A('Tôi đi trung tâm thương mại để mua quần áo.', ['デパートへ{服|ふく}を{買|か}いに{行|い}きます。', '{私|わたし}はデパートへ{服|ふく}を{買|か}いに{行|い}きます。'], '買いに行きます'),
      A('Chủ nhật tôi đi Kyoto du lịch.', ['{日曜日|にちようび}、{京都|きょうと}へ{旅行|りょこう}に{行|い}きます。', '{日曜日|にちようび}に、{京都|きょうと}へ{旅行|りょこう}に{行|い}きます。', '{日曜日|にちようび}は{京都|きょうと}へ{旅行|りょこう}に{行|い}きます。'], '旅行に行きます'),
      A('Hôm qua bạn có đi đâu không?', ['{昨日|きのう}、どこか{行|い}きましたか。', '{昨日|きのう}、どこかへ{行|い}きましたか。'], 'どこか'),
      A('Không, tôi đã không đi đâu cả.', ['いいえ、どこへも{行|い}きませんでした。', 'いいえ、どこも{行|い}きませんでした。'], 'どこ(へ)も'),
      A('Tôi đã dùng bữa cùng bạn.', ['{友達|ともだち}と{食事|しょくじ}しました。', '{友達|ともだち}と{食事|しょくじ}をしました。'], '友達と'),
      A('Tôi đã đi biển một mình.', ['{一人|ひとり}で{海|うみ}へ{行|い}きました。', '{海|うみ}へ{一人|ひとり}で{行|い}きました。'], '一人で'),
    ]),

    H(`${LV.kho} — I. Nhật → Việt (6 câu)`),
    MC('lt-b5-g3-hieu', 'I. Chọn nghĩa đúng', [
      Q('{先週|せんしゅう}の{日曜日|にちようび}、{友達|ともだち}と{海|うみ}へ{写真|しゃしん}を{撮|と}りに{行|い}きました。', 'Chủ nhật tuần trước tôi đã cùng bạn ra biển để chụp ảnh.', 'Chủ nhật tuần sau tôi sẽ ra biển một mình. | Chủ nhật tuần trước tôi đã chụp ảnh biển ở nhà. | Hôm qua tôi gặp bạn ở biển.', '友達と + 海へ + 撮りに行きました.'),
      Q('{昨日|きのう}は どこへも {行|い}きませんでした。 {家|いえ}で {洗濯|せんたく}しました。', 'Hôm qua tôi không đi đâu cả. Tôi giặt đồ ở nhà.', 'Hôm qua tôi đi mọi nơi. Tôi giặt đồ ở nhà. | Hôm qua tôi giặt đồ ở tiệm. | Ngày mai tôi sẽ không đi đâu.', 'どこへも + phủ định.'),
      Q('{一人|ひとり}で {美術館|びじゅつかん}へ {絵|え}を {見|み}に {行|い}きました。', 'Tôi đã một mình đến bảo tàng mỹ thuật để xem tranh.', 'Tôi đã đến bảo tàng cùng bạn. | Tôi sẽ một mình đi xem tranh. | Tôi vẽ tranh ở bảo tàng.', '一人で + 見に行きました.'),
      Q('{昼|ひる}ご{飯|はん}を {食|た}べに {家|いえ}へ {帰|かえ}ります。', 'Tôi về nhà để ăn trưa.', 'Tôi ăn trưa rồi về nhà. | Tôi ăn trưa cùng gia đình. | Tôi mua bữa trưa ở nhà.', '食べに + 帰ります.'),
      Q('{誰|だれ}と {食事|しょくじ}しましたか。 — {恋人|こいびと}と です。', 'Bạn đã dùng bữa với ai? — Với người yêu.', 'Bạn gặp ai? — Người yêu. | Bạn sẽ ăn ở đâu? — Với người yêu. | Ai dùng bữa với bạn? — Bạn tôi.', '誰と + と.'),
      Q('{日本|にほん}へ {勉強|べんきょう}に {来|き}ました。', 'Tôi đã đến Nhật để học.', 'Tôi đã học ở Nhật. | Tôi sẽ đến Nhật học. | Tôi đã học xong ở Nhật.', '勉強に来ました.'),
    ]),
  ],
};

/* ───────── 6. NGỮ PHÁP 4 — ポイント 44, 45, 47 ───────── */

const B5_NP4: Lesson = {
  id: 'lt-b5-ngu-phap-4',
  kind: 'grammar',
  title: 'Luyện thêm Bài 5 — Ngữ pháp 4: どうして～か → ～から, それから, ～から、～ (ポイント 44, 45, 47)',
  goal: 'Hỏi và nêu lý do (どうして — ～から), nối các việc theo thứ tự thời gian bằng それから, và đặt đúng thứ tự lý do → kết quả.',
  minutes: 55,
  blocks: [
    NOTE('Cách học bài này', [
      '**Lý do đứng TRƯỚC** từ **から**, kết quả đứng sau: 「忙しい**ですから**、行きません」 = vì bận nên không đi. Tiếng Việt nói "không đi vì bận" (kết quả trước) — đừng dịch từng chữ.',
      'Trả lời **どうして** luôn kết thúc bằng **～から**(です): 「どうして行きませんでしたか。」「忙しかったですから。」',
      '**それから** = sau đó, rồi thì: nối các việc theo **đúng thứ tự thời gian**. Câu hỏi giục kể tiếp: 「それから？」',
      'Lỗi hay mắc: kết quả đặt trước から (~~行きませんから、忙しいです~~); dùng から thay が (nhưng); dùng そして cho chuỗi việc theo thứ tự (đúng là それから).',
    ]),
    TABLE(
      ['Mẫu', 'Ví dụ', 'Nghĩa'],
      [
        ['どうして ～か', 'どうして 行きませんでしたか', 'Tại sao không đi?'],
        ['～から(です)', '忙しかったですから', 'Vì bận.'],
        ['Lý do から、Kết quả', '忙しかったですから、行きませんでした', 'Vì bận nên không đi.'],
        ['Câu1。それから、Câu2。', '朝、ご飯を食べました。それから、学校へ行きました。', 'Sáng ăn cơm. Sau đó đi học.'],
      ],
      'Bốn mẫu cần thuộc lòng',
    ),
    EXS([
      E('どうして {行|い}きません でした か。', 'Tại sao bạn đã không đi?'),
      E('{忙|いそが}しかった です から。', 'Vì bận.'),
      E('{雨|あめ} でした から、 どこ へ も {行|い}きません でした。', 'Vì trời mưa nên tôi không đi đâu cả.'),
      E('{朝|あさ}、 ご{飯|はん} を {食|た}べました。 それから、 {学校|がっこう} へ {行|い}きました。', 'Sáng tôi ăn cơm. Sau đó tôi đi học.'),
    ]),

    H(`${LV.de} — A. それから hay から hay が? (12 câu)`),
    MC('lt-b5-g4-noi', 'A. Chọn từ nối đúng', [
      Q('{朝|あさ}、ご{飯|はん}を{食|た}べました。＿＿＿、{学校|がっこう}へ{行|い}きました。', 'それから', 'どうして | から | が', 'Hai việc theo thứ tự thời gian → それから.'),
      Q('{雨|あめ}でした＿＿＿、どこへも{行|い}きませんでした。 (vì mưa nên)', 'から', 'それから | どうして | が', 'Lý do + から.'),
      Q('{安|やす}かった＿＿＿、{買|か}いました。 (vì rẻ nên)', 'から', 'それから | どうして | を', 'Lý do + から.'),
      Q('デパートで{買|か}い{物|もの}しました。＿＿＿、{食事|しょくじ}しました。', 'それから', 'どうして | から | が', 'Thứ tự thời gian → それから.'),
      Q('＿＿＿ {行|い}きませんでしたか。', 'どうして', 'それから | から | どんな', 'Hỏi lý do → どうして.'),
      Q('{高|たか}かった＿＿＿、{買|か}いませんでした。 (vì đắt nên)', 'から', 'それから | どうして | を', 'Lý do + から.'),
      Q('{楽|たの}しかった＿＿＿、また{行|い}きたいです。 (vì vui nên)', 'から', 'それから | どうして | を', 'Lý do + から.'),
      Q('{友達|ともだち}に{会|あ}いました。＿＿＿、{一緒|いっしょ}に{食事|しょくじ}しました。', 'それから', 'どうして | から | が', 'Hai việc theo thứ tự → それから.'),
      Q('A：{昨日|きのう}は{学校|がっこう}を{休|やす}みました。 B：＿＿＿ですか。', 'どうして', 'それから | から | どんな', 'Hỏi lại lý do: どうしてですか.'),
      Q('A：どうして{休|やす}みましたか。 B：{風邪|かぜ}でした＿＿＿。', 'から', 'それから | どうして | が', 'Trả lời lý do → ～から.'),
      Q('A：{昨日|きのう}、{友達|ともだち}に{会|あ}いました。 B：＿＿＿？ (giục kể tiếp)', 'それから', 'どうして | から | が', '「それから？」 = rồi sao nữa?'),
      Q('{忙|いそが}しかった＿＿＿、どこへも{行|い}きませんでした。', 'から', 'それから | どうして | を', 'Lý do + から.'),
    ]),

    H(`${LV.de} — B. Đúng thứ tự lý do → kết quả (10 câu)`),
    MC('lt-b5-g4-thu-tu', 'B. Chọn câu có thứ tự đúng', [
      Q('Câu nào = "Vì bận nên tôi không đi"?', '{忙|いそが}しいですから、{行|い}きません。', '{行|い}きませんから、{忙|いそが}しいです。 | {忙|いそが}しいが、{行|い}きません。 | {行|い}きません、{忙|いそが}しい。', 'Lý do (忙しい) + から、kết quả.'),
      Q('Câu nào = "Vì trời mưa nên tôi ở nhà"?', '{雨|あめ}ですから、{家|いえ}で{寝|ね}ます。', '{家|いえ}で{寝|ね}ますから、{雨|あめ}です。 | {雨|あめ}ですが、{家|いえ}で{寝|ね}ます。 | {雨|あめ}ですから、{家|いえ}で{寝|ね}ません。', 'Lý do + から.'),
      Q('Câu nào = "Vì rẻ nên tôi mua"?', '{安|やす}いですから、{買|か}います。', '{買|か}いますから、{安|やす}いです。 | {安|やす}いが、{買|か}います。 | {安|やす}いですから、{買|か}いません。', 'Lý do + から.'),
      Q('Câu nào = "Vì khó nên không thích"?', '{難|むずか}しいですから、{好|す}きじゃありません。', '{好|す}きじゃありませんから、{難|むずか}しいです。 | {難|むずか}しいが、{好|す}きです。 | {難|むずか}しいですから、{好|す}きです。', 'Lý do + から.'),
      Q('Câu nào = "Vì bị cảm nên tôi đã nghỉ học"?', '{風邪|かぜ}でしたから、{学校|がっこう}を{休|やす}みました。', '{学校|がっこう}を{休|やす}みましたから、{風邪|かぜ}でした。 | {風邪|かぜ}でしたが、{学校|がっこう}を{休|やす}みました。 | {風邪|かぜ}でしたから、{学校|がっこう}へ{行|い}きました。', 'Lý do (風邪でした) + から.'),
      Q('Câu nào = "Tôi đã không đi vì bận"?', '{忙|いそが}しかったですから、{行|い}きませんでした。', '{行|い}きませんでしたから、{忙|いそが}しかったです。 | {忙|いそが}しかったですが、{行|い}きませんでした。 | {忙|いそが}しかったですから、{行|い}きました。', 'Lý do + から、kết quả.'),
      Q('Câu nào = "Tôi đã không đi vì bận" (kể kết quả trước, lý do sau)?', '{行|い}きませんでした。{忙|いそが}しかったですから。', '{行|い}きませんでした。{忙|いそが}しかったが。 | {行|い}きませんでしたから。{忙|いそが}しかったです。 | {忙|いそが}しかったから。{行|い}きません。', 'Kết quả。Lý do から。'),
      Q('Câu nào = "Vì ngon nên tôi muốn ăn lần nữa"?', 'おいしいですから、また{食|た}べたいです。', '{食|た}べたいですから、おいしいです。 | おいしいが、また{食|た}べたいです。 | おいしいですから、{食|た}べたくないです。', 'Lý do + から.'),
      Q('Trả lời cho 「どうして？」 nào ĐÚNG?', '{好|す}きですから。', '{好|す}きです。 | {好|す}きでから。 | から{好|す}きです。', 'Kết thúc bằng ～ですから.'),
      Q('「どうして {日本語|にほんご}を {勉強|べんきょう}しますか。」 trả lời:', '{日本|にほん}へ {行|い}きたいですから。', '{日本|にほん}へ {行|い}きたいです が。 | {日本|にほん}へ {行|い}きますが。 | から {日本|にほん}へ {行|い}きたいです。', 'Lý do + ですから.'),
    ]),

    H(`${LV.vua} — C. Điền từ (12 câu, gõ tay)`),
    QZ('lt-b5-g4-dien', 'C. Điền từ vào chỗ trống', 'fill', [
      A('＿＿＿ {行|い}きませんでしたか。 (hỏi lý do)', 'どうして'),
      A('{忙|いそが}しかったです＿＿＿。 (trả lời lý do)', 'から'),
      A('{雨|あめ}でした＿＿＿、どこへも{行|い}きませんでした。', 'から'),
      A('{朝|あさ}、ご{飯|はん}を{食|た}べました。＿＿＿、{学校|がっこう}へ{行|い}きました。', 'それから'),
      A('{高|たか}かったです＿＿＿、{買|か}いませんでした。 (vì đắt nên)', 'から'),
      A('A：{昨日|きのう}は{休|やす}みました。 B：＿＿＿ですか。 (hỏi lại lý do)', 'どうして'),
      A('{安|やす}かったです＿＿＿、{買|か}いました。 (vì rẻ nên)', 'から'),
      A('{友達|ともだち}に{会|あ}いました。＿＿＿、{映画|えいが}を{見|み}ました。', 'それから'),
      A('{風邪|かぜ}でした＿＿＿、{寝|ね}ました。 (vì cảm nên)', 'から'),
      A('{楽|たの}しかった＿＿＿、また{行|い}きたいです。 (vì vui nên)', 'から'),
      A('A：デパートへ{行|い}きました。 B：＿＿＿？ (giục kể tiếp)', 'それから'),
      A('どうして{勉強|べんきょう}しませんでしたか。 — {暇|ひま}じゃありませんでした＿＿＿。', 'から'),
    ]),

    H(`${LV.vua} — D. Hỏi – đáp lý do (10 câu)`),
    MC('lt-b5-g4-hoi-dap', 'D. Chọn câu trả lời đúng', [
      Q('「どうして {行|い}きませんでしたか。」', '{忙|いそが}しかったですから。', '{忙|いそが}しかったです が。 | {忙|いそが}しかったですか。 | {行|い}きませんでした から。', 'Lý do + ですから.'),
      Q('「どうして {買|か}いませんでしたか。」', '{高|たか}かったですから。', '{高|たか}かったが。 | {買|か}いませんでしたから。 | {高|たか}かったでしたから。', 'Lý do + ですから.'),
      Q('「どうして {日本語|にほんご}を {勉強|べんきょう}しますか。」', '{日本|にほん}へ {行|い}きたいですから。', '{日本|にほん}へ {行|い}きたいが。 | {日本|にほん}が {好|す}きですか。 | どうして {日本|にほん}ですか。', 'Lý do + ですから.'),
      Q('「どうして {学校|がっこう}を {休|やす}みましたか。」', '{風邪|かぜ}でしたから。', '{風邪|かぜ}ですか。 | {風邪|かぜ}でしたが。 | {風邪|かぜ}ですませんから。', '風邪でしたから.'),
      Q('「どうして {京都|きょうと}へ {行|い}きたいですか。」', '{古|ふる}いお{寺|てら}が {見|み}たいですから。', '{古|ふる}いお{寺|てら}を {見|み}ました。 | {古|ふる}いお{寺|てら}が {見|み}るですから。 | から {古|ふる}いお{寺|てら}です。', 'Lý do (…たい) + ですから.'),
      Q('「{昨日|きのう}、{何|なに}を しましたか。」 → câu nào dùng それから ĐÚNG?', '{買|か}い{物|もの}しました。それから、{食事|しょくじ}しました。', '{買|か}い{物|もの}しました。から、{食事|しょくじ}しました。 | {買|か}い{物|もの}しましたから、{食事|しょくじ}しました。 | それから、{買|か}い{物|もの}しました。', 'Câu1。それから、Câu2。'),
      Q('「どうしてですか。」 nghĩa là…', 'Tại sao vậy?', 'Ở đâu vậy? | Với ai vậy? | Bao lâu vậy?', 'Hỏi lại lý do của câu người khác vừa nói.'),
      Q('「それから？」 nghĩa là…', 'Rồi sao nữa?', 'Vì sao? | Ở đâu? | Với ai?', 'Giục người nói kể tiếp.'),
      Q('Cặp nào ĐÚNG (hỏi lý do — trả lời)?', 'どうして？ — ～から。', 'どうして？ — ～が。 | どうして？ — ～と。 | どうして？ — ～それから。', 'Trả lời bằng ～から.'),
      Q('「テストが {難|むずか}しかったですから、{勉強|べんきょう}しました。」 nghĩa là…', 'Vì bài kiểm tra khó nên tôi đã học.', 'Tôi đã học nên bài kiểm tra khó. | Bài kiểm tra khó nhưng tôi không học. | Bài kiểm tra dễ nên tôi học.', 'Lý do (難しかった) + から.'),
    ]),

    H(`${LV.vua} — E. Ghép câu (8 câu)`),
    BUILD('lt-b5-g4-ghep', 'E. Sắp xếp các mảnh thành câu', [
      BD('Tại sao bạn đã không đi?', 'どうして {行|い}きません でした か。', ['それから']),
      BD('Vì tôi đã bận.', '{忙|いそが}しかった です から。', ['が']),
      BD('Vì trời mưa nên tôi không đi đâu cả.', '{雨|あめ} でした から、 どこ へ も {行|い}きません でした。', ['が、']),
      BD('Sáng tôi ăn cơm. Sau đó tôi đi học.', '{朝|あさ}、 ご{飯|はん} を {食|た}べました。 それから、 {学校|がっこう} へ {行|い}きました。', ['から、']),
      BD('Vì đắt nên tôi không mua.', '{高|たか}かった です から、 {買|か}いません でした。', ['が、']),
      BD('Vì vui nên tôi muốn đi lần nữa.', '{楽|たの}しかった です から、 また {行|い}きたい です。', ['が、']),
      BD('Tôi gặp bạn. Sau đó xem phim.', '{友達|ともだち} に {会|あ}いました。 それから、 {映画|えいが} を {見|み}ました。', ['から、']),
      BD('Vì bị cảm nên hôm qua tôi đã ngủ.', '{風邪|かぜ} でした から、 {昨日|きのう} は {寝|ね}ました。', ['が、']),
    ]),

    H(`${LV.kho} — F. Tìm câu SAI (10 câu)`),
    MC('lt-b5-g4-sai', 'F. Câu nào SAI?', [
      Q('Câu nào SAI?', '{行|い}きませんでしたから、{忙|いそが}しかったです。 (nghĩa: vì bận nên không đi)', '{忙|いそが}しかったですから、{行|い}きませんでした。 | {雨|あめ}でしたから、{家|いえ}で{寝|ね}ました。 | {安|やす}いですから、{買|か}います。', 'Lý do phải đứng trước から.'),
      Q('Câu nào SAI?', 'どうして {行|い}きませんでしたか。 — {忙|いそが}しかったです が。', 'どうして {行|い}きませんでしたか。 — {忙|いそが}しかったですから。 | どうして ですか。 — {好|す}きですから。 | どうして {買|か}いませんでしたか。 — {高|たか}かったですから。', 'Trả lời どうして bằng ～から (が = nhưng).'),
      Q('Câu nào SAI?', '{朝|あさ}、ご{飯|はん}を{食|た}べました。から、{学校|がっこう}へ{行|い}きました。', '{朝|あさ}、ご{飯|はん}を{食|た}べました。それから、{学校|がっこう}へ{行|い}きました。 | {雨|あめ}でしたから、{行|い}きませんでした。 | どうして {行|い}きませんでしたか。', 'Thứ tự việc → それから (không phải から).'),
      Q('Câu nào SAI?', '{友達|ともだち}に{会|あ}いました。どうして、{映画|えいが}を{見|み}ました。', '{友達|ともだち}に{会|あ}いました。それから、{映画|えいが}を{見|み}ました。 | どうして {友達|ともだち}に{会|あ}いましたか。 | {友達|ともだち}に{会|あ}いましたから、{楽|たの}しかったです。', 'どうして là từ để hỏi, không dùng để nối.'),
      Q('Câu nào SAI?', '{高|たか}いですから、{買|か}いましたが。', '{高|たか}いですから、{買|か}いません。 | {安|やす}いですから、{買|か}います。 | {高|たか}かったですから、{買|か}いませんでした。', 'Không có が thừa ở cuối câu.'),
      Q('Câu nào SAI?', '{忙|いそが}しいですから が、{行|い}きません。', '{忙|いそが}しいですから、{行|い}きません。 | {忙|いそが}しかったですから、{行|い}きませんでした。 | {雨|あめ}ですから、{家|いえ}で{寝|ね}ます。', 'Chỉ dùng MỘT từ nối: から (lý do) hoặc が (nhưng), không dùng chồng nhau.'),
      Q('Câu nào SAI?', '{雨|あめ}でしたが、{家|いえ}で{寝|ね}ました。 (nghĩa: vì mưa nên ngủ ở nhà)', '{雨|あめ}でしたから、{家|いえ}で{寝|ね}ました。 | {家|いえ}で{寝|ね}ました。{雨|あめ}でしたから。 | どうして {家|いえ}で{寝|ね}ましたか。 — {雨|あめ}でしたから。', 'が là nhưng; ở đây phải dùng から.'),
      Q('Câu nào SAI?', '{楽|たの}しかったですから、どうしてです。', '{楽|たの}しかったですから、また{行|い}きます。 | どうして {楽|たの}しかったですか。 | {楽|たの}しかったですか。', 'どうして là từ hỏi, không nằm trong câu trả lời lý do.'),
      Q('Câu nào SAI?', 'どうして、{楽|たの}しかったです。', 'どうして {楽|たの}しかったですか。 | {楽|たの}しかったですから、また{行|い}きます。 | どうして またですか。', 'どうして + ですか (câu hỏi).'),
      Q('Câu nào SAI?', '{風邪|かぜ}でしたから、{学校|がっこう}へ{行|い}きました。 (nghĩa: vì cảm nên nghỉ)', '{風邪|かぜ}でしたから、{学校|がっこう}を{休|やす}みました。 | {風邪|かぜ}でしたから、{家|いえ}で{寝|ね}ました。 | {風邪|かぜ}でしたから、どこへも{行|い}きませんでした。', 'Nội dung ngược lý do: bị cảm thì nghỉ chứ không đi học.'),
    ]),

    H(`${LV.kho} — G. Dịch Việt → Nhật (6 câu)`),
    QZ('lt-b5-g4-dich', 'G. Dịch sang tiếng Nhật', 'translate', [
      A('Tại sao bạn không mua?', ['どうして{買|か}いませんでしたか。', 'どうして{買|か}いませんか。'], 'どうして + 買いません'),
      A('Vì đắt.', ['{高|たか}かったですから。', '{高|たか}いですから。'], 'から'),
      A('Vì trời mưa nên tôi đã không đi đâu cả.', ['{雨|あめ}でしたから、どこへも{行|い}きませんでした。', '{雨|あめ}でしたから、どこも{行|い}きませんでした。'], '雨でしたから'),
      A('Sáng tôi dọn phòng. Sau đó tôi giặt đồ.', ['{朝|あさ}、{部屋|へや}を{掃除|そうじ}しました。それから、{洗濯|せんたく}しました。', '{朝|あさ}、{部屋|へや}を{掃除|そうじ}しました。それから{洗濯|せんたく}しました。'], 'それから'),
      A('Vì vui nên tôi muốn đi lần nữa.', ['{楽|たの}しかったですから、また{行|い}きたいです。', '{楽|たの}しかったですから、もう{一度|いちど}{行|い}きたいです。'], 'から'),
      A('Vì bị cảm nên hôm qua tôi đã nghỉ học.', ['{風邪|かぜ}でしたから、{昨日|きのう}は{学校|がっこう}を{休|やす}みました。', '{昨日|きのう}は{風邪|かぜ}でしたから、{学校|がっこう}を{休|やす}みました。'], '風邪でしたから'),
    ]),

    H(`${LV.kho} — H. Nhật → Việt (6 câu)`),
    MC('lt-b5-g4-hieu', 'H. Chọn nghĩa đúng', [
      Q('テストが{簡単|かんたん}でしたから、{楽|たの}しかったです。', 'Vì bài kiểm tra dễ nên tôi thấy vui.', 'Bài kiểm tra dễ nhưng không vui. | Vì vui nên bài kiểm tra dễ. | Bài kiểm tra khó nên vui.', '簡単でした + から.'),
      Q('{旅行|りょこう}は たいへんでしたが、{楽|たの}しかったです。', 'Chuyến đi vất vả nhưng vui.', 'Chuyến đi vất vả nên vui. | Chuyến đi dễ nên vui. | Chuyến đi vui nên vất vả.', 'たいへんでした + が (nhưng).'),
      Q('{朝|あさ}、{公園|こうえん}を{歩|ある}きました。それから、{友達|ともだち}と{朝|あさ}ご{飯|はん}を{食|た}べました。', 'Sáng tôi đi dạo công viên. Sau đó ăn sáng cùng bạn.', 'Tôi ăn sáng với bạn. Sau đó đi dạo công viên. | Tôi đi dạo công viên vì ăn sáng. | Tôi đi dạo cùng bạn rồi ăn sáng một mình.', 'それから: thứ tự thời gian.'),
      Q('{景色|けしき}が きれいでしたから、{写真|しゃしん}を たくさん {撮|と}りました。', 'Vì phong cảnh đẹp nên tôi đã chụp rất nhiều ảnh.', 'Vì chụp nhiều ảnh nên phong cảnh đẹp. | Phong cảnh đẹp nhưng tôi không chụp. | Phong cảnh không đẹp nên tôi chụp ít.', 'きれいでした + から.'),
      Q('{高|たか}かったですが、{買|か}いました。', 'Đắt nhưng tôi vẫn mua.', 'Vì đắt nên tôi không mua. | Rẻ nên tôi mua. | Đắt nên tôi mượn.', '高かった + が + 買いました.'),
      Q('{天気|てんき}が {悪|わる}かったですから、どこへも {行|い}きませんでした。', 'Vì thời tiết xấu nên tôi đã không đi đâu cả.', 'Thời tiết xấu nhưng tôi vẫn đi chơi. | Vì không đi đâu nên thời tiết xấu. | Thời tiết đẹp nên không đi đâu.', '悪かった + から.'),
    ]),

    H(`${LV.kho} — I. Sắp thứ tự câu thành đoạn kể (3 đoạn)`),
    BUILD('lt-b5-g4-doan', 'I. Sắp xếp các câu thành đoạn kể đúng thứ tự', [
      BDT('Kể về một ngày: sáng — chiều — cảm tưởng.', [
        '{朝|あさ}、 {部屋|へや} を {掃除|そうじ} しました。',
        'それから、 {洗濯|せんたく} しました。',
        '{午後|ごご}、 デパート へ {買|か}い{物|もの} に {行|い}きました。',
        '{楽|たの}しかった です。',
      ]),
      BDT('Hỏi lý do — trả lời — hỏi đã làm gì — kể hai việc.', [
        'どうして {昨日|きのう} どこ へ も {行|い}きません でした か。',
        '{忙|いそが}しかった です から。',
        '{何|なに} を しました か。',
        '{洗濯|せんたく} しました。 それから、 {掃除|そうじ} しました。',
      ]),
      BDT('Kể chuyến đi: đến — làm gì — cảm tưởng.', [
        '{先週|せんしゅう}、 {京都|きょうと} へ {行|い}きました。',
        '{古|ふる}い お{寺|てら} を {見|み}ました。',
        'それから、 {写真|しゃしん} を {撮|と}りました。',
        'とても {楽|たの}しかった です。',
      ]),
    ]),
  ],
};

/* ───────── 7. NGỮ PHÁP 5 — TRỘN ポイント 37–47 ───────── */

const B5_TRON: Lesson = {
  id: 'lt-b5-ngu-phap-tron',
  kind: 'grammar',
  title: 'Luyện thêm Bài 5 — Ngữ pháp trộn: trợ từ · từ để hỏi · chọn đáp án · chia từ · sửa câu · dịch (đúng form đề)',
  goal: 'Làm bài ngữ pháp Bài 5 như đề thi: nhiều ポイント trộn trong cùng một phần — điền trợ từ (có X), từ để hỏi, chọn đáp án, chia từ, tìm câu sai, dịch hai chiều và đọc hiểu có chỗ trống.',
  minutes: 75,
  blocks: [
    NOTE('Cách học bài này', [
      'Chỉ làm bài này khi đã xong **bốn bài ngữ pháp 1–4**. Mỗi mức giới hạn 20 phút.',
      'Điền trợ từ: luôn tự hỏi "ô này là **ai/cái gì** (を・が), **ở đâu** (で), **đến đâu** (へ), **gặp/với ai** (に・と), **cùng ai** (と)?" Sau từ chỉ thời gian đứng trước dấu 「、」 thường **không cần** trợ từ (**X**).',
      'Chọn từ để hỏi bằng cách nhìn **câu trả lời**: nơi chốn → どこ; người → 誰; việc → 何; lý do → どうして; cảm nhận → どう; thời gian đi đường → どのくらい.',
      'Lỗi hay mắc: nhầm quá khứ tính từ (高いでした); コーヒー**を**好き; ませんでした**です**; ～に行きます dùng V nguyên dạng (買うに).',
    ]),

    H(`${LV.de} — A. Điền trợ từ (có X) (14 câu)`),
    MC('lt-b5-tr-tro-tu', 'A. Chọn trợ từ đúng — X nghĩa là không cần điền', [
      Q('{昨日|きのう}、{友達|ともだち}＿＿ {映画|えいが}＿＿ {見|み}ました。', 'と / を', 'に / が | で / を | と / が', 'と (cùng bạn) … を (tân ngữ).'),
      Q('{日曜日|にちようび}、デパート＿＿ {買|か}い{物|もの}しました。', 'で', 'を | に | が', 'Nơi làm hành động: で.'),
      Q('{私|わたし}は {猫|ねこ}＿＿ {好|す}きです。', 'が', 'を | に | で', '好き + が.'),
      Q('{新|あたら}しい{服|ふく}＿＿ ほしいです。', 'が', 'を | に | で', 'ほしい + が.'),
      Q('{京都|きょうと}＿＿ {旅行|りょこう}＿＿ {行|い}きます。', 'へ / に', 'を / に | で / に | に / を', 'へ (đến đâu) … に (để làm gì).'),
      Q('{先週|せんしゅう}＿＿、{友達|ともだち}に{会|あ}いました。', 'X', 'を | が | と', 'Từ thời gian + 、 không cần trợ từ.'),
      Q('{毎日|まいにち}＿＿ {勉強|べんきょう}します。', 'X', 'を | に | で', '毎日 không cần trợ từ.'),
      Q('{友達|ともだち}＿＿ {会|あ}いました。', 'に', 'で | を | が', '会います + に.'),
      Q('{一人|ひとり}＿＿ {行|い}きました。', 'で', 'と | に | を', '一人で = một mình.'),
      Q('どこ＿＿も {行|い}きませんでした。', 'へ', 'を | が | で', 'どこへも + phủ định.'),
      Q('{山|やま}＿＿ {登|のぼ}りたいです。', 'に', 'が | で | と', '登ります + に.'),
      Q('{今朝|けさ}＿＿、コーヒー＿＿ {飲|の}みました。', 'X / を', 'は / が | に / を | X / が', 'Thời gian + 、 không trợ từ; tân ngữ を.'),
      Q('{温泉|おんせん}＿＿ {入|はい}りました。', 'に', 'を | で | が', '入ります + に.'),
      Q('{昼|ひる}ご{飯|はん}＿＿ {食|た}べに{帰|かえ}ります。', 'を', 'に | が | で', '昼ご飯を食べに…'),
    ]),

    H(`${LV.vua} — B. Từ để hỏi (12 câu)`),
    MC('lt-b5-tr-hoi', 'B. Nhìn câu trả lời để chọn từ để hỏi', [
      Q('A：{昨日|きのう}、＿＿＿ を しましたか。 B：{洗濯|せんたく}を しました。', '{何|なに}', '{誰|だれ} | どこ | どうして', 'Việc → 何を.'),
      Q('A：＿＿＿ と {行|い}きましたか。 B：{友達|ともだち}と{行|い}きました。', '{誰|だれ}', '{何|なに} | どこ | どうして', 'Người → 誰と.'),
      Q('A：＿＿＿ へ {行|い}きましたか。 B：{京都|きょうと}へ{行|い}きました。', 'どこ', '{何|なに} | {誰|だれ} | どうして', 'Nơi → どこへ.'),
      Q('A：＿＿＿ {行|い}きませんでしたか。 B：{忙|いそが}しかったですから。', 'どうして', 'どう | どこ | {誰|だれ}', 'Lý do → どうして.'),
      Q('A：{映画|えいが}は＿＿＿でしたか。 B：おもしろかったです。', 'どう', 'どこ | {誰|だれ} | {何|なに}', 'Cảm nhận → どう.'),
      Q('A：{何|なに}＿＿＿ ほしいですか。 B：{自転車|じてんしゃ}が ほしいです。', 'が', 'を | に | で', 'ほしい + が.'),
      Q('A：＿＿＿ を {食|た}べたいですか。 B：カレーを{食|た}べたいです。', '{何|なに}', '{誰|だれ} | どこ | どうして', '何を 食べたい.'),
      Q('A：どんな{食|た}べ{物|もの}が＿＿＿ ですか。 B：{甘|あま}い{食|た}べ{物|もの}が{好|す}きです。', '{好|す}き', 'ほしい | {行|い}きたいです | {嫌|きら}い', 'どんな N が 好きですか.'),
      Q('A：{家|いえ}から{学校|がっこう}まで＿＿＿ですか。 B：{歩|ある}いて{十五分|じゅうごふん}です。', 'どのくらい', 'どう | どんな | どこ', 'Thời gian đi → どのくらい.'),
      Q('A：{何|なん}＿＿＿ {行|い}きましたか。 B：{電車|でんしゃ}で{行|い}きました。', 'で', 'を | に | が', '何で = bằng phương tiện gì.'),
      Q('A：{週末|しゅうまつ}、＿＿＿ か {行|い}きましたか。 B：はい、{海|うみ}へ{行|い}きました。', 'どこ', '{何|なに} | {誰|だれ} | どれ', 'どこか行きましたか.'),
      Q('A：＿＿＿ に {会|あ}いましたか。 B：{友達|ともだち}に{会|あ}いました。', '{誰|だれ}', '{何|なに} | どこ | どう', '誰に会いましたか.'),
    ]),

    H(`${LV.vua} — C. Chọn đáp án đúng (ngữ pháp + từ vựng) (12 câu)`),
    MC('lt-b5-tr-chon', 'C. Chọn đáp án đúng nhất', [
      Q('{昨日|きのう}の{映画|えいが}は＿＿＿。', 'おもしろかったです', 'おもしろいでした | おもしろくでした | おもしろかったでした', 'Tính từ い quá khứ.'),
      Q('{日曜日|にちようび}は＿＿＿。 (không đi đâu)', 'どこへも{行|い}きませんでした', 'どこへも{行|い}きます | どこかへ{行|い}きました | どこへ{行|い}きませんでした', 'どこへも + phủ định.'),
      Q('{私|わたし}は {新|あたら}しい{服|ふく}＿＿＿ ほしいです。', 'が', 'を | に | で', 'ほしい + が.'),
      Q('{今度|こんど}の{休|やす}みに、{京都|きょうと}へ＿＿＿。', '{行|い}きたいです', '{行|い}くたいです | {行|い}きますたいです | {行|い}たいです', 'V ます bỏ ます + たい.'),
      Q('デパートへ {服|ふく}を＿＿＿ に {行|い}きます。', '{買|か}い', '{買|か}う | {買|か}います | {買|か}って', 'V bỏ ます + に.'),
      Q('{雨|あめ}でした＿＿＿、どこへも{行|い}きませんでした。', 'から', 'が | を | に', 'Lý do + から.'),
      Q('{朝|あさ}、{掃除|そうじ}しました。＿＿＿、{洗濯|せんたく}しました。', 'それから', 'どうして | から | が', 'Thứ tự việc → それから.'),
      Q('{友達|ともだち}＿＿＿ {映画|えいが}を{見|み}ました。 (cùng bạn)', 'と', 'に | で | が', 'と = cùng.'),
      Q('{旅行|りょこう}は たいへん＿＿＿ が、{楽|たの}しかったです。', 'でした', 'かったです | いでした | でしたです', 'Tính từ な quá khứ: でした.'),
      Q('{私|わたし}は コーヒー＿＿＿ あまり {好|す}きじゃありません。', 'は', 'を | に | で', 'Câu phủ định về thứ mình không thích lắm thường dùng は (đối chiếu); を／に／で đều sai với 好き.'),
      Q('A：{冬休|ふゆやす}みは どうでしたか。 B：＿＿＿', '{楽|たの}しかったです。', '{楽|たの}しいでした。 | {楽|たの}しくでした。 | {楽|たの}しいです か。', 'Quá khứ.'),
      Q('「ほしい」 dùng để nói về…', 'Ý muốn CÓ một đồ vật của tôi hoặc của bạn', 'Ý muốn của người thứ ba | Ý muốn LÀM một việc | Một việc đã xảy ra', 'ほしい: muốn có đồ vật (ngôi 1, 2); muốn LÀM → ～たい.'),
    ]),

    H(`${LV.vua} — D. Chia từ trong ngoặc (10 câu, gõ tay)`),
    QZ('lt-b5-tr-chia', 'D. Điền dạng đúng của từ trong ngoặc', 'fill', [
      A('{昨日|きのう}、{公園|こうえん}へ（{行|い}きます）。', '{行|い}きました'),
      A('{先週|せんしゅう}は（{忙|いそが}しいです）。', '{忙|いそが}しかったです'),
      A('{昨日|きのう}の{天気|てんき}は（いいです）。', 'よかったです'),
      A('{昨日|きのう}は（{雨|あめ}です）。', '{雨|あめ}でした'),
      A('{映画|えいが}は（おもしろいです）。 (phủ định quá khứ)', ['おもしろくなかったです', 'おもしろくありませんでした']),
      A('デパートへ{服|ふく}を（{買|か}います）に{行|い}きます。', '{買|か}い'),
      A('{日本|にほん}へ（{行|い}きます）。 (muốn)', '{行|い}きたいです'),
      A('コーヒーが（{好|す}きです）。 (phủ định nhẹ, あまり)', ['あまり{好|す}きじゃありません', 'あまり{好|す}きではありません']),
      A('{昨日|きのう}は どこへも（{行|い}きます）。 (phủ định quá khứ)', '{行|い}きませんでした'),
      A('その{町|まち}は（{静|しず}かです）。', '{静|しず}かでした'),
    ]),

    H(`${LV.kho} — E. Tìm câu SAI (8 câu)`),
    MC('lt-b5-tr-sai', 'E. Câu nào SAI?', [
      Q('Câu nào SAI?', '{昨日|きのう}は {忙|いそが}しいでした。', '{昨日|きのう}は {忙|いそが}しかったです。 | {昨日|きのう}は {暇|ひま}でした。 | {昨日|きのう}は {雨|あめ}でした。', '忙しい → 忙しかったです.'),
      Q('Câu nào SAI?', '{私|わたし}は コーヒーを {好|す}きです。', '{私|わたし}は コーヒーが {好|す}きです。 | {私|わたし}は コーヒーを {飲|の}みたいです。 | {私|わたし}は コーヒーが ほしいです。', '好き + が.'),
      Q('Câu nào SAI?', 'デパートへ {服|ふく}を {買|か}うに {行|い}きます。', 'デパートへ {服|ふく}を {買|か}いに {行|い}きます。 | デパートへ {買|か}い{物|もの}に {行|い}きます。 | デパートで {服|ふく}を {買|か}いました。', '買い + に.'),
      Q('Câu nào SAI?', '{友達|ともだち}に {映画|えいが}を {見|み}ました。 (nghĩa: cùng bạn)', '{友達|ともだち}と {映画|えいが}を {見|み}ました。 | {友達|ともだち}に {会|あ}いました。 | {一人|ひとり}で {映画|えいが}を {見|み}ました。', 'Cùng ai → と.'),
      Q('Câu nào SAI?', '{忙|いそが}しかったですが、{行|い}きませんでした。 (nghĩa: vì bận nên không đi)', '{忙|いそが}しかったですから、{行|い}きませんでした。 | どうして {行|い}きませんでしたか。 | {忙|いそが}しかったですから。', 'Lý do → から (が = nhưng).'),
      Q('Câu nào SAI?', '{日本|にほん}へ {行|い}くたいです。', '{日本|にほん}へ {行|い}きたいです。 | {日本|にほん}へ {行|い}きたくないです。 | {日本|にほん}へ {行|い}きたかったです。', '行き + たい.'),
      Q('Câu nào SAI?', '{昨日|きのう}は どこも {行|い}きました。', '{昨日|きのう}は どこも {行|い}きませんでした。 | {昨日|きのう}は どこかへ {行|い}きました。 | {昨日|きのう}は どこへも {行|い}きませんでした。', 'どこも + phủ định.'),
      Q('Câu nào SAI?', 'ほしいくないです。', 'ほしくないです。 | {行|い}きたくないです。 | {嫌|きら}いじゃありません。', 'ほしい → ほしくない.'),
    ]),

    H(`${LV.kho} — F. Dịch Việt → Nhật (8 câu)`),
    QZ('lt-b5-tr-dich', 'F. Dịch sang tiếng Nhật', 'translate', [
      A('Hôm qua tôi đã đi Kyoto cùng bạn.', ['{昨日|きのう}、{友達|ともだち}と{京都|きょうと}へ{行|い}きました。', '{友達|ともだち}と{昨日|きのう}、{京都|きょうと}へ{行|い}きました。', '{昨日|きのう}は{友達|ともだち}と{京都|きょうと}へ{行|い}きました。']),
      A('Kỳ nghỉ tới tôi muốn ngắm phong cảnh.', ['{今度|こんど}の{休|やす}みに、{景色|けしき}が{見|み}たいです。', '{今度|こんど}の{休|やす}みに、{景色|けしき}を{見|み}たいです。', '{今度|こんど}の{休|やす}みに{景色|けしき}を{見|み}たいです。']),
      A('Tôi thích cà phê nhưng không thích trà lắm.', ['コーヒーは{好|す}きですが、お{茶|ちゃ}はあまり{好|す}きじゃありません。', 'コーヒーが{好|す}きですが、お{茶|ちゃ}はあまり{好|す}きじゃありません。']),
      A('Vì bận nên hôm qua tôi không đi đâu cả.', ['{忙|いそが}しかったですから、{昨日|きのう}はどこへも{行|い}きませんでした。', '{昨日|きのう}は{忙|いそが}しかったですから、どこへも{行|い}きませんでした。']),
      A('Chủ nhật tôi đi mua sắm. Sau đó tôi ăn tối.', ['{日曜日|にちようび}、{買|か}い{物|もの}しました。それから、{晩|ばん}ご{飯|はん}を{食|た}べました。', '{日曜日|にちようび}、{買|か}い{物|もの}に{行|い}きました。それから、{晩|ばん}ご{飯|はん}を{食|た}べました。']),
      A('Bài kiểm tra tuần trước đã khó nhưng vui.', ['{先週|せんしゅう}のテストは{難|むずか}しかったですが、{楽|たの}しかったです。', 'テストは{難|むずか}しかったですが、{楽|たの}しかったです。']),
      A('Bạn đã dùng bữa với ai?', ['{誰|だれ}と{食事|しょくじ}しましたか。', '{誰|だれ}と{食事|しょくじ}をしましたか。', '{誰|だれ}と{食事|しょくじ}をしましたか']),
      A('Tôi muốn có xe đạp mới.', ['{新|あたら}しい{自転車|じてんしゃ}がほしいです。', '{私|わたし}は{新|あたら}しい{自転車|じてんしゃ}がほしいです。']),
    ], 'Dùng đủ: quá khứ · が好き／ほしい · ～たい · ～に行きます · と · それから · から'),

    H(`${LV.kho} — G. Nhật → Việt (6 câu)`),
    MC('lt-b5-tr-hieu', 'G. Chọn bản dịch đúng', [
      Q('{先週|せんしゅう}の{日曜日|にちようび}、{家族|かぞく}と{海|うみ}へ{行|い}きました。{天気|てんき}が よかったですから、{気持|きも}ちが よかったです。', 'Chủ nhật tuần trước tôi đã ra biển cùng gia đình. Vì thời tiết đẹp nên rất dễ chịu.', 'Chủ nhật tuần sau tôi sẽ ra biển. Thời tiết đẹp nên dễ chịu. | Tôi ra biển một mình. Thời tiết xấu. | Gia đình đã ra biển vì tôi thích.', '家族と + 海へ + よかったですから.'),
      Q('{昨日|きのう}は {雨|あめ}でしたから、どこへも {行|い}きませんでした。', 'Hôm qua trời mưa nên tôi không đi đâu cả.', 'Hôm qua tôi đi mọi nơi dù mưa. | Ngày mai mưa nên không đi. | Hôm qua trời nắng nên tôi ở nhà.', '雨でしたから.'),
      Q('{新|あたら}しい{服|ふく}が ほしいですから、デパートへ {買|か}い{物|もの}に {行|い}きます。', 'Vì muốn có quần áo mới nên tôi đi trung tâm thương mại mua sắm.', 'Tôi đã mua quần áo mới ở trung tâm thương mại. | Tôi không muốn quần áo mới. | Tôi bán quần áo cũ.', 'ほしいですから + 買い物に行きます.'),
      Q('{恋人|こいびと}と {美術館|びじゅつかん}を {見学|けんがく}しました。それから、{食事|しょくじ}しました。', 'Tôi đã tham quan bảo tàng cùng người yêu. Sau đó dùng bữa.', 'Tôi ăn trước rồi tham quan. | Tôi tham quan một mình rồi gặp người yêu. | Người yêu tôi là họa sĩ.', 'それから: thứ tự.'),
      Q('{私|わたし}は コーヒーが {嫌|きら}いですが、ジュースは {好|す}きです。', 'Tôi ghét cà phê nhưng thích nước ép.', 'Tôi thích cà phê nhưng ghét nước ép. | Tôi ghét cả cà phê lẫn nước ép. | Tôi muốn uống cà phê và nước ép.', '嫌い + が + 好き.'),
      Q('{去年|きょねん}は {忙|いそが}しかったですが、{今年|ことし}は {暇|ひま}です。', 'Năm ngoái bận nhưng năm nay rảnh.', 'Năm ngoái rảnh nhưng năm nay bận. | Cả hai năm đều bận. | Năm sau sẽ rảnh.', '去年 (quá khứ) + 今年 (hiện tại).'),
    ]),

    H(`${LV.kho} — H. Đọc hiểu có chỗ trống (6 câu, như phần V đề cuối kỳ)`),
    PASSAGE('先週の日曜日', [
      '{先週|せんしゅう}の {日曜日|にちようび}、 {友達|ともだち}（①） {京都|きょうと}（②） {行|い}きました。 {古|ふる}い お{寺|てら}を {見|み}（③） {行|い}きました。 {天気|てんき}が よかった（④）、 {写真|しゃしん}を たくさん {撮|と}りました。（⑤）、 {京都|きょうと} の {料理|りょうり} を {食|た}べました。 とても {楽|たの}しかった です。',
    ], 'Đọc đoạn văn rồi chọn từ cho các chỗ trống.'),
    MC('lt-b5-tr-doan', 'H. Điền ① ～ ⑤ và một câu hiểu', [
      Q('① に入る言葉は？', 'と', 'に | で | を', '友達と (cùng bạn).'),
      Q('② に入る言葉は？', 'へ', 'を | が | で', '京都へ (đến Kyoto).'),
      Q('③ に入る言葉は？', 'に', 'を | と | で', '見に行きました (để xem).'),
      Q('④ に入る言葉は？', 'ですから', 'ですが | ですでした | でしたか', 'Lý do + ですから.'),
      Q('⑤ に入る言葉は？', 'それから', 'どうして | から | が', 'Thứ tự việc → それから.'),
      Q('この人は 京都で {何|なに}を しませんでしたか。', '{買|か}い{物|もの}', '{写真|しゃしん}を{撮|と}る | お{寺|てら}を{見|み}る | {料理|りょうり}を{食|た}べる', 'Bài không nói mua sắm.'),
    ]),

    H(`${LV.kho} — I. Ghép câu dài (8 câu)`),
    BUILD('lt-b5-tr-ghep', 'I. Sắp xếp các mảnh thành câu (câu dài hơn)', [
      BD('Hôm qua tôi đã đi Kyoto cùng bạn.', '{昨日|きのう}、 {友達|ともだち} と {京都|きょうと} へ {行|い}きました。', ['に']),
      BD('Kỳ nghỉ tới tôi muốn đi biển để chụp ảnh.', '{今度|こんど} の {休|やす}みに、 {海|うみ} へ {写真|しゃしん} を {撮|と}り に {行|い}きたい です。', ['で']),
      BD('Vì bận nên hôm qua tôi không đi đâu cả.', '{忙|いそが}しかった です から、 {昨日|きのう} は どこ へ も {行|い}きません でした。', ['が、']),
      BD('Tôi thích cà phê nhưng không thích trà lắm.', 'コーヒー は {好|す}き です が、 お{茶|ちゃ} は あまり {好|す}き じゃありません。', ['から、']),
      BD('Sáng tôi dọn phòng. Sau đó tôi giặt đồ.', '{朝|あさ}、 {部屋|へや} を {掃除|そうじ} しました。 それから、 {洗濯|せんたく} しました。', ['どうして']),
      BD('Phong cảnh đẹp nên tôi đã chụp rất nhiều ảnh.', '{景色|けしき} が きれい でした から、 {写真|しゃしん} を たくさん {撮|と}りました。', ['が、']),
      BD('Bạn đã đi cùng ai? — Tôi đi một mình.', '{誰|だれ} と {行|い}きました か。 {一人|ひとり} で {行|い}きました。', ['に']),
      BD('Tôi muốn có xe đạp mới nhưng đắt.', '{新|あたら}しい {自転車|じてんしゃ} が ほしい です が、 {高|たか}い です。', ['から、']),
    ]),
  ],
};

/* ───────── 8. HỘI THOẠI ───────── */

const B5_HOI_THOAI: Lesson = {
  id: 'lt-b5-hoi-thoai',
  kind: 'conversation',
  title: 'Luyện thêm Bài 5 — Hội thoại: 6 đoạn mới (cuối tuần · không đi đâu · kỳ nghỉ · muốn làm gì · muốn có gì · thích) + tự nói',
  goal: 'Hiểu, điền, sắp lượt thoại và tự nói được các hội thoại kể cuối tuần, hỏi lý do, nói cảm tưởng, mong muốn và sở thích — với nhân vật quen thuộc của sách.',
  minutes: 65,
  blocks: [
    NOTE('Cách học bài này', [
      'Mỗi hội thoại: ① nghe/đọc cả đoạn ② trả lời câu hỏi hiểu ③ làm bài điền ④ **sắp lượt thoại** ⑤ che lời thoại, **đóng vai một người** và nói lại.',
      'Chú ý **chuỗi hỏi liên hoàn** mà cô hay dùng: 何をしましたか → どこで？ → 誰と？ → それから？ → どうでしたか. Học thuộc chuỗi này là kể được bất kỳ ngày nào.',
      'Lỗi hay mắc: dùng ます thay ました khi kể chuyện đã qua; để quên **に** sau V(ます) khi nói đi để làm gì; nói 「ほしいです」 thay 「〜たいです」 khi muốn LÀM việc.',
    ]),
    TABLE(
      ['Hội thoại', 'Người nói', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'パク ↔ マルコ', 'Chủ nhật đã làm gì', 'V ました · で · と · それから · どうでしたか'],
        ['2', 'ワン ↔ ダニエル', 'Không đi đâu vì cảm', 'どこか · どこへも · どうして ～から'],
        ['3', 'アンナ ↔ ナタポン', 'Kỳ nghỉ ở Kyoto', 'と · 景色 · かったです · が'],
        ['4', 'リン ↔ カルロス', 'Kỳ nghỉ tới muốn làm gì', '～たい · ～に · 私も'],
        ['5', '木村 ↔ パク', 'Muốn có xe đạp', 'N が ほしい · ～に行きました'],
        ['6', 'ワン ↔ マルコ', 'Thích / ghét món ăn', 'が 好き · あまり · どうして'],
      ],
    ),

    H(`${LV.de} — Hội thoại 1: Chủ nhật đã làm gì`),
    DLG('Hội thoại 1 — マルコさんの日曜日', [
      D('パク', 'f', '^マルコ-さん、 {日曜日|にちようび}、 {何|なに} を しました か。', 'Anh Marco, Chủ nhật anh đã làm gì?'),
      D('マルコ', 'm', '{友達|ともだち} と {公園|こうえん} へ {行|い}きました。', 'Tôi đã đến công viên cùng bạn.'),
      D('パク', 'f', '{公園|こうえん} で {何|なに} を しました か。', 'Ở công viên anh đã làm gì?'),
      D('マルコ', 'm', 'バーベキュー を しました。', 'Chúng tôi đã nướng thịt ngoài trời.'),
      D('パク', 'f', 'それから？', 'Rồi sao nữa?'),
      D('マルコ', 'm', '{夜|よる}、 {家|いえ} で ゲーム を しました。', 'Buổi tối tôi đã chơi game ở nhà.'),
      D('パク', 'f', '{楽|たの}しかった です か。', 'Có vui không?'),
      D('マルコ', 'm', 'ええ、 とても {楽|たの}しかった です。', 'Có, rất vui.'),
    ]),
    MC('lt-b5-ht-1', 'Hiểu hội thoại 1 và điền chỗ trống (7 câu)', [
      Q('マルコさんは {誰|だれ}と {行|い}きましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '友達と公園へ.'),
      Q('どこへ {行|い}きましたか。', '{公園|こうえん}', '{美術館|びじゅつかん} | デパート | {海|うみ}', '公園へ行きました.'),
      Q('{公園|こうえん}で {何|なに}を しましたか。', 'バーベキュー', 'ゲーム | {買|か}い{物|もの} | {洗濯|せんたく}', '公園でバーベキュー.'),
      Q('{夜|よる}は どこで {何|なに}を しましたか。', '{家|いえ}で ゲーム', '{公園|こうえん}で バーベキュー | デパートで {買|か}い{物|もの} | {海|うみ}で {写真|しゃしん}', '夜、家でゲーム.'),
      Q('{日曜日|にちようび}は どうでしたか。', 'とても{楽|たの}しかったです', 'あまり{楽|たの}しくなかったです | {忙|いそが}しかったです | {大変|たいへん}でした', 'とても楽しかった.'),
      Q('パク：{公園|こうえん}＿＿＿ {何|なに}を しましたか。', 'で', 'を | に | が', 'Nơi làm hành động: で.'),
      Q('パク：{楽|たの}しかった＿＿＿ か。', 'です', 'でした | ます | だ', '楽しかったです + か.'),
    ]),
    BUILD('lt-b5-ht-1-xep', 'Sắp xếp lượt thoại 1 cho đúng thứ tự', [
      BDT('Hỏi Chủ nhật → trả lời → hỏi ở đó làm gì → trả lời.', [
        '^マルコ-さん、 {日曜日|にちようび}、 {何|なに} を しました か。',
        '{友達|ともだち} と {公園|こうえん} へ {行|い}きました。',
        '{公園|こうえん} で {何|なに} を しました か。',
        'バーベキュー を しました。',
      ]),
    ]),

    H(`${LV.de} — Hội thoại 2: Không đi đâu vì bị cảm`),
    DLG('Hội thoại 2 — ダニエルさんの昨日', [
      D('ワン', 'f', '^ダニエル-さん、 {昨日|きのう}、 どこ か {行|い}きました か。', 'Daniel, hôm qua anh có đi đâu không?'),
      D('ダニエル', 'm', 'いいえ、 どこ へ も {行|い}きません でした。', 'Không, tôi đã không đi đâu cả.'),
      D('ワン', 'f', 'どうして です か。', 'Tại sao vậy?'),
      D('ダニエル', 'm', '{風邪|かぜ} でした から。 {家|いえ} で {寝|ね}ました。', 'Vì tôi bị cảm. Tôi đã ngủ ở nhà.'),
      D('ワン', 'f', 'そう です か。 {今日|きょう} は どう です か。', 'Vậy à. Hôm nay thì sao?'),
      D('ダニエル', 'm', '{元気|げんき} です。', 'Tôi khoẻ.'),
    ]),
    MC('lt-b5-ht-2', 'Hiểu hội thoại 2 và điền chỗ trống (6 câu)', [
      Q('ダニエルさんは {昨日|きのう}、どこかへ {行|い}きましたか。', 'いいえ、どこへも{行|い}きませんでした', 'はい、デパートへ{行|い}きました | はい、{公園|こうえん}へ{行|い}きました | はい、{海|うみ}へ{行|い}きました', 'どこへも行きませんでした.'),
      Q('どうして {行|い}きませんでしたか。', '{風邪|かぜ}でしたから', '{忙|いそが}しかったですから | {雨|あめ}でしたから | {高|たか}かったですから', '風邪でしたから.'),
      Q('{家|いえ}で {何|なに}を しましたか。', '{寝|ね}ました', '{洗濯|せんたく}しました | {掃除|そうじ}しました | {食事|しょくじ}しました', '家で寝ました.'),
      Q('{今日|きょう}の ダニエルさんは？', '{元気|げんき}', '{風邪|かぜ} | {忙|いそが}しい | {暇|ひま}', '元気です.'),
      Q('ワン：どこ＿＿＿ {行|い}きましたか。 (một nơi nào đó)', 'か', 'を | が | へ', 'どこか… ましたか.'),
      Q('ダニエル：どこ＿＿＿も {行|い}きませんでした。', 'へ', 'を | が | で', 'どこへも + phủ định.'),
    ]),
    BUILD('lt-b5-ht-2-xep', 'Sắp xếp lượt thoại 2 cho đúng thứ tự', [
      BDT('Hỏi có đi đâu → không → hỏi lý do → trả lời lý do.', [
        '{昨日|きのう}、 どこ か {行|い}きました か。',
        'いいえ、 どこ へ も {行|い}きません でした。',
        'どうして です か。',
        '{風邪|かぜ} でした から。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 3: Kỳ nghỉ ở Kyoto`),
    DLG('Hội thoại 3 — ナタポンさんの休み', [
      D('アンナ', 'f', '^ナタポン-さん、 {休|やす}み は どう でした か。', 'Natapon, kỳ nghỉ thế nào?'),
      D('ナタポン', 'm', '{家族|かぞく} と {京都|きょうと} へ {行|い}きました。', 'Tôi đã đi Kyoto cùng gia đình.'),
      D('アンナ', 'f', '{京都|きょうと} は どう でした か。', 'Kyoto thế nào?'),
      D('ナタポン', 'm', '{景色|けしき} が きれい でした。 そして、 {古|ふる}い お{寺|てら} を {見|み}ました。', 'Phong cảnh đẹp. Và tôi đã xem những ngôi chùa cổ.'),
      D('アンナ', 'f', 'いい です ね。 {食|た}べ{物|もの} は どう でした か。', 'Tuyệt nhỉ. Đồ ăn thì sao?'),
      D('ナタポン', 'm', 'おいしかった です が、 {少|すこ}し {高|たか}かった です。', 'Ngon nhưng hơi đắt.'),
    ]),
    MC('lt-b5-ht-3', 'Hiểu hội thoại 3 và điền chỗ trống (6 câu)', [
      Q('ナタポンさんは {誰|だれ}と {京都|きょうと}へ {行|い}きましたか。', '{家族|かぞく}', '{友達|ともだち} | {恋人|こいびと} | {一人|ひとり}', '家族と京都へ.'),
      Q('{京都|きょうと}の {景色|けしき}は？', 'きれいでした', 'きれいじゃありませんでした | {高|たか}かったです | {忙|いそが}しかったです', '景色がきれいでした.'),
      Q('{京都|きょうと}で {何|なに}を {見|み}ましたか。', '{古|ふる}いお{寺|てら}', '{新|あたら}しいビル | {美術館|びじゅつかん} | {温泉|おんせん}', '古いお寺を見ました.'),
      Q('{食|た}べ{物|もの}は どうでしたか。', 'おいしかったですが、{少|すこ}し{高|たか}かったです', 'おいしくなかったです | とても{安|やす}かったです | まずかったです', 'おいしかったですが、少し高かったです.'),
      Q('アンナ：{休|やす}みは＿＿＿ でしたか。 (hỏi cảm nhận)', 'どう', 'どこ | {誰|だれ} | {何|なに}', 'どうでしたか.'),
      Q('ナタポン：おいしかったです＿＿＿、{少|すこ}し{高|たか}かったです。', 'が', 'から | それから | を', 'Ngon (tốt) nhưng đắt (xấu): が.'),
    ]),
    BUILD('lt-b5-ht-3-xep', 'Sắp xếp lượt thoại 3 cho đúng thứ tự', [
      BDT('Hỏi kỳ nghỉ → trả lời đi đâu → hỏi cảm nhận Kyoto → trả lời.', [
        '{休|やす}み は どう でした か。',
        '{家族|かぞく} と {京都|きょうと} へ {行|い}きました。',
        '{京都|きょうと} は どう でした か。',
        '{景色|けしき} が きれい でした。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 4: Kỳ nghỉ tới muốn làm gì`),
    DLG('Hội thoại 4 — リンさんとカルロスさん', [
      D('リン', 'f', '^カルロス-さん、 {今度|こんど} の {休|やす}み に {何|なに} を したい です か。', 'Carlos, kỳ nghỉ tới anh muốn làm gì?'),
      D('カルロス', 'm', '{山|やま} に {登|のぼ}りたい です。 そして、 {写真|しゃしん} を {撮|と}りたい です。', 'Tôi muốn leo núi. Và muốn chụp ảnh.'),
      D('リン', 'f', 'いい です ね。 {私|わたし} は {温泉|おんせん} に {入|はい}りたい です。', 'Hay nhỉ. Tôi thì muốn tắm suối nước nóng.'),
      D('カルロス', 'm', '{一人|ひとり} で {行|い}きます か。', 'Chị đi một mình à?'),
      D('リン', 'f', 'いいえ、 {友達|ともだち} と {行|い}きます。', 'Không, tôi đi cùng bạn.'),
      D('カルロス', 'm', '{私|わたし} も {行|い}きたい です。', 'Tôi cũng muốn đi.'),
    ]),
    MC('lt-b5-ht-4', 'Hiểu hội thoại 4 và điền chỗ trống (6 câu)', [
      Q('カルロスさんは {今度|こんど}の{休|やす}みに {何|なに}を したいですか。', '{山|やま}に{登|のぼ}りたいです', '{温泉|おんせん}に{入|はい}りたいです | {買|か}い{物|もの}したいです | {家|いえ}で{寝|ね}たいです', '山に登りたい。写真を撮りたい.'),
      Q('リンさんは {何|なに}を したいですか。', '{温泉|おんせん}に{入|はい}りたいです', '{山|やま}に{登|のぼ}りたいです | {写真|しゃしん}を{撮|と}りたいです | {買|か}い{物|もの}したいです', '温泉に入りたい.'),
      Q('リンさんは {誰|だれ}と {行|い}きますか。', '{友達|ともだち}', '{一人|ひとり} | {家族|かぞく} | カルロスさん', '友達と行きます.'),
      Q('カルロスさんは？ (最後)', '{一緒|いっしょ}に{行|い}きたいです', '{行|い}きたくないです | {一人|ひとり}で{行|い}く | {山|やま}が{嫌|きら}い', '私も行きたいです.'),
      Q('カルロス：{山|やま}＿＿＿ {登|のぼ}りたいです。', 'に', 'が | で | と', '登ります + に (cô).'),
      Q('リン：{温泉|おんせん}＿＿＿ {入|はい}りたいです。', 'に', 'を | で | が', '入ります + に.'),
    ]),
    BUILD('lt-b5-ht-4-xep', 'Sắp xếp lượt thoại 4 cho đúng thứ tự', [
      BDT('Hỏi muốn làm gì → trả lời → hỏi lại đi với ai → trả lời.', [
        '{今度|こんど} の {休|やす}み に {何|なに} を したい です か。',
        '{山|やま} に {登|のぼ}りたい です。',
        '{一人|ひとり} で {行|い}きます か。',
        'いいえ、 {友達|ともだち} と {行|い}きます。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 5: Muốn có xe đạp mới`),
    DLG('Hội thoại 5 — 木村さんとパクさん', [
      D('木村', 'm', '^パク-さん、 {何|なに} が ほしい です か。', 'Chị Park, chị muốn có gì?'),
      D('パク', 'f', '{新|あたら}しい {自転車|じてんしゃ} が ほしい です が、 {高|たか}い です。', 'Tôi muốn có xe đạp mới nhưng đắt.'),
      D('木村', 'm', 'デパート で {見|み}ました か。', 'Chị đã xem ở trung tâm thương mại chưa?'),
      D('パク', 'f', 'はい、 {昨日|きのう}、 デパート へ {見|み} に {行|い}きました。', 'Rồi, hôm qua tôi đã đến trung tâm thương mại để xem.'),
      D('木村', 'm', 'どう でした か。', 'Thế nào?'),
      D('パク', 'f', '{安|やす}く なかった です。', 'Không rẻ.'),
    ]),
    MC('lt-b5-ht-5', 'Hiểu hội thoại 5 và điền chỗ trống (6 câu)', [
      Q('パクさんは {何|なに}が ほしいですか。', '{新|あたら}しい{自転車|じてんしゃ}', '{新|あたら}しい{服|ふく} | {車|くるま} | {家|いえ}', '新しい自転車がほしい.'),
      Q('{自転車|じてんしゃ}は？', '{高|たか}い', '{安|やす}い | {古|ふる}い | {小|ちい}さい', '高いです.'),
      Q('パクさんは {昨日|きのう}、{何|なに}を しに デパートへ {行|い}きましたか。', '{自転車|じてんしゃ}を{見|み}に', '{服|ふく}を{買|か}いに | {食事|しょくじ}に | {友達|ともだち}に{会|あ}いに', '見に行きました.'),
      Q('Giá xe đạp (lời cuối của Park) là?', 'Không rẻ', 'Rẻ | Không đắt | Rất khó', '安くなかったです = không rẻ.'),
      Q('木村：{何|なに}＿＿＿ ほしいですか。', 'が', 'を | に | で', 'ほしい + が.'),
      Q('パク：{見|み}＿＿＿ {行|い}きました。', 'に', 'を | で | が', '見に行きました.'),
    ]),
    BUILD('lt-b5-ht-5-xep', 'Sắp xếp lượt thoại 5 cho đúng thứ tự', [
      BDT('Hỏi muốn gì → trả lời → hỏi đã xem chưa → trả lời.', [
        '{何|なに} が ほしい です か。',
        '{新|あたら}しい {自転車|じてんしゃ} が ほしい です。',
        'デパート で {見|み}ました か。',
        'はい、 {昨日|きのう}、 {見|み} に {行|い}きました。',
      ]),
    ]),

    H(`${LV.kho} — Hội thoại 6: Thích và ghét món ăn`),
    DLG('Hội thoại 6 — ワンさんとマルコさん', [
      D('ワン', 'f', '^マルコ-さん は どんな {食|た}べ{物|もの} が {好|す}き です か。', 'Marco thích đồ ăn như thế nào?'),
      D('マルコ', 'm', '{甘|あま}い {物|もの} が {好|す}き です。 ケーキ が {好|す}き です。', 'Tôi thích đồ ngọt. Tôi thích bánh ngọt.'),
      D('ワン', 'f', 'どうして です か。', 'Tại sao vậy?'),
      D('マルコ', 'm', 'おいしい です から。', 'Vì ngon.'),
      D('ワン', 'f', '{嫌|きら}い な {物|もの} は あります か。', 'Anh có món nào ghét không?'),
      D('マルコ', 'm', '{辛|から}い {物|もの} は あまり {好|す}き じゃありません。', 'Tôi không thích đồ cay lắm.'),
    ]),
    MC('lt-b5-ht-6', 'Hiểu hội thoại 6 và điền chỗ trống (6 câu)', [
      Q('マルコさんが {好|す}きな{食|た}べ{物|もの}は？', '{甘|あま}い{物|もの}（ケーキ）', '{辛|から}い{物|もの} | {苦|にが}い{物|もの} | {冷|つめ}たい{物|もの}', '甘い物が好き。ケーキが好き.'),
      Q('どうして {好|す}きですか。', 'おいしいですから', '{安|やす}いですから | {忙|いそが}しいですから | {暇|ひま}ですから', 'おいしいですから.'),
      Q('マルコさんは {辛|から}い{物|もの}が？', 'あまり{好|す}きじゃありません', 'とても{好|す}き | {嫌|きら}いで{食|た}べない | ほしい', 'あまり好きじゃありません.'),
      Q('Câu hỏi cuối cùng của Wang là gì?', 'Anh có món nào ghét không?', 'Anh thích phim nào? | Anh muốn có gì? | Anh muốn đi đâu?', '嫌いな物はありますか.'),
      Q('マルコ：ケーキ＿＿＿ {好|す}きです。', 'が', 'を | に | で', '好き + が.'),
      Q('マルコ：{辛|から}い{物|もの}は あまり{好|す}き＿＿＿。', 'じゃありません', 'くないです | ではあります | ありませんでした', 'Tính từ な: あまり好きじゃありません.'),
    ]),
    BUILD('lt-b5-ht-6-xep', 'Sắp xếp lượt thoại 6 cho đúng thứ tự', [
      BDT('Hỏi thích gì → trả lời → hỏi lý do → trả lời lý do.', [
        'どんな {食|た}べ{物|もの} が {好|す}き です か。',
        'ケーキ が {好|す}き です。',
        'どうして です か。',
        'おいしい です から。',
      ]),
    ]),

    H(`${LV.kho} — Chọn câu đáp lại (10 câu)`),
    MC('lt-b5-ht-dap', 'Chọn câu đáp lại tự nhiên nhất', [
      Q('A：{昨日|きのう}、{何|なに}を しましたか。', '{友達|ともだち}と{映画|えいが}を{見|み}ました。', '{友達|ともだち}と{映画|えいが}を{見|み}ます。 | {友達|ともだち}に{映画|えいが}を{見|み}ました。 | {友達|ともだち}と{映画|えいが}は{見|み}ませんでしたです。', 'Quá khứ ました; と = cùng.'),
      Q('A：どこか {行|い}きましたか。 B：はい、＿＿＿', '{海|うみ}へ{行|い}きました。', 'どこか{行|い}きました。 | {海|うみ}を{行|い}きました。 | {海|うみ}が{行|い}きます。', 'はい + nơi cụ thể.'),
      Q('A：どこか {行|い}きましたか。 B：いいえ、＿＿＿', 'どこへも{行|い}きませんでした。', 'どこへも{行|い}きました。 | どこか{行|い}きませんでした。 | どこへ{行|い}きます。', 'どこ(へ)も + phủ định.'),
      Q('A：{映画|えいが}は どうでしたか。', 'おもしろかったです。', 'おもしろいでした。 | おもしろくでした。 | おもしろいです か。', 'Quá khứ tính từ い.'),
      Q('A：どうして {行|い}きませんでしたか。', '{忙|いそが}しかったですから。', '{忙|いそが}しかったが。 | {行|い}きませんでしたから。 | {忙|いそが}しいでしたから。', 'Lý do + ですから.'),
      Q('A：{何|なに}が ほしいですか。', '{新|あたら}しい{服|ふく}が ほしいです。', '{新|あたら}しい{服|ふく}を ほしいです。 | {新|あたら}しい{服|ふく}が ほしいくないです。 | {新|あたら}しい{服|ふく}に ほしいです。', 'ほしい + が.'),
      Q('A：{今度|こんど}の{休|やす}みに、どこへ {行|い}きたいですか。', '{京都|きょうと}へ{行|い}きたいです。', '{京都|きょうと}を{行|い}きたいです。 | {京都|きょうと}へ{行|い}くたいです。 | {京都|きょうと}で{行|い}きます。', '行きたい + へ.'),
      Q('A：{誰|だれ}と {行|い}きましたか。 B：＿＿＿ (một mình)', '{一人|ひとり}で{行|い}きました。', '{一人|ひとり}と{行|い}きました。 | {一人|ひとり}に{行|い}きました。 | {一人|ひとり}を{行|い}きました。', '一人で.'),
      Q('A：{何|なに}が {好|す}きですか。', 'サッカーが{好|す}きです。', 'サッカーを{好|す}きです。 | サッカーに{好|す}きです。 | サッカーで{好|す}きです。', '好き + が.'),
      Q('A：{週末|しゅうまつ}は どうでしたか。 B：＿＿＿ (bận nhưng vui)', '{忙|いそが}しかったですが、{楽|たの}しかったです。', '{忙|いそが}しいですが、{楽|たの}しいでした。 | {忙|いそが}しかったですから、{楽|たの}しいです。 | {忙|いそが}しかったそして、{楽|たの}しかったです。', '忙しかった + が + 楽しかった.'),
    ]),

    H(`${LV.kho} — Câu còn thiếu trong hội thoại ngắn (8 câu)`),
    MC('lt-b5-ht-thieu', 'Chọn lượt thoại phù hợp để điền vào chỗ trống', [
      Q('A：{昨日|きのう}、デパートへ {行|い}きました。 B：＿＿＿？ (giục kể tiếp)', 'それから', 'どうして | だれ | どこ', 'それから？ = rồi sao nữa?'),
      Q('A：{昨日|きのう}は {学校|がっこう}を {休|やす}みました。 B：＿＿＿ですか。 (hỏi lý do)', 'どうして', 'それから | どこ | だれ', 'どうしてですか。'),
      Q('A：{日曜日|にちようび}は {何|なに}を しましたか。 B：＿＿＿', '{洗濯|せんたく}しました。それから、{掃除|そうじ}しました。', '{洗濯|せんたく}します。それから、{掃除|そうじ}します。 | {洗濯|せんたく}しました。から、{掃除|そうじ}しました。 | {洗濯|せんたく}しませんでしたです。', 'Kể hai việc đã làm: ました。それから、ました。'),
      Q('A：{山|やま}の{景色|けしき}は どうでしたか。 B：＿＿＿', 'とてもきれいでした。', 'とてもきれいかったです。 | とてもきれいいでした。 | とてもきれいですでした。', 'きれい (な) → きれいでした.'),
      Q('A：{今度|こんど}の{休|やす}みに {何|なに}を したいですか。 B：＿＿＿', '{友達|ともだち}に{会|あ}いたいです。', '{友達|ともだち}を{会|あ}いたいです。 | {友達|ともだち}に{会|あ}うたいです。 | {友達|ともだち}が{会|あ}いたくないです。', '会いたいです (に).'),
      Q('A：{新|あたら}しい{自転車|じてんしゃ}が ほしいですか。 B：いいえ、＿＿＿', 'ほしくないです。', 'ほしいくないです。 | ほしいじゃありません。 | ほしくなかったでした。', 'ほしい → ほしくない.'),
      Q('A：コーヒーが {好|す}きですか。 B：いいえ、＿＿＿', 'あまり{好|す}きじゃありません。', 'あまり{好|す}きです。 | {好|す}きくないです。 | あまり{好|す}いくないです。', 'あまり + じゃありません.'),
      Q('A：{誰|だれ}と {食事|しょくじ}しましたか。 B：＿＿＿', '{恋人|こいびと}と{食事|しょくじ}しました。', '{恋人|こいびと}に{食事|しょくじ}しました。 | {恋人|こいびと}で{食事|しょくじ}しました。 | {恋人|こいびと}を{食事|しょくじ}しました。', '誰と → ～と.'),
    ]),

    H(`${LV.kho} — Tự nói: đóng vai thí sinh`),
    P('Ba **bản trả lời mẫu** cho ba bộ câu hỏi (kể cuối tuần / kỳ nghỉ tới / thích-muốn-lý do). Chọn bản gần với bạn, **thay từ** bằng thông tin của bạn, che lời thoại và tự nói. Bấm 🎤 ở cuối để thu âm.'),
    DLG('Mẫu A — kể cuối tuần', [
      DX('Giám thị', 'examiner', '{週末|しゅうまつ}、 {何|なに} を しました か。', 'Cuối tuần bạn đã làm gì?'),
      DX('Thí sinh', 'candidate', '{友達|ともだち} と デパート へ {行|い}きました。 {服|ふく} を {買|か}いました。', 'Tôi đã đến trung tâm thương mại cùng bạn. Tôi đã mua quần áo.'),
      DX('Giám thị', 'examiner', 'それから？', 'Rồi sao nữa?'),
      DX('Thí sinh', 'candidate', 'レストラン で {食事|しょくじ} しました。 おいしかった です。', 'Chúng tôi dùng bữa ở nhà hàng. Ngon.'),
      DX('Giám thị', 'examiner', '{週末|しゅうまつ} は どう でした か。', 'Cuối tuần thế nào?'),
      DX('Thí sinh', 'candidate', 'とても {楽|たの}しかった です。', 'Rất vui.'),
    ]),
    DLG('Mẫu B — kỳ nghỉ tới', [
      DX('Giám thị', 'examiner', '{今度|こんど} の {休|やす}み に、 どこ へ {行|い}きたい です か。', 'Kỳ nghỉ tới bạn muốn đi đâu?'),
      DX('Thí sinh', 'candidate', '{京都|きょうと} へ {行|い}きたい です。', 'Tôi muốn đi Kyoto.'),
      DX('Giám thị', 'examiner', '{京都|きょうと} で {何|なに} を したい です か。', 'Ở Kyoto bạn muốn làm gì?'),
      DX('Thí sinh', 'candidate', '{古|ふる}い お{寺|てら} を {見|み}たい です。 {写真|しゃしん} も {撮|と}りたい です。', 'Tôi muốn xem chùa cổ. Cũng muốn chụp ảnh.'),
      DX('Giám thị', 'examiner', '{誰|だれ} と {行|い}きます か。', 'Bạn đi cùng ai?'),
      DX('Thí sinh', 'candidate', '{家族|かぞく} と {行|い}きます。', 'Tôi đi cùng gia đình.'),
    ]),
    DLG('Mẫu C — thích, muốn có, lý do', [
      DX('Giám thị', 'examiner', '{何|なに} が {好|す}き です か。', 'Bạn thích gì?'),
      DX('Thí sinh', 'candidate', 'サッカー が {好|す}き です。 {楽|たの}しい です から。', 'Tôi thích bóng đá. Vì vui.'),
      DX('Giám thị', 'examiner', '{今|いま}、 {何|なに} が ほしい です か。', 'Bây giờ bạn muốn có gì?'),
      DX('Thí sinh', 'candidate', '{新|あたら}しい {自転車|じてんしゃ} が ほしい です。', 'Tôi muốn có xe đạp mới.'),
      DX('Giám thị', 'examiner', 'どうして です か。', 'Tại sao vậy?'),
      DX('Thí sinh', 'candidate', '{私|わたし}の {自転車|じてんしゃ} は {古|ふる}い です から。', 'Vì xe đạp của tôi cũ.'),
    ]),
    SPEAK('lt-b5-ht-noi', [
      'しゅうまつ、なにを しましたか。',
      'きのう、どこか いきましたか。',
      'にちようび、だれと なにを しましたか。',
      'しゅうまつは どうでしたか。',
      'なにが すきですか。',
      'いま、なにが ほしいですか。',
      'こんどの やすみに、なにを したいですか。',
      'どこへ いきたいですか。',
      'どうして にほんごを べんきょうしますか。',
      'きのう、なにを たべましたか。',
    ]),
  ],
};

/* ───────── 9. ĐỌC HIỂU ───────── */

const R5_1: [string, string][] = [
  ['{日曜日|にちようび}、 {友達|ともだち} と {公園|こうえん} へ {行|い}きました。', 'Chủ nhật tôi đã đến công viên cùng bạn.'],
  ['バーベキュー を しました。', 'Chúng tôi đã nướng thịt ngoài trời.'],
  ['{天気|てんき} が よかった です から、 {気持|きも}ち が よかった です。', 'Vì thời tiết đẹp nên rất dễ chịu.'],
  ['とても {楽|たの}しかった です。', 'Rất vui.'],
];
const R5_2: [string, string][] = [
  ['{先週|せんしゅう} の {週末|しゅうまつ}、 {家|いえ} で {洗濯|せんたく} と {掃除|そうじ} を しました。', 'Cuối tuần trước tôi đã giặt đồ và dọn dẹp ở nhà.'],
  ['それから、 デパート へ {買|か}い{物|もの} に {行|い}きました。', 'Sau đó tôi đi trung tâm thương mại để mua sắm.'],
  ['デパート で {新|あたら}しい {服|ふく} を {買|か}いました。', 'Ở trung tâm thương mại tôi đã mua quần áo mới.'],
  ['とても きれいな {服|ふく} でした。', 'Đó là bộ quần áo rất đẹp.'],
  ['{午後|ごご}、 {友達|ともだち} と {食事|しょくじ} を しました。', 'Buổi chiều tôi đã dùng bữa cùng bạn.'],
  ['{週末|しゅうまつ} は {忙|いそが}しかった です が、 {楽|たの}しかった です。', 'Cuối tuần bận nhưng vui.'],
];
const R5_3: [string, string][] = [
  ['{今度|こんど} の {休|やす}み に、 {京都|きょうと} へ {行|い}きたい です。', 'Kỳ nghỉ tới tôi muốn đi Kyoto.'],
  ['{古|ふる}い お{寺|てら} を {見|み}たい です。', 'Tôi muốn xem những ngôi chùa cổ.'],
  ['そして、 {写真|しゃしん} も {撮|と}りたい です。', 'Và cũng muốn chụp ảnh.'],
  ['{京都|きょうと} は {日本|にほん} の {西|にし} に あります。', 'Kyoto nằm ở phía tây Nhật Bản.'],
  ['{東京|とうきょう} から {新幹線|しんかんせん} で {二時間半|にじかんはん} くらい です。', 'Từ Tokyo đi Shinkansen khoảng hai tiếng rưỡi.'],
  ['{一人|ひとり} で は {行|い}きません。 {友達|ともだち} と {行|い}きます。', 'Tôi không đi một mình. Tôi đi cùng bạn.'],
  ['{温泉|おんせん} にも {入|はい}りたい です が、 {高|たか}い です から、 {入|はい}りません。', 'Tôi cũng muốn tắm suối nước nóng nhưng vì đắt nên không tắm.'],
];
const R5_4: [string, string][] = [
  ['{私|わたし} は {新|あたら}しい {自転車|じてんしゃ} が ほしい です。', 'Tôi muốn có xe đạp mới.'],
  ['{昨日|きのう}、 デパート へ {見|み} に {行|い}きました。', 'Hôm qua tôi đã đến trung tâm thương mại để xem.'],
  ['たくさん ありました が、 {高|たか}かった です。', 'Có rất nhiều nhưng đắt.'],
  ['ですから、 {買|か}いません でした。', 'Vì vậy tôi đã không mua.'],
  ['それから、 {友達|ともだち} に {会|あ}いました。', 'Sau đó tôi đã gặp bạn.'],
  ['{友達|ともだち} に {自転車|じてんしゃ} を {借|か}りました。', 'Tôi đã mượn xe đạp của bạn.'],
  ['{公園|こうえん} へ {行|い}きました。', 'Tôi đã đến công viên.'],
  ['{景色|けしき} が きれい でした。', 'Phong cảnh đã đẹp.'],
  ['とても {気持|きも}ち が よかった です。', 'Rất dễ chịu.'],
];
const R5_5: [string, string][] = [
  ['{先週|せんしゅう} の {週末|しゅうまつ}、 {友達|ともだち} と {箱根|はこね} へ {行|い}きました。', 'Cuối tuần trước tôi đã đi Hakone cùng bạn.'],
  ['バス で {二時間|にじかん} くらい でした。', 'Đi xe buýt khoảng hai tiếng.'],
  ['{山|やま} の {景色|けしき} が きれい でした。', 'Phong cảnh núi đã đẹp.'],
  ['それから、 {温泉|おんせん} に {入|はい}りました。', 'Sau đó tôi đã tắm suối nước nóng.'],
  ['とても {気持|きも}ち が よかった です。', 'Rất dễ chịu.'],
  ['レストラン で カレー を {食|た}べました。', 'Tôi đã ăn cà ri ở nhà hàng.'],
  ['おいしかった です が、 {少|すこ}し {辛|から}かった です。', 'Ngon nhưng hơi cay.'],
  ['{写真|しゃしん} を たくさん {撮|と}りました。', 'Tôi đã chụp rất nhiều ảnh.'],
  ['{大変|たいへん} でした が、 とても {楽|たの}しかった です。', 'Vất vả nhưng rất vui.'],
];
const R5_6: [string, string][] = [
  ['ミラ-さん の {週末|しゅうまつ} は {忙|いそが}しかった です。', 'Cuối tuần của Mira bận.'],
  ['{土曜日|どようび}、 {洗濯|せんたく} と {掃除|そうじ} を しました。', 'Thứ bảy cô ấy giặt đồ và dọn dẹp.'],
  ['それから、 {友達|ともだち} と デパート へ {買|か}い{物|もの} に {行|い}きました。', 'Sau đó cô ấy đi mua sắm ở trung tâm thương mại cùng bạn.'],
  ['{日曜日|にちようび} は {仕事|しごと} でした。', 'Chủ nhật cô ấy đi làm.'],
  ['{夜|よる} {十時|じゅうじ} まで {働|はたら}きました。', 'Cô ấy làm việc đến 10 giờ tối.'],
  ['ケン-さん の {週末|しゅうまつ} は {暇|ひま} でした。', 'Cuối tuần của Ken rảnh.'],
  ['どこ へ も {行|い}きません でした。', 'Anh ấy không đi đâu cả.'],
  ['{家|いえ} で {映画|えいが} を {見|み}ました。', 'Anh ấy xem phim ở nhà.'],
  ['たくさん {寝|ね}ました。', 'Anh ấy ngủ rất nhiều.'],
];

const B5_DOC_HIEU: Lesson = {
  id: 'lt-b5-doc-hieu',
  kind: 'reading',
  title: 'Luyện thêm Bài 5 — Đọc hiểu: 6 đoạn từ ngắn đến dài (có furigana → không furigana)',
  goal: 'Đọc hiểu đoạn văn kể việc đã làm, cảm tưởng, kế hoạch và lý do: trả lời câu hỏi chọn đáp án và đúng/sai, rồi đọc to đoạn dài không furigana như phần Reading của thi nói.',
  minutes: 60,
  blocks: [
    NOTE('Cách học bài này', [
      'Đọc đoạn **hai lần**: lần 1 hiểu ý chính (ai, ở đâu, làm gì, thế nào), lần 2 đọc câu hỏi và **tìm câu trả lời ngay trong bài**.',
      'Chú ý thì: câu có ました／でした／かったです là **đã xảy ra**; ～たい là **kế hoạch/mong muốn**; ～から đứng sau lý do. Câu hỏi hay bẫy ở chỗ "đã làm" và "muốn làm".',
      'Câu đúng/sai có lựa chọn thứ ba **"Không có trong bài"**. Đoạn 5–6 là mức Khó: đọc to **không furigana**.',
    ]),

    H(`${LV.de} — Đoạn 1: {私|わたし}の{日曜日|にちようび}`),
    ...PSG('{私|わたし}の{日曜日|にちようび}', R5_1),
    MC('lt-b5-dh-1', 'Câu hỏi đoạn 1 (7 câu)', [
      Q('{誰|だれ}と {公園|こうえん}へ {行|い}きましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '友達と公園へ.'),
      Q('{公園|こうえん}で {何|なに}を しましたか。', 'バーベキュー', '{買|か}い{物|もの} | {洗濯|せんたく} | {写真|しゃしん}', 'バーベキューをしました.'),
      Q('{天気|てんき}は どうでしたか。', 'よかったです', '{悪|わる}かったです | {雨|あめ}でした | {雪|ゆき}でした', '天気がよかった.'),
      Q('{日曜日|にちようび}は どうでしたか。', 'とても{楽|たの}しかったです', '{忙|いそが}しかったです | {大変|たいへん}でした | あまり{楽|たの}しくなかったです', 'とても楽しかった.'),
      TF('{日曜日|にちようび}は {雨|あめ}でした。', 'Sai', '天気がよかった.'),
      TF('{家族|かぞく}と {公園|こうえん}へ {行|い}きました。', 'Sai', '友達と行きました.'),
      TF('{写真|しゃしん}を {撮|と}りました。', 'Không có trong bài', 'Bài không nhắc đến ảnh.'),
    ]),

    H(`${LV.de} — Đoạn 2: リンさんの{週末|しゅうまつ}`),
    ...PSG('リンさんの{週末|しゅうまつ}', R5_2),
    MC('lt-b5-dh-2', 'Câu hỏi đoạn 2 (8 câu)', [
      Q('{家|いえ}で {何|なに}を しましたか。', '{洗濯|せんたく}と{掃除|そうじ}', '{食事|しょくじ}と{買|か}い{物|もの} | {映画|えいが}と{写真|しゃしん} | {勉強|べんきょう}と{仕事|しごと}', '洗濯と掃除をしました.'),
      Q('デパートで {何|なに}を {買|か}いましたか。', '{新|あたら}しい{服|ふく}', '{新|あたら}しい{自転車|じてんしゃ} | ケーキ | {本|ほん}', '新しい服を買いました.'),
      Q('{午後|ごご}は {誰|だれ}と {食事|しょくじ}しましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '午後、友達と食事.'),
      Q('{服|ふく}は どうでしたか。', 'きれいでした', '{高|たか}かったです | {古|ふる}かったです | {小|ちい}さかったです', 'とてもきれいな服でした.'),
      Q('{週末|しゅうまつ}は？', '{忙|いそが}しかったですが、{楽|たの}しかったです', '{暇|ひま}で{楽|たの}しかったです | {忙|いそが}しくて{楽|たの}しくなかったです | {暇|ひま}でした', '忙しかったですが、楽しかったです.'),
      TF('デパートへ {一人|ひとり}で {行|い}きました。', 'Không có trong bài', 'Bài không nói đi với ai.'),
      TF('{洗濯|せんたく}の{後|あと}で {買|か}い{物|もの}に {行|い}きました。', 'Đúng', 'それから (sau đó) デパートへ.'),
      TF('リンさんは {食事|しょくじ}を しませんでした。', 'Sai', '午後、友達と食事をしました.'),
    ]),

    H(`${LV.vua} — Đoạn 3: {今度|こんど}の{休|やす}み`),
    ...PSG('{今度|こんど}の{休|やす}み', R5_3),
    MC('lt-b5-dh-3', 'Câu hỏi đoạn 3 (8 câu)', [
      Q('{今度|こんど}の{休|やす}みに どこへ {行|い}きたいですか。', '{京都|きょうと}', '{東京|とうきょう} | {箱根|はこね} | {沖縄|おきなわ}', '京都へ行きたい.'),
      Q('{京都|きょうと}で {何|なに}を {見|み}たいですか。', '{古|ふる}いお{寺|てら}', '{新|あたら}しいビル | {美術館|びじゅつかん} | {温泉|おんせん}', '古いお寺を見たい.'),
      Q('{京都|きょうと}は {日本|にほん}の どこですか。', '{西|にし}', '{北|きた} | {東|ひがし} | {南|みなみ}', '日本の西.'),
      Q('{東京|とうきょう}から {京都|きょうと}まで{新幹線|しんかんせん}で？', '{二時間半|にじかんはん}くらい', '{十分|じゅっぷん}くらい | {五時間|ごじかん}くらい | {二十分|にじゅっぷん}くらい', '二時間半.'),
      Q('{誰|だれ}と {行|い}きますか。', '{友達|ともだち}', '{家族|かぞく} | {一人|ひとり} | {恋人|こいびと}', '友達と行きます.'),
      Q('{温泉|おんせん}に {入|はい}りますか。', 'いいえ、{高|たか}いですから{入|はい}りません', 'はい、{入|はい}ります | はい、{安|やす}いですから{入|はい}ります | いいえ、{嫌|きら}いですから{入|はい}りません', '入りたいですが、高いですから入りません.'),
      TF('{一人|ひとり}で {行|い}きます。', 'Sai', '友達と行きます.'),
      TF('{写真|しゃしん}を {撮|と}りたいです。', 'Đúng', '写真も撮りたいです.'),
    ]),

    H(`${LV.vua} — Đoạn 4: パクさんの{自転車|じてんしゃ}`),
    ...PSG('パクさんの{自転車|じてんしゃ}', R5_4),
    MC('lt-b5-dh-4', 'Câu hỏi đoạn 4 (9 câu)', [
      Q('パクさんは {何|なに}が ほしいですか。', '{新|あたら}しい{自転車|じてんしゃ}', '{新|あたら}しい{服|ふく} | {車|くるま} | {家|いえ}', '新しい自転車がほしい.'),
      Q('{昨日|きのう}、{何|なに}を しに デパートへ {行|い}きましたか。', '{自転車|じてんしゃ}を{見|み}に', '{友達|ともだち}に{会|あ}いに | {食事|しょくじ}に | {洗濯|せんたく}に', '見に行きました.'),
      Q('{自転車|じてんしゃ}は どうでしたか。', '{高|たか}かったです', '{安|やす}かったです | {小|ちい}さかったです | {古|ふる}かったです', '高かったです.'),
      Q('パクさんは {自転車|じてんしゃ}を {買|か}いましたか。', 'いいえ、{買|か}いませんでした', 'はい、{買|か}いました | はい、{借|か}りました | いいえ、{友達|ともだち}に{借|か}りませんでした', '買いませんでした.'),
      Q('どうして {買|か}いませんでしたか。', '{高|たか}かったですから', '{忙|いそが}しかったですから | {嫌|きら}いですから | {雨|あめ}でしたから', '高かったですから.'),
      Q('{友達|ともだち}に {何|なに}を {借|か}りましたか。', '{自転車|じてんしゃ}', '{服|ふく} | {本|ほん} | ペン', '友達に自転車を借りました.'),
      Q('{公園|こうえん}の{景色|けしき}は？', 'きれいでした', '{悪|わる}かったです | {高|たか}かったです | {忙|いそが}しかったです', '景色がきれいでした.'),
      TF('パクさんは デパートで {自転車|じてんしゃ}を {買|か}いました。', 'Sai', '買いませんでした.'),
      TF('パクさんは {一人|ひとり}で {公園|こうえん}へ {行|い}きました。', 'Không có trong bài', 'Bài không nói đi với ai.'),
    ]),

    H(`${LV.kho} — Đoạn 5: {箱根|はこね}の{温泉|おんせん}{旅行|りょこう} (có đọc to không furigana)`),
    ...PSG('{箱根|はこね}の{温泉|おんせん}{旅行|りょこう}', R5_5, 'Đoạn dài hơn: theo dõi thứ tự việc làm và cảm tưởng từng việc.'),
    MC('lt-b5-dh-5', 'Câu hỏi đoạn 5 (9 câu)', [
      Q('{誰|だれ}と {箱根|はこね}へ {行|い}きましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '友達と.'),
      Q('{箱根|はこね}まで {何|なん}で {行|い}きましたか。', 'バス', '{電車|でんしゃ} | {新幹線|しんかんせん} | {車|くるま}', 'バスで二時間くらい.'),
      Q('{箱根|はこね}の{景色|けしき}は？', 'きれいでした', '{悪|わる}かったです | {高|たか}かったです | {難|むずか}しかったです', '山の景色がきれいでした.'),
      Q('Sau khi ngắm phong cảnh, họ đã làm gì?', 'Tắm suối nước nóng', 'Mua sắm | Chụp ảnh | Ăn cà ri', 'それから、温泉に入りました.'),
      Q('{温泉|おんせん}は どうでしたか。', 'とても{気持|きも}ちがよかったです', 'あまり{気持|きも}ちがよくなかったです | {高|たか}かったです | {辛|から}かったです', '気持ちがよかった.'),
      Q('レストランで {何|なに}を {食|た}べましたか。', 'カレー', 'ケーキ | スープ | ご{飯|はん}', 'カレーを食べました.'),
      Q('カレーは どうでしたか。', 'おいしかったですが、{少|すこ}し{辛|から}かったです', 'おいしくなかったです | {甘|あま}かったです | {冷|つめ}たかったです', 'おいしかったですが、少し辛かったです.'),
      TF('{写真|しゃしん}を たくさん {撮|と}りました。', 'Đúng', '写真をたくさん撮りました.'),
      TF('{旅行|りょこう}は {楽|たの}しくありませんでした。', 'Sai', '大変でしたが、とても楽しかったです.'),
    ]),
    READK('lt-b5-dh-5-doc', 'Đọc to đoạn 5 không furigana', 'Nhìn 20 giây rồi đọc một hơi. Chú ý 箱根 = はこね; 温泉 = おんせん; 景色 = けしき; 大変 = たいへん.', [RKP(R5_5)]),

    H(`${LV.kho} — Đoạn 6: ミラさんとケンさんの{週末|しゅうまつ}`),
    ...PSG('ミラさんとケンさんの{週末|しゅうまつ}', R5_6, 'So sánh hai người: lưu ý ai đã làm gì, ai không đi đâu.'),
    MC('lt-b5-dh-6', 'Câu hỏi đoạn 6 (9 câu)', [
      Q('ミラさんの{週末|しゅうまつ}は？', '{忙|いそが}しかったです', '{暇|ひま}でした | {楽|たの}しくなかったです | {寒|さむ}かったです', 'ミラさんの週末は忙しかった.'),
      Q('ケンさんの{週末|しゅうまつ}は？', '{暇|ひま}でした', '{忙|いそが}しかったです | {大変|たいへん}でした | {高|たか}かったです', 'ケンさんの週末は暇でした.'),
      Q('{土曜日|どようび}、ミラさんは {何|なに}を しましたか。', '{洗濯|せんたく}と{掃除|そうじ}', '{映画|えいが}と{睡眠|すいみん} | {食事|しょくじ}と{買|か}い{物|もの} | {仕事|しごと}', '洗濯と掃除をしました.'),
      Q('Chủ nhật Mira đã làm gì?', 'Đi làm đến 10 giờ tối', 'Đi mua sắm cùng bạn | Ngủ ở nhà | Đi du lịch đâu đó', '日曜日は仕事でした。夜十時まで働きました.'),
      Q('ケンさんは どこかへ {行|い}きましたか。', 'いいえ、どこへも{行|い}きませんでした', 'はい、{映画|えいが}を{見|み}に{行|い}きました | はい、デパートへ{行|い}きました | はい、{公園|こうえん}へ{行|い}きました', 'どこへも行きませんでした.'),
      Q('Ken đã làm gì ở nhà?', 'Xem phim và ngủ nhiều', 'Giặt đồ và dọn dẹp | Đi làm | Mua sắm', '家で映画を見ました。たくさん寝ました.'),
      TF('ミラさんは {友達|ともだち}と デパートへ {行|い}きました。', 'Đúng', '友達とデパートへ買い物に行きました.'),
      TF('ケンさんは {料理|りょうり}を しました。', 'Không có trong bài', 'Bài không nhắc đến việc nấu ăn.'),
      TF('ミラさんの{日曜日|にちようび}は {暇|ひま}でした。', 'Sai', '日曜日は仕事でした (bận).'),
    ]),
    READK('lt-b5-dh-6-doc', 'Đọc to đoạn 6 không furigana', undefined, [RKP(R5_6)]),

    H(`${LV.kho} — Đọc lướt: tìm thông tin giữa các đoạn (8 câu)`),
    MC('lt-b5-dh-tong', 'Tìm nhanh trong 6 đoạn đã đọc', [
      Q('Đoạn nào nhắc đến バーベキュー?', 'Đoạn 1', 'Đoạn 2 | Đoạn 4 | Đoạn 5', 'Đoạn 1.'),
      Q('Đoạn nào nói người viết MUỐN đi Kyoto?', 'Đoạn 3', 'Đoạn 1 | Đoạn 2 | Đoạn 5', 'Đoạn 3: 京都へ行きたい.'),
      Q('Đoạn nào có người KHÔNG MUA vì đắt?', 'Đoạn 4', 'Đoạn 1 | Đoạn 2 | Đoạn 6', 'Đoạn 4: 高かったですから、買いませんでした.'),
      Q('Đoạn nào có người đã tắm suối nước nóng?', 'Đoạn 5', 'Đoạn 1 | Đoạn 3 | Đoạn 6', 'Đoạn 5: 温泉に入りました.'),
      Q('Đoạn nào có người không đi đâu cả?', 'Đoạn 6 (ケンさん)', 'Đoạn 1 | Đoạn 2 | Đoạn 5', 'ケンさん: どこへも行きませんでした.'),
      Q('Ở đoạn nào có từ 「デパート」?', 'Đoạn 2, 4, 6', 'Đoạn 1, 3, 5 | Chỉ đoạn 1 | Chỉ đoạn 5', 'Đoạn 2 (買い物), 4 (見に), 6 (買い物).'),
      Q('Đoạn nào có người làm việc vào Chủ nhật?', 'Đoạn 6 (ミラさん)', 'Đoạn 1 | Đoạn 2 | Đoạn 4', 'ミラさん: 日曜日は仕事.'),
      Q('Đoạn nào nói "ăn cà ri"?', 'Đoạn 5', 'Đoạn 2 | Đoạn 3 | Đoạn 4', 'Đoạn 5: レストランでカレー.'),
    ]),
  ],
};

/* ───────── 10. NGHE ───────── */

const B5_NGHE: Lesson = {
  id: 'lt-b5-nghe',
  kind: 'listening',
  title: 'Luyện thêm Bài 5 — Nghe: 10 đoạn mới, từ chậm đơn giản đến bẫy (tự sửa giờ, tự sửa tiền, đổi nhận xét)',
  goal: 'Nghe hiểu hội thoại về việc đã làm, đi với ai, có đi đâu không, cảm tưởng, thích/muốn và lý do; bắt được thông tin CUỐI CÙNG khi người nói tự sửa — đúng dạng nghe điền / nghe chọn của đề.',
  minutes: 65,
  blocks: [
    NOTE('Cách học bài này', [
      'Nghe **hai lần**. Lần 1: ghi **việc, nơi, người, giờ, tiền** ra giấy. Lần 2: mới đọc câu hỏi. Không bật lời thoại trước khi trả lời xong.',
      'Đoạn 4, 7, 8 có **bẫy sửa lời**: 「簡単でした。……いいえ、少し難しかったです」, 「三万円です。あ、いいえ、二万円です」, 「七時です。あ、いいえ、八時です」. Luôn lấy thông tin **sau cùng**.',
      'Nghe thì: ました／でした／かったです = **đã xảy ra**; ます／たいです = **sắp/muốn**. Bẫy từ chỉ thời gian: **昨日 (hôm qua) ≠ 明日 (ngày mai)**, **先週 ≠ 来週**.',
      'Lỗi hay mắc: nhầm **三万 (さんまん)** với **二万 (にまん)**; nhầm **七時 (しちじ)** với **八時 (はちじ)**; quên nghe chữ **ませんでした** cuối câu (phủ định).',
    ]),
    RECAP('Bảng đoạn nghe', [
      '① ～ ③ 🟢 chậm, đơn giản: việc đã làm, đi với ai, không đi đâu.',
      '④ ～ ⑥ 🟡 cảm tưởng (có sửa), thích, kế hoạch.',
      '⑦ ～ ⑨ 🔴 bẫy: sửa tiền, sửa giờ, thứ tự việc.',
      '⑩ 🔴 hội thoại dài (もう一度聞こう): 8 câu hỏi.',
    ]),

    H(`${LV.de} — ① ～ ③`),
    LS('lt-b5-ng-01', '① Mua sắm hôm qua', [
      L('パク', 'f', '^マルコ-さん、 {昨日|きのう}、 {何|なに} を しました か。', 'Marco, hôm qua anh đã làm gì?'),
      L('マルコ', 'm', 'デパート へ {買|か}い{物|もの} に {行|い}きました。', 'Tôi đã đến trung tâm thương mại để mua sắm.'),
      L('パク', 'f', '{何|なに} を {買|か}いました か。', 'Anh đã mua gì?'),
      L('マルコ', 'm', '{新|あたら}しい くつ を {買|か}いました。', 'Tôi đã mua một đôi giày mới.'),
    ]),
    LS('lt-b5-ng-02', '② Xem phim một mình', [
      L('ワン', 'f', '{日曜日|にちようび}、 {誰|だれ} と {映画|えいが} を {見|み}ました か。', 'Chủ nhật anh đã xem phim với ai?'),
      L('ダニエル', 'm', '{一人|ひとり} で {見|み}ました。', 'Tôi đã xem một mình.'),
      L('ワン', 'f', '{映画|えいが} は どう でした か。', 'Phim thế nào?'),
      L('ダニエル', 'm', 'おもしろかった です が、 {少|すこ}し {高|たか}かった です。', 'Hay nhưng hơi đắt.'),
    ]),
    LS('lt-b5-ng-03', '③ Không đi đâu vì mưa', [
      L('アンナ', 'f', '{先週|せんしゅう} の {土曜日|どようび}、 どこ か {行|い}きました か。', 'Thứ bảy tuần trước anh có đi đâu không?'),
      L('ナタポン', 'm', 'いいえ、 どこ へ も {行|い}きません でした。', 'Không, tôi đã không đi đâu cả.'),
      L('アンナ', 'f', 'どうして です か。', 'Tại sao vậy?'),
      L('ナタポン', 'm', '{雨|あめ} でした から。 {家|いえ} で {洗濯|せんたく} を しました。 それから、 {掃除|そうじ} も しました。', 'Vì trời mưa. Tôi giặt đồ ở nhà. Sau đó cũng dọn dẹp.'),
    ]),
    MC('lt-b5-ng-q1', 'Câu hỏi ① ～ ③ (9 câu)', [
      Q('① マルコさんは {昨日|きのう}、{何|なに}を しましたか。', '{買|か}い{物|もの}', '{洗濯|せんたく} | {食事|しょくじ} | {映画|えいが}', '買い物に行きました.'),
      Q('① どこへ {行|い}きましたか。', 'デパート', '{美術館|びじゅつかん} | {公園|こうえん} | {海|うみ}', 'デパートへ.'),
      Q('① {何|なに}を {買|か}いましたか。', '{新|あたら}しい くつ', '{新|あたら}しい{服|ふく} | {新|あたら}しい{本|ほん} | {新|あたら}しい{自転車|じてんしゃ}', 'くつを買いました.'),
      Q('② ダニエルさんは {誰|だれ}と {映画|えいが}を{見|み}ましたか。', '{一人|ひとり}で', '{友達|ともだち}と | {家族|かぞく}と | {恋人|こいびと}と', '一人で見ました.'),
      Q('② {映画|えいが}は どうでしたか。', 'おもしろかったですが、{少|すこ}し{高|たか}かったです', 'おもしろくなかったです | とても{安|やす}かったです | {難|むずか}しかったです', 'おもしろかったですが、少し高かったです.'),
      Q('③ ナタポンさんは どこか {行|い}きましたか。', 'いいえ、どこへも{行|い}きませんでした', 'はい、{公園|こうえん}へ{行|い}きました | はい、{海|うみ}へ{行|い}きました | はい、デパートへ{行|い}きました', 'どこへも行きませんでした.'),
      Q('③ どうして？', '{雨|あめ}でしたから', '{忙|いそが}しかったですから | {風邪|かぜ}でしたから | {高|たか}かったですから', '雨でしたから.'),
      Q('③ Ở nhà, việc ĐẦU TIÊN Natapon làm là gì?', '{洗濯|せんたく}', '{掃除|そうじ} | {食事|しょくじ} | {勉強|べんきょう}', '洗濯を…それから掃除.'),
      Q('③ Việc làm SAU ĐÓ (それから) là gì?', '{掃除|そうじ}', '{洗濯|せんたく} | {食事|しょくじ} | {勉強|べんきょう}', 'それから、掃除.'),
    ]),

    H(`${LV.vua} — ④ ～ ⑥`),
    LS('lt-b5-ng-04', '④ Bài kiểm tra hôm qua (bẫy: đổi nhận xét)', [
      L('リン', 'f', '{昨日|きのう} の テスト は どう でした か。', 'Bài kiểm tra hôm qua thế nào?'),
      L('カルロス', 'm', '{簡単|かんたん} でした。 ……いいえ、 {少|すこ}し {難|むずか}しかった です。', 'Dễ. … À không, hơi khó.'),
      L('リン', 'f', 'そう です か。', 'Vậy à.'),
    ]),
    LS('lt-b5-ng-05', '⑤ Môn thể thao yêu thích', [
      L('パク', 'f', '^マルコ-さん、 {何|なに} が {好|す}き です か。', 'Marco, anh thích gì?'),
      L('マルコ', 'm', 'サッカー が {好|す}き です。', 'Tôi thích bóng đá.'),
      L('パク', 'f', '{毎日|まいにち} しますか。', 'Anh chơi mỗi ngày à?'),
      L('マルコ', 'm', 'いいえ、 {毎週|まいしゅう} {土曜日|どようび} に します。', 'Không, tôi chơi vào thứ bảy hằng tuần.'),
    ]),
    LS('lt-b5-ng-06', '⑥ Kỳ nghỉ tới', [
      L('ワン', 'f', '{今度|こんど} の {休|やす}み に {何|なに} を したい です か。', 'Kỳ nghỉ tới anh muốn làm gì?'),
      L('ダニエル', 'm', '{京都|きょうと} へ {行|い}きたい です。 {古|ふる}い お{寺|てら} を {見|み}たい です。', 'Tôi muốn đi Kyoto. Muốn xem những ngôi chùa cổ.'),
      L('ワン', 'f', '{一人|ひとり} で {行|い}きます か。', 'Anh đi một mình à?'),
      L('ダニエル', 'm', 'いいえ、 {友達|ともだち} と {行|い}きます。', 'Không, tôi đi cùng bạn.'),
    ]),
    MC('lt-b5-ng-q2', 'Câu hỏi ④ ～ ⑥ (10 câu)', [
      Q('④ Nhận xét CUỐI CÙNG của Carlos về bài kiểm tra là?', '{少|すこ}し{難|むずか}しかったです', '{簡単|かんたん}でした | とても{簡単|かんたん}でした | {難|むずか}しくなかったです', 'Sửa lại thành: 少し難しかったです.'),
      Q('④ テストは？', 'Hơi khó', 'Dễ | Rất dễ | Không khó', 'Câu sau cùng: hơi khó.'),
      Q('④ テストは いつでしたか。', '{昨日|きのう}', '{明日|あした} | {先週|せんしゅう} | {来週|らいしゅう}', '昨日のテスト.'),
      Q('⑤ マルコさんが {好|す}きなものは？', 'サッカー', 'テニス | {映画|えいが} | ゲーム', 'サッカーが好き.'),
      Q('⑤ {毎日|まいにち}しますか。', 'いいえ', 'はい | ときどき | わからない', 'いいえ、毎週土曜日に.'),
      Q('⑤ いつ しますか。', '{毎週|まいしゅう}{土曜日|どようび}', '{毎日|まいにち} | {毎週|まいしゅう}{日曜日|にちようび} | {毎月|まいつき}', '毎週土曜日.'),
      Q('⑥ ダニエルさんは どこへ {行|い}きたいですか。', '{京都|きょうと}', '{東京|とうきょう} | {箱根|はこね} | {沖縄|おきなわ}', '京都へ行きたい.'),
      Q('⑥ {何|なに}を {見|み}たいですか。', '{古|ふる}いお{寺|てら}', '{新|あたら}しいビル | {美術館|びじゅつかん} | {海|うみ}', '古いお寺を見たい.'),
      Q('⑥ {誰|だれ}と {行|い}きますか。', '{友達|ともだち}', '{一人|ひとり} | {家族|かぞく} | {恋人|こいびと}', '友達と行きます.'),
      Q('⑥ ダニエルさんは {一人|ひとり}で {行|い}きますか。', 'いいえ', 'はい | たぶん | わからない', 'いいえ、友達と.'),
    ]),

    H(`${LV.kho} — ⑦ ～ ⑨ (bẫy: sửa tiền, sửa giờ, thứ tự việc)`),
    LS('lt-b5-ng-07', '⑦ Xe đạp mới (bẫy: sửa giá)', [
      L('リン', 'f', '{新|あたら}しい {自転車|じてんしゃ} が ほしい です。', 'Tôi muốn có xe đạp mới.'),
      L('マルコ', 'm', 'いくら です か。', 'Bao nhiêu tiền?'),
      L('リン', 'f', '{三万円|さんまんえん} です。 あ、 いいえ、 {二万円|にまんえん} です。', '30.000 yên. À không, 20.000 yên.'),
      L('マルコ', 'm', 'そう です か。 {高|たか}い です ね。', 'Vậy à. Đắt nhỉ.'),
    ]),
    LS('lt-b5-ng-08', '⑧ Sáng hôm qua (bẫy: sửa giờ)', [
      L('マルコ', 'm', '{昨日|きのう} は {七時|しちじ} に {起|お}きました。 あ、 いいえ、 {八時|はちじ} です。', 'Hôm qua tôi dậy lúc 7 giờ. À không, 8 giờ.'),
      L('マルコ', 'm', '{学校|がっこう} へ {九時|くじ} に {行|い}きました。 それから、 {勉強|べんきょう} しました。', 'Tôi đến trường lúc 9 giờ. Sau đó tôi học.'),
    ]),
    LS('lt-b5-ng-09', '⑨ Chủ nhật bận rộn (thứ tự việc)', [
      L('ダニエル', 'm', '{先週|せんしゅう} の {日曜日|にちようび} は {忙|いそが}しかった です。', 'Chủ nhật tuần trước tôi đã bận.'),
      L('ダニエル', 'm', '{朝|あさ}、 {洗濯|せんたく} を しました。 それから、 {掃除|そうじ} を しました。', 'Buổi sáng tôi giặt đồ. Sau đó dọn dẹp.'),
      L('ダニエル', 'm', '{午後|ごご}、 {友達|ともだち} と {食事|しょくじ} に {行|い}きました。 とても {楽|たの}しかった です。', 'Buổi chiều tôi đi ăn cùng bạn. Rất vui.'),
    ]),
    MC('lt-b5-ng-q3', 'Câu hỏi ⑦ ～ ⑨ (10 câu)', [
      Q('⑦ Giá xe đạp (con số CUỐI CÙNG) là?', '{二万円|にまんえん}', '{三万円|さんまんえん} | {一万円|いちまんえん} | {二千円|にせんえん}', '三万円 → sửa thành 二万円.'),
      Q('⑦ 「にまんえん」 は？', '20.000 yên', '30.000 yên | 2.000 yên | 200.000 yên', 'にまん = 20.000.'),
      Q('⑦ Marco nhận xét xe đạp thế nào?', '{高|たか}い', '{安|やす}い | {小|ちい}さい | {難|むずか}しい', '高いですね.'),
      Q('⑧ Marco dậy lúc mấy giờ? (giờ CUỐI CÙNG)', '{八時|はちじ}', '{七時|しちじ} | {九時|くじ} | {六時|ろくじ}', '七時 → sửa thành 八時.'),
      Q('⑧ {学校|がっこう}へ {行|い}った{時間|じかん}は？', '{九時|くじ}', '{八時|はちじ} | {十時|じゅうじ} | {七時|しちじ}', '九時に行きました.'),
      Q('⑧ {学校|がっこう}で {何|なに}を しましたか。', '{勉強|べんきょう}', '{洗濯|せんたく} | {掃除|そうじ} | {食事|しょくじ}', '勉強しました.'),
      Q('⑨ Sáng Chủ nhật, việc ĐẦU TIÊN là gì?', '{洗濯|せんたく}', '{掃除|そうじ} | {食事|しょくじ} | {買|か}い{物|もの}', '朝、洗濯を…'),
      Q('⑨ {洗濯|せんたく}の{後|あと}、{何|なに}を しましたか。', '{掃除|そうじ}', '{食事|しょくじ} | {買|か}い{物|もの} | {映画|えいが}', 'それから、掃除.'),
      Q('⑨ Buổi chiều anh ấy đã làm gì?', 'Đi ăn cùng bạn', 'Ngủ một mình | Giặt đồ ở nhà | Đi làm', '午後、友達と食事に行きました.'),
      Q('⑨ {日曜日|にちようび}は どうでしたか。', '{忙|いそが}しかったですが、{楽|たの}しかったです', '{暇|ひま}でした | {忙|いそが}しくて{楽|たの}しくなかったです | {大変|たいへん}でした', '忙しかったです…とても楽しかったです.'),
    ]),

    H(`${LV.kho} — ⑩ Hội thoại dài ({もう一度|もういちど}{聞|き}こう)`),
    LS('lt-b5-ng-10', '⑩ Hakone cuối tuần trước', [
      L('パク', 'f', '^マルコ-さん、 {先週|せんしゅう} の {週末|しゅうまつ}、 どこ か {行|い}きました か。', 'Marco, cuối tuần trước anh có đi đâu không?'),
      L('マルコ', 'm', 'はい、 {友達|ともだち} と {箱根|はこね} へ {行|い}きました。', 'Có, tôi đã đi Hakone cùng bạn.'),
      L('パク', 'f', '{箱根|はこね} は どう でした か。', 'Hakone thế nào?'),
      L('マルコ', 'm', '{景色|けしき} が きれい でした。 そして、 {温泉|おんせん} に {入|はい}りました。 {気持|きも}ちが よかった です。', 'Phong cảnh đẹp. Và tôi tắm suối nước nóng. Rất dễ chịu.'),
      L('パク', 'f', 'いい です ね。 {何|なん} で {行|い}きました か。', 'Hay nhỉ. Anh đi bằng gì?'),
      L('マルコ', 'm', 'バス で {行|い}きました。 {二時間|にじかん} くらい でした。', 'Tôi đi xe buýt. Khoảng hai tiếng.'),
      L('パク', 'f', '{食事|しょくじ} は しました か。', 'Anh có dùng bữa không?'),
      L('マルコ', 'm', 'はい、 レストラン で カレー を {食|た}べました。 おいしかった です が、 {少|すこ}し {辛|から}かった です。', 'Có, tôi ăn cà ri ở nhà hàng. Ngon nhưng hơi cay.'),
      L('パク', 'f', '{私|わたし} も {箱根|はこね} へ {行|い}きたい です。', 'Tôi cũng muốn đi Hakone.'),
    ]),
    MC('lt-b5-ng-q4', 'Câu hỏi ⑩ (8 câu)', [
      Q('マルコさんは {誰|だれ}と {箱根|はこね}へ {行|い}きましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '友達と.'),
      Q('{箱根|はこね}の{景色|けしき}は？', 'きれいでした', 'きれいじゃありませんでした | {高|たか}かったです | {忙|いそが}しかったです', '景色がきれいでした.'),
      Q('{箱根|はこね}で {景色|けしき}の{後|あと}、{何|なに}を しましたか。', '{温泉|おんせん}に{入|はい}りました', '{買|か}い{物|もの}しました | {写真|しゃしん}を{撮|と}りました | {洗濯|せんたく}しました', 'そして、温泉に入りました.'),
      Q('{温泉|おんせん}は どうでしたか。', '{気持|きも}ちがよかったです', 'あまりよくなかったです | {高|たか}かったです | {辛|から}かったです', '気持ちがよかったです.'),
      Q('{何|なん}で {行|い}きましたか。', 'バス', '{電車|でんしゃ} | {車|くるま} | {新幹線|しんかんせん}', 'バスで行きました.'),
      Q('{時間|じかん}は？', '{二時間|にじかん}くらい', '{十二時間|じゅうにじかん}くらい | {二分|にふん}くらい | {二日|ふつか}くらい', '二時間くらい.'),
      Q('カレーは どうでしたか。', 'おいしかったですが、{少|すこ}し{辛|から}かったです', 'おいしくなかったです | {甘|あま}かったです | {冷|つめ}たかったです', 'おいしかったですが、少し辛かったです.'),
      Q('Park nói gì ở câu CUỐI CÙNG?', '{箱根|はこね}へ{行|い}きたいです', '{箱根|はこね}へ{行|い}きたくないです | {箱根|はこね}へ{行|い}きました | {箱根|はこね}が{嫌|きら}い', '私も箱根へ行きたいです.'),
    ]),

    H(`${LV.kho} — Nghe điền chỗ trống (6 câu, như dạng Slot 30)`),
    QZ('lt-b5-ng-dien', 'Nghe lại ①, ③, ⑩ rồi điền (chữ Hán hoặc hiragana)', 'fill', [
      A('① パク：{昨日|きのう}、＿＿＿ をしましたか。', '{何|なに}'),
      A('① マルコ：デパートへ{買|か}い{物|もの}＿＿＿ {行|い}きました。', 'に'),
      A('③ ナタポン：どこ＿＿＿ も{行|い}きませんでした。', 'へ'),
      A('③ ナタポン：{雨|あめ}でした＿＿＿。', 'から'),
      A('⑩ マルコ：{温泉|おんせん}に＿＿＿ました。 (vào)', '{入|はい}り'),
      A('⑩ マルコ：おいしかったです＿＿＿、{少|すこ}し{辛|から}かったです。', 'が'),
    ]),
  ],
};

/* ───────── 11. NÓI & VIẾT ───────── */

const R5_A1: [string, string][] = [
  ['{先週|せんしゅう} の {日曜日|にちようび}、 {友達|ともだち} と {海|うみ} へ {行|い}きました。', 'Chủ nhật tuần trước tôi đã ra biển cùng bạn.'],
  ['{天気|てんき} が よかった です から、 {気持|きも}ちが よかった です。', 'Vì thời tiết đẹp nên rất dễ chịu.'],
  ['{海|うみ} で {写真|しゃしん} を {撮|と}りました。', 'Tôi đã chụp ảnh ở biển.'],
  ['それから、 レストラン で カレー を {食|た}べました。', 'Sau đó tôi ăn cà ri ở nhà hàng.'],
  ['おいしかった です が、 {少|すこ}し {高|たか}かった です。', 'Ngon nhưng hơi đắt.'],
  ['とても {楽|たの}しい {一日|いちにち} でした。', 'Đó là một ngày rất vui.'],
];
const R5_A2: [string, string][] = [
  ['{今度|こんど} の {休|やす}み に、 {山|やま} に {登|のぼ}りたい です。', 'Kỳ nghỉ tới tôi muốn leo núi.'],
  ['{山|やま} の {景色|けしき} が {好|す}き です から。', 'Vì tôi thích phong cảnh núi.'],
  ['{友達|ともだち} と {行|い}きます。', 'Tôi đi cùng bạn.'],
  ['{山|やま} の {北|きた} に {温泉|おんせん} が あります。', 'Ở phía bắc ngọn núi có suối nước nóng.'],
  ['{温泉|おんせん} にも {入|はい}りたい です。', 'Tôi cũng muốn tắm suối nước nóng.'],
  ['{写真|しゃしん} も たくさん {撮|と}りたい です。', 'Tôi cũng muốn chụp thật nhiều ảnh.'],
];
const R5_A3: [string, string][] = [
  ['{私|わたし} は コーヒー が {好|す}き です。', 'Tôi thích cà phê.'],
  ['{毎朝|まいあさ}、 {飲|の}みます。', 'Sáng nào tôi cũng uống.'],
  ['{甘|あま}い コーヒー が {好|す}き です から。', 'Vì tôi thích cà phê ngọt.'],
  ['お{茶|ちゃ} は あまり {好|す}き じゃありません。', 'Tôi không thích trà lắm.'],
  ['{苦|にが}い です から。', 'Vì nó đắng.'],
  ['{今|いま}、 {新|あたら}しい コーヒー の カップ が ほしい です。', 'Bây giờ tôi muốn có một chiếc cốc cà phê mới.'],
];

const B5_NOI_VIET: Lesson = {
  id: 'lt-b5-noi-viet',
  kind: 'speaking',
  title: 'Luyện thêm Bài 5 — Nói & viết: 4 bộ câu hỏi thi nói (3 câu có tranh + 1 câu cá nhân) · đọc to · bài viết 3–5 câu',
  goal: 'Trả lời trôi chảy câu hỏi thi nói Bài 5 (có tranh và cá nhân) bằng câu đầy đủ ở đúng thì, đọc to đoạn văn đúng ngắt nghỉ, và viết được đoạn 3–5 câu kể việc đã làm, cảm tưởng, mong muốn và lý do.',
  minutes: 65,
  blocks: [
    NOTE('Cách học bài này', [
      'Câu hỏi Bài 5 hầu hết hỏi **việc đã làm** (quá khứ) hoặc **mong muốn** (たい／ほしい). Nhận ra thì ngay từ động từ cuối câu hỏi rồi trả lời **cùng thì**: 「しましたか」→「しました」; 「したいですか」→「したいです」.',
      'Mỗi bộ có **3 câu có tranh** (bạn nhìn tranh rồi trả lời) và **1 câu cá nhân**. Làm thật: che đáp án, bấm 🎤, nói, nghe lại, so với mẫu.',
      'Cô thích chuỗi hỏi liên hoàn 「何を？ → どこで？ → 誰と？ → それから？ → どうでしたか」. Mỗi câu trả lời thêm **một chi tiết** (nơi / người / cảm tưởng) là được thêm điểm trôi chảy.',
      'Lỗi hay mắc: trả lời bằng thể ます khi hỏi quá khứ; dùng を với 好き／ほしい; quên **に** sau V(ます) khi nói đi để làm gì; chia sai quá khứ tính từ (高いでした).',
    ]),
    TABLE(
      ['Bộ', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'Cuối tuần đã làm gì, ở đâu, với ai', 'V ました · で · と · それから'],
        ['2', 'Cảm tưởng', 'どうでしたか · かったです · でした'],
        ['3', 'Muốn có, muốn làm, thích', 'ほしい · たい · 好き'],
        ['4', 'Lý do, không đi đâu', 'どうして · から · どこへも'],
      ],
    ),

    H(`${LV.de} — Bộ 1: Cuối tuần đã làm gì`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Công viên, mấy người đang nướng thịt (Chủ nhật)', '{日曜日|にちようび}、 {公園|こうえん} で {何|なに} を しました か。'],
        ['2', 'Trung tâm thương mại, hai bạn xách túi quần áo', '{友達|ともだち} と どこ へ {行|い}きました か。'],
        ['3', 'Trong nhà, giỏ đồ giặt và chổi lau nhà', '{昨日|きのう}、 {家|いえ} で {何|なに} を しました か。'],
        ['Cá nhân', '—', '{先週|せんしゅう} の {週末|しゅうまつ} は どう でした か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 1', [
      DX('Giám thị', 'examiner', '{日曜日|にちようび}、 {公園|こうえん} で {何|なに} を しました か。', 'Chủ nhật bạn đã làm gì ở công viên?'),
      DX('Thí sinh', 'candidate', 'バーベキュー を しました。', 'Tôi đã nướng thịt ngoài trời.'),
      DX('Giám thị', 'examiner', '{友達|ともだち} と どこ へ {行|い}きました か。', 'Bạn đã đi đâu cùng bạn?'),
      DX('Thí sinh', 'candidate', 'デパート へ {行|い}きました。 {服|ふく} を {買|か}いました。', 'Tôi đã đến trung tâm thương mại. Tôi đã mua quần áo.'),
      DX('Giám thị', 'examiner', '{昨日|きのう}、 {家|いえ} で {何|なに} を しました か。', 'Hôm qua bạn đã làm gì ở nhà?'),
      DX('Thí sinh', 'candidate', '{洗濯|せんたく} を しました。 それから、 {掃除|そうじ} を しました。', 'Tôi đã giặt đồ. Sau đó dọn dẹp.'),
      DX('Giám thị', 'examiner', '{先週|せんしゅう} の {週末|しゅうまつ} は どう でした か。', 'Cuối tuần trước thế nào?'),
      DX('Thí sinh', 'candidate', '{忙|いそが}しかった です が、 {楽|たの}しかった です。', 'Bận nhưng vui.'),
    ]),
    SPEAK('lt-b5-nv-1', [
      'にちようび、こうえんで なにを しましたか。',
      'ともだちと どこへ いきましたか。',
      'きのう、いえで なにを しましたか。',
      'せんしゅうの しゅうまつは どうでしたか。',
    ]),

    H(`${LV.vua} — Bộ 2: Cảm tưởng`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Ngôi đền cổ ở Kyoto giữa cây xanh', '{京都|きょうと} は どう でした か。'],
        ['2', 'Học sinh nhăn mặt trước bài kiểm tra', 'テスト は どう でした か。'],
        ['3', 'Hai người cười khi xem phim', '{映画|えいが} は どう でした か。'],
        ['Cá nhân', '—', '{昨日|きのう} の {天気|てんき} は どう でした か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 2', [
      DX('Giám thị', 'examiner', '{京都|きょうと} は どう でした か。', 'Kyoto thế nào?'),
      DX('Thí sinh', 'candidate', '{景色|けしき} が きれい でした。 {古|ふる}い お{寺|てら} も ありました。', 'Phong cảnh đẹp. Cũng có chùa cổ.'),
      DX('Giám thị', 'examiner', 'テスト は どう でした か。', 'Bài kiểm tra thế nào?'),
      DX('Thí sinh', 'candidate', '{難|むずか}しかった です。', 'Khó.'),
      DX('Giám thị', 'examiner', '{映画|えいが} は どう でした か。', 'Phim thế nào?'),
      DX('Thí sinh', 'candidate', 'おもしろかった です。 とても {楽|たの}しかった です。', 'Hay. Rất vui.'),
      DX('Giám thị', 'examiner', '{昨日|きのう} の {天気|てんき} は どう でした か。', 'Thời tiết hôm qua thế nào?'),
      DX('Thí sinh', 'candidate', '{雨|あめ} でした。 {天気|てんき} は よくなかった です。', 'Trời mưa. Thời tiết không tốt.'),
    ]),
    SPEAK('lt-b5-nv-2', [
      'きょうとは どうでしたか。',
      'テストは どうでしたか。',
      'えいがは どうでしたか。',
      'きのうの てんきは どうでしたか。',
    ]),

    H(`${LV.vua} — Bộ 3: Muốn có, muốn làm, thích`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Chiếc xe đạp mới trong cửa hàng', '{何|なに} が ほしい です か。'],
        ['2', 'Ngọn núi và người leo núi', '{今度|こんど} の {休|やす}み に、 {何|なに} を したい です か。'],
        ['3', 'Suối nước nóng trong núi', 'どこ へ {何|なに} を し に {行|い}きたい です か。'],
        ['Cá nhân', '—', '{何|なに} が {好|す}き です か。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 3', [
      DX('Giám thị', 'examiner', '{何|なに} が ほしい です か。', 'Bạn muốn có gì?'),
      DX('Thí sinh', 'candidate', '{新|あたら}しい {自転車|じてんしゃ} が ほしい です。', 'Tôi muốn có xe đạp mới.'),
      DX('Giám thị', 'examiner', '{今度|こんど} の {休|やす}み に、 {何|なに} を したい です か。', 'Kỳ nghỉ tới bạn muốn làm gì?'),
      DX('Thí sinh', 'candidate', '{山|やま} に {登|のぼ}りたい です。', 'Tôi muốn leo núi.'),
      DX('Giám thị', 'examiner', 'どこ へ {何|なに} を し に {行|い}きたい です か。', 'Bạn muốn đi đâu để làm gì?'),
      DX('Thí sinh', 'candidate', '{温泉|おんせん} へ {行|い}きたい です。 {温泉|おんせん} に {入|はい}り に {行|い}きたい です。', 'Tôi muốn đi suối nước nóng. Muốn đi tắm suối nước nóng.'),
      DX('Giám thị', 'examiner', '{何|なに} が {好|す}き です か。', 'Bạn thích gì?'),
      DX('Thí sinh', 'candidate', 'サッカー が {好|す}き です。', 'Tôi thích bóng đá.'),
    ]),
    SPEAK('lt-b5-nv-3', [
      'なにが ほしいですか。',
      'こんどの やすみに、なにを したいですか。',
      'どこへ なにを しに いきたいですか。',
      'なにが すきですか。',
    ]),

    H(`${LV.kho} — Bộ 4: Lý do và không đi đâu`),
    TABLE(
      ['Tranh', 'Bạn nhìn thấy', 'Giám thị hỏi'],
      [
        ['1', 'Trời mưa, một người đứng ở cửa sổ trong nhà', 'どうして どこ へ も {行|い}きません でした か。'],
        ['2', 'Một chiếc áo có bảng giá rất cao', 'どうして {買|か}いません でした か。'],
        ['3', 'Một người nằm trên giường, đang bị cảm', '{昨日|きのう}、 どうして {学校|がっこう} を {休|やす}みました か。'],
        ['Cá nhân', '—', 'どうして {日本語|にほんご} を {勉強|べんきょう} しますか。'],
      ],
    ),
    DLG('Mẫu trả lời — Bộ 4', [
      DX('Giám thị', 'examiner', 'どうして どこ へ も {行|い}きません でした か。', 'Tại sao bạn không đi đâu cả?'),
      DX('Thí sinh', 'candidate', '{雨|あめ} でした から。', 'Vì trời mưa.'),
      DX('Giám thị', 'examiner', 'どうして {買|か}いません でした か。', 'Tại sao bạn không mua?'),
      DX('Thí sinh', 'candidate', '{高|たか}かった です から。', 'Vì đắt.'),
      DX('Giám thị', 'examiner', '{昨日|きのう}、 どうして {学校|がっこう} を {休|やす}みました か。', 'Hôm qua tại sao bạn nghỉ học?'),
      DX('Thí sinh', 'candidate', '{風邪|かぜ} でした から。', 'Vì tôi bị cảm.'),
      DX('Giám thị', 'examiner', 'どうして {日本語|にほんご} を {勉強|べんきょう} します か。', 'Tại sao bạn học tiếng Nhật?'),
      DX('Thí sinh', 'candidate', '{日本|にほん} へ {行|い}きたい です から。', 'Vì tôi muốn đi Nhật.'),
    ]),
    SPEAK('lt-b5-nv-4', [
      'どうして どこへも いきませんでしたか。',
      'どうして かいませんでしたか。',
      'きのう、どうして がっこうを やすみましたか。',
      'どうして にほんごを べんきょうしますか。',
    ]),

    H(`${LV.vua} — Chọn câu trả lời đạt điểm (10 câu)`),
    MC('lt-b5-nv-chon', 'Câu trả lời nào đạt điểm cao nhất?', [
      Q('Giám thị: 「{昨日|きのう}、{何|なに}を しましたか。」', '{洗濯|せんたく}を しました。', '{洗濯|せんたく}を します。 | {洗濯|せんたく}は しませんです。 | {洗濯|せんたく}が しました。', 'Hỏi quá khứ → trả lời ました.'),
      Q('Giám thị: 「{誰|だれ}と {行|い}きましたか。」 (một mình)', '{一人|ひとり}で{行|い}きました。', '{一人|ひとり}と{行|い}きました。 | {一人|ひとり}に{行|い}きました。 | {一人|ひとり}を{行|い}きました。', '一人で.'),
      Q('Giám thị: 「{映画|えいが}は どうでしたか。」 (hay)', 'おもしろかったです。', 'おもしろいでした。 | おもしろかったでしたです。 | おもしろいです。', 'Quá khứ tính từ い.'),
      Q('Giám thị: 「{何|なに}が ほしいですか。」', '{自転車|じてんしゃ}が ほしいです。', '{自転車|じてんしゃ}を ほしいです。 | {自転車|じてんしゃ}が ほしいくないです。 | {自転車|じてんしゃ}に ほしいです。', 'ほしい + が.'),
      Q('Giám thị: 「どこへ {行|い}きたいですか。」', '{京都|きょうと}へ {行|い}きたいです。', '{京都|きょうと}を {行|い}きたいです。 | {京都|きょうと}へ {行|い}くたいです。 | {京都|きょうと}で {行|い}きたいです。', '行きたい.'),
      Q('Giám thị: 「どうして {行|い}きませんでしたか。」', '{忙|いそが}しかったですから。', '{忙|いそが}しかったが。 | {行|い}きませんでしたから。 | {忙|いそが}しいでしたから。', 'Lý do + ですから.'),
      Q('Giám thị: 「どこか {行|い}きましたか。」 (không đi đâu)', 'いいえ、どこへも{行|い}きませんでした。', 'いいえ、どこへも{行|い}きました。 | いいえ、どこか{行|い}きません。 | いいえ、どこを{行|い}きませんでした。', 'どこへも + ませんでした.'),
      Q('Bạn chưa nghe rõ. Nên nói:', 'もう{一度|いちど}お{願|ねが}いします。', 'わかりません。 | …… (im lặng) | ごめんなさい。{帰|かえ}ります。', 'Xin giám thị nhắc lại.'),
      Q('Muốn kể hai việc liên tiếp, nên dùng:', 'Câu1。それから、Câu2。', 'Câu1。から、Câu2。 | Câu1。どうして、Câu2。 | Câu1。が、Câu2。', 'それから.'),
      Q('Bạn lỡ nói sai một chữ. Nên làm gì?', 'Sửa nhanh rồi nói tiếp', 'Im lặng mãi | Bỏ cuộc | Nói lại từ đầu bằng tiếng Việt', 'Nói trôi chảy được tính điểm.'),
    ]),

    H(`${LV.kho} — Đọc to (Reading) — 3 mã đề mới`),
    P('Đề Reading: bốc thăm mã, **chuẩn bị 20 giây**, rồi đọc to khoảng 150 chữ. Mỗi mã có **bản có furigana + romaji** (để học) và **bản không furigana** (để thi thử).'),
    H('Mã B-1 — {海|うみ}の{日曜日|にちようび}'),
    ...PSG('B-1 {海|うみ}の{日曜日|にちようび}', R5_A1),
    READK('lt-b5-nv-a1', 'B-1 — đọc không furigana', 'Chuẩn bị 20 giây, đọc một hơi. Chú ý 先週・日曜日・気持ち・食べました・楽しい.', [RKP(R5_A1)]),
    H('Mã B-2 — {今度|こんど}の{休|やす}み'),
    ...PSG('B-2 {今度|こんど}の{休|やす}み', R5_A2),
    READK('lt-b5-nv-a2', 'B-2 — đọc không furigana', 'Chú ý 登りたい・景色・温泉・入りたい・撮りたい.', [RKP(R5_A2)]),
    H('Mã B-3 — コーヒー'),
    ...PSG('B-3 コーヒー', R5_A3),
    READK('lt-b5-nv-a3', 'B-3 — đọc không furigana', 'Chú ý 毎朝・飲みます・甘い・苦い・好き.', [RKP(R5_A3)]),
    NOTE('Tiêu chí đọc to tự chấm', [
      'Đọc không dừng quá 2 giây giữa chừng.',
      'Kéo dài đúng chỗ **ー・おお・ゆう・きょう・せんしゅう**; ngắt rõ **っ**: おもしろかった, ほしい…',
      'Nghe lại thu âm: giọng xuống ở 「。」, lên nhẹ ở 「か」.',
    ]),

    H(`${LV.vua} — Viết đoạn 3–5 câu (có mẫu)`),
    P('Phần viết cuối kỳ có câu dịch Việt → Nhật; luyện viết đoạn ngắn giúp nhớ khung câu. **Viết trước, so mẫu sau.**'),
    NOTE('Đề viết 1 — Cuối tuần vừa rồi (4–5 câu)', [
      'Gợi ý ý: đi đâu · với ai · làm gì · cảm tưởng.',
    ]),
    EXS([
      E('{先週|せんしゅう} の {日曜日|にちようび}、 {友達|ともだち} と {公園|こうえん} へ {行|い}きました。', 'Chủ nhật tuần trước tôi đã đi công viên cùng bạn.'),
      E('バーベキュー を しました。', 'Chúng tôi đã nướng thịt ngoài trời.'),
      E('それから、 {写真|しゃしん} を {撮|と}りました。', 'Sau đó tôi chụp ảnh.'),
      E('とても {楽|たの}しかった です。', 'Rất vui.'),
    ]),
    NOTE('Đề viết 2 — Kỳ nghỉ tới (4 câu)', [
      'Gợi ý ý: muốn đi đâu · làm gì · với ai · vì sao.',
    ]),
    EXS([
      E('{今度|こんど} の {休|やす}み に、 {京都|きょうと} へ {行|い}きたい です。', 'Kỳ nghỉ tới tôi muốn đi Kyoto.'),
      E('{古|ふる}い お{寺|てら} を {見|み}たい です。', 'Tôi muốn xem chùa cổ.'),
      E('{家族|かぞく} と {行|い}きます。', 'Tôi đi cùng gia đình.'),
      E('{京都|きょうと} が {好|す}き です から。', 'Vì tôi thích Kyoto.'),
    ]),
    NOTE('Đề viết 3 — Lý do (3 câu)', [
      'Gợi ý ý: việc không làm · lý do · việc đã làm thay.',
    ]),
    EXS([
      E('{昨日|きのう} は どこ へ も {行|い}きません でした。', 'Hôm qua tôi đã không đi đâu cả.'),
      E('{雨|あめ} でした から。', 'Vì trời mưa.'),
      E('{家|いえ} で {洗濯|せんたく} を しました。', 'Tôi đã giặt đồ ở nhà.'),
    ]),
    QZ('lt-b5-nv-viet', 'Dịch câu viết (gõ bằng chữ Hán hoặc hiragana)', 'translate', [
      A('Chủ nhật tuần trước tôi đã đi công viên cùng bạn.', ['{先週|せんしゅう}の{日曜日|にちようび}、{友達|ともだち}と{公園|こうえん}へ{行|い}きました。', '{先週|せんしゅう}の{日曜日|にちようび}に、{友達|ともだち}と{公園|こうえん}へ{行|い}きました。']),
      A('Chúng tôi đã nướng thịt ngoài trời. Sau đó tôi chụp ảnh.', ['バーベキューをしました。それから、{写真|しゃしん}を{撮|と}りました。', 'バーベキューをしました。それから{写真|しゃしん}を{撮|と}りました。']),
      A('Kỳ nghỉ tới tôi muốn đi Kyoto.', ['{今度|こんど}の{休|やす}みに、{京都|きょうと}へ{行|い}きたいです。', '{今度|こんど}の{休|やす}みに{京都|きょうと}へ{行|い}きたいです。']),
      A('Tôi muốn xem chùa cổ.', ['{古|ふる}いお{寺|てら}を{見|み}たいです。', '{古|ふる}いお{寺|てら}が{見|み}たいです。']),
      A('Hôm qua trời mưa nên tôi không đi đâu cả.', ['{昨日|きのう}は{雨|あめ}でしたから、どこへも{行|い}きませんでした。', '{雨|あめ}でしたから、{昨日|きのう}はどこへも{行|い}きませんでした。']),
      A('Tôi đã giặt đồ ở nhà.', ['{家|いえ}で{洗濯|せんたく}をしました。', '{家|いえ}で{洗濯|せんたく}しました。']),
    ], 'Dùng đủ: ました／ませんでした · たい · から · それから'),
    MC('lt-b5-nv-sua', 'Chọn bài viết đúng nhất (5 câu)', [
      Q('Bài viết nào ĐÚNG?', '{昨日|きのう}、{友達|ともだち}に{会|あ}いました。', '{昨日|きのう}、{友達|ともだち}を{会|あ}いました。 | {昨日|きのう}、{友達|ともだち}で{会|あ}いました。 | {昨日|きのう}、{友達|ともだち}が{会|あ}いました。', '会う đi với に.'),
      Q('Bài viết nào ĐÚNG?', '{映画|えいが}は おもしろかったです。', '{映画|えいが}は おもしろいでした。 | {映画|えいが}は おもしろかったでした。 | {映画|えいが}は おもしろくでした。', 'Quá khứ tính từ い.'),
      Q('Bài viết nào ĐÚNG?', 'コーヒーが {好|す}きです。', 'コーヒーを {好|す}きです。 | コーヒーに {好|す}きです。 | コーヒーで {好|す}きです。', '好き + が.'),
      Q('Bài viết nào ĐÚNG?', 'デパートへ {服|ふく}を {買|か}いに {行|い}きます。', 'デパートへ {服|ふく}を {買|か}うに {行|い}きます。 | デパートへ {服|ふく}を {買|か}いを {行|い}きます。 | デパートを {服|ふく}で {買|か}いに {行|い}きます。', 'V bỏ ます + に.'),
      Q('Bài viết nào ĐÚNG? (nghĩa: vì trời mưa nên tôi không đi)', '{雨|あめ}でしたから、{行|い}きませんでした。', '{行|い}きませんでしたから、{雨|あめ}でした。 | {雨|あめ}でしたが、{行|い}きませんでした。 | {雨|あめ}でした、から {行|い}きませんでした。', 'Lý do + から、kết quả.'),
    ]),
  ],
};

/* ───────── 12. ĐỀ TỔNG HỢP ───────── */

const R5_DE: [string, string][] = [
  ['ワン-さん は {先週|せんしゅう} の {土曜日|どようび}、 {友達|ともだち} と {京都|きょうと} へ {行|い}きました。', 'Chị Vương đã đi Kyoto cùng bạn vào thứ bảy tuần trước.'],
  ['{新幹線|しんかんせん} で {二時間半|にじかんはん} でした。', 'Đi Shinkansen mất hai tiếng rưỡi.'],
  ['{古|ふる}い お{寺|てら} を {見|み}ました。 とても きれい でした。', 'Chị đã xem những ngôi chùa cổ. Rất đẹp.'],
  ['それから、 {京都|きょうと} の {料理|りょうり} を {食|た}べました。', 'Sau đó chị ăn món ăn Kyoto.'],
  ['おいしかった です が、 {高|たか}かった です。', 'Ngon nhưng đắt.'],
  ['{日曜日|にちようび} は どこ へ も {行|い}きません でした。 {家|いえ} で {洗濯|せんたく} を しました。', 'Chủ nhật chị không đi đâu cả. Chị giặt đồ ở nhà.'],
];

const B5_DE: Lesson = {
  id: 'lt-b5-de-tong-hop',
  kind: 'review',
  title: 'Luyện thêm Bài 5 — Đề tổng hợp (60 phút, 100 điểm): từ vựng · chữ Hán · ngữ pháp · nghe · đọc hiểu · dịch',
  goal: 'Làm một đề đủ phần theo form kiểm tra giữa kỳ / cuối kỳ của cô, bấm giờ, tự chấm bằng thang điểm và biết phần nào cần luyện lại.',
  minutes: 60,
  blocks: [
    RECAP('Đọc trước khi làm đề', [
      '**Thời gian: 60 phút.** Bấm giờ thật. Không xem lại bài học, không mở đáp án cho đến khi làm xong cả đề.',
      'Làm theo thứ tự; câu nào bí quá 1 phút thì đánh dấu, làm tiếp, quay lại sau.',
      'Cuối đề có **bảng thang điểm tự chấm** và hướng dẫn luyện lại theo phần yếu.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Số câu', 'Điểm/câu', 'Tối đa'],
      [
        ['A', 'Từ vựng', '10', '1', '10'],
        ['B', 'Chữ Hán (đọc + chọn chữ)', '10', '1,5', '15'],
        ['C', 'Điền trợ từ (có X)', '8', '1', '8'],
        ['D', 'Từ để hỏi', '6', '1', '6'],
        ['E', 'Chọn đáp án đúng', '10', '1', '10'],
        ['F', 'Chia từ (gõ tay)', '4', '2', '8'],
        ['G', 'Nghe (2 đoạn)', '5', '2', '10'],
        ['H', 'Đọc hiểu', '6', '1,5', '9'],
        ['I', 'Dịch Việt → Nhật (gõ tay)', '4', '3', '12'],
        ['J', 'Dịch Nhật → Việt', '4', '3', '12'],
        ['', '**Tổng**', '67', '', '**100**'],
      ],
      'Cấu trúc đề tổng hợp Bài 5',
    ),

    H('Phần A — Từ vựng (10 câu × 1 điểm)'),
    MC('lt-b5-de-a', 'A. Từ vựng', [
      Q('「{恋人|こいびと}」の{意味|いみ}は？', 'Người yêu', 'Bạn cùng phòng | Gia đình | Đồng nghiệp', '恋人 = こいびと.'),
      Q('「アニメ」の{意味|いみ}は？', 'Phim hoạt hình', 'Trò chơi | Tranh | Phong cảnh', 'アニメ = anime.'),
      Q('「{晩|ばん}ご{飯|はん}」の{意味|いみ}は？', 'Cơm tối', 'Cơm sáng | Cơm trưa | Đồ ăn vặt', '晩ご飯 = bữa tối.'),
      Q('{違|ちが}う{種類|しゅるい}の{言葉|ことば}は？ {去年|きょねん} / {来年|らいねん} / {今晩|こんばん} / {家|いえ}', '{家|いえ}', '{去年|きょねん} | {来年|らいねん} | {今晩|こんばん}', '3 từ kia chỉ thời gian; 家 là nơi chốn.'),
      Q('「{高|たか}い」(đắt)の{反対|はんたい}は？', '{安|やす}い', '{低|ひく}い | {小|ちい}さい | {古|ふる}い', 'Đắt ↔ rẻ.'),
      Q('「{簡単|かんたん}」の{反対|はんたい}は？', '{難|むずか}しい', '{忙|いそが}しい | {暇|ひま} | {楽|たの}しい', 'Dễ ↔ khó.'),
      Q('{温泉|おんせん}に＿＿＿ます。 (vào)', '{入|はい}り', '{登|のぼ}り | {撮|と}り | {借|か}り', '温泉に入ります.'),
      Q('「おととい」の{意味|いみ}は？', 'Hôm kia', 'Hôm qua | Ngày kia | Hôm nay', 'おととい = 2 ngày trước.'),
      Q('「ルームメイト」の{意味|いみ}は？', 'Bạn cùng phòng', 'Người yêu | Gia đình | Bạn cùng lớp', 'roommate.'),
      Q('{友達|ともだち}に ペンを＿＿＿ます。 (mượn)', '{借|か}り', '{作|つく}り | {会|あ}い | {撮|と}り', '借ります.'),
    ]),

    H('Phần B — Chữ Hán (10 câu × 1,5 điểm)'),
    MC('lt-b5-de-b', 'B. Chữ Hán: 5 câu đọc + 5 câu chọn chữ', [
      Q('「先日」の読み方は？', 'せんじつ', 'せんにち | さきひ | せんび', '先日 = せんじつ.'),
      Q('「午前」の読み方は？', 'ごぜん', 'ごまえ | うまえ | ごせん', '午前 = ごぜん.'),
      Q('「買い物」の読み方は？', 'かいもの', 'ばいぶつ | かいぶつ | かいもつ', '買い物.'),
      Q('「食べ物」の読み方は？', 'たべもの', 'しょくぶつ | たべぶつ | くいもの', '食べ物.'),
      Q('「休日」の読み方は？', 'きゅうじつ', 'やすみひ | きゅうにち | ひろび', '休日.'),
      Q('「せんせい」を漢字で かくと？', '先生', '洗生 | 光生 | 失生', '先生.'),
      Q('「まいしゅう」を漢字で かくと？', '毎週', '母週 | 梅週 | 毎周', '毎週.'),
      Q('「けんがく」を漢字で かくと？', '見学', '貝学 | 目学 | 具学', '見学.'),
      Q('「のみもの」を漢字で かくと？', '飲み物', '飯み物 | 食み物 | 飲み牧', '飲み物.'),
      Q('「うしろ」を漢字で かくと？', '後ろ', '役ろ | 復ろ | 従ろ', '後ろ.'),
    ]),

    H('Phần C — Điền trợ từ (8 câu × 1 điểm; X = không cần)'),
    MC('lt-b5-de-c', 'C. Trợ từ', [
      Q('{昨日|きのう}、{友達|ともだち}＿＿ {会|あ}いました。', 'に', 'で | を | が', '会います + に.'),
      Q('デパート＿＿ {服|ふく}＿＿ {買|か}いました。', 'で / を', 'を / で | に / を | で / が', 'Nơi làm: で; tân ngữ: を.'),
      Q('{私|わたし}は サッカー＿＿ {好|す}きです。', 'が', 'を | に | で', '好き + が.'),
      Q('{新|あたら}しい{服|ふく}＿＿ ほしいです。', 'が', 'を | に | で', 'ほしい + が.'),
      Q('{京都|きょうと}＿＿ {旅行|りょこう}＿＿ {行|い}きます。', 'へ / に', 'を / に | で / に | に / を', 'へ + に.'),
      Q('{一人|ひとり}＿＿ {行|い}きました。', 'で', 'と | に | を', '一人で.'),
      Q('{先週|せんしゅう}＿＿、{友達|ともだち}に{会|あ}いました。', 'X', 'を | が | と', 'Thời gian + 、 không trợ từ.'),
      Q('どこ＿＿も {行|い}きませんでした。', 'へ', 'を | が | で', 'どこへも + phủ định.'),
    ]),

    H('Phần D — Từ để hỏi (6 câu × 1 điểm)'),
    MC('lt-b5-de-d', 'D. Chọn từ để hỏi', [
      Q('A：＿＿＿ と {映画|えいが}を{見|み}ましたか。 B：{友達|ともだち}と{見|み}ました。', '{誰|だれ}', '{何|なに} | どこ | どう', 'Người → 誰と.'),
      Q('A：＿＿＿ へ {行|い}きましたか。 B：{公園|こうえん}へ{行|い}きました。', 'どこ', '{何|なに} | {誰|だれ} | どう', 'Nơi → どこへ.'),
      Q('A：{旅行|りょこう}は＿＿＿でしたか。 B：{楽|たの}しかったです。', 'どう', 'どこ | {誰|だれ} | {何|なに}', 'Cảm nhận → どう.'),
      Q('A：＿＿＿ {買|か}いませんでしたか。 B：{高|たか}かったですから。', 'どうして', 'どう | どこ | {何|なに}', 'Lý do → どうして.'),
      Q('A：{何|なに}＿＿＿ ほしいですか。 B：{自転車|じてんしゃ}が ほしいです。', 'が', 'を | に | で', '何が ほしい.'),
      Q('A：{昨日|きのう}、＿＿＿ を しましたか。 B：{掃除|そうじ}を しました。', '{何|なに}', '{誰|だれ} | どこ | どう', '何を.'),
    ]),

    H('Phần E — Chọn đáp án đúng (10 câu × 1 điểm)'),
    MC('lt-b5-de-e', 'E. Ngữ pháp và từ vựng', [
      Q('{昨日|きのう}の{天気|てんき}は＿＿＿。', 'よかったです', 'いかったです | いいでした | よいでした', 'いい → よかった.'),
      Q('テストは＿＿＿。 (không khó)', '{難|むずか}しくなかったです', '{難|むずか}しいじゃありませんでした | {難|むずか}しくないでした | {難|むずか}しかったじゃありません', 'い → くなかったです.'),
      Q('{日本|にほん}へ＿＿＿。 (muốn đi)', '{行|い}きたいです', '{行|い}くたいです | {行|い}きますたいです | {行|い}たいです', 'V ます bỏ ます + たい.'),
      Q('デパートへ {服|ふく}を＿＿＿に{行|い}きます。', '{買|か}い', '{買|か}う | {買|か}います | {買|か}って', 'V bỏ ます + に.'),
      Q('{雨|あめ}でした＿＿＿、どこへも{行|い}きませんでした。', 'から', 'が | を | に', 'Lý do + から.'),
      Q('{朝|あさ}、{掃除|そうじ}しました。＿＿＿、{洗濯|せんたく}しました。', 'それから', 'どうして | から | が', 'Thứ tự → それから.'),
      Q('{旅行|りょこう}は たいへん＿＿＿。', 'でした', 'かったです | いでした | でしたです', 'Tính từ な quá khứ.'),
      Q('{友達|ともだち}＿＿＿ {食事|しょくじ}しました。 (cùng bạn)', 'と', 'に | で | が', 'と = cùng.'),
      Q('{私|わたし}は コーヒー＿＿＿ あまり{好|す}きじゃありません。', 'は', 'を | に | で', 'Phủ định, đối chiếu → は.'),
      Q('{昨日|きのう}は どこへも＿＿＿。', '{行|い}きませんでした', '{行|い}きません | {行|い}きたいです | {行|い}きます', 'Quá khứ phủ định.'),
    ]),

    H('Phần F — Chia từ trong ngoặc (4 câu × 2 điểm, gõ tay)'),
    QZ('lt-b5-de-f', 'F. Điền dạng đúng', 'fill', [
      A('{昨日|きのう}は（{雨|あめ}です）。', '{雨|あめ}でした'),
      A('テストは（{難|むずか}しいです）。', '{難|むずか}しかったです'),
      A('{日本|にほん}へ（{行|い}きます）。 (muốn)', '{行|い}きたいです'),
      A('コーヒーが（{好|す}きです）。 (あまり + phủ định)', ['あまり{好|す}きじゃありません', 'あまり{好|す}きではありません']),
    ]),

    H('Phần G — Nghe (5 câu × 2 điểm)'),
    P('Nghe mỗi đoạn **hai lần**, rồi trả lời.'),
    LS('lt-b5-de-g1', 'Đoạn 1 — Bảo tàng mỹ thuật', [
      L('パク', 'f', '^マルコ-さん、 {昨日|きのう}、 {何|なに} を しました か。', 'Marco, hôm qua anh đã làm gì?'),
      L('マルコ', 'm', '{友達|ともだち} と {美術館|びじゅつかん} へ {絵|え} を {見|み} に {行|い}きました。', 'Tôi đã đến bảo tàng mỹ thuật cùng bạn để xem tranh.'),
      L('パク', 'f', 'どう でした か。', 'Thế nào?'),
      L('マルコ', 'm', '{絵|え} が たくさん ありました。 おもしろかった です。', 'Có rất nhiều tranh. Hay lắm.'),
    ]),
    LS('lt-b5-de-g2', 'Đoạn 2 — Kỳ nghỉ tới (bẫy: đổi ý)', [
      L('リン', 'f', '{今度|こんど} の {休|やす}み に、 どこ へ {行|い}きたい です か。', 'Kỳ nghỉ tới anh muốn đi đâu?'),
      L('ダニエル', 'm', '{京都|きょうと} へ ……あ、 いいえ、 {箱根|はこね} へ {行|い}きたい です。 {温泉|おんせん} に {入|はい}りたい です から。', 'Tôi muốn đi Kyoto… à không, Hakone. Vì tôi muốn tắm suối nước nóng.'),
      L('リン', 'f', '{私|わたし} も {行|い}きたい です。', 'Tôi cũng muốn đi.'),
    ]),
    MC('lt-b5-de-g', 'G. Câu hỏi nghe', [
      Q('マルコさんは {昨日|きのう}、どこへ {行|い}きましたか。', '{美術館|びじゅつかん}', 'デパート | {公園|こうえん} | {海|うみ}', '美術館へ.'),
      Q('{誰|だれ}と {行|い}きましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '友達と.'),
      Q('{美術館|びじゅつかん}は どうでしたか。', 'おもしろかったです', 'おもしろくなかったです | {高|たか}かったです | {難|むずか}しかったです', 'おもしろかったです.'),
      Q('ダニエルさんが {最後|さいご}に {行|い}きたいと{言|い}った{場所|ばしょ}は？', '{箱根|はこね}', '{京都|きょうと} | {東京|とうきょう} | {沖縄|おきなわ}', '京都 → sửa thành 箱根.'),
      Q('ダニエルさんは どうして {箱根|はこね}へ {行|い}きたいですか。', 'Vì muốn tắm suối nước nóng', 'Vì muốn xem chùa cổ | Vì muốn leo núi | Vì bạn sống ở đó', '温泉に入りたいですから.'),
    ]),

    H('Phần H — Đọc hiểu (6 câu × 1,5 điểm)'),
    ...PSG('ワンさんの{週末|しゅうまつ}', R5_DE),
    MC('lt-b5-de-h', 'H. Câu hỏi đọc hiểu', [
      Q('ワンさんは {誰|だれ}と {京都|きょうと}へ {行|い}きましたか。', '{友達|ともだち}', '{家族|かぞく} | {恋人|こいびと} | {一人|ひとり}', '友達と.'),
      Q('{京都|きょうと}まで {何|なん}で {行|い}きましたか。', '{新幹線|しんかんせん}', 'バス | {電車|でんしゃ} | {飛行機|ひこうき}', '新幹線で二時間半.'),
      Q('{京都|きょうと}で {何|なに}を {見|み}ましたか。', '{古|ふる}いお{寺|てら}', '{美術館|びじゅつかん} | {温泉|おんせん} | {山|やま}', '古いお寺を見ました.'),
      Q('{料理|りょうり}は どうでしたか。', 'おいしかったですが、{高|たか}かったです', 'おいしくなかったです | {安|やす}かったです | {辛|から}かったです', 'おいしかったですが、高かったです.'),
      Q('{日曜日|にちようび}、ワンさんは？', 'Giặt đồ ở nhà', 'Đi Kyoto | Dùng bữa cùng bạn | Đi mua sắm', '日曜日はどこへも行きませんでした。家で洗濯.'),
      TF('ワンさんは {日曜日|にちようび}に {京都|きょうと}へ {行|い}きました。', 'Sai', '京都は土曜日.'),
    ]),

    H('Phần I — Dịch Việt → Nhật (4 câu × 3 điểm, gõ tay)'),
    QZ('lt-b5-de-i', 'I. Dịch sang tiếng Nhật', 'translate', [
      A('Hôm qua tôi đã đi bảo tàng mỹ thuật cùng bạn.', ['{昨日|きのう}、{友達|ともだち}と{美術館|びじゅつかん}へ{行|い}きました。', '{友達|ともだち}と{昨日|きのう}、{美術館|びじゅつかん}へ{行|い}きました。']),
      A('Bộ phim đã hay nhưng hơi dài.', ['{映画|えいが}はおもしろかったですが、{少|すこ}し{長|なが}かったです。', '{映画|えいが}はおもしろかったですが、{少|すこ}し{高|たか}かったです。']),
      A('Kỳ nghỉ tới tôi muốn tắm suối nước nóng.', ['{今度|こんど}の{休|やす}みに、{温泉|おんせん}に{入|はい}りたいです。', '{今度|こんど}の{休|やす}みに{温泉|おんせん}に{入|はい}りたいです。']),
      A('Vì trời mưa nên tôi không đi đâu cả.', ['{雨|あめ}でしたから、どこへも{行|い}きませんでした。', '{雨|あめ}でしたから、どこも{行|い}きませんでした。']),
    ]),

    H('Phần J — Dịch Nhật → Việt (4 câu × 3 điểm)'),
    MC('lt-b5-de-j', 'J. Chọn bản dịch đúng', [
      Q('{先週|せんしゅう}の{日曜日|にちようび}、{友達|ともだち}と{海|うみ}へ{行|い}きました。', 'Chủ nhật tuần trước tôi đã ra biển cùng bạn.', 'Chủ nhật tuần sau tôi sẽ ra biển một mình. | Hôm qua bạn tôi đã ra biển. | Chủ nhật tôi ở nhà.', '先週 + 友達と + 海へ.'),
      Q('{新|あたら}しい{自転車|じてんしゃ}が ほしいですが、{高|たか}いです。', 'Tôi muốn có xe đạp mới nhưng đắt.', 'Tôi không muốn xe đạp mới vì đắt. | Xe đạp mới rẻ nên tôi muốn. | Tôi có xe đạp mới.', 'ほしい + が + 高い.'),
      Q('{風邪|かぜ}でしたから、{昨日|きのう}は {学校|がっこう}を {休|やす}みました。', 'Vì bị cảm nên hôm qua tôi đã nghỉ học.', 'Hôm qua nghỉ học nên tôi bị cảm. | Bị cảm nhưng tôi đã đi học. | Ngày mai tôi sẽ nghỉ học.', '風邪でしたから.'),
      Q('{朝|あさ}、{洗濯|せんたく}を しました。それから、{掃除|そうじ}を しました。', 'Sáng tôi giặt đồ. Sau đó tôi dọn dẹp.', 'Sáng tôi dọn dẹp. Sau đó giặt đồ. | Sáng tôi giặt đồ vì dọn dẹp. | Sáng tôi muốn giặt đồ và dọn dẹp.', 'Thứ tự: 洗濯 → 掃除.'),
    ]),

    H('Bảng chấm điểm tự đánh giá'),
    TABLE(
      ['Phần', 'Số câu đúng', '× điểm/câu', 'Điểm của bạn'],
      [
        ['A. Từ vựng', '___ / 10', '× 1', '___'],
        ['B. Chữ Hán', '___ / 10', '× 1,5', '___'],
        ['C. Trợ từ', '___ / 8', '× 1', '___'],
        ['D. Từ để hỏi', '___ / 6', '× 1', '___'],
        ['E. Chọn đáp án', '___ / 10', '× 1', '___'],
        ['F. Chia từ', '___ / 4', '× 2', '___'],
        ['G. Nghe', '___ / 5', '× 2', '___'],
        ['H. Đọc hiểu', '___ / 6', '× 1,5', '___'],
        ['I. Dịch V→N', '___ / 4', '× 3', '___'],
        ['J. Dịch N→V', '___ / 4', '× 3', '___'],
        ['', '', '**Tổng**', '___ / 100'],
      ],
    ),
    TABLE(
      ['Tổng điểm', 'Đánh giá', 'Việc cần làm'],
      [
        ['90–100', 'Xuất sắc', 'Chỉ ôn lại câu sai; chuyển sang luyện nói/nghe.'],
        ['80–89', 'Tốt', 'Ôn phần dưới 80% của chính bạn.'],
        ['70–79', 'Đạt', 'Làm lại các lesson ngữ pháp 1–4 mức Vừa.'],
        ['60–69', 'Cần ôn', 'Làm lại từ vựng + chữ Hán mức Dễ–Vừa, làm lại đề này sau 2 ngày.'],
        ['Dưới 60', 'Chưa đạt', 'Bắt đầu lại từ lộ trình ngày 1; làm chậm, đừng bỏ qua mức Dễ.'],
      ],
    ),
    NOTE('Cách luyện lại theo phần yếu', [
      'Từ vựng (A) hay sai → `lt-b5-tu-vung` mức Vừa–Khó (động từ + trợ từ, thứ tự thời gian).',
      'Chữ Hán (B) hay sai → `lt-b5-chu-han` mức Vừa; nhìn BỘ chữ để loại đáp án nhiễu.',
      'Trợ từ (C) & Từ hỏi (D) hay sai → `lt-b5-ngu-phap-tron` phần A–B.',
      'Quá khứ (E, F) hay sai → `lt-b5-ngu-phap-1` mức Vừa (bảng 5 dòng).',
      'Nghe (G) hay sai → `lt-b5-nghe` đoạn 4, 7, 8 (bẫy sửa lời).',
      'Dịch (I, J) hay sai → `lt-b5-ngu-phap-tron` phần F–G và `lt-b5-noi-viet` phần viết.',
    ]),
  ],
};

/* ═══════════════════ XUẤT ═══════════════════ */

export const LUYEN_THEM_B4: Lesson[] = [B4_LO_TRINH,B4_TU_VUNG,B4_CHU_HAN,B4_NP1,B4_NP2,B4_NP3,B4_TRON,B4_HOI_THOAI,B4_DOC_HIEU,B4_NGHE,B4_NOI_VIET,B4_DE];
export const LUYEN_THEM_B5: Lesson[] = [B5_LO_TRINH,B5_TU_VUNG,B5_CHU_HAN,B5_NP1,B5_NP2,B5_NP3,B5_NP4,B5_TRON,B5_HOI_THOAI,B5_DOC_HIEU,B5_NGHE,B5_NOI_VIET,B5_DE];
