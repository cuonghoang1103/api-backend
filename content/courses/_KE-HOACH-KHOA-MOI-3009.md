# Kế hoạch khoá MỚI (30/09/2026) — dựng KHUNG trước, soạn chi tiết sau

User dặn: *"bổ sung full hết vào courses… những gì đã liệt kê + nghiên cứu sâu + những thứ chưa nói… tạo khoá học, ảnh bìa và
khung đầy đủ, phân loại đúng danh mục… đừng trùng khoá cũ; nếu trùng chỉ trùng một phần rồi dẫn đến khoá chuyên sâu từ con số 0
(lịch sử, tấn công, tại sao cần, học xong làm được gì…) đến chuyên gia… đầy đủ mọi ngóc ngách."* Người học: SV SE FPTU, tự host
web cuongthai.com (Cloudflare + nginx + VPS Ubuntu + Docker + PostgreSQL + R2; máy nhà Linux build), đồ án LabFlow AI
(Spring Boot + React + PostgreSQL + AIoT). Mục tiêu: toàn diện, tự dựng & tự bảo vệ hệ thống.

## Cách dựng một khoá khung (theo đúng khoá Kafka `content/courses/kafka.mjs`)
- Đọc `content/courses/kafka.mjs` + `content/courses/_chung/khung.mjs` (đầu file giải thích) + `content/courses/docker/_HOP-DONG.md`.
- File `content/courses/<slug>.mjs`: `category`, `course` (slug, title, level, language 'Vietnamese', status 'PUBLISHED',
  isFeatured false, syncOrder true, thumbnailUrl `https://media.cuongthai.com/images/course-covers/<slug>.png?v=1`,
  shortDescription EN|||VI, description, whatYouLearn, requirements, documentsNote — nguồn CHÍNH THỨC, không bịa link),
  `sections: khung('<prefix>', [...])`.
- **Mục 0 bắt buộc 2 bài "Bắt đầu tại đây"** (1/2: là gì bằng lời đời thường, **lịch sử có mốc năm**, **sự cố/tấn công thật có tên**,
  vì sao cần; 2/2: **học xong làm được gì** (nghề, vị trí, lương/việc theo mức nếu có nguồn — không thì bỏ), lộ trình, khoá nền nên
  học trước) + bài cài môi trường/lab.
- Từ **con số 0 → chuyên gia**: 8–14 chương, mỗi chương 3–6 bài, ý trong mỗi bài cụ thể (không chung chung); chương cuối là **dự án
  cuối khoá / lab thực chiến** trên hạ tầng giống của user. Có chương "Phỏng vấn & chứng chỉ" nếu hợp (nêu chứng chỉ có thật:
  Security+, CEH, OSCP, CKS, AWS Security Specialty, Terraform Associate…).
- **KHÔNG trùng khoá cũ.** Khoá cũ liên quan (đọc tiêu đề chương trước khi viết): web-security (Injection, XSS, phân quyền hỏng, xác
  thực/phiên, CSRF/CORS, SSRF/upload, bí mật, supply chain, log/sự cố, rà soát, dự án phá-rồi-vá), authentication (rất sâu),
  api-design (idempotency, rate limit, system design phỏng vấn), observability-monitoring (log/metric/trace/cảnh báo), self-hosting
  (home lab, mạng, truy cập từ xa, bảo mật dài hạn), deploy-vps, nginx, docker, kubernetes, cloud-aws (IAM, VPC, IaC 1 chương),
  linux-bash, testing, background-jobs, redis, postgresql, kafka, interview-prep. Chỗ chạm nhau: một bài ngắn "Nếu đã học <khoá>"
  nhắc lại cốt lõi + link `/courses/<slug>` rồi ĐI SÂU hơn.
- **An toàn & pháp lý (bảo mật tấn công):** mọi lab tấn công chỉ trên hệ thống của chính mình trong lab tách biệt hoặc nền tảng cho
  phép (TryHackMe, HackTheBox, PortSwigger Academy, OWASP Juice Shop/DVWA/WebGoat); có bài pháp lý (Luật An ninh mạng 2018, BLHS
  điều 285–289 về tội phạm công nghệ cao — ghi trung tính, người soạn chi tiết sẽ kiểm văn bản); không hướng dẫn tấn công mục tiêu thật.
- Tiêu đề bài ≤ 255 ký tự; ý bài tách bằng " · ".

## Danh mục (dùng đúng object này)
- Bảo mật (MỚI): `{ slug: 'security', name: 'Bảo mật', icon: 'Shield', sortOrder: 8 }`
- Nền tảng CS (MỚI): `{ slug: 'cs-fundamentals', name: 'Nền tảng khoa học máy tính', icon: 'Cpu', sortOrder: 9 }`
- Có sẵn: `backend` (Backend, Server, 1) · `frontend` (Frontend, Layout, 2) · `databases` (Cơ sở dữ liệu, Database, 3) ·
  `devops` (DevOps & Vận hành, Server, 4) · `career` (Nghề nghiệp, Briefcase, 7)

## Kết quả (30/09 tối)
- ĐÃ DỰNG 23 khoá (1.331 bài), ảnh bìa đã lên R2. `operating-systems` → **`operating-systems-for-developers`** (slug cũ là khoá Academy).
- **Không dựng `ethical-hacking` và `red-blue-capstone`** (soạn bị bộ lọc an toàn dừng nhiều lần). Luyện kiểm thử hợp pháp: PortSwigger Web Security Academy, TryHackMe, HackTheBox, OWASP Juice Shop.

## Danh sách khoá (slug · tiêu đề · danh mục · level · logo simple-icons đề xuất)
### Nhóm A — Bảo mật 1
1. `ddos-protection` · DDoS & bảo vệ lưu lượng (Cloudflare, WAF, rate limit) · security · INTERMEDIATE · cloudflare
2. `incident-response` · Ứng phó sự cố & SRE on-call · security · INTERMEDIATE · pagerduty
3. `ethical-hacking` · Ethical Hacking & Pentest web từ số 0 · security · INTERMEDIATE · kalilinux
4. `threat-modeling` · Threat Modeling & thiết kế an toàn · security · INTERMEDIATE · owasp
5. `applied-cryptography` · Mật mã học ứng dụng cho lập trình viên · security · ADVANCED · letsencrypt
6. `network-security` · Bảo mật mạng & Zero Trust · security · INTERMEDIATE · wireguard
7. `red-blue-capstone` · Đồ án Red Team vs Blue Team (tấn công & phòng thủ LabFlow) · security · ADVANCED · hackthebox
### Nhóm B — Bảo mật 2 + Vận hành
8. `cloud-container-security` · Bảo mật Cloud, Container & Kubernetes · security · ADVANCED · kubernetes
9. `blue-team-siem` · Blue Team: phát hiện xâm nhập, SIEM & điều tra số · security · ADVANCED · elastic
10. `devsecops` · DevSecOps: bảo mật trong CI/CD · security · INTERMEDIATE · githubactions
11. `reverse-engineering` · Reverse Engineering & phân tích mã độc nhập môn · security · ADVANCED · ghidra
12. `privacy-data-law` · Quyền riêng tư & pháp lý dữ liệu (GDPR, Nghị định 13/2023) · security · BEGINNER · gdpr (không có thì dùng 'letsencrypt' khác màu)
13. `infrastructure-as-code` · Infrastructure as Code: Terraform & Ansible · devops · INTERMEDIATE · terraform
14. `email-infrastructure` · Hạ tầng email: SMTP, SPF/DKIM/DMARC & gửi thư không vào spam · devops · INTERMEDIATE · maildotru? → dùng 'gmail'
15. `performance-load-testing` · Hiệu năng & load testing (k6, profiling, capacity) · devops · INTERMEDIATE · k6
### Nhóm C — Nền tảng, dữ liệu, sản phẩm
16. `networking-for-developers` · Mạng máy tính cho lập trình viên (DNS, TCP, TLS, HTTP/2–3, CDN) · cs-fundamentals · BEGINNER · cloudflare→ dùng 'wireshark'
17. `operating-systems` · Hệ điều hành cho lập trình viên (process, memory, concurrency, I/O) · cs-fundamentals · INTERMEDIATE · linux
18. `distributed-systems` · Hệ thống phân tán (CAP, consensus, replication, exactly-once) · cs-fundamentals · ADVANCED · apachezookeeper
19. `system-design` · System Design thực chiến (từ 1 server tới hàng triệu người dùng) · cs-fundamentals · ADVANCED · cloudflare→'amazonaws'
20. `search-elasticsearch` · Tìm kiếm: Elasticsearch/OpenSearch & PostgreSQL full-text · databases · INTERMEDIATE · elasticsearch
21. `data-engineering` · Data Engineering: ETL, kho dữ liệu, ClickHouse & dbt · databases · ADVANCED · clickhouse
22. `online-payments` · Thanh toán online: VNPay, MoMo, Stripe & webhook an toàn · backend · INTERMEDIATE · stripe
23. `ux-ui-for-developers` · UX/UI cho lập trình viên (Figma, design system, accessibility) · frontend · BEGINNER · figma
24. `seo-analytics` · SEO & Analytics cho web (Next.js, Search Console, GA4, Core Web Vitals) · frontend · BEGINNER · googlesearchconsole
25. `solo-product` · Làm sản phẩm một mình: ý tưởng → ra mắt → doanh thu (pháp lý, thuế, định giá) · career · BEGINNER · producthunt

Logo: người điều phối tự kiểm tên có trong gói simple-icons và dựng ảnh bìa; agent chỉ ghi `thumbnailUrl` đúng mẫu.
