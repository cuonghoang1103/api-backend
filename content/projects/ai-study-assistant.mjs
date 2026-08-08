/**
 * Case-study INT609 — AI Study Assistant (RAG chatbot).
 * Semester 6 internship project #9.
 *
 * Its place in the through-line: the first project where the right answer is
 * NOT unique and checkable, so the semester's "prove it with an assert" habit
 * stops working. The subject becomes making a non-deterministic system
 * trustworthy — grounding, mandatory citations, an honest refusal, and evals
 * that check PROPERTIES rather than exact strings.
 *
 * Deliberately narrower than /projects/ai-chatbot-platform-multi-tenant,
 * which is the multi-tenant platform version of the same technology.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./ai-study-assistant.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./ai-study-assistant.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'ai-study-assistant',
  title: 'AI Study Assistant (Đồ án thực tập #9)',
  titleEn: 'AI Study Assistant (Internship Project #9)',
  description:
    'Đồ án #9 Kỳ 6: RAG chatbot bằng Next.js 14 + pgvector + LLM. Lần đầu câu trả lời đúng KHÔNG duy nhất và không assert được — ảo giác là hành vi mặc định của mô hình, không phải lỗi hiếm. Cách chữa không phải "dùng mô hình xịn hơn" mà là neo vào tài liệu có thật, buộc trích dẫn [n], và cho phép mô hình nói không biết.',
  descriptionEn:
    'Semester 6 project #9: a RAG chatbot in Next.js 14 with pgvector and an LLM. The first time the right answer is NOT unique and cannot be asserted — hallucination is the model\'s default behaviour, not a rare bug. The cure is not "a better model" but grounding in real documents, mandatory [n] citations, and permission to say it does not know.',
  techStack: [
    'Next.js 14 (App Router)', 'Route Handlers', 'TypeScript', 'Prisma',
    'PostgreSQL', 'pgvector', 'OpenAI-compatible LLM API', 'Streaming (SSE)',
    'Auth.js', 'zod', 'Docker Compose',
  ],
  role: 'Full-stack + AI (một người)',
  roleEn: 'Full-stack + AI (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'AI',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/ai-study-assistant.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- pgvector biến PostgreSQL thành cơ sở dữ liệu vector. Không cần
-- thêm dịch vụ nào ở quy mô một đồ án thực tập — và giữ được mọi
-- ràng buộc quan hệ, kể cả bộ lọc chủ sở hữu.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id          BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  -- SAO CHÉP XUỐNG từ documents, cố ý phi chuẩn hoá: truy vấn vector
  -- chạy trên CHÍNH bảng này, nên bộ lọc chủ sở hữu phải nằm NGAY TRONG
  -- truy vấn đó chứ không phải sau một phép nối. Rò rỉ dữ liệu ở đây
  -- không hiện ra như một bản ghi lạ — nó TAN VÀO câu trả lời.
  owner_id    TEXT   NOT NULL,
  content     TEXT   NOT NULL,
  embedding   vector(1536) NOT NULL,
  -- GHI LẠI tên mô hình nhúng. Vector của hai mô hình khác nhau nằm ở
  -- hai KHÔNG GIAN khác nhau; khoảng cách giữa chúng là số vô nghĩa.
  -- Đổi mô hình ⇒ phải nhúng lại TOÀN BỘ kho.
  embedding_model TEXT NOT NULL,
  token_count INT    NOT NULL
);

-- Chỉ mục xấp xỉ láng giềng gần nhất. lists ≈ sqrt(số hàng) là điểm
-- khởi đầu hợp lý; phải ANALYZE sau khi nạp dữ liệu thì mới có tác dụng.
CREATE INDEX idx_chunk_embedding ON chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Bộ lọc chủ sở hữu chạy TRƯỚC khi xếp hạng vector.
CREATE INDEX idx_chunk_owner ON chunks (owner_id);

-- Truy vấn truy hồi:
--   SELECT id, content FROM chunks
--    WHERE owner_id = :me AND embedding_model = :model
--    ORDER BY embedding <=> :question_embedding
--    LIMIT 6;

CREATE TABLE messages (
  id                BIGSERIAL PRIMARY KEY,
  conversation_id   BIGINT NOT NULL REFERENCES conversations(id),
  role              VARCHAR(16) NOT NULL,        -- USER | ASSISTANT
  content           TEXT NOT NULL,
  prompt_tokens     INT,                          -- để cộng ra chi phí thật
  completion_tokens INT,
  -- Biến LỜI TỪ CHỐI thành SỐ ĐO. Tỉ lệ từ chối tăng đột ngột nghĩa là
  -- truy hồi đang hỏng — không ghi lại thì chỉ biết khi có người phàn nàn.
  refused           BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  schemaCodeEn: `-- pgvector turns PostgreSQL into a vector database. At internship-project
-- scale you need no extra service — and you keep every relational
-- constraint, including the ownership filter.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id          BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  -- COPIED DOWN from documents, deliberately denormalised: the vector search
  -- runs on THIS table, so the ownership filter must sit INSIDE that query
  -- rather than behind a join. A leak here does not surface as a stray
  -- record — it DISSOLVES INTO the answer.
  owner_id    TEXT   NOT NULL,
  content     TEXT   NOT NULL,
  embedding   vector(1536) NOT NULL,
  -- RECORD the embedding model. Vectors from two models live in two
  -- different SPACES; the distance between them is a meaningless number.
  -- Changing models ⇒ re-embed the ENTIRE corpus.
  embedding_model TEXT NOT NULL,
  token_count INT    NOT NULL
);

-- An approximate nearest-neighbour index. lists ≈ sqrt(row count) is a
-- reasonable start; you must ANALYZE after loading data for it to help.
CREATE INDEX idx_chunk_embedding ON chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- The ownership filter runs BEFORE vector ranking.
CREATE INDEX idx_chunk_owner ON chunks (owner_id);

-- The retrieval query:
--   SELECT id, content FROM chunks
--    WHERE owner_id = :me AND embedding_model = :model
--    ORDER BY embedding <=> :question_embedding
--    LIMIT 6;

CREATE TABLE messages (
  id                BIGSERIAL PRIMARY KEY,
  conversation_id   BIGINT NOT NULL REFERENCES conversations(id),
  role              VARCHAR(16) NOT NULL,        -- USER | ASSISTANT
  content           TEXT NOT NULL,
  prompt_tokens     INT,                          -- to sum a real cost
  completion_tokens INT,
  -- Turns a REFUSAL into a METRIC. A sudden rise in the refusal rate means
  -- retrieval is broken — without recording it you find out from complaints.
  refused           BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chấp nhận rằng ảo giác là hành vi mặc định',
      titleEn: 'Accepting that hallucination is the default behaviour',
      description:
        'Mô hình ngôn ngữ KHÔNG tra cứu; nó dự đoán chuỗi có khả năng cao. Khi không biết, nó vẫn sinh ra chuỗi có khả năng cao — trông y hệt một câu trả lời đúng, và thường mở đầu bằng "theo ghi chú của bạn" dù chưa đọc ghi chú nào. Với hệ thống học tập, một câu trả lời không kiểm được thì vô giá trị.',
      descriptionEn:
        'A language model does NOT look things up; it predicts likely sequences. When it does not know, it still emits a likely sequence — indistinguishable from a correct answer, often opening with "according to your notes" having read none. For a learning system, an answer you cannot check is worthless.',
    },
    {
      phase: 'DATABASE',
      title: 'pgvector: cắt đoạn, nhúng, đánh chỉ mục',
      titleEn: 'pgvector: chunk, embed, index',
      description:
        'Ba quyết định hay bị sai: đoạn phải CHỒNG LẤN (~10%) nếu không một câu bị chẻ đôi và không đoạn nào đủ ý; câu hỏi và tài liệu phải nhúng bằng CÙNG một mô hình vì vector hai mô hình nằm ở hai không gian; và tên mô hình nhúng phải ghi vào từng hàng, vì đổi mô hình nghĩa là nhúng lại toàn bộ kho.',
      descriptionEn:
        'Three decisions that routinely go wrong: chunks must OVERLAP (~10%) or a sentence is split and neither half can answer; question and documents must use the SAME embedding model since two models produce two different spaces; and the model name must be stored per row, because changing it means re-embedding everything.',
    },
    {
      phase: 'SECURITY',
      title: 'Cách ly dữ liệu nằm TRONG truy vấn truy hồi',
      titleEn: 'Data isolation lives INSIDE the retrieval query',
      description:
        'WHERE owner_id = :me phải nằm trong chính truy vấn vector, không phải lọc sau. Đây là bài học userId-trong-mệnh-đề-where của đồ án Todo, nhưng hậu quả nặng hơn nhiều: rò rỉ không hiện ra dưới dạng một bản ghi lạ mà TAN VÀO câu trả lời bằng văn xuôi, nơi không ai nhìn thấy và không log nào bắt được.',
      descriptionEn:
        'WHERE owner_id = :me must be inside the vector query itself, never a post-filter. This is the Todo project\'s userId-in-the-where lesson, but with far worse consequences: a leak does not appear as a stray record, it DISSOLVES into prose where nobody sees it and no log catches it.',
      codeBlock:
        'SELECT id, content FROM chunks\n'
        + ' WHERE owner_id = :me            -- ← cách ly, TRONG truy vấn\n'
        + '   AND embedding_model = :model  -- ← không trộn hai không gian vector\n'
        + ' ORDER BY embedding <=> :question_embedding\n'
        + ' LIMIT 6;',
      codeLang: 'sql',
    },
    {
      phase: 'AI',
      title: 'Lời nhắc là mã nguồn: chỉ dẫn phải dứt khoát',
      titleEn: 'The prompt is code: the instruction must be absolute',
      description:
        'Cái bẫy tinh vi nhất của đồ án: truy hồi ngữ cảnh mà không RÀNG BUỘC mô hình vào nó thì gần như vô ích. Lời nhắc chỉ "mời" ("đây là một số ghi chú, có thể hữu ích") sẽ khiến mô hình trộn kiến thức huấn luyện vào và bịa thuyết phục hơn, vì giờ có vài đoạn thật đứng cạnh. Phải có câu từ chối BẮT BUỘC, ghi nguyên văn.',
      descriptionEn:
        'The subtlest trap here: retrieving context without CONSTRAINING the model to it is nearly useless. A prompt that merely offers ("here are some notes that may help") lets the model blend in training knowledge and invent more convincingly, because real passages now sit beside the fabrication. You need a MANDATORY refusal string, quoted verbatim.',
      codeBlock:
        'const system = `Bạn là trợ lý học tập. CHỈ trả lời dựa vào NGỮ CẢNH bên dưới.\n'
        + 'Trích nguồn cho mỗi ý bằng [n]. Nếu câu trả lời KHÔNG có trong ngữ cảnh,\n'
        + 'hãy trả lời đúng câu: "Tôi không tìm thấy điều đó trong ghi chú của bạn."\n'
        + 'Không dùng kiến thức bên ngoài.`;',
      codeLang: 'typescript',
    },
    {
      phase: 'SECURITY',
      title: 'Khoá LLM không bao giờ tới trình duyệt',
      titleEn: 'The LLM key never reaches the browser',
      description:
        'Đặt tên biến NEXT_PUBLIC_* là nướng khoá thẳng vào gói JavaScript — chính hệ thống bạn đang đọc từng mất một tính năng vì lỗi này. Với LLM, hậu quả không chỉ là lộ khoá mà là HOÁ ĐƠN. Đi qua Route Handler còn cho thêm ba thứ: giới hạn tần suất theo người dùng, ghi log token và chi phí, và đổi nhà cung cấp mà không đụng client.',
      descriptionEn:
        'Naming the variable NEXT_PUBLIC_* bakes the key straight into the JS bundle — the very system you are reading once lost a feature to this. With an LLM the consequence is not just a leaked key but a BILL. Going through a Route Handler also buys three things: per-user rate limiting, token and cost logging, and swapping providers without touching the client.',
    },
    {
      phase: 'BACKEND',
      title: 'Phát trực tiếp, và dừng khi client ngắt kết nối',
      titleEn: 'Streaming, and stopping when the client disconnects',
      description:
        'Người dùng thấy token đầu tiên sau ~300ms thay vì chờ 8 giây cho cả câu trả lời — đó là khác biệt giữa "chậm" và "hỏng" trong cảm nhận. Nhưng phải truyền AbortSignal xuống tận lời gọi LLM: người dùng đóng tab mà máy chủ vẫn sinh nốt 800 token là tiền thật bị đốt cho một câu trả lời không ai đọc.',
      descriptionEn:
        'Users see the first token in ~300ms instead of waiting eight seconds for a complete answer — that is the difference between feeling slow and feeling broken. But pass an AbortSignal all the way into the LLM call: a user closing the tab while the server generates another 800 tokens is real money burned on an answer nobody reads.',
    },
    {
      phase: 'AI',
      title: 'Kiểm trích dẫn sau khi sinh, không tin mô hình',
      titleEn: 'Validate citations after generation, do not trust the model',
      description:
        'Mô hình có thể viết [7] khi bạn chỉ đưa 6 đoạn. Sau mỗi câu trả lời, quét mọi [n] và đối chiếu với danh sách đoạn đã truy hồi; cái nào mồ côi thì bỏ đi hoặc đánh dấu. Đây là chỗ thể hiện nguyên tắc chung: đầu ra của mô hình là DỮ LIỆU KHÔNG ĐÁNG TIN, phải qua kiểm tra như mọi dữ liệu vào khác.',
      descriptionEn:
        'The model may write [7] when you supplied six chunks. After each answer, scan every [n] against the retrieved list and drop or flag the orphans. This embodies the general principle: model output is UNTRUSTED INPUT and must be validated like any other.',
    },
    {
      phase: 'TESTING',
      title: 'Eval chống bịa: nhiệt độ 0 và mô hình ghim phiên bản',
      titleEn: 'The anti-fabrication eval: temperature 0 and a pinned model',
      description:
        'Nạp một tài liệu CỐ TÌNH không chứa một sự thật, hỏi đúng sự thật đó, và bài kiểm THẤT BẠI nếu câu trả lời khẳng định bất kỳ con số nào. Chạy được trong CI, bắt được điều không unit test nào bắt. Chi tiết sống còn: nhiệt độ 0 và ghim phiên bản mô hình, nếu không bài kiểm đỏ ngẫu nhiên và cả đội sẽ tập thói quen bỏ qua — lúc đó nó tệ hơn không có.',
      descriptionEn:
        'Load a document that DELIBERATELY omits a fact, ask for it, and fail the check if the answer asserts any number. It runs in CI and catches what no unit test can. The critical detail: temperature 0 and a pinned model version, otherwise it goes red at random, the team learns to ignore it, and it becomes worse than nothing.',
    },
  ],

  features: [
    { title: 'Tải lên và nạp tài liệu chạy nền', titleEn: 'Upload and background ingestion', description: 'PDF/Markdown/văn bản, cắt đoạn có chồng lấn, nhúng theo hàng đợi, có trạng thái xử lý.', descriptionEn: 'PDF/Markdown/text, overlapping chunks, queued embedding, with a processing status.', status: 'PLANNED' },
    { title: 'Tìm kiếm ngữ nghĩa bằng pgvector', titleEn: 'Semantic search on pgvector', description: 'Chỉ mục ivfflat, khoảng cách cosine, lọc chủ sở hữu ngay trong truy vấn.', descriptionEn: 'An ivfflat index, cosine distance, ownership filtered inside the query.', status: 'PLANNED' },
    { title: 'Trả lời có căn cứ kèm trích dẫn [n]', titleEn: 'Grounded answers with [n] citations', description: 'Mỗi khẳng định trỏ về một đoạn có thật, bấm vào mở được nguyên văn.', descriptionEn: 'Every claim points at a real chunk, clickable through to the source text.', status: 'PLANNED' },
    { title: 'Chốt chặn ảo giác', titleEn: 'A hallucination guard', description: 'Không đủ căn cứ thì trả lời câu từ chối cố định, và ghi lại thành số đo.', descriptionEn: 'Without grounding it returns a fixed refusal, recorded as a metric.', status: 'PLANNED' },
    { title: 'Phát trực tiếp có huỷ', titleEn: 'Cancellable streaming', description: 'Token đầu tiên trong ~300ms; client ngắt thì lời gọi LLM cũng dừng.', descriptionEn: 'First token in ~300ms; a client disconnect aborts the LLM call too.', status: 'PLANNED' },
    { title: 'Khoá API chỉ nằm ở máy chủ', titleEn: 'The API key lives only on the server', description: 'Route Handler làm trung gian; xoay khoá là khởi động lại container, không build lại.', descriptionEn: 'A Route Handler brokers every call; rotating the key is a restart, not a rebuild.', status: 'PLANNED' },
    { title: 'Giới hạn tần suất và kế toán token', titleEn: 'Rate limiting and token accounting', description: 'Giới hạn theo người dùng, ghi promptTokens/completionTokens cho mọi lượt.', descriptionEn: 'Per-user limits, with promptTokens/completionTokens recorded on every turn.', status: 'PLANNED' },
    { title: 'Eval chống bịa chạy trong CI', titleEn: 'An anti-fabrication eval in CI', description: 'Tài liệu thiếu sự thật + câu hỏi về sự thật đó; đỏ nếu AI khẳng định con số.', descriptionEn: 'A document missing a fact plus a question about it; red if the AI asserts a number.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'INT609 trên Academy — bản dạy từng bước', titleEn: 'INT609 on the Academy — the step-by-step course', url: 'https://cuongthai.com/courses/ai-study-assistant', type: 'LINK', description: '9 mục, 20 bài, song ngữ, kèm quiz và đề thi cuối kỳ.', descriptionEn: '9 sections, 20 lessons, bilingual, with quizzes and a final exam.' },
    { title: 'pgvector', titleEn: 'pgvector', url: 'https://github.com/pgvector/pgvector', type: 'REPO', description: 'Kiểu vector, toán tử <=>, và cách chọn tham số cho ivfflat/hnsw.', descriptionEn: 'The vector type, the <=> operator, and how to tune ivfflat/hnsw.' },
    { title: 'Anthropic — Reduce hallucinations', titleEn: 'Anthropic — Reduce hallucinations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations', type: 'DOC', description: 'Cho phép mô hình nói "không biết" là kỹ thuật, không phải sự nhượng bộ.', descriptionEn: 'Letting the model say "I don\'t know" is a technique, not a concession.' },
    { title: 'Anthropic — Create strong empirical evaluations', titleEn: 'Anthropic — Create strong empirical evaluations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests', type: 'DOC', description: 'Cách viết eval kiểm TÍNH CHẤT thay vì so chuỗi chính xác.', descriptionEn: 'How to write evals that check PROPERTIES instead of exact strings.' },
    { title: 'Vercel AI SDK — Streaming', titleEn: 'Vercel AI SDK — Streaming', url: 'https://sdk.vercel.ai/docs/foundations/streaming', type: 'DOC', description: 'Phát trực tiếp từ Route Handler và huỷ khi client ngắt kết nối.', descriptionEn: 'Streaming from a Route Handler and aborting on client disconnect.' },
    { title: 'OWASP Top 10 for LLM Applications', titleEn: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/', type: 'LINK', description: 'Tiêm lời nhắc, rò rỉ dữ liệu nhạy cảm, tiêu thụ tài nguyên không giới hạn.', descriptionEn: 'Prompt injection, sensitive-information disclosure, unbounded resource consumption.' },
  ],

  coreKnowledge: [
    { vi: 'Vì sao ảo giác là hành vi mặc định của mô hình ngôn ngữ, không phải lỗi hiếm', en: 'Why hallucination is a language model\'s default behaviour, not a rare bug' },
    { vi: 'RAG ba bước: cắt đoạn có chồng lấn, nhúng, truy hồi k gần nhất', en: 'Three-step RAG: overlapping chunks, embeddings, top-k retrieval' },
    { vi: 'Không gian vector: vì sao đổi mô hình nhúng là phải nhúng lại toàn bộ', en: 'Vector spaces: why changing the embedding model forces a full re-embed' },
    { vi: 'pgvector và chỉ mục xấp xỉ láng giềng gần nhất', en: 'pgvector and approximate nearest-neighbour indexing' },
    { vi: 'Lời nhắc là mã nguồn: chỉ dẫn dứt khoát so với lời gợi ý mềm', en: 'The prompt is code: absolute instructions versus soft suggestions' },
    { vi: 'Trích dẫn biến hộp đen thành công cụ kiểm chứng được', en: 'Citations turn a black box into a verifiable tool' },
    { vi: 'Cho phép mô hình từ chối, và biến lời từ chối thành số đo', en: 'Letting the model refuse, and turning refusals into a metric' },
    { vi: 'Đầu ra của mô hình là dữ liệu KHÔNG đáng tin, phải kiểm như dữ liệu vào', en: 'Model output is UNTRUSTED input and must be validated as such' },
    { vi: 'Khoá của bên thứ ba phải ở phía máy chủ — và vì sao với LLM nó là chuyện hoá đơn', en: 'Third-party keys belong on the server — and why with an LLM it is a billing issue' },
    { vi: 'Viết eval cho hệ thống không tất định: nhiệt độ 0, ghim mô hình, kiểm tính chất', en: 'Evals for non-deterministic systems: temperature 0, pinned models, property checks' },
  ],

  portfolioBonus: [
    { vi: 'Đoạn quay cảnh hỏi một câu ngoài tài liệu và mô hình từ chối trung thực', en: 'A clip of asking something outside the documents and the model refusing honestly' },
    { vi: 'Bảng đo tỉ lệ từ chối và tỉ lệ trích dẫn hợp lệ trên 100 câu hỏi thật', en: 'A table of refusal rate and valid-citation rate over 100 real questions' },
    { vi: 'Truy hồi lai: cộng điểm tsvector với điểm vector rồi xếp hạng lại', en: 'Hybrid retrieval: blending tsvector scores with vector scores and re-ranking' },
    { vi: 'Bảng chi phí theo người dùng, cộng từ promptTokens/completionTokens', en: 'A per-user cost table summed from promptTokens/completionTokens' },
    { vi: 'Tự sinh thẻ ghi nhớ và câu hỏi ôn tập từ chính tài liệu đã nạp', en: 'Auto-generated flashcards and revision questions from the ingested documents' },
    { vi: 'Bộ eval trong CI có ngưỡng, và biểu đồ theo dõi qua các lần chạy', en: 'A CI eval suite with thresholds and a chart tracking it across runs' },
  ],

  completionOutcomes: [
    { vi: 'Xây được hệ thống RAG mà mọi khẳng định đều truy ngược được về nguồn', en: 'Build a RAG system where every claim traces back to a source' },
    { vi: 'Thiết kế lời nhắc như mã nguồn, có ràng buộc và có đường thoát trung thực', en: 'Design prompts like code, with constraints and an honest escape hatch' },
    { vi: 'Kiểm thử được một hệ thống không tất định bằng cách kiểm tính chất', en: 'Test a non-deterministic system by checking properties' },
    { vi: 'Bảo vệ khoá và ngân sách khi tích hợp một API tính tiền theo lượt dùng', en: 'Protect keys and budget when integrating a usage-billed API' },
    { vi: 'Nói được rõ ràng giới hạn của hệ thống mình xây — điều nhà tuyển dụng thật sự nghe', en: 'State clearly what your system cannot do — the thing interviewers actually listen for' },
  ],

  bodyMdx,
  bodyMdxEn,
};
