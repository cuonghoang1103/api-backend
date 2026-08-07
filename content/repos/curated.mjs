/**
 * curated.mjs — kho repo tuyển chọn cho GitHub Repo Hub (/repos).
 * ─────────────────────────────────────────────────────────────────────────────
 * Mỗi phần tử là MỘT repo:
 *
 *   {
 *     slug:   'owner/repo',        // khớp key trong content/repos/meta.json
 *     tags:   ['AI', 'Agent'],     // 2-4 tag, seeder tự tạo tag chưa có
 *     review: '…markdown-lite…',   // "Bài học & đánh giá" — phần quan trọng nhất
 *   }
 *
 * VÌ SAO TÁCH LÀM HAI FILE
 * `meta.json` (số sao / ngôn ngữ / mô tả GitHub) do máy fetch về, còn file này
 * do người viết. Trộn chung thì mỗi lần làm mới số sao lại phải diff qua hàng
 * nghìn dòng chữ, và `git blame` mất nghĩa.
 *
 * CÚ PHÁP REVIEW — markdown-lite, đúng những gì `frontend/src/lib/markdown.ts`
 * dựng được: `##`/`###` (heading), `- ` (gạch đầu dòng), **đậm**, *nghiêng*,
 * `mã inline`, [chữ](https://link). KHÔNG có khối ``` ba nháy, KHÔNG có bảng —
 * viết vào cũng chỉ hiện ra chữ thô.
 *
 * ĐOẠN MỞ PHẢI TỰ ĐỨNG ĐƯỢC. Thẻ ở trang /repos cắt review còn 3 dòng và
 * render KHÔNG bật heading, nên `## Tiêu đề` đứng đầu sẽ lòi ra nguyên hai dấu
 * thăng trên thẻ. Luôn mở bằng 2-3 câu văn xuôi, heading để sau.
 */

export default [
  // ═══════════════════════════════════════════════════════════════════════════
  // AI · LLM · AGENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'anthropics/claude-code',
    tags: ['AI', 'Agent', 'CLI'],
    review: `Đây là repo chính thức của công cụ đang gõ ra phần lớn code trong dự án này. Giá trị lớn nhất không nằm ở source (phần lõi đóng), mà ở **tài liệu + issue tracker**: mỗi tính năng mới (hooks, subagent, MCP, skills) đều có ví dụ cấu hình thật, và mục Issues là nơi biết trước một hành vi lạ là bug hay là do mình dùng sai.

### Dùng vào việc gì
- Tra cú pháp **hooks** và **settings.json** khi muốn tự động hoá một bước lặp đi lặp lại
- Xem mẫu **CLAUDE.md** của người khác để viết luật cho repo của mình
- Theo dõi changelog trước khi nâng phiên bản

### Bắt đầu từ đâu
Đọc thư mục tài liệu về hooks trước, rồi tới phần cấu hình MCP. Hai thứ đó đổi cách làm việc nhiều nhất — phần còn lại chỉ là tuỳ chọn dòng lệnh.`,
  },
  {
    slug: 'anthropics/anthropic-sdk-typescript',
    tags: ['AI', 'TypeScript', 'Backend'],
    review: `SDK gọi Claude từ Node/TypeScript — chính thứ backend của bạn đang dùng cho AI Chat, Interview Simulator và các job sinh nội dung. Đọc source SDK đáng giá hơn đọc docs: kiểu dữ liệu của **tool use**, **streaming** và **prompt caching** đều nằm trong file khai báo type, chính xác hơn mọi bài blog.

### Dùng vào việc gì
- Tra chính xác shape của message khi làm tool-calling (dễ sai nhất là phần \`tool_result\`)
- Xem cách SDK tự động thử lại (retry) và bắt lỗi 429 — để không tự viết lại lớp đó
- Mẫu streaming: đọc từng chunk mà không nghẽn event loop

### Lưu ý
Mỗi lần đổi model, kiểm lại tên model trong hằng số của SDK thay vì gõ tay chuỗi — gõ sai tên model chỉ lộ ra lúc chạy thật, không phải lúc biên dịch.`,
  },
  {
    slug: 'anthropics/claude-cookbooks',
    tags: ['AI', 'Learning', 'Python'],
    review: `Tuyển tập notebook "công thức" cho từng bài toán cụ thể với Claude: RAG, trích xuất dữ liệu có cấu trúc, phân loại, tóm tắt, chấm điểm bằng LLM, dùng công cụ. Mỗi notebook là một bài toán chạy được từ đầu tới cuối, không phải đoạn code lẻ.

### Dùng vào việc gì
- Học cách viết **prompt chấm điểm** (LLM-as-judge) — đúng thứ Interview Simulator và phần chấm bài IELTS cần
- Mẫu trích xuất JSON có kiểm chứng schema, ổn định hơn cách tự bảo model "trả JSON"
- Kỹ thuật chia nhỏ tài liệu dài trước khi nhúng vector

### Bắt đầu từ đâu
Notebook về **structured output** và **evaluation**. Hai cái đó dùng lại được ngay cho các job sinh nội dung tự động của bạn.`,
  },
  {
    slug: 'anthropics/courses',
    tags: ['AI', 'Learning'],
    review: `Giáo trình chính thức, đi từ kỹ thuật viết prompt cơ bản tới đánh giá chất lượng đầu ra và dùng công cụ. Điểm mạnh là **có bài tập chấm được** chứ không chỉ lý thuyết — học kiểu này khớp với cách bạn học các môn khác trên trang.

### Dùng vào việc gì
- Hệ thống hoá lại kiến thức prompt, thay vì góp nhặt mẹo rời rạc
- Chương về đánh giá (eval) trả lời câu hỏi khó nhất: làm sao biết prompt mới TỐT HƠN prompt cũ, chứ không phải "cảm giác hay hơn"
- Lấy ý tưởng cấu trúc bài học cho các khoá trên trang của bạn

### Lưu ý
Bài tập viết bằng Python/notebook, nhưng ý tưởng chuyển sang TypeScript nguyên vẹn.`,
  },
  {
    slug: 'modelcontextprotocol/servers',
    tags: ['AI', 'MCP', 'TypeScript'],
    review: `Bộ server MCP tham chiếu — chuẩn giao thức cho phép trợ lý AI đọc file, gọi API, truy vấn cơ sở dữ liệu một cách có kiểm soát. Đây là kho mẫu tốt nhất để hiểu **một tool nên khai báo thế nào** thì model mới gọi đúng.

### Dùng vào việc gì
- Nhân bản một server mẫu thành MCP server riêng cho dự án (ví dụ: tra cứu bài học, thống kê người dùng)
- Học cách mô tả tham số tool sao cho model không đoán mò
- Xem cách phân quyền: cái gì cho đọc, cái gì cấm ghi

### Bắt đầu từ đâu
Server **filesystem** và **fetch** là hai cái ngắn nhất, đọc hết trong một buổi tối và đủ để viết cái của mình.`,
  },
  {
    slug: 'punkpeye/awesome-mcp-servers',
    tags: ['AI', 'MCP', 'Awesome'],
    review: `Danh mục cộng đồng gom hàng nghìn MCP server đã có sẵn: Postgres, GitHub, Slack, Docker, trình duyệt, Figma… Trước khi ngồi viết một server mới, tra ở đây trước — phần lớn nhu cầu phổ thông đã có người làm rồi.

### Dùng vào việc gì
- Tìm server sẵn có để cắm vào Claude Code thay vì tự code
- Khảo sát cách người khác đặt tên tool và mô tả tham số
- Nhận ra khoảng trống: cái gì CHƯA ai làm thì đó là cơ hội cho dự án riêng

### Lưu ý
Chất lượng không đồng đều — luôn đọc source trước khi cho một server lạ chạm vào dữ liệu thật. Ưu tiên server đọc-chỉ (read-only) khi mới thử.`,
  },
  {
    slug: 'vercel/ai',
    tags: ['AI', 'NextJS', 'TypeScript'],
    review: `AI SDK của Vercel: một lớp bọc thống nhất cho nhiều nhà cung cấp model, kèm hook React để làm giao diện chat streaming. Nếu định làm màn hình chat trong Next.js thì đây là con đường ngắn nhất từ ý tưởng tới bản chạy được.

### Dùng vào việc gì
- Streaming token về client mà không tự viết lớp xử lý SSE
- Đổi nhà cung cấp model chỉ bằng một dòng cấu hình, tiện khi so sánh chất lượng
- Gọi tool và render kết quả tool ngay trong luồng chat

### Lưu ý
Lớp trừu tượng nào cũng có giá: khi cần một tính năng riêng của Claude (prompt caching, cấu hình suy luận), vẫn phải rơi xuống SDK gốc. Dùng SDK này cho phần giao diện, giữ SDK gốc cho phần lõi.`,
  },
  {
    slug: 'langchain-ai/langchainjs',
    tags: ['AI', 'Agent', 'TypeScript'],
    review: `Bộ khung xây agent và pipeline RAG bằng TypeScript. Repo này đáng đọc kể cả khi bạn quyết định KHÔNG dùng nó: các khái niệm nó đặt tên (retriever, chain, memory, tool) đã thành từ vựng chung của cả ngành.

### Dùng vào việc gì
- Mẫu RAG hoàn chỉnh: cắt tài liệu → nhúng vector → truy hồi → nhồi vào prompt
- Cách quản lý bộ nhớ hội thoại dài mà không tràn cửa sổ ngữ cảnh
- Đối chiếu với cách bạn tự viết, xem mình đang thiếu bước nào

### Lưu ý
Nặng và trừu tượng nhiều tầng. Với một tính năng đơn lẻ, gọi thẳng SDK thường ngắn hơn và dễ gỡ lỗi hơn. Chỉ kéo cả bộ khung vào khi đã có từ ba luồng AI trở lên cần dùng chung hạ tầng.`,
  },
  {
    slug: 'ollama/ollama',
    tags: ['AI', 'Self-hosted', 'Go'],
    review: `Chạy mô hình ngôn ngữ ngay trên máy mình bằng một lệnh. Điểm cộng lớn cho người tự vận hành VPS: API tương thích kiểu OpenAI, nên đổi từ dịch vụ đám mây sang model cục bộ gần như chỉ là đổi URL.

### Dùng vào việc gì
- Thử nghiệm prompt thoải mái mà không tốn tiền theo token
- Tác vụ nhẹ (phân loại, chuẩn hoá văn bản, gợi ý thẻ) đẩy hết sang model cục bộ để tiết kiệm
- Giữ dữ liệu nhạy cảm không ra khỏi máy

### Lưu ý
VPS 6GB RAM của bạn không đủ chỗ cho model lớn chạy song song với Postgres và hai container Node. Model cục bộ nên chạy ở máy phát triển, đừng cắm vào VPS sản xuất trước khi đo lại bộ nhớ.`,
  },
  {
    slug: 'open-webui/open-webui',
    tags: ['AI', 'Self-hosted', 'Python'],
    review: `Giao diện chat web tự host, cắm được vào Ollama lẫn API kiểu OpenAI. Có quản lý người dùng, lịch sử hội thoại, tải tài liệu lên hỏi đáp, thư viện prompt — tức là gần đủ những thứ một sản phẩm chat thật cần.

### Dùng vào việc gì
- Dựng nhanh môi trường thử model mà không code giao diện
- Tham khảo thiết kế: cách họ tổ chức hội thoại, phân nhánh, đính kèm tệp
- So với module AI Chat của bạn để soi ra tính năng còn thiếu

### Bắt đầu từ đâu
Chạy bằng Docker một container là xong. Xem phần quản lý hội thoại và tài liệu trước — đó là chỗ chứa nhiều quyết định thiết kế nhất.`,
  },
  {
    slug: 'n8n-io/n8n',
    tags: ['AI', 'Automation', 'Self-hosted'],
    review: `Nền tảng tự động hoá quy trình bằng cách nối các node, tự host được và nay có sẵn node AI. Hợp với những việc lặp lại quanh dự án: theo dõi lỗi deploy, tổng hợp tin công nghệ, đồng bộ dữ liệu giữa hai dịch vụ.

### Dùng vào việc gì
- Thay các script cron rời rạc bằng luồng nhìn thấy được, có nhật ký chạy và tự thử lại
- Ghép webhook → xử lý → gửi thông báo mà không dựng thêm dịch vụ
- Bản thân source là một ví dụ lớn về kiến trúc plugin trong TypeScript

### Lưu ý
Ăn RAM đáng kể. Trên VPS nhỏ, cân nhắc chỉ bật khi cần hoặc chạy ở máy khác thay vì để thường trực cạnh backend.`,
  },
  {
    slug: 'pgvector/pgvector',
    tags: ['AI', 'Database'],
    review: `Tiện ích mở rộng thêm kiểu vector cho PostgreSQL. Với người đã có sẵn Postgres như bạn, đây gần như luôn là lựa chọn đúng thay vì dựng thêm một cơ sở dữ liệu vector riêng: cùng một kết nối, cùng một bản sao lưu, cùng một giao dịch.

### Dùng vào việc gì
- Tìm kiếm ngữ nghĩa cho bài học, câu hỏi phỏng vấn, ghi chú — hỏi bằng ý chứ không bằng từ khoá
- Gợi ý nội dung liên quan dựa trên độ tương đồng
- Lọc kết hợp: vừa lọc theo cột thường (môn, cấp độ) vừa xếp hạng theo vector, thứ mà cơ sở dữ liệu vector thuần làm rất vụng

### Lưu ý
Nhớ tạo chỉ mục (HNSW hoặc IVFFlat) — không có chỉ mục thì truy vấn quét toàn bảng, nhanh lúc vài nghìn dòng và sụp lúc vài trăm nghìn.`,
  },
  {
    slug: 'microsoft/generative-ai-for-beginners',
    tags: ['AI', 'Learning'],
    review: `Khoá 21 bài của Microsoft, đi từ khái niệm nền tảng tới RAG, tinh chỉnh, ứng dụng thực tế và phần an toàn. Mỗi bài có video ngắn, bài viết và bài tập — dạng giáo trình đúng nghĩa chứ không phải tuyển tập bài blog.

### Dùng vào việc gì
- Lấp lỗ hổng nền tảng: nhúng vector, cửa sổ ngữ cảnh, nhiệt độ, ảo giác thực sự là gì
- Bài về **thiết kế ứng dụng AI** giúp quyết định đâu là chỗ AI đáng dùng, đâu là chỗ chỉ tốn tiền
- Nguồn tham khảo khi bạn tự soạn khoá học AI trên trang

### Lưu ý
Ví dụ nghiêng về hệ sinh thái Azure/OpenAI, nhưng phần khái niệm áp dụng chung cho mọi model.`,
  },
  {
    slug: 'f/prompts.chat',
    tags: ['AI', 'Awesome'],
    review: `Kho prompt cộng đồng khổng lồ, sắp xếp theo vai trò. Đọc nó không phải để chép nguyên, mà để thấy **quy luật**: prompt tốt luôn nêu rõ vai trò, bối cảnh, ràng buộc và định dạng đầu ra — bốn thứ mà prompt tự viết vội hay thiếu.

### Dùng vào việc gì
- Lấy khung nhanh cho một tác vụ mới rồi sửa lại theo ngữ cảnh của mình
- Đối chiếu với prompt hệ thống trong module AI của bạn xem còn quên ràng buộc nào
- Nguồn ý tưởng cho thư viện prompt mẫu trên trang

### Lưu ý
Nhiều prompt viết cho thời model còn yếu, nay dài dòng không cần thiết. Model mới hiểu ý ngắn gọn tốt hơn — cắt bớt phần nài nỉ và doạ dẫm đi.`,
  },
  {
    slug: 'huggingface/transformers',
    tags: ['AI', 'Python', 'Open Source'],
    review: `Thư viện nền của gần như mọi mô hình mã nguồn mở. Kể cả khi bạn chỉ gọi API, repo này vẫn đáng có trong kho: đây là nơi tra cứu một kiến trúc model thực sự làm gì, và là chỗ chạy các model nhỏ chuyên biệt.

### Dùng vào việc gì
- Chạy model nhỏ cho việc hẹp: nhận dạng thực thể, phân loại cảm xúc, nhúng vector — rẻ hơn gọi model lớn nhiều lần
- Tra tokenizer khi cần đếm token chính xác
- Hiểu thuật ngữ trong các bài báo và ghi chú phát hành model

### Lưu ý
Repo rất lớn, đừng cố đọc hết. Vào thẳng trang model cụ thể trên Hub rồi lần ngược về code khi cần.`,
  },
  {
    slug: 'mem0ai/mem0',
    tags: ['AI', 'Agent', 'Python'],
    review: `Lớp bộ nhớ cho agent: lưu lại điều đã biết về người dùng qua nhiều phiên, rồi truy hồi đúng mẩu cần thiết thay vì nhồi cả lịch sử vào ngữ cảnh. Đây là bài toán ai làm chatbot lâu dài cũng đụng phải.

### Dùng vào việc gì
- Nhớ trình độ, mục tiêu, lỗi hay mắc của học viên giữa các buổi học
- Giảm chi phí token: gửi 5 mẩu ký ức liên quan thay vì 50 lượt hội thoại cũ
- Tham khảo tiêu chí quyết định "cái gì đáng nhớ, cái gì bỏ" — phần khó nhất của bài toán

### Lưu ý
Có thể dùng chính Postgres + pgvector làm kho lưu, khỏi thêm dịch vụ mới vào hạ tầng.`,
  },
  {
    slug: 'browser-use/browser-use',
    tags: ['AI', 'Agent', 'Automation'],
    review: `Cho agent AI điều khiển trình duyệt thật: đọc trang, điền form, bấm nút. Hữu ích cho kiểm thử đầu-cuối bằng mô tả tiếng người và cho việc thu thập dữ liệu ở những trang không có API.

### Dùng vào việc gì
- Viết kịch bản kiểm thử kiểu "đăng nhập, vào /exam, làm 3 câu, kiểm tra điểm" mà không cần selector cứng
- Tự động lấy dữ liệu từ trang không có API
- Học cách mô tả trạng thái trang cho model hiểu — vấn đề cốt lõi của mọi agent thao tác giao diện

### Lưu ý
Chậm và không tất định, đừng đặt vào đường CI chặn merge. Hợp với kiểm thử khám phá chạy nền hơn là cổng kiểm tra bắt buộc.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WEB FULLSTACK — đúng ngăn xếp bạn đang dùng hằng ngày
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'shadcn-ui/ui',
    tags: ['Frontend', 'React', 'Design System'],
    review: `Không phải thư viện component mà là bộ mã nguồn để **chép vào dự án**. Bạn sở hữu file, sửa thoải mái, không bị khoá vào API của người khác — cách tiếp cận này đã đổi luôn thói quen làm giao diện React mấy năm nay.

### Dùng vào việc gì
- Lấy component có sẵn khả năng truy cập (dialog, dropdown, select, sheet) thay vì tự vật lộn với bẫy tiêu điểm bàn phím
- Học cách gom biến thể bằng lớp tiện ích thay vì đẻ ra hàng chục prop
- Bảng token màu của họ là mẫu tốt cho hệ chủ đề sáng/tối

### Lưu ý
Đã chép về là bạn tự bảo trì. Đó là đánh đổi có chủ đích: đừng chép cả bộ, chỉ chép cái đang cần.`,
  },
  {
    slug: 'TanStack/query',
    tags: ['Frontend', 'React', 'TypeScript'],
    review: `Quản lý dữ liệu lấy từ server: bộ nhớ đệm, làm mới nền, chống trùng request, thử lại. Nhiều đoạn \`useEffect\` + \`useState\` để gọi API có thể xoá sạch sau khi dùng thư viện này, kèm theo cả một lớp bug về điều kiện tranh chấp.

### Dùng vào việc gì
- Trang danh sách có phân trang, lọc, tìm kiếm — đúng dạng /repos, /feed, /exam của bạn
- Cập nhật lạc quan (optimistic) cho nút thích, bình luận: giao diện phản hồi tức thì, hỏng thì tự lùi
- Vô hiệu hoá đệm sau khi ghi, để danh sách tự tươi lại mà không phải tải lại trang

### Bắt đầu từ đâu
Đổi một trang danh sách sang trước, đo lại số dòng code giảm được rồi mới nhân rộng.`,
  },
  {
    slug: 'TanStack/table',
    tags: ['Frontend', 'React', 'TypeScript'],
    review: `Lõi bảng dữ liệu không kèm giao diện: sắp xếp, lọc, nhóm, phân trang, ghim cột, ảo hoá — còn phần hiển thị bạn tự viết. Hợp với trang quản trị cần bảng thật sự làm việc chứ không chỉ liệt kê.

### Dùng vào việc gì
- Bảng quản trị người dùng, đơn hàng, bài học ở /admin
- Bảng có hàng nghìn dòng: bật ảo hoá thay vì cắt bớt dữ liệu
- Xuất dữ liệu đúng như đang lọc trên màn hình

### Lưu ý
Đường học dốc hơn một component bảng đóng gói sẵn, nhưng đổi lại là toàn quyền về giao diện — quan trọng khi bảng phải khớp hệ chủ đề riêng.`,
  },
  {
    slug: 'colinhacks/zod',
    tags: ['TypeScript', 'Backend'],
    review: `Khai báo schema một lần, vừa kiểm tra dữ liệu lúc chạy vừa suy ra kiểu TypeScript. Đây là mảnh ghép còn thiếu giữa "kiểu chỉ tồn tại lúc biên dịch" và "dữ liệu thật từ client thì muốn gửi gì cũng được".

### Dùng vào việc gì
- Kiểm tra body và query của mọi route Express trước khi chạm vào Prisma
- Kiểm tra biến môi trường lúc khởi động: thiếu biến thì chết ngay, thay vì lỗi mơ hồ lúc 2 giờ sáng
- Ép đầu ra JSON của model AI về đúng schema, sai thì bắt sinh lại

### Bắt đầu từ đâu
Bọc các route nhận dữ liệu người dùng trước — đó là nơi một trường thiếu gây ra 500 khó truy nhất.`,
  },
  {
    slug: 'pmndrs/zustand',
    tags: ['Frontend', 'React', 'TypeScript'],
    review: `Quản lý trạng thái toàn cục gọn nhẹ: một hàm tạo store, không cần provider bọc, không cần reducer. Cho phần lớn ứng dụng, đây là mức vừa đủ giữa việc truyền prop chằng chịt và việc kéo cả một khung nặng vào.

### Dùng vào việc gì
- Trạng thái dùng chung nhiều nơi: người dùng hiện tại, chủ đề, giỏ hàng, trạng thái trình phát nhạc
- Trạng thái game/sân chơi 3D cần đọc ghi ngoài vòng render React
- Thay các context lồng nhau đang khiến cả cây component render lại

### Lưu ý
Đừng nhét dữ liệu server vào store toàn cục — phần đó để cho thư viện truy vấn lo. Store toàn cục chỉ nên giữ trạng thái giao diện.`,
  },
  {
    slug: 'react-hook-form/react-hook-form',
    tags: ['Frontend', 'React'],
    review: `Form theo hướng không kiểm soát: mỗi lần gõ phím không làm cả form render lại. Với form dài (hồ sơ CV, cấu hình khoá học, biểu mẫu quản trị) khác biệt về độ mượt là nhìn thấy được.

### Dùng vào việc gì
- Form nhiều trường, nhiều bước, có mảng động (thêm/xoá dòng kinh nghiệm trong CV)
- Ghép với schema kiểm tra dữ liệu để dùng chung một định nghĩa cho cả client lẫn server
- Hiện lỗi từng trường đúng lúc rời ô nhập, không phải chờ bấm gửi

### Lưu ý
Component nhập liệu tuỳ biến phải nối qua bộ điều khiển của thư viện, nếu không giá trị sẽ không được ghi nhận — đây là chỗ hay mất thời gian nhất khi mới dùng.`,
  },
  {
    slug: 'motiondivision/motion',
    tags: ['Frontend', 'React'],
    review: `Chính là Framer Motion, nay tách ra tên mới và có cả bản không phụ thuộc React. Thư viện hoạt ảnh khai báo: mô tả trạng thái đầu và cuối, phần còn lại nó lo, kể cả khi component bị gỡ khỏi cây.

### Dùng vào việc gì
- Hiệu ứng vào/ra cho hộp thoại, danh sách, chuyển trang
- Kéo thả, cuộn tới đâu hiện tới đó
- Bố cục tự chuyển động khi phần tử đổi vị trí — thứ rất khó làm mượt bằng CSS thuần

### Lưu ý
Nhớ cái bẫy đã gặp: phần tử nằm trong khối bị ẩn có thể kẹt ở trạng thái trong suốt, chụp ảnh ra trang trắng. Ưu tiên hoạt ảnh chỉ chạm vào \`transform\` và \`opacity\` để giữ 60 khung hình.`,
  },
  {
    slug: 'socketio/socket.io',
    tags: ['Backend', 'Node.js'],
    review: `Thư viện thời gian thực bạn đang dùng cho Messenger, thông báo và bảng điều khiển thiết bị. Giá trị nằm ở những thứ WebSocket thuần không có sẵn: tự kết nối lại, phòng (room), không gian tên, phương án dự phòng khi mạng chặn WebSocket.

### Dùng vào việc gì
- Tra cách dùng **room** cho đúng: một room mỗi cuộc trò chuyện thay vì phát tán rồi lọc ở client
- Xử lý xác thực lúc bắt tay, đừng để socket ẩn danh vào được phòng riêng tư
- Chạy nhiều tiến trình thì cần lớp điều phối (adapter) — nếu không, tin nhắn chỉ tới được người cùng tiến trình

### Lưu ý
Mỗi lần thêm sự kiện mới, kiểm tra luôn phía ngắt kết nối. Rò rỉ bộ nhớ ở đây gần như luôn là do quên gỡ trình lắng nghe.`,
  },
  {
    slug: 'expressjs/express',
    tags: ['Backend', 'Node.js'],
    review: `Khung web đang chạy toàn bộ API của bạn. Source nhỏ đến mức đọc hết được trong một buổi — và nên đọc, vì hiểu chuỗi middleware là hiểu vì sao thứ tự \`app.use\` quyết định mọi thứ.

### Dùng vào việc gì
- Đọc phần router để biết đường đi của một request qua các lớp middleware
- Hiểu cách xử lý lỗi bất đồng bộ: bốn tham số mới là middleware lỗi, quên thì lỗi rơi vào hư vô
- Tham chiếu khi nâng phiên bản lớn, chỗ hay vỡ là middleware của bên thứ ba

### Lưu ý
Kiểu dữ liệu cho Express trong TypeScript hay phải mở rộng thêm (ví dụ gắn \`req.userId\`). Gom phần khai báo mở rộng vào một file duy nhất, đừng rải khắp nơi.`,
  },
  {
    slug: 'fastify/fastify',
    tags: ['Backend', 'Node.js', 'TypeScript'],
    review: `Khung web Node nhanh hơn Express đáng kể, kèm hai thứ Express không có sẵn: kiểm tra dữ liệu theo schema JSON và tuần tự hoá phản hồi nhanh. Đáng biết kể cả khi bạn chưa định chuyển.

### Dùng vào việc gì
- Dịch vụ nhỏ cần thông lượng cao: proxy, webhook, endpoint đo lường
- Mẫu schema-first: khai báo schema là có luôn kiểm tra dữ liệu, tài liệu OpenAPI và tuần tự hoá nhanh
- Hệ plugin có kiểm soát phạm vi, sạch hơn middleware toàn cục

### Lưu ý
Đừng chuyển cả API đang chạy tốt chỉ vì con số benchmark. Nút cổ chai của bạn gần như chắc chắn nằm ở truy vấn cơ sở dữ liệu, không phải ở khung web.`,
  },
  {
    slug: 'nestjs/nest',
    tags: ['Backend', 'TypeScript', 'NestJS'],
    review: `Khung backend có kiến trúc rõ ràng: module, tiêm phụ thuộc, decorator. Khi một API Express lớn dần và tầng service bắt đầu rối, đây là mô hình đáng tham khảo — kể cả khi không đổi khung, bạn vẫn học được cách chia lớp.

### Dùng vào việc gì
- Học cách tách controller / service / repository cho ra tấm ra món
- Guard và interceptor: chỗ đặt phân quyền và ghi nhật ký chuẩn mực
- Kiểm thử dễ hơn hẳn nhờ tiêm phụ thuộc — thay giả lập chỉ là đổi provider

### Lưu ý
Nhiều nghi thức và decorator hơn hẳn Express. Với dự án một người, cái giá đó chỉ đáng khi số module đã nhiều tới mức tự mình lạc đường.`,
  },
  {
    slug: 'drizzle-team/drizzle-orm',
    tags: ['Database', 'TypeScript', 'Backend'],
    review: `ORM TypeScript viết truy vấn gần với SQL, không sinh client riêng, chạy được ở môi trường biên. Đáng đọc để đối chiếu với Prisma: hai triết lý ngược nhau về cùng một bài toán.

### Dùng vào việc gì
- So sánh cách sinh kiểu dữ liệu: Prisma sinh client từ schema, Drizzle suy kiểu thẳng từ khai báo bảng
- Truy vấn phức tạp mà ORM hay bó tay — cú pháp ở đây sát SQL nên dịch qua lại dễ
- Dự án nhỏ cần khởi động nhanh, không muốn bước sinh mã

### Lưu ý
Không có lý do gì để đổi cả dự án đang chạy Prisma. Đọc để hiểu đánh đổi, không phải để chuyển nhà.`,
  },
  {
    slug: 'lucide-icons/lucide',
    tags: ['Frontend', 'Design System'],
    review: `Bộ biểu tượng mã nguồn mở đang dùng trong toàn bộ giao diện của bạn. Nét đồng đều, có gói riêng cho React nên chỉ đóng gói đúng icon được dùng.

### Dùng vào việc gì
- Tra tên icon bằng trang tìm kiếm thay vì đoán mò trong trình gợi ý của IDE
- Giữ nhất quán: một bộ icon cho cả trang, đừng trộn nhiều bộ khác phong cách
- Icon là SVG nên chỉnh màu bằng \`currentColor\`, tự khớp chủ đề sáng/tối

### Lưu ý
Nhập cả gói icon vào một file dùng chung sẽ kéo theo hàng trăm icon vào bundle. Nhập trực tiếp từng cái tại nơi dùng.`,
  },
  {
    slug: 'tailwindlabs/headlessui',
    tags: ['Frontend', 'React', 'Tailwind'],
    review: `Component không kiểu dáng nhưng đầy đủ hành vi truy cập: menu, hộp thoại, tab, combobox, chuyển đổi. Bạn tự tô màu, họ lo phần bẫy tiêu điểm, phím tắt và thuộc tính ARIA — phần khó và dễ làm sai nhất.

### Dùng vào việc gì
- Menu thả xuống và hộp thoại đúng chuẩn bàn phím, không cần tự nghe sự kiện Escape
- Combobox có tìm kiếm cho các ô chọn dài (chọn môn học, chọn thẻ)
- Nền tảng cho hệ component riêng, khớp sẵn với Tailwind

### Lưu ý
Nhớ bẫy đã gặp: menu đặt trong khối \`overflow-hidden\` sẽ bị cắt cụt — đưa nó ra ngoài bằng portal và định vị cố định.`,
  },
  {
    slug: 'date-fns/date-fns',
    tags: ['JavaScript', 'Utility'],
    review: `Thư viện xử lý ngày giờ theo kiểu hàm rời rạc: nhập đúng hàm cần, phần còn lại không vào bundle. Nhẹ hơn nhiều so với các thư viện gộp một cục, và hàm nào cũng thuần khiết nên dễ đoán.

### Dùng vào việc gì
- Định dạng ngày kiểu Việt Nam, tính "cách đây 3 phút" cho bảng tin và tin nhắn
- Cộng trừ ngày cho lịch học, hạn nộp, chuỗi ngày luyện tập liên tiếp
- Xử lý múi giờ — nhất là khi container chạy giờ UTC còn bạn ngồi ở +07

### Lưu ý
Đã có \`Intl.DateTimeFormat\` sẵn trong trình duyệt cho phần định dạng. Chỉ kéo thư viện vào khi cần tính toán, đừng dùng chỉ để hiện một ngày.`,
  },
  {
    slug: 'axios/axios',
    tags: ['JavaScript', 'Utility'],
    review: `Máy khách HTTP với thứ mà \`fetch\` không có: bộ chặn (interceptor). Đây chính là chỗ đặt logic tự làm mới token khi gặp 401 rồi thử lại — cơ chế đã cứu các phiên đăng nhập hết hạn trên trang của bạn.

### Dùng vào việc gì
- Một chỗ duy nhất gắn token và xử lý lỗi cho mọi lời gọi API
- Tự làm mới phiên khi hết hạn, người dùng không bị văng ra
- Huỷ request khi component bị gỡ, tránh cập nhật trạng thái đã chết

### Lưu ý
Bộ chặn làm mới token phải tự chặn chính nó, nếu không một phiên hỏng sẽ tạo vòng lặp vô hạn. Đánh dấu request đã thử lại một lần và chỉ một lần.`,
  },
  {
    slug: 'vitejs/vite',
    tags: ['Frontend', 'Tooling'],
    review: `Công cụ dựng frontend chạy trên chuẩn module của trình duyệt: khởi động gần như tức thì, thay đổi hiện ra ngay. Kể cả khi dự án chính chạy Next.js, đây vẫn là cách nhanh nhất để dựng một mẫu thử hay một widget nhỏ.

### Dùng vào việc gì
- Dựng nhanh mẫu thử: một cảnh 3D, một biểu đồ, một component cần thử riêng
- Chạy kiểm thử component nhanh hơn hẳn cấu hình đóng gói cũ
- Hiểu vì sao Next.js đang dần chuyển sang công cụ dựng kiểu này

### Lưu ý
Bản dựng phát triển và bản dựng phát hành đi hai đường khác nhau. Lỗi chỉ xuất hiện ở bản phát hành thường là do phụ thuộc chỉ chạy được ở CommonJS.`,
  },
  {
    slug: 'trpc/trpc',
    tags: ['TypeScript', 'API', 'Backend'],
    review: `Gọi API mà kiểu dữ liệu xuyên suốt từ server sang client, không cần sinh mã, không cần schema trung gian. Đổi tên một trường ở server là client đỏ ngay lúc biên dịch — thứ mà REST viết tay không bao giờ cho bạn.

### Dùng vào việc gì
- Dự án một mình quản cả hai đầu, đúng tình huống của bạn
- Xoá lớp khai báo kiểu chép tay trong \`lib/api.ts\` — nguồn sai lệch âm thầm mỗi khi backend đổi
- Học cách gom middleware và ngữ cảnh theo kiểu an toàn kiểu dữ liệu

### Lưu ý
Chỉ hợp khi client và server ở cùng một kho mã. Có ứng dụng di động hoặc bên thứ ba gọi vào thì vẫn cần REST thật.`,
  },
  {
    slug: 'ueberdosis/tiptap',
    tags: ['Frontend', 'React'],
    review: `Bộ khung soạn thảo văn bản đứng sau trang /notes của bạn, dựng trên ProseMirror. Mô hình mở rộng của nó là lý do trang ghi chú thêm được menu gạch chéo, nhúng ảnh, danh sách việc cần làm mà không phải viết lại lõi.

### Dùng vào việc gì
- Viết extension riêng: khối mã, bảng, nhắc tên, nhúng nội dung
- Hợp tác thời gian thực nhiều người trên cùng một tài liệu
- Kiểm soát chính xác cấu trúc tài liệu, thay vì phó mặc cho \`contenteditable\`

### Lưu ý
Bẫy đã trả giá: trình xem chỉ đọc phải có \`key\` theo id ghi chú, nếu không đổi ghi chú mà nội dung vẫn là cái cũ — vì nội dung chỉ nạp một lần lúc gắn vào cây.`,
  },
  {
    slug: 'hoppscotch/hoppscotch',
    tags: ['API', 'Tooling', 'Self-hosted'],
    review: `Bộ công cụ thử API chạy ngay trên trình duyệt, tự host được, nhẹ hơn Postman rất nhiều. Hỗ trợ REST, GraphQL, WebSocket và Socket.IO — nghĩa là thử được cả phần thời gian thực của bạn.

### Dùng vào việc gì
- Thử nhanh một route mới mà không phải mở ứng dụng nặng
- Lưu bộ sưu tập request theo môi trường (local / sản phẩm) để kiểm tra sau mỗi lần triển khai
- Tự host trên VPS để dùng chung, không đẩy dữ liệu ra dịch vụ ngoài

### Lưu ý
Cẩn thận với token dán vào biến môi trường khi bản tự host mở công khai. Đặt sau lớp đăng nhập.`,
  },
  {
    slug: 'typicode/json-server',
    tags: ['API', 'Testing', 'Node.js'],
    review: `Biến một file JSON thành REST API đầy đủ trong chưa tới một phút. Cực hợp lúc làm giao diện trước khi backend kịp có endpoint, hoặc lúc cần dữ liệu giả ổn định cho kiểm thử.

### Dùng vào việc gì
- Dựng API giả để làm frontend song song, không phải chờ nhau
- Dữ liệu cố định cho kiểm thử giao diện: cùng đầu vào, cùng kết quả, không phụ thuộc mạng
- Dạy học: minh hoạ REST mà không cần dựng cơ sở dữ liệu

### Lưu ý
Chỉ dành cho phát triển. Không xác thực, không kiểm tra dữ liệu, không tối ưu — đừng để rò rỉ vào bất cứ thứ gì chạy thật.`,
  },
  {
    slug: 'remix-run/react-router',
    tags: ['Frontend', 'React'],
    review: `Thư viện định tuyến của React, nay đã gộp với Remix và mang theo khái niệm loader/action. Dù dự án chính dùng bộ định tuyến của Next.js, đọc repo này vẫn có ích: nó nêu rõ ràng những vấn đề mà mọi bộ định tuyến đều phải giải.

### Dùng vào việc gì
- Hiểu tuyến lồng nhau và ranh giới lỗi — khái niệm dùng chung với Next.js
- Mô hình lấy dữ liệu theo tuyến: nạp dữ liệu song song với chuyển trang, không phải chờ render xong mới gọi
- Định tuyến cho ứng dụng một trang thuần (không dùng Next)

### Lưu ý
Tài liệu trải qua vài lần đổi phiên bản lớn. Kiểm đúng phiên bản trước khi chép ví dụ, API v6 và v7 khác nhau đáng kể.`,
  },
  {
    slug: 'sindresorhus/awesome',
    tags: ['Awesome', 'Learning'],
    review: `Danh mục gốc của mọi danh sách "awesome". Gần nửa triệu sao và là điểm khởi hành đúng khi bước vào một lĩnh vực hoàn toàn mới: thay vì gõ tìm mò mẫm, vào đây tìm danh sách chuyên đề đã có người sàng lọc.

### Dùng vào việc gì
- Khảo sát nhanh một mảng lạ (WebRTC, mật mã, thiết kế trò chơi) trước khi chọn thư viện
- Tìm danh sách chuyên biệt cho từng ngôn ngữ, từng khung
- Lấy ý tưởng chủ đề mới cho phần Tech Trends của bạn

### Lưu ý
Danh sách được duyệt nhưng không đảm bảo còn được bảo trì. Luôn xem lần commit gần nhất của một thư viện trước khi đưa vào dự án thật.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVOPS · HẠ TẦNG · BẢO MẬT — cho người tự vận hành VPS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'docker/awesome-compose',
    tags: ['DevOps', 'Docker'],
    review: `Bộ mẫu Docker Compose chính thức cho hàng chục tổ hợp: Node + Postgres, Next.js + nginx, Python + Redis… Mỗi mẫu là một thư mục chạy được ngay, đúng thứ cần khi phải dựng một dịch vụ mới mà không muốn ngồi đoán cú pháp.

### Dùng vào việc gì
- Đối chiếu file compose của bạn với mẫu chuẩn: mạng, biến môi trường, phụ thuộc khởi động, kiểm tra sức khoẻ
- Xem cách đặt kiểm tra sức khoẻ cho từng loại dịch vụ — nền tảng của triển khai không gián đoạn
- Học cách gắn volume cho dữ liệu bền: chỗ hay mất dữ liệu nhất khi container được dựng lại

### Lưu ý
Mẫu tối ưu cho việc chạy thử, chưa phải cho môi trường thật: thiếu giới hạn tài nguyên, thiếu chính sách khởi động lại và thường chạy bằng người dùng root.`,
  },
  {
    slug: 'traefik/traefik',
    tags: ['DevOps', 'Go'],
    review: `Proxy ngược tự phát hiện dịch vụ qua nhãn Docker: bật một container lên là tuyến đường và chứng chỉ HTTPS tự có, không phải sửa file cấu hình rồi nạp lại. Đây là lựa chọn thay thế hấp dẫn cho cấu hình nginx viết tay khi số dịch vụ tăng dần.

### Dùng vào việc gì
- Nhiều dịch vụ trên cùng một VPS, mỗi cái một tên miền phụ, không phải chỉnh cấu hình thủ công
- Chứng chỉ Let's Encrypt tự động và tự gia hạn
- Bảng điều khiển xem tuyến nào đang sống, hữu ích khi đoán xem 404 đến từ đâu

### Lưu ý
Đổi cả tầng proxy trên một hệ đang chạy là việc rủi ro. Nếu nginx hiện tại vẫn ổn, đọc để biết chứ đừng chuyển ngay giữa mùa cao điểm.`,
  },
  {
    slug: 'caddyserver/caddy',
    tags: ['DevOps', 'Go'],
    review: `Máy chủ web có HTTPS bật sẵn theo mặc định, file cấu hình ngắn tới mức kinh ngạc — một trang Caddyfile làm được việc mà nginx cần vài chục dòng. Nếu từng vật lộn với chứng chỉ và chuyển hướng, đây là liều thuốc dễ chịu.

### Dùng vào việc gì
- Phục vụ trang tĩnh hoặc làm proxy ngược mà không phải nhớ cú pháp nginx
- Tự xin và gia hạn chứng chỉ, kể cả cho tên miền phụ ký tự đại diện
- Máy chủ tạm cho môi trường thử, dựng trong hai phút

### Lưu ý
Nhớ bài học đã trả giá với nginx: chỉ thị thêm tiêu đề KHÔNG cộng dồn giữa các khối. Caddy hành xử khác, nên đừng bê nguyên trực giác từ nginx sang.`,
  },
  {
    slug: 'coollabsio/coolify',
    tags: ['DevOps', 'Self-hosted'],
    review: `Nền tảng triển khai tự host, kiểu Vercel/Heroku nhưng chạy trên VPS của chính mình: nối kho mã, nó lo dựng ảnh, cấp chứng chỉ, đảo container không gián đoạn, sao lưu cơ sở dữ liệu. Đáng xem cho người đang tự viết kịch bản triển khai.

### Dùng vào việc gì
- Thay kịch bản deploy thủ công bằng bảng điều khiển có nhật ký và nút quay lui
- Quản lý nhiều môi trường (thử nghiệm / sản phẩm) trên cùng một máy
- Đọc cách họ đảo container để đối chiếu với kịch bản triển khai của bạn

### Lưu ý
Bản thân Coolify cũng ăn RAM. Trên máy 6GB đang chạy Postgres và hai container Node, cân nhắc kỹ trước khi thêm một tầng quản lý nữa.`,
  },
  {
    slug: 'netdata/netdata',
    tags: ['DevOps', 'Monitoring'],
    review: `Giám sát máy chủ theo thời gian thực, độ phân giải một giây, cài xong là có bảng đồ thị đầy đủ mà không phải cấu hình gì. Với VPS nhỏ, đây là cách nhanh nhất để trả lời "lúc 3 giờ sáng máy nghẽn vì cái gì".

### Dùng vào việc gì
- Bắt tại trận lúc RAM cạn trong khi dựng ảnh Docker — nguyên nhân thật của những lần bản dựng bị hạ sát
- Xem tiến trình nào ăn CPU và đĩa, phát hiện đĩa sắp đầy trước khi Postgres chết
- Cảnh báo qua thư hoặc webhook khi vượt ngưỡng

### Lưu ý
Bảng điều khiển mở công khai là lộ sạch thông tin hệ thống. Đặt sau đăng nhập hoặc chỉ cho truy cập qua mạng nội bộ.`,
  },
  {
    slug: 'grafana/grafana',
    tags: ['DevOps', 'Monitoring'],
    review: `Chuẩn de facto cho bảng điều khiển đo lường: cắm vào Prometheus, Postgres, Loki hay bất cứ nguồn nào rồi dựng biểu đồ. Đọc source cũng có ích cho người làm frontend — đây là một trong những ứng dụng trực quan hoá dữ liệu lớn nhất viết bằng TypeScript.

### Dùng vào việc gì
- Bảng theo dõi chỉ số nghiệp vụ, không chỉ chỉ số máy: số người học mỗi ngày, tỉ lệ hoàn thành bài
- Truy vấn thẳng Postgres để dựng biểu đồ, khỏi viết trang thống kê riêng
- Cảnh báo có bối cảnh: kèm luôn biểu đồ vào thông báo

### Lưu ý
Nặng hơn nhu cầu của một VPS đơn lẻ. Nếu chỉ cần vài con số, một trang thống kê tự viết vẫn rẻ hơn cả bộ này.`,
  },
  {
    slug: 'dani-garcia/vaultwarden',
    tags: ['Security', 'Self-hosted', 'Rust'],
    review: `Máy chủ quản lý mật khẩu tương thích Bitwarden, viết bằng Rust, nhẹ tới mức chạy được trên máy nhỏ nhất. Dùng được mọi ứng dụng khách chính thức nhưng dữ liệu nằm trên máy của bạn.

### Dùng vào việc gì
- Nơi cất khoá API, mật khẩu cơ sở dữ liệu, biến môi trường sản phẩm — thay vì để rải trong file văn bản
- Chia sẻ bí mật an toàn khi có thêm người cùng làm
- Có sổ ghi khi cần xoay khoá: biết chính xác khoá nào đang nằm ở đâu

### Lưu ý
Liên quan trực tiếp tới sự cố khoá API bị lộ trước đây. Một kho bí mật đúng nghĩa sẽ khiến việc xoay khoá là chuyện mười phút thay vì cả buổi đi truy từng chỗ.`,
  },
  {
    slug: 'restic/restic',
    tags: ['DevOps', 'Go'],
    review: `Công cụ sao lưu mã hoá, khử trùng lặp, đẩy lên nhiều loại kho đích kể cả kho tương thích S3 như Cloudflare R2 bạn đang dùng. Sao lưu tăng dần nên bản thứ hai trở đi rất nhanh và rất nhẹ.

### Dùng vào việc gì
- Sao lưu kết xuất Postgres và thư mục tải lên, mã hoá trước khi rời máy chủ
- Giữ lịch sử theo lịch: ngày, tuần, tháng — mà không phình dung lượng
- Khôi phục thử định kỳ

### Lưu ý
Bản sao lưu chưa từng khôi phục thử thì chưa phải bản sao lưu. Đặt lịch mỗi quý khôi phục ra một thư mục tạm và kiểm tra dữ liệu thật sự đọc được.`,
  },
  {
    slug: 'OWASP/CheatSheetSeries',
    tags: ['Security', 'Learning'],
    review: `Bộ hướng dẫn bảo mật súc tích của OWASP, mỗi chủ đề một trang: xác thực, quản lý phiên, tải tệp lên, tiêm SQL, XSS, JWT, mật khẩu. Đây là tài liệu tra cứu chuẩn khi rà soát bảo mật, không phải lý thuyết suông.

### Dùng vào việc gì
- Bảng kiểm khi làm tính năng nhạy cảm: đăng nhập, đổi mật khẩu, tải tệp, thanh toán
- Trang về JWT và về phiên trả lời đúng câu hỏi hết hạn token và làm mới thế nào cho an toàn
- Trang về tải tệp lên: đúng những lỗ hổng đã từng phải vá trong dự án

### Bắt đầu từ đâu
Đọc trang tải tệp và trang xác thực trước — hai chỗ đó chiếm phần lớn rủi ro thực tế của một trang web có người dùng.`,
  },
  {
    slug: 'github/gitignore',
    tags: ['DevOps', 'Git'],
    review: `Bộ mẫu \`.gitignore\` chính thức cho mọi ngôn ngữ và công cụ. Nghe tầm thường, nhưng một dòng thiếu ở đây là cách phổ biến nhất khiến file môi trường hoặc thư mục dựng lọt vào lịch sử kho mã.

### Dùng vào việc gì
- Lấy mẫu Node, Next.js, Python làm nền rồi bổ sung phần riêng của dự án
- Đối chiếu định kỳ xem có công cụ mới nào đang rải file rác vào kho
- Mẫu cho hệ điều hành và IDE, tránh commit file tạm của macOS hay thư mục cấu hình biên tập

### Lưu ý
Thêm vào \`.gitignore\` KHÔNG xoá được thứ đã trót commit — file vẫn nằm trong lịch sử. Lỡ commit bí mật thì việc cần làm là xoay khoá ngay, không phải sửa file bỏ qua.`,
  },
  {
    slug: 'bregman-arie/devops-exercises',
    tags: ['DevOps', 'Learning', 'Interview'],
    review: `Hơn hai nghìn câu hỏi và bài tập DevOps kèm đáp án: Linux, mạng, Docker, Kubernetes, CI/CD, Git, giám sát, mã hoá hạ tầng. Định dạng hỏi-đáp khiến nó vừa là tài liệu ôn phỏng vấn vừa là bài tự kiểm tra.

### Dùng vào việc gì
- Tự dò lỗ hổng kiến thức: đọc câu hỏi, tự trả lời, rồi mới xem đáp án
- Chuẩn bị phỏng vấn cho các vị trí có yêu cầu vận hành
- Nguồn ý tưởng câu hỏi cho ngân hàng đề trong Interview Simulator của bạn

### Lưu ý
Đáp án ngắn gọn theo kiểu ghi nhớ. Câu nào thấy lạ thì tra thêm tài liệu gốc, đừng học vẹt.`,
  },
  {
    slug: 'jesseduffield/lazydocker',
    tags: ['DevOps', 'CLI', 'Docker'],
    review: `Giao diện terminal cho Docker: xem container, nhật ký, mức dùng tài nguyên, khởi động lại dịch vụ — tất cả bằng phím mũi tên, không phải nhớ chuỗi lệnh dài.

### Dùng vào việc gì
- Xem nhật ký nhiều container cạnh nhau khi truy vết một sự cố triển khai
- Phát hiện container mồ côi và ảnh cũ đang ngốn đĩa
- Khởi động lại một dịch vụ, mở shell vào container nhanh hơn gõ lệnh

### Lưu ý
Rất hợp để chẩn đoán những lần triển khai kỳ lạ — như lần container mồ côi khiến bản dựng mới vẫn chạy ảnh cũ mà lệnh triển khai vẫn báo thành công.`,
  },
  {
    slug: 'trimstray/the-book-of-secret-knowledge',
    tags: ['DevOps', 'Security', 'Awesome'],
    review: `Tuyển tập khổng lồ các mẹo dòng lệnh, công cụ mạng, tài liệu bảo mật và bảng tra cứu một dòng. Không phải sách để đọc từ đầu tới cuối, mà là chỗ để tìm khi biết mình cần làm gì nhưng không nhớ công cụ nào làm được.

### Dùng vào việc gì
- Mẹo một dòng cho \`curl\`, \`ss\`, \`tcpdump\`, \`openssl\` khi gỡ lỗi mạng
- Danh sách công cụ trực tuyến: kiểm tra chứng chỉ, tra DNS, phân tích tiêu đề HTTP
- Bảng tra cứu Linux dán cạnh màn hình

### Lưu ý
Có phần công cụ tấn công. Chỉ dùng trên hệ thống của chính mình hoặc nơi được phép — đúng ranh giới giữa kiểm thử bảo mật và vi phạm.`,
  },
  {
    slug: 'wagoodman/dive',
    tags: ['DevOps', 'Docker', 'CLI'],
    review: `Xem từng lớp trong ảnh Docker và chỉ ra chính xác file nào làm ảnh phình ra. Nó còn chấm điểm mức lãng phí, giúp biết ngay nên gộp hay tách lệnh nào trong Dockerfile.

### Dùng vào việc gì
- Cắt dung lượng ảnh: tìm thư mục \`node_modules\` bị nhân đôi, tệp bộ đệm quên xoá
- Kiểm chứng bản dựng nhiều tầng thật sự vứt được phần công cụ biên dịch
- Truy vết vì sao một thay đổi nhỏ lại làm mất bộ đệm và bản dựng chậm hẳn

### Lưu ý
Ảnh nhỏ không chỉ để tiết kiệm đĩa: tải nhanh hơn nghĩa là triển khai nhanh hơn và cửa sổ rủi ro ngắn hơn. Trên máy 6GB, điều này đáng giá thật.`,
  },
  {
    slug: 'aquasecurity/trivy',
    tags: ['Security', 'DevOps', 'Docker'],
    review: `Máy quét bảo mật cho ảnh container, hệ thống tệp và kho mã: tìm gói có lỗ hổng đã biết, cấu hình sai và bí mật bị bỏ quên. Một lệnh là ra báo cáo, không cần dựng máy chủ.

### Dùng vào việc gì
- Quét ảnh trước khi triển khai, chặn những gói có lỗ hổng nghiêm trọng
- Quét kho mã tìm khoá API lỡ commit — đúng loại sự cố đã từng xảy ra
- Thêm một bước vào CI để mỗi lần thay đổi phụ thuộc đều được kiểm

### Lưu ý
Lần chạy đầu sẽ ra rất nhiều cảnh báo. Lọc theo mức nghiêm trọng cao trở lên trước, nếu không danh sách dài quá sẽ bị bỏ qua toàn bộ.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HỌC TẬP · LỘ TRÌNH · PHỎNG VẤN
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'nilbuild/developer-roadmap',
    tags: ['Learning', 'Roadmap'],
    review: `Bộ lộ trình học tương tác nổi tiếng nhất GitHub: frontend, backend, DevOps, kiến trúc hệ thống, AI và hàng chục nhánh khác. Mỗi nút bấm được, mở ra tài nguyên đã chọn lọc, nên nó vừa là bản đồ vừa là danh mục học liệu.

### Dùng vào việc gì
- Đối chiếu xem mình đang đứng đâu, còn thiếu mảng nào trước khi nộp hồ sơ
- Chọn thứ tự học có căn cứ, thay vì nhảy cóc theo cảm hứng
- Nguồn tham khảo cấu trúc cho module RoadMap trên trang của bạn

### Lưu ý
Lộ trình cố ý vẽ rộng hơn nhu cầu thực tế của một công việc. Đừng coi là danh sách phải hoàn thành hết mới được đi xin việc — chọn nhánh, đi sâu, rồi mở rộng dần.`,
  },
  {
    slug: 'donnemartin/system-design-primer',
    tags: ['Learning', 'System Design', 'Interview'],
    review: `Tài liệu thiết kế hệ thống được tham chiếu nhiều nhất: cân bằng tải, bộ nhớ đệm, phân mảnh dữ liệu, hàng đợi, định lý CAP, kèm bài tập có lời giải từng bước. Giải thích bằng sơ đồ và con số thực tế chứ không nói suông.

### Dùng vào việc gì
- Chuẩn bị vòng phỏng vấn thiết kế hệ thống, vòng khó nhất ở các công ty lớn
- Hiểu vì sao thêm bộ nhớ đệm lại đẻ ra bài toán vô hiệu hoá đệm — bài học áp dụng ngay cho phần đệm 60 giây ở trang /repos
- Học cách ước lượng: bao nhiêu yêu cầu mỗi giây, bao nhiêu dung lượng, bao nhiêu máy

### Bắt đầu từ đâu
Phần "bảng số liệu mọi lập trình viên nên biết" — nắm được thứ tự độ lớn của độ trễ là đã đổi cách bạn thiết kế.`,
  },
  {
    slug: 'ByteByteGoHq/system-design-101',
    tags: ['Learning', 'System Design'],
    review: `Giải thích hệ thống phức tạp bằng hình vẽ: REST và GraphQL khác nhau ra sao, cơ chế xác thực, cách một cơ sở dữ liệu ghi dữ liệu, mạng phân phối nội dung hoạt động thế nào. Mỗi chủ đề gói trong một sơ đồ dễ nhớ.

### Dùng vào việc gì
- Ôn nhanh trước phỏng vấn: nhìn hình nhớ lại nhanh hơn đọc chữ
- Mượn cách vẽ để giải thích kiến trúc của chính bạn trong hồ sơ năng lực
- Nguồn cảm hứng cho các sơ đồ trong bài viết kỹ thuật trên trang

### Lưu ý
Sơ đồ đơn giản hoá có chủ đích. Khi làm thật, luôn kiểm lại chi tiết ở tài liệu gốc — cái đẹp của sơ đồ dễ khiến ta quên các trường hợp biên.`,
  },
  {
    slug: 'trekhleb/javascript-algorithms',
    tags: ['Algorithms', 'JavaScript', 'Learning'],
    review: `Thuật toán và cấu trúc dữ liệu viết bằng JavaScript, mỗi cái kèm giải thích, độ phức tạp và liên kết đọc thêm. Học thuật toán bằng ngôn ngữ mình đang dùng hằng ngày dễ ngấm hơn nhiều so với đọc mã giả.

### Dùng vào việc gì
- Ôn cấu trúc dữ liệu cho vòng phỏng vấn thuật toán
- Tra cách cài đặt đúng khi cần: hàng đợi ưu tiên, tìm kiếm nhị phân, đồ thị
- Hiểu chi phí thực sự của thao tác mình gọi hằng ngày — vì sao lồng hai vòng lặp trên mảng lớn lại giết hiệu năng

### Bắt đầu từ đâu
Nhánh cấu trúc dữ liệu trước, thuật toán sau. Không nắm cây và bảng băm thì phần thuật toán chỉ là học thuộc.`,
  },
  {
    slug: 'codecrafters-io/build-your-own-x',
    tags: ['Learning', 'Project'],
    review: `Danh mục hướng dẫn tự xây lại những công nghệ quen thuộc từ số không: máy chủ web, cơ sở dữ liệu, Git, Docker, trình biên dịch, hệ điều hành. Đây là cách học hiệu quả nhất để biến "biết dùng" thành "hiểu bên trong".

### Dùng vào việc gì
- Dự án cá nhân đáng đưa vào hồ sơ, hơn hẳn một trang việc cần làm nữa
- Hiểu công cụ mình dùng: tự viết một Git nhỏ rồi thì mọi lệnh Git bỗng có nghĩa
- Chọn theo ngôn ngữ đang học để vừa ôn cú pháp vừa hiểu hệ thống

### Bắt đầu từ đâu
"Tự viết Git" hoặc "tự viết máy chủ HTTP" — hai cái đó vừa sức, làm xong trong vài buổi tối và trả lại kiến thức dùng được ngay.`,
  },
  {
    slug: 'practical-tutorials/project-based-learning',
    tags: ['Learning', 'Project'],
    review: `Danh mục hướng dẫn theo dự án, xếp theo ngôn ngữ: mỗi mục dẫn tới một bài xây một thứ hoàn chỉnh, không phải bài tập cú pháp rời rạc. Học kiểu này giữ động lực tốt hơn hẳn xem video thụ động.

### Dùng vào việc gì
- Tìm dự án vừa sức khi học ngôn ngữ mới
- Nguồn ý tưởng bài tập lớn cho các khoá trên trang của bạn
- Chọn dự án theo mảng đang muốn mạnh lên: mạng, đồ hoạ, trình biên dịch, trò chơi

### Lưu ý
Chất lượng bài hướng dẫn không đồng đều và một số đã cũ. Xem ngày đăng trước khi bỏ ra một cuối tuần, nhất là với các bài dùng khung frontend.`,
  },
  {
    slug: 'freeCodeCamp/freeCodeCamp',
    tags: ['Learning', 'Open Source'],
    review: `Chương trình học lập trình miễn phí lớn nhất thế giới, kèm chứng chỉ và hàng nghìn giờ bài tập chấm tự động. Nhưng với bạn, giá trị lớn hơn có thể nằm ở chỗ khác: đây là một nền tảng học trực tuyến mã nguồn mở hoàn chỉnh để đọc.

### Dùng vào việc gì
- Xem cách họ mô hình hoá khoá học, chương, bài và tiến độ người học — đối chiếu với Academy của bạn
- Cách chấm bài trong trình duyệt an toàn, không cho code người dùng phá trang
- Bản thân chương trình học: phần thuật toán và cấu trúc dữ liệu rất chắc

### Lưu ý
Kho mã rất lớn. Vào thẳng thư mục chương trình học và phần chấm bài, đừng cố dựng cả hệ thống lên máy.`,
  },
  {
    slug: 'jwasham/coding-interview-university',
    tags: ['Interview', 'Learning'],
    review: `Kế hoạch tự học toàn diện để đi phỏng vấn kỹ sư phần mềm, do một người thật dùng để đổi nghề rồi chia sẻ lại. Điểm mạnh là **thứ tự** và **danh sách kiểm** — biết học gì trước, học tới đâu là đủ.

### Dùng vào việc gì
- Kế hoạch ôn nhiều tháng có cấu trúc, thay vì học lung tung theo cảm hứng
- Danh sách chủ đề dùng làm bảng tự chấm: mảng, cây, đồ thị, quy hoạch động, đồng thời
- Phần lời khuyên phỏng vấn: cách trình bày suy nghĩ thành tiếng, thứ quyết định kết quả nhiều hơn code

### Lưu ý
Viết cho phỏng vấn kiểu công ty lớn nước ngoài, nặng phần khoa học máy tính. Phỏng vấn ở phần lớn công ty sản phẩm nhẹ hơn nhiều — đừng để danh sách dài làm nản.`,
  },
  {
    slug: 'yangshun/tech-interview-handbook',
    tags: ['Interview', 'Learning'],
    review: `Sổ tay phỏng vấn thực dụng: mẫu hồ sơ, cách trả lời câu hỏi hành vi, thương lượng lương, và bộ câu hỏi kỹ thuật thường gặp. Thực tế hơn các danh sách chỉ toàn bài tập thuật toán.

### Dùng vào việc gì
- Viết lại hồ sơ theo mẫu đã được kiểm chứng — phần bạn có thể áp ngay vào CV Builder
- Chuẩn bị câu hỏi hành vi theo cấu trúc, chỗ ứng viên kỹ thuật hay trượt oan
- Phần phỏng vấn frontend rất sát công việc thật

### Bắt đầu từ đâu
Chương về hồ sơ và câu hỏi hành vi. Kỹ thuật thì bạn đã có sẵn nền, hai phần kia mới là nơi tạo khác biệt.`,
  },
  {
    slug: 'goldbergyoni/nodebestpractices',
    tags: ['Node.js', 'Backend', 'Best Practices'],
    review: `Hơn tám mươi thực hành tốt cho Node.js, mỗi mục có "làm thế này" kèm ví dụ đúng và ví dụ sai: cấu trúc dự án, xử lý lỗi, kiểm thử, hiệu năng, bảo mật, vận hành. Đây gần như là bản rà soát mã nguồn viết sẵn cho backend của bạn.

### Dùng vào việc gì
- Đối chiếu tầng xử lý lỗi hiện tại: phân biệt lỗi vận hành và lỗi lập trình, chỗ nhiều dự án làm sai
- Phần bảo mật: giới hạn tần suất, kích thước tải lên, tiêu đề, phụ thuộc — trùng với các lỗ hổng bạn đã vá
- Phần chuẩn bị vận hành: dừng êm, kiểm tra sức khoẻ, ghi nhật ký có cấu trúc

### Bắt đầu từ đâu
Chương xử lý lỗi. Một tầng lỗi rõ ràng khiến mọi sự cố sau này ngắn đi một nửa thời gian truy vết.`,
  },
  {
    slug: 'ryanmcdermott/clean-code-javascript',
    tags: ['JavaScript', 'Best Practices'],
    review: `Các nguyên tắc mã sạch của Robert Martin viết lại cho JavaScript, mỗi mục có ví dụ xấu và ví dụ tốt cạnh nhau. Ngắn, đọc trong một buổi, nhưng đổi được thói quen đặt tên và chia hàm.

### Dùng vào việc gì
- Bảng kiểm khi tự rà lại mã trước khi commit
- Phần đặt tên và tham số hàm — thứ ảnh hưởng tới người đọc nhiều nhất
- Tài liệu chung khi làm nhóm, để tranh luận dựa trên nguyên tắc thay vì khẩu vị

### Lưu ý
Nguyên tắc là hướng dẫn, không phải luật. Có lúc một hàm dài và thẳng dễ đọc hơn năm hàm nhỏ nhảy qua nhảy lại.`,
  },
  {
    slug: 'airbnb/javascript',
    tags: ['JavaScript', 'Best Practices'],
    review: `Quy ước viết JavaScript được trích dẫn nhiều nhất, kèm giải thích **vì sao** cho từng quy tắc chứ không chỉ ra lệnh. Ngay cả khi không theo hết, phần lý do vẫn dạy được nhiều về ngữ nghĩa của ngôn ngữ.

### Dùng vào việc gì
- Nền tảng cho cấu hình kiểm tra mã của dự án
- Giải thích các quy tắc mà công cụ kiểm tra đang bắt lỗi, thay vì tắt đi cho xong
- Phần về sao chép nông và tham chiếu giúp hiểu một lớp bug âm thầm trong React

### Lưu ý
Một số quy tắc ra đời trước các tính năng mới của ngôn ngữ. Đọc kèm ngày cập nhật và ưu tiên cú pháp hiện đại khi hai bên lệch nhau.`,
  },
  {
    slug: 'TheAlgorithms/Python',
    tags: ['Algorithms', 'Python'],
    review: `Bộ sưu tập thuật toán bằng Python lớn nhất trên GitHub: sắp xếp, tìm kiếm, đồ thị, mật mã, học máy, toán học. Code ngắn và có chú thích, hợp để đọc hiểu ý tưởng rồi cài lại bằng ngôn ngữ khác.

### Dùng vào việc gì
- Tra cách cài đặt tham chiếu khi tự viết mà nghi ngờ mình sai
- Phần mật mã minh hoạ trực quan các thuật toán mã hoá — bổ trợ tốt cho module mã hoá của bạn
- Nguồn bài tập cho phần thuật toán trong Code Lab

### Lưu ý
Viết để dễ đọc, không phải để chạy nhanh. Đừng bê thẳng vào chỗ cần hiệu năng mà chưa đo lại.`,
  },
  {
    slug: 'ossu/computer-science',
    tags: ['Learning', 'Roadmap'],
    review: `Chương trình cử nhân khoa học máy tính ghép hoàn toàn từ khoá học miễn phí của các đại học, có thứ tự học và tiêu chí hoàn thành rõ ràng. Dành cho người muốn lấp nền tảng lý thuyết chứ không chỉ học khung công nghệ.

### Dùng vào việc gì
- Bổ sung phần lý thuyết mà chương trình đại học thiên thực hành hay bỏ qua: hệ điều hành, mạng, lý thuyết tính toán
- Chọn từng môn lẻ để đào sâu đúng chỗ mình yếu, không nhất thiết theo cả chương trình
- Đối chiếu với lộ trình Academy của bạn xem còn thiếu môn nền nào

### Lưu ý
Đi trọn chương trình mất hàng nghìn giờ. Thực tế hơn là nhặt ba đến bốn môn nền tảng rồi quay lại làm sản phẩm.`,
  },
  {
    slug: 'sudheerj/reactjs-interview-questions',
    tags: ['React', 'Interview'],
    review: `Bộ câu hỏi phỏng vấn React đồ sộ, xếp từ cơ bản tới nâng cao, có đáp án và ví dụ mã. Nhiều câu chạm đúng những chỗ hay hiểu mơ hồ: khoá của danh sách, hàm dọn dẹp trong hiệu ứng, ghi nhớ kết quả tính toán.

### Dùng vào việc gì
- Tự kiểm trước phỏng vấn frontend
- Ôn nhanh các khái niệm ít dùng nhưng hay bị hỏi: ranh giới lỗi, portal, ref chuyển tiếp
- Nguồn câu hỏi cho ngân hàng đề trong Interview Simulator

### Lưu ý
Một phần câu hỏi viết cho React đời cũ (component lớp, vòng đời). Biết để hiểu mã cũ, nhưng phỏng vấn hiện tại xoay quanh hook và component máy chủ.`,
  },
  {
    slug: 'Ebazhanov/linkedin-skill-assessments-quizzes',
    tags: ['Interview', 'Learning'],
    review: `Ngân hàng câu hỏi trắc nghiệm cho các bài kiểm tra kỹ năng trên LinkedIn: JavaScript, React, Node.js, HTML/CSS, SQL, Git và hàng chục mảng khác. Mỗi câu có đáp án, dạng câu ngắn nên rất hợp để tự dò kiến thức.

### Dùng vào việc gì
- Tự kiểm nhanh một mảng trước khi ghi vào hồ sơ là "thành thạo"
- Định dạng câu hỏi tham khảo cho Phòng thi của bạn: câu ngắn, bốn phương án, một đáp án đúng
- Ôn cú pháp lặt vặt hay quên

### Lưu ý
Nhắm vào bài kiểm tra của LinkedIn nên có câu nặng ghi nhớ. Học để nắm khái niệm, đừng học tủ đáp án.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OOP · MẪU THIẾT KẾ · KIẾN TRÚC
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'iluwatar/java-design-patterns',
    tags: ['Design Patterns', 'OOP'],
    review: `Bộ mẫu thiết kế cài đặt bằng Java đầy đủ và có tổ chức nhất trên GitHub. Mỗi mẫu là một module chạy được, kèm sơ đồ lớp, tình huống dùng thật và phần "khi nào KHÔNG nên dùng" — phần mà đa số tài liệu bỏ qua.

### Dùng vào việc gì
- Học lập trình hướng đối tượng cho các môn có Java trong chương trình
- Nhận diện mẫu trong khung công nghệ mình đang dùng: tiêm phụ thuộc, quan sát viên, trang trí xuất hiện khắp nơi
- Nguồn tài liệu tin cậy khi soạn bài giảng về mẫu thiết kế

### Bắt đầu từ đâu
Nhà máy, chiến lược, quan sát viên, trang trí — bốn mẫu này chiếm phần lớn mã thực tế. Học kỹ bốn cái đó hơn là lướt qua cả hai mươi ba mẫu.`,
  },
  {
    slug: 'DovAmir/awesome-design-patterns',
    tags: ['Design Patterns', 'Awesome'],
    review: `Danh mục mẫu thiết kế trải khắp mọi tầng: hướng đối tượng, kiến trúc vi dịch vụ, điện toán đám mây, dữ liệu lớn, giao diện. Chỗ tốt để thấy "mẫu thiết kế" không dừng ở hai mươi ba mẫu kinh điển.

### Dùng vào việc gì
- Tìm mẫu cho tầng hạ tầng: cầu dao, thử lại kèm giãn cách, vách ngăn cách ly lỗi
- Mẫu cho dữ liệu và tin nhắn khi hệ thống bắt đầu có nhiều thành phần
- Bản đồ để biết mảng nào mình chưa từng chạm tới

### Lưu ý
Nhiều mẫu sinh ra cho hệ phân tán quy mô lớn. Áp vào một ứng dụng đơn khối chỉ làm mã rối thêm — đọc để nhận diện, dùng khi thật sự có vấn đề đó.`,
  },
  {
    slug: 'nilbuild/design-patterns-for-humans',
    tags: ['Design Patterns', 'OOP', 'Learning'],
    review: `Giải thích mẫu thiết kế bằng ngôn ngữ đời thường, mỗi mẫu mở đầu bằng một ví dụ ngoài đời rồi mới tới code. Nếu từng đọc sách gốc mà thấy khô cứng, đây là cửa vào dễ chịu hơn nhiều.

### Dùng vào việc gì
- Nắm ý tưởng cốt lõi của từng mẫu trong vài phút thay vì vài chương sách
- Ôn nhanh trước phỏng vấn có phần hướng đối tượng
- Cách giải thích ở đây rất đáng mượn khi bạn viết bài dạy người khác

### Lưu ý
Ví dụ viết bằng PHP nhưng ý tưởng không phụ thuộc ngôn ngữ. Đọc xong nên tự cài lại một mẫu bằng TypeScript để chắc là đã hiểu.`,
  },
  {
    slug: 'faif/python-patterns',
    tags: ['Design Patterns', 'Python'],
    review: `Mẫu thiết kế và thành ngữ lập trình bằng Python, chia theo nhóm khởi tạo, cấu trúc, hành vi. Điểm đặc biệt: nhiều mẫu ở đây chỉ ra rằng trong Python, cách làm gọn hơn thường không cần tới mẫu kinh điển.

### Dùng vào việc gì
- Học mẫu bằng ngôn ngữ nhẹ cú pháp, thấy rõ ý tưởng không bị che bởi khai báo kiểu
- So sánh cách một mẫu biến dạng theo đặc tính ngôn ngữ
- Hữu ích cho phần Python trong Code Lab

### Lưu ý
Bài học ngầm quan trọng nhất: mẫu thiết kế là cách vá những chỗ ngôn ngữ còn thiếu. Ngôn ngữ có hàm bậc cao và kiểu động thì nhiều mẫu tự tan biến.`,
  },
  {
    slug: 'Sairyss/domain-driven-hexagon',
    tags: ['Architecture', 'TypeScript', 'Backend'],
    review: `Hướng dẫn dài về thiết kế hướng miền và kiến trúc lục giác, kèm mã mẫu TypeScript đầy đủ. Trả lời đúng câu hỏi khiến mọi backend lớn dần bị rối: nên đặt logic nghiệp vụ ở đâu để không dính chặt vào khung web và ORM.

### Dùng vào việc gì
- Tách tầng: thực thể miền, ca sử dụng, hạ tầng — thay cho tầng service phình to
- Hiểu vì sao nên để logic nghiệp vụ không biết gì về Prisma hay Express
- Mẫu xử lý lỗi và đối tượng giá trị rất đáng mượn dù không theo trọn kiến trúc

### Lưu ý
Đây là kiến trúc nặng, sinh ra cho hệ nghiệp vụ phức tạp và nhiều người cùng làm. Áp trọn vào một trang cá nhân là bội thực — hãy lấy phần tách tầng, bỏ phần nghi thức.`,
  },
  {
    slug: 'Sairyss/backend-best-practices',
    tags: ['Backend', 'Best Practices', 'Architecture'],
    review: `Bản đồ thực hành tốt cho backend, ngắn gọn và không phụ thuộc ngôn ngữ: kiến trúc, kiểm thử, ghi nhật ký, giám sát, bảo mật, cơ sở dữ liệu, tài liệu API. Mỗi mục có liên kết đi sâu, dùng như bảng kiểm rất tiện.

### Dùng vào việc gì
- Rà soát toàn diện một API trước khi coi là xong: đã có phân trang, giới hạn tần suất, khoá chống trùng chưa
- Phần cơ sở dữ liệu nhắc đúng những thứ hay quên: chỉ mục, giao dịch, chống ghi đè đồng thời
- Danh sách chủ đề để tự dò lỗ hổng kiến thức backend

### Bắt đầu từ đâu
Phần khoá chống trùng và giao dịch — hai chỗ sinh lỗi khó tái hiện nhất khi có nhiều người dùng cùng lúc.`,
  },
  {
    slug: 'torokmark/design_patterns_in_typescript',
    tags: ['Design Patterns', 'TypeScript', 'OOP'],
    review: `Đủ hai mươi ba mẫu kinh điển viết bằng TypeScript, mỗi mẫu một thư mục nhỏ gọn có ví dụ chạy được. Vì cùng ngôn ngữ với dự án của bạn nên đọc xong áp dụng được ngay, không phải dịch từ Java sang.

### Dùng vào việc gì
- Học mẫu bằng chính ngôn ngữ đang dùng, thấy rõ vai trò của interface và generic
- Tham chiếu khi cần cấu trúc lại một tầng service đang chằng chịt if-else
- Ôn phần hướng đối tượng cho các môn ở trường

### Lưu ý
Ví dụ cố ý tối giản để làm nổi cấu trúc. Đừng đánh giá mẫu qua ví dụ đồ chơi — giá trị của chúng chỉ lộ ra khi mã đã đủ lớn.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TIẾNG ANH · IELTS · TIẾNG NHẬT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'ucatal/awesome-ielts',
    tags: ['English', 'IELTS', 'Learning'],
    review: `Danh mục tài nguyên IELTS thuộc miền công cộng: hướng dẫn theo từng kỹ năng, mẹo làm bài, nguồn luyện nghe đọc, tiêu chí chấm. Được sắp theo bốn kỹ năng nên tra đúng chỗ đang yếu rất nhanh.

### Dùng vào việc gì
- Bổ sung nguồn luyện cho lộ trình IELTS bạn đang xây trên trang
- Phần tiêu chí chấm nói và viết: hiểu giám khảo tính điểm theo cái gì mới biết đường sửa
- Danh sách nguồn nghe theo cấp độ, dùng để chọn tài liệu vừa sức

### Lưu ý
Danh mục dẫn ra ngoài, không tự chứa đề. Vẫn phải tự lọc — và tuyệt đối tránh các nguồn phát tán đề Cambridge có bản quyền.`,
  },
  {
    slug: 'shah0150/awesome-IELTS',
    tags: ['English', 'IELTS', 'Learning'],
    review: `Một tuyển tập IELTS khác, nghiêng về mẹo chiến thuật làm bài và mẫu câu cho phần viết. Đọc song song với danh mục kia sẽ thấy chỗ nào hai bên cùng nhắc — đó thường là thứ thật sự quan trọng.

### Dùng vào việc gì
- Mẫu cấu trúc bài viết Task 1 và Task 2, khung để tự luyện chứ không phải để học thuộc
- Chiến thuật phân bổ thời gian cho phần đọc, chỗ mất điểm oan nhiều nhất
- Danh sách từ vựng theo chủ đề

### Lưu ý
Mẫu câu học thuộc bị giám khảo trừ điểm nếu dùng máy móc. Lấy khung, thay nội dung bằng ý của mình.`,
  },
  {
    slug: 'awesome-english/awesome-english',
    tags: ['English', 'Learning'],
    review: `Tuyển tập tài nguyên học tiếng Anh nói chung: từ điển, công cụ luyện phát âm, kênh nghe, sách ngữ pháp, cộng đồng luyện nói. Nhỏ gọn nhưng chọn lọc kỹ, không phải bãi liên kết.

### Dùng vào việc gì
- Tìm công cụ luyện phát âm và nghe cho khoá Tiếng Anh Giao Tiếp của bạn
- Nguồn đọc theo cấp độ, hợp để xây phần đọc hiểu có kiểm tra
- Cộng đồng luyện nói, phần khó tự học nhất

### Lưu ý
Kho nhỏ và cập nhật chậm hơn các danh mục lớn. Kiểm liên kết còn sống trước khi đưa vào bài học.`,
  },
  {
    slug: 'dwyl/english-words',
    tags: ['English', 'Data'],
    review: `Danh sách hơn 466 nghìn từ tiếng Anh dưới dạng văn bản thuần và JSON. Không phải tài liệu học, mà là **dữ liệu** — thứ cần khi tự xây công cụ từ vựng.

### Dùng vào việc gì
- Kiểm tra một chuỗi có phải từ thật không: chấm bài nối chữ, lọc rác trong bài luyện viết
- Sinh câu đố từ vựng, trò chơi đoán chữ cho module học tiếng Anh
- Gợi ý sửa lỗi chính tả dựa trên khoảng cách chỉnh sửa

### Lưu ý
Danh sách thô, gồm cả từ hiếm và biến thể lạ. Muốn dùng cho bài học thì phải lọc theo tần suất — kết hợp với danh sách 10.000 từ phổ biến sẽ ra bộ dữ liệu dùng được.`,
  },
  {
    slug: 'first20hours/google-10000-english',
    tags: ['English', 'Data'],
    review: `Mười nghìn từ tiếng Anh phổ biến nhất xếp theo tần suất, có bản đã lọc từ tục và bản tách theo loại từ. Đây là bộ dữ liệu đúng để quyết định dạy từ nào trước.

### Dùng vào việc gì
- Xây lộ trình từ vựng theo tần suất: 1.000 từ đầu bao phủ phần lớn hội thoại hằng ngày
- Chấm độ khó của một bài đọc bằng tỉ lệ từ nằm ngoài top N
- Lọc bộ từ vựng lớn xuống còn phần đáng học trước

### Bắt đầu từ đâu
Ghép với danh sách từ đầy đủ: một bên cho biết từ có thật, một bên cho biết từ có đáng học. Hai file này cộng lại là nền cho cả một module từ vựng.`,
  },
  {
    slug: 'davidluzgouveia/kanji-data',
    tags: ['Japanese', 'Data', 'Learning'],
    review: `Bộ dữ liệu chữ Hán dạng JSON, có cấp độ JLPT cập nhật, số nét, âm đọc và nghĩa. Đúng loại dữ liệu cần cho phần luyện chữ Hán và thẻ lật trong module Tiếng Nhật của bạn.

### Dùng vào việc gì
- Nạp dữ liệu chữ Hán theo cấp JLPT, khỏi nhập tay từng chữ
- Lọc theo cấp để dựng bộ thẻ ôn cho JPD113 và các môn tiếng Nhật khác
- Đối chiếu, sửa lại phân cấp trong dữ liệu hiện có

### Lưu ý
Phân cấp JLPT không có bản chính thức từ ban tổ chức, các nguồn lệch nhau đôi chút. Chọn một nguồn làm chuẩn cho cả trang, đừng trộn.`,
  },
  {
    slug: 'tristcoil/hanabira.org',
    tags: ['Japanese', 'Learning', 'Self-hosted'],
    review: `Cổng học tiếng Nhật và tiếng Hàn mã nguồn mở, tự host được: từ vựng có lặp lại ngắt quãng, ngữ pháp, bài đọc, phân tích câu. Vừa dùng để học vừa là bản mẫu kiến trúc cho module học ngôn ngữ.

### Dùng vào việc gì
- Xem cách họ dựng thuật toán lặp lại ngắt quãng và mô hình dữ liệu đi kèm
- Cách gắn ngữ pháp vào bài đọc thật, thay vì dạy rời từng điểm
- Nguồn ý tưởng cho phần đọc hiểu tiếng Nhật của bạn

### Lưu ý
Dự án nhỏ, do ít người duy trì. Đọc để lấy ý tưởng thiết kế là chính, đừng phụ thuộc vào nó cho phần dữ liệu dài hạn.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // API CÔNG KHAI · NGUỒN DỮ LIỆU
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'n0shake/Public-APIs',
    tags: ['API', 'Data', 'Awesome'],
    review: `Danh mục API công khai thứ hai bên cạnh kho quen thuộc, phân loại theo lĩnh vực và ghi rõ có cần khoá hay không. Hai danh mục không trùng khít nhau, nên tra cả hai mới đủ.

### Dùng vào việc gì
- Tìm nguồn dữ liệu thật cho bài tập và dự án mẫu: thời tiết, tỉ giá, phim, sách, thiên văn
- API không cần khoá rất hợp cho bài học — người học chạy được ngay, không phải đăng ký
- Ý tưởng tính năng nhỏ cho trang: tỉ giá, ngày lễ, trích dẫn mỗi ngày

### Lưu ý
API miễn phí hay đổi hoặc chết. Bài học nào phụ thuộc API ngoài thì nên có dữ liệu dự phòng, nếu không vài tháng sau bài sẽ hỏng.`,
  },
  {
    slug: 'thanglequoc/vietnamese-provinces-database',
    tags: ['Data', 'Vietnam', 'Database'],
    review: `Bộ dữ liệu đơn vị hành chính Việt Nam đầy đủ dạng SQL và GIS: tỉnh, huyện, xã, có cả toạ độ. Nhập một lần vào Postgres là xong bài toán địa chỉ cho mọi biểu mẫu về sau.

### Dùng vào việc gì
- Ô chọn tỉnh/huyện/xã liên tầng cho hồ sơ người dùng, địa chỉ giao hàng, hồ sơ CV
- Chuẩn hoá địa chỉ nhập tay về mã hành chính, để thống kê theo vùng chạy đúng
- Dữ liệu bản đồ khi cần vẽ phân bố theo tỉnh

### Lưu ý
Đơn vị hành chính Việt Nam có thay đổi theo các đợt sáp nhập. Kiểm ngày cập nhật của bộ dữ liệu và ghi rõ phiên bản đang dùng, đừng để dữ liệu cũ âm thầm sai.`,
  },
  {
    slug: 'hongquan/vn-open-api-provinces',
    tags: ['API', 'Data', 'Vietnam'],
    review: `API mở tra cứu đơn vị hành chính Việt Nam, có sẵn máy chủ công khai và tự chạy được. Khác với bộ dữ liệu SQL, cái này dùng ngay không cần nhập bảng — hợp cho bản thử nhanh.

### Dùng vào việc gì
- Ô chọn địa chỉ trong bản mẫu, chưa cần đụng tới cơ sở dữ liệu
- Tìm kiếm bỏ dấu cho tên tỉnh huyện, chỗ tự viết hay sai
- Đối chiếu chéo với bộ dữ liệu SQL để phát hiện dữ liệu lệch

### Lưu ý
Máy chủ công khai không có cam kết vận hành. Sản phẩm thật thì tự host hoặc nhập dữ liệu vào cơ sở dữ liệu của mình, đừng gọi thẳng ra ngoài ở đường quan trọng.`,
  },
  {
    slug: 'faker-js/faker',
    tags: ['Testing', 'Data', 'TypeScript'],
    review: `Sinh dữ liệu giả trông như thật: tên, địa chỉ, thư điện tử, đoạn văn, ảnh đại diện, ngày tháng — có hỗ trợ tiếng Việt. Là công cụ nền cho seed dữ liệu mẫu và cho kiểm thử.

### Dùng vào việc gì
- Seed cơ sở dữ liệu phát triển với hàng trăm bản ghi đủ đa dạng, thay vì ba dòng "test 1, test 2"
- Kiểm thử giao diện với dữ liệu dài ngắn khác nhau — cách nhanh nhất để lộ bố cục vỡ
- Ảnh chụp màn hình cho hồ sơ năng lực mà không lộ dữ liệu người dùng thật

### Lưu ý
Đặt hạt giống ngẫu nhiên cố định trong kiểm thử, nếu không kết quả đổi mỗi lần chạy và bản kiểm thử trở nên chập chờn.`,
  },
  {
    slug: 'Kong/insomnia',
    tags: ['API', 'Tooling'],
    review: `Ứng dụng thử API cho máy tính: REST, GraphQL, gRPC, WebSocket, có biến môi trường, chuỗi request nối nhau và mã hoá bí mật. Nhẹ và gọn hơn các bộ công cụ nặng nề.

### Dùng vào việc gì
- Bộ sưu tập request cho toàn bộ API của bạn, chia theo môi trường local và sản phẩm
- Chuỗi kiểm thử: đăng nhập lấy token rồi tự truyền sang các request sau
- Xuất bộ sưu tập vào kho mã để người sau biết API dùng thế nào

### Lưu ý
Cẩn thận với việc đồng bộ đám mây khi bộ sưu tập chứa token thật. Bật mã hoá hoặc để chế độ chỉ lưu cục bộ.`,
  },
  {
    slug: 'catamphetamine/libphonenumber-js',
    tags: ['JavaScript', 'Utility'],
    review: `Bản rút gọn của thư viện xử lý số điện thoại của Google, nhẹ hơn nhiều lần. Kiểm tra và định dạng số điện thoại theo từng quốc gia — bài toán nhìn đơn giản nhưng tự viết luôn sai.

### Dùng vào việc gì
- Kiểm tra số điện thoại lúc đăng ký, chấp nhận cả cách viết có mã vùng lẫn số nội địa
- Chuẩn hoá về một dạng duy nhất trước khi lưu, để tra cứu và so trùng không trượt
- Định dạng lại khi hiển thị cho dễ đọc

### Lưu ý
Đừng tự viết biểu thức chính quy cho số điện thoại. Đầu số ở Việt Nam đã đổi vài lần, mọi biểu thức viết tay đều lỗi thời sau vài năm.`,
  },
  {
    slug: 'typicode/jsonplaceholder',
    tags: ['API', 'Testing'],
    review: `API giả trực tuyến quen thuộc nhất: bài viết, bình luận, người dùng, ảnh, việc cần làm — không cần khoá, không cần đăng ký. Điểm khởi đầu chuẩn cho mọi bài dạy gọi API.

### Dùng vào việc gì
- Bài học về lấy dữ liệu, phân trang, xử lý lỗi mà người học chạy được ngay
- Kiểm tra nhanh một máy khách HTTP hoặc bộ chặn mới viết có chạy đúng không
- Nguồn dữ liệu mẫu cho bản thử giao diện

### Lưu ý
Đây là kho mã của dịch vụ đó — đọc để thấy một API giả cần những gì, rồi tự dựng bản riêng khi cần dữ liệu đúng nghiệp vụ của mình.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CÔNG CỤ DÒNG LỆNH · NĂNG SUẤT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'BurntSushi/ripgrep',
    tags: ['CLI', 'Rust', 'Tooling'],
    review: `Công cụ tìm chuỗi trong mã nguồn nhanh hơn hẳn \`grep\`, tự bỏ qua những gì \`.gitignore\` liệt kê. Trên một kho mã cỡ dự án này, khác biệt là từ vài giây xuống vài chục mili giây.

### Dùng vào việc gì
- Truy một biến, một route, một chuỗi hiển thị qua toàn bộ kho mã
- Tìm theo loại tệp: chỉ trong \`.tsx\`, chỉ trong \`.prisma\`
- Ghép với công cụ lọc tương tác để nhảy thẳng tới dòng cần sửa

### Lưu ý
Nhớ bài học đã trả giá: \`grep\` trên máy bạn có thể đang bị bọc bởi một lớp khác. Khi cần con số chính xác thì gọi bằng đường dẫn tuyệt đối, đừng tin cái tên trần.`,
  },
  {
    slug: 'junegunn/fzf',
    tags: ['CLI', 'Go', 'Tooling'],
    review: `Bộ lọc mờ tương tác cho dòng lệnh: đưa bất cứ danh sách nào vào, gõ vài ký tự là lọc ra thứ cần. Nghe nhỏ nhưng nó đổi hẳn cách dùng terminal — không cần nhớ chính xác nữa, chỉ cần nhớ mang máng.

### Dùng vào việc gì
- Mở file, chuyển nhánh Git, tìm lại lệnh đã gõ, chọn container Docker
- Ghép với công cụ tìm chuỗi: tìm trong nội dung rồi lọc tiếp bằng bộ lọc mờ
- Xem trước nội dung ngay trong khung chọn, khỏi mở rồi đóng

### Bắt đầu từ đâu
Cài phím tắt tìm lại lịch sử lệnh và mở file trước. Riêng hai cái đó đã tiết kiệm được rất nhiều thao tác mỗi ngày.`,
  },
  {
    slug: 'jesseduffield/lazygit',
    tags: ['CLI', 'Git', 'Go'],
    review: `Giao diện terminal cho Git: xem thay đổi, chọn từng dòng để đưa vào commit, xử lý xung đột, sửa lịch sử — tất cả bằng phím. Nhanh hơn cả gõ lệnh lẫn mở ứng dụng đồ hoạ.

### Dùng vào việc gì
- Chọn lọc từng phần thay đổi để tách thành nhiều commit sạch sẽ
- Xem lịch sử nhánh, so sánh, chọn lấy commit lẻ mà không phải nhớ cú pháp
- Gỡ rối khi lỡ tay: hoàn tác, lưu tạm, sửa commit gần nhất

### Lưu ý
Nó khiến việc sửa lịch sử trở nên quá dễ. Nhánh riêng thì thoải mái, nhưng đã đẩy lên nhánh chung thì tuyệt đối không ghi đè lịch sử.`,
  },
  {
    slug: 'sharkdp/bat',
    tags: ['CLI', 'Rust'],
    review: `Bản thay thế \`cat\` có tô màu cú pháp, hiện số dòng và tích hợp Git để đánh dấu dòng vừa đổi. Cùng công dụng nhưng đọc dễ hơn nhiều, nhất là với file cấu hình dài.

### Dùng vào việc gì
- Xem nhanh file mã nguồn ngay trong terminal mà vẫn có màu
- Dùng làm bộ hiển thị xem trước cho bộ lọc mờ
- Xem file JSON, YAML, Dockerfile mà mắt không phải tự phân tích cú pháp

### Lưu ý
Trong kịch bản tự động thì vẫn dùng \`cat\` — mã màu chèn vào sẽ làm hỏng đầu ra khi nối ống sang lệnh khác.`,
  },
  {
    slug: 'sharkdp/fd',
    tags: ['CLI', 'Rust'],
    review: `Bản thay thế \`find\` với cú pháp con người đọc được: gõ tên là tìm, không cần chuỗi tham số dài. Mặc định bỏ qua thư mục ẩn và những gì Git bỏ qua, nên kết quả sạch ngay.

### Dùng vào việc gì
- Tìm file theo tên hoặc phần mở rộng nhanh gọn
- Lọc theo thời gian sửa: tìm những gì vừa đụng vào hôm nay
- Chạy lệnh trên từng kết quả, thay cho cú pháp thực thi khó nhớ của \`find\`

### Lưu ý
Vì mặc định bỏ qua file ẩn, đôi khi tưởng file không tồn tại. Cần tìm tất thì phải bật cờ tương ứng.`,
  },
  {
    slug: 'ajeetdsouza/zoxide',
    tags: ['CLI', 'Rust'],
    review: `Lệnh chuyển thư mục biết học thói quen: nhớ những nơi bạn hay tới, sau đó chỉ cần gõ một mẩu tên là nhảy đúng chỗ. Bỏ hẳn thói quen gõ đường dẫn dài hoặc lùi thư mục nhiều cấp.

### Dùng vào việc gì
- Nhảy giữa thư mục gốc dự án, thư mục frontend, thư mục kịch bản chỉ bằng vài ký tự
- Ghép với bộ lọc mờ để chọn trong danh sách thư mục hay dùng
- Chạy được trên mọi shell phổ biến

### Lưu ý
Nó chỉ nhớ nơi bạn đã từng tới. Vài ngày đầu còn ngơ ngác, sau đó mới thật sự hữu dụng.`,
  },
  {
    slug: 'ohmyzsh/ohmyzsh',
    tags: ['CLI', 'Shell'],
    review: `Bộ khung cấu hình zsh với hàng trăm plugin và chủ đề: tự động gợi ý, tô màu cú pháp lệnh, viết tắt cho Git và Docker. Cấu hình một lần, hưởng mỗi ngày.

### Dùng vào việc gì
- Tự động gợi ý lệnh từ lịch sử — thứ tiết kiệm gõ phím nhiều nhất
- Plugin Git và Docker rút gọn những lệnh dài hay dùng
- Dấu nhắc hiện nhánh Git và trạng thái, khỏi phải gõ lệnh kiểm tra

### Lưu ý
Bật quá nhiều plugin làm shell khởi động chậm thấy rõ. Giữ dưới mười plugin và đo lại thời gian mở terminal nếu thấy ì.`,
  },
  {
    slug: 'tldr-pages/tldr',
    tags: ['CLI', 'Learning'],
    review: `Trang trợ giúp rút gọn cho lệnh terminal: thay vì cuộn hết tài liệu dài, bạn nhận năm ví dụ thực dụng nhất. Đúng thứ cần khi biết lệnh nào cần dùng nhưng quên cú pháp.

### Dùng vào việc gì
- Tra nhanh cú pháp \`tar\`, \`ffmpeg\`, \`docker\`, \`rsync\` — những lệnh không ai nhớ hết tham số
- Học lệnh mới bằng ví dụ thật, nhanh hơn đọc tài liệu đầy đủ
- Có bản chạy ngoại tuyến, tra được cả khi mất mạng

### Lưu ý
Chỉ nêu trường hợp phổ biến. Việc lạ thì vẫn phải mở tài liệu đầy đủ — cái này thay việc tra cứu hằng ngày, không thay tài liệu gốc.`,
  },
  {
    slug: 'eza-community/eza',
    tags: ['CLI', 'Rust'],
    review: `Bản thay thế \`ls\` hiện đại: màu theo loại tệp, hiện trạng thái Git, vẽ được cây thư mục, đọc được kích thước ở dạng dễ hiểu. Cùng thao tác cũ nhưng thông tin thu về nhiều hơn hẳn.

### Dùng vào việc gì
- Xem thư mục kèm trạng thái Git ngay trên danh sách file
- Vẽ cây thư mục có giới hạn độ sâu, nhanh hơn cài thêm công cụ riêng
- Sắp theo thời gian sửa để biết mình vừa đụng vào cái gì

### Lưu ý
Đặt bí danh đè lên \`ls\` thì nhớ rằng kịch bản dùng \`ls\` vẫn chạy lệnh gốc. Đừng viết kịch bản dựa trên định dạng đầu ra của công cụ này.`,
  },
  {
    slug: 'charmbracelet/gum',
    tags: ['CLI', 'Go', 'Shell'],
    review: `Bộ mảnh ghép để làm kịch bản shell có giao diện tương tác: ô nhập, danh sách chọn, hộp xác nhận, con quay chờ, chữ có định dạng. Biến kịch bản khô khan thành công cụ dùng được cho người khác.

### Dùng vào việc gì
- Thêm bước xác nhận cho các kịch bản nguy hiểm — như hỏi lại trước khi triển khai
- Menu chọn môi trường, chọn dịch vụ thay vì bắt nhớ tham số
- Hiện con quay chờ cho các bước chạy lâu, để biết kịch bản còn sống

### Lưu ý
Chỉ thêm phần tương tác vào kịch bản chạy tay. Kịch bản chạy trong CI phải giữ đường không tương tác, nếu không nó sẽ treo chờ người bấm phím.`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3D · TRÒ CHƠI · ĐỒ HOẠ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: 'mrdoob/three.js',
    tags: ['3D', 'Graphics', 'JavaScript'],
    review: `Thư viện 3D cho web, nền tảng của sân chơi 3D trên trang bạn. Kho ví dụ chính thức là tài sản lớn nhất: hàng trăm bản trình diễn chạy được, mỗi cái minh hoạ đúng một kỹ thuật.

### Dùng vào việc gì
- Tra kỹ thuật cụ thể qua ví dụ: đổ bóng, ánh sáng, thực thể hoá, mức chi tiết theo khoảng cách, hậu xử lý
- Tối ưu hiệu năng: gộp lệnh vẽ, nén kết cấu, cắt bớt vật thể ngoài tầm nhìn
- Đối chiếu khi cảnh chạy chậm mà chưa rõ nút thắt nằm ở đâu

### Lưu ý
Ghi nhớ bẫy đã mất hai phiên để tìm ra: đổi file trong thư mục tài nguyên tĩnh thì phải khởi động lại máy chủ Next, và diệt tiến trình theo cổng chứ không theo tên — tên tiến trình bị đổi nên lệnh diệt trượt, máy chủ cũ vẫn sống và mọi thứ trông như bất trị.`,
  },
  {
    slug: 'pmndrs/react-three-fiber',
    tags: ['3D', 'React', 'Three.js'],
    review: `Cầu nối để viết cảnh 3D bằng cú pháp React: cảnh trở thành cây component, trạng thái quản lý như mọi phần khác của ứng dụng. Không mất hiệu năng vì nó chỉ điều phối, phần vẽ vẫn do thư viện 3D lo.

### Dùng vào việc gì
- Dựng cảnh theo lối khai báo, ghép được với trạng thái toàn cục của ứng dụng
- Tách cảnh thành component tái dùng: một hòn đảo, một con tàu, một sinh vật
- Ghép giao diện HTML với cảnh 3D mà không phải tự đồng bộ hai thế giới

### Lưu ý
Đừng đặt trạng thái đổi mỗi khung hình vào React — mỗi lần đổi là một lượt render. Trạng thái theo khung hình phải nằm trong tham chiếu trực tiếp hoặc store ngoài.`,
  },
  {
    slug: 'pmndrs/drei',
    tags: ['3D', 'React', 'Three.js'],
    review: `Bộ trợ thủ cho cảnh 3D viết bằng React: điều khiển máy quay, tải mô hình, môi trường ánh sáng, chữ, hiệu ứng, khung cảnh chờ. Những thứ ai cũng phải viết lại, nay có sẵn và đã tối ưu.

### Dùng vào việc gì
- Điều khiển máy quay và bộ trợ giúp gỡ lỗi, tiết kiệm hàng trăm dòng thiết lập
- Nạp mô hình có nén, kèm bộ đệm và trạng thái chờ
- Hiệu ứng sẵn dùng: phản chiếu, bóng mờ, ánh sáng chói

### Lưu ý
Đừng nhập cả gói. Nhập từng phần đang dùng, nếu không bundle phình rất nhanh — điều rất dễ nhận ra trên máy yếu.`,
  },
  {
    slug: 'dimforge/rapier.js',
    tags: ['3D', 'Game'],
    review: `Bộ mô phỏng vật lý viết bằng Rust, biên dịch sang WebAssembly để chạy trong trình duyệt. Nhanh, tất định — cùng đầu vào cho cùng kết quả, điều kiện cần nếu muốn đồng bộ vật lý giữa nhiều người chơi.

### Dùng vào việc gì
- Va chạm, trọng lực, điều khiển nhân vật trong sân chơi 3D
- Địa hình cao thấp: dùng một hàm cao độ duy nhất thay vì ghép hộp nghiêng
- Khớp nối và ràng buộc cho cơ cấu cơ khí — dùng được cho phần mô phỏng robot

### Lưu ý
Đúng cái bẫy đã gặp: thứ tự chiều của lưới cao độ là hàng theo trục Z rồi mới tới cột theo trục X. Đảo nhầm thì địa hình trông vẫn hợp lý nhưng va chạm lệch hẳn.`,
  },
  {
    slug: 'google/model-viewer',
    tags: ['3D', 'Frontend'],
    review: `Thẻ web component hiển thị mô hình 3D chỉ bằng một dòng HTML, có sẵn thực tế tăng cường trên di động, ánh sáng môi trường và điều khiển máy quay. Khi chỉ cần **xem** một mô hình chứ không cần cả một cảnh, đây là con đường ngắn nhất.

### Dùng vào việc gì
- Xem trước mô hình linh kiện, bộ vỏ in 3D ngay trong trang tài liệu kỹ thuật
- Nút xem trong không gian thật trên điện thoại, không cần ứng dụng riêng
- Nhúng mô hình vào bài viết mà không kéo cả thư viện 3D vào trang

### Lưu ý
Vẫn nên nén mô hình trước khi đưa lên. Một file mô hình chưa nén vài chục megabyte sẽ giết trải nghiệm trên mạng di động.`,
  },
  {
    slug: 'KhronosGroup/glTF-Sample-Models',
    tags: ['3D', 'Data'],
    review: `Bộ mô hình mẫu chính thức của định dạng glTF, mỗi mô hình dựng ra để thử một tính năng: vật liệu, hoạt ảnh, lưới bọc xương, nén, ánh sáng. Đây là bộ dữ liệu chuẩn để kiểm trình hiển thị của mình.

### Dùng vào việc gì
- Kiểm tra pipeline tải mô hình: nếu mô hình mẫu hiện sai thì lỗi ở phía bạn, không phải ở file
- So sánh dung lượng và chất lượng trước sau khi nén
- Nguồn mô hình dùng thử hợp lệ khi làm bản mẫu

### Lưu ý
Đây là mô hình để kiểm thử, không phải tài nguyên cho sản phẩm. Mô hình dùng trong sân chơi phải ghi rõ nguồn và giấy phép — món nợ ghi công vẫn còn treo ở đó.`,
  },
  {
    slug: 'excalidraw/excalidraw',
    tags: ['Graphics', 'Tooling', 'React'],
    review: `Bảng vẽ trực tuyến nét kiểu tay, hợp tác nhiều người, dữ liệu mã hoá đầu cuối. Vừa là công cụ vẽ sơ đồ hằng ngày, vừa là một kho mã React đáng học vì phần vẽ canvas và đồng bộ thời gian thực.

### Dùng vào việc gì
- Vẽ sơ đồ kiến trúc, luồng dữ liệu cho bài viết và tài liệu dự án
- Nét vẽ tay khiến bản nháp trông đúng là bản nháp, người xem góp ý thoải mái hơn
- Đọc source để học cách xử lý canvas hiệu năng cao và đồng bộ nhiều con trỏ

### Lưu ý
Nhúng thư viện của họ vào trang được, nhưng gói khá nặng. Nếu chỉ cần hiện sơ đồ tĩnh thì xuất ra ảnh vector là đủ.`,
  },
  {
    slug: 'konvajs/konva',
    tags: ['Graphics', 'JavaScript', 'Frontend'],
    review: `Thư viện canvas hai chiều có mô hình cây đối tượng: hình khối trở thành đối tượng có sự kiện, kéo thả và hoạt ảnh, thay vì tự vẽ lại từng khung hình. Có sẵn lớp bọc cho React.

### Dùng vào việc gì
- Trình chỉnh sửa ảnh, công cụ cắt cúp, chèn chữ lên ảnh
- Sơ đồ kéo thả được, trình dựng bố cục
- Vẽ dữ liệu tương tác khi số phần tử vượt quá sức của SVG

### Lưu ý
Vượt vài nghìn hình thì phải chia lớp và bật bộ đệm, nếu không khung hình rớt thấy rõ. Đây là ranh giới giữa canvas hai chiều và cách dựng bằng bộ xử lý đồ hoạ.`,
  },
  {
    slug: 'pixijs/pixijs',
    tags: ['Game', 'Graphics', 'JavaScript'],
    review: `Bộ dựng hình hai chiều tăng tốc bằng bộ xử lý đồ hoạ, nhanh nhất trong hạng của nó trên web. Hợp cho trò chơi hai chiều, hiệu ứng hạt, trực quan hoá dữ liệu lớn — chỗ mà canvas thường và SVG đã đuối.

### Dùng vào việc gì
- Trò chơi hai chiều và trò chơi nhỏ trong module Thư viện Game của bạn
- Hiệu ứng hạt và hoạt cảnh nền vẫn giữ được 60 khung hình
- Vẽ hàng chục nghìn điểm dữ liệu mà không nghẽn trình duyệt

### Lưu ý
Hiệu năng đến từ việc gộp lệnh vẽ. Trộn quá nhiều kết cấu rời sẽ phá mất phần gộp đó — dùng bản đồ gộp ảnh (sprite sheet) cho tài nguyên trò chơi.`,
  },
];
