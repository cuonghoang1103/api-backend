/**
 * Case-study 5.4 — Real-Time Analytics Platform (Apache Pinot-like).
 *
 * Pays off the promise made in the Netflix study ("do not write each play
 * event into the primary database"). Two lessons carry it: columnar layout as
 * the root decision everything else follows from, and event time vs
 * processing time — which is a product decision, not a performance one.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./realtime-analytics-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./realtime-analytics-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'realtime-analytics-platform',
  title: 'Real-Time Analytics Platform (Apache Pinot-like)',
  titleEn: 'Real-Time Analytics Platform (Apache Pinot-like)',
  description:
    'Một triệu sự kiện mỗi phút, bảng điều khiển phải trả lời dưới 100ms. Không chỉ mục nào của PostgreSQL cứu được, vì bài toán không phải tìm một dòng mà là cộng gộp rất nhiều dòng. Đây là loại database khác hẳn — khác ngay từ cách nó đặt byte lên đĩa.',
  descriptionEn:
    'A million events a minute and a dashboard that must answer in under 100ms. No PostgreSQL index saves you, because the problem is not finding one row but aggregating a great many. This is a different kind of database — different from the very first decision about how bytes sit on disk.',
  techStack: [
    'Java 21', 'Columnar storage', 'HyperLogLog', 't-digest', 'Apache Kafka',
    'Star-tree index', 'S3 / Cloudflare R2', 'Next.js 15', 'Docker', 'Kubernetes',
  ],
  role: 'Backend / dữ liệu (một người)',
  roleEn: 'Backend / data (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/realtime-analytics-platform.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Quyết định GỐC: đặt byte theo CỘT chứ không theo HÀNG.
-- SUM(duration) trên lưu trữ theo hàng phải đọc CẢ 5 cột của MỌI hàng rồi
-- vứt đi 4 cột. Theo cột thì chỉ đọc đúng một cột = 1/5 lượng đọc đĩa.
--
-- Nhưng cái lợi lớn hơn nằm ở chỗ khác: các giá trị cạnh nhau trong MỘT
-- cột cùng kiểu và rất giống nhau, nên nén 10-30 lần là bình thường.
-- Tổng chênh lệch có thể tới HAI BẬC ĐỘ LỚN so với lưu theo hàng.

CREATE TABLE play_events_columnar (
    -- ⚠️ PHẢI là thời gian SỰ KIỆN (lúc nó xảy ra trên máy người dùng),
    -- KHÔNG phải thời gian nhận. Nhóm theo thời gian nhận thì điện thoại
    -- mất sóng 3 tiếng sẽ tạo ra một "sự cố" ở thời điểm mọi thứ bình thường.
    event_time    TIMESTAMPTZ NOT NULL,
    -- Chỉ để theo dõi độ trễ đường ống, KHÔNG BAO GIỜ dùng để nhóm số liệu.
    processing_time TIMESTAMPTZ NOT NULL,

    -- CHIỀU — ít giá trị khác nhau, hợp cho mã hoá từ điển + gói bit.
    -- 200 quốc gia cần 8 BIT, không phải 8 byte cho chuỗi. Và quan trọng
    -- hơn nén: lọc trở thành so sánh SỐ NGUYÊN trên mảng liên tục —
    -- đúng loại việc CPU xử lý nhiều giá trị cùng lúc bằng một lệnh.
    country       SMALLINT NOT NULL,   -- mã hoá từ điển
    device        SMALLINT NOT NULL,   -- mã hoá từ điển

    -- ĐỘ ĐO — phải CỘNG GỘP ĐƯỢC để tiền tổng hợp dùng được.
    duration_sec  INTEGER  NOT NULL,
    rebuffer_ms   INTEGER  NOT NULL,
    startup_ms    INTEGER  NOT NULL,

    -- KHÔNG đưa user_id vào chiều tiền tổng hợp: quá nhiều giá trị
    -- khác nhau sẽ làm cây hình sao phình vô lý. Để nó ở dạng quét thẳng.
    user_id       TEXT
);

-- Số lượng DUY NHẤT không cộng gộp được: distinct của hai nhóm gộp lại
-- KHÔNG phải tổng hai số distinct. Nên lưu PHÁC THẢO gộp được thay vì
-- con số — 12KB cho hàng triệu người, sai số ~0,8%.
CREATE TABLE hourly_rollup (
    hour          TIMESTAMPTZ NOT NULL,
    country       SMALLINT    NOT NULL,
    device        SMALLINT    NOT NULL,
    event_count   BIGINT      NOT NULL,
    duration_sum  BIGINT      NOT NULL,
    users_sketch  BYTEA       NOT NULL,   -- HyperLogLog, GỘP ĐƯỢC
    latency_digest BYTEA      NOT NULL,   -- t-digest cho phân vị, GỘP ĐƯỢC
    PRIMARY KEY (hour, country, device)
);

-- Cơ chế chống ĐẾM HAI LẦN gói gọn trong ba cột dưới đây.
-- Dòng thời gian thực cho số liệu SỚM nhưng có thể thiếu sự kiện tới muộn.
-- Lô lịch sử chạy lại sau vài giờ từ nguồn đầy đủ và THAY THẾ TRỌN phân
-- đoạn — thay thế là nguyên tử và luỹ đẳng, còn cộng gộp thì KHÔNG.
CREATE TABLE segments (
    id            TEXT        PRIMARY KEY,
    time_start    TIMESTAMPTZ NOT NULL,   -- phân vùng theo thời gian SỰ KIỆN
    time_end      TIMESTAMPTZ NOT NULL,
    status        VARCHAR(16) NOT NULL,   -- CONSUMING SEALED SERVED REPLACED
    source        VARCHAR(8)  NOT NULL,   -- STREAM | BATCH
    row_count     BIGINT      NOT NULL
);`,

  schemaCodeEn: `-- The ROOT decision: lay bytes out by COLUMN rather than by ROW.
-- SUM(duration) on row storage reads ALL 5 columns of EVERY row then throws
-- 4 away. Columnar reads exactly one column = one fifth of the disk reads.
--
-- But the bigger win lies elsewhere: adjacent values in ONE column share a
-- type and look alike, so 10-30x compression is ordinary. The total gap
-- against row storage reaches TWO ORDERS OF MAGNITUDE.

CREATE TABLE play_events_columnar (
    -- ⚠️ MUST be EVENT time (when it happened on the user's device), never
    -- arrival time. Grouping by arrival means a phone that lost signal for
    -- three hours manufactures an "incident" at a moment nothing was wrong.
    event_time    TIMESTAMPTZ NOT NULL,
    -- Only for monitoring pipeline lag, NEVER for grouping metrics.
    processing_time TIMESTAMPTZ NOT NULL,

    -- DIMENSIONS — low cardinality, suited to dictionary encoding + bit
    -- packing. 200 countries need 8 BITS, not 8 bytes of string. And more
    -- important than compression: filtering becomes INTEGER comparison over
    -- a contiguous array — exactly the work a CPU does many values at a
    -- time in a single instruction.
    country       SMALLINT NOT NULL,   -- dictionary encoded
    device        SMALLINT NOT NULL,   -- dictionary encoded

    -- METRICS — must be AGGREGATABLE for pre-aggregation to work.
    duration_sec  INTEGER  NOT NULL,
    rebuffer_ms   INTEGER  NOT NULL,
    startup_ms    INTEGER  NOT NULL,

    -- Do NOT make user_id a pre-aggregated dimension: its cardinality
    -- would inflate the star tree absurdly. Leave it to direct scanning.
    user_id       TEXT
);

-- DISTINCT counts do not combine: the distinct count of two merged groups
-- is NOT the sum of their distinct counts. So store a MERGEABLE SKETCH
-- rather than a number — 12KB for millions of users at ~0.8% error.
CREATE TABLE hourly_rollup (
    hour          TIMESTAMPTZ NOT NULL,
    country       SMALLINT    NOT NULL,
    device        SMALLINT    NOT NULL,
    event_count   BIGINT      NOT NULL,
    duration_sum  BIGINT      NOT NULL,
    users_sketch  BYTEA       NOT NULL,   -- HyperLogLog, MERGEABLE
    latency_digest BYTEA      NOT NULL,   -- t-digest for percentiles, MERGEABLE
    PRIMARY KEY (hour, country, device)
);

-- The entire DOUBLE-COUNTING defence lives in the three columns below.
-- The stream produces numbers EARLY but may miss late arrivals. The batch
-- job reruns hours later from the complete source and REPLACES the whole
-- segment — replacement is atomic and idempotent; addition is NEITHER.
CREATE TABLE segments (
    id            TEXT        PRIMARY KEY,
    time_start    TIMESTAMPTZ NOT NULL,   -- partitioned by EVENT time
    time_end      TIMESTAMPTZ NOT NULL,
    status        VARCHAR(16) NOT NULL,   -- CONSUMING SEALED SERVED REPLACED
    source        VARCHAR(8)  NOT NULL,   -- STREAM | BATCH
    row_count     BIGINT      NOT NULL
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Lưu theo cột: quyết định gốc mà mọi thứ khác là hệ quả',
      titleEn: 'Columnar storage: the root decision everything follows from',
      description:
        'SUM trên lưu trữ theo hàng đọc mọi cột rồi vứt đi phần lớn. Theo cột chỉ đọc cột cần dùng — nhưng lợi lớn hơn nằm ở nén: giá trị cạnh nhau trong một cột rất giống nhau nên nén 10–30 lần là bình thường. Và cột đã mã hoá từ điển biến phép lọc thành so sánh số nguyên trên mảng liên tục. Cái giá: cập nhật một dòng phải chạm từng cột, nên hệ thống này gần như luôn CHỈ GHI THÊM.',
      descriptionEn:
        'SUM on row storage reads every column and discards most. Columnar reads only what is needed — but the bigger win is compression: adjacent values in a column look alike, so 10–30x is ordinary. And a dictionary-encoded column turns filtering into integer comparison over a contiguous array. The cost: updating a row touches every column, so these systems are almost always APPEND-ONLY.',
    },
    {
      phase: 'BACKEND',
      title: 'Chọn mã hoá theo số giá trị khác nhau của từng cột',
      titleEn: 'Choose encodings from each column\'s cardinality',
      description:
        'Không có một cách nén đúng cho mọi cột. Ít giá trị khác nhau thì mã hoá từ điển rồi gói bit (200 quốc gia cần 8 bit chứ không phải 8 byte). Đã sắp xếp và lặp nhiều thì mã hoá độ dài chạy. Số tăng dần như mốc thời gian thì mã hoá chênh lệch. Đo số giá trị khác nhau của từng cột trước, rồi mới chọn.',
      descriptionEn:
        'There is no single right compression for every column. Low cardinality means dictionary encoding then bit packing (200 countries need 8 bits, not 8 bytes). Sorted and repetitive means run-length encoding. Monotonic values like timestamps mean delta encoding. Measure each column\'s cardinality first, then choose.',
    },
    {
      phase: 'BACKEND',
      title: 'Cây hình sao: tiền tổng hợp mà không bùng nổ tổ hợp',
      titleEn: 'The star tree: pre-aggregation without combinatorial explosion',
      description:
        'Dựng bảng tổng hợp cho mọi tổ hợp chiều là 2^n bảng — 10 chiều thành 1.024. Cây hình sao gộp vào một cây duy nhất, mỗi tầng một chiều, có nút ★ trả lời truy vấn không lọc theo chiều đó. Mấu chốt: CHỈ mở rộng nhánh khi số dòng vượt ngưỡng — tiền tính toán chỉ đáng giá ở nơi dữ liệu đủ lớn.',
      descriptionEn:
        'Building a summary table per dimension combination is 2^n tables — ten dimensions is 1,024. A star tree collapses this into one tree, a dimension per level, with ★ nodes answering queries that do not filter on that dimension. The key: expand a branch ONLY past a row threshold — precomputation only pays where data is large enough.',
    },
    {
      phase: 'BACKEND',
      title: 'Phác thảo gộp được cho số duy nhất và phân vị',
      titleEn: 'Mergeable sketches for distinct counts and percentiles',
      description:
        'COUNT(DISTINCT) không cộng gộp được nên tiền tổng hợp bó tay — lưu phác thảo HyperLogLog thay vì con số, vì hai phác thảo gộp được. Phân vị cũng cần sắp xếp toàn bộ dữ liệu; t-digest giữ tóm tắt vài KB, gộp được, chính xác nhất ở đuôi — đúng chỗ p95 và p99 quan tâm. Câu hỏi thật là "con số này dùng để làm gì": bảng vận hành lệch 0,8% không đổi quyết định, hoá đơn thì có.',
      descriptionEn:
        'COUNT(DISTINCT) does not combine, so pre-aggregation cannot help — store HyperLogLog sketches instead of numbers, because sketches merge. Percentiles need the whole dataset sorted; t-digest keeps a few-kilobyte summary, merges, and is most accurate at the tails where p95 and p99 live. The real question is "what is this number for": an ops dashboard off 0.8% changes nothing, an invoice does.',
      codeBlock:
        '-- Hai phác thảo GỘP LẠI ĐƯỢC nên tổng hợp mọi cấp đều tính từ chúng.\n'
        + 'SELECT country, hll_cardinality(hll_union_agg(users_sketch)) AS unique_users\n'
        + '  FROM hourly_rollup\n'
        + " WHERE hour >= now() - interval '24 hours'\n"
        + ' GROUP BY country;',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Thời gian sự kiện, dấu nước, và dữ liệu tới muộn',
      titleEn: 'Event time, watermarks and late-arriving data',
      description:
        'Phần khó nhất, và không liên quan gì tới hiệu năng. Điện thoại mất sóng trong đường hầm thì sự kiện lúc 10:00 tới lúc 13:00. Nhóm theo thời gian XỬ LÝ là tạo ra một sự cố giả ở 13:00 và đội trực đi tìm nguyên nhân không tồn tại. Vứt bỏ sự kiện muộn thì số liệu THIÊN LỆCH — loại đúng nhóm người mạng kém, tức nhóm gặp sự cố nhiều nhất. Đúng là nhóm theo thời gian SỰ KIỆN và chấp nhận quá khứ có thể sửa.',
      descriptionEn:
        'The hardest part, and nothing to do with performance. A phone losing signal in a tunnel makes a 10:00 event arrive at 13:00. Grouping by PROCESSING time manufactures a fake incident at 13:00 and sends on-call hunting for a nonexistent cause. Discarding late events BIASES the data — excluding exactly the poor-network users who hit the most problems. The right answer is grouping by EVENT time and accepting that the past can be revised.',
    },
    {
      phase: 'FRONTEND',
      title: 'Nói rõ với người đọc số nào còn có thể thay đổi',
      titleEn: 'Tell readers which numbers may still change',
      description:
        'Nhãn "số liệu 6 giờ gần nhất có thể còn thay đổi" quan trọng hơn mọi tối ưu kỹ thuật trong dự án này. Con số âm thầm đổi mà không báo là cách nhanh nhất để mất niềm tin vào bảng điều khiển. Cũng phải ghi rõ chỉ số nào là ƯỚC LƯỢNG — người đọc có quyền biết mình đang nhìn con số chính xác hay con số sai 0,8%.',
      descriptionEn:
        'A label saying "the last 6 hours may still change" matters more than every technical optimisation in this project. Numbers that quietly change are the fastest way to lose trust in a dashboard. Equally, mark which figures are ESTIMATES — readers deserve to know whether they are looking at an exact number or one that is 0.8% off.',
    },
    {
      phase: 'BACKEND',
      title: 'Hai đường nạp, và lô THAY THẾ dòng chứ không cộng thêm',
      titleEn: 'Two ingestion paths, with batch REPLACING the stream',
      description:
        'Dòng thời gian thực cho số liệu sớm nhưng có thể thiếu sự kiện tới muộn; lô lịch sử chạy lại sau vài giờ từ nguồn đầy đủ. Câu hỏi kinh điển là làm sao có cả tốc độ lẫn độ chính xác mà không đếm hai lần — và câu trả lời là ĐỪNG hoà hai kết quả. Cho lô thay thế TRỌN VẸN phân đoạn của dòng trên cùng khoảng thời gian: thay thế là nguyên tử và luỹ đẳng, cộng gộp thì không.',
      descriptionEn:
        'The stream gives numbers early but may miss late arrivals; the batch job reruns hours later from the complete source. The classic question is how to get both speed and accuracy without double counting — and the answer is DO NOT blend the results. Let the batch replace the stream\'s segment ENTIRELY for that time range: replacement is atomic and idempotent, addition is neither.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng sự kiện tới muộn và bằng lô đè lên dòng',
      titleEn: 'Verify with late events and with batch overwriting stream',
      description:
        'Nạp một sự kiện có thời gian sự kiện 3 giờ trước: nó phải vào cửa sổ 3 giờ trước, số liệu cửa sổ đó phải được cập nhật lại, và giao diện phải có nhãn cho biết. Chạy lô đè lên khoảng đã có dữ liệu dòng: tổng KHÔNG được tăng gấp đôi. So COUNT(DISTINCT) ước lượng với con số chính xác trên 10 triệu dòng: lệch dưới 1%.',
      descriptionEn:
        'Ingest an event dated three hours ago: it must land in that window, that window\'s metrics must be revised, and the interface must say so. Run a batch over a range already covered by the stream: totals must NOT double. Compare approximate COUNT(DISTINCT) against the exact figure over 10 million rows: under 1% error.',
    },
  ],

  features: [
    { title: 'Lưu trữ theo cột nhiều tầng nén', titleEn: 'Columnar storage with layered compression', description: 'Từ điển, gói bit, độ dài chạy, chênh lệch — chọn theo từng cột.', descriptionEn: 'Dictionary, bit packing, run-length and delta — chosen per column.', status: 'PLANNED' },
    { title: 'Chỉ mục cây hình sao', titleEn: 'Star-tree index', description: 'Tiền tổng hợp có nút ★, chỉ mở rộng nhánh vượt ngưỡng dòng.', descriptionEn: 'Pre-aggregation with ★ nodes, expanding only branches past a row threshold.', status: 'PLANNED' },
    { title: 'Nạp dòng thời gian thực', titleEn: 'Real-time stream ingestion', description: 'Phân đoạn đang nhận vẫn truy vấn được — đó là điều làm nên "thời gian thực".', descriptionEn: 'Consuming segments are queryable — that is what makes it "real time".', status: 'PLANNED' },
    { title: 'Nạp lô lịch sử thay thế phân đoạn', titleEn: 'Batch ingestion replacing segments', description: 'Thay thế trọn vẹn, không cộng thêm — cách duy nhất chống đếm hai lần.', descriptionEn: 'Whole-segment replacement, never addition — the only defence against double counting.', status: 'PLANNED' },
    { title: 'Đếm số duy nhất và phân vị xấp xỉ', titleEn: 'Approximate distinct counts and percentiles', description: 'HyperLogLog và t-digest, cả hai đều gộp được nên tổng hợp mọi cấp.', descriptionEn: 'HyperLogLog and t-digest, both mergeable so aggregation works at every level.', status: 'PLANNED' },
    { title: 'Xử lý dữ liệu tới muộn theo dấu nước', titleEn: 'Watermark-based late data handling', description: 'Dấu nước đặt theo phân vị đo thật, cửa sổ khoan dung có giới hạn.', descriptionEn: 'Watermarks set from measured percentiles, with a bounded grace window.', status: 'PLANNED' },
    { title: 'Bảng điều khiển tự cập nhật', titleEn: 'Self-updating dashboard', description: 'Có nhãn cho số liệu còn thay đổi và cho chỉ số là ước lượng.', descriptionEn: 'Labels for figures still subject to revision and for estimated metrics.', status: 'PLANNED' },
    { title: 'Lưu giữ phân tầng', titleEn: 'Tiered retention', description: 'Dữ liệu cũ hạ độ chi tiết trước khi xoá, thay vì xoá thẳng.', descriptionEn: 'Old data downsampled before deletion rather than dropped outright.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Apache Pinot — Star-Tree Index', titleEn: 'Apache Pinot — Star-Tree Index', url: 'https://docs.pinot.apache.org/basics/indexing/star-tree-index', type: 'LINK', description: 'Cấu trúc tiền tổng hợp giải bài bùng nổ tổ hợp — phần trung tâm của dự án này.', descriptionEn: 'The pre-aggregation structure that solves combinatorial explosion — the heart of this project.' },
    { title: 'C-Store: A Column-oriented DBMS (Stonebraker et al.)', titleEn: 'C-Store: A Column-oriented DBMS (Stonebraker et al.)', url: 'https://web.stanford.edu/class/cs245/readings/c-store.pdf', type: 'PDF', description: 'Bài báo đặt nền cho lưu trữ theo cột — đọc để hiểu vì sao chứ không chỉ biết là gì.', descriptionEn: 'The paper that founded columnar storage — read it for the why, not just the what.' },
    { title: 'HyperLogLog in Practice (Google)', titleEn: 'HyperLogLog in Practice (Google)', url: 'https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/40671.pdf', type: 'PDF', description: 'Đếm số duy nhất bằng bộ nhớ hằng số, kèm các cải tiến dùng trong hệ thống thật.', descriptionEn: 'Constant-memory distinct counting, with the refinements real systems use.' },
    { title: 'Computing Extremely Accurate Quantiles Using t-Digests', titleEn: 'Computing Extremely Accurate Quantiles Using t-Digests', url: 'https://arxiv.org/abs/1902.04023', type: 'LINK', description: 'Ted Dunning giải thích vì sao t-digest chính xác nhất ở đuôi — đúng chỗ p99 quan tâm.', descriptionEn: 'Ted Dunning on why t-digest is most accurate at the tails — exactly where p99 lives.' },
    { title: 'The Dataflow Model (Google)', titleEn: 'The Dataflow Model (Google)', url: 'https://research.google/pubs/pub43864/', type: 'LINK', description: 'Nền lý thuyết của thời gian sự kiện, dấu nước và dữ liệu tới muộn — phần khó nhất của bài.', descriptionEn: 'The theory behind event time, watermarks and late data — the hardest part of this study.' },
  ],

  coreKnowledge: [
    { vi: 'Lưu trữ theo cột: vì sao bố cục byte quyết định loại truy vấn nào khả thi', en: 'Columnar storage: why byte layout decides which queries are even possible' },
    { vi: 'Kỹ thuật nén và cách chọn theo số giá trị khác nhau của từng cột', en: 'Compression techniques and choosing them from per-column cardinality' },
    { vi: 'Tiền tổng hợp: đổi dung lượng lấy độ trễ, và biết khi nào không đáng', en: 'Pre-aggregation: trading space for latency, and knowing when it does not pay' },
    { vi: 'Cấu trúc dữ liệu xác suất gộp được: HyperLogLog và t-digest', en: 'Mergeable probabilistic structures: HyperLogLog and t-digest' },
    { vi: 'Thời gian sự kiện và thời gian xử lý — phân biệt này là bản chất, không phải chi tiết', en: 'Event time versus processing time — a fundamental distinction, not a detail' },
    { vi: 'Dấu nước, dữ liệu tới muộn, và việc chấp nhận quá khứ có thể sửa', en: 'Watermarks, late data, and accepting that the past can be revised' },
    { vi: 'Hoà xử lý dòng và xử lý lô mà không đếm hai lần', en: 'Reconciling stream and batch processing without double counting' },
    { vi: 'OLTP và OLAP: hai loại tải công việc, hai loại hệ thống, đứng cạnh nhau', en: 'OLTP and OLAP: two workloads, two systems, standing side by side' },
  ],

  portfolioBonus: [
    { vi: 'So thời gian cùng một truy vấn trên PostgreSQL và trên hệ thống này', en: 'The same query timed on PostgreSQL and on this system' },
    { vi: 'Bảng tỉ lệ nén theo từng cột, kèm giải thích chọn mã hoá nào và vì sao', en: 'Per-column compression ratios with the encoding choice explained' },
    { vi: 'Thí nghiệm dữ liệu tới muộn: cùng một sự kiện, ba cách xử lý, ba kết quả báo cáo', en: 'A late-data experiment: one event, three handling strategies, three different reports' },
    { vi: 'Chứng minh lô đè lên dòng không làm tổng tăng gấp đôi', en: 'A demonstration that batch overwriting stream does not double the totals' },
    { vi: 'Đối chiếu sai số ước lượng với con số chính xác trên nhiều kích thước dữ liệu', en: 'Estimation error measured against exact figures across several data sizes' },
  ],

  completionOutcomes: [
    { vi: 'Biết chọn đúng loại database cho đúng loại tải công việc', en: 'Choose the right kind of database for the right kind of workload' },
    { vi: 'Hiểu bố cục dữ liệu vật lý quyết định giới hạn hiệu năng thế nào', en: 'Understand how physical data layout sets the performance ceiling' },
    { vi: 'Dùng ước lượng một cách có chủ ý và nói rõ với người đọc', en: 'Use approximation deliberately and disclose it to readers' },
    { vi: 'Xử lý thời gian trong hệ phân tán mà không tạo ra số liệu sai lệch', en: 'Handle time in distributed systems without manufacturing misleading metrics' },
    { vi: 'Thiết kế hệ thống đo lường mà người đọc tin được, kể cả khi số liệu sửa lại', en: 'Design measurement systems people can trust, even when numbers get revised' },
  ],

  bodyMdx,
  bodyMdxEn,
};
