/**
 * RAG, Embeddings & Vector Search — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách
 * làm của 11 khoá khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình
 * ở ~/Documents/LO-TRINH-HOC.md. Nối tiếp khoá LLM Apps; dùng PostgreSQL + pgvector, đúng hạ tầng site đang chạy
 * (xem reference_pgvector_tren_prod trong bộ nhớ). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'rag-vector-search',
    title: 'RAG, Embeddings & Vector Search',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/rag-vector-search.png?v=1',
    shortDescription: 'Make an LLM answer from your own documents, correctly: embeddings, chunking, pgvector on PostgreSQL, hybrid vector + full-text search, reranking, citations, and measuring whether the answers are actually right.|||Làm cho LLM trả lời đúng bằng chính tài liệu của bạn: embedding, chunking, pgvector trên PostgreSQL, tìm kiếm lai vector + full-text, rerank, trích nguồn, và đo xem câu trả lời có thật sự đúng không.',
    description: 'RAG (Retrieval-Augmented Generation) là cách đưa dữ liệu riêng của bạn vào câu trả lời của LLM mà không cần fine-tune model. Khoá đi từ embedding là gì và cách chọn model embedding, chiến lược chia nhỏ tài liệu (chunking) sao cho tìm kiếm hiệu quả, cài đặt và dùng pgvector trên chính PostgreSQL bạn đã học (index HNSW/IVFFlat), lưu và truy vấn vector qua Prisma/SQL thô, tìm kiếm lai kết hợp vector với full-text search PostgreSQL, rerank kết quả bằng cross-encoder, trích dẫn nguồn để câu trả lời có thể kiểm chứng thay vì "bịa có vẻ đúng", tới cách đo chất lượng RAG bằng bộ câu hỏi mẫu thay vì cảm tính. Ví dụ thực hành: tìm kiếm có trích nguồn trên một tập tài liệu thật.',
    whatYouLearn: 'Hiểu embedding là gì và chọn đúng model theo chi phí/độ chính xác; chia nhỏ tài liệu (chunking) đúng cách để không cắt đứt ngữ nghĩa; cài pgvector và chọn đúng loại index cho quy mô dữ liệu; viết truy vấn tìm kiếm lai (vector + full-text) và xếp hạng kết quả; rerank để lấy đúng đoạn liên quan nhất trước khi đưa vào prompt; buộc LLM trích dẫn nguồn thay vì trả lời không kiểm chứng được; và đánh giá chất lượng RAG bằng chỉ số cụ thể thay vì đoán.',
    requirements: 'Đã học khoá LLM Apps của CuongThai (gọi API, streaming, structured output). Biết PostgreSQL ở mức cơ bản (SELECT, JOIN, index) — khoá PostgreSQL trên trang này là nền tốt. Nên biết Prisma ORM để làm theo phần lưu trữ, dù khoá vẫn dùng cả SQL thô khi cần.',
    documentsNote: 'Tài liệu chính: github.com/pgvector/pgvector (index HNSW/IVFFlat) • postgresql.org/docs (full-text search) • docs.anthropic.com và platform.openai.com/docs cho embedding API • sbert.net cho cross-encoder rerank.',
  },
  sections: khung('rag', [
    ['Section 0 — Why RAG', 'Mục 0 — Vì sao cần RAG', 'RAG giải quyết vấn đề gì mà prompt thuần và fine-tune không giải quyết được.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What RAG is, and why "just paste it in the prompt" stops working', 'Bắt đầu tại đây (1/2) — RAG là gì, và vì sao "dán thẳng vào prompt" hết tác dụng', 'Context window có giới hạn và giá tăng theo token · RAG lấy đúng phần liên quan thay vì nhét cả kho tài liệu · Lịch sử ngắn: từ retrieval cổ điển tới RAG 2020 (Lewis et al.) · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — RAG vs fine-tuning, and how to study this course', 'Bắt đầu tại đây (2/2) — RAG so với fine-tune, và cách học khoá này', 'Khi nào RAG đủ, khi nào cần fine-tune (khoá Deep Learning) · Tình huống thật: chatbot bịa thông tin vì không có nguồn để trích · Lộ trình: embedding → chunking → lưu trữ → tìm kiếm → rerank → trích nguồn → đo chất lượng'],
      ['embedding-la-gi', 'What embeddings are, intuitively', 'Embedding là gì, hiểu một cách trực quan', 'Vector số biểu diễn ý nghĩa văn bản · Khoảng cách vector ≈ độ liên quan ngữ nghĩa · Ví dụ trực quan: hai câu khác chữ nhưng gần nghĩa vẫn có vector gần nhau'],
      ['kien-truc-rag', 'The RAG architecture at a glance', 'Kiến trúc RAG nhìn tổng thể', 'Pipeline: nạp tài liệu → chunk → embed → lưu → truy vấn → đưa vào prompt → LLM trả lời · Hai giai đoạn tách biệt: indexing (chạy trước) và querying (chạy lúc người dùng hỏi)'],
    ]],
    ['Chapter 1 — Embeddings', 'Chương 1 — Embedding', 'Chọn model, sinh vector, và hiểu chi phí.', [
      ['chon-model-embedding', 'Choosing an embedding model', 'Chọn model embedding', 'Số chiều vector (dimensions) và đánh đổi độ chính xác/chi phí lưu trữ · Embedding đa ngôn ngữ cho nội dung tiếng Việt · Model embedding riêng vs dùng chung API với LLM'],
      ['sinh-embedding', 'Generating embeddings via API', 'Sinh embedding qua API', 'Gọi API embedding, nhận mảng số thực · Batch nhiều đoạn văn bản trong một request cho rẻ và nhanh hơn · Chuẩn hoá văn bản trước khi embed'],
      ['do-tuong-dong', 'Similarity metrics: cosine, dot product, Euclidean', 'Độ đo tương đồng: cosine, dot product, Euclidean', 'Cosine similarity là mặc định phổ biến nhất · Khi nào dot product tương đương cosine (vector đã chuẩn hoá) · Chọn metric khớp với model embedding đã dùng'],
      ['chi-phi-embedding', 'Cost and re-embedding strategy', 'Chi phí và chiến lược nhúng lại', 'Embedding rẻ hơn nhiều so với gọi LLM sinh văn bản, nhưng vẫn tính tiền · Chỉ nhúng lại phần tài liệu đã đổi, không nhúng lại toàn bộ · Đổi model embedding thì phải nhúng lại toàn bộ kho'],
    ]],
    ['Chapter 2 — Chunking strategies', 'Chương 2 — Chiến lược chia nhỏ tài liệu', 'Chia sao cho tìm được, mà không cắt đứt ngữ nghĩa.', [
      ['vi-sao-chunk', 'Why you cannot embed a whole document', 'Vì sao không thể nhúng nguyên cả tài liệu', 'Giới hạn độ dài đầu vào của model embedding · Đoạn quá dài làm loãng ý nghĩa vector · Đoạn quá ngắn mất ngữ cảnh'],
      ['fixed-size', 'Fixed-size chunking with overlap', 'Chia theo kích thước cố định có chồng lấn (overlap)', 'Chia theo số token/ký tự · Overlap giữa các đoạn để không cắt đứt câu quan trọng · Đơn giản, dùng được cho phần lớn trường hợp'],
      ['semantic-chunk', 'Semantic and structure-aware chunking', 'Chia theo ngữ nghĩa và cấu trúc tài liệu', 'Chia theo heading/đoạn văn/bảng thay vì cắt cứng · Giữ nguyên bảng và code block không bị xé đôi · Chunk theo cấu trúc Markdown/HTML khi tài liệu có sẵn cấu trúc'],
      ['metadata-chunk', 'Attaching metadata to chunks', 'Gắn metadata vào từng đoạn', 'Lưu nguồn, số trang, tiêu đề mục cùng với chunk · Metadata dùng để lọc trước khi tìm kiếm và để trích dẫn sau này · Không lưu chunk trần không có ngữ cảnh gốc'],
    ]],
    ['Chapter 3 — pgvector on PostgreSQL', 'Chương 3 — pgvector trên PostgreSQL', 'Cài đặt, kiểu dữ liệu vector, và chọn index đúng quy mô.', [
      ['cai-dat-pgvector', 'Installing the pgvector extension', 'Cài extension pgvector', 'CREATE EXTENSION vector · Kiểu cột vector(n) khớp số chiều model embedding · Chạy pgvector trong Docker (image có sẵn extension)'],
      ['index-hnsw-ivfflat', 'Index types: HNSW vs IVFFlat', 'Loại index: HNSW so với IVFFlat', 'HNSW: chính xác hơn, dựng chậm hơn, phù hợp phần lớn trường hợp · IVFFlat: dựng nhanh, cần chọn số list phù hợp dữ liệu · Trade-off tốc độ truy vấn vs độ chính xác (recall)'],
      ['truy-van-vector', 'Querying nearest neighbours', 'Truy vấn hàng xóm gần nhất', 'Toán tử <=> cho cosine distance · ORDER BY … LIMIT k · Đọc EXPLAIN ANALYZE để biết index có được dùng không'],
      ['quy-mo', 'Sizing and maintaining a vector index', 'Định cỡ và bảo trì index vector', 'Index vector tốn RAM đáng kể ở quy mô lớn · VACUUM/REINDEX khi dữ liệu thay đổi nhiều · Khi nào pgvector đủ, khi nào cần vector DB chuyên dụng (chỉ ghi chú, không bắt buộc học)'],
    ]],
    ['Chapter 4 — Storing and querying with Prisma', 'Chương 4 — Lưu trữ và truy vấn qua Prisma', 'Kết hợp ORM quen thuộc với SQL thô cho phần vector.', [
      ['schema-vector', 'Modeling chunks in Prisma', 'Mô hình hoá chunk trong Prisma', 'Bảng Document và Chunk với quan hệ 1-n · Cột vector không có kiểu Prisma sẵn — dùng Unsupported("vector(n)") · Migration tay cho phần pgvector (giống cách repo này xử lý các migration đặc biệt)'],
      ['raw-query', 'Raw SQL for vector search inside Prisma', 'SQL thô cho tìm kiếm vector trong Prisma', 'prisma.$queryRaw cho truy vấn <=> · Truyền tham số an toàn, tránh SQL injection · Map kết quả thô về kiểu TypeScript'],
      ['upsert-chunk', 'Ingestion pipeline: upsert chunks idempotently', 'Pipeline nạp dữ liệu: upsert chunk không trùng lặp', 'Idempotent theo nguồn + vị trí đoạn · Xoá chunk cũ khi tài liệu gốc bị xoá/đổi · Chạy pipeline nạp dữ liệu như một script riêng, không chạy trong request'],
      ['loc-metadata', 'Filtering by metadata before vector search', 'Lọc theo metadata trước khi tìm kiếm vector', 'WHERE theo nguồn/người dùng trước khi ORDER BY <=> · Index kết hợp cho cột lọc thường dùng · Tránh quét toàn bộ bảng vector khi có thể lọc trước'],
    ]],
    ['Chapter 5 — Hybrid search', 'Chương 5 — Tìm kiếm lai', 'Kết hợp vector search với full-text search của chính PostgreSQL.', [
      ['han-che-vector-thuan', 'Where pure vector search falls short', 'Vector search thuần yếu ở đâu', 'Tên riêng, mã số, từ khoá chính xác thường thua full-text · Vector giỏi "ý nghĩa gần giống", kém "khớp chính xác" · Ví dụ thật: tìm mã sản phẩm bằng vector search ra kết quả sai'],
      ['tsvector', 'PostgreSQL full-text search with tsvector', 'Full-text search của PostgreSQL với tsvector', 'to_tsvector/to_tsquery · GIN index cho tìm kiếm nhanh · Hạn chế với tiếng Việt có dấu, và cách xử lý'],
      ['ket-hop-diem', 'Combining scores: reciprocal rank fusion', 'Kết hợp điểm số: reciprocal rank fusion', 'Chạy hai truy vấn song song rồi gộp thứ hạng · RRF đơn giản hơn cộng điểm trực tiếp (thang đo khác nhau) · Trọng số ưu tiên vector hay full-text tuỳ loại truy vấn'],
      ['thuc-hanh-hybrid', 'A worked hybrid search query', 'Thực hành một truy vấn tìm kiếm lai hoàn chỉnh', 'Viết một truy vấn PostgreSQL kết hợp cả hai · So sánh kết quả với vector-only trên cùng một câu hỏi thật'],
    ]],
    ['Chapter 6 — Reranking', 'Chương 6 — Rerank', 'Lấy đúng đoạn liên quan nhất trước khi đưa vào prompt.', [
      ['vi-sao-rerank', 'Why retrieval alone is not enough', 'Vì sao chỉ tìm kiếm thôi chưa đủ', 'Top-k ban đầu thường lẫn kết quả không thật sự liên quan · Rerank là bước lọc thứ hai, chính xác hơn nhưng chậm hơn · Chạy rerank trên tập nhỏ (vài chục), không trên toàn bộ kho'],
      ['cross-encoder', 'Cross-encoders vs bi-encoders', 'Cross-encoder so với bi-encoder', 'Bi-encoder (embedding thường) mã hoá câu hỏi và tài liệu riêng — nhanh · Cross-encoder mã hoá cùng nhau — chậm hơn nhưng chính xác hơn · Dùng bi-encoder để lọc thô, cross-encoder để rerank tinh'],
      ['api-rerank', 'Calling a reranking API/model', 'Gọi API/model rerank', 'Input: câu hỏi + danh sách đoạn ứng viên · Output: điểm liên quan cho từng đoạn · Chọn top-n sau rerank để đưa vào prompt'],
      ['ket-hop-luong', 'Putting it in the pipeline: retrieve then rerank', 'Ráp vào pipeline: tìm kiếm rồi rerank', 'Lấy top-k rộng (ví dụ 30) từ hybrid search · Rerank xuống top-n hẹp (ví dụ 5) · Đo độ trễ tổng để không làm chậm trải nghiệm streaming'],
    ]],
    ['Chapter 7 — Citations and grounding', 'Chương 7 — Trích nguồn và bám sát dữ liệu thật', 'Câu trả lời có thể kiểm chứng, không phải "nghe có vẻ đúng".', [
      ['grounding-la-gi', 'What "grounding" means for an answer', 'Grounding nghĩa là gì cho một câu trả lời', 'Câu trả lời phải bám vào đoạn tài liệu đã truy xuất, không thêm thông tin ngoài đó · Yêu cầu model chỉ trả lời dựa trên ngữ cảnh được cung cấp · Model nói "không có trong tài liệu" khi không tìm thấy — đó là hành vi ĐÚNG, không phải lỗi'],
      ['prompt-tri-dan', 'Prompting for inline citations', 'Viết prompt để có trích dẫn ngay trong câu trả lời', 'Yêu cầu model gắn số nguồn [1] [2] theo từng câu · Ánh xạ số nguồn về chunk gốc để hiển thị · Định dạng structured output cho câu trả lời + danh sách nguồn'],
      ['hien-thi-nguon', 'Displaying sources in the UI', 'Hiển thị nguồn trên giao diện', 'Link/trích đoạn gốc bên cạnh câu trả lời · Người dùng bấm vào để xem nguyên văn · Tăng độ tin cậy của tính năng AI trong mắt người dùng'],
      ['phat-hien-bia', 'Detecting unsupported claims (hallucination)', 'Phát hiện khẳng định không có căn cứ (bịa)', 'So khớp câu trả lời với nội dung nguồn đã trích · Đánh dấu khi model đưa số liệu không xuất hiện trong ngữ cảnh · Bài học từ chính site này: chốt chặn "không bịa số liệu chưa xác nhận" trong CV critique'],
    ]],
    ['Chapter 8 — Evaluating RAG quality', 'Chương 8 — Đánh giá chất lượng RAG', 'Đo bằng số liệu, không đo bằng cảm giác "trông có vẻ ổn".', [
      ['bo-cau-hoi-mau', 'Building a golden question set', 'Xây bộ câu hỏi mẫu chuẩn (golden set)', 'Tập câu hỏi + câu trả lời đúng đã biết trước · Bao phủ cả câu dễ và câu hiểm (không có trong dữ liệu) · Cập nhật bộ câu hỏi khi kho tài liệu thay đổi'],
      ['metric-retrieval', 'Retrieval metrics: recall@k, precision@k', 'Chỉ số cho khâu tìm kiếm: recall@k, precision@k', 'Đoạn đúng có nằm trong top-k kết quả không · precision@k đo tỉ lệ kết quả liên quan trong top-k · Đo riêng khâu retrieval trước khi đổ lỗi cho LLM'],
      ['llm-as-judge', 'Answer quality: LLM-as-judge', 'Chất lượng câu trả lời: dùng LLM làm giám khảo', 'Một model khác (hoặc cùng model, prompt khác) chấm câu trả lời theo tiêu chí · Tiêu chí cụ thể: đúng, đủ, có trích nguồn, không bịa · Giới hạn của LLM-as-judge — không thay thế hoàn toàn con người'],
      ['vong-lap-cai-tien', 'Closing the loop: fixing chunking/retrieval from eval results', 'Khép vòng lặp: sửa chunking/retrieval dựa trên kết quả đánh giá', 'Câu sai do retrieval không tìm ra đoạn đúng, hay do LLM diễn giải sai · Sửa đúng chỗ dựa trên chẩn đoán, không sửa mò · Chạy lại eval sau mỗi thay đổi để biết có thật sự tốt hơn'],
    ]],
    ['Chapter 9 — Scaling and maintenance', 'Chương 9 — Mở rộng và bảo trì', 'Giữ kho vector đúng và nhanh khi dữ liệu tiếp tục thay đổi.', [
      ['incremental-index', 'Incremental indexing on document changes', 'Đánh index tăng dần khi tài liệu thay đổi', 'Chỉ nhúng lại phần thay đổi, không chạy lại toàn bộ pipeline · Hàng đợi tác vụ nền cho việc nạp dữ liệu (nối khoá Background Jobs) · Đánh dấu tài liệu đang được index để tránh truy vấn dữ liệu nửa vời'],
      ['xoa-du-lieu', 'Deleting and expiring stale content', 'Xoá và loại bỏ nội dung đã cũ', 'Xoá chunk khi tài liệu gốc bị xoá (cascade) · Đánh dấu "hết hạn" cho nội dung theo thời gian (ví dụ tin tức) · Kiểm định kỳ dữ liệu mồ côi (chunk không còn tài liệu gốc)'],
      ['giam-sat', 'Monitoring retrieval quality in production', 'Giám sát chất lượng tìm kiếm ở production', 'Log câu hỏi + đoạn được truy xuất để soát lại sau · Theo dõi độ trễ từng bước (embed, search, rerank, LLM) · Cảnh báo khi tỉ lệ "không tìm thấy nguồn" tăng bất thường'],
      ['chi-phi-quy-mo', 'Cost at scale: embeddings, storage, rerank calls', 'Chi phí khi mở rộng quy mô: embedding, lưu trữ, gọi rerank', 'Chi phí tăng theo số tài liệu và tần suất truy vấn · Cache kết quả cho câu hỏi lặp lại · Giới hạn top-k đưa vào rerank để kiểm soát chi phí'],
    ]],
    ['Chapter 10 — Capstone: RAG search with citations', 'Chương 10 — Dự án cuối khoá: tìm kiếm RAG có trích nguồn', 'Ráp toàn bộ pipeline trên một tập tài liệu thật.', [
      ['chon-du-lieu', 'Choosing and preparing a real document set', 'Chọn và chuẩn bị một tập tài liệu thật', 'Một bộ tài liệu có cấu trúc rõ (ví dụ tài liệu kỹ thuật hoặc chính sách) · Trích xuất văn bản sạch trước khi chunk · Ước lượng số chunk và chi phí embedding trước khi chạy'],
      ['dung-pipeline', 'Building the ingestion and query pipeline', 'Dựng pipeline nạp dữ liệu và truy vấn', 'Chunk → embed → lưu vào pgvector · Truy vấn hybrid + rerank · Prompt buộc model trả lời kèm trích dẫn'],
      ['danh-gia', 'Evaluating it against a golden set', 'Đánh giá bằng bộ câu hỏi mẫu', 'Chạy golden set đã chuẩn bị · Đo recall@k và chất lượng câu trả lời · Tinh chỉnh chunking/rerank dựa trên kết quả đo được'],
      ['tong-ket', 'Wrap-up and the checklist', 'Tổng kết và checklist', 'Checklist năng lực cả khoá · Khi nào cần một agent thật sự điều phối nhiều bước tìm kiếm (khoá AI Agents) · Ghi chú vận hành: theo dõi chi phí và chất lượng theo thời gian'],
    ]],
  ]),
};
