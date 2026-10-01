/**
 * Thanh toán online — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: api-design Ch5.1 (idempotency key cho POST) và Ch10.4 (thiết kế webhook phía GỬI) — ở đây là phía NHẬN
 * webhook của cổng thanh toán, chữ ký HMAC của từng cổng, đối soát tiền thật. system-design Ch8 (sổ cái/ví ở mức thiết kế)
 * — khoá này là tích hợp thật. web-security/authentication không lặp. privacy-data-law lo dữ liệu cá nhân.
 * Pháp lý/thuế VN ghi TRUNG TÍNH — người soạn chi tiết PHẢI kiểm văn bản hiện hành (quy định thay đổi thường xuyên).
 * Mọi lab chỉ dùng môi trường sandbox/test của cổng — không dùng thẻ/tiền thật.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'online-payments',
    title: 'Online Payments: VNPay, MoMo, Stripe & Secure Webhooks',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/online-payments.png?v=4',
    shortDescription: 'Take money online safely: payment flows, VietQR, VNPay/MoMo/ZaloPay sandboxes, Stripe, signed idempotent webhooks, reconciliation, refunds, subscriptions, PCI DSS basics, fraud and Vietnamese invoice rules.|||Nhận tiền online an toàn: luồng thanh toán, VietQR, sandbox VNPay/MoMo/ZaloPay, Stripe, webhook có chữ ký và idempotent, đối soát, hoàn tiền, gói định kỳ, PCI DSS nhập môn, chống gian lận và hoá đơn điện tử Việt Nam.',
    description: 'Khoá tích hợp thanh toán cho lập trình viên backend. Bắt đầu từ các bên trong một giao dịch (người mua, người bán, cổng, ngân hàng phát hành, ngân hàng thanh toán, tổ chức thẻ) và vòng đời authorize → capture → settle → payout. Tích hợp thật trên sandbox: chuyển khoản VietQR và đối soát theo nội dung chuyển khoản, VNPay, MoMo, ZaloPay, Stripe (Checkout, Payment Intents, 3-D Secure). Trọng tâm là phần hay hỏng: xác thực chữ ký, webhook đến trễ/trùng/sai thứ tự, idempotency, máy trạng thái đơn hàng, đối soát hằng ngày, hoàn tiền và tranh chấp, gói thuê bao định kỳ, tiền tệ và làm tròn. Thêm PCI DSS nhập môn (không bao giờ lưu số thẻ), chống gian lận, và bức tranh pháp lý tại Việt Nam (hoá đơn điện tử, thuế, website TMĐT) ghi trung tính kèm nguồn chính thức để kiểm. Dự án cuối: thanh toán gói Pro cho một website giống cuongthai.com.',
    whatYouLearn: 'Vẽ và giải thích luồng tiền của một giao dịch thẻ và ví điện tử; tích hợp VietQR, VNPay, MoMo, ZaloPay và Stripe trên sandbox; xác thực chữ ký và xử lý webhook idempotent; thiết kế máy trạng thái thanh toán và sổ cái; đối soát tự động với sao kê; làm hoàn tiền, gói định kỳ, gia hạn và nhắc hạn; giữ phạm vi PCI DSS nhỏ nhất; nhận diện gian lận thường gặp; biết cần kiểm những quy định nào trước khi bán hàng online tại Việt Nam.',
    requirements: 'Đã viết API backend (Node.js/Express hoặc Java/Spring Boot) với PostgreSQL, hiểu HTTP và JSON. Nên học trước API Design (đặc biệt Ch5 và Ch10), PostgreSQL (giao dịch) và Queues & Background Jobs.',
    documentsNote: 'Tài liệu chính (chỉ dùng tài liệu và sandbox chính thức của từng cổng): docs.stripe.com • sandbox.vnpayment.vn/apis • developers.momo.vn • docs.zalopay.vn • vietqr.io và napas.com.vn (chuẩn VietQR) • pcisecuritystandards.org (PCI DSS v4.0) • Cổng thông tin Chính phủ về văn bản pháp luật (vbpl.vn, chinhphu.vn) cho hoá đơn điện tử/thuế/TMĐT • online.gov.vn (thông báo website TMĐT với Bộ Công Thương).',
  },
  sections: khung('pay', [
    ['Section 0 — How money moves online', 'Mục 0 — Tiền chạy trên mạng thế nào', 'Thanh toán online bằng lời đời thường, lịch sử, sự cố thật, và phòng lab sandbox.', [
      ['bat-dau-tai-day', 'Start here (1/2) — Online payments in everyday words, their history, and breaches that made headlines', 'Bắt đầu tại đây (1/2) — Thanh toán online bằng lời đời thường, lịch sử, và những vụ lộ dữ liệu lên báo', 'Người trung gian giữ tiền hộ và báo "đã nhận" · Thẻ tín dụng → PayPal (cuối thập niên 1990) → PCI DSS 1.0 (2004) → Stripe (ra mắt 2011) → ví điện tử và QR chuyển khoản tức thời tại Việt Nam · Target 2013: lộ khoảng 40 triệu thẻ qua hệ thống POS · British Airways 2018: mã độc chèn vào trang thanh toán (Magecart) · Lỗi của lập trình viên thường là trừ tiền hai lần hoặc giao hàng khi chưa nhận tiền'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Gắn thanh toán cho sản phẩm của mình hoặc khách hàng · Vị trí: backend fintech/TMĐT · Lộ trình: api-design + postgresql + background-jobs → khoá này → solo-product · Luật của khoá: chỉ sandbox, không thẻ thật, không lưu số thẻ'],
      ['cai-dat', 'Lab: sandbox accounts, a tunnel for webhooks, and the starter app', 'Phòng lab: tài khoản sandbox, đường hầm nhận webhook, và ứng dụng khởi đầu', 'Đăng ký sandbox Stripe/VNPay/MoMo/ZaloPay · Stripe CLI và cloudflared tunnel để webhook về máy · Ứng dụng mẫu Express/Spring Boot + PostgreSQL bằng Docker · Biến môi trường cho khoá bí mật'],
      ['cac-ben', 'The players: merchant, gateway, acquirer, issuer, card network, wallet', 'Các bên: người bán, cổng, ngân hàng thanh toán, ngân hàng phát hành, tổ chức thẻ, ví', 'Ai giữ tiền lúc nào · Phí đi đâu · Napas và chuyển khoản liên ngân hàng · Payment facilitator'],
    ]],
    ['Chapter 1 — Payment flows and state machines', 'Chương 1 — Luồng thanh toán và máy trạng thái', 'Một đơn hàng đi qua những trạng thái nào.', [
      ['vong-doi', 'Authorize, capture, settle, payout', 'Cấp phép, thu tiền, quyết toán, chi trả', 'Giữ tiền trước, thu sau · Thời gian tiền về tài khoản người bán · Huỷ cấp phép vs hoàn tiền'],
      ['redirect-qr-api', 'Redirect, QR, in-app and API-based flows', 'Luồng chuyển hướng, QR, trong ứng dụng và qua API', 'Redirect về trang cổng · QR động · Deep link mở ví · Return URL KHÔNG phải bằng chứng đã trả tiền'],
      ['may-trang-thai', 'Designing the order and payment state machine', 'Thiết kế máy trạng thái đơn hàng và thanh toán', 'pending → paid/failed/expired/refunded · Chuyển trạng thái hợp lệ · Ràng buộc trong PostgreSQL · Không bao giờ lùi trạng thái'],
      ['tien-te', 'Money in code: integers, currencies and rounding', 'Tiền trong code: số nguyên, tiền tệ và làm tròn', 'Không dùng float · VND không có số lẻ, USD có cent · BigDecimal trong Java · Làm tròn phí và thuế'],
    ]],
    ['Chapter 2 — Bank transfers and VietQR', 'Chương 2 — Chuyển khoản ngân hàng và VietQR', 'Cách rẻ nhất để nhận tiền ở Việt Nam — và cái khó của nó.', [
      ['vietqr', 'VietQR: the standard and generating QR codes', 'VietQR: chuẩn và cách sinh mã QR', 'Chuẩn EMVCo qua Napas · QR tĩnh vs QR có số tiền + nội dung · Sinh ảnh QR phía server'],
      ['doi-soat-noi-dung', 'Matching transfers to orders by memo', 'Khớp chuyển khoản với đơn theo nội dung', 'Mã đơn trong nội dung · Người dùng gõ sai, chuyển thiếu, chuyển hai lần · Hàng chờ đối soát tay (cách cuongthai.com đang làm)'],
      ['tu-dong', 'Automating confirmation: bank APIs and transfer-notification services', 'Tự động xác nhận: API ngân hàng và dịch vụ báo biến động số dư', 'Các lựa chọn và mô hình tin cậy · Webhook biến động số dư · Rủi ro khi trao quyền đọc tài khoản · Kiểm điều khoản dịch vụ'],
    ]],
    ['Chapter 3 — Vietnamese gateways: VNPay, MoMo, ZaloPay', 'Chương 3 — Cổng thanh toán Việt Nam: VNPay, MoMo, ZaloPay', 'Tích hợp trên sandbox, đọc tài liệu chính thức.', [
      ['vnpay', 'VNPay: payment URL, secure hash, IPN and return URL', 'VNPay: URL thanh toán, secure hash, IPN và return URL', 'Sắp xếp tham số và ký HMAC-SHA512 · IPN là nguồn sự thật · Mã phản hồi · Truy vấn giao dịch'],
      ['momo', 'MoMo: create payment, signature and IPN', 'MoMo: tạo thanh toán, chữ ký và IPN', 'Chuỗi ký theo thứ tự trường · requestId vs orderId · Xử lý hết hạn · Test trên ứng dụng MoMo sandbox'],
      ['zalopay', 'ZaloPay: order creation, MAC and callback', 'ZaloPay: tạo đơn, MAC và callback', 'key1/key2 · app_trans_id theo ngày · Callback và truy vấn trạng thái'],
      ['so-sanh', 'Comparing gateways: fees, settlement, UX, documentation', 'So sánh các cổng: phí, quyết toán, trải nghiệm, tài liệu', 'Thủ tục đăng ký cho cá nhân vs doanh nghiệp · Kiểm phí hiện hành trên trang chính thức · Một lớp trừu tượng cho nhiều cổng'],
    ]],
    ['Chapter 4 — Stripe and international payments', 'Chương 4 — Stripe và thanh toán quốc tế', 'Mô hình API thanh toán được coi là chuẩn mực.', [
      ['checkout', 'Stripe Checkout and Payment Links', 'Stripe Checkout và Payment Links', 'Trang thanh toán do Stripe host · Phạm vi PCI nhỏ nhất · Session và metadata'],
      ['payment-intents', 'Payment Intents, Elements and 3-D Secure', 'Payment Intents, Elements và 3-D Secure', 'Vòng đời PaymentIntent · Xác thực mạnh khách hàng (SCA) · requires_action'],
      ['idempotency-stripe', 'Stripe idempotency keys and API versioning', 'Idempotency key và phiên bản API của Stripe', 'Header Idempotency-Key · Nếu đã học api-design Ch5.1: nguyên lý — ở đây là cách một cổng thật làm · Ghim phiên bản API'],
      ['quoc-te', 'Selling abroad from Vietnam: availability, alternatives, FX', 'Bán ra nước ngoài từ Việt Nam: khả năng dùng, lựa chọn thay thế, tỉ giá', 'Kiểm Stripe có hỗ trợ quốc gia của bạn không (trang chính thức) · Merchant of record: Paddle, Lemon Squeezy · PayPal · Phí chuyển đổi tiền tệ'],
    ]],
    ['Chapter 5 — Webhooks: signed, idempotent, ordered', 'Chương 5 — Webhook: có chữ ký, idempotent, đúng thứ tự', 'Nơi phần lớn lỗi thanh toán xảy ra.', [
      ['xac-thuc', 'Verifying signatures: HMAC, raw body and timestamps', 'Xác thực chữ ký: HMAC, raw body và dấu thời gian', 'Phải ký trên body thô, không phải JSON đã parse (bẫy express.json) · So sánh thời gian hằng số · Chống phát lại bằng timestamp · Nếu đã học api-design Ch10.4: đó là phía gửi — ở đây là phía nhận'],
      ['idempotent', 'Idempotent handlers and the event log table', 'Handler idempotent và bảng nhật ký sự kiện', 'Lưu event id với UNIQUE · Xử lý trong cùng giao dịch với cập nhật đơn · Trả 200 nhanh, xử lý nền'],
      ['thu-tu', 'Out-of-order, late and missing webhooks', 'Webhook sai thứ tự, đến trễ và bị mất', 'refunded đến trước paid · Luôn hỏi lại trạng thái từ API cổng · Việc định kỳ quét đơn treo'],
      ['bao-mat', 'Securing the webhook endpoint', 'Bảo vệ endpoint webhook', 'Chỉ nhận IP của cổng nếu cổng công bố · Không lộ lỗi chi tiết · Rate limit · Log đủ để điều tra, không log dữ liệu nhạy cảm'],
    ]],
    ['Chapter 6 — Ledgers, reconciliation and reporting', 'Chương 6 — Sổ cái, đối soát và báo cáo', 'Số trong hệ thống phải khớp số trong ngân hàng.', [
      ['so-cai', 'A double-entry ledger in PostgreSQL', 'Sổ cái bút toán kép trong PostgreSQL', 'Tài khoản, bút toán, dòng bút toán · Tổng luôn bằng 0 · Số dư là tổng, không phải cột UPDATE · Trỏ system-design Ch8'],
      ['doi-soat', 'Daily reconciliation against gateway reports', 'Đối soát hằng ngày với báo cáo của cổng', 'Tải file đối soát · Ba loại lệch: có ở cổng không có ở mình, ngược lại, lệch số tiền · Báo cáo lệch cho người xử lý'],
      ['phi-thue', 'Fees, net amounts and payouts', 'Phí, số tiền thực nhận và chi trả', 'Ghi phí thành bút toán riêng · Tiền về theo lô · Khớp payout với từng giao dịch'],
      ['bao-cao', 'Revenue reports that accountants accept', 'Báo cáo doanh thu kế toán chấp nhận', 'Doanh thu ghi nhận vs tiền thu · Hoàn tiền trừ vào kỳ nào · Xuất CSV cho kế toán'],
    ]],
    ['Chapter 7 — Refunds, disputes and failures', 'Chương 7 — Hoàn tiền, tranh chấp và thất bại', 'Khi tiền phải quay về.', [
      ['hoan-tien', 'Full and partial refunds', 'Hoàn tiền toàn phần và một phần', 'API hoàn tiền từng cổng · Hoàn cho chuyển khoản (thủ công) · Thu hồi quyền lợi đã cấp (gói Pro) · Hoàn tiền cũng cần idempotency'],
      ['chargeback', 'Chargebacks and disputes', 'Chargeback và tranh chấp', 'Người mua khiếu nại với ngân hàng · Bằng chứng cần lưu · Phí tranh chấp · Tỉ lệ tranh chấp cao bị khoá tài khoản'],
      ['that-bai', 'Failure modes: timeouts, unknown status, double charges', 'Các kiểu hỏng: timeout, trạng thái không rõ, trừ tiền hai lần', 'Gọi cổng timeout: đã trừ hay chưa? · Truy vấn lại trước khi thử lại · Nút bấm hai lần · Kịch bản sự cố và cách xử lý'],
    ]],
    ['Chapter 8 — Subscriptions and recurring billing', 'Chương 8 — Gói thuê bao và thu tiền định kỳ', 'Thu tiền hằng tháng mà không làm phiền người dùng.', [
      ['mo-hinh', 'Subscription models: fixed, tiered, usage-based, lifetime', 'Mô hình thuê bao: cố định, theo bậc, theo mức dùng, trọn đời', 'Gói Pro 4 mức của cuongthai.com · Dùng thử · Mã kích hoạt · Trỏ solo-product cho định giá'],
      ['stripe-billing', 'Stripe Billing: products, prices, subscriptions, invoices', 'Stripe Billing: product, price, subscription, invoice', 'Vòng đời subscription · Proration khi đổi gói · Customer portal'],
      ['khong-the-luu', 'Recurring payments in Vietnam without stored cards', 'Thu định kỳ tại Việt Nam khi không lưu thẻ', 'Liên kết ví/tokenization nếu cổng hỗ trợ (kiểm tài liệu) · Gia hạn thủ công + nhắc hạn · Gia hạn từ max(hôm nay, ngày hết hạn)'],
      ['dunning', 'Dunning, grace periods and cancellation', 'Nhắc nợ, thời gian ân hạn và huỷ gói', 'Thẻ hết hạn · Email nhắc · Hạ quyền lợi mà không mất dữ liệu · Huỷ phải dễ như đăng ký'],
    ]],
    ['Chapter 9 — Security and PCI DSS', 'Chương 9 — Bảo mật và PCI DSS', 'Không lưu thẻ, giữ phạm vi kiểm toán nhỏ nhất.', [
      ['pci', 'PCI DSS for developers: scope and SAQ types', 'PCI DSS cho lập trình viên: phạm vi và loại SAQ', 'Lịch sử: 5 tổ chức thẻ lập PCI SSC (2006) · v4.0 · SAQ A (trang host bởi cổng) vs SAQ A-EP vs D · Nguyên tắc: số thẻ không bao giờ chạm server của bạn'],
      ['tokenization', 'Tokenization and hosted fields', 'Token hoá và trường nhập do cổng host', 'Token thay số thẻ · iframe của cổng · Không log request chứa thông tin thẻ'],
      ['magecart', 'Protecting the checkout page: CSP, SRI and third-party scripts', 'Bảo vệ trang thanh toán: CSP, SRI và script bên thứ ba', 'Bài học British Airways · Content-Security-Policy · Subresource Integrity · Trỏ web-security'],
      ['bi-mat', 'Keys and secrets for payment providers', 'Khoá và bí mật của cổng thanh toán', 'Khoá test vs live · Không commit, không NEXT_PUBLIC_ · Xoay khoá · Quyền tối thiểu (restricted keys)'],
    ]],
    ['Chapter 10 — Fraud and abuse', 'Chương 10 — Gian lận và lạm dụng', 'Người xấu cũng dùng nút thanh toán.', [
      ['kieu-gian-lan', 'Common fraud: card testing, stolen cards, friendly fraud, promo abuse', 'Gian lận thường gặp: thử thẻ, thẻ đánh cắp, khiếu nại gian, lạm dụng khuyến mãi', 'Dấu hiệu của từng loại · Thử thẻ bằng giao dịch nhỏ hàng loạt · Tạo nhiều tài khoản lấy mã giảm giá'],
      ['phong-thu', 'Defences: rate limits, velocity rules, 3DS, risk scoring', 'Phòng thủ: giới hạn tần suất, luật vận tốc, 3DS, chấm điểm rủi ro', 'Stripe Radar nhập môn · Luật tự viết trên PostgreSQL/Redis · CAPTCHA ở chỗ đúng · Không chặn nhầm người thật'],
      ['ma-giam-gia', 'Coupons, vouchers and redemption codes that cannot be abused', 'Mã giảm giá, voucher và mã kích hoạt không bị lạm dụng', 'Mã khó đoán · Giới hạn lượt dùng nguyên tử · UNIQUE chống dùng lại (như ProRedemption) · Thu hồi'],
    ]],
    ['Chapter 11 — Legal, tax and invoices in Vietnam (overview)', 'Chương 11 — Pháp lý, thuế và hoá đơn tại Việt Nam (tổng quan)', 'Bức tranh để biết phải hỏi gì và kiểm ở đâu — không thay tư vấn pháp lý/kế toán.', [
      ['tmdt', 'Selling online: e-commerce website notification and consumer protection', 'Bán hàng online: thông báo website TMĐT và bảo vệ người tiêu dùng', 'Thông báo/đăng ký website với Bộ Công Thương (online.gov.vn) · Chính sách hoàn tiền, điều khoản hiển thị rõ · Bài học cuongthai.com: tạm ẩn TMĐT chờ thủ tục · Kiểm nghị định TMĐT hiện hành'],
      ['hoa-don', 'E-invoices: when you must issue them', 'Hoá đơn điện tử: khi nào phải xuất', 'Nghị định 123/2020/NĐ-CP và các văn bản sửa đổi · Nhà cung cấp hoá đơn điện tử có API · Xuất hoá đơn tự động sau thanh toán · Kiểm quy định mới nhất trước khi làm'],
      ['thue', 'Taxes on online revenue: individuals, household businesses, companies', 'Thuế trên doanh thu online: cá nhân, hộ kinh doanh, doanh nghiệp', 'Các hình thức kinh doanh và nghĩa vụ khác nhau · Doanh thu từ nước ngoài · Quy định thay đổi thường xuyên — chỉ dùng nguồn gdt.gov.vn/vbpl.vn · Trỏ solo-product'],
      ['du-lieu', 'Customer data and payment records', 'Dữ liệu khách hàng và hồ sơ thanh toán', 'Lưu gì, lưu bao lâu · Không lưu dữ liệu thẻ · Trỏ privacy-data-law cho Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP'],
    ]],
    ['Chapter 12 — Capstone: Pro plan payments for a real site', 'Chương 12 — Dự án cuối khoá: thanh toán gói Pro cho một website thật', 'Next.js + Express/Spring Boot + PostgreSQL + Redis + Docker + VPS + Cloudflare, sandbox VietQR/VNPay/MoMo/Stripe.', [
      ['thiet-ke', 'Design: plans, orders, ledger, entitlements', 'Thiết kế: gói, đơn, sổ cái, quyền lợi', 'Schema Prisma/JPA · Máy trạng thái · Cấp Pro khi và chỉ khi đã nhận tiền · Sơ đồ luồng'],
      ['tich-hop', 'Integrate two gateways behind one interface', 'Tích hợp hai cổng sau một giao diện chung', 'VietQR + VNPay hoặc MoMo, và Stripe · Webhook có chữ ký qua Cloudflare → nginx · Việc nền quét đơn treo'],
      ['doi-soat-hoan', 'Reconciliation, refunds and renewal reminders', 'Đối soát, hoàn tiền và nhắc gia hạn', 'Báo cáo lệch hằng ngày · Hoàn tiền thu hồi Pro · Nhắc hạn 7 ngày trước'],
      ['kiem-thu', 'Test the nasty cases and review security', 'Kiểm thử các ca khó và rà soát bảo mật', 'Webhook trùng/sai thứ tự/giả chữ ký · Bấm thanh toán hai lần · Timeout cổng · Checklist PCI SAQ A'],
      ['tong-ket', 'Review and interview story', 'Tổng kết và câu chuyện phỏng vấn', 'Checklist cả khoá · Kể dự án thanh toán trong phỏng vấn'],
    ]],
  ]),
};
