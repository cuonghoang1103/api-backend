/**
 * React — "Dự án xuyên suốt khoá" (hợp đồng: docs/du-an-hop-dong.md v1, soạn 22/11/2026).
 *
 * MỘT nguồn sự thật:
 *   1. `duAn` ở cấp gốc của content/courses/react.mjs (import { DU_AN });
 *   2. bài mốc `rx-moc-N` (N = 1..14, một mốc sau mỗi chương, đặt TRƯỚC quiz chương) dựng bằng baiMoc(N);
 *   3. bài `rx-bao-ve-du-an` cuối khoá (baoVeDuAn, sau đề thi cuối khoá) dựng bằng baiBaoVe();
 *   4. lời mời đăng ký `MOI_DANG_KY` nối vào cuối bài "Bắt đầu tại đây" rx-0-8 (bài đó mang cờ dangKyDuAn: true).
 * Sửa yêu cầu một mốc ⇒ sửa Ở ĐÂY; bài trong chương tự đổi theo.
 *
 * Khung mẫu chạy thật của từng mốc nằm ở ./_du-an-ma.mjs (SINH TỰ ĐỘNG từ tệp đã chạy thật — app Vite + React + TS,
 * đề tài mẫu "Habit tracker", cố ý KHÔNG nằm trong danh sách đề tài gợi ý, để nó là bộ khung khởi đầu chứ không phải lời
 * giải để chép). Ứng dụng đặt lịch khám trong bài học vẫn là ví dụ của THẦY; dự án này là của NGƯỜI HỌC.
 *
 * Đề tài KHÔNG trùng FER202 (bán khoá học, thư viện, đặt lịch khám, sneaker, giảng viên–môn, Kanban nhóm, điểm danh):
 * khoá React đi sâu hơn FER202 — TypeScript, hook nâng cao, state lớn, test, hiệu năng, a11y, React 19, deploy.
 *
 * Quy ước chuỗi: dữ liệu viết bằng nháy kép, CHỮ THUẦN "EN|||VI" (không thẻ HTML), không backtick, không gạch chéo ngược.
 */
import { MA, PHIEN_BAN } from './_du-an-ma.mjs';

const L = (chuong, slug) => ({ chuong, slug }); // liên kết bài trong khoá

const DE_TAI = [
  {
    slug: "personal-finance",
    ten: "Personal finance tracker with budgets|||Sổ chi tiêu cá nhân có ngân sách",
    moTa: "People record income and spending in seconds, set a monthly budget per category and see where the money went on clear charts; the app warns before a budget is blown. Money must always be exact (integer VND) and the app must stay usable offline on a phone.|||Người dùng ghi thu chi trong vài giây, đặt ngân sách tháng cho từng danh mục và xem tiền đi đâu trên biểu đồ dễ đọc; app cảnh báo trước khi vượt ngân sách. Tiền luôn phải đúng (VND số nguyên) và app vẫn dùng được khi điện thoại mất mạng.",
    doKho: 2,
    tinhNang: [
      "Quick-add transaction form (amount, category, wallet, date, note)|||Form ghi nhanh giao dịch (số tiền, danh mục, ví, ngày, ghi chú)",
      "Monthly budgets per category with progress bars and an over-budget warning|||Ngân sách tháng theo danh mục có thanh tiến độ và cảnh báo vượt",
      "Transaction list with filters in the URL (month, category, wallet, search)|||Danh sách giao dịch có bộ lọc trên URL (tháng, danh mục, ví, tìm kiếm)",
      "Charts: spending by category and by day|||Biểu đồ: chi theo danh mục và theo ngày",
      "Several wallets (cash, bank card, e-wallet) and transfers between them|||Nhiều ví (tiền mặt, thẻ, ví điện tử) và chuyển tiền giữa các ví",
      "Recurring items (rent, phone bill) generated every month|||Khoản định kỳ (tiền nhà, cước điện thoại) tự sinh mỗi tháng",
      "CSV import from a bank statement and CSV export|||Nhập CSV từ sao kê ngân hàng và xuất CSV",
      "Works offline; sync when back online|||Dùng được khi offline; đồng bộ khi có mạng lại",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Transaction, Category, Wallet, Budget; components TransactionRow, BudgetBar, MonthHeader from a mock-up|||Kiểu Transaction, Category, Wallet, Budget; component TransactionRow, BudgetBar, MonthHeader từ mock-up" },
      { moc: 2, dung: "Add / delete transactions in state; month total and per-category totals derived, not stored|||Thêm / xoá giao dịch bằng state; tổng tháng và tổng theo danh mục tính ra, không lưu riêng" },
      { moc: 3, dung: "Transaction form with Zod: amount > 0 as integer VND, date not in the future, note ≤ 200 chars|||Form giao dịch với Zod: số tiền > 0 là VND nguyên, ngày không ở tương lai, ghi chú ≤ 200 ký tự" },
      { moc: 4, dung: "Persist drafts with useLocalStorage; useDebounce on search; document title shows money left this month|||Lưu nháp bằng useLocalStorage; useDebounce cho ô tìm; tiêu đề tab hiện số tiền còn lại tháng này" },
      { moc: 5, dung: "Zustand store for wallets and settings; month / category / wallet filters in the URL|||Store Zustand cho ví và cài đặt; bộ lọc tháng / danh mục / ví trên URL" },
      { moc: 6, dung: "Transactions through TanStack Query; optimistic delete with rollback; empty month state|||Giao dịch qua TanStack Query; xoá lạc quan có hoàn tác; trạng thái tháng chưa có giao dịch" },
      { moc: 7, dung: "Routes: dashboard, transactions, transaction/:id, budgets, wallets, settings, 404; login gate|||Tuyến: tổng quan, giao dịch, giao dịch/:id, ngân sách, ví, cài đặt, 404; chặn khi chưa đăng nhập" },
      { moc: 8, dung: "Profile a 3 000-row month; lazy-load the charts page; charts get a text table alternative|||Đo một tháng 3 000 dòng; tải lười trang biểu đồ; biểu đồ có bảng chữ thay thế" },
      { moc: 9, dung: "Tests: budget arithmetic, form errors, filters from URL, optimistic delete rollback|||Test: phép tính ngân sách, lỗi form, bộ lọc từ URL, hoàn tác khi xoá lỗi" },
      { moc: 10, dung: "Story: record a coffee, see the budget bar move, get warned at 90 percent; preview deploy|||Câu chuyện: ghi một ly cà phê, thấy thanh ngân sách nhích, được cảnh báo ở 90 phần trăm; deploy bản xem trước" },
      { moc: 11, dung: "Key resets the edit form per transaction; portal for the quick-add sheet; error boundary around charts|||Key làm mới form sửa theo từng giao dịch; portal cho khung ghi nhanh; error boundary quanh biểu đồ" },
      { moc: 12, dung: "useOptimistic quick-add; useDeferredValue on search over a year of data|||Ghi nhanh bằng useOptimistic; useDeferredValue cho tìm kiếm trên dữ liệu cả năm" },
      { moc: 13, dung: "Headless useMoneyInput hook; virtualised year view; vi/en with Intl currency and dates|||Hook headless useMoneyInput; danh sách cả năm được ảo hoá; vi/en với Intl cho tiền và ngày" },
      { moc: 14, dung: "Auth with refresh-once, offline queue with Idempotency-Key, CSP, deploy on HTTPS|||Xác thực refresh một lần, hàng đợi offline có Idempotency-Key, CSP, deploy HTTPS" },
    ],
    thamKhaoThat: [
      "Money Lover and MISA MoneyKeeper (expense tracking apps popular in Vietnam)|||Money Lover và MISA MoneyKeeper (app quản lý chi tiêu phổ biến ở Việt Nam)",
      "YNAB (You Need A Budget) — budgeting by category|||YNAB (You Need A Budget) — lập ngân sách theo danh mục",
    ],
    anh: null,
  },
  {
    slug: "spaced-repetition",
    ten: "Spaced-repetition flashcards|||Thẻ ghi nhớ lặp lại ngắt quãng",
    moTa: "Learners build decks of flashcards (vocabulary, interview questions, formulas) and review them in short daily sessions; a scheduling rule decides when each card comes back, so hard cards return sooner. The study screen must be fast and fully usable with the keyboard.|||Người học tạo bộ thẻ (từ vựng, câu phỏng vấn, công thức) và ôn trong các phiên ngắn mỗi ngày; một luật xếp lịch quyết định khi nào thẻ quay lại, thẻ khó quay lại sớm hơn. Màn hình ôn phải nhanh và dùng trọn bằng bàn phím.",
    doKho: 2,
    tinhNang: [
      "Decks and cards (front, back, tags, optional image)|||Bộ thẻ và thẻ (mặt trước, mặt sau, thẻ tag, ảnh tuỳ chọn)",
      "Study session: flip, grade Again / Hard / Good / Easy with keys 1–4|||Phiên ôn: lật thẻ, chấm Lại / Khó / Được / Dễ bằng phím 1–4",
      "Scheduling rule (SM-2 style) as a pure, tested function|||Luật xếp lịch (kiểu SM-2) là hàm thuần có test",
      "Due-today counter and a daily goal|||Bộ đếm thẻ đến hạn hôm nay và mục tiêu mỗi ngày",
      "Statistics: reviews per day heatmap, retention rate|||Thống kê: bản đồ nhiệt số lượt ôn theo ngày, tỉ lệ nhớ",
      "Import cards from CSV / paste; export a deck|||Nhập thẻ từ CSV / dán; xuất bộ thẻ",
      "Safe rich text on cards (bold, lists) without XSS|||Định dạng chữ trên thẻ (đậm, danh sách) an toàn, không XSS",
      "Shareable public deck link (read-only)|||Link chia sẻ bộ thẻ công khai (chỉ đọc)",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Deck, Card, Review; components DeckCard, CardFace, DueBadge|||Kiểu Deck, Card, Review; component DeckCard, CardFace, DueBadge" },
      { moc: 2, dung: "Flip and grade in state; due count and session progress derived|||Lật và chấm thẻ bằng state; số thẻ đến hạn và tiến độ phiên tính ra" },
      { moc: 3, dung: "Card editor with Zod (front/back required, ≤ 500 chars); Enter during IME must not save|||Form sửa thẻ với Zod (bắt buộc hai mặt, ≤ 500 ký tự); Enter khi đang gõ dấu không được lưu" },
      { moc: 4, dung: "Keyboard shortcuts with an effect and cleanup; resume an interrupted session from storage|||Phím tắt bằng effect có dọn dẹp; ôn tiếp phiên bị ngắt từ storage" },
      { moc: 5, dung: "useReducer for the session state machine (front → back → graded → next); deck filter in the URL|||useReducer cho máy trạng thái phiên ôn (mặt trước → mặt sau → đã chấm → thẻ kế); lọc bộ thẻ trên URL" },
      { moc: 6, dung: "Decks and due cards via TanStack Query; grading as a mutation with retry|||Bộ thẻ và thẻ đến hạn qua TanStack Query; chấm thẻ là mutation có thử lại" },
      { moc: 7, dung: "Routes: decks, deck/:id, study/:deckId, stats, import, shared/:token, 404|||Tuyến: bộ thẻ, bộ thẻ/:id, ôn/:deckId, thống kê, nhập, chia sẻ/:token, 404" },
      { moc: 8, dung: "Measure the 5 000-card deck page; whole study flow by keyboard and screen reader|||Đo trang bộ thẻ 5 000 thẻ; cả luồng ôn bằng bàn phím và trình đọc màn hình" },
      { moc: 9, dung: "Tests: scheduling edge cases, keyboard grading, session reducer, import parser|||Test: ca biên của luật xếp lịch, chấm bằng phím, reducer phiên ôn, bộ đọc tệp nhập" },
      { moc: 10, dung: "Story: create a deck, import 30 cards, finish today's session; preview deploy|||Câu chuyện: tạo bộ thẻ, nhập 30 thẻ, ôn xong phiên hôm nay; deploy bản xem trước" },
      { moc: 11, dung: "Key per card resets the flip state; focus management between cards; error boundary on stats|||Key theo thẻ làm mới trạng thái lật; quản lý focus giữa các thẻ; error boundary cho thống kê" },
      { moc: 12, dung: "Grade with useOptimistic so the next card appears at once; transition for the stats filter|||Chấm bằng useOptimistic để thẻ kế hiện ngay; transition cho bộ lọc thống kê" },
      { moc: 13, dung: "Compound CardEditor; virtualised card table; sanitised card HTML; vi/en interface|||CardEditor dạng compound; bảng thẻ ảo hoá; HTML trên thẻ được làm sạch; giao diện vi/en" },
      { moc: 14, dung: "Auth, offline review queue synced later, public share page with CSP, deploy|||Xác thực, hàng đợi lượt ôn offline đồng bộ sau, trang chia sẻ công khai có CSP, deploy" },
    ],
    thamKhaoThat: [
      "Anki (open-source spaced repetition, the SM-2 family of algorithms)|||Anki (phần mềm lặp lại ngắt quãng mã nguồn mở, họ thuật toán SM-2)",
      "Quizlet and Memrise (flashcards and study modes)|||Quizlet và Memrise (thẻ ghi nhớ và các chế độ học)",
    ],
    anh: null,
  },
  {
    slug: "rental-search",
    ten: "Rental room and apartment search|||Tìm phòng trọ và căn hộ cho thuê",
    moTa: "Tenants search rental listings with many filters (district, price, area, furniture), compare a few rooms side by side and contact the owner; owners post a listing through a multi-step form with photos. Search results must be shareable as a link and stay smooth with thousands of results.|||Người thuê tìm tin cho thuê với nhiều bộ lọc (quận, giá, diện tích, nội thất), so sánh vài phòng cạnh nhau và liên hệ chủ nhà; chủ nhà đăng tin qua form nhiều bước có ảnh. Kết quả tìm phải chia sẻ được bằng link và vẫn mượt khi có hàng nghìn kết quả.",
    doKho: 2,
    tinhNang: [
      "Search with filters: district, price range, area, room type, furniture, pets|||Tìm kiếm có bộ lọc: quận, khoảng giá, diện tích, loại phòng, nội thất, thú cưng",
      "All filters, sort and page in the URL (shareable, Back works)|||Mọi bộ lọc, sắp xếp và trang nằm trên URL (chia sẻ được, nút Back chạy đúng)",
      "Listing detail with photo gallery and lightbox|||Trang chi tiết tin có thư viện ảnh và lightbox",
      "Favourites and compare up to 3 listings|||Yêu thích và so sánh tối đa 3 tin",
      "Contact-the-owner form with spam protection|||Form liên hệ chủ nhà có chống spam",
      "Post a listing: multi-step form with photo previews and a draft|||Đăng tin: form nhiều bước có xem trước ảnh và lưu nháp",
      "Owner dashboard: my listings, views, hide / renew|||Trang chủ nhà: tin của tôi, lượt xem, ẩn / gia hạn",
      "Smooth result list with thousands of items|||Danh sách kết quả mượt với hàng nghìn tin",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Listing, District, Owner; components ListingCard, PriceTag, FilterChip|||Kiểu Listing, District, Owner; component ListingCard, PriceTag, FilterChip" },
      { moc: 2, dung: "Favourite and compare in state (max 3, immutable updates); result count derived|||Yêu thích và so sánh bằng state (tối đa 3, cập nhật bất biến); số kết quả tính ra" },
      { moc: 3, dung: "Contact form and step 1 of post-a-listing with Zod (phone pattern, price ≥ 500 000)|||Form liên hệ và bước 1 của đăng tin với Zod (mẫu số điện thoại, giá ≥ 500 000)" },
      { moc: 4, dung: "Debounced search; object URLs for photo previews revoked in cleanup; draft in localStorage|||Tìm có debounce; URL ảnh xem trước được thu hồi khi dọn dẹp; nháp lưu localStorage" },
      { moc: 5, dung: "Every filter in the URL; Zustand for favourites and compare tray|||Mọi bộ lọc trên URL; Zustand cho yêu thích và khay so sánh" },
      { moc: 6, dung: "Search results via TanStack Query keyed by the filters; keep previous data while paging|||Kết quả tìm qua TanStack Query có khoá theo bộ lọc; giữ dữ liệu cũ khi chuyển trang" },
      { moc: 7, dung: "Routes: search, listing/:id, compare, post (nested steps), my-listings, 404|||Tuyến: tìm kiếm, tin/:id, so sánh, đăng tin (các bước lồng nhau), tin của tôi, 404" },
      { moc: 8, dung: "Profile filter changes on 2 000 results; lazy gallery; accessible filter panel and slider|||Đo đổi bộ lọc trên 2 000 kết quả; thư viện ảnh tải lười; bảng lọc và thanh trượt dễ tiếp cận" },
      { moc: 9, dung: "Tests: URL ↔ filter round-trip, compare limit, multi-step validation, API states|||Test: URL ↔ bộ lọc hai chiều, giới hạn so sánh, kiểm từng bước, các trạng thái API" },
      { moc: 10, dung: "Story: find a room under 4 million in district 7, compare two, send a message; preview deploy|||Câu chuyện: tìm phòng dưới 4 triệu ở quận 7, so sánh hai phòng, gửi tin nhắn; deploy bản xem trước" },
      { moc: 11, dung: "Lightbox in a portal with focus trap; layout effect for the sticky compare tray; error boundary on the map|||Lightbox trong portal có giữ focus; layout effect cho khay so sánh dính; error boundary cho bản đồ" },
      { moc: 12, dung: "useTransition when filters change; Suspense boundaries for detail sections|||useTransition khi đổi bộ lọc; ranh giới Suspense cho các phần của trang chi tiết" },
      { moc: 13, dung: "Headless useRangeSlider; virtualised results; owner text sanitised; vi/en money and area units|||Hook headless useRangeSlider; kết quả ảo hoá; mô tả của chủ nhà được làm sạch; vi/en cho tiền và đơn vị diện tích" },
      { moc: 14, dung: "Owner login with refresh-once, image upload with retry, CSP and cache headers, deploy|||Đăng nhập chủ nhà có refresh một lần, tải ảnh có thử lại, CSP và header cache, deploy" },
    ],
    thamKhaoThat: [
      "Batdongsan.com.vn and Chợ Tốt Nhà (rental listings in Vietnam)|||Batdongsan.com.vn và Chợ Tốt Nhà (tin cho thuê ở Việt Nam)",
      "Airbnb search (filters in the URL, map and list, compare)|||Trang tìm kiếm của Airbnb (bộ lọc trên URL, bản đồ và danh sách)",
    ],
    anh: null,
  },
  {
    slug: "job-board-ats",
    ten: "Job board with an applicant tracker|||Trang tuyển dụng kèm theo dõi ứng viên",
    moTa: "Candidates search IT jobs, apply with a CV through a multi-step form and follow the status of every application; recruiters move applicants through hiring stages, leave notes and schedule interviews. Two very different users share one codebase, so roles, routing and state design really matter.|||Ứng viên tìm việc IT, nộp hồ sơ kèm CV qua form nhiều bước và theo dõi trạng thái từng hồ sơ; nhà tuyển dụng chuyển ứng viên qua các vòng, ghi chú và hẹn phỏng vấn. Hai kiểu người dùng rất khác nhau dùng chung một codebase, nên vai trò, định tuyến và thiết kế state thật sự quan trọng.",
    doKho: 3,
    tinhNang: [
      "Job search: keyword, skills, level, salary range, remote; filters in the URL|||Tìm việc: từ khoá, kỹ năng, cấp bậc, khoảng lương, remote; bộ lọc trên URL",
      "Job detail and save-for-later|||Chi tiết việc làm và lưu để xem sau",
      "Apply: multi-step form (profile → CV upload → questions → review)|||Nộp hồ sơ: form nhiều bước (hồ sơ → tải CV → câu hỏi → xem lại)",
      "Candidate dashboard: every application with its status timeline|||Trang ứng viên: mọi hồ sơ đã nộp kèm dòng thời gian trạng thái",
      "Recruiter pipeline: stages Applied → Screening → Interview → Offer, movable by keyboard too|||Quy trình của nhà tuyển dụng: các vòng Nộp → Sàng lọc → Phỏng vấn → Đề nghị, chuyển được cả bằng bàn phím",
      "Notes and ratings on an applicant, visible only to the hiring team|||Ghi chú và chấm điểm ứng viên, chỉ đội tuyển dụng thấy",
      "Interview scheduling with time-zone safe dates|||Hẹn phỏng vấn với ngày giờ đúng múi giờ",
      "Role-based UI: candidate, recruiter, admin|||Giao diện theo vai trò: ứng viên, nhà tuyển dụng, quản trị",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Job, Application, Stage, Candidate; components JobCard, StageColumn, StatusPill|||Kiểu Job, Application, Stage, Candidate; component JobCard, StageColumn, StatusPill" },
      { moc: 2, dung: "Save jobs and move an applicant between stages in state (immutable); counts per stage derived|||Lưu việc và chuyển ứng viên giữa các vòng bằng state (bất biến); số lượng mỗi vòng tính ra" },
      { moc: 3, dung: "Apply step 1–2 with React Hook Form + Zod; CV file type and size checked on the client|||Bước 1–2 của nộp hồ sơ với React Hook Form + Zod; kiểm loại và dung lượng CV ở client" },
      { moc: 4, dung: "Unsaved-changes guard with beforeunload and cleanup; useDebounce on job search|||Chặn rời trang khi chưa lưu bằng beforeunload có dọn dẹp; useDebounce cho tìm việc" },
      { moc: 5, dung: "Context for the current user and role; reducer for the multi-step apply wizard; search in the URL|||Context cho người dùng và vai trò hiện tại; reducer cho trình nộp hồ sơ nhiều bước; tìm kiếm trên URL" },
      { moc: 6, dung: "Jobs, applications and pipeline via TanStack Query; optimistic stage move with rollback|||Việc làm, hồ sơ và quy trình qua TanStack Query; chuyển vòng lạc quan có hoàn tác" },
      { moc: 7, dung: "Two layouts (candidate / recruiter), nested apply steps, role guards, 403 and 404 pages|||Hai layout (ứng viên / nhà tuyển dụng), các bước nộp hồ sơ lồng nhau, chặn theo vai trò, trang 403 và 404" },
      { moc: 8, dung: "Profile the pipeline with 500 applicants; keyboard alternative to drag and drop; axe clean|||Đo quy trình có 500 ứng viên; thao tác bàn phím thay cho kéo thả; axe sạch" },
      { moc: 9, dung: "Tests: wizard steps, role guards, optimistic move rollback, salary filter|||Test: các bước nộp hồ sơ, chặn theo vai trò, hoàn tác khi chuyển vòng lỗi, lọc lương" },
      { moc: 10, dung: "Story: candidate applies, recruiter moves them to Interview, candidate sees the new status; preview deploy|||Câu chuyện: ứng viên nộp, nhà tuyển dụng chuyển sang Phỏng vấn, ứng viên thấy trạng thái mới; deploy bản xem trước" },
      { moc: 11, dung: "Applicant side panel in a portal; key resets notes per applicant; error boundary per stage column|||Khung chi tiết ứng viên trong portal; key làm mới ghi chú theo ứng viên; error boundary cho từng cột" },
      { moc: 12, dung: "useActionState for the notes form; useOptimistic stage moves; deferred job search|||useActionState cho form ghi chú; chuyển vòng bằng useOptimistic; tìm việc dùng giá trị trì hoãn" },
      { moc: 13, dung: "Compound Pipeline component; virtualised applicant list; sanitised job descriptions; vi/en and Intl dates|||Component Pipeline dạng compound; danh sách ứng viên ảo hoá; mô tả việc làm được làm sạch; vi/en và ngày theo Intl" },
      { moc: 14, dung: "Auth with roles and refresh-once, CV upload with timeout and retry, CSP, deploy|||Xác thực có vai trò và refresh một lần, tải CV có timeout và thử lại, CSP, deploy" },
    ],
    thamKhaoThat: [
      "TopCV and ITviec (job boards in Vietnam)|||TopCV và ITviec (trang tuyển dụng ở Việt Nam)",
      "Greenhouse and Lever (applicant tracking systems used by recruiters)|||Greenhouse và Lever (hệ thống theo dõi ứng viên của nhà tuyển dụng)",
    ],
    anh: null,
  },
  {
    slug: "shop-admin",
    ten: "Online shop admin dashboard|||Trang quản trị cửa hàng online",
    moTa: "Shop staff manage products, orders and customers from one dashboard: KPI cards, a fast orders table with server-side filtering, an order detail with its status timeline and a product editor with variants. It is the kind of internal tool most frontend developers build in their first job.|||Nhân viên cửa hàng quản lý sản phẩm, đơn hàng và khách hàng trên một trang quản trị: thẻ chỉ số, bảng đơn hàng nhanh có lọc phía máy chủ, chi tiết đơn có dòng thời gian trạng thái và trình sửa sản phẩm có biến thể. Đây đúng là loại công cụ nội bộ mà phần lớn lập trình viên frontend làm ở công việc đầu tiên.",
    doKho: 3,
    tinhNang: [
      "KPI cards: revenue today, orders, average order value, low stock|||Thẻ chỉ số: doanh thu hôm nay, số đơn, giá trị đơn trung bình, hàng sắp hết",
      "Orders table: server pagination, sort, filter by status and date, bulk actions|||Bảng đơn hàng: phân trang phía máy chủ, sắp xếp, lọc theo trạng thái và ngày, thao tác hàng loạt",
      "Order detail with status timeline and allowed transitions only|||Chi tiết đơn có dòng thời gian trạng thái, chỉ cho chuyển trạng thái hợp lệ",
      "Product editor with variants (size, colour) and price/stock per variant|||Trình sửa sản phẩm có biến thể (cỡ, màu) và giá/tồn kho theo biến thể",
      "Customers list and customer detail with order history|||Danh sách khách hàng và chi tiết khách kèm lịch sử mua",
      "Role-based UI: owner, staff, viewer|||Giao diện theo vai trò: chủ shop, nhân viên, chỉ xem",
      "Dark mode and vi/en interface|||Chế độ tối và giao diện vi/en",
      "CSV export of the current filtered view|||Xuất CSV đúng khung đang lọc",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Order, OrderStatus, Product, Variant, Customer; components KpiCard, OrderRow, StatusBadge|||Kiểu Order, OrderStatus, Product, Variant, Customer; component KpiCard, OrderRow, StatusBadge" },
      { moc: 2, dung: "Row selection and bulk mark-as-packed in state; KPI numbers derived from the order list|||Chọn dòng và đánh dấu đóng gói hàng loạt bằng state; số liệu KPI tính ra từ danh sách đơn" },
      { moc: 3, dung: "Product editor with useFieldArray for variants; Zod: unique SKU, price and stock ≥ 0|||Trình sửa sản phẩm dùng useFieldArray cho biến thể; Zod: SKU không trùng, giá và tồn kho ≥ 0" },
      { moc: 4, dung: "Theme preference synced to the html element and storage; auto-refresh KPIs with an interval cleaned up|||Chế độ sáng/tối đồng bộ vào thẻ html và storage; tự làm mới KPI bằng interval có dọn dẹp" },
      { moc: 5, dung: "Context split: session vs theme; table filters, sort and page in the URL|||Tách context: phiên đăng nhập và giao diện; bộ lọc, sắp xếp, trang của bảng nằm trên URL" },
      { moc: 6, dung: "Orders via TanStack Query with placeholder data while paging; status change as mutation + invalidation|||Đơn hàng qua TanStack Query, giữ dữ liệu cũ khi chuyển trang; đổi trạng thái là mutation + làm mới cache" },
      { moc: 7, dung: "Admin layout with sidebar; nested product routes (list / new / :id/edit); role guards; 404|||Layout quản trị có thanh bên; tuyến sản phẩm lồng nhau (danh sách / mới / :id/sửa); chặn theo vai trò; 404" },
      { moc: 8, dung: "Profile the orders table with 1 000 rows; lazy-load the product editor; accessible data table|||Đo bảng đơn 1 000 dòng; tải lười trình sửa sản phẩm; bảng dữ liệu dễ tiếp cận" },
      { moc: 9, dung: "Tests: status transitions, variant form, URL filters, permission-based buttons|||Test: luật chuyển trạng thái, form biến thể, bộ lọc trên URL, nút theo quyền" },
      { moc: 10, dung: "Story: staff filters today's paid orders, packs three in bulk, owner sees revenue update; preview deploy|||Câu chuyện: nhân viên lọc đơn đã thanh toán hôm nay, đóng gói ba đơn một lượt, chủ shop thấy doanh thu cập nhật; deploy bản xem trước" },
      { moc: 11, dung: "Confirm dialog in a portal; key per product resets the editor; error boundary per dashboard widget|||Hộp xác nhận trong portal; key theo sản phẩm làm mới trình sửa; error boundary cho từng widget" },
      { moc: 12, dung: "useTransition for table filtering; useActionState for quick stock edits; React Compiler measured|||useTransition khi lọc bảng; useActionState để sửa nhanh tồn kho; đo khi bật React Compiler" },
      { moc: 13, dung: "Headless useDataTable hook; virtualised rows; sanitised product descriptions; vi/en with Intl|||Hook headless useDataTable; dòng ảo hoá; mô tả sản phẩm được làm sạch; vi/en với Intl" },
      { moc: 14, dung: "Staff login with refresh-once, idempotent bulk actions, CSP, bundle budget, deploy|||Đăng nhập nhân viên có refresh một lần, thao tác hàng loạt idempotent, CSP, ngân sách bundle, deploy" },
    ],
    thamKhaoThat: [
      "Shopify admin (orders, products, customers)|||Trang quản trị Shopify (đơn hàng, sản phẩm, khách hàng)",
      "Haravan and Sapo (shop management platforms in Vietnam)|||Haravan và Sapo (nền tảng quản lý bán hàng ở Việt Nam)",
    ],
    anh: null,
  },
  {
    slug: "meal-planner",
    ten: "Recipes and weekly meal planner|||Công thức nấu ăn và lên thực đơn tuần",
    moTa: "Home cooks browse recipes, plan meals for the week on a calendar grid and get a shopping list that adds up the ingredients automatically; a cooking mode shows one step at a time in big text with timers. A friendly first project with real logic in the ingredient maths.|||Người nấu ăn ở nhà xem công thức, lên thực đơn cả tuần trên lưới lịch và nhận danh sách đi chợ tự cộng nguyên liệu; chế độ nấu hiện từng bước chữ to kèm hẹn giờ. Một dự án đầu tay dễ chịu nhưng có logic thật ở phần tính nguyên liệu.",
    doKho: 1,
    tinhNang: [
      "Recipe list with search and filters (time, diet, ingredient)|||Danh sách công thức có tìm kiếm và bộ lọc (thời gian, chế độ ăn, nguyên liệu)",
      "Recipe detail with a servings scaler (2 → 5 people)|||Chi tiết công thức có chỉnh khẩu phần (2 → 5 người)",
      "Weekly planner grid: breakfast / lunch / dinner × 7 days|||Lưới thực đơn tuần: sáng / trưa / tối × 7 ngày",
      "Shopping list that merges the same ingredient across recipes|||Danh sách đi chợ gộp cùng một nguyên liệu từ nhiều món",
      "Cooking mode: one step at a time, big text, step timers|||Chế độ nấu: từng bước một, chữ to, hẹn giờ theo bước",
      "Add your own recipe with ingredient rows|||Thêm công thức riêng với các dòng nguyên liệu",
      "Favourites and recently cooked|||Món yêu thích và món vừa nấu",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Recipe, Ingredient, PlanSlot; components RecipeCard, IngredientLine, PlannerCell|||Kiểu Recipe, Ingredient, PlanSlot; component RecipeCard, IngredientLine, PlannerCell" },
      { moc: 2, dung: "Put recipes into planner slots in state; shopping list derived by merging ingredients|||Đặt công thức vào ô thực đơn bằng state; danh sách đi chợ tính ra bằng cách gộp nguyên liệu" },
      { moc: 3, dung: "Add-recipe form with ingredient rows (useFieldArray) and Zod: quantity > 0, unit from a list|||Form thêm công thức có các dòng nguyên liệu (useFieldArray) và Zod: số lượng > 0, đơn vị trong danh sách" },
      { moc: 4, dung: "Step timer with interval cleanup; Screen Wake Lock in cooking mode; plan saved locally|||Hẹn giờ theo bước có dọn interval; giữ màn hình sáng ở chế độ nấu; thực đơn lưu cục bộ" },
      { moc: 5, dung: "Zustand store for the week plan; recipe filters in the URL|||Store Zustand cho thực đơn tuần; bộ lọc công thức trên URL" },
      { moc: 6, dung: "Recipes from a mock API via TanStack Query; favourite toggle as an optimistic mutation|||Công thức từ API giả qua TanStack Query; bật/tắt yêu thích là mutation lạc quan" },
      { moc: 7, dung: "Routes: recipes, recipe/:id, recipe/:id/cook, planner, shopping-list, new, 404|||Tuyến: công thức, công thức/:id, công thức/:id/nấu, thực đơn, đi chợ, thêm mới, 404" },
      { moc: 8, dung: "Measure the planner grid; lazy cooking mode; planner usable by keyboard with clear labels|||Đo lưới thực đơn; tải lười chế độ nấu; lưới dùng được bằng bàn phím với nhãn rõ ràng" },
      { moc: 9, dung: "Tests: ingredient merge and scaling maths, planner interactions, form rows|||Test: phép gộp và nhân khẩu phần nguyên liệu, thao tác trên lưới thực đơn, các dòng của form" },
      { moc: 10, dung: "Story: plan three dinners, get one merged shopping list, cook one in cooking mode; preview deploy|||Câu chuyện: lên ba bữa tối, nhận một danh sách đi chợ đã gộp, nấu một món ở chế độ nấu; deploy bản xem trước" },
      { moc: 11, dung: "Recipe picker in a portal; key resets the step index per recipe; error boundary on cooking mode|||Hộp chọn món trong portal; key làm mới số bước theo công thức; error boundary cho chế độ nấu" },
      { moc: 12, dung: "useOptimistic when placing a recipe; Suspense for recipe detail|||useOptimistic khi đặt món vào thực đơn; Suspense cho chi tiết công thức" },
      { moc: 13, dung: "Compound Planner component; safe recipe notes; vi/en units and number formatting|||Component Planner dạng compound; ghi chú công thức an toàn; vi/en cho đơn vị và định dạng số" },
      { moc: 14, dung: "Login to sync the plan across devices, offline shopping list, CSP, deploy|||Đăng nhập để đồng bộ thực đơn giữa các máy, danh sách đi chợ dùng offline, CSP, deploy" },
    ],
    thamKhaoThat: [
      "Cookpad (recipes shared by home cooks)|||Cookpad (công thức do người nấu tại nhà chia sẻ)",
      "Mealime and Paprika (meal planning and shopping lists)|||Mealime và Paprika (lên thực đơn và danh sách đi chợ)",
    ],
    anh: null,
  },
  {
    slug: "markdown-notes",
    ten: "Markdown knowledge base (a small Notion)|||Sổ tay ghi chú Markdown (Notion thu nhỏ)",
    moTa: "Users write notes in Markdown with a live preview, organise them in folders and tags, link notes to each other and find anything with full-text search and a command palette; edits autosave and a conflict is detected when the same note changed in another tab. Heavy on state, effects, security and keyboard UX.|||Người dùng viết ghi chú bằng Markdown có xem trước trực tiếp, sắp vào thư mục và tag, liên kết ghi chú với nhau và tìm mọi thứ bằng tìm kiếm toàn văn và bảng lệnh; sửa là tự lưu và phát hiện xung đột khi cùng ghi chú đã đổi ở tab khác. Nặng về state, effect, bảo mật và trải nghiệm bàn phím.",
    doKho: 3,
    tinhNang: [
      "Folder tree and tags; move notes between folders|||Cây thư mục và tag; chuyển ghi chú giữa các thư mục",
      "Markdown editor with live, sanitised preview|||Trình soạn Markdown có xem trước trực tiếp, đã làm sạch",
      "Autosave with a saved / saving / offline indicator|||Tự lưu có chỉ báo đã lưu / đang lưu / offline",
      "Conflict detection when the note changed elsewhere (version number)|||Phát hiện xung đột khi ghi chú đã đổi ở nơi khác (số phiên bản)",
      "Links between notes and a backlinks panel|||Liên kết giữa các ghi chú và khung liên kết ngược",
      "Full-text search and a Ctrl+K command palette|||Tìm kiếm toàn văn và bảng lệnh Ctrl+K",
      "Trash with restore|||Thùng rác có khôi phục",
      "Share a note as a read-only public page|||Chia sẻ ghi chú thành trang công khai chỉ đọc",
    ],
    banDoChuong: [
      { moc: 1, dung: "Types Note, Folder, Tag; components FolderTree (recursive), NoteListItem, TagChip|||Kiểu Note, Folder, Tag; component FolderTree (đệ quy), NoteListItem, TagChip" },
      { moc: 2, dung: "Select, rename and move notes in state; expanded folders and counts derived|||Chọn, đổi tên và chuyển ghi chú bằng state; thư mục đang mở và số đếm tính ra" },
      { moc: 3, dung: "Note title / tags form with Zod; editor keeps IME composition safe for Vietnamese|||Form tiêu đề / tag với Zod; trình soạn giữ an toàn khi gõ tiếng Việt có IME" },
      { moc: 4, dung: "Debounced autosave effect with cleanup; storage event to notice another tab|||Effect tự lưu có debounce và dọn dẹp; sự kiện storage để biết tab khác đã sửa" },
      { moc: 5, dung: "Reducer for the editor state (dirty / saving / saved / conflict); open note and folder in the URL|||Reducer cho trạng thái trình soạn (chưa lưu / đang lưu / đã lưu / xung đột); ghi chú và thư mục đang mở nằm trên URL" },
      { moc: 6, dung: "Notes via TanStack Query; save mutation sends the version, 409 shows a conflict banner|||Ghi chú qua TanStack Query; mutation lưu gửi kèm phiên bản, 409 hiện băng báo xung đột" },
      { moc: 7, dung: "Routes: notes/:folder?, note/:id, search, trash, share/:token, 404; three-pane layout|||Tuyến: ghi chú/:thư mục?, ghi chú/:id, tìm kiếm, thùng rác, chia sẻ/:token, 404; layout ba khung" },
      { moc: 8, dung: "Profile typing in a 20 000-word note; lazy Markdown preview; command palette accessible as a combobox|||Đo khi gõ trong ghi chú 20 000 chữ; xem trước Markdown tải lười; bảng lệnh dễ tiếp cận như combobox" },
      { moc: 9, dung: "Tests: autosave timing with fake timers, conflict flow, sanitiser, palette keyboard|||Test: thời điểm tự lưu với đồng hồ giả, luồng xung đột, bộ làm sạch, bàn phím của bảng lệnh" },
      { moc: 10, dung: "Story: write a note, link it from another, find it with Ctrl+K, resolve a conflict; preview deploy|||Câu chuyện: viết một ghi chú, liên kết từ ghi chú khác, tìm bằng Ctrl+K, giải quyết xung đột; deploy bản xem trước" },
      { moc: 11, dung: "Command palette in a portal; key per note resets the editor; error boundary around the preview|||Bảng lệnh trong portal; key theo ghi chú làm mới trình soạn; error boundary quanh khung xem trước" },
      { moc: 12, dung: "useDeferredValue for the live preview; useTransition for search; useOptimistic rename|||useDeferredValue cho xem trước trực tiếp; useTransition cho tìm kiếm; đổi tên bằng useOptimistic" },
      { moc: 13, dung: "Compound SplitPane; virtualised note list; DOMPurify on rendered Markdown; vi/en|||SplitPane dạng compound; danh sách ghi chú ảo hoá; DOMPurify cho Markdown đã render; vi/en" },
      { moc: 14, dung: "Auth with refresh-once, offline edits queued, strict CSP for the public share page, deploy|||Xác thực refresh một lần, sửa offline được xếp hàng, CSP chặt cho trang chia sẻ công khai, deploy" },
    ],
    thamKhaoThat: [
      "Notion and Obsidian (notes, links between notes, command palette)|||Notion và Obsidian (ghi chú, liên kết giữa ghi chú, bảng lệnh)",
      "Bear and HackMD (Markdown editors with live preview)|||Bear và HackMD (trình soạn Markdown có xem trước trực tiếp)",
    ],
    anh: null,
  },
];

const MOC = [
  {
    so: 1, slug: "rx-moc-1", sauChuong: "Chapter 1 — Components and props|||Chương 1 — Component và props",
    ten: "Your app as a typed component tree|||App của bạn thành cây component có kiểu",
    lead: "Before anything moves on screen, turn your topic into a mock-up, a set of TypeScript types and a tree of small, pure components fed with seed data. Every later chapter adds behaviour to this tree, so getting the pieces right now saves rewrites later.|||Trước khi có gì chuyển động trên màn hình, hãy biến đề tài thành một mock-up, một bộ kiểu TypeScript và một cây component nhỏ, thuần, nhận dữ liệu mẫu. Mọi chương sau chỉ thêm hành vi vào cây này, nên chia đúng mảnh từ bây giờ đỡ phải viết lại về sau.",
    yeuCau: [
      "Create the repository with Vite (React + TypeScript template); README.md with a one-sentence pitch, the 6–12 features of your topic and a screenshot or photo of a hand-drawn mock-up of the main screen|||Tạo repo bằng Vite (mẫu React + TypeScript); README.md có câu giới thiệu, 6–12 tính năng của đề tài và ảnh chụp mock-up màn hình chính (vẽ tay cũng được)",
      "A types file (src/types.ts or per feature) describing the main entities of your topic — no any|||Một tệp kiểu (src/types.ts hoặc theo từng tính năng) mô tả các thực thể chính của đề tài — không dùng any",
      "At least 5 components, one per file, each with a typed props interface; at least one uses children|||Ít nhất 5 component, mỗi cái một tệp, mỗi cái có interface props có kiểu; ít nhất một cái dùng children",
      "The main list of your topic rendered from seed data with map and a stable key from the data (never the index)|||Danh sách chính của đề tài render từ dữ liệu mẫu bằng map với key ổn định lấy từ dữ liệu (không bao giờ là index)",
      "An empty state: what the screen shows when the list has no items|||Một trạng thái rỗng: màn hình hiện gì khi danh sách không có mục nào",
      "npm run build passes (tsc -b and vite build) with zero type errors|||npm run build chạy qua (tsc -b và vite build) với 0 lỗi kiểu",
    ],
    nangCao: [
      "Draw the component tree (boxes and arrows) in the README and mark which component will own which data later|||Vẽ cây component (hộp và mũi tên) trong README và đánh dấu component nào sẽ giữ dữ liệu nào về sau",
      "Turn on strict TypeScript options (strict, noUncheckedIndexedAccess) and fix what they find|||Bật các tuỳ chọn TypeScript chặt (strict, noUncheckedIndexedAccess) và sửa những gì chúng tìm ra",
    ],
    datKhi: [
      "npm run build prints the dist files and no error|||npm run build in ra các tệp dist và không có lỗi",
      "The main screen shows your seed data in at least 5 separate components|||Màn hình chính hiện dữ liệu mẫu của bạn qua ít nhất 5 component riêng",
      "Searching the code for key={index} or key={i} finds nothing|||Tìm trong mã key={index} hoặc key={i} không ra kết quả nào",
      "README has the pitch, the feature list and the mock-up|||README có câu giới thiệu, danh sách tính năng và mock-up",
    ],
    goiY: [
      "Circle every noun in your feature list that has its own data: each one is a type, and most of them become a card or a row component|||Khoanh mọi danh từ trong danh sách tính năng có dữ liệu riêng: mỗi cái là một kiểu, và phần lớn sẽ thành một component thẻ hoặc dòng",
      "Split the mock-up the way lesson 1.4 does: draw a box around every piece that repeats or that you could describe in one sentence — those boxes are your components|||Chia mock-up như bài 1.4: khoanh mọi mảnh lặp lại hoặc mô tả được bằng một câu — các khoanh đó chính là component",
      "Keep components pure: no fetch, no Date.now(), no random ids inside render — they come in as props. Data generation belongs in a seed file|||Giữ component thuần: không fetch, không Date.now(), không sinh id ngẫu nhiên trong lúc render — chúng đi vào qua props. Sinh dữ liệu thuộc về tệp seed",
    ],
    nop: ["repo", "anh"],
    bai: [L(1, "rx-1-1-component"), L(1, "rx-1-2-props"), L(1, "rx-1-3-danh-sach"), L(1, "rx-1-4-chia-nho")],
  },
  {
    so: 2, slug: "rx-moc-2", sauChuong: "Chapter 2 — State and events|||Chương 2 — State và sự kiện",
    ten: "The main screen becomes interactive|||Màn hình chính biết phản hồi",
    lead: "Add state and events so a user can actually do the core action of your topic — add, toggle, remove, select — with immutable updates and one source of truth. Totals, counts and filtered lists are computed during render, not stored twice.|||Thêm state và sự kiện để người dùng thật sự làm được thao tác lõi của đề tài — thêm, bật/tắt, xoá, chọn — bằng cập nhật bất biến và một nguồn sự thật duy nhất. Tổng, số đếm và danh sách đã lọc được tính trong lúc render, không lưu hai lần.",
    yeuCau: [
      "The core action of your topic works with useState: at least add, change and remove one kind of item|||Thao tác lõi của đề tài chạy được bằng useState: ít nhất thêm, sửa và xoá một loại mục",
      "All updates are immutable (spread, map, filter, toSorted) — no push, splice or direct assignment on state|||Mọi cập nhật đều bất biến (spread, map, filter, toSorted) — không push, splice hay gán thẳng vào state",
      "Updates that depend on the previous value use the updater form setX(prev => …)|||Cập nhật phụ thuộc giá trị trước dùng dạng hàm setX(prev => …)",
      "At least one derived value (total, count, filtered list) computed in render, with no extra state for it|||Ít nhất một giá trị dẫn xuất (tổng, số đếm, danh sách đã lọc) tính trong render, không có state riêng cho nó",
      "State lives in the closest common parent of the components that need it; children get values and handlers through props|||State nằm ở cha chung gần nhất của các component cần nó; con nhận giá trị và hàm xử lý qua props",
      "Business rules of your topic are pure functions in their own file (no React import)|||Luật nghiệp vụ của đề tài là hàm thuần trong tệp riêng (không import React)",
    ],
    nangCao: [
      "Undo the last delete for 5 seconds (keep the removed item, put it back on click)|||Hoàn tác lần xoá gần nhất trong 5 giây (giữ mục vừa xoá, bấm để trả lại)",
      "Use Immer (useImmer) for one deeply nested update and compare readability in the README|||Dùng Immer (useImmer) cho một cập nhật lồng sâu và so độ dễ đọc trong README",
    ],
    datKhi: [
      "Clicking the main buttons changes the screen and the counters stay correct after 10 random clicks|||Bấm các nút chính làm màn hình đổi và số đếm vẫn đúng sau 10 lần bấm lung tung",
      "Searching the code for .push( or .splice( on state finds nothing|||Tìm trong mã .push( hoặc .splice( trên state không ra kết quả nào",
      "There is no useState whose value could be computed from another state|||Không có useState nào mà giá trị có thể tính ra từ state khác",
      "npm run build is still green|||npm run build vẫn xanh",
    ],
    goiY: [
      "For each piece of data ask: does it change while the page is open? If not, it is not state. Can it be computed from other state? Then compute it|||Với mỗi dữ liệu hãy hỏi: nó có đổi khi trang đang mở không? Không thì không phải state. Tính được từ state khác không? Vậy hãy tính nó",
      "Write the update as a pure function first (oldList, input) => newList and test it in your head with an empty list; then call it from setState|||Viết cập nhật thành hàm thuần trước (danhSáchCũ, đầuVào) => danhSáchMới và thử trong đầu với danh sách rỗng; rồi mới gọi nó trong setState",
      "If two siblings need the same data, move the state up to their parent — not into both children (lesson 2.4)|||Nếu hai component anh em cần cùng dữ liệu, chuyển state lên cha — không đặt vào cả hai con (bài 2.4)",
    ],
    nop: ["repo"],
    bai: [L(2, "rx-2-1-use-state"), L(2, "rx-2-2-su-kien"), L(2, "rx-2-3-object-array"), L(2, "rx-2-4-dat-state"), L(2, "rx-2-5-man-hinh-bac-si")],
  },
  {
    so: 3, slug: "rx-moc-3", sauChuong: "Chapter 3 — Forms|||Chương 3 — Form",
    ten: "Create and edit forms you would ship|||Form tạo và sửa đủ chuẩn để phát hành",
    lead: "Build the create and edit forms of your topic with React Hook Form and a Zod schema that is both the validation rules and the TypeScript type. Errors appear next to the field, submit cannot fire twice, and Vietnamese typing never submits half a word.|||Dựng form tạo và sửa của đề tài bằng React Hook Form và một schema Zod vừa là luật kiểm vừa là kiểu TypeScript. Lỗi hiện cạnh ô nhập, nút gửi không bấm được hai lần, và gõ tiếng Việt không bao giờ gửi đi nửa chữ.",
    yeuCau: [
      "At least one create form and one edit form (prefilled) for the main entity of your topic|||Ít nhất một form tạo và một form sửa (điền sẵn) cho thực thể chính của đề tài",
      "One Zod schema per form; the form type comes from z.input / z.output, not a hand-written copy|||Mỗi form một schema Zod; kiểu của form lấy từ z.input / z.output, không chép tay",
      "At least 4 rules from your domain (length, range, pattern, cross-field such as end ≥ start)|||Ít nhất 4 luật của nghiệp vụ (độ dài, khoảng giá trị, mẫu, luật giữa hai trường như kết thúc ≥ bắt đầu)",
      "Every error is shown next to its field, linked with aria-describedby and aria-invalid|||Mọi lỗi hiện cạnh đúng ô, gắn bằng aria-describedby và aria-invalid",
      "Submit button disabled while submitting; a double click saves once|||Nút gửi bị khoá khi đang gửi; bấm đúp chỉ lưu một lần",
      "Text is trimmed and normalised to NFC; Enter while an IME is composing does not submit|||Chữ được cắt khoảng trắng và chuẩn hoá NFC; Enter khi IME đang ghép chữ không gửi form",
    ],
    nangCao: [
      "A field array (rows you can add and remove: variants, ingredients, questions…) with useFieldArray|||Một mảng trường (dòng thêm/xoá được: biến thể, nguyên liệu, câu hỏi…) bằng useFieldArray",
      "Warn before leaving the page with unsaved changes|||Cảnh báo trước khi rời trang khi còn thay đổi chưa lưu",
    ],
    datKhi: [
      "Submitting an empty form shows the right message under each required field and calls no save function|||Gửi form rỗng hiện đúng thông báo dưới từng ô bắt buộc và không gọi hàm lưu",
      "Pasting a value with spaces and decomposed Vietnamese is saved trimmed and in NFC|||Dán giá trị có khoảng trắng và tiếng Việt dạng tách dấu thì được lưu đã cắt và ở dạng NFC",
      "A double click on submit produces one save (check the console or a counter)|||Bấm đúp nút gửi chỉ tạo một lần lưu (kiểm bằng console hoặc bộ đếm)",
      "The edit form opens with the current values and saves the change|||Form sửa mở ra với giá trị hiện tại và lưu được thay đổi",
    ],
    goiY: [
      "Write the schema first, from the sentences in your feature list that contain must or cannot; the form is just the UI of that schema|||Viết schema trước, từ những câu có chữ phải hoặc không được trong danh sách tính năng; form chỉ là giao diện của schema đó",
      "number inputs give you strings: use z.coerce.number() or valueAsNumber, and remember that an empty input coerces to 0|||Ô số trả về chuỗi: dùng z.coerce.number() hoặc valueAsNumber, và nhớ ô trống bị ép thành 0",
      "Keep the schema in a file without React imports so the backend (or a later Next.js version) can import the same rules|||Để schema trong tệp không import React để backend (hoặc bản Next.js sau này) import được đúng các luật đó",
    ],
    nop: ["repo", "anh"],
    bai: [L(3, "rx-3-1-controlled"), L(3, "rx-3-2-react-hook-form"), L(3, "rx-3-3-loi"), L(3, "rx-3-4-tieng-viet")],
  },
  {
    so: 4, slug: "rx-moc-4", sauChuong: "Chapter 4 — Effects|||Chương 4 — Effect",
    ten: "Sync with the outside world — and remove effects you do not need|||Đồng bộ với thế giới bên ngoài — và bỏ effect không cần",
    lead: "Use effects only for what lives outside React — storage, timers, the document title, browser events — each with a correct dependency list and cleanup. Then audit your code: every effect that only computes or reacts to a click moves into render or into the handler.|||Chỉ dùng effect cho thứ nằm ngoài React — storage, hẹn giờ, tiêu đề trang, sự kiện trình duyệt — mỗi cái có danh sách dependency đúng và dọn dẹp. Rồi soát lại mã: effect nào chỉ để tính toán hoặc phản ứng với một cú bấm thì chuyển vào render hoặc vào hàm xử lý.",
    yeuCau: [
      "At least 2 custom hooks of your own (e.g. useLocalStorage, useDebounce) in src/hooks, each with a clear name starting with use|||Ít nhất 2 hook tự viết (vd useLocalStorage, useDebounce) trong src/hooks, mỗi cái tên rõ ràng bắt đầu bằng use",
      "Something of your topic survives F5 (draft, settings or the main list) via storage, reading once with a lazy initialiser|||Một thứ của đề tài sống sót qua F5 (nháp, cài đặt hoặc danh sách chính) nhờ storage, đọc một lần bằng hàm khởi tạo lười",
      "Every effect that subscribes, sets a timer or listens to an event returns a cleanup|||Mọi effect đăng ký, đặt hẹn giờ hay nghe sự kiện đều trả về hàm dọn dẹp",
      "An EFFECTS.md (or README section) lists each useEffect left in the app and why it cannot be done in render or in a handler|||EFFECTS.md (hoặc một mục README) liệt kê từng useEffect còn lại trong app và vì sao không làm được trong render hay trong hàm xử lý",
      "The app behaves the same under StrictMode (effects run twice in development and nothing duplicates)|||App chạy y hệt dưới StrictMode (effect chạy hai lần ở môi trường dev và không có gì bị nhân đôi)",
    ],
    nangCao: [
      "Handle corrupted or blocked storage (private mode, quota full) without crashing|||Xử lý storage hỏng hoặc bị chặn (chế độ ẩn danh, đầy dung lượng) mà không sập",
      "Sync across tabs with the storage event|||Đồng bộ giữa các tab bằng sự kiện storage",
    ],
    datKhi: [
      "Refreshing the page keeps the data you chose to persist|||Tải lại trang vẫn giữ dữ liệu bạn chọn lưu",
      "The React DevTools Profiler or a console counter shows no render loop when you type|||Profiler của React DevTools hoặc bộ đếm console không cho thấy vòng render vô hạn khi gõ",
      "EFFECTS.md has one line per effect with its reason|||EFFECTS.md có mỗi effect một dòng kèm lý do",
      "Linting with the react-hooks rules reports no missing dependency|||Lint với luật react-hooks không báo thiếu dependency",
    ],
    goiY: [
      "Ask lesson 4.2's question for every effect: is this synchronising with something outside React? If the answer is no, it is not an effect|||Hỏi câu của bài 4.2 cho mọi effect: cái này có đồng bộ với thứ gì ngoài React không? Nếu không thì nó không phải effect",
      "A dependency that is a new object or function every render causes a loop; move it inside the effect, or memoise it only if it must stay outside|||Dependency là object hoặc hàm mới mỗi lần render sẽ gây vòng lặp; chuyển nó vào trong effect, hoặc chỉ memo khi buộc phải để bên ngoài",
      "Write the cleanup first, then the setup: if you cannot say how to undo it, the effect is not finished|||Viết hàm dọn dẹp trước rồi mới viết phần cài đặt: nếu không nói được cách gỡ thì effect chưa xong",
    ],
    nop: ["repo"],
    bai: [L(4, "rx-4-1-use-effect"), L(4, "rx-4-2-khong-can"), L(4, "rx-4-3-vong-lap"), L(4, "rx-4-4-custom-hook")],
  },
  {
    so: 5, slug: "rx-moc-5", sauChuong: "Chapter 5 — Sharing state|||Chương 5 — Chia sẻ state",
    ten: "Shared state in the right home: context, reducer, store and URL|||State dùng chung đúng chỗ: context, reducer, store và URL",
    lead: "Your app now has state that several screens need. Give each kind its proper home: rarely-changing values in a split context, complex transitions in a reducer, app-wide client state in a Zustand store with selectors, and anything a user might share — filters, tabs, pages — in the URL.|||App giờ có state mà nhiều màn hình cần. Cho mỗi loại đúng nhà của nó: giá trị ít đổi vào context đã tách, chuyển trạng thái phức tạp vào reducer, state client toàn app vào store Zustand có selector, và mọi thứ người dùng có thể muốn chia sẻ — bộ lọc, tab, trang — lên URL.",
    yeuCau: [
      "A STATE.md table: every piece of state, where it lives (component, context, reducer, store, URL, server) and why|||Bảng STATE.md: mọi mẩu state, nằm ở đâu (component, context, reducer, store, URL, server) và vì sao",
      "One useReducer with named actions for the most complex flow of your topic (wizard, session, editor, cart…) and a pure reducer|||Một useReducer có action đặt tên cho luồng phức tạp nhất của đề tài (wizard, phiên học, trình soạn, giỏ…) và reducer thuần",
      "One Zustand store (or context) for state shared by distant components; components read it through selectors|||Một store Zustand (hoặc context) cho state dùng chung giữa các component xa nhau; component đọc qua selector",
      "Filters, sort and/or page of your main list live in the URL search params: F5 and a copied link restore them, Back works|||Bộ lọc, sắp xếp và/hoặc trang của danh sách chính nằm trên search param của URL: F5 và link sao chép khôi phục được, nút Back chạy đúng",
      "No prop is passed through more than 2 components only to reach a deep child|||Không prop nào bị truyền qua quá 2 component chỉ để tới một con ở sâu",
    ],
    nangCao: [
      "Persist the store with the persist middleware and a version + migrate function|||Lưu store bằng middleware persist kèm version + hàm migrate",
      "Measure with the Profiler that changing one store field does not re-render unrelated components|||Đo bằng Profiler rằng đổi một trường của store không làm render lại component không liên quan",
    ],
    datKhi: [
      "Copying the URL of a filtered list into a new tab shows the same results|||Sao chép URL của danh sách đã lọc sang tab mới hiện đúng kết quả đó",
      "The reducer can be called in a test or the console with an action and returns a new object without touching the old one|||Gọi được reducer trong test hoặc console với một action và nó trả object mới, không đụng object cũ",
      "STATE.md covers every useState, context, store field and search param in the app|||STATE.md phủ mọi useState, context, trường store và search param trong app",
    ],
    goiY: [
      "Ask in order: does only one component need it? (local) Does it belong in a link? (URL) Is it a copy of server data? (wait for Chapter 6) Otherwise: context for rare changes, store for frequent ones|||Hỏi theo thứ tự: chỉ một component cần? (cục bộ) Có nên nằm trong link? (URL) Là bản sao dữ liệu server? (chờ Chương 6) Còn lại: context cho thứ ít đổi, store cho thứ đổi thường xuyên",
      "A selector that builds a new array (filter, map) returns a new reference every time: select the raw slice and filter in the component, or use useShallow|||Selector tạo mảng mới (filter, map) trả tham chiếu mới mỗi lần: hãy chọn phần dữ liệu thô rồi lọc trong component, hoặc dùng useShallow",
      "Write reducer actions as events in past tense from the user point of view (itemAdded, stepCompleted), not as setters|||Đặt tên action reducer như sự kiện ở thì quá khứ từ góc nhìn người dùng (itemAdded, stepCompleted), không phải như hàm set",
    ],
    nop: ["repo"],
    bai: [L(5, "rx-5-1-context"), L(5, "rx-5-2-reducer"), L(5, "rx-5-3-zustand"), L(5, "rx-5-4-url-state"), L(5, "rx-5-5-du-an")],
  },
  {
    so: 6, slug: "rx-moc-6", sauChuong: "Chapter 6 — Data fetching|||Chương 6 — Lấy dữ liệu",
    ten: "Server data through TanStack Query|||Dữ liệu server qua TanStack Query",
    lead: "Move every piece of server data out of useState and into TanStack Query: reads become queries with good keys, writes become mutations that update or invalidate the cache, and every screen handles loading, error and empty properly. Use a mock API (MSW or json-server) or a real backend you built.|||Chuyển mọi dữ liệu server ra khỏi useState và vào TanStack Query: đọc thành query có khoá tốt, ghi thành mutation cập nhật hoặc làm mới cache, và mọi màn hình xử lý đúng đang tải, lỗi và rỗng. Dùng API giả (MSW hoặc json-server) hoặc một backend thật bạn đã dựng.",
    yeuCau: [
      "An API layer (src/api) with typed functions; components never call fetch directly|||Một lớp API (src/api) với các hàm có kiểu; component không bao giờ gọi fetch trực tiếp",
      "A query-key factory and at least 2 queries; the AbortSignal from TanStack Query is passed to fetch|||Một nơi tạo query key và ít nhất 2 query; AbortSignal của TanStack Query được truyền vào fetch",
      "At least 2 mutations (create, update or delete) that update or invalidate the right keys|||Ít nhất 2 mutation (tạo, sửa hoặc xoá) cập nhật hoặc làm mới đúng các khoá",
      "One optimistic update that rolls back when the server fails, with a visible message|||Một cập nhật lạc quan có hoàn tác khi server lỗi, kèm thông báo người dùng thấy được",
      "Every data screen has 4 states: loading (skeleton), error (with Retry), empty, and data|||Mọi màn hình dữ liệu có 4 trạng thái: đang tải (skeleton), lỗi (có nút Thử lại), rỗng, và có dữ liệu",
      "Server data is no longer copied into useState or the store|||Dữ liệu server không còn bị chép vào useState hay store",
    ],
    nangCao: [
      "Paginated or infinite list with placeholderData so the old page stays while the next loads|||Danh sách phân trang hoặc cuộn vô hạn với placeholderData để trang cũ còn hiện khi trang mới đang tải",
      "Prefetch the detail page on hover or focus of a list item|||Tải trước trang chi tiết khi rê chuột hoặc focus vào một mục danh sách",
    ],
    datKhi: [
      "With the API slowed to 3 s in DevTools, every screen shows a loading state, never a blank or a crash|||Khi làm chậm API 3 giây trong DevTools, mọi màn hình hiện trạng thái đang tải, không bao giờ trống trơn hay sập",
      "Making the mock API return 500 shows the error state; Retry recovers|||Cho API giả trả 500 thì hiện trạng thái lỗi; bấm Thử lại thì hồi phục",
      "The optimistic action appears instantly and reverts on failure|||Thao tác lạc quan hiện ngay lập tức và quay lại khi lỗi",
      "Searching for fetch( outside src/api finds nothing|||Tìm fetch( bên ngoài src/api không ra kết quả nào",
    ],
    goiY: [
      "Start the mock API before the UI: write MSW handlers (or a db.json) with your seed data and 2–3 error cases, so every state can be shown on demand|||Dựng API giả trước giao diện: viết handler MSW (hoặc db.json) với dữ liệu mẫu và 2–3 ca lỗi, để trạng thái nào cũng gọi ra được khi cần",
      "Lessons use MSW 2 (option onUnhandledRequest). npm install msw today may give version 3, where the option is renamed onUnhandledFrame — install msw@2 to follow the lessons exactly|||Bài học dùng MSW 2 (tuỳ chọn onUnhandledRequest). npm install msw hôm nay có thể cài bản 3, nơi tuỳ chọn đổi tên thành onUnhandledFrame — cài msw@2 để làm đúng như bài",
      "Key = everything the query depends on: ['items', { page, filter }]. If a value changes the result but is not in the key, you will see stale data|||Khoá = mọi thứ query phụ thuộc: ['items', { page, filter }]. Giá trị nào làm đổi kết quả mà không nằm trong khoá thì bạn sẽ thấy dữ liệu cũ",
    ],
    nop: ["repo", "anh"],
    bai: [L(6, "rx-6-1-fetch"), L(6, "rx-6-2-tanstack"), L(6, "rx-6-3-mutation"), L(6, "rx-6-4-loi-api")],
  },
  {
    so: 7, slug: "rx-moc-7", sauChuong: "Chapter 7 — Routing and structure|||Chương 7 — Định tuyến và cấu trúc",
    ten: "Pages, layouts, guards and a structure that scales|||Trang, layout, chặn truy cập và cấu trúc mở rộng được",
    lead: "Turn the app into real pages with React Router: a shared layout, a detail route with a parameter, nested routes, a login gate that remembers where the user wanted to go, a 404 and an error page. At the same time reorganise the code into feature folders so each chapter from now on lands in an obvious place.|||Biến app thành các trang thật bằng React Router: layout dùng chung, tuyến chi tiết có tham số, tuyến lồng nhau, cửa chặn đăng nhập nhớ người dùng muốn đi đâu, trang 404 và trang lỗi. Đồng thời sắp lại mã theo thư mục tính năng để từ giờ mỗi chương rơi vào đúng chỗ dễ thấy.",
    yeuCau: [
      "At least 5 routes including a list and a detail route with a parameter (/items/:id) inside one shared layout|||Ít nhất 5 tuyến gồm danh sách và trang chi tiết có tham số (/items/:id) bên trong một layout dùng chung",
      "At least one nested route group (settings tabs, wizard steps, admin sections)|||Ít nhất một nhóm tuyến lồng nhau (tab cài đặt, các bước wizard, các mục quản trị)",
      "A guard for pages that need login: redirect to /login?next=… and come back after login|||Chặn trang cần đăng nhập: chuyển tới /login?next=… và quay lại sau khi đăng nhập",
      "A 404 page for unknown URLs and for unknown ids; an error element for render crashes, both with a way back|||Trang 404 cho URL lạ và id không tồn tại; error element cho lỗi khi render, cả hai có lối quay về",
      "Code reorganised into feature folders (src/features/<feature>) with one-way dependencies, shared code in src/shared|||Mã sắp lại theo thư mục tính năng (src/features/<tính năng>) phụ thuộc một chiều, mã dùng chung ở src/shared",
      "Navigation uses Link / NavLink (active state visible), not window.location|||Điều hướng dùng Link / NavLink (thấy được trạng thái đang chọn), không dùng window.location",
    ],
    nangCao: [
      "A route loader or prefetch so the detail page does not flash a spinner when opened from the list|||Loader của tuyến hoặc tải trước để trang chi tiết không nháy spinner khi mở từ danh sách",
      "Document in the README which parts would change if you moved to Next.js (lesson 7.4)|||Ghi trong README phần nào sẽ đổi nếu chuyển sang Next.js (bài 7.4)",
    ],
    datKhi: [
      "Opening a detail URL directly (pasted in a new tab) works|||Mở thẳng URL trang chi tiết (dán vào tab mới) vẫn chạy",
      "Visiting a protected page while logged out ends on login, and after login you land on the page you asked for|||Vào trang cần đăng nhập khi chưa đăng nhập thì tới trang login, đăng nhập xong thì về đúng trang đã đòi",
      "A wrong id and a wrong URL both show Not found inside the layout|||Id sai và URL sai đều hiện Không tìm thấy bên trong layout",
      "The folder tree in the README matches the code|||Cây thư mục trong README khớp với mã",
    ],
    goiY: [
      "List your routes as a table first (path, page, who can see it, data it needs); the router config is a translation of that table|||Liệt kê tuyến thành bảng trước (đường dẫn, trang, ai được xem, dữ liệu cần); cấu hình router chỉ là bản dịch của bảng đó",
      "Guards are layout routes that render Outlet or Navigate — one component protects a whole group of pages|||Cửa chặn là tuyến layout render Outlet hoặc Navigate — một component bảo vệ cả nhóm trang",
      "A feature folder may import from shared but never from another feature; if two features need the same thing, move it to shared|||Thư mục tính năng được import từ shared nhưng không bao giờ từ tính năng khác; hai tính năng cùng cần thì chuyển sang shared",
    ],
    nop: ["repo", "demo"],
    bai: [L(7, "rx-7-1-router"), L(7, "rx-7-2-layout"), L(7, "rx-7-3-cau-truc"), L(7, "rx-7-4-sang-nextjs"), L(7, "rx-7-5-du-an")],
  },
  {
    so: 8, slug: "rx-moc-8", sauChuong: "Chapter 8 — Performance and accessibility|||Chương 8 — Hiệu năng và khả năng tiếp cận",
    ten: "Measured performance and an app everyone can use|||Hiệu năng có số đo và một app ai cũng dùng được",
    lead: "Measure before you optimise: profile the heaviest interaction of your topic, fix only what the numbers point to, split the bundle so the first page loads less, and record before/after in PERFORMANCE.md. Then make the whole main flow usable with only a keyboard and with a screen reader, checked by axe.|||Đo trước khi tối ưu: chạy Profiler cho thao tác nặng nhất của đề tài, chỉ sửa chỗ số đo chỉ ra, chia bundle để trang đầu tải ít hơn, và ghi trước/sau vào PERFORMANCE.md. Rồi làm cho cả luồng chính dùng được chỉ bằng bàn phím và bằng trình đọc màn hình, có axe kiểm.",
    yeuCau: [
      "Seed or generate enough data to feel slowness (at least 500 items in the main list)|||Tạo đủ dữ liệu để thấy chậm (ít nhất 500 mục trong danh sách chính)",
      "PERFORMANCE.md: the interaction you measured, Profiler numbers before and after, and what you decided not to optimise|||PERFORMANCE.md: thao tác đã đo, số của Profiler trước và sau, và chỗ bạn quyết định không tối ưu",
      "memo / useMemo / useCallback only where the measurement showed a gain — each one has a comment pointing to it|||memo / useMemo / useCallback chỉ ở chỗ số đo cho thấy có lợi — mỗi chỗ có chú thích trỏ tới số đo đó",
      "At least one route or heavy component lazy-loaded with Suspense; vite build shows the separate chunk|||Ít nhất một tuyến hoặc component nặng được tải lười với Suspense; vite build cho thấy chunk riêng",
      "The main user story works with keyboard only: visible focus, logical order, no trap, Escape closes overlays|||Câu chuyện người dùng chính chạy được chỉ bằng bàn phím: thấy focus, thứ tự hợp lý, không kẹt, Escape đóng lớp phủ",
      "axe (DevTools extension or axe-core in a test) reports 0 critical/serious violations on the main pages|||axe (tiện ích DevTools hoặc axe-core trong test) báo 0 lỗi critical/serious trên các trang chính",
    ],
    nangCao: [
      "Lighthouse report for the main page (performance and accessibility) attached as a screenshot with your scores|||Báo cáo Lighthouse cho trang chính (performance và accessibility) đính kèm ảnh chụp điểm",
      "Optimise images (width/height, loading=lazy, modern formats) and show the before/after transfer size|||Tối ưu ảnh (width/height, loading=lazy, định dạng mới) và cho thấy dung lượng tải trước/sau",
    ],
    datKhi: [
      "PERFORMANCE.md has at least one before/after number from the Profiler or a render counter|||PERFORMANCE.md có ít nhất một cặp số trước/sau từ Profiler hoặc bộ đếm render",
      "npm run build lists at least one lazily loaded chunk|||npm run build liệt kê ít nhất một chunk tải lười",
      "You can complete the main story without touching the mouse|||Bạn hoàn thành được câu chuyện chính mà không chạm chuột",
      "axe shows no critical or serious issue|||axe không còn lỗi critical hay serious",
    ],
    goiY: [
      "Profile one concrete click (one toggle in a 500-item list), not the whole app; look for components that rendered but whose output did not change|||Profile một cú bấm cụ thể (bật một mục trong danh sách 500 mục), không phải cả app; tìm component render lại mà kết quả không đổi",
      "memo on a child does nothing if the parent passes a new function or object each render — that is when useCallback / useMemo earn their place|||memo ở con vô tác dụng nếu cha truyền hàm hoặc object mới mỗi lần render — đó là lúc useCallback / useMemo có lý do tồn tại",
      "Start a11y with HTML: a real button instead of a clickable div, label for every input, headings in order — most axe errors vanish before you need any aria attribute|||Bắt đầu a11y từ HTML: nút thật thay cho div bấm được, label cho mọi ô nhập, tiêu đề đúng thứ tự — phần lớn lỗi axe biến mất trước khi cần thuộc tính aria nào",
    ],
    nop: ["repo", "anh"],
    bai: [L(8, "rx-8-1-do"), L(8, "rx-8-2-memo"), L(8, "rx-8-3-lazy"), L(8, "rx-8-4-a11y")],
  },
  {
    so: 9, slug: "rx-moc-9", sauChuong: "Chapter 9 — Testing React|||Chương 9 — Test React",
    ten: "Tests that would catch a real bug|||Test bắt được lỗi thật",
    lead: "Write the test suite of your app with Vitest, Testing Library, user-event and MSW: business rules as unit tests, screens tested the way a user uses them (by role and label), async states against a mocked network, and your custom hooks with renderHook. Then prove the tests bite by breaking the code on purpose.|||Viết bộ test cho app bằng Vitest, Testing Library, user-event và MSW: luật nghiệp vụ thành unit test, màn hình được test theo cách người dùng dùng (theo vai trò và nhãn), các trạng thái bất đồng bộ trên mạng giả, và hook tự viết bằng renderHook. Rồi chứng minh test có răng bằng cách cố ý làm hỏng mã.",
    yeuCau: [
      "npm test runs Vitest with jsdom; at least 15 meaningful tests, all green|||npm test chạy Vitest với jsdom; ít nhất 15 test có ý nghĩa, tất cả xanh",
      "Unit tests for every business rule of your topic, edge cases first (empty, boundary, month change…)|||Unit test cho mọi luật nghiệp vụ của đề tài, ca biên trước (rỗng, ranh giới, đổi tháng…)",
      "Component tests use getByRole / getByLabelText and user-event, not class names or test ids by default|||Test component dùng getByRole / getByLabelText và user-event, mặc định không dùng tên class hay test id",
      "Async screens tested against MSW: loading, error, empty and data states|||Màn hình bất đồng bộ được test với MSW: trạng thái đang tải, lỗi, rỗng và có dữ liệu",
      "At least one custom hook tested with renderHook (with a QueryClient wrapper if it uses TanStack Query)|||Ít nhất một hook tự viết được test bằng renderHook (có wrapper QueryClient nếu nó dùng TanStack Query)",
      "TESTING.md: what is tested, what is deliberately not, the coverage number, and one bug a test caught|||TESTING.md: cái gì được test, cái gì cố ý không, con số coverage, và một lỗi mà test đã bắt",
    ],
    nangCao: [
      "GitHub Actions workflow running build and test on every push, with the badge in the README|||Workflow GitHub Actions chạy build và test mỗi lần push, có huy hiệu trong README",
      "One end-to-end test of the main story with Playwright|||Một test end-to-end cho câu chuyện chính bằng Playwright",
    ],
    datKhi: [
      "npm test is green and prints at least 15 tests|||npm test xanh và in ra ít nhất 15 test",
      "Breaking one business rule on purpose turns at least one test red (screenshot in TESTING.md)|||Cố ý làm hỏng một luật nghiệp vụ thì ít nhất một test chuyển đỏ (ảnh chụp trong TESTING.md)",
      "The coverage report for your rules folder is attached and explained|||Báo cáo coverage cho thư mục luật nghiệp vụ được đính kèm và giải thích",
    ],
    goiY: [
      "Test the behaviour the user would describe: when I click Archive, the item disappears and comes back if the server fails — not which hook was called|||Test hành vi mà người dùng mô tả được: khi tôi bấm Lưu trữ, mục biến mất và quay lại nếu server lỗi — không phải hook nào đã được gọi",
      "If getByRole cannot find your button, a screen reader cannot either: fix the markup, not the test|||Nếu getByRole không tìm ra nút của bạn thì trình đọc màn hình cũng không: sửa markup, không sửa test",
      "Coverage tells you what never ran, not what is correct; 100 percent of trivial code is worth less than 70 percent of the rules|||Coverage cho biết dòng nào chưa từng chạy, không cho biết dòng nào đúng; 100 phần trăm mã tầm thường đáng giá ít hơn 70 phần trăm của luật nghiệp vụ",
    ],
    nop: ["repo", "anh"],
    bai: [L(9, "rx-9-1-testing-library"), L(9, "rx-9-2-async"), L(9, "rx-9-3-hook"), L(9, "rx-9-4-phong-van")],
  },
  {
    so: 10, slug: "rx-moc-10", sauChuong: "Chapter 10 — Mid-course project: the booking UI|||Chương 10 — Dự án giữa khoá: giao diện đặt lịch",
    ten: "Mid-course release: the main story end to end, deployed|||Bản giữa khoá: câu chuyện chính chạy trọn, đã deploy",
    lead: "Chapter 10 builds the teacher's booking app from design to deploy; now do the same for your topic. Write the user stories, check that the most important one works end to end — form, mutation, cache, list, errors from the server landing on the right field — polish it and put a preview online.|||Chương 10 dựng app đặt lịch của thầy từ thiết kế tới deploy; giờ bạn làm đúng như thế cho đề tài của mình. Viết các câu chuyện người dùng, kiểm câu quan trọng nhất chạy trọn — form, mutation, cache, danh sách, lỗi từ server rơi đúng ô — đánh bóng nó và đưa một bản xem trước lên mạng.",
    yeuCau: [
      "STORIES.md: 5–8 user stories (As a…, I want…, so that…) with acceptance criteria, the main one marked|||STORIES.md: 5–8 câu chuyện người dùng (Là…, tôi muốn…, để…) có tiêu chí chấp nhận, đánh dấu câu chính",
      "The main story works end to end in the browser, including one business error from the server (409, 422…) shown at the right field|||Câu chuyện chính chạy trọn trên trình duyệt, kể cả một lỗi nghiệp vụ từ server (409, 422…) hiện đúng ô",
      "One integration test that walks through the main story like a user|||Một test tích hợp đi qua câu chuyện chính như người dùng",
      "A preview deployed (Vercel, Netlify, Cloudflare Pages or GitHub Pages) with SPA fallback so deep links work|||Một bản xem trước đã deploy (Vercel, Netlify, Cloudflare Pages hoặc GitHub Pages) có SPA fallback để link sâu chạy được",
      "Self-assessment with the lesson 10.4 rubric written in the README; a git tag v0.5.0|||Tự đánh giá theo rubric của bài 10.4 ghi trong README; gắn git tag v0.5.0",
    ],
    nangCao: [
      "Ask one classmate to use the preview without help and write down the three places they got stuck|||Nhờ một bạn dùng bản xem trước không hướng dẫn và ghi lại ba chỗ họ bị kẹt",
      "A short screen recording (≤ 2 minutes) of the main story for your CV|||Một đoạn quay màn hình ngắn (≤ 2 phút) về câu chuyện chính để đưa vào CV",
    ],
    datKhi: [
      "The preview URL opens on a phone and a deep link to a detail page works after F5|||URL bản xem trước mở được trên điện thoại và link sâu tới trang chi tiết vẫn chạy sau F5",
      "The integration test of the main story is green|||Test tích hợp câu chuyện chính xanh",
      "STORIES.md and the self-assessment are in the repository at tag v0.5.0|||STORIES.md và bản tự đánh giá có trong repo ở tag v0.5.0",
    ],
    goiY: [
      "Pick the main story by asking: if the app could do only one thing, what would it be? Polish that before adding anything else|||Chọn câu chuyện chính bằng câu hỏi: nếu app chỉ làm được một việc thì đó là việc gì? Đánh bóng nó trước khi thêm thứ khác",
      "Map server errors in one place: 409 or 422 with a field name goes to setError on that field, everything else to a form-level message|||Ánh xạ lỗi server ở một chỗ: 409 hoặc 422 có tên trường thì setError vào đúng trường đó, còn lại thì thành thông báo cấp form",
      "A deploy that 404s on F5 needs a rewrite of every path to index.html (_redirects, vercel.json or 404.html on GitHub Pages)|||Bản deploy 404 khi F5 cần viết lại mọi đường dẫn về index.html (_redirects, vercel.json hoặc 404.html trên GitHub Pages)",
    ],
    nop: ["repo", "demo"],
    bai: [L(10, "rx-10-1-thiet-ke"), L(10, "rx-10-2-xay-dung"), L(10, "rx-10-3-chat-luong"), L(10, "rx-10-4-tong-ket")],
  },
  {
    so: 11, slug: "rx-moc-11", sauChuong: "Chapter 11 — React under the hood|||Chương 11 — React bên trong",
    ten: "Under-the-hood upgrades: identity, refs, portals, boundaries|||Nâng cấp từ bên trong: danh tính, ref, portal, ranh giới lỗi",
    lead: "Use what you learned about how React updates the screen to fix the subtle bugs every real app has: state that leaks between items because of identity, focus that gets lost, overlays clipped by a parent, and one broken widget that blanks the whole page.|||Dùng những gì đã học về cách React cập nhật màn hình để sửa các lỗi tinh vi app thật nào cũng có: state rò từ mục này sang mục khác vì danh tính, focus bị mất, lớp phủ bị cha cắt mất, và một widget hỏng làm trắng cả trang.",
    yeuCau: [
      "Find one place where switching between items keeps stale local state and fix it with a key (explain it in the README)|||Tìm một chỗ chuyển giữa các mục mà state cục bộ cũ vẫn còn và sửa bằng key (giải thích trong README)",
      "Dialogs, menus or toasts rendered through a portal into document.body|||Hộp thoại, menu hoặc thông báo được render qua portal vào document.body",
      "Focus management with useRef: the dialog takes focus when opened, Escape closes it and focus returns to the opener|||Quản lý focus bằng useRef: hộp thoại nhận focus khi mở, Escape đóng và focus trở về nút đã mở",
      "Error boundaries around risky widgets and per route, with a Retry that recovers without reloading the page|||Error boundary quanh các widget rủi ro và theo từng tuyến, có nút Thử lại hồi phục mà không tải lại trang",
      "StrictMode stays on in development and the app behaves correctly with it|||StrictMode vẫn bật ở môi trường dev và app chạy đúng với nó",
    ],
    nangCao: [
      "useLayoutEffect to measure an element (tooltip or popover position) without a visible jump|||useLayoutEffect để đo một phần tử (vị trí tooltip hoặc popover) mà không nhảy hình",
      "Report caught errors to a logging endpoint or a service such as Sentry (free plan)|||Gửi lỗi bắt được tới một endpoint log hoặc dịch vụ như Sentry (gói miễn phí)",
    ],
    datKhi: [
      "Throwing on purpose inside one widget leaves the rest of the page working and Retry brings it back|||Cố ý ném lỗi trong một widget thì phần còn lại của trang vẫn chạy và Thử lại đưa nó trở lại",
      "With keyboard only you can open a dialog, act in it, close it with Escape and continue from the same button|||Chỉ với bàn phím bạn mở được hộp thoại, thao tác trong đó, đóng bằng Escape và tiếp tục từ đúng nút cũ",
      "Switching items in the edit view never shows the previous item's draft|||Chuyển mục trong màn hình sửa không bao giờ hiện bản nháp của mục trước",
    ],
    goiY: [
      "React keeps state by position in the tree plus key; the same component at the same place keeps its state even if its props change completely|||React giữ state theo vị trí trong cây cộng với key; cùng component ở cùng chỗ thì giữ state kể cả khi props đổi hoàn toàn",
      "Error boundaries do not catch errors in event handlers or in async code — handle those with try/catch or the error state of a mutation|||Error boundary không bắt lỗi trong hàm xử lý sự kiện hay mã bất đồng bộ — xử lý chúng bằng try/catch hoặc trạng thái lỗi của mutation",
      "Remember the element that had focus before opening, and give it back in the cleanup of the effect|||Nhớ phần tử đang có focus trước khi mở, và trả focus lại trong hàm dọn dẹp của effect",
    ],
    nop: ["repo"],
    bai: [L(11, "rx-11-1-virtual-dom"), L(11, "rx-11-2-key-identity"), L(11, "rx-11-3-strict-mode-ref"), L(11, "rx-11-4-portal-error-boundary"), L(11, "rx-11-5-du-an")],
  },
  {
    so: 12, slug: "rx-moc-12", sauChuong: "Chapter 12 — React 19 and concurrent rendering|||Chương 12 — React 19 & concurrent",
    ten: "React 19 where it helps your users|||React 19 ở chỗ giúp được người dùng",
    lead: "Apply the concurrent features and Actions of React 19 exactly where your app has the problem they solve: a slow filter that makes typing lag, a form whose pending and error state you manage by hand, a write the user should see before the server answers.|||Áp các tính năng concurrent và Actions của React 19 đúng chỗ app của bạn có vấn đề mà chúng giải quyết: bộ lọc chậm làm gõ phím bị trễ, form mà bạn đang tự quản trạng thái đang gửi và lỗi, thao tác ghi mà người dùng nên thấy trước khi server trả lời.",
    yeuCau: [
      "useTransition or useDeferredValue on the slowest update of your app; typing stays responsive (show before/after in PERFORMANCE.md)|||useTransition hoặc useDeferredValue cho cập nhật chậm nhất của app; gõ phím vẫn nhạy (ghi trước/sau vào PERFORMANCE.md)",
      "At least one form converted to an Action with useActionState (pending, error and result managed by React)|||Ít nhất một form chuyển sang Action với useActionState (đang gửi, lỗi và kết quả do React quản)",
      "One useOptimistic flow: the change appears at once marked as pending and disappears if the action fails|||Một luồng useOptimistic: thay đổi hiện ngay có đánh dấu đang chờ và biến mất nếu action lỗi",
      "At least one Suspense boundary with a meaningful fallback around a data or lazy part|||Ít nhất một ranh giới Suspense có fallback hợp lý quanh phần dữ liệu hoặc phần tải lười",
      "README note: which React 19 feature you used where, and one you decided not to use and why|||Ghi chú README: dùng tính năng React 19 nào ở đâu, và một tính năng bạn quyết định không dùng kèm lý do",
    ],
    nangCao: [
      "Enable React Compiler as in lesson 12.4, re-measure, and remove manual memo that became useless|||Bật React Compiler như bài 12.4, đo lại, và gỡ các memo thủ công đã trở nên thừa",
      "useFormStatus in a reusable SubmitButton component|||useFormStatus trong một component SubmitButton dùng lại được",
    ],
    datKhi: [
      "Typing in the slow input no longer drops characters with CPU throttling at 4x|||Gõ vào ô chậm không còn mất ký tự khi giả lập CPU chậm 4 lần",
      "The optimistic item appears before the network answers and is removed on failure (test or screen recording)|||Mục lạc quan hiện trước khi mạng trả lời và bị gỡ khi lỗi (test hoặc quay màn hình)",
      "The Action form shows pending and error without any hand-written isLoading state|||Form Action hiện đang gửi và lỗi mà không có state isLoading tự viết nào",
    ],
    goiY: [
      "A transition marks an update as not urgent; it does not make slow code fast — measure first that the slow part is rendering, not the network|||Transition đánh dấu một cập nhật là không gấp; nó không làm mã chậm thành nhanh — đo trước xem phần chậm là render chứ không phải mạng",
      "useOptimistic state lives only while the action runs: you still need to update the real state (or the query cache) on success|||State của useOptimistic chỉ sống khi action đang chạy: thành công thì bạn vẫn phải cập nhật state thật (hoặc cache của query)",
      "Keep TanStack Query for server data; Actions are about the form and the pending UI, not a replacement for the cache|||Giữ TanStack Query cho dữ liệu server; Actions lo phần form và giao diện đang chờ, không thay thế cache",
    ],
    nop: ["repo"],
    bai: [L(12, "rx-12-1-suspense-use"), L(12, "rx-12-2-transition"), L(12, "rx-12-3-actions"), L(12, "rx-12-4-compiler-rsc")],
  },
  {
    so: 13, slug: "rx-moc-13", sauChuong: "Chapter 13 — Design patterns and architecture|||Chương 13 — Mẫu thiết kế & kiến trúc",
    ten: "Architecture: patterns, long lists, safe HTML, i18n|||Kiến trúc: mẫu dùng lại, danh sách dài, HTML an toàn, i18n",
    lead: "Make the codebase look like a team built it: one compound or headless component used in several places, a styling decision written down, the longest list virtualised and measured, user-generated content rendered safely, and the interface available in Vietnamese and English with Intl formatting.|||Làm cho codebase trông như do một đội dựng: một component compound hoặc headless dùng ở nhiều chỗ, quyết định về cách viết CSS được ghi lại, danh sách dài nhất được ảo hoá và có số đo, nội dung người dùng tạo được render an toàn, và giao diện có tiếng Việt lẫn tiếng Anh với định dạng Intl.",
    yeuCau: [
      "One compound component (Tabs, Select, Accordion, Pipeline…) or headless hook reused in at least 2 places, keyboard accessible|||Một component compound (Tabs, Select, Accordion, Pipeline…) hoặc hook headless dùng lại ở ít nhất 2 chỗ, dùng được bằng bàn phím",
      "ADR (Architecture Decision Record) for your styling choice: CSS Modules, Tailwind or another, with the trade-off|||ADR (bản ghi quyết định kiến trúc) cho cách viết CSS: CSS Modules, Tailwind hay cách khác, kèm đánh đổi",
      "Your longest list virtualised (TanStack Virtual or similar) with at least 2 000 items; numbers before/after in PERFORMANCE.md|||Danh sách dài nhất được ảo hoá (TanStack Virtual hoặc tương tự) với ít nhất 2 000 mục; số trước/sau trong PERFORMANCE.md",
      "Any user-written HTML or Markdown is sanitised (DOMPurify) before dangerouslySetInnerHTML; a test proves script and onerror are removed|||Mọi HTML hoặc Markdown do người dùng viết được làm sạch (DOMPurify) trước dangerouslySetInnerHTML; một test chứng minh script và onerror bị gỡ",
      "Interface in vi and en (a small i18n layer or a library); money, dates and numbers through Intl, never hand-made strings|||Giao diện có vi và en (một lớp i18n nhỏ hoặc thư viện); tiền, ngày và số qua Intl, không bao giờ tự ghép chuỗi",
    ],
    nangCao: [
      "A polymorphic as prop on one base component, fully typed|||Prop as đa hình trên một component nền, có kiểu đầy đủ",
      "Storybook or a simple /dev page showing every state of your shared components|||Storybook hoặc một trang /dev đơn giản hiện mọi trạng thái của component dùng chung",
    ],
    datKhi: [
      "Scrolling the 2 000-item list keeps the DOM node count small (check in DevTools Elements)|||Cuộn danh sách 2 000 mục mà số nút DOM vẫn nhỏ (kiểm trong tab Elements của DevTools)",
      "Pasting a note with a script tag and an img onerror into your app runs nothing|||Dán một ghi chú có thẻ script và img onerror vào app không chạy gì cả",
      "Switching the language changes texts and number/date formats on the main pages|||Đổi ngôn ngữ thì chữ và định dạng số/ngày trên các trang chính đổi theo",
    ],
    goiY: [
      "A compound component shares state through a private context; each part (Tabs.Tab, Tabs.Panel) throws a clear error if used outside its parent|||Component compound chia sẻ state qua một context riêng; mỗi phần (Tabs.Tab, Tabs.Panel) ném lỗi rõ ràng nếu dùng ngoài cha của nó",
      "Virtualisation needs a scroll container with a fixed height and an estimated item size; measure real sizes only if rows differ a lot|||Ảo hoá cần một khung cuộn có chiều cao cố định và kích thước mục ước lượng; chỉ đo kích thước thật khi các dòng chênh nhau nhiều",
      "React already escapes text; the danger starts only when you use dangerouslySetInnerHTML or put user input into href — sanitise exactly there|||React đã tự thoát ký tự trong chữ; nguy hiểm chỉ bắt đầu khi bạn dùng dangerouslySetInnerHTML hoặc đưa dữ liệu người dùng vào href — làm sạch đúng ở đó",
    ],
    nop: ["repo"],
    bai: [L(13, "rx-13-1-compound-headless"), L(13, "rx-13-2-hook-styling"), L(13, "rx-13-3-danh-sach-dai"), L(13, "rx-13-4-bao-mat-i18n")],
  },
  {
    so: 14, slug: "rx-moc-14", sauChuong: "Chapter 14 — Going to production|||Chương 14 — Lên production",
    ten: "Production release: auth, a real API client, security and deploy|||Bản production: xác thực, API client thật, bảo mật và deploy",
    lead: "Close the gaps between a demo and a product: real client-side auth with one refresh for many 401s, an API client with timeouts, retries and idempotency, an offline-aware UI, a production build without mocks within a bundle budget, security headers, and a live HTTPS address you can put on your CV.|||Lấp khoảng cách giữa bản demo và một sản phẩm: xác thực phía client thật với một lần refresh cho nhiều 401, API client có timeout, thử lại và idempotency, giao diện biết lúc offline, bản build production không có mock và trong ngân sách bundle, header bảo mật, và một địa chỉ HTTPS thật để ghi vào CV.",
    yeuCau: [
      "Login, logout and protected routes against a real backend or a mock that behaves like one; access token in memory, refresh through an httpOnly cookie or the documented alternative|||Đăng nhập, đăng xuất và tuyến cần đăng nhập với backend thật hoặc mock hành xử như thật; access token để trong bộ nhớ, refresh qua cookie httpOnly hoặc phương án thay thế có ghi rõ",
      "One API client: Authorization header, a single refresh shared by concurrent 401s, timeout, Idempotency-Key on POST, logout when refresh fails|||Một API client: header Authorization, một lần refresh dùng chung cho các 401 đồng thời, timeout, Idempotency-Key cho POST, đăng xuất khi refresh lỗi",
      "Offline banner and safe behaviour when the network drops in the middle of a write|||Băng báo offline và hành vi an toàn khi mất mạng giữa lúc ghi",
      "Production build contains no mock code; a bundle budget (e.g. ≤ 250 kB gzip for the entry) written down and respected|||Bản build production không chứa mã mock; ngân sách bundle (vd ≤ 250 kB gzip cho entry) được ghi lại và tuân thủ",
      "Deployed on HTTPS with SPA fallback, security headers (CSP, X-Content-Type-Options, Referrer-Policy) and long cache for hashed assets|||Deploy trên HTTPS có SPA fallback, header bảo mật (CSP, X-Content-Type-Options, Referrer-Policy) và cache dài cho tệp có mã băm",
      "Environment variables documented in .env.example; no secret in the repository or in the client bundle|||Biến môi trường ghi trong .env.example; không bí mật nào trong repo hay trong bundle client",
    ],
    nangCao: [
      "Error reporting and a Web Vitals report (LCP, INP, CLS) from real visits|||Báo lỗi và số đo Web Vitals (LCP, INP, CLS) từ lượt truy cập thật",
      "A preview deployment per pull request with the tests as a required check|||Mỗi pull request có bản deploy xem trước, test là bước kiểm bắt buộc",
    ],
    datKhi: [
      "Five requests that receive 401 at the same time cause exactly one refresh (test output or Network tab screenshot)|||Năm request cùng nhận 401 chỉ gây đúng một lần refresh (output test hoặc ảnh tab Network)",
      "The live URL loads on a phone, deep links survive F5, and securityheaders.com or curl -I shows your headers|||URL thật tải được trên điện thoại, link sâu sống sót qua F5, và securityheaders.com hoặc curl -I cho thấy header của bạn",
      "Searching the built dist folder for your mock handlers finds nothing|||Tìm trong thư mục dist đã build không thấy handler mock nào",
      "Tag v1.0.0 with a green test run|||Gắn tag v1.0.0 với lượt test xanh",
    ],
    goiY: [
      "Keep the refresh in one shared promise: the first 401 starts it, every other 401 awaits the same promise, and it is cleared when it settles|||Giữ lần refresh trong một promise dùng chung: 401 đầu tiên khởi động nó, mọi 401 khác chờ đúng promise đó, và xoá nó khi đã xong",
      "Anything in a VITE_ variable ends up in the JavaScript everyone downloads — it is configuration, never a secret|||Mọi thứ trong biến VITE_ đều nằm trong JavaScript mà ai cũng tải về — đó là cấu hình, không bao giờ là bí mật",
      "Write the CSP in report-only mode first, open every page, fix what it reports, then enforce it|||Viết CSP ở chế độ chỉ báo cáo trước, mở mọi trang, sửa những gì nó báo, rồi mới bật chặn thật",
    ],
    nop: ["repo", "demo", "anh"],
    bai: [L(14, "rx-14-1-xac-thuc"), L(14, "rx-14-2-api-that"), L(14, "rx-14-3-build-deploy"), L(14, "rx-14-4-phong-van")],
  },
];

const GIOI_THIEU = [
  "<p><strong>After this course you will have built, tested and deployed one real React application of your own.</strong> Not a copy of the clinic booking app we build together in the lessons, but an app for a topic you chose: typed components, state in the right place, forms with Zod, server data through TanStack Query, several pages with React Router, measured performance, keyboard and screen-reader access, a real test suite, React 19 Actions where they help, and a live HTTPS address you can put on your CV.</p>",
  "<p><strong>Why one project through the whole course?</strong> A lesson teaches one idea; a project makes the ideas collide. The form of Chapter 3 must survive the cache of Chapter 6, the route of Chapter 7 must not lose the filter you put in the URL in Chapter 5, the memo of Chapter 8 must still be right after the compiler of Chapter 12. That is where understanding — and the questions an interviewer asks about your portfolio — come from. After each of the 14 chapters there is a milestone that applies exactly that chapter to your topic, with a minimal example that was really built and tested.</p>",
  "<p><strong>How it is graded.</strong> Every milestone has “Done when” criteria you can check yourself and a submission box (repository link, often a demo link or screenshots). At the end you defend the project in front of an AI committee that asks about YOUR code — where this state lives and why, what happens when the server answers 409, how a keyboard user reaches this button, which test would catch this bug — scored on a 10-point rubric.</p>",
  "|||",
  "<p><strong>Học xong khoá này bạn sẽ tự dựng, kiểm thử và đưa lên mạng một ứng dụng React thật của riêng mình.</strong> Không phải bản chép app đặt lịch khám mà ta cùng xây trong bài học, mà là app cho đề tài bạn tự chọn: component có kiểu, state đặt đúng chỗ, form có Zod, dữ liệu server qua TanStack Query, nhiều trang với React Router, hiệu năng có số đo, dùng được bằng bàn phím và trình đọc màn hình, bộ test thật, Actions của React 19 ở chỗ có ích, và một địa chỉ HTTPS thật để ghi vào CV.</p>",
  "<p><strong>Vì sao làm MỘT dự án xuyên suốt khoá?</strong> Bài học dạy từng ý; dự án bắt các ý va vào nhau. Form của Chương 3 phải sống được với cache của Chương 6, tuyến của Chương 7 không được làm mất bộ lọc bạn đặt lên URL ở Chương 5, memo của Chương 8 vẫn phải đúng sau khi bật compiler ở Chương 12. Hiểu thật — và những câu nhà tuyển dụng hay hỏi về portfolio của bạn — đến từ chỗ đó. Sau mỗi chương trong 14 chương có một mốc áp đúng kiến thức chương ấy vào đề tài của bạn, kèm một ví dụ tối thiểu đã dựng và chạy test thật.</p>",
  "<p><strong>Chấm thế nào.</strong> Mỗi mốc có tiêu chí “Đạt khi” để tự kiểm và một ô nộp bài (link repo, nhiều mốc kèm link demo hoặc ảnh). Cuối khoá bạn bảo vệ dự án trước một hội đồng AI hỏi về CHÍNH mã của bạn — state này nằm đâu và vì sao, server trả 409 thì sao, người dùng bàn phím tới nút này thế nào, test nào bắt được lỗi này — chấm theo thang 10 điểm.</p>",
].join("");

const TU_CHON = {
  yeuCauToiThieu: [
    "A React + TypeScript single-page app (Vite or similar) with at least 5 routes, a shared layout and a detail route with a parameter|||Một app React + TypeScript một trang (Vite hoặc tương tự) có ít nhất 5 tuyến, một layout dùng chung và một tuyến chi tiết có tham số",
    "At least 2 real forms (create and edit) with schema validation and errors coming back from the server|||Ít nhất 2 form thật (tạo và sửa) có kiểm bằng schema và lỗi trả về từ server",
    "Server data through an API (a mock such as MSW / json-server is fine, or your own backend) with at least 2 kinds of write|||Dữ liệu server qua API (API giả như MSW / json-server cũng được, hoặc backend của chính bạn) với ít nhất 2 kiểu thao tác ghi",
    "State shared by distant screens and something worth putting in the URL (filters, tabs, pages)|||Có state dùng chung giữa các màn hình xa nhau và có thứ đáng đặt lên URL (bộ lọc, tab, trang)",
    "A list that can grow to thousands of items, and a natural place for a dialog / overlay|||Có một danh sách có thể lớn tới hàng nghìn mục, và có chỗ tự nhiên cho hộp thoại / lớp phủ",
    "Users who log in (at least one protected area) — no real payments, no real personal data, no copying another site's design or content|||Có người dùng đăng nhập (ít nhất một khu vực cần đăng nhập) — không thanh toán thật, không dữ liệu cá nhân thật, không chép thiết kế hay nội dung website khác",
  ],
  goiYQuyMo: "Right size: one sentence pitch, 6–12 features, 6–12 screens, 2–4 kinds of data, roughly 70–110 hours spread over the 14 chapters. Too small: a to-do list or a weather widget with one screen. Too big: a social network with chat, feed, video and notifications — cut it to the core you can finish, test and defend, and list the rest as future work in the README. It must be a frontend project: if most of the work is in a backend, the Node.js or Spring Boot course is the better place for it.|||Vừa sức: một câu giới thiệu, 6–12 tính năng, 6–12 màn hình, 2–4 loại dữ liệu, khoảng 70–110 giờ rải qua 14 chương. Quá nhỏ: một danh sách việc cần làm hoặc widget thời tiết một màn hình. Quá to: một mạng xã hội có chat, bảng tin, video và thông báo — hãy cắt về phần lõi làm xong, test và bảo vệ được, phần còn lại ghi “hướng phát triển” trong README. Phải là dự án frontend: nếu phần lớn công sức nằm ở backend thì khoá Node.js hoặc Spring Boot hợp với nó hơn.",
};

const BAO_VE = {
  rubric: [
    { tieuChi: "Working features and UX states|||Tính năng chạy đúng và các trạng thái giao diện", diem: 2, moTa: "The core features work end to end on the live URL, including loading, error, empty, not-found and permission cases; deep links survive F5.|||Các tính năng lõi chạy trọn trên URL thật, kể cả trạng thái đang tải, lỗi, rỗng, không tìm thấy và phân quyền; link sâu sống sót qua F5." },
    { tieuChi: "Component and state architecture|||Kiến trúc component và state", diem: 2, moTa: "Small typed components in feature folders; each piece of state lives in the right place (local, URL, store, server cache) with no duplicated or derived state; effects only for real synchronisation.|||Component nhỏ có kiểu, sắp theo thư mục tính năng; mỗi mẩu state ở đúng chỗ (cục bộ, URL, store, cache server), không state trùng hay state dẫn xuất; effect chỉ dùng cho đồng bộ thật." },
    { tieuChi: "Data, forms and errors|||Dữ liệu, form và lỗi", diem: 1, moTa: "Queries with good keys, mutations that update the cache correctly, an optimistic update with rollback; forms with schema validation, server errors mapped to fields, no double submit.|||Query có khoá tốt, mutation cập nhật cache đúng, một cập nhật lạc quan có hoàn tác; form kiểm bằng schema, lỗi server gắn đúng trường, không gửi hai lần." },
    { tieuChi: "Accessibility and performance|||Khả năng tiếp cận và hiệu năng", diem: 1.5, moTa: "Main story usable by keyboard and screen reader, axe clean; performance decisions backed by Profiler numbers; lazy-loaded chunks and a respected bundle budget; long lists virtualised.|||Câu chuyện chính dùng được bằng bàn phím và trình đọc màn hình, axe sạch; quyết định hiệu năng có số đo Profiler; chunk tải lười và ngân sách bundle được tuân thủ; danh sách dài được ảo hoá." },
    { tieuChi: "Tests and CI|||Kiểm thử và CI", diem: 1.5, moTa: "Meaningful unit, component and hook tests written like a user (roles, labels, user-event), async states against MSW, at least one integration test of the main story, green on the defended commit.|||Unit test, test component và test hook có ý nghĩa, viết theo cách người dùng (vai trò, nhãn, user-event), trạng thái bất đồng bộ với MSW, ít nhất một test tích hợp cho câu chuyện chính, xanh ở commit bảo vệ." },
    { tieuChi: "Production and security|||Production và bảo mật", diem: 1, moTa: "Token handling with a single refresh, safe rendering of user content, no secrets in the bundle, security headers, HTTPS deploy with SPA fallback and correct caching.|||Xử lý token với một lần refresh, render nội dung người dùng an toàn, không bí mật trong bundle, header bảo mật, deploy HTTPS có SPA fallback và cache đúng." },
    { tieuChi: "Presentation and answers|||Trình bày và trả lời", diem: 1, moTa: "A 5-minute demo that follows one user story; answers that open the right file, explain why, and admit trade-offs honestly.|||Demo 5 phút đi theo một câu chuyện người dùng; câu trả lời mở đúng tệp, giải thích được vì sao, và thật thà về đánh đổi." },
  ],
  cauHoiMau: [
    "Show the component tree of your main screen. Why is this piece a separate component, and why is that one not?|||Cho xem cây component của màn hình chính. Vì sao mảnh này là component riêng, còn mảnh kia thì không?",
    "Open STATE.md. Pick one piece of state and explain why it lives there and not one level higher or lower.|||Mở STATE.md. Chọn một mẩu state và giải thích vì sao nó nằm ở đó mà không cao hơn hay thấp hơn một tầng.",
    "Which values on this screen are derived? Show that none of them is stored in its own useState.|||Giá trị nào trên màn hình này là dẫn xuất? Cho thấy không cái nào được lưu trong useState riêng.",
    "Why must this update be immutable? What exactly breaks if you push into the array and call setState with the same array?|||Vì sao cập nhật này phải bất biến? Nếu push vào mảng rồi gọi setState với chính mảng đó thì hỏng chính xác chỗ nào?",
    "Your list uses key={item.id}. What would go wrong, visibly, if you used the index — show it with a reorder or a delete.|||Danh sách dùng key={item.id}. Nếu dùng index thì lỗi gì hiện ra — cho thấy bằng thao tác đổi thứ tự hoặc xoá.",
    "Walk through every useEffect left in the app. For one of them, what happens without its cleanup, and why does StrictMode reveal it?|||Đi qua từng useEffect còn lại trong app. Với một cái, nếu không có hàm dọn dẹp thì chuyện gì xảy ra, và vì sao StrictMode làm lộ ra?",
    "Show a place where you removed an effect because the logic belonged in render or in an event handler.|||Chỉ một chỗ bạn đã bỏ effect vì logic đó thuộc về render hoặc hàm xử lý sự kiện.",
    "Context, Zustand or the URL: which did you use for what, and what would happen to re-renders if everything were in one context?|||Context, Zustand hay URL: bạn dùng cái nào cho việc gì, và nếu mọi thứ nằm trong một context thì việc render lại sẽ ra sao?",
    "I copy the URL of your filtered list and send it to a friend. What do they see, and which code makes it so?|||Tôi sao chép URL danh sách đã lọc gửi cho bạn. Người đó thấy gì, và đoạn mã nào làm được điều đó?",
    "Why is server data not in useState or your store? What does TanStack Query give you that a fetch in an effect does not?|||Vì sao dữ liệu server không nằm trong useState hay store? TanStack Query cho bạn gì mà fetch trong effect không có?",
    "Explain your query keys. I change a filter: which request is sent, which cache entry is used, when is it considered stale?|||Giải thích các query key. Tôi đổi một bộ lọc: request nào được gửi, mục cache nào được dùng, khi nào nó bị coi là cũ?",
    "Walk through your optimistic update when the server returns 500. Where is the snapshot kept and when is it restored?|||Đi qua cập nhật lạc quan khi server trả 500. Bản chụp được giữ ở đâu và khi nào được khôi phục?",
    "The server answers 409 to your create form. Follow that error to the field where the user sees it.|||Server trả 409 cho form tạo. Lần theo lỗi đó tới đúng ô mà người dùng thấy nó.",
    "A user double-clicks Save on a slow network. How many requests reach the server, and what stops the second one?|||Người dùng bấm đúp Lưu khi mạng chậm. Bao nhiêu request tới server, và cái gì chặn cái thứ hai?",
    "Show your schema. Which rules are there, and why is the TypeScript type of the form not written by hand?|||Cho xem schema. Có những luật nào, và vì sao kiểu TypeScript của form không viết tay?",
    "How does your login gate work? After login, how does the user land on the page they originally asked for?|||Cửa chặn đăng nhập hoạt động thế nào? Đăng nhập xong, làm sao người dùng về đúng trang họ đã đòi?",
    "Open PERFORMANCE.md. What did you measure, what did you change, by how much did it help, and what did you choose not to optimise?|||Mở PERFORMANCE.md. Bạn đã đo gì, đổi gì, đỡ được bao nhiêu, và chọn không tối ưu chỗ nào?",
    "Why is this component wrapped in memo? Remove it: what does the Profiler show now?|||Vì sao component này được bọc memo? Bỏ nó đi: Profiler giờ cho thấy gì?",
    "Unplug the mouse. Do the main story with the keyboard only, and tell us what a screen reader announces at the key steps.|||Rút chuột ra. Làm câu chuyện chính chỉ bằng bàn phím, và cho biết trình đọc màn hình đọc gì ở các bước quan trọng.",
    "Where does focus go when your dialog opens and when it closes? Which code decides that?|||Focus đi đâu khi hộp thoại mở và khi đóng? Đoạn mã nào quyết định điều đó?",
    "Throw an error inside one widget on purpose. What does the user see, and what does your error boundary not catch?|||Cố ý ném lỗi trong một widget. Người dùng thấy gì, và error boundary của bạn không bắt được loại lỗi nào?",
    "Pick one test and break the code it protects. Show it turning red, then explain which real bug it would catch.|||Chọn một test và làm hỏng đoạn mã nó bảo vệ. Cho thấy nó đỏ, rồi giải thích nó bắt được lỗi thật nào.",
    "Why do your tests query by role and label instead of class names? Show one test that a refactor of the CSS would not break.|||Vì sao test truy vấn theo vai trò và nhãn thay vì tên class? Cho xem một test mà sửa CSS không làm hỏng.",
    "Where did you use useTransition, useDeferredValue or useOptimistic, and what exactly did the user feel before you did?|||Bạn dùng useTransition, useDeferredValue hay useOptimistic ở đâu, và trước đó người dùng cảm thấy chính xác điều gì?",
    "A note contains an img tag with onerror. Follow it from the input to the screen and show where it is neutralised.|||Một ghi chú chứa thẻ img có onerror. Lần theo nó từ ô nhập tới màn hình và chỉ chỗ nó bị vô hiệu hoá.",
    "Five requests get 401 at the same moment. How many refresh calls does your client make, and what happens if the refresh fails?|||Năm request cùng nhận 401 một lúc. Client gọi refresh mấy lần, và nếu refresh lỗi thì sao?",
    "Which environment variables does the build use, and why is none of them a secret? What would an attacker find in your bundle?|||Bản build dùng những biến môi trường nào, và vì sao không cái nào là bí mật? Kẻ tấn công tìm được gì trong bundle của bạn?",
    "The requirement changes: every item now belongs to a team instead of one user. Which types, routes, queries and tests do you change?|||Yêu cầu đổi: mỗi mục giờ thuộc về một nhóm thay vì một người. Bạn sửa những kiểu, tuyến, query và test nào?",
    "Why a client-rendered React app and not Next.js for this project? Name one thing that would get easier and one harder.|||Vì sao dự án này là app React render phía client mà không phải Next.js? Nêu một thứ sẽ dễ hơn và một thứ khó hơn.",
    "Which part did an AI assistant help with, and how did you check that it was correct, accessible and safe?|||Phần nào có trợ lý AI giúp, và bạn kiểm nó đúng, dễ tiếp cận và an toàn thế nào?",
  ],
  chuanBi: [
    "All 14 milestones submitted (or a note explaining any missing one), each with the commit or tag that delivered it|||Đã nộp đủ 14 mốc (hoặc ghi chú giải thích mốc thiếu), mỗi mốc kèm commit hoặc tag đã giao nó",
    "The live HTTPS URL works on a phone with mobile data; deep links survive F5|||URL HTTPS thật mở được trên điện thoại dùng 4G; link sâu sống sót qua F5",
    "A fresh clone runs with npm ci and npm run dev using only the README (mock API included or backend URL documented)|||Một bản clone mới chạy được bằng npm ci và npm run dev chỉ nhờ README (có kèm API giả hoặc ghi rõ URL backend)",
    "npm run build and npm test green on the tagged commit v1.0.0|||npm run build và npm test xanh ở commit gắn tag v1.0.0",
    "Two demo accounts with different roles and realistic seed data — written in the README, never your real password|||Hai tài khoản demo khác vai trò với dữ liệu mẫu sát thật — ghi trong README, không bao giờ là mật khẩu thật của bạn",
    "README: pitch, screenshots, component tree, STATE.md, EFFECTS.md, PERFORMANCE.md, TESTING.md, ADRs, known limitations|||README: câu giới thiệu, ảnh chụp, cây component, STATE.md, EFFECTS.md, PERFORMANCE.md, TESTING.md, ADR, giới hạn đã biết",
    "You can open without searching: the main form and its schema, the query keys, one optimistic mutation, the auth client, one test|||Bạn mở được ngay không cần tìm: form chính và schema của nó, các query key, một mutation lạc quan, API client xác thực, một test",
    "Lighthouse and axe run once more on the live URL; screenshots saved|||Chạy lại Lighthouse và axe trên URL thật một lần nữa; đã lưu ảnh chụp",
    "Repository history scanned for secrets one last time (gitleaks or git log -p)|||Đã quét lịch sử repo tìm bí mật lần cuối (gitleaks hoặc git log -p)",
    "A 5-minute demo script that follows one user story, and a screen recording as backup|||Kịch bản demo 5 phút theo một câu chuyện người dùng, và một đoạn quay màn hình dự phòng",
  ],
};

export const DU_AN = {
  version: 1,
  gioiThieu: GIOI_THIEU,
  deTai: DE_TAI,
  tuChon: TU_CHON,
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};

/* ───────────────────────── Dựng bài mốc, bài bảo vệ, lời mời đăng ký ───────────────────────── */

const tach = (s, i) => { const p = String(s).split("|||"); return (p[i] ?? p[0]).trim(); };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;");
const li = (arr, i) => arr.map((x) => "<li>" + esc(tach(x, i)) + "</li>").join("");
const TONG = MOC.length;
const HOC = "/courses/react/learn?lessonSlug=";

const NHAN = [
  {
    eyebrow: (m) => "Course project · Milestone " + m.so + " of " + TONG + " · after " + tach(m.sauChuong, 0),
    topic: "This milestone applies to the topic you registered in “Start here”. The table says what it means for each suggested topic; a self-chosen topic follows the same requirements — if one makes no sense for your topic, write in the README which feature practises that skill instead.",
    req: "✅ Required", stretch: "⭐ Stretch goals (optional)", map: "🧭 What this milestone means for each suggested topic", topicCol: "Topic", buildCol: "What you build now",
    demo: "🧪 Minimal working example — sample topic “Habit tracker”",
    demoNote: "The sample topic is deliberately not one of the suggested topics: this is a starting skeleton, not a solution to copy. Every file below was built and run for real on the author’s machine (Node 26, " + PHIEN_BAN + ") in one Vite + React + TypeScript app, one folder per milestone; the output is pasted unchanged — timings, hashes and paths will differ on yours. Tests appear from the first milestones on as the author’s check; you learn to write them yourself in Chapter 9.",
    hints: "💡 Hints — open one layer at a time", done: "🎯 Done when", submit: "📤 Submit",
    submitNote: "Use the submission box under this lesson, then mark the milestone as done — the course project progress bar counts it.",
    nop: { repo: "the repository link and the commit (or tag) that completes this milestone", demo: "a link to the running app (preview deploy) or a short screen recording", anh: "screenshots of the result (the screen, test output, Profiler, axe…)" },
    lessons: "📚 Lessons this milestone uses", open: "Open lesson", file: "File", run: "Run",
    prev: (n) => (n === 1 ? "Topic registered" : "Milestone " + (n - 1)), next: (n) => (n === TONG ? "Finish & defend" : "Milestone " + (n + 1)), here: "You are here",
  },
  {
    eyebrow: (m) => "Dự án cuối khoá · Mốc " + m.so + "/" + TONG + " · sau " + tach(m.sauChuong, 1),
    topic: "Mốc này áp vào đề tài bạn đã đăng ký ở bài “Bắt đầu tại đây”. Bảng dưới cho biết với từng đề tài gợi ý thì mốc này nghĩa là gì; đề tài tự chọn làm theo đúng các yêu cầu chung — yêu cầu nào không hợp với đề tài thì ghi trong README tính năng nào luyện kỹ năng đó thay thế.",
    req: "✅ Yêu cầu bắt buộc", stretch: "⭐ Nâng cao (tuỳ chọn)", map: "🧭 Mốc này nghĩa là gì với từng đề tài gợi ý", topicCol: "Đề tài", buildCol: "Phần bạn làm ở mốc này",
    demo: "🧪 Ví dụ tối thiểu chạy được — đề tài mẫu “Sổ thói quen” (Habit tracker)",
    demoNote: "Đề tài mẫu cố ý không nằm trong danh sách gợi ý: đây là bộ khung khởi đầu, không phải lời giải để chép. Mọi tệp dưới đây đã dựng và chạy THẬT trên máy soạn bài (Node 26, " + PHIEN_BAN + ") trong một app Vite + React + TypeScript, mỗi mốc một thư mục; output dán nguyên văn — thời gian, mã băm và đường dẫn trên máy bạn sẽ khác. Test xuất hiện từ các mốc đầu như phép kiểm của người soạn; bạn học tự viết chúng ở Chương 9.",
    hints: "💡 Gợi ý — mở từng tầng một", done: "🎯 Đạt khi", submit: "📤 Nộp bài",
    submitNote: "Dùng ô nộp bài bên dưới bài này, rồi đánh dấu mốc đã xong — thanh tiến độ dự án của khoá sẽ tính nó.",
    nop: { repo: "link repo và commit (hoặc tag) hoàn thành mốc này", demo: "link app đang chạy (bản deploy xem trước) hoặc một đoạn quay màn hình ngắn", anh: "ảnh chụp kết quả (màn hình, output test, Profiler, axe…)" },
    lessons: "📚 Bài học mốc này dùng tới", open: "Mở bài", file: "Tệp", run: "Chạy",
    prev: (n) => (n === 1 ? "Đã đăng ký đề tài" : "Mốc " + (n - 1)), next: (n) => (n === TONG ? "Hoàn thiện & bảo vệ" : "Mốc " + (n + 1)), here: "Bạn đang ở đây",
  },
];

const LANG_CLASS = { tsx: "language-tsx", ts: "language-ts", bash: "language-bash", plaintext: "language-bash" };

function khoiDemo(so, N) {
  return (MA[so] || []).map((b) => {
    if (b.code != null) return "<p><strong>" + N.file + ":</strong> <code>" + esc(b.file) + "</code></p>\n<pre><code class=\"" + (LANG_CLASS[b.lang] || "language-tsx") + "\">" + esc(b.code) + "</code></pre>";
    return "<p><strong>" + N.run + ":</strong></p>\n<pre><code class=\"language-bash\">" + esc(b.cmd) + "</code></pre>\n<div class=\"out\">" + esc(b.out) + "</div>";
  }).join("\n");
}

/** baiMoc(so, tieuDe) → bài EXERCISE của mốc `so` (đặt trước quiz của chương `so`). */
export function baiMoc(so, tieuDe = new Map()) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error("react _du-an: không có mốc " + so);
  if (!MA[so]) throw new Error("react _du-an: thiếu khung chạy thật MA[" + so + "] — sinh lại _du-an-ma.mjs");
  const khoi = (i) => {
    const N = NHAN[i];
    const bang = DE_TAI.map((d) => {
      const b = d.banDoChuong.find((x) => x.moc === so);
      return "<tr><td>" + esc(tach(d.ten, i)) + "</td><td>" + esc(b ? tach(b.dung, i) : "—") + "</td></tr>";
    }).join("\n");
    const goiY = m.goiY.map((g, k) => "<details class=\"tu-kiem\"><summary>" + (i === 0 ? "Hint " : "Gợi ý ") + (k + 1) + "</summary><p>" + esc(tach(g, i)) + "</p></details>").join("\n");
    const truoc = so === 1 ? tach("Start here|||Bắt đầu tại đây", i) : tach(MOC[so - 2].ten, i);
    const sau = so === TONG ? tach("Rubric, committee questions, AI defence room|||Thang điểm, câu hỏi hội đồng, phòng bảo vệ AI", i) : tach(MOC[so].ten, i);
    const bai = m.bai.map((b) => {
      if (tieuDe.size && !tieuDe.has(b.slug)) throw new Error("react _du-an: mốc " + so + " trỏ tới bài không có: " + b.slug);
      const t = tieuDe.has(b.slug) ? tach(tieuDe.get(b.slug), i) : b.slug;
      return "<a class=\"link-card\" href=\"" + HOC + b.slug + "\"><span class=\"lc-ico\">📘</span><span class=\"lc-body\"><span class=\"lc-title\">" + esc(t) + "</span><span class=\"lc-sub\">" + esc(tach(m.sauChuong, i)) + "</span></span><span class=\"lc-cta\">" + N.open + " →</span></a>";
    }).join("\n");
    return [
      "<div class=\"" + (i === 0 ? "ml-en" : "ml-vi") + "\">",
      "<span class=\"eyebrow\">" + esc(N.eyebrow(m)) + "</span>",
      "<h2>" + esc(tach(m.ten, i)) + "</h2>",
      "<p class=\"lead\">" + esc(tach(m.lead, i)) + "</p>",
      "<div class=\"lz-flow\">",
      "<div class=\"lz-step\"><span class=\"lz-k\">✓</span><span class=\"lz-t\">" + esc(N.prev(so)) + "</span><span class=\"lz-d\">" + esc(truoc) + "</span></div>",
      "<div class=\"lz-step\"><span class=\"lz-k\">" + so + "</span><span class=\"lz-t\">" + N.here + "</span><span class=\"lz-d\">" + esc(tach(m.sauChuong, i)) + "</span></div>",
      "<div class=\"lz-step\"><span class=\"lz-k\">→</span><span class=\"lz-t\">" + esc(N.next(so)) + "</span><span class=\"lz-d\">" + esc(sau) + "</span></div>",
      "</div>",
      "<p>" + esc(N.topic) + "</p>",
      "<h3>" + N.req + "</h3>",
      "<ol>" + li(m.yeuCau, i) + "</ol>",
      "<h3>" + N.stretch + "</h3>",
      "<ul>" + li(m.nangCao, i) + "</ul>",
      "<h3>" + N.map + "</h3>",
      "<table>\n<thead><tr><th>" + N.topicCol + "</th><th>" + N.buildCol + "</th></tr></thead>\n<tbody>\n" + bang + "\n</tbody>\n</table>",
      "<h3>" + N.demo + "</h3>",
      "<p class=\"note-ct\">" + esc(N.demoNote) + "</p>",
      khoiDemo(so, N),
      "<h3>" + N.hints + "</h3>",
      goiY,
      "<div class=\"callout ok\"><p><strong>" + N.done + "</strong></p><ul>" + li(m.datKhi, i) + "</ul></div>",
      "<h3>" + N.submit + "</h3>",
      "<ul>" + m.nop.map((k) => "<li>" + esc(N.nop[k]) + "</li>").join("") + "</ul>",
      "<p>" + esc(N.submitNote) + "</p>",
      "<h3>" + N.lessons + "</h3>",
      bai,
      "</div>",
    ].join("\n");
  };
  return {
    title: "🛠 Project milestone " + so + " — " + tach(m.ten, 0) + "|||🛠 Mốc dự án " + so + " — " + tach(m.ten, 1),
    slug: m.slug,
    type: "EXERCISE",
    mocDuAn: so,
    isFreePreview: true, // cả khoá React đều xem thử được (95/95 bài) — mốc không bị khoá riêng
    description: "Mốc dự án " + so + "/" + TONG + " (sau " + tach(m.sauChuong, 1) + "): " + tach(m.ten, 1) + " — yêu cầu, nâng cao, đạt khi, gợi ý theo tầng, ví dụ chạy thật, nộp bài.",
    content: "\n" + khoi(0) + "\n" + khoi(1) + "\n",
  };
}

/** baiBaoVe() → bài EXERCISE cuối khoá { baoVeDuAn: true } dựng từ BAO_VE. */
export function baiBaoVe() {
  const khoi = (i) => {
    const en = i === 0;
    const tong = BAO_VE.rubric.reduce((a, r) => a + r.diem, 0);
    const so = (x) => (en ? String(x) : String(x).replace(".", ","));
    const rub = BAO_VE.rubric.map((r) => "<tr><td>" + esc(tach(r.tieuChi, i)) + "</td><td>" + so(r.diem) + "</td><td>" + esc(tach(r.moTa, i)) + "</td></tr>").join("\n");
    return [
      "<div class=\"" + (en ? "ml-en" : "ml-vi") + "\">",
      "<span class=\"eyebrow\">" + (en ? "Course project · Final step" : "Dự án cuối khoá · Bước cuối") + "</span>",
      "<h2>" + (en ? "Finish and defend your React app" : "Hoàn thiện và bảo vệ app React của bạn") + "</h2>",
      "<p class=\"lead\">" + (en
        ? "Fourteen milestones turned your registered topic into a deployed, tested React application. This last step is how a university assignment or a frontend interview ends: you hand in something that runs, then you explain it — why this state lives here, what the user sees when the server fails, how a keyboard user gets through, which test would catch a regression. The AI defence room below plays the committee: it reads what you submit and keeps asking until it is sure you built and understand the project."
        : "Mười bốn mốc đã biến đề tài bạn đăng ký thành một ứng dụng React đã kiểm thử và chạy trên mạng. Bước cuối này giống cách một assignment ở trường hay một buổi phỏng vấn frontend kết thúc: bạn nộp thứ chạy được, rồi giải thích nó — vì sao state này nằm đây, server lỗi thì người dùng thấy gì, người dùng bàn phím đi qua thế nào, test nào sẽ bắt được lỗi tái phát. Phòng bảo vệ AI bên dưới đóng vai hội đồng: nó đọc thứ bạn nộp và hỏi vặn tới khi chắc rằng bạn đã tự làm và hiểu dự án.") + "</p>",
      "<div class=\"lz-flow\">",
      en
        ? "<div class=\"lz-step\"><span class=\"lz-k\">1</span><span class=\"lz-t\">Finish</span><span class=\"lz-d\">Close open milestones, tag v1.0.0, build and tests green, live URL works.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">2</span><span class=\"lz-t\">Submit</span><span class=\"lz-d\">Repository, live URL, README, demo accounts.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">3</span><span class=\"lz-t\">Present</span><span class=\"lz-d\">5 minutes: one user story end to end.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">4</span><span class=\"lz-t\">Questions</span><span class=\"lz-d\">State, data, forms, a11y, performance, tests, your choices.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">5</span><span class=\"lz-t\">Score</span><span class=\"lz-d\">10-point rubric + written feedback; fix and defend again.</span></div>"
        : "<div class=\"lz-step\"><span class=\"lz-k\">1</span><span class=\"lz-t\">Hoàn thiện</span><span class=\"lz-d\">Đóng mốc còn mở, gắn tag v1.0.0, build và test xanh, URL thật chạy.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">2</span><span class=\"lz-t\">Nộp</span><span class=\"lz-d\">Repo, URL thật, README, tài khoản demo.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">3</span><span class=\"lz-t\">Trình bày</span><span class=\"lz-d\">5 phút: một câu chuyện người dùng từ đầu tới cuối.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">4</span><span class=\"lz-t\">Hỏi đáp</span><span class=\"lz-d\">State, dữ liệu, form, a11y, hiệu năng, test, lựa chọn của bạn.</span></div>\n<div class=\"lz-step\"><span class=\"lz-k\">5</span><span class=\"lz-t\">Chấm</span><span class=\"lz-d\">Thang 10 điểm + nhận xét viết; sửa xong được bảo vệ lại.</span></div>",
      "</div>",
      "<h3>" + (en ? "✅ Checklist before you enter the room" : "✅ Danh sách kiểm trước khi vào phòng") + "</h3>",
      "<div class=\"callout ok\"><ul>" + BAO_VE.chuanBi.map((x) => "<li>☐ " + esc(tach(x, i)) + "</li>").join("") + "</ul></div>",
      "<h3>" + (en ? "📊 Rubric (" + tong + " points)" : "📊 Thang điểm (" + tong + " điểm)") + "</h3>",
      "<table>\n<thead><tr><th>" + (en ? "Criterion" : "Tiêu chí") + "</th><th>" + (en ? "Points" : "Điểm") + "</th><th>" + (en ? "What earns the points" : "Thế nào thì được điểm") + "</th></tr></thead>\n<tbody>\n" + rub + "\n<tr><td><strong>" + (en ? "Total" : "Tổng") + "</strong></td><td><strong>" + so(tong) + "</strong></td><td></td></tr>\n</tbody>\n</table>",
      "<h3>" + (en ? "❓ Questions committees and interviewers really ask" : "❓ Những câu hội đồng và nhà tuyển dụng hay hỏi thật") + "</h3>",
      "<p>" + (en ? "Practise out loud with the file open and the app running. A good answer has three parts: what the code does, why you chose it, and what you would change if the requirement changed." : "Tập trả lời thành tiếng, mở sẵn tệp liên quan và app đang chạy. Câu trả lời tốt có ba phần: mã làm gì, vì sao bạn chọn cách đó, và nếu yêu cầu đổi thì bạn sửa gì.") + "</p>",
      "<ol>" + li(BAO_VE.cauHoiMau, i) + "</ol>",
      "<div class=\"pitfall co-tieu-de\"><p><strong>" + (en ? "Trap — defending code you cannot explain." : "Bẫy — bảo vệ đoạn mã mình không giải thích được.") + "</strong> " + (en
        ? "Using an AI assistant, a UI kit or a tutorial is allowed; not understanding the result is what fails a defence. Read every file once before you submit and be ready to say why each hook, each piece of state and each dependency exists."
        : "Dùng trợ lý AI, bộ UI có sẵn hay hướng dẫn trên mạng là được phép; không hiểu kết quả mới là thứ làm trượt buổi bảo vệ. Đọc lại mọi tệp một lượt trước khi nộp và sẵn sàng nói vì sao từng hook, từng mẩu state và từng thư viện tồn tại.") + "</p></div>",
      "<div class=\"pitfall co-tieu-de\"><p><strong>" + (en ? "Trap — a demo that depends on luck." : "Bẫy — buổi demo trông vào may rủi.") + "</strong> " + (en
        ? "A free backend can sleep and the first request may take 30 seconds; a mock API may be switched off in the production build. Open the live URL a minute before, keep a screen recording as backup, and never demo with your real password or real personal data."
        : "Backend miễn phí có thể ngủ và request đầu mất 30 giây; API giả có thể đã bị tắt trong bản build production. Mở URL thật trước một phút, giữ một đoạn quay màn hình dự phòng, và không bao giờ demo bằng mật khẩu thật hay dữ liệu cá nhân thật.") + "</p></div>",
      "<div class=\"callout ok\"><p><strong>" + (en ? "🎯 Done when" : "🎯 Đạt khi") + "</strong></p><ul>" + (en
        ? "<li>Every checklist item above is ticked.</li><li>You submitted the repository, the live URL and the demo accounts in the box below.</li><li>You finished one session in the AI defence room and read its feedback.</li><li>You fixed what the feedback found (or wrote why not) and, if you want a better score, defended again.</li>"
        : "<li>Mọi mục trong danh sách kiểm ở trên đã đánh dấu.</li><li>Bạn đã nộp repo, URL thật và tài khoản demo ở khung bên dưới.</li><li>Bạn đã xong một phiên trong phòng bảo vệ AI và đọc nhận xét.</li><li>Bạn đã sửa những gì nhận xét chỉ ra (hoặc ghi lý do không sửa) và, nếu muốn điểm cao hơn, bảo vệ lại.</li>") + "</ul></div>",
      "<h3>" + (en ? "Where to go next" : "Đi tiếp đâu") + "</h3>",
      "<p>" + (en
        ? "Put this project at the top of your CV with the live URL and a short recording. Then deepen what interviewers probe after a React project: server rendering and routing by folders, a stronger testing practice, and the TypeScript behind your types."
        : "Đặt dự án này lên đầu CV kèm URL thật và một đoạn quay ngắn. Rồi đào sâu những gì nhà tuyển dụng hay hỏi tiếp sau một dự án React: render phía server và định tuyến theo thư mục, kỹ năng kiểm thử chắc hơn, và TypeScript đứng sau các kiểu bạn đã viết.") + "</p>",
      "<a class=\"link-card lien-ket-cheo\" href=\"/courses/nextjs\"><span class=\"lc-ico\">▲</span><span class=\"lc-body\"><span class=\"lc-title\">Next.js</span><span class=\"lc-sub\">" + (en ? "Move this app to the React framework: folder routing, Server Components, caching, SEO and deploy" : "Đưa app này lên framework của React: định tuyến theo thư mục, Server Component, cache, SEO và deploy") + "</span></span><span class=\"lc-cta\">" + (en ? "Open course" : "Mở khoá") + " →</span></a>",
      "<a class=\"link-card lien-ket-cheo\" href=\"/courses/testing\"><span class=\"lc-ico\">🧪</span><span class=\"lc-body\"><span class=\"lc-title\">Testing</span><span class=\"lc-sub\">" + (en ? "Unit, integration and end-to-end tests at the level teams expect" : "Unit test, test tích hợp và end-to-end ở mức các đội phát triển mong đợi") + "</span></span><span class=\"lc-cta\">" + (en ? "Open course" : "Mở khoá") + " →</span></a>",
      "<a class=\"link-card lien-ket-cheo\" href=\"/courses/typescript\"><span class=\"lc-ico\">🔷</span><span class=\"lc-body\"><span class=\"lc-title\">TypeScript</span><span class=\"lc-sub\">" + (en ? "Generics, narrowing and the type tricks behind schemas and typed hooks" : "Generic, thu hẹp kiểu và các kỹ thuật kiểu đứng sau schema và hook có kiểu") + "</span></span><span class=\"lc-cta\">" + (en ? "Open course" : "Mở khoá") + " →</span></a>",
      "</div>",
    ].join("\n");
  };
  return {
    title: "🎓 Finish and defend your course project|||🎓 Hoàn thiện và bảo vệ dự án cuối khoá",
    slug: "rx-bao-ve-du-an",
    type: "EXERCISE",
    baoVeDuAn: true,
    isFreePreview: true, // cả khoá React đều xem thử được (95/95 bài) — mốc không bị khoá riêng
    description: "Bài cuối khoá: checklist hoàn thiện app React của dự án, thang điểm 10, 30 câu hội đồng hay hỏi về chính mã của bạn, và phòng bảo vệ AI.",
    content: "\n" + khoi(0) + "\n" + khoi(1) + "\n",
  };
}

/** Lời mời đăng ký — nối vào CUỐI bài "Bắt đầu tại đây" rx-0-8 (bài đó mang cờ dangKyDuAn: true). */
export const MOI_DANG_KY = "\n" + [
  "<div class=\"ml-en\">",
  "<h3>🎯 Your course project starts today</h3>",
  "<p>Instead of a pile of disconnected exercises, you will build <strong>one real React app of your own</strong> through the whole course — a personal finance tracker with budgets, spaced-repetition flashcards, a rental room search, a job board with an applicant tracker, an online shop admin dashboard, a weekly meal planner, a Markdown knowledge base like a small Notion… or your own idea. After each of the 14 chapters a <strong>🛠 Project milestone</strong> lesson (right before the chapter quiz) tells you exactly what to add with what you just learned, with a minimal example that was really built and tested; at the end you finish it and <strong>defend</strong> it in the AI defence room, scored on a 10-point rubric.</p>",
  "<p>The topics are portfolio-sized on purpose and none of them repeats the FER202 assignment topics: this course goes further — TypeScript, advanced hooks, large state, tests, performance, accessibility and a real deploy.</p>",
  "<p><strong>Register your course project topic below.</strong></p>",
  "</div>",
  "<div class=\"ml-vi\">",
  "<h3>🎯 Dự án cuối khoá bắt đầu từ hôm nay</h3>",
  "<p>Thay vì một đống bài tập rời rạc, bạn sẽ xây <strong>một app React thật của riêng mình</strong> suốt cả khoá — sổ chi tiêu có ngân sách, thẻ ghi nhớ lặp lại ngắt quãng, tìm phòng trọ, trang tuyển dụng kèm theo dõi ứng viên, trang quản trị cửa hàng online, lên thực đơn tuần, sổ tay Markdown kiểu Notion thu nhỏ… hoặc ý tưởng của riêng bạn. Sau mỗi chương trong 14 chương có một bài <strong>🛠 Mốc dự án</strong> (ngay trước bài kiểm tra chương) nói rõ cần thêm gì bằng kiến thức vừa học, kèm một ví dụ tối thiểu đã dựng và chạy test thật; cuối khoá bạn hoàn thiện và <strong>bảo vệ</strong> nó trong phòng bảo vệ AI, chấm theo thang 10 điểm.</p>",
  "<p>Các đề tài cố ý ở tầm portfolio đi xin việc và không trùng đề tài assignment của FER202: khoá này đi xa hơn — TypeScript, hook nâng cao, state lớn, test, hiệu năng, khả năng tiếp cận và deploy thật.</p>",
  "<p><strong>Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới.</strong></p>",
  "</div>",
].join("\n") + "\n";

export default DU_AN;
