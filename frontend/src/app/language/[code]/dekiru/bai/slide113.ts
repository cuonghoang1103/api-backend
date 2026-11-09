/**
 * JPD113 (Nhật 1) — SLIDE BÀI GIẢNG THEO TỪNG SLOT, Bài 1–3 (できる日本語 初級), soạn 09/11/2026.
 *
 * ⚠ TRUNG THỰC: JPD113 KHÔNG có slide thật của cô trong tay người học. Bộ này là slide MÌNH DỰNG theo đúng
 * bảng Session của đề cương JPD113 (60 tiết 45′ = 20 slot × 135′; slot n = tiết 3n−2…3n) và bám thứ tự +
 * nội dung các buổi đã soạn bằng chữ ở jp113B12.ts / jp113B3.ts; phong cách học theo slide thật của cô ở
 * JPD123 (Nhật 2): bìa → ôn → từ mới tranh to + nhãn → mẫu câu (ô vàng) → hội thoại A/B → チャレンジ luyện cặp
 * → chữ Hán từng chữ → câu cô hay gọi (lấy từ 38 Constructive Questions của đề cương) → tóm tắt.
 *
 * Chia slot (đề cương):
 *   Slot 7  (tiết 19–21) Bài 1 ST1 チャレンジ1–5: tên · nước · nghề (ポイント 1, 2, 3 どちら)
 *   Slot 8  (22–24) ST1 チャレンジ6 N1のN2 + やってみよう · ST2 〜歳 · いつ 〜月〜日
 *   Slot 9  (25–27) ST2 やってみよう + 練習問題 · ST3 何ですか · N1とN2
 *   Slot 10 (28–30) ST3 Nも + やってみよう · 漢字 第1課 · 第1課復習
 *   Slot 11 (31–33) Bài kiểm tra 1 · Bài 2 ST1 何階
 *   Slot 12 (34–36) ST1 ここ・そこ・あそこ / こちら… · ST2 いくら, これ・それ・あれ
 *   Slot 13 (37–39) ST2 このN · Nをください · やってみよう · 値段の読み方
 *   Slot 14 (40–42) ST3 何のN · 〜語で · どこのN · 〜つ · だれのN
 *   Slot 15 (43–45) ST3 やってみよう + 漢字 第2課 + 第2課復習 (deck Bài 2)  |  Bài 3 ST1 今何時ですか (deck Bài 3)
 *   Slot 16 (46–48) ST1 〜から〜まで · 何曜日 · やってみよう · 漢字 第3課
 *   Slot 17 (49–51) ST2 Vます(予定) · 〜を · 〜へ · Vません
 *   Slot 18 (52–54) ST2 〜で + やってみよう · ST3 Vます(習慣) · や〜など · 何も · 〜に
 *   Slot 19 (55–57) ST3 〜から〜まで V · どこへも · やってみよう · もう一度聞こう · 第3課復習
 *   (Slot 1–6 = bảng chữ; Slot 20 = Bài kiểm tra 2 + ôn cuối kỳ — không có deck riêng, dùng 3 bộ "Slide tổng hợp".)
 *
 * Chữ Hán theo danh sách CHÍNH THỨC của lớp: B1 私人才学生校日本語 · B2 一二三四五六七八九十百千万円 ·
 * B3 月火水木金土日曜何年時間分. Câu ví dụ, hội thoại VIẾT MỚI; chỉ dùng từ/ngữ pháp đã học tới slot đó.
 *
 * Câu tiếng Nhật trong `j` viết bằng "DSL từ" (như jp113B12.ts): các từ cách nhau dấu cách, chữ Hán {漢字|かな},
 * `^` = viết hoa romaji (tên riêng), `-` = gạch nối romaji; romaji SINH TỰ ĐỘNG từ kana nên luôn khớp furigana.
 * Dòng bắt đầu bằng `!` = dòng chữ thường (tiếng Việt / ví dụ sai), không có romaji. `Tên： câu` = lời thoại.
 */
import type { Block, Lesson, Slide } from '@/components/sach-hoc/types';

/* ══════════════ romaji tự động từ furigana (cùng thuật toán jp113B12.ts) ══════════════ */

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
    const PUN: Record<string, string> = { '。': '.', '、': ',', '？': '?', '！': '!', '…': '...', '「': '"', '」': '"', '〜': '~', '～': '~', '＿': '_', '：': ':' };
    if (PUN[c] !== undefined) { out += PUN[c]; continue; }
    if (/[ぁぃぅぇぉ]/.test(c)) continue;
    if (/[（）()・\s*]/.test(c)) continue;
    out += c;
  }
  return out;
}
const reading = (t: string) => t.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2');

/** Tên riêng (nước, trường) — romaji tự viết hoa: {日本|…} · {日本人|…} · {日本語|…} · ベトナム… · ふじ · さくら (trường). */
const PROPER = /^(\{(日本|中国|韓国)(人|語)?\||タイ|ベトナム|アメリカ|イタリア|オーストラリア|ロシア|ブラジル|フランス|ドイツ|インド|ふじ$|さくら$)/;

/** Một "từ" (token) của DSL → [chữ Nhật, romaji]. */
function tok(t: string): [string, string] {
  let cap = false;
  let x = t;
  if (x.startsWith('^')) { cap = true; x = x.slice(1); }
  if (PROPER.test(x)) cap = true;
  const ja = x.replace(/-/g, '');
  const plain = reading(x).replace(/\*/g, '');
  const body = plain.replace(/[。、？！「」]+$/, '');
  const tail = plain.slice(body.length);
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
    if (!r) continue;
    if (start && /^[A-Za-z]/.test(r)) { r = r.charAt(0).toUpperCase() + r.slice(1); start = false; }
    else if (start && /^[“"]/.test(r)) start = false;
    out += (out ? ' ' : '') + r;
    if (/[.?!]["]?$/.test(r)) start = true;
  }
  return out;
};
/** Romaji chữ thường (cho bảng từ). */
const RL = (s: string): string => toks(s).map((t) => tok(t)[1]).filter(Boolean).join(' ');
/** Đáp án viết một lần bằng DSL → "chữ Nhật (romaji)". */
const A = (s: string): string => `${J(s)} (${R(s)})`;

/* ══════════════ dựng slide ══════════════ */

/** Một dòng `j`: `!…` = chữ thường; `Tên： câu` = lời thoại (romaji chỉ của câu); còn lại = câu DSL. */
function line(s: string): [string, string] {
  if (s.startsWith('!')) return [s.slice(1), ''];
  const m = /^([^：]{1,30}：)\s+(.*)$/.exec(s);
  if (m) return [m[1] + J(m[2]), R(m[2])];
  return [J(s), R(s)];
}

type SO = {
  anh?: string[];
  nhan?: string[];
  j?: string[];
  bang?: { head: string[]; rows: string[][] };
  hoi?: string;
  dap?: string;
  ghi: string;
};
function S(tieuDe: string, o: SO): Slide {
  const sl: Slide = { tieuDe };
  if (o.anh?.length) sl.anh = o.anh;
  if (o.nhan?.length) sl.nhan = o.nhan;
  if (o.j?.length) {
    const ls = o.j.map(line);
    sl.dong = ls.map((x) => x[0]);
    if (ls.some((x) => x[1])) sl.ro = ls.map((x) => x[1]);
  }
  if (o.bang) sl.bang = o.bang;
  if (o.hoi) sl.hoi = o.hoi;
  if (o.dap) sl.dap = o.dap;
  sl.ghi = o.ghi;
  return sl;
}
const B = (head: string[], rows: string[][]) => ({ head, rows });

/**
 * Slide chữ Hán của lớp — một chữ một slide: chữ to, Hán Việt + nghĩa, âm On / Kun, bảng từ ví dụ
 * (`tu` = [từ DSL, nghĩa]; cột đọc sinh tự động: hiragana · romaji).
 */
function HAN(so: string, chu: string, hv: string, nghia: string, on: string, kun: string, tu: [string, string][], ghi: string, anh?: string): Slide {
  return S(`{漢字|かんじ} ${so} — 「${chu}」 ${hv}`, {
    anh: anh ? [anh] : undefined,
    nhan: anh ? [chu] : undefined,
    j: [`!**${chu}**`, `!Hán Việt: **${hv}** — ${nghia}`, `!Âm On (音読み): **${on}**`, `!Âm Kun (訓読み): **${kun}**`],
    bang: B(['Từ', 'Cách đọc', 'Nghĩa'], tu.map(([w, vi]) => [J(w), `${reading(J(w))} · ${RL(w)}`, vi])),
    ghi,
  });
}

/* ══════════════ trắc nghiệm + bài ══════════════ */

type QI = { q: string; options: string[]; correct: number; why: string };
let MC_N = 0;
/** `ok` = đáp án đúng; `bad` = các đáp án sai cách nhau " | "; vị trí đúng xoay vòng. */
const Q = (q: string, ok: string, bad: string, why: string): QI => {
  const b = bad.split(' | ');
  const pos = (MC_N++ * 5 + 1) % (b.length + 1);
  const options = [...b];
  options.splice(pos, 0, ok);
  return { q, options, correct: pos, why };
};

function SLOT(
  bai: number, slot: string, slug: string, noiDung: string, goal: string,
  recap: string[], deckTitle: string, slides: Slide[], kt: QI[],
): Lesson {
  const blocks: Block[] = [
    { t: 'recap', title: `Mục tiêu buổi — Slot ${slot}`, items: recap },
    { t: 'slides', id: `s113-slides-b${bai}-${slot}`, title: deckTitle, slides },
    { t: 'mcq', id: `s113-slide-b${bai}-${slot}-kiem-tra`, title: `Kiểm tra cuối buổi — Slot ${slot}`, items: kt },
  ];
  return {
    id: `s113-slide-b${bai}-slot-${slot}-${slug}`,
    kind: 'review',
    title: `📽️ Slot ${slot} — ${noiDung} (slide bài giảng)`,
    goal,
    minutes: 45,
    blocks,
  };
}

function TONG_HOP(bai: number, goal: string, recap: string[], deckTitle: string, slides: Slide[], kt: QI[]): Lesson {
  return {
    id: `slide-tong-hop-b${bai}`,
    kind: 'review',
    title: `📽️ Slide tổng hợp từ vựng & ngữ pháp Bài ${bai}`,
    goal,
    minutes: 40,
    blocks: [
      { t: 'recap', title: `Bộ slide tổng hợp Bài ${bai} có gì`, items: recap },
      { t: 'slides', id: `s113-slides-tong-hop-b${bai}`, title: deckTitle, slides },
      { t: 'mcq', id: `s113-tong-hop-b${bai}-kiem-tra`, title: `Tự kiểm tra sau bộ tổng hợp Bài ${bai}`, items: kt },
    ],
  };
}

/** Trang "Đánh giá" như slide đầu khoá của cô (theo mục assessment của đề cương JPD113). */
const DANH_GIA = S('Đánh giá môn JPD113', {
  bang: B(['Đầu điểm', 'Trọng số', 'Nội dung'], [
    ['Tham gia giờ học', '15%', 'đi đủ buổi, phát biểu, làm bài trên lớp'],
    ['Kiểm tra nhỏ (2 bài)', '40%', 'Bài 1: bảng chữ + Bài 1 (Slot 11) · Bài 2: Bài 2 + Bài 3 (Slot 20)'],
    ['Cuối kỳ — trắc nghiệm', '15%', 'từ vựng · ngữ pháp · chữ Hán Bài 1–3'],
    ['Cuối kỳ — Nói', '30%', 'đọc to + trả lời câu hỏi của giám khảo'],
  ]),
  ghi: 'Phần Nói chiếm 30% — nhiều nhất cả môn, nên buổi nào cũng phải mở miệng đọc to theo slide. Hai bài kiểm tra nhỏ gộp lại 40%: học đều từng bài là qua.',
});

/* ═════════════════════════════ BÀI 1 はじめまして ═════════════════════════════ */

/* ── Slot 7 (tiết 19–21): ST1 チャレンジ1–5 ── */
const B1_SLOT07 = SLOT(
  1, '07', 'chao-ten-nuoc-nghe',
  'Bài 1 ST1: はじめまして — tên, nước, công việc (ポイント 1, 2, どちら)',
  'Chào lần đầu gặp, nói tên – nước – công việc của mình, hỏi lại người kia đúng ba điều đó, và nói được "không phải" bằng じゃありません.',
  [
    '**Mở Bài 1 はじめまして** — mục tiêu cả bài: tự giới thiệu và hỏi bạn mới (tên · nước · nghề · tuổi · sinh nhật · sở thích).',
    '**Chào hỏi lần đầu**: はじめまして · どうぞよろしくお願いします · こちらこそ · あのう、すみません · そうですか.',
    '**ポイント 1 — N1 は N2 です** (tên) · **ポイント 3 — どちら** (お国はどちらですか) · **〜人**.',
    '**ポイント 2 — ですか / はい / いいえ、〜じゃありません** với công việc: 学生 · 先生 · 教師 · 会社員 · 社員.',
    'チャレンジ luyện cặp bằng thẻ nhân vật; cuối buổi trả lời 3 câu cô hay gọi (CQ7.1–7.4).',
  ],
  'JPD113 · Bài 1 はじめまして · Slot 7',
  [
    S('{第1課|だいいっか} はじめまして — Slot 7', {
      anh: ['waving-hand', 'person-bowing', 'handshake'],
      nhan: ['はじめまして', 'よろしくお{願|ねが}いします', 'こちらこそ'],
      j: ['!Hôm nay: **chào lần đầu · nói tên · nói nước · nói công việc**', '!ポイント 1 · ポイント 2 · ポイント 3（どちら）'],
      ghi: 'Bài 1 là bài "làm quen". Ba hình là ba câu bạn sẽ nói nhiều nhất khi gặp ai lần đầu — hết buổi này bạn tự giới thiệu được 4–5 câu.',
    }),
    DANH_GIA,
    S('できること — Học xong Bài 1 làm được gì?', {
      anh: ['name-badge', 'birthday-cake', 'soccer-ball'],
      nhan: ['{名前|なまえ}・{国|くに}・{仕事|しごと}', '{誕生日|たんじょうび}', '{趣味|しゅみ}'],
      j: ['!ST1: nói **tên, nước, công việc** của mình; hỏi người khác.', '!ST2: nói **tuổi**, nói và hỏi **ngày sinh**.', '!ST3: nói và hỏi **sở thích**, nói "**tôi cũng vậy**".'],
      ghi: 'Ba phần ST1–ST3 ghép lại thành một đoạn tự giới thiệu 6–7 câu — đó cũng là phần mở đầu của bài thi nói cuối kỳ.',
    }),
    S('{話|はな}してみよう — Gặp nhau lần đầu', {
      anh: ['woman-student', 'man-student'],
      nhan: ['パク', 'マルコ'],
      j: ['!Hai bạn mới vào lớp, chưa biết tên nhau. Họ sẽ nói gì đầu tiên?'],
      hoi: 'Khi gặp ai đó LẦN ĐẦU, người Nhật chào thế nào và kết lời thế nào? (CQ7.1)',
      dap: 'Mở: はじめまして (hajimemashite). Kết: どうぞよろしくお{願|ねが}いします (douzo yoroshiku onegai shimasu). Người kia đáp: こちらこそ (kochira koso).',
      ghi: 'Đây là câu cô hay hỏi đầu giờ. Nhớ thứ tự: chào → nói tên → kết bằng よろしく, kèm cúi đầu nhẹ.',
    }),
    S('{新|あたら}しいことば ① — Chào lần đầu', {
      anh: ['person-bowing', 'handshake', 'smiling-face-with-smiling-eyes'],
      nhan: ['はじめまして', 'よろしくお{願|ねが}いします', 'こちらこそ'],
      j: ['はじめまして。', 'どうぞ よろしく お{願|ねが}い します。', 'こちら こそ よろしく お{願|ねが}い します。'],
      ghi: 'はじめまして chỉ nói lần ĐẦU gặp. こちらこそ = "chính tôi mới phải (mong bạn giúp đỡ)" — dùng để đáp lại よろしく.',
    }),
    S('{新|あたら}しいことば ② — Gọi người, đáp lời', {
      anh: ['person-raising-hand', 'check-mark-button', 'cross-mark'],
      nhan: ['あのう、すみません', 'はい', 'いいえ'],
      j: ['あのう、 すみません。', 'はい。 ／ いいえ。', 'そう です か。'],
      ghi: 'あのう… là tiếng "dạ…" ngập ngừng trước khi hỏi người lạ. そうですか nói XUỐNG giọng nghĩa là "à, ra vậy" — không phải câu hỏi.',
    }),
    S('ポイント 1 — N1 は N2 です', {
      bang: B(['N1', 'は', 'N2', 'です'], [
        ['{私|わたし}', 'は (wa)', 'ワン', 'です。'],
        ['{私|わたし}', 'は', 'マルコ', 'です。'],
      ]),
      j: ['!**N1 は N2 です** = "N1 là N2"', '{私|わたし} は ^ワン です。'],
      ghi: 'は ở đây là trợ từ, đọc là **wa** chứ không đọc ha. です đặt cuối câu cho lịch sự — câu tiếng Nhật luôn kết thúc bằng động từ / です.',
    }),
    S('チャレンジ 1 — Tự giới thiệu 3 câu', {
      anh: ['woman-student', 'man-student'],
      nhan: ['ワン', 'マルコ'],
      j: [
        'ワン： はじめまして。 {私|わたし} は ^ワン です。 どうぞ よろしく お{願|ねが}い します。',
        'マルコ： はじめまして。 ^マルコ です。 こちら こそ よろしく お{願|ねが}い します。',
      ],
      ghi: 'Marco bỏ 私は mà vẫn đúng — người Nhật hay bỏ chủ ngữ khi đã rõ là nói về mình. Luyện đến khi nói được cả 3 câu không nhìn chữ.',
    }),
    S('お{名前|なまえ}は？ — Hỏi tên', {
      j: ['A： あのう、 お{名前|なまえ} は？', 'B： ^リン です。', 'A： ^リン-さん です か。 ^ダニエル です。 よろしく お{願|ねが}い します。'],
      hoi: 'Tự giới thiệu, nói 「{私|わたし}はワンさんです」 được không?',
      dap: 'Không. さん chỉ gắn vào tên NGƯỜI KHÁC. Nói về mình: {私|わたし}はワンです。 Gọi người khác: ワンさん.',
      ghi: 'お名前は？ là câu hỏi rút gọn rất lịch sự (lên giọng ở は). Chữ お đầu từ = tôn trọng người nghe, nên không dùng cho tên của chính mình.',
    }),
    S('{新|あたら}しいことば ③ — Tên nước', {
      anh: ['map-of-japan', 'globe-showing-asia-australia', 'globe-showing-americas', 'globe-showing-europe-africa'],
      nhan: ['{日本|にほん}', 'ベトナム・{中国|ちゅうごく}・{韓国|かんこく}・タイ', 'アメリカ', 'イタリア・ロシア'],
      j: ['{日本|にほん}、 {中国|ちゅうごく}、 {韓国|かんこく}、 タイ、 ベトナム', 'アメリカ、 イタリア、 オーストラリア、 ロシア'],
      ghi: 'Nước phương Tây viết bằng katakana (アメリカ, イタリア…); nước gần Nhật dùng chữ Hán ({中国|ちゅうごく}, {韓国|かんこく}). Riêng ベトナム, タイ cũng viết katakana.',
    }),
    S('〜{人|じん} — người nước nào', {
      bang: B(['Nước (お{国|くに})', 'Người (〜{人|じん})', 'Romaji'], [
        ['{日本|にほん}', '{日本人|にほんじん}', 'nihonjin'],
        ['{中国|ちゅうごく}', '{中国人|ちゅうごくじん}', 'chuugokujin'],
        ['{韓国|かんこく}', '{韓国人|かんこくじん}', 'kankokujin'],
        ['ベトナム', 'ベトナム{人|じん}', 'betonamujin'],
        ['アメリカ', 'アメリカ{人|じん}', 'amerikajin'],
        ['オーストラリア', 'オーストラリア{人|じん}', 'oosutorariajin'],
      ]),
      j: ['{私|わたし} は ベトナム{人|じん} です。'],
      ghi: 'Gắn 人 sau tên nước, đọc là **じん**. Quy tắc không có ngoại lệ ở Bài 1 — biết tên nước là biết luôn "người nước đó".',
    }),
    S('ポイント 3 — お{国|くに}は どちらですか', {
      bang: B(['Hỏi', 'Đáp'], [['お{国|くに}は **どちら**ですか。', '**ベトナム**です。']]),
      j: ['A： お{国|くに} は どちら です か。', 'B： ベトナム です。'],
      hoi: 'Hỏi 「お国はどちらですか」 — trả lời 「はい、ベトナム人です」 có đúng không?',
      dap: 'Không. Câu hỏi có từ để hỏi (どちら) thì KHÔNG đáp はい／いいえ; hỏi NƯỚC thì đáp TÊN NƯỚC: ベトナムです。',
      ghi: 'Quy tắc vàng: hỏi chỗ nào – đáp chỗ đó. Thay どちら bằng thông tin, bỏ か là xong câu trả lời. どちら là cách nói lịch sự của "ở đâu".',
    }),
    S('チャレンジ 2・3 — Hỏi nước', {
      anh: ['man-student', 'woman-student'],
      nhan: ['マルコ', 'パク'],
      j: [
        'マルコ： ^パク-さん、 お{国|くに} は どちら です か。',
        'パク： {韓国|かんこく} です。 ^マルコ-さん は？',
        'マルコ： イタリア です。',
        'パク： そう です か。',
      ],
      ghi: '〜さんは？ (lên giọng) = "còn bạn thì sao?" — hỏi lại rất gọn, khỏi lặp cả câu. Cuối cùng そうですか xuống giọng để tỏ ra đã nghe.',
    }),
    S('{新|あたら}しいことば ④ — Trường học & công việc', {
      anh: ['student', 'teacher', 'office-worker', 'school'],
      nhan: ['{学生|がくせい}', '{先生|せんせい}・{教師|きょうし}', '{会社員|かいしゃいん}・{社員|しゃいん}', '{高校|こうこう}・{大学|だいがく}'],
      j: ['{日本語|にほんご} {学校|がっこう}', 'お{仕事|しごと} は？'],
      ghi: '学生 = học sinh / sinh viên nói chung. 高校 = cấp 3, 大学 = đại học, 日本語学校 = trường tiếng Nhật. お仕事は？ = "Bạn làm nghề gì?".',
    }),
    S('{先生|せんせい} hay {教師|きょうし}? {会社員|かいしゃいん} hay {社員|しゃいん}?', {
      bang: B(['Từ', 'Dùng khi', 'Ví dụ'], [
        ['{先生|せんせい}', 'gọi / nói về giáo viên KHÁC', '{本田|ほんだ}{先生|せんせい}'],
        ['{教師|きょうし}', 'nói NGHỀ của chính mình', '{私|わたし}は{教師|きょうし}です。'],
        ['{会社員|かいしゃいん}', 'nghề chung: nhân viên công ty', '{私|わたし}は{会社員|かいしゃいん}です。'],
        ['{社員|しゃいん}', 'nhân viên CỦA một công ty cụ thể (Slot 8)', 'ABCの{社員|しゃいん}'],
      ]),
      ghi: 'Giáo viên tự giới thiệu không nói 私は先生です (tự tôn mình là "thầy") mà nói 教師です. Cặp 会社員 / 社員 thì khác ở chỗ có nêu tên công ty hay không.',
    }),
    S('お{仕事|しごと}は？ — Hỏi nghề', {
      anh: ['man-office-worker', 'woman-student', 'woman-teacher'],
      nhan: ['{会社員|かいしゃいん}', '{学生|がくせい}', '{教師|きょうし}'],
      j: ['A： お{仕事|しごと} は？', 'B： {会社員|かいしゃいん} です。', 'C： {学生|がくせい} です。', 'D： {教師|きょうし} です。'],
      ghi: 'Câu hỏi rút gọn giống お名前は？: chỉ cần N + は (lên giọng). Trả lời bằng tên nghề + です.',
    }),
    S('ポイント 2 — です／じゃありません／ですか', {
      bang: B(['Loại câu', 'Công thức', 'Ví dụ'], [
        ['Khẳng định', 'N1 は N2 **です**。', 'ワンさんは{学生|がくせい}です。'],
        ['Phủ định', 'N1 は N2 **じゃありません**。', 'ワンさんは{先生|せんせい}じゃありません。'],
        ['Câu hỏi', 'N1 は N2 **ですか**。', 'ワンさんは{学生|がくせい}ですか。'],
      ]),
      ghi: 'Ba câu chỉ khác đúng cái đuôi: です → じゃありません (không phải) → ですか (có phải không?). Đây là CQ7.3 — cô hay bắt so sánh ba dạng này.',
    }),
    S('はい・いいえ — Trả lời câu hỏi có/không', {
      anh: ['man-office-worker', 'woman-student'],
      nhan: ['カルロス', 'ワン'],
      j: [
        'A： ^カルロス-さん は {学生|がくせい} です か。',
        'B： いいえ、 {学生|がくせい} じゃ ありません。 {会社員|かいしゃいん} です。',
        'A： ^ワン-さん は {学生|がくせい} です か。',
        'C： はい、 {学生|がくせい} です。',
      ],
      hoi: 'Hỏi: 「ナタポンさんは{先生|せんせい}ですか」 — Nattapon là sinh viên. Bạn trả lời thế nào?',
      dap: A('いいえ、 {先生|せんせい} じゃ ありません。 {学生|がくせい} です。'),
      ghi: 'Đáp いいえ thì nói tiếp thông tin ĐÚNG cho người hỏi khỏi phải hỏi lại. Câu hỏi không có từ để hỏi mới dùng はい／いいえ.',
    }),
    S('チャレンジ 4・5 — お{仕事|しごと}は？', {
      anh: ['woman-student', 'man-office-worker'],
      nhan: ['アンナ', 'カルロス'],
      j: [
        'アンナ： ^カルロス-さん、 お{仕事|しごと} は？',
        'カルロス： {会社員|かいしゃいん} です。 ^アンナ-さん は {学生|がくせい} です か。',
        'アンナ： はい、 {学生|がくせい} です。',
        'カルロス： そう です か。',
      ],
      ghi: 'Đoạn này ghép cả hai cách hỏi nghề: hỏi mở (お仕事は？) và hỏi đoán (学生ですか). Đọc to đổi vai hai lần.',
    }),
    S('チャレンジ — Luyện cặp bằng thẻ nhân vật', {
      bang: B(['Thẻ', 'お{名前|なまえ}', 'お{国|くに}', 'お{仕事|しごと}'], [
        ['①', 'ナタポン', 'タイ', '{学生|がくせい}'],
        ['②', 'メアリー', 'アメリカ', '{教師|きょうし}'],
        ['③', '{西川|にしかわ}', '{日本|にほん}', '{会社員|かいしゃいん}'],
      ]),
      hoi: 'A hỏi đủ 3 câu, B đóng vai thẻ ② (Mary) trả lời.',
      dap: `${A('お{名前|なまえ} は？')} — ${A('^メアリー です。')} · ${A('お{国|くに} は どちら です か。')} — ${A('アメリカ です。')} · ${A('お{仕事|しごと} は？')} — ${A('{教師|きょうし} です。')}`,
      ghi: 'Trên lớp cô phát thẻ như thế này rồi gọi từng cặp. Đổi vai, làm đủ ba thẻ; thẻ ③ là người Nhật nên đáp 日本です.',
    }),
    S('Cô hay gọi — CQ7.2', {
      j: ['!Cô gọi bất kỳ ai — trả lời to, đủ câu.'],
      hoi: 'Nêu cách hỏi tên, quốc tịch, nghề nghiệp bằng tiếng Nhật.',
      dap: 'お{名前|なまえ}は？ · お{国|くに}はどちらですか。 · お{仕事|しごと}は？ — cả ba lịch sự nhờ chữ お đầu từ.',
      ghi: 'Khi nói về CHÍNH MÌNH thì bỏ お: 名前, 国, 仕事. Chữ お chỉ dành cho của người nghe.',
    }),
    S('Cô hay gọi — CQ7.3 · CQ7.4', {
      hoi: 'Khi đồng ý hoặc không đồng ý với câu hỏi, người trả lời mở đầu bằng gì và nói tiếp thế nào?',
      dap: 'Đồng ý: はい、〜です。 Không đồng ý: いいえ、〜じゃありません。＋ thông tin đúng. Nghe xong thông tin mới: そうですか (xuống giọng).',
      j: ['A： ^ワン-さん は {日本人|にほんじん} です か。', 'B： いいえ、 {日本人|にほんじん} じゃ ありません。 {中国人|ちゅうごくじん} です。', 'A： そう です か。'],
      ghi: 'Ba bước này lặp đi lặp lại trong mọi bài sau: hỏi ですか → はい／いいえ → そうですか.',
    }),
    S('まとめ — Tóm tắt Slot 7', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Chào lần đầu', 'はじめまして。…どうぞよろしくお{願|ねが}いします。'],
        ['Tên', '{私|わたし}は＿です。 ／ お{名前|なまえ}は？'],
        ['Nước', 'お{国|くに}はどちらですか。— ＿です。'],
        ['Nghề', 'お{仕事|しごと}は？ — ＿です。'],
        ['Không phải', '＿じゃありません。'],
      ]),
      ghi: 'Về nhà: tự giới thiệu 4 câu (chào – tên – nước – nghề – よろしく) trước gương 5 lần. Slot sau thêm trường học, tuổi, ngày sinh.',
    }),
  ],
  [
    Q('「はじめまして」 nói khi nào?', 'Khi gặp ai đó lần đầu', 'Khi chào tạm biệt | Khi xin lỗi | Khi cảm ơn', 'はじめまして = câu mở đầu của lần gặp ĐẦU TIÊN.'),
    Q('Người kia nói 「どうぞよろしくお願いします」. Bạn đáp:', 'こちらこそ よろしくお{願|ねが}いします。', 'はじめまして。 | そうですか。 | いいえ、じゃありません。', 'こちらこそ = "chính tôi mới phải" — câu đáp chuẩn cho よろしく.'),
    Q('「お{国|くに}はどちらですか。」 — Trả lời đúng:', 'ベトナムです。', 'はい、ベトナムです。 | ベトナム{人|じん}ですか。 | いいえ、ベトナムです。', 'Có từ để hỏi どちら ⇒ không dùng はい／いいえ; hỏi nước ⇒ đáp tên nước.'),
    Q('Phủ định của 「{学生|がくせい}です」 là:', '{学生|がくせい}じゃありません', '{学生|がくせい}ですか | {学生|がくせい}じゃです | {学生|がくせい}ありません', 'です → **じゃありません** (ポイント 2).'),
    Q('Tự giới thiệu tên mình, câu nào ĐÚNG?', '{私|わたし}はワンです。', '{私|わたし}はワンさんです。 | お{名前|なまえ}はワンです。 | ワンさんはです。', 'Không gắn さん vào tên mình; お名前 là "tên của BẠN".'),
    Q('Cô giáo tự nói nghề của mình: 「{私|わたし}は（　）です。」', '{教師|きょうし}', '{先生|せんせい} | {会社員|かいしゃいん} | {学生|がくせい}', 'Nói nghề của mình dùng 教師; 先生 là để gọi/nói về giáo viên khác.'),
    Q('「カルロスさんは{学生|がくせい}ですか。」 (Carlos là nhân viên công ty)', 'いいえ、{学生|がくせい}じゃありません。{会社員|かいしゃいん}です。', 'はい、{会社員|かいしゃいん}です。 | いいえ、{会社員|かいしゃいん}じゃありません。 | {学生|がくせい}じゃありませんですか。', 'いいえ + じゃありません + thông tin đúng.'),
  ],
);

/* ── Slot 8 (tiết 22–24): ST1 チャレンジ6 N1のN2 + やってみよう · ST2 〜歳, いつ 〜月〜日 ── */
const B1_SLOT08 = SLOT(
  1, '08', 'n-no-n-tuoi-ngay-sinh',
  'Bài 1 ST1–ST2: N1 の N2 (trường, công ty) · tuổi 〜歳 · sinh nhật いつ',
  'Nói mình là sinh viên trường nào / nhân viên công ty nào bằng N1 の N2, nói tuổi đúng cách đọc, đọc tháng – ngày và hỏi 誕生日はいつですか.',
  [
    '**Ôn Slot 7**: tên · nước · nghề, はい／いいえ・じゃありません.',
    '**ポイント 4 — N1 の N2**: ふじ大学の学生 · ABCの社員 · 私の名前 (cái chính đứng SAU).',
    '**やってみよう ST1**: tự giới thiệu đủ 5 câu (chào – tên – nước – trường/công ty – よろしく).',
    '**ST2 私の誕生日**: 〜歳 (1, 8, 10, 20 đọc đặc biệt), 〜月, 〜日 (1–10, 14, 20, 24 đọc riêng).',
    '**ポイント 3 — いつ**: 誕生日はいつですか。— 〜月〜日です。 Câu cô hay gọi: CQ8.1–8.4.',
  ],
  'JPD113 · Bài 1 はじめまして · Slot 8',
  [
    S('{第1課|だいいっか} — Slot 8: N1 の N2 · {何歳|なんさい} · {誕生日|たんじょうび}', {
      anh: ['school', 'birthday-cake', 'spiral-calendar'],
      nhan: ['{大学|だいがく}の{学生|がくせい}', '{何歳|なんさい}', '{誕生日|たんじょうび}'],
      j: ['!Hôm nay: **trường/công ty của mình · tuổi · ngày sinh**'],
      ghi: 'Nửa đầu buổi xong phần ST1 (thêm trường, công ty); nửa sau mở ST2 — tuổi và sinh nhật, phần có nhiều số đọc đặc biệt nhất Bài 1.',
    }),
    S('{復習|ふくしゅう} — Ôn Slot 7', {
      j: ['A： お{名前|なまえ} は？', 'A： お{国|くに} は どちら です か。', 'A： お{仕事|しごと} は？'],
      hoi: 'Trả lời cả 3 câu về chính bạn.',
      dap: `Ví dụ: ${A('^グエン です。 ベトナム です。 {学生|がくせい} です。')}`,
      ghi: 'Cô thường mở buổi bằng cách hỏi nhanh từng bạn. Trả lời đủ câu có です, đừng chỉ nói một từ.',
    }),
    S('{復習|ふくしゅう} — いいえ、〜じゃありません', {
      j: ['!Nhớ: **いいえ ＋ 〜じゃありません ＋ thông tin đúng**', 'A： {日本人|にほんじん} です か。'],
      hoi: 'Bạn là người Việt. Trả lời câu 「{日本人|にほんじん}ですか」.',
      dap: A('いいえ、 {日本人|にほんじん} じゃ ありません。 ベトナム{人|じん} です。'),
      ghi: 'Lỗi hay gặp: chỉ nói いいえ rồi im. Người Nhật luôn nói tiếp điều đúng.',
    }),
    S('ポイント 4 — N1 の N2', {
      bang: B(['N1 (thuộc về đâu)', 'の', 'N2 (cái chính)', 'Nghĩa'], [
        ['ふじ{大学|だいがく}', 'の', '{学生|がくせい}', 'sinh viên trường ĐH Fuji'],
        ['ABC', 'の', '{社員|しゃいん}', 'nhân viên công ty ABC'],
        ['{日本語|にほんご}{学校|がっこう}', 'の', '{先生|せんせい}', 'giáo viên trường tiếng Nhật'],
        ['{私|わたし}', 'の', '{名前|なまえ}', 'tên của tôi'],
      ]),
      j: ['!**N1 の N2** — N2 là cái chính, N1 nói rõ "của / thuộc" cái gì'],
      ghi: 'Đọc ngược với tiếng Việt: tiếng Việt nói "sinh viên (của) trường Fuji", tiếng Nhật nói "trường Fuji の sinh viên". Cái chính luôn đứng SAU の.',
    }),
    S('N1 の N2 — Ví dụ', {
      anh: ['graduation-cap', 'office-building', 'teacher'],
      nhan: ['ふじ{大学|だいがく}', 'ABC', '{日本語|にほんご}{学校|がっこう}'],
      j: [
        '^マルコ-さん は ふじ {大学|だいがく} の {学生|がくせい} です。',
        '^カルロス-さん は ABC の {社員|しゃいん} です。',
        '^{本田|ほんだ} {先生|せんせい} は {日本語|にほんご} {学校|がっこう} の {先生|せんせい} です。',
      ],
      ghi: 'Ba câu cùng khuôn ポイント 1 (N1 は N2 です), chỉ khác là N2 giờ dài hơn nhờ の. Tên trường, tên công ty luôn đứng trước の.',
    }),
    S('⚠ Thứ tự N1 の N2', {
      j: ['!~~{学生|がくせい}の ふじ{大学|だいがく}~~ ✗', 'ふじ {大学|だいがく} の {学生|がくせい} ✓'],
      hoi: '"Học sinh trường cấp 3" nói thế nào?',
      dap: `${A('{高校|こうこう} の {学生|がくせい}')} — trường (高校) đứng TRƯỚC の, người (学生) đứng sau.`,
      ghi: 'Mẹo: hỏi "cái chính là gì?" — là người (学生) thì đặt cuối. Sai thứ tự là đổi nghĩa thành "trường của học sinh".',
    }),
    S('{会社員|かいしゃいん} hay ABCの{社員|しゃいん}?', {
      j: ['{会社員|かいしゃいん} です。', 'ABC の {社員|しゃいん} です。'],
      hoi: '"Tôi là nhân viên công ty ABC" — dùng 会社員 hay 社員?',
      dap: `${A('ABC の {社員|しゃいん} です。')} — có tên công ty thì dùng 社員.`,
      ghi: '会社員 = nghề "nhân viên công ty" nói chung, không kèm tên công ty. Có tên công ty phía trước の thì đổi sang 社員.',
    }),
    S('チャレンジ 6 — Trường nào? Công ty nào?', {
      anh: ['man-office-worker', 'woman-student'],
      nhan: ['{西川|にしかわ}', 'リン'],
      j: [
        '{西川|にしかわ}： ^リン-さん は {学生|がくせい} です か。',
        'リン： はい。 さくら {日本語|にほんご} {学校|がっこう} の {学生|がくせい} です。 ^{西川|にしかわ}-さん は？',
        '{西川|にしかわ}： {私|わたし} は ABC の {社員|しゃいん} です。',
        'リン： そう です か。',
      ],
      ghi: 'Đoạn này dùng cả ポイント 2 (ですか / はい) và ポイント 4 (の). Nhớ: nói về người khác thì có さん, về mình thì không.',
    }),
    S('やってみよう ST1 — Tự giới thiệu 5 câu', {
      anh: ['name-badge'],
      j: [
        'はじめまして。',
        '{私|わたし} は ^グエン です。',
        'ベトナム{人|じん} です。',
        'FPT {大学|だいがく} の {学生|がくせい} です。',
        'どうぞ よろしく お{願|ねが}い します。',
      ],
      ghi: 'Đây là khung tự giới thiệu chuẩn, thay tên và trường của bạn vào. Kỳ thi nói thường mở đầu đúng bằng đoạn này.',
    }),
    S('ST2 {私|わたし}の{誕生日|たんじょうび} — Sinh nhật của tôi', {
      anh: ['birthday-cake', 'spiral-calendar', 'woman-student', 'man-student'],
      nhan: ['{誕生日|たんじょうび}', '〜{月|がつ}〜{日|にち}', 'パク', 'マルコ'],
      j: ['!できること: nói **tuổi** của mình; nói và hỏi **ngày sinh**.'],
      ghi: 'Phần này toàn số: tuổi, tháng, ngày. Số đã học từ buổi bảng chữ (Slot 3); hôm nay học cách ghép số với 〜歳, 〜月, 〜日.',
    }),
    S('{新|あたら}しいことば — ST2', {
      bang: B(['Từ', 'Đọc', 'Nghĩa'], [
        ['{誕生日|たんじょうび}', 'tanjoubi', 'ngày sinh, sinh nhật'],
        ['〜{歳|さい} ／ {何歳|なんさい}', 'sai / nansai', '〜 tuổi / mấy tuổi'],
        ['{二十歳|はたち}', 'hatachi', '20 tuổi (đọc đặc biệt)'],
        ['〜{月|がつ} ／ 〜{日|にち}', 'gatsu / nichi', 'tháng 〜 / ngày 〜'],
        ['いつ', 'itsu', 'khi nào'],
        ['わあ', 'waa', 'Oa! (vui, ngạc nhiên)'],
        ['{同|おな}じですね', 'onaji desu ne', 'giống nhau nhỉ'],
        ['ブラジル', 'burajiru', 'Brazil'],
      ]),
      ghi: '何歳 hỏi tuổi bạn bè; với người lớn tuổi hơn nên hỏi おいくつですか cho lịch sự. 同じですね dùng khi phát hiện hai người trùng nhau.',
    }),
    S('〜{歳|さい} — Đếm tuổi (CQ8.2)', {
      bang: B(['Tuổi', 'Đọc', 'Tuổi', 'Đọc'], [
        ['1{歳|さい}', '**いっさい**', '11{歳|さい}', 'じゅういっさい'],
        ['8{歳|さい}', '**はっさい**', '18{歳|さい}', 'じゅうはっさい'],
        ['10{歳|さい}', '**じゅっさい**', '19{歳|さい}', 'じゅうきゅうさい'],
        ['20{歳|さい}', '**はたち**', '21{歳|さい}', 'にじゅういっさい'],
      ]),
      ghi: 'Số tận cùng 1, 8, 10 có âm ngắt (っ): いっさい, はっさい, じゅっさい. 20 tuổi đọc riêng はたち. Trên giấy người Nhật hay viết tắt 歳 thành 才.',
    }),
    S('〜{歳|さい}です — Hỏi và nói tuổi', {
      j: ['A： {何歳|なんさい} です か。', 'B： {十九歳|じゅうきゅうさい} です。', 'A： わあ、 {同|おな}じ です ね。'],
      hoi: 'Đọc to: 18歳 · 20歳 · 21歳',
      dap: 'じゅうはっさい · はたち · にじゅういっさい',
      ghi: 'Câu nói tuổi dùng đúng khuôn ポイント 1: (私は) 〜歳です. Trùng tuổi thì nói 同じですね.',
    }),
    S('〜{月|がつ} — 12 tháng', {
      anh: ['spiral-calendar'],
      nhan: ['〜{月|がつ}'],
      bang: B(['Tháng', 'Đọc', 'Tháng', 'Đọc'], [
        ['1{月|がつ}', 'いちがつ', '7{月|がつ}', '**しちがつ**'],
        ['2{月|がつ}', 'にがつ', '8{月|がつ}', 'はちがつ'],
        ['3{月|がつ}', 'さんがつ', '9{月|がつ}', '**くがつ**'],
        ['4{月|がつ}', '**しがつ**', '10{月|がつ}', 'じゅうがつ'],
        ['5{月|がつ}', 'ごがつ', '11{月|がつ}', 'じゅういちがつ'],
        ['6{月|がつ}', 'ろくがつ', '12{月|がつ}', 'じゅうにがつ'],
      ]),
      ghi: 'Tên tháng = số + 月(がつ). Ba tháng hay đọc sai: tháng 4 しがつ (không よん), tháng 7 しちがつ (không なな), tháng 9 くがつ (không きゅう).',
    }),
    S('〜{日|にち} — Ngày 1 đến 10 (đọc riêng)', {
      bang: B(['Ngày', 'Đọc', 'Ngày', 'Đọc'], [
        ['1{日|にち}', '**ついたち**', '6{日|にち}', 'むいか'],
        ['2{日|にち}', 'ふつか', '7{日|にち}', 'なのか'],
        ['3{日|にち}', 'みっか', '8{日|にち}', 'ようか'],
        ['4{日|にち}', 'よっか', '9{日|にち}', 'ここのか'],
        ['5{日|にち}', 'いつか', '10{日|にち}', 'とおか'],
      ]),
      ghi: 'Mười ngày đầu tháng đọc theo kiểu Nhật cổ, phải thuộc lòng. Mùng 1 là ついたち — khác hẳn các ngày còn lại.',
    }),
    S('〜{日|にち} — Ngày 11 đến 31', {
      bang: B(['Ngày', 'Đọc', 'Ngày', 'Đọc'], [
        ['11{日|にち}', 'じゅういちにち', '20{日|にち}', '**はつか**'],
        ['14{日|にち}', '**じゅうよっか**', '24{日|にち}', '**にじゅうよっか**'],
        ['17{日|にち}', 'じゅうしちにち', '27{日|にち}', 'にじゅうしちにち'],
        ['19{日|にち}', 'じゅうくにち', '30{日|にち}', 'さんじゅうにち'],
      ]),
      ghi: 'Từ 11 trở đi: số + にち. Ngoại lệ phải nhớ: 14 じゅうよっか, 20 はつか, 24 にじゅうよっか. Ngày 17, 19 đọc しち, く giống tháng.',
    }),
    S('ポイント 3 — {誕生日|たんじょうび}は いつですか (CQ8.1)', {
      bang: B(['Hỏi', 'Đáp'], [['{誕生日|たんじょうび}は **いつ**ですか。', '**{5月|ごがつ}{3日|みっか}**です。']]),
      j: ['A： {誕生日|たんじょうび} は いつ です か。', 'B： {5月|ごがつ} {3日|みっか} です。'],
      ghi: 'いつ = khi nào; đứng đúng chỗ thông tin, giống どちら. Nói ngày sinh: tháng TRƯỚC, ngày SAU — ngược tiếng Việt.',
    }),
    S('チャレンジ — {誕生日|たんじょうび}は いつですか', {
      anh: ['woman-student', 'man-student'],
      nhan: ['パク', 'マルコ'],
      j: [
        'パク： ^マルコ-さん、 {誕生日|たんじょうび} は いつ です か。',
        'マルコ： {7月|しちがつ} {20日|はつか} です。',
        'パク： わあ、 {私|わたし} の {誕生日|たんじょうび} は {7月|しちがつ} {20日|はつか} です。',
        'マルコ： {同|おな}じ です ね！',
      ],
      ghi: 'わあ thể hiện bất ngờ vui. 同じですね = "giống nhau nhỉ!" — câu kết rất tự nhiên khi hai người trùng sinh nhật, trùng tuổi, trùng nước.',
    }),
    S('チャレンジ — Đọc ngày sinh', {
      j: ['!4/8 · 9/14 · 1/1 · 7/24'],
      hoi: 'Đọc to bốn ngày trên theo kiểu Nhật (tháng trước, ngày sau).',
      dap: '{4月|しがつ}{8日|ようか} · {9月|くがつ}{14日|じゅうよっか} · {1月|いちがつ}{1日|ついたち} · {7月|しちがつ}{24日|にじゅうよっか}',
      ghi: 'Bốn ngày này chứa gần đủ bẫy: tháng 4, tháng 9, ngày 1, ngày 8, ngày 14, ngày 24. Đọc trôi được là ổn cả bảng.',
    }),
    S('Cô hay gọi — CQ8.3 · CQ8.4', {
      hoi: 'Ngày tháng tiếng Nhật đọc theo thứ tự nào, và có những ngày/tháng nào đọc đặc biệt?',
      dap: 'Tháng trước, ngày sau: 〜{月|がつ}〜{日|にち}. Đặc biệt: ngày 1–10 (ついたち…とおか), 14 じゅうよっか, 20 はつか, 24 にじゅうよっか; tháng 4 しがつ, 7 しちがつ, 9 くがつ.',
      ghi: 'Trả lời được câu này là nắm chắc toàn bộ phần ngày tháng — phần hay ra trong bài kiểm tra 1 và đề nghe.',
    }),
    S('まとめ — Tóm tắt Slot 8', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Trường / công ty', 'ふじ{大学|だいがく}の{学生|がくせい}です。 ／ ABCの{社員|しゃいん}です。'],
        ['Tuổi', '{何歳|なんさい}ですか。— 19{歳|さい}です。'],
        ['Sinh nhật', '{誕生日|たんじょうび}はいつですか。— {7月|しちがつ}{20日|はつか}です。'],
        ['Trùng nhau', '{同|おな}じですね。'],
      ]),
      ghi: 'Về nhà: viết ngày sinh của 5 người trong gia đình và đọc to. Slot sau: luyện tập ST2 rồi sang sở thích.',
    }),
  ],
  [
    Q('"Sinh viên trường đại học Fuji" là:', 'ふじ{大学|だいがく}の{学生|がくせい}', '{学生|がくせい}のふじ{大学|だいがく} | ふじ{大学|だいがく}は{学生|がくせい} | ふじ{大学|だいがく}と{学生|がくせい}', 'N1 の N2: cái chính (学生) đứng SAU (ポイント 4).'),
    Q('"Tôi là nhân viên công ty ABC."', 'ABCの{社員|しゃいん}です。', 'ABCの{会社員|かいしゃいん}です。 | ABCは{社員|しゃいん}です。 | {社員|しゃいん}のABCです。', 'Có tên công ty ⇒ 社員; nối bằng の.'),
    Q('20{歳|さい} đọc là:', 'はたち', 'にじゅうさい | にじっさい | はつか', '20 tuổi có cách đọc riêng: はたち (はつか là ngày 20).'),
    Q('{9月|くがつ} — tháng 9 đọc là:', 'くがつ', 'きゅうがつ | ここのがつ | くうがつ', 'Tháng 9 = くがつ.'),
    Q('{4日|よっか} — ngày 4 đọc là:', 'よっか', 'よんにち | しにち | よか', 'Ngày 4 = よっか (cùng nhóm 1–10 đọc riêng).'),
    Q('Hỏi ngày sinh: 「{誕生日|たんじょうび}は（　）ですか。」', 'いつ', 'どちら | {何歳|なんさい} | だれ', 'いつ = khi nào (ポイント 3).'),
    Q('"Ngày 1 tháng 1" đọc là:', 'いちがつ ついたち', 'いちがつ いちにち | ついたち いちがつ | いちにち いちがつ', 'Tháng trước, ngày sau; ngày 1 = ついたち.'),
  ],
);

/* ── Slot 9 (tiết 25–27): ST2 やってみよう + 練習問題 · ST3 チャレンジ1–2 何ですか, N1とN2 ── */
const B1_SLOT09 = SLOT(
  1, '09', 'luyen-st2-so-thich-to',
  'Bài 1 ST2–ST3: luyện tuổi & ngày sinh · 趣味は何ですか · N1 と N2',
  'Nghe và ghi lại tuổi – ngày sinh, sửa được các câu sai hay gặp của ST1–ST2, rồi nói và hỏi sở thích, nối hai sở thích bằng と.',
  [
    '**やってみよう ST2**: nghe hai bạn tự giới thiệu, điền bảng tên · tuổi · sinh nhật.',
    '**練習問題**: đọc tuổi, chọn trợ từ は／の／か, sửa câu sai, dịch câu ngắn.',
    '**ST3 私の趣味** — từ mới: スポーツ · サッカー · テニス · 水泳 · 映画 · 音楽 · 読書 · 旅行 · 料理.',
    '**ポイント 3 — 何**: 趣味は何ですか (何 đọc なん trước です) · **ポイント 5 — N1 と N2** (chỉ nối danh từ).',
    'Câu cô hay gọi: CQ9.1–9.3 (nói hai sở thích, từ về sở thích, hỏi sở thích người khác).',
  ],
  'JPD113 · Bài 1 はじめまして · Slot 9',
  [
    S('{第1課|だいいっか} — Slot 9: {練習|れんしゅう} · {趣味|しゅみ}は{何|なん}ですか', {
      anh: ['spiral-calendar', 'soccer-ball', 'musical-notes'],
      nhan: ['{誕生日|たんじょうび}', 'サッカー', '{音楽|おんがく}'],
      j: ['!Hôm nay: **luyện tập ST2 · sở thích · N1 と N2**'],
      ghi: 'Nửa đầu là giờ luyện tập (練習 = luyện tập) cho chắc phần số; nửa sau mở ST3 — phần dễ nói nhất và hay được hỏi nhất khi thi.',
    }),
    S('やってみよう ST2 — Nghe và điền bảng', {
      bang: B(['', 'お{名前|なまえ}', '{何歳|なんさい}', '{誕生日|たんじょうび}'], [
        ['①', 'アンナ', '？', '？'],
        ['②', 'ダニエル', '？', '？'],
      ]),
      j: [
        'アンナ： ^アンナ です。 {二十歳|はたち} です。 {誕生日|たんじょうび} は {3月|さんがつ} {14日|じゅうよっか} です。',
        'ダニエル： ^ダニエル です。 {二十二歳|にじゅうにさい} です。 {誕生日|たんじょうび} は {9月|くがつ} {9日|ここのか} です。',
      ],
      hoi: 'Điền bảng: mỗi người bao nhiêu tuổi, sinh ngày nào?',
      dap: 'アンナ: 20 tuổi (はたち), 14/3 (さんがつ じゅうよっか) · ダニエル: 22 tuổi, 9/9 (くがつ ここのか).',
      ghi: 'Trên lớp cô bật CD; ở đây che dòng chữ, bấm nghe từng câu rồi điền. Nghe ra はたち và じゅうよっか là đạt.',
    }),
    S('{練習問題|れんしゅうもんだい} ① — Đọc tuổi', {
      j: ['!1{歳|さい} · 8{歳|さい} · 10{歳|さい} · 20{歳|さい} · 34{歳|さい}'],
      hoi: 'Đọc to năm số tuổi trên.',
      dap: 'いっさい · はっさい · じゅっさい · はたち · さんじゅうよんさい',
      ghi: '34 tuổi = さんじゅう + よん + さい, không có gì đặc biệt. Chỉ các số tận cùng 1, 8, 10 và số 20 mới đổi âm.',
    }),
    S('{練習問題|れんしゅうもんだい} ② — Chọn trợ từ は・の・か', {
      j: [
        '^ワン-さん （＿＿） {中国人|ちゅうごくじん} です。',
        '^カルロス-さん は ABC （＿＿） {社員|しゃいん} です。',
        '{誕生日|たんじょうび} は いつ です （＿＿）。',
      ],
      hoi: 'Điền trợ từ vào ba chỗ trống.',
      dap: '① は (chủ đề) · ② の (nhân viên CỦA ABC) · ③ か (câu hỏi)',
      ghi: 'Bài 1 chỉ có vài trợ từ: は (chủ đề), の (của / thuộc), か (hỏi), và sắp tới と, も. Đề trắc nghiệm hay ra đúng dạng này.',
    }),
    S('{練習問題|れんしゅうもんだい} ③ — Sửa câu sai', {
      j: [
        '!① ~~{私|わたし}はワンさんです。~~',
        '!② ~~{学生|がくせい}のふじ{大学|だいがく}です。~~',
        '!③ ~~お{国|くに}はどちらですか。— はい、タイ{人|じん}です。~~',
      ],
      hoi: 'Sửa lại ba câu cho đúng.',
      dap: '① {私|わたし}はワンです。 ② ふじ{大学|だいがく}の{学生|がくせい}です。 ③ タイです。',
      ghi: 'Ba lỗi kinh điển của Bài 1: さん cho tên mình, đảo ngược の, và trả lời はい cho câu có từ để hỏi.',
    }),
    S('{練習問題|れんしゅうもんだい} ④ — Dịch', {
      hoi: 'Dịch: "Chị Kimura là người Nhật. Chị ấy không phải sinh viên. Chị ấy là giáo viên trường tiếng Nhật."',
      dap: A('^{木村|きむら}-さん は {日本人|にほんじん} です。 {学生|がくせい} じゃ ありません。 {日本語|にほんご} {学校|がっこう} の {先生|せんせい} です。'),
      j: ['!Gợi ý: ポイント 1 · ポイント 2 · ポイント 4'],
      ghi: 'Câu thứ hai, thứ ba không cần lặp 木村さんは — đã rõ đang nói về ai. Nói về giáo viên khác thì dùng 先生.',
    }),
    S('ST3 {私|わたし}の{趣味|しゅみ} — Sở thích của tôi', {
      anh: ['soccer-ball', 'musical-notes', 'open-book', 'luggage'],
      nhan: ['サッカー', '{音楽|おんがく}', '{読書|どくしょ}', '{旅行|りょこう}'],
      j: ['!できること: nói **sở thích**, hỏi sở thích người khác, nói "**tôi cũng vậy**".'],
      ghi: '趣味 = sở thích. Đây là đề tài kết bạn quen thuộc nhất; trong thi nói gần như chắc chắn có câu 趣味は何ですか.',
    }),
    S('{新|あたら}しいことば ① — Thể thao', {
      anh: ['soccer-ball', 'tennis', 'person-swimming', 'sports-medal'],
      nhan: ['サッカー', 'テニス', '{水泳|すいえい}', 'スポーツ'],
      j: ['{趣味|しゅみ} は スポーツ です。'],
      ghi: 'サッカー, テニス, スポーツ là katakana mượn tiếng Anh (soccer, tennis, sports). 水泳 = bơi lội, chữ Hán: 水 nước + 泳 bơi.',
    }),
    S('{新|あたら}しいことば ② — Giải trí', {
      anh: ['cinema', 'musical-notes', 'open-book', 'cook'],
      nhan: ['{映画|えいが}', '{音楽|おんがく}', '{読書|どくしょ}', '{料理|りょうり}'],
      j: ['{趣味|しゅみ} は {映画|えいが} です。', '!+ {旅行|りょこう} (ryokou) — du lịch'],
      ghi: '料理 vừa là "nấu ăn" vừa là "món ăn". 読書 là đọc sách (danh từ), dùng ngay được trong 趣味は読書です.',
    }),
    S('ポイント 3 — {趣味|しゅみ}は {何|なん}ですか (CQ9.3)', {
      bang: B(['Hỏi', 'Đáp'], [['{趣味|しゅみ}は**{何|なん}**ですか。', '**サッカー**です。']]),
      j: ['A： {趣味|しゅみ} は {何|なん} です か。', 'B： {音楽|おんがく} です。'],
      ghi: '何 = cái gì; đứng trước です thì đọc **なん**. Vẫn quy tắc hỏi chỗ nào – đáp chỗ đó: thay 何 bằng sở thích.',
    }),
    S('{私|わたし}の{趣味|しゅみ}は〜です', {
      j: ['{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です。', '^ワン-さん の {趣味|しゅみ} は {何|なん} です か。'],
      hoi: 'Hỏi sở thích của anh Daniel (lịch sự, có tên) thế nào?',
      dap: A('^ダニエル-さん の {趣味|しゅみ} は {何|なん} です か。'),
      ghi: 'Ghép ポイント 4 (の) vào: 私の趣味 = sở thích của tôi. Hỏi thẳng người đối diện chỉ cần 趣味は何ですか.',
    }),
    S('ポイント 5 — N1 と N2', {
      bang: B(['N1', 'と', 'N2', 'Nghĩa'], [
        ['サッカー', 'と', 'テニス', 'bóng đá và tennis'],
        ['{映画|えいが}', 'と', '{音楽|おんがく}', 'phim và âm nhạc'],
      ]),
      j: ['{趣味|しゅみ} は サッカー と テニス です。'],
      ghi: 'と = "và", nối hai DANH TỪ. Có hai sở thích thì nối bằng と rồi mới thêm です ở cuối.',
    }),
    S('⚠ と chỉ nối danh từ (CQ9.1)', {
      j: ['!~~{趣味|しゅみ}はサッカーです と テニスです。~~ ✗', '{趣味|しゅみ} は サッカー と テニス です。'],
      hoi: '"Tôi là sinh viên và là người Việt" — nối bằng と được không?',
      dap: 'Không. と chỉ nối hai danh từ, không nối hai câu. Nói hai câu: {学生|がくせい}です。ベトナム{人|じん}です。',
      ghi: 'Người Việt hay dịch chữ "và" thành と ở mọi chỗ. Nhớ: と đứng giữa hai danh từ, không đứng sau です.',
    }),
    S('チャレンジ 1・2 — {趣味|しゅみ}は{何|なん}ですか', {
      anh: ['man-student', 'woman-student'],
      nhan: ['ダニエル', 'メアリー'],
      j: [
        'ダニエル： ^メアリー-さん、 {趣味|しゅみ} は {何|なん} です か。',
        'メアリー： {読書|どくしょ} と {映画|えいが} です。 ^ダニエル-さん は？',
        'ダニエル： {私|わたし} の {趣味|しゅみ} は {水泳|すいえい} です。',
        'メアリー： そう です か。',
      ],
      ghi: 'Mary trả lời bằng と (hai sở thích) rồi hỏi lại 〜さんは？. Đọc to đổi vai, thay bằng sở thích thật của bạn.',
    }),
    S('チャレンジ — Luyện cặp', {
      bang: B(['Thẻ', 'お{名前|なまえ}', '{趣味|しゅみ}'], [
        ['①', 'ナタポン', 'サッカー・テニス'],
        ['②', '{山口|やまぐち}', '{料理|りょうり}・{旅行|りょこう}'],
        ['③', 'カルロス', '{音楽|おんがく}'],
      ]),
      hoi: 'A hỏi sở thích, B đóng vai thẻ ② trả lời.',
      dap: `${A('{趣味|しゅみ} は {何|なん} です か。')} — ${A('{料理|りょうり} と {旅行|りょこう} です。')}`,
      ghi: 'Thẻ có hai sở thích thì bắt buộc dùng と. Làm xong ba thẻ thì đổi vai.',
    }),
    S('Cô hay gọi — CQ9.2', {
      j: ['!Làm flash card: mặt trước tranh, mặt sau chữ Nhật + romaji.'],
      hoi: 'Khi nói về sở thích, thường dùng những từ nào?',
      dap: 'スポーツ・サッカー・テニス・{水泳|すいえい}・{映画|えいが}・{音楽|おんがく}・{読書|どくしょ}・{旅行|りょこう}・{料理|りょうり}',
      ghi: 'Đề cương ghi rõ cô yêu cầu làm flash card cho nhóm từ này. Chín từ, mỗi từ một thẻ, ôn mỗi ngày đến khi nhìn tranh nói ra ngay.',
    }),
    S('まとめ — Tóm tắt Slot 9', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Hỏi sở thích', '{趣味|しゅみ}は{何|なん}ですか。'],
        ['Một sở thích', '{趣味|しゅみ}はサッカーです。'],
        ['Hai sở thích', '{趣味|しゅみ}はサッカー**と**テニスです。'],
        ['Sở thích của ai', 'ワンさん**の**{趣味|しゅみ}は{何|なん}ですか。'],
      ]),
      ghi: 'Về nhà: làm 9 flash card sở thích + tự nói 2 câu về sở thích của mình. Slot sau: "tôi cũng vậy" (も), chữ Hán Bài 1 và ôn cả bài.',
    }),
  ],
  [
    Q('「{趣味|しゅみ}は（　）ですか。」 — hỏi "Sở thích là gì?"', '{何|なん}', 'いつ | どちら | だれ', '何 = cái gì; trước です đọc なん.'),
    Q('"Sở thích của tôi là phim và âm nhạc."', '{私|わたし}の{趣味|しゅみ}は{映画|えいが}と{音楽|おんがく}です。', '{私|わたし}の{趣味|しゅみ}は{映画|えいが}です と {音楽|おんがく}です。 | {私|わたし}は{趣味|しゅみ}の{映画|えいが}と{音楽|おんがく}です。 | {私|わたし}の{趣味|しゅみ}は{映画|えいが}の{音楽|おんがく}です。', 'の nối 私–趣味 (ポイント 4); と nối hai danh từ (ポイント 5).'),
    Q('{何|なに} trong 「{趣味|しゅみ}は何ですか」 đọc là:', 'なん', 'なに | なで | いつ', 'Trước です, 何 đọc なん.'),
    Q('{読書|どくしょ} nghĩa là:', 'đọc sách', 'du lịch | nấu ăn | bơi lội', '読書 = đọc sách; 旅行 = du lịch; 料理 = nấu ăn; 水泳 = bơi lội.'),
    Q('Câu nào SAI?', '{学生|がくせい}です と ベトナム{人|じん}です。', '{趣味|しゅみ}はテニスとサッカーです。 | {私|わたし}はベトナム{人|じん}です。 | ワンさんの{趣味|しゅみ}は{料理|りょうり}です。', 'と chỉ nối danh từ, không nối hai câu có です.'),
    Q('Ngày 14 đọc là:', 'じゅうよっか', 'じゅうよんにち | じゅうしにち | よっか', '14 là ngoại lệ: じゅうよっか.'),
  ],
);

/* ── Slot 10 (tiết 28–30): ST3 チャレンジ3 Nも + やってみよう · 漢字 第1課 · 第1課復習 ── */
const B1_SLOT10 = SLOT(
  1, '10', 'mo-kanji-on-bai-1',
  'Bài 1 ST3: N も (tôi cũng vậy) · chữ Hán Bài 1 · ôn Bài 1',
  'Nói "tôi cũng…" bằng も, đọc – viết được 9 chữ Hán của lớp Bài 1 trong từ, và tự giới thiệu trọn 7 câu dùng đủ ポイント 1–6 để chuẩn bị Bài kiểm tra 1.',
  [
    '**ポイント 6 — N も** (cũng): も đứng THAY CHỖ は · 同じですね.',
    '**やってみよう ST3**: hỏi quanh lớp tìm bạn cùng sở thích, rồi kể lại.',
    '**漢字 第1課** — 9 chữ: 私 人 才 学 生 校 日 本 語 (âm On / Kun, Hán Việt, từ ví dụ).',
    '**第1課 復習**: bảng ポイント 1–6, もう一度聞こう (nghe lại hội thoại), đoạn tự giới thiệu 7 câu.',
    'Báo trước: **Slot 11 — Bài kiểm tra 1** (bảng chữ + Bài 1). Câu cô hay gọi: CQ9.1, CQ9.4.',
  ],
  'JPD113 · Bài 1 はじめまして · Slot 10',
  [
    S('{第1課|だいいっか} — Slot 10: N も · {漢字|かんじ} · {復習|ふくしゅう}', {
      anh: ['handshake', 'writing-hand', 'check-mark-button'],
      nhan: ['{私|わたし}も！', '{漢字|かんじ}', '{復習|ふくしゅう}'],
      j: ['!Hôm nay: **"tôi cũng vậy" · 9 chữ Hán · ôn Bài 1**'],
      ghi: 'Buổi cuối của Bài 1: học nốt ポイント 6, học chữ Hán và ôn trọn bài. 復習 = ôn tập — slot sau là kiểm tra.',
    }),
    S('{復習|ふくしゅう} — {趣味|しゅみ}は{何|なん}ですか', {
      j: ['A： {趣味|しゅみ} は {何|なん} です か。'],
      hoi: 'Trả lời bằng HAI sở thích của bạn.',
      dap: `Ví dụ: ${A('{映画|えいが} と {音楽|おんがく} です。')}`,
      ghi: 'Hai sở thích ⇒ と. Nói xong hỏi lại bạn bên cạnh: 〜さんは？',
    }),
    S('ポイント 6 — N も (cũng)', {
      bang: B(['Câu A', 'Câu B — "cũng"'], [
        ['ワンさん**は**{学生|がくせい}です。', 'パクさん**も**{学生|がくせい}です。'],
        ['{私|わたし}の{趣味|しゅみ}**は**{料理|りょうり}です。', '{私|わたし}の{趣味|しゅみ}**も**{料理|りょうり}です。'],
      ]),
      j: ['!**N も** — も đứng THAY CHỖ は: "N cũng…"'],
      ghi: 'Chỉ cần đổi は thành も là thành "cũng". Phần còn lại của câu giữ nguyên.',
    }),
    S('N も — Ví dụ', {
      anh: ['woman-student', 'woman-student', 'man-student'],
      nhan: ['ワン', 'パク', 'マルコ'],
      j: [
        '^ワン-さん は {学生|がくせい} です。',
        '^パク-さん も {学生|がくせい} です。',
        '^マルコ-さん も {学生|がくせい} です。',
        '{私|わたし} も {二十歳|はたち} です。 {同|おな}じ です ね。',
      ],
      ghi: 'Ba người cùng là sinh viên: người đầu dùng は, những người sau dùng も. Trùng tuổi, trùng sinh nhật thì thêm 同じですね.',
    }),
    S('⚠ も THAY は — không đứng cạnh nhau', {
      j: ['!~~{私|わたし}はも{学生|がくせい}です。~~ ✗', '{私|わたし} も {学生|がくせい} です。'],
      hoi: 'A nói 「{私|わたし}はベトナム{人|じん}です」. B cũng là người Việt — B nói gì?',
      dap: A('{私|わたし} も ベトナム{人|じん} です。'),
      ghi: 'は và も không bao giờ đi đôi: có も thì bỏ は. Đây là lỗi hay bị trừ điểm trong bài viết.',
    }),
    S('チャレンジ 3 — {私|わたし}も！', {
      anh: ['man-student', 'woman-student'],
      nhan: ['ナタポン', '{山口|やまぐち}'],
      j: [
        'ナタポン： ^{山口|やまぐち}-さん、 {趣味|しゅみ} は {何|なん} です か。',
        '{山口|やまぐち}： {料理|りょうり} です。',
        'ナタポン： わあ、 {私|わたし} も {料理|りょうり} です。',
        '{山口|やまぐち}： {同|おな}じ です ね。',
      ],
      ghi: 'Đây là câu trả lời mẫu cho CQ9.1 phần "tôi cũng có sở thích như vậy": 私も〜です + 同じですね.',
    }),
    S('チャレンジ — Giống hay khác?', {
      j: ['A： {趣味|しゅみ} は サッカー です。', 'B (giống)： {私|わたし} も サッカー です。 {同|おな}じ です ね。', 'B (khác)： そう です か。 {私|わたし} の {趣味|しゅみ} は {音楽|おんがく} です。'],
      hoi: 'A: 「{誕生日|たんじょうび}は{5月|ごがつ}{3日|みっか}です」. B sinh 12/8 — B đáp thế nào?',
      dap: A('そう です か。 {私|わたし} の {誕生日|たんじょうび} は {8月|はちがつ} {12日|じゅうににち} です。'),
      ghi: 'Hai đường trả lời: giống ⇒ も + 同じですね; khác ⇒ そうですか + nói của mình. Luyện cả hai.',
    }),
    S('やってみよう ST3 — Tìm bạn cùng sở thích', {
      anh: ['busts-in-silhouette', 'speech-balloon'],
      j: ['!Đi quanh lớp hỏi 3 bạn: お{名前|なまえ}は？ · お{国|くに}は？ · {趣味|しゅみ}は？', '!Rồi kể lại cho cả lớp:', '^リン-さん の {趣味|しゅみ} は {音楽|おんがく} です。 {私|わたし} も {音楽|おんがく} です。'],
      ghi: 'Đây là hoạt động できる! của Bài 1: hỏi nhiều người rồi giới thiệu lại. Kể lại người khác thì nhớ có さん.',
    }),
    S('{漢字|かんじ} {第1課|だいいっか} — 9 chữ của lớp', {
      j: ['!**私　人　才　学　生　校　日　本　語**', '!Học theo TỪ: {日本|にほん} · {日本人|にほんじん} · {学生|がくせい} · {学校|がっこう} · {日本語|にほんご}'],
      ghi: 'Mỗi chữ có âm On (đọc kiểu Hán, hay gặp trong từ ghép) và âm Kun (đọc kiểu Nhật, hay đứng một mình). Đề thi đọc to chữ Hán trong TỪ, nên học theo từ.',
    }),
    HAN('①', '私', 'TƯ', 'tôi; riêng tư', 'シ', 'わたし', [['{私|わたし}', 'tôi'], ['{私|わたし} の {名前|なまえ}', 'tên của tôi']],
      'Bên trái là bộ 禾 (cây lúa), bên phải là ム — "phần lúa của riêng mình" ⇒ riêng tư, tôi. Bài 1 chỉ cần đọc わたし.'),
    HAN('②', '人', 'NHÂN', 'người', 'ジン・ニン', 'ひと', [['{日本人|にほんじん}', 'người Nhật'], ['ベトナム{人|じん}', 'người Việt'], ['{人|ひと}', 'người']],
      'Hình một người đứng dang hai chân. Sau tên nước đọc じん; đứng một mình đọc ひと.', 'person-standing'),
    HAN('③', '才', 'TÀI', 'tài năng; viết tắt của 歳 (tuổi)', 'サイ', '—', [['{二十才|はたち}', '20 tuổi'], ['{十九才|じゅうきゅうさい}', '19 tuổi']],
      'Chữ 歳 nhiều nét nên đời thường người Nhật viết tắt thành 才 (cùng âm サイ). Thấy 才 sau số là đọc さい.', 'birthday-cake'),
    HAN('④', '学', 'HỌC', 'học', 'ガク・ガッ', 'まな(ぶ)', [['{学生|がくせい}', 'học sinh, sinh viên'], ['{大学|だいがく}', 'đại học'], ['{学校|がっこう}', 'trường học']],
      'Hình đứa trẻ (子) dưới mái nhà đang học. Trong 学校 âm ガク rút thành ガッ: がっこう.', 'graduation-cap'),
    HAN('⑤', '生', 'SINH', 'sống; sinh ra', 'セイ・ジョウ', 'い(きる)・う(まれる)', [['{学生|がくせい}', 'sinh viên'], ['{先生|せんせい}', 'thầy cô giáo'], ['{誕生日|たんじょうび}', 'ngày sinh']],
      'Hình mầm cây mọc lên khỏi mặt đất ⇒ sinh ra, sống. Trong 誕生日 đọc じょう.', 'hatching-chick'),
    HAN('⑥', '校', 'HIỆU', 'trường học', 'コウ', '—', [['{学校|がっこう}', 'trường học'], ['{高校|こうこう}', 'trường cấp 3'], ['{日本語|にほんご} {学校|がっこう}', 'trường tiếng Nhật']],
      'Bộ 木 (gỗ) bên trái + 交 (giao) — ngày xưa trường học là nhà gỗ nơi người ta gặp nhau. Chỉ đọc コウ.', 'school'),
    HAN('⑦', '日', 'NHẬT', 'mặt trời; ngày', 'ニチ・ニ', 'ひ・か', [['{日本|にほん}', 'Nhật Bản'], ['{誕生日|たんじょうび}', 'ngày sinh'], ['{三日|みっか}', 'ngày mùng 3']],
      'Hình mặt trời. Trong 日本 đọc に; trong ngày tháng đọc にち hoặc か (みっか, よっか).', 'sun'),
    HAN('⑧', '本', 'BẢN', 'gốc; sách', 'ホン', 'もと', [['{日本|にほん}', 'Nhật Bản'], ['{日本人|にほんじん}', 'người Nhật'], ['{本|ほん}', 'quyển sách (Bài 2)']],
      'Chữ 木 (cây) thêm một vạch ở gốc ⇒ "gốc". 日本 = "gốc mặt trời", đất nước mặt trời mọc.', 'books'),
    HAN('⑨', '語', 'NGỮ', 'lời nói; tiếng (ngôn ngữ)', 'ゴ', 'かた(る)', [['{日本語|にほんご}', 'tiếng Nhật'], ['{日本語|にほんご} {学校|がっこう}', 'trường tiếng Nhật']],
      'Bộ 言 (lời nói) bên trái + 吾 (ta) — "lời nói của ta". Tên nước + 語 = tiếng nước đó (Bài 2 học thêm).', 'speaking-head'),
    S('{漢字|かんじ} — Đọc không furigana', {
      j: ['!① 私は日本人です。', '!② 学生です。', '!③ 日本語学校', '!④ 二十才'],
      hoi: 'Đọc to bốn dòng (không có furigana — giống đề thi).',
      dap: `① ${A('{私|わたし} は {日本人|にほんじん} です。')} ② ${A('{学生|がくせい} です。')} ③ にほんご がっこう ④ はたち`,
      ghi: 'Phần đọc to của kỳ thi in chữ Hán không furigana. Che phần đáp án, tự đọc, rồi mới mở ra so.',
    }),
    S('{第1課|だいいっか} {復習|ふくしゅう} — ポイント 1–6', {
      bang: B(['ポイント', 'Mẫu', 'Ví dụ'], [
        ['1', 'N1 は N2 です', '{私|わたし}はワンです。'],
        ['2', 'ですか ／ じゃありません', '{学生|がくせい}ですか。— いいえ、{学生|がくせい}じゃありません。'],
        ['3', 'どちら・いつ・{何|なん}', 'お{国|くに}はどちらですか。 {誕生日|たんじょうび}はいつですか。'],
        ['4', 'N1 の N2', 'ふじ{大学|だいがく}の{学生|がくせい}'],
        ['5', 'N1 と N2', 'サッカーとテニス'],
        ['6', 'N も', '{私|わたし}も{学生|がくせい}です。'],
      ]),
      ghi: 'Cả Bài 1 chỉ có sáu mẫu này. Đọc từng ví dụ thành tiếng, rồi tự đặt một câu mới cho mỗi mẫu.',
    }),
    S('もう{一度|いちど}{聞|き}こう — Nghe lại cả bài', {
      anh: ['woman-student', 'man-student'],
      nhan: ['アンナ', 'ナタポン'],
      j: [
        'アンナ： はじめまして。 ^アンナ です。 ロシア{人|じん} です。',
        'ナタポン： はじめまして。 ^ナタポン です。 タイ{人|じん} です。 さくら {大学|だいがく} の {学生|がくせい} です。',
        'アンナ： {私|わたし} も さくら {大学|だいがく} の {学生|がくせい} です。 {趣味|しゅみ} は {何|なん} です か。',
        'ナタポン： テニス と {映画|えいが} です。',
        'アンナ： そう です か。 どうぞ よろしく お{願|ねが}い します。',
      ],
      ghi: 'もう一度聞こう = nghe lại lần nữa. Đoạn này gom đủ ポイント 1, 4, 5, 6 và câu hỏi 何. Nghe đến khi hiểu không cần nhìn chữ.',
    }),
    S('Cô hay gọi — CQ9.4: Tự giới thiệu trọn bài', {
      j: [
        'はじめまして。 ^グエン です。 ベトナム{人|じん} です。',
        'FPT {大学|だいがく} の {学生|がくせい} です。 {十九歳|じゅうきゅうさい} です。',
        '{趣味|しゅみ} は サッカー と {音楽|おんがく} です。 どうぞ よろしく お{願|ねが}い します。',
      ],
      hoi: 'Lần đầu gặp, giới thiệu bản thân gồm những ý nào, theo thứ tự nào?',
      dap: 'Chào → tên → nước → trường/nghề → tuổi (sinh nhật) → sở thích → よろしくお{願|ねが}いします.',
      ghi: 'Bảy câu này là "bài tủ" cho cả Bài kiểm tra 1 lẫn phần đầu thi nói cuối kỳ. Thuộc lòng, nói trơn trong 30 giây.',
    }),
    S('{宿題確認|しゅくだいかくにん} & báo trước Bài kiểm tra 1', {
      bang: B(['Slot 11 — Bài kiểm tra 1', 'Cần ôn'], [
        ['Bảng chữ', 'hiragana · katakana · âm đục · âm ghép · trường âm · âm ngắt'],
        ['Từ vựng Bài 1', 'nước, 〜{人|じん}, nghề, tuổi, tháng, ngày, sở thích'],
        ['Ngữ pháp', 'ポイント 1–6 (は・です・じゃありません・か・の・と・も・どちら・いつ・{何|なん})'],
        ['Chữ Hán', '私 人 才 学 生 校 日 本 語'],
      ]),
      ghi: '宿題確認 = kiểm tra bài tập về nhà. Phạm vi bài kiểm tra theo đề cương là "bảng chữ + Bài 1" — dạng đề cụ thể tuỳ cô.',
    }),
    S('まとめ — Tóm tắt Slot 10', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Tôi cũng vậy', '{私|わたし}**も**〜です。 {同|おな}じですね。'],
        ['Khác nhau', 'そうですか。{私|わたし}の〜は〜です。'],
        ['Chữ Hán', '私 人 才 学 生 校 日 本 語'],
      ]),
      ghi: 'Về nhà: viết mỗi chữ Hán 10 lần kèm từ ví dụ, đọc bảng ポイント 1–6, nói bài tự giới thiệu 7 câu. Slot 11: kiểm tra rồi sang Bài 2.',
    }),
  ],
  [
    Q('A: ワンさんは{学生|がくせい}です。 B: パクさん（　）{学生|がくせい}です。 (Park cũng là sinh viên)', 'も', 'は | の | と', 'も = cũng, đứng thay chỗ は (ポイント 6).'),
    Q('Câu nào ĐÚNG?', '{私|わたし}も{料理|りょうり}です。', '{私|わたし}はも{料理|りょうり}です。 | {私|わたし}もは{料理|りょうり}です。 | {私|わたし}の も {料理|りょうり}です。', 'も thay hẳn は, không đứng cạnh は.'),
    Q('{学校|がっこう} đọc là:', 'がっこう', 'がくこう | がっこ | がくせい', '学 (ガク) rút thành ガッ trước こう.'),
    Q('Chữ nào nghĩa là "người"?', '人', '日 | 本 | 生', '人 = NHÂN (người): 日本人.'),
    Q('{日本語|にほんご} nghĩa là:', 'tiếng Nhật', 'người Nhật | nước Nhật | trường tiếng Nhật', '語 = tiếng (ngôn ngữ); người Nhật là 日本人.'),
    Q('二十才 đọc là:', 'はたち', 'にじゅうさい | はつか | にじっさい', '才 viết tắt cho 歳; 20 tuổi đọc はたち.'),
    Q('Hai người trùng sinh nhật, bạn nói:', '{同|おな}じですね。', 'そうですか。 | こちらこそ。 | はじめまして。', '同じですね = giống nhau nhỉ.'),
  ],
);

/* ── Slide tổng hợp Bài 1 ── */
const B1_TONG_HOP = TONG_HOP(
  1,
  'Có một bộ slide "bản tóm tắt thi" của Bài 1: toàn bộ 52 từ của danh sách cô (gom nhóm, có tranh), sáu ポイント với công thức + ví dụ, và các lỗi hay mất điểm.',
  [
    '**Phần 1 — Từ vựng theo nhóm**: chào hỏi · nước & 〜人 · trường & nghề · tuổi · tháng · ngày · sở thích · từ để hỏi · câu đáp.',
    '**Phần 2 — Ngữ pháp ポイント 1–6**: mỗi điểm một ô công thức + ví dụ + câu hỏi tự kiểm tra.',
    '**Phần 3 — Tổng hợp**: bảng trợ từ, hội thoại gộp, đoạn tự giới thiệu mẫu, lỗi hay mất điểm.',
    'Giải thích kỹ từng điểm nằm ở các deck **Slot 7–10**; bộ này để ôn nhanh trước kiểm tra / thi.',
  ],
  'JPD113 · Bài 1 はじめまして · Slide tổng hợp',
  [
    S('{第1課|だいいっか} はじめまして — Tổng hợp từ vựng & ngữ pháp', {
      anh: ['name-badge', 'birthday-cake', 'soccer-ball'],
      nhan: ['{名前|なまえ}・{国|くに}・{仕事|しごと}', '{誕生日|たんじょうび}', '{趣味|しゅみ}'],
      j: ['!Phần 1: từ vựng · Phần 2: ポイント 1–6 · Phần 3: tổng hợp'],
      ghi: 'Bộ slide ôn cả Bài 1 trong một lượt. Gặp chỗ nào chưa chắc thì mở lại deck của Slot tương ứng.',
    }),
    S('ことば ① — Chào hỏi', {
      anh: ['person-bowing', 'handshake', 'waving-hand'],
      nhan: ['はじめまして', 'こちらこそ', 'こんにちは'],
      bang: B(['Từ / câu', 'Nghĩa'], [
        ['はじめまして', 'rất vui được gặp (lần đầu)'],
        ['（どうぞ）よろしくお{願|ねが}いします', 'mong được giúp đỡ'],
        ['こちらこそ', 'chính tôi mới phải'],
        ['こんにちは', 'xin chào (ban ngày)'],
      ]),
      ghi: 'Bốn câu xã giao của buổi làm quen. Thi nói: vào phòng chào こんにちは, tự giới thiệu mở bằng はじめまして, kết bằng よろしくお願いします.',
    }),
    S('ことば ② — Gọi người, đáp lời, thán từ', {
      anh: ['person-raising-hand', 'check-mark-button', 'cross-mark', 'face-with-open-mouth'],
      nhan: ['あのう、すみません', 'はい', 'いいえ', 'わあ'],
      bang: B(['Từ', 'Nghĩa'], [
        ['あのう／すみません', 'dạ… / xin lỗi cho hỏi'],
        ['はい／いいえ', 'vâng / không'],
        ['そうですか', 'thế à (đã hiểu)'],
        ['あ（っ）／わあ', 'a! (chợt nhận ra) / oa! (vui)'],
        ['{同|おな}じですね', 'giống nhau nhỉ'],
      ]),
      ghi: 'Những từ ngắn này làm hội thoại tự nhiên hơn hẳn. そうですか xuống giọng ở cuối, không phải câu hỏi.',
    }),
    S('ことば ③ — Nước', {
      anh: ['map-of-japan', 'globe-showing-asia-australia', 'globe-showing-americas', 'globe-showing-europe-africa'],
      nhan: ['{日本|にほん}', 'ベトナム・タイ・オーストラリア', 'アメリカ・ブラジル', 'イタリア・ロシア'],
      j: ['{日本|にほん}、 {中国|ちゅうごく}、 {韓国|かんこく}、 タイ、 ベトナム、 オーストラリア', 'アメリカ、 ブラジル、 イタリア、 ロシア'],
      ghi: 'Mười tên nước của Bài 1. Chữ Hán: 日本, 中国, 韓国; còn lại viết katakana.',
    }),
    S('ことば ④ — お{国|くに} và 〜{人|じん}', {
      bang: B(['Từ', 'Đọc', 'Nghĩa'], [
        ['（お）{国|くに}', 'okuni', 'đất nước (お = của bạn)'],
        ['〜{人|じん}', 'jin', 'người nước 〜'],
        ['どちら', 'dochira', 'ở đâu, phía nào (lịch sự)'],
        ['お{国|くに}はどちらですか', 'okuni wa dochira desu ka', 'bạn đến từ nước nào?'],
        ['〜さん', 'san', 'anh/chị/bạn 〜 (gọi người khác)'],
      ]),
      ghi: 'さん chỉ dùng cho người khác, không dùng cho mình. お đầu 国, 名前, 仕事 = của người nghe.',
    }),
    S('ことば ⑤ — Trường học & công việc', {
      anh: ['student', 'teacher', 'office-worker', 'school'],
      nhan: ['{学生|がくせい}', '{先生|せんせい}・{教師|きょうし}', '{会社員|かいしゃいん}・{社員|しゃいん}', '{高校|こうこう}・{大学|だいがく}'],
      bang: B(['Từ', 'Đọc', 'Nghĩa'], [
        ['{日本語|にほんご}{学校|がっこう}', 'nihongo gakkou', 'trường tiếng Nhật'],
        ['（お）{仕事|しごと}', 'oshigoto', 'công việc'],
        ['{先生|せんせい} ／ {教師|きょうし}', 'sensei / kyoushi', 'thầy cô (gọi) / giáo viên (nghề mình)'],
        ['{会社員|かいしゃいん} ／ {社員|しゃいん}', 'kaishain / shain', 'nhân viên công ty (chung) / nhân viên của 〜'],
      ]),
      ghi: 'Hai cặp dễ nhầm: 先生–教師 và 会社員–社員. Có tên công ty phía trước の thì dùng 社員.',
    }),
    S('ことば ⑥ — Tuổi', {
      anh: ['birthday-cake'],
      nhan: ['{誕生日|たんじょうび}'],
      bang: B(['Tuổi', 'Đọc'], [
        ['1{歳|さい} ／ 8{歳|さい} ／ 10{歳|さい}', 'いっさい ／ はっさい ／ じゅっさい'],
        ['20{歳|さい}（{二十歳|はたち}）', 'はたち'],
        ['{何歳|なんさい}', 'なんさい — mấy tuổi'],
      ]),
      ghi: '〜歳 = 〜 tuổi, viết tắt 才. Âm ngắt ở 1, 8, 10; 20 tuổi đọc riêng はたち.',
    }),
    S('ことば ⑦ — Tháng', {
      anh: ['spiral-calendar'],
      nhan: ['〜{月|がつ}'],
      bang: B(['Tháng', 'Đọc', 'Tháng', 'Đọc'], [
        ['1・2・3{月|がつ}', 'いち・に・さんがつ', '7{月|がつ}', '**しちがつ**'],
        ['4{月|がつ}', '**しがつ**', '8{月|がつ}', 'はちがつ'],
        ['5・6{月|がつ}', 'ご・ろくがつ', '9{月|がつ}', '**くがつ**'],
        ['{何月|なんがつ}', 'なんがつ — tháng mấy', '10・11・12{月|がつ}', 'じゅう・じゅういち・じゅうにがつ'],
      ]),
      ghi: 'Chỉ ba tháng có bẫy: 4 しがつ, 7 しちがつ, 9 くがつ.',
    }),
    S('ことば ⑧ — Ngày', {
      bang: B(['Ngày', 'Đọc', 'Ngày', 'Đọc'], [
        ['1{日|にち}', 'ついたち', '6{日|にち}', 'むいか'],
        ['2{日|にち}', 'ふつか', '7{日|にち}', 'なのか'],
        ['3{日|にち}', 'みっか', '8{日|にち}', 'ようか'],
        ['4{日|にち}', 'よっか', '9{日|にち}', 'ここのか'],
        ['5{日|にち}', 'いつか', '10{日|にち}', 'とおか'],
        ['14{日|にち}', 'じゅうよっか', '20{日|にち}', 'はつか'],
        ['24{日|にち}', 'にじゅうよっか', '11, 12…', 'số + にち'],
      ]),
      ghi: 'Ngày 1–10, 14, 20, 24 đọc riêng; còn lại số + にち. Nói ngày sinh: tháng trước, ngày sau.',
    }),
    S('ことば ⑨ — Sở thích (thể thao)', {
      anh: ['soccer-ball', 'tennis', 'person-swimming', 'sports-medal'],
      nhan: ['サッカー', 'テニス', '{水泳|すいえい}', 'スポーツ'],
      j: ['{趣味|しゅみ} は スポーツ です。 サッカー と テニス です。'],
      ghi: 'Nhóm thể thao: スポーツ (chung), サッカー, テニス, 水泳.',
    }),
    S('ことば ⑩ — Sở thích (giải trí)', {
      anh: ['cinema', 'musical-notes', 'open-book', 'luggage'],
      nhan: ['{映画|えいが}', '{音楽|おんがく}', '{読書|どくしょ}', '{旅行|りょこう}'],
      j: ['!+ {料理|りょうり} (ryouri) — nấu ăn; món ăn', '{私|わたし} の {趣味|しゅみ} は {料理|りょうり} です。'],
      ghi: 'Năm từ giải trí: 映画, 音楽, 読書, 旅行, 料理. Cùng nhóm thể thao là đủ 9 từ sở thích của Bài 1.',
    }),
    S('ことば ⑪ — Từ để hỏi', {
      bang: B(['Từ hỏi', 'Hỏi gì', 'Ví dụ'], [
        ['どちら', 'nước, nơi (lịch sự)', 'お{国|くに}はどちらですか。'],
        ['いつ', 'khi nào', '{誕生日|たんじょうび}はいつですか。'],
        ['{何|なん}', 'cái gì', '{趣味|しゅみ}は{何|なん}ですか。'],
        ['{何歳|なんさい}', 'mấy tuổi', '{何歳|なんさい}ですか。'],
      ]),
      ghi: 'Bốn từ hỏi của Bài 1 đều đứng đúng chỗ thông tin, câu trả lời không dùng はい／いいえ.',
    }),
    S('ポイント 1 — N1 は N2 です', {
      bang: B(['N1', 'は (wa)', 'N2', 'です'], [['{私|わたし}', 'は', 'ワン', 'です。'], ['マルコさん', 'は', 'イタリア{人|じん}', 'です。']]),
      j: ['{私|わたし} は {学生|がくせい} です。'],
      ghi: 'Khuôn câu gốc của mọi bài sau. は đọc wa; です cuối câu cho lịch sự.',
    }),
    S('ポイント 1 — Câu hỏi rút gọn', {
      j: ['A： お{名前|なまえ} は？', 'B： ^ワン です。', 'A： お{仕事|しごと} は？', 'B： {学生|がくせい} です。'],
      hoi: 'Vì sao không nói 「{私|わたし}はワンさんです」?',
      dap: 'Vì さん là để gọi người khác; nói về mình chỉ nói tên: {私|わたし}はワンです。',
      ghi: 'N は？ lên giọng = hỏi rút gọn rất lịch sự. Trả lời bằng khuôn ポイント 1.',
    }),
    S('ポイント 2 — です／じゃありません／ですか', {
      bang: B(['Loại', 'Đuôi', 'Ví dụ'], [
        ['Khẳng định', 'です', '{学生|がくせい}です。'],
        ['Phủ định', 'じゃありません', '{学生|がくせい}じゃありません。'],
        ['Câu hỏi', 'ですか', '{学生|がくせい}ですか。'],
      ]),
      ghi: 'Ba câu chỉ khác đuôi. Phủ định trang trọng hơn là ではありません — gặp trong sách, nói thì じゃありません.',
    }),
    S('ポイント 2 — はい／いいえ', {
      j: ['A： ^カルロス-さん は {学生|がくせい} です か。', 'B： いいえ、 {学生|がくせい} じゃ ありません。 {会社員|かいしゃいん} です。'],
      hoi: '「メアリーさんはアメリカ{人|じん}ですか」 — đúng là người Mỹ. Trả lời?',
      dap: A('はい、 アメリカ{人|じん} です。'),
      ghi: 'いいえ thì luôn nói thêm thông tin đúng. はい thì lặp lại danh từ + です.',
    }),
    S('ポイント 3 — どちら', {
      j: ['A： お{国|くに} は どちら です か。', 'B： {韓国|かんこく} です。'],
      hoi: 'Câu trả lời 「はい、{韓国人|かんこくじん}です」 sai ở đâu?',
      dap: 'Hai chỗ: câu hỏi có どちら nên không dùng はい; hỏi nước thì đáp tên nước ({韓国|かんこく}です), không đáp 〜{人|じん}.',
      ghi: 'どちら là "ở đâu" lịch sự. Bài 2 còn gặp lại どちら khi hỏi chỗ trong cửa hàng.',
    }),
    S('ポイント 3 — いつ', {
      anh: ['birthday-cake', 'spiral-calendar'],
      nhan: ['{誕生日|たんじょうび}', '〜{月|がつ}〜{日|にち}'],
      j: ['A： {誕生日|たんじょうび} は いつ です か。', 'B： {9月|くがつ} {14日|じゅうよっか} です。'],
      ghi: 'いつ = khi nào. Trả lời ngày sinh: 〜月〜日です.',
    }),
    S('ポイント 3 — {何|なん}', {
      j: ['A： {趣味|しゅみ} は {何|なん} です か。', 'B： {読書|どくしょ} です。'],
      hoi: '何 trong câu này đọc なに hay なん?',
      dap: 'なん — trước です, 何 đọc なん.',
      ghi: 'Bài 3 sẽ gặp 何 đọc なに (何をしますか). Ở Bài 1 chỉ có なん.',
    }),
    S('ポイント 4 — N1 の N2', {
      bang: B(['N1', 'の', 'N2 (chính)'], [['ふじ{大学|だいがく}', 'の', '{学生|がくせい}'], ['ABC', 'の', '{社員|しゃいん}'], ['{私|わたし}', 'の', '{趣味|しゅみ}']]),
      j: ['^マルコ-さん は ふじ {大学|だいがく} の {学生|がくせい} です。'],
      ghi: 'Cái chính đứng SAU の — ngược tiếng Việt. の còn dùng cho "của": 私の名前, ワンさんの趣味.',
    }),
    S('ポイント 4 — Tự kiểm tra', {
      hoi: 'Dịch: "giáo viên trường tiếng Nhật" · "sở thích của anh Carlos" · "nhân viên công ty ABC".',
      dap: '{日本語|にほんご}{学校|がっこう}の{先生|せんせい} · カルロスさんの{趣味|しゅみ} · ABCの{社員|しゃいん}',
      ghi: 'Mẹo: tìm cái chính (người/vật được nói tới) rồi đặt nó sau cùng.',
    }),
    S('ポイント 5 — N1 と N2', {
      bang: B(['N1', 'と', 'N2'], [['サッカー', 'と', 'テニス'], ['{映画|えいが}', 'と', '{音楽|おんがく}']]),
      j: ['{趣味|しゅみ} は {旅行|りょこう} と {料理|りょうり} です。', '!~~{学生|がくせい}です と {日本人|にほんじん}です~~ ✗ (と không nối câu)'],
      ghi: 'と = và, chỉ nối danh từ.',
    }),
    S('ポイント 6 — N も', {
      j: ['A： {私|わたし} は {学生|がくせい} です。', 'B： {私|わたし} も {学生|がくせい} です。 {同|おな}じ です ね。', '!~~{私|わたし}はも~~ ✗'],
      hoi: '"Sở thích của tôi cũng là âm nhạc" nói thế nào?',
      dap: A('{私|わたし} の {趣味|しゅみ} も {音楽|おんがく} です。'),
      ghi: 'も đứng thay chỗ は. 私の趣味は → 私の趣味も.',
    }),
    S('Bảng trợ từ & đuôi câu Bài 1', {
      bang: B(['', 'Vai trò', 'Ví dụ'], [
        ['は (wa)', 'chủ đề "còn… thì"', '{私|わたし}は'],
        ['の', 'của / thuộc', 'ふじ{大学|だいがく}の{学生|がくせい}'],
        ['と', 'và (nối danh từ)', 'サッカーとテニス'],
        ['も', 'cũng (thay は)', '{私|わたし}も'],
        ['か', 'câu hỏi', '{学生|がくせい}ですか'],
      ]),
      ghi: 'Năm trợ từ này đủ cho mọi câu của Bài 1. Đề trắc nghiệm hay cho điền đúng một trong năm cái này.',
    }),
    S('{会話|かいわ} — Hội thoại tổng hợp', {
      anh: ['woman-student', 'man-student'],
      nhan: ['メアリー', 'カルロス'],
      j: [
        'メアリー： はじめまして。 ^メアリー です。 アメリカ{人|じん} です。',
        'カルロス： はじめまして。 ^カルロス です。 ブラジル{人|じん} です。 ABC の {社員|しゃいん} です。',
        'メアリー： ^カルロス-さん、 {誕生日|たんじょうび} は いつ です か。',
        'カルロス： {4月|しがつ} {1日|ついたち} です。',
        'メアリー： わあ、 {私|わたし} も {4月|しがつ} {1日|ついたち} です。 {同|おな}じ です ね。',
      ],
      ghi: 'Đoạn này gói đủ ポイント 1, 3, 4, 6. Đọc to đổi vai, sau đó tự thay thông tin của mình.',
    }),
    S('Tự giới thiệu mẫu — 7 câu', {
      j: [
        'はじめまして。',
        '{私|わたし} は ^グエン です。 ベトナム{人|じん} です。',
        'FPT {大学|だいがく} の {学生|がくせい} です。',
        '{十九歳|じゅうきゅうさい} です。 {誕生日|たんじょうび} は {8月|はちがつ} {20日|はつか} です。',
        '{趣味|しゅみ} は {音楽|おんがく} と サッカー です。',
        'どうぞ よろしく お{願|ねが}い します。',
      ],
      ghi: 'Bài tự giới thiệu dùng đủ sáu ポイント. Đây là đoạn bạn phải nói trơn trong thi nói.',
    }),
    S('⚠ Lỗi hay mất điểm Bài 1', {
      bang: B(['Sai', 'Đúng', 'Vì sao'], [
        ['~~{私|わたし}はワンさんです~~', '{私|わたし}はワンです', 'さん không dùng cho mình'],
        ['~~はい、ベトナムです~~ (hỏi どちら)', 'ベトナムです', 'có từ hỏi ⇒ không はい'],
        ['~~{学生|がくせい}のふじ{大学|だいがく}~~', 'ふじ{大学|だいがく}の{学生|がくせい}', 'cái chính đứng sau の'],
        ['~~{私|わたし}はも{学生|がくせい}~~', '{私|わたし}も{学生|がくせい}', 'も thay は'],
        ['~~よんがつ・ななにち~~', 'しがつ・なのか', 'đọc tháng/ngày đặc biệt'],
      ]),
      ghi: 'Năm lỗi này chiếm phần lớn điểm bị trừ ở Bài 1. Đọc cột "Đúng" thành tiếng ba lần.',
    }),
    S('まとめ — Bài 1 trong một slide', {
      bang: B(['Hỏi', 'Đáp mẫu'], [
        ['お{名前|なまえ}は？', 'ワンです。'],
        ['お{国|くに}はどちらですか。', '{中国|ちゅうごく}です。'],
        ['お{仕事|しごと}は？', 'ふじ{大学|だいがく}の{学生|がくせい}です。'],
        ['{何歳|なんさい}ですか。', '{二十歳|はたち}です。'],
        ['{誕生日|たんじょうび}はいつですか。', '{3月|さんがつ}{3日|みっか}です。'],
        ['{趣味|しゅみ}は{何|なん}ですか。', '{映画|えいが}と{音楽|おんがく}です。'],
      ]),
      ghi: 'Sáu câu hỏi này là toàn bộ "đề nói" của Bài 1. Che cột phải, tự trả lời bằng thông tin của mình.',
    }),
  ],
  [
    Q('ワンさん（　）{中国人|ちゅうごくじん}です。', 'は', 'の | と | を', 'Chủ đề của câu: は (ポイント 1).'),
    Q('あおぞら{大学|だいがく}（　）{学生|がくせい}です。', 'の', 'は | と | も', 'Sinh viên CỦA trường: の (ポイント 4).'),
    Q('「お{国|くに}はどちらですか。」 — Đáp:', 'タイです。', 'はい、タイです。 | タイ{人|じん}ですか。 | タイの{国|くに}です。', 'Hỏi nước ⇒ tên nước; không はい.'),
    Q('{8日|ようか} là ngày:', 'mùng 8', 'mùng 4 | ngày 20 | ngày 18', 'ようか = mùng 8; よっか = mùng 4; はつか = 20.'),
    Q('Sở thích của Park cũng là nấu ăn: 「パクさんの{趣味|しゅみ}（　）{料理|りょうり}です。」', 'も', 'は | と | の', 'も = cũng.'),
    Q('"Tôi không phải người Nhật."', '{私|わたし}は{日本人|にほんじん}じゃありません。', '{私|わたし}は{日本人|にほんじん}ですか。 | {私|わたし}も{日本人|にほんじん}です。 | {私|わたし}は{日本人|にほんじん}ありません。', 'Phủ định: じゃありません.'),
  ],
);

/* ═════════════════════════════ BÀI 2 どこですか・いくらですか ═════════════════════════════ */

/* ── Slot 11 (tiết 31–33): Bài kiểm tra 1 · Bài 2 ST1 話してみよう, 聞いてみよう, チャレンジ1 何階 ── */
const B2_SLOT11 = SLOT(
  2, '11', 'kiem-tra-1-mo-bai-2-tang',
  'Bài kiểm tra 1 · mở Bài 2 ST1: trong toà nhà mua sắm, 〜は何階ですか',
  'Làm Bài kiểm tra 1 (bảng chữ + Bài 1) không hoảng, rồi gọi tên được các chỗ trong một toà nhà mua sắm, đọc đúng 〜階 và hỏi – đáp "〜 ở tầng mấy?".',
  [
    '**Đầu giờ — Bài kiểm tra 1**: bảng chữ hiragana / katakana + Bài 1 (từ vựng, ポイント 1–6, chữ Hán).',
    '**Mở Bài 2 どこですか・いくらですか** — ba tình huống: toà nhà mua sắm · cửa hàng · nhà hàng.',
    '**Từ mới ST1**: インフォメーション · エレベーター · エスカレーター · トイレ · ATM · レジ · きつえんじょ · スーパー · レストラン · きっさてん · 〜屋 · 地下.',
    '**〜階 + 何階ですか**: 3階 さんがい, 6階 ろっかい, 8階 はっかい, 10階 じゅっかい, 何階 なんがい.',
    'チャレンジ 1 + 言ってみよう 1: hỏi quầy thông tin, đọc bảng hướng dẫn tầng. Câu cô hay gọi: CQ12.1–12.3.',
  ],
  'JPD113 · Bài 2 どこですか・いくらですか · Slot 11',
  [
    S('Slot 11 — Bài kiểm tra 1 · {第2課|だいにか} mở đầu', {
      anh: ['memo', 'department-store'],
      nhan: ['', '{何階|なんがい}？'],
      j: ['!Đầu giờ: **Bài kiểm tra 1** · Sau đó: **Bài 2 ST1 — tầng mấy?**'],
      ghi: 'Nửa đầu buổi làm bài kiểm tra nhỏ thứ nhất (20% điểm). Nửa sau mở Bài 2 — bài về mua sắm, dùng nhiều số hơn Bài 1.',
    }),
    S('Bài kiểm tra 1 — phạm vi', {
      bang: B(['Phần', 'Nội dung cần chắc'], [
        ['Bảng chữ', 'hiragana · katakana · âm đục · âm ghép · trường âm · âm ngắt'],
        ['Từ vựng Bài 1', 'nước, 〜{人|じん}, nghề, tuổi, tháng, ngày, sở thích'],
        ['Ngữ pháp Bài 1', 'ポイント 1–6: は・です／じゃありません・か・どちら／いつ／{何|なん}・の・と・も'],
        ['Chữ Hán Bài 1', '私 人 才 学 生 校 日 本 語'],
      ]),
      ghi: 'Phạm vi theo đề cương là "bảng chữ + bài 1"; dạng đề cụ thể do cô quyết. Làm phần chắc trước, câu nào phân vân để sau.',
    }),
    S('Ôn nhanh trước giờ kiểm tra', {
      j: ['!① Đọc ngày: 4/14', '!② 「お{国|くに}はどちらですか」 → ?', '!③ 「{私|わたし}（　）{学生|がくせい}です。」 (cũng)'],
      hoi: 'Trả lời cả ba câu.',
      dap: `① {4月|しがつ}{14日|じゅうよっか} · ② ${A('ベトナム です。')} (không はい) · ③ も`,
      ghi: 'Ba câu đại diện ba loại câu hỏi hay ra: đọc ngày tháng, trả lời câu có từ để hỏi, điền trợ từ.',
    }),
    S('{第2課|だいにか} どこですか・いくらですか — できること', {
      anh: ['information', 'yen-banknote', 'curry-rice'],
      nhan: ['{何階|なんがい}？ どこ？', 'いくら？', '{何|なん}の{料理|りょうり}？'],
      j: ['!ST1: hỏi đồ bán ở **tầng mấy**, chỗ nào', '!ST2: hỏi **giá**, chọn, **mua**', '!ST3: **gọi món** ở nhà hàng, hỏi món làm từ gì, của ai'],
      ghi: 'Bài 2 là bài "đi mua sắm". Mọi câu vẫn dựng trên khung Bài 1 (N は N です), chỉ thêm từ chỉ chỗ, chỉ vật và số tiền.',
    }),
    S('{話|はな}してみよう — Mua sắm ở đâu?', {
      anh: ['department-store', 'shopping-cart', 'convenience-store'],
      nhan: ['', 'スーパー', ''],
      j: ['!Bạn vào một toà nhà mua sắm lớn lần đầu, muốn tìm nhà vệ sinh.'],
      hoi: 'Bạn sẽ hỏi ai? Mở lời bằng câu gì (đã học ở Bài 1)?',
      dap: 'Hỏi quầy thông tin (インフォメーション) hoặc nhân viên ({店員|てんいん}); mở lời: あのう、すみません。',
      ghi: '話してみよう = thử nói xem: cô cho cả lớp đoán tình huống trước khi học từ. あのう、すみません dùng lại từ Bài 1.',
    }),
    S('{新|あたら}しいことば ① — Trong toà nhà', {
      anh: ['information', 'elevator', 'restroom', 'atm-sign'],
      nhan: ['インフォメーション', 'エレベーター', 'トイレ', 'ATM'],
      j: ['エスカレーター、 レジ、 きつえんじょ'],
      ghi: 'エスカレーター = thang cuốn, エレベーター = thang máy — chỉ khác giữa カ và ベ, hay nhầm. レジ = quầy thu ngân; きつえんじょ = khu hút thuốc.',
    }),
    S('{新|あたら}しいことば ② — Cửa hàng', {
      anh: ['shopping-cart', 'fork-and-knife-with-plate', 'hot-beverage', 'books'],
      nhan: ['スーパー', 'レストラン', 'きっさてん', '{本屋|ほんや}'],
      j: ['{100円|ひゃくえん} ショップ', '〜{屋|や}： {本屋|ほんや}'],
      ghi: '〜屋 gắn sau đồ bán = cửa hàng đó: 本屋 = hiệu sách. きっさてん = quán giải khát kiểu cũ. 100円ショップ = cửa hàng đồng giá 100 yên.',
    }),
    S('{新|あたら}しいことば ③ — Tầng & tầng hầm', {
      anh: ['department-store', 'down-arrow'],
      nhan: ['〜{階|かい}', '{地下|ちか}'],
      j: ['{地下|ちか} {1階|いっかい}', '{何階|なんがい}'],
      ghi: '〜階 = tầng 〜; 地下 = dưới lòng đất ⇒ 地下1階 = tầng hầm 1. Ở Nhật siêu thị thực phẩm hay nằm ở tầng hầm của toà nhà.',
    }),
    S('Bảng hướng dẫn tầng', {
      bang: B(['Tầng', 'Đọc', 'Có gì'], [
        ['5{階|かい}', 'ごかい', 'レストラン'],
        ['4{階|かい}', 'よんかい', '{本屋|ほんや}'],
        ['3{階|かい}', 'さんがい', 'カメラ・パソコン'],
        ['2{階|かい}', 'にかい', 'くつ・かばん'],
        ['1{階|かい}', 'いっかい', 'インフォメーション・ATM'],
        ['{地下|ちか}1{階|かい}', 'ちかいっかい', 'スーパー'],
      ]),
      ghi: 'Bảng này dùng cho cả buổi. カメラ, パソコン, くつ, かばん là đồ bán ở các tầng — học kỹ ở ST2 (Slot 12).',
    }),
    S('〜{階|かい} — Đếm tầng (CQ12.2)', {
      bang: B(['Tầng', 'Đọc', 'Tầng', 'Đọc'], [
        ['1{階|かい}', '**いっかい**', '6{階|かい}', '**ろっかい**'],
        ['2{階|かい}', 'にかい', '7{階|かい}', 'ななかい'],
        ['3{階|かい}', '**さんがい**', '8{階|かい}', '**はっかい**'],
        ['4{階|かい}', 'よんかい', '9{階|かい}', 'きゅうかい'],
        ['5{階|かい}', 'ごかい', '10{階|かい}', '**じゅっかい**'],
        ['{何階|なんがい}', '**なんがい**', '{地下|ちか}1{階|かい}', 'ちかいっかい'],
      ]),
      ghi: 'Âm ngắt ở 1, 6, 8, 10 (いっ, ろっ, はっ, じゅっ). 3階 và 何階 đổi か thành が: さんがい, なんがい. Đây là CQ12.2.',
    }),
    S('〜は {何階|なんがい}ですか (CQ12.3)', {
      bang: B(['Hỏi', 'Đáp'], [['N は **{何階|なんがい}**ですか。', '**〜{階|かい}**です。']]),
      j: ['A： カメラ は {何階|なんがい} です か。', 'B： {3階|さんがい} です。'],
      ghi: 'Lại là khuôn N は N です với từ hỏi đứng đúng chỗ. Đáp ngắn: 〜階です.',
    }),
    S('チャレンジ 1 — Ở quầy thông tin', {
      anh: ['woman-student', 'information'],
      nhan: ['アンナ', 'インフォメーション'],
      j: [
        'アンナ： あのう、 すみません。 {本屋|ほんや} は {何階|なんがい} です か。',
        '{店員|てんいん}： {4階|よんかい} です。',
        'アンナ： {4階|よんかい} です か。 ありがとう ございます。',
      ],
      ghi: 'Nhắc lại thông tin vừa nghe (4階ですか) rồi cảm ơn — cách xác nhận rất tự nhiên. 店員 = nhân viên cửa hàng.',
    }),
    S('{言|い}ってみよう 1 — Đọc bảng tầng', {
      anh: ['mans-shoe', 'shopping-cart', 'fork-and-knife-with-plate'],
      nhan: ['くつ', 'スーパー', 'レストラン'],
      j: ['A： くつ は {何階|なんがい} です か。', 'A： スーパー は {何階|なんがい} です か。', 'A： レストラン は {何階|なんがい} です か。'],
      hoi: 'Nhìn "Bảng hướng dẫn tầng", trả lời ba câu.',
      dap: `${A('{2階|にかい} です。')} · ${A('{地下|ちか} {1階|いっかい} です。')} · ${A('{5階|ごかい} です。')}`,
      ghi: '言ってみよう = thử nói: thay từ vào khuôn và nói thành tiếng. Đọc to cả câu hỏi lẫn câu trả lời.',
    }),
    S('チャレンジ — Luyện cặp', {
      anh: ['camera', 'books', 'atm-sign', 'laptop'],
      nhan: ['カメラ', '{本屋|ほんや}', 'ATM', 'パソコン'],
      hoi: 'A hỏi từng thứ "〜は何階ですか", B trả lời theo bảng tầng.',
      dap: 'カメラは{3階|さんがい} · {本屋|ほんや}は{4階|よんかい} · ATMは{1階|いっかい} · パソコンは{3階|さんがい}',
      ghi: 'Đổi vai sau bốn câu. Ai đọc sai さんがい / いっかい thì làm lại lượt đó.',
    }),
    S('⚠ Lỗi hay gặp khi nói tầng', {
      j: ['!~~さんかい~~ → **さんがい**', '!~~なんかい~~ → **なんがい**', '!~~ろくかい~~ → **ろっかい**', '!~~じゅうかい~~ → **じゅっかい**'],
      ghi: 'Bốn chỗ này đổi âm — nghe CD rồi bắt chước. Sai cách đọc tầng là mất điểm phát âm trong thi nói.',
    }),
    S('Cô hay gọi — CQ12.1', {
      hoi: 'Khi vào trung tâm mua sắm, thường dùng những từ vựng gì?',
      dap: 'インフォメーション・エレベーター・エスカレーター・トイレ・レジ・ATM・きつえんじょ・〜{階|かい}・{地下|ちか}・〜{屋|や}・スーパー・レストラン・きっさてん',
      ghi: 'Kể được khoảng 8 từ trở lên là đạt. Nói kèm nghĩa để cô thấy bạn hiểu.',
    }),
    S('まとめ — Tóm tắt Slot 11', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Gọi người', 'あのう、すみません。'],
        ['Hỏi tầng', '〜は{何階|なんがい}ですか。'],
        ['Trả lời', '{3階|さんがい}です。／{地下|ちか}{1階|いっかい}です。'],
        ['Xác nhận + cảm ơn', '〜{階|かい}ですか。ありがとうございます。'],
      ]),
      ghi: 'Về nhà: đọc bảng 〜階 thật trơn, vẽ một toà nhà 5 tầng tự đặt đồ vào rồi tự hỏi – đáp. Slot sau: ここ・そこ・あそこ và hỏi giá.',
    }),
  ],
  [
    Q('{3階|さんがい} — tầng 3 đọc là:', 'さんがい', 'さんかい | みっかい | さんがつ', '3階 đổi か thành が: さんがい.'),
    Q('Tầng hầm 1:', '{地下|ちか}{1階|いっかい}', '{1階|いっかい} | {1階|いっかい}の{地下|ちか} | {地下|ちか}{1日|ついたち}', '地下 = dưới lòng đất.'),
    Q('「カメラは（　）ですか。」 — hỏi tầng mấy', '{何階|なんがい}', '{何|なん} | いつ | {何歳|なんさい}', '何階 = tầng mấy.'),
    Q('"Thang cuốn" là:', 'エスカレーター', 'エレベーター | インフォメーション | レジ', 'エスカレーター = thang cuốn; エレベーター = thang máy.'),
    Q('{本屋|ほんや} là:', 'hiệu sách', 'nhà hàng | quán cà phê | siêu thị', '本 (sách) + 屋 (cửa hàng).'),
    Q('Quầy thu ngân là:', 'レジ', 'トイレ | ATM | きっさてん', 'レジ = quầy tính tiền.'),
  ],
);

/* ── Slot 12 (tiết 34–36): ST1 チャレンジ2 ここ・そこ・あそこ / こちら… + やってみよう · ST2 チャレンジ1 いくら, これ・それ・あれ ── */
const B2_SLOT12 = SLOT(
  2, '12', 'koko-kochira-kore-ikura',
  'Bài 2 ST1–ST2: ここ・そこ・あそこ · こちら・そちら・あちら · これ・それ・あれ · いくら',
  'Hỏi "〜 ở đâu?" và chỉ chỗ bằng ここ・そこ・あそこ (lịch sự: こちら…), gọi tên đồ điện tử – đồ dùng – quần áo, chỉ vật bằng これ・それ・あれ và hỏi giá いくらですか.',
  [
    '**ポイント 9 — ここ・そこ・あそこ・どこ**: 〜はどこですか。— あそこです。',
    '**こちら・そちら・あちら・どちら**: cách nói lịch sự của nhân viên cửa hàng (CQ13.1).',
    '**やってみよう ST1**: nghe chỉ đường trong toà nhà.',
    '**ST2 — từ mới**: カメラ · 携帯電話 · 電子辞書 · パソコン · くつ · ズボン · Tシャツ · かばん · 時計 · 財布 · ペン · 消しゴム · 本.',
    '**ポイント 7 — これ・それ・あれ** + **ポイント 11 — いくら**: これはいくらですか。— それは〜円です。',
  ],
  'JPD113 · Bài 2 どこですか・いくらですか · Slot 12',
  [
    S('{第2課|だいにか} — Slot 12: どこですか · いくらですか', {
      anh: ['restroom', 'camera', 'yen-banknote'],
      nhan: ['トイレはどこ？', 'これは？', 'いくら？'],
      j: ['!Hôm nay: **chỉ chỗ · chỉ vật · hỏi giá**'],
      ghi: 'Hai nhóm từ "chỉ trỏ" của tiếng Nhật học trong cùng buổi: chỉ CHỖ (ここ…) và chỉ VẬT (これ…). Cùng một quy tắc gần – xa.',
    }),
    S('{復習|ふくしゅう} — {何階|なんがい}ですか', {
      j: ['!3{階|かい} · 6{階|かい} · 8{階|かい} · {何階|なんがい}'],
      hoi: 'Đọc bốn từ trên.',
      dap: 'さんがい · ろっかい · はっかい · なんがい',
      ghi: 'Bốn từ đổi âm của 〜階. Hôm nay gặp lại khi nhân viên chỉ đường.',
    }),
    S('ポイント 9 — ここ・そこ・あそこ・どこ', {
      bang: B(['', 'Gần người nói', 'Gần người nghe', 'Xa cả hai', 'Hỏi'], [
        ['Chỗ', 'ここ', 'そこ', 'あそこ', 'どこ'],
        ['Lịch sự', 'こちら', 'そちら', 'あちら', 'どちら'],
      ]),
      j: ['!**N は ここ／そこ／あそこ です。** — N ở chỗ này / chỗ đó / chỗ kia'],
      ghi: 'こ = gần mình, そ = gần người nghe, あ = xa cả hai, ど = hỏi. Học một hàng là suy ra được các hàng khác (これ, この… cũng vậy).',
    }),
    S('〜は どこですか (CQ12.4)', {
      anh: ['restroom', 'atm-sign', 'elevator'],
      nhan: ['トイレ', 'ATM', 'エレベーター'],
      bang: B(['Hỏi', 'Đáp'], [['N は **どこ**ですか。', '**あそこ**です。']]),
      j: ['A： トイレ は どこ です か。', 'B： あそこ です。'],
      ghi: 'Hỏi chỗ của một nơi hay một món đồ: N はどこですか. Người trả lời vừa nói vừa chỉ tay.',
    }),
    S('チャレンジ 2.1 — ATMはどこですか', {
      anh: ['woman-student', 'person-tipping-hand'],
      nhan: ['ワン', '{店員|てんいん}'],
      j: [
        'ワン： すみません。 ATM は どこ です か。',
        '{店員|てんいん}： そこ です。',
        'ワン： あ、 そう です か。 ありがとう ございます。',
      ],
      ghi: 'ATM ở gần Wang (người nghe) nên nhân viên nói そこ. あ = "à!" chợt thấy — từ của Bài 1.',
    }),
    S('こちら・そちら・あちら (CQ13.1)', {
      bang: B(['Thường', 'Lịch sự (nhân viên nói)'], [
        ['ここ', 'こちら'],
        ['そこ', 'そちら'],
        ['あそこ', 'あちら'],
        ['どこ', 'どちら'],
      ]),
      j: ['{店員|てんいん}： エレベーター は あちら です。'],
      ghi: 'Nhân viên nói với khách luôn dùng hàng こちら cho lịch sự. Khách hỏi bằng どこ hay どちら đều được — どちら lịch sự hơn.',
    }),
    S('チャレンジ 2.2 — どちらですか', {
      anh: ['man-office-worker', 'person-tipping-hand'],
      nhan: ['カルロス', '{店員|てんいん}'],
      j: [
        'カルロス： すみません、 エスカレーター は どちら です か。',
        '{店員|てんいん}： あちら です。',
        'カルロス： ありがとう ございます。',
      ],
      ghi: 'Cùng ý với チャレンジ 2.1 nhưng cả hai đều lịch sự hơn. Khi thi đóng vai nhân viên, nhớ dùng こちら・そちら・あちら.',
    }),
    S('どちら — gặp lại từ Bài 1', {
      j: ['お{国|くに} は どちら です か。', 'レジ は どちら です か。'],
      hoi: 'Hai câu trên dùng どちら với nghĩa gì?',
      dap: 'Cả hai = どこ (ở đâu) nói lịch sự: "nước của bạn ở đâu / là nước nào?" và "quầy thu ngân ở đâu ạ?".',
      ghi: 'Giờ thì hiểu vì sao Bài 1 hỏi nước bằng どちら: đó là どこ phiên bản lịch sự.',
    }),
    S('やってみよう ST1 — Nghe chỉ đường', {
      j: [
        'A： すみません、 レジ は どこ です か。',
        'B： レジ です か。 {地下|ちか} {1階|いっかい} です。 エスカレーター は あちら です。',
        'A： ありがとう ございます。',
      ],
      hoi: 'Quầy thu ngân ở đâu? Khách đi bằng gì, ở hướng nào?',
      dap: 'Ở tầng hầm 1; đi thang cuốn ở đằng kia (あちら).',
      ghi: 'Bài nghe trong sách dài hơn nhưng cùng dạng: nghe tầng + nghe hướng. Che chữ, nghe 2 lần rồi trả lời.',
    }),
    S('チャレンジ — Luyện cặp: chỉ chỗ', {
      anh: ['restroom', 'information', 'elevator', 'hot-beverage'],
      nhan: ['トイレ', 'インフォメーション', 'エレベーター', 'きっさてん'],
      hoi: 'A hỏi どこですか／どちらですか; B chỉ tay và đáp ここ・そこ・あそこ (hoặc こちら…).',
      dap: `Ví dụ: ${A('きっさてん は どちら です か。')} — ${A('あちら です。')}`,
      ghi: 'B là nhân viên thì đáp hàng こちら. Đổi vai, chỉ đủ bốn chỗ.',
    }),
    S('ST2 — Ở cửa hàng: いくらですか', {
      anh: ['camera', 'mobile-phone', 'laptop', 'watch'],
      nhan: ['カメラ', '{携帯電話|けいたいでんわ}', 'パソコン', '{時計|とけい}'],
      j: ['!できること: hỏi **giá**, chọn đồ, nói "**cho tôi cái này**"'],
      ghi: 'Bối cảnh ST2 là cửa hàng đồ điện tử và đồ dùng. 携帯電話 hay gọi tắt là 携帯; 電子辞書 = kim từ điển.',
    }),
    S('{新|あたら}しいことば ④ — Đồ điện tử & đồ dùng', {
      anh: ['pen', 'purse', 'books', 'roll-of-paper'],
      nhan: ['ペン', '{財布|さいふ}', '{本|ほん}', 'トイレットペーパー'],
      j: ['{電子辞書|でんしじしょ}、 {消|け}しゴム'],
      ghi: '消しゴム = cục tẩy (消す xoá + ゴム cao su). トイレットペーパー mua ở siêu thị hay 100円ショップ.',
    }),
    S('{新|あたら}しいことば ⑤ — Quần áo & túi', {
      anh: ['mans-shoe', 'jeans', 't-shirt', 'handbag'],
      nhan: ['くつ', 'ズボン', 'Tシャツ', 'かばん'],
      j: ['くつ、 ズボン、 T-シャツ、 かばん'],
      ghi: 'ズボン = quần dài, Tシャツ = áo phông, かばん = cặp / túi xách, くつ = giày.',
    }),
    S('ポイント 7 — これ・それ・あれ', {
      bang: B(['これ', 'それ', 'あれ'], [['cái này (gần tôi)', 'cái đó (gần bạn)', 'cái kia (xa cả hai)']]),
      j: ['これ は {時計|とけい} です。', 'それ は {電子辞書|でんしじしょ} です。', 'あれ は パソコン です。'],
      ghi: 'これ・それ・あれ đứng MỘT MÌNH thay cho đồ vật. Quy tắc こ・そ・あ giống hệt ここ・そこ・あそこ.',
    }),
    S('ポイント 11 — いくらですか (CQ13.3)', {
      anh: ['yen-banknote', 'coin'],
      nhan: ['〜{円|えん}', 'いくら？'],
      bang: B(['Hỏi', 'Đáp'], [['N は **いくら**ですか。', '**〜{円|えん}**です。']]),
      j: ['A： これ は いくら です か。', 'B： それ は {3,000円|さんぜんえん} です。'],
      ghi: 'いくら = bao nhiêu tiền. 円 (えん) = yên. Từ hỏi lại đứng đúng chỗ thông tin.',
    }),
    S('Giá cơ bản — số tròn', {
      bang: B(['Số', 'Đọc', 'Số', 'Đọc'], [
        ['100', 'ひゃく', '1,000', 'せん'],
        ['300', '**さんびゃく**', '3,000', '**さんぜん**'],
        ['600', '**ろっぴゃく**', '8,000', '**はっせん**'],
        ['800', '**はっぴゃく**', '10,000', '**いちまん**'],
      ]),
      ghi: 'Hôm nay chỉ cần mấy số tròn để hỏi giá; bảng số đầy đủ học ở Slot 13. Chú ý các chỗ in đậm đổi âm.',
    }),
    S('チャレンジ 1 — これはいくらですか', {
      anh: ['man-student', 'camera'],
      nhan: ['マルコ', 'カメラ'],
      j: [
        'マルコ： すみません、 これ は いくら です か。',
        '{店員|てんいん}： それ は {25,000円|にまんごせんえん} です。',
        'マルコ： {25,000円|にまんごせんえん} です か。',
      ],
      ghi: 'Marco cầm máy ảnh nên nói これ; nhân viên đứng đối diện nên nói それ. 25,000 = にまん ごせん (đếm theo vạn).',
    }),
    S('⚠ Hỏi これ → đáp それ', {
      j: ['A (cầm cái ví)： これ は いくら です か。', 'B (nhân viên)： それ は {2,000円|にせんえん} です。'],
      hoi: 'Khách chỉ cái đồng hồ trên giá xa cả hai người, hỏi giá thế nào? Nhân viên đáp bắt đầu bằng gì?',
      dap: `${A('あれ は いくら です か。')} — nhân viên cũng đáp あれは〜円です。`,
      ghi: 'Đồ ở gần ai thì người đó nói これ, người kia nói それ. Đồ xa cả hai thì cả hai cùng nói あれ.',
    }),
    S('まとめ — Tóm tắt Slot 12', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Hỏi chỗ', '〜はどこですか。／〜はどちらですか。'],
        ['Chỉ chỗ', 'ここ・そこ・あそこです。（こちら・そちら・あちら）'],
        ['Chỉ vật', 'これ・それ・あれは〜です。'],
        ['Hỏi giá', 'これはいくらですか。— それは〜{円|えん}です。'],
      ]),
      ghi: 'Về nhà: ôn bảng こ・そ・あ・ど, học 13 từ đồ vật kèm tranh. Slot sau: このN, をください và đọc mọi loại giá tiền.',
    }),
  ],
  [
    Q('Đồ vật ở gần NGƯỜI NGHE gọi là:', 'それ', 'これ | あれ | どれ', 'そ = gần người nghe.'),
    Q('「トイレは（　）ですか。」 — hỏi ở đâu', 'どこ', 'いくら | {何階|なんがい} | だれ', 'どこ = ở đâu.'),
    Q('Nhân viên chỉ thang máy ở xa, nói lịch sự:', 'エレベーターはあちらです。', 'エレベーターはあそこです。 | エレベーターはあれです。 | エレベーターはどちらです。', 'Lịch sự: あちら thay cho あそこ.'),
    Q('Khách cầm máy ảnh hỏi 「これはいくらですか」. Nhân viên đáp:', 'それは{3万円|さんまんえん}です。', 'これは{3万円|さんまんえん}です。 | あれは{3万円|さんまんえん}です。 | どれは{3万円|さんまんえん}です。', 'Đồ ở gần khách ⇒ với nhân viên là それ.'),
    Q('300 đọc là:', 'さんびゃく', 'さんひゃく | さんぴゃく | みっひゃく', '300 = さんびゃく (ひ → び).'),
    Q('{財布|さいふ} là:', 'cái ví', 'đồng hồ | cặp sách | giày', '財布 = ví tiền.'),
  ],
);

/* ── Slot 13 (tiết 37–39): ST2 チャレンジ2 このN · チャレンジ3 Nをください · やってみよう · 値段の読み方 ── */
const B2_SLOT13 = SLOT(
  2, '13', 'kono-kudasai-doc-gia',
  'Bài 2 ST2: この・その・あの N · N を ください · đọc giá tiền',
  'Chỉ đồ vật kèm danh từ bằng この・その・あの, quyết định mua bằng じゃ、〜をください, và đọc đúng mọi giá tiền từ trăm đến chục vạn yên.',
  [
    '**Ôn**: これはいくらですか。— それは〜円です。',
    '**ポイント 8 — この・その・あの N** (khác これ・それ・あれ ở chỗ phải có danh từ đi sau — CQ13.5).',
    '**ポイント 10 — N を ください** + **じゃ** (vậy thì): mua hàng (チャレンジ 3) · いらっしゃいませ · ありがとうございます.',
    '**Số đếm & giá tiền**: 百 (ひゃく／びゃく／ぴゃく), 千 (せん／ぜん), 万 (まん) — CQ13.4.',
    '**読解 — 値段の読み方**: đọc bảng giá; やってみよう ST2: đóng vai mua đồ. Câu cô hay gọi: CQ13.2, 13.4, 13.5.',
  ],
  'JPD113 · Bài 2 どこですか・いくらですか · Slot 13',
  [
    S('{第2課|だいにか} — Slot 13: このN · をください · {値段|ねだん}', {
      anh: ['watch', 'shopping-bags', 'yen-banknote'],
      nhan: ['この{時計|とけい}', 'これをください', '〜{円|えん}'],
      j: ['!Hôm nay: **chỉ vật kèm danh từ · mua hàng · đọc giá**'],
      ghi: 'Hết buổi này bạn đi mua được một món đồ từ đầu đến cuối: hỏi giá, chọn, mua. 値段 (ねだん) = giá tiền — tên phần đọc hiểu cuối buổi.',
    }),
    S('{復習|ふくしゅう} — これはいくらですか', {
      j: ['A： これ は いくら です か。'],
      hoi: 'Bạn là nhân viên, món đồ giá 1,500 yên. Trả lời thế nào?',
      dap: A('それ は {1,500円|せんごひゃくえん} です。'),
      ghi: 'Khách nói これ thì nhân viên nói それ. 1,500 = せん + ごひゃく.',
    }),
    S('ポイント 8 — この・その・あの N (CQ13.5)', {
      bang: B(['Đứng một mình (ポイント 7)', 'Đi với danh từ (ポイント 8)', 'Nghĩa'], [
        ['これ', 'この N', 'N này'],
        ['それ', 'その N', 'N đó'],
        ['あれ', 'あの N', 'N kia'],
      ]),
      j: ['この カメラ は いくら です か。'],
      ghi: 'これ thay cho cả món đồ; この phải đi kèm danh từ ngay sau (この + カメラ). Muốn nói rõ "cái máy ảnh này" thì dùng この.',
    }),
    S('この・その・あの N — Ví dụ', {
      anh: ['camera', 'watch', 'handbag'],
      nhan: ['このカメラ', 'その{時計|とけい}', 'あのかばん'],
      j: [
        'この カメラ は {25,000円|にまんごせんえん} です。',
        'その {時計|とけい} は {8,000円|はっせんえん} です。',
        'あの かばん は いくら です か。',
      ],
      ghi: 'Quy tắc gần – xa không đổi: この gần mình, その gần người nghe, あの xa cả hai.',
    }),
    S('⚠ これ ≠ この', {
      j: ['!~~これカメラはいくらですか。~~ ✗', 'この カメラ は いくら です か。', '!~~このはいくらですか。~~ ✗', 'これ は いくら です か。'],
      hoi: '"Cái áo phông đó bao nhiêu tiền?" nói thế nào?',
      dap: A('その T-シャツ は いくら です か。'),
      ghi: 'Mẹo: sau この phải có danh từ; sau これ là は luôn. Lỗi này rất hay gặp trong bài viết.',
    }),
    S('チャレンジ 2 — そのTシャツはいくらですか', {
      anh: ['woman-student', 't-shirt', 'jeans'],
      nhan: ['メアリー', 'Tシャツ', 'ズボン'],
      j: [
        'メアリー： すみません、 その T-シャツ は いくら です か。',
        '{店員|てんいん}： この T-シャツ です か。 {1,800円|せんはっぴゃくえん} です。',
        'メアリー： あの ズボン は？',
        '{店員|てんいん}： あれ は {4,500円|よんせんごひゃくえん} です。',
      ],
      ghi: 'Nhân viên đổi その thành この vì áo ở gần mình. あのズボンは？ = hỏi rút gọn "còn cái quần kia?".',
    }),
    S('ポイント 10 — N を ください', {
      bang: B(['N', 'を (o)', 'ください', 'Nghĩa'], [
        ['これ', 'を', 'ください。', 'Cho tôi cái này.'],
        ['この{時計|とけい}', 'を', 'ください。', 'Cho tôi cái đồng hồ này.'],
      ]),
      j: ['じゃ、 これ を ください。'],
      ghi: 'を đọc là "o". じゃ = "vậy thì" — nói khi đã quyết định sau khi nghe giá. Câu này dùng được ở mọi cửa hàng.',
    }),
    S('チャレンジ 3 — Mua hàng', {
      anh: ['man-student', 'purse'],
      nhan: ['ダニエル', '{財布|さいふ}'],
      j: [
        '{店員|てんいん}： いらっしゃいませ。',
        'ダニエル： すみません、 この {財布|さいふ} は いくら です か。',
        '{店員|てんいん}： {3,200円|さんぜんにひゃくえん} です。',
        'ダニエル： じゃ、 これ を ください。',
        '{店員|てんいん}： ありがとう ございます。',
      ],
      ghi: 'いらっしゃいませ = câu chào khách của nhân viên, khách không cần đáp. Đoạn này là khuôn hội thoại mua hàng trọn vẹn — học thuộc.',
    }),
    S('Số đếm ① — Hàng trăm', {
      bang: B(['Số', 'Đọc', 'Số', 'Đọc'], [
        ['100', 'ひゃく', '600', '**ろっぴゃく**'],
        ['200', 'にひゃく', '700', 'ななひゃく'],
        ['300', '**さんびゃく**', '800', '**はっぴゃく**'],
        ['400', 'よんひゃく', '900', 'きゅうひゃく'],
        ['500', 'ごひゃく', '{何百|なんびゃく}', '**なんびゃく**'],
      ]),
      ghi: '百 đọc ひゃく, đổi thành びゃく sau さん và なん, thành ぴゃく sau ろっ và はっ. 100 là ひゃく — không nói いちひゃく.',
    }),
    S('Số đếm ② — Hàng nghìn', {
      bang: B(['Số', 'Đọc', 'Số', 'Đọc'], [
        ['1,000', 'せん', '6,000', 'ろくせん'],
        ['2,000', 'にせん', '7,000', 'ななせん'],
        ['3,000', '**さんぜん**', '8,000', '**はっせん**'],
        ['4,000', 'よんせん', '9,000', 'きゅうせん'],
        ['5,000', 'ごせん', '{何千|なんぜん}', '**なんぜん**'],
      ]),
      ghi: '千 đọc せん; sau さん, なん thành ぜん; 8,000 có âm ngắt はっせん. 1,000 là せん — không nói いちせん.',
    }),
    S('Số đếm ③ — 万 (vạn) (CQ13.4)', {
      bang: B(['Số', 'Đọc'], [
        ['10,000', '**いちまん** (phải có いち)'],
        ['20,000', 'にまん'],
        ['50,000', 'ごまん'],
        ['100,000', 'じゅうまん'],
        ['12,800', 'いちまん にせん はっぴゃく'],
      ]),
      j: ['!Người Việt đếm theo nghìn; người Nhật đếm theo **vạn (万 = 10.000)**: tách 4 số từ phải sang.'],
      ghi: '12,800 → 1｜2800 → いちまん にせん はっぴゃく. 100,000 không phải "trăm nghìn" mà là 10 vạn: じゅうまん. Đây là CQ13.4.',
    }),
    S('{値段|ねだん}の{読|よ}み{方|かた} — Đọc giá', {
      j: ['!350{円|えん} · 1,800{円|えん} · 6,300{円|えん} · 48,000{円|えん}'],
      hoi: 'Đọc to bốn giá trên.',
      dap: 'さんびゃくごじゅうえん · せんはっぴゃくえん · ろくせんさんびゃくえん · よんまんはっせんえん',
      ghi: 'Đọc từ hàng lớn xuống: vạn → nghìn → trăm → chục → đơn vị, cuối cùng thêm えん.',
    }),
    S('{読解|どっかい} — Bảng giá cửa hàng', {
      anh: ['camera', 'mans-shoe', 'pen'],
      nhan: ['カメラ', 'くつ', 'ペン'],
      bang: B(['Món', 'Giá'], [
        ['カメラ', '32,000{円|えん}'],
        ['{電子辞書|でんしじしょ}', '19,800{円|えん}'],
        ['くつ', '6,500{円|えん}'],
        ['ペン', '120{円|えん}'],
      ]),
      hoi: '「{電子辞書|でんしじしょ}はいくらですか。」「ペンは？」',
      dap: `${A('{19,800円|いちまんきゅうせんはっぴゃくえん} です。')} · ${A('{120円|ひゃくにじゅうえん} です。')}`,
      ghi: '読解 = đọc hiểu. Phần này luyện nhìn con số trên bảng giá và đọc thành tiếng ngay, không đếm từng chữ số.',
    }),
    S('やってみよう ST2 — Đóng vai mua đồ', {
      anh: ['mans-shoe', 'mans-shoe'],
      nhan: ['このくつ', 'あのくつ'],
      j: ['!このくつ: 6,500{円|えん} · あのくつ: 4,800{円|えん}'],
      hoi: 'Bạn là khách, muốn mua giày: hỏi giá hai đôi rồi mua đôi kia.',
      dap: `${A('すみません、 この くつ は いくら です か。')} → {6,500円|ろくせんごひゃくえん}です。 ${A('あの くつ は？')} → あれは{4,800円|よんせんはっぴゃくえん}です。 ${A('じゃ、 あれ を ください。')}`,
      ghi: 'Ráp đủ ba bước: hỏi giá (この／あの) → nghe giá → じゃ、〜をください. Đổi vai để cả hai cùng được làm khách.',
    }),
    S('チャレンジ — Luyện cặp có giá', {
      anh: ['watch', 'camera', 'handbag', 'mobile-phone'],
      nhan: ['{8,000円|はっせんえん}', '{36,000円|さんまんろくせんえん}', '{5,300円|ごせんさんびゃくえん}', '{60,000円|ろくまんえん}'],
      hoi: 'A: この〜はいくらですか → B đọc giá dưới hình → A: じゃ、それをください。',
      dap: `Ví dụ: ${A('この {時計|とけい} は いくら です か。')} — ${A('{8,000円|はっせんえん} です。')} — ${A('じゃ、 それ を ください。')}`,
      ghi: 'Giá dưới hình bấm vào là nghe được. B phải đọc giá không nhìn furigana mới tính điểm.',
    }),
    S('Cô hay gọi — CQ13.2', {
      j: ['A： お{仕事|しごと} は？', 'B： ABC の {社員|しゃいん} です。'],
      hoi: 'Muốn hỏi đối phương làm ở công ty nào, hỏi thế nào cho lịch sự?',
      dap: '{会社|かいしゃ}はどちらですか。 (Kaisha wa dochira desu ka.) — どちら lịch sự = "ở đâu / chỗ nào". (会社 = công ty, sẽ học chính thức ở Bài 3.)',
      ghi: 'どちら hỏi được cả nước, chỗ, và tên nơi làm việc. Đáp bằng tên công ty: ABCです。',
    }),
    S('まとめ — Tóm tắt Slot 13', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Chỉ vật + danh từ', 'この・その・あの + N'],
        ['Hỏi giá', 'このカメラはいくらですか。'],
        ['Quyết định mua', 'じゃ、これをください。'],
        ['Đọc giá', '百・千・万: さんびゃく・はっせん・いちまん'],
      ]),
      ghi: 'Về nhà: đọc bảng số trăm – nghìn – vạn mỗi ngày, ra siêu thị đọc thầm giá bằng tiếng Nhật. Slot sau: nhà hàng.',
    }),
  ],
  [
    Q('"Cái máy ảnh này bao nhiêu tiền?"', 'このカメラはいくらですか。', 'これカメラはいくらですか。 | このはカメラいくらですか。 | カメラのこれはいくらですか。', 'この + danh từ (ポイント 8).'),
    Q('Quyết định mua: 「じゃ、それ（　）ください。」', 'を', 'は | が | の', 'N を ください (ポイント 10).'),
    Q('600 đọc là:', 'ろっぴゃく', 'ろくひゃく | ろくびゃく | むっぴゃく', '600 = ろっぴゃく.'),
    Q('3,000 đọc là:', 'さんぜん', 'さんせん | みっせん | さんびゃく', '千 sau さん ⇒ ぜん.'),
    Q('10,000 yên đọc là:', 'いちまんえん', 'まんえん | じゅうせんえん | ひゃくせんえん', '10.000 = いちまん (bắt buộc có いち).'),
    Q('Nhân viên chào khách khi khách vào:', 'いらっしゃいませ。', 'ありがとうございます。 | どうぞよろしく。 | はじめまして。', 'いらっしゃいませ = kính chào quý khách.'),
    Q('"Cái đồng hồ kia" là:', 'あの{時計|とけい}', 'あれ{時計|とけい} | あそこ{時計|とけい} | その{時計|とけい}', 'あの + N = N kia (xa cả hai).'),
  ],
);

/* ── Slot 14 (tiết 40–42): ST3 チャレンジ1 何のN · 2–4 〜語で, どこのN, Nを〜つください · 5 だれのN ── */
const B2_SLOT14 = SLOT(
  2, '14', 'nha-hang-nan-no-doko-no-dare-no',
  'Bài 2 ST3: レストラン — 何の N · 〜語で · どこの N · 〜つ · だれの N',
  'Gọi món ở nhà hàng: hỏi món làm từ gì (何の), hỏi một từ tiếng Nhật nói thế nào (〜語で), hỏi xuất xứ (どこの), gọi kèm số lượng (〜つ) và hỏi đồ của ai (だれの).',
  [
    '**Từ mới ST3**: món ăn (カレー, スープ, とんかつ, ハンバーグ, ご飯, ライス, ケーキ, パン) · đồ uống · nguyên liệu (肉, 牛肉, 鶏肉, 豚肉, 魚, 野菜, 卵).',
    '**ポイント 12 — 何の N**: これは何の料理ですか。— 魚の料理です。 (CQ14.3)',
    '**ポイント 15 — 〜語で** (CQ15.1) · **ポイント 13 — どこの N** (CQ15.2).',
    '**ポイント 10 + 〜つ**: コーヒーを二つください · 注文をお願いします · どうぞ.',
    '**ポイント 14 — だれの N** (CQ15.3): これはだれのかばんですか。— ワンさんのかばんです。',
  ],
  'JPD113 · Bài 2 どこですか・いくらですか · Slot 14',
  [
    S('{第2課|だいにか} — Slot 14: レストラン', {
      anh: ['fork-and-knife-with-plate', 'curry-rice', 'hot-beverage'],
      nhan: ['レストラン', 'カレー', 'コーヒー'],
      j: ['!Hôm nay: **gọi món · món làm từ gì · của nước nào · của ai**'],
      ghi: 'ST3 đưa mọi thứ đã học vào nhà hàng: hỏi món, gọi món kèm số lượng. Bốn từ hỏi mới đều đi theo khuôn "từ hỏi + の + N".',
    }),
    S('{復習|ふくしゅう} — を ください', {
      hoi: 'Bạn muốn mua cái đồng hồ ở gần bạn. Nói thế nào?',
      dap: A('この {時計|とけい} を ください。'),
      j: ['!N を ください = Cho tôi N'],
      ghi: 'Hôm nay câu này thêm số lượng: コーヒーを二つください.',
    }),
    S('{新|あたら}しいことば ① — Món ăn', {
      anh: ['curry-rice', 'bowl-with-spoon', 'cooked-rice', 'shortcake'],
      nhan: ['カレー', 'スープ', 'ご{飯|はん}', 'ケーキ'],
      j: ['とんかつ、 ハンバーグ、 ライス、 パン'],
      ghi: 'ハンバーグ là thịt băm viên áp chảo, KHÔNG phải bánh hamburger. ライス = cơm bày trên đĩa kiểu Tây; ご飯 = cơm nói chung.',
    }),
    S('{新|あたら}しいことば ② — Đồ uống', {
      anh: ['beverage-box', 'hot-beverage', 'teacup-without-handle', 'beer-mug'],
      nhan: ['ジュース', 'コーヒー', 'お{茶|ちゃ}', 'ビール'],
      j: ['{紅茶|こうちゃ}、 ワイン、 {水|みず}'],
      ghi: 'お茶 = trà xanh, 紅茶 = trà đen (hồng trà). ジュース ở Nhật là nước ngọt / nước ép nói chung.',
    }),
    S('{新|あたら}しいことば ③ — Nguyên liệu', {
      anh: ['cut-of-meat', 'poultry-leg', 'fish', 'leafy-green'],
      nhan: ['{肉|にく}・{牛肉|ぎゅうにく}・{豚肉|ぶたにく}', '{鶏肉|とりにく}', '{魚|さかな}', '{野菜|やさい}'],
      j: ['{卵|たまご}、 {米|こめ}、 {油|あぶら}、 イチゴ、 リンゴ'],
      ghi: '牛 bò, 豚 lợn, 鶏 gà + 肉 thịt. Mấy từ này dùng ngay trong câu 何の料理ですか.',
    }),
    S('ポイント 12 — {何|なん}の N (CQ14.3)', {
      bang: B(['Hỏi', 'Đáp'], [['これは**{何|なん}の**{料理|りょうり}ですか。', '**{魚|さかな}の**{料理|りょうり}です。']]),
      j: ['A： これ は {何|なん} の {料理|りょうり} です か。', 'B： {鶏肉|とりにく} の {料理|りょうり} です。'],
      ghi: '何の N = N loại gì / làm từ gì. Trả lời: thay 何 bằng nguyên liệu, giữ nguyên の N.',
    }),
    S('{何|なん}の N — Ví dụ', {
      anh: ['red-apple', 'strawberry'],
      nhan: ['リンゴ', 'イチゴ'],
      j: [
        'A： これ は {何|なん} の ジュース です か。',
        'B： リンゴ の ジュース です。',
        'A： それ は {何|なん} の ケーキ です か。',
        'B： イチゴ の ケーキ です。',
      ],
      ghi: 'Đồ uống, bánh, món ăn đều hỏi được bằng 何の. Câu trả lời cũng là ポイント 4 (N1 の N2) quen thuộc.',
    }),
    S('ポイント 15 — 〜{語|ご}で (CQ15.1)', {
      j: ['A： “egg” は {日本語|にほんご} で {何|なん} です か。', 'B： {卵|たまご} です。', 'A： “{卵|たまご}” は {英語|えいご} で {何|なん} です か。'],
      hoi: 'Hỏi cô "rice" tiếng Nhật là gì?',
      dap: `${A('“rice” は {日本語|にほんご} で {何|なん} です か。')} — ご{飯|はん}／{米|こめ}です。`,
      ghi: '〜語で = bằng tiếng 〜. Câu "cứu hộ" khi không biết từ: hỏi ngay giáo viên hoặc nhân viên. 英語 = tiếng Anh.',
    }),
    S('ポイント 13 — どこの N (CQ15.2)', {
      anh: ['wine-glass', 'beer-mug'],
      nhan: ['フランスのワイン', 'ドイツのビール'],
      j: ['A： これ は どこ の ワイン です か。', 'B： フランス の ワイン です。', 'A： その カメラ は どこ の カメラ です か。', 'B： {日本|にほん} の カメラ です。'],
      ghi: 'どこの N = N của nước nào / hãng nào (xuất xứ). Ba nước mới: インド, ドイツ, フランス.',
    }),
    S('Đếm 〜つ', {
      bang: B(['1〜5', '6〜10'], [
        ['ひとつ', 'むっつ'],
        ['ふたつ', 'ななつ'],
        ['みっつ', 'やっつ'],
        ['よっつ', 'ここのつ'],
        ['いつつ', 'とお'],
      ]),
      ghi: '〜つ đếm đồ vật, món ăn (1 đến 10). Mười là とお, không có つ. Từ 11 trở lên đọc số thường.',
    }),
    S('ポイント 10 + 〜つ — Gọi kèm số lượng', {
      bang: B(['N', 'を', 'số lượng', 'ください'], [['コーヒー', 'を', '{二|ふた}つ', 'ください。'], ['カレー', 'を', '{一|ひと}つ', 'ください。']]),
      j: ['コーヒー を {二|ふた}つ ください。', 'カレー を {一|ひと}つ と コーヒー を {一|ひと}つ ください。'],
      ghi: 'Số lượng đứng SAU を, ngay trước ください — khác tiếng Việt ("cho hai cà phê"). Gọi hai món thì nối bằng と.',
    }),
    S('{注文|ちゅうもん}をお{願|ねが}いします — Gọi món', {
      j: ['A： すみません、 {注文|ちゅうもん} を お{願|ねが}い します。', '{店員|てんいん}： はい、 どうぞ。'],
      ghi: 'Gọi nhân viên: すみません. Muốn gọi món: 注文をお願いします. Nhân viên đáp どうぞ = xin mời (cứ gọi đi).',
    }),
    S('チャレンジ 2〜4 — Ở nhà hàng', {
      anh: ['woman-student', 'person-tipping-hand'],
      nhan: ['リン', '{店員|てんいん}'],
      j: [
        'リン： すみません、 {注文|ちゅうもん} を お{願|ねが}い します。',
        '{店員|てんいん}： はい、 どうぞ。',
        'リン： これ は {何|なん} の {料理|りょうり} です か。',
        '{店員|てんいん}： {豚肉|ぶたにく} の {料理|りょうり} です。 とんかつ です。',
        'リン： じゃ、 とんかつ を {一|ひと}つ と コーヒー を {一|ひと}つ ください。',
      ],
      ghi: 'Đoạn này ráp ba điểm: gọi món, 何の, 〜つください. Đóng vai đổi món theo thực đơn của slide sau.',
    }),
    S('ポイント 14 — だれの N (CQ15.3)', {
      anh: ['handbag', 'purse', 'mobile-phone'],
      nhan: ['かばん', '{財布|さいふ}', '{携帯電話|けいたいでんわ}'],
      bang: B(['Hỏi', 'Đáp'], [['これは**だれの**かばんですか。', '**ワンさんの**かばんです。']]),
      j: ['A： これ は だれ の かばん です か。', 'B： ^ワン-さん の かばん です。'],
      ghi: 'だれ = ai; だれの N = N của ai. Đáp: tên người + の + N.',
    }),
    S('チャレンジ 5 — Đồ bỏ quên', {
      anh: ['woman-student', 'man-student', 'purse'],
      nhan: ['アンナ', 'マルコ', '{財布|さいふ}'],
      j: [
        'アンナ： すみません、 これ は だれ の {財布|さいふ} です か。',
        'マルコ： あ、 {私|わたし} の {財布|さいふ} です。',
        'アンナ： どうぞ。',
        'マルコ： ありがとう ございます。',
      ],
      ghi: 'どうぞ ở đây = "của bạn đây" khi đưa đồ. 私の財布です dùng ポイント 4 (の = của).',
    }),
    S('チャレンジ — Luyện cặp: thực đơn', {
      bang: B(['Món', 'Làm từ', 'Giá'], [
        ['カレー', '{牛肉|ぎゅうにく}', '{800円|はっぴゃくえん}'],
        ['ハンバーグ', '{豚肉|ぶたにく}・{牛肉|ぎゅうにく}', '{950円|きゅうひゃくごじゅうえん}'],
        ['スープ', '{野菜|やさい}', '{300円|さんびゃくえん}'],
        ['ワイン', 'イタリア', '{600円|ろっぴゃくえん}'],
      ]),
      hoi: 'A hỏi 何の料理ですか / どこのワインですか / いくらですか; B đáp theo thực đơn; A gọi món với 〜つ.',
      dap: `Ví dụ: ${A('カレー は {何|なん} の {料理|りょうり} です か。')} — ${A('{牛肉|ぎゅうにく} の {料理|りょうり} です。')} — ${A('じゃ、 カレー を {二|ふた}つ ください。')}`,
      ghi: 'Một lượt đủ ba câu hỏi + một câu gọi món. Đổi vai để ai cũng được làm khách.',
    }),
    S('Cô hay gọi — CQ14.2', {
      hoi: 'Những từ vựng dùng trong nhà hàng liên quan đến ăn uống là gì?',
      dap: 'Món: カレー・スープ・とんかつ・ハンバーグ・ご{飯|はん}・ライス・パン・ケーキ · Uống: ジュース・コーヒー・{紅茶|こうちゃ}・お{茶|ちゃ}・ビール・ワイン・{水|みず} · Câu: {注文|ちゅうもん}をお{願|ねが}いします・どうぞ・〜をください',
      ghi: 'Chia ba nhóm cho dễ nhớ: món ăn, đồ uống, câu gọi món.',
    }),
    S('まとめ — Bốn câu hỏi của ST3', {
      bang: B(['Hỏi', 'Nghĩa', 'Đáp mẫu'], [
        ['{何|なん}の{料理|りょうり}ですか', 'món làm từ gì', '{魚|さかな}の{料理|りょうり}です'],
        ['{日本語|にほんご}で{何|なん}ですか', 'tiếng Nhật là gì', '{卵|たまご}です'],
        ['どこのワインですか', 'của nước nào', 'イタリアのワインです'],
        ['だれのかばんですか', 'của ai', 'ワンさんのかばんです'],
      ]),
      ghi: 'Về nhà: tự viết một thực đơn 4 món kèm giá, rồi tự hỏi – đáp. Slot sau: chữ Hán số đếm và ôn Bài 2.',
    }),
  ],
  [
    Q('「これは（　）の{料理|りょうり}ですか。」— 魚の料理です。', '{何|なん}', 'どこ | だれ | いくら', 'Hỏi món làm từ gì: 何の N (ポイント 12).'),
    Q('「これは（　）のワインですか。」— フランスのワインです。', 'どこ', '{何|なん} | だれ | いつ', 'Hỏi xuất xứ: どこの N (ポイント 13).'),
    Q('"Cho tôi hai cà phê."', 'コーヒーを{二|ふた}つください。', '{二|ふた}つコーヒーをください。 | コーヒーを{二|に}ください。 | コーヒー{二|ふた}つをください。', 'Số lượng đứng sau を, trước ください.'),
    Q('「“egg”は{日本語|にほんご}（　）{何|なん}ですか。」', 'で', 'の | を | は', '〜語で = bằng tiếng 〜 (ポイント 15).'),
    Q('「これはだれのかばんですか。」 — Đáp:', 'ワンさんのかばんです。', 'ワンさんはかばんです。 | ワンさんのです か。 | かばんのワンさんです。', 'Tên người + の + N (ポイント 14).'),
    Q('{鶏肉|とりにく} là:', 'thịt gà', 'thịt bò | thịt lợn | cá', '鶏 = gà.'),
    Q('Số 10 khi đếm đồ vật:', 'とお', 'とおつ | じゅうつ | ここのつ', 'とお — không có つ.'),
  ],
);

/* ── Slot 15 — phần Bài 2 (tiết 43–44): ST3 やってみよう · 漢字 第2課 · 第2課復習 ── */
const B2_SLOT15 = SLOT(
  2, '15', 'kanji-so-on-bai-2',
  'Bài 2: やってみよう ST3 · chữ Hán Bài 2 (số và 円) · ôn Bài 2',
  'Nghe – nói trọn một lượt gọi món, đọc – viết 14 chữ Hán số đếm và 円 (cả âm On lẫn Kun), đọc giá viết bằng chữ Hán, và ôn đủ ポイント 7–15.',
  [
    '**やってみよう ST3**: nghe khách gọi món, ghi lại món + số lượng + giá.',
    '**漢字 第2課** — 14 chữ: 一 二 三 四 五 六 七 八 九 十 百 千 万 円 (CQ15.4, CQ15.5).',
    'Đọc giá bằng chữ Hán: 三百円 · 八千円 · 一万円 · 四千五百円.',
    '**第2課 復習**: bảng ポイント 7–15, もう一度聞こう, 宿題確認.',
    'Nửa sau của Slot 15 mở Bài 3 (xem deck "Slot 15 — Bài 3 ST1" trong mục Bài 3).',
  ],
  'JPD113 · Bài 2 どこですか・いくらですか · Slot 15',
  [
    S('{第2課|だいにか} — Slot 15: やってみよう · {漢字|かんじ} · {復習|ふくしゅう}', {
      anh: ['fork-and-knife-with-plate', 'keycap-1', 'yen-banknote'],
      nhan: ['やってみよう', '{一|いち}・{二|に}・{三|さん}', '{円|えん}'],
      j: ['!Hôm nay: **gọi món trọn vẹn · 14 chữ Hán số · ôn Bài 2** → rồi mở Bài 3'],
      ghi: 'Buổi chuyển tiếp: khép Bài 2 trong 2 tiết đầu, tiết cuối mở Bài 3. Chữ Hán Bài 2 toàn là số — dễ nhất cả môn, đừng bỏ điểm.',
    }),
    S('やってみよう ST3 — Nghe gọi món', {
      anh: ['man-student', 'person-tipping-hand'],
      nhan: ['ナタポン', '{店員|てんいん}'],
      j: [
        'ナタポン： すみません、 {注文|ちゅうもん} を お{願|ねが}い します。',
        '{店員|てんいん}： はい、 どうぞ。',
        'ナタポン： ハンバーグ を {一|ひと}つ と ライス を {一|ひと}つ ください。',
        'ナタポン： {紅茶|こうちゃ} も {二|ふた}つ ください。',
        '{店員|てんいん}： ハンバーグ {一|ひと}つ、 ライス {一|ひと}つ、 {紅茶|こうちゃ} {二|ふた}つ です ね。',
      ],
      hoi: 'Khách gọi những gì, mỗi thứ mấy phần?',
      dap: 'ハンバーグ 1 · ライス 1 · {紅茶|こうちゃ} 2.',
      ghi: 'Nhân viên nhắc lại đơn để xác nhận — trong bài nghe đây là chỗ để kiểm tra lại đáp án. 紅茶も二つ = "trà đen cũng hai" — も của Bài 1.',
    }),
    S('{漢字|かんじ} {第2課|だいにか} — 14 chữ (CQ15.4)', {
      j: ['!**一　二　三　四　五　六　七　八　九　十**', '!**百　千　万　円**'],
      ghi: 'Mười chữ số + trăm, nghìn, vạn, yên. Mỗi số có hai cách đọc: On (いち, に…) để đếm, ghép với 円, 階, 月; Kun (ひと, ふた…) đi với 〜つ.',
    }),
    HAN('①', '一', 'NHẤT', 'một', 'イチ・イッ', 'ひと(つ)', [['{一|いち}', 'một'], ['{一|ひと}つ', 'một cái'], ['{一万円|いちまんえん}', '10.000 yên']],
      'Một nét ngang = số 1. Trước âm k, s, t, p hay rút thành イッ: {一階|いっかい}.', 'keycap-1'),
    HAN('②', '二', 'NHỊ', 'hai', 'ニ', 'ふた(つ)', [['{二|に}', 'hai'], ['{二|ふた}つ', 'hai cái'], ['{二月|にがつ}', 'tháng 2']],
      'Hai nét ngang, nét dưới dài hơn. ふたつ dùng khi gọi món: コーヒーを二つください.', 'keycap-2'),
    HAN('③', '三', 'TAM', 'ba', 'サン', 'みっ(つ)', [['{三|さん}', 'ba'], ['{三|みっ}つ', 'ba cái'], ['{三階|さんがい}', 'tầng 3']],
      'Ba nét ngang, nét giữa ngắn nhất. Nhớ 三階 đọc さんがい, 三百 đọc さんびゃく.', 'keycap-3'),
    HAN('④', '四', 'TỨ', 'bốn', 'シ', 'よん・よ・よっ(つ)', [['{四月|しがつ}', 'tháng 4'], ['{四|よっ}つ', 'bốn cái'], ['{四千円|よんせんえん}', '4.000 yên']],
      'Khung vuông có hai chân bên trong. Đếm số và giá dùng よん; tháng 4 là しがつ; giờ là よじ (Bài 3).', 'keycap-4'),
    HAN('⑤', '五', 'NGŨ', 'năm', 'ゴ', 'いつ(つ)', [['{五|ご}', 'năm'], ['{五|いつ}つ', 'năm cái'], ['{五百円|ごひゃくえん}', '500 yên']],
      'Viết 4 nét: ngang trên, sổ, gập, ngang dưới. Đếm đồ vật: いつつ.', 'keycap-5'),
    HAN('⑥', '六', 'LỤC', 'sáu', 'ロク・ロッ', 'むっ(つ)', [['{六|ろく}', 'sáu'], ['{六|むっ}つ', 'sáu cái'], ['{六百|ろっぴゃく}', '600']],
      'Hình mái nhà có hai chân. Trước 百 và 階 rút thành ロッ: ろっぴゃく, ろっかい.', 'keycap-6'),
    HAN('⑦', '七', 'THẤT', 'bảy', 'シチ', 'なな(つ)', [['{七月|しちがつ}', 'tháng 7'], ['{七|なな}つ', 'bảy cái'], ['{七千円|ななせんえん}', '7.000 yên']],
      'Giống chữ "t" ngược. Đếm số, giá hay dùng なな; tháng 7 là しちがつ.', 'keycap-7'),
    HAN('⑧', '八', 'BÁT', 'tám', 'ハチ・ハッ', 'やっ(つ)', [['{八|はち}', 'tám'], ['{八|やっ}つ', 'tám cái'], ['{八百円|はっぴゃくえん}', '800 yên']],
      'Hai nét xoè ra như mái nhà mở. Trước 百, 千, 階 thành ハッ: はっぴゃく, はっせん, はっかい.', 'keycap-8'),
    HAN('⑨', '九', 'CỬU', 'chín', 'キュウ・ク', 'ここの(つ)', [['{九月|くがつ}', 'tháng 9'], ['{九|ここの}つ', 'chín cái'], ['{九百円|きゅうひゃくえん}', '900 yên']],
      'Tháng 9 đọc く; giá tiền và tầng đọc きゅう. Đếm đồ vật: ここのつ.', 'keycap-9'),
    HAN('⑩', '十', 'THẬP', 'mười', 'ジュウ・ジュッ', 'とお', [['{十|じゅう}', 'mười'], ['{十|とお}', 'mười cái'], ['{十月|じゅうがつ}', 'tháng 10']],
      'Dấu cộng = 10. Rút thành ジュッ trước 階, 歳: じゅっかい, じゅっさい. Đếm đồ vật: とお.', 'keycap-10'),
    HAN('⑪', '百', 'BÁCH', 'trăm', 'ヒャク (ビャク・ピャク)', '—', [['{百円|ひゃくえん}', '100 yên'], ['{三百|さんびゃく}', '300'], ['{八百|はっぴゃく}', '800']],
      'Chữ 一 trên chữ 白 (trắng). Đổi âm: さんびゃく, なんびゃく, ろっぴゃく, はっぴゃく.', 'hundred-points'),
    HAN('⑫', '千', 'THIÊN', 'nghìn', 'セン (ゼン)', 'ち', [['{千円|せんえん}', '1.000 yên'], ['{三千|さんぜん}', '3.000'], ['{八千|はっせん}', '8.000']],
      'Giống chữ 十 có thêm nét phẩy trên đầu. Sau さん, なん đọc ぜん.'),
    HAN('⑬', '万', 'VẠN', 'mười nghìn', 'マン', '—', [['{一万円|いちまんえん}', '10.000 yên'], ['{十万|じゅうまん}', '100.000']],
      'Người Nhật đếm theo vạn. 一万 bắt buộc có いち. Tờ tiền lớn nhất của Nhật là 一万円札.', 'money-bag'),
    HAN('⑭', '円', 'VIÊN', 'tròn; yên (tiền Nhật)', 'エン', 'まる(い)', [['{百円|ひゃくえん}', '100 yên'], ['{千円|せんえん}', '1.000 yên'], ['{一万円|いちまんえん}', '10.000 yên']],
      'Nghĩa gốc là "tròn" (đồng xu tròn) ⇒ đơn vị tiền yên. Giá luôn kết thúc bằng 円.', 'yen-banknote'),
    S('{漢字|かんじ} — Đọc giá viết bằng chữ Hán', {
      bang: B(['Chữ Hán', 'Đọc', 'Số'], [
        ['三百円', 'さんびゃくえん', '300'],
        ['六百円', 'ろっぴゃくえん', '600'],
        ['八千円', 'はっせんえん', '8.000'],
        ['一万円', 'いちまんえん', '10.000'],
        ['四千五百円', 'よんせんごひゃくえん', '4.500'],
      ]),
      hoi: 'Đọc to (không furigana): 二千八百円 · 七百円 · 三万円',
      dap: 'にせんはっぴゃくえん · ななひゃくえん · さんまんえん',
      ghi: 'Đọc từ trái sang phải đúng như viết: 四千五百円 = よんせん・ごひゃく・えん. Đề đọc to hay cho một giá viết chữ Hán.',
    }),
    S('Cô hay gọi — CQ15.5', {
      hoi: 'Âm On và âm Kun của các chữ số 一〜十 dùng khác nhau thế nào?',
      dap: 'On (いち・に・さん…) để đếm số và ghép với đơn vị: {一円|いちえん}, {三階|さんがい}, {五月|ごがつ}. Kun (ひと・ふた・みっ…) đi với 〜つ: {一|ひと}つ, {二|ふた}つ, {三|みっ}つ.',
      ghi: 'Đây là câu hỏi cuối của đề cương JPD113 (CQ15.5). Nói kèm ví dụ là trọn điểm.',
    }),
    S('{第2課|だいにか} {復習|ふくしゅう} — ポイント 7–15', {
      bang: B(['ポイント', 'Mẫu', 'Ví dụ'], [
        ['7', 'これ・それ・あれ', 'これは{時計|とけい}です。'],
        ['8', 'この・その・あの N', 'このカメラ'],
        ['9', 'ここ・そこ・あそこ・どこ (こちら…)', 'トイレはあそこです。'],
        ['10', 'N を（〜つ）ください', 'コーヒーを{二|ふた}つください。'],
        ['11', 'いくら', 'これはいくらですか。'],
        ['12', '{何|なん}の N', '{魚|さかな}の{料理|りょうり}'],
        ['13', 'どこの N', 'イタリアのワイン'],
        ['14', 'だれの N', 'ワンさんのかばん'],
        ['15', 'N（〜{語|ご}）で', '{日本語|にほんご}で{何|なん}ですか。'],
      ]),
      ghi: 'Chín mẫu của Bài 2, tất cả dựng trên khung N は N です của Bài 1. Đọc từng ví dụ rồi tự đặt câu mới.',
    }),
    S('もう{一度|いちど}{聞|き}こう — Một lượt mua sắm', {
      anh: ['woman-student', 'person-tipping-hand'],
      nhan: ['パク', '{店員|てんいん}'],
      j: [
        'パク： すみません、 {時計|とけい} は {何階|なんがい} です か。',
        '{店員|てんいん}： {3階|さんがい} です。 エレベーター は あちら です。',
        'パク： あのう、 この {時計|とけい} は いくら です か。',
        '{店員|てんいん}： {9,800円|きゅうせんはっぴゃくえん} です。 {日本|にほん} の {時計|とけい} です。',
        'パク： じゃ、 これ を ください。',
      ],
      ghi: 'Một đoạn gói gần đủ Bài 2: tầng, chỉ chỗ lịch sự, この, いくら, どこの, をください.',
    }),
    S('{宿題確認|しゅくだいかくにん} — Sửa câu sai', {
      j: ['!① ~~これカメラはいくらですか。~~', '!② ~~{二|ふた}つコーヒーをください。~~', '!③ ~~このは{日本|にほん}の{時計|とけい}です。~~', '!④ ~~トイレはどれですか。~~'],
      hoi: 'Sửa bốn câu.',
      dap: '① このカメラはいくらですか。 ② コーヒーを{二|ふた}つください。 ③ これは{日本|にほん}の{時計|とけい}です。 ④ トイレはどこですか。',
      ghi: 'Bốn lỗi điển hình: これ／この, vị trí số lượng, この đứng một mình, hỏi chỗ phải dùng どこ.',
    }),
    S('まとめ — Tóm tắt phần Bài 2 của Slot 15', {
      bang: B(['Nội dung', 'Ghi nhớ'], [
        ['Chữ Hán', '一 二 三 四 五 六 七 八 九 十 百 千 万 円'],
        ['On / Kun', 'いち・に・さん… ／ ひと(つ)・ふた(つ)・みっ(つ)…'],
        ['Đổi âm', 'さんびゃく・ろっぴゃく・はっぴゃく・さんぜん・はっせん'],
      ]),
      ghi: 'Về nhà: viết mỗi chữ 10 lần, đọc lại bảng ポイント 7–15. Tiết cuối của slot: mở Bài 3 — giờ giấc.',
    }),
  ],
  [
    Q('四千五百円 đọc là:', 'よんせんごひゃくえん', 'しせんごひゃくえん | よんせんごびゃくえん | よっせんごひゃくえん', '四千 = よんせん; 五百 = ごひゃく.'),
    Q('Chữ Hán của "vạn" (10.000):', '万', '千 | 百 | 円', '万 = VẠN.'),
    Q('三つ đọc là:', 'みっつ', 'さんつ | みつ | さんっつ', 'Kun của 三 + つ: みっつ.'),
    Q('八百 đọc là:', 'はっぴゃく', 'はちひゃく | はっひゃく | やおひゃく', '八 + 百 ⇒ はっぴゃく.'),
    Q('Câu nào ĐÚNG?', 'このカメラはいくらですか。', 'これカメラはいくらですか。 | このはいくらですか。 | カメラこのはいくらですか。', 'この + danh từ.'),
    Q('「九月」 đọc là:', 'くがつ', 'きゅうがつ | ここのがつ | くげつ', 'Tháng 9 = くがつ.'),
  ],
);

/* ── Slide tổng hợp Bài 2 ── */
const B2_TONG_HOP = TONG_HOP(
  2,
  'Có bộ slide "bản tóm tắt thi" của Bài 2: toàn bộ từ vựng của danh sách cô gom theo chỗ dùng (toà nhà, cửa hàng, siêu thị, nhà hàng), bảng số – giá – tầng, và chín ポイント 7–15.',
  [
    '**Phần 1 — Từ vựng theo nhóm** (có tranh): nơi chốn trong toà nhà · cửa hàng · đồ điện tử · quần áo · đồ dùng · thực phẩm · món ăn · đồ uống · câu mua bán · nước & tiếng.',
    '**Phần 2 — Số, tầng, giá**: 〜階, 百・千・万, 〜つ.',
    '**Phần 3 — ポイント 7–15**: mỗi điểm một ô công thức + ví dụ; bảng tổng kết câu hỏi của Bài 2.',
    'Giải thích kỹ nằm ở các deck **Slot 11–15**.',
  ],
  'JPD113 · Bài 2 どこですか・いくらですか · Slide tổng hợp',
  [
    S('{第2課|だいにか} どこですか・いくらですか — Tổng hợp', {
      anh: ['information', 'yen-banknote', 'curry-rice'],
      nhan: ['どこ？', 'いくら？', '{何|なん}の{料理|りょうり}？'],
      j: ['!Phần 1: từ vựng · Phần 2: số – tầng – giá · Phần 3: ポイント 7–15'],
      ghi: 'Bộ slide ôn cả Bài 2. Học theo nhóm chỗ dùng: ở toà nhà, ở cửa hàng, ở siêu thị, ở nhà hàng.',
    }),
    S('ことば ① — Chỉ chỗ', {
      bang: B(['Gần mình', 'Gần người nghe', 'Xa cả hai', 'Hỏi'], [['ここ', 'そこ', 'あそこ', 'どこ'], ['こちら', 'そちら', 'あちら', 'どちら']]),
      ghi: 'Hàng dưới là cách nói lịch sự. Cùng quy tắc こ・そ・あ・ど với これ… và この….',
    }),
    S('ことば ② — Trong toà nhà', {
      anh: ['information', 'elevator', 'restroom', 'atm-sign'],
      nhan: ['インフォメーション', 'エレベーター', 'トイレ', 'ATM'],
      j: ['エスカレーター、 レジ、 きつえんじょ、 {地下|ちか}、 〜{階|かい}'],
      ghi: 'Thang máy エレベーター ≠ thang cuốn エスカレーター. 地下 = tầng hầm.',
    }),
    S('ことば ③ — Cửa hàng', {
      anh: ['shopping-cart', 'fork-and-knife-with-plate', 'hot-beverage', 'books'],
      nhan: ['スーパー', 'レストラン', 'きっさてん', '{本屋|ほんや}'],
      j: ['{100円|ひゃくえん} ショップ、 〜{屋|や}'],
      ghi: '〜屋 = cửa hàng 〜 (本屋 hiệu sách). 店員 = nhân viên bán hàng.',
    }),
    S('ことば ④ — Đồ điện tử', {
      anh: ['camera', 'mobile-phone', 'laptop', 'watch'],
      nhan: ['カメラ', '{携帯電話|けいたいでんわ}', 'パソコン', '{時計|とけい}'],
      j: ['{電子辞書|でんしじしょ}'],
      ghi: '電子辞書 = kim từ điển — món sinh viên Nhật nào cũng từng có.',
    }),
    S('ことば ⑤ — Quần áo & túi', {
      anh: ['mans-shoe', 'jeans', 't-shirt', 'handbag'],
      nhan: ['くつ', 'ズボン', 'Tシャツ', 'かばん'],
      ghi: 'Bốn từ quần áo của Bài 2. かばん dùng cho cả cặp sách lẫn túi xách.',
    }),
    S('ことば ⑥ — Đồ dùng', {
      anh: ['pen', 'purse', 'books', 'roll-of-paper'],
      nhan: ['ペン', '{財布|さいふ}', '{本|ほん}', 'トイレットペーパー'],
      j: ['{消|け}しゴム'],
      ghi: '消しゴム = cục tẩy. Các món này hay xuất hiện trong câu だれの〜ですか.',
    }),
    S('ことば ⑦ — Thực phẩm ① (thịt, cá, rau)', {
      anh: ['cut-of-meat', 'poultry-leg', 'fish', 'leafy-green'],
      nhan: ['{肉|にく}・{牛肉|ぎゅうにく}・{豚肉|ぶたにく}', '{鶏肉|とりにく}', '{魚|さかな}', '{野菜|やさい}'],
      ghi: '牛肉 bò, 豚肉 lợn, 鶏肉 gà. Dùng trong 何の料理ですか.',
    }),
    S('ことば ⑧ — Thực phẩm ②', {
      anh: ['egg', 'bread', 'strawberry', 'red-apple'],
      nhan: ['{卵|たまご}', 'パン', 'イチゴ', 'リンゴ'],
      j: ['{米|こめ}、 {油|あぶら}、 {水|みず}'],
      ghi: '米 = gạo (chưa nấu), ご飯 = cơm. 油 = dầu ăn.',
    }),
    S('ことば ⑨ — Món ăn', {
      anh: ['curry-rice', 'bowl-with-spoon', 'cooked-rice', 'shortcake'],
      nhan: ['カレー', 'スープ', 'ご{飯|はん}', 'ケーキ'],
      j: ['とんかつ、 ハンバーグ、 ライス、 {料理|りょうり}'],
      ghi: 'ハンバーグ = thịt băm viên áp chảo (không phải bánh hamburger). とんかつ = thịt lợn chiên xù.',
    }),
    S('ことば ⑩ — Đồ uống', {
      anh: ['beverage-box', 'hot-beverage', 'teacup-without-handle', 'wine-glass'],
      nhan: ['ジュース', 'コーヒー', 'お{茶|ちゃ}', 'ワイン'],
      j: ['{紅茶|こうちゃ}、 ビール'],
      ghi: 'お茶 trà xanh, 紅茶 trà đen.',
    }),
    S('ことば ⑪ — Mua bán & gọi món', {
      bang: B(['Câu / từ', 'Nghĩa'], [
        ['いらっしゃいませ', 'kính chào quý khách'],
        ['（どうも）ありがとうございます', 'xin cảm ơn'],
        ['いくら ／ 〜{円|えん}', 'bao nhiêu tiền / 〜 yên'],
        ['じゃ', 'vậy thì'],
        ['{注文|ちゅうもん}をお{願|ねが}いします', 'cho tôi gọi món'],
        ['どうぞ', 'xin mời'],
        ['〜つ', '〜 cái (ひとつ…とお)'],
      ]),
      ghi: 'Câu của nhân viên (いらっしゃいませ, どうぞ) cần nghe hiểu; câu của khách (〜をください, 注文を…) cần nói được.',
    }),
    S('ことば ⑫ — Nước, tiếng, người', {
      anh: ['globe-showing-europe-africa', 'globe-showing-asia-australia', 'speaking-head'],
      nhan: ['ドイツ・フランス', 'インド', '〜{語|ご}'],
      j: ['{英語|えいご}、 {日本語|にほんご}、 ベトナム{語|ご}', 'だれ'],
      ghi: 'Tên nước + 語 = tiếng nước đó; riêng tiếng Anh là 英語. だれ = ai.',
    }),
    S('Tầng — 〜{階|かい}', {
      bang: B(['Tầng', 'Đọc', 'Tầng', 'Đọc'], [
        ['1{階|かい}', 'いっかい', '6{階|かい}', 'ろっかい'],
        ['3{階|かい}', 'さんがい', '8{階|かい}', 'はっかい'],
        ['{何階|なんがい}', 'なんがい', '10{階|かい}', 'じゅっかい'],
      ]),
      ghi: 'Chỉ cần nhớ sáu chỗ đổi âm này; các tầng khác đọc số + かい.',
    }),
    S('Số — 百・千・万', {
      bang: B(['', 'Đổi âm'], [
        ['百', 'さんびゃく・なんびゃく・ろっぴゃく・はっぴゃく'],
        ['千', 'さんぜん・なんぜん・はっせん'],
        ['万', 'いちまん (phải có いち) · じゅうまん = 100.000'],
      ]),
      ghi: 'Đếm theo vạn: tách 4 chữ số từ phải. 25,000 = にまん ごせん.',
    }),
    S('Đếm đồ vật — 〜つ', {
      bang: B(['1〜5', '6〜10'], [['ひとつ・ふたつ・みっつ', 'むっつ・ななつ・やっつ'], ['よっつ・いつつ', 'ここのつ・とお']]),
      ghi: 'Dùng khi gọi món, mua đồ: カレーを一つください.',
    }),
    S('ポイント 7 — これ・それ・あれ', {
      anh: ['watch'],
      nhan: ['これ'],
      j: ['これ は {時計|とけい} です。', 'A： それ は {何|なん} です か。', 'B： これ は {電子辞書|でんしじしょ} です。'],
      ghi: 'Đứng một mình thay cho vật. Hỏi それ thì đáp これ, và ngược lại.',
    }),
    S('ポイント 8 — この・その・あの N', {
      j: ['この カメラ は いくら です か。', 'その かばん は {日本|にほん} の かばん です。', '!~~これカメラ~~ ✗ → このカメラ'],
      ghi: 'Bắt buộc có danh từ ngay sau この・その・あの.',
    }),
    S('ポイント 9 — ここ・そこ・あそこ・どこ', {
      j: ['A： トイレ は どこ です か。', 'B： あそこ です。', '{店員|てんいん}： エレベーター は あちら です。'],
      ghi: 'Hỏi chỗ: どこ／どちら. Nhân viên đáp lịch sự bằng こちら・そちら・あちら.',
    }),
    S('ポイント 9 — Tầng mấy?', {
      j: ['A： {本屋|ほんや} は {何階|なんがい} です か。', 'B： {4階|よんかい} です。'],
      ghi: 'Câu hỏi tầng đi cùng ポイント 9 trong ST1.',
    }),
    S('ポイント 10 — N を（〜つ）ください', {
      j: ['じゃ、 これ を ください。', 'コーヒー を {二|ふた}つ ください。'],
      hoi: '"Cho tôi ba quả táo" nói thế nào?',
      dap: A('リンゴ を {三|みっ}つ ください。'),
      ghi: 'Số lượng đứng giữa を và ください.',
    }),
    S('ポイント 11 — いくら', {
      j: ['A： この {財布|さいふ} は いくら です か。', 'B： {3,200円|さんぜんにひゃくえん} です。'],
      ghi: 'Đáp giá: số + 円 + です.',
    }),
    S('ポイント 12 — {何|なん}の N', {
      j: ['A： これ は {何|なん} の {料理|りょうり} です か。', 'B： {牛肉|ぎゅうにく} の {料理|りょうり} です。'],
      ghi: 'Hỏi loại / nguyên liệu.',
    }),
    S('ポイント 13 — どこの N', {
      j: ['A： これ は どこ の ワイン です か。', 'B： イタリア の ワイン です。'],
      ghi: 'Hỏi xuất xứ (nước, hãng).',
    }),
    S('ポイント 14 — だれの N', {
      j: ['A： これ は だれ の {財布|さいふ} です か。', 'B： ^マルコ-さん の {財布|さいふ} です。'],
      ghi: 'Hỏi chủ sở hữu. Đáp: tên + の + N.',
    }),
    S('ポイント 15 — 〜{語|ご}で', {
      j: ['A： “wine” は {日本語|にほんご} で {何|なん} です か。', 'B： ワイン です。'],
      ghi: 'Câu cứu hộ khi không biết từ — dùng được cả trong giờ thi nói.',
    }),
    S('Tổng kết — các câu hỏi của Bài 2', {
      bang: B(['Câu hỏi', 'Hỏi gì', 'Đáp mẫu'], [
        ['〜はどこですか', 'chỗ', 'あそこです'],
        ['〜は{何階|なんがい}ですか', 'tầng', '{3階|さんがい}です'],
        ['〜はいくらですか', 'giá', '{500円|ごひゃくえん}です'],
        ['{何|なん}の〜ですか', 'loại / nguyên liệu', '{魚|さかな}の{料理|りょうり}です'],
        ['どこの〜ですか', 'xuất xứ', 'フランスのワインです'],
        ['だれの〜ですか', 'chủ', 'ワンさんのかばんです'],
        ['〜は〜{語|ご}で{何|なん}ですか', 'từ ngữ', '{卵|たまご}です'],
      ]),
      ghi: 'Bảy câu hỏi này là "đề nói" của Bài 2. Che cột phải, tự trả lời.',
    }),
    S('{会話|かいわ} — Hội thoại tổng hợp', {
      anh: ['man-student', 'person-tipping-hand'],
      nhan: ['ダニエル', '{店員|てんいん}'],
      j: [
        '{店員|てんいん}： いらっしゃいませ。',
        'ダニエル： すみません、 これ は {何|なん} の ケーキ です か。',
        '{店員|てんいん}： イチゴ の ケーキ です。',
        'ダニエル： いくら です か。',
        '{店員|てんいん}： {400円|よんひゃくえん} です。',
        'ダニエル： じゃ、 これ を {二|ふた}つ ください。',
      ],
      ghi: 'Một lượt mua bánh dùng ポイント 7, 10, 11, 12.',
    }),
    S('⚠ Lỗi hay mất điểm Bài 2', {
      bang: B(['Sai', 'Đúng'], [
        ['~~これカメラ~~', 'このカメラ'],
        ['~~{二|ふた}つコーヒーをください~~', 'コーヒーを{二|ふた}つください'],
        ['~~さんかい・ろくかい~~', 'さんがい・ろっかい'],
        ['~~さんひゃく・はちひゃく~~', 'さんびゃく・はっぴゃく'],
        ['Khách nói これ, nhân viên cũng nói ~~これ~~', 'nhân viên nói それ'],
      ]),
      ghi: 'Năm lỗi này hay bị trừ điểm nhất trong thi nói Bài 2.',
    }),
    S('まとめ — Bài 2 trong một slide', {
      bang: B(['Tình huống', 'Câu then chốt'], [
        ['Toà nhà', 'すみません、〜は{何階|なんがい}ですか。／どこですか。'],
        ['Cửa hàng', 'この〜はいくらですか。— じゃ、これをください。'],
        ['Nhà hàng', '{注文|ちゅうもん}をお{願|ねが}いします。〜を{一|ひと}つください。'],
      ]),
      ghi: 'Ba tình huống, ba nhóm câu. Nói trơn ba dòng này là qua phần Bài 2.',
    }),
  ],
  [
    Q('Đồ ở xa cả hai người:', 'あれ', 'これ | それ | どれ', 'あ = xa cả hai.'),
    Q('「この（　）はいくらですか。」', 'かばん', 'これ | ここ | どこ', 'この + danh từ.'),
    Q('8{階|かい} đọc là:', 'はっかい', 'はちかい | はちがい | やっかい', '8階 = はっかい.'),
    Q('「これは（　）のかばんですか。」— ワンさんのです。', 'だれ', 'どこ | {何|なん} | いくら', 'Hỏi của ai: だれの.'),
    Q('「コーヒーを（　）ください。」 (2 cốc)', '{二|ふた}つ', '{二|に}つ | {二|ふた} | {二|に}こ', 'ふたつ.'),
    Q('3,000円 đọc là:', 'さんぜんえん', 'さんせんえん | みっせんえん | さんまんえん', '千 sau さん ⇒ ぜん.'),
  ],
);

/* ═════════════════════════════ BÀI 3 スケジュール ═════════════════════════════ */

/* ── Slot 15 — phần Bài 3 (tiết 45): ST1 話してみよう, 聞いてみよう, チャレンジ1, 今何時ですか ── */
const B3_SLOT15 = SLOT(
  3, '15', 'mo-bai-3-may-gio',
  'Bài 3 ST1 mở đầu: 今、何時ですか — đọc giờ, phút, 午前／午後',
  'Đọc đúng giờ và phút (kể cả 4時, 7時, 9時, 〜分 đổi âm), dùng 午前／午後・半, hỏi và trả lời 今、何時ですか.',
  [
    '**Mở Bài 3 スケジュール** — ba phần: giờ mở cửa · lịch trình · sinh hoạt hằng ngày.',
    '**Từ mới**: 今 · 午前 · 午後 · 朝 · 昼 · 夜 · 時間 · nơi công cộng (銀行, 郵便局, 図書館, 病院, 体育館, コンビニ).',
    '**〜時**: よじ, しちじ, くじ · **〜分**: いっぷん, さんぷん, ろっぷん, はっぷん, じゅっぷん · **半**.',
    '**今、何時ですか。— 10時15分です。** (チャレンジ 1, 言ってみよう 1).',
  ],
  'JPD113 · Bài 3 スケジュール · Slot 15',
  [
    S('{第3課|だいさんか} スケジュール — Slot 15 (tiết cuối)', {
      anh: ['alarm-clock', 'spiral-calendar', 'bank'],
      nhan: ['{何時|なんじ}？', 'スケジュール', '{銀行|ぎんこう}'],
      j: ['!Hôm nay (tiết 3 của Slot 15): **đọc giờ · hỏi giờ**'],
      ghi: 'Bài 3 là bài về thời gian: giờ, thứ, lịch trình, một ngày của mình. Tiết đầu tiên chỉ lo một việc: đọc giờ cho đúng.',
    }),
    S('できること — Học xong Bài 3 làm được gì?', {
      anh: ['bank', 'spiral-calendar', 'sunrise'],
      nhan: ['{何時|なんじ}から{何時|なんじ}まで', '{私|わたし}のスケジュール', '{毎日|まいにち}'],
      j: ['!ST1: hỏi **giờ mở cửa, ngày nghỉ** của một nơi công cộng', '!ST2: hỏi lịch của trường, nói **kế hoạch** (đi đâu, làm gì)', '!ST3: kể **sinh hoạt hằng ngày** (mấy giờ dậy, ăn gì, học ở đâu)'],
      ghi: 'Bài 3 có động từ đầu tiên (〜ます) và tám trợ từ mới — bài nặng nhất của Nhật 1, nên học đều từng slot.',
    }),
    S('{話|はな}してみよう — Mấy giờ mở cửa?', {
      anh: ['bank', 'japanese-post-office', 'hospital'],
      nhan: ['{銀行|ぎんこう}', '{郵便局|ゆうびんきょく}', '{病院|びょういん}'],
      hoi: 'Ở Việt Nam, ngân hàng thường mở cửa lúc mấy giờ? Muốn biết giờ mở cửa thư viện, bạn làm gì?',
      dap: 'Tự trả lời bằng tiếng Việt — cuối buổi bạn sẽ nói được giờ bằng tiếng Nhật; Slot 16 sẽ hỏi được "từ mấy giờ đến mấy giờ".',
      ghi: 'Cô cho lớp đoán tình huống: gọi điện hỏi giờ mở cửa. Nghe CD (聞いてみよう) trước, chưa cần hiểu hết.',
    }),
    S('{新|あたら}しいことば ① — Thời gian trong ngày', {
      anh: ['sunrise', 'sun', 'night-with-stars', 'alarm-clock'],
      nhan: ['{朝|あさ}', '{昼|ひる}', '{夜|よる}', '{今|いま}'],
      j: ['{午前|ごぜん}、 {午後|ごご}、 {時間|じかん}'],
      ghi: '午前 = sáng (AM, trước 12 giờ trưa), 午後 = chiều tối (PM). 時間 = thời gian / giờ giấc (時間は何時から… = giờ mở cửa).',
    }),
    S('{新|あたら}しいことば ② — Nơi công cộng', {
      anh: ['bank', 'japanese-post-office', 'hospital', 'convenience-store'],
      nhan: ['{銀行|ぎんこう}', '{郵便局|ゆうびんきょく}', '{病院|びょういん}', 'コンビニ'],
      j: ['{図書館|としょかん}、 {体育館|たいいくかん}'],
      ghi: '図書館 = thư viện, 体育館 = nhà thi đấu. Biển đỏ hình chữ 〒 là biểu tượng bưu điện Nhật.',
    }),
    S('〜{時|じ} — Giờ', {
      bang: B(['Giờ', 'Đọc', 'Giờ', 'Đọc'], [
        ['1{時|じ}', 'いちじ', '7{時|じ}', '**しちじ**'],
        ['2{時|じ}', 'にじ', '8{時|じ}', 'はちじ'],
        ['3{時|じ}', 'さんじ', '9{時|じ}', '**くじ**'],
        ['4{時|じ}', '**よじ**', '10{時|じ}', 'じゅうじ'],
        ['5{時|じ}', 'ごじ', '11{時|じ}', 'じゅういちじ'],
        ['6{時|じ}', 'ろくじ', '12{時|じ}', 'じゅうにじ'],
      ]),
      j: ['{何時|なんじ}'],
      ghi: 'Ba giờ bẫy: 4 giờ よじ (không よんじ), 7 giờ しちじ, 9 giờ くじ. Người Nhật thường nói giờ theo 12 tiếng kèm 午前／午後.',
    }),
    S('〜{分|ふん} — Phút', {
      bang: B(['Phút', 'Đọc', 'Phút', 'Đọc'], [
        ['1{分|ふん}', '**いっぷん**', '6{分|ふん}', '**ろっぷん**'],
        ['2{分|ふん}', 'にふん', '7{分|ふん}', 'ななふん'],
        ['3{分|ふん}', '**さんぷん**', '8{分|ふん}', '**はっぷん**'],
        ['4{分|ふん}', '**よんぷん**', '9{分|ふん}', 'きゅうふん'],
        ['5{分|ふん}', 'ごふん', '10{分|ふん}', '**じゅっぷん**'],
        ['15{分|ふん}', 'じゅうごふん', '{何分|なんぷん}', '**なんぷん**'],
      ]),
      ghi: 'Phút đọc ふん hoặc ぷん: tận cùng 1, 3, 4, 6, 8, 10 → ぷん (có âm ngắt ở 1, 6, 8, 10). 2, 5, 7, 9 → ふん.',
    }),
    S('{半|はん} · {午前|ごぜん} · {午後|ごご}', {
      j: ['{午前|ごぜん} {9時半|くじはん}', '{午後|ごご} {3時|さんじ} {15分|じゅうごふん}', '{午後|ごご} {7時|しちじ} {30分|さんじゅっぷん}'],
      ghi: '半 = rưỡi (30 phút): 9時半 = 9 giờ rưỡi. 午前／午後 đứng TRƯỚC giờ, ngược tiếng Việt ("3 giờ chiều" = 午後3時).',
    }),
    S('Đọc đồng hồ', {
      anh: ['three-oclock', 'seven-thirty', 'nine-oclock', 'four-thirty'],
      nhan: ['{3時|さんじ}', '{7時半|しちじはん}', '{9時|くじ}', '{4時半|よじはん}'],
      hoi: 'Đọc to bốn đồng hồ trước khi bấm nghe nhãn.',
      dap: 'さんじ · しちじはん · くじ · よじはん',
      ghi: 'Bấm vào nhãn dưới hình để nghe. Cô hay giơ đồng hồ và gọi bất chợt — phản xạ trong 2 giây là đạt.',
    }),
    S('{今|いま}、{何時|なんじ}ですか', {
      bang: B(['Hỏi', 'Đáp'], [['{今|いま}、**{何時|なんじ}**ですか。', '**10{時|じ}15{分|ふん}**です。']]),
      j: ['A： すみません、 {今|いま}、 {何時|なんじ} です か。', 'B： {10時|じゅうじ} {15分|じゅうごふん} です。', 'A： ありがとう ございます。'],
      ghi: '今 = bây giờ; không cần trợ từ sau 今. Đáp: 〜時〜分です.',
    }),
    S('チャレンジ 1 — Hỏi giờ', {
      anh: ['man-student', 'woman-student'],
      nhan: ['ナタポン', '{木村|きむら}'],
      j: [
        'ナタポン： すみません、 {今|いま}、 {何時|なんじ} です か。',
        '{木村|きむら}： {午後|ごご} {1時|いちじ} {40分|よんじゅっぷん} です。',
        'ナタポン： {1時|いちじ} {40分|よんじゅっぷん} です か。 ありがとう ございます。',
      ],
      ghi: '40分 = よんじゅっぷん. Nhắc lại giờ vừa nghe để xác nhận — giống cách nhắc lại tầng ở Bài 2.',
    }),
    S('{言|い}ってみよう 1 — Giờ ở các nước', {
      anh: ['map-of-japan', 'globe-showing-asia-australia'],
      nhan: ['{日本|にほん}', 'ベトナム'],
      j: ['A： {日本|にほん} は {今|いま}、 {午後|ごご} {3時|さんじ} です。', 'A： ベトナム は {今|いま}、 {何時|なんじ} です か。'],
      hoi: 'Việt Nam chậm hơn Nhật 2 tiếng. Trả lời câu hỏi trên.',
      dap: A('{午後|ごご} {1時|いちじ} です。'),
      ghi: 'Dùng lại tên nước của Bài 1. Đổi giờ Nhật khác nhau rồi hỏi tiếp để luyện phản xạ.',
    }),
    S('チャレンジ — Luyện cặp', {
      anh: ['ten-oclock', 'six-thirty', 'twelve-oclock', 'eight-thirty'],
      hoi: 'A hỏi 「今、何時ですか」, B nhìn từng đồng hồ trả lời.',
      dap: '{10時|じゅうじ}です · {6時半|ろくじはん}です · {12時|じゅうにじ}です · {8時半|はちじはん}です',
      ghi: 'Đổi vai. Thêm 午前／午後 cho khó hơn: 午前10時, 午後6時半….',
    }),
    S('⚠ Lỗi hay gặp khi đọc giờ', {
      j: ['!~~よんじ~~ → **よじ**', '!~~ななじ~~ → **しちじ**', '!~~きゅうじ~~ → **くじ**', '!~~じゅうふん~~ → **じゅっぷん**', '!~~3時午後~~ → **午後3時**'],
      ghi: 'Năm lỗi này gặp ở gần như mọi lớp. Đọc cột đúng thành tiếng năm lần.',
    }),
    S('まとめ — Tóm tắt tiết mở Bài 3', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Hỏi giờ', '{今|いま}、{何時|なんじ}ですか。'],
        ['Trả lời', '{午前|ごぜん}{9時半|くじはん}です。／{午後|ごご}{4時|よじ}{10分|じゅっぷん}です。'],
        ['Bẫy', 'よじ・しちじ・くじ・いっぷん・さんぷん・じゅっぷん'],
      ]),
      ghi: 'Về nhà: mỗi lần nhìn đồng hồ thì đọc thầm giờ bằng tiếng Nhật. Slot 16: 〜から〜まで, thứ trong tuần và chữ Hán Bài 3.',
    }),
  ],
  [
    Q('4{時|じ} — 4 giờ đọc là:', 'よじ', 'よんじ | しじ | よっじ', '4時 = よじ.'),
    Q('9{時|じ} — 9 giờ đọc là:', 'くじ', 'きゅうじ | ここのじ | くうじ', '9時 = くじ.'),
    Q('10{分|ふん} — 10 phút đọc là:', 'じゅっぷん', 'じゅうふん | じゅっふん | とおぷん', '10分 = じゅっぷん.'),
    Q('"3 giờ chiều":', '{午後|ごご}{3時|さんじ}', '{3時|さんじ}{午後|ごご} | {午前|ごぜん}{3時|さんじ} | {昼|ひる}{3時|さんじ}', '午後 đứng trước giờ.'),
    Q('「{今|いま}、（　）ですか。」 — hỏi mấy giờ', '{何時|なんじ}', '{何階|なんがい} | いくら | いつ', '何時 = mấy giờ.'),
    Q('{7時半|しちじはん} là:', '7 giờ 30', '7 giờ 15 | 8 giờ 30 | 7 giờ kém 30', '半 = rưỡi.'),
  ],
);

/* ── Slot 16 (tiết 46–48): ST1 チャレンジ2・3 〜から〜まで, 何曜日 · やってみよう · 漢字 第3課 ── */
const B3_SLOT16 = SLOT(
  3, '16', 'kara-made-thu-kanji-3',
  'Bài 3 ST1: 〜から〜までです · 何曜日 · chữ Hán Bài 3',
  'Hỏi và nói giờ mở cửa "từ … đến …", nói thứ trong tuần và ngày nghỉ, gọi điện hỏi một nơi công cộng, và đọc – viết 13 chữ Hán của lớp Bài 3.',
  [
    '**ポイント 21 (với です)** — 銀行は9時から3時までです。 何時から何時までですか。',
    '**曜日** — 月・火・水・木・金・土・日曜日 · 何曜日ですか · 休みは何曜日ですか.',
    '**チャレンジ 2・3**: gọi điện hỏi giờ mở cửa (そちらは…) · **やってみよう ST1**: đọc biển giờ.',
    '**漢字 第3課** — 13 chữ: 月 火 水 木 金 土 日 曜 何 年 時 間 分.',
  ],
  'JPD113 · Bài 3 スケジュール · Slot 16',
  [
    S('{第3課|だいさんか} — Slot 16: 〜から〜まで · {何曜日|なんようび} · {漢字|かんじ}', {
      anh: ['bank', 'tear-off-calendar', 'writing-hand'],
      nhan: ['{9時|くじ}から{3時|さんじ}まで', '{何曜日|なんようび}', '{漢字|かんじ}'],
      j: ['!Hôm nay: **giờ mở cửa · thứ trong tuần · 13 chữ Hán**'],
      ghi: 'Hai tiết đầu xong phần ST1 (giờ mở cửa và ngày nghỉ), tiết cuối học chữ Hán — bảy chữ đầu chính là bảy thứ trong tuần.',
    }),
    S('{復習|ふくしゅう} — Đọc giờ', {
      j: ['!4:00 · 7:30 · 9:10 · 午後6:45'],
      hoi: 'Đọc to bốn giờ trên.',
      dap: 'よじ · しちじはん · くじ じゅっぷん · ごご ろくじ よんじゅうごふん',
      ghi: 'Ôn đúng các giờ bẫy của buổi trước. 45分 = よんじゅうごふん (5 → ふん).',
    }),
    S('ポイント 21 — 〜から〜までです', {
      bang: B(['N は', '〜から', '〜まで', 'です'], [
        ['{銀行|ぎんこう}は', '{9時|くじ}から', '{3時|さんじ}まで', 'です。'],
        ['{図書館|としょかん}は', '{午前|ごぜん}{10時|じゅうじ}から', '{夜|よる}{8時|はちじ}まで', 'です。'],
      ]),
      j: ['!**から** = từ · **まで** = đến'],
      ghi: 'から đặt SAU mốc bắt đầu, まで đặt SAU mốc kết thúc. Dùng được với giờ, thứ, ngày, tháng.',
    }),
    S('{何時|なんじ}から{何時|なんじ}までですか', {
      anh: ['japanese-post-office', 'hospital'],
      nhan: ['{郵便局|ゆうびんきょく}', '{病院|びょういん}'],
      j: [
        'A： {郵便局|ゆうびんきょく} は {何時|なんじ} から {何時|なんじ} まで です か。',
        'B： {午前|ごぜん} {9時|くじ} から {午後|ごご} {5時|ごじ} まで です。',
        'A： {病院|びょういん} は {何時|なんじ} まで です か。',
        'B： {午後|ごご} {6時半|ろくじはん} まで です。',
      ],
      ghi: 'Có thể hỏi một nửa: 何時からですか (mấy giờ mở) hoặc 何時までですか (mấy giờ đóng).',
    }),
    S('{曜日|ようび} — Thứ trong tuần', {
      anh: ['tear-off-calendar'],
      nhan: ['{曜日|ようび}'],
      bang: B(['Thứ', 'Đọc', 'Nghĩa'], [
        ['{月曜日|げつようび}', 'getsuyoubi', 'thứ Hai'],
        ['{火曜日|かようび}', 'kayoubi', 'thứ Ba'],
        ['{水曜日|すいようび}', 'suiyoubi', 'thứ Tư'],
        ['{木曜日|もくようび}', 'mokuyoubi', 'thứ Năm'],
        ['{金曜日|きんようび}', "kin'youbi", 'thứ Sáu'],
        ['{土曜日|どようび}', 'doyoubi', 'thứ Bảy'],
        ['{日曜日|にちようび}', 'nichiyoubi', 'Chủ Nhật'],
      ]),
      ghi: 'Bảy thứ theo bảy "nguyên tố": Trăng, Lửa, Nước, Cây, Vàng, Đất, Mặt trời. Tuần Nhật bắt đầu từ 日曜日 trên lịch.',
    }),
    S('{何曜日|なんようび}ですか', {
      j: ['A： {休|やす}み は {何曜日|なんようび} です か。', 'B： {日曜日|にちようび} です。', 'A： {体育館|たいいくかん} の {休|やす}み は いつ です か。', 'B： {火曜日|かようび} です。'],
      ghi: '休み = ngày nghỉ. Hỏi thứ: 何曜日ですか; hỏi chung chung "khi nào": いつですか — cả hai đều được.',
    }),
    S('{月曜日|げつようび}から{金曜日|きんようび}まで', {
      j: ['{銀行|ぎんこう} は {月曜日|げつようび} から {金曜日|きんようび} まで です。', '{土曜日|どようび} と {日曜日|にちようび} は {休|やす}み です。'],
      hoi: 'Hỏi "Ngân hàng làm việc từ thứ mấy đến thứ mấy?"',
      dap: A('{銀行|ぎんこう} は {何曜日|なんようび} から {何曜日|なんようび} まで です か。'),
      ghi: '〜から〜まで dùng cả cho thứ. Hai ngày nghỉ nối bằng と (Bài 1).',
    }),
    S('チャレンジ 2・3 — Gọi điện hỏi giờ', {
      anh: ['woman-student', 'telephone-receiver'],
      nhan: ['パク', '{体育館|たいいくかん}'],
      j: [
        '{体育館|たいいくかん}： はい、 さくら {体育館|たいいくかん} です。',
        'パク： あのう、 すみません。 そちら は {何時|なんじ} から {何時|なんじ} まで です か。',
        '{体育館|たいいくかん}： {午前|ごぜん} {9時|くじ} から {夜|よる} {9時|くじ} まで です。',
        'パク： {休|やす}み は {何曜日|なんようび} です か。',
        '{体育館|たいいくかん}： {月曜日|げつようび} です。',
        'パク： {月曜日|げつようび} です か。 ありがとう ございます。',
      ],
      ghi: 'Gọi điện thì gọi nơi đó là そちら (phía bên đó) — lịch sự, đã học ở Bài 2. Nhắc lại thông tin để xác nhận rồi cảm ơn.',
    }),
    S('やってみよう ST1 — Đọc biển giờ', {
      bang: B(['Nơi', 'Giờ', 'Nghỉ'], [
        ['{銀行|ぎんこう}', '9:00〜15:00', '{土曜日|どようび}・{日曜日|にちようび}'],
        ['{郵便局|ゆうびんきょく}', '9:00〜17:00', '{日曜日|にちようび}'],
        ['{図書館|としょかん}', '10:00〜20:00', '{水曜日|すいようび}'],
      ]),
      hoi: 'A hỏi giờ + ngày nghỉ của thư viện; B đọc biển trả lời.',
      dap: `${A('{図書館|としょかん} は {何時|なんじ} から {何時|なんじ} まで です か。')} — ${A('{10時|じゅうじ} から {8時|はちじ} まで です。')} ${A('{休|やす}み は {水曜日|すいようび} です。')}`,
      ghi: 'Biển ghi giờ 24 tiếng (20:00) nhưng nói thường đổi sang 午後8時 / 夜8時. Đổi vai hỏi hai nơi còn lại.',
    }),
    S('{漢字|かんじ} {第3課|だいさんか} — 13 chữ của lớp', {
      j: ['!**月　火　水　木　金　土　日**', '!**曜　何　年　時　間　分**'],
      ghi: 'Bảy chữ đầu ghép với 曜日 thành bảy thứ. Sáu chữ sau là chữ của giờ giấc: 何時, 時間, 〜分, 1年.',
    }),
    HAN('①', '月', 'NGUYỆT', 'mặt trăng; tháng', 'ゲツ・ガツ', 'つき', [['{月曜日|げつようび}', 'thứ Hai'], ['{一月|いちがつ}', 'tháng 1'], ['{月|つき}', 'mặt trăng']],
      'Hình vầng trăng khuyết. Thứ Hai đọc ゲツ, tên tháng đọc ガツ.', 'crescent-moon'),
    HAN('②', '火', 'HỎA', 'lửa', 'カ', 'ひ', [['{火曜日|かようび}', 'thứ Ba'], ['{火|ひ}', 'lửa'], ['{花火|はなび}', 'pháo hoa']],
      'Hình ngọn lửa bốc lên hai bên. Trong 花火 (hoa lửa = pháo hoa) đọc び.', 'fire'),
    HAN('③', '水', 'THỦY', 'nước', 'スイ', 'みず', [['{水曜日|すいようび}', 'thứ Tư'], ['{水|みず}', 'nước'], ['{水泳|すいえい}', 'bơi lội']],
      'Hình dòng nước chảy ở giữa, tia nước hai bên. 水 (みず) đã gặp ở Bài 2.', 'droplet'),
    HAN('④', '木', 'MỘC', 'cây', 'モク', 'き', [['{木曜日|もくようび}', 'thứ Năm'], ['{木|き}', 'cái cây']],
      'Hình cái cây có cành và rễ. Bộ 木 có trong 校 (trường) đã học ở Bài 1.', 'deciduous-tree'),
    HAN('⑤', '金', 'KIM', 'vàng; tiền; kim loại', 'キン', 'かね', [['{金曜日|きんようび}', 'thứ Sáu'], ['お{金|かね}', 'tiền']],
      'Hình mỏ khoáng có thỏi vàng bên trong. お金 = tiền (thêm お).', 'coin'),
    HAN('⑥', '土', 'THỔ', 'đất', 'ド・ト', 'つち', [['{土曜日|どようび}', 'thứ Bảy'], ['{土|つち}', 'đất']],
      'Hình mầm cây nhú lên khỏi mặt đất. Phân biệt với 士 (nét dưới ngắn hơn nét trên).'),
    HAN('⑦', '日', 'NHẬT', 'mặt trời; ngày (ôn Bài 1)', 'ニチ・ニ', 'ひ・か', [['{日曜日|にちようび}', 'Chủ Nhật'], ['{毎日|まいにち}', 'mỗi ngày'], ['{休|やす}みの{日|ひ}', 'ngày nghỉ']],
      'Đã học ở Bài 1 (日本). Bài 3 thêm 日曜日, 毎日.', 'sun'),
    HAN('⑧', '曜', 'DIỆU', 'ngày trong tuần', 'ヨウ', '—', [['{曜日|ようび}', 'thứ (trong tuần)'], ['{何曜日|なんようび}', 'thứ mấy']],
      'Chữ nhiều nét nhất bài: bộ 日 bên trái + hai cánh 羽 + 隹 (chim). Chỉ đọc ヨウ, gần như chỉ dùng trong 〜曜日.', 'tear-off-calendar'),
    HAN('⑨', '何', 'HÀ', 'cái gì', 'カ', 'なに・なん', [['{何|なに}', 'cái gì'], ['{何時|なんじ}', 'mấy giờ'], ['{何歳|なんさい}', 'mấy tuổi'], ['{何階|なんがい}', 'tầng mấy']],
      'Bộ 亻 (người) + 可. Trước đơn vị đếm (時, 歳, 階, 曜日) đọc なん; trước を đọc なに (Slot 17).', 'red-question-mark'),
    HAN('⑩', '年', 'NIÊN', 'năm', 'ネン', 'とし', [['{1年|いちねん}', 'một năm'], ['{何年|なんねん}', 'năm nào / mấy năm']],
      'Trên lịch Nhật năm viết trước tháng, ngày: 2026年11月9日.', 'spiral-calendar'),
    HAN('⑪', '時', 'THỜI', 'giờ; thời gian', 'ジ', 'とき', [['{何時|なんじ}', 'mấy giờ'], ['{時間|じかん}', 'thời gian'], ['{時計|とけい}', 'đồng hồ (Bài 2)']],
      'Bộ 日 (mặt trời) + 寺 — mặt trời chuyển động là thời gian. 時計 là cách đọc đặc biệt.', 'alarm-clock'),
    HAN('⑫', '間', 'GIAN', 'khoảng giữa; khoảng thời gian', 'カン・ケン', 'あいだ・ま', [['{時間|じかん}', 'thời gian, giờ giấc'], ['{24時間|にじゅうよじかん}', '24 giờ (mở cả ngày)']],
      'Mặt trời (日) lọt qua khe cửa (門) ⇒ khoảng giữa. コンビニは24時間です = cửa hàng tiện lợi mở 24 giờ.', 'hourglass-not-done'),
    HAN('⑬', '分', 'PHÂN', 'phút; chia', 'フン・プン・ブン', 'わ(かる)', [['{5分|ごふん}', '5 phút'], ['{10分|じゅっぷん}', '10 phút'], ['{何分|なんぷん}', 'mấy phút']],
      'Con dao (刀) chia đôi (八) ⇒ chia; giờ chia nhỏ ra là phút. Đọc ふん hay ぷん theo bảng 〜分.', 'stopwatch'),
    S('{漢字|かんじ} — Đọc không furigana', {
      j: ['!① 月曜日から金曜日まで', '!② 今、何時ですか。', '!③ 水曜日と土曜日', '!④ 時間は十時から三時までです。'],
      hoi: 'Đọc to bốn dòng.',
      dap: `① げつようび から きんようび まで · ② ${A('{今|いま}、 {何時|なんじ} です か。')} · ③ すいようび と どようび · ④ ${A('{時間|じかん} は {十時|じゅうじ} から {三時|さんじ} まで です。')}`,
      ghi: 'Dòng ④ dùng cả chữ Hán số của Bài 2. Che đáp án, đọc trước rồi mới mở.',
    }),
    S('まとめ — Tóm tắt Slot 16', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Giờ mở cửa', '〜は{何時|なんじ}から{何時|なんじ}までですか。'],
        ['Trả lời', '{9時|くじ}から{5時|ごじ}までです。'],
        ['Ngày nghỉ', '{休|やす}みは{何曜日|なんようび}ですか。— {日曜日|にちようび}です。'],
        ['Chữ Hán', '月 火 水 木 金 土 日 曜 何 年 時 間 分'],
      ]),
      ghi: 'Về nhà: viết lịch tuần của bạn bằng chữ Hán (月〜日), mỗi chữ 10 lần. Slot sau: động từ đầu tiên 〜ます.',
    }),
  ],
  [
    Q('「{銀行|ぎんこう}は9{時|じ}（　）3{時|じ}までです。」', 'から', 'まで | に | で', 'から = từ (ポイント 21).'),
    Q('{水曜日|すいようび} là:', 'thứ Tư', 'thứ Ba | thứ Năm | thứ Hai', '水 = nước ⇒ thứ Tư.'),
    Q('{金曜日|きんようび} đọc là:', 'きんようび', 'かねようび | きんにちび | こんようび', '金 = キン.'),
    Q('Hỏi ngày nghỉ là thứ mấy:', '{休|やす}みは{何曜日|なんようび}ですか。', '{休|やす}みは{何時|なんじ}ですか。 | {休|やす}みは{何階|なんがい}ですか。 | {休|やす}みはいくらですか。', '何曜日 = thứ mấy.'),
    Q('Chữ Hán nghĩa là "giờ":', '時', '間 | 分 | 年', '時 = THỜI, đọc じ trong 何時.'),
    Q('Gọi điện tới thư viện, gọi nơi đó lịch sự là:', 'そちら', 'あそこ | これ | どこ', 'そちら = phía bên đó (người nghe).'),
    Q('{時間|じかん} nghĩa là:', 'thời gian, giờ giấc', 'đồng hồ | một năm | mấy giờ', '時間 = thời gian.'),
  ],
);

/* ── Slot 17 (tiết 49–51): ST2 チャレンジ1 Vます(予定)・〜をVます · 2 〜へ · 3 Vません ── */
const B3_SLOT17 = SLOT(
  3, '17', 'lich-trinh-masu-wo-he-masen',
  'Bài 3 ST2: 私のスケジュール — Vます · 〜を · 〜へ行きます · Vません',
  'Đọc lịch cả năm của trường, nói kế hoạch bằng động từ 〜ます (làm gì: 〜を; đi đâu: 〜へ), và trả lời "không" bằng 〜ません.',
  [
    '**Từ mới ST2**: sự kiện trong năm (お花見, 花火, パーティー, バス旅行, テスト, 休み) · mùa (春 夏 秋 冬) · ゴールデンウイーク · ホームステイ · お祭り · スキー.',
    '**14 động từ 〜ます**: 食べます · 飲みます · 見ます · 読みます · 聞きます · 買います · します · 勉強します · 行きます · 来ます · 帰ります · 働きます · 起きます · 寝ます.',
    '**ポイント 16 — Vます** (kế hoạch) · **ポイント 18 — N を V** · 何をしますか (何 đọc なに).',
    '**ポイント 17 — 〜へ 行きます／来ます／帰ります** (へ đọc e) · どこへ行きますか.',
    '**ポイント 16 — Vません** + はい／いいえ.',
  ],
  'JPD113 · Bài 3 スケジュール · Slot 17',
  [
    S('{第3課|だいさんか} — Slot 17: {私|わたし}のスケジュール', {
      anh: ['spiral-calendar', 'person-walking', 'fork-and-knife'],
      nhan: ['スケジュール', '{行|い}きます', '{食|た}べます'],
      j: ['!Hôm nay: **động từ đầu tiên — 〜ます · làm gì (を) · đi đâu (へ) · không làm (ません)**'],
      ghi: 'Đến giờ câu nào cũng kết thúc bằng です. Hôm nay lần đầu câu kết thúc bằng động từ: 行きます, 食べます….',
    }),
    S('{復習|ふくしゅう} — 〜から〜まで', {
      hoi: 'Ngân hàng mở 9:00–15:00, nghỉ thứ Bảy và Chủ Nhật. Nói hai câu.',
      dap: `${A('{銀行|ぎんこう} は {9時|くじ} から {3時|さんじ} まで です。')} ${A('{土曜日|どようび} と {日曜日|にちようび} は {休|やす}み です。')}`,
      j: ['!から = từ · まで = đến · と = và'],
      ghi: 'Ôn để thấy から〜まで dùng chung cho giờ và thứ. Slot 19 sẽ ghép nó với động từ.',
    }),
    S('{新|あたら}しいことば ① — Lịch của trường', {
      anh: ['cherry-blossom', 'bus', 'party-popper', 'fireworks'],
      nhan: ['お{花見|はなみ}', 'バス', 'パーティー', '{花火|はなび}'],
      j: ['{桜|さくら}、 テスト、 {休|やす}み、 スケジュール、 {留学生|りゅうがくせい}'],
      ghi: 'お花見 = ngắm hoa anh đào (桜) đầu tháng 4. バス旅行 = chuyến đi chơi bằng xe buýt. 留学生 = du học sinh.',
    }),
    S('{新|あたら}しいことば ② — Mùa & kỳ nghỉ', {
      anh: ['cherry-blossom', 'sun', 'fallen-leaf', 'snowman'],
      nhan: ['{春|はる}', '{夏|なつ}', '{秋|あき}', '{冬|ふゆ}'],
      j: ['ゴールデン ウイーク、 ホームステイ、 お{祭|まつ}り、 スキー'],
      ghi: 'ゴールデンウイーク = chuỗi ngày nghỉ cuối tháng 4 – đầu tháng 5. 夏休み = nghỉ hè, 冬休み = nghỉ đông (夏/冬 + 休み).',
    }),
    S('{新|あたら}しいことば ③ — Động từ (ăn, xem, đọc)', {
      anh: ['fork-and-knife', 'hot-beverage', 'television', 'open-book'],
      nhan: ['{食|た}べます', '{飲|の}みます', '{見|み}ます', '{読|よ}みます'],
      ghi: 'Động từ lịch sự luôn kết thúc bằng 〜ます. Trong ngoặc ở sách là thể từ điển (食べる, 飲む…) — Bài 3 chỉ cần thể ます.',
    }),
    S('{新|あたら}しいことば ④ — Động từ (nghe, mua, làm, học)', {
      anh: ['headphone', 'shopping-bags', 'tennis', 'writing-hand'],
      nhan: ['{聞|き}きます', '{買|か}います', 'します', '{勉強|べんきょう}します'],
      ghi: 'します = làm / chơi: テニスをします, アルバイトをします. 勉強します = học. 聞きます vừa là "nghe" vừa là "hỏi".',
    }),
    S('{新|あたら}しいことば ⑤ — Động từ (đi, về, làm việc, ngủ dậy)', {
      anh: ['person-walking', 'house', 'man-office-worker', 'alarm-clock'],
      nhan: ['{行|い}きます', '{帰|かえ}ります', '{働|はたら}きます', '{起|お}きます'],
      j: ['{来|き}ます、 {寝|ね}ます'],
      ghi: '行きます = đi (ra xa người nói), 来ます = đến (về phía người nói), 帰ります = về (nhà, nước mình). 起きます = thức dậy, 寝ます = đi ngủ.',
    }),
    S('ポイント 16 — Vます (sẽ làm / thường làm)', {
      bang: B(['Dạng', 'Nghĩa', 'Ví dụ'], [
        ['Vます', 'làm / sẽ làm', '{日本語|にほんご}を{勉強|べんきょう}します'],
        ['Vますか', 'có làm không?', '{国|くに}へ{帰|かえ}りますか'],
      ]),
      j: ['{夏休|なつやす}み、 ホームステイ を します。'],
      ghi: 'Thể ます nói cả hiện tại lẫn tương lai: "nghỉ hè tôi (sẽ) ở homestay". Không cần chữ "sẽ" riêng.',
    }),
    S('ポイント 18 — N を V', {
      bang: B(['N', 'を (o)', 'V'], [
        ['ご{飯|はん}', 'を', '{食|た}べます'],
        ['コーヒー', 'を', '{飲|の}みます'],
        ['{映画|えいが}', 'を', '{見|み}ます'],
        ['{本|ほん}', 'を', '{読|よ}みます'],
        ['{音楽|おんがく}', 'を', '{聞|き}きます'],
        ['テニス', 'を', 'します'],
      ]),
      ghi: 'を đánh dấu "cái bị tác động" (ăn CÁI GÌ, xem CÁI GÌ), đọc là "o". Trật tự: N を V — động từ luôn cuối câu.',
    }),
    S('{何|なに}を しますか', {
      j: ['A： ゴールデン ウイーク、 {何|なに} を します か。', 'B： お{祭|まつ}り を {見|み}ます。', 'A： {冬休|ふゆやす}み、 {何|なに} を します か。', 'B： スキー を します。'],
      ghi: 'Trước を, 何 đọc **なに** (khác 何ですか đọc なん). Mốc thời gian (ゴールデンウイーク, 冬休み) đứng đầu câu, có dấu phẩy.',
    }),
    S('チャレンジ 1 — Lịch của trường', {
      anh: ['man-teacher', 'woman-student', 'cherry-blossom'],
      nhan: ['{本田|ほんだ}{先生|せんせい}', 'メアリー', 'お{花見|はなみ}'],
      j: [
        '{本田|ほんだ}{先生|せんせい}： {4月|しがつ} {5日|いつか} は お{花見|はなみ} です。',
        'メアリー： お{花見|はなみ}？ {何|なに} を します か。',
        '{本田|ほんだ}{先生|せんせい}： {桜|さくら} を {見|み}ます。 ジュース を {飲|の}みます。',
        'メアリー： へえ、 いい です ね。',
      ],
      ghi: 'へえ = "ồ" (ngạc nhiên thú vị), いいですね = "hay quá nhỉ" — hai câu cảm thán của Bài 3. Thầy Honda đọc lịch, học trò hỏi lại.',
    }),
    S('ポイント 17 — 〜へ {行|い}きます／{来|き}ます／{帰|かえ}ります', {
      bang: B(['Nơi', 'へ (e)', 'Động từ di chuyển'], [
        ['{海|うみ}', 'へ', '{行|い}きます'],
        ['{日本|にほん}', 'へ', '{来|き}ます'],
        ['うち', 'へ', '{帰|かえ}ります'],
      ]),
      j: ['!へ làm trợ từ đọc là **e** (giống は đọc wa)'],
      ghi: 'へ chỉ hướng đi tới, chỉ dùng với ba động từ di chuyển. 海 = biển, うち = nhà mình.',
    }),
    S('どこへ {行|い}きますか', {
      anh: ['beach-with-umbrella', 'house', 'airplane'],
      nhan: ['{海|うみ}', 'うち', '{国|くに}'],
      j: ['A： {夏休|なつやす}み、 どこ へ {行|い}きます か。', 'B： {海|うみ} へ {行|い}きます。', 'A： {冬休|ふゆやす}み、 {国|くに} へ {帰|かえ}ります か。'],
      ghi: 'どこへ = đi đâu. "Về nước" dùng 帰ります, không dùng 行きます — vì đó là nhà của mình.',
    }),
    S('{行|い}きます hay {来|き}ます?', {
      j: ['^アンナ-さん は {日曜日|にちようび}、 うち へ {来|き}ます。', '{私|わたし} は {日曜日|にちようび}、 {海|うみ} へ {行|い}きます。'],
      hoi: 'Bạn đang ở trường. Bạn Lin ngày mai sẽ đến trường. Dùng 行きます hay 来ます?',
      dap: `来ます — Lin đi về phía chỗ người nói đang ở: ${A('^リン-さん は {学校|がっこう} へ {来|き}ます。')}`,
      ghi: 'Hướng về phía mình ⇒ 来ます; rời xa chỗ mình ⇒ 行きます.',
    }),
    S('チャレンジ 2 — Nghỉ hè đi đâu?', {
      anh: ['man-student', 'woman-student'],
      nhan: ['ダニエル', 'アンナ'],
      j: [
        'ダニエル： ^アンナ-さん、 {夏休|なつやす}み、 {国|くに} へ {帰|かえ}ります か。',
        'アンナ： はい、 {帰|かえ}ります。 ^ダニエル-さん は？',
        'ダニエル： {私|わたし} は {海|うみ} へ {行|い}きます。',
        'アンナ： いい です ね。',
      ],
      ghi: 'Hỏi có/không bằng 〜ますか, đáp はい + lặp lại động từ: はい、帰ります. Không đáp はい、そうです.',
    }),
    S('ポイント 16 — Vません (không làm)', {
      bang: B(['Vます', 'Vません'], [
        ['{行|い}きます', '{行|い}き**ません**'],
        ['{食|た}べます', '{食|た}べ**ません**'],
        ['{飲|の}みます', '{飲|の}み**ません**'],
        ['します', 'し**ません**'],
        ['{来|き}ます', '{来|き}**ません**'],
      ]),
      ghi: 'Chỉ đổi đuôi ます → ません. Không có ngoại lệ ở Bài 3.',
    }),
    S('いいえ、〜ません', {
      j: ['A： {冬休|ふゆやす}み、 {国|くに} へ {帰|かえ}ります か。', 'B： いいえ、 {帰|かえ}りません。 ホームステイ を します。'],
      hoi: '「パーティーへ{行|い}きますか」 — bạn không đi. Trả lời?',
      dap: A('いいえ、 {行|い}きません。'),
      ghi: 'Giống Bài 1: いいえ rồi nói thêm điều mình sẽ làm thay vào đó.',
    }),
    S('チャレンジ 3 — {行|い}きません', {
      anh: ['man-student', 'man-office-worker'],
      nhan: ['ナタポン', 'カルロス'],
      j: [
        'ナタポン： ^カルロス-さん、 パーティー へ {行|い}きます か。',
        'カルロス： いいえ、 {行|い}きません。 アルバイト を します。',
        'ナタポン： そう です か。',
      ],
      ghi: 'アルバイト = việc làm thêm; アルバイトをします = đi làm thêm.',
    }),
    S('チャレンジ — Luyện cặp: lịch của trường', {
      bang: B(['Tháng', 'Sự kiện', 'Làm gì'], [
        ['{4月|しがつ}', 'お{花見|はなみ}', '{桜|さくら}を{見|み}ます'],
        ['{7月|しちがつ}', '{花火|はなび}', '{花火|はなび}を{見|み}ます'],
        ['{8月|はちがつ}', '{夏休|なつやす}み', '{国|くに}へ{帰|かえ}ります？'],
        ['{12月|じゅうにがつ}', 'テスト', '{勉強|べんきょう}します'],
      ]),
      hoi: 'A hỏi: 〜月は何ですか／何をしますか／国へ帰りますか; B đáp theo bảng (thật lòng với dòng 8月).',
      dap: `Ví dụ: ${A('{4月|しがつ} は {何|なん} です か。')} — ${A('お{花見|はなみ} です。')} — ${A('{何|なに} を します か。')} — ${A('{桜|さくら} を {見|み}ます。')}`,
      ghi: 'Chú ý: 何ですか đọc なん, 何をしますか đọc なに — hai câu đứng cạnh nhau trong một lượt.',
    }),
    S('まとめ — Tóm tắt Slot 17', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Làm gì', '{何|なに}をしますか。— 〜を〜ます。'],
        ['Đi đâu', 'どこへ{行|い}きますか。— 〜へ{行|い}きます。'],
        ['Có/không', '〜ますか。— はい、〜ます。／いいえ、〜ません。'],
      ]),
      ghi: 'Về nhà: học thuộc 14 động từ kèm tranh, đặt mỗi động từ một câu có を hoặc へ. Slot sau: で, に và một ngày của tôi.',
    }),
  ],
  [
    Q('「コーヒー（　）{飲|の}みます。」', 'を', 'へ | で | は', 'N を V (ポイント 18).'),
    Q('「{海|うみ}（　）{行|い}きます。」', 'へ', 'を | の | と', '〜へ行きます (ポイント 17).'),
    Q('へ (trợ từ) đọc là:', 'e', 'he | wa | o', 'へ chỉ hướng đọc e.'),
    Q('Phủ định của {食|た}べます:', '{食|た}べません', '{食|た}べじゃありません | {食|た}べないです | {食|た}べますん', 'ます → ません.'),
    Q('「{何|なに}をしますか」 — 何 đọc là:', 'なに', 'なん | なで | いつ', 'Trước を đọc なに.'),
    Q('"Về nước" là:', '{国|くに}へ{帰|かえ}ります', '{国|くに}へ{来|き}ます | {国|くに}を{行|い}きます | {国|くに}で{帰|かえ}ります', 'Về nơi của mình ⇒ 帰ります; hướng ⇒ へ.'),
    Q('「パーティーへ{行|い}きますか。」 (không đi)', 'いいえ、{行|い}きません。', 'いいえ、{行|い}きます。 | はい、{行|い}きません。 | いいえ、パーティーじゃありません。', 'いいえ + Vません.'),
  ],
);

/* ── Slot 18 (tiết 52–54): ST2 チャレンジ4 〜で + やってみよう · ST3 チャレンジ1 Vます(習慣) · 2–4 や〜など, 何も, 〜に ── */
const B3_SLOT18 = SLOT(
  3, '18', 'de-moi-ngay-ni-ya-nanimo',
  'Bài 3 ST2–ST3: 〜で (nơi làm) · 毎日 · 〜に (mốc giờ) · や〜など · 何も〜ません',
  'Nói làm việc gì ở đâu bằng で, kể thói quen hằng ngày với mốc giờ に, liệt kê vài món bằng や〜など và nói "không … gì cả" bằng 何も〜ません.',
  [
    '**ポイント 20 — 〜で V** (nơi diễn ra hành động) · phân biệt へ / で.',
    '**やってみよう ST2**: nói kế hoạch kỳ nghỉ (へ・を・で).',
    '**ST3 どんな毎日？** — 毎朝 · 毎晩 · 毎日 · từ ăn uống (朝ご飯, 昼ごはん, 牛乳, 果物, サラダ, チーズ, お弁当) · 新聞 · テレビ · インターネット.',
    '**ポイント 19 — 〜に** (6時に起きます; 毎朝・今 không có に) · **ポイント 22 — N1 や N2 など** · **ポイント 23 — 何も〜ません**.',
  ],
  'JPD113 · Bài 3 スケジュール · Slot 18',
  [
    S('{第3課|だいさんか} — Slot 18: で · {毎日|まいにち} · に · や · {何|なに}も', {
      anh: ['books', 'sunrise', 'alarm-clock'],
      nhan: ['{図書館|としょかん}で', '{毎朝|まいあさ}', '{6時|ろくじ}に'],
      j: ['!Hôm nay: **làm ở đâu · mỗi ngày làm gì · mấy giờ · liệt kê · không gì cả**'],
      ghi: 'Ba trợ từ mới (で, に, や) và một mẫu phủ định (何も). Học xong bạn kể được một ngày của mình.',
    }),
    S('{復習|ふくしゅう} — を・へ・ません', {
      hoi: '「{夏休|なつやす}み、どこへ{行|い}きますか。{何|なに}をしますか。」 — trả lời về bạn.',
      dap: `Ví dụ: ${A('{海|うみ} へ {行|い}きます。 {花火|はなび} を {見|み}ます。')}`,
      j: ['!へ = đi đâu · を = làm cái gì'],
      ghi: 'Hai trợ từ của buổi trước. Hôm nay thêm で = làm Ở ĐÂU.',
    }),
    S('ポイント 20 — 〜で V (làm ở đâu)', {
      bang: B(['Nơi', 'で', 'N を V'], [
        ['{図書館|としょかん}', 'で', '{本|ほん}を{読|よ}みます'],
        ['{公園|こうえん}', 'で', 'テニスをします'],
        ['コンビニ', 'で', 'アルバイトをします'],
        ['うち', 'で', '{映画|えいが}を{見|み}ます'],
      ]),
      ghi: 'で đánh dấu nơi hành động DIỄN RA. 公園 = công viên. Trật tự hay gặp: nơi で + N を + V.',
    }),
    S('へ hay で?', {
      bang: B(['へ', 'で'], [
        ['đi TỚI đâu (hướng)', 'làm việc Ở đâu (hành động)'],
        ['{図書館|としょかん}**へ**{行|い}きます', '{図書館|としょかん}**で**{勉強|べんきょう}します'],
      ]),
      hoi: 'Điền: 「{公園|こうえん}（　）テニスをします。」 và 「{公園|こうえん}（　）{行|い}きます。」',
      dap: 'で (chơi tennis Ở công viên) · へ (đi TỚI công viên)',
      ghi: 'Mẹo: động từ là 行きます／来ます／帰ります ⇒ へ; các động từ hành động khác ⇒ で.',
    }),
    S('チャレンジ 4 — {日曜日|にちようび}、{何|なに}をしますか', {
      anh: ['woman-student', 'man-student'],
      nhan: ['ワン', 'マルコ'],
      j: [
        'ワン： ^マルコ-さん、 {日曜日|にちようび}、 {何|なに} を します か。',
        'マルコ： {公園|こうえん} で サッカー を します。',
        'ワン： へえ。 {私|わたし} は {図書館|としょかん} で {勉強|べんきょう} します。',
      ],
      ghi: 'Hai câu trả lời cùng khuôn "nơi で + việc". 勉強します không cần を khi đứng một mình.',
    }),
    S('やってみよう ST2 — Kế hoạch kỳ nghỉ', {
      anh: ['beach-with-umbrella', 'house-with-garden'],
      nhan: ['{海|うみ}', 'ホームステイ'],
      hoi: 'Nói kế hoạch nghỉ của bạn: đi đâu (へ), ở đó làm gì (で〜を).',
      dap: `Ví dụ: ${A('{夏休|なつやす}み、 {日本|にほん} へ {行|い}きます。 {日本|にほん} で ホームステイ を します。')}`,
      ghi: 'Bài nói kế hoạch là dạng câu hỏi thi nói Lesson 3. Hai câu đủ ý: 〜へ行きます + 〜で〜をします.',
    }),
    S('ST3 どんな{毎日|まいにち}？ — Mỗi ngày của bạn', {
      anh: ['sunrise', 'bento-box', 'night-with-stars'],
      nhan: ['{毎朝|まいあさ}', '{毎日|まいにち}', '{毎晩|まいばん}'],
      j: ['!ST3: kể **sinh hoạt hằng ngày** — mấy giờ dậy, ăn gì, học ở đâu, tối làm gì'],
      ghi: '毎 = mỗi: 毎朝 mỗi sáng, 毎日 mỗi ngày, 毎晩 mỗi tối. Ba từ này không cần trợ từ đi sau.',
    }),
    S('{新|あたら}しいことば — Ăn uống', {
      anh: ['glass-of-milk', 'grapes', 'green-salad', 'cheese-wedge'],
      nhan: ['{牛乳|ぎゅうにゅう}', '{果物|くだもの}', 'サラダ', 'チーズ'],
      j: ['{朝|あさ}ご{飯|はん}、 {昼|ひる}ごはん、 お{弁当|べんとう}'],
      ghi: '朝ご飯 = bữa sáng, 昼ごはん = bữa trưa (ご飯 ở đây là "bữa ăn"). お弁当 = cơm hộp. 果物 = trái cây nói chung.',
    }),
    S('{新|あたら}しいことば — Giải trí trong nhà', {
      anh: ['television', 'newspaper', 'laptop', 'dvd'],
      nhan: ['テレビ', '{新聞|しんぶん}', 'インターネット', 'DVD'],
      j: ['CD、 お{酒|さけ}、 すし'],
      ghi: 'インターネットをします = lên mạng. テレビを見ます, 新聞を読みます, CDを聞きます — mỗi từ có động từ riêng.',
    }),
    S('ポイント 16 — Vます chỉ thói quen', {
      j: ['{毎朝|まいあさ} {牛乳|ぎゅうにゅう} を {飲|の}みます。', '{毎晩|まいばん} インターネット を します。', '{毎日|まいにち} {日本語|にほんご} を {勉強|べんきょう} します。'],
      ghi: 'Cùng thể ます như buổi trước, nhưng đi với 毎〜 thì là thói quen. Tiếng Nhật không đổi đuôi giữa "thường làm" và "sẽ làm".',
    }),
    S('ポイント 19 — 〜に (mốc giờ, ngày)', {
      bang: B(['Có に', 'Không に'], [
        ['〜{時|じ}に · 〜{時半|じはん}に', '{今|いま} · {毎朝|まいあさ} · {毎日|まいにち} · {毎晩|まいばん}'],
        ['〜{月|がつ}〜{日|にち}に', '{朝|あさ} · {昼|ひる} · {夜|よる} (thường không)'],
        ['{日曜日|にちようび}（に）', '— (thứ: có hay không đều được)'],
      ]),
      j: ['{6時|ろくじ} に {起|お}きます。'],
      ghi: 'Mốc có SỐ (giờ, ngày) ⇒ có に. Từ chỉ thời gian chung chung (今, 毎朝, 朝) ⇒ không に.',
    }),
    S('{何時|なんじ}に〜ますか', {
      anh: ['alarm-clock', 'sleeping-face'],
      nhan: ['{起|お}きます', '{寝|ね}ます'],
      j: [
        'A： {毎朝|まいあさ} {何時|なんじ} に {起|お}きます か。',
        'B： {6時半|ろくじはん} に {起|お}きます。',
        'A： {毎晩|まいばん} {何時|なんじ} に {寝|ね}ます か。',
        'B： {11時|じゅういちじ} に {寝|ね}ます。',
      ],
      ghi: 'Câu hỏi thi nói gần như chắc chắn có: 毎朝何時に起きますか. Trả lời đủ câu có に.',
    }),
    S('ポイント 22 — N1 や N2 など', {
      bang: B(['N1', 'や', 'N2', 'など', 'Nghĩa'], [['パン', 'や', '{果物|くだもの}', 'など', 'bánh mì, trái cây, v.v.']]),
      j: ['{朝|あさ} パン や {果物|くだもの} など を {食|た}べます。'],
      ghi: 'や〜など = kể VÀI ví dụ tiêu biểu, ngầm hiểu còn thứ khác. など có thể bỏ.',
    }),
    S('と hay や?', {
      bang: B(['と (Bài 1)', 'や〜など'], [
        ['kể HẾT', 'kể VÀI cái tiêu biểu'],
        ['パン**と**{牛乳|ぎゅうにゅう}', 'パン**や**{果物|くだもの}**など**'],
      ]),
      hoi: 'Bạn ăn sáng đúng hai món: bánh mì và trứng. Dùng と hay や?',
      dap: `と — kể đủ cả: ${A('パン と {卵|たまご} を {食|た}べます。')}`,
      ghi: 'Nếu còn món khác mà chỉ nêu ví dụ thì dùng や〜など.',
    }),
    S('ポイント 23 — {何|なに}も〜ません', {
      bang: B(['Mẫu', 'Nghĩa'], [['{何|なに}も V ません', 'không V gì cả']]),
      j: ['A： {朝|あさ}ご{飯|はん} を {食|た}べます か。', 'B： いいえ、 {何|なに} も {食|た}べません。', '!~~{何|なに}もを{食|た}べません~~ ✗'],
      ghi: '何も luôn đi với động từ PHỦ ĐỊNH, và thay luôn chỗ của を (không nói 何もを).',
    }),
    S('チャレンジ 2〜4 — Bữa sáng', {
      anh: ['woman-student', 'man-student'],
      nhan: ['{山口|やまぐち}', 'ダニエル'],
      j: [
        '{山口|やまぐち}： ^ダニエル-さん、 {毎朝|まいあさ} {何|なに} を {食|た}べます か。',
        'ダニエル： パン や {果物|くだもの} など を {食|た}べます。 ^{山口|やまぐち}-さん は？',
        '{山口|やまぐち}： {私|わたし} は {何|なに} も {食|た}べません。 コーヒー を {飲|の}みます。',
        'ダニエル： そう です か。',
      ],
      ghi: 'Đoạn này dùng đủ ba điểm mới: 毎朝 (thói quen), や〜など, 何も〜ません.',
    }),
    S('チャレンジ — Luyện cặp: một ngày', {
      bang: B(['', 'Thẻ A', 'Thẻ B'], [
        ['{起|お}きます', '6:00', '7:30'],
        ['{朝|あさ}ご{飯|はん}', 'パン・{牛乳|ぎゅうにゅう}', '— (không ăn)'],
        ['{夜|よる}', 'テレビ', '{図書館|としょかん}で{勉強|べんきょう}'],
      ]),
      hoi: 'Hỏi nhau theo thẻ: 何時に起きますか / 朝ご飯を食べますか / 夜、何をしますか.',
      dap: `Thẻ B: ${A('{7時半|しちじはん} に {起|お}きます。')} ${A('いいえ、 {何|なに} も {食|た}べません。')} ${A('{図書館|としょかん} で {勉強|べんきょう} します。')}`,
      ghi: 'Thẻ B có ô trống "không ăn" — dùng 何も〜ません. Đổi vai.',
    }),
    S('まとめ — Tóm tắt Slot 18', {
      bang: B(['Trợ từ / mẫu', 'Dùng khi', 'Ví dụ'], [
        ['で', 'nơi diễn ra hành động', '{図書館|としょかん}で{勉強|べんきょう}します'],
        ['に', 'mốc giờ, ngày', '{6時|ろくじ}に{起|お}きます'],
        ['や〜など', 'kể vài ví dụ', 'パンや{果物|くだもの}など'],
        ['{何|なに}も〜ません', 'không … gì cả', '{何|なに}も{食|た}べません'],
      ]),
      ghi: 'Về nhà: viết 5 câu về một ngày của bạn, dùng đủ に・で・を. Slot sau: から〜まで + động từ, どこへも và ôn Bài 3.',
    }),
  ],
  [
    Q('「{図書館|としょかん}（　）{本|ほん}を{読|よ}みます。」', 'で', 'へ | に | を', 'Nơi hành động diễn ra: で (ポイント 20).'),
    Q('「{7時|しちじ}（　）{起|お}きます。」', 'に', 'で | を | から', 'Mốc giờ: に (ポイント 19).'),
    Q('Câu nào ĐÚNG?', '{毎朝|まいあさ}コーヒーを{飲|の}みます。', '{毎朝|まいあさ}にコーヒーを{飲|の}みます。 | {毎朝|まいあさ}でコーヒーを{飲|の}みます。 | {毎朝|まいあさ}コーヒーで{飲|の}みます。', '毎朝 không đi với に.'),
    Q('「{朝|あさ}ご{飯|はん}を{食|た}べますか。」 (không ăn gì)', 'いいえ、{何|なに}も{食|た}べません。', 'いいえ、{何|なに}も{食|た}べます。 | いいえ、{何|なに}もを{食|た}べません。 | はい、{何|なに}も{食|た}べません。', '何も + phủ định, không kèm を.'),
    Q('"Tôi ăn bánh mì, trái cây v.v."', 'パンや{果物|くだもの}などを{食|た}べます。', 'パンと{果物|くだもの}などを{食|た}べます。 | パンや{果物|くだもの}をなど{食|た}べます。 | パンも{果物|くだもの}など{食|た}べます。', 'N1 や N2 など を V (ポイント 22).'),
    Q('「{公園|こうえん}（　）{行|い}きます。」', 'へ', 'で | を | の', 'Đi tới ⇒ へ.'),
  ],
);

/* ── Slot 19 (tiết 55–57): ST3 チャレンジ5・6 〜から〜まで V, どこへも · やってみよう · もう一度聞こう · 第3課復習 ── */
const B3_SLOT19 = SLOT(
  3, '19', 'kara-made-v-dokoemo-on-bai-3',
  'Bài 3 ST3: 〜から〜まで V · どこ(へ)も〜ません · một ngày của tôi · ôn Bài 3',
  'Nói làm việc gì "từ … đến …", nói "không đi đâu cả", kể liền một đoạn về một ngày của mình, và ôn đủ ポイント 16–23 trước Bài kiểm tra 2.',
  [
    '**ポイント 21 + động từ**: 9時から5時まで働きます (không cần に).',
    '**ポイント 23 — どこ(へ)も 行きません** · so sánh với 何も〜ません.',
    '**やってみよう ST3**: kể "một ngày của tôi" theo bảng giờ; nói liền một đoạn 6–7 câu.',
    '**第3課 復習**: もう一度聞こう, bảng ポイント 16–23, bảng trợ từ, 宿題確認 (sửa câu sai).',
    'Báo trước **Slot 20 — Bài kiểm tra 2 (Bài 2 + Bài 3)** và ôn cuối kỳ.',
  ],
  'JPD113 · Bài 3 スケジュール · Slot 19',
  [
    S('{第3課|だいさんか} — Slot 19: 〜から〜まで V · どこへも · {復習|ふくしゅう}', {
      anh: ['man-office-worker', 'house', 'check-mark-button'],
      nhan: ['{9時|くじ}から{5時|ごじ}まで', 'どこへも{行|い}きません', '{復習|ふくしゅう}'],
      j: ['!Hôm nay: **hai mẫu cuối của Bài 3 · một ngày của tôi · ôn cả bài**'],
      ghi: 'Buổi khép lại Bài 3 và cả phần ngữ pháp của Nhật 1. Slot sau là bài kiểm tra 2 rồi ôn thi.',
    }),
    S('{復習|ふくしゅう} — に・で・や・{何|なに}も', {
      j: ['A： {毎朝|まいあさ} {何時|なんじ} に {起|お}きます か。', 'A： {朝|あさ}ご{飯|はん} を {食|た}べます か。'],
      hoi: 'Trả lời hai câu về bạn.',
      dap: `Ví dụ: ${A('{6時|ろくじ} に {起|お}きます。')} ${A('パン や {卵|たまご} など を {食|た}べます。')} / ${A('いいえ、 {何|なに} も {食|た}べません。')}`,
      ghi: 'Giờ có số ⇒ に. Ăn vài món ⇒ や〜など; không ăn ⇒ 何も〜ません.',
    }),
    S('ポイント 21 — 〜から〜まで V', {
      bang: B(['〜から', '〜まで', 'V'], [
        ['{9時|くじ}から', '{5時|ごじ}まで', '{働|はたら}きます'],
        ['{月曜日|げつようび}から', '{金曜日|きんようび}まで', '{勉強|べんきょう}します'],
      ]),
      j: ['{9時|くじ} から {5時|ごじ} まで {働|はたら}きます。', '!~~{9時|くじ}にから~~ ✗ — から／まで không đi với に'],
      ghi: 'Slot 16 dùng から〜まで với です; nay ghép thẳng với động từ. Không thêm に trước から hay まで.',
    }),
    S('〜から〜まで V — Ví dụ', {
      anh: ['school', 'convenience-store'],
      nhan: ['{授業|じゅぎょう}', 'アルバイト'],
      j: [
        'A： {授業|じゅぎょう} は {何時|なんじ} から {何時|なんじ} まで です か。',
        'B： {8時|はちじ} から {12時|じゅうにじ} まで です。',
        'A： {何時|なんじ} から {何時|なんじ} まで アルバイト を します か。',
        'B： {夜|よる} {6時|ろくじ} から {10時|じゅうじ} まで します。',
      ],
      ghi: '授業 = giờ học. Câu hỏi về giờ học, giờ làm thêm là dạng hay gặp trong thi nói Lesson 3.',
    }),
    S('ポイント 23 — どこ(へ)も {行|い}きません', {
      bang: B(['Mẫu', 'Nghĩa'], [['どこ（へ）も {行|い}きません', 'không đi đâu cả']]),
      j: ['A： {日曜日|にちようび}、 どこ へ {行|い}きます か。', 'B： どこ へ も {行|い}きません。 うち で テレビ を {見|み}ます。'],
      ghi: 'Giống 何も: từ hỏi + も + động từ phủ định = "không … nào cả". へ có thể bỏ: どこも行きません.',
    }),
    S('{何|なに}も hay どこへも?', {
      bang: B(['Mẫu', 'Đi với', 'Nghĩa'], [
        ['{何|なに}も〜ません', '{食|た}べません・{飲|の}みません・しません・{買|か}いません', 'không … gì cả'],
        ['どこ（へ）も〜ません', '{行|い}きません・{帰|かえ}りません', 'không đi đâu cả'],
      ]),
      hoi: '"Chủ Nhật tôi không mua gì cả" nói thế nào?',
      dap: A('{日曜日|にちようび}、 {何|なに} も {買|か}いません。'),
      ghi: 'Hỏi CÁI GÌ (何を) ⇒ đáp 何も; hỏi ĐI ĐÂU (どこへ) ⇒ đáp どこへも.',
    }),
    S('チャレンジ 5・6 — Một tuần của Carlos', {
      anh: ['woman-student', 'man-office-worker'],
      nhan: ['リン', 'カルロス'],
      j: [
        'リン： ^カルロス-さん は {毎日|まいにち} {何時|なんじ} から {何時|なんじ} まで {働|はたら}きます か。',
        'カルロス： {9時|くじ} から {6時|ろくじ} まで {働|はたら}きます。',
        'リン： {土曜日|どようび} は？',
        'カルロス： {休|やす}み です。 どこ へ も {行|い}きません。 うち で {新聞|しんぶん} を {読|よ}みます。',
      ],
      ghi: 'Ghép đủ: から〜まで + V, どこへも, で, を. 土曜日は？ = hỏi rút gọn "còn thứ Bảy?".',
    }),
    S('やってみよう ST3 — {私|わたし}の{1日|いちにち}', {
      bang: B(['Giờ', 'Việc'], [
        ['6:30', '{起|お}きます'],
        ['7:00', '{朝|あさ}ご{飯|はん}を{食|た}べます (パン・{牛乳|ぎゅうにゅう})'],
        ['8:00〜12:00', '{学校|がっこう}で{勉強|べんきょう}します'],
        ['1:00〜5:00', '{図書館|としょかん}で{本|ほん}を{読|よ}みます'],
        ['6:00〜10:00', 'コンビニでアルバイトをします'],
        ['12:00', '{寝|ね}ます'],
      ]),
      hoi: 'Kể lại ngày của bạn theo bảng, mỗi dòng một câu.',
      dap: `${A('{6時半|ろくじはん} に {起|お}きます。')} ${A('{8時|はちじ} から {12時|じゅうにじ} まで {学校|がっこう} で {勉強|べんきょう} します。')} …`,
      ghi: '1日 (いちにち) = một ngày. Dòng có một mốc giờ ⇒ に; dòng có khoảng giờ ⇒ から〜まで.',
    }),
    S('Nói liền một đoạn — {私|わたし}の{毎日|まいにち}', {
      j: [
        '{私|わたし} は {毎朝|まいあさ} {6時|ろくじ} に {起|お}きます。',
        '{朝|あさ}ご{飯|はん} は パン や {果物|くだもの} など を {食|た}べます。',
        '{8時|はちじ} から {12時|じゅうにじ} まで {学校|がっこう} で {勉強|べんきょう} します。',
        '{午後|ごご} は {図書館|としょかん} へ {行|い}きます。',
        '{夜|よる} は うち で テレビ を {見|み}ます。 {11時|じゅういちじ} に {寝|ね}ます。',
      ],
      ghi: 'Đoạn mẫu dùng đủ に, から〜まで, で, へ, を, や〜など. Thay giờ và việc của bạn, nói trơn trong 40 giây.',
    }),
    S('もう{一度|いちど}{聞|き}こう — Ôn hội thoại Bài 3', {
      anh: ['man-student', 'woman-student'],
      nhan: ['マルコ', 'メアリー'],
      j: [
        'マルコ： すみません、 {図書館|としょかん} は {何時|なんじ} まで です か。',
        'メアリー： {8時|はちじ} まで です。 {休|やす}み は {水曜日|すいようび} です。',
        'マルコ： そう です か。 ^メアリー-さん は {毎日|まいにち} {図書館|としょかん} へ {行|い}きます か。',
        'メアリー： はい。 {図書館|としょかん} で {日本語|にほんご} を {勉強|べんきょう} します。',
        'マルコ： {日曜日|にちようび} も？',
        'メアリー： いいえ、 {日曜日|にちようび} は どこ へ も {行|い}きません。',
      ],
      ghi: 'Đoạn ôn gói ST1 (giờ, ngày nghỉ), ST2 (へ, で, を) và ST3 (毎日, どこへも). Nghe đến khi hiểu không cần chữ.',
    }),
    S('{第3課|だいさんか} {復習|ふくしゅう} — ポイント 16–23', {
      bang: B(['ポイント', 'Mẫu', 'Ví dụ'], [
        ['16', 'Vます／Vません', '{行|い}きます・{行|い}きません'],
        ['17', '〜へ {行|い}きます／{来|き}ます／{帰|かえ}ります', '{国|くに}へ{帰|かえ}ります'],
        ['18', 'N を V', '{本|ほん}を{読|よ}みます'],
        ['19', '〜に V (mốc giờ)', '{6時|ろくじ}に{起|お}きます'],
        ['20', '〜で V (nơi làm)', '{図書館|としょかん}で{勉強|べんきょう}します'],
        ['21', '〜から〜まで', '{9時|くじ}から{5時|ごじ}まで'],
        ['22', 'N1 や N2 など', 'パンや{果物|くだもの}など'],
        ['23', '{何|なに}も／どこ（へ）も〜ません', '{何|なに}も{食|た}べません'],
      ]),
      ghi: 'Tám mẫu của Bài 3. Bài 3 khó vì có nhiều trợ từ — slide sau gom tất cả trợ từ đã học.',
    }),
    S('Tám trợ từ của Bài 3 (+ Bài 1)', {
      bang: B(['Trợ từ', 'Vai trò', 'Ví dụ'], [
        ['を (o)', 'cái bị tác động', 'コーヒーを{飲|の}みます'],
        ['へ (e)', 'hướng tới', '{海|うみ}へ{行|い}きます'],
        ['に', 'mốc giờ / ngày', '{7時|しちじ}に{起|お}きます'],
        ['で', 'nơi hành động', 'うちで{寝|ね}ます'],
        ['から／まで', 'từ / đến', '{9時|くじ}から{5時|ごじ}まで'],
        ['や〜など', 'kể vài ví dụ', 'パンや{果物|くだもの}など'],
        ['も', 'cũng / (何も = không gì)', '{何|なに}も{食|た}べません'],
        ['は・の・と', 'chủ đề · của · và (Bài 1)', '{私|わたし}の{趣味|しゅみ}は…'],
      ]),
      ghi: 'Trật tự một câu đầy đủ: (thời gian に) + (nơi で) + (N を) + V. Ví dụ: 7時に うちで ご飯を 食べます.',
    }),
    S('{宿題確認|しゅくだいかくにん} — Sửa câu sai', {
      j: [
        '!① ~~{毎朝|まいあさ}に{6時|ろくじ}に{起|お}きます。~~',
        '!② ~~{図書館|としょかん}へ{勉強|べんきょう}します。~~',
        '!③ ~~{何|なに}もを{飲|の}みません。~~',
        '!④ ~~{日曜日|にちようび}、どこを{行|い}きません。~~',
      ],
      hoi: 'Sửa bốn câu.',
      dap: '① {毎朝|まいあさ}{6時|ろくじ}に{起|お}きます。 ② {図書館|としょかん}で{勉強|べんきょう}します。 ③ {何|なに}も{飲|の}みません。 ④ {日曜日|にちようび}、どこ（へ）も{行|い}きません。',
      ghi: 'Bốn lỗi điển hình của Bài 3: に sau 毎朝, へ thay cho で, 何もを, どこを.',
    }),
    S('Bài kiểm tra 2 (Slot 20) — phạm vi', {
      bang: B(['Phần', 'Nội dung'], [
        ['Bài 2', 'こ・そ・あ・ど · 〜階 · số và giá · 〜つ · {何|なん}の／どこの／だれの · 〜{語|ご}で'],
        ['Bài 3', 'giờ · thứ · 〜ます／ません · を・へ・に・で・から・まで・や・{何|なに}も・どこへも'],
        ['Chữ Hán', 'Bài 2: 一〜十 百 千 万 円 · Bài 3: 月 火 水 木 金 土 日 曜 何 年 時 間 分'],
      ]),
      ghi: 'Phạm vi theo đề cương: "Bài kiểm tra 2 (bài 2, bài 3)"; sau đó là ôn thi cuối kỳ. Dùng ba bộ "Slide tổng hợp" để ôn.',
    }),
    S('Cô hay gọi — câu hỏi thi nói Lesson 3', {
      j: ['A： {毎朝|まいあさ} {何時|なんじ} に {起|お}きます か。', 'A： {日曜日|にちようび}、 {何|なに} を します か。', 'A： {学校|がっこう} は {何時|なんじ} から {何時|なんじ} まで です か。'],
      hoi: 'Trả lời ba câu bằng câu đầy đủ.',
      dap: `Ví dụ: ${A('{6時半|ろくじはん} に {起|お}きます。')} · ${A('{公園|こうえん} で テニス を します。')} · ${A('{8時|はちじ} から {12時|じゅうにじ} まで です。')}`,
      ghi: 'Giám khảo hay hỏi về giờ dậy, ngày nghỉ, giờ học. Trả lời đủ câu (có trợ từ + động từ) mới được điểm ngữ pháp.',
    }),
    S('まとめ — Tóm tắt Slot 19', {
      bang: B(['Muốn nói', 'Câu'], [
        ['Làm từ … đến …', '{9時|くじ}から{5時|ごじ}まで{働|はたら}きます。'],
        ['Không đi đâu', 'どこ（へ）も{行|い}きません。'],
        ['Không làm gì', '{何|なに}もしません。'],
        ['Một ngày', '〜に{起|お}きます。〜で〜を〜ます。'],
      ]),
      ghi: 'Về nhà: viết và nói đoạn "Một ngày của tôi" 6 câu, đọc lại ba bộ slide tổng hợp. Slot 20: Bài kiểm tra 2 + ôn thi.',
    }),
  ],
  [
    Q('「{9時|くじ}から{5時|ごじ}まで（　）。」', '{働|はたら}きます', '{働|はたら}きにます | に{働|はたら}きます | を{働|はたら}きます', 'から〜まで + V, không cần trợ từ khác.'),
    Q('「{日曜日|にちようび}、どこへ{行|い}きますか。」 (không đi đâu)', 'どこへも{行|い}きません。', '{何|なに}も{行|い}きません。 | どこへも{行|い}きます。 | どこを{行|い}きません。', 'どこ(へ)も + phủ định (ポイント 23).'),
    Q('Câu nào ĐÚNG?', '{7時|しちじ}にうちでご{飯|はん}を{食|た}べます。', '{7時|しちじ}でうちにご{飯|はん}を{食|た}べます。 | {7時|しちじ}にうちへご{飯|はん}を{食|た}べます。 | {7時|しちじ}をうちでご{飯|はん}に{食|た}べます。', 'giờ に · nơi で · N を · V.'),
    Q('{授業|じゅぎょう} là:', 'giờ học, tiết học', 'việc làm thêm | bài kiểm tra | kỳ nghỉ', '授業 = giờ học.'),
    Q('「{何|なに}も（　）。」', '{飲|の}みません', '{飲|の}みます | {飲|の}みましょう | {飲|の}みますか', '何も luôn đi với phủ định.'),
    Q('Trợ từ chỉ "nơi hành động diễn ra":', 'で', 'へ | に | を', 'で = nơi làm.'),
  ],
);

/* ── Slide tổng hợp Bài 3 ── */
const B3_TONG_HOP = TONG_HOP(
  3,
  'Có bộ slide "bản tóm tắt thi" của Bài 3: 80 từ của danh sách cô gom nhóm (thời gian, nơi chốn, lịch, sự kiện – mùa, ăn uống – giải trí, 14 động từ), bảng giờ – phút – thứ, và tám ポイント 16–23.',
  [
    '**Phần 1 — Từ vựng theo nhóm** (có tranh): thời gian · nơi chốn · trường & lịch · sự kiện & mùa · ăn uống · giải trí · 14 động từ · từ hỏi & cảm thán.',
    '**Phần 2 — Giờ, phút, thứ**: bảng đọc + các chỗ đổi âm.',
    '**Phần 3 — ポイント 16–23**: mỗi điểm một ô công thức + ví dụ; bảng へ／で／に; trật tự câu; đoạn "một ngày của tôi".',
    'Giải thích kỹ nằm ở các deck **Slot 15–19** của Bài 3.',
  ],
  'JPD113 · Bài 3 スケジュール · Slide tổng hợp',
  [
    S('{第3課|だいさんか} スケジュール — Tổng hợp', {
      anh: ['alarm-clock', 'spiral-calendar', 'sunrise'],
      nhan: ['{何時|なんじ}？', 'スケジュール', '{毎日|まいにち}'],
      j: ['!Phần 1: từ vựng · Phần 2: giờ – phút – thứ · Phần 3: ポイント 16–23'],
      ghi: 'Bài 3 nhiều từ nhất Nhật 1 (80 từ). Học theo nhóm, mỗi nhóm gắn với một câu hỏi thi nói.',
    }),
    S('ことば ① — Thời gian', {
      anh: ['sunrise', 'sun', 'night-with-stars', 'alarm-clock'],
      nhan: ['{朝|あさ}', '{昼|ひる}', '{夜|よる}', '{今|いま}'],
      j: ['{午前|ごぜん}、 {午後|ごご}、 {時間|じかん}、 〜{時|じ}、 〜{分|ふん}、 〜{時半|じはん}、 〜{曜日|ようび}'],
      ghi: '午前／午後 đứng trước giờ. 時間 = thời gian, giờ giấc.',
    }),
    S('ことば ② — Mỗi …', {
      bang: B(['Từ', 'Đọc', 'Nghĩa'], [
        ['{毎日|まいにち}', 'mainichi', 'mỗi ngày'],
        ['{毎朝|まいあさ}', 'maiasa', 'mỗi sáng'],
        ['{毎晩|まいばん}', 'maiban', 'mỗi tối'],
        ['{1年|いちねん}', 'ichinen', 'một năm'],
      ]),
      ghi: '毎〜 không đi với に: 毎朝コーヒーを飲みます.',
    }),
    S('ことば ③ — Nơi công cộng', {
      anh: ['bank', 'japanese-post-office', 'hospital', 'convenience-store'],
      nhan: ['{銀行|ぎんこう}', '{郵便局|ゆうびんきょく}', '{病院|びょういん}', 'コンビニ'],
      j: ['{図書館|としょかん}、 {体育館|たいいくかん}'],
      ghi: 'Nhóm nơi hỏi giờ mở cửa (ST1).',
    }),
    S('ことば ④ — Nơi quen thuộc', {
      anh: ['school', 'office-building', 'house', 'beach-with-umbrella'],
      nhan: ['{学校|がっこう}', '{会社|かいしゃ}', 'うち', '{海|うみ}'],
      j: ['{公園|こうえん}'],
      ghi: 'Nhóm nơi đi tới (へ) và nơi làm việc (で). うち = nhà mình.',
    }),
    S('ことば ⑤ — Trường học & lịch', {
      bang: B(['Từ', 'Đọc', 'Nghĩa'], [
        ['{授業|じゅぎょう}', 'jugyou', 'giờ học'],
        ['テスト', 'tesuto', 'bài kiểm tra'],
        ['{休|やす}み', 'yasumi', 'ngày nghỉ, kỳ nghỉ'],
        ['スケジュール', 'sukejuuru', 'lịch trình'],
        ['アルバイト', 'arubaito', 'việc làm thêm'],
        ['{留学生|りゅうがくせい}', 'ryuugakusei', 'du học sinh'],
      ]),
      ghi: '休み ghép với mùa: 夏休み, 冬休み.',
    }),
    S('ことば ⑥ — Sự kiện', {
      anh: ['cherry-blossom', 'fireworks', 'party-popper', 'skier'],
      nhan: ['お{花見|はなみ}・{桜|さくら}', '{花火|はなび}', 'パーティー', 'スキー'],
      j: ['バーベキュー、 お{祭|まつ}り、 ホームステイ、 バス'],
      ghi: 'Sự kiện trong lịch cả năm (ST2).',
    }),
    S('ことば ⑦ — Mùa', {
      anh: ['cherry-blossom', 'sun', 'fallen-leaf', 'snowman'],
      nhan: ['{春|はる}', '{夏|なつ}', '{秋|あき}', '{冬|ふゆ}'],
      j: ['ゴールデン ウイーク'],
      ghi: 'ゴールデンウイーク = chuỗi nghỉ cuối tháng 4 – đầu tháng 5.',
    }),
    S('ことば ⑧ — Ăn uống', {
      anh: ['glass-of-milk', 'grapes', 'green-salad', 'cheese-wedge'],
      nhan: ['{牛乳|ぎゅうにゅう}', '{果物|くだもの}', 'サラダ', 'チーズ'],
      j: ['{朝|あさ}ご{飯|はん}、 {昼|ひる}ごはん'],
      ghi: 'Nhóm ăn sáng – ăn trưa (ST3).',
    }),
    S('ことば ⑨ — Ăn uống ②', {
      anh: ['bento-box', 'sushi', 'sake'],
      nhan: ['お{弁当|べんとう}', 'すし', 'お{酒|さけ}'],
      ghi: 'お弁当 = cơm hộp; お酒 = rượu (Nhật).',
    }),
    S('ことば ⑩ — Giải trí', {
      anh: ['television', 'newspaper', 'laptop', 'dvd'],
      nhan: ['テレビ', '{新聞|しんぶん}', 'インターネット', 'DVD'],
      j: ['CD'],
      ghi: 'テレビを見ます · 新聞を読みます · インターネットをします · CDを聞きます.',
    }),
    S('ことば ⑪ — Động từ ①', {
      anh: ['fork-and-knife', 'hot-beverage', 'television', 'open-book'],
      nhan: ['{食|た}べます', '{飲|の}みます', '{見|み}ます', '{読|よ}みます'],
      ghi: 'Bốn động từ đi với を.',
    }),
    S('ことば ⑫ — Động từ ②', {
      anh: ['headphone', 'shopping-bags', 'tennis', 'writing-hand'],
      nhan: ['{聞|き}きます', '{買|か}います', 'します', '{勉強|べんきょう}します'],
      ghi: 'します = làm, chơi; 勉強します = học.',
    }),
    S('ことば ⑬ — Động từ ③', {
      anh: ['person-walking', 'house', 'man-office-worker', 'alarm-clock'],
      nhan: ['{行|い}きます', '{帰|かえ}ります', '{働|はたら}きます', '{起|お}きます'],
      j: ['{来|き}ます、 {寝|ね}ます'],
      ghi: '行きます／来ます／帰ります đi với へ. Đủ 14 động từ của Bài 3.',
    }),
    S('ことば ⑭ — Từ hỏi & cảm thán', {
      bang: B(['Từ', 'Nghĩa'], [
        ['{何|なに}', 'cái gì (trước を)'],
        ['{何|なに}も〜ません', 'không … gì cả'],
        ['どこ（へ）も〜ません', 'không đi đâu cả'],
        ['いいですね', 'hay quá nhỉ'],
        ['へえ', 'ồ (ngạc nhiên thú vị)'],
      ]),
      ghi: '何 đọc なに trước を, đọc なん trước です / đơn vị đếm.',
    }),
    S('Giờ — 〜{時|じ}', {
      bang: B(['Bẫy', 'Đọc'], [['4{時|じ}', 'よじ'], ['7{時|じ}', 'しちじ'], ['9{時|じ}', 'くじ'], ['{何時|なんじ}', 'なんじ']]),
      ghi: 'Các giờ khác: số + じ.',
    }),
    S('Phút — 〜{分|ふん}', {
      bang: B(['ぷん', 'ふん'], [['1 いっぷん · 3 さんぷん · 4 よんぷん', '2 にふん · 5 ごふん'], ['6 ろっぷん · 8 はっぷん · 10 じゅっぷん', '7 ななふん · 9 きゅうふん'], ['{何分|なんぷん}', '30 = さんじゅっぷん = {半|はん}']]),
      ghi: 'Tận cùng 1, 3, 4, 6, 8, 0 ⇒ ぷん.',
    }),
    S('Thứ — 〜{曜日|ようび}', {
      bang: B(['月', '火', '水', '木', '金', '土', '日'], [['げつ', 'か', 'すい', 'もく', 'きん', 'ど', 'にち']]),
      j: ['{何曜日|なんようび}'],
      ghi: 'Thêm ようび sau mỗi chữ. Chủ Nhật = 日曜日.',
    }),
    S('ポイント 16 — Vます／Vません', {
      bang: B(['Vます', 'Vません'], [['{行|い}きます', '{行|い}きません'], ['{食|た}べます', '{食|た}べません'], ['します', 'しません']]),
      j: ['A： {国|くに} へ {帰|かえ}ります か。', 'B： いいえ、 {帰|かえ}りません。'],
      ghi: 'Thể ます: làm / sẽ làm / thường làm. Phủ định: ません.',
    }),
    S('ポイント 17 — 〜へ {行|い}きます', {
      j: ['{夏休|なつやす}み、 {海|うみ} へ {行|い}きます。', 'どこ へ {行|い}きます か。'],
      ghi: 'へ (e) chỉ hướng, đi với 行きます／来ます／帰ります.',
    }),
    S('ポイント 18 — N を V', {
      j: ['{毎晩|まいばん} {音楽|おんがく} を {聞|き}きます。', '{何|なに} を します か。'],
      ghi: 'を (o) đánh dấu đối tượng.',
    }),
    S('ポイント 19 — 〜に (mốc giờ)', {
      j: ['{6時半|ろくじはん} に {起|お}きます。', '{何時|なんじ} に {寝|ね}ます か。', '!~~{毎朝|まいあさ}に~~ ✗ · ~~{今|いま}に~~ ✗'],
      ghi: 'Có số ⇒ に; 今, 毎〜, 朝/昼/夜 ⇒ không に.',
    }),
    S('ポイント 20 — 〜で (nơi làm)', {
      j: ['{図書館|としょかん} で {勉強|べんきょう} します。', 'コンビニ で アルバイト を します。'],
      ghi: 'で = nơi hành động diễn ra.',
    }),
    S('へ・で・に — phân biệt', {
      bang: B(['Trợ từ', 'Câu hỏi tương ứng', 'Ví dụ'], [
        ['へ', 'đi ĐÂU?', '{学校|がっこう}へ{行|い}きます'],
        ['で', 'làm Ở ĐÂU?', '{学校|がっこう}で{勉強|べんきょう}します'],
        ['に', 'LÚC MẤY GIỜ?', '{8時|はちじ}に{行|い}きます'],
      ]),
      hoi: 'Điền: 「{8時|はちじ}（　）{学校|がっこう}（　）{行|い}きます。」',
      dap: 'に · へ',
      ghi: 'Ba trợ từ hay bị nhầm nhất Bài 3. Hỏi lại "câu này trả lời câu hỏi gì?" là chọn được.',
    }),
    S('ポイント 21 — 〜から〜まで', {
      j: ['{銀行|ぎんこう} は {9時|くじ} から {3時|さんじ} まで です。', '{月曜日|げつようび} から {金曜日|きんようび} まで {働|はたら}きます。'],
      ghi: 'Dùng với です hoặc với động từ. Không thêm に.',
    }),
    S('ポイント 22 — N1 や N2 など', {
      j: ['パン や {果物|くだもの} など を {食|た}べます。'],
      hoi: 'Khác gì với パンと果物を食べます?',
      dap: 'と = kể đủ (chỉ hai món); や〜など = kể vài ví dụ (còn món khác).',
      ghi: 'など có thể bỏ.',
    }),
    S('ポイント 23 — {何|なに}も／どこ（へ）も〜ません', {
      j: ['{何|なに} も {食|た}べません。', 'どこ へ も {行|い}きません。', '!~~{何|なに}もを~~ ✗ · ~~どこを~~ ✗'],
      ghi: 'Từ hỏi + も + phủ định = "không … nào cả".',
    }),
    S('Trật tự câu Bài 3', {
      bang: B(['Thời gian', 'Nơi', 'Đối tượng', 'Động từ'], [
        ['{7時|しちじ}に', 'うちで', 'ご{飯|はん}を', '{食|た}べます。'],
        ['{日曜日|にちようび}', '{公園|こうえん}で', 'テニスを', 'します。'],
        ['{9時|くじ}から{5時|ごじ}まで', '{会社|かいしゃ}で', '—', '{働|はたら}きます。'],
      ]),
      ghi: 'Động từ luôn đứng cuối. Thời gian thường ở đầu câu.',
    }),
    S('{会話|かいわ} — Hội thoại tổng hợp', {
      anh: ['woman-student', 'man-student'],
      nhan: ['パク', 'ナタポン'],
      j: [
        'パク： ^ナタポン-さん、 {毎朝|まいあさ} {何時|なんじ} に {起|お}きます か。',
        'ナタポン： {7時|しちじ} に {起|お}きます。',
        'パク： {朝|あさ}ご{飯|はん} は？',
        'ナタポン： パン や {卵|たまご} など を {食|た}べます。',
        'パク： {日曜日|にちようび} は {何|なに} を します か。',
        'ナタポン： {何|なに} も しません。 どこ へ も {行|い}きません。',
      ],
      ghi: 'Đoạn này dùng に, や〜など, 何も, どこへも.',
    }),
    S('Đoạn mẫu — {私|わたし}の{毎日|まいにち}', {
      j: [
        '{私|わたし} は {毎朝|まいあさ} {6時|ろくじ} に {起|お}きます。',
        '{8時|はちじ} から {12時|じゅうにじ} まで {学校|がっこう} で {勉強|べんきょう} します。',
        '{午後|ごご} は コンビニ で アルバイト を します。',
        '{夜|よる} は うち で {本|ほん} を {読|よ}みます。 {12時|じゅうにじ} に {寝|ね}ます。',
        '{日曜日|にちようび} は どこ へ も {行|い}きません。',
      ],
      ghi: 'Bài nói mẫu "Một ngày của tôi" cho thi nói Lesson 3.',
    }),
    S('⚠ Lỗi hay mất điểm Bài 3', {
      bang: B(['Sai', 'Đúng'], [
        ['~~よんじ・ななじ・きゅうじ~~', 'よじ・しちじ・くじ'],
        ['~~{毎朝|まいあさ}に~~', '{毎朝|まいあさ}'],
        ['~~{図書館|としょかん}へ{勉強|べんきょう}します~~', '{図書館|としょかん}で{勉強|べんきょう}します'],
        ['~~{何|なに}もを{食|た}べません~~', '{何|なに}も{食|た}べません'],
        ['~~{国|くに}へ{行|い}きます~~ (về nước mình)', '{国|くに}へ{帰|かえ}ります'],
      ]),
      ghi: 'Năm lỗi hay bị trừ điểm nhất Bài 3.',
    }),
    S('まとめ — Bài 3 trong một slide', {
      bang: B(['Hỏi', 'Đáp mẫu'], [
        ['{今|いま}、{何時|なんじ}ですか。', '{10時|じゅうじ}{15分|じゅうごふん}です。'],
        ['〜は{何時|なんじ}から{何時|なんじ}までですか。', '{9時|くじ}から{5時|ごじ}までです。'],
        ['{休|やす}みは{何曜日|なんようび}ですか。', '{日曜日|にちようび}です。'],
        ['{毎朝|まいあさ}{何時|なんじ}に{起|お}きますか。', '{6時|ろくじ}に{起|お}きます。'],
        ['{日曜日|にちようび}、{何|なに}をしますか。', '{公園|こうえん}でテニスをします。'],
        ['{夏休|なつやす}み、どこへ{行|い}きますか。', 'どこへも{行|い}きません。'],
      ]),
      ghi: 'Sáu câu hỏi này là "đề nói" của Bài 3. Che cột phải, tự trả lời bằng thông tin của mình.',
    }),
  ],
  [
    Q('7{時|じ} đọc là:', 'しちじ', 'ななじ | しちどき | ななとき', '7時 = しちじ.'),
    Q('「{毎晩|まいばん}テレビ（　）{見|み}ます。」', 'を', 'へ | に | で', 'N を V.'),
    Q('「{8時|はちじ}（　）{寝|ね}ます。」', 'に', 'で | を | へ', 'Mốc giờ ⇒ に.'),
    Q('「うち（　）{本|ほん}を{読|よ}みます。」', 'で', 'へ | に | を', 'Nơi làm ⇒ で.'),
    Q('{土曜日|どようび} là:', 'thứ Bảy', 'thứ Sáu | Chủ Nhật | thứ Năm', '土 = đất ⇒ thứ Bảy.'),
    Q('「どこへ{行|い}きますか。」 (không đi đâu)', 'どこへも{行|い}きません。', '{何|なに}も{行|い}きません。 | どこへも{行|い}きます。 | どこも{行|い}きます。', 'どこ(へ)も + ません.'),
  ],
);

/* ══════════════ xuất ══════════════ */

/** Bài 1: Slot 7–10 + slide tổng hợp. */
export const SLIDE_113_B1: Lesson[] = [B1_SLOT07, B1_SLOT08, B1_SLOT09, B1_SLOT10, B1_TONG_HOP];
/** Bài 2: Slot 11–14 + phần Bài 2 của Slot 15 + slide tổng hợp. */
export const SLIDE_113_B2: Lesson[] = [B2_SLOT11, B2_SLOT12, B2_SLOT13, B2_SLOT14, B2_SLOT15, B2_TONG_HOP];
/** Bài 3: phần Bài 3 của Slot 15 + Slot 16–19 + slide tổng hợp. */
export const SLIDE_113_B3: Lesson[] = [B3_SLOT15, B3_SLOT16, B3_SLOT17, B3_SLOT18, B3_SLOT19, B3_TONG_HOP];
