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
    ['Chapter 4 — Calling LLM APIs', 'Chương 4 — Gọi LLM API', 'Tích hợp model vào backend Node.', [
      ['api-dau-tien', 'Your first API call', 'Lời gọi API đầu tiên', 'SDK · Khoá API ở server · System prompt · Tin nhắn'],
      ['streaming', 'Streaming responses to the browser', 'Trả lời dạng dòng về trình duyệt', 'SSE · Huỷ giữa chừng · Hiển thị Markdown'],
      ['cau-truc', 'Structured output', 'Đầu ra có cấu trúc', 'JSON theo schema · Kiểm bằng Zod · Thử lại khi sai'],
      ['loi-gioi-han', 'Errors, rate limits and timeouts', 'Lỗi, giới hạn tần suất và timeout', '429/529 · Retry · Trần chi phí'],
    ]],
    ['Chapter 5 — Prompting for products', 'Chương 5 — Viết prompt cho sản phẩm', 'Prompt là code: có phiên bản và có test.', [
      ['nguyen-tac', 'Prompt principles that hold up', 'Nguyên tắc prompt đứng vững', 'Rõ ràng · Ví dụ · Vai trò · Định dạng'],
      ['few-shot', 'Examples and few-shot', 'Ví dụ và few-shot', 'Chọn ví dụ · Tránh học vẹt'],
      ['phien-ban', 'Versioning and testing prompts', 'Quản lý phiên bản và test prompt', 'Prompt trong repo · Test hồi quy'],
      ['da-ngon-ngu', 'Vietnamese and bilingual apps', 'Tiếng Việt và ứng dụng song ngữ', 'Dấu · Thuật ngữ · Chi phí token tiếng Việt'],
    ]],
    ['Chapter 6 — Tool use and agents', 'Chương 6 — Tool use và agent', 'Cho model gọi hàm của bạn.', [
      ['tool-use', 'Tool use (function calling)', 'Tool use (gọi hàm)', 'Định nghĩa tool · Vòng lặp · Kết quả tool'],
      ['agent', 'Building a small agent loop', 'Dựng một vòng lặp agent nhỏ', 'Khi nào dừng · Giới hạn bước · Log'],
      ['mcp', 'MCP: connecting tools to AI apps', 'MCP: nối công cụ vào ứng dụng AI', 'Khái niệm · Viết một MCP server nhỏ'],
      ['an-toan', 'Guardrails for agents', 'Rào chắn cho agent', 'Quyền tối thiểu · Xác nhận hành động nguy hiểm'],
    ]],
    ['Chapter 7 — Embeddings and RAG', 'Chương 7 — Embedding và RAG', 'Hỏi đáp trên tài liệu của chính bạn.', [
      ['embedding', 'Embeddings and similarity', 'Embedding và độ tương đồng', 'Vector · Cosine · Ví dụ trực quan'],
      ['pgvector', 'pgvector in Postgres', 'pgvector trong Postgres', 'Cột vector · Index HNSW · Truy vấn'],
      ['rag', 'Retrieval-augmented generation', 'Retrieval-augmented generation (RAG)', 'Chia đoạn · Truy xuất · Trích dẫn nguồn'],
      ['cai-thien', 'Improving retrieval', 'Cải thiện truy xuất', 'Hybrid search · Rerank · Đo recall'],
    ]],
    ['Chapter 8 — Evaluation, cost and safety', 'Chương 8 — Đánh giá, chi phí và an toàn', 'Biết nó tốt tới đâu và tốn bao nhiêu.', [
      ['evals', 'Evals: measuring quality', 'Evals: đo chất lượng', 'Bộ câu hỏi chuẩn · Chấm tự động · LLM chấm LLM'],
      ['chi-phi', 'Cost control', 'Kiểm soát chi phí', 'Đếm token · Cache prompt · Chọn model theo việc · Trần ngày'],
      ['injection', 'Prompt injection and data leaks', 'Prompt injection và lộ dữ liệu', 'OWASP LLM Top 10 · Tách dữ liệu và lệnh'],
      ['rieng-tu', 'Privacy and responsible use', 'Quyền riêng tư và dùng có trách nhiệm', 'Dữ liệu người dùng · Minh bạch · Luật'],
    ]],
    ['Chapter 9 — Capstone: an AI assistant for a booking app', 'Chương 9 — Dự án cuối khoá: trợ lý AI cho app đặt lịch', 'Trợ lý hỏi đáp + đặt lịch bằng tool use + RAG.', [
      ['thiet-ke', 'Designing the assistant', 'Thiết kế trợ lý', 'Việc nó làm và không làm · Dữ liệu'],
      ['dung', 'Building RAG and tools', 'Dựng RAG và tool', 'Hỏi đáp quy định phòng khám · Tool đặt/huỷ lịch'],
      ['do-danh-gia', 'Evaluating and hardening it', 'Đánh giá và gia cố', 'Evals · Chống injection · Trần chi phí'],
      ['tong-ket', 'Shipping it and telling the story', 'Đưa lên và kể lại khi phỏng vấn', 'Checklist · Kể dự án'],
    ]],
  ]),
};
