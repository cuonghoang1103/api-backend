/**
 * Case-study 4.3 — Distributed Message Broker (Kafka-like).
 *
 * Uber-like USED Kafka as a black box; this opens it. The surprise is that
 * there is nothing clever inside — just an appended file — and the whole
 * study is about why that beats every smart structure, plus what it costs to
 * stay trustworthy when machines die (high watermark, ISR, unclean election).
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./distributed-message-broker-kafka-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./distributed-message-broker-kafka-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'distributed-message-broker-kafka-like',
  title: 'Distributed Message Broker (Kafka-like)',
  titleEn: 'Distributed Message Broker (Kafka-like)',
  description:
    'Tự viết message broker phân tán: nhật ký chỉ ghi thêm, phân vùng, nhân bản, nhóm tiêu thụ. Điều bất ngờ nhất khi mở hộp đen ra là bên trong KHÔNG có gì phức tạp — chỉ là một file được ghi thêm vào cuối. Cả dự án là hiểu vì sao thứ đơn giản đến vậy đánh bại mọi thiết kế thông minh.',
  descriptionEn:
    'Build a distributed message broker: append-only logs, partitions, replication, consumer groups. The most surprising thing on opening the black box is that there is NOTHING clever inside — just a file being appended to. The whole study is why that beats every smart design.',
  techStack: [
    'Java 21', 'Netty', 'Go', 'NIO / zero-copy', 'TCP binary protocol',
    'etcd', 'LZ4', 'Snappy', 'Docker', 'Kubernetes',
  ],
  role: 'Backend / hệ phân tán (một người)',
  roleEn: 'Backend / distributed systems (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/distributed-message-broker-kafka-like.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// KHÔNG có schema database ở đây — và đó chính là bài học. Toàn bộ
// "cơ sở dữ liệu" của hệ thống này là MỘT FILE ĐƯỢC GHI THÊM VÀO CUỐI.
//
// Đĩa chậm ở TÌM KIẾM NGẪU NHIÊN, không chậm ở GHI TUẦN TỰ:
//   ghi ngẫu nhiên ổ cơ  ~100 thao tác/giây
//   ghi tuần tự  ổ cơ    ~100 MB/giây
//   ghi ngẫu nhiên SSD   ~50.000 thao tác/giây
//   ghi tuần tự  SSD     ~500 MB/giây
// Ghi tuần tự trên ổ CƠ có thể nhanh hơn ghi ngẫu nhiên trên SSD.

// Bố cục trên đĩa của MỘT phân vùng:
//   00000000000000000000.log     ← phân đoạn ĐÓNG, chỉ đọc
//   00000000000000000000.index   ← chỉ mục THƯA, mỗi ~4KB một mốc
//   00000000000000005000.log     ← phân đoạn ĐANG GHI
//   00000000000000005000.index
//
// Chia phân đoạn để còn XOÁ được: bỏ dữ liệu cũ là unlink một file,
// không phải viết lại nhật ký khổng lồ.
// Chỉ mục THƯA vì nhật ký được đọc TUẦN TỰ là chính — chỉ mục đầy đủ
// tốn RAM cho một khả năng hiếm dùng.

class LogSegment {
    long   baseOffset;      // độ lệch của bản ghi đầu tiên trong phân đoạn
    long   sizeBytes;
    boolean active;         // CHỈ phân đoạn cuối được ghi

    // Định dạng bản ghi trên ĐĨA và trên ĐƯỜNG TRUYỀN phải GIỐNG HỆT NHAU.
    // Nghe nhàm chán, nhưng chính nó cho phép transferTo() đẩy thẳng
    // từ bộ đệm nhân ra socket — dữ liệu KHÔNG BAO GIỜ vào tiến trình:
    //   fileChannel.transferTo(position, count, socketChannel);
    // Có một bước biến đổi định dạng là mất luôn tối ưu lớn nhất của
    // hệ thống.
}

// Trạng thái nhân bản của một phân vùng — nơi dữ liệu THẬT SỰ bị mất.
class PartitionState {
    long logEndOffset;      // bản chính đã ghi tới đây
    // Bên nhận CHỈ được đọc tới đây: độ lệch mà MỌI bản sao đồng bộ đều có.
    // Cho đọc vượt mốc này nghĩa là bản chính chết sẽ khiến bên nhận đã
    // đọc một bản ghi mà sau đó KHÔNG CÒN TỒN TẠI.
    long highWatermark;
    long logStartOffset;    // đã xoá tới đâu

    Set<Integer> inSyncReplicas;

    // ⚠️ acks=all MỘT MÌNH NÓ KHÔNG ĐỦ.
    // Nếu tập đồng bộ co lại còn đúng một thành viên (chính bản chính),
    // thì "mọi bản sao đồng bộ đã ghi" = "bản chính đã ghi" — bạn tưởng
    // an toàn nhưng thực tế đang ở acks=1. Phải đặt ngưỡng này, và khi
    // không đủ thì TỪ CHỐI GHI thay vì âm thầm hạ mức bảo đảm.
    int minInSyncReplicas;
}

// Ghi nhận độ lệch phải làm SAU khi xử lý xong. Ghi nhận trước rồi mới
// xử lý nghĩa là tiến trình chết ở giữa sẽ BỎ QUA bản ghi vĩnh viễn —
// đổi trùng lặp lấy mất mát, gần như luôn là đánh đổi sai.`,

  schemaCodeEn: `// There is NO database schema here — and that is the lesson. This system's
// entire "database" is ONE FILE THAT GETS APPENDED TO.
//
// Disks are slow at RANDOM SEEKS, not at SEQUENTIAL WRITES:
//   random writes, spinning disk  ~100 operations/second
//   sequential writes, spinning   ~100 MB/second
//   random writes, SSD            ~50,000 operations/second
//   sequential writes, SSD        ~500 MB/second
// Sequential writes on a SPINNING disk can beat random writes on SSD.

// On-disk layout of ONE partition:
//   00000000000000000000.log     ← CLOSED segment, read-only
//   00000000000000000000.index   ← SPARSE index, one marker per ~4KB
//   00000000000000005000.log     ← ACTIVE segment
//   00000000000000005000.index
//
// Segmented so deletion is possible: dropping old data is an unlink,
// not a rewrite of an enormous log.
// SPARSE because the log is read SEQUENTIALLY almost always — a dense
// index spends RAM on a case that hardly ever arises.

class LogSegment {
    long   baseOffset;      // offset of the first record in this segment
    long   sizeBytes;
    boolean active;         // ONLY the last segment is written to

    // The record format on DISK and on the WIRE must be IDENTICAL.
    // It sounds boring, but it is what allows transferTo() to push
    // straight from the kernel buffer to the socket — data NEVER enters
    // the process:
    //   fileChannel.transferTo(position, count, socketChannel);
    // Introduce one format conversion and you lose the system's single
    // largest optimisation.
}

// Replication state of a partition — where data ACTUALLY gets lost.
class PartitionState {
    long logEndOffset;      // how far the leader has written
    // Consumers may ONLY read to here: the offset every in-sync replica
    // holds. Serving past it means a leader death leaves consumers having
    // read a record that afterwards NO LONGER EXISTS.
    long highWatermark;
    long logStartOffset;    // how far deletion has reached

    Set<Integer> inSyncReplicas;

    // ⚠️ acks=all IS NOT SUFFICIENT ON ITS OWN.
    // If the in-sync set shrinks to exactly one member (the leader), then
    // "all in-sync replicas have written" = "the leader has written" — you
    // believe you are safe while running at acks=1. Set this minimum, and
    // when it cannot be met REFUSE THE WRITE rather than quietly
    // downgrading the guarantee.
    int minInSyncReplicas;
}

// Offsets must be committed AFTER processing. Committing first and
// processing after means a process death in between SKIPS the record
// permanently — trading duplication for loss, almost always wrong.`,
  schemaLang: 'java',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Nhật ký chỉ ghi thêm: hiểu vì sao đơn giản lại nhanh',
      titleEn: 'The append-only log: understanding why simple is fast',
      description:
        'Trực giác nói đĩa chậm nên cần cấu trúc thông minh. Sai: đĩa chậm ở tìm kiếm ngẫu nhiên, không chậm ở ghi tuần tự — chênh tới ba bậc độ lớn, tới mức ghi tuần tự trên ổ cơ có thể nhanh hơn ghi ngẫu nhiên trên SSD. Cấu trúc chỉ biết ghi thêm vào cuối vì thế đánh bại mọi cây cân bằng.',
      descriptionEn:
        'Intuition says disks are slow so you need clever structures. Wrong: disks are slow at random seeks, not sequential writes — a three-order-of-magnitude gap, to the point that sequential writes on a spinning disk can beat random writes on SSD. A structure that only appends therefore beats every balanced tree.',
    },
    {
      phase: 'BACKEND',
      title: 'Phân đoạn và chỉ mục thưa',
      titleEn: 'Segments and sparse indexes',
      description:
        'Chia nhật ký thành nhiều file để xoá dữ liệu cũ chỉ là unlink, không phải viết lại file khổng lồ. Chỉ mục thưa — mỗi vài nghìn bản ghi một mốc — vì mô hình đọc chủ yếu là tuần tự; chỉ mục đầy đủ tốn RAM cho khả năng hiếm dùng. Tìm một độ lệch cụ thể: nhảy tới mốc gần nhất rồi đọc tuần tự phần còn lại.',
      descriptionEn:
        'Split the log across files so removing old data is an unlink rather than rewriting an enormous file. Index sparsely — a marker every few thousand records — because reads are overwhelmingly sequential; a dense index spends RAM on a rare case. Finding a specific offset: jump to the nearest marker and read sequentially from there.',
    },
    {
      phase: 'BACKEND',
      title: 'Dựa vào bộ đệm trang, và sao chép không qua tầng người dùng',
      titleEn: 'Rely on the page cache, and transfer without copying',
      description:
        'Đừng dựng tầng đệm riêng trong tiến trình: dữ liệu vừa ghi gần như chắc chắn còn trong bộ đệm trang khi bên nhận đọc tới vài mili giây sau, nên "đọc từ đĩa" thực tế không chạm đĩa. Tự dựng đệm nghĩa là cùng dữ liệu nằm hai bản trong RAM và bộ thu gom rác phải quản một đống đối tượng. Kèm theo: giữ định dạng đĩa và đường truyền GIỐNG HỆT để dùng được transferTo.',
      descriptionEn:
        'Do not build an in-process cache: data just written is almost certainly still in the page cache when a consumer reads it milliseconds later, so "reading from disk" never touches disk. Your own cache means the same data twice in RAM and a garbage collector managing a mountain of objects. Alongside: keep disk and wire formats IDENTICAL so transferTo works.',
      codeBlock:
        '// Đường thông thường: đĩa → đệm nhân → đệm ứng dụng → socket → mạng\n'
        + 'byte[] buf = new byte[8192];\n'
        + 'while (in.read(buf) > 0) out.write(buf);   // dữ liệu đi VÒNG qua tiến trình\n'
        + '\n'
        + '// transferTo: đĩa → đệm nhân → mạng. KHÔNG vào tiến trình.\n'
        + 'fileChannel.transferTo(position, count, socketChannel);',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'Mốc nước cao: chỉ cho đọc thứ đã an toàn',
      titleEn: 'The high watermark: serve only what is safe',
      description:
        'Cho bên nhận đọc ngay khi bản chính ghi xong thì bản chính chết trước khi sao chép kịp sẽ khiến bên nhận đã đọc một bản ghi mà sau đó không còn tồn tại — dạng mất dữ liệu rất khó gỡ. Mốc nước cao chỉ tiến lên khi MỌI bản sao đồng bộ đã có bản ghi đó, nên bản sao nào lên thay cũng đủ dữ liệu.',
      descriptionEn:
        'Serving records the instant the leader writes them means a leader death before replication leaves consumers having read something that afterwards does not exist — a particularly nasty loss. The high watermark advances only once EVERY in-sync replica holds the record, so whichever replica takes over already has it.',
    },
    {
      phase: 'BACKEND',
      title: 'Tập bản sao đồng bộ, và vì sao acks=all có thể nói dối',
      titleEn: 'The in-sync set, and why acks=all can lie',
      description:
        'Bản sao tụt lại quá ngưỡng bị loại khỏi tập đồng bộ và không còn tính vào acks=all. Nếu tập co lại còn đúng một thành viên là chính bản chính, thì acks=all trên thực tế thành acks=1 — bạn tưởng an toàn mà không hề an toàn. Phải đặt ngưỡng tối thiểu và TỪ CHỐI GHI khi không đủ, thay vì âm thầm hạ mức bảo đảm.',
      descriptionEn:
        'A replica falling too far behind leaves the in-sync set and stops counting toward acks=all. If the set shrinks to exactly one member — the leader — then acks=all is effectively acks=1, and you believe you are safe while you are not. Set a minimum and REFUSE WRITES below it rather than quietly downgrading the guarantee.',
    },
    {
      phase: 'BACKEND',
      title: 'Bầu chọn thủ lĩnh: chọn giữa sẵn sàng và toàn vẹn',
      titleEn: 'Leader election: choosing between availability and integrity',
      description:
        'Khi mọi bản sao đồng bộ đều chết, bầu một bản sao NGOÀI tập lên là chọn tiếp tục phục vụ và mất dữ liệu; không bầu là dừng hẳn và giữ nguyên vẹn. Không có lựa chọn thứ ba, và hệ thống nào tỏ ra có thì đang giấu đánh đổi ở chỗ khác. Điều quan trọng: phải là lựa chọn TƯỜNG MINH, không phải mặc định âm thầm.',
      descriptionEn:
        'When every in-sync replica dies, electing one from OUTSIDE the set chooses to keep serving and lose data; refusing chooses to halt and stay intact. There is no third option, and any system appearing to offer one hides the trade elsewhere. What matters: it must be an EXPLICIT choice, never a silent default.',
    },
    {
      phase: 'BACKEND',
      title: 'Nhóm tiêu thụ và vòng lặp chia lại',
      titleEn: 'Consumer groups and the rebalance loop',
      description:
        'Số phân vùng là TRẦN của độ song song — 10 phân vùng thì thành viên thứ 11 ngồi không. Vòng lặp chia lại là sự cố đặc trưng: xử lý một lô lâu quá hạn nhịp tim, bị coi là chết, kích hoạt chia lại, chia lại làm mọi người chậm thêm, thêm người quá hạn. Chữa bằng nhịp tim ở luồng riêng, lô nhỏ hơn, chia lại tăng dần, và định danh thành viên cố định.',
      descriptionEn:
        'Partition count is the CEILING on parallelism — with 10 partitions the 11th member idles. The rebalance loop is the signature failure: a batch takes longer than the heartbeat deadline, the member is presumed dead, a rebalance triggers, everyone slows, more members miss deadlines. Fix with heartbeats on a separate thread, smaller batches, incremental rebalancing and stable member ids.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách giết bản chính giữa lúc đang ghi',
      titleEn: 'Verify by killing the leader mid-write',
      description:
        'Giết bản chính giữa lúc ghi: bên gửi phải tự chuyển sang thủ lĩnh mới và KHÔNG mất bản ghi nào đã được xác nhận. Làm một bản sao chậm hẳn: nó rời tập đồng bộ mà ghi vẫn tiếp tục nếu còn đủ ngưỡng. Hạ ngưỡng tối thiểu xuống không thoả được: ghi phải bị TỪ CHỐI. Và kiểm chủ đề nén: 1 triệu bản ghi cho 1.000 khoá, sau nén còn đúng 1.000.',
      descriptionEn:
        'Kill the leader mid-write: the producer must fail over and NO acknowledged record may be lost. Throttle one replica badly: it leaves the in-sync set while writes continue if the minimum still holds. Lower the minimum below what is achievable: writes must be REFUSED. And test compaction: 1 million records across 1,000 keys leaves exactly 1,000.',
    },
  ],

  features: [
    { title: 'Nhật ký chỉ ghi thêm, chia phân đoạn', titleEn: 'Segmented append-only log', description: 'Chỉ mục thưa theo độ lệch, xoá dữ liệu cũ bằng unlink file.', descriptionEn: 'A sparse offset index; old data removed by unlinking files.', status: 'PLANNED' },
    { title: 'Chủ đề chia phân vùng', titleEn: 'Topics split into partitions', description: 'Phân vùng vừa là đơn vị song song vừa là phạm vi đảm bảo thứ tự.', descriptionEn: 'A partition is both the unit of parallelism and the scope of ordering.', status: 'PLANNED' },
    { title: 'Nhân bản với mốc nước cao', titleEn: 'Replication with a high watermark', description: 'Bên nhận chỉ đọc được thứ đã có ở mọi bản sao đồng bộ.', descriptionEn: 'Consumers only see what every in-sync replica already holds.', status: 'PLANNED' },
    { title: 'Bầu chọn thủ lĩnh có ngưỡng đa số', titleEn: 'Quorum-based leader election', description: 'Bầu ngoài tập đồng bộ là lựa chọn tường minh, không phải mặc định.', descriptionEn: 'Electing outside the in-sync set is an explicit choice, never a default.', status: 'PLANNED' },
    { title: 'Nhóm tiêu thụ, chia lại tăng dần', titleEn: 'Consumer groups with incremental rebalancing', description: 'Chỉ chuyển phân vùng cần chuyển thay vì thu hồi toàn bộ.', descriptionEn: 'Move only the partitions that must move rather than revoking everything.', status: 'PLANNED' },
    { title: 'Lưu giữ theo thời gian và theo dung lượng', titleEn: 'Time- and size-based retention', description: 'Bỏ phân đoạn quá hạn bằng thao tác xoá file, không viết lại.', descriptionEn: 'Expired segments dropped by file removal, never by rewriting.', status: 'PLANNED' },
    { title: 'Nén theo khoá', titleEn: 'Key compaction', description: 'Giữ bản ghi cuối của mỗi khoá — chủ đề thành bảng trạng thái phát lại được.', descriptionEn: 'Keep the last record per key — the topic becomes a replayable state table.', status: 'PLANNED' },
    { title: 'Giao thức nhị phân có gộp lô và nén', titleEn: 'A binary protocol with batching and compression', description: 'Định dạng đĩa và đường truyền giống hệt nhau để dùng được transferTo.', descriptionEn: 'Identical disk and wire formats so zero-copy transfer works.', status: 'PLANNED' },
    { title: 'Bên gửi có tính lặp lại được', titleEn: 'Idempotent producers', description: 'Đánh số thứ tự để máy chủ tự loại bản trùng khi bên gửi gửi lại.', descriptionEn: 'Sequence numbers let the broker discard duplicates when producers resend.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'The Log: What every software engineer should know about real-time data', titleEn: 'The Log: What every software engineer should know about real-time data', url: 'https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying-abstraction', type: 'LINK', description: 'Jay Kreps giải thích vì sao nhật ký là trừu tượng nền của gần như mọi hệ phân tán. Đọc trước tất cả.', descriptionEn: 'Jay Kreps on why the log is the underlying abstraction of nearly every distributed system. Read this first.' },
    { title: 'Kafka: a Distributed Messaging System for Log Processing', titleEn: 'Kafka: a Distributed Messaging System for Log Processing', url: 'https://notes.stephenholiday.com/Kafka.pdf', type: 'PDF', description: 'Bài báo gốc — ngắn, dễ đọc, và cho thấy thiết kế ban đầu đơn giản tới mức nào.', descriptionEn: 'The original paper — short, readable, and revealing how simple the initial design was.' },
    { title: 'Kafka — Replication design', titleEn: 'Kafka — Replication design', url: 'https://kafka.apache.org/documentation/#design_replicatedlog', type: 'LINK', description: 'Tập bản sao đồng bộ, mốc nước cao, bầu chọn không sạch — phần khó nhất của dự án này.', descriptionEn: 'In-sync replicas, high watermark and unclean election — the hardest part of this project.' },
    { title: 'Efficient data transfer through zero copy (IBM Developer)', titleEn: 'Efficient data transfer through zero copy (IBM Developer)', url: 'https://developer.ibm.com/articles/j-zerocopy/', type: 'LINK', description: 'Giải thích transferTo bỏ qua bao nhiêu lần sao chép và chuyển ngữ cảnh.', descriptionEn: 'How many copies and context switches transferTo actually eliminates.' },
    { title: 'Jepsen — Kafka analyses', titleEn: 'Jepsen — Kafka analyses', url: 'https://jepsen.io/analyses', type: 'LINK', description: 'Kiểm chứng độc lập các bảo đảm của hệ phân tán. Đọc để thấy cách người ta CHỨNG MINH một hệ thống mất dữ liệu.', descriptionEn: 'Independent verification of distributed guarantees. Read it to see how people PROVE a system loses data.' },
  ],

  coreKnowledge: [
    { vi: 'Nhật ký chỉ ghi thêm là trừu tượng nền của hệ phân tán hiện đại', en: 'The append-only log as the founding abstraction of modern distributed systems' },
    { vi: 'Đặc tính phần cứng: vì sao tuần tự thắng ngẫu nhiên tới ba bậc độ lớn', en: 'Hardware reality: why sequential beats random by three orders of magnitude' },
    { vi: 'Bộ đệm trang của hệ điều hành và sao chép không qua tầng người dùng', en: 'The OS page cache and zero-copy transfer' },
    { vi: 'Nhân bản, mốc nước cao, và định nghĩa chính xác của "đã ghi an toàn"', en: 'Replication, high watermarks, and a precise definition of "durably written"' },
    { vi: 'Ngưỡng đa số, bầu chọn, và đánh đổi giữa sẵn sàng và toàn vẹn', en: 'Quorums, elections, and the availability-versus-integrity trade' },
    { vi: 'Phân vùng vừa là đơn vị song song vừa là phạm vi thứ tự', en: 'Partitions as both the unit of parallelism and the scope of ordering' },
    { vi: 'Điều phối nhóm tiêu thụ và vì sao chia lại luôn kéo theo xử lý trùng', en: 'Consumer group coordination and why rebalancing always brings duplicates' },
    { vi: 'Nén theo khoá: biến dòng sự kiện thành bảng trạng thái phát lại được', en: 'Key compaction: turning an event stream into a replayable state table' },
  ],

  portfolioBonus: [
    { vi: 'Số đo thông lượng ở ba mức acks trên cùng phần cứng, giải thích chênh lệch', en: 'Throughput measured at all three acks levels on the same hardware, with the gap explained' },
    { vi: 'Video giết bản chính giữa lúc ghi và chứng minh không mất bản ghi đã xác nhận', en: 'A video killing the leader mid-write, proving no acknowledged record was lost' },
    { vi: 'Thí nghiệm cho thấy acks=all thành acks=1 khi tập đồng bộ co lại', en: 'An experiment showing acks=all degrade to acks=1 as the in-sync set shrinks' },
    { vi: 'So thông lượng có và không có sao chép không qua tầng người dùng', en: 'Throughput compared with and without zero-copy transfer' },
    { vi: 'Đồ thị thời gian dừng khi chia lại: cách cũ so với chia lại tăng dần', en: 'A stall-time graph during rebalancing: eager versus incremental' },
  ],

  completionOutcomes: [
    { vi: 'Hiểu hạ tầng nhắn tin ở mức tự viết lại được, không chỉ mức cấu hình', en: 'Understand messaging infrastructure well enough to rebuild it, not merely configure it' },
    { vi: 'Thiết kế theo đặc tính phần cứng thật thay vì theo trực giác về "thông minh"', en: 'Design around real hardware behaviour rather than intuitions about cleverness' },
    { vi: 'Phát biểu chính xác một bảo đảm về độ bền và chứng minh nó bằng thí nghiệm', en: 'State a durability guarantee precisely and prove it with an experiment' },
    { vi: 'Nhận ra khi một cấu hình đang nói dối về mức an toàn nó cung cấp', en: 'Notice when a configuration is lying about the safety it provides' },
    { vi: 'Đọc hiểu mã nguồn hệ thống phân tán lớn vì đã tự dựng phiên bản nhỏ', en: 'Read large distributed-system source code, having built a small version yourself' },
  ],

  bodyMdx,
  bodyMdxEn,
};
