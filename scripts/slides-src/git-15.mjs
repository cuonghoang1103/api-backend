/** Git & GitHub · Deck git-15 — Chương 15: GitHub cho sinh viên — hồ sơ, portfolio & mã nguồn mở.
 *  Output terminal là output THẬT, chạy trong kho thử scratchpad/ch15-lab (dung.sh, ngày commit cố định
 *  2026-09-23 nên chạy lại ra đúng mã băm): git 2.51.1, node 22.21, Vite 8.3.0 (create-vite, template react),
 *  actionlint 1.7.12. "GitHub Pages" được GIẢ LẬP bằng một máy chủ tĩnh node phục vụ thư mục pages-sim/<repo>/
 *  (gia-lap-pages.mjs) — không có gì được đẩy lên GitHub. Upstream/fork là hai kho trần (bare) cục bộ.
 *  Con số (Pages, Student Pack, Codespaces, Copilot Student) kiểm trên docs.github.com / education.github.com — tính đến 09/2026.
 */
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, code, mindmap, term, diagram, G } from './_git-chung.mjs';

export const deck = { key: 'git-15', code: 'GIT · CHƯƠNG 15', title: 'GitHub cho sinh viên', sub: 'Git & GitHub · Chương 15' };

/* ── Wireframe trang profile GitHub (HTML thuần — vẽ lại, không phải ảnh chụp) ── */
const dot = (c) => `<i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${c};margin-right:5px;vertical-align:-1px"></i>`;
const pin = (n, d, lang, c, star = '') => `<div style="background:#0f141b;border:1.5px solid ${G.bd};border-radius:9px;padding:8px 11px">
  <div style="font-family:SF Mono,Menlo,monospace;font-size:13.5px;font-weight:700;color:${G.blu};white-space:nowrap">${n}</div>
  <div style="font-size:13px;color:${G.mu};margin:3px 0 5px;line-height:1.3;min-height:17px">${d}</div>
  <div style="font-size:12.5px;color:${G.mu}">${dot(c)}${lang}${star ? ` &nbsp;☆ ${star}` : ''}</div></div>`;
const badge = (n, c) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:${c};color:#0b0e14;font-weight:800;font-size:17px;box-shadow:0 0 0 3px #0d1117">${n}</span>`;
const profile = () => `<div style="display:grid;grid-template-columns:200px 1fr;gap:16px;text-align:left;background:#0d1117;border:1.5px solid ${G.bd};border-radius:14px;padding:14px 16px;position:relative">
  <div>
    <div style="position:relative;width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,#2b3645,#1a212c);border:2px solid ${G.bd};display:flex;align-items:center;justify-content:center;font-size:48px">🧑‍💻
      <span style="position:absolute;right:-8px;top:0">${badge('1', G.amb)}</span></div>
    <div style="font-size:21px;font-weight:800;color:#fff;margin-top:8px">Hoàng Cường</div>
    <div style="font-size:15px;color:${G.mu}">cuonghoang1103</div>
    <div style="font-size:14px;color:${G.tx};margin:6px 0;line-height:1.35">SV CNTT FPTU · tìm thực tập Web/Backend · Next.js, Node, Prisma</div>
    <div style="font-size:13px;color:${G.mu};line-height:1.6">📍 Hà Nội<br>🔗 cuongthai.com<br>✉️ email trường</div>
  </div>
  <div>
    <div style="border:1.5px solid ${G.bd};border-radius:10px;padding:9px 12px;position:relative">
      <span style="position:absolute;right:10px;top:8px">${badge('2', G.grn)}</span>
      <div style="font-family:SF Mono,Menlo,monospace;font-size:12.5px;color:${G.mu}">cuonghoang1103 / README.md</div>
      <div style="font-size:19px;font-weight:800;color:#fff;margin:4px 0 2px">Chào, mình là Cường 👋</div>
      <div style="font-size:14px;color:${G.tx};line-height:1.45">• Đang làm: <b>cuongthai.com</b> — Next.js, Docker, VPS<br>• SWP391: mình phụ trách API đặt lịch + CI<br>• Tìm: thực tập (OJT) Web/Backend</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin:10px 0 6px"><b style="font-size:16px;color:#fff">Pinned</b>${badge('3', G.blu)}<span style="font-size:13px;color:${G.mu}">tối đa 6 repo + gist</span></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px">
      ${pin('cuongthai.com', 'Web học tập full-stack, Docker/VPS', 'TypeScript', '#3178c6')}
      ${pin('swp391-dat-lich', 'Đồ án nhóm: đặt lịch phòng khám', 'Java', '#b07219')}
      ${pin('portfolio', 'React/Vite trên GitHub Pages', 'JavaScript', '#f1e05a')}
      ${pin('lab211-java', 'LAB211 + test JUnit', 'Java', '#b07219')}
      ${pin('dotfiles', '.gitconfig, alias, zsh', 'Shell', '#89e051')}
      ${pin('vi-date', 'Fork — PR đầu tiên đã merge', 'JavaScript', '#f1e05a')}
    </div>
  </div>
</div>`;

/* ── Hình URL: base path /<repo>/ ── */
const seg = (t, c, lb) => `<div style="display:flex;flex-direction:column;align-items:center">
  <span style="font-family:SF Mono,Menlo,monospace;font-size:24px;font-weight:700;color:${c};background:#0a0d12;border-bottom:4px solid ${c};padding:6px 6px 4px">${t}</span>
  <span style="font-size:14.5px;color:${G.mu};margin-top:6px;text-align:center;line-height:1.3;max-width:260px">${lb}</span></div>`;
const url = () => `<div style="display:flex;justify-content:center;align-items:flex-start;gap:2px;background:#141a22;border:1.5px solid ${G.bd};border-radius:12px;padding:14px 10px">
  ${seg('https://', G.dim, 'Pages tự có HTTPS')}
  ${seg('cuonghoang1103.github.io', G.grn, 'tên miền = tên tài khoản')}
  ${seg('/portfolio/', G.git, '<b style="color:#fff">base</b> = tên repo<br>Vite phải biết đoạn này')}
  ${seg('assets/index-BlxItUYO.js', G.blu, 'file Vite sinh ra<br>(mã băm nội dung)')}
</div>`;

export const slides = S([
  cover({ t: 'Chương 15 — GitHub cho sinh viên', sub: 'Hồ sơ &amp; README · portfolio trên GitHub Pages · Student Pack, Codespaces, Copilot · PR mã nguồn mở đầu tiên', chap: 'CHƯƠNG 15' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('GitHub = CV thứ hai', 'thứ nhà tuyển dụng mở ra xem', [
    { t: '15.1 Trang profile', d: 'profile README · 6 repo ghim · 30 giây đầu', c: 'amb' },
    { t: '15.1 README dự án', d: 'ảnh · demo · cách chạy · mình làm gì · license', c: 'grn' },
    { t: '15.2 GitHub Pages', d: 'site tĩnh · deploy bằng Actions · base /repo/', c: 'blu' },
    { t: '15.2 Domain &amp; giới hạn', d: 'CNAME/A · HTTPS · 1 GB · 100 GB/tháng', c: 'tea' },
    { t: '15.3 Gói sinh viên', d: 'Student Pack · Codespaces · Copilot Student', c: 'vio' },
    { t: '15.4 Mã nguồn mở', d: 'good first issue → fork → PR → review → merge', c: 'git' },
  ]) },

  /* 3 */
  { t: 'Nhà tuyển dụng nhìn gì trong 30 giây', body: two(profile(),
    steps([
      ['<b>Ảnh + tiểu sử</b> (≈5 giây)', 'ảnh thật, một dòng: đang học gì, tìm việc gì'],
      ['<b>Profile README</b> (≈10 giây)', '3 dòng đầu phải trả lời “bạn là ai, làm được gì”'],
      ['<b>6 repo ghim</b> (≈15 giây)', 'chọn việc THẬT: đồ án, sản phẩm, PR đã merge'],
      ['Bấm vào <b>một</b> repo', 'README của nó quyết định có đọc tiếp không'],
    ]), 'l2') },

  /* 4 */
  { t: 'Profile README — một repo trùng tên tài khoản', body: two(
    code(`<!-- cuonghoang1103/cuonghoang1103 · README.md -->
## Chào, mình là Cường 👋

Sinh viên CNTT năm 3 tại FPTU. Đang tìm **thực tập (OJT)**
vị trí Web/Backend.

- 🔨 Đang làm: [cuongthai.com](https://cuongthai.com) —
  Next.js + Node.js + Prisma, deploy Docker lên VPS
- 🧑‍🤝‍🧑 Đồ án SWP391: API đặt lịch + CI cho nhóm 5 người
- 🌱 Đang học: kiểm thử, Docker, đóng góp mã nguồn mở

**Công nghệ:** TypeScript · React · Java · PostgreSQL
**Liên hệ:** email trường · linkedin.com/in/…`, 'markdown'),
    table(['GitHub hiện README lên profile khi…', ''], [
      ['Repo có tên <b>đúng bằng</b> tên tài khoản', '+<code>cuonghoang1103/cuonghoang1103</code>'],
      ['Repo là <b>public</b>', '+private thì không hiện'],
      ['Có file <code>README.md</code> ở <b>gốc</b> repo', '+không nằm trong thư mục'],
      ['File có nội dung', '+xoá trống ⇒ biến mất'],
    ], { sm: true }) +
    box('warn', 'Đừng nhồi 20 huy hiệu, bộ đếm lượt xem, “thống kê ngôn ngữ”. Người đọc cần <b>3 dòng thật</b> + link tới việc đã làm.') +
    box('tip', 'Ghim: profile → <b>Customize your pins</b> → chọn tối đa <b>6</b> repo/gist (docs GitHub, 09/2026).'), 'l') },

  /* 5 */
  { t: 'README dự án: một cái mở ra được việc, một cái thì không', body: vs({
    no: { t: 'README tệ (mặc định của create-vite)', items: [
      '<code># React + Vite</code> — tiêu đề là tên template, không phải tên dự án',
      'Không ảnh, không link demo ⇒ phải tự clone mới biết nó là gì',
      'Không nói cách chạy, thiếu <code>.env.example</code>',
      '“Đồ án nhóm 5” — nhưng <b>bạn</b> làm phần nào?',
      'Không LICENSE ⇒ về pháp lý không ai được dùng lại',
    ] },
    yes: { t: 'README tốt (SWP391 — Đặt lịch phòng khám)', items: [
      '1 câu dự án làm gì + <b>ảnh chụp/GIF</b> màn hình chính',
      '<b>Demo:</b> link chạy được + tài khoản thử',
      '<b>Chạy thử:</b> <code>cp .env.example .env</code> → <code>npm ci</code> → <code>npm run dev</code>',
      '<b>Công nghệ</b> + <b>Phần mình làm:</b> “API đặt lịch, CI, 38 PR”',
      '<b>topics</b> (react, spring-boot…) + <b>LICENSE</b> MIT',
    ] },
  }) + box('info', 'Mẫu gọn: <b>Tên + 1 câu</b> → Ảnh → Demo → Tính năng → Công nghệ → Chạy thử → <b>Vai trò của tôi</b> → Nhóm → License. Viết cho người <b>chưa từng</b> nghe về dự án.') },

  /* 6 */
  { t: 'License và topics — hai ô nhỏ, hậu quả lớn', body: two(
    table(['', 'Có ai được dùng lại mã?'], [
      ['<b>Không có LICENSE</b>', '-Không. Luật bản quyền mặc định: người xem được xem &amp; fork trên GitHub, nhưng không được sao chép, phân phối, sửa để dùng'],
      ['<b>MIT</b>', '+Được làm gần như mọi thứ, chỉ cần giữ dòng bản quyền + giấy phép'],
      ['<b>Apache-2.0</b>', '+Như MIT, thêm điều khoản bằng sáng chế'],
      ['<b>GPL-3.0</b>', '!Được dùng, nhưng sản phẩm phát hành lại phải mở mã cùng giấy phép'],
    ], { sm: true }) +
    box('warn', 'Đồ án ở trường: <b>hỏi giảng viên/nhóm</b> trước khi gắn license hay chuyển repo sang public.'),
    list([
      '<b>Topics</b> = nhãn chủ đề của repo, giúp người khác tìm thấy qua <code>github.com/topics/…</code>',
      'Quy tắc: chữ thường, số, gạch nối · ≤ 50 ký tự · <b>tối đa 20</b> topics',
      'Ví dụ: <code>react</code> <code>vite</code> <code>portfolio</code> <code>github-pages</code> <code>fptu</code>',
      'Thêm ở ô ⚙️ cạnh <b>About</b> trên trang repo — cùng chỗ điền mô tả + link demo',
      'Chọn license: <code>choosealicense.com</code> (GitHub dựng)',
    ]), 'l') },

  /* 7 */
  { t: 'GitHub Pages — hai cách xuất bản', body: `
    ${diagram({ w: 1160, h: 300, nodes: [
      { id: 'a', x: 0, y: 10, w: 330, h: 110, t: 'Deploy from a branch', d: 'nhánh + thư mục / hoặc /docs\nfile đã sẵn HTML/CSS/JS', c: 'tea' },
      { id: 'b', x: 0, y: 175, w: 330, h: 110, t: 'GitHub Actions', d: 'workflow tự build\n(Vite, Next export, Astro…)', c: 'blu' },
      { id: 's', x: 430, y: 90, w: 270, h: 110, t: 'Settings → Pages', d: 'Build and deployment\n→ Source', c: 'amb' },
      { id: 'u', x: 800, y: 10, w: 360, h: 110, t: 'User site', d: 'repo <user>.github.io\n⇒ https://<user>.github.io', c: 'grn', mono: false },
      { id: 'p', x: 800, y: 175, w: 360, h: 110, t: 'Project site', d: 'repo bất kỳ\n⇒ https://<user>.github.io/<repo>/', c: 'git' },
    ], edges: [
      { from: 'a', to: 's', c: 'tea' }, { from: 'b', to: 's', c: 'blu' },
      { from: 's', to: 'u', c: 'grn' }, { from: 's', to: 'p', c: 'git' },
    ] })}
    ${box('tip', 'Vite/React cần bước <b>build</b> ⇒ chọn <b>GitHub Actions</b>. Mỗi tài khoản có <b>một</b> user site; mỗi repo có <b>một</b> project site. Pages chỉ phục vụ <b>file tĩnh</b> — không chạy Node/Java/PHP phía máy chủ.')}` },

  /* 8 */
  { t: 'Luồng deploy portfolio bằng Actions', body: `<style>.k8 .c-code{font-size:13.5px;line-height:1.27;padding:8px 12px}</style><div class="k8">` + two(
    diagram({ w: 540, h: 470, nodes: [
      { id: 'p', x: 0, y: 0, w: 250, h: 66, t: 'git push → main', c: 'amb', mono: true },
      { id: 'w', x: 290, y: 0, w: 250, h: 66, t: 'deploy.yml chạy', d: 'runner ubuntu', c: 'blu' },
      { id: 'b', x: 290, y: 110, w: 250, h: 86, t: 'npm ci', d: 'npm run build\n⇒ dist/', c: 'vio', mono: true },
      { id: 'u', x: 290, y: 240, w: 250, h: 76, t: 'upload-pages', d: 'đóng gói dist/', c: 'tea' },
      { id: 'd', x: 290, y: 360, w: 250, h: 86, t: 'deploy-pages', d: 'môi trường\ngithub-pages', c: 'grn' },
      { id: 'l', x: 0, y: 360, w: 250, h: 86, t: '🌐 Site sống', d: '<user>.github.io\n/portfolio/', c: 'git' },
    ], edges: [
      { from: 'p', to: 'w', c: 'amb' }, { from: 'w', to: 'b', c: 'blu' }, { from: 'b', to: 'u', c: 'vio' },
      { from: 'u', to: 'd', c: 'tea' }, { from: 'd', to: 'l', c: 'grn' },
    ] }),
    code(`name: Deploy portfolio to Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write        # được đăng lên Pages
  id-token: write     # deploy-pages cần
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with: { path: ./dist }
      - id: deployment
        uses: actions/deploy-pages@v5`, 'yaml'), 'r') + '</div>' },

  /* 9 */
  { t: 'Base path /&lt;repo&gt;/ — lỗi “trang trắng” kinh điển', body: `
    ${url()}
    <div style="height:14px"></div>
    <style>.k9 .g-term pre{font-size:14.5px;line-height:1.42}</style><div class="k9">${two(
      term([
        '# base mặc định "/"',
        "$ grep -o 'src=\"[^\"]*\"' dist/index.html",
        'src="/assets/index-D4lLP2T1.js"',
        '$ node gia-lap-pages.mjs /portfolio/ /assets/index-D4lLP2T1.js',
        '200 /portfolio/',
        '! 404 /assets/index-D4lLP2T1.js',
        '# HTML về, JS không về ⇒ trang trắng, không báo lỗi',
      ], { title: 'Vite 8.3 — output thật, Pages giả lập', dir: '~/portfolio', branch: 'main' }),
      term([
        "# vite.config.js: base: '/portfolio/'",
        "$ grep -o 'src=\"[^\"]*\"' dist/index.html",
        'src="/portfolio/assets/index-BlxItUYO.js"',
        '$ node gia-lap-pages.mjs /portfolio/assets/index-BlxItUYO.js /portfolio/cv.pdf /cv.pdf',
        '= 200 /portfolio/assets/index-BlxItUYO.js',
        '= 200 /portfolio/cv.pdf',
        '! 404 /cv.pdf',
        '# ↑ <a href="/cv.pdf"> viết cứng trong JSX',
      ], { title: 'sau khi đặt base — output thật', dir: '~/portfolio', branch: 'main' }))}</div>
    ${box('tip', 'Link tới file trong <code>public/</code> viết trong JSX: dùng <code>import.meta.env.BASE_URL + \'cv.pdf\'</code>. User site hoặc domain riêng thì <code>base: \'/\'</code>.')}` },

  /* 10 */
  { t: 'Domain riêng + HTTPS', body: two(
    diagram({ w: 560, h: 420, nodes: [
      { id: 'r', x: 0, y: 0, w: 260, h: 80, t: 'Nhà đăng ký tên miền', d: 'cuongthai.dev (ví dụ)', c: 'vio' },
      { id: 'c', x: 300, y: 0, w: 260, h: 80, t: 'CNAME www', d: '→ cuonghoang1103.github.io', c: 'blu', mono: true },
      { id: 'a', x: 300, y: 110, w: 260, h: 96, t: 'A @ (apex)', d: '185.199.108.153\n… 109/110/111.153', c: 'blu', mono: true },
      { id: 's', x: 0, y: 190, w: 260, h: 96, t: 'Settings → Pages', d: 'Custom domain → Save\n☑ Enforce HTTPS', c: 'amb' },
      { id: 'l', x: 150, y: 330, w: 260, h: 80, t: '🔒 Let’s Encrypt', d: 'GitHub tự xin chứng chỉ', c: 'grn' },
    ], edges: [
      { from: 'r', to: 'c', c: 'blu' }, { from: 'r', to: 'a', c: 'blu', fs: 'b', ts: 'l' },
      { from: 's', to: 'l', c: 'grn', fs: 'b', ts: 't' },
    ] }),
    list([
      '<b>Subdomain</b> (<code>www</code>, <code>portfolio</code>): bản ghi <b>CNAME</b> trỏ về <code>&lt;user&gt;.github.io</code>',
      '<b>Apex</b> (<code>cuongthai.dev</code>): <b>4 bản ghi A</b> <code>185.199.108–111.153</code> (hoặc ALIAS/ANAME)',
      'Dùng workflow Actions ⇒ file <code>CNAME</code> trong repo <b>bị bỏ qua</b>, khai ở Settings là đủ',
      'Nên <b>xác minh tên miền</b> trước để tránh bị chiếm (takeover)',
      'Site <code>github.io</code> tự có HTTPS; domain riêng bật <b>Enforce HTTPS</b> khi chứng chỉ xong',
      'Domain riêng ⇒ đổi <code>base</code> về <code>\'/\'</code>',
    ]), 'r') + `<p style="font-size:14px;color:${G.mu};margin:6px 0 0">Theo docs.github.com, tính đến 09/2026.</p>` },

  /* 11 */
  { t: 'Giới hạn của GitHub Pages (tính đến 09/2026)', body: `
    ${kpis([
      { v: '1 GB', l: 'site đã xuất bản tối đa', c: 'blu' },
      { v: '1 GB', l: 'repo nguồn — mức khuyến nghị', c: 'tea' },
      { v: '100 GB', l: 'băng thông/tháng — giới hạn “mềm”', c: 'amb' },
      { v: '10 phút', l: 'một lần deploy quá lâu ⇒ timeout', c: 'git' },
    ])}
    <div style="height:14px"></div>
    ${two(
      list([
        '<b>10 lần build/giờ</b> (mềm) — KHÔNG áp dụng khi build bằng workflow Actions của mình',
        'Vượt quá có thể nhận <code>HTTP 429</code> hoặc email đề nghị dùng CDN',
        'Repo <b>public</b>: dùng Pages với gói Free · repo <b>private</b>: cần gói có trả phí (GitHub Pro — có trong Student Pack)',
      ]),
      box('bad', 'Pages <b>không</b> dùng để chạy shop, SaaS, hay nhận mật khẩu/số thẻ. Site Pages <b>luôn công khai</b> trên internet, kể cả khi repo private.') +
      box('info', 'Portfolio vài MB, vài trăm lượt xem/tháng thì còn rất xa mọi giới hạn.'))}` },

  /* 12 */
  { t: 'GitHub Student Developer Pack', body: `
    ${cards([
      { ic: '⭐', t: 'GitHub Pro', d: 'miễn phí khi còn là sinh viên — Pages cho repo private, hạn mức Codespaces mức Pro', c: 'amb' },
      { ic: '🤖', t: 'Copilot Student', d: 'gói Copilot miễn phí cho sinh viên đã xác minh (slide 14)', c: 'vio' },
      { ic: '🧠', t: 'JetBrains IDE', d: 'IntelliJ IDEA, PyCharm… gói sinh viên, gia hạn mỗi năm', c: 'blu' },
      { ic: '🌐', t: 'Tên miền', d: 'Namecheap: .me 1 năm · .TECH: 1 năm · Name.com: 1 tên miền (.dev, .app…)', c: 'grn' },
      { ic: '☁️', t: 'Cloud', d: 'Azure: $100 tín dụng (từ 18 tuổi) · Heroku: $13/tháng × 24 tháng · MongoDB Atlas: $50', c: 'tea' },
      { ic: '📚', t: 'Học', d: 'FrontendMasters 6 tháng · và nhiều ưu đãi khác — đọc điều kiện từng cái', c: 'pnk' },
    ], 3)}
    ${box('info', '<b>Điều kiện:</b> đang học chương trình có cấp bằng · từ 13 tuổi · có tài khoản GitHub cá nhân · <b>giấy tờ chứng minh</b> (thẻ SV có ngày, thời khoá biểu, bảng điểm, giấy xác nhận) + email trường nếu trường bạn bị yêu cầu. Đăng ký: <code>github.com/settings/education/benefits</code> (education.github.com, 09/2026).')}` },

  /* 13 */
  { t: 'Codespaces — máy dev trong trình duyệt', body: two(
    diagram({ w: 600, h: 440, nodes: [
      { id: 'br', x: 0, y: 20, w: 210, h: 76, t: '🌐 Trình duyệt', d: 'VS Code trên web', c: 'blu' },
      { id: 'vs', x: 0, y: 150, w: 210, h: 76, t: '💻 VS Code', d: 'máy bạn (extension)', c: 'blu' },
      { id: 'gh', x: 0, y: 280, w: 210, h: 76, t: 'gh codespace ssh', c: 'blu', mono: true },
      { id: 'ct', x: 280, y: 110, w: 290, h: 150, t: '🐳 Container', d: 'image từ devcontainer.json\nNode 22, npm ci sẵn\n/workspaces/portfolio', c: 'grn' },
      { id: 'pt', x: 280, y: 300, w: 290, h: 90, t: 'Cổng 5173', d: 'forward ⇒ link xem thử', c: 'amb', mono: true },
    ], edges: [
      { from: 'br', to: 'ct', c: 'blu' }, { from: 'vs', to: 'ct', c: 'blu', ts: 'l' }, { from: 'gh', to: 'ct', c: 'blu', ts: 'l' },
      { from: 'ct', to: 'pt', c: 'amb' },
    ] }).replace('</defs>', `</defs><rect x="252" y="2" width="344" height="434" rx="14" fill="rgba(110,118,129,.07)" stroke="${G.dim}" stroke-width="2" stroke-dasharray="9 7"/><text x="272" y="34" font-size="17" font-weight="700" fill="${G.mu}">☁️ Máy ảo Linux của GitHub</text>`) +
    `<p style="font-size:14px;color:${G.mu};margin:4px 0 0;text-align:right">máy ảo từ 2 lõi/8 GB RAM tới 32 lõi/128 GB RAM</p>`,
    kpis([
      { v: '120', l: 'giờ lõi/tháng · gói Free', c: 'blu' },
      { v: '180', l: 'giờ lõi/tháng · Pro (Student Pack)', c: 'grn' },
    ]) + `<div style="height:10px"></div>` +
    list([
      'Tính theo <b>giờ lõi</b>: máy 2 lõi tiêu 2 giờ lõi mỗi giờ ⇒ 120 ≈ <b>60 giờ</b> máy 2 lõi',
      'Lưu trữ: <b>15 GB-tháng</b> (Free) · <b>20 GB-tháng</b> (Pro)',
      'Hết hạn mức, không có thẻ ⇒ <b>bị chặn</b>, không tự trừ tiền',
      'Tự dừng sau <b>30 phút</b> không dùng; codespace dừng lâu bị xoá sau <b>30 ngày</b> (mặc định)',
    ]) + `<p style="font-size:14px;color:${G.mu};margin:6px 0 0">docs.github.com, 09/2026</p>`, 'r') },

  /* 14 */
  { t: 'Copilot cho sinh viên (tính đến 09/2026)', body: two(
    table(['Gói', 'Giá', 'Model', 'Agent'], [
      ['Copilot Free', '+miễn phí', 'tự chọn model', 'hạn chế'],
      ['!<b>Copilot Student</b>', '+miễn phí (SV đã xác minh)', 'tự chọn model', 'có — trừ agent bên thứ ba'],
      ['Copilot Pro', '$10/tháng', 'một số model', 'có'],
    ], { sm: true }) +
    box('info', 'Mọi gói có một hạn mức <b>GitHub AI Credits</b> mỗi tháng. GitHub <b>xét lại</b> tư cách sinh viên hằng tháng.'),
    steps([
      ['Được duyệt GitHub Education', 'thẻ SV / giấy tờ + email trường'],
      ['<code>github.com/settings/education/benefits</code>', 'mục tài nguyên cho SV → Learn more'],
      ['Làm theo hướng dẫn kích hoạt Copilot Student', 'chọn chính sách sử dụng'],
      ['Vẫn thấy trang trả tiền?', '<b>đừng mua</b> — quyền lợi có thể mất vài ngày mới áp dụng'],
    ]) +
    box('warn', 'Đồ án nộp chấm: đọc quy định dùng AI của môn. Code AI viết mà bạn không giải thích được là rủi ro khi vấn đáp.'), 'l') },

  /* 15 */
  { t: 'PR mã nguồn mở đầu tiên — cả hành trình', body: `
    ${flow([
      { e: '🏷', t: 'good first issue', d: 'lọc theo nhãn, repo còn hoạt động', c: 'grn' },
      { e: '💬', t: 'Hỏi trước', d: '“Mình nhận issue này được không?”', c: 'tea' },
      { e: '🍴', t: 'Fork + clone', d: 'origin = fork, upstream = gốc', c: 'blu' },
      { e: '🌿', t: 'Nhánh riêng', d: 'fix/12-… · có DCO thì <span style="white-space:nowrap">commit -s</span>', c: 'vio' },
      { e: '📬', t: 'PR nhỏ', d: 'Fixes #12 · mô tả + ảnh', c: 'amb' },
      { e: '🔁', t: 'Review', d: 'sửa theo góp ý, push tiếp', c: 'ora' },
      { e: '🎉', t: 'Merge', d: 'tên bạn vào lịch sử dự án', c: 'git' },
    ])}
    <div style="height:14px"></div>
    ${two(
      list([
        'Đọc <code>CONTRIBUTING.md</code> + <code>CODE_OF_CONDUCT.md</code> <b>trước</b> khi gõ dòng nào',
        '<b>DCO</b>: mỗi commit có dòng <code>Signed-off-by:</code> — thêm bằng <code style="white-space:nowrap">git commit -s</code>',
        '<b>CLA</b>: ký một lần qua bot trên PR đầu tiên',
        'Không ai trả lời sau 1–2 tuần ⇒ nhắc nhẹ một lần, hoặc chọn issue khác',
      ]),
      box('bad', 'Đừng: mở PR 2.000 dòng “refactor toàn bộ” không ai nhờ · sửa lỗi chính tả hàng loạt để “lấy contribution” · dán nguyên câu trả lời AI vào issue.'))}` },

  /* 16 */
  { t: 'Fork, upstream và đồng bộ — output thật', body: two(
    diagram({ w: 520, h: 440, nodes: [
      { id: 'u', x: 130, y: 0, w: 260, h: 84, t: 'upstream', d: 'kho gốc của dự án', c: 'git', mono: true },
      { id: 'f', x: 0, y: 330, w: 200, h: 84, t: 'origin', d: 'fork của bạn', c: 'blu', mono: true },
      { id: 'l', x: 320, y: 330, w: 200, h: 84, t: 'máy bạn', d: 'vi-date/', c: 'grn' },
    ], edges: [
      { from: 'u', to: 'l', c: 'git', t: 'git fetch upstream', ts: 't', fs: 'b', off: 20 },
      { from: 'l', to: 'f', c: 'blu', t: 'git push', off: -12 },
      { from: 'f', to: 'u', c: 'amb', t: 'Pull request', fs: 't', ts: 'b', off: 50, dash: true },
    ] }),
    `<style>.k16 .g-term pre{font-size:13px;line-height:1.32}</style><div class="k16">` + term([
      '$ git fetch upstream',
      ' * [new branch]      main       -> upstream/main',
      '$ git log --oneline --graph --all',
      '* e836157 docs: huong dan cai dat',
      '| * a9fee7e fix: hien thi Chu nhat day du (#12)',
      '|/',
      '* 8d37457 init',
      '$ git switch main',
      "Switched to branch 'main'",
      '$ git merge --ff-only upstream/main',
      '= Fast-forward',
      '$ git push origin main',
      '   8d37457..e836157  main -> main',
      '$ git switch fix/12-chu-nhat-day-du',
      '$ git rebase main',
      '= Successfully rebased and updated refs/heads/fix/12-chu-nhat-day-du.',
      '$ git push --force-with-lease origin fix/12-chu-nhat-day-du',
      '+ + a9fee7e...2cb8aac fix/12-chu-nhat-day-du -> fix/12-chu-nhat-day-du (forced update)',
    ], { title: 'git 2.51 — kho thử ch15-lab (cắt bớt dòng)', dir: '~/vi-date', branch: '' }) +
    `</div><p style="font-size:14.5px;color:${G.mu};margin:6px 0 0">Đường tắt bằng gh: <code>gh repo sync</code> (kéo từ repo cha về bản cục bộ) · <code style="white-space:nowrap">gh repo sync cuonghoang1103/vi-date</code> (đồng bộ fork trên GitHub).</p>`, 'r2') },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 15', body: table(['Muốn…', 'Làm / gõ'], [
    ['README hiện trên profile', 'repo public trùng tên tài khoản + <code>README.md</code> ở gốc'],
    ['Ghim dự án tốt nhất', 'profile → Customize your pins (tối đa 6)'],
    ['Người khác được dùng lại mã', 'thêm <code>LICENSE</code> (MIT…) — không có = không ai được dùng'],
    ['Portfolio Vite trên Pages', 'Source = GitHub Actions · <code>base: \'/&lt;repo&gt;/\'</code> · deploy-pages'],
    ['Link file public/ trong JSX', '<code>import.meta.env.BASE_URL + \'cv.pdf\'</code>'],
    ['Domain riêng', 'CNAME → <code>&lt;user&gt;.github.io</code> · A 185.199.108–111.153 · Enforce HTTPS'],
    ['Quyền lợi sinh viên', '<code>github.com/settings/education/benefits</code>'],
    ['Máy dev không cần cài', 'Code → Codespaces · <code>.devcontainer/devcontainer.json</code>'],
    ['Thêm kho gốc cho fork', '<code>git remote add upstream &lt;url&gt;</code>'],
    ['Đồng bộ fork', '<code>git fetch upstream</code> + <code>merge --ff-only</code> · hoặc <code>gh repo sync</code>'],
    ['Ký DCO cho commit', '<code>git commit -s</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 15 (90 phút)', body: `
    ${steps([
      ['Repo <code>&lt;user&gt;/&lt;user&gt;</code> + profile README 3 dòng, ghim 4–6 repo; viết lại README một đồ án (ảnh, demo, chạy thử, <b>phần mình làm</b>) + topics + LICENSE', 'hỏi nhóm trước khi public · xem profile ở cửa sổ ẩn danh'],
      ['Tạo <code>portfolio</code> bằng Vite, đặt <code>base</code>, thêm <code>deploy.yml</code>, chạy <code>actionlint</code>', 'Settings → Pages → Source = GitHub Actions'],
      ['Đăng ký Student Pack; mở portfolio trong Codespaces, chạy <code>npm run dev</code>', 'dừng codespace khi xong'],
      ['Tìm 1 <code>good first issue</code>, hỏi nhận, fork → nhánh → PR nhỏ', 'đồng bộ fork trước khi push'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>https://&lt;user&gt;.github.io/portfolio/</code> mở ra có nội dung (không trắng, không 404 trong DevTools), profile hiện README + ghim, và bạn có một PR mở (hoặc đã merge) trên một dự án không phải của mình.')}` },
]);
