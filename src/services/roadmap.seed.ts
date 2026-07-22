/**
 * Seed content for the flagship roadmaps (Role- and Skill-based).
 * Hand-authored, roadmap.sh-inspired — with plenty of alternative branches.
 * `link` deep-links a node:
 *   { type: 'code-lab', ref: '<trackSlug>' }  → /code-lab/<slug>
 *   { type: 'roadmap',  ref: '<roadmapSlug>' } → /roadmap/<slug>
 *   { type: 'external', ref: '<url>' }         → opens the URL
 * `kind`: 'primary' (main path) | 'alternative' (branch) | 'info' (concept, no lesson).
 */
export type SeedLink = { type: 'code-lab' | 'roadmap' | 'external'; ref: string };
export interface SeedNode {
  title: string; subtitle?: string; kind?: 'primary' | 'alternative' | 'info';
  side?: 'center' | 'left' | 'right'; icon?: string; description?: string; link?: SeedLink;
}
export interface SeedStage { label: string; nodes: SeedNode[]; }
export interface SeedRoadmap {
  slug: string; title: string; type: 'role' | 'skill'; icon: string; color: string; description: string; stages: SeedStage[];
}

const cl = (ref: string): SeedLink => ({ type: 'code-lab', ref });
const ext = (ref: string): SeedLink => ({ type: 'external', ref });
const algos: SeedLink = { type: 'external', ref: '/algorithms' };

export const ROADMAP_SEED: SeedRoadmap[] = [
  // ─────────────────────────────── FRONTEND ───────────────────────────────
  {
    slug: 'frontend', title: 'Frontend', type: 'role', icon: 'Monitor', color: '#6366f1',
    description: 'Lộ trình đầy đủ để trở thành lập trình viên Frontend — từ nền tảng web đến framework hiện đại, kiểm thử và tối ưu hiệu năng.',
    stages: [
      { label: 'Nền tảng Web', nodes: [
        { title: 'Internet & cách web hoạt động', kind: 'info', description: 'HTTP/HTTPS, DNS, trình duyệt render trang, mô hình client–server, cách một URL trở thành trang web.', link: ext('https://roadmap.sh/guides/what-is-internet') },
        { title: 'HTML', subtitle: 'Cấu trúc trang', icon: 'FileCode', side: 'left', description: 'Thẻ ngữ nghĩa, form & input, bảng, accessibility cơ bản, meta/SEO on-page.', link: cl('html-css') },
        { title: 'CSS', subtitle: 'Trình bày & layout', icon: 'Palette', side: 'right', description: 'Box model, Flexbox, Grid, responsive, biến CSS, transition & animation.', link: cl('html-css') },
        { title: 'Responsive & Mobile-first', kind: 'info', side: 'left', description: 'Media query, breakpoint, đơn vị rem/vw, thiết kế từ nhỏ đến lớn.' },
        { title: 'Sass/SCSS', kind: 'alternative', side: 'right', description: 'CSS có biến, nesting, mixin — tổ chức style lớn dễ hơn.', link: ext('https://sass-lang.com/documentation/') },
      ]},
      { label: 'JavaScript', nodes: [
        { title: 'JavaScript cơ bản', subtitle: 'Ngôn ngữ của web', icon: 'Braces', description: 'Biến, kiểu, hàm, mảng/đối tượng, vòng lặp, ES modules.', link: cl('javascript') },
        { title: 'DOM & sự kiện', kind: 'info', side: 'left', description: 'Truy vấn/chỉnh DOM, event listener, event delegation.' },
        { title: 'Bất đồng bộ & Fetch API', kind: 'info', side: 'right', description: 'Promise, async/await, gọi API, xử lý JSON & lỗi mạng.' },
        { title: 'TypeScript', subtitle: 'JS có kiểu', icon: 'Braces', kind: 'alternative', side: 'left', description: 'Kiểu tĩnh, interface, generic — bắt lỗi sớm, dự án lớn dễ bảo trì.', link: cl('typescript') },
      ]},
      { label: 'Công cụ nghề', nodes: [
        { title: 'Git & GitHub', icon: 'GitBranch', description: 'Version control, branch, merge, pull request — bắt buộc.', link: cl('git') },
        { title: 'npm & bundler', kind: 'info', side: 'right', description: 'Quản lý thư viện, script, Vite/webpack, tree-shaking.' },
        { title: 'Tailwind CSS', icon: 'Wind', kind: 'alternative', side: 'left', description: 'Utility-first — dựng UI nhanh, nhất quán, dễ theme.', link: cl('tailwind-css') },
        { title: 'DevTools trình duyệt', kind: 'info', side: 'right', description: 'Inspect, Network, Performance, debug — kỹ năng sống còn.' },
      ]},
      { label: 'Framework (chọn 1)', nodes: [
        { title: 'React', subtitle: 'Phổ biến nhất', icon: 'Atom', description: 'Component, hook, state, JSX — hệ sinh thái lớn nhất.', link: cl('react') },
        { title: 'Vue', icon: 'Atom', kind: 'alternative', side: 'left', description: 'Nhẹ, dễ học, reactivity trực quan.', link: cl('vue') },
        { title: 'Angular', icon: 'Atom', kind: 'alternative', side: 'right', description: 'Framework đầy đủ, TypeScript-first, hợp dự án lớn.', link: cl('angular') },
        { title: 'Quản lý state', kind: 'info', description: 'Context, Zustand, Redux/Pinia — khi app phình to.' },
      ]},
      { label: 'Chất lượng & Kiểm thử', nodes: [
        { title: 'Testing', kind: 'info', description: 'Unit (Jest/Vitest), component (Testing Library), E2E (Playwright).' },
        { title: 'Accessibility (a11y)', kind: 'info', side: 'right', description: 'ARIA, keyboard nav, contrast — web cho mọi người.' },
        { title: 'Data Structures & Algorithms', icon: 'Binary', side: 'left', description: 'Tư duy giải thuật — luyện trực quan tại trang Algorithms.', link: algos },
      ]},
      { label: 'Nâng cao & Production', nodes: [
        { title: 'Next.js', subtitle: 'React + SSR/SEO', icon: 'Layers', description: 'SSR/SSG, App Router, API routes, tối ưu SEO & ảnh.', link: cl('nextjs') },
        { title: 'Web Performance', kind: 'info', side: 'right', description: 'Core Web Vitals, lazy-load, code-splitting, caching.', link: ext('https://web.dev/learn/performance') },
        { title: 'PWA & offline', kind: 'alternative', side: 'left', description: 'Service worker, cache, cài như app.' },
        { title: 'React Native', subtitle: 'Sang mobile', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React để làm app iOS/Android.', link: cl('react-native') },
        { title: 'Tiếp: Backend', kind: 'alternative', side: 'left', description: 'Muốn full-stack? Xem lộ trình Backend.', link: { type: 'roadmap', ref: 'backend' } },
      ]},
    ],
  },

  // ─────────────────────────────── BACKEND ───────────────────────────────
  {
    slug: 'backend', title: 'Backend', type: 'role', icon: 'Server', color: '#10b981',
    description: 'Lộ trình lập trình viên Backend — ngôn ngữ, API, cơ sở dữ liệu, xác thực, bảo mật, caching và triển khai.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Internet & HTTP', kind: 'info', description: 'Request/response, method, status code, header, cookie, CORS.', link: ext('https://developer.mozilla.org/docs/Web/HTTP') },
        { title: 'Terminal & Git', icon: 'GitBranch', side: 'right', description: 'Dòng lệnh, version control — nền của mọi backend.', link: cl('git') },
      ]},
      { label: 'Ngôn ngữ (chọn 1)', nodes: [
        { title: 'Node.js', subtitle: 'JavaScript phía server', icon: 'Hexagon', side: 'left', description: 'Express/NestJS, non-blocking I/O, npm khổng lồ.', link: cl('nodejs-express') },
        { title: 'Python', icon: 'Braces', side: 'right', description: 'Django/FastAPI — cú pháp gọn, mạnh về data & AI.', link: cl('python') },
        { title: 'Java', icon: 'Coffee', kind: 'alternative', side: 'left', description: 'Spring Boot — chuẩn doanh nghiệp.', link: cl('java-core') },
        { title: 'Go', icon: 'Rabbit', kind: 'alternative', side: 'right', description: 'Nhanh, gọn — microservice & hạ tầng.', link: cl('go') },
        { title: 'Rust / PHP', kind: 'alternative', side: 'left', description: 'Rust (an toàn, nhanh) hay PHP-Laravel (web truyền thống).', link: cl('rust') },
      ]},
      { label: 'API', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Tài nguyên, versioning, status code, phân trang, HATEOAS.', link: cl('rest-apis') },
        { title: 'Validation & DTO', kind: 'info', side: 'right', description: 'Kiểm tra input, tách tầng, tránh dữ liệu bẩn.' },
        { title: 'GraphQL', icon: 'Share2', kind: 'alternative', side: 'left', description: 'Query linh hoạt, 1 endpoint, tránh over-fetch.', link: cl('graphql') },
        { title: 'gRPC / WebSocket', kind: 'alternative', side: 'right', description: 'RPC nhị phân nhanh; realtime hai chiều.', link: ext('https://socket.io/docs/v4/') },
      ]},
      { label: 'Cơ sở dữ liệu', nodes: [
        { title: 'SQL & PostgreSQL', icon: 'Database', side: 'left', description: 'Quan hệ, index, transaction, join — nền tảng bắt buộc.', link: cl('postgresql') },
        { title: 'ORM', icon: 'Layers', side: 'right', description: 'Prisma/TypeORM — thao tác DB an toàn, migration.', link: cl('prisma-orm') },
        { title: 'MongoDB', icon: 'Database', kind: 'alternative', side: 'left', description: 'NoSQL document — schema linh hoạt.', link: cl('mongodb') },
        { title: 'Redis', icon: 'Zap', kind: 'alternative', side: 'right', description: 'Cache & hàng đợi trong bộ nhớ — tăng tốc mạnh.', link: cl('redis') },
      ]},
      { label: 'Bảo mật', nodes: [
        { title: 'Xác thực & phân quyền', kind: 'info', description: 'JWT, OAuth2, session, hash mật khẩu (bcrypt/argon2), RBAC.' },
        { title: 'OWASP Top 10', kind: 'info', side: 'right', description: 'SQL injection, XSS, CSRF — và cách phòng.', link: ext('https://owasp.org/www-project-top-ten/') },
        { title: 'Rate limit & CORS', kind: 'info', side: 'left', description: 'Chống lạm dụng, cấu hình chia sẻ tài nguyên an toàn.' },
      ]},
      { label: 'Vận hành & Triển khai', nodes: [
        { title: 'Docker', icon: 'Container', description: 'Đóng gói container — chạy giống nhau mọi nơi.', link: cl('docker') },
        { title: 'Testing & Logging', kind: 'info', side: 'right', description: 'Unit/integration test, log có cấu trúc, tracing.' },
        { title: 'Message Queue', kind: 'alternative', side: 'left', description: 'RabbitMQ/Kafka — xử lý bất đồng bộ, tách dịch vụ.' },
        { title: 'Tiếp: DevOps', kind: 'alternative', side: 'right', description: 'CI/CD, Kubernetes, giám sát — xem lộ trình DevOps.', link: { type: 'roadmap', ref: 'devops' } },
      ]},
    ],
  },

  // ─────────────────────────────── DEVOPS ───────────────────────────────
  {
    slug: 'devops', title: 'DevOps', type: 'role', icon: 'Infinity', color: '#f59e0b',
    description: 'Lộ trình DevOps — hệ điều hành, mạng, container, CI/CD, hạ tầng như mã, giám sát và cloud.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Linux & Bash', icon: 'Terminal', description: 'Dòng lệnh, quyền, tiến trình, cron, shell script.', link: cl('linux-bash') },
        { title: 'Mạng', kind: 'info', side: 'right', description: 'IP/subnet, DNS, HTTP, SSH, TLS, firewall, load balancer.', link: ext('https://roadmap.sh/computer-science') },
        { title: 'Git', icon: 'GitBranch', side: 'left', description: 'Nền tảng cho mọi pipeline CI/CD.', link: cl('git') },
        { title: 'Một ngôn ngữ script', kind: 'info', side: 'right', description: 'Python/Go/Bash để tự động hoá công việc.' },
      ]},
      { label: 'Container', nodes: [
        { title: 'Docker', icon: 'Container', description: 'Image, container, Dockerfile, compose, registry, network/volume.', link: cl('docker') },
        { title: 'Kubernetes', icon: 'Ship', side: 'right', description: 'Điều phối quy mô lớn: pod, service, deployment, ingress.', link: cl('kubernetes') },
        { title: 'Helm', kind: 'alternative', side: 'left', description: 'Đóng gói & quản lý cấu hình K8s theo chart.', link: ext('https://helm.sh/docs/') },
        { title: 'Nginx (reverse proxy)', kind: 'alternative', side: 'right', description: 'Reverse proxy, TLS, cân bằng tải, phục vụ tĩnh.', link: ext('https://nginx.org/en/docs/') },
      ]},
      { label: 'Tự động hoá', nodes: [
        { title: 'CI/CD', kind: 'info', description: 'Pipeline build → test → deploy tự động.', link: cl('github-actions') },
        { title: 'GitLab CI / Jenkins', kind: 'alternative', side: 'right', description: 'Lựa chọn CI khác nhau theo tổ chức.', link: ext('https://docs.gitlab.com/ee/ci/') },
        { title: 'Terraform (IaC)', kind: 'info', side: 'left', description: 'Dựng hạ tầng bằng mã, tái lập được, state.', link: ext('https://developer.hashicorp.com/terraform/docs') },
        { title: 'Ansible', kind: 'alternative', side: 'right', description: 'Cấu hình máy chủ theo playbook (không cần agent).', link: ext('https://docs.ansible.com/') },
      ]},
      { label: 'Cloud', nodes: [
        { title: 'AWS', icon: 'Ship', side: 'left', description: 'EC2, S3, VPC, IAM, RDS — nền tảng đám mây phổ biến nhất.', link: ext('https://roadmap.sh/aws') },
        { title: 'GCP / Azure', kind: 'alternative', side: 'right', description: 'Lựa chọn cloud khác — khái niệm tương đương.', link: ext('https://cloud.google.com/docs') },
        { title: 'Serverless', kind: 'alternative', side: 'left', description: 'Lambda/Cloud Functions — chạy code không cần quản server.' },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Giám sát & Metrics', kind: 'info', description: 'Prometheus + Grafana — biết hệ thống có "khoẻ" không.', link: ext('https://prometheus.io/docs/introduction/overview/') },
        { title: 'Logging & Tracing', kind: 'info', side: 'right', description: 'Log tập trung (ELK), tracing phân tán.', link: ext('https://roadmap.sh/devops') },
        { title: 'Bảo mật & Secrets', kind: 'info', side: 'left', description: 'Quản lý bí mật, quét lỗ hổng, least-privilege.' },
      ]},
    ],
  },

  // ─────────────────────────────── PYTHON ───────────────────────────────
  {
    slug: 'python', title: 'Python', type: 'skill', icon: 'Braces', color: '#3b82f6',
    description: 'Từ cú pháp cơ bản đến OOP, giải thuật, web và thực hành chuyên nghiệp với Python.',
    stages: [
      { label: 'Cơ bản', nodes: [
        { title: 'Cú pháp & kiểu dữ liệu', icon: 'Braces', description: 'Biến, số, chuỗi, list/dict/set/tuple, if/for/while.', link: cl('python') },
        { title: 'Hàm & module', kind: 'info', side: 'right', description: 'def, tham số, *args/**kwargs, import, package.', link: cl('python') },
        { title: 'Xử lý lỗi & file', kind: 'info', side: 'left', description: 'try/except, context manager, đọc/ghi file, JSON/CSV.' },
      ]},
      { label: 'Trung cấp', nodes: [
        { title: 'OOP', subtitle: 'Hướng đối tượng', icon: 'Boxes', description: 'class, kế thừa, dunder method, property, dataclass.', link: cl('python') },
        { title: 'Comprehension & generator', kind: 'info', side: 'right', description: 'List/dict comprehension, yield, iterator — Pythonic.' },
        { title: 'Decorator & closure', kind: 'alternative', side: 'left', description: 'Hàm bậc cao, đóng gói hành vi, ví dụ đo thời gian/cache.' },
        { title: 'Type hints', kind: 'info', side: 'right', description: 'Chú thích kiểu + mypy — code lớn dễ bảo trì.' },
      ]},
      { label: 'Giải thuật & Dữ liệu', nodes: [
        { title: 'Data Structures & Algorithms', icon: 'Binary', description: 'Sort, search, đệ quy, độ phức tạp — luyện trực quan.', link: algos },
        { title: 'DSA track (Code Lab)', icon: 'Code2', side: 'right', kind: 'alternative', description: 'Bài tập DSA có chấm tự động.', link: cl('data-structures-algorithms') },
        { title: 'NumPy / Pandas', kind: 'alternative', side: 'left', description: 'Xử lý số & bảng dữ liệu — nền cho data/AI.' },
      ]},
      { label: 'Web với Python', nodes: [
        { title: 'FastAPI', subtitle: 'API hiện đại', icon: 'Zap', side: 'left', description: 'Async, type hint, tự sinh docs — nhanh & gọn.', link: cl('fastapi') },
        { title: 'Django', icon: 'Server', kind: 'alternative', side: 'right', description: 'Framework "pin sẵn": ORM, admin, auth.', link: cl('django') },
        { title: 'Flask', kind: 'alternative', side: 'left', description: 'Micro-framework — nhẹ, linh hoạt.', link: ext('https://flask.palletsprojects.com/') },
      ]},
      { label: 'Chuyên nghiệp', nodes: [
        { title: 'venv & pip', kind: 'info', description: 'Môi trường ảo, requirements.txt, quản lý phụ thuộc.' },
        { title: 'Testing', kind: 'info', side: 'right', description: 'pytest, fixture, mock — code tin cậy.' },
        { title: 'Đóng gói & Docker', icon: 'Container', side: 'left', description: 'Đóng gói app Python để triển khai.', link: cl('docker') },
      ]},
    ],
  },

  // ─────────────────────────────── REACT ───────────────────────────────
  {
    slug: 'react', title: 'React', type: 'skill', icon: 'Atom', color: '#06b6d4',
    description: 'Làm chủ React — từ component cơ bản đến hook nâng cao, quản lý state, data-fetching và Next.js.',
    stages: [
      { label: 'Chuẩn bị', nodes: [
        { title: 'JavaScript vững', icon: 'Braces', description: 'ES6+, array method, promise/async, destructuring, module.', link: cl('javascript') },
        { title: 'TypeScript (nên có)', icon: 'Braces', kind: 'alternative', side: 'right', description: 'Kiểu cho props & state — dự án React lớn cần TS.', link: cl('typescript') },
      ]},
      { label: 'Cốt lõi', nodes: [
        { title: 'JSX & Component', icon: 'Atom', description: 'Component hàm, props, render danh sách, key.', link: cl('react') },
        { title: 'State & useState', kind: 'info', side: 'left', description: 'Trạng thái cục bộ, cập nhật bất biến.' },
        { title: 'useEffect & vòng đời', kind: 'info', side: 'right', description: 'Side-effect, dependency array, cleanup.' },
        { title: 'Sự kiện & Form', kind: 'info', side: 'left', description: 'Controlled input, submit, validation cơ bản.' },
        { title: 'Conditional & list render', kind: 'info', side: 'right', description: 'Render có điều kiện, map, fragment.' },
      ]},
      { label: 'Hook & State', nodes: [
        { title: 'Hook nâng cao', kind: 'info', description: 'useRef, useMemo, useCallback, useContext, custom hook.' },
        { title: 'State toàn cục', kind: 'info', side: 'right', description: 'Context, Zustand, Redux Toolkit — khi app lớn.' },
        { title: 'Data fetching', kind: 'alternative', side: 'left', description: 'TanStack Query/SWR — cache, revalidate, loading/err.' },
        { title: 'Form nâng cao', kind: 'alternative', side: 'right', description: 'React Hook Form + Zod — form phức tạp, validate.' },
      ]},
      { label: 'Chất lượng', nodes: [
        { title: 'Router', kind: 'info', description: 'React Router — điều hướng, route lồng, param, layout.' },
        { title: 'Testing', kind: 'info', side: 'right', description: 'Testing Library + Vitest — test theo hành vi user.' },
        { title: 'Performance', kind: 'alternative', side: 'left', description: 'memo, lazy, Suspense, tránh re-render thừa.' },
      ]},
      { label: 'Hệ sinh thái', nodes: [
        { title: 'Next.js', subtitle: 'Framework cho React', icon: 'Layers', description: 'SSR/SSG, App Router, SEO, API routes — production.', link: cl('nextjs') },
        { title: 'React Native', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React làm app di động.', link: cl('react-native') },
        { title: 'UI library', kind: 'alternative', side: 'left', description: 'shadcn/ui, Tailwind, Radix — dựng giao diện đẹp nhanh.', link: cl('tailwind-css') },
      ]},
    ],
  },

  // ─────────────────────────────── NODE.JS ───────────────────────────────
  {
    slug: 'nodejs', title: 'Node.js', type: 'skill', icon: 'Hexagon', color: '#22c55e',
    description: 'Backend với Node.js — runtime, Express/NestJS, cơ sở dữ liệu, xác thực và API production.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'JavaScript & TS', icon: 'Braces', description: 'Bất đồng bộ (callback/promise/async), module — gốc của Node.', link: cl('javascript') },
        { title: 'Node runtime', kind: 'info', side: 'right', description: 'Event loop, module hệ thống (fs/path/http/stream), npm.', link: cl('nodejs-express') },
        { title: 'Package & script', kind: 'info', side: 'left', description: 'package.json, semver, npx, monorepo cơ bản.' },
      ]},
      { label: 'Web framework', nodes: [
        { title: 'Express', subtitle: 'Tối giản, phổ biến', icon: 'Server', description: 'Route, middleware, xử lý request/response, lỗi.', link: cl('nodejs-express') },
        { title: 'NestJS', icon: 'Boxes', kind: 'alternative', side: 'right', description: 'Có kiến trúc, TypeScript-first, DI — dự án lớn.', link: cl('nestjs') },
        { title: 'Fastify', kind: 'alternative', side: 'left', description: 'Nhẹ & nhanh, schema-based validation.', link: ext('https://fastify.dev/docs/latest/') },
      ]},
      { label: 'Dữ liệu', nodes: [
        { title: 'SQL & PostgreSQL', icon: 'Database', side: 'left', description: 'Truy vấn, quan hệ, transaction.', link: cl('postgresql') },
        { title: 'Prisma ORM', icon: 'Layers', side: 'right', description: 'ORM type-safe — thao tác DB an toàn từ Node/TS.', link: cl('prisma-orm') },
        { title: 'MongoDB', icon: 'Database', kind: 'alternative', side: 'left', description: 'NoSQL — Mongoose, schema linh hoạt.', link: cl('mongodb') },
        { title: 'Redis', icon: 'Zap', kind: 'alternative', side: 'right', description: 'Cache, session, hàng đợi.', link: cl('redis') },
      ]},
      { label: 'API & Realtime', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Endpoint, status code, validation, phân trang.', link: cl('rest-apis') },
        { title: 'Xác thực', kind: 'info', side: 'right', description: 'JWT, bcrypt, OAuth, middleware phân quyền.' },
        { title: 'WebSocket (Socket.IO)', icon: 'Share2', kind: 'alternative', side: 'left', description: 'Realtime hai chiều — chat, thông báo.', link: ext('https://socket.io/docs/v4/') },
        { title: 'GraphQL', kind: 'alternative', side: 'right', description: 'Query linh hoạt trên Node.', link: cl('graphql') },
      ]},
      { label: 'Production', nodes: [
        { title: 'Testing', kind: 'info', description: 'Jest/Vitest, supertest — test API tự động.' },
        { title: 'Docker & deploy', icon: 'Container', side: 'right', description: 'Đóng gói & triển khai app Node.', link: cl('docker') },
        { title: 'Logging & giám sát', kind: 'info', side: 'left', description: 'Log có cấu trúc, health check, metrics.' },
      ]},
    ],
  },

  // ─────────────────────────────── SQL ───────────────────────────────
  {
    slug: 'sql', title: 'SQL', type: 'skill', icon: 'Database', color: '#a855f7',
    description: 'SQL từ truy vấn cơ bản đến join, subquery, window function, index và giao dịch.',
    stages: [
      { label: 'Truy vấn cơ bản', nodes: [
        { title: 'SELECT, WHERE, ORDER BY', icon: 'Database', description: 'Lọc, sắp xếp, LIMIT/OFFSET — nền tảng.', link: cl('sql') },
        { title: 'Toán tử & hàm chuỗi/ngày', kind: 'info', side: 'right', description: 'LIKE, IN, BETWEEN, CONCAT, DATE — xử lý dữ liệu.' },
        { title: 'GROUP BY & tổng hợp', kind: 'info', side: 'left', description: 'COUNT/SUM/AVG/MIN/MAX, HAVING.', link: cl('sql') },
      ]},
      { label: 'Kết hợp bảng', nodes: [
        { title: 'JOIN', subtitle: 'INNER/LEFT/RIGHT/FULL', icon: 'GitMerge', description: 'Ghép nhiều bảng qua khoá — kỹ năng cốt lõi.', link: cl('sql') },
        { title: 'Subquery & CTE', kind: 'info', side: 'right', description: 'Truy vấn lồng, WITH — chia nhỏ bài toán.' },
        { title: 'Window function', kind: 'alternative', side: 'left', description: 'ROW_NUMBER, RANK, LAG/LEAD, running total.' },
        { title: 'UNION & set ops', kind: 'alternative', side: 'right', description: 'UNION/INTERSECT/EXCEPT — gộp tập kết quả.' },
      ]},
      { label: 'Thiết kế & thao tác', nodes: [
        { title: 'DDL & kiểu dữ liệu', kind: 'info', description: 'CREATE/ALTER TABLE, khoá chính/ngoại, ràng buộc.' },
        { title: 'INSERT/UPDATE/DELETE', kind: 'info', side: 'right', description: 'Thay đổi dữ liệu an toàn, UPSERT.' },
        { title: 'Chuẩn hoá', kind: 'info', side: 'left', description: '1NF–3NF — tránh trùng lặp, dữ liệu sạch.' },
        { title: 'View & Stored Procedure', kind: 'alternative', side: 'right', description: 'Đóng gói truy vấn & logic trong DB.' },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Index & tối ưu', icon: 'Zap', description: 'B-tree index, EXPLAIN/ANALYZE, tăng tốc truy vấn.', link: cl('postgresql') },
        { title: 'Transaction & ACID', kind: 'info', side: 'right', description: 'BEGIN/COMMIT/ROLLBACK, mức cô lập, deadlock.' },
        { title: 'PostgreSQL chuyên sâu', icon: 'Database', side: 'left', kind: 'alternative', description: 'JSONB, RLS, full-text search, PostGIS.', link: cl('postgresql') },
        { title: 'NoSQL đối chiếu', kind: 'alternative', side: 'right', description: 'Khi nào dùng MongoDB/Redis thay SQL.', link: cl('mongodb') },
      ]},
    ],
  },

  // ─────────────────────────── DSA ───────────────────────────
  {
    slug: 'dsa', title: 'Data Structures & Algorithms', type: 'skill', icon: 'Binary', color: '#ef4444',
    description: 'Cấu trúc dữ liệu & giải thuật — luyện trực quan tại trang Algorithms (80 thuật toán) và bài tập Code Lab.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Độ phức tạp (Big-O)', kind: 'info', description: 'Thời gian & bộ nhớ; O(1), O(n), O(log n), O(n²).', link: ext('https://www.bigocheatsheet.com/') },
        { title: 'Mảng & chuỗi', icon: 'Rows3', side: 'right', description: 'Truy cập, duyệt, đảo, xoay.', link: algos },
        { title: 'Two-pointer & Sliding window', kind: 'alternative', side: 'left', description: 'Kỹ thuật quét mảng hiệu quả.', link: algos },
      ]},
      { label: 'Cấu trúc tuyến tính', nodes: [
        { title: 'Stack & Queue', icon: 'Layers', side: 'left', description: 'LIFO/FIFO — duyệt, hoàn tác, BFS.', link: algos },
        { title: 'Linked List', kind: 'info', side: 'right', description: 'Đơn/đôi, đảo, phát hiện chu trình.' },
        { title: 'Hash Table', icon: 'Hash', description: 'Ánh xạ khoá-giá trị O(1), xử lý va chạm.' },
      ]},
      { label: 'Sắp xếp & tìm kiếm', nodes: [
        { title: 'Sorting', subtitle: 'Bubble→Merge→Quick→Heap→Radix', icon: 'ArrowDownUp', description: 'Xem hoạt hình từng bước tại trang Algorithms.', link: algos },
        { title: 'Searching', icon: 'Search', side: 'right', description: 'Linear, Binary, Jump, Interpolation, Ternary.', link: algos },
      ]},
      { label: 'Cây', nodes: [
        { title: 'BST & Traversal', icon: 'GitFork', side: 'left', description: 'Cây nhị phân tìm kiếm, in/pre/post/level order.', link: algos },
        { title: 'Heap & Priority Queue', kind: 'info', side: 'right', description: 'Min/Max heap — lấy phần tử ưu tiên nhanh.', link: algos },
        { title: 'Trie / Segment / Fenwick', kind: 'alternative', side: 'left', description: 'Tiền tố, truy vấn khoảng — nâng cao.', link: algos },
      ]},
      { label: 'Đồ thị', nodes: [
        { title: 'BFS / DFS', icon: 'Share2', description: 'Duyệt đồ thị theo bề rộng / chiều sâu.', link: algos },
        { title: 'Đường đi ngắn nhất', kind: 'info', side: 'right', description: 'Dijkstra, Bellman-Ford, A*, Floyd-Warshall.', link: algos },
        { title: 'MST & Union-Find', kind: 'alternative', side: 'left', description: 'Kruskal, Prim, disjoint set, topo sort.', link: algos },
      ]},
      { label: 'Kỹ thuật giải', nodes: [
        { title: 'Quy hoạch động (DP)', icon: 'Grid3x3', description: 'Knapsack, LCS, LIS, Kadane, Coin Change.', link: algos },
        { title: 'Quay lui (Backtracking)', kind: 'info', side: 'right', description: 'N-Queens, Sudoku, hoán vị, tô màu đồ thị.', link: algos },
        { title: 'Tham lam & chia để trị', kind: 'alternative', side: 'left', description: 'Greedy, divide & conquer, closest pair.', link: algos },
        { title: 'Luyện đề (Code Lab)', icon: 'Code2', kind: 'alternative', side: 'right', description: 'Bài tập DSA chấm tự động.', link: cl('data-structures-algorithms') },
      ]},
    ],
  },
];
