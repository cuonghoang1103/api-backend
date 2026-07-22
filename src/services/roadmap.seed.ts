/**
 * Seed content for the 8 flagship roadmaps (Role- and Skill-based).
 * Hand-authored, roadmap.sh-inspired. `link` deep-links a node:
 *   { type: 'code-lab', ref: '<trackSlug>' }  → /code-lab/<slug>
 *   { type: 'roadmap',  ref: '<roadmapSlug>' } → /roadmap/<slug>
 *   { type: 'external', ref: '<url>' }         → opens the URL
 * Omit `link` for a pure info node.
 */
export type SeedLink = { type: 'code-lab' | 'roadmap' | 'external'; ref: string };
export interface SeedNode {
  title: string;
  subtitle?: string;
  kind?: 'primary' | 'alternative' | 'info';
  side?: 'center' | 'left' | 'right';
  icon?: string;
  description?: string;
  link?: SeedLink;
}
export interface SeedStage {
  label: string;
  nodes: SeedNode[];
}
export interface SeedRoadmap {
  slug: string;
  title: string;
  type: 'role' | 'skill';
  icon: string;
  color: string;
  description: string;
  stages: SeedStage[];
}

const cl = (ref: string): SeedLink => ({ type: 'code-lab', ref });
const ext = (ref: string): SeedLink => ({ type: 'external', ref });

export const ROADMAP_SEED: SeedRoadmap[] = [
  // ─────────────────────────────── FRONTEND ───────────────────────────────
  {
    slug: 'frontend', title: 'Frontend', type: 'role', icon: 'Monitor', color: '#6366f1',
    description: 'Lộ trình trở thành lập trình viên Frontend: từ HTML/CSS nền tảng đến framework hiện đại và tối ưu hiệu năng.',
    stages: [
      { label: 'Nền tảng Web', nodes: [
        { title: 'Internet & cách web hoạt động', kind: 'info', description: 'Hiểu HTTP/HTTPS, DNS, trình duyệt render trang thế nào, client-server.', link: ext('https://roadmap.sh/guides/what-is-internet') },
        { title: 'HTML', subtitle: 'Cấu trúc trang', icon: 'FileCode', side: 'left', description: 'Thẻ ngữ nghĩa, form, accessibility cơ bản, SEO on-page.', link: cl('html-css') },
        { title: 'CSS', subtitle: 'Trình bày & layout', icon: 'Palette', side: 'right', description: 'Box model, Flexbox, Grid, responsive, biến CSS, animation.', link: cl('html-css') },
      ]},
      { label: 'Ngôn ngữ', nodes: [
        { title: 'JavaScript', subtitle: 'Ngôn ngữ của web', icon: 'Braces', description: 'Cú pháp, DOM, sự kiện, fetch/async-await, ES modules, closure.', link: cl('javascript') },
        { title: 'TypeScript', subtitle: 'JS có kiểu', icon: 'Braces', kind: 'alternative', side: 'right', description: 'Kiểu tĩnh, interface, generic — bắt lỗi sớm, dự án lớn dễ bảo trì.', link: cl('typescript') },
      ]},
      { label: 'Công cụ', nodes: [
        { title: 'Git & GitHub', icon: 'GitBranch', side: 'left', description: 'Quản lý phiên bản, branch, pull request — bắt buộc mọi dev.', link: cl('git') },
        { title: 'npm / package manager', kind: 'info', side: 'right', description: 'Quản lý thư viện, script, semantic versioning.' },
        { title: 'Tailwind CSS', icon: 'Wind', kind: 'alternative', description: 'Utility-first CSS — dựng UI nhanh, nhất quán.', link: cl('tailwind-css') },
      ]},
      { label: 'Framework', nodes: [
        { title: 'React', subtitle: 'Phổ biến nhất', icon: 'Atom', description: 'Component, hook, state, JSX — hệ sinh thái lớn nhất.', link: cl('react') },
        { title: 'Vue', icon: 'Atom', kind: 'alternative', side: 'left', description: 'Nhẹ, dễ học, reactivity trực quan.', link: cl('vue') },
        { title: 'Angular', icon: 'Atom', kind: 'alternative', side: 'right', description: 'Framework đầy đủ, TypeScript-first, hợp dự án lớn.', link: cl('angular') },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Next.js', subtitle: 'React + SSR/SEO', icon: 'Layers', description: 'SSR, routing, API routes, tối ưu SEO & hiệu năng.', link: cl('nextjs') },
        { title: 'Data Structures & Algorithms', icon: 'Binary', side: 'right', description: 'Tư duy giải thuật — luyện trực quan tại trang Algorithms.', link: { type: 'external', ref: '/algorithms' } },
        { title: 'Web Performance', kind: 'info', side: 'left', description: 'Core Web Vitals, lazy-load, code-splitting, caching.', link: ext('https://web.dev/learn/performance') },
        { title: 'React Native', subtitle: 'Mở rộng sang mobile', icon: 'Smartphone', kind: 'alternative', description: 'Dùng React để làm app iOS/Android.', link: cl('react-native') },
      ]},
    ],
  },

  // ─────────────────────────────── BACKEND ───────────────────────────────
  {
    slug: 'backend', title: 'Backend', type: 'role', icon: 'Server', color: '#10b981',
    description: 'Lộ trình lập trình viên Backend: ngôn ngữ, API, cơ sở dữ liệu, xác thực và triển khai.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Internet & HTTP', kind: 'info', description: 'Request/response, status code, header, REST cơ bản.', link: ext('https://developer.mozilla.org/docs/Web/HTTP') },
        { title: 'Một ngôn ngữ backend', kind: 'info', description: 'Chọn 1 ngôn ngữ để đi sâu — xem các nhánh bên dưới.' },
      ]},
      { label: 'Ngôn ngữ (chọn 1)', nodes: [
        { title: 'Node.js', subtitle: 'JavaScript phía server', icon: 'Hexagon', side: 'left', description: 'Express/NestJS, non-blocking I/O, hệ sinh thái npm khổng lồ.', link: cl('nodejs-express') },
        { title: 'Python', icon: 'Braces', side: 'right', description: 'Django/FastAPI — cú pháp gọn, mạnh về data & AI.', link: cl('python') },
        { title: 'Java', icon: 'Coffee', kind: 'alternative', side: 'left', description: 'Spring Boot — chuẩn doanh nghiệp, mạnh mẽ.', link: cl('java-core') },
        { title: 'Go', icon: 'Rabbit', kind: 'alternative', side: 'right', description: 'Nhanh, gọn, tuyệt cho microservice & hạ tầng.', link: cl('go') },
      ]},
      { label: 'API', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Thiết kế tài nguyên, versioning, status code, phân trang.', link: cl('rest-apis') },
        { title: 'GraphQL', icon: 'Share2', kind: 'alternative', side: 'right', description: 'Query linh hoạt, 1 endpoint, tránh over-fetch.', link: cl('graphql') },
      ]},
      { label: 'Cơ sở dữ liệu', nodes: [
        { title: 'SQL & PostgreSQL', icon: 'Database', side: 'left', description: 'Quan hệ, index, transaction, join — nền tảng bắt buộc.', link: cl('postgresql') },
        { title: 'MongoDB', icon: 'Database', kind: 'alternative', side: 'right', description: 'NoSQL document — schema linh hoạt.', link: cl('mongodb') },
        { title: 'Redis', icon: 'Zap', kind: 'alternative', description: 'Cache & hàng đợi trong bộ nhớ — tăng tốc mạnh.', link: cl('redis') },
        { title: 'Prisma ORM', icon: 'Layers', kind: 'info', side: 'left', description: 'ORM type-safe cho Node — truy vấn DB an toàn.', link: cl('prisma-orm') },
      ]},
      { label: 'Bảo mật & triển khai', nodes: [
        { title: 'Xác thực & phân quyền', kind: 'info', description: 'JWT, OAuth, session, hash mật khẩu (bcrypt).', link: ext('https://roadmap.sh/backend') },
        { title: 'Docker', icon: 'Container', side: 'right', description: 'Đóng gói app thành container — chạy giống nhau mọi nơi.', link: cl('docker') },
        { title: 'Đi tiếp: DevOps', kind: 'alternative', side: 'left', description: 'CI/CD, Kubernetes, giám sát — xem lộ trình DevOps.', link: { type: 'roadmap', ref: 'devops' } },
      ]},
    ],
  },

  // ─────────────────────────────── DEVOPS ───────────────────────────────
  {
    slug: 'devops', title: 'DevOps', type: 'role', icon: 'Infinity', color: '#f59e0b',
    description: 'Lộ trình DevOps: hệ điều hành, container, CI/CD, hạ tầng như mã và giám sát.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Linux & Bash', icon: 'Terminal', description: 'Dòng lệnh, quyền, tiến trình, script — kỹ năng gốc.', link: cl('linux-bash') },
        { title: 'Mạng cơ bản', kind: 'info', side: 'right', description: 'IP, DNS, HTTP, SSH, firewall, load balancer.', link: ext('https://roadmap.sh/devops') },
        { title: 'Git', icon: 'GitBranch', side: 'left', description: 'Quản lý mã, nền tảng cho mọi pipeline CI/CD.', link: cl('git') },
      ]},
      { label: 'Container', nodes: [
        { title: 'Docker', icon: 'Container', description: 'Image, container, Dockerfile, compose, registry.', link: cl('docker') },
        { title: 'Kubernetes', icon: 'Ship', side: 'right', description: 'Điều phối container ở quy mô lớn: pod, service, deployment.', link: cl('kubernetes') },
      ]},
      { label: 'Tự động hoá', nodes: [
        { title: 'CI/CD', kind: 'info', description: 'GitHub Actions/GitLab CI — build, test, deploy tự động.', link: ext('https://docs.github.com/actions') },
        { title: 'Infrastructure as Code', kind: 'info', side: 'left', description: 'Terraform/Ansible — dựng hạ tầng bằng mã, tái lập được.', link: ext('https://roadmap.sh/terraform') },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Giám sát & Logging', kind: 'info', description: 'Prometheus, Grafana, log tập trung — biết hệ thống "khoẻ" không.', link: ext('https://roadmap.sh/devops') },
        { title: 'Cloud (AWS/GCP)', kind: 'info', side: 'right', description: 'Máy ảo, lưu trữ, mạng, IAM trên nền tảng đám mây.', link: ext('https://roadmap.sh/aws') },
        { title: 'Web server (Nginx)', kind: 'info', side: 'left', description: 'Reverse proxy, TLS, cân bằng tải, phục vụ tĩnh.', link: ext('https://nginx.org/en/docs/') },
      ]},
    ],
  },

  // ─────────────────────────────── PYTHON ───────────────────────────────
  {
    slug: 'python', title: 'Python', type: 'skill', icon: 'Braces', color: '#3b82f6',
    description: 'Lộ trình học Python từ cú pháp cơ bản đến web, dữ liệu và thực hành chuyên nghiệp.',
    stages: [
      { label: 'Cơ bản', nodes: [
        { title: 'Cú pháp & kiểu dữ liệu', icon: 'Braces', description: 'Biến, số, chuỗi, list, dict, set, tuple; if/for/while.', link: cl('python') },
        { title: 'Hàm & module', kind: 'info', side: 'right', description: 'def, tham số, *args/**kwargs, import, package.', link: cl('python') },
      ]},
      { label: 'Trung cấp', nodes: [
        { title: 'OOP', subtitle: 'Lập trình hướng đối tượng', icon: 'Boxes', side: 'left', description: 'class, kế thừa, dunder method, property.', link: cl('python') },
        { title: 'Xử lý lỗi & file', kind: 'info', side: 'right', description: 'try/except, context manager, đọc/ghi file, JSON.' },
        { title: 'Comprehension & generator', kind: 'info', description: 'List/dict comprehension, yield, iterator — Pythonic.' },
      ]},
      { label: 'Cấu trúc dữ liệu & giải thuật', nodes: [
        { title: 'Data Structures & Algorithms', icon: 'Binary', description: 'Sort, search, đệ quy, độ phức tạp — luyện trực quan.', link: { type: 'external', ref: '/algorithms' } },
        { title: 'DSA track (Code Lab)', icon: 'Code2', side: 'right', kind: 'alternative', description: 'Bài tập DSA có chấm tự động.', link: cl('data-structures-algorithms') },
      ]},
      { label: 'Web với Python', nodes: [
        { title: 'FastAPI', subtitle: 'API hiện đại', icon: 'Zap', side: 'left', description: 'Async, type hint, tự sinh docs — nhanh & gọn.', link: cl('fastapi') },
        { title: 'Django', icon: 'Server', kind: 'alternative', side: 'right', description: 'Framework "pin sẵn": ORM, admin, auth.', link: cl('django') },
      ]},
      { label: 'Chuyên nghiệp', nodes: [
        { title: 'Môi trường ảo & pip', kind: 'info', description: 'venv, requirements.txt, quản lý phụ thuộc.' },
        { title: 'Testing', kind: 'info', side: 'right', description: 'pytest, unittest — code tin cậy, dễ refactor.' },
      ]},
    ],
  },

  // ─────────────────────────────── REACT ───────────────────────────────
  {
    slug: 'react', title: 'React', type: 'skill', icon: 'Atom', color: '#06b6d4',
    description: 'Lộ trình làm chủ React: từ component cơ bản đến quản lý state, data-fetching và Next.js.',
    stages: [
      { label: 'Chuẩn bị', nodes: [
        { title: 'JavaScript vững', icon: 'Braces', description: 'ES6+, array method, promise/async, destructuring, module.', link: cl('javascript') },
        { title: 'TypeScript (nên có)', icon: 'Braces', kind: 'alternative', side: 'right', description: 'Kiểu cho props & state — dự án React lớn cần TS.', link: cl('typescript') },
      ]},
      { label: 'Cốt lõi', nodes: [
        { title: 'JSX & Component', icon: 'Atom', description: 'Component hàm, props, render danh sách, key.', link: cl('react') },
        { title: 'State & useState', kind: 'info', side: 'left', description: 'Quản lý trạng thái cục bộ, cập nhật bất biến.', link: cl('react') },
        { title: 'useEffect & vòng đời', kind: 'info', side: 'right', description: 'Side-effect, dependency array, cleanup.', link: cl('react') },
        { title: 'Xử lý sự kiện & form', kind: 'info', description: 'Controlled input, submit, validation cơ bản.' },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Hook nâng cao', kind: 'info', side: 'left', description: 'useRef, useMemo, useCallback, useContext, custom hook.' },
        { title: 'Quản lý state toàn cục', kind: 'info', side: 'right', description: 'Context, Zustand, Redux Toolkit — khi app lớn dần.' },
        { title: 'Data fetching', kind: 'info', description: 'TanStack Query/SWR — cache, revalidate, loading/err.' },
        { title: 'Router', kind: 'info', side: 'left', description: 'React Router — điều hướng, route lồng nhau, param.' },
      ]},
      { label: 'Hệ sinh thái', nodes: [
        { title: 'Next.js', subtitle: 'Framework cho React', icon: 'Layers', description: 'SSR, routing, SEO, API routes — chuẩn production.', link: cl('nextjs') },
        { title: 'React Native', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React để làm app di động.', link: cl('react-native') },
      ]},
    ],
  },

  // ─────────────────────────────── NODE.JS ───────────────────────────────
  {
    slug: 'nodejs', title: 'Node.js', type: 'skill', icon: 'Hexagon', color: '#22c55e',
    description: 'Lộ trình backend với Node.js: runtime, Express/NestJS, cơ sở dữ liệu và API production.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'JavaScript & TS', icon: 'Braces', description: 'Bất đồng bộ (callback/promise/async), module — gốc của Node.', link: cl('javascript') },
        { title: 'Node runtime', kind: 'info', side: 'right', description: 'Event loop, module hệ thống (fs, path, http), npm.', link: cl('nodejs-express') },
      ]},
      { label: 'Web framework', nodes: [
        { title: 'Express', subtitle: 'Tối giản, phổ biến', icon: 'Server', description: 'Route, middleware, xử lý request/response, lỗi.', link: cl('nodejs-express') },
        { title: 'NestJS', icon: 'Boxes', kind: 'alternative', side: 'right', description: 'Có kiến trúc, TypeScript-first, hợp dự án lớn.', link: cl('nestjs') },
      ]},
      { label: 'Dữ liệu', nodes: [
        { title: 'SQL & PostgreSQL', icon: 'Database', side: 'left', description: 'Truy vấn, quan hệ, transaction.', link: cl('postgresql') },
        { title: 'Prisma ORM', icon: 'Layers', side: 'right', description: 'ORM type-safe — thao tác DB an toàn từ Node/TS.', link: cl('prisma-orm') },
        { title: 'Redis', icon: 'Zap', kind: 'alternative', description: 'Cache, session, hàng đợi.', link: cl('redis') },
      ]},
      { label: 'API & production', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Thiết kế endpoint, status code, validation.', link: cl('rest-apis') },
        { title: 'Xác thực', kind: 'info', side: 'right', description: 'JWT, bcrypt, middleware phân quyền.' },
        { title: 'Docker & deploy', icon: 'Container', side: 'left', description: 'Đóng gói & triển khai app Node.', link: cl('docker') },
      ]},
    ],
  },

  // ─────────────────────────────── SQL ───────────────────────────────
  {
    slug: 'sql', title: 'SQL', type: 'skill', icon: 'Database', color: '#a855f7',
    description: 'Lộ trình SQL từ truy vấn cơ bản đến join, tối ưu index và giao dịch.',
    stages: [
      { label: 'Truy vấn cơ bản', nodes: [
        { title: 'SELECT, WHERE, ORDER BY', icon: 'Database', description: 'Lọc, sắp xếp, giới hạn kết quả — nền tảng.', link: cl('sql') },
        { title: 'Hàm tổng hợp & GROUP BY', kind: 'info', side: 'right', description: 'COUNT/SUM/AVG, HAVING, gom nhóm dữ liệu.', link: cl('sql') },
      ]},
      { label: 'Kết hợp bảng', nodes: [
        { title: 'JOIN', subtitle: 'INNER/LEFT/RIGHT', icon: 'GitMerge', description: 'Ghép nhiều bảng qua khoá — kỹ năng cốt lõi.', link: cl('sql') },
        { title: 'Subquery & CTE', kind: 'info', side: 'right', description: 'Truy vấn lồng, WITH — chia nhỏ bài toán phức tạp.' },
        { title: 'Window function', kind: 'info', side: 'left', description: 'ROW_NUMBER, RANK, running total — phân tích mạnh.' },
      ]},
      { label: 'Thiết kế & thao tác', nodes: [
        { title: 'DDL & kiểu dữ liệu', kind: 'info', description: 'CREATE/ALTER TABLE, khoá chính/ngoại, ràng buộc.' },
        { title: 'INSERT/UPDATE/DELETE', kind: 'info', side: 'right', description: 'Thay đổi dữ liệu an toàn, UPSERT.' },
        { title: 'Chuẩn hoá (Normalization)', kind: 'info', side: 'left', description: '1NF–3NF — tránh trùng lặp, dữ liệu sạch.' },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Index & tối ưu', icon: 'Zap', description: 'B-tree index, EXPLAIN, tăng tốc truy vấn.', link: cl('postgresql') },
        { title: 'Transaction & ACID', kind: 'info', side: 'right', description: 'BEGIN/COMMIT/ROLLBACK, mức cô lập.' },
        { title: 'PostgreSQL chuyên sâu', icon: 'Database', side: 'left', kind: 'alternative', description: 'JSONB, RLS, full-text search, PostGIS.', link: cl('postgresql') },
      ]},
    ],
  },

  // ─────────────────────────── DSA ───────────────────────────
  {
    slug: 'dsa', title: 'Data Structures & Algorithms', type: 'skill', icon: 'Binary', color: '#ef4444',
    description: 'Lộ trình cấu trúc dữ liệu & giải thuật — luyện trực quan tại trang Algorithms và qua bài tập Code Lab.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Độ phức tạp (Big-O)', kind: 'info', description: 'Thời gian & bộ nhớ; O(1), O(n), O(log n), O(n²).', link: ext('https://www.bigocheatsheet.com/') },
        { title: 'Mảng & chuỗi', icon: 'Rows3', side: 'right', description: 'Truy cập, duyệt, two-pointer, sliding window.', link: { type: 'external', ref: '/algorithms' } },
      ]},
      { label: 'Cấu trúc tuyến tính', nodes: [
        { title: 'Stack & Queue', icon: 'Layers', side: 'left', description: 'LIFO/FIFO — ứng dụng duyệt, hoàn tác, BFS.' },
        { title: 'Linked List', kind: 'info', side: 'right', description: 'Danh sách liên kết đơn/đôi, đảo, phát hiện chu trình.' },
        { title: 'Hash Table', icon: 'Hash', description: 'Ánh xạ khoá-giá trị O(1), xử lý va chạm.' },
      ]},
      { label: 'Sắp xếp & tìm kiếm', nodes: [
        { title: 'Sorting', subtitle: 'Bubble→Merge→Quick→Heap', icon: 'ArrowDownUp', description: 'Xem hoạt hình từng bước tại trang Algorithms.', link: { type: 'external', ref: '/algorithms' } },
        { title: 'Binary Search', icon: 'Search', side: 'right', description: 'Tìm kiếm nhị phân & biến thể trên mảng đã sắp.', link: { type: 'external', ref: '/algorithms' } },
      ]},
      { label: 'Cây & đồ thị', nodes: [
        { title: 'Cây (BST, Heap, Trie)', icon: 'GitFork', side: 'left', description: 'Duyệt, cân bằng, hàng đợi ưu tiên, tiền tố.', link: { type: 'external', ref: '/algorithms' } },
        { title: 'Đồ thị (BFS/DFS/Dijkstra)', icon: 'Share2', side: 'right', description: 'Duyệt, đường ngắn nhất, MST, sắp xếp topo.', link: { type: 'external', ref: '/algorithms' } },
      ]},
      { label: 'Kỹ thuật', nodes: [
        { title: 'Quy hoạch động (DP)', icon: 'Grid3x3', description: 'Knapsack, LCS, LIS, Kadane — chia bài toán con.', link: { type: 'external', ref: '/algorithms' } },
        { title: 'Quay lui (Backtracking)', kind: 'info', side: 'right', description: 'N-Queens, Sudoku, hoán vị — thử & lùi.', link: { type: 'external', ref: '/algorithms' } },
        { title: 'Tham lam & chia để trị', kind: 'info', side: 'left', description: 'Greedy, divide & conquer — chiến lược giải thuật.' },
        { title: 'Luyện đề (Code Lab)', icon: 'Code2', kind: 'alternative', description: 'Bài tập DSA chấm tự động.', link: cl('data-structures-algorithms') },
      ]},
    ],
  },
];
