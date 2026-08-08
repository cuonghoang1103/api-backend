/**
 * Case-study 2.5 — Job Board Platform (LinkedIn-like).
 *
 * First project where ordering is RELEVANCE rather than time, so it is the
 * first that needs a scoring formula. Also the first where a design mistake
 * has consequences for a real person: a leaked "open to work" flag, or an
 * automated rejection nobody can explain six months later.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./job-board-platform-linkedin-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./job-board-platform-linkedin-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'job-board-platform-linkedin-like',
  title: 'Job Board Platform (LinkedIn-like)',
  titleEn: 'Job Board Platform (LinkedIn-like)',
  description:
    'Nền tảng tuyển dụng với tìm kiếm xếp theo mức độ liên quan, gợi ý ứng viên và theo dõi hồ sơ ứng tuyển. Dự án đầu tiên mà thứ tự hiển thị không còn là thời gian — và là dự án đầu tiên mà một lỗi thiết kế có thể khiến ai đó mất việc thật.',
  descriptionEn:
    'A hiring platform with relevance-ranked search, candidate matching and application tracking. The first project where ordering is not chronological — and the first where a design mistake can cost a real person their job.',
  techStack: [
    'Next.js 15', 'Node.js', 'TypeScript', 'PostgreSQL', 'Prisma',
    'Postgres FTS', 'pgvector', 'Redis', 'BullMQ', 'Resend', 'Zod', 'Cloudflare R2',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '4–5 tuần',
  durationEn: '4–5 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Cột tìm kiếm sinh tự động, có TRỌNG SỐ theo vị trí xuất hiện:
-- cùng một từ nằm ở tiêu đề đáng giá hơn nằm lẫn trong đoạn phúc lợi.
ALTER TABLE jobs ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', array_to_string(skills, ' ')), 'B') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

-- GIN là loại chỉ mục cho tsvector. Không có nó thì mọi thứ trên vô nghĩa
-- và truy vấn quay về quét toàn bảng.
CREATE INDEX jobs_search_idx ON jobs USING GIN (search_vector);

CREATE TABLE candidate_profiles (
    id          TEXT        PRIMARY KEY,
    user_id     TEXT        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    headline    TEXT,
    resume_url  TEXT,
    -- Mặc định KÍN. Người dùng chủ động mở ra, không phải đi tìm nút tắt.
    visibility  VARCHAR(16) NOT NULL DEFAULT 'PRIVATE',
    -- Ứng viên chặn đích danh công ty hiện tại. Điều kiện này phải nằm
    -- trong WHERE của truy vấn tìm ứng viên, KHÔNG phải ở tầng giao diện —
    -- dữ liệu đã rời database là dữ liệu đã rò rỉ.
    blocked_company_ids TEXT[] NOT NULL DEFAULT '{}',
    open_to_work BOOLEAN    NOT NULL DEFAULT false,
    embedding   vector(1536)
);

-- HNSW cho tìm kiếm vector xấp xỉ. Nhúng MỘT LẦN khi hồ sơ đổi,
-- không nhúng lại mỗi lần tìm kiếm (đó là cách hoá đơn vượt ngân sách).
CREATE INDEX candidate_embedding_idx ON candidate_profiles
    USING hnsw (embedding vector_cosine_ops);

CREATE TABLE applications (
    id           TEXT        PRIMARY KEY,
    job_id       TEXT        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status       VARCHAR(16) NOT NULL DEFAULT 'APPLIED',
    -- Ghi chú nội bộ của nhà tuyển dụng. Ứng viên KHÔNG BAO GIỜ được đọc —
    -- bảo vệ bằng cách chọn cột tường minh, không dựa vào giao diện.
    recruiter_notes TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, candidate_id)
);

CREATE TABLE match_scores (
    id           TEXT        PRIMARY KEY,
    job_id       TEXT        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score        REAL        NOT NULL,
    -- Kỹ năng khớp và kỹ năng thiếu, dạng có đọc được. Sáu tháng sau có
    -- người hỏi "vì sao hồ sơ tôi bị loại" thì đây là câu trả lời.
    explanation  JSONB       NOT NULL DEFAULT '{}',
    model_version VARCHAR(32) NOT NULL,
    computed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, candidate_id)
);

CREATE TABLE alert_deliveries (
    alert_id TEXT        NOT NULL,
    job_id   TEXT        NOT NULL,
    sent_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Khoá chính kép: cron chạy lại thì lần gửi thứ hai bị DATABASE từ chối,
    -- thay vì tin rằng mã ứng dụng chạy đúng một lần.
    PRIMARY KEY (alert_id, job_id)
);`,

  schemaCodeEn: `-- A generated search column with WEIGHTS by position: the same word in a
-- title is worth more than one buried in the benefits paragraph.
ALTER TABLE jobs ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('english', array_to_string(skills, ' ')), 'B') ||
      setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) STORED;

-- GIN is the index type for tsvector. Without it none of the above matters
-- and the query falls back to a full table scan.
CREATE INDEX jobs_search_idx ON jobs USING GIN (search_vector);

CREATE TABLE candidate_profiles (
    id          TEXT        PRIMARY KEY,
    user_id     TEXT        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    headline    TEXT,
    resume_url  TEXT,
    -- Closed by DEFAULT. Users opt out of privacy; they do not hunt for
    -- an off switch.
    visibility  VARCHAR(16) NOT NULL DEFAULT 'PRIVATE',
    -- A candidate blocks their current employer by name. This condition must
    -- live in the WHERE clause of candidate search, NOT in the UI layer —
    -- data that has left the database has already leaked.
    blocked_company_ids TEXT[] NOT NULL DEFAULT '{}',
    open_to_work BOOLEAN    NOT NULL DEFAULT false,
    embedding   vector(1536)
);

-- HNSW for approximate vector search. Embed ONCE when the profile changes,
-- never per search (that is how the model bill overruns the budget).
CREATE INDEX candidate_embedding_idx ON candidate_profiles
    USING hnsw (embedding vector_cosine_ops);

CREATE TABLE applications (
    id           TEXT        PRIMARY KEY,
    job_id       TEXT        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status       VARCHAR(16) NOT NULL DEFAULT 'APPLIED',
    -- Internal recruiter notes. The candidate must NEVER read these —
    -- enforced by explicit column selection, not by the interface.
    recruiter_notes TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, candidate_id)
);

CREATE TABLE match_scores (
    id           TEXT        PRIMARY KEY,
    job_id       TEXT        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score        REAL        NOT NULL,
    -- Matching and missing skills in readable form. Six months later someone
    -- asks "why was I rejected" and this is the answer.
    explanation  JSONB       NOT NULL DEFAULT '{}',
    model_version VARCHAR(32) NOT NULL,
    computed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, candidate_id)
);

CREATE TABLE alert_deliveries (
    alert_id TEXT        NOT NULL,
    job_id   TEXT        NOT NULL,
    sent_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Composite primary key: if the cron reruns, the DATABASE rejects the
    -- second send, rather than trusting application code to run exactly once.
    PRIMARY KEY (alert_id, job_id)
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chấp nhận rằng thứ tự hiển thị là một quyết định sản phẩm',
      titleEn: 'Accept that result ordering is a product decision',
      description:
        'Ở các dự án trước, thứ tự là thời gian và không ai tranh cãi. Ở đây phải trả lời "tin nào đáng đứng đầu" — câu hỏi không có đáp án đúng tuyệt đối. Viết trọng số ra thành hằng số có tên ngay từ đầu, vì bạn sẽ sửa chúng nhiều lần và chỉ biết đúng sai qua số đo trên người dùng thật.',
      descriptionEn:
        'In earlier projects ordering was chronological and uncontroversial. Here you must answer "which posting deserves the top slot" — a question with no absolutely correct answer. Write the weights as named constants from day one, because you will change them repeatedly and only measurements on real users settle it.',
    },
    {
      phase: 'BACKEND',
      title: 'Tìm kiếm toàn văn có trọng số, không phải ILIKE',
      titleEn: 'Weighted full-text search, not ILIKE',
      description:
        'ILIKE với % ở đầu chuỗi không dùng được chỉ mục, không hiểu biến thể của từ, và không có thứ hạng. Dùng tsvector sinh tự động với setweight A/B/C cho tiêu đề / kỹ năng / mô tả, chỉ mục GIN, và websearch_to_tsquery — cái này nhận cú pháp người dùng đã quen từ Google và KHÔNG ném lỗi khi gặp chuỗi kỳ quặc.',
      descriptionEn:
        'ILIKE with a leading % cannot use an index, does not understand word forms, and produces no ranking. Use a generated tsvector with setweight A/B/C over title / skills / description, a GIN index, and websearch_to_tsquery — which accepts the syntax users know from Google and does NOT throw on strange input.',
      codeBlock:
        'SELECT j.*,\n'
        + '       ts_rank(j.search_vector, q) AS text_score\n'
        + "  FROM jobs j, websearch_to_tsquery('english', $1) q\n"
        + ' WHERE j.search_vector @@ q\n'
        + "   AND j.status = 'ACTIVE'\n"
        + ' ORDER BY text_score DESC\n'
        + ' LIMIT 20;',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Quyền riêng tư nằm trong WHERE, không nằm ở giao diện',
      titleEn: 'Privacy lives in WHERE, not in the interface',
      description:
        'Ứng viên đang đi làm không muốn công ty hiện tại biết họ đang tìm việc. Lọc ở tầng hiển thị nghĩa là hồ sơ vẫn nằm trong JSON và mở tab Network là thấy. Mặc định hồ sơ mới là PRIVATE; danh sách công ty bị chặn phải là điều kiện trong truy vấn, chạy TRƯỚC bước xếp hạng.',
      descriptionEn:
        'An employed candidate does not want their current employer to know they are looking. Filtering at the presentation layer means the profile is still in the JSON and the Network tab reveals it. New profiles default to PRIVATE, and the blocked-company list must be a query condition evaluated BEFORE ranking.',
      codeBlock:
        'SELECT c.id, 1 - (c.embedding <=> $1::vector) AS semantic_score\n'
        + '  FROM candidate_profiles c\n'
        + " WHERE c.visibility <> 'PRIVATE'\n"
        + '   AND NOT ($2 = ANY(c.blocked_company_ids))   -- quyền riêng tư TRƯỚC\n'
        + ' ORDER BY c.embedding <=> $1::vector\n'
        + ' LIMIT 50;',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Chấm điểm hai tầng: quy tắc trước, vector sau, con người quyết',
      titleEn: 'Two-layer scoring: rules first, vectors second, humans decide',
      description:
        'Gọi thẳng mô hình sinh để lấy điểm 0–100 là sai bốn lần: không tái lập được, đắt, không giải trình được, và học lại thiên kiến trong dữ liệu tuyển dụng quá khứ. Tầng quy tắc tường minh làm phần lớn việc và giải thích được bằng tiếng Việt; vector chỉ bắt phần quy tắc bỏ sót. Điểm số để SẮP XẾP cho người xem, không để tự động loại ai.',
      descriptionEn:
        'Asking a generative model for a 0–100 score is wrong four times over: not reproducible, expensive, unexplainable, and it relearns the bias in historical hiring data. The explicit rule layer does most of the work and explains itself in plain language; vectors only catch what rules miss. Scores ORDER a list for a human — they never auto-reject.',
      codeBlock:
        '// Trọng số là GIẢ THIẾT, không phải chân lý — đặt tên để còn sửa được.\n'
        + 'const WEIGHTS = {\n'
        + '  text: 1.0,\n'
        + '  freshness: 0.4,\n'
        + '  completeness: 0.2,\n'
        + '  skillOverlap: 0.6,\n'
        + '};\n'
        + '\n'
        + '// Suy giảm theo hàm mũ: 7 ngày còn ~0.5, 30 ngày còn ~0.06.\n'
        + 'const freshness = Math.exp(-daysSincePosted / 10);',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Cảnh báo việc làm không gửi trùng',
      titleEn: 'Job alerts that never send twice',
      description:
        'Cron chạy lại sau khi worker khởi động lại là chuyện bình thường, và ứng viên nhận hai email giống hệt là hậu quả. Ghi nhận đã gửi gì cho ai vào một bảng có khoá chính kép, rồi lọc bằng NOT EXISTS — lần thứ hai bị database từ chối. Giới hạn 10 tin mỗi email, nếu không bộ lọc rộng sinh ra thư 200 tin không ai đọc.',
      descriptionEn:
        'Crons rerunning after a worker restart is routine, and duplicate emails are the consequence. Record what was sent to whom in a table with a composite primary key and filter with NOT EXISTS — the second send is rejected by the database. Cap at 10 postings per email, or a broad filter produces a 200-item message nobody reads.',
    },
    {
      phase: 'BACKEND',
      title: 'Vòng đời hồ sơ ứng tuyển có thời hạn',
      titleEn: 'An application lifecycle with deadlines',
      description:
        'Im lặng vô hạn là trải nghiệm tệ nhất của mọi nền tảng tuyển dụng. Quá 30 ngày không đổi trạng thái thì tự chuyển sang REJECTED và báo cho ứng viên. Thêm trạng thái WITHDRAWN để ứng viên rút hồ sơ — gần như không tốn gì để làm và là một trong số ít chỗ trả quyền kiểm soát về phía yếu thế hơn.',
      descriptionEn:
        'Indefinite silence is the worst experience every hiring platform delivers. After 30 days with no status change, auto-transition to REJECTED and notify the candidate. Add a WITHDRAWN state so candidates can pull out — nearly free to build, and one of the few places control goes back to the less powerful side.',
    },
    {
      phase: 'BACKEND',
      title: 'Đọc CV từ PDF, và luôn cho sửa lại',
      titleEn: 'Parsing PDF résumés, always with a correction step',
      description:
        'PDF mô tả vị trí ký tự trên trang chứ không phải văn bản có cấu trúc — CV hai cột thường bóc ra chữ trộn lẫn. Giữ toạ độ, có nhánh OCR cho CV dạng ảnh scan, bóc trường bằng mô hình có ràng buộc schema, và hiển thị kết quả như BẢN NHÁP để ứng viên xác nhận. Chỉ số cần theo dõi là tỉ lệ người dùng phải sửa tay.',
      descriptionEn:
        'PDF describes glyph positions, not structured text — two-column CVs routinely interleave. Keep coordinates, add an OCR branch for scanned images, extract fields with a schema-constrained model, and present the result as a DRAFT for the candidate to confirm. The metric to watch is how often users have to fix it.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách tự tấn công quyền riêng tư của chính mình',
      titleEn: 'Verify by attacking your own privacy model',
      description:
        'Chặn một công ty, đăng nhập tài khoản nhà tuyển dụng của chính công ty đó rồi gọi thẳng API bằng curl — hồ sơ phải KHÔNG có trong JSON, không phải chỉ ẩn trên màn hình. Gọi API hồ sơ ứng tuyển bằng tài khoản ứng viên — phản hồi không được chứa ghi chú nội bộ. Chạy cron cảnh báo hai lần — lần hai gửi 0 email.',
      descriptionEn:
        'Block a company, log in as a recruiter at that same company and hit the API with curl — the profile must be ABSENT from the JSON, not merely hidden on screen. Fetch an application as the candidate — the response must not contain internal notes. Run the alert cron twice — the second run sends zero emails.',
    },
  ],

  features: [
    { title: 'Tìm kiếm toàn văn xếp theo mức độ liên quan', titleEn: 'Relevance-ranked full-text search', description: 'tsvector có trọng số theo vị trí, chỉ mục GIN, cú pháp kiểu Google.', descriptionEn: 'Positionally weighted tsvector, GIN index, Google-style query syntax.', status: 'PLANNED' },
    { title: 'Bộ lọc kết hợp: địa điểm, lương, hình thức, cấp độ', titleEn: 'Combined filters: location, salary, mode, seniority', description: 'Lọc cấu trúc chạy cùng truy vấn toàn văn trong một câu lệnh.', descriptionEn: 'Structured filters run alongside full-text matching in one statement.', status: 'PLANNED' },
    { title: 'Hồ sơ ứng viên có ba mức hiển thị', titleEn: 'Candidate profiles with three visibility levels', description: 'Mặc định kín, chặn được đích danh công ty hiện tại.', descriptionEn: 'Private by default, with per-company blocking.', status: 'PLANNED' },
    { title: 'Bóc CV từ PDF, có bước xác nhận', titleEn: 'PDF résumé extraction with a confirmation step', description: 'Nhánh OCR cho ảnh scan, kết quả hiện dạng bản nháp sửa được.', descriptionEn: 'An OCR branch for scans; results presented as an editable draft.', status: 'PLANNED' },
    { title: 'Gợi ý ứng viên ↔ việc làm giải trình được', titleEn: 'Explainable candidate ↔ job matching', description: 'Quy tắc tường minh cộng vector, lưu kỹ năng khớp và thiếu.', descriptionEn: 'Explicit rules plus vectors, storing matching and missing skills.', status: 'PLANNED' },
    { title: 'Theo dõi hồ sơ ứng tuyển qua từng vòng', titleEn: 'Application tracking through each stage', description: 'Tự đóng sau 30 ngày im lặng, ứng viên rút được bất cứ lúc nào.', descriptionEn: 'Auto-closes after 30 days of silence; candidates can withdraw any time.', status: 'PLANNED' },
    { title: 'Cảnh báo việc làm qua email, không trùng', titleEn: 'Deduplicated email job alerts', description: 'Bảng ghi nhận đã gửi với khoá chính kép, tối đa 10 tin mỗi thư.', descriptionEn: 'A delivery table with a composite key, capped at 10 postings per email.', status: 'PLANNED' },
    { title: 'Bảng điều khiển nhà tuyển dụng', titleEn: 'Recruiter dashboard', description: 'Đăng tin, xem hồ sơ, ghi chú nội bộ mà ứng viên không đọc được.', descriptionEn: 'Post jobs, review applications, keep notes the candidate cannot read.', status: 'PLANNED' },
    { title: 'Trang công ty và đánh giá', titleEn: 'Company pages and reviews', description: 'Thông tin lương tổng hợp, có ngưỡng tối thiểu để không lộ danh tính.', descriptionEn: 'Aggregated salary data with a minimum threshold so nobody is identifiable.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'PostgreSQL — Full Text Search', titleEn: 'PostgreSQL — Full Text Search', url: 'https://www.postgresql.org/docs/current/textsearch.html', type: 'LINK', description: 'tsvector, setweight, ts_rank và websearch_to_tsquery — toàn bộ tầng tìm kiếm ở đây.', descriptionEn: 'tsvector, setweight, ts_rank and websearch_to_tsquery — the whole search layer here.' },
    { title: 'PostgreSQL — GIN and GiST index types', titleEn: 'PostgreSQL — GIN and GiST index types', url: 'https://www.postgresql.org/docs/current/textsearch-indexes.html', type: 'LINK', description: 'Vì sao GIN là lựa chọn đúng cho tsvector, và cái giá lúc ghi.', descriptionEn: 'Why GIN is the right choice for tsvector, and what it costs on write.' },
    { title: 'pgvector', titleEn: 'pgvector', url: 'https://github.com/pgvector/pgvector', type: 'REPO', description: 'Lưu và tìm vector ngay trong Postgres, chỉ mục HNSW, toán tử khoảng cách cosine.', descriptionEn: 'Store and search vectors inside Postgres: HNSW indexes and cosine distance operators.' },
    { title: 'Amazon scraps secret AI recruiting tool that showed bias against women', titleEn: 'Amazon scraps secret AI recruiting tool that showed bias against women', url: 'https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G', type: 'LINK', description: 'Trường hợp thật, đáng đọc trước khi viết bất kỳ dòng nào chấm điểm hồ sơ.', descriptionEn: 'A real case worth reading before writing a single line that scores résumés.' },
    { title: 'Introduction to Information Retrieval — Scoring and term weighting', titleEn: 'Introduction to Information Retrieval — Scoring and term weighting', url: 'https://nlp.stanford.edu/IR-book/html/htmledition/scoring-term-weighting-and-the-vector-space-model-1.html', type: 'LINK', description: 'Nền lý thuyết của tf-idf và mô hình không gian vector — cơ sở của mọi công thức xếp hạng.', descriptionEn: 'The theory behind tf-idf and the vector space model — the basis of every ranking formula.' },
  ],

  coreKnowledge: [
    { vi: 'Chỉ mục ngược: vì sao tìm kiếm phải lật ngược cấu trúc dữ liệu lại', en: 'Inverted indexes: why search must turn the data structure inside out' },
    { vi: 'Tách từ, chuẩn hoá gốc từ, từ dừng — đường ống xử lý văn bản', en: 'Tokenising, stemming and stop words — the text processing pipeline' },
    { vi: 'Xếp hạng: tổ hợp nhiều tín hiệu, và cách đo xem tổ hợp nào tốt hơn', en: 'Ranking: combining signals, and measuring which combination is better' },
    { vi: 'Tìm kiếm vector và pgvector: khi nào ngữ nghĩa hơn từ khoá', en: 'Vector search and pgvector: when semantics beat keywords' },
    { vi: 'Kiểm soát truy cập theo hàng: đưa điều kiện quyền vào truy vấn', en: 'Row-level access control: pushing authorisation into the query' },
    { vi: 'Thiết kế mặc định riêng tư và hệ quả của việc chọn mặc định mở', en: 'Privacy-by-default design, and what an open default really costs' },
    { vi: 'Trách nhiệm giải trình của hệ thống tự động: lưu vết, giải thích, không tự quyết', en: 'Accountability in automated systems: audit trails, explanations, no autonomous decisions' },
    { vi: 'Tính lặp lại được của tác vụ định kỳ: ghi nhận đã làm gì thay vì tin cron chạy đúng một lần', en: 'Idempotent scheduled jobs: record what was done instead of trusting the cron ran once' },
  ],

  portfolioBonus: [
    { vi: 'So sánh cùng một truy vấn qua ILIKE và qua tsvector, kèm EXPLAIN ANALYZE của cả hai', en: 'The same query through ILIKE and through tsvector, with EXPLAIN ANALYZE for both' },
    { vi: 'Bài kiểm tra thiên kiến: cùng bộ hồ sơ đổi tên và trường học, đối chiếu điểm', en: 'A bias test: identical résumés with names and universities swapped, scores compared' },
    { vi: 'Mục README về mô hình quyền riêng tư: ai thấy được gì, và vì sao mặc định là kín', en: 'A README section on the privacy model: who sees what, and why the default is closed' },
    { vi: 'Chỉ số chất lượng tìm kiếm đo được (MRR hoặc NDCG) trước và sau khi đổi trọng số', en: 'Measured search quality (MRR or NDCG) before and after a weighting change' },
    { vi: 'Video quay lại việc chặn công ty rồi tự gọi API bằng tài khoản công ty đó', en: 'A recording of blocking a company then calling the API as that company' },
  ],

  completionOutcomes: [
    { vi: 'Xây được tìm kiếm thật, hiểu vì sao so khớp chuỗi không phải tìm kiếm', en: 'Build genuine search, and understand why string matching is not search' },
    { vi: 'Thiết kế công thức xếp hạng và biết cách chứng minh nó tốt hơn bằng số', en: 'Design a ranking formula and prove it is better with numbers' },
    { vi: 'Đưa quyền riêng tư vào tầng dữ liệu thay vì tầng hiển thị', en: 'Enforce privacy at the data layer rather than the presentation layer' },
    { vi: 'Dùng mô hình một cách chịu trách nhiệm được: giải thích, lưu vết, giữ con người ở khâu quyết định', en: 'Use models accountably: explain, audit, and keep humans in the decision' },
    { vi: 'Nhận ra khi nào một quyết định kỹ thuật có hậu quả cho người thật', en: 'Recognise when a technical decision has consequences for real people' },
  ],

  bodyMdx,
  bodyMdxEn,
};
