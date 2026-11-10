/**
 * Kiểu dữ liệu chung của "Học mỗi ngày" — bài học tự động trên Bảng tin.
 */
import type { AnhSpec } from './veAnh.js';

/** Nhóm chủ đề — bộ xoay vòng giữ hạn mức theo nhóm (xem lichHoc.ts). */
export type NhomChuDe =
  | 'so-sanh'     // so sánh framework/thư viện/khái niệm
  | 'su-nghiep'   // nghề lập trình, kỹ năng mềm
  | 'bug'         // lỗi hay gặp + cách debug, có thông báo lỗi THẬT
  | 'cs-sau'      // kiến thức CS sâu: OOP, pattern, đồng thời, bộ nhớ, CSDL, mạng, bảo mật, thuật toán
  | 'til'         // "hôm nay mới biết"
  | 'case-study'  // kiến trúc thật của công ty thật
  | 'phong-van'   // câu hỏi phỏng vấn
  | 'tai-nguyen'  // sách/khoá học của tuần
  | 'lich-su'     // lịch sử máy tính
  | 'fun-fact'    // sự thật thú vị
  | 'cong-cu-ai'; // công cụ AI — BỊ GIỚI HẠN tỉ lệ

export type DinhDang =
  | 'meo-code'    // mẹo ngắn + khối code + output thật
  | 'bug'         // thông báo lỗi thật → nguyên nhân → cách sửa
  | 'truoc-sau'   // code trước/sau
  | 'quiz'        // bình chọn + đáp án ẩn (bấm để xem)
  | 'eli5'        // giải thích như cho trẻ 5 tuổi
  | 'so-do'       // sơ đồ luồng/kiến trúc
  | 'thread'      // nhiều slide 1/n (carousel)
  | 'con-so'      // một con số thật + nguồn
  | 'trich-dan'   // câu nói + xuất xứ
  | 'tai-nguyen'  // thẻ sách/khoá học/tài liệu
  | 'anh-that';   // ảnh thật (Commons…) + chú thích

export type Khoi =
  | { k: 'chu'; t: string }
  /**
   * `chay`: cách máy kiểm chứng chạy lại khối này (scripts/feed-hoc-kiem.ts):
   *   node      — stdout phải KHỚP `out`
   *   node-loi  — stderr phải CHỨA `out` (thông báo lỗi thật)
   *   python    — stdout phải KHỚP `out` (bỏ qua nếu máy không có python3)
   *   pg        — chạy trên PostgreSQL thật lúc soạn; máy kiểm chỉ báo "đã ghi tay"
   *   khong     — không chạy (minh hoạ); KHÔNG được có `out`
   */
  | { k: 'code'; lang: string; src: string; out?: string; chay: 'node' | 'node-loi' | 'python' | 'pg' | 'khong'; ten?: string }
  | { k: 'dapan'; t: string };

export interface Nguon { ten: string; url: string }

export interface BaiHoc {
  /** slug ổn định — thành hashtag `#hoc-<id>` để chống đăng lặp. */
  id: string;
  nhom: NhomChuDe;
  dinhDang: DinhDang;
  emoji: string;
  tieuDe: string;
  /** Câu mở (hook) — 1–2 câu, thứ người đọc thấy đầu tiên. */
  mo: string;
  khoi: Khoi[];
  /** Nguồn đã MỞ THẬT lúc soạn (curl 200 + đối chiếu câu chữ). */
  nguon: Nguon[];
  /** Học tiếp trên chính cuongthai.com (khoá học / video bài giảng). */
  hocThem?: Nguon[];
  poll?: { cauHoi: string; luaChon: string[]; dung: number };
  anh: AnhSpec;
  tags: string[];
}
