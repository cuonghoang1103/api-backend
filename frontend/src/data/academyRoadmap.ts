/**
 * academyRoadmap.ts — dữ liệu cho trang "Sơ đồ môn học" (/academy/so-do-mon-hoc).
 *
 * Mục tiêu: giúp sinh viên HIỂU vì sao học từng môn, học xong ra trường làm được
 * gì, và mỗi môn đóng góp gì cho nghề nghiệp — để có động lực học SÂU, không chỉ
 * pass môn. Nội dung dưới đây là NGUYÊN GỐC (tôi tự soạn), không sao chép tài liệu.
 *
 * v1 phủ sâu khối CNTT (đặc biệt các chuyên ngành hẹp SE); các khối khác có
 * career outcome tổng quát ở cấp khối.
 */

/** Giai đoạn theo kỳ — để tô màu & giải thích "kỳ này để làm gì". */
export interface RoadmapPhase {
  key: string;
  label: string;
  labelEn: string;
  /** màu chủ đạo (viền/nền nhạt). */
  color: string;
  desc: string;
}
export function phaseOf(semester: number): RoadmapPhase {
  if (semester <= 2) return { key: 'foundation', label: 'Nền tảng', labelEn: 'Foundation', color: '#22d3ee', desc: 'Toán, kỹ năng, lập trình cơ bản — bệ phóng cho mọi môn sau.' };
  if (semester <= 5) return { key: 'core', label: 'Cốt lõi chuyên ngành', labelEn: 'Core', color: '#8b5cf6', desc: 'Cấu trúc dữ liệu, CSDL, OOP, web — kỹ năng "xương sống" của nghề.' };
  if (semester === 6) return { key: 'ojt', label: 'Thực tập (OJT)', labelEn: 'On-the-job training', color: '#f59e0b', desc: 'Đi làm thực tế ở doanh nghiệp — biến kiến thức thành kinh nghiệm.' };
  return { key: 'advanced', label: 'Chuyên sâu & Đồ án', labelEn: 'Specialization & Capstone', color: '#a3e635', desc: 'Chuyên ngành hẹp + đồ án tốt nghiệp — làm ra sản phẩm thật, sẵn sàng đi làm.' };
}

/** "Học xong ra trường làm được gì" theo chuyên ngành hẹp (combo) hoặc khối. */
export interface CareerOutcome {
  summary: string;
  roles: string[];
}
/** Keyed by combo id (khối IT), rồi major id, rồi faculty id — tra theo thứ tự đó. */
export const CAREER_OUTCOMES: Record<string, CareerOutcome> = {
  // SE combos
  'react-nodejs': { summary: 'Xây web/app đầy đủ (frontend + backend) bằng JavaScript/TypeScript.', roles: ['Full-stack Developer', 'Front-end Developer (React)', 'Back-end Developer (Node.js)', 'Web Developer'] },
  'dotnet': { summary: 'Xây hệ thống doanh nghiệp, web API và app desktop bằng C#/.NET.', roles: ['.NET Developer', 'Back-end Developer (C#)', 'Software Engineer (Enterprise)', 'Desktop App Developer'] },
  'java': { summary: 'Xây hệ thống backend lớn, ổn định cho ngân hàng/doanh nghiệp bằng Java.', roles: ['Java Developer', 'Back-end Engineer', 'Software Engineer (Enterprise)', 'Android Developer'] },
  'ai': { summary: 'Xây mô hình học máy, xử lý ảnh/ngôn ngữ, hệ AI tạo sinh.', roles: ['AI Engineer', 'Machine Learning Engineer', 'Computer Vision / NLP Engineer', 'AI Researcher'] },
  'data-science': { summary: 'Phân tích dữ liệu, dự báo, dashboard hỗ trợ ra quyết định.', roles: ['Data Analyst', 'Data Scientist', 'BI Developer', 'Data Engineer (entry)'] },
  'game-dev': { summary: 'Làm game 2D/3D cho PC/mobile/console bằng Unity/Unreal.', roles: ['Game Developer', 'Unity Developer', 'Gameplay Programmer', 'AR/VR Developer'] },
  // SE major fallback
  'se': { summary: 'Kỹ sư phần mềm: phân tích, thiết kế, lập trình, kiểm thử và triển khai phần mềm.', roles: ['Software Engineer', 'Back-end / Front-end Developer', 'QA/Tester', 'DevOps (entry)', 'Bridge Software Engineer (Nhật/Hàn)'] },
  // Faculty fallbacks
  'it': { summary: 'Làm việc trong ngành công nghệ thông tin — phát triển, vận hành, bảo trì hệ thống phần mềm & dữ liệu.', roles: ['Software Developer', 'IT Specialist', 'System / Data professional'] },
  'business': { summary: 'Làm trong lĩnh vực kinh doanh — marketing, tài chính, vận hành, phân tích, quản trị.', roles: ['Marketing Executive', 'Financial Analyst', 'Business Analyst', 'Sales/Operations', 'Project Coordinator'] },
  'communication': { summary: 'Làm trong truyền thông — nội dung, thương hiệu, PR, marketing tích hợp.', roles: ['Content Creator', 'PR Executive', 'Brand/Marketing Communications', 'Social Media Manager'] },
  'language': { summary: 'Làm việc với ngoại ngữ — biên/phiên dịch, kinh doanh quốc tế, giảng dạy, cầu nối văn hoá.', roles: ['Translator/Interpreter', 'International Business staff', 'Language Teacher', 'Bridge/Comtor'] },
  'cs': { summary: 'Nghiên cứu & xây dựng lõi công nghệ — AI, dữ liệu, an ninh mạng.', roles: ['AI/Data Scientist', 'Cybersecurity Engineer', 'Research Engineer'] },
};
export function careerFor(facultyId?: string | null, majorId?: string | null, comboId?: string | null): CareerOutcome {
  return (
    (comboId && CAREER_OUTCOMES[comboId]) ||
    (majorId && CAREER_OUTCOMES[majorId]) ||
    (facultyId && CAREER_OUTCOMES[facultyId]) ||
    CAREER_OUTCOMES.it
  );
}

/**
 * Gợi ý ngắn "môn này đóng góp gì cho nghề" cho các môn SE cốt lõi (nguyên gốc).
 * Không có trong bảng thì trang dùng whatYouLearn của môn + mô tả theo giai đoạn.
 */
export const COURSE_HINTS: Record<string, string> = {
  PRF192: 'Nền lập trình C — tư duy thuật toán, biến/vòng lặp/hàm/con trỏ. Gốc rễ để học mọi ngôn ngữ sau.',
  PRO192: 'OOP với Java — lớp, kế thừa, đa hình. Nền cho backend, Android, và mọi framework hướng đối tượng.',
  CSD201: 'Cấu trúc dữ liệu & giải thuật — trái tim phỏng vấn kỹ thuật và code hiệu quả.',
  CSD202: 'DSA (C++) — Big-O, cây, đồ thị, hashing. Kỹ năng giải quyết vấn đề mọi lập trình viên cần.',
  DBI202: 'Cơ sở dữ liệu & SQL — mọi ứng dụng đều cần lưu trữ dữ liệu; SQL dùng ở gần như mọi công ty.',
  PRJ301: 'Java Web (Servlet/JSP) — nền để hiểu web hoạt động phía server trước khi lên framework.',
  PRJ302: 'Java Web nâng cao — MVC, JDBC, session; bước đệm lên Spring.',
  HSF302: 'Spring Framework — công cụ backend Java số 1 trong doanh nghiệp; kỹ năng "hot" khi xin việc.',
  FER202: 'Front-end React — dựng giao diện web hiện đại; React là kỹ năng front-end được tuyển nhiều nhất.',
  SWE201c: 'Nhập môn kỹ thuật phần mềm — quy trình, vòng đời; giúp làm việc bài bản trong team.',
  SWP391: 'Đồ án phần mềm — trải nghiệm làm dự án thật theo nhóm, gần với đi làm nhất.',
  SWT301: 'Kiểm thử phần mềm — kỹ năng QA/testing, đảm bảo chất lượng, được nhiều công ty cần.',
  SWR302: 'Yêu cầu phần mềm — biết hỏi đúng nhu cầu khách hàng; kỹ năng của BA/BrSE.',
  MAE101: 'Toán cho kỹ thuật — nền cho AI/đồ hoạ/thuật toán; đừng bỏ qua nếu muốn đi sâu.',
  MAS291: 'Xác suất thống kê — bắt buộc cho Data Science & Machine Learning.',
  PRN212: '.NET/C# desktop — nền C# cho web .NET và game Unity.',
  PRN231: 'Web API (.NET) — xây dịch vụ backend REST; kỹ năng backend cốt lõi.',
  PRN232: 'Web API (.NET) nâng cao — REST/JWT/gRPC cho hệ thống thật.',
  SEP490: 'Đồ án tốt nghiệp — sản phẩm hoàn chỉnh để đưa vào CV, "vũ khí" khi phỏng vấn.',
  EXE101: 'Khởi nghiệp/trải nghiệm — tư duy sản phẩm & kinh doanh, hữu ích cả khi đi làm thuê.',
};
