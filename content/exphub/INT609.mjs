/**
 * Exp Hub guide for INT609 — AI Study Assistant (RAG) dev environment (Vietnamese).
 * Academy INT609 bài 0.4 links its "Cài đặt" card to /exp-hub/int609-cai-dat-moi-truong.
 * Stack: Node.js LTS + VS Code + Docker (pgvector Postgres) + an LLM/embedding API key.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'int609-cai-dat-moi-truong',
    title: 'INT609 — Cài môi trường Next.js + pgvector + LLM (RAG)',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài môi trường cho trợ lý học tập AI (RAG): Node.js, VS Code, Docker với Postgres pgvector, và một key LLM/embedding giữ ở server — kèm lệnh tạo dự án Next.js.',
    referenceUrl: 'https://github.com/pgvector/pgvector',
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
        name: 'Chạy Postgres CÓ pgvector bằng Docker',
        language: 'bash',
        code: `# QUAN TRONG: dung image pgvector, KHONG phai postgres thuong
docker run --name study-db \\
  -e POSTGRES_PASSWORD=study -e POSTGRES_DB=study \\
  -p 5432:5432 -d pgvector/pgvector:pg16

# Bat extension vector (phai chay TRUOC khi tao cot ::vector)
docker exec -it study-db psql -U postgres -d study \\
  -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Kiem tra
docker exec -it study-db psql -U postgres -d study -c "\\dx"`,
      },
      {
        name: 'Tạo dự án Next.js (App Router) + Prisma',
        language: 'bash',
        code: `npx create-next-app@latest study-assistant --ts --app --eslint
cd study-assistant
npm install prisma @prisma/client next-auth zod
npx prisma init --datasource-provider postgresql

# .env (KHONG commit):
#   DATABASE_URL="postgresql://postgres:study@localhost:5432/study"
#   AUTH_SECRET="<npx auth secret>"
#   LLM_API_KEY="<key cua ban>"   # CHI o server, KHONG dat NEXT_PUBLIC_
npx prisma migrate dev --name init
npm run dev`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · INT609</span>
<h2>Cài môi trường cho Trợ lý học tập AI (RAG)</h2>
<p class="lead">Đồ án này là <strong>Next.js full-stack</strong> + <strong>pgvector</strong> (tìm kiếm vector trong Postgres) + một <strong>LLM</strong>. Hai điểm đặc biệt: dùng image Postgres <em>có pgvector</em>, và giữ key LLM ở <em>server</em> (không bao giờ <code>NEXT_PUBLIC_</code>). Cài 3 công cụ dưới đây rồi bắt đầu.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Next.js</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">VS Code</div><div class="lz-d">IDE + Prisma ext</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Docker (pgvector)</div><div class="lz-d">Postgres + vector</div></div>
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
<p>Cài extension <strong>Prisma</strong> và <strong>ESLint</strong>. VS Code hiểu TypeScript tốt — quan trọng khi giữ logic LLM/đáp án ở Server Component/Route Handler.</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Tải Visual Studio Code</span><span class="lc-sub">code.visualstudio.com — cài extension "Prisma".</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅒 Docker Desktop — Postgres CÓ pgvector</h3>
<p>Dùng image <code>pgvector/pgvector:pg16</code> (KHÔNG phải <code>postgres:16</code> thường) để có sẵn extension vector. Khối lệnh bên dưới dựng CSDL và bật <code>CREATE EXTENSION vector</code>.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Tải Docker Desktop</span><span class="lc-sub">docker.com — image pgvector/pgvector:pg16 cho tìm kiếm vector.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🅓 Key LLM / embedding — giữ ở server</h3>
<p>Bạn cần một key từ nhà cung cấp LLM (để sinh câu trả lời và embedding). Đặt nó trong <code>.env</code> là <code>LLM_API_KEY</code> — <strong>không bao giờ</strong> đặt tiền tố <code>NEXT_PUBLIC_</code>, vì thế sẽ gửi key xuống mọi trình duyệt. Mọi lời gọi LLM đi qua một Route Handler phía server (xem Mục 4.2).</p>
<a class="link-card dl" href="https://github.com/pgvector/pgvector" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tài liệu pgvector</span><span class="lc-sub">github.com/pgvector/pgvector — cú pháp vector, toán tử &lt;=&gt;, index.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<div class="callout warn"><strong>Bẫy bảo mật số 1:</strong> đừng gọi LLM thẳng từ trình duyệt bằng key <code>NEXT_PUBLIC_LLM_KEY</code> — key trả tiền sẽ bị bất kỳ ai chép từ DevTools. Luôn proxy qua Route Handler server (key ở <code>process.env.LLM_API_KEY</code>). Xem Mục 4.2.</div>

<div class="callout"><strong>Sau khi cài xong:</strong> dựng Postgres pgvector + bật extension, tạo dự án Next.js, đặt <code>.env</code>, rồi quay lại bài <b>0.4</b> trong khoá học để bắt đầu Mục 1 (thiết kế CSDL pgvector).</div>
`,
  },
};
