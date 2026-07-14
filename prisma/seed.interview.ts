/* eslint-disable */
/**
 * Prisma seed — Interview Simulator STARTER bank. Run: tsx prisma/seed.interview.ts
 *
 * Fully idempotent & safe to re-run on prod:
 *  - domains/tracks/topics/concepts/company-profiles upserted by unique slug
 *  - questions are find-before-create (by topicId + body); on re-run, English
 *    fields (bodyEn / referenceAnswerEn / rubricEn) are BACKFILLED into existing
 *    rows if missing. Nothing is deleted.
 *
 * ⚠️ CONTENT WARNING (read the prompt's SEED DATA section):
 * The rubrics + reference answers ARE the product. These are a STRUCTURED
 * FIRST DRAFT for a human to rewrite — every question is `rubricReviewed:false`
 * so the admin panel flags it as low-confidence.
 *
 * Bilingual: VI is the primary content; EN mirrors it so EN sessions render
 * fully in English (question + reference + rubric). Deterministic Pass A reuses
 * the same mustMention + synonym map (English tech terms + VN aliases both hit).
 */
import { PrismaClient } from '@prisma/client';
import type { InterviewLevel, InterviewQuestionType } from '@prisma/client';

const prisma = new PrismaClient();

type Rub = Array<{ id: string; criterion: string; weight: number }>;
interface QSeed {
  level: InterviewLevel;
  type?: InterviewQuestionType;
  difficulty?: number;
  body: string;
  bodyEn: string;
  referenceAnswer: string;
  referenceAnswerEn: string;
  rubric: Rub;
  rubricEn: Rub;
  mustMention: string[];
  shouldMention?: string[];
  redFlags?: string[];
  synonyms?: Record<string, string[]>;
  tags?: string[];
}
interface ConceptSeed { slug: string; name: string; questions: QSeed[]; }
interface TopicSeed { slug: string; name: string; nameVi: string; weight: number; concepts: ConceptSeed[]; }
interface TrackSeed { slug: string; name: string; nameVi: string; domainSlug: string; topics: TopicSeed[]; }

const DOMAINS = [
  { slug: 'backend', name: 'Backend', nameVi: 'Backend', icon: 'server' },
  { slug: 'frontend', name: 'Frontend', nameVi: 'Frontend', icon: 'layout' },
  { slug: 'database', name: 'Database', nameVi: 'Cơ sở dữ liệu', icon: 'database' },
  { slug: 'devops', name: 'DevOps', nameVi: 'DevOps', icon: 'infinity' },
  { slug: 'cloud', name: 'Cloud & VPS', nameVi: 'Cloud & VPS', icon: 'cloud' },
  { slug: 'networking', name: 'Networking', nameVi: 'Mạng máy tính', icon: 'network' },
  { slug: 'mobile', name: 'Mobile', nameVi: 'Di động', icon: 'smartphone' },
  { slug: 'ai-ml', name: 'AI / Machine Learning', nameVi: 'AI / Máy học', icon: 'brain' },
  { slug: 'data', name: 'Data Engineering', nameVi: 'Kỹ thuật dữ liệu', icon: 'bar-chart' },
  { slug: 'security', name: 'Security', nameVi: 'An ninh mạng', icon: 'shield' },
  { slug: 'qa', name: 'QA / Testing', nameVi: 'Kiểm thử (QA)', icon: 'check-circle' },
  { slug: 'system-design', name: 'System Design', nameVi: 'Thiết kế hệ thống', icon: 'sitemap' },
  { slug: 'general', name: 'General', nameVi: 'Tổng quát', icon: 'users' },
];

const COMPANY_PROFILES = [
  { slug: 'faang', name: 'FAANG / Big Tech', rigor: 5, styleDescriptor: 'A large global tech company (FAANG-style). Deep, rigorous, follow-up heavy. Expects precise terminology, complexity analysis, and trade-off reasoning. Politely relentless; probes every claim.' },
  { slug: 'vn-product', name: 'Công ty product Việt Nam', rigor: 4, styleDescriptor: 'A Vietnamese product company. Values solid fundamentals plus real system-design depth and ownership. Practical, scenario-driven; asks how you would ship and operate it.' },
  { slug: 'outsourcing', name: 'Outsourcing / Agency', rigor: 3, styleDescriptor: 'A Vietnamese outsourcing/agency. Heavy on fundamentals and clear English communication. Broad coverage over extreme depth; expects you to explain concepts a client could follow.' },
  { slug: 'startup', name: 'Startup giai đoạn đầu', rigor: 3, styleDescriptor: 'An early-stage startup. Pragmatic and scrappy; values shipping, breadth, and judgement under ambiguity over textbook perfection.' },
  { slug: 'fintech', name: 'Fintech / Ngân hàng', rigor: 5, styleDescriptor: 'A fintech / bank. Correctness, security, data consistency and compliance come first. Expects rigor on transactions, idempotency, auditing, and failure handling; low tolerance for hand-waving on edge cases.' },
  { slug: 'ecommerce', name: 'E-commerce quy mô lớn', rigor: 4, styleDescriptor: 'A high-traffic e-commerce company. Focus on scalability, caching, consistency at scale, peak-load (sale events) handling, and pragmatic trade-offs between latency, cost and correctness.' },
  { slug: 'enterprise', name: 'Enterprise / Tập đoàn', rigor: 4, styleDescriptor: 'A large enterprise/corporate. Values maintainability, clear design, documentation, process, and long-term stability over cleverness. Asks about testing, governance, and working within established architecture.' },
  { slug: 'gaming', name: 'Game studio', rigor: 4, styleDescriptor: 'A game studio. Performance-obsessed: memory, latency, real-time systems, and low-level optimisation. Expects strong CS fundamentals and hands-on problem solving under tight constraints.' },
  { slug: 'ai-company', name: 'Công ty AI / Data', rigor: 5, styleDescriptor: 'An AI/data company. Probes ML fundamentals, data pipelines, evaluation rigor, and the engineering around models (serving, latency, cost). Expects clear reasoning about trade-offs and failure modes.' },
  { slug: 'consulting', name: 'Tư vấn / SI', rigor: 3, styleDescriptor: 'A consulting / systems-integrator. Values breadth, communication, requirement clarification, and the ability to justify decisions to non-technical stakeholders. Scenario and client-facing heavy.' },
  { slug: 'remote-global', name: 'Remote / Global team', rigor: 4, styleDescriptor: 'A remote-first global team. Strong written communication, autonomy, and async collaboration matter as much as technical depth. Expects clear, self-driven reasoning in fluent English.' },
];

// ── Metadata-only tracks (positions) + topics. No seeded questions — admins fill
// them via the AI generator (/admin/interview/generate). Idempotent by slug. The
// 3 fully-seeded tracks (nodejs-backend, database, behavioral) live in TRACKS. ──
type MetaTopic = { slug: string; name: string; nameVi: string; weight: number };
type MetaTrack = { slug: string; name: string; nameVi: string; domainSlug: string; topics: MetaTopic[] };

const TRACKS_META: MetaTrack[] = [
  // ─ Backend ─
  { slug: 'java-backend', name: 'Java / Spring Backend', nameVi: 'Java / Spring Backend', domainSlug: 'backend', topics: [
    { slug: 'java-oop', name: 'OOP & Design Principles', nameVi: 'OOP & Nguyên lý thiết kế', weight: 3 },
    { slug: 'java-spring', name: 'Spring & Dependency Injection', nameVi: 'Spring & Dependency Injection', weight: 3 },
    { slug: 'java-concurrency', name: 'Concurrency & JVM', nameVi: 'Đa luồng & JVM', weight: 2 },
    { slug: 'java-collections', name: 'Collections & Generics', nameVi: 'Collections & Generics', weight: 2 },
  ] },
  { slug: 'python-backend', name: 'Python Backend', nameVi: 'Python Backend', domainSlug: 'backend', topics: [
    { slug: 'py-language', name: 'Language internals & data model', nameVi: 'Nội tại ngôn ngữ & data model', weight: 3 },
    { slug: 'py-async', name: 'Async & concurrency (asyncio, GIL)', nameVi: 'Bất đồng bộ & đồng thời (asyncio, GIL)', weight: 2 },
    { slug: 'py-web', name: 'Django / FastAPI', nameVi: 'Django / FastAPI', weight: 3 },
  ] },
  { slug: 'go-backend', name: 'Go Backend', nameVi: 'Go Backend', domainSlug: 'backend', topics: [
    { slug: 'go-concurrency', name: 'Goroutines & channels', nameVi: 'Goroutines & channels', weight: 3 },
    { slug: 'go-language', name: 'Interfaces, memory & error handling', nameVi: 'Interface, bộ nhớ & xử lý lỗi', weight: 2 },
  ] },
  { slug: 'dotnet-backend', name: '.NET / C# Backend', nameVi: '.NET / C# Backend', domainSlug: 'backend', topics: [
    { slug: 'csharp-language', name: 'C# language & CLR', nameVi: 'Ngôn ngữ C# & CLR', weight: 3 },
    { slug: 'dotnet-async', name: 'async/await & TPL', nameVi: 'async/await & TPL', weight: 2 },
    { slug: 'aspnet-core', name: 'ASP.NET Core & EF', nameVi: 'ASP.NET Core & EF', weight: 3 },
  ] },
  { slug: 'api-design', name: 'API & Microservices', nameVi: 'API & Microservices', domainSlug: 'backend', topics: [
    { slug: 'rest-design', name: 'REST / gRPC design', nameVi: 'Thiết kế REST / gRPC', weight: 3 },
    { slug: 'auth-security', name: 'AuthN/AuthZ (JWT, OAuth2)', nameVi: 'Xác thực/Phân quyền (JWT, OAuth2)', weight: 3 },
    { slug: 'msvc-patterns', name: 'Microservice patterns & messaging', nameVi: 'Mẫu microservice & message queue', weight: 2 },
  ] },
  // ─ Frontend ─
  { slug: 'react-frontend', name: 'React / Next.js', nameVi: 'React / Next.js', domainSlug: 'frontend', topics: [
    { slug: 'react-hooks', name: 'Hooks & rendering model', nameVi: 'Hooks & cơ chế render', weight: 3 },
    { slug: 'react-state', name: 'State management & data fetching', nameVi: 'Quản lý state & data fetching', weight: 2 },
    { slug: 'react-perf', name: 'Performance & re-render', nameVi: 'Hiệu năng & re-render', weight: 2 },
    { slug: 'nextjs-ssr', name: 'Next.js SSR/SSG & routing', nameVi: 'Next.js SSR/SSG & routing', weight: 2 },
  ] },
  { slug: 'vue-frontend', name: 'Vue.js', nameVi: 'Vue.js', domainSlug: 'frontend', topics: [
    { slug: 'vue-reactivity', name: 'Reactivity & composition API', nameVi: 'Reactivity & Composition API', weight: 3 },
    { slug: 'vue-ecosystem', name: 'Router, Pinia & ecosystem', nameVi: 'Router, Pinia & hệ sinh thái', weight: 2 },
  ] },
  { slug: 'js-fundamentals', name: 'JavaScript / TypeScript', nameVi: 'JavaScript / TypeScript', domainSlug: 'frontend', topics: [
    { slug: 'js-core', name: 'Closures, prototypes, this, event loop', nameVi: 'Closure, prototype, this, event loop', weight: 3 },
    { slug: 'ts-types', name: 'TypeScript type system', nameVi: 'Hệ kiểu TypeScript', weight: 2 },
    { slug: 'web-fundamentals', name: 'Browser, DOM, CSS & web perf', nameVi: 'Trình duyệt, DOM, CSS & hiệu năng web', weight: 2 },
  ] },
  // ─ Database ─
  { slug: 'sql-rdbms', name: 'SQL / RDBMS', nameVi: 'SQL / RDBMS', domainSlug: 'database', topics: [
    { slug: 'sql-queries', name: 'Query optimisation & EXPLAIN', nameVi: 'Tối ưu truy vấn & EXPLAIN', weight: 3 },
    { slug: 'sql-design', name: 'Schema design & normalisation', nameVi: 'Thiết kế schema & chuẩn hoá', weight: 2 },
    { slug: 'sql-tx', name: 'Transactions, locking & isolation', nameVi: 'Transaction, khoá & isolation', weight: 3 },
  ] },
  { slug: 'nosql', name: 'NoSQL (Mongo / Redis)', nameVi: 'NoSQL (Mongo / Redis)', domainSlug: 'database', topics: [
    { slug: 'nosql-modeling', name: 'Document/KV data modeling', nameVi: 'Mô hình dữ liệu Document/KV', weight: 3 },
    { slug: 'nosql-scaling', name: 'Sharding, replication & consistency', nameVi: 'Sharding, replication & nhất quán', weight: 2 },
  ] },
  // ─ DevOps ─
  { slug: 'cicd', name: 'CI/CD', nameVi: 'CI/CD', domainSlug: 'devops', topics: [
    { slug: 'cicd-pipelines', name: 'Pipelines & GitOps', nameVi: 'Pipeline & GitOps', weight: 3 },
    { slug: 'cicd-strategy', name: 'Deploy strategies (blue-green, canary)', nameVi: 'Chiến lược deploy (blue-green, canary)', weight: 2 },
  ] },
  { slug: 'docker-k8s', name: 'Docker & Kubernetes', nameVi: 'Docker & Kubernetes', domainSlug: 'devops', topics: [
    { slug: 'docker-core', name: 'Containers, images & networking', nameVi: 'Container, image & mạng', weight: 3 },
    { slug: 'k8s-core', name: 'Pods, services, scaling & probes', nameVi: 'Pod, service, scaling & probe', weight: 3 },
    { slug: 'k8s-ops', name: 'Config, secrets & troubleshooting', nameVi: 'Config, secret & xử lý sự cố', weight: 2 },
  ] },
  { slug: 'sre-observability', name: 'SRE & Observability', nameVi: 'SRE & Observability', domainSlug: 'devops', topics: [
    { slug: 'sre-slo', name: 'SLI/SLO/SLA & error budgets', nameVi: 'SLI/SLO/SLA & error budget', weight: 3 },
    { slug: 'observability', name: 'Logging, metrics & tracing', nameVi: 'Logging, metrics & tracing', weight: 2 },
  ] },
  // ─ Cloud & VPS ─
  { slug: 'aws-cloud', name: 'AWS / Cloud', nameVi: 'AWS / Cloud', domainSlug: 'cloud', topics: [
    { slug: 'aws-compute', name: 'Compute, storage & networking', nameVi: 'Compute, storage & networking', weight: 3 },
    { slug: 'cloud-arch', name: 'Scalability, cost & well-architected', nameVi: 'Khả năng mở rộng, chi phí & kiến trúc chuẩn', weight: 2 },
  ] },
  { slug: 'linux-vps', name: 'Linux / VPS Administration', nameVi: 'Quản trị Linux / VPS', domainSlug: 'cloud', topics: [
    { slug: 'linux-core', name: 'Processes, permissions & filesystem', nameVi: 'Tiến trình, quyền & filesystem', weight: 3 },
    { slug: 'vps-ops', name: 'Nginx, systemd, TLS & hardening', nameVi: 'Nginx, systemd, TLS & bảo mật', weight: 2 },
    { slug: 'linux-debug', name: 'Performance & troubleshooting', nameVi: 'Hiệu năng & gỡ lỗi', weight: 2 },
  ] },
  // ─ Networking ─
  { slug: 'network-fundamentals', name: 'Network Fundamentals', nameVi: 'Nền tảng mạng', domainSlug: 'networking', topics: [
    { slug: 'net-tcpip', name: 'TCP/IP, DNS & HTTP(S)', nameVi: 'TCP/IP, DNS & HTTP(S)', weight: 3 },
    { slug: 'net-security', name: 'TLS, firewalls & load balancing', nameVi: 'TLS, tường lửa & cân bằng tải', weight: 2 },
  ] },
  // ─ Mobile ─
  { slug: 'ios-swift', name: 'iOS (Swift)', nameVi: 'iOS (Swift)', domainSlug: 'mobile', topics: [
    { slug: 'swift-language', name: 'Swift, memory (ARC) & optionals', nameVi: 'Swift, bộ nhớ (ARC) & optional', weight: 3 },
    { slug: 'ios-ui', name: 'SwiftUI / UIKit & lifecycle', nameVi: 'SwiftUI / UIKit & vòng đời', weight: 2 },
  ] },
  { slug: 'android-kotlin', name: 'Android (Kotlin)', nameVi: 'Android (Kotlin)', domainSlug: 'mobile', topics: [
    { slug: 'kotlin-language', name: 'Kotlin, coroutines & null safety', nameVi: 'Kotlin, coroutine & null safety', weight: 3 },
    { slug: 'android-arch', name: 'Jetpack, lifecycle & architecture', nameVi: 'Jetpack, vòng đời & kiến trúc', weight: 2 },
  ] },
  { slug: 'flutter-mobile', name: 'Flutter / React Native', nameVi: 'Flutter / React Native', domainSlug: 'mobile', topics: [
    { slug: 'crossplatform-core', name: 'Widget/component tree & state', nameVi: 'Cây widget/component & state', weight: 3 },
    { slug: 'crossplatform-perf', name: 'Performance & native bridges', nameVi: 'Hiệu năng & cầu nối native', weight: 2 },
  ] },
  // ─ AI / ML ─
  { slug: 'ml-fundamentals', name: 'ML Fundamentals', nameVi: 'Nền tảng ML', domainSlug: 'ai-ml', topics: [
    { slug: 'ml-core', name: 'Supervised learning & evaluation', nameVi: 'Học có giám sát & đánh giá', weight: 3 },
    { slug: 'ml-overfitting', name: 'Bias-variance, regularisation', nameVi: 'Bias-variance, regularisation', weight: 2 },
  ] },
  { slug: 'deep-learning', name: 'Deep Learning', nameVi: 'Deep Learning', domainSlug: 'ai-ml', topics: [
    { slug: 'dl-nn', name: 'Neural nets, backprop & training', nameVi: 'Mạng nơ-ron, backprop & huấn luyện', weight: 3 },
    { slug: 'dl-arch', name: 'CNN / RNN / Transformer', nameVi: 'CNN / RNN / Transformer', weight: 2 },
  ] },
  { slug: 'llm-genai', name: 'LLM / GenAI Engineering', nameVi: 'Kỹ thuật LLM / GenAI', domainSlug: 'ai-ml', topics: [
    { slug: 'llm-core', name: 'Prompting, RAG & embeddings', nameVi: 'Prompting, RAG & embedding', weight: 3 },
    { slug: 'llm-ops', name: 'Serving, evaluation & guardrails', nameVi: 'Triển khai, đánh giá & guardrail', weight: 2 },
  ] },
  // ─ Data Engineering ─
  { slug: 'data-engineering', name: 'Data Engineering', nameVi: 'Kỹ thuật dữ liệu', domainSlug: 'data', topics: [
    { slug: 'data-pipelines', name: 'ETL/ELT & orchestration', nameVi: 'ETL/ELT & orchestration', weight: 3 },
    { slug: 'data-warehouse', name: 'Warehousing & modeling', nameVi: 'Kho dữ liệu & mô hình hoá', weight: 2 },
    { slug: 'data-bigdata', name: 'Spark & streaming (Kafka)', nameVi: 'Spark & streaming (Kafka)', weight: 2 },
  ] },
  // ─ Security ─
  { slug: 'appsec', name: 'Application Security', nameVi: 'Bảo mật ứng dụng', domainSlug: 'security', topics: [
    { slug: 'owasp', name: 'OWASP Top 10 & secure coding', nameVi: 'OWASP Top 10 & code an toàn', weight: 3 },
    { slug: 'crypto-basics', name: 'Auth, sessions & cryptography', nameVi: 'Xác thực, session & mật mã', weight: 2 },
  ] },
  { slug: 'pentest', name: 'Penetration Testing', nameVi: 'Kiểm thử xâm nhập', domainSlug: 'security', topics: [
    { slug: 'pentest-web', name: 'Web exploitation & recon', nameVi: 'Khai thác web & do thám', weight: 3 },
    { slug: 'pentest-net', name: 'Network & privilege escalation', nameVi: 'Mạng & leo thang đặc quyền', weight: 2 },
  ] },
  // ─ QA / Testing ─
  { slug: 'qa-automation', name: 'Test Automation', nameVi: 'Kiểm thử tự động', domainSlug: 'qa', topics: [
    { slug: 'test-strategy', name: 'Test pyramid & strategy', nameVi: 'Kim tự tháp test & chiến lược', weight: 3 },
    { slug: 'test-automation', name: 'E2E/API automation frameworks', nameVi: 'Framework tự động E2E/API', weight: 2 },
  ] },
  { slug: 'qa-manual', name: 'Manual / QA Analyst', nameVi: 'Kiểm thử thủ công / QA', domainSlug: 'qa', topics: [
    { slug: 'test-design', name: 'Test case design & techniques', nameVi: 'Thiết kế test case & kỹ thuật', weight: 3 },
    { slug: 'bug-lifecycle', name: 'Bug lifecycle & reporting', nameVi: 'Vòng đời bug & báo cáo', weight: 2 },
  ] },
  // ─ System Design ─
  { slug: 'system-design', name: 'System Design', nameVi: 'Thiết kế hệ thống', domainSlug: 'system-design', topics: [
    { slug: 'sd-fundamentals', name: 'Scalability, caching & load balancing', nameVi: 'Mở rộng, cache & cân bằng tải', weight: 3 },
    { slug: 'sd-data', name: 'Data storage, sharding & consistency', nameVi: 'Lưu trữ, sharding & nhất quán', weight: 3 },
    { slug: 'sd-cases', name: 'Case studies (feed, chat, URL shortener)', nameVi: 'Bài toán thực tế (feed, chat, rút gọn URL)', weight: 2 },
  ] },
  // ─ General ─
  { slug: 'coding-dsa', name: 'Coding & Data Structures', nameVi: 'Coding & Cấu trúc dữ liệu', domainSlug: 'general', topics: [
    { slug: 'dsa-core', name: 'Arrays, strings, hashing & complexity', nameVi: 'Mảng, chuỗi, hashing & độ phức tạp', weight: 3 },
    { slug: 'dsa-advanced', name: 'Trees, graphs & dynamic programming', nameVi: 'Cây, đồ thị & quy hoạch động', weight: 2 },
  ] },
];

const TRACKS: TrackSeed[] = [
  {
    slug: 'nodejs-backend', name: 'Node.js Backend Engineer', nameVi: 'Node.js Backend', domainSlug: 'backend',
    topics: [
      {
        slug: 'nodejs-event-loop', name: 'Event Loop', nameVi: 'Vòng lặp sự kiện', weight: 3,
        concepts: [
          {
            slug: 'event-loop-model', name: 'Event loop model & phases',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'Giải thích Node.js event loop hoạt động như thế nào? Kể tên các phase chính và cho biết vì sao Node được coi là "single-threaded nhưng non-blocking".',
                bodyEn: 'Explain how the Node.js event loop works. Name its main phases and explain why Node is described as "single-threaded but non-blocking".',
                referenceAnswer: 'Node chạy JS trên một luồng duy nhất với một event loop do libuv cung cấp, đi qua các phase: timers (setTimeout/setInterval), pending callbacks, poll (I/O), check (setImmediate), close callbacks. Giữa mỗi phase, microtask queue (Promise) và process.nextTick được rút cạn. I/O được đẩy xuống thread pool của libuv hoặc kernel async, nên luồng JS không bị chặn — "single-threaded" cho code JS nhưng "non-blocking" nhờ I/O bất đồng bộ.',
                referenceAnswerEn: 'Node runs JS on a single thread driven by libuv\'s event loop, which cycles through phases: timers (setTimeout/setInterval), pending callbacks, poll (I/O), check (setImmediate), close callbacks. Between phases the microtask queue (Promises) and process.nextTick are drained. Actual I/O is offloaded to libuv\'s thread pool or the kernel\'s async facilities, so the JS thread never blocks — "single-threaded" for JS code but "non-blocking" thanks to async I/O.',
                rubric: [
                  { id: 'c1', criterion: 'Nêu Node chạy JS một luồng + event loop của libuv', weight: 0.25 },
                  { id: 'c2', criterion: 'Kể tên các phase (timers, poll, check, close) đúng thứ tự', weight: 0.3 },
                  { id: 'c3', criterion: 'Giải thích I/O được offload (libuv thread pool / kernel) nên không chặn', weight: 0.25 },
                  { id: 'c4', criterion: 'Phân biệt microtask được rút cạn giữa các phase', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'States Node runs JS single-threaded on libuv\'s event loop', weight: 0.25 },
                  { id: 'c2', criterion: 'Names the phases (timers, poll, check, close) in order', weight: 0.3 },
                  { id: 'c3', criterion: 'Explains I/O is offloaded (libuv thread pool / kernel) so it is non-blocking', weight: 0.25 },
                  { id: 'c4', criterion: 'Notes microtasks drain between phases', weight: 0.2 },
                ],
                mustMention: ['event loop', 'phase', 'non-blocking'],
                shouldMention: ['libuv', 'poll', 'timers', 'thread pool', 'setImmediate'],
                redFlags: ['Node.js là đa luồng mặc định', 'Node chạy mỗi request một thread', 'Node is multi-threaded by default'],
                synonyms: { 'non-blocking': ['non blocking', 'bất đồng bộ', 'không chặn'], 'thread pool': ['threadpool', 'nhóm luồng'], 'event loop': ['vòng lặp sự kiện', 'eventloop'], 'phase': ['phases', 'giai đoạn'] },
                tags: ['event-loop', 'libuv', 'async'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Một hàm đồng bộ nặng CPU (ví dụ tính toán lớn hoặc JSON.parse chuỗi khổng lồ) ảnh hưởng thế nào tới event loop? Làm sao phát hiện và tránh chặn?',
                bodyEn: 'How does a heavy synchronous CPU-bound function (e.g. a big computation or JSON.parse of a huge string) affect the event loop? How do you detect and avoid blocking?',
                referenceAnswer: 'Vì JS chạy trên một luồng, một hàm sync nặng CPU sẽ chiếm luồng và chặn toàn bộ event loop: mọi request/callback khác phải chờ, latency tăng vọt, health check có thể timeout. Cách tránh: chia nhỏ tác vụ (chunking + setImmediate), đẩy sang worker_threads hoặc child process, dùng thư viện native/stream cho parse lớn. Phát hiện bằng cách đo event loop lag (perf_hooks.monitorEventLoopDelay), theo dõi p99 latency.',
                referenceAnswerEn: 'Because JS runs on one thread, a heavy sync CPU function holds the thread and blocks the whole event loop: every other request/callback waits, latency spikes, health checks may time out. To avoid it: chunk the work (chunking + setImmediate), move it to worker_threads or a child process, use native/streaming libraries for large parsing. Detect it by measuring event loop lag (perf_hooks.monitorEventLoopDelay) and watching p99 latency.',
                rubric: [
                  { id: 'c1', criterion: 'Giải thích code sync nặng chặn cả loop vì một luồng', weight: 0.3 },
                  { id: 'c2', criterion: 'Nêu hậu quả cụ thể (mọi request chờ, latency, timeout)', weight: 0.2 },
                  { id: 'c3', criterion: 'Đề xuất worker_threads / child process / chunking', weight: 0.3 },
                  { id: 'c4', criterion: 'Cách đo event loop lag để phát hiện', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Explains heavy sync code blocks the whole loop (single thread)', weight: 0.3 },
                  { id: 'c2', criterion: 'Names concrete consequences (all requests wait, latency, timeout)', weight: 0.2 },
                  { id: 'c3', criterion: 'Proposes worker_threads / child process / chunking', weight: 0.3 },
                  { id: 'c4', criterion: 'How to measure event loop lag to detect it', weight: 0.2 },
                ],
                mustMention: ['chặn', 'worker', 'một luồng'],
                shouldMention: ['worker_threads', 'event loop lag', 'setImmediate', 'child process'],
                redFlags: ['thêm CPU sẽ tự động chạy song song', 'adding CPU runs it in parallel automatically'],
                synonyms: { 'chặn': ['block', 'blocking', 'chặn luồng', 'blocks'], 'worker': ['worker_threads', 'worker thread', 'luồng phụ'], 'một luồng': ['single thread', 'single-threaded', 'đơn luồng'] },
                tags: ['event-loop', 'cpu-bound', 'performance'],
              },
            ],
          },
          {
            slug: 'microtask-vs-macrotask', name: 'Microtask vs macrotask',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'Phân biệt microtask queue và macrotask queue trong Node. Với đoạn code có cả setTimeout(fn,0) và Promise.resolve().then(fn), cái nào chạy trước? Vì sao?',
                bodyEn: 'Distinguish the microtask queue from the macrotask queue in Node. Given code with both setTimeout(fn,0) and Promise.resolve().then(fn), which runs first, and why?',
                referenceAnswer: 'Macrotask gồm setTimeout/setInterval/setImmediate/I/O callbacks — mỗi phase của event loop xử lý chúng. Microtask gồm Promise.then/catch/finally và queueMicrotask; process.nextTick ưu tiên cao hơn cả microtask. Sau mỗi callback, Node rút CẠN toàn bộ microtask queue trước khi sang macrotask tiếp theo. Nên Promise.then chạy TRƯỚC setTimeout(fn,0) dù timeout là 0.',
                referenceAnswerEn: 'Macrotasks include setTimeout/setInterval/setImmediate/I/O callbacks — each event-loop phase handles them. Microtasks include Promise.then/catch/finally and queueMicrotask; process.nextTick has even higher priority than microtasks. After each callback Node fully DRAINS the microtask queue before moving to the next macrotask. So Promise.then runs BEFORE setTimeout(fn,0) even with a 0 timeout.',
                rubric: [
                  { id: 'c1', criterion: 'Định nghĩa đúng microtask (Promise) vs macrotask (setTimeout/IO)', weight: 0.3 },
                  { id: 'c2', criterion: 'Nêu microtask được rút cạn giữa mỗi macrotask', weight: 0.3 },
                  { id: 'c3', criterion: 'Kết luận Promise.then chạy trước setTimeout(0) + lý do', weight: 0.3 },
                  { id: 'c4', criterion: 'Đề cập process.nextTick ưu tiên hơn microtask', weight: 0.1 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Correctly defines microtask (Promise) vs macrotask (setTimeout/IO)', weight: 0.3 },
                  { id: 'c2', criterion: 'States microtasks drain between each macrotask', weight: 0.3 },
                  { id: 'c3', criterion: 'Concludes Promise.then runs before setTimeout(0) + why', weight: 0.3 },
                  { id: 'c4', criterion: 'Mentions process.nextTick outranks microtasks', weight: 0.1 },
                ],
                mustMention: ['microtask', 'macrotask', 'promise'],
                shouldMention: ['nextTick', 'queueMicrotask', 'rút cạn', 'setTimeout'],
                redFlags: ['setTimeout(0) luôn chạy trước Promise', 'setTimeout(0) always runs before Promise'],
                synonyms: { 'microtask': ['micro task', 'microtask queue', 'promise queue', 'hàng đợi vi mô'], 'macrotask': ['macro task', 'task queue', 'macrotask queue'], 'rút cạn': ['drain', 'drained', 'xử lý hết', 'flush'] },
                tags: ['event-loop', 'microtask', 'promise'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'process.nextTick khác gì so với một Promise microtask? Vì sao lạm dụng process.nextTick có thể gây "starvation" cho event loop?',
                bodyEn: 'How does process.nextTick differ from a Promise microtask? Why can overusing process.nextTick cause event-loop "starvation"?',
                referenceAnswer: 'process.nextTick đẩy callback vào một hàng đợi riêng được xử lý NGAY sau operation hiện tại, TRƯỚC cả microtask (Promise). Vì nextTick queue được rút cạn hoàn toàn trước khi loop đi tiếp, nếu bạn liên tục schedule nextTick bên trong nextTick, event loop không bao giờ tới phase I/O/timers → starvation. Nên dùng setImmediate khi muốn nhường loop.',
                referenceAnswerEn: 'process.nextTick queues a callback in its own queue processed RIGHT after the current operation, BEFORE even microtasks (Promises). Because the nextTick queue is fully drained before the loop advances, if you keep scheduling nextTick inside nextTick the loop never reaches the I/O/timer phases → starvation. Use setImmediate when you want to yield the loop.',
                rubric: [
                  { id: 'c1', criterion: 'nextTick chạy trước cả Promise microtask', weight: 0.3 },
                  { id: 'c2', criterion: 'Giải thích cơ chế starvation (nextTick lồng nhau chặn loop)', weight: 0.4 },
                  { id: 'c3', criterion: 'Đề xuất setImmediate để nhường loop', weight: 0.3 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'nextTick runs before Promise microtasks', weight: 0.3 },
                  { id: 'c2', criterion: 'Explains the starvation mechanism (nested nextTick blocks loop)', weight: 0.4 },
                  { id: 'c3', criterion: 'Proposes setImmediate to yield the loop', weight: 0.3 },
                ],
                mustMention: ['nexttick', 'starvation'],
                shouldMention: ['setImmediate', 'microtask', 'I/O'],
                redFlags: ['nextTick chạy sau setTimeout', 'nextTick runs after setTimeout'],
                synonyms: { 'nexttick': ['process.nexttick', 'next tick'], 'starvation': ['đói', 'bỏ đói', 'starve', 'starved'] },
                tags: ['event-loop', 'nexttick', 'starvation'],
              },
            ],
          },
        ],
      },
      {
        slug: 'nodejs-async', name: 'Async Patterns', nameVi: 'Mẫu bất đồng bộ', weight: 2,
        concepts: [
          {
            slug: 'promise-async-await', name: 'Promises & async/await',
            questions: [
              {
                level: 'JUNIOR', difficulty: 2,
                body: 'async/await khác Promise.then() như thế nào? Từ khoá await có "chặn" luồng không?',
                bodyEn: 'How does async/await differ from Promise.then()? Does the await keyword "block" the thread?',
                referenceAnswer: 'async/await là cú pháp đường trên Promise: một hàm async luôn trả về Promise, await tạm dừng thực thi của hàm đó cho tới khi Promise resolve rồi trả về giá trị đã unwrap. await KHÔNG chặn luồng — nó chỉ tạm dừng hàm async hiện tại và trả quyền điều khiển về event loop; khi Promise xong, phần còn lại chạy tiếp như một microtask.',
                referenceAnswerEn: 'async/await is syntactic sugar over Promises: an async function always returns a Promise, and await pauses that function until the Promise resolves, then returns the unwrapped value. await does NOT block the thread — it only suspends the current async function and yields control back to the event loop; when the Promise settles, the rest resumes as a microtask.',
                rubric: [
                  { id: 'c1', criterion: 'async fn trả về Promise, await unwrap giá trị', weight: 0.3 },
                  { id: 'c2', criterion: 'await KHÔNG chặn luồng, chỉ tạm dừng hàm async', weight: 0.4 },
                  { id: 'c3', criterion: 'Nêu tương đương với .then() (syntactic sugar)', weight: 0.3 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'async fn returns a Promise; await unwraps the value', weight: 0.3 },
                  { id: 'c2', criterion: 'await does NOT block the thread, only suspends the async fn', weight: 0.4 },
                  { id: 'c3', criterion: 'Notes it is equivalent to .then() (syntactic sugar)', weight: 0.3 },
                ],
                mustMention: ['promise', 'await', 'không chặn'],
                shouldMention: ['microtask', 'syntactic sugar', 'tạm dừng'],
                redFlags: ['await chặn cả event loop', 'await blocks the event loop'],
                synonyms: { 'không chặn': ['non-blocking', 'không block', 'does not block', 'không chặn luồng'], 'await': ['từ khoá await'], 'promise': ['lời hứa'] },
                tags: ['async', 'promise', 'async-await'],
              },
              {
                level: 'MID', difficulty: 3,
                body: 'Bạn cần gọi 3 API độc lập rồi tổng hợp kết quả. So sánh `await` từng cái trong vòng lặp với Promise.all(). Khi nào KHÔNG nên dùng Promise.all?',
                bodyEn: 'You must call 3 independent APIs then combine the results. Compare awaiting each in a loop vs Promise.all(). When should you NOT use Promise.all?',
                referenceAnswer: 'await tuần tự trong vòng lặp chạy lần lượt: tổng thời gian = tổng các call → chậm khi độc lập. Promise.all() khởi động cả 3 song song, tổng thời gian ≈ call chậm nhất. Nhược điểm Promise.all: fail-fast — một Promise reject là cả nhóm reject. Khi cần "chờ tất cả bất kể lỗi" dùng Promise.allSettled; khi cần giới hạn đồng thời dùng batching/p-limit.',
                referenceAnswerEn: 'Awaiting sequentially in a loop runs one after another: total time = sum of calls → slow when they are independent. Promise.all() starts all 3 in parallel, total time ≈ the slowest call. Downside of Promise.all: it is fail-fast — one rejection rejects the whole group. When you need "wait for all regardless of errors" use Promise.allSettled; when you must cap concurrency use batching/p-limit.',
                rubric: [
                  { id: 'c1', criterion: 'await-trong-loop là tuần tự (thời gian cộng dồn)', weight: 0.3 },
                  { id: 'c2', criterion: 'Promise.all chạy song song, thời gian ≈ call chậm nhất', weight: 0.3 },
                  { id: 'c3', criterion: 'Nêu fail-fast của Promise.all + allSettled', weight: 0.25 },
                  { id: 'c4', criterion: 'Nhắc giới hạn concurrency khi cần', weight: 0.15 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'await-in-loop is sequential (times add up)', weight: 0.3 },
                  { id: 'c2', criterion: 'Promise.all runs in parallel, time ≈ slowest call', weight: 0.3 },
                  { id: 'c3', criterion: 'Notes Promise.all fail-fast + allSettled', weight: 0.25 },
                  { id: 'c4', criterion: 'Mentions capping concurrency when needed', weight: 0.15 },
                ],
                mustMention: ['promise.all', 'song song', 'tuần tự'],
                shouldMention: ['allsettled', 'fail-fast', 'concurrency', 'batching'],
                redFlags: ['await trong vòng lặp chạy song song', 'await in a loop runs in parallel'],
                synonyms: { 'song song': ['parallel', 'đồng thời', 'concurrent'], 'tuần tự': ['sequential', 'sequentially', 'lần lượt'], 'promise.all': ['promiseall'] },
                tags: ['async', 'promise-all', 'concurrency'],
              },
            ],
          },
          {
            slug: 'stream-backpressure', name: 'Stream backpressure',
            questions: [
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Backpressure trong Node streams là gì? Vì sao `source.pipe(dest)` xử lý được nó, còn tự đọc rồi ghi thủ công thì dễ gây tràn bộ nhớ?',
                bodyEn: 'What is backpressure in Node streams? Why does source.pipe(dest) handle it, while manually reading and writing risks running out of memory?',
                referenceAnswer: 'Backpressure là cơ chế điều tiết khi bên tiêu thụ (writable) chậm hơn bên sản xuất (readable). pipe() tự động xử lý: khi dest.write() trả về false (vượt highWaterMark), pipe pause() source và resume() khi dest phát "drain". Khi tự viết vòng lặp read→write mà bỏ qua giá trị trả về của write() và sự kiện drain, buffer tăng vô hạn → OOM.',
                referenceAnswerEn: 'Backpressure is the flow-control mechanism for when the consumer (writable) is slower than the producer (readable). pipe() handles it automatically: when dest.write() returns false (buffer past highWaterMark), pipe pause()s the source and resume()s on the dest\'s "drain" event. If you hand-write a read→write loop ignoring write()\'s return value and the drain event, the internal buffer grows unbounded → OOM.',
                rubric: [
                  { id: 'c1', criterion: 'Định nghĩa backpressure (producer nhanh hơn consumer)', weight: 0.3 },
                  { id: 'c2', criterion: 'pipe() pause/resume dựa trên write()===false + drain', weight: 0.35 },
                  { id: 'c3', criterion: 'Nêu highWaterMark / buffer', weight: 0.15 },
                  { id: 'c4', criterion: 'Hậu quả bỏ qua backpressure: RAM/OOM', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Defines backpressure (producer faster than consumer)', weight: 0.3 },
                  { id: 'c2', criterion: 'pipe() pauses/resumes based on write()===false + drain', weight: 0.35 },
                  { id: 'c3', criterion: 'Mentions highWaterMark / buffer', weight: 0.15 },
                  { id: 'c4', criterion: 'Consequence of ignoring backpressure: RAM/OOM', weight: 0.2 },
                ],
                mustMention: ['backpressure', 'pipe', 'drain'],
                shouldMention: ['highwatermark', 'buffer', 'writable', 'readable'],
                redFlags: ['stream không bao giờ tốn RAM', 'streams never use memory'],
                synonyms: { 'backpressure': ['back pressure', 'áp lực ngược', 'điều tiết luồng'], 'drain': ['sự kiện drain', 'drain event'], 'pipe': ['.pipe', 'ống dẫn'] },
                tags: ['streams', 'backpressure', 'memory'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'database', name: 'Database Engineer', nameVi: 'Cơ sở dữ liệu', domainSlug: 'backend',
    topics: [
      {
        slug: 'db-indexing', name: 'Indexing', nameVi: 'Đánh chỉ mục', weight: 3,
        concepts: [
          {
            slug: 'btree-index', name: 'B-tree index behavior',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'B-tree index giúp tăng tốc truy vấn như thế nào? Nêu vài trường hợp index KHÔNG được sử dụng dù cột đã có index.',
                bodyEn: 'How does a B-tree index speed up queries? Give a few cases where the index is NOT used even though the column is indexed.',
                referenceAnswer: 'B-tree lưu khoá đã sắp xếp theo cây cân bằng, cho phép tìm kiếm/khoảng/sắp xếp O(log n) thay vì quét toàn bảng O(n). Index không được dùng khi: hàm/biến đổi trên cột (WHERE lower(col)=…); leading wildcard LIKE \'%abc\'; ép kiểu ngầm; độ chọn lọc thấp (optimizer thấy quét bảng rẻ hơn). Xem EXPLAIN để biết plan thực tế.',
                referenceAnswerEn: 'A B-tree stores keys sorted in a balanced tree, enabling lookup/range/sort in O(log n) instead of an O(n) full scan. The index is skipped when: a function/transform is applied to the column (WHERE lower(col)=…); a leading wildcard LIKE \'%abc\'; implicit type casts; low selectivity (the optimizer finds a scan cheaper). Use EXPLAIN to see the real plan.',
                rubric: [
                  { id: 'c1', criterion: 'B-tree = khoá sắp xếp, tra cứu O(log n) thay vì full scan', weight: 0.3 },
                  { id: 'c2', criterion: 'Nêu hỗ trợ range + order by nhờ tính đã sắp xếp', weight: 0.2 },
                  { id: 'c3', criterion: 'Ít nhất 2 trường hợp index bị bỏ qua', weight: 0.35 },
                  { id: 'c4', criterion: 'Nhắc dùng EXPLAIN để kiểm chứng', weight: 0.15 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'B-tree = sorted keys, O(log n) lookup vs full scan', weight: 0.3 },
                  { id: 'c2', criterion: 'Notes range + order-by support from being sorted', weight: 0.2 },
                  { id: 'c3', criterion: 'At least 2 cases the index is skipped', weight: 0.35 },
                  { id: 'c4', criterion: 'Mentions using EXPLAIN to verify', weight: 0.15 },
                ],
                mustMention: ['b-tree', 'sắp xếp', 'full scan'],
                shouldMention: ['explain', 'selectivity', 'wildcard', 'o(log n)'],
                redFlags: ['index luôn được dùng nếu cột có index', 'an indexed column always uses the index'],
                synonyms: { 'b-tree': ['btree', 'b tree', 'cây b'], 'full scan': ['seq scan', 'quét toàn bảng', 'sequential scan'], 'sắp xếp': ['sorted', 'đã sắp xếp'] },
                tags: ['indexing', 'btree', 'query-plan'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Với composite index (a, b, c), thứ tự cột quan trọng ra sao? Giải thích "leftmost prefix" và cho biết truy vấn nào dùng được index này, truy vấn nào thì không.',
                bodyEn: 'For a composite index (a, b, c), why does column order matter? Explain the "leftmost prefix" rule and which queries can use this index versus which cannot.',
                referenceAnswer: 'Composite index sắp xếp theo a, rồi b, rồi c. Leftmost prefix: index chỉ hữu ích khi truy vấn dùng một tiền tố liên tục từ trái: (a), (a,b), (a,b,c). WHERE a=? dùng được; WHERE b=? (bỏ a) KHÔNG dùng được; a=? AND c=? chỉ dùng được phần a. Đặt cột equality trước, range sau.',
                referenceAnswerEn: 'A composite index is sorted by a, then b, then c. Leftmost prefix: the index only helps when the query uses a continuous prefix from the left: (a), (a,b), (a,b,c). WHERE a=? works; WHERE b=? (skipping a) does NOT; a=? AND c=? only uses the a part. Put equality columns first, range columns last.',
                rubric: [
                  { id: 'c1', criterion: 'Index sắp theo thứ tự cột a→b→c', weight: 0.25 },
                  { id: 'c2', criterion: 'Giải thích đúng leftmost prefix', weight: 0.35 },
                  { id: 'c3', criterion: 'Ví dụ dùng được vs không (bỏ cột dẫn đầu)', weight: 0.25 },
                  { id: 'c4', criterion: 'Nhắc equality trước range sau', weight: 0.15 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Index sorts by column order a→b→c', weight: 0.25 },
                  { id: 'c2', criterion: 'Correctly explains leftmost prefix', weight: 0.35 },
                  { id: 'c3', criterion: 'Example that works vs not (skipping leading column)', weight: 0.25 },
                  { id: 'c4', criterion: 'Notes equality before range', weight: 0.15 },
                ],
                mustMention: ['leftmost prefix', 'thứ tự cột'],
                shouldMention: ['equality', 'range', 'composite index', 'selectivity'],
                redFlags: ['thứ tự cột không quan trọng', 'column order does not matter'],
                synonyms: { 'leftmost prefix': ['left-most prefix', 'tiền tố trái', 'prefix trái nhất'], 'thứ tự cột': ['column order', 'thứ tự các cột'], 'composite index': ['index tổng hợp', 'multi-column index'] },
                tags: ['indexing', 'composite-index', 'leftmost-prefix'],
              },
            ],
          },
          {
            slug: 'index-tradeoffs', name: 'Index trade-offs',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'Vì sao KHÔNG nên đánh index cho mọi cột? Nêu các chi phí của việc thêm index.',
                bodyEn: 'Why should you NOT index every column? What are the costs of adding an index?',
                referenceAnswer: 'Mỗi index phải được cập nhật cùng dữ liệu: INSERT/UPDATE/DELETE chậm hơn. Index tốn dung lượng đĩa và RAM. Index trên cột chọn lọc thấp gần như vô dụng. Chỉ đánh index theo truy vấn thực tế (EXPLAIN / slow query log), ưu tiên cột lọc/join/sort có độ chọn lọc cao.',
                referenceAnswerEn: 'Every index must be maintained with the data: INSERT/UPDATE/DELETE get slower. Indexes cost disk and RAM. An index on a low-selectivity column is nearly useless. Only index based on real queries (EXPLAIN / slow query log), favoring high-selectivity filter/join/sort columns.',
                rubric: [
                  { id: 'c1', criterion: 'Index làm chậm ghi (INSERT/UPDATE/DELETE)', weight: 0.35 },
                  { id: 'c2', criterion: 'Tốn dung lượng đĩa/RAM', weight: 0.25 },
                  { id: 'c3', criterion: 'Index cột chọn lọc thấp vô dụng', weight: 0.2 },
                  { id: 'c4', criterion: 'Đánh index theo truy vấn thực tế', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Indexes slow down writes (INSERT/UPDATE/DELETE)', weight: 0.35 },
                  { id: 'c2', criterion: 'Cost disk/RAM', weight: 0.25 },
                  { id: 'c3', criterion: 'Low-selectivity indexes are useless', weight: 0.2 },
                  { id: 'c4', criterion: 'Index according to real queries', weight: 0.2 },
                ],
                mustMention: ['ghi', 'dung lượng', 'chọn lọc'],
                shouldMention: ['insert', 'update', 'selectivity', 'slow query'],
                redFlags: ['thêm index luôn tốt', 'more indexes is always better'],
                synonyms: { 'ghi': ['write', 'writes', 'insert', 'update', 'ghi dữ liệu'], 'dung lượng': ['disk', 'storage', 'bộ nhớ đĩa'], 'chọn lọc': ['selectivity', 'độ chọn lọc'] },
                tags: ['indexing', 'trade-offs', 'write-cost'],
              },
            ],
          },
        ],
      },
      {
        slug: 'db-transactions', name: 'Transactions & Isolation', nameVi: 'Giao dịch & cô lập', weight: 2,
        concepts: [
          {
            slug: 'isolation-levels', name: 'Isolation levels',
            questions: [
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Kể các mức isolation (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) và anomaly mà mỗi mức ngăn được (dirty read, non-repeatable read, phantom read).',
                bodyEn: 'List the isolation levels (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) and the anomaly each one prevents (dirty read, non-repeatable read, phantom read).',
                referenceAnswer: 'READ UNCOMMITTED cho phép dirty read. READ COMMITTED chặn dirty read nhưng còn non-repeatable read. REPEATABLE READ chặn thêm non-repeatable read nhưng lý thuyết còn phantom read (InnoDB dùng gap lock/MVCC hạn chế). SERIALIZABLE chặn tất cả, như thể chạy tuần tự, đổi lại giảm concurrency.',
                referenceAnswerEn: 'READ UNCOMMITTED allows dirty reads. READ COMMITTED prevents dirty reads but still allows non-repeatable reads. REPEATABLE READ also prevents non-repeatable reads but in theory still allows phantom reads (InnoDB limits them with gap locks/MVCC). SERIALIZABLE prevents all, as if transactions ran serially, at the cost of concurrency.',
                rubric: [
                  { id: 'c1', criterion: 'Xếp đúng 4 mức từ lỏng đến chặt', weight: 0.25 },
                  { id: 'c2', criterion: 'Dirty read ↔ READ UNCOMMITTED', weight: 0.2 },
                  { id: 'c3', criterion: 'Non-repeatable read ↔ READ COMMITTED cho phép, REPEATABLE READ chặn', weight: 0.3 },
                  { id: 'c4', criterion: 'Phantom read ↔ SERIALIZABLE', weight: 0.25 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Orders the 4 levels from loosest to strictest', weight: 0.25 },
                  { id: 'c2', criterion: 'Dirty read ↔ READ UNCOMMITTED', weight: 0.2 },
                  { id: 'c3', criterion: 'Non-repeatable read ↔ allowed by READ COMMITTED, prevented by REPEATABLE READ', weight: 0.3 },
                  { id: 'c4', criterion: 'Phantom read ↔ SERIALIZABLE', weight: 0.25 },
                ],
                mustMention: ['dirty read', 'non-repeatable read', 'phantom'],
                shouldMention: ['serializable', 'repeatable read', 'mvcc', 'read committed'],
                redFlags: ['SERIALIZABLE nhanh hơn READ COMMITTED', 'SERIALIZABLE is faster than READ COMMITTED'],
                synonyms: { 'dirty read': ['đọc bẩn', 'dirty-read'], 'non-repeatable read': ['non repeatable read', 'đọc không lặp lại được'], 'phantom': ['phantom read', 'đọc ma', 'bóng ma'] },
                tags: ['transactions', 'isolation', 'anomalies'],
              },
              {
                level: 'MID', difficulty: 3,
                body: 'READ COMMITTED nghĩa là gì? Mô tả một tình huống non-repeatable read xảy ra ở mức này.',
                bodyEn: 'What does READ COMMITTED mean? Describe a non-repeatable read that can happen at this level.',
                referenceAnswer: 'READ COMMITTED: mỗi câu lệnh chỉ thấy dữ liệu đã commit (không dirty read). Nhưng đọc cùng một hàng hai lần trong cùng transaction có thể ra giá trị khác nếu giữa hai lần có transaction khác commit — non-repeatable read. Ví dụ: T1 đọc balance=100; T2 update=50 commit; T1 đọc lại=50.',
                referenceAnswerEn: 'READ COMMITTED: each statement only sees committed data (no dirty reads). But reading the same row twice within one transaction can return different values if another transaction commits in between — a non-repeatable read. Example: T1 reads balance=100; T2 updates to 50 and commits; T1 re-reads 50.',
                rubric: [
                  { id: 'c1', criterion: 'READ COMMITTED chỉ thấy dữ liệu đã commit', weight: 0.4 },
                  { id: 'c2', criterion: 'Định nghĩa non-repeatable read', weight: 0.3 },
                  { id: 'c3', criterion: 'Ví dụ cụ thể hai lần đọc khác nhau', weight: 0.3 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'READ COMMITTED only sees committed data', weight: 0.4 },
                  { id: 'c2', criterion: 'Defines non-repeatable read', weight: 0.3 },
                  { id: 'c3', criterion: 'Concrete example of two differing reads', weight: 0.3 },
                ],
                mustMention: ['committed', 'non-repeatable'],
                shouldMention: ['snapshot', 'dirty read', 'commit'],
                redFlags: ['READ COMMITTED cho phép đọc dữ liệu chưa commit', 'READ COMMITTED allows reading uncommitted data'],
                synonyms: { 'committed': ['đã commit', 'read committed'], 'non-repeatable': ['non repeatable read', 'đọc không lặp lại'] },
                tags: ['transactions', 'read-committed'],
              },
            ],
          },
        ],
      },
      {
        slug: 'db-nplusone', name: 'N+1 Query', nameVi: 'Truy vấn N+1', weight: 2,
        concepts: [
          {
            slug: 'n-plus-one', name: 'The N+1 query problem',
            questions: [
              {
                level: 'MID', difficulty: 3,
                body: 'N+1 query problem là gì? Cho một ví dụ cụ thể và nêu cách khắc phục.',
                bodyEn: 'What is the N+1 query problem? Give a concrete example and how to fix it.',
                referenceAnswer: 'N+1 xảy ra khi 1 truy vấn lấy N bản ghi, rồi lặp qua từng bản ghi chạy thêm 1 truy vấn con → tổng 1 + N. Ví dụ: lấy 100 bài viết (1 query) rồi mỗi bài query tác giả (100 query) = 101 round-trip. Khắc phục: JOIN lấy một lần; eager-load của ORM; hoặc gom id rồi query IN (…) một lần (batching/dataloader).',
                referenceAnswerEn: 'N+1 happens when one query fetches N rows, then you loop over each row running one more sub-query → 1 + N total. Example: fetch 100 posts (1 query) then query each author (100 queries) = 101 round-trips. Fix: JOIN to fetch once; the ORM\'s eager-load; or collect ids and run one IN (…) query (batching/dataloader).',
                rubric: [
                  { id: 'c1', criterion: 'Định nghĩa 1 + N truy vấn (query trong vòng lặp)', weight: 0.4 },
                  { id: 'c2', criterion: 'Ví dụ cụ thể (list + quan hệ con)', weight: 0.25 },
                  { id: 'c3', criterion: 'Khắc phục: JOIN / eager load / IN batching', weight: 0.35 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Defines 1 + N queries (query inside a loop)', weight: 0.4 },
                  { id: 'c2', criterion: 'Concrete example (list + child relation)', weight: 0.25 },
                  { id: 'c3', criterion: 'Fix: JOIN / eager load / IN batching', weight: 0.35 },
                ],
                mustMention: ['n+1', 'join', 'vòng lặp'],
                shouldMention: ['eager', 'batching', 'dataloader', 'in ('],
                redFlags: ['N+1 là tính năng tối ưu', 'N+1 is an optimization'],
                synonyms: { 'n+1': ['n + 1', 'n plus one', 'n cộng 1'], 'join': ['phép join', 'nối bảng'], 'vòng lặp': ['loop', 'lặp', 'in a loop'] },
                tags: ['n-plus-one', 'orm', 'performance'],
              },
              {
                level: 'SENIOR', difficulty: 4,
                body: 'Vì sao ORM rất dễ vô tình tạo N+1? Phân biệt eager vs lazy loading và khi nào JOIN không phải lựa chọn tốt (dùng batch/dataloader thay thế).',
                bodyEn: 'Why do ORMs so easily cause N+1? Distinguish eager vs lazy loading, and when is JOIN not a good choice (use batch/dataloader instead)?',
                referenceAnswer: 'ORM ánh xạ quan hệ thành thuộc tính, nên order.customer trong vòng lặp trông như đọc thuộc tính nhưng thực chất bắn một query — lazy loading ẩn chi phí. Eager (include/join fetch) tránh N+1 nhưng JOIN nhiều quan hệ one-to-many sẽ nhân bản hàng (cartesian). Khi đó batch loading (gom khoá, một query IN, như DataLoader) tốt hơn.',
                referenceAnswerEn: 'ORMs map relations to properties, so order.customer inside a loop looks like a property read but actually fires a query — lazy loading hides the cost. Eager (include/join fetch) avoids N+1, but JOINing many one-to-many relations duplicates rows (cartesian). Then batch loading (collect keys, one IN query, like DataLoader) is better.',
                rubric: [
                  { id: 'c1', criterion: 'Lazy loading ẩn query sau truy cập thuộc tính → dễ N+1', weight: 0.3 },
                  { id: 'c2', criterion: 'Phân biệt eager vs lazy', weight: 0.25 },
                  { id: 'c3', criterion: 'JOIN one-to-many gây nhân bản hàng (cartesian)', weight: 0.25 },
                  { id: 'c4', criterion: 'Batch/dataloader cho nhiều collection', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Lazy loading hides a query behind a property access → easy N+1', weight: 0.3 },
                  { id: 'c2', criterion: 'Distinguishes eager vs lazy', weight: 0.25 },
                  { id: 'c3', criterion: 'JOIN one-to-many duplicates rows (cartesian)', weight: 0.25 },
                  { id: 'c4', criterion: 'Batch/dataloader for many collections', weight: 0.2 },
                ],
                mustMention: ['lazy', 'eager', 'batch'],
                shouldMention: ['dataloader', 'cartesian', 'join fetch', 'include'],
                redFlags: ['JOIN luôn là cách tốt nhất', 'JOIN is always best'],
                synonyms: { 'lazy': ['lazy loading', 'tải lười'], 'eager': ['eager loading', 'tải sớm'], 'batch': ['batching', 'gom lô', 'theo lô'] },
                tags: ['n-plus-one', 'orm', 'eager-lazy'],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'behavioral', name: 'Behavioral (STAR)', nameVi: 'Hành vi (STAR)', domainSlug: 'general',
    topics: [
      {
        slug: 'bhv-conflict', name: 'Conflict & Disagreement', nameVi: 'Xung đột & bất đồng', weight: 2,
        concepts: [
          {
            slug: 'star-conflict', name: 'Handling technical disagreement',
            questions: [
              {
                level: 'MID', difficulty: 3, type: 'BEHAVIORAL',
                body: 'Kể về một lần bạn bất đồng với đồng nghiệp hoặc quản lý về một quyết định kỹ thuật. Bạn đã xử lý thế nào và kết quả ra sao? (Trả lời theo cấu trúc STAR)',
                bodyEn: 'Tell me about a time you disagreed with a colleague or manager on a technical decision. How did you handle it and what was the outcome? (Answer in STAR format.)',
                referenceAnswer: 'STAR mạnh: Situation — bối cảnh cụ thể. Task — vai trò và điều cần đạt. Action — lắng nghe đối phương, đưa dữ liệu/benchmark thay vì cãi cảm tính, đề xuất POC để so sánh khách quan. Result — kết quả có số liệu và bài học. Mấu chốt: tôn trọng, dựa trên bằng chứng, không cá nhân hoá.',
                referenceAnswerEn: 'A strong STAR answer: Situation — a specific context. Task — your role and goal. Action — listen to the other side, bring data/benchmarks instead of arguing from feeling, propose a POC to compare objectively. Result — a measurable outcome and a lesson. Key: respectful, evidence-based, not personal.',
                rubric: [
                  { id: 'c1', criterion: 'Situation: bối cảnh cụ thể, không chung chung', weight: 0.2 },
                  { id: 'c2', criterion: 'Task: vai trò/mục tiêu rõ ràng', weight: 0.15 },
                  { id: 'c3', criterion: 'Action: cụ thể, dựa trên dữ liệu, tôn trọng', weight: 0.35 },
                  { id: 'c4', criterion: 'Result: kết quả có số liệu + bài học', weight: 0.3 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Situation: specific context, not vague', weight: 0.2 },
                  { id: 'c2', criterion: 'Task: clear role/goal', weight: 0.15 },
                  { id: 'c3', criterion: 'Action: concrete, data-driven, respectful', weight: 0.35 },
                  { id: 'c4', criterion: 'Result: measurable outcome + lesson', weight: 0.3 },
                ],
                mustMention: ['bối cảnh', 'hành động', 'kết quả'],
                shouldMention: ['dữ liệu', 'bài học', 'lắng nghe', 'thử nghiệm'],
                redFlags: ['tôi luôn đúng', 'i am always right', 'không bao giờ có bất đồng'],
                synonyms: { 'bối cảnh': ['situation', 'tình huống', 'hoàn cảnh', 'context'], 'hành động': ['action', 'việc tôi làm', 'what i did'], 'kết quả': ['result', 'kết cục', 'outcome'] },
                tags: ['behavioral', 'star', 'conflict'],
              },
              {
                level: 'SENIOR', difficulty: 4, type: 'BEHAVIORAL',
                body: 'Kể về lần bạn phải thuyết phục cả team đi theo một hướng kỹ thuật mà ban đầu đa số phản đối. Bạn xây dựng sự đồng thuận như thế nào? (STAR)',
                bodyEn: 'Tell me about a time you had to convince a team to follow a technical direction most of them initially opposed. How did you build consensus? (STAR)',
                referenceAnswer: 'Lãnh đạo qua ảnh hưởng: Situation — quyết định rủi ro cao, team nghi ngờ. Action — hiểu vì sao họ phản đối, làm POC/benchmark chứng minh, chia rủi ro thành bước nhỏ có thể rollback, mời người phản đối cùng review. Result — team đồng thuận thật, kết quả đo được. Tránh "tôi là senior nên họ phải nghe".',
                referenceAnswerEn: 'Leadership through influence: Situation — a high-risk decision, a skeptical team. Action — understand why they object, prove it with a POC/benchmark, split risk into small rollback-able steps, invite the loudest objector to review. Result — genuine consensus, a measurable outcome. Avoid "I\'m senior so they must obey".',
                rubric: [
                  { id: 'c1', criterion: 'Situation + Task rõ, rủi ro cụ thể', weight: 0.2 },
                  { id: 'c2', criterion: 'Action: lắng nghe + bằng chứng (POC/benchmark)', weight: 0.35 },
                  { id: 'c3', criterion: 'Xây đồng thuận (không áp đặt quyền lực)', weight: 0.25 },
                  { id: 'c4', criterion: 'Result đo được + bài học', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Clear Situation + Task, concrete risk', weight: 0.2 },
                  { id: 'c2', criterion: 'Action: listen + evidence (POC/benchmark)', weight: 0.35 },
                  { id: 'c3', criterion: 'Builds consensus (no power play)', weight: 0.25 },
                  { id: 'c4', criterion: 'Measurable result + lesson', weight: 0.2 },
                ],
                mustMention: ['bối cảnh', 'hành động', 'kết quả'],
                shouldMention: ['đồng thuận', 'benchmark', 'lắng nghe', 'trade-off'],
                redFlags: ['tôi là senior nên họ phải nghe', 'they must obey me'],
                synonyms: { 'bối cảnh': ['situation', 'tình huống', 'context'], 'hành động': ['action', 'what i did'], 'kết quả': ['result', 'outcome'], 'đồng thuận': ['consensus', 'nhất trí'] },
                tags: ['behavioral', 'star', 'influence'],
              },
            ],
          },
        ],
      },
      {
        slug: 'bhv-failure', name: 'Failure & Ownership', nameVi: 'Thất bại & trách nhiệm', weight: 2,
        concepts: [
          {
            slug: 'star-failure', name: 'Learning from failure',
            questions: [
              {
                level: 'MID', difficulty: 3, type: 'BEHAVIORAL',
                body: 'Kể về một nhiệm vụ hoặc dự án bạn từng thất bại. Điều gì đã xảy ra và bạn học được gì? (STAR)',
                bodyEn: 'Tell me about a task or project you failed at. What happened and what did you learn? (STAR)',
                referenceAnswer: 'Dám nhận một thất bại THẬT: Situation — điều gì sai, hậu quả cụ thể. Action — xử lý/giảm thiệt hại và NHẬN phần lỗi của mình thay vì đổ cho hoàn cảnh. Result — bài học cụ thể và thay đổi hành vi đo được sau đó. Nhà tuyển dụng đánh giá sự tự nhận thức và khả năng học.',
                referenceAnswerEn: 'Own a REAL failure: Situation — what went wrong and its concrete impact. Action — how you handled/mitigated it and OWNED your share instead of blaming circumstances. Result — a concrete lesson and a measurable behavior change afterward. Interviewers value self-awareness and the ability to learn.',
                rubric: [
                  { id: 'c1', criterion: 'Thừa nhận thất bại thật + hậu quả', weight: 0.3 },
                  { id: 'c2', criterion: 'Nhận trách nhiệm (không đổ lỗi hoàn toàn)', weight: 0.3 },
                  { id: 'c3', criterion: 'Hành động khắc phục cụ thể', weight: 0.2 },
                  { id: 'c4', criterion: 'Bài học + thay đổi hành vi sau đó', weight: 0.2 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Admits a real failure + impact', weight: 0.3 },
                  { id: 'c2', criterion: 'Takes ownership (not full blame elsewhere)', weight: 0.3 },
                  { id: 'c3', criterion: 'Concrete corrective action', weight: 0.2 },
                  { id: 'c4', criterion: 'Lesson + later behavior change', weight: 0.2 },
                ],
                mustMention: ['bối cảnh', 'trách nhiệm', 'bài học'],
                shouldMention: ['hành động', 'kết quả', 'thay đổi'],
                redFlags: ['tôi chưa từng thất bại', 'i have never failed', 'điểm yếu của tôi là quá cầu toàn'],
                synonyms: { 'bối cảnh': ['situation', 'tình huống', 'context'], 'trách nhiệm': ['ownership', 'nhận lỗi', 'phần lỗi', 'own'], 'bài học': ['lesson', 'điều học được', 'learned'] },
                tags: ['behavioral', 'star', 'failure'],
              },
            ],
          },
          {
            slug: 'star-ownership', name: 'Taking ownership beyond scope',
            questions: [
              {
                level: 'SENIOR', difficulty: 3, type: 'BEHAVIORAL',
                body: 'Kể về lần bạn chủ động nhận trách nhiệm giải quyết một vấn đề nằm ngoài phạm vi được giao. (STAR)',
                bodyEn: 'Tell me about a time you proactively took ownership of a problem outside your assigned scope. (STAR)',
                referenceAnswer: 'Thể hiện ownership: Situation — vấn đề không ai "sở hữu" (flaky test, sự cố prod, nợ kỹ thuật) đang gây hại. Action — chủ động đứng ra: điều tra, huy động đúng người, sửa gốc rễ chứ không vá tạm, tài liệu hoá. Result — tác động đo được cho team/sản phẩm. Nhấn mạnh tác động chung, không khoe cá nhân.',
                referenceAnswerEn: 'Show ownership: Situation — an unowned problem (flaky test, prod incident, tech debt) causing harm. Action — step up proactively: investigate, rally the right people, fix the root cause not a patch, document it. Result — a measurable impact for the team/product. Emphasize shared impact, not personal glory.',
                rubric: [
                  { id: 'c1', criterion: 'Vấn đề ngoài phạm vi, không ai sở hữu, có tác hại', weight: 0.25 },
                  { id: 'c2', criterion: 'Chủ động + hành động cụ thể (sửa gốc rễ)', weight: 0.35 },
                  { id: 'c3', criterion: 'Kết quả đo được cho team/sản phẩm', weight: 0.25 },
                  { id: 'c4', criterion: 'Tài liệu hoá/nâng chuẩn', weight: 0.15 },
                ],
                rubricEn: [
                  { id: 'c1', criterion: 'Out-of-scope, unowned problem with real harm', weight: 0.25 },
                  { id: 'c2', criterion: 'Proactive + concrete action (root-cause fix)', weight: 0.35 },
                  { id: 'c3', criterion: 'Measurable result for team/product', weight: 0.25 },
                  { id: 'c4', criterion: 'Documents / raises the bar', weight: 0.15 },
                ],
                mustMention: ['chủ động', 'hành động', 'kết quả'],
                shouldMention: ['gốc rễ', 'tác động', 'tài liệu'],
                redFlags: ['tôi làm hết một mình để được ghi nhận', 'vá tạm cho xong'],
                synonyms: { 'chủ động': ['proactive', 'proactively', 'tự nguyện', 'đứng ra', 'took ownership'], 'hành động': ['action', 'what i did'], 'kết quả': ['result', 'tác động', 'outcome'] },
                tags: ['behavioral', 'star', 'ownership'],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function main() {
  let domains = 0, tracks = 0, topics = 0, concepts = 0, created = 0, backfilled = 0, skipped = 0, companies = 0;

  for (const d of DOMAINS) {
    await prisma.interviewDomain.upsert({
      where: { slug: d.slug },
      update: { name: d.name, nameVi: d.nameVi, icon: d.icon },
      create: { slug: d.slug, name: d.name, nameVi: d.nameVi, icon: d.icon, status: 'PUBLISHED' },
    });
    domains++;
  }

  for (const cp of COMPANY_PROFILES) {
    await prisma.interviewCompanyProfile.upsert({
      where: { slug: cp.slug },
      update: { name: cp.name, styleDescriptor: cp.styleDescriptor, rigor: cp.rigor },
      create: { slug: cp.slug, name: cp.name, styleDescriptor: cp.styleDescriptor, rigor: cp.rigor, status: 'PUBLISHED' },
    });
    companies++;
  }

  for (const t of TRACKS) {
    const domain = await prisma.interviewDomain.findUnique({ where: { slug: t.domainSlug } });
    if (!domain) continue;
    const track = await prisma.interviewTrack.upsert({
      where: { slug: t.slug },
      update: { name: t.name, nameVi: t.nameVi, domainId: domain.id },
      create: { slug: t.slug, name: t.name, nameVi: t.nameVi, domainId: domain.id, status: 'PUBLISHED' },
    });
    tracks++;

    for (const tp of t.topics) {
      const topic = await prisma.interviewTopic.upsert({
        where: { slug: tp.slug },
        update: { name: tp.name, nameVi: tp.nameVi, weight: tp.weight, trackId: track.id },
        create: { slug: tp.slug, name: tp.name, nameVi: tp.nameVi, weight: tp.weight, trackId: track.id, status: 'PUBLISHED' },
      });
      topics++;

      for (const cSeed of tp.concepts) {
        const concept = await prisma.interviewConcept.upsert({
          where: { slug: cSeed.slug },
          update: { name: cSeed.name, topicId: topic.id },
          create: { slug: cSeed.slug, name: cSeed.name, topicId: topic.id },
        });
        concepts++;

        for (const q of cSeed.questions) {
          const exists = await prisma.interviewQuestion.findFirst({ where: { topicId: topic.id, body: q.body } });
          if (exists) {
            // Backfill English content into rows seeded before the EN columns existed.
            if (!exists.bodyEn || !exists.referenceAnswerEn || exists.rubricEn == null) {
              await prisma.interviewQuestion.update({
                where: { id: exists.id },
                data: { bodyEn: q.bodyEn, referenceAnswerEn: q.referenceAnswerEn, rubricEn: q.rubricEn as never },
              });
              backfilled++;
            } else skipped++;
            continue;
          }
          await prisma.interviewQuestion.create({
            data: {
              topicId: topic.id,
              conceptId: concept.id,
              level: q.level,
              type: q.type ?? 'CONCEPTUAL',
              difficulty: q.difficulty ?? 3,
              body: q.body,
              bodyVi: q.body,
              bodyEn: q.bodyEn,
              referenceAnswer: q.referenceAnswer,
              referenceAnswerEn: q.referenceAnswerEn,
              rubric: q.rubric as never,
              rubricEn: q.rubricEn as never,
              mustMention: q.mustMention,
              shouldMention: q.shouldMention ?? [],
              redFlags: q.redFlags ?? [],
              synonyms: (q.synonyms ?? {}) as never,
              tags: q.tags ?? [],
              source: 'SEED',
              status: 'PUBLISHED',
              rubricReviewed: false, // ← human must review; flagged low-confidence
            },
          });
          created++;
        }
      }
    }
  }

  // Metadata-only tracks/topics (positions). No questions — admins AI-generate them.
  let metaTracks = 0, metaTopics = 0;
  for (const t of TRACKS_META) {
    const domain = await prisma.interviewDomain.findUnique({ where: { slug: t.domainSlug } });
    if (!domain) continue;
    const track = await prisma.interviewTrack.upsert({
      where: { slug: t.slug },
      update: { name: t.name, nameVi: t.nameVi, domainId: domain.id },
      create: { slug: t.slug, name: t.name, nameVi: t.nameVi, domainId: domain.id, status: 'PUBLISHED' },
    });
    metaTracks++;
    for (const tp of t.topics) {
      await prisma.interviewTopic.upsert({
        where: { slug: tp.slug },
        update: { name: tp.name, nameVi: tp.nameVi, weight: tp.weight, trackId: track.id },
        create: { slug: tp.slug, name: tp.name, nameVi: tp.nameVi, weight: tp.weight, trackId: track.id, status: 'PUBLISHED' },
      });
      metaTopics++;
    }
  }

  console.log(`[seed:interview] domains=${domains} companies=${companies} tracks=${tracks}(+${metaTracks} meta) topics=${topics}(+${metaTopics} meta) concepts=${concepts} created=${created} backfilledEN=${backfilled} skipped=${skipped}`);
  console.log('[seed:interview] NOTE: every seeded rubric is rubricReviewed=false — a human must rewrite them before they count.');
}

main()
  .catch((e) => { console.error('[seed:interview] error', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
