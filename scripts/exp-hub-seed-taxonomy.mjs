/**
 * exp-hub-seed-taxonomy.mjs — dựng sẵn "khung xương" danh mục cho EXP_Hub.
 * ─────────────────────────────────────────────────────────────────────────────
 * Tạo cây danh mục 2 tầng chuyên nghiệp: nhóm lớn (Backend / Frontend /
 * Database / DevOps / Linux / Mobile / Tools / AI) → công nghệ con
 * (Node.js, Java, PostgreSQL, MongoDB, Ubuntu, Terminal, …), kèm icon (Lucide),
 * màu accent, mô tả ngắn tiếng Việt, và link tài liệu chính thức (docsUrl).
 *
 * IDEMPOTENT — khớp theo `slug`:
 *   • Danh mục CHƯA có  → tạo mới (parentId + sortOrder + metadata).
 *   • Danh mục ĐÃ có    → BỎ QUA (không đụng, giữ nguyên chỉnh sửa của bạn),
 *                          trừ khi chạy với --update-meta.
 *
 * Chạy được nhiều lần an toàn. Bạn tự thêm/sửa/xoá trong /admin/exp-hub sau.
 *
 *   # xem trước, KHÔNG ghi (mặc định):
 *   node scripts/exp-hub-seed-taxonomy.mjs
 *   # ghi thật:
 *   node scripts/exp-hub-seed-taxonomy.mjs --apply
 *   # ghi thật + cập nhật icon/màu/mô tả/docs cho cả danh mục đã tồn tại:
 *   node scripts/exp-hub-seed-taxonomy.mjs --apply --update-meta
 *
 * Trên VPS chạy trong container (DATABASE_URL có sẵn trong env container):
 *   docker exec cuonghoangdev_backend node scripts/exp-hub-seed-taxonomy.mjs --apply
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const UPDATE_META = args.includes('--update-meta');

// slugify — PHẢI khớp hệt slugify() trong src/services/snippets.service.ts
// để slug seed trùng với slug do admin UI sinh ra.
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Cây taxonomy đề xuất (bạn sửa thoải mái sau) ───────────────────────────
// Mỗi node: { name, description?, icon?, color?, docsUrl?, children? }
// icon = tên icon Lucide (frontend map ra component). color = hex accent.
const TREE = [
  {
    name: 'Backend', icon: 'Server', color: '#10b981',
    description: 'Máy chủ, API, xử lý nghiệp vụ và dữ liệu phía sau.',
    children: [
      { name: 'Node.js', color: '#339933', docsUrl: 'https://nodejs.org/en/docs', description: 'Runtime JavaScript phía server.' },
      { name: 'Express', color: '#259dff', docsUrl: 'https://expressjs.com/' },
      { name: 'NestJS', color: '#e0234e', docsUrl: 'https://docs.nestjs.com/' },
      { name: 'Java Core', color: '#ed8b00', docsUrl: 'https://docs.oracle.com/en/java/', description: 'Nền tảng ngôn ngữ Java: OOP, Collections, đa luồng.' },
      { name: 'Spring Boot', color: '#6db33f', docsUrl: 'https://docs.spring.io/spring-boot/', description: 'Framework Java xây REST API nhanh, cấu hình tối thiểu.' },
      { name: 'Python (Backend)', color: '#3776ab', docsUrl: 'https://docs.python.org/3/' },
      { name: 'Django / FastAPI', color: '#092e20', docsUrl: 'https://fastapi.tiangolo.com/' },
      { name: 'PHP / Laravel', color: '#777bb4', docsUrl: 'https://laravel.com/docs' },
      { name: 'Go', color: '#00add8', docsUrl: 'https://go.dev/doc/' },
      { name: '.NET / C#', color: '#512bd4', docsUrl: 'https://learn.microsoft.com/dotnet/' },
      { name: 'REST API Design', color: '#10b981', description: 'Quy ước tài nguyên, status code, versioning, phân trang.' },
      { name: 'GraphQL', color: '#e10098', docsUrl: 'https://graphql.org/learn/' },
      { name: 'Auth & JWT', color: '#f97316', description: 'Xác thực, phân quyền, JWT, OAuth, refresh token.' },
      { name: 'WebSocket / Socket.IO', color: '#010101', docsUrl: 'https://socket.io/docs/' },
      { name: 'Message Queue (Redis/RabbitMQ/Kafka)', color: '#ff6600' },
      { name: 'Rust (Actix / Axum)', color: '#dea584', docsUrl: 'https://actix.rs/', description: 'Backend hiệu năng cao, an toàn bộ nhớ.' },
      { name: 'Ruby on Rails', color: '#cc0000', docsUrl: 'https://guides.rubyonrails.org/' },
      { name: 'gRPC', color: '#244c5a', docsUrl: 'https://grpc.io/docs/', description: 'RPC nhị phân hiệu năng cao, dùng Protobuf.' },
      { name: 'Microservices', color: '#10b981', description: 'Kiến trúc dịch vụ nhỏ, giao tiếp, service discovery.' },
      { name: 'Serverless (Lambda / Functions)', color: '#fd5750' },
    ],
  },
  {
    name: 'Frontend', icon: 'LayoutDashboard', color: '#3b82f6',
    description: 'Giao diện người dùng chạy trên trình duyệt.',
    children: [
      { name: 'HTML & CSS', color: '#e34f26', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web' },
      { name: 'JavaScript', color: '#f7df1e', docsUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { name: 'TypeScript', color: '#3178c6', docsUrl: 'https://www.typescriptlang.org/docs/' },
      { name: 'React', color: '#61dafb', docsUrl: 'https://react.dev/' },
      { name: 'Next.js', color: '#000000', docsUrl: 'https://nextjs.org/docs' },
      { name: 'Vue', color: '#4fc08d', docsUrl: 'https://vuejs.org/guide/' },
      { name: 'Angular', color: '#dd0031', docsUrl: 'https://angular.dev/' },
      { name: 'Svelte', color: '#ff3e00', docsUrl: 'https://svelte.dev/docs' },
      { name: 'TailwindCSS', color: '#06b6d4', docsUrl: 'https://tailwindcss.com/docs' },
      { name: 'State (Redux / Zustand)', color: '#764abc' },
      { name: 'Build Tools (Vite / Webpack)', color: '#646cff', docsUrl: 'https://vitejs.dev/' },
      { name: 'Testing (Jest / Playwright)', color: '#c21325' },
      { name: 'Sass / SCSS', color: '#cc6699', docsUrl: 'https://sass-lang.com/documentation/' },
      { name: 'TanStack Query (React Query)', color: '#ff4154', docsUrl: 'https://tanstack.com/query/latest' },
      { name: 'Nuxt', color: '#00dc82', docsUrl: 'https://nuxt.com/docs' },
      { name: 'Astro', color: '#ff5d01', docsUrl: 'https://docs.astro.build/' },
      { name: 'Framer Motion', color: '#0055ff', docsUrl: 'https://www.framer.com/motion/', description: 'Thư viện animation cho React.' },
    ],
  },
  {
    name: 'Database', icon: 'Database', color: '#f59e0b',
    description: 'Lưu trữ, truy vấn và mô hình hoá dữ liệu.',
    children: [
      { name: 'PostgreSQL', color: '#336791', docsUrl: 'https://www.postgresql.org/docs/', description: 'CSDL quan hệ mã nguồn mở mạnh nhất.' },
      { name: 'MySQL', color: '#4479a1', docsUrl: 'https://dev.mysql.com/doc/' },
      { name: 'SQL Server', color: '#cc2927', docsUrl: 'https://learn.microsoft.com/sql/sql-server/' },
      { name: 'MongoDB', color: '#47a248', docsUrl: 'https://www.mongodb.com/docs/', description: 'CSDL tài liệu NoSQL.' },
      { name: 'Redis', color: '#dc382d', docsUrl: 'https://redis.io/docs/' },
      { name: 'SQLite', color: '#003b57', docsUrl: 'https://www.sqlite.org/docs.html' },
      { name: 'Prisma ORM', color: '#2d3748', docsUrl: 'https://www.prisma.io/docs' },
      { name: 'TypeORM', color: '#fe0803', docsUrl: 'https://typeorm.io/' },
      { name: 'SQL Cheatsheet', color: '#f59e0b', description: 'Câu lệnh SQL hay dùng: JOIN, index, transaction.' },
      { name: 'Supabase', color: '#3ecf8e', docsUrl: 'https://supabase.com/docs', description: 'Postgres + Auth + Storage + Realtime.' },
      { name: 'Firebase', color: '#ffca28', docsUrl: 'https://firebase.google.com/docs' },
      { name: 'Elasticsearch', color: '#005571', docsUrl: 'https://www.elastic.co/guide/', description: 'Tìm kiếm & phân tích full-text.' },
      { name: 'Drizzle ORM', color: '#c5f74f', docsUrl: 'https://orm.drizzle.team/docs/overview' },
      { name: 'DB Design & Indexing', color: '#f59e0b', description: 'Chuẩn hoá, khoá, index, tối ưu truy vấn, EXPLAIN.' },
    ],
  },
  {
    name: 'DevOps & Cloud', icon: 'Container', color: '#06b6d4',
    description: 'Đóng gói, triển khai, hạ tầng và tự động hoá.',
    children: [
      { name: 'Docker', color: '#2496ed', docsUrl: 'https://docs.docker.com/', description: 'Đóng gói ứng dụng vào container.' },
      { name: 'Docker Compose', color: '#2496ed', docsUrl: 'https://docs.docker.com/compose/' },
      { name: 'Kubernetes', color: '#326ce5', docsUrl: 'https://kubernetes.io/docs/' },
      { name: 'CI/CD (GitHub Actions)', color: '#2088ff', docsUrl: 'https://docs.github.com/actions' },
      { name: 'Nginx', color: '#009639', docsUrl: 'https://nginx.org/en/docs/' },
      { name: 'Cloudflare', color: '#f38020', docsUrl: 'https://developers.cloudflare.com/' },
      { name: 'AWS', color: '#ff9900', docsUrl: 'https://docs.aws.amazon.com/' },
      { name: 'Terraform', color: '#7b42bc', docsUrl: 'https://developer.hashicorp.com/terraform/docs' },
      { name: 'Monitoring & Logging', color: '#06b6d4' },
      { name: 'Google Cloud (GCP)', color: '#4285f4', docsUrl: 'https://cloud.google.com/docs' },
      { name: 'Microsoft Azure', color: '#0078d4', docsUrl: 'https://learn.microsoft.com/azure/' },
      { name: 'Vercel', color: '#111111', docsUrl: 'https://vercel.com/docs', description: 'Deploy frontend/Next.js, edge functions.' },
      { name: 'Prometheus / Grafana', color: '#e6522c', docsUrl: 'https://prometheus.io/docs/', description: 'Thu thập metric + dashboard giám sát.' },
      { name: 'Ansible', color: '#ee0000', docsUrl: 'https://docs.ansible.com/' },
    ],
  },
  {
    name: 'Linux & Terminal', icon: 'TerminalSquare', color: '#a855f7',
    description: 'Hệ điều hành máy chủ, dòng lệnh và công cụ CLI.',
    children: [
      { name: 'Ubuntu Linux', color: '#e95420', docsUrl: 'https://ubuntu.com/server/docs', description: 'Bản phân phối Linux phổ biến nhất cho server.' },
      { name: 'Fedora Linux', color: '#51a2da', docsUrl: 'https://docs.fedoraproject.org/' },
      { name: 'Debian', color: '#a81d33', docsUrl: 'https://www.debian.org/doc/' },
      { name: 'CentOS / RHEL', color: '#ee0000', docsUrl: 'https://access.redhat.com/documentation/' },
      { name: 'Bash / Zsh', color: '#4eaa25', description: 'Shell scripting, alias, ống lệnh, biến môi trường.' },
      { name: 'Terminal macOS', color: '#999999' },
      { name: 'Windows (PowerShell / WSL)', color: '#012456', docsUrl: 'https://learn.microsoft.com/powershell/' },
      { name: 'Vim / Neovim', color: '#019733', docsUrl: 'https://neovim.io/doc/' },
      { name: 'SSH', color: '#a855f7', description: 'Kết nối, khoá SSH, tunnel, cấu hình ~/.ssh/config.' },
      { name: 'tmux', color: '#1bb91f' },
      { name: 'systemd / services', color: '#30d475' },
      { name: 'Arch Linux', color: '#1793d1', docsUrl: 'https://wiki.archlinux.org/' },
      { name: 'Alpine Linux', color: '#0d597f', docsUrl: 'https://wiki.alpinelinux.org/', description: 'Nhẹ, hay dùng trong Docker image.' },
      { name: 'cron & scheduling', color: '#a855f7', description: 'Lập lịch tác vụ: crontab, systemd timer.' },
      { name: 'Package Managers (apt/dnf/pacman/brew)', color: '#a855f7' },
      { name: 'grep / sed / awk / find', color: '#4eaa25', description: 'Bộ công cụ xử lý văn bản & tìm kiếm CLI.' },
    ],
  },
  {
    name: 'Mobile', icon: 'Smartphone', color: '#ec4899',
    description: 'Ứng dụng di động iOS / Android.',
    children: [
      { name: 'Flutter', color: '#02569b', docsUrl: 'https://docs.flutter.dev/' },
      { name: 'React Native', color: '#61dafb', docsUrl: 'https://reactnative.dev/docs/getting-started' },
      { name: 'Android (Kotlin)', color: '#3ddc84', docsUrl: 'https://developer.android.com/docs' },
      { name: 'iOS (Swift / SwiftUI)', color: '#fa7343', docsUrl: 'https://developer.apple.com/documentation/' },
      { name: 'Expo', color: '#000020', docsUrl: 'https://docs.expo.dev/', description: 'Framework & tooling cho React Native.' },
      { name: 'Jetpack Compose', color: '#4285f4', docsUrl: 'https://developer.android.com/jetpack/compose', description: 'UI khai báo cho Android.' },
      { name: 'Ionic / Capacitor', color: '#3880ff', docsUrl: 'https://ionicframework.com/docs' },
    ],
  },
  {
    name: 'Tools & Workflow', icon: 'Wrench', color: '#64748b',
    description: 'Công cụ lập trình hằng ngày và quy trình làm việc.',
    children: [
      { name: 'Git & GitHub', color: '#f05032', docsUrl: 'https://git-scm.com/doc', description: 'Quản lý phiên bản, branch, merge, rebase, PR.' },
      { name: 'VS Code', color: '#007acc', docsUrl: 'https://code.visualstudio.com/docs' },
      { name: 'Postman', color: '#ff6c37', docsUrl: 'https://learning.postman.com/docs/' },
      { name: 'Regex', color: '#64748b', description: 'Biểu thức chính quy — mẫu hay dùng.' },
      { name: 'npm / yarn / pnpm', color: '#cb3837', docsUrl: 'https://docs.npmjs.com/' },
      { name: 'Env & Config (.env)', color: '#ecd53f' },
      { name: 'Makefile', color: '#427819' },
      { name: 'curl / HTTPie', color: '#073551', description: 'Gọi HTTP từ terminal, test API.' },
      { name: 'jq (JSON CLI)', color: '#40b3e0', docsUrl: 'https://jqlang.github.io/jq/', description: 'Truy vấn & biến đổi JSON trên dòng lệnh.' },
      { name: 'SSH keys & GPG', color: '#64748b', description: 'Tạo/khoá SSH, ký commit GPG.' },
      { name: 'Cursor / AI editors', color: '#64748b', docsUrl: 'https://cursor.com/', description: 'Editor tích hợp AI.' },
      { name: 'Insomnia', color: '#5849be', docsUrl: 'https://docs.insomnia.rest/' },
    ],
  },
  {
    name: 'AI & Data', icon: 'Brain', color: '#8b5cf6',
    description: 'Trí tuệ nhân tạo, LLM và xử lý dữ liệu.',
    children: [
      { name: 'Python Data (pandas / numpy)', color: '#150458', docsUrl: 'https://pandas.pydata.org/docs/' },
      { name: 'LLM API (OpenAI / Claude)', color: '#8b5cf6', docsUrl: 'https://docs.anthropic.com/' },
      { name: 'Prompt Engineering', color: '#a78bfa' },
      { name: 'LangChain', color: '#1c3c3c', docsUrl: 'https://python.langchain.com/docs/' },
      { name: 'Jupyter Notebook', color: '#f37626', docsUrl: 'https://docs.jupyter.org/' },
      { name: 'Vector DB (pgvector / Pinecone / Chroma)', color: '#8b5cf6', description: 'Lưu embedding cho tìm kiếm ngữ nghĩa.' },
      { name: 'RAG (Retrieval-Augmented Generation)', color: '#a78bfa', description: 'Nạp tài liệu → chunk → embed → truy hồi cho LLM.' },
      { name: 'PyTorch / TensorFlow', color: '#ee4c2c', docsUrl: 'https://pytorch.org/docs/' },
      { name: 'scikit-learn', color: '#f7931e', docsUrl: 'https://scikit-learn.org/stable/' },
    ],
  },
  {
    name: 'AI Models', icon: 'Sparkles', color: '#d946ef',
    description: 'Các mô hình AI (Claude, GPT, Gemini, Llama…): cách cài, chạy, API & mẹo dùng.',
    children: [
      { name: 'Claude (Anthropic)', color: '#d97757', docsUrl: 'https://docs.anthropic.com/', description: 'Họ mô hình Claude: API, prompt, context, tool use, Claude Code.' },
      { name: 'ChatGPT / GPT (OpenAI)', color: '#10a37f', docsUrl: 'https://platform.openai.com/docs', description: 'GPT-4o / o-series: API, function calling, Assistants.' },
      { name: 'Gemini (Google)', color: '#4285f4', docsUrl: 'https://ai.google.dev/docs', description: 'Gemini API, multimodal, Google AI Studio.' },
      { name: 'Llama (Meta)', color: '#0866ff', docsUrl: 'https://www.llama.com/docs/', description: 'Mô hình mở, chạy local qua Ollama / llama.cpp.' },
      { name: 'Mistral', color: '#fa520f', docsUrl: 'https://docs.mistral.ai/', description: 'Mô hình mở gọn nhẹ, hiệu năng cao.' },
      { name: 'DeepSeek', color: '#4d6bfe', docsUrl: 'https://api-docs.deepseek.com/', description: 'Mạnh về code & reasoning, chi phí thấp.' },
      { name: 'Grok (xAI)', color: '#111111', docsUrl: 'https://docs.x.ai/', description: 'Model của xAI, API tương thích OpenAI.' },
      { name: 'Qwen (Alibaba)', color: '#615ced', docsUrl: 'https://qwen.readthedocs.io/', description: 'Họ Qwen mở, đa ngôn ngữ.' },
      { name: 'Ollama (chạy model local)', color: '#111111', docsUrl: 'https://github.com/ollama/ollama', description: 'Tải & chạy LLM ngay trên máy: `ollama run llama3`.' },
      { name: 'Hugging Face', color: '#ffd21e', docsUrl: 'https://huggingface.co/docs', description: 'Kho model/dataset + transformers, inference API.' },
      { name: 'AI Coding (Cursor / Copilot / Claude Code)', color: '#8b5cf6', description: 'Công cụ lập trình có AI: cài đặt, cấu hình, mẹo dùng.' },
    ],
  },
  {
    name: 'Networking', icon: 'Network', color: '#0ea5e9',
    description: 'Mạng máy tính: giao thức, DNS, cân bằng tải, tầng vận chuyển.',
    children: [
      { name: 'HTTP / HTTPS', color: '#0ea5e9', description: 'Method, status code, header, cookie, cache, CORS.' },
      { name: 'TCP/IP & OSI Model', color: '#0369a1', description: '7 tầng, TCP vs UDP, 3-way handshake.' },
      { name: 'DNS', color: '#f59e0b', description: 'Phân giải tên miền, record A/CNAME/MX, TTL.' },
      { name: 'Load Balancing & Reverse Proxy', color: '#009639', description: 'Nginx/HAProxy, round-robin, sticky session.' },
      { name: 'CDN', color: '#f38020', description: 'Cache biên, phân phối nội dung.' },
      { name: 'WebSocket & Realtime', color: '#010101' },
      { name: 'TLS / SSL', color: '#0369a1', description: 'Chứng chỉ, handshake, Let’s Encrypt.' },
      { name: 'VPN & Firewall', color: '#0ea5e9' },
    ],
  },
  {
    name: 'Testing & QA', icon: 'FlaskConical', color: '#22c55e',
    description: 'Kiểm thử phần mềm: unit, integration, e2e, tự động & thủ công.',
    children: [
      { name: 'Unit Testing', color: '#22c55e', description: 'Kiểm thử đơn vị, mock, coverage.' },
      { name: 'Integration Testing', color: '#16a34a' },
      { name: 'E2E (Playwright / Cypress)', color: '#2ead33', docsUrl: 'https://playwright.dev/' },
      { name: 'Jest / Vitest', color: '#c21325', docsUrl: 'https://jestjs.io/' },
      { name: 'JUnit (Java)', color: '#25a162', docsUrl: 'https://junit.org/junit5/' },
      { name: 'pytest (Python)', color: '#0a9edc', docsUrl: 'https://docs.pytest.org/' },
      { name: 'Selenium', color: '#43b02a', docsUrl: 'https://www.selenium.dev/documentation/' },
      { name: 'API Testing (Postman / Newman)', color: '#ff6c37' },
      { name: 'Manual QA & Test Cases', color: '#22c55e', description: 'Viết test case, bug report, quy trình QA.' },
      { name: 'TDD / BDD', color: '#16a34a' },
    ],
  },
  {
    name: 'Game Dev & 3D', icon: 'Gamepad2', color: '#f43f5e',
    description: 'Làm game & đồ hoạ 3D: engine, mô hình hoá, animation.',
    children: [
      { name: 'Unity', color: '#000000', docsUrl: 'https://docs.unity.com/', description: 'Game engine C#, 2D/3D, đa nền tảng.' },
      { name: 'Unreal Engine', color: '#0e1128', docsUrl: 'https://dev.epicgames.com/documentation/', description: 'Engine C++/Blueprint, đồ hoạ cao.' },
      { name: 'Godot', color: '#478cbf', docsUrl: 'https://docs.godotengine.org/', description: 'Engine mã nguồn mở, GDScript.' },
      { name: 'Blender', color: '#e87d0d', docsUrl: 'https://docs.blender.org/', description: 'Mô hình hoá, dựng hình, animation 3D miễn phí.' },
      { name: 'Rive', color: '#1d1d1d', docsUrl: 'https://rive.app/', description: 'Animation vector tương tác cho web/app.' },
      { name: 'Three.js / WebGL', color: '#049ef4', docsUrl: 'https://threejs.org/docs/', description: '3D trên trình duyệt.' },
      { name: 'Phaser (2D web game)', color: '#8cc63f', docsUrl: 'https://phaser.io/' },
      { name: 'Game Physics & Math', color: '#f43f5e' },
    ],
  },
  {
    name: 'Security', icon: 'ShieldCheck', color: '#ef4444',
    description: 'Bảo mật ứng dụng & hệ thống: xác thực, mã hoá, lỗ hổng.',
    children: [
      { name: 'OWASP Top 10', color: '#ef4444', docsUrl: 'https://owasp.org/www-project-top-ten/', description: '10 rủi ro bảo mật web phổ biến nhất.' },
      { name: 'Auth: OAuth 2.0 / JWT / OIDC', color: '#f97316', description: 'Xác thực, phân quyền, refresh token.' },
      { name: 'Encryption & Hashing', color: '#dc2626', description: 'AES/RSA, bcrypt/argon2, ký số.' },
      { name: 'XSS / CSRF / SQL Injection', color: '#b91c1c', description: 'Lỗ hổng web thường gặp & cách chống.' },
      { name: 'Secrets Management', color: '#ef4444', description: 'Vault, biến môi trường, không hardcode key.' },
      { name: 'Pentesting cơ bản', color: '#7f1d1d' },
      { name: 'Rate Limiting & DDoS', color: '#f97316' },
    ],
  },
  {
    name: 'Data Engineering', icon: 'Database', color: '#0891b2',
    description: 'Kỹ thuật dữ liệu: ETL, pipeline, big data, kho dữ liệu.',
    children: [
      { name: 'ETL / ELT', color: '#0891b2', description: 'Trích xuất — biến đổi — nạp dữ liệu.' },
      { name: 'Apache Spark', color: '#e25a1c', docsUrl: 'https://spark.apache.org/docs/latest/' },
      { name: 'Apache Airflow', color: '#017cee', docsUrl: 'https://airflow.apache.org/docs/', description: 'Điều phối pipeline dữ liệu (DAG).' },
      { name: 'dbt', color: '#ff694b', docsUrl: 'https://docs.getdbt.com/', description: 'Transform dữ liệu trong warehouse bằng SQL.' },
      { name: 'Data Warehouse (BigQuery / Snowflake)', color: '#0891b2' },
      { name: 'Kafka Streaming', color: '#231f20', docsUrl: 'https://kafka.apache.org/documentation/' },
    ],
  },
];

let created = 0;
let skipped = 0;
let updated = 0;

async function upsertNode(node, parentId, sortOrder, depth = 0) {
  const slug = slugify(node.name);
  const meta = {
    description: node.description ?? null,
    icon: node.icon ?? null,
    color: node.color ?? null,
    docsUrl: node.docsUrl ?? null,
  };
  const existing = await prisma.snippetCategory.findUnique({ where: { slug } });

  let id;
  if (existing) {
    id = existing.id;
    if (UPDATE_META) {
      if (APPLY) {
        await prisma.snippetCategory.update({ where: { id }, data: meta });
      }
      updated++;
      console.log(`  ~ cập nhật meta: ${node.name} (#${id})`);
    } else {
      skipped++;
      console.log(`  = bỏ qua (đã có): ${node.name} (#${id})`);
    }
  } else {
    created++;
    if (APPLY) {
      const row = await prisma.snippetCategory.create({
        data: { name: node.name, slug, parentId: parentId ?? null, sortOrder, ...meta },
      });
      id = row.id;
    } else {
      id = null; // dry-run: không có id thật cho con
    }
    console.log(`  + tạo mới: ${'  '.repeat(depth)}${node.name}${depth === 0 ? '  [nhóm lớn]' : ''}`);
  }

  if (node.children?.length) {
    for (let i = 0; i < node.children.length; i++) {
      await upsertNode(node.children[i], id, i, depth + 1);
    }
  }
}

async function main() {
  console.log(APPLY
    ? `\n▶ GHI THẬT vào DB${UPDATE_META ? ' (+ cập nhật meta danh mục đã tồn tại)' : ''}\n`
    : '\n▶ XEM TRƯỚC (dry-run) — không ghi gì. Thêm --apply để ghi thật.\n');

  for (let i = 0; i < TREE.length; i++) {
    await upsertNode(TREE[i], null, i);
  }

  const totalTech = TREE.reduce((n, g) => n + (g.children?.length ?? 0), 0);
  console.log(`\n── Tổng kết ──`);
  console.log(`Nhóm lớn: ${TREE.length} · Công nghệ con: ${totalTech}`);
  console.log(`Tạo mới: ${created} · Bỏ qua (đã có): ${skipped} · Cập nhật meta: ${updated}`);
  if (!APPLY) console.log(`\n(Chưa ghi gì. Chạy lại với --apply để tạo thật.)`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
