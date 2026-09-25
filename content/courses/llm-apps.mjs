/**
 * Building AI Apps with LLMs — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm
 * của 11 khoá khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Dùng chính cổng LLM modelapi.vn mà web này đang chạy làm ví dụ tham chiếu
 * (xem src/services/llm/gateway.ts) — không dạy một cổng cụ thể, dạy khái niệm áp dụng được cho Claude/OpenAI-compatible
 * nói chung. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'llm-apps',
    title: 'Building AI Apps with LLMs',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/llm-apps.png?v=1',
    shortDescription: 'Call Claude/OpenAI-compatible APIs the right way: prompting, streaming, structured JSON output, tool calling, tokens and cost, rate limits, prompt-injection safety — wired into a real Node/React and Python backend.|||Gọi API Claude/OpenAI-compatible đúng cách: prompt, streaming, output JSON có cấu trúc, tool calling, token và chi phí, rate limit, an toàn trước prompt injection — gắn vào backend Node/React và Python thật.',
    description: 'Khoá dạy cách xây tính năng AI thật trong một sản phẩm, không phải "hỏi ChatGPT". Nội dung: gọi API LLM (Claude Messages API và các API tương thích OpenAI Chat Completions), viết prompt hệ thống có kiểm soát, streaming phản hồi theo thời gian thực, ép output ra JSON theo schema để code xử lý được, tool calling (function calling) để model gọi lại hàm của bạn, quản lý token và ước lượng chi phí, xử lý rate limit và retry, phòng chống prompt injection và lọc output, rồi gắn tất cả vào một backend Node/Express + frontend React (chat UI streaming thật) và một backend Python/FastAPI. Học xong có thể tự thêm tính năng "hỏi AI" vào bất kỳ ứng dụng nào một cách an toàn và có kiểm soát chi phí.',
    whatYouLearn: 'Gọi API LLM đúng định dạng message, hệ thống prompt vs user prompt; viết prompt rõ ràng, có ví dụ (few-shot), tránh mơ hồ; stream phản hồi ra giao diện theo thời gian thực bằng SSE; ép model trả JSON đúng schema để code parse an toàn; cho model gọi tool/function và xử lý kết quả; đếm và ước lượng chi phí token trước khi tính năng lên production; xử lý rate limit bằng retry có backoff; nhận diện và giảm rủi ro prompt injection; và nối một tính năng AI hoàn chỉnh vào cả stack Node/React lẫn Python/FastAPI.',
    requirements: 'Biết Node.js/TypeScript hoặc Python ở mức gọi được một REST API (khoá Node.js hoặc Python của CuongThai là đủ). Nên biết React để làm phần streaming UI ở Chương 8. Cần một API key của nhà cung cấp LLM tương thích Claude hoặc OpenAI để thực hành gọi thật (có gói miễn phí/dùng thử ở hầu hết nhà cung cấp).',
    documentsNote: 'Tài liệu chính: docs.anthropic.com (Messages API, streaming, tool use) • platform.openai.com/docs (Chat Completions, structured outputs, function calling) • modelcontextprotocol.io cho phần tool calling nâng cao ở khoá AI Agents tiếp theo.',
  },
  sections: khung('llm', [
    ['Section 0 — The LLM app landscape', 'Mục 0 — Bức tranh ứng dụng LLM', 'Ứng dụng AI thật khác một khung chat demo ở đâu.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What an "LLM app" is, and why it is not just a chatbox', 'Bắt đầu tại đây (1/2) — "Ứng dụng LLM" là gì, và vì sao nó không chỉ là một ô chat', 'Từ GPT-3 API 2020 tới Claude/GPT hiện nay: model như một dịch vụ HTTP · Ứng dụng AI thật: streaming, tool calling, chi phí, an toàn · Câu hỏi phỏng vấn hay gặp về "AI engineering"'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — What breaks without these patterns, and how to study this course', 'Bắt đầu tại đây (2/2) — Không có những mẫu này thì hỏng ở đâu, và cách học khoá này', 'Tình huống thật: tính năng AI không streaming làm người dùng chờ 8 giây nhìn màn hình trắng · Output không ép schema làm code parse vỡ · Lộ trình: gọi API → prompt → streaming → structured → tool → chi phí → an toàn → gắn vào app thật'],
      ['goi-api-dau-tien', 'Your first API call to an LLM', 'Lời gọi API đầu tiên tới một LLM', 'Messages API (Anthropic) vs Chat Completions (OpenAI-compatible) · system/user/assistant role · Đọc response JSON'],
      ['chon-model', 'Choosing a model: capability, latency, cost', 'Chọn model: năng lực, độ trễ, chi phí', 'Model rẻ cho việc máy đọc, model tốt cho việc người dùng đọc từng chữ · Độ trễ tới mẩu chữ đầu tiên · Không có model "tốt nhất tuyệt đối", chỉ có model đúng việc'],
    ]],
    ['Chapter 1 — Calling the API correctly', 'Chương 1 — Gọi API đúng cách', 'Cấu trúc request, message, và tham số quan trọng.', [
      ['cau-truc-message', 'Message structure and conversation history', 'Cấu trúc message và lịch sử hội thoại', 'Mảng messages giữ ngữ cảnh · System prompt tách riêng khỏi lịch sử · Giới hạn độ dài ngữ cảnh (context window)'],
      ['tham-so-quan-trong', 'Key parameters: temperature, max_tokens, stop', 'Tham số quan trọng: temperature, max_tokens, stop', 'temperature điều khiển độ ngẫu nhiên · max_tokens giới hạn output, không giới hạn được input · stop_sequences'],
      ['xu-ly-loi', 'Handling API errors', 'Xử lý lỗi từ API', 'Mã lỗi hay gặp: 401, 429, 500, 503 · Lỗi tạm thời vs lỗi cấu hình sai · Log đủ để debug mà không log lộ nội dung nhạy cảm'],
      ['sdk-vs-http', 'SDK vs raw HTTP calls', 'Dùng SDK hay gọi HTTP trần', 'SDK chính thức (anthropic, openai) tiện nhưng thêm dependency · Gọi fetch/httpx trần khi cần kiểm soát chi tiết · Chọn theo nhu cầu dự án'],
    ]],
    ['Chapter 2 — Prompting fundamentals', 'Chương 2 — Nền tảng viết prompt', 'System prompt, few-shot, và viết chỉ dẫn rõ ràng.', [
      ['system-prompt', 'Writing an effective system prompt', 'Viết system prompt hiệu quả', 'Vai trò, ràng buộc, định dạng output mong muốn · Ngắn gọn và cụ thể hơn là dài dòng · Đặt quy tắc quan trọng ở đầu và cuối'],
      ['few-shot', 'Few-shot examples', 'Ví dụ mẫu (few-shot)', 'Cho model vài ví dụ input/output đúng định dạng · Khi nào few-shot cần thiết, khi nào zero-shot đủ · Ví dụ mâu thuẫn làm model bối rối'],
      ['chain-of-thought', 'Structuring reasoning with clear steps', 'Cấu trúc lý luận bằng các bước rõ ràng', 'Yêu cầu model suy nghĩ theo bước trước khi trả lời cuối · Khi nào cần, khi nào chỉ tốn token · Tách bước suy luận khỏi câu trả lời hiển thị cho người dùng'],
      ['do-luong-prompt', 'Testing and iterating on prompts', 'Kiểm và cải tiến prompt lặp lại', 'Một bộ ví dụ thử cố định để so sánh trước/sau khi sửa prompt · Prompt version như code, review được · Giới thiệu ý tưởng eval (đào sâu ở khoá AI Agents)'],
    ]],
    ['Chapter 3 — Streaming responses', 'Chương 3 — Phản hồi dạng streaming', 'Trả lời từng phần theo thời gian thực, đúng cách người dùng mong đợi.', [
      ['vi-sao-streaming', 'Why streaming matters for UX', 'Vì sao streaming quan trọng cho trải nghiệm', 'Chờ 8 giây màn hình trắng vs thấy chữ chạy dần · Time-to-first-token là chỉ số quan trọng nhất với người dùng · Khi nào không cần streaming (việc chạy nền)'],
      ['stream-api', 'Consuming a streamed API response', 'Đọc response dạng stream từ API', 'stream=true trong request · Đọc từng event/chunk · Ghép chunk lại thành câu trả lời hoàn chỉnh'],
      ['sse-web', 'Forwarding the stream to a web client via SSE', 'Chuyển tiếp stream cho client web qua SSE', 'Backend nhận stream từ LLM, forward qua SSE cho frontend · Không buffer toàn bộ trước khi gửi · Đóng kết nối đúng lúc'],
      ['huy-stream', 'Cancelling a stream mid-flight', 'Huỷ một stream giữa chừng', 'Người dùng bấm dừng hoặc đóng tab · AbortController phía client · Dừng gọi API phía backend để khỏi tốn token thừa'],
    ]],
    ['Chapter 4 — Structured output', 'Chương 4 — Output có cấu trúc', 'Ép model trả JSON đúng schema để code xử lý được.', [
      ['vi-sao-structured', 'Why free-text output breaks code', 'Vì sao output văn bản tự do làm vỡ code', 'Parse chuỗi tự do dễ lỗi và không ổn định · Ứng dụng cần dữ liệu có cấu trúc, không phải văn xuôi'],
      ['json-schema', 'Constraining output with a JSON schema', 'Ép output theo JSON schema', 'response_format kiểu OpenAI-compatible · Định nghĩa schema rõ ràng, field bắt buộc · Validate lại bằng Zod/Pydantic sau khi nhận (đừng tin tuyệt đối)'],
      ['xu-ly-loi-format', 'Handling malformed or partial output', 'Xử lý output sai định dạng hoặc chưa hoàn chỉnh', 'Model vẫn có thể trả sai schema dù đã ép · Retry với thông báo lỗi cụ thể · Giá trị mặc định an toàn khi parse thất bại'],
      ['extraction', 'A worked example: extracting structured data from text', 'Ví dụ thực hành: trích xuất dữ liệu có cấu trúc từ văn bản', 'Trích thông tin từ một đoạn văn bản tự do (tên, ngày, số tiền) · So sánh với cách làm bằng regex truyền thống · Khi nào LLM đáng giá hơn parser thủ công'],
    ]],
    ['Chapter 5 — Tool calling', 'Chương 5 — Gọi tool (function calling)', 'Cho model gọi lại hàm của bạn để lấy dữ liệu thật hoặc thực hiện hành động.', [
      ['tool-la-gi', 'What tool calling actually is', 'Tool calling thực chất là gì', 'Model không tự chạy code — nó chỉ đề xuất gọi hàm với tham số · Bạn chạy hàm thật và gửi kết quả lại · Vòng lặp: hỏi → model đề xuất tool → chạy → gửi kết quả → model trả lời cuối'],
      ['dinh-nghia-tool', 'Defining tools with clear schemas', 'Định nghĩa tool với schema rõ ràng', 'Tên, mô tả, tham số đầu vào (JSON schema) · Mô tả tool tốt quyết định model có gọi đúng không · Giới hạn số tool cho một request'],
      ['thuc-thi-tool', 'Executing tools safely', 'Thực thi tool an toàn', 'Không chạy thẳng lệnh model đề xuất mà không kiểm tra · Validate tham số trước khi thực thi · Giới hạn quyền của mỗi tool (chỉ đọc, hay được ghi dữ liệu)'],
      ['vi-du-tool', 'A worked example: a weather/database lookup tool', 'Ví dụ thực hành: tool tra cứu thời tiết/cơ sở dữ liệu', 'Model hỏi → gọi API thời tiết thật hoặc query DB → trả kết quả cho model → model trả lời người dùng · Log lại từng bước để debug'],
    ]],
    ['Chapter 6 — Tokens, cost and rate limits', 'Chương 6 — Token, chi phí và rate limit', 'Đếm được tiền trước khi tính năng lên production.', [
      ['token-la-gi', 'What tokens are and how to count them', 'Token là gì và cách đếm', 'Token không phải là từ — một từ có thể là nhiều token · Đếm token trước khi gửi để tránh vượt giới hạn · Input token và output token tính giá khác nhau'],
      ['uoc-luong-chi-phi', 'Estimating and capping cost', 'Ước lượng và đặt trần chi phí', 'Giá theo triệu token, khác nhau theo model · Trần chi phí theo ngày/người dùng · Log usage thật, đừng chỉ tin số ước lượng'],
      ['rate-limit', 'Handling rate limits with retry and backoff', 'Xử lý rate limit bằng retry và backoff', 'Lỗi 429 và header Retry-After · Exponential backoff, không retry ngay lập tức · Hàng đợi phía client khi vượt giới hạn đồng thời'],
      ['chon-model-theo-viec', 'Routing requests to the right model by task', 'Phân việc theo đúng model', 'Việc chạy nền/máy đọc dùng model rẻ · Việc người dùng đọc từng chữ dùng model tốt hơn · Đo thật bằng usage trả về, đừng đoán theo bảng giá lẻ'],
    ]],
    ['Chapter 7 — Safety: prompt injection and guardrails', 'Chương 7 — An toàn: prompt injection và guardrail', 'Dữ liệu người dùng gửi vào không phải lúc nào cũng là câu hỏi thật.', [
      ['prompt-injection', 'What prompt injection is', 'Prompt injection là gì', 'Người dùng (hoặc nội dung web/tài liệu) chèn chỉ dẫn giả vào input · Model có thể bị "lừa" bỏ qua system prompt · Ví dụ tấn công thật đã ghi nhận'],
      ['phong-thu', 'Defenses: separation, least privilege, output checks', 'Phòng thủ: tách biệt, quyền tối thiểu, kiểm output', 'Tách rõ instruction của hệ thống với nội dung do người dùng cung cấp · Tool chỉ có quyền tối thiểu cần thiết · Không để model tự quyết hành động nhạy cảm mà không xác nhận'],
      ['loc-output', 'Filtering and validating model output', 'Lọc và kiểm output của model', 'Không hiển thị thẳng HTML/script model sinh ra chưa qua lọc · Validate lại structured output trước khi dùng · Giới hạn nội dung nhạy cảm ở tầng ứng dụng'],
      ['du-lieu-nguoi-dung', 'Handling user data and privacy', 'Xử lý dữ liệu người dùng và quyền riêng tư', 'Cân nhắc dữ liệu nào gửi lên nhà cung cấp LLM · Ẩn/thay thế thông tin nhạy cảm trước khi gửi khi cần · Thông báo rõ cho người dùng khi có AI xử lý dữ liệu của họ'],
    ]],
    ['Chapter 8 — Wiring into Node + React', 'Chương 8 — Gắn vào Node + React', 'Một chat UI streaming thật trong ứng dụng web.', [
      ['backend-node', 'A chat endpoint in Express with streaming', 'Endpoint chat trong Express có streaming', 'Route nhận tin nhắn, gọi LLM, forward SSE · Lưu lịch sử hội thoại vào PostgreSQL · Xác thực người dùng trước khi gọi model'],
      ['frontend-stream', 'A streaming chat UI in React', 'Giao diện chat streaming trong React', 'EventSource hoặc fetch + ReadableStream · Hiện chữ chạy dần và con trỏ đang gõ · Trạng thái đang gửi, lỗi, dừng giữa chừng'],
      ['luu-lich-su', 'Persisting and loading conversation history', 'Lưu và tải lại lịch sử hội thoại', 'Schema Conversation/Message · Tải lại đúng ngữ cảnh khi mở lại cuộc trò chuyện · Giới hạn ngữ cảnh gửi lên model khi lịch sử quá dài'],
      ['checkpoint-node', 'Checkpoint: a working AI chat feature', 'Checkpoint: tính năng chat AI chạy được', 'Gửi tin nhắn thấy chữ chạy dần thật · Đóng và mở lại thấy đúng lịch sử · Chặn được người dùng chưa đăng nhập'],
    ]],
    ['Chapter 9 — Wiring into Python/FastAPI', 'Chương 9 — Gắn vào Python/FastAPI', 'Cùng tính năng, phía Python — vì hai stack đều phổ biến cho backend AI.', [
      ['backend-fastapi', 'A chat endpoint in FastAPI with StreamingResponse', 'Endpoint chat trong FastAPI với StreamingResponse', 'async generator chuyển tiếp stream từ LLM · Trỏ lại khoá FastAPI Chương 7 để đào sâu phần streaming'],
      ['pydantic-cho-llm', 'Validating LLM output with Pydantic', 'Validate output của LLM bằng Pydantic', 'Parse structured output vào Pydantic model · Bắt lỗi khi model trả sai schema · Trả lỗi rõ ràng cho client thay vì sập'],
      ['async-goi-nhieu', 'Calling multiple tools/APIs concurrently', 'Gọi nhiều tool/API song song bằng asyncio', 'asyncio.gather cho các lời gọi độc lập · Timeout cho từng lời gọi con · Không để một tool chậm làm treo cả request'],
      ['checkpoint-python', 'Checkpoint: the same feature, the Python way', 'Checkpoint: cùng tính năng, theo cách của Python', 'So sánh code Node và Python cho cùng một tính năng · Chọn stack nào cho dự án tiếp theo dựa trên gì'],
    ]],
    ['Chapter 10 — Capstone: a complete AI feature', 'Chương 10 — Dự án cuối khoá: một tính năng AI hoàn chỉnh', 'Ráp streaming, tool calling, structured output và trần chi phí vào một tính năng thật.', [
      ['thiet-ke-tinh-nang', 'Designing an AI feature end to end', 'Thiết kế một tính năng AI từ đầu tới cuối', 'Chọn một bài toán thật (trợ lý tra cứu, tóm tắt, phân loại có tool) · Xác định model nào dùng cho việc gì · Vẽ luồng dữ liệu trước khi code'],
      ['xay-dung', 'Building it: streaming + tool calling together', 'Xây dựng: kết hợp streaming và tool calling', 'Model gọi tool giữa lúc đang stream · Hiển thị cho người dùng biết AI đang "làm gì" (đang tra cứu, đang tính toán) · Xử lý lỗi ở từng bước mà không làm vỡ cả luồng'],
      ['chan-chi-phi-an-toan', 'Adding cost caps and safety checks', 'Thêm trần chi phí và kiểm tra an toàn', 'Giới hạn token/chi phí theo người dùng · Kiểm tra input trước khi gửi lên model · Log đủ để audit sau này'],
      ['tong-ket', 'Wrap-up and where to go next', 'Tổng kết và bước tiếp theo', 'Checklist năng lực cả khoá · Khi nào cần RAG (khoá tiếp theo) thay vì chỉ prompt · Khi nào cần một agent thật sự (khoá AI Agents)'],
    ]],
  ]),
};
