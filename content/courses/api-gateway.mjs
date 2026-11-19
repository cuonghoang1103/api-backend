/**
 * API Gateway (Kong) — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 19/11/2026 theo yêu cầu người dùng
 * (đối chiếu "22 kỹ năng System Design" — Code4Life: mục API Gateway là kỹ năng DUY NHẤT chưa có khoá/chương riêng;
 * Kubernetes, Argo CD, Docker, Nginx, Prometheus/Grafana/ELK, Redis, Kafka/RabbitMQ, AWS, PostgreSQL, Spring Boot,
 * Node.js đều đã có khoá). Bài chưa soạn hiện "Đang soạn". Soạn chi tiết theo quy trình khoá Docker
 * (content/courses/docker/_HOP-DONG.md) khi tới lượt trong lộ trình (ga 8, sau System Design). Xem _chung/khung.mjs.
 * Không trùng: API Design (thiết kế REST), Nginx (reverse proxy/LB), Authentication (JWT/OAuth2), Kubernetes (Ingress),
 * Software Architecture (kiểu kiến trúc) — khoá này chỉ dạy TẦNG GATEWAY và dẫn link sang các khoá đó.
 * Ảnh bìa: scripts/covers/api-gateway.png (course-cover-offline.mjs, logo simple-icons kong).
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'backend', name: 'Backend', icon: 'Server', sortOrder: 1 },
  course: {
    slug: 'api-gateway',
    title: 'API Gateway with Kong',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/api-gateway.png?v=1',
    shortDescription: 'The single front door of a system: routing to services, authentication, rate limiting, caching, logging and versioning at the gateway layer — with Kong in Docker, compared with Nginx, AWS API Gateway and Apigee, in front of Spring Boot and Node.js services.',
    description: 'Khoá API Gateway cho lập trình viên backend đã biết làm REST API (Node.js hoặc Spring Boot), Docker và Nginx cơ bản. Khi hệ thống tách thành nhiều service, ai đứng ở cửa để chia đường, kiểm tra vé, giới hạn lượt gọi và ghi sổ? Khoá đi từ "cổng vào toà nhà" bằng lời đời thường tới chạy Kong thật bằng Docker: route và service, plugin xác thực (key-auth, JWT, OAuth2), rate limiting, cache, CORS, ghi log và đo đạc bằng Prometheus/Grafana, versioning, canary, BFF; so với Nginx, AWS API Gateway, Apigee; các sự cố thật khi gateway sập hoặc cấu hình sai; và câu hỏi phỏng vấn System Design về gateway.',
    whatYouLearn: 'Giải thích API Gateway bằng ngôn ngữ đời thường và biết khi nào KHÔNG cần nó; chạy Kong bằng Docker Compose và khai báo service/route; bật xác thực, rate limiting, cache, CORS ở tầng gateway; ghi log và dựng dashboard; versioning và triển khai canary; chọn giữa Kong, Nginx, AWS API Gateway, Apigee; trả lời câu hỏi phỏng vấn về gateway.',
    requirements: 'REST API với Node.js hoặc Spring Boot, Docker cơ bản, HTTP và JWT. Nên học trước khoá API Design, Nginx, Authentication và Docker.',
    documentsNote: 'Tài liệu chính: docs.konghq.com (Kong Gateway OSS) • docs.aws.amazon.com/apigateway • cloud.google.com/apigee/docs • microservices.io (API Gateway / BFF pattern) • "Building Microservices" (Sam Newman, 2nd ed.) • "System Design Interview" (Alex Xu) — chương rate limiter.',
  },
  sections: khung('api-gateway', [
    ['Section 0 — Why a gateway exists', 'Mục 0 — Vì sao cần API Gateway', 'Cổng vào duy nhất của hệ thống: nó giải bài toán gì và khi nào là thừa.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What an API gateway is, in everyday words', 'Bắt đầu tại đây (1/2) — API Gateway là gì bằng lời đời thường', 'Lễ tân toà nhà · Một cửa thay vì mười cửa · Gateway trong cuongthai.com (nginx đang đóng vai gì)'],
      ['bat-dau-khi-nao-can', 'Start here (2/2) — When you need a gateway and when you do not', 'Bắt đầu tại đây (2/2) — Khi nào cần gateway và khi nào không', 'Monolith một service · Nhiều service · Nhiều loại client (web, mobile, đối tác)'],
      ['so-sanh', 'Gateway vs reverse proxy vs load balancer vs service mesh', 'Gateway khác reverse proxy, load balancer, service mesh thế nào', 'Nginx làm được tới đâu · Ingress của Kubernetes · Istio/Linkerd ở tầng trong'],
      ['cai-dat', 'Running Kong locally with Docker Compose', 'Chạy Kong trên máy bằng Docker Compose', 'DB-less vs Postgres · Admin API · Kong Manager · decK'],
    ]],
    ['Chapter 1 — Routing requests to services', 'Chương 1 — Chia đường request tới service', 'Service, route, upstream — nền của mọi gateway.', [
      ['service-route', 'Services and routes', 'Service và route', 'Khớp theo path, host, method, header · strip_path · Thứ tự ưu tiên'],
      ['upstream-lb', 'Upstreams, load balancing and health checks', 'Upstream, cân bằng tải và kiểm tra sức khoẻ', 'Round-robin, least-connections, hash · Active/passive health check'],
      ['khai-bao', 'Declarative config and GitOps for the gateway', 'Cấu hình khai báo và GitOps cho gateway', 'decK · Cấu hình trong Git · Review như code'],
      ['lab-1', 'Lab 1 — One gateway in front of a Node.js and a Spring Boot service', 'Lab 1 — Một gateway đứng trước service Node.js và Spring Boot', 'Hai service, một cửa · Kiểm bằng curl · Đạt khi'],
    ]],
    ['Chapter 2 — Authentication and authorization at the gateway', 'Chương 2 — Xác thực và phân quyền ở tầng gateway', 'Kiểm vé một lần ở cửa, service phía sau tin gateway.', [
      ['key-auth', 'API keys and consumers', 'API key và consumer', 'Ai đang gọi · Cấp/thu hồi khoá · Khoá lộ thì sao'],
      ['jwt', 'Validating JWTs at the gateway', 'Kiểm JWT ở gateway', 'Chữ ký, hạn, claim · Chuyển thông tin người dùng xuống service'],
      ['oauth2-oidc', 'OAuth2 and OpenID Connect', 'OAuth2 và OpenID Connect', 'Introspection · Gateway làm client OIDC · Không tự chế'],
      ['acl-mtls', 'ACLs, IP restriction and mTLS to upstreams', 'ACL, giới hạn IP và mTLS xuống service', 'Nhóm consumer · Zero trust bên trong · Service không mở ra ngoài'],
    ]],
    ['Chapter 3 — Protecting the system: rate limiting and quotas', 'Chương 3 — Bảo vệ hệ thống: giới hạn lượt gọi', 'Chặn lạm dụng và giữ hệ thống sống khi đông.', [
      ['thuat-toan', 'Rate limiting algorithms', 'Thuật toán giới hạn lượt gọi', 'Fixed window · Sliding window · Token bucket · Leaky bucket'],
      ['redis-cum', 'Rate limiting across many gateway nodes with Redis', 'Giới hạn lượt gọi trên nhiều node gateway bằng Redis', 'Đếm tập trung · Độ chính xác vs độ trễ · Redis sập thì sao'],
      ['quota-goi', 'Quotas and plans for API customers', 'Hạn mức theo gói cho khách dùng API', 'Free/Pro · Header X-RateLimit · 429 và Retry-After'],
      ['kich-thuoc-bot', 'Request size limits, bot protection and abuse', 'Giới hạn kích thước request, chặn bot và lạm dụng', 'Body quá lớn · Credential stuffing · Gateway không thay được WAF'],
    ]],
    ['Chapter 4 — Transforming and caching', 'Chương 4 — Biến đổi và cache ở tầng gateway', 'Sửa request/response và trả lời nhanh mà không chạm service.', [
      ['bien-doi', 'Request and response transformation', 'Biến đổi request và response', 'Thêm/bỏ header · Đổi tên trường · Khi nào KHÔNG nên làm ở gateway'],
      ['cache', 'Response caching at the gateway', 'Cache response ở gateway', 'proxy-cache · Khoá cache · Vary · Xoá cache khi dữ liệu đổi'],
      ['cors-nen', 'CORS, compression and timeouts', 'CORS, nén và timeout', 'CORS một chỗ · gzip/brotli · Timeout, retry và bão retry'],
      ['bff-gop', 'Aggregation and the Backend-for-Frontend pattern', 'Gộp request và mẫu Backend-for-Frontend (BFF)', 'Một màn hình gọi 5 service · BFF cho web vs mobile · GraphQL gateway'],
    ]],
    ['Chapter 5 — Observability at the front door', 'Chương 5 — Quan sát hệ thống từ cổng vào', 'Gateway thấy MỌI request — tận dụng chỗ đứng đó.', [
      ['log', 'Access logs and centralized logging', 'Log truy cập và log tập trung', 'http-log/file-log · Đẩy sang ELK/Loki · Không ghi token vào log'],
      ['metrics', 'Metrics with Prometheus and Grafana', 'Đo đạc bằng Prometheus và Grafana', 'Latency p50/p95/p99 theo route · Tỉ lệ lỗi · Dashboard'],
      ['tracing', 'Distributed tracing from the gateway', 'Lần vết request phân tán từ gateway', 'Correlation ID · OpenTelemetry · Gateway mở đầu trace'],
      ['canh-bao', 'Alerting and debugging production traffic', 'Cảnh báo và gỡ lỗi lưu lượng thật', '5xx tăng · Upstream timeout · Đọc log để khoanh vùng'],
    ]],
    ['Chapter 6 — Versioning and safe releases', 'Chương 6 — Versioning và phát hành an toàn', 'Đổi API mà không làm vỡ client.', [
      ['versioning', 'API versioning at the gateway', 'Versioning API ở gateway', '/v1 vs header vs host · Ngừng hỗ trợ có lịch'],
      ['canary', 'Canary and blue-green releases', 'Phát hành canary và blue-green', 'Chia 5% lưu lượng · Theo header/người dùng · Quay lui'],
      ['circuit-breaker', 'Retries, circuit breakers and graceful degradation', 'Retry, circuit breaker và xuống cấp nhẹ nhàng', 'Service chậm kéo sập cả hệ · Fallback · Liên kết khoá Distributed Systems'],
    ]],
    ['Chapter 7 — Choosing a gateway', 'Chương 7 — Chọn gateway nào', 'Kong, Nginx, AWS API Gateway, Apigee, Spring Cloud Gateway — so trên cùng tiêu chí.', [
      ['kong-vs-nginx', 'Kong vs plain Nginx', 'Kong so với Nginx thuần', 'Kong chạy trên OpenResty/Nginx · Plugin vs tự viết config'],
      ['cloud', 'Managed gateways: AWS API Gateway and Google Apigee', 'Gateway có sẵn trên cloud: AWS API Gateway và Apigee', 'REST vs HTTP API · Lambda phía sau · Chi phí theo request'],
      ['spring-node', 'Gateways in your own stack: Spring Cloud Gateway and Node.js', 'Gateway trong chính stack của bạn: Spring Cloud Gateway và Node.js', 'Khi đội chỉ có Java · express-gateway đã ngừng · Tự viết thì tới đâu'],
      ['bang-chon', 'A decision table you can defend in an interview', 'Bảng chọn bảo vệ được khi phỏng vấn', 'Quy mô · Đội · Chi phí · Khoá chặt nhà cung cấp'],
    ]],
    ['Chapter 8 — Real incidents and security', 'Chương 8 — Sự cố thật và bảo mật', 'Gateway là điểm chết duy nhất và là mục tiêu số một.', [
      ['diem-chet', 'The gateway as a single point of failure', 'Gateway là điểm chết duy nhất', 'Chạy nhiều node · Cấu hình sai đẩy lên toàn hệ · Sự cố thật'],
      ['tan-cong', 'Attacks on and through the gateway', 'Tấn công vào và xuyên qua gateway', 'Bỏ qua gateway gọi thẳng service · Admin API lộ ra Internet · SSRF qua route'],
      ['bao-mat-admin', 'Hardening Kong in production', 'Gia cố Kong trên production', 'Khoá Admin API · RBAC · Bí mật trong vault · Cập nhật bản vá'],
    ]],
    ['Chapter 9 — Interviews and capstone', 'Chương 9 — Phỏng vấn và dự án cuối', 'Trả lời câu hỏi gateway trong System Design và dựng một cổng hoàn chỉnh.', [
      ['phong-van', 'API gateway questions in system design interviews', 'Câu hỏi về API Gateway trong phỏng vấn System Design', 'Thiết kế rate limiter · Gateway vs service mesh · Vẽ sơ đồ trong 5 phút'],
      ['capstone', 'Capstone — A production-grade gateway for the booking app', 'Dự án cuối — Gateway chuẩn production cho ứng dụng đặt lịch', 'Kong + JWT + rate limit Redis + cache + dashboard + canary · Đạt khi'],
      ['quiz', 'Final quiz', 'Bài kiểm tra cuối khoá', '15 câu tổng hợp'],
    ]],
  ]),
};
