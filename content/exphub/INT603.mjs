/**
 * Exp Hub guide for INT603 — Homestay Booking API dev environment (Vietnamese).
 * Academy INT603 bài 0.4 links its "Cài đặt" card to /exp-hub/int603-cai-dat-moi-truong.
 * Stack: Node.js LTS + VS Code + Docker Desktop + Postman + Prisma CLI.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int603-cai-dat-moi-truong',
    title: 'INT603 — Cài môi trường Node.js + Express + Prisma + PostgreSQL',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ môi trường cho REST API đặt homestay: Node.js LTS, VS Code, Docker Desktop, Postman, Prisma CLI — kèm cách chạy Postgres (có btree_gist) bằng Docker một lệnh.',
    referenceUrl: 'https://nodejs.org/en/download',
    codeBlocks: [
      {
        name: 'Kiểm tra mọi công cụ đã cài đúng',
        language: 'bash',
        code: `# Node.js nen la 20.x tro len (kem npm)
node -v
npm -v

# Docker da chay chua
docker --version
docker compose version

# Git
git --version`,
      },
      {
        name: 'Chạy PostgreSQL (có btree_gist) bằng Docker',
        language: 'bash',
        code: `# Chay 1 container Postgres 16, database "homestay"
docker run --name homestay-db \\
  -e POSTGRES_PASSWORD=homestay \\
  -e POSTGRES_DB=homestay \\
  -p 5432:5432 -d postgres:16

# Bat extension btree_gist (can cho rang buoc EXCLUDE chong chong ngay)
docker exec -it homestay-db psql -U postgres -d homestay \\
  -c "CREATE EXTENSION IF NOT EXISTS btree_gist;"

# Kiem tra
docker ps
docker exec -it homestay-db psql -U postgres -d homestay -c "\\dx"

# Dung / xoa khi khong dung nua
docker stop homestay-db && docker rm homestay-db`,
      },
      {
        name: 'Khởi tạo dự án API + Prisma',
        language: 'bash',
        code: `mkdir homestay-api && cd homestay-api
npm init -y
npm install express zod jsonwebtoken bcrypt
npm install -D prisma nodemon supertest vitest
npx prisma init --datasource-provider postgresql

# Sua .env: DATABASE_URL="postgresql://postgres:homestay@localhost:5432/homestay"
# Viet schema.prisma (Room, Booking, User) roi:
npx prisma migrate dev --name init
# Sau do them file migration.sql cho rang buoc EXCLUDE no_overlap (xem bai 4.1)`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT603</span>
<h2>Cài môi trường cho REST API đặt Homestay</h2>
<p class="lead">Đồ án này là <strong>REST API thuần</strong> (không frontend): Node.js + Express + Prisma + PostgreSQL. Điểm đặc biệt: cần extension <strong>btree_gist</strong> để tạo ràng buộc chống đặt phòng chồng ngày. Cài 4 công cụ dưới đây một lần, chạy Postgres bằng Docker, rồi bạn sẵn sàng code.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Express</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">VS Code</div><div class="lz-d">IDE + Prisma ext</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Docker Desktop</div><div class="lz-d">Postgres + ship</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Postman</div><div class="lz-d">test API</div></div>
</div>

<h3>🅐 Node.js LTS — chạy toàn bộ backend</h3>
<p>Cài bản LTS (20.x trở lên). Kèm sẵn <code>npm</code>. Sau khi cài, <code>node -v</code> phải ra <code>v20.x</code> trở lên.</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Node.js (LTS)</span><span class="lc-sub">nodejs.org — chọn bản LTS cho hệ điều hành của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 VS Code + extension Prisma — IDE</h3>
<p>Nhẹ, hiểu JavaScript/TypeScript tốt. Cài thêm extension <strong>Prisma</strong> (tô màu &amp; format schema.prisma) và <strong>REST Client</strong> (gửi request ngay trong editor, thay Postman nếu thích).</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com — sau đó cài extension "Prisma" trong Marketplace.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Docker Desktop — Postgres tức thì (có btree_gist)</h3>
<p>Thay vì cài PostgreSQL trực tiếp, chạy nó trong Docker (khối lệnh bên dưới) — một lệnh là có ngay CSDL, và nhớ chạy <code>CREATE EXTENSION btree_gist</code> để dùng ràng buộc chống chồng ngày ở Mục 4.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — cài xong nhớ mở app để Docker engine chạy nền.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 Postman — thử API không cần giao diện</h3>
<p>Vì đồ án không có frontend, Postman (hoặc REST Client trong VS Code) chính là cách bạn thao tác và trình diễn: đăng ký, đăng nhập, đặt phòng, và tự tay tạo tình huống 409 "đặt trùng ngày".</p>
<a class="link-card dl" href="https://www.postman.com/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Tải Postman</span><span class="lc-sub">postman.com — hoặc dùng extension "REST Client" trong VS Code.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Quan trọng — btree_gist:</strong> ràng buộc <code>EXCLUDE USING gist</code> chống đặt phòng chồng ngày (Mục 4) cần extension <code>btree_gist</code>. Postgres image không bật sẵn — chạy <code>CREATE EXTENSION IF NOT EXISTS btree_gist;</code> một lần (khối lệnh bên dưới), hoặc đặt nó ở đầu file migration.</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy khối lệnh "Kiểm tra mọi công cụ", dựng Postgres bằng Docker, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL Prisma).</div>
`,
  },
};
