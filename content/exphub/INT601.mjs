/**
 * Exp Hub guide for INT601 — Clinic Appointment Booking dev environment (Vietnamese).
 * Academy INT601 bài 0.4 links its "Cài đặt" card to /exp-hub/int601-cai-dat-moi-truong.
 * Stack: JDK 17 + IntelliJ + Node.js + Docker Desktop + Postman.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int601-cai-dat-moi-truong',
    title: 'INT601 — Cài môi trường Spring Boot + React + PostgreSQL',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ môi trường cho đồ án đặt lịch khám: JDK 17, IntelliJ IDEA, Node.js LTS, Docker Desktop, Postman — kèm lệnh kiểm tra và cách chạy Postgres bằng Docker một lệnh.',
    referenceUrl: 'https://adoptium.net/',
    codeBlocks: [
      {
        name: 'Kiểm tra mọi công cụ đã cài đúng',
        language: 'bash',
        code: `# Java phai la 17.x (Spring Boot 3 yeu cau Java 17+)
java -version

# Node.js nen la 20.x tro len
node -v
npm -v

# Docker da chay chua
docker --version
docker compose version

# Git
git --version`,
      },
      {
        name: 'Chạy PostgreSQL bằng Docker (không cần cài Postgres)',
        language: 'bash',
        code: `# Chay 1 container Postgres 16, database ten "clinic", mat khau "clinic"
docker run --name clinic-db \\
  -e POSTGRES_PASSWORD=clinic \\
  -e POSTGRES_DB=clinic \\
  -p 5432:5432 -d postgres:16

# Kiem tra da chay
docker ps

# Ket noi thu bang psql trong container
docker exec -it clinic-db psql -U postgres -d clinic -c "\\l"

# Dung / xoa khi khong dung nua
docker stop clinic-db && docker rm clinic-db`,
      },
      {
        name: 'Tạo nhanh khung dự án (backend + frontend)',
        language: 'bash',
        code: `# Frontend React (Vite)
npm create vite@latest web -- --template react
cd web && npm install && npm install axios react-router-dom

# Backend: tao tu https://start.spring.io
#   Project: Maven | Language: Java | Spring Boot 3.x | Java 17
#   Dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver,
#                 Spring Security, Validation, Lombok
# -> Bam GENERATE -> giai nen -> mo bang IntelliJ IDEA`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT601</span>
<h2>Cài môi trường cho đồ án Đặt lịch khám</h2>
<p class="lead">Đồ án này là <strong>full-stack</strong>: backend Spring Boot (Java) + frontend React + CSDL PostgreSQL, đóng gói bằng Docker. Cài 5 công cụ dưới đây <strong>một lần</strong>, kiểm bằng terminal, rồi bạn sẵn sàng code cả đồ án mà không mất buổi nào vì thiếu công cụ.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">JDK 17</div><div class="lz-d">chạy Spring Boot</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">IntelliJ IDEA</div><div class="lz-d">IDE backend</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Node.js</div><div class="lz-d">chạy React</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Docker Desktop</div><div class="lz-d">Postgres + ship</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Postman</div><div class="lz-d">test API</div></div>
</div>

<h3>🅐 JDK 17 (Eclipse Temurin) — bắt buộc cho Spring Boot 3</h3>
<p>Spring Boot 3 <strong>chỉ chạy trên Java 17 trở lên</strong>. Tải bản Temurin 17 (LTS, miễn phí). Sau khi cài, chạy <code>java -version</code> phải ra <code>17.x</code>. Nếu ra 8 hoặc 11, đặt lại <code>JAVA_HOME</code> và Project SDK = 17 trong IntelliJ.</p>
<a class="link-card dl" href="https://adoptium.net/temurin/releases/?version=17" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Eclipse Temurin JDK 17</span><span class="lc-sub">adoptium.net — chọn OS của bạn, bản 17 (LTS).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 IntelliJ IDEA Community — IDE cho backend</h3>
<p>Bản Community miễn phí là đủ cho đồ án này. Nó hiểu Maven, Spring, Lombok và có debugger tốt. Mở thư mục dự án Spring Boot bạn tải từ start.spring.io.</p>
<a class="link-card dl" href="https://www.jetbrains.com/idea/download/" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải IntelliJ IDEA (Community)</span><span class="lc-sub">jetbrains.com — kéo xuống mục "Community Edition" (miễn phí).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Node.js LTS — build &amp; chạy React</h3>
<p>Cài bản LTS (20.x trở lên). Kèm sẵn <code>npm</code>. Dùng để tạo, cài thư viện và chạy app React (Vite).</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Node.js (LTS)</span><span class="lc-sub">nodejs.org — chọn bản LTS cho hệ điều hành của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 Docker Desktop — Postgres tức thì &amp; ship một lệnh</h3>
<p>Thay vì cài PostgreSQL trực tiếp, hãy chạy nó trong Docker (xem khối lệnh bên dưới) — một lệnh, dùng xong xoá, giống hệt lúc triển khai. Cuối đồ án, Docker Compose khởi động cả web + api + db bằng một lệnh.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — cài xong nhớ mở app để Docker engine chạy nền.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅔 Postman — thử API không cần giao diện</h3>
<p>Khi backend chạy mà frontend chưa xong, bạn vẫn test được mọi endpoint (đăng ký, đăng nhập, đặt lịch) bằng Postman — gửi request, xem status code + JSON trả về.</p>
<a class="link-card dl" href="https://www.postman.com/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Tải Postman</span><span class="lc-sub">postman.com — hoặc dùng extension "REST Client" trong VS Code.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Mẹo Postgres nhanh nhất:</strong> đừng cài Postgres vào máy — chạy nó bằng Docker (khối lệnh "Chạy PostgreSQL bằng Docker" bên dưới). Một lệnh là có ngay CSDL, xoá sạch khi xong, và giống hệt môi trường production.</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy khối lệnh "Kiểm tra mọi công cụ" để chắc chắn cả 5 công cụ đều đúng phiên bản, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
