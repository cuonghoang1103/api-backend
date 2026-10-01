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
 *
 * 01/10/2026 — thêm cho trang Lộ trình bản 3D:
 *   - `BuocHoc.dongGop`: khoá này góp gì vào DỰ ÁN của tầng (cuongthai mini, RAG…).
 *   - `KHOA[slug]`: "học xong làm được gì" (3–5 ý) + số tuần ước lượng. Một khoá
 *     dùng ở nhiều chỗ (tháp + nhiều nghề) chỉ viết MỘT lần ở đây. Ý viết theo
 *     tiêu đề chương THẬT trong content/courses/<slug>.mjs / content/academy/*.mjs.
 *   - Lộ trình 6 nghề: lo-trinh/ngheData.ts.
 */

export interface BuocHoc {
  slug: string;
  ten: string;
  /** Môn trường FPT (mã môn). Trang học là chung: /courses/<slug>. */
  academy?: string;
  khung?: boolean;
  /** Vì sao học ở đúng chỗ này — một câu. */
  viSao: string;
  /** Khoá này đóng góp gì cho dự án của tầng/nghề — 1–2 câu cụ thể. */
  dongGop: string;
}

export interface ThongTinKhoa {
  /** Học xong bạn làm được gì — 3–5 ý cụ thể, đem ra phỏng vấn được. */
  lamDuoc: string[];
  /** Ước lượng số tuần với ~15–20 giờ/tuần (khớp `thoiGian` của từng tầng). Chỉ để tính "thời gian còn lại". */
  tuan: number;
}

export interface TangThap {
  so: number;
  ten: string;
  phu: string;
  thoiGian: string;
  mucTieu: string;
  /** Học xong tầng này thì làm được gì — thứ đem ra phỏng vấn được. */
  lamDuoc: string;
  /** Dự án gắn với tầng — tên hiện trong hộp chi tiết môn. */
  duAn: string;
  mau: string; // lớp gradient Tailwind cho thanh tháp (giữ cho chỗ khác còn dùng)
  /** Hai màu hex [sáng, đậm] cho khối 3D. */
  hex: [string, string];
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
    duAn: 'Trang hồ sơ cá nhân (portfolio) — bước đệm cho Dự án 1',
    mau: 'from-emerald-500 to-teal-500',
    hex: ['#34d399', '#0d9488'],
    buoc: [
      { slug: 'web-foundations', ten: 'Nền tảng Lập trình Web', viSao: 'Gốc của mọi thứ phía sau. Học kèm Claude, tự gõ tay từng dòng.',
        dongGop: 'Dựng khung trang portfolio: HTML đúng ngữ nghĩa, CSS responsive, form liên hệ gọi API bằng fetch.' },
      { slug: 'git', ten: 'Git & GitHub', viSao: 'Dùng ngay từ bài đầu tiên: mỗi bài học là một commit.',
        dongGop: 'Toàn bộ portfolio nằm trên GitHub với lịch sử commit sạch — nhà tuyển dụng mở ra là thấy bạn làm việc thế nào.' },
      { slug: 'front-end-web-development-with-react', academy: 'FER202', ten: 'FER202 — React theo trường', viSao: 'Chỉ vào khi đã vững JavaScript (hàm, mảng, object, map/filter).',
        dongGop: 'Chuyển phần danh sách dự án của portfolio sang component React có props/state — đúng thứ FER202 chấm.' },
      { slug: 'typescript', ten: 'TypeScript', viSao: 'JavaScript có kiểu — mọi dự án React/Node thật đều dùng.',
        dongGop: 'Gõ kiểu cho dữ liệu portfolio; từ tầng 2 mọi dòng code của Dự án 1 đều là TypeScript.' },
    ],
  },
  {
    so: 2,
    ten: 'React + Node fullstack',
    phu: 'Frontend chuyên nghiệp · Backend · Database',
    thoiGian: '~3–4 tháng',
    mucTieu: 'Tự làm một web app hoàn chỉnh: giao diện, API, cơ sở dữ liệu, đăng nhập.',
    lamDuoc: 'Dự án 1 "cuongthai mini" tự gõ 100%: đăng ký/đăng nhập, bài viết có ảnh, bình luận.',
    duAn: 'Dự án 1 — cuongthai mini (app fullstack tự gõ 100%)',
    mau: 'from-sky-500 to-indigo-500',
    hex: ['#38bdf8', '#4f46e5'],
    buoc: [
      { slug: 'react', ten: 'React hiện đại', viSao: 'React thật ngoài đời: Vite, TypeScript, React 19, gọi API.',
        dongGop: 'Toàn bộ giao diện cuongthai mini: trang bảng tin, trang bài viết, form đăng bài, định tuyến giữa các trang.' },
      { slug: 'tailwind-css', ten: 'Tailwind CSS', viSao: 'Viết giao diện nhanh — cách hầu hết dự án React bây giờ dùng.',
        dongGop: 'Hệ giao diện của cuongthai mini: theme sáng/tối bằng biến CSS, component dùng lại, chạy tốt trên điện thoại.' },
      { slug: 'nodejs', ten: 'Node.js', viSao: 'Backend cùng ngôn ngữ với React; cuongthai.com chạy bằng nó.',
        dongGop: 'Toàn bộ API Express của cuongthai mini: bài viết, bình luận, upload ảnh, phân trang.' },
      { slug: 'postgresql', ten: 'PostgreSQL', viSao: 'SQL thật. Trường dạy SQL Server (DBI202) — 90% giống nhau.',
        dongGop: 'Thiết kế bảng users / posts / comments có ràng buộc và chỉ mục — nơi mọi dữ liệu của Dự án 1 nằm.' },
      { slug: 'prisma-orm', ten: 'Prisma ORM', viSao: 'Nối Node với PostgreSQL bằng code có kiểu.',
        dongGop: 'Lược đồ Prisma + migration cho cuongthai mini; truy vấn có kiểu, không còn chuỗi SQL rời rạc.' },
      { slug: 'authentication', ten: 'Authentication', viSao: 'Đăng nhập, JWT, session — app nào cũng cần.',
        dongGop: 'Đăng ký/đăng nhập, băm mật khẩu, cookie phiên + refresh token, chỉ chủ bài mới sửa/xoá được bài.' },
      { slug: 'api-design', ten: 'API & System Design', khung: true, viSao: 'Thiết kế API cho gọn trước khi nó phình to.',
        dongGop: 'Chuẩn hoá API của Dự án 1: tên tài nguyên, mã lỗi thống nhất, phân trang con trỏ, tài liệu OpenAPI.' },
      { slug: 'testing', ten: 'Testing', khung: true, viSao: 'Viết test để sửa code không sợ vỡ. Lý thuyết ở SWT301.',
        dongGop: 'Test API với CSDL thật và test E2E Playwright cho luồng đăng nhập → đăng bài → bình luận.' },
      { slug: 'nextjs', ten: 'Next.js', viSao: 'Framework CHO React — học SAU React, bỏ qua được mấy chương ôn React.',
        dongGop: 'Bản cuongthai mini có SEO: trang bài viết render phía server, middleware chặn trang cần đăng nhập.' },
      { slug: 'fullstack-project', ten: '🛠 Dự án 1: app fullstack tự gõ', khung: true, viSao: 'Trả lời câu phỏng vấn "bạn tự làm được 100% không?".',
        dongGop: 'Chính là Dự án 1: ghép mọi khoá phía trên thành một app chạy được, có test, Docker và CI.' },
    ],
  },
  {
    so: 3,
    ten: 'Vận hành',
    phu: 'Đưa app lên mạng thật',
    thoiGian: '~2 tháng',
    mucTieu: 'Đưa Dự án 1 lên VPS có tên miền, HTTPS, tự deploy mỗi lần push.',
    lamDuoc: 'Link sống để gửi nhà tuyển dụng + CI/CD bằng GitHub Actions — điểm cộng rất lớn khi xin OJT.',
    duAn: 'Dự án 1 lên mạng thật — tên miền, HTTPS, CI/CD',
    mau: 'from-amber-500 to-orange-500',
    hex: ['#fbbf24', '#ea580c'],
    buoc: [
      { slug: 'linux-bash', ten: 'Linux & Bash', viSao: 'Máy chủ nào cũng là Linux; Terminal là công cụ hằng ngày.',
        dongGop: 'Tự dựng VPS cho cuongthai mini: tạo user, khoá SSH, systemd, cron sao lưu, đọc log khi có sự cố.' },
      { slug: 'docker', ten: 'Docker', viSao: 'Đóng gói app để chạy giống hệt nhau ở mọi máy.',
        dongGop: 'Dockerfile nhiều tầng cho frontend + backend và một file Compose chạy cả app lẫn PostgreSQL.' },
      { slug: 'github-actions', ten: 'GitHub Actions', viSao: 'Tự chạy test/build/deploy mỗi lần push.',
        dongGop: 'Pipeline: mỗi lần push là tự chạy tsc + test + build ảnh — đỏ thì không được lên production.' },
      { slug: 'nginx', ten: 'Nginx', viSao: 'Cửa ngõ trước app: tên miền, HTTPS, chia đường.',
        dongGop: 'Nginx đứng trước cuongthai mini: HTTPS, chia /api về backend, cache file tĩnh, giới hạn tần suất.' },
      { slug: 'deploy-vps', ten: 'Deploy lên VPS', viSao: 'Ghép tất cả phía trên thành một lần deploy thật.',
        dongGop: 'Script deploy tráo phiên bản không rơi request, migration an toàn, lùi bản được, có sao lưu.' },
      { slug: 'web-security', ten: 'Web Security', khung: true, viSao: 'Lỗi bảo mật phổ biến (OWASP) và cách chặn.',
        dongGop: 'Rà Dự án 1 theo OWASP: chặn XSS ở bình luận, IDOR ở sửa bài, upload ảnh độc, lộ bí mật.' },
      { slug: 'redis', ten: 'Redis', viSao: 'Cache + giới hạn tốc độ — học khi app bắt đầu chậm.',
        dongGop: 'Cache bảng tin và bộ đếm lượt xem; chặn spam đăng nhập bằng rate limit trên Redis.' },
      { slug: 'socket-io', ten: 'Socket.IO', viSao: 'Tính năng thời gian thực: chat, thông báo.',
        dongGop: 'Thông báo realtime khi có người bình luận bài của bạn, kèm chấm xanh "đang online".' },
      { slug: 'object-storage', ten: 'Object Storage (R2)', viSao: 'Lưu ảnh/video người dùng tải lên.',
        dongGop: 'Chuyển ảnh bài viết sang R2: upload thẳng từ trình duyệt bằng URL ký sẵn, VPS không còn chứa file.' },
      { slug: 'observability-monitoring', ten: 'Observability & Monitoring', viSao: 'Biết app đang chết ở đâu trước khi người dùng báo.',
        dongGop: 'Log có cấu trúc, chỉ số và cảnh báo cho cuongthai mini — biết API nào chậm trước khi người dùng than.' },
    ],
  },
  {
    so: 4,
    ten: 'Python + AI',
    phu: 'Làm web app có AI',
    thoiGian: '~2–3 tháng',
    mucTieu: 'Thêm AI vào app: chat với tài liệu, tìm kiếm theo nghĩa, agent gọi tool.',
    lamDuoc: 'Dự án 2: web app "chat với tài liệu của mình" (RAG + pgvector).',
    duAn: 'Dự án 2 — Chat với tài liệu của mình (RAG + pgvector)',
    mau: 'from-fuchsia-500 to-pink-500',
    hex: ['#e879f9', '#db2777'],
    buoc: [
      { slug: 'python', ten: 'Python for Backend & AI', khung: true, viSao: 'Ngôn ngữ của AI — không phải backend thứ ba.',
        dongGop: 'Công cụ Python đọc và làm sạch tài liệu (PDF, Markdown) trước khi đưa vào Dự án 2.' },
      { slug: 'fastapi', ten: 'FastAPI', khung: true, viSao: 'Bọc code AI thành API để React/Node gọi.',
        dongGop: 'Dịch vụ AI của Dự án 2: API nhận câu hỏi, trả lời dạng streaming từng chữ về giao diện React.' },
      { slug: 'llm-apps', ten: 'Building AI Apps with LLMs', khung: true, viSao: 'Gọi LLM API, prompt, streaming, tool calling.',
        dongGop: 'Lõi trò chuyện của Dự án 2: prompt hệ thống, output có cấu trúc, trần chi phí, chặn prompt injection.' },
      { slug: 'rag-vector-search', ten: 'RAG & Vector Search', khung: true, viSao: 'Cho AI trả lời dựa trên tài liệu của bạn.',
        dongGop: 'Trái tim Dự án 2: cắt tài liệu, embedding vào pgvector, tìm kiếm lai + rerank, câu trả lời có trích nguồn.' },
      { slug: 'ai-agents', ten: 'AI Agents & Evaluation', khung: true, viSao: 'AI tự làm nhiều bước + đo nó trả lời đúng hay sai.',
        dongGop: 'Nâng Dự án 2 thành agent biết gọi tool (tìm, tóm tắt, tạo ghi chú) và có bộ eval đo đúng/sai.' },
    ],
  },
  {
    so: 5,
    ten: 'Java Spring Boot',
    phu: 'Backend thứ hai — trường dạy, công ty VN tuyển nhiều',
    thoiGian: '~2 tháng',
    mucTieu: 'Viết lại backend Dự án 1 bằng Spring Boot, giữ nguyên frontend React.',
    lamDuoc: 'Dự án 3 — bằng chứng "biết hai backend" khi phỏng vấn.',
    duAn: 'Dự án 3 — backend Spring Boot cho cuongthai mini',
    mau: 'from-red-500 to-rose-600',
    hex: ['#f87171', '#be123c'],
    buoc: [
      { slug: 'object-oriented-programming', academy: 'PRO192', ten: 'PRO192 — Java OOP', viSao: 'Nền Java theo trường.',
        dongGop: 'Mô hình hoá User / Post / Comment thành lớp Java đúng đóng gói, kế thừa, interface — xương sống của Dự án 3.' },
      { slug: 'oop-with-java-lab', academy: 'LAB211', ten: 'LAB211 — Java Lab', viSao: 'Tự tay làm bài Java cho quen.',
        dongGop: 'Phản xạ viết Java sạch theo MVC, validate đầu vào, Collections — gõ backend Dự án 3 không phải tra từng dòng.' },
      { slug: 'java-web-application-development', academy: 'PRJ301', ten: 'PRJ301 — Java Web', viSao: 'Servlet/JSP: hiểu web Java chạy thế nào bên dưới.',
        dongGop: 'Hiểu request đi qua Servlet, Filter, DAO thế nào — gỡ lỗi được Spring vì biết nó bọc thứ gì bên dưới.' },
      { slug: 'spring-boot', ten: 'Spring Boot', khung: true, viSao: 'REST, JPA, Security — cách Java làm web ngoài đời.',
        dongGop: 'Viết lại toàn bộ API của cuongthai mini: REST controller, JPA + Flyway trên cùng PostgreSQL, Spring Security + JWT.' },
      { slug: 'sba301-integrate-single-page-application-with-spring-boot', academy: 'SBA301', ten: 'SBA301 — React + Spring Boot', viSao: 'Môn trường ghép đúng hai thứ này.',
        dongGop: 'Nối frontend React cũ của Dự án 1 vào backend Spring mới: CORS, JWT, xử lý lỗi — chạy y như bản Node.' },
    ],
  },
  {
    so: 6,
    ten: 'Mở rộng',
    phu: 'Sau khi có việc, hoặc khi thích',
    thoiGian: 'không giới hạn',
    mucTieu: 'Chọn một hướng đào sâu theo công việc thật.',
    lamDuoc: 'App điện thoại, train model AI, hạ tầng cloud lớn.',
    duAn: 'Hướng mở rộng — app điện thoại, model riêng, hạ tầng lớn',
    mau: 'from-violet-500 to-purple-700',
    hex: ['#a78bfa', '#7e22ce'],
    buoc: [
      { slug: 'react-native', ten: 'React Native & Expo', khung: true, viSao: 'Dùng lại React để làm app điện thoại. Trường: MMA301.',
        dongGop: 'App điện thoại cho cuongthai mini dùng chung API: đọc bảng tin, đăng ảnh từ camera, nhận push notification.' },
      { slug: 'machine-learning', ten: 'Machine Learning', khung: true, viSao: 'Bắt đầu tự train model.',
        dongGop: 'Model gợi ý bài viết hoặc phân loại bình luận spam cho cuongthai mini, train bằng scikit-learn.' },
      { slug: 'deep-learning', ten: 'Deep Learning (PyTorch)', khung: true, viSao: 'Mạng nơ-ron, fine-tune.',
        dongGop: 'Fine-tune một model nhỏ và chạy cục bộ — thay một phần lời gọi API trả tiền của Dự án 2.' },
      { slug: 'background-jobs', ten: 'Queues & Background Jobs', khung: true, viSao: 'Việc chạy nền: gửi mail, xử lý video.',
        dongGop: 'Hàng đợi BullMQ cho việc nặng của cuongthai mini: gửi mail, nén ảnh, thông báo — có thử lại và hàng đợi chết.' },
      { slug: 'cloud-aws', ten: 'Cloud (AWS)', khung: true, viSao: 'Khi công ty dùng AWS thay vì VPS.',
        dongGop: 'Đưa cuongthai mini từ VPS lên AWS: VPC, container, RDS, S3 + CDN, theo dõi chi phí.' },
      { slug: 'kubernetes', ten: 'Kubernetes', khung: true, viSao: 'Chạy nhiều container ở quy mô lớn.',
        dongGop: 'Chạy cuongthai mini trên một cụm Kubernetes: Deployment, Service, Ingress, tự co giãn theo tải.' },
    ],
  },
];

/** Học xen kẽ suốt lộ trình, không chờ tầng nào. */
export const SONG_SONG: BuocHoc[] = [
  { slug: 'ai-coding', ten: 'Coding with AI', khung: true, viSao: 'Dùng AI như đồng nghiệp — nhưng tự hiểu để kiểm nó.',
    dongGop: 'Mọi dự án: làm nhanh hơn với agent viết code, nhưng mỗi thay đổi đều có test và bạn tự đọc hiểu trước khi commit.' },
  { slug: 'agile-teamwork', ten: 'Agile, Scrum & Code Review', khung: true, viSao: 'Cách làm việc nhóm ở công ty. Trường: SWR302.',
    dongGop: 'Chạy Dự án 1 như ở công ty: ticket, sprint, pull request có review — đúng thứ hỏi trong vòng phỏng vấn hành vi.' },
  { slug: 'dsa-interview', ten: 'Coding Interview Prep', khung: true, viSao: 'Thuật toán cho vòng phỏng vấn. Trường: CSD201.',
    dongGop: 'Không vào dự án — đây là tấm vé qua vòng coding để được nói về dự án của bạn.' },
  { slug: 'interview-prep', ten: 'IT Interview Prep', khung: true, viSao: 'CV, trả lời phỏng vấn — bắt đầu 1–2 tháng trước OJT.',
    dongGop: 'Biến Dự án 1–3 thành CV, README và câu chuyện 2 phút kể trong phỏng vấn.' },
];

/** Khoá có thật nhưng KHÔNG nằm trên đường chính — đừng để chúng làm rối. */
export const NGOAI_LE: BuocHoc[] = [
  { slug: 'content-creator', ten: 'Content Creator', viSao: 'Sở thích / kênh video, không phải kỹ năng lập trình.',
    dongGop: 'Quay video demo dự án để gắn vào CV và README.' },
  { slug: 'self-hosting', ten: 'Self-Hosting & Home Lab', khung: true, viSao: 'Tự dựng server ở nhà — vui, nhưng để sau.',
    dongGop: 'Một máy nhà chạy bản thử của dự án và các dịch vụ tự host.' },
  { slug: 'media-processing', ten: 'Media Processing', viSao: 'Chỉ cần khi app xử lý ảnh/video nhiều.',
    dongGop: 'Nén ảnh, cắt video, phát HLS cho dự án có nhiều media.' },
];

/**
 * "Học xong làm được gì" theo khoá. Viết theo tiêu đề chương thật của từng khoá.
 * Khoá không có ở đây ⇒ hộp chi tiết chỉ hiện phần "đóng góp" + "vì sao".
 */
export const KHOA: Record<string, ThongTinKhoa> = {
  // ── Tầng 1
  'web-foundations': { tuan: 3, lamDuoc: [
    'Dựng trang nhiều phần bằng HTML đúng ngữ nghĩa và CSS responsive chạy tốt trên điện thoại',
    'Viết JavaScript xử lý sự kiện, mảng/object, async/await và module',
    'Gọi HTTP API bằng fetch, hiểu request/response, mã trạng thái và cookie',
    'Dùng terminal, VS Code, Git, npm hằng ngày và gỡ lỗi bằng DevTools',
    'Đưa một trang tĩnh lên mạng có tên miền',
  ] },
  git: { tuan: 1, lamDuoc: [
    'Commit, tạo nhánh, merge và rebase mà hiểu Git đang lưu ảnh chụp gì',
    'Mở pull request, review code và xử lý xung đột trong nhóm',
    'Hoàn tác sai lầm an toàn: restore, revert, reflog — cứu được commit tưởng đã mất',
    'Làm hồ sơ GitHub và portfolio đủ để nhà tuyển dụng đọc',
  ] },
  'front-end-web-development-with-react': { tuan: 2, lamDuoc: [
    'Viết ES6 cho React: arrow function, destructuring, spread, module',
    'Dựng giao diện bằng JSX, component, props và state',
    'Xử lý sự kiện, chia sẻ dữ liệu bằng Context và dùng các hook cơ bản',
    'Dàn trang nhanh bằng Bootstrap / React-Bootstrap — đúng phần thi FER202',
  ] },
  typescript: { tuan: 1.5, lamDuoc: [
    'Gõ kiểu cho hàm, object, union và thu hẹp kiểu để bắt lỗi trước khi chạy',
    'Dùng generics và utility types thay vì copy-paste kiểu',
    'Gõ kiểu cho backend Express và component React',
    'Validate dữ liệu lúc chạy bằng Zod, cấu hình tsconfig cho dự án thật',
  ] },
  // ── Tầng 2
  react: { tuan: 2.5, lamDuoc: [
    'Chia giao diện thành component, quản lý state, form và effect đúng chỗ',
    'Lấy dữ liệu từ API, định tuyến nhiều trang và chia sẻ state giữa component',
    'Viết test cho component và đo hiệu năng render',
    'Hiểu React 19, concurrent rendering và đưa app React lên production',
  ] },
  'tailwind-css': { tuan: 1, lamDuoc: [
    'Dàn giao diện nhanh bằng thang khoảng cách/màu thay vì thuộc lòng tên lớp',
    'Làm theme sáng/tối bằng biến CSS và biến thể của Tailwind',
    'Tách component tái sử dụng đúng chỗ, xử lý xung đột lớp',
    'Đo kích thước CSS đầu ra và khả năng tiếp cận thật',
  ] },
  nodejs: { tuan: 2.5, lamDuoc: [
    'Hiểu event loop và các module lõi của Node để không chặn server',
    'Viết REST API bằng Express nối PostgreSQL qua Prisma',
    'Làm xác thực, phân quyền, upload file và realtime bằng Socket.IO',
    'Thêm Redis, hàng đợi nền, log, test và đóng Docker để deploy',
  ] },
  postgresql: { tuan: 2, lamDuoc: [
    'Thiết kế bảng có ràng buộc, khoá ngoại và kiểu dữ liệu đúng',
    'Viết JOIN, GROUP BY, CTE và hàm cửa sổ cho báo cáo thật',
    'Đánh chỉ mục và đọc EXPLAIN để biết vì sao truy vấn chậm',
    'Dùng giao dịch, JSONB, full-text search; sao lưu và nhân bản',
  ] },
  'prisma-orm': { tuan: 1, lamDuoc: [
    'Viết lược đồ Prisma có quan hệ một-nhiều, nhiều-nhiều',
    'Đọc/ghi dữ liệu có kiểu, truy vấn lồng, phân trang',
    'Tạo và áp migration an toàn, dùng giao dịch khi tranh chấp',
    'Biết khi nào thoát ra SQL thô và cách tránh truy vấn N+1',
  ] },
  authentication: { tuan: 1, lamDuoc: [
    'Băm và lưu mật khẩu đúng chuẩn (bcrypt/argon2)',
    'Làm đăng nhập bằng phiên + cookie hoặc JWT, có refresh và thu hồi',
    'Thêm xác thực hai lớp, passkey và đăng nhập Google qua OAuth/OIDC',
    'Thiết kế phân quyền và chặn các kiểu tấn công đăng nhập phổ biến',
  ] },
  'api-design': { tuan: 1, lamDuoc: [
    'Đặt tên tài nguyên và phương thức REST nhất quán',
    'Chuẩn hoá lỗi, kiểm dữ liệu, phân trang, lọc và sắp xếp',
    'Làm API tin cậy: idempotency, thử lại, giới hạn tần suất, versioning',
    'Viết tài liệu OpenAPI và trả lời vòng phỏng vấn system design cơ bản',
  ] },
  testing: { tuan: 1, lamDuoc: [
    'Viết unit test, mock/stub mà không tự lừa mình',
    'Test tích hợp với cơ sở dữ liệu thật và test API HTTP',
    'Test component React và test end-to-end bằng Playwright',
    'Đưa test vào CI và xử lý test chập chờn',
  ] },
  nextjs: { tuan: 2, lamDuoc: [
    'Định tuyến bằng App Router, tách Server Component và Client Component',
    'Fetch dữ liệu có cache/revalidate, mutate bằng Server Actions',
    'Làm xác thực bằng middleware + cookie, form có validate và upload',
    'Tối ưu SEO, ảnh, font và deploy bản build lên production',
  ] },
  'fullstack-project': { tuan: 2, lamDuoc: [
    'Tự lên kế hoạch và dựng một app fullstack từ thư mục trống',
    'Ghép backend, xác thực, bài viết có ảnh, bình luận, phân trang và realtime nhẹ',
    'Test cả hệ thống, đóng Docker và chạy CI bằng GitHub Actions',
    'Deploy và kể lại dự án như một case study trong phỏng vấn',
  ] },
  // ── Tầng 3
  'linux-bash': { tuan: 1.5, lamDuoc: [
    'Di chuyển, tìm và xử lý file bằng terminal; nối lệnh bằng ống dẫn',
    'Quản lý quyền, người dùng, tiến trình và tín hiệu',
    'Viết script Bash an toàn cho production, chạy định kỳ bằng cron/systemd',
    'Chẩn đoán một máy chủ thật: đĩa đầy, RAM, log, mạng',
  ] },
  docker: { tuan: 1.5, lamDuoc: [
    'Viết Dockerfile nhiều tầng, ảnh nhỏ và an toàn, dựng nhanh nhờ cache',
    'Dùng volume, mạng và Docker Compose cho app nhiều dịch vụ',
    'Chạy container trên production và chẩn đoán khi nó chết',
    'Đóng gói và đưa một ứng dụng thật lên production',
  ] },
  'github-actions': { tuan: 1, lamDuoc: [
    'Viết workflow CI chạy test/build mỗi lần push',
    'Dùng cache, artifact, ma trận và concurrency cho pipeline nhanh',
    'Quản lý bí mật và quyền token an toàn',
    'Đọc log khi CI đỏ và dựng một pipeline CI/CD hoàn chỉnh',
  ] },
  nginx: { tuan: 0.5, lamDuoc: [
    'Hiểu request được Nginx khớp vào server/location nào',
    'Làm reverse proxy cho app Node, phục vụ file tĩnh có cache',
    'Bật TLS + HTTP/2 và giới hạn tần suất, kích thước request',
    'Cân bằng tải nhiều backend và đọc log để chẩn đoán',
  ] },
  'deploy-vps': { tuan: 1, lamDuoc: [
    'Đưa app từ máy mình lên VPS có tên miền và HTTPS',
    'Tráo phiên bản không rơi request, chạy migration an toàn',
    'Viết script deploy chạy hai lần vẫn an toàn và lùi bản được',
    'Giám sát, sao lưu và phục hồi trên một máy nhỏ',
  ] },
  'web-security': { tuan: 1, lamDuoc: [
    'Nhận ra và chặn injection, XSS, CSRF, SSRF',
    'Sửa lỗi phân quyền hỏng (IDOR) và phiên đăng nhập yếu',
    'Quản lý bí mật, cấu hình an toàn và thư viện phụ thuộc',
    'Tự rà soát bảo mật dự án của mình theo OWASP',
  ] },
  redis: { tuan: 0.5, lamDuoc: [
    'Dùng Redis làm cache đúng cách: TTL, dữ liệu ôi, giẫm đạp cache',
    'Đếm, xếp hạng và giới hạn tần suất bằng các kiểu dữ liệu của Redis',
    'Viết thao tác nguyên tử bằng MULTI/Lua',
    'Vận hành Redis: bộ nhớ, lưu lâu dài, nhân bản',
  ] },
  'socket-io': { tuan: 0.5, lamDuoc: [
    'Làm chat và thông báo thời gian thực bằng room và namespace',
    'Theo dõi trạng thái online mà không vỡ khi đông người',
    'Mở rộng nhiều server bằng Redis adapter, dùng ack để không mất tin',
    'Biết khi nào nên dùng WebSocket thuần hoặc công cụ khác',
  ] },
  'object-storage': { tuan: 0.5, lamDuoc: [
    'Lưu và phục vụ file người dùng trên R2/S3 qua S3 API',
    'Cho trình duyệt upload thẳng bằng URL ký sẵn an toàn',
    'Cấu hình CORS, lifecycle dọn file rác và kiểm soát chi phí',
  ] },
  'observability-monitoring': { tuan: 0.5, lamDuoc: [
    'Ghi log có cấu trúc và lần theo một request qua nhiều dịch vụ',
    'Đo chỉ số và trace để biết thời gian thật sự đi đâu',
    'Đặt cảnh báo có ý nghĩa và dựng bảng theo dõi người ta thật sự đọc',
    'Đi từ một cảnh báo tới nguyên nhân gốc',
  ] },
  // ── Tầng 4
  python: { tuan: 2.5, lamDuoc: [
    'Viết Python sạch: hàm, module, OOP, comprehension, xử lý lỗi',
    'Dùng công cụ hiện đại (uv, ruff) và test bằng pytest',
    'Gọi HTTP API và viết code bất đồng bộ với asyncio',
    'Xử lý dữ liệu nhập môn bằng numpy và pandas',
  ] },
  fastapi: { tuan: 2, lamDuoc: [
    'Viết API bằng FastAPI + Pydantic v2 có validate tự động',
    'Dùng dependency injection, xác thực và nối CSDL qua SQLModel',
    'Trả lời AI dạng streaming từng chữ',
    'Test, đóng Docker và deploy dịch vụ Python',
  ] },
  'llm-apps': { tuan: 2, lamDuoc: [
    'Gọi LLM API đúng cách: thử lại, timeout, streaming',
    'Viết prompt tốt và nhận output có cấu trúc (JSON) đáng tin',
    'Cho model gọi tool (function calling) để làm việc thật',
    'Kiểm soát token, chi phí, chặn prompt injection; gắn AI vào app Node/React hoặc FastAPI',
  ] },
  'rag-vector-search': { tuan: 2, lamDuoc: [
    'Hiểu embedding và chọn cách cắt tài liệu phù hợp',
    'Lưu và tìm vector bằng pgvector trên PostgreSQL',
    'Kết hợp tìm kiếm lai + rerank và trả lời có trích nguồn',
    'Đo chất lượng RAG bằng bộ đánh giá thay vì cảm tính',
  ] },
  'ai-agents': { tuan: 2, lamDuoc: [
    'Viết vòng lặp agent bằng code, thiết kế tool cho agent',
    'Kết nối công cụ qua Model Context Protocol (MCP)',
    'Thêm bộ nhớ, đa agent và guardrail',
    'Xây bộ eval, dùng LLM-as-judge và kiểm soát chi phí trong vòng lặp',
  ] },
  // ── Tầng 5
  'object-oriented-programming': { tuan: 2.5, lamDuoc: [
    'Tư duy hướng đối tượng và viết Java từ nền C',
    'Thiết kế lớp có đóng gói, kế thừa, đa hình, abstract class và interface',
    'Xử lý ngoại lệ, mảng đối tượng và Java Collections',
    'Qua bài thi thực hành PRO192 (PE)',
  ] },
  'oop-with-java-lab': { tuan: 2, lamDuoc: [
    'Tổ chức code Java theo kiến trúc MVC chuẩn của LAB211',
    'Nhập liệu an toàn, validate ngày tháng/số và xuất đúng định dạng',
    'Làm CRUD với Collections, Comparator và đọc/ghi file',
    'Sống sót buổi lab bấm giờ và qua cửa review quy ước code',
  ] },
  'java-web-application-development': { tuan: 2, lamDuoc: [
    'Hiểu HTTP và viết Servlet, JSP, EL, JSTL',
    'Truy cập CSDL bằng JDBC + mẫu DAO, sau đó JPA',
    'Tổ chức ứng dụng theo MVC, dùng Filter và Listener',
    'Ghép front-end với back-end Java web',
  ] },
  'spring-boot': { tuan: 2.5, lamDuoc: [
    'Viết REST controller có validate dữ liệu',
    'Truy cập PostgreSQL bằng Spring Data JPA, migration bằng Flyway',
    'Bảo vệ API bằng Spring Security + JWT',
    'Test, đóng Docker, chạy CI và nối với frontend React',
  ] },
  'sba301-integrate-single-page-application-with-spring-boot': { tuan: 1, lamDuoc: [
    'Dựng SPA React gọi API Spring Boot REST',
    'Xử lý CORS và luồng đăng nhập JWT giữa hai bên',
    'Lưu dữ liệu bằng JPA và MongoDB',
  ] },
  // ── Tầng 6
  'react-native': { tuan: 3, lamDuoc: [
    'Dựng app điện thoại bằng React Native + Expo, điều hướng bằng Expo Router',
    'Gọi API, lưu dữ liệu cục bộ, dùng camera và quyền',
    'Gửi push notification',
    'Build và phát hành app bằng EAS',
  ] },
  'machine-learning': { tuan: 4, lamDuoc: [
    'Xử lý dữ liệu bằng numpy, pandas và quy trình scikit-learn',
    'Huấn luyện mô hình hồi quy, phân loại, cây quyết định và ensemble',
    'Phân cụm, giảm chiều và feature engineering',
    'Đánh giá mô hình đúng cách và chống overfitting',
  ] },
  'deep-learning': { tuan: 4, lamDuoc: [
    'Dùng tensor, autograd và tự viết vòng lặp huấn luyện PyTorch',
    'Xây CNN cho ảnh, attention và Transformer',
    'Huấn luyện trên GPU và fine-tune với Hugging Face',
    'Chạy model cục bộ và phục vụ nó qua API',
  ] },
  'background-jobs': { tuan: 1.5, lamDuoc: [
    'Đưa việc nặng ra hàng đợi BullMQ, thử lại và hàng đợi chết',
    'Làm việc idempotent — chạy hai lần vẫn đúng',
    'Lập lịch việc định kỳ, giới hạn tần suất, ưu tiên',
    'Dùng mẫu outbox và vận hành hàng đợi trên production',
  ] },
  'cloud-aws': { tuan: 3, lamDuoc: [
    'Cấp quyền bằng IAM và dựng mạng VPC',
    'Chạy app trên EC2, container và serverless',
    'Dùng S3 + CDN và cơ sở dữ liệu được quản lý',
    'Quan sát và kiểm soát chi phí AWS',
  ] },
  kubernetes: { tuan: 3, lamDuoc: [
    'Chạy app bằng Pod, Deployment, Service và Ingress',
    'Quản lý cấu hình, bí mật và ứng dụng có trạng thái',
    'Cấu hình health check, tài nguyên và tự co giãn',
    'Bảo mật, quan sát, gỡ lỗi cụm và dùng Kubernetes được quản lý',
  ] },
  // ── Học xen kẽ
  'ai-coding': { tuan: 1, lamDuoc: [
    'Làm việc với agent viết code mà vẫn kiểm soát được thay đổi',
    'Kiểm chứng code AI viết bằng test và đọc hiểu',
    'Dùng AI để học nhanh hơn thay vì chép đáp án',
  ] },
  'agile-teamwork': { tuan: 1, lamDuoc: [
    'Làm việc theo Scrum/Kanban: ticket, ước lượng, sprint',
    'Viết pull request dễ review và review code người khác',
    'Viết tài liệu kỹ thuật và giao tiếp với PM, QA, designer',
    'Sống sót 90 ngày đầu ở công ty',
  ] },
  'dsa-interview': { tuan: 4, lamDuoc: [
    'Giải các dạng bài mảng, băm, hai con trỏ, cửa sổ trượt',
    'Dùng cây, heap, đồ thị, quay lui và quy hoạch động',
    'Trình bày lời giải rõ ràng trong buổi phỏng vấn',
    'Theo lộ trình luyện 6 tuần có phỏng vấn thử',
  ] },
  'interview-prep': { tuan: 1.5, lamDuoc: [
    'Viết CV, LinkedIn và GitHub đúng kiểu nhà tuyển dụng IT đọc',
    'Kể câu chuyện dự án và trả lời phỏng vấn hành vi',
    'Chuẩn bị vòng kỹ thuật backend, frontend, DevOps',
    'Trả lời phỏng vấn bằng tiếng Anh và đàm phán offer',
  ] },
  // ── Ngoài tháp
  'content-creator': { tuan: 4, lamDuoc: [
    'Lên ý tưởng, viết kịch bản và quay video một mình',
    'Dựng bằng CapCut / DaVinci Resolve, chỉnh màu và âm thanh',
    'Làm thumbnail, tiêu đề và đọc số liệu kênh',
  ] },
  'self-hosting': { tuan: 3, lamDuoc: [
    'Chọn máy, cài Linux và ảo hoá bằng Proxmox/LXC',
    'Truy cập từ xa an toàn và reverse proxy cho nhiều dịch vụ',
    'Lưu trữ, sao lưu và vận hành home lab lâu dài',
  ] },
  'media-processing': { tuan: 1.5, lamDuoc: [
    'Xử lý ảnh bằng Sharp trong production',
    'Gọi FFmpeg từ Node để cắt, nén, chuẩn hoá âm thanh',
    'Dựng đường ống upload và phát video HLS',
  ] },
  // ── Chỉ có trong lộ trình nghề
  'math-for-ml': { tuan: 3, lamDuoc: [
    'Đọc ký hiệu toán trong tài liệu ML (Σ, ∂, ‖x‖, argmax) mà không sợ',
    'Dùng vector, ma trận, trị riêng, SVD và PCA bằng numpy',
    'Hiểu gradient, quy tắc chuỗi và vì sao backpropagation chạy được',
    'Dùng xác suất, ước lượng và entropy để đọc hàm mất mát',
  ] },
  'statistics-data-science': { tuan: 4, lamDuoc: [
    'Làm EDA và vẽ biểu đồ không nói dối',
    'Tính khoảng tin cậy, bootstrap và kiểm định giả thuyết cho đúng',
    'Thiết kế và đọc kết quả A/B test',
    'Suy luận nhân quả từ dữ liệu quan sát, dự báo chuỗi thời gian',
    'Trình bày kết luận bằng dữ liệu cho người không làm dữ liệu',
  ] },
  'mlops-llmops': { tuan: 4, lamDuoc: [
    'Tái lập thí nghiệm, theo dõi bằng MLflow và quản lý model trong registry',
    'Phục vụ model cổ điển và LLM (vLLM) trên production',
    'Dựng pipeline huấn luyện và fine-tune',
    'Giám sát drift, tracing và eval trực tuyến cho LLM',
  ] },
  'data-engineering': { tuan: 4, lamDuoc: [
    'Phân biệt OLTP/OLAP và mô hình hoá dữ liệu phân tích (star schema)',
    'Nạp dữ liệu batch, CDC và streaming',
    'Biến đổi bằng dbt, lưu trong ClickHouse',
    'Điều phối pipeline và kiểm chất lượng dữ liệu',
  ] },
  kafka: { tuan: 2.5, lamDuoc: [
    'Chạy cụm Kafka bằng Docker Compose, hiểu topic, partition, offset',
    'Viết producer/consumer bằng Spring Boot và Node.js',
    'Xử lý rebalance, trùng lặp, thứ tự và đạt exactly-once khi cần',
    'Đồng bộ CSDL bằng Kafka Connect + CDC và giám sát consumer lag',
  ] },
  'spark-lakehouse': { tuan: 4, lamDuoc: [
    'Hiểu Spark thực thi thế nào và viết DataFrame / Spark SQL',
    'Tối ưu job: partition, shuffle, join',
    'Dựng lakehouse trên Delta Lake / Apache Iceberg',
    'Điều phối bằng Airflow và xử lý luồng bằng Structured Streaming',
  ] },
  'networking-for-developers': { tuan: 2, lamDuoc: [
    'Giải thích một request đi qua DNS, TCP, TLS, HTTP như thế nào',
    'Hiểu IP, định tuyến, NAT — nền của VPC trên cloud',
    'Dùng CDN, cache, cân bằng tải và proxy',
    'Chẩn đoán lỗi mạng bằng công cụ thay vì đoán',
  ] },
  'infrastructure-as-code': { tuan: 2.5, lamDuoc: [
    'Viết hạ tầng bằng Terraform: biến, module, môi trường',
    'Quản lý state an toàn, import hạ tầng có sẵn và xử lý drift',
    'Cấu hình máy hàng loạt bằng Ansible, dựng image bằng Packer',
    'Đưa IaC vào CI/CD và GitOps',
  ] },
  'network-security': { tuan: 2.5, lamDuoc: [
    'Dựng tường lửa có trạng thái bằng nftables/ufw và phân vùng mạng',
    'Gia cố SSH, dựng VPN bằng WireGuard/Tailscale',
    'Áp dụng Zero Trust và mTLS giữa các dịch vụ',
    'Phát hiện xâm nhập bằng Suricata và bắt gói tin',
  ] },
  'cloud-container-security': { tuan: 2.5, lamDuoc: [
    'Siết IAM theo quyền tối thiểu, bảo vệ bucket và bí mật bằng KMS',
    'Bảo mật image, chuỗi cung ứng và runtime của container',
    'Bảo mật Kubernetes: control plane, workload, mạng, admission',
    'Phát hiện, phản ứng lúc chạy và đo tư thế bảo mật theo benchmark',
  ] },
  'cloud-architecture': { tuan: 4, lamDuoc: [
    'Chạy một buổi review theo sáu trụ cột Well-Architected',
    'Thiết kế landing zone nhiều tài khoản và mạng tầm doanh nghiệp',
    'Chọn chiến lược HA/DR theo RTO/RPO, kể cả đa vùng',
    'Tối ưu chi phí (FinOps), ánh xạ AWS–Azure–GCP và chuẩn bị SAA/SAP',
  ] },
  'software-architecture-and-design': { tuan: 3, lamDuoc: [
    'Đọc và vẽ các sơ đồ UML cốt lõi',
    'Mô hình hoá yêu cầu và phân tích theo COMET',
    'Chọn kiến trúc theo quality attributes và áp dụng Design Patterns GoF',
    'Thiết kế CSDL quan hệ và bảo vệ project SWD392 trước hội đồng',
  ] },
  'system-design': { tuan: 3, lamDuoc: [
    'Ước lượng tải, dung lượng và chi phí trước khi vẽ',
    'Mở rộng từ một máy chủ tới triệu người dùng',
    'Giải 8 case study kinh điển: rút gọn link, rate limiter, feed, chat, thanh toán…',
    'Viết design doc và bảo vệ nó trong review',
  ] },
  'distributed-systems': { tuan: 4, lamDuoc: [
    'Lý luận về lỗi, timeout và đồng hồ trong hệ nhiều máy',
    'Hiểu nhân bản, phân mảnh, CAP/PACELC và các mô hình nhất quán',
    'Hiểu đồng thuận (Raft), khoá, lease và bầu leader',
    'Tự viết kho khoá-giá trị nhân bản bằng Raft',
  ] },
  'software-architecture': { tuan: 4, lamDuoc: [
    'Ghi lại kiến trúc bằng C4, ADR, arc42 và bảo vệ đánh đổi',
    'Chọn giữa nguyên khối, modular monolith và phân tán có lý do',
    'Áp dụng clean/hexagonal và Domain-Driven Design chiến lược + chiến thuật',
    'Giữ nhất quán giữa dịch vụ bằng saga, outbox, CQRS, event sourcing',
    'Đánh giá kiến trúc bằng ATAM rút gọn và fitness function',
  ] },
  'applied-cryptography': { tuan: 3, lamDuoc: [
    'Dùng đúng hàm băm, HMAC và dẫn xuất khoá',
    'Mã hoá đối xứng AEAD, khoá công khai và chữ ký số',
    'Hiểu PKI, TLS 1.3 và JWT qua lăng kính mật mã',
    'Quản lý khoá và tránh các kiểu dùng sai mật mã kinh điển',
  ] },
  'blockchain-fundamentals': { tuan: 3, lamDuoc: [
    'Giải thích Bitcoin từ bên trong: giao dịch, khối, đào',
    'Hiểu đồng thuận, mạng ngang hàng, Ethereum và EVM',
    'Hiểu token, layer 2, rollup và zero-knowledge',
    'Nhận ra lừa đảo và bức tranh pháp lý của crypto',
  ] },
  'smart-contracts-solidity': { tuan: 4, lamDuoc: [
    'Viết hợp đồng Solidity và kiểm thử bằng Foundry',
    'Dùng chuẩn token với OpenZeppelin, tối ưu gas',
    'Nhận ra lỗ hổng kinh điển và dùng công cụ audit',
    'Dựng dApp full-stack và triển khai lên testnet',
  ] },
};
