/** Git & GitHub · Deck git-01 — Chương 1: Mô hình — ảnh chụp, không phải bản vá. */
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, code, mindmap, graph, trees, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-01', code: 'GIT · CHƯƠNG 1', title: 'Mô hình: ảnh chụp, không phải bản vá', sub: 'Git & GitHub · Chương 1' };

export const slides = S([
  cover({ t: 'Chương 1 — Mô hình của Git', sub: 'Ba cái cây · commit là tấm ảnh · vòng lặp add–commit · lời nhắn · .gitignore', chap: 'CHƯƠNG 1' }),

  { t: 'Bản đồ chương', body: mindmap('Mô hình Git', 'hiểu nó ⇒ đoán trước mọi lệnh', [
    { t: '1.1 Ba cái cây', d: 'Working dir · Index · HEAD — mỗi lệnh chạm cây nào', c: 'amb' },
    { t: '1.2 Commit là gì', d: 'ảnh chụp trọn dự án + cha + tác giả + mã băm', c: 'grn' },
    { t: '1.3 Vòng lặp hằng ngày', d: 'status → diff → add (-p) → commit', c: 'blu' },
    { t: '1.4 Lời nhắn commit', d: 'thể mệnh lệnh, nói VÌ SAO, Conventional Commits', c: 'vio' },
    { t: '1.5 .gitignore', d: 'thứ KHÔNG bao giờ được commit: .env, node_modules…', c: 'git' },
  ]) },

  { t: 'Ba cái cây — Git giữ BA bản của mỗi file', body: `
    ${trees({
      wd: [['app.js', 'M', 'amb'], 'README.md', ['.env', '??', 'red']],
      idx: [['app.js', 'cũ'], 'README.md', ['style.css', 'A', 'grn']],
      head: ['app.js', 'README.md'],
      arrows: [{ from: 0, to: 1, t: 'git add', up: true }, { from: 1, to: 2, t: 'git commit', up: true },
        { from: 1, to: 0, t: 'git restore', c: 'amb' }, { from: 2, to: 1, t: 'restore --staged', c: 'amb' }],
    })}
    ${box('info', '<b>Index</b> (còn gọi <b>staging area</b> — vùng chờ) là bản nháp của commit kế tiếp. <code>git commit</code> chụp đúng Index, <b>không</b> chụp thư mục làm việc.')}` },

  { t: 'git status là tấm bản đồ ba cây', body: two(
    term(['$ git status', 'On branch main', 'Changes to be committed:', '= \tnew file:   style.css', 'Changes not staged for commit:', '! \tmodified:   app.js', 'Untracked files:', '! \t.env', '$ git status -s', ' M app.js', 'A  style.css', '?? .env'], { title: 'output thật — git 2.51' }),
    table(['Ký hiệu', 'Nghĩa là'], [
      ['<code>A&nbsp;</code> cột 1', 'Đã vào Index (sẽ có trong commit)'],
      ['<code>&nbsp;M</code> cột 2', 'Sửa ở thư mục làm việc, CHƯA add'],
      ['<code>MM</code>', 'Add rồi lại sửa tiếp — hai phiên bản khác nhau'],
      ['<code>??</code>', 'Chưa theo dõi (untracked) — Git chưa từng thấy'],
    ], { sm: true }), 'l') },

  { t: 'Một commit là một TẤM ẢNH trọn dự án', body: two(
    diagram({ w: 560, h: 420, nodes: [
      { id: 'c', x: 150, y: 10, w: 260, h: 96, t: 'commit 583d925', d: 'tác giả · thời điểm\nlời nhắn', c: 'grn', mono: true },
      { id: 'p', x: 330, y: 170, w: 210, h: 70, t: 'cha: 1a2b3c4', d: 'commit trước đó', c: 'dim', dash: true, mono: true },
      { id: 't', x: 20, y: 170, w: 220, h: 70, t: 'tree 3389050', d: 'ảnh chụp thư mục gốc', c: 'blu', mono: true },
      { id: 'b1', x: 0, y: 320, w: 160, h: 64, t: 'blob app.js', c: 'amb', mono: true },
      { id: 'b2', x: 190, y: 320, w: 180, h: 64, t: 'blob README', c: 'amb', mono: true },
    ], edges: [{ from: 'c', to: 't', c: 'blu' }, { from: 'c', to: 'p', c: 'dim', dash: true }, { from: 't', to: 'b1', c: 'amb' }, { from: 't', to: 'b2', c: 'amb' }] }),
    `${list(['<b>tree</b> = ảnh chụp toàn bộ thư mục, không phải danh sách thay đổi', '<b>parent</b> = con trỏ về commit trước ⇒ lịch sử là một sợi xích', 'File không đổi ⇒ trỏ lại <b>đúng blob cũ</b> — không tốn thêm chỗ'])}
    ${box('tip', 'Tự xem: <code>git cat-file -p HEAD</code>')}`, 'r') },

  { t: 'Mã băm: đổi MỘT byte là đổi cả tên', body: `
    ${flow([
      { e: '📄', t: 'Nội dung commit', d: 'tree + cha + tác giả + lời nhắn', c: 'blu' },
      { e: '⚙️', t: 'SHA-1', d: 'hàm băm → 40 ký tự hex', c: 'vio' },
      { e: '🔖', t: '583d925…', d: 'tên của commit = dấu vân tay nội dung', c: 'grn' },
    ])}
    ${graph({ w: 1100, h: 250, y0: 50, dx: 200, dy: 120, lanes: [{ lane: 0, n: 'trước', c: 'dim' }, { lane: 1, n: 'sau', c: 'git' }], commits: [
      { id: 'a1', x: 0, lane: 1, t: 'không đổi', c: 'grn' },
      { id: 'b2', x: 1, p: ['a1'], ghost: true }, { id: 'c3', x: 2, p: ['b2'], ghost: true }, { id: 'd4', x: 3, p: ['c3'], ghost: true },
      { id: 'f7', x: 1, lane: 1, p: ['a1'], t: 'sửa lời nhắn', hl: true, c: 'git' },
      { id: '9e', x: 2, lane: 1, p: ['f7'], t: 'nội dung y hệt c3', c: 'git' }, { id: '4b', x: 3, lane: 1, p: ['9e'], t: 'nội dung y hệt d4', c: 'git' },
    ], refs: [{ to: '4b', n: 'main' }] })}
    ${box('warn', 'Sửa một commit cũ ⇒ nó mang tên mới ⇒ <b>mọi commit con cháu cũng đổi tên</b>. Đó là vì sao “viết lại lịch sử đã push” làm khổ cả nhóm (Chương 8).')}` },

  { t: 'Lịch sử = chuỗi ảnh chụp nối bằng con trỏ cha', body: `
    ${graph({ w: 1100, h: 230, y0: 110, dx: 200, arrows: true, commits: [
      { id: 'A', x: 0, t: 'khởi tạo' }, { id: 'B', x: 1, p: ['A'], t: 'thêm login' },
      { id: 'C', x: 2, p: ['B'], t: 'sửa lỗi form' }, { id: 'D', x: 3, p: ['C'], t: 'thêm CSS', hl: true },
    ], refs: [{ to: 'D', n: 'main' }, { to: 'D', n: 'HEAD', k: 'head' }] })}
    ${box('info', 'Mũi tên đi từ <b>con về cha</b> — Git chỉ biết “tôi sinh ra từ ai”, không biết “ai sinh ra từ tôi”. <code>HEAD</code> → <code>main</code> → <code>D</code>: “bạn đang đứng ở đây”.')}` },

  { t: 'Gọi tên commit mà không gõ 40 ký tự', body: table(['Cách viết', 'Trỏ tới', 'Ví dụ dùng'], [
    ['<code>583d925</code>', 'Tiền tố mã băm (≥ 4 ký tự, đủ để không trùng)', '<code>git show 583d925</code>'],
    ['<code>HEAD</code>', 'Commit bạn đang đứng', '<code>git show HEAD</code>'],
    ['<code>HEAD~1</code> / <code>HEAD~3</code>', 'Cha / cụ ba đời, đi theo cha thứ nhất', '<code>git diff HEAD~3</code>'],
    ['<code>HEAD^2</code>', 'Cha THỨ HAI của một commit merge', '<code>git show HEAD^2</code>'],
    ['<code>main</code>, <code>v1.2.0</code>', 'Nhánh / tag — tên người đọc được', '<code>git log main</code>'],
    ['<code>main@{yesterday}</code>', 'Vị trí của nhánh hôm qua (theo reflog)', '<code>git diff main@{1}</code>'],
  ]) },

  { t: 'Vòng lặp bạn sẽ chạy mười nghìn lần', body: `
    ${flow([
      { e: '✏️', t: 'Sửa mã', d: 'trong editor', c: 'amb' },
      { e: '🔎', t: 'git status', d: 'đang ở đâu?', c: 'blu' },
      { e: '🧐', t: 'git diff', d: 'đã đổi những gì?', c: 'vio' },
      { e: '➕', t: 'git add -p', d: 'chọn TỪNG khúc', c: 'grn' },
      { e: '📸', t: 'git commit', d: 'chụp Index', c: 'git' },
    ])}
    ${table(['Lệnh', 'So sánh giữa', 'Trả lời câu hỏi'], [
      ['<code>git diff</code>', 'Working dir ↔ Index', 'Tôi đã sửa gì mà CHƯA add?'],
      ['<code>git diff --staged</code>', 'Index ↔ HEAD', 'Commit sắp tới sẽ chứa gì?'],
      ['<code>git diff HEAD</code>', 'Working dir ↔ HEAD', 'Tổng cộng khác gì so với commit cuối?'],
    ], { sm: true })}` },

  { t: 'Đọc một diff trong 10 giây', body: two(
    code(`diff --git a/app.js b/app.js
index 1ac74b4..7728117 100644
--- a/app.js
+++ b/app.js
@@ -1 +1 @@
-console.log("hi")
+console.log("hello")`, 'diff'),
    list(['<code>--- a/</code> bản cũ · <code>+++ b/</code> bản mới', '<code>@@ -1 +1 @@</code> = khúc (hunk): từ dòng 1 của bản cũ, dòng 1 của bản mới', 'Dòng <b style="color:#ff8b96">-</b> bị bỏ · dòng <b style="color:#7ee787">+</b> được thêm', '<code>git add -p</code> hỏi bạn <b>từng khúc</b>: y (lấy) · n (bỏ) · s (chẻ nhỏ) · e (sửa tay)']), 'l') },

  { t: 'git add -p: một file, hai commit gọn gàng', body: vs({
    no: { t: 'git add . rồi commit một cục', items: ['“fix bug + đổi tên biến + thêm log debug”', 'Người review không tách được ý', 'Muốn revert phần sửa lỗi thì kéo theo cả phần đổi tên'] },
    yes: { t: 'git add -p theo từng ý', items: ['Commit 1: <code>fix: chặn email rỗng ở form đăng ký</code>', 'Commit 2: <code>refactor: đổi tên usr → user</code>', 'Log debug: nhấn <b>n</b>, không bao giờ vào lịch sử'] },
  }) },

  { t: 'Lời nhắn commit dùng được sau một năm', body: two(
    code(`fix(auth): chặn đăng nhập khi email chưa xác minh

Trước đây người dùng bấm "Đăng nhập" ngay sau khi
đăng ký vẫn vào được, vì middleware chỉ kiểm mật khẩu.
Giờ trả 403 kèm lý do để frontend hiện nút gửi lại mail.

Closes #42`, 'plaintext'),
    `${steps([['Dòng tiêu đề ≤ 50–72 ký tự, thể mệnh lệnh', '“thêm”, “sửa”, “bỏ” — như ra lệnh cho mã'], ['Một dòng trống', 'công cụ dựa vào nó để tách tiêu đề'], ['Thân: VÌ SAO, không phải CÁI GÌ', 'cái gì đã có trong diff'], ['Chân: liên kết issue', '<code>Closes #42</code> tự đóng issue khi merge']])}`, 'l') },

  { t: 'Conventional Commits — cấu trúc máy đọc được', body: `
    ${cards([
      { ic: '✨', t: 'feat:', d: 'tính năng mới → tăng MINOR (1.2 → 1.3)', c: 'grn' },
      { ic: '🐛', t: 'fix:', d: 'sửa lỗi → tăng PATCH (1.2.0 → 1.2.1)', c: 'git' },
      { ic: '♻️', t: 'refactor:', d: 'đổi cấu trúc, không đổi hành vi', c: 'blu' },
      { ic: '📝', t: 'docs: / test: / chore:', d: 'tài liệu · kiểm thử · việc lặt vặt', c: 'vio' },
      { ic: '💥', t: 'feat!: hoặc BREAKING CHANGE:', d: 'phá tương thích → tăng MAJOR (1.x → 2.0)', c: 'amb' },
      { ic: '🎯', t: 'fix(auth):', d: 'phạm vi trong ngoặc — module bị chạm', c: 'tea' },
    ])}
    ${box('tip', 'Máy đọc được ⇒ tự sinh CHANGELOG và tự đánh số phiên bản (Chương 7).')}` },

  { t: '.gitignore — bốn nhóm KHÔNG BAO GIỜ commit', body: two(
    code(`# 1. Bí mật
.env
.env.*
!.env.example

# 2. Thứ tải về được
node_modules/

# 3. Thứ build ra
dist/
.next/

# 4. Rác của máy / editor
.DS_Store
.vscode/`, 'bash'),
    `${box('bad', '<b>Luật làm ai cũng vấp:</b> .gitignore chỉ tác dụng với file <b>CHƯA</b> theo dõi. Lỡ commit <code>.env</code> rồi thì thêm vào .gitignore cũng không gỡ được — phải <code>git rm --cached .env</code>.')}
    ${box('tip', 'Hỏi Git vì sao một file bị bỏ qua: <code>git check-ignore -v .env</code>')}
    ${box('warn', 'Khoá API đã lọt lên GitHub = coi như đã lộ. <b>Đổi khoá trước</b>, dọn lịch sử sau (Chương 8).')}`, 'r') },

  { t: 'Bảng tra nhanh Chương 1', body: table(['Muốn…', 'Gõ'], [
    ['Biết mình đang ở đâu', '<code>git status</code> · <code>git status -s</code>'],
    ['Xem thay đổi chưa add / đã add', '<code>git diff</code> · <code>git diff --staged</code>'],
    ['Đưa từng khúc vào Index', '<code>git add -p</code>'],
    ['Gỡ khỏi Index (giữ nguyên file)', '<code>git restore --staged app.js</code>'],
    ['Bỏ thay đổi chưa add (MẤT thật)', '<code>git restore app.js</code>'],
    ['Commit có tiêu đề + thân', '<code>git commit</code> (mở editor)'],
    ['Ngừng theo dõi file đã lỡ commit', '<code>git rm --cached .env</code>'],
    ['Nhìn bên trong một commit', '<code>git cat-file -p HEAD</code>'],
  ], { sm: true }) },

  { t: 'Thực hành chương 1 (30 phút)', body: `
    ${steps([
      ['Tạo kho <code>thu-git</code>, 3 file, commit đầu tiên', 'chạy <code>git status -s</code> sau MỖI lệnh, đoán trước rồi mới nhìn'],
      ['Sửa một file ở HAI chỗ không liên quan', 'dùng <code>git add -p</code> tách thành 2 commit, lời nhắn theo Conventional Commits'],
      ['Tạo <code>.env</code> rồi lỡ commit nó', 'gỡ bằng <code>git rm --cached</code> + .gitignore, kiểm bằng <code>git check-ignore -v</code>'],
      ['Mở commit bằng <code>git cat-file -p HEAD</code>', 'lần theo tree → blob, tìm lại nội dung app.js'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>git log --oneline</code> có ≥ 4 commit, mỗi commit MỘT ý, và <code>git status</code> sạch mà .env vẫn nằm trên đĩa.')}` },
]);
