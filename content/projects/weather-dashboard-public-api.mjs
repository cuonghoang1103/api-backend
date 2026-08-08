/**
 * Case-study 1.4 — Weather Dashboard on a public API.
 *
 * The first project where the critical data lives in a service you do not
 * control. Covers the four defensive layers (cache → breaker → snapshot →
 * history), cache stampede protection, and why NEXT_PUBLIC_ on a third-party
 * key is a leak rather than a convenience.
 *
 * Also the roadmap's first Python project — FastAPI is the stack every later
 * data/AI project builds on.
 *
 * Slug preserved from the existing production row.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./weather-dashboard-public-api.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./weather-dashboard-public-api.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'weather-dashboard-public-api',
  title: 'Weather Dashboard (Public API)',
  titleEn: 'Weather Dashboard (Public API)',
  description:
    'Dự án Python đầu tiên của lộ trình, và cũng là lần đầu dữ liệu quan trọng nhất nằm ở dịch vụ bạn không kiểm soát. Bốn lớp phòng thủ: cache Redis, circuit breaker, ảnh chụp dự phòng, lịch sử — để trang vẫn sống khi nhà cung cấp sập và không bao giờ cháy hạn mức 1.000 lượt/ngày.',
  descriptionEn:
    'The roadmap\'s first Python project, and the first time the critical data lives in a service you do not control. Four defensive layers — Redis cache, circuit breaker, fallback snapshot, history — so the page survives a provider outage and never burns the 1,000-call daily quota.',
  techStack: [
    'Python 3.12', 'FastAPI', 'httpx', 'Redis', 'PostgreSQL', 'SQLAlchemy',
    'Pydantic', 'Next.js 15', 'Recharts', 'Docker',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '4–6 ngày',
  durationEn: '4–6 days',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'BEGINNER',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Ảnh chụp giữ NGUYÊN VĂN phản hồi API (jsonb) VÀ trích vài
-- trường ra cột riêng. Nguyên văn: không mất dữ liệu khi nhà cung
-- cấp thêm trường mới, và phân tích lại được sau này. Cột trích:
-- biểu đồ truy vấn nhanh, không phải mở JSON từng dòng.

CREATE TABLE cities (
    id        SERIAL PRIMARY KEY,
    name      TEXT        NOT NULL,
    country   CHAR(2)     NOT NULL,      -- ISO-3166 alpha-2
    lat       REAL        NOT NULL,
    lon       REAL        NOT NULL,
    timezone  TEXT,
    UNIQUE (name, country)
);

CREATE TABLE weather_snapshots (
    id         BIGSERIAL PRIMARY KEY,
    city_id    INTEGER     NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    payload    JSONB       NOT NULL,     -- nguyên văn từ nhà cung cấp
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    temp_c     REAL,                     -- trích ra để vẽ biểu đồ
    humidity   REAL,
    wind_ms    REAL
);

-- Truy vấn nóng nhất: "ảnh chụp MỚI NHẤT của thành phố X" — dùng
-- khi nhà cung cấp sập và ta phải trả dữ liệu cũ. DESC trong chỉ
-- mục để Postgres đọc thẳng dòng đầu thay vì sắp xếp.
CREATE INDEX weather_snapshots_city_time_idx
    ON weather_snapshots (city_id, fetched_at DESC);

CREATE TABLE favorites (
    user_id    INTEGER NOT NULL,
    city_id    INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, city_id)
);`,
  schemaCodeEn: `-- Snapshots keep the RAW API response (jsonb) AND extract a few fields
-- into columns. Raw: nothing is lost when the provider adds a field, and
-- the data can be re-analysed later. Extracted: chart queries stay fast
-- without opening JSON row by row.

CREATE TABLE cities (
    id        SERIAL PRIMARY KEY,
    name      TEXT        NOT NULL,
    country   CHAR(2)     NOT NULL,      -- ISO-3166 alpha-2
    lat       REAL        NOT NULL,
    lon       REAL        NOT NULL,
    timezone  TEXT,
    UNIQUE (name, country)
);

CREATE TABLE weather_snapshots (
    id         BIGSERIAL PRIMARY KEY,
    city_id    INTEGER     NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    payload    JSONB       NOT NULL,     -- verbatim from the provider
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    temp_c     REAL,                     -- extracted for charting
    humidity   REAL,
    wind_ms    REAL
);

-- The hottest query: "the LATEST snapshot for city X" — used when the
-- provider is down and we must serve stale data. DESC in the index lets
-- Postgres read the first row directly instead of sorting.
CREATE INDEX weather_snapshots_city_time_idx
    ON weather_snapshots (city_id, fetched_at DESC);

CREATE TABLE favorites (
    user_id    INTEGER NOT NULL,
    city_id    INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, city_id)
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'SETUP',
      title: 'FastAPI, và vì sao lộ trình đổi sang Python ở đây',
      titleEn: 'FastAPI, and why the roadmap switches to Python here',
      description:
        'Không phải để đổi cho vui: FastAPI là stack chuẩn cho mọi thứ liên quan tới dữ liệu và AI ở các cấp sau của lộ trình. Pydantic validate ngay tại biên, và tài liệu OpenAPI sinh tự động từ chính khai báo kiểu.',
      descriptionEn:
        'Not change for its own sake: FastAPI is the standard stack for everything data- and AI-related at the higher levels of this roadmap. Pydantic validates at the boundary, and OpenAPI docs generate themselves from the type annotations.',
      codeBlock:
        'python -m venv .venv && source .venv/bin/activate\n'
        + 'pip install "fastapi[standard]" httpx redis sqlalchemy asyncpg\n\n'
        + '# Redis + Postgres bằng Docker, giống môi trường production\n'
        + 'docker run -d -p 6379:6379 redis:7-alpine\n'
        + 'docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16',
      codeLang: 'bash',
    },
    {
      phase: 'BACKEND',
      title: 'Bốn lớp phòng thủ trước một API không thuộc về mình',
      titleEn: 'Four defensive layers in front of an API you do not own',
      description:
        'Redis TTL 10 phút trả lời "vừa có ai hỏi chưa". Circuit breaker trả lời "nhà cung cấp còn khoẻ không". Ảnh chụp Postgres trả lời "nếu không lấy được mới thì có cũ không". Lịch sử cho biểu đồ xu hướng mà gói miễn phí không có.',
      descriptionEn:
        'A 10-minute Redis TTL answers "has anyone asked recently". The circuit breaker answers "is the provider healthy". The Postgres snapshot answers "if we cannot get fresh, do we have old". History powers trend charts the free tier does not offer.',
    },
    {
      phase: 'BACKEND',
      title: 'Circuit breaker: vì sao thử lại là bản năng sai',
      titleEn: 'Circuit breaker: why retrying is the wrong instinct',
      description:
        'Khi nhà cung cấp quá tải, mọi client cùng thử lại chính là thứ giữ cho nó tiếp tục sập (retry storm). Ở trạng thái NGẮT, request lỗi NGAY trong 50ms rồi rơi xuống dữ liệu cũ, thay vì quay vòng 30 giây rồi mới báo lỗi. Ở HALF_OPEN chỉ cần một lần thất bại là mở mạch lại — mỗi lần thử là một người dùng phải chờ.',
      descriptionEn:
        'When a provider is overloaded, every client retrying is exactly what keeps it down (a retry storm). In the OPEN state a request fails in 50ms and falls back to stale data, instead of spinning for 30 seconds before erroring. In HALF_OPEN a single failure reopens the circuit — every probe costs a real user a wait.',
      codeBlock:
        'if self._state is State.OPEN:\n'
        + '    if time.monotonic() - self._opened_at >= self.recovery_seconds:\n'
        + '        self._state = State.HALF_OPEN\n'
        + '    else:\n'
        + '        # Ném lỗi NGAY — không tiêu 30 giây timeout cho một\n'
        + '        # lời gọi ta đã biết gần như chắc chắn sẽ thất bại.\n'
        + '        raise CircuitOpenError("nhà cung cấp đang lỗi")',
      codeLang: 'python',
    },
    {
      phase: 'BACKEND',
      title: 'Cache stampede: 50 request cùng trượt cache là 50 lượt gọi',
      titleEn: 'Cache stampede: 50 simultaneous misses are 50 API calls',
      description:
        'Khoá cache hết hạn lúc 14:00:00; trong 200ms sau đó 50 request cùng thấy trượt và cùng gọi API. Chữa bằng khoá SET NX quanh lời gọi: chỉ một request được đi, số còn lại chờ 250ms rồi đọc lại cache, không có thì rơi xuống dữ liệu cũ chứ KHÔNG gọi API.',
      descriptionEn:
        'The cache key expires at 14:00:00; over the next 200ms fifty requests all miss and all call the API. Fixed with a SET NX lock around the call: one request proceeds, the rest wait 250ms and reread the cache, then fall back to stale data rather than calling the API.',
      codeBlock:
        '# SET NX = "chỉ đặt nếu chưa tồn tại", và nó NGUYÊN TỬ.\n'
        + 'got_lock = await redis.set(lock_key, "1", nx=True, ex=LOCK_TTL)\n\n'
        + 'if not got_lock:\n'
        + '    await asyncio.sleep(0.25)\n'
        + '    cached = await redis.get(key)\n'
        + '    if cached:\n'
        + '        return json.loads(cached)\n'
        + '    # Vẫn chưa có → dữ liệu cũ, KHÔNG gọi API.\n'
        + '    return await get_stale_snapshot(city, db)',
      codeLang: 'python',
    },
    {
      phase: 'SECURITY',
      title: 'NEXT_PUBLIC_ trên khoá bên thứ ba là một vụ rò rỉ',
      titleEn: 'NEXT_PUBLIC_ on a third-party key is a leak',
      description:
        'Tiền tố đó nhúng biến vào gói JavaScript gửi cho trình duyệt lúc build. Mở DevTools là đọc được, và trong vài giờ khoá sẽ xuất hiện trong một script quét GitHub. Quy tắc không ngoại lệ: khoá bên thứ ba chỉ tồn tại ở server — đó chính là lý do dự án này có FastAPI ở giữa.',
      descriptionEn:
        'That prefix bakes the variable into the JavaScript bundle at build time. Open DevTools and it is readable, and within hours it lands in someone\'s GitHub-scanning script. The rule has no exceptions: third-party keys live only on the server — which is exactly why this project has FastAPI in the middle.',
    },
    {
      phase: 'DATABASE',
      title: 'Lưu nguyên văn jsonb, đồng thời trích cột để vẽ biểu đồ',
      titleEn: 'Store raw jsonb, and extract columns for charting',
      description:
        'Nguyên văn để không mất gì khi nhà cung cấp thêm trường, và để phân tích lại sau này. Cột trích để truy vấn biểu đồ nhanh. Chỉ mục (city_id, fetched_at DESC) khớp đúng truy vấn "ảnh chụp mới nhất" dùng khi API sập.',
      descriptionEn:
        'Raw so nothing is lost when the provider adds fields, and so the data can be re-analysed. Extracted columns so chart queries stay fast. The (city_id, fetched_at DESC) index matches the "latest snapshot" query used during an outage.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách chặn nhà cung cấp và bắn 100 request cùng lúc',
      titleEn: 'Verify by blocking the provider and firing 100 concurrent requests',
      description:
        'Hai phép thử quyết định: chặn domain nhà cung cấp — trang phải hiện dữ liệu cũ kèm cảnh báo, không phải trang lỗi. Bắn 100 request đồng thời cho thành phố chưa cache — phải đếm được đúng MỘT lượt gọi ra ngoài.',
      descriptionEn:
        'Two decisive checks: block the provider domain — the page must show stale data with a warning, not an error. Fire 100 concurrent requests for an uncached city — exactly ONE outbound call should be counted.',
    },
  ],

  features: [
    { title: 'Thời tiết hiện tại + dự báo 7 ngày', titleEn: 'Current weather + 7-day forecast', description: 'Chuẩn hoá đơn vị ngay tại tầng nhận, không để Kelvin lọt vào giao diện.', descriptionEn: 'Units normalised at the ingest layer so Kelvin never reaches the UI.', status: 'PLANNED' },
    { title: 'Cache Redis TTL 10 phút', titleEn: '10-minute Redis cache', description: 'Giữ hạn mức 1.000 lượt/ngày dùng đủ cho hàng nghìn người truy cập.', descriptionEn: 'Keeps a 1,000-call daily quota sufficient for thousands of visitors.', status: 'PLANNED' },
    { title: 'Chống cache stampede', titleEn: 'Cache stampede protection', description: 'Khoá SET NX: 100 request trượt cache đồng thời chỉ tạo 1 lượt gọi.', descriptionEn: 'A SET NX lock: 100 simultaneous misses produce exactly one call.', status: 'PLANNED' },
    { title: 'Circuit breaker ba trạng thái', titleEn: 'Three-state circuit breaker', description: 'CLOSED / OPEN / HALF_OPEN, hồi phục sau 60 giây bằng một lần thử.', descriptionEn: 'CLOSED / OPEN / HALF_OPEN, recovering after 60 seconds via a single probe.', status: 'PLANNED' },
    { title: 'Dự phòng dữ liệu cũ có gắn nhãn', titleEn: 'Labelled stale-data fallback', description: 'Luôn hiện thời điểm cập nhật — người dùng chấp nhận dữ liệu cũ nếu biết nó cũ.', descriptionEn: 'Always shows the fetch time — users accept old data when they know it is old.', status: 'PLANNED' },
    { title: 'Biểu đồ xu hướng từ lịch sử tự lưu', titleEn: 'Trend charts from self-collected history', description: 'Dữ liệu mà gói API miễn phí không cung cấp, tích luỹ từ chính các ảnh chụp.', descriptionEn: 'Data the free API tier does not provide, accumulated from your own snapshots.', status: 'PLANNED' },
    { title: 'Tìm thành phố, lưu yêu thích, đổi °C/°F', titleEn: 'City search, favourites, °C/°F toggle', description: 'Đổi đơn vị hoàn toàn phía client, không gọi lại API.', descriptionEn: 'Unit switching happens entirely client-side, with no extra API call.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'FastAPI — tài liệu chính thức', titleEn: 'FastAPI — official documentation', url: 'https://fastapi.tiangolo.com/', type: 'LINK', description: 'Đọc mục Dependencies và Background Tasks, hai thứ dùng nhiều nhất ở đây.', descriptionEn: 'Focus on Dependencies and Background Tasks — the two used most here.' },
    { title: 'Martin Fowler — Circuit Breaker', titleEn: 'Martin Fowler — Circuit Breaker', url: 'https://martinfowler.com/bliki/CircuitBreaker.html', type: 'LINK', description: 'Bài gốc mô tả mẫu hình này, ngắn và đáng đọc nguyên văn.', descriptionEn: 'The original write-up of the pattern — short, and worth reading in full.' },
    { title: 'OpenWeatherMap — API docs', titleEn: 'OpenWeatherMap — API docs', url: 'https://openweathermap.org/api', type: 'LINK', description: 'Chú ý mục giới hạn gọi và đơn vị mặc định (Kelvin).', descriptionEn: 'Note the rate-limit section and the default unit (Kelvin).' },
    { title: 'Redis — mẫu hình khoá phân tán', titleEn: 'Redis — distributed locking patterns', url: 'https://redis.io/docs/latest/develop/use-cases/', type: 'LINK', description: 'SET NX là dạng khoá đơn giản nhất; đọc để biết giới hạn của nó.', descriptionEn: 'SET NX is the simplest form of lock; read this to learn its limits.' },
  ],

  coreKnowledge: [
    { vi: 'FastAPI + Pydantic: validate tại biên và sinh tài liệu OpenAPI tự động', en: 'FastAPI + Pydantic: boundary validation and auto-generated OpenAPI docs' },
    { vi: 'Circuit breaker ba trạng thái, và vì sao thử lại làm sự cố tệ hơn', en: 'The three-state circuit breaker, and why retrying makes an outage worse' },
    { vi: 'Cache stampede và cách chặn bằng khoá nguyên tử', en: 'Cache stampedes and stopping them with an atomic lock' },
    { vi: 'Suy giảm mềm: trả dữ liệu cũ có gắn nhãn thay vì trang lỗi', en: 'Graceful degradation: labelled stale data instead of an error page' },
    { vi: 'Biến môi trường công khai và bí mật — ranh giới ở đâu trong Next.js', en: 'Public versus secret environment variables — where the line is in Next.js' },
    { vi: 'jsonb trong Postgres: khi nào lưu nguyên văn, khi nào trích ra cột', en: 'Postgres jsonb: when to store raw and when to extract columns' },
    { vi: 'async/await trong Python và khác biệt với mô hình đồng bộ', en: 'async/await in Python and how it differs from the synchronous model' },
    { vi: 'Thiết kế quanh hạn mức của bên thứ ba như một ràng buộc kiến trúc', en: 'Designing around a third-party quota as an architectural constraint' },
  ],

  portfolioBonus: [
    { vi: 'Video quay lại cảnh chặn nhà cung cấp mà trang vẫn hoạt động', en: 'A recording of the provider being blocked while the page keeps working' },
    { vi: 'Bảng đo số lượt gọi API trước và sau khi thêm cache + khoá', en: 'A table of API call counts before and after adding cache + lock' },
    { vi: 'Sơ đồ trạng thái circuit breaker đính kèm README', en: 'The circuit-breaker state diagram in the README' },
    { vi: 'Bộ test tự động mô phỏng nhà cung cấp lỗi bằng httpx mock transport', en: 'Automated tests simulating provider failure with an httpx mock transport' },
    { vi: 'Tài liệu OpenAPI công khai kèm trang thử trực tiếp', en: 'Public OpenAPI documentation with a live try-it page' },
  ],

  completionOutcomes: [
    { vi: 'Tích hợp API bên thứ ba mà không để nó kéo sập hệ thống của mình', en: 'Integrate a third-party API without letting it take your system down' },
    { vi: 'Thiết kế nhiều lớp dự phòng, mỗi lớp trả lời một câu hỏi khác nhau', en: 'Design layered fallbacks where each layer answers a different question' },
    { vi: 'Viết backend Python bất đồng bộ đúng cách, không chặn vòng lặp sự kiện', en: 'Write async Python backends correctly, without blocking the event loop' },
    { vi: 'Bảo vệ khoá bí mật xuyên suốt từ biến môi trường tới gói build', en: 'Protect secrets end to end, from environment variable to build bundle' },
    { vi: 'Nói thật với người dùng khi dữ liệu không mới, thay vì giấu đi', en: 'Tell users when data is not fresh, instead of hiding it' },
  ],

  bodyMdx,
  bodyMdxEn,
};
