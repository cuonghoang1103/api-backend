/**
 * Exp Hub guide for INT605 — E-learning Mini Platform dev environment (Vietnamese).
 * Academy INT605 bài 0.4 links its "Cài đặt" card to /exp-hub/int605-cai-dat-moi-truong.
 * Stack: Node.js LTS + VS Code + Docker Desktop + Prisma + NextAuth (full-stack Next.js).
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int605-cai-dat-moi-truong',
    title: 'INT605 — Cài môi trường Next.js + Prisma + PostgreSQL',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho nền tảng e-learning Next.js full-stack: Node.js LTS, VS Code, Docker Desktop, Prisma, NextAuth — kèm lệnh tạo dự án và chạy Postgres bằng Docker.',
    referenceUrl: 'https://nodejs.org/en/download',
    codeBlocks: [
      {
        name: 'Kiểm tra công cụ',
        language: 'bash',
        code: `node -v        # nen >= 20.x (Next 14/15 yeu cau Node 18.17+)
npm -v
docker --version
docker compose version
git --version`,
      },
      {
        name: 'Chạy PostgreSQL bằng Docker',
        language: 'bash',
        code: `docker run --name elearning-db \\
  -e POSTGRES_PASSWORD=elearning \\
  -e POSTGRES_DB=elearning \\
  -p 5432:5432 -d postgres:16

docker ps
docker exec -it elearning-db psql -U postgres -d elearning -c "\\l"
docker stop elearning-db && docker rm elearning-db`,
      },
      {
        name: 'Tạo dự án Next.js (App Router) + Prisma + NextAuth',
        language: 'bash',
        code: `npx create-next-app@latest elearning --ts --app --eslint
cd elearning
npm install prisma @prisma/client next-auth zod
npx prisma init --datasource-provider postgresql

# .env: DATABASE_URL="postgresql://postgres:elearning@localhost:5432/elearning"
#       AUTH_SECRET="<chay: npx auth secret>"
# Viet schema.prisma (User, Course, Quiz, Question, Attempt) roi:
npx prisma migrate dev --name init
npm run dev   # http://localhost:3000`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT605</span>
<h2>Cài môi trường cho nền tảng E-learning (Next.js full-stack)</h2>
<p class="lead">Đồ án này là <strong>full-stack trong một app Next.js</strong> (App Router): giao diện + API + chấm điểm ở cùng một dự án, CSDL PostgreSQL qua Prisma, đăng nhập bằng NextAuth. Cài 3 công cụ dưới đây một lần, chạy Postgres bằng Docker, rồi bạn sẵn sàng code phần lõi "chấm điểm phía server" (Mục 4).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Next.js</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">VS Code</div><div class="lz-d">IDE + Prisma ext</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Docker Desktop</div><div class="lz-d">Postgres + ship</div></div>
</div>

<h3>🅐 Node.js LTS — chạy Next.js</h3>
<p>Cài bản LTS (20.x trở lên; Next tối thiểu Node 18.17). Kèm sẵn <code>npm</code> và <code>npx</code>.</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Node.js (LTS)</span><span class="lc-sub">nodejs.org — chọn bản LTS cho hệ điều hành của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 VS Code + extension Prisma — IDE</h3>
<p>Cài thêm extension <strong>Prisma</strong> (tô màu &amp; format schema) và <strong>ESLint</strong>. VS Code hiểu TypeScript rất tốt — quan trọng khi phân biệt Server vs Client Component ở Mục 3 &amp; 5.</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com — sau đó cài extension "Prisma".</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Docker Desktop — Postgres tức thì &amp; ship</h3>
<p>Chạy Postgres trong Docker (khối lệnh bên dưới) — một lệnh là có ngay CSDL. Cuối đồ án, Docker Compose khởi động cả web (Next standalone) + db bằng một lệnh.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — cài xong nhớ mở app để Docker engine chạy nền.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<div class="callout ok"><strong>Mẹo bảo mật quan trọng:</strong> đáp án đúng (<code>correctIndex</code>) KHÔNG BAO GIỜ được gửi xuống client. Dùng tab <b>Network</b> của DevTools để tự kiểm phản hồi <code>/api/quiz/...</code> — nếu bạn thấy <code>correctIndex</code> ở đó là bài đã lộ đáp án (xem Mục 4.1).</div>

<div class="callout"><strong>Sau khi cài xong:</strong> chạy <code>node -v</code>, dựng Postgres bằng Docker, tạo dự án Next.js, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
