/**
 * 🎙️ ĐỌC TO KIỂU ĐỀ THI (phần READING 40 điểm của thi nói JPD113) — Bài 1 · 2 · 3 · 4.
 *
 *   DOC_TO_B1 … DOC_TO_B4 — mỗi cái MỘT lesson `bN-doc-to` (kind `speaking`).
 *
 * Khuôn đề lấy từ "Hướng dẫn ôn tập thi nói môn JPD113" (bản 09/06/2025, cô gửi gv + sv):
 *   READING 40/100 điểm · chuẩn bị 30 giây · đọc to, không có câu hỏi đi kèm · không được đổi bài đọc.
 *   Mỗi bài đọc dài khoảng 100–110 ký tự (gồm chữ Hán):
 *     · 4 từ chữ Hán GẠCH CHÂN (không furigana; chữ Hán không gạch chân thì có furigana) — 12 điểm
 *     · 4 từ katakana — 12 điểm
 *     · 70–80 chữ hiragana — 16 điểm; đọc sai MỘT ký tự trừ 0,2 điểm
 *   Ngập ngừng: trừ không quá 5% mỗi đầu điểm.
 *
 * Mọi đoạn ở đây VIẾT MỚI theo đúng khuôn số đó (không chép đề/sách) và chỉ dùng từ + ngữ pháp của Bài 1..N.
 * Mỗi đoạn có ĐÚNG 4 từ chữ Hán (= 4 từ bị gạch chân trong đề; phần còn lại viết kana như đề mẫu), ĐÚNG 4 từ
 * katakana khác nhau, 70–80 chữ hiragana, tổng 100–110 ký tự — số liệu hiện trong bảng của từng đoạn được TÍNH
 * từ chính câu chữ (hàm `dem()`), không gõ tay, nên sửa câu là bảng tự đúng theo.
 * Cách đếm: chữ Hán + katakana (kể cả ー) + hiragana; KHÔNG tính dấu câu 、。？「」：.
 *
 * Khối `phatam` (Azure chấm phát âm ja-JP) giới hạn 200 ký tự / 20 giây một lượt ⇒ mỗi đoạn chấm theo từng
 * câu + hai nửa đoạn đọc liền; bản đọc cả đoạn không furigana nằm ở `readkanji` cuối bài.
 *
 * Câu viết bằng "DSL từ" như jp113B3.ts: từ cách nhau dấu cách, chữ Hán `{漢字|かな}`, `^` = viết hoa romaji,
 * `-` = gạch nối romaji. `J()` → chữ Nhật, `R()` → romaji (は→wa, へ→e, を→o, ー kéo dài, っ gấp đôi).
 */
import type { Block, Lesson } from '@/components/sach-hoc/types';

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

/** Một đoạn → tiêu đề + bảng đếm + mẹo + khối máy chấm. */
function khoiDoan(n: number, k: number, d: Doan): Block[] {
  const c = dem(d);
  const giua = Math.ceil(d.cau.length / 2);
  const nua = (a: [string, string][], ten: string) => ({
    text: a.map(([s]) => J(s)).join(''),
    ipa: R(a.map(([s]) => s).join(' ')),
    vi: `${ten} — đọc liền một hơi như lúc thi.`,
  });
  return [
    H(`Đoạn ${k} — ${d.ten}`),
    P(d.dang),
    TABLE(
      ['Phần chấm', 'Trong đoạn này', 'Điểm tối đa'],
      [
        ['Chữ Hán gạch chân (đề KHÔNG có furigana)', c.han.map(([w, y]) => `${w} → ${y} (${kanaToRo(y)})`).join(' · ') + ` — **${c.han.length} từ**`, '12'],
        ['Katakana', c.kata.map((w) => `${w} (${kanaToRo(w)})`).join(' · ') + ` — **${c.kata.length} từ**`, '12'],
        ['Hiragana', `**${c.hira} chữ** (sai 1 chữ −0,2)`, '16'],
        ['Cả đoạn', `**${c.tong} ký tự** = ${c.chuHan} chữ Hán + ${c.chuKata} katakana + ${c.hira} hiragana (không tính dấu câu)`, '40'],
      ],
    ),
    NOTE(`Chỗ dễ vấp trong đoạn ${k}`, d.meo),
    {
      t: 'phatam',
      id: `b${n}-doc-to-${k}`,
      title: `Đọc to & máy chấm — Đoạn ${k}: ${d.ten}`,
      note: 'Bấm "Nghe mẫu" → "Đọc & chấm" từng câu; hai dòng cuối là hai nửa đoạn đọc liền (máy chấm nhận tối đa 20 giây mỗi lượt). Từ nào máy tô đỏ → đọc riêng từ đó 5 lần rồi chấm lại cả câu.',
      items: [
        ...d.cau.map(([s, vi], i) => ({ text: J(s), ipa: R(s), vi: d.vai ? `${d.vai[i]}: ${vi}` : vi })),
        nua(d.cau.slice(0, giua), 'Nửa đầu đoạn'),
        nua(d.cau.slice(giua), 'Nửa sau đoạn'),
      ],
    },
  ];
}

/** Cả đoạn thành MỘT mục readkanji (hiện chữ trần như đề). */
const docTron = (d: Doan) => ({
  text: d.cau.map(([s], i) => cauVai(d, i, J(s))).join(''),
  ro: d.cau.map(([s], i) => (d.vai ? `${d.vai[i]}: ${R(s)}` : R(s))).join(' '),
  vi: d.cau.map(([, v]) => v).join(' '),
});

/* ═══════════════════════════════════════════════════════════════════
 *                         BÀI 1 — 6 đoạn
 * ═══════════════════════════════════════════════════════════════════ */

const DOAN_B1: Doan[] = [
  {
    ten: 'Park tự giới thiệu',
    dang: 'Dạng thường gặp nhất trong ngân hàng Reading: một người tự giới thiệu tên · nước · trường · sở thích · sinh nhật.',
    cau: [
      ['はじめまして。 {私|わたし} は ^パク です。', 'Rất vui được gặp các bạn. Tôi là Park.'],
      ['^かんこく-じん です。 じゅうきゅう-さい です。', 'Tôi là người Hàn Quốc, 19 tuổi.'],
      ['^あおぞら {日本語学校|にほんごがっこう} の がくせい です。', 'Tôi là học sinh trường tiếng Nhật Aozora.'],
      ['しゅみ は スポーツ です。 テニス と サッカー です。', 'Sở thích của tôi là thể thao: quần vợt và bóng đá.'],
      ['おんがく も しゅみ です。', 'Âm nhạc cũng là sở thích của tôi.'],
      ['たんじょうび は {四月|しがつ} {十日|とおか} です。', 'Sinh nhật tôi là ngày 10 tháng 4.'],
      ['どうぞ よろしく おねがい します。', 'Rất mong mọi người giúp đỡ.'],
    ],
    meo: [
      '**四月 = しがつ** (không よんがつ) · **十日 = とおか** (không じゅうにち) — hai bẫy số của đoạn.',
      '日本語学校 = に・ほ・ん・ご・が・っ・こ・う: có **っ** — ngắt nửa nhịp trước こう.',
      'かんこくじん ≠ ちゅうごくじん: đọc rõ **かん**.',
      'サッカー: **ッ** ngắt + **ー** kéo — sa-k-kā (4 nhịp: サ・ッ・カ・ー).',
      'じゅうきゅうさい (19 tuổi): 9 + さい đọc **きゅう**, không く — "くさい" nghĩa là "hôi"!',
    ],
  },
  {
    ten: 'Carlos — người đi làm',
    dang: 'Tự giới thiệu có tuổi và nghề + phủ định じゃありません + nói về một người khác bằng も.',
    cau: [
      ['こんにちは。 {私|わたし} は ^カルロス です。', 'Xin chào. Tôi là Carlos.'],
      ['^ブラジル-じん です。 {四十一歳|よんじゅういっさい} です。', 'Tôi là người Brazil, 41 tuổi.'],
      ['{会社員|かいしゃいん} です。 がくせい じゃ ありません。', 'Tôi là nhân viên công ty, không phải học sinh.'],
      ['しゅみ は {料理|りょうり} です。', 'Sở thích của tôi là nấu ăn.'],
      ['^ナタポン-さん は ^タイ-じん です。', 'Anh Natapon là người Thái.'],
      ['^ナタポン-さん も しゃいん です。', 'Anh Natapon cũng là nhân viên (công ty).'],
      ['^ナタポン-さん の しゅみ は えいが です。', 'Sở thích của anh Natapon là xem phim.'],
      ['どうぞ よろしく おねがい します。', 'Rất mong mọi người giúp đỡ.'],
    ],
    meo: [
      '**四十一歳 = よんじゅう・いっさい** — 一 + 歳 → いっさい (có っ), không いちさい.',
      'こんにちは: chữ cuối **は đọc wa** (konnichiwa) — đọc "ha" là −0,2.',
      'じゃ ありません: đọc liền **じゃありません** (ja arimasen), không ngắt giữa じゃ và ありません.',
      'しゃいん (sha-i-n, 3 nhịp) — âm ghép しゃ một nhịp, không "shi-ya".',
    ],
  },
  {
    ten: 'Anna và Marco',
    dang: 'Đoạn kể về NGƯỜI KHÁC (ngôi thứ ba): tên lặp lại nhiều lần — đọc đều, đừng tăng tốc ở chỗ lặp.',
    cau: [
      ['^アンナ-さん は ^ロシア-じん です。', 'Anna là người Nga.'],
      ['^マルコ-さん は ^イタリア-じん です。', 'Marco là người Ý.'],
      ['^アンナ-さん は ^ふじみ-だいがく の がくせい です。', 'Anna là sinh viên trường Đại học Fujimi.'],
      ['^マルコ-さん も ^ふじみ-だいがく の がくせい です。', 'Marco cũng là sinh viên Đại học Fujimi.'],
      ['^アンナ-さん の しゅみ は {読書|どくしょ} です。', 'Sở thích của Anna là đọc sách.'],
      ['^マルコ-さん の しゅみ は {映画|えいが} と {音楽|おんがく} です。', 'Sở thích của Marco là phim ảnh và âm nhạc.'],
      ['^アンナ-さん は {二十歳|はたち} です。', 'Anna 20 tuổi.'],
    ],
    meo: [
      '**二十歳 = はたち** — bẫy kinh điển. Sách dạy はたち; thấy 二十歳 là đọc はたち.',
      '読書 = **どくしょ** (do-ku-sho) · 映画 = **えいが** (e-i-ga) · 音楽 = **おんがく** (o-n-ga-ku, ん một nhịp riêng).',
      'イタリア: i-ta-ri-a, **không** có ー. ロシア: ro-shi-a.',
      'Chỗ lặp 「さんは」「さんも」「さんの」: nghe rõ trợ từ — đọc nhầm は ↔ も là đổi nghĩa câu.',
    ],
  },
  {
    ten: 'Wan — tuổi và sinh nhật',
    dang: 'Đoạn có tuổi + ngày tháng bất quy tắc — loại giám thị hay chọn để bắt lỗi đọc số.',
    cau: [
      ['こんにちは。 ^ワン です。 ^ちゅうごく-じん です。', 'Xin chào. Tôi là Wan, người Trung Quốc.'],
      ['^あおぞら-にほんご-がっこう の がくせい です。', 'Tôi là học sinh trường tiếng Nhật Aozora.'],
      ['{二十歳|はたち} です。', 'Tôi 20 tuổi.'],
      ['{誕生日|たんじょうび} は {七月|しちがつ} {一日|ついたち} です。', 'Sinh nhật tôi là ngày 1 tháng 7.'],
      ['しゅみ は テニス と サッカー と りょうり です。', 'Sở thích của tôi là quần vợt, bóng đá và nấu ăn.'],
      ['^メアリー-さん の しゅみ も おなじ です。', 'Sở thích của cô Mary cũng giống vậy.'],
      ['どうぞ よろしく おねがい します。', 'Rất mong mọi người giúp đỡ.'],
    ],
    meo: [
      '**一日 = ついたち** (ngày mùng 1) — không いちにち (いちにち = "một ngày").',
      '**七月 = しちがつ** (không ななが) · **誕生日 = たんじょうび** (ta-n-jo-u-bi: じょう kéo dài).',
      'ちゅうごく = chu-u-go-ku (4 nhịp): **ちゅう kéo dài**, đọc ngắn thành "chugoku" là sai một chữ う.',
      'にほんごがっこう viết toàn hiragana nên dài — ngắt sau の: あおぞらにほんごがっこうの / がくせいです.',
    ],
  },
  {
    ten: 'Hội thoại — Daniel gặp Kimura',
    dang: 'Đề có thể là một đoạn hội thoại hai người (A/B). Đọc cả hai vai; đổi giọng nhẹ khi đổi vai; câu hỏi か lên giọng cuối câu.',
    vai: ['A', 'B', 'A', 'B', 'A', 'B', 'A'],
    cau: [
      ['はじめまして。 ^ダニエル です。 ^オーストラリア-じん です。', '(Daniel) Rất vui được gặp. Tôi là Daniel, người Úc.'],
      ['はじめまして。 ^きむら です。 ^{日本人|にほんじん} です。', '(Kimura) Rất vui được gặp. Tôi là Kimura, người Nhật.'],
      ['^きむら-さん は がくせい です か。', 'Chị Kimura là sinh viên phải không?'],
      ['はい、 ^ふじみ-だいがく の がくせい です。 ^ダニエル-さん は？', 'Vâng, tôi là sinh viên Đại học Fujimi. Còn anh Daniel?'],
      ['{私|わたし} は {会社員|かいしゃいん} です。', 'Tôi là nhân viên công ty.'],
      ['そう です か。 しゅみ は {何|なん} です か。', 'Vậy à. Sở thích của anh là gì?'],
      ['サッカー と テニス です。', 'Bóng đá và quần vợt.'],
    ],
    meo: [
      'オーストラリア = **オー**・ス・ト・ラ・リ・ア: chỉ kéo dài ở **オー**; katakana dài nhất Bài 1 — tách khúc mà đọc.',
      '{何|なん}ですか: 何 trước です đọc **なん** (không なに).',
      '日本人 = **にほんじん** (ni-ho-n-ji-n).',
      'Câu hỏi か lên giọng; câu trả lời はい、… hạ giọng — giám thị nghe được bạn HIỂU câu.',
    ],
  },
  {
    ten: 'Hai thầy cô giáo',
    dang: 'Đoạn ngôi thứ ba về nghề nghiệp, có の chỉ quan hệ (học trò CỦA cô Mary).',
    cau: [
      ['^メアリー-さん は ^アメリカ-じん です。', 'Mary là người Mỹ.'],
      ['^あおぞら {日本語学校|にほんごがっこう} の {先生|せんせい} です。', 'Cô là giáo viên trường tiếng Nhật Aozora.'],
      ['^ワン-さん は ^メアリー-さん の がくせい です。', 'Wan là học trò của cô Mary.'],
      ['^メアリー-さん の しゅみ は {水泳|すいえい} と りょこう です。', 'Sở thích của cô Mary là bơi và du lịch.'],
      ['^にしかわ-さん は ^{日本人|にほんじん} です。', 'Anh Nishikawa là người Nhật.'],
      ['^さくら-こうこう の きょうし です。', 'Anh là giáo viên trường THPT Sakura.'],
      ['^にしかわ-さん の しゅみ は スポーツ です。', 'Sở thích của anh Nishikawa là thể thao.'],
    ],
    meo: [
      '先生 = **せんせい** (se-n-se-i, 4 nhịp) · 水泳 = **すいえい** (su-i-e-i, 4 nhịp — đừng nuốt い).',
      'こうこう = **ko-u-ko-u** (4 nhịp, hai lần kéo dài) · きょうし = kyo-u-shi · りょこう = ryo-ko-u.',
      'メアリー: me-a-rī — **ー ở cuối** kéo dài; アメリカ không có ー.',
      'の ở 「メアリーさんの がくせい」 = "của" — đọc liền さんの, ngắt SAU の.',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
 *                         BÀI 2 — 6 đoạn
 * ═══════════════════════════════════════════════════════════════════ */

const DOAN_B2: Doan[] = [
  {
    ten: 'Hỏi đường trong toà nhà',
    dang: 'Hội thoại khách – nhân viên: hỏi nơi bằng どこ, trả lời bằng tầng (〜階) và あちら/あそこ.',
    vai: ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A'],
    cau: [
      ['すみません。 レストラン は どこ です か。', '(Khách) Xin lỗi, nhà hàng ở đâu ạ?'],
      ['{七階|ななかい} です。 エレベーター は あちら です。', '(Nhân viên) Ở tầng 7. Thang máy ở phía kia.'],
      ['どうも。 {本屋|ほんや} も {七階|ななかい} です か。', 'Cảm ơn. Hiệu sách cũng ở tầng 7 ạ?'],
      ['いいえ、 {本屋|ほんや} は {三階|さんがい} です。', 'Không, hiệu sách ở tầng 3.'],
      ['そう です か。 スーパー は どこ です か。', 'Vậy ạ. Siêu thị ở đâu ạ?'],
      ['{地下一階|ちかいっかい} です。', 'Ở tầng hầm 1.'],
      ['すみません、 トイレ は どこ です か。', 'Xin lỗi, nhà vệ sinh ở đâu ạ?'],
      ['あそこ です。', 'Ở đằng kia.'],
      ['どうも ありがとう ございます。', 'Xin cảm ơn nhiều.'],
    ],
    meo: [
      '**三階 = さんがい** (cách đọc sách dạy; さんかい cũng có người nói nhưng thi nên đọc さんがい) · **七階 = ななかい** · **地下一階 = ちかいっかい** (一 + 階 → いっかい).',
      'エレベーター = e-re-**bē**-**tā**: HAI chỗ kéo dài (ベー, ター) — 6 nhịp.',
      'レストラン: re-su-to-ra-n — ン cuối là một nhịp, đừng nuốt.',
      'あちら / あそこ: đọc đủ ba âm, あそこ không thành "asko".',
    ],
  },
  {
    ten: 'Mua đồng hồ, máy ảnh, giày',
    dang: 'Hội thoại mua hàng: この/その/あの + いくら + どこの N; giá có 万・千 — chỗ đọc số khó nhất Bài 2.',
    vai: ['B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'],
    cau: [
      ['いらっしゃいませ。', '(Nhân viên) Kính chào quý khách.'],
      ['すみません。 この {時計|とけい} は いくら です か。', '(Khách) Xin lỗi, cái đồng hồ này bao nhiêu tiền?'],
      ['{一万円|いちまんえん} です。', '(Nhân viên) 10.000 yên.'],
      ['あの カメラ は どこ の カメラ です か。', 'Cái máy ảnh kia là máy ảnh của nước nào?'],
      ['^ドイツ の カメラ です。 {三万八千円|さんまんはっせんえん} です。', 'Máy ảnh Đức. 38.000 yên.'],
      ['その くつ は？', 'Còn đôi giày đó?'],
      ['これ は ^イタリア の くつ です。 {六千円|ろくせんえん} です。', 'Đây là giày Ý. 6.000 yên.'],
      ['じゃ、 その くつ と ペン を ください。', 'Vậy cho tôi đôi giày đó và cây bút.'],
      ['はい、 ありがとう ございます。', 'Vâng, xin cảm ơn quý khách.'],
    ],
    meo: [
      '**一万円 = いちまんえん** (không まんえん) · **三万八千円 = さんまん・はっせん・えん** (八千 → はっせん, có っ) · **六千円 = ろくせんえん** (không ろっせん).',
      'Khách nói **その** くつ (gần nhân viên) → nhân viên đáp **これ** (gần mình) — đọc đúng từ chỉ thị.',
      'カメラ (ka-me-ra) · ドイツ (do-i-tsu: ツ, không "chu") · イタリア · ペン (pe-n).',
      'どこの カメラ = "máy ảnh của nước/hãng nào" — đọc liền どこの.',
    ],
  },
  {
    ten: 'Gọi món ở nhà hàng',
    dang: 'Khuôn "ここはレストランです。ご注文、どうぞ" của đề mẫu: hỏi 何のりょうり, gọi bằng 〜を〜つください.',
    vai: ['B', 'A', 'B', 'A', 'A', 'B'],
    cau: [
      ['いらっしゃいませ。 ご{注文|ちゅうもん}、 どうぞ。', '(Nhân viên) Kính chào quý khách. Mời quý khách gọi món.'],
      ['すみません。 これ は なん の りょうり です か。', '(Khách) Xin lỗi, đây là món làm từ gì vậy?'],
      ['とりにく の カレー です。', 'Cà ri gà ạ.'],
      ['じゃ、 カレー を {一つ|ひとつ} ください。 ライス も おねがい します。', 'Vậy cho tôi một cà ri. Cho tôi cả cơm nữa.'],
      ['それから、 ジュース と コーヒー を ください。', 'Với lại cho tôi nước ép và cà phê.'],
      ['はい。 カレー は {八百円|はっぴゃくえん}、 ジュース と コーヒー は {三百円|さんびゃくえん} です。', 'Vâng. Cà ri 800 yên, nước ép và cà phê mỗi thứ 300 yên.'],
    ],
    meo: [
      '**八百円 = はっぴゃくえん** · **三百円 = さんびゃくえん** — ひゃく đổi thành ぴゃく / びゃく; đọc ひゃく là sai một chữ.',
      '**一つ = ひとつ** (đếm đồ vật) — không いちつ · **注文 = ちゅうもん** (chu-u-mo-n: **ちゅう kéo dài**) — câu "ご注文、どうぞ" có trong đề mẫu của cô.',
      'いらっしゃいませ: có **っ** (i-ra-s-sha-i-ma-se) — đọc thiếu っ là sai một chữ.',
      'ジュース = jū-su · コーヒー = kō-hī (hai chỗ kéo dài) · ライス (ra-i-su) · カレー (ka-rē).',
    ],
  },
  {
    ten: 'Đồ của ai?',
    dang: 'Hội thoại tìm chủ đồ vật: だれの + Nの (bỏ danh từ) — "của tôi", "của Marco".',
    vai: ['A', 'A', 'B', 'A', 'B', 'A', 'B', 'A'],
    cau: [
      ['あのう、 すみません。', '(A) À, xin lỗi.'],
      ['これ は だれ の {財布|さいふ} です か。', '(A) Đây là ví của ai vậy?'],
      ['あ、 それ は {私|わたし} の です。 ありがとう ございます。', '(Wan) A, đó là của tôi. Cảm ơn bạn.'],
      ['この {携帯電話|けいたいでんわ} も ^ワン-さん の です か。', 'Cái điện thoại này cũng là của Wan à?'],
      ['いいえ、 それ は ^マルコ-さん の です。 ^マルコ-さん、 これ！', 'Không, đó là của Marco. Marco ơi, cái này!'],
      ['じゃ、 あれ は？', 'Vậy còn cái kia?'],
      ['あれ は ^アンナ-さん の {本|ほん} です。 ^ロシア-ご の {本|ほん} です。', 'Cái kia là sách của Anna. Sách tiếng Nga.'],
      ['そう です か。', 'Vậy à.'],
    ],
    meo: [
      '**携帯電話 = けいたいでんわ** (ke-i-ta-i-de-n-wa, 7 nhịp) — từ chữ Hán dài nhất Bài 2.',
      '**財布 = さいふ** · **本 = ほん** · ありがとう ございます: **とう** kéo dài, ございます đọc nhẹ đuôi す.',
      '私の です = "của tôi" — の đứng trước です, đọc liền わたしのです.',
      'ロシアご (ro-shi-a-go): 〜語 = ご. マルコ · アンナ: アンナ có ン ở giữa — an-na, giữ đủ hai nhịp.',
    ],
  },
  {
    ten: 'Ở hàng hoa quả',
    dang: 'Mua thực phẩm: giá "một cái bao nhiêu" (一つ 〜円), số lượng みっつ, xuất xứ どこの.',
    vai: ['A', 'B', 'A', 'B', 'A', 'B'],
    cau: [
      ['すみません。 この リンゴ は いくら です か。', '(Khách) Xin lỗi, táo này bao nhiêu tiền?'],
      ['{一つ|ひとつ} {百円|ひゃくえん} です。', '(Người bán) Một quả 100 yên.'],
      ['じゃ、 リンゴ を みっつ ください。 その イチゴ は どこ の イチゴ です か。', 'Vậy cho tôi ba quả. Dâu đó là dâu ở đâu vậy?'],
      ['^にほん の イチゴ です。 {五百円|ごひゃくえん} です。', 'Dâu Nhật. 500 yên.'],
      ['じゃ、 それ も ください。 パン と {卵|たまご} も ください。', 'Vậy cho tôi cả hộp đó. Cho tôi cả bánh mì và trứng.'],
      ['はい、 ありがとう ございます。 レジ は あちら です。', 'Vâng, xin cảm ơn. Quầy thanh toán ở phía kia.'],
    ],
    meo: [
      '**百円 = ひゃくえん** (hya-ku-e-n) · **五百円 = ごひゃくえん** (5 không biến âm) · **一つ = ひとつ** · **卵 = たまご**.',
      'みっつ (3 cái): **っ** ngắt — mi-t-tsu; đọc "mitsu" là thiếu một chữ.',
      'イチゴ / リンゴ: ゴ là âm đục (go), không "ko".',
      'レジ (re-ji, quầy tính tiền) · ありがとう: **とう** kéo dài (a-ri-ga-to-u).',
    ],
  },
  {
    ten: 'Bữa trưa — món gì, uống gì',
    dang: 'Hỏi 何の N + gọi món + nói giá tổng — dạng có nhiều katakana món ăn.',
    vai: ['B', 'A', 'B', 'A', 'B', 'A', 'A', 'B'],
    cau: [
      ['いらっしゃいませ。', '(Nhân viên) Kính chào quý khách.'],
      ['すみません、 これ は {何|なん} の スープ です か。', '(Khách) Xin lỗi, đây là súp gì vậy?'],
      ['やさい の スープ です。', 'Súp rau ạ.'],
      ['じゃ、 あれ は？', 'Vậy còn món kia?'],
      ['あれ は {牛肉|ぎゅうにく} の ハンバーグ です。', 'Món kia là hamburg thịt bò.'],
      ['じゃ、 スープ と ハンバーグ と ライス を ください。', 'Vậy cho tôi súp, hamburg và cơm.'],
      ['それから、 ケーキ と {紅茶|こうちゃ} も おねがい します。', 'Với lại cho tôi cả bánh ngọt và trà đen.'],
      ['はい。 {千二百円|せんにひゃくえん} です。 ありがとう ございます。', 'Vâng. 1.200 yên ạ. Xin cảm ơn quý khách.'],
    ],
    meo: [
      '**牛肉 = ぎゅうにく** (gyu-u-ni-ku: ぎゅう kéo dài) · **紅茶 = こうちゃ** (ko-u-cha) · **千二百円 = せん・にひゃく・えん** (千 không đọc いっせん).',
      'ハンバーグ = ha-n-bā-gu: ン + バー kéo dài · スープ = sū-pu.',
      '何の スープ: 何 trước の đọc **なん**.',
      'ライス (ra-i-su) · ケーキ = kē-ki (ケー kéo dài) — 4 katakana của đoạn đều là món ăn.',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
 *                         BÀI 3 — 7 đoạn
 * ═══════════════════════════════════════════════════════════════════ */

const DOAN_B3: Doan[] = [
  {
    ten: 'Một ngày của tôi',
    dang: 'Dạng "một ngày của tôi" — đúng kiểu đoạn mẫu trong hướng dẫn ôn thi: giờ + に, nơi + で/へ, V-ます.',
    cau: [
      ['{私|わたし} は まいあさ {六時半|ろくじはん} に おきます。', 'Sáng nào tôi cũng dậy lúc 6 giờ rưỡi.'],
      ['あさ、 パン を たべます。 コーヒー を のみます。', 'Buổi sáng tôi ăn bánh mì, uống cà phê.'],
      ['がっこう で にほんご を べんきょう します。', 'Tôi học tiếng Nhật ở trường.'],
      ['ひる、 {図書館|としょかん} で ほん を よみます。', 'Buổi trưa tôi đọc sách ở thư viện.'],
      ['よる、 うち で テレビ を みます。 おんがく も ききます。', 'Buổi tối tôi xem ti vi ở nhà, cũng nghe nhạc.'],
      ['インターネット も します。', 'Tôi cũng dùng internet.'],
      ['{十一時|じゅういちじ} に ねます。', 'Tôi đi ngủ lúc 11 giờ.'],
    ],
    meo: [
      '**六時半 = ろくじはん** · **十一時 = じゅういちじ** · **図書館 = としょかん** (to-sho-ka-n: しょ một nhịp).',
      'べんきょう します = be-n-**kyo-u** shi-ma-su: **きょう** kéo dài; ngắt sau を, đọc liền べんきょうします.',
      'インターネット = i-n-tā-ne-t-to: ン + ター kéo dài + ッ ngắt — katakana khó nhất đoạn.',
      'Đuôi ます / です: âm す đọc rất nhẹ ("mas", "des") — đừng nhấn thành "ma-SU".',
    ],
  },
  {
    ten: 'Một tuần của Marco',
    dang: 'Lịch tuần: 〜から〜まで với THỨ, làm thêm ở đâu, ngày nghỉ không đi đâu cả (どこへも〜ません).',
    cau: [
      ['^マルコ-さん は {月曜日|げつようび} から {金曜日|きんようび} まで だいがく へ いきます。', 'Marco đi đến trường đại học từ thứ Hai đến thứ Sáu.'],
      ['だいがく で にほんご を べんきょう します。', 'Cậu ấy học tiếng Nhật ở trường.'],
      ['{土曜日|どようび} は コンビニ で アルバイト を します。', 'Thứ Bảy cậu ấy làm thêm ở cửa hàng tiện lợi.'],
      ['ごご ごじ から じゅうじ まで はたらきます。', 'Cậu ấy làm từ 5 giờ chiều đến 10 giờ.'],
      ['{日曜日|にちようび} は やすみ です。 どこ へ も いきません。', 'Chủ nhật là ngày nghỉ. Cậu ấy không đi đâu cả.'],
      ['うち で テレビ を みます。', 'Cậu ấy xem ti vi ở nhà.'],
    ],
    meo: [
      '**月曜日 げつようび · 金曜日 きんようび · 土曜日 どようび · 日曜日 にちようび** — 4 từ gạch chân đều là THỨ; ようび = yo-u-bi (よう kéo dài).',
      'きんようび: ん đứng trước よ — đọc **kin-yōbi** tách rõ, không dính thành "kinyobi" ngắn.',
      'どこ へ も = **doko e mo** (へ đọc e); いきません = phủ định — đừng đọc nhầm thành いきます.',
      'アルバイト (a-ru-ba-i-to) · コンビニ (ko-n-bi-ni) — không có trường âm.',
    ],
  },
  {
    ten: 'Giờ mở cửa ở thị trấn',
    dang: 'Đọc biển giờ mở cửa: N は 〜時から 〜時までです + ngày nghỉ. Nhiều số — đọc chậm lại ở mỗi số.',
    cau: [
      ['^さくら-{図書館|としょかん} は {九時|くじ} から {七時|しちじ} まで です。', 'Thư viện Sakura mở từ 9 giờ đến 7 giờ.'],
      ['やすみ は {月曜日|げつようび} です。', 'Ngày nghỉ là thứ Hai.'],
      ['ぎんこう は ごぜん くじ から ごご さんじ まで です。', 'Ngân hàng mở từ 9 giờ sáng đến 3 giờ chiều.'],
      ['スーパー は ごぜん じゅうじ から です。', 'Siêu thị mở từ 10 giờ sáng.'],
      ['レストラン は ごご ごじ から です。', 'Nhà hàng mở từ 5 giờ chiều.'],
      ['コンビニ は にちようび も ゴールデンウイーク も やすみ じゃ ありません。', 'Cửa hàng tiện lợi không nghỉ cả Chủ nhật lẫn Tuần lễ Vàng.'],
    ],
    meo: [
      '**九時 = くじ** (không きゅうじ) · **七時 = しちじ** (không ななじ) · 図書館 · 月曜日 — 4 từ gạch chân.',
      'ごぜん (sáng) / ごご (chiều): **ごご** hai âm go-go, đừng đọc thành "gô".',
      'ゴールデンウイーク = gō-ru-de-n-u-**ī**-ku: hai chỗ kéo dài **ゴー** và **イー** → đọc chậm từng khúc ゴール・デン・ウイーク (9 chữ, katakana dài nhất Bài 3).',
      'やすみ じゃ ありません: phủ định danh từ — nghe đủ じゃ ありません mới hiểu là "KHÔNG nghỉ".',
    ],
  },
  {
    ten: 'Chủ nhật của Park và Wan',
    dang: 'So sánh hai người: một người đi công viên, một người ở nhà — có や〜など, 何も, どこへも.',
    cau: [
      ['{日曜日|にちようび}、 ^パク-さん は {公園|こうえん} へ いきます。', 'Chủ nhật Park đi công viên.'],
      ['そこ で サッカー を します。', 'Ở đó cô ấy chơi bóng đá.'],
      ['ひる、 そこ で おべんとう を たべます。', 'Buổi trưa cô ấy ăn cơm hộp ở đó.'],
      ['ごご、 スーパー で やさい や {果物|くだもの} など を かいます。', 'Buổi chiều cô ấy mua rau, hoa quả… ở siêu thị.'],
      ['^ワン-さん は どこ へ も いきません。', 'Wan thì không đi đâu cả.'],
      ['うち で しんぶん と ほん を よみます。', 'Cô ấy đọc báo và sách ở nhà.'],
      ['ばん は {何|なに} も たべません。', 'Buổi tối cô ấy không ăn gì cả.'],
    ],
    meo: [
      '**公園 = こうえん** (ko-u-e-n) · **果物 = くだもの** (đọc đặc biệt — không かぶつ) · **何も = なにも** (trước も đọc なに).',
      'おべんとう = o-be-n-to-u: ん + とう kéo dài · しんぶん = shi-n-bu-n (hai ん).',
      'や〜など: やさい **や** くだもの **など** を — đọc liền thành một cụm.',
      'いきません / たべません: hai câu phủ định — đọc nhầm thành ます là đổi nghĩa.',
    ],
  },
  {
    ten: 'Hội thoại — đi ngắm hoa anh đào',
    dang: 'Hội thoại rủ nhau đi おはなみ (đúng tình huống đề FE thật hay hỏi: "おはなみ？何をしますか").',
    vai: ['A', 'B', 'A', 'B', 'A', 'B'],
    cau: [
      ['^アンナ-さん、 {四月|しがつ} {五日|いつか} は おはなみ です。', '(Kimura) Anna ơi, ngày 5 tháng 4 là hội ngắm hoa.'],
      ['えっ、 おはなみ？ なに を します か。', '(Anna) Hả, ngắm hoa à? Làm gì vậy?'],
      ['{桜|さくら} を みます。 おべんとう を たべます。 ジュース や ビール など を のみます。', 'Ngắm hoa anh đào. Ăn cơm hộp. Uống nước ép, bia…'],
      ['いい です ね。 どこ で します か。', 'Hay quá nhỉ. Làm ở đâu vậy?'],
      ['^ふじみ-こうえん で します。 {十時半|じゅうじはん} から です。', 'Ở công viên Fujimi. Từ 10 giờ rưỡi.'],
      ['^ナタポン-さん も いきます か。', 'Natapon cũng đi chứ?'],
    ],
    meo: [
      '**四月 = しがつ** · **五日 = いつか** (không ごにち) · **桜 = さくら** · **十時半 = じゅうじはん** (không じゅっじ).',
      'おはなみ = o-ha-na-mi: は ở đây là âm "ha" (nằm trong từ), **không** đọc wa.',
      'なに を します か: hỏi "làm gì" → なに (trước を đọc なに).',
      'いい です ね: ね hạ giọng nhẹ, tỏ ý đồng tình — đọc tự nhiên như nói.',
    ],
  },
  {
    ten: 'Buổi tối của Natapon',
    dang: 'Đoạn có cả 毎朝 / 毎晩 (không dùng に) và giờ cụ thể (dùng に) — chỗ đề hay gạch chân.',
    cau: [
      ['^ナタポン-さん は {会社|かいしゃ} で はたらきます。', 'Natapon làm việc ở công ty.'],
      ['{毎朝|まいあさ}、 なに も たべません。 コーヒー を のみます。', 'Sáng nào anh ấy cũng không ăn gì. Anh uống cà phê.'],
      ['ひる、 おべんとう を たべます。', 'Buổi trưa anh ăn cơm hộp.'],
      ['ごご ろくじ に うち へ かえります。', 'Anh về nhà lúc 6 giờ chiều.'],
      ['{毎晩|まいばん}、 ビール を のみます。 テレビ を みます。', 'Tối nào anh cũng uống bia và xem ti vi.'],
      ['しんぶん も ほん も よみません。', 'Báo hay sách anh đều không đọc.'],
      ['よる {十二時|じゅうにじ} に ねます。', 'Anh đi ngủ lúc 12 giờ đêm.'],
    ],
    meo: [
      '**会社 = かいしゃ** · **毎朝 = まいあさ** (ma-i-a-sa, 4 nhịp) · **毎晩 = まいばん** · **十二時 = じゅうにじ**.',
      'かえります = ka-e-ri-ma-su ("về") — đọc nhầm かいります là sai một chữ.',
      'ろくじ に (giờ + に) nhưng まいあさ、 / まいばん、 (không có に) — đọc đúng như viết.',
      'ナタポン (na-ta-po-n) · ビール = bī-ru (ビー kéo dài) · コーヒー · テレビ.',
    ],
  },
  {
    ten: 'Bốn mùa ở Nhật',
    dang: 'Đoạn từ vựng sự kiện theo mùa của Bài 3 — 4 từ gạch chân là 4 chữ mùa (đứng riêng: đọc âm Kun).',
    cau: [
      ['{春|はる}、 ^にほん-じん は おはなみ を します。', 'Mùa xuân người Nhật đi ngắm hoa.'],
      ['{夏|なつ}、 うみ へ いきます。 バーベキュー を します。 よる、 はなび を みます。', 'Mùa hè người ta đi biển, nướng thịt; buổi tối xem pháo hoa.'],
      ['{秋|あき}、 おまつり へ いきます。 おさけ を のみます。', 'Mùa thu người ta đi lễ hội, uống rượu sake.'],
      ['{冬|ふゆ}、 スキー を します。', 'Mùa đông người ta trượt tuyết.'],
      ['ごがつ の ゴールデンウイーク は りょこう を します。', 'Tuần lễ Vàng tháng 5 người ta đi du lịch.'],
      ['じゅうにがつ に パーティー を します。', 'Tháng 12 người ta tổ chức tiệc.'],
    ],
    meo: [
      '**春 はる · 夏 なつ · 秋 あき · 冬 ふゆ** — đứng một mình đọc âm Kun (không しゅん/か/しゅう/とう).',
      'バーベキュー = bā-be-kyū: hai chỗ kéo dài + âm ghép キュ · パーティー = pā-tī (hai chỗ kéo dài).',
      'はなび (pháo hoa) ≠ はなみ (ngắm hoa) — khác một chữ cuối び / み.',
      'ごがつ (tháng 5): go-ga-tsu · おまつり: o-ma-tsu-ri — つ là "tsu", không "chu".',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
 *                         BÀI 4 — 6 đoạn
 * ═══════════════════════════════════════════════════════════════════ */

const DOAN_B4: Doan[] = [
  {
    ten: 'Thành phố của tôi — Hà Nội',
    dang: 'Giới thiệu thành phố quê mình: vị trí (〜の北), tính chất (イA/ナA), có gì (〜があります), mùa.',
    cau: [
      ['{私|わたし} の まち は ^ハノイ です。 ^ベトナム の {北|きた} です。', 'Thành phố của tôi là Hà Nội, ở phía bắc Việt Nam.'],
      ['^ハノイ は にぎやか な まち です。', 'Hà Nội là thành phố nhộn nhịp.'],
      ['{古|ふる}い おてら が あります。 あたらしい ビル も おおい です。', 'Có chùa cổ. Toà nhà mới cũng nhiều.'],
      ['なつ は とても {暑|あつ}い です。 ふゆ は すこし さむい です。', 'Mùa hè rất nóng. Mùa đông hơi lạnh.'],
      ['^ホーチミン は ^ベトナム の みなみ です。', 'TP. Hồ Chí Minh ở phía nam Việt Nam.'],
      ['いちねんじゅう あつい です。', 'Ở đó nóng quanh năm.'],
    ],
    meo: [
      '**北 = きた** · **古い = ふるい** · **暑い = あつい** · **私** — 4 từ gạch chân (tính từ: đọc cả đuôi い).',
      'にぎやか な まち: ナA + **な** + N — đọc liền にぎやかな.',
      'いちねんじゅう = i-chi-ne-n-**ju-u**: じゅう kéo dài · おおい = o-o-i (kéo dài お).',
      'ホーチミン = hō-chi-mi-n · ビル = bi-ru (2 nhịp, không "bin").',
    ],
  },
  {
    ten: 'Từ Tokyo đến Kyoto',
    dang: 'Thời gian đi lại: N1 から N2 まで + phương tiện で + 〜時間くらい; mô tả Kyoto.',
    cau: [
      ['^マルコ-さん は ^{東京|とうきょう} から ^きょうと へ いきます。', 'Marco đi từ Tokyo đến Kyoto.'],
      ['{新幹線|しんかんせん} で にじかん くらい です。', 'Đi tàu Shinkansen mất khoảng 2 tiếng.'],
      ['バス で ななじかん くらい です。', 'Đi xe buýt khoảng 7 tiếng.'],
      ['^きょうと は ふるい まち です。 {有名|ゆうめい} な おてら が あります。', 'Kyoto là thành phố cổ. Có những ngôi chùa nổi tiếng.'],
      ['^マルコ-さん の まち は ^ミラノ です。 ^イタリア の {北|きた} です。', 'Thành phố của Marco là Milano, ở phía bắc nước Ý.'],
      ['^ミラノ も ふるい まち です。', 'Milano cũng là thành phố cổ.'],
    ],
    meo: [
      '**東京 = とうきょう** (to-u-kyo-u: HAI chỗ kéo dài) · **新幹線 = しんかんせん** (ba ん) · **有名 = ゆうめい** (yu-u-me-i) · **北 = きた**.',
      'きょうと (Kyoto) = kyo-u-to — không "kyo-to" ngắn.',
      'にじかん / ななじかん: 〜じかん (tiếng đồng hồ), khác 〜じ (giờ) — đọc đủ かん.',
      'ミラノ (mi-ra-no) · マルコ · バス · イタリア — không trường âm.',
    ],
  },
  {
    ten: 'Thời tiết ở Nhật và Thái Lan',
    dang: 'N（国）は［mùa］、A です + あまり〜ない + 一年中 — so sánh hai nước.',
    cau: [
      ['^{日本|にほん} の なつ は あつい です。 ふゆ は さむい です。', 'Mùa hè Nhật nóng. Mùa đông lạnh.'],
      ['^{北海道|ほっかいどう} は ふゆ、 {雪|ゆき} が おおい です。 スキー を します。', 'Hokkaido mùa đông nhiều tuyết. Người ta trượt tuyết.'],
      ['^ナタポン-さん の くに は ^タイ です。', 'Nước của Natapon là Thái Lan.'],
      ['^タイ は {一年中|いちねんじゅう} あつい です。 ゆき は ありません。', 'Thái Lan nóng quanh năm. Không có tuyết.'],
      ['じゅうにがつ は あまり あつく ない です。', 'Tháng 12 thì không nóng lắm.'],
      ['つめたい ビール は おいしい です。', 'Bia lạnh rất ngon.'],
    ],
    meo: [
      '**日本 = にほん** · **北海道 = ほっかいどう** (ho-k-ka-i-do-u: っ + どう kéo dài) · **雪 = ゆき** · **一年中 = いちねんじゅう**.',
      'あつく ない です: phủ định イA — あつ**い** → あつ**くない** (đọc liền あつくないです).',
      'つめたい (lạnh khi chạm — đồ uống) ≠ さむい (trời lạnh) — đọc đúng từ.',
      'ナタポン · タイ · スキー (su-kī: キー kéo dài) · ビール (bī-ru).',
    ],
  },
  {
    ten: 'Hội thoại — quê của Park',
    dang: 'Hỏi về quê bằng どこ / どんな / どう; trả lời có そして, 〜が、〜 (nhưng).',
    vai: ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'],
    cau: [
      ['^パク-さん の まち は どこ です か。', '(A) Thành phố của Park ở đâu vậy?'],
      ['^プサン です。 ^{韓国|かんこく} の {南|みなみ} です。', '(Park) Busan. Ở phía nam Hàn Quốc.'],
      ['^プサン は どんな まち です か。', 'Busan là thành phố như thế nào?'],
      ['うみ が きれい です。 レストラン も おおい です。', 'Biển đẹp. Nhà hàng cũng nhiều.'],
      ['^ソウル から {電車|でんしゃ} で どの くらい です か。', 'Từ Seoul đi tàu điện mất bao lâu?'],
      ['{二時間半|にじかんはん} です。', '2 tiếng rưỡi.'],
      ['ふゆ は どう です か。', 'Mùa đông thế nào?'],
      ['さむい です が、 ゆき は すくない です。', 'Lạnh, nhưng tuyết ít.'],
    ],
    meo: [
      '**韓国 = かんこく** · **南 = みなみ** (một chữ đứng riêng: âm Kun) · **電車 = でんしゃ** · **二時間半 = にじかんはん** (はん ở đây đọc "han").',
      'きれい です: きれい là **ナA** dù tận cùng bằng い — phủ định きれいじゃありません (không きれくない).',
      'どの くらい です か: hỏi "mất bao lâu" — đọc liền どのくらい (do-no-ku-ra-i).',
      'さむい です が、: が nối hai vế "nhưng" — ngắt nhẹ sau が. プサン · ソウル · レストラン · パク: 4 katakana.',
    ],
  },
  {
    ten: 'Đến trường mất bao lâu?',
    dang: 'Ba người, ba phương tiện: バスで / 電車で / 歩いて + thời gian くらい; mô tả trường.',
    cau: [
      ['{私|わたし} の うち から だいがく まで バス で さんじゅっぷん くらい です。', 'Từ nhà tôi đến trường đi xe buýt khoảng 30 phút.'],
      ['^アンナ-さん は {電車|でんしゃ} で {一時間半|いちじかんはん} くらい です。', 'Anna đi tàu điện khoảng 1 tiếng rưỡi.'],
      ['^マルコ-さん は {歩|ある}いて じゅっぷん くらい です。', 'Marco đi bộ khoảng 10 phút.'],
      ['だいがく は ふるい です が、 レストラン は あたらしい です。', 'Trường đại học thì cũ, nhưng nhà ăn thì mới.'],
      ['そして、 レストラン は とても しずか です。', 'Và nhà ăn rất yên tĩnh.'],
    ],
    meo: [
      '**電車 = でんしゃ** · **一時間半 = いちじかんはん** · **歩いて = あるいて** (đi bộ — KHÔNG có で) · **私**.',
      'さんじゅっぷん (30 phút) · じゅっぷん (10 phút): **っぷん** — ngắt + ぷ (không ふん).',
      'ふるい です が、 レストラン は あたらしい です: hai vế trái nghĩa nối bằng が — ngắt sau が.',
      'そして: so-shi-te, ngắt nhẹ sau そして rồi đọc tiếp.',
    ],
  },
  {
    ten: 'Hội thoại — món này thế nào?',
    dang: 'Hỏi cảm nhận bằng どうですか; trả lời bằng tính từ vị (からい, にがい, あまい) + あまり〜ない.',
    vai: ['A', 'B', 'A', 'B', 'A', 'B', 'A'],
    cau: [
      ['この スープ は どう です か。', '(A) Món súp này thế nào?'],
      ['おいしい です が、 すこし {辛|から}い です。', '(B) Ngon nhưng hơi cay.'],
      ['この コーヒー は？', 'Còn cà phê này?'],
      ['とても {苦|にが}い です ね。', 'Đắng quá nhỉ.'],
      ['じゃ、 この ケーキ は {甘|あま}い です か。', 'Vậy cái bánh này có ngọt không?'],
      ['いいえ、 あまり {甘|あま}く ない です。 メロン の ケーキ です。 {冷|つめ}たい です。', 'Không, không ngọt lắm. Bánh dưa lưới. Lạnh (mát) lắm.'],
      ['いい です ね。 じゃ、 わたし も その ケーキ を たべます。', 'Hay đấy. Vậy tôi cũng ăn cái bánh đó.'],
    ],
    meo: [
      '**辛い からい · 苦い にがい · 甘い あまい · 冷たい つめたい** — 4 tính từ vị/nhiệt độ đều đọc âm Kun.',
      'あまく ない です: 甘**い** → 甘**くない** — chữ Hán giữ nguyên, chỉ đổi đuôi.',
      'メロン (me-ro-n) · ケーキ (kē-ki) · コーヒー (kō-hī) · スープ (sū-pu).',
      'どう です か = do-u de-su ka: どう kéo dài — đọc "đô" ngắn là thiếu う.',
    ],
  },
];


/* ═══════════════════════════════════════════════════════════════════
 *                   KHUNG CHUNG CỦA MỘT LESSON ĐỌC TO
 * ═══════════════════════════════════════════════════════════════════ */

const BANG_CHAM: Block = TABLE(
  ['Phần', 'Đề có gì', 'Điểm', 'Mất điểm khi'],
  [
    ['Đọc chữ Hán', '**4 từ** chữ Hán **gạch chân**, KHÔNG furigana (chữ Hán không gạch chân thì có furigana)', '**12**', 'Đọc sai / không đọc được từ đó — chia đều thì ≈ 3 điểm một từ *(suy ra từ 12 ÷ 4; bản hướng dẫn chỉ ghi tổng 12)*'],
    ['Đọc katakana', '**4 từ** katakana', '**12**', 'Đọc sai từ (thiếu ー, thiếu ッ, nhầm シ/ツ, ソ/ン) — ≈ 3 điểm một từ *(suy ra)*'],
    ['Đọc hiragana', '**70–80 chữ** hiragana', '**16**', '**Đọc sai MỘT ký tự: trừ 0,2 điểm** (ghi rõ trong hướng dẫn)'],
    ['Cả bài', 'Khoảng **100–110 ký tự** (gồm chữ Hán), **không có câu hỏi** đi kèm', '**40**', 'Ngập ngừng: trừ **không quá 5%** cho mỗi đầu điểm'],
  ],
  'Phần READING của thi nói JPD113 — "Hướng dẫn ôn tập thi nói" bản 09/06/2025',
);

const TINH_DIEM: Block = NOTE('Tự tính điểm Reading sau mỗi lần thu âm (ví dụ)', [
  'Đọc sai **1 từ chữ Hán** + **3 chữ hiragana** → 40 − 3 − 0,6 = **36,4 / 40**.',
  'Chữ Hán, katakana đúng hết; đọc trợ từ **は thành "ha" 2 lần** → 2 ký tự sai → 40 − 0,4 = **39,6**.',
  'Đọc đúng hết nhưng **ngập ngừng nhiều** → trừ tối đa 5% mỗi đầu điểm: 12 → −0,6 · 12 → −0,6 · 16 → −0,8 ⇒ mất tối đa **2 điểm** (còn 38).',
  'Bỏ qua cả một từ katakana và 10 chữ hiragana (đọc vấp rồi nhảy) → 40 − 3 − 2 = **35** — đọc chậm mà đủ chữ luôn lợi hơn nhanh mà sót.',
  '**Mục tiêu 9–10 điểm cả môn**: Reading ≥ 38/40 — tức sai tối đa vài chữ hiragana, KHÔNG sai từ chữ Hán / katakana nào.',
]);

const BA_MUOI_GIAY: Block = TABLE(
  ['Giây', 'Làm gì', 'Vì sao'],
  [
    ['0–10', 'Tìm **4 từ chữ Hán gạch chân**, đọc thầm cách đọc từng từ (số, ngày, tuổi trước tiên)', '12 điểm nằm ở 4 từ này; số đọc bất quy tắc là chỗ hay sai nhất'],
    ['10–20', 'Lướt **4 từ katakana**: chỗ nào có **ー** (kéo dài), **ッ** (ngắt), **ン**', 'Katakana dài dễ đọc tắt — 12 điểm'],
    ['20–30', 'Đọc thầm cả đoạn một lượt; đánh dấu chỗ ngắt **sau trợ từ** は・を・に・で・へ・と・も và ở 、。', 'Đọc theo CỤM thì không "đọc từng chữ" — lỗi giám thị hay ghi'],
    ['Lúc đọc', 'Tốc độ **chậm vừa, đều**; câu hỏi か lên giọng; đọc **hết** đến dấu 。 cuối cùng rồi mới ngẩng lên', 'Sai 1 chữ hiragana chỉ −0,2 nhưng bỏ cả cụm là mất nhiều'],
  ],
  'Quy trình 30 giây chuẩn bị (giám thị chọn bài, bạn không được đổi)',
);

type CauHinh = {
  ten: string;
  doan: Doan[];
  bay: string[][];
  mc: ReturnType<typeof Q>[];
  them?: string[];
};

function baiDocTo(n: number, c: CauHinh): Lesson {
  const pham = n === 1 ? 'Bài 1' : `Bài 1–${n}`;
  return {
    id: `b${n}-doc-to`,
    kind: 'speaking',
    title: `🎙️ Đọc to kiểu đề thi (Reading 40 điểm) — ${c.ten}`,
    goal: `Đọc trôi chảy, không sai chữ ${c.doan.length} đoạn đúng khuôn đề JPD113 (100–110 ký tự · 4 từ chữ Hán không furigana · 4 từ katakana · 70–80 chữ hiragana) chỉ dùng từ và ngữ pháp ${pham}, có máy chấm phát âm từng câu.`,
    minutes: 50,
    blocks: [
      RECAP('Reading 40 điểm — 5 con số phải thuộc', [
        'Đọc to **một đoạn khoảng 100–110 ký tự** (gồm chữ Hán), **không có câu hỏi** đi kèm. Chuẩn bị **30 giây**. **Không được đổi** bài đọc.',
        '**4 từ chữ Hán gạch chân** (không furigana) = **12 điểm** · **4 từ katakana** = **12 điểm** · **70–80 chữ hiragana** = **16 điểm**.',
        '**Đọc sai một ký tự: −0,2 điểm.** Ngập ngừng: trừ không quá 5% mỗi đầu điểm.',
        `Bài này: **${c.doan.length} đoạn viết mới đúng khuôn số trên**, chỉ dùng từ + ngữ pháp **${pham}** — đếm ký tự của từng đoạn ở bảng ngay dưới tiêu đề đoạn.`,
      ]),
      NOTE('Học thế nào', [
        '① Đọc bảng cách chấm + bẫy phát âm của bài (mục 1–3). ② Mỗi đoạn: xem bảng "4 từ chữ Hán · 4 katakana", bấm **Nghe mẫu**, rồi **Đọc & chấm** từng câu — từ nào máy tô đỏ thì đọc riêng 5 lần. ③ Chấm hai dòng "nửa đoạn" để tập đọc liền.',
        '④ Cuối bài (mục 5) đọc **cả đoạn không furigana** như đề thật: bấm giờ 30 giây chuẩn bị, đọc to, rồi mới bấm hiện cách đọc để tự chấm theo thang −0,2/ký tự.',
        'Thu âm bằng điện thoại một lượt cả 6 đoạn mỗi ngày; nghe lại, đánh dấu chỗ vấp. Đọc **chậm mà đủ chữ** luôn được điểm cao hơn nhanh mà sót.',
        ...(c.them ?? []),
      ]),
      H('1. Cách chấm Reading và cách tự tính điểm'),
      BANG_CHAM,
      TINH_DIEM,
      H('2. 30 giây chuẩn bị — làm gì từng giây'),
      BA_MUOI_GIAY,
      H(`3. Bẫy phát âm của ${n === 1 ? 'Bài 1' : `Bài ${n}`}`),
      TABLE(['Bẫy', 'Đọc đúng', 'Hay đọc sai thành', 'Gặp trong bài này'], c.bay),
      H(`4. ${c.doan.length} đoạn đọc kiểu đề — có furigana, máy chấm từng câu`),
      P('Trong đề thật, **4 từ chữ Hán gạch chân không có furigana** — ở đây furigana chỉ để bạn học cách đọc; bấm nút tắt furigana của trang để tập như thi. Mỗi đoạn có đúng 4 từ chữ Hán (là 4 từ sẽ bị gạch chân) — phần còn lại viết kana như đề mẫu của cô.'),
      ...c.doan.flatMap((d, i) => khoiDoan(n, i + 1, d)),
      H('5. Đọc như thi thật — cả đoạn, KHÔNG furigana'),
      P('Mỗi mục là một đoạn trọn vẹn ở trên, hiện **chữ trần** như tờ đề. Làm đúng quy trình thi: nhìn **30 giây** → đọc to một lượt không dừng → bấm hiện cách đọc + nghe → đếm số chữ sai, tự trừ 0,2/ký tự. Hội thoại: đọc cả hai vai A/B.'),
      {
        t: 'readkanji',
        id: `b${n}-doc-to-de`,
        title: `Đọc trọn ${c.doan.length} đoạn không furigana (như tờ đề)`,
        note: 'Nhãn A：/B： là người nói — không đọc nhãn.',
        items: c.doan.map(docTron),
      },
      H('6. Kiểm tra nhanh bẫy đọc'),
      MC(`b${n}-doc-to-mc`, `Bẫy đọc của ${pham} (${c.mc.length} câu)`, c.mc),
      NOTE('Học tiếp', [
        n <= 3
          ? 'Thêm 6 đoạn luyện tổng hợp Bài 1–3 ở mục **Ôn thi JPD113 — Reading** (`on113-doc-to`) và 13 bài đọc của ngân hàng thi nói ở trang Ôn thi JPD113.'
          : 'Bài 4 có thể vào đề nếu lớp bạn học tới Bài 4 — hỏi cô phạm vi. Đoạn Bài 1–3: `b1-doc-to` … `b3-doc-to` và `on113-doc-to`.',
        'Làm trọn một buổi thi (Reading + Talking + chào) ở **3 đề thi thử JPD113** (Bài 3, mục Ôn thi).',
      ]),
    ],
  };
}

/* ═══════════════════════════════════════════════════════════════════
 *                              XUẤT
 * ═══════════════════════════════════════════════════════════════════ */

export const DOC_TO_B1: Lesson = baiDocTo(1, {
  ten: 'Bài 1 (giới thiệu bản thân)',
  doan: DOAN_B1,
  bay: [
    ['Trường âm え + い', 'Kéo dài 2 nhịp: {先生|せんせい} se-n-se-i · がくせい · えいが · すいえい', 'Đọc cụt "sen-se", "ga-ku-se"', 'Đoạn 1, 3, 6'],
    ['Trường âm お / う + う', 'ちゅうごく chu-**u**-go-ku · こうこう ko-**u**-ko-**u** · りょこう · たんじょうび', 'Thiếu う: "chu-go-ku", "ko-ko"', 'Đoạn 4, 6'],
    ['っ (âm ngắt)', 'Ngừng nửa nhịp trước phụ âm sau: いっさい · がっこう · サッカー', 'Bỏ っ: "i-sai", "ga-kou"', 'Đoạn 1, 2'],
    ['ん', 'Một nhịp riêng: に-ほ-**ん** · か-**ん**-こ-く · お-**ん**-が-く', 'Nuốt ん', 'Đoạn 3, 5'],
    ['Âm ghép ゃ ゅ ょ', 'Một nhịp: しゅみ (shu-mi) · りょうり · どくしょ · きょうし · しゃいん', 'Tách "shi-yu-mi"', 'Mọi đoạn'],
    ['は · へ · を trợ từ', '**wa · e · o** (こんにちは cũng đọc wa)', 'ha · he', 'Mọi đoạn'],
    ['Ngày 1–10, 20', 'ついたち · ふつか · みっか · よっか · いつか · むいか · なのか · ようか · ここのか · **とおか** · **はつか**', 'いちにち · じゅうにち · にじゅうにち', 'Đoạn 1 (十日), 4 (一日)'],
    ['Tháng 4 · 7 · 9', '**しがつ · しちがつ · くがつ**', 'よんがつ · なながつ · きゅうがつ', 'Đoạn 1, 4'],
    ['Tuổi', 'いっさい · はっさい · じゅっさい · **{二十歳|はたち}** (cách sách dạy — an toàn nhất khi đọc to)', 'いちさい · はちさい', 'Đoạn 2 (四十一歳), 3, 4 (二十歳)'],
    ['Katakana dài', 'Tách khúc: オー・スト・ラ・リ・ア · メア・リー · ブラ・ジル', 'Đọc tắt, bỏ ー', 'Đoạn 2, 3, 5, 6'],
  ],
  mc: [
    Q('Trong bài đọc, 「{二十歳|はたち}」 nên đọc là…', 'はたち', 'ふたじゅっさい | にじゅうねん | はつか', '二十歳 = **はたち** (từ của Bài 1). はつか là ngày 20, không phải tuổi.'),
    Q('「{七月|しちがつ}{一日|ついたち}」 — 一日 (ngày mùng 1) đọc là…', 'ついたち', 'いちにち | ひとひ | いっか', 'Ngày mùng 1 = **ついたち**. いちにち nghĩa là "một ngày" (khoảng thời gian), không dùng cho ngày tháng.'),
    Q('「{十日|とおか}」 (ngày 10) đọc là…', 'とおか', 'じゅうにち | じゅっか | とおにち', 'Ngày 10 = **とおか** (bất quy tắc).'),
    Q('「{四月|しがつ}」 đọc là…', 'しがつ', 'よんがつ | よがつ | しげつ', 'Tháng 4 = **しがつ**.'),
    Q('「{四十一歳|よんじゅういっさい}」 đọc là…', 'よんじゅういっさい', 'よんじゅういちさい | よんじゅっいっさい | よんじゅうひとつさい', '一 + さい → **いっさい** (có っ).'),
    Q('「こんにちは」 — chữ cuối 「は」 đọc là…', 'wa', 'ha | ba | a', 'こんにちは vốn là "今日は" — は là trợ từ nên đọc **wa**.'),
    Q('「ちゅうごく」 có mấy nhịp (mỗi nhịp ~ một ký tự kana, ゅ đi chung với ち)?', '4 nhịp: ちゅ・う・ご・く', '3 nhịp: ちゅ・ご・く | 5 nhịp: ち・ゅ・う・ご・く | 2 nhịp: ちゅう・ごく', 'ちゅ là một nhịp, う kéo dài là một nhịp ⇒ 4.'),
    Q('「{日本語学校|にほんごがっこう}」 đọc là…', 'にほんごがっこう', 'にほんごがくこう | にほんごかっこう | にほんごがこう', '学 + 校 → がっこう (có っ).'),
    Q('Đoạn đọc của bạn có 75 chữ hiragana; bạn đọc sai 4 chữ. Phần hiragana (16 điểm) còn…', '15,2 điểm', '12 điểm | 15,6 điểm | 14 điểm', '4 × 0,2 = 0,8 ⇒ 16 − 0,8 = **15,2**.'),
    Q('Từ katakana nào có trường âm ー?', 'メアリー', 'アメリカ | イタリア | ブラジル', 'メアリー có ー ở cuối — kéo dài リ thêm một nhịp.'),
  ],
});

export const DOC_TO_B2: Lesson = baiDocTo(2, {
  ten: 'Bài 2 (mua sắm · gọi món)',
  doan: DOAN_B2,
  bay: [
    ['ひゃく đổi âm', '300 **さんびゃく** · 600 **ろっぴゃく** · 800 **はっぴゃく** (còn lại ひゃく)', 'さんひゃく · ろくひゃく · はちひゃく', 'Đoạn 3 (八百円, 三百円), 6'],
    ['せん đổi âm', '3.000 **さんぜん** · 8.000 **はっせん** · 1.000 **せん** (không いっせん) · 6.000 ろくせん (không đổi)', 'さんせん · はちせん · いっせん · ろっせん', 'Đoạn 2 (三万八千円, 六千円), 6 (千二百円)'],
    ['万', '10.000 = **いちまん** (bắt buộc có いち)', 'まん', 'Đoạn 2 (一万円)'],
    ['〜階', '1 **いっかい** · 3 **さんがい** (sách) · 6 ろっかい · 7 ななかい · 8 はっかい · 10 じゅっかい · 何階 **なんがい** · B1 **ちかいっかい**', 'いちかい · ろくかい · なんかい', 'Đoạn 1 (三階, 七階, 地下一階)'],
    ['〜つ', 'ひとつ · ふたつ · **みっつ** · **よっつ** · いつつ · むっつ · ななつ · **やっつ** · ここのつ · とお', 'いちつ · につ · さんつ', 'Đoạn 3, 5'],
    ['Katakana trường âm', 'ー kéo dài nguyên âm trước 1 nhịp: エレベーター (ベー, ター) · コーヒー (コー, ヒー) · スーパー · ハンバーグ · ケーキ · ジュース', 'Bỏ ー: "e-re-be-ta", "ko-hi"', 'Mọi đoạn'],
    ['っ / ッ', 'Ngắt nửa nhịp: いらっしゃいませ · みっつ · トイレットペーパー', 'Bỏ ngắt', 'Đoạn 2, 3, 5'],
    ['Âm ghép + kéo dài', '{注文|ちゅうもん} chu-u · {牛肉|ぎゅうにく} gyu-u · {紅茶|こうちゃ} ko-u · {百|ひゃく} hya', '"chu-mon", "gyu-niku"', 'Đoạn 3, 6'],
    ['Từ chỉ thị', 'Đọc ĐÚNG chữ in: これ/それ/あれ · この/その/あの · ここ/そこ/あそこ', 'Tự đổi theo nghĩa', 'Đoạn 2, 4'],
  ],
  mc: [
    Q('「{三階|さんがい}」 — cách đọc **chuẩn của sách** là…', 'さんがい', 'さんばい | みっかい | さんがく', 'Sách dạy **さんがい** (3 + 階 → がい). さんかい cũng có người nói, nhưng đọc to trong thi nên dùng さんがい.'),
    Q('「{八百円|はっぴゃくえん}」 đọc là…', 'はっぴゃくえん', 'はちひゃくえん | はっひゃくえん | はちびゃくえん', '800 = **はっぴゃく**.'),
    Q('「{三万八千円|さんまんはっせんえん}」 đọc là…', 'さんまんはっせんえん', 'さんまんはちせんえん | さんぜんはちまんえん | みまんやっせんえん', '3万 = さんまん · 8千 = **はっせん**.'),
    Q('「{一万円|いちまんえん}」 đọc là…', 'いちまんえん', 'まんえん | ひとまんえん | いっまんえん', '10.000 phải có **いち**: いちまん.'),
    Q('「{六千円|ろくせんえん}」 đọc là…', 'ろくせんえん', 'ろっせんえん | ろくぜんえん | むせんえん', '6.000 = **ろくせん** (không đổi âm — khác 600 ろっぴゃく).'),
    Q('「{千二百円|せんにひゃくえん}」 đọc là…', 'せんにひゃくえん', 'いっせんにひゃくえん | せんにびゃくえん | ちにひゃくえん', '1.000 = **せん** (không いっせん) · 200 = にひゃく.'),
    Q('「{携帯電話|けいたいでんわ}」 đọc là…', 'けいたいでんわ', 'けいたいでんは | けいだいでんわ | けたいでんわ', 'け・い・た・い・で・ん・わ — わ trong từ đọc wa, viết わ.'),
    Q('「みっつ」 (3 cái) có mấy ký tự hiragana phải đọc?', '3 (み・っ・つ)', '2 (み・つ) | 4 (み・っ・っ・つ) | 1', 'っ cũng là một ký tự — đọc thiếu っ là sai 1 chữ (−0,2).'),
    Q('Khách nói 「**その** くつは？」. Nhân viên (đang cầm đôi giày) đáp…', 'これは イタリアの くつです。', 'それは イタリアの くつです。 | あれは イタリアの くつです。 | どれは イタリアの くつです。', 'Đồ ở gần người nói → **これ**. Đọc to thì đọc đúng chữ in trên đề.'),
  ],
  them: ['Bài 2 là bài **số**: trước khi đọc đoạn nào có giá tiền, viết riêng con số ra giấy và đọc to 3 lần (さんびゃく, はっぴゃく, はっせん…).'],
});

export const DOC_TO_B3: Lesson = baiDocTo(3, {
  ten: 'Bài 3 (lịch trình · một ngày)',
  doan: DOAN_B3,
  bay: [
    ['Giờ 4 · 7 · 9', '**よじ · しちじ · くじ** · rưỡi = **はん**', 'よんじ · ななじ · きゅうじ', 'Đoạn 1 (六時半, 十一時), 3 (九時, 七時), 5 (十時半)'],
    ['Phút', 'ぷん: 1 いっぷん · 3 さんぷん · 4 よんぷん · 6 ろっぷん · 8 はっぷん · 10 じゅっぷん — ふん: 2 · 5 · 7 · 9', 'Dùng ふん cho mọi số', '(đề hay có — xem bảng số Bài 3)'],
    ['〜ようび', 'よう kéo dài: げ・つ・よ・う・び (5 nhịp)', '"ge-tsu-yo-bi" (thiếu う)', 'Đoạn 2 (4 thứ), 3, 4'],
    ['ん + や/よ', 'Tách rõ: きん・ようび (kin\'yōbi)', 'Dính "ki-nyo-bi"', 'Đoạn 2 (金曜日)'],
    ['びょういん ≠ びよういん', '**びょういん** (bệnh viện, byo-u-i-n — 4 nhịp) · びよういん (bi-yo-u-i-n — 5 nhịp) là TIỆM LÀM TÓC', 'Tách び・よ thành tiệm tóc', 'Câu hỏi "どこへ行きますか"'],
    ['Âm ghép kéo dài', 'べん**きょう** · と**しょ**かん · **じゅぎょう** · **ゆう**びん**きょく**', '"ben-kyo", "ju-gyo"', 'Đoạn 1, 2, 3'],
    ['何 なに / なん', '**なに** trước を / も: 何を・何も · **なん** trước です / の: 何ですか', 'なんも · なにですか', 'Đoạn 4 (何も)'],
    ['Đuôi ます / です', 'す đọc rất nhẹ (mas / des) — vẫn đủ chữ', 'Nhấn "ma-SU", hoặc bỏ hẳn す', 'Mọi câu'],
    ['Ngày', 'いつか (5) · ようか (8) · はつか (20)', 'ごにち · はちにち · にじゅうにち', 'Đoạn 5 (五日)'],
    ['Mùa (một chữ đứng riêng)', 'Âm Kun: **はる · なつ · あき · ふゆ**', 'しゅん · か · しゅう · とう', 'Đoạn 7'],
    ['Katakana dài của Bài 3', 'ゴール・デン・ウイーク · イン・ター・ネッ・ト · バー・ベ・キュー · パー・ティー · アル・バイ・ト', 'Bỏ ー / ッ', 'Đoạn 1, 2, 3, 7'],
  ],
  mc: [
    Q('「{九時|くじ}」 đọc là…', 'くじ', 'きゅうじ | くうじ | ここのじ', '9 giờ = **くじ**.'),
    Q('「{七時|しちじ}」 đọc là…', 'しちじ', 'ななじ | しじ | ななつじ', '7 giờ = **しちじ**.'),
    Q('「{四時|よじ}」 đọc là…', 'よじ', 'よんじ | しじ | よっじ', '4 giờ = **よじ**.'),
    Q('「{十時半|じゅうじはん}」 đọc là…', 'じゅうじはん', 'じゅっじはん | じゅうじぱん | とおじはん', '10 giờ = じゅうじ (không っ) + はん.'),
    Q('「{金曜日|きんようび}」 romaji đúng là…', "kin'yōbi (kin-yo-u-bi)", 'kinyobi | kin-yo-bi | kinnyoubi', 'ん + よう: tách rõ, よう kéo dài.'),
    Q('Chọn từ nghĩa là "bệnh viện".', 'びょういん', 'びよういん | びょいん | びいよういん', 'びょういん = bệnh viện. びよういん = tiệm làm tóc.'),
    Q('「{果物|くだもの}」 đọc là…', 'くだもの', 'かぶつ | かもの | くだぶつ', 'Đọc đặc biệt **くだもの** (hoa quả).'),
    Q('「{何|なに}も {食|た}べません」 — 何 đọc là…', 'なに', 'なん | なにも | なんも', 'Trước も đọc **なに**.'),
    Q('「{五日|いつか}」 (ngày 5) đọc là…', 'いつか', 'ごにち | ごか | いつにち', 'Ngày 5 = **いつか**.'),
    Q('「{冬|ふゆ}」 đứng một mình đọc là…', 'ふゆ', 'とう | ふい | ふゆう', 'Chữ một mình → âm Kun **ふゆ**.'),
  ],
  them: ['Bài 3 là bài nặng điểm nhất của JPD113 (giờ · thứ · động từ) — đoạn mẫu trong hướng dẫn ôn thi của cô cũng là dạng "một tuần của tôi". Làm đủ 7 đoạn.'],
});

export const DOC_TO_B4: Lesson = baiDocTo(4, {
  ten: 'Bài 4 (thành phố · thời tiết · đi lại)',
  doan: DOAN_B4,
  bay: [
    ['Đuôi い của イA', 'Đọc đủ い: ふる**い** · あつ**い** · あま**い** · つめた**い**', 'Nuốt い cuối', 'Đoạn 1, 6'],
    ['Phủ định イA', '〜**くない**です: あつくない · あまくない (chữ Hán giữ nguyên: {甘|あま}くない)', '"あついじゃない"', 'Đoạn 3, 6'],
    ['ナA', 'きれい · しずか · にぎやか · ゆうめい + **な** + N; phủ định **じゃありません**', 'きれくない', 'Đoạn 1, 2, 4, 5'],
    ['Trường âm', '**とうきょう** (to-u-kyo-u) · **ゆうめい** · ほっ**かいどう** · **おお**い · **どう**', '"to-kyo", "yu-me"', 'Đoạn 2, 3, 4, 6'],
    ['Nhiều ん', '**しんかんせん** (shi-n-ka-n-se-n) · でんしゃ · おんせん', 'Nuốt ん giữa từ', 'Đoạn 2, 4, 5'],
    ['〜時間 ≠ 〜時', 'にじかん (2 **tiếng**) ≠ にじ (2 **giờ**) · {二時間半|にじかんはん} · {一時間半|いちじかんはん}', 'Bỏ かん', 'Đoạn 2, 4, 5'],
    ['Phút', 'じゅっぷん · さんじゅっぷん (っ + ぷ)', 'じゅうふん · さんじゅうふん', 'Đoạn 5'],
    ['Một chữ Hán đứng riêng', 'Âm Kun: 北 **きた** · 南 **みなみ** · 雪 **ゆき** · 海 **うみ**', 'Âm On: ほく · なん · せつ', 'Đoạn 1, 3, 4'],
    ['{歩|ある}いて', '**あるいて** — đi bộ, KHÔNG có で', 'あるいてで', 'Đoạn 5'],
    ['{一年中|いちねんじゅう}', 'i-chi-ne-n-**ju-u**', 'いちねんちゅう', 'Đoạn 3'],
  ],
  mc: [
    Q('「{東京|とうきょう}」 đọc là…', 'とうきょう', 'ときょう | とうきょ | ひがしきょう', 'Hai chỗ kéo dài: とう・きょう.'),
    Q('「{新幹線|しんかんせん}」 đọc là…', 'しんかんせん', 'しんかせん | しんかんせ | にいかんせん', 'Ba ん: しん・かん・せん.'),
    Q('「{一年中|いちねんじゅう}」 đọc là…', 'いちねんじゅう', 'いちねんちゅう | いちとしじゅう | ひとねんじゅう', '中 ở cuối từ chỉ "suốt…" đọc **じゅう**.'),
    Q('「ベトナムの {北|きた}です」 — 北 đọc là…', 'きた', 'ほく | ぼく | きたい', 'Chữ một mình → âm Kun **きた**.'),
    Q('「あまり {甘|あま}くないです」 đọc là…', 'あまり あまくないです', 'あまり あまいくないです | あまり あまいじゃないです | あまり かんくないです', '甘**い** → 甘**くない**.'),
    Q('「{有名|ゆうめい}な」 đọc là…', 'ゆうめいな', 'ゆめいな | ゆうめな | ありめいな', 'ゆう・めい — hai chỗ kéo dài.'),
    Q('「{歩|ある}いて じゅっぷん です」 nghĩa là…', 'Đi bộ mất 10 phút', 'Đi xe 10 phút | Chạy 10 phút | 10 giờ đi bộ', 'あるいて = đi bộ; じゅっぷん = 10 phút.'),
    Q('「{二時間半|にじかんはん}」 nghĩa là…', '2 tiếng rưỡi', '2 giờ rưỡi | 2 giờ 50 | 2 ngày rưỡi', '〜時間 = số TIẾNG; 〜時 = giờ trên đồng hồ.'),
    Q('「{冷|つめ}たい ビール」 — つめたい dùng cho…', 'Đồ vật / đồ uống lạnh khi chạm', 'Thời tiết lạnh | Căn phòng lạnh (trời lạnh) | Món cay', 'Trời lạnh = さむい; đồ lạnh = つめたい.'),
  ],
  them: ['Bài 4 chỉ vào đề JPD113 nếu lớp bạn học tới Bài 4 — nếu chưa, làm Bài 1–3 trước.'],
});
