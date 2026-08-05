/**
 * Kiểu dữ liệu cho chuyên đề "Việc làm Claude Code".
 *
 * Trang này khác các chuyên đề học ngoại ngữ ở một chỗ: nó không dạy kiến
 * thức mới từ đầu, mà bắc cầu từ NĂNG LỰC ĐANG CÓ sang YÊU CẦU CÓ THẬT trong
 * tin tuyển dụng. Nên mọi con số ở đây phải đo được ngược lại từ dữ liệu:
 * `Skill.jobs` là số tin thực sự nhắc tới kỹ năng đó (quét toàn văn 107/108
 * mô tả công việc), không phải cảm tính.
 *
 * Hệ quả: đừng bao giờ gõ cứng số lên giao diện. Lấy từ `STATS` trong
 * ./index.ts — đã có lần đếm tay rồi lệch với dữ liệu thật.
 */

/** Mức độ một dev ở Việt Nam, chưa có visa lao động, thực sự nộp được. */
export type Tier = 'A' | 'B' | 'C' | 'D';

/** Một tin tuyển dụng đã kiểm chứng còn sống. */
export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  remote: boolean;
  /** Chuỗi lương gốc trong tin, rỗng nếu tin không ghi. */
  salary: string;
  /** Anthropic | HackerNews | RemoteOK | WeWorkRemotely */
  source: string;
  /** Link tin GỐC — không phải link tới aitmpl. */
  url: string;
  /** ISO date, ngày đăng. */
  posted: string;
  /** Số ngày tính tới 05/08/2026 — mốc kiểm chứng. */
  ageDays: number;
  tier: Tier;
  tags: string[];
  /** Trích ngắn từ mô tả gốc (≤190 ký tự) để xem lướt. */
  excerpt: string;
  /** Từ khoá phụ tiếng Việt cho ô tìm kiếm bỏ dấu. */
  kw: string;
}

/** Nhóm kỹ năng — dùng để gom biểu đồ cho dễ đọc. */
export type SkillGroup =
  | 'agentic'   // làm việc với AI agent
  | 'lang'      // ngôn ngữ lập trình
  | 'web'       // framework & web
  | 'infra'     // hạ tầng, vận hành
  | 'data'      // dữ liệu, cơ sở dữ liệu
  | 'soft';     // kỹ năng không phải code

/** Một kỹ năng, kèm số tin đòi nó và cách học nếu còn thiếu. */
export interface Skill {
  id: string;
  name: string;
  /** Số tin trong 108 tin có nhắc tới. Đo bằng quét toàn văn JD. */
  jobs: number;
  group: SkillGroup;
  /** true = đã có sẵn qua dự án cuongthai.com (kho api-backend). */
  have: boolean;
  /** Vì sao nhà tuyển dụng cần nó — viết theo góc nhìn của họ. */
  why?: string;
  /**
   * Học thế nào, cụ thể tới mức làm được luôn.
   * Có cả ở kỹ năng `have: true` — khi đã làm được nhưng chưa NÓI được
   * thành câu chuyện phỏng vấn, vốn là chỗ trượt của phần lớn hồ sơ tự học.
   */
  learn?: string[];
}

/** Một việc cần làm trong lộ trình — tick được, lưu localStorage. */
export interface Task {
  id: string;
  text: string;
  /** Giải thích thêm: làm sao cho đúng, bẫy hay gặp. */
  detail?: string;
}

/** Một chặng trong lộ trình học. */
export interface Phase {
  id: string;
  no: number;
  title: string;
  /** Khoảng thời gian, ví dụ "Tuần 1–4". */
  span: string;
  /** Học xong chặng này thì LÀM ĐƯỢC gì. */
  goal: string;
  /** Vì sao chặng này đứng ở đúng vị trí này trong thứ tự. */
  why: string;
  /** id của các kỹ năng chặng này lấp. */
  skills: string[];
  tasks: Task[];
  /** Mốc tự kiểm: đạt cái này mới được sang chặng sau. */
  milestone: string;
  /** Thứ để lại sau chặng — thứ đưa được vào hồ sơ. */
  output: string;
}

/** Một bước trong dự án, có tiêu chí kiểm được. */
export interface ProjectStep {
  title: string;
  detail: string;
  /** Làm sao biết bước này XONG — phải kiểm được, không phải cảm giác. */
  check: string;
}

/** Một dự án thật để làm, gắn với yêu cầu có thật trong tin tuyển dụng. */
export interface Project {
  id: string;
  no: number;
  title: string;
  tagline: string;
  /** 'nền' | 'giữa' | 'khó' */
  level: 'nền' | 'giữa' | 'khó';
  weeks: string;
  /** Vì sao dự án này đáng làm — nói thẳng bằng số tin tuyển dụng. */
  why: string;
  /** Dự án này mở khoá nhóm tin nào / công ty nào. */
  unlocks: string[];
  /** id kỹ năng dự án này rèn. */
  skills: string[];
  stack: string[];
  steps: ProjectStep[];
  /** Tiêu chí nghiệm thu — làm xong hết mới tính là xong. */
  acceptance: string[];
  /** Bẫy đã biết trước, để không mất buổi vì nó. */
  pitfalls: string[];
  /** Làm thêm nếu còn sức — phần khiến hồ sơ nổi hơn. */
  stretch: string[];
}

/** Một mục chuẩn bị trước khi nộp hồ sơ. */
export interface ApplyItem {
  id: string;
  title: string;
  /** Vì sao mục này quan trọng, dẫn bằng số liệu từ tin tuyển dụng. */
  why: string;
  /** Việc phải làm, cụ thể. */
  todo: string[];
  /** Ví dụ mẫu viết sẵn, nếu có. */
  sample?: { label: string; text: string }[];
}
