/**
 * Case-study 4.5 — Distributed Database (PostgreSQL-like).
 *
 * The whole roadmap treated a database as simply correct. This opens it: WAL
 * and the single fsync call all durability rests on (and that many drives lie
 * about), MVCC and the cleanup debt it creates, Raft quorums, and CAP stated
 * correctly rather than as "pick 2 of 3".
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./distributed-database-postgres-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./distributed-database-postgres-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'distributed-database-postgres-like',
  title: 'Distributed Database (PostgreSQL-like)',
  titleEn: 'Distributed Database (PostgreSQL-like)',
  description:
    'Tự viết công cụ database: nhật ký ghi trước, MVCC, B-tree, đồng thuận Raft, bộ lập kế hoạch truy vấn. Suốt lộ trình bạn đã dùng database như một thứ luôn đúng — bài này hỏi những bảo đảm đó được thực hiện bằng cách nào, và phát hiện ra độ bền của mọi dữ liệu phụ thuộc vào MỘT lời gọi hệ thống mà nhiều thiết bị nói dối về nó.',
  descriptionEn:
    'Build a database engine: write-ahead logging, MVCC, B-trees, Raft consensus, a query planner. The whole roadmap treated databases as simply correct — this asks how those guarantees are delivered, and finds that all durability rests on ONE system call that many devices lie about.',
  techStack: [
    'Rust', 'Go', 'Raft', 'B-tree', 'LSM tree', 'MVCC', 'Write-ahead log',
    'gRPC', 'Protocol Buffers', 'Jepsen-style testing', 'Docker',
  ],
  role: 'Backend / hệ thống nền (một người)',
  roleEn: 'Backend / systems (solo)',
  duration: '12–16 tuần',
  durationEn: '12–16 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// ĐỘ BỀN NẰM Ở ĐÚNG MỘT CHỖ: lời gọi fsync.
//
//   1. Ghi bản ghi thay đổi vào NHẬT KÝ   — ghi TUẦN TỰ, nhanh
//   2. fsync                              — ép xuống đĩa VẬT LÝ
//   3. Báo COMMIT thành công cho client    ← đúng thời điểm này, không sớm hơn
//   4. SAU ĐÓ mới ghi trang dữ liệu        — ghi ngẫu nhiên, gộp lô, chậm cũng được
//
// Trước fsync: mất điện = mất giao dịch. Sau fsync: mất điện = phát lại được.
//
// ⚠️ NHIỀU Ổ ĐĨA NÓI DỐI VỀ fsync: chúng báo "đã ghi xong" khi dữ liệu mới
// nằm trong bộ đệm của chính ổ, chưa xuống mặt đĩa. Đây là nguyên nhân của
// những vụ mất dữ liệu "không thể xảy ra". Nếu phần cứng nói dối thì MỌI tầng
// bên trên — nhân bản, đồng thuận, giao dịch phân tán — đều nói dối theo
// mà không hề biết.

struct WalSegment {
    start_lsn: u64,
    end_lsn:   u64,
    fsynced:   bool,     // ĐỘ BỀN NẰM Ở ĐÂY, không ở chỗ nào khác
}

// MVCC gói trong HAI SỐ NGUYÊN. Không có khoá nào cả — chỉ là so sánh số.
// Một dòng "hiển thị" với giao dịch T khi: giao dịch tạo ra nó đã kết thúc
// TRƯỚC T, và giao dịch xoá nó chưa kết thúc (hoặc không tồn tại).
struct TupleVersion {
    xmin: u64,           // giao dịch TẠO ra phiên bản này
    xmax: u64,           // giao dịch XOÁ nó — 0 nghĩa là còn sống
    data: Vec<u8>,
}

// Cái giá của MVCC — lần thứ SÁU nguyên tắc chỉ-ghi-thêm xuất hiện trong lộ
// trình, và cái giá lặp lại y hệt: phiên bản cũ vẫn nằm trên đĩa và phải có
// bước dọn về sau. Ba tình huống làm việc dọn không theo kịp:
//   · giao dịch mở lâu — MỘT kết nối treo chặn dọn MỌI phiên bản cũ hơn nó,
//     đủ để làm phình cả database
//   · ghi rất nhiều vào ít dòng (bảng đếm lượt xem)
//   · bản sao giữ ảnh chụp, chặn dọn ở bản chính

struct RaftGroup {
    term:         u64,   // nhiệm kỳ — tăng mỗi lần bầu lại
    leader_id:    NodeId,
    // ĐA SỐ, không phải tất cả. 5 nút ⇒ cần 3 ⇒ chịu được mất 2.
    // Lý do toán học khiến nó ĐÚNG: hai tập đa số bất kỳ của cùng một cụm
    // LUÔN giao nhau, nên không thể có hai thủ lĩnh cùng nhiệm kỳ được đa số
    // bầu — nút chung đó không bỏ phiếu hai lần.
    //
    // ⚠️ SỐ NÚT CHẴN LÀ LÃNG PHÍ: cụm 4 nút cần đa số 3, tức chịu được mất 1
    // — GIỐNG HỆT cụm 3 nút, mà tốn thêm một máy. Luôn dùng số lẻ.
    quorum_size:  usize,
    commit_index: u64,   // nhật ký đã được đa số xác nhận tới đâu
}

// CAP — phát biểu ĐÚNG, vì nó thường bị nói sai. Không phải "chọn 2 trong 3":
// phân mảnh mạng là thứ XẢY RA VỚI BẠN, không phải thứ bạn chọn.
//   Khi mạng bị phân mảnh, phải chọn giữa NHẤT QUÁN và SẴN SÀNG.
//   Lúc không phân mảnh thì có cả hai.
// Và đây là quyết định NGHIỆP VỤ, khác nhau cho từng loại dữ liệu trong CÙNG
// một ứng dụng: số dư tài khoản cần nhất quán, danh sách đã xem thì không.`,

  schemaCodeEn: `// DURABILITY LIVES IN EXACTLY ONE PLACE: the fsync call.
//
//   1. Write the change record to the LOG  — SEQUENTIAL, fast
//   2. fsync                               — force onto PHYSICAL media
//   3. Report COMMIT success to the client ← exactly here, never earlier
//   4. ONLY THEN write data pages          — random, batched, slow is fine
//
// Before fsync: power cut = transaction lost. After: power cut = replayable.
//
// ⚠️ MANY DRIVES LIE ABOUT fsync: they report "written" while the data sits
// in the drive's own cache, not on the platter. This is the cause of
// "impossible" data-loss incidents. If the hardware lies, EVERY layer above
// — replication, consensus, distributed transactions — lies too, unknowingly.

struct WalSegment {
    start_lsn: u64,
    end_lsn:   u64,
    fsynced:   bool,     // DURABILITY LIVES HERE, nowhere else
}

// MVCC in TWO INTEGERS. There is no lock at all — only integer comparison.
// A row is "visible" to transaction T when: the transaction that created it
// finished BEFORE T, and the transaction that deleted it has not finished
// (or does not exist).
struct TupleVersion {
    xmin: u64,           // the transaction that CREATED this version
    xmax: u64,           // the transaction that DELETED it — 0 means live
    data: Vec<u8>,
}

// The cost of MVCC — the SIXTH appearance of append-only in this roadmap,
// and the cost repeats identically: old versions stay on disk and something
// must clean up later. Three situations where cleanup falls behind:
//   · long-open transactions — ONE hung connection blocks cleanup of EVERY
//     version older than it, enough to bloat an entire database
//   · heavy writes to few rows (a view-counter table)
//   · replicas holding snapshots, blocking cleanup on the primary

struct RaftGroup {
    term:         u64,   // incremented on every election
    leader_id:    NodeId,
    // A MAJORITY, not everyone. 5 nodes ⇒ need 3 ⇒ tolerate losing 2.
    // The mathematical reason it WORKS: any two majority sets of one cluster
    // ALWAYS intersect, so two leaders cannot both win a majority in the same
    // term — the shared node does not vote twice.
    //
    // ⚠️ EVEN NODE COUNTS ARE WASTE: a 4-node cluster needs a majority of 3,
    // tolerating exactly 1 loss — IDENTICAL to 3 nodes, with an extra machine
    // to pay for. Always use odd numbers.
    quorum_size:  usize,
    commit_index: u64,   // how far the log is majority-acknowledged
}

// CAP — stated CORRECTLY, because it is usually stated wrongly. Not "pick 2
// of 3": network partitions HAPPEN TO YOU, they are not something you choose.
//   When the network partitions, choose between CONSISTENCY and AVAILABILITY.
//   When it is not partitioned, you have both.
// And this is a BUSINESS decision, different per data type inside the SAME
// application: account balances need consistency, recently-viewed lists do not.`,
  schemaLang: 'rust',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Nhật ký ghi trước, và biết chính xác độ bền nằm ở đâu',
      titleEn: 'Write-ahead logging, and knowing exactly where durability lives',
      description:
        'Ghi dữ liệu vào đúng vị trí trên đĩa là ghi ngẫu nhiên, chậm. Ghi tuần tự vào nhật ký trước rồi sắp xếp lại sau — cùng ý tưởng với message broker. COMMIT trả về thành công đúng thời điểm fsync trả về, không sớm hơn. Mọi tầng bên trên đều xây trên bảo đảm đó, nên nếu phần cứng nói dối về fsync thì mọi tầng đều nói dối theo mà không biết.',
      descriptionEn:
        'Writing data to its proper disk location is a slow random write. Write sequentially to a log first and rearrange later — the same idea as the message broker. COMMIT returns success exactly when fsync returns, never earlier. Every layer above builds on that guarantee, so if the hardware lies about fsync, every layer lies too without knowing.',
    },
    {
      phase: 'BACKEND',
      title: 'MVCC: hai số nguyên thay cho toàn bộ hệ thống khoá',
      titleEn: 'MVCC: two integers instead of an entire locking system',
      description:
        'Khoá để tránh đọc dữ liệu dở dang là đúng và khiến hệ thống không dùng được — một truy vấn báo cáo 30 giây chặn mọi thao tác ghi. Thay vào đó: đừng sửa tại chỗ, tạo phiên bản mới. Một dòng hiển thị với giao dịch T khi giao dịch tạo ra nó kết thúc trước T và giao dịch xoá nó chưa kết thúc. Không có khoá nào — chỉ là so sánh số.',
      descriptionEn:
        'Locking to avoid reading half-written data is correct and makes the system unusable — a 30-second report blocks every write. Instead: do not modify in place, create a new version. A row is visible to transaction T when its creator finished before T and its deleter has not finished. No locks at all — only integer comparison.',
    },
    {
      phase: 'BACKEND',
      title: 'Cái giá của MVCC: bước dọn, và ba cách nó tụt lại',
      titleEn: 'The cost of MVCC: cleanup, and three ways it falls behind',
      description:
        'Lần thứ sáu nguyên tắc chỉ-ghi-thêm xuất hiện trong lộ trình, và cái giá lặp lại: phiên bản cũ vẫn nằm trên đĩa. Ba sự cố thật: một giao dịch mở lâu (kể cả kết nối treo) chặn dọn MỌI phiên bản cũ hơn nó và đủ làm phình cả database; ghi rất nhiều vào ít dòng sinh phiên bản nhanh hơn tốc độ dọn; và bản sao giữ ảnh chụp có thể chặn dọn ở bản chính.',
      descriptionEn:
        'The sixth appearance of append-only, with the cost repeating: old versions remain on disk. Three real incidents: one long-open transaction (even a hung connection) blocks cleanup of EVERY older version and can bloat a whole database; heavy writes to few rows generate versions faster than cleanup; and replicas holding snapshots can block cleanup on the primary.',
    },
    {
      phase: 'BACKEND',
      title: 'B-tree so với LSM: cùng một ràng buộc phần cứng, hai lời giải',
      titleEn: 'B-tree versus LSM: one hardware constraint, two answers',
      description:
        'B-tree tìm đúng chỗ rồi sửa trang (ghi ngẫu nhiên, khuếch đại ghi thấp, đọc nhanh); LSM ghi thêm vào bộ đệm rồi xả tuần tự (khuếch đại ghi cao vì gộp tầng, đọc phải hỏi nhiều tầng). Nhận xét đáng giá hơn cả bảng so sánh: cấu trúc phân đoạn bất biến rồi gộp của LSM CHÍNH LÀ thứ đã gặp ở công cụ tìm kiếm — ba loại hệ thống hội tụ về một thiết kế vì cùng một ràng buộc.',
      descriptionEn:
        'B-trees find the right place and modify a page (random writes, low write amplification, fast reads); LSM trees append to a buffer and flush sequentially (high write amplification from compaction, reads consulting several levels). Worth more than the table: the immutable-segments-then-compact structure of LSM IS what you met in the search engine — three system classes converging on one design from one constraint.',
    },
    {
      phase: 'BACKEND',
      title: 'Raft: đa số, và vì sao số nút chẵn là lãng phí',
      titleEn: 'Raft: majorities, and why even node counts are waste',
      description:
        'Ba ý tưởng: chờ ĐA SỐ chứ không phải tất cả (5 nút cần 3, chịu mất 2); hai tập đa số bất kỳ luôn giao nhau nên không thể có hai thủ lĩnh cùng nhiệm kỳ; và nhật ký là nguồn sự thật, trạng thái là kết quả phát lại nhật ký. Hệ quả thực tế: cụm 4 nút cần đa số 3 nên chỉ chịu được mất 1 — giống hệt cụm 3 nút mà tốn thêm một máy.',
      descriptionEn:
        'Three ideas: wait for a MAJORITY not everyone (5 nodes need 3, tolerating 2 losses); any two majorities intersect so two leaders cannot share a term; and the log is the source of truth with state as its replay. The practical consequence: a 4-node cluster needs a majority of 3 and tolerates exactly 1 loss — identical to 3 nodes with an extra machine to pay for.',
    },
    {
      phase: 'BACKEND',
      title: 'CAP phát biểu đúng, và chọn theo TỪNG LOẠI dữ liệu',
      titleEn: 'CAP stated correctly, and chosen PER DATA TYPE',
      description:
        '"Chọn 2 trong 3" gây hiểu nhầm vì nó gợi ý bạn có thể bỏ chịu phân mảnh — nhưng phân mảnh mạng là thứ XẢY RA với bạn. Phát biểu đúng: khi mạng phân mảnh thì phải chọn giữa nhất quán và sẵn sàng; lúc bình thường thì có cả hai. Và đừng tuyên bố cả hệ thống là CP hay AP — số dư tài khoản cần nhất quán, danh sách sản phẩm đã xem thì không.',
      descriptionEn:
        '"Pick 2 of 3" misleads because it implies declining partition tolerance — but partitions HAPPEN to you. Stated correctly: when partitioned, choose between consistency and availability; when healthy, you have both. And do not declare a whole system CP or AP — account balances need consistency, recently-viewed lists do not.',
    },
    {
      phase: 'BACKEND',
      title: 'Bộ lập kế hoạch: ba lý do nó chọn sai',
      titleEn: 'The planner: three reasons it chooses badly',
      description:
        'Chênh lệch giữa kế hoạch tốt nhất và tệ nhất có thể là hàng nghìn lần. Nó chọn sai vì: thống kê cũ (vừa nạp triệu dòng chưa phân tích lại), cột tương quan (WHERE thành_phố AND mã_vùng thực chất là một điều kiện nhưng nó nhân hai độ chọn lọc), và hàm tự viết không có thống kê. Bài học: EXPLAIN ANALYZE cho thấy CẢ ước lượng lẫn số thật — lệch nhau nhiều bậc là đã tìm ra nguyên nhân.',
      descriptionEn:
        'The gap between best and worst plan can be thousands of times. It chooses badly from: stale statistics (a million rows loaded without reanalysing), correlated columns (WHERE city AND area_code is really one condition but it multiplies two selectivities), and custom functions with no statistics. The lesson: EXPLAIN ANALYZE shows BOTH estimate and actual — orders of magnitude apart is your answer.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cắt điện thật và chia mạng thật',
      titleEn: 'Verify with real power cuts and real partitions',
      description:
        'Cắt điện đột ngột (không phải tắt máy êm) giữa lúc ghi — mọi giao dịch đã COMMIT phải còn nguyên. Chạy công cụ kiểm fsync trên chính phần cứng của bạn để xác nhận ổ không nói dối. Cô lập 2 nút khỏi cụm 5: nhóm 3 tiếp tục phục vụ, nhóm 2 TỪ CHỐI ghi. Chia 2+3 rồi nối lại: không được có dữ liệu phân kỳ.',
      descriptionEn:
        'Cut power abruptly (not a clean shutdown) mid-write — every committed transaction must survive. Run an fsync verification tool on your own hardware to confirm the drive is not lying. Isolate 2 nodes from a cluster of 5: the 3-node side keeps serving, the 2-node side REFUSES writes. Split 2+3 and rejoin: no divergent data is permitted.',
    },
  ],

  features: [
    { title: 'Công cụ lưu trữ có nhật ký ghi trước', titleEn: 'A storage engine with write-ahead logging', description: 'Phục hồi sau sự cố bằng cách phát lại nhật ký, có điểm kiểm tra.', descriptionEn: 'Crash recovery by log replay, with checkpoints.', status: 'PLANNED' },
    { title: 'MVCC không dùng khoá cho người đọc', titleEn: 'Lock-free reads via MVCC', description: 'Hai số nguyên xmin/xmax quyết định phiên bản nào hiển thị.', descriptionEn: 'Two integers, xmin and xmax, decide which version is visible.', status: 'PLANNED' },
    { title: 'Chỉ mục B-tree và công cụ LSM', titleEn: 'B-tree indexes and an LSM engine', description: 'Cả hai để đo được khuếch đại ghi và đọc trên cùng tải.', descriptionEn: 'Both, so write and read amplification can be measured on identical load.', status: 'PLANNED' },
    { title: 'Đồng thuận Raft', titleEn: 'Raft consensus', description: 'Bầu thủ lĩnh, sao chép nhật ký, xác nhận theo đa số.', descriptionEn: 'Leader election, log replication, majority acknowledgement.', status: 'PLANNED' },
    { title: 'Bộ lập kế hoạch dựa trên chi phí', titleEn: 'A cost-based query planner', description: 'Thống kê cột, ước lượng chi phí, và EXPLAIN so ước lượng với thực tế.', descriptionEn: 'Column statistics, cost estimation, and EXPLAIN comparing estimates to actuals.', status: 'PLANNED' },
    { title: 'Phân mảnh và định tuyến truy vấn', titleEn: 'Sharding and query routing', description: 'Đẩy phép lọc xuống mảnh, gom kết quả ở nút điều phối.', descriptionEn: 'Push filters down to shards, gather at the coordinator.', status: 'PLANNED' },
    { title: 'Tiến trình dọn phiên bản cũ', titleEn: 'A version cleanup process', description: 'Có cảnh báo khi giao dịch mở lâu đang chặn việc dọn.', descriptionEn: 'With alerts when a long-open transaction is blocking cleanup.', status: 'PLANNED' },
    { title: 'Bộ kiểm chứng kiểu Jepsen', titleEn: 'A Jepsen-style verification suite', description: 'Sinh lịch trình đồng thời ngẫu nhiên, chia mạng, kiểm bất biến.', descriptionEn: 'Random concurrent schedules, injected partitions, invariant checks.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Designing Data-Intensive Applications (Kleppmann)', titleEn: 'Designing Data-Intensive Applications (Kleppmann)', url: 'https://dataintensive.net/', type: 'LINK', description: 'Cuốn sách nên đọc trước cả lộ trình cấp 4-5. Chương về sao chép và giao dịch là bản đồ cho dự án này.', descriptionEn: 'The book to read before the whole of levels 4–5. Its replication and transaction chapters map this project.' },
    { title: 'In Search of an Understandable Consensus Algorithm (Raft)', titleEn: 'In Search of an Understandable Consensus Algorithm (Raft)', url: 'https://raft.github.io/raft.pdf', type: 'PDF', description: 'Bài báo gốc, viết ra với mục tiêu rõ ràng là ĐỦ DỄ HIỂU để cài đặt đúng.', descriptionEn: 'The original paper, written with the explicit goal of being understandable enough to implement correctly.' },
    { title: 'PostgreSQL — Internals documentation', titleEn: 'PostgreSQL — Internals documentation', url: 'https://www.postgresql.org/docs/current/internals.html', type: 'LINK', description: 'Bố cục trang, MVCC, WAL, bộ lập kế hoạch — mô tả bởi chính hệ thống bạn đang mô phỏng.', descriptionEn: 'Page layout, MVCC, WAL and the planner — described by the system you are modelling.' },
    { title: 'Jepsen — Distributed systems safety analysis', titleEn: 'Jepsen — Distributed systems safety analysis', url: 'https://jepsen.io/analyses', type: 'LINK', description: 'Cách người ta CHỨNG MINH một database vi phạm bảo đảm của chính nó. Đọc trước khi tin bất kỳ tài liệu quảng cáo nào.', descriptionEn: 'How people PROVE a database violates its own guarantees. Read before trusting any marketing page.' },
    { title: 'Please stop calling databases CP or AP (Kleppmann)', titleEn: 'Please stop calling databases CP or AP (Kleppmann)', url: 'https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html', type: 'LINK', description: 'Vì sao cách nói "chọn 2 trong 3" gây hiểu nhầm, và phát biểu đúng là gì.', descriptionEn: 'Why "pick 2 of 3" misleads, and what the correct statement is.' },
  ],

  coreKnowledge: [
    { vi: 'Nhật ký ghi trước và ngữ nghĩa chính xác của độ bền', en: 'Write-ahead logging and the precise semantics of durability' },
    { vi: 'MVCC: đọc không khoá, và món nợ dọn dẹp đi kèm', en: 'MVCC: lock-free reads, and the cleanup debt they create' },
    { vi: 'B-tree, cây LSM, và khuếch đại đọc/ghi', en: 'B-trees, LSM trees, and read/write amplification' },
    { vi: 'Thuật toán đồng thuận: đa số, nhiệm kỳ, và tính an toàn của bầu chọn', en: 'Consensus algorithms: quorums, terms, and election safety' },
    { vi: 'Định lý CAP phát biểu đúng, và chọn theo từng loại dữ liệu', en: 'The CAP theorem stated correctly, chosen per data type' },
    { vi: 'Tối ưu truy vấn: thống kê, ước lượng chi phí, và vì sao ước lượng sai', en: 'Query optimisation: statistics, cost estimation, and why estimates go wrong' },
    { vi: 'Mối liên hệ giữa hành vi phần cứng và bảo đảm phần mềm', en: 'The link between hardware behaviour and software guarantees' },
    { vi: 'Kiểm chứng hệ phân tán bằng cách chủ động gây lỗi', en: 'Verifying distributed systems by deliberately injecting failure' },
  ],

  portfolioBonus: [
    { vi: 'Video cắt điện thật giữa lúc ghi và chứng minh không mất giao dịch đã COMMIT', en: 'A video of a real power cut mid-write proving no committed transaction was lost' },
    { vi: 'Kết quả chạy công cụ kiểm fsync trên phần cứng thật', en: 'Results from running an fsync verification tool on real hardware' },
    { vi: 'Bộ kiểm kiểu Jepsen tự viết, có chia mạng và báo cáo vi phạm bất biến', en: 'A hand-built Jepsen-style suite with partitions and invariant violation reports' },
    { vi: 'So khuếch đại ghi B-tree và LSM trên cùng tải, kèm giải thích', en: 'Write amplification compared between B-tree and LSM on identical load, explained' },
    { vi: 'Mục README giải thích CAP đúng cách, kèm ví dụ từ chính hệ thống', en: 'A README explaining CAP correctly, with examples from your own system' },
  ],

  completionOutcomes: [
    { vi: 'Hiểu database ở mức tự dựng lại được, không chỉ mức sử dụng', en: 'Understand databases well enough to rebuild one, not merely use one' },
    { vi: 'Truy được một bảo đảm phần mềm xuống tận hành vi phần cứng', en: 'Trace a software guarantee down to hardware behaviour' },
    { vi: 'Cài đặt một thuật toán phân tán và chứng minh nó đúng bằng thí nghiệm', en: 'Implement a distributed algorithm and demonstrate its correctness experimentally' },
    { vi: 'Chẩn đoán được truy vấn chậm bằng số liệu thay vì bằng phỏng đoán', en: 'Diagnose slow queries with measurements rather than guesses' },
    { vi: 'Đọc và đánh giá được tuyên bố về độ tin cậy của các hệ thống khác', en: 'Read and evaluate other systems\' reliability claims' },
  ],

  bodyMdx,
  bodyMdxEn,
};
