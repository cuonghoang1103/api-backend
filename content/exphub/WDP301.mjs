/**
 * Exp Hub guide for WDP301 — MERN dev environment (Vietnamese).
 * Seeded by scripts/exphub-seed-guide.mjs (idempotent upsert by slug).
 * Academy WDP301 bài 0.4 links its "Công cụ" card to /exp-hub/wdp301-cai-dat-mern.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'wdp301-cai-dat-mern',
    title: 'WDP301 — Cài môi trường MERN: Node.js, VS Code, MongoDB Atlas, Postman, Git/GitLab',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Cài trọn bộ môi trường dev full-stack MERN cho đồ án WDP301: Node.js LTS, VS Code + extension, MongoDB (Atlas hoặc local), Postman, và Git/GitLab để nhóm cộng tác. Kèm lệnh kiểm tra và cấu trúc repo /server + /client.',
    referenceUrl: 'https://nodejs.org/',
    codeBlocks: [
      {
        name: 'Kiểm tra công cụ đã cài đúng',
        language: 'bash',
        code: `# Node.js nen la 20.x tro len
node -v
npm -v

# Git
git --version

# (tuy chon) Docker cho phan nang cao
docker --version
docker compose version`,
      },
      {
        name: 'Khởi tạo repo MERN (/server + /client)',
        language: 'bash',
        code: `mkdir project && cd project

# --- BACKEND (Express + MongoDB) ---
mkdir server && cd server
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install -D nodemon
# tao src/app.js, src/models, src/controllers, src/services, src/routes
cd ..

# --- FRONTEND (React + Vite) ---
npm create vite@latest client -- --template react
cd client && npm install && npm install axios react-router-dom
cd ..

# --- GIT ---
git init
printf "node_modules/\\n.env\\ndist/\\n" > .gitignore
git add . && git commit -m "chore: init MERN monorepo"`,
      },
      {
        name: 'File .env server (KHÔNG commit)',
        language: 'bash',
        code: `# server/.env  (them vao .gitignore!)
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/wdp301
JWT_SECRET=doi-thanh-mot-chuoi-ngau-nhien-dai
PORT=5000`,
      },
    ],
    noteContent: `
<span class="eyebrow">Cài đặt môi trường · WDP301</span>
<h2>Bộ công cụ MERN cho đồ án WDP301</h2>
<p class="lead">Cài trọn môi trường dev full-stack cho đồ án web. Làm <strong>trong tuần 1</strong> để cả nhóm đồng bộ — nửa số lỗi "máy em thì chạy" đến từ môi trường không đồng nhất. Tất cả miễn phí.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Runtime</div><div class="lz-t">Node.js LTS</div><div class="lz-d">chạy Express + build React</div></div>
  <div class="lz-step"><div class="lz-k">Editor</div><div class="lz-t">VS Code</div><div class="lz-d">ESLint · Prettier · REST Client</div></div>
  <div class="lz-step"><div class="lz-k">DB</div><div class="lz-t">MongoDB Atlas</div><div class="lz-d">cluster đám mây miễn phí</div></div>
  <div class="lz-step"><div class="lz-k">Test API</div><div class="lz-t">Postman</div><div class="lz-d">thử endpoint trước khi nối FE</div></div>
  <div class="lz-step"><div class="lz-k">Git</div><div class="lz-t">GitLab</div><div class="lz-d">branch · PR · issue</div></div>
</div>

<h3>⬇️ 1 — Node.js LTS + npm</h3>
<p>Runtime cho backend Express và để build React. Cài bản LTS (20.x trở lên).</p>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Node.js LTS</span><span class="lc-sub">nodejs.org/en/download · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🧩 2 — VS Code + extension</h3>
<p>Editor chính. Cài các extension: <strong>ESLint</strong>, <strong>Prettier</strong>, <strong>REST Client</strong> (test API ngay trong editor), <strong>MongoDB for VS Code</strong>.</p>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">Visual Studio Code</span><span class="lc-sub">code.visualstudio.com/download</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🍃 3 — MongoDB (Atlas hoặc local)</h3>
<p>Dùng <strong>MongoDB Atlas</strong> (cluster đám mây miễn phí, không cần cài) hoặc cài MongoDB Community local. Với Atlas: tạo cluster → tạo user DB → whitelist IP → copy connection string vào <code>MONGO_URI</code>.</p>
<a class="link-card dl" href="https://www.mongodb.com/cloud/atlas/register" target="_blank" rel="noopener">
  <span class="lc-ico">🍃</span>
  <span class="lc-body"><span class="lc-title">MongoDB Atlas (miễn phí)</span><span class="lc-sub">mongodb.com/cloud/atlas · cluster M0 miễn phí</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>📮 4 — Postman (test API)</h3>
<p>Test các endpoint (GET/POST/PATCH) trước khi nối frontend — đặt header Authorization: Bearer &lt;token&gt; để thử route có auth.</p>
<a class="link-card dl" href="https://www.postman.com/downloads/" target="_blank" rel="noopener">
  <span class="lc-ico">📮</span>
  <span class="lc-body"><span class="lc-title">Postman</span><span class="lc-sub">postman.com/downloads · client test API</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>🔀 5 — Git + GitLab (bắt buộc theo syllabus)</h3>
<p>Nhóm cộng tác qua GitLab: feature branch → Pull Request → review → merge. Commit đều, có ý nghĩa từ mọi thành viên — lịch sử Git là bằng chứng teamwork được chấm (CLO4).</p>
<a class="link-card dl" href="https://gitlab.com/users/sign_up" target="_blank" rel="noopener">
  <span class="lc-ico">🦊</span>
  <span class="lc-body"><span class="lc-title">GitLab</span><span class="lc-sub">gitlab.com · repo + issue + merge request</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="pitfall">Đừng commit <code>.env</code> (chứa MONGO_URI + JWT_SECRET) hay <code>node_modules/</code>. Thêm chúng vào <code>.gitignore</code> ngay từ commit đầu. Lộ secret trên repo là cờ đỏ bảo mật.</div>

<div class="callout ok"><strong>Cấu trúc repo chuẩn:</strong> <code>/server</code> (Express, package.json riêng) + <code>/client</code> (React, package.json riêng) + <code>README.md</code> gốc ghi cách chạy cả hai. Bố cục rõ ràng là thứ đầu tiên giám khảo & đồng đội mới đánh giá.</div>
`,
  },
};
