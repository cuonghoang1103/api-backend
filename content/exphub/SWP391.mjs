/**
 * Exp Hub guide for SWP391 — Git/GitHub + Jira + Figma + Docker (Vietnamese).
 * Academy SWP391 links its "Cài đặt" card to /exp-hub/swp391-cong-cu-du-an.
 */
export default {
  category: { slug: 'fptu-moi-truong-hoc', name: 'FPTU — Cài đặt môi trường học', icon: '🛠️' },
  snippet: {
    slug: 'swp391-cong-cu-du-an',
    title: 'SWP391 — Bộ công cụ làm dự án nhóm',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Bộ công cụ chạy dự án capstone SWP391: Git + GitHub (mã nguồn & cộng tác), Jira/Trello (Scrum board), Figma (thiết kế UI), Docker (đóng gói & chạy) — kèm quy trình git nhóm.',
    referenceUrl: 'https://git-scm.com/',
    codeBlocks: [
      {
        name: 'Quy trình Git nhóm (feature branch)',
        language: 'bash',
        code: `# Lay code moi nhat tu main
git checkout main
git pull origin main

# Tao nhanh tinh nang rieng cho task cua ban
git checkout -b feature/login-page

# ... code ... roi commit
git add .
git commit -m "feat(auth): add login page"

# Day nhanh len GitHub va mo Pull Request
git push -u origin feature/login-page
# -> Vao GitHub bam "Compare & pull request" -> nho de nguoi khac review`,
      },
      {
        name: 'Dockerfile mẫu cho app Node',
        language: 'dockerfile',
        code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn công cụ · SWP391</span>
<h2>Bộ công cụ chạy dự án capstone</h2>
<p class="lead">SWP391 là môn <strong>làm dự án phần mềm theo nhóm</strong> qua nhiều sprint. Điểm phần lớn nằm ở <strong>quy trình</strong>, không chỉ code. Bạn cần 4 nhóm công cụ: <strong>cộng tác mã nguồn</strong> (Git/GitHub), <strong>quản lý công việc</strong> (Jira/Trello theo Scrum), <strong>thiết kế</strong> (Figma), và <strong>triển khai</strong> (Docker).</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Git + GitHub</div><div class="lz-d">mã nguồn chung</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Jira / Trello</div><div class="lz-d">Scrum board</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Figma</div><div class="lz-d">thiết kế UI</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Docker</div><div class="lz-d">đóng gói & chạy</div></div>
</div>

<h3>🅐 Git + GitHub — trái tim của dự án nhóm</h3>
<p>Cả nhóm dùng chung một kho mã. Mỗi người làm trên <strong>nhánh riêng</strong> rồi mở <strong>Pull Request</strong> để người khác review trước khi gộp vào <code>main</code> — đây là điều giảng viên chấm điểm.</p>
<a class="link-card dl" href="https://git-scm.com/downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Git (miễn phí, chính chủ)</span><span class="lc-sub">git-scm.com · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<a class="link-card dl" href="https://github.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub — tạo tài khoản & repo nhóm</span><span class="lc-sub">github.com · miễn phí · dùng gói Student để có thêm quyền</span></span>
  <span class="lc-cta">MỞ →</span>
</a>
<div class="note-ct">Quy trình chuẩn xem khối "Quy trình Git nhóm" bên trên: <b>pull → nhánh feature → commit → push → Pull Request</b>. Không bao giờ push thẳng vào <code>main</code>.</div>

<h3>🅑 Jira / Trello — bảng Scrum</h3>
<p>Chia công việc thành <strong>sprint</strong>, mỗi sprint có các <strong>user story</strong> kéo qua các cột <em>To Do → In Progress → Done</em>. Đây là bằng chứng nhóm làm việc có tổ chức.</p>
<a class="link-card dl" href="https://www.atlassian.com/software/jira/free" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Jira / Trello (Atlassian) — gói Free</span><span class="lc-sub">atlassian.com · Scrum/Kanban board · miễn phí cho nhóm nhỏ</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🅒 Figma — thiết kế giao diện trước khi code</h3>
<p>Vẽ <strong>wireframe/mockup</strong> để cả nhóm và giảng viên thấy sản phẩm trước. Figma chạy thẳng trên trình duyệt, cộng tác thời gian thực, miễn phí cho sinh viên.</p>
<a class="link-card dl" href="https://www.figma.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🎨</span>
  <span class="lc-body"><span class="lc-title">Figma — thiết kế UI/UX</span><span class="lc-sub">figma.com · miễn phí · có gói Education</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>🅓 Docker — đóng gói để demo & nộp</h3>
<p>Docker gói app + môi trường vào một <strong>container</strong> chạy giống nhau trên mọi máy — hết cảnh "máy tôi chạy được, máy bạn thì không" khi demo.</p>
<a class="link-card dl" href="https://www.docker.com/products/docker-desktop/" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Docker Desktop (miễn phí cho cá nhân/học tập)</span><span class="lc-sub">docker.com · Windows/macOS/Linux</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<div class="lz-stack">
  <div class="lz-layer"><b>Dockerfile</b> — công thức đóng gói app (xem mẫu Node bên trên).</div>
  <div class="lz-layer"><b>docker build</b> — tạo image từ Dockerfile.</div>
  <div class="lz-layer"><b>docker compose</b> — chạy nhiều service (app + database) bằng 1 lệnh.</div>
</div>
<div class="note-ct">Gợi ý thêm: dùng <b>GitHub Actions</b> để tự chạy test mỗi lần push (CI). Xem thêm các chủ đề trong Exp Hub: git-workflow, agile-scrum, docker, code-review.</div>
`,
  },
};
