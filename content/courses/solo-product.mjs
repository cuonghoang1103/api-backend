/**
 * Làm sản phẩm một mình — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: fullstack-project (dựng kỹ thuật một dự án — ở đây chỉ chọn stack cho MVP và trỏ sang), content-creator
 * (làm video/kênh — ở đây chỉ nội dung như kênh tăng trưởng, trỏ Ch26), seo-analytics (SEO/đo lường — trỏ sang),
 * online-payments (tích hợp thanh toán — trỏ sang), interview-prep (xin việc — không trùng), agile-teamwork (quy trình
 * đội — ở đây là làm một mình). Pháp lý & thuế VN ghi TRUNG TÍNH — quy định thay đổi (vd chuyển đổi thuế khoán của hộ kinh
 * doanh); người soạn chi tiết PHẢI kiểm văn bản hiện hành trên nguồn chính thức, không thay tư vấn chuyên môn.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'career', name: 'Nghề nghiệp', icon: 'Briefcase', sortOrder: 7 },
  course: {
    slug: 'solo-product',
    title: 'Solo Product: From Idea to Launch to Revenue',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/solo-product.png?v=4',
    shortDescription: 'Build and sell a product on your own: find a real problem, validate before coding, scope an MVP, price it, launch, grow, support customers, read MRR and churn, and handle legal and tax basics in Vietnam.|||Tự làm và bán một sản phẩm: tìm vấn đề thật, xác thực trước khi code, cắt MVP, định giá, ra mắt, tăng trưởng, hỗ trợ khách hàng, đọc MRR và churn, và nắm pháp lý, thuế cơ bản cho cá nhân và hộ kinh doanh tại Việt Nam.',
    description: 'Khoá dành cho lập trình viên muốn biến kỹ năng thành một sản phẩm có người trả tiền — làm một mình hoặc nhóm rất nhỏ, song song với việc học/đi làm. Tìm vấn đề đáng giải; phỏng vấn khách hàng không bị nói dối; xác thực bằng landing page, danh sách chờ, bán trước; cắt MVP và chọn stack nhàm chán mà nhanh; định giá (miễn phí, freemium, gói, trọn đời, theo mức dùng); ra mắt (Product Hunt, cộng đồng, mạng xã hội, cộng đồng Việt Nam); tăng trưởng bằng nội dung, SEO, giới thiệu, cộng đồng; hỗ trợ khách hàng và giữ chân; đọc chỉ số (MRR, churn, LTV, CAC, activation); vận hành một mình (tự động hoá, chi phí, sức khoẻ); pháp lý và thuế tại Việt Nam cho cá nhân, hộ kinh doanh, doanh nghiệp nhỏ (tổng quan trung tính, kèm nguồn chính thức để kiểm). Xuyên suốt là bài học thật từ cuongthai.com: tài khoản Pro bằng mã kích hoạt, gói Pro 4 mức, chuyển khoản VietQR đối soát tay, tạm ẩn TMĐT chờ thủ tục.',
    whatYouLearn: 'Chọn một vấn đề có người sẵn sàng trả tiền; xác thực ý tưởng trong 2 tuần trước khi viết code; cắt MVP ra mắt được trong 4–6 tuần; đặt giá và thiết kế gói; lên kế hoạch và thực hiện một đợt ra mắt; dựng kênh tăng trưởng không tốn tiền quảng cáo; đo MRR, churn, activation và ra quyết định từ đó; hỗ trợ khách hàng một mình mà không kiệt sức; biết các bước pháp lý, thuế, hoá đơn cần kiểm khi bắt đầu thu tiền tại Việt Nam.',
    requirements: 'Làm được một ứng dụng web hoặc mobile đơn giản và deploy nó. Không cần kiến thức kinh doanh. Nên học song song Thanh toán online (online-payments) và SEO & Analytics (seo-analytics).',
    documentsNote: 'Tài liệu chính: "The Mom Test" (Rob Fitzpatrick) • "The Lean Startup" (Eric Ries) • "Traction" (Weinberg & Mares) • "Obviously Awesome" (April Dunford) • ycombinator.com/library (Startup School) • indiehackers.com • producthunt.com/launch • stripe.com/guides • Nguồn pháp lý/thuế Việt Nam: gdt.gov.vn (Tổng cục/Cục Thuế), dangkykinhdoanh.gov.vn, vbpl.vn, online.gov.vn.',
  },
  sections: khung('solo', [
    ['Section 0 — Why build a product alone', 'Mục 0 — Vì sao tự làm một sản phẩm', 'Làm sản phẩm một mình là gì, lịch sử, những thất bại nổi tiếng, và chuẩn bị.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Solo products in everyday words, the indie maker movement, and famous failures', 'Bắt đầu tại đây (1/2) — Sản phẩm một mình bằng lời đời thường, phong trào indie maker, và những thất bại nổi tiếng', 'Mở một quán nhỏ trên Internet · Shareware (thập niên 1980–1990) → SaaS → "The Lean Startup" (2011) → Product Hunt (2013) → Stripe Atlas, indie hackers · Quibi 2020: huy động khoảng 1,75 tỉ USD, đóng cửa sau khoảng 6 tháng — làm to trước khi biết người dùng có cần · Lý do thất bại hay được nhắc nhất: làm thứ không ai cần (xem như xu hướng, không phải thống kê tuyệt đối)'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and honest expectations', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và kỳ vọng thật thà', 'Ra mắt một sản phẩm có người dùng thật (và có thể có người trả tiền) · Kỹ năng sản phẩm giúp cả khi đi làm · Đa số sản phẩm đầu tiên không thành — mục tiêu là học nhanh, tốn ít · Lộ trình: fullstack-project → khoá này ↔ online-payments, seo-analytics'],
      ['cai-dat', 'Your toolkit: notes, landing page builder, analytics, payments sandbox', 'Bộ đồ nghề: sổ ghi, công cụ dựng landing page, analytics, sandbox thanh toán', 'Sổ phỏng vấn khách hàng · Landing page bằng Next.js trên VPS/Cloudflare · Umami/Plausible · Form danh sách chờ · Sandbox thanh toán (trỏ online-payments)'],
      ['nhip', 'Working rhythm: building alongside school or a job', 'Nhịp làm việc: làm sản phẩm song song học hoặc đi làm', 'Khung giờ cố định mỗi tuần · Một mục tiêu mỗi tuần · Nhật ký công khai (build in public) · Khi nào dừng'],
    ]],
    ['Chapter 1 — Finding a problem worth solving', 'Chương 1 — Tìm một vấn đề đáng giải', 'Bắt đầu từ vấn đề, không từ công nghệ.', [
      ['nguon-y-tuong', 'Where good problems come from', 'Vấn đề tốt đến từ đâu', 'Nỗi đau của chính mình (như cuongthai.com bắt đầu từ nhu cầu học) · Việc lặp lại ở chỗ làm/trường · Cộng đồng ngách · Danh sách 20 vấn đề'],
      ['danh-gia', 'Scoring ideas: pain, frequency, willingness to pay, reach', 'Chấm điểm ý tưởng: mức đau, tần suất, sẵn lòng trả tiền, khả năng tiếp cận', 'Bảng chấm điểm · Thị trường đủ nhỏ để thắng, đủ lớn để sống · Lợi thế riêng của bạn'],
      ['doi-thu', 'Competitors are good news', 'Có đối thủ là tin tốt', 'Đối thủ chứng minh có người trả tiền · Đọc đánh giá 1–3 sao của đối thủ · Góc khác biệt'],
      ['bay', 'Traps: solutions looking for problems, building for developers only', 'Bẫy: giải pháp đi tìm vấn đề, chỉ làm cho lập trình viên', 'Làm vì thích công nghệ · Thị trường "ai cũng dùng" · Sản phẩm cho dân IT khó thu tiền'],
    ]],
    ['Chapter 2 — Validating before you code', 'Chương 2 — Xác thực trước khi viết code', 'Bằng chứng người ta cần, rẻ và nhanh.', [
      ['phong-van', 'Customer interviews with The Mom Test', 'Phỏng vấn khách hàng theo The Mom Test', 'Hỏi về hành vi quá khứ, không hỏi ý kiến · Tránh khen xã giao · Mười cuộc phỏng vấn đầu tiên · Ghi lại câu nói nguyên văn'],
      ['landing-page', 'Landing pages, waitlists and smoke tests', 'Landing page, danh sách chờ và smoke test', 'Một trang nói rõ giá trị · Đo tỉ lệ để lại email · Nút "mua" giả và đạo đức khi làm'],
      ['ban-truoc', 'Pre-selling and concierge MVPs', 'Bán trước và MVP làm tay', 'Thu tiền trước khi có sản phẩm · Làm dịch vụ bằng tay trước khi tự động hoá · Hoàn tiền nếu không làm'],
      ['tin-hieu', 'Reading signals: when to continue, pivot or stop', 'Đọc tín hiệu: khi nào tiếp, đổi hướng hay dừng', 'Tín hiệu mạnh vs yếu · Đặt ngưỡng trước khi thử · Dừng cũng là thành công nếu tốn ít'],
    ]],
    ['Chapter 3 — Scoping and building the MVP', 'Chương 3 — Cắt phạm vi và dựng MVP', 'Nhỏ nhất mà vẫn giải được vấn đề.', [
      ['cat-pham-vi', 'Cutting scope: one user, one job, one path', 'Cắt phạm vi: một người dùng, một việc, một luồng', 'Danh sách "không làm" · Làm tay những phần hiếm dùng · Mục tiêu ra mắt 4–6 tuần'],
      ['stack', 'A boring, fast stack for one person', 'Stack nhàm chán mà nhanh cho một người', 'Next.js + Express/Spring Boot + PostgreSQL + Redis + Docker + VPS + Cloudflare + R2 · Dùng thứ đã thạo · Dịch vụ thuê vs tự host · Trỏ fullstack-project'],
      ['nen-tang', 'Must-haves on day one: auth, payments, email, analytics, backups', 'Thứ phải có ngày đầu: đăng nhập, thanh toán, email, analytics, sao lưu', 'Không tự viết lại thứ đã có · Sao lưu CSDL từ ngày 1 · Trỏ authentication, online-payments, email-infrastructure'],
      ['ai-coding', 'Using AI coding tools without losing control', 'Dùng công cụ AI viết code mà không mất kiểm soát', 'Nhanh hơn nhưng phải đọc và chạy thử · Test cho luồng tiền · Trỏ ai-coding'],
      ['chat-luong', 'Quality bar for an MVP', 'Mức chất lượng cho một MVP', 'Luồng chính không được hỏng · Thông báo lỗi rõ · Chấp nhận thô ở chỗ phụ · Trỏ ux-ui-for-developers'],
    ]],
    ['Chapter 4 — Pricing and packaging', 'Chương 4 — Định giá và đóng gói', 'Giá là một phần của sản phẩm.', [
      ['mo-hinh', 'Pricing models: free, freemium, trial, tiers, lifetime, usage-based', 'Mô hình giá: miễn phí, freemium, dùng thử, gói bậc, trọn đời, theo mức dùng', 'Ưu nhược từng mô hình · Gói trọn đời và rủi ro dòng tiền · Theo mức dùng khi có chi phí AI'],
      ['dat-gia', 'Setting a price: value, costs, comparables, Vietnam vs global', 'Đặt giá: giá trị, chi phí, so sánh, Việt Nam và quốc tế', 'Giá theo giá trị, không theo chi phí · Sức mua trong nước · Giá theo khu vực · Tính chi phí LLM mỗi người dùng'],
      ['goi', 'Designing tiers and what goes in each', 'Thiết kế các gói và nội dung mỗi gói', 'Gói Pro 4 mức của cuongthai.com: điều gì khoá, điều gì mở · Neo giá · Gói cho sinh viên'],
      ['thu-gia', 'Changing prices and running discounts', 'Đổi giá và chạy khuyến mãi', 'Giữ giá cũ cho người đã mua · Mã giảm giá có giới hạn · Tránh giảm giá thường xuyên'],
    ]],
    ['Chapter 5 — Launching', 'Chương 5 — Ra mắt', 'Một ngày ra mắt tốt được chuẩn bị trong vài tuần.', [
      ['chuan-bi', 'Launch checklist and pre-launch audience', 'Checklist ra mắt và khán giả trước ra mắt', 'Danh sách chờ · Tài liệu, ảnh chụp, video demo · Kiểm tải và thanh toán · Kế hoạch trả lời bình luận'],
      ['product-hunt', 'Launching on Product Hunt', 'Ra mắt trên Product Hunt', 'Cách nền tảng hoạt động (đọc hướng dẫn chính thức) · Chuẩn bị trang sản phẩm · Không mua upvote · Sau ngày ra mắt'],
      ['cong-dong', 'Communities: Hacker News, Reddit, Facebook groups, Vietnamese forums', 'Cộng đồng: Hacker News, Reddit, nhóm Facebook, diễn đàn Việt Nam', 'Show HN · Luật từng cộng đồng về tự quảng cáo · Kể câu chuyện thay vì quảng cáo'],
      ['sau-ra-mat', 'After launch: the quiet week and what to do', 'Sau ra mắt: tuần im ắng và nên làm gì', 'Lượt truy cập tụt là bình thường · Nói chuyện với người dùng đầu tiên · Sửa rơi rụng ở onboarding'],
    ]],
    ['Chapter 6 — Growth without an ad budget', 'Chương 6 — Tăng trưởng không cần ngân sách quảng cáo', 'Kênh tăng trưởng cho người làm một mình.', [
      ['noi-dung-seo', 'Content and SEO as a long-term channel', 'Nội dung và SEO như kênh dài hạn', 'Viết bài giải đúng vấn đề khách hàng tìm · Trang so sánh, trang hướng dẫn · Trỏ seo-analytics'],
      ['video-mxh', 'Video and social media', 'Video và mạng xã hội', 'Video ngắn demo sản phẩm · Build in public · Trỏ content-creator (Ch20 video ngắn, Ch26 số liệu)'],
      ['gioi-thieu', 'Referrals, partnerships and communities you own', 'Giới thiệu, hợp tác và cộng đồng của riêng mình', 'Chương trình giới thiệu đơn giản · Hợp tác với người có khán giả · Nhóm Zalo/Discord người dùng'],
      ['email', 'Email and lifecycle messages', 'Email và thông điệp theo vòng đời', 'Chuỗi chào mừng · Nhắc hạn gói · Email khi người dùng im lặng · Trỏ email-infrastructure'],
      ['quang-cao', 'When paid ads make sense', 'Khi nào quảng cáo trả tiền hợp lý', 'Chỉ khi biết LTV > CAC · Thử ngân sách nhỏ · Đo bằng UTM'],
    ]],
    ['Chapter 7 — Customers, support and retention', 'Chương 7 — Khách hàng, hỗ trợ và giữ chân', 'Người dùng ở lại mới là tăng trưởng thật.', [
      ['onboarding', 'Onboarding and the activation moment', 'Onboarding và khoảnh khắc kích hoạt', 'Định nghĩa "đã kích hoạt" (vd học xong bài đầu) · Rút ngắn đường tới đó · Trạng thái rỗng hướng dẫn'],
      ['ho-tro', 'Support as a solo founder', 'Hỗ trợ khách hàng khi làm một mình', 'Một kênh hỗ trợ chính · Câu trả lời mẫu · Tài liệu tự phục vụ · Hỗ trợ trong app (như chat hỗ trợ trong /messages của cuongthai.com)'],
      ['phan-hoi', 'Collecting and prioritising feedback', 'Thu thập và ưu tiên góp ý', 'Bảng yêu cầu tính năng · Hỏi "vì sao" sau mỗi yêu cầu · Nói không một cách lịch sự'],
      ['churn', 'Reducing churn', 'Giảm tỉ lệ rời bỏ', 'Hỏi lý do khi huỷ · Tạm dừng thay vì huỷ · Nhắc hạn trước khi hết · Churn tự nhiên vs churn do sản phẩm'],
    ]],
    ['Chapter 8 — Metrics that matter', 'Chương 8 — Chỉ số quan trọng', 'Đo ít mà đúng.', [
      ['mrr', 'Revenue metrics: MRR, ARR, ARPU, expansion', 'Chỉ số doanh thu: MRR, ARR, ARPU, mở rộng', 'Cách tính cho gói tháng/năm/trọn đời · MRR mới, mở rộng, rời bỏ · Tính từ bảng thanh toán trong PostgreSQL'],
      ['churn-ltv-cac', 'Churn, LTV and CAC', 'Churn, LTV và CAC', 'Churn logo vs churn doanh thu · LTV ước lượng thận trọng · CAC tính cả thời gian của bạn'],
      ['north-star', 'Activation, retention cohorts and a north-star metric', 'Kích hoạt, cohort giữ chân và chỉ số bắc đẩu', 'Một con số phản ánh giá trị cho người dùng · Đường giữ chân phẳng là dấu hiệu product-market fit · Trỏ seo-analytics Ch8'],
      ['dashboard', 'A one-page founder dashboard', 'Dashboard một trang cho người sáng lập', 'Doanh thu, người dùng mới, kích hoạt, churn, chi phí · Xem mỗi tuần · Trỏ data-engineering nếu muốn làm lớn'],
    ]],
    ['Chapter 9 — Running the business alone', 'Chương 9 — Vận hành một mình', 'Tự động hoá, chi phí và sức bền.', [
      ['tu-dong-hoa', 'Automating operations', 'Tự động hoá vận hành', 'Deploy một lệnh · Sao lưu tự động · Cảnh báo khi hỏng · Việc lặp lại mỗi tuần thành script'],
      ['chi-phi', 'Costs: servers, AI APIs, tools, and cost caps', 'Chi phí: máy chủ, API AI, công cụ và trần chi phí', 'Bảng chi phí hằng tháng · Trần token/ngày theo người dùng · Việc chạy nền mặc định tắt · Bài học: chi phí AI lớn nhất nằm ở chỗ không ngờ'],
      ['su-co', 'Incidents when you are the whole team', 'Sự cố khi bạn là cả đội', 'Trang trạng thái · Thông báo cho người dùng · Postmortem ngắn · Trỏ incident-response'],
      ['suc-khoe', 'Health, focus and avoiding burnout', 'Sức khoẻ, tập trung và tránh kiệt sức', 'Giới hạn giờ làm · Không trả lời hỗ trợ lúc nửa đêm · Nghỉ có kế hoạch · Khi nào tìm cộng sự'],
    ]],
    ['Chapter 10 — Legal and tax basics in Vietnam (overview)', 'Chương 10 — Pháp lý và thuế cơ bản tại Việt Nam (tổng quan)', 'Biết phải hỏi gì và kiểm ở đâu — không thay tư vấn pháp lý/kế toán; quy định thay đổi thường xuyên.', [
      ['hinh-thuc', 'Legal forms: individual, household business, company', 'Hình thức: cá nhân, hộ kinh doanh, doanh nghiệp', 'So sánh trách nhiệm, thủ tục, sổ sách · Khi nào nên chuyển hình thức · Đăng ký tại dangkykinhdoanh.gov.vn và cơ quan địa phương'],
      ['thue', 'Tax obligations on online income', 'Nghĩa vụ thuế với thu nhập online', 'Cá nhân kinh doanh, hộ kinh doanh, doanh nghiệp khác nhau · Thay đổi cách tính thuế cho hộ kinh doanh gần đây (kiểm văn bản mới nhất) · Thu nhập từ nền tảng nước ngoài · Chỉ dùng nguồn gdt.gov.vn/vbpl.vn'],
      ['hoa-don-tmdt', 'E-invoices, e-commerce website notification and consumer rules', 'Hoá đơn điện tử, thông báo website TMĐT và quy định bảo vệ người tiêu dùng', 'Nghị định 123/2020/NĐ-CP và văn bản sửa đổi · online.gov.vn · Bài học cuongthai.com: tạm ẩn TMĐT chờ thủ tục · Trỏ online-payments Ch11'],
      ['dieu-khoan', 'Terms of service, privacy policy and intellectual property', 'Điều khoản dịch vụ, chính sách riêng tư và sở hữu trí tuệ', 'Viết điều khoản bằng lời dễ hiểu · Chính sách riêng tư theo Nghị định 13/2023 (trỏ privacy-data-law) · Bản quyền nội dung, giấy phép thư viện mã nguồn mở, nhãn hiệu'],
      ['ban-quoc-te', 'Selling internationally from Vietnam', 'Bán ra quốc tế từ Việt Nam', 'Merchant of record lo thuế nước ngoài · Nhận tiền về Việt Nam · Hợp đồng và hoá đơn cho khách nước ngoài · Kiểm quy định ngoại hối'],
    ]],
    ['Chapter 11 — Lessons from cuongthai.com', 'Chương 11 — Bài học từ cuongthai.com', 'Một sản phẩm thật, làm một mình, kể cả chỗ sai.', [
      ['hanh-trinh', 'The journey: from personal site to learning platform', 'Hành trình: từ trang cá nhân tới nền tảng học', 'Những mốc chính · Tính năng nào có người dùng, tính năng nào không · Thứ tự ưu tiên thay đổi thế nào'],
      ['pro', 'Pro membership: codes, tiers, wallet and manual reconciliation', 'Tài khoản Pro: mã kích hoạt, gói, ví điểm và đối soát tay', 'Bắt đầu bằng mã kích hoạt để chưa cần cổng thanh toán · Gói 4 mức · VietQR đối soát tay · Nhắc hạn 7 ngày'],
      ['sai-lam', 'Mistakes: hiding the UI but not the API, cost surprises, outages', 'Sai lầm: ẩn giao diện mà không ẩn API, chi phí bất ngờ, sự cố', 'Feature flag chỉ ẩn giao diện · Chi phí LLM và trần chi phí · Deploy làm sập API · Bài học rút ra'],
    ]],
    ['Chapter 12 — Capstone: validate, build and launch in 8 weeks', 'Chương 12 — Dự án cuối khoá: xác thực, dựng và ra mắt trong 8 tuần', 'Một sản phẩm thật trên Next.js + Express/Spring Boot + PostgreSQL + Redis + Docker + VPS + Cloudflare + R2.', [
      ['tuan-1-2', 'Weeks 1–2: problem, interviews, landing page', 'Tuần 1–2: vấn đề, phỏng vấn, landing page', '10 cuộc phỏng vấn · Landing page + danh sách chờ · Quyết định tiếp hay đổi'],
      ['tuan-3-6', 'Weeks 3–6: MVP with payments and analytics', 'Tuần 3–6: MVP có thanh toán và analytics', 'Luồng chính · Thanh toán sandbox rồi thật · Umami + sự kiện kích hoạt · Sao lưu'],
      ['tuan-7', 'Week 7: launch', 'Tuần 7: ra mắt', 'Product Hunt hoặc cộng đồng Việt Nam · Trả lời mọi bình luận · Ghi số liệu ngày đầu'],
      ['tuan-8', 'Week 8: metrics review and next 90 days', 'Tuần 8: xem lại chỉ số và kế hoạch 90 ngày', 'Kích hoạt, giữ chân, doanh thu · Viết bài nhìn lại công khai · Quyết định tiếp tục hay dừng'],
      ['tong-ket', 'Review and telling the story', 'Tổng kết và kể lại câu chuyện', 'Checklist cả khoá · Dùng dự án làm portfolio và câu chuyện phỏng vấn'],
    ]],
  ]),
};
