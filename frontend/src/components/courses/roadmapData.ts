/**
 * Lộ trình học cho trang /courses (tab "🧭 Lộ trình").
 *
 * Nguồn: ~/Documents/LO-TRINH-HOC.md (chốt 25/09/2026) — React + Node +
 * PostgreSQL + vận hành, Python cho AI, Spring Boot là backend thứ hai.
 * Slug khoá phải khớp slug THẬT trên prod (đo 26/09/2026): slug sai là thẻ
 * dẫn tới 404 mà build không báo gì.
 *
 * `khung: true` = khoá mới có đề cương, bài hiện "Đang soạn". Soạn xong một
 * khoá thì bỏ cờ này đi.
 */

export interface BuocHoc {
  slug: string;
  ten: string;
  /** Môn trường FPT → trỏ /academy/courses/<slug> thay vì /courses/<slug>. */
  academy?: string;
  khung?: boolean;
  /** Vì sao học ở đúng chỗ này — một câu. */
  viSao: string;
}

export interface TangThap {
  so: number;
  ten: string;
  phu: string;
  thoiGian: string;
  mucTieu: string;
  /** Học xong tầng này thì làm được gì — thứ đem ra phỏng vấn được. */
  lamDuoc: string;
  mau: string; // lớp gradient Tailwind cho thanh tháp
  buoc: BuocHoc[];
}

export const THAP: TangThap[] = [
  {
    so: 1,
    ten: 'Nền web',
    phu: 'HTML · CSS · JavaScript · React của trường',
    thoiGian: '~1–2 tháng',
    mucTieu: 'Tự tay dựng được một trang web tĩnh và hiểu React đủ để qua FER202.',
    lamDuoc: 'Trang web nhiều trang có form, gọi API bằng fetch, component React có state/props, đẩy code lên GitHub.',
    mau: 'from-emerald-500 to-teal-500',
    buoc: [
      { slug: 'web-foundations', ten: 'Nền tảng Lập trình Web', viSao: 'Gốc của mọi thứ phía sau. Học kèm Claude, tự gõ tay từng dòng.' },
      { slug: 'git', ten: 'Git & GitHub', viSao: 'Dùng ngay từ bài đầu tiên: mỗi bài học là một commit.' },
      { slug: 'front-end-web-development-with-react', academy: 'FER202', ten: 'FER202 — React theo trường', viSao: 'Chỉ vào khi đã vững JavaScript (hàm, mảng, object, map/filter).' },
      { slug: 'typescript', ten: 'TypeScript', viSao: 'JavaScript có kiểu — mọi dự án React/Node thật đều dùng.' },
    ],
  },
  {
    so: 2,
    ten: 'React + Node fullstack',
    phu: 'Frontend chuyên nghiệp · Backend · Database',
    thoiGian: '~3–4 tháng',
    mucTieu: 'Tự làm một web app hoàn chỉnh: giao diện, API, cơ sở dữ liệu, đăng nhập.',
    lamDuoc: 'Dự án 1 "cuongthai mini" tự gõ 100%: đăng ký/đăng nhập, bài viết có ảnh, bình luận.',
    mau: 'from-sky-500 to-indigo-500',
    buoc: [
      { slug: 'react', ten: 'React hiện đại', viSao: 'React thật ngoài đời: Vite, TypeScript, React 19, gọi API.' },
      { slug: 'tailwind-css', ten: 'Tailwind CSS', viSao: 'Viết giao diện nhanh — cách hầu hết dự án React bây giờ dùng.' },
      { slug: 'nodejs', ten: 'Node.js', viSao: 'Backend cùng ngôn ngữ với React; cuongthai.com chạy bằng nó.' },
      { slug: 'postgresql', ten: 'PostgreSQL', viSao: 'SQL thật. Trường dạy SQL Server (DBI202) — 90% giống nhau.' },
      { slug: 'prisma-orm', ten: 'Prisma ORM', viSao: 'Nối Node với PostgreSQL bằng code có kiểu.' },
      { slug: 'authentication', ten: 'Authentication', viSao: 'Đăng nhập, JWT, session — app nào cũng cần.' },
      { slug: 'api-design', ten: 'API & System Design', khung: true, viSao: 'Thiết kế API cho gọn trước khi nó phình to.' },
      { slug: 'testing', ten: 'Testing', khung: true, viSao: 'Viết test để sửa code không sợ vỡ. Lý thuyết ở SWT301.' },
      { slug: 'nextjs', ten: 'Next.js', viSao: 'Framework CHO React — học SAU React, bỏ qua được mấy chương ôn React.' },
      { slug: 'fullstack-project', ten: '🛠 Dự án 1: app fullstack tự gõ', khung: true, viSao: 'Trả lời câu phỏng vấn "bạn tự làm được 100% không?".' },
    ],
  },
  {
    so: 3,
    ten: 'Vận hành',
    phu: 'Đưa app lên mạng thật',
    thoiGian: '~2 tháng',
    mucTieu: 'Đưa Dự án 1 lên VPS có tên miền, HTTPS, tự deploy mỗi lần push.',
    lamDuoc: 'Link sống để gửi nhà tuyển dụng + CI/CD bằng GitHub Actions — điểm cộng rất lớn khi xin OJT.',
    mau: 'from-amber-500 to-orange-500',
    buoc: [
      { slug: 'linux-bash', ten: 'Linux & Bash', viSao: 'Máy chủ nào cũng là Linux; Terminal là công cụ hằng ngày.' },
      { slug: 'docker', ten: 'Docker', viSao: 'Đóng gói app để chạy giống hệt nhau ở mọi máy.' },
      { slug: 'github-actions', ten: 'GitHub Actions', viSao: 'Tự chạy test/build/deploy mỗi lần push.' },
      { slug: 'nginx', ten: 'Nginx', viSao: 'Cửa ngõ trước app: tên miền, HTTPS, chia đường.' },
      { slug: 'deploy-vps', ten: 'Deploy lên VPS', viSao: 'Ghép tất cả phía trên thành một lần deploy thật.' },
      { slug: 'web-security', ten: 'Web Security', khung: true, viSao: 'Lỗi bảo mật phổ biến (OWASP) và cách chặn.' },
      { slug: 'redis', ten: 'Redis', viSao: 'Cache + giới hạn tốc độ — học khi app bắt đầu chậm.' },
      { slug: 'socket-io', ten: 'Socket.IO', viSao: 'Tính năng thời gian thực: chat, thông báo.' },
      { slug: 'object-storage', ten: 'Object Storage (R2)', viSao: 'Lưu ảnh/video người dùng tải lên.' },
      { slug: 'observability-monitoring', ten: 'Observability & Monitoring', viSao: 'Biết app đang chết ở đâu trước khi người dùng báo.' },
    ],
  },
  {
    so: 4,
    ten: 'Python + AI',
    phu: 'Làm web app có AI',
    thoiGian: '~2–3 tháng',
    mucTieu: 'Thêm AI vào app: chat với tài liệu, tìm kiếm theo nghĩa, agent gọi tool.',
    lamDuoc: 'Dự án 2: web app "chat với tài liệu của mình" (RAG + pgvector).',
    mau: 'from-fuchsia-500 to-pink-500',
    buoc: [
      { slug: 'python', ten: 'Python for Backend & AI', khung: true, viSao: 'Ngôn ngữ của AI — không phải backend thứ ba.' },
      { slug: 'fastapi', ten: 'FastAPI', khung: true, viSao: 'Bọc code AI thành API để React/Node gọi.' },
      { slug: 'llm-apps', ten: 'Building AI Apps with LLMs', khung: true, viSao: 'Gọi LLM API, prompt, streaming, tool calling.' },
      { slug: 'rag-vector-search', ten: 'RAG & Vector Search', khung: true, viSao: 'Cho AI trả lời dựa trên tài liệu của bạn.' },
      { slug: 'ai-agents', ten: 'AI Agents & Evaluation', khung: true, viSao: 'AI tự làm nhiều bước + đo nó trả lời đúng hay sai.' },
    ],
  },
  {
    so: 5,
    ten: 'Java Spring Boot',
    phu: 'Backend thứ hai — trường dạy, công ty VN tuyển nhiều',
    thoiGian: '~2 tháng',
    mucTieu: 'Viết lại backend Dự án 1 bằng Spring Boot, giữ nguyên frontend React.',
    lamDuoc: 'Dự án 3 — bằng chứng "biết hai backend" khi phỏng vấn.',
    mau: 'from-red-500 to-rose-600',
    buoc: [
      { slug: 'object-oriented-programming', academy: 'PRO192', ten: 'PRO192 — Java OOP', viSao: 'Nền Java theo trường.' },
      { slug: 'oop-with-java-lab', academy: 'LAB211', ten: 'LAB211 — Java Lab', viSao: 'Tự tay làm bài Java cho quen.' },
      { slug: 'java-web-application-development', academy: 'PRJ301', ten: 'PRJ301 — Java Web', viSao: 'Servlet/JSP: hiểu web Java chạy thế nào bên dưới.' },
      { slug: 'spring-boot', ten: 'Spring Boot', khung: true, viSao: 'REST, JPA, Security — cách Java làm web ngoài đời.' },
      { slug: 'sba301-integrate-single-page-application-with-spring-boot', academy: 'SBA301', ten: 'SBA301 — React + Spring Boot', viSao: 'Môn trường ghép đúng hai thứ này.' },
    ],
  },
  {
    so: 6,
    ten: 'Mở rộng',
    phu: 'Sau khi có việc, hoặc khi thích',
    thoiGian: 'không giới hạn',
    mucTieu: 'Chọn một hướng đào sâu theo công việc thật.',
    lamDuoc: 'App điện thoại, train model AI, hạ tầng cloud lớn.',
    mau: 'from-violet-500 to-purple-700',
    buoc: [
      { slug: 'react-native', ten: 'React Native & Expo', khung: true, viSao: 'Dùng lại React để làm app điện thoại. Trường: MMA301.' },
      { slug: 'machine-learning', ten: 'Machine Learning', khung: true, viSao: 'Bắt đầu tự train model.' },
      { slug: 'deep-learning', ten: 'Deep Learning (PyTorch)', khung: true, viSao: 'Mạng nơ-ron, fine-tune.' },
      { slug: 'background-jobs', ten: 'Queues & Background Jobs', khung: true, viSao: 'Việc chạy nền: gửi mail, xử lý video.' },
      { slug: 'cloud-aws', ten: 'Cloud (AWS)', khung: true, viSao: 'Khi công ty dùng AWS thay vì VPS.' },
      { slug: 'kubernetes', ten: 'Kubernetes', khung: true, viSao: 'Chạy nhiều container ở quy mô lớn.' },
    ],
  },
];

/** Học xen kẽ suốt lộ trình, không chờ tầng nào. */
export const SONG_SONG: BuocHoc[] = [
  { slug: 'ai-coding', ten: 'Coding with AI', khung: true, viSao: 'Dùng AI như đồng nghiệp — nhưng tự hiểu để kiểm nó.' },
  { slug: 'agile-teamwork', ten: 'Agile, Scrum & Code Review', khung: true, viSao: 'Cách làm việc nhóm ở công ty. Trường: SWR302.' },
  { slug: 'dsa-interview', ten: 'Coding Interview Prep', khung: true, viSao: 'Thuật toán cho vòng phỏng vấn. Trường: CSD201.' },
  { slug: 'interview-prep', ten: 'IT Interview Prep', khung: true, viSao: 'CV, trả lời phỏng vấn — bắt đầu 1–2 tháng trước OJT.' },
];

/** Khoá có thật nhưng KHÔNG nằm trên đường chính — đừng để chúng làm rối. */
export const NGOAI_LE: BuocHoc[] = [
  { slug: 'content-creator', ten: 'Content Creator', viSao: 'Sở thích / kênh video, không phải kỹ năng lập trình.' },
  { slug: 'self-hosting', ten: 'Self-Hosting & Home Lab', khung: true, viSao: 'Tự dựng server ở nhà — vui, nhưng để sau.' },
  { slug: 'media-processing', ten: 'Media Processing', viSao: 'Chỉ cần khi app xử lý ảnh/video nhiều.' },
];
