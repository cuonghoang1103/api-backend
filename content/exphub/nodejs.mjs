/**
 * Exp Hub guide — cài đặt môi trường Node.js (tiếng Việt).
 * Khoá Courses "Node.js" bài 0.3 trỏ tới /exp-hub/nodejs-cai-dat-moi-truong.
 * Seed: node scripts/exphub-seed-guide.mjs --file ./content/exphub/nodejs.mjs --apply
 */
export default {
  category: { slug: 'cuongthai-moi-truong-dev', name: 'CuongThai — Cài đặt môi trường dev', icon: '🧰' },
  snippet: {
    slug: 'nodejs-cai-dat-moi-truong',
    title: 'Node.js — Cài đặt môi trường (nvm / fnm, VS Code) cho Windows, macOS, Linux',
    kind: 'NOTE',
    language: 'bash',
    status: 'PUBLISHED',
    description: 'Hướng dẫn cài Node.js đúng cách bằng trình quản lý phiên bản (nvm / fnm / nvm-windows), kiểm tra máy đã sẵn sàng, cấu hình VS Code và xử lý các lỗi cài đặt thường gặp.',
    referenceUrl: 'https://nodejs.org/en/download',
    codeBlocks: [
      {
        name: 'macOS / Linux — cài nvm rồi cài Node 22 LTS',
        language: 'bash',
        code: `# 1. Cài nvm (trình quản lý phiên bản Node)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 2. ĐÓNG terminal, MỞ CỬA SỔ MỚI (bắt buộc), rồi:
nvm install 22
nvm use 22
nvm alias default 22     # đặt làm mặc định cho mọi terminal sau này

# 3. Kiểm tra
node -v      # v22.x.x
npm -v`,
      },
      {
        name: 'Windows — nvm-windows hoặc fnm',
        language: 'powershell',
        code: `# Cách A — fnm (nhanh, cài bằng winget)
winget install Schniz.fnm
fnm install 22
fnm use 22

# Cách B — nvm-windows: tải bộ cài nvm-setup.exe ở link bên dưới,
# cài xong MỞ PowerShell MỚI bằng quyền Administrator rồi chạy:
nvm install 22.21.0
nvm use 22.21.0

# Kiểm tra
node -v
npm -v`,
      },
      {
        name: 'Kiểm tra máy đã sẵn sàng (chạy thử)',
        language: 'bash',
        code: `node -v
npm -v
node -p "process.versions.v8"     # engine JavaScript bên trong Node
node -p "process.versions.uv"     # libuv — thư viện tạo ra event loop

# Chạy thử một chương trình
echo 'console.log("Node chay ok:", process.version)' > check.js
node check.js`,
      },
      {
        name: 'Đổi qua lại giữa nhiều phiên bản Node',
        language: 'bash',
        code: `nvm ls                 # xem các bản đang có trong máy
nvm install 20         # cài thêm Node 20
nvm use 20             # đổi sang 20 cho terminal hiện tại
nvm use 22             # đổi lại 22

# Ghim phiên bản cho 1 dự án: tạo file .nvmrc ở thư mục gốc
echo "22" > .nvmrc
nvm use                # tự đọc .nvmrc`,
      },
    ],
    noteContent: `
<span class="eyebrow">Hướng dẫn cài đặt · Node.js</span>
<h2>Cài đặt môi trường Node.js</h2>
<p class="lead">Để lập trình Node.js bạn cần đúng 2 thứ: <strong>Node.js</strong> (bộ chạy JavaScript ngoài trình duyệt, đã kèm sẵn npm) và một <strong>trình soạn thảo</strong> (VS Code). Toàn bộ việc cài chỉ mất khoảng 10 phút.</p>

<div class="callout warn"><strong>Đọc kỹ chỗ này trước khi tải:</strong> đừng cài Node bằng bộ cài trên nodejs.org. Hãy cài qua <strong>trình quản lý phiên bản</strong> (nvm / fnm). Lý do: mỗi dự án thật thường ghim một phiên bản Node khác nhau; có trình quản lý thì đổi phiên bản chỉ mất một câu lệnh, còn cài kiểu thường thì phải gỡ ra cài lại — và hai bản Node cùng nằm trong PATH sẽ gây lỗi rất khó hiểu.</div>

<h3>Bước 1 — Chọn cách cài theo hệ điều hành</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">macOS / Linux</div><div class="lz-t">nvm</div><div class="lz-d">Chuẩn phổ biến nhất, cài bằng 1 dòng curl</div></div>
  <div class="lz-step"><div class="lz-k">Windows</div><div class="lz-t">fnm hoặc nvm-windows</div><div class="lz-d">nvm bản Linux KHÔNG chạy trên Windows</div></div>
  <div class="lz-step"><div class="lz-k">Cả hai</div><div class="lz-t">Node 22 LTS</div><div class="lz-d">Bản số chẵn = hỗ trợ dài hạn</div></div>
</div>
<p>Xem các khối lệnh ở phần <strong>Code</strong> bên dưới trang này — có sẵn lệnh cho từng hệ điều hành, copy chạy là được.</p>

<h3>Bước 2 — Chọn đúng phiên bản</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nên dùng</span><span class="v">Node 22 LTS (bản số CHẴN = Long Term Support, được vá lỗi ~3 năm)</span></div>
  <div class="kv"><span class="k">Tránh</span><span class="v">Bản số LẺ (21, 23) — mang tính thử nghiệm, không dùng cho sản phẩm thật</span></div>
  <div class="kv"><span class="k">Đã hết hạn</span><span class="v">Node 16, 18 — không còn nhận bản vá bảo mật</span></div>
</div>

<h3>Bước 3 — Kiểm tra đã cài thành công</h3>
<p>Mở terminal mới và chạy 3 lệnh trong khối "Kiểm tra máy đã sẵn sàng". Kết quả đúng trông như sau:</p>
<div class="out">v22.21.0
10.9.4
12.4.254.21-node.33
1.51.0</div>
<p>Nếu cả 4 dòng đều ra số thì máy bạn đã sẵn sàng. Dòng thứ 3 là phiên bản <strong>V8</strong> (engine JavaScript của Chrome nằm trong Node), dòng thứ 4 là <strong>libuv</strong> — thư viện tạo nên event loop.</p>

<h3>Bước 4 — Cài VS Code và 4 extension nên có</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ESLint</span><span class="v">Bắt bug thật ngay lúc gõ: biến thừa, quên await, code không bao giờ chạy tới</span></div>
  <div class="kv"><span class="k">Prettier</span><span class="v">Tự căn chỉnh code khi lưu file</span></div>
  <div class="kv"><span class="k">REST Client</span><span class="v">Gửi request HTTP thử API ngay trong editor, khỏi mở Postman</span></div>
  <div class="kv"><span class="k">Error Lens</span><span class="v">Hiện lỗi ngay trên dòng code thay vì giấu dưới panel</span></div>
</div>

<h3>Các lỗi hay gặp &amp; cách xử lý</h3>
<div class="pitfall"><strong>"nvm: command not found" sau khi cài xong.</strong> Bộ cài đã ghi thêm cấu hình vào file khởi động shell, nhưng cửa sổ terminal đang mở KHÔNG đọc lại file đó. → Đóng hẳn cửa sổ terminal và mở cửa sổ mới. Nếu vẫn lỗi, kiểm tra file <code>~/.zshrc</code> (macOS) hoặc <code>~/.bashrc</code> (Linux) xem có mấy dòng NVM_DIR chưa.</div>
<div class="pitfall"><strong>"'node' is not recognized" trên Windows.</strong> Node chưa vào PATH. → Mở PowerShell MỚI (PATH chỉ được nạp khi mở cửa sổ mới). Nếu vẫn lỗi, chạy lại <code>fnm use 22</code> hoặc <code>nvm use 22.21.0</code> bằng quyền Administrator.</div>
<div class="pitfall"><strong>Máy có sẵn Node cũ cài từ nodejs.org.</strong> → Gỡ bản đó trong Apps &amp; Features (Windows) hoặc <code>brew uninstall node</code> (macOS) TRƯỚC khi dùng nvm/fnm. Hai bản Node cùng lúc sẽ khiến <code>node -v</code> và <code>npm -v</code> báo hai nơi khác nhau.</div>
<div class="pitfall"><strong>npm báo lỗi quyền (EACCES) khi cài gói toàn cục.</strong> → Đây chính là triệu chứng của việc cài Node kiểu thường. Dùng nvm/fnm thì Node nằm trong thư mục người dùng nên không bao giờ cần <code>sudo npm install -g</code>. Nếu đang lỡ như vậy, cài lại bằng nvm là hết.</div>

<h3>Tải về — link chính chủ</h3>
<a class="link-card dl" href="https://nodejs.org/en/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nodejs.org — trang tải chính thức</span><span class="lc-sub">Xem phiên bản LTS hiện hành và hướng dẫn cài theo từng hệ điều hành</span></span>
  <span class="lc-cta">TẢI VỀ</span>
</a>
<a class="link-card dl" href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nvm (macOS / Linux)</span><span class="lc-sub">Trình quản lý phiên bản Node phổ biến nhất — kèm lệnh cài đặt</span></span>
  <span class="lc-cta">TẢI VỀ</span>
</a>
<a class="link-card dl" href="https://github.com/coreybutler/nvm-windows/releases" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">nvm-windows</span><span class="lc-sub">Bộ cài nvm-setup.exe dành riêng cho Windows</span></span>
  <span class="lc-cta">TẢI VỀ</span>
</a>
<a class="link-card dl" href="https://code.visualstudio.com/download" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">Visual Studio Code</span><span class="lc-sub">Trình soạn thảo dùng xuyên suốt khoá học</span></span>
  <span class="lc-cta">TẢI VỀ</span>
</a>

<div class="note-ct">Mẹo giữ máy sạch về sau: mỗi dự án nên có file <code>.nvmrc</code> ghi phiên bản Node của nó. Vào thư mục dự án gõ <code>nvm use</code> là tự nhảy đúng bản — khỏi phải nhớ dự án nào chạy Node mấy.</div>
`,
  },
};
