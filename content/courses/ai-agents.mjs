/**
 * AI Agents & LLM Evaluation — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm
 * của 11 khoá khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Nối tiếp khoá LLM Apps và RAG/Vector Search. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'ai-agents',
    title: 'AI Agents & LLM Evaluation',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/ai-agents.png?v=1',
    shortDescription: 'The agent loop, tool calling and MCP, memory, multi-agent systems, guardrails, and evaluation: building an eval set, LLM-as-judge, observability and cost control for agents that run more than one step.|||Vòng lặp agent, tool calling và MCP, bộ nhớ, đa agent, guardrail, và đánh giá: xây bộ eval, LLM-as-judge, quan sát và kiểm soát chi phí cho agent chạy nhiều bước.',
    description: 'Một "AI agent" là một LLM được cho phép tự lặp lại: quan sát, quyết định, hành động (gọi tool), quan sát kết quả, rồi quyết định tiếp — cho tới khi xong việc. Khoá đi từ vòng lặp agent cơ bản, thiết kế tool tốt, Model Context Protocol (MCP) — chuẩn mở để kết nối agent với tool/dữ liệu bên ngoài, bộ nhớ ngắn hạn/dài hạn, hệ thống đa agent (một agent điều phối gọi các agent con), guardrail để agent không làm việc nguy hiểm ngoài ý muốn, đánh giá agent bằng bộ eval và LLM-as-judge (khác đánh giá một câu trả lời đơn — ở đây phải đánh giá cả một chuỗi hành động), quan sát/log để debug khi agent đi sai đường, và kiểm soát chi phí khi một tác vụ có thể gọi model hàng chục lần. Kết thúc bằng một agent nhỏ thật sự làm việc: có tool, có eval, có giới hạn.',
    whatYouLearn: 'Thiết kế vòng lặp agent (plan → act → observe) đúng và có điểm dừng; thiết kế tool rõ ràng, an toàn, dễ để model gọi đúng; hiểu và dùng Model Context Protocol (MCP) để kết nối agent với tool/dữ liệu ngoài; quản lý bộ nhớ ngắn hạn và dài hạn cho agent; thiết kế hệ đa agent khi một agent không đủ; đặt guardrail và quyền hạn để agent không vượt phạm vi cho phép; xây bộ eval và dùng LLM-as-judge để đo chất lượng agent một cách có hệ thống; quan sát và debug một chuỗi hành động agent; và kiểm soát chi phí/độ trễ trong vòng lặp gọi tool nhiều bước.',
    requirements: 'Đã học khoá LLM Apps (bắt buộc — vòng lặp agent dựng trên tool calling và structured output đã học ở đó). Nên học khoá RAG/Vector Search trước nếu agent cần tra cứu dữ liệu riêng. Biết Node.js/TypeScript hoặc Python ở mức viết được một API nhỏ.',
    documentsNote: 'Tài liệu chính: modelcontextprotocol.io (đặc tả MCP) • docs.anthropic.com (tool use, agent patterns) • Bài viết "Building Effective Agents" của Anthropic là tài liệu nền cho phần thiết kế agent loop và multi-agent trong khoá này.',
  },
  sections: khung('agt', [
    ['Section 0 — What an agent actually is', 'Mục 0 — Agent thực chất là gì', 'Phân biệt "agent" với một tính năng chat có tool calling một lần.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Agents vs single tool calls, and why 2025–2026 made this real', 'Bắt đầu tại đây (1/2) — Agent khác một lần gọi tool ở đâu, và vì sao 2025–2026 làm nó thành thật', 'Một lần gọi tool (đã học ở khoá LLM Apps) vs vòng lặp nhiều bước tự quyết định · MCP ra mắt cuối 2024, trở thành chuẩn thực tế 2025 · Agent viết code (Claude Code và tương tự) là ví dụ agent phổ biến nhất hiện nay · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — What goes wrong without guardrails and eval, and how to study this course', 'Bắt đầu tại đây (2/2) — Không có guardrail và eval thì hỏng ở đâu, và cách học khoá này', 'Tình huống thật: agent lặp vô hạn gọi tool tốn tiền không kiểm soát · Agent tự tin làm sai một hành động không thể hoàn tác · Lộ trình: vòng lặp → tool/MCP → bộ nhớ → đa agent → guardrail → eval → quan sát → chi phí → capstone'],
      ['vong-lap-agent', 'The core loop: observe, decide, act', 'Vòng lặp lõi: quan sát, quyết định, hành động', 'Plan → act → observe → lặp lại tới khi xong hoặc chạm giới hạn · Điểm dừng: xong việc, hết lượt, hoặc cần người xác nhận · Agent đơn giản nhất chỉ là một while loop có tool'],
      ['khi-nao-can-agent', 'When you need an agent, and when a single call is enough', 'Khi nào cần agent, khi nào một lần gọi là đủ', 'Việc một bước rõ ràng: không cần agent, dùng tool calling đơn giản · Việc nhiều bước, phụ thuộc kết quả bước trước: cần agent · Agent luôn đắt và chậm hơn một lần gọi — chỉ dùng khi thật sự cần'],
    ]],
    ['Chapter 1 — The agent loop in code', 'Chương 1 — Vòng lặp agent bằng code', 'Tự viết một agent loop tối giản trước khi dùng framework.', [
      ['tu-viet-loop', 'Writing a minimal agent loop by hand', 'Tự viết một vòng lặp agent tối giản', 'While loop gọi model, kiểm tool_calls, chạy tool, gửi kết quả lại · Không cần framework để hiểu cơ chế · Giới hạn số vòng lặp tối đa (max iterations)'],
      ['trang-thai', 'Managing state across iterations', 'Quản lý trạng thái qua các vòng lặp', 'Lịch sử hội thoại tích luỹ qua từng bước · Kết quả tool phải được đưa lại đúng định dạng model hiểu · Tránh lịch sử phình to làm vượt context window'],
      ['diem-dung', 'Stopping conditions and final answers', 'Điều kiện dừng và câu trả lời cuối', 'Model tự báo "đã xong" bằng cách không gọi tool nữa · Dừng cứng khi vượt số vòng lặp hoặc thời gian · Trả về kết quả từng phần khi bị dừng giữa chừng, đừng để mất trắng'],
      ['framework-vs-tu-viet', 'Frameworks vs hand-rolled: what you actually need', 'Framework hay tự viết: bạn thực sự cần gì', 'Framework agent phổ biến giúp gì (quản lý state, tool registry) · Cái giá của framework: khó debug khi có sự cố · Hiểu vòng lặp tay trước, chọn framework sau khi đã hiểu'],
    ]],
    ['Chapter 2 — Designing tools for agents', 'Chương 2 — Thiết kế tool cho agent', 'Tool tốt quyết định agent có làm đúng việc hay không.', [
      ['nguyen-tac-tool', 'Principles of a well-designed tool', 'Nguyên tắc thiết kế một tool tốt', 'Tên và mô tả rõ ràng, không mơ hồ · Tham số tối thiểu cần thiết, không bắt model đoán · Một tool làm một việc, không gộp nhiều chức năng vào một tool'],
      ['tool-composability', 'Composable tools vs one giant tool', 'Tool có thể kết hợp vs một tool khổng lồ', 'Nhiều tool nhỏ để agent tự ghép theo tình huống · Một tool lớn làm sẵn cả quy trình — nhanh nhưng kém linh hoạt · Chọn theo mức độ agent cần tự quyết định'],
      ['loi-tool', 'Returning errors tools can act on', 'Trả lỗi mà agent xử lý tiếp được', 'Thông báo lỗi đủ cụ thể để model tự sửa tham số và gọi lại · Không trả traceback thô cho model · Phân biệt lỗi có thể tự sửa và lỗi cần dừng lại hỏi người dùng'],
      ['thu-nghiem-tool', 'Testing tools in isolation before wiring to an agent', 'Test tool riêng trước khi gắn vào agent', 'Gọi tool trực tiếp bằng tay để chắc nó đúng · Agent chỉ khuếch đại lỗi của tool, không che giấu nó · Viết test cho tool như test một hàm bình thường'],
    ]],
    ['Chapter 3 — Model Context Protocol (MCP)', 'Chương 3 — Model Context Protocol (MCP)', 'Chuẩn mở để nối agent với tool và dữ liệu bên ngoài.', [
      ['mcp-la-gi', 'What MCP standardizes, and why it matters', 'MCP chuẩn hoá điều gì, và vì sao quan trọng', 'Trước MCP: mỗi ứng dụng tự viết tích hợp tool riêng · MCP: một giao thức chung cho tool, resource, prompt · Client-server: agent (client) nói chuyện với MCP server qua giao thức chung'],
      ['mcp-server', 'Building a minimal MCP server', 'Dựng một MCP server tối giản', 'Định nghĩa tool theo chuẩn MCP · stdio vs HTTP transport · Chạy thử server bằng MCP Inspector'],
      ['mcp-client', 'Connecting an agent to an MCP server', 'Kết nối agent với một MCP server', 'Agent khám phá danh sách tool từ server lúc kết nối · Gọi tool qua giao thức MCP thay vì hard-code · Nhiều MCP server cùng lúc cho một agent'],
      ['mcp-resource-prompt', 'Resources and prompts in MCP', 'Resource và prompt trong MCP', 'Resource: dữ liệu server cung cấp cho agent đọc · Prompt: mẫu prompt server gợi ý sẵn · Khi nào dùng resource thay vì tool'],
    ]],
    ['Chapter 4 — Memory', 'Chương 4 — Bộ nhớ', 'Agent nhớ gì trong một phiên, và nhớ gì qua nhiều phiên.', [
      ['bo-nho-ngan-han', 'Short-term memory: the context window', 'Bộ nhớ ngắn hạn: context window', 'Toàn bộ lịch sử hội thoại/hành động trong một phiên · Giới hạn context window buộc phải tóm tắt hoặc cắt bớt · Tóm tắt lịch sử cũ để giữ chỗ cho hành động mới'],
      ['bo-nho-dai-han', 'Long-term memory across sessions', 'Bộ nhớ dài hạn qua nhiều phiên', 'Lưu thông tin quan trọng vào database, không phải context window · Truy xuất lại khi cần (giống retrieval trong RAG) · Phân biệt "sự kiện đã xảy ra" và "sở thích/quy tắc cố định"'],
      ['toan-tat', 'Summarization and context compaction', 'Tóm tắt và nén ngữ cảnh', 'Tóm tắt định kỳ khi lịch sử quá dài · Giữ lại thông tin quan trọng, bỏ chi tiết thừa · Rủi ro: tóm tắt làm mất thông tin cần cho bước sau'],
      ['quyen-rieng-tu-bo-nho', 'Privacy and scoping memory per user', 'Quyền riêng tư và giới hạn bộ nhớ theo người dùng', 'Bộ nhớ của người dùng A không rò sang người dùng B · Cho phép người dùng xem/xoá bộ nhớ đã lưu về họ · Không lưu thông tin nhạy cảm vào bộ nhớ dài hạn nếu không cần thiết'],
    ]],
    ['Chapter 5 — Multi-agent systems', 'Chương 5 — Hệ thống đa agent', 'Khi một agent không đủ, và cách điều phối nhiều agent.', [
      ['khi-nao-can-multi', 'When one agent is not enough', 'Khi nào một agent là không đủ', 'Việc quá rộng làm một agent bị loãng trọng tâm · Chia theo chuyên môn: agent nghiên cứu, agent viết, agent kiểm tra · Cái giá: phức tạp hơn, chi phí và độ trễ cao hơn'],
      ['orchestrator', 'Orchestrator–worker pattern', 'Mẫu điều phối viên–agent con', 'Agent điều phối chia việc, gọi agent con, gộp kết quả · Agent con không cần biết về toàn bộ hệ thống · Xử lý khi một agent con thất bại'],
      ['giao-tiep-agent', 'How agents hand off work to each other', 'Cách các agent bàn giao việc cho nhau', 'Định dạng dữ liệu bàn giao rõ ràng, không phải văn xuôi tự do · Agent con trả kết quả có cấu trúc để agent cha dùng tiếp · Tránh vòng lặp bàn giao qua lại vô hạn'],
      ['debug-multi', 'Debugging a multi-agent run', 'Debug một lượt chạy đa agent', 'Log riêng cho từng agent, có ID lượt chạy chung · Xác định agent nào làm sai trong một chuỗi dài · Test từng agent con độc lập trước khi ráp vào hệ thống'],
    ]],
    ['Chapter 6 — Guardrails', 'Chương 6 — Guardrail', 'Giới hạn quyền hạn để agent không làm việc ngoài ý muốn.', [
      ['quyen-toi-thieu', 'Least privilege for agent tools', 'Quyền tối thiểu cho tool của agent', 'Mỗi tool chỉ có đúng quyền cần thiết (đọc-chỉ, hay được ghi) · Không cho agent quyền xoá/ghi trên toàn hệ thống chỉ vì tiện · Tách tool nguy hiểm ra khỏi bộ tool mặc định'],
      ['xac-nhan-nguoi', 'Human-in-the-loop for risky actions', 'Con người xác nhận cho hành động rủi ro', 'Hành động không thể hoàn tác cần xác nhận trước khi chạy · Ngưỡng nào cần xác nhận, ngưỡng nào agent tự làm · Trải nghiệm xác nhận không nên làm chậm mọi thao tác nhỏ'],
      ['sandbox', 'Sandboxing agent execution', 'Chạy agent trong môi trường cô lập (sandbox)', 'Giới hạn agent chạy code trong container/quyền hạn hẹp · Giới hạn tài nguyên (thời gian, mạng, đĩa) · Không để agent tự sửa quyền hạn của chính nó'],
      ['gioi-han-vong-lap', 'Limiting loops, cost and blast radius', 'Giới hạn số vòng lặp, chi phí và phạm vi ảnh hưởng', 'Trần số vòng lặp và trần chi phí cho một lượt chạy · Giới hạn phạm vi dữ liệu agent được chạm tới trong một lượt · Dừng khẩn cấp (kill switch) khi phát hiện agent đi sai hướng'],
    ]],
    ['Chapter 7 — Evaluation: building an eval set', 'Chương 7 — Đánh giá: xây bộ eval', 'Đo agent bằng số liệu, khác hẳn đo một câu trả lời đơn.', [
      ['eval-agent-khac-gi', 'Why evaluating an agent differs from evaluating one answer', 'Vì sao đánh giá agent khác đánh giá một câu trả lời', 'Phải đánh giá cả chuỗi hành động, không chỉ câu trả lời cuối · Nhiều đường đi đúng có thể dẫn tới cùng kết quả · Lỗi có thể xảy ra ở bước giữa mà kết quả cuối vẫn "trông đúng"'],
      ['xay-bo-eval', 'Building a task-based eval set', 'Xây bộ eval theo tác vụ', 'Mỗi ca: tình huống đầu vào + tiêu chí thành công rõ ràng · Bao phủ ca dễ, ca hiểm, và ca cố tình gây nhầm lẫn (adversarial) · Cập nhật bộ eval khi phát hiện lỗi mới trong thực tế'],
      ['tieu-chi-thanh-cong', 'Defining success criteria per task', 'Định nghĩa tiêu chí thành công cho từng tác vụ', 'Tiêu chí có thể kiểm tra tự động khi có thể (đúng/sai rõ ràng) · Tiêu chí cần LLM-as-judge khi câu trả lời mở · Trộn cả hai loại trong một bộ eval'],
      ['chay-eval-tu-dong', 'Running evals automatically', 'Chạy eval tự động', 'Chạy bộ eval như một bộ test, có thể đưa vào CI · So sánh kết quả trước/sau khi đổi prompt hoặc tool · Theo dõi tỉ lệ đạt theo thời gian, không chỉ chạy một lần rồi thôi'],
    ]],
    ['Chapter 8 — LLM-as-judge and observability', 'Chương 8 — LLM-as-judge và quan sát hệ thống', 'Chấm điểm tự động và nhìn ra chuyện gì đã xảy ra khi agent sai.', [
      ['llm-judge-thiet-ke', 'Designing an LLM-as-judge prompt', 'Thiết kế prompt cho LLM-as-judge', 'Tiêu chí chấm cụ thể, không mơ hồ · Judge cho điểm kèm lý do, không chỉ đúng/sai · Judge dùng model khác hoặc prompt khác để giảm thiên vị'],
      ['han-che-judge', 'Limits of LLM-as-judge', 'Giới hạn của LLM-as-judge', 'Judge có thể sai giống hệt lỗi mà nó đang chấm · Không thay thế hoàn toàn việc người thật xem lại mẫu · Dùng judge để lọc thô, người xem lại ca khó'],
      ['tracing', 'Tracing a multi-step agent run', 'Trace một lượt chạy agent nhiều bước', 'Ghi lại từng bước: input, quyết định, tool gọi, kết quả · ID lượt chạy xuyên suốt để nối các log lại · Công cụ trace chuyên dụng vs tự ghi log có cấu trúc'],
      ['debug-thuc-te', 'Debugging a real failed run', 'Debug một lượt chạy thất bại thật', 'Đọc trace từ đầu để tìm bước rẽ sai · Tái hiện lại lỗi bằng chính input đã gây lỗi · Thêm ca lỗi đó vào bộ eval để không tái phạm'],
    ]],
    ['Chapter 9 — Cost and latency in the loop', 'Chương 9 — Chi phí và độ trễ trong vòng lặp', 'Một tác vụ agent có thể gọi model hàng chục lần — kiểm soát trước khi ra production.', [
      ['do-chi-phi-that', 'Measuring real cost of a multi-step run', 'Đo chi phí thật của một lượt chạy nhiều bước', 'Giá lẻ một lượt không suy ra được giá trong vòng lặp — phải đo thật · Token ẩn (bọc hệ thống, lịch sử tích luỹ) nhân theo số vòng · So sánh model theo chi phí ĐO ĐƯỢC trong đúng vòng lặp, không theo bảng giá quảng cáo'],
      ['giam-chi-phi', 'Reducing cost: caching, cheaper sub-steps, early exit', 'Giảm chi phí: cache, bước phụ dùng model rẻ, thoát sớm', 'Cache kết quả tool cho input lặp lại · Bước máy đọc dùng model rẻ, bước người đọc dùng model tốt · Dừng sớm khi đã đủ thông tin, không lặp thêm cho chắc'],
      ['do-tre', 'Latency: parallel tool calls and streaming progress', 'Độ trễ: gọi tool song song và stream tiến trình', 'Gọi các tool độc lập song song thay vì tuần tự · Hiện tiến trình cho người dùng thay vì màn hình trắng nhiều giây · Timeout cho từng bước, không để một bước treo cả lượt chạy'],
      ['tran-an-toan', 'Setting hard limits before production', 'Đặt trần cứng trước khi lên production', 'Trần số vòng lặp, trần chi phí, trần thời gian cho một lượt chạy · Cảnh báo khi trần bị chạm thường xuyên (dấu hiệu thiết kế sai) · Trần theo người dùng để một người không dùng hết ngân sách chung'],
    ]],
    ['Chapter 10 — Capstone: a small coding/task agent', 'Chương 10 — Dự án cuối khoá: một agent nhỏ làm việc thật', 'Ráp vòng lặp, tool, guardrail và eval vào một agent hoàn chỉnh.', [
      ['chon-tac-vu', 'Choosing a scoped task for the agent', 'Chọn một tác vụ có phạm vi rõ cho agent', 'Một việc cụ thể, kiểm chứng được kết quả (ví dụ: agent sửa lỗi nhỏ trong một file, hoặc agent tra cứu + tổng hợp) · Xác định tool cần thiết tối thiểu · Xác định tiêu chí "hoàn thành" rõ ràng'],
      ['xay-agent', 'Building the loop, tools and guardrails', 'Xây vòng lặp, tool và guardrail', 'Vòng lặp có trần số bước và trần chi phí · Tool có quyền tối thiểu, có xử lý lỗi agent tự sửa được · Điểm cần xác nhận người dùng nếu hành động rủi ro'],
      ['xay-eval', 'Building and running an eval set for it', 'Xây và chạy bộ eval cho agent này', 'Ít nhất 10-15 ca thử, có ca dễ và ca hiểm · Tiêu chí tự động khi có thể, LLM-as-judge khi cần · Đo tỉ lệ đạt trước và sau khi chỉnh sửa'],
      ['tong-ket', 'Wrap-up: what production agent work looks like', 'Tổng kết: công việc agent ở production trông như thế nào', 'Checklist năng lực cả khoá · Giám sát liên tục sau khi lên production, không chỉ eval một lần · Nối lại toàn bộ chuỗi: Python/FastAPI (nền) → LLM Apps → RAG → AI Agents'],
    ]],
  ]),
};
