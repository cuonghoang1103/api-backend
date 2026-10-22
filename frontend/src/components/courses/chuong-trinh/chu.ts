/**
 * Chữ + hàm nhỏ của trang Chương trình đào tạo (/courses). Song ngữ: mọi chuỗi có cả `vi` và `en`.
 * Tên/mô tả khoá đến từ CSDL dạng "EN|||VI" ⇒ đọc bằng `pickLang`; tên/mô tả năm & kỳ có trường riêng
 * (`ten`/`tenEn`, `moTa`/`moTaEn`) ⇒ đọc bằng `chonNgonNgu`.
 */
import type { MonChuongTrinh } from '@/types';

export type NgonNgu = 'vi' | 'en';

export type CheDoXem = 'lo-trinh' | 'chuyen-nganh' | 'tat-ca';

/** ?view=… → chế độ xem (giá trị lạ ⇒ lộ trình). Ở module thường để trang máy chủ gọi được. */
export function docCheDo(v: string | undefined): CheDoXem {
  if (v === 'chuyen-nganh' || v === 'tat-ca') return v;
  return 'lo-trinh';
}

export const CHU = {
  vi: {
    duongDan: 'Khoá học',
    tieuDe: 'Chương trình đào tạo',
    loiDan: 'Mười lăm học kỳ, đi từ dòng lệnh đầu tiên tới hệ thống chạy thật. Mỗi kỳ năm khoá, xếp theo thứ tự nên học — học trọn một kỳ là làm được một việc cụ thể.',
    soKhoa: 'khoá học',
    soKy: 'học kỳ',
    soBai: 'bài học',
    soGio: 'giờ video',
    academyHoi: 'Đang học tại FPT University?',
    academyLink: 'Các môn theo giáo trình trường ở FPTU Academy',
    dangHoc: 'Bạn đang học',
    xemTheo: 'Cách xem',
    cheDo: { 'lo-trinh': 'Theo lộ trình', 'chuyen-nganh': 'Theo chuyên ngành', 'tat-ca': 'Tất cả khoá' },
    cheDoNgan: { 'lo-trinh': 'Lộ trình', 'chuyen-nganh': 'Chuyên ngành', 'tat-ca': 'Tất cả' },
    timKiem: 'Tìm khoá học',
    timGoiY: 'Tìm khoá học…',
    xoaTim: 'Xoá từ khoá',
    moiCapDo: 'Mọi cấp độ',
    capDo: { BEGINNER: 'Cơ bản', INTERMEDIATE: 'Trung cấp', ADVANCED: 'Nâng cao' } as Record<string, string>,
    moiChuyenNganh: 'Mọi chuyên ngành',
    chuyenNganhKhac: 'Khác',
    tongQuan: 'Lộ trình bốn năm',
    tongQuanMoTa: 'Bấm một học kỳ để tới thẳng phần đó.',
    nam: (so: number) => `Năm thứ ${['nhất', 'hai', 'ba', 'tư'][so - 1] ?? so}`,
    kyTu: (a: number, b: number) => `Kỳ ${a}–${b}`,
    hocKy: (so: number) => `Học kỳ ${so}`,
    kyNgan: (so: number) => `Kỳ ${so}`,
    bai: (n: number) => `${n.toLocaleString('vi-VN')} bài`,
    khoa: (n: number) => `${n} khoá`,
    gio: (giay: number) => dinhGio(giay, 'vi'),
    sapRaMat: 'Sắp ra mắt',
    tuChonTieuDe: 'Môn tự chọn · Sắp ra mắt',
    tuChonMoTa: 'Khung chương trình đã sẵn — mục lục từng phần, từng bài. Nội dung mở dần khi soạn xong; chưa đăng ký được.',
    khung: (phan: number, bai: number) => `${phan} phần · ${bai} bài dự kiến`,
    khoaMoi: 'Khoá mới',
    khoaMoiMoTa: 'Khoá vừa ra mắt, chưa xếp vào học kỳ nào. Học độc lập được ngay.',
    ketQua: (n: number) => `${n} khoá khớp`,
    khongCo: 'Không có khoá nào khớp bộ lọc.',
    boLocXoa: 'Xoá bộ lọc',
    loi: 'Chưa tải được chương trình đào tạo.',
    thuLai: 'Thử lại',
    dangTai: 'Đang tải chương trình…',
    tienDo: (p: number) => (p >= 100 ? 'Đã học xong' : `Đã học ${p}%`),
    batDau: 'Chưa bắt đầu',
    mienPhi: 'Miễn phí',
    xemKhoa: 'Xem khoá học',
  },
  en: {
    duongDan: 'Courses',
    tieuDe: 'The Curriculum',
    loiDan: 'Fifteen terms, from your first command line to systems running in production. Five courses per term, in the order they are best taken — finish a term and you can do something concrete.',
    soKhoa: 'courses',
    soKy: 'terms',
    soBai: 'lessons',
    soGio: 'hours of video',
    academyHoi: 'Studying at FPT University?',
    academyLink: 'Courses that follow the university syllabus live in FPTU Academy',
    dangHoc: 'In progress',
    xemTheo: 'View',
    cheDo: { 'lo-trinh': 'By programme', 'chuyen-nganh': 'By discipline', 'tat-ca': 'All courses' },
    cheDoNgan: { 'lo-trinh': 'Programme', 'chuyen-nganh': 'Discipline', 'tat-ca': 'All' },
    timKiem: 'Search courses',
    timGoiY: 'Search courses…',
    xoaTim: 'Clear search',
    moiCapDo: 'All levels',
    capDo: { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced' } as Record<string, string>,
    moiChuyenNganh: 'All disciplines',
    chuyenNganhKhac: 'Other',
    tongQuan: 'Four-year roadmap',
    tongQuanMoTa: 'Select a term to jump straight to it.',
    nam: (so: number) => `Year ${['one', 'two', 'three', 'four'][so - 1] ?? so}`,
    kyTu: (a: number, b: number) => `Terms ${a}–${b}`,
    hocKy: (so: number) => `Term ${so}`,
    kyNgan: (so: number) => `Term ${so}`,
    bai: (n: number) => `${n.toLocaleString('en-US')} ${n === 1 ? 'lesson' : 'lessons'}`,
    khoa: (n: number) => `${n} ${n === 1 ? 'course' : 'courses'}`,
    gio: (giay: number) => dinhGio(giay, 'en'),
    sapRaMat: 'Coming soon',
    tuChonTieuDe: 'Electives · Coming soon',
    tuChonMoTa: 'The syllabus is ready — every part and lesson is listed. Content opens as it is finished; enrolment is not open yet.',
    khung: (phan: number, bai: number) => `${phan} parts · ${bai} planned lessons`,
    khoaMoi: 'New courses',
    khoaMoiMoTa: 'Recently launched and not yet placed in a term. Each one stands on its own.',
    ketQua: (n: number) => `${n} ${n === 1 ? 'course matches' : 'courses match'}`,
    khongCo: 'No course matches these filters.',
    boLocXoa: 'Clear filters',
    loi: 'The curriculum could not be loaded.',
    thuLai: 'Try again',
    dangTai: 'Loading the curriculum…',
    tienDo: (p: number) => (p >= 100 ? 'Completed' : `${p}% complete`),
    batDau: 'Not started',
    mienPhi: 'Free',
    xemKhoa: 'View course',
  },
} as const;

export type BoChu = (typeof CHU)[NgonNgu];

export function chonNgonNgu(vi: string, en: string, nn: NgonNgu): string {
  return nn === 'en' ? en || vi : vi || en;
}

/** "3,2 giờ" · "45 phút" · "" khi không có thời lượng (nhiều khoá dạy bằng slide, không có video). */
export function dinhGio(giay: number, nn: NgonNgu): string {
  if (!giay || giay < 60) return '';
  if (giay < 3600) {
    const m = Math.round(giay / 60);
    return nn === 'en' ? `${m} min` : `${m} phút`;
  }
  const h = Math.round((giay / 3600) * 10) / 10;
  return nn === 'en' ? `${h.toLocaleString('en-US')} h` : `${h.toLocaleString('vi-VN')} giờ`;
}

/** Bỏ dấu tiếng Việt + chữ thường — "lap trinh" khớp "Lập trình" (giống tìm kiếm của máy chủ). */
export function boDau(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

export function khopTuKhoa(m: MonChuongTrinh, tuKhoa: string): boolean {
  const k = boDau(tuKhoa.trim());
  if (!k) return true;
  const hay = boDau([m.title, m.shortDescription, m.courseCode, m.slug, m.categoryName].filter(Boolean).join(' '));
  return k.split(/\s+/).every((tu) => hay.includes(tu));
}
