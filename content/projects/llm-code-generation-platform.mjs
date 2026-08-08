/**
 * Case-study 5.5 — LLM-Powered Code Generation Platform (Cursor-like).
 *
 * Two ideas separate it from every other AI project here: code is a GRAPH,
 * not text (so the retrieval unit is a symbol plus its dependency closure),
 * and code is VERIFIABLE (so generate → compile → test → self-repair is
 * possible at all, which is what turns a demo into a tool).
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./llm-code-generation-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./llm-code-generation-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'llm-code-generation-platform',
  title: 'LLM-Powered Code Generation Platform (Cursor-like)',
  titleEn: 'LLM-Powered Code Generation Platform (Cursor-like)',
  description:
    'Trợ lý lập trình đọc được cả kho mã: đánh chỉ mục theo cấu trúc, truy xuất theo đồ thị phụ thuộc, và vòng lặp sinh → biên dịch → kiểm thử → tự sửa. Hai điều làm nó khác mọi ứng dụng AI khác trong lộ trình: mã nguồn là ĐỒ THỊ chứ không phải văn bản, và mã nguồn KIỂM CHỨNG ĐƯỢC.',
  descriptionEn:
    'A coding assistant that reads a whole repository: structural indexing, dependency-graph retrieval, and a generate → compile → test → self-repair loop. Two things separate it from every other AI project here: code is a GRAPH rather than text, and code is VERIFIABLE.',
  techStack: [
    'TypeScript', 'Rust', 'tree-sitter', 'Language Server Protocol', 'pgvector',
    'PostgreSQL', 'Redis', 'Docker', 'gVisor', 'Next.js 15', 'Monaco',
  ],
  role: 'Full-stack / công cụ lập trình (một người)',
  roleEn: 'Full-stack / developer tooling (solo)',
  duration: '12–14 tuần',
  durationEn: '12–14 weeks',
  status: 'PLANNING',
  category: 'AI',
  difficulty: 'EXPERT',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/llm-code-generation-platform.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- MÃ NGUỒN KHÔNG PHẢI VĂN BẢN. NÓ LÀ MỘT ĐỒ THỊ.
-- Cắt tệp thành đoạn 800 ký tự rồi nhúng như tài liệu thì lấy về những đoạn
-- NÓI VỀ chủ đề — bình luận, kiểm thử, tài liệu — mà thiếu đúng những thứ
-- CẦN: định nghĩa kiểu, hàm được gọi, nơi gọi tới. Không phần nào trong số
-- đó nằm gần về mặt tương đồng văn bản, nhưng tất cả đều cần để sửa ĐÚNG.

CREATE TABLE symbols (
    id         TEXT   PRIMARY KEY,
    repo_id    TEXT   NOT NULL,
    file_path  TEXT   NOT NULL,
    -- ĐƠN VỊ truy xuất là KÝ HIỆU (hàm, lớp, kiểu), lấy từ cây cú pháp —
    -- KHÔNG phải đoạn 800 ký tự.
    kind       VARCHAR(16) NOT NULL,   -- FUNCTION CLASS TYPE METHOD
    name       TEXT   NOT NULL,
    start_line INTEGER NOT NULL,
    -- Kho 100.000 tệp thì đánh chỉ mục lại toàn bộ mỗi lần sửa là không dùng
    -- được. Băm nội dung ⇒ chỉ đánh lại ký hiệu thật sự đổi.
    content_hash VARCHAR(64) NOT NULL,
    embedding  vector(1536)
);

-- Cạnh đồ thị là thứ làm nên chất lượng truy xuất. Từ ký hiệu đang sửa,
-- đi theo: hàm nó GỌI (để biết chữ ký), kiểu nó DÙNG (để biết cấu trúc),
-- nơi GỌI TỚI nó (để không phá vỡ), kiểm thử phủ nó (để biết hợp đồng).
-- Xếp hạng theo KHOẢNG CÁCH ĐỒ THỊ trước, rồi mới dùng tương đồng ngữ nghĩa
-- để chọn trong số còn lại: 15 ký hiệu ĐÚNG thay vì 40 đoạn NGẪU NHIÊN —
-- ít token hơn mà kết quả tốt hơn hẳn.
CREATE TABLE symbol_edges (
    from_symbol_id TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    to_symbol_id   TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    kind           VARCHAR(16) NOT NULL,  -- CALLS IMPLEMENTS USES_TYPE TESTED_BY
    weight         INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (from_symbol_id, to_symbol_id, kind)
);

CREATE TABLE patch_attempts (
    session_id     TEXT    NOT NULL,
    attempt_number INTEGER NOT NULL,
    -- Ba cách sinh thay đổi, chỉ một cách dùng được:
    --   · sinh lại CẢ TỆP    → tốn token, chậm, mô hình ÂM THẦM BỎ MẤT phần
    --                          nó không quan tâm
    --   · vá theo SỐ DÒNG    → lệch một chút là áp sai chỗ
    --   · khối TÌM–THAY      → dùng được, nhưng đoạn tìm phải đủ dài để
    --                          DUY NHẤT trong tệp
    search_block   TEXT    NOT NULL,
    replace_block  TEXT    NOT NULL,
    -- Khớp nhiều chỗ hoặc không khớp chỗ nào thì THÀ BÁO KHÔNG ÁP ĐƯỢC còn
    -- hơn áp nhầm: người dùng phát hiện bản vá bị từ chối ngay lập tức,
    -- còn bản vá áp SAI CHỖ có thể lọt qua mọi lần xem xét.
    apply_result   VARCHAR(12) NOT NULL,  -- APPLIED AMBIGUOUS NOT_FOUND
    PRIMARY KEY (session_id, attempt_number)
);

-- MÃ NGUỒN KIỂM CHỨNG ĐƯỢC — điều mà chatbot không có. Mô hình KHÔNG BIẾT
-- mã nó viết có chạy không, nhưng trình biên dịch thì biết. Nối hai cái lại
-- là có hệ thống tự sửa được lỗi của chính nó. Đây là thứ biến bản demo
-- thành công cụ.
CREATE TABLE verifications (
    attempt_id     TEXT    PRIMARY KEY,
    compiles       BOOLEAN NOT NULL,
    tests_passed   INTEGER NOT NULL DEFAULT 0,
    tests_failed   INTEGER NOT NULL DEFAULT 0,
    -- ⚠️ TÁCH RIÊNG có chủ ý: kiểm thử vốn đã đỏ TRƯỚC khi sửa thì không
    -- phải lỗi của bản vá. Chỉ những cái CHUYỂN TỪ XANH SANG ĐỎ mới là hồi
    -- quy — và hồi quy nguy hiểm hơn hẳn mã không biên dịch được, vì mã
    -- không biên dịch được thì ai cũng thấy, còn bản vá sửa được lỗi này mà
    -- lặng lẽ phá chỗ khác là thứ LỌT QUA ĐƯỢC.
    tests_newly_failing INTEGER NOT NULL DEFAULT 0,
    -- Đưa NGUYÊN VĂN quay lại cho mô hình. Tóm tắt lỗi là lấy đi thông tin
    -- nó cần để sửa — đúng bài học từ AI Operating System.
    stderr         TEXT
);`,

  schemaCodeEn: `-- CODE IS NOT TEXT. IT IS A GRAPH.
-- Chunking files into 800 characters and embedding them like documents
-- retrieves passages that MENTION the topic — comments, tests, docs — while
-- missing what is actually NEEDED: the type definition, the callees, the
-- callers. None of those are textually similar, yet all are required to make
-- a CORRECT change.

CREATE TABLE symbols (
    id         TEXT   PRIMARY KEY,
    repo_id    TEXT   NOT NULL,
    file_path  TEXT   NOT NULL,
    -- The retrieval UNIT is a SYMBOL (function, class, type) taken from the
    -- syntax tree — NOT an 800-character chunk.
    kind       VARCHAR(16) NOT NULL,   -- FUNCTION CLASS TYPE METHOD
    name       TEXT   NOT NULL,
    start_line INTEGER NOT NULL,
    -- On a 100,000-file repository, reindexing everything per edit is
    -- unusable. Content hashing ⇒ reindex only symbols that actually changed.
    content_hash VARCHAR(64) NOT NULL,
    embedding  vector(1536)
);

-- Graph edges are what make retrieval good. From the symbol being edited,
-- walk: functions it CALLS (for signatures), types it USES (for structure),
-- its CALLERS (so nothing breaks), tests covering it (for the contract).
-- Rank by GRAPH DISTANCE first, then use semantic similarity among what
-- remains: 15 CORRECT symbols rather than 40 ARBITRARY chunks — fewer tokens
-- and considerably better results.
CREATE TABLE symbol_edges (
    from_symbol_id TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    to_symbol_id   TEXT NOT NULL REFERENCES symbols(id) ON DELETE CASCADE,
    kind           VARCHAR(16) NOT NULL,  -- CALLS IMPLEMENTS USES_TYPE TESTED_BY
    weight         INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (from_symbol_id, to_symbol_id, kind)
);

CREATE TABLE patch_attempts (
    session_id     TEXT    NOT NULL,
    attempt_number INTEGER NOT NULL,
    -- Three ways to emit a change, only one of which works:
    --   · regenerate the WHOLE FILE → expensive, slow, and models SILENTLY
    --                                 DROP parts they were not thinking about
    --   · LINE-NUMBER patches       → slight drift applies it in the wrong place
    --   · SEARCH–REPLACE blocks     → workable, but the search text must be
    --                                 long enough to be UNIQUE in the file
    search_block   TEXT    NOT NULL,
    replace_block  TEXT    NOT NULL,
    -- On several matches or none, REPORTING a failure beats applying wrongly:
    -- users notice a rejected patch immediately, while a patch applied to the
    -- WRONG PLACE can pass every review.
    apply_result   VARCHAR(12) NOT NULL,  -- APPLIED AMBIGUOUS NOT_FOUND
    PRIMARY KEY (session_id, attempt_number)
);

-- CODE IS VERIFIABLE — which chatbots never are. The model does NOT know
-- whether its code works, but the compiler does. Connecting the two gives a
-- system that repairs its own mistakes. This is what turns a demo into a tool.
CREATE TABLE verifications (
    attempt_id     TEXT    PRIMARY KEY,
    compiles       BOOLEAN NOT NULL,
    tests_passed   INTEGER NOT NULL DEFAULT 0,
    tests_failed   INTEGER NOT NULL DEFAULT 0,
    -- ⚠️ SEPARATED deliberately: tests already red BEFORE the edit are not
    -- the patch's fault. Only tests moving GREEN TO RED are regressions — and
    -- regressions are far more dangerous than code that fails to compile,
    -- because non-compiling code is obvious to everyone while a patch that
    -- fixes one thing and quietly breaks another is what SLIPS THROUGH.
    tests_newly_failing INTEGER NOT NULL DEFAULT 0,
    -- Feed this back VERBATIM to the model. Summarising the error removes
    -- exactly what it needs — the lesson from AI Operating System.
    stderr         TEXT
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Coi mã nguồn là ĐỒ THỊ, không phải văn bản',
      titleEn: 'Treat code as a GRAPH, not as text',
      description:
        'Áp đúng cách truy xuất tài liệu vào mã nguồn thì chạy nhưng cho kết quả tệ: nó lấy về những đoạn NÓI VỀ chủ đề mà thiếu định nghĩa kiểu, hàm được gọi và nơi gọi tới — không phần nào trong số đó gần nhau về tương đồng văn bản, nhưng tất cả đều cần để sửa đúng. Phân tích thành cây cú pháp, lấy đơn vị là ký hiệu, rồi xếp hạng theo khoảng cách trên đồ thị trước khi dùng tương đồng ngữ nghĩa.',
      descriptionEn:
        'Applying document retrieval to code runs but produces poor results: it returns passages that MENTION the topic while missing the type definition, the callees and the callers — none textually similar, all required for a correct change. Parse into a syntax tree, take symbols as units, and rank by graph distance before applying semantic similarity.',
    },
    {
      phase: 'BACKEND',
      title: 'Ba tín hiệu rẻ hơn nhúng rất nhiều',
      titleEn: 'Three signals far cheaper than embeddings',
      description:
        'Tệp đang mở và lịch sử gần đây là tín hiệu ý định mạnh nhất và không tốn phép tính nào. Lịch sử git cho biết các tệp thường được sửa CÙNG NHAU trong một commit, gần như chắc chắn liên quan kể cả khi mã không tham chiếu trực tiếp. Và lỗi biên dịch đang có ở tệp khác là ngữ cảnh cực kỳ liên quan. Cả ba nên dùng trước khi nghĩ tới vector.',
      descriptionEn:
        'Open files and recent history are the strongest intent signal and cost no computation. Git history reveals files repeatedly changed TOGETHER in one commit, almost certainly related even without direct references. And existing compiler errors elsewhere are extremely relevant context. Use all three before reaching for vectors.',
    },
    {
      phase: 'BACKEND',
      title: 'Hai chế độ, hai ngân sách hoàn toàn khác nhau',
      titleEn: 'Two modes with entirely different budgets',
      description:
        'Gợi ý khi gõ có ngân sách dưới 300ms — quá ngưỡng đó thì người viết đã gõ xong câu và gợi ý thành thứ gây phiền. Nó loại bỏ hoàn toàn khả năng dùng mô hình lớn và kéo theo cả chuỗi kỹ thuật: đệm theo tiền tố, huỷ yêu cầu cũ khi người dùng gõ tiếp, suy đoán trước theo vị trí con trỏ. Sửa theo yêu cầu thì ngược lại: vài giây tới vài phút, mô hình mạnh nhất, cả đồ thị phụ thuộc.',
      descriptionEn:
        'Inline completion has a sub-300ms budget — past it the developer has finished the line and the suggestion becomes an annoyance. It rules out large models entirely and drags a chain of techniques with it: prefix caching, cancelling stale requests, speculative prefetching by cursor position. Requested edits are the opposite: seconds to minutes, the strongest model, the whole dependency graph.',
    },
    {
      phase: 'BACKEND',
      title: 'Khối tìm–thay, và thà báo không áp được còn hơn áp nhầm',
      titleEn: 'Search–replace blocks, and reporting beats misapplying',
      description:
        'Sinh lại cả tệp thì tốn token, chậm, và mô hình hay âm thầm bỏ mất phần nó không quan tâm; vá theo số dòng thì lệch một chút là áp sai chỗ. Khối tìm–thay dùng được, nhưng phải xử lý ba tình huống: khớp nhiều chỗ thì yêu cầu mở rộng cho đủ duy nhất, không khớp thì thử bỏ qua khoảng trắng, vẫn không thì BÁO LỖI. Người dùng phát hiện bản vá bị từ chối ngay, còn bản vá áp sai chỗ có thể lọt qua mọi lần xem xét.',
      descriptionEn:
        'Regenerating whole files is expensive, slow, and models silently drop parts; line-number patches drift and land in the wrong place. Search–replace works, but three cases need handling: several matches means asking the model to widen until unique, no match means retrying without whitespace, and still nothing means REPORTING it. Users notice a rejected patch immediately; one applied to the wrong place can pass every review.',
    },
    {
      phase: 'BACKEND',
      title: 'Vòng lặp kiểm chứng — thứ biến bản demo thành công cụ',
      titleEn: 'The verification loop — what turns a demo into a tool',
      description:
        'Ở chatbot không có cách tự động biết câu trả lời đúng hay sai; ở đây thì có — mã hoặc biên dịch được hoặc không, kiểm thử hoặc xanh hoặc đỏ. Sinh → biên dịch → chạy kiểm thử → đưa lỗi NGUYÊN VĂN quay lại → thử lại, tối đa N lần. Mô hình không biết mã nó viết có chạy không, nhưng trình biên dịch thì biết; nối hai cái lại là có hệ thống tự sửa được lỗi của chính nó.',
      descriptionEn:
        'A chatbot has no automatic way to know if an answer is right; here you do — code compiles or does not, tests are green or red. Generate → compile → test → feed the error back VERBATIM → retry, at most N times. The model does not know whether its code works, but the compiler does; connecting them yields a system that repairs its own mistakes.',
      codeBlock:
        'for attempt in range(MAX_ATTEMPTS):        # thường 3\n'
        + '    patch = model.generate(context, task, previous_errors)\n'
        + '    apply(patch)\n'
        + '    result = run_in_sandbox(["compile", "test"])\n'
        + '    if result.ok:\n'
        + '        return patch\n'
        + '    previous_errors = result.stderr[:4000]   # NGUYÊN VĂN, đừng tóm tắt\n'
        + '\n'
        + '# Hết lượt: TRẢ LẠI cho người dùng kèm những gì đã thử. Đừng trả về\n'
        + '# mã chưa từng chạy được và gọi nó là kết quả.\n'
        + 'raise CouldNotVerify(attempts=MAX_ATTEMPTS, last_error=previous_errors)',
      codeLang: 'python',
    },
    {
      phase: 'BACKEND',
      title: 'Chạy mã sinh ra trong môi trường cách ly, có giới hạn cứng',
      titleEn: 'Run generated code sandboxed, with hard limits',
      description:
        'Đây là mã do máy sinh, chạy tự động, không ai đọc trước — toàn bộ các lớp phòng thủ của Code Collaboration Platform áp dụng nguyên vẹn, và rủi ro ở đây KHÔNG nhỏ hơn vì không có người nào ở giữa. Kèm theo là giới hạn số lần thử: không có nó, một lỗi mô hình không sửa nổi sẽ đốt sạch ngân sách.',
      descriptionEn:
        'This is machine-generated code executed automatically with nobody reading it first — every defence layer from the Code Collaboration Platform applies unchanged, and the risk here is NO smaller because there is no human in between. Alongside it, cap the attempts: without a cap, one unfixable error consumes the entire budget.',
    },
    {
      phase: 'BACKEND',
      title: 'Quét bảo mật và đối chiếu giấy phép trong chính vòng lặp',
      titleEn: 'Security scanning and licence checking inside the loop',
      description:
        'Mô hình học từ mã công khai, trong đó có rất nhiều mã không an toàn — nó sẽ sinh ra chuỗi SQL nối trực tiếp, so sánh mật khẩu không chống tấn công thời gian, kiểm quyền ở tầng hiển thị. Đưa công cụ quét vào cùng chỗ với biên dịch và kiểm thử: bắt ở đó rẻ hơn nhiều so với bắt lúc xem xét mã. Và đối chiếu các đoạn dài với kho mã đã biết, vì trùng khớp với mã có giấy phép ràng buộc là rủi ro pháp lý thật.',
      descriptionEn:
        'Models learn from public code, much of it insecure — they will produce string-concatenated SQL, non-constant-time password comparison, authorisation checked in the rendering layer. Put the scanner alongside compilation and tests: catching it there is far cheaper than at review. And compare long passages against known corpora, because matching restrictively licensed code is a real legal exposure.',
    },
    {
      phase: 'TESTING',
      title: 'Đo hồi quy riêng — chỉ số cần canh nhất',
      titleEn: 'Measure regressions separately — the metric to watch most',
      description:
        'Kiểm thử vốn đã đỏ trước khi sửa thì không phải lỗi của bản vá; chỉ những cái CHUYỂN TỪ XANH SANG ĐỎ mới là hồi quy. Đây là chỉ số nguy hiểm nhất vì bản vá không biên dịch được thì ai cũng thấy, còn bản vá sửa được lỗi này mà lặng lẽ phá chỗ khác là thứ lọt qua được mọi lần xem xét. Kèm theo: tỉ lệ qua với k lần thử, tỉ lệ chấp nhận gợi ý (sau 30 giây, không phải lúc nhấn Tab), và số vòng sửa trung bình.',
      descriptionEn:
        'Tests already red before the edit are not the patch\'s fault; only those moving GREEN TO RED are regressions. This is the most dangerous metric because non-compiling patches are obvious while a patch that fixes one thing and quietly breaks another slips through every review. Alongside: pass rate at k attempts, suggestion acceptance (measured after 30 seconds, not at the Tab press), and average repair rounds.',
    },
  ],

  features: [
    { title: 'Đánh chỉ mục kho mã theo cấu trúc', titleEn: 'Structural repository indexing', description: 'Cây cú pháp cho ra ký hiệu, băm nội dung cho đánh chỉ mục tăng dần.', descriptionEn: 'Syntax trees yield symbols; content hashing enables incremental indexing.', status: 'PLANNED' },
    { title: 'Truy xuất theo đồ thị phụ thuộc', titleEn: 'Dependency-graph retrieval', description: 'Đi theo cạnh gọi, cạnh kiểu, nơi gọi tới và kiểm thử phủ.', descriptionEn: 'Walking call, type, caller and test-coverage edges.', status: 'PLANNED' },
    { title: 'Gợi ý khi gõ dưới 300ms', titleEn: 'Sub-300ms inline completions', description: 'Mô hình nhỏ, đệm theo tiền tố, huỷ yêu cầu cũ khi gõ tiếp.', descriptionEn: 'A small model, prefix caching, and cancellation of stale requests.', status: 'PLANNED' },
    { title: 'Sửa nhiều tệp bằng khối tìm–thay', titleEn: 'Multi-file edits via search–replace blocks', description: 'Áp hết hoặc không áp gì, và từ chối khi khớp nhiều chỗ.', descriptionEn: 'All patches apply or none do, refusing when a match is ambiguous.', status: 'PLANNED' },
    { title: 'Vòng lặp sinh → biên dịch → kiểm thử → tự sửa', titleEn: 'A generate → compile → test → repair loop', description: 'Đưa lỗi nguyên văn quay lại, giới hạn số lần thử.', descriptionEn: 'Errors fed back verbatim, with a hard attempt cap.', status: 'PLANNED' },
    { title: 'Chạy mã sinh ra trong sandbox', titleEn: 'Sandboxed execution of generated code', description: 'Cùng các lớp phòng thủ của Code Collaboration Platform.', descriptionEn: 'The same defence layers as the Code Collaboration Platform.', status: 'PLANNED' },
    { title: 'Quét bảo mật trong vòng lặp kiểm chứng', titleEn: 'Security scanning inside the verification loop', description: 'Bắt lỗ hổng cùng chỗ với biên dịch, rẻ hơn bắt lúc xem xét.', descriptionEn: 'Catching vulnerabilities alongside compilation, cheaper than at review.', status: 'PLANNED' },
    { title: 'Bộ đo dựa trên kiểm thử chạy được', titleEn: 'Evaluation driven by executable tests', description: 'Tỉ lệ qua với k lần thử, và đo hồi quy tách riêng.', descriptionEn: 'Pass rate at k attempts, with regressions measured separately.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'tree-sitter', titleEn: 'tree-sitter', url: 'https://tree-sitter.github.io/tree-sitter/', type: 'LINK', description: 'Phân tích cú pháp tăng dần cho hàng chục ngôn ngữ — nền của việc cắt theo ký hiệu.', descriptionEn: 'Incremental parsing for dozens of languages — the basis of symbol-level chunking.' },
    { title: 'Evaluating Large Language Models Trained on Code (HumanEval)', titleEn: 'Evaluating Large Language Models Trained on Code (HumanEval)', url: 'https://arxiv.org/abs/2107.03374', type: 'LINK', description: 'Bài báo giới thiệu chỉ số tỉ lệ qua với k lần thử — chuẩn đo của cả lĩnh vực.', descriptionEn: 'The paper introducing pass@k — the field\'s standard measure.' },
    { title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', titleEn: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?', url: 'https://arxiv.org/abs/2310.06770', type: 'LINK', description: 'Bộ đo trên issue thật với kiểm thử thật — sát với dự án này hơn hẳn các bài toán đồ chơi.', descriptionEn: 'A benchmark on real issues with real tests — far closer to this project than toy problems.' },
    { title: 'Aider — search/replace block format', titleEn: 'Aider — search/replace block format', url: 'https://aider.chat/docs/more/edit-formats.html', type: 'LINK', description: 'So sánh thực nghiệm các định dạng sinh thay đổi, kèm tỉ lệ áp thất bại của từng cách.', descriptionEn: 'An empirical comparison of edit formats with per-format apply failure rates.' },
    { title: 'Language Server Protocol Specification', titleEn: 'Language Server Protocol Specification', url: 'https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/', type: 'LINK', description: 'Nguồn sẵn có cho đồ thị ký hiệu: định nghĩa, tham chiếu, phân cấp lời gọi.', descriptionEn: 'A ready-made source for the symbol graph: definitions, references, call hierarchies.' },
  ],

  coreKnowledge: [
    { vi: 'Phân tích cú pháp và biểu diễn mã nguồn dưới dạng đồ thị', en: 'Parsing and representing source code as a graph' },
    { vi: 'Truy xuất theo cấu trúc: vì sao đơn vị đúng là ký hiệu chứ không phải đoạn', en: 'Structural retrieval: why the right unit is a symbol rather than a chunk' },
    { vi: 'Ngân sách độ trễ định hình kiến trúc như thế nào', en: 'How a latency budget shapes an architecture' },
    { vi: 'Định dạng sinh thay đổi và các kiểu áp bản vá thất bại', en: 'Edit formats and the ways patch application fails' },
    { vi: 'Vòng lặp tự sửa dựa trên tín hiệu kiểm chứng được', en: 'Self-repair loops driven by verifiable signals' },
    { vi: 'Đánh giá tự động trong miền có thước đo khách quan', en: 'Automatic evaluation in a domain with an objective measure' },
    { vi: 'Phân biệt lỗi mới và lỗi có sẵn khi đo hồi quy', en: 'Separating new failures from pre-existing ones when measuring regressions' },
    { vi: 'Rủi ro bảo mật và pháp lý của mã do mô hình sinh ra', en: 'Security and legal exposure of model-generated code' },
  ],

  portfolioBonus: [
    { vi: 'So chất lượng truy xuất theo đoạn văn bản và theo đồ thị trên cùng yêu cầu', en: 'Retrieval quality compared, chunk-based versus graph-based, on the same request' },
    { vi: 'Biểu đồ tỉ lệ qua theo số vòng sửa cho phép', en: 'A pass-rate chart against the number of repair rounds allowed' },
    { vi: 'Video hệ thống tự sửa lỗi biên dịch sau hai vòng', en: 'A video of the system fixing its own compile error in two rounds' },
    { vi: 'Số liệu độ trễ gợi ý khi gõ ở phân vị 50, 95, 99', en: 'Completion latency at p50, p95 and p99' },
    { vi: 'Báo cáo bộ đo chuẩn, so được giữa hai phiên bản hệ thống', en: 'A standard benchmark report comparable across system versions' },
  ],

  completionOutcomes: [
    { vi: 'Xây được công cụ AI trong miền có thể kiểm chứng tự động', en: 'Build AI tooling in a domain where verification is automatic' },
    { vi: 'Hiểu vì sao cấu trúc dữ liệu của miền quyết định cách truy xuất', en: 'Understand why a domain\'s data structure dictates how to retrieve from it' },
    { vi: 'Thiết kế theo ngân sách độ trễ chứ không chỉ theo chất lượng', en: 'Design against a latency budget rather than for quality alone' },
    { vi: 'Nối mô hình sinh với tín hiệu khách quan để tạo vòng lặp tự sửa', en: 'Connect generative models to objective signals to create self-repair loops' },
    { vi: 'Đánh giá công cụ lập trình bằng số thay vì bằng cảm nhận', en: 'Evaluate developer tooling numerically rather than by impression' },
  ],

  bodyMdx,
  bodyMdxEn,
};
