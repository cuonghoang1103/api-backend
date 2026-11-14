/**
 * CT Language — THƯ VIỆN NGỮ PHÁP (15/11/2026): khuôn dữ liệu + luật kiểm + tìm kiếm. THUẦN — không CSDL, không tệp.
 * Nội dung: `content/ctlanguage/ngu-phap/<nn>/*.json` (tự soạn, khuôn ở `_KHUON.md` cùng thư mục). Nạp: `nguPhap.ts`.
 * Tuyến: `routes/ctlanguage.nguPhap.routes.ts`. Kiểm nội dung: `npx tsx scripts/ctlanguage-kiem-ngu-phap.mts`.
 */

export const NN_NGU_PHAP = ['en', 'ja', 'zh'] as const;
export type NnNguPhap = (typeof NN_NGU_PHAP)[number];

/** Cấp theo ngôn ngữ, từ dễ đến khó (thứ tự hiển thị). */
export const CAP_NGU_PHAP: Record<NnNguPhap, readonly string[]> = {
  ja: ['N5', 'N4', 'N3'],
  zh: ['HSK1', 'HSK2', 'HSK3', 'HSK4'],
  en: ['A1', 'A2', 'B1', 'B2'],
};

export const TEN_CAP_NGU_PHAP: Record<string, { ten: string; moTa: string }> = {
  N5: { ten: 'JLPT N5', moTa: 'Câu cơ bản: trợ từ, thể ます, tính từ, thể て' },
  N4: { ten: 'JLPT N4', moTa: 'Thể thường, khả năng, bị động, sai khiến, điều kiện, kính ngữ cơ bản' },
  N3: { ten: 'JLPT N3', moTa: 'Mẫu câu trung cấp: suy đoán, nguyên nhân, nhượng bộ, văn viết' },
  HSK1: { ten: 'HSK 1', moTa: 'Câu chữ 是, 有, 吗, lượng từ, 的, 不 / 没' },
  HSK2: { ten: 'HSK 2', moTa: '了, 过, 着, so sánh 比, bổ ngữ cơ bản, 正在' },
  HSK3: { ten: 'HSK 3', moTa: '把, 被, bổ ngữ xu hướng / khả năng, liên từ cặp' },
  HSK4: { ten: 'HSK 4', moTa: 'Liên từ phức, nhấn mạnh, bổ ngữ nâng cao, văn viết' },
  A1: { ten: 'CEFR A1', moTa: 'to be, hiện tại đơn, mạo từ, số ít / số nhiều, there is / are' },
  A2: { ten: 'CEFR A2', moTa: 'Quá khứ đơn, tương lai, so sánh, động từ khuyết thiếu cơ bản' },
  B1: { ten: 'CEFR B1', moTa: 'Hiện tại hoàn thành, câu điều kiện, bị động, mệnh đề quan hệ, tường thuật' },
  B2: { ten: 'CEFR B2', moTa: 'Điều kiện loại 3 / hỗn hợp, đảo ngữ, wish, bị động nâng cao' },
};

export interface ViDuNguPhap {
  /** Câu gốc (chữ của ngôn ngữ đang học — TTS đọc nguyên văn). */
  c: string;
  /** Cách đọc: ja = toàn bộ câu viết bằng kana (không còn chữ Hán); zh = pinyin CÓ DẤU THANH; en = bỏ trống. */
  d?: string;
  /** Nghĩa tiếng Việt. */
  v: string;
}

export interface CauQuizNguPhap {
  /** Câu hỏi (thường là câu có chỗ trống ___ hoặc "Câu nào đúng?"). */
  h: string;
  /** 3–4 lựa chọn khác nhau. */
  lc: string[];
  /** Chỉ số đáp án đúng (0-based). */
  da: number;
  /** Giải thích tiếng Việt vì sao đúng / vì sao các lựa chọn kia sai. */
  gt: string;
}

export interface DiemNguPhap {
  /** `<nn>-<cấp viết thường>-<tên ngắn>`: ja-n5-wa-desu · zh-hsk2-le-hoan-thanh · en-b1-present-perfect. */
  id: string;
  /** Nhóm trong cấp (để chia mục trong danh sách): "Trợ từ", "Thể て", "Các thì", "Bổ ngữ"… */
  nhom: string;
  /** Tên điểm ngữ pháp như trong sách: 〜てもいいです · 了 (hoàn thành) · Present perfect. */
  tieuDe: string;
  /** Mẫu cấu trúc: V-て + も + いいです · S + 把 + O + V + 了 · S + have/has + V3. */
  mau: string;
  /** Nghĩa tiếng Việt NGẮN (một dòng, hiện trong danh sách): "được phép làm ~". */
  nghia: string;
  /** Giải thích ý nghĩa + khi nào dùng (tiếng Việt, 1–5 câu). */
  giaiThich: string;
  /** Cách chia / ghép (mỗi phần tử một dòng). */
  cachGhep: string[];
  viDu: ViDuNguPhap[];
  /** Lưu ý + lỗi người Việt hay mắc. */
  luuY: string[];
  /** id các điểm dễ nhầm (phải tồn tại, cùng ngôn ngữ). */
  soSanh?: string[];
  /** Từ khoá tra thêm: romaji / pinyin không dấu / tên gọi khác / tiếng Việt ("te mo ii", "duoc phep", "bei", "bị động"). */
  tuKhoa: string[];
  quiz: CauQuizNguPhap[];
}

export interface TepNguPhap { nn: NnNguPhap; cap: string; diem: DiemNguPhap[] }

export type DiemDaNap = DiemNguPhap & { nn: NnNguPhap; cap: string };

const CO_HAN = /[㐀-䶿一-鿿豈-﫿々〆]/;
const KANA = /[ぁ-ゖァ-ヺ]/;
const DAU_THANH = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/;
const CHU_VIET_RIENG = /[ăâđêôơưĂÂĐÊÔƠƯàáãạảấầẩẫậắằẳẵặèéẹẻẽếềểễệìíĩỉịòóõọỏốồổỗộớờởỡợùúũụủứừửữựỳýỵỷỹ]/;

const chuoi = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const mangChuoi = (v: unknown): v is string[] => Array.isArray(v) && v.every(chuoi);

/** Katakana → hiragana (so cách đọc). */
const veHira = (s: string) => s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));

/** Mọi kana của câu gốc phải xuất hiện ĐÚNG THỨ TỰ trong cách đọc (bắt cách đọc chép nhầm câu khác / thiếu đuôi). */
export function kanaKhop(cau: string, doc: string): boolean {
  const a = [...veHira(cau)].filter((ch) => KANA.test(ch) || ch === 'ー');
  const b = [...veHira(doc)];
  let j = 0;
  for (const ch of a) {
    while (j < b.length && b[j] !== ch) j++;
    if (j >= b.length) return false;
    j++;
  }
  return true;
}

/** Luật kiểm MỘT điểm ngữ pháp. Trả danh sách lỗi (rỗng = hợp lệ). */
export function kiemDiem(d: DiemNguPhap, nn: NnNguPhap, cap: string): string[] {
  const loi: string[] = [];
  const o = d as unknown as Record<string, unknown>;
  const tienTo = `${nn}-${cap.toLowerCase()}-`;
  if (!chuoi(d?.id) || !/^[a-z0-9-]{6,60}$/.test(d.id)) return [`id không hợp lệ: ${String(d?.id)}`];
  if (!d.id.startsWith(tienTo)) loi.push(`id phải bắt đầu "${tienTo}"`);
  for (const k of ['nhom', 'tieuDe', 'mau', 'nghia', 'giaiThich']) if (!chuoi(o[k])) loi.push(`thiếu ${k}`);
  if (chuoi(d.nghia) && d.nghia.length > 90) loi.push('nghia quá dài (> 90 ký tự) — phần dài đưa vào giaiThich');
  if (chuoi(d.giaiThich) && d.giaiThich.length < 40) loi.push('giaiThich quá ngắn (< 40 ký tự)');
  if (!mangChuoi(d.cachGhep) || d.cachGhep.length < 1) loi.push('cachGhep cần ≥ 1 dòng');
  if (!mangChuoi(d.luuY) || d.luuY.length < 1) loi.push('luuY cần ≥ 1 dòng');
  if (!mangChuoi(d.tuKhoa) || d.tuKhoa.length < 1) loi.push('tuKhoa cần ≥ 1 từ');
  if (d.soSanh !== undefined) {
    if (!mangChuoi(d.soSanh)) loi.push('soSanh phải là mảng id');
    else {
      if (d.soSanh.includes(d.id)) loi.push('soSanh trỏ vào chính nó');
      if (new Set(d.soSanh).size !== d.soSanh.length) loi.push('soSanh trùng id');
      for (const s of d.soSanh) if (!s.startsWith(`${nn}-`)) loi.push(`soSanh "${s}" khác ngôn ngữ`);
    }
  }

  if (!Array.isArray(d.viDu) || d.viDu.length < 3 || d.viDu.length > 5) loi.push('viDu cần 3–5 câu');
  else {
    const daCo = new Set<string>();
    d.viDu.forEach((v, i) => {
      const t = `viDu[${i}]`;
      if (!chuoi(v?.c) || !chuoi(v?.v)) { loi.push(`${t} thiếu c / v`); return; }
      if (daCo.has(v.c)) loi.push(`${t} trùng câu`);
      daCo.add(v.c);
      if (!CHU_VIET_RIENG.test(v.v) && v.v.length > 12) loi.push(`${t}.v có vẻ không phải tiếng Việt có dấu`);
      if (nn === 'ja') {
        if (!KANA.test(v.c) && !CO_HAN.test(v.c)) loi.push(`${t}.c không có chữ Nhật`);
        if (!chuoi(v.d)) loi.push(`${t} thiếu d (cách đọc bằng kana)`);
        else {
          if (CO_HAN.test(v.d)) loi.push(`${t}.d còn chữ Hán — phải viết toàn kana`);
          if (!kanaKhop(v.c, v.d)) loi.push(`${t}.d không khớp kana của câu gốc`);
        }
      } else if (nn === 'zh') {
        if (!CO_HAN.test(v.c)) loi.push(`${t}.c không có chữ Hán`);
        if (!chuoi(v.d)) loi.push(`${t} thiếu d (pinyin)`);
        else {
          if (!DAU_THANH.test(v.d)) loi.push(`${t}.d pinyin không có dấu thanh`);
          if (/[a-zü][1-5]\b/i.test(v.d)) loi.push(`${t}.d pinyin dùng số thay dấu thanh`);
          if (CO_HAN.test(v.d)) loi.push(`${t}.d còn chữ Hán`);
          if (/v/i.test(v.d)) loi.push(`${t}.d pinyin dùng "v" thay "ü"`);
        }
      } else {
        if (!/[a-z]/i.test(v.c)) loi.push(`${t}.c không có chữ Anh`);
        if (/[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(v.c)) loi.push(`${t}.c lẫn tiếng Việt`);
      }
    });
  }

  if (!Array.isArray(d.quiz) || d.quiz.length !== 3) loi.push('quiz cần đúng 3 câu');
  else {
    d.quiz.forEach((q, i) => {
      const t = `quiz[${i}]`;
      if (!chuoi(q?.h) || !chuoi(q?.gt)) { loi.push(`${t} thiếu h / gt`); return; }
      if (!mangChuoi(q.lc) || q.lc.length < 3 || q.lc.length > 4) { loi.push(`${t}.lc cần 3–4 lựa chọn`); return; }
      if (new Set(q.lc.map((x) => x.trim())).size !== q.lc.length) loi.push(`${t}.lc có lựa chọn trùng`);
      if (!Number.isInteger(q.da) || q.da < 0 || q.da >= q.lc.length) loi.push(`${t}.da nằm ngoài lựa chọn`);
      if (q.gt.length < 15) loi.push(`${t}.gt quá ngắn`);
    });
    const viTri = new Set(d.quiz.map((q) => q?.da));
    if (viTri.size === 1 && d.quiz.length === 3) loi.push('3 câu quiz cùng vị trí đáp án — rải đáp án');
  }
  return loi;
}

/** Kiểm MỘT tệp (khuôn tệp + từng điểm + id trùng trong tệp). `soSanh` tồn tại hay không kiểm ở `kiemTatCa`. */
export function kiemTep(t: TepNguPhap): string[] {
  const loi: string[] = [];
  if (!(NN_NGU_PHAP as readonly string[]).includes(t?.nn)) return [`nn không hợp lệ: ${String(t?.nn)}`];
  if (!CAP_NGU_PHAP[t.nn].includes(t.cap)) return [`cap "${String(t.cap)}" không thuộc ${t.nn}`];
  if (!Array.isArray(t.diem) || !t.diem.length) return ['diem rỗng'];
  const daCo = new Set<string>();
  for (const d of t.diem) {
    for (const l of kiemDiem(d, t.nn, t.cap)) loi.push(`${d?.id ?? '?'}: ${l}`);
    if (d?.id) { if (daCo.has(d.id)) loi.push(`${d.id}: id trùng trong tệp`); daCo.add(d.id); }
  }
  return loi;
}

/** Kiểm chéo cả thư viện: id trùng giữa các tệp, `soSanh` trỏ tới id có thật. */
export function kiemTatCa(ds: DiemDaNap[]): string[] {
  const loi: string[] = [];
  const dem = new Map<string, number>();
  for (const d of ds) dem.set(d.id, (dem.get(d.id) ?? 0) + 1);
  for (const [id, n] of dem) if (n > 1) loi.push(`${id}: id trùng ${n} lần`);
  for (const d of ds) for (const s of d.soSanh ?? []) if (!dem.has(s)) loi.push(`${d.id}: soSanh "${s}" không tồn tại`);
  return loi;
}

// ── Tìm kiếm ────────────────────────────────────────────────────────────────

/** Chuẩn hoá để so: thường, bỏ dấu tiếng Việt + dấu thanh pinyin, katakana → hiragana, bỏ 〜 ~ … khoảng trắng, dấu câu. */
export function chuanHoaTim(s: string): string {
  return veHira(String(s ?? '').toLowerCase())
    .normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC')
    .replace(/đ/g, 'd').replace(/ü/g, 'u')
    .replace(/[〜~～…\s\-_+/／()（）［］\[\]「」『』、。，．.,!?！？:：;；'"“”‘’·・*]/g, '');
}

export interface TomTatNguPhap { id: string; nn: NnNguPhap; cap: string; nhom: string; tieuDe: string; mau: string; nghia: string }

export const tomTatDiem = (d: DiemDaNap): TomTatNguPhap => ({ id: d.id, nn: d.nn, cap: d.cap, nhom: d.nhom, tieuDe: d.tieuDe, mau: d.mau, nghia: d.nghia });

/** Điểm khớp của một điểm ngữ pháp với câu tra (0 = không khớp). Tiêu đề > từ khoá > mẫu > nghĩa > ví dụ. */
export function diemKhop(d: DiemDaNap, q: string): number {
  const k = chuanHoaTim(q);
  if (!k) return 0;
  const td = chuanHoaTim(d.tieuDe);
  if (td === k) return 100;
  const tk = d.tuKhoa.map(chuanHoaTim);
  if (tk.includes(k)) return 90;
  // Chữ Latin ngắn khớp bừa khắp nơi ("i", "le" nằm trong mọi thứ): 1 ký tự ⇒ chỉ nhận khớp NGUYÊN (ở trên);
  // 2 ký tự ⇒ chỉ khớp ĐẦU tiêu đề / từ khoá. Chữ Hán / kana thì 1 ký tự đã đủ nghĩa (了, 把, は).
  const latin = /^[a-z0-9]+$/.test(k);
  if (latin && k.length < 2) return 0;
  const ngan = latin && k.length < 3;
  /** Chuỗi đủ dài để coi "nằm trong câu tra" là có nghĩa. */
  const duDai = (x: string) => x.length >= (/^[a-z0-9]+$/.test(x) ? 4 : 2);
  if (td.startsWith(k)) return 80;
  if (!ngan && td.includes(k)) return 70;
  // Người tra gõ cả cụm dài hơn tiêu đề ("食べてもいいですか" ⇒ 〜てもいい): tiêu đề nằm TRONG câu tra.
  if (duDai(td) && k.includes(td)) return 65;
  if (tk.some((x) => x.startsWith(k))) return 60;
  if (!ngan && tk.some((x) => x.includes(k) || (duDai(x) && k.includes(x)))) return 50;
  if (ngan) return 0;
  if (chuanHoaTim(d.mau).includes(k)) return 45;
  if (chuanHoaTim(d.nghia).includes(k)) return 40;
  if (d.viDu.some((v) => chuanHoaTim(v.c).includes(k))) return 20;
  if (k.length >= 4 && chuanHoaTim(d.giaiThich).includes(k)) return 10;
  return 0;
}

/** Tìm trong danh sách (đã lọc ngôn ngữ nếu cần); xếp theo điểm khớp rồi theo thứ tự cấp / thứ tự soạn. */
/** `chac` = chỉ khớp tiêu đề / từ khoá / mẫu (≥ 45) — ô tra TỪ ĐIỂN dùng, để một từ thường (学校, eat) không kéo theo
 *  hàng loạt điểm ngữ pháp chỉ vì nằm trong câu ví dụ. */
export function timNguPhap(ds: DiemDaNap[], q: string, toiDa = 20, chac = false): TomTatNguPhap[] {
  return ds.map((d, i) => ({ d, i, s: diemKhop(d, q) }))
    .filter((x) => x.s >= (chac ? 45 : 1))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, Math.max(1, Math.min(50, toiDa)))
    .map((x) => tomTatDiem(x.d));
}
