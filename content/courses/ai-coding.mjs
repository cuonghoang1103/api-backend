/**
 * Lập trình với AI — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau.
 * Khi soạn chi tiết: model, giá, giới hạn đổi rất nhanh — kiểm trang chính thức và ghi mốc thời gian. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'ai-coding',
    title: 'Coding with AI',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/ai-coding.png?v=1',
    shortDescription: 'Use AI as a serious engineering tool: coding agents like Claude Code, reviewing what they write, calling LLM APIs from your own app, tool use, RAG over your own documents, evaluation, cost and safety.|||Dùng AI như một công cụ kỹ thuật nghiêm túc: agent viết code như Claude Code, rà soát thứ nó viết, gọi LLM API từ ứng dụng của bạn, tool use, RAG trên tài liệu của mình, đánh giá chất lượng, chi phí và an toàn.',
    description: 'Khoá hai nửa. Nửa đầu: làm việc cùng AI khi lập trình — agent viết code (Claude Code, Copilot), cách giao việc rõ ràng, chia nhỏ, kiểm chứng, review và test thứ AI viết, không để AI làm hỏng repo, dùng AI để học nhanh hơn chứ không học thay. Nửa sau: xây tính năng AI trong sản phẩm — gọi LLM API, streaming, prompt có cấu trúc, tool use, embeddings và RAG với pgvector, đánh giá (evals), chi phí, an toàn và prompt injection, tới dự án cuối khoá: trợ lý hỏi đáp cho app đặt lịch.',
    whatYouLearn: 'Giao việc cho agent AI hiệu quả và kiểm soát được; review, test và sửa code AI sinh ra; tích hợp LLM API vào backend Node với streaming; thiết kế tool use; dựng RAG trên Postgres/pgvector; đo chất lượng bằng evals; kiểm soát chi phí; chống prompt injection; và nói về kinh nghiệm dùng AI khi phỏng vấn.',
    requirements: 'Lập trình Node.js/TypeScript, Git, cơ sở dữ liệu cơ bản. Nên học trước khoá Git, Node.js và PostgreSQL.',
    documentsNote: 'Tài liệu chính: docs.claude.com (Claude API, Claude Code) • docs.github.com/copilot • github.com/pgvector/pgvector • OWASP Top 10 for LLM Applications.',
  },
  sections: khung('ai', [
    ['Section 0 — AI as an engineering tool', 'Mục 0 — AI như một công cụ kỹ thuật', 'AI giúp gì, không giúp gì, và cách học không phụ thuộc.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What LLMs and coding agents are, and why employers ask about them', 'Bắt đầu tại đây (1/2) — LLM và agent viết code là gì, vì sao nhà tuyển dụng hỏi', 'LLM bằng hình ảnh đời thường · Lịch sử ngắn: Transformer 2017 → ChatGPT 2022 → agent · Công ty dùng AI thế nào · Câu hỏi phỏng vấn'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — When AI goes wrong, and learning without outsourcing your brain', 'Bắt đầu tại đây (2/2) — Khi AI làm sai: sự cố thật, và học mà không giao não cho máy', 'Sự cố thật có nguồn (code AI lộ khoá, gói bịa tên…) · Học phụ thuộc AI · Lộ trình học'],
      ['llm-hoat-dong', 'How LLMs work (just enough)', 'LLM hoạt động thế nào (vừa đủ)', 'Token · Cửa sổ ngữ cảnh · Nhiệt độ · Vì sao nó "bịa"'],
      ['chon-cong-cu', 'The tool landscape', 'Bản đồ công cụ', 'Chat · Agent trong terminal/IDE · API · Bảng so sánh'],
    ]],
    ['Chapter 1 — Working with a coding agent', 'Chương 1 — Làm việc với agent viết code', 'Claude Code và các agent tương tự trong dự án thật.', [
      ['bat-dau', 'Your first session with a coding agent', 'Buổi làm việc đầu tiên với agent', 'Cài đặt · Quyền · Đọc repo · Giao việc nhỏ'],
      ['giao-viec', 'Writing good task descriptions', 'Viết mô tả công việc tốt', 'Mục tiêu · Ràng buộc · Tiêu chí xong · Ví dụ'],
      ['bo-nho-du-an', 'Project memory: CLAUDE.md and conventions', 'Bộ nhớ dự án: CLAUDE.md và quy ước', 'Luật cấm · Lệnh kiểm · Bài học sự cố'],
      ['an-toan', 'Keeping your repo safe', 'Giữ repo an toàn', 'Chế độ quyền · Nhánh riêng · Không commit bí mật · Xem diff trước khi nhận'],
    ]],
    ['Chapter 2 — Verifying AI-written code', 'Chương 2 — Kiểm chứng code AI viết', 'Tin nhưng phải kiểm.', [
      ['review', 'Reviewing AI code like a senior', 'Review code AI như một senior', 'Đọc diff · Hỏi vì sao · Mùi code AI'],
      ['test', 'Tests as the contract', 'Test là hợp đồng', 'Viết test trước rồi giao AI · Trỏ khoá Testing'],
      ['ao-giac', 'Hallucinated APIs, packages and facts', 'API, gói và dữ kiện bịa', 'Gói không tồn tại · Tham số sai · Kiểm nguồn'],
      ['bao-mat', 'Security review of generated code', 'Rà soát bảo mật code sinh ra', 'Injection · Lộ bí mật · Trỏ khoá Bảo mật web'],
    ]],
    ['Chapter 3 — Learning faster with AI', 'Chương 3 — Học nhanh hơn với AI', 'Dùng AI làm gia sư, không làm hộ.', [
      ['gia-su', 'AI as a tutor, not a ghostwriter', 'AI là gia sư, không phải người làm hộ', 'Hỏi giải thích · Tự làm trước · Kiểm hiểu'],
      ['doc-code', 'Reading unfamiliar codebases with AI', 'Đọc codebase lạ cùng AI', 'Bản đồ repo · Lần luồng dữ liệu'],
      ['go-loi', 'Debugging with AI', 'Gỡ lỗi cùng AI', 'Đưa đủ ngữ cảnh · Giả thuyết → kiểm chứng'],
      ['tieng-anh', 'Technical English with AI', 'Tiếng Anh kỹ thuật với AI', 'Đọc tài liệu · Viết PR/commit · Luyện phỏng vấn'],
    ]],
    ['Chapter 4 — Calling LLM APIs', 'Chương 4 — Gọi LLM API', 'Dùng agent viết code ngoài giao diện chat: script, CI, đầu ra có cấu trúc. Muốn XÂY tính năng AI ⇒ khoá LLM Apps.', [
      ['api-dau-tien', 'If you want to build AI features, take LLM Apps — this course stays on coding', 'Muốn xây tính năng AI thì học khoá LLM Apps — khoá này chỉ bàn chuyện viết code', 'Khoá này dạy DÙNG AI để viết code, không dạy xây sản phẩm AI · Cốt lõi cần nhớ: khoá API để ở server, system prompt, tin nhắn · Gọi API, streaming, output có cấu trúc, rate limit học sâu ở /courses/llm-apps · Thứ mang sang các bài sau: điều khiển agent viết code qua CLI/SDK'],
      ['streaming', 'Running a coding agent headless: scripts and CI', 'Chạy agent viết code không giao diện: script và CI', 'Chế độ không tương tác (headless, -p) · Đọc output dạng dòng (stream-json) để theo dõi tiến độ · Gắn vào GitHub Actions: tự sửa lint, tự viết mô tả PR · Giới hạn quyền, số bước và thời gian khi không có người trông'],
      ['cau-truc', 'Asking for structured results: patches, checklists and JSON reports', 'Đòi kết quả có cấu trúc: bản vá, checklist và báo cáo JSON', 'Bắt agent trả diff thay vì đoạn văn · Báo cáo review dạng JSON để script đọc · Kiểm đầu ra bằng lệnh thật (tsc, test) chứ không bằng mắt · Schema/Zod cho output trong sản phẩm → /courses/llm-apps Ch4'],
      ['loi-gioi-han', 'Limits, quotas and running out mid-task with a coding agent', 'Hạn mức, quota và hết lượt giữa chừng khi dùng agent viết code', 'Gói thuê bao vs trả theo token · Phiên dài ăn ngữ cảnh: khi nào dọn, khi nào chia việc · Hết hạn mức giữa chừng: ghi lại việc còn dở để phiên sau làm tiếp · Retry/429 trong sản phẩm → /courses/llm-apps Ch6'],
    ]],
    ['Chapter 5 — Prompting for products', 'Chương 5 — Viết prompt cho sản phẩm', 'Prompt cho việc viết code: chỉ đúng mẫu, lưu prompt dùng lại trong repo.', [
      ['nguyen-tac', 'Prompt principles for coding tasks (product prompts → LLM Apps)', 'Nguyên tắc prompt cho việc viết code (prompt cho sản phẩm → khoá LLM Apps)', 'Giao việc cho agent khác prompt chạy trong sản phẩm · Mục tiêu, file liên quan, lệnh kiểm, tiêu chí xong · Mẫu giao việc dùng lại được · Prompt cho người dùng cuối → /courses/llm-apps Ch2'],
      ['few-shot', 'Showing examples: pointing the agent at code to imitate', 'Đưa ví dụ: chỉ agent tới đoạn code mẫu cần bắt chước', 'Trỏ file mẫu thay vì mô tả bằng lời · Quy ước đặt tên và cấu trúc thư mục · Tránh agent chép nhầm mẫu cũ đã lỗi thời · Ví dụ: thêm một route mới theo đúng route có sẵn'],
      ['phien-ban', 'Reusable prompts in the repo: custom commands, skills and CLAUDE.md', 'Prompt dùng lại trong repo: lệnh tuỳ biến, skill và CLAUDE.md', 'Lệnh tuỳ biến cho việc lặp lại (review, viết test, phát hành) · Hướng dẫn theo thư mục · Prompt có phiên bản cùng code, review qua PR · Kiểm prompt bằng cách chạy lại trên việc cũ'],
      ['da-ngon-ngu', 'Working with AI in Vietnamese and English: comments, commits, docs', 'Làm việc với AI bằng tiếng Việt và tiếng Anh: chú thích, commit, tài liệu', 'Giao việc bằng tiếng Việt, code và commit bằng tiếng Anh — chọn quy ước cho nhóm · Thuật ngữ nhất quán giữa code và giao diện · Bẫy chuỗi có dấu: mã hoá, regex ranh giới từ · Ứng dụng AI song ngữ cho người dùng → /courses/llm-apps'],
    ]],
    ['Chapter 6 — Tool use and agents', 'Chương 6 — Tool use và agent', 'Agent viết code dùng tool, MCP và rào chắn ra sao. Tự xây agent ⇒ khoá AI Agents.', [
      ['tool-use', 'How a coding agent uses tools: read, edit, run (building agents → AI Agents)', 'Agent viết code dùng tool thế nào: đọc, sửa, chạy (tự xây agent → khoá AI Agents)', 'Đọc nhật ký tool để biết agent đã làm gì · Vì sao agent chạy lệnh rồi tự sửa lỗi · Đọc hiểu đủ để giám sát, không cần tự viết · Vòng lặp tool và thiết kế tool → /courses/ai-agents Ch1–2'],
      ['agent', 'Delegating multi-step work: plans, subagents and checkpoints', 'Giao việc nhiều bước: kế hoạch, agent con và điểm dừng kiểm', 'Bắt agent lập kế hoạch trước khi sửa · Chia việc lớn thành bước có lệnh kiểm · Agent con song song: khi nào lợi, khi nào giẫm chân nhau · Worktree riêng cho mỗi luồng việc'],
      ['mcp', 'Plugging MCP servers into your coding agent', 'Cắm MCP server vào agent viết code', 'Dùng MCP có sẵn: GitHub, CSDL, trình duyệt · Cho agent đọc issue và tài liệu thật thay vì đoán · Rủi ro của MCP bên thứ ba · Tự viết MCP server → /courses/ai-agents Ch3'],
      ['an-toan', 'Guardrails when the agent runs commands on your machine', 'Rào chắn khi agent chạy lệnh trên máy bạn', 'Danh sách lệnh cho phép/cấm · Hook chặn lệnh nguy hiểm (xoá, force push, reset CSDL) · Sandbox, container, worktree · Sự cố thật: agent xoá dữ liệu, đẩy nhầm nhánh · Guardrail trong sản phẩm → /courses/ai-agents Ch6'],
    ]],
    ['Chapter 7 — Embeddings and RAG', 'Chương 7 — Embedding và RAG', 'Mớm đúng ngữ cảnh cho trợ lý code, hỏi đáp trên chính codebase. Tự xây RAG ⇒ khoá RAG.', [
      ['embedding', 'How coding assistants find the right code (RAG itself → RAG & Vector Search)', 'Trợ lý code tìm đúng đoạn code thế nào (học RAG → khoá RAG & Vector Search)', 'Embedding là gì trong một câu · Tìm kiếm có chủ đích (grep) vs chỉ mục vector của IDE · Vì sao agent đôi khi "không thấy" file · Embedding, chunking, pgvector học sâu ở /courses/rag-vector-search'],
      ['pgvector', 'Feeding the agent the right context: files, docs and references', 'Mớm đúng ngữ cảnh cho agent: file, tài liệu, tham chiếu', 'Chỉ đích danh file thay vì để nó tự đoán · Đưa tài liệu thư viện đúng phiên bản (llms.txt, MCP tài liệu) · Ngữ cảnh quá dài làm chất lượng giảm · pgvector trong sản phẩm → /courses/rag-vector-search Ch3'],
      ['rag', 'Q&A over your own codebase: asking the agent to explain and locate', 'Hỏi đáp trên chính codebase của bạn: nhờ agent giải thích và chỉ chỗ', 'Câu hỏi "chỗ nào xử lý X?" · Bắt agent trích file:dòng làm bằng chứng · Kiểm lại trích dẫn bằng cách mở file · Sơ đồ luồng dữ liệu do AI vẽ — tin tới đâu'],
      ['cai-thien', 'Keeping the agent’s context fresh: conventions, lessons and stale docs', 'Giữ ngữ cảnh của agent luôn mới: quy ước, bài học và tài liệu cũ', 'Model không biết phiên bản thư viện mới nhất · Ghi quy ước và bài học sự cố vào bộ nhớ dự án · Dọn tài liệu cũ đánh lừa agent · Đo xem agent còn lặp lại lỗi cũ không'],
    ]],
    ['Chapter 8 — Evaluation, cost and safety', 'Chương 8 — Đánh giá, chi phí và an toàn', 'AI có thật làm bạn nhanh hơn không, tốn bao nhiêu, và rủi ro bảo mật/pháp lý khi code với AI.', [
      ['evals', 'Measuring whether AI really makes you faster (product evals → AI Agents, MLOps)', 'Đo xem AI có thật làm bạn nhanh hơn (eval cho sản phẩm → khoá AI Agents, MLOps)', 'Thời gian tới khi PR được merge, số lần phải sửa lại · Bộ việc mẫu để so công cụ và model · Nghiên cứu thật về năng suất khi dùng AI · Eval cho sản phẩm AI → /courses/ai-agents Ch7–8 và /courses/mlops-llmops Ch9'],
      ['chi-phi', 'The cost of AI-assisted development for you and your team', 'Chi phí phát triển có AI hỗ trợ cho bạn và nhóm', 'Thuê bao theo người vs API theo token · Chọn model theo độ khó của việc · Ngữ cảnh dài là tiền · Chi phí của tính năng AI trong sản phẩm → /courses/llm-apps Ch6'],
      ['injection', 'Prompt injection against coding agents: poisoned repos, issues and packages', 'Prompt injection nhắm vào agent viết code: repo, issue và gói bị cài bẫy', 'Lệnh ẩn trong README, issue, chú thích · Gói bịa tên (slopsquatting) · Không để agent tự chạy script lạ · Phòng thủ cho sản phẩm LLM, OWASP LLM Top 10 → /courses/llm-apps Ch7'],
      ['rieng-tu', 'Privacy, licences and company policy when coding with AI', 'Quyền riêng tư, giấy phép và chính sách công ty khi code với AI', 'Code công ty có được gửi lên AI không · Bí mật trong .env và log · Giấy phép của code AI sinh ra · Ghi rõ phần AI đóng góp trong commit'],
    ]],
    ['Chapter 9 — Capstone: an AI assistant for a booking app', 'Chương 9 — Dự án cuối khoá: trợ lý AI cho app đặt lịch', 'Trợ lý hỏi đáp + đặt lịch bằng tool use + RAG.', [
      ['thiet-ke', 'Designing the assistant', 'Thiết kế trợ lý', 'Việc nó làm và không làm · Dữ liệu'],
      ['dung', 'Building RAG and tools', 'Dựng RAG và tool', 'Hỏi đáp quy định phòng khám · Tool đặt/huỷ lịch'],
      ['do-danh-gia', 'Evaluating and hardening it', 'Đánh giá và gia cố', 'Evals · Chống injection · Trần chi phí'],
      ['tong-ket', 'Shipping it and telling the story', 'Đưa lên và kể lại khi phỏng vấn', 'Checklist · Kể dự án'],
    ]],
  ]),
};
