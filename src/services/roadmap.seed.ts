/**
 * Seed content for the flagship roadmaps (Role- and Skill-based).
 * Hand-authored, roadmap.sh-inspired — dense paths, alternative branches, and
 * curated resources per node (official docs / MDN / roadmap.sh — reliable URLs).
 *   link      → featured "Recommended" (Code Lab track / roadmap / /algorithms).
 *   resources → Free/Premium resource list with type badge + title.
 *   kind      → 'primary' | 'alternative' (branch) | 'info' (concept).
 */
export type SeedLink = { type: 'code-lab' | 'roadmap' | 'external'; ref: string };
export type SeedResource = { type: 'article' | 'video' | 'course' | 'official' | 'feed'; title: string; url: string; premium?: boolean };
export interface SeedNode {
  title: string; subtitle?: string; kind?: 'primary' | 'alternative' | 'info';
  side?: 'center' | 'left' | 'right'; icon?: string; description?: string; link?: SeedLink; resources?: SeedResource[];
}
export interface SeedStage { label: string; nodes: SeedNode[]; }
export interface SeedRoadmap { slug: string; title: string; type: 'role' | 'skill'; icon: string; color: string; description: string; stages: SeedStage[]; }

const cl = (ref: string): SeedLink => ({ type: 'code-lab', ref });
const ext = (ref: string): SeedLink => ({ type: 'external', ref });
const rm = (ref: string): SeedLink => ({ type: 'roadmap', ref });
const algos: SeedLink = { type: 'external', ref: '/algorithms' };
// resource helpers
const off = (title: string, url: string): SeedResource => ({ type: 'official', title, url });
const art = (title: string, url: string): SeedResource => ({ type: 'article', title, url });
const crs = (title: string, url: string, premium = false): SeedResource => ({ type: 'course', title, url, premium });

export const ROADMAP_SEED: SeedRoadmap[] = [
  // ─────────────────────────────── FRONTEND ───────────────────────────────
  {
    slug: 'frontend', title: 'Frontend', type: 'role', icon: 'Monitor', color: '#6366f1',
    description: 'Lộ trình đầy đủ để trở thành lập trình viên Frontend — từ nền tảng web đến framework hiện đại, kiểm thử và tối ưu hiệu năng.',
    stages: [
      { label: 'Nền tảng Web', nodes: [
        { title: 'Internet & HTTP hoạt động thế nào', kind: 'info', description: 'HTTP/HTTPS, DNS, request/response, trình duyệt render trang, HTTP/2 & HTTP/3.',
          resources: [ art('MDN — Tổng quan HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'), art('roadmap.sh — Internet hoạt động thế nào', 'https://roadmap.sh/guides/what-is-internet'), art('How HTTPS Works', 'https://howhttps.works/') ] },
        { title: 'HTML', subtitle: 'Cấu trúc trang', icon: 'FileCode', side: 'left', description: 'Thẻ ngữ nghĩa, form & input, bảng, accessibility, meta/SEO on-page.', link: cl('html-css'),
          resources: [ off('MDN — Học HTML', 'https://developer.mozilla.org/en-US/docs/Learn/HTML'), art('web.dev — Learn HTML', 'https://web.dev/learn/html'), crs('freeCodeCamp — Responsive Web Design', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/') ] },
        { title: 'CSS', subtitle: 'Trình bày & layout', icon: 'Palette', side: 'right', description: 'Box model, Flexbox, Grid, responsive, biến CSS, transition & animation.', link: cl('html-css'),
          resources: [ off('MDN — Học CSS', 'https://developer.mozilla.org/en-US/docs/Learn/CSS'), art('Flexbox Froggy (game)', 'https://flexboxfroggy.com/'), art('CSS Grid Garden (game)', 'https://cssgridgarden.com/'), art('web.dev — Learn CSS', 'https://web.dev/learn/css') ] },
        { title: 'Responsive & Mobile-first', kind: 'info', side: 'left', description: 'Media query, breakpoint, đơn vị rem/vw, thiết kế từ nhỏ đến lớn.',
          resources: [ art('MDN — Responsive design', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design') ] },
        { title: 'Sass/SCSS', kind: 'alternative', side: 'right', description: 'CSS có biến, nesting, mixin — tổ chức style lớn dễ hơn.', link: ext('https://sass-lang.com/documentation/'),
          resources: [ off('Sass Documentation', 'https://sass-lang.com/documentation/') ] },
      ]},
      { label: 'JavaScript', nodes: [
        { title: 'JavaScript cơ bản', subtitle: 'Ngôn ngữ của web', icon: 'Braces', description: 'Biến, kiểu, hàm, mảng/đối tượng, vòng lặp, ES modules.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), art('javascript.info', 'https://javascript.info/'), crs('freeCodeCamp — JS Algorithms', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/') ] },
        { title: 'DOM & sự kiện', kind: 'info', side: 'left', description: 'Truy vấn/chỉnh DOM, event listener, event delegation.',
          resources: [ art('MDN — Giới thiệu DOM', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction') ] },
        { title: 'Bất đồng bộ & Fetch API', kind: 'info', side: 'right', description: 'Promise, async/await, gọi API, xử lý JSON & lỗi mạng.',
          resources: [ art('MDN — Promise', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'), art('MDN — Fetch API', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API') ] },
        { title: 'TypeScript', subtitle: 'JS có kiểu', icon: 'Braces', kind: 'alternative', side: 'left', description: 'Kiểu tĩnh, interface, generic — bắt lỗi sớm, dự án lớn dễ bảo trì.', link: cl('typescript'),
          resources: [ off('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html'), off('Lộ trình TypeScript', '/roadmap') ] },
      ]},
      { label: 'Công cụ nghề', nodes: [
        { title: 'Git & GitHub', icon: 'GitBranch', description: 'Version control, branch, merge, pull request — bắt buộc.', link: cl('git'),
          resources: [ off('Pro Git (sách miễn phí)', 'https://git-scm.com/book/en/v2'), art('GitHub — Git Handbook', 'https://docs.github.com/en/get-started/using-git/about-git'), art('Learn Git Branching (tương tác)', 'https://learngitbranching.js.org/') ] },
        { title: 'npm & bundler', kind: 'info', side: 'right', description: 'Quản lý thư viện, script, Vite/webpack, tree-shaking.',
          resources: [ off('Vite — Getting Started', 'https://vitejs.dev/guide/'), off('npm docs', 'https://docs.npmjs.com/') ] },
        { title: 'Tailwind CSS', icon: 'Wind', kind: 'alternative', side: 'left', description: 'Utility-first — dựng UI nhanh, nhất quán, dễ theme.', link: cl('tailwind-css'),
          resources: [ off('Tailwind CSS Docs', 'https://tailwindcss.com/docs') ] },
      ]},
      { label: 'Framework (chọn 1)', nodes: [
        { title: 'React', subtitle: 'Phổ biến nhất', icon: 'Atom', description: 'Component, hook, state, JSX — hệ sinh thái lớn nhất.', link: cl('react'),
          resources: [ off('react.dev — Learn', 'https://react.dev/learn'), off('Lộ trình React (chi tiết)', '/roadmap/react') ] },
        { title: 'Vue', icon: 'Atom', kind: 'alternative', side: 'left', description: 'Nhẹ, dễ học, reactivity trực quan.', link: cl('vue'),
          resources: [ off('Vue.js Guide', 'https://vuejs.org/guide/introduction.html') ] },
        { title: 'Angular', icon: 'Atom', kind: 'alternative', side: 'right', description: 'Framework đầy đủ, TypeScript-first, hợp dự án lớn.', link: cl('angular'),
          resources: [ off('Angular Docs', 'https://angular.dev/') ] },
        { title: 'Quản lý state', kind: 'info', description: 'Context, Zustand, Redux/Pinia — khi app phình to.',
          resources: [ off('Redux Toolkit', 'https://redux-toolkit.js.org/'), off('Zustand', 'https://zustand.docs.pmnd.rs/') ] },
      ]},
      { label: 'Chất lượng & Kiểm thử', nodes: [
        { title: 'Testing', kind: 'info', description: 'Unit (Vitest/Jest), component (Testing Library), E2E (Playwright).',
          resources: [ off('Testing Library', 'https://testing-library.com/docs/'), off('Playwright', 'https://playwright.dev/docs/intro') ] },
        { title: 'Accessibility (a11y)', kind: 'info', side: 'right', description: 'ARIA, keyboard nav, contrast — web cho mọi người.',
          resources: [ off('MDN — Accessibility', 'https://developer.mozilla.org/en-US/docs/Web/Accessibility'), art('web.dev — Learn Accessibility', 'https://web.dev/learn/accessibility') ] },
        { title: 'Data Structures & Algorithms', icon: 'Binary', side: 'left', description: 'Tư duy giải thuật — luyện trực quan tại trang Algorithms.', link: algos,
          resources: [ art('VisuAlgo — trực quan hoá thuật toán', 'https://visualgo.net/en'), crs('NeetCode — Roadmap', 'https://neetcode.io/roadmap') ] },
      ]},
      { label: 'Nâng cao & Production', nodes: [
        { title: 'Next.js', subtitle: 'React + SSR/SEO', icon: 'Layers', description: 'SSR/SSG, App Router, API routes, tối ưu SEO & ảnh.', link: cl('nextjs'),
          resources: [ off('Next.js — Learn', 'https://nextjs.org/learn') ] },
        { title: 'Web Performance', kind: 'info', side: 'right', description: 'Core Web Vitals, lazy-load, code-splitting, caching.',
          resources: [ art('web.dev — Learn Performance', 'https://web.dev/learn/performance'), art('Core Web Vitals', 'https://web.dev/articles/vitals') ] },
        { title: 'PWA & offline', kind: 'alternative', side: 'left', description: 'Service worker, cache, cài như app.',
          resources: [ art('web.dev — Learn PWA', 'https://web.dev/learn/pwa') ] },
        { title: 'React Native', subtitle: 'Sang mobile', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React để làm app iOS/Android.', link: cl('react-native'),
          resources: [ off('React Native — Docs', 'https://reactnative.dev/docs/getting-started'), off('Expo — Docs', 'https://docs.expo.dev/') ] },
        { title: 'Tiếp: Backend', kind: 'alternative', side: 'left', description: 'Muốn full-stack? Xem lộ trình Backend / Full Stack.', link: rm('fullstack') },
      ]},
    ],
  },

  // ─────────────────────────────── BACKEND ───────────────────────────────
  {
    slug: 'backend', title: 'Backend', type: 'role', icon: 'Server', color: '#10b981',
    description: 'Lộ trình lập trình viên Backend theo roadmap.sh — nền tảng, một ngôn ngữ, cơ sở dữ liệu, API, caching, bảo mật, kiểm thử và triển khai.',
    stages: [
      { label: 'Nền tảng bắt buộc', nodes: [
        { title: 'Internet & HTTP', kind: 'info', description: 'Cách Internet hoạt động, HTTP/HTTPS, DNS, tên miền, hosting, trình duyệt.',
          resources: [ art('MDN — Tổng quan HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'), art('roadmap.sh — Internet hoạt động thế nào', 'https://roadmap.sh/guides/what-is-internet') ] },
        { title: 'Terminal & Linux cơ bản', icon: 'Terminal', side: 'right', description: 'Dòng lệnh, quản lý tiến trình, quyền — nền của server.', link: cl('linux-bash'),
          resources: [ off('The Linux Command Line (sách)', 'https://linuxcommand.org/tlcl.php') ] },
        { title: 'Version Control — Git', icon: 'GitBranch', side: 'left', description: 'Git + GitHub/GitLab — quản lý mã, PR, review.', link: cl('git'),
          resources: [ off('Pro Git', 'https://git-scm.com/book/en/v2') ] },
      ]},
      { label: 'Chọn MỘT ngôn ngữ', nodes: [
        { title: 'Chọn một ngôn ngữ để đi sâu', kind: 'info', description: 'Đừng học nhiều ngôn ngữ cùng lúc — chọn 1, làm chủ nền tảng, rồi mới mở rộng.',
          resources: [ art('roadmap.sh — Backend', 'https://roadmap.sh/backend') ] },
        { title: 'Node.js', subtitle: 'JavaScript phía server', icon: 'Hexagon', side: 'left', description: 'Express/NestJS, non-blocking I/O.', link: cl('nodejs-express'),
          resources: [ off('Node.js — Learn', 'https://nodejs.org/en/learn'), off('Lộ trình Node.js', '/roadmap/nodejs') ] },
        { title: 'Python', icon: 'Braces', side: 'right', description: 'Django/FastAPI — gọn, mạnh về data & AI.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Java', icon: 'Coffee', kind: 'alternative', side: 'left', description: 'Spring Boot — chuẩn doanh nghiệp.', link: cl('java-core'),
          resources: [ off('dev.java — Learn', 'https://dev.java/learn/'), off('Spring — Guides', 'https://spring.io/guides') ] },
        { title: 'Go', icon: 'Rabbit', kind: 'alternative', side: 'right', description: 'Nhanh, gọn — microservice & hạ tầng.', link: cl('go'),
          resources: [ off('A Tour of Go', 'https://go.dev/tour/'), off('Go — Learn', 'https://go.dev/learn/') ] },
      ]},
      { label: 'Cơ sở dữ liệu', nodes: [
        { title: 'SQL quan hệ (PostgreSQL)', icon: 'Database', description: 'Quan hệ, index, transaction, join — nền tảng bắt buộc.', link: cl('postgresql'),
          resources: [ off('PostgreSQL Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'ORM', icon: 'Layers', side: 'right', description: 'Prisma/TypeORM/SQLAlchemy — thao tác DB an toàn, migration.', link: cl('prisma-orm'),
          resources: [ off('Prisma Docs', 'https://www.prisma.io/docs') ] },
        { title: 'NoSQL — MongoDB', icon: 'Database', kind: 'alternative', side: 'left', description: 'Document store — schema linh hoạt.', link: cl('mongodb'),
          resources: [ off('MongoDB — Manual', 'https://www.mongodb.com/docs/manual/'), crs('MongoDB University', 'https://learn.mongodb.com/') ] },
        { title: 'Sao chép, phân mảnh, ACID', kind: 'info', side: 'right', description: 'Replication, sharding, transaction, tính nhất quán.',
          resources: [ off('PostgreSQL — High Availability & Replication', 'https://www.postgresql.org/docs/current/high-availability.html'), art('Martin Kleppmann — Designing Data-Intensive Applications', 'https://dataintensive.net/') ] },
      ]},
      { label: 'API', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Tài nguyên, versioning, status code, phân trang, JSON.', link: cl('rest-apis'),
          resources: [ art('MDN — REST', 'https://developer.mozilla.org/en-US/docs/Glossary/REST'), off('OpenAPI Specification', 'https://swagger.io/specification/') ] },
        { title: 'Xác thực & phân quyền', kind: 'info', side: 'right', description: 'JWT, OAuth2, session, cookie, hash mật khẩu, RBAC.',
          resources: [ art('JWT — Introduction', 'https://jwt.io/introduction'), art('OAuth 2.0 Simplified', 'https://www.oauth.com/') ] },
        { title: 'GraphQL', icon: 'Share2', kind: 'alternative', side: 'left', description: 'Query linh hoạt, 1 endpoint.', link: cl('graphql'),
          resources: [ off('GraphQL — Learn', 'https://graphql.org/learn/'), off('Apollo — Docs', 'https://www.apollographql.com/docs/') ] },
        { title: 'Realtime (WebSocket)', icon: 'Share2', kind: 'alternative', side: 'right', description: 'Socket.IO — chat, thông báo hai chiều.', link: cl('redis'),
          resources: [ art('MDN — WebSockets API', 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'), off('Socket.IO — Docs', 'https://socket.io/docs/v4/') ] },
      ]},
      { label: 'Hiệu năng & Bảo mật', nodes: [
        { title: 'Caching', icon: 'Zap', description: 'Redis, cache tầng server/CDN, cache-aside, TTL.', link: cl('redis'),
          resources: [ off('Redis — Docs', 'https://redis.io/docs/latest/') ] },
        { title: 'Bảo mật web (OWASP)', kind: 'info', side: 'right', description: 'SQL injection, XSS, CSRF, CORS, rate limit, HTTPS.',
          resources: [ art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/'), art('OWASP Cheat Sheets', 'https://cheatsheetseries.owasp.org/') ] },
        { title: 'Testing', kind: 'info', side: 'left', description: 'Unit, integration, E2E — API tin cậy.',
          resources: [ off('Jest — Getting Started', 'https://jestjs.io/docs/getting-started'), off('Vitest — Guide', 'https://vitest.dev/guide/') ] },
      ]},
      { label: 'Kiến trúc & Triển khai', nodes: [
        { title: 'Docker & container', icon: 'Container', description: 'Đóng gói app — chạy giống nhau mọi nơi.', link: cl('docker'),
          resources: [ off('Docker — Get Started', 'https://docs.docker.com/get-started/') ] },
        { title: 'Message Queue', kind: 'alternative', side: 'right', description: 'RabbitMQ/Kafka — xử lý bất đồng bộ, tách dịch vụ.',
          resources: [ off('RabbitMQ — Tutorials', 'https://www.rabbitmq.com/tutorials'), off('Apache Kafka — Docs', 'https://kafka.apache.org/documentation/') ] },
        { title: 'Kiến trúc & mở rộng', kind: 'info', side: 'left', description: 'Monolith vs microservice, load balancing, horizontal scaling.',
          resources: [ art('roadmap.sh — System Design', 'https://roadmap.sh/system-design'), off('Lộ trình System Design', '/roadmap/system-design') ] },
        { title: 'Tiếp: DevOps', kind: 'alternative', side: 'right', description: 'CI/CD, Kubernetes, giám sát.', link: rm('devops') },
      ]},
    ],
  },

  // ─────────────────────────────── DEVOPS ───────────────────────────────
  {
    slug: 'devops', title: 'DevOps', type: 'role', icon: 'Infinity', color: '#f59e0b',
    description: 'Lộ trình DevOps — hệ điều hành, mạng, container, CI/CD, hạ tầng như mã, giám sát và cloud.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Linux & Bash', icon: 'Terminal', description: 'Dòng lệnh, quyền, tiến trình, cron, shell script.', link: cl('linux-bash'),
          resources: [ off('The Linux Command Line', 'https://linuxcommand.org/tlcl.php') ] },
        { title: 'Mạng & giao thức', kind: 'info', side: 'right', description: 'IP/subnet, DNS, HTTP, SSH, TLS, firewall, load balancer.',
          resources: [ art('Cloudflare — Learning Center', 'https://www.cloudflare.com/learning/') ] },
        { title: 'Git', icon: 'GitBranch', side: 'left', description: 'Nền tảng cho mọi pipeline CI/CD.', link: cl('git'),
          resources: [ off('Pro Git', 'https://git-scm.com/book/en/v2') ] },
        { title: 'Một ngôn ngữ script', kind: 'info', side: 'right', description: 'Python/Go/Bash để tự động hoá.',
          resources: [ off('Bash Guide — Greg Wiki', 'https://mywiki.wooledge.org/BashGuide'), off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/') ] },
      ]},
      { label: 'Container', nodes: [
        { title: 'Docker', icon: 'Container', description: 'Image, container, Dockerfile, compose, registry, network/volume.', link: cl('docker'),
          resources: [ off('Docker — Get Started', 'https://docs.docker.com/get-started/') ] },
        { title: 'Kubernetes', icon: 'Ship', side: 'right', description: 'Điều phối quy mô lớn: pod, service, deployment, ingress.', link: cl('kubernetes'),
          resources: [ off('Kubernetes — Basics', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/') ] },
        { title: 'Helm', kind: 'alternative', side: 'left', description: 'Đóng gói cấu hình K8s theo chart.', link: ext('https://helm.sh/docs/'),
          resources: [ off('Helm — Docs', 'https://helm.sh/docs/') ] },
        { title: 'Nginx (reverse proxy)', kind: 'alternative', side: 'right', description: 'Reverse proxy, TLS, cân bằng tải.', link: ext('https://nginx.org/en/docs/'),
          resources: [ off('Nginx — Beginner Guide', 'https://nginx.org/en/docs/beginners_guide.html') ] },
      ]},
      { label: 'Tự động hoá', nodes: [
        { title: 'CI/CD', kind: 'info', description: 'Pipeline build → test → deploy tự động.', link: cl('github-actions'),
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
        { title: 'Terraform (IaC)', kind: 'info', side: 'left', description: 'Dựng hạ tầng bằng mã, tái lập, state.', link: ext('https://developer.hashicorp.com/terraform/docs'),
          resources: [ off('Terraform — Docs', 'https://developer.hashicorp.com/terraform/docs') ] },
        { title: 'Ansible', kind: 'alternative', side: 'right', description: 'Cấu hình máy chủ theo playbook.', link: ext('https://docs.ansible.com/'),
          resources: [ off('Ansible — Getting Started', 'https://docs.ansible.com/ansible/latest/getting_started/index.html') ] },
      ]},
      { label: 'Cloud', nodes: [
        { title: 'AWS', icon: 'Ship', side: 'left', description: 'EC2, S3, VPC, IAM, RDS — cloud phổ biến nhất.', link: ext('https://roadmap.sh/aws'),
          resources: [ off('AWS — Getting Started', 'https://aws.amazon.com/getting-started/') ] },
        { title: 'GCP / Azure', kind: 'alternative', side: 'right', description: 'Cloud khác — khái niệm tương đương.', link: ext('https://cloud.google.com/docs'),
          resources: [ off('Google Cloud — Docs', 'https://cloud.google.com/docs'), off('Microsoft Azure — Docs', 'https://learn.microsoft.com/en-us/azure/') ] },
        { title: 'Serverless', kind: 'alternative', side: 'left', description: 'Lambda/Cloud Functions — chạy code không cần server.',
          resources: [ off('AWS Lambda — Developer Guide', 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html') ] },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Giám sát & Metrics', kind: 'info', description: 'Prometheus + Grafana.', link: ext('https://prometheus.io/docs/introduction/overview/'),
          resources: [ off('Prometheus — Docs', 'https://prometheus.io/docs/introduction/overview/'), off('Grafana — Docs', 'https://grafana.com/docs/') ] },
        { title: 'Logging & Tracing', kind: 'info', side: 'right', description: 'Log tập trung (ELK), tracing phân tán (OpenTelemetry).',
          resources: [ off('OpenTelemetry — Docs', 'https://opentelemetry.io/docs/'), off('Elastic Stack — Guide', 'https://www.elastic.co/guide/index.html') ] },
        { title: 'Bảo mật & Secrets', kind: 'info', side: 'left', description: 'Quản lý bí mật, quét lỗ hổng, least-privilege.',
          resources: [ off('HashiCorp Vault — Docs', 'https://developer.hashicorp.com/vault/docs'), art('OWASP — DevSecOps Guideline', 'https://owasp.org/www-project-devsecops-guideline/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── DATA ANALYST ───────────────────────────────
  {
    slug: 'data-analyst', title: 'Data Analyst', type: 'role', icon: 'Grid3x3', color: '#0ea5e9',
    description: 'Lộ trình Data Analyst — thống kê, SQL, Excel/Sheets, Python phân tích, và trực quan hoá dữ liệu.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Tư duy dữ liệu & thống kê', kind: 'info', description: 'Trung bình/trung vị, phân phối, tương quan, sai số, p-value.',
          resources: [ crs('Khan Academy — Statistics', 'https://www.khanacademy.org/math/statistics-probability') ] },
        { title: 'Excel / Google Sheets', kind: 'info', side: 'right', description: 'Hàm, pivot table, VLOOKUP/XLOOKUP, biểu đồ.',
          resources: [ off('Google Sheets — Trợ giúp', 'https://support.google.com/docs/topic/9054603') ] },
      ]},
      { label: 'Truy vấn dữ liệu', nodes: [
        { title: 'SQL cho phân tích', icon: 'Database', description: 'SELECT, JOIN, GROUP BY, window function — lấy & tổng hợp dữ liệu.', link: cl('sql'),
          resources: [ crs('Mode — SQL Tutorial', 'https://mode.com/sql-tutorial/'), off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'Làm sạch dữ liệu', kind: 'info', side: 'right', description: 'Xử lý thiếu, trùng, chuẩn hoá, kiểu dữ liệu.',
          resources: [ off('Pandas — Working with Missing Data', 'https://pandas.pydata.org/docs/user_guide/missing_data.html') ] },
      ]},
      { label: 'Python phân tích', nodes: [
        { title: 'Python cơ bản', icon: 'Braces', description: 'Cú pháp, cấu trúc dữ liệu — nền cho phân tích.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Pandas & NumPy', kind: 'info', side: 'right', description: 'DataFrame, lọc/nhóm/ghép, xử lý số.',
          resources: [ off('Pandas — Getting Started', 'https://pandas.pydata.org/docs/getting_started/index.html'), off('NumPy — Beginner Guide', 'https://numpy.org/doc/stable/user/absolute_beginners.html') ] },
        { title: 'Jupyter Notebook', kind: 'alternative', side: 'left', description: 'Môi trường phân tích tương tác.', link: ext('https://jupyter.org/'),
          resources: [ off('Jupyter — Docs', 'https://docs.jupyter.org/en/latest/') ] },
      ]},
      { label: 'Trực quan hoá', nodes: [
        { title: 'Biểu đồ & storytelling', kind: 'info', description: 'Chọn đúng loại biểu đồ, kể chuyện bằng dữ liệu.',
          resources: [ art('Data Viz Catalogue', 'https://datavizcatalogue.com/') ] },
        { title: 'BI tool (Power BI / Tableau)', kind: 'alternative', side: 'right', description: 'Dashboard doanh nghiệp, tự phục vụ.',
          resources: [ off('Power BI — Learn', 'https://learn.microsoft.com/en-us/power-bi/'), crs('Tableau — Training', 'https://www.tableau.com/learn/training') ] },
        { title: 'Tiếp: Data Scientist / MLOps', kind: 'alternative', side: 'left', description: 'Muốn đi sâu ML? Xem AI Engineer.', link: rm('ai-engineer') },
      ]},
    ],
  },

  // ─────────────────────────────── FULL STACK ───────────────────────────────
  {
    slug: 'fullstack', title: 'Full Stack', type: 'role', icon: 'Layers', color: '#8b5cf6',
    description: 'Lộ trình Full Stack — gộp Frontend + Backend + hạ tầng, xây được sản phẩm hoàn chỉnh đầu-cuối.',
    stages: [
      { label: 'Frontend', nodes: [
        { title: 'HTML, CSS, JavaScript', icon: 'FileCode', description: 'Nền tảng giao diện — xem chi tiết ở lộ trình Frontend.', link: cl('html-css'),
          resources: [ off('Lộ trình Frontend đầy đủ', '/roadmap/frontend') ] },
        { title: 'React + Next.js', icon: 'Atom', side: 'right', description: 'Framework UI + SSR/SEO.', link: cl('nextjs'),
          resources: [ off('Lộ trình React', '/roadmap/react') ] },
      ]},
      { label: 'Backend', nodes: [
        { title: 'Node.js + API', icon: 'Hexagon', description: 'Express/NestJS, REST/GraphQL — xem chi tiết ở lộ trình Backend.', link: cl('nodejs-express'),
          resources: [ off('Lộ trình Backend đầy đủ', '/roadmap/backend') ] },
        { title: 'Cơ sở dữ liệu + ORM', icon: 'Database', side: 'right', description: 'PostgreSQL + Prisma, thiết kế schema.', link: cl('postgresql'),
          resources: [ off('PostgreSQL — Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), off('Prisma — Docs', 'https://www.prisma.io/docs') ] },
        { title: 'Xác thực & bảo mật', kind: 'info', side: 'left', description: 'JWT/OAuth, bảo vệ API, OWASP.',
          resources: [ art('JWT — Introduction', 'https://jwt.io/introduction'), art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/') ] },
      ]},
      { label: 'Kết nối đầu-cuối', nodes: [
        { title: 'Gọi API từ FE ↔ BE', kind: 'info', description: 'Fetch/axios, state server (React Query), xử lý lỗi & loading.',
          resources: [ off('TanStack Query', 'https://tanstack.com/query/latest'), off('axios — Docs', 'https://axios-http.com/docs/intro') ] },
        { title: 'Realtime & upload', kind: 'alternative', side: 'right', description: 'WebSocket, upload file/ảnh (R2/S3).',
          resources: [ off('Socket.IO — Docs', 'https://socket.io/docs/v4/'), off('Cloudflare R2 — Docs', 'https://developers.cloudflare.com/r2/') ] },
      ]},
      { label: 'Triển khai', nodes: [
        { title: 'Docker & Deploy', icon: 'Container', description: 'Đóng gói & đưa sản phẩm lên VPS/cloud.', link: cl('docker'),
          resources: [ off('Lộ trình DevOps', '/roadmap/devops') ] },
        { title: 'CI/CD', kind: 'info', side: 'right', description: 'Tự động build/test/deploy.', link: cl('github-actions'),
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
      ]},
    ],
  },

  // ─────────────────────────────── AI ENGINEER ───────────────────────────────
  {
    slug: 'ai-engineer', title: 'AI Engineer', type: 'role', icon: 'Sparkles', color: '#ec4899',
    description: 'Lộ trình AI Engineer — nền toán/Python, machine learning, deep learning, LLM & xây ứng dụng AI.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Python cho AI', icon: 'Braces', description: 'Python + NumPy/Pandas — ngôn ngữ số 1 của AI.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Toán: đại số tuyến tính & xác suất', kind: 'info', side: 'right', description: 'Vector/ma trận, đạo hàm, xác suất — nền của ML.',
          resources: [ crs('Khan Academy — Linear Algebra', 'https://www.khanacademy.org/math/linear-algebra') ] },
      ]},
      { label: 'Machine Learning', nodes: [
        { title: 'ML cơ bản', kind: 'info', description: 'Hồi quy, phân loại, overfitting, đánh giá mô hình.',
          resources: [ off('scikit-learn — User Guide', 'https://scikit-learn.org/stable/user_guide.html') ] },
        { title: 'Deep Learning', kind: 'info', side: 'right', description: 'Mạng nơ-ron, CNN, RNN, backprop.',
          resources: [ crs('Deep Learning (Google Crash Course)', 'https://developers.google.com/machine-learning/crash-course') ] },
      ]},
      { label: 'LLM & GenAI', nodes: [
        { title: 'Transformer & LLM', kind: 'info', description: 'Attention, tokenization, mô hình ngôn ngữ lớn.',
          resources: [ art('The Illustrated Transformer', 'https://jalammar.github.io/illustrated-transformer/') ] },
        { title: 'Prompt Engineering', kind: 'info', side: 'right', description: 'Viết prompt hiệu quả, few-shot, chain-of-thought.',
          resources: [ off('OpenAI — Prompt Engineering', 'https://platform.openai.com/docs/guides/prompt-engineering') ] },
        { title: 'RAG & Vector DB', kind: 'alternative', side: 'left', description: 'Truy hồi tài liệu + LLM, embedding, vector search.',
          resources: [ crs('Pinecone — Learn', 'https://www.pinecone.io/learn/'), off('LangChain — Docs', 'https://python.langchain.com/docs/introduction/') ] },
        { title: 'Agent & tool use', kind: 'alternative', side: 'right', description: 'LLM gọi công cụ, lập kế hoạch nhiều bước.',
          resources: [ off('Anthropic — Tool Use', 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use'), off('LangChain — Agents', 'https://python.langchain.com/docs/introduction/') ] },
      ]},
      { label: 'Xây ứng dụng AI', nodes: [
        { title: 'API LLM & tích hợp', kind: 'info', description: 'Gọi API model, streaming, quản lý chi phí/token.',
          resources: [ off('Anthropic — API Docs', 'https://docs.anthropic.com/'), off('OpenAI — API Docs', 'https://platform.openai.com/docs/') ] },
        { title: 'Triển khai & MLOps', kind: 'alternative', side: 'right', description: 'Đóng gói, giám sát, cập nhật mô hình.', link: rm('devops'),
          resources: [ crs('ml-ops.org — MLOps Principles', 'https://ml-ops.org/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── QA / TESTING ───────────────────────────────
  {
    slug: 'qa', title: 'QA / Kiểm thử', type: 'role', icon: 'Check', color: '#14b8a6',
    description: 'Lộ trình QA/Automation — nền tảng kiểm thử, viết test case, tự động hoá UI/API và CI.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Nguyên lý kiểm thử', kind: 'info', description: 'Loại test, test case, bug report, chu trình QA, black/white-box.',
          resources: [ art('ISTQB — Foundation Syllabus', 'https://www.istqb.org/') ] },
        { title: 'Một ngôn ngữ (JS/Python)', icon: 'Braces', side: 'right', description: 'Để viết automation script.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/') ] },
      ]},
      { label: 'Automation', nodes: [
        { title: 'UI Automation (Playwright/Cypress)', kind: 'info', description: 'Tự động test giao diện đầu-cuối.',
          resources: [ off('Playwright — Docs', 'https://playwright.dev/docs/intro'), off('Cypress — Docs', 'https://docs.cypress.io/') ] },
        { title: 'API Testing', kind: 'info', side: 'right', description: 'Postman, REST client, kiểm thử hợp đồng.', link: cl('rest-apis'),
          resources: [ off('Postman — Learning', 'https://learning.postman.com/') ] },
        { title: 'Unit & Integration', kind: 'alternative', side: 'left', description: 'Test tầng thấp: Jest/Vitest/pytest.',
          resources: [ off('Jest — Getting Started', 'https://jestjs.io/docs/getting-started'), off('pytest — Docs', 'https://docs.pytest.org/en/stable/') ] },
      ]},
      { label: 'Chất lượng liên tục', nodes: [
        { title: 'CI cho test', kind: 'info', description: 'Chạy test tự động trong pipeline.', link: cl('github-actions'),
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
        { title: 'Performance & Load test', kind: 'alternative', side: 'right', description: 'k6/JMeter — đo chịu tải.',
          resources: [ off('Grafana k6 — Docs', 'https://grafana.com/docs/k6/latest/'), off('Apache JMeter — User Manual', 'https://jmeter.apache.org/usermanual/index.html') ] },
      ]},
    ],
  },

  // ─────────────────────────────── SYSTEM DESIGN ───────────────────────────────
  {
    slug: 'system-design', title: 'System Design', type: 'skill', icon: 'Boxes', color: '#f97316',
    description: 'Lộ trình thiết kế hệ thống — mở rộng, cân bằng tải, caching, database, hàng đợi, và các mẫu kiến trúc.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Client–Server & mạng', kind: 'info', description: 'HTTP, DNS, latency vs throughput, TCP/UDP.',
          resources: [ art('roadmap.sh — System Design', 'https://roadmap.sh/system-design') ] },
        { title: 'Ước lượng & trade-off', kind: 'info', side: 'right', description: 'Back-of-envelope, CAP theorem, nhất quán vs sẵn sàng.',
          resources: [ art('System Design Primer', 'https://github.com/donnemartin/system-design-primer'), art('CAP Theorem — Cloudflare', 'https://www.cloudflare.com/learning/') ] },
      ]},
      { label: 'Mở rộng', nodes: [
        { title: 'Horizontal vs Vertical Scaling', kind: 'info', description: 'Nhân bản dịch vụ, stateless, auto-scaling.',
          resources: [ art('System Design Primer — Scalability', 'https://github.com/donnemartin/system-design-primer') ] },
        { title: 'Load Balancer', kind: 'info', side: 'right', description: 'Phân phối tải, health check, sticky session.',
          resources: [ art('Cloudflare — What is Load Balancing', 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/') ] },
        { title: 'Caching', icon: 'Zap', side: 'left', description: 'CDN, Redis, cache-aside, invalidation.', link: cl('redis'),
          resources: [ off('Redis — Docs', 'https://redis.io/docs/latest/'), art('Cloudflare — What is a CDN', 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/') ] },
      ]},
      { label: 'Dữ liệu', nodes: [
        { title: 'SQL vs NoSQL', icon: 'Database', description: 'Chọn store phù hợp; index, replication, sharding.', link: cl('postgresql'),
          resources: [ off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'Message Queue', kind: 'info', side: 'right', description: 'Kafka/RabbitMQ — bất đồng bộ, tách dịch vụ.',
          resources: [ off('RabbitMQ — Tutorials', 'https://www.rabbitmq.com/tutorials'), off('Apache Kafka — Docs', 'https://kafka.apache.org/documentation/') ] },
      ]},
      { label: 'Kiến trúc & mẫu', nodes: [
        { title: 'Microservices vs Monolith', kind: 'info', description: 'Đánh đổi, API gateway, service discovery.',
          resources: [ art('Martin Fowler — Microservices', 'https://martinfowler.com/articles/microservices.html') ] },
        { title: 'Rate limiting & Idempotency', kind: 'alternative', side: 'right', description: 'Chống lạm dụng, xử lý trùng lặp an toàn.',
          resources: [ art('Cloudflare — What is Rate Limiting', 'https://www.cloudflare.com/learning/bots/what-is-rate-limiting/'), art('Stripe — Idempotent Requests', 'https://docs.stripe.com/api/idempotent_requests') ] },
        { title: 'Case studies', kind: 'alternative', side: 'left', description: 'Thiết kế URL shortener, feed, chat, thanh toán...',
          resources: [ art('System Design Primer (GitHub)', 'https://github.com/donnemartin/system-design-primer') ] },
      ]},
    ],
  },

  // ─────────────────────────────── PYTHON ───────────────────────────────
  {
    slug: 'python', title: 'Python', type: 'skill', icon: 'Braces', color: '#3b82f6',
    description: 'Từ cú pháp cơ bản đến OOP, giải thuật, web và thực hành chuyên nghiệp với Python.',
    stages: [
      { label: 'Cơ bản', nodes: [
        { title: 'Cú pháp & kiểu dữ liệu', icon: 'Braces', description: 'Biến, số, chuỗi, list/dict/set/tuple, if/for/while.', link: cl('python'),
          resources: [ off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/'), crs('freeCodeCamp — Scientific Computing with Python', 'https://www.freecodecamp.org/learn/scientific-computing-with-python/') ] },
        { title: 'Hàm & module', kind: 'info', side: 'right', description: 'def, *args/**kwargs, import, package.', link: cl('python'),
          resources: [ off('Python — Defining Functions', 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions'), off('Python — Modules', 'https://docs.python.org/3/tutorial/modules.html') ] },
        { title: 'Xử lý lỗi & file', kind: 'info', side: 'left', description: 'try/except, context manager, đọc/ghi file, JSON/CSV.',
          resources: [ off('Python — Errors & Exceptions', 'https://docs.python.org/3/tutorial/errors.html'), off('Python — Reading & Writing Files', 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files') ] },
      ]},
      { label: 'Trung cấp', nodes: [
        { title: 'OOP', subtitle: 'Hướng đối tượng', icon: 'Boxes', description: 'class, kế thừa, dunder, property, dataclass.', link: cl('python'),
          resources: [ off('Python — Classes', 'https://docs.python.org/3/tutorial/classes.html'), art('Real Python — OOP in Python', 'https://realpython.com/python3-object-oriented-programming/') ] },
        { title: 'Comprehension & generator', kind: 'info', side: 'right', description: 'List/dict comprehension, yield, iterator.',
          resources: [ off('Python — List Comprehensions', 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions'), art('Real Python — Generators', 'https://realpython.com/introduction-to-python-generators/') ] },
        { title: 'Decorator & closure', kind: 'alternative', side: 'left', description: 'Hàm bậc cao, đóng gói hành vi.',
          resources: [ art('Real Python — Primer on Decorators', 'https://realpython.com/primer-on-python-decorators/') ] },
        { title: 'Type hints', kind: 'info', side: 'right', description: 'Chú thích kiểu + mypy.',
          resources: [ off('Python — typing', 'https://docs.python.org/3/library/typing.html'), off('mypy — Docs', 'https://mypy.readthedocs.io/en/stable/') ] },
      ]},
      { label: 'Giải thuật & Dữ liệu', nodes: [
        { title: 'Data Structures & Algorithms', icon: 'Binary', description: 'Sort, search, đệ quy, độ phức tạp — luyện trực quan.', link: algos,
          resources: [ art('VisuAlgo — trực quan hoá thuật toán', 'https://visualgo.net/en'), off('Lộ trình DSA', '/roadmap/dsa') ] },
        { title: 'DSA track (Code Lab)', icon: 'Code2', side: 'right', kind: 'alternative', description: 'Bài tập DSA có chấm tự động.', link: cl('data-structures-algorithms') },
        { title: 'NumPy / Pandas', kind: 'alternative', side: 'left', description: 'Xử lý số & bảng dữ liệu.', link: rm('data-analyst'),
          resources: [ off('NumPy — Beginner Guide', 'https://numpy.org/doc/stable/user/absolute_beginners.html'), off('Pandas — Getting Started', 'https://pandas.pydata.org/docs/getting_started/index.html') ] },
      ]},
      { label: 'Web với Python', nodes: [
        { title: 'FastAPI', subtitle: 'API hiện đại', icon: 'Zap', side: 'left', description: 'Async, type hint, tự sinh docs.', link: cl('fastapi'),
          resources: [ off('FastAPI — Tutorial', 'https://fastapi.tiangolo.com/tutorial/') ] },
        { title: 'Django', icon: 'Server', kind: 'alternative', side: 'right', description: 'Framework "pin sẵn".', link: cl('django'),
          resources: [ off('Django — Docs', 'https://docs.djangoproject.com/en/stable/'), crs('Django Girls Tutorial', 'https://tutorial.djangogirls.org/') ] },
        { title: 'Flask', kind: 'alternative', side: 'left', description: 'Micro-framework nhẹ.', link: ext('https://flask.palletsprojects.com/'),
          resources: [ off('Flask — Tutorial', 'https://flask.palletsprojects.com/en/stable/tutorial/') ] },
      ]},
      { label: 'Chuyên nghiệp', nodes: [
        { title: 'venv & pip', kind: 'info', description: 'Môi trường ảo, requirements.txt.',
          resources: [ off('Python — Virtual Environments', 'https://docs.python.org/3/tutorial/venv.html'), off('pip — User Guide', 'https://pip.pypa.io/en/stable/user_guide/') ] },
        { title: 'Testing', kind: 'info', side: 'right', description: 'pytest, fixture, mock.',
          resources: [ off('pytest — Docs', 'https://docs.pytest.org/en/stable/'), off('Python — unittest', 'https://docs.python.org/3/library/unittest.html') ] },
        { title: 'Đóng gói & Docker', icon: 'Container', side: 'left', description: 'Triển khai app Python.', link: cl('docker'),
          resources: [ off('Docker — Python Guide', 'https://docs.docker.com/language/python/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── REACT ───────────────────────────────
  {
    slug: 'react', title: 'React', type: 'skill', icon: 'Atom', color: '#06b6d4',
    description: 'Làm chủ React — từ component cơ bản đến hook nâng cao, quản lý state, data-fetching và Next.js.',
    stages: [
      { label: 'Chuẩn bị', nodes: [
        { title: 'JavaScript vững', icon: 'Braces', description: 'ES6+, array method, promise/async, destructuring, module.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), art('javascript.info', 'https://javascript.info/') ] },
        { title: 'TypeScript (nên có)', icon: 'Braces', kind: 'alternative', side: 'right', description: 'Kiểu cho props & state.', link: cl('typescript'),
          resources: [ off('React + TypeScript — Docs', 'https://react.dev/learn/typescript'), off('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html') ] },
      ]},
      { label: 'Cốt lõi', nodes: [
        { title: 'JSX & Component', icon: 'Atom', description: 'Component hàm, props, render danh sách, key.', link: cl('react'),
          resources: [ off('react.dev — Describing the UI', 'https://react.dev/learn/describing-the-ui') ] },
        { title: 'State & useState', kind: 'info', side: 'left', description: 'Trạng thái cục bộ, cập nhật bất biến.',
          resources: [ off('react.dev — State', 'https://react.dev/learn/state-a-components-memory') ] },
        { title: 'useEffect & vòng đời', kind: 'info', side: 'right', description: 'Side-effect, dependency array, cleanup.',
          resources: [ off('react.dev — Synchronizing with Effects', 'https://react.dev/learn/synchronizing-with-effects') ] },
        { title: 'Sự kiện & Form', kind: 'info', side: 'left', description: 'Controlled input, submit, validation.',
          resources: [ off('react.dev — Responding to Events', 'https://react.dev/learn/responding-to-events'), off('react.dev — Reacting to Input with State', 'https://react.dev/learn/reacting-to-input-with-state') ] },
        { title: 'Conditional & list render', kind: 'info', side: 'right', description: 'Render có điều kiện, map, fragment.',
          resources: [ off('react.dev — Conditional Rendering', 'https://react.dev/learn/conditional-rendering'), off('react.dev — Rendering Lists', 'https://react.dev/learn/rendering-lists') ] },
      ]},
      { label: 'Hook & State', nodes: [
        { title: 'Hook nâng cao', kind: 'info', description: 'useRef, useMemo, useCallback, useContext, custom hook.',
          resources: [ off('react.dev — Reusing Logic with Custom Hooks', 'https://react.dev/learn/reusing-logic-with-custom-hooks') ] },
        { title: 'State toàn cục', kind: 'info', side: 'right', description: 'Context, Zustand, Redux Toolkit.',
          resources: [ off('react.dev — Passing Data with Context', 'https://react.dev/learn/passing-data-deeply-with-context'), off('Zustand', 'https://zustand.docs.pmnd.rs/'), off('Redux Toolkit', 'https://redux-toolkit.js.org/') ] },
        { title: 'Data fetching', kind: 'alternative', side: 'left', description: 'TanStack Query/SWR — cache, revalidate.',
          resources: [ off('TanStack Query', 'https://tanstack.com/query/latest'), off('SWR', 'https://swr.vercel.app/') ] },
        { title: 'Form nâng cao', kind: 'alternative', side: 'right', description: 'React Hook Form + Zod.',
          resources: [ off('React Hook Form — Get Started', 'https://react-hook-form.com/get-started'), off('Zod', 'https://zod.dev/') ] },
      ]},
      { label: 'Chất lượng', nodes: [
        { title: 'Router', kind: 'info', description: 'React Router — điều hướng, route lồng, layout.',
          resources: [ off('React Router — Docs', 'https://reactrouter.com/') ] },
        { title: 'Testing', kind: 'info', side: 'right', description: 'Testing Library + Vitest.',
          resources: [ off('Testing Library — React', 'https://testing-library.com/docs/react-testing-library/intro/'), off('Vitest — Guide', 'https://vitest.dev/guide/') ] },
        { title: 'Performance', kind: 'alternative', side: 'left', description: 'memo, lazy, Suspense.',
          resources: [ off('react.dev — memo', 'https://react.dev/reference/react/memo'), off('react.dev — lazy', 'https://react.dev/reference/react/lazy') ] },
      ]},
      { label: 'Hệ sinh thái', nodes: [
        { title: 'Next.js', subtitle: 'Framework cho React', icon: 'Layers', description: 'SSR/SSG, App Router, SEO.', link: cl('nextjs'),
          resources: [ off('Next.js — Learn', 'https://nextjs.org/learn') ] },
        { title: 'React Native', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React làm app di động.', link: cl('react-native'),
          resources: [ off('React Native — Docs', 'https://reactnative.dev/docs/getting-started'), off('Expo — Docs', 'https://docs.expo.dev/') ] },
        { title: 'UI library', kind: 'alternative', side: 'left', description: 'shadcn/ui, Tailwind, Radix.', link: cl('tailwind-css'),
          resources: [ off('shadcn/ui', 'https://ui.shadcn.com/docs'), off('Radix UI', 'https://www.radix-ui.com/primitives/docs/overview/introduction') ] },
      ]},
    ],
  },

  // ─────────────────────────────── NODE.JS ───────────────────────────────
  {
    slug: 'nodejs', title: 'Node.js', type: 'skill', icon: 'Hexagon', color: '#22c55e',
    description: 'Backend với Node.js — runtime, Express/NestJS, cơ sở dữ liệu, xác thực và API production.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'JavaScript & TS', icon: 'Braces', description: 'Bất đồng bộ, module — gốc của Node.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), off('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html') ] },
        { title: 'Node runtime', kind: 'info', side: 'right', description: 'Event loop, module hệ thống (fs/path/http/stream), npm.', link: cl('nodejs-express'),
          resources: [ off('Node.js — Learn', 'https://nodejs.org/en/learn') ] },
        { title: 'Package & script', kind: 'info', side: 'left', description: 'package.json, semver, npx.',
          resources: [ off('npm — package.json', 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json'), art('Semantic Versioning', 'https://semver.org/') ] },
      ]},
      { label: 'Web framework', nodes: [
        { title: 'Express', subtitle: 'Tối giản, phổ biến', icon: 'Server', description: 'Route, middleware, request/response, lỗi.', link: cl('nodejs-express'),
          resources: [ off('Express — Guide', 'https://expressjs.com/en/guide/routing.html') ] },
        { title: 'NestJS', icon: 'Boxes', kind: 'alternative', side: 'right', description: 'Có kiến trúc, TypeScript-first, DI.', link: cl('nestjs'),
          resources: [ off('NestJS — Docs', 'https://docs.nestjs.com/') ] },
        { title: 'Fastify', kind: 'alternative', side: 'left', description: 'Nhẹ & nhanh, schema validation.', link: ext('https://fastify.dev/docs/latest/'),
          resources: [ off('Fastify — Docs', 'https://fastify.dev/docs/latest/') ] },
      ]},
      { label: 'Dữ liệu', nodes: [
        { title: 'SQL & PostgreSQL', icon: 'Database', side: 'left', description: 'Truy vấn, quan hệ, transaction.', link: cl('postgresql'),
          resources: [ off('PostgreSQL — Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'Prisma ORM', icon: 'Layers', side: 'right', description: 'ORM type-safe.', link: cl('prisma-orm'),
          resources: [ off('Prisma — Docs', 'https://www.prisma.io/docs') ] },
        { title: 'MongoDB', icon: 'Database', kind: 'alternative', side: 'left', description: 'NoSQL — Mongoose.', link: cl('mongodb'),
          resources: [ off('MongoDB — Manual', 'https://www.mongodb.com/docs/manual/'), off('Mongoose — Docs', 'https://mongoosejs.com/docs/') ] },
        { title: 'Redis', icon: 'Zap', kind: 'alternative', side: 'right', description: 'Cache, session, hàng đợi.', link: cl('redis'),
          resources: [ off('Redis — Docs', 'https://redis.io/docs/latest/') ] },
      ]},
      { label: 'API & Realtime', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Endpoint, status code, validation, phân trang.', link: cl('rest-apis'),
          resources: [ off('Express — Routing', 'https://expressjs.com/en/guide/routing.html'), art('MDN — REST', 'https://developer.mozilla.org/en-US/docs/Glossary/REST') ] },
        { title: 'Xác thực', kind: 'info', side: 'right', description: 'JWT, bcrypt, OAuth, middleware phân quyền.',
          resources: [ off('Passport.js', 'https://www.passportjs.org/'), art('JWT — Introduction', 'https://jwt.io/introduction') ] },
        { title: 'WebSocket (Socket.IO)', icon: 'Share2', kind: 'alternative', side: 'left', description: 'Realtime hai chiều.', link: ext('https://socket.io/docs/v4/'),
          resources: [ off('Socket.IO — Docs', 'https://socket.io/docs/v4/') ] },
        { title: 'GraphQL', kind: 'alternative', side: 'right', description: 'Query linh hoạt.', link: cl('graphql'),
          resources: [ off('GraphQL — Learn', 'https://graphql.org/learn/'), off('Apollo Server', 'https://www.apollographql.com/docs/apollo-server/') ] },
      ]},
      { label: 'Production', nodes: [
        { title: 'Testing', kind: 'info', description: 'Jest/Vitest, supertest.',
          resources: [ off('Jest — Getting Started', 'https://jestjs.io/docs/getting-started'), off('SuperTest', 'https://github.com/ladjs/supertest') ] },
        { title: 'Docker & deploy', icon: 'Container', side: 'right', description: 'Đóng gói & triển khai.', link: cl('docker'),
          resources: [ off('Docker — Node.js Guide', 'https://docs.docker.com/language/nodejs/') ] },
        { title: 'Logging & giám sát', kind: 'info', side: 'left', description: 'Log có cấu trúc, health check, metrics.',
          resources: [ off('Pino — Logger', 'https://getpino.io/'), off('Prometheus — Docs', 'https://prometheus.io/docs/introduction/overview/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── SQL ───────────────────────────────
  {
    slug: 'sql', title: 'SQL', type: 'skill', icon: 'Database', color: '#a855f7',
    description: 'SQL từ truy vấn cơ bản đến join, subquery, window function, index và giao dịch.',
    stages: [
      { label: 'Truy vấn cơ bản', nodes: [
        { title: 'SELECT, WHERE, ORDER BY', icon: 'Database', description: 'Lọc, sắp xếp, LIMIT/OFFSET — nền tảng.', link: cl('sql'),
          resources: [ crs('Mode — SQL Tutorial', 'https://mode.com/sql-tutorial/'), crs('SQLBolt — tương tác', 'https://sqlbolt.com/') ] },
        { title: 'Toán tử & hàm chuỗi/ngày', kind: 'info', side: 'right', description: 'LIKE, IN, BETWEEN, CONCAT, DATE.',
          resources: [ off('PostgreSQL — Functions & Operators', 'https://www.postgresql.org/docs/current/functions.html') ] },
        { title: 'GROUP BY & tổng hợp', kind: 'info', side: 'left', description: 'COUNT/SUM/AVG/MIN/MAX, HAVING.', link: cl('sql'),
          resources: [ off('PostgreSQL — Aggregate Functions', 'https://www.postgresql.org/docs/current/tutorial-agg.html') ] },
      ]},
      { label: 'Kết hợp bảng', nodes: [
        { title: 'JOIN', subtitle: 'INNER/LEFT/RIGHT/FULL', icon: 'GitMerge', description: 'Ghép nhiều bảng qua khoá — cốt lõi.', link: cl('sql'),
          resources: [ art('Visual JOIN explained', 'https://joins.spathon.com/') ] },
        { title: 'Subquery & CTE', kind: 'info', side: 'right', description: 'Truy vấn lồng, WITH.',
          resources: [ off('PostgreSQL — WITH Queries (CTE)', 'https://www.postgresql.org/docs/current/queries-with.html') ] },
        { title: 'Window function', kind: 'alternative', side: 'left', description: 'ROW_NUMBER, RANK, LAG/LEAD, running total.',
          resources: [ off('PostgreSQL — Window Functions', 'https://www.postgresql.org/docs/current/tutorial-window.html') ] },
        { title: 'UNION & set ops', kind: 'alternative', side: 'right', description: 'UNION/INTERSECT/EXCEPT.',
          resources: [ off('PostgreSQL — Combining Queries', 'https://www.postgresql.org/docs/current/queries-union.html') ] },
      ]},
      { label: 'Thiết kế & thao tác', nodes: [
        { title: 'DDL & kiểu dữ liệu', kind: 'info', description: 'CREATE/ALTER TABLE, khoá chính/ngoại, ràng buộc.',
          resources: [ off('PostgreSQL — Data Definition', 'https://www.postgresql.org/docs/current/ddl.html'), off('PostgreSQL — Data Types', 'https://www.postgresql.org/docs/current/datatype.html') ] },
        { title: 'INSERT/UPDATE/DELETE', kind: 'info', side: 'right', description: 'Thay đổi dữ liệu an toàn, UPSERT.',
          resources: [ off('PostgreSQL — Data Manipulation', 'https://www.postgresql.org/docs/current/dml.html'), off('PostgreSQL — INSERT ... ON CONFLICT', 'https://www.postgresql.org/docs/current/sql-insert.html') ] },
        { title: 'Chuẩn hoá', kind: 'info', side: 'left', description: '1NF–3NF — dữ liệu sạch.',
          resources: [ art('Database Normalization (Wikipedia)', 'https://en.wikipedia.org/wiki/Database_normalization') ] },
        { title: 'View & Stored Procedure', kind: 'alternative', side: 'right', description: 'Đóng gói truy vấn & logic.',
          resources: [ off('PostgreSQL — Views', 'https://www.postgresql.org/docs/current/tutorial-views.html'), off('PostgreSQL — CREATE FUNCTION', 'https://www.postgresql.org/docs/current/sql-createfunction.html') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Index & tối ưu', icon: 'Zap', description: 'B-tree index, EXPLAIN/ANALYZE.', link: cl('postgresql'),
          resources: [ off('Use The Index, Luke!', 'https://use-the-index-luke.com/') ] },
        { title: 'Transaction & ACID', kind: 'info', side: 'right', description: 'BEGIN/COMMIT/ROLLBACK, mức cô lập, deadlock.',
          resources: [ off('PostgreSQL — Transactions', 'https://www.postgresql.org/docs/current/tutorial-transactions.html'), off('PostgreSQL — Transaction Isolation', 'https://www.postgresql.org/docs/current/transaction-iso.html') ] },
        { title: 'PostgreSQL chuyên sâu', icon: 'Database', side: 'left', kind: 'alternative', description: 'JSONB, RLS, full-text, PostGIS.', link: cl('postgresql'),
          resources: [ off('PostgreSQL — JSON Types', 'https://www.postgresql.org/docs/current/datatype-json.html'), off('PostgreSQL — Full Text Search', 'https://www.postgresql.org/docs/current/textsearch.html') ] },
        { title: 'NoSQL đối chiếu', kind: 'alternative', side: 'right', description: 'Khi nào dùng MongoDB/Redis.', link: cl('mongodb'),
          resources: [ off('MongoDB — Manual', 'https://www.mongodb.com/docs/manual/'), off('Redis — Docs', 'https://redis.io/docs/latest/') ] },
      ]},
    ],
  },

  // ─────────────────────────── DSA ───────────────────────────
  {
    slug: 'dsa', title: 'Data Structures & Algorithms', type: 'skill', icon: 'Binary', color: '#ef4444',
    description: 'Cấu trúc dữ liệu & giải thuật — luyện trực quan tại trang Algorithms (80 thuật toán) và bài tập Code Lab.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Độ phức tạp (Big-O)', kind: 'info', description: 'Thời gian & bộ nhớ; O(1), O(n), O(log n), O(n²).', link: algos,
          resources: [ art('Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/') ] },
        { title: 'Mảng & chuỗi', icon: 'Rows3', side: 'right', description: 'Truy cập, duyệt, đảo, xoay.', link: algos,
          resources: [ crs('NeetCode — Arrays & Hashing', 'https://neetcode.io/roadmap') ] },
        { title: 'Two-pointer & Sliding window', kind: 'alternative', side: 'left', description: 'Kỹ thuật quét mảng hiệu quả.', link: algos,
          resources: [ art('cp-algorithms — Two Pointers', 'https://cp-algorithms.com/others/two_pointers.html') ] },
      ]},
      { label: 'Cấu trúc tuyến tính', nodes: [
        { title: 'Stack & Queue', icon: 'Layers', side: 'left', description: 'LIFO/FIFO — duyệt, hoàn tác, BFS.', link: algos,
          resources: [ art('VisuAlgo — Linked List / Stack / Queue', 'https://visualgo.net/en/list') ] },
        { title: 'Linked List', kind: 'info', side: 'right', description: 'Đơn/đôi, đảo, phát hiện chu trình.',
          resources: [ art('VisuAlgo — Linked List', 'https://visualgo.net/en/list') ] },
        { title: 'Hash Table', icon: 'Hash', description: 'Ánh xạ khoá-giá trị O(1).',
          resources: [ art('VisuAlgo — Hash Table', 'https://visualgo.net/en/hashtable') ] },
      ]},
      { label: 'Sắp xếp & tìm kiếm', nodes: [
        { title: 'Sorting', subtitle: 'Bubble→Merge→Quick→Heap→Radix', icon: 'ArrowDownUp', description: 'Xem hoạt hình từng bước.', link: algos,
          resources: [ art('VisuAlgo — Sorting', 'https://visualgo.net/en/sorting'), art('Big-O Cheat Sheet — Sorting', 'https://www.bigocheatsheet.com/') ] },
        { title: 'Searching', icon: 'Search', side: 'right', description: 'Linear, Binary, Jump, Interpolation, Ternary.', link: algos,
          resources: [ art('cp-algorithms — Binary Search', 'https://cp-algorithms.com/num_methods/binary_search.html') ] },
      ]},
      { label: 'Cây', nodes: [
        { title: 'BST & Traversal', icon: 'GitFork', side: 'left', description: 'Cây tìm kiếm, in/pre/post/level order.', link: algos,
          resources: [ art('VisuAlgo — Binary Search Tree', 'https://visualgo.net/en/bst') ] },
        { title: 'Heap & Priority Queue', kind: 'info', side: 'right', description: 'Min/Max heap.', link: algos,
          resources: [ art('VisuAlgo — Binary Heap', 'https://visualgo.net/en/heap') ] },
        { title: 'Trie / Segment / Fenwick', kind: 'alternative', side: 'left', description: 'Tiền tố, truy vấn khoảng.', link: algos,
          resources: [ art('cp-algorithms — Data Structures', 'https://cp-algorithms.com/data_structures/segment_tree.html'), art('VisuAlgo — Segment Tree', 'https://visualgo.net/en/segmenttree') ] },
      ]},
      { label: 'Đồ thị', nodes: [
        { title: 'BFS / DFS', icon: 'Share2', description: 'Duyệt bề rộng / chiều sâu.', link: algos,
          resources: [ art('VisuAlgo — Graph Traversal', 'https://visualgo.net/en/dfsbfs') ] },
        { title: 'Đường đi ngắn nhất', kind: 'info', side: 'right', description: 'Dijkstra, Bellman-Ford, A*, Floyd-Warshall.', link: algos,
          resources: [ art('VisuAlgo — Single-Source Shortest Path', 'https://visualgo.net/en/sssp'), art('cp-algorithms — Shortest Paths', 'https://cp-algorithms.com/graph/dijkstra.html') ] },
        { title: 'MST & Union-Find', kind: 'alternative', side: 'left', description: 'Kruskal, Prim, disjoint set, topo sort.', link: algos,
          resources: [ art('VisuAlgo — Min Spanning Tree', 'https://visualgo.net/en/mst'), art('VisuAlgo — Union-Find (UFDS)', 'https://visualgo.net/en/ufds') ] },
      ]},
      { label: 'Kỹ thuật giải', nodes: [
        { title: 'Quy hoạch động (DP)', icon: 'Grid3x3', description: 'Knapsack, LCS, LIS, Kadane, Coin Change.', link: algos,
          resources: [ art('cp-algorithms — Dynamic Programming', 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html'), crs('NeetCode — 1-D & 2-D DP', 'https://neetcode.io/roadmap') ] },
        { title: 'Quay lui (Backtracking)', kind: 'info', side: 'right', description: 'N-Queens, Sudoku, hoán vị, tô màu.', link: algos,
          resources: [ art('VisuAlgo — Recursion Tree', 'https://visualgo.net/en/recursion') ] },
        { title: 'Tham lam & chia để trị', kind: 'alternative', side: 'left', description: 'Greedy, divide & conquer.', link: algos,
          resources: [ art('cp-algorithms — Divide & Conquer', 'https://cp-algorithms.com/') ] },
        { title: 'Luyện đề (Code Lab)', icon: 'Code2', kind: 'alternative', side: 'right', description: 'Bài tập DSA chấm tự động.', link: cl('data-structures-algorithms') },
      ]},
    ],
  },
];
