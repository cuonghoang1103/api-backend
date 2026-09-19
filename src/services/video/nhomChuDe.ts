// ════════════════════════════════════════════════════════════════
// NHÓM CHỦ ĐỀ cho màn duyệt video
//
// 48 khoá có phụ đề, nhưng chỉ 5 khoá có `category_id` (đo 19/09/2026) —
// 43 khoá FPT để trống. Nên KHÔNG dùng `course_categories` làm chỗ dựa:
// dùng nó thì 43/48 khoá rơi vào "(không)" và cái chip lọc thành vô dụng.
//
// Chỗ dựa là MÃ MÔN (`course_code`) — thứ ổn định nhất trong dữ liệu này —
// rồi mới tới từ khoá trong tiêu đề cho 5 khoá GENERAL không có mã.
// ════════════════════════════════════════════════════════════════

export type NhomChuDe = { ma: string; ten: string; icon: string };

/** Thứ tự ở đây là thứ tự chip hiện trên app. */
export const NHOM_CHU_DE: NhomChuDe[] = [
  { ma: 'web',       ten: 'Lập trình Web',          icon: 'globe' },
  { ma: 'backend',   ten: 'Backend & API',          icon: 'server.rack' },
  { ma: 'csdl',      ten: 'Cơ sở dữ liệu',          icon: 'cylinder.split.1x2' },
  { ma: 'ngonngu',   ten: 'Ngôn ngữ & Giải thuật',  icon: 'chevron.left.forwardslash.chevron.right' },
  { ma: 'didong',    ten: 'Lập trình Di động',      icon: 'iphone' },
  { ma: 'hethong',   ten: 'Hệ thống & Mạng',        icon: 'network' },
  { ma: 'kynghe',    ten: 'Kỹ nghệ Phần mềm',       icon: 'hammer' },
  { ma: 'thietke',   ten: 'Thiết kế & UI/UX',       icon: 'paintbrush' },
  { ma: 'toan',      ten: 'Toán & Thống kê',        icon: 'function' },
  { ma: 'kynang',    ten: 'Kỹ năng & Học thuật',    icon: 'person.wave.2' },
  { ma: 'kinhdoanh', ten: 'Kinh doanh & Khởi nghiệp', icon: 'chart.line.uptrend.xyaxis' },
  { ma: 'duan',      ten: 'Dự án thực tế',          icon: 'shippingbox' },
  { ma: 'khac',      ten: 'Khác',                   icon: 'square.grid.2x2' },
];

/** Tiền tố mã môn → nhóm. Lấy 3 ký tự đầu, đủ tách mọi mã đang có. */
const THEO_MA: Record<string, string> = {
  PRF: 'ngonngu', PRO: 'ngonngu', LAB: 'ngonngu', CSD: 'ngonngu',
  MAD: 'ngonngu', CSI: 'ngonngu', PRX: 'ngonngu',
  DBI: 'csdl', DBW: 'csdl',
  FER: 'web', PRJ: 'web', WDP: 'web',
  SDN: 'backend',
  WED: 'thietke', WDU: 'thietke',
  CEA: 'hethong', OSG: 'hethong', NWC: 'hethong', IOT: 'hethong',
  SWE: 'kynghe', SWT: 'kynghe', SWR: 'kynghe', SWP: 'kynghe',
  SWD: 'kynghe', PMG: 'kynghe',
  MAE: 'toan', MAS: 'toan',
  ENW: 'kynang', SSL: 'kynang', SSG: 'kynang', ITE: 'kynang',
  EXE: 'kinhdoanh',
  INT: 'duan',
  PRM: 'didong', MMA: 'didong',
};

/** Khoá KHÔNG có mã môn (5 khoá GENERAL) thì đoán theo tiêu đề. */
const THEO_TU_KHOA: [RegExp, string][] = [
  [/next\.?js|react|lập trình web|html|css/i, 'web'],
  [/node\.?js|express|api|server/i, 'backend'],
  [/postgre|sql|database|cơ sở dữ liệu/i, 'csdl'],
  [/typescript|javascript|python|java\b|thuật toán/i, 'ngonngu'],
];

export function nhomCuaKhoa(courseCode: string | null, title: string): string {
  const ma = (courseCode ?? '').trim().toUpperCase().slice(0, 3);
  if (ma && THEO_MA[ma]) return THEO_MA[ma];
  for (const [re, nhom] of THEO_TU_KHOA) if (re.test(title)) return nhom;
  return 'khac';
}

/**
 * Tiêu đề bài giảng lưu dạng `EN|||VI` (đo 19/09/2026: 963/963 bài đều có
 * dấu này). Trả nguyên cục ra API thì app hiện đúng cục đó lên màn hình —
 * đây chính là thứ người dùng gọi là "lộn vào một chỗ rất khó nhìn".
 */
export function tachTieuDe(title: string): { en: string; vi: string | null } {
  const i = title.indexOf('|||');
  if (i < 0) return { en: title.trim(), vi: null };
  const en = title.slice(0, i).trim();
  const vi = title.slice(i + 3).trim();
  return { en: en || vi, vi: vi || null };
}

// ════════════════════════════════════════════════════════════════
// NHÓM LỚN — tầng ngoài của hàng chip
//
// Hai tầng, vì hai loại nội dung khác hẳn nhau:
//   · Academy = bài giảng của web, đã chia sẵn theo môn/chương/bài. Tầng
//     trong của nó là 12 nhóm chuyên môn ở trên.
//   · Còn lại = video người dùng tự thêm để vừa giải trí vừa nghe tiếng
//     Anh (hoạt hình, nhạc, lịch sử…). Trộn chung với bài giảng thì cả hai
//     cùng khó tìm — và Academy sắp có thêm khối kinh doanh, ngôn ngữ,
//     bán dẫn, nên phải tách ngay từ bây giờ chứ không phải lúc đã lộn.
// ════════════════════════════════════════════════════════════════

export type NhomLon = { ma: string; ten: string; icon: string };

export const NHOM_LON: NhomLon[] = [
  { ma: 'swe',       ten: 'Software Engineering', icon: 'laptopcomputer' },
  { ma: 'ngonngu',   ten: 'Ngôn ngữ',            icon: 'character.bubble' },
  { ma: 'hoathinh',  ten: 'Hoạt hình & Phim',    icon: 'film' },
  { ma: 'nhac',      ten: 'Âm nhạc',             icon: 'music.note' },
  { ma: 'giaitri',   ten: 'Giải trí & Hài',      icon: 'face.smiling' },
  { ma: 'lichsu',    ten: 'Lịch sử',             icon: 'building.columns' },
  { ma: 'kinhdoanh', ten: 'Kinh doanh',          icon: 'chart.line.uptrend.xyaxis' },
  // ⚠️ Mã là `kynangmem`, KHÔNG phải `kynang`: `kynang` đã là mã một nhóm
  // CON trong Software Engineering ("Kỹ năng & Học thuật"). Hai tầng nằm ở
  // hai cột khác nhau nên trùng mã không gây lỗi, nhưng đọc mã thì nhầm.
  { ma: 'kynangmem', ten: 'Kỹ năng',             icon: 'person.2.wave.2' },
  { ma: 'khoahoc',   ten: 'Khoa học & Công nghệ', icon: 'atom' },
  { ma: 'tintuc',    ten: 'Tin tức',             icon: 'newspaper' },
  { ma: 'doisong',   ten: 'Đời sống & Du lịch',  icon: 'figure.walk' },
  { ma: 'game',      ten: 'Game',                icon: 'gamecontroller' },
  { ma: 'thethao',   ten: 'Thể thao',            icon: 'sportscourt' },
  { ma: 'hoc',       ten: 'Học thuật khác',      icon: 'book' },
  { ma: 'khac',      ten: 'Khác',                icon: 'square.grid.2x2' },
];

/** Nhóm lớn có danh mục con (12 nhóm chuyên môn). Hiện chỉ Software Engineering. */
export const NHOM_LON_CO_CON = 'swe';

/**
 * Nhóm LỚN của một khoá Academy.
 *
 * ⚠️ KHÔNG gom hết vào một rổ "Academy": Academy sắp có thêm khối kinh
 * doanh, ngôn ngữ, bán dẫn — gom chung thì tới lúc đó phải tách giữa lúc
 * đã lộn, và người học mở "Academy" ra thấy tiếng Nhật nằm cạnh Docker.
 * Tách ngay từ MÃ MÔN, y như tầng trong.
 */
const NHOM_LON_THEO_MA: Record<string, string> = {
  EXE: 'kinhdoanh', MKT: 'kinhdoanh', RMB: 'kinhdoanh', LDS: 'kinhdoanh',
  LAW: 'kinhdoanh', IBC: 'kinhdoanh', EEC: 'kinhdoanh', MGT: 'kinhdoanh',
  ACC: 'kinhdoanh', FIN: 'kinhdoanh', ECO: 'kinhdoanh',
  JPD: 'ngonngu', ENW: 'ngonngu', ENT: 'ngonngu', KOR: 'ngonngu',
  CHN: 'ngonngu', GER: 'ngonngu', FRE: 'ngonngu',
};

export function nhomLonCuaKhoa(courseCode: string | null, title: string): string {
  const ma = (courseCode ?? '').trim().toUpperCase().slice(0, 3);
  if (ma && NHOM_LON_THEO_MA[ma]) return NHOM_LON_THEO_MA[ma];
  if (/tiếng nhật|tiếng anh|japanese|english|korean|ielts|toeic/i.test(title)) return 'ngonngu';
  if (/kinh doanh|marketing|khởi nghiệp|business|entrepreneur/i.test(title)) return 'kinhdoanh';
  return 'swe';
}

export const MA_NHOM_LON = new Set(NHOM_LON.map((n) => n.ma));

/**
 * Đoán nhóm lớn từ thể loại YouTube tự khai (`categories` trong info.json
 * của yt-dlp). Chỉ là GỢI Ý — người dùng đổi được khi thêm, vì YouTube gom
 * rất thô: một phim tài liệu lịch sử vẫn nằm trong "Education".
 */
export function nhomLonTuTheLoai(theLoai: string[] | null | undefined): string {
  const t = (theLoai ?? []).join(' ').toLowerCase();
  if (!t) return 'khac';
  if (/film|animation/.test(t)) return 'hoathinh';
  if (/music/.test(t)) return 'nhac';
  if (/comedy|entertainment/.test(t)) return 'giaitri';
  if (/science|technology/.test(t)) return 'khoahoc';
  if (/news|politics/.test(t)) return 'tintuc';
  if (/gaming/.test(t)) return 'game';
  if (/sport/.test(t)) return 'thethao';
  if (/travel|events|people|blogs|howto|style|pets|animals/.test(t)) return 'doisong';
  if (/education/.test(t)) return 'hoc';
  return 'khac';
}
