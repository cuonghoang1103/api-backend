/**
 * Exp Hub guide for INT604 — Helpdesk Ticketing API dev environment (Vietnamese).
 * Academy INT604 bài 0.4 links its "Cài đặt" card to /exp-hub/int604-cai-dat-moi-truong.
 * Stack: JDK 17 + IntelliJ IDEA + Docker Desktop + Postman (REST-only, no frontend).
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int604-cai-dat-moi-truong',
    title: 'INT604 — Cài môi trường Spring Boot + PostgreSQL (REST API)',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho REST API helpdesk: JDK 17, IntelliJ IDEA, Docker Desktop, Postman — kèm lệnh kiểm tra và cách chạy Postgres bằng Docker một lệnh. Đồ án REST thuần, không frontend.',
    referenceUrl: 'https://adoptium.net/',
    codeBlocks: [
      {
        name: 'Kiểm tra mọi công cụ đã cài đúng',
        language: 'bash',
        code: `# Java phai la 17.x (Spring Boot 3 yeu cau Java 17+)
java -version

# Docker da chay chua
docker --version
docker compose version

# Git
git --version`,
      },
      {
        name: 'Chạy PostgreSQL bằng Docker (không cần cài Postgres)',
        language: 'bash',
        code: `# Chay 1 container Postgres 16, database "helpdesk"
docker run --name helpdesk-db \\
  -e POSTGRES_PASSWORD=helpdesk \\
  -e POSTGRES_DB=helpdesk \\
  -p 5432:5432 -d postgres:16

# Kiem tra da chay
docker ps

# Ket noi thu bang psql trong container
docker exec -it helpdesk-db psql -U postgres -d helpdesk -c "\\l"

# Dung / xoa khi khong dung nua
docker stop helpdesk-db && docker rm helpdesk-db`,
      },
      {
        name: 'Tạo khung dự án Spring Boot',
        language: 'bash',
        code: `# Tao tu https://start.spring.io
#   Project: Maven | Language: Java | Spring Boot 3.x | Java 17
#   Dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver,
#                 Spring Security, Validation, Lombok
# -> Bam GENERATE -> giai nen -> mo bang IntelliJ IDEA

# Chay app (sau khi Postgres da len):
./mvnw spring-boot:run`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT604</span>
<h2>Cài môi trường cho REST API Helpdesk</h2>
<p class="lead">Đồ án này là <strong>REST API thuần</strong> (không frontend): Spring Boot 3 (Java) + PostgreSQL. Bạn thao tác và demo bằng Postman. Cài 4 công cụ dưới đây một lần, chạy Postgres bằng Docker, rồi bạn sẵn sàng code phần lõi "gán việc nguyên tử" (Mục 4).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JDK 17</div><div class="lz-d">chạy Spring Boot</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">IntelliJ IDEA</div><div class="lz-d">IDE backend</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Docker Desktop</div><div class="lz-d">Postgres + ship</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Postman</div><div class="lz-d">test API</div></div>
</div>

<h3>🅐 JDK 17 (Eclipse Temurin) — bắt buộc cho Spring Boot 3</h3>
<p>Spring Boot 3 <strong>chỉ chạy trên Java 17 trở lên</strong>. Tải bản Temurin 17 (LTS, miễn phí). Sau khi cài, chạy <code>java -version</code> phải ra <code>17.x</code>.</p>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/?version=17" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Eclipse Temurin JDK 17</span><span class="lc-sub">adoptium.net — chọn OS của bạn, bản 17 (LTS).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 IntelliJ IDEA Community — IDE cho backend</h3>
<p>Bản Community miễn phí là đủ. Nó hiểu Maven, Spring, Lombok và có debugger tốt — rất hữu ích khi bạn muốn đặt breakpoint và quan sát race condition ở Mục 4.</p>
<a class="link-card dl" href="https://www.jetbrains.com/idea/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải IntelliJ IDEA (Community)</span><span class="lc-sub">jetbrains.com — kéo xuống mục "Community Edition" (miễn phí).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Docker Desktop — Postgres tức thì &amp; ship một lệnh</h3>
<p>Thay vì cài PostgreSQL trực tiếp, chạy nó trong Docker (khối lệnh bên dưới) — một lệnh là có ngay CSDL. Cuối đồ án, Docker Compose khởi động cả api + db bằng một lệnh.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — cài xong nhớ mở app để Docker engine chạy nền.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 Postman — thử API không cần giao diện</h3>
<p>Vì đồ án không có frontend, Postman chính là cách bạn thao tác và trình diễn: đăng ký, đăng nhập, tạo ticket, và tự tay tạo tình huống 409 khi hai agent cùng "Nhận" một ticket.</p>
<a class="link-card dl" href="https://www.postman.com/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Tải Postman</span><span class="lc-sub">postman.com — hoặc dùng extension "REST Client" trong VS Code.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Mẹo demo race condition:</strong> trong Postman, tạo một Collection với request "Assign ticket" rồi dùng <b>Collection Runner</b> chạy nhiều lần song song (hoặc mở 2 tab gửi cùng lúc) để chứng minh chỉ một agent nhận được ticket — đúng như bài 4.1.</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy khối lệnh "Kiểm tra mọi công cụ", dựng Postgres bằng Docker, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
