/**
 * Case-study 5.1 — AI Operating System (Multi-Agent).
 *
 * The chatbot only READ documents; this one ACTS. A wrong answer gets ignored,
 * a wrong action has already happened. So the study is about stopping in time,
 * failing visibly, and being incapable of irreversible harm — with
 * reversibility (not "danger") as the axis that organises the whole design.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./ai-operating-system-multi-agent.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./ai-operating-system-multi-agent.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'ai-operating-system-multi-agent',
  title: 'AI Operating System (Multi-Agent)',
  titleEn: 'AI Operating System (Multi-Agent)',
  description:
    'Hệ điều phối nhiều tác nhân AI có công cụ thật: gọi API, chạy lệnh, sửa tệp. Chatbot chỉ ĐỌC rồi trả lời; ở đây mô hình HÀNH ĐỘNG — và một câu trả lời sai thì người dùng bỏ qua, còn một hành động sai thì đã xảy ra rồi.',
  descriptionEn:
    'A multi-agent orchestration system with real tools: API calls, commands, file edits. A chatbot only READS and answers; here the model ACTS — and a wrong answer gets ignored while a wrong action has already happened.',
  techStack: [
    'Python', 'FastAPI', 'TypeScript', 'PostgreSQL', 'Redis', 'Celery',
    'JSON Schema', 'OpenTelemetry', 'Docker', 'gVisor', 'Next.js 15',
  ],
  role: 'Full-stack / hệ thống AI (một người)',
  roleEn: 'Full-stack / AI systems (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'AI',
  difficulty: 'EXPERT',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- TRỤC TỔ CHỨC TOÀN BỘ THIẾT KẾ AN TOÀN: đảo ngược được hay không.
-- Cách phân loại "an toàn / nguy hiểm" KHÔNG dùng được, vì "nguy hiểm" là
-- một cảm nhận. "Hoàn tác được không" thì kiểm chứng được.

CREATE TABLE tools (
    name          TEXT        PRIMARY KEY,
    -- READ         : tra cứu, đọc tệp — tác nhân tự do gọi
    -- REVERSIBLE   : tạo bản nháp, sửa tệp có phiên bản — tự do gọi + GHI NHẬT KÝ
    -- IRREVERSIBLE : gửi email, thanh toán, xoá vĩnh viễn — BẮT BUỘC chờ duyệt
    reversibility VARCHAR(16) NOT NULL,
    requires_approval BOOLEAN NOT NULL DEFAULT true,
    -- Ràng buộc schema là hàng rào an toàn ĐẦU TIÊN — chặn ở tầng kiểu dữ liệu
    -- rẻ hơn nhiều so với trông chờ mô hình gọi đúng.
    input_schema  JSONB       NOT NULL,
    CONSTRAINT irreversible_needs_approval
        CHECK (reversibility <> 'IRREVERSIBLE' OR requires_approval)
);

-- Hệ quả thiết kế: THIẾT KẾ LẠI công cụ để chuyển sang nhóm nhẹ hơn.
-- Thay 'gui_email' (IRREVERSIBLE) bằng 'soan_nhap_email' (REVERSIBLE):
-- phần lớn giá trị vẫn còn, rủi ro gần như biến mất, và con người bấm gửi.

CREATE TABLE agent_defs (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    -- GIỚI HẠN CỨNG, đặt NGOÀI mô hình. Đừng nhờ mô hình tự giới hạn mình —
    -- giới hạn phải nằm ở mã điều phối, nơi nó không thể bị thuyết phục bỏ qua.
    max_steps        INTEGER NOT NULL DEFAULT 30,
    max_tokens       INTEGER NOT NULL DEFAULT 200000,
    max_wall_seconds INTEGER NOT NULL DEFAULT 600
);

CREATE TABLE agent_runs (
    id            TEXT        PRIMARY KEY,
    -- Tác nhân con chỉ trả về KẾT LUẬN, không trả cả quá trình của nó.
    -- Đây là lý do CHÍNH ĐÁNG nhất để dùng tác nhân con: nó nuốt trọn phần
    -- ngữ cảnh rườm rà và giữ ngữ cảnh của tác nhân chính gọn gàng.
    parent_run_id TEXT        REFERENCES agent_runs(id),
    goal          TEXT        NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    -- Chạm giới hạn nào — PHẢI báo rõ, không được im lặng bỏ cuộc.
    halt_reason   TEXT,
    tokens_spent  INTEGER     NOT NULL DEFAULT 0,
    cost_cents    INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE steps (
    run_id     TEXT     NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    step_index INTEGER  NOT NULL,
    thought    TEXT,
    -- Cách phát hiện KẸT rẻ nhất: băm tên công cụ + tham số. Ba lần liên tiếp
    -- giống hệt nhau nghĩa là tác nhân đang kẹt — dừng và BÁO, đừng chạy tới
    -- hết ngân sách. Không cần mô hình nào để nhận ra điều đó.
    action_hash TEXT,
    succeeded  BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (run_id, step_index)
);

CREATE TABLE approvals (
    id           TEXT        PRIMARY KEY,
    run_id       TEXT        NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    tool_call_id TEXT        NOT NULL,
    decision     VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    approver_id  TEXT,
    -- ⚠️ QUÁ HẠN = TỪ CHỐI, tuyệt đối không mặc định duyệt. Một yêu cầu duyệt
    -- bị quên trong hộp thư không được phép tự trở thành "đồng ý" sau 24 giờ.
    -- Mặc định khi không có thông tin phải là KHÔNG HÀNH ĐỘNG.
    expires_at   TIMESTAMPTZ NOT NULL
);`,

  schemaCodeEn: `-- THE AXIS ORGANISING THE ENTIRE SAFETY DESIGN: reversible or not.
-- A "safe / dangerous" classification does NOT work, because "dangerous" is
-- a feeling. "Can this be undone" is checkable.

CREATE TABLE tools (
    name          TEXT        PRIMARY KEY,
    -- READ         : lookups, file reads — the agent may call freely
    -- REVERSIBLE   : drafts, versioned edits — call freely but LOG it
    -- IRREVERSIBLE : email, payment, hard delete — approval REQUIRED
    reversibility VARCHAR(16) NOT NULL,
    requires_approval BOOLEAN NOT NULL DEFAULT true,
    -- Schema validation is the FIRST safety rail — rejecting at the type
    -- layer is far cheaper than hoping the model calls correctly.
    input_schema  JSONB       NOT NULL,
    CONSTRAINT irreversible_needs_approval
        CHECK (reversibility <> 'IRREVERSIBLE' OR requires_approval)
);

-- The design consequence: REDESIGN tools into a lighter category.
-- Replace 'send_email' (IRREVERSIBLE) with 'draft_email' (REVERSIBLE):
-- most of the value survives, the risk nearly vanishes, a human presses send.

CREATE TABLE agent_defs (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    -- HARD LIMITS, OUTSIDE the model. Do not ask the model to limit itself —
    -- limits belong in orchestration code, where they cannot be argued away.
    max_steps        INTEGER NOT NULL DEFAULT 30,
    max_tokens       INTEGER NOT NULL DEFAULT 200000,
    max_wall_seconds INTEGER NOT NULL DEFAULT 600
);

CREATE TABLE agent_runs (
    id            TEXT        PRIMARY KEY,
    -- Sub-agents return only CONCLUSIONS, never their whole process. This is
    -- the most LEGITIMATE reason to use them: one swallows a mass of messy
    -- context and keeps the main agent's context clean.
    parent_run_id TEXT        REFERENCES agent_runs(id),
    goal          TEXT        NOT NULL,
    status        VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    -- Which limit was hit — MUST be reported, never a silent give-up.
    halt_reason   TEXT,
    tokens_spent  INTEGER     NOT NULL DEFAULT 0,
    cost_cents    INTEGER     NOT NULL DEFAULT 0
);

CREATE TABLE steps (
    run_id     TEXT     NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    step_index INTEGER  NOT NULL,
    thought    TEXT,
    -- The cheapest possible STUCK detector: hash tool name + arguments. Three
    -- consecutive identical hashes means the agent is looping — stop and
    -- REPORT rather than burning the budget. No model needed to notice that.
    action_hash TEXT,
    succeeded  BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (run_id, step_index)
);

CREATE TABLE approvals (
    id           TEXT        PRIMARY KEY,
    run_id       TEXT        NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
    tool_call_id TEXT        NOT NULL,
    decision     VARCHAR(12) NOT NULL DEFAULT 'PENDING',
    approver_id  TEXT,
    -- ⚠️ EXPIRY = REJECTION, never a default approval. An approval request
    -- forgotten in an inbox must not turn itself into consent after 24 hours.
    -- In the absence of information, the default must be INACTION.
    expires_at   TIMESTAMPTZ NOT NULL
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Phân loại công cụ theo mức đảo ngược, không theo "nguy hiểm"',
      titleEn: 'Classify tools by reversibility, not by "danger"',
      description:
        '"Nguy hiểm" là một cảm nhận; "hoàn tác được không" thì kiểm chứng được. Ba nhóm: đọc (tự do gọi), ghi hoàn tác được (tự do nhưng ghi nhật ký), không hoàn tác được (bắt buộc chờ duyệt). Hệ quả quan trọng nhất là THIẾT KẾ LẠI công cụ để chuyển nhóm — thay gửi_email bằng soạn_nháp_email thì phần lớn giá trị vẫn còn mà rủi ro gần như biến mất.',
      descriptionEn:
        '"Dangerous" is a feeling; "can this be undone" is checkable. Three classes: read (call freely), reversible write (freely but logged), irreversible (approval required). The most important consequence is REDESIGNING tools across classes — replacing send_email with draft_email keeps most of the value while the risk nearly vanishes.',
    },
    {
      phase: 'BACKEND',
      title: 'Giới hạn cứng đặt ngoài mô hình, và phát hiện kẹt',
      titleEn: 'Hard limits outside the model, plus stuck-detection',
      description:
        'Mô hình tự đánh giá "đã xong chưa" sai theo cả hai hướng: dừng sớm khi chưa xong, hoặc chạy mãi không nhận ra bế tắc. Ba giới hạn cứng đặt ở mã điều phối nơi không thể bị thuyết phục bỏ qua: số bước, ngân sách token, thời gian. Cộng thêm phát hiện kẹt bằng cách băm hành động — ba lần liên tiếp giống hệt là dừng ngay, không cần mô hình nào để nhận ra.',
      descriptionEn:
        'The model judging "am I done" is wrong in both directions: stopping early, or running forever without noticing a dead end. Three hard limits in orchestration code where they cannot be argued away: step count, token budget, wall time. Plus stuck-detection by hashing actions — three consecutive identical ones stops it, and no model is needed to notice.',
      codeBlock:
        '// Băm tên công cụ + tham số. Ba lần giống hệt = đang kẹt.\n'
        + 'const h = hash(toolName + JSON.stringify(args));\n'
        + 'recentHashes.push(h);\n'
        + 'if (recentHashes.slice(-3).every(x => x === h)) {\n'
        + "  halt('LOOP_DETECTED');   // dừng và BÁO, đừng chạy tới hết ngân sách\n"
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Điểm dừng chờ duyệt, và quá hạn nghĩa là TỪ CHỐI',
      titleEn: 'Approval checkpoints, where expiry means REJECT',
      description:
        'Mọi công cụ không hoàn tác được đều phải dừng chờ người duyệt trước khi thực thi. Chi tiết dễ sai nhất là hành vi khi quá hạn: một yêu cầu duyệt bị quên trong hộp thư KHÔNG được phép tự trở thành "đồng ý" sau 24 giờ. Mặc định khi không có thông tin phải là không hành động.',
      descriptionEn:
        'Every irreversible tool must pause for human approval before executing. The detail most often got wrong is expiry behaviour: an approval request forgotten in an inbox must NOT turn itself into consent after 24 hours. In the absence of information, the default must be inaction.',
    },
    {
      phase: 'BACKEND',
      title: 'Hỏng phải NHÌN THẤY ĐƯỢC — trả lỗi thật, không trả thông báo thân thiện',
      titleEn: 'Failure must be VISIBLE — return real errors, not friendly messages',
      description:
        'Bản năng của người viết mã là bắt lỗi rồi trả thông báo chung chung. Với tác nhân, làm vậy là lấy đi thứ nó cần để tự sửa: "Truy vấn thất bại" không nói gì, còn \'column "usr_id" does not exist\' cho biết chính xác phải làm gì. Nhưng lỗi KHÔNG được mang dữ liệu nhạy cảm — vết ngăn xếp có thể chứa chuỗi kết nối và khoá, nên trả thông điệp đã lọc chứ không trả nguyên vết.',
      descriptionEn:
        'A developer\'s instinct is to catch exceptions and return something generic. With agents that removes exactly what they need to recover: "The query failed" says nothing, while \'column "usr_id" does not exist\' says precisely what to do. But errors must NOT carry sensitive data — stack traces can hold connection strings and keys, so return a filtered message rather than the raw trace.',
      codeBlock:
        'except DatabaseError as e:\n'
        + '    return {\n'
        + '        "ok": False,\n'
        + '        "error": str(e),      # \'column "usr_id" does not exist\'\n'
        + '        "hint": "Gọi list_columns để xem tên cột thật.",\n'
        + '        "retryable": True,\n'
        + '    }',
      codeLang: 'python',
    },
    {
      phase: 'BACKEND',
      title: 'Nén ngữ cảnh mà GIỮ LẠI các thất bại',
      titleEn: 'Compact context while PRESERVING failures',
      description:
        'Tác nhân chạy 40 bước tích luỹ 40 quan sát: chi phí tăng tuyến tính và chất lượng GIẢM vì thông tin quan trọng bị chôn giữa hàng nghìn dòng nhật ký công cụ. Khi nén, thứ tuyệt đối phải giữ là mục tiêu gốc, các ràng buộc, và những việc đã THẤT BẠI cùng lý do — bỏ mất phần thất bại là tác nhân sẽ thử lại đúng cái vừa hỏng.',
      descriptionEn:
        'Forty steps accumulate forty observations: cost rises linearly and quality FALLS as important information is buried under thousands of lines of tool output. When compacting, what must absolutely survive is the original goal, the constraints, and what already FAILED and why — drop the failures and the agent retries exactly what just broke.',
    },
    {
      phase: 'BACKEND',
      title: 'Thêm tác nhân chỉ khi nói được nó THẤY GÌ mà tác nhân kia không thấy',
      titleEn: 'Add an agent only when you can state what it SEES that the other cannot',
      description:
        'Hình dung "một đội tác nhân phối hợp" rất hấp dẫn nhưng thường làm hệ thống tệ đi, vì mỗi lần chuyển giao là một lần mất ngữ cảnh. Có ích khi: việc con độc lập chạy song song được, cần góc nhìn khác (viết mã rồi soi lỗi), miền chuyên môn tách bạch. Có hại khi: chuỗi việc phụ thuộc nhau, hoặc muốn đồng thuận — các tác nhân dễ cùng đồng ý một sai lầm với chi phí gấp nhiều lần.',
      descriptionEn:
        'The image of a collaborating team is appealing but usually makes things worse, because every handoff loses context. It helps when: subtasks are independent and truly parallel, a different perspective is needed (write then review), domains are separable. It hurts when: steps depend on each other, or you want consensus — agents readily agree on the same mistake at several times the cost.',
    },
    {
      phase: 'FRONTEND',
      title: 'Xem lại hành trình và hàng đợi duyệt',
      titleEn: 'Trajectory replay and an approval queue',
      description:
        'Người vận hành phải mở được một lượt chạy đã xong và xem TỪNG bước: suy nghĩ, hành động, kết quả, chi phí. Không có nó thì "vì sao tác nhân làm vậy" là câu không trả lời được. Hàng đợi duyệt phải hiện rõ tác nhân định làm gì, dựa trên gì, và hậu quả nếu duyệt nhầm — người duyệt cần đủ thông tin để nói không.',
      descriptionEn:
        'Operators must be able to open a completed run and inspect EVERY step: thought, action, result, cost. Without it, "why did the agent do that" is unanswerable. The approval queue must show what the agent intends, what it based that on, and the consequence of approving wrongly — the approver needs enough to say no.',
    },
    {
      phase: 'TESTING',
      title: 'Đo bốn chỉ số, và chỉ số thứ tư là chỉ số AN TOÀN',
      titleEn: 'Track four metrics, the fourth being the SAFETY one',
      description:
        'Tỉ lệ hoàn thành, số bước trung bình (tăng nghĩa là đang lạc dù vẫn xong), chi phí mỗi lần hoàn thành (quyết định sản phẩm có sống được không), và tỉ lệ hành động không hoàn tác được BỊ NGƯỜI DUYỆT TỪ CHỐI. Chỉ số cuối là quan trọng nhất: nếu nó cao, tác nhân đang muốn làm những việc nó không nên làm và bạn đang gặp may vì có người chặn.',
      descriptionEn:
        'Completion rate, average step count (rising means wandering even while succeeding), cost per completion (which decides viability), and the rate at which irreversible actions are REJECTED BY APPROVERS. The last matters most: if it is high, the agent keeps wanting to do things it should not and you are being saved by a human.',
    },
  ],

  features: [
    { title: 'Vòng lặp tác nhân có giới hạn cứng', titleEn: 'An agent loop with hard limits', description: 'Số bước, ngân sách token, thời gian — đặt ngoài mô hình.', descriptionEn: 'Step count, token budget and wall time, all outside the model.', status: 'PLANNED' },
    { title: 'Phát hiện kẹt bằng băm hành động', titleEn: 'Stuck-detection by action hashing', description: 'Ba hành động giống hệt liên tiếp thì dừng và báo.', descriptionEn: 'Three consecutive identical actions stops the run with a report.', status: 'PLANNED' },
    { title: 'Kho công cụ phân loại theo mức đảo ngược', titleEn: 'A tool registry classified by reversibility', description: 'Ràng buộc ở tầng database: không hoàn tác được thì luôn cần duyệt.', descriptionEn: 'Enforced by a database constraint: irreversible always requires approval.', status: 'PLANNED' },
    { title: 'Điểm dừng chờ người duyệt', titleEn: 'Human approval checkpoints', description: 'Quá hạn là từ chối, và người duyệt thấy đủ ngữ cảnh để nói không.', descriptionEn: 'Expiry rejects, and approvers see enough context to decline.', status: 'PLANNED' },
    { title: 'Tác nhân con nuốt ngữ cảnh rườm rà', titleEn: 'Sub-agents absorbing messy context', description: 'Chỉ trả về kết luận, giữ ngữ cảnh tác nhân chính gọn gàng.', descriptionEn: 'Returning only conclusions so the parent context stays clean.', status: 'PLANNED' },
    { title: 'Nén ngữ cảnh giữ lại thất bại', titleEn: 'Context compaction preserving failures', description: 'Giữ mục tiêu, ràng buộc, và những gì đã hỏng cùng lý do.', descriptionEn: 'Preserving the goal, the constraints, and what broke and why.', status: 'PLANNED' },
    { title: 'Ghi lại toàn bộ hành trình', titleEn: 'Full trajectory recording', description: 'Xem lại từng bước suy nghĩ, hành động, kết quả và chi phí.', descriptionEn: 'Replay every thought, action, result and cost.', status: 'PLANNED' },
    { title: 'Bộ đo bốn chỉ số kể cả chỉ số an toàn', titleEn: 'A four-metric evaluation suite including safety', description: 'Hoàn thành, số bước, chi phí, và tỉ lệ bị người duyệt từ chối.', descriptionEn: 'Completion, steps, cost, and the approval rejection rate.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Anthropic — Building effective agents', titleEn: 'Anthropic — Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents', type: 'LINK', description: 'Vì sao phần lớn hệ thống nên bắt đầu bằng quy trình đơn giản chứ không phải tác nhân tự chủ.', descriptionEn: 'Why most systems should start with simple workflows rather than autonomous agents.' },
    { title: 'Anthropic — Tool use documentation', titleEn: 'Anthropic — Tool use documentation', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview', type: 'LINK', description: 'Thiết kế công cụ và ràng buộc schema — hàng rào an toàn đầu tiên của tác nhân.', descriptionEn: 'Tool design and schema constraints — an agent\'s first safety rail.' },
    { title: 'ReAct: Synergizing Reasoning and Acting in Language Models', titleEn: 'ReAct: Synergizing Reasoning and Acting in Language Models', url: 'https://arxiv.org/abs/2210.03629', type: 'LINK', description: 'Bài báo đặt nền cho vòng lặp suy nghĩ → hành động → quan sát dùng trong bài này.', descriptionEn: 'The paper behind the think → act → observe loop used throughout this study.' },
    { title: 'Model Context Protocol', titleEn: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/', type: 'LINK', description: 'Giao thức chuẩn cho công cụ — lại là bài học N+M đã gặp ở Code Collaboration Platform.', descriptionEn: 'A standard protocol for tools — the same N+M lesson as in the Code Collaboration Platform.' },
    { title: 'OWASP Top 10 for LLM Applications', titleEn: 'OWASP Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', type: 'LINK', description: 'Tác nhân có công cụ nâng tiêm lời nhắc từ "câu chữ sai" thành "hành động sai".', descriptionEn: 'Tool-using agents escalate prompt injection from wrong words to wrong actions.' },
  ],

  coreKnowledge: [
    { vi: 'Vòng lặp tác nhân và vì sao nó không tự dừng', en: 'The agent loop and why it does not stop by itself' },
    { vi: 'Phân loại theo mức đảo ngược như trục thiết kế an toàn', en: 'Reversibility as the organising axis of safety design' },
    { vi: 'Thiết kế công cụ: giao diện chính là ranh giới an toàn', en: 'Tool design: the interface is the safety boundary' },
    { vi: 'Quản lý ngữ cảnh: nén, uỷ nhiệm, và thứ tuyệt đối phải giữ', en: 'Context management: compaction, delegation, and what must never be dropped' },
    { vi: 'Thiết kế lỗi cho máy đọc, không phải cho người đọc', en: 'Designing errors for machine consumption rather than human comfort' },
    { vi: 'Khi nào nhiều tác nhân giúp và khi nào chúng cộng thêm lỗi', en: 'When multiple agents help and when they merely add failure modes' },
    { vi: 'Con người trong vòng lặp: đặt điểm dừng ở đâu cho đúng', en: 'Human-in-the-loop: where to place the checkpoints' },
    { vi: 'Đánh giá hành trình thay vì chỉ đánh giá kết quả cuối', en: 'Evaluating trajectories rather than only final outcomes' },
  ],

  portfolioBonus: [
    { vi: 'Bảng phân loại mọi công cụ theo mức đảo ngược, kèm lý do từng cái', en: 'A table classifying every tool by reversibility with the reasoning for each' },
    { vi: 'Video tác nhân gặp bế tắc và dừng đúng lúc thay vì chạy hết ngân sách', en: 'A video of an agent hitting a dead end and stopping rather than exhausting its budget' },
    { vi: 'Ví dụ thiết kế lại một công cụ từ không-hoàn-tác-được sang hoàn-tác-được', en: 'A worked example redesigning a tool from irreversible into reversible' },
    { vi: 'Giao diện xem lại hành trình chạy thật, mở được từng bước', en: 'A working trajectory viewer with every step inspectable' },
    { vi: 'Báo cáo bộ đo có đủ bốn chỉ số qua nhiều phiên bản lời nhắc', en: 'An evaluation report with all four metrics across prompt versions' },
  ],

  completionOutcomes: [
    { vi: 'Xây được hệ thống AI hành động mà vẫn kiểm soát được hậu quả', en: 'Build acting AI systems whose consequences stay controlled' },
    { vi: 'Thiết kế an toàn dựa trên khả năng, không dựa vào lời nhắc', en: 'Design safety around capability rather than around prompts' },
    { vi: 'Nhận ra khi thêm phức tạp làm hệ thống tệ đi', en: 'Recognise when added complexity makes a system worse' },
    { vi: 'Đặt con người vào đúng chỗ trong vòng lặp tự động', en: 'Place humans at the right point inside an automated loop' },
    { vi: 'Đo và cải thiện hệ thống có hành vi không tất định', en: 'Measure and improve systems whose behaviour is non-deterministic' },
  ],

  bodyMdx,
  bodyMdxEn,
};
