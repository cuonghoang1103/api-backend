/**
 * Lập trình với AI — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026; SOẠN TRỌN từ 15/11/2026 (kế hoạch: video-bai-giang/KE-HOACH-AI-CODING.md).
 * Mục tiêu (chủ kênh 15/11): dùng AI để code nhanh nhưng vẫn tự hiểu, tự đọc và kiểm soát code AI viết, tự vận hành như tech lead — từ số 0 tới chuyên sâu.
 * Ranh giới: khoá này DÙNG AI để viết code. Xây tính năng AI ⇒ /courses/llm-apps · RAG ⇒ /courses/rag-vector-search · tự viết agent ⇒ /courses/ai-agents.
 *
 * Chương ĐÃ SOẠN nằm ở ai-coding/sNN-*.mjs (bài song ngữ đầy đủ + slide + đo thật). Chương CHƯA soạn vẫn sinh bằng khung() — đề cương bên dưới chính là
 * "bài này sẽ dạy" trên web. ⚠ Seeder KHÔNG xoá bài và neo chương theo slug bài ĐẦU ⇒ không đổi slug bài đã lên prod, không chuyển bài sang chương khác.
 * khung() đánh số bài theo vị trí (bài 'bat-dau…' mang số 8/9) — mảng dưới đây phải giữ nguyên thứ tự + tên để slug không trôi.
 * Model, giá, giới hạn đổi rất nhanh — khi soạn chi tiết kiểm trang chính thức và ghi mốc thời gian.
 */
import { khung } from './_chung/khung.mjs';
import s00 from './ai-coding/s00-bat-dau.mjs';

/** Bài ĐÃ SOẠN (sNN.lessons, cùng slug) thay bài khung cùng slug; bài chưa soạn giữ khung. Tiêu đề/mô tả chương lấy từ khung (seeder neo chương bằng slug bài đầu). */
const ghep = (sec, soan) => { const m = new Map(soan.lessons.map((l) => [l.slug, l])); for (const l of soan.lessons) if (!sec.lessons.some((x) => x.slug === l.slug)) throw new Error(`ai-coding: bài soạn ${l.slug} không có trong khung`); return { ...sec, lessons: sec.lessons.map((l) => m.get(l.slug) ?? l) }; };

const K = khung('ai', [
  ['Section 0 — AI as an engineering tool', 'Mục 0 — AI như một công cụ kỹ thuật', 'Bắt đầu tại đây: LLM và agent là gì, khi AI làm sai, LLM hoạt động thế nào, chọn công cụ, và dự án lab xuyên khoá.', [
    ['bat-dau-tai-day', 'Start here (1/2) — What LLMs and coding agents are, and how this course keeps you in control', 'Bắt đầu tại đây (1/2) — LLM và agent viết code là gì, và khoá này giúp bạn làm chủ nó ra sao', 'Bàn phím điện thoại đoán chữ ⇒ LLM · Thợ phụ có tay chân ⇒ agent · Công ty dùng AI thế nào, nhà tuyển dụng hỏi gì · Mục tiêu: nhanh hơn mà vẫn tự hiểu, như tech lead'],
    ['bat-dau-khi-khong-co', 'Start here (2/2) — When AI goes wrong: real incidents, three traps, and learning without outsourcing your brain', 'Bắt đầu tại đây (2/2) — Khi AI làm sai: sự cố thật, ba cái bẫy, và học mà không giao não cho máy', 'Sự cố thật của chính kho này · Gói bịa tên, lệnh ẩn trong README, khoá lộ trong lịch sử git · Luật học: tự làm trước, tự giải thích được · Lộ trình khoá'],
    ['llm-hoat-dong', 'How LLMs work — just enough to use them well', 'LLM hoạt động thế nào — vừa đủ để dùng giỏi', 'Token và bộ tách token (đo thật tiếng Việt vs tiếng Anh) · Đoán chữ kế tiếp và temperature · Cửa sổ ngữ cảnh: quên đầu, lẫn giữa · Vì sao nó "bịa" mà vẫn trôi chảy · Mốc kiến thức (knowledge cutoff)'],
    ['chon-cong-cu', 'The tool landscape: chat, IDE suggestions, agents, APIs', 'Bản đồ công cụ: chat, gợi ý trong IDE, agent, API', 'Bốn kiểu công cụ và việc hợp với từng kiểu · Quyền: chỉ gợi ý vs được sửa tệp, chạy lệnh · Gói thuê bao vs trả theo token · Chọn theo việc, không theo quảng cáo · Công cụ miễn phí để học (kể cả CuongMini của web)'],
    ['du-an-lab', 'The course lab project and a safe environment', 'Dự án lab xuyên khoá và môi trường an toàn', 'Repo datlich: API đặt lịch phòng học nhóm (Node 22 + node:test) · Nhánh riêng, commit nhỏ, test xanh trước khi giao việc · .env giả, không khoá thật · Checklist tech lead dùng suốt khoá'],
  ]],
  ['Chapter 1 — Working with a coding agent', 'Chương 1 — Làm việc với agent viết code', 'Giao việc, bộ nhớ dự án, quyền và git — như dẫn một thực tập sinh làm trong repo thật.', [
    ['bat-dau', 'Your first session with a coding agent', 'Buổi làm việc đầu tiên với agent', 'Cài và đăng nhập · Chế độ quyền: hỏi trước vs tự làm · Cho agent đọc repo rồi tóm tắt lại · Giao một việc nhỏ có test · Đọc diff trước khi nhận'],
    ['giao-viec', 'Writing good task descriptions', 'Viết mô tả việc tốt', 'Như giao việc cho thực tập sinh ngày đầu · Mục tiêu · Ràng buộc · Tệp liên quan · Lệnh kiểm · Tiêu chí xong · So hai lần giao: mơ hồ vs rõ ràng'],
    ['bo-nho-du-an', 'Project memory: CLAUDE.md, AGENTS.md and conventions', 'Bộ nhớ dự án: CLAUDE.md / AGENTS.md và quy ước', 'CLAUDE.md thật của cuongthai.com: luật cấm, lệnh kiểm, bài học sự cố · Ngắn và đúng hơn dài và cũ · Bộ nhớ theo thư mục · Khi nào ghi một bài học mới'],
    ['an-toan', 'Keeping your repo safe', 'Giữ repo an toàn', 'Chế độ quyền và danh sách lệnh cho phép · Nhánh riêng · Không commit bí mật (gitleaks trong pre-commit) · Agent đọc .env rồi in ra log — góc kẻ xấu · Xem diff trước khi nhận'],
    ['git-voi-agent', 'Git as the safety net when working with an agent', 'Git là lưới an toàn khi làm với agent', 'Commit nhỏ làm điểm lưu · Xem lại, hoàn tác, revert · Worktree cho từng luồng việc · Sự cố thật: hai phiên dùng chung .git/index, commit cuốn theo tệp của phiên khác'],
  ]],
  ['Chapter 2 — Verifying AI-written code', 'Chương 2 — Kiểm chứng code AI viết', 'Tin nhưng phải kiểm: review, test, thứ bịa, bảo mật — và hiểu tới mức tự giải thích.', [
    ['review', 'Reviewing AI code like a senior', 'Review code AI như một senior', 'Đọc diff từ tổng quan tới từng dòng · Hỏi vì sao · Mùi code AI: thừa, đoán, nuốt lỗi, sửa lan · Checklist review'],
    ['test', 'Tests as the contract', 'Test là hợp đồng', 'Viết test trước rồi giao AI · Agent sửa test cho xanh — bẫy kinh điển · Test biên, test lỗi · Trỏ khoá Testing'],
    ['ao-giac', 'Hallucinated APIs, packages and facts (slopsquatting)', 'API, gói và dữ kiện bịa (slopsquatting)', 'Gói không tồn tại và gói tên na ná đã có người đăng ký · Kiểm tồn tại, tuổi, lượt tải trước khi cài · Tham số/hàm không có trong phiên bản bạn dùng · Kiểm nguồn'],
    ['bao-mat', 'Security review of generated code', 'Rà soát bảo mật code sinh ra', 'Injection, IDOR, lộ bí mật, CORS mở toang trong mã sinh ra · Công cụ quét tự động · Trỏ khoá Bảo mật web'],
    ['tu-giai-thich', 'Understand it well enough to explain it', 'Hiểu tới mức tự giải thích được', 'Bài kiểm "tắt AI, viết lại phần lõi" · Giải thích từng dòng bằng lời của mình · Vẽ luồng dữ liệu · Khi nào được phép nhận mã mình chưa hiểu hết'],
  ]],
  ['Chapter 3 — Learning faster with AI', 'Chương 3 — Học nhanh hơn với AI', 'Dùng AI làm gia sư, không làm hộ.', [
    ['gia-su', 'AI as a tutor, not a ghostwriter', 'AI là gia sư, không phải người làm hộ', 'Bài tập về nhà: hỏi gợi ý chứ không xin đáp án · Tự làm trước · Kiểm hiểu bằng câu hỏi ngược · Quy định học thuật của trường'],
    ['doc-code', 'Reading unfamiliar codebases with AI', 'Đọc codebase lạ cùng AI', 'Ngày đầu đi làm: bản đồ repo · Lần theo luồng dữ liệu · Bắt AI chỉ tệp:dòng, rồi tự mở kiểm'],
    ['go-loi', 'Debugging with AI', 'Gỡ lỗi cùng AI', 'Đưa đủ ngữ cảnh: lỗi nguyên văn, lệnh, phiên bản · Giả thuyết → kiểm chứng · Khi AI đoán mò vòng vòng'],
    ['tieng-anh', 'Technical English with AI', 'Tiếng Anh kỹ thuật với AI', 'Đọc tài liệu gốc · Viết PR/commit/issue · Luyện phỏng vấn kỹ thuật'],
  ]],
  ['Chapter 4 — Agents beyond the chat window: CLI, scripts, CI', 'Chương 4 — Agent ngoài cửa sổ chat: CLI, script, CI', 'Dùng agent viết code ngoài giao diện chat: CLI, chế độ không tương tác, CI, đầu ra có cấu trúc. Muốn XÂY tính năng AI ⇒ khoá LLM Apps.', [
    ['api-dau-tien', 'Agents through the CLI and SDK — when the chat window is not enough (building AI features → LLM Apps)', 'Agent qua CLI và SDK: khi nào cửa sổ chat không đủ (xây tính năng AI → khoá LLM Apps)', 'Khoá này dạy DÙNG AI để viết code, không dạy xây sản phẩm AI · Khoá API để ở server, system prompt, tin nhắn — một câu mỗi thứ · Gọi API, streaming, output có cấu trúc học sâu ở /courses/llm-apps · Điều khiển agent viết code qua CLI/SDK'],
    ['streaming', 'Running a coding agent headless: scripts and CI', 'Chạy agent viết code không giao diện: script và CI', 'Chế độ không tương tác (headless, -p) · Đọc output dạng dòng (stream-json) để theo dõi tiến độ · Gắn vào GitHub Actions: tự sửa lint, tự viết mô tả PR · Giới hạn quyền, số bước và thời gian khi không có người trông'],
    ['cau-truc', 'Asking for structured results: patches, checklists and JSON reports', 'Đòi kết quả có cấu trúc: bản vá, checklist và báo cáo JSON', 'Bắt agent trả diff thay vì đoạn văn · Báo cáo review dạng JSON để script đọc · Kiểm đầu ra bằng lệnh thật (tsc, test) chứ không bằng mắt · Schema/Zod cho output trong sản phẩm → /courses/llm-apps Ch4'],
    ['loi-gioi-han', 'Limits, quotas and running out mid-task with a coding agent', 'Hạn mức, quota và hết lượt giữa chừng khi dùng agent viết code', 'Gói thuê bao vs trả theo token · Phiên dài ăn ngữ cảnh: khi nào dọn, khi nào chia việc · Hết hạn mức giữa chừng: ghi bàn giao để phiên sau làm tiếp · Retry/429 trong sản phẩm → /courses/llm-apps Ch6'],
  ]],
  ['Chapter 5 — Prompting for coding work', 'Chương 5 — Prompt cho việc viết code', 'Prompt = phiếu giao việc: chỉ đúng mẫu, lưu prompt dùng lại trong repo.', [
    ['nguyen-tac', 'Prompt principles for coding tasks (product prompts → LLM Apps)', 'Nguyên tắc prompt cho việc viết code (prompt cho sản phẩm → khoá LLM Apps)', 'Giao việc cho agent khác prompt chạy trong sản phẩm · Mục tiêu, tệp liên quan, lệnh kiểm, tiêu chí xong · Mẫu giao việc dùng lại được · Prompt cho người dùng cuối → /courses/llm-apps Ch2'],
    ['few-shot', 'Showing examples: pointing the agent at code to imitate', 'Đưa ví dụ: chỉ agent tới đoạn code mẫu cần bắt chước', 'Trỏ tệp mẫu thay vì mô tả bằng lời · Quy ước đặt tên và cấu trúc thư mục · Tránh agent chép nhầm mẫu cũ đã lỗi thời · Ví dụ: thêm một route mới theo đúng route có sẵn'],
    ['phien-ban', 'Reusable prompts in the repo: custom commands, skills and CLAUDE.md', 'Prompt dùng lại trong repo: lệnh tuỳ biến, skill và CLAUDE.md', 'Lệnh tuỳ biến cho việc lặp lại (review, viết test, phát hành) · Hướng dẫn theo thư mục · Prompt có phiên bản cùng code, review qua PR · Kiểm prompt bằng cách chạy lại trên việc cũ'],
    ['da-ngon-ngu', 'Working with AI in Vietnamese and English: comments, commits, docs', 'Làm việc với AI bằng tiếng Việt và tiếng Anh: chú thích, commit, tài liệu', 'Giao việc bằng tiếng Việt, code và commit bằng tiếng Anh — chọn quy ước cho nhóm · Thuật ngữ nhất quán giữa code và giao diện · Bẫy chuỗi có dấu: mã hoá, regex ranh giới từ · Ứng dụng AI song ngữ cho người dùng → /courses/llm-apps'],
  ]],
  ['Chapter 6 — Tools, MCP and guardrails', 'Chương 6 — Tool, MCP và rào chắn', 'Agent viết code dùng tool, MCP và rào chắn ra sao. Tự xây agent ⇒ khoá AI Agents.', [
    ['tool-use', 'How a coding agent uses tools: read, edit, run (building agents → AI Agents)', 'Agent viết code dùng tool thế nào: đọc, sửa, chạy (tự xây agent → khoá AI Agents)', 'Đọc nhật ký tool để biết agent đã làm gì · Vì sao agent chạy lệnh rồi tự sửa lỗi · Đọc hiểu đủ để giám sát, không cần tự viết · Vòng lặp tool và thiết kế tool → /courses/ai-agents Ch1–2'],
    ['agent', 'Delegating multi-step work: plans, subagents and checkpoints', 'Giao việc nhiều bước: kế hoạch, agent con và điểm dừng kiểm', 'Bắt agent lập kế hoạch trước khi sửa · Chia việc lớn thành bước có lệnh kiểm · Agent con song song: khi nào lợi, khi nào giẫm chân nhau · Worktree riêng cho mỗi luồng việc'],
    ['mcp', 'Plugging MCP servers into your coding agent', 'Cắm MCP server vào agent viết code', 'MCP = ổ cắm chuẩn · Dùng MCP có sẵn: GitHub, CSDL, trình duyệt · Cho agent đọc issue và tài liệu thật thay vì đoán · Rủi ro của MCP bên thứ ba · Tự viết MCP server → /courses/ai-agents Ch3'],
    ['an-toan', 'Guardrails when the agent runs commands on your machine', 'Rào chắn khi agent chạy lệnh trên máy bạn', 'Danh sách lệnh cho phép/cấm · Hook chặn lệnh nguy hiểm (xoá, force push, reset CSDL) · Sandbox, container, worktree · Sự cố thật: agent gửi email thật lúc chạy thử · Guardrail trong sản phẩm → /courses/ai-agents Ch6'],
  ]],
  ['Chapter 7 — Context: how an agent finds the right code', 'Chương 7 — Ngữ cảnh: agent tìm đúng code thế nào', 'Mớm đúng ngữ cảnh cho agent, hỏi đáp trên chính codebase. Tự xây RAG ⇒ khoá RAG.', [
    ['embedding', 'How coding assistants find the right code (RAG itself → RAG & Vector Search)', 'Trợ lý code tìm đúng đoạn code thế nào (học RAG → khoá RAG & Vector Search)', 'Embedding là gì trong một câu · Tìm có chủ đích (grep) vs chỉ mục vector của IDE · Vì sao agent đôi khi "không thấy" tệp · Embedding, chunking, pgvector học sâu ở /courses/rag-vector-search'],
    ['pgvector', 'Feeding the agent the right context: files, docs and references', 'Mớm đúng ngữ cảnh cho agent: tệp, tài liệu, tham chiếu', 'Chỉ đích danh tệp thay vì để nó tự đoán · Đưa tài liệu thư viện đúng phiên bản (llms.txt, MCP tài liệu) · Ngữ cảnh quá dài làm chất lượng giảm · pgvector trong sản phẩm → /courses/rag-vector-search Ch3'],
    ['rag', 'Q&A over your own codebase: asking the agent to explain and locate', 'Hỏi đáp trên chính codebase của bạn: nhờ agent giải thích và chỉ chỗ', 'Câu hỏi "chỗ nào xử lý X?" · Bắt agent trích tệp:dòng làm bằng chứng · Kiểm lại trích dẫn bằng cách mở tệp · Sơ đồ luồng dữ liệu do AI vẽ — tin tới đâu'],
    ['cai-thien', 'Keeping the agent’s context fresh: conventions, lessons and stale docs', 'Giữ ngữ cảnh của agent luôn mới: quy ước, bài học và tài liệu cũ', 'Model không biết phiên bản thư viện mới nhất · Ghi quy ước và bài học sự cố vào bộ nhớ dự án · Dọn tài liệu cũ đánh lừa agent · Đo xem agent còn lặp lại lỗi cũ không'],
  ]],
  ['Chapter 8 — Evaluation, cost, safety and team process', 'Chương 8 — Đánh giá, chi phí, an toàn và quy trình nhóm', 'AI có thật làm bạn nhanh hơn không, tốn bao nhiêu, rủi ro bảo mật/pháp lý, và vận hành nhóm có AI như tech lead.', [
    ['evals', 'Measuring whether AI really makes you faster (product evals → AI Agents, MLOps)', 'Đo xem AI có thật làm bạn nhanh hơn (eval cho sản phẩm → khoá AI Agents, MLOps)', 'Thời gian tới khi PR được merge, số lần phải sửa lại · Bộ việc mẫu để so công cụ và model · Nghiên cứu thật về năng suất khi dùng AI · Eval cho sản phẩm AI → /courses/ai-agents Ch7–8 và /courses/mlops-llmops Ch9'],
    ['chi-phi', 'The cost of AI-assisted development for you and your team', 'Chi phí phát triển có AI hỗ trợ cho bạn và nhóm', 'Thuê bao theo người vs API theo token · Chọn model theo độ khó của việc · Ngữ cảnh dài là tiền · Chi phí của tính năng AI trong sản phẩm → /courses/llm-apps Ch6'],
    ['injection', 'Prompt injection against coding agents: poisoned repos, issues and packages', 'Prompt injection nhắm vào agent viết code: repo, issue và gói bị cài bẫy', 'Lệnh ẩn trong README, issue, chú thích · Gói bịa tên (slopsquatting) · Không để agent tự chạy script lạ · Phòng thủ cho sản phẩm LLM, OWASP LLM Top 10 → /courses/llm-apps Ch7'],
    ['rieng-tu', 'Privacy, licences and company policy when coding with AI', 'Quyền riêng tư, giấy phép và chính sách công ty khi code với AI', 'Code công ty có được gửi lên AI không · Bí mật trong .env và log · Giấy phép của code AI sinh ra · Ghi rõ phần AI đóng góp theo quy ước của nhóm'],
    ['quy-trinh-nhom', 'Team process with AI: repo rules, CI gates and review policy', 'Quy trình nhóm có AI: luật repo, cổng CI và chính sách review', 'Vai tech lead: ai giao, ai duyệt, ai chịu trách nhiệm · Cổng CI bắt buộc (tsc, test, quét bí mật) · Chính sách review PR có phần AI viết · Onboarding người mới bằng bộ nhớ dự án'],
  ]],
  ['Chapter 9 — Capstone: tech-lead a real feature with an agent', 'Chương 9 — Dự án cuối khoá: làm tech lead một tính năng thật với agent', 'Một tính năng thật trên repo datlich: đặc tả → kế hoạch → giao việc → cổng chất lượng → PR → kể lại khi phỏng vấn.', [
    ['thiet-ke', 'Capstone: spec, plan and acceptance criteria', 'Dự án cuối: đặc tả, kế hoạch, tiêu chí nghiệm thu', 'Đặc tả như việc thật · Chia nhỏ thành việc có lệnh kiểm · Tiêu chí nghiệm thu đo được · Rubric chấm'],
    ['dung', 'Capstone: delegating and supervising several workstreams', 'Dự án cuối: giao việc và giám sát nhiều luồng', 'Mỗi luồng một worktree · Điểm dừng kiểm · Xử lý khi agent đi lạc · Nhật ký quyết định'],
    ['do-danh-gia', 'Capstone: quality gates — review, tests, security, measurement', 'Dự án cuối: cổng chất lượng — review, test, bảo mật, đo', 'Review theo checklist · Test biên + test lỗi · Quét bí mật và gói lạ · Đo thời gian và số lần sửa'],
    ['tong-ket', 'Capstone: the PR, the handover, and telling the story in interviews', 'Dự án cuối: PR, bàn giao, và kể lại khi phỏng vấn', 'Mô tả PR tốt · Bàn giao cho người sau · Kể dự án theo STAR: AI làm gì, bạn quyết định gì · Câu hỏi phỏng vấn hay gặp'],
  ]],
]);

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'ai-coding',
    title: 'Coding with AI',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/ai-coding.png?v=1',
    shortDescription: 'Use AI coding agents to work faster while you stay in control: give clear tasks, review and test what they write, catch invented packages and leaked secrets, and run the whole workflow like a tech lead.|||Dùng agent AI để code nhanh hơn mà vẫn làm chủ: giao việc rõ, review và test thứ nó viết, bắt gói bịa và khoá lộ, và vận hành cả quy trình như một tech lead.',
    description: 'Khoá học để ĐI LÀM: dùng AI viết code nhanh hơn nhưng vẫn tự hiểu, tự đọc và kiểm soát được mọi dòng AI viết, tự vận hành như một tech lead. Đi từ số 0 (LLM và agent là gì, vì sao nó "bịa") tới chuyên sâu: giao việc cho agent, bộ nhớ dự án, git làm lưới an toàn, review và test code AI, gói bịa tên (slopsquatting), lệnh ẩn trong README (prompt injection), khoá lộ trong lịch sử git, chạy agent trong CI, MCP và rào chắn, đo năng suất thật, chi phí, quy trình nhóm. Mọi demo chạy thật trên máy (git, test, npm registry, bộ quét bí mật); sự cố lấy từ chính kho mã của cuongthai.com. Dự án lab xuyên khoá: API đặt lịch phòng học nhóm; dự án cuối khoá: làm tech lead một tính năng thật với agent.',
    whatYouLearn: 'Hiểu LLM và agent đủ để dùng giỏi (token, ngữ cảnh, vì sao bịa); giao việc rõ ràng và giữ bộ nhớ dự án; dùng git làm lưới an toàn; review, test và tự giải thích được code AI viết; phát hiện gói bịa, lệnh ẩn và bí mật bị lộ; chạy agent trong script/CI có rào chắn; dùng MCP an toàn; đo năng suất và chi phí thật; vận hành quy trình nhóm có AI và kể lại kinh nghiệm khi phỏng vấn.',
    requirements: 'Biết lập trình cơ bản (JavaScript/TypeScript là tốt nhất), dùng được terminal và Git ở mức commit/push. Chưa cần biết gì về AI. Nên học trước khoá Git và Node.js.',
    documentsNote: 'Tài liệu chính: docs.claude.com (Claude Code) • docs.github.com/copilot • modelcontextprotocol.io • OWASP Top 10 for LLM Applications • github.com/gitleaks/gitleaks. Model, giá và giới hạn đổi nhanh — mỗi bài ghi mốc thời gian đã kiểm.',
  },
  sections: [ghep(K[0], s00), ...K.slice(1)],
};
