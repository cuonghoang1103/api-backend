/**
 * Case study của năm sản phẩm trên /about/studio — trang /about/studio/case/<slug>.
 *
 * ⛔ LUẬT SỐ LIỆU (cùng luật với `content.ts` và đầu `app/about/page.tsx`):
 *   - Không số người dùng, không doanh thu, không khách hàng, không lời khen.
 *   - Mọi con số phải ĐẾM ĐƯỢC. Ba nguồn duy nhất:
 *       1. `codebaseStats.json` (sinh bởi scripts/gen-codebase-stats.mjs) —
 *          đọc thẳng ở đây, không chép tay.
 *       2. `live` — đếm từ cơ sở dữ liệu lúc người xem mở trang
 *          (`useAboutStats()`); không về thì ẨN dòng đó, không thay bằng 0.
 *       3. `value` gõ cứng — CHỈ những số đếm bằng lệnh trên kho mã ngày
 *          `COUNTED_ON`, và lệnh đếm của từng số ghi ngay trên dòng đó. Đếm lại
 *          thì sửa cả số lẫn `COUNTED_ON`.
 *   - Mọi khẳng định kỹ thuật phải tìm thấy trong repo (mã, chú thích, CLAUDE.md).
 *
 * ⛔ Không đưa lên trang: địa chỉ IP, cổng SSH, tên máy, tên container, đường
 * dẫn trên máy chủ, tên secret/biến môi trường chứa khoá.
 */
import codebase from '@/data/codebaseStats.json';
import type { Bi } from './content';

/** Ngày chạy các lệnh đếm cho mọi `value` gõ cứng trong file này. */
export const COUNTED_ON = '2026-10-04';

export interface ArchNode {
  /** Tên riêng (công nghệ) để chuỗi thường; tên cần dịch thì để cặp [vi, en]. */
  name: string | Bi;
  note?: Bi;
}
export interface ArchTier {
  label: Bi;
  nodes: ArchNode[];
  /** Nhãn mũi tên từ tầng này xuống tầng kế tiếp. */
  flow?: Bi;
}
export interface Architecture {
  tiers: ArchTier[];
  caption: Bi;
  /** Chuỗi bước (vd đường triển khai) — vẽ thành chuỗi đánh số dưới sơ đồ tầng. */
  pipeline?: { title: Bi; steps: { name: Bi; note?: Bi }[] };
  notes?: Bi[];
}
export interface Decision {
  title: Bi;
  problem: Bi;
  choice: Bi;
  tradeoff: Bi;
}
export interface Incident {
  title: Bi;
  /** dd/mm/yyyy — ngày ghi trong nhật ký sự cố. */
  date?: string;
  what: Bi;
  cause: Bi;
  fix: Bi;
}
export type LiveKey = 'lessons' | 'courses' | 'exercises' | 'examQuestions' | 'interviewQuestions';
export interface Metric {
  label: Bi;
  /** Cách đếm — hiện nhỏ dưới nhãn để người đọc tự kiểm. */
  how: Bi;
  value?: number | null;
  live?: LiveKey;
  /** Hậu tố sau số (vd "+" khi phép đếm chỉ cho cận dưới). */
  suffix?: string;
}
export interface MetricGroup {
  title: Bi;
  /** 'counted' = đếm ngày COUNTED_ON · 'codebase' = codebaseStats.json · 'live' = CSDL lúc mở trang. */
  source: 'counted' | 'codebase' | 'live';
  items: Metric[];
}
export interface CaseStudy {
  slug: string;
  productId: string;
  name: string;
  kind: Bi;
  summary: Bi;
  status: Bi;
  period: Bi;
  role: Bi;
  platforms: Bi;
  context: Bi[];
  users: { who: Bi; need: Bi }[];
  solution: { title: Bi; body: Bi }[];
  arch: Architecture;
  decisions: Decision[];
  /** Sản phẩm đã chạy: sự cố thật. Sản phẩm chưa code: để trống và dùng `risks`. */
  incidents: Incident[];
  incidentsNote?: Bi;
  risks?: Bi[];
  metrics: MetricGroup[];
  stack: { group: Bi; items: string[] }[];
  links: { href: string; label: Bi; note?: Bi }[];
  /** Một câu nói thẳng giới hạn / trạng thái — hiện ngay dưới phần mở. */
  caveat?: Bi;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. cuongthai.com
// ─────────────────────────────────────────────────────────────────────────────
const SITE: CaseStudy = {
  slug: 'cuongthai-com',
  productId: 'site',
  name: 'cuongthai.com',
  kind: ['Nền tảng học tập song ngữ', 'Bilingual learning platform'],
  summary: [
    'Nền tảng học cho sinh viên IT: khoá học, gia sư AI đọc lời giảng, phòng thi, code lab, luyện ngoại ngữ — một API phục vụ web, ứng dụng desktop và iOS, chạy trên máy chủ ảo tự vận hành.',
    'A learning platform for IT students: courses, an AI tutor that reads the lecture, an exam room, a code lab and language practice — one API serving the web, desktop and iOS apps, on a self-operated virtual server.',
  ],
  status: ['Đang chạy production', 'In production'],
  period: ['Từ 08/06/2026 (commit đầu tiên) — đang phát triển tiếp', 'Since 8 Jun 2026 (first commit) — still evolving'],
  role: [
    'Một kỹ sư chính: thiết kế, lập trình, triển khai và vận hành',
    'One lead engineer: design, build, deployment and operations',
  ],
  platforms: ['Web · desktop · iOS', 'Web · desktop · iOS'],
  context: [
    [
      'Sinh viên IT học từ nhiều nguồn rời rạc: slide trên lớp, video, đề cũ, bài tập lập trình — và tài liệu chuyên ngành phần lớn bằng tiếng Anh. Bài toán đặt ra là gom chúng về một chỗ, song ngữ Việt–Anh, có AI đi kèm nhưng không để AI trả lời lạc khỏi bài đang học.',
      'IT students learn from scattered sources: lecture slides, videos, past exams, coding exercises — and most technical material is in English. The goal was to bring it into one place, bilingual Vietnamese–English, with AI alongside but never drifting away from the lesson at hand.',
    ],
    [
      'Ràng buộc thật: một người làm; toàn bộ hệ thống chạy trên một máy chủ ảo 6 GB RAM; chi phí gọi mô hình ngôn ngữ phải có trần cứng, vì một lỗi vòng lặp có thể tiêu cả tháng ngân sách trong một đêm.',
      'Real constraints: one person; the whole system runs on a single 6 GB RAM virtual server; language-model spend needs a hard ceiling, because one runaway loop can burn a month’s budget overnight.',
    ],
  ],
  users: [
    {
      who: ['Sinh viên Kỹ thuật phần mềm', 'Software Engineering students'],
      need: [
        'Học theo môn của trường, ôn thi, luyện bài tập lập trình có chấm.',
        'Study by university subject, revise for exams, practise graded coding exercises.',
      ],
    },
    {
      who: ['Người tự học lập trình', 'Self-taught developers'],
      need: [
        'Khoá học có lộ trình, video có phụ đề, hỏi gia sư AI ngay tại đoạn đang xem.',
        'Structured courses, subtitled videos, and an AI tutor that answers at the exact moment being watched.',
      ],
    },
    {
      who: ['Người luyện ngoại ngữ', 'Language learners'],
      need: ['Luyện IELTS và tiếng Nhật trong cùng tài khoản.', 'IELTS and Japanese practice in the same account.'],
    },
  ],
  solution: [
    {
      title: ['Gia sư AI bám lời giảng', 'An AI tutor grounded in the lecture'],
      body: [
        'Gia sư nhận nguyên lời giảng của video kèm mốc [mm:ss] và đoạn quanh mốc người học đang xem, nên câu “giải thích đoạn này” được trả lời theo đúng bài, có trích mốc thời gian.',
        'The tutor receives the full lecture transcript with [mm:ss] timestamps plus the passage around the learner’s current position, so “explain this part” is answered from the lesson itself, citing timestamps.',
      ],
    },
    {
      title: ['Khoá học, Academy, phòng thi, code lab', 'Courses, Academy, exam room, code lab'],
      body: [
        'Nội dung theo môn và theo khoá, ngân hàng câu hỏi thi, bài tập lập trình và câu hỏi phỏng vấn — số lượng đếm trực tiếp từ cơ sở dữ liệu ở mục Con số bên dưới.',
        'Content by subject and by course, an exam question bank, coding exercises and interview questions — counted live from the database in the Numbers section below.',
      ],
    },
    {
      title: ['Một cổng AI cho cả hệ thống', 'One AI gateway for the whole system'],
      body: [
        'Mọi lời gọi mô hình đi qua một lớp cổng duy nhất: mỗi loại việc được gán một mô hình theo số đo, đổi được bằng cấu hình không cần sửa mã, có trần token theo người và trần tiền theo ngày.',
        'Every model call goes through one gateway layer: each task type is mapped to a model chosen by measurement, changeable by configuration without code changes, with per-user token caps and a daily spend ceiling.',
      ],
    },
    {
      title: ['Một API, ba ứng dụng', 'One API, three apps'],
      body: [
        'Web (Next.js), ứng dụng desktop (Electron) và iOS (SwiftUI) dùng chung REST API, xác thực JWT và kênh thời gian thực Socket.IO.',
        'Web (Next.js), desktop (Electron) and iOS (SwiftUI) share the same REST API, JWT authentication and a Socket.IO realtime channel.',
      ],
    },
  ],
  arch: {
    tiers: [
      {
        label: ['Ứng dụng', 'Clients'],
        nodes: [
          { name: 'Web', note: ['Next.js', 'Next.js'] },
          { name: 'Desktop', note: ['Electron', 'Electron'] },
          { name: 'iOS', note: ['SwiftUI', 'SwiftUI'] },
        ],
        flow: ['HTTPS · WebSocket', 'HTTPS · WebSocket'],
      },
      {
        label: ['Biên', 'Edge'],
        nodes: [
          { name: 'Cloudflare', note: ['DNS · CDN', 'DNS · CDN'] },
          { name: 'nginx', note: ['Reverse proxy · header cache', 'Reverse proxy · cache headers'] },
        ],
        flow: ['Định tuyến theo đường dẫn', 'Path-based routing'],
      },
      {
        label: ['Ứng dụng (Docker)', 'Application (Docker)'],
        nodes: [
          { name: 'Next.js', note: ['Giao diện, SSR', 'UI, SSR'] },
          { name: 'Express API', note: ['TypeScript · Prisma', 'TypeScript · Prisma'] },
          { name: 'Socket.IO', note: ['Tin nhắn, sự kiện', 'Messages, events'] },
          { name: 'TTS', note: ['Dịch vụ giọng nói', 'Speech service'] },
          { name: 'TURN', note: ['Gọi thoại WebRTC', 'WebRTC calls'] },
        ],
        flow: ['Prisma · Redis adapter · S3 API', 'Prisma · Redis adapter · S3 API'],
      },
      {
        label: ['Dữ liệu', 'Data'],
        nodes: [
          { name: 'PostgreSQL 16', note: ['+ pgvector', '+ pgvector'] },
          { name: 'Redis', note: ['Đồng bộ Socket.IO', 'Socket.IO sync'] },
          { name: 'Cloudflare R2', note: ['Ảnh, video, tệp', 'Images, video, files'] },
        ],
        flow: ['Gọi ra ngoài', 'Outbound calls'],
      },
      {
        label: ['Dịch vụ ngoài', 'External'],
        nodes: [
          { name: 'LLM gateway', note: ['Định tuyến model theo việc', 'Per-task model routing'] },
          { name: 'VNPay', note: ['Thanh toán', 'Payments'] },
        ],
      },
    ],
    caption: [
      'Kiến trúc chạy production: bảy dịch vụ trong một tệp Docker Compose trên một máy chủ ảo.',
      'Production architecture: seven services in one Docker Compose file on a single virtual server.',
    ],
    pipeline: {
      title: ['Đường triển khai', 'Deployment path'],
      steps: [
        { name: ['Commit', 'Commit'], note: ['Chỉ nội dung đã commit được đi tiếp', 'Only committed content moves on'] },
        { name: ['Máy build riêng', 'Dedicated build machine'], note: ['Dựng song song ảnh backend + frontend', 'Builds backend + frontend images in parallel'] },
        { name: ['Chốt libc ↔ Prisma', 'libc ↔ Prisma gate'], note: ['Chạy thử ảnh trước khi đẩy', 'Runs the image before pushing'] },
        { name: ['Registry (GHCR)', 'Registry (GHCR)'] },
        { name: ['Máy chủ kéo ảnh và tráo', 'Server pulls and swaps'], note: ['Migration + seed nội dung', 'Migrations + content seed'] },
        { name: ['Smoke-test', 'Smoke test'], note: ['404 ở route nào là dừng', 'Any 404 stops the deploy'] },
        { name: ['Đồng bộ nginx', 'nginx sync'], note: ['So sha256, nginx -t, hỏng thì trả bản cũ', 'sha256 compare, nginx -t, roll back on failure'] },
      ],
    },
    notes: [
      [
        'Đẩy mã lên nhánh chính KHÔNG tự triển khai — chỉ chạy kiểm tra kiểu và lint. Triển khai là một script chạy có chủ đích.',
        'Pushing to the main branch does NOT deploy — it only runs type checks and lint. Deploying is a script run on purpose.',
      ],
    ],
  },
  decisions: [
    {
      title: ['Dựng ảnh ở máy riêng, máy chủ chỉ kéo về và tráo', 'Build images off-server; the server only pulls and swaps'],
      problem: [
        'Máy chủ 6 GB RAM: dựng hai ảnh song song từng bị hệ điều hành giết vì hết bộ nhớ (exit 137). Bộ nhớ đệm build phình tới 7,6 GB trên chính ổ đĩa chứa PostgreSQL; một lần deploy chết giữa chừng vì đĩa chỉ còn 1,8 GB.',
        'The 6 GB server: building both images in parallel was killed by the OS for running out of memory (exit 137). The build cache grew to 7.6 GB on the same disk as PostgreSQL; one deploy died midway with only 1.8 GB left.',
      ],
      choice: [
        'Một máy build riêng (12 nhân, 31 GB RAM) dựng song song cả hai ảnh, đẩy lên registry; máy chủ chỉ kéo ảnh, chạy migration và tráo container. Máy chủ không còn giữ bộ nhớ đệm build.',
        'A dedicated build machine (12 cores, 31 GB RAM) builds both images in parallel and pushes them to a registry; the server only pulls, runs migrations and swaps containers. The server no longer keeps a build cache.',
      ],
      tradeoff: [
        'Nhanh hơn khoảng 3 lần (3–6 phút so với ~15 phút) nhưng phụ thuộc thêm một máy. Bù lại có hai đường lùi: dựng tuần tự ngay trên máy chủ, hoặc dựng trên GitHub Actions khi máy build không với tới được.',
        'About 3× faster (3–6 minutes versus ~15) but one more machine to depend on. Two fallbacks cover it: a sequential build on the server, or a GitHub Actions build when the build machine is unreachable.',
      ],
    },
    {
      title: ['Triển khai không phải tác dụng phụ của git push', 'Deploying is not a side effect of git push'],
      problem: [
        'Từng có hai workflow cùng chạy khi đẩy lên nhánh chính và tranh nhau tráo container — gây hai lần sập thật (bảng tin trả 500 khi schema chưa kịp theo ảnh; container bị giết giữa lúc tạo lại).',
        'Two workflows once fired on every push to main and raced each other to swap containers — causing two real outages (the feed returned 500 while the schema lagged the image; a container was killed mid-recreate).',
      ],
      choice: [
        'Cả hai workflow triển khai chuyển sang chỉ chạy bằng tay. Đẩy mã chỉ chạy CI kiểm kiểu + lint. Script triển khai tự chạy bộ kiểm CI rồi mới đẩy nhánh chính.',
        'Both deploy workflows became manual-only. A push only runs type-check + lint CI. The deploy script runs the CI checks itself before it pushes main.',
      ],
      tradeoff: [
        'Mất sự tiện “đẩy là lên”, đổi lại mỗi lần triển khai có một người chịu trách nhiệm và không còn hai tiến trình giẫm lên nhau.',
        'Loses the “push and it’s live” convenience; in exchange every deploy has an owner and no two processes step on each other.',
      ],
    },
    {
      title: ['Chọn mô hình AI bằng số đo, không bằng bảng giá', 'Choosing AI models by measurement, not price lists'],
      problem: [
        'Cổng LLM bên thứ ba không công khai giá thật; mô hình suy luận còn tính tiền cả token suy luận người dùng không thấy (đo được ~21% token ra). Hệ số giá niêm yết không dự đoán được hoá đơn.',
        'The third-party LLM gateway does not publish real prices; reasoning models also bill for hidden reasoning tokens (measured at ~21% of output tokens). Listed price ratios do not predict the bill.',
      ],
      choice: [
        'Đo từng mô hình trên cùng một bộ việc (chênh lệch sổ của cổng, độ trễ, đúng/sai, có tôn trọng max_tokens không), rồi gán theo LOẠI VIỆC: việc chạy nền và việc máy đọc dùng mô hình rẻ, việc người dùng đọc từng chữ dùng mô hình mạnh. Đổi được bằng biến cấu hình, không cần deploy.',
        'Each model is measured on the same task set (gateway ledger delta, latency, correctness, whether it honours max_tokens), then assigned by TASK TYPE: background and machine-read work gets a cheap model, text people read word by word gets a strong one. Changeable by configuration, no deploy needed.',
      ],
      tradeoff: [
        'Phải đo lại khi cổng đổi mô hình. Mô hình không tôn trọng giới hạn token bị loại hẳn, kể cả khi rẻ — vì mọi trần chi phí trong mã sẽ mất tác dụng với nó.',
        'Measurements must be redone when the gateway changes models. Models that ignore token limits are excluded outright, even when cheap — every cost ceiling in the code would be void against them.',
      ],
    },
    {
      title: ['Hai khoá theo nhóm mô hình, thiếu khoá thì lùi chứ không chết', 'Two keys per model group; a missing key falls back instead of failing'],
      problem: [
        'Mỗi khoá của cổng chỉ thuộc một nhóm mô hình; gọi mô hình nhóm khác trả 503 “không có kênh” — nghe như cổng bận nhưng là vĩnh viễn. Bản đồ mô hình đi theo mã (mỗi lần deploy), còn khoá do người thêm tay — lệch nhịp một lần là nhiều tính năng cùng hỏng.',
        'Each gateway key belongs to one model group; calling another group’s model returns 503 “no channel” — sounds transient, is permanent. The model map ships with the code, keys are added by hand — one mismatch and many features fail together.',
      ],
      choice: [
        'Chọn khoá theo tiền tố tên mô hình; thiếu khoá thì tự đổi sang mô hình tương đương của nhóm có khoá và ghi cảnh báo.',
        'The key is chosen by model-name prefix; if it is missing, the call switches to an equivalent model in a group that has a key and logs a warning.',
      ],
      tradeoff: [
        'Không ai thấy lỗi, nhưng tính năng chạy đắt hơn (đo: việc nền đắt gấp 5,1 lần) cho tới khi có người đọc cảnh báo — nên có bộ kiểm gọi thật mọi mô hình đang được gán.',
        'Users see no error, but features run more expensively (measured: background work 5.1× the cost) until someone reads the warning — hence a checker that really calls every assigned model.',
      ],
    },
    {
      title: ['Ba lớp trần chi phí AI', 'Three layers of AI cost ceilings'],
      problem: [
        'Trước đó, để trống cấu hình nghĩa là không giới hạn — và đó là chốt chặn duy nhất của cả hệ thống.',
        'Previously, an empty setting meant unlimited — and that was the only safeguard of the whole system.',
      ],
      choice: [
        'Việc AI chạy nền mặc định TẮT; trần token theo người theo ngày có giá trị mặc định kể cả khi không cấu hình; trần tiền theo ngày hai mức — mức mềm 15 $ dừng việc chạy nền, mức cứng 40 $ dừng tất cả.',
        'Background AI work is OFF by default; a per-user daily token cap applies even with no configuration; a two-level daily spend ceiling — the soft $15 level stops background jobs, the hard $40 level stops everything.',
      ],
      tradeoff: [
        'Chi phí trong hệ thống là ước lượng (cổng không công bố giá), nên trần tiền để bắt bất thường chứ không phải để kế toán.',
        'Costs inside the system are estimates (the gateway publishes no prices), so the spend ceiling catches anomalies; it is not accounting.',
      ],
    },
    {
      title: ['Migration viết tay, kiểm lệch schema trước khi triển khai', 'Hand-written migrations with a drift check before deploy'],
      problem: [
        'Một migration đã chạy trên production không thể chạy lại trên cơ sở dữ liệu tạm (trùng tên ràng buộc), nên công cụ tạo migration tự động hỏng. Sửa migration đã triển khai là cấm.',
        'A migration already applied in production cannot replay on a scratch database (a duplicated constraint name), which breaks automatic migration generation. Editing deployed migrations is forbidden.',
      ],
      choice: [
        'Viết SQL migration bằng tay, áp bằng lệnh deploy không cần cơ sở dữ liệu tạm, rồi so schema với cơ sở dữ liệu thật — kết quả rỗng mới là đạt. Migration lỗi trên production thì dừng và báo, không tự “resolve”.',
        'Migration SQL is written by hand, applied with a deploy command that needs no scratch database, then the schema is diffed against the real database — an empty diff is the pass. A failed production migration stops and is reported, never auto-“resolved”.',
      ],
      tradeoff: [
        'Chậm hơn và đòi kỷ luật, đổi lại lịch sử migration không bao giờ bị ghi đè để “cho qua”.',
        'Slower and needs discipline; in exchange migration history is never overwritten just to get past an error.',
      ],
    },
  ],
  incidents: [
    {
      title: ['Bản build cũ: một route biến mất mà deploy vẫn “thành công”', 'Stale build: a route vanished while the deploy “succeeded”'],
      date: '02/07/2026',
      what: [
        'Bộ chọn GIF chết và tin nhắn trông như biến mất, kể cả sau khi đăng nhập lại.',
        'The GIF picker died and messages looked like they had disappeared, even after signing in again.',
      ],
      cause: [
        'Production chạy một gói backend cũ chưa gắn route mới (route trả 404), do một lần triển khai chỉ đồng bộ tệp mà không dựng lại ảnh.',
        'Production ran an old backend bundle that never mounted the new route (it returned 404), after a deploy that synced files without rebuilding the image.',
      ],
      fix: [
        'Thêm smoke-test sau mỗi lần triển khai: gọi các route cốt lõi khi chưa đăng nhập, 401/200 là sống, 404 là dừng cả lần deploy. Danh sách nay có 70 route.',
        'Added a post-deploy smoke test: core routes are called unauthenticated, 401/200 means mounted, 404 fails the whole deploy. The list now holds 70 routes.',
      ],
    },
    {
      title: ['Build xanh, API sập 502 trong bảy phút', 'Green build, API down with 502 for seven minutes'],
      date: '18/08/2026',
      what: [
        'Build, đẩy ảnh và tráo container đều báo thành công; ngay sau đó backend khởi động lại liên tục.',
        'Build, push and swap all reported success; right after, the backend restarted in a loop.',
      ],
      cause: [
        'Ảnh được dựng từ nhầm Dockerfile: nền Alpine (musl) nhưng mang engine Prisma bản glibc — không nạp được.',
        'The image was built from the wrong Dockerfile: an Alpine (musl) base carrying a glibc Prisma engine — which cannot load.',
      ],
      fix: [
        'Luôn dựng bằng đúng tệp mà compose dùng, và thêm chốt chạy thử ảnh để so libc với engine Prisma TRƯỚC khi đẩy. Kèm quy trình khôi phục bằng ảnh cũ còn trên máy (~40 giây thay vì dựng lại 15 phút).',
        'Always build with the exact file compose uses, and added a gate that runs the image to match libc against the Prisma engine BEFORE pushing. Plus a recovery drill using the previous image still on the host (~40 seconds instead of a 15-minute rebuild).',
      ],
    },
    {
      title: ['Cấu hình đã ghi, đã nạp lại — nhưng không có hiệu lực', 'Config written and reloaded — yet not in effect'],
      date: '25/08/2026',
      what: [
        'Bước đồng bộ nginx báo OK hai lần liền (`nginx -t` xanh, reload xanh) nhưng HTTP/2 vẫn tắt và header cache vẫn là no-store.',
        'The nginx sync step reported OK twice in a row (`nginx -t` green, reload green) yet HTTP/2 stayed off and cache headers stayed no-store.',
      ],
      cause: [
        'Tệp cấu hình được thay bằng `mv`. Docker gắn tệp đơn theo inode lúc container khởi động, nên container vẫn đọc tệp cũ — kiểm và nạp lại đều chạy trên cấu hình cũ.',
        'The config file was replaced with `mv`. Docker binds a single file by inode at container start, so the container kept reading the old file — the test and the reload both ran against the old config.',
      ],
      fix: [
        'Ghi đè tại chỗ thay vì đổi tên tệp, rồi so sha256 của tệp trên máy với tệp nhìn từ BÊN TRONG container; lệch thì trả bản cũ về và dừng. Bài học: “đã ghi” không có nghĩa là “đã có hiệu lực”.',
        'Overwrite in place instead of renaming, then compare the sha256 on the host with the file seen from INSIDE the container; on mismatch, restore the old file and stop. Lesson: “written” does not mean “in effect”.',
      ],
    },
    {
      title: ['Đổi tên một giá trị enum làm vỡ seed trên production', 'Renaming an enum value broke the seed in production'],
      date: '08/08/2026',
      what: [
        'Thay đổi qua sạch toàn bộ bộ kiểm trước khi đẩy, nhưng bước nạp dữ liệu mẫu hỏng trên production.',
        'The change passed the entire pre-push checklist, yet the seed step failed in production.',
      ],
      cause: [
        'Script seed tự chép lại kiểu enum bằng tay nên “tự kiểm với chính nó”, và trình kiểm kiểu chính không bao phủ thư mục seed.',
        'The seed script carried its own hand-written copy of the enum type, so it “type-checked against itself”, and the main type check did not cover the seed folder.',
      ],
      fix: [
        'Kiểu enum lấy thẳng từ Prisma client; thêm cấu hình kiểm kiểu riêng cho seed và chạy seed thật trong checklist mỗi khi đổi schema.',
        'Enum types now come straight from the Prisma client; added a separate type-check config for the seed and a real seed run in the checklist whenever the schema changes.',
      ],
    },
    {
      title: ['Phiên đăng nhập chết im lặng sau 24 giờ', 'Sessions silently died after 24 hours'],
      date: '02/07/2026',
      what: [
        'Sau một ngày, mọi lời gọi cần đăng nhập đều trả 401 dù cookie vẫn còn.',
        'After a day, every authenticated call returned 401 although the cookie was still present.',
      ],
      cause: [
        'Token sống 24 giờ, cookie sống 7 ngày, và không có endpoint làm mới token thật.',
        'Tokens lived 24 hours, cookies 7 days, and there was no working token-refresh endpoint.',
      ],
      fix: [
        'Thêm endpoint làm mới (xác minh lại tài khoản) và bộ chặn phía client: gặp 401 thì làm mới một lần rồi thử lại. Phiên tự lành, không cần đổi cấu hình.',
        'Added a refresh endpoint (re-checking the account) and a client interceptor: on 401, refresh once and retry. Sessions self-heal without configuration changes.',
      ],
    },
  ],
  incidentsNote: [
    'Mỗi sự cố production được ghi vào nhật ký vận hành của dự án kèm nguyên nhân thật và chốt kiểm đã thêm. Đây là năm trong số đó.',
    'Every production incident is logged in the project’s operations log with its real cause and the check added. These are five of them.',
  ],
  metrics: [
    {
      title: ['Mã nguồn (số sinh tự động)', 'Codebase (generated figures)'],
      source: 'codebase',
      items: [
        { label: ['Dòng mã nguồn', 'Lines of source code'], how: ['.ts/.tsx/.js trong src và frontend/src', '.ts/.tsx/.js in src and frontend/src'], value: codebase.sourceLines },
        { label: ['Commit trong lịch sử Git', 'Git commits'], how: ['git rev-list --count HEAD', 'git rev-list --count HEAD'], value: codebase.commits },
        { label: ['Trang web (route)', 'Web pages (routes)'], how: ['Số tệp page.tsx trong frontend/src/app', 'page.tsx files in frontend/src/app'], value: codebase.pages },
        { label: ['Nhóm API (router)', 'API routers'], how: ['Số tệp *.routes.ts', '*.routes.ts files'], value: codebase.apiRouters },
        { label: ['Bảng dữ liệu (Prisma model)', 'Data models (Prisma)'], how: ['Dòng “model …” trong schema.prisma', '“model …” lines in schema.prisma'], value: codebase.prismaModels },
        { label: ['Migration cơ sở dữ liệu', 'Database migrations'], how: ['Thư mục trong prisma/migrations', 'Folders in prisma/migrations'], value: codebase.migrations },
      ],
    },
    {
      title: ['Vận hành và kiểm thử', 'Operations and testing'],
      source: 'counted',
      items: [
        {
          label: ['Endpoint API khai báo', 'Declared API endpoints'],
          how: ['Dòng router.get/post/put/patch/delete(…) trong src/routes/*.routes.ts — cận dưới', 'router.get/post/put/patch/delete(…) lines in src/routes/*.routes.ts — a lower bound'],
          value: 1557,
          suffix: '+',
        },
        { label: ['Tệp kiểm thử backend', 'Backend test files'], how: ['find src -name "*.test.ts"', 'find src -name "*.test.ts"'], value: 92 },
        { label: ['Route trong smoke-test sau triển khai', 'Routes in the post-deploy smoke test'], how: ['Danh sách route trong vòng smoke-test của deploy.sh', 'Route list in the deploy.sh smoke-test loop'], value: 70 },
        { label: ['Loại việc AI được định tuyến riêng', 'AI task types routed individually'], how: ['Giá trị của kiểu LlmPurpose trong gateway.ts', 'Members of the LlmPurpose type in gateway.ts'], value: 38 },
        { label: ['Dịch vụ trong Docker Compose', 'Services in Docker Compose'], how: ['Khối dịch vụ trong docker-compose.yml', 'Service blocks in docker-compose.yml'], value: 7 },
        { label: ['Workflow GitHub Actions', 'GitHub Actions workflows'], how: ['ls .github/workflows', 'ls .github/workflows'], value: 16 },
      ],
    },
    {
      title: ['Nội dung đang phục vụ người học', 'Content serving learners'],
      source: 'live',
      items: [
        { label: ['Bài học', 'Lessons'], how: ['Đếm trong cơ sở dữ liệu lúc mở trang', 'Counted in the database on page load'], live: 'lessons' },
        { label: ['Khoá học', 'Courses'], how: ['Đếm trong cơ sở dữ liệu lúc mở trang', 'Counted in the database on page load'], live: 'courses' },
        { label: ['Bài tập lập trình', 'Coding exercises'], how: ['Đếm trong cơ sở dữ liệu lúc mở trang', 'Counted in the database on page load'], live: 'exercises' },
        { label: ['Câu hỏi thi', 'Exam questions'], how: ['Đếm trong cơ sở dữ liệu lúc mở trang', 'Counted in the database on page load'], live: 'examQuestions' },
        { label: ['Câu hỏi phỏng vấn', 'Interview questions'], how: ['Đếm trong cơ sở dữ liệu lúc mở trang', 'Counted in the database on page load'], live: 'interviewQuestions' },
      ],
    },
  ],
  stack: [
    { group: ['Giao diện', 'Front end'], items: ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'framer-motion'] },
    { group: ['Backend', 'Back end'], items: ['Node.js 22', 'Express', 'TypeScript', 'Prisma', 'Socket.IO', 'Zod'] },
    { group: ['Dữ liệu', 'Data'], items: ['PostgreSQL 16', 'pgvector', 'Redis', 'Cloudflare R2'] },
    { group: ['Hạ tầng', 'Infrastructure'], items: ['Docker Compose', 'GHCR', 'nginx', 'Cloudflare', 'GitHub Actions', 'Sentry'] },
    { group: ['AI', 'AI'], items: ['Cổng LLM nhiều nhà cung cấp', 'RAG trên pgvector', 'Trích chữ PDF phía máy chủ'] },
  ],
  links: [
    { href: '/', label: ['Trang chủ', 'Home page'] },
    { href: '/courses', label: ['Khoá học', 'Courses'] },
    { href: '/academy', label: ['Academy theo môn', 'Academy by subject'] },
    { href: '/exam', label: ['Phòng thi', 'Exam room'] },
    { href: '/code-lab', label: ['Code Lab', 'Code Lab'] },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CT Work
// ─────────────────────────────────────────────────────────────────────────────
const CTWORK: CaseStudy = {
  slug: 'ct-work',
  productId: 'ctwork',
  name: 'CT Work',
  kind: ['Quản lý dự án kiểu Jira', 'Jira-style project management'],
  summary: [
    'Công cụ quản lý dự án dựng ngay trong nền tảng: board, backlog, sprint, báo cáo burndown/velocity, ngôn ngữ truy vấn kiểu JQL, quản lý kiểm thử, trợ lý AI chỉ đề xuất — người quyết định — và link chia sẻ chỉ-đọc cho người ngoài.',
    'A project-management tool built into the platform: boards, backlog, sprints, burndown/velocity reports, a JQL-style query language, test management, an AI assistant that only proposes — people decide — and read-only share links for outsiders.',
  ],
  status: ['Đang dùng hằng ngày', 'In daily use'],
  period: ['Từ 23/09/2026 (commit đầu tiên của module)', 'Since 23 Sep 2026 (the module’s first commit)'],
  role: ['Một kỹ sư chính: thiết kế, lập trình, vận hành', 'One lead engineer: design, build, operations'],
  platforms: ['Web · iOS · link chia sẻ công khai', 'Web · iOS · public share link'],
  context: [
    [
      'Quy trình làm dự án của studio có nhiều giai đoạn, mỗi giai đoạn có tài liệu và cổng chất lượng. Cần một nơi mà việc, cổng, rủi ro và hồ sơ gắn được vào nhau — và người ngoài (khách, giảng viên) xem được tiến độ mà không cần tài khoản.',
      'The studio’s delivery process has many stages, each with documents and a quality gate. It needed one place where tasks, gates, risks and documents link together — and where outsiders (clients, lecturers) can follow progress without an account.',
    ],
    [
      'Dựng trong cùng nền tảng thay vì dùng công cụ ngoài để dùng chung tài khoản, phân quyền, cổng AI và ứng dụng di động đã có.',
      'It was built inside the platform rather than adopting an external tool so it could share the existing accounts, permissions, AI gateway and mobile app.',
    ],
  ],
  users: [
    {
      who: ['Người làm dự án', 'Project teams'],
      need: ['Lập kế hoạch sprint, kéo thẻ, theo dõi kiểm thử, viết báo cáo tuần.', 'Plan sprints, move cards, track tests, write weekly reports.'],
    },
    {
      who: ['Người theo dõi bên ngoài', 'Outside observers'],
      need: ['Xem board/backlog qua link chỉ-đọc có hạn dùng, thu hồi được.', 'View the board/backlog through a read-only link that expires and can be revoked.'],
    },
    {
      who: ['Sinh viên làm đồ án', 'Students on capstone projects'],
      need: [
        'Chạy đồ án theo luật chấm của môn: yêu cầu, cổng, hồ sơ bảo vệ — LabFlow AI là dự án đầu tiên chạy theo cách này.',
        'Run a capstone by the course’s grading rules: requirements, gates, defence documents — LabFlow AI is the first project run this way.',
      ],
    },
  ],
  solution: [
    {
      title: ['Board, backlog, sprint, báo cáo', 'Boards, backlog, sprints, reports'],
      body: [
        'Kéo thả thẻ giữa cột và trong backlog, sprint có burndown và velocity, quy trình trạng thái tuỳ chỉnh theo dự án, thùng rác và nhật ký kiểm toán.',
        'Drag cards across columns and within the backlog, sprints with burndown and velocity, per-project custom workflows, a trash bin and an audit log.',
      ],
    },
    {
      title: ['Ngôn ngữ truy vấn kiểu JQL', 'A JQL-style query language'],
      body: [
        'Ví dụ: assignee = currentUser() AND status != Done ORDER BY priority. Lỗi cú pháp báo kèm vị trí và gợi ý “có phải bạn muốn…”.',
        'For example: assignee = currentUser() AND status != Done ORDER BY priority. Syntax errors come with a position and a “did you mean…” suggestion.',
      ],
    },
    {
      title: ['Quản lý kiểm thử', 'Test management'],
      body: ['Ca kiểm thử, kế hoạch kiểm thử và vòng chạy kiểm thử gắn với thẻ việc.', 'Test cases, test plans and test cycles linked to work items.'],
    },
    {
      title: ['Trợ lý AI chỉ đề xuất', 'An AI assistant that only proposes'],
      body: [
        'Hỏi đáp, báo cáo tuần, lập kế hoạch sprint, retro, tóm tắt hằng ngày, luyện bảo vệ. Mọi thay đổi AI muốn làm là một đề xuất — người bấm “Áp dụng” thì mới ghi.',
        'Q&A, weekly reports, sprint planning, retros, daily briefs, defence practice. Every change the AI wants is a proposal — nothing is written until a person presses “Apply”.',
      ],
    },
    {
      title: ['Chia sẻ và tích hợp', 'Sharing and integrations'],
      body: [
        'Link công khai chỉ-đọc theo từng phần, lịch iCalendar (.ics) để đăng ký vào ứng dụng lịch, tích hợp GitHub/GitLab, token API cho script.',
        'Per-section read-only public links, an iCalendar (.ics) feed for calendar apps, GitHub/GitLab integration, API tokens for scripts.',
      ],
    },
    {
      title: ['Khoá chỉnh sửa', 'Edit lock'],
      body: [
        'Bật khoá thì mọi lệnh ghi của chính mình trong dự án bị máy chủ từ chối — để lướt xem kế hoạch mà không lỡ tay kéo thẻ.',
        'With the lock on, the server refuses one’s own writes in that project — so a plan can be browsed without accidentally moving cards.',
      ],
    },
  ],
  arch: {
    tiers: [
      {
        label: ['Người dùng', 'Clients'],
        nodes: [
          { name: 'Web /work', note: ['Next.js', 'Next.js'] },
          { name: 'iOS', note: ['Module CT Work', 'CT Work module'] },
          { name: ['Link chia sẻ', 'Share link'], note: ['Chỉ đọc, có hạn', 'Read-only, expiring'] },
          { name: '.ics', note: ['Ứng dụng lịch', 'Calendar apps'] },
          { name: 'API token', note: ['Script', 'Scripts'] },
        ],
        flow: ['REST · WebSocket', 'REST · WebSocket'],
      },
      {
        label: ['Cổng vào', 'Entry'],
        nodes: [
          { name: 'Work router', note: ['213 endpoint', '213 endpoints'] },
          { name: 'Edit-lock', note: ['423 khi đang khoá', '423 while locked'] },
        ],
        flow: ['Mọi lệnh đều hỏi quyền', 'Every command asks for permission'],
      },
      {
        label: ['Phân quyền', 'Permissions'],
        nodes: [{ name: 'can(role, action)', note: ['Hàm thuần + ma trận, một nơi duy nhất', 'Pure function + matrix, one place only'] }],
        flow: ['Đã được phép', 'Authorised'],
      },
      {
        label: ['Nghiệp vụ', 'Domain'],
        nodes: [
          { name: 'Issues · Sprints', note: ['Rank kiểu LexoRank', 'LexoRank-style ordering'] },
          { name: 'JQL', note: ['Parse → cây → Prisma', 'Parse → tree → Prisma'] },
          { name: 'Reports · Tests', note: ['Burndown, velocity', 'Burndown, velocity'] },
          { name: 'AI', note: ['Đề xuất → người áp dụng', 'Proposal → human applies'] },
          { name: 'GitHub · GitLab' },
        ],
        flow: ['Ghi xong mới phát sự kiện', 'Events emitted after the write'],
      },
      {
        label: ['Dữ liệu & thời gian thực', 'Data & realtime'],
        nodes: [
          { name: 'PostgreSQL', note: ['52 model Work*', '52 Work* models'] },
          { name: 'Socket.IO', note: ['Một phòng mỗi dự án', 'One room per project'] },
          { name: 'Audit log' },
        ],
      },
    ],
    caption: [
      'Đường đi của một lệnh ghi: vào router, qua khoá chỉnh sửa, hỏi một lớp quyền duy nhất, ghi xuống cơ sở dữ liệu rồi mới phát sự kiện cho mọi người đang mở dự án.',
      'The path of a write: into the router, through the edit lock, one single permission layer, written to the database, and only then broadcast to everyone viewing the project.',
    ],
  },
  decisions: [
    {
      title: ['Thứ tự thẻ bằng khoá chuỗi kiểu LexoRank', 'Card order with LexoRank-style string keys'],
      problem: [
        'Đánh số thứ tự 1, 2, 3… thì kéo một thẻ vào giữa phải đánh số lại cả cột — nhiều dòng ghi, dễ xung đột khi hai người cùng kéo.',
        'With 1, 2, 3… positions, dropping a card in the middle renumbers the whole column — many writes, and conflicts when two people drag at once.',
      ],
      choice: [
        'Mỗi thẻ giữ một chuỗi nằm giữa hai hàng xóm: kéo thả chỉ ghi đúng một dòng. Thêm vào cuối thì cộng 1 vào phần đầu dài 6 ký tự (~2 tỉ lần thêm mà độ dài không đổi). Bảng chữ chỉ gồm số và chữ thường để thứ tự sắp xếp của PostgreSQL trùng với phép so sánh trong JavaScript.',
        'Each card holds a string between its two neighbours: a drop writes exactly one row. Appending increments a 6-character head (~2 billion appends at constant length). The alphabet is digits and lowercase only so PostgreSQL collation order matches JavaScript comparison.',
      ],
      tradeoff: [
        'Chèn giữa liên tục làm khoá dài ra; vượt 48 ký tự (cột tối đa 64) thì phải xếp lại cả cột.',
        'Repeated middle inserts lengthen keys; past 48 characters (the column holds 64) the column has to be rebalanced.',
      ],
    },
    {
      title: ['JQL biên dịch sang truy vấn Prisma, không ghép chuỗi SQL', 'JQL compiled to Prisma queries, never concatenated SQL'],
      problem: [
        'Cho người dùng gõ truy vấn tự do là mở cửa cho SQL injection nếu ghép chuỗi.',
        'Letting users type free-form queries invites SQL injection if strings are concatenated.',
      ],
      choice: [
        'Hai lớp: bộ phân tích là hàm thuần (chuỗi → cây cú pháp, lỗi kèm vị trí), bộ biên dịch đổi cây thành điều kiện Prisma dựa trên bảng tra của dự án. Mọi giá trị đi qua Prisma.',
        'Two layers: the parser is a pure function (string → syntax tree, errors with positions), the compiler turns the tree into Prisma conditions using the project’s lookup tables. Every value goes through Prisma.',
      ],
      tradeoff: [
        'Phải tự bảo trì một ngữ pháp — nó có 25 ca kiểm thử riêng, và mỗi lỗi cú pháp tìm thấy khi dùng thật được thêm thành một ca mới.',
        'A grammar to maintain in-house — it has 25 dedicated test cases, and every syntax bug found in real use becomes a new case.',
      ],
    },
    {
      title: ['Một nơi duy nhất quyết định quyền', 'One single place decides permissions'],
      problem: [
        'Hai bài học cũ của chính repo: “ẩn nút không phải chặn API” và “hai chỗ kiểm một quyền thì thành hai luật”.',
        'Two earlier lessons from this very repo: “hiding a button is not blocking the API” and “two places checking one permission become two rules”.',
      ],
      choice: [
        'Mọi route VÀ mọi công cụ của trợ lý AI hỏi cùng một lớp quyền. Tầng lõi là hàm thuần không chạm cơ sở dữ liệu, kiểm bằng bảng; tầng ngoài đọc dữ liệu rồi gọi tầng lõi.',
        'Every route AND every AI-assistant tool asks the same permission layer. The core is a pure function that never touches the database, tested by table; the outer layer loads data then calls the core.',
      ],
      tradeoff: ['Thêm hành động mới phải thêm vào ma trận — chậm hơn một chút, nhưng không thể quên.', 'New actions must be added to the matrix — a little slower, but impossible to forget.'],
    },
    {
      title: ['Khoá chỉnh sửa chặn ở máy chủ, không chỉ ẩn nút', 'Edit lock enforced on the server, not just hidden buttons'],
      problem: [
        'Người dùng hay lướt xem kế hoạch dựng sẵn và lỡ tay kéo thẻ hoặc sửa trường, không có cách quay lại.',
        'People browsing a pre-built plan would accidentally drag cards or edit fields, with no way back.',
      ],
      choice: [
        'Khi khoá, máy chủ trả 423 cho mọi lệnh ghi của chính người đó — kéo thả, sửa hàng loạt, ứng dụng iOS, nút “Áp dụng” của AI đều đi qua đây. Danh sách trắng giữ lại bình luận, nhật ký ngày, hỏi AI, bộ lọc.',
        'While locked, the server returns 423 for that person’s writes — drag and drop, bulk edits, the iOS app and the AI “Apply” button all pass through it. A whitelist keeps comments, daily logs, AI questions and filters working.',
      ],
      tradeoff: ['Danh sách trắng phải cập nhật khi có route ghi mới.', 'The whitelist must be updated when new write routes appear.'],
    },
    {
      title: ['AI đề xuất, người áp dụng', 'AI proposes, a person applies'],
      problem: [
        'Trợ lý AI có công cụ sửa kế hoạch; để nó ghi thẳng là giao quyết định cho mô hình.',
        'The AI assistant has tools that change the plan; letting it write directly hands decisions to the model.',
      ],
      choice: [
        'Mỗi thay đổi AI muốn làm được lưu thành đề xuất trong tin nhắn; có endpoint riêng để áp dụng hoặc bỏ qua từng đề xuất.',
        'Each change the AI wants is stored as a proposal in the message; separate endpoints apply or dismiss each proposal.',
      ],
      tradeoff: ['Thêm một bước bấm cho người dùng.', 'One more click for the user.'],
    },
  ],
  incidents: [
    {
      title: ['Lỡ tay sửa kế hoạch khi chỉ định xem', 'Accidental edits while only browsing'],
      date: '25/09/2026',
      what: [
        'Người dùng lướt kế hoạch dựng sẵn và vô tình kéo thẻ / sửa trường.',
        'A user browsing a pre-built plan accidentally dragged cards and edited fields.',
      ],
      cause: ['Board cho phép ghi mọi lúc, không có chế độ chỉ xem cho chính chủ dự án.', 'The board allowed writes at all times, with no view-only mode for the project owner.'],
      fix: ['Thêm khoá chỉnh sửa theo dự án, chặn ở máy chủ (mã 423) và giao diện hiện nút Mở khoá.', 'Added a per-project edit lock, enforced on the server (code 423), with an Unlock button in the UI.'],
    },
    {
      title: ['Truy vấn `sprint IN openSprints()` không được nhận', '`sprint IN openSprints()` failed to parse'],
      what: [
        'Bộ lọc kiểu Jira quen thuộc báo lỗi cú pháp khi seed dự án LabFlow.',
        'A familiar Jira-style filter reported a syntax error while seeding the LabFlow project.',
      ],
      cause: ['Bộ phân tích chỉ nhận danh sách trong ngoặc sau IN, không nhận một hàm đứng trần.', 'The parser only accepted a parenthesised list after IN, not a bare function.'],
      fix: ['Sửa ngữ pháp như Jira và thêm ca kiểm thử cho cả ba dạng viết.', 'Fixed the grammar to match Jira and added test cases for all three spellings.'],
    },
  ],
  metrics: [
    {
      title: ['Quy mô module', 'Module size'],
      source: 'counted',
      items: [
        { label: ['Bảng dữ liệu riêng', 'Dedicated data models'], how: ['grep -c "^model Work" prisma/schema.prisma', 'grep -c "^model Work" prisma/schema.prisma'], value: 52 },
        { label: ['Endpoint API', 'API endpoints'], how: ['Dòng router.get/post/…( trong work.routes.ts', 'router.get/post/…( lines in work.routes.ts'], value: 213 },
        { label: ['Trang giao diện', 'UI pages'], how: ['page.tsx trong frontend/src/app/work', 'page.tsx under frontend/src/app/work'], value: 20 },
        { label: ['Dòng mã backend', 'Backend lines of code'], how: ['wc -l services/work/*.ts + work.routes.ts', 'wc -l services/work/*.ts + work.routes.ts'], value: 12930 },
        { label: ['Tệp kiểm thử', 'Test files'], how: ['*.test.ts trong services/work và routes/work*', '*.test.ts in services/work and routes/work*'], value: 18 },
        { label: ['Ca kiểm thử', 'Test cases'], how: ['Dòng test(…)/it(…) trong 18 tệp trên', 'test(…)/it(…) lines in those 18 files'], value: 174 },
        { label: ['Commit của module', 'Module commits'], how: ['git rev-list --count HEAD -- (các thư mục work)', 'git rev-list --count HEAD -- (work folders)'], value: 32 },
      ],
    },
  ],
  stack: [
    { group: ['Giao diện', 'Front end'], items: ['Next.js', 'React', 'TypeScript', 'TipTap'] },
    { group: ['Backend', 'Back end'], items: ['Express', 'Prisma', 'PostgreSQL', 'Socket.IO'] },
    { group: ['Tích hợp', 'Integrations'], items: ['GitHub', 'GitLab', 'iCalendar (.ics)', 'API token'] },
    { group: ['Kiểm thử', 'Testing'], items: ['node:test (tsx --test)', 'Kiểm thử trên cơ sở dữ liệu thật'] },
  ],
  links: [{ href: '/work', label: ['Mở CT Work', 'Open CT Work'], note: ['Cần đăng nhập', 'Sign-in required'] }],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CuongThai Desktop
// ─────────────────────────────────────────────────────────────────────────────
const DESKTOP: CaseStudy = {
  slug: 'cuongthai-desktop',
  productId: 'desktop',
  name: 'CuongThai Desktop',
  kind: ['Ứng dụng máy tính', 'Desktop app'],
  summary: [
    'Ứng dụng Electron cho macOS, Windows và Linux, tự cập nhật; có công cụ lập trình AI làm việc trên thư mục dự án của người dùng, và AI ngoại tuyến chạy bằng llama.cpp ngay trên máy.',
    'An Electron app for macOS, Windows and Linux with auto-update; it includes an AI coding tool that works inside the user’s project folder, and offline AI running locally on llama.cpp.',
  ],
  status: ['Phát hành công khai, tự cập nhật', 'Publicly released, auto-updating'],
  period: ['Từ 16/08/2026 (commit đầu tiên) — phiên bản 0.5.153', 'Since 16 Aug 2026 (first commit) — version 0.5.153'],
  role: ['Một kỹ sư chính: thiết kế, lập trình, đóng gói, phát hành', 'One lead engineer: design, build, packaging, releases'],
  platforms: ['macOS (Apple Silicon + Intel) · Windows · Linux', 'macOS (Apple Silicon + Intel) · Windows · Linux'],
  context: [
    [
      'Một số việc trình duyệt không làm được: đọc và sửa tệp trong thư mục dự án, chạy lệnh terminal, chạy mô hình AI khi không có mạng. Ứng dụng desktop mang những việc đó về máy người dùng mà vẫn dùng chung tài khoản và API với web.',
      'Some things a browser cannot do: read and edit files in a project folder, run terminal commands, run an AI model with no network. The desktop app brings those to the user’s machine while sharing the web’s account and API.',
    ],
    [
      'Rủi ro đi kèm: một agent AI có quyền đọc tệp có thể đọc nhầm khoá bí mật rồi gửi lên mô hình — không sửa một byte nào mà bí mật vẫn rời khỏi máy.',
      'The risk that comes with it: an AI agent that can read files might read a secret and send it to the model — not a byte modified, yet the secret has left the machine.',
    ],
  ],
  users: [
    {
      who: ['Người học lập trình', 'People learning to code'],
      need: ['Nhờ AI đọc, sửa, chạy mã ngay trong thư mục bài tập của mình.', 'Have AI read, edit and run code right in their own project folder.'],
    },
    {
      who: ['Người học không có mạng ổn định', 'Learners without reliable internet'],
      need: ['Hỏi AI về bài học khi mất mạng.', 'Ask AI about a lesson while offline.'],
    },
    {
      who: ['Người dùng web hiện có', 'Existing web users'],
      need: ['Cùng tài khoản, ghi chú, khoá học trong một ứng dụng riêng.', 'The same account, notes and courses in a dedicated app.'],
    },
  ],
  solution: [
    {
      title: ['AI Code — agent trên thư mục dự án', 'AI Code — an agent on the project folder'],
      body: [
        'Đọc/sửa tệp, chạy lệnh, xem diff, git, MCP, agent phụ, kỹ năng và hook — với năm chế độ quyền từ “chỉ lập kế hoạch” tới “không hỏi gì”, chế độ cuối chỉ bật qua màn xác nhận.',
        'Read/edit files, run commands, view diffs, git, MCP, sub-agents, skills and hooks — with five permission modes from “plan only” to “ask nothing”, the last one only behind a confirmation screen.',
      ],
    },
    {
      title: ['AI ngoại tuyến', 'Offline AI'],
      body: [
        'Quét máy (RAM, đĩa, GPU) để mời đúng gói mô hình và bộ chạy llama.cpp (Metal, Vulkan, CUDA hoặc CPU), tải về rồi chạy cục bộ.',
        'Scans the machine (RAM, disk, GPU) to offer the right model and llama.cpp runtime (Metal, Vulkan, CUDA or CPU), downloads it and runs it locally.',
      ],
    },
    {
      title: ['Tự cập nhật', 'Auto-update'],
      body: [
        'electron-updater đọc bản phát hành trên GitHub Releases; macOS có bản riêng cho Apple Silicon và Intel, Windows có bộ cài NSIS, Linux có AppImage và gói deb.',
        'electron-updater reads releases from GitHub Releases; macOS ships separate Apple Silicon and Intel builds, Windows an NSIS installer, Linux an AppImage and a deb package.',
      ],
    },
  ],
  arch: {
    tiers: [
      {
        label: ['Giao diện', 'Renderer'],
        nodes: [
          { name: 'React', note: ['Màn hình ứng dụng', 'App screens'] },
          { name: 'Preload', note: ['Cầu nối IPC giới hạn', 'Restricted IPC bridge'] },
        ],
        flow: ['IPC', 'IPC'],
      },
      {
        label: ['Tiến trình chính', 'Main process'],
        nodes: [
          { name: 'Agent', note: ['Ngục đường dẫn + danh sách chặn', 'Path jail + blocklist'] },
          { name: 'Terminal', note: ['node-pty', 'node-pty'] },
          { name: ['AI cục bộ', 'Local AI'], note: ['Quét máy, tải gói, chạy', 'Scan, download, run'] },
          { name: 'Updater', note: ['electron-updater', 'electron-updater'] },
        ],
        flow: ['HTTPS', 'HTTPS'],
      },
      {
        label: ['Bên ngoài máy', 'Off the machine'],
        nodes: [
          { name: 'cuongthai.com API', note: ['Tài khoản, ví AI theo người', 'Accounts, per-user AI wallet'] },
          { name: 'LLM gateway', note: ['Qua backend, không lộ khoá', 'Through the backend, keys hidden'] },
          { name: 'GitHub Releases', note: ['Kho phát hành công khai', 'Public release repository'] },
        ],
      },
    ],
    caption: [
      'Agent chạy ở tiến trình chính với hai lớp chặn độc lập; khoá API của mô hình nằm ở backend, không bao giờ nằm trong ứng dụng.',
      'The agent runs in the main process behind two independent barriers; model API keys live on the backend, never in the app.',
    ],
    pipeline: {
      title: ['Đường phát hành', 'Release path'],
      steps: [
        { name: ['Một lệnh phát hành', 'One release command'], note: ['Nhánh main, thư mục sạch, không có lượt dựng nào đang chạy', 'main branch, clean folder, no build in progress'] },
        { name: ['Số phiên bản chưa từng công bố', 'A never-published version'] },
        { name: ['Dựng song song 3 nền tảng', 'Three platforms built in parallel'], note: ['GitHub Actions', 'GitHub Actions'] },
        { name: ['Bản nháp', 'Draft release'], note: ['Chưa ai thấy khi còn thiếu tệp', 'Invisible while files are missing'] },
        { name: ['Kiểm danh sách tệp', 'Asset list check'], note: ['Thiếu tệp cập nhật macOS là dừng', 'Missing macOS update files stops it'] },
      ],
    },
  },
  decisions: [
    {
      title: ['Hai lớp chặn độc lập cho agent', 'Two independent barriers for the agent'],
      problem: [
        'Prompt hệ thống có dặn mô hình đừng đọc tệp bí mật, nhưng một câu khéo nhét trong README thuyết phục được mô hình. “Chỉ đọc” không có nghĩa là vô hại.',
        'The system prompt tells the model not to read secret files, but a clever sentence planted in a README can persuade a model. “Read-only” does not mean harmless.',
      ],
      choice: [
        'Lớp 1 — ngục: mọi đường dẫn phải nằm trong thư mục người dùng chọn, kiểm bằng resolve + realpath (bắt symlink). Lớp 2 — danh sách chặn: .env, khoá riêng tư, .git, ~/.ssh, ~/.aws… không đọc được kể cả khi nằm trong ngục. “Prompt là lời khuyên, còn câu if là cái khoá.”',
        'Layer 1 — a jail: every path must sit inside the folder the user chose, checked with resolve + realpath (catching symlinks). Layer 2 — a blocklist: .env, private keys, .git, ~/.ssh, ~/.aws… cannot be read even inside the jail. “A prompt is advice; an if statement is a lock.”',
      ],
      tradeoff: [
        'Đôi khi agent không đọc được tệp người dùng thật sự muốn nó đọc; khi đó người dùng phải tự cấp quyền.',
        'Sometimes the agent cannot read a file the user really wanted it to; the user then has to grant access explicitly.',
      ],
    },
    {
      title: ['Kho phát hành công khai tách khỏi kho mã', 'A public release repository separate from the code'],
      problem: [
        'Kho mã là kho riêng tư, mà electron-updater tải bản mới KHÔNG kèm token — phát hành trong kho riêng tư thì bản cài không tự cập nhật được.',
        'The code repository is private, and electron-updater downloads updates WITHOUT a token — releasing from a private repository would break auto-update.',
      ],
      choice: [
        'Bản cài được phát hành vào một kho công khai riêng; mã nguồn vẫn riêng tư. Bản phát hành là bản nháp cho tới khi cả ba nền tảng đẩy đủ tệp.',
        'Installers are released to a separate public repository; the source stays private. A release stays a draft until all three platforms have uploaded their files.',
      ],
      tradeoff: ['Thêm một kho phải giữ đồng bộ, và cần lệnh phát hành có chốt kiểm (xem sự cố bên dưới).', 'One more repository to keep in sync, and a release command with gates is needed (see incidents below).'],
    },
    {
      title: ['AI ngoại tuyến: chỉ hứa điều đã chạy thử', 'Offline AI: promise only what has been run'],
      problem: [
        'Thấy tên card NVIDIA không có nghĩa llama.cpp dùng được nó: thiếu Vulkan loader thì chương trình chết lúc khởi động, trông y như ứng dụng hỏng. Máy chỉ có CPU nạp đề được 33,8 token/giây (đo trên máy thật) — một bài học 2.400 chữ phải chờ 71 giây mới ra chữ đầu tiên.',
        'Seeing an NVIDIA card name does not mean llama.cpp can use it: without a Vulkan loader the runtime dies at start-up, looking exactly like a broken app. A CPU-only machine processed prompts at 33.8 tokens/second (measured on real hardware) — a 2,400-word lesson would wait 71 seconds for the first character.',
      ],
      choice: [
        'Quét máy trả về hai mức tin cậy: “mới nhìn tên thiết bị” và “đã chạy thử llama-server --list-devices”. Chỉ mức sau mới được nói “máy bạn chạy nhanh”. Máy không có GPU thì không mời mô hình 4B dù RAM dư. Bộ chạy thử theo thứ tự ưu tiên rồi lùi dần; phiên bản llama.cpp được ghim, không chạy theo bản mới nhất.',
        'The machine scan returns two confidence levels: “only saw the device name” and “actually ran llama-server --list-devices”. Only the latter may say “your machine is fast”. Machines without a GPU are not offered the 4B model even with spare RAM. Runtimes are tried in priority order and fall back; the llama.cpp build is pinned rather than tracking the latest.',
      ],
      tradeoff: [
        'Người dùng máy yếu nhận mô hình nhỏ hơn mức máy “có vẻ” chạy được — chọn trải nghiệm không treo thay vì chất lượng tối đa.',
        'Users on weaker machines get a smaller model than their machine “seems” able to run — a responsive experience over maximum quality.',
      ],
    },
    {
      title: ['Mô hình mặc định cho agent chọn theo giá TRONG vòng lặp', 'The agent’s default model chosen by cost INSIDE the loop'],
      problem: [
        'Theo giá một lượt lẻ, một mô hình GPT trông rẻ hơn mô hình Claude mạnh nhất. Nhưng agent gọi công cụ nhiều vòng trong một việc.',
        'By single-call price, a GPT model looks cheaper than the strongest Claude model. But an agent calls tools over many rounds in one task.',
      ],
      choice: [
        'Đo ba lượt trên đúng vòng lặp của agent với cùng một câu hỏi: cổng bọc mô hình GPT trong ~15 nghìn token ẩn mỗi việc và phần đó nhân theo số vòng, nên trong vòng lặp nó đắt gấp 7,3 lần mô hình mặc định được chọn. Nhãn trong ứng dụng ghi thẳng con số này.',
        'Three runs were measured on the agent’s real loop with the same question: the gateway wraps GPT models in ~15 thousand hidden tokens per task, multiplied by the number of rounds, so inside the loop it cost 7.3× the chosen default. The in-app label states this figure.',
      ],
      tradeoff: ['Phải đo lại khi cổng đổi cách bọc mô hình.', 'Needs re-measuring whenever the gateway changes how it wraps models.'],
    },
  ],
  incidents: [
    {
      title: ['Một phiên bản không bao giờ được phát hành, một phiên bản bị dựng đè', 'One version never shipped, another built twice'],
      date: '19–20/08/2026',
      what: [
        '11 lần tăng số phiên bản trong 4,5 giờ từ nhiều phiên làm việc song song: bản 0.5.39 được tăng số nhưng không bao giờ phát hành; bản 0.5.40 bị dựng hai lượt và lượt sau tải đè tệp lên chính bản đã công bố.',
        '11 version bumps in 4.5 hours from several parallel work sessions: 0.5.39 was bumped but never released; 0.5.40 was built twice and the second run overwrote the files of the already-published release.',
      ],
      cause: [
        'Không có chỗ nào đối chiếu “số trong package.json” với “số đã lên GitHub Releases”, và hàng đợi của workflow chỉ xếp hàng chứ không chặn.',
        'Nothing compared “the number in package.json” with “the number on GitHub Releases”, and the workflow’s concurrency setting only queued runs instead of blocking them.',
      ],
      fix: [
        'Một lệnh phát hành duy nhất có chốt: đúng nhánh main, thư mục sạch, không chậm hơn remote, không có lượt dựng nào đang chạy, số phiên bản chưa từng công bố; dựng xong thì kiểm lại danh sách tệp. Workflow có thêm bước chặn dựng đè bản đã công bố.',
        'A single release command with gates: on main, clean folder, not behind the remote, no build running, version never published; after building it re-checks the asset list. The workflow also refuses to rebuild a published release.',
      ],
    },
    {
      title: ['Bản phát hành công khai khi còn thiếu tệp', 'A release went public with files missing'],
      date: '17/08/2026',
      what: [
        'Người bấm “Kiểm tra bản mới” đúng lúc đó nhận lỗi 404 không tìm thấy tệp cập nhật macOS — đọc như ứng dụng hỏng.',
        'Anyone pressing “Check for updates” at that moment got a 404 for the macOS update file — reading like a broken app.',
      ],
      cause: [
        'Ba nền tảng dựng song song; job nào xong trước công bố bản phát hành ngay trong khi hai job kia còn đang dựng.',
        'Three platforms build in parallel; whichever job finished first published the release while the other two were still building.',
      ],
      fix: ['Đổi sang phát hành dạng nháp, chỉ công bố khi đủ tệp.', 'Switched to draft releases, published only when every file is present.'],
    },
    {
      title: ['Một tài khoản tiêu hết hạn mức AI làm mọi tài khoản bị chặn', 'One account exhausting the AI quota blocked every account'],
      date: '11/09/2026',
      what: [
        'Người dùng báo: tài khoản A dùng nhiều bị giới hạn, sang tài khoản B chưa dùng gì cũng bị giới hạn.',
        'A user reported: account A hit the limit after heavy use, and account B — unused — was limited too.',
      ],
      cause: ['Ví AI cũ cộng chi phí của mọi tài khoản trong ngày rồi so với một con số chung.', 'The old AI wallet summed every account’s spend for the day against one shared number.'],
      fix: [
        'Ví theo từng người, cửa sổ trượt 5 giờ (hạn mức hồi dần, không có mốc reset), tách riêng AI chat và AI Code vì agent tiêu gấp nhiều lần chat.',
        'A per-person wallet with a sliding 5-hour window (the allowance recovers gradually, no reset cliff), with AI chat and AI Code separated because the agent spends many times more than chat.',
      ],
    },
  ],
  metrics: [
    {
      title: ['Kho mã ứng dụng desktop', 'Desktop app codebase'],
      source: 'counted',
      items: [
        { label: ['Commit', 'Commits'], how: ['git rev-list --count HEAD -- desktop', 'git rev-list --count HEAD -- desktop'], value: 480 },
        { label: ['Tệp mã nguồn (không tính test)', 'Source files (excluding tests)'], how: ['.ts/.tsx trong desktop/src, bỏ *.test.*', '.ts/.tsx in desktop/src, excluding *.test.*'], value: 315 },
        { label: ['Dòng mã (không tính test)', 'Lines of code (excluding tests)'], how: ['wc -l trên các tệp đó', 'wc -l over those files'], value: 80248 },
        { label: ['Tệp kiểm thử (Vitest)', 'Test files (Vitest)'], how: ['*.test.* trong desktop/src', '*.test.* in desktop/src'], value: 180 },
        { label: ['Mô-đun của agent', 'Agent modules'], how: ['*.ts trong src/main/agent, bỏ *.test.ts', '*.ts in src/main/agent, excluding *.test.ts'], value: 42 },
        { label: ['Chế độ quyền của agent', 'Agent permission modes'], how: ['Hằng CHE_DO_QUYEN trong shared/ipc.ts', 'CHE_DO_QUYEN constant in shared/ipc.ts'], value: 5 },
      ],
    },
  ],
  stack: [
    { group: ['Ứng dụng', 'App'], items: ['Electron 33', 'React 18', 'TypeScript', 'Vite', 'Tailwind CSS'] },
    { group: ['Hệ thống', 'System'], items: ['node-pty', 'electron-updater', 'safeStorage', 'ONNX Runtime'] },
    { group: ['AI', 'AI'], items: ['llama.cpp (Metal · Vulkan · CUDA · CPU)', 'MCP', 'Cổng LLM qua backend'] },
    { group: ['Đóng gói', 'Packaging'], items: ['electron-builder', 'DMG + ZIP (arm64, x64)', 'NSIS', 'AppImage + deb', 'GitHub Actions'] },
  ],
  links: [{ href: '/download', label: ['Trang tải về', 'Download page'] }],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CuongThai iOS
// ─────────────────────────────────────────────────────────────────────────────
const IOS: CaseStudy = {
  slug: 'cuongthai-ios',
  productId: 'ios',
  name: 'CuongThai iOS',
  kind: ['Ứng dụng iPhone & iPad', 'iPhone & iPad app'],
  summary: [
    'Ứng dụng SwiftUI gốc cho iPhone và iPad, dùng chung REST API với web: học theo ngành, vở viết tay bằng Apple Pencil, thư viện sách, tin nhắn thời gian thực và gọi thoại.',
    'A native SwiftUI app for iPhone and iPad on the same REST API as the web: study by major, Apple Pencil notebooks, a book library, realtime messaging and calls.',
  ],
  status: ['Thử nghiệm qua TestFlight — chưa phát hành trên App Store', 'In TestFlight testing — not yet on the App Store'],
  period: ['Kho mã iOS từ 19/08/2026 (commit đầu tiên)', 'iOS repository since 19 Aug 2026 (first commit)'],
  role: [
    'Một kỹ sư chính: thiết kế tính năng, kiểm thử trên máy ảo và thiết bị thật, phát hành TestFlight. Phần lớn mã Swift được viết cùng trợ lý lập trình AI (Claude Code), như README của dự án ghi rõ.',
    'One lead engineer: feature design, testing on simulator and real devices, TestFlight releases. Much of the Swift is written with an AI coding assistant (Claude Code), as the project README states.',
  ],
  platforms: ['iOS 17+ · iPhone và iPad', 'iOS 17+ · iPhone and iPad'],
  context: [
    [
      'Học trên điện thoại và iPad cần thứ trình duyệt làm không tốt: viết tay bằng bút, thông báo, tiện ích màn hình chính, chia sẻ từ ứng dụng khác, dùng khi mất mạng.',
      'Studying on a phone or iPad needs things a browser does poorly: pen handwriting, notifications, home-screen widgets, sharing from other apps, offline use.',
    ],
    [
      'Ứng dụng phải qua được kiểm duyệt của App Store: đăng nhập riêng tư, xoá tài khoản trong ứng dụng, kiểm duyệt nội dung người dùng, không tải nội dung của bên thứ ba, quyền và dữ liệu khai báo đúng.',
      'The app has to pass App Store review: a private sign-in option, in-app account deletion, moderation of user content, no downloading of third-party media, correctly declared permissions and data use.',
    ],
  ],
  users: [
    {
      who: ['Sinh viên trên điện thoại', 'Students on their phones'],
      need: ['Học theo ngành, xem khoá học, nhắn tin, nhận thông báo.', 'Study by major, follow courses, message, get notifications.'],
    },
    {
      who: ['Người học trên iPad', 'Learners on iPad'],
      need: ['Ghi vở viết tay bằng Apple Pencil, giao diện hai cột.', 'Handwritten notebooks with Apple Pencil, a two-column layout.'],
    },
  ],
  solution: [
    {
      title: ['Học theo ngành', 'Study by major'],
      body: ['Chọn ngành và ngành hẹp, lọc môn, xem sơ đồ môn học, bài học tải về để học ngoại tuyến trên iPad.', 'Choose a major and specialisation, filter subjects, view the subject map, download lessons for offline study on iPad.'],
    },
    {
      title: ['Vở viết tay', 'Handwritten notebooks'],
      body: ['Vở bằng PencilKit; AI có thể vẽ hình và chữ lên trang vở dưới dạng nét bút thật.', 'PencilKit notebooks; the AI can draw shapes and text onto the page as real pen strokes.'],
    },
    {
      title: ['Thời gian thực', 'Realtime'],
      body: ['Tin nhắn qua Socket.IO, gọi thoại qua WebRTC, thông báo đẩy.', 'Messaging over Socket.IO, calls over WebRTC, push notifications.'],
    },
    {
      title: ['Ngoài ứng dụng chính', 'Beyond the main app'],
      body: ['Tiện ích màn hình chính (WidgetKit) và phần mở rộng chia sẻ để gửi video từ ứng dụng khác vào.', 'A home-screen widget (WidgetKit) and a share extension to send videos in from other apps.'],
    },
  ],
  arch: {
    tiers: [
      {
        label: ['Target trong dự án', 'Targets in the project'],
        nodes: [
          { name: 'CuongThaiApp', note: ['iPhone + iPad', 'iPhone + iPad'] },
          { name: 'TienWidget', note: ['WidgetKit', 'WidgetKit'] },
          { name: 'ChiaSeVideo', note: ['Share extension', 'Share extension'] },
          { name: 'CuongThaiAdmin', note: ['Ứng dụng quản trị iPad', 'iPad admin app'] },
        ],
        flow: ['Dùng chung thư mục Shared/', 'Share the Shared/ folder'],
      },
      {
        label: ['Lớp dùng chung', 'Shared layer'],
        nodes: [
          { name: 'SwiftUI views', note: ['MVVM', 'MVVM'] },
          { name: 'APIClient', note: ['async/await, tự làm mới token', 'async/await, token refresh'] },
          { name: 'Keychain', note: ['Thông tin đăng nhập', 'Credentials'] },
          { name: 'SwiftData', note: ['Dữ liệu cục bộ', 'Local data'] },
        ],
        flow: ['HTTPS · Socket.IO · WebRTC', 'HTTPS · Socket.IO · WebRTC'],
      },
      {
        label: ['Máy chủ', 'Server'],
        nodes: [
          { name: 'cuongthai.com API', note: ['REST /api/v1, JWT', 'REST /api/v1, JWT'] },
          { name: ['Xác minh StoreKit', 'StoreKit verification'], note: ['Chữ ký JWS của Apple', 'Apple JWS signatures'] },
        ],
      },
    ],
    caption: [
      'Dự án Xcode sinh từ project.yml bằng XcodeGen; mọi target dùng chung lớp Shared/ và cùng một API với web.',
      'The Xcode project is generated from project.yml with XcodeGen; every target shares the Shared/ layer and the same API as the web.',
    ],
  },
  decisions: [
    {
      title: ['Máy chủ là nguồn sự thật cho quyền và gói trả phí', 'The server is the source of truth for access and paid plans'],
      problem: ['Tin trạng thái Pro do máy khách tự báo là mời người dùng sửa ứng dụng để mở khoá.', 'Trusting a client-reported Pro status invites users to patch the app to unlock it.'],
      choice: [
        'Ứng dụng luôn hỏi máy chủ; mọi cổng Pro chặn ở backend, ứng dụng chỉ hiển thị điều máy chủ trả về. Nhờ vậy gói mua trên web dùng được ngay trong ứng dụng.',
        'The app always asks the server; every Pro gate is enforced on the backend and the app only displays what the server returns. A plan bought on the web therefore works in the app immediately.',
      ],
      tradeoff: ['Một số màn hình cần mạng mới biết quyền.', 'Some screens need the network to know access rights.'],
    },
    {
      title: ['Xác minh giao dịch App Store tới tận gốc chứng thư của Apple', 'Verifying App Store transactions up to Apple’s root certificate'],
      problem: [
        'Giao dịch StoreKit là JWS mang sẵn chuỗi chứng thư. Kiểm chữ ký bằng chính chứng thư nằm trong gói là cái bẫy: kẻ tấn công tự ký một giao dịch “đã mua 12 tháng” và mã vẫn báo hợp lệ.',
        'StoreKit transactions are JWS carrying their own certificate chain. Verifying with the certificate inside the payload is a trap: an attacker self-signs a “bought 12 months” transaction and the code still says valid.',
      ],
      choice: [
        'Backend kiểm chuỗi lá ← trung gian ← gốc bằng mật mã, gốc phải khớp vân tay SHA-256 của Apple Root CA – G3 được ghim sẵn (không lấy từ gói), mọi chứng thư còn hạn, rồi mới kiểm chữ ký.',
        'The backend cryptographically verifies leaf ← intermediate ← root, requires the root to match the pinned SHA-256 fingerprint of Apple Root CA – G3 (never taken from the payload), checks validity periods, and only then the signature.',
      ],
      tradeoff: ['Khi Apple thay chứng thư gốc thì phải cập nhật vân tay ghim.', 'When Apple rotates its root, the pinned fingerprint must be updated.'],
    },
    {
      title: ['Tuân thủ App Store dựng sẵn trước khi nộp', 'App Store compliance built in before submission'],
      problem: [
        'Bản đầu có màn hình giữ chỗ, ảnh đăng lên là URL giả, token lưu trong UserDefaults, một module nhạc lấy âm thanh từ YouTube và một bề mặt bán hàng — đều là lý do bị từ chối.',
        'The first version had placeholder screens, uploads that posted a fake URL, tokens in UserDefaults, a music module pulling audio from YouTube and a shop surface — all grounds for rejection.',
      ],
      choice: [
        'Thêm Đăng nhập bằng Apple, xoá tài khoản trong ứng dụng, báo cáo/ẩn/chặn nội dung và màn đồng ý quy tắc; gỡ module nhạc và cửa hàng; viết thật các màn giữ chỗ và tải ảnh thật; chuyển token sang Keychain kèm di chuyển một lần cho bản cũ.',
        'Added Sign in with Apple, in-app account deletion, report/hide/block and a rules-consent screen; removed the music module and shop; built out the placeholder screens and real image upload; moved tokens to Keychain with a one-time migration for older installs.',
      ],
      tradeoff: ['Ứng dụng có ít tính năng hơn web ở những chỗ quy định không cho phép.', 'The app has fewer features than the web where the rules do not allow them.'],
    },
    {
      title: ['Dự án Xcode sinh từ tệp cấu hình', 'An Xcode project generated from configuration'],
      problem: ['Tệp dự án Xcode khó đọc và hay xung đột khi nhiều thay đổi cùng lúc.', 'Xcode project files are hard to read and conflict easily under concurrent changes.'],
      choice: ['Mô tả target, gói phụ thuộc và cấu hình trong project.yml, sinh dự án bằng XcodeGen.', 'Targets, packages and settings are described in project.yml and the project is generated with XcodeGen.'],
      tradeoff: ['Tệp Swift mới phải chạy lại bước sinh dự án, quên thì lỗi hiện ra dạng “không tìm thấy ký hiệu”.', 'New Swift files require re-running generation; forgetting shows up as “symbol not found”.'],
    },
  ],
  incidents: [
    {
      title: ['Lỗi giải mã bị nuốt: hồ sơ hiện trống thay vì báo lỗi', 'Swallowed decoding errors: an empty profile instead of an error'],
      what: ['Một số màn hình hiện dữ liệu trống dù API trả đủ.', 'Some screens showed empty data although the API returned everything.'],
      cause: [
        'Bộ giải mã JSON dùng chiến lược ngày mặc định nên khai kiểu Date là hỏng cả lượt giải mã; và thuộc tính `let` có giá trị mặc định bị Codable bỏ qua trong im lặng.',
        'The JSON decoder used the default date strategy, so declaring a Date failed the whole decode; and `let` properties with a default value are silently skipped by Codable.',
      ],
      fix: ['Ngày từ API khai dạng chuỗi rồi tự đọc; trường của model API là `var` và optional. Ghi thành luật trong tài liệu dự án.', 'API dates are declared as strings and parsed explicitly; API model fields are `var` and optional. Written down as project rules.'],
    },
    {
      title: ['Nét AI vẽ lên vở có trong bản vẽ nhưng vô hình trên iPad thật', 'AI-drawn strokes present in the drawing but invisible on a real iPad'],
      date: '28/09/2026',
      what: ['Hình AI vẽ lên vở không hiện ra trên iPad thật.', 'Shapes the AI drew into a notebook did not appear on a real iPad.'],
      cause: ['Điểm nét cỡ 1,2pt với mực bút — PencilKit trên iPad thật không vẽ ra; cỡ điểm không phải bề rộng bút.', 'Stroke points of 1.2pt with pen ink — PencilKit on a real iPad renders nothing; point size is not pen width.'],
      fix: ['Lấy cỡ điểm theo nét mẫu của người dùng và không bao giờ dưới 2,4pt. Bài học: kiểm trên thiết bị thật.', 'Point size now follows the user’s sample stroke and never drops below 2.4pt. Lesson: test on real hardware.'],
    },
    {
      title: ['Hai sheet trên cùng một màn hình: một cái bấm không phản hồi', 'Two sheets on one screen: one button silently did nothing'],
      what: ['Một nút mở bảng chọn không làm gì, không lỗi.', 'A button meant to open a sheet did nothing, with no error.'],
      cause: ['SwiftUI chỉ chạy `.sheet(isPresented:)` cuối cùng khi gắn hai cái lên cùng một view.', 'SwiftUI only runs the last `.sheet(isPresented:)` when two are attached to the same view.'],
      fix: ['Mỗi màn hình dùng một `.sheet(item:)` với enum.', 'Each screen uses a single `.sheet(item:)` driven by an enum.'],
    },
  ],
  incidentsNote: [
    'Ứng dụng chưa phát hành rộng nên đây là lỗi bắt được trong lúc phát triển và thử nghiệm, không phải sự cố với người dùng cuối.',
    'The app is not widely released, so these are bugs caught during development and testing, not incidents with end users.',
  ],
  metrics: [
    {
      title: ['Kho mã iOS (kho riêng)', 'iOS codebase (separate repository)'],
      source: 'counted',
      items: [
        { label: ['Tệp Swift đã commit', 'Committed Swift files'], how: ['git ls-files "*.swift" | wc -l', 'git ls-files "*.swift" | wc -l'], value: 343 },
        { label: ['Dòng Swift đã commit', 'Committed lines of Swift'], how: ['git ls-files -z "*.swift" | xargs -0 cat | wc -l', 'git ls-files -z "*.swift" | xargs -0 cat | wc -l'], value: 132833 },
        { label: ['Commit', 'Commits'], how: ['git rev-list --count HEAD', 'git rev-list --count HEAD'], value: 263 },
        { label: ['Target ứng dụng iOS', 'iOS app targets'], how: ['Khối target iOS trong project.yml', 'iOS target blocks in project.yml'], value: 4 },
        { label: ['Tệp kiểm thử xác minh Apple ở backend', 'Backend Apple-verification test files'], how: ['src/services/appleIAP/*.test.ts', 'src/services/appleIAP/*.test.ts'], value: 3 },
      ],
    },
  ],
  stack: [
    { group: ['Ứng dụng', 'App'], items: ['Swift', 'SwiftUI', 'SwiftData', 'Keychain', 'XcodeGen'] },
    { group: ['Khung Apple', 'Apple frameworks'], items: ['PencilKit', 'WidgetKit', 'StoreKit', 'Sign in with Apple', 'AVFoundation', 'Vision', 'PDFKit'] },
    { group: ['Gói ngoài', 'Packages'], items: ['Kingfisher', 'Socket.IO-Client-Swift', 'GoogleSignIn', 'WebRTC'] },
  ],
  links: [],
  caveat: [
    'Chưa có liên kết công khai: bản thử nghiệm phát qua TestFlight theo lời mời.',
    'No public link yet: test builds are distributed through TestFlight by invitation.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. LabFlow AI
// ─────────────────────────────────────────────────────────────────────────────
const LABFLOW: CaseStudy = {
  slug: 'labflow-ai',
  productId: 'labflow',
  name: 'LabFlow AI',
  kind: ['Đồ án tốt nghiệp — đang phát triển', 'Graduation project — in development'],
  summary: [
    'Hệ thống đặt phòng lab và mượn thiết bị không bao giờ trùng lịch: QR check-in, hàng chờ, bảo trì, báo cáo — giai đoạn sau thêm đo mức sử dụng bằng ESP32 và trợ lý AI trả lời có trích dẫn. Đồ án SWP391 → SEP490, Đại học FPT.',
    'A lab and equipment booking system that never double-books: QR check-in, waitlist, maintenance, reports — later, ESP32 usage metering and an AI assistant that answers with citations. SWP391 → SEP490 capstone, FPT University.',
  ],
  status: ['Đang phát triển — giai đoạn lập kế hoạch, bắt đầu viết mã 05/10/2026', 'In development — planning stage, coding starts 5 Oct 2026'],
  period: ['20 tuần: 05/10/2026 → 21/02/2027', '20 weeks: 5 Oct 2026 → 21 Feb 2027'],
  role: ['Tự làm toàn bộ, đóng năm vai C1–C5 của nhóm; mã viết tay', 'Solo, playing all five team roles C1–C5; code written by hand'],
  platforms: ['Web', 'Web'],
  caveat: [
    'Chưa có bản chạy. Những gì trang này mô tả là kế hoạch, yêu cầu và thiết kế đã viết ra — không phải tính năng đã hoàn thành.',
    'There is no running build yet. What this page describes is the written plan, requirements and design — not finished features.',
  ],
  context: [
    [
      'Phòng lab và thiết bị dùng chung bị đặt trùng giờ, giữ chỗ rồi không đến, mượn mà không rõ trả, hỏng mà không ai ghi. Đồ án giải bài toán đó với mục tiêu cứng: cơ sở dữ liệu tự từ chối mọi lượt đặt trùng.',
      'Shared labs and equipment get double-booked, reserved and not used, borrowed without clear returns, broken with nobody logging it. The project tackles that with a hard goal: the database itself rejects every double booking.',
    ],
    [
      'Đồ án được chạy như một dự án khách hàng: toàn bộ kế hoạch, yêu cầu, cổng chất lượng, rủi ro và hồ sơ bảo vệ đã nằm trên CT Work trước khi viết dòng mã đầu tiên.',
      'The capstone is run like a client project: the whole plan, requirements, quality gates, risks and defence documents were on CT Work before the first line of code.',
    ],
  ],
  users: [
    { who: ['Sinh viên, giảng viên', 'Students, lecturers'], need: ['Đặt phòng lab, mượn thiết bị, vào hàng chờ khi kín chỗ.', 'Book labs, borrow equipment, join a waitlist when full.'] },
    { who: ['Nhân viên lab', 'Lab staff'], need: ['Check-in bằng QR, giao/nhận thiết bị, ghi bảo trì.', 'QR check-in, hand-over and return of equipment, maintenance logs.'] },
    { who: ['Quản lý lab, quản trị viên', 'Lab managers, administrators'], need: ['Danh mục tài nguyên, phân quyền, báo cáo sử dụng, nhật ký kiểm toán.', 'Resource catalogue, roles, usage reports, audit log.'] },
  ],
  solution: [
    {
      title: ['Đặt chỗ không trùng (dự kiến)', 'Booking without overlaps (planned)'],
      body: ['Ràng buộc loại trừ trên khoảng thời gian, khoá idempotency, khoá lạc quan; kiểm chứng bằng 2/10/50 yêu cầu đồng thời trên PostgreSQL thật.', 'An exclusion constraint on time ranges, idempotency keys, optimistic locking; verified with 2/10/50 concurrent requests on real PostgreSQL.'],
    },
    {
      title: ['Hàng chờ, QR, mượn/trả, bảo trì (dự kiến)', 'Waitlist, QR, loans, maintenance (planned)'],
      body: ['Hàng chờ FIFO có giữ chỗ và hết hạn; QR dùng một lần; máy trạng thái cho mượn/trả và bảo trì.', 'A FIFO waitlist with holds and expiry; single-use QR codes; state machines for loans and maintenance.'],
    },
    {
      title: ['IoT và AI — giai đoạn SEP490 (dự kiến)', 'IoT and AI — SEP490 phase (planned)'],
      body: ['ESP32 + cảm biến dòng → MQTT → phiên sử dụng tự check-in/no-show; trợ lý RAG trên pgvector có trích dẫn và chính sách “không biết thì nói không biết”.', 'ESP32 + current sensor → MQTT → usage sessions with automatic check-in/no-show; a pgvector RAG assistant with citations and a “say you don’t know” policy.'],
    },
  ],
  arch: {
    tiers: [
      {
        label: ['Giao diện', 'Client'],
        nodes: [{ name: 'React + TypeScript', note: ['Theo vai: SV, GV, NV lab, QL, Admin', 'By role: student, lecturer, staff, manager, admin'] }],
        flow: ['REST', 'REST'],
      },
      {
        label: ['Ứng dụng', 'Application'],
        nodes: [
          { name: 'Spring Boot 3', note: ['Java 21 · Spring Security · JPA', 'Java 21 · Spring Security · JPA'] },
          { name: 'MQTT consumer', note: ['Giai đoạn SEP490', 'SEP490 phase'] },
        ],
        flow: ['Flyway migration · JPA', 'Flyway migrations · JPA'],
      },
      {
        label: ['Dữ liệu', 'Data'],
        nodes: [
          { name: 'PostgreSQL 16', note: ['btree_gist: chặn đặt trùng', 'btree_gist: blocks double booking'] },
          { name: 'pgvector', note: ['RAG có trích dẫn', 'Cited RAG'] },
        ],
      },
      {
        label: ['Thiết bị', 'Devices'],
        nodes: [{ name: 'ESP32', note: ['Cảm biến dòng → MQTT', 'Current sensor → MQTT'] }],
      },
    ],
    caption: [
      'Kiến trúc DỰ KIẾN theo hồ sơ thiết kế — chưa dựng.',
      'PLANNED architecture from the design documents — not built yet.',
    ],
  },
  decisions: [
    {
      title: ['Cơ sở dữ liệu từ chối đặt trùng, không phải một câu if', 'The database rejects double bookings, not an if statement'],
      problem: ['Hai yêu cầu cùng một khung giờ đến cùng lúc: kiểm trong mã rồi mới ghi thì cả hai đều qua.', 'Two requests for the same slot arrive at once: check-then-write in application code lets both through.'],
      choice: [
        'Ràng buộc EXCLUDE USING gist trên khoảng thời gian nửa mở [bắt đầu, kết thúc) — 9–11h và 11–13h không trùng. Yêu cầu thua nhận lỗi 23P01, API trả 409 kèm gợi ý vào hàng chờ.',
        'An EXCLUDE USING gist constraint on half-open time ranges [start, end) — 9–11 and 11–13 do not overlap. The losing request gets error 23P01 and the API returns 409 with a waitlist suggestion.',
      ],
      tradeoff: [
        'Gắn chặt với PostgreSQL; khoảng thời gian phải chép sang bảng chi tiết vì ràng buộc loại trừ chỉ nhìn được cột trong cùng một bảng.',
        'Tied to PostgreSQL; the time range is copied into the item table because an exclusion constraint only sees columns of one table.',
      ],
    },
    {
      title: ['QR dùng một lần, chỉ lưu bản băm', 'Single-use QR codes, only the hash stored'],
      problem: ['Mã QR bị chụp lại hoặc quét hai lần.', 'QR codes get photographed or scanned twice.'],
      choice: ['UPDATE … WHERE used_at IS NULL: lần quét thứ hai cập nhật 0 dòng. Cơ sở dữ liệu chỉ giữ bản băm của token.', 'UPDATE … WHERE used_at IS NULL: the second scan updates 0 rows. The database keeps only a hash of the token.'],
      tradeoff: ['Mất mã thì phải cấp mã mới, không khôi phục được.', 'A lost code must be reissued; it cannot be recovered.'],
    },
    {
      title: ['Chia việc theo lát dọc, không theo tầng', 'Splitting work by vertical slice, not by layer'],
      problem: ['Môn học chấm số dòng mã theo màn hình của từng thành viên.', 'The course grades lines of code per member’s screens.'],
      choice: ['Mỗi vai sở hữu trọn một nhóm chức năng từ giao diện tới cơ sở dữ liệu; 46 yêu cầu (41 màn hình + 5 chức năng không giao diện) gắn với vai phụ trách.', 'Each role owns a whole feature group from UI to database; 46 requirements (41 screens + 5 non-UI functions) are assigned to an owning role.'],
      tradeoff: ['Một người đóng cả năm vai phải chuyển ngữ cảnh liên tục.', 'One person playing all five roles must switch context constantly.'],
    },
  ],
  incidents: [],
  incidentsNote: [
    'Chưa có sự cố — dự án chưa bắt đầu viết mã. Thay vào đó là các rủi ro đã nhận diện trong kế hoạch:',
    'No incidents yet — coding has not started. Instead, these are risks identified in the plan:',
  ],
  risks: [
    ['Phạm vi phình to', 'Scope creep'],
    ['Học Spring chậm hơn dự kiến', 'Learning Spring slower than planned'],
    ['Một người làm dễ kiệt sức', 'Burnout when working solo'],
    ['Thiết bị IoT không ổn định', 'Unstable IoT devices'],
    ['Rò rỉ quyền qua RAG, API hoặc QR', 'Permission leakage through RAG, API or QR'],
    ['Tuần 11–20 trùng thời gian thực tập', 'Weeks 11–20 overlap with the internship'],
  ],
  metrics: [
    {
      title: ['Kế hoạch trên CT Work', 'The plan on CT Work'],
      source: 'counted',
      items: [
        { label: ['Tuần trong kế hoạch', 'Weeks in the plan'], how: ['labflow-v2.json → weeks.length', 'labflow-v2.json → weeks.length'], value: 20 },
        { label: ['Yêu cầu trong backlog', 'Backlog requirements'], how: ['labflow-v2.json → backlog.length (41 màn hình + 5 không giao diện)', 'labflow-v2.json → backlog.length (41 screens + 5 non-UI)'], value: 46 },
        { label: ['Epic', 'Epics'], how: ['labflow-v2.json → epics.length', 'labflow-v2.json → epics.length'], value: 16 },
        { label: ['Ca kiểm thử đã viết trước', 'Test cases written up front'], how: ['labflow-v2.json → tests.length', 'labflow-v2.json → tests.length'], value: 41 },
        { label: ['Rủi ro đã nhận diện', 'Identified risks'], how: ['labflow-v2.json → risks.length', 'labflow-v2.json → risks.length'], value: 10 },
        { label: ['Mốc / cổng chất lượng', 'Milestones / quality gates'], how: ['labflow-v2.json → milestones.length', 'labflow-v2.json → milestones.length'], value: 9 },
        { label: ['Hướng dẫn viết báo cáo SEP490', 'SEP490 report guides'], how: ['Tệp đánh số trong docs/sep490', 'Numbered files in docs/sep490'], value: 16 },
      ],
    },
  ],
  stack: [
    { group: ['Backend (dự kiến)', 'Back end (planned)'], items: ['Java 21', 'Spring Boot 3', 'Spring Security', 'Spring Data JPA', 'Flyway'] },
    { group: ['Dữ liệu (dự kiến)', 'Data (planned)'], items: ['PostgreSQL 16', 'btree_gist', 'pgvector'] },
    { group: ['Giao diện (dự kiến)', 'Front end (planned)'], items: ['React', 'TypeScript'] },
    { group: ['Kiểm thử & vận hành (dự kiến)', 'Testing & ops (planned)'], items: ['Testcontainers', 'Docker Compose', 'GitHub Actions', 'MailTrap'] },
    { group: ['IoT (dự kiến)', 'IoT (planned)'], items: ['ESP32', 'MQTT'] },
  ],
  links: [{ href: '/projects/labflow-ai', label: ['Hồ sơ dự án', 'Project file'], note: ['Kiến trúc, ERD, lộ trình 20 tuần', 'Architecture, ERD, 20-week roadmap'] }],
};

export const CASES: CaseStudy[] = [SITE, CTWORK, DESKTOP, IOS, LABFLOW];

export function getCase(slug: string): CaseStudy | undefined {
  return CASES.find((c) => c.slug === slug);
}
