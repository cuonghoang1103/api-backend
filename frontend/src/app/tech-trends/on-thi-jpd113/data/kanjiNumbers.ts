/**
 * JPD113 — SỐ VIẾT BẰNG CHỮ HÁN.
 *
 * Vì sao tách khỏi mục "Số, giờ, ngày tháng" của cheat-sheet: mục đó dạy
 * CÁCH ĐỌC khi đã biết con số (3時 → さんじ). Còn thứ chặn người học ở đề
 * FE là chiều ngược lại — nhìn 二万四千八百 mà không biết đó là số mấy, nói
 * gì tới đọc. Đó là dạng câu có thật và đáng giá: riêng "đọc kanji" + "viết
 * kanji" chiếm ~22% đề, mà phần lớn hai dạng đó là SỐ.
 *
 * Điểm mấu chốt người Việt hay hiểu nhầm: tiếng Nhật nhóm 4 chữ số một lần
 * (万 = 10.000), không phải 3 chữ số như tiếng Việt. 83.000 KHÔNG đọc là
 * "tám mươi ba nghìn" mà là はちまん・さんぜん = 8 vạn 3 nghìn.
 *
 * `toKanji`/`toKana` là bộ chuyển đổi thật, để khu luyện tập sinh câu hỏi
 * vô hạn thay vì chép tay một danh sách hữu hạn. Đã đối chiếu với đúng các
 * đáp án số trong 420 câu đề thật (xem NUMBER_SELFTEST).
 */

/* ══════════════ 1. MƯỜI CHỮ SỐ GỐC ══════════════ */

export interface DigitRow {
  n: number;
  kanji: string;
  kana: string;
  /** Âm Hán-Việt — người Việt đã biết sẵn */
  hanviet: string;
  /** Từ tiếng Việt chứa âm đó */
  viWord: string;
  shape?: string;
  alt?: string;
}

export const DIGITS: DigitRow[] = [
  { n: 1, kanji: '一', kana: 'いち', hanviet: 'NHẤT', viWord: 'thống nhất · nhất trí · số một', shape: 'Một vạch ngang' },
  { n: 2, kanji: '二', kana: 'に', hanviet: 'NHỊ', viWord: 'nhị phân · độc nhất vô nhị', shape: 'Hai vạch ngang' },
  { n: 3, kanji: '三', kana: 'さん', hanviet: 'TAM', viWord: 'tam giác · tam quốc · tháng ba (tam nguyệt)', shape: 'Ba vạch ngang' },
  { n: 4, kanji: '四', kana: 'よん / し', hanviet: 'TỨ', viWord: 'tứ giác · tứ chi · tứ phương', shape: 'Cái hộp có hai chân bên trong', alt: 'よん khi đếm rời · し trong 四月 しがつ, 四時 よじ' },
  { n: 5, kanji: '五', kana: 'ご', hanviet: 'NGŨ', viWord: 'ngũ hành · ngũ cốc · ngũ quan', shape: 'Chữ Z kẹp giữa hai vạch' },
  { n: 6, kanji: '六', kana: 'ろく', hanviet: 'LỤC', viWord: 'lục giác · lục bát', shape: 'Cái mũ có hai chân' },
  { n: 7, kanji: '七', kana: 'なな / しち', hanviet: 'THẤT', viWord: 'thất tịch · bắc đẩu thất tinh', shape: 'Chữ t lộn ngược', alt: 'なな khi đếm rời · しち trong 七月 しちがつ, 七時 しちじ' },
  { n: 8, kanji: '八', kana: 'はち', hanviet: 'BÁT', viWord: 'bát giác · bát quái · bát tiên', shape: 'Hai nét toè ra như số 8 mở' },
  { n: 9, kanji: '九', kana: 'きゅう / く', hanviet: 'CỬU', viWord: 'cửu long · cửu trùng · trường cửu', shape: 'Cái móc câu', alt: 'きゅう khi đếm rời · く trong 九月 くがつ, 九時 くじ' },
  { n: 10, kanji: '十', kana: 'じゅう', hanviet: 'THẬP', viWord: 'thập kỷ · thập niên · chữ thập', shape: 'Đúng hình dấu cộng / chữ thập' },
];

/* ══════════════ 2. HÀNG (vị trí) ══════════════ */

export const PLACES: DigitRow[] = [
  { n: 10, kanji: '十', kana: 'じゅう', hanviet: 'THẬP', viWord: 'thập niên (10 năm)', shape: 'Dấu cộng' },
  { n: 100, kanji: '百', kana: 'ひゃく', hanviet: 'BÁCH', viWord: 'bách khoa · bách phát bách trúng · bách hoá', shape: '一 (một) đè lên 白 (trắng)' },
  { n: 1000, kanji: '千', kana: 'せん', hanviet: 'THIÊN', viWord: 'thiên niên kỷ · thiên lý mã', shape: 'Giống 十 nhưng có mái chéo trên đầu' },
  { n: 10000, kanji: '万', kana: 'まん', hanviet: 'VẠN', viWord: 'vạn tuế · vạn lý trường thành · muôn vàn', shape: 'Ba nét, dễ nhất trong bốn hàng' },
];

export const PLACE_RULE =
  'ĐÂY LÀ CHỖ KHÁC TIẾNG VIỆT NHẤT: tiếng Việt nhóm 3 chữ số (nghìn, triệu, tỉ), ' +
  'tiếng Nhật nhóm 4 chữ số (万 = 10.000). Nên 83.000 không phải "tám mươi ba nghìn" mà là ' +
  '8 VẠN 3 NGHÌN → はちまん さんぜん. Mẹo: gạch tách 4 chữ số từ phải sang — 8|3000.';

/* ══════════════ 3. LUẬT GHÉP ══════════════ */

export interface RuleRow {
  rule: string;
  ex: string;
  read: string;
  vi: string;
}

export const COMPOSE_RULES: RuleRow[] = [
  { rule: 'Ghép từ TRÁI sang PHẢI, hàng lớn trước', ex: '二百五十', read: 'にひゃく ごじゅう', vi: '250 — "hai trăm năm mươi", đúng thứ tự tiếng Việt' },
  { rule: 'Hàng 100 / 1000 KHÔNG viết 一', ex: '百 · 千', read: 'ひゃく · せん', vi: '100 và 1000 — sai nếu viết 一百, 一千' },
  { rule: 'Riêng hàng 万 BẮT BUỘC có 一', ex: '一万', read: 'いちまん', vi: '10.000 — không được viết 万 trơ trọi' },
  { rule: 'Hàng nào bằng 0 thì BỎ HẲN, không viết gì', ex: '二千五 → sai · 二千五十 = 2050', read: 'にせん ごじゅう', vi: 'Không có "chữ số 0" chèn vào như tiếng Việt' },
  { rule: 'Số 10–19 bắt đầu bằng 十 trơ', ex: '十五', read: 'じゅうご', vi: '15 — không viết 一十五' },
  { rule: 'Số 20–90 là "chữ số + 十"', ex: '五十', read: 'ごじゅう', vi: '50' },
];

/* ══════════════ 4. SÁU CHỖ BIẾN ÂM BẮT BUỘC THUỘC ══════════════ */

export const SOUND_CHANGES: { kanji: string; n: string; wrong: string; right: string; why: string }[] = [
  { kanji: '三百', n: '300', wrong: 'さんひゃく', right: 'さんびゃく', why: 'ひ → び sau さん' },
  { kanji: '六百', n: '600', wrong: 'ろくひゃく', right: 'ろっぴゃく', why: 'ろく rụng く, ひ → ぴ' },
  { kanji: '八百', n: '800', wrong: 'はちひゃく', right: 'はっぴゃく', why: 'はち rụng ち, ひ → ぴ' },
  { kanji: '三千', n: '3.000', wrong: 'さんせん', right: 'さんぜん', why: 'せ → ぜ sau さん' },
  { kanji: '八千', n: '8.000', wrong: 'はちせん', right: 'はっせん', why: 'はち rụng ち thành âm ngắt っ' },
  { kanji: '一万', n: '10.000', wrong: 'まん', right: 'いちまん', why: 'Hàng 万 luôn phải có いち' },
];

export const SOUND_MNEMONIC =
  'Câu thần chú: "BA–SÁU–TÁM là ổ biến âm". 3 và 8 biến ở CẢ trăm lẫn nghìn; 6 chỉ biến ở hàng trăm. ' +
  'Bốn số còn lại (1, 2, 4, 5, 7, 9) đọc thẳng, không đổi gì.';

/* ══════════════ 5. BỘ CHUYỂN ĐỔI ══════════════ */

const D_KANJI = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const D_KANA = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
/** Hàng trăm — đã gộp sẵn 3 chỗ biến âm */
const HYAKU = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
/** Hàng nghìn — đã gộp sẵn 2 chỗ biến âm */
const SEN = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];

function chunkKana(n: number): string {
  // n trong khoảng 1..9999 — một "khối 4 chữ số" của tiếng Nhật
  const t = Math.floor(n / 1000);
  const h = Math.floor((n % 1000) / 100);
  const j = Math.floor((n % 100) / 10);
  const o = n % 10;
  let s = '';
  if (t) s += SEN[t];
  if (h) s += HYAKU[h];
  if (j) s += (j === 1 ? 'じゅう' : D_KANA[j] + 'じゅう');
  if (o) s += D_KANA[o];
  return s;
}

function chunkKanji(n: number): string {
  const t = Math.floor(n / 1000);
  const h = Math.floor((n % 1000) / 100);
  const j = Math.floor((n % 100) / 10);
  const o = n % 10;
  let s = '';
  if (t) s += (t === 1 ? '千' : D_KANJI[t] + '千');
  if (h) s += (h === 1 ? '百' : D_KANJI[h] + '百');
  if (j) s += (j === 1 ? '十' : D_KANJI[j] + '十');
  if (o) s += D_KANJI[o];
  return s;
}

/** Số → chữ Hán. Hỗ trợ 0 … 99.999.999 (đủ mọi con số từng ra trong đề). */
export function toKanji(n: number): string {
  if (n === 0) return '零';
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  // Hàng 万 dùng chunkKanji(1) = '一' nên 10.000 tự ra 一万 — đúng luật
  return (man ? chunkKanji(man) + '万' : '') + (rest ? chunkKanji(rest) : '');
}

/** Số → cách đọc kana. */
export function toKana(n: number): string {
  if (n === 0) return 'ゼロ';
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  return (man ? chunkKana(man) + 'まん' : '') + (rest ? chunkKana(rest) : '');
}

/* ══════════════ 6. GIẢI MẪU — lấy thẳng từ đề thật ══════════════ */

export interface WorkedExample {
  kanji: string;
  n: number;
  steps: string[];
  read: string;
  source: string;
}

export const WORKED: WorkedExample[] = [
  {
    kanji: '八千五百',
    n: 8500,
    steps: ['八千 = 8 × 1000 = 8.000 → はっせん (biến âm!)', '五百 = 5 × 100 = 500 → ごひゃく', 'Cộng lại: 8.500'],
    read: 'はっせんごひゃく',
    source: 'Đề FE — "このパソコンは いくらですか"',
  },
  {
    kanji: '二万四千八百',
    n: 24800,
    steps: [
      'Tách khối 4 chữ số từ phải: 2 | 4800',
      '二万 = 2 × 10.000 = 20.000 → にまん',
      '四千 = 4.000 → よんせん',
      '八百 = 800 → はっぴゃく (biến âm!)',
      'Cộng lại: 24.800',
    ],
    read: 'にまんよんせんはっぴゃく',
    source: 'Đề FE — "このかばんは …えんです"',
  },
  {
    kanji: '八万三千',
    n: 83000,
    steps: ['Tách: 8 | 3000', '八万 = 80.000 → はちまん', '三千 = 3.000 → さんぜん (biến âm!)', 'Cộng lại: 83.000'],
    read: 'はちまんさんぜん',
    source: 'Bài đọc số 1 — học phí mỗi tháng',
  },
  {
    kanji: '一万二千',
    n: 12000,
    steps: ['Tách: 1 | 2000', '一万 = 10.000 → いちまん (bắt buộc có いち)', '二千 = 2.000 → にせん', 'Cộng lại: 12.000'],
    read: 'いちまんにせん',
    source: 'Đề FE — "トイレットペーパーは …円です"',
  },
  {
    kanji: '二百万',
    n: 2000000,
    steps: ['二百 đứng TRƯỚC 万 nên nhân vào 万', '二百万 = 200 × 10.000 = 2.000.000 → にひゃくまん', 'Tiếng Việt gọi là "hai triệu", tiếng Nhật gọi là "hai trăm vạn"'],
    read: 'にひゃくまん',
    source: 'Đề FE — "このとけいは …えんです"',
  },
  {
    kanji: '二百五十',
    n: 250,
    steps: ['二百 = 200 → にひゃく', '五十 = 50 → ごじゅう', 'Cộng lại: 250'],
    read: 'にひゃくごじゅう',
    source: 'Bài đọc số 4 — giá quyển sách',
  },
];

/* ══════════════ 7. SỐ HAY RA TRONG ĐỀ ══════════════ */

export const COMMON_NUMBERS = [100, 250, 300, 500, 600, 700, 800, 1000, 1800, 2800, 3000, 5000, 8000, 8500, 10000, 12000, 24800, 83000];

/* ══════════════ 8. TỰ KIỂM BỘ CHUYỂN ĐỔI ══════════════
 *
 * Đối chiếu với đúng đáp án đã có trong 420 câu đề thật. Kiểm bộ kiểm
 * trước khi tin nó — nếu sau này sửa bảng biến âm mà làm hỏng, mảng này
 * phát hiện ngay (khu luyện tập chạy nó lúc mount và cảnh báo lên UI).
 */
export const NUMBER_SELFTEST: { n: number; kanji: string; kana: string }[] = [
  { n: 250, kanji: '二百五十', kana: 'にひゃくごじゅう' },
  { n: 300, kanji: '三百', kana: 'さんびゃく' },
  { n: 600, kanji: '六百', kana: 'ろっぴゃく' },
  { n: 800, kanji: '八百', kana: 'はっぴゃく' },
  { n: 3000, kanji: '三千', kana: 'さんぜん' },
  { n: 8000, kanji: '八千', kana: 'はっせん' },
  { n: 8500, kanji: '八千五百', kana: 'はっせんごひゃく' },
  { n: 10000, kanji: '一万', kana: 'いちまん' },
  { n: 12000, kanji: '一万二千', kana: 'いちまんにせん' },
  { n: 24800, kanji: '二万四千八百', kana: 'にまんよんせんはっぴゃく' },
  { n: 83000, kanji: '八万三千', kana: 'はちまんさんぜん' },
  { n: 2000000, kanji: '二百万', kana: 'にひゃくまん' },
];

/** Trả về danh sách ca sai; mảng rỗng = bộ chuyển đổi khớp 100% đề thật. */
export function runSelfTest(): string[] {
  const bad: string[] = [];
  for (const t of NUMBER_SELFTEST) {
    const k = toKanji(t.n);
    const r = toKana(t.n);
    if (k !== t.kanji) bad.push(`${t.n}: kanji ra "${k}", phải là "${t.kanji}"`);
    if (r !== t.kana) bad.push(`${t.n}: đọc ra "${r}", phải là "${t.kana}"`);
  }
  return bad;
}
