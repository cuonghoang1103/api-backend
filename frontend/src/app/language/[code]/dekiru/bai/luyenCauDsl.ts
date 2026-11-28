/**
 * 🔁 LUYỆN CÂU 2 CHIỀU + ✍️ TẬP VIẾT (28/11/2026) — bộ dựng dùng chung cho luyenCauB13.ts · luyenCauB47.ts · luyenCauB810.ts.
 *
 * Người học (đã trượt JPD113/JPD123 nhiều lần) tập viết tay mỗi ngày trên iPad: thấy câu tiếng Việt → viết câu tiếng Nhật
 * → bấm xem đáp án (chữ Hán + furigana + romaji) → nghe → nói theo cho máy chấm. Mỗi bài N dựng 2 mục:
 *   `bN-luyen-cau`  mẫu câu (trật tự Việt ↔ Nhật, lỗi hay mắc) + khối `luyenCau` (60–100 câu MỚI) + liên kết ôn thi.
 *   `bN-tap-viet`   chữ Hán của lớp viết theo TỪ (`write`) + chép câu mẫu trên giấy ô vuông + viết đoạn 3–5 câu (`giayViet`).
 * (+ Bài 3: `b3-thi-thu-viet-113` đề luyện viết JPD113 — luyenCauB13.ts.)
 *
 * Câu viết bằng "DSL từ" như jp113B12.ts: các từ cách nhau dấu cách, chữ Hán luôn `{漢字|かな}`, `^` = viết hoa romaji
 * (tên riêng). `J()` bỏ dấu cách → chữ Nhật; `R()` sinh romaji từ kana (は→wa, へ→e, を→o) — romaji luôn khớp chữ.
 * Quy ước chữ Hán: CHỈ viết chữ Hán cho chữ của lớp đến bài đó (hanLop.ts) — còn lại viết kana, đúng như bài thi
 * (máy chấm vẫn nhận cách viết chữ Hán khác của IME). Bộ kiểm: `node … scripts/kiem-luyen-cau.mts`.
 *
 * Chỉ `import type` — scripts/course-manifest.mts (Node thuần) nạp tệp này.
 */
import type { Block, CauLuyen, Ex, Lesson } from '@/components/sach-hoc/types';

/* ══════════════ romaji tự động từ furigana (cùng luật jp113B12.ts) ══════════════ */

const KS: Record<string, string> = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o', か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go', さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo', た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do', な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho', ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po', ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo', ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro', わ: 'wa', を: 'o', ん: 'n',
  ゔ: 'vu',
};
const KS_SMALL: Record<string, string> = { ゃ: 'a', ゅ: 'u', ょ: 'o' };
const KS_FOREIGN: Record<string, string> = {
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', うぃ: 'wi', うぇ: 'we', うぉ: 'wo', てぃ: 'ti', でぃ: 'di',
  でゅ: 'dyu', ちぇ: 'che', しぇ: 'she', じぇ: 'je', つぁ: 'tsa', とぅ: 'tu', どぅ: 'du',
};
const WA_COMBO = new Set(['では', 'には', 'とは', 'へは', 'からは', 'までは', 'こんにちは', 'こんばんは', 'でわ']);

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
    if (c === 'っ' || c === 'ッ') { sokuon = true; continue; }
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
    const PUN: Record<string, string> = { '。': '.', '、': ',', '？': '?', '！': '!', '…': '...', '「': '"', '」': '"', '〜': '~', '～': '~', '—': '—' };
    if (PUN[c] !== undefined) { out += PUN[c]; continue; }
    if (/[ぁぃぅぇぉ]/.test(c)) continue;
    if (/[（）()・\s]/.test(c)) continue;
    out += c;
  }
  return out;
}
const docKana = (t: string) => t.replace(/\{([^|}]+)\|([^}]+)\}/g, '$2');

function tok(t: string): [string, string] {
  let cap = false;
  let x = t;
  if (x.startsWith('^')) { cap = true; x = x.slice(1); }
  const ja = x.replace(/-/g, '');
  const body = docKana(x).replace(/[。、？！「」—]+$/, '');
  const tail = docKana(x).slice(body.length);
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
export const J = (s: string): string => toks(s).map((t) => tok(t)[0]).join('');
/** Romaji, viết hoa đầu câu. */
export const R = (s: string): string => {
  let out = '';
  let start = true;
  for (const t of toks(s)) {
    let r = tok(t)[1];
    if (start && r) { r = r.charAt(0).toUpperCase() + r.slice(1); start = false; }
    out += (out ? ' ' : '') + r;
    if (/[.?!—]["]?$/.test(r)) start = true;
  }
  return out;
};
export const E = (s: string, vi: string): Ex => ({ en: J(s), ro: R(s), vi });

/* ══════════════ câu luyện ══════════════ */

/** Một câu: [tiếng Việt, câu DSL, cách viết khác (DSL, tuỳ chọn), gợi ý từ (tuỳ chọn)]. */
export type C = [vi: string, dsl: string, alt?: string[], goi?: string];
/** Một nhóm câu cùng mẫu câu `np` (nhãn lọc hiện trong khối). Câu xếp NGẮN → DÀI trong mỗi bài. */
export const nhom = (np: string, ds: C[]): CauLuyen[] =>
  ds.map(([vi, dsl, alt, goi]) => ({ vi, ja: J(dsl), ro: R(dsl), np, ...(alt?.length ? { alt: alt.map(J) } : {}), ...(goi ? { goi } : {}) }));

/* ══════════════ dựng 2 mục của một bài ══════════════ */

export type DefBai = {
  n: number;
  /** Chủ đề bài, vd "はじめまして — tự giới thiệu". */
  ten: string;
  /** Bảng mẫu câu: [Mẫu, Người Việt nói, Người Nhật xếp, Ví dụ (markup có furigana)]. */
  mau: string[][];
  /** Các bước dịch một câu Việt → Nhật của bài (sơ đồ). */
  buoc: { label: string; sub?: string }[];
  /** Lỗi người Việt hay mắc (mỗi ý một dòng, markup Inline). */
  loi: string[];
  cau: CauLuyen[];
  /** Từ có chữ Hán của lớp để viết theo từ (≤ 6 chữ) + gợi ý (cách đọc · nghĩa). */
  vietTu: Record<string, string>;
  /** Câu mẫu để chép (DSL, nghĩa). */
  chep: [string, string][];
  /** Viết đoạn 3–5 câu. */
  doan: { de: string; goiY: string[]; mau: [string, string][] };
  /** Mục đã có trong khoá để học kèm / ôn thi (liên kết, không làm lại). */
  lien: { id: string; label: string; vi?: string }[];
  /** Ghi chú riêng ở phần ôn thi. */
  thiGhi?: string[];
};

export function baiLuyen(d: DefBai): Lesson[] {
  const n = d.n;
  const luyen: Block[] = [
    {
      t: 'recap',
      title: `Bài ${n} — ${d.ten}: luyện ${d.cau.length} câu hai chiều`,
      items: [
        '**Mỗi ngày 15–20 phút, một lượt 10 câu.** Câu xếp từ ngắn đến dài, chỉ dùng từ và ngữ pháp đã học tới bài này.',
        '**Việt → Nhật:** đọc câu tiếng Việt, **viết tay** vào vở / iPad (hoặc ô viết ngay dưới câu), rồi bấm **Xem đáp án**. Gõ bằng bàn phím Nhật thì bấm **Kiểm tra** — máy nhận kana, chữ Hán, romaji.',
        '**Nhật → Việt** để quen mặt câu, **🎧 Nghe – chép** để luyện tai, **🗣️ Nói theo** cho máy chấm phát âm (đúng dạng đọc to của thi nói).',
        `Câu nào đúng **${2} lần liên tiếp** là "đã thuộc". Câu sai quay lại ở lượt sau — bấm "Câu chưa thuộc" để ôn đúng chỗ yếu.`,
        'Cần bản giấy để đặt cạnh iPad: mở tab **📋 Danh sách · in** rồi bấm 🖨️.',
      ],
    },
    { t: 'h', text: `A. Mẫu câu Bài ${n} — người Việt nói thế nào, người Nhật xếp thế nào` },
    {
      t: 'p',
      text: 'Tiếng Việt xếp **Chủ ngữ – Động từ – Tân ngữ** (S-V-O): "Tôi **ăn** cơm". Tiếng Nhật xếp **Chủ ngữ – Tân ngữ – Động từ** (S-O-V): "Tôi cơm **ăn**" — động từ / です luôn đứng **CUỐI** câu, và mỗi danh từ có một **trợ từ** đi sau cho biết vai của nó (は chủ đề, を tân ngữ, に thời điểm / đích, で nơi làm / phương tiện, へ hướng đi…). Bảng dưới đặt hai thứ tiếng cạnh nhau cho từng mẫu câu của bài.',
    },
    { t: 'table', head: ['Mẫu câu', 'Người Việt nói', 'Người Nhật xếp', 'Ví dụ'], rows: d.mau },
    { t: 'sodo', kind: 'flow', title: 'Dịch một câu Việt → Nhật trong 4 bước', steps: d.buoc },
    { t: 'note', title: `Lỗi người Việt hay mắc ở Bài ${n} (sai là mất điểm)`, items: d.loi },
    {
      t: 'moBai',
      title: 'Cần xem lại giải thích đầy đủ, từ vựng có hình?',
      items: [
        { id: `b${n}-ngu-phap`, label: `📘 Ngữ pháp Bài ${n}`, vi: 'giải thích từng ポイント, câu hỏi–đáp, bảng thay thế' },
        { id: `b${n}-tu-vung`, label: `📚 Từ vựng Bài ${n}`, vi: 'đủ danh sách từ của cô, bấm nghe' },
        ...(n <= 15 ? [{ id: `b${n}-hinh-tu`, label: '🖼️ Thẻ từ có hình', vi: 'học từ bằng tranh' }] : []),
      ],
    },
    { t: 'h', text: `B. Luyện câu 2 chiều — ${d.cau.length} câu mới` },
    { t: 'luyenCau', id: `b${n}-lc`, bai: n, cau: d.cau },
    { t: 'h', text: `C. Ôn thi với Bài ${n}` },
    ...(d.thiGhi?.length ? [{ t: 'note', title: 'Bám đề thi', items: d.thiGhi } as Block] : []),
    { t: 'moBai', title: 'Mở mục ôn thi đã có trong khoá', items: d.lien },
  ];

  const viet: Block[] = [
    {
      t: 'recap',
      title: `Tập viết Bài ${n} — mỗi ngày một trang`,
      items: [
        '**Bút + giấy ô vuông (hoặc Apple Pencil trên iPad):** viết chữ Hán theo TỪ, đúng thứ tự nét — mỗi từ 3–5 lần, vừa viết vừa đọc to.',
        '**Chép câu mẫu:** dòng trên có chữ mờ để tô, dòng dưới tự viết lại không nhìn. Chép xong che câu, nghe 🔊 rồi viết lại.',
        '**Viết đoạn 3–5 câu** theo đề — viết xong mới mở bài mẫu để so. Bài thi viết của trường chấm cả **chữ Hán của lớp**: chữ nào đã học thì viết bằng chữ Hán.',
        'Muốn in ra giấy: mỗi phần có nút 🖨️ **In tờ luyện**.',
      ],
    },
    { t: 'h', text: `A. Viết chữ Hán của lớp theo từ — Bài ${n}` },
    { t: 'write', id: `b${n}-tv-tu`, title: `Từ có chữ Hán của lớp — Bài ${n}`, chars: Object.keys(d.vietTu), goi: d.vietTu, note: 'Ô mẫu chạy thứ tự nét từng chữ; dòng trên tô theo chữ mờ, dòng dưới tự viết. Bật "Che mẫu" để tự nhớ ra từ từ gợi ý.' },
    { t: 'moBai', items: [{ id: `b${n}-han-lop`, label: `🈶 Chữ Hán của lớp Bài ${n}`, vi: 'thẻ từng chữ: thứ tự nét, On/Kun, cách nhớ, từ đi chung' }] },
    { t: 'h', text: 'B. Chép câu mẫu' },
    { t: 'giayViet', id: `b${n}-tv-chep`, kieu: 'chep', title: `Chép ${d.chep.length} câu mẫu Bài ${n}`, mau: d.chep.map(([s, vi]) => E(s, vi)) },
    { t: 'h', text: 'C. Viết đoạn 3–5 câu' },
    { t: 'giayViet', id: `b${n}-tv-doan`, kieu: 'doan', title: 'Viết đoạn theo đề', de: d.doan.de, goiY: d.doan.goiY, mau: d.doan.mau.map(([s, vi]) => E(s, vi)), dong: 6 },
  ];

  return [
    {
      id: `b${n}-luyen-cau`,
      kind: 'review',
      title: `🔁 Luyện câu 2 chiều Bài ${n} — Việt ⇄ Nhật · nghe–chép · nói theo (${d.cau.length} câu)`,
      goal: `Tự viết và nói được ${d.cau.length} câu của Bài ${n} (${d.ten}) theo cả hai chiều: nhìn tiếng Việt viết ra tiếng Nhật đúng trợ từ, nghe tiếng Nhật hiểu nghĩa và chép lại.`,
      minutes: 30,
      ready: true,
      blocks: luyen,
    },
    {
      id: `b${n}-tap-viet`,
      kind: 'writing',
      title: `✍️ Tập viết Bài ${n} — chữ Hán theo từ · chép câu · viết đoạn`,
      goal: `Viết đúng thứ tự nét các từ có chữ Hán của lớp Bài ${n}, chép đúng câu mẫu và tự viết một đoạn 3–5 câu theo chủ đề ${d.ten}.`,
      minutes: 25,
      ready: true,
      blocks: viet,
    },
  ];
}
