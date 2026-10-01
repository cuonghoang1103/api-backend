/**
 * Tìm kiếm: Elasticsearch/OpenSearch & PostgreSQL full-text — khoá học CuongThai (Courses, GENERAL). KHUNG dựng
 * 30/09/2026 theo content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: postgresql Ch13 (tsvector/tsquery, ts_rank, pg_trgm, GIN — ở mức tính năng CSDL) và rag-vector-search
 * Ch5 (tìm kiếm lai, RRF cho RAG). Khoá này dạy TÌM KIẾM như một hệ thống: lý thuyết IR, phân tích tiếng Việt,
 * Elasticsearch/OpenSearch, độ liên quan, đồng bộ dữ liệu, vận hành cụm. Chỗ chạm có bài "Nếu đã học …".
 * blue-team-siem (Nhóm B) dùng Elastic cho log bảo mật — khoá này không dạy SIEM/ELK cho log.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'databases', name: 'Cơ sở dữ liệu', icon: 'Database', sortOrder: 3 },
  course: {
    slug: 'search-elasticsearch',
    title: 'Search: Elasticsearch, OpenSearch & PostgreSQL Full-Text',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/search-elasticsearch.png?v=4',
    shortDescription: 'Search people like: inverted indexes, Vietnamese analyzers, mappings, query DSL, BM25 relevance, facets, PostgreSQL full-text vs Elasticsearch/OpenSearch, syncing with CDC, hybrid vector search and running a cluster.|||Tìm kiếm người dùng thích: chỉ mục ngược, analyzer tiếng Việt, mapping, query DSL, độ liên quan BM25, bộ lọc, PostgreSQL full-text so với Elasticsearch/OpenSearch, đồng bộ bằng CDC, tìm kiếm lai vector và vận hành cụm.',
    description: 'Khoá tìm kiếm cho lập trình viên backend. Bắt đầu từ vì sao LIKE %…% không phải tìm kiếm, đi qua lý thuyết truy hồi thông tin (chỉ mục ngược, TF-IDF, BM25, precision/recall), phân tích văn bản tiếng Việt (dấu, tách từ, từ đồng nghĩa, gõ không dấu và gõ sai), rồi Elasticsearch/OpenSearch từ số 0: mapping, query DSL, bool query, chấm điểm và tinh chỉnh độ liên quan, aggregation cho bộ lọc theo mục, gợi ý khi gõ, phân trang sâu. So sánh công bằng với PostgreSQL full-text + pg_trgm để biết khi nào KHÔNG cần Elasticsearch. Đồng bộ dữ liệu từ PostgreSQL (dual-write, outbox, CDC bằng Debezium), tìm kiếm vector và lai, đo chất lượng tìm kiếm, vận hành cụm (shard, replica, snapshot, bảo mật). Dự án cuối: tìm kiếm tiếng Việt cho khoá học/bài học của cuongthai.com.',
    whatYouLearn: 'Giải thích chỉ mục ngược và BM25; dựng analyzer tiếng Việt xử lý dấu, không dấu và tách từ; thiết kế mapping và viết query DSL; tinh chỉnh độ liên quan có đo lường; làm bộ lọc theo mục, gợi ý khi gõ, sửa lỗi chính tả; chọn giữa PostgreSQL full-text và Elasticsearch/OpenSearch có lý do; giữ chỉ mục đồng bộ với CSDL; thêm tìm kiếm ngữ nghĩa và lai; chạy, sao lưu và bảo vệ một cụm tìm kiếm.',
    requirements: 'SQL và PostgreSQL cơ bản, một ngôn ngữ backend (Node.js hoặc Java/Spring Boot), Docker. Nên học trước khoá PostgreSQL (đặc biệt Ch13) và Docker.',
    documentsNote: 'Tài liệu chính: elastic.co/guide (Elasticsearch Reference) • opensearch.org/docs • postgresql.org/docs (Full Text Search, pg_trgm) • "Introduction to Information Retrieval" (Manning, Raghavan, Schütze — miễn phí tại nlp.stanford.edu/IR-book) • "Relevant Search" (Turnbull & Berryman) • debezium.io/documentation • lucene.apache.org.',
  },
  sections: khung('search', [
    ['Section 0 — Why search is its own problem', 'Mục 0 — Vì sao tìm kiếm là một bài toán riêng', 'Tìm kiếm là gì bằng lời đời thường, lịch sử, và dựng phòng lab.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Search in everyday words, its history, and clusters left open to the Internet', 'Bắt đầu tại đây (1/2) — Tìm kiếm bằng lời đời thường, lịch sử, và những cụm để ngỏ ra Internet', 'Mục lục cuối sách thay vì lật từng trang · Lucene (Doug Cutting, 1999) → Solr → Elasticsearch (Shay Banon, 2010) → Elastic đổi giấy phép 2021 → AWS tách nhánh OpenSearch 2021 · Làn sóng tống tiền xoá dữ liệu các cụm Elasticsearch/MongoDB mở không mật khẩu (đầu 2017) và nhiều vụ lộ dữ liệu sau đó · Vì sao người dùng bỏ đi khi ô tìm kiếm tệ'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Làm tìm kiếm cho TMĐT, tài liệu, khoá học · Vị trí: backend, search engineer, relevance engineer · Lộ trình: postgresql → khoá này → rag-vector-search · Cách học: luôn có bộ truy vấn thật để đo'],
      ['cai-dat', 'Lab: Elasticsearch or OpenSearch + Kibana/Dashboards + PostgreSQL with Docker', 'Phòng lab: Elasticsearch hoặc OpenSearch + Kibana/Dashboards + PostgreSQL bằng Docker', 'Compose một nút, bật bảo mật mặc định · Giới hạn heap để chạy trên máy 8–16GB · Bộ dữ liệu mẫu tiếng Việt (bài học, sản phẩm) · Dev Tools console'],
      ['like-khong-du', 'Why LIKE %…% is not search', 'Vì sao LIKE %…% không phải tìm kiếm', 'Quét toàn bảng · Không xếp hạng · Không hiểu "lap trinh" = "lập trình" · Nếu đã học postgresql Ch13: đã thấy tsvector — ở đây là vì sao cần nhiều hơn'],
    ]],
    ['Chapter 1 — Information retrieval fundamentals', 'Chương 1 — Nền tảng truy hồi thông tin', 'Lý thuyết đứng sau mọi công cụ tìm kiếm.', [
      ['chi-muc-nguoc', 'The inverted index', 'Chỉ mục ngược', 'Từ → danh sách tài liệu · Posting list, vị trí từ · Tự dựng một chỉ mục ngược 50 dòng code'],
      ['tf-idf-bm25', 'TF-IDF and BM25', 'TF-IDF và BM25', 'Tần suất từ, độ hiếm của từ · BM25 (dòng Okapi, thập niên 1990) và tham số k1, b · Lucene/Elasticsearch dùng BM25 làm mặc định từ khoảng 2016'],
      ['precision-recall', 'Precision, recall and ranking metrics', 'Precision, recall và chỉ số xếp hạng', 'Đúng mà thiếu vs đủ mà rác · MRR, nDCG · Bộ truy vấn chuẩn để đo'],
      ['lucene', 'Inside Lucene: segments, merges, near-real-time', 'Bên trong Lucene: segment, gộp, gần thời gian thực', 'Segment bất biến · refresh vs flush vs commit · Vì sao tài liệu vừa ghi chưa tìm thấy ngay'],
    ]],
    ['Chapter 2 — Text analysis and Vietnamese', 'Chương 2 — Phân tích văn bản và tiếng Việt', 'Biến chữ thành các token tìm được.', [
      ['analyzer', 'Analyzers: char filters, tokenizers, token filters', 'Analyzer: char filter, tokenizer, token filter', 'Chuỗi xử lý · _analyze API · Chuẩn hoá chữ thường, bỏ HTML'],
      ['dau-tieng-viet', 'Vietnamese diacritics: ascii folding and dual fields', 'Dấu tiếng Việt: ascii folding và hai trường song song', 'Gõ "lap trinh" vẫn ra "lập trình" · Nhưng "ma" ≠ "mã" ≠ "má" · Trường có dấu chấm điểm cao hơn · Unicode NFC vs NFD làm hỏng tìm kiếm'],
      ['tach-tu', 'Vietnamese word segmentation', 'Tách từ tiếng Việt', 'Âm tiết vs từ ("học sinh", "sinh viên") · Plugin/thư viện tách từ tiếng Việt (đánh giá trước khi dùng, kiểm còn bảo trì) · Shingle/bigram làm phương án đơn giản'],
      ['dong-nghia', 'Synonyms, stop words and stemming', 'Từ đồng nghĩa, từ dừng và gốc từ', 'Synonym graph lúc truy vấn · "CSDL" = "cơ sở dữ liệu" = "database" · Tiếng Anh có gốc từ, tiếng Việt thì không'],
      ['ngram', 'N-grams, edge n-grams and fuzzy matching', 'N-gram, edge n-gram và khớp mờ', 'Gợi ý khi gõ · Fuzziness và khoảng cách Levenshtein · Cái giá về kích thước chỉ mục'],
    ]],
    ['Chapter 3 — Elasticsearch/OpenSearch basics: documents and mappings', 'Chương 3 — Elasticsearch/OpenSearch cơ bản: tài liệu và mapping', 'Đưa dữ liệu vào và định nghĩa kiểu cho đúng.', [
      ['khai-niem', 'Index, document, field, shard, replica', 'Index, document, field, shard, replica', 'Ánh xạ sang khái niệm SQL (và chỗ không ánh xạ được) · REST API · Kibana/OpenSearch Dashboards'],
      ['mapping', 'Mappings: text vs keyword, numbers, dates, nested, object', 'Mapping: text và keyword, số, ngày, nested, object', 'Dynamic mapping là cái bẫy · multi-fields · nested vs object và lỗi khớp chéo'],
      ['crud-bulk', 'Indexing, updating and the bulk API', 'Ghi, cập nhật và bulk API', 'Cập nhật = xoá + ghi lại · Kích thước lô · Client Node.js và Spring Data Elasticsearch'],
      ['reindex-alias', 'Changing mappings: reindex and aliases', 'Đổi mapping: reindex và alias', 'Mapping gần như không sửa được · Alias để đổi chỉ mục không downtime · Index template'],
    ]],
    ['Chapter 4 — Querying', 'Chương 4 — Truy vấn', 'Query DSL từ đơn giản tới phức tạp.', [
      ['match-term', 'match vs term, and query vs filter context', 'match và term, ngữ cảnh query và filter', 'term trên trường text là lỗi phổ biến nhất · Filter không chấm điểm và được cache'],
      ['bool', 'bool queries: must, should, filter, must_not', 'bool query: must, should, filter, must_not', 'Tổ hợp điều kiện · minimum_should_match · Ví dụ tìm khoá học theo chủ đề + cấp độ'],
      ['phrase-multi', 'Phrase, multi_match and cross-field search', 'Cụm từ, multi_match và tìm xuyên trường', 'match_phrase, slop · best_fields vs most_fields vs cross_fields · Tiêu đề quan trọng hơn nội dung'],
      ['phan-trang', 'Sorting and deep pagination', 'Sắp xếp và phân trang sâu', 'from/size giới hạn 10.000 · search_after + point in time · Sắp xếp theo điểm rồi theo ngày'],
      ['highlight-suggest', 'Highlighting, suggesters and "did you mean"', 'Tô sáng, suggester và "có phải bạn muốn tìm"', 'Highlight đoạn khớp · Completion suggester · Term/phrase suggester sửa chính tả'],
    ]],
    ['Chapter 5 — Relevance tuning', 'Chương 5 — Tinh chỉnh độ liên quan', 'Kết quả đúng nằm ở đầu — và chứng minh được.', [
      ['explain', 'Reading scores with the explain API', 'Đọc điểm bằng explain API', 'Vì sao tài liệu này hạng 1 · Phân rã điểm BM25 · Profile API cho tốc độ'],
      ['boost', 'Field boosts, function_score and business signals', 'Tăng trọng số trường, function_score và tín hiệu kinh doanh', 'Độ mới, độ phổ biến, đánh giá · decay theo thời gian · Không để tín hiệu kinh doanh lấn độ liên quan'],
      ['do-luong', 'Measuring relevance: judgement lists and the rank eval API', 'Đo độ liên quan: danh sách đánh giá và rank eval API', 'Tự chấm 50 truy vấn · So sánh trước/sau mỗi thay đổi · Ghi log truy vấn không ra kết quả'],
      ['ltr', 'Learning to rank at a glance', 'Lướt qua learning to rank', 'Dùng dữ liệu click · Plugin LTR · Khi nào đáng đầu tư'],
    ]],
    ['Chapter 6 — Aggregations and faceted search', 'Chương 6 — Aggregation và tìm kiếm theo mục', 'Bộ lọc bên trái trang kết quả, và thống kê.', [
      ['bucket-metric', 'Bucket and metric aggregations', 'Aggregation nhóm và aggregation số đo', 'terms, range, date_histogram · avg, sum, cardinality · So với GROUP BY'],
      ['facet', 'Faceted navigation done right', 'Bộ lọc theo mục cho đúng', 'post_filter để số đếm không tự lọc chính nó · Nhiều lựa chọn trong một mục · Hiệu năng trên trường keyword'],
      ['gan-dung', 'Approximate aggregations and their limits', 'Aggregation gần đúng và giới hạn', 'cardinality dùng HyperLogLog++ · Sai số terms trên nhiều shard · Khi nào dùng kho phân tích (trỏ data-engineering)'],
    ]],
    ['Chapter 7 — PostgreSQL full-text vs Elasticsearch', 'Chương 7 — PostgreSQL full-text và Elasticsearch', 'Khi nào PostgreSQL là đủ — và khi nào không.', [
      ['nhac-lai', 'If you took the PostgreSQL course: a quick recap of tsvector, ts_rank and pg_trgm', 'Nếu đã học khoá PostgreSQL: nhắc nhanh tsvector, ts_rank và pg_trgm', 'Tóm cốt lõi Ch13 · Link /courses/postgresql · Những gì Ch13 chưa làm: tiếng Việt không dấu, facet, xếp hạng tinh'],
      ['pg-tieng-viet', 'Vietnamese search in PostgreSQL: unaccent, trigram and custom configs', 'Tìm tiếng Việt trong PostgreSQL: unaccent, trigram và cấu hình riêng', 'unaccent + simple config · Kết hợp trigram cho gõ sai · Chỉ mục GIN/GiST · Đo trên 1 triệu dòng'],
      ['so-sanh', 'Head-to-head: features, speed, operations, cost', 'So kè: tính năng, tốc độ, vận hành, chi phí', 'Bảng so sánh đo thật · Một hệ ít hơn = ít sự cố hơn · ParadeDB/pg_search và các lựa chọn mới (kiểm trạng thái trước khi dùng)'],
      ['khac', 'Other engines: Meilisearch, Typesense, Solr, Algolia', 'Công cụ khác: Meilisearch, Typesense, Solr, Algolia', 'Dễ dựng vs linh hoạt · Tự host vs dịch vụ · Khi nào chọn cái nào'],
    ]],
    ['Chapter 8 — Keeping the index in sync', 'Chương 8 — Giữ chỉ mục đồng bộ', 'CSDL là nguồn sự thật; chỉ mục là bản sao phải theo kịp.', [
      ['dual-write', 'Dual writes and why they drift', 'Ghi kép và vì sao chúng lệch', 'Ghi CSDL thành công, ghi chỉ mục thất bại · Race khi hai cập nhật chéo nhau · Version để bỏ bản cũ'],
      ['outbox-job', 'Outbox + background jobs for indexing', 'Outbox + việc chạy nền để đánh chỉ mục', 'Trỏ background-jobs Ch6 · Idempotent theo version · Reindex toàn bộ định kỳ để tự chữa'],
      ['cdc', 'CDC with Debezium into Elasticsearch/OpenSearch', 'CDC bằng Debezium vào Elasticsearch/OpenSearch', 'Logical replication của PostgreSQL · Kafka Connect sink (trỏ kafka Ch7) · Xoá mềm và tombstone'],
      ['backfill', 'Backfills and zero-downtime reindexing', 'Nạp lại và reindex không downtime', 'Chỉ mục mới song song · Bắt kịp phần thay đổi · Đổi alias · Kiểm số lượng hai bên'],
    ]],
    ['Chapter 9 — Semantic and hybrid search', 'Chương 9 — Tìm kiếm ngữ nghĩa và lai', 'Hiểu ý, không chỉ khớp chữ.', [
      ['nhac-lai-rag', 'If you took RAG & Vector Search: recap of embeddings and RRF', 'Nếu đã học RAG & Vector Search: nhắc lại embedding và RRF', 'Tóm cốt lõi rag-vector-search Ch1, Ch5 · Link /courses/rag-vector-search · Ở đây làm trong Elasticsearch/OpenSearch'],
      ['knn', 'dense_vector and kNN/ANN search (HNSW)', 'dense_vector và tìm kNN/ANN (HNSW)', 'Mapping vector · Tham số HNSW · Lọc trước vs lọc sau · Chi phí bộ nhớ'],
      ['lai', 'Hybrid ranking in the engine: RRF and linear combination', 'Xếp hạng lai trong công cụ: RRF và cộng tuyến tính', 'Tìm từ khoá + vector một lần gọi · Truy vấn mã số dùng từ khoá, câu hỏi dùng vector · Đo bằng bộ đánh giá chương 5'],
      ['rerank', 'Reranking and query understanding with LLMs', 'Rerank và hiểu truy vấn bằng LLM', 'Cross-encoder rerank top 50 · Viết lại truy vấn · Chi phí và độ trễ · Không gửi dữ liệu nhạy cảm'],
    ]],
    ['Chapter 10 — Operating a search cluster', 'Chương 10 — Vận hành cụm tìm kiếm', 'Giữ cụm xanh, nhanh và an toàn.', [
      ['shard-sizing', 'Shards, replicas and sizing', 'Shard, replica và định cỡ', 'Kích thước shard hợp lý · Quá nhiều shard nhỏ · Heap JVM và page cache · Trạng thái green/yellow/red'],
      ['snapshot', 'Snapshots, restore and index lifecycle', 'Snapshot, khôi phục và vòng đời chỉ mục', 'Snapshot lên S3/R2 · ILM/ISM · Diễn tập khôi phục'],
      ['bao-mat', 'Security: auth, TLS, network exposure', 'Bảo mật: xác thực, TLS, phơi mạng', 'Không bao giờ mở cổng 9200 ra Internet · Người dùng và vai trò · API key cho ứng dụng · Trỏ network-security'],
      ['giam-sat', 'Monitoring, slow logs and common incidents', 'Giám sát, slow log và sự cố thường gặp', 'Đĩa đầy → chỉ mục chỉ đọc (flood stage) · Circuit breaker heap · Mapping explosion · Trỏ observability-monitoring'],
    ]],
    ['Chapter 11 — Search in interviews and system design', 'Chương 11 — Tìm kiếm trong phỏng vấn và thiết kế hệ thống', 'Câu hỏi hay gặp và cách trả lời.', [
      ['cau-hoi', 'Classic questions', 'Câu hỏi kinh điển', 'Chỉ mục ngược · BM25 · Vì sao ES không phải CSDL chính · Đồng bộ chỉ mục thế nào'],
      ['thiet-ke', 'Designing typeahead and product search', 'Thiết kế gợi ý khi gõ và tìm sản phẩm', 'Trỏ system-design Ch10 · Độ trễ mục tiêu · Cache kết quả phổ biến'],
      ['chung-chi', 'Certifications worth knowing', 'Chứng chỉ nên biết', 'Elastic Certified Engineer · Khi nào đáng thi'],
    ]],
    ['Chapter 12 — Capstone: Vietnamese search for cuongthai.com courses', 'Chương 12 — Dự án cuối khoá: tìm kiếm tiếng Việt cho khoá học của cuongthai.com', 'Express/Spring Boot + PostgreSQL + OpenSearch/Elasticsearch + Redis, chạy Docker trên VPS sau Cloudflare.', [
      ['thiet-ke', 'Design: index schema, analyzers, API', 'Thiết kế: schema chỉ mục, analyzer, API', 'Khoá học, bài học, thuật ngữ · Có dấu + không dấu + gõ sai · API /search có facet'],
      ['dong-bo', 'Sync from PostgreSQL with outbox or CDC', 'Đồng bộ từ PostgreSQL bằng outbox hoặc CDC', 'Nạp lần đầu · Cập nhật gần thời gian thực · Kiểm lệch số lượng hằng ngày'],
      ['giao-dien', 'Search UI in Next.js: typeahead, facets, highlights', 'Giao diện tìm kiếm Next.js: gợi ý khi gõ, bộ lọc, tô sáng', 'Debounce · URL giữ trạng thái lọc · Không kết quả thì gợi ý gì'],
      ['do-van-hanh', 'Measure, tune, secure and operate', 'Đo, tinh chỉnh, bảo mật và vận hành', 'Bộ 50 truy vấn thật và nDCG · Hybrid vector cho câu hỏi · Snapshot lên R2 · Giới hạn heap trên VPS nhỏ'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án tìm kiếm trong phỏng vấn'],
    ]],
  ]),
};
