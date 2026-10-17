/** Git & GitHub · Deck git-17 — Khởi động nhanh: làm việc nhóm trên GitHub từ số 0 (Windows + Mac).
 *  Câu chuyện thật 16–17/10/2026: nhóm PRJ301 (Long trưởng nhóm `longbh2006`, Khoa, Anh Tú — Windows; Cường — Mac).
 *  Mọi output git là output THẬT của git 2.51.1 chạy trong kho thử /tmp/kdsb2 với HOME tạm (không đụng ~/.gitconfig
 *  thật); remote "GitHub" là một kho bare cục bộ nối qua url.insteadOf ⇒ đường dẫn "file:///tmp/kdsb2/gh/" được in
 *  lại thành "https://github.com/" (thay chuỗi, không sửa chữ khác). Thông báo chỉ có trên Windows / chỉ GitHub mới in
 *  (GCM, 403, GH007, Filename too long, SSL…) chép đúng dạng Git for Windows / GitHub in ra, đối chiếu 10/2026.
 *  Giao diện GitHub / Credential Manager / NetBeans / CT Work KHÔNG có ảnh chụp ⇒ vẽ lại bằng HTML theo đúng tên nút.
 */
import { S, cover, cards, box, steps, table, vs, flow, two, list, code, mindmap, graph, term, diagram, conflict, G } from './_git-chung.mjs';

export const deck = { key: 'git-17', code: 'GIT · KHỞI ĐỘNG NHANH', title: 'Làm việc nhóm trên GitHub từ số 0', sub: 'Git & GitHub · Khởi động nhanh' };

/* ─────────────── mảnh ghép wireframe (vẽ lại, không phải ảnh chụp) ─────────────── */
const mono = 'font-family:SF Mono,Menlo,monospace';
const win = (title, body, { w = '100%', c = G.bd } = {}) => `<div style="width:${w};border:1.5px solid ${c};border-radius:12px;overflow:hidden;background:#0f141b;text-align:left">` +
  `<div style="background:#161b22;border-bottom:1px solid ${G.bd};padding:7px 12px;font-size:14px;color:${G.mu};display:flex;gap:8px;align-items:center">` +
  `<i style="width:11px;height:11px;border-radius:50%;background:#ff5f57;display:inline-block"></i><i style="width:11px;height:11px;border-radius:50%;background:#febc2e;display:inline-block"></i><i style="width:11px;height:11px;border-radius:50%;background:#28c840;display:inline-block"></i>` +
  `<span style="margin-left:8px">${title}</span></div><div style="padding:14px 16px">${body}</div></div>`;
const btn = (t, bg = '#238636', fg = '#fff') => `<span style="display:inline-block;background:${bg};color:${fg};font-weight:700;font-size:15px;border-radius:6px;padding:6px 14px">${t}</span>`;
const badge = (n) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:${G.git};color:#fff;font-weight:800;font-size:14px;flex:none">${n}</span>`;
const field = (lab, val, n) => `<div style="margin:6px 0"><div style="font-size:13px;color:${G.mu};font-weight:700;display:flex;gap:6px;align-items:center">${n ? badge(n) : ''}${lab}</div>` +
  `<div style="border:1px solid ${G.bd};border-radius:6px;padding:5px 9px;background:#0d1117;${mono};font-size:14px;color:#e6edf3;margin-top:3px">${val}</div></div>`;

export const slides = S([
  cover({ t: 'Khởi động nhanh — Làm việc nhóm trên GitHub từ số 0', sub: 'Windows + Mac · cài đặt · danh tính · đăng nhập · tạo repo · mời · clone · vòng lặp mỗi ngày · lỗi thật · CT Work', chap: 'KHỞI ĐỘNG NHANH' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Nhóm lên GitHub', 'từ máy trắng tới Pull Request đầu tiên', [
    { t: 'KĐ.1–2 Máy của mỗi người', d: 'cài Git · Git Bash/Terminal · tên + email · autocrlf', c: 'amb' },
    { t: 'KĐ.3 Đăng nhập GitHub', d: 'GCM trên Windows · gh trên Mac · lỗi 403 sai tài khoản', c: 'blu' },
    { t: 'KĐ.4–5 Trưởng nhóm', d: 'tạo repo private · .gitignore · push · mời thành viên', c: 'git' },
    { t: 'KĐ.6 Thành viên lấy code', d: 'clone MỘT lần (không tải ZIP) · mở đúng thư mục', c: 'grn' },
    { t: 'KĐ.7–8 Mỗi ngày', d: 'main → pull → nhánh thẻ → commit → push → PR → merge', c: 'vio' },
    { t: 'KĐ.9–10 Lỗi & CT Work', d: '15+ lỗi thật · webhook · mã thẻ NT-21 · Đóng góp', c: 'tea' },
  ]) },

  /* 3 */
  { t: 'Chuyện thật 16–17/10: một buổi tối, bảy cái bẫy', body: table(['Ai', 'Gặp gì', 'Vì sao', 'Bài'], [
    ['Long (Windows)', '<code>key does not contain a section</code>', 'gõ <code>git config --global longbh2006</code> — thiếu tên khoá', 'KĐ.2'],
    ['Khoa (Windows)', '<code>gh auth login</code> đứng im', 'gh không đi kèm Git; menu không chạy trong Git Bash (mintty)', 'KĐ.3'],
    ['Khoa', 'push bị <b>403</b>', 'Windows nhớ một tài khoản GitHub KHÁC', 'KĐ.3'],
    ['Long', '<code>invalid reference: main</code>', 'repo đang tên <code>master</code>', 'KĐ.4'],
    ['Cả nhóm', 'package mới không thấy', 'Git không lưu thư mục RỖNG', 'KĐ.4'],
    ['Anh Tú', '"pull được mà NetBeans vẫn code cũ"', 'mở bản ZIP, không mở bản clone', 'KĐ.6'],
    ['Ai cũng hỏi', '<code>cd</code> làm gì? <code>-u</code> là gì? việc nào làm một lần?', 'chưa ai vẽ ra bức tranh', 'KĐ.7'],
  ], { sm: true }) },

  /* 4 — KĐ.1 */
  { t: 'Ba cửa sổ lệnh trên Windows — chọn Git Bash', body: table(['', 'Git Bash', 'CMD', 'PowerShell', 'Terminal (Mac)'], [
    ['Có sẵn?', 'cài cùng Git for Windows', 'có sẵn', 'có sẵn', 'có sẵn (zsh)'],
    ['Xem đang ở đâu', '<code>pwd</code>', '<code>cd</code>', '<code>pwd</code>', '<code>pwd</code>'],
    ['Liệt kê file', '<code>ls</code> · <code>ls -a</code>', '<code>dir</code>', '<code>ls</code> (bí danh)', '<code>ls</code> · <code>ls -a</code>'],
    ['Đường dẫn', '<code>/c/Code/prj301-nhom</code>', '<code>C:\\Code\\prj301-nhom</code>', '<code>C:\\Code\\...</code>', '<code>~/Code/prj301-nhom</code>'],
    ['Lệnh trong khoá chạy nguyên văn?', '+có', '-không (<code>ls</code>, <code>~</code>, <code>/c/…</code>)', '!gần như', '+có'],
    ['Menu của <code>gh auth login</code>', '!dễ treo ⇒ <code>winpty</code>', '+chạy', '+chạy', '+chạy'],
  ], { sm: true }) },

  /* 5 */
  { t: 'Trình cài Git for Windows — 6 màn hình đáng dừng lại', body: steps([
    ['Choosing the default editor', 'đổi Vim ⇒ <b>Visual Studio Code</b> hoặc <b>Nano</b> (khỏi kẹt trong Vim)'],
    ['Adjusting the name of the initial branch', 'chọn <b>Override…</b> và gõ <code>main</code>'],
    ['Adjusting your PATH environment', 'giữ <b>Git from the command line and also from 3rd-party software</b> — NetBeans/VS Code mới thấy git'],
    ['Choosing HTTPS transport backend', 'Wi-Fi trường hay lỗi SSL ⇒ <b>native Windows Secure Channel</b>'],
    ['Configuring the line ending conversions', 'giữ <b>Checkout Windows-style, commit Unix-style</b> (= <code>core.autocrlf true</code>)'],
    ['Choose a credential helper', 'giữ <b>Git Credential Manager</b> — nó lo đăng nhập GitHub ở KĐ.3'],
  ]) },

  /* 6 */
  { t: 'Mở terminal ĐÚNG thư mục — đúng một nửa số lỗi', body: two(
    term(['$ pwd', '/c/Users/Lenovo', '$ mkdir -p /c/Code', '$ cd /c/Code', '$ pwd', '/c/Code', '$ git status', '! fatal: not a git repository (or any of the parent directories): .git', '# đúng — /c/Code chưa phải kho git, chưa clone gì'], { title: 'Git Bash — Windows (Lenovo@DESKTOP MINGW64)', branch: '', dir: '' }),
    `${list(['Windows: chuột phải <b>trong</b> thư mục → (Win 11: <b>Show more options</b>) → <b>Open Git Bash here</b>', 'Mac: kéo thư mục thả vào cửa sổ Terminal sau chữ <code>cd </code> → Enter', 'Để code ở <code>C:\\Code</code> / <code>~/Code</code> — <b>không</b> ở Desktop/Documents đang đồng bộ OneDrive/iCloud'])}
    ${box('tip', 'Lạc? <code>pwd</code> (đang ở đâu) · <code>ls</code> (có gì) · <code>git status</code> (có phải kho git không)')}`, 'l') },

  /* 7 — KĐ.2 */
  { t: 'Email commit lấy từ đâu? Từ GitHub, không phải tự nghĩ', body: two(
    win('github.com/settings/emails', `
      <div style="font-size:19px;font-weight:800;color:#fff;margin-bottom:8px">Emails</div>
      <div style="${mono};font-size:15px;color:#e6edf3;border:1px solid ${G.bd};border-radius:6px;padding:7px 10px">longbh2006@gmail.com <span style="color:${G.mu};font-family:system-ui;font-size:13px">· Primary · Private</span></div>
      <div style="margin-top:12px;font-size:15px;color:#e6edf3">☑ <b>Keep my email addresses private</b> ${badge(1)}</div>
      <div style="font-size:14px;color:${G.mu};margin:4px 0 0 22px">We'll use <span style="${mono};color:${G.amb}">12345678+longbh2006@users.noreply.github.com</span> ${badge(2)}</div>
      <div style="margin-top:12px;font-size:15px;color:#e6edf3">☑ <b>Block command line pushes that expose my email</b> ${badge(3)}</div>`),
    `${steps([['Bật giữ kín email', 'GitHub cấp một địa chỉ <code>noreply</code>'], ['Chép đúng địa chỉ đó', 'dạng <code>ID+username@users.noreply.github.com</code>'], ['Ô thứ ba bật ⇒ commit mang Gmail thật bị chặn', '<code>GH007: Your push would publish a private email address</code>']])}
    ${box('good', '<code>git config --global user.email "12345678+longbh2006@users.noreply.github.com"</code>')}`, 'r') },

  /* 8 */
  { t: '"key does not contain a section" — Git đọc lệnh thế nào', body: two(
    term(['$ git config --global longbh2006', '! error: key does not contain a section: longbh2006', '$ git config --global user name "Bui Hoang Long"', '! error: key does not contain a section: user', '$ git config --global user.name "Bui Hoang Long"', '$ git config --global user.name', '= Bui Hoang Long'], { title: 'output thật — git 2.51.1', branch: '', dir: '~' }),
    `${table(['Phần', 'Ví dụ', 'Nghĩa'], [
      ['phạm vi', '<code>--global</code>', 'máy này, mọi kho'],
      ['khoá', '<code>user.name</code>', '<b>mục.tên</b> — bắt buộc có dấu chấm'],
      ['giá trị', '<code>"Bui Hoang Long"</code>', 'có khoảng trắng ⇒ ngoặc kép'],
    ], { sm: true })}
    ${box('bad', 'Username GitHub (<code>longbh2006</code>) <b>không</b> phải một khoá cấu hình. Git chỉ cần <b>tên hiển thị</b> + <b>email</b>; đăng nhập là việc của KĐ.3.')}`, 'r') },

  /* 9 */
  { t: 'Cấu hình MỘT LẦN cho mỗi máy', body: table(['Lệnh', 'Windows (Git Bash)', 'Mac (Terminal)', 'Để làm gì'], [
    ['<code>user.name</code>', '"Nguyen Dang Khoa"', '"Hoang Cuong"', 'tên in trên mỗi commit'],
    ['<code>user.email</code>', '!email noreply của Khoa', '!email noreply của Cường', 'GitHub nối commit ↔ tài khoản'],
    ['<code>init.defaultBranch</code>', '<code>main</code>', '<code>main</code>', 'kho mới tên main, khớp GitHub'],
    ['<code>core.autocrlf</code>', '+<code>true</code>', '+<code>input</code>', 'xuống dòng: kho luôn lưu LF (14.4)'],
    ['<code>pull.rebase</code>', '<code>false</code>', '<code>false</code>', 'pull = fetch + merge, không hỏi vặt'],
    ['<code>core.longpaths</code>', '<code>true</code>', '— (không cần)', 'đường dẫn Java dài &gt; 260 ký tự'],
  ], { sm: true }) },

  /* 10 — KĐ.3 */
  { t: 'Đăng nhập GitHub qua HTTPS — mật khẩu không còn dùng được', body: diagram({ w: 1160, h: 430, nodes: [
    { id: 'git', x: 0, y: 170, w: 220, h: 90, t: 'git push', d: 'cần chứng minh\nbạn là ai', c: 'amb', mono: true },
    { id: 'gcm', x: 330, y: 30, w: 330, h: 100, t: 'Windows: Git Credential Manager', d: 'đi kèm Git for Windows\ncửa sổ "Sign in with your browser"', c: 'blu' },
    { id: 'gh', x: 330, y: 300, w: 330, h: 100, t: 'Mac: gh auth login', d: 'brew install gh\nmã một lần XXXX-XXXX', c: 'vio' },
    { id: 'gb', x: 780, y: 170, w: 210, h: 90, t: 'Trình duyệt', d: 'đăng nhập github.com\nbấm Authorize', c: 'grn' },
    { id: 'kc', x: 780, y: 320, w: 380, h: 80, t: 'Két giữ token', d: 'Windows Credential Manager · macOS Keychain', c: 'tea' },
  ], edges: [
    { from: 'git', to: 'gcm', c: 'blu', ts: 'l' }, { from: 'git', to: 'gh', c: 'vio', ts: 'l' },
    { from: 'gcm', to: 'gb', c: 'grn' }, { from: 'gh', to: 'gb', c: 'grn' },
    { from: 'gb', to: 'kc', c: 'tea', t: 'token', fs: 'b', ts: 't' },
  ] }) },

  /* 11 */
  { t: 'Lần push đầu trên Windows: cửa sổ này hiện ra', body: two(
    win('Git Credential Manager', `
      <div style="text-align:center"><div style="font-size:24px;font-weight:800;color:#fff">GitHub</div><div style="font-size:16px;color:${G.mu};margin:2px 0 14px">Sign in</div>
      <div style="display:flex;gap:18px;justify-content:center;font-size:14px;color:${G.mu};border-bottom:1px solid ${G.bd};padding-bottom:6px;margin-bottom:14px"><b style="color:#fff;border-bottom:2px solid ${G.git};padding-bottom:4px">Browser/Device</b><span>Token</span></div>
      <div style="display:flex;flex-direction:column;gap:10px;align-items:center">${btn('Sign in with your browser')} ${badge(1)}<span style="font-size:14px;color:${G.blu}">Sign in with a code</span></div>
      <div style="font-size:13px;color:${G.mu};margin-top:14px">Don't have an account? Sign up</div></div>`, { w: '440px' }),
    `${steps([['Bấm <b>Sign in with your browser</b>', 'trình duyệt mở github.com'], ['Đăng nhập ĐÚNG tài khoản của bạn', 'nhìn avatar góc phải trước khi bấm'], ['Bấm <b>Authorize</b> cho Git Credential Manager', 'quay lại Git Bash — lệnh push tự chạy tiếp'], ['Từ đó về sau không hỏi nữa', 'token nằm trong Windows Credential Manager']])}`, 'r') },

  /* 12 */
  { t: 'gh trên Windows: không có sẵn, và menu treo trong Git Bash', body: two(
    term(['$ gh auth login', '! bash: gh: command not found', '# cài: winget install --id GitHub.cli  (hoặc file .msi ở cli.github.com)', '# rồi ĐÓNG và MỞ LẠI Git Bash', '$ gh auth login', '+ ? Where do you use GitHub?  [Use arrows to move…]', '! (mũi tên không chạy, Enter không chạy — mintty)', '$ winpty gh auth login', '= ? Where do you use GitHub? GitHub.com'], { title: 'Git Bash — Windows', branch: '', dir: '/c/Code' }),
    `${box('info', '<code>gh</code> là <b>GitHub CLI</b> — chương trình RIÊNG, không đi kèm Git for Windows.')}
    ${list(['Cách 1: <code>winpty gh auth login</code>', 'Cách 2: chạy <code>gh auth login</code> trong <b>PowerShell</b> hoặc Windows Terminal', 'Cách 3 (đơn giản nhất): <b>bỏ qua gh</b> — Git Credential Manager tự hỏi ở lần push đầu'])}`, 'l') },

  /* 13 */
  { t: 'Push bị 403? Máy đang nhớ một tài khoản GitHub khác', body: `
    ${term(['$ git push -u origin nt-34-dang-nhap', '! remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu.', "! fatal: unable to access 'https://github.com/longbh2006/prj301-nhom.git/': The requested URL returned error: 403"], { title: 'Git Bash — Windows', branch: 'nt-34-dang-nhap', dir: '/c/Code/prj301-nhom' })}
    ${two(box('warn', '<b>Windows:</b> Control Panel → <b>Credential Manager</b> → <b>Windows Credentials</b> → mục <code>git:https://github.com</code> → <b>Remove</b>. Hoặc trong CMD: <code>cmdkey /delete:git:https://github.com</code>'),
      box('warn', '<b>Mac:</b> mở <b>Keychain Access</b> → tìm <code>github.com</code> → xoá mục <i>Internet password</i>. Dùng gh thì: <code>gh auth logout</code> rồi <code>gh auth login</code>'))}
    ${box('tip', 'Push lại ⇒ cửa sổ đăng nhập hiện lần nữa ⇒ chọn đúng tài khoản. Kiểm: <code>gh auth status</code> / <code>git credential-manager github list</code>')}` },

  /* 14 — KĐ.4 */
  { t: 'Trưởng nhóm tạo repo — hai cách, chọn MỘT', body: two(
    `${box('info', '<b>Cách 1 — trên github.com</b> (dấu <b>+</b> → <b>New repository</b>)')}
    ${list(['Tên <code>prj301-nhom</code> · chọn <b>Private</b>', '<b>Tích</b> "Add README" ⇒ repo đã có 1 commit ⇒ trưởng nhóm <b>clone</b> về, chép code vào, rồi commit + push', '<b>Không tích</b> ⇒ repo rỗng ⇒ GitHub hiện sẵn khối lệnh "…or push an existing repository from the command line"'])}`,
    `${box('good', '<b>Cách 2 — code đã có sẵn ở máy</b>')}
    ${list(['<code>git init</code> → <code>.gitignore</code> → <code>git add .</code> → <code>git commit</code>', 'tạo repo <b>rỗng</b> trên web (không README)', '<code>git remote add origin https://github.com/longbh2006/prj301-nhom.git</code>', '<code>git branch -M main</code> · <code>git push -u origin main</code>', 'hoặc một lệnh: <code>gh repo create prj301-nhom --private --source . --push</code>'])}
    ${box('bad', 'Đừng vừa tích README vừa <code>git init</code> + commit ở máy ⇒ hai lịch sử (slide sau).')}`) },

  /* 15 */
  { t: 'Tích README rồi lại git init ở máy = hai lịch sử không chung gốc', body: two(
    graph({ r: 36, w: 560, h: 330, y0: 80, dx: 150, dy: 140, x0: 80, lanes: [], commits: [
      { id: '5a22ac7', x: 1, lane: 0, t: 'Initial commit (GitHub)', c: 'blu' },
      { id: 'e5c0957', x: 1, lane: 1, t: 'NT-1 khởi tạo (máy Long)', c: 'git' },
      { id: 'ed7d6ab', x: 2.6, lane: 0, p: ['5a22ac7', 'e5c0957'], t: 'commit merge', star: true, c: 'grn' },
    ], refs: [{ to: '5a22ac7', n: 'origin/main (cũ)', k: 'remote' }, { to: 'e5c0957', n: 'main (cũ)', side: 'down' }, { to: 'ed7d6ab', n: 'main' }] }),
    term(['$ git push -u origin main', '!  ! [rejected]        main -> main (fetch first)', '$ git pull --no-rebase origin main', '! fatal: refusing to merge unrelated histories', '$ git pull --no-rebase origin main --allow-unrelated-histories --no-edit', "Merge made by the 'ort' strategy.", '= create mode 100644 README.md', '$ git push -u origin main', '=    5a22ac7..ed7d6ab  main -> main'], { title: 'output thật — git 2.51.1', dir: '~/Code/prj301-readme' }), 'r') },

  /* 16 */
  { t: '.gitignore cho dự án NetBeans + Maven — và db.properties', body: two(
    code(`# Maven / NetBeans — sinh ra khi build
target/
build/
dist/
nbproject/private/
*.class

# Bí mật: mật khẩu SQL Server từng máy
src/main/resources/db.properties

# Rác hệ điều hành
.DS_Store
Thumbs.db`, 'bash'),
    `${box('bad', '<code>db.properties</code> chứa <code>db.password</code> SQL Server của từng máy — <b>không bao giờ commit</b>. Lỡ lên GitHub là phải đổi mật khẩu.')}
    ${box('good', 'Commit <code>db.properties.example</code> (đủ khoá, để trống mật khẩu). Mỗi bạn chép thành <code>db.properties</code> rồi điền.')}
    ${box('tip', 'Kiểm: <code>git check-ignore -v src/main/resources/db.properties</code> ⇒ <code>.gitignore:9:…</code>')}`, 'l') },

  /* 17 */
  { t: 'Package mới không hiện? Git không lưu thư mục RỖNG', body: two(
    term(['$ ls src/main/java/com/nhom/', 'controller  dao  model', '$ git ls-files', '.gitignore', 'pom.xml', 'src/main/java/com/nhom/controller/LoginServlet.java', 'src/main/resources/db.properties.example', '# dao/ và model/ KHÔNG có trong kho', '$ touch src/main/java/com/nhom/dao/.gitkeep src/main/java/com/nhom/model/.gitkeep', '$ git status --short', '+ ?? src/main/java/com/nhom/dao/', '+ ?? src/main/java/com/nhom/model/'], { title: 'output thật — git 2.51.1', dir: '~/Code/prj301-nhom' }),
    `${list(['Git lưu <b>file</b>; thư mục chỉ là đường dẫn của file', 'NetBeans tạo package = tạo thư mục rỗng ⇒ <code>git status</code> im lặng', 'Cách 1: đặt file <code>.gitkeep</code> (tên quy ước, rỗng)', 'Cách 2 (tốt hơn): tạo luôn một class thật, vd <code>UserDAO.java</code>'])}`, 'l') },

  /* 18 */
  { t: 'master hay main? Hỏi Git trước khi đổi', body: two(
    term(['$ git switch main', '! fatal: invalid reference: main', '$ git branch', '* master', '$ git branch -m master main', '$ git branch', '* main', '$ git branch -m master main', "! fatal: no branch named 'master'", '# lần 2 báo lỗi vì đã là main rồi — vô hại'], { title: 'output thật — git 2.51.1', branch: '', dir: '~/Code/thu-master' }),
    `${list(['<code>git init</code> trên máy chưa đặt <code>init.defaultBranch</code> ⇒ nhánh tên <b>master</b>', 'GitHub tạo repo mới ⇒ nhánh tên <b>main</b>', '<b>Luôn</b> gõ <code>git branch</code> trước: dấu <code>*</code> chỉ nhánh đang đứng', '<code>git branch -M main</code> trong 3 lệnh của GitHub làm đúng việc này'])}
    ${box('tip', 'Đặt một lần: <code>git config --global init.defaultBranch main</code>')}`, 'l') },

  /* 19 — KĐ.5 */
  { t: 'Mời thành viên: 5 bước, 2 người', body: `
    ${flow([
      { e: '⚙️', t: 'Settings', d: 'tab trên cùng của repo (chỉ chủ repo thấy)', c: 'git' },
      { e: '👥', t: 'Collaborators', d: 'mục Access ở thanh trái', c: 'blu' },
      { e: '➕', t: 'Add people', d: 'gõ username: khoa-nd, anhtu-tran…', c: 'amb' },
      { e: '⏳', t: 'Pending invite', d: 'chờ bạn chấp nhận — hết hạn sau 7 ngày', c: 'vio' },
      { e: '✅', t: 'Accept invitation', d: 'qua email hoặc github.com/notifications', c: 'grn' },
    ])}
    ${box('warn', 'Thành viên mở link repo thấy <b>404</b>? Chưa nhận lời mời, hoặc đang đăng nhập nhầm tài khoản. Repo private giả vờ "không tồn tại" với người ngoài.')}` },

  /* 20 */
  { t: 'Collaborator làm được gì trên repo của trưởng nhóm', body: two(
    table(['Việc', 'Collaborator', 'Chủ repo'], [
      ['clone, pull, push nhánh', '+được', '+được'],
      ['mở / review / merge PR', '+được', '+được'],
      ['mời người khác', '-không', '+được'],
      ['webhook (CT Work, KĐ.10)', '-không', '+được'],
      ['đổi tên, xoá repo, đổi private/public', '-không', '+được'],
    ], { sm: true }),
    `${box('info', 'Repo của <b>tài khoản cá nhân</b>: collaborator luôn có quyền ghi — không có mức "chỉ đọc".')}
    ${box('tip', 'Khoá <code>main</code> (branch protection) trên repo <b>private</b> cần GitHub Pro — Student Developer Pack tặng Pro (15.3). Gói Free: dựa vào kỷ luật "mọi thứ qua PR".')}`, 'l') },

  /* 21 — KĐ.6 */
  { t: 'Clone một lần — đừng tải ZIP (chuyện của Tú)', body: vs({
    no: { t: 'Code → Download ZIP', items: ['Ra thư mục <code>prj301-nhom-main</code> — <b>không có .git</b>', '<code>git status</code> ⇒ <code>fatal: not a git repository</code>', 'Không pull được, không push được', 'Tú mở bản ZIP trong NetBeans, còn <code>git pull</code> thì cập nhật bản clone ở chỗ khác ⇒ "pull rồi mà code vẫn cũ"'] },
    yes: { t: 'git clone https://github.com/longbh2006/prj301-nhom.git', items: ['Tải <b>code + toàn bộ lịch sử + đường nối origin</b>', 'Làm <b>một lần</b> cho mỗi máy, mỗi dự án', '<code>cd prj301-nhom</code> rồi mới gõ lệnh git', 'Mở <b>chính thư mục này</b> trong NetBeans / VS Code — và xoá bản ZIP đi'] },
  }) },

  /* 22 */
  { t: 'Sau khi clone: ba lệnh kiểm, một file tự tạo', body: two(
    term(['$ git clone https://github.com/longbh2006/prj301-nhom.git', "Cloning into 'prj301-nhom'...", 'Receiving objects: 100% (26/26), done.', '$ cd prj301-nhom', '$ git status', 'On branch main', "= Your branch is up to date with 'origin/main'.", '$ git remote -v', 'origin\thttps://github.com/longbh2006/prj301-nhom.git (fetch)', 'origin\thttps://github.com/longbh2006/prj301-nhom.git (push)', '$ cp src/main/resources/db.properties.example src/main/resources/db.properties', '$ git status --short', '# không in gì: db.properties đã bị .gitignore bỏ qua'], { title: 'output thật — git 2.51.1 · bắt đầu ở /c/Code', dir: '', branch: '' }),
    `${steps([['NetBeans: <b>File → Open Project</b>', 'chọn thư mục có <code>pom.xml</code> trong <code>C:\\Code\\prj301-nhom</code>'], ['VS Code: <b>File → Open Folder</b>', 'cùng thư mục đó'], ['Điền <code>db.password</code> của máy mình', 'trong <code>db.properties</code> vừa chép']])}`, 'l') },

  /* 23 — KĐ.7 */
  { t: 'Việc nào làm MỘT LẦN, việc nào làm MỖI NGÀY', body: table(['Tầng', 'Việc', 'Ai', 'Bao lâu một lần'], [
    ['<b>Mỗi máy</b>', 'cài Git · <code>user.name/email</code> · <code>autocrlf</code> · đăng nhập GitHub', 'từng người', '!một lần cho máy đó'],
    ['<b>Mỗi dự án</b>', 'tạo repo · .gitignore · mời · webhook CT Work', 'trưởng nhóm', '!một lần cho dự án đó'],
    ['<b>Mỗi dự án × mỗi máy</b>', '<code>git clone</code> · tạo <code>db.properties</code> · mở trong NetBeans', 'từng người', '!một lần'],
    ['<b>Mỗi thẻ việc</b>', 'nhánh <code>nt-34-…</code> → commit → push → PR → merge', 'người nhận thẻ', '+vài lần một tuần'],
    ['<b>Mỗi buổi ngồi code</b>', '<code>git switch main</code> · <code>git pull</code>', 'mọi người', '+mỗi ngày'],
  ], { sm: true }) },

  /* 24 */
  { t: 'Ba hình ảnh để nhớ: cuốn sổ chung, tờ nháp, thư viện', body: diagram({ w: 1160, h: 450, nodes: [
    { id: 'lib', x: 400, y: 0, w: 360, h: 110, t: '🏛  Thư viện = GitHub (origin)', d: 'nơi cả nhóm cùng gửi và lấy\norigin = biệt danh địa chỉ thư viện', c: 'blu' },
    { id: 'so', x: 0, y: 200, w: 340, h: 110, t: '📒 Cuốn sổ chung = main', d: 'chỉ chép vào khi đã duyệt (PR)\nai cũng chép lại bản mới: git pull', c: 'grn' },
    { id: 'nhap', x: 820, y: 200, w: 340, h: 110, t: '📝 Tờ nháp = nhánh nt-34-…', d: 'mỗi thẻ một tờ, viết thoải mái\ngit switch -c · commit', c: 'amb' },
    { id: 'pr', x: 400, y: 340, w: 360, h: 100, t: '🙋 Pull Request', d: 'xin chép tờ nháp vào sổ chung\nbạn đọc (review) → merge', c: 'vio' },
  ], edges: [
    { from: 'lib', to: 'so', t: 'git pull', c: 'grn', fs: 'l', ts: 't' },
    { from: 'nhap', to: 'lib', t: 'git push -u', c: 'amb', fs: 't', ts: 'r' },
    { from: 'nhap', to: 'pr', c: 'vio', fs: 'b', ts: 'r' },
    { from: 'pr', to: 'so', t: 'merge', c: 'grn', fs: 'l', ts: 'b' },
  ] }) },

  /* 25 */
  { t: 'Vòng lặp của MỘT thẻ việc — chạy thật', body: `
    ${graph({ r: 34, w: 1100, h: 260, y0: 75, dx: 190, dy: 110, x0: 110, lanes: [{ lane: 0, n: 'main', c: 'grn' }, { lane: 1, n: 'nhánh', c: 'amb' }], commits: [
      { id: 'f24c332', x: 0, t: 'NT-1 .gitkeep', c: 'grn' },
      { id: 'e505e0c', x: 1.5, lane: 1, p: ['f24c332'], t: 'NT-34 form đăng nhập', c: 'amb', hl: true },
      { id: '7d5fb09', x: 3.2, p: ['f24c332', 'e505e0c'], t: 'Merge pull request #1', star: true, c: 'grn' },
    ], refs: [{ to: 'e505e0c', n: 'nt-34-dang-nhap' }, { to: '7d5fb09', n: 'main' }, { to: '7d5fb09', n: 'origin/main', k: 'remote', side: 'down' }] })}
    ${flow([
      { e: '1', t: 'git switch main · git pull', d: 'đứng trên sổ chung, chép bản mới nhất', c: 'grn' },
      { e: '2', t: 'git switch -c nt-34-dang-nhap', d: 'tờ nháp mới, tên có mã thẻ', c: 'amb' },
      { e: '3', t: 'git add . · git commit -m "NT-34 …"', d: 'chụp ảnh việc vừa làm', c: 'amb' },
      { e: '4', t: 'git push -u origin nt-34-dang-nhap', d: 'gửi lên GitHub, mở Pull Request', c: 'blu' },
      { e: '5', t: 'Merge → switch main → pull → branch -d', d: 'dọn tờ nháp, về sổ chung', c: 'vio' },
    ])}` },

  /* 26 */
  { t: 'origin, -u, upstream — ba chữ hay bị hỏi nhất', body: two(
    term(['$ git push', '! fatal: The current branch nt-34-dang-nhap has no upstream branch.', '! To push the current branch and set the remote as upstream, use', '', '!     git push --set-upstream origin nt-34-dang-nhap', '$ git push -u origin nt-34-dang-nhap', '=  * [new branch]      nt-34-dang-nhap -> nt-34-dang-nhap', "= branch 'nt-34-dang-nhap' set up to track 'origin/nt-34-dang-nhap'."], { title: 'output thật — git 2.51.1', branch: 'nt-34-dang-nhap', dir: '/c/Code/prj301-nhom' }),
    table(['Chữ', 'Nghĩa'], [
      ['<code>origin</code>', 'biệt danh của URL repo trên GitHub — <code>git clone</code> tự đặt'],
      ['<code>-u</code>', 'viết tắt <code>--set-upstream</code>: "nhớ cặp nhánh này"'],
      ['upstream', 'nhánh trên GitHub mà nhánh máy bạn "đi cặp"; có rồi thì <code>git push</code>/<code>git pull</code> trần là đủ'],
      ['<code>-u</code> khi nào?', '<b>lần push đầu</b> của mỗi nhánh mới; các lần sau bỏ đi'],
    ], { sm: true }), 'l') },

  /* 27 — KĐ.8 */
  { t: 'Lấy code của bạn: pull trên main, rồi merge main vào nhánh mình', body: `
    ${graph({ r: 34, w: 1100, h: 270, y0: 75, dx: 175, dy: 120, x0: 110, lanes: [{ lane: 0, n: 'main', c: 'grn' }, { lane: 1, n: 'nt-40', c: 'vio' }], commits: [
      { id: 'f24c332', x: 0, t: 'NT-1', c: 'grn' },
      { id: '423d421', x: 1.2, lane: 1, p: ['f24c332'], t: 'NT-40 tiêu đề', c: 'vio' },
      { id: '7d5fb09', x: 2, p: ['f24c332'], t: 'PR #1 (Khoa)', star: true, c: 'grn' },
      { id: 'a1999ac', x: 3, p: ['7d5fb09'], t: 'PR #2 (Long)', star: true, c: 'grn' },
      { id: '83112ca', x: 4.3, lane: 1, p: ['423d421', 'a1999ac'], t: 'merge main vào nt-40', star: true, c: 'vio', hl: true },
    ], refs: [{ to: 'a1999ac', n: 'main' }, { to: '83112ca', n: 'nt-40-trang-chu' }] })}
    ${two(box('info', '<b>Bước 1:</b> <code>git switch main</code> → <code>git pull</code> — main ở máy bạn đuổi kịp GitHub (tua thẳng, không xung đột).'),
      box('info', '<b>Bước 2:</b> <code>git switch nt-40-trang-chu</code> → <code>git merge main</code> — đem việc của bạn bè vào tờ nháp của mình, giải xung đột ở MÁY MÌNH.'))}` },

  /* 28 */
  { t: '"Already up to date" mà NetBeans vẫn cũ? Kiểm 6 bước', body: steps([
    ['Đúng thư mục chưa?', 'NetBeans: chuột phải project → <b>Properties</b> xem đường dẫn; phải trùng thư mục bạn vừa <code>git pull</code> (không phải <code>prj301-nhom-main</code> từ ZIP)'],
    ['Đúng nhánh chưa?', '<code>git branch</code> — dấu <code>*</code> ở <code>main</code> hay ở nhánh của bạn?'],
    ['GitHub đã có code đó chưa?', 'bạn kia đã push và PR đã merge? <code>git log --oneline -3 origin/main</code>'],
    ['Đổi <code>pom.xml</code>?', 'chuột phải project → <b>Build with Dependencies</b> (tải thư viện mới)'],
    ['Đổi Java/JSP?', '<b>Clean and Build</b>, rồi chạy lại Tomcat'],
    ['Đổi <code>setup.sql</code>?', 'mở trong <b>SSMS</b> → <b>Execute</b> lại — Git không chạm vào database'],
  ]) },

  /* 29 */
  { t: 'Xung đột đầu tiên: hai người sửa cùng một dòng', body: two(
    conflict({ before: ['<html>', '<body>'], ours: ['<h1>Cửa hàng sách PRJ301</h1>'], theirs: ['<h1>BookStore - Trang chủ</h1>'], oursName: 'HEAD', theirsName: 'main', after: ['</body>', '</html>'], fs: 17 }),
    `${term(['$ git merge main', 'Auto-merging src/main/webapp/index.jsp', '! CONFLICT (content): Merge conflict in src/main/webapp/index.jsp', '! Automatic merge failed; fix conflicts and then commit the result.'], { title: 'output thật', branch: 'nt-40-trang-chu', dir: '/c/Code/prj301-nhom' })}
    ${steps([['Sửa file: giữ dòng đúng, <b>xoá cả 3 dòng dấu</b>', '<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> <code>=======</code> <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>'], ['<code>git add src/main/webapp/index.jsp</code>', 'báo "đã giải xong"'], ['<code>git commit --no-edit</code>', 'hoàn tất merge']])}`, 'r') },

  /* 30 — KĐ.9 */
  { t: 'Bảng lỗi thật (1/2) — đọc dòng lỗi, tra ở đây', body: table(['Bạn thấy', 'Nghĩa là', 'Sửa'], [
    ["<code>'git' is not recognized…</code> / <code>command not found</code>", 'chưa cài, hoặc cửa sổ mở TRƯỚC khi cài', 'cài Git, đóng & mở lại terminal'],
    ['<code>not a git repository</code>', 'đứng sai thư mục (hoặc bản ZIP)', '<code>cd</code> vào thư mục clone'],
    ['<code>key does not contain a section</code>', 'thiếu <code>user.</code> trong khoá', '<code>git config --global user.name "…"</code>'],
    ['<code>invalid reference: main</code>', 'nhánh tên master / chưa có commit', '<code>git branch</code> rồi <code>-m master main</code>'],
    ['<code>403</code> · <code>denied to &lt;người khác&gt;</code>', 'két nhớ tài khoản cũ', 'xoá mục github.com (KĐ.3)'],
    ['<code>Repository not found</code>', 'chưa nhận lời mời / sai URL / sai tài khoản', 'Accept invitation, kiểm <code>git remote -v</code>'],
    ['<code>Password authentication is not supported</code>', 'gõ mật khẩu GitHub vào terminal', 'đăng nhập bằng trình duyệt (GCM/gh)'],
    ['<code>GH007: …private email address</code>', 'commit mang Gmail thật', 'đặt email noreply rồi <code>git commit --amend --reset-author</code>'],
  ], { sm: true }) },

  /* 31 */
  { t: 'Bảng lỗi thật (2/2)', body: table(['Bạn thấy', 'Nghĩa là', 'Sửa'], [
    ['<code>! [rejected] … (fetch first)</code>', 'GitHub có commit bạn chưa có', '<code>git pull</code> rồi push lại — và đừng push thẳng main'],
    ['<code>has no upstream branch</code>', 'nhánh mới chưa đi cặp', '<code>git push -u origin &lt;nhánh&gt;</code>'],
    ['<code>There is no tracking information</code>', '<code>git pull</code> trên nhánh chưa push lần nào', 'pull trên main, rồi <code>git merge main</code>'],
    ['<code>Your local changes … would be overwritten</code>', 'còn sửa dở chưa commit', 'commit (hoặc <code>git stash</code>) rồi pull'],
    ['<code>refusing to merge unrelated histories</code>', 'tích README + <code>git init</code> riêng', '<code>--allow-unrelated-histories</code> (một lần)'],
    ['<code>Filename too long</code> (Windows)', 'đường dẫn &gt; 260 ký tự', '<code>git config --global core.longpaths true</code>'],
    ['<code>SSL certificate problem</code> (Wi-Fi trường)', 'mạng chèn chứng chỉ riêng', '<code>git config --global http.sslBackend schannel</code>'],
    ['<code>nothing to commit, working tree clean</code>', 'không có gì mới — KHÔNG phải lỗi', 'đã commit rồi? đã lưu file chưa?'],
  ], { sm: true }) },

  /* 32 — KĐ.10 */
  { t: 'Nối GitHub với CT Work: một webhook cho mỗi dự án', body: diagram({ w: 1160, h: 450, nodes: [
    { id: 'adm', x: 0, y: 0, w: 360, h: 110, t: '① Admin dự án CT Work', d: 'Cài đặt dự án → GitHub\n→ Kết nối GitHub ⇒ Payload URL + Secret', c: 'tea' },
    { id: 'own', x: 0, y: 300, w: 360, h: 120, t: '② Chủ repo (Long) trên GitHub', d: 'Settings → Webhooks → Add webhook\napplication/json · Secret\nPushes · Branch or tag creation · Pull requests', c: 'git' },
    { id: 'gh', x: 470, y: 170, w: 260, h: 100, t: 'GitHub', d: 'mỗi push / nhánh / PR\nPOST tới Payload URL', c: 'blu' },
    { id: 'card', x: 840, y: 0, w: 320, h: 120, t: 'Thẻ NT-21', d: 'mục Phát triển (Development):\nnhánh · commit · PR có chữ NT-21', c: 'grn' },
    { id: 'rep', x: 840, y: 300, w: 320, h: 120, t: 'Báo cáo → Đóng góp', d: 'đếm commit / PR từng người\n(khớp username, email noreply)', c: 'vio' },
  ], edges: [
    { from: 'adm', to: 'own', t: 'gửi riêng URL + Secret', c: 'tea', fs: 'b', ts: 't' },
    { from: 'own', to: 'gh', c: 'git', fs: 'r', ts: 'b' },
    { from: 'gh', to: 'card', c: 'grn', fs: 't', ts: 'l' },
    { from: 'gh', to: 'rep', c: 'vio', fs: 'b', ts: 'l' },
  ] }) },

  /* 33 */
  { t: 'Mã thẻ phải nằm trong tên — CT Work chỉ tìm chữ NT-21', body: two(
    table(['Chỗ đặt', 'Ví dụ ✓', 'Thẻ nhận được'], [
      ['tên nhánh', '<code>nt-21-trang-chu</code>', 'nhánh (hoa/thường đều được)'],
      ['lời nhắn commit', '<code>NT-21 trang chủ + bảng Users</code>', 'commit'],
      ['tiêu đề / mô tả PR', '<code>NT-21: Trang chủ</code>', 'PR · trạng thái open/merged'],
      ['-không có mã', '<code>sua loi</code>, <code>update</code>', '-không thẻ nào (vẫn đếm Đóng góp)'],
    ], { sm: true }),
    `${box('warn', 'Webhook chỉ nhận sự kiện <b>từ lúc được tạo</b> — commit cũ không tự hiện. Cài webhook <b>trước</b> khi cả nhóm bắt đầu code.')}
    ${box('info', 'Dự án mới, nhóm mới ⇒ làm lại KĐ.4 → KĐ.6 <b>và</b> webhook. Cấu hình máy (KĐ.1–3) thì giữ nguyên.')}`, 'l') },

  /* 34 */
  { t: 'Bảng tra nhanh — Khởi động nhanh', body: table(['Muốn…', 'Gõ (Git Bash = Terminal, trừ chỗ ghi riêng)'], [
    ['Đặt tên + email (một lần/máy)', '<code>git config --global user.name "…"</code> · <code>user.email "…noreply…"</code>'],
    ['Xuống dòng', 'Windows <code>core.autocrlf true</code> · Mac <code>core.autocrlf input</code>'],
    ['Xem cấu hình + nguồn', '<code>git config --list --show-origin</code>'],
    ['Lấy dự án về (một lần)', '<code>git clone &lt;URL&gt;</code> → <code>cd prj301-nhom</code>'],
    ['Bắt đầu một thẻ', '<code>git switch main</code> · <code>git pull</code> · <code>git switch -c nt-34-…</code>'],
    ['Lưu + gửi', '<code>git add .</code> · <code>git commit -m "NT-34 …"</code> · <code>git push -u origin nt-34-…</code>'],
    ['Lấy việc bạn vào nhánh mình', '<code>git switch main</code> · <code>git pull</code> · <code>git switch nt-34-…</code> · <code>git merge main</code>'],
    ['Kiểm đăng nhập', '<code>gh auth status</code> · <code>git credential-manager github list</code> (Windows)'],
  ], { sm: true }) },

  /* 35 */
  { t: 'Thực hành cả nhóm (60 phút, ngồi cùng nhau)', body: `
    ${steps([
      ['Mỗi người: <code>git --version</code>, đặt tên + email noreply + autocrlf', '<code>git config --global --list</code> chụp màn hình gửi nhóm'],
      ['Trưởng nhóm: repo private + .gitignore + db.properties.example, push, mời', 'mọi người bấm Accept, mở link repo không còn 404'],
      ['Admin CT Work + chủ repo: cài webhook TRƯỚC khi code', 'Recent Deliveries của webhook có dấu ✓ (ping)'],
      ['Mỗi người: clone vào <code>C:\\Code</code> / <code>~/Code</code>, mở trong NetBeans, chạy được', '<code>git remote -v</code> trỏ đúng repo của trưởng nhóm'],
      ['Mỗi người một thẻ: nhánh <code>nt-…</code> → commit → push → PR → trưởng nhóm merge', 'cố ý để hai bạn sửa cùng <code>index.jsp</code> ⇒ giải xung đột; thẻ hiện commit ở mục Phát triển'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>git log --oneline --graph</code> trên main có ≥ 4 "Merge pull request", và không ai phải tải ZIP.')}` },
]);
