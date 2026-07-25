/**
 * Exp Hub guide for INT606 — Event Ticketing System dev environment (Vietnamese).
 * Academy INT606 bài 0.4 links its "Cài đặt" card to /exp-hub/int606-cai-dat-moi-truong.
 * Stack: Node.js LTS + VS Code + Docker Desktop (Postgres + Redis) + Postman.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int606-cai-dat-moi-truong',
    title: 'INT606 — Cài môi trường Node.js + Express + Redis + PostgreSQL',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho hệ thống bán vé sự kiện: Node.js LTS, VS Code, Docker (Postgres + Redis), Postman — kèm lệnh chạy Redis & Postgres bằng Docker một lệnh.',
    referenceUrl: 'https://nodejs.org/en/download',
    codeBlocks: [
      {
        name: 'Kiểm tra công cụ',
        language: 'bash',
        code: `node -v
npm -v
docker --version
docker compose version
git --version`,
      },
      {
        name: 'Chạy Postgres + Redis bằng Docker',
        language: 'bash',
        code: `# Postgres 16 (kho ben — luu ve da ban)
docker run --name ticketing-db \\
  -e POSTGRES_PASSWORD=ticketing -e POSTGRES_DB=ticketing \\
  -p 5432:5432 -d postgres:16

# Redis 7 (tang hold ghe — SET NX PX)
docker run --name ticketing-redis -p 6379:6379 -d redis:7

# Thu Redis: giu 1 ghe 120s roi kiem
docker exec -it ticketing-redis redis-cli SET "hold:event:42:seat:A12" 7 NX PX 120000
docker exec -it ticketing-redis redis-cli GET "hold:event:42:seat:A12"

# Dung / xoa
docker stop ticketing-db ticketing-redis && docker rm ticketing-db ticketing-redis`,
      },
      {
        name: 'Khởi tạo dự án API',
        language: 'bash',
        code: `mkdir ticketing-api && cd ticketing-api
npm init -y
npm install express redis @prisma/client jsonwebtoken bcrypt zod
npm install -D prisma nodemon supertest vitest
npx prisma init --datasource-provider postgresql

# .env: DATABASE_URL="postgresql://postgres:ticketing@localhost:5432/ticketing"
#       REDIS_URL="redis://localhost:6379"
#       JWT_SECRET="<chuoi ngau nhien dai>"
npx prisma migrate dev --name init`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT606</span>
<h2>Cài môi trường cho Hệ thống Bán vé Sự kiện</h2>
<p class="lead">Đồ án này dùng <strong>hai kho dữ liệu</strong>: Redis giữ ghế (nhanh, tự hết hạn) và PostgreSQL lưu vé đã bán (bền, có ràng buộc UNIQUE). Backend là Node.js + Express. Cài 3 công cụ dưới đây một lần, chạy Postgres + Redis bằng Docker, rồi bạn sẵn sàng code phần lõi "giữ ghế nguyên tử" (Mục 4).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Express</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">VS Code</div><div class="lz-d">IDE + Prisma ext</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Docker Desktop</div><div class="lz-d">Postgres + Redis</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Postman</div><div class="lz-d">test flash-sale</div></div>
</div>

<h3>🅐 Node.js LTS — chạy backend</h3>
<p>Cài bản LTS (20.x trở lên). Kèm sẵn <code>npm</code>.</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Node.js (LTS)</span><span class="lc-sub">nodejs.org — chọn bản LTS cho hệ điều hành của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 VS Code + extension Prisma — IDE</h3>
<p>Cài thêm extension <strong>Prisma</strong> và <strong>REST Client</strong> (gửi request ngay trong editor).</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com — sau đó cài extension "Prisma".</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Docker Desktop — Postgres + Redis tức thì</h3>
<p>Chạy cả hai kho trong Docker (khối lệnh bên dưới) — hai lệnh là có ngay cả CSDL bền lẫn cache Redis. Cuối đồ án, Docker Compose khởi động api + db + redis bằng một lệnh.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — cài xong nhớ mở app để Docker engine chạy nền.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 Postman — mô phỏng flash-sale</h3>
<p>Dùng <b>Collection Runner</b> của Postman để bắn nhiều request "giữ ghế" song song vào cùng một ghế — chứng minh chỉ một người giữ được (đúng như Mục 4 &amp; 5).</p>
<a class="link-card dl" href="https://www.postman.com/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Tải Postman</span><span class="lc-sub">postman.com — hoặc dùng extension "REST Client" trong VS Code.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Vì sao cần Redis:</strong> giữ ghế phải nguyên tử và tự hết hạn — <code>SET key NX PX</code> làm cả hai trong một lệnh O(1). Postgres UNIQUE là chốt chặn cuối. Hai kho, hai việc (xem Mục 4 &amp; 6).</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy <code>node -v</code>, dựng Postgres + Redis bằng Docker, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
