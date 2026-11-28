/**
 * Chấm câu dịch Việt → Anh của "1000 câu nền" — HÀM THUẦN (không React), bộ kiểm nội dung
 * `scripts/cau-nen-kiem.mts` dùng lại để chắc mỗi câu mẫu tự khớp chính nó.
 *
 * Chuẩn hoá cả câu mẫu lẫn câu người học: chữ thường, bỏ dấu câu, gộp khoảng trắng, mở dạng rút gọn
 * (I'm = I am, don't = do not, it's = it is…), gạch nối thành dấu cách (third-year = third year), đồng nhất vài chữ Anh–Anh /
 * Anh–Mỹ (colour = color). KHÔNG bỏ qua lỗi chính tả một chữ: "work" / "works" khác nhau đúng một chữ và
 * đó lại là điểm ngữ pháp đang học — chỉ hiện chỗ khác để người học tự thấy.
 */

const VIET_TAT: [RegExp, string][] = [
  [/\bwon't\b/g, 'will not'], [/\bcan't\b/g, 'cannot'], [/\bcan not\b/g, 'cannot'], [/\bshan't\b/g, 'shall not'],
  [/\bain't\b/g, 'is not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\b(i|you|he|she|it|we|they|there|that|who|what)'ll\b/g, '$1 will'],
  [/\b(you|we|they|who|what|there)'re\b/g, '$1 are'],
  [/\b(i|you|we|they|there|that|who|what|could|should|would|might|must)'ve\b/g, '$1 have'],
  [/\b(i|you|he|she|it|we|they|there|that|who|what)'d\b/g, '$1 would'],
  [/\bi'm\b/g, 'i am'],
  [/\b(he|she|it|there|that|what|where|who|here|how|when|why|this)'s\b/g, '$1 is'],
  [/\blet's\b/g, 'let us'],
];

/** Chữ viết khác nhưng cùng một từ. */
const DONG_NGHIA_CHU: Record<string, string> = {
  ok: 'okay', colour: 'color', favourite: 'favorite', centre: 'center', theatre: 'theater',
  organise: 'organize', realise: 'realize', apologise: 'apologize', travelling: 'traveling',
  cancelled: 'canceled', grey: 'gray', programme: 'program', mum: 'mom', till: 'until',
};
/** Số viết bằng chữ số = số viết bằng chữ ("20" = "twenty") — chấm theo nghĩa, không theo cách gõ. */
const SO = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
SO.forEach((w, i) => { DONG_NGHIA_CHU[String(i)] = w; });
Object.assign(DONG_NGHIA_CHU, { '30': 'thirty', '40': 'forty', '50': 'fifty', '60': 'sixty', '1st': 'first', '2nd': 'second', '3rd': 'third' });

export function chuanHoa(x: string): string {
  let t = x.normalize('NFKC').toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”"«»]/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\be mail/g, 'email')
    .replace(/[.,!?;:()…–—]/g, ' ');
  for (const [re, thay] of VIET_TAT) t = t.replace(re, thay);
  return t
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => DONG_NGHIA_CHU[w] ?? w)
    .join(' ');
}

/** Các câu được chấm đúng của một câu: câu mẫu + cách nói khác. */
export const dapAn = (c: { en: string; alt?: string[] }): string[] => [c.en, ...(c.alt ?? [])];

export function khop(bai: string, dap: string[]): boolean {
  const b = chuanHoa(bai);
  return !!b && dap.some((d) => chuanHoa(d) === b);
}

/** Một mảnh của bảng so: `ok` = giống, `thieu` = câu mẫu có mà bạn thiếu, `thua` = bạn viết thừa / sai. */
export type Manh = { tu: string; loai: 'ok' | 'thieu' | 'thua' };

/** So hai dãy từ bằng LCS ⇒ chuỗi mảnh để tô màu. */
function soTu(a: string[], b: string[]): Manh[] {
  const n = a.length, m = b.length;
  const L: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out: Manh[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ tu: b[j], loai: 'ok' }); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) { out.push({ tu: a[i], loai: 'thua' }); i++; }
    else { out.push({ tu: b[j], loai: 'thieu' }); j++; }
  }
  while (i < n) out.push({ tu: a[i++], loai: 'thua' });
  while (j < m) out.push({ tu: b[j++], loai: 'thieu' });
  return out;
}

export type KetQuaCham = {
  dung: boolean;
  /** Đáp án gần câu người học nhất (dạng gốc, có hoa/dấu) — để hiện "câu mẫu". */
  gan: string;
  /** Bảng so với đáp án gần nhất (đã chuẩn hoá). Rỗng khi đúng. */
  manh: Manh[];
  /** 0–1: tỉ lệ từ khớp — ≥ 0,8 coi là "gần đúng". */
  giong: number;
  /** Một câu nhận xét ngắn bằng tiếng Việt, suy từ bảng so (không gọi AI). */
  nhanXet: string;
};

export function cham(bai: string, c: { en: string; alt?: string[] }): KetQuaCham {
  const ds = dapAn(c);
  if (khop(bai, ds)) return { dung: true, gan: ds.find((d) => chuanHoa(d) === chuanHoa(bai)) ?? c.en, manh: [], giong: 1, nhanXet: 'Đúng!' };
  const tb = chuanHoa(bai).split(' ').filter(Boolean);
  let tot: { d: string; manh: Manh[]; giong: number } | null = null;
  for (const d of ds) {
    const td = chuanHoa(d).split(' ');
    const manh = soTu(tb, td);
    const ok = manh.filter((x) => x.loai === 'ok').length;
    const giong = ok / Math.max(td.length, tb.length, 1);
    if (!tot || giong > tot.giong) tot = { d, manh, giong };
  }
  const t = tot!;
  return { dung: false, gan: t.d, manh: t.manh, giong: t.giong, nhanXet: nhanXet(t.manh, tb, chuanHoa(t.d).split(' ')) };
}

const MAO_TU = new Set(['a', 'an', 'the']);
const TRO = new Set(['am', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'will', 'be', 'been']);

function nhanXet(manh: Manh[], bai: string[], mau: string[]): string {
  if (!bai.length) return 'Bạn chưa gõ gì.';
  const thieu = manh.filter((x) => x.loai === 'thieu').map((x) => x.tu);
  const thua = manh.filter((x) => x.loai === 'thua').map((x) => x.tu);
  // Đủ từ mà khác chỗ ⇒ sai trật tự (lỗi dịch từng chữ theo thứ tự tiếng Việt).
  const sx = (a: string[]) => [...a].sort().join(' ');
  if (sx(bai) === sx(mau)) return 'Đủ từ rồi nhưng **sai trật tự** — tiếng Anh không xếp chữ theo thứ tự tiếng Việt. Xem câu mẫu.';
  const y: string[] = [];
  const thieuMao = thieu.filter((w) => MAO_TU.has(w));
  if (thieuMao.length && !thua.some((w) => MAO_TU.has(w))) y.push(`thiếu mạo từ **${thieuMao.join(', ')}**`);
  const thieuTro = thieu.filter((w) => TRO.has(w));
  if (thieuTro.length) y.push(`thiếu **${thieuTro.join(', ')}** (tiếng Việt không có chữ này nên hay bị quên)`);
  const s = thua.find((w) => thieu.includes(w.replace(/(es|s)$/, '')) || thieu.includes(`${w}s`) || thieu.includes(`${w}es`));
  if (s) y.push(`xem lại đuôi **-s/-es** ở "${s}"`);
  if (!y.length) {
    if (thieu.length && thieu.length <= 3) y.push(`thiếu: **${thieu.join(' ')}**`);
    if (thua.length && thua.length <= 3) y.push(`khác câu mẫu: **${thua.join(' ')}**`);
  }
  return y.length ? `Gần rồi — ${y.join('; ')}.` : 'Chưa khớp câu mẫu. Có thể bạn nói cách khác mà vẫn đúng — bấm "Nhờ CuongMini xem".';
}

/** Tách câu Anh thành mảnh để ghép (giữ dấu câu cuối dính chữ cuối, bỏ dấu phẩy). */
export function tachManh(en: string): string[] {
  return en.replace(/[.,!?]+(?=\s|$)/g, '').split(/\s+/).filter(Boolean);
}

/** Từ đầu câu thường gặp — hạ chữ thường khi làm mảnh ghép (chữ hoa đầu câu lộ đáp án). Tên riêng, I, I'm giữ hoa. */
const DAU_CAU = new Set(('this that these those the a an he she it we they you there my your his her our their its is are am was were '
  + 'do does did don\'t doesn\'t can can\'t could would will should what where when who why how which sorry please let\'s it\'s that\'s '
  + 'he\'s she\'s we\'re they\'re you\'re there\'s what\'s where\'s who\'s how\'s here here\'s yes no ok okay excuse thanks thank '
  + 'hi hello good nice wait have has every everyone my our some any many much one two if when because so but and after before '
  + 'yesterday today tomorrow last next on in at turn go take come look call send check just maybe also').split(' '));
/** Mảnh để GHÉP câu: như `tachManh` nhưng từ đầu câu viết thường (trừ I…, tên riêng). */
export function manhGhep(en: string): string[] {
  const m = tachManh(en);
  if (m.length && DAU_CAU.has(m[0].toLowerCase())) m[0] = m[0].toLowerCase();
  return m;
}

/** Số từ của câu Anh (để kiểm "tuần 1 ≤ 8 từ"). */
export const soTu8 = (en: string): number => tachManh(en).length;
