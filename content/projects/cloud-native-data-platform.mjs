/**
 * Case-study 5.3 — Cloud-native Data Platform (Snowflake-like).
 *
 * One idea carries everything: data in object storage, compute as stateless
 * clusters. Consequences include zero-copy cloning, time travel, atomicity
 * from a single conditional pointer swap — and the uncomfortable one, that
 * a bad query's cost becomes visible with somebody's name beside it.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./cloud-native-data-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./cloud-native-data-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'cloud-native-data-platform',
  title: 'Cloud-native Data Platform (Snowflake-like)',
  titleEn: 'Cloud-native Data Platform (Snowflake-like)',
  description:
    'Kho dữ liệu tách lưu trữ khỏi tính toán: dữ liệu nằm ở kho đối tượng, tính toán là các cụm không giữ trạng thái bật khi cần. Một quyết định kéo theo năm hệ quả — kể cả một hệ quả gây khó chịu: chi phí của một truy vấn tồi bỗng nhìn thấy được, và có tên người viết bên cạnh.',
  descriptionEn:
    'A warehouse separating storage from compute: data in object storage, compute as stateless clusters started on demand. One decision with five consequences — including an uncomfortable one: a bad query\'s cost becomes visible, with somebody\'s name next to it.',
  techStack: [
    'Rust', 'Apache Parquet', 'Apache Iceberg', 'Apache Arrow', 'S3 / Cloudflare R2',
    'DataFusion', 'PostgreSQL', 'Kubernetes', 'Next.js 15', 'Docker',
  ],
  role: 'Backend / dữ liệu (một người)',
  roleEn: 'Backend / data (solo)',
  duration: '12–14 tuần',
  durationEn: '12–14 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- KHO ĐỐI TƯỢNG KHÔNG CÓ GIAO DỊCH: không khoá, không BEGIN.
-- Vậy làm sao một lệnh ghi 10.000 tệp hoặc thành công TRỌN VẸN hoặc
-- KHÔNG CÓ GÌ xảy ra? Toàn bộ tính nguyên tử nằm ở MỘT thao tác đổi
-- con trỏ có điều kiện. Mọi thứ khác chỉ là ghi tệp bình thường.

CREATE TABLE table_meta (
    name TEXT PRIMARY KEY,
    -- ⚠️ ĐỔI CỘT NÀY là thao tác nguyên tử DUY NHẤT trong cả quy trình ghi.
    -- Ghi 10.000 tệp mới (người đọc chưa thấy vì chúng chưa thuộc ảnh chụp
    -- nào) → ghi kê khai → ĐỔI con trỏ. Ghi hỏng giữa chừng thì con trỏ
    -- vẫn ở phiên bản cũ, tệp thừa thành rác dọn sau, và KHÔNG người đọc
    -- nào thấy trạng thái dở dang.
    -- Đổi phải CÓ ĐIỀU KIỆN theo phiên bản, nếu không hai người ghi đồng
    -- thời sẽ có một người mất dữ liệu.
    current_snapshot_id TEXT NOT NULL,
    partition_keys      TEXT[] NOT NULL,
    -- Ảnh chụp cũ còn thì XEM LẠI THỜI ĐIỂM TRƯỚC gần như miễn phí:
    -- khôi phục sau khi ai đó chạy nhầm DELETE là ĐỔI CON TRỎ VỀ,
    -- không phải phục hồi từ bản sao lưu.
    retention_snapshots INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE data_files (
    path         TEXT   PRIMARY KEY,
    manifest_id  TEXT   NOT NULL,
    record_count BIGINT NOT NULL,
    -- ⚠️ TỆP NHỎ LÀ KẺ GIẾT HIỆU NĂNG, và bài toán này TỰ SINH RA: nạp theo
    -- dòng mỗi phút một tệp thì sau một tháng có 43.200 tệp nhỏ cho một bảng.
    -- Một triệu tệp 1MB thay vì mười nghìn tệp 100MB = một triệu yêu cầu
    -- mạng và một triệu lần đọc chân tệp, chậm gấp hàng chục lần dù tổng
    -- dung lượng y hệt. BẮT BUỘC có tiến trình gộp nền.
    size_bytes   BIGINT NOT NULL,
    -- Thống kê min/max từng cột ⇒ bỏ qua cả tệp mà KHÔNG MỞ NÓ, chỉ đọc
    -- phần chân tệp. Đây là lớp cắt thứ hai trong ba lớp:
    --   1. cắt phân vùng   — bỏ 99,9% tệp qua đường dẫn, không mở tệp nào
    --   2. cắt nhóm dòng   — bỏ tiếp qua min/max, chỉ đọc chân tệp
    --   3. cắt cột         — đọc byte của 3 cột trong 200
    -- Bảng 50TB ⇒ đọc thật ~200MB. Chênh 250.000 lần, đến từ SIÊU DỮ LIỆU
    -- chứ không từ tốc độ máy.
    column_stats JSONB  NOT NULL,
    partition_values JSONB NOT NULL
);

CREATE TABLE clones (
    id           TEXT    PRIMARY KEY,
    source_table TEXT    NOT NULL REFERENCES table_meta(name),
    -- Trỏ tới CÙNG tệp — không sao chép byte nào. Nhân bản bảng 50TB tốn
    -- vài MILI GIÂY. Khả thi hoàn toàn nhờ tính BẤT BIẾN của tệp — lại là
    -- nguyên tắc chỉ-ghi-thêm, lần thứ bảy trong lộ trình.
    snapshot_id  TEXT    NOT NULL,
    copy_on_write BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE query_runs (
    id            TEXT   PRIMARY KEY,
    warehouse_id  TEXT   NOT NULL REFERENCES warehouses(id),
    -- ⚠️ CỘT CÓ ẢNH HƯỞNG TỚI HÀNH VI CON NGƯỜI MẠNH NHẤT TRONG LƯỢC ĐỒ.
    -- Ở hệ thống dính liền, chi phí là hoá đơn hạ tầng hằng tháng không quy
    -- được cho ai. Ở đây mỗi truy vấn có một con số tiền và một cái TÊN —
    -- và SELECT * trên bảng 50TB thôi xảy ra, không phải vì có ai cấm
    -- mà vì nó NHÌN THẤY ĐƯỢC.
    user_id       TEXT   NOT NULL,
    bytes_scanned BIGINT NOT NULL,
    compute_ms    INTEGER NOT NULL,
    cost_cents    INTEGER NOT NULL
);

CREATE TABLE warehouses (
    id         TEXT    PRIMARY KEY,
    size_units INTEGER NOT NULL,
    -- Chống sự cố hoá đơn kinh điển: cụm 64 nhân bật lên cho MỘT truy vấn
    -- rồi không ai tắt, chạy không suốt cuối tuần.
    auto_suspend BOOLEAN NOT NULL DEFAULT true,
    auto_suspend_seconds INTEGER NOT NULL DEFAULT 300
);`,

  schemaCodeEn: `-- OBJECT STORAGE HAS NO TRANSACTIONS: no locks, no BEGIN.
-- So how does a write of 10,000 files either FULLY succeed or leave NO
-- trace? The entire atomicity rests on ONE conditional pointer swap.
-- Everything else is ordinary file writing.

CREATE TABLE table_meta (
    name TEXT PRIMARY KEY,
    -- ⚠️ SWAPPING THIS COLUMN is the ONLY atomic operation in the write
    -- path. Write 10,000 new files (readers cannot see them, as they belong
    -- to no snapshot) → write the manifest → SWAP the pointer. A failure
    -- halfway leaves the pointer at the old version, the extra files become
    -- garbage to clean later, and NO reader ever saw a partial state.
    -- The swap must be CONDITIONAL on version, or two concurrent writers
    -- will lose one of their writes.
    current_snapshot_id TEXT NOT NULL,
    partition_keys      TEXT[] NOT NULL,
    -- Because old snapshots persist, TIME TRAVEL is almost free: recovering
    -- from somebody's mistaken DELETE is SWAPPING THE POINTER BACK, not
    -- restoring from a backup.
    retention_snapshots INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE data_files (
    path         TEXT   PRIMARY KEY,
    manifest_id  TEXT   NOT NULL,
    record_count BIGINT NOT NULL,
    -- ⚠️ SMALL FILES KILL PERFORMANCE, and the problem CREATES ITSELF:
    -- streaming ingestion writing one file per minute leaves 43,200 small
    -- files per table after a month. A million 1MB files instead of ten
    -- thousand 100MB files means a million network requests and a million
    -- footer reads — tens of times slower at identical total volume.
    -- Background compaction is MANDATORY.
    size_bytes   BIGINT NOT NULL,
    -- Per-column min/max ⇒ skip whole files WITHOUT OPENING THEM, reading
    -- only the footer. This is the second of three pruning layers:
    --   1. partition pruning — drop 99.9% by path, opening nothing
    --   2. row group pruning — drop more by min/max, reading only footers
    --   3. column pruning    — read 3 columns' bytes out of 200
    -- A 50TB table ⇒ ~200MB actually read. A 250,000× difference, coming
    -- from METADATA rather than machine speed.
    column_stats JSONB  NOT NULL,
    partition_values JSONB NOT NULL
);

CREATE TABLE clones (
    id           TEXT    PRIMARY KEY,
    source_table TEXT    NOT NULL REFERENCES table_meta(name),
    -- Points at the SAME files — no bytes copied. Cloning a 50TB table takes
    -- MILLISECONDS. Possible entirely because the files are IMMUTABLE —
    -- append-only again, its seventh appearance in this roadmap.
    snapshot_id  TEXT    NOT NULL,
    copy_on_write BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE query_runs (
    id            TEXT   PRIMARY KEY,
    warehouse_id  TEXT   NOT NULL REFERENCES warehouses(id),
    -- ⚠️ THE COLUMN WITH THE STRONGEST INFLUENCE ON HUMAN BEHAVIOUR IN THIS
    -- SCHEMA. In a coupled system, cost is a monthly infrastructure bill
    -- nobody can attribute. Here every query carries a monetary figure and
    -- a NAME — and SELECT * on a 50TB table stops happening, not because
    -- anyone forbade it but because it is VISIBLE.
    user_id       TEXT   NOT NULL,
    bytes_scanned BIGINT NOT NULL,
    compute_ms    INTEGER NOT NULL,
    cost_cents    INTEGER NOT NULL
);

CREATE TABLE warehouses (
    id         TEXT    PRIMARY KEY,
    size_units INTEGER NOT NULL,
    -- Prevents a classic billing incident: a 64-core cluster started for ONE
    -- query and never stopped, idling through a weekend.
    auto_suspend BOOLEAN NOT NULL DEFAULT true,
    auto_suspend_seconds INTEGER NOT NULL DEFAULT 300
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Tách lưu trữ khỏi tính toán, và nhận ra năm hệ quả',
      titleEn: 'Separate storage from compute, and see the five consequences',
      description:
        'Dữ liệu ở kho đối tượng, tính toán là cụm không giữ trạng thái bật khi cần. Kéo theo: mở rộng độc lập (tải nặng không đụng bảng điều khiển), trả tiền theo giây tính toán, nhân bản không sao chép, xem lại thời điểm trước, và chi phí mỗi truy vấn nhìn thấy được. Hệ quả cuối ảnh hưởng tới con người nhiều nhất và thường bị bỏ qua khi thiết kế.',
      descriptionEn:
        'Data in object storage, compute as stateless clusters started on demand. It brings independent scaling (heavy work never touches dashboards), per-second billing, zero-copy cloning, time travel, and visible per-query cost. The last affects people most and is usually overlooked at design time.',
    },
    {
      phase: 'BACKEND',
      title: 'Ba lớp cắt bỏ, và tệp phải mang siêu dữ liệu về chính nó',
      titleEn: 'Three pruning layers, with files carrying metadata about themselves',
      description:
        'Cắt phân vùng bỏ 99,9% tệp qua đường dẫn mà không mở tệp nào; cắt nhóm dòng bỏ tiếp qua thống kê min/max, chỉ đọc chân tệp; cắt cột đọc 3 cột trong 200. Bảng 50TB thành ~200MB đọc thật — chênh 250.000 lần, và nó đến từ siêu dữ liệu chứ không từ tốc độ máy.',
      descriptionEn:
        'Partition pruning drops 99.9% of files by path without opening any; row group pruning drops more via min/max statistics, reading only footers; column pruning reads 3 columns out of 200. A 50TB table becomes ~200MB actually read — a 250,000× difference coming from metadata rather than machine speed.',
    },
    {
      phase: 'BACKEND',
      title: 'Bài toán tệp nhỏ — nó TỰ SINH RA',
      titleEn: 'The small-file problem — it CREATES ITSELF',
      description:
        'Nạp theo dòng mỗi phút một tệp thì sau một tháng có 43.200 tệp nhỏ cho một bảng. Một triệu tệp 1MB thay vì mười nghìn tệp 100MB là một triệu yêu cầu mạng và một triệu lần đọc chân tệp — chậm gấp hàng chục lần dù tổng dung lượng y hệt. Đây là sự cố vận hành phổ biến nhất của kiến trúc này, và bước gộp nền chính là thứ đã gặp ở công cụ tìm kiếm và message broker.',
      descriptionEn:
        'Streaming ingestion writing one file per minute leaves 43,200 small files per table after a month. A million 1MB files instead of ten thousand 100MB ones means a million network requests and a million footer reads — tens of times slower at identical volume. This is the architecture\'s most common operational failure, and the compaction step is the one you met in the search engine and the broker.',
    },
    {
      phase: 'BACKEND',
      title: 'Giao dịch bằng MỘT thao tác đổi con trỏ có điều kiện',
      titleEn: 'Transactions from ONE conditional pointer swap',
      description:
        'Kho đối tượng không có giao dịch, không khoá, không BEGIN. Ghi tệp mới (người đọc chưa thấy vì chúng chưa thuộc ảnh chụp nào) → ghi kê khai → đổi con trỏ. Ghi hỏng giữa chừng thì con trỏ vẫn ở phiên bản cũ và không người đọc nào thấy trạng thái dở dang. Đổi phải CÓ ĐIỀU KIỆN theo phiên bản, nếu không hai người ghi đồng thời sẽ có một người mất dữ liệu.',
      descriptionEn:
        'Object storage has no transactions, no locks, no BEGIN. Write new files (readers cannot see them, belonging to no snapshot) → write the manifest → swap the pointer. A failure halfway leaves the pointer at the old version and no reader observes a partial state. The swap must be CONDITIONAL on version, or two concurrent writers lose one of their writes.',
    },
    {
      phase: 'BACKEND',
      title: 'Nhân bản không sao chép và xem lại thời điểm trước',
      titleEn: 'Zero-copy cloning and time travel',
      description:
        'Nhân bản bảng 50TB tốn vài mili giây vì không byte nào được sao chép — chỉ tạo siêu dữ liệu mới trỏ tới cùng tệp bất biến. Đội phát triển có bản sao đầy đủ dữ liệu thật để thử nghiệm, gần như không tốn gì cho tới khi họ bắt đầu GHI. Và vì ảnh chụp cũ còn, khôi phục sau khi ai đó chạy nhầm DELETE là đổi con trỏ về chứ không phải phục hồi từ bản sao lưu.',
      descriptionEn:
        'Cloning a 50TB table takes milliseconds because no bytes are copied — new metadata simply points at the same immutable files. Developers get a full copy of production data for experiments, costing almost nothing until they start WRITING. And because old snapshots persist, recovering from a mistaken DELETE is a pointer swap rather than a backup restore.',
    },
    {
      phase: 'BACKEND',
      title: 'Cụm tính toán riêng cho từng loại tải, và tự tắt',
      titleEn: 'A compute cluster per workload, with auto-suspend',
      description:
        'Đội phân tích chạy báo cáo nặng không được làm chậm bảng điều khiển — mỗi loại tải một cụm, tất cả đọc cùng dữ liệu. Kèm theo là tự tắt sau thời gian nhàn rỗi, chống sự cố hoá đơn kinh điển: một cụm 64 nhân bật lên cho một truy vấn rồi không ai tắt, chạy không suốt cuối tuần.',
      descriptionEn:
        'The analytics team running heavy reports must not slow the dashboards — one cluster per workload, all reading the same data. Alongside it, auto-suspend after idle time prevents the classic billing incident: a 64-core cluster started for one query and never stopped, idling through a weekend.',
    },
    {
      phase: 'FRONTEND',
      title: 'Chi phí là một tính năng, không phải một báo cáo cuối tháng',
      titleEn: 'Cost as a feature, not a month-end report',
      description:
        'Hiện chi phí ước tính TRƯỚC khi chạy chứ không phải sau khi nhận hoá đơn. Hạn mức theo nhóm phải chặn thật — kiểm sau khi chạy là quá muộn, đúng như ở AI Chatbot Platform. Cảnh báo khi một truy vấn quét vượt ngưỡng vì đó gần như luôn là thiếu điều kiện lọc phân vùng. Và xếp hạng truy vấn tốn nhất mỗi tuần: thường vài truy vấn chiếm phần lớn hoá đơn.',
      descriptionEn:
        'Show estimated cost BEFORE running rather than after the invoice. Team budgets must actually block — checking after execution is far too late, exactly as in the AI Chatbot Platform. Alert when a query scans past a threshold, because it is almost always a missing partition predicate. And rank the most expensive queries weekly: usually a handful account for most of the bill.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách giết tiến trình ghi và chạy hai người ghi đồng thời',
      titleEn: 'Verify by killing writers and running concurrent commits',
      description:
        'Giết tiến trình ghi giữa chừng — người đọc KHÔNG được thấy dữ liệu dở dang. Hai tiến trình cùng ghi một bảng — một thành công, một thử lại, không mất dữ liệu. Nhân bản bảng 1TB — xong dưới một giây và dung lượng kho KHÔNG tăng. Nạp dòng liên tục 24 giờ rồi truy vấn — hiệu năng không được tệ đi, tức là gộp tệp đang hoạt động.',
      descriptionEn:
        'Kill a writer mid-commit — readers must NEVER observe partial data. Two processes committing to one table — one succeeds, the other retries, nothing is lost. Clone a 1TB table — under a second with storage usage UNCHANGED. Stream-ingest for 24 hours then query — performance must not degrade, meaning compaction is working.',
    },
  ],

  features: [
    { title: 'Lưu trữ định dạng cột mở trên kho đối tượng', titleEn: 'Open columnar storage on object storage', description: 'Tệp bất biến mang theo thống kê cột của chính nó.', descriptionEn: 'Immutable files carrying their own column statistics.', status: 'PLANNED' },
    { title: 'Nhiều cụm tính toán trên cùng dữ liệu', titleEn: 'Multiple compute clusters over one dataset', description: 'Mỗi loại tải một cụm, mở rộng và tắt độc lập.', descriptionEn: 'One cluster per workload, scaling and suspending independently.', status: 'PLANNED' },
    { title: 'Ba lớp cắt bỏ khi quét', titleEn: 'Three-layer scan pruning', description: 'Cắt phân vùng, cắt nhóm dòng theo min/max, cắt cột.', descriptionEn: 'Partition pruning, min/max row group pruning, and column pruning.', status: 'PLANNED' },
    { title: 'Giao dịch nguyên tử trên kho đối tượng', titleEn: 'Atomic commits on object storage', description: 'Ảnh chụp và kê khai, đổi con trỏ có điều kiện ở bước cuối.', descriptionEn: 'Snapshots and manifests with a conditional pointer swap at the end.', status: 'PLANNED' },
    { title: 'Nhân bản không sao chép', titleEn: 'Zero-copy cloning', description: 'Bảng 50TB nhân bản trong vài mili giây, ghi mới mới sao chép.', descriptionEn: 'A 50TB table cloned in milliseconds, duplicating only on write.', status: 'PLANNED' },
    { title: 'Xem lại dữ liệu ở thời điểm trước', titleEn: 'Time travel', description: 'Khôi phục sau thao tác nhầm bằng cách đổi con trỏ về.', descriptionEn: 'Recovery from mistakes by swapping the pointer back.', status: 'PLANNED' },
    { title: 'Gộp tệp nền', titleEn: 'Background compaction', description: 'Chống bài toán tệp nhỏ tự sinh từ nạp theo dòng.', descriptionEn: 'Counters the small-file problem that streaming ingestion creates.', status: 'PLANNED' },
    { title: 'Tính chi phí theo truy vấn có quy trách nhiệm', titleEn: 'Attributed per-query cost accounting', description: 'Byte quét, giây tính toán, tiền, và tên người chạy.', descriptionEn: 'Bytes scanned, compute seconds, cost, and who ran it.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'The Snowflake Elastic Data Warehouse (SIGMOD 2016)', titleEn: 'The Snowflake Elastic Data Warehouse (SIGMOD 2016)', url: 'https://event.cwi.nl/lsde/papers/p215-dageville-snowflake.pdf', type: 'PDF', description: 'Bài báo trình bày kiến trúc tách lưu trữ khỏi tính toán — nền của cả dự án này.', descriptionEn: 'The paper presenting the storage-compute separation architecture this project rests on.' },
    { title: 'Apache Iceberg — Table specification', titleEn: 'Apache Iceberg — Table specification', url: 'https://iceberg.apache.org/spec/', type: 'LINK', description: 'Ảnh chụp, kê khai, đổi con trỏ nguyên tử — mô tả chính xác cơ chế ở phần giữa bài.', descriptionEn: 'Snapshots, manifests and atomic pointer swaps — precisely the mechanism in the middle of this study.' },
    { title: 'Apache Parquet — File format', titleEn: 'Apache Parquet — File format', url: 'https://parquet.apache.org/docs/file-format/', type: 'LINK', description: 'Bố cục nhóm dòng và thống kê ở chân tệp — thứ làm cho việc cắt bỏ khả thi.', descriptionEn: 'Row group layout and footer statistics — what makes pruning possible at all.' },
    { title: 'Apache Arrow DataFusion', titleEn: 'Apache Arrow DataFusion', url: 'https://datafusion.apache.org/', type: 'REPO', description: 'Bộ máy truy vấn viết bằng Rust, đọc mã để thấy đẩy phép lọc xuống được cài đặt ra sao.', descriptionEn: 'A Rust query engine; read the source to see how predicate pushdown is actually implemented.' },
    { title: 'Lakehouse: A New Generation of Open Platforms', titleEn: 'Lakehouse: A New Generation of Open Platforms', url: 'https://www.cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf', type: 'PDF', description: 'Vì sao ACID trên kho đối tượng đổi hẳn cách tổ chức dữ liệu của một công ty.', descriptionEn: 'Why ACID on object storage changes how an organisation structures its data.' },
  ],

  coreKnowledge: [
    { vi: 'Tách lưu trữ khỏi tính toán và hệ quả kiến trúc của nó', en: 'Separating storage from compute and its architectural consequences' },
    { vi: 'Định dạng tệp cột và siêu dữ liệu cho phép bỏ qua dữ liệu', en: 'Columnar file formats and the metadata that lets you skip data' },
    { vi: 'Đẩy phép lọc xuống: cắt phân vùng, cắt nhóm dòng, cắt cột', en: 'Predicate pushdown: partition, row group and column pruning' },
    { vi: 'Tính nguyên tử trên kho không có giao dịch, bằng đổi con trỏ', en: 'Atomicity on transaction-free storage via a pointer swap' },
    { vi: 'Bất biến cho phép nhân bản không sao chép và xem lại quá khứ', en: 'Immutability enabling zero-copy clones and time travel' },
    { vi: 'Bài toán tệp nhỏ và vì sao gộp nền là bắt buộc', en: 'The small-file problem and why background compaction is mandatory' },
    { vi: 'Chi phí như một tín hiệu thiết kế, không phải một hoá đơn', en: 'Cost as a design signal rather than an invoice' },
    { vi: 'Cách ly tải công việc mà vẫn dùng chung một nguồn sự thật', en: 'Workload isolation over a single shared source of truth' },
  ],

  portfolioBonus: [
    { vi: 'Video nhân bản bảng 1TB trong dưới một giây, dung lượng kho không đổi', en: 'A video cloning a 1TB table in under a second with storage unchanged' },
    { vi: 'Biểu đồ byte quét theo từng lớp cắt bỏ trên cùng một truy vấn', en: 'A bytes-scanned chart per pruning layer for one query' },
    { vi: 'Thí nghiệm tệp nhỏ: cùng dữ liệu, hai cách chia tệp, hai thời gian truy vấn', en: 'A small-file experiment: identical data, two file layouts, two query times' },
    { vi: 'Video giết tiến trình ghi và chứng minh người đọc không thấy dở dang', en: 'A video killing a writer and proving readers never see a partial state' },
    { vi: 'Bảng xếp hạng truy vấn tốn nhất, có tên người và số tiền', en: 'A most-expensive-queries leaderboard with names and amounts' },
  ],

  completionOutcomes: [
    { vi: 'Thiết kế hệ thống dữ liệu mà chi phí là ràng buộc hiển thị được', en: 'Design data systems where cost is a visible constraint' },
    { vi: 'Đạt tính nguyên tử trên hạ tầng không cung cấp giao dịch', en: 'Achieve atomicity on infrastructure that provides no transactions' },
    { vi: 'Hiểu vì sao bất biến mở ra cả một nhóm tính năng mới', en: 'Understand why immutability unlocks an entire class of features' },
    { vi: 'Tối ưu bằng cách ĐỌC ÍT ĐI thay vì chạy nhanh hơn', en: 'Optimise by READING LESS rather than by running faster' },
    { vi: 'Nhận ra khi một quyết định kỹ thuật thay đổi hành vi tổ chức', en: 'Recognise when a technical decision changes organisational behaviour' },
  ],

  bodyMdx,
  bodyMdxEn,
};
