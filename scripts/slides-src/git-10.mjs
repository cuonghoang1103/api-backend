/**
 * Git & GitHub · Deck git-10 — Chương 10: Kho mã lớn & quy trình nâng cao.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1, git-lfs 3.7.1) của kho thử dựng bằng
 * scratchpad/ch10-lab/lab.sh (ngày giờ + nội dung file cố định ⇒ mã băm tái lập được; HOME riêng):
 *   do-an-swp: e47f7dc feat(auth) · 1fc697e wip giỏ hàng (feature/gio-hang) · 4bd5c75 fix(auth) (hotfix/login)
 *              ef1e3c7 thêm submodule · 669f9b5 nâng ui-kit · d84fe97 dùng Badge
 *   ui-kit:    1649e84 (v2.1.0) · 13633f1 Toast · da584d6 Badge
 *   subtree:   1af5138 init · 0c4d490 squashed · 99deb22 merge · 7020685 squashed changes · c45f389 merge
 *   LFS:       hero.psd 5 242 880 byte ⇒ con trỏ 132 byte, oid sha256:45c877c2…
 * Đường dẫn tuyệt đối trong output đã rút thành "~/" (kho thử nằm trong thư mục tạm).
 */
import { S, cover, box, steps, table, two, list, kpis, mindmap, graph, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-10', code: 'GIT · CHƯƠNG 10', title: 'Kho lớn & quy trình nâng cao', sub: 'Git & GitHub · Chương 10' };

export const slides = S([
  cover({ t: 'Chương 10 — Kho mã lớn', sub: 'worktree · submodule vs subtree · partial clone + sparse-checkout · Git LFS', chap: 'CHƯƠNG 10' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Kho lớn', 'khi "một thư mục, một nhánh" không còn đủ', [
    { t: '10.1 git worktree', d: 'một .git, nhiều thư mục làm việc', c: 'grn' },
    { t: '10.2 submodule', d: 'con trỏ tới MỘT commit của kho khác', c: 'blu' },
    { t: '10.2 subtree', d: 'chép mã (và lịch sử) vào kho mình', c: 'vio' },
    { t: '10.3 partial clone + sparse', d: 'chỉ tải và chỉ ghi ra phần bạn cần', c: 'amb' },
    { t: '10.3 Git LFS', d: 'file nhị phân: con trỏ trong Git, byte ở chỗ khác', c: 'git' },
    { t: '10.3 monorepo', d: 'một kho, nhiều gói — CI chỉ chạy phần đổi', c: 'tea' },
  ]) },

  /* 3 */
  { t: 'worktree: MỘT kho .git, NHIỀU thư mục làm việc', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'a', x: 0, y: 10, w: 340, h: 110, t: '~/do-an-swp', d: 'nhánh feature/gio-hang\ncart.js đang sửa dở (M)', c: 'amb', mono: true },
      { id: 'b', x: 820, y: 10, w: 340, h: 110, t: '~/do-an-hotfix', d: 'nhánh hotfix/login\n.git ở đây là một FILE', c: 'grn', mono: true },
      { id: 'g', x: 260, y: 190, w: 400, h: 120, t: '.git (dùng chung)', d: 'objects · refs · refs/stash\ncommit bên này thấy ngay bên kia', c: 'git', mono: true },
      { id: 'w', x: 820, y: 200, w: 340, h: 110, t: 'worktrees/do-an-hotfix', d: '(nằm trong .git của kho chính)\nHEAD · index · logs riêng', c: 'blu', mono: true },
    ], edges: [
      { from: 'a', to: 'g', t: 'HEAD + index riêng', c: 'amb', fs: 'b', ts: 't' },
      { from: 'b', to: 'w', t: 'gitdir: …', c: 'grn', fs: 'b', ts: 't' },
      { from: 'w', to: 'g', t: 'commondir', c: 'blu', fs: 'l', ts: 'r' },
    ] })}
    ${box('tip', 'Khác <code>git stash</code>: không cất gì, không đổi nhánh tại chỗ ⇒ dev server, <code>node_modules</code>, tab editor ở <code>do-an-swp</code> đứng yên. Khác clone thứ hai: không tải lại lịch sử.')}` },

  /* 4 */
  { t: 'Vá gấp mà không đụng nhánh đang làm dở', body: two(
    term([
      '$ git status -s',
      '!  M cart.js',
      '$ git worktree add -b hotfix/login ../do-an-hotfix main',
      "Preparing worktree (new branch 'hotfix/login')",
      'HEAD is now at e47f7dc feat(auth): trang dang nhap',
      '$ git worktree list',
      '~/do-an-swp     1fc697e [feature/gio-hang]',
      '~/do-an-hotfix  e47f7dc [hotfix/login]',
      '$ cat ../do-an-hotfix/.git',
      '+ gitdir: ~/do-an-swp/.git/worktrees/do-an-hotfix',
    ], { title: 'output thật — git 2.51', dir: '~/do-an-swp', branch: 'feature/gio-hang' }),
    `${term([
      '# ở ../do-an-hotfix: sửa server.js rồi',
      '$ git commit -am "fix(auth): sua loi dang nhap"',
      '= [hotfix/login 4bd5c75] fix(auth): sua loi dang nhap',
      '# quay lại thư mục chính:',
      '$ git log --oneline -1 hotfix/login',
      '4bd5c75 fix(auth): sua loi dang nhap',
      '$ git status -s',
      '!  M cart.js',
    ], { title: 'ref dùng chung, cây làm việc riêng', dir: '~/do-an-swp', branch: 'feature/gio-hang' })}
    ${box('good', 'Commit ở worktree kia <b>thấy ngay</b> — không push, không fetch. <code>cart.js</code> vẫn dở nguyên.')}`, 'l') },

  /* 5 */
  { t: 'Luật của worktree — ba lỗi ai cũng gặp một lần', body: two(
    term([
      '$ git switch hotfix/login',
      "! fatal: 'hotfix/login' is already used by worktree at '~/do-an-hotfix'",
      '$ rm -rf ../do-an-hotfix ; git worktree list',
      '~/do-an-swp     1fc697e [feature/gio-hang]',
      '+ ~/do-an-hotfix  4bd5c75 [hotfix/login] prunable',
      '$ git worktree prune -v',
      'Removing worktrees/do-an-hotfix: gitdir file points to non-existent location',
      '$ git worktree remove ../do-an-review',
      "! fatal: '../do-an-review' contains modified or untracked files, use --force to delete it",
    ], { title: 'output thật', dir: '~/do-an-swp', branch: 'feature/gio-hang' }),
    steps([
      ['Một nhánh = một worktree', 'muốn mở cùng nhánh ở chỗ thứ hai ⇒ nhánh khác hoặc <code>--detach</code>'],
      ['Xoá bằng <code>git worktree remove</code>', '<code>rm -rf</code> để lại bản ghi “prunable” giữ chặt nhánh ⇒ <code>prune</code>'],
      ['File bị ignore không đi theo', 'worktree mới chưa có <code>node_modules</code>, <code>.env</code> — cài lại một lần'],
    ]), 'l') },

  /* 6 */
  { t: 'submodule = con trỏ tới MỘT commit của kho khác (gitlink)', body: `
    ${diagram({ w: 1160, h: 250, nodes: [
      { id: 'p', x: 0, y: 0, w: 330, h: 90, t: 'do-an-swp · ef1e3c7', d: 'commit của kho đồ án', c: 'amb', mono: true },
      { id: 't', x: 0, y: 150, w: 400, h: 90, t: 'tree vendor/', d: '160000 commit 1649e84  ui-kit', c: 'git', mono: true },
      { id: 'c1', x: 640, y: 150, w: 250, h: 90, t: '1649e84', d: 'v2.1.0 (Button, Modal)', c: 'blu', mono: true },
      { id: 'c2', x: 640, y: 10, w: 250, h: 80, t: '13633f1', d: 'Toast', c: 'dim', mono: true, dash: true },
      { id: 'c3', x: 920, y: 10, w: 240, h: 80, t: 'da584d6', d: 'Badge', c: 'dim', mono: true, dash: true },
    ], edges: [
      { from: 'p', to: 't', c: 'amb', fs: 'b', ts: 't' },
      { from: 't', to: 'c1', t: 'gitlink', c: 'git', fs: 'r', ts: 'l' },
      { from: 'c2', to: 'c1', c: 'blu', fs: 'b', ts: 't' },
      { from: 'c3', to: 'c2', c: 'blu', fs: 'l', ts: 'r' },
    ] })}
    ${two(term([
      '$ git ls-files --stage vendor/ui-kit',
      '+ 160000 1649e8401565307e3b626ad41a7cab1c31810085 0\tvendor/ui-kit',
      '$ cat .gitmodules',
      '[submodule "vendor/ui-kit"]',
      '\tpath = vendor/ui-kit',
      '\turl = ../ui-kit.git',
    ], { title: 'output thật', dir: '~/do-an-swp' }),
    list(['Kho đồ án lưu <b>40 ký tự</b>, không lưu mã ui-kit', 'Kho ui-kit có commit mới (nét đứt) ⇒ đồ án <b>vẫn ghim 1649e84</b> cho tới khi ai đó dời ghim và commit', '<code>.gitmodules</code> nói <b>lấy ở đâu</b>; gitlink nói <b>commit nào</b>']), 'l')}` },

  /* 7 */
  { t: 'Vòng đời submodule: dấu - · dấu cách · dấu +', body: two(
    term([
      '# bạn An: git clone thường (không --recurse-submodules)',
      '$ git submodule status',
      '! -1649e8401565307e3b626ad41a7cab1c31810085 vendor/ui-kit',
      '$ git submodule update --init',
      "Submodule path 'vendor/ui-kit': checked out '1649e8401565307e3b626ad41a7cab1c31810085'",
      '$ git submodule status',
      '=  1649e8401565307e3b626ad41a7cab1c31810085 vendor/ui-kit (v2.1.0)',
      '$ git -C vendor/ui-kit status | head -1',
      'HEAD detached at 1649e84',
    ], { title: 'output thật — máy bạn An', dir: '~/ban-an' }),
    `${term([
      '# ui-kit vừa có commit Toast; Cường kéo về:',
      '$ git submodule update --remote',
      '$ git submodule status',
      '+ +13633f182791d40a5ed76822cc184a7a83e9a5ed vendor/ui-kit (v2.1.0-1-g13633f1)',
      '$ git diff',
      'diff --git a/vendor/ui-kit b/vendor/ui-kit',
      'index 1649e84..13633f1 160000',
      '! -Subproject commit 1649e8401565307e3b626ad41a7cab1c31810085',
      '= +Subproject commit 13633f182791d40a5ed76822cc184a7a83e9a5ed',
    ], { title: 'dời ghim = một thay đổi cần commit (đã cắt dòng)', dir: '~/do-an-swp' })}
    ${box('warn', 'Kho con là thư mục trên đĩa (<code>../ui-kit.git</code>)? Từ git 2.38.1 bị chặn: <code>fatal: transport \'file\' not allowed</code> ⇒ thêm <code>-c protocol.file.allow=always</code>.')}`, 'l') },

  /* 8 */
  { t: 'Bẫy: push kho cha TRƯỚC kho con', body: `
    ${diagram({ w: 1160, h: 220, nodes: [
      { id: 'me', x: 0, y: 60, w: 280, h: 100, t: 'Máy Cường', d: 'd84fe97 ghim da584d6\nda584d6 chưa push', c: 'amb', mono: true },
      { id: 'pa', x: 440, y: 0, w: 280, h: 90, t: 'do-an.git', d: 'có d84fe97 ✓', c: 'grn', mono: true },
      { id: 'uk', x: 440, y: 130, w: 280, h: 90, t: 'ui-kit.git', d: 'KHÔNG có da584d6 ✗', c: 'red', mono: true },
      { id: 'an', x: 880, y: 60, w: 280, h: 100, t: 'Bạn An / bạn Chi', d: 'pull · clone --recurse\n→ hỏng', c: 'red', mono: true },
    ], edges: [
      { from: 'me', to: 'pa', t: 'git push', c: 'grn', fs: 'r', ts: 'l' },
      { from: 'pa', to: 'an', c: 'grn', fs: 'r', ts: 'l' },
      { from: 'uk', to: 'an', t: 'not our ref', c: 'red', fs: 'r', ts: 'l' },
    ] })}
    ${two(term([
      '$ git clone --recurse-submodules do-an.git ban-chi',
      '! fatal: remote error: upload-pack: not our ref da584d6a5756fbb21a0b231d9fecb2ef03c49c1e',
      "! fatal: Fetched in submodule path 'vendor/ui-kit', but it did not contain da584d6a5756fbb21a0b231d9fecb2ef03c49c1e. Direct fetching of that commit failed.",
    ], { title: 'output thật — máy bạn Chi', dir: '~', branch: '' }),
    term([
      '$ git push --recurse-submodules=check',
      'The following submodule paths contain changes that can',
      'not be found on any remote:',
      '+   vendor/ui-kit',
      '! fatal: Aborting.',
    ], { title: 'chốt chặn: Git từ chối push kho cha', dir: '~/do-an-swp' }), '')}` },

  /* 9 */
  { t: 'subtree = chép mã (và lịch sử) VÀO kho của bạn', body: two(
    `${graph({ w: 620, h: 250, x0: 70, y0: 70, dx: 120, dy: 110, lanes: [], commits: [
      { id: '1af5', x: 0, t: 'init' },
      { id: '0c4d', x: 0.9, lane: 1, c: 'vio', t: 'squash v2.1.0' },
      { id: '99de', x: 1.8, p: ['1af5', '0c4d'], star: true, t: 'subtree add' },
      { id: '7020', x: 2.7, lane: 1, p: ['0c4d'], c: 'vio', t: 'squash ..da584d6' },
      { id: 'c45f', x: 3.6, p: ['99de', '7020'], star: true, hl: true, t: 'subtree pull' },
    ], refs: [{ to: 'c45f', n: 'main', k: 'branch' }] })}
    ${list(['<code>--squash</code>: mỗi lần cập nhật = <b>1 commit gộp</b> + 1 merge', 'Không có gitlink, không có <code>.gitmodules</code>'])}`,
    `${term([
      '$ git subtree add --prefix vendor/ui-kit ../ui-kit.git v2.1.0 --squash',
      "Added dir 'vendor/ui-kit'",
      '$ git ls-files --stage --abbrev vendor/ui-kit',
      '= 100644 4ed2ca4 0\tvendor/ui-kit/button.js',
      '= 100644 e23b78b 0\tvendor/ui-kit/modal.js',
      '# bạn Bình clone THƯỜNG, không lệnh thêm:',
      '$ ls ../ban-binh/vendor/ui-kit',
      'badge.js  button.js  modal.js  toast.js',
    ], { title: 'output thật', dir: '~/do-an-subtree' })}
    ${box('info', 'Mode <b>100644</b> = file thật (blob), so với <b>160000</b> = con trỏ ở submodule.')}`, 'r') },

  /* 10 */
  { t: 'Chọn cái nào? — thường là KHÔNG cái nào', body: `
    ${table(['', 'Submodule', 'Subtree', 'Gói npm', 'Monorepo'], [
      ['Kho cha lưu gì', 'gitlink (1 mã băm)', 'file thật', 'số phiên bản', 'mã nguồn'],
      ['Clone thường chạy ngay?', '-không (cần --recurse)', '+có', '+có (npm i)', '+có'],
      ['Ghim phiên bản chính xác', '+có', '!bản đã chép', '+lockfile', '— (một commit)'],
      ['Sửa thư viện + app cùng lúc', '!2 commit, 2 push, đúng thứ tự', '!subtree push', '-publish rồi nâng', '+1 commit'],
      ['Chi phí chính', 'cả nhóm học lệnh', 'kho to, lịch sử ồn', 'dựng registry', 'CI, kích thước'],
    ], { sm: true, center: [1, 2, 3, 4] })}
    ${box('tip', 'Đồ án SWP391 dùng chung ui-kit? Hỏi trước: <b>publish được thành gói npm không</b>? Được ⇒ dùng gói. Nhúng ở tầng Git chỉ khi không publish được.')}` },

  /* 11 */
  { t: 'Kho quá to: partial clone (ít blob) + sparse-checkout (ít file)', body: `
    ${kpis([
      { v: '4,3 MB', l: '.git khi clone đủ', c: 'red' },
      { v: '1,7 MB', l: '.git với --filter=blob:none + sparse', c: 'grn' },
      { v: '202 → 80', l: 'file thật sự ghi ra đĩa', c: 'blu' },
      { v: '135', l: 'blob chưa tải — lấy khi cần', c: 'amb' },
    ])}
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 'h', x: 0, y: 20, w: 440, h: 160, t: 'Lịch sử (.git)', d: 'ĐỦ mọi commit + tree\nblob: chỉ những gì đã checkout\ngit log -- apps/admin vẫn chạy', c: 'vio' },
      { id: 'w', x: 720, y: 20, w: 440, h: 160, t: 'Thư mục làm việc', d: 'package.json · turbo.json (gốc)\napps/web/ · packages/ui/\n3 gói kia KHÔNG ghi ra đĩa', c: 'amb' },
    ], edges: [{ from: 'h', to: 'w', t: 'checkout theo cone', c: 'grn', fs: 'r', ts: 'l' }] })}
    ${box('info', '<b>partial clone</b> bớt thứ <b>tải về</b>; <b>sparse-checkout</b> bớt thứ <b>ghi ra đĩa</b>. Hay dùng cùng nhau, nhưng là hai việc khác nhau.')}` },

  /* 12 */
  { t: 'sparse-checkout trong thực tế (cone mode)', body: two(
    term([
      '# ở thư mục cha:',
      '$ git clone --filter=blob:none --sparse file://…/mono.git mono',
      '$ ls',
      'package.json  turbo.json',
      '$ git sparse-checkout set apps/web packages/ui',
      '$ find apps packages -type f | wc -l',
      '= 80',
      '$ git ls-files | wc -l',
      '202',
      '$ git rev-list --objects --all --missing=print | grep -c "^?"',
      '+ 135',
      '$ git sparse-checkout add packages/api',
      '$ git config core.sparseCheckoutCone',
      'true',
    ], { title: 'output thật', dir: '~/mono' }),
    `${term([
      '$ cat .git/info/sparse-checkout',
      '/*', '!/*/', '/apps/', '!/apps/*/', '/packages/', '!/packages/*/',
      '/apps/web/', '/packages/api/', '/packages/ui/',
    ], { title: 'Git tự sinh — đừng sửa tay', dir: '~/mono' })}
    ${list(['<code>ls-files</code> vẫn thấy <b>202</b>: Git biết đủ file, chỉ không ghi ra', '<code>disable</code> ⇒ về checkout đầy đủ'])}`, 'l') },

  /* 13 */
  { t: 'Monorepo: CI chỉ chạy phần đã đổi', body: two(
    `${term([
      '$ git diff --name-only origin/main...HEAD',
      'apps/web/f3.txt',
      'packages/ui/f4.txt',
      'packages/ui/f5.txt',
      '$ git diff --name-only origin/main...HEAD | cut -d/ -f1-2 | sort -u',
      '+ apps/web',
      '+ packages/ui',
    ], { title: 'output thật', dir: '~/mono-dev', branch: 'feature/nut-moi' })}
    ${box('info', 'Ba chấm <code>...</code> = so từ điểm rẽ nhánh, không tính commit mới trên main (bài 2.2).')}`,
    `<pre class="c-code"><code><span style="color:#ff7b72">on</span>:
  <span style="color:#ff7b72">pull_request</span>:
    <span style="color:#ff7b72">paths</span>:
      - <span style="color:#a5d6ff">'apps/web/**'</span>
      - <span style="color:#a5d6ff">'packages/ui/**'</span></code></pre>
    ${box('warn', 'Job bị lọc đường dẫn <b>không chạy ⇒ không báo</b>. Nếu nó là <b>required check</b>, PR chờ mãi (bài 6.4).')}`, 'r') },

  /* 14 */
  { t: 'Git LFS: con trỏ trong Git, file thật ở kho LFS', body: `
    ${diagram({ w: 1160, h: 210, nodes: [
      { id: 'g', x: 0, y: 10, w: 470, h: 120, t: 'Kho Git: design/hero.psd', d: 'version https://git-lfs.github.com/spec/v1\noid sha256:45c877c2…\nsize 5242880   (132 byte)', c: 'blu', mono: true },
      { id: 'l', x: 690, y: 10, w: 470, h: 120, t: 'Kho LFS (server)', d: '45c877c2… → 5 242 880 byte\ntải khi checkout', c: 'git', mono: true },
      { id: 'y', x: 380, y: 150, w: 400, h: 56, t: 'clone CÓ git-lfs → 5 242 880 byte', c: 'grn', mono: true },
    ], edges: [{ from: 'g', to: 'l', t: 'oid', c: 'git', fs: 'r', ts: 'l' }] })}
    ${two(term([
      '$ git lfs track "*.psd" "*.mp4"',
      'Tracking "*.psd"',
      '$ cat .gitattributes',
      '*.psd filter=lfs diff=lfs merge=lfs -text',
      '$ git cat-file -s HEAD:design/hero.psd',
      '+ 132',
      "$ ls -l design/hero.psd | awk '{print $5, $9}'",
      '5242880 design/hero.psd',
    ], { title: 'output thật — git-lfs 3.7.1', dir: '~/design' }),
    term([
      '# bạn cùng nhóm CHƯA cài git-lfs:',
      '$ git clone design.git ban-khong-lfs',
      'done.',
      "$ ls -l ban-khong-lfs/design/hero.psd | awk '{print $5, $9}'",
      '! 132 ban-khong-lfs/design/hero.psd',
      '# clone "thành công", app mở file hỏng',
    ], { title: 'output thật', dir: '~', branch: '' }), '')}` },

  /* 15 */
  { t: 'LFS KHÔNG có hiệu lực ngược', body: two(
    term([
      '# đã commit intro.mp4 (3 MB) TRƯỚC, rồi mới',
      '# git lfs track "*.mp4" + commit .gitattributes',
      '$ git lfs ls-files',
      '# ↑ không in gì: intro.mp4 không nằm trong LFS',
      '$ git cat-file -s HEAD:intro.mp4',
      '! 3145728',
      '$ git count-objects -vH | grep size-pack',
      'size-pack: 3.00 MiB',
      '$ git lfs migrate info --everything',
      '*.mp4          \t3.1 MB\t1/1 file \t100%',
    ], { title: 'output thật', dir: '~/video' }),
    steps([
      ['Chỉ file commit SAU <code>track</code>', 'file cũ vẫn nằm nguyên cỡ trong lịch sử ⇒ <code>git lfs migrate import</code> = viết lại lịch sử (Ch.8)'],
      ['Mọi người phải cài client', 'thiếu git-lfs ⇒ nhận con trỏ 132 byte thay cho ảnh'],
      ['Tính tiền riêng', 'GitHub tính dung lượng + băng thông LFS tách khỏi kho'],
      ['Vẫn không merge được', 'hai người sửa một .psd = chọn một bản'],
    ]), 'l') },

  /* 16 */
  { t: 'Đo trước, chọn công cụ sau', body: table(['Triệu chứng', 'Nguyên nhân', 'Dùng'], [
    ['Vá gấp phải bỏ dở nhánh, cài lại <code>node_modules</code>', 'một thư mục chỉ giữ được một nhánh', '+<code>git worktree add</code>'],
    ['Clone lâu, <code>.git</code> nặng dù chỉ cần vài gói', 'tải mọi blob của mọi phiên bản', '+<code>--filter=blob:none</code>'],
    ['Editor / watcher chậm vì 40 000 file', 'ghi ra đĩa mọi thư mục', '+<code>sparse-checkout set</code>'],
    ['Kho phình vì .psd, .mp4 mới thêm', 'nhị phân không nén delta được', '+<code>git lfs track</code> (trước khi commit)'],
    ['Kho ĐÃ phình từ trước', 'nhị phân nằm sẵn trong lịch sử', '!<code>lfs migrate import</code> / filter-repo — ai cũng clone lại'],
    ['Nhiều app dùng chung một thư viện', 'mã trùng giữa các kho', '!gói npm → monorepo → subtree → submodule'],
  ], { sm: true }) },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 10', body: table(['Muốn…', 'Gõ'], [
    ['Mở nhánh khác ở thư mục thứ hai', '<code>git worktree add -b hotfix/x ../hotfix main</code>'],
    ['Xem / xoá worktree', '<code>git worktree list</code> · <code>git worktree remove ../hotfix</code> · <code>prune</code>'],
    ['Thêm submodule', '<code>git submodule add &lt;url&gt; vendor/ui-kit</code> → commit'],
    ['Clone kho có submodule', '<code>git clone --recurse-submodules &lt;url&gt;</code> · sau clone thường: <code>submodule update --init</code>'],
    ['Dời ghim submodule sang bản mới', '<code>git submodule update --remote</code> → <code>git add vendor/ui-kit</code> → commit'],
    ['Chặn push kho cha khi kho con chưa push', '<code>git push --recurse-submodules=check</code>'],
    ['Nhúng mã bằng subtree', '<code>git subtree add --prefix vendor/ui-kit &lt;url&gt; main --squash</code>'],
    ['Clone ít blob + ít file', '<code>git clone --filter=blob:none --sparse &lt;url&gt;</code> → <code>sparse-checkout set a b</code>'],
    ['Đưa nhị phân mới vào LFS', '<code>git lfs install</code> · <code>git lfs track "*.psd"</code> · add <code>.gitattributes</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 10 (40 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: sửa dở một file, rồi <code>git worktree add -b hotfix/a ../thu-git-hotfix main</code>', 'commit ở worktree mới; quay lại: <code>git log -1 hotfix/a</code> thấy ngay, file dở còn nguyên'],
      ['<code>git init --bare ../ui-kit.git</code>, đẩy 2 commit vào, rồi <code>git -c protocol.file.allow=always submodule add ../ui-kit.git vendor/ui-kit</code>', '<code>git ls-files --stage vendor/ui-kit</code> phải ra <b>160000</b>'],
      ['Clone thường sang thư mục khác → <code>submodule status</code>', 'thấy dấu <b>-</b>; <code>update --init</code> xong thành dấu cách'],
      ['Làm lại bằng <code>git subtree add … --squash</code> trong một kho mới', 'mode <b>100644</b>, clone thường là có file'],
      ['<code>git worktree remove ../thu-git-hotfix</code>', '<code>git worktree list</code> chỉ còn một dòng'],
    ])}
    ${box('good', '<b>Đạt khi:</b> bạn chỉ ra được bằng output thật chỗ khác nhau giữa 160000 (submodule) và 100644 (subtree).')}` },
]);
