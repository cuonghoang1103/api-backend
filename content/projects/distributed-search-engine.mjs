/**
 * Case-study 4.2 — Distributed Search Engine (Elasticsearch-like).
 *
 * Job Board USED search; this one opens the box. The lesson that makes it a
 * level-4 project is not the inverted index but distributed IDF: once the
 * index is sharded, a document's score depends on which machine it landed on,
 * and nothing warns you.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./distributed-search-engine.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./distributed-search-engine.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'distributed-search-engine',
  title: 'Distributed Search Engine (Elasticsearch-like)',
  titleEn: 'Distributed Search Engine (Elasticsearch-like)',
  description:
    'Tự viết công cụ tìm kiếm phân tán: chỉ mục ngược có nén, xếp hạng BM25, chia mảnh và nhân bản. Bài học khiến nó thành dự án cấp 4 không phải "chỉ mục ngược là gì" mà là: khi chỉ mục không còn vừa một máy, điểm số của tài liệu bỗng phụ thuộc vào việc nó tình cờ nằm ở máy nào.',
  descriptionEn:
    'Build a distributed search engine: compressed inverted indexes, BM25 ranking, sharding and replication. What makes it a level-4 project is not "what is an inverted index" but this: once the index outgrows one machine, a document\'s score starts depending on which machine it happens to live on.',
  techStack: [
    'Java 21', 'Go', 'gRPC', 'RocksDB', 'etcd', 'BM25', 'Levenshtein automata',
    'Consistent hashing', 'Next.js 15', 'Docker', 'Kubernetes',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'Backend',
  difficulty: 'EXPERT',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/distributed-search-engine.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `// Danh sách đăng — cấu trúc THẬT của chỉ mục ngược, không phải sơ đồ
// "từ → [id]". Cách nó được lưu quyết định toàn bộ tốc độ truy vấn.

class PostingsList {
    // MÃ HOÁ CHÊNH LỆCH: lưu 12, 33, 2, 854 thay vì 12, 45, 47, 901.
    // Số nhỏ hơn ⇒ ít byte hơn khi nén biến độ dài. Với danh sách hàng
    // triệu mục, khoản này là chênh lệch giữa vừa RAM và không vừa.
    int[] docIdDeltas;

    // Cần cho BM25.
    int[] termFrequencies;

    // Cần cho truy vấn CỤM TỪ: "senior backend" phải liền nhau,
    // không phải chỉ cùng xuất hiện đâu đó trong tài liệu.
    int[][] positions;

    // CON TRỎ NHẢY. Truy vấn "quantum AND the" mà duyệt tuần tự cả hai
    // danh sách là đọc hàng triệu mục để lấy vài chục kết quả. Có con trỏ
    // nhảy thì lấy doc tiếp theo ở danh sách NGẮN rồi nhảy thẳng vào
    // danh sách DÀI tại vị trí đó, bỏ qua toàn bộ ở giữa.
    SkipEntry[] skipList;
}

// BM25 — vá hai chỗ sai của TF-IDF.
// k1 chặn tần suất bão hoà: tài liệu chứa từ khoá 100 lần KHÔNG liên quan
//    gấp 100 lần tài liệu chứa 1 lần.
// b  phạt tài liệu dài: bài 10.000 từ tự nhiên chứa mọi từ nhiều hơn bài
//    300 từ, nên nếu không phạt thì nó thắng MỌI truy vấn.
// 1.2 và 0.75 là mặc định của cả ngành, đến từ thực nghiệm trên TREC.
static final double K1 = 1.2, B = 0.75;

double score(int tf, int docLen, double avgDocLen, int docFreq, int totalDocs) {
    // +0.5 ở tử và mẫu: tránh log(0) và tránh giá trị âm khi một từ
    // xuất hiện ở hơn nửa số tài liệu.
    double idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5));
    double norm = tf + K1 * (1 - B + B * docLen / avgDocLen);
    return idf * (tf * (K1 + 1)) / norm;
}

// ⚠️ THAM SỐ totalDocs VÀ docFreq CHÍNH LÀ CÁI BẪY.
// Mỗi mảnh chỉ biết dữ liệu của chính nó, nên hai tài liệu có nội dung
// NHƯ NHAU nằm ở hai mảnh khác nhau sẽ nhận điểm chênh nhau nhiều lần.
// Không có ngoại lệ nào được ném — kết quả chỉ sai thứ tự một cách
// hệ thống. Ba cách xử lý: chia mảnh NGẪU NHIÊN (rẻ nhất, đủ tốt),
// gom thống kê toàn cục định kỳ, hoặc tìm hai pha (đúng nhất, gấp đôi
// số vòng mạng).`,

  schemaCodeEn: `// The postings list — the REAL structure of an inverted index, not the
// "term → [id]" diagram. How it is stored determines all query performance.

class PostingsList {
    // DELTA ENCODING: store 12, 33, 2, 854 instead of 12, 45, 47, 901.
    // Smaller numbers ⇒ fewer bytes under variable-length compression. On
    // million-entry lists this is the difference between fitting in RAM
    // and not.
    int[] docIdDeltas;

    // Needed for BM25.
    int[] termFrequencies;

    // Needed for PHRASE queries: "senior backend" must be adjacent, not
    // merely co-occurring somewhere in the document.
    int[][] positions;

    // SKIP POINTERS. Running "quantum AND the" by walking both lists reads
    // millions of entries to produce a few dozen results. With skip pointers
    // you take the next doc from the SHORT list and jump straight into the
    // LONG one at that position, ignoring everything between.
    SkipEntry[] skipList;
}

// BM25 — patches the two places TF-IDF gets it wrong.
// k1 caps frequency saturation: a document with the term 100 times is NOT
//    100 times more relevant than one with it once.
// b  penalises long documents: a 10,000-word article naturally contains
//    every word more often than a 300-word one, so without a penalty it
//    wins EVERY query.
// 1.2 and 0.75 are the industry defaults, from experiments on TREC.
static final double K1 = 1.2, B = 0.75;

double score(int tf, int docLen, double avgDocLen, int docFreq, int totalDocs) {
    // The +0.5 terms avoid log(0) and negative values when a word appears
    // in more than half the documents.
    double idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5));
    double norm = tf + K1 * (1 - B + B * docLen / avgDocLen);
    return idf * (tf * (K1 + 1)) / norm;
}

// ⚠️ THE totalDocs AND docFreq PARAMETERS ARE THE TRAP.
// Each shard only knows its own data, so two documents with EQUIVALENT
// content on different shards receive scores differing several-fold.
// No exception is thrown — the ordering is simply wrong in a systematic
// way. Three remedies: shard RANDOMLY (cheapest, good enough), gather
// global statistics periodically, or run two-phase search (most correct,
// double the network round trips).`,
  schemaLang: 'java',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Danh sách đăng: cấu trúc thật, mã hoá chênh lệch và con trỏ nhảy',
      titleEn: 'Postings lists: the real structure, delta encoding and skip pointers',
      description:
        'Sơ đồ "từ → [id tài liệu]" đúng nhưng thiếu. Danh sách đăng phải mang cả số lần xuất hiện (để tính BM25) lẫn vị trí trong tài liệu (để truy vấn cụm từ). Hai tối ưu bắt buộc: mã hoá chênh lệch để số nhỏ đi và nén tốt hơn, và con trỏ nhảy để truy vấn AND với từ phổ biến không phải duyệt hàng triệu mục.',
      descriptionEn:
        'The "term → [doc ids]" diagram is correct but incomplete. A postings list must carry term frequency (for BM25) and in-document positions (for phrase queries). Two mandatory optimisations: delta encoding so numbers shrink and compress better, and skip pointers so an AND with a common term does not walk millions of entries.',
    },
    {
      phase: 'BACKEND',
      title: 'BM25 thay TF-IDF: chặn bão hoà và phạt tài liệu dài',
      titleEn: 'BM25 over TF-IDF: saturation capping and length penalties',
      description:
        'TF-IDF sai hai chỗ: tần suất tăng tuyến tính nên tài liệu nhồi từ khoá thắng, và không chuẩn hoá độ dài nên bài 10.000 từ thắng mọi truy vấn. BM25 vá bằng k1 (bão hoà) và b (phạt độ dài). Giá trị mặc định 1.2 và 0.75 đến từ thực nghiệm trên tập TREC chứ không từ suy luận — biết điều đó để không tưởng chúng thiêng liêng.',
      descriptionEn:
        'TF-IDF is wrong twice: linear frequency lets keyword-stuffed documents win, and no length normalisation lets 10,000-word articles win everything. BM25 patches both with k1 (saturation) and b (length penalty). The 1.2/0.75 defaults come from TREC experiments rather than derivation — knowing that stops you treating them as sacred.',
      codeBlock:
        'double idf = Math.log(1 + (totalDocs - docFreq + 0.5) / (docFreq + 0.5));\n'
        + 'double norm = tf + K1 * (1 - B + B * docLen / avgDocLen);\n'
        + 'return idf * (tf * (K1 + 1)) / norm;\n'
        + '\n'
        + '// totalDocs và docFreq chính là chỗ sắp thành vấn đề khi chia mảnh.',
      codeLang: 'java',
    },
    {
      phase: 'BACKEND',
      title: 'IDF phân tán: điểm số phụ thuộc vào việc nằm ở mảnh nào',
      titleEn: 'Distributed IDF: scores depending on which shard you landed on',
      description:
        'Mỗi mảnh chỉ biết docFreq của chính nó. Mảnh tình cờ chứa nhiều bài DevOps sẽ coi "kubernetes" là từ phổ biến và chấm điểm thấp; mảnh khác coi nó hiếm và chấm cao. Hai tài liệu nội dung như nhau chênh nhau bốn lần điểm, không có ngoại lệ nào được ném. Ba cách: chia mảnh ngẫu nhiên, thống kê toàn cục định kỳ, hoặc tìm hai pha — quan trọng là BIẾT mình đang chọn gì.',
      descriptionEn:
        'Each shard knows only its own docFreq. A shard that happens to hold DevOps content treats "kubernetes" as common and scores it low; another treats it as rare and scores it high. Two equivalent documents differ fourfold, and nothing throws. Three options: random sharding, periodic global statistics, or two-phase search — what matters is KNOWING which you chose.',
    },
    {
      phase: 'BACKEND',
      title: 'Phân đoạn bất biến, bia mộ và gộp',
      titleEn: 'Immutable segments, tombstones and merging',
      description:
        'Danh sách đăng đã nén và sắp xếp thì chèn vào giữa là phải viết lại cả danh sách — nên chỉ mục chia thành phân đoạn ghi xong không bao giờ sửa. Điều này giải thích gần hết hành vi kỳ lạ của công cụ tìm kiếm: ghi xong tìm ngay không thấy (chờ làm mới), xoá nhiều mà đĩa không giảm (bia mộ chờ gộp), truy vấn chậm dần rồi tự nhanh lại (số phân đoạn tăng rồi được gộp).',
      descriptionEn:
        'A compressed, sorted postings list means inserting in the middle rewrites the whole list — so the index splits into segments that are never modified after writing. This explains nearly every surprising search-engine behaviour: written-but-not-findable (awaiting refresh), deletes not freeing disk (tombstones awaiting merge), queries slowing then recovering (segment count rising then merged).',
    },
    {
      phase: 'BACKEND',
      title: 'Băm nhất quán: thêm nút không phải là đợt bảo trì cả đêm',
      titleEn: 'Consistent hashing: adding a node is not an all-night maintenance window',
      description:
        'Với hash(k) % N, thêm một nút vào cụm 10 nút làm ~91% khoá phải chuyển chỗ. Với băm nhất quán, chỉ ~1/N chuyển. Bắt buộc dùng nút ảo — mỗi máy vật lý chiếm nhiều điểm trên vòng — vì các điểm băm ngẫu nhiên không rơi đều và không có nút ảo thì phân bố lệch rất mạnh.',
      descriptionEn:
        'With hash(k) % N, adding one node to a 10-node cluster relocates ~91% of keys. With consistent hashing, only ~1/N move. Virtual nodes are mandatory — each machine occupying many ring positions — because random hash positions do not land evenly and without them distribution skews badly.',
    },
    {
      phase: 'BACKEND',
      title: 'Chịu lỗi gõ bằng ô-tô-mát, không so từng cặp',
      titleEn: 'Typo tolerance via automata, not pairwise comparison',
      description:
        'So khoảng cách chỉnh sửa với mọi từ trong từ điển 5 triệu từ là 5 triệu phép so cho mỗi từ khoá. Ô-tô-mát Levenshtein dựng một bộ nhận dạng cho "mọi chuỗi cách từ này không quá 2 phép sửa" rồi chạy song song với từ điển. Nhưng hai luật thực dụng còn quan trọng hơn thuật toán: không cho sai với từ ngắn (3 ký tự sai 2 thì khớp mọi thứ), và bắt buộc tiền tố đúng.',
      descriptionEn:
        'Comparing edit distance against a five-million-term dictionary is five million comparisons per query word. A Levenshtein automaton builds a recogniser for "every string within 2 edits" and runs it in step with the dictionary. But two pragmatic rules matter more than the algorithm: no edits on short words (3 characters with 2 edits matches anything), and require a correct prefix.',
    },
    {
      phase: 'BACKEND',
      title: 'Nhân bản, bầu chọn và chống chia rẽ não',
      titleEn: 'Replication, elections and split-brain protection',
      description:
        'Chỉ bản chính nhận ghi, bản sao nhận đọc và giữ điểm kiểm tra để phục hồi tiếp sau khi mất kết nối. Khi mạng chia cụm làm hai nửa, cả hai nửa cùng bầu nút chính riêng là mất dữ liệu — cần ngưỡng đa số cho việc bầu chọn, và nửa thiểu số phải TỪ CHỐI ghi thay vì cố phục vụ.',
      descriptionEn:
        'Only primaries accept writes; replicas serve reads and track a checkpoint so recovery resumes after a disconnect. When the network splits the cluster in two, both halves electing their own primary loses data — elections need a quorum, and the minority side must REFUSE writes rather than trying to serve them.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách đặt cùng một tài liệu vào hai mảnh',
      titleEn: 'Verify by placing the same document on two shards',
      description:
        'Phép kiểm quan trọng nhất của cả dự án: đặt CÙNG một tài liệu vào hai mảnh khác nhau rồi tìm — điểm phải chênh dưới 5%, hoặc bạn giải thích được vì sao chấp nhận chênh. Kèm theo: nhồi một từ khoá 500 lần phải KHÔNG lên đầu, ngắt mạng chia cụm thì nửa thiểu số phải từ chối ghi, và thêm một nút vào cụm 5 nút thì số mảnh phải chuyển gần 1/6 chứ không gần hết.',
      descriptionEn:
        'The single most important check in this project: place THE SAME document on two shards and search — scores must differ by under 5%, or you can explain why the gap is acceptable. Alongside: stuffing a keyword 500 times must NOT rank first, a network split must make the minority refuse writes, and adding a node to five must relocate near 1/6 of shards, not near all.',
    },
  ],

  features: [
    { title: 'Chỉ mục ngược tự cài đặt, có nén', titleEn: 'A hand-built compressed inverted index', description: 'Mã hoá chênh lệch, con trỏ nhảy, lưu vị trí cho truy vấn cụm từ.', descriptionEn: 'Delta encoding, skip pointers, and positions for phrase queries.', status: 'PLANNED' },
    { title: 'Xếp hạng BM25 đầy đủ', titleEn: 'Full BM25 ranking', description: 'Chặn bão hoà tần suất và chuẩn hoá theo độ dài tài liệu.', descriptionEn: 'Frequency saturation capping plus document-length normalisation.', status: 'PLANNED' },
    { title: 'Chia mảnh với băm nhất quán', titleEn: 'Sharding with consistent hashing', description: 'Nút ảo để phân bố đều, thêm bớt nút chỉ chuyển ~1/N dữ liệu.', descriptionEn: 'Virtual nodes for even distribution; adding or removing a node moves ~1/N.', status: 'PLANNED' },
    { title: 'Nhân bản và tự phục hồi', titleEn: 'Replication and self-healing', description: 'Điểm kiểm tra để phục hồi tiếp, ngưỡng đa số chống chia rẽ não.', descriptionEn: 'Checkpoints to resume recovery, quorum elections against split brain.', status: 'PLANNED' },
    { title: 'Truy vấn cụm từ, boolean, khoảng giá trị', titleEn: 'Phrase, boolean and range queries', description: 'Vị trí trong tài liệu cho cụm từ, con trỏ nhảy cho phép giao nhanh.', descriptionEn: 'In-document positions for phrases, skip pointers for fast intersection.', status: 'PLANNED' },
    { title: 'Chịu lỗi gõ có kiểm soát', titleEn: 'Controlled typo tolerance', description: 'Ô-tô-mát Levenshtein, số phép sai theo độ dài, khoá tiền tố.', descriptionEn: 'Levenshtein automata, edits scaled by length, prefix locked.', status: 'PLANNED' },
    { title: 'Tổng hợp theo mặt cho bộ lọc', titleEn: 'Faceted aggregations for filters', description: 'Đếm theo nhóm ngay trên chỉ mục, không quét lại tài liệu gốc.', descriptionEn: 'Group counts computed on the index without rescanning source documents.', status: 'PLANNED' },
    { title: 'Tô sáng từ khoá trong đoạn trích', titleEn: 'Keyword highlighting in snippets', description: 'Dùng lại chính các vị trí đã lưu trong danh sách đăng.', descriptionEn: 'Reuses the very positions already stored in the postings list.', status: 'PLANNED' },
    { title: 'API REST và giao diện quản trị cụm', titleEn: 'REST API and cluster admin UI', description: 'Xem trạng thái mảnh, bản sao, số phân đoạn và bia mộ chờ gộp.', descriptionEn: 'Inspect shard and replica state, segment counts and pending tombstones.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Introduction to Information Retrieval (Manning, Raghavan, Schütze)', titleEn: 'Introduction to Information Retrieval (Manning, Raghavan, Schütze)', url: 'https://nlp.stanford.edu/IR-book/', type: 'LINK', description: 'Sách nền của cả lĩnh vực, đọc miễn phí. Chương về chỉ mục và xếp hạng là bản đồ cho dự án này.', descriptionEn: 'The field\'s foundational textbook, free to read. Its indexing and ranking chapters are the map for this project.' },
    { title: 'The Probabilistic Relevance Framework: BM25 and Beyond', titleEn: 'The Probabilistic Relevance Framework: BM25 and Beyond', url: 'https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf', type: 'PDF', description: 'Robertson và Zaragoza giải thích BM25 đến từ đâu — vì sao có k1 và b, không phải công thức trên trời rơi xuống.', descriptionEn: 'Robertson and Zaragoza on where BM25 comes from — why k1 and b exist, rather than a formula from nowhere.' },
    { title: 'Consistent Hashing and Random Trees (Karger et al., 1997)', titleEn: 'Consistent Hashing and Random Trees (Karger et al., 1997)', url: 'https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf', type: 'PDF', description: 'Bài báo gốc của băm nhất quán — nền của mọi hệ thống chia mảnh hiện đại.', descriptionEn: 'The original consistent hashing paper — the basis of every modern sharded system.' },
    { title: 'Apache Lucene — File Formats', titleEn: 'Apache Lucene — File Formats', url: 'https://lucene.apache.org/core/9_9_0/core/org/apache/lucene/codecs/lucene99/package-summary.html', type: 'LINK', description: 'Định dạng phân đoạn thật của Lucene: đọc để thấy lý thuyết ở trên trông thế nào trên đĩa.', descriptionEn: 'Lucene\'s real segment formats: read this to see what the theory above looks like on disk.' },
    { title: 'Lucene: The Search Engine Backing Elasticsearch (Elastic blog)', titleEn: 'Lucene: The Search Engine Backing Elasticsearch (Elastic blog)', url: 'https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up', type: 'LINK', description: 'Giải thích từ dưới lên: phân đoạn, làm mới, gộp, và vì sao "gần thời gian thực".', descriptionEn: 'A bottom-up explanation: segments, refreshes, merges, and why "near real time".' },
  ],

  coreKnowledge: [
    { vi: 'Chỉ mục ngược ở mức cấu trúc dữ liệu: danh sách đăng, nén, con trỏ nhảy', en: 'Inverted indexes at the data-structure level: postings, compression, skip pointers' },
    { vi: 'Mô hình xếp hạng xác suất: BM25 và vì sao nó thắng TF-IDF', en: 'Probabilistic ranking: BM25 and why it beats TF-IDF' },
    { vi: 'Thống kê phân tán: khi một con số toàn cục không còn tồn tại', en: 'Distributed statistics: when a global number no longer exists' },
    { vi: 'Cấu trúc bất biến và gộp: đánh đổi giữa tốc độ ghi, tốc độ đọc và dung lượng', en: 'Immutable structures and merging: trading write speed, read speed and space' },
    { vi: 'Băm nhất quán và nút ảo: mở rộng cụm mà không xáo trộn toàn bộ', en: 'Consistent hashing and virtual nodes: growing a cluster without reshuffling everything' },
    { vi: 'Nhân bản, ngưỡng đa số và chia rẽ não', en: 'Replication, quorums and split brain' },
    { vi: 'Ô-tô-mát hữu hạn áp dụng cho khớp chuỗi gần đúng', en: 'Finite automata applied to approximate string matching' },
    { vi: 'Truy vấn phân tán: phát tán, thu thập, và trộn kết quả có xếp hạng', en: 'Distributed querying: scatter, gather, and merging ranked results' },
  ],

  portfolioBonus: [
    { vi: 'Thí nghiệm chứng minh lỗi IDF phân tán: cùng tài liệu, hai mảnh, hai điểm', en: 'An experiment demonstrating distributed IDF: one document, two shards, two scores' },
    { vi: 'So sánh tốc độ truy vấn AND có và không có con trỏ nhảy, cùng dữ liệu', en: 'AND query timings with and without skip pointers on the same data' },
    { vi: 'Biểu đồ số khoá phải chuyển khi thêm nút: băm thường so với băm nhất quán', en: 'A chart of keys relocated when adding a node: plain hashing vs consistent hashing' },
    { vi: 'So chất lượng xếp hạng TF-IDF và BM25 trên cùng tập truy vấn', en: 'Ranking quality compared between TF-IDF and BM25 on the same query set' },
    { vi: 'Video giết một nút giữa lúc truy vấn mà kết quả vẫn đầy đủ', en: 'A video killing a node mid-query with results still returning complete' },
  ],

  completionOutcomes: [
    { vi: 'Hiểu công cụ tìm kiếm ở mức tự viết lại được, không chỉ mức gọi API', en: 'Understand search engines well enough to rebuild one, not merely call an API' },
    { vi: 'Nhận ra các lỗi phân tán không ném ngoại lệ mà chỉ làm kết quả sai âm thầm', en: 'Recognise distributed failures that throw nothing and merely make results quietly wrong' },
    { vi: 'Thiết kế cấu trúc dữ liệu theo ràng buộc phần cứng, không theo trực giác', en: 'Design data structures around hardware constraints rather than intuition' },
    { vi: 'Đánh giá được đánh đổi giữa độ chính xác và số vòng mạng', en: 'Evaluate the trade-off between accuracy and network round trips' },
    { vi: 'Đọc được mã nguồn của các hệ thống lớn vì đã tự dựng phiên bản nhỏ', en: 'Read the source of large systems, having built a small version yourself' },
  ],

  bodyMdx,
  bodyMdxEn,
};
