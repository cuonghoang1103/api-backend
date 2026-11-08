/**
 * 🎤 THI CUỐI KỲ JPD123 (Nhật 2 · Bài 4–7, mở rộng 8–9) — ĐÚNG FORM ĐỀ CỦA CÔ.
 *
 *   THI_CUOI_KY_123: Lesson[] — id `b7-thi-thu-123-…` (kind `review`):
 *     a `b7-thi-thu-123-form`      Form đề & cách chấm thi nói
 *     b `b7-thi-thu-123-reading`   Part 1 Reading — 20 đoạn luyện đọc đúng khuôn
 *     c `b7-thi-thu-123-qa`        Part 2 Q&A — ngân hàng câu hỏi Bài 4.1 → 7 (+ 8–9)
 *     d `b7-thi-thu-123-de-1…10`   10 đề thi thử nói (1 đoạn Reading + 3 câu Q&A, câu ① theo tranh)
 *     e `b7-thi-thu-123-viet-a/b`  2 đề viết cuối kỳ (chữ Hán · từ vựng · ngữ pháp · đọc · dịch)
 *
 * KHUÔN ĐỀ (đối chiếu, KHÔNG chép câu/đoạn nào của cô):
 *  ① "JPD123 HD thi nói (Dành cho SV)": READING 45 · Q&A 45 (3 câu: 1 có tranh + 2 không tranh) · tác phong, độ
 *     trôi chảy, phát âm, chào hỏi 10. Bốc mã đề đọc A-1, A-2…, chuẩn bị 20 giây; mã Q&A B-1, B-2… (A và B có thể
 *     khác số). Không đổi đề. Mỗi câu hỏi tối đa 3 lần, mỗi lần nghĩ ≤ 10 giây. Bài đọc ~150 chữ, ngoài hiragana
 *     có tối thiểu 5–7 chữ Hán và 2–4 chữ katakana. Dạng câu hỏi tham khảo 第4課 (9) · 第5課 (8) · 第6課 (8) · 第7課 (9).
 *  ② "JPD123 Speaking Demo" Đề A-0 / Q&A B-0: đoạn ~6 dòng, các từ chữ Hán của lớp GẠCH CHÂN (không furigana: 今年・
 *     行きました・会いました・食べ物・食べました・時間・市), katakana gạch đỏ (ベトナム・ハノイ・ホーチミン), chữ Hán
 *     khác có furigana (月); từ lặp lần 2 không gạch. Q&A: ① tranh Hà Nội ✈ 2時間はん TP.HCM, ② 今、何が欲しいですか,
 *     ③ 春と夏とどちらが好きですか.
 *  ③ "Luyện nói" của cô Huyền: ngân hàng Q&A Bài 4.1 (6) · 4.2 (10) · 4.3 (4) · 5.1 (10) · 5.2 (5) · 5.3 (5) ·
 *     6.1 (5) · 6.2 (5) · 6.3 (5) · 7 tranh phố (7) · 7 tranh người (5) = 67 câu — ĐỦ cả 67 ở mục c.
 *  ④ "Chữ Hán (1).pdf" — danh sách chữ Hán CHÍNH THỨC Bài 1–7 (xem `CHU_LOP` dưới) — chữ in đậm trên tờ đề chỉ
 *     lấy trong danh sách này (đoạn mở rộng Bài 8–9 thêm chữ dự kiến của hanLop.ts, có ghi rõ).
 *  ⑤ Cách trừ điểm chi tiết: tài liệu JPD123 KHÔNG ghi; chỉ có ở "Hướng dẫn ôn thi nói JPD113" (09/06/2025) — dùng
 *     làm tham khảo và ghi rõ là tham khảo.
 *
 * DSL câu Nhật (như thiThu113.ts): từ cách nhau dấu cách, trợ từ は/へ/を… đứng riêng một từ để romaji tự sinh đúng
 * (Hepburn, trường âm viết đôi: toukyou, koohii); `{漢字|かな}` = furigana; `{!漢字|かな}` = chữ Hán CỦA LỚP được
 * gạch chân trên đề (tờ đề in **đậm**, KHÔNG furigana); `-` nối không cách (ワン-さん → ワンさん · Wan-san);
 * `^` viết hoa romaji (tên riêng).
 */
import type { Block, Lesson, Role } from '@/components/sach-hoc/types';

/* ══════════════ romaji tự động từ kana (cùng luật thiThu113.ts / jp113B3.ts) ══════════════ */

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
const PUN: Record<string, string> = { '。': '.', '、': ',', '？': '?', '！': '!', '…': '...', '「': '"', '」': '"', '〜': '~', '～': '~', '：': ':' };

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
    if (c === 'ん') { push(n && /[あいうえおやゆよ]/.test(n) ? "n'" : 'n'); continue; }
    if (KS[c] !== undefined && n && KS_SMALL[n]) {
      const base = KS[c];
      const y = KS_SMALL[n];
      push(/^(shi|chi|ji)$/.test(base) ? base.slice(0, -1) + y : base.slice(0, -1) + 'y' + y);
      i++;
      continue;
    }
    if (KS[c] !== undefined) { push(KS[c]); continue; }
    if (PUN[c] !== undefined) { out += PUN[c]; continue; }
    if (/[ぁぃぅぇぉ]/.test(c)) continue;
    if (/[（）()・\s]/.test(c)) continue;
    out += c;
  }
  return out;
}
/** Cách đọc (bỏ chữ Hán, giữ kana): {漢字|かな} / {!漢字|かな} → かな. */
const reading = (t: string) => t.replace(/\{!?([^|}]+)\|([^}]+)\}/g, '$2');

function tok(t: string): [string, string] {
  let cap = false;
  let x = t;
  if (x.startsWith('^')) { cap = true; x = x.slice(1); }
  const ja = x.replace(/-/g, '').replace(/\{!/g, '{');
  const body = reading(x).replace(/[。、？！「」]+$/, '');
  const tail = reading(x).slice(body.length);
  let rom: string;
  if (body === 'は' || WA_COMBO.has(body)) rom = body === 'は' ? 'wa' : kanaToRo(body.slice(0, -1)) + 'wa';
  else if (body === 'へ') rom = 'e';
  else rom = body.split('-').map(kanaToRo).join('-');
  rom = sua(rom).replace(/\.{4,}/g, '...');
  // V(bỏ ます) + に 行きます: 見に → "mi ni", 食べに → "tabe ni", しに → "shi ni".
  if (/(\}[ぁ-ゖ]*|^し)に$/.test(x.replace(/[。、？！]+$/, '')) && body !== 'に') rom = rom.replace(/ni$/, ' ni');
  rom += kanaToRo(tail);
  if (cap || TEN_RIENG.test(rom)) rom = rom.charAt(0).toUpperCase() + rom.slice(1);
  return [ja, rom];
}
/** Tên riêng viết hoa romaji (khớp cả từ, không khớp nihongo / nihonjin). */
const TEN_RIENG = /^(nihon|toukyou|kyouto|oosaka|hokkaidou|betonamu|hanoi|hoochimin|danan|fue|haifon|nyachan|tai|indo|oosutoraria|amerika|chuugoku|kankoku|fujisan|hoarakku|sapa|furansu|igirisu|teto|sokuson|hon-gawa|sukaitsurii|haron|kauzai|paku|karurosu|mearii|wan|natapon|mai|namu|min|tanaka|mimi|yamakawa|danieru)(?![a-z])/;
/** Tách từ romaji theo thói quen của các tệp bài: dono kurai · kirei na · masen deshita · nijikan han. */
function sua(r: string): string {
  return r
    .replace(/masendeshita/g, 'masen deshita')
    .replace(/^donokurai/, 'dono kurai')
    .replace(/^(kirei|nigiyaka|shizuka|yuumei|hima|kantan|taihen|suki|kirai|jouzu|heta|genki|shinsetsu|majime|zannen|iroiro|suteki|benri|daisuki|kiree)na$/, '$1 na')
    .replace(/jikan(?=[a-z])/g, 'jikan ')
    .replace(/jihan$/, 'ji han')
    .replace(/^desukara/, 'desu kara');
}
const toks = (s: string) => s.trim().split(/\s+/).filter(Boolean);
/** Chữ Nhật có furigana (bỏ dấu cách của DSL). */
const J = (s: string): string => toks(s).map((t) => tok(t)[0]).join('');
/** Romaji Hepburn tách từ, viết hoa đầu câu. */
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
const bare = (s: string) => s.replace(/\{!?([^|}]+)\|[^}]+\}/g, '$1');
/** Câu hỏi cho khối 🎤 (hiện chữ thô, không hiểu furigana) — viết kana, trợ từ dính từ trước như đề in. */
const TRO = new Set(['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'の', 'から', 'まで', 'か。', 'か', 'ね。', 'よ。', 'や', 'より']);
const SQ = (s: string): string => {
  let out = '';
  for (const t of toks(s)) {
    const k = reading(t.replace(/^\^/, '').replace(/-/g, ''));
    out += TRO.has(k) || /^[、。？]/.test(k) ? k : (out ? ' ' : '') + k;
  }
  return out;
};

/* ══════════════ khối gọn ══════════════ */

const H = (text: string): Block => ({ t: 'h', text });
const P = (text: string): Block => ({ t: 'p', text });
const NOTE = (title: string, items: string[]): Block => ({ t: 'note', title, items });
const TABLE = (head: string[], rows: string[][], caption?: string): Block => ({ t: 'table', head, rows, caption });
const RECAP = (title: string, items: string[]): Block => ({ t: 'recap', title, items });
const CANH = (anh: string[], caption: string): Block => ({ t: 'canh', anh, caption });
/** Ô bảng: chữ Nhật (furigana) + romaji. */
const JR = (s: string): string => `${J(s)} *${R(s)}*`;

let MC_N = 0;
/** Trắc nghiệm: `bad` = các đáp án sai cách nhau " | "; vị trí đáp án đúng xoay vòng để không dồn một chỗ. */
const Q = (q: string, ok: string, bad: string, why: string) => {
  const b = bad.split(' | ');
  const pos = (MC_N++ * 3 + 1) % (b.length + 1);
  const options = [...b];
  options.splice(pos, 0, ok);
  return { q, options, correct: pos, why };
};
type QI = ReturnType<typeof Q>;
const MC = (id: string, title: string, items: QI[]): Block => ({ t: 'mcq', id, title, items });

/**
 * Đáp án gõ tay: viết một lần bằng {漢字|かな}, sinh đủ cách viết chữ Hán / kana (máy chấm đã tự bỏ dấu câu,
 * dấu cách). Như V() của onCuoiKy.ts.
 */
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
    let acc = [''];
    for (const s of slots) acc = acc.flatMap((a) => s.map((c) => a + c));
    acc.slice(0, 256).forEach((a) => out.add(a));
  }
  return [...out];
};

type Vai = 'examiner' | 'candidate';
/** Dòng hội thoại giám thị ↔ thí sinh (DSL → chữ có furigana + romaji). */
const DX = (role: Vai, s: string, vi: string, who?: string) => ({
  who: who ?? (role === 'examiner' ? 'Giám thị' : 'Bạn'), role: role as Role, text: J(s), ro: R(s), vi,
});
const DLG = (title: string, lines: ReturnType<typeof DX>[]): Block => ({ t: 'dialogue', title, lines });

/* ══════════════ chữ Hán của lớp (danh sách CHÍNH THỨC — "Chữ Hán (1).pdf") ══════════════ */

export const CHU_LOP: Record<number, string> = {
  1: '私人才学生校日本語',
  2: '一二三四五六七八九十百千万円',
  3: '月火水木金土日曜何年時間分',
  4: '東京名前国男女区市',
  5: '先週毎午後見食飲買物行休',
  6: '今来帰会社聞読書話',
  7: '寺言貝田力門肉料理野半大小',
};
/** Chữ dự kiến Bài 8–9 (hanLop.ts) — chỉ dùng cho đoạn "mở rộng Bài 8–9". */
const CHU_MO_RONG = '父母兄弟姉妹子目口耳足長泳乗習運転集描歌遊';

/* ══════════════ đoạn đọc (Part 1 Reading) ══════════════ */

/** Một đoạn đọc kiểu đề. `cau` = [câu DSL, nghĩa Việt]; `mo` = đoạn mở rộng Bài 8/9. */
type Doan = { ma: string; ten: string; mo?: string; cau: [string, string][]; meo?: string[] };

/** Tờ đề: chữ Hán của lớp (`{!…}`) in **đậm** không furigana; chữ Hán khác giữ furigana; katakana (lần đầu) tô ==…==. */
function toDe(d: Doan): string {
  const seen = new Set<string>();
  return d.cau
    .map(([s]) =>
      toks(s)
        .map((t0) => {
          const t = t0.replace(/^\^/, '').replace(/-/g, '');
          if (t.includes('{!')) {
            const m = /^(.*?)([。、？！]*)$/.exec(t)!;
            return `**${bare(m[1])}**${m[2]}`;
          }
          return t.replace(/\{!/g, '{').replace(/[ァ-ヶー]{2,}/g, (k) => {
            if (seen.has(k)) return k;
            seen.add(k);
            return `==${k}==`;
          });
        })
        .join(''),
    )
    .join('');
}

/** Đếm như cách tính độ dài đề: số ký tự (bỏ dấu câu), từ chữ Hán gạch chân, từ katakana, chữ Hán khác. */
export function demDoan(d: Doan) {
  const tran = bare(d.cau.map(([s]) => J(s)).join(''));
  const kyTu = tran.replace(/[。、？！「」\s]/g, '').length;
  const gach: string[] = [];
  const kata = new Set<string>();
  for (const [s] of d.cau) {
    for (const t of toks(s)) {
      if (t.includes('{!')) gach.push(bare(t.replace(/^\^/, '').replace(/-/g, '')).replace(/[。、？！]+$/, ''));
      for (const k of bare(t).match(/[ァ-ヶー]{2,}/g) ?? []) kata.add(k);
    }
  }
  const gachChu = gach.join('').replace(/[^一-鿿]/g, '');
  return { kyTu, gach, kata: [...kata], gachChu };
}

/** Bộ khối cho một đoạn: tiêu đề → tờ đề → đếm → máy chấm phát âm từng câu → đọc chữ trần cả đoạn. */
function khoiDoan(d: Doan, id: string, tieuDe?: string): Block[] {
  const c = demDoan(d);
  return [
    H(tieuDe ?? `${d.ma} — ${d.ten}${d.mo ? ` (mở rộng ${d.mo})` : ''}`),
    P(toDe(d)),
    P(`*Tờ đề như thật:* chữ **in đậm** = từ chữ Hán của lớp bị GẠCH CHÂN (không furigana — phải tự đọc) · ==tô vàng== = katakana gạch đỏ · chữ Hán khác có furigana. Đoạn này: **${c.kyTu} ký tự** · ${c.gach.length} từ chữ Hán gạch chân (${c.gach.join('・')}) · ${c.kata.length} từ katakana (${c.kata.join('・')}). 20 giây đọc thầm → đọc to MỘT lượt.`),
    ...(d.meo?.length ? [NOTE('Chỗ dễ đọc sai trong đoạn này', d.meo)] : []),
    {
      t: 'phatam',
      id: `${id}-cham`,
      title: 'Máy chấm phát âm — đọc từng câu',
      note: 'Đọc to từng câu cho máy chấm; từ bị tô đỏ là chỗ giám thị sẽ trừ điểm (thi thật: mỗi ký tự đọc sai bị trừ — tham khảo JPD113: −0,2/ký tự).',
      items: d.cau.map(([s, vi]) => ({ text: J(s), ipa: R(s), vi })),
    },
    {
      t: 'readkanji',
      id: `${id}-tran`,
      title: 'Đọc lại cả đoạn — chữ Hán TRẦN, không furigana (khó hơn đề thật)',
      note: 'Đọc to cả đoạn không dừng, rồi mới bấm "Xem cách đọc + nghe". Chạm vào chữ Hán để mở thẻ chữ.',
      items: [{ text: d.cau.map(([s]) => J(s)).join(''), ro: d.cau.map(([s]) => R(s)).join(' '), vi: d.cau.map(([, v]) => v).join(' ') }],
    },
  ];
}

/* ═══════════════════ a. FORM ĐỀ & CÁCH CHẤM ═══════════════════ */

const FORM: Lesson = {
  id: 'b7-thi-thu-123-form',
  kind: 'review',
  title: 'Thi nói cuối kỳ JPD123 — form đề của cô, cách chấm, mẹo giữ điểm, lỗi mất điểm',
  goal: 'Biết chính xác đề thi nói JPD123 trông thế nào (Reading 45 · Q&A 45 · tác phong 10), giám thị chấm những gì, và có sẵn quy trình + câu nói từng bước để không mất điểm oan.',
  minutes: 30,
  blocks: [
    RECAP('Đọc trước tiên — đề thi nói JPD123 (Nhật 2) theo hướng dẫn của cô', [
      '**Thi cuối kỳ chiếm 50% điểm môn** (theo lời người học). Thi nói là vấn đáp 1–1 với giám thị, gồm **2 phần**.',
      '**Part 1 READING — 45 điểm**: bốc thăm mã đề đọc (**A-1, A-2…**), **chuẩn bị 20 giây**, rồi đọc to một đoạn **khoảng 150 chữ** (ngoài hiragana có **tối thiểu 5–7 chữ Hán** và **2–4 chữ katakana**).',
      '**Part 2 Q&A — 45 điểm**: trả lời **3 câu hỏi** của giám thị từ mã đề **B-1, B-2…**: **1 câu có tranh + 2 câu không tranh**. Mã A và mã B **có thể khác số** (vd. bốc A3 và B9).',
      '**10 điểm còn lại**: tác phong, độ trôi chảy, phát âm, **chào hỏi**.',
      'Luật phòng thi: mang **giấy tờ có ảnh** (CCCD, thẻ SV) · **không được đổi đề** · mỗi câu hỏi được hỏi **tối đa 3 lần**, mỗi lần **không nghĩ quá 10 giây**.',
    ]),
    H('1. Cơ cấu điểm (đúng "JPD123 HD thi nói")'),
    TABLE(
      ['Phần', 'Điểm', 'Bạn làm gì', 'Bài luyện trong mục này'],
      [
        ['Part 1 · READING', '**45**', 'Bốc mã A → 20 giây đọc thầm → đọc to cả đoạn (~150 chữ, 5–7 từ chữ Hán gạch chân, 2–4 từ katakana)', '`b7-thi-thu-123-reading` — 20 đoạn đúng khuôn'],
        ['Part 2 · Q&A', '**45** (3 câu)', 'Câu ① nhìn tranh trả lời · câu ② ③ về bản thân bạn', '`b7-thi-thu-123-qa` — đủ 67 câu ngân hàng của cô + bổ sung'],
        ['Tác phong · trôi chảy · phát âm · chào hỏi', '**10**', 'Chào khi vào/ra, nói rõ, không im lặng lâu', 'Mục 3 bên dưới'],
        ['Tổng', '**100**', '', '10 đề thi thử `b7-thi-thu-123-de-1…10`'],
      ],
    ),
    H('2. Tờ đề Speaking Demo của cô — nhìn ra khuôn'),
    P('Đề **A-0** của cô là một đoạn **6 dòng** kể chuyến đi Việt Nam tháng 8 (đến Hà Nội, gặp bạn, đi nhà thờ nổi tiếng, ăn nhiều, không kịp đi TP.HCM, muốn đi lần nữa). Phân tích tờ đề — mọi đoạn luyện trong mục này làm **đúng khuôn này**:'),
    TABLE(
      ['Trên tờ đề', 'Trong đề A-0', 'Ý nghĩa với bạn'],
      [
        ['Từ chữ Hán **gạch chân đen, không furigana**', '**今年・行きました・会いました・食べ物・食べました・時間・(ホーチミン)市** — 7 từ', 'Đây là chữ Hán **của lớp** (danh sách chữ Hán Bài 1–7). Phải **tự đọc** → học thuộc cách đọc **theo từ**.'],
        ['Từ katakana **gạch đỏ**', '**ベトナム・ハノイ・ホーチミン** — 3 từ', 'Đọc katakana chậm, đúng trường âm ー (ホ**ー**チミン = *hoo*).'],
        ['Chữ Hán **có furigana**', '月 (がつ) trong ８月', 'Chữ không bắt đọc trần → cứ đọc theo furigana.'],
        ['Từ lặp lại **lần 2 không gạch**', '行きました (lần 2), ホーチミン市 (lần 2)', 'Lần 2 không có gạch nhưng **vẫn là chữ Hán trần** → đọc như lần 1.'],
        ['Còn lại', 'hiragana: わたしは、ともだち、きょうかい、いっしょに…', 'Phần lớn điểm nằm ở đây — đọc **đủ từng âm**: っ (いっしょ), trường âm (ゆうめい, きょうかい), は đọc *wa*, へ đọc *e*.'],
      ],
    ),
    P('Đề **Q&A B-0**: ① **có tranh** — Hà Nội → ✈ (mũi tên ghi **2時間はん**) → TP.HCM, hỏi 「ハノイからホーチミンまでどのくらいですか。」 · ② 「{今|いま}、{何|なに}が{欲|ほ}しいですか。」 · ③ 「{春|はる}と{夏|なつ}とどちらが{好|す}きですか。」'),
    { t: 'canh', anh: ['cityscape', 'airplane', 'cityscape-at-dusk'], caption: 'Tranh câu ① của đề B-0: ハノイ → ✈ 2時間はん → ホーチミン' },
    DLG('Q&A B-0 — câu trả lời điểm cao', [
      DX('examiner', '^ハノイ から ^ホーチミン まで どのくらい です か。', 'Từ Hà Nội đến TP.HCM mất bao lâu?'),
      DX('candidate', '{飛行機|ひこうき} で {二時間半|にじかんはん} です。', 'Đi máy bay mất 2 tiếng rưỡi.'),
      DX('examiner', '{今|いま}、 {何|なに} が {欲|ほ}しい です か。', 'Bây giờ bạn muốn có gì?'),
      DX('candidate', '{新|あたら}しい パソコン が {欲|ほ}しい です。 {今|いま} の パソコン は ふるい です から。', 'Tôi muốn có máy tính mới. Vì máy tính bây giờ cũ rồi.'),
      DX('examiner', '{春|はる} と {夏|なつ} と どちら が {好|す}き です か。', 'Mùa xuân và mùa hè, bạn thích mùa nào hơn?'),
      DX('candidate', '{春|はる} の ほう が {好|す}き です。 {春|はる} は {暖|あたた}かい です から。', 'Tôi thích mùa xuân hơn. Vì mùa xuân ấm áp.'),
    ]),
    NOTE('Câu ① là câu NHÌN TRANH — đọc đúng số trên tranh', [
      'Tranh ghi **2時間はん** ⇒ trả lời **{二時間半|にじかんはん}** (2 tiếng **rưỡi**), không phải 「{二時間|にじかん}くらい」. Nói sai số trên tranh = sai nội dung.',
      'Có phương tiện trên tranh (✈) ⇒ nói luôn **{飛行機|ひこうき}で** — câu trả lời đủ ý hơn.',
    ]),
    H('3. Trong phòng thi — từng bước và câu nói'),
    TABLE(
      ['Bước', 'Bạn làm', 'Câu nói'],
      [
        ['1', 'Gõ cửa, vào, cúi chào', `${JR('しつれい します。')} — Xin phép (vào).`],
        ['2', 'Đưa CCCD/thẻ SV, chào', `${JR('よろしく おねがい します。')} — Mong thầy/cô giúp đỡ.`],
        ['3', 'Bốc mã A → **20 giây** đọc thầm: dò từ chữ Hán gạch chân + katakana', '(không nói)'],
        ['4', 'Đọc to cả đoạn — chậm, đều, rõ; đọc sai thì đọc lại ngay từ đó', '—'],
        ['5', 'Bốc mã B → nghe từng câu hỏi → trả lời **TRỌN CÂU** + thêm 1 câu (lý do / chi tiết)', 'Xem mục `b7-thi-thu-123-qa`'],
        ['6', 'Chưa nghe rõ: xin hỏi lại (mỗi câu tối đa 3 lần, mỗi lần nghĩ ≤ 10 giây)', `${JR('すみません、 もう いちど おねがい します。')}`],
        ['7', 'Xong: cảm ơn, chào, ra', `${JR('ありがとう ございました。 しつれい します。')}`],
      ],
    ),
    H('4. Giám thị trừ điểm thế nào (tham khảo)'),
    P('"JPD123 HD thi nói" **không ghi mức trừ chi tiết**. Bảng dưới lấy từ **"Hướng dẫn ôn thi nói JPD113" (09/06/2025)** của cùng bộ môn — dùng để **luyện cho an toàn**, không phải quy định chính thức của JPD123.'),
    TABLE(
      ['Lỗi', 'Mức trừ (JPD113)', 'Cách tránh'],
      [
        ['Đọc sai một ký tự (Reading)', '−0,2 / ký tự', 'Học thuộc cách đọc từ chữ Hán của lớp; luyện máy chấm phát âm từng câu'],
        ['Câu trả lời sai làm **hiểu sai cả câu** (sai nội dung, sai thì)', 'mất hết điểm câu đó', 'Nghe kỹ từ để hỏi + thì của câu hỏi (ました hỏi quá khứ → trả lời ました)'],
        ['Lỗi không đổi nghĩa — vd. **quên はい／いいえ**', 'trừ tối đa 5', 'Câu hỏi Có/Không (…ますか／…ですか) ⇒ LUÔN mở đầu はい／いいえ'],
        ['Đúng ngữ pháp, hiểu câu hỏi nhưng **sai từ vựng**', 'tối đa 3 điểm', 'Không chắc từ thì dùng từ khác chắc chắn (大学 ↔ がっこう)'],
        ['**Sai trợ từ**', '−2', 'Học khung câu: N **が** すき／ほしい · N **に** あります · N **で**（phương tiện） · あるいて (không で)'],
        ['Ngập ngừng', '≤ 5% mỗi đầu điểm', 'Thuộc lòng khung trả lời; được nói 「えーと…」 nhưng đừng im quá 10 giây'],
      ],
    ),
    H('5. Mẹo giữ điểm — và 8 lỗi mất điểm hay gặp nhất'),
    NOTE('Mẹo giữ điểm', [
      '**20 giây chuẩn bị** = đọc thầm một lượt, **chỉ dừng ở từ in đậm (chữ Hán gạch chân) và katakana** — nhẩm cách đọc trong đầu.',
      'Đọc **chậm và đều** — không ai trừ điểm vì đọc chậm; đọc nhanh mới vấp.',
      'Q&A: **nhắc lại khung câu hỏi** trong câu trả lời (どこ**に ありますか** → 〜**に あります**) — vừa đúng ngữ pháp vừa có thời gian nghĩ.',
      'Luôn **thêm một câu**: lý do (〜から), cảm nhận (とても〜です), chi tiết (そして、〜). Câu trả lời 2 câu nghe trôi chảy hơn hẳn.',
      'Câu ① có tranh: **nói đúng thông tin trên tranh** (số giờ, vị trí, hành động), không bịa thêm.',
      'Câu ②③ về bản thân: không cần nói thật — chọn câu **bạn nói chắc đúng** (dễ, ngắn, đúng trợ từ).',
    ]),
    TABLE(
      ['#', 'Lỗi mất điểm', 'Sửa'],
      [
        ['1', 'Đọc 行きました thành *gyokimashita* / 来ました thành *raimashita*', 'Chữ Hán + đuôi kana ⇒ đọc **kun**: いきました · きました'],
        ['2', 'は đọc *ha*, へ đọc *he*, を đọc *wo*', 'Trợ từ: は = **wa** · へ = **e** · を = **o**'],
        ['3', 'Nuốt trường âm: とうきょう → *tokyo*, ゆうめい → *yume*', 'Kéo dài đủ: **too**kyoo · **yuu**mei'],
        ['4', 'Bỏ âm ngắt っ: いっしょ → *isho*', 'Ngắt một nhịp: **is-sho**'],
        ['5', 'Trả lời cụt 「ハノイです。」', 'Trọn câu: 「ハノイは ベトナムの きたに あります。」'],
        ['6', 'Quên はい／いいえ ở câu Có/Không', 'Mở đầu はい／いいえ rồi mới nói tiếp'],
        ['7', 'もう〜ましたか → 「いいえ、〜ませんでした」', 'Chưa làm ⇒ **いいえ、まだです。**'],
        ['8', 'すき／ほしい／わかります đi với を', 'Luôn **が**: サッカー**が** すきです'],
      ],
    ),
    MC('b7-tt123-form-kiem', 'Kiểm tra: bạn đã nắm form đề chưa? (6 câu)', [
      Q('Thi nói JPD123: Reading được bao nhiêu điểm?', '45 điểm', '40 điểm | 55 điểm | 50 điểm', '"JPD123 HD thi nói": **READING 45/100**. (40 là của JPD113.)'),
      Q('Phần Q&A có mấy câu?', '3 câu — 1 có tranh, 2 không tranh', '4 câu — 3 có tranh, 1 không tranh | 2 câu không tranh | 5 câu', 'JPD123: **3 câu** (1 tranh + 2 không tranh). 4 câu là khuôn JPD113.'),
      Q('Bạn có bao lâu để chuẩn bị bài đọc?', '20 giây', '30 giây | 1 phút | Không được chuẩn bị', 'JPD123: **20 giây** (JPD113 là 30 giây).'),
      Q('Trên tờ đề, từ chữ Hán bị gạch chân thì…', 'không có furigana — phải tự đọc', 'có furigana bên trên | được bỏ qua không đọc | đọc theo âm Hán Việt', 'Từ chữ Hán của lớp gạch chân **không có furigana**; chữ Hán khác mới có furigana (như 月 trong ８月).'),
      Q('Mỗi câu hỏi được hỏi tối đa mấy lần?', '3 lần, mỗi lần nghĩ không quá 10 giây', '1 lần | 2 lần, không giới hạn thời gian | Không giới hạn', 'Đúng hướng dẫn: **tối đa 3 lần**, mỗi lần **≤ 10 giây**.'),
      Q('Tranh ghi 「２時間はん」, giám thị hỏi 「どのくらいですか」. Trả lời tốt nhất:', '{飛行機|ひこうき}で {二時間半|にじかんはん}です。', '{二時間|にじかん}です。 | {飛行機|ひこうき}です。 | はい、どのくらいです。', 'Nói **đúng số trên tranh** (2 tiếng **rưỡi**) + phương tiện で.'),
    ]),
  ],
};

/* ═══════════════════ b. PART 1 READING — 20 ĐOẠN ═══════════════════ */

const DOAN_20: Doan[] = [
  {
    ma: 'R-01', ten: 'Chuyến đi Đà Nẵng',
    cau: [
      ['{!先週|せんしゅう}、 {家族|かぞく} と ^ダナン へ {!行|い}きました。', 'Tuần trước tôi đi Đà Nẵng cùng gia đình.'],
      ['^ハノイ から {飛行機|ひこうき} で {!一時間半|いちじかんはん} でした。', 'Từ Hà Nội đi máy bay mất 1 tiếng rưỡi.'],
      ['ダナン は {海|うみ} が きれいな {町|まち} です。', 'Đà Nẵng là thành phố có biển đẹp.'],
      ['ホテル は {海|うみ} の ちかく に ありました。 {天気|てんき} も よかった です。', 'Khách sạn ở gần biển. Thời tiết cũng đẹp.'],
      ['ひる、 {海|うみ} の ちかく の レストラン で おいしい {魚|さかな} を {!食|た}べました。', 'Buổi trưa tôi ăn cá ngon ở nhà hàng gần biển.'],
      ['よる、 ホテル の へや から {海|うみ} を {!見|み}ました。', 'Buổi tối tôi ngắm biển từ phòng khách sạn.'],
      ['とても たのしかった です から、 また {!来年|らいねん} {!行|い}きたい です。', 'Vì rất vui nên sang năm tôi muốn đi nữa.'],
    ],
    meo: ['一時間半 = いちじかん**はん** (rưỡi) — đọc liền một hơi.', '来年 = **らい**ねん (không đọc きねん).'],
  },
  {
    ma: 'R-02', ten: 'Cuối tuần đi mua sắm',
    cau: [
      ['{先週|せんしゅう} の {!土曜日|どようび}、 {友達|ともだち} と デパート へ {!買|か}い{!物|もの} に {行|い}きました。', 'Thứ Bảy tuần trước tôi đi trung tâm thương mại mua sắm với bạn.'],
      ['{新|あたら}しい {服|ふく} を {見|み}ました が、 {高|たか}かった です。', 'Tôi đã xem quần áo mới nhưng đắt.'],
      ['デパート は とても にぎやか でした。', 'Trung tâm thương mại rất nhộn nhịp.'],
      ['ですから、 {何|なに} も {買|か}いませんでした。', 'Vì vậy tôi không mua gì cả.'],
      ['それから、 カフェ で コーヒー を {!飲|の}みました。', 'Sau đó tôi uống cà phê ở quán cà phê.'],
      ['カフェ の ケーキ も おいしかった です。', 'Bánh ngọt ở quán cà phê cũng ngon.'],
      ['{!日曜日|にちようび} は どこ へ も {行|い}きませんでした。', 'Chủ nhật tôi không đi đâu cả.'],
      ['うち で {!休|やす}みました。 {!午後|ごご} は ほん を {!読|よ}みました。', 'Tôi nghỉ ở nhà. Buổi chiều tôi đọc sách.'],
    ],
    meo: ['買い物 = かい**もの** — 物 trong từ này đọc もの.', 'どこへも = *doko e mo* (へ đọc e).'],
  },
  {
    ma: 'R-03', ten: 'Sở thích nghe nhạc',
    cau: [
      ['{私|わたし} の しゅみ は {音楽|おんがく} です。', 'Sở thích của tôi là âm nhạc.'],
      ['{!毎日|まいにち}、 でんしゃ の {中|なか} で ジャズ を {!聞|き}きます。', 'Ngày nào tôi cũng nghe nhạc jazz trên tàu điện.'],
      ['{!金曜日|きんようび} の よる、 {友達|ともだち} と カラオケ に {行|い}きます。', 'Tối thứ Sáu tôi đi karaoke với bạn.'],
      ['カラオケ は {駅|えき} の ちかく に あります。 いつも {十時|じゅうじ} まで うたいます。', 'Quán karaoke ở gần ga. Lúc nào chúng tôi cũng hát đến 10 giờ.'],
      ['{私|わたし} は {!日本|にほん} の うた を うたいます。', 'Tôi hát bài hát Nhật.'],
      ['うた は あまり じょうず じゃ ありません が、 とても たのしい です。', 'Tôi hát không giỏi lắm nhưng rất vui.'],
      ['{!来週|らいしゅう} の {金曜日|きんようび} も みんな と {!行|い}きたい です。', 'Thứ Sáu tuần sau tôi cũng muốn đi với mọi người.'],
    ],
    meo: ['聞きます = **き**きます (đừng đọc もん/ぶん).', 'じゃ ありません — じゃ là một âm *ja*.'],
  },
  {
    ma: 'R-04', ten: 'Cuối tuần về nhà',
    cau: [
      ['{私|わたし} の {家族|かぞく} は ^ハイフォン に います。', 'Gia đình tôi ở Hải Phòng.'],
      ['{!毎週|まいしゅう} {土曜日|どようび}、 バス で うち へ {!帰|かえ}ります。', 'Thứ Bảy hằng tuần tôi về nhà bằng xe buýt.'],
      ['^ハノイ から {!二時間|にじかん} くらい です。', 'Từ Hà Nội mất khoảng 2 tiếng.'],
      ['バス は {安|やす}い です から、 いつも バス で {帰|かえ}ります。', 'Vì xe buýt rẻ nên tôi luôn về bằng xe buýt.'],
      ['{!日曜日|にちようび} の あさ、 {家族|かぞく} と いっしょ に いちば へ {行|い}きます。', 'Sáng Chủ nhật tôi cùng gia đình đi chợ.'],
      ['いちば で やさい と くだもの を {買|か}います。', 'Ở chợ chúng tôi mua rau và hoa quả.'],
      ['{!午後|ごご} は うち で テレビ を {!見|み}ます。', 'Buổi chiều tôi xem tivi ở nhà.'],
      ['{月曜日|げつようび} の あさ、 また バス で {大学|だいがく} へ {行|い}きます。', 'Sáng thứ Hai tôi lại đi xe buýt lên trường.'],
    ],
    meo: ['帰ります = **かえ**ります (về nhà).', '毎週 = まい**しゅう** (âm ghép しゅ + trường âm う).'],
  },
  {
    ma: 'R-05', ten: 'Quê tôi — Huế',
    cau: [
      ['{!私|わたし} の {町|まち} は ^フエ です。', 'Thành phố của tôi là Huế.'],
      ['^ベトナム の {真|ま}ん{中|なか} に あります。', 'Ở miền Trung Việt Nam.'],
      ['フエ は しずかな {町|まち} です。 そして、 とても きれい です。', 'Huế là thành phố yên tĩnh. Và rất đẹp.'],
      ['{町|まち} の {中|なか} に ふるい おしろ と おてら が あります。', 'Trong thành phố có kinh thành cổ và chùa.'],
      ['おしろ は とても {有名|ゆうめい} です。 フエ は あめ が {多|おお}い です。', 'Kinh thành rất nổi tiếng. Huế mưa nhiều.'],
      ['フエ の {!料理|りょうり} は すこし からい です が、 おいしい です。', 'Món ăn Huế hơi cay nhưng ngon.'],
      ['{!八月|はちがつ} は とても あつい です から、 {!三月|さんがつ} に {!来|き}て ください。', 'Tháng 8 rất nóng nên hãy đến vào tháng 3.'],
    ],
    meo: ['料理 = **りょう**り (âm ghép りょ + う).', '来てください = **き**てください (来 trước て đọc き).'],
  },
  {
    ma: 'R-06', ten: 'Trường của tôi',
    cau: [
      ['{私|わたし} は ^FPT {!大学|だいがく} の {!学生|がくせい} です。', 'Tôi là sinh viên Đại học FPT.'],
      ['{大学|だいがく} は ^ホアラック に あります。', 'Trường ở Hòa Lạc.'],
      ['うち から バス で {!四十分|よんじゅっぷん} くらい です。', 'Từ nhà đi xe buýt khoảng 40 phút.'],
      ['{大学|だいがく} の たてもの は {新|あたら}しい です。 そして、 {緑|みどり} が {多|おお}い です。', 'Toà nhà của trường mới. Và nhiều cây xanh.'],
      ['としょかん の {!前|まえ} に カフェ が あります。', 'Trước thư viện có quán cà phê.'],
      ['としょかん は {大|おお}きい です。 そして、 {本|ほん} が たくさん あります。', 'Thư viện lớn. Và có rất nhiều sách.'],
      ['{毎朝|まいあさ}、 そこ で コーヒー を {!飲|の}みます。', 'Sáng nào tôi cũng uống cà phê ở đó.'],
      ['じゅぎょう は {八時|はちじ} から です。', 'Giờ học bắt đầu từ 8 giờ.'],
    ],
    meo: ['四十分 = よんじゅっ**ぷん** (10 phút → じゅっぷん).', '学生 = がく**せい** (đọc *gakusei*, せい kéo dài).'],
  },
  {
    ma: 'R-07', ten: 'Rủ bạn đi hoà nhạc',
    cau: [
      ['{!今週|こんしゅう} の {!日曜日|にちようび}、 こうえん で ジャズ の コンサート が あります。', 'Chủ nhật tuần này ở công viên có buổi hoà nhạc jazz.'],
      ['{私|わたし} は チケット が {二枚|にまい} あります。', 'Tôi có 2 vé.'],
      ['こうえん は {大学|だいがく} の となり に あります。 チケット は {一枚|いちまい} {二千円|にせんえん} でした。', 'Công viên ở cạnh trường đại học. Vé giá 2.000 yên một tấm.'],
      ['マイ-さん と いっしょ に {!行|い}きたい です。', 'Tôi muốn đi cùng chị Mai.'],
      ['マイ-さん は ジャズ が {好|す}き です から。', 'Vì chị Mai thích jazz.'],
      ['コンサート は {!午後|ごご} {!四時|よじ} から です。', 'Buổi hoà nhạc bắt đầu từ 4 giờ chiều.'],
      ['その {!後|あと}、 いっしょ に ばんごはん を {!食|た}べましょう。', 'Sau đó cùng ăn tối nhé.'],
    ],
    meo: ['四時 = **よ**じ (không phải よんじ, しじ).', 'その後 = そのあと — 後 ở đây đọc あと (khác 午後 ごご).'],
  },
  {
    ma: 'R-08', ten: 'Hà Nội và TP.HCM',
    cau: [
      ['^ベトナム で ^ホーチミン-{!市|し} が いちばん {!大|おお}きい {町|まち} です。', 'Ở Việt Nam, TP. Hồ Chí Minh là thành phố lớn nhất.'],
      ['^ハノイ は ホーチミン-{市|し} より しずか です。', 'Hà Nội yên tĩnh hơn TP.HCM.'],
      ['そして、 ふるい おてら が たくさん あります。', 'Và có nhiều chùa cổ.'],
      ['{!私|わたし} は ハノイ の ほう が {好|す}き です。', 'Tôi thích Hà Nội hơn.'],
      ['ハノイ は {!十二月|じゅうにがつ}、 さむい です が、 ホーチミン-{市|し} は {一年中|いちねんじゅう} あつい です。', 'Hà Nội tháng 12 lạnh, nhưng TP.HCM thì nóng quanh năm.'],
      ['{!来月|らいげつ}、 ホーチミン-{市|し} へ {!行|い}きます。', 'Tháng sau tôi sẽ đi TP.HCM.'],
      ['ハノイ から {飛行機|ひこうき} で {二時間|にじかん} くらい です。', 'Từ Hà Nội đi máy bay khoảng 2 tiếng.'],
    ],
    meo: ['市 đứng sau tên thành phố đọc **し**.', '十二月 = じゅうに**がつ** · 来月 = らい**げつ** (月 đọc がつ khi là tên tháng, げつ trong 来月).'],
  },
  {
    ma: 'R-09', ten: 'Ngày nghỉ hôm qua',
    cau: [
      ['きのう は {!休|やす}み でした。', 'Hôm qua là ngày nghỉ.'],
      ['あさ、 {九時|くじ} に おきました。 {!午前|ごぜん} は へや を そうじ しました。', 'Buổi sáng tôi dậy lúc 9 giờ. Buổi sáng tôi dọn phòng.'],
      ['それから、 {友達|ともだち} と ラーメン を {!食|た}べに {行|い}きました。', 'Sau đó tôi đi ăn mì ramen với bạn.'],
      ['その みせ の ラーメン は {安|やす}い です が、 とても おいしい です。', 'Mì ramen ở quán đó rẻ nhưng rất ngon.'],
      ['{午後|ごご} は としょかん で {!日本語|にほんご} を べんきょう しました。', 'Buổi chiều tôi học tiếng Nhật ở thư viện.'],
      ['よる は うち で アニメ を {!見|み}ました。', 'Buổi tối tôi xem anime ở nhà.'],
      ['とても いい {!一日|いちにち} でした。', 'Thật là một ngày tốt đẹp.'],
      ['{十一時|じゅういちじ} に ねました。', 'Tôi đi ngủ lúc 11 giờ.'],
    ],
    meo: ['午前 = **ご**ぜん · 一日 = いち**にち** (một ngày — khác ついたち "mồng 1").', '休み = **やす**み.'],
  },
  {
    ma: 'R-10', ten: 'Tết ở Việt Nam',
    cau: [
      ['^ベトナム で は {!二月|にがつ} に ^テト が あります。', 'Ở Việt Nam, tháng 2 có Tết.'],
      ['テト は ベトナム の {!大|おお}きい {休|やす}み です。', 'Tết là kỳ nghỉ lớn của Việt Nam.'],
      ['^ハノイ は {二月|にがつ}、 すこし さむい です。', 'Hà Nội tháng 2 hơi lạnh.'],
      ['テト の まえ に、 うち を そうじ します。', 'Trước Tết, chúng tôi dọn dẹp nhà cửa.'],
      ['{!今年|ことし} も テト に {家族|かぞく} と いなか へ {!帰|かえ}ります。', 'Năm nay Tết tôi cũng về quê cùng gia đình.'],
      ['みんな で {大|おお}きい ^バインチュン を {作|つく}ります。', 'Cả nhà cùng làm bánh chưng to.'],
      ['そして、 いっしょ に {!食|た}べます。 とても たのしい です。', 'Rồi cùng nhau ăn. Rất vui.'],
      ['テト に は {友達|ともだち} の うち へ も {行|い}きます。', 'Dịp Tết tôi cũng đến nhà bạn bè.'],
    ],
    meo: ['今年 = **ことし** (đọc đặc biệt — không phải こんねん).', 'ベトナムでは = *Betonamu de wa*.'],
  },
  {
    ma: 'R-11', ten: 'Phòng của tôi',
    cau: [
      ['{私|わたし} の へや は {!小|ちい}さい です が、 きれい です。', 'Phòng tôi nhỏ nhưng sạch sẽ.'],
      ['まど の {!前|まえ} に つくえ が あります。', 'Trước cửa sổ có cái bàn học.'],
      ['つくえ の {上|うえ} に パソコン と {!本|ほん} が あります。', 'Trên bàn có máy tính và sách.'],
      ['つくえ の よこ に {!大|おお}きい ベッド が あります。', 'Cạnh bàn có cái giường lớn.'],
      ['ベッド の {上|うえ} に ねこ が います。 ねこ の {!名前|なまえ} は ミミ です。', 'Trên giường có con mèo. Tên con mèo là Mimi.'],
      ['{!毎日|まいにち}、 ミミ と あそびます。', 'Ngày nào tôi cũng chơi với Mimi.'],
      ['ミミ は {小|ちい}さい ねこ です。 {私|わたし} は この へや が とても {好|す}き です。', 'Mimi là con mèo nhỏ. Tôi rất thích căn phòng này.'],
    ],
    meo: ['小さい = **ちい**さい · 大きい = **おお**きい.', 'Vật → あります, con mèo → **います**.'],
  },
  {
    ma: 'R-12', ten: 'Bữa tiệc ở nhà bạn',
    cau: [
      ['{!今|いま}、 {友達|ともだち} の うち で パーティー を して います。', 'Bây giờ chúng tôi đang tổ chức tiệc ở nhà bạn.'],
      ['ナム-さん は だいどころ で {!料理|りょうり} を つくって います。', 'Anh Nam đang nấu ăn trong bếp.'],
      ['ナム-さん の {料理|りょうり} は いつも おいしい です。', 'Món anh Nam nấu lúc nào cũng ngon.'],
      ['{!私|わたし} は テーブル の {上|うえ} に おさら を おいて います。', 'Tôi đang đặt đĩa lên bàn.'],
      ['{!女|おんな} の {人|ひと} たち は {!話|はな}して います。', 'Các bạn nữ đang nói chuyện.'],
      ['ミン-さん は まど の そと で でんわ を して います。', 'Anh Minh đang gọi điện thoại ngoài cửa sổ.'],
      ['ナム-さん の ねこ は いす の {下|した} で ねて います。', 'Con mèo của anh Nam đang ngủ dưới ghế.'],
      ['{!八時|はちじ} から みんな で {!食|た}べます。', 'Từ 8 giờ mọi người cùng ăn.'],
    ],
    meo: ['話しています = **はな**しています.', 'パーティー: hai trường âm ー — *paatii*.'],
  },
  {
    ma: 'R-13', ten: 'Ăn sukiyaki ở nhà bạn Nhật',
    cau: [
      ['きのう、 {!日本人|にほんじん} の {友達|ともだち} の うち へ {行|い}きました。', 'Hôm qua tôi đến nhà người bạn Nhật.'],
      ['{友達|ともだち} は だいどころ で すきやき を {作|つく}りました。', 'Bạn ấy nấu sukiyaki trong bếp.'],
      ['{日本人|にほんじん} は はし で ごはん を {食|た}べます。', 'Người Nhật ăn cơm bằng đũa.'],
      ['{!私|わたし} も はし で {!食|た}べました が、 スープ は スプーン で {飲|の}みました。', 'Tôi cũng ăn bằng đũa, nhưng súp thì uống bằng thìa.'],
      ['すきやき の {!肉|にく} は とても おいしかった です。', 'Thịt sukiyaki rất ngon.'],
      ['{友達|ともだち} の {家族|かぞく} も いっしょ に {食|た}べました。 とても たのしい よる でした。', 'Gia đình bạn tôi cũng cùng ăn. Thật là một buổi tối vui.'],
      ['{!来週|らいしゅう} は {私|わたし} が ベトナム-{!料理|りょうり} を {作|つく}ります。', 'Tuần sau tôi sẽ nấu món Việt.'],
    ],
    meo: ['日本人 = にほん**じん** · 肉 = **にく**.', 'スプーン: *supuun* (ー kéo dài u).'],
  },
  {
    ma: 'R-14', ten: 'Mua giày',
    cau: [
      ['{!先月|せんげつ}、 デパート で セール が ありました。', 'Tháng trước ở trung tâm thương mại có đợt giảm giá.'],
      ['{!私|わたし} は くつ を {!買|か}いました。 {!三千円|さんぜんえん} でした。', 'Tôi đã mua giày. Giá 3.000 yên.'],
      ['とても {安|やす}かった です。', 'Rất rẻ.'],
      ['セール でした から、 {人|ひと} が とても {多|おお}かった です。', 'Vì có giảm giá nên rất đông người.'],
      ['ジーンズ も {欲|ほ}しかった です が、 お{金|かね} が ありませんでした。', 'Tôi cũng muốn có quần jeans nhưng không có tiền.'],
      ['デパート は {駅|えき} の まえ に あります。', 'Trung tâm thương mại ở trước ga.'],
      ['ですから、 {何|なに} も {買|か}いませんでした。', 'Vì vậy tôi không mua (thêm) gì.'],
      ['{!来月|らいげつ}、 また デパート へ {!行|い}きたい です。', 'Tháng sau tôi muốn lại đi trung tâm thương mại.'],
    ],
    meo: ['三千円 = さん**ぜん**えん (千 sau さん đọc ぜん).', '先月 = せん**げつ**.'],
  },
  {
    ma: 'R-15', ten: 'Kế hoạch đi Nhật',
    cau: [
      ['{!来年|らいねん} の {!四月|しがつ}、 {日本|にほん} へ りょこう に {!行|い}きます。', 'Tháng 4 năm sau tôi sẽ đi du lịch Nhật Bản.'],
      ['{!東京|とうきょう} は にぎやかな {町|まち} です。', 'Tokyo là thành phố nhộn nhịp.'],
      ['スカイツリー と ディズニーランド へ {行|い}きたい です。', 'Tôi muốn đến Skytree và Disneyland.'],
      ['それから、 しんかんせん で {京都|きょうと} へ {行|い}きます。', 'Sau đó tôi đi Kyoto bằng tàu Shinkansen.'],
      ['{東京|とうきょう} から {京都|きょうと} まで {!二時間十五分|にじかんじゅうごふん} くらい です。', 'Từ Tokyo đến Kyoto khoảng 2 tiếng 15 phút.'],
      ['{京都|きょうと} で ふるい おてら を {!見|み}たい です。', 'Ở Kyoto tôi muốn xem những ngôi chùa cổ.'],
      ['{京都|きょうと} の {料理|りょうり} も {!食|た}べたい です。 {日本|にほん} の はる は さくら が きれい です から、 とても たのしみ です。', 'Tôi cũng muốn ăn món Kyoto. Mùa xuân Nhật hoa anh đào đẹp nên tôi rất mong chờ.'],
    ],
    meo: ['四月 = **し**がつ (không よんがつ).', '東京 = **とう**きょう · 京都 = **きょう**と — đều có trường âm.'],
  },
  {
    ma: 'R-16', ten: 'Bốn mùa',
    cau: [
      ['{!私|わたし} は きせつ で はる が いちばん {好|す}き です。', 'Trong các mùa tôi thích mùa xuân nhất.'],
      ['{!日本|にほん} の はる は あたたかい です。 そして、 さくら が とても きれい です。', 'Mùa xuân Nhật ấm áp. Và hoa anh đào rất đẹp.'],
      ['なつ は はる より あつい です から、 {!毎日|まいにち} アイスクリーム を {!食|た}べます。', 'Mùa hè nóng hơn mùa xuân nên ngày nào tôi cũng ăn kem.'],
      ['ふゆ は さむい です が、 あたたかい コーヒー が おいしい です。', 'Mùa đông lạnh nhưng cà phê nóng thì ngon.'],
      ['{日本|にほん} の なつ は ハノイ より すずしい です。', 'Mùa hè Nhật mát hơn Hà Nội.'],
      ['{!今|いま} は あき です。 すずしい です。', 'Bây giờ là mùa thu. Trời mát.'],
    ],
    meo: ['いちばん / より — đọc rõ *ichiban*, *yori*.', 'アイスクリーム: *aisukuriimu*.'],
  },
  {
    ma: 'R-17', ten: 'Hẹn xem phim',
    cau: [
      ['{!金曜日|きんようび} の よる、 {!会社|かいしゃ} の {友達|ともだち} と えいが を {!見|み}に {!行|い}きます。', 'Tối thứ Sáu tôi đi xem phim với bạn ở công ty.'],
      ['{友達|ともだち} は もう チケット を {!買|か}いました。', 'Bạn tôi đã mua vé rồi.'],
      ['えいが は {!七時|しちじ} から です。', 'Phim chiếu từ 7 giờ.'],
      ['えいが は アメリカ の コメディー です。 えいがかん は {会社|かいしゃ} から ちかい です。', 'Phim là phim hài Mỹ. Rạp chiếu phim gần công ty.'],
      ['その {前|まえ} に、 レストラン で ばんごはん を {食|た}べます。', 'Trước đó, chúng tôi ăn tối ở nhà hàng.'],
      ['レストラン は えいがかん の となり に あります。', 'Nhà hàng ở cạnh rạp chiếu phim.'],
      ['{!土曜日|どようび} は ようじ が あります から、 {金曜日|きんようび} が いい です。', 'Thứ Bảy tôi có việc bận nên thứ Sáu là tiện.'],
    ],
    meo: ['七時 = **しち**じ (không なないじ).', '会社 = かい**しゃ** — âm ghép しゃ.'],
  },
  {
    ma: 'R-18', ten: 'Bạn người Nhật trong lớp',
    cau: [
      ['{私|わたし} の クラス に {!日本人|にほんじん} の {!学生|がくせい} が います。', 'Lớp tôi có một sinh viên người Nhật.'],
      ['{!名前|なまえ} は ^タナカ-さん です。', 'Tên là anh Tanaka.'],
      ['タナカ-さん は {!東京|とうきょう} から {来|き}ました。', 'Anh Tanaka đến từ Tokyo.'],
      ['{!毎週|まいしゅう} {水曜日|すいようび}、 タナカ-さん と カフェ で {!日本語|にほんご} を べんきょう します。', 'Thứ Tư hằng tuần tôi học tiếng Nhật với anh Tanaka ở quán cà phê.'],
      ['タナカ-さん は とても おもしろい {人|ひと} です。', 'Anh Tanaka là người rất thú vị.'],
      ['{日曜日|にちようび} は いっしょ に ごはん を {食|た}べに {行|い}きます。', 'Chủ nhật chúng tôi cùng đi ăn.'],
      ['{来年|らいねん}、 タナカ-さん は {東京|とうきょう} へ {帰|かえ}ります。', 'Năm sau anh Tanaka sẽ về Tokyo.'],
    ],
    meo: ['学生 = がくせい · 名前 = なまえ · 日本語 = にほんご.', '水曜日 = **すい**ようび.'],
  },
  {
    ma: 'R-19', ten: 'Gia đình tôi', mo: 'Bài 8',
    cau: [
      ['{私|わたし} の {家族|かぞく} は {!四人|よにん} です。', 'Gia đình tôi có 4 người.'],
      ['{!父|ちち} と {!母|はは} と {妹|いもうと} と {私|わたし} です。', 'Bố, mẹ, em gái và tôi.'],
      ['{父|ちち} は {医者|いしゃ} です。 {母|はは} は {!日本語|にほんご} の {!先生|せんせい} です。', 'Bố tôi là bác sĩ. Mẹ tôi là giáo viên tiếng Nhật.'],
      ['{父|ちち} は {背|せ} が {高|たか}い です。 {母|はは} は やさしくて、 {料理|りょうり} が {上手|じょうず} です。', 'Bố tôi cao. Mẹ tôi hiền và nấu ăn giỏi.'],
      ['{妹|いもうと} は かみ が {!長|なが}くて、 とても かわいい です。', 'Em gái tôi tóc dài, rất dễ thương.'],
      ['{家族|かぞく} は みんな ^ハイフォン に {住|す}んで います。', 'Cả gia đình đều sống ở Hải Phòng.'],
      ['ペット も います。 {犬|いぬ} が {一匹|いっぴき} います。', 'Nhà tôi cũng có thú cưng. Có một con chó.'],
      ['{私|わたし} は {毎週|まいしゅう} {家族|かぞく} に メール を {送|おく}ります。', 'Tuần nào tôi cũng gửi email cho gia đình.'],
    ],
    meo: ['四人 = **よ**にん (không よんにん, しにん).', 'Bài 8: 父 ちち · 母 はは (gia đình MÌNH); 長くて = ながくて (nối tính từ).'],
  },
  {
    ma: 'R-20', ten: 'Sở thích vẽ tranh', mo: 'Bài 9',
    cau: [
      ['{私|わたし} の しゅみ は {絵|え} を {描|か}く こと です。', 'Sở thích của tôi là vẽ tranh.'],
      ['{!毎週|まいしゅう} {!土曜日|どようび} に {絵|え} の クラス へ {!行|い}きます。', 'Thứ Bảy hằng tuần tôi đến lớp vẽ.'],
      ['きょうしつ は {駅|えき} の ちかく に あります。 {絵|え} の {先生|せんせい} は とても やさしい です。', 'Lớp học ở gần ga. Cô giáo dạy vẽ rất hiền.'],
      ['{!先週|せんしゅう} は こうえん へ {行|い}って、 {!木|き} と はな を {描|か}きました。', 'Tuần trước tôi đến công viên và vẽ cây với hoa.'],
      ['{私|わたし} は ギター も すこし ひく こと が できます。', 'Tôi cũng có thể chơi đàn ghi-ta một chút.'],
      ['でも、 うた は ぜんぜん じょうず じゃ ありません。', 'Nhưng hát thì tôi hoàn toàn không giỏi.'],
      ['{!来月|らいげつ}、 {絵|え} の コンテスト に さんか します。', 'Tháng sau tôi sẽ tham gia cuộc thi vẽ.'],
    ],
    meo: ['Bài 9: 描くこと = *kaku koto* · できます · 行って (thể て nối hai việc).', '木 đứng một mình đọc **き**.'],
  },
];

const READING: Lesson = {
  id: 'b7-thi-thu-123-reading',
  kind: 'review',
  title: 'Part 1 Reading — 20 đoạn luyện đọc đúng form đề JPD123 (chữ Hán của lớp in đậm, có máy chấm)',
  goal: 'Đọc trôi chảy, đúng từng âm một đoạn ~150 chữ có 5–7 từ chữ Hán của lớp không furigana và 2–4 từ katakana — như đề A của cô — để lấy trọn 45 điểm Reading.',
  minutes: 120,
  blocks: [
    RECAP('Cách luyện mỗi đoạn (≈ 5 phút/đoạn)', [
      '**Bấm giờ 20 giây** nhìn tờ đề: dò các từ **in đậm** (= gạch chân trên đề thật, không furigana) và katakana tô vàng.',
      '**Đọc to MỘT lượt** cả đoạn như đang thi — không dừng, sai thì đọc lại từ đó.',
      'Mở **máy chấm phát âm**: đọc từng câu, xem từ nào bị tô đỏ → đọc lại câu đó tới khi xanh.',
      'Cuối cùng đọc bản **chữ Hán trần** (không furigana ở mọi chữ) — đọc được bản này thì đề thật dễ hơn.',
      'Đoạn 01–18 chỉ dùng từ + ngữ pháp **Bài 1–7**; đoạn 19 (Bài 8) và 20 (Bài 9) là **mở rộng**, có ghi rõ.',
    ]),
    TABLE(
      ['Bài', 'Chữ Hán của lớp (danh sách chính thức của cô)'],
      Object.entries(CHU_LOP).map(([n, c]) => [`Bài ${n}`, [...c].join(' ')]),
      'Chỉ những chữ này mới bị gạch chân (in đậm) trên tờ đề',
    ),
    NOTE('Ba luật đọc không được quên', [
      'Trợ từ: **は = wa · へ = e · を = o**.',
      'Trường âm đọc đủ hai nhịp: とう**きょう** (too-kyoo), ゆう**めい** (yuu-mei), コー**ヒー** (koo-hii).',
      'Âm ngắt っ ngừng một nhịp: いっしょ (is-sho), チケット (chi-ket-to), よんじゅっぷん.',
    ]),
    ...DOAN_20.flatMap((d, i) => khoiDoan(d, `b7-tt123-r${String(i + 1).padStart(2, '0')}`)),
  ],
};

/* ═══════════════════ c. PART 2 Q&A — NGÂN HÀNG CÂU HỎI ═══════════════════ */

/** Một câu hỏi: `q` câu hỏi (DSL) · `vi` nghĩa · `a` = 2 câu trả lời mẫu [DSL, nghĩa] · `meo` = cách lấy điểm cao. */
type QA = { q: string; vi: string; a: [string, string][]; meo: string };
type Nhom = { ma: string; ten: string; slug: string; tranh?: Block[]; ghi?: string; ds: QA[] };

const qa = (q: string, vi: string, a1: [string, string], a2: [string, string], meo: string): QA => ({ q, vi, a: [a1, a2], meo });

function khoiNhom(n: Nhom, idGoc: string): Block[] {
  return [
    H(`${n.ma} — ${n.ten}`),
    ...(n.ghi ? [P(n.ghi)] : []),
    ...(n.tranh ?? []),
    DLG(
      `${n.ma}: câu hỏi của giám thị → 2 cách trả lời mẫu`,
      n.ds.flatMap((x, i) => [
        DX('examiner', x.q, `${i + 1}. ${x.vi}`, `Giám thị — câu ${i + 1}`),
        ...x.a.map(([s, v], k) => DX('candidate', s, v, `Bạn — cách ${k + 1}`)),
      ]),
    ),
    TABLE(['#', 'Câu hỏi', 'Mẹo trả lời đủ ý (điểm cao)'], n.ds.map((x, i) => [String(i + 1), J(x.q), x.meo])),
    { t: 'speak', id: `${idGoc}-${n.slug}`, part: '1', questions: n.ds.map((x) => SQ(x.q)) },
  ];
}

const NHOM_QA: Nhom[] = [
  {
    ma: 'Bài 4.1', ten: 'Ở đâu · từ A đến B mất bao lâu (北・南・どのくらい・で)', slug: '41',
    tranh: [
      { t: 'canh', anh: ['cityscape', 'airplane', 'cityscape-at-dusk'], caption: 'Tranh kiểu đề B-0: ハノイ → ✈ 2時間はん → ホーチミン' },
      TABLE(['Tranh ghi', 'Câu trả lời'], [
        ['✈ 2時間はん', JR('{飛行機|ひこうき} で {二時間半|にじかんはん} です。')],
        ['🚌 30分', JR('バス で {三十分|さんじゅっぷん} です。')],
        ['🚶 15分', JR('{歩|ある}いて {十五分|じゅうごふん} です。')],
        ['🚄 2時間15分', JR('しんかんせん で {二時間|にじかん} {十五分|じゅうごふん} です。')],
      ], 'Câu ① có tranh: đọc ĐÚNG phương tiện + số giờ trên tranh'),
    ],
    ds: [
      qa('^ハノイ は ^ベトナム の どこ です か。', 'Hà Nội ở đâu của Việt Nam?', ['ハノイ は ベトナム の {北|きた} です。', 'Hà Nội ở phía bắc Việt Nam.'], ['ベトナム の {北|きた} に あります。 {大|おお}きい {町|まち} です。', 'Ở phía bắc Việt Nam. Là thành phố lớn.'], 'Khung **N は N の［北・南・東・西・真ん中］です** (ポイント 29). Thêm 1 câu tả thành phố: 大きい町です／にぎやかな町です.'),
      qa('^ホーチミン は ^ベトナム の どこ です か。', 'TP.HCM ở đâu của Việt Nam?', ['ホーチミン は ベトナム の {南|みなみ} です。', 'TP.HCM ở phía nam Việt Nam.'], ['ベトナム の {南|みなみ} に あります。 とても にぎやか です。', 'Ở phía nam Việt Nam. Rất nhộn nhịp.'], 'Nam = **みなみ**. Nhớ cặp: きた (bắc) · みなみ (nam) · ひがし (đông) · にし (tây) · まんなか (giữa).'),
      qa('^フエ は ^ベトナム の {西|にし} です か。', 'Huế ở phía tây Việt Nam phải không?', ['いいえ、 {西|にし} じゃ ありません。 ベトナム の {真|ま}ん{中|なか} です。', 'Không, không phải phía tây. Ở miền Trung Việt Nam.'], ['いいえ、 フエ は ベトナム の {真|ま}ん{中|なか} に あります。', 'Không, Huế ở miền Trung Việt Nam.'], 'Câu Có/Không ⇒ mở đầu **いいえ** (quên là bị trừ). Rồi nói đáp án đúng: **真ん中** (まんなか).'),
      qa('^ハノイ から ^ハイフォン まで {車|くるま} で どのくらい です か。', 'Từ Hà Nội đến Hải Phòng đi ô tô mất bao lâu?', ['{車|くるま} で {二時間|にじかん} くらい です。', 'Đi ô tô khoảng 2 tiếng.'], ['{一時間半|いちじかんはん} くらい です。 バス で も {二時間|にじかん} くらい です。', 'Khoảng 1 tiếng rưỡi. Đi xe buýt cũng khoảng 2 tiếng.'], 'Khung **(phương tiện) で ～時間 くらい です** (ポイント 30–31). Không chắc số ⇒ thêm **くらい**.'),
      qa('^ベトナム から {日本|にほん} まで {飛行機|ひこうき} で どのくらい です か。', 'Từ Việt Nam đến Nhật đi máy bay mất bao lâu?', ['{飛行機|ひこうき} で {五時間|ごじかん} くらい です。', 'Đi máy bay khoảng 5 tiếng.'], ['よく わかりません が、 {五時間|ごじかん} くらい です。', 'Tôi không rõ lắm, nhưng khoảng 5 tiếng.'], 'Không biết chắc ⇒ cách 2 (よくわかりませんが、～くらいです) vẫn là câu đủ ý, đúng ngữ pháp.'),
      qa('うち から ^FPT {大学|だいがく} まで {歩|ある}いて どのくらい です か。', 'Từ nhà đến ĐH FPT đi bộ mất bao lâu?', ['{歩|ある}いて {十五分|じゅうごふん} くらい です。', 'Đi bộ khoảng 15 phút.'], ['とおい です から、 {歩|ある}いて {行|い}きません。 バス で {四十分|よんじゅっぷん} くらい です。', 'Vì xa nên tôi không đi bộ. Đi xe buýt khoảng 40 phút.'], '**歩いて KHÔNG thêm で** (lỗi trợ từ −2). 10 phút = じゅっぷん, 40 phút = よんじゅっぷん.'),
      qa('^ハノイ から ^ホーチミン まで どのくらい です か。', 'Từ Hà Nội đến TP.HCM mất bao lâu? (đề B-0, có tranh)', ['{飛行機|ひこうき} で {二時間半|にじかんはん} です。', 'Đi máy bay mất 2 tiếng rưỡi.'], ['{二時間半|にじかんはん} くらい です。 でんしゃ で は {三十時間|さんじゅうじかん} くらい です。', 'Khoảng 2 tiếng rưỡi. Đi tàu thì khoảng 30 tiếng.'], 'Có tranh ⇒ nói đúng số trên tranh (**2時間はん**). Thêm 1 câu so sánh phương tiện khác.'),
    ],
  },
  {
    ma: 'Bài 4.2', ten: 'Tả nơi chốn (tính từ い／な・どんな・あります)', slug: '42',
    ds: [
      qa('^FPT {大学|だいがく} は {有名|ゆうめい} です か。', 'ĐH FPT có nổi tiếng không?', ['はい、 {有名|ゆうめい} です。', 'Có, nổi tiếng.'], ['はい、 とても {有名|ゆうめい} な {大学|だいがく} です。 {学生|がくせい} が {多|おお}い です。', 'Có, là trường rất nổi tiếng. Nhiều sinh viên.'], 'ナ-adj: trước danh từ thêm **な** (有名**な**大学); cuối câu không な (有名です).'),
      qa('^ハノイ は {緑|みどり} が {多|おお}い です か。', 'Hà Nội có nhiều cây xanh không?', ['はい、 {多|おお}い です。 こうえん が たくさん あります。', 'Có, nhiều. Có nhiều công viên.'], ['いいえ、 あまり {多|おお}くない です。', 'Không, không nhiều lắm.'], '**あまり + phủ định** (多くないです). Không nói あまり多いです.'),
      qa('^ホアラック は {静|しず}か です か。', 'Hòa Lạc có yên tĩnh không?', ['はい、 とても {静|しず}か です。', 'Có, rất yên tĩnh.'], ['はい、 {静|しず}か です。 そして、 {緑|みどり} が {多|おお}い です。', 'Có, yên tĩnh. Và nhiều cây xanh.'], 'Thêm ý bằng **そして** (ポイント 34) — câu thứ hai cùng chiều.'),
      qa('^FPT ビル は {新|あたら}しい です か。', 'Toà nhà FPT có mới không?', ['はい、 {新|あたら}しい です。 そして、 きれい です。', 'Có, mới. Và đẹp.'], ['いいえ、 あまり {新|あたら}しくない です。', 'Không, không mới lắm.'], 'イ-adj phủ định: 新しい → **新しくない**です.'),
      qa('{富士山|ふじさん} は {高|たか}い です か。', 'Núi Phú Sĩ có cao không?', ['はい、 とても {高|たか}い です。', 'Có, rất cao.'], ['はい、 {高|たか}い です。 {日本|にほん} で いちばん {高|たか}い {山|やま} です。', 'Có, cao. Là ngọn núi cao nhất Nhật Bản.'], 'Cách 2 dùng thêm **～で いちばん** (Bài 6) — câu dài, đủ ý.'),
      qa('^ホン-{川|がわ} は きれい です か。', 'Sông Hồng có đẹp không?', ['いいえ、 あまり きれい じゃ ありません。', 'Không, không đẹp lắm.'], ['はい、 きれい です。 そして、 {大|おお}きい です。', 'Có, đẹp. Và lớn.'], '**きれい là ナ-adj** (dù đuôi い): phủ định きれい**じゃありません**, không phải きれくない.'),
      qa('^ハノイ は どんな {町|まち} です か。', 'Hà Nội là thành phố như thế nào?', ['にぎやか な {町|まち} です。', 'Là thành phố nhộn nhịp.'], ['ふるい {町|まち} です。 そして、 おいしい {食|た}べ{物|もの} が たくさん あります。', 'Là thành phố cổ. Và có rất nhiều đồ ăn ngon.'], 'どんな N ⇒ trả lời **tính từ + N** (にぎやかな町). Đừng trả lời はい／いいえ.'),
      qa('{日本|にほん} は きれい な {国|くに} です か。', 'Nhật Bản có phải đất nước đẹp không?', ['はい、 きれい な {国|くに} です。', 'Vâng, là đất nước đẹp.'], ['はい、 とても きれい です。 そして、 {有名|ゆうめい} な おてら が たくさん あります。', 'Vâng, rất đẹp. Và có nhiều chùa nổi tiếng.'], 'Lặp lại khung câu hỏi (きれいな国です) là câu trả lời an toàn nhất.'),
      qa('^ソクソン に {何|なに} が あります か。', 'Ở Sóc Sơn có gì?', ['{山|やま} と おてら が あります。', 'Có núi và chùa.'], ['{有名|ゆうめい} な おてら が あります。 そして、 みどり が {多|おお}い です。', 'Có ngôi chùa nổi tiếng. Và nhiều cây xanh.'], 'Khung **N1 に N2 が あります** (ポイント 28): trả lời **N が あります** — trợ từ が.'),
      qa('^FPT {大学|だいがく} は どんな {大学|だいがく} です か。', 'ĐH FPT là trường như thế nào?', ['{新|あたら}しい {大学|だいがく} です。', 'Là trường mới.'], ['{有名|ゆうめい} な {大学|だいがく} です。 そして、 {学生|がくせい} が {多|おお}い です。', 'Là trường nổi tiếng. Và đông sinh viên.'], 'Hai câu: tính từ + 大学 → そして + câu thứ hai.'),
    ],
  },
  {
    ma: 'Bài 4.3', ten: 'Thời tiết theo tháng / mùa (N は［tháng］、A です)', slug: '43',
    tranh: [{ t: 'canh', anh: ['sun', 'snowflake', 'cherry-blossom', 'fallen-leaf'], caption: 'あつい・さむい・あたたかい・すずしい — bốn từ thời tiết phải thuộc' }],
    ds: [
      qa('^ハノイ は {十一月|じゅういちがつ}、 {涼|すず}しい です か。', 'Hà Nội tháng 11 có mát không?', ['はい、 {涼|すず}しい です。', 'Có, mát.'], ['はい、 {涼|すず}しい です。 {天気|てんき} が いい です。', 'Có, mát. Thời tiết đẹp.'], 'Tháng 11 = じゅう**いち**がつ. Thêm 天気がいいです để đủ ý.'),
      qa('{日本|にほん} は {一月|いちがつ}、 どう です か。', 'Nhật Bản tháng 1 thế nào?', ['とても {寒|さむ}い です。', 'Rất lạnh.'], ['{寒|さむ}い です。 そして、 {雪|ゆき} が {多|おお}い です。', 'Lạnh. Và nhiều tuyết.'], 'どうですか ⇒ trả lời **tính từ** (寒いです). Không có はい／いいえ.'),
      qa('^タイ は {一年中|いちねんじゅう}、 {暑|あつ}い です か。', 'Thái Lan quanh năm nóng phải không?', ['はい、 {暑|あつ}い です。', 'Vâng, nóng.'], ['はい、 {一年中|いちねんじゅう} とても {暑|あつ}い です。', 'Vâng, quanh năm rất nóng.'], 'Nóng (thời tiết) = **暑い**; nóng (đồ ăn) = 熱い — đọc giống nhau あつい.'),
      qa('^オーストラリア は {八月|はちがつ}、 どう です か。', 'Úc tháng 8 thế nào?', ['{寒|さむ}い です。', 'Lạnh.'], ['{八月|はちがつ} は ふゆ です から、 {寒|さむ}い です。', 'Tháng 8 là mùa đông nên lạnh.'], 'Úc ở Nam bán cầu: tháng 8 là **mùa đông** ⇒ 寒い. Cách 2 có lý do ～から.'),
    ],
  },
  {
    ma: 'Bài 4 — bổ sung', ten: 'Dạng trong "JPD123 HD thi nói" (第4課) chưa có ở trên', slug: '4b',
    ds: [
      qa('あなた の {町|まち} は どんな ところ です か。', 'Thành phố của bạn là nơi như thế nào?', ['{静|しず}か な ところ です。', 'Là nơi yên tĩnh.'], ['にぎやか な ところ です。 {有名|ゆうめい} な いちば が あります。', 'Là nơi nhộn nhịp. Có cái chợ nổi tiếng.'], 'どんな ところ ⇒ **tính từ + ところです**.'),
      qa('あなた の {町|まち} は にぎやか です か。', 'Thành phố của bạn có nhộn nhịp không?', ['はい、 とても にぎやか です。', 'Có, rất nhộn nhịp.'], ['いいえ、 にぎやか じゃ ありません。 {静|しず}か です。', 'Không, không nhộn nhịp. Yên tĩnh.'], 'Phủ định ナ-adj: **にぎやかじゃありません** rồi nói từ trái nghĩa.'),
      qa('あなた の {町|まち} は {大|おお}きい です か。', 'Thành phố của bạn có lớn không?', ['はい、 {大|おお}きい です。', 'Có, lớn.'], ['いいえ、 {大|おお}きくない です。 {小|ちい}さい {町|まち} です。', 'Không, không lớn. Là thị trấn nhỏ.'], '大きい → **大きくない**です (không phải 大きいじゃありません).'),
      qa('あなた の {町|まち} に きょうかい が あります か。', 'Thành phố của bạn có nhà thờ không?', ['はい、 あります。 {大|おお}きい きょうかい が あります。', 'Có. Có nhà thờ lớn.'], ['いいえ、 ありません。 でも、 おてら が あります。', 'Không có. Nhưng có chùa.'], 'Hỏi ～がありますか ⇒ **はい、あります / いいえ、ありません** + nói thứ có.'),
      qa('ダナン は {六月|ろくがつ}、 {暑|あつ}い です か。', 'Đà Nẵng tháng 6 có nóng không?', ['はい、 とても {暑|あつ}い です。', 'Có, rất nóng.'], ['はい、 {暑|あつ}い です。 でも、 {海|うみ} が きれい です。', 'Có, nóng. Nhưng biển đẹp.'], 'Tháng 6 = **ろく**がつ.'),
    ],
  },
  {
    ma: 'Bài 5.1', ten: 'Hôm qua đã làm gì (Vました／Vませんでした・だれと・どこかへ)', slug: '51',
    ds: [
      qa('きのう の ばん、 {何|なに} を しました か。', 'Tối hôm qua bạn đã làm gì?', ['うち で {日本語|にほんご} を べんきょう しました。', 'Tôi học tiếng Nhật ở nhà.'], ['{友達|ともだち} と ばんごはん を {食|た}べました。 それから、 テレビ を {見|み}ました。', 'Tôi ăn tối với bạn. Sau đó xem tivi.'], 'Hỏi quá khứ ⇒ trả lời **～ました**. Thêm việc thứ hai bằng **それから** (ポイント 45).'),
      qa('おととい としょかん へ {行|い}きました か。', 'Hôm kia bạn có đến thư viện không?', ['はい、 {行|い}きました。 {本|ほん} を {読|よ}みました。', 'Có, tôi đã đi. Tôi đọc sách.'], ['いいえ、 {行|い}きませんでした。', 'Không, tôi không đi.'], 'Có/Không + quá khứ: **はい、行きました / いいえ、行きませんでした**.'),
      qa('あさごはん を {食|た}べました か。', 'Bạn đã ăn sáng chưa? (sáng nay có ăn không)', ['はい、 {食|た}べました。 パン を {食|た}べました。', 'Có, tôi đã ăn. Ăn bánh mì.'], ['いいえ、 {食|た}べませんでした。 {時間|じかん} が ありませんでした から。', 'Không, tôi không ăn. Vì không có thời gian.'], 'Cách 2 thêm **lý do ～から** — đúng kiểu câu điểm cao.'),
      qa('きのう うち で {日本語|にほんご} を べんきょう しました か。', 'Hôm qua bạn có học tiếng Nhật ở nhà không?', ['はい、 しました。 {二時間|にじかん} べんきょう しました。', 'Có. Tôi học 2 tiếng.'], ['いいえ、 しませんでした。 いそがしかった です から。', 'Không. Vì tôi bận.'], 'Trả lời ngắn được: **はい、しました**. Quá khứ イ-adj: いそがしい → **いそがしかった**です.'),
      qa('きょう {何時|なんじ} に おきました か。', 'Hôm nay bạn dậy lúc mấy giờ?', ['{六時|ろくじ} に おきました。', 'Tôi dậy lúc 6 giờ.'], ['{六時半|ろくじはん} に おきました。 それから、 あさごはん を {食|た}べました。', 'Tôi dậy lúc 6 rưỡi. Sau đó ăn sáng.'], 'Giờ + **に**. 4 giờ = よじ, 7 giờ = しちじ, 9 giờ = くじ.'),
      qa('きょう {何時|なんじ} に {大学|だいがく} へ {来|き}ました か。', 'Hôm nay bạn đến trường lúc mấy giờ?', ['{七時半|しちじはん} に {来|き}ました。', 'Tôi đến lúc 7 rưỡi.'], ['{八時|はちじ} に {来|き}ました。 バス で {来|き}ました。', 'Tôi đến lúc 8 giờ. Tôi đến bằng xe buýt.'], '来ました đọc **き**ました. Thêm phương tiện で.'),
      qa('きのう だれ と スーパー へ {行|い}きました か。', 'Hôm qua bạn đi siêu thị với ai?', ['{友達|ともだち} と {行|い}きました。', 'Tôi đi với bạn.'], ['{一人|ひとり} で {行|い}きました。 やさい を {買|か}いました。', 'Tôi đi một mình. Tôi mua rau.'], 'Với ai = **người と**; một mình = **一人で** (không 一人と) — ポイント 46.'),
      qa('{今週|こんしゅう} の {日曜日|にちようび}、 {友達|ともだち} の いえ へ {行|い}きます ね。 それから、 {何|なに} を します か。', 'Chủ nhật tuần này bạn đến nhà bạn nhỉ. Sau đó làm gì?', ['いっしょ に ゲーム を します。', 'Chúng tôi cùng chơi game.'], ['いっしょ に ばんごはん を {作|つく}ります。 それから、 えいが を {見|み}ます。', 'Chúng tôi cùng nấu bữa tối. Sau đó xem phim.'], 'Câu hỏi tương lai (します) ⇒ trả lời **～ます**, không ～ました.'),
      qa('{週末|しゅうまつ}、 どこか へ {行|い}きます か。', 'Cuối tuần bạn có đi đâu không?', ['はい、 デパート へ {行|い}きます。', 'Có, tôi đi trung tâm thương mại.'], ['いいえ、 どこ へ も {行|い}きません。 うち で {休|やす}みます。', 'Không, tôi không đi đâu cả. Tôi nghỉ ở nhà.'], '**どこかへ** (có đi đâu không) ⇒ はい、～へ／いいえ、**どこへも**～ません (ポイント 43).'),
      qa('なつやすみ、 {家族|かぞく} と うみ へ {行|い}きました か。', 'Kỳ nghỉ hè bạn có đi biển với gia đình không?', ['はい、 {行|い}きました。 ダナン へ {行|い}きました。', 'Có, tôi đã đi. Tôi đi Đà Nẵng.'], ['いいえ、 {行|い}きませんでした。 アルバイト が ありました から。', 'Không, tôi không đi. Vì tôi có việc làm thêm.'], 'Thêm địa điểm hoặc lý do ⇒ câu 2 vế, nghe trôi chảy.'),
    ],
  },
  {
    ma: 'Bài 5.2', ten: 'Cảm nhận (～はどうでしたか・どうして・～から)', slug: '52',
    ds: [
      qa('なつやすみ の りょこう は どう でした か。', 'Chuyến du lịch hè của bạn thế nào?', ['とても たのしかった です。', 'Rất vui.'], ['たのしかった です。 そして、 {料理|りょうり} も おいしかった です。', 'Vui. Và đồ ăn cũng ngon.'], 'どうでしたか (quá khứ) ⇒ **～かったです / ～でした**. たのしい → たのし**かった**.'),
      qa('えいご の べんきょう は むずかしい です か。', 'Học tiếng Anh có khó không?', ['はい、 むずかしい です。', 'Có, khó.'], ['いいえ、 あまり むずかしくない です。 かんたん です。', 'Không, không khó lắm. Dễ.'], 'あまり + **むずかしくない**. かんたん là ナ-adj (かんたんです).'),
      qa('どうして {日本語|にほんご} を べんきょう します か。', 'Tại sao bạn học tiếng Nhật?', ['{日本|にほん} の アニメ が {好|す}き です から。', 'Vì tôi thích anime Nhật.'], ['{日本|にほん} へ {行|い}きたい です から。', 'Vì tôi muốn đi Nhật.'], '**どうして ⇒ ～から** (ポイント 44, 47). Câu kết thúc bằng から là đủ.'),
      qa('^タイ-{料理|りょうり} は どう です か。', 'Món Thái thế nào?', ['からい です が、 おいしい です。', 'Cay nhưng ngon.'], ['とても おいしい です。 {私|わたし} は {好|す}き です。', 'Rất ngon. Tôi thích.'], 'Hai ý ngược nhau nối bằng **が** (からいですが、おいしいです) — ポイント 35.'),
      qa('{日本|にほん} {料理|りょうり} は からい です か。', 'Món Nhật có cay không?', ['いいえ、 からくない です。', 'Không, không cay.'], ['いいえ、 あまり からくない です。 すこし あまい です。', 'Không, không cay lắm. Hơi ngọt.'], 'からい → **からくない**です.'),
    ],
  },
  {
    ma: 'Bài 5.3', ten: 'Muốn (ほしい・Vたい・すき／きらい・Vに行きます)', slug: '53',
    ds: [
      qa('{今|いま}、 {何|なに} が {欲|ほ}しい です か。', 'Bây giờ bạn muốn có gì? (đề B-0 ②)', ['{新|あたら}しい パソコン が {欲|ほ}しい です。', 'Tôi muốn có máy tính mới.'], ['{時間|じかん} が {欲|ほ}しい です。 とても いそがしい です から。', 'Tôi muốn có thời gian. Vì tôi rất bận.'], '**N が ほしいです** (trợ từ が, không を) — ポイント 40.'),
      qa('サッカー が {好|す}き です か。', 'Bạn có thích bóng đá không?', ['はい、 {好|す}き です。', 'Có, tôi thích.'], ['いいえ、 あまり {好|す}き じゃ ありません。 テニス が {好|す}き です。', 'Không, tôi không thích lắm. Tôi thích tennis.'], '好き là ナ-adj: phủ định **好きじゃありません**.'),
      qa('{週末|しゅうまつ}、 {何|なに} を したい です か。', 'Cuối tuần bạn muốn làm gì?', ['えいが を {見|み}たい です。', 'Tôi muốn xem phim.'], ['{友達|ともだち} と うみ へ {行|い}きたい です。', 'Tôi muốn đi biển với bạn.'], '**V(bỏ ます) + たいです**: 見ます → 見たい, 行きます → 行きたい (ポイント 41).'),
      qa('おさけ が きらい です か。', 'Bạn có ghét rượu không?', ['はい、 きらい です。', 'Vâng, tôi không thích.'], ['いいえ、 きらい じゃ ありません。 ビール が {好|す}き です。', 'Không, tôi không ghét. Tôi thích bia.'], 'Câu Có/Không ⇒ はい／いいえ trước. きらい cũng là ナ-adj.'),
      qa('{今週|こんしゅう}、 えいが を {見|み}に {行|い}きます か。', 'Tuần này bạn có đi xem phim không?', ['はい、 {行|い}きます。 {土曜日|どようび} に {友達|ともだち} と {行|い}きます。', 'Có. Thứ Bảy tôi đi với bạn.'], ['いいえ、 {行|い}きません。 いそがしい です から。', 'Không. Vì tôi bận.'], 'Khung **V(bỏ ます) に 行きます** (ポイント 42).'),
    ],
  },
  {
    ma: 'Bài 5 — bổ sung', ten: 'Dạng trong "JPD123 HD thi nói" (第5課) chưa có ở trên', slug: '5b',
    ds: [
      qa('どうして きのう {学校|がっこう} へ {行|い}きません でした か。', 'Tại sao hôm qua bạn không đến trường?', ['{日曜日|にちようび} でした から。', 'Vì hôm qua là Chủ nhật.'], ['かぜ でした から、 うち で {休|やす}みました。', 'Vì tôi bị cảm nên nghỉ ở nhà.'], 'Danh từ + quá khứ + から: **日曜日でしたから / かぜでしたから**.'),
      qa('{今|いま}、 {何|なに} が いちばん {好|す}き です か。', 'Bây giờ bạn thích gì nhất?', ['ゲーム が いちばん {好|す}き です。', 'Tôi thích chơi game nhất.'], ['{日本|にほん} の アニメ が いちばん {好|す}き です。', 'Tôi thích anime Nhật nhất.'], 'Giữ khung: **N が いちばん 好きです**.'),
      qa('お{金|かね} が たくさん あります。 {何|なに} を したい です か。', 'Bạn có rất nhiều tiền. Bạn muốn làm gì?', ['{日本|にほん} へ {行|い}きたい です。', 'Tôi muốn đi Nhật.'], ['{大|おお}きい うち を {買|か}いたい です。 そして、 {家族|かぞく} と りょこう したい です。', 'Tôi muốn mua căn nhà lớn. Và muốn đi du lịch cùng gia đình.'], 'Hai mong muốn nối bằng **そして**.'),
      qa('あした {何|なに} を しに {行|い}きます か。', 'Ngày mai bạn đi làm gì?', ['デパート へ {買|か}い{物|もの} に {行|い}きます。', 'Tôi đi trung tâm thương mại mua sắm.'], ['としょかん へ {本|ほん} を {読|よ}みに {行|い}きます。', 'Tôi đến thư viện để đọc sách.'], '**nơi へ + V(bỏ ます)/N + に + 行きます**: 買い物に · 読みに.'),
      qa('{先週|せんしゅう}、 だれ と えいが を {見|み}ました か。', 'Tuần trước bạn xem phim với ai?', ['{友達|ともだち} と {見|み}ました。', 'Tôi xem với bạn.'], ['{一人|ひとり} で {見|み}ました。 アニメ の えいが でした。', 'Tôi xem một mình. Là phim hoạt hình.'], 'だれと ⇒ **người と**; một mình ⇒ **一人で**.'),
    ],
  },
  {
    ma: 'Bài 6.1', ten: 'Rủ rê & có (～ませんか・～ましょう・N が あります)', slug: '61',
    ds: [
      qa('あした いっしょ に かいもの に {行|い}きません か。', 'Ngày mai đi mua sắm cùng không?', ['いい です ね。 {行|い}きましょう。', 'Hay đấy. Đi thôi.'], ['すみません、 あした は ちょっと……。 ようじ が あります から。', 'Xin lỗi, mai thì hơi… Vì tôi có việc bận.'], 'Nhận lời: **いいですね。～ましょう**. Từ chối khéo: **すみません、～はちょっと…… + lý do から** (ポイント 48–50).'),
      qa('^ハノイ に {川|かわ} が あります か。', 'Ở Hà Nội có sông không?', ['はい、 あります。 ホン-{川|がわ} が あります。', 'Có. Có sông Hồng.'], ['はい、 {大|おお}きい {川|かわ} が あります。', 'Có, có con sông lớn.'], '川 đứng một mình = かわ; sau tên sông = **がわ** (ホンがわ).'),
      qa('ジャズ の チケット が {二枚|にまい} あります か。', 'Bạn có 2 vé jazz không?', ['はい、 {二枚|にまい} あります。 いっしょ に {行|い}きません か。', 'Có, tôi có 2 vé. Đi cùng không?'], ['いいえ、 ありません。', 'Không, tôi không có.'], 'Số lượng đứng **sau が, trước あります**: チケットが **二枚** あります (ポイント 52).'),
      qa('{午後|ごご}、 ようじ が あります か。', 'Buổi chiều bạn có việc bận không?', ['はい、 あります。 アルバイト が あります。', 'Có. Tôi có việc làm thêm.'], ['いいえ、 ありません。 ひま です。', 'Không. Tôi rảnh.'], 'ようじがあります = có việc bận (ポイント 50). Rảnh = **ひまです**.'),
      qa('{今週|こんしゅう} の {日曜日|にちようび}、 いっしょ に こうえん へ {行|い}きません か。', 'Chủ nhật tuần này đi công viên cùng không?', ['いい です ね。 {行|い}きましょう。', 'Hay đấy. Đi thôi.'], ['すみません、 {日曜日|にちようび} は ちょっと……。 {約束|やくそく} が あります から。', 'Xin lỗi, Chủ nhật thì hơi… Vì tôi có hẹn.'], 'Có hẹn = **約束があります**. Nhớ すみません ở đầu khi từ chối.'),
    ],
  },
  {
    ma: 'Bài 6.2', ten: 'So sánh (いちばん・より・どちら・のほうが)', slug: '62',
    ds: [
      qa('スポーツ で {何|なに} が いちばん {好|す}き です か。', 'Trong các môn thể thao bạn thích môn nào nhất?', ['サッカー が いちばん {好|す}き です。', 'Tôi thích bóng đá nhất.'], ['テニス が いちばん {好|す}き です。 {毎週|まいしゅう} します。', 'Tôi thích tennis nhất. Tuần nào tôi cũng chơi.'], 'Khung **N1 で N2 が いちばん A です** (ポイント 53).'),
      qa('ジュース と ぎゅうにゅう と どちら が {好|す}き です か。', 'Nước ép và sữa, bạn thích cái nào hơn?', ['ジュース の ほう が {好|す}き です。', 'Tôi thích nước ép hơn.'], ['どちら も {好|す}き です。', 'Tôi thích cả hai.'], 'どちら ⇒ **～の ほうが** (ポイント 55–56); thích cả hai = **どちらも**.'),
      qa('^タイ-{料理|りょうり} と ^インド-{料理|りょうり} と どちら が からい です か。', 'Món Thái và món Ấn, món nào cay hơn?', ['インド-{料理|りょうり} の ほう が からい です。', 'Món Ấn cay hơn.'], ['タイ-{料理|りょうり} の ほう が からい です。 でも、 どちら も おいしい です。', 'Món Thái cay hơn. Nhưng cả hai đều ngon.'], 'Không có đáp án "đúng" — chọn một và nói **の ほうが**.'),
      qa('{飲|の}み{物|もの} で {何|なに} が いちばん きらい です か。', 'Trong các đồ uống bạn ghét gì nhất?', ['おさけ が いちばん きらい です。', 'Tôi ghét rượu nhất.'], ['コーヒー が いちばん きらい です。 にがい です から。', 'Tôi ghét cà phê nhất. Vì nó đắng.'], 'Thêm **lý do から** (にがい = đắng, Bài 4).'),
      qa('{今|いま}、 {何|なに} が いちばん {欲|ほ}しい です か。', 'Bây giờ bạn muốn có gì nhất?', ['{車|くるま} が いちばん {欲|ほ}しい です。', 'Tôi muốn có ô tô nhất.'], ['{新|あたら}しい {時計|とけい} が いちばん {欲|ほ}しい です。', 'Tôi muốn có đồng hồ mới nhất.'], '**N が いちばん ほしいです** — trợ từ が.'),
      qa('{春|はる} と {夏|なつ} と どちら が {好|す}き です か。', 'Mùa xuân và mùa hè bạn thích mùa nào hơn? (đề B-0 ③)', ['{春|はる} の ほう が {好|す}き です。 {暖|あたた}かい です から。', 'Tôi thích mùa xuân hơn. Vì ấm áp.'], ['{夏|なつ} の ほう が {好|す}き です。 {海|うみ} へ {行|い}きます から。', 'Tôi thích mùa hè hơn. Vì tôi đi biển.'], 'Đề B-0 ③: **のほうが + lý do から** = câu 2 vế, điểm tối đa.'),
    ],
  },
  {
    ma: 'Bài 6.3', ten: 'Đã … chưa (もう～ましたか → はい／いいえ、まだです)', slug: '63',
    ds: [
      qa('もう {日本|にほん} へ {行|い}きました か。', 'Bạn đã đi Nhật chưa?', ['いいえ、 まだ です。 {来年|らいねん} {行|い}きたい です。', 'Chưa. Năm sau tôi muốn đi.'], ['はい、 {行|い}きました。 {去年|きょねん} {東京|とうきょう} へ {行|い}きました。', 'Rồi. Năm ngoái tôi đã đến Tokyo.'], 'Chưa ⇒ **いいえ、まだです** (KHÔNG 行きませんでした) — ポイント 57.'),
      qa('もう おんせん に はいりました か。', 'Bạn đã tắm suối nước nóng chưa?', ['いいえ、 まだ です。', 'Chưa.'], ['はい、 はいりました。 とても きもち が よかった です。', 'Rồi. Rất dễ chịu.'], 'Tắm onsen = **おんせんに はいります** (trợ từ に).'),
      qa('もう タイタニック の えいが を {見|み}ました か。', 'Bạn đã xem phim Titanic chưa?', ['はい、 {見|み}ました。 とても よかった です。', 'Rồi. Rất hay.'], ['いいえ、 まだ です。 {見|み}たい です。', 'Chưa. Tôi muốn xem.'], 'いい → quá khứ **よかった**です (không いかった).'),
      qa('もう すきやき を {食|た}べました か。', 'Bạn đã ăn sukiyaki chưa?', ['はい、 {食|た}べました。 おいしかった です。', 'Rồi. Ngon lắm.'], ['いいえ、 まだ です。 {食|た}べたい です。', 'Chưa. Tôi muốn ăn.'], 'Thêm cảm nhận (おいしかったです) hoặc mong muốn (食べたいです).'),
      qa('もう ^ベトナム の おさけ を {飲|の}みました か。', 'Bạn đã uống rượu Việt Nam chưa?', ['いいえ、 まだ です。', 'Chưa.'], ['はい、 {飲|の}みました。 すこし {飲|の}みました。', 'Rồi. Tôi uống một chút.'], 'Câu ngắn nhưng **đủ はい／いいえ + động từ đúng thì** là đủ điểm.'),
    ],
  },
  {
    ma: 'Bài 6 — bổ sung', ten: 'Dạng trong "JPD123 HD thi nói" (第6課) chưa có ở trên', slug: '6b',
    ds: [
      qa('{今晩|こんばん}、 いっしょ に ごはん を {食|た}べません か。', 'Tối nay cùng ăn cơm không?', ['いい です ね。 {食|た}べましょう。', 'Hay đấy. Ăn thôi.'], ['すみません、 {今晩|こんばん} は ちょっと……。 アルバイト が あります から。', 'Xin lỗi, tối nay thì hơi… Vì tôi có ca làm thêm.'], 'Nhận lời dùng lại động từ của câu rủ: 食べません**か** → 食べ**ましょう**.'),
      qa('{日曜日|にちようび}、 こうえん で {何|なに} が あります か。', 'Chủ nhật ở công viên có gì?', ['コンサート が あります。', 'Có buổi hoà nhạc.'], ['サッカー の しあい が あります。 いっしょ に {見|み}に {行|い}きません か。', 'Có trận bóng đá. Đi xem cùng không?'], 'Sự kiện diễn ra ở đâu: **N1(nơi) で N2 が あります** (ポイント 51) — dùng で, không に.'),
      qa('{家族|かぞく} で だれ が いちばん いそがしい です か。', 'Trong gia đình ai bận nhất?', ['{父|ちち} が いちばん いそがしい です。', 'Bố tôi bận nhất.'], ['{私|わたし} が いちばん いそがしい です。 {毎日|まいにち} べんきょう します から。', 'Tôi bận nhất. Vì ngày nào tôi cũng học.'], '**だれが ⇒ người が** (không は).'),
      qa('^ベトナム で どこ が いちばん きれい です か。', 'Ở Việt Nam đâu đẹp nhất?', ['ダナン が いちばん きれい です。', 'Đà Nẵng đẹp nhất.'], ['^ハロン-{湾|わん} が いちばん きれい です。 {海|うみ} が とても きれい です から。', 'Vịnh Hạ Long đẹp nhất. Vì biển rất đẹp.'], 'どこが ⇒ **địa danh が いちばん ～です**.'),
      qa('^ハノイ は {一年|いちねん} で {何月|なんがつ} が いちばん {寒|さむ}い です か。', 'Ở Hà Nội tháng mấy lạnh nhất trong năm?', ['{一月|いちがつ} が いちばん {寒|さむ}い です。', 'Tháng 1 lạnh nhất.'], ['{十二月|じゅうにがつ} と {一月|いちがつ} が {寒|さむ}い です。 {一月|いちがつ} が いちばん {寒|さむ}い です。', 'Tháng 12 và tháng 1 lạnh. Tháng 1 lạnh nhất.'], '何月が ⇒ **～月が いちばん ～です**.'),
    ],
  },
  {
    ma: 'Bài 7 — tranh phố phường', ten: 'Ở đâu (N は N の［vị trí］に あります)', slug: '7a',
    ghi: 'Tranh của cô vẽ một con phố (không đăng lại ảnh ở đây — xem tranh trong tài liệu "Luyện nói"). Sơ đồ chữ dưới đây ghi đúng vị trí trong tranh để bạn tập trả lời. **Hàng sau** (từ trái sang phải) và **hàng trước** (phía bên này đường).',
    tranh: [
      { t: 'canh', anh: ['national-park', 'department-store', 'bank', 'office-building', 'police-officer', 'camera'], caption: 'こうえん · デパート · ぎんこう · たなかビル · こうばん · 山川ビル（カメラや）' },
      TABLE(
        ['', '1', '2', '3', '4', '5', '6', '7'],
        [
          ['Hàng sau', 'こうえん (công viên)', 'デパート (SALE)', 'ほしぞら{銀行|ぎんこう}', 'たなかビル (nhà hàng 🍴 · quán cà phê ☕)', 'ビル', 'こうばん (đồn cảnh sát)', '{山川|やまかわ}ビル (カメラや 📷 · {本屋|ほんや} 📖)'],
          ['— đường —', '', '', '', '', '', '', ''],
          ['Hàng trước', 'コンビニ (24)', 'バスてい + バス', 'ゆうびんきょく 〒', 'ビル', 'スーパー', 'P', '2 người hỏi đường'],
        ],
        'Sơ đồ tranh phố — vị trí theo tranh của cô',
      ),
    ],
    ds: [
      qa('たなか-ビル は どこ に あります か。', 'Toà nhà Tanaka ở đâu?', ['ぎんこう の となり に あります。', 'Ở bên cạnh ngân hàng.'], ['ぎんこう と ビル の {間|あいだ} に あります。 スーパー の {前|まえ} です。', 'Ở giữa ngân hàng và toà nhà. Ở trước (đối diện) siêu thị.'], 'Khung **N1 は N2 の［となり／前／後ろ／間］に あります** (ポイント 61). Vật → あります.'),
      qa('こうばん は どこ に あります か。', 'Đồn cảnh sát ở đâu?', ['{山川|やまかわ}-ビル の となり に あります。', 'Ở cạnh toà nhà Yamakawa.'], ['ビル と {山川|やまかわ}-ビル の {間|あいだ} に あります。', 'Ở giữa toà nhà và toà nhà Yamakawa.'], '**N1 と N2 の 間** = giữa N1 và N2.'),
      qa('こうえん は デパート の となり に あります か。', 'Công viên có ở cạnh trung tâm thương mại không?', ['はい、 あります。', 'Có.'], ['はい、 デパート の となり に あります。', 'Có, ở cạnh trung tâm thương mại.'], 'Câu Có/Không ⇒ **はい、あります** — đừng quên はい.'),
      qa('スーパー は どこ に あります か。', 'Siêu thị ở đâu?', ['たなか-ビル の {前|まえ} に あります。', 'Ở trước toà nhà Tanaka.'], ['ゆうびんきょく の ちかく に あります。', 'Ở gần bưu điện.'], 'Phía trước = **前(まえ)**, gần = **ちかく**.'),
      qa('ゆうびんきょく は スーパー の {後|うし}ろ に あります か。', 'Bưu điện có ở phía sau siêu thị không?', ['いいえ、 {後|うし}ろ じゃ ありません。 デパート の {前|まえ} に あります。', 'Không, không ở phía sau. Ở trước trung tâm thương mại.'], ['いいえ、 ありません。 バスてい の ちかく に あります。', 'Không. Ở gần bến xe buýt.'], 'Sai vị trí ⇒ **いいえ** + nói vị trí đúng. 後ろ đọc **うしろ**.'),
      qa('バスてい は どこ に あります か。', 'Bến xe buýt ở đâu?', ['コンビニ の となり に あります。', 'Ở cạnh cửa hàng tiện lợi.'], ['コンビニ と ゆうびんきょく の {間|あいだ} に あります。', 'Ở giữa cửa hàng tiện lợi và bưu điện.'], 'バスてい (bến xe buýt) — từ Bài 7.'),
      qa('カメラや は どこ に あります か。', 'Cửa hàng máy ảnh ở đâu?', ['{山川|やまかわ}-ビル の {中|なか} に あります。', 'Ở trong toà nhà Yamakawa.'], ['{山川|やまかわ}-ビル に あります。 {本屋|ほんや} の {上|うえ} です。', 'Ở toà nhà Yamakawa. Ở phía trên hiệu sách.'], 'Trong = **中(なか)**, trên = **上(うえ)**.'),
    ],
  },
  {
    ma: 'Bài 7 — tranh mọi người', ten: 'Đang làm gì (V ています)', slug: '7b',
    ghi: 'Tranh của cô: một bữa tiệc trong nhà (xem tranh ở tài liệu "Luyện nói"). Bảng dưới ghi mỗi người đang làm gì trong tranh.',
    tranh: [
      { t: 'canh', anh: ['woman-cook', 'man-standing', 'mobile-phone', 'speaking-head', 'beer-mug'], caption: 'パクさん · カルロスさん · メアリーさん · ワンさん · ナタポンさん' },
      TABLE(['Người', 'Trong tranh', 'Động từ thể て'], [
        ['パクさん', 'đứng ở bếp, đang nấu ăn', '{作|つく}ります → **{作|つく}って** います'],
        ['カルロスさん', 'đứng ngoài cửa kính, đang hút thuốc', 'すいます → **すって** います'],
        ['メアリーさん', 'đứng, đang nói điện thoại', 'かけます → **かけて** います'],
        ['ワンさん', 'ngồi sofa, đang nói chuyện với một cô gái', '{話|はな}します → **{話|はな}して** います'],
        ['ナタポンさん', 'ngồi ở bàn, đeo kính, đang uống bia', '{飲|の}みます → **{飲|の}んで** います'],
      ]),
    ],
    ds: [
      qa('パク-さん は {今|いま} {何|なに} を して います か。', 'Chị Park bây giờ đang làm gì?', ['{料理|りょうり} を {作|つく}って います。', 'Chị ấy đang nấu ăn.'], ['だいどころ で {料理|りょうり} を {作|つく}って います。', 'Chị ấy đang nấu ăn trong bếp.'], 'Đang làm ⇒ **V て います** (ポイント 64). Thêm nơi chốn **で** cho đủ ý.'),
      qa('カルロス-さん は {今|いま} {何|なに} を して います か。', 'Anh Carlos bây giờ đang làm gì?', ['たばこ を すって います。', 'Anh ấy đang hút thuốc.'], ['{外|そと} で たばこ を すって います。', 'Anh ấy đang hút thuốc ở bên ngoài.'], 'すいます → **すって** (nhóm 1, い → って).'),
      qa('メアリー-さん は {今|いま} {何|なに} を して います か。', 'Chị Mary bây giờ đang làm gì?', ['でんわ を かけて います。', 'Chị ấy đang gọi điện thoại.'], ['でんわ で {話|はな}して います。', 'Chị ấy đang nói chuyện điện thoại.'], 'Gọi điện = **でんわを かけます** → かけて います.'),
      qa('ワン-さん は {今|いま} {何|なに} を して います か。', 'Anh Wang bây giờ đang làm gì?', ['{話|はな}して います。', 'Anh ấy đang nói chuyện.'], ['{女|おんな} の {人|ひと} と {話|はな}して います。', 'Anh ấy đang nói chuyện với một cô gái.'], 'Nói chuyện **với ai = người と** 話します.'),
      qa('ナタポン-さん は {今|いま} {何|なに} を して います か。', 'Anh Nattapon bây giờ đang làm gì?', ['ビール を {飲|の}んで います。', 'Anh ấy đang uống bia.'], ['テーブル で ビール を {飲|の}んで います。', 'Anh ấy đang uống bia ở bàn.'], '飲みます → **飲んで** (み → んで).'),
    ],
  },
  {
    ma: 'Bài 7 — bổ sung', ten: 'Dạng trong "JPD123 HD thi nói" (第7課) chưa có ở trên', slug: '7c',
    ds: [
      qa('あなた の うち は どこ に あります か。', 'Nhà bạn ở đâu?', ['^カウザイ に あります。', 'Ở Cầu Giấy.'], ['{大学|だいがく} の ちかく に あります。 {歩|ある}いて {十分|じゅっぷん} です。', 'Ở gần trường. Đi bộ 10 phút.'], 'Khung **～に あります**. Thêm khoảng cách (Bài 4).'),
      qa('^FPT {大学|だいがく} は どこ に あります か。', 'ĐH FPT ở đâu?', ['ホアラック に あります。', 'Ở Hòa Lạc.'], ['ハノイ の {西|にし} に あります。 ホアラック です。', 'Ở phía tây Hà Nội. Ở Hòa Lạc.'], 'Có thể kết hợp Bài 4 (西) + Bài 7 (～にあります).'),
      qa('あなた の うち の {近|ちか}く に {何|なに} が あります か。', 'Gần nhà bạn có gì?', ['コンビニ と こうえん が あります。', 'Có cửa hàng tiện lợi và công viên.'], ['{大|おお}きい スーパー が あります。 そして、 いちば も あります。', 'Có siêu thị lớn. Và cũng có chợ.'], 'Khung **N1 に N2 が あります** (ポイント 62) — trả lời bằng が.'),
      qa('ねこ は どこ に います か。', 'Con mèo ở đâu?', ['テーブル の {下|した} に います。', 'Ở dưới gầm bàn.'], ['いす の {上|うえ} に います。 ねて います。', 'Ở trên ghế. Nó đang ngủ.'], 'Con vật / người ⇒ **います** (không あります).'),
      qa('{何|なん} で パン を きります か。', 'Bạn cắt bánh mì bằng gì?', ['ナイフ で きります。', 'Cắt bằng dao.'], ['ナイフ で きります。 はし で は きりません。', 'Cắt bằng dao. Không cắt bằng đũa.'], 'Dụng cụ ⇒ **N で** (ポイント 71). 何で đọc **なん**で.'),
      qa('^ベトナム-{人|じん} は フォーク と ナイフ で ごはん を {食|た}べます か。', 'Người Việt có ăn cơm bằng dĩa và dao không?', ['いいえ、 {食|た}べません。 はし で {食|た}べます。', 'Không. Chúng tôi ăn bằng đũa.'], ['いいえ、 はし と スプーン で {食|た}べます。', 'Không, chúng tôi ăn bằng đũa và thìa.'], 'Có/Không ⇒ いいえ + nói cách đúng (はしで).'),
      qa('{日本人|にほんじん} は {何|なん} で ごはん を {食|た}べます か。', 'Người Nhật ăn cơm bằng gì?', ['はし で {食|た}べます。', 'Ăn bằng đũa.'], ['はし で {食|た}べます。 スープ は スプーン で も {飲|の}みます。', 'Ăn bằng đũa. Súp thì cũng uống bằng thìa.'], '**dụng cụ で + V**.'),
      qa('だれ が うた を うたって います か。', 'Ai đang hát?', ['マイ-さん が うたって います。', 'Chị Mai đang hát.'], ['マイ-さん と ナム-さん が うたって います。', 'Chị Mai và anh Nam đang hát.'], '**だれが ⇒ người が** V ています (ポイント 68).'),
      qa('{今|いま}、 {何|なに} を して います か。', 'Bây giờ bạn đang làm gì?', ['{日本語|にほんご} の テスト を して います。', 'Tôi đang làm bài kiểm tra tiếng Nhật.'], ['{日本語|にほんご} で {話|はな}して います。', 'Tôi đang nói bằng tiếng Nhật.'], 'Câu hỏi về chính bạn ngay lúc đó — trả lời **V ています**.'),
    ],
  },
  {
    ma: 'Bài 8 — mở rộng', ten: 'Gia đình · tả người · cho/nhận (ポイント 72–80)', slug: '8',
    ghi: 'Ngoài phạm vi đề JPD123 (Bài 4–7) — luyện thêm nếu cô dạy tới Bài 8, hoặc để nói câu dài hơn.',
    ds: [
      qa('ご{家族|かぞく} は {何人|なんにん} です か。', 'Gia đình bạn có mấy người?', ['{四人|よにん} です。', '4 người.'], ['{四人|よにん} です。 {父|ちち} と {母|はは} と {弟|おとうと} と {私|わたし} です。', '4 người. Bố, mẹ, em trai và tôi.'], '4 người = **よにん**. Gia đình MÌNH: 父・母・弟 (ポイント 79–80).'),
      qa('{兄弟|きょうだい} が います か。', 'Bạn có anh chị em không?', ['はい、 {妹|いもうと} が {一人|ひとり} います。', 'Có, tôi có một em gái.'], ['いいえ、 いません。 {一人|ひとり} です。', 'Không, tôi không có. Tôi là con một.'], 'Người ⇒ **います**; số người đứng trước います: 妹が **一人** います.'),
      qa('お{父|とう}さん は {何|なに} を して います か。', 'Bố bạn làm nghề gì?', ['{会社員|かいしゃいん} です。 {銀行|ぎんこう} で はたらいて います。', 'Bố tôi là nhân viên công ty. Làm ở ngân hàng.'], ['{父|ちち} は {医者|いしゃ} です。', 'Bố tôi là bác sĩ.'], 'Hỏi bố người khác: お父さん; nói bố mình: **父(ちち)**. Nghề nghiệp: V ています (ポイント 73).'),
      qa('どこ に {住|す}んで います か。', 'Bạn sống ở đâu?', ['ハノイ に {住|す}んで います。', 'Tôi sống ở Hà Nội.'], ['ハノイ の ^カウザイ に {住|す}んで います。 {家族|かぞく} と いっしょ です。', 'Tôi sống ở Cầu Giấy, Hà Nội. Cùng gia đình.'], '**住んでいます** (trạng thái, ポイント 72) — không nói 住みます.'),
      qa('お{母|かあ}さん は どんな {人|ひと} です か。', 'Mẹ bạn là người như thế nào?', ['やさしい {人|ひと} です。', 'Là người hiền.'], ['{母|はは} は やさしくて、 {料理|りょうり} が {上手|じょうず} です。', 'Mẹ tôi hiền và nấu ăn giỏi.'], 'Nối hai tính từ: **やさしくて、～** (ポイント 75).'),
      qa('たんじょうび に {何|なに} を もらいました か。', 'Sinh nhật bạn được tặng gì?', ['{時計|とけい} を もらいました。', 'Tôi được tặng đồng hồ.'], ['{友達|ともだち} に {本|ほん} を もらいました。', 'Tôi được bạn tặng sách.'], '**người に N を もらいます** (ポイント 77).'),
      qa('{友達|ともだち} の たんじょうび に {何|なに} を あげます か。', 'Sinh nhật bạn, bạn tặng gì?', ['ケーキ を あげます。', 'Tôi tặng bánh kem.'], ['{友達|ともだち} に {花|はな} を あげます。', 'Tôi tặng hoa cho bạn.'], '**người に N を あげます** (ポイント 76).'),
      qa('ペット が います か。', 'Bạn có nuôi thú cưng không?', ['はい、 {犬|いぬ} が {一匹|いっぴき} います。', 'Có, tôi có một con chó.'], ['いいえ、 いません。 でも、 ねこ が {好|す}き です。', 'Không. Nhưng tôi thích mèo.'], 'Đếm con vật nhỏ: **～匹** (いっぴき, にひき, さんびき).'),
    ],
  },
  {
    ma: 'Bài 9 — mở rộng', ten: 'Sở thích · có thể · tần suất · cách đi (ポイント 81–87)', slug: '9',
    ghi: 'Ngoài phạm vi đề JPD123 (Bài 4–7) — luyện thêm nếu cô dạy tới Bài 9.',
    ds: [
      qa('しゅみ は {何|なん} です か。', 'Sở thích của bạn là gì?', ['{音楽|おんがく} を {聞|き}く こと です。', 'Là nghe nhạc.'], ['{写真|しゃしん} を とる こと です。 {週末|しゅうまつ} に よく とります。', 'Là chụp ảnh. Cuối tuần tôi hay chụp.'], '**V(thể từ điển) こと です** (ポイント 81): 聞く・とる・見る.'),
      qa('{泳|およ}ぐ こと が できます か。', 'Bạn có biết bơi không?', ['はい、 できます。', 'Có, tôi biết.'], ['いいえ、 できません。 でも、 {習|なら}いたい です。', 'Không, tôi không biết. Nhưng tôi muốn học.'], '**N／V こと が できます** (ポイント 82). Trả lời ngắn: できます／できません.'),
      qa('{一週間|いっしゅうかん} に {何回|なんかい} スポーツ を します か。', 'Một tuần bạn chơi thể thao mấy lần?', ['{二回|にかい} します。', 'Tôi chơi 2 lần.'], ['{一週間|いっしゅうかん} に {三回|さんかい} サッカー を します。', 'Một tuần tôi đá bóng 3 lần.'], '**khoảng thời gian に + số lần** (ポイント 84).'),
      qa('よく えいが を {見|み}ます か。', 'Bạn có hay xem phim không?', ['はい、 よく {見|み}ます。', 'Có, tôi hay xem.'], ['いいえ、 あまり {見|み}ません。 ときどき {見|み}ます。', 'Không, tôi không hay xem. Thỉnh thoảng thôi.'], 'Tần suất: いつも > よく > ときどき > **あまり～ません** > **全然～ません** (ポイント 85).'),
      qa('うち から {大学|だいがく} まで どうやって {来|き}ます か。', 'Bạn đến trường bằng cách nào?', ['バス で {来|き}ます。', 'Tôi đến bằng xe buýt.'], ['うち から {駅|えき} まで {歩|ある}いて、 バス に {乗|の}って {来|き}ます。', 'Tôi đi bộ từ nhà đến ga rồi lên xe buýt đến.'], 'どうやって (ポイント 86) ⇒ phương tiện で, hoặc chuỗi **Vて、Vて、V** (ポイント 83).'),
      qa('きのう {何|なに} を しました か。', 'Hôm qua bạn đã làm gì? (kể nhiều việc)', ['{友達|ともだち} に {会|あ}って、 えいが を {見|み}ました。', 'Tôi gặp bạn rồi xem phim.'], ['あさ ジョギング を して、 シャワー を あびて、 {大学|だいがく} へ {行|い}きました。', 'Sáng tôi chạy bộ, tắm rồi đến trường.'], 'Kể lần lượt: **Vて、Vて、Vました** — chỉ động từ cuối chia thì (ポイント 83).'),
      qa('{車|くるま} の {運転|うんてん} が できます か。', 'Bạn có biết lái ô tô không?', ['いいえ、 できません。', 'Không, tôi không biết.'], ['いいえ、 できません。 でも、 バイク の {運転|うんてん} が できます。', 'Không. Nhưng tôi biết lái xe máy.'], '**N(運転) が できます**. Nối ý ngược bằng **でも** (ポイント 87).'),
      qa('どんな {音楽|おんがく} を よく {聞|き}きます か。', 'Bạn hay nghe loại nhạc nào?', ['ポップス を よく {聞|き}きます。', 'Tôi hay nghe nhạc pop.'], ['クラシック を よく {聞|き}きます。 ジャズ も ときどき {聞|き}きます。', 'Tôi hay nghe nhạc cổ điển. Thỉnh thoảng cũng nghe jazz.'], 'Dùng từ Bài 9: ポップス・クラシック・ジャズ + よく／ときどき.'),
    ],
  },
];

const QA_BANK: Lesson = {
  id: 'b7-thi-thu-123-qa',
  kind: 'review',
  title: 'Part 2 Q&A — ngân hàng câu hỏi Bài 4.1 → 7 của cô (67 câu) + bổ sung theo HD thi nói + mở rộng Bài 8–9',
  goal: 'Trả lời TRỌN CÂU, đúng trợ từ, có thêm một ý cho mọi câu hỏi giám thị có thể hỏi ở đề B — câu theo tranh (đường đi, vị trí, đang làm gì) và câu về bản thân.',
  minutes: 150,
  blocks: [
    RECAP('Công thức một câu trả lời 15/15', [
      '**Nghe từ để hỏi**: どこ (ở đâu) · どのくらい (bao lâu) · どんな (như thế nào + N) · どう (cảm nhận) · だれ (ai) · なに (gì) · どうして (tại sao) · どちら (cái nào trong 2) · もう～ましたか (đã… chưa).',
      '**Câu Có/Không** (～ですか／～ますか không có từ để hỏi) ⇒ luôn mở đầu **はい／いいえ**.',
      '**Trả lời trọn câu** theo đúng khung của câu hỏi (lặp lại động từ/tính từ, đúng thì) — rồi **thêm 1 câu**: lý do 〜から, そして〜, それから〜.',
      'Mỗi câu dưới đây có **2 cách trả lời** (khẳng định/phủ định hoặc hai ý): học thuộc cách bạn thấy dễ nói nhất, cách kia để hiểu khi giám thị hỏi xoáy.',
      'Cuối mỗi nhóm có khối 🎤: bấm nghe câu hỏi → ghi âm câu trả lời của bạn → nghe lại, so với mẫu.',
    ]),
    TABLE(
      ['Nhóm', 'Số câu', 'Nguồn'],
      [
        ...NHOM_QA.map((n) => [n.ma, String(n.ds.length), /bổ sung/.test(n.ma) ? 'Dạng câu của "JPD123 HD thi nói"' : /mở rộng/.test(n.ma) ? 'Thêm — cùng dạng, Bài 8–9' : `Ngân hàng "Luyện nói" của cô (đủ mọi câu)${/4\.1|6\.2/.test(n.ma) ? ' + 1 câu của đề Demo B-0' : ''}`]),
        ['Tổng', String(NHOM_QA.reduce((a, n) => a + n.ds.length, 0)), ''],
      ],
    ),
    ...NHOM_QA.flatMap((n) => khoiNhom(n, 'b7-tt123-qa')),
  ],
};

/* ═══════════════════ d. 10 ĐỀ THI THỬ NÓI ═══════════════════ */

type DeThi = { so: number; doan: Doan; tranh: { anh: string[]; canh: string; bang?: string[][] }; cau: [QA, QA, QA] };

/** Thang tự chấm — áp cho mọi đề (Reading 45 · Q&A 45 · tác phong 10). */
function thangCham(d: DeThi): Block {
  const c = demDoan(d.doan);
  return TABLE(
    ['Phần', 'Bạn tự hỏi', 'Điểm'],
    [
      ['Reading (45)', `Đọc đúng **${c.gach.length} từ chữ Hán gạch chân** (${c.gach.join('・')}) và **${c.kata.length} từ katakana** (${c.kata.join('・')}); hiragana không sót âm (っ, trường âm, は=wa); không dừng quá 3 giây`, 'Mỗi ký tự sai ≈ −0,2 (tham khảo JPD113). Đọc đúng hết = 45'],
      ['Câu ① có tranh (15)', 'Nói ĐÚNG thông tin trên tranh, trọn câu, đúng trợ từ', '15 · sai trợ từ −2 · thông tin sai tranh = 0'],
      ['Câu ② (15)', 'Trọn câu, đúng thì, có はい／いいえ nếu là câu Có/Không, thêm 1 ý', '15 · quên はい／いいえ −(≤5) · sai từ vựng: tối đa 3'],
      ['Câu ③ (15)', 'Như câu ②', '15'],
      ['Tác phong (10)', 'Chào khi vào (しつれいします／よろしくおねがいします) và khi ra (ありがとうございました), nói rõ, không im lặng lâu', '10'],
      ['**Mục tiêu**', 'Đọc đúng ≥ 95% · 3 câu trọn câu + 1 ý thêm', '**≥ 90/100**'],
    ],
    'Thang tự chấm (điểm phần Q&A: 45 chia đều 3 câu — tài liệu JPD123 không ghi chi tiết; mức trừ lấy theo HD JPD113)',
  );
}

function deThi(d: DeThi): Lesson {
  const id = `b7-thi-thu-123-de-${d.so}`;
  const p = `b7-tt123-de${d.so}`;
  return {
    id,
    kind: 'review',
    title: `ĐỀ THI THỬ JPD123 — Đề ${d.so} (Reading A-${d.so} · Q&A B-${d.so})`,
    goal: `Làm trọn một lượt thi nói như trong phòng thi (20 giây chuẩn bị · đọc đoạn "${d.doan.ten}" · 3 câu hỏi, câu ① theo tranh), ghi âm, rồi tự chấm theo thang 100 điểm.`,
    minutes: 20,
    blocks: [
      RECAP(`Đề ${d.so} — làm như thi thật`, [
        'Bật ghi âm điện thoại. Nói **しつれいします。よろしくおねがいします。**',
        '**Part 1**: bấm giờ **20 giây** nhìn tờ đề A, rồi đọc to một lượt. Xong mới mở máy chấm.',
        '**Part 2**: mở khối 🎧 nghe từng câu hỏi (đừng mở lời thoại), trả lời vào khối 🎤. Câu ① nhìn tranh.',
        'Cuối cùng mới xem **đáp án mẫu** và **tự chấm** theo bảng.',
      ]),
      H(`Part 1: Reading — Đề A-${d.so}`),
      ...khoiDoan(d.doan, `${p}-doc`, `A-${d.so} · ${d.doan.ten}`).slice(1),
      H(`Part 2: Q&A — Đề B-${d.so}`),
      P('**① Câu có tranh** — nhìn tranh, nghe câu hỏi, trả lời đúng thông tin trên tranh. **② ③** — câu hỏi về bạn (không tranh).'),
      CANH(d.tranh.anh, d.tranh.canh),
      ...(d.tranh.bang ? [TABLE(['Trên tranh', 'Thông tin'], d.tranh.bang)] : []),
      {
        t: 'listen',
        id: `${p}-nghe`,
        title: `Nghe 3 câu hỏi của giám thị — Đề B-${d.so}`,
        note: 'Mỗi câu được hỏi tối đa 3 lần, mỗi lần nghĩ không quá 10 giây. Bắt từ để hỏi trước.',
        lines: d.cau.map((x, i) => ({ who: `Giám thị — câu ${'①②③'[i]}`, voice: 'ja-nu' as const, text: J(x.q), ro: R(x.q), vi: x.vi })),
      },
      { t: 'speak', id: `${p}-noi`, part: '1', questions: d.cau.map((x) => SQ(x.q)) },
      H(`Đáp án mẫu + tự chấm — Đề ${d.so}`),
      DLG(
        `Mẫu trả lời điểm cao — Đề B-${d.so}`,
        d.cau.flatMap((x, i) => [
          DX('examiner', x.q, `${'①②③'[i]} ${x.vi}`),
          ...x.a.map(([s, v], k) => DX('candidate', s, v, `Bạn — cách ${k + 1}`)),
        ]),
      ),
      TABLE(['Câu', 'Mẹo đủ ý'], d.cau.map((x, i) => ['①②③'[i], x.meo])),
      thangCham(d),
    ],
  };
}

const DE_10: DeThi[] = [
  {
    so: 1,
    doan: {
      ma: 'A-1', ten: 'Chuyến đi Sa Pa',
      cau: [
        ['{!先月|せんげつ}、 {友達|ともだち} と ^サパ へ {!行|い}きました。', 'Tháng trước tôi đi Sa Pa với bạn.'],
        ['^ハノイ から バス で {!六時間|ろくじかん} くらい でした。', 'Từ Hà Nội đi xe buýt khoảng 6 tiếng.'],
        ['サパ は {山|やま} の {中|なか} の {小|ちい}さい {町|まち} です。', 'Sa Pa là thị trấn nhỏ giữa núi.'],
        ['サパ に は {有名|ゆうめい} な {山|やま} が あります。', 'Ở Sa Pa có ngọn núi nổi tiếng.'],
        ['{!八月|はちがつ} でした が、 とても すずしかった です。', 'Dù là tháng 8 nhưng rất mát.'],
        ['あさ、 ホテル の まど から {山|やま} を {!見|み}ました。 とても きれい でした。', 'Buổi sáng tôi ngắm núi từ cửa sổ khách sạn. Rất đẹp.'],
        ['よる は {町|まち} で やきとり を {!食|た}べました。', 'Buổi tối tôi ăn xiên gà nướng trong thị trấn.'],
        ['{!来年|らいねん} の ふゆ も また {行|い}きたい です。', 'Mùa đông năm sau tôi cũng muốn đi nữa.'],
      ],
    },
    tranh: { anh: ['cityscape', 'bus', 'water-wave'], canh: 'ハノイ → 🚌 3時間 → ハロンわん', bang: [['Phương tiện', 'バス (xe buýt)'], ['Thời gian', '3時間 (3 tiếng)']] },
    cau: [
      qa('^ハノイ から ^ハロン-{湾|わん} まで バス で どのくらい です か。', 'Từ Hà Nội đến vịnh Hạ Long đi xe buýt mất bao lâu?', ['バス で {三時間|さんじかん} です。', 'Đi xe buýt mất 3 tiếng.'], ['{三時間|さんじかん} くらい です。 {車|くるま} で も {三時間|さんじかん} くらい です。', 'Khoảng 3 tiếng. Đi ô tô cũng khoảng 3 tiếng.'], 'Đọc đúng số trên tranh: **三時間 (さんじかん)**.'),
      qa('{週末|しゅうまつ}、 {何|なに} を しました か。', 'Cuối tuần bạn đã làm gì?', ['{友達|ともだち} と えいが を {見|み}ました。', 'Tôi xem phim với bạn.'], ['うち で そうじ を しました。 それから、 {日本語|にほんご} を べんきょう しました。', 'Tôi dọn nhà. Sau đó học tiếng Nhật.'], 'Quá khứ ⇒ **～ました**; việc thứ hai nối bằng **それから**.'),
      qa('{日本|にほん} {料理|りょうり} と ^ベトナム {料理|りょうり} と どちら が {好|す}き です か。', 'Món Nhật và món Việt, bạn thích món nào hơn?', ['ベトナム {料理|りょうり} の ほう が {好|す}き です。', 'Tôi thích món Việt hơn.'], ['{日本|にほん} {料理|りょうり} の ほう が {好|す}き です。 すし が おいしい です から。', 'Tôi thích món Nhật hơn. Vì sushi ngon.'], 'どちら ⇒ **～の ほうが** + lý do から.'),
    ],
  },
  {
    so: 2,
    doan: {
      ma: 'A-2', ten: 'Sinh nhật chị Mai',
      cau: [
        ['{!先週|せんしゅう} の {!金曜日|きんようび} は マイ-さん の たんじょうび でした。', 'Thứ Sáu tuần trước là sinh nhật chị Mai.'],
        ['{友達|ともだち} と いっしょ に レストラン で パーティー を しました。', 'Tôi cùng các bạn tổ chức tiệc ở nhà hàng.'],
        ['レストラン は {駅|えき} の ちかく に あります。', 'Nhà hàng ở gần ga.'],
        ['{私|わたし} は デパート で {!小|ちい}さい かばん を {!買|か}いました。', 'Tôi đã mua một chiếc túi nhỏ ở trung tâm thương mại.'],
        ['{料理|りょうり} は {!肉|にく} と {魚|さかな} でした。 どちら も おいしかった です。', 'Món ăn là thịt và cá. Cả hai đều ngon.'],
        ['みんな で {!九時|くじ} まで たくさん {!話|はな}しました。', 'Mọi người nói chuyện rất nhiều đến 9 giờ.'],
        ['とても たのしい よる でした。', 'Thật là một buổi tối vui.'],
      ],
    },
    tranh: { anh: ['national-park', 'admission-tickets', 'musical-notes'], canh: 'こうえん · 土曜日 · コンサート', bang: [['Nơi', 'こうえん (công viên)'], ['Ngày', '土曜日 (thứ Bảy)'], ['Sự kiện', 'コンサート (buổi hoà nhạc)']] },
    cau: [
      qa('{土曜日|どようび}、 こうえん で {何|なに} が あります か。', 'Thứ Bảy ở công viên có gì?', ['コンサート が あります。', 'Có buổi hoà nhạc.'], ['こうえん で コンサート が あります。 いっしょ に {行|い}きません か。', 'Ở công viên có buổi hoà nhạc. Đi cùng không?'], 'Sự kiện ở đâu: **N(nơi) で N が あります** (ポイント 51).'),
      qa('もう {日本|にほん} の おさけ を {飲|の}みました か。', 'Bạn đã uống rượu Nhật chưa?', ['いいえ、 まだ です。', 'Chưa.'], ['はい、 {飲|の}みました。 すこし あまかった です。', 'Rồi. Hơi ngọt.'], 'Chưa ⇒ **いいえ、まだです**.'),
      qa('どうして {日本語|にほんご} を べんきょう します か。', 'Tại sao bạn học tiếng Nhật?', ['{日本|にほん} の {会社|かいしゃ} が {好|す}き です から。', 'Vì tôi thích công ty Nhật.'], ['{日本|にほん} へ りょこう に {行|い}きたい です から。', 'Vì tôi muốn đi du lịch Nhật.'], 'どうして ⇒ **～から**.'),
    ],
  },
  {
    so: 3,
    doan: {
      ma: 'A-3', ten: 'Một ngày của tôi',
      cau: [
        ['{私|わたし} は {!毎日|まいにち} {六時|ろくじ} に おきます。', 'Ngày nào tôi cũng dậy lúc 6 giờ.'],
        ['あさごはん は パン と ぎゅうにゅう です。', 'Bữa sáng là bánh mì và sữa.'],
        ['{七時|しちじ} に バス で {!学校|がっこう} へ {行|い}きます。', '7 giờ tôi đi xe buýt đến trường.'],
        ['じゅぎょう は {!午前|ごぜん} {八時|はちじ} から {!十二時|じゅうにじ} まで です。', 'Giờ học từ 8 giờ sáng đến 12 giờ.'],
        ['{!午後|ごご} は としょかん で {!本|ほん} を {読|よ}みます。', 'Buổi chiều tôi đọc sách ở thư viện.'],
        ['としょかん は とても しずか です。', 'Thư viện rất yên tĩnh.'],
        ['よる は アルバイト が あります から、 いそがしい です。', 'Buổi tối có ca làm thêm nên tôi bận.'],
        ['{日曜日|にちようび} は {!休|やす}み です。 うち で ゆっくり します。', 'Chủ nhật được nghỉ. Tôi thong thả ở nhà.'],
      ],
    },
    tranh: { anh: ['cat', 'chair', 'bed'], canh: 'へや: テーブル の 下 に ねこ', bang: [['Con mèo', 'テーブルの 下 (dưới gầm bàn)']] },
    cau: [
      qa('ねこ は どこ に います か。', 'Con mèo ở đâu?', ['テーブル の {下|した} に います。', 'Ở dưới gầm bàn.'], ['ねこ は テーブル の {下|した} に います。 ねて います。', 'Con mèo ở dưới gầm bàn. Nó đang ngủ.'], 'Con vật ⇒ **います** (không あります). Vị trí: **N の 下 に**.'),
      qa('あなた の {町|まち} は にぎやか です か。', 'Thành phố của bạn có nhộn nhịp không?', ['はい、 とても にぎやか です。', 'Có, rất nhộn nhịp.'], ['いいえ、 にぎやか じゃ ありません。 {静|しず}か です。', 'Không, không nhộn nhịp. Yên tĩnh.'], 'ナ-adj phủ định: **じゃありません**.'),
      qa('{今|いま}、 {何|なに} が いちばん {欲|ほ}しい です か。', 'Bây giờ bạn muốn có gì nhất?', ['{新|あたら}しい パソコン が いちばん {欲|ほ}しい です。', 'Tôi muốn có máy tính mới nhất.'], ['バイク が いちばん {欲|ほ}しい です。 {大学|だいがく} は とおい です から。', 'Tôi muốn có xe máy nhất. Vì trường xa.'], '**N が いちばん ほしいです** — が, không を.'),
    ],
  },
  {
    so: 4,
    doan: {
      ma: 'A-4', ten: 'Quán phở gần nhà',
      cau: [
        ['{私|わたし} の うち の ちかく に フォー の みせ が あります。', 'Gần nhà tôi có một quán phở.'],
        ['みせ は {!小|ちい}さい です が、 いつも {人|ひと} が {多|おお}い です。', 'Quán nhỏ nhưng lúc nào cũng đông người.'],
        ['みせ は {駅|えき} から {歩|ある}いて {五分|ごふん} です。 ときどき {友達|ともだち} と も {行|い}きます。', 'Quán cách ga 5 phút đi bộ. Thỉnh thoảng tôi cũng đi với bạn.'],
        ['{!毎週|まいしゅう} {!日曜日|にちようび} の あさ、 {家族|かぞく} と {!食|た}べに {行|い}きます。', 'Sáng Chủ nhật hằng tuần tôi đi ăn cùng gia đình.'],
        ['フォー は {!三万|さんまん} ドン です。 とても {安|やす}い です。', 'Phở giá 30.000 đồng. Rất rẻ.'],
        ['みせ の {!前|まえ} に {!大|おお}きい {木|き} が あります。', 'Trước quán có một cái cây to.'],
        ['{私|わたし} は {料理|りょうり} で フォー が いちばん {好|す}き です。', 'Trong các món ăn tôi thích phở nhất.'],
      ],
    },
    tranh: { anh: ['woman-cook', 'cooking'], canh: 'この人: だいどころ で りょうり を つくっています' },
    cau: [
      qa('この {人|ひと} は {今|いま} {何|なに} を して います か。', 'Người này bây giờ đang làm gì?', ['{料理|りょうり} を {作|つく}って います。', 'Đang nấu ăn.'], ['だいどころ で {料理|りょうり} を {作|つく}って います。', 'Đang nấu ăn trong bếp.'], 'Đang làm ⇒ **Vて います**; 作ります → **作って**.'),
      qa('きのう の ばん、 {何|なに} を しました か。', 'Tối qua bạn đã làm gì?', ['テレビ を {見|み}ました。', 'Tôi xem tivi.'], ['{家族|かぞく} と ばんごはん を {食|た}べました。 それから、 {日本語|にほんご} を べんきょう しました。', 'Tôi ăn tối với gia đình. Sau đó học tiếng Nhật.'], 'Thêm việc thứ hai bằng **それから**.'),
      qa('スポーツ で {何|なに} が いちばん {好|す}き です か。', 'Trong các môn thể thao bạn thích môn nào nhất?', ['サッカー が いちばん {好|す}き です。', 'Tôi thích bóng đá nhất.'], ['バドミントン が いちばん {好|す}き です。 {毎週|まいしゅう} {友達|ともだち} と します。', 'Tôi thích cầu lông nhất. Tuần nào cũng chơi với bạn.'], '**N で 何が いちばん** ⇒ **N が いちばん ～です**.'),
    ],
  },
  {
    so: 5,
    doan: {
      ma: 'A-5', ten: 'Lễ hội ở trường',
      cau: [
        ['{!今週|こんしゅう} の {!土曜日|どようび}、 {!大学|だいがく} で おまつり が あります。', 'Thứ Bảy tuần này ở trường có lễ hội.'],
        ['{日本|にほん} の {食|た}べ{物|もの} の みせ が たくさん あります。', 'Có nhiều gian hàng đồ ăn Nhật.'],
        ['ゆかた の ファッション ショー も あります。', 'Cũng có buổi trình diễn thời trang yukata.'],
        ['ゆかた は {日本|にほん} の なつ の きもの です。 みんな で しゃしん も とりましょう。', 'Yukata là trang phục mùa hè của Nhật. Mọi người cùng chụp ảnh nhé.'],
        ['{私|わたし} は {友達|ともだち} と たこやき を {作|つく}ります。 {一|ひと}つ {!一万|いちまん} ドン です。', 'Tôi làm takoyaki với bạn. 10.000 đồng một cái.'],
        ['おまつり は {!午前|ごぜん} {十時|じゅうじ} から {!午後|ごご} {五時|ごじ} まで です。', 'Lễ hội từ 10 giờ sáng đến 5 giờ chiều.'],
        ['みなさん、 ぜひ {!来|き}て ください。', 'Mọi người nhất định hãy đến nhé.'],
      ],
    },
    tranh: { anh: ['map-of-japan', 'snowflake', 'cold-face'], canh: '日本 · 1月 · ゆき · さむい' },
    cau: [
      qa('{日本|にほん} は {一月|いちがつ}、 どう です か。', 'Nhật Bản tháng 1 thế nào?', ['とても {寒|さむ}い です。', 'Rất lạnh.'], ['{寒|さむ}い です。 そして、 {雪|ゆき} が {多|おお}い です。', 'Lạnh. Và nhiều tuyết.'], 'どうですか ⇒ **tính từ**; tranh có tuyết ⇒ thêm **雪が多いです**.'),
      qa('{今週|こんしゅう} の {日曜日|にちようび}、 いっしょ に えいが を {見|み}に {行|い}きません か。', 'Chủ nhật tuần này đi xem phim cùng không?', ['いい です ね。 {行|い}きましょう。', 'Hay đấy. Đi thôi.'], ['すみません、 {日曜日|にちようび} は ちょっと……。 アルバイト が あります から。', 'Xin lỗi, Chủ nhật thì hơi… Vì tôi có ca làm thêm.'], 'Nhận: **いいですね。～ましょう**; từ chối: **すみません、～はちょっと…… + から**.'),
      qa('うち から {大学|だいがく} まで どのくらい です か。', 'Từ nhà bạn đến trường mất bao lâu?', ['バス で {四十分|よんじゅっぷん} くらい です。', 'Đi xe buýt khoảng 40 phút.'], ['バイク で {二十分|にじゅっぷん} くらい です。 {近|ちか}い です。', 'Đi xe máy khoảng 20 phút. Gần.'], 'Phương tiện **で** + thời gian + くらい.'),
    ],
  },
  {
    so: 6,
    doan: {
      ma: 'A-6', ten: 'Kỳ nghỉ hè ở Nha Trang',
      cau: [
        ['{!今年|ことし} の なつやすみ、 {家族|かぞく} と ^ニャチャン へ {!行|い}きました。', 'Kỳ nghỉ hè năm nay tôi đi Nha Trang với gia đình.'],
        ['^ハノイ から {飛行機|ひこうき} で {!一時間四十分|いちじかんよんじゅっぷん} でした。', 'Từ Hà Nội đi máy bay mất 1 tiếng 40 phút.'],
        ['{海|うみ} は とても きれい でした。 {毎日|まいにち} {海|うみ} で あそびました。', 'Biển rất đẹp. Ngày nào tôi cũng chơi ở biển.'],
        ['ひる は {!大|おお}きい えび を {!食|た}べました。 とても おいしかった です。', 'Buổi trưa tôi ăn tôm to. Rất ngon.'],
        ['{日曜日|にちようび} は あめ でした から、 ホテル で {!休|やす}みました。', 'Chủ nhật trời mưa nên tôi nghỉ ở khách sạn.'],
        ['ホテル の プール も よかった です。 また {行|い}きたい です。', 'Bể bơi của khách sạn cũng tốt. Tôi muốn đi nữa.'],
      ],
    },
    tranh: { anh: ['hot-beverage', 'teacup-without-handle'], canh: 'コーヒー 30.000ドン · おちゃ 25.000ドン' },
    cau: [
      qa('コーヒー と おちゃ と どちら が {高|たか}い です か。', 'Cà phê và trà, cái nào đắt hơn?', ['コーヒー の ほう が {高|たか}い です。', 'Cà phê đắt hơn.'], ['コーヒー の ほう が {高|たか}い です。 おちゃ は コーヒー より {安|やす}い です。', 'Cà phê đắt hơn. Trà rẻ hơn cà phê.'], 'Nhìn giá trên tranh (30.000 > 25.000) ⇒ **コーヒーのほうが**. Cách 2 dùng thêm **より**.'),
      qa('{週末|しゅうまつ}、 どこか へ {行|い}きます か。', 'Cuối tuần bạn có đi đâu không?', ['はい、 こうえん へ {行|い}きます。', 'Có, tôi đi công viên.'], ['いいえ、 どこ へ も {行|い}きません。 うち で {休|やす}みます。', 'Không, tôi không đi đâu. Tôi nghỉ ở nhà.'], 'どこかへ ⇒ はい、～へ／いいえ、**どこへも**～ません.'),
      qa('^ハノイ は どんな {町|まち} です か。', 'Hà Nội là thành phố như thế nào?', ['にぎやか な {町|まち} です。', 'Là thành phố nhộn nhịp.'], ['ふるい {町|まち} です。 そして、 おいしい {食|た}べ{物|もの} が たくさん あります。', 'Là thành phố cổ. Và có nhiều đồ ăn ngon.'], 'どんな N ⇒ **tính từ + N**.'),
    ],
  },
  {
    so: 7,
    doan: {
      ma: 'A-7', ten: 'Đá bóng cùng bạn',
      cau: [
        ['{私|わたし} は サッカー が いちばん {好|す}き です。', 'Tôi thích bóng đá nhất.'],
        ['{!毎週|まいしゅう} {!水曜日|すいようび} と {!土曜日|どようび} に {友達|ともだち} と サッカー を します。', 'Thứ Tư và thứ Bảy hằng tuần tôi đá bóng với bạn.'],
        ['{!大学|だいがく} の グラウンド は {!大|おお}きい です。 そして、 きれい です。', 'Sân bóng của trường lớn. Và đẹp.'],
        ['{友達|ともだち} の ナム-さん は テニス の ほう が {好|す}き です。', 'Bạn tôi, anh Nam, thì thích tennis hơn.'],
        ['サッカー の {後|あと}、 みんな で ごはん を {食|た}べます。 とても たのしい です。', 'Đá bóng xong mọi người cùng ăn cơm. Rất vui.'],
        ['{!来月|らいげつ}、 {大学|だいがく} で サッカー の しあい が あります。', 'Tháng sau ở trường có trận đấu bóng đá.'],
        ['いっしょ に {見|み}に {来|き}ません か。', 'Bạn có đến xem cùng không?'],
      ],
    },
    tranh: { anh: ['kitchen-knife', 'bread'], canh: 'ナイフ と パン' },
    cau: [
      qa('{何|なん} で パン を きります か。', 'Bạn cắt bánh mì bằng gì?', ['ナイフ で きります。', 'Cắt bằng dao.'], ['ナイフ で パン を きります。', 'Tôi cắt bánh mì bằng dao.'], 'Dụng cụ ⇒ **N で** (ポイント 71). 何で đọc **なんで**.'),
      qa('おととい {何時|なんじ} に ねました か。', 'Hôm kia bạn đi ngủ lúc mấy giờ?', ['{十一時|じゅういちじ} に ねました。', 'Tôi ngủ lúc 11 giờ.'], ['{十二時|じゅうにじ} に ねました。 しゅくだい が ありました から。', 'Tôi ngủ lúc 12 giờ. Vì có bài tập.'], 'Giờ + **に**; quá khứ ⇒ **ねました**.'),
      qa('なつやすみ、 {何|なに} を したい です か。', 'Kỳ nghỉ hè bạn muốn làm gì?', ['{海|うみ} へ {行|い}きたい です。', 'Tôi muốn đi biển.'], ['{家族|かぞく} と ダナン へ りょこう に {行|い}きたい です。', 'Tôi muốn đi du lịch Đà Nẵng với gia đình.'], '**V(bỏ ます)たいです**.'),
    ],
  },
  {
    so: 8,
    doan: {
      ma: 'A-8', ten: 'Đường đến trường',
      cau: [
        ['{私|わたし} の うち は ^カウザイ に あります。', 'Nhà tôi ở Cầu Giấy.'],
        ['うち から {!大学|だいがく} まで バイク で {!三十分|さんじゅっぷん} くらい です。', 'Từ nhà đến trường đi xe máy khoảng 30 phút.'],
        ['うち の {!前|まえ} に {大|おお}きい スーパー が あります。', 'Trước nhà có một siêu thị lớn.'],
        ['スーパー の となり に ぎんこう と ゆうびんきょく が あります。', 'Cạnh siêu thị có ngân hàng và bưu điện.'],
        ['{!毎日|まいにち}、 えき の ちかく の みせ で コーヒー を {!飲|の}みます。', 'Ngày nào tôi cũng uống cà phê ở quán gần ga.'],
        ['それから、 {大学|だいがく} へ {!行|い}きます。 {!八時|はちじ} から じゅぎょう です。', 'Sau đó tôi đến trường. 8 giờ bắt đầu giờ học.'],
      ],
    },
    tranh: { anh: ['bank', 'japanese-post-office', 'convenience-store'], canh: 'ぎんこう · ゆうびんきょく · コンビニ (trái → phải)' },
    cau: [
      qa('ゆうびんきょく は どこ に あります か。', 'Bưu điện ở đâu?', ['ぎんこう と コンビニ の {間|あいだ} に あります。', 'Ở giữa ngân hàng và cửa hàng tiện lợi.'], ['ぎんこう の となり に あります。', 'Ở cạnh ngân hàng.'], 'Ở giữa hai chỗ ⇒ **N1 と N2 の 間(あいだ) に あります**.'),
      qa('{日本|にほん} の {食|た}べ{物|もの} は どう です か。', 'Đồ ăn Nhật thế nào?', ['とても おいしい です。', 'Rất ngon.'], ['おいしい です が、 すこし {高|たか}い です。', 'Ngon nhưng hơi đắt.'], 'Cảm nhận ⇒ tính từ; hai ý ngược nhau nối bằng **が**.'),
      qa('きょう {何時|なんじ} に おきました か。', 'Hôm nay bạn dậy lúc mấy giờ?', ['{六時半|ろくじはん} に おきました。', 'Tôi dậy lúc 6 rưỡi.'], ['{五時|ごじ} に おきました。 きょう は しけん が あります から。', 'Tôi dậy lúc 5 giờ. Vì hôm nay có bài thi.'], 'Giờ + **に** + quá khứ.'),
    ],
  },
  {
    so: 9,
    doan: {
      ma: 'A-9', ten: 'Bạn cùng phòng',
      cau: [
        ['{私|わたし} の ルームメイト は ^リン-さん です。', 'Bạn cùng phòng của tôi là Linh.'],
        ['リン-さん は {!日本語|にほんご} の {!学生|がくせい} です。', 'Linh là sinh viên tiếng Nhật.'],
        ['リン-さん は ダナン から {来|き}ました。', 'Linh đến từ Đà Nẵng.'],
        ['{!今|いま}、 リン-さん は へや で {!日本|にほん} の うた を {!聞|き}いて います。', 'Bây giờ Linh đang nghe bài hát Nhật trong phòng.'],
        ['{私|わたし} は つくえ で {日本語|にほんご} の {本|ほん} を {!読|よ}んで います。', 'Tôi đang đọc sách tiếng Nhật ở bàn.'],
        ['きのう は いっしょ に カレー を {作|つく}りました。 おいしかった です。', 'Hôm qua chúng tôi cùng nấu cà ri. Ngon lắm.'],
        ['{来週|らいしゅう} の {!日曜日|にちようび}、 いっしょ に えいが を {見|み}に {行|い}きます。', 'Chủ nhật tuần sau chúng tôi cùng đi xem phim.'],
      ],
    },
    tranh: { anh: ['airplane', 'map-of-japan'], canh: 'ベトナム → ✈ 5時間 → 日本' },
    cau: [
      qa('^ベトナム から {日本|にほん} まで {飛行機|ひこうき} で どのくらい です か。', 'Từ Việt Nam đến Nhật đi máy bay mất bao lâu?', ['{飛行機|ひこうき} で {五時間|ごじかん} です。', 'Đi máy bay mất 5 tiếng.'], ['{五時間|ごじかん} くらい です。', 'Khoảng 5 tiếng.'], 'Đọc số trên tranh: **五時間 (ごじかん)**.'),
      qa('{家族|かぞく} で だれ が いちばん いそがしい です か。', 'Trong gia đình ai bận nhất?', ['{母|はは} が いちばん いそがしい です。', 'Mẹ tôi bận nhất.'], ['{私|わたし} が いちばん いそがしい です。 {毎日|まいにち} べんきょう します から。', 'Tôi bận nhất. Vì ngày nào tôi cũng học.'], '**だれが** ⇒ người **が** いちばん ～です.'),
      qa('もう すきやき を {食|た}べました か。', 'Bạn đã ăn sukiyaki chưa?', ['いいえ、 まだ です。 {食|た}べたい です。', 'Chưa. Tôi muốn ăn.'], ['はい、 {食|た}べました。 とても おいしかった です。', 'Rồi. Rất ngon.'], 'Chưa ⇒ **いいえ、まだです**.'),
    ],
  },
  {
    so: 10,
    doan: {
      ma: 'A-10', ten: 'Chuyến công tác Kyoto',
      cau: [
        ['{!来月|らいげつ}、 {会社|かいしゃ} の {人|ひと} と {京都|きょうと} へ {!行|い}きます。', 'Tháng sau tôi đi Kyoto với người ở công ty.'],
        ['{京都|きょうと} は {東京|とうきょう} より しずか です。', 'Kyoto yên tĩnh hơn Tokyo.'],
        ['{東京|とうきょう} から {京都|きょうと} まで しんかんせん で {行|い}きます。', 'Từ Tokyo chúng tôi đi Kyoto bằng tàu Shinkansen.'],
        ['ふるい お{!寺|てら} が たくさん あります。 きんかくじ が いちばん {有名|ゆうめい} です。', 'Có nhiều chùa cổ. Chùa Vàng nổi tiếng nhất.'],
        ['{京都|きょうと} の {!料理|りょうり} は あまり からくない です。', 'Món ăn Kyoto không cay lắm.'],
        ['{私|わたし} は カメラ で お{寺|てら} の しゃしん を とりたい です。', 'Tôi muốn chụp ảnh chùa bằng máy ảnh.'],
        ['ホテル は えき の {!前|まえ} に あります。 {!月曜日|げつようび} に ハノイ へ {!帰|かえ}ります。', 'Khách sạn ở trước ga. Thứ Hai tôi về Hà Nội.'],
      ],
    },
    tranh: { anh: ['microphone', 'woman-singer', 'man-cook'], canh: 'パーティー: マイさん 🎤 うたっています · ナムさん 🍳', bang: [['マイさん', 'うたを うたっています'], ['ナムさん', 'りょうりを つくっています']] },
    cau: [
      qa('だれ が うた を うたって います か。', 'Ai đang hát?', ['マイ-さん が うたって います。', 'Chị Mai đang hát.'], ['マイ-さん が うた を うたって います。 ナム-さん は {料理|りょうり} を {作|つく}って います。', 'Chị Mai đang hát. Anh Nam đang nấu ăn.'], '**だれが** ⇒ **người が** Vています (không は).'),
      qa('{先週|せんしゅう}、 だれ と {買|か}い{物|もの} に {行|い}きました か。', 'Tuần trước bạn đi mua sắm với ai?', ['{友達|ともだち} と {行|い}きました。', 'Tôi đi với bạn.'], ['{一人|ひとり} で {行|い}きました。 くつ を {買|か}いました。', 'Tôi đi một mình. Tôi mua giày.'], 'người **と**; một mình **一人で**.'),
      qa('お{金|かね} が たくさん あります。 {何|なに} を したい です か。', 'Bạn có rất nhiều tiền. Bạn muốn làm gì?', ['{日本|にほん} へ {行|い}きたい です。', 'Tôi muốn đi Nhật.'], ['{家族|かぞく} と {日本|にほん} へ りょこう に {行|い}きたい です。 そして、 {大|おお}きい うち を {買|か}いたい です。', 'Tôi muốn đi du lịch Nhật với gia đình. Và muốn mua căn nhà lớn.'], '**V(bỏ ます)たいです** + そして.'),
    ],
  },
];

/* ═══════════════════ e. 2 ĐỀ VIẾT CUỐI KỲ ═══════════════════ */

type DeViet = {
  ma: 'A' | 'B';
  han: QI[]; tuVung: QI[]; troTu: QI[]; tuHoi: QI[]; chon: QI[];
  chia: { q: string; answers: string[]; hint?: string }[];
  doc: { tieuDe: string; paras: string[]; cau: QI[] };
  dichVN: { q: string; answers: string[]; hint?: string }[];
  dichJP: QI[];
};

const CAU_TRUC_VIET: [string, string, string, string][] = [
  ['I', 'Chữ Hán của lớp — đọc chữ (8) + chọn chữ đúng, đáp án nhiễu na ná (8)', '16', 'Chữ Hán của lớp Bài 4–7 (`bN-han-lop`) · ôn cuối kỳ `cuoi-ky-chu-han`'],
  ['II', 'Từ vựng — chọn từ hợp nghĩa', '10', 'Từ vựng `b4…b7-tu-vung`'],
  ['III', 'Trợ từ — mỗi câu 1–3 ô, **X** = không cần trợ từ', '12', 'ポイント 26–31, 42–46, 51–53, 61–62, 71'],
  ['IV', 'Từ để hỏi — nhìn câu trả lời để chọn', '11', 'ポイント 30, 32–33, 43–44, 55, 68–70'],
  ['V', 'Chọn đáp án đúng — ngữ pháp', '18', 'ポイント 24–71'],
  ['VI', 'Chia từ trong ngoặc (gõ đáp án)', '9', 'Bảng chia tính từ (Bài 4–5), thể ます/て (Bài 7)'],
  ['VII', 'Đọc hiểu — 1 đoạn, 3 chỗ trống + 2 câu nội dung', '5', 'Bài đọc của từng bài'],
  ['VIII', 'Dịch Việt → Nhật (gõ, 4) · Nhật → Việt (chọn, 4)', '8', 'Toàn bộ ngữ pháp Bài 4–7'],
];

function deViet(d: DeViet): Lesson {
  const p = `b7-tt123-viet-${d.ma.toLowerCase()}`;
  const tong = d.han.length + d.tuVung.length + d.troTu.length + d.tuHoi.length + d.chon.length + d.chia.length + d.doc.cau.length + d.dichVN.length + d.dichJP.length;
  return {
    id: `b7-thi-thu-123-viet-${d.ma.toLowerCase()}`,
    kind: 'review',
    title: `Đề viết cuối kỳ JPD123 — Đề ${d.ma} (Bài 4–7: chữ Hán · từ vựng · ngữ pháp · đọc · dịch — ${tong} câu, 60 phút)`,
    goal: `Làm trọn một đề viết theo khuôn đề ôn cuối kỳ của cô, bấm giờ 60 phút, tự chấm thang 10 và biết sai phần nào thì ôn ポイント nào.`,
    minutes: 60,
    blocks: [
      RECAP(`Đề ${d.ma} — đọc trước khi làm`, [
        '**Số câu / thời gian của đề viết cuối kỳ thật KHÔNG có trong tài liệu cô gửi** ⇒ đề này **theo khuôn đề luyện đã có**: phần III–VI giữ đúng số câu của đề ôn cuối kỳ cô phát (trợ từ 12 · từ để hỏi 11 · chọn đáp án 18 · chia từ 9), phần chữ Hán/từ vựng/đọc/dịch theo đề luyện `cuoi-ky-de-luyen`. Thời gian **60 phút** là thời gian luyện đề gợi ý.',
        '**Bấm giờ 60 phút**, làm từ I → VIII, không mở bài ôn. Phần I chữ Hán **không có furigana** như đề thật.',
        `Chấm: mỗi câu = 10 ÷ ${tong} điểm. Mục tiêu **≥ 9 điểm** = sai tối đa ${Math.floor(tong / 10)} câu.`,
      ]),
      TABLE(['Phần', 'Dạng', 'Số câu', 'Sai thì ôn'], [...CAU_TRUC_VIET.map((r) => [...r]), ['Tổng', '', `**${tong}**`, '']]),
      H('I. Chữ Hán của lớp'),
      MC(`${p}-han`, `I. Chữ Hán (${d.han.length} câu) — chữ trong 【 】 đọc thế nào / viết bằng chữ nào`, d.han),
      H('II. Từ vựng'),
      MC(`${p}-tu`, `II. Từ vựng (${d.tuVung.length} câu) — chọn từ điền vào（　）`, d.tuVung),
      H('III. Trợ từ'),
      MC(`${p}-tro`, `III. Trợ từ (${d.troTu.length} câu) — chọn bộ trợ từ đúng cho ①②③ (X = không cần)`, d.troTu),
      H('IV. Từ để hỏi'),
      MC(`${p}-hoi`, `IV. Từ để hỏi (${d.tuHoi.length} câu) — nhìn câu trả lời (sau …) để chọn`, d.tuHoi),
      H('V. Chọn đáp án đúng'),
      MC(`${p}-chon`, `V. Ngữ pháp (${d.chon.length} câu)`, d.chon),
      H('VI. Chia từ'),
      { t: 'quiz', id: `${p}-chia`, title: `VI. Chia từ trong ngoặc (${d.chia.length} câu) — gõ đúng dạng (kana hoặc chữ Hán đều được)`, kind: 'fill', grammar: 'Đọc cụm ĐỨNG SAU ngoặc: ～に行きます / ～たい → bỏ ます · ～ください / ～います → thể て · です đứng sau → tính từ quá khứ / phủ định', items: d.chia },
      H('VII. Đọc hiểu'),
      { t: 'passage', title: d.doc.tieuDe, intro: 'Đọc đoạn văn rồi trả lời câu hỏi. Chỗ trống（①）（②）（③）chọn từ thích hợp.', paras: d.doc.paras.map((text) => ({ text })) },
      MC(`${p}-doc`, `VII. Câu hỏi đọc hiểu (${d.doc.cau.length} câu)`, d.doc.cau),
      H('VIII. Dịch'),
      { t: 'quiz', id: `${p}-dich-vn`, title: `VIII-a. Dịch Việt → Nhật (${d.dichVN.length} câu) — gõ câu tiếng Nhật`, kind: 'translate', grammar: 'Tìm động từ/tính từ chính trước → gắn trợ từ theo công thức → kết thúc です／ます.', items: d.dichVN },
      MC(`${p}-dich-jp`, `VIII-b. Dịch Nhật → Việt (${d.dichJP.length} câu) — chọn nghĩa đúng`, d.dichJP),
      H('Tự chấm & sai phần nào ôn ở đâu'),
      TABLE(
        ['Số câu đúng', 'Điểm (/10)', 'Kết luận'],
        [
          [`${Math.ceil(tong * 0.9)} – ${tong}`, '9 – 10', '✅ Đạt mục tiêu — chuyển sang luyện nói'],
          [`${Math.ceil(tong * 0.8)} – ${Math.ceil(tong * 0.9) - 1}`, '8 – 8,9', 'Tốt — làm lại riêng phần sai nhiều nhất'],
          [`${Math.ceil(tong * 0.6)} – ${Math.ceil(tong * 0.8) - 1}`, '6 – 7,9', 'Ôn lại ngữ pháp `cuoi-ky-ngu-phap` rồi làm Đề ' + (d.ma === 'A' ? 'B' : 'A')],
          [`< ${Math.ceil(tong * 0.6)}`, '< 6', '⚠️ Quay về `bN-kiem-tra-…` từng bài (Bài 4 → 7), làm từng bài một'],
        ],
        `Quy đổi: điểm = số câu đúng × 10 ÷ ${tong}`,
      ),
      TABLE(['Sai nhiều ở', 'Ôn ở đâu'], CAU_TRUC_VIET.map(([ph, , , on]) => [`Phần ${ph}`, on])),
    ],
  };
}

const VIET_A: DeViet = {
  ma: 'A',
  han: [
    Q('【今週】', 'こんしゅう', 'こんしゅ | いましゅう | きんしゅう', '今 đọc **こん** trong 今週・今月・今晩 (いま khi đứng riêng); 週 = しゅう có trường âm.'),
    Q('【東京】', 'とうきょう', 'とうきょ | ひがしきょう | とおきょう', '東京 = **とうきょう** — cả hai chữ đều có trường âm う.'),
    Q('【飲み物】', 'のみもの', 'のみぶつ | いんもの | のみもつ', '飲み物 = のみ**もの**; 物 đi với kana ở trước đọc もの (食べ物・買い物).'),
    Q('【午後】', 'ごご', 'ごうご | うしご | ここ', '午後 = **ごご** (午前 ごぜん).'),
    Q('【来月】', 'らいげつ', 'らいがつ | きげつ | くるげつ', '来月 = らい**げつ**; 月 đọc がつ chỉ khi là tên tháng (一月 いちがつ).'),
    Q('【大きい】', 'おおきい', 'おきい | だいきい | たいきい', 'Tính từ 大きい đọc kun **おお**きい (trường âm). だい là âm on trong 大学.'),
    Q('【会社】', 'かいしゃ', 'かいしゃう | あいしゃ | かいじゃ', '会社 = かい**しゃ**.'),
    Q('【肉料理】', 'にくりょうり', 'にくりょり | しくりょうり | にくりようり', '肉 = にく · 料理 = **りょう**り (âm ghép りょ + う).'),
    Q('【せんしゅう】', '先週', '先過 | 生週 | 先周', 'Tuần trước = **先週**. 過/周 là chữ na ná, 生 khác 先.'),
    Q('【おとこ】', '男', '力 | 田 | 女', '男 = 田 (ruộng) + 力 (sức): người dùng sức làm ruộng = **đàn ông**.'),
    Q('【かいます】(mua)', '買います', '貝います | 員います | 見います', 'Mua = **買**: 罒 (cái lưới) trên 貝 (vỏ sò = tiền). 貝 thiếu phần trên.'),
    Q('【ききます】(nghe)', '聞きます', '間きます | 問きます | 開きます', 'Nghe = **聞**: 耳 (tai) trong 門 (cổng). 間 có 日, 問 có 口, 開 có 开.'),
    Q('【はなします】', '話します', '語します | 読します | 言します', 'Nói chuyện = **話**: 言 + 舌 (lưỡi).'),
    Q('【やすみ】', '休み', '体み | 木み | 本み', 'Nghỉ = **休**: người (亻) dựa gốc cây (木). 体 (thân thể) có 本.'),
    Q('ハノイ【し】(thành phố)', '市', '区 | 京 | 円', 'Thành phố = **市**; 区 = quận.'),
    Q('【はんぶん】', '半分', '羊分 | 半今 | 平分', 'Một nửa = **半分**. 羊 (dê), 平 (bằng) là chữ na ná 半.'),
  ],
  tuVung: [
    Q('{富士山|ふじさん}は {日本|にほん}で いちばん（　）{山|やま}です。', 'たかい', 'ひくい | ひろい | ちかい', 'Núi Phú Sĩ cao nhất Nhật ⇒ **たかい** (cao).'),
    Q('この ケーキは さとうが たくさん ありますから、とても（　）です。', 'あまい', 'からい | にがい | すっぱい', 'Nhiều đường ⇒ **あまい** (ngọt).'),
    Q('ハノイから ハイフォンまで（　）で ２{時間|じかん}です。', 'くるま', 'えき | まち | みどり', 'Phương tiện + で ⇒ **くるま** (ô tô).'),
    Q('きのうは（　）が わるかったですから、どこへも {行|い}きませんでした。', 'てんき', 'ようじ | やくそく | けしき', 'てんきが わるい = thời tiết xấu.'),
    Q('すみません、あしたは（　）が ありますから、ちょっと……。', 'ようじ', 'てんき | けしき | セール', 'Từ chối vì **có việc bận** = ようじが あります (ポイント 50).'),
    Q('（　）で {肉|にく}を きります。', 'ナイフ', 'スプーン | コップ | おさら', 'Cắt thịt bằng **ナイフ** (dao).'),
    Q('つめたい ジュースは（　）の {中|なか}に あります。', 'れいぞうこ', 'でんしレンジ | まど | いす', 'Đồ uống lạnh ở trong **tủ lạnh** (れいぞうこ).'),
    Q('（　）の {日|ひ}、うちで テレビを {見|み}ます。', 'やすみ', 'しごと | じゅぎょう | テスト', 'やすみの日 = ngày nghỉ.'),
    Q('デパートで（　）が ありますから、ふくが やすいです。', 'セール', 'チケット | ツアー | コース', 'セール = đợt giảm giá ⇒ quần áo rẻ.'),
    Q('Đồn cảnh sát khu vực ở trước ga: えきの まえに（　）が あります。', 'こうばん', 'ゆうびんきょく | としょかん | びじゅつかん', 'こうばん = đồn cảnh sát khu vực (Bài 7).'),
  ],
  troTu: [
    Q('わたし（①）くに（②）なつ、とても あついです。', '① の　② は', '① は　② の | ① の　② に | ① が　② は', '**わたしの くには** + mùa không có に: 「なつ、～です」 (ポイント 26).'),
    Q('うち（①）がっこう（②）じてんしゃ（③）２０{分|ぷん}です。', '① から　② まで　③ で', '① から　② まで　③ に | ① で　② まで　③ で | ① から　② へ　③ を', 'から～まで + phương tiện **で** (ポイント 30–31).'),
    Q('にほん（①）なに（②）いちばん ゆうめいですか。', '① で　② が', '① は　② が | ① で　② は | ① に　② を', 'Phạm vi **で**; từ để hỏi làm chủ ngữ + **が** (ポイント 53).'),
    Q('こうえん（①）こども（②）います。', '① に　② が', '① で　② が | ① に　② を | ① は　② に', 'Nơi tồn tại **に** + N **が** います (ポイント 62).'),
    Q('デパート（①）くつ（②）かい（③）いきます。', '① へ　② を　③ に', '① に　② が　③ へ | ① へ　② を　③ で | ① で　② を　③ に', 'Nơi へ + N を + V(bỏ ます) **に** 行きます (ポイント 42).'),
    Q('ともだち（①）えいが（②）みました。', '① と　② を', '① に　② を | ① と　② が | ① で　② を', 'Cùng ai = **と** (ポイント 46).'),
    Q('ハノイ（①）ホーチミン（②）、どちら（③）おおきいですか。', '① と　② と　③ が', '① と　② は　③ が | ① や　② と　③ を | ① と　② の　③ が', 'A **と** B **と** どちら **が** (ポイント 55).'),
    Q('りんご（①）みっつ（②）ください。', '① を　② X', '① が　② を | ① を　② に | ① は　② X', 'Số lượng đứng trước động từ, **không trợ từ**: りんごを みっつ ください.'),
    Q('だいがく（①）コンサート（②）あります。', '① で　② が', '① に　② が | ① で　② を | ① へ　② が', 'Sự kiện diễn ra **で** (ポイント 51) — khác vật tồn tại に.'),
    Q('はし（①）ごはん（②）たべます。', '① で　② を', '① に　② を | ① と　② を | ① で　② が', 'Dụng cụ **で** (ポイント 71).'),
    Q('つくえ（①）うえ（②）ほん（③）あります。', '① の　② に　③ が', '① に　② の　③ が | ① の　② で　③ が | ① の　② に　③ を', 'N **の** 上 **に** N **が** あります.'),
    Q('わたし（①）ジュース（②）ほうが すきです。', '① は　② の', '① が　② が | ① は　② が | ① の　② の', 'N **の ほうが** (ポイント 56).'),
  ],
  tuHoi: [
    Q('ハノイから ダナンまで（　）ですか。…ひこうきで １{時間半|じかんはん}です。', 'どのくらい', 'いくら | いつ | どう', 'Trả lời thời gian đi ⇒ **どのくらい** (ポイント 30).'),
    Q('ハノイは（　）まちですか。…ふるい まちです。', 'どんな', 'どう | どれ | どこ', 'Có danh từ まち theo sau ⇒ **どんな** (ポイント 32).'),
    Q('きのうの パーティーは（　）でしたか。…たのしかったです。', 'どう', 'どんな | なに | だれ', 'Hỏi cảm nhận, không có danh từ ⇒ **どう** (ポイント 33/38).'),
    Q('かぞくで（　）が いちばん いそがしいですか。…ちちです。', 'だれ', 'なに | どこ | どれ', 'Trả lời là người ⇒ **だれ** (ポイント 53/68).'),
    Q('（　）にほんごを べんきょうしますか。…にほんの アニメが すきですから。', 'どうして', 'どう | どこで | いつ', 'Trả lời ～から ⇒ **どうして** (ポイント 44).'),
    Q('にくと さかなと（　）が すきですか。…さかなの ほうが すきです。', 'どちら', 'どれ | どの | なに', 'Chọn 1 trong 2 ⇒ **どちら** (ポイント 55).'),
    Q('（　）で ごはんを たべますか。…はしで たべます。', 'なん', 'どこ | だれ | いつ', 'Hỏi dụng cụ ⇒ **なんで** (何で).'),
    Q('（　）が うたを うたっていますか。…マイさんです。', 'だれ', 'なに | どれ | どこ', 'Ai làm ⇒ **だれが** (ポイント 68).'),
    Q('ぎんこうは（　）に ありますか。…えきの まえに あります。', 'どこ', 'どれ | どちら | なに', 'Hỏi vị trí ⇒ **どこに** (ポイント 61).'),
    Q('あなたの かさは（　）ですか。…あの くろい かさです。', 'どれ', 'どの | どんな | どう', '**どれ** đứng một mình (không có danh từ sau) — ポイント 70.'),
    Q('しゅうまつ（　）へ いきましたか。…いいえ、どこへも いきませんでした。', 'どこか', 'どこ | どこも | どこへも', 'Có đi đâu không ⇒ **どこかへ** (ポイント 43).'),
  ],
  chon: [
    Q('きのうは とても（　）。', 'さむかったです', 'さむいでした | さむくでした | さむいかったです', 'Quá khứ イ-adj: bỏ い + **かったです** (ポイント 38).'),
    Q('この へやは あまり（　）。', 'ひろくないです', 'ひろいです | ひろいじゃありません | ひろくです', 'あまり + phủ định: ひろ**くない**です (ポイント 27).'),
    Q('ハノイは（　）まちです。', 'にぎやかな', 'にぎやか | にぎやかい | にぎやかの', 'ナ-adj + **な** + N (ポイント 25).'),
    Q('きのうは にちようび（　）。', 'でした', 'です | かったです | ました', 'Danh từ quá khứ = N **でした**.'),
    Q('わたしは あたらしい くつが（　）です。', 'ほしい', 'ほしく | たい | ほしくて', 'N が **ほしい**です (ポイント 40).'),
    Q('にほんへ（　）です。', 'いきたい', 'いくたい | いきますたい | いきたく', 'V(bỏ ます) + **たい** (ポイント 41).'),
    Q('デパートへ ふくを（　）に いきます。', 'かい', 'かう | かって | かいます', 'V(bỏ ます) **に** 行きます (ポイント 42).'),
    Q('A：いっしょに コーヒーを のみませんか。 B：ええ、（　）。', 'のみましょう', 'のみません | のみましたか | のんでください', 'Nhận lời rủ ⇒ **～ましょう** (ポイント 49).'),
    Q('ハノイは ダナン（　）さむいです。', 'より', 'ほう | から | まで', 'A は B **より** ～ (ポイント 54).'),
    Q('A：もう ひるごはんを たべましたか。 B：いいえ、（　）。', 'まだです', 'たべませんでした | もうです | たべません', 'Chưa ⇒ **まだです** (ポイント 57).'),
    Q('テーブルの うえに ねこが（　）。', 'います', 'あります | です | いますか', 'Con vật ⇒ **います**.'),
    Q('すみません、しおを（　）ください。', 'とって', 'とりて | とて | とります', 'とります (nhóm 1, り) → **とって** (ポイント 63).'),
    Q('パクさんは いま でんわを（　）。', 'かけています', 'かけます | かけましたか | かけてください', 'Đang làm ⇒ **V て います** (ポイント 64).'),
    Q('A：さむいですね。まどを（　）。 B：ありがとうございます。', 'しめましょうか', 'しめませんか | しめたいです | しめます', 'Đề nghị giúp người kia ⇒ **～ましょうか** (ポイント 65).'),
    Q('この かんじの（　）が わかりません。', 'よみかた', 'よむかた | よみます | よんで', 'V(bỏ ます) + **かた** = cách V (ポイント 66).'),
    Q('ジュースは もう（　）。かいに いきます。', 'ありません', 'あります | まだです | いません', '**もう ありません** = không còn nữa (ポイント 67).'),
    Q('（　）ケーキが いいですか。…その ちいさい ケーキが いいです。', 'どの', 'どれ | どう | どこ', '**どの + N** (ポイント 69).'),
    Q('きのうは（　）から、がっこうを やすみました。', 'かぜでした', 'かぜです | かぜかった | かぜくて', 'Danh từ quá khứ + から: **かぜでしたから** (ポイント 47).'),
  ],
  chia: [
    { q: 'きのうの テストは（むずかしい → quá khứ）＿＿です。', answers: V('むずかしかった', '{難|むずか}しかった'), hint: 'イ-adj quá khứ: bỏ い + かった' },
    { q: 'この りょうりは あまり（おいしい → phủ định）＿＿です。', answers: V('おいしくない'), hint: 'あまり + ～くない' },
    { q: 'デパートへ くつを（かいます）＿＿に いきます。', answers: V('かい', '{買|か}い'), hint: 'V(bỏ ます) に 行きます' },
    { q: 'しゅうまつ、うみへ（いきます）＿＿たいです。', answers: V('いき', '{行|い}き'), hint: 'V(bỏ ます) たい' },
    { q: 'すみません、ここに なまえを（かきます）＿＿ください。', answers: V('かいて', '{書|か}いて'), hint: 'き → いて' },
    { q: 'いま、ともだちと（はなします）＿＿います。', answers: V('はなして', '{話|はな}して'), hint: 'し → して' },
    { q: 'あした いっしょに えいがを（みます → rủ）＿＿か。', answers: V('みません', '{見|み}ません'), hint: 'Rủ: ～ませんか' },
    { q: 'せんしゅうは（ひま → quá khứ phủ định）＿＿。', answers: V('ひまじゃありませんでした', 'ひまではありませんでした', '{暇|ひま}じゃありませんでした'), hint: 'ナ-adj: じゃありませんでした' },
    { q: 'にもつが おもいですね。（もちます → đề nghị giúp）＿＿か。', answers: V('もちましょう', '{持|も}ちましょう'), hint: 'Để tôi … nhé: ～ましょうか' },
  ],
  doc: {
    tieuDe: 'VII. Đọc hiểu — 「わたしの まち」',
    paras: [
      'わたしの まちは ハイフォンです。ハノイから くるまで ２{時間|じかん}ぐらいです。ハイフォンは（①）まちです。うみが ありますから、なつは ひとが おおいです（②）、ふゆは あまり ひとが いません。',
      'せんしゅう、ともだちと ハイフォンへ かえりました。うみの ちかくの レストランで さかなを たべました。とても（③）です。らいげつ、また かえりたいです。',
    ],
    cau: [
      Q('（①）に はいる ことばは どれですか。', 'にぎやかな', 'にぎやか | にぎやかい | にぎやかで', 'Trước danh từ まち ⇒ ナ-adj + **な**.'),
      Q('（②）に はいる ことばは どれですか。', 'が', 'から | そして | それから', 'Hai ý ngược nhau (hè đông ↔ đông vắng) ⇒ **が** (ポイント 35).'),
      Q('（③）に はいる ことばは どれですか。', 'おいしかった', 'おいしい | おいしいでした | おいしくて', 'Kể chuyện tuần trước ⇒ quá khứ **おいしかった**です.'),
      Q('Câu nào ĐÚNG với đoạn văn?', 'Mùa đông ở Hải Phòng không đông người lắm.', 'Từ Hà Nội đến Hải Phòng đi tàu mất 2 tiếng. | Mùa hè Hải Phòng vắng người. | Người viết sống ở Hà Nội và chưa từng đến Hải Phòng.', '「ふゆは あまり ひとが いません」 = mùa đông không đông lắm. Đoạn văn nói đi **ô tô**, không phải tàu.'),
      Q('Tuần trước người viết đã làm gì?', 'Về Hải Phòng với bạn và ăn cá ở nhà hàng gần biển.', 'Đi biển một mình. | Nấu cá ở nhà. | Đi Hà Nội bằng ô tô.', '「ともだちと ハイフォンへ かえりました。…レストランで さかなを たべました」.'),
    ],
  },
  dichVN: [
    { q: 'Từ nhà tôi đến trường đi xe buýt mất 30 phút.', answers: V('うちから{学校|がっこう}までバスで{三十分|さんじゅっぷん}です', 'うちから{学校|がっこう}までバスで30{分|ぷん}です', 'うちから{大学|だいがく}までバスで{三十分|さんじゅっぷん}です', 'うちから{大学|だいがく}までバスで30{分|ぷん}です', '{私|わたし}のうちから{学校|がっこう}までバスで{三十分|さんじゅっぷん}です', 'うちから{学校|がっこう}までバスで{三十分|さんじゅっぷん}かかります'), hint: 'から～まで · バスで · ～分です' },
    { q: 'Hôm qua trời rất lạnh.', answers: V('きのうはとても{寒|さむ}かったです', '{昨日|きのう}はとても{寒|さむ}かったです', 'きのうはとてもさむかったです'), hint: 'さむい → さむかったです' },
    { q: 'Tôi muốn đi Nhật.', answers: V('{日本|にほん}へ{行|い}きたいです', '{日本|にほん}に{行|い}きたいです', '{私|わたし}は{日本|にほん}へ{行|い}きたいです', '{私|わたし}は{日本|にほん}に{行|い}きたいです'), hint: 'V(bỏ ます)たいです' },
    { q: 'Con chó ở dưới gầm bàn.', answers: V('{犬|いぬ}はテーブルの{下|した}にいます', 'いぬはつくえの{下|した}にいます', '{犬|いぬ}はつくえの{下|した}にいます'), hint: 'N は N の 下 に います' },
  ],
  dichJP: [
    Q('ハノイは ホーチミンより しずかです。', 'Hà Nội yên tĩnh hơn TP.HCM.', 'TP.HCM yên tĩnh hơn Hà Nội. | Hà Nội yên tĩnh nhất. | Hà Nội và TP.HCM đều yên tĩnh.', 'A は B **より** A-adj = A hơn B.'),
    Q('もう しゅくだいを しましたか。…いいえ、まだです。', 'Đã làm bài tập chưa? — Chưa.', 'Có làm bài tập không? — Không làm. | Bài tập khó không? — Chưa khó. | Đang làm bài tập à? — Vẫn đang làm.', 'もう～ましたか = đã … chưa; まだです = chưa.'),
    Q('すみません、まどを あけて ください。', 'Xin lỗi, hãy mở cửa sổ giúp tôi.', 'Xin lỗi, tôi mở cửa sổ nhé. | Xin lỗi, cửa sổ đang mở. | Xin lỗi, đừng mở cửa sổ.', 'V て ください = hãy V (nhờ).'),
    Q('どうして きのう きませんでしたか。', 'Tại sao hôm qua bạn không đến?', 'Hôm qua bạn đến bằng gì? | Tại sao hôm nay bạn đến? | Hôm qua bạn có đến không?', 'どうして = tại sao; きませんでした = đã không đến.'),
  ],
};

const VIET_B: DeViet = {
  ma: 'B',
  han: [
    Q('【先生】', 'せんせい', 'せんせ | さきせい | せんしょう', '先生 = せん**せい** (trường âm).'),
    Q('【名前】', 'なまえ', 'めいぜん | なまい | なまえい', '名前 = **なまえ** (đọc kun cả từ).'),
    Q('【毎日】', 'まいにち', 'まいび | まいひ | めいにち', '毎日 = まい**にち**.'),
    Q('【買い物】', 'かいもの', 'かいぶつ | ばいもの | かうもの', '買い物 = かい**もの**.'),
    Q('【帰ります】', 'かえります', 'きります | かいります | もどります', '帰ります = **かえ**ります (về nhà).'),
    Q('【小さい】', 'ちいさい', 'ちさい | しょうさい | こさい', 'Tính từ 小さい = **ちい**さい (trường âm い).'),
    Q('【女の人】', 'おんなのひと', 'おんなのじん | じょのひと | おなのひと', '女の人 = おんなの**ひと**; 人 đứng sau の đọc ひと.'),
    Q('【料理】', 'りょうり', 'りょり | りゅうり | りようり', '料理 = **りょう**り.'),
    Q('【らいねん】', '来年', '未年 | 米年 | 来午', 'Năm sau = **来年**. 未/米 na ná 来; 午 na ná 年.'),
    Q('【がっこう】', '学校', '学枚 | 字校 | 学交', 'Trường học = **学校** (校 có bộ 木). 字 khác 学 ở phần trên.'),
    Q('【ごぜん】', '午前', '牛前 | 午後 | 年前', 'Buổi sáng = **午前**. 牛 (bò) có nét xuyên lên trên; 午後 = buổi chiều.'),
    Q('【みます】', '見ます', '貝ます | 目ます | 員ます', 'Nhìn = **見**: con mắt (目) trên đôi chân (儿).'),
    Q('【かいしゃ】', '会社', '会杜 | 合社 | 今社', 'Công ty = **会社**. 社 bộ 礻; 杜 bộ 木 là chữ khác; 合 ≠ 会.'),
    Q('【おてら】', 'お寺', 'お持 | お時 | お等', 'Chùa = **寺** (土 trên 寸). 持・時・等 đều CHỨA 寺 nhưng là chữ khác.'),
    Q('【なんようび】', '何曜日', '何週日 | 何躍日 | 何曜月', 'Thứ mấy = **何曜日**. 躍 (nhảy) bộ 足, không phải 曜 bộ 日.'),
    Q('【もん】 (cổng)', '門', '間 | 聞 | 問', 'Cổng = **門**; 間・聞・問 đều có 門 bao ngoài.'),
  ],
  tuVung: [
    Q('ベトナムの（　）は あついです。うみへ いきます。', 'なつ', 'ふゆ | はる | あき', 'Nóng, đi biển ⇒ **なつ** (mùa hè).'),
    Q('ホーチミンは ベトナムの（　）です。', 'みなみ', 'きた | ひがし | にし', 'TP.HCM ở **phía nam** (みなみ).'),
    Q('あの みせの ラーメンは（　）ですが、おいしいです。', 'やすい', 'たかい | ひくい | ひろい', 'Đối lập với "ngon" theo kiểu bất ngờ — rẻ **mà** ngon. やすい = rẻ.'),
    Q('ちかてつで（　）へ いきます。えいがを みます。', 'えいがかん', 'いざかや | びじゅつかん | こうばん', 'Xem phim ở **えいがかん** (rạp chiếu phim).'),
    Q('コンサートの（　）が ２まい あります。', 'チケット', 'ツアー | コース | セール', 'Đếm bằng まい ⇒ **チケット** (vé).'),
    Q('（　）を いれて ください。コーヒーが すこし にがいです。', 'さとう', 'しお | しょうゆ | みず', 'Cà phê đắng ⇒ cho thêm **さとう** (đường).'),
    Q('さむいですから、（　）を しめて ください。', 'まど', 'テーブル | れいぞうこ | いす', 'Đóng **cửa sổ** (まど) vì lạnh.'),
    Q('あの（　）は ゆうめいな かしゅです。', 'おんなの ひと', 'おんなの こ | てんき | きせつ', 'Ca sĩ nổi tiếng ⇒ **người phụ nữ** kia.'),
    Q('おんせんに（　）ました。きもちが よかったです。', 'はいり', 'のぼり | とり | かり', 'Tắm suối nước nóng = おんせんに **はいります**.'),
    Q('ハノイは（　）が おおいです。こうえんが たくさん あります。', 'みどり', 'ゆき | あめ | かわ', 'Công viên nhiều ⇒ **みどり** (cây xanh) nhiều.'),
  ],
  troTu: [
    Q('ダナン（①）ハノイ（②）ひこうき（③）１{時間|じかん}{半|はん}です。', '① から　② まで　③ で', '① まで　② から　③ で | ① から　② まで　③ に | ① から　② へ　③ を', 'から～まで + phương tiện **で**. (Câu hỏi "Từ Đà Nẵng đến Hà Nội…")'),
    Q('ベトナム（①）１がつ（②）すずしいです。', '① は　② X', '① は　② に | ① の　② は | ① が　② で', 'Mùa/tháng trong khung ポイント 26: **N は［tháng］、A です** — không trợ từ.'),
    Q('あには サッカー（①）すきです。でも、わたしは テニス（②）すきです。', '① が　② が', '① を　② を | ① が　② を | ① は　② に', '好き luôn đi với **が** (ポイント 39).'),
    Q('きのう だれ（①）あいましたか。…ともだち（②）あいました。', '① に　② に', '① を　② を | ① と　② を | ① が　② が', '会います: **người に 会います**.'),
    Q('ひとり（①）えいがを みました。', '① で', '① と | ① に | ① が', 'Một mình = **ひとりで**.'),
    Q('まいあさ ７じ（①）おきます。', '① に', '① で | ① X | ① へ', 'Giờ cụ thể + **に**.'),
    Q('あした（①）よる、ともだち（②）カラオケ（③）いきます。', '① の　② と　③ に', '① に　② と　③ を | ① の　② に　③ へ | ① の　② を　③ に', 'あしたの よる · ともだちと · カラオケ**に**行きます (đi để làm).'),
    Q('ぎんこうは えき（①）デパート（②）あいだ（③）あります。', '① と　② の　③ に', '① の　② と　③ に | ① と　② に　③ の | ① と　② の　③ で', '**N1 と N2 の 間 に** あります.'),
    Q('わたしの へや（①）テレビ（②）ありません。', '① に　② が', '① で　② が | ① に　② を | ① は　② に', 'Nơi に + N が ありません.'),
    Q('ナイフ（①）パン（②）きって ください。', '① で　② を', '① に　② を | ① を　② で | ① で　② が', 'Dụng cụ **で**, vật **を**.'),
    Q('この りょうり（①）つくりかた（②）おしえて ください。', '① の　② を', '① を　② を | ① の　② が | ① が　② を', '**N の V かた** + を おしえて ください (ポイント 66).'),
    Q('へやに だれ（①）いますか。…パクさん（②）います。', '① が　② が', '① は　② は | ① を　② が | ① が　② は', 'Từ để hỏi làm chủ ngữ ⇒ **が**; trả lời cũng **が**.'),
  ],
  tuHoi: [
    Q('（　）きせつが いちばん すきですか。…はるが いちばん すきです。', 'どの', 'どれ | どう | どちら', 'Có danh từ きせつ theo sau ⇒ **どの** (ポイント 69).'),
    Q('ふじさんは（　）ですか。…とても たかいです。', 'どう', 'どんな | どこ | どれ', 'Hỏi cảm nhận/tính chất, không có danh từ ⇒ **どう**.'),
    Q('あれは（　）ホテルですか。…あたらしい ホテルです。', 'どんな', 'どう | どの | どちら', 'Có danh từ ホテル theo sau ⇒ **どんな**.'),
    Q('（　）が ほしいですか。…あたらしい とけいが ほしいです。', 'なに', 'だれ | どこ | どう', 'Hỏi vật ⇒ **なに**.'),
    Q('きのう（　）と えいがを みましたか。…ルームメイトと みました。', 'だれ', 'なに | どこ | いつ', 'Hỏi người cùng làm ⇒ **だれと**.'),
    Q('ハノイは（　）が いちばん さむいですか。…１がつです。', 'なんがつ', 'なんじ | なんようび | なんまい', 'Trả lời tháng ⇒ **なんがつ**.'),
    Q('チケットが（　）ありますか。…２まい あります。', 'なんまい', 'いくら | なんがつ | なんじ', 'Đếm bằng まい ⇒ **なんまい** (ポイント 52).'),
    Q('ダナンは（　）ですか。…ベトナムの まんなかです。', 'どこ', 'どれ | どんな | どう', 'Hỏi vị trí trên bản đồ ⇒ **どこ** (ポイント 29).'),
    Q('タイりょうりと インドりょうりと（　）が からいですか。…インドりょうりの ほうが からいです。', 'どちら', 'どれ | どの | なに', 'Hai thứ ⇒ **どちら**.'),
    Q('（　）きのう がっこうを やすみましたか。…かぜでしたから。', 'どうして', 'どう | なんで | いつ', 'Trả lời ～から ⇒ **どうして**.'),
    Q('メアリーさんは いま（　）を していますか。…でんわを かけています。', 'なに', 'だれ | どこ | どれ', 'Đang làm gì ⇒ **なにを** していますか.'),
  ],
  chon: [
    Q('きのうの えいがは あまり（　）。', 'おもしろくなかったです', 'おもしろいでした | おもしろくないでした | おもしろかったです', 'あまり + quá khứ phủ định: ～**くなかった**です.'),
    Q('せんしゅうの りょこうは（　）。', 'たのしかったです', 'たのしいでした | たのしかったでした | たのしくでした', 'たのしい → **たのしかった**です.'),
    Q('この まちは（　）です。そして、きれいです。', 'しずか', 'しずかな | しずかい | しずかの', 'Cuối vị ngữ: ナ-adj **không な** (しずかです).'),
    Q('きのうの テストは（　）。', 'かんたんでした', 'かんたんかったです | かんたんいでした | かんたんだったでした', 'ナ-adj quá khứ: **～でした**.'),
    Q('てんきが（　）ですから、こうえんへ いきましょう。', 'いい', 'いく | よかった | いいの', 'Hiện tại: てんきが **いい**です (quá khứ mới đổi よかった).'),
    Q('きのうは てんきが（　）。', 'よかったです', 'いかったです | いいでした | よいでした', 'いい → quá khứ **よかった**です (không いかった).'),
    Q('わたしは にく（　）すきです。', 'が', 'を | に | で', '**N が すきです**.'),
    Q('A：ごはんを たべに いきませんか。 B：すみません、きょうは ちょっと……。（　）。', 'また こんど', 'いいですね | たべましょう | ぜひ', 'Từ chối khéo kết thúc bằng **また今度** (hẹn lần sau).'),
    Q('ベトナムで どこが（　）きれいですか。', 'いちばん', 'より | ほう | どちらも', '**いちばん** = nhất (ポイント 53).'),
    Q('A：コーヒーと こうちゃと どちらが いいですか。 B：（　）いいです。', 'どちらも', 'どちらが | どれも | どこも', 'Cả hai đều = **どちらも**.'),
    Q('もう きっぷを（　）か。…はい、かいました。', 'かいました', 'かいます | かって | かいたい', 'もう ～**ました**か.'),
    Q('へやに パクさんが（　）。', 'います', 'あります | いきます | です', 'Người ⇒ **います**.'),
    Q('ここに じゅうしょを（　）ください。', 'かいて', 'かきて | かって | かいで', 'かきます (き) → **かいて**.'),
    Q('ちょっと（　）ください。', 'まって', 'まちて | まて | まいて', 'まちます (ち) → **まって**.'),
    Q('いま ワンさんは ギターを（　）。', 'ひいています', 'ひきます | ひきました | ひいてください', 'Đang chơi đàn ⇒ ひきます (き) → **ひいています**.'),
    Q('A：おもいですね。わたしが（　）。 B：ありがとうございます。', 'もちましょうか', 'もちませんか | もちたいです | もってください', 'Đề nghị giúp ⇒ **～ましょうか**.'),
    Q('さとうは（　）ありませんから、かいに いきます。', 'もう', 'まだ | よく | とても', '**もう ありません** = hết rồi.'),
    Q('A：なにを のみますか。 B：こうちゃ（　）のみます。', 'を', 'が | で | の', 'Uống ⇒ **N を のみます** (không が).'),
  ],
  chia: [
    { q: 'きのうは（いそがしい → quá khứ）＿＿です。', answers: V('いそがしかった', '{忙|いそが}しかった'), hint: 'bỏ い + かった' },
    { q: 'この かばんは あまり（たかい → phủ định）＿＿です。', answers: V('たかくない', '{高|たか}くない'), hint: '～くない' },
    { q: 'ゆうびんきょくへ きってを（かいます）＿＿に いきます。', answers: V('かい', '{買|か}い'), hint: 'V(bỏ ます) に' },
    { q: 'つめたい ジュースが（のみます）＿＿たいです。', answers: V('のみ', '{飲|の}み'), hint: 'V(bỏ ます) たい' },
    { q: 'すみません、しょうゆを（とります）＿＿ください。', answers: V('とって', '{取|と}って'), hint: 'り → って' },
    { q: 'パクさんは だいどころで さらを（あらいます）＿＿います。', answers: V('あらって', '{洗|あら}って'), hint: 'い → って' },
    { q: 'いっしょに ひるごはんを（たべます → "… thôi")＿＿。', answers: V('たべましょう', '{食|た}べましょう'), hint: '～ましょう' },
    { q: 'せんしゅうの しけんは（かんたん → quá khứ）＿＿。', answers: V('かんたんでした', '{簡単|かんたん}でした'), hint: 'ナ-adj: でした' },
    { q: 'まどを（あけます）＿＿ください。', answers: V('あけて', '{開|あ}けて'), hint: 'Nhóm 2: bỏ ます + て' },
  ],
  doc: {
    tieuDe: 'VII. Đọc hiểu — 「しゅうまつ」',
    paras: [
      'わたしは まいしゅう どようびに アルバイトを します。カフェで コーヒーを つくります。カフェは えきの まえに あります。（①）おおきくないですが、とても きれいです。',
      'にちようびは アルバイトが ありません。せんしゅうの にちようびは ルームメイトと こうえんへ いきました。こうえんで サッカーの しあいを みました。とても（②）です。それから、レストランで ひるごはんを たべました。こんしゅうの にちようびは ルームメイトと えいがを（③）いきます。',
    ],
    cau: [
      Q('（①）に はいる ことばは どれですか。', 'カフェは あまり', 'カフェは とても | カフェが いちばん | カフェより', 'あまり + ～くないです (ポイント 27).'),
      Q('（②）に はいる ことばは どれですか。', 'おもしろかった', 'おもしろい | おもしろいでした | おもしろくて', 'Kể chuyện Chủ nhật tuần trước ⇒ quá khứ.'),
      Q('（③）に はいる ことばは どれですか。', 'みに', 'みて | みる | みたい', 'V(bỏ ます) **に** 行きます.'),
      Q('Câu nào ĐÚNG với đoạn văn?', 'Người viết làm thêm vào thứ Bảy hằng tuần.', 'Người viết làm thêm cả thứ Bảy và Chủ nhật. | Quán cà phê ở cạnh công viên. | Chủ nhật tuần trước người viết đá bóng.', '「まいしゅう どようびに アルバイトを します」; Chủ nhật không làm; họ **xem** trận bóng chứ không đá.'),
      Q('Chủ nhật tuần này người viết sẽ làm gì?', 'Đi xem phim với bạn cùng phòng.', 'Làm thêm ở quán cà phê. | Đi công viên xem bóng đá. | Ăn trưa một mình.', '「こんしゅうの にちようびは ルームメイトと えいがを みに いきます」.'),
    ],
  },
  dichVN: [
    { q: 'Ở công viên có nhiều trẻ em.', answers: V('{公園|こうえん}に{子|こ}どもがたくさんいます', 'こうえんにこどもがたくさんいます', '{公園|こうえん}に{子供|こども}がたくさんいます', '{公園|こうえん}には{子|こ}どもがたくさんいます'), hint: 'N(nơi) に N が たくさん います' },
    { q: 'Tôi thích mùa xuân nhất.', answers: V('{春|はる}がいちばん{好|す}きです', '{私|わたし}は{春|はる}がいちばん{好|す}きです', '{春|はる}が{一番|いちばん}{好|す}きです', '{私|わたし}は{春|はる}が{一番|いちばん}{好|す}きです'), hint: 'N が いちばん すきです' },
    { q: 'Hãy viết tên ở đây.', answers: V('ここに{名前|なまえ}を{書|か}いてください', '{名前|なまえ}をここに{書|か}いてください'), hint: 'V て ください' },
    { q: 'Anh Tanaka đang đọc sách.', answers: V('{田中|たなか}さんは{本|ほん}を{読|よ}んでいます', 'タナカさんは{本|ほん}を{読|よ}んでいます'), hint: 'V て います' },
  ],
  dichJP: [
    Q('いっしょに かいものに いきませんか。', 'Đi mua sắm cùng không?', 'Tôi không đi mua sắm. | Đã đi mua sắm chưa? | Hãy đi mua sắm.', 'V ませんか = lời rủ (ポイント 48).'),
    Q('きょうとは とうきょうより ふるい まちです。', 'Kyoto là thành phố cổ hơn Tokyo.', 'Tokyo là thành phố cổ hơn Kyoto. | Kyoto và Tokyo đều là thành phố cổ. | Kyoto là thành phố cổ nhất.', 'A は B より ～ = A hơn B.'),
    Q('この かんじの よみかたを おしえて ください。', 'Hãy chỉ cho tôi cách đọc chữ Hán này.', 'Hãy đọc chữ Hán này. | Tôi đã học cách đọc chữ Hán này. | Chữ Hán này đọc khó quá.', 'V(bỏ ます)かた = cách V; おしえて ください = hãy chỉ cho.'),
    Q('わたしの まちに ふるい おてらが あります。', 'Ở thành phố tôi có một ngôi chùa cổ.', 'Thành phố tôi ở cạnh ngôi chùa cổ. | Tôi đã đến ngôi chùa cổ. | Chùa ở thành phố tôi không cổ.', 'N1 に N2 が あります = ở N1 có N2.'),
  ],
};

/* ══════════════ dùng lại ở kiemTraBai49.ts (cùng bộ máy romaji / khối) ══════════════ */

export type { Doan, QA, Nhom, QI };
export { J, R, SQ, H, P, NOTE, TABLE, RECAP, CANH, Q, MC, DX, DLG, qa, khoiDoan, khoiNhom };

export const THI_CUOI_KY_123: Lesson[] = [FORM, READING, QA_BANK, ...DE_10.map(deThi), deViet(VIET_A), deViet(VIET_B)];
/** Cho bộ kiểm (scripts) — mọi đoạn đọc của tệp. */
export const DOAN_THI_123: Doan[] = [...DOAN_20, ...DE_10.map((d) => d.doan)];

