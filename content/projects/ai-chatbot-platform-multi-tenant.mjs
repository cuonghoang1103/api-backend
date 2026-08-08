/**
 * Case-study 3.2 — AI Chatbot Platform (Multi-tenant SaaS).
 *
 * The demo is an afternoon's work; the product is three questions that have
 * nothing to do with calling a model: cross-tenant leakage (which generates a
 * blended answer nobody can detect), prompt injection through ingested
 * content, and how you know a change helped when output is non-deterministic.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./ai-chatbot-platform-multi-tenant.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./ai-chatbot-platform-multi-tenant.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'ai-chatbot-platform-multi-tenant',
  title: 'AI Chatbot Platform (Multi-tenant SaaS)',
  titleEn: 'AI Chatbot Platform (Multi-tenant SaaS)',
  description:
    'Bot hỏi đáp trên tài liệu khách hàng, nhiều công ty dùng chung một hệ thống. Bản demo là việc của một buổi chiều; khoảng cách tới sản phẩm bán được là ba câu hỏi không liên quan gì tới việc gọi mô hình: rò rỉ chéo khách hàng, tiêm lời nhắc qua tài liệu, và làm sao biết bản mới tốt hơn bản cũ.',
  descriptionEn:
    'A document question-answering bot with many companies on one system. The demo takes an afternoon; the distance to a sellable product is three questions that have nothing to do with calling a model: cross-tenant leakage, prompt injection through documents, and how you know a change helped.',
  techStack: [
    'Python', 'FastAPI', 'Next.js 15', 'PostgreSQL', 'pgvector', 'Redis',
    'Server-Sent Events', 'BM25', 'Cross-encoder reranking', 'Celery', 'Docker',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '6–8 tuần',
  durationEn: '6–8 weeks',
  status: 'PLANNING',
  category: 'AI',
  difficulty: 'ADVANCED',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/ai-chatbot-platform-multi-tenant.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Rò rỉ chéo khách hàng ở đây KHÁC VỀ BẢN CHẤT so với rò một dòng dữ
-- liệu: bạn SINH RA một câu trả lời trộn thông tin hai công ty, bằng văn
-- xuôi trôi chảy, không dấu vết nào cho thấy nó sai. Người nhận không có
-- cách nào biết. Nên thiết kế phải làm cho chế độ hỏng là RỖNG, không SAI.

CREATE TABLE chunks (
    id          TEXT   PRIMARY KEY,
    document_id TEXT   NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    -- LẶP LẠI có chủ ý dù suy ra được qua document_id. Phi chuẩn hoá này
    -- cho phép điều kiện lọc nằm NGAY trong truy vấn vector mà không cần
    -- phép nối — và phép nối chính là chỗ người ta quên.
    tenant_id   TEXT   NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content     TEXT   NOT NULL,
    -- Mang theo đường dẫn tiêu đề: đoạn nói "giới hạn là 30 ngày" vô nghĩa
    -- nếu không biết nó thuộc mục "Chính sách hoàn tiền". Nhúng cả tiêu đề
    -- vào text làm điểm tương đồng chính xác hơn hẳn.
    heading_path TEXT,
    embedding   vector(1536),
    token_count INTEGER NOT NULL
);

-- Chỉ mục ĐI KÈM điều kiện tenant. Truy vấn đúng phải là:
--   WHERE tenant_id = $1 ORDER BY embedding <=> $2 LIMIT 20
-- KHÔNG phải lấy 20 gần nhất toàn kho rồi lọc sau — làm vậy thì 18/20 đoạn
-- có thể thuộc công ty khác và chỉ còn 2 đoạn để trả lời.
CREATE INDEX chunks_tenant_embedding_idx ON chunks
    USING hnsw (embedding vector_cosine_ops);
CREATE INDEX chunks_tenant_idx ON chunks (tenant_id);

CREATE TABLE documents (
    id           TEXT        PRIMARY KEY,
    kb_id        TEXT        NOT NULL,
    source_url   TEXT,
    -- Tài liệu CÔNG KHAI (ai cũng sửa được) và tài liệu NỘI BỘ phải ở mức
    -- tin cậy khác nhau — đây là nơi tiêm lời nhắc đi vào hệ thống.
    trust_level  VARCHAR(16) NOT NULL DEFAULT 'PUBLIC',
    -- Không nhúng lại nếu nội dung không đổi. Đồng bộ định kỳ nhờ đó
    -- có chi phí gần bằng 0 thay vì bằng lần nạp đầu tiên.
    content_hash VARCHAR(64) NOT NULL,
    status       VARCHAR(16) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE messages (
    id                TEXT        PRIMARY KEY,
    conversation_id   TEXT        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role              VARCHAR(12) NOT NULL,
    content           TEXT        NOT NULL,
    -- Tính tiền theo token THẬT trả về, không theo ước lượng trước khi gọi.
    prompt_tokens     INTEGER     NOT NULL DEFAULT 0,
    completion_tokens INTEGER     NOT NULL DEFAULT 0,
    model_version     VARCHAR(64) NOT NULL,
    -- false = bot đã nói "tôi không biết". Đây KHÔNG phải thất bại cần
    -- giảm về 0 — nó là hành vi ĐÚNG khi tài liệu không chứa câu trả lời.
    -- Chỉ số cần theo dõi là tỉ lệ trả lời SAI, không phải tỉ lệ TỪ CHỐI.
    -- Nhầm hai cái này là cách chắc chắn tạo ra bot bịa đặt trôi chảy.
    answered          BOOLEAN     NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hạn mức phải CHẶN THẬT: kiểm TRƯỚC khi gọi mô hình. Kiểm sau nghĩa là
-- khách gói FREE gọi 10.000 lần một đêm vẫn được phục vụ và bạn nhận hoá đơn.
CREATE TABLE tenants (
    id                  TEXT        PRIMARY KEY,
    plan                VARCHAR(16) NOT NULL DEFAULT 'FREE',
    monthly_token_quota INTEGER     NOT NULL,
    tokens_used_period  INTEGER     NOT NULL DEFAULT 0
);`,

  schemaCodeEn: `-- Cross-tenant leakage here differs IN KIND from leaking a row: you GENERATE
-- an answer blending two companies' information, in fluent prose, with nothing
-- indicating it is wrong. The reader cannot tell. So the design must make the
-- failure mode EMPTY, not WRONG.

CREATE TABLE chunks (
    id          TEXT   PRIMARY KEY,
    document_id TEXT   NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    -- DUPLICATED deliberately even though derivable via document_id. This
    -- denormalisation lets the filter sit INSIDE the vector query without a
    -- join — and the join is exactly what people forget.
    tenant_id   TEXT   NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    content     TEXT   NOT NULL,
    -- Carries the heading path: a chunk saying "the limit is 30 days" is
    -- meaningless without knowing it sits under "Refund policy". Embedding
    -- the heading with the text improves similarity considerably.
    heading_path TEXT,
    embedding   vector(1536),
    token_count INTEGER NOT NULL
);

-- The index goes ALONGSIDE a tenant predicate. The correct query is:
--   WHERE tenant_id = $1 ORDER BY embedding <=> $2 LIMIT 20
-- NOT taking the global 20 nearest and filtering after — that way 18 of 20
-- may belong to another company, leaving only 2 chunks to answer with.
CREATE INDEX chunks_tenant_embedding_idx ON chunks
    USING hnsw (embedding vector_cosine_ops);
CREATE INDEX chunks_tenant_idx ON chunks (tenant_id);

CREATE TABLE documents (
    id           TEXT        PRIMARY KEY,
    kb_id        TEXT        NOT NULL,
    source_url   TEXT,
    -- PUBLIC documents (anyone can edit them) and INTERNAL ones deserve
    -- different trust — this is where prompt injection enters the system.
    trust_level  VARCHAR(16) NOT NULL DEFAULT 'PUBLIC',
    -- Skip re-embedding when content is unchanged. Periodic syncs then cost
    -- close to nothing rather than as much as the initial ingestion.
    content_hash VARCHAR(64) NOT NULL,
    status       VARCHAR(16) NOT NULL DEFAULT 'PENDING'
);

CREATE TABLE messages (
    id                TEXT        PRIMARY KEY,
    conversation_id   TEXT        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role              VARCHAR(12) NOT NULL,
    content           TEXT        NOT NULL,
    -- Bill on ACTUAL returned tokens, never on a pre-call estimate.
    prompt_tokens     INTEGER     NOT NULL DEFAULT 0,
    completion_tokens INTEGER     NOT NULL DEFAULT 0,
    model_version     VARCHAR(64) NOT NULL,
    -- false = the bot said "I don't know". This is NOT a failure to drive to
    -- zero — it is CORRECT behaviour when the documents lack the answer.
    -- The metric to watch is how often it answers WRONGLY, not how often it
    -- DECLINES. Confusing the two reliably produces a fluent fabricator.
    answered          BOOLEAN     NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quotas must ACTUALLY BLOCK: check BEFORE calling the model. Checking after
-- means a FREE customer making 10,000 overnight calls is served and the bill
-- lands on you.
CREATE TABLE tenants (
    id                  TEXT        PRIMARY KEY,
    plan                VARCHAR(16) NOT NULL DEFAULT 'FREE',
    monthly_token_quota INTEGER     NOT NULL,
    tokens_used_period  INTEGER     NOT NULL DEFAULT 0
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Thiết kế sao cho chế độ hỏng là RỖNG, không phải SAI',
      titleEn: 'Design so the failure mode is EMPTY, not WRONG',
      description:
        'Rò rỉ chéo ở đây không phải rò một dòng mà là SINH RA câu trả lời trộn thông tin hai công ty, trôi chảy và không dấu vết. Lọc khách hàng phải nằm TRONG truy vấn vector, tốt hơn nữa là mỗi khách một không gian riêng — quên lọc thì không tìm thấy gì, chứ không tìm thấy dữ liệu người khác. Truy vấn rỗng có người báo trong một phút; truy vấn trả dữ liệu công ty khác chạy nhiều tháng không ai biết.',
      descriptionEn:
        'Leakage here is not a leaked row but a GENERATED answer blending two companies, fluent and untraceable. The tenant filter must sit INSIDE the vector query, better still one namespace per customer — forget the filter and you find nothing rather than someone else\'s data. An empty result is reported within a minute; a result containing another company\'s data can run for months unnoticed.',
    },
    {
      phase: 'BACKEND',
      title: 'Cắt đoạn theo cấu trúc, có chồng lấn, mang theo tiêu đề',
      titleEn: 'Chunk by structure, with overlap and carried headings',
      description:
        'Phần lớn thời gian cải thiện hệ thống hỏi đáp không dành cho lời nhắc hay mô hình mà dành cho CÁCH CẮT tài liệu. Cắt cố định theo ký tự thì cắt giữa câu, giữa bảng, giữa khối mã. Chồng lấn là chi tiết dễ bỏ nhưng quan trọng: không có nó, câu quan trọng nằm vắt qua ranh giới sẽ không đoạn nào chứa trọn và cả hai đều không khớp câu hỏi.',
      descriptionEn:
        'Most of the effort improving a QA system goes not into prompts or models but into HOW DOCUMENTS ARE SPLIT. Fixed character chunking cuts mid-sentence, mid-table, mid-code-block. Overlap is the detail people skip and it matters: without it an important sentence straddling a boundary is complete in neither chunk and matches nothing.',
      codeBlock:
        'CHUNK_SIZE    = 800   # đủ một ý trọn vẹn, không loãng\n'
        + 'CHUNK_OVERLAP = 150   # câu bị cắt vẫn xuất hiện trọn ở đoạn kế\n'
        + '\n'
        + '# Mang theo tiêu đề: "giới hạn là 30 ngày" vô nghĩa nếu không biết\n'
        + '# nó thuộc mục "Chính sách hoàn tiền".\n'
        + '"text": f"{section.heading_path}\\n\\n{piece}"',
      codeLang: 'python',
    },
    {
      phase: 'BACKEND',
      title: 'Tìm kiếm lai: hoà theo THỨ HẠNG, không cộng điểm',
      titleEn: 'Hybrid search: fuse by RANK, never by adding scores',
      description:
        'Vector giỏi ngữ nghĩa, dở ở từ chính xác — hỏi mã lỗi ERR_4021 thì vector không giúp gì. Cần cả BM25. Nhưng điểm BM25 và điểm cosine khác đơn vị nên cộng thẳng là vô nghĩa: bỏ điểm đi, chỉ dùng thứ hạng. Sau đó là bước nhiều hệ thống bỏ qua — xếp hạng lại 50 đoạn bằng mô hình chấm cặp rồi giữ 5, cải thiện nhiều hơn hầu hết mọi thứ làm với lời nhắc.',
      descriptionEn:
        'Vectors are good at meaning and bad at exact tokens — asking about error code ERR_4021 gets nothing useful. You need BM25 too. But BM25 and cosine scores are in different units, so adding them is meaningless: discard scores and use ranks. Then the step many systems skip — rerank 50 chunks with a pair-scoring model and keep 5, which improves quality more than almost anything done to the prompt.',
      codeBlock:
        'def fuse(vector_hits, keyword_hits, k=60):\n'
        + '    scores = defaultdict(float)\n'
        + '    for rank, doc in enumerate(vector_hits):\n'
        + '        scores[doc.id] += 1 / (k + rank)\n'
        + '    for rank, doc in enumerate(keyword_hits):\n'
        + '        scores[doc.id] += 1 / (k + rank)\n'
        + '    return sorted(scores.items(), key=lambda x: -x[1])',
      codeLang: 'python',
    },
    {
      phase: 'BACKEND',
      title: 'Tiêm lời nhắc: giới hạn KHẢ NĂNG, không giới hạn ý định',
      titleEn: 'Prompt injection: limit CAPABILITY, not intent',
      description:
        'Mô hình nhận chỉ dẫn và dữ liệu qua CÙNG một kênh nên không có bản vá triệt để. Nhưng lớp phòng thủ đáng tin nhất không phụ thuộc vào việc mô hình có ngoan hay không: nếu bot không có công cụ gửi email thì chỉ dẫn "gửi email" không thực hiện được, dù mô hình bị thuyết phục. Kèm theo: phân định ranh giới trong lời nhắc, lọc chữ ẩn LÚC NẠP, kiểm đầu ra, và tách mức tin cậy tài liệu công khai với nội bộ.',
      descriptionEn:
        'The model receives instructions and data through the SAME channel, so there is no complete fix. But the most reliable layer does not depend on the model behaving: if the bot has no email tool, an instruction to send email cannot execute however convinced the model becomes. Alongside: explicit delimiters, stripping hidden text AT INGESTION, output checks, and separate trust levels for public and internal documents.',
    },
    {
      phase: 'BACKEND',
      title: 'Chi phí: đệm, định tuyến mô hình, và hạn mức chặn thật',
      titleEn: 'Cost: caching, model routing, and quotas that really block',
      description:
        'Chi phí tăng theo ĐỘ DÀI lời nhắc chứ không chỉ theo số câu hỏi — nhét 20 đoạn thay vì 5 là hoá đơn gấp bốn cho chất lượng thường không tốt hơn. Bốn biện pháp theo thứ tự hiệu quả: đệm câu trả lời theo câu hỏi chuẩn hoá, đệm nhúng theo mã băm nội dung, định tuyến mô hình theo độ khó, và cắt số đoạn sau xếp hạng lại. Hạn mức phải kiểm TRƯỚC khi gọi mô hình.',
      descriptionEn:
        'Cost scales with PROMPT LENGTH, not just question count — 20 chunks instead of 5 quadruples the bill for quality that is usually no better. Four measures by effectiveness: cache answers by normalised question, cache embeddings by content hash, route models by difficulty, and cut chunk count after reranking. Quotas must be checked BEFORE calling the model.',
    },
    {
      phase: 'FRONTEND',
      title: 'Trả lời theo dòng và luôn kèm trích dẫn mở được',
      titleEn: 'Stream responses and always carry openable citations',
      description:
        'Đợi mô hình sinh xong mới trả về là bắt người dùng nhìn màn hình trống 8 giây. Trả theo dòng để chữ đầu tiên xuất hiện dưới 1 giây. Và mọi câu trả lời phải có trích dẫn mở được — không chỉ để đẹp mà vì đó là cách duy nhất người dùng kiểm chứng được, và là ràng buộc buộc hệ thống phải nói "tôi không biết" khi không đủ nguồn.',
      descriptionEn:
        'Waiting for full generation means eight seconds of blank screen. Stream so the first characters appear in under a second. And every answer must carry openable citations — not for decoration but because it is the only way users can verify, and it is the constraint that forces the system to say "I don\'t know" when sources are insufficient.',
    },
    {
      phase: 'TESTING',
      title: 'Bộ câu hỏi vàng — và nó PHẢI có câu không trả lời được',
      titleEn: 'A golden question set — and it MUST contain unanswerable questions',
      description:
        'Sửa lời nhắc, thử ba câu, thấy đỡ hơn, triển khai — ba tuần sau chất lượng tệ đi mà không ai biết vì sao. Tối thiểu 50 câu gồm: câu trả lời được, câu KHÔNG trả lời được, câu có tiêm lời nhắc, câu mơ hồ. Không có nhóm thứ hai thì mọi thay đổi làm bot tự tin hơn đều trông như cải thiện, cho tới khi nó bắt đầu bịa.',
      descriptionEn:
        'Edit the prompt, try three questions, ship — three weeks later quality has degraded and nobody knows why. At least 50 questions covering: answerable, UNANSWERABLE, prompt-injection, and ambiguous. Without the second group, every change making the bot more confident looks like an improvement, right up until it starts fabricating.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách tự xoá điều kiện lọc khách hàng',
      titleEn: 'Verify by deleting your own tenant filter',
      description:
        'Phép kiểm quyết định của cả dự án: xoá cố ý điều kiện lọc tenantId trong mã rồi chạy — hệ thống phải trả về RỖNG, không được trả về dữ liệu khách hàng khác. Nếu nó trả về dữ liệu người khác thì kiến trúc sai, không phải một dòng mã sai. Kèm theo: nạp tài liệu có chữ ẩn "bỏ qua chỉ dẫn trước đó" và xác nhận bot không làm theo.',
      descriptionEn:
        'The decisive check of this project: deliberately delete the tenantId filter and run — the system must return EMPTY, never another customer\'s data. If it returns other data, the architecture is wrong, not a line of code. Alongside: ingest a document with hidden "ignore previous instructions" text and confirm the bot does not comply.',
    },
  ],

  features: [
    { title: 'Cách ly nhiều khách hàng ở tầng dữ liệu', titleEn: 'Tenant isolation at the data layer', description: 'Không gian vector riêng, lọc trong truy vấn, hỏng thì rỗng chứ không sai.', descriptionEn: 'Separate vector namespaces, in-query filtering, failing empty rather than wrong.', status: 'PLANNED' },
    { title: 'Nạp tài liệu nhiều định dạng', titleEn: 'Multi-format document ingestion', description: 'PDF, trang web, cơ sở tri thức — lọc chữ ẩn ngay lúc nạp.', descriptionEn: 'PDFs, web pages, knowledge bases — hidden text stripped at ingestion.', status: 'PLANNED' },
    { title: 'Cắt đoạn theo cấu trúc có chồng lấn', titleEn: 'Structural chunking with overlap', description: 'Mang theo đường dẫn tiêu đề để đoạn tự đứng vững và trích dẫn được.', descriptionEn: 'Heading paths carried so chunks stand alone and can be cited.', status: 'PLANNED' },
    { title: 'Tìm kiếm lai và xếp hạng lại', titleEn: 'Hybrid search with reranking', description: 'BM25 + vector hoà theo thứ hạng, rồi mô hình chấm cặp giữ 5 đoạn tốt nhất.', descriptionEn: 'BM25 plus vectors fused by rank, then a pair-scoring model keeps the best 5.', status: 'PLANNED' },
    { title: 'Trả lời có trích dẫn, biết nói không biết', titleEn: 'Cited answers that can say "I don\'t know"', description: 'Không đủ nguồn thì từ chối — và đó được tính là kết quả tốt.', descriptionEn: 'Insufficient sources means declining — counted as a good outcome.', status: 'PLANNED' },
    { title: 'Trả lời theo dòng', titleEn: 'Streamed responses', description: 'Chữ đầu tiên dưới 1 giây thay vì chờ cả đoạn.', descriptionEn: 'First characters under a second instead of waiting for a paragraph.', status: 'PLANNED' },
    { title: 'Hạn mức và tính chi phí theo khách hàng', titleEn: 'Per-customer quotas and cost accounting', description: 'Kiểm trước khi gọi mô hình, tính theo token thật trả về.', descriptionEn: 'Checked before the model call, accounted on actual returned tokens.', status: 'PLANNED' },
    { title: 'Bộ đo chất lượng tự động', titleEn: 'An automated quality suite', description: 'Bộ câu hỏi vàng chạy trước mỗi thay đổi, lỗi thật thành phép kiểm vĩnh viễn.', descriptionEn: 'A golden set run before every change; real failures become permanent checks.', status: 'PLANNED' },
    { title: 'Widget nhúng vào website khách hàng', titleEn: 'An embeddable website widget', description: 'Một đoạn script, cách ly kiểu dáng, không xung đột với trang chủ nhà.', descriptionEn: 'One script tag, style-isolated, without colliding with the host page.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'OWASP Top 10 for LLM Applications', titleEn: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', type: 'LINK', description: 'Tiêm lời nhắc đứng đầu danh sách. Đọc trước khi nạp bất kỳ nội dung công khai nào vào hệ thống.', descriptionEn: 'Prompt injection tops the list. Read it before ingesting any public content.' },
    { title: 'pgvector', titleEn: 'pgvector', url: 'https://github.com/pgvector/pgvector', type: 'REPO', description: 'Lưu và tìm vector ngay trong Postgres — cùng nơi với dữ liệu quan hệ, nên lọc khách hàng nằm chung một truy vấn.', descriptionEn: 'Vectors alongside relational data in Postgres — so the tenant filter lives in the same query.' },
    { title: 'Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods', titleEn: 'Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods', url: 'https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf', type: 'PDF', description: 'Bài báo gốc của cách hoà theo thứ hạng — vì sao nó thắng việc cố chuẩn hoá hai thang điểm.', descriptionEn: 'The original rank-fusion paper — why it beats trying to normalise two score scales.' },
    { title: 'Anthropic — Reducing hallucinations', titleEn: 'Anthropic — Reducing hallucinations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', type: 'LINK', description: 'Kỹ thuật buộc mô hình dựa vào nguồn và cho phép nó nói "tôi không biết".', descriptionEn: 'Techniques for grounding answers in sources and allowing the model to say "I don\'t know".' },
    { title: 'Anthropic — Create strong empirical evaluations', titleEn: 'Anthropic — Create strong empirical evaluations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests', type: 'LINK', description: 'Cách dựng bộ đo cho hệ thống có đầu ra không tất định — phần khó nhất của dự án này.', descriptionEn: 'Building evaluation for non-deterministic output — the hardest part of this project.' },
  ],

  coreKnowledge: [
    { vi: 'Sinh có truy xuất: cắt đoạn, nhúng, tìm, và chỗ chất lượng thật sự được quyết định', en: 'Retrieval-augmented generation: chunking, embedding, retrieval, and where quality is really decided' },
    { vi: 'Cách ly nhiều khách hàng khi dữ liệu đi qua một mô hình sinh', en: 'Multi-tenant isolation when data passes through a generative model' },
    { vi: 'Nguyên tắc "hỏng thành rỗng, không hỏng thành sai" trong thiết kế hệ thống', en: 'The "fail empty, not wrong" principle in system design' },
    { vi: 'Tìm kiếm lai và hoà kết quả từ hai thang điểm khác đơn vị', en: 'Hybrid retrieval and fusing results from two incomparable score scales' },
    { vi: 'Tiêm lời nhắc: vì sao không vá được triệt để và phòng thủ theo lớp', en: 'Prompt injection: why it cannot be fully patched, and layered defence' },
    { vi: 'Kiểm soát chi phí mô hình: đệm, định tuyến, và hạn mức chặn thật', en: 'Model cost control: caching, routing, and quotas that actually block' },
    { vi: 'Đánh giá hệ thống có đầu ra không tất định', en: 'Evaluating systems whose output is non-deterministic' },
    { vi: 'Phân biệt "từ chối trả lời" với "trả lời sai" khi chọn chỉ số', en: 'Separating "declined to answer" from "answered wrongly" when choosing metrics' },
  ],

  portfolioBonus: [
    { vi: 'Bài kiểm rò rỉ chéo chạy tự động, 50 câu hỏi chéo giữa hai khách hàng', en: 'An automated cross-leakage test: 50 cross-tenant questions between two customers' },
    { vi: 'Video chứng minh xoá điều kiện lọc thì kết quả RỖNG chứ không rò dữ liệu', en: 'A video proving that removing the filter yields EMPTY rather than leaked data' },
    { vi: 'Bộ mẫu tiêm lời nhắc và bảng kết quả bot chống được cái nào', en: 'A prompt-injection corpus with a table of which attacks the bot resists' },
    { vi: 'Biểu đồ chi phí mỗi câu trả lời trước và sau khi thêm đệm và xếp hạng lại', en: 'Cost per answer before and after adding caching and reranking' },
    { vi: 'Bộ câu hỏi vàng công khai, kèm điểm số qua từng phiên bản lời nhắc', en: 'A public golden question set with scores across prompt versions' },
  ],

  completionOutcomes: [
    { vi: 'Xây được sản phẩm AI bán được cho doanh nghiệp, không chỉ bản demo', en: 'Build an AI product an enterprise would buy, not merely a demo' },
    { vi: 'Thiết kế hệ thống mà chế độ hỏng an toàn hơn chế độ hỏng nguy hiểm', en: 'Design systems whose failure modes are safe rather than dangerous' },
    { vi: 'Hiểu ranh giới an ninh của ứng dụng dùng mô hình ngôn ngữ', en: 'Understand the security boundaries of language-model applications' },
    { vi: 'Đo chất lượng thứ không tất định, và cải thiện nó bằng số', en: 'Measure the quality of something non-deterministic and improve it numerically' },
    { vi: 'Coi chi phí vận hành mô hình là ràng buộc thiết kế ngay từ đầu', en: 'Treat model operating cost as a design constraint from the start' },
  ],

  bodyMdx,
  bodyMdxEn,
};
