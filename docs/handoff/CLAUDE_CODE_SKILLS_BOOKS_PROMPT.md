# PROMPT BÀN GIAO — BỘ SÁCH KỸ NĂNG TOÀN DIỆN

> Sao chép toàn bộ file này vào Claude Code. Đây vừa là prompt thực thi vừa là
> nguồn phạm vi đầy đủ cho bộ sách. Không tự rút gọn danh mục hoặc đổi số quyển.

## Vai trò và mục tiêu

Bạn đang tiếp tục viết **Bộ Kỹ năng toàn diện** trên website CuongThai Books.
Bộ này có chính xác **16 quyển / 237 chương**, đánh số **26–41**.
Mục tiêu dài hạn là xuất bản lần lượt từng quyển bằng tiếng Việt, giữ thuật ngữ
tiếng Anh khi cần, với nội dung dùng được trong công việc, phỏng vấn, học tập,
lãnh đạo, kinh doanh và đời sống.

Ba quyển 26–28 đã được xuất bản. Hãy tiếp tục từ **quyển 29** và chỉ đánh dấu
một quyển là hoàn thành khi toàn bộ chương của quyển đó có nội dung thật, ví dụ,
bài tập và checkpoint. Ưu tiên hoàn thành một quyển chất lượng thay vì tạo nhiều
file rỗng.

## Việc phải làm trước khi sửa

1. Đọc toàn bộ `AGENTS.md` ở root và tuân thủ mọi giới hạn của dự án.
2. Chạy `git status --short`; thay đổi đang có là của người dùng, không được
   ghi đè hoặc hoàn tác.
3. Đọc các file nguồn sự thật:
   - `frontend/scripts/skill-books-plan.mjs`
   - `frontend/scripts/generate-skill-books.mjs`
   - `frontend/src/app/books/booksData.ts`
   - `frontend/src/app/books/LibraryClient.tsx`
   - `frontend/src/app/books/[slug]/page.tsx`
4. Mở ít nhất một sách đã xuất bản, ví dụ
   `frontend/public/books/27-tu-duy-phan-bien-va-giai-quyet-van-de.html`, để
   kiểm tra cấu trúc HTML thật và giao diện đọc.

## Trạng thái hiện tại

- Thư viện kỹ thuật cũ: 25 quyển, số 01–25.
- Bộ kỹ năng: 16 quyển, số 26–41.
- Đã xuất bản: 26, 27, 28 (44 chương).
- Chưa viết: 29–41.
- Ba file HTML đã xuất bản được sinh bởi
  `node frontend/scripts/generate-skill-books.mjs`.
- Bìa là CSS 3D bọc vải/ép nhũ trong trang `/books`; **không tạo ảnh bìa
  raster** nếu không có yêu cầu mới.
- Sách kỹ năng viết gốc bằng tiếng Việt (`<html lang="vi">`), nên trình đọc
  tự ẩn nút EN/EN+VI/VI. Sách kỹ thuật cũ vẫn giữ song ngữ như trước.

## Chuẩn nội dung bắt buộc cho từng chương

Mỗi chương phải có tối thiểu:

1. Bản chất và định nghĩa bằng hành vi quan sát được.
2. Vì sao cần kỹ năng này trong công việc, phỏng vấn, học tập và đời sống.
3. Một framework/quy trình 3–6 bước có giải thích.
4. Ít nhất một tình huống thực tế có bối cảnh, hành động và kết quả.
5. So sánh cách làm yếu với cách làm trưởng thành.
6. Sai lầm và hiểu nhầm thường gặp.
7. Worksheet có thể điền ngay.
8. Ít nhất 8 bài tập chia cơ bản, ứng dụng, thực chiến.
9. Ít nhất 3 checkpoint kèm đáp án.
10. Thử thách 7 ngày hoặc kế hoạch 30 ngày.
11. Cách biến kỹ năng thành bằng chứng dùng trong CV/phỏng vấn/portfolio.

Không dùng lời khuyên rỗng như “hãy cố gắng”, “hãy tích cực”, “giao tiếp tốt
hơn”. Mọi lời khuyên phải trả lời được: **làm gì, trong tình huống nào, quan sát
kết quả bằng gì, sai thì điều chỉnh ra sao**.

## Chuẩn biên tập

- Viết tiếng Việt tự nhiên; giữ English term trong ngoặc khi nó giúp tra cứu.
- Giọng điệu tỉnh táo, thực tế, không lên lớp và không hứa chắc chắn thành công.
- Phân biệt dữ kiện, suy luận, kinh nghiệm và ý kiến.
- Không bịa nghiên cứu, số liệu, case khách hàng hoặc trích dẫn.
- Với y tế, pháp lý, tài chính: chỉ viết kiến thức giáo dục phổ thông, nêu giới
  hạn và khuyên tìm chuyên gia phù hợp khi quyết định có rủi ro cao.
- Nếu dùng thông tin có thể thay đổi, tra nguồn sơ cấp/chính thức và ghi link.
- Ví dụ phải đa dạng: cá nhân, nhân viên, kỹ sư, quản lý, freelancer, người làm
  sản phẩm và chủ doanh nghiệp; tránh biến toàn bộ sách thành ví dụ lập trình.
- Không sao chép cùng một đoạn cho nhiều chương. Khung có thể nhất quán nhưng
  luận điểm, tình huống, lỗi và bài tập phải riêng cho kỹ năng đó.

## Quy trình xuất bản một quyển mới

1. Trong `skill-books-plan.mjs`, giữ nguyên số, slug, tiêu đề, số chương và
   màu. Chưa đổi `published` thành `true`.
2. Thêm một mảng `GUIDES['NN']` vào
   `generate-skill-books.mjs`, đúng một guide cho mỗi chương. Mỗi guide phải
   có luận điểm, framework, tình huống, sai lầm và cách dùng khi phỏng vấn.
3. Thêm nguồn đáng tin vào `SOURCES['NN']`.
4. Chạy generator trong lúc `published` vẫn false bằng cách tạm chỉ định
   quyển hoặc hoàn thiện guide trước; cuối cùng mới đổi `published: true` và
   chạy lại toàn bộ generator. Generator phải kết thúc không lỗi đếm guide.
5. Đọc file HTML sinh ra, kiểm:
   - số `.toc-row` = số chương;
   - số `.chap-open` = số chương;
   - mỗi chương có 8 `.ex-row`;
   - không có heading rỗng, placeholder, “TODO” hoặc nội dung lặp vô lý.
6. Thêm sách vào `SKILL_BOOKS` trong `booksData.ts`, đồng thời xóa đúng
   sách đó khỏi `SKILL_BOOKS_UPCOMING`.
7. Thêm slug vào `generateStaticParams()` trong
   `frontend/src/app/books/[slug]/page.tsx`.
8. Cập nhật số liệu thư viện bằng số đếm thật. Không đoán word count.
9. Chạy:
   - `cd frontend && npx tsc --noEmit`
   - `cd frontend && npm run build`
10. Mở `/books` và sách mới trong trình duyệt; kiểm desktop, mobile, bìa,
    mục lục, nhảy chương, thanh tiến độ, dark/light và console.

## Definition of Done cho một quyển

- Tất cả chương có nội dung riêng và đủ cấu trúc sư phạm.
- HTML tự chứa, đọc offline; chỉ font có thể rơi về system font.
- Bìa xuất hiện đúng kệ, không có link 404.
- Trình đọc nhận đúng tiêu đề và toàn bộ mục lục.
- Nội dung hiển thị tiếng Việt, không cố tải file dịch `.vi.json`.
- TypeScript và Next.js build đều xanh.
- `git status` không có file build hoặc file môi trường ngoài ý muốn.
- Không push, deploy hoặc commit nếu người dùng chưa yêu cầu riêng.

## Toàn bộ danh mục 16 quyển / 237 chương

### Quyển 26 — Làm chủ bản thân (14 chương) — ĐÃ XUẤT BẢN

- Slug: `26-lam-chu-ban-than`
- Phụ đề: Từ tự nhận thức đến kỷ luật, cảm xúc và sức bền
- Màu bìa: `#6B3A6E`

1. Tự nhận thức — Self-awareness
2. Xác định giá trị sống — Personal Values
3. Tư duy phát triển — Growth Mindset
4. Kỷ luật bản thân — Self-discipline
5. Xây dựng sự tự tin
6. Quản lý cảm xúc — Emotional Regulation
7. Trí tuệ cảm xúc — Emotional Intelligence
8. Khả năng thích nghi — Adaptability
9. Khả năng phục hồi — Resilience
10. Quản lý căng thẳng
11. Phòng tránh kiệt sức — Burnout Prevention
12. Xây dựng thói quen
13. Sức khỏe thể chất phục vụ hiệu suất
14. Đạo đức, chính trực và trách nhiệm

### Quyển 27 — Tư duy phản biện và giải quyết vấn đề (17 chương) — ĐÃ XUẤT BẢN

- Slug: `27-tu-duy-phan-bien-va-giai-quyet-van-de`
- Phụ đề: Từ câu hỏi đúng đến quyết định tốt trong điều kiện bất định
- Màu bìa: `#8E3B2A`

1. Tư duy phản biện — Critical Thinking
2. Tư duy logic
3. Nhận diện thiên kiến nhận thức — Cognitive Biases
4. Tư duy giải quyết vấn đề — Problem Solving
5. Xác định đúng vấn đề — Problem Framing
6. Phân tích nguyên nhân gốc — Root Cause Analysis
7. Tư duy hệ thống — Systems Thinking
8. Tư duy từ nguyên lý đầu tiên — First-principles Thinking
9. Tư duy phân tích — Analytical Thinking
10. Tư duy sáng tạo — Creative Thinking
11. Tư duy thiết kế — Design Thinking
12. Ra quyết định — Decision-making
13. Ra quyết định khi thiếu thông tin
14. Tư duy xác suất và thống kê cơ bản
15. Đọc và diễn giải dữ liệu
16. Tư duy chiến lược — Strategic Thinking
17. Tư duy phản tư — Reflective Thinking

### Quyển 28 — Học cách học và quản lý tri thức (13 chương) — ĐÃ XUẤT BẢN

- Slug: `28-hoc-cach-hoc-va-quan-ly-tri-thuc`
- Phụ đề: Học nhanh hơn, nhớ lâu hơn và biến kiến thức thành năng lực
- Màu bìa: `#256B4F`

1. Học cách học — Learning How to Learn
2. Đặt mục tiêu học tập
3. Học chủ động — Active Learning
4. Active Recall và Spaced Repetition
5. Kỹ thuật Feynman
6. Đọc hiểu hiệu quả
7. Ghi chép và quản lý kiến thức
8. Nghiên cứu và tìm kiếm thông tin
9. Kiểm chứng nguồn tin
10. Tự học một kỹ năng mới
11. Luyện tập có chủ đích — Deliberate Practice
12. Học qua dự án — Project-based Learning
13. Tiếng Anh chuyên ngành và giao tiếp công việc

### Quyển 29 — Quản lý thời gian và hiệu suất (13 chương) — CHƯA VIẾT

- Slug: `29-quan-ly-thoi-gian-va-hieu-suat`
- Phụ đề: Ưu tiên đúng, tập trung sâu và thực thi bền vững
- Màu bìa: `#2B4C86`

1. Quản lý thời gian
2. Xác định ưu tiên
3. Lập kế hoạch ngày, tuần, tháng và quý
4. Time Blocking
5. Quản lý danh sách công việc
6. Làm việc sâu — Deep Work
7. Quản lý sự chú ý
8. Chống trì hoãn
9. Ước lượng thời gian
10. Quản lý nhiều công việc đồng thời
11. Quản lý năng lượng
12. Nói “không” và đặt ranh giới
13. Đánh giá hiệu suất cá nhân

### Quyển 30 — Giao tiếp chuyên nghiệp (15 chương) — CHƯA VIẾT

- Slug: `30-giao-tiep-chuyen-nghiep`
- Phụ đề: Lắng nghe, viết, nói và thuyết phục trong công việc
- Màu bìa: `#0E6E6B`

1. Nền tảng giao tiếp
2. Lắng nghe chủ động — Active Listening
3. Giao tiếp rõ ràng, ngắn gọn
4. Đặt câu hỏi hiệu quả
5. Giao tiếp quyết đoán — Assertive Communication
6. Giao tiếp phi ngôn ngữ
7. Thấu cảm
8. Viết email và tin nhắn công việc
9. Viết báo cáo
10. Kể chuyện — Storytelling
11. Thuyết trình
12. Nói trước đám đông — Public Speaking
13. Giải thích vấn đề kỹ thuật cho người không chuyên
14. Giao tiếp giữa các nền văn hóa
15. Giao tiếp từ xa

### Quyển 31 — Làm việc nhóm và xử lý mâu thuẫn (12 chương) — CHƯA VIẾT

- Slug: `31-lam-viec-nhom-va-xu-ly-mau-thuan`
- Phụ đề: Phối hợp rõ ràng, xây niềm tin và giải quyết bất đồng
- Màu bìa: `#8A5A14`

1. Làm việc nhóm — Teamwork
2. Xây dựng niềm tin
3. Phân công trách nhiệm
4. Hợp tác liên phòng ban
5. Tổ chức cuộc họp hiệu quả
6. Cập nhật tiến độ
7. Cho và nhận phản hồi — Feedback
8. Xử lý mâu thuẫn
9. Đàm phán — Negotiation
10. Quản lý người khó làm việc cùng
11. An toàn tâm lý — Psychological Safety
12. Làm việc trong nhóm đa chuyên môn

### Quyển 32 — Lập kế hoạch và quản lý dự án (15 chương) — CHƯA VIẾT

- Slug: `32-lap-ke-hoach-va-quan-ly-du-an`
- Phụ đề: Biến mục tiêu thành kết quả có phạm vi, tiến độ và trách nhiệm
- Màu bìa: `#3B3E8C`

1. Xác định mục tiêu
2. Chuyển mục tiêu thành kế hoạch
3. Xác định phạm vi — Scope Management
4. Phân rã công việc — Work Breakdown Structure
5. Lập lịch và quản lý phụ thuộc
6. Ước lượng nguồn lực và ngân sách
7. Quản lý rủi ro
8. Quản lý thay đổi
9. Agile và Scrum
10. Kanban
11. Quản lý chất lượng
12. Quản lý stakeholder
13. Báo cáo trạng thái dự án
14. Kết thúc và rút kinh nghiệm dự án
15. Quản lý khủng hoảng

### Quyển 33 — Lãnh đạo và quản lý con người (17 chương) — CHƯA VIẾT

- Slug: `33-lanh-dao-va-quan-ly-con-nguoi`
- Phụ đề: Từ lãnh đạo bản thân đến xây đội ngũ và văn hóa
- Màu bìa: `#6B3A6E`

1. Phân biệt Leader và Manager
2. Lãnh đạo bản thân
3. Xây dựng tầm nhìn
4. Truyền đạt mục tiêu
5. Lãnh đạo theo tình huống — Situational Leadership
6. Giao việc — Delegation
7. Trao quyền — Empowerment
8. Coaching và Mentoring
9. Tổ chức 1-on-1
10. Tạo động lực
11. Quản lý hiệu suất
12. Xử lý nhân viên có hiệu suất thấp
13. Tuyển dụng và xây dựng đội ngũ
14. Xây dựng văn hóa doanh nghiệp
15. Quản lý thay đổi tổ chức
16. Lãnh đạo đạo đức
17. Kế nhiệm và phát triển lãnh đạo

### Quyển 34 — Lập trình và năng lực công nghệ (20 chương) — CHƯA VIẾT

- Slug: `34-lap-trinh-va-nang-luc-cong-nghe`
- Phụ đề: Từ tư duy lập trình đến kiến trúc, bảo mật và vận hành
- Màu bìa: `#3D5567`

1. Tư duy lập trình
2. Nền tảng ngôn ngữ lập trình
3. Cấu trúc dữ liệu và thuật toán
4. Lập trình hướng đối tượng và các mô hình khác
5. Git và quản lý phiên bản
6. Đọc mã nguồn
7. Viết mã sạch — Clean Code
8. Debugging
9. Kiểm thử phần mềm
10. Cơ sở dữ liệu
11. API và tích hợp hệ thống
12. Kiến trúc phần mềm
13. Bảo mật căn bản
14. DevOps và triển khai
15. Code Review
16. Viết tài liệu kỹ thuật
17. Ước lượng công việc kỹ thuật
18. System Design
19. Sử dụng AI hỗ trợ lập trình
20. Học công nghệ mới

### Quyển 35 — Xây dựng sản phẩm (14 chương) — CHƯA VIẾT

- Slug: `35-xay-dung-san-pham`
- Phụ đề: Từ vấn đề người dùng đến MVP, đo lường và ra mắt
- Màu bìa: `#256B4F`

1. Tư duy sản phẩm — Product Thinking
2. Khám phá vấn đề người dùng
3. Xác định khách hàng mục tiêu
4. Xác lập giá trị — Value Proposition
5. Product–Market Fit
6. Xây dựng MVP
7. Viết yêu cầu sản phẩm — PRD
8. Ưu tiên tính năng
9. Trải nghiệm người dùng — UX
10. Prototype và kiểm thử người dùng
11. Đo lường sản phẩm
12. Phân tích phản hồi
13. Lộ trình sản phẩm — Product Roadmap
14. Ra mắt sản phẩm — Product Launch

### Quyển 36 — Marketing, bán hàng và đưa sản phẩm ra thị trường (22 chương) — CHƯA VIẾT

- Slug: `36-marketing-ban-hang-va-go-to-market`
- Phụ đề: Biến giá trị thành sự chú ý, khách hàng và doanh thu
- Màu bìa: `#8E3B2A`

1. Nghiên cứu thị trường
2. Phân tích đối thủ
3. Định vị — Positioning
4. Xây dựng thương hiệu — Branding
5. Viết thông điệp sản phẩm
6. Copywriting
7. Content Marketing
8. Marketing trên mạng xã hội
9. SEO
10. Email Marketing
11. Paid Advertising
12. Xây dựng cộng đồng
13. Quan hệ công chúng — Public Relations
14. Bán hàng — Sales
15. Khám phá nhu cầu khách hàng — Sales Discovery
16. Demo và trình bày sản phẩm
17. Xử lý từ chối và phản đối
18. Chốt bán hàng — Closing
19. Định giá — Pricing
20. Chăm sóc và giữ chân khách hàng
21. Growth và Growth Loop
22. Đo hiệu quả kinh doanh

### Quyển 37 — Sự nghiệp, phỏng vấn và freelance (20 chương) — CHƯA VIẾT

- Slug: `37-su-nghiep-phong-van-va-freelance`
- Phụ đề: Tạo bằng chứng năng lực, tìm cơ hội và tăng thu nhập
- Màu bìa: `#2B4C86`

1. Xác định hướng nghề nghiệp
2. Phân tích mô tả công việc
3. Viết CV
4. Xây dựng portfolio
5. Viết Cover Letter
6. Xây dựng thương hiệu cá nhân
7. Networking
8. Chuẩn bị phỏng vấn
9. Trả lời phỏng vấn hành vi
10. Phỏng vấn chuyên môn
11. Phỏng vấn lập trình
12. Phỏng vấn System Design
13. Phỏng vấn vị trí quản lý
14. Đặt câu hỏi ngược cho nhà tuyển dụng
15. Đàm phán lương
16. Bắt đầu công việc mới
17. Thăng tiến
18. Chuyển nghề
19. Làm freelance
20. Làm việc từ xa và thị trường quốc tế

### Quyển 38 — Khởi nghiệp và vận hành doanh nghiệp (16 chương) — CHƯA VIẾT

- Slug: `38-khoi-nghiep-va-van-hanh-doanh-nghiep`
- Phụ đề: Từ kiểm chứng ý tưởng đến dòng tiền, hệ thống và mở rộng
- Màu bìa: `#8A5A14`

1. Tư duy doanh nhân
2. Kiểm chứng ý tưởng kinh doanh
3. Mô hình kinh doanh
4. Lập kế hoạch kinh doanh
5. Unit Economics
6. Quản lý dòng tiền — Cash Flow
7. Kế toán và tài chính căn bản
8. Pháp lý và hợp đồng căn bản
9. Xây dựng quy trình vận hành — SOP
10. Tuyển người đầu tiên
11. Xây dựng hệ thống quản trị
12. Gọi vốn và trình bày với nhà đầu tư
13. Quản lý đối tác
14. Mở rộng doanh nghiệp — Scaling
15. Quản trị khủng hoảng doanh nghiệp
16. Chiến lược rút lui

### Quyển 39 — AI, dữ liệu và năng lực số (10 chương) — CHƯA VIẾT

- Slug: `39-ai-du-lieu-va-nang-luc-so`
- Phụ đề: Dùng công nghệ để tăng năng lực mà không đánh mất phán đoán
- Màu bìa: `#3B3E8C`

1. Digital Literacy
2. An toàn thông tin cá nhân
3. AI Literacy
4. Viết yêu cầu cho AI — Prompting
5. Xác minh nội dung do AI tạo
6. Tự động hóa công việc
7. Phân tích dữ liệu hỗ trợ quyết định
8. No-code và Low-code
9. Đạo đức AI và quyền riêng tư
10. Hợp tác hiệu quả giữa con người và AI

### Quyển 40 — Tài chính cá nhân và kỹ năng đời sống (12 chương) — CHƯA VIẾT

- Slug: `40-tai-chinh-ca-nhan-va-ky-nang-doi-song`
- Phụ đề: Quản trị tiền bạc, quan hệ, rủi ro và các quyết định lớn
- Màu bìa: `#0E6E6B`

1. Quản lý thu nhập và chi tiêu
2. Lập ngân sách
3. Quỹ khẩn cấp
4. Quản lý nợ
5. Đầu tư căn bản
6. Bảo hiểm và quản trị rủi ro cá nhân
7. Phòng tránh lừa đảo tài chính
8. Kỹ năng xây dựng quan hệ
9. Xử lý bất đồng trong đời sống
10. Ra quyết định quan trọng trong cuộc sống
11. Kỹ năng tự bảo vệ
12. Cân bằng các vai trò trong cuộc sống

### Quyển 41 — Hệ thống thực hành tổng hợp (7 chương) — CHƯA VIẾT

- Slug: `41-he-thong-thuc-hanh-tong-hop`
- Phụ đề: Biến 230 kỹ năng thành bằng chứng, dự án và kết quả thật
- Màu bìa: `#3D5567`

1. Đánh giá năng lực ban đầu
2. Lập bản đồ kỹ năng cá nhân
3. Xây kế hoạch học 12 tháng
4. Xây dựng bằng chứng năng lực
5. Nhật ký thực hành
6. Hệ thống nhận phản hồi
7. Dự án tốt nghiệp: Từ ý tưởng đến khách hàng

## Thứ tự ưu tiên nếu người dùng không chỉ định

Viết tuần tự 29 → 33 trước vì đây là nhóm dùng thường xuyên nhất trong mọi
nghề: thời gian, giao tiếp, teamwork, dự án và leadership. Sau đó viết 35 → 38
để nối từ sản phẩm đến kiếm tiền và vận hành doanh nghiệp. Quyển 34 về lập trình
có thể tận dụng 25 quyển kỹ thuật hiện có nhưng không được chỉ dẫn lại bằng
liên kết; nó phải dạy tư duy nghề nghiệp tích hợp. Cuối cùng hoàn thiện 39–41.

Khi kết thúc một phiên, cập nhật rõ trong file bàn giao hoặc báo cáo: quyển nào
đã hoàn thành, số chương, số bài tập, số từ thật, file đã đổi, kiểm tra đã chạy
và quyển tiếp theo. Không đánh dấu hoàn thành chỉ vì đã tạo skeleton.
