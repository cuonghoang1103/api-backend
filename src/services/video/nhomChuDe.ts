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
