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
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/api-design.png?v=4',
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
    ['Chapter 8 — Thinking in systems', 'Chương 8 — Tư duy hệ thống', 'Độ trễ, tải và tính sẵn sàng nhìn từ hợp đồng API. Hệ thống tổng thể ⇒ khoá System Design.', [
      ['so-lieu', 'Latency budgets for an API call (full estimation → System Design)', 'Ngân sách độ trễ cho một lời gọi API (ước lượng đầy đủ → khoá System Design)', 'Bảng độ trễ vừa đủ: RAM, đĩa, mạng, CSDL · Một request đi qua bao nhiêu chặng · Đặt p95/p99 cho từng endpoint · Ước lượng QPS và dung lượng → /courses/system-design Ch1'],
      ['mot-may', 'Measuring your API: load tests and the first bottleneck', 'Đo API của bạn: test tải và nút thắt đầu tiên', 'Đo thật một endpoint Express (autocannon/k6) · Endpoint chậm thường do thiết kế: N+1, payload quá lớn · Sửa bằng hợp đồng: phân trang, chọn trường, nén · Nút thắt hạ tầng → /courses/system-design Ch1–2'],
      ['mo-rong', 'Designing APIs that scale out: statelessness and safe retries', 'Thiết kế API để mở rộng ngang: không trạng thái và gửi lại an toàn', 'Không giữ phiên trong RAM tiến trình · Token thay sticky session · Mọi lệnh ghi an toàn khi gửi lại (idempotency) · Load balancer và các giai đoạn mở rộng → /courses/system-design Ch2'],
      ['kha-dung', 'API availability in the contract: SLOs, timeouts, 429/503 and degradation', 'Tính sẵn sàng trong hợp đồng API: SLO, timeout, 429/503 và suy giảm có kiểm soát', 'Công bố SLO và trang trạng thái · Retry-After, 429 và 503 đúng nghĩa · Trả dữ liệu cũ hay báo lỗi — ghi vào hợp đồng · Thiết kế cho hỏng hóc toàn hệ → /courses/system-design Ch1'],
    ]],
    ['Chapter 9 — Data at scale', 'Chương 9 — Dữ liệu khi lớn lên', 'Cache HTTP, đọc-sau-ghi, phân trang và định danh sống sót khi dữ liệu lớn lên.', [
      ['cache', 'HTTP caching for APIs: Cache-Control, ETag and conditional requests', 'Cache HTTP cho API: Cache-Control, ETag và request có điều kiện', 'Cache-Control public/private/no-store · ETag, If-None-Match và 304 · Vary và cache theo người dùng · Mẫu cache phía server, stampede → /courses/redis Ch6 và /courses/system-design Ch3'],
      ['db-doc', 'Read-after-write in the API contract: replicas and stale reads', 'Đọc-sau-ghi trong hợp đồng API: bản sao đọc và dữ liệu cũ', 'Người dùng vừa sửa mà không thấy — lỗi hợp đồng hay lỗi hạ tầng · Trả bản ghi mới ngay trong response của lệnh ghi · Phiên bản/ETag để client biết dữ liệu mới tới đâu · Replica và pool kết nối → /courses/distributed-systems Ch3, /courses/postgresql'],
      ['sharding', 'Pagination, IDs and filters that survive sharding', 'Phân trang, định danh và bộ lọc sống sót qua sharding', 'Cursor thay offset · ID không đoán được, không lộ số lượng · Tránh truy vấn chéo phân mảnh nhờ thiết kế endpoint · Sharding ở mức hạ tầng → /courses/system-design Ch2 và /courses/distributed-systems Ch4'],
      ['nosql', 'SQL vs NoSQL seen from the API: how the datastore shapes endpoints', 'SQL vs NoSQL nhìn từ API: kho dữ liệu định hình endpoint thế nào', 'Khi nào Postgres là đủ · Document store và payload lồng nhau · Truy vấn linh hoạt vs mẫu truy cập cố định · Tiêu chí chọn CSDL theo mẫu truy cập → /courses/system-design Ch3'],
    ]],
    ['Chapter 10 — Async and realtime', 'Chương 10 — Bất đồng bộ và thời gian thực', 'API bất đồng bộ (202), hợp đồng sự kiện, realtime và webhook.', [
      ['hang-doi', 'Asynchronous APIs: 202 Accepted, job resources and polling', 'API bất đồng bộ: 202 Accepted, tài nguyên công việc và hỏi lại', 'POST trả 202 + Location tới /jobs/{id} · Trạng thái, tiến độ, kết quả, huỷ · Thời hạn giữ kết quả · Hàng đợi và worker phía sau → /courses/background-jobs'],
      ['su-kien', 'Event contracts: payload design, versioning and idempotent consumers', 'Hợp đồng sự kiện: thiết kế payload, phiên bản và consumer idempotent', 'Sự kiện mỏng hay dày · Phiên bản và tương thích ngược · AsyncAPI để mô tả sự kiện · Outbox, saga, nhất quán giữa dịch vụ → /courses/software-architecture Ch9'],
      ['realtime', 'Realtime APIs: polling, SSE or WebSockets — choosing the contract', 'API thời gian thực: polling, SSE hay WebSocket — chọn hợp đồng', 'So sánh theo nhu cầu · Định dạng thông điệp và xác thực kết nối · Nối lại và lấy bù tin đã lỡ · Mở rộng WebSocket → /courses/socket-io'],
      ['webhook', 'Designing webhooks', 'Thiết kế webhook', 'Ký payload · Thử lại · Thứ tự và trùng lặp'],
    ]],
    ['Chapter 11 — The system design interview', 'Chương 11 — Vòng phỏng vấn system design', 'Phỏng vấn thiết kế API: khung trả lời và các đề kinh điển.', [
      ['khung', 'A framework for API design interview questions (full system design → System Design)', 'Khung trả lời câu hỏi phỏng vấn thiết kế API (system design trọn vẹn → khoá System Design)', 'Làm rõ người dùng và use case · Tài nguyên, endpoint, lỗi, phân trang · Xác thực, rate limit, phiên bản · Khung 45 phút system design → /courses/system-design'],
      ['rut-gon-link', 'Interview: design the API of a URL shortener', 'Phỏng vấn: thiết kế API cho dịch vụ rút gọn link', 'Endpoint tạo/đọc/xoá link · Mã tuỳ chọn, trùng mã, hết hạn · API thống kê click và rate limit · Lưu trữ và quy mô → /courses/system-design Ch4'],
      ['feed-chat', 'Interview: design the APIs of a news feed and a chat', 'Phỏng vấn: thiết kế API cho news feed và chat', 'Phân trang feed bằng cursor · Gửi tin: REST hay WebSocket, id phía client chống trùng · Đã đọc và đồng bộ nhiều thiết bị ở mức hợp đồng · Fan-out và lưu trữ → /courses/system-design Ch6–7'],
      ['dat-lich', 'Interview: design the API of a booking system', 'Phỏng vấn: thiết kế API cho hệ thống đặt lịch', 'Giữ chỗ tạm có hạn · Idempotency key khi đặt · 409 Conflict khi trùng · Khoá và chống đặt trùng ở quy mô lớn → /courses/system-design Ch9'],
    ]],
    ['Chapter 12 — Capstone: design and build a production API', 'Chương 12 — Dự án cuối khoá: thiết kế và dựng một API production', 'API "Đặt lịch phòng khám" từ OpenAPI tới triển khai.', [
      ['thiet-ke', 'Designing the API contract', 'Thiết kế hợp đồng API', 'Tài nguyên · Lỗi · Phân trang · OpenAPI'],
      ['xay-dung', 'Building it with Express and Postgres', 'Dựng bằng Express và Postgres', 'Validation · Idempotency · Rate limit'],
      ['mo-rong', 'Making it scale', 'Làm nó chịu tải', 'Cache · Hàng đợi thông báo · Đo tải'],
      ['tong-ket', 'Review, documentation and interview story', 'Rà soát, tài liệu và câu chuyện kể khi phỏng vấn', 'Checklist · Kể dự án theo STAR'],
    ]],
  ]),
};
