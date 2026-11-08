/**
 * 📝 THI THỬ JPD113 (Nhật 1 · Bài 1–3) — 3 đề trọn vẹn + chiến lược + bảng tự chấm.
 *
 *   THI_THU_113: Lesson[] — `b3-thi-thu-113-de-1` … `-de-3`, `b3-thi-thu-113-chien-luoc`, `b3-thi-thu-113-tu-cham`.
 *
 * KHUÔN ĐỀ THẬT dùng ở đây (đối chiếu, không chép câu nào):
 *  ① THI NÓI (PE) — "Hướng dẫn ôn tập thi nói môn JPD113" bản 09/06/2025 (cô gửi gv + sv):
 *     vấn đáp 1–1, 5–7 phút (kể cả chấm), giám thị ghi âm.
 *     READING 40 (đoạn 100–110 ký tự · 4 từ chữ Hán gạch chân 12đ · 4 từ katakana 12đ · 70–80 chữ hiragana 16đ,
 *     sai 1 ký tự −0,2 · chuẩn bị 30 giây) · TALKING 55 (3 câu có tranh × 15đ + 1 câu không tranh × 10đ;
 *     lỗi làm hiểu sai cả câu → mất hết điểm câu; lỗi không đổi nghĩa (quên はい／いいえ) → trừ tối đa 5;
 *     đúng ngữ pháp nhưng sai từ vựng → tối đa 3 điểm; sai trợ từ −2; lưu loát + phát âm 2đ/câu) ·
 *     PRESENTING 5 (chào bằng tiếng Nhật khi vào và trước khi rời phòng). Được xin nhắc lại câu hỏi tối đa 2 lần,
 *     không bị trừ; không được đổi câu hỏi / bài đọc; ngập ngừng trừ không quá 5% mỗi đầu điểm.
 *     Tranh mẫu của cô: thẻ người + tuổi (何才ですか / 20才ですか), nhà hàng (ご注文、どうぞ), nơi chốn (ここで何をしますか /
 *     日曜日、どこへいきますか); câu không tranh lấy trong ngân hàng 22 câu (tech-trends/on-thi-jpd113/data/speaking.ts).
 *  ② TRẮC NGHIỆM FE — 14 đề FE thật trong Phòng thi (content/exams/JPD113.mjs): 30 câu, 45 phút, 10 điểm, đạt ≥ 4;
 *     dạng câu (đếm trên 420 câu): đọc chữ Hán trong【】~11% · chọn chữ Hán cho từ trong【】~11% · điền chỗ trống
 *     (trợ từ, từ hỏi, chỉ thị, câu đáp hội thoại, động từ, từ vựng) phần lớn · sắp xếp câu · từ khác loại · nghĩa tiếng Việt.
 *     Đề FE KHÔNG có phần nghe, KHÔNG có đọc hiểu đoạn dài — nên đề thử ở đây cũng không thêm hai phần đó; phần "nghe"
 *     duy nhất của kỳ thi là nghe câu hỏi của giám thị ở phần Talking (khối `listen`).
 *
 * Mọi câu, đoạn đọc, tranh (mô tả bằng lời + hình Fluent Emoji) đều VIẾT MỚI; nhân vật lấy theo bảng nhân vật của khoá
 * (bai1.ts). Điểm "ước tính" trong bảng chấm mẫu là mình áp đúng các luật trừ điểm ở trên vào từng câu trả lời ví dụ —
 * giám thị thật có thể chấm lệch một chút.
 */
import type { Block, Lesson, Role } from '@/components/sach-hoc/types';

/* ══════════════ romaji tự động từ kana (cùng luật jp113B3.ts) ══════════════ */

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
    const PUN: Record<string, string> = { '。': '.', '、': ',', '？': '?', '！': '!', '…': '...', '「': '"', '」': '"', '〜': '~', '～': '~', '：': ':' };
    if (PUN[c] !== undefined) { out += PUN[c]; continue; }
    if (/[ぁぃぅぇぉ]/.test(c)) continue;
    if (/[（）()・\s]/.test(c)) continue;
    out += c;
  }
  return out;
}
const reading = (t: string) => t.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2');

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
/** Chữ Nhật (bỏ dấu cách của DSL, giữ furigana). */
const J = (s: string): string => toks(s).map((t) => tok(t)[0]).join('');
/** Romaji, viết hoa đầu câu. */
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
/** Bỏ furigana: {漢字|かな} → 漢字. */
const bare = (s: string) => s.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');

/* ══════════════ khối ══════════════ */

const H = (text: string): Block => ({ t: 'h', text });
const P = (text: string): Block => ({ t: 'p', text });
const NOTE = (title: string, items: string[]): Block => ({ t: 'note', title, items });
const TABLE = (head: string[], rows: string[][], caption?: string): Block => ({ t: 'table', head, rows, caption });
const RECAP = (title: string, items: string[]): Block => ({ t: 'recap', title, items });
/** Ô bảng: chữ Nhật (furigana) + (romaji). */
const JR = (s: string): string => `${J(s)} (${R(s)})`;

/** Trắc nghiệm: `bad` = các đáp án sai cách nhau " | "; vị trí đáp án đúng do băm chữ của câu quyết định
 *  (cố định giữa các lần dựng, nhưng không lặp theo chu kỳ để người làm đoán được). */
const Q = (q: string, ok: string, bad: string, why: string) => {
  const b = bad.split(' | ');
  let h = 7;
  for (const ch of q + ok) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const pos = h % (b.length + 1);
  const options = [...b];
  options.splice(pos, 0, ok);
  return { q, options, correct: pos, why };
};
/** Hoán vị 4 vị trí — mỗi nhóm 4 câu liên tiếp dùng một hoán vị (băm theo id + số nhóm) ⇒ A/B/C/D chia đều, khó đoán. */
const HOAN_VI = [[0, 1, 2, 3], [2, 0, 3, 1], [1, 3, 0, 2], [3, 2, 1, 0], [1, 0, 3, 2], [2, 3, 0, 1], [0, 3, 1, 2], [3, 1, 2, 0]];
const MC = (id: string, title: string, items: ReturnType<typeof Q>[]): Block => ({
  t: 'mcq', id, title,
  items: items.map((it, i) => {
    if (it.options.length !== 4) return it;
    let h = 11;
    for (const ch of id + Math.floor(i / 4)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const pos = HOAN_VI[h % HOAN_VI.length][i % 4];
    const ok = it.options[it.correct];
    const options = it.options.filter((_, k) => k !== it.correct);
    options.splice(pos, 0, ok);
    return { ...it, options, correct: pos };
  }),
});

/* ══════════════ đoạn đọc + bộ đếm ký tự ══════════════ */

/** Một đoạn đọc kiểu đề. `cau` = [câu DSL, nghĩa Việt]; `vai` (hội thoại) = nhãn người nói theo từng câu. */
type Doan = { ten: string; dang: string; cau: [string, string][]; vai?: string[]; meo: string[] };

/** Đếm đúng như cách tính độ dài đề: từ chữ Hán (mỗi nhóm {漢字|かな} = 1 từ), từ katakana, chữ hiragana. */
function dem(d: Doan) {
  const ja = d.cau.map(([s]) => J(s)).join('');
  const nhom = [...ja.matchAll(/\{([^|}]+)\|([^}]+)\}/g)].map((m) => [m[1], m[2]] as [string, string]);
  const han: [string, string][] = [];
  for (const g of nhom) if (!han.some((h) => h[0] === g[0])) han.push(g);
  const tran = bare(ja);
  const kataAll = tran.match(/[ァ-ヶー]+/g) ?? [];
  const kata = [...new Set(kataAll)];
  const chuHan = nhom.reduce((a, [k]) => a + k.length, 0);
  const chuKata = kataAll.join('').length;
  const hira = (tran.match(/[ぁ-ゖ]/g) ?? []).length;
  return { han, kata, chuHan, chuKata, hira, tong: chuHan + chuKata + hira };
}

/** Câu có nhãn vai (hội thoại) cho bản đọc trọn đoạn. */
const cauVai = (d: Doan, i: number, s: string) => (d.vai ? `${d.vai[i]}：${s}` : s);

/* ══════════════ khối riêng của đề thi thử ══════════════ */

const docTron = (d: Doan) => ({
  text: d.cau.map(([s], i) => cauVai(d, i, J(s))).join(''),
  ro: d.cau.map(([s], i) => (d.vai ? `${d.vai[i]}: ${R(s)}` : R(s))).join(' '),
  vi: d.cau.map(([, v]) => v).join(' '),
});

type Vai = 'examiner' | 'candidate';
/** Dòng hội thoại giám thị ↔ thí sinh. */
const DX = (role: Vai, s: string, vi: string) => ({ who: role === 'examiner' ? 'Giám thị' : 'Bạn', role: role as Role, text: J(s), ro: R(s), vi });
const DLG = (title: string, lines: ReturnType<typeof DX>[]): Block => ({ t: 'dialogue', title, lines });

/** Một câu hỏi phần Talking (có tranh hoặc không tranh). */
type Tranh = {
  ten: string;
  /** Lesson của đề mẫu mà câu này thuộc về. */
  lesson: string;
  anh?: string[];
  canh?: string;
  /** Nội dung tranh nói bằng lời: [mục, nội dung]. */
  the?: string[][];
  hoi: [string, string];
  /** Câu trả lời mẫu điểm cao (DSL, nghĩa). */
  mau: [string, string][];
  /** Bảng chấm mẫu: [câu trả lời DSL, điểm ước tính, vì sao]. */
  cham: [string, string, string][];
  meo: string;
};
type De = {
  so: number;
  ten: string;
  doc: Doan;
  vao: [Vai, string, string][];
  ra: [Vai, string, string][];
  tranh: [Tranh, Tranh, Tranh];
  khong: Tranh;
  fe: ReturnType<typeof Q>[];
};

const BANG_GIAM_KHAO: Block = TABLE(
  ['Phần', 'Tối đa', 'Giám thị chấm gì', 'Bị trừ khi'],
  [
    ['PRESENTING', '**5**', 'Chào bằng tiếng Nhật khi **vào** và **trước khi rời** phòng; tác phong, thái độ', 'Vào/ra không chào; chào bằng tiếng Việt'],
    ['READING', '**40**', '4 từ chữ Hán gạch chân (12) · 4 từ katakana (12) · 70–80 chữ hiragana (16)', 'Mỗi ký tự đọc sai **−0,2**; ngập ngừng trừ ≤ 5% mỗi đầu điểm'],
    ['TALKING — 3 câu có tranh', '**15 × 3**', 'Hiểu câu hỏi + trả lời đúng thông tin trên tranh; **lưu loát, phát âm: 2 điểm mỗi câu**', 'Xem 4 luật trừ ngay dưới'],
    ['TALKING — 1 câu không tranh', '**10**', 'Trả lời câu hỏi cá nhân bằng thông tin của bạn; lưu loát, phát âm 2 điểm', 'Như trên'],
  ],
  'Phiếu chấm thi nói JPD113 — 100 điểm (hướng dẫn 09/06/2025)',
);
const LUAT_TRU: Block = NOTE('4 luật trừ điểm phần Talking (nguyên văn ý của hướng dẫn)', [
  '**Lỗi làm hiểu sai toàn bộ nội dung** (sai thông tin, trả lời câu khác, nói ngược nghĩa) → **mất toàn bộ điểm câu đó**.',
  '**Lỗi không làm đổi cách hiểu câu** (vd. câu Có/Không mà quên **はい／いいえ**) → **trừ tối đa 5 điểm**.',
  '**Đúng ngữ pháp, hiểu câu hỏi nhưng dùng SAI TỪ VỰNG** để trả lời → **tối đa chỉ được 3 điểm**.',
  '**Sai trợ từ → trừ 2 điểm** (mỗi lần). Được xin **nhắc lại câu hỏi tối đa 2 lần, không bị trừ** (nói 「もう一度お願いします」 hoặc tiếng Việt đều được).',
]);

function deThi(d: De): Lesson {
  const c = dem(d.doc);
  const giua = Math.ceil(d.doc.cau.length / 2);
  const nua = (a: [string, string][], ten: string) => ({ text: a.map(([s]) => J(s)).join(''), ipa: R(a.map(([s]) => s).join(' ')), vi: `${ten} — đọc liền như lúc thi.` });
  const cau4 = [...d.tranh, d.khong];
  const p = `tt113-d${d.so}`;
  return {
    id: `b3-thi-thu-113-de-${d.so}`,
    kind: 'review',
    title: `📝 Đề thi thử JPD113 số ${d.so} — ${d.ten}: thi nói 100 điểm (5–7 phút) + trắc nghiệm FE 30 câu (45 phút)`,
    goal: `Làm trọn một đề như thi thật — chào hỏi, đọc to đoạn 100–110 ký tự, trả lời 3 câu có tranh + 1 câu không tranh, rồi 30 câu FE trong 45 phút — sau đó tự chấm bằng đúng phiếu điểm của giám thị.`,
    minutes: 60,
    blocks: [
      RECAP(`Đề số ${d.so} có gì (cấu trúc như đề thật)`, [
        '**PHẦN 1 — Thi nói (PE), vấn đáp 1–1 khoảng 5–7 phút:** Presenting 5 · Reading 40 (chuẩn bị 30 giây) · Talking 55 = 3 câu có tranh × 15 + 1 câu không tranh × 10.',
        '**PHẦN 2 — Trắc nghiệm FE: 30 câu, 45 phút, 10 điểm (mỗi câu = 1/3 điểm), đạt khi ≥ 4 điểm (12 câu đúng).** Dạng câu đúng tỉ lệ 14 đề FE thật: câu 1–4 đọc chữ Hán, 5–8 chọn chữ Hán, 9–26 điền chỗ trống (trợ từ · từ hỏi · chỉ thị · câu đáp · động từ · từ vựng), 27 sắp xếp câu, 28–29 từ khác loại, 30 nghĩa tiếng Việt.',
        '**Đáp án + bảng chấm nằm SAU phần làm bài** — đừng kéo xuống trước khi làm xong.',
      ]),
      NOTE('Làm đề như thi thật', [
        'Thi nói: nhờ một người đọc câu hỏi giúp (hoặc bấm nghe ở khối 🎧), **không nhìn chữ** câu hỏi. Bấm giờ: 30 giây chuẩn bị bài đọc. Ghi âm cả buổi bằng điện thoại từ lúc gõ cửa đến lúc chào ra.',
        'FE: bấm 45 phút, làm hết 30 câu rồi mới bấm kiểm tra. Câu không chắc vẫn phải chọn — đề FE không trừ điểm câu sai.',
        'Xong: chấm Reading theo −0,2/ký tự, Talking theo phiếu bên dưới, FE theo số câu đúng; ghi vào **Bảng tự chấm** (`b3-thi-thu-113-tu-cham`).',
      ]),

      H(`PHẦN 1 — THI NÓI (100 điểm)`),
      BANG_GIAM_KHAO,
      LUAT_TRU,
      H('① Vào phòng — Presenting (5 điểm)'),
      DLG('Vào phòng thi', d.vao.map(([r, s, v]) => DX(r, s, v))),

      H('② READING (40 điểm) — nhìn 30 giây rồi đọc to, không dừng'),
      P(`Giám thị đưa tờ đề, **4 từ chữ Hán gạch chân không có furigana**. Đây là bài **${d.doc.ten}**. Bấm giờ 30 giây, đọc to MỘT lượt, xong mới bấm hiện cách đọc.`),
      { t: 'readkanji', id: `${p}-doc`, title: 'Tờ đề Reading (chữ trần như đề thật)', note: d.doc.vai ? 'Hội thoại: đọc cả hai vai, không đọc nhãn A：/B：.' : undefined, items: [docTron(d.doc)] },
      TABLE(
        ['Phần chấm', 'Trong bài này', 'Điểm'],
        [
          ['4 từ chữ Hán gạch chân', c.han.map(([w, y]) => `${w} → ${y}`).join(' · '), '12'],
          ['4 từ katakana', c.kata.join(' · '), '12'],
          ['Hiragana', `${c.hira} chữ (−0,2 mỗi chữ sai)`, '16'],
          ['Độ dài', `${c.tong} ký tự = ${c.chuHan} Hán + ${c.chuKata} katakana + ${c.hira} hiragana (không tính dấu câu)`, '40'],
        ],
        'Xem SAU khi đọc xong',
      ),
      NOTE('Chỗ dễ mất điểm trong bài đọc này', d.doc.meo),
      {
        t: 'phatam',
        id: `${p}-doc-cham`,
        title: 'Máy chấm phát âm bài đọc — từng câu + hai nửa bài',
        note: 'Đọc lại từng câu cho máy chấm; từ bị tô đỏ là chỗ giám thị sẽ trừ 0,2/ký tự. Mỗi lượt chấm tối đa 20 giây nên bài chia hai nửa.',
        items: [
          ...d.doc.cau.map(([s, vi], i) => ({ text: J(s), ipa: R(s), vi: d.doc.vai ? `${d.doc.vai[i]}: ${vi}` : vi })),
          nua(d.doc.cau.slice(0, giua), 'Nửa đầu bài'),
          nua(d.doc.cau.slice(giua), 'Nửa sau bài'),
        ],
      },

      H('③ TALKING (55 điểm) — nhìn tranh, nghe câu hỏi, trả lời trọn câu'),
      P('Mỗi tranh giám thị hỏi **một** câu. Dưới đây là nội dung từng tranh (tả bằng lời + hình minh hoạ). Nghe câu hỏi ở khối 🎧 (đừng mở lời thoại), rồi trả lời vào khối 🎤.'),
      ...d.tranh.flatMap((t, i): Block[] => [
        H(`Tranh ${i + 1} — ${t.ten} (${t.lesson} · 15 điểm)`),
        ...(t.anh?.length ? [{ t: 'canh', anh: t.anh, caption: t.canh ?? t.ten } as Block] : []),
        ...(t.the?.length ? [TABLE(['Trên tranh', 'Nội dung'], t.the)] : []),
      ]),
      H(`Câu 4 — câu hỏi không tranh (${d.khong.lesson} · 10 điểm)`),
      P('Không có tranh: giám thị hỏi một câu về bạn. Trả lời bằng **thông tin thật** của bạn.'),
      {
        t: 'listen',
        id: `${p}-nghe`,
        title: 'Nghe 4 câu hỏi của giám thị (như trong phòng thi)',
        note: 'Nghe tối đa 3 lần cho mỗi câu (thi thật: được xin nhắc lại 2 lần không bị trừ). Bắt **từ để hỏi** trước: なんさい / なに / どこ / いつ / いくら / なんじ / ですか (Có/Không).',
        lines: cau4.map((t, i) => ({ who: `Giám thị — câu ${i + 1}`, voice: 'ja-nu' as const, text: J(t.hoi[0]), ro: R(t.hoi[0]), vi: t.hoi[1] })),
      },
      { t: 'speak', id: `${p}-noi`, part: '1', questions: cau4.map((t) => bare(J(t.hoi[0]))) },
      H('④ Ra phòng — Presenting'),
      DLG('Trước khi rời phòng', d.ra.map(([r, s, v]) => DX(r, s, v))),

      H(`ĐÁP ÁN PHẦN NÓI — câu trả lời mẫu điểm cao + giám thị chấm thế nào`),
      P('Điểm trong các bảng là **ước tính** bằng cách áp 4 luật trừ điểm của hướng dẫn vào từng câu trả lời ví dụ. Mẫu điểm cao luôn: **trả lời trọn câu · đúng trợ từ · có はい／いいえ khi câu hỏi là Có/Không**.'),
      ...cau4.flatMap((t, i): Block[] => [
        H(`Câu ${i + 1} — ${t.ten}`),
        DLG(`Mẫu điểm cao — câu ${i + 1}`, [DX('examiner', t.hoi[0], t.hoi[1]), ...t.mau.map(([s, v]) => DX('candidate', s, v))]),
        TABLE(['Thí sinh trả lời', `Điểm (ước tính / ${i < 3 ? 15 : 10})`, 'Vì sao — theo bảng chấm'], t.cham.map(([s, dm, v]) => [JR(s), dm, v])),
        NOTE('Mẹo', [t.meo]),
      ]),
      {
        t: 'phatam',
        id: `${p}-mau`,
        title: 'Nói lại các câu trả lời mẫu — máy chấm phát âm',
        note: 'Đổi tên/số thành của bạn ở câu 4 khi luyện thật; ở đây đọc đúng mẫu để máy chấm phát âm.',
        items: cau4.flatMap((t) => t.mau.map(([s, vi]) => ({ text: J(s), ipa: R(s), vi }))),
      },

      H('PHẦN 2 — TRẮC NGHIỆM FE (30 câu · 45 phút · 10 điểm · đạt ≥ 4)'),
      NOTE('Cách làm', [
        'Câu 1–4: chữ Hán trong【 】đọc thế nào · Câu 5–8: từ trong【 】viết bằng chữ Hán nào · Câu 9–26: chọn đáp án điền vào（　）· Câu 27: chọn câu sắp xếp đúng · Câu 28–29: từ khác loại · Câu 30: nghĩa tiếng Việt.',
        'Đề FE thật không có furigana — ở đây cũng vậy. Bí thì loại trừ: đáp án đọc "quên biến âm" (はちふん, ろくひゃく) và chữ Hán "giống mặt" (目/日, 入/人, 干/千, 牛/午, 問/間) gần như luôn sai.',
      ]),
      MC(`${p}-fe`, `FE — Đề số ${d.so} (30 câu, 45 phút)`, d.fe),
      TABLE(
        ['Số câu đúng (/30)', 'Điểm FE (/10)', 'Kết luận'],
        [
          ['30 · 29 · 28 · 27', '10 · 9,7 · 9,3 · 9', '✅ Mục tiêu 9–10'],
          ['26 – 24', '8,7 – 8', 'Tốt — xem lại dạng sai'],
          ['23 – 18', '7,7 – 6', 'Qua chắc nhưng còn lỗ hổng'],
          ['17 – 12', '5,7 – 4', '⚠️ Vừa đủ đạt (≥ 4) — rất rủi ro'],
          ['≤ 11', '≤ 3,7', '❌ Trượt FE — quay lại Bảng tự chấm'],
        ],
        'Quy đổi: điểm = số câu đúng ÷ 3',
      ),
      NOTE('Sau khi làm xong', [
        'Mở **Bảng tự chấm & sai phần nào ôn bài nào** (`b3-thi-thu-113-tu-cham`): ghi điểm 3 phần, xem câu sai thuộc dạng nào → học đúng bài đó.',
        'Đọc **Chiến lược thi & lỗi mất điểm** (`b3-thi-thu-113-chien-luoc`) trước khi làm đề tiếp theo.',
      ]),
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════════
 *                              ĐỀ SỐ 1
 * ═══════════════════════════════════════════════════════════════════ */

const DE_1: De = {
  so: 1,
  ten: 'tự giới thiệu · nhà hàng · giờ mở cửa',
  vao: [
    ['candidate', 'しつれい します。', '(Gõ cửa, mở cửa) Xin phép ạ.'],
    ['examiner', 'どうぞ。', 'Mời vào.'],
    ['candidate', 'おはよう ございます。 ^グエン です。 よろしく おねがい します。', 'Em chào cô ạ. Em là Nguyễn. Mong cô giúp đỡ.'],
    ['examiner', 'はい。 では、 はじめ ましょう。', 'Được. Vậy chúng ta bắt đầu nhé.'],
  ],
  ra: [
    ['examiner', 'はい、 おわり です。', 'Xong rồi.'],
    ['candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn cô ạ. Em xin phép.'],
  ],
  doc: {
    ten: 'Một ngày của Nguyễn',
    dang: '',
    cau: [
      ['{私|わたし} は ^グエン です。', 'Tôi là Nguyễn.'],
      ['^ベトナム-じん です。 ^ホーチミン の だいがく の がくせい です。', 'Tôi là người Việt Nam, sinh viên một trường đại học ở TP. Hồ Chí Minh.'],
      ['まいあさ {六時|ろくじ} に おきます。 あさごはん は パン です。', 'Sáng nào tôi cũng dậy lúc 6 giờ. Bữa sáng là bánh mì.'],
      ['はちじ から {十二時|じゅうにじ} まで {日本語|にほんご} を べんきょう します。', 'Tôi học tiếng Nhật từ 8 giờ đến 12 giờ.'],
      ['ごご は としょかん で ほん を よみます。', 'Buổi chiều tôi đọc sách ở thư viện.'],
      ['よる、 おんがく を ききます。', 'Buổi tối tôi nghe nhạc.'],
    ],
    meo: [
      '**六時 = ろくじ** (không ろっじ) · **十二時 = じゅうにじ** · **日本語 = にほんご** · **私 = わたし**.',
      'はちじ から: đọc liền **はちじから**, ngắt sau から; べんきょう します — きょう kéo dài.',
      'グエン = gu-e-n (3 nhịp) · ホーチミン = hō-chi-mi-n (ホー kéo dài) · ベトナム = be-to-na-mu · パン = pa-n.',
      'あさごはん は パン です: は đầu tiên trong あさごはん là "ha" (trong từ), は sau là trợ từ "wa".',
    ],
  },
  tranh: [
    {
      ten: 'Thẻ nhân vật — hỏi tuổi',
      lesson: 'Lesson 1',
      anh: ['man-office-worker', 'briefcase'],
      canh: 'Thẻ nhân vật: カルロス · 41 tuổi · người Brazil · nhân viên công ty ABE',
      the: [['Tên', 'カルロス'], ['Tuổi', '41さい'], ['Nước', 'ブラジル'], ['Công việc', 'かいしゃいん（ABE）']],
      hoi: ['^カルロス-さん は なん-さい です か。', 'Anh Carlos bao nhiêu tuổi?'],
      mau: [['^カルロス-さん は {四十一歳|よんじゅういっさい} です。', 'Anh Carlos 41 tuổi.']],
      cham: [
        ['^カルロス-さん は {四十一歳|よんじゅういっさい} です。', '**15**', 'Trọn câu, đúng số, đúng trợ từ, đọc đúng いっさい.'],
        ['{四十一歳|よんじゅういっさい} です。', '15', 'Đúng thông tin, đúng ngữ pháp — câu ngắn vẫn đủ ý.'],
        ['^カルロス-さん を {四十一歳|よんじゅういっさい} です。', '≈ 13', 'Sai trợ từ (を thay は): −2.'],
        ['よんじゅう-いち-さい です。', '≈ 13', 'Hiểu được nhưng đọc sai biến âm いっさい → mất phần phát âm (2 điểm).'],
        ['{十四歳|じゅうよんさい} です。', '**0**', 'Sai thông tin (14 ≠ 41) → hiểu sai toàn bộ nội dung → mất hết.'],
        ['はい、 ^ブラジル-じん です。', '**0**', 'Trả lời câu khác (hỏi tuổi, đáp quốc tịch) → mất hết.'],
      ],
      meo: 'Nghe **なんさい** → câu trả lời PHẢI có **số + さい**. 41 = よんじゅう**いっ**さい; 1・8・10 đều có っ: いっさい · はっさい · じゅっさい.',
    },
    {
      ten: 'Nhà hàng — gọi món',
      lesson: 'Lesson 2',
      anh: ['fork-and-knife-with-plate', 'curry-rice', 'hamburger', 'hot-beverage'],
      canh: 'Thực đơn nhà hàng さくら: カレー 800円 · ハンバーグ 950円 · コーヒー 350円 · ジュース 300円',
      the: [['Món', 'カレー 800円 · ハンバーグ 950円'], ['Đồ uống', 'コーヒー 350円 · ジュース 300円'], ['Vai', 'Giám thị đóng vai **nhân viên**, bạn là **khách**']],
      hoi: ['ここ は レストラン です。 ご{注文|ちゅうもん}、 どうぞ。', 'Đây là nhà hàng. Mời quý khách gọi món.'],
      mau: [['すみません。 カレー を {一つ|ひとつ} と コーヒー を {一つ|ひとつ} ください。', 'Xin lỗi, cho tôi một cà ri và một cà phê.']],
      cham: [
        ['すみません。 カレー を {一つ|ひとつ} と コーヒー を {一つ|ひとつ} ください。', '**15**', 'Đúng mẫu N を〜つ ください (ポイント 10) + と (ポイント 5), lịch sự.'],
        ['カレー と コーヒー を ください。', '15', 'Đúng ngữ pháp, đúng tình huống.'],
        ['カレー は ください。', '≈ 13', 'Sai trợ từ (は thay を): −2.'],
        ['カレー を {一つ|ひとつ} です。', '≈ 10', 'Hiểu được là gọi cà ri nhưng sai mẫu câu (không phải lời yêu cầu) — lỗi không đổi nghĩa: trừ tối đa 5.'],
        ['カレー は {八百円|はっぴゃくえん} です。', '**0**', 'Không gọi món, chỉ đọc giá → không đáp đúng tình huống.'],
      ],
      meo: 'Câu 「ご注文、どうぞ」 không có dấu ？ nhưng là lời MỜI — đáp bằng **〜を ください**. Muốn chắc điểm: **すみません** + món + を + số + ください.',
    },
    {
      ten: 'Biển thư viện — hỏi giờ mở cửa',
      lesson: 'Lesson 3',
      anh: ['books', 'nine-oclock', 'seven-oclock'],
      canh: 'Biển: さくら図書館 · 9:00 – 19:00 · Nghỉ: 月曜日',
      the: [['Tên', 'さくら図書館（としょかん）'], ['Giờ mở cửa', '9:00 – 19:00'], ['Ngày nghỉ', '月曜日（げつようび）']],
      hoi: ['{図書館|としょかん} は {何時|なんじ} から {何時|なんじ} まで です か。', 'Thư viện mở từ mấy giờ đến mấy giờ?'],
      mau: [['{図書館|としょかん} は ごぜん {九時|くじ} から ごご {七時|しちじ} まで です。', 'Thư viện mở từ 9 giờ sáng đến 7 giờ tối.']],
      cham: [
        ['{図書館|としょかん} は ごぜん {九時|くじ} から ごご {七時|しちじ} まで です。', '**15**', 'Trọn câu, đúng から〜まで, đọc đúng くじ / しちじ, có ごぜん/ごご.'],
        ['{九時|くじ} から {七時|しちじ} まで です。', '15', 'Đúng và đủ — 19:00 nói しちじ (hoặc ごご しちじ) đều được.'],
        ['きゅうじ から しちじ まで です。', '≈ 13', 'Hiểu được nhưng 9 giờ đọc きゅうじ là sai cách đọc → mất phần phát âm.'],
        ['{九時|くじ} と {七時|しちじ} です。', '≈ 11', 'Sai trợ từ hai chỗ (と thay から / thiếu まで): −2 × 2.'],
        ['{九時|くじ} まで {七時|しちじ} から です。', '**0**', 'Đảo から/まで thành "từ 7 giờ đến 9 giờ" → sai thông tin.'],
        ['{月曜日|げつようび} です。', '**0**', 'Trả lời ngày nghỉ, không phải giờ mở cửa.'],
      ],
      meo: 'Nghe **なんじから なんじまで** → khung **〜じ から 〜じ まで です**. 4・7・9 giờ: **よじ · しちじ · くじ**. Giám thị có thể hỏi tiếp 「休みは何曜日ですか」 với cùng tranh — đáp 「げつようびです」.',
    },
  ],
  khong: {
    ten: 'Câu không tranh — giờ thức dậy',
    lesson: 'ngân hàng 22 câu',
    hoi: ['{毎朝|まいあさ}、 {何時|なんじ} に おきます か。', 'Sáng nào bạn cũng dậy lúc mấy giờ?'],
    mau: [['{私|わたし} は {毎朝|まいあさ} {六時半|ろくじはん} に おきます。', 'Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.']],
    cham: [
      ['{私|わたし} は {毎朝|まいあさ} {六時半|ろくじはん} に おきます。', '**10**', 'Trọn câu, giờ + に, động từ đúng.'],
      ['{六時半|ろくじはん} に おきます。', '10', 'Đúng, đủ ý.'],
      ['{毎朝|まいあさ} に {六時半|ろくじはん} に おきます。', '≈ 8', 'Thừa trợ từ に sau 毎朝: −2.'],
      ['{六時半|ろくじはん} に ねます。', '≤ 3', 'Hiểu câu, đúng ngữ pháp nhưng sai từ (ねます = ngủ, thay vì おきます = dậy) → tối đa 3.'],
      ['はい、 おきます。', '**0**', 'Không nói giờ → không trả lời câu hỏi.'],
    ],
    meo: 'Câu này nằm trong ngân hàng 22 câu không tranh (câu 8 và 12). Chuẩn bị sẵn **giờ thật** của bạn: 6:00 ろくじ · 6:30 ろくじはん · 7:00 しちじ.',
  },
  fe: [
    Q('田中さんは【学生】です。 — Chữ Hán trong【 】đọc là…', 'がくせい', 'がっせい | がくせ | かくせい', '学生 = **がくせい** (ga-ku-se-i).'),
    Q('いま、【四時】です。 — Chữ Hán trong【 】đọc là…', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = **よじ** — không よんじ.'),
    Q('きょうは【水曜日】です。 — Chữ Hán trong【 】đọc là…', 'すいようび', 'みずようび | すいようひ | もくようび', '水曜日 = **すいようび** (thứ Tư). もくようび là thứ Năm (木).'),
    Q('この かばんは【三千円】です。 — Chữ Hán trong【 】đọc là…', 'さんぜんえん', 'さんせんえん | みせんえん | さんぜんいん', '3.000 = **さんぜん** (biến âm ぜ).'),
    Q('わたしは【にほんじん】です。 — Từ trong【 】viết bằng chữ Hán là…', '日本人', '日木人 | 目本人 | 日本入', '日 (nhật) · 本 (bản) · 人 (nhân). 木 = cây, 目 = mắt, 入 = vào.'),
    Q('すみません、いま【なんじ】ですか。 — Chữ Hán là…', '何時', '何分 | 何曜 | 河時', 'なんじ = **何時** (mấy giờ). 何分 = mấy phút.'),
    Q('【がっこう】は くじからです。 — Chữ Hán là…', '学校', '字校 | 学交 | 覚校', 'がっこう = **学校**.'),
    Q('たんじょうびは【にがつ】ですか。 — Chữ Hán là…', '二月', '三月 | 二日 | 二目', 'にがつ = **二月** (tháng 2). 二日 = ngày 2 (ふつか).'),
    Q('わたし（　）アンナです。', 'は', 'を | へ | で', 'N1 **は** N2 です (ポイント 1).'),
    Q('これは ドイツ（　）カメラです。', 'の', 'は | を | に', 'Xuất xứ: N **の** N (ポイント 4, 13).'),
    Q('まいあさ、パン（　）たべます。', 'を', 'へ | で | に', 'Tân ngữ + **を** (ポイント 18).'),
    Q('しちじ（　）おきます。', 'に', 'で | を | へ', 'Giờ cụ thể + **に** (ポイント 19).'),
    Q('としょかん（　）ほんを よみます。', 'で', 'に | へ | を', 'Nơi diễn ra hành động + **で** (ポイント 20).'),
    Q('やすみは どようび（　）にちようびです。', 'と', 'や | も | の', 'Liệt kê đủ hai thứ: **と** (ポイント 5).'),
    Q('A：おくには（　）ですか。　B：タイです。', 'どちら', 'どこ | だれ | なん', 'Hỏi nước (lịch sự): お国は **どちら**ですか (ポイント 3).'),
    Q('A：これは（　）ですか。　B：1,500円です。', 'いくら', 'いつ | なん | どこ', 'Đáp giá tiền → hỏi **いくら** (ポイント 11).'),
    Q('A：たんじょうびは（　）ですか。　B：5月7日です。', 'いつ', 'なんじ | なん | どちら', 'Hỏi ngày → **いつ** (ポイント 3).'),
    Q('A：（　）かばんは だれのですか。（cái túi ở gần người nghe）　B：マルコさんのです。', 'その', 'それ | そこ | そちら', 'Đứng trước danh từ → **その** + N (ポイント 8). それ đứng một mình.'),
    Q('A：ぎんこうは（　）から（　）までですか。　B：9時から3時までです。', 'なんじ／なんじ', 'いつ／どこ | なん／なん | だれ／だれ', 'Đáp giờ → hỏi **なんじ から なんじ まで** (ポイント 21).'),
    Q('A：はじめまして。キムです。どうぞ よろしく。　B：（　）。', 'こちらこそ よろしく おねがいします', 'どういたしまして | いただきます | さようなら', 'Đáp lại よろしく → **こちらこそ** (Bài 1).'),
    Q('A：Bさんは がくせいですか。　B：いいえ、（　）。', 'がくせいじゃ ありません', 'がくせいです | がくせいません | そうです', 'Phủ định danh từ: N **じゃありません** (ポイント 2).'),
    Q('てんいん：いらっしゃいませ。　A：すみません、ATMは どこですか。　てんいん：（　）です。', 'あちら', 'あれ | あの | どちら', 'Chỉ nơi (lịch sự) → **あちら**; あれ là "cái kia", あの phải có danh từ đi sau (ポイント 9).'),
    Q('A：にちようび、どこへ いきますか。　B：どこ（　）いきません。', 'へも', 'をも | でも | にを', 'Không đi đâu cả: どこ**へも** + ません (ポイント 23).'),
    Q('A：あさごはんは なにを たべますか。　B：パン（　）くだもの（　）を たべます。', 'や／など', 'と／など | から／まで | も／も', 'Liệt kê ví dụ: N1 **や** N2 **など** (ポイント 22).'),
    Q('（　）で ほんを かいます。', 'ほんや', 'ぎんこう | びょういん | ゆうびんきょく', 'Mua sách ở **ほんや** (hiệu sách — 本屋, Bài 2).'),
    Q('よる、うちで テレビを（　）。', 'みます', 'よみます | ききます | のみます', 'Xem ti vi → テレビを **みます**.'),
    Q('Chọn câu sắp xếp đúng từ các mảnh: は ／ にほんご ／ の ／ わたし ／ せんせい ／ です', 'わたしは にほんごの せんせいです。', 'せんせいは わたしの にほんごです。 | にほんごの わたしは せんせいです。 | わたしの せんせいは にほんごです。', '"Tôi là giáo viên tiếng Nhật": わたし**は** にほんご**の** せんせい です.'),
    Q('Từ nào KHÁC LOẠI?', 'カレー', 'コーヒー | ジュース | ビール', 'Ba từ kia là đồ uống; カレー là món ăn.'),
    Q('Từ nào KHÁC LOẠI?', 'どようび', 'ぎんこう | としょかん | たいいくかん', 'Ba từ kia là nơi chốn; どようび là thứ Bảy.'),
    Q('「さいふ」 nghĩa tiếng Việt là…', 'cái ví', 'cái cặp | đồng hồ | điện thoại', 'さいふ (財布) = ví tiền. かばん = cặp · とけい = đồng hồ.'),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *                              ĐỀ SỐ 2
 * ═══════════════════════════════════════════════════════════════════ */

const DE_2: De = {
  so: 2,
  ten: 'Có/Không · đồ của ai · lịch làm thêm',
  vao: [
    ['candidate', 'しつれい します。', '(Gõ cửa) Xin phép ạ.'],
    ['examiner', 'はい、 どうぞ。', 'Vâng, mời vào.'],
    ['candidate', 'こんにちは。 ^リン です。 どうぞ よろしく おねがい します。', 'Em chào cô ạ. Em là Linh. Mong cô giúp đỡ.'],
    ['examiner', 'こんにちは。 では、 これ を よんで ください。', 'Chào em. Vậy em đọc bài này nhé.'],
  ],
  ra: [
    ['examiner', 'はい、 いい です。 おつかれさま。', 'Được rồi. Em vất vả rồi.'],
    ['candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn cô ạ. Em xin phép.'],
  ],
  doc: {
    ten: 'Thứ Bảy đi mua sắm',
    dang: '',
    cau: [
      ['{土曜日|どようび}、 わたし は スーパー へ いきます。', 'Thứ Bảy tôi đi siêu thị.'],
      ['そこ で パン と たまご と くだもの を かいます。', 'Ở đó tôi mua bánh mì, trứng và hoa quả.'],
      ['パン は {一つ|ひとつ} ひゃく-えん です。', 'Bánh mì một cái 100 yên.'],
      ['ひる、 レストラン で カレー を たべます。', 'Buổi trưa tôi ăn cà ri ở nhà hàng.'],
      ['カレー は {八百円|はっぴゃくえん} です。', 'Cà ri 800 yên.'],
      ['ごご、 うち へ かえります。 にほんご を べんきょう します。', 'Buổi chiều tôi về nhà và học tiếng Nhật.'],
      ['{日曜日|にちようび} は どこ へ も いきません。', 'Chủ nhật tôi không đi đâu cả.'],
    ],
    meo: [
      '**土曜日 どようび · 日曜日 にちようび · 一つ ひとつ · 八百円 はっぴゃくえん** — 4 từ gạch chân: hai thứ trong tuần + hai số.',
      'ひゃくえん (100 yên) — ひゃ là âm ghép một nhịp: hya-ku-e-n.',
      'うち へ かえります: へ = "e"; かえります (về) — đừng đọc かいります.',
      'どこ へ も いきません: phủ định — câu cuối dễ đọc vội thành いきます.',
    ],
  },
  tranh: [
    {
      ten: 'Thẻ nhân vật — câu Có/Không',
      lesson: 'Lesson 1',
      anh: ['woman-student', 'books'],
      canh: 'Thẻ nhân vật: アンナ · 20 tuổi · người Nga · sinh viên Đại học Fujimi',
      the: [['Tên', 'アンナ'], ['Tuổi', '20さい'], ['Nước', 'ロシア'], ['Công việc', 'ふじみだいがくの がくせい']],
      hoi: ['^アンナ-さん は {学生|がくせい} です か。', 'Anna có phải là sinh viên không?'],
      mau: [['はい、 ^アンナ-さん は {学生|がくせい} です。 ^ふじみ-だいがく の {学生|がくせい} です。', 'Vâng, Anna là sinh viên. Là sinh viên Đại học Fujimi.']],
      cham: [
        ['はい、 ^アンナ-さん は {学生|がくせい} です。 ^ふじみ-だいがく の {学生|がくせい} です。', '**15**', 'Có はい, trọn câu, thêm một câu thông tin đúng — giám thị thấy bạn HIỂU tranh.'],
        ['はい、 そう です。', '15', 'Đúng và đủ cho câu Có/Không.'],
        ['{学生|がくせい} です。', '≈ 10', 'Quên **はい** — lỗi không đổi nghĩa: trừ tối đa 5.'],
        ['はい、 ^アンナ-さん も {学生|がくせい} です。', '≈ 13', 'Sai trợ từ (も thay は — không có ai khác để "cũng"): −2.'],
        ['はい、 ^アンナ-さん は {先生|せんせい} です。', '≤ 3', 'Hiểu câu, đúng ngữ pháp nhưng sai từ (先生 thay 学生) → tối đa 3.'],
        ['いいえ、 {学生|がくせい} じゃ ありません。', '**0**', 'Sai thông tin trên thẻ → mất hết.'],
      ],
      meo: 'Câu hỏi kết thúc bằng **ですか mà không có từ để hỏi** → câu Có/Không → mở đầu bằng **はい／いいえ**. Đây là lỗi bị trừ nặng nhất mà rất dễ tránh.',
    },
    {
      ten: 'Đồ vật — của ai?',
      lesson: 'Lesson 2',
      anh: ['watch'],
      canh: 'Thẻ đồ vật: đồng hồ · của ワン · đồng hồ Đức · 30.000円 (giám thị cầm thẻ)',
      the: [['Đồ vật', 'とけい'], ['Của ai', 'ワンさん'], ['Hãng / nước', 'ドイツ'], ['Giá', '30,000円'], ['Vị trí', 'Giám thị CẦM thẻ (gần giám thị)']],
      hoi: ['これ は だれ の {時計|とけい} です か。', 'Đây là đồng hồ của ai?'],
      mau: [['それ は ^ワン-さん の {時計|とけい} です。', 'Đó là đồng hồ của Wan.']],
      cham: [
        ['それ は ^ワン-さん の {時計|とけい} です。', '**15**', 'Giám thị hỏi これ (đồ gần giám thị) → bạn đáp **それ**; đúng だれの → tên + の.'],
        ['^ワン-さん の です。', '15', 'Bỏ danh từ sau の (ポイント 14) — đúng, đủ.'],
        ['これ は ^ワン-さん の {時計|とけい} です。', '≈ 13–15', 'Thẻ ở phía giám thị nên chuẩn là それ; nhiều giám thị không trừ, có người trừ phần lưu loát.'],
        ['^ワン-さん は {時計|とけい} です。', '0 – 13', 'の thành は: nếu giám thị hiểu là "của Wan" thì −2; nghe thành "Wan là đồng hồ" thì mất hết — đừng thử vận may.'],
        ['ドイツ の {時計|とけい} です。', '**0**', 'Trả lời "của nước nào" (どこの) thay vì "của ai" (だれの).'],
        ['{三万円|さんまんえん} です。', '**0**', 'Trả lời giá — câu khác.'],
      ],
      meo: 'Phân biệt ba câu cùng một tranh đồ vật: **だれの**〜 → tên người の · **どこの**〜 → nước/hãng の · **いくら** → số + えん. Nghe chữ thứ hai của câu hỏi.',
    },
    {
      ten: 'Lịch tuần của Marco — làm gì?',
      lesson: 'Lesson 3',
      anh: ['spiral-calendar', 'convenience-store', 'man-student'],
      canh: 'Lịch tuần của マルコ: thứ 2–6 đi học 9:00–15:00 · thứ 7 làm thêm ở コンビニ 17:00–22:00 · Chủ nhật nghỉ',
      the: [['月〜金', 'だいがく 9:00–15:00'], ['土', 'コンビニで アルバイト 17:00–22:00'], ['日', 'やすみ']],
      hoi: ['^マルコ-さん は {土曜日|どようび}、 {何|なに} を します か。', 'Thứ Bảy Marco làm gì?'],
      mau: [
        ['{土曜日|どようび} は コンビニ で アルバイト を します。', 'Thứ Bảy cậu ấy làm thêm ở cửa hàng tiện lợi.'],
        ['ごご {五時|ごじ} から {十時|じゅうじ} まで はたらきます。', 'Cậu ấy làm từ 5 giờ chiều đến 10 giờ.'],
      ],
      cham: [
        ['{土曜日|どようび} は コンビニ で アルバイト を します。', '**15**', 'Đúng hoạt động, đúng nơi + で, trọn câu. (Câu thứ hai về giờ là điểm cộng lưu loát.)'],
        ['アルバイト を します。', '15', 'Đúng ý chính.'],
        ['コンビニ に アルバイト を します。', '≈ 13', 'Sai trợ từ (に thay で): −2.'],
        ['コンビニ で アルバイト です。', '≈ 10', 'Thiếu động từ します nhưng vẫn hiểu → lỗi không đổi nghĩa: trừ tối đa 5.'],
        ['コンビニ で アルバイト を しません。', '**0**', 'Nói ngược thông tin (không làm) → mất hết.'],
        ['{日曜日|にちようび} は やすみ です。', '**0**', 'Trả lời ngày khác.'],
      ],
      meo: 'Nghe **なにを しますか** → khung **(nơi) で (việc) を します**. Nghe **どこへ いきますか** → **(nơi) へ いきます**. Câu 18 và 19 trong ngân hàng 22 câu bẫy đúng chỗ này.',
    },
  ],
  khong: {
    ten: 'Câu không tranh — sở thích',
    lesson: 'ngân hàng 22 câu',
    hoi: ['{趣味|しゅみ} は {何|なん} です か。', 'Sở thích của bạn là gì?'],
    mau: [['{私|わたし} の {趣味|しゅみ} は {音楽|おんがく} と {旅行|りょこう} です。', 'Sở thích của tôi là âm nhạc và du lịch.']],
    cham: [
      ['{私|わたし} の {趣味|しゅみ} は {音楽|おんがく} と {旅行|りょこう} です。', '**10**', 'Trọn câu, đúng の và と.'],
      ['{音楽|おんがく} です。', '10', 'Đúng, đủ ý.'],
      ['{私|わたし} は {趣味|しゅみ} は {音楽|おんがく} です。', '≈ 8', 'Sai trợ từ (は thay の sau 私): −2.'],
      ['{私|わたし} の {趣味|しゅみ} は {学生|がくせい} です。', '≤ 3', 'Hiểu câu, đúng ngữ pháp, sai từ (学生 không phải sở thích) → tối đa 3.'],
      ['はい、 {趣味|しゅみ} です。', '**0**', 'Không nói sở thích là gì.'],
    ],
    meo: 'Chọn sở thích **dễ phát âm** và chắc chắn đọc đúng: おんがく · りょこう · えいが · サッカー · テニス · どくしょ · りょうり. Đừng chọn từ chưa học.',
  },
  fe: [
    Q('マルコさんは【三十八歳】です。 — Chữ Hán trong【 】đọc là…', 'さんじゅうはっさい', 'さんじゅうはちさい | さんじゅうやっさい | みじゅうはっさい', '8 + さい → **はっさい** (có っ).'),
    Q('いま【九時半】です。 — Chữ Hán trong【 】đọc là…', 'くじはん', 'きゅうじはん | くじぱん | ここのじはん', '9 giờ = **くじ**, rưỡi = **はん**.'),
    Q('ミラーさんは【日本語】の せんせいです。 — Chữ Hán trong【 】đọc là…', 'にほんご', 'にほんこ | にほんごう | ひほんご', '日本語 = **にほんご**.'),
    Q('この ペンは【六百円】です。 — Chữ Hán trong【 】đọc là…', 'ろっぴゃくえん', 'ろくひゃくえん | ろっひゃくえん | ろくびゃくえん', '600 = **ろっぴゃく**.'),
    Q('きょうは【かようび】です。 — Từ trong【 】viết bằng chữ Hán là…', '火曜日', '水曜日 | 火曜目 | 化曜日', 'かようび = **火曜日** (thứ Ba). 水曜日 = すいようび.'),
    Q('これは【せんえん】です。 — Chữ Hán là…', '千円', '干円 | 千田 | 万円', 'せん = **千** (không phải 干 "khô"); えん = 円.'),
    Q('【わたし】は がくせいです。 — Chữ Hán là…', '私', '和 | 利 | 秋', 'わたし = **私** (bộ 禾 + ム).'),
    Q('【まいあさ】、パンを たべます。 — Chữ Hán là…', '毎朝', '毎晩 | 海朝 | 毎期', 'まいあさ = **毎朝**; 毎晩 = まいばん (mỗi tối).'),
    Q('アンナさん（　）ロシアじんです。', 'は', 'を | へ | に', 'N1 **は** N2 です.'),
    Q('わたし（　）しゅみは テニスです。', 'の', 'は | が | を', '"Sở thích CỦA tôi": わたし**の** しゅみ.'),
    Q('まいにち、がっこう（　）いきます。', 'へ', 'を | で | の', 'Đích đến + **へ** (ポイント 17).'),
    Q('うち（　）テレビを みます。', 'で', 'へ | に | を', 'Nơi làm việc gì + **で**.'),
    Q('くじ（　）ごじ（　）はたらきます。', 'から／まで', 'まで／から | に／に | と／と', 'Từ … đến … : **から … まで**.'),
    Q('わたしは がくせいです。マルコさん（　）がくせいです。', 'も', 'は | の | と', 'Giống người trước → **も** (ポイント 6).'),
    Q('A：これは（　）の カメラですか。　B：ドイツの カメラです。', 'どこ', 'だれ | なん | いくら', 'Đáp tên nước → hỏi **どこの** (ポイント 13).'),
    Q('A：これは（　）の りょうりですか。　B：さかなの りょうりです。', 'なん', 'だれ | どこ | いつ', 'Đáp nguyên liệu → hỏi **なんの** (ポイント 12).'),
    Q('A：レストランは（　）ですか。　B：5かいです。', 'なんがい', 'なんじ | いくら | いつ', 'Đáp tầng → hỏi **なんがい** (何階).'),
    Q('A：すみません、（　）は いくらですか。（cái ở xa cả hai người）', 'あれ', 'これ | それ | どれ', 'Xa cả người nói và người nghe → **あれ** (ポイント 7).'),
    Q('A：としょかんの やすみは（　）ですか。　B：すいようびです。', 'なんようび', 'なんじ | なんがつ | どこ', 'Đáp thứ → hỏi **なんようび**.'),
    Q('A：おくには どちらですか。　B：（　）。', 'ベトナムです', 'ベトナムさんです | ベトナムごです | ハノイじんです', 'Hỏi nước → tên nước + です. Không gắn さん cho nước; ベトナムご là tiếng Việt.'),
    Q('てんいん：いらっしゃいませ。　A：（　）。', 'ハンバーグを ふたつ ください', 'ハンバーグは ふたつです | ハンバーグを ふたつですか | ハンバーグの ふたつ ください', 'Gọi món: N **を** 〜つ **ください** (ポイント 10).'),
    Q('A：あさ、なにを たべますか。　B：なにも（　）。', 'たべません', 'たべます | たべませんか | たべじゃありません', 'なにも + **phủ định** (ポイント 23).'),
    Q('A：にちようび、こうえんで テニスを します。　B：（　）。', 'いいですね', 'いただきます | こちらこそ | すみません', 'Khen kế hoạch của người khác → **いいですね** (Bài 3).'),
    Q('A：まいばん、コーヒーを のみますか。　B：いいえ、（　）。', 'のみません', 'のみます | コーヒーじゃありません | そうです', 'Hỏi bằng động từ → đáp bằng động từ: いいえ、**のみません**.'),
    Q('（　）で ほんを よみます。', 'としょかん', 'ぎんこう | たいいくかん | ゆうびんきょく', 'Đọc sách ở **としょかん** (thư viện).'),
    Q('まいばん、おんがくを（　）。', 'ききます', 'みます | よみます | たべます', 'Nghe nhạc → おんがくを **ききます**.'),
    Q('Chọn câu sắp xếp đúng: から ／ まで ／ は ／ ぎんこう ／ 九時 ／ 三時 ／ です', 'ぎんこうは 九時から 三時までです。', 'ぎんこうは 九時まで 三時からです。 | 九時は ぎんこうから 三時までです。 | ぎんこうから 九時は 三時までです。', 'N は [giờ] から [giờ] まで です (ポイント 21).'),
    Q('Từ nào KHÁC LOẠI?', 'ゆうびんきょく', 'ごぜん | ごご | あさ', 'Ba từ kia chỉ thời gian trong ngày; ゆうびんきょく là bưu điện.'),
    Q('Từ nào KHÁC LOẠI?', 'とけい', 'たまご | さかな | にく', 'Ba từ kia là thực phẩm; とけい là đồng hồ.'),
    Q('「やすみ」 nghĩa tiếng Việt là…', 'ngày nghỉ / nghỉ', 'công việc | trường học | bữa sáng', 'やすみ (休み) = nghỉ, ngày nghỉ. しごと = công việc.'),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *                              ĐỀ SỐ 3
 * ═══════════════════════════════════════════════════════════════════ */

const DE_3: De = {
  so: 3,
  ten: 'tranh hai người · sơ đồ tầng · công viên (có xin nhắc lại câu hỏi)',
  vao: [
    ['candidate', 'しつれい します。', '(Gõ cửa) Xin phép ạ.'],
    ['examiner', 'どうぞ。 おなまえ は？', 'Mời vào. Tên em là gì?'],
    ['candidate', 'こんにちは。 ^ナム です。 よろしく おねがい します。', 'Em chào cô ạ. Em là Nam. Mong cô giúp đỡ.'],
    ['examiner', 'はい。 では、 はじめ ましょう。', 'Được. Chúng ta bắt đầu nhé.'],
  ],
  ra: [
    ['examiner', 'はい、 おわり です。', 'Xong rồi.'],
    ['candidate', 'ありがとう ございました。 しつれい します。', 'Em cảm ơn cô ạ. Em xin phép.'],
  ],
  doc: {
    ten: 'Hội thoại — Chủ nhật đi đâu?',
    dang: '',
    vai: ['A', 'B', 'A', 'B', 'A', 'B'],
    cau: [
      ['^ダニエル-さん、 {日曜日|にちようび}、 どこ へ いきます か。', '(Wan) Anh Daniel, Chủ nhật anh đi đâu?'],
      ['うみ へ いきます。 バーベキュー を します。', '(Daniel) Tôi đi biển. Tôi nướng thịt ngoài trời.'],
      ['いい です ね。 なんじ から なんじ まで です か。', 'Hay nhỉ. Từ mấy giờ đến mấy giờ vậy?'],
      ['{十時|じゅうじ} から {四時|よじ} まで です。 ^ワン-さん は？', 'Từ 10 giờ đến 4 giờ. Còn chị Wan?'],
      ['{私|わたし} は どこ へ も いきません。 うち で ほん を よみます。 ジュース を のみます。', 'Tôi không đi đâu cả. Tôi đọc sách và uống nước ép ở nhà.'],
      ['そう です か。', 'Vậy à.'],
    ],
    meo: [
      '**日曜日 にちようび · 十時 じゅうじ · 四時 よじ (không よんじ) · 私 わたし**.',
      'バーベキュー = bā-be-kyū — hai chỗ kéo dài; đọc chậm ở cụm này.',
      'Hai vai: câu hỏi か lên giọng ở vai A; câu trả lời hạ giọng ở vai B.',
      'どこ へ も いきません: へ = e; phủ định ません ở cuối.',
    ],
  },
  tranh: [
    {
      ten: 'Tranh hai người — Có/Không về tuổi',
      lesson: 'Lesson 1',
      anh: ['woman-student', 'man-office-worker'],
      canh: 'Hai người: bên trái アンナ 20 tuổi · bên phải カルロス 41 tuổi',
      the: [['Bên trái', 'アンナ — 20さい'], ['Bên phải', 'カルロス — 41さい']],
      hoi: ['^カルロス-さん は {二十歳|はたち} です か。', 'Anh Carlos 20 tuổi phải không?'],
      mau: [
        ['すみません、 もう {一度|いちど} おねがい します。', '(Xin nhắc lại câu hỏi — được tối đa 2 lần, không bị trừ điểm.)'],
        ['いいえ、 ^カルロス-さん は {二十歳|はたち} じゃ ありません。 {四十一歳|よんじゅういっさい} です。', 'Không, anh Carlos không phải 20 tuổi. Anh ấy 41 tuổi.'],
      ],
      cham: [
        ['いいえ、 ^カルロス-さん は {二十歳|はたち} じゃ ありません。 {四十一歳|よんじゅういっさい} です。', '**15**', 'いいえ + phủ định + nói thông tin đúng = trọn điểm. Xin nhắc lại trước đó KHÔNG bị trừ.'],
        ['いいえ、 {四十一歳|よんじゅういっさい} です。', '15', 'Có いいえ, thông tin đúng.'],
        ['{四十一歳|よんじゅういっさい} です。', '≈ 10', 'Quên **いいえ**: trừ tối đa 5.'],
        ['いいえ、 {二十歳|はたち} です。', '**0**', 'Tự mâu thuẫn → hiểu sai nội dung.'],
        ['はい、 {二十歳|はたち} です。', '**0**', 'Nhìn nhầm người (アンナ mới 20 tuổi) → sai thông tin.'],
      ],
      meo: 'Tranh có HAI người: nghe **tên** trong câu hỏi trước, chỉ tay vào đúng người rồi mới đáp. Không nghe rõ → 「すみません、もう一度お願いします」 — đó là quyền của bạn.',
    },
    {
      ten: 'Sơ đồ tầng — hỏi tầng',
      lesson: 'Lesson 2',
      anh: ['department-store', 'elevator'],
      canh: 'Bảng hướng dẫn toà nhà: B1 スーパー · 1F ケーキや · 2F ほんや · 3F 100円ショップ · 4F レストラン',
      the: [['B1', 'スーパー'], ['1F', 'ケーキや'], ['2F', 'ほんや'], ['3F', '100円ショップ'], ['4F', 'レストラン']],
      hoi: ['{百円|ひゃくえん} ショップ は {何階|なんがい} です か。', 'Cửa hàng 100 yên ở tầng mấy?'],
      mau: [['{百円|ひゃくえん} ショップ は {三階|さんがい} です。', 'Cửa hàng 100 yên ở tầng 3.']],
      cham: [
        ['{百円|ひゃくえん} ショップ は {三階|さんがい} です。', '**15**', 'Trọn câu, đọc さんがい đúng như sách.'],
        ['{三階|さんがい} です。', '15', 'Đúng, đủ.'],
        ['さんかい です。', '≈ 13–15', 'Vẫn hiểu là tầng 3; sách dạy さんがい — có giám thị không trừ, có người trừ phần phát âm (≤ 2).'],
        ['{三階|さんがい} に です。', '≈ 13', 'Thừa trợ từ に: −2.'],
        ['あそこ です。', '**0**', 'Không nói tầng → không trả lời câu なんがい.'],
        ['{三百円|さんびゃくえん} です。', '**0**', 'Nghe なんがい thành いくら → câu khác.'],
      ],
      meo: 'Tầng: 1 いっかい · 2 にかい · 3 さんがい · 4 よんかい · 5 ごかい · B1 ちかいっかい · hỏi **なんがい**. Đề hay chọn đúng tầng 3 để nghe biến âm.',
    },
    {
      ten: 'Tranh công viên — ở đây làm gì?',
      lesson: 'Lesson 3',
      anh: ['national-park', 'tennis', 'bento-box'],
      canh: 'Tranh nơi chốn: công viên — có người chơi quần vợt, có người ăn cơm hộp',
      the: [['Nơi', 'こうえん'], ['Người trong tranh', 'テニスを する人 · おべんとうを たべる人']],
      hoi: ['ここ で {何|なに} を します か。', 'Ở đây (người ta) làm gì?'],
      mau: [['こうえん で テニス を します。 おべんとう も たべます。', 'Ở công viên người ta chơi quần vợt. Cũng ăn cơm hộp.']],
      cham: [
        ['こうえん で テニス を します。 おべんとう も たべます。', '**15**', 'Đúng nơi + で, hai hoạt động trên tranh, đúng も.'],
        ['テニス を します。', '15', 'Đúng một hoạt động trên tranh — đủ.'],
        ['こうえん に テニス を します。', '≈ 13', 'Sai trợ từ (に thay で): −2.'],
        ['こうえん で テニス を みます。', '≤ 3', 'Hiểu câu, đúng ngữ pháp, sai động từ (みます = xem) → tối đa 3.'],
        ['こうえん です。', '**0**', 'Trả lời "đây là đâu", không phải "làm gì".'],
      ],
      meo: 'ここで なにを しますか ↔ ここは どこですか là HAI câu khác nhau. Câu "làm gì" → **(N) を します / V-ます**. Thuộc cặp nơi–việc: としょかん→ほんを よみます · こうえん→テニスを します · スーパー→かいものを します · レストラン→たべます.',
    },
  ],
  khong: {
    ten: 'Câu không tranh — ngày nghỉ làm gì?',
    lesson: 'ngân hàng 22 câu',
    hoi: ['{休|やす}み の {日|ひ}、 {何|なに} を します か。', 'Ngày nghỉ bạn làm gì?'],
    mau: [['{休|やす}み の {日|ひ} は うち で {映画|えいが} を {見|み}ます。 {日本語|にほんご} も {勉強|べんきょう} します。', 'Ngày nghỉ tôi xem phim ở nhà. Tôi cũng học tiếng Nhật.']],
    cham: [
      ['{休|やす}み の {日|ひ} は うち で {映画|えいが} を {見|み}ます。 {日本語|にほんご} も {勉強|べんきょう} します。', '**10**', 'Trọn câu, đúng で/を/も, có thêm câu thứ hai.'],
      ['{映画|えいが} を {見|み}ます。', '10', 'Đúng, đủ.'],
      ['うち に {映画|えいが} を {見|み}ます。', '≈ 8', 'Sai trợ từ (に thay で): −2.'],
      ['{映画|えいが} を {飲|の}みます。', '≤ 3', 'Hiểu câu, sai động từ (飲みます = uống) → tối đa 3.'],
      ['うち へ {行|い}きます。', '≤ 3 / 0', 'Đây là câu trả lời cho どこへ行きますか — giám thị coi là trả lời sai câu.'],
    ],
    meo: 'Ngân hàng 22 câu có cả **やすみの日はどこに行きますか** (câu 18) lẫn **やすみの日はなにをしますか** (câu 19) — chỉ khác một từ để hỏi. Nghe kỹ どこ / なに.',
  },
  fe: [
    Q('たんじょうびは 九月【二十日】です。 — Chữ Hán trong【 】đọc là…', 'はつか', 'にじゅうにち | ふつか | にじゅっか', 'Ngày 20 = **はつか** (bất quy tắc). ふつか là ngày 2.'),
    Q('いま 三時【八分】です。 — Chữ Hán trong【 】đọc là…', 'はっぷん', 'はちふん | はっふん | やっぷん', '8 phút = **はっぷん**.'),
    Q('ワンさんは【留学生】です。 — Chữ Hán trong【 】đọc là…', 'りゅうがくせい', 'るうがくせい | りゅがくせい | りゅうがっせい', '留学生 = **りゅうがくせい** (du học sinh).'),
    Q('この くつは【八千円】です。 — Chữ Hán trong【 】đọc là…', 'はっせんえん', 'はちせんえん | はっぜんえん | やっせんえん', '8.000 = **はっせん**.'),
    Q('【きんようび】から にちようびまで やすみです。 — Từ trong【 】viết bằng chữ Hán là…', '金曜日', '全曜日 | 金曜目 | 土曜日', 'きんようび = **金曜日**. 全 (toàn) trông giống 金 nhưng khác.'),
    Q('えきから うちまで【さんじゅっぷん】です。 — Chữ Hán là…', '三十分', '三千分 | 三十今 | 三十八', 'さんじゅっぷん = **三十分** (30 phút).'),
    Q('きょうは【なんにち】ですか。 — Chữ Hán là…', '何日', '何月 | 河日 | 何目', 'なんにち = **何日** (ngày mấy).'),
    Q('【ごぜん】くじに おきます。 — Chữ Hán là…', '午前', '牛前 | 午後 | 年前', 'ごぜん = **午前** (buổi sáng, AM). 牛 = con bò; 午後 = ごご.'),
    Q('まいばん（　）じゅういちじ（　）ねます。', '✕／に', 'に／に | に／✕ | で／に', 'まいばん không đi với に (✕); giờ cụ thể + **に**.'),
    Q('「とりにく」は ベトナムご（　）なんですか。', 'で', 'に | を | の', '〜語**で** なんですか (ポイント 15).'),
    Q('スーパーで パン（　）くだもの（　）を かいます。', 'や／など', 'や／も | と／など | から／まで', 'Liệt kê ví dụ: **や … など**.'),
    Q('にちようびは どこ（　）いきません。', 'へも', 'でも | にを | へを', 'どこ**へも** + ません.'),
    Q('としょかん（　）べんきょう します。', 'で', 'へ | を | が', 'Nơi làm việc gì → **で**.'),
    Q('この ペンは だれ（　）ですか。', 'の', 'は | を | と', 'Hỏi chủ sở hữu: だれ**の** ですか (ポイント 14).'),
    Q('A：（　）は いつから いつまでですか。　B：4月29日から 5月5日までです。', 'ゴールデンウイーク', 'クリスマス | テスト | アルバイト', 'Tuần lễ Vàng ở Nhật: cuối tháng 4 → đầu tháng 5 (Bài 3).'),
    Q('A：いま なんじですか。　B：（ 4:10 ）', 'よじ じゅっぷん です', 'よんじ じゅっぷん です | よじ じゅうふん です | しじ じゅっぷん です', '4 giờ **よじ** · 10 phút **じゅっぷん**.'),
    Q('A：すみません、ATMは どこですか。（ATM ở ngay cạnh người hỏi）　B：（　）です。', 'そこ', 'それ | その | そちらの', 'Nơi ở gần người nghe → **そこ** (ポイント 9).'),
    Q('A：しゅみは なんですか。　B：（　）。', 'どくしょです', 'がくせいです | はたちです | ブラジルです', 'Hỏi sở thích → đáp sở thích (どくしょ = đọc sách).'),
    Q('A：「でんわ」は えいごで（　）ですか。　B：「phone」です。', 'なん', 'どこ | だれ | いつ', 'Hỏi "là gì" → **なん**ですか.'),
    Q('A：ナタポンさんは がくせいですか。　B：いいえ、（　）。かいしゃいんです。', 'がくせいじゃ ありません', 'がくせいです | かいしゃいんじゃ ありません | そうです', 'Phủ định đúng danh từ được hỏi (がくせい).'),
    Q('A：どうぞ よろしく おねがいします。　B：（　）、よろしく おねがいします。', 'こちらこそ', 'すみません | いいえ | あのう', '"Chính tôi mới phải…" → **こちらこそ**.'),
    Q('A：これを ください。　てんいん：はい、（　）。', 'ありがとう ございます', 'いただきます | おやすみなさい | はじめまして', 'Nhân viên cảm ơn khách → **ありがとうございます**.'),
    Q('A：まいにち、にほんごを べんきょうしますか。　B：はい、（　）。', 'べんきょうします', 'べんきょうしません | べんきょうです | そうじゃありません', 'はい + động từ khẳng định.'),
    Q('A：7月7日は おまつりです。　B：えっ、おまつり？ なにを しますか。　A：はなびを（　）。', 'みます', 'たべます | のみます | よみます', 'Pháo hoa thì **みます** (xem).'),
    Q('あさ、（　）で しんぶんを かいます。', 'コンビニ', 'こうえん | たいいくかん | うみ', 'Mua báo ở **コンビニ** (cửa hàng tiện lợi).'),
    Q('ふゆ、やまで スキーを（　）。', 'します', 'みます | いきます | かいます', 'Trượt tuyết → スキーを **します**.'),
    Q('Chọn câu sắp xếp đúng: を ／ まいばん ／ ビール ／ のみます ／ わたしは', 'わたしは まいばん ビールを のみます。', 'わたしは ビールを まいばんを のみます。 | まいばんは わたしを ビール のみます。 | ビールは わたしを まいばん のみます。', 'Chủ đề は + thời gian + tân ngữ を + động từ.'),
    Q('Từ nào KHÁC LOẠI?', 'あさ', 'はる | なつ | あき', 'Ba từ kia là mùa; あさ là buổi sáng.'),
    Q('Từ nào KHÁC LOẠI?', 'パン', 'ぎゅうにゅう | ジュース | こうちゃ', 'Ba từ kia là đồ uống; パン là bánh mì.'),
    Q('「まいばん」 nghĩa tiếng Việt là…', 'mỗi tối', 'mỗi sáng | mỗi ngày | buổi trưa', 'まいばん (毎晩) = mỗi tối. まいあさ = mỗi sáng · まいにち = mỗi ngày.'),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *               CHIẾN LƯỢC THI & LỖI MẤT ĐIỂM HAY GẶP
 * ═══════════════════════════════════════════════════════════════════ */

const CHIEN_LUOC: Lesson = {
  id: 'b3-thi-thu-113-chien-luoc',
  kind: 'review',
  title: '🧭 Chiến lược thi JPD113 & lỗi mất điểm hay gặp — từng phút trong phòng thi nói, 45 phút FE, giám thị trừ điểm thế nào',
  goal: 'Biết làm gì ở từng phút của buổi thi nói và 45 phút FE, đoán được giám thị chấm một câu trả lời bao nhiêu điểm, và tránh đúng những lỗi đã làm người thi lại trượt.',
  minutes: 35,
  blocks: [
    RECAP('Bốn việc quyết định 9–10 điểm', [
      '**Reading 40**: đọc chậm vừa, đủ từng chữ — sai 1 ký tự chỉ −0,2, nhưng bỏ cả một từ chữ Hán/katakana mất ≈ 3.',
      '**Talking 55**: nghe **từ để hỏi** trước → biết câu trả lời phải chứa gì → trả lời **trọn câu** · **đúng trợ từ** (−2/lần) · **はい／いいえ** cho câu Có/Không (−5).',
      '**Presenting 5**: chào khi vào và **trước khi ra** — 5 điểm cho 2 câu thuộc lòng.',
      '**FE 30 câu / 45 phút**: không bỏ trống câu nào; đạt khi ≥ 12 câu đúng, 9 điểm cần 27 câu.',
    ]),
    NOTE('Lỗi của chính lần thi trượt trước (ghi trong biên bản ôn thi của web)', [
      'FE **3,7/10** — "không hiểu câu tiếng Nhật dịch ra gì" nên khoanh mò.',
      'Reading — **ngắt sai, đọc rời từng chữ** không thành câu; chữ Hán không thuộc; nhầm hiragana/katakana; **sai âm ngắt っ và trường âm**.',
      'Talking — **không nghe hiểu câu hỏi của giám thị** (3 câu tranh + 1 câu ngoài), từ vựng trong tranh chưa thuộc.',
      '⇒ Bài này chữa đúng ba chỗ đó: quy trình đọc theo cụm (mục 2), bảng "từ để hỏi → câu trả lời" (mục 3), chiến lược FE (mục 5).',
    ]),

    H('1. Buổi thi nói — làm gì ở từng bước'),
    TABLE(
      ['Bước', 'Bạn làm', 'Câu nói (thuộc lòng)'],
      [
        ['Trước cửa', 'Tắt điện thoại (không mang vào hoặc tắt nguồn cho giám thị xác nhận), cầm sẵn thẻ SV / giấy tờ tuỳ thân', '—'],
        ['Vào phòng', 'Gõ cửa, mở cửa, cúi chào nhẹ', JR('しつれい します。')],
        ['Chào + tên', 'Đứng/ngồi khi được mời, nhìn giám thị', JR('こんにちは。 ^グエン です。 よろしく おねがい します。')],
        ['Điểm danh', 'Giám thị xác nhận trên e360 — chờ yên lặng', '—'],
        ['Reading', 'Nhận đề → **30 giây** chuẩn bị (xem mục 2) → đọc to một lượt đến dấu 。 cuối', '—'],
        ['Talking', '3 câu có tranh + 1 câu không tranh. Không nghe rõ → xin nhắc lại (tối đa 2 lần / câu, không bị trừ)', JR('すみません、 もう {一度|いちど} おねがい します。')],
        ['Ra phòng', 'Đứng dậy, cúi chào — **đừng quên câu này**, nó nằm trong 5 điểm Presenting', JR('ありがとう ございました。 しつれい します。')],
      ],
      'Thi vấn đáp 1–1, khoảng 5–7 phút (kể cả thời gian chấm); giám thị ghi âm để phúc tra',
    ),

    H('2. Reading — quy trình "đọc theo cụm"'),
    TABLE(
      ['Việc', 'Cách làm', 'Ví dụ'],
      [
        ['Ngắt sau trợ từ', 'Mỗi cụm kết thúc ở は・を・に・で・へ・と・も・から・まで, hoặc 、。 — một hơi một cụm', '{私|わたし}は ／ まいあさ ／ {六時|ろくじ}に ／ おきます。'],
        ['Không tách giữa từ', 'Từ ghép đọc liền, kể cả khi dài', 'にほんごがっこうの (một cụm) — không にほんご／がっこう'],
        ['Từ hỏi + です', 'Đọc liền một hơi', 'なんじですか · いくらですか'],
        ['Số đọc trước trong 30 giây', 'Đọc thầm mọi con số và ngày tháng trước khi đọc cả bài', '{九時|くじ} · {二十日|はつか} · {八百円|はっぴゃくえん}'],
        ['Vấp giữa chừng', 'Đọc lại TỪ ĐẦU CỤM đó, không đọc lại cả câu, không im lặng', '…{日本語|にほんご}を、 にほんごを べんきょうします'],
      ],
    ),

    H('3. Talking — nghe từ để hỏi, biết ngay câu trả lời phải có gì'),
    TABLE(
      ['Giám thị hỏi…', 'Câu trả lời PHẢI chứa', 'Khung trả lời'],
      [
        ['なんさい ですか', 'số + さい (20 = はたち)', JR('〜-さん は {四十一歳|よんじゅういっさい} です。')],
        ['〜ですか (KHÔNG có từ hỏi)', '**はい／いいえ** trước, rồi cả câu', JR('いいえ、 〜 じゃ ありません。 〜 です。')],
        ['おくに は どちら ですか', 'tên nước (không さん)', JR('ベトナム です。')],
        ['だれの 〜ですか', 'tên người + の', JR('それ は ワン-さん の です。')],
        ['どこの 〜ですか', 'tên nước/hãng + の', JR('ドイツ の カメラ です。')],
        ['なんの 〜ですか', 'nguyên liệu/loại + の', JR('とりにく の りょうり です。')],
        ['いくら ですか', 'số + えん', JR('{八百円|はっぴゃくえん} です。')],
        ['なんがい ですか', 'số + かい／がい', JR('{三階|さんがい} です。')],
        ['ご{注文|ちゅうもん}、 どうぞ', 'món + を + (số つ) + ください', JR('カレー を {一つ|ひとつ} ください。')],
        ['なんじ から なんじ まで', 'giờ から giờ まで', JR('{九時|くじ} から {五時|ごじ} まで です。')],
        ['なんようび ですか', '〜ようび', JR('げつようび です。')],
        ['なにを しますか', '(nơi) で (việc) を します', JR('コンビニ で アルバイト を します。')],
        ['どこへ いきますか', '(nơi) へ いきます', JR('こうえん へ いきます。')],
        ['ここで なにを しますか', 'việc làm ở nơi trên tranh', JR('ここ で ほん を よみます。')],
        ['〜を V-ますか', 'はい、V-ます ／ いいえ、V-ません', JR('いいえ、 のみません。')],
      ],
    ),
    NOTE('Ba câu "cứu điểm" khi bí', [
      'Không nghe rõ: 「すみません、もう一度お願いします」 — tối đa **2 lần mỗi câu**, không bị trừ (nói tiếng Việt cũng được).',
      'Cần vài giây nghĩ: 「ええと…」 rồi nói — **im lặng lâu** mới mất điểm lưu loát (2 điểm/câu), chữ ええと thì không.',
      'Không biết từ: nói phần mình chắc chắn bằng khung đúng (vd. hỏi giá mà quên cách đọc 3.500 → vẫn nói 「〜は 〜えんです」 với số mình đọc được). Câu đúng khung, sai một từ vẫn còn tối đa 3 điểm; im lặng là 0.',
    ]),

    H('4. Giám thị chấm một câu trả lời thế nào — tự đoán điểm'),
    P('Áp 4 luật của hướng dẫn: **sai hiểu nội dung → 0** · **lỗi không đổi nghĩa → trừ tối đa 5** · **đúng ngữ pháp nhưng sai từ vựng → tối đa 3** · **sai trợ từ → −2**; mỗi câu có **2 điểm lưu loát/phát âm**. Câu có tranh tối đa 15, câu không tranh 10.'),
    MC('tt113-cl-diem', 'Giám thị cho bao nhiêu điểm? (10 tình huống)', [
      Q('Câu có tranh (15đ). Hỏi: 「アンナさんは がくせいですか。」 Bạn: 「がくせいです。」 (đúng thông tin)', 'Khoảng 10 — quên はい, trừ tối đa 5', '15 — đúng thông tin là đủ | 0 — sai | 13 — sai trợ từ', 'Câu Có/Không quên はい／いいえ = lỗi không đổi nghĩa → trừ tối đa 5.'),
      Q('Hỏi: 「としょかんで なにを しますか。」 Bạn: 「としょかんに ほんを よみます。」', 'Khoảng 13 — sai trợ từ −2', '15 | 0 | 3', 'に thay で = sai trợ từ, −2.'),
      Q('Hỏi: 「カメラは いくらですか。」 (tranh ghi 35.000円) Bạn: 「さんまんごせんえんです。」', '15 — đúng', '13 — thiếu chủ ngữ | 10 — câu ngắn | 3 — sai từ', 'Đúng thông tin, đúng số, câu đủ ý.'),
      Q('Hỏi: 「カメラは いくらですか。」 (tranh ghi 35.000円) Bạn: 「さんぜんごひゃくえんです。」 (= 3.500 yên)', '0 — sai thông tin', '13 | 10 | 3', 'Đọc sai số thành con số khác = hiểu sai nội dung → mất hết. Ôn số!'),
      Q('Hỏi: 「まいあさ、なにを たべますか。」 Bạn: 「パンを のみます。」', 'Tối đa 3 — đúng ngữ pháp, sai từ vựng (のみます)', '13 | 0 | 10', 'Hiểu câu, đúng khung, sai động từ → tối đa 3.'),
      Q('Hỏi: 「おくには どちらですか。」 Bạn: 「ベトナムさんです。」', 'Bị trừ — nói sai (không gắn さん cho tên nước), vẫn hiểu được', '15 — không sao | 0 — sai hoàn toàn | 3 — sai từ', 'Lỗi không đổi nghĩa → bị trừ (tối đa 5). Không bao giờ gắn さん cho nước hoặc cho chính mình.'),
      Q('Hỏi: 「しゅみは なんですか。」 (câu không tranh, 10đ) Bạn: 「わたしの しゅみは サッカーです。」', '10 — đúng trọn câu', '8 | 5 | 3', 'Đúng ngữ pháp, đúng ý, trọn câu.'),
      Q('Bạn không nghe rõ, nói 「すみません、もう一度お願いします」 hai lần rồi trả lời đúng.', 'Không bị trừ', 'Trừ 2 | Trừ 5 | Mất câu', 'Được xin nhắc lại tối đa 2 lần, không bị trừ điểm.'),
      Q('Reading: bạn đọc sai 5 chữ hiragana, đúng hết chữ Hán và katakana.', '39 / 40', '35 / 40 | 30 / 40 | 38 / 40', '5 × 0,2 = 1 ⇒ 40 − 1 = 39.'),
      Q('Bạn vào phòng không chào, lúc ra có nói 「ありがとうございました。しつれいします」.', 'Mất một phần điểm Presenting (5)', 'Không sao | Mất hết 55 điểm Talking | Bị đình chỉ thi', 'Presenting chấm chào khi vào **và** trước khi ra.'),
    ]),

    H('5. FE 45 phút — chiến lược 30 câu'),
    TABLE(
      ['Thời gian', 'Câu', 'Làm gì'],
      [
        ['0–8 phút', '1–8 (chữ Hán)', 'Đọc chữ Hán + chọn chữ Hán. Câu đọc: loại đáp án "quên biến âm" (はちふん, ろくひゃく, さんせん). Câu chọn chữ: loại chữ "giống mặt" (目/日, 入/人, 干/千, 牛/午, 問/間, 全/金).'],
        ['8–33 phút', '9–26 (điền chỗ trống)', 'Đọc **cả câu** (và cả câu trả lời B nếu có) TRƯỚC khi nhìn đáp án. Câu B trả lời gì → câu A hỏi bằng từ gì.'],
        ['33–38 phút', '27–30', 'Sắp xếp câu: tìm は → động từ ở cuối → trợ từ đi với danh từ. Khác loại: gọi tên nhóm của 3 từ còn lại.'],
        ['38–45 phút', 'Soát', 'Tô/chọn đủ 30 câu. **Không bỏ trống** — câu sai không bị trừ.'],
      ],
    ),
    NOTE('Năm bẫy FE xuất hiện nhiều nhất (tổng hợp từ 14 đề FE thật)', [
      '**Số đọc bất quy tắc**: 4時 よじ · 9時 くじ · 8分 はっぷん · 10分 じゅっぷん · 20日 はつか · 3日 みっか · 1万 いちまん · 3千 さんぜん · 8千 はっせん · 6百 ろっぴゃく.',
      '**Trợ từ đôi**: から／まで · や／など · へも · ✕／に (毎朝・毎晩 không có に, giờ cụ thể có に).',
      '**これ/この, それ/その**: có danh từ đi ngay sau → この/その/あの; đứng một mình → これ/それ/あれ.',
      '**Câu đáp hội thoại**: よろしく → こちらこそ · khen kế hoạch → いいですね · hỏi bằng động từ → đáp bằng động từ (không そうです).',
      '**Động từ đi với từ**: テレビ/えいが を みます · おんがく を ききます · ほん/しんぶん を よみます · スポーツ/アルバイト/りょこう を します.',
    ]),

    H('6. Lỗi mất điểm hay gặp — kiểm tra lại mình'),
    MC('tt113-cl-loi', 'Câu nào ĐÚNG? (8 câu)', [
      Q('Tự giới thiệu, câu nào đúng?', '{私|わたし}は グエンです。', '{私|わたし}は グエンさんです。 | グエンさんは {私|わたし}です。 | {私|わたし}の グエンです。', 'Không gắn さん cho chính mình.'),
      Q('Hỏi 「{日曜日|にちようび}、どこへ {行|い}きますか」, câu nào đúng?', 'こうえんへ {行|い}きます。', 'こうえんで {行|い}きます。 | こうえんを {行|い}きます。 | こうえんです {行|い}きます。', 'Đích đến → へ.'),
      Q('Hỏi 「コーヒーを {飲|の}みますか」, câu nào đúng (không uống)?', 'いいえ、{飲|の}みません。', 'いいえ、コーヒーじゃありません。 | いいえ、そうです。 | はい、{飲|の}みません。', 'Hỏi động từ → đáp động từ phủ định; いいえ đi với ません.'),
      Q('Cái túi ở gần người nghe, câu nào đúng?', 'その かばんは いくらですか。', 'それ かばんは いくらですか。 | その は いくらですか。 | そこ かばんは いくらですか。', 'その + N.'),
      Q('Câu nào đọc đúng 「{四月|しがつ}{四日|よっか}」?', 'しがつ よっか', 'よんがつ よっか | しがつ よんにち | よんがつ よんにち', 'Tháng 4 = しがつ, ngày 4 = よっか.'),
      Q('Câu nào đúng?', '{毎朝|まいあさ}、{七時|しちじ}に {起|お}きます。', '{毎朝|まいあさ}に、{七時|しちじ}に {起|お}きます。 | {毎朝|まいあさ}、{七時|しちじ}で {起|お}きます。 | {毎朝|まいあさ}、{七時|しちじ}を {起|お}きます。', '毎朝 không có に; giờ + に.'),
      Q('Gọi món, câu nào đúng?', 'ハンバーグを ふたつ ください。', 'ハンバーグが ふたつ ください。 | ハンバーグを につ ください。 | ハンバーグの ふたつ ください。', 'N を 〜つ ください; 2 cái = ふたつ (không につ).'),
      Q('Hỏi 「{休|やす}みの{日|ひ}、{何|なに}をしますか」, câu nào đúng?', 'うちで テレビを {見|み}ます。', 'うちへ {行|い}きます。 | うちに テレビを {見|み}ます。 | うちで テレビを {読|よ}みます。', 'なにを → việc làm; nơi làm → で; テレビ → みます.'),
    ]),
    NOTE('Học tiếp', [
      'Danh sách 20 lỗi chi tiết + bài sửa câu: **Ôn thi JPD113 — Phòng khám lỗi** (`on113-loi-mat-diem`).',
      'Mẫu trả lời đủ 27 câu hỏi mẫu của cô + 3 bộ tranh: `on113-noi-mau`. Đọc to theo khuôn đề từng bài: `b1-doc-to` … `b3-doc-to`.',
    ]),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *             BẢNG TỰ CHẤM & SAI PHẦN NÀO ÔN BÀI NÀO
 * ═══════════════════════════════════════════════════════════════════ */

const TU_CHAM: Lesson = {
  id: 'b3-thi-thu-113-tu-cham',
  kind: 'review',
  title: '📊 Bảng tự chấm JPD113 & sai phần nào ôn bài nào — phiếu điểm thi nói, quy đổi FE, bản đồ ôn lại theo từng dạng câu',
  goal: 'Tự chấm 3 đề thi thử bằng đúng phiếu điểm của giám thị, quy đổi điểm FE, và biết chính xác câu sai thuộc dạng nào — phải học lại lesson nào trước ngày thi.',
  minutes: 25,
  blocks: [
    RECAP('Dùng bảng này thế nào', [
      'Làm xong mỗi đề (`b3-thi-thu-113-de-1` … `-de-3`): nghe lại bản ghi âm, chấm phần nói theo **mục 1**; đếm câu FE đúng, quy đổi theo **mục 2**.',
      'Mỗi câu sai: tra **mục 3** xem nó thuộc dạng nào → học lại đúng lesson đó → làm lại câu đó sau 2 ngày.',
      '**Mục tiêu 9–10**: thi nói ≥ 90/100 và FE ≥ 27/30 ở **cả 3 đề**, mỗi đề làm trong đúng thời gian.',
    ]),

    H('1. Phiếu tự chấm thi nói (100 điểm)'),
    TABLE(
      ['Mục', 'Tối đa', 'Tự chấm thế nào (nghe bản ghi âm)', 'Đề 1', 'Đề 2', 'Đề 3'],
      [
        ['Presenting — chào vào + chào ra', '5', 'Đủ cả hai câu chào: 5 · thiếu một: trừ một phần', '…', '…', '…'],
        ['Reading — 4 từ chữ Hán', '12', '≈ 3 mỗi từ đọc đúng (đếm trên bảng "4 từ gạch chân" của đề)', '…', '…', '…'],
        ['Reading — 4 từ katakana', '12', '≈ 3 mỗi từ đọc đúng (đủ ー, ッ, ン)', '…', '…', '…'],
        ['Reading — hiragana', '16', '16 − 0,2 × số chữ đọc sai', '…', '…', '…'],
        ['Talking — tranh 1', '15', 'Áp bảng chấm mẫu của đề: 0 / ≤3 / −5 / −2 mỗi trợ từ', '…', '…', '…'],
        ['Talking — tranh 2', '15', 'như trên', '…', '…', '…'],
        ['Talking — tranh 3', '15', 'như trên', '…', '…', '…'],
        ['Talking — câu không tranh', '10', 'như trên (tối đa 10)', '…', '…', '…'],
        ['Ngập ngừng', '−', 'Ngập ngừng nhiều: trừ ≤ 5% mỗi đầu điểm (Reading tối đa ≈ −2)', '…', '…', '…'],
        ['**TỔNG**', '**100**', 'Chia 10 = điểm thi nói hệ 10', '…', '…', '…'],
      ],
      'Chép bảng ra giấy/ghi chú điện thoại và điền điểm sau mỗi đề',
    ),

    H('2. Quy đổi điểm FE (30 câu → 10 điểm)'),
    TABLE(
      ['Đúng', 'Điểm', 'Đúng', 'Điểm', 'Đúng', 'Điểm'],
      [
        ['30', '10', '24', '8', '18', '6'],
        ['29', '9,7', '23', '7,7', '15', '5'],
        ['28', '9,3', '22', '7,3', '12', '**4 — mức đạt**'],
        ['27', '**9**', '21', '7', '≤ 11', '❌ dưới 4 — trượt FE'],
      ],
      'Mỗi câu = 1/3 điểm · 45 phút · đạt khi ≥ 4 (theo 14 đề FE thật trong Phòng thi)',
    ),

    H('3. Sai câu nào → ôn lesson nào'),
    TABLE(
      ['Dạng câu sai', 'Thường sai vì', 'Ôn ở đâu (id lesson)'],
      [
        ['FE 1–4 · đọc chữ Hán (số, giờ, ngày, tuổi)', 'Quên biến âm: よじ, くじ, はっぷん, はつか, いっさい, さんぜん, ろっぴゃく', '`b1-kanji` · `b2-kanji` · `b3-kanji` (+ Chữ Hán của lớp) · `lt-b2-chu-han` · `lt-b3-chu-han` · `on113-ngu-phap-tu-vung` mục D'],
        ['FE 5–8 · chọn chữ Hán', 'Nhầm chữ giống mặt (日/目, 人/入, 千/干, 午/牛, 金/全)', '`lt-b1-chu-han` · `lt-b2-chu-han` · `lt-b3-chu-han` · ôn bằng thẻ (`?bai=on-tap-the`)'],
        ['FE · trợ từ は/の/と/も', 'Bài 1: は ↔ の, と ↔ も', '`b1-ngu-phap` · `lt-b1-ngu-phap-1` … `-3`'],
        ['FE · これ/この/ここ, いくら, なんの/どこの/だれの, 〜語で', 'Bài 2: chỉ thị + từ hỏi', '`b2-ngu-phap` · `lt-b2-ngu-phap-1` … `-tron`'],
        ['FE · へ/を/に/で, から/まで, や/など, へも', 'Bài 3: trợ từ của động từ', '`b3-ngu-phap` · `lt-b3-ngu-phap-1` … `-tron` · `s113-b3-05-ya-nado-nanimo-dokoemo`'],
        ['FE · câu đáp hội thoại (こちらこそ, いいですね…)', 'Chưa thuộc câu giao tiếp', '`b1-hoi-thoai` · `b2-hoi-thoai` · `b3-hoi-thoai` · `lt-b3-hoi-thoai`'],
        ['FE · động từ / từ vựng / khác loại / nghĩa', 'Từ vựng chưa chắc', '`b1-tu-vung` · `b2-tu-vung` · `b3-tu-vung` · `lt-b3-tu-vung` · ôn bằng thẻ'],
        ['Reading · sai chữ Hán gạch chân', 'Chưa thuộc cách đọc từ', '`b1-doc-to` · `b2-doc-to` · `b3-doc-to` (bảng 4 từ mỗi đoạn) · `on113-doc-to`'],
        ['Reading · sai ー / っ / ん / ゃゅょ, đọc rời từng chữ', 'Chưa đọc theo nhịp và theo cụm', '`b1-doc-to` mục 3 (bẫy phát âm) · khối máy chấm từng câu · `b0` (kana, âm đặc biệt)'],
        ['Talking · không nghe ra câu hỏi', 'Tai chưa quen câu hỏi giám thị', '`b1-noi` · `b2-noi` · `b3-noi` · `on113-noi-mau` · khối 🎧 của 3 đề thi thử'],
        ['Talking · quên はい／いいえ, trả lời cụt, sai trợ từ', 'Chưa có khung trả lời', '`b3-thi-thu-113-chien-luoc` mục 3 · `on113-loi-mat-diem`'],
        ['Talking · nói sai số (giá, giờ, tầng, tuổi)', 'Số đọc chưa phản xạ', '`on113-ngu-phap-tu-vung` mục 3 + D · `s113-b2-03-so-va-gia-tien` · `s113-b3-01-doc-gio-hoi-gio-mo-cua`'],
        ['Presenting · quên chào', 'Chưa thuộc 2 câu', '`b3-thi-thu-113-chien-luoc` mục 1 — đọc to 10 lần trước ngày thi'],
      ],
    ),

    H('4. Điểm hiện tại → làm gì tiếp'),
    TABLE(
      ['Kết quả 3 đề', 'Kế hoạch'],
      [
        ['FE < 12/30 ở bất kỳ đề nào', '**Dừng làm đề.** 3 ngày học lại từ vựng + trợ từ Bài 1–3 (`b1-tu-vung` → `b3-ngu-phap`), rồi làm `on113-de-tong-hop`, sau đó mới làm lại đề thi thử.'],
        ['FE 12–23', 'Mỗi ngày: 1 lesson `lt-b…-ngu-phap` đúng dạng sai nhiều nhất + 20 câu ôn bằng thẻ. Làm lại đề sau 2 ngày.'],
        ['FE 24–26', 'Chỉ chữa dạng sai (mục 3). Làm lại đề cũ — phải đạt ≥ 27.'],
        ['FE ≥ 27 cả 3 đề', '✅ FE xong — dồn thời gian sang thi nói.'],
        ['Nói < 70', 'Reading: mỗi ngày 2 đoạn `bN-doc-to` có máy chấm. Talking: thuộc khung ở `b3-thi-thu-113-chien-luoc` mục 3.'],
        ['Nói 70–89', 'Nghe lại bản ghi: lỗi nào lặp ≥ 2 lần (trợ từ? はい/いいえ? số?) → luyện riêng lỗi đó.'],
        ['Nói ≥ 90 cả 3 đề', '✅ Diễn thử cả buổi với người khác hỏi, không nhìn chữ, thêm 1 lần trước ngày thi.'],
      ],
    ),

    H('5. Kiểm tra: bạn đã biết tự chấm chưa? (6 câu)'),
    MC('tt113-tc-kt', 'Tự chấm', [
      Q('Bạn đúng 25/30 câu FE. Điểm FE là…', '8,3', '8 | 8,5 | 7,5', '25 ÷ 3 ≈ 8,3.'),
      Q('Cần đúng ít nhất bao nhiêu câu FE để đạt (≥ 4 điểm)?', '12 câu', '10 câu | 15 câu | 20 câu', '12 ÷ 3 = 4.'),
      Q('Muốn FE 9 điểm, cần đúng…', '27 câu', '25 câu | 28 câu | 24 câu', '27 ÷ 3 = 9.'),
      Q('Bạn sai 3 câu FE đều là 「九時」「八分」「二十日」. Nên ôn trước…', 'Cách đọc số – giờ – ngày bất quy tắc (`b3-kanji`, `on113-ngu-phap-tu-vung` mục D)', 'Câu đáp hội thoại | Từ khác loại | Katakana', 'Cả ba đều là số đọc bất quy tắc.'),
      Q('Bản ghi âm cho thấy bạn quên はい／いいえ ở cả 2 câu Có/Không (mỗi câu 15 điểm). Có thể mất tới…', '10 điểm', '2 điểm | 4 điểm | 30 điểm', 'Mỗi câu trừ tối đa 5 ⇒ 2 câu tới 10 điểm.'),
      Q('Reading: đúng 4 từ chữ Hán, sai 1 từ katakana, sai 4 chữ hiragana. Điểm Reading khoảng…', '36,2', '39,2 | 35 | 32', '40 − 3 (một từ katakana) − 0,8 (4 × 0,2) = 36,2.'),
    ]),
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *                              XUẤT
 * ═══════════════════════════════════════════════════════════════════ */

export const THI_THU_113: Lesson[] = [deThi(DE_1), deThi(DE_2), deThi(DE_3), CHIEN_LUOC, TU_CHAM];
