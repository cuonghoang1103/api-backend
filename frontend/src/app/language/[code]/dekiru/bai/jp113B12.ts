/**
 * JPD113 — BÀI 1 và BÀI 2 (できる日本語 初級): "Buổi học theo khung lớp" + bộ "Luyện thêm" Dễ → Vừa → Khó.
 *
 * ⚠ TRUNG THỰC: bài do MÌNH SOẠN theo trình tự sách + khung buổi học của JPD123 Bài 4–7 — KHÔNG phải slide thật của cô
 * JPD113 (người học không có slide của cô). Từ vựng = danh sách "Từ mới bài 1/2" của cô; chữ Hán = hanLop.ts (dự kiến);
 * khuôn đề nói/đọc to bám file "Luyện nói" của cô Huyền (JPD113). Mọi câu, hội thoại, đoạn đọc, kịch bản nghe đều VIẾT MỚI.
 *
 * Xuất: JP113_B1 · JP113_B2 (buổi học `s113-bN-NN-…`) · LT_B1 · LT_B2 (luyện thêm `lt-bN-…`).
 *
 * Cách soạn: câu tiếng Nhật viết bằng "DSL từ" — các từ cách nhau bằng dấu cách, chữ Hán luôn {漢字|かな},
 * `^` đầu từ = viết hoa romaji (tên riêng), `-` trong từ = gạch nối romaji. `J()` bỏ dấu cách → chữ Nhật;
 * `R()` sinh romaji tự động từ kana (は→wa, へ→e, を→o) — nên romaji LUÔN khớp chữ kana ở cạnh nó.
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

/* ══════════════ phụ trợ riêng cho buổi học ══════════════ */

/** Từ vựng: w/ex viết bằng DSL; ipa = romaji của từ, exRo = romaji của câu ví dụ (tự sinh). */
const VO = (w: string, pos: string, vi: string, ex: string, exVi: string, more?: string) => ({
  w: J(w),
  pos,
  ipa: toks(w).map((t) => tok(t)[1]).join(' '),
  vi,
  ex: J(ex),
  exRo: R(ex),
  exVi,
  ...(more ? { more } : {}),
});
const VOC = (items: ReturnType<typeof VO>[]): Block => ({ t: 'vocab', items });
/** "chữ Nhật (*romaji*)" dùng trong ô bảng. */
const JR = (s: string): string => `${J(s)} (*${R(s)}*)`;
const SH = ['Phần (theo khung lớp)', 'Giải thích bằng chữ'];
const SLD = (caption: string, rows: string[][]): Block => ({ t: 'table', caption, head: SH, rows });
const ASK = (items: string[]): Block => ({ t: 'note', title: '🎤 Cô thường hỏi gì khi gọi phát biểu', items });
const HOC = (items: string[]): Block => ({ t: 'note', title: 'Học thế nào', items });
const PAT = (rows: { formula: string; vi: string; examples: Ex[] }[]): Block => ({ t: 'patterns', rows });
const RULE = (formula: string, vi?: string): Block => ({ t: 'rule', formula, vi });
const HONEST =
  'Bài này **do mình soạn** theo trình tự sách + khung buổi học JPD123, **không phải slide thật của cô JPD113**. Từ mới là danh sách của cô; câu ví dụ, hội thoại, bài tập là viết mới.';

/** Đáp án gõ câu: thêm biến thể có 。 */
const AS = (q: string, ans: string | string[], hint?: string) => {
  const base = V(...(Array.isArray(ans) ? ans : [ans]));
  const fw = (x: string) => x.replace(/[0-9]/g, (d) => String.fromCharCode(d.charCodeAt(0) + 0xfee0));
  const more = base.flatMap((x) => [x, x.replace(/,/g, ''), fw(x.replace(/,/g, ''))]);
  return { q, answers: [...new Set([...more, ...more.map((x) => x + '。')])], hint };
};

/* ═══════════════════════════════════════════════════════════════════
 *                BÀI 1 — BUỔI HỌC THEO KHUNG LỚP
 * ═══════════════════════════════════════════════════════════════════ */

const S1_00: Lesson = {
  id: 's113-b1-00-doc-truoc',
  kind: 'intro',
  title: 'Bài 1 はじめまして — Đọc trước: bài này soạn theo khung lớp (không phải slide thật của cô) + lộ trình 6 buổi',
  goal: 'Biết Bài 1 gồm những buổi nào, mỗi buổi học gì, làm gì để cuối bài tự giới thiệu được 30 giây không nhìn giấy.',
  minutes: 15,
  blocks: [
    HOC([
      'Mỗi buổi đọc theo thứ tự: **Tóm tắt buổi → bảng từng phần có giải thích → từ mới → ngữ pháp + ví dụ → hội thoại → lỗi hay mắc → bài luyện**. Đọc to mọi câu tiếng Nhật, đừng chỉ nhìn.',
      'Mỗi câu đều có **romaji** ngay dưới (hoặc trong ngoặc). Chưa quen chữ thì cứ đọc romaji trước, rồi nhìn chữ, rồi che romaji lại.',
      'Làm bài luyện **trước** khi mở đáp án. Sai câu nào thì đọc phần "vì sao" rồi làm lại đúng câu đó.',
      'Sau 6 buổi, sang bộ **Luyện thêm Bài 1** (id `lt-b1-…`): đi từ 🟢 Dễ → 🟡 Vừa → 🔴 Khó, đủ 8 kỹ năng.',
    ]),
    NOTE('Trung thực về nguồn của bài này', [
      HONEST,
      'Phần **từ mới** đúng danh sách "Từ mới bài 1" cô phát (52 mục). Phần **câu hỏi thi nói** bám khuôn file "Luyện nói" của cô Huyền (10 câu không tranh + thẻ nhân vật có tranh).',
      'Chữ Hán của lớp Bài 1 là **danh sách dự kiến** (xem bài `b1-han-lop`): 日 本 人 学 生 語 何 私 英 員. Khi có chữ Hán thật cô dạy, sẽ sửa lại cho khớp.',
    ]),
    RECAP('Bài 1 dạy gì? — mục tiêu hành động của cả bài', [
      'Chào lần đầu gặp, nói **tên – nước – nghề – tuổi – ngày sinh – sở thích** của mình, và **hỏi lại** người đối diện đúng những điều đó.',
      'Sáu điểm ngữ pháp (ポイント 1–6): **N1 は N2 です** · **ですか／はい・いいえ／じゃありません** · **どちら・いつ・何** · **N1 の N2** · **N1 と N2** · **N も**.',
      'Cuối bài bạn nói trơn một đoạn tự giới thiệu 6–7 câu (mẫu ở buổi 6) — đây cũng chính là bài **Reading đọc to** và phần **nói** của kỳ thi.',
    ]),
    H('Lộ trình 6 buổi'),
    TABLE(
      ['Buổi', 'Lesson', 'Học gì', 'Ngữ pháp'],
      [
        ['1', '`s113-b1-01-…`', 'Chào lần đầu, nói tên, gọi người lạ, đáp はい／いいえ', 'ポイント 1'],
        ['2', '`s113-b1-02-…`', 'Tên nước, 〜人, hỏi quê, trả lời "không phải"', 'ポイント 2, 3 (どちら)'],
        ['3', '`s113-b1-03-…`', 'Trường học và nghề nghiệp (学生/先生/教師/会社員/社員)', 'ポイント 3 (何), 4 (の)'],
        ['4', '`s113-b1-04-…`', 'Tuổi, tháng, ngày, sinh nhật', 'ポイント 3 (いつ)'],
        ['5', '`s113-b1-05-…`', 'Sở thích, "tôi cũng vậy"', 'ポイント 5 (と), 6 (も)'],
        ['6', '`s113-b1-06-…`', 'Tổng hợp できる! + chữ Hán lớp + khuôn thi nói', 'ポイント 1–6'],
      ],
    ),
    H('Ba điều phát âm cần biết ngay từ buổi đầu'),
    TABLE(
      ['Hiện tượng', 'Ví dụ', 'Cách đọc'],
      [
        ['Trường âm (kéo dài)', `${JR('せんせい')} · ${JR('コーヒー')}`, 'Kéo dài hẳn một nhịp: *sensee*, *koohii*. Đọc ngắn là thành từ khác (おばさん ≠ おばあさん).'],
        ['Âm ghép (ゃ ゅ ょ nhỏ)', `${JR('しゃいん')} · ${JR('りょこう')} · ${JR('きょうし')}`, 'Đọc liền một nhịp: *sha-in*, *ryo-koo*, *kyoo-shi* — không tách thành "shi-ya".'],
        ['Âm ngắt (っ nhỏ)', `${JR('がっこう')} · ${JR('サッカー')} · ${JR('いっさい')}`, 'Dừng một nhịp trước phụ âm kế tiếp: *gak-koo*, *sak-kaa*, *is-sai*.'],
      ],
    ),
    NOTE('Trợ từ đọc khác chữ — sẽ gặp từ câu đầu tiên', [
      `**は** đứng làm trợ từ chủ đề đọc là **wa**: ${JR('わたし は ワン です')}.`,
      `**を** đọc là **o**, **へ** đọc là **e** (chưa gặp ở Bài 1–2 nhưng có trong Bài 3).`,
      'Romaji trong bài đã viết sẵn đúng cách đọc (*wa*), nên cứ đọc theo romaji.',
    ]),
    MC('s113-b1-00-test', 'Tự kiểm tra đầu vào (6 câu — chưa cần chính xác, chỉ để biết mình đang ở đâu)', [
      Q('Chữ 「は」 trong 「わたしはワンです」 đọc là gì?', 'wa', 'ha | ba | e', 'Trợ từ chủ đề đọc **wa**.'),
      Q('「はじめまして」 nói khi nào?', 'Lần đầu gặp mặt', 'Khi chào tạm biệt | Khi cảm ơn | Khi xin lỗi', 'はじめまして = lần đầu gặp.'),
      Q('「ワンさん」 — さん dùng cho ai?', 'Người khác (không dùng cho mình)', 'Chỉ cho mình | Chỉ cho trẻ em | Chỉ cho thầy cô', 'さん luôn gắn tên NGƯỜI KHÁC.'),
      Q('「ベトナム人」 đọc là…', 'ベトナムじん', 'ベトナムにん | ベトナムひと | ベトナムびと', '人 sau tên nước đọc **じん**.'),
      Q('「しゃいん」 có mấy nhịp?', '3 nhịp (sha-i-n)', '4 nhịp | 2 nhịp | 5 nhịp', 'しゃ = 1 nhịp, い, ん.'),
      Q('Trong bài tự giới thiệu, câu nào KHÔNG nên có?', 'ワンさんは ワンです。 (thêm さん vào tên mình)', 'わたしは ワンです。 | どうぞ よろしく おねがいします。 | はじめまして。', 'Không gắn さん vào tên mình.'),
    ]),
  ],
};

/* ───────────────────────── BUỔI 1 ───────────────────────── */

const S1_01: Lesson = {
  id: 's113-b1-01-chao-hoi-ten',
  kind: 'grammar',
  title: 'Buổi 1 — はじめまして: chào lần đầu, nói tên, hỏi tên (theo khung lớp)',
  goal: 'Chào đúng lần đầu gặp, nói "Tôi là ___", hỏi "Tên bạn là gì?" và đáp はい／いいえ — dùng đúng さん và N1 は N2 です.',
  minutes: 40,
  blocks: [
    HOC([
      'Học theo **khung 3 lượt**: (1) chào → (2) nói tên → (3) kết bằng よろしくお願いします. Đọc to cả 3 lượt đến khi không cần nhìn.',
      'Mỗi từ mới đọc ba lần: nhìn chữ → che chữ nhìn romaji → che romaji nói nghĩa Việt.',
      'Làm hết bài luyện cuối buổi rồi mới chuyển sang buổi 2.',
    ]),
    NOTE('Nhắc lại', [HONEST]),
    RECAP('Buổi 1 dạy gì?', [
      'Mở đầu Bài 1 「{私|わたし}の{名前|なまえ}・{国|くに}・{仕事|しごと}」: mục tiêu là **tự giới thiệu** với người mới gặp.',
      '**Chào hỏi**: はじめまして · どうぞよろしくお願いします · こちらこそ · あのう、すみません · そうですか.',
      '**ポイント 1 — N1 は N2 です** ("N1 là N2"): {私|わたし}は ワンです。 Hỏi tên: お{名前|なまえ}は？',
      'Hai từ trả lời: **はい** (vâng) và **いいえ** (không) — dùng nhiều ở buổi sau.',
    ]),
    H('Từng phần của buổi 1 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Mục tiêu hành động**: tự giới thiệu ngắn với bạn mới', 'Cả bài hướng tới đoạn nói 6–7 câu. Buổi 1 chỉ lấy 3 câu đầu: chào – tên – kết lời. Nhớ: kỳ thi nói hay bắt đầu bằng **「はじめまして」**.'],
      ['**Tranh mở bài**: hai người cúi chào nhau', 'Văn hoá: người Nhật khi gặp lần đầu cúi đầu nhẹ. Học ngay phản xạ: nghe **はじめまして** thì đáp lại **はじめまして** rồi mới nói tên.'],
      [`**はじめまして**  ${JR('はじめまして')}`, 'Chỉ dùng **lần đầu gặp**. Gặp lần thứ hai trở đi nói こんにちは. Câu này đứng một mình, sau đó mới nói tên.'],
      [`**N1 は N2 です** — ${JR('わたし は ワン です')}`, 'Công thức quan trọng nhất của cả khoá: N1 (chủ đề) + は (đọc *wa*) + N2 + です. Nghĩa: "N1 là N2". Không có từ "là" riêng như tiếng Việt, **です** gánh luôn.'],
      [`**お{名前|なまえ}は？** — ${JR('お-{名前|なまえ} は')}`, 'Hỏi tên người khác một cách lịch sự. **お** gắn trước 名前 khi nói về người đối diện. Nói về mình thì bỏ お: {私|わたし}の{名前|なまえ}は…'],
      [`**〜さん** — ${JR('^ワン-さん')}`, 'Gắn sau tên người khác. **KHÔNG BAO GIỜ gắn sau tên mình**: nói 「{私|わたし}は ワンです」, không nói 「ワンさんです」 khi tự giới thiệu.'],
      [`**どうぞよろしくお願いします** — ${JR('どうぞ よろしく お{願|ねが}い します')}`, 'Câu kết khi tự giới thiệu: "Mong được giúp đỡ". Đáp lại bằng **こちらこそ** = "tôi cũng vậy / chính tôi mới mong được giúp".'],
      [`**あのう、すみません** — ${JR('あのう、 すみません')}`, 'Mở lời gọi người lạ để hỏi: "À… xin lỗi cho tôi hỏi". **あのう** kéo dài, ngập ngừng lịch sự; すみません vừa là "xin lỗi" vừa là "làm phiền chút".'],
      [`**そうですか** — ${JR('そう です か')}`, 'Phản ứng khi nghe thông tin mới: "Thế à / vậy à". Xuống giọng cuối câu là đã hiểu; lên giọng là hơi nghi ngờ.'],
      [`**はい／いいえ** — ${JR('はい')} · ${JR('いいえ')}`, 'はい = vâng/đúng. いいえ = không. Khi nói いいえ, thường kèm câu giải thích đúng (xem buổi 2).'],
      ['**やってみよう**: luyện cặp', 'Hai bạn đứng đối diện: A chào – nói tên – よろしく; B đáp lại. Cô hay gọi bất kỳ cặp nào lên diễn nên thuộc cả 3 lượt.'],
    ]),
    H('Từ mới của buổi 1'),
    VOC([
      VO('{私|わたし}', 'đại từ', 'tôi', '{私|わたし} は ^ワン です。', 'Tôi là Wan.'),
      VO('（お）{名前|なまえ}', 'danh từ', 'tên (お名前 = tên của bạn — lịch sự)', 'お-{名前|なまえ} は？', 'Tên bạn là gì ạ?'),
      VO('〜さん', 'hậu tố', 'anh/chị/ông/bà/bạn ~', '^ワン-さん は {学生|がくせい} です。', 'Bạn Wan là học sinh.', 'Chỉ gắn sau tên người khác.'),
      VO('はじめまして', 'câu chào', 'rất vui được gặp (lần đầu)', 'はじめまして。 ^パク です。', 'Rất vui được gặp. Tôi là Park.'),
      VO('（どうぞ）よろしく お{願|ねが}い します', 'câu chào', 'mong được giúp đỡ (kết lời tự giới thiệu)', '^アンナ です。 どうぞ よろしく お{願|ねが}い します。', 'Tôi là Anna. Mong được giúp đỡ.'),
      VO('こちらこそ', 'câu đáp', 'tôi cũng vậy / chính tôi mới là người mong được giúp', 'こちらこそ、 よろしく お{願|ねが}い します。', 'Chính tôi mới mong được giúp đỡ.'),
      VO('あのう', 'thán từ', 'À… / Anh/chị ơi… (mở lời)', 'あのう、 お-{名前|なまえ} は？', 'À… tên bạn là gì ạ?'),
      VO('すみません', 'câu', 'xin lỗi… / cho tôi hỏi…', 'すみません。 ^マルコ-さん です か。', 'Xin lỗi, anh là anh Marco phải không ạ?'),
      VO('あのう、 すみません。', 'câu', 'anh/chị ơi, xin lỗi cho tôi hỏi một chút', 'あのう、 すみません。 ^ワン-さん です か。', 'Xin lỗi, bạn là Wan phải không?'),
      VO('そう です か', 'câu đáp', 'thế à! / vậy à', '^タイ です。 ── そう です か。', 'Thái Lan. ── Vậy à.'),
      VO('はい', 'từ trả lời', 'vâng, dạ, có', 'はい、 ^ワン です。', 'Vâng, tôi là Wan.'),
      VO('いいえ', 'từ trả lời', 'không, không phải', 'いいえ、 ^パク です。', 'Không, tôi là Park.'),
    ]),
    H('Ngữ pháp buổi 1 — ポイント 1'),
    PAT([
      {
        formula: 'N1 は N2 です。',
        vi: 'N1 là N2 (câu giới thiệu / xác nhận). は đọc "wa".',
        examples: [
          E('{私|わたし} は ^ワン です。', 'Tôi là Wan.'),
          E('{私|わたし} は ^マルコ です。', 'Tôi là Marco.'),
          E('^パク-さん は {学生|がくせい} です。', 'Anh Park là sinh viên.'),
        ],
      },
      {
        formula: 'お{名前|なまえ} は？ ── N です。',
        vi: 'Hỏi tên người đối diện ── trả lời bằng tên.',
        examples: [
          E('あのう、 お-{名前|なまえ} は？', 'À… tên bạn là gì ạ?'),
          E('^ダニエル です。', 'Daniel ạ.'),
        ],
      },
    ]),
    RULE('N1 は N2 です', '"N1 là N2". Chủ đề đứng trước は; です đứng cuối câu, lịch sự.'),
    DLG('Hội thoại mẫu buổi 1 — lần đầu gặp', [
      D('ワン', 'f', 'はじめまして。 {私|わたし} は ^ワン です。 どうぞ よろしく お{願|ねが}い します。', 'Rất vui được gặp. Tôi là Wan. Mong được giúp đỡ.'),
      D('マルコ', 'm', 'はじめまして。 ^マルコ です。 こちらこそ、 よろしく お{願|ねが}い します。', 'Rất vui được gặp. Tôi là Marco. Chính tôi mới mong được giúp đỡ.'),
      D('ワン', 'f', '^マルコ-さん です か。', 'Anh là anh Marco phải không?'),
      D('マルコ', 'm', 'はい、 ^マルコ です。 あのう、 お-{名前|なまえ} は？', 'Vâng, tôi là Marco. À… tên bạn là gì?'),
      D('ワン', 'f', '^ワン です。', 'Tôi là Wan.'),
      D('マルコ', 'm', 'そう です か。 ^ワン-さん、 よろしく お{願|ねが}い します。', 'Vậy à. Chị Wan, mong được giúp đỡ.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 1', [
      '~~ワンさんです~~ (khi tự giới thiệu) → **{私|わたし}は ワンです**. Tên mình không có さん.',
      '~~{私|わたし}の{名前|なまえ}はワンさんです~~ → bỏ さん. Còn hỏi người khác thì phải thêm: **ワンさん**.',
      'Đọc は thành *ha* → phải đọc **wa** khi là trợ từ.',
      'Nói はじめまして ở lần gặp thứ hai → sai tình huống; dùng こんにちは.',
      'Quên **です** cuối câu: 「{私|わたし}は ワン」 → thiếu lịch sự, thi nói bị trừ điểm.',
    ]),
    NOTE('Cách nhớ', [
      'Khuôn 3 lượt: **chào → tên → よろしく**. Đếm 1–2–3 bằng ngón tay khi luyện.',
      '**は = wa** nhớ bằng câu: "Watashi **wa**" — luôn đọc *wa* sau chủ đề.',
      '**さん** như "cái nón lịch sự" chỉ đội lên đầu người khác, không đội lên đầu mình.',
    ]),
    QZ('s113-b1-01-dich', 'Dịch Việt → Nhật (buổi 1)', 'translate', [
      AS('Tôi là Wan.', '{私|わたし}は ワンです', 'N1 は N2 です'),
      AS('Tôi là Marco. Mong được giúp đỡ.', ['{私|わたし}は マルコです。どうぞ よろしく お{願|ねが}いします', 'マルコです。どうぞよろしくお{願|ねが}いします'], 'Tên + どうぞよろしく'),
      AS('Anh Marco ơi, tên anh là gì ạ? (hỏi tên)', ['マルコさん、お{名前|なまえ}は', 'お{名前|なまえ}は'], 'お名前は？'),
      AS('Chính tôi mới mong được giúp đỡ.', 'こちらこそ、よろしくお{願|ねが}いします', 'こちらこそ'),
      AS('Anh là anh Wan phải không? — Không, tôi là Park.', ['ワンさんですか。いいえ、パクです', 'ワンさんですか、いいえ、パクです'], 'さん + ですか; いいえ'),
    ]),
    MC('s113-b1-01-mcq', 'Chọn đáp án (buổi 1)', [
      Q('Lần đầu gặp, câu mở đầu đúng là…', 'はじめまして。', 'こんにちは。 | ありがとう。 | さようなら。', 'Lần đầu gặp → はじめまして.'),
      Q('Tự giới thiệu, câu đúng là…', '{私|わたし}は ワンです。', '{私|わたし}は ワンさんです。 | ワンさんは {私|わたし}です。 | {私|わたし}は ワンですか。', 'Không có さん sau tên mình; câu khẳng định không có か.'),
      Q('「どうぞよろしくお{願|ねが}いします」 có người đáp lại. Câu đáp tự nhiên nhất là…', 'こちらこそ。', 'いいえ。 | そうですか。 | すみません。', 'こちらこそ = tôi cũng vậy.'),
      Q('Muốn gọi một người lạ để hỏi, ta mở lời bằng…', 'あのう、すみません。', 'はじめまして。 | こちらこそ。 | はい。', 'あのう、すみません。'),
      Q('Câu nào SAI khi tự giới thiệu?', 'ワンさんです。(tự thêm さん vào tên mình)', 'ワンです。 | {私|わたし}はワンです。 | {私|わたし}の{名前|なまえ}はワンです。', 'さん chỉ gắn vào tên NGƯỜI KHÁC.'),
      Q('「は」 trong 「{私|わたし}はワンです」 đọc là…', 'wa', 'ha | e | o', 'Trợ từ chủ đề = wa.'),
    ]),
    ASK([
      '「お{名前|なまえ}は？」 — trả lời đủ câu: **{私|わたし}は ○○です。** (không chỉ nói trơ tên).',
      '「はじめまして」 rồi cả lớp chào tiếp — thuộc nguyên **bộ 3 lượt** (chào – tên – よろしく).',
      'Cô chỉ vào bạn bên cạnh: 「この{人|ひと}の{名前|なまえ}は？」 → **○○さんです** (nhớ さん!).',
    ]),
  ],
};

/* ───────────────────────── BUỔI 2 ───────────────────────── */

const S1_02: Lesson = {
  id: 's113-b1-02-nuoc-nguoi',
  kind: 'grammar',
  title: 'Buổi 2 — お{国|くに}はどちらですか: tên nước, 〜人, hỏi quê, trả lời "không phải" (theo khung lớp)',
  goal: 'Nói nước của mình, hỏi nước người khác bằng どちら, ghép 〜人, trả lời はい／いいえ và dùng じゃありません đúng.',
  minutes: 45,
  blocks: [
    HOC([
      'Học **tên nước trước**: 10 nước, đọc to, rồi ghép thêm **人** để thành "người nước đó".',
      'Với mỗi câu hỏi **〜ですか**, tập trả lời bằng **cả 2 hướng** (はい… / いいえ…) — thi nói thường hỏi để bạn phải trả lời "không".',
      'Làm bài luyện cuối buổi, đặc biệt phần điền じゃありません.',
    ]),
    RECAP('Buổi 2 dạy gì?', [
      '**Tên nước** (日本・アメリカ・イタリア・オーストラリア・韓国・タイ・中国・ロシア・ブラジル) và hậu tố **〜人** (người nước ~).',
      '**ポイント 3 (どちら)**: お{国|くに}は どちらですか。 ── ベトナムです。 (hỏi nước)',
      '**ポイント 2**: N1 は N2 **ですか** (câu hỏi Có/Không) · はい、N です · いいえ、N じゃありません。',
      'Thêm câu đáp: そうですか · あ（っ）.',
    ]),
    H('Từng phần của buổi 2 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: bản đồ thế giới, cờ các nước', 'Gợi nhớ tên nước. Nhiều tên nước là **katakana** (từ mượn) — đọc theo cách mượn: アメリカ *Amerika*, イタリア *Itaria*, オーストラリア *Oosutoraria*.'],
      [`**Tên nước kanji**: ${JR('{日本|にほん}')} · ${JR('{韓国|かんこく}')} · ${JR('{中国|ちゅうごく}')}`, 'Ba nước chữ Hán phải học thuộc cả cách đọc: *Nihon*, *Kankoku*, *Chuugoku*. Âm kéo dài ở 中国 (*chuu*).'],
      [`**〜{人|じん}** — ${JR('ベトナム-{人|じん}')} · ${JR('{日本人|にほんじん}')}`, 'Tên nước + **人** = người nước đó. Đọc **じん** (không phải ひと). Riêng 日本人, 中国人, 韓国人 viết chữ Hán liền không cách.'],
      [`**どちら** — ${JR('お-{国|くに} は どちら です か')}`, '**どちら** = lịch sự của どこ ("đâu/phía nào"). Hỏi nước: お国は **どちら** ですか. Trả lời **chỉ cần tên nước**: ベトナムです.'],
      ['**N1 は N2 ですか** — câu hỏi Có/Không', 'Thêm **か** cuối câu là thành câu hỏi, giọng lên nhẹ ở か. Không đổi trật tự từ. Không dùng dấu "?" bắt buộc khi viết, nhưng web hay thêm.'],
      ['**はい、N2 です／いいえ、N2 じゃありません**', 'Đúng → はい + câu khẳng định. Sai → いいえ + **じゃありません** (không phải) + thông tin đúng. **じゃありません** là phủ định của です.'],
      [`**そうですか** và **あ（っ）**`, 'Khi vừa nghe được thông tin mới. あ（っ）= "A!" khi chợt nhận ra, ví dụ nhận ra người quen.'],
      ['**Chuỗi hỏi liên hoàn** (cô hay bắt cặp luyện)', 'お国は どちらですか → ○○です → ○○人ですか → はい／いいえ. Chuẩn bị cả câu trả lời "không" bằng 2 phút luyện miệng.'],
    ]),
    H('Từ mới của buổi 2'),
    VOC([
      VO('{日本|にほん}', 'tên nước', 'Nhật Bản', '^ワン-さん の お-{国|くに} は {日本|にほん} です か。', 'Nước của Wan là Nhật Bản à?'),
      VO('アメリカ', 'tên nước', 'Mỹ', '^メアリー-さん は アメリカ-{人|じん} です。', 'Mary là người Mỹ.'),
      VO('イタリア', 'tên nước', 'Ý', '^マルコ-さん の お-{国|くに} は イタリア です。', 'Nước của Marco là Ý.'),
      VO('オーストラリア', 'tên nước', 'Úc', '^ダニエル-さん は オーストラリア-{人|じん} です。', 'Daniel là người Úc.'),
      VO('{韓国|かんこく}', 'tên nước', 'Hàn Quốc', '^パク-さん は {韓国人|かんこくじん} です。', 'Park là người Hàn Quốc.'),
      VO('タイ', 'tên nước', 'Thái Lan', '^ナタポン-さん は タイ-{人|じん} です。', 'Natapon là người Thái.'),
      VO('{中国|ちゅうごく}', 'tên nước', 'Trung Quốc', '^ワン-さん の お-{国|くに} は {中国|ちゅうごく} です。', 'Nước của Wan là Trung Quốc.'),
      VO('ロシア', 'tên nước', 'Nga', '^アンナ-さん は ロシア-{人|じん} です。', 'Anna là người Nga.'),
      VO('ブラジル', 'tên nước', 'Brazil', '^カルロス-さん は ブラジル-{人|じん} です。', 'Carlos là người Brazil.'),
      VO('〜{人|じん}', 'hậu tố', 'người (nước ~)', '{私|わたし} は ベトナム-{人|じん} です。', 'Tôi là người Việt Nam.'),
      VO('（お）{国|くに}', 'danh từ', 'đất nước (お国 = nước của bạn)', 'お-{国|くに} は どちら です か。', 'Nước của bạn là nước nào?'),
      VO('どちら', 'từ để hỏi', 'đâu / phía nào (lịch sự)', '^マルコ-さん、 お-{国|くに} は どちら です か。', 'Marco, nước của bạn là nước nào?'),
      VO('お-{国|くに} は どちら です か。', 'câu', 'Nước của bạn là nước nào? (Bạn đến từ đâu?)', 'お-{国|くに} は どちら です か。 ── タイ です。', 'Bạn đến từ nước nào? ── Thái Lan.'),
      VO('あ（っ）', 'thán từ', 'A! / Á! (chợt nhận ra)', 'あっ、 ^ワン-さん です か。', 'A, bạn là Wan phải không?'),
    ]),
    H('Ngữ pháp buổi 2 — ポイント 2 và 3 (どちら)'),
    PAT([
      {
        formula: 'N1 は N2 ですか。 ── はい、N2 です。／いいえ、N2 じゃありません。',
        vi: 'Hỏi Có/Không rồi trả lời bằng はい／いいえ.',
        examples: [
          E('^ワン-さん は {中国人|ちゅうごくじん} です か。', 'Bạn Wan là người Trung Quốc à?'),
          E('はい、 {中国人|ちゅうごくじん} です。', 'Vâng, là người Trung Quốc.'),
          E('いいえ、 {中国人|ちゅうごくじん} じゃ ありません。 {韓国人|かんこくじん} です。', 'Không, không phải người Trung Quốc. Là người Hàn Quốc.'),
        ],
      },
      {
        formula: 'お{国|くに} は どちら ですか。 ── N です。',
        vi: 'Hỏi nước; trả lời tên nước (không cần さん, không cần 人).',
        examples: [
          E('お-{国|くに} は どちら です か。', 'Bạn đến từ nước nào ạ?'),
          E('ブラジル です。', 'Brazil ạ.'),
          E('ブラジル-{人|じん} です。', 'Là người Brazil ạ. (cũng đúng)'),
        ],
      },
    ]),
    RULE('N1 は N2 じゃありません', 'Phủ định lịch sự của です (có thể nói ではありません khi trang trọng).'),
    DLG('Hội thoại mẫu buổi 2 — hỏi quê', [
      D('ダニエル', 'm', 'あのう、 すみません。 お-{国|くに} は どちら です か。', 'À, xin lỗi. Nước của bạn là nước nào?'),
      D('アンナ', 'f', 'ロシア です。', 'Nga.'),
      D('ダニエル', 'm', 'そう です か。 ^アンナ-さん は {学生|がくせい} です か。', 'Vậy à. Anna là sinh viên à?'),
      D('アンナ', 'f', 'はい、 {学生|がくせい} です。 ^ダニエル-さん は {中国人|ちゅうごくじん} です か。', 'Vâng, là sinh viên. Daniel là người Trung Quốc à?'),
      D('ダニエル', 'm', 'いいえ、 {中国人|ちゅうごくじん} じゃ ありません。 オーストラリア-{人|じん} です。', 'Không, không phải người Trung Quốc. Tôi là người Úc.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 2', [
      '~~お国は誰ですか~~ / ~~お国は何ですか~~ → hỏi nước dùng **どちら** (hoặc どこ). 何 hỏi vật, 誰 hỏi người.',
      '~~ベトナムはじんです~~ → phải **ベトナム人**; nếu chỉ nói tên nước thì không cần じん: ベトナムです.',
      '~~いいえ、中国人です~~ (trả lời "không" mà vẫn khẳng định cùng thông tin) → **いいえ、中国人じゃありません**.',
      '~~日本人ですか。はい、日本人じゃありません~~ → はい đi với khẳng định; いいえ mới đi với じゃありません.',
      'Đọc 人 thành *hito* trong ベトナム人 → phải **じん**.',
      'Quên **か** cuối câu hỏi → câu thành khẳng định.',
    ]),
    NOTE('Cách nhớ', [
      '**はい = khớp, いいえ = lệch**: câu hỏi đúng sự thật thì はい, sai sự thật thì いいえ. (Tiếng Việt "vâng/không" có thể lệch với câu hỏi phủ định, tiếng Nhật không.)',
      'Công thức phủ định gọn: **N じゃありません** — "ja-arimasen", đọc nhanh như một từ.',
      'Nhớ bộ 3 nước chữ Hán bằng vần: **Nihon – Kankoku – Chuugoku**.',
    ]),
    QZ('s113-b1-02-dich', 'Dịch Việt → Nhật (buổi 2)', 'translate', [
      AS('Nước của bạn là nước nào?', 'お{国|くに}はどちらですか', 'どちら'),
      AS('Tôi là người Việt Nam.', '{私|わたし}はベトナム{人|じん}です', '〜人 = じん'),
      AS('Carlos là người Brazil.', 'カルロスさんはブラジル{人|じん}です', ''),
      AS('Wan không phải người Hàn Quốc.', 'ワンさんは{韓国人|かんこくじん}じゃありません', 'N じゃありません'),
      AS('Daniel là người Úc phải không? — Vâng, đúng.', ['ダニエルさんはオーストラリア{人|じん}ですか。はい、そうです', 'ダニエルさんはオーストラリア{人|じん}ですか。はい、オーストラリア{人|じん}です'], 'ですか; はい'),
    ]),
    MC('s113-b1-02-mcq', 'Chọn đáp án (buổi 2)', [
      Q('「お{国|くに}は（　）ですか。」 (hỏi nước)', 'どちら', '{何|なん} | いつ | だれ', 'Hỏi nước/nơi = どちら.'),
      Q('「パクさんは {韓国人|かんこくじん}（　）。」 (câu hỏi)', 'ですか', 'です | じゃありません | の', 'Câu hỏi: ですか.'),
      Q('「{中国人|ちゅうごくじん}ですか。」 — Sự thật là người Nhật. Trả lời đúng:', 'いいえ、{中国人|ちゅうごくじん}じゃありません。{日本人|にほんじん}です。', 'はい、{中国人|ちゅうごくじん}じゃありません。 | いいえ、{中国人|ちゅうごくじん}です。 | はい、{日本人|にほんじん}じゃありません。', 'いいえ + phủ định + thông tin đúng.'),
      Q('「タイ（　）」 = người Thái', '人 (じん)', 'さん | の | は', '人 sau tên nước.'),
      Q('「アンナさんは ロシア{人|じん}です」 — Anna là…', 'Người Nga', 'Người Úc | Người Nhật | Người Trung Quốc', 'ロシア = Nga.'),
      Q('「ベトナム（　）です」 — chọn đúng để nói "Tôi là người Việt Nam" (chủ ngữ đã có 私は)', '人', 'の | も | と', 'ベトナム人です.'),
    ]),
    ASK([
      '「お{国|くに}は どちらですか。」 — luôn trả lời đủ: **ベトナムです** hoặc **ベトナム人です**.',
      '「ベトナム{人|じん}ですか。」 / 「{日本人|にほんじん}ですか。」 — cô hay hỏi cả hai để bạn trả lời はい **và** いいえ.',
      'Cô chỉ tranh một bạn học: 「この{人|ひと}は {韓国人|かんこくじん}ですか。」 — nhìn thẻ nhân vật (xem buổi 6).',
    ]),
  ],
};

/* ───────────────────────── BUỔI 3 ───────────────────────── */

const S1_03: Lesson = {
  id: 's113-b1-03-truong-nghe',
  kind: 'grammar',
  title: 'Buổi 3 — お仕事は？: trường học, nghề nghiệp, N1 の N2 (theo khung lớp)',
  goal: 'Nói trường mình học/dạy, nghề của mình, phân biệt 先生/教師 và 会社員/社員, và dùng の nối hai danh từ.',
  minutes: 45,
  blocks: [
    HOC([
      'Học **hai cặp từ dễ nhầm** (先生/教師, 会社員/社員) bằng ví dụ — thi hay ra đúng cặp này.',
      'Tập nói **một câu dài có の**: "Tôi là học sinh của trường X" — ghép từng mảnh từ phải sang trái.',
      'Làm bài luyện, chú ý phần "sai ở đâu".',
    ]),
    RECAP('Buổi 3 dạy gì?', [
      '**Trường học**: 高校 · 大学 · 日本語学校. **Nghề**: 学生 · 先生 · 教師 · 会社員 · 社員 · お仕事.',
      '**ポイント 3 (何)**: お{仕事|しごと}は？ ── 〜です (cũng nói {仕事|しごと}は{何|なん}ですか).',
      '**ポイント 4 — N1 の N2**: ふじみ大学**の**学生 (sinh viên của ĐH Fujimi); {私|わたし}**の**{名前|なまえ}; ABE**の**社員.',
      'Tập kết hợp: tên + の + trường + の + nghề.',
    ]),
    H('Từng phần của buổi 3 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: lớp học, văn phòng', 'Gợi chủ đề nghề nghiệp. Nhìn tranh, thử nói: 「○○さんは 学生です」 / 「会社員です」.'],
      [`**Trường**: ${JR('{高校|こうこう}')} · ${JR('{大学|だいがく}')} · ${JR('{日本語学校|にほんごがっこう}')}`, '高校 = THPT; 大学 = đại học; 日本語学校 = trường tiếng Nhật. Âm kéo dài: *kookoo*, *daigaku*.'],
      [`**Nghề**: ${JR('{学生|がくせい}')}, ${JR('{先生|せんせい}')}, ${JR('{教師|きょうし}')}, ${JR('{会社員|かいしゃいん}')}, ${JR('{社員|しゃいん}')}`, 'Năm từ chỉ nghề. **学生** = học sinh/sinh viên. **会社員** = nhân viên công ty (nói chung). **社員** = nhân viên của MỘT công ty cụ thể (có tên công ty đứng trước).'],
      ['**先生 vs 教師**', '**先生** = thầy/cô: dùng để GỌI hay nói về giáo viên khác (本田先生). **教師** = nghề giáo viên: dùng khi nói nghề CỦA MÌNH (「{私|わたし}は教師です」). Tự gọi mình là 先生 nghe tự tôn.'],
      ['**N1 の N2** — ポイント 4', '**の** nối hai danh từ, N1 bổ nghĩa cho N2 và đứng TRƯỚC (ngược với tiếng Việt). あおぞら日本語学校**の**学生 = "sinh viên **của** trường tiếng Nhật Aozora". Chuỗi dài đọc từ phải sang trái.'],
      [`**お{仕事|しごと}は？** — ${JR('お-{仕事|しごと} は')}`, 'Hỏi nghề. Trả lời: **{会社員|かいしゃいん}です** hoặc **○○の{社員|しゃいん}です**. Nói về mình: bỏ お.'],
      ['**Hỏi ↔ đáp có の**', '「ワンさんは どこの 学生ですか」 (trường nào?) cô chưa dạy, nhưng 「ワンさんは 大学の学生ですか」 rất hay gặp. Bạn nói: 「はい、ふじみ大学の学生です」.'],
      ['**Luyện cặp**', 'A hỏi 「お仕事は？」, B trả lời có trường/công ty, rồi đổi vai.'],
    ]),
    H('Từ mới của buổi 3'),
    VOC([
      VO('{高校|こうこう}', 'danh từ', 'trường THPT (cấp 3)', '^ニシカワ-さん は さくら-{高校|こうこう} の {先生|せんせい} です。', 'Cô Nishikawa là cô giáo của trường THPT Sakura.', 'Âm kéo dài: kookoo.'),
      VO('{大学|だいがく}', 'danh từ', 'trường đại học', '^マルコ-さん は ふじみ-{大学|だいがく} の {学生|がくせい} です。', 'Marco là sinh viên ĐH Fujimi.'),
      VO('{日本語学校|にほんごがっこう}', 'danh từ', 'trường tiếng Nhật', '^パク-さん は あおぞら-{日本語学校|にほんごがっこう} の {学生|がくせい} です。', 'Park là học sinh trường tiếng Nhật Aozora.'),
      VO('（お）{仕事|しごと}', 'danh từ', 'công việc (お仕事 = công việc của bạn)', 'お-{仕事|しごと} は？ ── {会社員|かいしゃいん} です。', 'Bạn làm nghề gì? ── Tôi là nhân viên công ty.'),
      VO('{学生|がくせい}', 'danh từ', 'học sinh, sinh viên', '^ワン-さん は {学生|がくせい} です。', 'Wan là sinh viên.'),
      VO('{先生|せんせい}', 'danh từ', 'thầy/cô giáo (để gọi người khác)', '^ホンダ-{先生|せんせい} は {日本人|にほんじん} です。', 'Thầy Honda là người Nhật.'),
      VO('{教師|きょうし}', 'danh từ', 'giáo viên (tên nghề của mình)', '{私|わたし} は さくら-{高校|こうこう} の {教師|きょうし} です。', 'Tôi là giáo viên trường THPT Sakura.'),
      VO('{会社員|かいしゃいん}', 'danh từ', 'nhân viên văn phòng, nhân viên công ty (nói chung)', '^カルロス-さん は {会社員|かいしゃいん} です。', 'Carlos là nhân viên công ty.'),
      VO('{社員|しゃいん}', 'danh từ', 'nhân viên (của một công ty cụ thể)', '^カルロス-さん は ABE の {社員|しゃいん} です。', 'Carlos là nhân viên công ty ABE.', 'Luôn có tên công ty đứng trước.'),
    ]),
    H('Ngữ pháp buổi 3 — ポイント 3 (何) và 4 (の)'),
    PAT([
      {
        formula: 'N1 の N2',
        vi: 'N2 của N1 / N2 thuộc N1. N1 đứng trước.',
        examples: [
          E('ふじみ-{大学|だいがく} の {学生|がくせい} です。', 'Là sinh viên của ĐH Fujimi.'),
          E('{私|わたし} の {名前|なまえ} は ^ワン です。', 'Tên của tôi là Wan.'),
          E('^ホンダ-{先生|せんせい} は さくら-{高校|こうこう} の {教師|きょうし} です。', 'Thầy Honda là giáo viên trường THPT Sakura.'),
        ],
      },
      {
        formula: 'お{仕事|しごと} は？ ／ {仕事|しごと} は {何|なん} ですか。',
        vi: 'Hỏi nghề nghiệp.',
        examples: [
          E('お-{仕事|しごと} は？', 'Bạn làm nghề gì?'),
          E('{会社員|かいしゃいん} です。', 'Tôi là nhân viên công ty.'),
          E('ABE の {社員|しゃいん} です。', 'Tôi là nhân viên công ty ABE.'),
        ],
      },
    ]),
    RULE('N1 の N2', 'N1 giải thích N2 và đứng trước N2 (trái với tiếng Việt: "sinh viên của ĐH X" → "X の học sinh").'),
    DLG('Hội thoại mẫu buổi 3', [
      D('マルコ', 'm', '^ワン-さん、 お-{仕事|しごと} は？', 'Chị Wan, chị làm nghề gì?'),
      D('ワン', 'f', '{学生|がくせい} です。 ふじみ-{大学|だいがく} の {学生|がくせい} です。 ^マルコ-さん は？', 'Tôi là sinh viên. Sinh viên ĐH Fujimi. Còn anh Marco?'),
      D('マルコ', 'm', '{私|わたし} も ふじみ-{大学|だいがく} の {学生|がくせい} です。', 'Tôi cũng là sinh viên ĐH Fujimi.'),
      D('ワン', 'f', 'あっ、 {同|おな}じ です ね。', 'A, giống nhau nhỉ.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 3', [
      '~~{私|わたし}は先生です~~ (khi nói nghề mình) → **{私|わたし}は{教師|きょうし}です**.',
      '~~ABEは会社員です~~ → nói nghề của người: **ABEの社員です** (có công ty) hoặc **会社員です** (nói chung).',
      '~~{学生|がくせい}のふじみ{大学|だいがく}~~ → đảo ngược: **ふじみ大学の学生**.',
      'Thiếu の giữa hai danh từ: ~~ふじみ大学 学生~~ → thêm の.',
      'Dùng **の** để nối "và": ~~サッカーの水泳~~ → xem buổi 5 (と).',
    ]),
    NOTE('Cách nhớ', [
      '**先生 = thầy/cô của NGƯỜI KHÁC; 教師 = nghề của MÌNH** (教 là dạy).',
      '**会社員 = nghề; 社員 = thành viên của công ty có tên**: gắn tên công ty vào rồi mới dùng 社員.',
      '**の đọc từ phải sang trái**: ふじみ大学の学生 → "học sinh" ← "của ĐH Fujimi".',
    ]),
    QZ('s113-b1-03-dich', 'Dịch Việt → Nhật (buổi 3)', 'translate', [
      AS('Tôi là sinh viên.', '{私|わたし}は{学生|がくせい}です'),
      AS('Anh Marco là sinh viên ĐH Fujimi.', 'マルコさんはふじみ{大学|だいがく}の{学生|がくせい}です', 'N1 の N2'),
      AS('Tôi là giáo viên của trường THPT Sakura.', '{私|わたし}はさくら{高校|こうこう}の{教師|きょうし}です', '教師'),
      AS('Anh Carlos là nhân viên công ty ABE.', 'カルロスさんはABEの{社員|しゃいん}です', '社員'),
      AS('Bạn làm nghề gì? — Tôi là nhân viên công ty.', ['お{仕事|しごと}は。{会社員|かいしゃいん}です', 'お{仕事|しごと}は？{会社員|かいしゃいん}です'], 'お仕事は？'),
    ]),
    MC('s113-b1-03-mcq', 'Chọn đáp án (buổi 3)', [
      Q('Nói nghề của CHÍNH MÌNH (giáo viên) nên dùng…', '{教師|きょうし}', '{先生|せんせい} | {学生|がくせい} | {社員|しゃいん}', '教師 là tên nghề.'),
      Q('「ABE（　）{社員|しゃいん}です」', 'の', 'は | も | と', 'Công ty の nhân viên.'),
      Q('「ふじみ{大学|だいがく}の{学生|がくせい}」 nghĩa là…', 'Sinh viên của ĐH Fujimi', 'ĐH Fujimi của sinh viên | Sinh viên và ĐH Fujimi | Sinh viên cũng ĐH Fujimi', 'N1 の N2 = N2 thuộc N1.'),
      Q('Hỏi nghề nghiệp người khác thân mật lịch sự:', 'お{仕事|しごと}は？', '{私|わたし}の{仕事|しごと}は？ | お{国|くに}は？ | {誕生日|たんじょうび}は？', 'お仕事は？'),
      Q('「{会社員|かいしゃいん}」 và 「{社員|しゃいん}」 khác nhau ở…', '会社員 = chung; 社員 = công ty cụ thể', '会社員 = giáo viên; 社員 = học sinh | Hai từ hoàn toàn giống | 社員 là nghề của mình, 会社員 là của người khác', 'Xem phần giải thích.'),
      Q('Chọn câu đúng ngữ pháp', '{私|わたし}の{名前|なまえ}はワンです。', '{私|わたし}の{名前|なまえ}はワンさんです。 | {私|わたし}は{名前|なまえ}のワンです。 | ワンの{名前|なまえ}は{私|わたし}です。', 'Không gắn さん vào tên mình.'),
    ]),
    ASK([
      '「～さんの お{仕事|しごと}は？」 — trả lời nghề **và** nơi làm/học: 「{学生|がくせい}です。FPT{大学|だいがく}の{学生|がくせい}です」.',
      '「～さんは {会社員|かいしゃいん}ですか。」 — nhiều bạn đáp nhầm "社員". Nhớ: không có tên công ty thì dùng 会社員.',
      '「{先生|せんせい}ですか。」 — nếu bạn là học sinh, đáp: **いいえ、{先生|せんせい}じゃありません。{学生|がくせい}です。**',
    ]),
  ],
};

/* ───────────────────────── BUỔI 4 ───────────────────────── */

const S1_04: Lesson = {
  id: 's113-b1-04-tuoi-ngay-sinh',
  kind: 'grammar',
  title: 'Buổi 4 — 私の誕生日: tuổi, tháng, ngày, sinh nhật, いつ (theo khung lớp)',
  goal: 'Đọc đúng số 1–31, tháng, ngày, tuổi; hỏi và nói sinh nhật, tuổi bằng いつ／何歳.',
  minutes: 45,
  blocks: [
    HOC([
      'Buổi này **nhiều bảng nhất** của Bài 1. Học theo thứ tự: số 1–10 → 〜歳 → 〜月 → 〜日. Mỗi bảng chỉ cần thuộc phần **bất quy tắc** (in đậm), còn lại đọc theo quy tắc.',
      'Cách luyện tốt nhất: đọc to **ngày sinh của bạn bè/người thân** (tuổi + ngày + tháng).',
      'Đừng bỏ qua bẫy: **4月 7月 9月**, **ngày 1–10, 14, 20, 24**, **1・8・10 tuổi (っ)**, **20 tuổi はたち**.',
    ]),
    RECAP('Buổi 4 dạy gì?', [
      '**Từ mới**: 誕生日 · 〜月 · 〜日 · 〜歳 · いつ · ブラジル (nước của Carlos) · (thêm) 何歳 · 二十歳.',
      '**ポイント 3 (いつ)**: {誕生日|たんじょうび}は **いつ**ですか。 ── ○月○日です。',
      '**Hỏi tuổi**: ○○さんは **何歳**ですか（おいくつですか）。 ── ○○歳です。',
      'Biến âm là trọng tâm: tháng 4/7/9, ngày 1–10, tuổi 1/8/10/20.',
    ]),
    H('Từng phần của buổi 4 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: bánh sinh nhật có nến', 'Gợi chủ đề 誕生日. Nhìn tranh nói: 「{誕生日|たんじょうび}は…です」.'],
      ['**Số 1–10 và 11–31**', 'Nhắc lại số: 1 いち · 2 に · 3 さん · 4 よん/し · 5 ご · 6 ろく · 7 なな/しち · 8 はち · 9 きゅう/く · 10 じゅう. Từ 11: ghép **じゅう + số**; 20 = にじゅう; 30 = さんじゅう. Ghép như tiếng Việt.'],
      [`**${JR('〜{歳|さい}')}** (tuổi)`, 'Số + さい. **Bất quy tắc**: 1歳 *issai*, 8歳 *hassai*, 10歳 *jussai*, 20歳 **はたち**. Các số khác theo quy tắc: 2歳 *nisai*, 3歳 *sansai*, 4歳 *yonsai*…'],
      [`**${JR('{何歳|なんさい}')} / おいくつ**`, 'Hỏi tuổi. 何歳 thông thường; **おいくつ** lịch sự hơn, dùng với người lớn tuổi. Trả lời: ○○歳です.'],
      [`**${JR('〜{月|がつ}')}** (tháng)`, 'Số + がつ. **Ba tháng đặc biệt**: 4月 **しがつ** (không よんがつ), 7月 **しちがつ** (không ななにち), 9月 **くがつ** (không きゅうがつ).'],
      [`**${JR('〜{日|にち}')}** (ngày)`, 'Ngày 1–10 đọc **âm riêng**: ついたち ふつか みっか よっか いつか むいか なのか ようか ここのか とおか. 14 じゅうよっか; 20 **はつか**; 24 にじゅうよっか. Còn lại: số + にち.'],
      [`**${JR('{誕生日|たんじょうび} は いつ です か')}**`, 'Hỏi ngày sinh. Trả lời: ○月○日です. Không cần nói năm. Thứ tự: **tháng trước, ngày sau**.'],
      ['**Hỏi ↔ đáp ghép**', 'A: 「ワンさんの誕生日はいつですか」 B: 「3月21日です」. Đáp xong hỏi lại: 「○○さんは？」.'],
      ['**Chuỗi cô hay hỏi**', '「何歳ですか」→「誕生日はいつですか」→ đổi cặp. Cần nghe nhanh hai câu này mà không nhầm 何歳 (tuổi) với いつ (ngày).'],
    ]),
    H('Bảng tuổi, tháng, ngày — chép lại để tra'),
    TABLE(
      ['Tuổi', 'Đọc', 'Tuổi', 'Đọc'],
      [
        ['1歳', '**いっさい**', '10歳', '**じゅっさい**'],
        ['2歳', 'にさい', '18歳', '**じゅうはっさい**'],
        ['3歳', 'さんさい', '19歳', 'じゅうきゅうさい'],
        ['4歳', 'よんさい', '20歳', '**はたち**'],
        ['5歳', 'ごさい', '21歳', 'にじゅういっさい'],
        ['6歳', 'ろくさい', '22歳', 'にじゅうにさい'],
        ['7歳', 'ななさい', '30歳', 'さんじゅっさい'],
        ['8歳', '**はっさい**', '何歳', 'なんさい'],
      ],
      'Tuổi (〜歳)',
    ),
    TABLE(
      ['Tháng', 'Đọc', 'Tháng', 'Đọc'],
      [
        ['1月', 'いちがつ', '7月', '**しちがつ**'],
        ['2月', 'にがつ', '8月', 'はちがつ'],
        ['3月', 'さんがつ', '9月', '**くがつ**'],
        ['4月', '**しがつ**', '10月', 'じゅうがつ'],
        ['5月', 'ごがつ', '11月', 'じゅういちがつ'],
        ['6月', 'ろくがつ', '12月', 'じゅうにがつ'],
      ],
      'Tháng (〜月) — nhớ ba ô đậm',
    ),
    TABLE(
      ['Ngày', 'Đọc', 'Ngày', 'Đọc'],
      [
        ['1日', '**ついたち**', '8日', '**ようか**'],
        ['2日', '**ふつか**', '9日', '**ここのか**'],
        ['3日', '**みっか**', '10日', '**とおか**'],
        ['4日', '**よっか**', '14日', '**じゅうよっか**'],
        ['5日', '**いつか**', '20日', '**はつか**'],
        ['6日', '**むいか**', '24日', '**にじゅうよっか**'],
        ['7日', '**なのか**', '何日', 'なんにち'],
      ],
      'Ngày (〜日) — mười ngày đầu và ba ngày đặc biệt',
    ),
    H('Từ mới của buổi 4'),
    VOC([
      VO('{誕生日|たんじょうび}', 'danh từ', 'ngày sinh, sinh nhật', '^アンナ-さん の {誕生日|たんじょうび} は {5月|ごがつ} {5日|いつか} です。', 'Sinh nhật của Anna là ngày 5 tháng 5.'),
      VO('〜{月|がつ}', 'hậu tố', 'tháng ~', '{私|わたし} の {誕生日|たんじょうび} は {12月|じゅうにがつ} です。', 'Sinh nhật tôi vào tháng 12.', 'Cẩn thận 4月 7月 9月.'),
      VO('〜{日|にち}', 'hậu tố', 'ngày (mùng) ~', '{6月|ろくがつ} {15日|じゅうごにち} です。', 'Ngày 15 tháng 6.', 'Ngày 1–10, 14, 20, 24 đọc riêng.'),
      VO('〜{歳|さい}', 'hậu tố', '~ tuổi', '{私|わたし} は {18歳|じゅうはっさい} です。', 'Tôi 18 tuổi.'),
      VO('いつ', 'từ để hỏi', 'khi nào, lúc nào', '{誕生日|たんじょうび} は いつ です か。', 'Sinh nhật bạn là khi nào?'),
      VO('ブラジル', 'tên nước', 'Brazil', '^カルロス-さん の お-{国|くに} は ブラジル です。', 'Nước của Carlos là Brazil.'),
      VO('{何歳|なんさい}', 'từ để hỏi', 'mấy tuổi', '^マリヤム-さん は {何歳|なんさい} です か。', 'Mariyam bao nhiêu tuổi?', 'Lịch sự hơn: おいくつ.'),
      VO('{二十歳|はたち}', 'danh từ', '20 tuổi', '{私|わたし} は {二十歳|はたち} です。', 'Tôi 20 tuổi.'),
    ]),
    H('Ngữ pháp buổi 4 — ポイント 3 (いつ) dùng với ngày tháng'),
    PAT([
      {
        formula: 'N は いつ ですか。 ── ○月○日 です。',
        vi: 'Hỏi thời điểm; trả lời bằng tháng + ngày.',
        examples: [
          E('^ワン-さん の {誕生日|たんじょうび} は いつ です か。', 'Sinh nhật của Wan là khi nào?'),
          E('{3月|さんがつ} {21日|にじゅういちにち} です。', 'Ngày 21 tháng 3.'),
        ],
      },
      {
        formula: 'N は ○○歳 です。／ N は 何歳 ですか。',
        vi: 'Nói và hỏi tuổi.',
        examples: [
          E('^マルコ-さん は {何歳|なんさい} です か。', 'Marco bao nhiêu tuổi?'),
          E('{21歳|にじゅういっさい} です。', '21 tuổi.'),
          E('{私|わたし} は {二十歳|はたち} です。', 'Tôi 20 tuổi.'),
        ],
      },
    ]),
    DLG('Hội thoại mẫu buổi 4 — hỏi tuổi và sinh nhật', [
      D('パク', 'f', '^カルロス-さん、 {誕生日|たんじょうび} は いつ です か。', 'Carlos, sinh nhật anh là khi nào?'),
      D('カルロス', 'm', '{4月|しがつ} {17日|じゅうしちにち} です。', 'Ngày 17 tháng 4.'),
      D('パク', 'f', '{何歳|なんさい} です か。', 'Anh bao nhiêu tuổi?'),
      D('カルロス', 'm', '{41歳|よんじゅういっさい} です。 ^パク-さん は？', '41 tuổi. Còn chị Park?'),
      D('パク', 'f', '{二十歳|はたち} です。 {誕生日|たんじょうび} は {9月|くがつ} {1日|ついたち} です。', 'Tôi 20 tuổi. Sinh nhật là ngày 1 tháng 9.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 4', [
      '~~よんがつ~~ / ~~なながつ~~ / ~~きゅうがつ~~ → **しがつ / しちがつ / くがつ**.',
      '~~いちにち~~ (mùng 1) → **ついたち**; ~~にじゅうにち~~ (ngày 20) → **はつか**.',
      '~~にじゅっさい~~ cho 20 tuổi → nên dùng **はたち** (にじゅっさい cũng đúng nhưng ít dùng).',
      '~~いちさい / はちさい / じゅうさい~~ → **いっさい / はっさい / じゅっさい**.',
      'Nói **ngày trước tháng** như tiếng Anh/Việt: ~~5日5月~~ → **5月5日** (tháng trước).',
      'Nhầm 何歳 (tuổi) với 何日 (mấy ngày) khi nghe nhanh.',
    ]),
    NOTE('Cách nhớ', [
      '**Tháng 4-7-9 = "shi–shichi–ku"** — đều là âm Hán (on) trong khi 1-2-3 đều "bình thường".',
      '**Mười ngày đầu = bài hát Nhật cổ**: tsuitachi, futsuka, mikka, yokka, itsuka, muika, nanoka, youka, kokonoka, tooka. Hát theo nhịp 10 lần là thuộc.',
      '**はたち** ("hatachi") = 20 tuổi — tuổi trưởng thành ở Nhật, nên có từ riêng.',
    ]),
    QZ('s113-b1-04-doc', 'Viết cách đọc bằng hiragana (buổi 4)', 'fill', [
      A('Tháng 4', 'しがつ'),
      A('Tháng 7', 'しちがつ'),
      A('Tháng 9', 'くがつ'),
      A('Ngày 3', 'みっか'),
      A('Ngày 5', 'いつか'),
      A('Ngày 20', 'はつか'),
      A('8 tuổi', 'はっさい'),
      A('20 tuổi (từ đặc biệt)', 'はたち'),
      A('Ngày 14', 'じゅうよっか'),
      A('Mấy tuổi? (hỏi)', 'なんさい'),
    ]),
    QZ('s113-b1-04-dich', 'Dịch Việt → Nhật (buổi 4)', 'translate', [
      AS('Sinh nhật của bạn là khi nào?', '{誕生日|たんじょうび}はいつですか', 'いつ'),
      AS('Sinh nhật của tôi là ngày 5 tháng 5.', '{私|わたし}の{誕生日|たんじょうび}は{5月|ごがつ}{5日|いつか}です', 'tháng trước ngày sau'),
      AS('Tôi 18 tuổi.', '{私|わたし}は{18歳|じゅうはっさい}です', 'じゅうはっさい'),
      AS('Anh Marco bao nhiêu tuổi?', 'マルコさんは{何歳|なんさい}ですか', '何歳'),
    ]),
    MC('s113-b1-04-mcq', 'Chọn đáp án (buổi 4)', [
      Q('4月 đọc là…', 'しがつ', 'よんがつ | ししがつ | しいがつ', '4月 = しがつ.'),
      Q('7月 đọc là…', 'しちがつ', 'なながつ | しつがつ | ななにち', '7月 = しちがつ.'),
      Q('5日 đọc là…', 'いつか', 'ごにち | ごか | いちか', '5日 = いつか.'),
      Q('20日 đọc là…', 'はつか', 'にじゅうにち | はたち | にじゅうか', '20日 = はつか; 20歳 = はたち.'),
      Q('8歳 đọc là…', 'はっさい', 'はちさい | やっさい | はっか', '8歳 = はっさい.'),
      Q('Hỏi ngày sinh:', '{誕生日|たんじょうび}はいつですか。', '{誕生日|たんじょうび}は{何|なん}ですか。 | {誕生日|たんじょうび}はどちらですか。 | {誕生日|たんじょうび}は{何歳|なんさい}ですか。', 'Hỏi thời điểm = いつ.'),
    ]),
    ASK([
      '「～さんは {何歳|なんさい}ですか。」/ 「{誕生日|たんじょうび}は いつですか。」 — hai câu này gần như **chắc chắn** có trong thi nói.',
      '「{二十歳|はたち}ですか。」 — cô hay cố ý hỏi tuổi 20, 18, 21 để bắt biến âm.',
      '「{何月|なんがつ}ですか。」/「{何日|なんにち}ですか。」 — bạn có thể bị hỏi tách tháng và ngày.',
    ]),
  ],
};

/* ───────────────────────── BUỔI 5 ───────────────────────── */

const S1_05: Lesson = {
  id: 's113-b1-05-so-thich',
  kind: 'grammar',
  title: 'Buổi 5 — 私の趣味: sở thích, N1 と N2, N も (theo khung lớp)',
  goal: 'Nói và hỏi sở thích, nối hai sở thích bằng と, nói "tôi cũng vậy" bằng も — tránh được ba lỗi "と／も／は" hay gặp.',
  minutes: 45,
  blocks: [
    HOC([
      'Học 10 từ sở thích bằng cách **tự chọn 2 sở thích của mình**, nói to 5 lần: 「{趣味|しゅみ}は ○○ と ○○ です」.',
      'Phân biệt rõ **と = "và" (nối danh từ)**, **も = "cũng" (thay は)**, **の = "của" (N1 bổ nghĩa N2)**.',
      'Luyện **hỏi ↔ đáp cặp đôi**: A nói sở thích, B đáp lại bằng 「～も」 hoặc 「～は？」.',
    ]),
    RECAP('Buổi 5 dạy gì?', [
      '**Từ mới**: 趣味 · スポーツ · サッカー · テニス · 水泳 · 映画 · 音楽 · 読書 · 旅行 · 料理 · 何 · あ（っ）.',
      '**ポイント 5 — N1 と N2** ("N1 và N2"): {趣味|しゅみ}は {音楽|おんがく}**と**{読書|どくしょ}です。',
      '**ポイント 6 — N も** ("N cũng"): {私|わたし}**も**{音楽|おんがく}です。 Phủ định: ワンさん**も**{学生|がくせい}じゃありません。',
      'Câu mẫu: {私|わたし}の{趣味|しゅみ}は{料理|りょうり}です。 · Câu đáp: 同じですね.',
    ]),
    H('Từng phần của buổi 5 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: các hoạt động giải trí', 'Nhìn tranh đoán từ: bóng đá, bơi lội, đọc sách, nấu ăn… Nhiều từ là katakana mượn tiếng Anh nên dễ đoán.'],
      [`**${JR('{趣味|しゅみ} は {何|なん} です か')}**`, 'Hỏi sở thích. 何 trước です đọc **なん**. Trả lời bằng danh từ: ○○です. Cô hay hỏi: 「～さんの趣味は何ですか」.'],
      [`**Từ sở thích**: ${JR('スポーツ')} · ${JR('サッカー')} · ${JR('テニス')} · ${JR('{水泳|すいえい}')} · ${JR('{映画|えいが}')} · ${JR('{音楽|おんがく}')} · ${JR('{読書|どくしょ}')} · ${JR('{旅行|りょこう}')} · ${JR('{料理|りょうり}')}`, 'Lưu ý trường âm: *supootsu*, *sakkaa*, *suiei*, *eiga*, *ongaku*, *dokusho*, *ryokoo*, *ryoori*. 料理 vừa là "nấu ăn" vừa là "món ăn".'],
      ['**N1 と N2** — ポイント 5', '**と** nối hai (hoặc nhiều) **danh từ** ngang hàng: サッカーと水泳. Chỉ nối danh từ với danh từ, không dùng để nối câu. Hai vế đứng cạnh nhau, đảo thứ tự cũng được.'],
      ['**N も** — ポイント 6', '**も** thế chỗ **は** và có nghĩa "cũng". Không bao giờ nói "は も". Chỉ dùng khi đã có thông tin giống nhau ở câu trước.'],
      ['**あ（っ）、同じですね**', 'Khi nghe bạn nói cùng sở thích: 「あっ、{私|わたし}も{音楽|おんがく}です。」 hoặc 「同じですね」 = "giống nhau nhỉ!". Phản ứng tự nhiên, cô thích.'],
      [`**${JR('{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です')}**`, 'Câu mẫu cô đưa. Có đủ 3 phần: 私 + の + 趣味 + は + (sở thích) + です.'],
      ['**Luyện cặp**: hỏi sở thích, đáp, rồi hỏi lại', 'A hỏi B, B đáp (1 hoặc 2 sở thích bằng と), rồi B hỏi lại A. Nếu trùng thì dùng も.'],
    ]),
    H('Từ mới của buổi 5'),
    VOC([
      VO('{趣味|しゅみ}', 'danh từ', 'sở thích', '{趣味|しゅみ} は {何|なん} です か。', 'Sở thích của bạn là gì?'),
      VO('スポーツ', 'danh từ', 'thể thao', '^ニシカワ-さん の {趣味|しゅみ} は スポーツ です。', 'Sở thích của anh Nishikawa là thể thao.'),
      VO('サッカー', 'danh từ', 'bóng đá', '^マルコ-さん の {趣味|しゅみ} は サッカー です。', 'Sở thích của Marco là bóng đá.'),
      VO('テニス', 'danh từ', 'tennis (quần vợt)', '{私|わたし} の {趣味|しゅみ} は テニス です。', 'Sở thích của tôi là tennis.'),
      VO('{水泳|すいえい}', 'danh từ', 'bơi lội', '^パク-さん の {趣味|しゅみ} は {水泳|すいえい} です。', 'Sở thích của Park là bơi lội.'),
      VO('{映画|えいが}', 'danh từ', 'phim, điện ảnh', '{趣味|しゅみ} は {映画|えいが} です。', 'Sở thích của tôi là xem phim.'),
      VO('{音楽|おんがく}', 'danh từ', 'âm nhạc', '^メアリー-さん の {趣味|しゅみ} は {音楽|おんがく} です。', 'Sở thích của Mary là âm nhạc.'),
      VO('{読書|どくしょ}', 'danh từ', 'đọc sách', '^ワン-さん の {趣味|しゅみ} は {読書|どくしょ} です。', 'Sở thích của Wan là đọc sách.'),
      VO('{旅行|りょこう}', 'danh từ', 'du lịch', '{私|わたし} の {趣味|しゅみ} は {旅行|りょこう} と {映画|えいが} です。', 'Sở thích của tôi là du lịch và phim.'),
      VO('{料理|りょうり}', 'danh từ', 'nấu ăn; món ăn', '^ナタポン-さん の {趣味|しゅみ} は {料理|りょうり} です。', 'Sở thích của Natapon là nấu ăn.'),
      VO('{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です。', 'câu', 'Sở thích của tôi là nấu ăn.', '{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です。 ^ワン-さん は？', 'Sở thích của tôi là nấu ăn. Còn Wan?'),
      VO('{何|なん}', 'từ để hỏi', 'cái gì (trước です đọc なん)', '^アンナ-さん の {趣味|しゅみ} は {何|なん} です か。', 'Sở thích của Anna là gì?'),
      VO('{同|おな}じ です ね', 'câu', 'giống nhau nhỉ!', '{私|わたし} の {趣味|しゅみ} も {映画|えいが} です。 ── {同|おな}じ です ね。', 'Sở thích của tôi cũng là phim. ── Giống nhau nhỉ.'),
    ]),
    H('Ngữ pháp buổi 5 — ポイント 5 (と) và 6 (も)'),
    PAT([
      {
        formula: 'N1 と N2',
        vi: 'N1 và N2 (nối danh từ ngang hàng).',
        examples: [
          E('{趣味|しゅみ} は サッカー と {水泳|すいえい} です。', 'Sở thích là bóng đá và bơi lội.'),
          E('^ワン-さん と ^パク-さん は {学生|がくせい} です。', 'Wan và Park là sinh viên.'),
          E('{旅行|りょこう} と {料理|りょうり} です。', 'Du lịch và nấu ăn.'),
        ],
      },
      {
        formula: 'N も ～です／～じゃありません。',
        vi: 'N cũng là… (thay は bằng も).',
        examples: [
          E('^ワン-さん は {学生|がくせい} です。 ^パク-さん も {学生|がくせい} です。', 'Wan là sinh viên. Park cũng là sinh viên.'),
          E('{私|わたし} も {音楽|おんがく} です。', 'Tôi cũng là âm nhạc. (tức là: sở thích của tôi cũng là âm nhạc)'),
          E('^マルコ-さん も {会社員|かいしゃいん} じゃ ありません。', 'Marco cũng không phải nhân viên công ty.'),
        ],
      },
    ]),
    RULE('N1 と N2 ／ N も', 'と nối hai danh từ; も thay chỗ của は khi nói "cũng".'),
    DLG('Hội thoại mẫu buổi 5 — cùng sở thích', [
      D('ワン', 'f', '^マルコ-さん の {趣味|しゅみ} は {何|なん} です か。', 'Sở thích của anh Marco là gì?'),
      D('マルコ', 'm', 'サッカー と {映画|えいが} です。 ^ワン-さん は？', 'Bóng đá và phim. Còn chị Wan?'),
      D('ワン', 'f', '{私|わたし} は {映画|えいが} と {音楽|おんがく} です。', 'Tôi là phim và âm nhạc.'),
      D('マルコ', 'm', 'あっ、 {映画|えいが} も {同|おな}じ です ね。', 'A, phim cũng giống nhau nhỉ.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 5', [
      '~~サッカーも水泳です~~ (muốn nói "bóng đá và bơi lội") → **サッカーと水泳です**. も = cũng, không phải và.',
      '~~私はも学生です~~ / ~~私もは学生です~~ → も **thay chỗ** của は: **私も学生です**.',
      '~~ワンさんの趣味はも音楽です~~ → viết một trợ từ thôi: **ワンさんの趣味も音楽です** (sở thích của Wan cũng là âm nhạc).',
      'Được hỏi 「趣味はサッカーと水泳ですか」 mà chỉ đúng một thứ → đừng はい chung chung; nói rõ thứ đúng: **いいえ、サッカーとテニスです**.',
      'Dùng と nối hai **câu**: ~~私は学生ですと、先生です~~ → と chỉ nối danh từ.',
    ]),
    NOTE('Cách nhớ', [
      '**と = dấu cộng (+)**, **も = dấu "bằng" (=)**, **の = dấu sở hữu ( \' )**.',
      '**も đứng đúng chỗ に は đứng**: có も thì không có は ở chỗ đó.',
      'Phủ định của câu có も vẫn dùng **じゃありません**: ワンさんも学生じゃありません.',
    ]),
    QZ('s113-b1-05-dich', 'Dịch Việt → Nhật (buổi 5)', 'translate', [
      AS('Sở thích của tôi là nấu ăn.', '{私|わたし}の{趣味|しゅみ}は{料理|りょうり}です'),
      AS('Sở thích của Marco là bóng đá và bơi lội.', 'マルコさんの{趣味|しゅみ}はサッカーと{水泳|すいえい}です', 'と'),
      AS('Sở thích của bạn là gì?', '{趣味|しゅみ}は{何|なん}ですか', '何'),
      AS('Tôi cũng là sinh viên.', '{私|わたし}も{学生|がくせい}です', 'も'),
      AS('Wan cũng không phải nhân viên công ty.', 'ワンさんも{会社員|かいしゃいん}じゃありません', 'も … じゃありません'),
    ]),
    MC('s113-b1-05-mcq', 'Chọn đáp án (buổi 5)', [
      Q('「{趣味|しゅみ}は {音楽|おんがく}（　）{読書|どくしょ}です」 (nối hai sở thích)', 'と', 'も | の | は', 'Nối danh từ = と.'),
      Q('「ワンさんは {学生|がくせい}です。パクさん（　）{学生|がくせい}です」', 'も', 'と | の | が', 'Cũng = も.'),
      Q('「{何|なん}」 trong 「{趣味|しゅみ}は{何|なん}ですか」 hỏi về…', 'Sở thích (cái gì)', 'Thời gian | Tên người | Địa điểm', '何 hỏi vật/việc.'),
      Q('Chọn câu SAI:', '{私|わたし}の{趣味|しゅみ}はサッカーも{水泳|すいえい}です。(muốn nói "và")', '{私|わたし}の{趣味|しゅみ}はサッカーと{水泳|すいえい}です。 | {私|わたし}も{水泳|すいえい}です。 | {同|おな}じですね。', 'Nối hai danh từ phải là と.'),
      Q('Nghe bạn nói cùng sở thích, câu phản ứng tự nhiên là…', '{同|おな}じですね。', 'そうじゃありません。 | はじめまして。 | こちらこそ。', '同じですね = giống nhau nhỉ.'),
      Q('「{料理|りょうり}」 đọc là…', 'りょうり', 'りょり | りょーり | れうり', 'りょ là âm ghép, う kéo dài: *ryoori*.'),
    ]),
    ASK([
      '「～さんの{趣味|しゅみ}は {何|なん}ですか。」 — câu cuối cùng cô hay hỏi để mở rộng: 「～と～ですか」.',
      '「～さんもサッカーですか。」 — nếu giống thì **「はい、{私|わたし}もサッカーです」**; nếu khác thì **「いいえ、テニスです」**.',
      '「{趣味|しゅみ}は サッカーと {水泳|すいえい}ですか。」 — hỏi dạng liệt kê, nghe kỹ có hai thứ.',
    ]),
  ],
};

/* ───────────────────────── BUỔI 6 ───────────────────────── */

const S1_06: Lesson = {
  id: 's113-b1-06-tong-hop-noi-han',
  kind: 'review',
  title: 'Buổi 6 — できる!: tự giới thiệu đủ 6 ポイント, chữ Hán lớp Bài 1, khuôn thi nói (theo khung lớp)',
  goal: 'Nói trôi một bài tự giới thiệu 7 câu, giới thiệu bạn cho người khác, đọc to không furigana, nắm khuôn đề nói JPD113 Bài 1.',
  minutes: 60,
  blocks: [
    HOC([
      'Buổi tổng kết: **đọc to bài mẫu 3 lần → thay thông tin của bạn → thu âm lần 1 → nghe lại → thu lần 2**.',
      'Đọc thật to và thu âm giúp bạn nghe được chỗ vấp. Chấm theo checklist ở cuối buổi.',
      'Phần chữ Hán: chỉ cần **nhận mặt + đọc đúng trong từ** (日本人 · 学生 · 日本語 · 会社員…). Chữ Hán lớp Bài 1 là danh sách dự kiến.',
    ]),
    RECAP('Buổi 6 dạy gì?', [
      '**できる!** — tự giới thiệu hoàn chỉnh dùng đủ ポイント 1–6, hỏi lại bạn, rồi giới thiệu bạn cho người thứ ba.',
      '**Khuôn đề thi nói JPD113 Bài 1**: Reading 40 điểm, 3 câu có tranh (15 điểm mỗi câu), 1 câu không tranh (10 điểm), chào khi vào/ra (5 điểm).',
      '**Chữ Hán lớp (dự kiến)**: 日 本 人 学 生 語 何 私 英 員.',
      'Câu hỏi không tranh trong file "Luyện nói" của cô Huyền: 学生ですか · 会社員ですか · お国は · お仕事は · 何歳 · 誕生日 · ベトナム人ですか · 日本人ですか · 趣味は · 趣味はサッカーと水泳ですか.',
    ]),
    H('A. Bài tự giới thiệu mẫu — 7 câu, đủ 6 ポイント'),
    EXS([
      E('はじめまして。', 'Rất vui được gặp.'),
      E('{私|わたし} は ^ワン です。', 'Tôi là Wan. (ポイント 1)'),
      E('{中国人|ちゅうごくじん} です。', 'Tôi là người Trung Quốc.'),
      E('ふじみ-{大学|だいがく} の {学生|がくせい} です。', 'Tôi là sinh viên ĐH Fujimi. (ポイント 4)'),
      E('{二十歳|はたち} です。 {誕生日|たんじょうび} は {3月|さんがつ} {21日|にじゅういちにち} です。', 'Tôi 20 tuổi. Sinh nhật là ngày 21 tháng 3. (ポイント 3)'),
      E('{趣味|しゅみ} は {読書|どくしょ} と {映画|えいが} です。', 'Sở thích của tôi là đọc sách và phim. (ポイント 5)'),
      E('どうぞ よろしく お{願|ねが}い します。', 'Mong được giúp đỡ.'),
    ]),
    NOTE('Cách thay thông tin của bạn', [
      '**Tên**: viết bằng katakana (Cường → クオン, Linh → リン, Minh → ミン, Hoa → ホア).',
      '**Nước**: ベトナム人です (bỏ 私は để câu gọn).',
      '**Trường**: ○○大学の学生です (FPT大学 đọc エフピーティーだいがく).',
      '**Tuổi/Sinh nhật**: dùng bảng ở buổi 4.',
      '**Sở thích**: một hoặc hai (と).',
    ]),
    DLG('B. Hội thoại hỏi–đáp có も (ポイント 6)', [
      D('パク', 'f', 'はじめまして。 ^パク です。 {韓国人|かんこくじん} です。 {大学|だいがく} の {学生|がくせい} です。', 'Rất vui được gặp. Tôi là Park. Người Hàn Quốc. Là sinh viên đại học.'),
      D('ワン', 'f', 'はじめまして。 ^ワン です。 {中国人|ちゅうごくじん} です。 {私|わたし} も {大学|だいがく} の {学生|がくせい} です。', 'Rất vui được gặp. Tôi là Wan. Người Trung Quốc. Tôi cũng là sinh viên đại học.'),
      D('パク', 'f', '{趣味|しゅみ} は {何|なん} です か。', 'Sở thích của bạn là gì?'),
      D('ワン', 'f', '{音楽|おんがく} と {料理|りょうり} です。 ^パク-さん は？', 'Âm nhạc và nấu ăn. Còn Park?'),
      D('パク', 'f', '{私|わたし} も {音楽|おんがく} です。 {同|おな}じ です ね。', 'Tôi cũng là âm nhạc. Giống nhau nhỉ.'),
    ]),
    H('C. Giới thiệu người thứ ba'),
    EXS([
      E('こちら は ^パク-さん です。', 'Đây là bạn Park. (こちら: học kỹ ở Bài 2)'),
      E('^パク-さん は {韓国人|かんこくじん} です。', 'Park là người Hàn Quốc.'),
      E('{大学|だいがく} の {学生|がくせい} です。 {趣味|しゅみ} は {水泳|すいえい} です。', 'Là sinh viên đại học. Sở thích là bơi lội.'),
    ]),
    NOTE('Khi giới thiệu người khác, dùng さん', [
      'Giới thiệu bạn: 「**パクさん**は韓国人です」. Giới thiệu mình: 「**私**は…」 không có さん.',
      'Không dùng お{名前|なまえ}／お{国|くに}／お{仕事|しごと} khi nói về người thứ ba (お chỉ khi nói với người đối diện).',
    ]),
    H('D. Chữ Hán lớp Bài 1 (dự kiến)'),
    TABLE(
      ['Chữ', 'Đọc', 'Hán Việt', 'Từ thường gặp trong Bài 1'],
      [
        ['日', 'にち・ひ', 'nhật', `${JR('{日本|にほん}')} · ${JR('〜{日|にち}')}`],
        ['本', 'ほん', 'bản', `${JR('{日本|にほん}')} · ${JR('{日本人|にほんじん}')}`],
        ['人', 'じん・ひと', 'nhân', `${JR('{日本人|にほんじん}')} · ${JR('{中国人|ちゅうごくじん}')}`],
        ['学', 'がく', 'học', `${JR('{学生|がくせい}')} · ${JR('{大学|だいがく}')} · ${JR('{日本語学校|にほんごがっこう}')}`],
        ['生', 'せい', 'sinh', `${JR('{学生|がくせい}')} · ${JR('{先生|せんせい}')} · ${JR('{誕生日|たんじょうび}')}`],
        ['語', 'ご', 'ngữ', `${JR('{日本語|にほんご}')} · ${JR('{英語|えいご}')}`],
        ['何', 'なん・なに', 'hà', `${JR('{何|なん} です か')} · ${JR('{何歳|なんさい}')}`],
        ['私', 'わたし', 'tư', `${JR('{私|わたし} は ^ワン です')}`],
        ['英', 'えい', 'anh', `${JR('{英語|えいご}')}`],
        ['員', 'いん', 'viên', `${JR('{会社員|かいしゃいん}')} · ${JR('{社員|しゃいん}')}`],
      ],
      'Danh sách dự kiến — sẽ sửa khi có chữ Hán thật cô dạy',
    ),
    { t: 'hanlop', bai: 1 },
    H('E. Khuôn đề thi nói JPD113 — Bài 1'),
    TABLE(
      ['Phần', 'Điểm', 'Làm gì', 'Bài 1 dùng ở đâu'],
      [
        ['Reading', '40', 'Chuẩn bị 30 giây, đọc to một đoạn tự giới thiệu', 'Đoạn như "はじめまして。私はアンナです。ちゅうごくじんです…"'],
        ['Talking — có tranh', '3 × 15', 'Giám thị chỉ thẻ nhân vật, hỏi 3 câu', 'Thẻ: tên, nước, tuổi, ngày sinh, nghề, sở thích'],
        ['Talking — không tranh', '1 × 10', 'Giám thị hỏi 1 câu về bạn', 'Tên, nước, nghề, tuổi, sinh nhật, sở thích'],
        ['Presenting', '5', 'Chào khi vào và trước khi ra', 'しつれいします · はじめまして · ありがとうございました'],
      ],
    ),
    READK('s113-b1-06-doc', 'Đọc to KHÔNG furigana (tự chấm: đọc → bấm xem cách đọc)', 'Mỗi dòng: đọc to cả câu, rồi bấm để xem đáp án.', [
      RK('はじめまして。 {私|わたし} は ^アンナ です。', 'Rất vui được gặp. Tôi là Anna.'),
      RK('{中国人|ちゅうごくじん} です。', 'Tôi là người Trung Quốc.'),
      RK('ふじみ-{大学|だいがく} の {学生|がくせい} です。', 'Tôi là sinh viên ĐH Fujimi.'),
      RK('{二十歳|はたち} です。 {誕生日|たんじょうび} は {5月|ごがつ} {5日|いつか} です。', 'Tôi 20 tuổi. Sinh nhật ngày 5 tháng 5.'),
      RK('{趣味|しゅみ} は {読書|どくしょ} と {映画|えいが} です。', 'Sở thích của tôi là đọc sách và phim.'),
      RK('どうぞ よろしく お{願|ねが}い します。', 'Mong được giúp đỡ.'),
    ]),
    SPEAK('s113-b1-06-noi', [
      'おなまえは なんですか。',
      'おくには どちらですか。',
      'おしごとは？',
      'なんさいですか。',
      'たんじょうびは いつですか。',
      'しゅみは なんですか。',
    ]),
    NOTE('Checklist tự chấm sau khi thu âm', [
      '☐ Đủ 7 câu theo khuôn: chào – tên – nước – trường – tuổi/sinh nhật – sở thích – kết lời.',
      '☐ **Không** có さん sau tên mình. ☐ は đọc *wa*. ☐ Trợ từ đúng (は・の・と).',
      '☐ Tháng 4/7/9 và ngày 1–10, tuổi 1/8/10/20 đọc đúng.',
      '☐ Mỗi câu hỏi trả lời **câu đầy đủ**, không im quá 10 giây.',
    ]),
    QZ('s113-b1-06-dich', 'Dịch Việt → Nhật (tổng hợp)', 'translate', [
      AS('Rất vui được gặp. Tôi là Anna.', 'はじめまして。{私|わたし}はアンナです', ''),
      AS('Tôi là người Nga. Tôi là sinh viên ĐH Fujimi.', ['ロシア{人|じん}です。ふじみ{大学|だいがく}の{学生|がくせい}です', '{私|わたし}はロシア{人|じん}です。ふじみ{大学|だいがく}の{学生|がくせい}です'], ''),
      AS('Sinh nhật của tôi là ngày 21 tháng 3.', '{私|わたし}の{誕生日|たんじょうび}は{3月|さんがつ}{21日|にじゅういちにち}です', ''),
      AS('Sở thích của tôi là đọc sách và nấu ăn.', '{私|わたし}の{趣味|しゅみ}は{読書|どくしょ}と{料理|りょうり}です', ''),
    ]),
    ASK([
      'Reading: cô chọn một đoạn tự giới thiệu giống bài mẫu — đọc **liền mạch**, đúng ngắt nghỉ, không đọc từng chữ.',
      'Câu có tranh: cô chỉ thẻ nhân vật (người Nhật 30 tuổi, người Brazil 41 tuổi…) → bạn nói đủ tên, nước, nghề, tuổi, sinh nhật, sở thích của nhân vật đó.',
      'Cuối buổi thi: 「ありがとうございました。しつれいします。」 — đừng quên, đó là điểm Presenting.',
    ]),
  ],
};

export const JP113_B1: Lesson[] = [S1_00, S1_01, S1_02, S1_03, S1_04, S1_05, S1_06];

/* ═══════════════════════════════════════════════════════════════════
 *                BÀI 2 — BUỔI HỌC THEO KHUNG LỚP
 * ═══════════════════════════════════════════════════════════════════ */

const S2_00: Lesson = {
  id: 's113-b2-00-doc-truoc',
  kind: 'intro',
  title: 'Bài 2 どこですか・いくらですか — Đọc trước: bài này soạn theo khung lớp (không phải slide thật của cô) + lộ trình 6 buổi',
  goal: 'Biết Bài 2 gồm những buổi nào, cần thuộc gì (82 từ, 9 ポイント, số và giá tiền) và làm gì để mua đồ, hỏi giá, gọi món bằng tiếng Nhật.',
  minutes: 15,
  blocks: [
    HOC([
      'Mỗi buổi: **Tóm tắt → bảng từng phần → từ mới → ngữ pháp + ví dụ → hội thoại → lỗi hay mắc → bài luyện → "cô hay hỏi gì"**. Đọc to mọi câu.',
      'Bài 2 **nhiều từ mới nhất** (82). Mỗi buổi chỉ học một nhóm từ gắn với một tình huống (toà nhà – đồ vật – giá – siêu thị – nhà hàng – đồ bỏ quên). Đừng học danh sách từ khô.',
      'Mọi câu đều có **romaji**. Số và giá tiền là phần mất điểm nhiều nhất — dành ít nhất một buổi (buổi 3) để đọc to thật chậm.',
      'Xong 6 buổi, làm bộ **Luyện thêm Bài 2** (`lt-b2-…`): 🟢 Dễ → 🟡 Vừa → 🔴 Khó, 8 kỹ năng.',
    ]),
    NOTE('Trung thực về nguồn của bài này', [
      HONEST,
      'Từ mới là danh sách "Từ mới bài 2" của cô (82 mục). Khuôn hỏi–đáp thi nói Bài 2 bám file "Luyện nói" của cô Huyền (câu hỏi về thư viện, siêu thị, 100円ショップ, くつ屋, トイレ; thẻ nhân vật có nước và giá).',
      'Toà nhà **ひかりデパート** và các cửa hàng trong bài là tự đặt để luyện, không phải sơ đồ trong sách hay trong đề.',
      'Chữ Hán lớp Bài 2 là **danh sách dự kiến** (xem `b2-han-lop`): 一 二 三 四 五 六 七 八 九 十 百 千 万 円.',
    ]),
    RECAP('Bài 2 dạy gì? — mục tiêu hành động', [
      '**どこですか**: hỏi chỗ trong toà nhà, tầng mấy, đi lối nào.',
      '**いくらですか**: hỏi giá, nghe và nói giá bằng yên (kể cả hàng chục nghìn yên).',
      '**〜をください**: mua đồ, gọi món (kể cả số lượng).',
      '**Chín điểm ngữ pháp** (ポイント 7–15): これ/それ/あれ · この/その/あの N · ここ/そこ/あそこ/どこ · N を (〜つ) ください · いくら · 何の N · どこの N · 誰の N · N(〜語)で.',
    ]),
    H('Lộ trình 6 buổi'),
    TABLE(
      ['Buổi', 'Lesson', 'Học gì', 'Ngữ pháp'],
      [
        ['1', '`s113-b2-01-…`', 'Chỉ nơi chốn, toà nhà, tầng, hỏi đường trong cửa hàng', 'ポイント 9'],
        ['2', '`s113-b2-02-…`', 'Chỉ đồ vật gần/xa; đồ dùng, đồ điện tử, quần áo', 'ポイント 7, 8'],
        ['3', '`s113-b2-03-…`', 'Số, giá tiền, いくら, じゃ', 'ポイント 11'],
        ['4', '`s113-b2-04-…`', 'Siêu thị; mua đồ; đếm 〜つ', 'ポイント 10'],
        ['5', '`s113-b2-05-…`', 'Nhà hàng; gọi món; món gì, nước nào', 'ポイント 12, 13'],
        ['6', '`s113-b2-06-…`', 'Của ai, tiếng gì + tổng hợp + chữ Hán lớp + khuôn thi nói', 'ポイント 14, 15'],
      ],
    ),
    H('Bốn câu "chìa khoá" của Bài 2 — thuộc ngay buổi đầu'),
    EXS([
      E('トイレ は どこ です か。 ── あそこ です。', 'Nhà vệ sinh ở đâu? ── Ở đằng kia.'),
      E('これ は いくら です か。 ── {300円|さんびゃくえん} です。', 'Cái này bao nhiêu tiền? ── 300 yên.'),
      E('コーヒー を {二|ふた}つ ください。', 'Cho tôi hai cà phê.'),
      E('「ペン」 は {日本語|にほんご} で {何|なん} です か。', '"Pen" tiếng Nhật là gì?'),
    ]),
    MC('s113-b2-00-test', 'Tự kiểm tra đầu vào (6 câu)', [
      Q('Hỏi "Nhà vệ sinh ở đâu?"', 'トイレはどこですか。', 'トイレはいくらですか。 | トイレはだれですか。 | トイレはなんですか。', 'Hỏi nơi = どこ.'),
      Q('Hỏi giá tiền dùng…', 'いくら', 'どこ | だれ | なん', 'いくら = bao nhiêu tiền.'),
      Q('「300円」 đọc là…', 'さんびゃくえん', 'さんひゃくえん | さんぜんえん | みっつえん', '300 = さんびゃく (biến âm).'),
      Q('「ケーキを二つください」 — 二つ đọc là…', 'ふたつ', 'につ | ふたっつ | ににつ', '〜つ có cách đọc riêng.'),
      Q('Chỉ cái ở xa cả hai người:', 'あれ', 'これ | それ | どれ', 'あれ = cái kia (xa cả hai).'),
      Q('「3階」 đọc là…', 'さんがい', 'さんかい | みっかい | さんがく', '3階 = さんがい.'),
    ]),
  ],
};

/* ───────────────────────── BUỔI 1 ───────────────────────── */

const S2_01: Lesson = {
  id: 's113-b2-01-noi-chon-toa-nha',
  kind: 'grammar',
  title: 'Buổi 1 — どこですか: chỉ nơi chốn, toà nhà mua sắm, tầng mấy (theo khung lớp)',
  goal: 'Hỏi và chỉ chỗ bằng ここ/そこ/あそこ/どこ (và こちら…), nói tầng bằng 〜階, đọc tên các nơi trong toà nhà.',
  minutes: 45,
  blocks: [
    HOC([
      'Vẽ nhanh sơ đồ **ひかりデパート** (bảng bên dưới) ra giấy, rồi tự hỏi–đáp: 「トイレはどこですか」→ nhìn sơ đồ trả lời.',
      'Đếm tầng thành tiếng: **いっかい・にかい・さんがい・よんかい・ごかい**, tầng hầm **ちかいっかい**.',
      'Làm bài luyện cuối buổi; để ý phần "sai ở đâu".',
    ]),
    NOTE('Nhắc lại', [HONEST]),
    RECAP('Buổi 1 dạy gì?', [
      'Mở đầu Bài 2 「どこですか」: tình huống hỏi chỗ trong toà nhà mua sắm.',
      '**Từ mới**: ここ/そこ/あそこ (và こちら/そちら/あちら) · どこ · インフォメーション · ATM · エスカレーター · エレベーター · きつえんじょ · トイレ · レジ · きっさてん · スーパー · 100円ショップ · レストラン · 地下 · 〜階 · 〜屋 · 店員 · いらっしゃいませ · ありがとうございます.',
      '**ポイント 9**: N は どこですか／何階ですか。 → N は ここ／そこ／あそこ／〜階です。',
    ]),
    H('Sơ đồ ひかりデパート (tự đặt để luyện)'),
    TABLE(
      ['Tầng', 'Đọc', 'Có gì'],
      [
        ['5階', 'ごかい', 'レストラン · きつえんじょ'],
        ['4階', 'よんかい', 'カメラ屋 (cửa hàng máy ảnh)'],
        ['3階', 'さんがい', '100円ショップ · トイレ'],
        ['2階', 'にかい', '本屋 · くつ屋'],
        ['1階', 'いっかい', 'インフォメーション · ATM · きっさてん'],
        ['地下1階', 'ちかいっかい', 'スーパー · レジ'],
      ],
      'エレベーターとエスカレーターは 1階から 5階まで',
    ),
    H('Từng phần của buổi 1 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Mục tiêu hành động**: hỏi chỗ và biết ai đứng ở đâu', 'Cả bài đi dần từ "ở đâu" → "cái gì" → "bao nhiêu tiền". Buổi 1 chỉ học "ở đâu".'],
      ['**Tranh mở**: sơ đồ toà nhà có biểu tượng', 'Nhìn tranh, nói tên nơi: トイレ, エレベーター, ATM… Phần lớn là katakana nên đọc theo âm tiếng Anh.'],
      [`**Ba chỗ cố định**: ${JR('ここ')} · ${JR('そこ')} · ${JR('あそこ')}`, '**ここ** = chỗ này (gần người nói). **そこ** = chỗ đó (gần người nghe). **あそこ** = chỗ kia (xa cả hai). Hỏi: **どこ**.'],
      [`**Ba hướng lịch sự**: ${JR('こちら')} · ${JR('そちら')} · ${JR('あちら')} (hỏi: ${JR('どちら')})`, 'Nghĩa gốc là "phía này/đó/kia/nào" nhưng nhân viên cửa hàng dùng thay ここ… cho lịch sự: 「トイレは**あちら**です」. Bài 1 bạn đã gặp どちら.'],
      [`**N は どこ ですか**  ${JR('トイレ は どこ です か')}`, 'Cấu trúc hỏi nơi: đồ vật cần tìm đứng trước は, どこ ở chỗ đáp. Đáp: **N は あそこ です**.'],
      [`**〜{階|かい}**: ${JR('{3階|さんがい}')} · ${JR('{地下|ちか} {1階|いっかい}')}`, 'Hỏi tầng: **何階** *nangai*. Đọc đúng: 1階 いっかい · 3階 **さんがい** · 4階 よんかい · 6階 ろっかい · 地下 = ちか (tầng hầm).'],
      [`**〜{屋|や}**: ${JR('{本屋|ほんや}')} · ${JR('くつ-{屋|や}')}`, '〜屋 = cửa hàng chuyên bán ~. 本屋 hiệu sách, くつ屋 cửa hàng giày, ケーキ屋 tiệm bánh. Nhân viên bán hàng là **店員** (*tenin*).'],
      [`**Câu của nhân viên**: ${JR('いらっしゃいませ')} · ${JR('（どうも）ありがとう ございます')}`, '**いらっしゃいませ** = chào mừng quý khách (bạn chỉ nghe, không cần đáp). **ありがとうございます** = cảm ơn. Khách thường đáp bằng gật đầu hoặc すみません.'],
      ['**Luyện cặp**: A hỏi chỗ, B nhìn sơ đồ đáp', 'Luyện cả hai kiểu: 「Nはどこですか」 (đáp ここ/そこ/あそこ) và 「Nは何階ですか」 (đáp ○階).'],
    ]),
    H('Từ mới của buổi 1'),
    VOC([
      VO('ここ ／ こちら', 'chỉ nơi', 'chỗ này ／ phía này', 'ここ は レストラン です。', 'Đây là nhà hàng.'),
      VO('そこ ／ そちら', 'chỉ nơi', 'chỗ đó ／ phía đó', 'そこ は きっさてん です。', 'Chỗ đó là quán giải khát.'),
      VO('あそこ ／ あちら', 'chỉ nơi', 'chỗ kia ／ phía kia', 'ATM は あそこ です。', 'ATM ở đằng kia.'),
      VO('どこ', 'từ để hỏi', 'ở đâu, nơi nào', 'トイレ は どこ です か。', 'Nhà vệ sinh ở đâu?'),
      VO('インフォメーション', 'danh từ', 'quầy thông tin', 'インフォメーション は {1階|いっかい} です。', 'Quầy thông tin ở tầng 1.'),
      VO('ATM', 'danh từ', 'máy rút tiền tự động', 'ATM は {1階|いっかい} です。', 'ATM ở tầng 1.'),
      VO('エスカレーター', 'danh từ', 'thang cuốn', 'エスカレーター は あそこ です。', 'Thang cuốn ở đằng kia.'),
      VO('エレベーター', 'danh từ', 'thang máy', 'エレベーター は あちら です。', 'Thang máy ở phía kia.'),
      VO('きつえんじょ', 'danh từ', 'nơi hút thuốc', 'きつえんじょ は {5階|ごかい} です。', 'Chỗ hút thuốc ở tầng 5.'),
      VO('トイレ', 'danh từ', 'nhà vệ sinh', 'トイレ は {3階|さんがい} です。', 'Nhà vệ sinh ở tầng 3.'),
      VO('レジ', 'danh từ', 'quầy thu ngân', 'レジ は どこ です か。', 'Quầy thu ngân ở đâu?'),
      VO('きっさてん', 'danh từ', 'quán giải khát', 'きっさてん は {1階|いっかい} です。', 'Quán giải khát ở tầng 1.'),
      VO('スーパー', 'danh từ', 'siêu thị', 'スーパー は {地下|ちか} {1階|いっかい} です。', 'Siêu thị ở tầng hầm 1.'),
      VO('{100円|ひゃくえん}-ショップ', 'danh từ', 'cửa hàng 100 yên', '{100円|ひゃくえん}-ショップ は {3階|さんがい} です。', 'Cửa hàng 100 yên ở tầng 3.'),
      VO('レストラン', 'danh từ', 'nhà hàng, quán ăn', 'レストラン は {5階|ごかい} です。', 'Nhà hàng ở tầng 5.'),
      VO('{地下|ちか}', 'danh từ', 'ngầm, dưới lòng đất (tầng hầm)', 'スーパー は {地下|ちか} です。', 'Siêu thị ở dưới tầng hầm.'),
      VO('〜{階|かい}', 'hậu tố', 'tầng ~', '{本屋|ほんや} は {2階|にかい} です。', 'Hiệu sách ở tầng 2.', 'Chú ý: 1階 いっかい · 3階 さんがい.'),
      VO('〜{屋|や}', 'hậu tố', 'cửa hàng ~, hiệu ~', 'くつ-{屋|や} は {2階|にかい} です。', 'Cửa hàng giày ở tầng 2.'),
      VO('{店員|てんいん}', 'danh từ', 'nhân viên bán hàng', '{店員|てんいん} は あちら です。', 'Nhân viên bán hàng ở phía kia.'),
      VO('いらっしゃいませ', 'câu chào', 'kính chào quý khách', 'いらっしゃいませ。', 'Kính chào quý khách.'),
      VO('（どうも）ありがとう ございます', 'câu', 'xin cảm ơn (nhiều)', 'ありがとう ございます。', 'Xin cảm ơn.'),
    ]),
    H('Ngữ pháp buổi 1 — ポイント 9'),
    PAT([
      {
        formula: 'N は どこ ですか。 ── N は ここ／そこ／あそこ です。',
        vi: 'Hỏi nơi và trả lời bằng chỗ chỉ định.',
        examples: [
          E('エレベーター は どこ です か。', 'Thang máy ở đâu?'),
          E('あそこ です。', 'Ở đằng kia.'),
          E('レジ は あちら です。', 'Quầy thu ngân ở phía kia ạ.'),
        ],
      },
      {
        formula: 'N は 何階 ですか。 ── N は 〜階 です。',
        vi: 'Hỏi tầng và trả lời bằng số tầng.',
        examples: [
          E('{本屋|ほんや} は {何階|なんがい} です か。', 'Hiệu sách ở tầng mấy?'),
          E('{本屋|ほんや} は {2階|にかい} です。', 'Hiệu sách ở tầng 2.'),
        ],
      },
      {
        formula: 'ここ／そこ／あそこ は N です。',
        vi: 'Giới thiệu nơi chốn: "Đây/đó/kia là N".',
        examples: [
          E('ここ は レストラン です。', 'Đây là nhà hàng.'),
          E('あそこ は ATM です。', 'Đằng kia là ATM.'),
        ],
      },
    ]),
    RULE('N は どこ／何階 ですか', 'Thứ cần tìm đặt trước は; từ để hỏi đứng cuối ngay trước です.'),
    DLG('Hội thoại mẫu buổi 1 — hỏi chỗ ở ひかりデパート', [
      D('客', 'm', 'あのう、 すみません。 トイレ は どこ です か。', 'À, xin lỗi. Nhà vệ sinh ở đâu ạ?'),
      D('店員', 'f', 'いらっしゃいませ。 トイレ は {3階|さんがい} です。', 'Kính chào quý khách. Nhà vệ sinh ở tầng 3 ạ.'),
      D('客', 'm', 'エレベーター は どこ です か。', 'Thang máy ở đâu ạ?'),
      D('店員', 'f', 'エレベーター は あちら です。', 'Thang máy ở phía kia ạ.'),
      D('客', 'm', 'そう です か。 どうも ありがとう ございます。', 'Vậy ạ. Xin cảm ơn.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 1', [
      '~~さんかい~~ → **さんがい**; ~~いちかい~~ → **いっかい**; ~~ろくかい~~ → **ろっかい**.',
      '~~トイレはどこにですか~~ → không có に: **トイレはどこですか**.',
      'Hỏi 「どこ」 mà trả lời **giá tiền** hay **đồ vật** → mất điểm. Hỏi nơi = đáp nơi.',
      'Nhầm **そこ** với **あそこ**: そこ gần NGƯỜI NGHE, あそこ xa cả hai.',
      '「ここは レストランです」 thành 「ここのレストランです」: sai nghĩa (đây là nhà hàng ≠ nhà hàng của chỗ này).',
      'Đọc 〜屋 là ~~おく~~ → phải **や**.',
    ]),
    NOTE('Cách nhớ', [
      '**こ・そ・あ・ど** là bốn "đứa em": ここ/そこ/あそこ/どこ, これ/それ/あれ/どれ, この/その/あの/どの. Học một bộ là biết cả ba. Quy tắc: **こ gần tôi, そ gần bạn, あ xa cả hai, ど là hỏi**.',
      'Tầng đọc **-kai** nhưng 3 và (nhiều khi) 6 đổi: **san-gai**, **rok-kai**. Nhớ 3 là "bất thường".',
      '**店員 (tenin)** — chữ 員 bạn sẽ học ở chữ Hán Bài 1 (会社員).',
    ]),
    QZ('s113-b2-01-dich', 'Dịch Việt → Nhật (buổi 1)', 'translate', [
      AS('Nhà vệ sinh ở đâu?', 'トイレはどこですか'),
      AS('Hiệu sách ở tầng 2.', '{本屋|ほんや}は{2階|にかい}です', 'にかい'),
      AS('Siêu thị ở tầng hầm 1.', 'スーパーは{地下|ちか}{1階|いっかい}です', 'ちかいっかい'),
      AS('Quầy thu ngân ở đằng kia.', 'レジはあそこです', 'あそこ'),
      AS('Cửa hàng 100 yên ở tầng mấy?', '{100円|ひゃくえん}ショップは{何階|なんがい}ですか', '何階'),
    ]),
    MC('s113-b2-01-mcq', 'Chọn đáp án (buổi 1)', [
      Q('「{本屋|ほんや}は（　）ですか。」 — hỏi tầng', '{何階|なんがい}', 'どこ階 | いくら | だれ', 'Hỏi tầng = 何階.'),
      Q('「トイレは {3階|さんがい}です」 — 3階 đọc là…', 'さんがい', 'さんかい | みっかい | さんがく', '3階 = さんがい.'),
      Q('Nhân viên nói lịch sự "ở phía kia ạ":', 'あちらです。', 'あれです。 | あたりです。 | あしです。', 'あちら = phía kia (lịch sự); あれ là "cái kia" (đồ vật), không phải nơi chốn.'),
      Q('「ここは（　）です」 — "Đây là nhà hàng"', 'レストラン', 'レストランを | どこ | いくら', 'ここは N です.'),
      Q('Chỗ gần NGƯỜI NGHE:', 'そこ', 'ここ | あそこ | どこ', 'そこ.'),
      Q('ATM ở tầng 1. Câu đúng là…', 'ATMは{1階|いっかい}です。', 'ATMは{1階|いちかい}です。 | ATMは{1階|ひとかい}です。 | ATMは{1階|いちがい}です。', '1階 = いっかい (có っ).'),
    ]),
    ASK([
      '「FPT{大学|だいがく}の としょかんは {何階|なんがい}ですか。」 (cô hay hỏi về trường mình) — chuẩn bị tầng thật + cách đọc.',
      '「スーパーは どこですか。」 / 「トイレは どこですか。」 — đáp **あそこです** hoặc tầng, không im lặng.',
      '「{百円|ひゃくえん}ショップは {三階|さんがい}ですか。」 — nếu đúng: **はい、{三階|さんがい}です**; sai: **いいえ、{三階|さんがい}じゃありません。{二階|にかい}です。**',
    ]),
  ],
};

/* ───────────────────────── BUỔI 2 ───────────────────────── */

const S2_02: Lesson = {
  id: 's113-b2-02-do-vat-gan-xa',
  kind: 'grammar',
  title: 'Buổi 2 — これ・それ・あれ / この・その・あの: chỉ đồ vật, đồ dùng, đồ điện tử, quần áo (theo khung lớp)',
  goal: 'Chỉ đồ vật gần/xa bằng これ/それ/あれ và この/その/あの + N, hỏi "Đây là cái gì?", biết tên 16 đồ vật thường gặp.',
  minutes: 45,
  blocks: [
    HOC([
      'Học 16 đồ vật bằng cách **đặt thật đồ trong tầm mắt**: cầm cái bút nói 「これは ペンです」, chỉ cái tủ xa nói 「あれは…」.',
      'Phân biệt **これ（một mình）** và **この + N（luôn đi với danh từ）**. Đây là điểm thi trắc nghiệm kinh điển.',
      'Làm bài luyện cuối buổi.',
    ]),
    NOTE('Nhắc lại', [HONEST]),
    RECAP('Buổi 2 dạy gì?', [
      '**ポイント 7**: これ／それ／あれ は N です。 / ですか。 / 何ですか。',
      '**ポイント 8**: この／その／あの N は 〜です。 (đi kèm danh từ, không đứng một mình).',
      '**Từ mới**: カメラ · 携帯電話 · 電子辞書 · パソコン · くつ · 消しゴム · ペン · トイレットペーパー · 本 · かばん · ズボン · Tシャツ · 時計 · 財布.',
    ]),
    H('Từng phần của buổi 2 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: bàn đầy đồ dùng', 'Gợi chủ đề đồ vật. Tập chỉ và nói: これ, それ, あれ.'],
      [`**Ba cái cố định**: ${JR('これ')} · ${JR('それ')} · ${JR('あれ')} (hỏi: ${JR('どれ')})`, '**これ** = cái này (gần tôi). **それ** = cái đó (gần bạn). **あれ** = cái kia (xa cả hai). **Đứng một mình**, thay cho cả danh từ.'],
      [`**これ は {何|なん} です か**`, 'Hỏi tên đồ vật. Trả lời: **それは ○○です**. Chú ý đổi これ → それ khi trả lời nếu người kia hỏi về vật gần mình (xem lỗi bên dưới).'],
      [`**Ba cái đi kèm danh từ**: ${JR('この')} · ${JR('その')} · ${JR('あの')}`, '**この + N** = N này, **その + N** = N đó, **あの + N** = N kia. Luôn có danh từ ngay sau: この**ペン**, あの**かばん**. KHÔNG nói 「この は…」.'],
      ['**Đồ điện tử**: カメラ · 携帯電話 · 電子辞書 · パソコン', 'カメラ máy ảnh, **携帯電話 *keitai denwa*** điện thoại di động, **電子辞書 *denshi jisho*** kim từ điển, パソコン máy tính cá nhân. Đây là tầng 4 trong sơ đồ buổi 1.'],
      ['**Đồ dùng**: 消しゴム · ペン · 本 · トイレットペーパー', '**消しゴム *keshigomu*** cục tẩy; ペン bút; **本 *hon*** sách; トイレットペーパー giấy vệ sinh. Âm kéo dài trong トイレット *toiretto*.'],
      ['**Quần áo, phụ kiện**: くつ · かばん · ズボン · Tシャツ · 時計 · 財布', 'くつ giày; かばん cặp/túi; ズボン quần dài; Tシャツ áo phông; **時計 *tokei*** đồng hồ; **財布 *saifu*** ví tiền.'],
      ['**Trả lời "N の" bằng こ・そ・あ**', 'Người hỏi "これ" ⇒ bạn trả lời "それ" (nếu vật gần bạn) hoặc "これ" (nếu bạn cầm). Quy tắc này hay khiến mất điểm khi nghe.'],
      ['**Luyện cặp**: hỏi–đáp theo tranh', 'A chỉ tranh và hỏi 「これは何ですか」, B đáp, rồi đổi sang この/その/あの.'],
    ]),
    H('Từ mới của buổi 2'),
    VOC([
      VO('これ ／ それ ／ あれ', 'chỉ vật', 'cái này ／ cái đó ／ cái kia', 'これ は カメラ です。', 'Cái này là máy ảnh.'),
      VO('この 〜 ／ その 〜 ／ あの 〜', 'chỉ vật + N', '~ này ／ ~ đó ／ ~ kia', 'この ペン は {私|わたし} の ペン です。', 'Cây bút này là bút của tôi.'),
      VO('カメラ', 'danh từ', 'máy ảnh', 'これ は カメラ です。', 'Đây là máy ảnh.'),
      VO('{携帯電話|けいたいでんわ}', 'danh từ', 'điện thoại di động', 'それ は {携帯電話|けいたいでんわ} です。', 'Cái đó là điện thoại di động.'),
      VO('{電子辞書|でんしじしょ}', 'danh từ', 'kim từ điển', 'あれ は {電子辞書|でんしじしょ} です。', 'Cái kia là kim từ điển.'),
      VO('パソコン', 'danh từ', 'máy tính cá nhân', 'これ は パソコン です。', 'Đây là máy tính cá nhân.'),
      VO('くつ', 'danh từ', 'giày', 'これ は くつ です。', 'Đây là đôi giày.'),
      VO('{消|け}しゴム', 'danh từ', 'cục tẩy', 'それ は {消|け}しゴム です。', 'Cái đó là cục tẩy.'),
      VO('ペン', 'danh từ', 'bút', 'あれ は ペン です か。', 'Cái kia là bút à?'),
      VO('トイレットペーパー', 'danh từ', 'giấy vệ sinh', 'これ は トイレットペーパー です。', 'Đây là giấy vệ sinh.'),
      VO('{本|ほん}', 'danh từ', 'sách', 'これ は {本|ほん} です。', 'Đây là quyển sách.'),
      VO('かばん', 'danh từ', 'cặp, túi xách', 'それ は かばん です。', 'Cái đó là cái cặp.'),
      VO('ズボン', 'danh từ', 'quần dài', 'あれ は ズボン です。', 'Cái kia là quần dài.'),
      VO('T-シャツ', 'danh từ', 'áo phông', 'これ は T-シャツ です。', 'Đây là áo phông.'),
      VO('{時計|とけい}', 'danh từ', 'đồng hồ', 'あれ は {時計|とけい} です。', 'Cái kia là đồng hồ.'),
      VO('{財布|さいふ}', 'danh từ', 'ví tiền', 'これ は {私|わたし} の {財布|さいふ} です。', 'Đây là ví của tôi.'),
    ]),
    H('Ngữ pháp buổi 2 — ポイント 7 và 8'),
    PAT([
      {
        formula: 'これ／それ／あれ は N です。／ N ですか。／ 何 ですか。',
        vi: 'Chỉ vật độc lập: Cái này/đó/kia là N.',
        examples: [
          E('これ は {何|なん} です か。', 'Đây là cái gì?'),
          E('それ は {時計|とけい} です。', 'Cái đó là đồng hồ.'),
          E('あれ は {電子辞書|でんしじしょ} です か。', 'Cái kia là kim từ điển à?'),
        ],
      },
      {
        formula: 'この／その／あの N は 〜です。',
        vi: 'Chỉ vật kèm danh từ: N này/đó/kia thì…',
        examples: [
          E('この ペン は {私|わたし} の ペン です。', 'Cây bút này là bút của tôi.'),
          E('あの {時計|とけい} は {日本|にほん} の {時計|とけい} です。', 'Chiếc đồng hồ kia là đồng hồ của Nhật.'),
          E('その かばん は {私|わたし} の かばん です。', 'Cái cặp đó là cặp của tôi.'),
        ],
      },
    ]),
    RULE('これ／それ／あれ（một mình） ↔ この／その／あの + N', 'これ ≠ この: これ không có danh từ theo sau; この luôn có danh từ.'),
    DLG('Hội thoại mẫu buổi 2', [
      D('A', 'f', 'すみません。 これ は {何|なん} です か。', 'Xin lỗi. Đây là cái gì ạ?'),
      D('店員', 'm', 'それ は {電子辞書|でんしじしょ} です。', 'Cái đó là kim từ điển ạ.'),
      D('A', 'f', 'あれ は {何|なん} です か。', 'Còn cái kia là gì ạ?'),
      D('店員', 'm', 'あれ は {携帯電話|けいたいでんわ} です。', 'Cái kia là điện thoại di động ạ.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 2', [
      '~~この は ペンです~~ → **これは ペンです** hoặc **この ペンは…**. この cần danh từ ngay sau.',
      '~~これ ペン~~ (thiếu です／は) → hãy luôn nói câu đầy đủ.',
      'Hỏi 「それは何ですか」 mà trả lời ~~それ~~ → phải đổi thành **これ**: (đồ vật ở gần BẠN) → これは ○○です.',
      'Phát âm sai: ~~けしごむ~~ (không có cách viết này) → **けしゴム**. Nhầm 時計 (*tokei*) với 時間.',
      'Dùng **あれ** cho vật gần → phải **これ/それ**.',
    ]),
    NOTE('Cách nhớ', [
      '**Tay chỉ**: こ = ngón tay chỉ vào ngực mình, そ = hướng về người đối diện, あ = chỉ xa, ど = lắc đầu hỏi. Gắn động tác khi luyện.',
      '**この＋N / その＋N / あの＋N**: nếu bạn nghe được danh từ ngay sau → dùng bộ "の" (kono, sono, ano).',
      'Đồ điện tử gói trong một mẹo: **カメラ・ケータイ・じしょ・パソコン** (4 món tầng 4).',
    ]),
    QZ('s113-b2-02-dich', 'Dịch Việt → Nhật (buổi 2)', 'translate', [
      AS('Đây là cái gì?', 'これは{何|なん}ですか'),
      AS('Cái đó là cục tẩy.', 'それは{消|け}しゴムです'),
      AS('Cái kia là máy tính cá nhân.', 'あれはパソコンです'),
      AS('Chiếc đồng hồ này là đồng hồ của Nhật.', ['この{時計|とけい}は{日本|にほん}の{時計|とけい}です', 'この{時計|とけい}は{日本|にほん}のです']),
      AS('Cái cặp kia là cặp của tôi.', ['あのかばんは{私|わたし}のかばんです', 'あのかばんは{私|わたし}のです']),
    ]),
    MC('s113-b2-02-mcq', 'Chọn đáp án (buổi 2)', [
      Q('「（　）かばんは {私|わたし}のです」 (cái cặp này)', 'この', 'これ | それ | あれ', 'Có danh từ theo sau → この.'),
      Q('「（　）は {何|なん}ですか」 (không có danh từ)', 'これ', 'この | その | あの', 'Không danh từ → これ.'),
      Q('Vật xa cả hai người:', 'あれ', 'これ | それ | どれ', 'あれ.'),
      Q('「{時計|とけい}」 đọc là…', 'とけい', 'じけい | ときけい | じかん', '時計 = とけい.'),
      Q('「{電子辞書|でんしじしょ}」 là…', 'Kim từ điển', 'Máy tính | Điện thoại | Máy ảnh', 'Kim từ điển.'),
      Q('A hỏi 「それは{何|なん}ですか」 khi bạn đang cầm cục tẩy. Bạn đáp:', 'これは{消|け}しゴムです。', 'それは{消|け}しゴムです。 | あれは{消|け}しゴムです。 | その{消|け}しゴムです。', 'Vật ở gần bạn → これ.'),
    ]),
    ASK([
      '「これは {何|なん}ですか。」 + chỉ tranh — trả lời đủ câu: **それは ○○です**.',
      '「この ペンは いくらですか。」 (nối sang buổi 3).',
      '「ペンは {日本語|にほんご}で {何|なん}ですか。」 (nối sang buổi 6, ポイント 15).',
    ]),
  ],
};

/* ───────────────────────── BUỔI 3 ───────────────────────── */

const S2_03: Lesson = {
  id: 's113-b2-03-so-va-gia-tien',
  kind: 'grammar',
  title: 'Buổi 3 — いくらですか: số, giá tiền, 円, じゃ (theo khung lớp)',
  goal: 'Đọc đúng số đến hàng chục nghìn, nghe và nói giá bằng yên, hỏi giá bằng いくら và chốt mua bằng じゃ、これをください.',
  minutes: 50,
  blocks: [
    HOC([
      'Buổi này **chỉ cần luyện miệng**: đọc to 20 giá tiền trong bảng, càng nhanh càng tốt, đến khi không phải nghĩ.',
      'Học theo **4 chữ số một nhóm**: tiếng Nhật chia số theo **万 (vạn = 10.000)**, không phải theo nghìn như tiếng Việt.',
      'Làm bài luyện, nhất là phần "viết cách đọc".',
    ]),
    NOTE('Nhắc lại', [HONEST]),
    RECAP('Buổi 3 dạy gì?', [
      '**ポイント 11 — いくら**: N は いくらですか。 → 〜円です。 / 一つ いくらですか。',
      '**Từ mới**: 〜円 · いくら · じゃ · パン · ケーキ · 卵 · 米 · 油 · 水 (đồ ở siêu thị để luyện giá).',
      '**Biến âm quan trọng**: 300 さんびゃく · 600 ろっぴゃく · 800 はっぴゃく · 3.000 さんぜん · 8.000 はっせん.',
      '**Chốt mua**: じゃ、これをください (vậy thì cho tôi cái này).',
    ]),
    H('Từng phần của buổi 3 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: kệ hàng có bảng giá', 'Gợi chủ đề giá. Nhìn bảng giá và đoán: món nào rẻ, món nào đắt.'],
      [`**${JR('〜{円|えん}')}**`, '円 là yên Nhật (*en*). Số + えん. Chữ **円** luôn đọc **えん** dù đứng sau số nào. Chú ý biến âm của số: ひゃく → びゃく／ぴゃく.'],
      [`**${JR('いくら')}**`, 'Hỏi giá tiền: "bao nhiêu (tiền)". 一つ いくらですか = mỗi cái bao nhiêu. Khác với **どのくらい** (bao lâu — thời gian), **いくつ** (mấy cái).'],
      ['**Hàng chục, trăm, nghìn, vạn**', '10 じゅう · 100 ひゃく · 1.000 せん · 10.000 **いちまん** (phải có いち). 20 にじゅう, 35 さんじゅうご, 99 きゅうじゅうきゅう. Ghép như tiếng Việt.'],
      ['**Ba biến âm "bít" của trăm**', '300 **さんびゃく**, 600 **ろっぴゃく**, 800 **はっぴゃく**. Các trăm khác bình thường: にひゃく, よんひゃく, ごひゃく, ななひゃく, きゅうひゃく.'],
      ['**Hai biến âm của nghìn**', '3.000 **さんぜん**, 8.000 **はっせん**. Còn lại: にせん, よんせん, ごせん, ろくせん, ななせん, きゅうせん.'],
      ['**Đọc theo 万**', '12.000 = 1万 2千 = **いちまん にせん**. 29.800 = 2万 9千 8百 = **にまん きゅうせん はっぴゃく**. Cách làm: đếm 4 chữ số từ phải, đặt dấu.'],
      [`**${JR('じゃ、 これ を ください')}**`, '**じゃ** = "vậy thì" (chốt quyết định). Cô cho nghe trong hội thoại mua hàng; ポイント 10 ở buổi 4 sẽ học đầy đủ ください.'],
      ['**Luyện cặp**: bảng giá siêu thị', 'A chỉ món, B hỏi giá, A đọc giá. Đổi vai. Chú ý đọc đủ cả chữ えん.'],
    ]),
    H('Bảng số (để tra khi luyện)'),
    TABLE(
      ['', '×10', '×100', '×1.000', '×10.000'],
      [
        ['1', 'じゅう', 'ひゃく', 'せん', 'いちまん'],
        ['2', 'にじゅう', 'にひゃく', 'にせん', 'にまん'],
        ['3', 'さんじゅう', '**さんびゃく**', '**さんぜん**', 'さんまん'],
        ['4', 'よんじゅう', 'よんひゃく', 'よんせん', 'よんまん'],
        ['5', 'ごじゅう', 'ごひゃく', 'ごせん', 'ごまん'],
        ['6', 'ろくじゅう', '**ろっぴゃく**', 'ろくせん', 'ろくまん'],
        ['7', 'ななじゅう', 'ななひゃく', 'ななせん', 'ななまん'],
        ['8', 'はちじゅう', '**はっぴゃく**', '**はっせん**', 'はちまん'],
        ['9', 'きゅうじゅう', 'きゅうひゃく', 'きゅうせん', 'きゅうまん'],
      ],
      'Số hàng chục · trăm · nghìn · vạn — in đậm là biến âm',
    ),
    TABLE(
      ['Giá', 'Đọc', 'Romaji'],
      [
        [`{100円|ひゃくえん}`, 'ひゃくえん', 'hyaku-en'],
        [`{150円|ひゃくごじゅうえん}`, 'ひゃくごじゅうえん', 'hyaku-gojuu-en'],
        [`{230円|にひゃくさんじゅうえん}`, 'にひゃくさんじゅうえん', 'nihyaku-sanjuu-en'],
        [`{398円|さんびゃくきゅうじゅうはちえん}`, 'さんびゃくきゅうじゅうはちえん', 'sanbyaku-kyuujuu-hachi-en'],
        [`{450円|よんひゃくごじゅうえん}`, 'よんひゃくごじゅうえん', 'yonhyaku-gojuu-en'],
        [`{800円|はっぴゃくえん}`, 'はっぴゃくえん', 'happyaku-en'],
        [`{1,200円|せんにひゃくえん}`, 'せんにひゃくえん', 'sen-nihyaku-en'],
        [`{2,800円|にせんはっぴゃくえん}`, 'にせんはっぴゃくえん', 'nisen-happyaku-en'],
        [`{2,980円|にせんきゅうひゃくはちじゅうえん}`, 'にせんきゅうひゃくはちじゅうえん', 'nisen-kyuuhyaku-hachijuu-en'],
        [`{3,500円|さんぜんごひゃくえん}`, 'さんぜんごひゃくえん', 'sanzen-gohyaku-en'],
        [`{12,000円|いちまんにせんえん}`, 'いちまんにせんえん', 'ichiman-nisen-en'],
        [`{30,000円|さんまんえん}`, 'さんまんえん', 'sanman-en'],
        [`{35,600円|さんまんごせんろっぴゃくえん}`, 'さんまんごせんろっぴゃくえん', 'sanman-gosen-roppyaku-en'],
      ],
      'Che cột "Đọc" rồi tự nói',
    ),
    H('Từ mới của buổi 3'),
    VOC([
      VO('〜{円|えん}', 'hậu tố', 'yên (tiền Nhật)', 'この パン は {150円|ひゃくごじゅうえん} です。', 'Chiếc bánh mì này 150 yên.'),
      VO('いくら', 'từ để hỏi', 'bao nhiêu tiền', 'この ケーキ は いくら です か。', 'Cái bánh này bao nhiêu tiền?'),
      VO('じゃ', 'liên từ', 'thế thì / thôi thì', 'じゃ、 これ を ください。', 'Vậy thì cho tôi cái này.'),
      VO('パン', 'danh từ', 'bánh mì', 'この パン は {150円|ひゃくごじゅうえん} です。', 'Chiếc bánh mì này 150 yên.'),
      VO('ケーキ', 'danh từ', 'bánh ngọt', 'この ケーキ は {450円|よんひゃくごじゅうえん} です。', 'Cái bánh này 450 yên.'),
      VO('{卵|たまご}', 'danh từ', 'trứng', 'この {卵|たまご} は {230円|にひゃくさんじゅうえん} です。', 'Hộp trứng này 230 yên.'),
      VO('{米|こめ}', 'danh từ', 'gạo', 'この {米|こめ} は {2,980円|にせんきゅうひゃくはちじゅうえん} です。', 'Gạo này 2.980 yên.'),
      VO('{油|あぶら}', 'danh từ', 'dầu (ăn)', 'この {油|あぶら} は {398円|さんびゃくきゅうじゅうはちえん} です。', 'Chai dầu này 398 yên.'),
      VO('{水|みず}', 'danh từ', 'nước (uống)', 'この {水|みず} は {100円|ひゃくえん} です。', 'Chai nước này 100 yên.'),
    ]),
    H('Ngữ pháp buổi 3 — ポイント 11'),
    PAT([
      {
        formula: 'N は いくら ですか。 ── 〜円 です。',
        vi: 'Hỏi và nói giá của một món.',
        examples: [
          E('この {卵|たまご} は いくら です か。', 'Hộp trứng này bao nhiêu tiền?'),
          E('{230円|にひゃくさんじゅうえん} です。', '230 yên.'),
          E('{全部|ぜんぶ} で {1,200円|せんにひゃくえん} です。', 'Tất cả là 1.200 yên. (全部で = tổng cộng; gặp nhiều trong hội thoại)'),
        ],
      },
      {
        formula: '一つ いくら ですか。 ── 一つ 〜円 です。',
        vi: 'Hỏi giá một cái.',
        examples: [
          E('この ケーキ は {一|ひと}つ いくら です か。', 'Bánh này một cái bao nhiêu?'),
          E('{一|ひと}つ {450円|よんひゃくごじゅうえん} です。', 'Một cái 450 yên.'),
        ],
      },
    ]),
    RULE('N は いくら ですか → 〜円 です', 'Hỏi giá: いくら. Trả lời: số + 円 + です.'),
    DLG('Hội thoại mẫu buổi 3 — mua ở tiệm bánh', [
      D('客', 'f', 'すみません。 この ケーキ は いくら です か。', 'Xin lỗi. Bánh này bao nhiêu tiền ạ?'),
      D('店員', 'm', 'いらっしゃいませ。 {450円|よんひゃくごじゅうえん} です。', 'Kính chào quý khách. 450 yên ạ.'),
      D('客', 'f', 'この パン は？', 'Còn bánh mì này?'),
      D('店員', 'm', '{150円|ひゃくごじゅうえん} です。', '150 yên ạ.'),
      D('客', 'f', 'じゃ、 この パン を ください。', 'Vậy thì cho tôi bánh mì này.'),
      D('店員', 'm', 'どうも ありがとう ございます。', 'Xin cảm ơn quý khách.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 3', [
      '~~さんひゃく~~ → **さんびゃく**; ~~ろくひゃく~~ → **ろっぴゃく**; ~~はちひゃく~~ → **はっぴゃく**.',
      '~~さんせん~~ → **さんぜん**; ~~はちせん~~ → **はっせん**.',
      '~~いちひゃくえん~~ / ~~いちせんえん~~ → **ひゃくえん / せんえん**. Nhưng 10.000 phải có **いち**: **いちまんえん**.',
      'Nhầm **いくら** (tiền) với **いくつ** (mấy cái) và **どのくらい** (bao lâu).',
      'Đọc 12.000 là ~~じゅうにせん~~ → **いちまんにせん** (chia theo 万).',
      'Quên chữ **円**: ~~この パン は ひゃくごじゅうです~~ → **ひゃくごじゅうえん**.',
    ]),
    NOTE('Cách nhớ', [
      '**Ba, sáu, tám "bít" của trăm: san-byaku, rop-pyaku, hap-pyaku.** Nhớ bằng nhịp: "ba-sáu-tám" = b-p-p.',
      '**3 và 8 "bít" của nghìn: san-zen, has-sen.** Chỉ hai số này.',
      'Mẹo 万: tách 4 chữ số từ phải sang: 29800 → 2 | 9800 → 「に万」 + 「きゅうせん はっぴゃく」.',
    ]),
    QZ('s113-b2-03-doc', 'Viết cách đọc giá tiền bằng hiragana (buổi 3)', 'fill', [
      A('300円', 'さんびゃくえん'),
      A('600円', 'ろっぴゃくえん'),
      A('800円', 'はっぴゃくえん'),
      A('1,500円', 'せんごひゃくえん'),
      A('3,000円', 'さんぜんえん'),
      A('8,000円', 'はっせんえん'),
      A('10,000円', 'いちまんえん'),
      A('23,400円', 'にまんさんぜんよんひゃくえん'),
    ]),
    QZ('s113-b2-03-dich', 'Dịch Việt → Nhật (buổi 3)', 'translate', [
      AS('Cái bánh này bao nhiêu tiền?', 'このケーキはいくらですか', 'いくら'),
      AS('Chai nước này 100 yên.', 'この{水|みず}は{100円|ひゃくえん}です', 'ひゃくえん'),
      AS('Gạo này 2.980 yên.', 'この{米|こめ}は{2,980円|にせんきゅうひゃくはちじゅうえん}です', ''),
      AS('Vậy thì cho tôi bánh mì này.', 'じゃ、このパンをください', 'じゃ'),
    ]),
    MC('s113-b2-03-mcq', 'Chọn đáp án (buổi 3)', [
      Q('600円', 'ろっぴゃくえん', 'ろくひゃくえん | ろくびゃくえん | ろっひゃくえん', '600 = ろっぴゃく.'),
      Q('3,000円', 'さんぜんえん', 'さんせんえん | みっつせんえん | さんぜえん', '3000 = さんぜん.'),
      Q('10,000円', 'いちまんえん', 'まんえん | じゅうせんえん | いちせんえん', '10.000 phải có いち.'),
      Q('Hỏi giá:', 'いくらですか', 'いくつですか | どこですか | なんですか', 'いくら = bao nhiêu tiền.'),
      Q('「じゃ」 nghĩa là…', 'Vậy thì', 'Cảm ơn | Xin lỗi | Rất vui', 'じゃ = vậy thì.'),
      Q('「29,800円」 đọc là…', 'にまんきゅうせんはっぴゃくえん', 'にせんきゅうひゃくはちじゅうえん | にまんきゅうせんはちひゃくえん | にまんくせんはっぴゃくえん', '2万 9千 8百.'),
    ]),
    ASK([
      '「これは いくらですか。」 — luôn trả lời **số + 円 + です**. Cô có thể đưa tranh có giá như 28,000 円 hay 30,000 円.',
      '「ぜんぶで いくらですか。」 — tính nhẩm hai món rồi đọc tổng.',
      '「ぜんぶで いくらですか」 sau khi mua hai món — bạn cộng nhẩm rồi đọc tổng, nhớ **えん** ở cuối.',
    ]),
  ],
};

/* ───────────────────────── BUỔI 4 ───────────────────────── */

const S2_04: Lesson = {
  id: 's113-b2-04-sieu-thi-mua-do',
  kind: 'grammar',
  title: 'Buổi 4 — をください: siêu thị, mua đồ, đếm 〜つ (theo khung lớp)',
  goal: 'Nói "Cho tôi N" và "Cho tôi 〜 cái N" đúng cấu trúc, đọc 〜つ từ 1 đến 10, nối hai món bằng と, biết tên thực phẩm ở siêu thị.',
  minutes: 45,
  blocks: [
    HOC([
      'Học theo cặp: **tên món → cách đếm**. Cầm một món bất kỳ trong nhà và nói 「○○を ひとつ ください」.',
      'Thuộc **〜つ** ngay: ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお.',
      'Làm bài luyện, nhất là phần xếp thứ tự câu.',
    ]),
    NOTE('Nhắc lại', [HONEST]),
    RECAP('Buổi 4 dạy gì?', [
      '**ポイント 10**: N を ください · N を 〜つ ください · N1 を 〜つ と N2 を 〜つ ください.',
      '**Từ mới (thực phẩm)**: 魚 · 肉 · 牛肉 · 鶏肉 · 豚肉 · 野菜 · イチゴ · リンゴ · ( 〜つ ).',
      '**〜つ**: số đếm vật nói chung, từ 1 đến 10 (có cách đọc riêng).',
    ]),
    H('Từng phần của buổi 4 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: kệ rau, thịt, cá, trái cây', 'Nhìn tranh gọi tên: 魚, 肉, 野菜, リンゴ, イチゴ. Chữ Hán 魚, 肉, 野菜 nên nhận mặt.'],
      [`**Thịt**: ${JR('{肉|にく}')} · ${JR('{牛肉|ぎゅうにく}')} · ${JR('{鶏肉|とりにく}')} · ${JR('{豚肉|ぶたにく}')}`, '**肉** = thịt (chung). **牛肉** thịt bò, **鶏肉** thịt gà, **豚肉** thịt lợn. Ba cái sau = con vật + 肉.'],
      [`**Cá, rau, quả**: ${JR('{魚|さかな}')} · ${JR('{野菜|やさい}')} · ${JR('イチゴ')} · ${JR('リンゴ')}`, '魚 *sakana* cá; 野菜 *yasai* rau; イチゴ dâu; リンゴ táo (đều viết katakana khi ghi trái cây).'],
      [`**N を ください** — ${JR('{魚|さかな} を ください')}`, '**を** (đọc *o*) đánh dấu món mình muốn. **ください** = "xin hãy cho tôi". Câu cơ bản để mua hàng, gọi món.'],
      [`**N を 〜つ ください** — ${JR('リンゴ を {三|みっ}つ ください')}`, 'Số lượng đặt ngay SAU を và trước ください. KHÔNG thêm の, を nữa.'],
      ['**〜つ từ 1 đến 10**', 'ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお. Từ 11 dùng số thường (じゅういち). Hỏi: **いくつ**.'],
      ['**N1 を 〜つ と N2 を 〜つ ください**', 'Mua hai món: dùng と nối hai cụm "N を 〜つ". Khi gọi món hay nghe: 「カレーをふたつとスープをひとつください」.'],
      ['**Luyện cặp**: một bạn làm khách, một bạn làm 店員', 'Khách: 「すみません、○○を△つ ください」. 店員: 「はい、△つですね。○○円です」.'],
    ]),
    H('Từ mới của buổi 4'),
    VOC([
      VO('{魚|さかな}', 'danh từ', 'cá', '{魚|さかな} を {三|みっ}つ ください。', 'Cho tôi ba con cá.'),
      VO('{肉|にく}', 'danh từ', 'thịt', '{肉|にく} を ください。', 'Cho tôi thịt.'),
      VO('{牛肉|ぎゅうにく}', 'danh từ', 'thịt bò', '{牛肉|ぎゅうにく} を {二|ふた}つ ください。', 'Cho tôi hai phần thịt bò.'),
      VO('{鶏肉|とりにく}', 'danh từ', 'thịt gà', '{鶏肉|とりにく} を ひとつ ください。', 'Cho tôi một phần thịt gà.'),
      VO('{豚肉|ぶたにく}', 'danh từ', 'thịt lợn', '{豚肉|ぶたにく} を {二|ふた}つ ください。', 'Cho tôi hai phần thịt lợn.'),
      VO('{野菜|やさい}', 'danh từ', 'rau', '{野菜|やさい} を ください。', 'Cho tôi rau.'),
      VO('イチゴ', 'danh từ', 'quả dâu', 'イチゴ を {四|よっ}つ ください。', 'Cho tôi bốn quả dâu.'),
      VO('リンゴ', 'danh từ', 'quả táo', 'リンゴ を {三|みっ}つ ください。', 'Cho tôi ba quả táo.'),
      VO('〜つ', 'hậu tố', '~ cái / ~ chiếc', 'ケーキ を {二|ふた}つ ください。', 'Cho tôi hai cái bánh.', 'Từ 1 đến 10: ひとつ…とお.'),
    ]),
    H('Bảng 〜つ (1–10)'),
    TABLE(
      ['Số', 'Đọc', 'Romaji'],
      [
        ['1つ', 'ひとつ', 'hitotsu'],
        ['2つ', 'ふたつ', 'futatsu'],
        ['3つ', 'みっつ', 'mittsu'],
        ['4つ', 'よっつ', 'yottsu'],
        ['5つ', 'いつつ', 'itsutsu'],
        ['6つ', 'むっつ', 'muttsu'],
        ['7つ', 'ななつ', 'nanatsu'],
        ['8つ', 'やっつ', 'yattsu'],
        ['9つ', 'ここのつ', 'kokonotsu'],
        ['10', '**とお** (không có つ)', 'too'],
        ['？', '**いくつ**', 'ikutsu'],
      ],
    ),
    H('Ngữ pháp buổi 4 — ポイント 10'),
    PAT([
      {
        formula: 'N を ください。',
        vi: 'Cho tôi N.',
        examples: [
          E('{魚|さかな} を ください。', 'Cho tôi cá.'),
          E('じゃ、 これ を ください。', 'Vậy thì cho tôi cái này.'),
        ],
      },
      {
        formula: 'N を 〜つ ください。',
        vi: 'Cho tôi 〜 cái N.',
        examples: [
          E('リンゴ を {三|みっ}つ ください。', 'Cho tôi ba quả táo.'),
          E('ケーキ を {二|ふた}つ ください。', 'Cho tôi hai cái bánh.'),
        ],
      },
      {
        formula: 'N1 を 〜つ と N2 を 〜つ ください。',
        vi: 'Cho tôi 〜 cái N1 và 〜 cái N2.',
        examples: [
          E('パン を {二|ふた}つ と {卵|たまご} を {一|ひと}つ ください。', 'Cho tôi hai bánh mì và một hộp trứng.'),
          E('{牛肉|ぎゅうにく} を {一|ひと}つ と {野菜|やさい} を {二|ふた}つ ください。', 'Cho tôi một phần thịt bò và hai phần rau.'),
        ],
      },
    ]),
    RULE('N を 〜つ ください', 'Số lượng nằm giữa を và ください; hai món nối bằng と.'),
    DLG('Hội thoại mẫu buổi 4 — ở siêu thị', [
      D('客', 'f', 'すみません。 この リンゴ は いくら です か。', 'Xin lỗi. Táo này bao nhiêu ạ?'),
      D('店員', 'm', '{一|ひと}つ {120円|ひゃくにじゅうえん} です。', 'Một quả 120 yên ạ.'),
      D('客', 'f', 'じゃ、 リンゴ を {三|みっ}つ ください。 それから、 {卵|たまご} も ください。', 'Vậy cho tôi ba quả táo. Rồi, cũng cho tôi trứng.'),
      D('店員', 'm', 'はい、 {全部|ぜんぶ} で {590円|ごひゃくきゅうじゅうえん} です。', 'Vâng, tất cả là 590 yên ạ.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 4', [
      '~~リンゴを三つをください~~ → **リンゴを三つください** (chỉ một を).',
      '~~三つリンゴを~~ → số lượng đứng SAU tên món: **リンゴを三つ**.',
      '~~ににつ~~ / ~~さんつ~~ → 〜つ có cách đọc riêng: **ふたつ / みっつ**.',
      '~~パンとふたつ~~ → ghi đủ を: **パンをふたつと…**.',
      'Quên を (hoặc nói は) bị trừ 2 điểm (lỗi trợ từ).',
    ]),
    NOTE('Cách nhớ', [
      '**Đếm bằng tay** khi đọc: 1 hitotsu · 2 futatsu · 3 mittsu · 4 yottsu · 5 itsutsu · 6 muttsu · 7 nanatsu · 8 yattsu · 9 kokonotsu · 10 too. Đọc cả dãy 3 lần mỗi ngày.',
      '**を = "đối tượng"**: món bạn muốn ngay sau を, rồi số, rồi ください.',
      '**と = "và"** nối hai MÓN trong cùng một đơn.',
    ]),
    BUILD('s113-b2-04-xep', 'Sắp xếp thành câu đúng (buổi 4)', [
      BD('Cho tôi hai cái bánh.', 'ケーキ を {二|ふた}つ ください。', ['の', 'は']),
      BD('Cho tôi ba quả táo.', 'リンゴ を {三|みっ}つ ください。', ['が']),
      BD('Cho tôi một bánh mì và hai hộp trứng.', 'パン を {一|ひと}つ と {卵|たまご} を {二|ふた}つ ください。', ['も']),
      BD('Vậy thì cho tôi cái này.', 'じゃ、 これ を ください。', ['は']),
    ]),
    QZ('s113-b2-04-dich', 'Dịch Việt → Nhật (buổi 4)', 'translate', [
      AS('Cho tôi cá.', '{魚|さかな}をください'),
      AS('Cho tôi hai quả táo.', 'リンゴを{二|ふた}つください'),
      AS('Cho tôi một thịt bò và hai rau.', ['{牛肉|ぎゅうにく}を{一|ひと}つと{野菜|やさい}を{二|ふた}つください']),
      AS('Cho tôi bốn quả dâu.', 'イチゴを{四|よっ}つください'),
    ]),
    MC('s113-b2-04-mcq', 'Chọn đáp án (buổi 4)', [
      Q('3つ đọc là…', 'みっつ', 'さんつ | みつ | さんっつ', '3つ = みっつ.'),
      Q('「リンゴ（　）{二|ふた}つ ください」', 'を', 'が | の | は', 'Đối tượng → を.'),
      Q('「{牛肉|ぎゅうにく}」 là…', 'Thịt bò', 'Thịt gà | Thịt lợn | Cá', '牛肉 = thịt bò.'),
      Q('Hỏi số lượng ("bao nhiêu cái"):', 'いくつ', 'いくら | どこ | どれ', 'いくつ = mấy cái.'),
      Q('Câu nào SAI?', 'リンゴを{三|みっ}つをください。', 'リンゴを{三|みっ}つください。 | リンゴをください。 | リンゴを{一|ひと}つとパンを{二|ふた}つください。', 'Không thêm を sau ～つ.'),
      Q('「10」 trong dãy 〜つ đọc là…', 'とお', 'じゅうつ | とつ | じゅっつ', '10 = とお (không có つ).'),
    ]),
    ASK([
      '「{魚|さかな}を {三|みっ}つ ください」 — cô đọc nhanh số 〜つ, bạn viết/ nói lại.',
      '「リンゴは いくつ ですか／いくつ ほしいですか」 — hỏi số lượng bằng **いくつ** (mấy cái); trả lời bằng 〜つ.',
      'Ở thi nói, 店員 hỏi lại 「リンゴを三つですね」: bạn đáp **はい、そうです**.',
    ]),
  ],
};

/* ───────────────────────── BUỔI 5 ───────────────────────── */

const S2_05: Lesson = {
  id: 's113-b2-05-nha-hang-goi-mon',
  kind: 'grammar',
  title: 'Buổi 5 — レストラン: món ăn, đồ uống, gọi món, 何の N, どこの N (theo khung lớp)',
  goal: 'Gọi món ở nhà hàng, hỏi "món gì / của nước nào", biết 18 món và đồ uống, dùng 何の N, どこの N.',
  minutes: 50,
  blocks: [
    HOC([
      'Học món ăn bằng **thực đơn**: cả bảng ở dưới; cầm thực đơn thật hoặc nhìn ảnh, gọi món bằng miệng.',
      'Ba câu trụ cột: 「**注文をお願いします**」 · 「**〜を〜つください**」 · 「**これは何の料理ですか**」.',
      'Làm bài luyện cuối buổi.',
    ]),
    NOTE('Nhắc lại', [HONEST]),
    RECAP('Buổi 5 dạy gì?', [
      '**Món ăn**: 料理 · カレー · スープ · とんかつ · ハンバーグ · ご飯 · ライス. **Đồ uống**: ジュース · コーヒー · 紅茶 · お茶 · ビール · ワイン.',
      '**Nước**: インド · ドイツ · フランス (cho どこの N). **Giao tiếp**: 注文をお願いします · どうぞ.',
      '**ポイント 12**: これは **何の** N ですか → ○○の N です (món gì, sách gì…).',
      '**ポイント 13**: これは **どこの** N ですか → (国・会社)の N です.',
    ]),
    H('Thực đơn mẫu (tự đặt để luyện)'),
    TABLE(
      ['Món', 'Giá', 'Món', 'Giá'],
      [
        ['カレー', '{800円|はっぴゃくえん}', 'ジュース', '{300円|さんびゃくえん}'],
        ['とんかつ', '{1,200円|せんにひゃくえん}', 'コーヒー', '{400円|よんひゃくえん}'],
        ['ハンバーグ', '{1,000円|せんえん}', '紅茶', '{400円|よんひゃくえん}'],
        ['スープ', '{300円|さんびゃくえん}', 'ビール', '{600円|ろっぴゃくえん}'],
        ['ライス', '{200円|にひゃくえん}', 'ワイン', '{700円|ななひゃくえん}'],
      ],
      'みどりレストラン — メニュー',
    ),
    H('Từng phần của buổi 5 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      ['**Tranh mở**: bàn ăn, thực đơn', 'Nhìn tranh gọi tên món. Phần lớn là katakana: カレー, スープ, ハンバーグ, ビール…'],
      [`**Món chính**: ${JR('カレー')} · ${JR('スープ')} · ${JR('とんかつ')} · ${JR('ハンバーグ')}`, 'とんかつ thịt lợn chiên xù. ハンバーグ thịt băm viên (kiểu bít tết Nhật). **料理** = món ăn / nấu ăn (từ đã gặp ở Bài 1).'],
      [`**Cơm**: ${JR('ご{飯|はん}')} · ${JR('ライス')}`, '**ご飯** cơm (món Nhật). **ライス** cơm theo kiểu phương Tây (kèm cà ri). Cô đưa câu mẫu: 「ご飯を２つください」.'],
      [`**Đồ uống**: ${JR('ジュース')} · ${JR('コーヒー')} · ${JR('{紅茶|こうちゃ}')} · ${JR('（お）{茶|ちゃ}')} · ${JR('ビール')} · ${JR('ワイン')}`, '紅茶 trà đen, **お茶** trà xanh/nước trà Nhật. Chú ý trường âm: *juusu*, *koohii*, *koocha*, *biiru*.'],
      [`**Gọi món**: ${JR('{注文|ちゅうもん} を お{願|ねが}い します')} · ${JR('どうぞ')}`, '**注文をお願いします** = "cho tôi gọi món". Nhân viên đáp **はい、どうぞ** (xin mời nói). Đây là câu mở đầu khi bạn đã sẵn sàng gọi.'],
      ['**何の N** — ポイント 12', '**何の＋N** hỏi "N loại gì": これは何の料理ですか → 魚の料理です (món cá). **の** = bổ nghĩa; N1 trả lời đặt trước N2.'],
      ['**どこの N** — ポイント 13', '**どこの＋N** hỏi nguồn gốc (nước hoặc hãng): これはどこのワインですか → フランスのワインです. Có thể bỏ N2: 「フランスのです」.'],
      [`**Ba nước mới**: ${JR('インド')} · ${JR('ドイツ')} · ${JR('フランス')}`, 'Ấn Độ, Đức, Pháp. Thường gặp trong câu hỏi về nguồn gốc món / đồ uống: インドのカレー, ドイツのビール, フランスのワイン.'],
      ['**Luyện cặp**: khách ↔ 店員', 'Dùng thực đơn: gọi 2 món + 1 đồ uống; 店員 nhắc lại món + số lượng; tính tổng.'],
    ]),
    H('Từ mới của buổi 5'),
    VOC([
      VO('{料理|りょうり}', 'danh từ', 'món ăn / nấu ăn', 'これ は {魚|さかな} の {料理|りょうり} です。', 'Đây là món cá.'),
      VO('カレー', 'danh từ', 'món cà-ri', 'カレー を ひとつ ください。', 'Cho tôi một cà ri.'),
      VO('スープ', 'danh từ', 'canh, súp', 'スープ を ふたつ ください。', 'Cho tôi hai súp.'),
      VO('とんかつ', 'danh từ', 'thịt lợn chiên xù', 'とんかつ は {1,200円|せんにひゃくえん} です。', 'Món tonkatsu 1.200 yên.'),
      VO('ハンバーグ', 'danh từ', 'thịt băm viên', 'ハンバーグ を ひとつ ください。', 'Cho tôi một phần hamburg.'),
      VO('ご{飯|はん}', 'danh từ', 'cơm', 'ご{飯|はん} を {二|ふた}つ ください。', 'Cho tôi hai bát cơm.'),
      VO('ライス', 'danh từ', 'cơm, gạo (kiểu phương Tây)', 'ライス は {200円|にひゃくえん} です。', 'Cơm trắng 200 yên.'),
      VO('ジュース', 'danh từ', 'nước ngọt, nước trái cây', 'ジュース を {三|みっ}つ ください。', 'Cho tôi ba nước ép.'),
      VO('コーヒー', 'danh từ', 'cà phê', 'コーヒー を ふたつ ください。', 'Cho tôi hai cà phê.'),
      VO('{紅茶|こうちゃ}', 'danh từ', 'trà đen', '{紅茶|こうちゃ} を ひとつ ください。', 'Cho tôi một trà đen.'),
      VO('（お）{茶|ちゃ}', 'danh từ', 'trà, nước chè', 'お-{茶|ちゃ} を ください。', 'Cho tôi trà.'),
      VO('ビール', 'danh từ', 'bia', 'ビール を {二|ふた}つ ください。', 'Cho tôi hai bia.'),
      VO('ワイン', 'danh từ', 'rượu vang', 'ワイン を ひとつ ください。', 'Cho tôi một rượu vang.'),
      VO('インド', 'tên nước', 'Ấn Độ', 'これ は インド の カレー です。', 'Đây là cà ri Ấn Độ.'),
      VO('ドイツ', 'tên nước', 'Đức', 'これ は ドイツ の ビール です。', 'Đây là bia Đức.'),
      VO('フランス', 'tên nước', 'Pháp', 'これ は フランス の ワイン です。', 'Đây là rượu vang Pháp.'),
      VO('{注文|ちゅうもん} を お{願|ねが}い します', 'câu', 'cho tôi gọi món', 'すみません、 {注文|ちゅうもん} を お{願|ねが}い します。', 'Xin lỗi, cho tôi gọi món.'),
      VO('どうぞ', 'thán từ', 'xin mời', 'はい、 どうぞ。', 'Vâng, xin mời.'),
    ]),
    H('Ngữ pháp buổi 5 — ポイント 12 và 13'),
    PAT([
      {
        formula: 'これは 何の N ですか。 ── N1 の N です。',
        vi: 'Hỏi loại/nội dung của N.',
        examples: [
          E('これ は {何|なん} の {料理|りょうり} です か。', 'Đây là món gì?'),
          E('{魚|さかな} の {料理|りょうり} です。', 'Là món cá.'),
        ],
      },
      {
        formula: 'これは どこの N ですか。 ── (国／会社)の N です。',
        vi: 'Hỏi nguồn gốc của N (nước hoặc hãng).',
        examples: [
          E('これ は どこ の ワイン です か。', 'Đây là rượu vang của nước nào?'),
          E('フランス の ワイン です。', 'Là rượu vang Pháp.'),
          E('フランス の です。', 'Là của Pháp. (bỏ danh từ sau の)'),
        ],
      },
    ]),
    RULE('何の N／どこの N', '何の hỏi loại; どこの hỏi nơi sản xuất / nước / hãng.'),
    DLG('Hội thoại mẫu buổi 5 — gọi món', [
      D('客', 'm', 'すみません。 {注文|ちゅうもん} を お{願|ねが}い します。', 'Xin lỗi. Cho tôi gọi món.'),
      D('店員', 'f', 'はい、 どうぞ。', 'Vâng, xin mời.'),
      D('客', 'm', 'ハンバーグ を ひとつ と ライス を ひとつ ください。', 'Cho tôi một hamburg và một cơm.'),
      D('店員', 'f', 'ハンバーグ を ひとつ と ライス を ひとつ です ね。', 'Một hamburg và một cơm ạ.'),
      D('客', 'm', 'はい、 そう です。 それから、 コーヒー を ひとつ ください。', 'Vâng, đúng rồi. Rồi, cho tôi một cà phê nữa.'),
    ]),
    NOTE('Lỗi hay mắc ở buổi 5', [
      '~~これは何料理ですか~~ → thiếu の: **何の料理**.',
      '~~これはどこワインですか~~ → **どこの**ワイン.',
      '~~ライスをご飯~~ — nhầm hai từ cơm. ご飯 = cơm Nhật; ライス = cơm phương Tây.',
      '~~ビールを二杯~~ — chưa học 杯; Bài 2 dùng **〜つ**: ビールを二つ.',
      'Quên **を** khi gọi món → mất điểm trợ từ.',
    ]),
    NOTE('Cách nhớ', [
      '**何の hỏi LOẠI, どこの hỏi NGUỒN.** Một chữ "な" (nani) hỏi bên trong món; một chữ "ど" hỏi xuất xứ.',
      'Nước + の + sản phẩm: フランスのワイン · ドイツのビール · インドのカレー — thuộc cả ba cặp, thi nói cực hay hỏi.',
      'Trước khi gọi: **注文をお願いします** → đợi **どうぞ** → mới đọc món.',
    ]),
    QZ('s113-b2-05-dich', 'Dịch Việt → Nhật (buổi 5)', 'translate', [
      AS('Cho tôi gọi món.', ['{注文|ちゅうもん}をお{願|ねが}いします']),
      AS('Cho tôi hai cà phê.', 'コーヒーを{二|ふた}つください'),
      AS('Đây là món gì?', 'これは{何|なん}の{料理|りょうり}ですか'),
      AS('Đây là rượu vang Pháp.', 'これはフランスのワインです'),
      AS('Đây là bia của nước nào?', 'これはどこのビールですか'),
    ]),
    MC('s113-b2-05-mcq', 'Chọn đáp án (buổi 5)', [
      Q('「これは（　）{料理|りょうり}ですか。」 (hỏi loại món)', '{何|なん}の', 'どこの | だれの | いくらの', 'Hỏi loại = 何の.'),
      Q('「これは（　）ワインですか。」 (hỏi nước)', 'どこの', '{何|なん}の | だれの | いくらの', 'Hỏi nguồn gốc = どこの.'),
      Q('「{紅茶|こうちゃ}」 là…', 'Trà đen', 'Cà phê | Trà xanh | Nước trái cây', '紅茶 = trà đen.'),
      Q('Cơm Nhật là…', 'ご{飯|はん}', 'ライス | スープ | パン', 'ご飯.'),
      Q('Gọi món, câu mở đầu:', '{注文|ちゅうもん}をお{願|ねが}いします。', 'いらっしゃいませ。 | ありがとうございます。 | どうぞ。(khách nói)', '注文をお願いします.'),
      Q('「フランス（　）ワイン」', 'の', 'を | は | も', 'Nước の sản phẩm.'),
    ]),
    ASK([
      '「これは {何|なん}の {料理|りょうり}ですか。」 — cô chỉ tranh một món, bạn trả lời 「○○の料理です」.',
      '「ワインは どこのですか。」 — trả lời nhanh nước + の.',
      '「コーヒーを ふたつ ください」 — nhắc lại số lượng khi 店員 xác nhận.',
    ]),
  ],
};

/* ───────────────────────── BUỔI 6 ───────────────────────── */

const S2_06: Lesson = {
  id: 's113-b2-06-cua-ai-tieng-gi-tong-hop',
  kind: 'review',
  title: 'Buổi 6 — だれの・〜語で + tổng hợp Bài 2, chữ Hán lớp, khuôn thi nói (theo khung lớp)',
  goal: 'Hỏi và nói đồ của ai, hỏi "…tiếng Nhật là gì?", ghép đủ ポイント 7–15 trong một đoạn hội thoại mua sắm, biết khuôn đề nói Bài 2.',
  minutes: 60,
  blocks: [
    HOC([
      'Buổi tổng kết Bài 2: **đọc to 3 hội thoại mẫu → thay từ → thu âm → nghe lại**.',
      'Ghép 3 tình huống liên tiếp: hỏi chỗ → hỏi giá → mua → hỏi "đây là cái gì / của ai".',
      'Phần chữ Hán: nhận mặt số và 円 — hay xuất hiện trong giá tiền ở đề đọc.',
    ]),
    RECAP('Buổi 6 dạy gì?', [
      '**ポイント 14 — だれの N**: この本は**誰の**ですか。 → ○○さんのです。 (hỏi sở hữu).',
      '**ポイント 15 — 〜語で**: 「ペン」は**日本語で**何ですか。 → 「ペン」です。 (hỏi "… tiếng ~ là gì?").',
      '**Từ mới**: だれ · 英語 · 〜語. Thêm từ trong đề: としょかん (thư viện).',
      '**Khuôn đề thi nói Bài 2**: câu không tranh (hỏi chỗ, hỏi tầng, hỏi từ) + thẻ nhân vật có nước và giá tiền.',
    ]),
    H('Từng phần của buổi 6 — kèm giải thích'),
    SLD('Các phần theo thứ tự nên học', [
      [`**${JR('だれ')}** (ai)`, 'Hỏi người. Dạng viết chữ Hán 誰 (*dare*). Trước の đọc **だれの**.'],
      [`**だれの N** — ${JR('この {本|ほん} は だれ の です か')}`, 'Hỏi chủ sở hữu. Trả lời: **○○さんのです** (đại từ sở hữu, bỏ danh từ sau の vì đã rõ). Hoặc 「○○さんの本です」.'],
      [`**〜{語|ご}** — ${JR('{日本語|にほんご}')} · ${JR('{英語|えいご}')}`, '語 = ngôn ngữ. Tên nước/ngôn ngữ + 語: 日本語, 英語, ベトナム語. 英語 = tiếng Anh (*eigo*).'],
      [`**${JR('「ペン」 は {日本語|にほんご} で {何|なん} です か')}**`, 'Hỏi cách nói một từ trong ngôn ngữ khác. で chỉ phương tiện/cách thức (ở đây: "bằng tiếng Nhật"). Trả lời: **「ペン」です**.'],
      ['**Nối lại**: tình huống mua sắm tổng hợp', 'Nhân vật vào toà nhà (hỏi chỗ) → vào cửa hàng (hỏi giá) → mua (ください) → nhờ 店員 dịch từ (〜語で) → hỏi đồ bỏ quên (誰の).'],
      ['**Khuôn đề nói** (file "Luyện nói" của cô Huyền)', 'Không tranh: FPT大学のとしょかんは何階ですか · …は三階ですか · Penは日本語で何ですか. Có tranh: スーパー／100円ショップ／くつ屋／トイレ ở đâu, thẻ nhân vật (Kimie-san – Hàn Quốc – 30.000円; Natapon-san – Pháp – 2.800円).'],
    ]),
    H('Từ mới của buổi 6'),
    VOC([
      VO('だれ', 'từ để hỏi', 'ai', 'この {本|ほん} は だれ の です か。', 'Quyển sách này là của ai?'),
      VO('{英語|えいご}', 'danh từ', 'tiếng Anh', '「ペン」 は {英語|えいご} です。', '"Pen" là tiếng Anh.'),
      VO('〜{語|ご}', 'hậu tố', 'tiếng (nước nào)', '{日本語|にほんご} の {本|ほん} です。', 'Là sách tiếng Nhật.'),
      VO('としょかん', 'danh từ', 'thư viện (chữ Hán 図書館)', 'としょかん は {3階|さんがい} です。', 'Thư viện ở tầng 3.', 'Từ trong đề nói, không phải từ mới của cô.'),
    ]),
    H('Ngữ pháp buổi 6 — ポイント 14 và 15'),
    PAT([
      {
        formula: 'N は だれ の ですか。 ── ○○さん の です。',
        vi: 'Hỏi và trả lời "của ai" (bỏ danh từ sau の vì đã rõ).',
        examples: [
          E('この かばん は だれ の です か。', 'Cái cặp này là của ai?'),
          E('^ワン-さん の です。', 'Là của chị Wan.'),
        ],
      },
      {
        formula: '「X」 は 〜語 で 何 ですか。 ── 「Y」 です。',
        vi: 'Hỏi cách nói "X" bằng tiếng ~.',
        examples: [
          E('「ペン」 は {日本語|にほんご} で {何|なん} です か。', '"Pen" tiếng Nhật là gì?'),
          E('「ペン」 です。', 'Là "pen".'),
        ],
      },
    ]),
    RULE('だれの／〜語で', 'だれの hỏi chủ sở hữu; 〜語で hỏi từ trong ngôn ngữ khác.'),
    DLG('Hội thoại tổng hợp — mua sắm rồi hỏi từ', [
      D('ワン', 'f', 'すみません。 {本屋|ほんや} は {何階|なんがい} です か。', 'Xin lỗi. Hiệu sách ở tầng mấy ạ?'),
      D('店員', 'm', '{2階|にかい} です。 エレベーター は あちら です。', 'Ở tầng 2 ạ. Thang máy ở phía kia ạ.'),
      D('ワン', 'f', 'この {電子辞書|でんしじしょ} は いくら です か。', 'Cái kim từ điển này bao nhiêu ạ?'),
      D('店員', 'm', '{1,200円|せんにひゃくえん} です。', '1.200 yên ạ.'),
      D('ワン', 'f', 'じゃ、 これ を ひとつ ください。', 'Vậy cho tôi cái này một cái.'),
    ]),
    H('Chữ Hán lớp Bài 2 (dự kiến)'),
    TABLE(
      ['Chữ', 'Đọc', 'Hán Việt', 'Gặp trong'],
      [
        ['一〜十', 'いち・に・さん・し(よん)・ご・ろく・しち(なな)・はち・きゅう(く)・じゅう', 'nhất…thập', 'giá tiền, tầng, 〜つ'],
        ['百', 'ひゃく', 'bách', `${JR('{300円|さんびゃくえん}')}`],
        ['千', 'せん', 'thiên', `${JR('{3,000円|さんぜんえん}')}`],
        ['万', 'まん', 'vạn', `${JR('{10,000円|いちまんえん}')}`],
        ['円', 'えん', 'viên', `${JR('{150円|ひゃくごじゅうえん}')}`],
      ],
      'Danh sách dự kiến — sẽ sửa khi có chữ Hán thật cô dạy',
    ),
    { t: 'hanlop', bai: 2 },
    H('Khuôn đề thi nói JPD113 — Bài 2'),
    TABLE(
      ['Phần', 'Điểm', 'Làm gì', 'Bài 2 dùng ở đâu'],
      [
        ['Reading', '40', 'Đọc to đoạn ngắn (có giá tiền, tầng, món)', 'Đoạn đi mua đồ / ăn nhà hàng'],
        ['Talking — có tranh', '3 × 15', 'Giám thị chỉ tranh/thẻ, hỏi 3 câu', 'Sơ đồ toà nhà; thẻ nhân vật có nước + giá'],
        ['Talking — không tranh', '1 × 10', 'Giám thị hỏi 1 câu', 'Tầng, hỏi từ, đồ của ai'],
        ['Presenting', '5', 'Chào khi vào / ra', 'しつれいします · ありがとうございました'],
      ],
    ),
    SPEAK('s113-b2-06-noi', [
      'FPTだいがくの としょかんは なんがいですか。',
      'スーパーは どこですか。',
      'ひゃくえんショップは さんがいですか。',
      'ペンは にほんごで なんですか。',
      'この かばんは だれのですか。',
    ]),
    QZ('s113-b2-06-dich', 'Dịch Việt → Nhật (tổng hợp Bài 2)', 'translate', [
      AS('Quyển sách này là của ai?', 'この{本|ほん}はだれのですか'),
      AS('Cái đó là của chị Wan.', 'それはワンさんのです'),
      AS('"Pen" tiếng Nhật là gì?', '「ペン」は{日本語|にほんご}で{何|なん}ですか'),
      AS('Thư viện ở tầng mấy?', 'としょかんは{何階|なんがい}ですか'),
      AS('Cho tôi hai cái bánh. Bao nhiêu tiền?', ['ケーキを{二|ふた}つください。いくらですか']),
    ]),
    MC('s113-b2-06-mcq', 'Chọn đáp án (buổi 6)', [
      Q('「この かばんは（　）のですか。」 (của ai)', 'だれ', 'どこ | なに | いくら', 'Hỏi chủ = だれ.'),
      Q('「ペンは（　）で {何|なん}ですか。」 (tiếng Nhật)', '{日本語|にほんご}', '{日本人|にほんじん} | {日本|にほん} | {日本語|にほんご}を', 'Ngôn ngữ = 日本語.'),
      Q('「英語」 đọc là…', 'えいご', 'えいぎょ | えいがく | えいじん', '英語 = えいご.'),
      Q('Câu nào KHÔNG phải câu hỏi "… tiếng ~ là gì?"', 'これは{何|なん}ですか。', 'ペンは{日本語|にほんご}で{何|なん}ですか。 | ケーキは{英語|えいご}で{何|なん}ですか。 | トイレは{日本語|にほんご}で{何|なん}ですか。', 'Chỉ câu có 〜語で mới hỏi cách nói một từ trong ngôn ngữ khác.'),
      Q('「ワンさんの（　）です」 (của Wan, bỏ danh từ)', 'の', 'を | も | が', 'N の = đồ của N.'),
      Q('「ひゃくえんショップ」 — chữ Hán điền vào chỗ trống: 「（　）円ショップ」', '百', '千 | 万 | 十', '百 = ひゃく.'),
    ]),
    ASK([
      '「{図書館|としょかん}は {何階|なんがい}ですか。」 — trả lời đủ câu: **三階です**.',
      '「ペンは {日本語|にほんご}で {何|なん}ですか。」 — trả lời **「ペン」です** (không im lặng).',
      'Thẻ nhân vật: 「この{人|ひと}は どこの{人|ひと}ですか」 (nước), 「いくらですか」 (giá). Dùng mẫu nhân vật + nước + giá.',
    ]),
  ],
};

export const JP113_B2: Lesson[] = [S2_00, S2_01, S2_02, S2_03, S2_04, S2_05, S2_06];

/* ═══════════════════════════════════════════════════════════════════
 *                      LUYỆN THÊM — hàm sinh câu hỏi từ bảng dữ liệu
 * ═══════════════════════════════════════════════════════════════════ */

/** [từ ({漢字|かな}), nghĩa Việt, nhóm]. Đáp án sai lấy từ cùng nhóm (xoay vòng, xác định). */
type VW = [string, string, string];

function pickBad<T>(pool: T[], i: number, n: number, key: (x: T) => string, ok: string): string[] {
  const out: string[] = [];
  const m = pool.length;
  for (let k = 1; out.length < n && k <= m * 2; k++) {
    const c = key(pool[(i + k * 2 + 1) % m]);
    if (c !== ok && !out.includes(c)) out.push(c);
  }
  for (let k = 0; out.length < n && k < m; k++) {
    const c = key(pool[(i + k) % m]);
    if (c !== ok && !out.includes(c)) out.push(c);
  }
  return out;
}

/** Nhìn từ → chọn nghĩa. */
const VW2M = (id: string, title: string, rows: VW[]): Block =>
  MC(
    id,
    title,
    rows.map(([w, m, g], i) => {
      const same = rows.filter((r) => r[2] === g);
      const pool = same.length >= 4 ? same : rows;
      const bad = pickBad(pool, pool.indexOf(rows[i]), 3, (r) => r[1], m);
      return Q(w, m, bad.join(' | '), `${w} = ${m}.`);
    }),
  );

/** Nghĩa Việt → chọn từ. */
const VM2W = (id: string, title: string, rows: VW[]): Block =>
  MC(
    id,
    title,
    rows.map(([w, m, g], i) => {
      const same = rows.filter((r) => r[2] === g);
      const pool = same.length >= 4 ? same : rows;
      const bad = pickBad(pool, pool.indexOf(rows[i]), 3, (r) => r[0], w);
      return Q(m, w, bad.join(' | '), `${m} = ${w}.`);
    }),
  );

/** Bỏ furigana: {漢字|かな} → 漢字 (câu hỏi đọc chữ Hán không được lộ cách đọc). */
const bareK = (s: string): string => s.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
/** [chữ có furigana, cách đọc đúng (kana), các cách đọc sai, giải thích ngắn]. */
type RD = [string, string, string[], string];
const RDQ = (id: string, title: string, rows: RD[]): Block =>
  MC(
    id,
    title,
    rows.map(([w, ok, bad, why]) => Q(`「${bareK(w)}」 đọc là…`, ok, bad.join(' | '), why)),
  );

/** Số → cách đọc (bảng bất quy tắc). [hiển thị, đọc đúng, sai[], vì sao]. */
type NQ = [string, string, string[], string];
const NUMQ = (id: string, title: string, rows: NQ[]): Block =>
  MC(
    id,
    title,
    rows.map(([d, ok, bad, why]) => Q(`${d} đọc là…`, ok, bad.join(' | '), why)),
  );

/** Câu đúng/sai gom thành MC. */
const TFS = (id: string, title: string, rows: [string, 'Đúng' | 'Sai' | 'Không có trong bài', string][]): Block =>
  MC(
    id,
    title,
    rows.map(([s, a, w]) => TF(s, a, w)),
  );

/** Hội thoại nhanh: nhiều dòng "who:g:câu|nghĩa" cho gọn. */
const DL = (title: string, lines: [string, Who, string, string][]): Block => DLG(title, lines.map(([w, g, s, v]) => D(w, g, s, v)));
const LN = (id: string, title: string, lines: [string, Who, string, string][], note?: string): Block =>
  LS(id, title, lines.map(([w, g, s, v]) => L(w, g, s, v)), note);

/* ═══════════════════════════════════════════════════════════════════
 *                       BÀI 1 — LUYỆN THÊM
 * ═══════════════════════════════════════════════════════════════════ */

/* ───────── 0. LỘ TRÌNH ───────── */

const L1_LO_TRINH: Lesson = {
  id: 'lt-b1-lo-trinh',
  kind: 'review',
  title: 'Luyện thêm Bài 1 — đọc trước: lộ trình 6 ngày, cách dùng, kiểm tra đầu vào',
  goal: 'Biết bộ luyện Bài 1 gồm những gì, học theo thứ tự nào và biết mình yếu kỹ năng nào để luyện đúng chỗ.',
  minutes: 15,
  blocks: [
    RECAP('Học thế nào — đọc 1 phút trước khi luyện', [
      'Bộ này dành cho bạn **học lại từ đầu**: mỗi lesson đi từ 🟢 **Dễ** (nhận mặt) → 🟡 **Vừa** (dùng trong câu) → 🔴 **Khó** (trộn nhiều điểm như đề thi).',
      'Làm **đủ ba mức** theo thứ tự. Nhảy thẳng lên mức Khó khi chưa vững mức Dễ là cách chắc nhất để nản.',
      'Câu nào sai: đọc phần "why" **rồi làm lại đúng câu đó**. Sai ba lần cùng chỗ thì quay lại buổi học gốc (`s113-b1-…`).',
      'Mọi câu tiếng Nhật đều có romaji và nghĩa. Bật furigana khi mới học; **tắt furigana ở mức Khó** để quen với đề thật.',
    ]),
    NOTE('Về nguồn', [HONEST + ' Mọi câu hỏi trong bộ này là viết mới.']),
    H('Bài 1 gồm những kỹ năng nào?'),
    TABLE(
      ['Thứ tự', 'Lesson', 'Luyện gì', 'Ra trong đề nào'],
      [
        ['1', '`lt-b1-tu-vung`', '52 từ của cô: nhận mặt → điền câu → gõ từ', 'Trắc nghiệm từ vựng · câu hỏi nói'],
        ['2', '`lt-b1-chu-han`', '10 chữ Hán dự kiến: 日 本 人 学 生 語 何 私 英 員', 'Reading, chọn cách đọc'],
        ['3–5', '`lt-b1-ngu-phap-1/2/3`', 'ポイント 1–6 từng nhóm', 'Trợ từ · chọn đáp án · ghép câu'],
        ['6', '`lt-b1-ngu-phap-tron`', 'Trộn 6 ポイント: sửa câu sai, dịch hai chiều', 'Phần dịch, điền cuối kỳ'],
        ['7', '`lt-b1-hoi-thoai`', '5 hội thoại mới: hiểu, điền, sắp lượt, đóng vai', 'Thi nói (Q&A)'],
        ['8', '`lt-b1-doc-hieu`', '5 đoạn tự giới thiệu từ ngắn đến dài', 'Reading đọc to + đọc hiểu'],
        ['9', '`lt-b1-nghe`', '9 đoạn nghe: chậm → bẫy (đổi ý, tự sửa tuổi/ngày)', 'Nghe'],
        ['10', '`lt-b1-noi-viet`', 'Câu hỏi thi nói kiểu cô Huyền + bài viết 5–7 câu', 'Thi nói + viết'],
        ['11', '`lt-b1-de-tong-hop`', 'Đề đủ phần, có giờ + thang điểm tự chấm', 'Giả lập bài kiểm tra'],
      ],
    ),
    H('Lịch gợi ý 6 ngày (mỗi ngày 45–60 phút)'),
    TABLE(
      ['Ngày', 'Làm'],
      [
        ['1', 'Từ vựng (cả ba mức) + chữ Hán mức Dễ'],
        ['2', 'Chữ Hán Vừa–Khó + ngữ pháp 1 (ポイント 1–2)'],
        ['3', 'Ngữ pháp 2 (ポイント 3–4: nước, tuổi, ngày, の) + nghe 1–4'],
        ['4', 'Ngữ pháp 3 (ポイント 5–6) + ngữ pháp trộn + hội thoại 1–3'],
        ['5', 'Hội thoại 4–5 + đọc hiểu 1–5 + nghe 5–9'],
        ['6', 'Nói & viết (thu âm, đọc to) + đề tổng hợp trong 45 phút, không nhìn đáp án'],
      ],
    ),
    NOTE('Ưu tiên khi sắp thi', [
      'Điểm dễ nhất: **trợ từ** (は・の・と・も) và **từ để hỏi** (どちら・いつ・何). Mỗi câu đúng là một điểm chắc.',
      'Điểm hay mất: **tháng 4/7/9**, **ngày 1–10, 14, 20, 24**, **tuổi 1/8/10/20**; **さん** gắn vào tên mình; **会社員/社員** và **先生/教師**.',
      'Khi thi nói: luôn trả lời **câu đầy đủ**, bắt đầu bằng はい／いいえ khi câu hỏi có か.',
    ]),
    MC('lt-b1-lt-vao', 'Kiểm tra đầu vào (12 câu, 8 phút) — sai nhóm nào thì ưu tiên luyện nhóm đó', [
      Q('Từ vựng — 「{趣味|しゅみ}」 nghĩa là gì?', 'Sở thích', 'Công việc | Tên | Tuổi', '趣味 = しゅみ = sở thích.'),
      Q('Từ vựng — 「{会社員|かいしゃいん}」 nghĩa là gì?', 'Nhân viên văn phòng', 'Giáo viên | Sinh viên | Học sinh cấp 3', '会社員 = nhân viên công ty.'),
      Q('Chữ Hán — 「{日本人|にほんじん}」 đọc là gì?', 'にほんじん', 'にほんひと | にっぽんじん | ひほんじん', '人 sau tên nước đọc じん.'),
      Q('Chữ Hán — 「{学生|がくせい}」 đọc là gì?', 'がくせい', 'がくしょう | まなせい | がくうま', '学 = がく, 生 = せい.'),
      Q('Trợ từ — {私|わたし}（　）ワンです。', 'は', 'の | も | と', 'N1 は N2 です.'),
      Q('Trợ từ — ふじみ{大学|だいがく}（　）{学生|がくせい}です。', 'の', 'は | と | も', 'N1 の N2.'),
      Q('Trợ từ — {趣味|しゅみ}は{映画|えいが}（　）{音楽|おんがく}です。', 'と', 'の | も | は', 'Nối hai danh từ: と.'),
      Q('Trợ từ — ワンさんは{学生|がくせい}です。{私|わたし}（　）{学生|がくせい}です。', 'も', 'は | と | の', 'Cũng: も.'),
      Q('Từ để hỏi — {誕生日|たんじょうび}は（　）ですか。', 'いつ', 'どちら | {何|なん} | だれ', 'Hỏi thời điểm: いつ.'),
      Q('Phủ định — 「{私|わたし}は{先生|せんせい}です」 → "Tôi không phải là…"', '{私|わたし}は{先生|せんせい}じゃありません。', '{私|わたし}は{先生|せんせい}ないです。 | {私|わたし}は{先生|せんせい}くないです。 | {私|わたし}は{先生|せんせい}いいえです。', 'Phủ định lịch sự của です: じゃありません.'),
      Q('Cách đọc — 4月', 'しがつ', 'よんがつ | しいがつ | よがつ', '4月 = しがつ.'),
      Q('Cách đọc — 20歳 (từ đặc biệt)', 'はたち', 'にじゅうさい | にじゅうねん | はつか', '20 tuổi = はたち (cũng có thể にじゅっさい).'),
    ]),
    NOTE('Chấm điểm đầu vào', [
      '10–12 đúng: bạn khá vững → làm thẳng mức Vừa–Khó, dành nhiều thời gian cho nghe/nói.',
      '6–9 đúng: làm từ mức Dễ của lesson bạn sai.',
      'Dưới 6: làm lần lượt từ lesson 1; mỗi ngày không quá 2 lesson.',
    ]),
  ],
};

/* ───────── 1. TỪ VỰNG ───────── */

const B1_VW: VW[] = [
  ['{私|わたし}', 'tôi', 'co'],
  ['{名前|なまえ}', 'tên', 'co'],
  ['{国|くに}', 'đất nước', 'co'],
  ['〜さん', 'anh / chị / bạn ～ (gắn sau tên người khác)', 'co'],
  ['〜{人|じん}', 'người (nước ～)', 'co'],
  ['どちら', 'đâu, phía nào (lịch sự)', 'co'],
  ['{何|なん}', 'cái gì', 'co'],
  ['いつ', 'khi nào', 'co'],
  ['{日本|にほん}', 'Nhật Bản', 'nuoc'],
  ['アメリカ', 'Mỹ', 'nuoc'],
  ['イタリア', 'Ý', 'nuoc'],
  ['オーストラリア', 'Úc', 'nuoc'],
  ['{韓国|かんこく}', 'Hàn Quốc', 'nuoc'],
  ['タイ', 'Thái Lan', 'nuoc'],
  ['{中国|ちゅうごく}', 'Trung Quốc', 'nuoc'],
  ['ロシア', 'Nga', 'nuoc'],
  ['ブラジル', 'Brazil', 'nuoc'],
  ['ベトナム', 'Việt Nam', 'nuoc'],
  ['{高校|こうこう}', 'trường THPT (cấp 3)', 'nghe'],
  ['{大学|だいがく}', 'trường đại học', 'nghe'],
  ['{日本語学校|にほんごがっこう}', 'trường tiếng Nhật', 'nghe'],
  ['{仕事|しごと}', 'công việc', 'nghe'],
  ['{学生|がくせい}', 'học sinh, sinh viên', 'nghe'],
  ['{先生|せんせい}', 'thầy / cô giáo (dùng để gọi)', 'nghe'],
  ['{教師|きょうし}', 'giáo viên (tên nghề)', 'nghe'],
  ['{会社員|かいしゃいん}', 'nhân viên văn phòng', 'nghe'],
  ['{社員|しゃいん}', 'nhân viên của một công ty cụ thể', 'nghe'],
  ['はじめまして', 'rất vui được gặp (lần đầu)', 'chao'],
  ['どうぞよろしくお{願|ねが}いします', 'mong được giúp đỡ', 'chao'],
  ['こちらこそ', 'tôi cũng vậy / chính tôi mới phải', 'chao'],
  ['あのう', 'À… (mở lời lịch sự)', 'chao'],
  ['すみません', 'xin lỗi / cho tôi hỏi', 'chao'],
  ['そうですか', 'thế à / vậy à', 'chao'],
  ['はい', 'vâng, dạ, có', 'chao'],
  ['いいえ', 'không, không phải', 'chao'],
  ['あっ', 'A! Á! (chợt nhận ra)', 'chao'],
  ['{誕生日|たんじょうび}', 'ngày sinh, sinh nhật', 'ngay'],
  ['〜{月|がつ}', 'tháng ～', 'ngay'],
  ['〜{日|にち}', 'ngày (mùng) ～', 'ngay'],
  ['〜{歳|さい}', '～ tuổi', 'ngay'],
  ['{何歳|なんさい}', 'mấy tuổi', 'ngay'],
  ['{二十歳|はたち}', '20 tuổi', 'ngay'],
  ['{趣味|しゅみ}', 'sở thích', 'thich'],
  ['スポーツ', 'thể thao', 'thich'],
  ['サッカー', 'bóng đá', 'thich'],
  ['テニス', 'tennis (quần vợt)', 'thich'],
  ['{水泳|すいえい}', 'bơi lội', 'thich'],
  ['{映画|えいが}', 'phim, điện ảnh', 'thich'],
  ['{音楽|おんがく}', 'âm nhạc', 'thich'],
  ['{読書|どくしょ}', 'đọc sách', 'thich'],
  ['{旅行|りょこう}', 'du lịch', 'thich'],
  ['{料理|りょうり}', 'nấu ăn; món ăn', 'thich'],
];
const B1_A1 = B1_VW.slice(0, 18);
const B1_A2 = B1_VW.slice(18, 36);
const B1_A3 = B1_VW.slice(36);

const L1_TU_VUNG: Lesson = {
  id: 'lt-b1-tu-vung',
  kind: 'vocab',
  title: 'Luyện thêm Bài 1 — Từ vựng: nhận mặt → điền câu → gõ từ (khoảng 150 câu)',
  goal: 'Nhận ra và dùng đúng 52 từ trong danh sách Bài 1 của cô — từ nhìn mặt chữ đến tự gõ từ khi chỉ có nghĩa tiếng Việt.',
  minutes: 50,
  blocks: [
    NOTE('Học thế nào', [
      'Làm 🟢 Dễ bằng cách **nhìn chữ, nói to cách đọc, rồi mới chọn nghĩa**. Đừng đoán — nói ra miệng mới nhớ.',
      '🟡 Vừa: mỗi từ phải nằm trong câu. Đề thi luôn cho từ trong câu.',
      '🔴 Khó: tự gõ từ khi chỉ có nghĩa Việt; từ gõ sai thì viết lại 3 lần bằng tay.',
      'Lỗi hay mắc: nhầm **先生/教師**, **会社員/社員**; đọc **人** thành ひと trong tên nước; gắn **さん** vào tên mình.',
    ]),

    H(`${LV.de} — A. Nhìn từ, chọn nghĩa (52 câu, chia 3 nhóm)`),
    VW2M('lt-b1-tv-a1', 'A1. Tên, nước, từ để hỏi', B1_A1),
    VW2M('lt-b1-tv-a2', 'A2. Trường, nghề, chào hỏi', B1_A2),
    VW2M('lt-b1-tv-a3', 'A3. Ngày sinh và sở thích', B1_A3),

    H(`${LV.de} — B. Nghĩa Việt, chọn từ Nhật (30 câu)`),
    VM2W('lt-b1-tv-b1', 'B1. Nước và người', B1_VW.filter((r) => r[2] === 'nuoc' || r[2] === 'co').slice(0, 14)),
    VM2W('lt-b1-tv-b2', 'B2. Nghề, trường, sở thích', [...B1_VW.filter((r) => r[2] === 'nghe'), ...B1_VW.filter((r) => r[2] === 'thich').slice(0, 7)]),

    H(`${LV.vua} — C. Chọn từ KHÁC loại (8 câu)`),
    MC('lt-b1-tv-khac-loai', 'C. Một từ khác loại với ba từ còn lại', [
      Q('Chọn từ KHÁC loại: {日本|にほん} / タイ / {先生|せんせい} / ロシア', '{先生|せんせい}', '{日本|にほん} | タイ | ロシア', '3 từ kia là **tên nước**; 先生 là nghề.'),
      Q('Chọn từ KHÁC loại: {学生|がくせい} / {教師|きょうし} / サッカー / {会社員|かいしゃいん}', 'サッカー', '{学生|がくせい} | {教師|きょうし} | {会社員|かいしゃいん}', '3 từ kia là **nghề**; サッカー là sở thích.'),
      Q('Chọn từ KHÁC loại: {映画|えいが} / {音楽|おんがく} / {大学|だいがく} / {料理|りょうり}', '{大学|だいがく}', '{映画|えいが} | {音楽|おんがく} | {料理|りょうり}', '3 từ kia là **sở thích**; 大学 là trường.'),
      Q('Chọn từ KHÁC loại: はい / いいえ / {名前|なまえ} / そうですか', '{名前|なまえ}', 'はい | いいえ | そうですか', '3 từ kia là **lời đáp**; 名前 là danh từ.'),
      Q('Chọn từ KHÁC loại: {高校|こうこう} / {大学|だいがく} / {日本語学校|にほんごがっこう} / {社員|しゃいん}', '{社員|しゃいん}', '{高校|こうこう} | {大学|だいがく} | {日本語学校|にほんごがっこう}', '3 từ kia là **trường học**; 社員 là người.'),
      Q('Chọn từ KHÁC loại: どちら / いつ / {何|なん} / テニス', 'テニス', 'どちら | いつ | {何|なん}', '3 từ kia là **từ để hỏi**; テニス là môn thể thao.'),
      Q('Chọn từ KHÁC loại: 〜{月|がつ} / 〜{日|にち} / 〜{歳|さい} / 〜さん', '〜さん', '〜{月|がつ} | 〜{日|にち} | 〜{歳|さい}', '3 từ kia đi sau SỐ (tháng, ngày, tuổi); 〜さん đi sau TÊN.'),
      Q('Chọn từ KHÁC loại: アメリカ / イタリア / ブラジル / {水泳|すいえい}', '{水泳|すいえい}', 'アメリカ | イタリア | ブラジル', '3 từ kia là tên nước; 水泳 là môn thể thao.'),
    ]),

    H(`${LV.vua} — D. Điền từ vào câu (16 câu)`),
    MC('lt-b1-tv-dien-tu', 'D. Chọn từ điền vào chỗ trống', [
      Q('＿＿＿。{私|わたし}は ワンです。 (lần đầu gặp)', 'はじめまして', 'こちらこそ | すみません | いいえ', 'Lần đầu gặp → はじめまして.'),
      Q('「どうぞよろしくお{願|ねが}いします。」 ── 「＿＿＿。」', 'こちらこそ', 'はじめまして | そうですか | あのう', 'Đáp lại: こちらこそ.'),
      Q('＿＿＿、お{名前|なまえ}は？ (mở lời)', 'あのう', 'こちらこそ | はい | いいえ', 'Mở lời lịch sự: あのう.'),
      Q('お{国|くに}は＿＿＿ですか。', 'どちら', 'いつ | {何|なん} | さん', 'Hỏi nước: どちら.'),
      Q('{誕生日|たんじょうび}は＿＿＿ですか。', 'いつ', 'どちら | {何|なん} | さん', 'Hỏi ngày sinh: いつ.'),
      Q('{趣味|しゅみ}は＿＿＿ですか。', '{何|なん}', 'いつ | どちら | さん', 'Hỏi sở thích: 何.'),
      Q('パクさんは＿＿＿{人|じん}です。 (Hàn Quốc)', '{韓国|かんこく}', '{中国|ちゅうごく} | タイ | ロシア', 'Park là người Hàn.'),
      Q('ワンさんは ふじみ＿＿＿の{学生|がくせい}です。 (đại học)', '{大学|だいがく}', '{高校|こうこう} | {社員|しゃいん} | {先生|せんせい}', 'ふじみ大学の学生.'),
      Q('{私|わたし}は さくら{高校|こうこう}の＿＿＿です。 (nói nghề giáo viên của mình)', '{教師|きょうし}', '{先生|せんせい} | {社員|しゃいん} | {会社員|かいしゃいん}', 'Tên nghề của mình: 教師.'),
      Q('カルロスさんは ABE の＿＿＿です。 (nhân viên của công ty ABE)', '{社員|しゃいん}', '{会社員|かいしゃいん} | {学生|がくせい} | {先生|せんせい}', 'Công ty cụ thể → 社員.'),
      Q('パクさんの{趣味|しゅみ}は＿＿＿です。 (bơi lội)', '{水泳|すいえい}', '{読書|どくしょ} | {旅行|りょこう} | {料理|りょうり}', '水泳 = bơi lội.'),
      Q('{私|わたし}は＿＿＿です。 (20 tuổi, từ đặc biệt)', '{二十歳|はたち}', '{二十|にじゅう}さい | {二十|にじゅう}ねん | {二十|にじゅう}にち', '20歳 = はたち.'),
      Q('{誕生日|たんじょうび}は＿＿＿ {5日|いつか}です。 (tháng 5)', '{5月|ごがつ}', '{5歳|ごさい} | {5日|いつか} | {5時|ごじ}', '5月 = ごがつ.'),
      Q('「お{名前|なまえ}は？」 ── 「＿＿＿ワンです。」', '{私|わたし}は', '{私|わたし}の | {私|わたし}も | ワンさんは', 'N1 は N2 です; không có さん với tên mình.'),
      Q('{私|わたし}の＿＿＿はワンです。 (tên)', '{名前|なまえ}', '{国|くに} | {趣味|しゅみ} | {仕事|しごと}', '私の名前はワンです.'),
      Q('ワンさんの＿＿＿は{会社員|かいしゃいん}です。 (nghề)', '{仕事|しごと}', '{国|くに} | {名前|なまえ} | {趣味|しゅみ}', 'お仕事 = nghề.'),
    ]),

    H(`${LV.vua} — E. Cặp dễ nhầm (10 câu)`),
    MC('lt-b1-tv-cap-nham', 'E. Chọn từ ĐÚNG chỗ', [
      Q('Nói nghề của CHÍNH MÌNH (giáo viên):「{私|わたし}は＿＿＿です」', '{教師|きょうし}', '{先生|せんせい} | {学生|がくせい} | {社員|しゃいん}', '教師 là tên nghề; 先生 dùng để gọi người khác.'),
      Q('Gọi giáo viên Honda: 「ホンダ＿＿＿」', '{先生|せんせい}', '{教師|きょうし} | {学生|がくせい} | {社員|しゃいん}', 'Gọi người = 先生.'),
      Q('「{会社員|かいしゃいん}」 khác 「{社員|しゃいん}」 ở chỗ…', '会社員 = chung; 社員 = công ty cụ thể', '会社員 = giáo viên; 社員 = học sinh | Hai từ hoàn toàn giống | 会社員 là của mình, 社員 là của người khác', 'Xem phần giải thích buổi 3.'),
      Q('Tự giới thiệu tên mình, câu ĐÚNG:', '{私|わたし}はワンです。', '{私|わたし}はワンさんです。 | ワンさんです。 | {私|わたし}はワンさんの{名前|なまえ}です。', 'Không gắn さん vào tên mình.'),
      Q('Nói về tên NGƯỜI KHÁC lịch sự:', 'お{名前|なまえ}', '{私|わたし}の{名前|なまえ} | {名前|なまえ}さん | お{私|わたし}', 'お + 名前 khi nói với người đối diện.'),
      Q('「{何|なん}」 trong 「{趣味|しゅみ}は{何|なん}ですか」 đọc là…', 'なん', 'なに | かな | なにん', 'Trước です đọc なん.'),
      Q('「ベトナム{人|じん}」 — 人 đọc là…', 'じん', 'ひと | にん | たみ', 'Sau tên nước đọc じん.'),
      Q('「いつ」 hỏi về…', 'Thời điểm (ngày sinh…)', 'Tên người | Nước | Nghề', 'いつ = khi nào.'),
      Q('「どちら」 hỏi về…', 'Nơi chốn / nước (lịch sự)', 'Thời gian | Tuổi | Số tiền', 'お国はどちら.'),
      Q('「{韓国|かんこく}」 và 「{中国|ちゅうごく}」 đọc lần lượt là…', 'かんこく・ちゅうごく', 'ちゅうごく・かんこく | かんごく・ちゅうこく | かんこく・ちゅうこく', '韓国 = かんこく; 中国 = ちゅうごく.'),
    ]),

    H(`${LV.kho} — F. Tự gõ từ khi chỉ có nghĩa Việt (14 câu)`),
    QZ('lt-b1-tv-go', 'F. Gõ từ tiếng Nhật (chữ Hán hoặc hiragana/katakana)', 'translate', [
      A('Tôi', '{私|わたし}'),
      A('Tên (bạn) — dạng lịch sự', ['お{名前|なまえ}', '{名前|なまえ}']),
      A('Thầy/cô giáo (gọi)', '{先生|せんせい}'),
      A('Giáo viên (nghề)', '{教師|きょうし}'),
      A('Nhân viên văn phòng', '{会社員|かいしゃいん}'),
      A('Trường đại học', '{大学|だいがく}'),
      A('Sinh nhật', '{誕生日|たんじょうび}'),
      A('Sở thích', '{趣味|しゅみ}'),
      A('Bơi lội', '{水泳|すいえい}'),
      A('Âm nhạc', '{音楽|おんがく}'),
      A('Đọc sách', '{読書|どくしょ}'),
      A('Du lịch', '{旅行|りょこう}'),
      A('Nấu ăn', '{料理|りょうり}'),
      A('Bóng đá', 'サッカー'),
    ]),

    H(`${LV.kho} — G. Đọc câu, hiểu nghĩa (8 câu)`),
    MC('lt-b1-tv-hieu-cau', 'G. Chọn nghĩa đúng của câu', [
      Q('{私|わたし}はタイ{人|じん}です。', 'Tôi là người Thái.', 'Tôi ở Thái Lan. | Tôi đi Thái Lan. | Tôi không phải người Thái.', 'タイ人 = người Thái.'),
      Q('{趣味|しゅみ}は{旅行|りょこう}と{料理|りょうり}です。', 'Sở thích là du lịch và nấu ăn.', 'Sở thích là du lịch hoặc nấu ăn. | Tôi đi du lịch nấu ăn. | Tôi ghét du lịch.', 'と = và.'),
      Q('ワンさんもサッカーです。', 'Wan cũng (sở thích) là bóng đá.', 'Wan và bóng đá. | Wan không thích bóng đá. | Wan là người bóng đá.', 'も = cũng.'),
      Q('{誕生日|たんじょうび}は{9月|くがつ}{1日|ついたち}です。', 'Sinh nhật là ngày 1 tháng 9.', 'Sinh nhật là ngày 9 tháng 1. | Sinh nhật là tháng 9 năm 1. | Sinh nhật là mùng 9.', 'Tháng trước, ngày sau.'),
      Q('{私|わたし}は{大学|だいがく}の{学生|がくせい}です。', 'Tôi là sinh viên đại học.', 'Tôi là giáo viên đại học. | Tôi là nhân viên đại học. | Đại học là sinh viên.', '大学の学生 = sinh viên đại học.'),
      Q('お{国|くに}はどちらですか。', 'Nước của bạn là nước nào?', 'Sinh nhật của bạn khi nào? | Bạn làm nghề gì? | Bạn mấy tuổi?', 'お国 = nước của bạn.'),
      Q('{先生|せんせい}はブラジル{人|じん}です。', 'Thầy/cô là người Brazil.', 'Tôi là giáo viên ở Brazil. | Tôi đi Brazil. | Thầy không phải người Brazil.', 'N は 国人 です.'),
      Q('パクさんは{何歳|なんさい}ですか。', 'Park bao nhiêu tuổi?', 'Park sinh khi nào? | Park là nước nào? | Park học trường nào?', '何歳 = mấy tuổi.'),
    ]),
  ],
};

/* ───────── 2. CHỮ HÁN ───────── */

const L1_CHU_HAN: Lesson = {
  id: 'lt-b1-chu-han',
  kind: 'kanji',
  title: 'Luyện thêm Bài 1 — Chữ Hán của lớp (dự kiến): 日 本 人 学 生 語 何 私 英 員 — nhận mặt → đọc trong từ → đọc không furigana',
  goal: 'Nhận mặt 10 chữ Hán lớp Bài 1, đọc đúng chúng trong các từ của bài và đọc to câu không furigana như đề Reading.',
  minutes: 50,
  blocks: [
    NOTE('Học thế nào', [
      'Danh sách chữ là **dự kiến** (lấy từ từ vựng của Bài 1; khi có chữ Hán thật cô dạy sẽ sửa). Thẻ chữ Hán chi tiết ở ngay bên dưới.',
      '**Học chữ THEO TỪ**: đừng học "日 = nhật" đứng một mình; học 日本, 日本人, 誕生日 — chữ nằm trong từ sẽ nhớ cách đọc đúng.',
      '🟢 nhận mặt · 🟡 chọn cách đọc trong từ · 🔴 đọc câu không furigana như đề. Cuối bài có phần tập viết tay.',
      'Lỗi hay mắc: 人 trong tên nước đọc **じん** (không phải ひと); 生 trong 誕生日 đọc **じょう**; 学校 đọc **がっこう** (có っ).',
    ]),
    { t: 'hanlop', bai: 1 },
    TABLE(
      ['Chữ', 'Nghĩa', 'Đọc trong Bài 1', 'Từ trong Bài 1'],
      [
        ['日', 'ngày, mặt trời', 'に・にち・び', `${JR('{日本|にほん}')} · ${JR('〜{日|にち}')} · ${JR('{誕生日|たんじょうび}')}`],
        ['本', 'gốc; sách', 'ほん', `${JR('{日本|にほん}')} · ${JR('{日本人|にほんじん}')}`],
        ['人', 'người', 'じん', `${JR('ベトナム-{人|じん}')} · ${JR('{中国人|ちゅうごくじん}')}`],
        ['学', 'học', 'がく・がっ', `${JR('{学生|がくせい}')} · ${JR('{大学|だいがく}')} · ${JR('{日本語学校|にほんごがっこう}')}`],
        ['生', 'sinh, sống', 'せい・じょう', `${JR('{学生|がくせい}')} · ${JR('{先生|せんせい}')} · ${JR('{誕生日|たんじょうび}')}`],
        ['語', 'ngôn ngữ', 'ご', `${JR('{日本語|にほんご}')}`],
        ['何', 'cái gì', 'なん', `${JR('{何歳|なんさい}')} · ${JR('{何|なん} です か')}`],
        ['私', 'tôi', 'わたし', `${JR('{私|わたし} は ワン です')}`],
        ['英', 'Anh', 'えい', `${JR('{英語|えいご}')}`],
        ['員', 'nhân viên', 'いん', `${JR('{会社員|かいしゃいん}')} · ${JR('{社員|しゃいん}')}`],
      ],
      'Bảng tra nhanh',
    ),

    H(`${LV.de} — A. Chữ nào có nghĩa…? (10 câu)`),
    MC('lt-b1-han-nghia', 'A. Chọn chữ Hán đúng với nghĩa', [
      Q('"Người"', '人', '本 | 生 | 日', '人 = người.'),
      Q('"Học"', '学', '員 | 語 | 英', '学 = học.'),
      Q('"Ngôn ngữ / tiếng"', '語', '英 | 何 | 私', '語 = ngôn ngữ.'),
      Q('"Tôi"', '私', '何 | 員 | 生', '私 = わたし.'),
      Q('"Cái gì"', '何', '私 | 語 | 日', '何 = なん/なに.'),
      Q('"Nhân viên"', '員', '学 | 人 | 英', '員 = いん.'),
      Q('"Sinh, sống"', '生', '日 | 英 | 本', '生 = せい/しょう/じょう.'),
      Q('"Ngày, mặt trời"', '日', '本 | 人 | 語', '日 = にち/ひ.'),
      Q('"Anh (nước Anh)"', '英', '員 | 学 | 生', '英 = えい.'),
      Q('"Gốc; sách"', '本', '日 | 人 | 学', '本 = ほん.'),
    ]),

    H(`${LV.de} — B. Đọc từ ghép (20 câu)`),
    RDQ('lt-b1-han-doc', 'B. Chọn cách đọc đúng', [
      ['{日本|にほん}', 'にほん', ['にほ', 'ひほん', 'じつほん'], '日本 = にほん (cũng đọc にっぽん).'],
      ['{日本人|にほんじん}', 'にほんじん', ['にほんひと', 'にほんにん', 'ひほんじん'], '人 sau tên nước = じん.'],
      ['{中国人|ちゅうごくじん}', 'ちゅうごくじん', ['ちゅうこくじん', 'ちゅうごくにん', 'なかこくじん'], '中国 = ちゅうごく (ご đục).'],
      ['{韓国人|かんこくじん}', 'かんこくじん', ['かんごくじん', 'からこくじん', 'かんこくにん'], '韓国 = かんこく.'],
      ['{学生|がくせい}', 'がくせい', ['がっせい', 'まなせい', 'がくしょう'], '学生 = がくせい.'],
      ['{先生|せんせい}', 'せんせい', ['せんしょう', 'さきせい', 'せんなま'], '先生 = せんせい.'],
      ['{大学|だいがく}', 'だいがく', ['おおがく', 'たいがく', 'だいがっ'], '大学 = だいがく.'],
      ['{日本語|にほんご}', 'にほんご', ['にほんごう', 'にほんぎょ', 'ひほんご'], '語 = ご.'],
      ['{英語|えいご}', 'えいご', ['えいぎょ', 'ひでご', 'えいがく'], '英語 = えいご.'],
      ['{何歳|なんさい}', 'なんさい', ['なにさい', 'かさい', 'なんざい'], '何 trước さい = なん.'],
      ['{私|わたし}', 'わたし', ['わだし', 'しわ', 'わたち'], '私 = わたし.'],
      ['{会社員|かいしゃいん}', 'かいしゃいん', ['かいしゃいいん', 'かいしゃえん', 'かしゃいん'], '会社員 = かいしゃいん.'],
      ['{社員|しゃいん}', 'しゃいん', ['しゃえん', 'じゃいん', 'しゃいいん'], '社員 = しゃいん.'],
      ['{誕生日|たんじょうび}', 'たんじょうび', ['たんせいび', 'だんじょうび', 'たんじょうにち'], '誕生日 = たんじょうび (生 = じょう, 日 = び).'],
      ['{日本語学校|にほんごがっこう}', 'にほんごがっこう', ['にほんごがくこう', 'にほんがっこう', 'にほんごがっそう'], '学校 = がっこう.'],
      ['{趣味|しゅみ}', 'しゅみ', ['しゅうみ', 'しゅみい', 'しょみ'], '趣味 = しゅみ.'],
      ['{映画|えいが}', 'えいが', ['えいかく', 'うつがく', 'えいがご'], '映画 = えいが.'],
      ['{読書|どくしょ}', 'どくしょ', ['よみしょ', 'どくそ', 'どしょく'], '読書 = どくしょ.'],
      ['{料理|りょうり}', 'りょうり', ['りょり', 'りょうれ', 'れうり'], '料理 = りょうり.'],
      ['{旅行|りょこう}', 'りょこう', ['りょうこう', 'たびこう', 'りょこ'], '旅行 = りょこう (không kéo dài ở りょ).'],
    ]),

    H(`${LV.vua} — C. Chọn chữ đúng khi cho cách đọc (10 câu)`),
    MC('lt-b1-han-viet', 'C. Cách đọc → chữ Hán', [
      Q('にほんじん', '日本人', '日本入 | 日木人 | 曰本人', '日本人: 日 + 本 + 人.'),
      Q('がくせい', '学生', '字生 | 学主 | 学先', '学生: 学 + 生.'),
      Q('えいご', '英語', '莫語 | 英話 | 央語', '英語: 英 + 語.'),
      Q('かいしゃいん', '会社員', '会社貝 | 会社負 | 合社員', '会社員: 員 (chứ không phải 貝).'),
      Q('わたし', '私', '科 | 秒 | 和', '私 = わたし.'),
      Q('なんさい', '何歳', '河歳 | 向歳 | 同歳', '何歳: 何 (có bộ 亻).'),
      Q('せんせい', '先生', '光生 | 先主 | 元生', '先生.'),
      Q('にほんご', '日本語', '日本話 | 日木語 | 日本詩', '語 (ngôn ngữ).'),
      Q('だいがく', '大学', '犬学 | 太学 | 大字', '大学: 大 + 学.'),
      Q('たんじょうび', '誕生日', '誕主日 | 証生日 | 誕生白', '誕生日.'),
    ]),

    H(`${LV.vua} — D. Gõ cách đọc bằng hiragana (12 câu)`),
    QZ('lt-b1-han-go', 'D. Viết cách đọc (hiragana)', 'fill', [
      A('日本人', 'にほんじん'),
      A('学生', 'がくせい'),
      A('先生', 'せんせい'),
      A('大学', 'だいがく'),
      A('日本語', 'にほんご'),
      A('英語', 'えいご'),
      A('何歳', 'なんさい'),
      A('私', 'わたし'),
      A('会社員', 'かいしゃいん'),
      A('社員', 'しゃいん'),
      A('誕生日', 'たんじょうび'),
      A('日本語学校', 'にほんごがっこう'),
    ]),

    H(`${LV.kho} — E. Đọc to KHÔNG furigana (tự chấm) — 12 câu`),
    READK('lt-b1-han-docto', 'E. Đọc to rồi bấm xem đáp án', 'Đọc cả câu thành tiếng trước, rồi mới bấm xem cách đọc.', [
      RK('{私|わたし} は {日本人|にほんじん} です。', 'Tôi là người Nhật.'),
      RK('{私|わたし} は {学生|がくせい} です。', 'Tôi là học sinh.'),
      RK('^ワン-さん は {中国人|ちゅうごくじん} です。', 'Wan là người Trung Quốc.'),
      RK('{先生|せんせい} は {日本人|にほんじん} です か。', 'Thầy/cô là người Nhật phải không?'),
      RK('{大学|だいがく} の {学生|がくせい} です。', 'Là sinh viên đại học.'),
      RK('{日本語|にほんご} の {先生|せんせい} です。', 'Là cô giáo tiếng Nhật.'),
      RK('{英語|えいご} の {先生|せんせい} は {会社員|かいしゃいん} じゃ ありません。', 'Thầy dạy tiếng Anh không phải nhân viên công ty.'),
      RK('{何歳|なんさい} です か。', 'Bạn bao nhiêu tuổi?'),
      RK('{私|わたし} の {誕生日|たんじょうび} は {5月|ごがつ} {5日|いつか} です。', 'Sinh nhật tôi là ngày 5 tháng 5.'),
      RK('{趣味|しゅみ} は {映画|えいが} と {音楽|おんがく} です。', 'Sở thích là phim và âm nhạc.'),
      RK('{日本語学校|にほんごがっこう} の {学生|がくせい} です。', 'Là học sinh trường tiếng Nhật.'),
      RK('{社員|しゃいん} は {韓国人|かんこくじん} です。', 'Nhân viên đó là người Hàn Quốc.'),
    ]),

    H(`${LV.kho} — F. Câu hỏi nhận mặt trong đoạn (6 câu)`),
    MC('lt-b1-han-doan', 'F. Đọc đoạn và trả lời', [
      Q('「{私|わたし}は{日本人|にほんじん}じゃありません。{中国人|ちゅうごくじん}です。」 — Người nói là…', 'Người Trung Quốc', 'Người Nhật | Người Hàn Quốc | Người Thái', '日本人じゃありません → 中国人です.'),
      Q('「{私|わたし}は{学生|がくせい}です。{大学|だいがく}で{日本語|にほんご}を…」 — Người nói là…', 'Sinh viên', 'Giáo viên | Nhân viên công ty | Không rõ', '学生です.'),
      Q('「{先生|せんせい}は{英語|えいご}の{教師|きょうし}です。」 — Thầy/cô dạy…', 'Tiếng Anh', 'Tiếng Nhật | Toán | Âm nhạc', '英語の教師.'),
      Q('「{誕生日|たんじょうび}は{9月|くがつ}{1日|ついたち}です。」 — Sinh nhật vào…', 'Ngày 1 tháng 9', 'Ngày 9 tháng 1 | Ngày 1 tháng 1 | Tháng 9 ngày 9', '9月1日.'),
      Q('「{何歳|なんさい}ですか」 hỏi…', 'Tuổi', 'Ngày sinh | Quê | Nghề', '何歳 = mấy tuổi.'),
      Q('「{会社員|かいしゃいん}」 gồm mấy chữ Hán?', '3 chữ (会・社・員)', '2 chữ | 4 chữ | 1 chữ', '会 + 社 + 員.'),
    ]),

    H('✍ Tập viết tay (Apple Pencil / chuột)'),
    WRITE('lt-b1-han-tapviet', 'Tập viết 10 chữ Hán + vài từ', ['日', '本', '人', '学', '生', '語', '何', '私', '英', '員', '日本人', '学生', '日本語', '英語', '会社員'], 'Viết đúng thứ tự nét; sau đó bật "Che mẫu" để tự nhớ.', {
      '日本人': 'にほんじん · người Nhật',
      '学生': 'がくせい · học sinh',
      '日本語': 'にほんご · tiếng Nhật',
      '英語': 'えいご · tiếng Anh',
      '会社員': 'かいしゃいん · nhân viên công ty',
    }),
  ],
};

/* ───────── 3. NGỮ PHÁP 1: ポイント 1–2 ───────── */

const L1_NP1: Lesson = {
  id: 'lt-b1-ngu-phap-1',
  kind: 'grammar',
  title: 'Luyện thêm Bài 1 — Ngữ pháp 1: N1 は N2 です · ですか · はい／いいえ · じゃありません (ポイント 1–2)',
  goal: 'Nói và hỏi "N1 là N2", trả lời はい／いいえ và phủ định đúng — từ nhận biết đến tự viết câu.',
  minutes: 55,
  blocks: [
    NOTE('Học thế nào', [
      'Ba khuôn cần thuộc: **N は N です** · **N は N ですか** · **N は N じゃありません**. Đặt chúng cạnh nhau và nói to mỗi lần chia.',
      'Khi trả lời câu hỏi có か: **はい + câu khẳng định** hoặc **いいえ + じゃありません + thông tin đúng**.',
      'Lỗi hay mắc: tự gắn **さん** vào tên mình; trả lời ~~はい、じゃありません~~; quên **か** ở câu hỏi; đọc **は** thành ha.',
    ]),
    TABLE(
      ['Khuôn', 'Ví dụ', 'Ghi chú'],
      [
        ['N1 は N2 です', `${JR('{私|わたし} は ^ワン です')}`, 'Khẳng định. は đọc wa.'],
        ['N1 は N2 ですか', `${JR('^ワン-さん は {学生|がくせい} です か')}`, 'Câu hỏi Có/Không; thêm か.'],
        ['はい、N2 です', `${JR('はい、 {学生|がくせい} です')}`, 'Đúng → はい.'],
        ['いいえ、N2 じゃありません', `${JR('いいえ、 {学生|がくせい} じゃ ありません')}`, 'Sai → いいえ + じゃありません.'],
      ],
      'Bốn dòng cần thuộc lòng',
    ),
    EXS([
      E('{私|わたし} は ^マルコ です。', 'Tôi là Marco.'),
      E('^ワン-さん は {中国人|ちゅうごくじん} です か。', 'Bạn Wan là người Trung Quốc à?'),
      E('いいえ、 {中国人|ちゅうごくじん} じゃ ありません。 {韓国人|かんこくじん} です。', 'Không, không phải người Trung Quốc. Là người Hàn Quốc.'),
    ]),

    H(`${LV.de} — A. Chọn đuôi câu (12 câu)`),
    MC('lt-b1-g1-duoi', 'A. です／ですか／じゃありません', [
      Q('{私|わたし}は{学生|がくせい}＿＿＿。 (khẳng định)', 'です', 'ですか | じゃありません | か', 'Khẳng định: です.'),
      Q('ワンさんは{会社員|かいしゃいん}＿＿＿。 (câu hỏi)', 'ですか', 'です | じゃありません | ですです', 'Hỏi: ですか.'),
      Q('{私|わたし}は{先生|せんせい}＿＿＿。 (phủ định)', 'じゃありません', 'ですか | です | ですじゃない', 'Phủ định: じゃありません.'),
      Q('パクさんは{韓国人|かんこくじん}＿＿＿。 (khẳng định)', 'です', 'ですか | じゃありません | じゃですか', 'です.'),
      Q('マルコさんは{学生|がくせい}＿＿＿。 (hỏi)', 'ですか', 'です | じゃありません | か です', 'ですか.'),
      Q('{私|わたし}は{教師|きょうし}＿＿＿。 (phủ định)', 'じゃありません', 'ですか | ですない | じゃです', 'じゃありません.'),
      Q('アンナさんは{中国人|ちゅうごくじん}＿＿＿。 (phủ định)', 'じゃありません', 'です | ですか | ないです', 'じゃありません.'),
      Q('カルロスさんは{会社員|かいしゃいん}＿＿＿。 (hỏi)', 'ですか', 'です | じゃありません | ないですか', 'ですか.'),
      Q('{私|わたし}は{日本人|にほんじん}＿＿＿。 (khẳng định)', 'です', 'ですか | じゃありません | かです', 'です.'),
      Q('ダニエルさんは{学生|がくせい}＿＿＿。 (phủ định)', 'じゃありません', 'です | ですか | ですじゃありません', 'じゃありません.'),
      Q('{木村|きむら}さんは{先生|せんせい}＿＿＿。 (hỏi)', 'ですか', 'です | じゃありません | ないですか', 'ですか.'),
      Q('{私|わたし}の{名前|なまえ}は ワン＿＿＿。 (khẳng định)', 'です', 'ですか | じゃありません | か', 'です.'),
    ]),

    H(`${LV.de} — B. はい hay いいえ? (10 câu)`),
    MC('lt-b1-g1-hai-iie', 'B. Chọn từ trả lời đúng với sự thật', [
      Q('「ワンさんは{中国人|ちゅうごくじん}ですか。」 (Wan thật sự là người Trung Quốc)', 'はい、{中国人|ちゅうごくじん}です。', 'いいえ、{中国人|ちゅうごくじん}です。 | はい、{中国人|ちゅうごくじん}じゃありません。 | いいえ、{中国人|ちゅうごくじん}ですか。', 'Đúng → はい + khẳng định.'),
      Q('「パクさんは{日本人|にほんじん}ですか。」 (Park là người Hàn)', 'いいえ、{日本人|にほんじん}じゃありません。', 'はい、{日本人|にほんじん}です。 | いいえ、{日本人|にほんじん}です。 | はい、{日本人|にほんじん}じゃありません。', 'Sai → いいえ + じゃありません.'),
      Q('「{先生|せんせい}ですか。」 (bạn là sinh viên)', 'いいえ、{先生|せんせい}じゃありません。{学生|がくせい}です。', 'はい、{学生|がくせい}です。 | いいえ、{学生|がくせい}じゃありません。 | はい、{先生|せんせい}じゃありません。', 'いいえ + phủ định + thông tin đúng.'),
      Q('「{学生|がくせい}ですか。」 (bạn là sinh viên)', 'はい、{学生|がくせい}です。', 'いいえ、{学生|がくせい}です。 | はい、{学生|がくせい}じゃありません。 | いいえ、{先生|せんせい}です。', 'Đúng → はい.'),
      Q('「マルコさんはイタリア{人|じん}ですか。」 (đúng)', 'はい、イタリア{人|じん}です。', 'いいえ、イタリア{人|じん}です。 | はい、イタリア{人|じん}じゃありません。 | いいえ、ロシア{人|じん}です。', 'はい + khẳng định.'),
      Q('「{会社員|かいしゃいん}ですか。」 (bạn là giáo viên)', 'いいえ、{会社員|かいしゃいん}じゃありません。{教師|きょうし}です。', 'はい、{教師|きょうし}です。 | いいえ、{会社員|かいしゃいん}です。 | はい、{会社員|かいしゃいん}じゃありません。', 'いいえ + phủ định.'),
      Q('「アンナさんはロシア{人|じん}ですか。」 (đúng)', 'はい、ロシア{人|じん}です。', 'いいえ、ロシア{人|じん}です。 | はい、ロシア{人|じん}じゃありません。 | いいえ、{日本人|にほんじん}です。', 'Đúng → はい.'),
      Q('「{学生|がくせい}ですか。」 (bạn là nhân viên)', 'いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', 'はい、{学生|がくせい}です。 | いいえ、{学生|がくせい}です。 | はい、{会社員|かいしゃいん}じゃありません。', 'Sai → いいえ.'),
      Q('「ダニエルさんは{先生|せんせい}ですか。」 (Daniel là sinh viên)', 'いいえ、{先生|せんせい}じゃありません。', 'はい、{先生|せんせい}です。 | いいえ、{先生|せんせい}です。 | はい、{先生|せんせい}じゃありません。', 'Sai → いいえ.'),
      Q('「ワンさんですか。」 (đúng là Wan)', 'はい、ワンです。', 'いいえ、ワンです。 | はい、ワンさんです。 | いいえ、ワンじゃありません。', 'はい; tên mình không có さん.'),
    ]),

    H(`${LV.vua} — C. Sửa câu sai (10 câu)`),
    MC('lt-b1-g1-sua', 'C. Câu nào ĐÚNG?', [
      Q('Chọn câu ĐÚNG:', '{私|わたし}はワンです。', '{私|わたし}はワンさんです。 | {私|わたし}はワンですか。 | {私|わたし}のワンです。', 'Tên mình không có さん; câu giới thiệu không có か.'),
      Q('Chọn câu ĐÚNG:', 'マルコさんは{学生|がくせい}じゃありません。', 'マルコさんは{学生|がくせい}じゃですか。 | マルコさんは{学生|がくせい}ありません。 | マルコさんは{学生|がくせい}ないです。', 'Phủ định: じゃありません.'),
      Q('Chọn câu ĐÚNG:', 'ワンさんは{中国人|ちゅうごくじん}ですか。', 'ワンさんは{中国人|ちゅうごくじん}ですが。 | ワンさんは{中国人|ちゅうごくじん}ですも。 | ワンさんは{中国人|ちゅうごくじん}かです。', 'Hỏi: ですか.'),
      Q('Chọn câu ĐÚNG:', 'いいえ、{学生|がくせい}じゃありません。', 'はい、{学生|がくせい}じゃありません。 | いいえ、{学生|がくせい}です。 | はい、{学生|がくせい}ですか。', 'いいえ + じゃありません.'),
      Q('Chọn câu ĐÚNG:', '{私|わたし}は{会社員|かいしゃいん}です。', '{私|わたし}は{会社員|かいしゃいん}をです。 | {私|わたし}を{会社員|かいしゃいん}です。 | {私|わたし}に{会社員|かいしゃいん}です。', 'N は N です.'),
      Q('Trợ từ 「は」 trong 「{私|わたし}はワンです」 đọc là…', 'wa', 'ha | ba | e', 'Trợ từ は đọc wa.'),
      Q('Chọn câu ĐÚNG:', 'パクさんは{韓国人|かんこくじん}です。', 'パクは{韓国人|かんこくじん}さんです。 | パクさんが{韓国人|かんこくじん}です。 | パクさんは{韓国人|かんこくじん}ですか。', 'さん gắn tên người khác, đứng ngay sau tên.'),
      Q('Chọn câu ĐÚNG:', '{先生|せんせい}は{日本人|にほんじん}じゃありません。', '{先生|せんせい}は{日本人|にほんじん}じゃです。 | {先生|せんせい}は{日本人|にほんじん}ありません。 | {先生|せんせい}は{日本人|にほんじん}ないません。', 'じゃありません.'),
      Q('Chọn câu ĐÚNG:', '{私|わたし}は{教師|きょうし}です。', '{私|わたし}は{教師|きょうし}ですか。 | {私|わたし}は{教師|きょうし}じゃです。 | {私|わたし}は{教師|きょうし}ません。', 'です.'),
      Q('Chọn câu ĐÚNG:', 'ブラジル{人|じん}です。', 'ブラジルひとです。 | ブラジルにんです。 | ブラジルじです。', '人 sau tên nước = じん.'),
    ]),

    H(`${LV.vua} — D. Ghép câu (8 câu)`),
    BUILD('lt-b1-g1-ghep', 'D. Sắp xếp các mảnh thành câu đúng', [
      BD('Tôi là Marco.', '{私|わたし} は ^マルコ です。', ['の', 'が']),
      BD('Anh Wan có phải người Trung Quốc không?', '^ワン-さん は {中国人|ちゅうごくじん} です か。', ['の', 'を']),
      BD('Không, tôi không phải sinh viên.', 'いいえ、 {学生|がくせい} じゃ ありません。', ['です', 'を']),
      BD('Vâng, tôi là nhân viên công ty.', 'はい、 {会社員|かいしゃいん} です。', ['じゃ', 'か']),
      BD('Cô giáo là người Nhật.', '{先生|せんせい} は {日本人|にほんじん} です。', ['か', 'も']),
      BD('Park không phải người Hàn Quốc.', '^パク-さん は {韓国人|かんこくじん} じゃ ありません。', ['です', 'か']),
      BD('Daniel là sinh viên phải không?', '^ダニエル-さん は {学生|がくせい} です か。', ['じゃ', 'を']),
      BD('Tôi không phải giáo viên.', '{私|わたし} は {教師|きょうし} じゃ ありません。', ['です', 'か']),
    ]),

    H(`${LV.kho} — E. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b1-g1-dich', 'E. Gõ câu tiếng Nhật', 'translate', [
      AS('Tôi là Wan.', '{私|わたし}はワンです', 'N は N です'),
      AS('Anh Marco là người Ý.', 'マルコさんはイタリア{人|じん}です'),
      AS('Chị Anna là người Nga phải không?', 'アンナさんはロシア{人|じん}ですか', 'ですか'),
      AS('Không, tôi không phải người Nga.', ['いいえ、ロシア{人|じん}じゃありません', 'いいえ、{私|わたし}はロシア{人|じん}じゃありません']),
      AS('Tôi là sinh viên.', '{私|わたし}は{学生|がくせい}です'),
      AS('Anh Park không phải nhân viên công ty.', 'パクさんは{会社員|かいしゃいん}じゃありません'),
      AS('Cô giáo là người Nhật phải không?', '{先生|せんせい}は{日本人|にほんじん}ですか'),
      AS('Vâng, đúng. Cô là người Nhật.', ['はい、{日本人|にほんじん}です', 'はい、そうです。{日本人|にほんじん}です']),
      AS('Tôi không phải giáo viên. Tôi là sinh viên.', ['{私|わたし}は{教師|きょうし}じゃありません。{学生|がくせい}です', '{教師|きょうし}じゃありません。{学生|がくせい}です']),
      AS('Daniel là người Úc, không phải người Mỹ.', ['ダニエルさんはオーストラリア{人|じん}です。アメリカ{人|じん}じゃありません', 'ダニエルさんはアメリカ{人|じん}じゃありません。オーストラリア{人|じん}です']),
    ], 'N1 は N2 です／ですか／じゃありません'),

    H(`${LV.kho} — F. Hỏi – đáp trong tình huống (8 câu)`),
    MC('lt-b1-g1-tinh-huong', 'F. Chọn câu trả lời tự nhiên nhất', [
      Q('A: 「はじめまして。ワンです。」 B: 「＿＿＿」', 'はじめまして。マルコです。どうぞよろしくお{願|ねが}いします。', 'こちらこそ。{私|わたし}はワンです。 | いいえ、マルコです。 | そうですか。マルコさんです。', 'Gặp lần đầu → đáp はじめまして + tên + よろしく.'),
      Q('A: 「どうぞよろしくお{願|ねが}いします。」 B: 「＿＿＿」', 'こちらこそ。', 'はじめまして。 | いいえ。 | はい、そうです。', 'こちらこそ.'),
      Q('A: 「あのう、すみません。{学生|がくせい}ですか。」 B: 「＿＿＿」', 'はい、{学生|がくせい}です。', 'こちらこそ。 | はじめまして。 | あのう、すみません。', 'Hỏi về nghề → đáp có / không.'),
      Q('A: 「{日本人|にほんじん}ですか。」 (bạn là người Việt) B: 「＿＿＿」', 'いいえ、{日本人|にほんじん}じゃありません。ベトナム{人|じん}です。', 'はい、{日本人|にほんじん}です。 | いいえ、{日本人|にほんじん}です。 | はい、ベトナム{人|じん}じゃありません。', 'いいえ + phủ định + thông tin đúng.'),
      Q('A: 「ワンさんは{会社員|かいしゃいん}ですか。」 B: (Wan thật sự là sinh viên) 「＿＿＿」', 'いいえ、{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。', 'はい、{会社員|かいしゃいん}です。 | いいえ、{会社員|かいしゃいん}です。 | そうですか。', 'Sai thực tế → いいえ.'),
      Q('A: 「ロシア{人|じん}ですか。」 (bạn là người Nga) B: 「＿＿＿」', 'はい、そうです。', 'いいえ、そうです。 | はい、そうじゃありません。 | いいえ、{私|わたし}は。', 'はい、そうです。 (cũng đúng khi chỉ xác nhận)'),
      Q('A: 「{私|わたし}は{日本人|にほんじん}です。」 B: 「＿＿＿」 (phản ứng nghe tin mới)', 'そうですか。', 'こちらこそ。 | はじめまして。 | いいえ。', 'Phản ứng với tin mới: そうですか.'),
      Q('A: 「{木村|きむら}さんですか。」 B: (bạn không phải) 「＿＿＿」', 'いいえ、{木村|きむら}じゃありません。', 'はい、{木村|きむら}です。 | はい、{木村|きむら}さんです。 | いいえ、{木村|きむら}です。', 'Phủ định tên: じゃありません.'),
    ]),
  ],
};

/* ───────── 4. NGỮ PHÁP 2: ポイント 3–4 ───────── */

const L1_NP2: Lesson = {
  id: 'lt-b1-ngu-phap-2',
  kind: 'grammar',
  title: 'Luyện thêm Bài 1 — Ngữ pháp 2: どちら・いつ・何 · N1 の N2 · đọc tháng, ngày, tuổi (ポイント 3–4)',
  goal: 'Hỏi và đáp đúng bằng どちら／いつ／何, ghép N1 の N2, và đọc đúng tháng – ngày – tuổi (các biến âm hay ra thi).',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      '**Quy tắc vàng**: hỏi chỗ nào — đáp đúng chỗ đó. Từ để hỏi (どちら・いつ・何) đứng ngay vị trí của thông tin cần tìm, **không** lên đầu câu như tiếng Việt.',
      '**の** nối hai danh từ, N1 đứng trước: ふじみ大学**の**学生. Chuỗi dài đọc từ phải sang trái.',
      'Phần đọc **tháng – ngày – tuổi** có 26 câu: làm thật chậm và đọc to từng đáp án, đặc biệt các mục in đậm trong bảng của buổi 4.',
    ]),
    TABLE(
      ['Hỏi', 'Hỏi về', 'Trả lời mẫu'],
      [
        [`${JR('お-{国|くに} は どちら です か')}`, 'Nước', 'ベトナムです。／ベトナム人です。'],
        [`${JR('{誕生日|たんじょうび} は いつ です か')}`, 'Ngày sinh', '5月5日です。'],
        [`${JR('{趣味|しゅみ} は {何|なん} です か')}`, 'Sở thích', '音楽です。'],
        [`${JR('{何歳|なんさい} です か')}`, 'Tuổi', '二十歳です。'],
        [`${JR('お-{仕事|しごと} は？')}`, 'Nghề', '会社員です。'],
      ],
      'Năm câu hỏi cô hay hỏi',
    ),

    H(`${LV.de} — A. Chọn từ để hỏi (12 câu)`),
    MC('lt-b1-g2-hoi', 'A. どちら／いつ／何／何歳', [
      Q('お{国|くに}は＿＿＿ですか。 → ベトナムです。', 'どちら', 'いつ | {何|なん} | {何歳|なんさい}', 'Hỏi nước: どちら.'),
      Q('{誕生日|たんじょうび}は＿＿＿ですか。 → {5月|ごがつ}{5日|いつか}です。', 'いつ', 'どちら | {何|なん} | {何歳|なんさい}', 'Hỏi ngày: いつ.'),
      Q('{趣味|しゅみ}は＿＿＿ですか。 → {音楽|おんがく}です。', '{何|なん}', 'いつ | どちら | {何歳|なんさい}', 'Hỏi sở thích: 何.'),
      Q('マルコさんは＿＿＿ですか。 → {二十歳|はたち}です。', '{何歳|なんさい}', 'いつ | どちら | {何|なん}', 'Hỏi tuổi: 何歳.'),
      Q('お{仕事|しごと}は＿＿＿ですか。 → {会社員|かいしゃいん}です。', '{何|なん}', 'いつ | どちら | {何歳|なんさい}', 'Hỏi nghề: 何 (hoặc chỉ cần お仕事は？).'),
      Q('ワンさんの{誕生日|たんじょうび}は＿＿＿ですか。 → {3月|さんがつ}{21日|にじゅういちにち}です。', 'いつ', 'どちら | {何|なん} | {何歳|なんさい}', 'いつ.'),
      Q('お{国|くに}は＿＿＿ですか。 → タイです。', 'どちら', 'いつ | {何|なん} | {何歳|なんさい}', 'どちら.'),
      Q('パクさんの{趣味|しゅみ}は＿＿＿ですか。 → {水泳|すいえい}です。', '{何|なん}', 'いつ | どちら | {何歳|なんさい}', '何.'),
      Q('アンナさんは＿＿＿ですか。 → {十九歳|じゅうきゅうさい}です。', '{何歳|なんさい}', 'いつ | どちら | {何|なん}', '何歳.'),
      Q('{誕生日|たんじょうび}は＿＿＿ですか。 → {12月|じゅうにがつ}{25日|にじゅうごにち}です。', 'いつ', 'どちら | {何|なん} | {何歳|なんさい}', 'いつ.'),
      Q('カルロスさんの＿＿＿は？ → ブラジルです。', 'お{国|くに}', 'お{名前|なまえ} | {趣味|しゅみ} | {誕生日|たんじょうび}', 'Nước = お国.'),
      Q('「ABE の{社員|しゃいん}です」 trả lời cho câu hỏi…', 'お{仕事|しごと}は？', 'お{国|くに}は？ | {誕生日|たんじょうび}は？ | {趣味|しゅみ}は？', 'Nghề.'),
    ]),

    H(`${LV.de} — B. の hay không の? (10 câu)`),
    MC('lt-b1-g2-no', 'B. N1 の N2', [
      Q('ふじみ{大学|だいがく}＿＿＿{学生|がくせい}です。', 'の', 'は | と | も', 'N1 の N2.'),
      Q('{私|わたし}＿＿＿{名前|なまえ}はワンです。', 'の', 'は | と | も', '私の名前.'),
      Q('あおぞら{日本語学校|にほんごがっこう}＿＿＿{学生|がくせい}です。', 'の', 'は | を | が', '学校の学生.'),
      Q('ABE＿＿＿{社員|しゃいん}です。', 'の', 'は | と | も', '会社の社員.'),
      Q('{木村|きむら}さん＿＿＿{誕生日|たんじょうび}は{6月|ろくがつ}です。', 'の', 'は | と | も', '木村さんの誕生日.'),
      Q('さくら{高校|こうこう}＿＿＿{教師|きょうし}です。', 'の', 'は | と | も', '高校の教師.'),
      Q('カルロスさん＿＿＿お{国|くに}はブラジルです。', 'の', 'は | と | も', 'さんの国.'),
      Q('Chọn cách nói ĐÚNG "sinh viên của ĐH Fujimi":', 'ふじみ{大学|だいがく}の{学生|がくせい}', '{学生|がくせい}のふじみ{大学|だいがく} | ふじみ{大学|だいがく}と{学生|がくせい} | ふじみ{大学|だいがく}は{学生|がくせい}', 'N1 (trường) の N2 (sinh viên).'),
      Q('Chọn cách nói ĐÚNG "tên của tôi":', '{私|わたし}の{名前|なまえ}', '{名前|なまえ}の{私|わたし} | {私|わたし}は{名前|なまえ} | {私|わたし}と{名前|なまえ}', '私の名前.'),
      Q('Chọn cách nói ĐÚNG "giáo viên của trường THPT Sakura":', 'さくら{高校|こうこう}の{教師|きょうし}', '{教師|きょうし}のさくら{高校|こうこう} | さくら{高校|こうこう}と{教師|きょうし} | さくら{高校|こうこう}も{教師|きょうし}', 'trường の giáo viên.'),
    ]),

    H(`${LV.de} — C. Đọc tháng, ngày, tuổi (26 câu)`),
    NUMQ('lt-b1-g2-thang', 'C1. Tháng (6 câu)', [
      ['1月', 'いちがつ', ['いちつき', 'ひとがつ', 'いっがつ'], '1月 = いちがつ.'],
      ['4月', 'しがつ', ['よんがつ', 'しいがつ', 'よがつ'], '4月 là bất quy tắc: しがつ.'],
      ['7月', 'しちがつ', ['ななかつ', 'しっがつ', 'しちつき'], '7月 = しちがつ.'],
      ['9月', 'くがつ', ['きゅうがつ', 'くつき', 'ここのがつ'], '9月 = くがつ.'],
      ['10月', 'じゅうがつ', ['とおがつ', 'じっがつ', 'じゅうつき'], '10月 = じゅうがつ.'],
      ['12月', 'じゅうにがつ', ['じゅうにつき', 'じゅうにげつ', 'じゅうがつ'], '12月 = じゅうにがつ.'],
    ]),
    NUMQ('lt-b1-g2-ngay', 'C2. Ngày (14 câu)', [
      ['1日', 'ついたち', ['いちにち', 'いちか', 'ひとひ'], '1日 = ついたち.'],
      ['2日', 'ふつか', ['ににち', 'ふたか', 'にか'], '2日 = ふつか.'],
      ['3日', 'みっか', ['さんにち', 'みか', 'さんか'], '3日 = みっか.'],
      ['4日', 'よっか', ['よんにち', 'しにち', 'よか'], '4日 = よっか.'],
      ['5日', 'いつか', ['ごにち', 'ごか', 'いちか'], '5日 = いつか.'],
      ['6日', 'むいか', ['ろくにち', 'ろっか', 'むか'], '6日 = むいか.'],
      ['7日', 'なのか', ['しちにち', 'ななにち', 'ななか'], '7日 = なのか.'],
      ['8日', 'ようか', ['はちにち', 'やっか', 'はっか'], '8日 = ようか.'],
      ['9日', 'ここのか', ['きゅうにち', 'くにち', 'ここか'], '9日 = ここのか.'],
      ['10日', 'とおか', ['じゅうにち', 'じっか', 'とか'], '10日 = とおか.'],
      ['14日', 'じゅうよっか', ['じゅうよんにち', 'じゅうしにち', 'じゅうよか'], '14日 = じゅうよっか.'],
      ['15日', 'じゅうごにち', ['じゅうごか', 'じゅういつか', 'じゅうごうにち'], '15日 = じゅうごにち (quy tắc).'],
      ['20日', 'はつか', ['にじゅうにち', 'にじゅっか', 'はたち'], '20日 = はつか; 20歳 = はたち.'],
      ['24日', 'にじゅうよっか', ['にじゅうよんにち', 'にじゅうしにち', 'にじゅうよか'], '24日 = にじゅうよっか.'],
    ]),
    NUMQ('lt-b1-g2-tuoi', 'C3. Tuổi (6 câu)', [
      ['1歳', 'いっさい', ['いちさい', 'ひとさい', 'いっせい'], '1歳 = いっさい.'],
      ['8歳', 'はっさい', ['はちさい', 'やっさい', 'はっせい'], '8歳 = はっさい.'],
      ['10歳', 'じゅっさい', ['じゅうさい', 'とおさい', 'じゅっせい'], '10歳 = じゅっさい.'],
      ['18歳', 'じゅうはっさい', ['じゅうはちさい', 'じゅっはっさい', 'じゅうやっさい'], '18歳 = じゅうはっさい.'],
      ['20歳', 'はたち', ['にじゅうさい', 'にじゅうねん', 'はつか'], '20歳 = はたち.'],
      ['21歳', 'にじゅういっさい', ['にじゅういちさい', 'にじゅうひとさい', 'はたちいち'], '21歳 = にじゅういっさい.'],
    ]),

    H(`${LV.vua} — D. Hỏi – đáp (10 câu)`),
    MC('lt-b1-g2-hoi-dap', 'D. Chọn câu trả lời đúng', [
      Q('「お{国|くに}はどちらですか。」', 'ベトナムです。', 'ベトナムをです。 | はい、ベトナムです。 | ベトナムですか。', 'Câu hỏi có từ để hỏi → không đáp はい/いいえ.'),
      Q('「{誕生日|たんじょうび}はいつですか。」', '{5月|ごがつ}{5日|いつか}です。', 'はい、{5月|ごがつ}です。 | {二十歳|はたち}です。 | {5日|いつか}{5月|ごがつ}です。', 'Tháng trước, ngày sau.'),
      Q('「{趣味|しゅみ}は{何|なん}ですか。」', '{音楽|おんがく}です。', 'いいえ、{音楽|おんがく}です。 | {音楽|おんがく}ですか。 | はい、{音楽|おんがく}。', 'Trả lời bằng sở thích.'),
      Q('「{何歳|なんさい}ですか。」', '{二十歳|はたち}です。', '{5月|ごがつ}です。 | はい、{二十歳|はたち}です。 | {二十日|はつか}です。', 'Hỏi tuổi → 20 tuổi = はたち.'),
      Q('「お{仕事|しごと}は？」', '{会社員|かいしゃいん}です。', 'はい、{会社員|かいしゃいん}です。 | ベトナムです。 | {5月|ごがつ}です。', 'Hỏi nghề.'),
      Q('「ワンさんは{学生|がくせい}ですか。」', 'はい、{学生|がくせい}です。', 'ベトナムです。 | {学生|がくせい}は？ | {二十歳|はたち}です。', 'Hỏi Có/Không → はい.'),
      Q('「{誕生日|たんじょうび}はいつですか。」 (4 tháng 4)', '{4月|しがつ}{4日|よっか}です。', '{4月|よんがつ}{4日|よんにち}です。 | {4日|よっか}{4月|しがつ}です。 | {4月|しがつ}{4日|よんにち}です。', '4月4日 = しがつよっか.'),
      Q('「お{国|くに}はどちらですか。」 (bạn đến từ Nga)', 'ロシアです。', 'ロシア{人|じん}ですか。 | ロシアはどちらですか。 | はい、ロシアです。', 'Trả lời tên nước.'),
      Q('「{趣味|しゅみ}は{何|なん}ですか。」 (sở thích là đọc sách và phim)', '{読書|どくしょ}と{映画|えいが}です。', '{読書|どくしょ}の{映画|えいが}です。 | {読書|どくしょ}も{映画|えいが}です。 | {読書|どくしょ}を{映画|えいが}です。', 'Nối bằng と.'),
      Q('「{何歳|なんさい}ですか。」 (bạn 18 tuổi)', '{18歳|じゅうはっさい}です。', '{18歳|じゅうはちさい}です。 | {18日|じゅうはちにち}です。 | {18月|じゅうはちがつ}です。', '18歳 = じゅうはっさい.'),
    ]),

    H(`${LV.vua} — E. Ghép câu (8 câu)`),
    BUILD('lt-b1-g2-ghep', 'E. Sắp xếp các mảnh thành câu đúng', [
      BD('Nước của bạn là nước nào?', 'お-{国|くに} は どちら です か。', ['の', 'いつ']),
      BD('Sinh nhật của bạn là khi nào?', '{誕生日|たんじょうび} は いつ です か。', ['どちら', '{何|なん}']),
      BD('Sở thích của bạn là gì?', '{趣味|しゅみ} は {何|なん} です か。', ['いつ', 'どちら']),
      BD('Tôi là sinh viên của ĐH Fujimi.', '{私|わたし} は ふじみ-{大学|だいがく} の {学生|がくせい} です。', ['が', 'と']),
      BD('Sinh nhật của tôi là ngày 5 tháng 5.', '{私|わたし} の {誕生日|たんじょうび} は {5月|ごがつ} {5日|いつか} です。', ['も', 'を']),
      BD('Anh Carlos là nhân viên công ty ABE.', '^カルロス-さん は ABE の {社員|しゃいん} です。', ['も', 'と']),
      BD('Tên của tôi là Wan.', '{私|わたし} の {名前|なまえ} は ^ワン です。', ['さん', 'が']),
      BD('Cô Nishikawa là giáo viên trường THPT Sakura.', '^ニシカワ-{先生|せんせい} は さくら-{高校|こうこう} の {教師|きょうし} です。', ['と', 'か']),
    ]),

    H(`${LV.vua} — F. Viết cách đọc (12 câu)`),
    QZ('lt-b1-g2-doc', 'F. Viết cách đọc bằng hiragana', 'fill', [
      A('4月', 'しがつ'),
      A('7月', 'しちがつ'),
      A('9月', 'くがつ'),
      A('3日', 'みっか'),
      A('6日', 'むいか'),
      A('8日', 'ようか'),
      A('20日', 'はつか'),
      A('24日', 'にじゅうよっか'),
      A('18歳', 'じゅうはっさい'),
      A('20歳 (từ đặc biệt)', 'はたち'),
      A('1歳', 'いっさい'),
      A('何日 (hỏi ngày)', 'なんにち'),
    ]),

    H(`${LV.kho} — G. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b1-g2-dich', 'G. Gõ câu tiếng Nhật', 'translate', [
      AS('Nước của bạn là nước nào?', 'お{国|くに}はどちらですか'),
      AS('Sinh nhật của bạn là khi nào?', '{誕生日|たんじょうび}はいつですか'),
      AS('Sinh nhật của tôi là ngày 20 tháng 10.', '{私|わたし}の{誕生日|たんじょうび}は{10月|じゅうがつ}{20日|はつか}です', 'じゅうがつ はつか'),
      AS('Tôi 18 tuổi.', '{私|わたし}は{18歳|じゅうはっさい}です'),
      AS('Chị Mary bao nhiêu tuổi?', 'メアリーさんは{何歳|なんさい}ですか'),
      AS('Tôi là sinh viên ĐH Fujimi.', '{私|わたし}はふじみ{大学|だいがく}の{学生|がくせい}です'),
      AS('Anh Carlos là nhân viên công ty ABE.', 'カルロスさんはABEの{社員|しゃいん}です'),
      AS('Sở thích của bạn là gì?', '{趣味|しゅみ}は{何|なん}ですか'),
      AS('Nghề của bạn là gì?', ['お{仕事|しごと}は', 'お{仕事|しごと}は{何|なん}ですか']),
      AS('Tên của tôi là Marco.', '{私|わたし}の{名前|なまえ}はマルコです'),
    ], 'どちら・いつ・何・N の N'),

    H(`${LV.kho} — H. Tìm chỗ sai (8 câu)`),
    MC('lt-b1-g2-sai', 'H. Câu nào CÓ LỖI?', [
      Q('Câu nào có lỗi?', '{学生|がくせい}のふじみ{大学|だいがく}です。', 'ふじみ{大学|だいがく}の{学生|がくせい}です。 | {私|わたし}の{名前|なまえ}はワンです。 | ABEの{社員|しゃいん}です。', 'Trật tự の sai.'),
      Q('Câu nào có lỗi?', '{誕生日|たんじょうび}はどちらですか。', '{誕生日|たんじょうび}はいつですか。 | お{国|くに}はどちらですか。 | {趣味|しゅみ}は{何|なん}ですか。', 'Hỏi ngày sinh phải dùng いつ.'),
      Q('Câu nào có lỗi?', 'お{国|くに}はいつですか。', 'お{国|くに}はどちらですか。 | {誕生日|たんじょうび}はいつですか。 | {何歳|なんさい}ですか。', 'Hỏi nước phải dùng どちら.'),
      Q('Câu nào có lỗi?', '{私|わたし}は{5日|いつか}{5月|ごがつ}です。', '{私|わたし}の{誕生日|たんじょうび}は{5月|ごがつ}{5日|いつか}です。 | {誕生日|たんじょうび}は{5月|ごがつ}です。 | {誕生日|たんじょうび}は{5日|いつか}です。', 'Tháng trước, ngày sau.'),
      Q('Câu nào có lỗi? (đọc)', '4月 = よんがつ', '4月 = しがつ | 7月 = しちがつ | 9月 = くがつ', '4月 phải là しがつ.'),
      Q('Câu nào có lỗi? (đọc)', '20歳 = にじゅうさい', '20歳 = はたち | 18歳 = じゅうはっさい | 8歳 = はっさい', '20歳 = はたち.'),
      Q('Câu nào có lỗi?', 'ワンさんの{趣味|しゅみ}はいつですか。', 'ワンさんの{趣味|しゅみ}は{何|なん}ですか。 | ワンさんの{誕生日|たんじょうび}はいつですか。 | ワンさんのお{国|くに}はどちらですか。', '趣味 → 何.'),
      Q('Câu nào có lỗi?', '{私|わたし}の{名前|なまえ}はワンさんです。', '{私|わたし}の{名前|なまえ}はワンです。 | {私|わたし}はワンです。 | ワンです。', 'Không thêm さん vào tên mình.'),
    ]),
  ],
};


/* ───────── 5. NGỮ PHÁP 3: ポイント 5–6 ───────── */

const L1_NP3: Lesson = {
  id: 'lt-b1-ngu-phap-3',
  kind: 'grammar',
  title: 'Luyện thêm Bài 1 — Ngữ pháp 3: N1 と N2 · N も (ポイント 5–6) + câu hỏi sở thích',
  goal: 'Nối hai danh từ bằng と, nói "cũng" bằng も, phân biệt と／も／の／は và đáp câu hỏi về sở thích đúng.',
  minutes: 50,
  blocks: [
    NOTE('Học thế nào', [
      'Phân biệt bằng hình ảnh: **と = dấu +** (và), **も = dấu =** (cũng), **の = dấu sở hữu**, **は = chủ đề**.',
      'Khi có **も**, nó **thay chỗ** của は — không viết は も liền nhau.',
      'Lỗi hay mắc: dùng **も** thay **と** để "và"; nối hai **câu** bằng と; quên はい／いいえ khi được hỏi liệt kê.',
    ]),
    TABLE(
      ['Trợ từ', 'Nghĩa', 'Ví dụ'],
      [
        ['と', 'và (nối danh từ)', `${JR('{趣味|しゅみ} は {音楽|おんがく} と {読書|どくしょ} です')}`],
        ['も', 'cũng (thay は)', `${JR('{私|わたし} も {学生|がくせい} です')}`],
        ['の', 'của', `${JR('{私|わたし} の {趣味|しゅみ}')}`],
        ['は', 'chủ đề', `${JR('{私|わたし} は {学生|がくせい} です')}`],
      ],
      'Bốn trợ từ của Bài 1',
    ),

    H(`${LV.de} — A. Chọn と／も／の／は (14 câu)`),
    MC('lt-b1-g3-tro-tu', 'A. Trợ từ', [
      Q('{趣味|しゅみ}は{音楽|おんがく}＿＿＿{読書|どくしょ}です。', 'と', 'も | の | は', 'Nối hai danh từ: と.'),
      Q('ワンさんは{学生|がくせい}です。パクさん＿＿＿{学生|がくせい}です。', 'も', 'と | の | は', 'Cũng: も.'),
      Q('{私|わたし}＿＿＿{趣味|しゅみ}はサッカーです。', 'の', 'と | も | は', '私の趣味.'),
      Q('{私|わたし}＿＿＿ワンです。', 'は', 'と | も | の', 'N は N です.'),
      Q('マルコさん＿＿＿パクさんは{学生|がくせい}です。', 'と', 'も | の | は', 'Marco và Park: と.'),
      Q('{趣味|しゅみ}は{旅行|りょこう}＿＿＿{料理|りょうり}です。', 'と', 'も | の | は', 'Du lịch và nấu ăn.'),
      Q('{私|わたし}は{会社員|かいしゃいん}です。ワンさん＿＿＿{会社員|かいしゃいん}です。', 'も', 'と | の | は', 'Cũng: も.'),
      Q('アンナさん＿＿＿{趣味|しゅみ}は{映画|えいが}です。', 'の', 'と | も | は', 'Sở thích của Anna.'),
      Q('{私|わたし}の{趣味|しゅみ}は{水泳|すいえい}です。{私|わたし}＿＿＿{水泳|すいえい}です。', 'も', 'と | の | は', 'Tôi cũng: も.'),
      Q('ダニエルさん＿＿＿オーストラリア{人|じん}です。', 'は', 'と | も | の', 'Chủ đề: は.'),
      Q('{日本|にほん}＿＿＿{韓国|かんこく}＿＿＿{中国|ちゅうごく}', 'と / と', 'も / も | の / の | は / は', 'Liệt kê: と.'),
      Q('ワンさん＿＿＿パクさん＿＿＿{学生|がくせい}です。', 'と / は', 'も / と | の / は | と / と', 'ワンさんとパクさんは学生です.'),
      Q('{私|わたし}はサッカー＿＿＿テニスです。 (nối hai sở thích)', 'と', 'も | の | は', 'Nối: と.'),
      Q('パクさんは{韓国人|かんこくじん}です。{私|わたし}＿＿＿{韓国人|かんこくじん}です。', 'も', 'と | の | は', 'Cũng: も.'),
    ]),

    H(`${LV.de} — B. Gõ trợ từ vào chỗ trống (10 câu)`),
    QZ('lt-b1-g3-go-tro-tu', 'B. Gõ MỘT trợ từ', 'fill', [
      A('{趣味|しゅみ}は{音楽|おんがく}（　）{読書|どくしょ}です。', 'と'),
      A('ワンさんは{学生|がくせい}です。パクさん（　）{学生|がくせい}です。', 'も'),
      A('{私|わたし}（　）{名前|なまえ}はワンです。', 'の'),
      A('{私|わたし}（　）マルコです。', 'は'),
      A('{私|わたし}の{趣味|しゅみ}はテニス（　）{水泳|すいえい}です。', 'と'),
      A('ワンさんは{学生|がくせい}じゃありません。パクさん（　）{学生|がくせい}じゃありません。', 'も'),
      A('{先生|せんせい}（　）パクさんは{日本人|にほんじん}です。', 'と'),
      A('アンナさん（　）{趣味|しゅみ}は{読書|どくしょ}です。', 'の'),
      A('マルコさんは{会社員|かいしゃいん}です。カルロスさん（　）{会社員|かいしゃいん}です。', 'も'),
      A('{私|わたし}（　）{日本人|にほんじん}じゃありません。', 'は'),
    ], 'は・の・と・も'),

    H(`${LV.vua} — C. Hỏi – đáp có も／と (10 câu)`),
    MC('lt-b1-g3-mo-to', 'C. Chọn câu trả lời / phản ứng đúng', [
      Q('A: 「{私|わたし}の{趣味|しゅみ}はサッカーです。」 B (cũng thích bóng đá): 「＿＿＿」', 'あっ、{私|わたし}もサッカーです。{同|おな}じですね。', 'あっ、{私|わたし}とサッカーです。 | あっ、{私|わたし}のサッカーです。 | あっ、{私|わたし}はサッカーもです。', 'も thay は.'),
      Q('「ワンさんは{学生|がくせい}です。パクさんは？」 (Park cũng là sinh viên)', 'パクさんも{学生|がくせい}です。', 'パクさんは{学生|がくせい}もです。 | パクさんの{学生|がくせい}です。 | パクさんと{学生|がくせい}です。', 'も thay は.'),
      Q('「マルコさんは{会社員|かいしゃいん}じゃありません。ダニエルさんは？」 (cũng không phải)', 'ダニエルさんも{会社員|かいしゃいん}じゃありません。', 'ダニエルさんは{会社員|かいしゃいん}もじゃありません。 | ダニエルさんと{会社員|かいしゃいん}じゃありません。 | ダニエルさんの{会社員|かいしゃいん}じゃありません。', 'Phủ định + も vẫn dùng じゃありません.'),
      Q('「{趣味|しゅみ}は{何|なん}ですか。」 (bóng đá và bơi lội)', 'サッカーと{水泳|すいえい}です。', 'サッカーも{水泳|すいえい}です。 | サッカーの{水泳|すいえい}です。 | サッカーは{水泳|すいえい}です。', 'Nối: と.'),
      Q('「{趣味|しゅみ}はサッカーと{水泳|すいえい}ですか。」 (thật ra là bóng đá và tennis)', 'いいえ、サッカーとテニスです。', 'はい、サッカーとテニスです。 | いいえ、サッカーと{水泳|すいえい}です。 | はい、サッカーと{水泳|すいえい}じゃありません。', 'いいえ + thông tin đúng.'),
      Q('「{私|わたし}は{二十歳|はたち}です。パクさんは？」 (Park cũng 20)', 'パクさんも{二十歳|はたち}です。', 'パクさんの{二十歳|はたち}です。 | パクさんと{二十歳|はたち}です。 | パクさんは{二十歳|はたち}もです。', 'も.'),
      Q('「{私|わたし}はブラジル{人|じん}です。」 B (cũng người Brazil): 「＿＿＿」', 'あっ、{私|わたし}もブラジル{人|じん}です。', 'あっ、{私|わたし}とブラジル{人|じん}です。 | あっ、{私|わたし}のブラジル{人|じん}です。 | あっ、{私|わたし}はブラジル{人|じん}もです。', 'も.'),
      Q('「アンナさんも{学生|がくせい}ですか。」 (Anna đúng là sinh viên)', 'はい、{学生|がくせい}です。', 'いいえ、{学生|がくせい}です。 | はい、{学生|がくせい}じゃありません。 | ブラジルです。', 'はい + khẳng định.'),
      Q('Câu có nghĩa "Tôi cũng không phải sinh viên":', '{私|わたし}も{学生|がくせい}じゃありません。', '{私|わたし}は{学生|がくせい}もじゃありません。 | {私|わたし}の{学生|がくせい}じゃありません。 | {私|わたし}と{学生|がくせい}じゃありません。', 'N も … じゃありません.'),
      Q('「{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}と{読書|どくしょ}です」 có mấy sở thích?', '3', '2 | 1 | 4', 'と nối ba danh từ.'),
    ]),

    H(`${LV.vua} — D. Ghép câu (8 câu)`),
    BUILD('lt-b1-g3-ghep', 'D. Sắp xếp các mảnh thành câu đúng', [
      BD('Sở thích của tôi là bóng đá và bơi lội.', '{私|わたし} の {趣味|しゅみ} は サッカー と {水泳|すいえい} です。', ['も', 'が']),
      BD('Tôi cũng là sinh viên.', '{私|わたし} も {学生|がくせい} です。', ['と', 'の']),
      BD('Wan và Park là sinh viên.', '^ワン-さん と ^パク-さん は {学生|がくせい} です。', ['も', 'の']),
      BD('Anna cũng không phải nhân viên công ty.', '^アンナ-さん も {会社員|かいしゃいん} じゃ ありません。', ['は', 'と']),
      BD('Sở thích của Marco cũng là phim.', '^マルコ-さん の {趣味|しゅみ} も {映画|えいが} です。', ['と', 'は']),
      BD('Sở thích của bạn là phim và âm nhạc phải không?', '{趣味|しゅみ} は {映画|えいが} と {音楽|おんがく} です か。', ['も', 'の']),
      BD('Park cũng là người Hàn Quốc.', '^パク-さん も {韓国人|かんこくじん} です。', ['と', 'が']),
      BD('Giống nhau nhỉ!', '{同|おな}じ です ね。', ['も', 'か']),
    ]),

    H(`${LV.kho} — E. Tìm câu SAI (8 câu)`),
    MC('lt-b1-g3-sai', 'E. Câu nào SAI?', [
      Q('Muốn nói "bóng đá VÀ bơi lội", câu nào SAI?', '{趣味|しゅみ}はサッカーも{水泳|すいえい}です。', '{趣味|しゅみ}はサッカーと{水泳|すいえい}です。 | {私|わたし}も{学生|がくせい}です。 | {私|わたし}の{趣味|しゅみ}はテニスです。', 'も ≠ và; nối dùng と.'),
      Q('Câu nào SAI?', '{私|わたし}は{学生|がくせい}もです。', '{私|わたし}も{学生|がくせい}です。 | ワンさんも{学生|がくせい}です。 | {私|わたし}は{学生|がくせい}です。', 'も phải đứng sau chủ đề, thay は.'),
      Q('Muốn nói "Wan là sinh viên", câu nào SAI?', 'ワンさんと{学生|がくせい}です。', 'ワンさんは{学生|がくせい}です。 | ワンさんも{学生|がくせい}です。 | ワンさんとパクさんは{学生|がくせい}です。', 'と chỉ nối hai danh từ ngang hàng.'),
      Q('Câu nào SAI?', '{私|わたし}の{趣味|しゅみ}はも{映画|えいが}です。', '{私|わたし}の{趣味|しゅみ}も{映画|えいが}です。 | {私|わたし}の{趣味|しゅみ}は{映画|えいが}です。 | {私|わたし}も{映画|えいが}です。', 'も thay は, không đi liền は.'),
      Q('Câu nào SAI?', 'パクさんの{韓国人|かんこくじん}です。', 'パクさんは{韓国人|かんこくじん}です。 | パクさんも{韓国人|かんこくじん}です。 | パクさんの{趣味|しゅみ}は{水泳|すいえい}です。', 'Câu giới thiệu dùng は/も, không phải の.'),
      Q('Câu nào SAI?', '{趣味|しゅみ}はサッカーとですか。', '{趣味|しゅみ}はサッカーですか。 | {趣味|しゅみ}はサッカーと{水泳|すいえい}ですか。 | {趣味|しゅみ}は{何|なん}ですか。', 'と phải nối hai danh từ.'),
      Q('Câu nào SAI?', 'マルコさんはもイタリア{人|じん}です。', 'マルコさんもイタリア{人|じん}です。 | マルコさんはイタリア{人|じん}です。 | マルコさんの{国|くに}はイタリアです。', 'は・も không đi liền nhau.'),
      Q('Câu nào SAI?', '{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}と。', '{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}です。 | {趣味|しゅみ}は{映画|えいが}です。 | {趣味|しゅみ}は{映画|えいが}と{読書|どくしょ}と{音楽|おんがく}です。', 'Câu phải kết bằng です.'),
    ]),

    H(`${LV.kho} — F. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b1-g3-dich', 'F. Gõ câu tiếng Nhật', 'translate', [
      AS('Sở thích của tôi là bóng đá.', '{私|わたし}の{趣味|しゅみ}はサッカーです'),
      AS('Sở thích của tôi là bóng đá và bơi lội.', '{私|わたし}の{趣味|しゅみ}はサッカーと{水泳|すいえい}です'),
      AS('Tôi cũng là sinh viên.', '{私|わたし}も{学生|がくせい}です'),
      AS('Park cũng là người Hàn Quốc.', 'パクさんも{韓国人|かんこくじん}です'),
      AS('Sở thích của Anna cũng là phim.', 'アンナさんの{趣味|しゅみ}も{映画|えいが}です'),
      AS('Wan và Marco là sinh viên.', 'ワンさんとマルコさんは{学生|がくせい}です'),
      AS('Marco cũng không phải nhân viên công ty.', 'マルコさんも{会社員|かいしゃいん}じゃありません'),
      AS('Sở thích của bạn là gì? — Du lịch và nấu ăn.', ['{趣味|しゅみ}は{何|なん}ですか。{旅行|りょこう}と{料理|りょうり}です']),
      AS('Sở thích của tôi là đọc sách và âm nhạc. Wan thì sao?', ['{私|わたし}の{趣味|しゅみ}は{読書|どくしょ}と{音楽|おんがく}です。ワンさんは', '{私|わたし}の{趣味|しゅみ}は{読書|どくしょ}と{音楽|おんがく}です。ワンさんは？']),
      AS('A, sở thích của tôi cũng là âm nhạc. Giống nhau nhỉ.', ['あっ、{私|わたし}の{趣味|しゅみ}も{音楽|おんがく}です。{同|おな}じですね', 'あっ、{私|わたし}も{音楽|おんがく}です。{同|おな}じですね']),
    ], 'と・も・の・は'),
  ],
};

/* ───────── 6. NGỮ PHÁP TRỘN ───────── */

const L1_TRON: Lesson = {
  id: 'lt-b1-ngu-phap-tron',
  kind: 'grammar',
  title: 'Luyện thêm Bài 1 — Ngữ pháp trộn ポイント 1–6: trợ từ, sửa câu sai, dịch hai chiều',
  goal: 'Dùng đồng thời cả sáu ポイント của Bài 1 như trong đề: chọn trợ từ, hiểu nghĩa câu, sửa lỗi, dịch Việt–Nhật.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Đây là bài **trộn**: không biết trước câu nào dùng điểm ngữ pháp nào. Trước mỗi câu hỏi tự hỏi: *cần trợ từ gì? Là câu hỏi hay khẳng định?*',
      'Sai câu nào thì mở lại lesson `lt-b1-ngu-phap-1/2/3` đúng nhóm đó.',
      'Cuối bài có 2 bài **sắp lượt thoại** — đó là mini-bài nói.',
    ]),

    H(`${LV.de} — A. Chọn trợ từ / đuôi câu (20 câu)`),
    MC('lt-b1-gt-tro-tu', 'A. Điền vào chỗ trống', [
      Q('{私|わたし}＿＿＿ワンです。', 'は', 'の | と | も', 'N は N です.'),
      Q('お{国|くに}＿＿＿どちらですか。', 'は', 'の | と | も', 'Chủ đề: は.'),
      Q('ふじみ{大学|だいがく}＿＿＿{学生|がくせい}です。', 'の', 'は | と | も', 'N の N.'),
      Q('{趣味|しゅみ}＿＿＿{何|なん}ですか。', 'は', 'の | と | も', 'は.'),
      Q('{私|わたし}＿＿＿{趣味|しゅみ}は{読書|どくしょ}です。', 'の', 'は | と | も', '私の趣味.'),
      Q('{趣味|しゅみ}は{読書|どくしょ}＿＿＿{旅行|りょこう}です。', 'と', 'の | は | も', 'Nối: と.'),
      Q('{私|わたし}は{学生|がくせい}です。ワンさん＿＿＿{学生|がくせい}です。', 'も', 'と | の | は', 'Cũng: も.'),
      Q('パクさんは{学生|がくせい}です＿＿＿。', 'か', 'の | と | も', 'Câu hỏi: か.'),
      Q('{私|わたし}は{先生|せんせい}＿＿＿ありません。', 'じゃ', 'は | の | も', 'Phủ định: じゃありません.'),
      Q('{誕生日|たんじょうび}＿＿＿いつですか。', 'は', 'の | と | も', 'は.'),
      Q('マルコさん＿＿＿カルロスさんは{会社員|かいしゃいん}です。', 'と', 'は | の | も', 'Marco và Carlos: と.'),
      Q('アンナさん＿＿＿{趣味|しゅみ}は{映画|えいが}です。', 'の', 'は | と | も', 'Sở thích của Anna.'),
      Q('お{仕事|しごと}＿＿＿？', 'は', 'の | と | も', 'お仕事は？'),
      Q('{私|わたし}は{中国人|ちゅうごくじん}＿＿＿ありません。', 'じゃ', 'は | の | も', 'じゃありません.'),
      Q('パクさん＿＿＿{日本語学校|にほんごがっこう}の{学生|がくせい}です。', 'は', 'と | の | じゃ', 'Chủ đề.'),
      Q('カルロスさんはABE＿＿＿{社員|しゃいん}です。', 'の', 'は | と | も', '会社の社員.'),
      Q('{私|わたし}は{二十歳|はたち}です。マルコさん＿＿＿{二十歳|はたち}です。', 'も', 'と | の | は', 'Cũng: も.'),
      Q('お{名前|なまえ}＿＿＿{何|なん}ですか。', 'は', 'の | と | も', 'は.'),
      Q('{趣味|しゅみ}は サッカー＿＿＿テニスです。', 'と', 'の | は | も', 'と.'),
      Q('ロシア＿＿＿オーストラリアは{国|くに}です。', 'と', 'の | は | も', 'Nối hai nước: と.'),
    ]),

    H(`${LV.de} — B. Hiểu nghĩa câu (8 câu)`),
    MC('lt-b1-gt-nghia', 'B. Chọn nghĩa tiếng Việt đúng', [
      Q('{私|わたし}もイタリア{人|じん}です。', 'Tôi cũng là người Ý.', 'Tôi và người Ý. | Tôi là người Ý. (không có "cũng") | Tôi không phải người Ý.', 'も = cũng.'),
      Q('{趣味|しゅみ}は{料理|りょうり}と{旅行|りょこう}です。', 'Sở thích là nấu ăn và du lịch.', 'Sở thích là nấu ăn hoặc du lịch. | Tôi đi du lịch nấu ăn. | Tôi không thích nấu ăn.', 'と = và.'),
      Q('ワンさんは{会社員|かいしゃいん}じゃありません。', 'Wan không phải nhân viên công ty.', 'Wan là nhân viên công ty. | Wan có phải nhân viên công ty không? | Wan cũng là nhân viên công ty.', 'じゃありません = không phải.'),
      Q('ふじみ{大学|だいがく}の{学生|がくせい}ですか。', 'Bạn là sinh viên ĐH Fujimi à?', 'Bạn là giáo viên ĐH Fujimi à? | Fujimi là đại học à? | Bạn học ĐH Fujimi và làm nghề gì?', 'N1 の N2 + ですか.'),
      Q('{誕生日|たんじょうび}は{10月|じゅうがつ}{20日|はつか}です。', 'Sinh nhật là ngày 20 tháng 10.', 'Sinh nhật là ngày 10 tháng 20. | Sinh nhật là tháng 10 năm 20. | Sinh nhật là ngày 10 và 20.', 'Tháng trước, ngày sau.'),
      Q('お{国|くに}はどちらですか。', 'Bạn đến từ nước nào?', 'Bạn bao nhiêu tuổi? | Sinh nhật bạn khi nào? | Sở thích của bạn là gì?', 'お国 = nước.'),
      Q('あっ、{同|おな}じですね。', 'A, giống nhau nhỉ.', 'A, xin lỗi. | A, tôi cũng vậy. | A, chào bạn.', '同じ = giống nhau.'),
      Q('パクさんの{趣味|しゅみ}も{水泳|すいえい}です。', 'Sở thích của Park cũng là bơi lội.', 'Sở thích của Park là bơi lội và gì đó. | Park thích bơi lội. | Park không thích bơi lội.', 'も = cũng.'),
    ]),

    H(`${LV.vua} — C. Câu nào ĐÚNG? (10 câu)`),
    MC('lt-b1-gt-dung', 'C. Chọn câu đúng', [
      Q('Chọn câu ĐÚNG:', '{私|わたし}の{名前|なまえ}はワンです。', '{私|わたし}の{名前|なまえ}はワンさんです。 | {私|わたし}は{名前|なまえ}のワンです。 | {名前|なまえ}は{私|わたし}のワンです。', 'Tên mình không có さん.'),
      Q('Chọn câu ĐÚNG:', 'パクさんは{韓国人|かんこくじん}じゃありません。', 'パクさんは{韓国人|かんこくじん}ありません。 | パクさんは{韓国人|かんこくじん}ですじゃありません。 | パクさんは{韓国人|かんこくじん}じゃです。', 'じゃありません.'),
      Q('Chọn câu ĐÚNG:', '{趣味|しゅみ}は{何|なん}ですか。', '{趣味|しゅみ}はいつですか。 | {趣味|しゅみ}はどちらですか。 | {趣味|しゅみ}は{何歳|なんさい}ですか。', 'Hỏi sở thích: 何.'),
      Q('Chọn câu ĐÚNG:', '{誕生日|たんじょうび}は{5月|ごがつ}{5日|いつか}です。', '{誕生日|たんじょうび}は{5日|いつか}{5月|ごがつ}です。 | {誕生日|たんじょうび}は{5月|ごがつ}{5日|ごにち}です。 | {誕生日|たんじょうび}は{5月|ごがつ}{5日|いつか}ですか。', 'Tháng trước, ngày いつか.'),
      Q('Chọn câu ĐÚNG:', '{私|わたし}は{二十歳|はたち}です。', '{私|わたし}は{二十歳|にじゅうさい}です。 | {私|わたし}は{二十歳|はたち}ですか。 | {私|わたし}を{二十歳|はたち}です。', '20歳 = はたち.'),
      Q('Chọn câu ĐÚNG:', 'マルコさんもイタリア{人|じん}です。', 'マルコさんはもイタリア{人|じん}です。 | マルコさんとイタリア{人|じん}です。 | マルコさんのイタリア{人|じん}です。', 'も thay は.'),
      Q('Chọn câu ĐÚNG:', 'ABEの{社員|しゃいん}です。', 'ABEは{社員|しゃいん}です。 | ABEと{社員|しゃいん}です。 | ABEも{社員|しゃいん}です。', 'N1 の N2.'),
      Q('Chọn câu ĐÚNG:', 'いいえ、{学生|がくせい}じゃありません。', 'はい、{学生|がくせい}じゃありません。 | いいえ、{学生|がくせい}です。 | はい、{学生|がくせい}ですか。', 'いいえ + じゃありません.'),
      Q('Chọn câu ĐÚNG (nghề của mình):', '{私|わたし}は{教師|きょうし}です。', '{私|わたし}は{先生|せんせい}です。 | {私|わたし}は{社員|しゃいん}です。 | {私|わたし}は{教師|きょうし}ですか。', 'Nghề của mình: 教師.'),
      Q('Chọn câu ĐÚNG:', '{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}です。', '{趣味|しゅみ}は{映画|えいが}も{音楽|おんがく}です。 | {趣味|しゅみ}は{映画|えいが}の{音楽|おんがく}です。 | {趣味|しゅみ}は{映画|えいが}は{音楽|おんがく}です。', 'Nối: と.'),
    ]),

    H(`${LV.vua} — D. Ghép câu (6 câu)`),
    BUILD('lt-b1-gt-ghep', 'D. Sắp xếp các mảnh thành câu đúng', [
      BD('Anna cũng là người Nga phải không?', '^アンナ-さん も ロシア-{人|じん} です か。', ['の', 'と']),
      BD('Sinh nhật của Wan là ngày 21 tháng 3.', '^ワン-さん の {誕生日|たんじょうび} は {3月|さんがつ} {21日|にじゅういちにち} です。', ['も', 'を']),
      BD('Tôi là sinh viên của trường tiếng Nhật Aozora.', '{私|わたし} は あおぞら-{日本語学校|にほんごがっこう} の {学生|がくせい} です。', ['と', 'か']),
      BD('Sở thích của Carlos là tennis và bơi lội.', '^カルロス-さん の {趣味|しゅみ} は テニス と {水泳|すいえい} です。', ['も', 'が']),
      BD('Không, tôi không phải người Úc.', 'いいえ、 オーストラリア-{人|じん} じゃ ありません。', ['です', 'を']),
      BD('Rất vui được gặp. Mong được giúp đỡ.', 'はじめまして。 どうぞ よろしく お{願|ねが}い します。', ['こちらこそ', 'は']),
    ]),

    H(`${LV.kho} — E. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b1-gt-dich', 'E. Gõ câu tiếng Nhật', 'translate', [
      AS('Rất vui được gặp. Tôi là Anna.', 'はじめまして。{私|わたし}はアンナです'),
      AS('Nước của bạn là nước nào?', 'お{国|くに}はどちらですか'),
      AS('Tôi là người Việt Nam. Tôi là sinh viên.', ['ベトナム{人|じん}です。{学生|がくせい}です', '{私|わたし}はベトナム{人|じん}です。{学生|がくせい}です']),
      AS('Anh Carlos không phải người Mỹ.', 'カルロスさんはアメリカ{人|じん}じゃありません'),
      AS('Sinh nhật của tôi là ngày 8 tháng 12.', '{私|わたし}の{誕生日|たんじょうび}は{12月|じゅうにがつ}{8日|ようか}です', 'じゅうにがつ ようか'),
      AS('Sở thích của tôi là du lịch và nấu ăn.', '{私|わたし}の{趣味|しゅみ}は{旅行|りょこう}と{料理|りょうり}です'),
      AS('Bạn bao nhiêu tuổi?', '{何歳|なんさい}ですか'),
      AS('Wan cũng là sinh viên.', 'ワンさんも{学生|がくせい}です'),
      AS('Cô Nishikawa là giáo viên của trường THPT Sakura.', 'ニシカワ{先生|せんせい}はさくら{高校|こうこう}の{教師|きょうし}です'),
      AS('Sở thích của bạn là gì?', '{趣味|しゅみ}は{何|なん}ですか'),
    ], 'ポイント 1–6'),

    H(`${LV.kho} — F. Sắp xếp lượt thoại (2 hội thoại)`),
    BUILD('lt-b1-gt-xep-thoai', 'F. Sắp các lượt nói thành một hội thoại đúng thứ tự', [
      BDT('Gặp lần đầu: chào → tên → đáp.', [
        'はじめまして。 {私|わたし} は ^ワン です。',
        'はじめまして。 ^マルコ です。',
        'どうぞ よろしく お{願|ねが}い します。',
        'こちらこそ。',
      ]),
      BDT('Hỏi nước → đáp → hỏi nghề → đáp.', [
        'あのう、 お-{国|くに} は どちら です か。',
        'ブラジル です。',
        'お-{仕事|しごと} は？',
        '{会社員|かいしゃいん} です。',
      ]),
    ]),
  ],
};

/* ───────── 7. HỘI THOẠI ───────── */

const L1_HOI_THOAI: Lesson = {
  id: 'lt-b1-hoi-thoai',
  kind: 'conversation',
  title: 'Luyện thêm Bài 1 — Hội thoại: 5 đoạn mới (làm quen · nghề và trường · tuổi và sinh nhật · sở thích · phỏng vấn nhanh) + tự nói',
  goal: 'Hiểu, điền, sắp xếp lượt thoại và tự đóng vai các hội thoại làm quen, hỏi nghề, tuổi, sinh nhật, sở thích — đúng khuôn câu hỏi của thi nói.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Mỗi hội thoại: ① **đọc cả đoạn** (bật romaji nếu cần) ② trả lời câu hỏi hiểu ③ điền chỗ trống ④ **sắp lượt thoại** ⑤ che lời thoại, **đóng vai một người** và nói lại.',
      'Đóng vai là cách nhanh nhất để thi nói: bạn học **khung hỏi – đáp** thay vì từng chữ. Thay thông tin bằng của chính bạn.',
      'Lỗi hay mắc: thêm さん vào tên mình; quên はい／いいえ; sai chỗ も／と; đọc sai ngày 1–10, tuổi 20.',
    ]),
    TABLE(
      ['Hội thoại', 'Người nói', 'Chủ đề', 'Ngữ pháp chính'],
      [
        ['1', 'メアリー ↔ ダニエル', 'Làm quen lần đầu', 'は…です · じゃありません · こちらこそ'],
        ['2', '木村 ↔ パク', 'Nghề và nơi làm việc', 'の · 教師/社員 · も'],
        ['3', 'アンナ ↔ カルロス', 'Tuổi và sinh nhật', '何歳 · いつ · 〜月〜日'],
        ['4', 'ワン ↔ マルコ', 'Sở thích chung', 'と · も · 同じですね'],
        ['5', '先生 ↔ ナタポン', 'Phỏng vấn nhanh trong lớp', 'どちら · 何歳 · 何'],
      ],
    ),

    H(`${LV.de} — Hội thoại 1: Làm quen lần đầu`),
    DL('Hội thoại 1 — メアリーさんとダニエルさん', [
      ['メアリー', 'f', 'はじめまして。 ^メアリー です。 アメリカ-{人|じん} です。', 'Rất vui được gặp. Tôi là Mary. Tôi là người Mỹ.'],
      ['ダニエル', 'm', 'はじめまして。 ^ダニエル です。 オーストラリア-{人|じん} です。 どうぞ よろしく お{願|ねが}い します。', 'Rất vui được gặp. Tôi là Daniel. Tôi là người Úc. Mong được giúp đỡ.'],
      ['メアリー', 'f', 'こちらこそ。 ^ダニエル-さん は {学生|がくせい} です か。', 'Tôi cũng vậy. Anh Daniel là sinh viên à?'],
      ['ダニエル', 'm', 'いいえ、 {学生|がくせい} じゃ ありません。 {会社員|かいしゃいん} です。 ^メアリー-さん は？', 'Không, không phải sinh viên. Tôi là nhân viên công ty. Còn chị Mary?'],
      ['メアリー', 'f', '{私|わたし} は {大学|だいがく} の {学生|がくせい} です。', 'Tôi là sinh viên đại học.'],
    ]),
    MC('lt-b1-ht-1', 'Hiểu hội thoại 1 và điền chỗ trống (6 câu)', [
      Q('メアリーさんは どこの{人|ひと}ですか。', 'アメリカ{人|じん}', 'オーストラリア{人|じん} | {日本人|にほんじん} | イタリア{人|じん}', 'アメリカ人です。'),
      Q('ダニエルさんは どこの{人|ひと}ですか。', 'オーストラリア{人|じん}', 'アメリカ{人|じん} | {中国人|ちゅうごくじん} | ロシア{人|じん}', 'オーストラリア人です。'),
      Q('ダニエルさんの{仕事|しごと}は？', '{会社員|かいしゃいん}', '{学生|がくせい} | {教師|きょうし} | {先生|せんせい}', '会社員です。'),
      Q('メアリーさんは？', '{大学|だいがく}の{学生|がくせい}', '{会社員|かいしゃいん} | {高校|こうこう}の{教師|きょうし} | {社員|しゃいん}', '大学の学生です。'),
      Q('ダニエル：いいえ、{学生|がくせい}＿＿＿ありません。', 'じゃ', 'は | の | も', 'じゃありません.'),
      Q('メアリー：＿＿＿。 (đáp lại どうぞよろしく)', 'こちらこそ', 'そうですか | はじめまして | いいえ', 'こちらこそ.'),
    ]),
    BUILD('lt-b1-ht-1-xep', 'Sắp xếp lượt thoại 1 cho đúng thứ tự', [
      BDT('Chào → chào lại + よろしく → đáp → hỏi nghề.', [
        'はじめまして。 ^メアリー です。 アメリカ-{人|じん} です。',
        'はじめまして。 ^ダニエル です。 どうぞ よろしく お{願|ねが}い します。',
        'こちらこそ。',
        '^ダニエル-さん は {学生|がくせい} です か。',
      ]),
    ]),

    H(`${LV.de} — Hội thoại 2: Nghề và nơi làm việc`),
    DL('Hội thoại 2 — 木村さんとパクさん', [
      ['木村', 'f', '^パク-さん、 お-{仕事|しごと} は？', 'Anh Park, anh làm nghề gì?'],
      ['パク', 'm', 'ABE の {社員|しゃいん} です。 ^{木村|きむら}-さん は？', 'Tôi là nhân viên công ty ABE. Còn chị Kimura?'],
      ['木村', 'f', '{私|わたし} は さくら-{高校|こうこう} の {教師|きょうし} です。', 'Tôi là giáo viên trường THPT Sakura.'],
      ['パク', 'm', 'そう です か。 ^ワン-さん も {教師|きょうし} です か。', 'Vậy à. Chị Wan cũng là giáo viên à?'],
      ['木村', 'f', 'はい。 でも、 ^ワン-さん は ふじみ-{大学|だいがく} の {教師|きょうし} です。', 'Vâng. Nhưng chị Wan là giáo viên trường ĐH Fujimi.'],
    ]),
    MC('lt-b1-ht-2', 'Hiểu hội thoại 2 và điền chỗ trống (6 câu)', [
      Q('パクさんの{仕事|しごと}は？', 'ABEの{社員|しゃいん}', '{高校|こうこう}の{教師|きょうし} | {大学|だいがく}の{学生|がくせい} | {会社員|かいしゃいん}(không có tên công ty)', 'ABE の社員.'),
      Q('{木村|きむら}さんは？', 'さくら{高校|こうこう}の{教師|きょうし}', 'ふじみ{大学|だいがく}の{教師|きょうし} | ABEの{社員|しゃいん} | {学生|がくせい}', 'さくら高校の教師.'),
      Q('ワンさんは どこの{教師|きょうし}ですか。', 'ふじみ{大学|だいがく}', 'さくら{高校|こうこう} | ABE | あおぞら{日本語学校|にほんごがっこう}', 'ふじみ大学の教師.'),
      Q('ワンさんは さくら{高校|こうこう}の{教師|きょうし}ですか。', 'いいえ、ふじみ{大学|だいがく}の{教師|きょうし}です', 'はい、さくら{高校|こうこう}の{教師|きょうし}です | はい、{学生|がくせい}です | いいえ、{社員|しゃいん}です', 'ふじみ大学の教師.'),
      Q('パク：ABE＿＿＿{社員|しゃいん}です。', 'の', 'は | と | も', '会社の社員.'),
      Q('パク：ワンさん＿＿＿{教師|きょうし}ですか。 (cũng)', 'も', 'は | の | と', 'も.'),
    ]),
    BUILD('lt-b1-ht-2-xep', 'Sắp xếp lượt thoại 2', [
      BDT('Hỏi nghề → đáp + hỏi lại → đáp → hỏi tiếp.', [
        '^パク-さん、 お-{仕事|しごと} は？',
        'ABE の {社員|しゃいん} です。 ^{木村|きむら}-さん は？',
        '{私|わたし} は さくら-{高校|こうこう} の {教師|きょうし} です。',
        '^ワン-さん も {教師|きょうし} です か。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 3: Tuổi và sinh nhật`),
    DL('Hội thoại 3 — アンナさんとカルロスさん', [
      ['アンナ', 'f', '^カルロス-さん は {何歳|なんさい} です か。', 'Anh Carlos bao nhiêu tuổi?'],
      ['カルロス', 'm', '{41歳|よんじゅういっさい} です。 ^アンナ-さん は？', '41 tuổi. Còn chị Anna?'],
      ['アンナ', 'f', '{二十歳|はたち} です。 {誕生日|たんじょうび} は {4月|しがつ} {17日|じゅうしちにち} です か。', 'Tôi 20 tuổi. Sinh nhật anh là ngày 17 tháng 4 phải không?'],
      ['カルロス', 'm', 'はい、 そう です。 ^アンナ-さん の {誕生日|たんじょうび} は いつ です か。', 'Vâng, đúng. Sinh nhật chị Anna là khi nào?'],
      ['アンナ', 'f', '{5月|ごがつ} {5日|いつか} です。', 'Ngày 5 tháng 5.'],
    ]),
    MC('lt-b1-ht-3', 'Hiểu hội thoại 3 và điền chỗ trống (6 câu)', [
      Q('カルロスさんは{何歳|なんさい}ですか。', '{41歳|よんじゅういっさい}', '{40歳|よんじゅっさい} | {14歳|じゅうよんさい} | {21歳|にじゅういっさい}', '41 tuổi = よんじゅういっさい.'),
      Q('アンナさんは{何歳|なんさい}ですか。', '{二十歳|はたち}', '{18歳|じゅうはっさい} | {21歳|にじゅういっさい} | {30歳|さんじゅっさい}', '20歳 = はたち.'),
      Q('カルロスさんの{誕生日|たんじょうび}は？', '{4月|しがつ}{17日|じゅうしちにち}', '{7月|しちがつ}{14日|じゅうよっか} | {4月|しがつ}{7日|なのか} | {9月|くがつ}{17日|じゅうしちにち}', '4月17日.'),
      Q('アンナさんの{誕生日|たんじょうび}は？', '{5月|ごがつ}{5日|いつか}', '{5月|ごがつ}{15日|じゅうごにち} | {6月|ろくがつ}{5日|いつか} | {5月|ごがつ}{2日|ふつか}', '5月5日.'),
      Q('アンナ：{誕生日|たんじょうび}は＿＿＿{17日|じゅうしちにち}ですか。', '{4月|しがつ}', '{4日|よっか} | {7月|しちがつ} | {9月|くがつ}', '4月 = しがつ.'),
      Q('アンナ：{何歳|なんさい}ですか。 → カルロス：＿＿＿です。', '{41歳|よんじゅういっさい}', '{4月|しがつ} | {14日|じゅうよっか} | {41日|よんじゅういちにち}', '歳 (tuổi).'),
    ]),
    BUILD('lt-b1-ht-3-xep', 'Sắp xếp lượt thoại 3', [
      BDT('Hỏi tuổi → đáp + hỏi lại → đáp + hỏi sinh nhật → xác nhận.', [
        '^カルロス-さん は {何歳|なんさい} です か。',
        '{41歳|よんじゅういっさい} です。 ^アンナ-さん は？',
        '{二十歳|はたち} です。 {誕生日|たんじょうび} は {4月|しがつ} {17日|じゅうしちにち} です か。',
        'はい、 そう です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 4: Sở thích chung`),
    DL('Hội thoại 4 — ワンさんとマルコさん', [
      ['ワン', 'f', '^マルコ-さん の {趣味|しゅみ} は {何|なん} です か。', 'Sở thích của anh Marco là gì?'],
      ['マルコ', 'm', 'サッカー と テニス です。 ^ワン-さん は？', 'Bóng đá và tennis. Còn chị Wan?'],
      ['ワン', 'f', '{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です。 テニス も {趣味|しゅみ} です。', 'Sở thích của tôi là nấu ăn. Tennis cũng là sở thích.'],
      ['マルコ', 'm', 'あっ、 {私|わたし} も テニス です。 {同|おな}じ です ね。', 'A, tôi cũng là tennis. Giống nhau nhỉ.'],
      ['ワン', 'f', 'そう です ね。', 'Ừ nhỉ.'],
    ]),
    MC('lt-b1-ht-4', 'Hiểu hội thoại 4 và điền chỗ trống (6 câu)', [
      Q('マルコさんの{趣味|しゅみ}は？', 'サッカーとテニス', 'サッカーと{水泳|すいえい} | テニスと{料理|りょうり} | {料理|りょうり}と{映画|えいが}', 'サッカーとテニス.'),
      Q('ワンさんの{趣味|しゅみ}は？ (chính)', '{料理|りょうり}', 'サッカー | {映画|えいが} | {音楽|おんがく}', '料理 (và テニスも).'),
      Q('Sở thích chung của hai người là gì?', 'テニス', 'サッカー | {料理|りょうり} | {水泳|すいえい}', 'テニス.'),
      Q('マルコ：サッカー＿＿＿テニスです。', 'と', 'も | の | は', 'Nối: と.'),
      Q('ワン：テニス＿＿＿{趣味|しゅみ}です。 (cũng)', 'も', 'と | の | は', 'も.'),
      Q('マルコ：{同|おな}じですね。 ── ワン：＿＿＿', 'そうですね。', 'いいえ、じゃありません。 | はじめまして。 | こちらこそ。', 'Đồng tình: そうですね.'),
    ]),
    BUILD('lt-b1-ht-4-xep', 'Sắp xếp lượt thoại 4', [
      BDT('Hỏi sở thích → đáp + hỏi lại → đáp → đồng tình.', [
        '^マルコ-さん の {趣味|しゅみ} は {何|なん} です か。',
        'サッカー と テニス です。 ^ワン-さん は？',
        '{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です。 テニス も {趣味|しゅみ} です。',
        'あっ、 {私|わたし} も テニス です。',
      ]),
    ]),

    H(`${LV.kho} — Hội thoại 5: Phỏng vấn nhanh trong lớp`),
    DL('Hội thoại 5 — 先生とナタポンさん', [
      ['先生', 'f', '^ナタポン-さん、 お-{国|くに} は どちら です か。', 'Natapon, bạn đến từ nước nào?'],
      ['ナタポン', 'm', 'タイ です。', 'Thái Lan ạ.'],
      ['先生', 'f', '{何歳|なんさい} です か。', 'Bạn bao nhiêu tuổi?'],
      ['ナタポン', 'm', '{十九歳|じゅうきゅうさい} です。 {誕生日|たんじょうび} は {7月|しちがつ} {8日|ようか} です。', '19 tuổi ạ. Sinh nhật là ngày 8 tháng 7.'],
      ['先生', 'f', '{趣味|しゅみ} は {何|なん} です か。', 'Sở thích của bạn là gì?'],
      ['ナタポン', 'm', '{映画|えいが} と {音楽|おんがく} です。', 'Phim và âm nhạc ạ.'],
    ]),
    MC('lt-b1-ht-5', 'Hiểu hội thoại 5 và điền chỗ trống (8 câu)', [
      Q('ナタポンさんの{国|くに}は？', 'タイ', 'ロシア | ブラジル | {中国|ちゅうごく}', 'タイ.'),
      Q('ナタポンさんは{何歳|なんさい}ですか。', '{十九歳|じゅうきゅうさい}', '{十歳|じゅっさい} | {九歳|きゅうさい} | {二十歳|はたち}', '19 tuổi.'),
      Q('ナタポンさんの{誕生日|たんじょうび}は？', '{7月|しちがつ}{8日|ようか}', '{7月|しちがつ}{7日|なのか} | {8月|はちがつ}{7日|なのか} | {4月|しがつ}{8日|ようか}', '7月8日.'),
      Q('ナタポンさんの{趣味|しゅみ}は？', '{映画|えいが}と{音楽|おんがく}', '{映画|えいが}だけ | {音楽|おんがく}と{読書|どくしょ} | サッカーと{水泳|すいえい}', '映画と音楽.'),
      Q('{先生|せんせい}：お{国|くに}は＿＿＿ですか。', 'どちら', 'いつ | {何|なん} | {何歳|なんさい}', 'Hỏi nước: どちら.'),
      Q('{先生|せんせい}：＿＿＿ですか。 → {十九歳|じゅうきゅうさい}です。', '{何歳|なんさい}', 'いつ | どちら | {何|なん}', 'Hỏi tuổi.'),
      Q('{先生|せんせい}：{趣味|しゅみ}は＿＿＿ですか。', '{何|なん}', 'いつ | どちら | {何歳|なんさい}', 'Hỏi sở thích.'),
      Q('ナタポン：{映画|えいが}＿＿＿{音楽|おんがく}です。', 'と', 'も | の | は', 'Nối: と.'),
    ]),
    BUILD('lt-b1-ht-5-xep', 'Sắp xếp lượt thoại 5', [
      BDT('Hỏi nước → đáp → hỏi tuổi → đáp.', [
        '^ナタポン-さん、 お-{国|くに} は どちら です か。',
        'タイ です。',
        '{何歳|なんさい} です か。',
        '{十九歳|じゅうきゅうさい} です。',
      ]),
    ]),

    H(`${LV.kho} — Tự đóng vai (thu âm)`),
    NOTE('Cách làm', [
      'Chọn **một hội thoại**, che lời thoại của một vai, đọc vai còn lại thành tiếng và **tự đáp** vai bị che. Sau đó đổi vai.',
      'Lần 2: thay thông tin bằng của chính bạn (tên, nước, trường, tuổi, sinh nhật, sở thích).',
      'Lần 3: thu âm, nghe lại; kiểm tra: ☐ không có さん sau tên mình ☐ は đọc wa ☐ tháng/ngày/tuổi đọc đúng ☐ đủ câu.',
    ]),
    SPEAK('lt-b1-ht-noi', [
      'おなまえは なんですか。',
      'おくには どちらですか。',
      'おしごとは？',
      'なんさいですか。',
      'たんじょうびは いつですか。',
      'しゅみは なんですか。',
    ]),
  ],
};

/* ───────── 8. ĐỌC HIỂU ───────── */

const R1_1: [string, string][] = [
  ['はじめまして。', 'Rất vui được gặp.'],
  ['{私|わたし} は ^ミン です。', 'Tôi là Minh.'],
  ['ベトナム-{人|じん} です。', 'Tôi là người Việt Nam.'],
  ['{大学|だいがく} の {学生|がくせい} です。', 'Tôi là sinh viên đại học.'],
  ['{十九歳|じゅうきゅうさい} です。', 'Tôi 19 tuổi.'],
];
const R1_2: [string, string][] = [
  ['{私|わたし} は ^ソフィア です。', 'Tôi là Sofia.'],
  ['イタリア-{人|じん} です。', 'Tôi là người Ý.'],
  ['{会社員|かいしゃいん} です。', 'Tôi là nhân viên công ty.'],
  ['{誕生日|たんじょうび} は {6月|ろくがつ} {14日|じゅうよっか} です。', 'Sinh nhật tôi là ngày 14 tháng 6.'],
  ['{趣味|しゅみ} は {旅行|りょこう} と {料理|りょうり} です。', 'Sở thích của tôi là du lịch và nấu ăn.'],
];
const R1_3: [string, string][] = [
  ['はじめまして。 {私|わたし} は ^ヤマダ です。', 'Rất vui được gặp. Tôi là Yamada.'],
  ['{日本人|にほんじん} です。', 'Tôi là người Nhật.'],
  ['さくら-{日本語学校|にほんごがっこう} の {教師|きょうし} です。', 'Tôi là giáo viên của trường tiếng Nhật Sakura.'],
  ['{趣味|しゅみ} は サッカー です。', 'Sở thích của tôi là bóng đá.'],
  ['どうぞ よろしく お{願|ねが}い します。', 'Mong được giúp đỡ.'],
];
const R1_4: [string, string][] = [
  ['^ナタポン-さん は タイ-{人|じん} です。 {大学|だいがく} の {学生|がくせい} です。', 'Natapon là người Thái. Là sinh viên đại học.'],
  ['{趣味|しゅみ} は {音楽|おんがく} です。', 'Sở thích là âm nhạc.'],
  ['^アンナ-さん は ロシア-{人|じん} です。 アンナ-さん も {大学|だいがく} の {学生|がくせい} です。', 'Anna là người Nga. Anna cũng là sinh viên đại học.'],
  ['{趣味|しゅみ} は {音楽|おんがく} と {映画|えいが} です。', 'Sở thích là âm nhạc và phim.'],
  ['^ナタポン-さん も アンナ-さん も {音楽|おんがく} です。', 'Cả Natapon và Anna đều có sở thích là âm nhạc.'],
];
const R1_5: [string, string][] = [
  ['はじめまして。 {私|わたし} は ^カルロス です。', 'Rất vui được gặp. Tôi là Carlos.'],
  ['ブラジル-{人|じん} です。', 'Tôi là người Brazil.'],
  ['ABE の {社員|しゃいん} です。', 'Tôi là nhân viên công ty ABE.'],
  ['{四十一歳|よんじゅういっさい} です。', 'Tôi 41 tuổi.'],
  ['{誕生日|たんじょうび} は {4月|しがつ} {17日|じゅうしちにち} です。', 'Sinh nhật tôi là ngày 17 tháng 4.'],
  ['{趣味|しゅみ} は スポーツ です。', 'Sở thích của tôi là thể thao.'],
  ['サッカー と {水泳|すいえい} です。', 'Đó là bóng đá và bơi lội.'],
  ['どうぞ よろしく お{願|ねが}い します。', 'Mong được giúp đỡ.'],
];

const L1_DOC_HIEU: Lesson = {
  id: 'lt-b1-doc-hieu',
  kind: 'reading',
  title: 'Luyện thêm Bài 1 — Đọc hiểu: 5 đoạn tự giới thiệu từ ngắn đến dài (có furigana → không furigana)',
  goal: 'Đọc hiểu đoạn tự giới thiệu: trả lời câu hỏi chọn đáp án và đúng/sai, rồi đọc to đoạn dài không furigana như phần Reading của thi nói.',
  minutes: 55,
  blocks: [
    NOTE('Học thế nào', [
      'Đọc đoạn **hai lần**: lần 1 hiểu ý chính (ai, nước nào, nghề gì), lần 2 mới đọc câu hỏi và **tìm câu trả lời trong bài**.',
      'Câu đúng/sai có lựa chọn **"Không có trong bài"**: nếu bài không nói gì thì chọn nó, dù ngoài đời có thể đúng.',
      'Đoạn 5 là mức Khó và cũng là khuôn **Reading 40 điểm**: chuẩn bị 30 giây rồi đọc to một hơi.',
    ]),

    H(`${LV.de} — Đoạn 1: ミンさん`),
    ...PSG('ミンさん', R1_1),
    MC('lt-b1-dh-1', 'Câu hỏi đoạn 1 (6 câu)', [
      Q('ミンさんは どこの{人|ひと}ですか。', 'ベトナム{人|じん}', '{日本人|にほんじん} | {中国人|ちゅうごくじん} | タイ{人|じん}', 'ベトナム人です.'),
      Q('ミンさんの{仕事|しごと}は？', '{大学|だいがく}の{学生|がくせい}', '{会社員|かいしゃいん} | {教師|きょうし} | {社員|しゃいん}', '大学の学生.'),
      Q('ミンさんは{何歳|なんさい}ですか。', '{十九歳|じゅうきゅうさい}', '{二十歳|はたち} | {十歳|じゅっさい} | {九歳|きゅうさい}', '19 tuổi.'),
      TF('ミンさんは{日本人|にほんじん}です。', 'Sai', 'ベトナム人です.'),
      TF('ミンさんは{学生|がくせい}です。', 'Đúng', '大学の学生.'),
      TF('ミンさんの{趣味|しゅみ}は{音楽|おんがく}です。', 'Không có trong bài', 'Đoạn không nói về sở thích.'),
    ]),

    H(`${LV.de} — Đoạn 2: ソフィアさん`),
    ...PSG('ソフィアさん', R1_2),
    MC('lt-b1-dh-2', 'Câu hỏi đoạn 2 (7 câu)', [
      Q('ソフィアさんは どこの{人|ひと}ですか。', 'イタリア{人|じん}', 'ロシア{人|じん} | ブラジル{人|じん} | {韓国人|かんこくじん}', 'イタリア.'),
      Q('ソフィアさんの{仕事|しごと}は？', '{会社員|かいしゃいん}', '{学生|がくせい} | {教師|きょうし} | {先生|せんせい}', '会社員.'),
      Q('ソフィアさんの{誕生日|たんじょうび}は？', '{6月|ろくがつ}{14日|じゅうよっか}', '{6月|ろくがつ}{4日|よっか} | {4月|しがつ}{14日|じゅうよっか} | {6月|ろくがつ}{40日|よんじゅうにち}', '6月14日 = ろくがつじゅうよっか.'),
      Q('ソフィアさんの{趣味|しゅみ}は？', '{旅行|りょこう}と{料理|りょうり}', '{旅行|りょこう}だけ | {映画|えいが}と{料理|りょうり} | サッカーと{水泳|すいえい}', '旅行と料理.'),
      TF('ソフィアさんは{学生|がくせい}です。', 'Sai', '会社員です.'),
      TF('ソフィアさんの{趣味|しゅみ}は{旅行|りょこう}と{料理|りょうり}です。', 'Đúng', '旅行と料理.'),
      TF('ソフィアさんは{二十歳|はたち}です。', 'Không có trong bài', 'Tuổi không được nói tới.'),
    ]),

    H(`${LV.vua} — Đoạn 3: ヤマダさん`),
    ...PSG('ヤマダさん', R1_3),
    MC('lt-b1-dh-3', 'Câu hỏi đoạn 3 (7 câu)', [
      Q('ヤマダさんは どこの{人|ひと}ですか。', '{日本人|にほんじん}', '{中国人|ちゅうごくじん} | {韓国人|かんこくじん} | タイ{人|じん}', '日本人.'),
      Q('ヤマダさんの{仕事|しごと}は？', 'さくら{日本語学校|にほんごがっこう}の{教師|きょうし}', 'さくら{高校|こうこう}の{教師|きょうし} | ふじみ{大学|だいがく}の{学生|がくせい} | ABEの{社員|しゃいん}', 'さくら日本語学校の教師.'),
      Q('ヤマダさんの{趣味|しゅみ}は？', 'サッカー', 'テニス | {水泳|すいえい} | {映画|えいが}', 'サッカー.'),
      Q('Trong 「さくら{日本語学校|にほんごがっこう}の{教師|きょうし}」, の có nghĩa là…', 'của (N1 の N2)', 'và | cũng | là', 'の = của.'),
      TF('ヤマダさんは{学生|がくせい}です。', 'Sai', '教師です.'),
      TF('ヤマダさんの{誕生日|たんじょうび}は{5月|ごがつ}です。', 'Không có trong bài', 'Đoạn không nói về sinh nhật.'),
      TF('ヤマダさんは{日本人|にほんじん}です。', 'Đúng', '日本人です.'),
    ]),

    H(`${LV.vua} — Đoạn 4: ナタポンさんとアンナさん`),
    ...PSG('ナタポンさんとアンナさん', R1_4),
    MC('lt-b1-dh-4', 'Câu hỏi đoạn 4 (8 câu)', [
      Q('ナタポンさんは どこの{人|ひと}ですか。', 'タイ{人|じん}', 'ロシア{人|じん} | {日本人|にほんじん} | {中国人|ちゅうごくじん}', 'タイ人.'),
      Q('アンナさんは どこの{人|ひと}ですか。', 'ロシア{人|じん}', 'タイ{人|じん} | イタリア{人|じん} | ブラジル{人|じん}', 'ロシア人.'),
      Q('Nghề của cả hai người là gì?', '{大学|だいがく}の{学生|がくせい}', '{会社員|かいしゃいん} | {教師|きょうし} | {社員|しゃいん}', 'どちらも学生.'),
      Q('ナタポンさんの{趣味|しゅみ}は？', '{音楽|おんがく}', '{映画|えいが} | サッカー | {料理|りょうり}', '音楽.'),
      Q('アンナさんの{趣味|しゅみ}は？', '{音楽|おんがく}と{映画|えいが}', '{音楽|おんがく}だけ | {映画|えいが}だけ | {読書|どくしょ}と{旅行|りょこう}', '音楽と映画.'),
      Q('Hai người có chung sở thích nào?', '{音楽|おんがく}', '{映画|えいが} | サッカー | {料理|りょうり}', '音楽.'),
      TF('ナタポンさんの{趣味|しゅみ}は{映画|えいが}です。', 'Sai', 'ナタポンさんは音楽.'),
      Q('「アンナさんも{大学|だいがく}の{学生|がくせい}です」 の 「も」 は…', 'Anna cũng giống Natapon', 'Anna và Natapon | Anna của Natapon | Anna không phải', 'も = cũng.'),
    ]),

    H(`${LV.kho} — Đoạn 5: カルロスさん (đọc to)`),
    ...PSG('カルロスさん', R1_5),
    MC('lt-b1-dh-5', 'Câu hỏi đoạn 5 (9 câu)', [
      Q('カルロスさんは どこの{人|ひと}ですか。', 'ブラジル{人|じん}', 'イタリア{人|じん} | ロシア{人|じん} | アメリカ{人|じん}', 'ブラジル人.'),
      Q('カルロスさんの{仕事|しごと}は？', 'ABEの{社員|しゃいん}', '{大学|だいがく}の{学生|がくせい} | {高校|こうこう}の{教師|きょうし} | {会社員|かいしゃいん}', 'ABE の社員.'),
      Q('カルロスさんは{何歳|なんさい}ですか。', '{四十一歳|よんじゅういっさい}', '{十四歳|じゅうよんさい} | {四十歳|よんじゅっさい} | {二十一歳|にじゅういっさい}', '41 tuổi.'),
      Q('カルロスさんの{誕生日|たんじょうび}は？', '{4月|しがつ}{17日|じゅうしちにち}', '{7月|しちがつ}{14日|じゅうよっか} | {4月|しがつ}{7日|なのか} | {9月|くがつ}{17日|じゅうしちにち}', '4月17日.'),
      Q('カルロスさんの{趣味|しゅみ}は？', 'サッカーと{水泳|すいえい}', 'テニスと{水泳|すいえい} | サッカーと{映画|えいが} | {音楽|おんがく}と{読書|どくしょ}', 'スポーツ = サッカーと水泳.'),
      TF('カルロスさんは{学生|がくせい}です。', 'Sai', '社員です.'),
      TF('カルロスさんの{趣味|しゅみ}はスポーツです。', 'Đúng', '趣味はスポーツ.'),
      TF('カルロスさんの{誕生日|たんじょうび}は{9月|くがつ}です。', 'Sai', '4月 (しがつ).'),
      Q('「ABEの{社員|しゃいん}」 — nghĩa của 社員 ở đây là…', 'Nhân viên của công ty ABE', 'Học sinh | Giáo viên | Chủ công ty', 'Công ty cụ thể + 社員.'),
    ]),
    READK('lt-b1-dh-docto', 'Đọc to đoạn 5 KHÔNG furigana (tự chấm)', 'Cho 30 giây chuẩn bị, rồi đọc một hơi; sau đó bấm xem cách đọc đúng.', [RKP(R1_5)]),
    NOTE('Chấm phần đọc to', [
      '☐ Đọc **liền mạch**, không đọc từng chữ. ☐ はじめまして／どうぞよろしくお願いします đọc trôi.',
      '☐ **{4月|しがつ}{17日|じゅうしちにち}** đúng. ☐ **{四十一歳|よんじゅういっさい}** có っ. ☐ **ABE** đọc "ē-bī-ī".',
      'Sai một ký tự hiragana khi thi: trừ khoảng 0,2 điểm.',
    ]),
  ],
};

/* ───────── 9. NGHE ───────── */

const L1_NGHE: Lesson = {
  id: 'lt-b1-nghe',
  kind: 'listening',
  title: 'Luyện thêm Bài 1 — Nghe: 9 đoạn mới, từ chậm đơn giản đến bẫy (tự sửa tuổi, đổi ngày sinh, hai người cùng nói)',
  goal: 'Nghe hiểu tự giới thiệu: tên, nước, nghề, tuổi, sinh nhật, sở thích; bắt được thông tin CUỐI CÙNG khi người nói sửa lại.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Nghe **hai lần**. Lần 1: chỉ ghi **số, tháng, ngày, tên nước** ra giấy. Lần 2: mới đọc câu hỏi. **Không bật lời thoại** trước khi trả lời xong.',
      'Đoạn ⑧–⑨ có **bẫy**: người nói **sửa lại** (「いいえ、十九歳です」), hoặc hai người nói xen nhau. Nhớ: **thông tin CUỐI CÙNG** mới đúng.',
      'Lỗi hay mắc nghe: **4月 (しがつ)** và **14日 (じゅうよっか)**; **40 (よんじゅう)** và **14 (じゅうよん)**; **ちゅうごく** và **かんこく**; **二十歳 (はたち)** và **にじゅうさい**.',
    ]),
    RECAP('Bảng đoạn nghe', [
      '① ～ ③ 🟢 chậm, đơn giản: tên · nước · nghề · tuổi.',
      '④ ～ ⑦ 🟡 sinh nhật · sở thích · tự giới thiệu dài · cùng sở thích.',
      '⑧ ～ ⑨ 🔴 bẫy: tự sửa tuổi, đổi ngày sinh.',
    ]),

    H(`${LV.de} — ① ～ ③`),
    LN('lt-b1-ng-01', '① Tên và nước', [
      ['パク', 'f', 'はじめまして。 ^パク です。', 'Rất vui được gặp. Tôi là Park.'],
      ['カルロス', 'm', 'はじめまして。 ^カルロス です。 どうぞ よろしく。', 'Rất vui được gặp. Tôi là Carlos. Mong được giúp đỡ.'],
      ['パク', 'f', '^カルロス-さん、 お-{国|くに} は どちら です か。', 'Anh Carlos, nước anh là nước nào?'],
      ['カルロス', 'm', 'ブラジル です。', 'Brazil.'],
    ]),
    LN('lt-b1-ng-02', '② Hỏi nghề', [
      ['木村', 'f', '^ワン-さん は {学生|がくせい} です か。', 'Anh Wan là sinh viên à?'],
      ['ワン', 'm', 'はい、 {大学|だいがく} の {学生|がくせい} です。', 'Vâng, tôi là sinh viên đại học.'],
      ['木村', 'f', 'そう です か。 {私|わたし} は {高校|こうこう} の {教師|きょうし} です。', 'Vậy à. Tôi là giáo viên trường THPT.'],
    ]),
    LN('lt-b1-ng-03', '③ Hỏi tuổi', [
      ['アンナ', 'f', '^マルコ-さん は {何歳|なんさい} です か。', 'Anh Marco bao nhiêu tuổi?'],
      ['マルコ', 'm', '{十八歳|じゅうはっさい} です。 ^アンナ-さん は？', '18 tuổi. Còn chị Anna?'],
      ['アンナ', 'f', '{二十歳|はたち} です。', '20 tuổi.'],
    ]),
    MC('lt-b1-ng-q1', 'Câu hỏi ① ～ ③ (9 câu)', [
      Q('① カルロスさんの{国|くに}は？', 'ブラジル', 'ロシア | ベトナム | タイ', 'ブラジルです.'),
      Q('① Park đã nói câu mở đầu nào?', 'はじめまして。パクです。', 'こちらこそ。パクです。 | そうですか。パクです。 | いいえ。パクです。', 'Gặp lần đầu: はじめまして + tên.'),
      Q('① Carlos đã nói câu nào để kết lời tự giới thiệu?', 'どうぞよろしく', 'こちらこそ | すみません | そうですか', 'どうぞよろしく.'),
      Q('② ワンさんは？', '{大学|だいがく}の{学生|がくせい}', '{高校|こうこう}の{教師|きょうし} | {会社員|かいしゃいん} | {日本語学校|にほんごがっこう}の{学生|がくせい}', '大学の学生.'),
      Q('② {木村|きむら}さんは？', '{高校|こうこう}の{教師|きょうし}', '{大学|だいがく}の{学生|がくせい} | {会社員|かいしゃいん} | {社員|しゃいん}', '高校の教師.'),
      Q('② Kimura hỏi Wan về điều gì?', 'Nghề nghiệp (có phải sinh viên không)', 'Sinh nhật | Quê quán | Sở thích', '学生ですか → hỏi nghề.'),
      Q('③ マルコさんは{何歳|なんさい}ですか。', '{十八歳|じゅうはっさい}', '{十歳|じゅっさい} | {八歳|はっさい} | {二十歳|はたち}', 'じゅうはっさい = 18.'),
      Q('③ アンナさんは？', '{二十歳|はたち}', '{十八歳|じゅうはっさい} | {十二歳|じゅうにさい} | {二歳|にさい}', 'はたち.'),
      Q('③ 「じゅうはっさい」 là bao nhiêu tuổi?', '18', '8 | 10 | 80', 'じゅうはっさい = 18.'),
    ]),

    H(`${LV.vua} — ④ ～ ⑦`),
    LN('lt-b1-ng-04', '④ Sinh nhật', [
      ['ワン', 'f', '^ソフィア-さん、 {誕生日|たんじょうび} は いつ です か。', 'Sofia, sinh nhật bạn là khi nào?'],
      ['ソフィア', 'f', '{6月|ろくがつ} {14日|じゅうよっか} です。', 'Ngày 14 tháng 6.'],
      ['ワン', 'f', '{私|わたし} は {9月|くがつ} {3日|みっか} です。', 'Của tôi là ngày 3 tháng 9.'],
    ]),
    LN('lt-b1-ng-05', '⑤ Sở thích', [
      ['先生', 'm', '^アンナ-さん、 {趣味|しゅみ} は {何|なん} です か。', 'Anna, sở thích của bạn là gì?'],
      ['アンナ', 'f', '{音楽|おんがく} と {映画|えいが} です。', 'Âm nhạc và phim.'],
      ['先生', 'm', '^パク-さん は？', 'Còn Park?'],
      ['パク', 'm', '{私|わたし} は {水泳|すいえい} です。', 'Tôi là bơi lội.'],
    ]),
    LN('lt-b1-ng-06', '⑥ Tự giới thiệu dài', [
      ['メアリー', 'f', 'はじめまして。 {私|わたし} は ^メアリー です。 アメリカ-{人|じん} です。', 'Rất vui được gặp. Tôi là Mary. Tôi là người Mỹ.'],
      ['メアリー', 'f', '{大学|だいがく} の {学生|がくせい} です。 {二十一歳|にじゅういっさい} です。', 'Tôi là sinh viên đại học. Tôi 21 tuổi.'],
      ['メアリー', 'f', '{誕生日|たんじょうび} は {3月|さんがつ} {3日|みっか} です。', 'Sinh nhật tôi là ngày 3 tháng 3.'],
      ['メアリー', 'f', '{趣味|しゅみ} は {映画|えいが} と {音楽|おんがく} です。 どうぞ よろしく お{願|ねが}い します。', 'Sở thích của tôi là phim và âm nhạc. Mong được giúp đỡ.'],
    ]),
    LN('lt-b1-ng-07', '⑦ Cùng sở thích', [
      ['マルコ', 'm', '{趣味|しゅみ} は サッカー です。 ^ワン-さん は？', 'Sở thích của tôi là bóng đá. Còn Wan?'],
      ['ワン', 'm', '{私|わたし} も サッカー です。 テニス も {趣味|しゅみ} です。', 'Tôi cũng là bóng đá. Tennis cũng là sở thích.'],
      ['マルコ', 'm', 'あっ、 {同|おな}じ です ね。', 'A, giống nhau nhỉ.'],
    ]),
    MC('lt-b1-ng-q2', 'Câu hỏi ④ ～ ⑦ (13 câu)', [
      Q('④ ソフィアさんの{誕生日|たんじょうび}は？', '{6月|ろくがつ}{14日|じゅうよっか}', '{6月|ろくがつ}{4日|よっか} | {4月|しがつ}{14日|じゅうよっか} | {6月|ろくがつ}{40日|よんじゅうにち}', 'ろくがつじゅうよっか.'),
      Q('④ ワンさんの{誕生日|たんじょうび}は？', '{9月|くがつ}{3日|みっか}', '{9月|くがつ}{30日|さんじゅうにち} | {3月|さんがつ}{9日|ここのか} | {4月|しがつ}{3日|みっか}', 'くがつみっか.'),
      Q('④ 「くがつ」 は{何月|なんがつ}？', '9月', '4月 | 7月 | 10月', 'くがつ = 9月.'),
      Q('⑤ アンナさんの{趣味|しゅみ}は？', '{音楽|おんがく}と{映画|えいが}', '{水泳|すいえい} | {音楽|おんがく}だけ | {映画|えいが}と{読書|どくしょ}', '音楽と映画.'),
      Q('⑤ パクさんの{趣味|しゅみ}は？', '{水泳|すいえい}', 'サッカー | テニス | {料理|りょうり}', '水泳.'),
      Q('⑤ Ai là người đặt câu hỏi?', '{先生|せんせい} (thầy/cô)', 'アンナさん | パクさん | マルコさん', 'Người hỏi là 先生.'),
      Q('⑥ メアリーさんは どこの{人|ひと}ですか。', 'アメリカ{人|じん}', 'イタリア{人|じん} | ロシア{人|じん} | オーストラリア{人|じん}', 'アメリカ人.'),
      Q('⑥ メアリーさんは{何歳|なんさい}ですか。', '{二十一歳|にじゅういっさい}', '{二十歳|はたち} | {十一歳|じゅういっさい} | {二十二歳|にじゅうにさい}', 'にじゅういっさい = 21.'),
      Q('⑥ メアリーさんの{誕生日|たんじょうび}は？', '{3月|さんがつ}{3日|みっか}', '{3月|さんがつ}{13日|じゅうさんにち} | {3月|さんがつ}{30日|さんじゅうにち} | {9月|くがつ}{3日|みっか}', 'さんがつみっか.'),
      Q('⑥ メアリーさんの{趣味|しゅみ}は？', '{映画|えいが}と{音楽|おんがく}', '{旅行|りょこう}と{料理|りょうり} | {水泳|すいえい}と{読書|どくしょ} | サッカーとテニス', '映画と音楽.'),
      Q('⑦ マルコさんの{趣味|しゅみ}は？', 'サッカー', 'テニス | {水泳|すいえい} | {料理|りょうり}', 'サッカー.'),
      Q('⑦ Wan nói sở thích của mình là gì?', 'Bóng đá và tennis', 'Chỉ bóng đá | Chỉ tennis | Bóng đá và bơi lội', 'サッカーもテニスも.'),
      Q('⑦ Sở thích chung của hai người là gì?', 'サッカー', 'テニス | {水泳|すいえい} | {映画|えいが}', 'Cả hai đều có サッカー.'),
    ]),

    H(`${LV.kho} — ⑧ ～ ⑨ (bẫy)`),
    LN('lt-b1-ng-08', '⑧ Tự sửa tuổi', [
      ['ワン', 'f', '^ダニエル-さん は {二十歳|はたち} です か。', 'Anh Daniel 20 tuổi phải không?'],
      ['ダニエル', 'm', 'いいえ、 {二十歳|はたち} じゃ ありません。', 'Không, không phải 20 tuổi.'],
      ['ワン', 'f', 'じゃ、 {十九歳|じゅうきゅうさい} です か。', 'Vậy anh 19 tuổi à?'],
      ['ダニエル', 'm', 'いいえ、 {十九歳|じゅうきゅうさい} も じゃ ありません。 {二十一歳|にじゅういっさい} です。', 'Cũng không phải 19. Tôi 21 tuổi.'],
    ]),
    LN('lt-b1-ng-09', '⑨ Đổi ngày sinh', [
      ['アンナ', 'f', '^ナタポン-さん の {誕生日|たんじょうび} は {7月|しちがつ} {7日|なのか} です か。', 'Sinh nhật của anh Natapon là ngày 7 tháng 7 phải không?'],
      ['ナタポン', 'm', 'いいえ、 {7月|しちがつ} {7日|なのか} じゃ ありません。 {7月|しちがつ} {8日|ようか} です。', 'Không, không phải 7/7. Là ngày 8 tháng 7.'],
      ['アンナ', 'f', 'あっ、 すみません。 {7月|しちがつ} {8日|ようか} です ね。', 'A, xin lỗi. Là ngày 8 tháng 7 nhỉ.'],
      ['ナタポン', 'm', 'はい、 そう です。', 'Vâng, đúng rồi.'],
    ]),
    MC('lt-b1-ng-q3', 'Câu hỏi ⑧ ～ ⑨ (8 câu)', [
      Q('⑧ ダニエルさんは{何歳|なんさい}ですか。 (thông tin CUỐI)', '{二十一歳|にじゅういっさい}', '{二十歳|はたち} | {十九歳|じゅうきゅうさい} | {十一歳|じゅういっさい}', 'Cuối cùng: 21 tuổi.'),
      Q('⑧ Wan hỏi tuổi đầu tiên là bao nhiêu?', '{二十歳|はたち}', '{二十一歳|にじゅういっさい} | {十九歳|じゅうきゅうさい} | {十歳|じゅっさい}', 'Đầu tiên hỏi 20.'),
      Q('⑧ ダニエルさんは{十九歳|じゅうきゅうさい}ですか。', 'いいえ', 'はい | Không có thông tin', '十九歳もじゃありません.'),
      Q('⑧ ダニエルさんは{二十歳|はたち}ですか。', 'いいえ', 'はい | Không có thông tin', '二十歳じゃありません.'),
      Q('⑨ ナタポンさんの{誕生日|たんじょうび}は？ (CUỐI)', '{7月|しちがつ}{8日|ようか}', '{7月|しちがつ}{7日|なのか} | {8月|はちがつ}{7日|なのか} | {7月|しちがつ}{18日|じゅうはちにち}', '7月8日.'),
      Q('⑨ Ngày đầu tiên Anna nói ra là ngày nào?', '{7月|しちがつ}{7日|なのか}', '{7月|しちがつ}{8日|ようか} | {8月|はちがつ}{8日|ようか} | {7月|しちがつ}{17日|じゅうしちにち}', 'Ban đầu hỏi 7/7.'),
      Q('⑨ 「ようか」 は{何日|なんにち}？', '8日', '4日 | 10日 | 20日', 'ようか = 8日.'),
      Q('⑨ 「なのか」 は{何日|なんにち}？', '7日', '2日 | 5日 | 9日', 'なのか = 7日.'),
    ]),
  ],
};

/* ───────── 10. NÓI & VIẾT ───────── */

const L1_NOI_VIET: Lesson = {
  id: 'lt-b1-noi-viet',
  kind: 'speaking',
  title: 'Luyện thêm Bài 1 — Nói & viết: 10 câu không tranh · thẻ nhân vật có tranh · đọc to · bài viết 5–7 câu',
  goal: 'Trả lời trôi chảy 10 câu hỏi không tranh và 3 câu có tranh theo khuôn đề nói JPD113, đọc to đoạn tự giới thiệu và viết đoạn 5–7 câu.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Khuôn hỏi bám file "Luyện nói" của cô Huyền: **Phần không tranh** (10 câu về người đối diện) và **Phần có tranh** (thẻ nhân vật). Câu hỏi và đáp ở đây là viết mới.',
      'Luôn trả lời **câu đầy đủ**; câu có か thì mở đầu bằng **はい／いいえ**. Chưa nghe rõ → 「もう一度お願いします。」',
      'Làm thật: che đáp án, bấm 🎤, nói, nghe lại, rồi so với mẫu.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Điểm'],
      [
        ['Không tranh', '1 câu trong 10 câu (tên, nghề, nước, tuổi, sinh nhật, sở thích…)', '10'],
        ['Có tranh', '3 câu hỏi quanh một thẻ nhân vật', '3 × 15'],
        ['Reading', 'Đọc to đoạn tự giới thiệu', '40'],
        ['Presenting', 'Chào khi vào / ra phòng', '5'],
      ],
    ),

    H(`${LV.de} — A. 10 câu không tranh (có mẫu trả lời)`),
    TABLE(
      ['#', 'Giám thị hỏi', 'Trả lời mẫu'],
      [
        ['1', JR('^ワン-さん は {学生|がくせい} です か'), JR('はい、 {学生|がくせい} です') + ' / ' + JR('いいえ、 {学生|がくせい} じゃ ありません')],
        ['2', JR('^ワン-さん は {会社員|かいしゃいん} です か'), JR('いいえ、 {会社員|かいしゃいん} じゃ ありません。 {学生|がくせい} です')],
        ['3', JR('^ワン-さん の お-{国|くに} は どちら です か'), JR('ベトナム です')],
        ['4', JR('^ワン-さん の お-{仕事|しごと} は？'), JR('{大学|だいがく} の {学生|がくせい} です')],
        ['5', JR('^ワン-さん は {何歳|なんさい} です か'), JR('{二十歳|はたち} です')],
        ['6', JR('^ワン-さん の {誕生日|たんじょうび} は いつ です か'), JR('{3月|さんがつ} {21日|にじゅういちにち} です')],
        ['7', JR('^ワン-さん は ベトナム-{人|じん} です か'), JR('はい、 ベトナム-{人|じん} です')],
        ['8', JR('^ワン-さん は {日本人|にほんじん} です か'), JR('いいえ、 {日本人|にほんじん} じゃ ありません')],
        ['9', JR('^ワン-さん の {趣味|しゅみ} は {何|なん} です か'), JR('{音楽|おんがく} と {映画|えいが} です')],
        ['10', JR('^ワン-さん の {趣味|しゅみ} は サッカー と {水泳|すいえい} です か'), JR('いいえ、 {音楽|おんがく} と {映画|えいが} です')],
      ],
      'Tên "Wan" thay bằng tên của bạn',
    ),
    SPEAK('lt-b1-nv-a', [
      'がくせいですか。',
      'かいしゃいんですか。',
      'おくには どちらですか。',
      'おしごとは？',
      'なんさいですか。',
      'たんじょうびは いつですか。',
      'ベトナムじんですか。',
      'にほんじんですか。',
      'しゅみは なんですか。',
      'しゅみは サッカーと すいえいですか。',
    ]),
    MC('lt-b1-nv-a-mc', 'Chọn câu trả lời đúng cho 6 câu hỏi', [
      Q('「{会社員|かいしゃいん}ですか。」 (bạn là sinh viên)', 'いいえ、{会社員|かいしゃいん}じゃありません。{学生|がくせい}です。', 'はい、{学生|がくせい}です。 | いいえ、{会社員|かいしゃいん}です。 | {学生|がくせい}ですか。', 'いいえ + phủ định + đúng.'),
      Q('「お{国|くに}はどちらですか。」 (Việt Nam)', 'ベトナムです。', 'ベトナムをです。 | はい、ベトナムです。 | ベトナムですか。', 'Đáp tên nước.'),
      Q('「{何歳|なんさい}ですか。」 (18 tuổi)', '{十八歳|じゅうはっさい}です。', '{十八日|じゅうはちにち}です。 | はい、{十八歳|じゅうはっさい}です。 | {十八月|じゅうはちがつ}です。', 'じゅうはっさい.'),
      Q('「{誕生日|たんじょうび}はいつですか。」 (4/1)', '{4月|しがつ}{1日|ついたち}です。', '{4月|よんがつ}{1日|いちにち}です。 | {1日|ついたち}{4月|しがつ}です。 | {4月|しがつ}{一日|いちにち}です。', 'しがつ ついたち.'),
      Q('「{趣味|しゅみ}は{何|なん}ですか。」 (đọc sách)', '{読書|どくしょ}です。', 'はい、{読書|どくしょ}です。 | {読書|どくしょ}ですか。 | いいえ、{読書|どくしょ}です。', 'Đáp sở thích.'),
      Q('「{日本人|にほんじん}ですか。」 (bạn là người Hàn)', 'いいえ、{日本人|にほんじん}じゃありません。{韓国人|かんこくじん}です。', 'はい、{日本人|にほんじん}です。 | いいえ、{日本人|にほんじん}です。 | はい、{韓国人|かんこくじん}じゃありません。', 'いいえ + phủ định.'),
    ]),

    H(`${LV.vua} — B. Thẻ nhân vật có tranh`),
    TABLE(
      ['Thẻ', 'Thông tin trên thẻ'],
      [
        ['Thẻ 1 — スミスさん', 'Người Mỹ · 26 tuổi · sinh ngày 12/10 · nhân viên công ty · sở thích: thể thao'],
        ['Thẻ 2 — リンさん', 'Người Việt Nam · 19 tuổi · sinh ngày 3/2 · sinh viên đại học · sở thích: nấu ăn và du lịch'],
        ['Thẻ 3 — パクさん', 'Người Hàn Quốc · 30 tuổi · sinh ngày 20/8 · giáo viên · sở thích: bơi lội'],
      ],
    ),
    DLG('Mẫu trả lời — Thẻ 2', [
      DX('Giám thị', 'examiner', 'この {人|ひと} は {何|なに}-{人|じん} です か。', 'Người này là người nước nào?'),
      DX('Thí sinh', 'candidate', 'ベトナム-{人|じん} です。', 'Là người Việt Nam.'),
      DX('Giám thị', 'examiner', '{何歳|なんさい} です か。', 'Mấy tuổi?'),
      DX('Thí sinh', 'candidate', '{十九歳|じゅうきゅうさい} です。', '19 tuổi.'),
      DX('Giám thị', 'examiner', '{誕生日|たんじょうび} は いつ です か。', 'Sinh nhật khi nào?'),
      DX('Thí sinh', 'candidate', '{2月|にがつ} {3日|みっか} です。', 'Ngày 3 tháng 2.'),
    ]),
    MC('lt-b1-nv-b-mc', 'Dựa vào thẻ, chọn câu trả lời đúng (8 câu)', [
      Q('Thẻ 1: スミスさんは{何歳|なんさい}ですか。', '{二十六歳|にじゅうろくさい}です。', '{二十歳|はたち}です。 | {十六歳|じゅうろくさい}です。 | {六歳|ろくさい}です。', '26 tuổi.'),
      Q('Thẻ 1: スミスさんの{誕生日|たんじょうび}は？', '{10月|じゅうがつ}{12日|じゅうににち}です。', '{12月|じゅうにがつ}{10日|とおか}です。 | {10月|じゅうがつ}{2日|ふつか}です。 | {1月|いちがつ}{12日|じゅうににち}です。', '10月12日.'),
      Q('Thẻ 1: スミスさんの{仕事|しごと}は？', '{会社員|かいしゃいん}です。', '{学生|がくせい}です。 | {教師|きょうし}です。 | {社員|しゃいん}です。(không có tên công ty)', '会社員.'),
      Q('Thẻ 2: リンさんの{趣味|しゅみ}は？', '{料理|りょうり}と{旅行|りょこう}です。', '{水泳|すいえい}です。 | {料理|りょうり}と{映画|えいが}です。 | スポーツです。', '料理と旅行.'),
      Q('Thẻ 3: パクさんの{国|くに}は？', '{韓国|かんこく}です。', '{中国|ちゅうごく}です。 | タイです。 | {日本|にほん}です。', '韓国.'),
      Q('Thẻ 3: パクさんの{誕生日|たんじょうび}は？', '{8月|はちがつ}{20日|はつか}です。', '{8月|はちがつ}{2日|ふつか}です。 | {8月|はちがつ}{10日|とおか}です。 | {2月|にがつ}{8日|ようか}です。', '8月20日 = はちがつ はつか.'),
      Q('Thẻ 3: パクさんの{仕事|しごと}は？', '{教師|きょうし}です。', '{学生|がくせい}です。 | {会社員|かいしゃいん}です。 | {社員|しゃいん}です。', '教師.'),
      Q('Thẻ 3: パクさんの{趣味|しゅみ}は？', '{水泳|すいえい}です。', 'サッカーです。 | {音楽|おんがく}です。 | {映画|えいが}です。', '水泳.'),
    ]),
    SPEAK('lt-b1-nv-b', [
      'このひとは なにじんですか。',
      'なんさいですか。',
      'たんじょうびは いつですか。',
      'おしごとは？',
      'しゅみは なんですか。',
    ]),

    H(`${LV.kho} — C. Đọc to (Reading 40 điểm)`),
    READK('lt-b1-nv-c', 'Đọc to KHÔNG furigana (chuẩn bị 30 giây, rồi đọc một hơi)', 'Tự chấm: ☐ trôi, không ngắt từng chữ ☐ tháng/ngày/tuổi đúng ☐ trợ từ は đọc wa.', [
      RKP([
        ['はじめまして。 {私|わたし} は ^スミス です。', 'Rất vui được gặp. Tôi là Smith.'],
        ['アメリカ-{人|じん} です。', 'Tôi là người Mỹ.'],
        ['ABE の {社員|しゃいん} です。', 'Tôi là nhân viên công ty ABE.'],
        ['{二十六歳|にじゅうろくさい} です。', 'Tôi 26 tuổi.'],
        ['{誕生日|たんじょうび} は {10月|じゅうがつ} {12日|じゅうににち} です。', 'Sinh nhật tôi là ngày 12 tháng 10.'],
        ['{趣味|しゅみ} は スポーツ です。', 'Sở thích của tôi là thể thao.'],
        ['どうぞ よろしく お{願|ねが}い します。', 'Mong được giúp đỡ.'],
      ]),
      RKP([
        ['はじめまして。 {私|わたし} は ^リン です。', 'Rất vui được gặp. Tôi là Linh.'],
        ['ベトナム-{人|じん} です。', 'Tôi là người Việt Nam.'],
        ['{大学|だいがく} の {学生|がくせい} です。', 'Tôi là sinh viên đại học.'],
        ['{十九歳|じゅうきゅうさい} です。', 'Tôi 19 tuổi.'],
        ['{趣味|しゅみ} は {料理|りょうり} と {旅行|りょこう} です。', 'Sở thích của tôi là nấu ăn và du lịch.'],
        ['どうぞ よろしく お{願|ねが}い します。', 'Mong được giúp đỡ.'],
      ]),
    ]),

    H(`${LV.kho} — D. Viết bài tự giới thiệu 5–7 câu`),
    NOTE('Khung bài viết (thay bằng thông tin của bạn)', [
      '① はじめまして。{私|わたし}は ○○ です。 ② ○○{人|じん}です。 ③ ○○{大学|だいがく}の{学生|がくせい}です。',
      '④ ○○{歳|さい}です。{誕生日|たんじょうび}は ○月○日です。 ⑤ {趣味|しゅみ}は ○○ と ○○ です。 ⑥ どうぞよろしくお{願|ねが}いします。',
      'Chấm tự kiểm: ☐ không có さん sau tên mình ☐ trợ từ は／の／と đúng ☐ tháng/ngày/tuổi đọc – viết đúng ☐ kết bằng です／ます.',
    ]),
    QZ('lt-b1-nv-d', 'Viết lại từng câu (dịch Việt → Nhật)', 'translate', [
      AS('Rất vui được gặp. Tôi là Linh.', 'はじめまして。{私|わたし}はリンです'),
      AS('Tôi là người Việt Nam.', 'ベトナム{人|じん}です'),
      AS('Tôi là sinh viên ĐH FPT.', ['FPT{大学|だいがく}の{学生|がくせい}です', '{私|わたし}はFPT{大学|だいがく}の{学生|がくせい}です']),
      AS('Tôi 19 tuổi. Sinh nhật tôi là ngày 3 tháng 2.', ['{十九歳|じゅうきゅうさい}です。{誕生日|たんじょうび}は{2月|にがつ}{3日|みっか}です', '{19歳|じゅうきゅうさい}です。{誕生日|たんじょうび}は{2月|にがつ}{3日|みっか}です']),
      AS('Sở thích của tôi là nấu ăn và du lịch.', '{趣味|しゅみ}は{料理|りょうり}と{旅行|りょこう}です'),
      AS('Mong được giúp đỡ.', 'どうぞよろしくお{願|ねが}いします'),
    ]),

    H(`${LV.kho} — E. Chào khi vào – ra phòng thi`),
    DLG('Vào và ra', [
      DX('Thí sinh', 'candidate', 'しつれい します。', 'Em xin phép (vào ạ).'),
      DX('Giám thị', 'examiner', 'どうぞ。', 'Mời em.'),
      DX('Thí sinh', 'candidate', 'こんにちは。 はじめまして。 ^リン です。 どうぞ よろしく お{願|ねが}い します。', 'Em chào thầy/cô. Em là Linh. Mong thầy/cô giúp đỡ ạ.'),
      DX('Giám thị', 'examiner', 'はい、 おわり です。', 'Được rồi, xong rồi.'),
      DX('Thí sinh', 'candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn ạ. Em xin phép ra ạ.'),
    ]),
  ],
};

/* ───────── 11. ĐỀ TỔNG HỢP ───────── */

const R1_DE: [string, string][] = [
  ['^ミナ-さん は {韓国人|かんこくじん} です。', 'Mina là người Hàn Quốc.'],
  ['{会社員|かいしゃいん} です。', 'Cô ấy là nhân viên công ty.'],
  ['{三十歳|さんじゅっさい} です。', 'Cô ấy 30 tuổi.'],
  ['{誕生日|たんじょうび} は {12月|じゅうにがつ} {24日|にじゅうよっか} です。', 'Sinh nhật là ngày 24 tháng 12.'],
  ['{趣味|しゅみ} は {旅行|りょこう} と {音楽|おんがく} です。', 'Sở thích là du lịch và âm nhạc.'],
];

const L1_DE: Lesson = {
  id: 'lt-b1-de-tong-hop',
  kind: 'review',
  title: 'Luyện thêm Bài 1 — Đề tổng hợp (45 phút, 100 điểm): từ vựng · chữ Hán · ngữ pháp · nghe · đọc hiểu · dịch',
  goal: 'Làm một đề đủ phần theo khuôn kiểm tra của cô, bấm giờ, tự chấm bằng thang điểm và biết phần nào cần luyện lại.',
  minutes: 45,
  blocks: [
    RECAP('Học thế nào — đọc trước khi làm đề', [
      '**Thời gian: 45 phút.** Bấm giờ thật. Không xem lại bài học, không mở đáp án cho đến khi làm xong cả đề.',
      'Làm theo thứ tự các phần; câu nào bí quá 1 phút thì đánh dấu, làm tiếp, quay lại sau.',
      'Cuối đề có **bảng thang điểm tự chấm** và hướng dẫn luyện lại theo phần yếu. Đề này là viết mới, không phải đề của cô.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Số câu', 'Điểm/câu', 'Tối đa'],
      [
        ['A', 'Từ vựng', '10', '1', '10'],
        ['B', 'Chữ Hán (đọc + chọn chữ)', '10', '1,5', '15'],
        ['C', 'Điền trợ từ', '8', '1', '8'],
        ['D', 'Từ để hỏi', '6', '1', '6'],
        ['E', 'Chọn đáp án đúng', '10', '1', '10'],
        ['F', 'Viết cách đọc (gõ tay)', '4', '2', '8'],
        ['G', 'Nghe (2 đoạn)', '5', '2', '10'],
        ['H', 'Đọc hiểu', '6', '1,5', '9'],
        ['I', 'Dịch Việt → Nhật (gõ tay)', '4', '3', '12'],
        ['J', 'Dịch Nhật → Việt', '4', '3', '12'],
        ['', '**Tổng**', '67', '', '**100**'],
      ],
      'Cấu trúc đề tổng hợp Bài 1',
    ),

    H('Phần A — Từ vựng (10 câu × 1 điểm)'),
    MC('lt-b1-de-a', 'A. Từ vựng', [
      Q('「{趣味|しゅみ}」の意味は？', 'Sở thích', 'Công việc | Quê quán | Tên', '趣味 = sở thích.'),
      Q('「{会社員|かいしゃいん}」の意味は？', 'Nhân viên văn phòng', 'Học sinh | Giáo viên | Thầy cô', '会社員.'),
      Q('「ロシア」の意味は？', 'Nga', 'Úc | Ý | Thái Lan', 'ロシア = Nga.'),
      Q('「{水泳|すいえい}」の意味は？', 'Bơi lội', 'Bóng đá | Tennis | Nấu ăn', '水泳.'),
      Q('「{誕生日|たんじょうび}」の意味は？', 'Sinh nhật', 'Tên | Tuổi | Quê quán', '誕生日.'),
      Q('Chọn từ KHÁC loại: {日本|にほん} / {韓国|かんこく} / タイ / {学生|がくせい}', '{学生|がくせい}', '{日本|にほん} | {韓国|かんこく} | タイ', '3 từ kia là nước.'),
      Q('Nói nghề giáo viên của chính mình:「{私|わたし}は＿＿＿です」', '{教師|きょうし}', '{先生|せんせい} | {社員|しゃいん} | {学生|がくせい}', '教師.'),
      Q('「ABEの＿＿＿です」 (nhân viên của công ty ABE)', '{社員|しゃいん}', '{会社員|かいしゃいん} | {学生|がくせい} | {教師|きょうし}', '社員.'),
      Q('「こちらこそ」 dùng khi…', 'Đáp lại どうぞよろしくお願いします', 'Xin lỗi | Cảm ơn | Chào tạm biệt', 'Đáp よろしく.'),
      Q('「{旅行|りょこう}」の意味は？', 'Du lịch', 'Nấu ăn | Đọc sách | Âm nhạc', '旅行.'),
    ]),

    H('Phần B — Chữ Hán (10 câu × 1,5 điểm)'),
    MC('lt-b1-de-b', 'B. Chữ Hán: 5 câu đọc + 5 câu chọn chữ', [
      Q('「日本人」の読み方は？', 'にほんじん', 'にほんひと | にっぽんにん | ひほんじん', '日本人 = にほんじん.'),
      Q('「学生」の読み方は？', 'がくせい', 'がっせい | まなせい | がくしょう', '学生.'),
      Q('「英語」の読み方は？', 'えいご', 'えいぎょ | えいがく | ひでご', '英語.'),
      Q('「何歳」の読み方は？', 'なんさい', 'なにさい | かさい | なんざい', '何歳.'),
      Q('「会社員」の読み方は？', 'かいしゃいん', 'かいしゃえん | かしゃいん | かいしゃいいん', '会社員.'),
      Q('「にほんご」を漢字で かくと？', '日本語', '日木語 | 日本話 | 目本語', '日本語.'),
      Q('「わたし」を漢字で かくと？', '私', '和 | 科 | 秒', '私.'),
      Q('「せんせい」を漢字で かくと？', '先生', '光生 | 先主 | 元生', '先生.'),
      Q('「だいがく」を漢字で かくと？', '大学', '犬学 | 太学 | 大字', '大学.'),
      Q('「しゃいん」を漢字で かくと？', '社員', '社貝 | 杜員 | 社負', '社員.'),
    ]),

    H('Phần C — Điền trợ từ (8 câu × 1 điểm)'),
    MC('lt-b1-de-c', 'C. Trợ từ', [
      Q('{私|わたし}＿＿ワンです。', 'は', 'の | と | も', 'N は N です.'),
      Q('ふじみ{大学|だいがく}＿＿{学生|がくせい}です。', 'の', 'は | と | も', 'N の N.'),
      Q('{趣味|しゅみ}は{映画|えいが}＿＿{音楽|おんがく}です。', 'と', 'の | は | も', 'Nối: と.'),
      Q('マルコさんは{学生|がくせい}です。{私|わたし}＿＿{学生|がくせい}です。', 'も', 'と | の | は', 'Cũng: も.'),
      Q('{誕生日|たんじょうび}＿＿いつですか。', 'は', 'の | と | も', 'は.'),
      Q('{私|わたし}は{先生|せんせい}＿＿ありません。', 'じゃ', 'は | の | も', 'じゃありません.'),
      Q('ワンさん＿＿{趣味|しゅみ}はテニスです。', 'の', 'は | と | も', '..さんの趣味.'),
      Q('パクさんは{学生|がくせい}です＿＿。', 'か', 'の | と | も', 'Hỏi: か.'),
    ]),

    H('Phần D — Từ để hỏi (6 câu × 1 điểm)'),
    MC('lt-b1-de-d', 'D. Chọn từ để hỏi', [
      Q('お{国|くに}は＿＿＿ですか。', 'どちら', 'いつ | {何|なん} | {何歳|なんさい}', 'Nước: どちら.'),
      Q('{誕生日|たんじょうび}は＿＿＿ですか。', 'いつ', 'どちら | {何|なん} | {何歳|なんさい}', 'いつ.'),
      Q('{趣味|しゅみ}は＿＿＿ですか。', '{何|なん}', 'いつ | どちら | {何歳|なんさい}', '何.'),
      Q('マルコさんは＿＿＿ですか。 → {二十歳|はたち}です。', '{何歳|なんさい}', 'いつ | どちら | {何|なん}', '何歳.'),
      Q('お{名前|なまえ}は＿＿＿ですか。', '{何|なん}', 'いつ | どちら | {何歳|なんさい}', '何 (hoặc お名前は？).'),
      Q('ワンさんの{誕生日|たんじょうび}は＿＿＿ですか。 → {5月|ごがつ}{5日|いつか}です。', 'いつ', '{何|なん} | {何歳|なんさい} | どちら', 'いつ.'),
    ]),

    H('Phần E — Chọn đáp án đúng (10 câu × 1 điểm)'),
    MC('lt-b1-de-e', 'E. Chọn đáp án', [
      Q('Lần đầu gặp, nói:', 'はじめまして。', 'こんにちは。 | さようなら。 | ありがとう。', 'はじめまして.'),
      Q('Chọn câu ĐÚNG:', '{私|わたし}はワンです。', '{私|わたし}はワンさんです。 | {私|わたし}をワンです。 | {私|わたし}のワンです。', 'Tên mình không có さん.'),
      Q('4月 đọc là…', 'しがつ', 'よんがつ | よがつ | しいがつ', '4月.'),
      Q('20歳 đọc là…', 'はたち', 'にじゅうさい | にじゅうねん | はつか', '20歳.'),
      Q('「ワンさんは{会社員|かいしゃいん}ですか。」 (Wan là sinh viên)', 'いいえ、{会社員|かいしゃいん}じゃありません。', 'はい、{会社員|かいしゃいん}です。 | いいえ、{会社員|かいしゃいん}です。 | はい、そうじゃありません。', 'いいえ + phủ định.'),
      Q('Cách nói ĐÚNG "sinh viên của ĐH Fujimi":', 'ふじみ{大学|だいがく}の{学生|がくせい}', '{学生|がくせい}のふじみ{大学|だいがく} | ふじみ{大学|だいがく}は{学生|がくせい} | ふじみ{大学|だいがく}と{学生|がくせい}', 'N1 の N2.'),
      Q('Câu nào SAI?', '{趣味|しゅみ}はサッカーも{水泳|すいえい}です。(muốn nói "và")', '{趣味|しゅみ}はサッカーと{水泳|すいえい}です。 | {私|わたし}も{水泳|すいえい}です。 | {私|わたし}の{趣味|しゅみ}はテニスです。', 'Nối bằng と.'),
      Q('5日 đọc là…', 'いつか', 'ごにち | ごか | いちか', '5日 = いつか.'),
      Q('Khi bước vào phòng thi nói, câu đầu tiên là…', 'しつれいします。', 'さようなら。 | ありがとう。 | こんばんは。', 'しつれいします (gõ cửa xin phép vào).'),
      Q('「ベトナム{人|じん}」 — 人 đọc là…', 'じん', 'ひと | にん | しん', '人 sau tên nước = じん.'),
    ]),

    H('Phần F — Viết cách đọc bằng hiragana (4 câu × 2 điểm)'),
    QZ('lt-b1-de-f', 'F. Gõ cách đọc', 'fill', [
      A('{誕生日|たんじょうび}', 'たんじょうび'),
      A('7月', 'しちがつ'),
      A('3日', 'みっか'),
      A('18歳', 'じゅうはっさい'),
    ]),

    H('Phần G — Nghe (2 đoạn, 5 câu × 2 điểm)'),
    LN('lt-b1-de-ng1', 'Đoạn 1', [
      ['スズキ', 'f', '^ナム-さん、 お-{仕事|しごと} は？', 'Anh Nam, anh làm nghề gì?'],
      ['ナム', 'm', '{日本語学校|にほんごがっこう} の {学生|がくせい} です。', 'Tôi là học sinh trường tiếng Nhật.'],
      ['スズキ', 'f', '{何歳|なんさい} です か。', 'Anh bao nhiêu tuổi?'],
      ['ナム', 'm', '{二十二歳|にじゅうにさい} です。', '22 tuổi ạ.'],
    ]),
    LN('lt-b1-de-ng2', 'Đoạn 2', [
      ['リン', 'f', '^ミン-さん、 {誕生日|たんじょうび} は いつ です か。', 'Minh, sinh nhật bạn là khi nào?'],
      ['ミン', 'm', '{11月|じゅういちがつ} {20日|はつか} です。', 'Ngày 20 tháng 11.'],
      ['リン', 'f', '{趣味|しゅみ} は？', 'Sở thích thì sao?'],
      ['ミン', 'm', '{映画|えいが} と {読書|どくしょ} です。', 'Phim và đọc sách.'],
    ]),
    MC('lt-b1-de-g', 'G. Câu hỏi nghe', [
      Q('Đoạn 1: ナムさんの{仕事|しごと}は？', '{日本語学校|にほんごがっこう}の{学生|がくせい}', '{大学|だいがく}の{学生|がくせい} | {会社員|かいしゃいん} | {教師|きょうし}', '日本語学校の学生.'),
      Q('Đoạn 1: ナムさんは{何歳|なんさい}ですか。', '{二十二歳|にじゅうにさい}', '{二十歳|はたち} | {十二歳|じゅうにさい} | {二十一歳|にじゅういっさい}', '22.'),
      Q('Đoạn 2: ミンさんの{誕生日|たんじょうび}は？', '{11月|じゅういちがつ}{20日|はつか}', '{1月|いちがつ}{20日|はつか} | {11月|じゅういちがつ}{2日|ふつか} | {11月|じゅういちがつ}{10日|とおか}', '11月20日.'),
      Q('Đoạn 2: ミンさんの{趣味|しゅみ}は？', '{映画|えいが}と{読書|どくしょ}', '{映画|えいが}と{音楽|おんがく} | サッカーと{水泳|すいえい} | {料理|りょうり}と{旅行|りょこう}', '映画と読書.'),
      Q('Đoạn 2: 「はつか」 là ngày bao nhiêu?', '20', '2 | 8 | 10', 'はつか = 20日.'),
    ]),

    H('Phần H — Đọc hiểu (6 câu × 1,5 điểm)'),
    ...PSG('ミナさん', R1_DE),
    MC('lt-b1-de-h', 'H. Câu hỏi đọc hiểu', [
      Q('ミナさんは どこの{人|ひと}ですか。', '{韓国人|かんこくじん}', '{中国人|ちゅうごくじん} | {日本人|にほんじん} | タイ{人|じん}', '韓国人.'),
      Q('ミナさんの{仕事|しごと}は？', '{会社員|かいしゃいん}', '{学生|がくせい} | {教師|きょうし} | {先生|せんせい}', '会社員.'),
      Q('ミナさんの{誕生日|たんじょうび}は？', '{12月|じゅうにがつ}{24日|にじゅうよっか}', '{12月|じゅうにがつ}{4日|よっか} | {2月|にがつ}{24日|にじゅうよっか} | {12月|じゅうにがつ}{14日|じゅうよっか}', '12月24日.'),
      Q('ミナさんの{趣味|しゅみ}は？', '{旅行|りょこう}と{音楽|おんがく}', '{旅行|りょこう}だけ | {映画|えいが}と{音楽|おんがく} | {料理|りょうり}と{読書|どくしょ}', '旅行と音楽.'),
      TF('ミナさんは{学生|がくせい}です。', 'Sai', '会社員です.'),
      TF('ミナさんは{三十歳|さんじゅっさい}です。', 'Đúng', '三十歳です.'),
    ]),

    H('Phần I — Dịch Việt → Nhật (4 câu × 3 điểm)'),
    QZ('lt-b1-de-i', 'I. Gõ câu tiếng Nhật', 'translate', [
      AS('Rất vui được gặp. Tôi là Linh.', 'はじめまして。{私|わたし}はリンです'),
      AS('Anh Carlos là nhân viên công ty ABE.', 'カルロスさんはABEの{社員|しゃいん}です'),
      AS('Sinh nhật của tôi là ngày 5 tháng 5.', '{私|わたし}の{誕生日|たんじょうび}は{5月|ごがつ}{5日|いつか}です'),
      AS('Sở thích của tôi là bóng đá và bơi lội.', '{私|わたし}の{趣味|しゅみ}はサッカーと{水泳|すいえい}です'),
    ]),

    H('Phần J — Dịch Nhật → Việt (4 câu × 3 điểm)'),
    MC('lt-b1-de-j', 'J. Chọn nghĩa tiếng Việt đúng', [
      Q('ワンさんもふじみ{大学|だいがく}の{学生|がくせい}です。', 'Wan cũng là sinh viên ĐH Fujimi.', 'Wan và ĐH Fujimi là sinh viên. | Wan không phải sinh viên ĐH Fujimi. | Wan là giáo viên ĐH Fujimi.', 'も = cũng.'),
      Q('お{国|くに}はどちらですか。', 'Nước của bạn là nước nào?', 'Sinh nhật bạn khi nào? | Bạn bao nhiêu tuổi? | Bạn làm nghề gì?', 'お国はどちら.'),
      Q('{私|わたし}は{教師|きょうし}じゃありません。', 'Tôi không phải giáo viên.', 'Tôi là giáo viên. | Bạn có phải giáo viên không? | Tôi cũng là giáo viên.', 'じゃありません.'),
      Q('{誕生日|たんじょうび}は{9月|くがつ}{1日|ついたち}です。', 'Sinh nhật là ngày 1 tháng 9.', 'Sinh nhật là ngày 9 tháng 1. | Sinh nhật là tháng 9 năm 1. | Sinh nhật là mùng 9.', 'Tháng trước, ngày sau.'),
    ]),

    H('Bảng thang điểm tự chấm'),
    TABLE(
      ['Phần', 'Điểm tối đa', 'Điểm của bạn', 'Nếu dưới 70% thì luyện lại'],
      [
        ['A. Từ vựng', '10', '', '`lt-b1-tu-vung`'],
        ['B. Chữ Hán', '15', '', '`lt-b1-chu-han`'],
        ['C. Trợ từ', '8', '', '`lt-b1-ngu-phap-1/2/3`'],
        ['D. Từ để hỏi', '6', '', '`lt-b1-ngu-phap-2`'],
        ['E. Chọn đáp án', '10', '', '`lt-b1-ngu-phap-tron`'],
        ['F. Cách đọc', '8', '', '`lt-b1-ngu-phap-2` (tháng, ngày, tuổi)'],
        ['G. Nghe', '10', '', '`lt-b1-nghe`'],
        ['H. Đọc hiểu', '9', '', '`lt-b1-doc-hieu`'],
        ['I. Dịch Việt → Nhật', '12', '', '`lt-b1-ngu-phap-tron`'],
        ['J. Dịch Nhật → Việt', '12', '', '`lt-b1-hoi-thoai`'],
      ],
    ),
    NOTE('Đánh giá', [
      '**85–100**: rất vững. Chỉ cần ôn nói và đọc to.',
      '**70–84**: khá. Luyện lại các phần dưới 70%.',
      '**50–69**: cần làm lại các lesson ngữ pháp và từ vựng trước khi thi.',
      '**Dưới 50**: quay về 6 buổi `s113-b1-…`, rồi làm lại từ mức Dễ.',
    ]),
  ],
};

export const LT_B1: Lesson[] = [L1_LO_TRINH, L1_TU_VUNG, L1_CHU_HAN, L1_NP1, L1_NP2, L1_NP3, L1_TRON, L1_HOI_THOAI, L1_DOC_HIEU, L1_NGHE, L1_NOI_VIET, L1_DE];

/* ═══════════════════════════════════════════════════════════════════
 *                       BÀI 2 — LUYỆN THÊM
 * ═══════════════════════════════════════════════════════════════════ */

/* ── hàm đọc số / tiền / tầng (tính bằng mã để kiểm đáp án lần 2) ── */
const D1 = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
function yomi4(n: number, naive = false): string {
  const th = Math.floor(n / 1000);
  const hu = Math.floor(n / 100) % 10;
  const te = Math.floor(n / 10) % 10;
  const un = n % 10;
  let s = '';
  if (th) s += th === 1 ? 'せん' : !naive && th === 3 ? 'さんぜん' : !naive && th === 8 ? 'はっせん' : D1[th] + 'せん';
  if (hu) s += hu === 1 ? 'ひゃく' : !naive && hu === 3 ? 'さんびゃく' : !naive && hu === 6 ? 'ろっぴゃく' : !naive && hu === 8 ? 'はっぴゃく' : D1[hu] + 'ひゃく';
  if (te) s += te === 1 ? 'じゅう' : D1[te] + 'じゅう';
  if (un) s += D1[un];
  return s;
}
function yomiYen(n: number, naive = false): string {
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  let s = '';
  if (man) s += (naive && man === 1 ? '' : yomi4(man, naive)) + 'まん';
  if (rest) s += yomi4(rest, naive);
  return s + 'えん';
}
const fmtN = (n: number) => n.toLocaleString('en-US');
/** Câu hỏi đọc giá tiền: đáp án đúng do mã tính; đáp án sai = cách đọc "thô" + số gần kề. */
function priceQ(n: number): ReturnType<typeof Q> {
  const ok = yomiYen(n);
  const bad: string[] = [];
  const add = (x: string) => { if (x !== ok && !bad.includes(x)) bad.push(x); };
  add(yomiYen(n, true));
  for (const m of [n + 100, n - 10, n * 10, n + 1000, n + 5000, n - 100, Math.max(10, Math.round(n / 10))]) { if (m > 0) add(yomiYen(m)); if (bad.length >= 3) break; }
  return Q(`${fmtN(n)}円 đọc là…`, ok, bad.slice(0, 3).join(' | '), `${fmtN(n)}円 = ${ok}.`);
}
const KAI: Record<number, string> = { 1: 'いっかい', 2: 'にかい', 3: 'さんがい', 4: 'よんかい', 5: 'ごかい', 6: 'ろっかい', 7: 'ななかい', 8: 'はっかい', 9: 'きゅうかい', 10: 'じゅっかい' };
function kaiQ(n: number): ReturnType<typeof Q> {
  const ok = KAI[n];
  const bad = [D1[n] + 'かい', D1[n] + 'がい', n === 1 ? 'ひとかい' : n === 3 ? 'みっかい' : D1[n % 9 + 1] + 'かい'].filter((x, i, a) => x !== ok && a.indexOf(x) === i);
  while (bad.length < 3) bad.push(D1[(n + bad.length + 3) % 9 + 1] + 'かい');
  return Q(`${n}階 đọc là…`, ok, bad.slice(0, 3).join(' | '), `${n}階 = ${ok}.`);
}
const TSU: Record<number, string> = { 1: 'ひとつ', 2: 'ふたつ', 3: 'みっつ', 4: 'よっつ', 5: 'いつつ', 6: 'むっつ', 7: 'ななつ', 8: 'やっつ', 9: 'ここのつ', 10: 'とお' };
function tsuQ(n: number): ReturnType<typeof Q> {
  const ok = TSU[n];
  const bad = [D1[n] + 'つ', D1[n] + 'っつ', n === 10 ? 'じゅうつ' : n === 9 ? 'きゅうつ' : D1[n] + 'こ'].filter((x, i, a) => x !== ok && a.indexOf(x) === i);
  while (bad.length < 3) bad.push(D1[(n + bad.length + 2) % 9 + 1] + 'つ');
  return Q(`${n} cái (～つ) đọc là…`, ok, bad.slice(0, 3).join(' | '), `${n}つ = ${ok}.`);
}

/* ───────── 0. LỘ TRÌNH ───────── */

const L2_LO_TRINH: Lesson = {
  id: 'lt-b2-lo-trinh',
  kind: 'review',
  title: 'Luyện thêm Bài 2 — đọc trước: lộ trình 7 ngày, cách dùng, kiểm tra đầu vào',
  goal: 'Biết bộ luyện Bài 2 gồm những gì, học theo thứ tự nào và biết mình yếu kỹ năng nào để luyện đúng chỗ.',
  minutes: 15,
  blocks: [
    RECAP('Học thế nào — đọc 1 phút trước khi luyện', [
      'Bộ này dành cho bạn **học lại từ đầu**: mỗi lesson đi từ 🟢 **Dễ** (nhận mặt) → 🟡 **Vừa** (dùng trong câu) → 🔴 **Khó** (trộn nhiều điểm như đề thi).',
      'Làm **đủ ba mức** theo thứ tự. Câu nào sai: đọc "why" rồi làm lại đúng câu đó; sai ba lần thì quay lại buổi học gốc `s113-b2-…`.',
      '**Số và giá tiền** là phần mất điểm nhiều nhất của Bài 2: dành ít nhất 2 lần luyện cho `lt-b2-ngu-phap-2`.',
      'Mọi câu tiếng Nhật đều có romaji và nghĩa. Bật furigana khi mới học; **tắt furigana ở mức Khó**.',
    ]),
    NOTE('Về nguồn', [HONEST + ' Mọi câu hỏi trong bộ này là viết mới; toà nhà ひかりデパート là tự đặt.']),
    H('Bài 2 gồm những kỹ năng nào?'),
    TABLE(
      ['Thứ tự', 'Lesson', 'Luyện gì', 'Ra trong đề nào'],
      [
        ['1', '`lt-b2-tu-vung`', '82 từ của cô: nhận mặt → điền câu → gõ từ', 'Trắc nghiệm từ vựng · câu hỏi nói'],
        ['2', '`lt-b2-chu-han`', '14 chữ dự kiến: 一…十 百 千 万 円', 'Đọc giá tiền, Reading'],
        ['3–5', '`lt-b2-ngu-phap-1/2/3`', 'ポイント 7–15 từng nhóm', 'Trợ từ · chọn đáp án · ghép câu'],
        ['6', '`lt-b2-ngu-phap-tron`', 'Trộn 9 ポイント', 'Dịch, điền cuối kỳ'],
        ['7', '`lt-b2-hoi-thoai`', '5 hội thoại mới: hỏi chỗ, mua, gọi món…', 'Thi nói (Q&A)'],
        ['8', '`lt-b2-doc-hieu`', '5 đoạn: bảng giá, thực đơn, mua sắm', 'Reading đọc to'],
        ['9', '`lt-b2-nghe`', '9 đoạn nghe: giá, tầng, số lượng, đổi ý', 'Nghe'],
        ['10', '`lt-b2-noi-viet`', 'Câu hỏi thi nói + thẻ nhân vật + bài viết', 'Thi nói + viết'],
        ['11', '`lt-b2-de-tong-hop`', 'Đề đủ phần, có giờ + thang điểm', 'Giả lập bài kiểm tra'],
      ],
    ),
    H('Lịch gợi ý 7 ngày (mỗi ngày 45–60 phút)'),
    TABLE(
      ['Ngày', 'Làm'],
      [
        ['1', 'Từ vựng nhóm toà nhà + đồ vật (cả ba mức)'],
        ['2', 'Từ vựng thực phẩm + món ăn + chữ Hán'],
        ['3', 'Ngữ pháp 1 (ポイント 7–9) + nghe 1–3'],
        ['4', 'Ngữ pháp 2 (ポイント 10–11, số, giá, 〜つ, 〜階) + nghe 4–6'],
        ['5', 'Ngữ pháp 3 (ポイント 12–15) + ngữ pháp trộn + hội thoại 1–3'],
        ['6', 'Hội thoại 4–5 + đọc hiểu 1–5 + nghe 7–9'],
        ['7', 'Nói & viết (thu âm) + đề tổng hợp trong 45 phút, không nhìn đáp án'],
      ],
    ),
    NOTE('Ưu tiên khi sắp thi', [
      'Điểm dễ nhất: **こ・そ・あ・ど** (これ/この/ここ/どこ…) và **trợ từ を／の／で**. Mỗi câu đúng là một điểm chắc.',
      'Điểm hay mất: **300 600 800 · 3000 8000 · 10000 (いちまん)**, **3階 さんがい**, **〜つ** (ひとつ…とお), **これ ≠ この**.',
      'Thi nói: nhìn thẻ nhân vật → nói đủ **nước + giá**; hỏi tầng → đáp "○階です".',
    ]),
    MC('lt-b2-lt-vao', 'Kiểm tra đầu vào (12 câu, 8 phút) — sai nhóm nào thì ưu tiên luyện nhóm đó', [
      Q('Từ vựng — 「{財布|さいふ}」 nghĩa là gì?', 'Ví tiền', 'Đồng hồ | Cặp | Giày', '財布 = さいふ.'),
      Q('Từ vựng — 「レジ」 là gì?', 'Quầy thu ngân', 'Thang máy | Nhà vệ sinh | Quầy thông tin', 'レジ.'),
      Q('Từ vựng — 「{鶏肉|とりにく}」 là gì?', 'Thịt gà', 'Thịt bò | Thịt lợn | Cá', '鶏肉.'),
      Q('Hỏi nơi — 「トイレは＿＿＿ですか」', 'どこ', 'いくら | だれ | {何|なん}', 'どこ.'),
      Q('Chỉ vật — 「＿＿＿は ペンです」 (cái này)', 'これ', 'この | ここ | その', 'Không có danh từ → これ.'),
      Q('Chỉ vật — 「＿＿＿ かばんは {私|わたし}のです」 (cái cặp này)', 'この', 'これ | ここ | どれ', 'Có danh từ → この.'),
      Q('Tầng — 「3階」', 'さんがい', 'さんかい | みっかい | さんがく', '3階.'),
      priceQ(600),
      priceQ(3000),
      tsuQ(3),
      Q('Mua — 「コーヒー（　）{二|ふた}つください」', 'を', 'は | の | が', 'N を … ください.'),
      Q('Hỏi từ — 「ペンは{日本語|にほんご}（　）{何|なん}ですか」', 'で', 'を | の | は', 'N は 〜語で 何ですか.'),
    ]),
    NOTE('Chấm điểm đầu vào', [
      '10–12 đúng: bạn khá vững → làm thẳng mức Vừa–Khó, dành nhiều thời gian cho nghe/nói.',
      '6–9 đúng: làm từ mức Dễ của lesson bạn sai.',
      'Dưới 6: làm lần lượt từ lesson 1; mỗi ngày không quá 2 lesson.',
    ]),
  ],
};

/* ───────── 1. TỪ VỰNG ───────── */

const B2_VW: VW[] = [
  ['ここ／こちら', 'chỗ này / phía này', 'cho'],
  ['そこ／そちら', 'chỗ đó / phía đó', 'cho'],
  ['あそこ／あちら', 'chỗ kia / phía kia', 'cho'],
  ['どこ', 'ở đâu, nơi nào', 'cho'],
  ['インフォメーション', 'quầy thông tin', 'cho'],
  ['ATM', 'máy rút tiền tự động', 'cho'],
  ['エスカレーター', 'thang cuốn', 'cho'],
  ['エレベーター', 'thang máy', 'cho'],
  ['きつえんじょ', 'nơi hút thuốc', 'cho'],
  ['トイレ', 'nhà vệ sinh', 'cho'],
  ['レジ', 'quầy thu ngân', 'cho'],
  ['きっさてん', 'quán giải khát', 'cho'],
  ['スーパー', 'siêu thị', 'cho'],
  ['{100円|ひゃくえん}ショップ', 'cửa hàng 100 yên', 'cho'],
  ['レストラン', 'nhà hàng, quán ăn', 'cho'],
  ['{地下|ちか}', 'tầng hầm, dưới lòng đất', 'cho'],
  ['〜{階|かい}', 'tầng ～', 'cho'],
  ['〜{屋|や}', 'cửa hàng ～, hiệu ～', 'cho'],
  ['{店員|てんいん}', 'nhân viên bán hàng', 'cho'],
  ['カメラ', 'máy ảnh', 'do'],
  ['{携帯電話|けいたいでんわ}', 'điện thoại di động', 'do'],
  ['{電子辞書|でんしじしょ}', 'kim từ điển', 'do'],
  ['パソコン', 'máy tính cá nhân', 'do'],
  ['くつ', 'giày', 'do'],
  ['{消|け}しゴム', 'cục tẩy', 'do'],
  ['ペン', 'bút', 'do'],
  ['トイレットペーパー', 'giấy vệ sinh', 'do'],
  ['{本|ほん}', 'sách', 'do'],
  ['かばん', 'cặp, túi xách', 'do'],
  ['ズボン', 'quần dài', 'do'],
  ['Tシャツ', 'áo phông', 'do'],
  ['{時計|とけい}', 'đồng hồ', 'do'],
  ['{財布|さいふ}', 'ví tiền', 'do'],
  ['{油|あぶら}', 'dầu ăn', 'thuc'],
  ['ケーキ', 'bánh ngọt', 'thuc'],
  ['{米|こめ}', 'gạo', 'thuc'],
  ['{卵|たまご}', 'trứng', 'thuc'],
  ['パン', 'bánh mì', 'thuc'],
  ['{水|みず}', 'nước (uống)', 'thuc'],
  ['{魚|さかな}', 'cá', 'thuc'],
  ['{肉|にく}', 'thịt', 'thuc'],
  ['{牛肉|ぎゅうにく}', 'thịt bò', 'thuc'],
  ['{鶏肉|とりにく}', 'thịt gà', 'thuc'],
  ['{豚肉|ぶたにく}', 'thịt lợn', 'thuc'],
  ['{野菜|やさい}', 'rau', 'thuc'],
  ['イチゴ', 'quả dâu', 'thuc'],
  ['リンゴ', 'quả táo', 'thuc'],
  ['{料理|りょうり}', 'món ăn / nấu ăn', 'an'],
  ['カレー', 'món cà-ri', 'an'],
  ['スープ', 'canh, súp', 'an'],
  ['とんかつ', 'thịt lợn chiên xù', 'an'],
  ['ハンバーグ', 'thịt băm viên', 'an'],
  ['ご{飯|はん}', 'cơm (món Nhật)', 'an'],
  ['ライス', 'cơm (kiểu phương Tây)', 'an'],
  ['ジュース', 'nước ngọt, nước trái cây', 'an'],
  ['コーヒー', 'cà phê', 'an'],
  ['{紅茶|こうちゃ}', 'trà đen', 'an'],
  ['（お）{茶|ちゃ}', 'trà, nước chè', 'an'],
  ['ビール', 'bia', 'an'],
  ['ワイン', 'rượu vang', 'an'],
  ['これ／それ／あれ', 'cái này / cái đó / cái kia', 'khac'],
  ['この〜／その〜／あの〜', '～ này / ～ đó / ～ kia', 'khac'],
  ['〜{円|えん}', 'yên (tiền Nhật)', 'khac'],
  ['いくら', 'bao nhiêu tiền', 'khac'],
  ['じゃ', 'thế thì, thôi thì', 'khac'],
  ['〜つ', '～ cái / ～ chiếc', 'khac'],
  ['だれ', 'ai', 'khac'],
  ['{注文|ちゅうもん}をお{願|ねが}いします', 'cho tôi gọi món', 'khac'],
  ['どうぞ', 'xin mời', 'khac'],
  ['いらっしゃいませ', 'kính chào quý khách', 'khac'],
  ['（どうも）ありがとうございます', 'xin cảm ơn (nhiều)', 'khac'],
  ['インド', 'Ấn Độ', 'khac'],
  ['ドイツ', 'Đức', 'khac'],
  ['フランス', 'Pháp', 'khac'],
  ['{英語|えいご}', 'tiếng Anh', 'khac'],
  ['〜{語|ご}', 'tiếng (nước nào)', 'khac'],
];
const B2_G = (g: string) => B2_VW.filter((r) => r[2] === g);

const L2_TU_VUNG: Lesson = {
  id: 'lt-b2-tu-vung',
  kind: 'vocab',
  title: 'Luyện thêm Bài 2 — Từ vựng: nhận mặt → điền câu → gõ từ (khoảng 190 câu)',
  goal: 'Nhận ra và dùng đúng 82 từ trong danh sách Bài 2 của cô — từ nhìn mặt chữ đến tự gõ từ khi chỉ có nghĩa tiếng Việt.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Làm 🟢 Dễ bằng cách **nhìn chữ, nói to cách đọc, rồi mới chọn nghĩa**. Đừng đoán — nói ra miệng mới nhớ.',
      '🟡 Vừa: mỗi từ phải nằm trong câu (mua sắm, gọi món…). Đề thi luôn cho từ trong câu.',
      '🔴 Khó: tự gõ từ khi chỉ có nghĩa Việt; từ gõ sai thì viết lại 3 lần bằng tay.',
      'Lỗi hay mắc: nhầm **ご飯/ライス**, **お茶/紅茶**, **これ/この**, **そこ/あそこ**; đọc **3階** thành さんかい.',
    ]),

    H(`${LV.de} — A. Nhìn từ, chọn nghĩa (75 câu, chia 5 nhóm)`),
    VW2M('lt-b2-tv-a1', 'A1. Nơi chốn trong toà nhà', B2_G('cho')),
    VW2M('lt-b2-tv-a2', 'A2. Đồ dùng, đồ điện tử, quần áo', B2_G('do')),
    VW2M('lt-b2-tv-a3', 'A3. Thực phẩm', B2_G('thuc')),
    VW2M('lt-b2-tv-a4', 'A4. Món ăn và đồ uống', B2_G('an')),
    VW2M('lt-b2-tv-a5', 'A5. Từ chỉ định, giá, giao tiếp, nước', B2_G('khac')),

    H(`${LV.de} — B. Nghĩa Việt, chọn từ Nhật (30 câu)`),
    VM2W('lt-b2-tv-b1', 'B1. Đồ vật', B2_G('do').slice(0, 10)),
    VM2W('lt-b2-tv-b2', 'B2. Thực phẩm', B2_G('thuc').slice(0, 10)),
    VM2W('lt-b2-tv-b3', 'B3. Món ăn và đồ uống', B2_G('an').slice(0, 10)),

    H(`${LV.vua} — C. Chọn từ KHÁC loại (8 câu)`),
    MC('lt-b2-tv-khac-loai', 'C. Một từ khác loại với ba từ còn lại', [
      Q('Chọn từ KHÁC loại: レジ / ATM / スーパー / リンゴ', 'リンゴ', 'レジ | ATM | スーパー', '3 từ kia là nơi/thiết bị trong toà nhà; リンゴ là thực phẩm.'),
      Q('Chọn từ KHÁC loại: {牛肉|ぎゅうにく} / {鶏肉|とりにく} / {豚肉|ぶたにく} / {野菜|やさい}', '{野菜|やさい}', '{牛肉|ぎゅうにく} | {鶏肉|とりにく} | {豚肉|ぶたにく}', '3 từ kia là thịt.'),
      Q('Chọn từ KHÁC loại: コーヒー / {紅茶|こうちゃ} / ジュース / カレー', 'カレー', 'コーヒー | {紅茶|こうちゃ} | ジュース', '3 từ kia là đồ uống.'),
      Q('Chọn từ KHÁC loại: カメラ / パソコン / {電子辞書|でんしじしょ} / ズボン', 'ズボン', 'カメラ | パソコン | {電子辞書|でんしじしょ}', '3 từ kia là đồ điện tử.'),
      Q('Chọn từ KHÁC loại: フランス / ドイツ / インド / {英語|えいご}', '{英語|えいご}', 'フランス | ドイツ | インド', '3 từ kia là tên nước.'),
      Q('Chọn từ KHÁC loại: くつ / ズボン / Tシャツ / ペン', 'ペン', 'くつ | ズボン | Tシャツ', '3 từ kia là quần áo, giày.'),
      Q('Chọn từ KHÁC loại: ここ / そこ / あそこ / これ', 'これ', 'ここ | そこ | あそこ', '3 từ kia chỉ nơi chốn; これ chỉ đồ vật.'),
      Q('Chọn từ KHÁC loại: {米|こめ} / {卵|たまご} / {油|あぶら} / ビール', 'ビール', '{米|こめ} | {卵|たまご} | {油|あぶら}', '3 từ kia là nguyên liệu nấu ăn; ビール là đồ uống.'),
    ]),

    H(`${LV.vua} — D. Điền từ vào câu (16 câu)`),
    MC('lt-b2-tv-dien-tu', 'D. Chọn từ điền vào chỗ trống', [
      Q('「トイレは＿＿＿ですか。」 ── 「あそこです。」', 'どこ', 'いくら | だれ | {何|なん}', 'Hỏi nơi: どこ.'),
      Q('「これは＿＿＿ですか。」 ── 「{携帯電話|けいたいでんわ}です。」', '{何|なん}', 'どこ | いくら | だれ', 'Hỏi vật: 何.'),
      Q('「この ケーキは＿＿＿ですか。」 ── 「{450円|よんひゃくごじゅうえん}です。」', 'いくら', 'どこ | だれ | {何|なん}', 'Hỏi giá: いくら.'),
      Q('「この かばんは＿＿＿のですか。」 ── 「ワンさんのです。」', 'だれ', 'どこ | いくら | {何|なん}', 'Hỏi chủ: だれ.'),
      Q('ケーキを＿＿＿ ください。 (2 cái)', '{二|ふた}つ', '{二|に}つ | {二|ふた} | {二|に}', '2つ = ふたつ.'),
      Q('「ペンは{日本語|にほんご}で＿＿＿ですか。」', '{何|なん}', 'どこ | いくら | だれ', 'Hỏi từ: 何.'),
      Q('＿＿＿、これを ください。 (Vậy thì)', 'じゃ', 'こちらこそ | はじめまして | どうぞ', 'じゃ = vậy thì.'),
      Q('「{注文|ちゅうもん}をお{願|ねが}いします。」 ── 「はい、＿＿＿。」', 'どうぞ', 'いらっしゃいませ | じゃ | こちらこそ', 'どうぞ = xin mời.'),
      Q('Nhân viên chào khách bước vào cửa hàng:', 'いらっしゃいませ', 'どうぞ | こちらこそ | じゃ', 'いらっしゃいませ.'),
      Q('スーパーは {地下|ちか}＿＿＿です。 (tầng 1)', '{1階|いっかい}', '{1階|いちかい} | {1階|ひとかい} | {1階|いちがい}', '1階 = いっかい.'),
      Q('＿＿＿ かばんは {私|わたし}のです。 (cái cặp này)', 'この', 'これ | ここ | どれ', 'Có danh từ → この.'),
      Q('＿＿＿は ペンです。 (cái này, không có danh từ)', 'これ', 'この | その | あの', 'Không danh từ → これ.'),
      Q('「これは＿＿＿のワインですか。」 ── 「フランスのです。」', 'どこ', '{何|なん} | だれ | いくら', 'Hỏi nước/nguồn gốc: どこの.'),
      Q('これは フランスの＿＿＿です。 (rượu vang)', 'ワイン', 'スープ | ペン | かばん', 'フランスのワイン.'),
      Q('ジュースを＿＿＿ ください。 (3 cái)', '{三|みっ}つ', '{三|さん}つ | {三|み}つ | {三|さん}っつ', '3つ = みっつ.'),
      Q('カレーに＿＿＿を ください。 (cơm trắng đi kèm)', 'ライス', 'スープ | ジュース | ビール', 'ライス.'),
    ]),

    H(`${LV.vua} — E. Cặp dễ nhầm (10 câu)`),
    MC('lt-b2-tv-cap-nham', 'E. Chọn từ ĐÚNG chỗ', [
      Q('Cơm của món Nhật (ăn với cá, súp miso…):', 'ご{飯|はん}', 'ライス | スープ | パン', 'ご飯 = cơm Nhật; ライス = cơm kiểu phương Tây (ăn với cà-ri).'),
      Q('Trà đen (kiểu Anh):', '{紅茶|こうちゃ}', '（お）{茶|ちゃ} | コーヒー | ジュース', '紅茶 = trà đen; お茶 = trà xanh/ trà Nhật.'),
      Q('「そこ」 chỉ…', 'Chỗ gần NGƯỜI NGHE', 'Chỗ gần người nói | Chỗ xa cả hai | Hỏi nơi', 'そこ.'),
      Q('「あそこ」 chỉ…', 'Chỗ xa cả hai người', 'Chỗ gần người nói | Chỗ gần người nghe | Hỏi nơi', 'あそこ.'),
      Q('「{3階|さんがい}」 đọc đúng là…', 'さんがい', 'さんかい | みっかい | さんがく', '3階 đọc がい.'),
      Q('「{本屋|ほんや}」 là…', 'Hiệu sách', 'Quyển sách | Thư viện | Bàn sách', '本屋 = hiệu sách.'),
      Q('「いくら」 hỏi về…', 'Giá tiền', 'Số lượng (mấy cái) | Nơi chốn | Người', 'いくら.'),
      Q('「いくつ」 hỏi về…', 'Số lượng (mấy cái)', 'Giá tiền | Nơi chốn | Người', 'いくつ.'),
      Q('「だれ」 hỏi về…', 'Người', 'Nơi chốn | Giá tiền | Số lượng', 'だれ = ai.'),
      Q('「{店員|てんいん}」 là…', 'Nhân viên bán hàng', 'Khách hàng | Chủ cửa hàng | Giáo viên', '店員.'),
    ]),

    H(`${LV.kho} — F. Tự gõ từ khi chỉ có nghĩa Việt (14 câu)`),
    QZ('lt-b2-tv-go', 'F. Gõ từ tiếng Nhật (chữ Hán hoặc kana)', 'translate', [
      A('Nhà vệ sinh', 'トイレ'),
      A('Thang máy', 'エレベーター'),
      A('Quầy thu ngân', 'レジ'),
      A('Điện thoại di động', '{携帯電話|けいたいでんわ}'),
      A('Kim từ điển', '{電子辞書|でんしじしょ}'),
      A('Đồng hồ', '{時計|とけい}'),
      A('Ví tiền', '{財布|さいふ}'),
      A('Cá', '{魚|さかな}'),
      A('Rau', '{野菜|やさい}'),
      A('Thịt bò', '{牛肉|ぎゅうにく}'),
      A('Trà đen', '{紅茶|こうちゃ}'),
      A('Nhân viên bán hàng', '{店員|てんいん}'),
      A('Gạo', '{米|こめ}'),
      A('Trứng', '{卵|たまご}'),
    ]),

    H(`${LV.kho} — G. Đọc câu, hiểu nghĩa (8 câu)`),
    MC('lt-b2-tv-hieu-cau', 'G. Chọn nghĩa đúng của câu', [
      Q('スーパーは{地下|ちか}です。', 'Siêu thị ở tầng hầm.', 'Siêu thị ở tầng 5. | Tôi đi siêu thị. | Siêu thị đóng cửa.', '地下 = tầng hầm.'),
      Q('{100円|ひゃくえん}ショップは{3階|さんがい}です。', 'Cửa hàng 100 yên ở tầng 3.', 'Cửa hàng 100 yên ở tầng 1. | Cửa hàng 100 yên giá 3 yên. | Có 3 cửa hàng 100 yên.', '3階.'),
      Q('この{時計|とけい}はいくらですか。', 'Đồng hồ này bao nhiêu tiền?', 'Đồng hồ này của ai? | Đồng hồ này ở đâu? | Đồng hồ này là cái gì?', 'いくら.'),
      Q('ビールを{二|ふた}つください。', 'Cho tôi hai chai bia.', 'Cho tôi bia và nước. | Bia hai yên. | Bia ở tầng 2.', 'N を ～つ ください.'),
      Q('これはフランスのワインです。', 'Đây là rượu vang Pháp.', 'Đây là rượu vang của tôi. | Pháp là rượu vang. | Rượu vang ở Pháp.', 'N の N.'),
      Q('この{本|ほん}はだれのですか。', 'Quyển sách này là của ai?', 'Quyển sách này bao nhiêu tiền? | Quyển sách này ở đâu? | Quyển sách này là gì?', 'だれの.'),
      Q('「ペン」は{日本語|にほんご}で{何|なん}ですか。', '"Pen" tiếng Nhật là gì?', '"Pen" bao nhiêu tiền? | "Pen" ở đâu? | "Pen" của ai?', '日本語で何.'),
      Q('{注文|ちゅうもん}をお{願|ねが}いします。', 'Cho tôi gọi món.', 'Cảm ơn quý khách. | Xin chào quý khách. | Mời ngồi.', '注文をお願いします.'),
    ]),
  ],
};

/* ───────── 2. CHỮ HÁN ───────── */

const L2_CHU_HAN: Lesson = {
  id: 'lt-b2-chu-han',
  kind: 'kanji',
  title: 'Luyện thêm Bài 2 — Chữ Hán của lớp (dự kiến): 一 二 三 四 五 六 七 八 九 十 百 千 万 円 — số và giá tiền',
  goal: 'Nhận mặt 14 chữ số và 円, đọc đúng giá tiền viết bằng chữ Hán và đọc to câu không furigana như đề Reading.',
  minutes: 50,
  blocks: [
    NOTE('Học thế nào', [
      'Danh sách chữ là **dự kiến**; thẻ chữ Hán chi tiết ở ngay bên dưới.',
      'Chữ số rất dễ nhìn nhầm: **三 và 王**, **千 và 干**, **万 và 方**. Tập viết đủ nét để phân biệt.',
      'Đọc giá tiền theo **万 / 千 / 百 / 十**: 二万三千円 = にまん さんぜん えん. Nhớ các biến âm 三百 / 六百 / 八百 / 三千 / 八千.',
    ]),
    { t: 'hanlop', bai: 2 },
    TABLE(
      ['Chữ', 'Đọc (số)', 'Đọc (đếm vật)', 'Chú ý'],
      [
        ['一', 'いち', 'ひとつ', ''],
        ['二', 'に', 'ふたつ', ''],
        ['三', 'さん', 'みっつ', '三階 さんがい · 三百 さんびゃく · 三千 さんぜん'],
        ['四', 'よん・し', 'よっつ', '四階 よんかい'],
        ['五', 'ご', 'いつつ', ''],
        ['六', 'ろく', 'むっつ', '六百 ろっぴゃく'],
        ['七', 'なな・しち', 'ななつ', ''],
        ['八', 'はち', 'やっつ', '八百 はっぴゃく · 八千 はっせん'],
        ['九', 'きゅう・く', 'ここのつ', ''],
        ['十', 'じゅう', 'とお', ''],
        ['百', 'ひゃく', '', '三百 · 六百 · 八百 biến âm'],
        ['千', 'せん', '', '三千 · 八千 biến âm'],
        ['万', 'まん', '', '一万 phải có いち'],
        ['円', 'えん', '', 'Luôn đọc えん'],
      ],
      'Bảng tra nhanh',
    ),

    H(`${LV.de} — A. Chữ nào là số…? (14 câu)`),
    MC('lt-b2-han-nghia', 'A. Chọn chữ Hán đúng với số', [
      Q('1', '一', '二 | 三 | 十', '一 = 1.'),
      Q('2', '二', '一 | 三 | 八', '二 = 2.'),
      Q('3', '三', '二 | 王 | 五', '三 = 3.'),
      Q('4', '四', '五 | 六 | 田', '四 = 4.'),
      Q('5', '五', '四 | 六 | 立', '五 = 5.'),
      Q('6', '六', '八 | 九 | 大', '六 = 6.'),
      Q('7', '七', '十 | 九 | 土', '七 = 7.'),
      Q('8', '八', '人 | 入 | 九', '八 = 8.'),
      Q('9', '九', '力 | 七 | 八', '九 = 9.'),
      Q('10', '十', '千 | 干 | 七', '十 = 10.'),
      Q('100', '百', '白 | 日 | 目', '百 = 100.'),
      Q('1,000', '千', '十 | 干 | 午', '千 = 1000.'),
      Q('10,000', '万', '方 | 力 | 刀', '万 = 10.000.'),
      Q('Yên (tiền Nhật)', '円', '用 | 内 | 同', '円 = えん.'),
    ]),

    H(`${LV.de} — B. Đọc giá tiền viết bằng chữ Hán (16 câu)`),
    RDQ('lt-b2-han-doc', 'B. Chọn cách đọc đúng', [
      ['{百円|ひゃくえん}', 'ひゃくえん', ['いちひゃくえん', 'ひゃくげん', 'ももえん'], '百円.'],
      ['{三百円|さんびゃくえん}', 'さんびゃくえん', ['さんひゃくえん', 'みっつひゃくえん', 'さんびゃくげん'], '三百 = さんびゃく.'],
      ['{六百円|ろっぴゃくえん}', 'ろっぴゃくえん', ['ろくひゃくえん', 'むっぴゃくえん', 'ろくびゃくえん'], '六百 = ろっぴゃく.'],
      ['{八百円|はっぴゃくえん}', 'はっぴゃくえん', ['はちひゃくえん', 'はっひゃくえん', 'やっぴゃくえん'], '八百 = はっぴゃく.'],
      ['{千円|せんえん}', 'せんえん', ['いちせんえん', 'ちえん', 'せんげん'], '千円.'],
      ['{三千円|さんぜんえん}', 'さんぜんえん', ['さんせんえん', 'みっつせんえん', 'さんぜんげん'], '三千 = さんぜん.'],
      ['{八千円|はっせんえん}', 'はっせんえん', ['はちせんえん', 'はっぜんえん', 'やっせんえん'], '八千 = はっせん.'],
      ['{一万円|いちまんえん}', 'いちまんえん', ['まんえん', 'ひとまんえん', 'いちばんえん'], '一万 = いちまん.'],
      ['{二万円|にまんえん}', 'にまんえん', ['ふたまんえん', 'にばんえん', 'にまんげん'], '二万.'],
      ['{三万五千円|さんまんごせんえん}', 'さんまんごせんえん', ['さんまんごぜんえん', 'さんぜんごまんえん', 'みつまんいつせんえん'], '3万5千.'],
      ['{四百五十円|よんひゃくごじゅうえん}', 'よんひゃくごじゅうえん', ['しひゃくごじゅうえん', 'よんびゃくごじゅうえん', 'よんひゃくごじゅえん'], '450.'],
      ['{二千八百円|にせんはっぴゃくえん}', 'にせんはっぴゃくえん', ['にせんはちひゃくえん', 'にぜんはっぴゃくえん', 'にせんやっぴゃくえん'], '2800.'],
      ['{三階|さんがい}', 'さんがい', ['さんかい', 'みっかい', 'さんがく'], '3階.'],
      ['{二つ|ふたつ}', 'ふたつ', ['につ', 'ふたっつ', 'にっつ'], '二つ = ふたつ.'],
      ['{三つ|みっつ}', 'みっつ', ['さんつ', 'みつ', 'さんっつ'], '三つ = みっつ.'],
      ['十 (đếm đồ vật: 10 cái)', 'とお', ['じゅうつ', 'とつ', 'じゅっつ'], '10 cái (đếm bằng 〜つ) = とお.'],
    ]),

    H(`${LV.vua} — C. Cách đọc → chữ (10 câu)`),
    MC('lt-b2-han-viet', 'C. Chọn chữ Hán đúng', [
      Q('さんびゃくえん', '三百円', '三白円 | 王百円 | 三百用', '三百円.'),
      Q('ろっぴゃくえん', '六百円', '大百円 | 六白円 | 六百同', '六百円.'),
      Q('いちまんえん', '一万円', '一方円 | 二万円 | 一万用', '一万円.'),
      Q('にせんえん', '二千円', '二干円 | 三千円 | 二千用', '二千円.'),
      Q('ごひゃくえん', '五百円', '五白円 | 立百円 | 五百用', '五百円.'),
      Q('ななひゃくえん', '七百円', '土百円 | 十百円 | 七白円', '七百円.'),
      Q('よんせんえん', '四千円', '田千円 | 四干円 | 五千円', '四千円.'),
      Q('きゅうせんえん', '九千円', '力千円 | 九干円 | 八千円', '九千円.'),
      Q('じゅうまんえん', '十万円', '千万円 | 十方円 | 十万用', '十万円.'),
      Q('はっぴゃくえん', '八百円', '入百円 | 人百円 | 八白円', '八百円.'),
    ]),

    H(`${LV.vua} — D. Gõ cách đọc bằng hiragana (12 câu)`),
    QZ('lt-b2-han-go', 'D. Viết cách đọc', 'fill', [
      A('三百円', 'さんびゃくえん'),
      A('六百円', 'ろっぴゃくえん'),
      A('八百円', 'はっぴゃくえん'),
      A('三千円', 'さんぜんえん'),
      A('八千円', 'はっせんえん'),
      A('一万円', 'いちまんえん'),
      A('五万円', 'ごまんえん'),
      A('二万四千円', 'にまんよんせんえん'),
      A('千五百円', 'せんごひゃくえん'),
      A('四つ', 'よっつ'),
      A('五つ', 'いつつ'),
      A('七つ', 'ななつ'),
    ]),

    H(`${LV.kho} — E. Đọc to KHÔNG furigana (tự chấm) — 12 câu`),
    READK('lt-b2-han-docto', 'E. Đọc to rồi bấm xem đáp án', 'Đọc cả câu thành tiếng trước, rồi mới bấm xem cách đọc.', [
      RK('この パン は {百円|ひゃくえん} です。', 'Cái bánh mì này 100 yên.'),
      RK('この ケーキ は {四百五十円|よんひゃくごじゅうえん} です。', 'Cái bánh này 450 yên.'),
      RK('この {時計|とけい} は {二万円|にまんえん} です。', 'Chiếc đồng hồ này 20.000 yên.'),
      RK('その かばん は {三千円|さんぜんえん} です。', 'Cái cặp đó 3.000 yên.'),
      RK('あの くつ は {八千円|はっせんえん} です。', 'Đôi giày kia 8.000 yên.'),
      RK('{米|こめ} は {二千九百八十円|にせんきゅうひゃくはちじゅうえん} です。', 'Gạo 2.980 yên.'),
      RK('{三階|さんがい} は {100円|ひゃくえん}-ショップ です。', 'Tầng 3 là cửa hàng 100 yên.'),
      RK('コーヒー を {二|ふた}つ ください。', 'Cho tôi hai cà phê.'),
      RK('ジュース を {三|みっ}つ ください。', 'Cho tôi ba nước ép.'),
      RK('{全部|ぜんぶ} で {千二百円|せんにひゃくえん} です。', 'Tất cả là 1.200 yên.'),
      RK('{財布|さいふ} は {一万円|いちまんえん} です。', 'Cái ví 10.000 yên.'),
      RK('{本屋|ほんや} は {二階|にかい} です。', 'Hiệu sách ở tầng 2.'),
    ]),

    H(`${LV.kho} — F. Câu hỏi nhận mặt trong đoạn (6 câu)`),
    MC('lt-b2-han-doan', 'F. Đọc đoạn và trả lời', [
      Q('「パンは{百五十円|ひゃくごじゅうえん}、ケーキは{四百五十円|よんひゃくごじゅうえん}です。」 — Món nào đắt hơn?', 'ケーキ', 'パン | Bằng nhau | Không biết', '450 > 150.'),
      Q('「{二万円|にまんえん}」 là bao nhiêu?', '20.000 yên', '2.000 yên | 200 yên | 200.000 yên', '二万 = 2 × 10.000.'),
      Q('「{三階|さんがい}にトイレがあります」 — Nhà vệ sinh ở…', 'Tầng 3', 'Tầng 1 | Tầng 2 | Tầng 4', '三階.'),
      Q('「ビールを{二|ふた}つ、ジュースを{三|みっ}つ」 — Tổng số đồ uống?', '5 cái', '2 cái | 3 cái | 6 cái', '2 + 3.'),
      Q('「{千円|せんえん}」 và 「{一万円|いちまんえん}」 khác nhau bao nhiêu lần?', '10 lần', '2 lần | 100 lần | 5 lần', '1.000 vs 10.000.'),
      Q('「{円|えん}」 đọc là…', 'えん', 'きん | しん | めん', '円 = えん.'),
    ]),

    H('✍ Tập viết tay (Apple Pencil / chuột)'),
    WRITE('lt-b2-han-tapviet', 'Tập viết 14 chữ + vài từ', ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '円', '三百円', '一万円', '三階'], 'Viết đúng thứ tự nét; sau đó bật "Che mẫu" để tự nhớ.', {
      '三百円': 'さんびゃくえん · 300 yên',
      '一万円': 'いちまんえん · 10.000 yên',
      '三階': 'さんがい · tầng 3',
    }),
  ],
};

/* ───────── 3. NGỮ PHÁP 1: ポイント 7–9 ───────── */

const L2_NP1: Lesson = {
  id: 'lt-b2-ngu-phap-1',
  kind: 'grammar',
  title: 'Luyện thêm Bài 2 — Ngữ pháp 1: これ／それ／あれ · この／その／あの N · ここ／そこ／あそこ／どこ · 〜階 (ポイント 7–9)',
  goal: 'Chỉ đồ vật và nơi chốn đúng bằng bộ こ・そ・あ・ど, phân biệt これ ≠ この, hỏi và đáp tầng trong toà nhà.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      '**こ・そ・あ・ど**: こ gần người nói, そ gần người nghe, あ xa cả hai, ど là hỏi. Ba bộ: **これ**(vật) · **この＋N**(vật có danh từ) · **ここ**(nơi).',
      'Luôn tự hỏi: *sau chỗ trống có danh từ không?* Có → この／その／あの. Không → これ／それ／あれ.',
      'Hỏi tầng: **何階** *nangai*; đáp: **〜階**. 1階 いっかい · 3階 **さんがい** · 6階 ろっかい.',
    ]),
    TABLE(
      ['', 'こ (gần tôi)', 'そ (gần bạn)', 'あ (xa cả hai)', 'ど (hỏi)'],
      [
        ['Vật', 'これ', 'それ', 'あれ', 'どれ'],
        ['Vật + N', 'この N', 'その N', 'あの N', 'どの N'],
        ['Nơi', 'ここ', 'そこ', 'あそこ', 'どこ'],
        ['Phía (lịch sự)', 'こちら', 'そちら', 'あちら', 'どちら'],
      ],
      'Bảng こ・そ・あ・ど',
    ),
    TABLE(
      ['Tầng', 'Có gì (ひかりデパート)'],
      [
        ['5階', 'レストラン · きつえんじょ'],
        ['4階', 'カメラ屋'],
        ['3階', '100円ショップ · トイレ'],
        ['2階', '本屋 · くつ屋'],
        ['1階', 'インフォメーション · ATM · きっさてん'],
        ['地下1階', 'スーパー · レジ'],
      ],
      'Sơ đồ dùng cho phần D (tự đặt)',
    ),

    H(`${LV.de} — A. これ hay この? (14 câu)`),
    MC('lt-b2-g1-kore-kono', 'A. Chọn đúng', [
      Q('＿＿＿は ペンです。 (cái này)', 'これ', 'この | ここ | どこ', 'Không danh từ → これ.'),
      Q('＿＿＿ ペンは {私|わたし}のです。 (cây bút này)', 'この', 'これ | ここ | どれ', 'Có danh từ → この.'),
      Q('＿＿＿は {何|なん}ですか。 (cái kia)', 'あれ', 'あの | あそこ | どれ', 'あれ.'),
      Q('＿＿＿ かばんは いくらですか。 (cái cặp đó, gần người nghe)', 'その', 'それ | そこ | あの', 'その + N.'),
      Q('＿＿＿は {時計|とけい}です。 (cái đó, gần người nghe)', 'それ', 'その | そこ | あれ', 'それ.'),
      Q('＿＿＿ {時計|とけい}は {日本|にほん}のです。 (chiếc đồng hồ kia, xa cả hai)', 'あの', 'あれ | あそこ | その', 'あの + N.'),
      Q('「＿＿＿は {何|なん}ですか。」 ── 「{電子辞書|でんしじしょ}です。」 (hỏi vật)', 'これ', 'ここ | どこ | だれ', 'これは何ですか.'),
      Q('＿＿＿ くつは {八千円|はっせんえん}です。 (đôi giày này)', 'この', 'これ | ここ | あれ', 'この + N.'),
      Q('＿＿＿は カメラです。 (cái kia)', 'あれ', 'あの | あそこ | その', 'あれ.'),
      Q('＿＿＿ パンは {百五十円|ひゃくごじゅうえん}です。 (cái bánh mì đó)', 'その', 'それ | そこ | あの', 'その.'),
      Q('「＿＿＿は ペンですか。」 ── 「はい、これはペンです。」 (người hỏi chỉ vật gần người nghe)', 'それ', 'これ | あれ | どれ', 'Người hỏi dùng それ cho vật gần người nghe; người đáp dùng これ.'),
      Q('＿＿＿は {本|ほん}です。 (cái này)', 'これ', 'この | ここ | あそこ', 'これ.'),
      Q('＿＿＿ {本|ほん}は {私|わたし}のです。 (quyển sách kia)', 'あの', 'あれ | あそこ | これ', 'あの + N.'),
      Q('＿＿＿は {消|け}しゴムですか。 (cái đó)', 'それ', 'その | そこ | ここ', 'それ.'),
    ]),

    H(`${LV.de} — B. ここ／そこ／あそこ／どこ (12 câu)`),
    MC('lt-b2-g1-koko', 'B. Chọn từ chỉ nơi', [
      Q('トイレは＿＿＿ですか。 → あそこです。', 'どこ', 'どれ | いくら | だれ', 'Hỏi nơi: どこ.'),
      Q('＿＿＿は レストランです。 (đây)', 'ここ', 'これ | この | どこ', 'ここは N です.'),
      Q('レジは＿＿＿です。 (đằng kia)', 'あそこ', 'あれ | あの | どこ', 'あそこ.'),
      Q('エレベーターは＿＿＿です。 (phía kia, nói lịch sự)', 'あちら', 'あれ | どれ | これ', 'あちら = phía kia (lịch sự).'),
      Q('ATM は＿＿＿ですか。 (hỏi lịch sự "phía nào")', 'どちら', 'どれ | だれ | いくら', 'どちら lịch sự hơn どこ.'),
      Q('＿＿＿は きっさてんです。 (chỗ đó, gần người nghe)', 'そこ', 'それ | その | ここ', 'そこ.'),
      Q('トイレは＿＿＿です。 (phía này, lịch sự)', 'こちら', 'これ | この | ここの', 'こちら.'),
      Q('Nhân viên chỉ tay về phía thang máy:「エレベーターは＿＿＿です」', 'あちら', 'あれ | どこ | だれ', 'あちら.'),
      Q('Hỏi "Nhà vệ sinh ở đâu?"', 'トイレはどこですか。', 'トイレはどれですか。 | トイレはいくらですか。 | トイレはだれですか。', 'どこ.'),
      Q('Hỏi "Hiệu sách ở tầng mấy?"', '{本屋|ほんや}は{何階|なんがい}ですか。', '{本屋|ほんや}はどこ階ですか。 | {本屋|ほんや}はいくらですか。 | {本屋|ほんや}は{何|なん}ですか。', '何階.'),
      Q('Trả lời "ở tầng 2":', '{2階|にかい}です。', '{2回|にかい}です。 | {二|ふた}つです。 | {二円|にえん}です。', '2階.'),
      Q('「ここは＿＿＿です」 — câu giới thiệu nơi chốn nào đúng?', 'レストラン', 'ごはんを | いくらを | だれの', 'ここは N です.'),
    ]),

    H(`${LV.de} — C. Đọc tầng (10 câu)`),
    MC('lt-b2-g1-tang', 'C. Chọn cách đọc đúng của 〜階', [kaiQ(1), kaiQ(2), kaiQ(3), kaiQ(4), kaiQ(5), kaiQ(6), kaiQ(7), kaiQ(8), kaiQ(9), kaiQ(10)]),

    H(`${LV.vua} — D. Hỏi – đáp theo sơ đồ ひかりデパート (12 câu)`),
    MC('lt-b2-g1-so-do', 'D. Nhìn sơ đồ, chọn câu trả lời đúng', [
      Q('スーパーは{何階|なんがい}ですか。', '{地下|ちか}{1階|いっかい}です。', '{1階|いっかい}です。 | {2階|にかい}です。 | {5階|ごかい}です。', 'スーパー ở 地下1階.'),
      Q('トイレは{何階|なんがい}ですか。', '{3階|さんがい}です。', '{2階|にかい}です。 | {4階|よんかい}です。 | {5階|ごかい}です。', 'トイレ ở 3階.'),
      Q('レストランは{何階|なんがい}ですか。', '{5階|ごかい}です。', '{4階|よんかい}です。 | {3階|さんがい}です。 | {1階|いっかい}です。', 'レストラン ở 5階.'),
      Q('{本屋|ほんや}は{何階|なんがい}ですか。', '{2階|にかい}です。', '{1階|いっかい}です。 | {3階|さんがい}です。 | {4階|よんかい}です。', '本屋 ở 2階.'),
      Q('インフォメーションは{何階|なんがい}ですか。', '{1階|いっかい}です。', '{2階|にかい}です。 | {地下|ちか}です。 | {3階|さんがい}です。', '1階.'),
      Q('{100円|ひゃくえん}ショップは{何階|なんがい}ですか。', '{3階|さんがい}です。', '{2階|にかい}です。 | {4階|よんかい}です。 | {地下|ちか}です。', '3階.'),
      Q('「きつえんじょは{4階|よんかい}ですか。」', 'いいえ、{4階|よんかい}じゃありません。{5階|ごかい}です。', 'はい、{4階|よんかい}です。 | いいえ、{3階|さんがい}です。 | はい、{5階|ごかい}です。', 'きつえんじょ ở 5階.'),
      Q('「ATMは{2階|にかい}ですか。」', 'いいえ、{2階|にかい}じゃありません。{1階|いっかい}です。', 'はい、{2階|にかい}です。 | いいえ、{地下|ちか}です。 | はい、{1階|いっかい}です。', 'ATM ở 1階.'),
      Q('「レジは{地下|ちか}ですか。」', 'はい、{地下|ちか}です。', 'いいえ、{地下|ちか}です。 | はい、{1階|いっかい}です。 | いいえ、{1階|いっかい}です。', 'レジ ở 地下.'),
      Q('{3階|さんがい}にあるものは？ (đúng)', '{100円|ひゃくえん}ショップとトイレ', '{本屋|ほんや}とくつ{屋|や} | レストランときつえんじょ | スーパーとレジ', '3階: 100円ショップ・トイレ.'),
      Q('「カメラ{屋|や}は{何階|なんがい}ですか。」', '{4階|よんかい}です。', '{3階|さんがい}です。 | {5階|ごかい}です。 | {2階|にかい}です。', '4階.'),
      Q('「くつ{屋|や}は{2階|にかい}ですか。」', 'はい、{2階|にかい}です。', 'いいえ、{1階|いっかい}です。 | いいえ、{3階|さんがい}です。 | はい、{3階|さんがい}です。', 'くつ屋 ở 2階.'),
    ]),

    H(`${LV.vua} — E. Ghép câu (8 câu)`),
    BUILD('lt-b2-g1-ghep', 'E. Sắp xếp các mảnh thành câu đúng', [
      BD('Nhà vệ sinh ở đâu?', 'トイレ は どこ です か。', ['いくら', 'を']),
      BD('Quầy thu ngân ở đằng kia.', 'レジ は あそこ です。', ['これ', 'の']),
      BD('Hiệu sách ở tầng mấy?', '{本屋|ほんや} は {何階|なんがい} です か。', ['どこ', 'を']),
      BD('Cửa hàng 100 yên ở tầng 3.', '{100円|ひゃくえん}-ショップ は {3階|さんがい} です。', ['が', 'の']),
      BD('Đây là nhà hàng.', 'ここ は レストラン です。', ['これ', 'を']),
      BD('Cái kia là kim từ điển.', 'あれ は {電子辞書|でんしじしょ} です。', ['あの', 'を']),
      BD('Cái cặp này là của tôi.', 'この かばん は {私|わたし} の です。', ['これ', 'を']),
      BD('Thang máy ở phía kia ạ.', 'エレベーター は あちら です。', ['どこ', 'を']),
    ]),

    H(`${LV.vua} — F. Điền こ・そ・あ・ど (10 câu, gõ tay)`),
    QZ('lt-b2-g1-dien', 'F. Gõ từ chỉ định', 'fill', [
      A('（　）は {何|なん}ですか。 (cái này)', 'これ'),
      A('（　）ペンは {私|わたし}のです。 (cây bút kia)', 'あの'),
      A('トイレは（　）ですか。 (hỏi nơi)', 'どこ'),
      A('（　）は レストランです。 (đây)', 'ここ'),
      A('エレベーターは（　）です。 (phía kia, lịch sự)', 'あちら'),
      A('（　）かばんは いくらですか。 (cái cặp đó)', 'その'),
      A('レジは（　）です。 (đằng kia)', 'あそこ'),
      A('（　）は {時計|とけい}です。 (cái đó)', 'それ'),
      A('（　）ペンは いくらですか。 (cây bút đó)', 'その'),
      A('{本屋|ほんや}は（　）ですか。 (tầng mấy)', '{何階|なんがい}'),
    ], 'こ・そ・あ・ど'),

    H(`${LV.kho} — G. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b2-g1-dich', 'G. Gõ câu tiếng Nhật', 'translate', [
      AS('Nhà vệ sinh ở đâu?', 'トイレはどこですか'),
      AS('Nhà vệ sinh ở tầng 3.', 'トイレは{3階|さんがい}です'),
      AS('Siêu thị ở tầng hầm 1.', 'スーパーは{地下|ちか}{1階|いっかい}です'),
      AS('Thang máy ở phía kia ạ.', 'エレベーターはあちらです'),
      AS('Đây là cái gì?', 'これは{何|なん}ですか'),
      AS('Đó là điện thoại di động.', 'それは{携帯電話|けいたいでんわ}です'),
      AS('Cái kia là máy ảnh.', 'あれはカメラです'),
      AS('Cửa hàng 100 yên ở tầng mấy?', '{100円|ひゃくえん}ショップは{何階|なんがい}ですか'),
      AS('Quầy thu ngân ở đâu?', 'レジはどこですか'),
      AS('Hiệu sách ở tầng 2. Cửa hàng giày cũng ở tầng 2.', ['{本屋|ほんや}は{2階|にかい}です。くつ{屋|や}も{2階|にかい}です', '{本屋|ほんや}は{2階|にかい}です。くつ屋も{2階|にかい}です']),
    ], 'ポイント 7–9'),

    H(`${LV.kho} — H. Tình huống (8 câu)`),
    MC('lt-b2-g1-tinh-huong', 'H. Chọn câu nói tự nhiên nhất', [
      Q('Bạn đứng trước thang máy, hỏi nhân viên chỗ nhà vệ sinh:', 'すみません、トイレはどこですか。', 'すみません、トイレはいくらですか。 | すみません、トイレをください。 | すみません、トイレはだれですか。', 'Hỏi nơi: どこ.'),
      Q('Nhân viên trả lời lịch sự "ở tầng 3":', 'トイレは{3階|さんがい}です。', 'トイレは{3回|さんかい}です。 | トイレは{三|みっ}つです。 | トイレは{3円|さんえん}です。', '3階.'),
      Q('Bạn chỉ vào cái cặp gần NGƯỜI NGHE và hỏi giá:', 'その かばんは いくらですか。', 'この かばんは いくらですか。 | あれは いくらですか。 | それ かばんは いくらですか。', 'その + N (gần người nghe).'),
      Q('Bạn cầm cục tẩy, người kia hỏi "それは何ですか". Bạn đáp:', 'これは{消|け}しゴムです。', 'それは{消|け}しゴムです。 | あれは{消|け}しゴムです。 | その{消|け}しゴムです。', 'Vật gần mình → これ.'),
      Q('Khách bước vào, nhân viên nói:', 'いらっしゃいませ。', 'ありがとうございます。 | どうぞ。 | こちらこそ。', 'Chào khách.'),
      Q('Bạn hỏi vị trí quầy thu ngân (lịch sự):', 'すみません、レジはどちらですか。', 'すみません、レジはいくらですか。 | すみません、レジはだれですか。 | すみません、レジをください。', 'どちら lịch sự.'),
      Q('Nhân viên chỉ tay xa:「ATM は＿＿＿です」', 'あちら', 'こちら | どちら | それ', 'あちら.'),
      Q('「ここは何階ですか。」 ── (bạn đang ở tầng 2)', '{2階|にかい}です。', 'ここです。 | {二|ふた}つです。 | {2円|にえん}です。', 'Hỏi tầng → đáp 〜階.'),
    ]),
  ],
};

/* ───────── 4. NGỮ PHÁP 2: ポイント 10–11 + SỐ, GIÁ, 〜つ ───────── */

/** Câu tính tiền: đơn giá × số lượng → chọn cách đọc tổng (đáp án do mã tính). */
function sumQ(item: string, p: number, c: number): ReturnType<typeof Q> {
  const total = p * c;
  const ok = yomiYen(total);
  const bad: string[] = [];
  const add = (x: string) => { if (x !== ok && !bad.includes(x)) bad.push(x); };
  add(yomiYen(total, true));
  for (const m of [p + c, total + 100, total - 10, total * 10, total + 1000, Math.round(total / 10)]) { if (m > 0) add(yomiYen(m)); if (bad.length >= 3) break; }
  return Q(`${item} ${fmtN(p)}円 × ${c} cái. Tổng cộng đọc là…`, ok, bad.slice(0, 3).join(' | '), `${fmtN(p)} × ${c} = ${fmtN(total)} → ${ok}.`);
}

const L2_NP2: Lesson = {
  id: 'lt-b2-ngu-phap-2',
  kind: 'grammar',
  title: 'Luyện thêm Bài 2 — Ngữ pháp 2: N を ください · 〜つ · いくら · đọc số và giá tiền (ポイント 10–11)',
  goal: 'Mua đồ và gọi món đúng cấu trúc (N を 〜つ ください), hỏi và nghe giá bằng いくら, đọc đúng số đến hàng chục nghìn và 〜つ.',
  minutes: 65,
  blocks: [
    NOTE('Học thế nào', [
      'Khuôn mua đồ: **N を（〜つ）ください**; hai món: **N1 を 〜つ と N2 を 〜つ ください**. Số lượng đứng ngay SAU を, TRƯỚC ください.',
      'Hỏi giá: **N は いくらですか** → **〜円です**. Đọc số theo **万 (10.000)**: 29.800 = にまん きゅうせん はっぴゃく.',
      'Bài này nhiều câu đọc số: làm chậm, **nói to từng đáp án**. Đáp án đúng của các câu đọc số do mã tính độc lập — nếu bạn thấy khác thì xem lại quy tắc trong buổi 3.',
    ]),
    TABLE(
      ['Khuôn', 'Ví dụ', 'Nghĩa'],
      [
        ['N を ください', `${JR('じゃ、 これ を ください')}`, 'Vậy cho tôi cái này.'],
        ['N を 〜つ ください', `${JR('リンゴ を {三|みっ}つ ください')}`, 'Cho tôi 3 quả táo.'],
        ['N1 を 〜つ と N2 を 〜つ', `${JR('パン を {二|ふた}つ と {卵|たまご} を {一|ひと}つ ください')}`, 'Cho tôi 2 bánh mì và 1 hộp trứng.'],
        ['N は いくら ですか', `${JR('この ケーキ は いくら です か')}`, 'Cái bánh này bao nhiêu tiền?'],
      ],
      'Bốn khuôn cần thuộc',
    ),

    H(`${LV.de} — A. Đọc 〜つ (10 câu)`),
    MC('lt-b2-g2-tsu', 'A. Chọn cách đọc đúng', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => tsuQ(n))),

    H(`${LV.de} — B. Đọc giá tiền (20 câu)`),
    MC('lt-b2-g2-gia', 'B. Chọn cách đọc đúng của giá', [100, 150, 230, 300, 398, 450, 600, 680, 800, 980, 1200, 2800, 2980, 3000, 3500, 8000, 12000, 30000, 35600, 100000].map((n) => priceQ(n))),

    H(`${LV.de} — C. Chọn を／の／と／は (12 câu)`),
    MC('lt-b2-g2-tro-tu', 'C. Trợ từ trong câu mua đồ', [
      Q('コーヒー＿＿＿{二|ふた}つ ください。', 'を', 'は | の | が', 'N を 〜つ ください.'),
      Q('パンを{二|ふた}つ＿＿＿{卵|たまご}を{一|ひと}つください。', 'と', 'も | の | は', 'Nối hai món: と.'),
      Q('この ケーキ＿＿＿いくらですか。', 'は', 'を | の | が', 'N は いくら.'),
      Q('じゃ、これ＿＿＿ください。', 'を', 'は | の | と', 'を.'),
      Q('{魚|さかな}＿＿＿ください。', 'を', 'は | の | と', 'を.'),
      Q('カレーを{一|ひと}つ＿＿＿ スープを{二|ふた}つ ください。', 'と', 'を | の | も', 'と.'),
      Q('この{時計|とけい}＿＿＿{三万円|さんまんえん}です。', 'は', 'を | と | の', 'N は 〜円.'),
      Q('{全部|ぜんぶ}＿＿＿{千二百円|せんにひゃくえん}です。', 'で', 'を | は | の', '全部で = tổng cộng.'),
      Q('リンゴ＿＿＿{三|みっ}つください。', 'を', 'は | も | と', 'を.'),
      Q('ジュース＿＿＿{三|みっ}つ ください。', 'を', 'の | は | と', 'を.'),
      Q('{野菜|やさい}＿＿＿{牛肉|ぎゅうにく}を ください。', 'と', 'の | は | も', 'Nối hai món: と.'),
      Q('Trong 「ご{飯|はん}を{二|ふた}つください」, 「を」 đánh dấu…', 'Thứ mình muốn lấy (ご飯)', 'Nơi chốn | Thời gian | Chủ sở hữu', 'を đánh dấu đối tượng của hành động.'),
    ]),

    H(`${LV.vua} — D. Tính tiền rồi chọn cách đọc (9 câu)`),
    MC('lt-b2-g2-tinh-tien', 'D. Đơn giá × số lượng', [
      sumQ('パン', 100, 3),
      sumQ('ジュース', 200, 3),
      sumQ('コーヒー', 400, 2),
      sumQ('ケーキ', 450, 2),
      sumQ('リンゴ', 120, 3),
      sumQ('くつ', 5000, 2),
      sumQ('Tシャツ', 1000, 3),
      sumQ('本', 2000, 4),
      sumQ('かばん', 3500, 2),
    ]),

    H(`${LV.vua} — E. Ghép câu (8 câu)`),
    BUILD('lt-b2-g2-ghep', 'E. Sắp xếp các mảnh thành câu đúng', [
      BD('Cho tôi hai cà phê.', 'コーヒー を {二|ふた}つ ください。', ['の', 'は']),
      BD('Cái bánh này bao nhiêu tiền?', 'この ケーキ は いくら です か。', ['どこ', 'を']),
      BD('Cho tôi một bánh mì và hai hộp trứng.', 'パン を {一|ひと}つ と {卵|たまご} を {二|ふた}つ ください。', ['も', 'の']),
      BD('Vậy thì cho tôi cái này.', 'じゃ、 これ を ください。', ['は', 'の']),
      BD('Cái đồng hồ này 30.000 yên.', 'この {時計|とけい} は {三万円|さんまんえん} です。', ['を', 'が']),
      BD('Tất cả là 1.200 yên.', '{全部|ぜんぶ} で {千二百円|せんにひゃくえん} です。', ['を', 'は']),
      BD('Cho tôi ba quả táo.', 'リンゴ を {三|みっ}つ ください。', ['の', 'が']),
      BD('Cái cặp kia bao nhiêu tiền?', 'あの かばん は いくら です か。', ['これ', 'を']),
    ]),

    H(`${LV.vua} — F. Viết cách đọc giá bằng hiragana (10 câu)`),
    QZ('lt-b2-g2-viet-gia', 'F. Gõ cách đọc (hiragana)', 'fill', [150, 300, 450, 600, 800, 1200, 3000, 8000, 10000, 23400].map((n) => A(`${fmtN(n)}円`, yomiYen(n)))),

    H(`${LV.kho} — G. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b2-g2-dich', 'G. Gõ câu tiếng Nhật', 'translate', [
      AS('Cho tôi hai cái bánh.', 'ケーキを{二|ふた}つください'),
      AS('Cho tôi một cà phê và hai bánh mì.', 'コーヒーを{一|ひと}つとパンを{二|ふた}つください'),
      AS('Cái bánh này bao nhiêu tiền?', 'このケーキはいくらですか'),
      AS('Cái đồng hồ này 12.000 yên.', 'この{時計|とけい}は{12,000円|いちまんにせんえん}です'),
      AS('Vậy thì cho tôi cái này.', 'じゃ、これをください'),
      AS('Tất cả là 3.500 yên.', '{全部|ぜんぶ}で{3,500円|さんぜんごひゃくえん}です'),
      AS('Cho tôi ba quả táo.', 'リンゴを{三|みっ}つください'),
      AS('Cho tôi hai cơm.', 'ご{飯|はん}を{二|ふた}つください'),
      AS('Cái cặp kia bao nhiêu tiền?', 'あのかばんはいくらですか'),
      AS('Cho tôi một cá và một rau.', ['{魚|さかな}を{一|ひと}つと{野菜|やさい}を{一|ひと}つください']),
    ], 'N を 〜つ ください · いくら'),

    H(`${LV.kho} — H. Tìm câu SAI (8 câu)`),
    MC('lt-b2-g2-sai', 'H. Câu nào SAI?', [
      Q('Câu nào SAI?', 'コーヒーを{二|ふた}つをください。', 'コーヒーを{二|ふた}つください。 | コーヒーをください。 | コーヒーを{一|ひと}つください。', 'Chỉ một を, sau danh từ.'),
      Q('Câu nào SAI?', '{二|ふた}つコーヒーをください。', 'コーヒーを{二|ふた}つください。 | パンをください。 | パンを{三|みっ}つください。', 'Số lượng đứng SAU を.'),
      Q('Câu nào SAI? (đọc)', '300円 = さんひゃくえん', '300円 = さんびゃくえん | 600円 = ろっぴゃくえん | 800円 = はっぴゃくえん', '300 = さんびゃく.'),
      Q('Câu nào SAI? (đọc)', '10,000円 = まんえん', '10,000円 = いちまんえん | 3,000円 = さんぜんえん | 8,000円 = はっせんえん', '10.000 phải có いち.'),
      Q('Câu nào SAI? (đọc)', '2つ = につ', '2つ = ふたつ | 3つ = みっつ | 4つ = よっつ', '2つ = ふたつ.'),
      Q('Câu nào SAI?', 'このケーキはどこですか。(hỏi giá)', 'このケーキはいくらですか。 | トイレはどこですか。 | これは何ですか。', 'Hỏi giá phải dùng いくら.'),
      Q('Câu nào SAI?', 'ケーキをいくらください。', 'ケーキをください。 | ケーキを{二|ふた}つください。 | このケーキはいくらですか。', 'いくら không đứng trong câu ください.'),
      Q('Câu nào SAI?', 'パンを{一|ひと}つとを{卵|たまご}をください。', 'パンを{一|ひと}つと{卵|たまご}を{二|ふた}つください。 | パンを{一|ひと}つください。 | パンと{卵|たまご}をください。', 'と nối hai cụm; không đặt を thừa.'),
    ]),
  ],
};

/* ───────── 5. NGỮ PHÁP 3: ポイント 12–15 ───────── */

const L2_NP3: Lesson = {
  id: 'lt-b2-ngu-phap-3',
  kind: 'grammar',
  title: 'Luyện thêm Bài 2 — Ngữ pháp 3: 何の N · どこの N · だれの N · N(〜語)で 何ですか (ポイント 12–15)',
  goal: 'Hỏi loại / nguồn gốc / chủ sở hữu của đồ vật và hỏi "… tiếng ~ là gì?" đúng cấu trúc, từ nhận biết đến tự viết câu.',
  minutes: 55,
  blocks: [
    NOTE('Học thế nào', [
      'Bốn câu hỏi: **何の N** (loại gì) · **どこの N** (của nước/hãng nào) · **だれの N** (của ai) · **「X」は 〜語で 何ですか** (… tiếng ~ là gì).',
      'Cả ba câu đầu đều dùng **の**: trả lời bằng **N1 の N2**, có thể bỏ N2 nếu đã rõ (「フランスのです」).',
      'Lỗi hay mắc: bỏ の (~~何料理~~); dùng で sai chỗ; hỏi giá bằng どこ.',
    ]),
    TABLE(
      ['Hỏi', 'Hỏi về', 'Trả lời mẫu'],
      [
        [`${JR('これ は {何|なん} の {料理|りょうり} です か')}`, 'Loại / nội dung', '魚の料理です。'],
        [`${JR('これ は どこ の ワイン です か')}`, 'Nước / hãng', 'フランスのワインです。'],
        [`${JR('この かばん は だれ の です か')}`, 'Chủ sở hữu', 'ワンさんのです。'],
        [`${JR('「ペン」 は {日本語|にほんご} で {何|なん} です か')}`, 'Từ trong ngôn ngữ khác', '「ペン」です。'],
      ],
      'Bốn câu hỏi của ポイント 12–15',
    ),

    H(`${LV.de} — A. Chọn từ để hỏi (14 câu)`),
    MC('lt-b2-g3-hoi', 'A. 何の／どこの／だれの／何', [
      Q('これは＿＿＿{料理|りょうり}ですか。 → {魚|さかな}の{料理|りょうり}です。', '{何|なん}の', 'どこの | だれの | いくらの', 'Hỏi loại món: 何の.'),
      Q('これは＿＿＿ワインですか。 → フランスのワインです。', 'どこの', '{何|なん}の | だれの | いくらの', 'Hỏi nước: どこの.'),
      Q('この{本|ほん}は＿＿＿ですか。 → ワンさんのです。', 'だれの', '{何|なん}の | どこの | いくらの', 'Hỏi chủ: だれの.'),
      Q('これは＿＿＿{本|ほん}ですか。 → {日本語|にほんご}の{本|ほん}です。', '{何|なん}の', 'どこの | だれの | いくらの', 'Hỏi loại sách: 何の.'),
      Q('これは＿＿＿カメラですか。 → {日本|にほん}のカメラです。', 'どこの', '{何|なん}の | だれの | いくらの', 'どこの.'),
      Q('この かばんは＿＿＿ですか。 → パクさんのです。', 'だれの', '{何|なん}の | どこの | いくらの', 'だれの.'),
      Q('これは＿＿＿ビールですか。 → ドイツのビールです。', 'どこの', '{何|なん}の | だれの | いくらの', 'どこの.'),
      Q('これは＿＿＿カレーですか。 → {牛肉|ぎゅうにく}のカレーです。', '{何|なん}の', 'どこの | だれの | いくらの', '牛肉の = loại cà-ri.'),
      Q('「ペンは{日本語|にほんご}＿＿＿{何|なん}ですか。」', 'で', 'を | の | は', '〜語で.'),
      Q('この{時計|とけい}は＿＿＿ですか。 → {私|わたし}のです。', 'だれの', '{何|なん}の | どこの | いくらの', 'だれの.'),
      Q('これは＿＿＿スープですか。 → {野菜|やさい}のスープです。', '{何|なん}の', 'どこの | だれの | いくらの', '野菜の = loại súp.'),
      Q('「ご{飯|はん}」は{英語|えいご}で＿＿＿ですか。', '{何|なん}', 'どこ | だれ | いくら', 'Hỏi từ: 何.'),
      Q('これは＿＿＿パソコンですか。 → ソニーのパソコンです。', 'どこの', '{何|なん}の | だれの | いくらの', 'Hãng: どこの.'),
      Q('この{財布|さいふ}は＿＿＿ですか。 → マリヤムさんのです。', 'だれの', '{何|なん}の | どこの | いくらの', 'だれの.'),
    ]),

    H(`${LV.de} — B. Gõ trợ từ vào chỗ trống (10 câu)`),
    QZ('lt-b2-g3-tro-tu', 'B. Gõ MỘT trợ từ (の／で)', 'fill', [
      A('これは{何|なん}（　）{料理|りょうり}ですか。', 'の'),
      A('これはどこ（　）ワインですか。', 'の'),
      A('この{本|ほん}はだれ（　）ですか。', 'の'),
      A('「ペン」は{日本語|にほんご}（　）{何|なん}ですか。', 'で'),
      A('フランス（　）ワインです。', 'の'),
      A('ワンさん（　）です。 (của Wan)', 'の'),
      A('「コーヒー」は{英語|えいご}（　）{何|なん}ですか。', 'で'),
      A('これはドイツ（　）ビールです。', 'の'),
      A('この{時計|とけい}は{私|わたし}（　）です。', 'の'),
      A('{魚|さかな}（　）{料理|りょうり}です。', 'の'),
    ], 'の・で'),

    H(`${LV.vua} — C. Hỏi – đáp (12 câu)`),
    MC('lt-b2-g3-hoi-dap', 'C. Chọn câu trả lời đúng', [
      Q('「これは{何|なん}の{料理|りょうり}ですか。」', '{魚|さかな}の{料理|りょうり}です。', 'フランスの{料理|りょうり}じゃありません。 | {三百円|さんびゃくえん}です。 | ワンさんのです。', 'Trả lời loại món.'),
      Q('「これはどこのワインですか。」', 'フランスのワインです。', '{魚|さかな}のワインです。 | {三百円|さんびゃくえん}です。 | ワンさんのワインです。', 'Trả lời nước.'),
      Q('「このかばんはだれのですか。」', 'パクさんのです。', 'フランスのです。 | {三百円|さんびゃくえん}です。 | {魚|さかな}です。', 'Trả lời chủ.'),
      Q('「この{本|ほん}は{何|なん}の{本|ほん}ですか。」', '{日本語|にほんご}の{本|ほん}です。', '{日本|にほん}の{本|ほん}ではありません。 | ワンさんの{本|ほん}です。 | {千円|せんえん}です。', 'Trả lời loại sách.'),
      Q('「これはどこのカメラですか。」', '{日本|にほん}のです。', '{日本語|にほんご}のです。 | ワンさんのです。 | {三百円|さんびゃくえん}です。', 'Nước: 日本の.'),
      Q('「この{財布|さいふ}はだれのですか。」', '{私|わたし}のです。', 'フランスのです。 | {日本語|にほんご}のです。 | {千円|せんえん}です。', '私の.'),
      Q('「ペンは{日本語|にほんご}で{何|なん}ですか。」 (English "pen")', '「ペン」です。', '「ペン」はどこですか。 | {百円|ひゃくえん}です。 | ペンはワンさんのです。', 'Trả lời bằng từ.'),
      Q('「「ご{飯|はん}」は{英語|えいご}で{何|なん}ですか。」', '「rice」です。', '{百円|ひゃくえん}です。 | あそこです。 | {二|ふた}つです。', '"rice".'),
      Q('「これは{何|なん}のスープですか。」', '{野菜|やさい}のスープです。', 'ドイツのスープです。 | {百円|ひゃくえん}です。 | あそこです。', 'Loại súp.'),
      Q('「この{時計|とけい}はどこのですか。」', 'ドイツのです。', '{三万円|さんまんえん}です。 | ワンさんです。 | {魚|さかな}です。', 'Nước.'),
      Q('「このカレーはどこのカレーですか。」', 'インドのカレーです。', '{牛肉|ぎゅうにく}のカレーです。 | {千円|せんえん}です。 | パクさんのカレーです。', 'Nước: インド.'),
      Q('「この{電子辞書|でんしじしょ}はだれのですか。」', 'ワンさんのです。', 'ドイツのです。 | {三万円|さんまんえん}です。 | {日本語|にほんご}です。', 'Chủ.'),
    ]),

    H(`${LV.vua} — D. Ghép câu (8 câu)`),
    BUILD('lt-b2-g3-ghep', 'D. Sắp xếp các mảnh thành câu đúng', [
      BD('Đây là món gì?', 'これ は {何|なん} の {料理|りょうり} です か。', ['どこ', 'を']),
      BD('Đây là rượu vang của nước nào?', 'これ は どこ の ワイン です か。', ['何', 'を']),
      BD('Quyển sách này là của ai?', 'この {本|ほん} は だれ の です か。', ['どこ', 'を']),
      BD('"Pen" tiếng Nhật là gì?', '「ペン」 は {日本語|にほんご} で {何|なん} です か。', ['の', 'を']),
      BD('Đây là rượu vang Pháp.', 'これ は フランス の ワイン です。', ['も', 'を']),
      BD('Cái cặp này là của Park.', 'この かばん は ^パク-さん の です。', ['を', 'で']),
      BD('Đây là món cá.', 'これ は {魚|さかな} の {料理|りょうり} です。', ['で', 'を']),
      BD('"Cake" tiếng Nhật là "ケーキ".', '「cake」 は {日本語|にほんご} で 「ケーキ」 です。', ['の', 'を']),
    ]),

    H(`${LV.vua} — E. 「X」は〜語で何ですか (8 câu)`),
    MC('lt-b2-g3-ngon-ngu', 'E. Hỏi cách nói trong ngôn ngữ khác', [
      Q('Hỏi "Pen" tiếng Nhật là gì:', '「ペン」は{日本語|にほんご}で{何|なん}ですか。', '「ペン」は{日本語|にほんご}を{何|なん}ですか。 | 「ペン」が{日本語|にほんご}で{何|なん}ですか。 | 「ペン」は{日本語|にほんご}に{何|なん}ですか。', 'は 〜語で 何ですか.'),
      Q('Hỏi "ケーキ" tiếng Anh là gì:', '「ケーキ」は{英語|えいご}で{何|なん}ですか。', '「ケーキ」は{英語|えいご}を{何|なん}ですか。 | 「ケーキ」は{英語|えいご}の{何|なん}ですか。 | 「ケーキ」は{英語|えいご}が{何|なん}ですか。', '〜語で.'),
      Q('「「みず」は{英語|えいご}で{何|なん}ですか。」', '「water」です。', '「water」はどこですか。 | {百円|ひゃくえん}です。 | みずのペンです。', '"water".'),
      Q('「「book」は{日本語|にほんご}で{何|なん}ですか。」', '「{本|ほん}」です。', '{百円|ひゃくえん}です。 | あそこです。 | ワンさんのです。', '"本".'),
      Q('「watch」は{日本語|にほんご}で…', '「{時計|とけい}」です', '「{財布|さいふ}」です | 「くつ」です | 「ペン」です', 'watch = 時計.'),
      Q('「{日本語|にほんご}」 đọc là…', 'にほんご', 'にほんぎょ | にっぽんご | ひほんご', '日本語.'),
      Q('「{英語|えいご}」 nghĩa là…', 'Tiếng Anh', 'Tiếng Nhật | Tiếng Pháp | Tiếng Đức', '英語.'),
      Q('「で」 trong 「{日本語|にほんご}で」 có nghĩa…', 'Bằng (phương tiện / ngôn ngữ)', 'Ở | Của | Và', 'で = bằng.'),
    ]),

    H(`${LV.kho} — F. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b2-g3-dich', 'F. Gõ câu tiếng Nhật', 'translate', [
      AS('Đây là món gì?', 'これは{何|なん}の{料理|りょうり}ですか'),
      AS('Đây là món cá.', 'これは{魚|さかな}の{料理|りょうり}です'),
      AS('Đây là rượu vang của nước nào?', 'これはどこのワインですか'),
      AS('Đây là rượu vang Pháp.', 'これはフランスのワインです'),
      AS('Quyển sách này là của ai?', 'この{本|ほん}はだれのですか'),
      AS('Là của chị Wan.', 'ワンさんのです'),
      AS('"Pen" tiếng Nhật là gì?', '「ペン」は{日本語|にほんご}で{何|なん}ですか'),
      AS('Cái đồng hồ này của Đức.', 'この{時計|とけい}はドイツのです'),
      AS('Đây là cà-ri Ấn Độ.', 'これはインドのカレーです'),
      AS('Cái ví này là của tôi.', 'この{財布|さいふ}は{私|わたし}のです'),
    ], 'ポイント 12–15'),

    H(`${LV.kho} — G. Tìm câu SAI (8 câu)`),
    MC('lt-b2-g3-sai', 'G. Câu nào SAI?', [
      Q('Câu nào SAI?', 'これは{何|なん}{料理|りょうり}ですか。', 'これは{何|なん}の{料理|りょうり}ですか。 | これはどこのワインですか。 | この{本|ほん}はだれのですか。', 'Thiếu の: 何の料理.'),
      Q('Câu nào SAI?', 'これはどこワインですか。', 'これはどこのワインですか。 | これはフランスのワインです。 | これは{何|なん}のワインですか。', 'Thiếu の: どこのワイン.'),
      Q('Câu nào SAI?', 'この{本|ほん}はだれですか。(muốn hỏi "của ai")', 'この{本|ほん}はだれのですか。 | この{本|ほん}はワンさんのです。 | この{本|ほん}は{何|なん}の{本|ほん}ですか。', 'だれの.'),
      Q('Câu nào SAI?', '「ペン」は{日本語|にほんご}を{何|なん}ですか。', '「ペン」は{日本語|にほんご}で{何|なん}ですか。 | 「ペン」は{英語|えいご}で{何|なん}ですか。 | 「ペン」は{日本語|にほんご}で「ペン」です。', '〜語で (không phải を).'),
      Q('Câu nào SAI?', 'これはワンさんのワインですか。(muốn hỏi nước)', 'これはどこのワインですか。 | これはフランスのワインです。 | これはワンさんのワインです。', 'Hỏi nước phải dùng どこの.'),
      Q('Câu nào SAI?', 'これは{三百円|さんびゃくえん}の{料理|りょうり}ですか。(muốn hỏi món gì)', 'これは{何|なん}の{料理|りょうり}ですか。 | これは{魚|さかな}の{料理|りょうり}です。 | これは{三百円|さんびゃくえん}です。', 'Hỏi loại: 何の.'),
      Q('Câu nào SAI?', 'フランスをワインです。', 'フランスのワインです。 | ドイツのビールです。 | インドのカレーです。', 'Nước の sản phẩm.'),
      Q('Câu nào SAI?', 'この{時計|とけい}は{私|わたし}ですの。', 'この{時計|とけい}は{私|わたし}のです。 | この{時計|とけい}はドイツのです。 | この{時計|とけい}はだれのですか。', 'N の です.'),
    ]),
  ],
};

/* ───────── 6. NGỮ PHÁP TRỘN ───────── */

const L2_TRON: Lesson = {
  id: 'lt-b2-ngu-phap-tron',
  kind: 'grammar',
  title: 'Luyện thêm Bài 2 — Ngữ pháp trộn ポイント 7–15: trợ từ, sửa câu sai, dịch hai chiều',
  goal: 'Dùng đồng thời cả chín ポイント của Bài 2 như trong đề: chọn trợ từ và từ chỉ định, hiểu nghĩa câu, dịch Việt–Nhật.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Đây là bài **trộn**: trước mỗi câu hỏi tự hỏi *là hỏi nơi / vật / giá / loại / chủ?* rồi chọn khuôn.',
      'Sai câu nào thì mở lại lesson `lt-b2-ngu-phap-1/2/3` đúng nhóm đó.',
      'Cuối bài có 2 bài **sắp lượt thoại** — đó là mini-bài nói.',
    ]),

    H(`${LV.de} — A. Chọn từ / trợ từ (20 câu)`),
    MC('lt-b2-gt-chon', 'A. Điền vào chỗ trống', [
      Q('トイレ＿＿＿どこですか。', 'は', 'を | の | と', 'N は どこ.'),
      Q('＿＿＿ペンは{私|わたし}のです。 (cây bút này)', 'この', 'これ | ここ | どれ', 'この + N.'),
      Q('＿＿＿は{何|なん}ですか。 (cái kia)', 'あれ', 'あの | あそこ | どれ', 'あれ.'),
      Q('コーヒー＿＿＿{二|ふた}つください。', 'を', 'は | の | と', 'を.'),
      Q('この{時計|とけい}は＿＿＿ですか。 (hỏi giá)', 'いくら', 'どこ | だれ | {何|なん}', 'いくら.'),
      Q('{本屋|ほんや}は＿＿＿ですか。 (hỏi tầng)', '{何階|なんがい}', 'いくら | だれ | {何|なん}', '何階.'),
      Q('これは＿＿＿{料理|りょうり}ですか。 (món gì)', '{何|なん}の', 'どこの | だれの | いくらの', '何の.'),
      Q('これは＿＿＿ワインですか。 (nước nào)', 'どこの', '{何|なん}の | だれの | いくらの', 'どこの.'),
      Q('この かばんは＿＿＿ですか。 (của ai)', 'だれの', '{何|なん}の | どこの | いくらの', 'だれの.'),
      Q('「ペンは{日本語|にほんご}＿＿＿{何|なん}ですか。」', 'で', 'を | の | は', '〜語で.'),
      Q('パンを{二|ふた}つ＿＿＿{卵|たまご}を{一|ひと}つください。', 'と', 'も | の | は', 'と.'),
      Q('ここ＿＿＿ レストランです。', 'は', 'を | の | で', 'ここは N です.'),
      Q('ケーキを＿＿＿ください。 (3 cái)', '{三|みっ}つ', '{三|さん}つ | {三|み}つ | {三|さん}', '3つ = みっつ.'),
      Q('スーパーは{地下|ちか}＿＿＿です。 (tầng 1)', '{1階|いっかい}', '{1階|いちかい} | {1階|ひとかい} | {1階|いちがい}', '1階 = いっかい.'),
      Q('これはフランス＿＿＿ワインです。', 'の', 'は | を | で', 'N の N.'),
      Q('＿＿＿、これをください。 (Vậy thì)', 'じゃ', 'どうぞ | こちらこそ | いらっしゃいませ', 'じゃ.'),
      Q('「{注文|ちゅうもん}をお{願|ねが}いします。」 ── 「＿＿＿。」', 'はい、どうぞ', 'いらっしゃいませ | こちらこそ | じゃ', 'どうぞ.'),
      Q('{3万円|さんまんえん} đọc là…', 'さんまんえん', 'さんぜんえん | みつまんえん | さんひゃくえん', '3万.'),
      Q('600円 đọc là…', 'ろっぴゃくえん', 'ろくひゃくえん | ろっひゃくえん | むっぴゃくえん', '600.'),
      Q('「ここ」 chỉ…', 'Chỗ gần người nói', 'Chỗ gần người nghe | Chỗ xa cả hai | Hỏi nơi', 'ここ.'),
    ]),

    H(`${LV.de} — B. Hiểu nghĩa câu (8 câu)`),
    MC('lt-b2-gt-nghia', 'B. Chọn nghĩa tiếng Việt đúng', [
      Q('トイレは{3階|さんがい}です。', 'Nhà vệ sinh ở tầng 3.', 'Nhà vệ sinh có 3 cái. | Nhà vệ sinh 3 yên. | Tôi đi nhà vệ sinh 3 lần.', '3階.'),
      Q('コーヒーを{二|ふた}つください。', 'Cho tôi hai cà phê.', 'Cà phê 2 yên. | Cà phê ở tầng 2. | Hai người uống cà phê.', 'N を 〜つ ください.'),
      Q('このケーキはいくらですか。', 'Cái bánh này bao nhiêu tiền?', 'Cái bánh này ở đâu? | Cái bánh này của ai? | Cái bánh này là gì?', 'いくら.'),
      Q('これはフランスのワインです。', 'Đây là rượu vang Pháp.', 'Đây là rượu vang của tôi. | Pháp là rượu vang. | Rượu vang đắt.', 'N の N.'),
      Q('あのかばんはワンさんのです。', 'Cái cặp kia là của Wan.', 'Wan là cái cặp. | Cái cặp ở chỗ Wan. | Wan và cái cặp.', 'N の です.'),
      Q('「ペン」は{日本語|にほんご}で{何|なん}ですか。', '"Pen" tiếng Nhật là gì?', '"Pen" bao nhiêu tiền? | "Pen" ở đâu? | "Pen" của ai?', '日本語で何.'),
      Q('{全部|ぜんぶ}で{千二百円|せんにひゃくえん}です。', 'Tất cả là 1.200 yên.', 'Một cái 1.200 yên. | Có 1.200 món. | 1.200 người.', '全部で.'),
      Q('じゃ、これをください。', 'Vậy thì cho tôi cái này.', 'Cảm ơn quý khách. | Xin mời. | Chào mừng quý khách.', 'じゃ.'),
    ]),

    H(`${LV.vua} — C. Câu nào ĐÚNG? (10 câu)`),
    MC('lt-b2-gt-dung', 'C. Chọn câu đúng', [
      Q('Chọn câu ĐÚNG:', 'トイレはどこですか。', 'トイレはいくらですか。(muốn hỏi nơi) | トイレをどこですか。 | トイレがどこでか。', 'どこ.'),
      Q('Chọn câu ĐÚNG:', 'この{本|ほん}は{千円|せんえん}です。', 'この{本|ほん}を{千円|せんえん}です。 | これ{本|ほん}は{千円|せんえん}です。 | この{本|ほん}は{千円|せんえん}を。', 'この + N は …です.'),
      Q('Chọn câu ĐÚNG:', 'ケーキを{二|ふた}つください。', 'ケーキは{二|ふた}つください。 | ケーキを{二|ふた}つをください。 | {二|ふた}つケーキをください。', 'N を 〜つ ください.'),
      Q('Chọn câu ĐÚNG:', 'これは{何|なん}の{料理|りょうり}ですか。', 'これは{何|なん}{料理|りょうり}ですか。 | これは{何|なん}が{料理|りょうり}ですか。 | これは{何|なん}を{料理|りょうり}ですか。', '何の.'),
      Q('Chọn câu ĐÚNG:', 'この{財布|さいふ}はだれのですか。', 'この{財布|さいふ}はだれがですか。 | この{財布|さいふ}をだれのですか。 | この{財布|さいふ}はだれもですか。', 'だれの.'),
      Q('Chọn câu ĐÚNG:', 'スーパーは{地下|ちか}{1階|いっかい}です。', 'スーパーを{地下|ちか}{1階|いっかい}です。 | スーパーに{地下|ちか}{1階|いっかい}です。 | スーパーが{地下|ちか}{1階|いっかい}か。', 'N は 〜階 です.'),
      Q('Chọn câu ĐÚNG:', 'ビールを{三|みっ}つください。', 'ビールが{三|みっ}つください。 | ビールの{三|みっ}つください。 | ビールで{三|みっ}つください。', 'を.'),
      Q('Chọn câu ĐÚNG:', '「ペン」は{日本語|にほんご}で{何|なん}ですか。', '「ペン」を{日本語|にほんご}で{何|なん}ですか。 | 「ペン」は{日本語|にほんご}に{何|なん}ですか。 | 「ペン」は{日本語|にほんご}の{何|なん}ですか。', 'は 〜語で.'),
      Q('Chọn câu ĐÚNG:', 'あれはカメラです。', 'あのはカメラです。 | あそこはカメラです。 | あれカメラです。', 'あれ.'),
      Q('Chọn câu ĐÚNG:', 'この{時計|とけい}はドイツのです。', 'この{時計|とけい}はドイツをです。 | この{時計|とけい}はドイツでです。 | この{時計|とけい}はドイツがです。', 'N の です.'),
    ]),

    H(`${LV.vua} — D. Ghép câu (6 câu)`),
    BUILD('lt-b2-gt-ghep', 'D. Sắp xếp các mảnh thành câu đúng', [
      BD('Hiệu sách ở tầng 2.', '{本屋|ほんや} は {2階|にかい} です。', ['を', 'が']),
      BD('Cho tôi hai cà phê và một bánh mì.', 'コーヒー を {二|ふた}つ と パン を {一|ひと}つ ください。', ['も', 'の']),
      BD('Cái đồng hồ kia bao nhiêu tiền?', 'あの {時計|とけい} は いくら です か。', ['これ', 'を']),
      BD('Đây là cà-ri Ấn Độ.', 'これ は インド の カレー です。', ['も', 'を']),
      BD('Quyển sách này là của ai?', 'この {本|ほん} は だれ の です か。', ['どこ', 'を']),
      BD('"Cake" tiếng Nhật là gì?', '「cake」 は {日本語|にほんご} で {何|なん} です か。', ['の', 'を']),
    ]),

    H(`${LV.kho} — E. Dịch Việt → Nhật (10 câu)`),
    QZ('lt-b2-gt-dich', 'E. Gõ câu tiếng Nhật', 'translate', [
      AS('Nhà vệ sinh ở đâu?', 'トイレはどこですか'),
      AS('Cái này bao nhiêu tiền?', 'これはいくらですか'),
      AS('Cho tôi hai cái bánh và ba quả táo.', 'ケーキを{二|ふた}つとリンゴを{三|みっ}つください'),
      AS('Siêu thị ở tầng hầm 1.', 'スーパーは{地下|ちか}{1階|いっかい}です'),
      AS('Cái đồng hồ kia là của Đức.', 'あの{時計|とけい}はドイツのです'),
      AS('Đây là món gì?', 'これは{何|なん}の{料理|りょうり}ですか'),
      AS('Quyển sách này là của ai?', 'この{本|ほん}はだれのですか'),
      AS('Tất cả là 3.500 yên.', '{全部|ぜんぶ}で{3,500円|さんぜんごひゃくえん}です'),
      AS('Vậy thì cho tôi cái này.', 'じゃ、これをください'),
      AS('"Pen" tiếng Nhật là gì?', '「ペン」は{日本語|にほんご}で{何|なん}ですか'),
    ], 'ポイント 7–15'),

    H(`${LV.kho} — F. Sắp xếp lượt thoại (2 hội thoại)`),
    BUILD('lt-b2-gt-xep-thoai', 'F. Sắp các lượt nói thành hội thoại đúng thứ tự', [
      BDT('Hỏi chỗ → đáp → hỏi tầng → đáp.', [
        'すみません、 トイレ は どこ です か。',
        'トイレ は あちら です。',
        '{本屋|ほんや} は {何階|なんがい} です か。',
        '{本屋|ほんや} は {2階|にかい} です。',
      ]),
      BDT('Hỏi giá → đáp → chốt mua.', [
        'この ケーキ は いくら です か。',
        '{450円|よんひゃくごじゅうえん} です。',
        'じゃ、 ケーキ を {二|ふた}つ ください。',
        'はい、 どうも ありがとう ございます。',
      ]),
    ]),
  ],
};

/* ───────── 7. HỘI THOẠI ───────── */

const L2_HOI_THOAI: Lesson = {
  id: 'lt-b2-hoi-thoai',
  kind: 'conversation',
  title: 'Luyện thêm Bài 2 — Hội thoại: 5 đoạn mới (hỏi chỗ · mua đồ điện tử · siêu thị · nhà hàng · đồ bỏ quên) + tự nói',
  goal: 'Hiểu, điền, sắp lượt thoại và tự đóng vai các hội thoại hỏi chỗ, hỏi giá, mua đồ, gọi món, hỏi đồ của ai — đúng khuôn câu hỏi của thi nói.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Mỗi hội thoại: ① **đọc cả đoạn** ② trả lời câu hỏi hiểu ③ điền chỗ trống ④ **sắp lượt thoại** ⑤ che lời thoại, **đóng vai khách hàng** và nói lại.',
      'Đóng vai là cách nhanh nhất để thi nói: học **khung hỏi – đáp** thay vì từng chữ. Thay đồ vật, giá, tầng bằng thứ khác.',
      'Lỗi hay mắc: đọc 300/600/800/3000/8000 thiếu biến âm; これ ≠ この; thiếu を sau món; hỏi giá bằng どこ.',
    ]),
    TABLE(
      ['Hội thoại', 'Tình huống', 'Ngữ pháp chính'],
      [
        ['1', 'Hỏi chỗ ATM, 100円ショップ, nhà vệ sinh', 'どこ · 何階 · あちら'],
        ['2', 'Mua kim từ điển ở cửa hàng điện máy', 'この／それ／あれ · いくら · じゃ…ください'],
        ['3', 'Mua trứng và táo ở siêu thị', '〜つ · 全部で · いくら'],
        ['4', 'Gọi món ở nhà hàng', '注文をお願いします · 〜を〜つ ください'],
        ['5', 'Trả đồ bỏ quên', 'だれの · どこの · 〜のです'],
      ],
    ),

    H(`${LV.de} — Hội thoại 1: Hỏi chỗ trong toà nhà`),
    DL('Hội thoại 1 — インフォメーションで', [
      ['客', 'm', 'あのう、 すみません。 ATM は どこ です か。', 'À, xin lỗi. ATM ở đâu ạ?'],
      ['店員', 'f', 'いらっしゃいませ。 ATM は {1階|いっかい} です。 あちら です。', 'Kính chào quý khách. ATM ở tầng 1. Ở phía kia ạ.'],
      ['客', 'm', 'どうも ありがとう ございます。 {100円|ひゃくえん}-ショップ は {何階|なんがい} です か。', 'Xin cảm ơn. Cửa hàng 100 yên ở tầng mấy ạ?'],
      ['店員', 'f', '{3階|さんがい} です。 トイレ も {3階|さんがい} です。', 'Tầng 3 ạ. Nhà vệ sinh cũng ở tầng 3.'],
      ['客', 'm', 'そう です か。 どうも。', 'Vậy ạ. Cảm ơn.'],
    ]),
    MC('lt-b2-ht-1', 'Hiểu hội thoại 1 và điền chỗ trống (6 câu)', [
      Q('ATM は{何階|なんがい}ですか。', '{1階|いっかい}', '{2階|にかい} | {3階|さんがい} | {地下|ちか}', '1階.'),
      Q('ATM はどちらですか。', 'あちら', 'こちら | そちら | ここ', 'あちらです.'),
      Q('{100円|ひゃくえん}ショップは{何階|なんがい}ですか。', '{3階|さんがい}', '{1階|いっかい} | {2階|にかい} | {5階|ごかい}', '3階.'),
      Q('トイレは{何階|なんがい}ですか。', '{3階|さんがい}', '{1階|いっかい} | {4階|よんかい} | {5階|ごかい}', '3階.'),
      Q('客：ATM＿＿＿どこですか。', 'は', 'を | の | と', 'は.'),
      Q('店員：トイレ＿＿＿{3階|さんがい}です。 (cũng)', 'も', 'は | を | の', 'も = cũng.'),
    ]),
    BUILD('lt-b2-ht-1-xep', 'Sắp xếp lượt thoại 1', [
      BDT('Hỏi ATM → đáp → hỏi 100円ショップ → đáp.', [
        'あのう、 すみません。 ATM は どこ です か。',
        'ATM は {1階|いっかい} です。 あちら です。',
        '{100円|ひゃくえん}-ショップ は {何階|なんがい} です か。',
        '{3階|さんがい} です。',
      ]),
    ]),

    H(`${LV.de} — Hội thoại 2: Mua kim từ điển`),
    DL('Hội thoại 2 — 電器屋で', [
      ['ワン', 'f', 'すみません。 この {電子辞書|でんしじしょ} は いくら です か。', 'Xin lỗi. Cái kim từ điển này bao nhiêu ạ?'],
      ['店員', 'm', 'それ は {12,000円|いちまんにせんえん} です。', 'Cái đó 12.000 yên ạ.'],
      ['ワン', 'f', 'あの パソコン は？', 'Còn cái máy tính kia?'],
      ['店員', 'm', 'あれ は {68,000円|ろくまんはっせんえん} です。', 'Cái kia 68.000 yên ạ.'],
      ['ワン', 'f', 'そう です か。 じゃ、 この {電子辞書|でんしじしょ} を ください。', 'Vậy ạ. Thế thì cho tôi cái kim từ điển này.'],
      ['店員', 'm', 'どうも ありがとう ございます。', 'Xin cảm ơn quý khách.'],
    ]),
    MC('lt-b2-ht-2', 'Hiểu hội thoại 2 và điền chỗ trống (6 câu)', [
      Q('{電子辞書|でんしじしょ}はいくらですか。', '{12,000円|いちまんにせんえん}', '{1,200円|せんにひゃくえん} | {68,000円|ろくまんはっせんえん} | {120,000円|じゅうにまんえん}', '12.000円.'),
      Q('パソコンはいくらですか。', '{68,000円|ろくまんはっせんえん}', '{12,000円|いちまんにせんえん} | {8,000円|はっせんえん} | {60,800円|ろくまんはっぴゃくえん}', '68.000円.'),
      Q('Cuối cùng Wan mua món nào?', '{電子辞書|でんしじしょ}', 'パソコン | カメラ | {時計|とけい}', 'じゃ、この電子辞書をください.'),
      Q('ワン：この{電子辞書|でんしじしょ}は＿＿＿ですか。', 'いくら', 'どこ | だれ | {何|なん}', 'Hỏi giá.'),
      Q('{店員|てんいん}：＿＿＿は{12,000円|いちまんにせんえん}です。 (cái đó, gần người nghe)', 'それ', 'これ | あれ | ここ', 'それ.'),
      Q('ワン：じゃ、この{電子辞書|でんしじしょ}＿＿＿ください。', 'を', 'は | の | と', 'を.'),
    ]),
    BUILD('lt-b2-ht-2-xep', 'Sắp xếp lượt thoại 2', [
      BDT('Hỏi giá → đáp → hỏi cái khác → đáp.', [
        'この {電子辞書|でんしじしょ} は いくら です か。',
        'それ は {12,000円|いちまんにせんえん} です。',
        'あの パソコン は？',
        'あれ は {68,000円|ろくまんはっせんえん} です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 3: Ở siêu thị`),
    DL('Hội thoại 3 — スーパーで', [
      ['客', 'f', 'すみません、 {卵|たまご} は いくら です か。', 'Xin lỗi, trứng bao nhiêu ạ?'],
      ['店員', 'm', '{卵|たまご} は {230円|にひゃくさんじゅうえん} です。 リンゴ は {一|ひと}つ {120円|ひゃくにじゅうえん} です。', 'Trứng 230 yên. Táo một quả 120 yên ạ.'],
      ['客', 'f', 'じゃ、 {卵|たまご} を {一|ひと}つ と、 リンゴ を {三|みっ}つ ください。', 'Vậy cho tôi một hộp trứng và ba quả táo.'],
      ['店員', 'm', 'はい。 {全部|ぜんぶ} で {590円|ごひゃくきゅうじゅうえん} です。', 'Vâng. Tất cả là 590 yên ạ.'],
    ]),
    MC('lt-b2-ht-3', 'Hiểu hội thoại 3 và điền chỗ trống (6 câu)', [
      Q('{卵|たまご}はいくらですか。', '{230円|にひゃくさんじゅうえん}', '{320円|さんびゃくにじゅうえん} | {120円|ひゃくにじゅうえん} | {590円|ごひゃくきゅうじゅうえん}', '230円.'),
      Q('リンゴは{一|ひと}ついくらですか。', '{120円|ひゃくにじゅうえん}', '{230円|にひゃくさんじゅうえん} | {12円|じゅうにえん} | {1,200円|せんにひゃくえん}', '120円.'),
      Q('Cô khách mua mấy quả táo?', '3 quả', '1 quả | 2 quả | 5 quả', 'リンゴを三つ.'),
      Q('{全部|ぜんぶ}でいくらですか。', '{590円|ごひゃくきゅうじゅうえん}', '{350円|さんびゃくごじゅうえん} | {360円|さんびゃくろくじゅうえん} | {950円|きゅうひゃくごじゅうえん}', '230 + 120 × 3 = 590.'),
      Q('客：{卵|たまご}を{一|ひと}つ＿＿＿、リンゴを{三|みっ}つください。', 'と', 'も | の | は', 'Nối hai món: と.'),
      Q('{店員|てんいん}：＿＿＿{590円|ごひゃくきゅうじゅうえん}です。 (tổng cộng)', '{全部|ぜんぶ}で', '{全部|ぜんぶ}を | {全部|ぜんぶ}の | {全部|ぜんぶ}は', '全部で.'),
    ]),
    BUILD('lt-b2-ht-3-xep', 'Sắp xếp lượt thoại 3', [
      BDT('Hỏi giá → đáp → mua → báo tổng.', [
        '{卵|たまご} は いくら です か。',
        '{卵|たまご} は {230円|にひゃくさんじゅうえん} です。',
        'じゃ、 {卵|たまご} を {一|ひと}つ ください。',
        '{全部|ぜんぶ} で {230円|にひゃくさんじゅうえん} です。',
      ]),
    ]),

    H(`${LV.vua} — Hội thoại 4: Gọi món ở nhà hàng`),
    DL('Hội thoại 4 — レストランで', [
      ['客', 'm', 'すみません。 {注文|ちゅうもん} を お{願|ねが}い します。', 'Xin lỗi. Cho tôi gọi món.'],
      ['店員', 'f', 'はい、 どうぞ。', 'Vâng, xin mời.'],
      ['客', 'm', 'とんかつ を {一|ひと}つ と、 カレー を {二|ふた}つ ください。', 'Cho tôi một tonkatsu và hai cà-ri.'],
      ['店員', 'f', 'とんかつ を {一|ひと}つ、 カレー を {二|ふた}つ です ね。', 'Một tonkatsu, hai cà-ri ạ.'],
      ['客', 'm', 'はい。 それから、 ビール を {二|ふた}つ ください。', 'Vâng. Rồi, cho tôi hai bia nữa.'],
      ['店員', 'f', 'どうも ありがとう ございます。', 'Xin cảm ơn quý khách.'],
    ]),
    MC('lt-b2-ht-4', 'Hiểu hội thoại 4 và điền chỗ trống (6 câu)', [
      Q('とんかつはいくつですか。', '{一|ひと}つ', '{二|ふた}つ | {三|みっ}つ | {四|よっ}つ', '一つ.'),
      Q('カレーはいくつですか。', '{二|ふた}つ', '{一|ひと}つ | {三|みっ}つ | {四|よっ}つ', '二つ.'),
      Q('ビールはいくつですか。', '{二|ふた}つ', '{一|ひと}つ | {三|みっ}つ | {五|いつ}つ', '二つ.'),
      Q('客：＿＿＿をお{願|ねが}いします。 (gọi món)', '{注文|ちゅうもん}', 'レジ | トイレ | {地下|ちか}', '注文をお願いします.'),
      Q('{店員|てんいん}：はい、＿＿＿。 (xin mời nói)', 'どうぞ', 'じゃ | いらっしゃいませ | こちらこそ', 'どうぞ.'),
      Q('客：とんかつ＿＿＿{一|ひと}つ、カレー＿＿＿{二|ふた}つください。', 'を / を', 'は / は | の / の | と / と', 'N を 〜つ.'),
    ]),
    BUILD('lt-b2-ht-4-xep', 'Sắp xếp lượt thoại 4', [
      BDT('Xin gọi món → mời → gọi → xác nhận.', [
        'すみません。 {注文|ちゅうもん} を お{願|ねが}い します。',
        'はい、 どうぞ。',
        'とんかつ を {一|ひと}つ と、 カレー を {二|ふた}つ ください。',
        'とんかつ を {一|ひと}つ、 カレー を {二|ふた}つ です ね。',
      ]),
    ]),

    H(`${LV.kho} — Hội thoại 5: Trả đồ bỏ quên`),
    DL('Hội thoại 5 — インフォメーションで', [
      ['店員', 'f', 'すみません。 この {財布|さいふ} は だれ の です か。', 'Xin lỗi. Cái ví này là của ai ạ?'],
      ['客', 'm', 'あっ、 {私|わたし} の です。', 'A, của tôi ạ.'],
      ['店員', 'f', 'どこ の {財布|さいふ} です か。', 'Đó là ví của nước nào ạ?'],
      ['客', 'm', 'フランス の {財布|さいふ} です。', 'Là ví của Pháp ạ.'],
      ['店員', 'f', 'そう です か。 はい、 どうぞ。', 'Vậy ạ. Xin mời.'],
      ['客', 'm', 'どうも ありがとう ございます。', 'Xin cảm ơn.'],
    ]),
    MC('lt-b2-ht-5', 'Hiểu hội thoại 5 và điền chỗ trống (7 câu)', [
      Q('Cái ví là của ai?', 'Của người khách (nam)', 'Của nhân viên | Của Wan | Của Park', 'あっ、私のです (khách nói).'),
      Q('どこの{財布|さいふ}ですか。', 'フランスの', '{日本|にほん}の | ドイツの | インドの', 'フランス.'),
      Q('{店員|てんいん}：この{財布|さいふ}は＿＿＿のですか。', 'だれ', 'どこ | いくら | {何|なん}', 'だれの.'),
      Q('{店員|てんいん}：＿＿＿の{財布|さいふ}ですか。 (nước nào)', 'どこ', 'だれ | いくら | {何|なん}', 'どこの.'),
      Q('{客|きゃく}：{私|わたし}＿＿＿です。 (của tôi)', 'の', 'は | を | も', 'N の です.'),
      Q('{店員|てんいん}：はい、＿＿＿。 (xin mời, đưa ví)', 'どうぞ', 'いらっしゃいませ | じゃ | こちらこそ', 'どうぞ.'),
      Q('「{財布|さいふ}」 đọc là…', 'さいふ', 'ざいふ | さいぶ | ざいぶ', '財布 = さいふ.'),
    ]),
    BUILD('lt-b2-ht-5-xep', 'Sắp xếp lượt thoại 5', [
      BDT('Hỏi của ai → nhận → hỏi nước → đáp.', [
        'この {財布|さいふ} は だれ の です か。',
        'あっ、 {私|わたし} の です。',
        'どこ の {財布|さいふ} です か。',
        'フランス の {財布|さいふ} です。',
      ]),
    ]),

    H(`${LV.kho} — Tự đóng vai (thu âm)`),
    NOTE('Cách làm', [
      'Chọn **một hội thoại**, che lời thoại của một vai, đọc vai còn lại thành tiếng và **tự đáp** vai bị che. Sau đó đổi vai.',
      'Lần 2: thay đồ vật, giá, tầng (ví dụ ATM → トイレ; 電子辞書 → 時計; 12,000円 → 30,000円).',
      'Lần 3: thu âm, nghe lại; kiểm tra: ☐ giá đọc đúng ☐ có を sau món ☐ これ/この dùng đúng ☐ đủ câu.',
    ]),
    SPEAK('lt-b2-ht-noi', [
      'トイレは どこですか。',
      'スーパーは なんがいですか。',
      'この かばんは いくらですか。',
      'コーヒーを ふたつ ください。',
      'これは なんの りょうりですか。',
      'この ほんは だれのですか。',
    ]),
  ],
};

/* ───────── 8. ĐỌC HIỂU ───────── */

const R2_1: [string, string][] = [
  ['これ は パン です。', 'Đây là bánh mì.'],
  ['{150円|ひゃくごじゅうえん} です。', 'Giá 150 yên.'],
  ['あれ は ケーキ です。', 'Cái kia là bánh ngọt.'],
  ['{450円|よんひゃくごじゅうえん} です。', 'Giá 450 yên.'],
  ['それ は ジュース です。', 'Cái đó là nước ép.'],
  ['{200円|にひゃくえん} です。', 'Giá 200 yên.'],
];
const R2_2: [string, string][] = [
  ['ひかりデパート の {地下|ちか} {1階|いっかい} は スーパー です。', 'Tầng hầm 1 của ひかりデパート là siêu thị.'],
  ['{1階|いっかい} は インフォメーション と ATM と きっさてん です。', 'Tầng 1 là quầy thông tin, ATM và quán giải khát.'],
  ['{2階|にかい} は {本屋|ほんや} と くつ-{屋|や} です。', 'Tầng 2 là hiệu sách và cửa hàng giày.'],
  ['{3階|さんがい} は {100円|ひゃくえん}-ショップ と トイレ です。', 'Tầng 3 là cửa hàng 100 yên và nhà vệ sinh.'],
  ['{5階|ごかい} は レストラン です。', 'Tầng 5 là nhà hàng.'],
];
const R2_3: [string, string][] = [
  ['^ワン-さん の かばん は フランス の です。', 'Cái cặp của Wan là của Pháp.'],
  ['{二万五千円|にまんごせんえん} です。', 'Giá 25.000 yên.'],
  ['くつ も フランス の です。', 'Giày cũng là của Pháp.'],
  ['くつ は {一万円|いちまんえん} です。', 'Giày giá 10.000 yên.'],
  ['{時計|とけい} は {日本|にほん} の です。 {三万円|さんまんえん} です。', 'Đồng hồ là của Nhật. Giá 30.000 yên.'],
];
const R2_4: [string, string][] = [
  ['ここ は レストラン です。', 'Đây là nhà hàng.'],
  ['カレー は {800円|はっぴゃくえん} です。', 'Cà-ri 800 yên.'],
  ['とんかつ は {1,200円|せんにひゃくえん} です。', 'Tonkatsu 1.200 yên.'],
  ['ハンバーグ は {1,000円|せんえん} です。', 'Hamburg 1.000 yên.'],
  ['ライス は {200円|にひゃくえん} です。', 'Cơm 200 yên.'],
  ['ジュース は {300円|さんびゃくえん}、 コーヒー は {400円|よんひゃくえん} です。', 'Nước ép 300 yên, cà phê 400 yên.'],
  ['ビール は {600円|ろっぴゃくえん}、 ワイン は {700円|ななひゃくえん} です。', 'Bia 600 yên, rượu vang 700 yên.'],
];
const R2_5: [string, string][] = [
  ['これ は ^ナタポン-さん の {財布|さいふ} です。', 'Đây là ví của Natapon.'],
  ['タイ の {財布|さいふ} です。', 'Là ví của Thái Lan.'],
  ['{三千円|さんぜんえん} です。', 'Giá 3.000 yên.'],
  ['かばん は ドイツ の です。', 'Cái cặp là của Đức.'],
  ['{八千円|はっせんえん} です。', 'Giá 8.000 yên.'],
  ['{時計|とけい} は {日本|にほん} の です。', 'Đồng hồ là của Nhật.'],
  ['{二万円|にまんえん} です。', 'Giá 20.000 yên.'],
  ['{全部|ぜんぶ} で {三万一千円|さんまんいっせんえん} です。', 'Tất cả là 31.000 yên.'],
];

const L2_DOC_HIEU: Lesson = {
  id: 'lt-b2-doc-hieu',
  kind: 'reading',
  title: 'Luyện thêm Bài 2 — Đọc hiểu: 5 đoạn từ ngắn đến dài (bảng giá · sơ đồ toà nhà · cửa hàng · thực đơn · mua sắm)',
  goal: 'Đọc hiểu đoạn có giá tiền, tầng, thực đơn: trả lời chọn đáp án, đúng/sai, tính tổng tiền, rồi đọc to đoạn dài không furigana.',
  minutes: 55,
  blocks: [
    NOTE('Học thế nào', [
      'Đọc đoạn **hai lần**: lần 1 hiểu ý chính (đây là cái gì, ở đâu, giá bao nhiêu), lần 2 mới đọc câu hỏi và **tìm câu trả lời trong bài**.',
      'Câu đúng/sai có **"Không có trong bài"**: nếu bài không nói thì chọn nó, dù ngoài đời có thể đúng.',
      'Đoạn 5 là mức Khó và cũng là khuôn **Reading 40 điểm**: chuẩn bị 30 giây rồi đọc to một hơi — chú ý đọc số.',
    ]),

    H(`${LV.de} — Đoạn 1: Bảng giá`),
    ...PSG('Bảng giá', R2_1),
    MC('lt-b2-dh-1', 'Câu hỏi đoạn 1 (6 câu)', [
      Q('パンはいくらですか。', '{150円|ひゃくごじゅうえん}', '{450円|よんひゃくごじゅうえん} | {200円|にひゃくえん} | {105円|ひゃくごえん}', '150円.'),
      Q('ケーキはいくらですか。', '{450円|よんひゃくごじゅうえん}', '{150円|ひゃくごじゅうえん} | {200円|にひゃくえん} | {540円|ごひゃくよんじゅうえん}', '450円.'),
      Q('ジュースはいくらですか。', '{200円|にひゃくえん}', '{150円|ひゃくごじゅうえん} | {450円|よんひゃくごじゅうえん} | {20円|にじゅうえん}', '200円.'),
      TF('ケーキは{450円|よんひゃくごじゅうえん}です。', 'Đúng', '450円.'),
      TF('パンは{450円|よんひゃくごじゅうえん}です。', 'Sai', '150円.'),
      TF('コーヒーは{300円|さんびゃくえん}です。', 'Không có trong bài', 'Không có コーヒー.'),
    ]),

    H(`${LV.de} — Đoạn 2: ひかりデパート`),
    ...PSG('ひかりデパート', R2_2),
    MC('lt-b2-dh-2', 'Câu hỏi đoạn 2 (8 câu)', [
      Q('スーパーは{何階|なんがい}ですか。', '{地下|ちか}{1階|いっかい}', '{1階|いっかい} | {2階|にかい} | {5階|ごかい}', '地下1階.'),
      Q('ATMは{何階|なんがい}ですか。', '{1階|いっかい}', '{2階|にかい} | {3階|さんがい} | {地下|ちか}', '1階.'),
      Q('{本屋|ほんや}は{何階|なんがい}ですか。', '{2階|にかい}', '{1階|いっかい} | {3階|さんがい} | {5階|ごかい}', '2階.'),
      Q('トイレは{何階|なんがい}ですか。', '{3階|さんがい}', '{2階|にかい} | {4階|よんかい} | {5階|ごかい}', '3階.'),
      Q('レストランは{何階|なんがい}ですか。', '{5階|ごかい}', '{3階|さんがい} | {4階|よんかい} | {1階|いっかい}', '5階.'),
      TF('くつ{屋|や}は{2階|にかい}です。', 'Đúng', '2階.'),
      TF('きっさてんは{3階|さんがい}です。', 'Sai', '1階.'),
      TF('カメラ{屋|や}は{4階|よんかい}です。', 'Không có trong bài', 'Đoạn không nói về カメラ屋.'),
    ]),

    H(`${LV.vua} — Đoạn 3: ワンさんのかばんとくつ`),
    ...PSG('ワンさんのかばんとくつ', R2_3),
    MC('lt-b2-dh-3', 'Câu hỏi đoạn 3 (8 câu)', [
      Q('ワンさんのかばんはどこのですか。', 'フランス', 'ドイツ | {日本|にほん} | タイ', 'フランスの.'),
      Q('かばんはいくらですか。', '{二万五千円|にまんごせんえん}', '{一万円|いちまんえん} | {三万円|さんまんえん} | {二千五百円|にせんごひゃくえん}', '25.000円.'),
      Q('くつはどこのですか。', 'フランス', 'ドイツ | {日本|にほん} | タイ', 'フランスの.'),
      Q('くつはいくらですか。', '{一万円|いちまんえん}', '{二万五千円|にまんごせんえん} | {三万円|さんまんえん} | {千円|せんえん}', '10.000円.'),
      Q('{時計|とけい}はどこのですか。', '{日本|にほん}', 'フランス | ドイツ | タイ', '日本の.'),
      Q('{時計|とけい}はいくらですか。', '{三万円|さんまんえん}', '{二万円|にまんえん} | {一万円|いちまんえん} | {三千円|さんぜんえん}', '30.000円.'),
      TF('かばんとくつは どちらもフランスのです。', 'Đúng', 'フランスの + フランスの.'),
      TF('{時計|とけい}は ドイツのです。', 'Sai', '日本の.'),
    ]),

    H(`${LV.vua} — Đoạn 4: レストランのメニュー`),
    ...PSG('レストランのメニュー', R2_4),
    MC('lt-b2-dh-4', 'Câu hỏi đoạn 4 (9 câu)', [
      Q('カレーはいくらですか。', '{800円|はっぴゃくえん}', '{600円|ろっぴゃくえん} | {1,000円|せんえん} | {80円|はちじゅうえん}', '800円.'),
      Q('とんかつはいくらですか。', '{1,200円|せんにひゃくえん}', '{1,000円|せんえん} | {2,100円|にせんひゃくえん} | {120円|ひゃくにじゅうえん}', '1.200円.'),
      Q('ハンバーグはいくらですか。', '{1,000円|せんえん}', '{800円|はっぴゃくえん} | {1,200円|せんにひゃくえん} | {100円|ひゃくえん}', '1.000円.'),
      Q('ライスはいくらですか。', '{200円|にひゃくえん}', '{300円|さんびゃくえん} | {400円|よんひゃくえん} | {20円|にじゅうえん}', '200円.'),
      Q('ビールはいくらですか。', '{600円|ろっぴゃくえん}', '{700円|ななひゃくえん} | {400円|よんひゃくえん} | {60円|ろくじゅうえん}', '600円.'),
      Q('カレー 1 つと ライス 1 つ。 {全部|ぜんぶ}でいくら？', '{1,000円|せんえん}', '{800円|はっぴゃくえん} | {1,200円|せんにひゃくえん} | {1,400円|せんよんひゃくえん}', '800 + 200 = 1.000.'),
      Q('コーヒー 2 つ。 {全部|ぜんぶ}でいくら？', '{800円|はっぴゃくえん}', '{400円|よんひゃくえん} | {600円|ろっぴゃくえん} | {1,200円|せんにひゃくえん}', '400 × 2 = 800.'),
      TF('ワインは{700円|ななひゃくえん}です。', 'Đúng', '700円.'),
      TF('ジュースは{400円|よんひゃくえん}です。', 'Sai', '300円 (コーヒー mới 400円).'),
    ]),

    H(`${LV.kho} — Đoạn 5: ナタポンさんの{財布|さいふ}とかばん (đọc to)`),
    ...PSG('ナタポンさんの{財布|さいふ}とかばん', R2_5),
    MC('lt-b2-dh-5', 'Câu hỏi đoạn 5 (9 câu)', [
      Q('{財布|さいふ}はどこのですか。', 'タイ', 'ドイツ | {日本|にほん} | フランス', 'タイの財布.'),
      Q('{財布|さいふ}はいくらですか。', '{三千円|さんぜんえん}', '{八千円|はっせんえん} | {二万円|にまんえん} | {三万円|さんまんえん}', '3.000円.'),
      Q('かばんはどこのですか。', 'ドイツ', 'タイ | {日本|にほん} | フランス', 'ドイツの.'),
      Q('かばんはいくらですか。', '{八千円|はっせんえん}', '{三千円|さんぜんえん} | {二万円|にまんえん} | {八百円|はっぴゃくえん}', '8.000円.'),
      Q('{時計|とけい}はどこのですか。', '{日本|にほん}', 'タイ | ドイツ | フランス', '日本の.'),
      Q('{時計|とけい}はいくらですか。', '{二万円|にまんえん}', '{八千円|はっせんえん} | {三千円|さんぜんえん} | {二千円|にせんえん}', '20.000円.'),
      Q('{全部|ぜんぶ}でいくらですか。', '{三万一千円|さんまんいっせんえん}', '{一万一千円|いちまんいっせんえん} | {二万三千円|にまんさんぜんえん} | {三万円|さんまんえん}', '3.000 + 8.000 + 20.000 = 31.000.'),
      TF('ナタポンさんの{財布|さいふ}はドイツのです。', 'Sai', 'タイの.'),
      TF('{時計|とけい}は{二万円|にまんえん}です。', 'Đúng', '20.000 yên.'),
    ]),
    READK('lt-b2-dh-docto', 'Đọc to đoạn 5 KHÔNG furigana (tự chấm)', 'Cho 30 giây chuẩn bị, rồi đọc một hơi; sau đó bấm xem cách đọc đúng.', [RKP(R2_5)]),
    NOTE('Chấm phần đọc to', [
      '☐ Đọc **liền mạch**. ☐ **{三千円|さんぜんえん}** · **{八千円|はっせんえん}** · **{二万円|にまんえん}** · **{三万一千円|さんまんいっせんえん}** đúng biến âm.',
      '☐ 〜の (Pháp/Thái/Đức/Nhật) đọc rõ **no**. ☐ **{全部|ぜんぶ}で** không bỏ で.',
      'Sai một ký tự hiragana khi thi: trừ khoảng 0,2 điểm.',
    ]),
  ],
};

/* ───────── 9. NGHE ───────── */

const L2_NGHE: Lesson = {
  id: 'lt-b2-nghe',
  kind: 'listening',
  title: 'Luyện thêm Bài 2 — Nghe: 9 đoạn mới, từ chậm đơn giản đến bẫy (nhân viên sửa giá, khách đổi số lượng)',
  goal: 'Nghe hiểu hỏi chỗ, hỏi giá, mua đồ, gọi món, hỏi đồ của ai; bắt được thông tin CUỐI CÙNG khi người nói sửa lại giá hoặc số lượng.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Nghe **hai lần**. Lần 1: chỉ ghi **tầng, giá, số lượng** ra giấy. Lần 2: mới đọc câu hỏi. **Không bật lời thoại** trước khi trả lời xong.',
      'Đoạn ⑧–⑨ có **bẫy**: nhân viên **sửa giá** (「あっ、すみません」), khách **đổi số lượng** (「二つ… あっ、三つ」). Nhớ: **thông tin CUỐI CÙNG** mới đúng.',
      'Lỗi hay mắc nghe: **ろっぴゃく (600) / はっぴゃく (800)**; **さんぜん (3000) / はっせん (8000)**; **にまん / さんまん**; **いっかい / さんがい**; **ふたつ / みっつ**.',
    ]),
    RECAP('Bảng đoạn nghe', [
      '① ～ ③ 🟢 chậm, đơn giản: chỗ nhà vệ sinh · hỏi vật và giá · giá bánh.',
      '④ ～ ⑦ 🟡 tầng · tổng tiền siêu thị · gọi món · đồ của ai.',
      '⑧ ～ ⑨ 🔴 bẫy: sửa giá, đổi số lượng.',
    ]),

    H(`${LV.de} — ① ～ ③`),
    LN('lt-b2-ng-01', '① Nhà vệ sinh ở đâu', [
      ['客', 'm', 'すみません。 トイレ は どこ です か。', 'Xin lỗi. Nhà vệ sinh ở đâu ạ?'],
      ['店員', 'f', 'トイレ は {2階|にかい} です。 あちら の エスカレーター です。', 'Nhà vệ sinh ở tầng 2. Là thang cuốn phía kia ạ.'],
      ['客', 'm', 'どうも ありがとう ございます。', 'Xin cảm ơn.'],
    ]),
    LN('lt-b2-ng-02', '② Hỏi vật và giá', [
      ['客', 'f', 'すみません。 それ は {何|なん} です か。', 'Xin lỗi. Cái đó là gì ạ?'],
      ['店員', 'm', 'これ は {電子辞書|でんしじしょ} です。 {5,800円|ごせんはっぴゃくえん} です。', 'Đây là kim từ điển. 5.800 yên ạ.'],
      ['客', 'f', 'そう です か。 じゃ、 これ を ください。', 'Vậy ạ. Thế thì cho tôi cái này.'],
    ]),
    LN('lt-b2-ng-03', '③ Giá bánh', [
      ['客', 'm', 'この パン は いくら です か。', 'Bánh mì này bao nhiêu ạ?'],
      ['店員', 'f', '{150円|ひゃくごじゅうえん} です。 ケーキ は {450円|よんひゃくごじゅうえん} です。', '150 yên ạ. Bánh ngọt 450 yên.'],
      ['客', 'm', 'じゃ、 パン を {一|ひと}つ ください。', 'Vậy cho tôi một bánh mì.'],
    ]),
    MC('lt-b2-ng-q1', 'Câu hỏi ① ～ ③ (9 câu)', [
      Q('① トイレは{何階|なんがい}ですか。', '{2階|にかい}', '{1階|いっかい} | {3階|さんがい} | {地下|ちか}', '2階.'),
      Q('① どちらのエスカレーターですか。', 'あちら', 'こちら | そちら | どちら', 'あちらの.'),
      Q('① 「にかい」 là tầng mấy?', '2', '1 | 3 | 4', 'にかい = 2階.'),
      Q('② Khách hỏi về món nào?', '{電子辞書|でんしじしょ}', '{携帯電話|けいたいでんわ} | パソコン | {時計|とけい}', '電子辞書.'),
      Q('② {電子辞書|でんしじしょ}はいくらですか。', '{5,800円|ごせんはっぴゃくえん}', '{5,000円|ごせんえん} | {8,500円|はっせんごひゃくえん} | {580円|ごひゃくはちじゅうえん}', '5.800円.'),
      Q('② Khách đã làm gì?', 'Mua cái kim từ điển', 'Không mua | Mua máy tính | Mua đồng hồ', 'これをください.'),
      Q('③ パンはいくらですか。', '{150円|ひゃくごじゅうえん}', '{450円|よんひゃくごじゅうえん} | {105円|ひゃくごえん} | {500円|ごひゃくえん}', '150円.'),
      Q('③ ケーキはいくらですか。', '{450円|よんひゃくごじゅうえん}', '{150円|ひゃくごじゅうえん} | {540円|ごひゃくよんじゅうえん} | {400円|よんひゃくえん}', '450円.'),
      Q('③ Khách mua mấy cái bánh mì?', '1 cái', '2 cái | 3 cái | 4 cái', 'パンを一つ.'),
    ]),

    H(`${LV.vua} — ④ ～ ⑦`),
    LN('lt-b2-ng-04', '④ Hiệu sách ở đâu', [
      ['ワン', 'f', 'すみません。 {本屋|ほんや} は {何階|なんがい} です か。', 'Xin lỗi. Hiệu sách ở tầng mấy ạ?'],
      ['店員', 'm', '{本屋|ほんや} は {2階|にかい} です。 ATM は {1階|いっかい} です。', 'Hiệu sách ở tầng 2. ATM ở tầng 1 ạ.'],
      ['ワン', 'f', 'どうも ありがとう ございます。', 'Xin cảm ơn.'],
    ]),
    LN('lt-b2-ng-05', '⑤ Siêu thị', [
      ['客', 'f', 'リンゴ を {三|みっ}つ と、 {卵|たまご} を {一|ひと}つ ください。', 'Cho tôi ba quả táo và một hộp trứng.'],
      ['店員', 'm', 'リンゴ は {一|ひと}つ {120円|ひゃくにじゅうえん} です。 {卵|たまご} は {230円|にひゃくさんじゅうえん} です。', 'Táo một quả 120 yên. Trứng 230 yên.'],
      ['店員', 'm', '{全部|ぜんぶ} で {590円|ごひゃくきゅうじゅうえん} です。', 'Tất cả là 590 yên ạ.'],
    ]),
    LN('lt-b2-ng-06', '⑥ Gọi món', [
      ['客', 'm', 'すみません。 {注文|ちゅうもん} を お{願|ねが}い します。', 'Xin lỗi. Cho tôi gọi món.'],
      ['店員', 'f', 'はい、 どうぞ。', 'Vâng, xin mời.'],
      ['客', 'm', 'ハンバーグ を {一|ひと}つ と、 ジュース を {二|ふた}つ ください。', 'Cho tôi một hamburg và hai nước ép.'],
      ['店員', 'f', 'ハンバーグ を {一|ひと}つ、 ジュース を {二|ふた}つ です ね。', 'Một hamburg, hai nước ép ạ.'],
    ]),
    LN('lt-b2-ng-07', '⑦ Của ai, của nước nào', [
      ['ワン', 'f', '^パク-さん、 この かばん は だれ の です か。', 'Park, cái cặp này là của ai?'],
      ['パク', 'm', 'あっ、 {私|わたし} の です。 フランス の かばん です。', 'A, của tôi. Là cái cặp của Pháp.'],
      ['ワン', 'f', 'そう です か。 {三万円|さんまんえん} です か。', 'Vậy à. Giá 30.000 yên phải không?'],
      ['パク', 'm', 'いいえ、 {二万円|にまんえん} です。', 'Không, 20.000 yên.'],
    ]),
    MC('lt-b2-ng-q2', 'Câu hỏi ④ ～ ⑦ (13 câu)', [
      Q('④ {本屋|ほんや}は{何階|なんがい}ですか。', '{2階|にかい}', '{1階|いっかい} | {3階|さんがい} | {5階|ごかい}', '2階.'),
      Q('④ ATM は{何階|なんがい}ですか。', '{1階|いっかい}', '{2階|にかい} | {3階|さんがい} | {地下|ちか}', '1階.'),
      Q('⑤ Khách mua mấy quả táo?', '3 quả', '1 quả | 2 quả | 5 quả', 'リンゴを三つ.'),
      Q('⑤ {卵|たまご}はいくらですか。', '{230円|にひゃくさんじゅうえん}', '{320円|さんびゃくにじゅうえん} | {120円|ひゃくにじゅうえん} | {590円|ごひゃくきゅうじゅうえん}', '230円.'),
      Q('⑤ {全部|ぜんぶ}でいくらですか。', '{590円|ごひゃくきゅうじゅうえん}', '{350円|さんびゃくごじゅうえん} | {360円|さんびゃくろくじゅうえん} | {950円|きゅうひゃくごじゅうえん}', '120 × 3 + 230 = 590.'),
      Q('⑥ Khách gọi mấy phần hamburg?', '1 phần', '2 phần | 3 phần | 4 phần', 'ハンバーグを一つ.'),
      Q('⑥ Khách gọi mấy ly nước ép?', '2 ly', '1 ly | 3 ly | 4 ly', 'ジュースを二つ.'),
      Q('⑥ Sau khi khách xin gọi món, nhân viên nói gì?', 'はい、どうぞ。', 'いらっしゃいませ。 | じゃ。 | こちらこそ。', 'Khách nói 注文をお願いします → 店員: はい、どうぞ.'),
      Q('⑦ かばんはだれのですか。', 'パクさんの', 'ワンさんの | {店員|てんいん}の | {先生|せんせい}の', 'パクさんのです.'),
      Q('⑦ かばんはどこのですか。', 'フランス', 'ドイツ | {日本|にほん} | インド', 'フランスの.'),
      Q('⑦ かばんはいくらですか。 (CUỐI)', '{二万円|にまんえん}', '{三万円|さんまんえん} | {一万円|いちまんえん} | {二千円|にせんえん}', 'いいえ、二万円です.'),
      Q('⑦ Lúc đầu Wan đoán giá bao nhiêu?', '{三万円|さんまんえん}', '{二万円|にまんえん} | {一万円|いちまんえん} | {三千円|さんぜんえん}', 'Wan hỏi 三万円ですか.'),
      Q('⑦ 「にまん」 là bao nhiêu?', '20.000', '2.000 | 200.000 | 30.000', 'にまん = 2 vạn.'),
    ]),

    H(`${LV.kho} — ⑧ ～ ⑨ (bẫy)`),
    LN('lt-b2-ng-08', '⑧ Nhân viên sửa giá', [
      ['客', 'f', 'この {時計|とけい} は いくら です か。', 'Chiếc đồng hồ này bao nhiêu ạ?'],
      ['店員', 'm', '{8,000円|はっせんえん} です。 ……あっ、 すみません。 {6,800円|ろくせんはっぴゃくえん} です。', '8.000 yên ạ. ...A, xin lỗi. 6.800 yên ạ.'],
      ['客', 'f', '{6,800円|ろくせんはっぴゃくえん} です ね。 じゃ、 これ を ください。', '6.800 yên nhỉ. Vậy cho tôi cái này.'],
    ]),
    LN('lt-b2-ng-09', '⑨ Khách đổi số lượng', [
      ['客', 'm', 'ケーキ を {二|ふた}つ ください。 ……あっ、 {三|みっ}つ ください。', 'Cho tôi hai cái bánh. ...A, cho tôi ba cái.'],
      ['店員', 'f', 'ケーキ を {三|みっ}つ です ね。 ケーキ は {一|ひと}つ {450円|よんひゃくごじゅうえん} です。', 'Ba cái bánh ạ. Bánh một cái 450 yên.'],
      ['店員', 'f', '{全部|ぜんぶ} で {1,350円|せんさんびゃくごじゅうえん} です。', 'Tất cả là 1.350 yên ạ.'],
    ]),
    MC('lt-b2-ng-q3', 'Câu hỏi ⑧ ～ ⑨ (8 câu)', [
      Q('⑧ Giá CUỐI CÙNG của chiếc đồng hồ là bao nhiêu?', '{6,800円|ろくせんはっぴゃくえん}', '{8,000円|はっせんえん} | {6,000円|ろくせんえん} | {800円|はっぴゃくえん}', 'Sửa còn 6.800.'),
      Q('⑧ Lúc đầu nhân viên nói giá bao nhiêu?', '{8,000円|はっせんえん}', '{6,800円|ろくせんはっぴゃくえん} | {6,000円|ろくせんえん} | {800円|はっぴゃくえん}', '8.000 rồi sửa.'),
      Q('⑧ 「ろくせんはっぴゃく」 là bao nhiêu?', '6.800', '6.080 | 8.600 | 6.008', 'ろくせん + はっぴゃく.'),
      Q('⑧ Khách quyết định thế nào?', 'Mua đồng hồ', 'Không mua | Mua cặp | Hỏi chỗ khác', 'じゃ、これをください.'),
      Q('⑨ Cuối cùng khách mua mấy cái bánh? (CUỐI)', '3 cái', '2 cái | 1 cái | 5 cái', '三つ (đổi từ 二つ).'),
      Q('⑨ ケーキは{一|ひと}ついくらですか。', '{450円|よんひゃくごじゅうえん}', '{540円|ごひゃくよんじゅうえん} | {1,350円|せんさんびゃくごじゅうえん} | {150円|ひゃくごじゅうえん}', '450円.'),
      Q('⑨ {全部|ぜんぶ}でいくらですか。', '{1,350円|せんさんびゃくごじゅうえん}', '{900円|きゅうひゃくえん} | {1,530円|せんごひゃくさんじゅうえん} | {3,450円|さんぜんよんひゃくごじゅうえん}', '450 × 3 = 1.350.'),
      Q('⑨ 「みっつ」 là mấy cái?', '3', '2 | 4 | 5', 'みっつ = 3.'),
    ]),
  ],
};

/* ───────── 10. NÓI & VIẾT ───────── */

const L2_NOI_VIET: Lesson = {
  id: 'lt-b2-noi-viet',
  kind: 'speaking',
  title: 'Luyện thêm Bài 2 — Nói & viết: 10 câu không tranh · thẻ nhân vật có nước và giá · đọc to · bài viết',
  goal: 'Trả lời trôi chảy các câu hỏi về tầng, vị trí, từ vựng, giá; nói về thẻ nhân vật (đồ của ai, của nước nào, giá bao nhiêu); đọc to đoạn mua sắm và viết đoạn ngắn.',
  minutes: 60,
  blocks: [
    NOTE('Học thế nào', [
      'Khuôn hỏi bám file "Luyện nói" của cô Huyền: **không tranh** (tầng, vị trí, từ trong tiếng Nhật) và **có tranh** (thẻ nhân vật có nước + giá). Câu hỏi và đáp ở đây là viết mới.',
      'Luôn trả lời **câu đầy đủ**: 「{三階|さんがい}です」, không chỉ nói 「{三|さん}」. Câu có か thì mở bằng **はい／いいえ**.',
      'Chưa nghe rõ → 「もう一度お願いします。」 Làm thật: che đáp án, bấm 🎤, nói, nghe lại, so với mẫu.',
    ]),

    H(`${LV.de} — A. 10 câu không tranh (có mẫu trả lời)`),
    TABLE(
      ['#', 'Giám thị hỏi', 'Trả lời mẫu'],
      [
        ['1', JR('としょかん は {何階|なんがい} です か'), JR('{3階|さんがい} です')],
        ['2', JR('としょかん は {3階|さんがい} です か'), JR('はい、 {3階|さんがい} です') + ' / ' + JR('いいえ、 {3階|さんがい} じゃ ありません。 {2階|にかい} です')],
        ['3', JR('トイレ は どこ です か'), JR('あそこ です')],
        ['4', JR('スーパー は {何階|なんがい} です か'), JR('{地下|ちか} {1階|いっかい} です')],
        ['5', JR('「ペン」 は {日本語|にほんご} で {何|なん} です か'), JR('「ペン」 です')],
        ['6', JR('「{本|ほん}」 は {英語|えいご} で {何|なん} です か'), '「book」です (*Book desu.*)'],
        ['7', JR('これ は {何|なん} です か'), JR('それ は {時計|とけい} です')],
        ['8', JR('この かばん は だれ の です か'), JR('{私|わたし} の です')],
        ['9', JR('これ は どこ の ワイン です か'), JR('フランス の ワイン です')],
        ['10', JR('{100円|ひゃくえん}-ショップ は {3階|さんがい} です か'), JR('はい、 {3階|さんがい} です')],
      ],
      'Thay thông tin bằng thực tế của bạn (tầng thư viện trường mình…)',
    ),
    SPEAK('lt-b2-nv-a', [
      'としょかんは なんがいですか。',
      'としょかんは さんがいですか。',
      'トイレは どこですか。',
      'スーパーは なんがいですか。',
      'ペンは にほんごで なんですか。',
      'ほんは えいごで なんですか。',
      'これは なんですか。',
      'この かばんは だれのですか。',
      'これは どこの ワインですか。',
      'ひゃくえんショップは さんがいですか。',
    ]),
    MC('lt-b2-nv-a-mc', 'Chọn câu trả lời đúng cho 6 câu hỏi', [
      Q('「スーパーは{何階|なんがい}ですか。」 (tầng hầm 1)', '{地下|ちか}{1階|いっかい}です。', '{1階|いっかい}です。 | はい、{地下|ちか}です。 | {地下|ちか}ですか。', 'Đáp tầng.'),
      Q('「トイレはどこですか。」', 'あそこです。', '{三百円|さんびゃくえん}です。 | はい、あそこです。 | どこですか。', 'Đáp nơi chốn.'),
      Q('「{100円|ひゃくえん}ショップは{3階|さんがい}ですか。」 (thật ra tầng 2)', 'いいえ、{3階|さんがい}じゃありません。{2階|にかい}です。', 'はい、{2階|にかい}です。 | いいえ、{3階|さんがい}です。 | はい、{3階|さんがい}じゃありません。', 'いいえ + phủ định + đúng.'),
      Q('「ペンは{日本語|にほんご}で{何|なん}ですか。」', '「ペン」です。', 'ペンはあそこです。 | {百円|ひゃくえん}です。 | ペンは{日本|にほん}です。', 'Đáp bằng từ.'),
      Q('「この かばんは だれのですか。」', '{私|わたし}のです。', '{私|わたし}ですか。 | {三千円|さんぜんえん}です。 | あそこです。', 'Đáp chủ.'),
      Q('「これはどこのワインですか。」', 'フランスのワインです。', 'フランスをワインです。 | {三百円|さんびゃくえん}です。 | ワンさんです。', 'Nước の N.'),
    ]),

    H(`${LV.vua} — B. Thẻ nhân vật có tranh (nước và giá)`),
    TABLE(
      ['Thẻ', 'Thông tin trên thẻ'],
      [
        ['Thẻ 1 — ミナさん', 'Người Hàn Quốc · cái cặp · giá 30.000 yên'],
        ['Thẻ 2 — ナタポンさん', 'Người Thái Lan · cái đồng hồ của Đức · giá 28.000 yên'],
        ['Thẻ 3 — リンさん', 'Người Việt Nam · cái máy ảnh của Nhật · giá 35.600 yên'],
      ],
    ),
    DLG('Mẫu trả lời — Thẻ 2', [
      DX('Giám thị', 'examiner', 'この {人|ひと} は どこ の {人|ひと} です か。', 'Người này là người nước nào?'),
      DX('Thí sinh', 'candidate', 'タイ-{人|じん} です。', 'Là người Thái.'),
      DX('Giám thị', 'examiner', 'これ は どこ の {時計|とけい} です か。', 'Đây là đồng hồ của nước nào?'),
      DX('Thí sinh', 'candidate', 'ドイツ の {時計|とけい} です。', 'Là đồng hồ của Đức.'),
      DX('Giám thị', 'examiner', 'いくら です か。', 'Bao nhiêu tiền?'),
      DX('Thí sinh', 'candidate', '{二万八千円|にまんはっせんえん} です。', '28.000 yên.'),
    ]),
    MC('lt-b2-nv-b-mc', 'Dựa vào thẻ, chọn câu trả lời đúng (8 câu)', [
      Q('Thẻ 1: ミナさんのかばんはいくらですか。', '{三万円|さんまんえん}です。', '{三千円|さんぜんえん}です。 | {二万円|にまんえん}です。 | {三百円|さんびゃくえん}です。', '30.000円.'),
      Q('Thẻ 1: ミナさんはどこの{人|ひと}ですか。', '{韓国人|かんこくじん}です。', '{中国人|ちゅうごくじん}です。 | {日本人|にほんじん}です。 | タイ{人|じん}です。', '韓国人.'),
      Q('Thẻ 2: {時計|とけい}はどこのですか。', 'ドイツのです。', 'タイのです。 | フランスのです。 | {日本|にほん}のです。', 'ドイツ.'),
      Q('Thẻ 2: {時計|とけい}はいくらですか。', '{二万八千円|にまんはっせんえん}です。', '{二万円|にまんえん}です。 | {二千八百円|にせんはっぴゃくえん}です。 | {八万円|はちまんえん}です。', '28.000円.'),
      Q('Thẻ 3: リンさんはどこの{人|ひと}ですか。', 'ベトナム{人|じん}です。', '{日本人|にほんじん}です。 | タイ{人|じん}です。 | {韓国人|かんこくじん}です。', 'ベトナム人.'),
      Q('Thẻ 3: カメラはどこのですか。', '{日本|にほん}のです。', 'ベトナムのです。 | ドイツのです。 | フランスのです。', '日本の.'),
      Q('Thẻ 3: カメラはいくらですか。', '{三万五千六百円|さんまんごせんろっぴゃくえん}です。', '{三万五千円|さんまんごせんえん}です。 | {三千五百六十円|さんぜんごひゃくろくじゅうえん}です。 | {三万六千五百円|さんまんろくせんごひゃくえん}です。', '35.600円.'),
      Q('Thẻ 1: これはだれのかばんですか。', 'ミナさんのです。', 'ナタポンさんのです。 | リンさんのです。 | {私|わたし}のです。', 'ミナさんの.'),
    ]),
    SPEAK('lt-b2-nv-b', [
      'このひとは どこの ひとですか。',
      'これは どこの かばんですか。',
      'いくらですか。',
      'これは だれのですか。',
    ]),

    H(`${LV.kho} — C. Đọc to (Reading 40 điểm)`),
    READK('lt-b2-nv-c', 'Đọc to KHÔNG furigana (chuẩn bị 30 giây, rồi đọc một hơi)', 'Tự chấm: ☐ trôi, không ngắt từng chữ ☐ giá đọc đúng biến âm ☐ trợ từ đúng.', [
      RKP([
        ['これ は ^ミナ-さん の かばん です。', 'Đây là cái cặp của Mina.'],
        ['{韓国|かんこく} の かばん です。', 'Là cái cặp của Hàn Quốc.'],
        ['{三万円|さんまんえん} です。', 'Giá 30.000 yên.'],
        ['くつ は {日本|にほん} の です。', 'Đôi giày là của Nhật.'],
        ['{八千円|はっせんえん} です。', 'Giá 8.000 yên.'],
        ['{全部|ぜんぶ} で {三万八千円|さんまんはっせんえん} です。', 'Tất cả là 38.000 yên.'],
      ]),
      RKP([
        ['{四階|よんかい} は カメラ-{屋|や} です。', 'Tầng 4 là cửa hàng máy ảnh.'],
        ['カメラ は {日本|にほん} の です。', 'Máy ảnh là của Nhật.'],
        ['{三万五千六百円|さんまんごせんろっぴゃくえん} です。', 'Giá 35.600 yên.'],
        ['{五階|ごかい} は レストラン です。', 'Tầng 5 là nhà hàng.'],
        ['カレー は {八百円|はっぴゃくえん}、 とんかつ は {千二百円|せんにひゃくえん} です。', 'Cà-ri 800 yên, tonkatsu 1.200 yên.'],
      ]),
    ]),

    H(`${LV.kho} — D. Viết đoạn ngắn: mua đồ ở cửa hàng`),
    NOTE('Khung bài viết (thay bằng thứ bạn muốn)', [
      '① すみません、この ○○ は いくらですか。 ② ○○ は ○○円です。 ③ じゃ、これを ○つ ください。',
      '④ ○○ は 何階ですか。 ⑤ ○階です。 ⑥ どうも ありがとうございます。',
      'Chấm tự kiểm: ☐ có を sau món ☐ 〜つ đọc đúng ☐ giá đọc – viết đúng ☐ これ/この dùng đúng.',
    ]),
    QZ('lt-b2-nv-d', 'Viết lại từng câu (dịch Việt → Nhật)', 'translate', [
      AS('Xin lỗi, cái đồng hồ này bao nhiêu tiền?', 'すみません、この{時計|とけい}はいくらですか'),
      AS('Cái đồng hồ đó 20.000 yên.', ['その{時計|とけい}は{二万円|にまんえん}です', 'それは{二万円|にまんえん}です']),
      AS('Vậy thì cho tôi cái này.', 'じゃ、これをください'),
      AS('Hiệu sách ở tầng mấy?', '{本屋|ほんや}は{何階|なんがい}ですか'),
      AS('Hiệu sách ở tầng 2. Cảm ơn quý khách.', ['{本屋|ほんや}は{2階|にかい}です。どうもありがとうございます', '{本屋|ほんや}は{二階|にかい}です。どうもありがとうございます']),
      AS('Cho tôi hai cà phê và một bánh mì.', 'コーヒーを{二|ふた}つとパンを{一|ひと}つください'),
    ]),

    H(`${LV.kho} — E. Chào khi vào – ra phòng thi`),
    DLG('Vào và ra', [
      DX('Thí sinh', 'candidate', 'しつれい します。', 'Em xin phép (vào ạ).'),
      DX('Giám thị', 'examiner', 'どうぞ。', 'Mời em.'),
      DX('Thí sinh', 'candidate', 'こんにちは。 ^リン です。 どうぞ よろしく お{願|ねが}い します。', 'Em chào thầy/cô. Em là Linh. Mong thầy/cô giúp đỡ ạ.'),
      DX('Giám thị', 'examiner', 'はい、 おわり です。', 'Được rồi, xong rồi.'),
      DX('Thí sinh', 'candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn ạ. Em xin phép ra ạ.'),
    ]),
  ],
};

/* ───────── 11. ĐỀ TỔNG HỢP ───────── */

const R2_DE: [string, string][] = [
  ['ここ は レストラン です。', 'Đây là nhà hàng.'],
  ['カレー は {800円|はっぴゃくえん} です。', 'Cà-ri 800 yên.'],
  ['ハンバーグ は {1,000円|せんえん} です。', 'Hamburg 1.000 yên.'],
  ['ジュース は {300円|さんびゃくえん} です。', 'Nước ép 300 yên.'],
  ['{全部|ぜんぶ} で {2,100円|にせんひゃくえん} です。', 'Tất cả là 2.100 yên.'],
];

const L2_DE: Lesson = {
  id: 'lt-b2-de-tong-hop',
  kind: 'review',
  title: 'Luyện thêm Bài 2 — Đề tổng hợp (45 phút, 100 điểm): từ vựng · chữ Hán · ngữ pháp · nghe · đọc hiểu · dịch',
  goal: 'Làm một đề đủ phần theo khuôn kiểm tra của cô, bấm giờ, tự chấm bằng thang điểm và biết phần nào cần luyện lại.',
  minutes: 45,
  blocks: [
    RECAP('Học thế nào — đọc trước khi làm đề', [
      '**Thời gian: 45 phút.** Bấm giờ thật. Không xem lại bài học, không mở đáp án cho đến khi làm xong cả đề.',
      'Làm theo thứ tự các phần; câu nào bí quá 1 phút thì đánh dấu, làm tiếp, quay lại sau.',
      'Cuối đề có **bảng thang điểm tự chấm** và hướng dẫn luyện lại theo phần yếu. Đề này là viết mới, không phải đề của cô.',
    ]),
    TABLE(
      ['Phần', 'Nội dung', 'Số câu', 'Điểm/câu', 'Tối đa'],
      [
        ['A', 'Từ vựng', '10', '1', '10'],
        ['B', 'Chữ Hán (đọc giá, số)', '10', '1,5', '15'],
        ['C', 'Điền trợ từ', '8', '1', '8'],
        ['D', 'Từ để hỏi', '6', '1', '6'],
        ['E', 'Chọn đáp án đúng', '10', '1', '10'],
        ['F', 'Viết cách đọc (gõ tay)', '4', '2', '8'],
        ['G', 'Nghe (2 đoạn)', '5', '2', '10'],
        ['H', 'Đọc hiểu', '6', '1,5', '9'],
        ['I', 'Dịch Việt → Nhật (gõ tay)', '4', '3', '12'],
        ['J', 'Dịch Nhật → Việt', '4', '3', '12'],
        ['', '**Tổng**', '67', '', '**100**'],
      ],
      'Cấu trúc đề tổng hợp Bài 2',
    ),

    H('Phần A — Từ vựng (10 câu × 1 điểm)'),
    MC('lt-b2-de-a', 'A. Từ vựng', [
      Q('「レジ」の意味は？', 'Quầy thu ngân', 'Thang máy | Nhà vệ sinh | Quầy thông tin', 'レジ.'),
      Q('「{電子辞書|でんしじしょ}」の意味は？', 'Kim từ điển', 'Máy ảnh | Điện thoại | Máy tính', '電子辞書.'),
      Q('「{鶏肉|とりにく}」の意味は？', 'Thịt gà', 'Thịt bò | Thịt lợn | Cá', '鶏肉.'),
      Q('「{地下|ちか}」の意味は？', 'Tầng hầm', 'Tầng thượng | Tầng 1 | Cầu thang', '地下.'),
      Q('「{紅茶|こうちゃ}」の意味は？', 'Trà đen', 'Cà phê | Nước ép | Rượu vang', '紅茶.'),
      Q('Chọn từ KHÁC loại: {牛肉|ぎゅうにく} / {鶏肉|とりにく} / {豚肉|ぶたにく} / {野菜|やさい}', '{野菜|やさい}', '{牛肉|ぎゅうにく} | {鶏肉|とりにく} | {豚肉|ぶたにく}', '3 từ kia là thịt.'),
      Q('「ここ」 chỉ…', 'Chỗ này', 'Chỗ kia | Cái này | Hỏi nơi', 'ここ.'),
      Q('Nhân viên chào khách bước vào:', 'いらっしゃいませ', 'どうぞ | じゃ | こちらこそ', 'いらっしゃいませ.'),
      Q('Hỏi giá tiền:', 'いくらですか', 'いくつですか | どこですか | だれですか', 'いくら.'),
      Q('「{注文|ちゅうもん}をお{願|ねが}いします」 nghĩa là…', 'Cho tôi gọi món', 'Cho tôi thanh toán | Cho tôi hỏi đường | Xin cảm ơn', '注文.'),
    ]),

    H('Phần B — Chữ Hán (10 câu × 1,5 điểm)'),
    MC('lt-b2-de-b', 'B. Chữ Hán: đọc giá và số', [
      Q('「三百円」の読み方は？', 'さんびゃくえん', 'さんひゃくえん | みっつひゃくえん | さんびゃくげん', '三百円.'),
      Q('「六百円」の読み方は？', 'ろっぴゃくえん', 'ろくひゃくえん | ろくびゃくえん | むっぴゃくえん', '六百円.'),
      Q('「八千円」の読み方は？', 'はっせんえん', 'はちせんえん | はっぜんえん | やっせんえん', '八千円.'),
      Q('「一万円」の読み方は？', 'いちまんえん', 'まんえん | ひとまんえん | いちばんえん', '一万円.'),
      Q('「三階」の読み方は？', 'さんがい', 'さんかい | みっかい | さんがく', '三階.'),
      Q('「にひゃくえん」を漢字で かくと？', '二百円', '二白円 | 三百円 | 二百用', '二百円.'),
      Q('「ごせんえん」を漢字で かくと？', '五千円', '五干円 | 立千円 | 五千用', '五千円.'),
      Q('「よんまんえん」を漢字で かくと？', '四万円', '四方円 | 田万円 | 四万用', '四万円.'),
      Q('「ななひゃくえん」を漢字で かくと？', '七百円', '土百円 | 七白円 | 十百円', '七百円.'),
      Q('「きゅうせんえん」を漢字で かくと？', '九千円', '力千円 | 九干円 | 八千円', '九千円.'),
    ]),

    H('Phần C — Điền trợ từ (8 câu × 1 điểm)'),
    MC('lt-b2-de-c', 'C. Trợ từ', [
      Q('トイレ＿＿どこですか。', 'は', 'を | の | と', 'N は どこ.'),
      Q('コーヒー＿＿{二|ふた}つください。', 'を', 'は | の | が', 'N を 〜つ ください.'),
      Q('これはフランス＿＿ワインです。', 'の', 'は | を | で', 'N の N.'),
      Q('パンを{一|ひと}つ＿＿{卵|たまご}を{二|ふた}つください。', 'と', 'も | の | は', 'と.'),
      Q('「ペンは{日本語|にほんご}＿＿{何|なん}ですか。」', 'で', 'を | の | は', '〜語で.'),
      Q('この{本|ほん}は{誰|だれ}＿＿ですか。', 'の', 'を | で | は', 'だれの.'),
      Q('{全部|ぜんぶ}＿＿{千円|せんえん}です。', 'で', 'を | の | が', '全部で.'),
      Q('この{時計|とけい}＿＿{三万円|さんまんえん}です。', 'は', 'を | と | の', 'N は 〜円.'),
    ]),

    H('Phần D — Từ để hỏi (6 câu × 1 điểm)'),
    MC('lt-b2-de-d', 'D. Chọn từ để hỏi', [
      Q('トイレは＿＿＿ですか。 → あそこです。', 'どこ', 'いくら | だれ | {何|なん}', 'どこ.'),
      Q('この ケーキは＿＿＿ですか。 → {450円|よんひゃくごじゅうえん}です。', 'いくら', 'どこ | だれ | {何|なん}', 'いくら.'),
      Q('これは＿＿＿ですか。 → {時計|とけい}です。', '{何|なん}', 'どこ | いくら | だれ', '何.'),
      Q('この かばんは＿＿＿のですか。 → ワンさんのです。', 'だれ', 'どこ | いくら | {何|なん}', 'だれの.'),
      Q('これは＿＿＿ワインですか。 → フランスのワインです。', 'どこの', '{何|なん}の | だれの | いくらの', 'どこの.'),
      Q('{本屋|ほんや}は＿＿＿ですか。 → {2階|にかい}です。', '{何階|なんがい}', 'いくら | だれ | どこ階', '何階.'),
    ]),

    H('Phần E — Chọn đáp án đúng (10 câu × 1 điểm)'),
    MC('lt-b2-de-e', 'E. Chọn đáp án', [
      Q('＿＿＿は ペンです。 (cái này)', 'これ', 'この | ここ | どこ', 'Không danh từ → これ.'),
      Q('＿＿＿ かばんは {私|わたし}のです。 (cái cặp kia)', 'あの', 'あれ | あそこ | これ', 'あの + N.'),
      Q('3階 đọc là…', 'さんがい', 'さんかい | みっかい | さんがく', '3階.'),
      Q('3つ đọc là…', 'みっつ', 'さんつ | みつ | さんっつ', '3つ.'),
      Q('600円 đọc là…', 'ろっぴゃくえん', 'ろくひゃくえん | ろくびゃくえん | むっぴゃくえん', '600.'),
      Q('10,000円 đọc là…', 'いちまんえん', 'まんえん | じゅうせんえん | いちせんえん', '10.000.'),
      Q('Câu nào ĐÚNG?', 'ケーキを{二|ふた}つください。', 'ケーキは{二|ふた}つください。 | ケーキを{二|ふた}つをください。 | {二|ふた}つケーキをください。', 'N を 〜つ ください.'),
      Q('Câu nào SAI?', 'これは{何|なん}料理ですか。', 'これは{何|なん}の{料理|りょうり}ですか。 | これはどこのワインですか。 | この{本|ほん}はだれのですか。', 'Thiếu の.'),
      Q('スーパーは {地下|ちか}＿＿＿です。 (tầng 1)', '{1階|いっかい}', '{1階|いちかい} | {1階|ひとかい} | {1階|いちがい}', 'いっかい.'),
      Q('「じゃ」 dùng khi…', 'Chốt quyết định (vậy thì)', 'Chào lần đầu | Xin lỗi | Cảm ơn', 'じゃ.'),
    ]),

    H('Phần F — Viết cách đọc bằng hiragana (4 câu × 2 điểm)'),
    QZ('lt-b2-de-f', 'F. Gõ cách đọc', 'fill', [
      A('300円', 'さんびゃくえん'),
      A('8,000円', 'はっせんえん'),
      A('23,000円', 'にまんさんぜんえん'),
      A('4階', 'よんかい'),
    ]),

    H('Phần G — Nghe (2 đoạn, 5 câu × 2 điểm)'),
    LN('lt-b2-de-ng1', 'Đoạn 1', [
      ['客', 'f', 'すみません。 レジ は どこ です か。', 'Xin lỗi. Quầy thu ngân ở đâu ạ?'],
      ['店員', 'm', 'レジ は {地下|ちか} {1階|いっかい} です。 あちら です。', 'Quầy thu ngân ở tầng hầm 1. Ở phía kia ạ.'],
      ['客', 'f', 'どうも ありがとう ございます。', 'Xin cảm ơn.'],
    ]),
    LN('lt-b2-de-ng2', 'Đoạn 2', [
      ['客', 'm', 'この {時計|とけい} は いくら です か。', 'Chiếc đồng hồ này bao nhiêu ạ?'],
      ['店員', 'f', '{23,000円|にまんさんぜんえん} です。', '23.000 yên ạ.'],
      ['客', 'm', 'じゃ、 これ を ください。', 'Vậy cho tôi cái này.'],
    ]),
    MC('lt-b2-de-g', 'G. Câu hỏi nghe', [
      Q('Đoạn 1: レジは{何階|なんがい}ですか。', '{地下|ちか}{1階|いっかい}', '{1階|いっかい} | {2階|にかい} | {3階|さんがい}', '地下1階.'),
      Q('Đoạn 1: レジはどちらですか。', 'あちら', 'こちら | そちら | どちら', 'あちら.'),
      Q('Đoạn 2: {時計|とけい}はいくらですか。', '{23,000円|にまんさんぜんえん}', '{3,000円|さんぜんえん} | {32,000円|さんまんにせんえん} | {2,300円|にせんさんびゃくえん}', '23.000.'),
      Q('Đoạn 2: Khách quyết định thế nào?', 'Mua đồng hồ', 'Không mua | Hỏi đường | Đổi tiền', 'これをください.'),
      Q('Đoạn 2: 「にまんさんぜん」 là bao nhiêu?', '23.000', '2.300 | 32.000 | 20.003', 'にまん + さんぜん.'),
    ]),

    H('Phần H — Đọc hiểu (6 câu × 1,5 điểm)'),
    ...PSG('レストラン', R2_DE),
    MC('lt-b2-de-h', 'H. Câu hỏi đọc hiểu', [
      Q('カレーはいくらですか。', '{800円|はっぴゃくえん}', '{600円|ろっぴゃくえん} | {1,000円|せんえん} | {80円|はちじゅうえん}', '800円.'),
      Q('ハンバーグはいくらですか。', '{1,000円|せんえん}', '{800円|はっぴゃくえん} | {100円|ひゃくえん} | {1,200円|せんにひゃくえん}', '1.000円.'),
      Q('ジュースはいくらですか。', '{300円|さんびゃくえん}', '{30円|さんじゅうえん} | {400円|よんひゃくえん} | {3,000円|さんぜんえん}', '300円.'),
      Q('{全部|ぜんぶ}でいくらですか。', '{2,100円|にせんひゃくえん}', '{1,800円|せんはっぴゃくえん} | {2,000円|にせんえん} | {2,200円|にせんにひゃくえん}', '800 + 1.000 + 300 = 2.100.'),
      TF('ここはレストランです。', 'Đúng', 'Dòng đầu.'),
      TF('コーヒーは{400円|よんひゃくえん}です。', 'Không có trong bài', 'Không nhắc コーヒー.'),
    ]),

    H('Phần I — Dịch Việt → Nhật (4 câu × 3 điểm)'),
    QZ('lt-b2-de-i', 'I. Gõ câu tiếng Nhật', 'translate', [
      AS('Nhà vệ sinh ở đâu?', 'トイレはどこですか'),
      AS('Cái bánh này bao nhiêu tiền?', 'このケーキはいくらですか'),
      AS('Cho tôi hai cà phê.', 'コーヒーを{二|ふた}つください'),
      AS('"Pen" tiếng Nhật là gì?', '「ペン」は{日本語|にほんご}で{何|なん}ですか'),
    ]),

    H('Phần J — Dịch Nhật → Việt (4 câu × 3 điểm)'),
    MC('lt-b2-de-j', 'J. Chọn nghĩa tiếng Việt đúng', [
      Q('{本屋|ほんや}は{2階|にかい}です。', 'Hiệu sách ở tầng 2.', 'Hiệu sách có 2 cái. | Hiệu sách giá 2 yên. | Hiệu sách ở tầng 3.', '2階.'),
      Q('これはフランスのワインです。', 'Đây là rượu vang Pháp.', 'Đây là rượu vang của tôi. | Pháp là rượu vang. | Rượu vang ở Pháp.', 'N の N.'),
      Q('この{本|ほん}はだれのですか。', 'Quyển sách này là của ai?', 'Quyển sách này bao nhiêu tiền? | Quyển sách này ở đâu? | Quyển sách này là gì?', 'だれの.'),
      Q('じゃ、これをください。', 'Vậy thì cho tôi cái này.', 'Cảm ơn quý khách. | Xin mời. | Chào mừng quý khách.', 'じゃ…ください.'),
    ]),

    H('Bảng thang điểm tự chấm'),
    TABLE(
      ['Phần', 'Điểm tối đa', 'Điểm của bạn', 'Nếu dưới 70% thì luyện lại'],
      [
        ['A. Từ vựng', '10', '', '`lt-b2-tu-vung`'],
        ['B. Chữ Hán', '15', '', '`lt-b2-chu-han`'],
        ['C. Trợ từ', '8', '', '`lt-b2-ngu-phap-1/2/3`'],
        ['D. Từ để hỏi', '6', '', '`lt-b2-ngu-phap-3`'],
        ['E. Chọn đáp án', '10', '', '`lt-b2-ngu-phap-tron`'],
        ['F. Cách đọc', '8', '', '`lt-b2-ngu-phap-2` (số, giá)'],
        ['G. Nghe', '10', '', '`lt-b2-nghe`'],
        ['H. Đọc hiểu', '9', '', '`lt-b2-doc-hieu`'],
        ['I. Dịch Việt → Nhật', '12', '', '`lt-b2-ngu-phap-tron`'],
        ['J. Dịch Nhật → Việt', '12', '', '`lt-b2-hoi-thoai`'],
      ],
    ),
    NOTE('Đánh giá', [
      '**85–100**: rất vững. Chỉ cần ôn nói và đọc to.',
      '**70–84**: khá. Luyện lại các phần dưới 70%.',
      '**50–69**: cần làm lại các lesson ngữ pháp và từ vựng trước khi thi.',
      '**Dưới 50**: quay về 6 buổi `s113-b2-…`, rồi làm lại từ mức Dễ.',
    ]),
  ],
};

export const LT_B2: Lesson[] = [L2_LO_TRINH, L2_TU_VUNG, L2_CHU_HAN, L2_NP1, L2_NP2, L2_NP3, L2_TRON, L2_HOI_THOAI, L2_DOC_HIEU, L2_NGHE, L2_NOI_VIET, L2_DE];
