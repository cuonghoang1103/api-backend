/**
 * Case-study 4.4 — Cloud Storage System (S3-like).
 *
 * The organising question: where does "eleven nines" actually come from? It
 * comes from arithmetic, and doing that arithmetic reveals both that three
 * copies cost twice what is needed (erasure coding) and that the calculation
 * hides an independence assumption that random placement violates.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./cloud-storage-system-s3-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./cloud-storage-system-s3-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'cloud-storage-system-s3-like',
  title: 'Cloud Storage System (S3-like)',
  titleEn: 'Cloud Storage System (S3-like)',
  description:
    'Kho lưu trữ đối tượng phân tán với mã hoá xoá, đặt bản sao theo miền lỗi và kiểm tra âm thầm. Câu hỏi làm nên dự án: độ bền "mười một số chín" đến từ đâu? Nó đến từ phép tính — và khi làm phép tính đó, bạn thấy cách hiển nhiên (ba bản sao) vừa tốn gấp đôi mức cần vừa có một điểm mù.',
  descriptionEn:
    'A distributed object store with erasure coding, failure-domain placement and background scrubbing. The organising question: where does "eleven nines" durability come from? From arithmetic — and doing that arithmetic shows the obvious approach (three copies) both costs double and has a blind spot.',
  techStack: [
    'Go', 'Reed-Solomon erasure coding', 'gRPC', 'PostgreSQL', 'FoundationDB',
    'Consistent hashing', 'BLAKE3 checksums', 'S3 API compatibility', 'Docker', 'Kubernetes',
  ],
  role: 'Backend / hệ phân tán (một người)',
  roleEn: 'Backend / distributed systems (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/cloud-storage-system-s3-like.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- ĐỘ BỀN LÀ MỘT PHÉP TÍNH, KHÔNG PHẢI MỘT NỖ LỰC.
-- Ổ cứng hỏng ~2%/năm. Một bản ⇒ độ bền 98%. Ba bản độc lập ⇒ mất dữ liệu
-- cần CẢ BA cùng hỏng: 0.02³ = 0.000008 ⇒ 99.9992%. Đó là NĂM số chín,
-- không phải mười một — và bạn đang trả GẤP BA dung lượng.
--
-- MÃ HOÁ XOÁ 10+4: chia thành 10 mảnh dữ liệu + 4 mảnh kiểm tra.
-- BẤT KỲ 10 mảnh nào trong 14 cũng dựng lại được tệp gốc.
--   nhân bản 3 bản : 3.0× dung lượng, chịu mất 2 ổ
--   mã hoá xoá 10+4: 1.4× dung lượng, chịu mất 4 ổ
-- Chịu lỗi TỐT HƠN với chi phí chưa bằng NỬA.

CREATE TABLE object_versions (
    object_key   TEXT        NOT NULL,
    version_id   TEXT        NOT NULL,
    size_bytes   BIGINT      NOT NULL,
    etag         TEXT        NOT NULL,   -- băm nội dung: để KIỂM, không chỉ để đệm
    -- Không chọn MỘT cách cho mọi dữ liệu. Tệp 4KB chia thành 10 mảnh
    -- 400 byte là vô lý — siêu dữ liệu vượt cả dữ liệu. Ngưỡng ~1MB:
    -- tệp NHỎ và NÓNG thì nhân bản, tệp LỚN và NGUỘI thì mã hoá xoá.
    redundancy   VARCHAR(16) NOT NULL,   -- REPLICA_3 | ERASURE_10_4
    -- Xoá KHÔNG xoá gì cả — ghi thêm một dấu. Lần thứ NĂM nguyên tắc
    -- chỉ-ghi-thêm xuất hiện trong lộ trình, và động cơ ở đây là PHỤC HỒI
    -- SAU THAO TÁC NHẦM CỦA CON NGƯỜI — nguyên nhân mất dữ liệu phổ biến
    -- hơn hẳn ổ đĩa hỏng.
    delete_marker BOOLEAN    NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (object_key, version_id)
);

CREATE TABLE shard_placements (
    version_id   TEXT        NOT NULL,
    shard_index  SMALLINT    NOT NULL,   -- 0-9 dữ liệu, 10-13 kiểm tra
    node_id      TEXT        NOT NULL REFERENCES nodes(id),
    -- ⚠️ ĐIỂM MÙ CỦA PHÉP TÍNH ĐỘ BỀN: 0.02³ giả thiết ngầm rằng ba ổ hỏng
    -- ĐỘC LẬP. Ba bản trên ba ổ CÙNG MỘT TỦ RACK thì mất nguồn tủ là mất cả
    -- ba — xác suất thật không phải 0.000008 mà là xác suất tủ hỏng, cỡ
    -- PHẦN TRĂM. Bạn vừa quảng cáo mười một số chín và cung cấp hai.
    -- Cây miền lỗi: vùng → khu → tủ rack → máy → ổ. Đặt CÀNG XA CÀNG TỐT.
    failure_domain TEXT      NOT NULL,
    -- Mỗi MẢNH có mã kiểm riêng. Thối bit là im lặng: không lỗi nào được báo
    -- cho tới khi có người đọc và nhận về rác.
    checksum     TEXT        NOT NULL,
    last_scrubbed_at TIMESTAMPTZ,
    PRIMARY KEY (version_id, shard_index)
);

-- Ràng buộc PHẢI kiểm khi đặt mảnh: không hai mảnh nào của cùng một phiên
-- bản được nằm chung một miền lỗi. Đây là điều kiện để phép tính xác suất
-- ở trên còn đúng.

CREATE TABLE multipart_uploads (
    upload_id     TEXT        PRIMARY KEY,
    object_key    TEXT        NOT NULL,
    parts_uploaded INTEGER    NOT NULL DEFAULT 0,
    -- Người dùng tải tệp 50GB, đứt mạng ở 40GB, không bao giờ quay lại.
    -- Không có hạn thì 40GB đó chiếm chỗ VĨNH VIỄN, không xuất hiện trong
    -- danh sách đối tượng, và không ai hiểu vì sao dung lượng không khớp.
    expires_at    TIMESTAMPTZ NOT NULL
);`,

  schemaCodeEn: `-- DURABILITY IS ARITHMETIC, NOT EFFORT.
-- Drives fail ~2%/year. One copy ⇒ 98% durability. Three independent copies
-- ⇒ loss requires ALL THREE to fail: 0.02³ = 0.000008 ⇒ 99.9992%. That is
-- FIVE nines, not eleven — and you are paying THREE TIMES the capacity.
--
-- ERASURE CODING 10+4: split into 10 data + 4 parity fragments.
-- ANY 10 of the 14 reconstruct the original.
--   3-way replication : 3.0× capacity, survives 2 drive losses
--   erasure 10+4      : 1.4× capacity, survives 4 drive losses
-- MORE fault tolerance at LESS THAN HALF the cost.

CREATE TABLE object_versions (
    object_key   TEXT        NOT NULL,
    version_id   TEXT        NOT NULL,
    size_bytes   BIGINT      NOT NULL,
    etag         TEXT        NOT NULL,   -- content hash: for VERIFICATION, not just caching
    -- Do NOT pick one scheme for all data. Splitting a 4KB file into ten
    -- 400-byte fragments is absurd — metadata outweighs data. Threshold
    -- ~1MB: SMALL and HOT objects replicate, LARGE and COLD erasure-code.
    redundancy   VARCHAR(16) NOT NULL,   -- REPLICA_3 | ERASURE_10_4
    -- Deletion removes NOTHING — it appends a marker. The FIFTH appearance
    -- of append-only in this roadmap, and the motive here is RECOVERY FROM
    -- HUMAN ERROR — statistically a more common cause of data loss than
    -- drive failure.
    delete_marker BOOLEAN    NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (object_key, version_id)
);

CREATE TABLE shard_placements (
    version_id   TEXT        NOT NULL,
    shard_index  SMALLINT    NOT NULL,   -- 0-9 data, 10-13 parity
    node_id      TEXT        NOT NULL REFERENCES nodes(id),
    -- ⚠️ THE BLIND SPOT IN THE DURABILITY MATH: 0.02³ silently assumes the
    -- three drives fail INDEPENDENTLY. Three copies on three drives in THE
    -- SAME RACK all die when that rack loses power — the real probability is
    -- not 0.000008 but the rack failure rate, in the PERCENT range. You have
    -- advertised eleven nines and delivered two.
    -- The failure-domain tree: region → zone → rack → machine → drive.
    -- Place fragments AS FAR APART AS POSSIBLE.
    failure_domain TEXT      NOT NULL,
    -- Each FRAGMENT carries its own checksum. Bit rot is silent: no error is
    -- reported until somebody reads the file and receives garbage.
    checksum     TEXT        NOT NULL,
    last_scrubbed_at TIMESTAMPTZ,
    PRIMARY KEY (version_id, shard_index)
);

-- A constraint that MUST be checked at placement time: no two fragments of
-- one version may share a failure domain. That condition is what keeps the
-- probability calculation above valid.

CREATE TABLE multipart_uploads (
    upload_id     TEXT        PRIMARY KEY,
    object_key    TEXT        NOT NULL,
    parts_uploaded INTEGER    NOT NULL DEFAULT 0,
    -- A user uploads a 50GB file, the network drops at 40GB, they never
    -- return. Without expiry those 40GB occupy space FOREVER, never appear
    -- in an object listing, and nobody understands why capacity does not
    -- reconcile.
    expires_at    TIMESTAMPTZ NOT NULL
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Làm phép tính độ bền trước khi viết dòng nào',
      titleEn: 'Do the durability arithmetic before writing any code',
      description:
        'Ổ hỏng ~2%/năm, ba bản độc lập cho ra 99,9992% — tức NĂM số chín chứ không phải mười một, và tốn gấp ba dung lượng. Con số quảng cáo không đến từ việc cẩn thận hơn mà từ phép tính. Làm phép tính trước sẽ cho bạn biết cần cấu hình dư thừa nào, thay vì chọn ba bản sao vì nó nghe hợp lý.',
      descriptionEn:
        'Drives fail ~2% a year, and three independent copies yield 99.9992% — FIVE nines, not eleven, at triple the capacity. The advertised figure comes from arithmetic rather than diligence. Doing the arithmetic first tells you which redundancy configuration you need, instead of choosing three copies because it sounds reasonable.',
    },
    {
      phase: 'BACKEND',
      title: 'Mã hoá xoá: chịu lỗi tốt hơn với chưa bằng nửa chi phí',
      titleEn: 'Erasure coding: more fault tolerance at under half the cost',
      description:
        'Chia tệp thành 10 mảnh dữ liệu và 4 mảnh kiểm tra, bất kỳ 10 mảnh nào cũng dựng lại được bản gốc. So với nhân bản ba bản: chịu mất 4 ổ thay vì 2, mà chỉ dùng 1,4× dung lượng thay vì 3×. Cái giá là đọc phải lấy từ 10 ổ và tính toán lại — nên tệp nhỏ và nóng thì nhân bản, tệp lớn và nguội thì mã hoá xoá.',
      descriptionEn:
        'Split a file into 10 data and 4 parity fragments; any 10 reconstruct the original. Against 3-way replication: survives 4 drive losses instead of 2, at 1.4× capacity instead of 3×. The cost is that reads fetch from 10 drives and recompute — so small hot objects replicate and large cold objects erasure-code.',
    },
    {
      phase: 'BACKEND',
      title: 'Đặt mảnh theo miền lỗi — nơi phép tính dễ sai nhất',
      titleEn: 'Failure-domain placement — where the arithmetic most often breaks',
      description:
        'Phép tính 0,02³ giả thiết ngầm rằng ba ổ hỏng ĐỘC LẬP. Ba bản cùng một tủ rack thì mất nguồn tủ là mất cả ba, và xác suất thật là xác suất tủ hỏng — cỡ phần trăm, không phải phần triệu. Đặt theo cây vùng → khu → tủ → máy → ổ, càng xa nhau càng tốt. Nguyên tắc chung: mọi phép tính xác suất đều có giả thiết độc lập ẩn bên trong, việc của bạn là tìm ra nó.',
      descriptionEn:
        'The 0.02³ calculation silently assumes the drives fail INDEPENDENTLY. Three copies in one rack all die with that rack, and the real probability is the rack failure rate — percent, not parts per million. Place along the region → zone → rack → machine → drive tree, as far apart as possible. The general principle: every probability calculation hides an independence assumption, and your job is to find it.',
    },
    {
      phase: 'BACKEND',
      title: 'Kiểm tra âm thầm: thối bit không báo lỗi cho ai',
      titleEn: 'Scrubbing: bit rot reports itself to nobody',
      description:
        'Tệp nằm yên ba năm vẫn hỏng được — tia vũ trụ, ổ xuống cấp, lỗi phần sụn. Nguy hiểm ở chỗ nó IM LẶNG: không lỗi nào cho tới khi có người đọc và nhận rác, và nếu phát hiện muộn thì bản tốt có thể bị dọn trước. Mã kiểm cho từng mảnh, quét nền định kỳ, tự dựng lại từ mảnh còn tốt. Nhưng quét PHẢI có giới hạn tốc độ, nếu không biện pháp an toàn biến thành sự cố.',
      descriptionEn:
        'A file untouched for three years can still corrupt — cosmic rays, drive degradation, firmware bugs. The danger is SILENCE: no error until somebody reads garbage, and detected late the good copy may be reclaimed first. Per-fragment checksums, periodic background sweeps, repair from surviving fragments. But scrubbing MUST be rate-limited, or a safety measure becomes an incident.',
    },
    {
      phase: 'BACKEND',
      title: 'Tốc độ dựng lại là một chỉ số AN TOÀN',
      titleEn: 'Rebuild speed is a SAFETY metric',
      description:
        'Cửa sổ dựng lại là lúc dễ tổn thương nhất: với mã hoá xoá 10+4, mất 4 nút là hết biên an toàn và mất nút thứ 5 trong lúc đang dựng lại là mất dữ liệu. Thời gian dựng lại nằm TRỰC TIẾP trong phép tính độ bền — cụm dựng xong trong một giờ an toàn hơn hẳn cụm mất một tuần dù cùng cấu hình. Vì thế rải mảnh ra RẤT NHIỀU nút để hàng trăm nút cùng góp phần dựng lại.',
      descriptionEn:
        'The rebuild window is the most vulnerable period: with 10+4, four lost nodes exhausts the margin and a fifth during rebuild is data loss. Rebuild time sits DIRECTLY inside the durability calculation — a cluster rebuilding in an hour is far safer than one taking a week at identical settings. Hence spreading fragments across MANY nodes so hundreds contribute to the rebuild.',
    },
    {
      phase: 'BACKEND',
      title: 'Tải nhiều phần, và dọn phần dở dang',
      titleEn: 'Multipart uploads, and cleaning up abandoned parts',
      description:
        'Tệp lớn phải tải được theo phần và tiếp tục được sau khi đứt mạng, nếu không người dùng tải lại 10GB từ đầu. Nhưng phải có thời hạn cho phiên tải: người dùng bỏ dở ở 40GB rồi không quay lại thì chỗ đó chiếm vĩnh viễn, không hiện trong danh sách đối tượng, và không ai hiểu vì sao dung lượng đã dùng không khớp.',
      descriptionEn:
        'Large files must upload in parts and resume after a break, or users restart 10GB from zero. But upload sessions need a deadline: a user abandoning at 40GB and never returning occupies that space forever, invisible in object listings, with nobody understanding why used capacity does not reconcile.',
    },
    {
      phase: 'BACKEND',
      title: 'Nhất quán: đừng dùng LIST để điều phối công việc',
      titleEn: 'Consistency: never use LIST to coordinate work',
      description:
        'PUT rồi GET cùng khoá thì thấy ngay, nhưng PUT rồi LIST thì có thể chưa thấy — danh sách là chỉ mục riêng, cập nhật không đồng bộ. Mẫu hình sai rất phổ biến: một tiến trình ghi tệp, tiến trình khác gọi LIST để phát hiện tệp mới. Nó chạy đúng khi thử rồi thỉnh thoảng bỏ sót trên môi trường thật, và cực khó tái hiện. Cách đúng: bắn sự kiện khi ghi xong, bên nhận đọc thẳng theo khoá.',
      descriptionEn:
        'PUT then GET the same key is immediately visible, but PUT then LIST may not be — listing is a separate, asynchronously updated index. The common wrong pattern: one process writes files, another calls LIST to discover them. It works in testing and then occasionally misses files in production, and it is extremely hard to reproduce. The right approach: emit an event on write and read by key.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách giết nút và bẻ byte trên đĩa',
      titleEn: 'Verify by killing nodes and corrupting bytes on disk',
      description:
        'Giết 4 nút bất kỳ trong cấu hình 10+4 — mọi đối tượng vẫn đọc được. Giết nút thứ 5 trước khi dựng xong — hệ thống phải BÁO RÕ mất dữ liệu chứ không trả byte sai. Sửa trực tiếp một byte của một mảnh trên đĩa — lần quét tiếp theo phải phát hiện và tự sửa. Và kiểm vị trí mảnh của 1.000 đối tượng: không đối tượng nào có hai mảnh cùng một tủ rack.',
      descriptionEn:
        'Kill any 4 nodes in a 10+4 configuration — every object still reads. Kill a 5th before the rebuild finishes — the system must REPORT data loss rather than return wrong bytes. Corrupt one byte of a fragment on disk — the next scrub must detect and repair it. And inspect fragment placement across 1,000 objects: none has two fragments in one rack.',
    },
  ],

  features: [
    { title: 'API tương thích chuẩn kho đối tượng', titleEn: 'A standards-compatible object API', description: 'Nhóm chứa, khoá, siêu dữ liệu, ghi có điều kiện theo etag.', descriptionEn: 'Buckets, keys, metadata, and conditional writes on etag.', status: 'PLANNED' },
    { title: 'Mã hoá xoá Reed-Solomon', titleEn: 'Reed-Solomon erasure coding', description: '10+4 cho tệp lớn, nhân bản cho tệp nhỏ và nóng.', descriptionEn: '10+4 for large objects, replication for small and hot ones.', status: 'PLANNED' },
    { title: 'Đặt mảnh theo cây miền lỗi', titleEn: 'Failure-domain-aware placement', description: 'Không hai mảnh nào của một đối tượng nằm chung tủ rack.', descriptionEn: 'No two fragments of one object share a rack.', status: 'PLANNED' },
    { title: 'Quét kiểm và tự sửa', titleEn: 'Scrubbing with self-repair', description: 'Mã kiểm từng mảnh, quét có giới hạn tốc độ, dựng lại từ mảnh tốt.', descriptionEn: 'Per-fragment checksums, rate-limited sweeps, repair from survivors.', status: 'PLANNED' },
    { title: 'Tải lên nhiều phần, tiếp tục được', titleEn: 'Resumable multipart uploads', description: 'Đứt mạng giữa chừng thì nối lại và đi tiếp, có dọn phần bỏ dở.', descriptionEn: 'Reconnect and continue after a break, with abandoned parts cleaned up.', status: 'PLANNED' },
    { title: 'Phiên bản đối tượng và khoá chống xoá', titleEn: 'Object versioning and retention locks', description: 'Xoá là ghi thêm dấu, khôi phục được thao tác nhầm của con người.', descriptionEn: 'Deletion appends a marker, making human error recoverable.', status: 'PLANNED' },
    { title: 'Phân tầng theo mẫu hình truy cập', titleEn: 'Tiering by access pattern', description: 'Nóng, ấm, lạnh — quyết định theo số đo chứ không theo tuổi tệp.', descriptionEn: 'Hot, warm, cold — decided by measurements rather than file age.', status: 'PLANNED' },
    { title: 'Dựng lại song song khi mất nút', titleEn: 'Parallel rebuild on node loss', description: 'Hàng trăm nút cùng góp phần, vì tốc độ dựng lại là chỉ số an toàn.', descriptionEn: 'Hundreds of nodes contribute, because rebuild speed is a safety metric.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Erasure Coding in Windows Azure Storage', titleEn: 'Erasure Coding in Windows Azure Storage', url: 'https://www.usenix.org/system/files/conference/atc12/atc12-final181.pdf', type: 'PDF', description: 'Mã hoá xoá ở quy mô sản xuất thật, kèm số liệu chi phí và thời gian dựng lại.', descriptionEn: 'Erasure coding at genuine production scale, with cost and rebuild-time figures.' },
    { title: 'Ceph — CRUSH placement algorithm', titleEn: 'Ceph — CRUSH placement algorithm', url: 'https://docs.ceph.com/en/latest/rados/operations/crush-map/', type: 'LINK', description: 'Thuật toán đặt dữ liệu theo cây miền lỗi — đúng bài toán ở phần giữa của case-study này.', descriptionEn: 'Placement along a failure-domain tree — exactly the problem in the middle of this study.' },
    { title: 'Amazon S3 — Data consistency model', titleEn: 'Amazon S3 — Data consistency model', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel', type: 'LINK', description: 'Đọc-sau-ghi và giới hạn của LIST, phát biểu bởi chính nhà cung cấp.', descriptionEn: 'Read-after-write and the limits of LIST, stated by the provider itself.' },
    { title: 'Backblaze — Hard Drive Stats', titleEn: 'Backblaze — Hard Drive Stats', url: 'https://www.backblaze.com/cloud-storage/resources/hard-drive-test-data', type: 'LINK', description: 'Tỉ lệ hỏng ổ đĩa THẬT trên hàng trăm nghìn ổ — nguồn cho con số 2% trong bài.', descriptionEn: 'REAL drive failure rates across hundreds of thousands of drives — the source of the 2% figure.' },
    { title: 'Klaus Post — Reed-Solomon in Go', titleEn: 'Klaus Post — Reed-Solomon in Go', url: 'https://github.com/klauspost/reedsolomon', type: 'REPO', description: 'Thư viện mã hoá xoá dùng được ngay, đọc mã để hiểu phép toán bên trong.', descriptionEn: 'A production-ready erasure coding library; read the source for the mathematics inside.' },
  ],

  coreKnowledge: [
    { vi: 'Toán độ bền: xác suất hỏng, và giả thiết độc lập ẩn trong mọi phép tính', en: 'Durability mathematics: failure probability, and the independence assumption hidden in every calculation' },
    { vi: 'Mã hoá xoá và lý thuyết mã sửa lỗi ứng dụng vào lưu trữ', en: 'Erasure coding and error-correcting code theory applied to storage' },
    { vi: 'Miền lỗi và hỏng có tương quan trong hệ thống thật', en: 'Failure domains and correlated failure in real systems' },
    { vi: 'Thối bit, kiểm tra âm thầm, và vì sao im lặng là đặc tính nguy hiểm nhất', en: 'Bit rot, scrubbing, and why silence is the most dangerous property' },
    { vi: 'Thời gian dựng lại như một thành phần của độ bền, không phải hiệu năng', en: 'Rebuild time as a component of durability rather than of performance' },
    { vi: 'Mô hình nhất quán của kho đối tượng và giới hạn của thao tác liệt kê', en: 'Object store consistency models and the limits of listing operations' },
    { vi: 'Phân tầng lưu trữ và kinh tế học của dữ liệu nguội', en: 'Storage tiering and the economics of cold data' },
    { vi: 'Siêu dữ liệu là bài toán khó hơn dữ liệu ở quy mô hàng tỉ đối tượng', en: 'Metadata as the harder problem at billion-object scale' },
  ],

  portfolioBonus: [
    { vi: 'Bảng tính độ bền cho nhiều cấu hình, kèm cả trường hợp hỏng có tương quan', en: 'A durability spreadsheet across configurations, including correlated-failure cases' },
    { vi: 'Video giết 4 nút mà mọi đối tượng vẫn đọc được', en: 'A video killing 4 nodes with every object still readable' },
    { vi: 'Thí nghiệm bẻ một byte trên đĩa và chỉ ra hệ thống tự sửa', en: 'An experiment corrupting one byte on disk and showing self-repair' },
    { vi: 'So chi phí lưu trữ thực đo giữa nhân bản và mã hoá xoá trên cùng dữ liệu', en: 'Measured storage cost compared between replication and erasure coding on the same data' },
    { vi: 'Biểu đồ thời gian dựng lại theo số nút tham gia', en: 'A rebuild-time chart against the number of participating nodes' },
  ],

  completionOutcomes: [
    { vi: 'Phát biểu và chứng minh được một bảo đảm độ bền bằng số', en: 'State and justify a durability guarantee numerically' },
    { vi: 'Tìm ra giả thiết ẩn trong các phép tính về độ tin cậy', en: 'Find the hidden assumptions inside reliability calculations' },
    { vi: 'Thiết kế hệ thống tự phát hiện hỏng hóc thay vì chờ người dùng báo', en: 'Design systems that detect their own corruption rather than waiting for user reports' },
    { vi: 'Cân bằng chi phí lưu trữ với mức bảo vệ theo từng loại dữ liệu', en: 'Balance storage cost against protection level per class of data' },
    { vi: 'Hiểu vì sao các nhà cung cấp đám mây thiết kế API của họ như vậy', en: 'Understand why cloud providers designed their APIs the way they did' },
  ],

  bodyMdx,
  bodyMdxEn,
};
