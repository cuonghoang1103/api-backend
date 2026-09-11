/**
 * ============================================================
 * VÒNG TRÒN CAMELOT — ghép bài cho hợp hoà âm
 * ============================================================
 *
 * DJ không đọc "Fa thăng thứ", họ đọc "11A". Không phải để cho gọn: cách đánh
 * số này biến câu hỏi khó ("hai tông này có chửi nhau không?") thành phép cộng
 * trừ 1. Hai bài hợp nhau khi số của chúng **cạnh nhau trên vòng 12 giờ**, hoặc
 * cùng số khác chữ.
 *
 * Cách đánh số: đi lên một quãng năm đúng (+7 nửa cung) thì số tăng 1. Đó là
 * toàn bộ nội dung của vòng tròn quãng năm, viết lại bằng số.
 *
 *   Đô trưởng = 8B · Sol trưởng = 9B · Rê trưởng = 10B …
 *   La thứ    = 8A  (thứ tương ứng của Đô trưởng — cùng số, khác chữ)
 *
 * ⚠️ Chỗ này CHỈ đúng khi tông dò ra đúng. Máy dò tông sai khoảng một nửa số
 * lần (xem `nhipVaTong.ts`), nên mọi gợi ý ghép ở đây phải hiện KÈM độ tin cậy
 * của phép dò. Một gợi ý ghép tự tin dựa trên tông sai còn tệ hơn không gợi ý.
 */

export type The = 'truong' | 'thu';

export interface Tong {
  /** Cao độ chủ âm, 0 = Đô, 1 = Đô thăng, … 11 = Si. */
  chuAm: number;
  the: The;
}

/** Tên nốt theo dấu thăng — cách viết DJ và phần mềm hay dùng nhất. */
const TEN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

function chuan(n: number): number {
  return ((n % 12) + 12) % 12;
}

/**
 * Số Camelot của một tông (1..12).
 *
 * Với điệu trưởng: `(7·chủâm + 7) mod 12 + 1`. Hệ số 7 là nghịch đảo của 7
 * theo modulo 12 (7·7 = 49 ≡ 1), tức là phép "đi ngược vòng quãng năm".
 * Với điệu thứ: dùng đúng số của tông trưởng tương ứng, tức chủ âm cộng 3.
 */
export function soCamelot(tong: Tong): number {
  const pc = tong.the === 'thu' ? chuan(tong.chuAm + 3) : chuan(tong.chuAm);
  return (chuan(7 * pc + 7)) + 1;
}

/** Mã Camelot đầy đủ, ví dụ `8B` hay `11A`. */
export function maCamelot(tong: Tong): string {
  return `${soCamelot(tong)}${tong.the === 'thu' ? 'A' : 'B'}`;
}

/** Tên tông đọc được, ví dụ `A#m` hay `C`. */
export function tenTong(tong: Tong): string {
  return `${TEN[chuan(tong.chuAm)]}${tong.the === 'thu' ? 'm' : ''}`;
}

/** Đọc ngược từ mã Camelot ra tông. Trả `null` nếu mã sai dạng. */
export function tuMaCamelot(ma: string): Tong | null {
  const khop = /^(\d{1,2})([AB])$/i.exec(ma.trim());
  if (!khop) return null;
  const so = Number(khop[1]);
  if (so < 1 || so > 12) return null;
  const the: The = khop[2]!.toUpperCase() === 'A' ? 'thu' : 'truong';

  /* Đảo lại `soCamelot`: từ `số − 1 ≡ 7·pc + 7` suy ra `pc ≡ 7·(số − 8)`, vì 7
     là nghịch đảo của chính nó theo modulo 12. Rút gọn thành `7·số + 4`. */
  const pcTruong = chuan(7 * so + 4);
  return { chuAm: the === 'thu' ? chuan(pcTruong - 3) : pcTruong, the };
}

export type KieuGhep = 'trung' | 'songSong' | 'quangNam' | 'quangBon' | 'nangNangLuong';

export interface GoiYGhep {
  tong: Tong;
  ma: string;
  kieu: KieuGhep;
  /** Câu giải thích hiện thẳng cho người dùng — không bắt họ tra bảng. */
  vi: string;
}

const GIAI_THICH: Record<KieuGhep, string> = {
  trung: 'Cùng tông — ghép thế nào cũng xuôi',
  songSong: 'Trưởng/thứ song song — đổi sắc thái mà không đổi nền hoà âm',
  quangNam: 'Lên một quãng năm — nghe như sáng lên',
  quangBon: 'Xuống một quãng năm — nghe như lắng xuống',
  nangNangLuong: 'Lên hai bậc — đẩy năng lượng, nhưng nghe rõ là có đổi tông',
};

/**
 * Các tông ghép được với một tông cho trước, xếp từ an toàn nhất xuống.
 *
 * Bốn kiểu đầu là luật kinh điển của phối hoà âm. Kiểu thứ năm (`+2` cùng chữ)
 * là mẹo đẩy năng lượng giữa set — CÓ nghe ra là đổi tông, nên xếp cuối và nói
 * thẳng điều đó trong lời giải thích thay vì để người dùng tự phát hiện lúc
 * đang diễn.
 */
export function ghepDuoc(tong: Tong): GoiYGhep[] {
  const so = soCamelot(tong);
  const doiSo = (buoc: number): Tong => {
    const moi = ((so - 1 + buoc + 12) % 12) + 1;
    const t = tuMaCamelot(`${moi}${tong.the === 'thu' ? 'A' : 'B'}`);
    if (!t) throw new Error(`camelot: dựng sai mã từ số ${moi}`);
    return t;
  };

  const ra: Array<{ tong: Tong; kieu: KieuGhep }> = [
    { tong, kieu: 'trung' },
    { tong: { chuAm: tong.the === 'thu' ? chuan(tong.chuAm + 3) : chuan(tong.chuAm - 3),
              the: tong.the === 'thu' ? 'truong' : 'thu' }, kieu: 'songSong' },
    { tong: doiSo(1), kieu: 'quangNam' },
    { tong: doiSo(-1), kieu: 'quangBon' },
    { tong: doiSo(2), kieu: 'nangNangLuong' },
  ];

  return ra.map((x) => ({
    tong: x.tong,
    ma: maCamelot(x.tong),
    kieu: x.kieu,
    vi: GIAI_THICH[x.kieu],
  }));
}

/** Hai tông có ghép được không, và nếu có thì theo kiểu nào. */
export function hopNhau(a: Tong, b: Tong): KieuGhep | null {
  const maB = maCamelot(b);
  return ghepDuoc(a).find((g) => g.ma === maB)?.kieu ?? null;
}
