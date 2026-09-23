/**
 * Git & GitHub · Deck git-13 — Chương 13: Cứu hộ & Git trong quy trình thật.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1) của "phòng thí nghiệm thảm hoạ"
 * — đúng script `tham-hoa.sh` in trong bài 13.1 (ngày giờ cố định ⇒ mã băm tái lập được trên mọi máy):
 *   ffd4504 khởi tạo · 563e067 form đăng nhập (chung cho cả 5 kho)
 *   1-nham-nhanh: a48c3cd feat(cart)          2-reset-hard: 639a6d1 fix(auth) · 3f0e87c test(auth)
 *   3-xoa-nhanh:  96c9e91 feat(payment)       4-merge-nham: 44e950f docs · c5a76d6 wip · 2554c23 merge
 *   5-stash-drop: stash 07d8f6f (index 07071b6)
 *   HEAD lìa cành (kho phụ, cùng khung): f93dafa fix: thử vá nhanh
 * Chạy lại bằng scratchpad/ch13-lab/tham-hoa-on.sh (bản bỏ -q để thấy output của lệnh phá).
 */
import { S, cover, box, steps, table, two, list, cap, mindmap, graph, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-13', code: 'GIT · CHƯƠNG 13', title: 'Cứu hộ & Git trong quy trình thật', sub: 'Git & GitHub · Chương 13' };

const T = (lines, title = 'output thật — git 2.51', dir = '~/phong-tham-hoa', branch = 'main') => term(lines, { title, dir, branch });
const twoW = (a, b, cols) => `<div class="c-two" style="grid-template-columns:${cols}"><div>${a}</div><div>${b}</div></div>`;
const nhan = (t, c) => `<div style="font-size:17px;font-weight:800;letter-spacing:.8px;color:${c};margin:0 0 2px 6px">${t}</div>`;

/* Hai commit đầu, chung cho mọi kho trong phòng thí nghiệm. */
const GOC = [{ id: 'ffd4', x: 0, t: 'khởi tạo' }, { id: '563e', x: 1, p: ['ffd4'], t: 'form đăng nhập' }];

export const slides = S([
  cover({ t: 'Chương 13 — Cứu hộ &amp; quy trình thật', sub: 'Sơ đồ chọn lệnh cứu · 6 công thức có hình · một ngày làm việc thật · bảng tra nhanh', chap: 'CHƯƠNG 13' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Cứu hộ', 'đã commit ⇒ cứu được', [
    { t: 'Luật sống sót', d: 'commit rồi thì còn ≥ 30 ngày · chưa commit thì không', c: 'red' },
    { t: '13.1 Sơ đồ chọn lệnh', d: 'sự cố gì? đã push chưa? → một lệnh', c: 'amb' },
    { t: '13.1 Sáu công thức', d: 'nhầm nhánh · reset --hard · xoá nhánh · merge nhầm · HEAD lìa cành · stash đã drop', c: 'git' },
    { t: '13.2 Một ngày thật', d: 'fetch → nhánh → commit nhỏ → tự review → PR', c: 'grn' },
    { t: '13.2 Push ≠ deploy', d: 'quy trình của cuongthai.com và vì sao', c: 'blu' },
    { t: '13.2 Agent AI + bảng tra', d: 'worktree riêng · đọc diff · cheat sheet', c: 'vio' },
  ]) },

  /* 3 */
  { t: 'Luật sống sót: Git chỉ cứu thứ nó ĐÃ THẤY', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'a', x: 0, y: 30, w: 310, h: 150, t: 'Sửa file, CHƯA add', d: 'Git chưa từng thấy\nreset --hard / restore / clean\n⇒ MẤT THẬT', c: 'red' },
      { id: 'b', x: 425, y: 30, w: 310, h: 150, t: 'Đã git add', d: 'nội dung thành blob\nbị ghi đè vẫn còn blob lủng lẳng\n⇒ git fsck --lost-found', c: 'amb' },
      { id: 'c', x: 850, y: 30, w: 310, h: 150, t: 'Đã commit', d: 'reflog nhớ ≥ 30 ngày\nkể cả nhánh đã xoá\n⇒ git reflog', c: 'grn' },
    ], edges: [{ from: 'a', to: 'b', t: 'git add', c: 'amb' }, { from: 'b', to: 'c', t: 'git commit', c: 'grn' }] })}
    ${box('tip', 'Trước MỌI cách sửa trên một cây còn thay đổi: <code>git stash -u</code> (1 giây). Lệnh phá huỷ ngay sau đó trở thành đảo ngược được.')}
    ${box('info', 'Hai lệnh luôn an toàn, luôn chạy trước tiên: <code>git status</code> · <code>git reflog -15</code>')}` },

  /* 4 */
  { t: 'Tôi đang gặp sự cố gì? → lệnh cứu', body: diagram({ w: 1160, h: 500, nodes: [
    { id: 'r', x: 0, y: 190, w: 200, h: 110, t: 'Sự cố!', d: 'git status\ngit reflog -15', c: 'git' },
    { id: 'u', x: 250, y: 22, w: 230, h: 80, t: 'Chưa commit', d: 'phần sửa chưa vào commit', c: 'red' },
    { id: 'l', x: 250, y: 205, w: 230, h: 80, t: 'Commit chỉ ở máy', d: 'chưa push', c: 'grn' },
    { id: 'p', x: 250, y: 388, w: 230, h: 80, t: 'Đã push', d: 'người khác có thể đã pull', c: 'blu' },
    { id: 'u1', x: 560, y: 0, w: 600, h: 38, t: 'Sắp gõ lệnh liều → git stash -u trước', c: 'red' },
    { id: 'u2', x: 560, y: 44, w: 600, h: 38, t: 'Sửa chưa add bị ghi đè → không lệnh nào cứu', c: 'red', dash: true },
    { id: 'l1', x: 560, y: 106, w: 600, h: 38, t: 'Nhầm nhánh → git branch X + reset --hard HEAD~1', c: 'grn' },
    { id: 'l2', x: 560, y: 150, w: 600, h: 38, t: 'Lỡ reset --hard → reflog → reset --hard HEAD@{1}', c: 'grn' },
    { id: 'l3', x: 560, y: 194, w: 600, h: 38, t: 'Xoá nhầm nhánh → “(was …)” → switch -c X <mã>', c: 'grn' },
    { id: 'l4', x: 560, y: 238, w: 600, h: 38, t: 'Merge/rebase sai → --abort · reset --hard ORIG_HEAD', c: 'grn' },
    { id: 'l5', x: 560, y: 282, w: 600, h: 38, t: 'HEAD lìa cành có commit → switch -c cuu-ho <mã>', c: 'grn' },
    { id: 'l6', x: 560, y: 326, w: 600, h: 38, t: 'Lỡ drop stash → fsck → git stash apply <mã>', c: 'grn' },
    { id: 'p1', x: 560, y: 374, w: 600, h: 38, t: 'Commit tồi trên main → git revert (merge: -m 1)', c: 'blu' },
    { id: 'p2', x: 560, y: 418, w: 600, h: 38, t: 'Bị force-push đè → reflog của máy còn commit', c: 'blu' },
    { id: 'p3', x: 560, y: 462, w: 600, h: 38, t: 'Lộ khoá bí mật → XOAY khoá trước, dọn lịch sử sau', c: 'blu' },
  ], edges: [
    { from: 'r', to: 'u', c: 'red', fs: 't', ts: 'l' }, { from: 'r', to: 'l', c: 'grn', fs: 'r', ts: 'l' }, { from: 'r', to: 'p', c: 'blu', fs: 'b', ts: 'l' },
    ...['u1', 'u2'].map((to) => ({ from: 'u', to, c: 'red', fs: 'r', ts: 'l' })),
    ...['l1', 'l2', 'l3', 'l4', 'l5', 'l6'].map((to) => ({ from: 'l', to, c: 'grn', fs: 'r', ts: 'l' })),
    ...['p1', 'p2', 'p3'].map((to) => ({ from: 'p', to, c: 'blu', fs: 'r', ts: 'l' })),
  ] }) },

  /* 5 */
  { t: 'Công thức 1 — commit nhầm lên main', body: `
    ${two(
    `${nhan('TRƯỚC', '#ff5c6c')}${graph({ w: 560, h: 170, x0: 70, y0: 80, dx: 190, commits: [...GOC, { id: 'a48c', x: 2, p: ['563e'], t: 'feat(cart)', c: 'red', hl: true }],
      refs: [{ to: 'a48c', n: 'HEAD → main', k: 'head' }] })}`,
    `${nhan('SAU', '#3fb950')}${graph({ w: 560, h: 170, x0: 70, y0: 80, dx: 190, commits: [...GOC, { id: 'a48c', x: 2, p: ['563e'], t: 'feat(cart)', c: 'grn' }],
      refs: [{ to: '563e', n: 'HEAD → main', k: 'head' }, { to: 'a48c', n: 'feature/cart' }] })}`)}
    ${two(
    T(['$ git branch feature/cart', '# nhãn mới giữ lấy commit a48c trước đã', '$ git reset --hard HEAD~1', '= HEAD is now at 563e067 feat(auth): form đăng nhập'], 'output thật — kho 1-nham-nhanh', '~/1-nham-nhanh'),
    list(['Thứ tự là tất cả: <b>tạo nhánh TRƯỚC</b>, rồi mới lùi main', 'Nhiều commit, hoặc nhánh đích đã có sẵn ⇒ <code>git cherry-pick</code> sang', 'Đã push main ⇒ đừng reset, dùng <code>git revert</code>']), 'l')}` },

  /* 6 */
  { t: 'Công thức 2 — lỡ reset --hard mất hai commit', body: `
    ${graph({ w: 1160, h: 180, y0: 90, dx: 230, x0: 100, commits: [...GOC,
      { id: '639a', x: 2, p: ['563e'], ghost: true, t: 'fix(auth)' }, { id: '3f0e', x: 3, p: ['639a'], ghost: true, t: 'test(auth)' }],
      refs: [{ to: '563e', n: 'HEAD → main', k: 'head' }, { to: '3f0e', n: 'HEAD@{1} — đích cứu', k: 'note' }] })}
    ${T(['$ git reflog -3', '+ 563e067 HEAD@{0}: reset: moving to HEAD~2', '3f0e87c HEAD@{1}: commit: test(auth): thêm test đăng nhập', '639a6d1 HEAD@{2}: commit: fix(auth): chặn email rỗng', '$ git reset --hard HEAD@{1}', '= HEAD is now at 3f0e87c test(auth): thêm test đăng nhập'], 'output thật — kho 2-reset-hard', '~/2-reset-hard')}
    ${box('warn', 'Dòng <b>ngay dưới</b> dòng <code>reset:</code> là chỗ bạn vừa đứng. Phần sửa CHƯA commit lúc đó thì reflog không có.')}` },

  /* 7 */
  { t: 'Công thức 3 — xoá nhầm một nhánh chưa push', body: two(
    `${graph({ w: 440, h: 300, x0: 45, y0: 70, dx: 138, dy: 110, commits: [...GOC, { id: '96c9', x: 2, lane: 1, p: ['563e'], ghost: true, t: 'feat(payment)' }],
      refs: [{ to: '563e', n: 'HEAD → main', k: 'head' }, { to: '96c9', n: 'feature/payment ✗', k: 'remote', side: 'down' }] })}
    ${box('tip', '<code>branch -D</code> in sẵn mã băm ngay lúc xoá. <b>Cuộn terminal lên</b> trước khi hoảng.')}`,
    T(['$ git branch -d feature/payment', '! error: the branch \'feature/payment\' is not fully merged', '$ git branch -D feature/payment', '+ Deleted branch feature/payment (was 96c9e91).', '# lỡ trôi mất dòng trên? hỏi reflog:', '$ git reflog | grep -A1 "from feature/payment"', '563e067 HEAD@{0}: checkout: moving from feature/payment to main', '+ 96c9e91 HEAD@{1}: commit: feat(payment): thanh toán VNPay', '$ git switch -c feature/payment 96c9e91', '= Switched to a new branch \'feature/payment\''], 'output thật — kho 3-xoa-nhanh', '~/3-xoa-nhanh'), 'r2') },

  /* 8 */
  { t: 'Công thức 4 — merge nhầm nhánh làm dở vào main', body: `
    ${two(
    `${nhan('TRƯỚC — lỡ merge feature/wip', '#ff5c6c')}${graph({ w: 560, h: 220, x0: 60, y0: 72, dx: 150, dy: 95, commits: [
      { id: '563e', x: 0, t: 'form đăng nhập' }, { id: '44e9', x: 1, p: ['563e'], t: 'docs' },
      { id: 'c5a7', x: 1, lane: 1, p: ['563e'], c: 'amb', t: 'wip' },
      { id: '2554', x: 2.3, p: ['44e9', 'c5a7'], star: true, c: 'red', hl: true, t: 'merge' }],
      refs: [{ to: '2554', n: 'HEAD → main', k: 'head' }] })}`,
    `${nhan('SAU — reset --hard ORIG_HEAD', '#3fb950')}${graph({ w: 560, h: 220, x0: 60, y0: 72, dx: 150, dy: 95, commits: [
      { id: '563e', x: 0, t: 'form đăng nhập' }, { id: '44e9', x: 1, p: ['563e'], t: 'docs', hl: true },
      { id: 'c5a7', x: 1, lane: 1, p: ['563e'], c: 'amb', t: 'wip' },
      { id: '2554', x: 2.3, p: ['44e9', 'c5a7'], star: true, ghost: true, t: 'bỏ rơi' }],
      refs: [{ to: '44e9', n: 'HEAD → main', k: 'head' }] })}`)}
    ${two(
    T(['$ git rev-parse --short ORIG_HEAD', '44e950f', '$ git reset --hard ORIG_HEAD', '= HEAD is now at 44e950f docs: cập nhật README'], 'output thật — kho 4-merge-nham', '~/4-merge-nham'),
    T(['# nếu merge ĐÃ push: không reset, mà', '$ git revert -m 1 2554c23', '= [main e1475d9] Revert "Merge branch \'feature/wip\'"', ' delete mode 100644 wip.js'], 'đã push → revert (bản sao kho 4)', '~/4-merge-nham'))}` },

  /* 9 */
  { t: 'Công thức 5 — HEAD lìa cành, và tôi đã commit ở đó', body: twoW(
    `${graph({ w: 380, h: 320, x0: 60, y0: 80, dx: 150, dy: 120, commits: [...GOC, { id: 'f93d', x: 1, lane: 1, p: ['ffd4'], c: 'amb', hl: true, t: 'fix: thử vá nhanh' }],
      refs: [{ to: '563e', n: 'HEAD → main', k: 'head' }, { to: 'f93d', n: 'cuu-ho (tạo sau)', side: 'down' }] })}
    ${list(['Commit trên HEAD lìa cành <b>không nhánh nào giữ</b>', 'Rời đi là nó thành “mồ côi” — Git in sẵn mã để cứu'])}`,
    T(['$ git switch main', '! Warning: you are leaving 1 commit behind, not connected to', '! any of your branches:', '', '+   f93dafa fix: thử vá nhanh', '', 'If you want to keep it by creating a new branch, this may be a good time', 'to do so with:', '', '+  git branch <new-branch-name> f93dafa', '', 'Switched to branch \'main\'', '$ git switch -c cuu-ho f93dafa', '= Switched to a new branch \'cuu-ho\''], 'output thật — git 2.51', '~/head-lia-canh', ''), '380px 1fr') },

  /* 10 */
  { t: 'Công thức 6 — lỡ drop stash: git fsck tìm lại', body: twoW(
    T(['$ git stash drop', '+ Dropped refs/stash@{0} (07d8f6f75ecade3d5036b06cfaa658b93576f776)', '# trôi mất dòng trên? stash đã drop không còn trong reflog:', '$ git fsck --lost-found', '+ dangling commit 07d8f6f75ecade3d5036b06cfaa658b93576f776', '$ git show -s --format="%h %s" 07d8f6f', 'On main: ghi chú quan trọng', '$ git stash apply 07d8f6f', '$ git status -s', '= A  ghi-chu.txt'], 'output thật — kho 5-stash-drop', '~/5-stash-drop'),
    `${graph({ w: 400, h: 230, x0: 50, y0: 70, dx: 128, dy: 100, commits: [
      { id: '563e', x: 0, t: 'HEAD lúc cất' }, { id: '0707', x: 1, lane: 1, p: ['563e'], c: 'blu', t: 'index' },
      { id: '07d8', x: 2, p: ['563e', '0707'], star: true, c: 'vio', hl: true, t: 'WIP (dangling)' }],
      refs: [{ to: '07d8', n: 'refs/stash ✗', k: 'remote' }] })}
    ${list(['Stash là <b>một commit</b> — drop chỉ gỡ con trỏ', '<code>fsck</code> liệt kê commit không ai trỏ tới', 'Không còn dòng “Dropped”? tìm dòng có chữ <b>On main:</b>'])}`, '740px 1fr') },

  /* 11 */
  { t: 'Khi sự cố đã lên GitHub — luật đổi hẳn', body: `
    ${table(['Tình huống', 'Lệnh đầu tiên', 'Vì sao KHÔNG reset + force-push'], [
      ['Commit tồi đã trên <code>main</code>', '+<code>git revert &lt;mã&gt;</code> · merge: <code>-m 1</code>', 'Cả nhóm đã pull ⇒ viết lại lịch sử là phá clone của họ'],
      ['Bị bạn force-push đè mất commit', '+<code>git reflog</code> trên máy <b>còn</b> commit → nhánh <code>rescue</code>', 'Đè ngược lại sẽ xoá luôn việc của bạn kia'],
      ['Lộ <code>.env</code> / khoá API', '-XOAY khoá ở nhà cung cấp — TRƯỚC', 'Bot quét kho công khai trong vài phút; dọn lịch sử sau (8.3)'],
      ['Bản clone mất commit, GitHub còn', '<code>gh api …/events</code> → <code>git fetch origin &lt;sha&gt;</code>', 'Lấy SHA trước lần push từ sự kiện PushEvent'],
    ], { sm: true })}
    ${box('bad', 'Trong lúc sự cố: <b>revert trước, chẩn đoán sau</b>. Một bản vá viết vội dưới áp lực thường là sự cố thứ hai.')}` },

  /* 12 */
  { t: 'Danh sách kiểm lúc hoảng', body: `
    ${steps([
      ['<b>Ngừng gõ</b>', 'mỗi lệnh thêm vào làm trạng thái khó đọc hơn — một phút không làm gì tệ đi'],
      ['<b>Bảo vệ cây làm việc</b>: <code>git stash -u</code> hoặc chép cả thư mục', 'việc chưa commit là thứ DUY NHẤT thật sự có thể mất'],
      ['<b>Nhìn</b>: <code>git status</code> · <code>git reflog -15</code> · <code>git log --oneline --graph --all -20</code>', 'đừng đoán — đọc'],
      ['<b>Gọi tên</b> sự cố theo sơ đồ (slide 4)', 'khớp được một công thức rồi mới chạy lệnh'],
      ['<b>Chạy MỘT lệnh, rồi kiểm lại</b> bằng <code>git log</code> + <code>git status</code>', 'sai thì quay lại bằng reflog, đừng chồng thêm lệnh'],
    ])}` },

  /* 13 */
  { t: 'Một ngày làm việc thật (đồ án nhóm SWP391)', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'a', x: 0, y: 10, w: 260, h: 100, t: '08:00 Cập nhật', d: 'git switch main\ngit pull --rebase', c: 'blu', mono: true },
      { id: 'b', x: 300, y: 10, w: 260, h: 100, t: '08:05 Mở nhánh', d: 'git switch -c\nfeature/dat-lich', c: 'grn', mono: true },
      { id: 'c', x: 600, y: 10, w: 260, h: 100, t: '09–11h Commit nhỏ', d: 'git add -p\ngit commit (1.4)', c: 'amb', mono: true },
      { id: 'd', x: 900, y: 10, w: 260, h: 100, t: '11:30 Tự review', d: 'git log origin/main..\ngit diff --stat', c: 'vio', mono: true },
      { id: 'e', x: 900, y: 210, w: 260, h: 100, t: '11:40 Push + PR', d: 'git push -u origin HEAD\ngh pr create', c: 'git', mono: true },
      { id: 'f', x: 600, y: 210, w: 260, h: 100, t: '14:00 Sửa theo review', d: 'commit thêm → push\n(không force)', c: 'tea', mono: true },
      { id: 'g', x: 300, y: 210, w: 260, h: 100, t: '16:00 Merge', d: 'Squash and merge\nxoá nhánh', c: 'grn', mono: true },
      { id: 'h', x: 0, y: 210, w: 260, h: 100, t: '16:05 Dọn máy', d: 'git switch main\ngit pull · branch -d', c: 'blu', mono: true },
    ], edges: [
      { from: 'a', to: 'b', c: 'blu' }, { from: 'b', to: 'c', c: 'grn' }, { from: 'c', to: 'd', c: 'amb' }, { from: 'd', to: 'e', c: 'vio', fs: 'b', ts: 't' },
      { from: 'e', to: 'f', c: 'git' }, { from: 'f', to: 'g', c: 'tea' }, { from: 'g', to: 'h', c: 'grn' },
    ] })}
    ${box('tip', 'Nhánh sống <b>một ngày</b>, không phải hai tuần. Nhánh càng ngắn, xung đột càng nhỏ — và mọi công thức cứu hộ càng ít khi phải dùng.')}` },

  /* 14 */
  { t: 'cuongthai.com: push KHÔNG deploy — deploy là một script', body: `
    ${diagram({ w: 1160, h: 300, nodes: [
      { id: 'm', x: 0, y: 20, w: 250, h: 90, t: '💻 Máy Cường', d: 'kiểm tsc/build\ncommit vào main cục bộ', c: 'amb' },
      { id: 's', x: 300, y: 20, w: 250, h: 90, t: 'bash deploy-nha.sh', d: 'người chạy, có chủ đích', c: 'git', mono: true },
      { id: 'h', x: 600, y: 20, w: 250, h: 90, t: '🏠 Máy nhà build', d: '2 ảnh song song → GHCR', c: 'vio' },
      { id: 'v', x: 900, y: 20, w: 260, h: 90, t: '☁️ VPS tráo ảnh', d: 'smoke-test route', c: 'grn' },
      { id: 'g', x: 900, y: 190, w: 260, h: 90, t: 'git push origin main', d: 'script TỰ push sau khi\nbộ kiểm CI xanh', c: 'blu', mono: true },
      { id: 'p', x: 0, y: 190, w: 250, h: 90, t: 'push tay lên main', d: 'chỉ chạy ci-lint.yml', c: 'dim', dash: true },
      { id: 'c', x: 390, y: 190, w: 330, h: 90, t: 'GitHub Actions', d: 'workflow deploy: chỉ workflow_dispatch\n(bấm tay) — push không kích hoạt', c: 'dim', dash: true },
    ], edges: [
      { from: 'm', to: 's', c: 'amb' }, { from: 's', to: 'h', c: 'git' }, { from: 'h', to: 'v', c: 'vio' }, { from: 'v', to: 'g', c: 'blu', fs: 'b', ts: 't' },
      { from: 'p', to: 'c', c: 'dim', dash: true, t: 'không deploy' },
    ] })}
    ${box('bad', '03/07 và 06/07/2026: hai workflow deploy chạy ở MỌI lần push, đua nhau ⇒ feed 500, backend <code>Exited(137)</code>. Bài học: <b>mô hình nhánh và cơ chế deploy là hai quyết định tách rời</b>.')}` },

  /* 15 */
  { t: 'Tự review diff — năm phút đáng giá nhất', body: two(
    T(['$ git log --oneline @{u}..HEAD', '! fatal: no upstream configured for branch \'feature/dat-lich\'', '# nhánh chưa push lần nào ⇒ so với origin/main', '$ git log --oneline origin/main..HEAD', '9e05be7 fix(booking): chặn ngày quá khứ', 'b2a642c feat(booking): hàm đặt lịch', '$ git diff --stat origin/main..HEAD', '!  .env        | 1 +', '  dat-lich.js | 5 +++++', '$ git diff --check origin/main..HEAD', '+ dat-lich.js:3: trailing whitespace.', '$ git grep -n "console.log" -- dat-lich.js', '+ dat-lich.js:2:  console.log("debug", ngay)'], 'output thật — kho thử review', '~/review', 'feature/dat-lich'),
    `${steps([
      ['Sắp gửi <b>commit nào</b>?', '<code>git log origin/main..HEAD</code>'],
      ['<b>File nào</b> — có file lạ?', '<code>--stat</code>: ở đây là <code>.env</code> chứa mật khẩu DB'],
      ['Đọc diff như <b>người lạ</b>', '<code>git diff origin/main..HEAD</code>'],
      ['Rác còn sót', '<code>--check</code> + <code>git grep console.log</code>'],
    ])}
    ${box('good', 'Bước 2 bắt được lỗi đắt nhất: một file lạ gần như luôn là bí mật, bản build, hoặc lockfile sinh lại.')}`, 'l') },

  /* 16 */
  { t: 'Làm việc cùng agent AI: mỗi phiên một worktree', body: `
    ${diagram({ w: 1160, h: 270, nodes: [
      { id: 'o', x: 430, y: 180, w: 300, h: 86, t: '.git dùng chung', d: 'đối tượng + nhánh + reflog', c: 'git' },
      { id: 'a', x: 0, y: 4, w: 330, h: 100, t: '~/review (bạn)', d: 'HEAD: feature/dat-lich\nindex riêng · file riêng', c: 'amb', mono: true },
      { id: 'b', x: 415, y: 4, w: 330, h: 100, t: '~/agent-a', d: 'HEAD: agent/refactor-auth\nindex riêng · file riêng', c: 'blu', mono: true },
      { id: 'c', x: 830, y: 4, w: 330, h: 100, t: '~/agent-b', d: 'HEAD: agent/add-tests\nindex riêng · file riêng', c: 'vio', mono: true },
    ], edges: [{ from: 'a', to: 'o', c: 'amb', fs: 'b', ts: 'l' }, { from: 'b', to: 'o', c: 'blu', fs: 'b', ts: 't' }, { from: 'c', to: 'o', c: 'vio', fs: 'b', ts: 'r' }] })}
    ${T(['$ git worktree add ../agent-a -b agent/refactor-auth main', 'Preparing worktree (new branch \'agent/refactor-auth\')', 'HEAD is now at 563e067 feat(auth): form đăng nhập'], 'output thật (bài 10.1)', '~/review', 'feature/dat-lich')}
    ${box('warn', 'Ba luật: <b>không</b> <code>git add -A</code> khi phiên khác đang chạy · <b>không</b> deploy khi chưa hỏi · đọc diff của agent như diff của đồng nghiệp.')}` },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 13', body: table(['Sự cố / muốn…', 'Gõ'], [
    ['Trước khi thử bất cứ thứ gì', '<code>git stash -u</code> · <code>git status</code> · <code>git reflog -15</code>'],
    ['Commit nhầm lên main (chưa push)', '<code>git branch feature/x</code> → <code>git reset --hard HEAD~1</code>'],
    ['Lỡ <code>reset --hard</code> / rebase hỏng', '<code>git reflog</code> → <code>git reset --hard HEAD@{n}</code>'],
    ['Xoá nhầm nhánh', '<code>git reflog | grep -A1 "from X"</code> → <code>git switch -c X &lt;mã&gt;</code>'],
    ['Đang merge/rebase dở, muốn thoát', '<code>git merge --abort</code> · <code>git rebase --abort</code>'],
    ['Merge xong mới thấy sai (chưa push)', '<code>git reset --hard ORIG_HEAD</code>'],
    ['Commit trên HEAD lìa cành', '<code>git switch -c cuu-ho &lt;mã&gt;</code>'],
    ['Lỡ drop stash', '<code>git fsck --lost-found</code> → <code>git stash apply &lt;mã&gt;</code>'],
    ['Commit tồi đã push lên main', '<code>git revert &lt;mã&gt;</code> · merge: <code>git revert -m 1 &lt;mã&gt;</code>'],
    ['Trước khi push', '<code>git log origin/main..HEAD</code> · <code>git diff --stat</code> · <code>--check</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 13 — phòng thí nghiệm thảm hoạ', body: two(
    `${steps([
      ['Chép <code>tham-hoa.sh</code> ở bài 13.1, chạy <code>bash tham-hoa.sh</code>', 'dựng 5 kho, mỗi kho một sự cố'],
      ['Vào từng kho: <b>chỉ nhìn</b> trước — <code>status</code>, <code>reflog</code>, <code>log --all</code>', 'gọi tên sự cố theo sơ đồ slide 4'],
      ['Cứu bằng <b>đúng một công thức</b> mỗi kho', 'không mở bài ra chép — dùng bảng tra slide 17'],
      ['Chấm: <code>bash tham-hoa.sh kiem</code>', 'đủ 6 dấu ✅ mới xong'],
    ])}`,
    `${T(['$ bash tham-hoa.sh kiem', '= ✅ 1-nham-nhanh · main', '= ✅ 1-nham-nhanh · feature/cart', '= ✅ 2-reset-hard · main', '= ✅ 3-xoa-nhanh · feature/payment', '= ✅ 4-merge-nham · main', '= ✅ 5-stash-drop · ghi-chu.txt'], 'output thật — sau khi cứu đủ 5 kho', '~', '')}
    ${box('good', '<b>Đạt khi:</b> 6/6 ✅, và với mỗi kho bạn nói được: sự cố nằm ở vùng nào (chưa commit / chỉ ở máy / đã push).')}`, 'r') },
]);
