/**
 * Exp Hub guide for INT610 — AI Recruitment Screening dev environment (Vietnamese).
 * Academy INT610 bài 0.4 links its "Cài đặt" card to /exp-hub/int610-cai-dat-moi-truong.
 * Stack: Node.js LTS + VS Code + Docker (Postgres) + LLM API key (server-side) + zod.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int610-cai-dat-moi-truong',
    title: 'INT610 — Cài môi trường Next.js + Prisma + LLM (sàng lọc AI)',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho công cụ sàng lọc tuyển dụng AI: Node.js, VS Code, Docker (Postgres), zod, và một key LLM giữ ở server — kèm lệnh tạo dự án Next.js.',
    referenceUrl: 'https://zod.dev',
    codeBlocks: [
      {
        name: 'Kiểm tra công cụ',
        language: 'bash',
        code: `node -v        # nen >= 20.x
npm -v
docker --version
git --version`,
      },
      {
        name: 'Chạy PostgreSQL bằng Docker',
        language: 'bash',
        code: `docker run --name hiring-db \\
  -e POSTGRES_PASSWORD=hiring -e POSTGRES_DB=hiring \\
  -p 5432:5432 -d postgres:16

docker ps
docker exec -it hiring-db psql -U postgres -d hiring -c "\\l"`,
      },
      {
        name: 'Tạo dự án Next.js (App Router) + Prisma + zod',
        language: 'bash',
        code: `npx create-next-app@latest ai-recruit --ts --app --eslint
cd ai-recruit
npm install prisma @prisma/client next-auth zod
npx prisma init --datasource-provider postgresql

# .env (KHONG commit):
#   DATABASE_URL="postgresql://postgres:hiring@localhost:5432/hiring"
#   AUTH_SECRET="<npx auth secret>"
#   LLM_API_KEY="<key cua ban>"   # CHI o server, KHONG NEXT_PUBLIC_
npx prisma migrate dev --name init
npm run dev`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT610</span>
<h2>Cài môi trường cho Sàng lọc tuyển dụng AI</h2>
<p class="lead">Đồ án này là <strong>Next.js full-stack</strong> + <strong>Prisma</strong> + một <strong>LLM</strong> để chấm điểm CV — nhưng con người luôn ra quyết định cuối. Hai điểm mấu chốt: dùng <strong>zod</strong> ép LLM trả JSON đúng schema, và giữ key LLM ở <em>server</em> (không bao giờ <code>NEXT_PUBLIC_</code>). Cài 3 công cụ dưới đây rồi bắt đầu.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Next.js</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">VS Code</div><div class="lz-d">IDE + Prisma ext</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Docker</div><div class="lz-d">Postgres</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Key LLM</div><div class="lz-d">giữ ở server</div></div>
</div>

<h3>🅐 Node.js LTS — chạy Next.js</h3>
<p>Cài bản LTS (20.x trở lên). Kèm <code>npm</code>/<code>npx</code>.</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Node.js (LTS)</span><span class="lc-sub">nodejs.org — chọn bản LTS cho hệ điều hành của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅑 VS Code + extension Prisma — IDE</h3>
<p>Cài extension <strong>Prisma</strong> và <strong>ESLint</strong>. TypeScript + zod cho bạn kiểu an toàn khi xử lý output LLM.</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com — cài extension "Prisma".</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Docker Desktop — Postgres tức thì</h3>
<p>Chạy PostgreSQL trong Docker (khối lệnh bên dưới) — một lệnh là có ngay CSDL. Cuối đồ án, Docker Compose khởi động web + db bằng một lệnh, key LLM tiêm lúc chạy.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — cài xong nhớ mở app để engine chạy nền.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 zod &amp; key LLM — trái tim của sàng lọc</h3>
<p>zod (cài bằng npm) ép LLM trả JSON đúng cấu trúc (điểm, kỹ năng khớp, lo ngại) và <em>kiểm</em> nó — coi output mô hình như input không tin cậy. Key LLM đặt trong <code>.env</code> là <code>LLM_API_KEY</code>, chỉ dùng ở Route Handler server.</p>
<a class="link-card dl" href="https://zod.dev" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Tài liệu zod</span><span class="lc-sub">zod.dev — schema, safeParse, infer kiểu.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="callout warn"><strong>Hai nguyên tắc "vàng" của đồ án này:</strong> (1) LLM chỉ <em>gợi ý</em> — con người luôn ra quyết định cuối và được ghi lại (human-in-the-loop, Mục 4.2). (2) Key LLM CHỈ ở server (<code>process.env.LLM_API_KEY</code>), không bao giờ <code>NEXT_PUBLIC_</code> hay nướng vào image.</div>

<div class="callout"><strong>Sau khi cài xong:</strong> dựng Postgres bằng Docker, tạo dự án Next.js, đặt <code>.env</code>, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL).</div>
`,
  },
};
