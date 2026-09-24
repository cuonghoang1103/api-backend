/**
 * API & System Design — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 24/09/2026 (công khai từ 24/09 theo yêu cầu người dùng — bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau
 * theo quy trình khoá Docker (content/courses/docker/_HOP-DONG.md). Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'api-design',
    title: 'API & System Design',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/api-design.png?v=1',
    shortDescription: 'Design APIs other developers enjoy using, then scale them: REST done properly, errors, pagination, versioning, idempotency, caching, queues, and the system-design interview round explained from first principles.|||Thiết kế API mà người khác thích dùng, rồi mở rộng nó: REST làm cho đúng, lỗi, phân trang, versioning, idempotency, cache, hàng đợi, và vòng phỏng vấn system design giải thích từ gốc.',
    description: 'Khoá thiết kế API và system design cơ bản cho lập trình viên backend/fullstack. Nửa đầu: thiết kế REST API chuẩn chỉnh (tài nguyên, phương thức, status code, lỗi, phân trang, lọc, versioning, idempotency, OpenAPI, bảo mật API). Nửa sau: tư duy hệ thống (độ trễ và thông lượng, cache, cơ sở dữ liệu và mở rộng, hàng đợi, realtime, tính sẵn sàng) và cách đi qua một vòng phỏng vấn system design từng bước, với các đề kinh điển như rút gọn link, feed, chat, đặt lịch.',
    whatYouLearn: 'Thiết kế endpoint và mô hình tài nguyên rõ ràng; trả lỗi nhất quán; phân trang cursor đúng cách; version API mà không phá client; làm POST an toàn khi thử lại; viết tài liệu OpenAPI; ước lượng tải; chọn cache, index, replica, hàng đợi đúng lúc; và trình bày một bài system design trong 45 phút.',
    requirements: 'Đã viết được API bằng Node.js/Express; biết SQL cơ bản. Nên học trước khoá Node.js, PostgreSQL và Redis.',
    documentsNote: 'Tài liệu chính: RFC 9110 (HTTP semantics) • RFC 9457 (Problem Details) • spec.openapis.org • Google AIP (aip.dev) • Microsoft REST API Guidelines • System Design Primer (github.com/donnemartin/system-design-primer).',
  },
  sections: khung('api', [
    ['Section 0 — Why API design matters', 'Mục 0 — Vì sao thiết kế API quan trọng', 'API là hợp đồng; system design là vòng phỏng vấn hay gặp.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What API and system design are, and why interviews test them', 'Bắt đầu tại đây (1/2) — Thiết kế API và system design là gì, vì sao phỏng vấn hay hỏi', 'API là hợp đồng giữa các đội · Lịch sử: RPC, SOAP, REST của Roy Fielding 2000, GraphQL, gRPC · Vòng system design trong phỏng vấn · Khoá đưa bạn tới đâu'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — Bad APIs in the wild, and how to study this course', 'Bắt đầu tại đây (2/2) — API tệ ngoài đời thật, và cách học khoá này', 'Sự cố do API thiết kế kém (có nguồn) · Đổi API làm vỡ app di động · Lộ trình học'],
      ['http', 'HTTP you actually need', 'HTTP bạn thật sự cần', 'Request/response · Header quan trọng · curl và DevTools'],
      ['bo-cong-cu', 'Tools: curl, HTTPie, Postman, Bruno', 'Công cụ: curl, HTTPie, Postman, Bruno', 'Gọi và lưu request · Biến môi trường · Chia sẻ collection'],
    ]],
    ['Chapter 1 — Resources and methods', 'Chương 1 — Tài nguyên và phương thức', 'Đặt tên, cấu trúc URL và dùng đúng GET/POST/PUT/PATCH/DELETE.', [
      ['tai-nguyen', 'Modelling resources, not actions', 'Mô hình hoá tài nguyên, không phải hành động', 'Danh từ số nhiều · Quan hệ lồng nhau · Hành động đặc biệt'],
      ['phuong-thuc', 'Methods and their guarantees', 'Phương thức và cam kết của chúng', 'Safe · Idempotent · PUT vs PATCH · Bảng tra'],
      ['status', 'Status codes that mean something', 'Status code có ý nghĩa', '2xx/3xx/4xx/5xx · 400 vs 422 · 401 vs 403 · 404 vs 410'],
      ['dat-ten', 'Naming, casing and consistency', 'Đặt tên, kiểu chữ và nhất quán', 'camelCase vs snake_case · Ngày giờ ISO 8601 · Tiền tệ và số'],
    ]],
    ['Chapter 2 — Errors, validation and responses', 'Chương 2 — Lỗi, kiểm dữ liệu và phản hồi', 'Một định dạng lỗi cả hệ thống dùng chung.', [
      ['problem-details', 'Problem Details (RFC 9457)', 'Problem Details (RFC 9457)', 'Cấu trúc lỗi chuẩn · Mã lỗi máy đọc được · Thông điệp cho người'],
      ['validation', 'Validating input at the edge', 'Kiểm dữ liệu vào ngay cửa', 'Zod/Joi · Lỗi theo từng trường · Không tin client'],
      ['envelope', 'Response shapes and envelopes', 'Hình dạng phản hồi và envelope', 'Có nên bọc data · Trường null · Tránh lộ trường nội bộ'],
      ['i18n', 'Errors for bilingual apps', 'Lỗi cho ứng dụng song ngữ', 'Mã lỗi + dịch ở client · Accept-Language'],
    ]],
    ['Chapter 3 — Collections: pagination, filtering, sorting', 'Chương 3 — Danh sách: phân trang, lọc, sắp xếp', 'Trả danh sách lớn mà không chậm và không sai.', [
      ['offset', 'Offset pagination and its problems', 'Phân trang offset và vấn đề của nó', 'Chậm ở trang sâu · Trùng/bỏ sót khi dữ liệu đổi'],
      ['cursor', 'Cursor pagination done right', 'Phân trang cursor làm cho đúng', 'Cursor mã hoá · Sắp xếp ổn định bằng id · Index phù hợp'],
      ['loc', 'Filtering and search parameters', 'Tham số lọc và tìm kiếm', 'Cú pháp lọc · Tìm kiếm toàn văn · Chống truy vấn nặng'],
      ['sap-xep', 'Sorting, sparse fields and includes', 'Sắp xếp, chọn trường và nhúng quan hệ', 'sort=-createdAt · fields= · include= và N+1'],
    ]],
    ['Chapter 4 — Versioning and evolution', 'Chương 4 — Versioning và tiến hoá API', 'Đổi API mà không phá client đang chạy.', [
      ['thay-doi', 'Breaking vs non-breaking changes', 'Thay đổi phá vỡ và không phá vỡ', 'Bảng phân loại · Thêm trường an toàn · Đổi kiểu thì vỡ'],
      ['chien-luoc', 'Versioning strategies', 'Chiến lược version', 'URL /v1 · Header · Ngày (Stripe) · Ưu nhược'],
      ['deprecation', 'Deprecation and sunset', 'Ngừng hỗ trợ có báo trước', 'Header Deprecation/Sunset · Đo ai còn dùng · Lịch gỡ'],
      ['app-di-dong', 'Mobile and desktop clients that never update', 'Client di động và desktop không chịu cập nhật', 'Hỗ trợ nhiều bản song song · Ép cập nhật tối thiểu'],
    ]],
    ['Chapter 5 — Reliability: idempotency, retries, rate limits', 'Chương 5 — Tin cậy: idempotency, thử lại, giới hạn tần suất', 'Khi mạng chập chờn và client bấm hai lần.', [
      ['idempotency', 'Idempotency keys for POST', 'Idempotency key cho POST', 'Trừ tiền hai lần · Lưu kết quả theo khoá · Hết hạn'],
      ['retry', 'Retries, backoff and timeouts', 'Thử lại, lùi dần và timeout', 'Exponential backoff + jitter · Retry-After · Timeout mọi lời gọi'],
      ['rate-limit', 'Rate limiting and quotas', 'Giới hạn tần suất và hạn mức', 'Token bucket · Header RateLimit · Theo người dùng/IP · Sau proxy (X-Forwarded-For)'],
      ['dong-thoi', 'Concurrency: optimistic locking and ETags', 'Đồng thời: khoá lạc quan và ETag', 'Hai người sửa cùng lúc · If-Match · 412'],
    ]],
    ['Chapter 6 — Security for APIs', 'Chương 6 — Bảo mật cho API', 'Xác thực, phân quyền và những lỗ phổ biến của API.', [
      ['xac-thuc', 'Authentication options: sessions, JWT, API keys, OAuth', 'Các cách xác thực: session, JWT, API key, OAuth', 'Bảng so sánh · Khi nào dùng gì · Trỏ khoá Authentication'],
      ['phan-quyen', 'Authorisation and object-level access (BOLA)', 'Phân quyền và truy cập theo đối tượng (BOLA)', 'Lỗi số 1 của OWASP API · Kiểm quyền từng bản ghi'],
      ['owasp-api', 'OWASP API Security Top 10', 'OWASP API Security Top 10', 'Mười lỗ phổ biến · Ví dụ trên API Express · Cách chặn'],
      ['cors', 'CORS, CSRF and browsers', 'CORS, CSRF và trình duyệt', 'CORS không phải bảo mật server · Cookie SameSite · Preflight'],
    ]],
    ['Chapter 7 — Documentation and contracts', 'Chương 7 — Tài liệu và hợp đồng', 'OpenAPI, sinh client và giữ tài liệu luôn đúng.', [
      ['openapi', 'Writing OpenAPI 3.1', 'Viết OpenAPI 3.1', 'Path, schema, component · Ví dụ · Lỗi'],
      ['sinh-code', 'Generating docs, clients and validators', 'Sinh tài liệu, client và validator', 'Swagger UI/Redoc · Client TypeScript · Kiểm theo schema'],
      ['design-first', 'Design-first vs code-first', 'Thiết kế trước hay code trước', 'Quy trình đội · Review API như review code'],
      ['khac', 'GraphQL and gRPC: when REST is not the answer', 'GraphQL và gRPC: khi REST không phải câu trả lời', 'So sánh thẳng · Chi phí vận hành · Chọn cho đồ án'],
    ]],
    ['Chapter 8 — Thinking in systems', 'Chương 8 — Tư duy hệ thống', 'Độ trễ, thông lượng, và ước lượng nhanh.', [
      ['so-lieu', 'Latency numbers and back-of-the-envelope estimates', 'Con số độ trễ và ước lượng nhanh', 'RAM vs đĩa vs mạng · QPS · Dung lượng lưu trữ'],
      ['mot-may', 'How far one server goes', 'Một máy chủ đi được bao xa', 'Đo thật một API Express · Nút thắt ở đâu'],
      ['mo-rong', 'Scaling up vs scaling out', 'Mở rộng dọc và mở rộng ngang', 'Stateless · Load balancer · Sticky session'],
      ['kha-dung', 'Availability, SLOs and failure', 'Tính sẵn sàng, SLO và hỏng hóc', 'Số 9 · Điểm hỏng đơn · Degrade có kiểm soát'],
    ]],
    ['Chapter 9 — Data at scale', 'Chương 9 — Dữ liệu khi lớn lên', 'Cache, index, replica, phân mảnh.', [
      ['cache', 'Caching layers and invalidation', 'Các tầng cache và vô hiệu hoá', 'CDN · Redis · Cache-aside · TTL · Stampede'],
      ['db-doc', 'Read replicas and connection pooling', 'Bản sao đọc và pool kết nối', 'Độ trễ sao chép · PgBouncer · Đọc sau khi ghi'],
      ['sharding', 'Partitioning and sharding', 'Phân vùng và sharding', 'Khi nào cần · Khoá phân mảnh · Cái giá'],
      ['nosql', 'SQL vs NoSQL, honestly', 'SQL vs NoSQL, nói thẳng', 'Khi nào Postgres là đủ · Document/key-value/wide-column'],
    ]],
    ['Chapter 10 — Async and realtime', 'Chương 10 — Bất đồng bộ và thời gian thực', 'Hàng đợi, sự kiện, WebSocket.', [
      ['hang-doi', 'Queues and background work', 'Hàng đợi và việc chạy nền', 'Khi nào đẩy vào hàng đợi · At-least-once · Trỏ khoá Hàng đợi'],
      ['su-kien', 'Events, outbox and eventual consistency', 'Sự kiện, outbox và nhất quán cuối cùng', 'Transactional outbox · Idempotent consumer'],
      ['realtime', 'Realtime: polling, SSE, WebSockets', 'Thời gian thực: polling, SSE, WebSocket', 'So sánh · Mở rộng WebSocket · Trỏ khoá Socket.IO'],
      ['webhook', 'Designing webhooks', 'Thiết kế webhook', 'Ký payload · Thử lại · Thứ tự và trùng lặp'],
    ]],
    ['Chapter 11 — The system design interview', 'Chương 11 — Vòng phỏng vấn system design', 'Khung trả lời và các đề kinh điển.', [
      ['khung', 'A framework for the 45-minute interview', 'Khung trả lời 45 phút', 'Làm rõ yêu cầu · Ước lượng · Thiết kế tổng · Đào sâu · Đánh đổi'],
      ['rut-gon-link', 'Design a URL shortener', 'Thiết kế dịch vụ rút gọn link', 'Sinh mã · Lưu trữ · Cache · Thống kê'],
      ['feed-chat', 'Design a news feed and a chat', 'Thiết kế news feed và chat', 'Fan-out · Realtime · Lưu tin nhắn'],
      ['dat-lich', 'Design a booking system', 'Thiết kế hệ thống đặt lịch', 'Chống đặt trùng · Khoá · Thông báo'],
    ]],
    ['Chapter 12 — Capstone: design and build a production API', 'Chương 12 — Dự án cuối khoá: thiết kế và dựng một API production', 'API "Đặt lịch phòng khám" từ OpenAPI tới triển khai.', [
      ['thiet-ke', 'Designing the API contract', 'Thiết kế hợp đồng API', 'Tài nguyên · Lỗi · Phân trang · OpenAPI'],
      ['xay-dung', 'Building it with Express and Postgres', 'Dựng bằng Express và Postgres', 'Validation · Idempotency · Rate limit'],
      ['mo-rong', 'Making it scale', 'Làm nó chịu tải', 'Cache · Hàng đợi thông báo · Đo tải'],
      ['tong-ket', 'Review, documentation and interview story', 'Rà soát, tài liệu và câu chuyện kể khi phỏng vấn', 'Checklist · Kể dự án theo STAR'],
    ]],
  ]),
};
