/**
 * Case-study 1.3 — URL Shortener with analytics.
 *
 * First project on the roadmap where performance is a functional requirement
 * rather than a later optimisation: the redirect path reads Redis, click
 * recording is queued rather than awaited, and analytics are read from a
 * rollup table instead of recounted.
 *
 * Slug preserved from the existing production row.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./url-shortener-voi-analytics.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./url-shortener-voi-analytics.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'url-shortener-voi-analytics',
  title: 'URL Shortener (với Analytics)',
  titleEn: 'URL Shortener (with Analytics)',
  description:
    'Dịch vụ rút gọn link với thống kê lượt bấm. Dự án đầu tiên mà hiệu năng là yêu cầu chức năng: chuyển hướng đọc Redis chứ không đọc Postgres, ghi nhận lượt bấm qua hàng đợi để link nổi tiếng không chậm dần, và một bảng tổng hợp thay cho việc đếm lại mỗi lần mở dashboard.',
  descriptionEn:
    'A link shortener with click analytics. The first project where performance is a functional requirement: redirects read Redis rather than Postgres, clicks are queued so popular links do not slow down, and a rollup table replaces recounting on every dashboard load.',
  techStack: [
    'Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Prisma',
    'Next.js 15', 'Recharts', 'nanoid', 'QR code', 'GeoIP',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '5–7 ngày',
  durationEn: '5–7 days',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'BEGINNER',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/url-shortener-voi-analytics.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `model Link {
  id           String   @id @default(cuid())
  // Khoá tra cứu NÓNG nhất hệ thống. @unique vừa tạo chỉ mục
  // vừa là thứ chặn mã trùng ở tầng database (bắt lỗi P2002
  // rồi thử lại, thay vì "kiểm tra trước rồi ghi" — vốn có
  // race condition).
  shortCode    String   @unique
  originalUrl  String   @db.Text
  customAlias  Boolean  @default(false)

  // Bộ đếm phi chuẩn hoá: COUNT(*) trên click_events đúng chuẩn
  // quan hệ nhưng chậm dần theo số dòng.
  clicks       Int      @default(0)

  expiresAt    DateTime?
  passwordHash String?
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  events       ClickEvent[]
  createdAt    DateTime @default(now())

  @@index([userId, createdAt])
  @@map("links")
}

model ClickEvent {
  // BigInt: bảng này tăng nhanh nhất hệ thống. Int 32-bit hết
  // chỗ ở ~2,1 tỉ dòng, và đổi kiểu cột lúc đó là cuộc di trú
  // đau đớn trên chính bảng lớn nhất.
  id         BigInt   @id @default(autoincrement())
  shortCode  String
  link       Link     @relation(fields: [shortCode], references: [shortCode], onDelete: Cascade)

  occurredAt DateTime
  country    String?  @db.VarChar(2)   // KHÔNG lưu IP thô (GDPR)
  device     String?  @db.VarChar(20)
  referer    String?  @db.VarChar(500)

  @@index([shortCode, occurredAt])
  @@map("click_events")
}

model DailyStat {
  // Materialized aggregate: dashboard đọc vài chục dòng thay vì
  // quét vài trăm nghìn dòng click_events.
  shortCode String
  day       DateTime @db.Date
  country   String?  @db.VarChar(2)
  device    String?  @db.VarChar(20)
  count     Int      @default(0)

  @@id([shortCode, day, country, device])
  @@map("daily_stats")
}`,
  schemaCodeEn: `model Link {
  id           String   @id @default(cuid())
  // The HOTTEST lookup key in the system. @unique both creates the
  // index and blocks duplicate codes at the database layer (catch
  // P2002 and retry, rather than "check then write" — which has a
  // race condition).
  shortCode    String   @unique
  originalUrl  String   @db.Text
  customAlias  Boolean  @default(false)

  // Denormalised counter: COUNT(*) over click_events is relationally
  // correct but degrades as rows accumulate.
  clicks       Int      @default(0)

  expiresAt    DateTime?
  passwordHash String?
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  events       ClickEvent[]
  createdAt    DateTime @default(now())

  @@index([userId, createdAt])
  @@map("links")
}

model ClickEvent {
  // BigInt: this is the fastest-growing table in the system. A 32-bit
  // Int runs out around 2.1 billion rows, and changing the type then
  // is a painful migration on your largest table.
  id         BigInt   @id @default(autoincrement())
  shortCode  String
  link       Link     @relation(fields: [shortCode], references: [shortCode], onDelete: Cascade)

  occurredAt DateTime
  country    String?  @db.VarChar(2)   // never the raw IP (GDPR)
  device     String?  @db.VarChar(20)
  referer    String?  @db.VarChar(500)

  @@index([shortCode, occurredAt])
  @@map("click_events")
}

model DailyStat {
  // Materialised aggregate: the dashboard reads dozens of rows
  // instead of scanning hundreds of thousands of click_events.
  shortCode String
  day       DateTime @db.Date
  country   String?  @db.VarChar(2)
  device    String?  @db.VarChar(20)
  count     Int      @default(0)

  @@id([shortCode, day, country, device])
  @@map("daily_stats")
}`,
  schemaLang: 'prisma',

  milestones: [
    {
      phase: 'SETUP',
      title: 'Tách backend khỏi frontend, dựng Redis cạnh Postgres',
      titleEn: 'Split backend from frontend, run Redis beside Postgres',
      description:
        'Lần đầu trong lộ trình có một server Express riêng thay vì API route của Next.js. Redis không phải "cache cho có" — thiếu nó thì đường chuyển hướng phải đọc Postgres và hệ thống sập dưới tải thật.',
      descriptionEn:
        'The first time the roadmap has a standalone Express server instead of Next.js API routes. Redis is not decorative caching — without it the redirect path hits Postgres and the system collapses under real load.',
      codeBlock:
        'docker run -d --name url-pg -e POSTGRES_PASSWORD=dev \\\n'
        + '  -e POSTGRES_DB=shortener -p 5432:5432 postgres:16\n'
        + 'docker run -d --name url-redis -p 6379:6379 redis:7-alpine\n\n'
        + 'npm init -y && npm i express prisma @prisma/client ioredis nanoid\n'
        + 'npm i -D typescript tsx @types/express @types/node',
      codeLang: 'bash',
    },
    {
      phase: 'BACKEND',
      title: 'Sinh mã ngắn: để ràng buộc unique làm trọng tài',
      titleEn: 'Short-code generation: let the unique constraint referee',
      description:
        'Ba cách sinh mã và bẫy của từng cách. Base62 từ id tăng dần thì đoán được cả hệ thống. "Kiểm tra rồi ghi" có race condition chỉ lộ ra khi có tải thật. Cách đúng: sinh ngẫu nhiên, ghi thẳng, bắt lỗi P2002 rồi thử lại — vì ràng buộc unique là nguyên tử còn hai câu lệnh riêng thì không.',
      descriptionEn:
        'Three ways to generate codes and the trap in each. Base62 over an auto-increment lets anyone enumerate the whole system. "Check then write" has a race that only shows up under real load. The right way: generate randomly, write directly, catch P2002 and retry — because a unique constraint is atomic and two separate statements are not.',
      codeBlock:
        "// Bỏ ký tự dễ nhìn nhầm khi đọc qua điện thoại: 0/O, 1/l/I\n"
        + "const ALPHABET = '23456789abcdefghijkmnpqrstuvwxyz...';\n"
        + 'const nanoid = customAlphabet(ALPHABET, 7);\n\n'
        + 'for (let attempt = 0; attempt < 5; attempt++) {\n'
        + '  try {\n'
        + '    await tx.link.create({ data: { shortCode: nanoid(), ... } });\n'
        + '    return code;\n'
        + '  } catch (err) {\n'
        + "    if (err?.code === 'P2002') continue;  // trùng → thử lại\n"
        + '    throw err;\n'
        + '  }\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Đường chuyển hướng: Redis trước, 302 chứ không 301',
      titleEn: 'The redirect path: Redis first, 302 not 301',
      description:
        '99% request chỉ chạm Redis (~0,3ms) thay vì Postgres (~3ms). Và 302 chứ không 301: 301 là "vĩnh viễn", trình duyệt cache mãi mãi nên analytics đứng im sau lần bấm đầu, còn người dùng sửa link đích thì người đã bấm sẽ mãi đi tới địa chỉ cũ.',
      descriptionEn:
        '99% of requests touch only Redis (~0.3ms) instead of Postgres (~3ms). And 302, not 301: 301 means "permanent", browsers cache it forever, so analytics freeze after the first click and anyone who clicked once keeps going to the old destination after an edit.',
      codeBlock:
        '// 302, KHÔNG phải 301.\n'
        + '// 301 = trình duyệt cache VĨNH VIỄN, không hỏi lại server:\n'
        + '//   · không đếm được lượt bấm nào sau lần đầu\n'
        + '//   · sửa link đích thì người đã bấm vẫn đi địa chỉ cũ mãi\n'
        + 'res.redirect(302, target);',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Worker gộp lượt bấm — vì sao link nổi tiếng không chậm dần',
      titleEn: 'Click-batching worker — why popular links stay fast',
      description:
        'Mỗi lượt bấm một UPDATE là hai vấn đề cùng lúc: người dùng chờ thêm một vòng đi database, và mọi lượt bấm vào cùng một link tranh khoá trên cùng một dòng. Đẩy vào hàng đợi Redis rồi gộp mỗi 5 giây: 5.000 lượt bấm thành 1 lệnh ghi. Kèm quyết định không lưu IP thô — chuyển sang mã quốc gia ngay tại điểm nhận để không rơi vào phạm vi GDPR.',
      descriptionEn:
        'One UPDATE per click causes two problems at once: the user waits for an extra database round trip, and every click on the same link contends for the same row lock. Queue in Redis and flush every 5 seconds: 5,000 clicks become 1 write. Plus the decision not to store raw IPs — convert to a country code at ingest so the service never falls under GDPR.',
    },
    {
      phase: 'SECURITY',
      title: 'SSRF: khi server tự gọi vào metadata của chính nó',
      titleEn: 'SSRF: when the server fetches its own cloud metadata',
      description:
        'Tính năng "xem trước tiêu đề trang đích" biến server thành cỗ máy gọi HTTP theo yêu cầu người lạ. Nhập 169.254.169.254 là lấy được thông tin xác thực AWS của chính server — đúng lỗ hổng gây ra vụ rò rỉ dữ liệu tài chính lớn năm 2019. Chặn bằng cách phân giải DNS rồi kiểm tra ĐỊA CHỈ (kiểm tên miền là vô dụng).',
      descriptionEn:
        'A "preview the destination title" feature turns the server into an HTTP client strangers can aim anywhere. Submit 169.254.169.254 and it fetches its own AWS credentials — the exact hole behind a major 2019 financial-sector breach. Block it by resolving DNS and checking the ADDRESS (checking the hostname is useless).',
      codeBlock:
        '// Phân giải DNS rồi kiểm ĐỊA CHỈ, không kiểm tên miền —\n'
        + '// kẻ tấn công chỉ cần trỏ evil.com về 127.0.0.1.\n'
        + 'const { address } = await dns.lookup(url.hostname);\n'
        + 'if (isPrivate(address)) throw new Error("Địa chỉ nội bộ");\n\n'
        + '// 169.254.0.0/16 = link-local, nơi metadata AWS/GCP nằm.\n'
        + 'if (a === 169 && b === 254) return true;',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Rate limit trên Redis, và lựa chọn fail open có ý thức',
      titleEn: 'Redis rate limiting, and a deliberate fail-open choice',
      description:
        'INCR + EXPIRE với khoá nhúng số hiệu cửa sổ nên tự hết hạn, không cần dọn. Khi Redis chết thì cho request đi qua: mất giới hạn tạm thời nhẹ hơn cả dịch vụ ngừng chạy. Với endpoint chuyển tiền thì lựa chọn ngược lại mới đúng — điều quan trọng là biết mình đang chọn gì.',
      descriptionEn:
        'INCR + EXPIRE with the window number embedded in the key, so it expires on its own with nothing to clean up. When Redis dies, requests pass: briefly losing limits hurts less than the service going down. For a money-transfer endpoint the opposite choice is right — what matters is knowing which one you picked.',
    },
    {
      phase: 'FRONTEND',
      title: 'Dashboard đọc bảng tổng hợp, không đếm lại',
      titleEn: 'The dashboard reads a rollup, it does not recount',
      description:
        'GROUP BY trên click_events đúng và chạy tốt tới khoảng một triệu dòng; sau đó mỗi lần mở dashboard là một lần quét chỉ mục dài. Bảng daily_stats với khoá chính kép (link, ngày, quốc gia, thiết bị) do worker upsert — dashboard đọc vài chục dòng. Đây là lần đầu gặp khái niệm materialized aggregate.',
      descriptionEn:
        'GROUP BY over click_events is correct and fine up to about a million rows; after that every dashboard load is a long index scan. A daily_stats table keyed on (link, day, country, device) and upserted by the worker means the dashboard reads dozens of rows. This is your first materialised aggregate.',
    },
  ],

  features: [
    { title: 'Tạo link: mã ngẫu nhiên hoặc alias tự chọn', titleEn: 'Create links: random code or custom alias', description: 'nanoid 7 ký tự, bảng chữ cái đã loại bỏ ký tự dễ nhìn nhầm.', descriptionEn: 'A 7-character nanoid over an alphabet with look-alike characters removed.', status: 'PLANNED' },
    { title: 'Chuyển hướng dưới 20ms (p95)', titleEn: 'Sub-20ms redirect (p95)', description: 'Đọc Redis trước, chỉ chạm Postgres khi cache miss.', descriptionEn: 'Redis first; Postgres only on a cache miss.', status: 'PLANNED' },
    { title: 'Ghi nhận lượt bấm không chặn', titleEn: 'Non-blocking click tracking', description: 'Đẩy vào hàng đợi Redis, worker gộp mỗi 5 giây rồi ghi một lần.', descriptionEn: 'Push onto a Redis queue; the worker batches every 5 seconds and writes once.', status: 'PLANNED' },
    { title: 'Bảng phân tích theo ngày / quốc gia / thiết bị', titleEn: 'Analytics by day / country / device', description: 'Đọc từ bảng tổng hợp daily_stats, không quét bảng sự kiện.', descriptionEn: 'Read from the daily_stats rollup rather than scanning the events table.', status: 'PLANNED' },
    { title: 'Mã QR cho mỗi link', titleEn: 'QR code per link', description: 'Sinh SVG phía server, cache theo mã link.', descriptionEn: 'Server-side SVG generation, cached per code.', status: 'PLANNED' },
    { title: 'Link hết hạn và link đặt mật khẩu', titleEn: 'Expiring and password-protected links', description: 'Hết hạn trả 410 Gone chứ không phải 404 — hai tình huống khác nhau.', descriptionEn: 'Expired links return 410 Gone rather than 404 — two different situations.', status: 'PLANNED' },
    { title: 'Giới hạn tần suất fail-open', titleEn: 'Fail-open rate limiting', description: 'INCR/EXPIRE trên Redis; Redis chết thì cho qua thay vì hạ cả site.', descriptionEn: 'INCR/EXPIRE in Redis; if Redis dies, requests pass rather than taking the site down.', status: 'PLANNED' },
    { title: 'Chặn SSRF ở chức năng xem trước', titleEn: 'SSRF guard on link preview', description: 'Phân giải DNS rồi chặn mọi dải IP nội bộ, kể cả 169.254.0.0/16.', descriptionEn: 'Resolve DNS, then block every private range including 169.254.0.0/16.', status: 'PLANNED' },
    { title: 'API công khai cho lập trình viên', titleEn: 'Public developer API', description: 'Khoá API riêng, hạn mức riêng, tài liệu OpenAPI.', descriptionEn: 'Separate API keys, separate quotas, OpenAPI documentation.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Redis — cấu trúc dữ liệu và lệnh', titleEn: 'Redis — data types and commands', url: 'https://redis.io/docs/latest/develop/data-types/', type: 'LINK', description: 'Đọc kỹ LIST (hàng đợi click) và cặp INCR/EXPIRE (rate limit).', descriptionEn: 'Focus on LIST (the click queue) and the INCR/EXPIRE pair (rate limiting).' },
    { title: 'MDN — mã trạng thái chuyển hướng HTTP', titleEn: 'MDN — HTTP redirect status codes', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages', type: 'LINK', description: 'Vì sao 301 phá vỡ analytics còn 302 thì không.', descriptionEn: 'Why 301 breaks analytics and 302 does not.' },
    { title: 'OWASP — Server-Side Request Forgery', titleEn: 'OWASP — Server-Side Request Forgery', url: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/', type: 'LINK', description: 'Đọc trước khi viết bất kỳ tính năng nào cho phép người dùng nhập URL.', descriptionEn: 'Read this before building any feature that lets a user supply a URL.' },
    { title: 'nanoid — bộ sinh id ngẫu nhiên', titleEn: 'nanoid — random id generator', url: 'https://github.com/ai/nanoid', type: 'REPO', description: 'Có công cụ tính xác suất trùng theo độ dài và bảng chữ cái.', descriptionEn: 'Includes a collision-probability calculator for any length and alphabet.' },
    { title: 'ApacheBench — đo tải cơ bản', titleEn: 'ApacheBench — basic load testing', url: 'https://httpd.apache.org/docs/2.4/programs/ab.html', type: 'LINK', description: 'Công cụ đủ để chứng minh p95 dưới 20ms, có sẵn trên macOS/Linux.', descriptionEn: 'Enough to prove sub-20ms p95, and already installed on macOS/Linux.' },
  ],

  coreKnowledge: [
    { vi: 'Cache-aside: đọc cache trước, miss thì đọc DB rồi ghi lại cache, và chọn TTL thế nào', en: 'Cache-aside: read cache, fall back to DB on miss, write back — and how to choose a TTL' },
    { vi: '301 và 302 khác nhau ở chỗ nào, và vì sao chọn sai làm hỏng analytics', en: 'How 301 differs from 302, and why the wrong choice breaks analytics' },
    { vi: 'Ràng buộc unique là nguyên tử; "kiểm tra rồi ghi" trong code ứng dụng thì không', en: 'A unique constraint is atomic; "check then write" in application code is not' },
    { vi: 'Xử lý bất đồng bộ qua hàng đợi: gộp ghi để tránh tranh khoá trên một dòng', en: 'Async processing via a queue: batching writes to avoid single-row lock contention' },
    { vi: 'Rate limit bằng Redis INCR/EXPIRE, và khác biệt giữa fail open với fail closed', en: 'Rate limiting with Redis INCR/EXPIRE, and fail-open versus fail-closed' },
    { vi: 'SSRF: vì sao phải kiểm tra IP đã phân giải chứ không phải tên miền', en: 'SSRF: why you must check the resolved IP rather than the hostname' },
    { vi: 'Materialized aggregate: dựng sẵn kết quả tổng hợp thay vì tính lại mỗi lần đọc', en: 'Materialised aggregates: precompute rollups instead of recomputing on every read' },
    { vi: 'Chọn kiểu số nguyên cho bảng tăng nhanh, và cái giá của việc đổi kiểu về sau', en: 'Choosing integer types for fast-growing tables, and the cost of changing them later' },
    { vi: 'GDPR ở mức thực dụng: IP là dữ liệu cá nhân, mã quốc gia thì không', en: 'GDPR at a practical level: an IP is personal data, a country code is not' },
    { vi: 'Đo hiệu năng bằng con số (p50/p95) thay vì cảm giác nhanh chậm', en: 'Measuring performance with numbers (p50/p95) instead of impressions' },
  ],

  portfolioBonus: [
    { vi: 'Kết quả đo tải thật kèm trong README: p50, p95, số request mỗi giây', en: 'Real load-test numbers in the README: p50, p95, requests per second' },
    { vi: 'Biểu đồ so sánh trước và sau khi thêm Redis, đo bằng cùng một kịch bản', en: 'A before/after chart for adding Redis, measured with the same scenario' },
    { vi: 'Một mục "Đánh đổi thiết kế" giải thích vì sao chọn fail open', en: 'A "Design trade-offs" section explaining the fail-open decision' },
    { vi: 'Tài liệu OpenAPI cho API công khai, có trang thử trực tiếp', en: 'OpenAPI documentation for the public API, with a live try-it page' },
    { vi: 'Dashboard Grafana theo dõi tỉ lệ cache hit và độ trễ chuyển hướng', en: 'A Grafana dashboard tracking cache hit ratio and redirect latency' },
    { vi: 'Kịch bản k6 tái tạo được kết quả đo, commit thẳng trong repo', en: 'A k6 script in the repo that reproduces the benchmark' },
  ],

  completionOutcomes: [
    { vi: 'Thiết kế đường đọc nóng tách khỏi đường ghi, và giải thích được vì sao', en: 'Design a hot read path separate from the write path, and explain why' },
    { vi: 'Dùng Redis đúng vai trò: cache, hàng đợi, bộ đếm — không phải "database thứ hai"', en: 'Use Redis for what it is: cache, queue, counter — not "a second database"' },
    { vi: 'Nhận ra và chặn SSRF trước khi nó lên production', en: 'Recognise and block SSRF before it reaches production' },
    { vi: 'Biết khi nào phi chuẩn hoá là đúng, và ghi rõ cái giá phải trả', en: 'Know when denormalising is right, and document what it costs' },
    { vi: 'Đo hiệu năng bằng công cụ thật và cải thiện dựa trên số liệu', en: 'Measure performance with real tools and improve based on the numbers' },
  ],

  bodyMdx,
  bodyMdxEn,
};
