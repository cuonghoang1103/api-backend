/**
 * Git & GitHub · Deck git-08 — Chương 8: Viết lại lịch sử an toàn.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1, git-filter-repo 2.47.0) của
 * hai kho thử dựng bằng scratchpad/ch08-lab/lab.sh và lab3.sh (ngày giờ cố định ⇒ mã băm tái lập):
 *   lab.sh  — 06edfab init · 1ab137f form đăng nhập · b9e574e "tokn" (bị amend) → 986cfd4 → 46d3c6a (+token.config.js)
 *             feature/login: c8272a6 · 3bc9729 (bản cũ) · 8342020 An thêm đăng xuất · main: d53894d .env.example
 *             Cường rebase lên main: 7790ebe · 299ab8e · cách đúng: dcfaa76 · An tự cứu: 39313e2
 *   lab3.sh — 41d2b4b init · 723ea29 Stripe (.env) · 4e414d5 S3 (AKIA…) · f0c7fc8 bỏ .env · 1dcc959 docs
 *             sau filter-repo --invert-paths: 1c13a37 · f7fc22c · 10d4988 · e98bdbf
 *             sau --replace-text: e6662b7 · 917f045 · 80f1408
 * Dòng " Date: …" trong output amend/cherry-pick đã được cắt (chỉ hiện vì kho thử đặt ngày cố định).
 * Khoá trong kho thử là khoá GIẢ (AKIAIOSFODNN7EXAMPLE là khoá mẫu trong tài liệu AWS).
 */
import { S, cover, box, steps, table, flow, two, list, mindmap, graph, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-08', code: 'GIT · CHƯƠNG 8', title: 'Viết lại lịch sử an toàn', sub: 'Git & GitHub · Chương 8' };

const T = (lines, title = 'output thật — git 2.51', dir = '~/thu-git', branch = 'main') => term(lines, { title, dir, branch });

export const slides = S([
  cover({ t: 'Chương 8 — Viết lại lịch sử an toàn', sub: 'amend · --force-with-lease · --force-if-includes · gỡ khoá bị lộ bằng git filter-repo', chap: 'CHƯƠNG 8' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Viết lại lịch sử', 'mọi lần viết lại = mã băm MỚI', [
    { t: '8.1 commit --amend', d: 'thay commit cuối bằng một commit mới', c: 'amb' },
    { t: '8.2 force-push an toàn', d: '--force-with-lease + --force-if-includes', c: 'git' },
    { t: 'Khi bị ghi đè', d: 'reflog của bạn cùng nhóm · rebase lên lịch sử mới', c: 'blu' },
    { t: '8.3 khoá bị lộ', d: 'ĐỔI KHOÁ trước → filter-repo → force-push', c: 'red' },
    { t: 'Chi phí phối hợp', d: 'cả nhóm clone lại · fork/cache GitHub vẫn còn', c: 'vio' },
  ]) },

  /* 3 */
  { t: 'amend KHÔNG sửa commit — nó thay bằng commit mới', body: `
    ${graph({ w: 1160, h: 240, x0: 110, y0: 72, dx: 260, dy: 105, commits: [
      { id: '06ed', x: 0, t: 'init' },
      { id: '1ab1', x: 1, p: ['06ed'], t: 'form đăng nhập' },
      { id: 'b9e5', x: 2, lane: 1, p: ['1ab1'], ghost: true, t: '“tokn” — bị bỏ rơi' },
      { id: '986c', x: 2.6, p: ['1ab1'], hl: true, c: 'grn', t: 'commit MỚI' },
    ], refs: [{ to: '986c', n: 'HEAD → main', k: 'head' }, { to: 'b9e5', n: 'HEAD@{1}', k: 'note' }] })}
    ${T(['$ git commit -m "feat(auth): add refresh tokn rotation"', '[main b9e574e] feat(auth): add refresh tokn rotation', '$ git commit --amend -m "feat(auth): add refresh token rotation"', '= [main 986cfd4] feat(auth): add refresh token rotation', '$ git reflog -3', '+ 986cfd4 HEAD@{0}: commit (amend): feat(auth): add refresh token rotation', 'b9e574e HEAD@{1}: commit: feat(auth): add refresh tokn rotation', '1ab137f HEAD@{2}: commit: feat(auth): thêm form đăng nhập'])}` },

  /* 4 */
  { t: 'amend --no-edit: thêm file quên, giữ nguyên lời nhắn', body: two(
    `${graph({ w: 560, h: 290, x0: 70, y0: 70, dx: 190, dy: 95, commits: [
      { id: '1ab1', x: 0, t: 'form đăng nhập' },
      { id: '986c', x: 1, lane: 1, p: ['1ab1'], ghost: true, t: 'thiếu 1 file' },
      { id: '46d3', x: 2, p: ['1ab1'], hl: true, c: 'grn', t: 'đủ 2 file' },
    ], refs: [{ to: '46d3', n: 'HEAD → main', k: 'head' }] })}
    ${box('tip', 'Mỗi lần amend đẻ một mã băm mới: <code>b9e5</code> → <code>986c</code> → <code>46d3</code>. Chưa push thì chẳng ai biết.')}`,
    T(['$ git add token.config.js', '$ git commit --amend --no-edit', '= [main 46d3c6a] feat(auth): add refresh token rotation', ' 2 files changed, 2 insertions(+)', ' create mode 100644 token.config.js', ' create mode 100644 token.js', '$ git log --oneline @{u}..HEAD', '+ 46d3c6a feat(auth): add refresh token rotation', '# có dòng = CHƯA push → amend thoải mái']), 'r') },

  /* 5 */
  { t: 'Amend một commit ĐÃ push → hai lịch sử phân nhánh', body: `
    ${graph({ w: 1160, h: 215, x0: 120, y0: 60, dx: 300, dy: 95, commits: [
      { id: '1ab1', x: 0, t: 'form đăng nhập' },
      { id: '46d3', x: 1, p: ['1ab1'], t: 'đã push' },
      { id: '2177', x: 1.6, lane: 1, p: ['1ab1'], c: 'amb', hl: true, t: 'bản amend' },
    ], refs: [{ to: '46d3', n: 'origin/main', k: 'remote' }, { to: '2177', n: 'HEAD → main', k: 'head' }] })}
    ${two(
      T(['$ git commit --amend -m "feat(auth): xoay vòng refresh token"', '$ git push', '!  ! [rejected]        main -> main (non-fast-forward)', "! error: failed to push some refs to '../origin.git'", '$ git status -sb', '+ ## main...origin/main [ahead 1, behind 1]']),
      table(['Commit ở đâu', 'Amend?'], [['Chỉ trên máy bạn', '+thoải mái'], ['Đã push, nhánh riêng', '!amend + <code>--force-with-lease</code>'], ['Đã push, nhánh chung', '-KHÔNG — commit mới']], { sm: true }), 'l')}` },

  /* 6 */
  { t: 'Kịch bản: hai máy, một nhánh feature/login', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'c', x: 0, y: 30, w: 360, h: 130, ic: '💻', t: 'Máy Cường', d: 'vừa rebase lên main\nfeature/login = 299ab8e\norigin/feature/login = 3bc9729 (cũ)', c: 'git' },
      { id: 's', x: 420, y: 200, w: 320, h: 120, ic: '☁️', t: 'origin (GitHub)', d: 'feature/login = 8342020\n(có commit của An)', c: 'blu' },
      { id: 'a', x: 800, y: 30, w: 360, h: 130, ic: '💻', t: 'Máy An', d: 'thêm “đăng xuất” 8342020\nđã push xong', c: 'grn' },
    ], edges: [
      { from: 'a', to: 's', t: '① git push', c: 'grn', fs: 'b', ts: 'r' },
      { from: 'c', to: 's', t: '② push -f ?', c: 'red', fs: 'b', ts: 'l', dash: true },
    ] })}
    ${box('warn', 'Cường <b>chưa hề nhìn thấy</b> 8342020. Nếu bước ② ghi đè, commit “đăng xuất” của An biến khỏi nhánh — mà Cường không biết mình vừa xoá gì.')}` },

  /* 7 */
  { t: '--force ghi đè mù · --force-with-lease hỏi trước', body: `
    ${graph({ w: 1160, h: 215, x0: 150, y0: 40, dx: 200, dy: 110, lanes: [{ lane: 0, n: 'Cường', c: 'git' }, { lane: 1, n: 'server', c: 'blu' }], commits: [
      { id: '46d3', x: 0 },
      { id: 'd538', x: 1, p: ['46d3'], t: 'từ main' }, { id: '7790', x: 2, p: ['d538'], t: 'bản rebase' }, { id: '299a', x: 3, p: ['7790'], hl: true, t: 'bản rebase' },
      { id: 'c827', x: 1.5, lane: 1, p: ['46d3'], c: 'blu', t: 'chặn email' }, { id: '3bc9', x: 2.5, lane: 1, p: ['c827'], c: 'blu', t: 'kiểm mật khẩu' }, { id: '8342', x: 3.5, lane: 1, p: ['3bc9'], c: 'grn', hl: true, t: 'An: đăng xuất' },
    ] })}
    ${two(
      T(['$ git push --force', '!  + 8342020...299ab8e feature/login -> feature/login (forced update)', '# 8342020 (An) không còn nhánh nào trỏ tới'], 'bản sao w-force', '~/thu-git', 'feature/login'),
      T(['$ git push --force-with-lease', '=  ! [rejected]        feature/login -> feature/login (stale info)', "error: failed to push some refs to '../origin.git'", '# server ≠ origin/feature/login của tôi → dừng'], 'output thật', '~/thu-git', 'feature/login'), '')}` },

  /* 8 */
  { t: 'Bẫy: IDE tự fetch nền làm chốt an toàn “gật đầu”', body: `
    ${steps([
      ['Lease so <b>server</b> với <code>origin/feature/login</code> TRÊN MÁY BẠN', 'không so với thứ bạn đã đọc'],
      ['VS Code bật <code>git.autofetch</code> (hoặc GUI, dấu nhắc shell tự fetch)', '<code>origin/feature/login</code> lặng lẽ nhảy lên 8342020 — bạn chưa xem commit nào'],
      ['Lease so 8342020 với 8342020 → khớp → cho push', 'commit của An bị đè y hệt <code>--force</code>'],
    ])}
    ${T(['# IDE tự fetch nền:', '$ git fetch', '   3bc9729..8342020  feature/login -> origin/feature/login', '$ git push --force-with-lease', '!  + 8342020...299ab8e feature/login -> feature/login (forced update)'], 'output thật — bản sao w-fetch', '~/thu-git', 'feature/login')}` },

  /* 9 */
  { t: '--force-if-includes bịt lỗ hổng (Git 2.30+)', body: two(
    `${T(['# cùng tình huống: IDE vừa fetch', '$ git push --force-with-lease --force-if-includes', '=  ! [rejected]        feature/login -> feature/login (remote ref updated since checkout)', 'hint: Updates were rejected because the tip of the remote-tracking branch has', 'hint: been updated since the last checkout.'], 'output thật', '~/thu-git', 'feature/login')}
    ${T(['$ git config --global push.useForceIfIncludes true', '# từ giờ --force-with-lease tự kèm --force-if-includes'], 'cấu hình một lần', '~', '')}`,
    `${box('info', '<b>Nó đòi thêm một điều:</b> đỉnh <code>origin/feature/login</code> phải nằm trong lịch sử nhánh của bạn (hoặc trong reflog của nhánh). Fetch mà chưa tích hợp ⇒ từ chối.')}
    ${table(['Cờ', 'IDE fetch nền'], [['<code>--force</code>', '-đè'], ['<code>--force-with-lease</code>', '-đè'], ['<code>… --force-if-includes</code>', '+từ chối']], { sm: true })}
    ${box('tip', 'Alias: <code>git config --global alias.pushf "push --force-with-lease --force-if-includes"</code>')}`, 'l') },

  /* 10 */
  { t: 'Bị từ chối? Đọc — tích hợp — push lại', body: two(
    T(['$ git fetch', '$ git log --oneline HEAD..origin/feature/login', '+ 8342020 feat(auth): thêm đăng xuất', '3bc9729 feat(auth): kiểm độ dài mật khẩu', 'c8272a6 feat(auth): chặn email rỗng', '$ git rebase origin/feature/login', 'warning: skipped previously applied commit 7790ebe', 'warning: skipped previously applied commit 299ab8e', 'Successfully rebased and updated refs/heads/feature/login.', '$ git push --force-with-lease --force-if-includes', '=    8342020..dcfaa76  feature/login -> feature/login'], 'output thật', '~/thu-git', 'feature/login'),
    `${graph({ w: 500, h: 150, x0: 40, y0: 80, dx: 125, r: 20, commits: [
      { id: 'c827', x: 0 }, { id: '3bc9', x: 1, p: ['c827'] }, { id: '8342', x: 2, p: ['3bc9'], c: 'grn' }, { id: 'dcfa', x: 3, p: ['8342'], hl: true },
    ], refs: [{ to: 'dcfa', n: 'feature/login', k: 'branch' }, { to: '8342', n: 'An', k: 'note' }] })}
    ${list(['Git tự bỏ 2 bản sao trùng (“skipped previously applied”)', 'Push ra <code>8342020..dcfaa76</code> — không có dấu <b>+</b>: chẳng ghi đè ai', 'Lời từ chối <b>là thông tin</b>, đừng ép qua bằng <code>--force</code>'])}`, 'l') },

  /* 11 */
  { t: 'Bị force-push đè: commit vẫn còn — tìm và đặt lại', body: two(
    T(['$ git fetch', ' + 8342020...299ab8e feature/login -> origin/feature/login  (forced update)', '$ git status -sb', '! ## feature/login...origin/feature/login [ahead 3, behind 3]', '$ git rebase origin/feature/login', 'warning: skipped previously applied commit c8272a6', 'warning: skipped previously applied commit 3bc9729', 'Successfully rebased and updated refs/heads/feature/login.', '$ git push', '=    299ab8e..39313e2  feature/login -> feature/login'], 'máy An — output thật', '~/an', 'feature/login'),
    `${T(['$ git cat-file -t 8342020', 'commit', '$ git branch --contains 8342020', '# (trống) — còn object, không còn nhánh'], 'trên server (kho bare)', '~/origin.git', '')}
    ${box('good', 'Dòng <code>+ 8342020...299ab8e</code> chính là mã băm <b>trước</b> khi bị đè. Máy An vẫn còn commit ⇒ rebase lên lịch sử mới rồi push thường.')}`, 'l') },

  /* 12 */
  { t: 'Khoá bị lộ: thứ tự là tất cả', body: `
    ${diagram({ w: 1160, h: 300, nodes: [
      { id: 'a', x: 0, y: 10, w: 340, h: 100, t: '① ĐỔI KHOÁ', d: 'thu hồi ở nhà cung cấp, cấp khoá mới\ntừng phút đều quan trọng', c: 'red' },
      { id: 'b', x: 410, y: 10, w: 340, h: 100, t: '② Đánh giá', d: 'công khai hay riêng tư? sống bao lâu?\nnhật ký dùng khoá có lạ không?', c: 'amb' },
      { id: 'c', x: 820, y: 10, w: 340, h: 100, t: '③ Chặn tái diễn', d: '.gitignore · .env.example\ncommit phần đó', c: 'amb' },
      { id: 'd', x: 820, y: 190, w: 340, h: 100, t: '④ Dọn lịch sử', d: 'git filter-repo trên bản clone MỚI\n→ git push --force --mirror', c: 'git' },
      { id: 'e', x: 410, y: 190, w: 340, h: 100, t: '⑤ Phối hợp', d: 'cả nhóm cứu việc chưa push\nrồi clone lại · PR cũ mở lại', c: 'vio' },
      { id: 'f', x: 0, y: 190, w: 340, h: 100, t: '⑥ Nhờ GitHub Support', d: 'gỡ PR refs, cache, gc server\nfork: KHÔNG xoá hộ', c: 'blu' },
    ], edges: [
      { from: 'a', to: 'b', c: 'red' }, { from: 'b', to: 'c', c: 'amb' }, { from: 'c', to: 'd', c: 'amb' },
      { from: 'd', to: 'e', c: 'git' }, { from: 'e', to: 'f', c: 'vio' },
    ] })}
    ${box('bad', 'Bot quét GitHub công khai tìm khoá <b>liên tục</b>. Làm ④–⑥ mà chưa làm ① là dọn nhà trong khi cửa vẫn mở.')}` },

  /* 13 */
  { t: '“Xoá dòng rồi commit” không xoá được gì', body: two(
    T(['$ git log -S"sk_live_" --oneline --all', '+ f0c7fc8 fix: bỏ .env khỏi repo', '+ 723ea29 feat(pay): tích hợp Stripe', '$ git show HEAD~2:.env', '! STRIPE_KEY=sk_live_51H8xK2abcdef', 'DB_URL=postgres://localhost/swp', '# commit “bỏ .env” vẫn để khoá nằm trong 723ea29']),
    `${T(['$ git grep -l "AKIA[0-9A-Z]{16}" $(git rev-list --all)', '# (trống!) — BRE coi {16} là chữ thường', '$ git grep -lE "AKIA[0-9A-Z]{16}" $(git rev-list --all)', '= 1dcc959f8cdd170d620a94c56c4bdd92ac6cf332:s3.js', '= f0c7fc85451d824434b8a3cd7c8aeb9e2845d26c:s3.js', '= 4e414d51834d3f26c92f582cfb8a7bd0410208f9:s3.js'], 'quét MỌI commit — cần -E')}
    ${box('warn', 'Một vụ lộ thường nằm ở <b>nhiều</b> commit, và có thể ở nhiều file.')}`, '') },

  /* 14 */
  { t: 'git filter-repo: mọi commit từ chỗ bẩn trở đi đổi mã băm', body: `
    ${graph({ w: 1160, h: 215, x0: 150, y0: 80, dx: 200, dy: 95, lanes: [{ lane: 0, n: 'trước', c: 'dim' }, { lane: 1, n: 'sau', c: 'grn' }], commits: [
      { id: '41d2', x: 0, t: '' }, { id: '723e', x: 1, p: ['41d2'], ghost: true }, { id: '4e41', x: 2, p: ['723e'], ghost: true }, { id: 'f0c7', x: 3, p: ['4e41'], ghost: true }, { id: '1dcc', x: 4, p: ['f0c7'], ghost: true },
      { id: '1c13', x: 1, lane: 1, p: ['41d2'], c: 'grn' }, { id: 'f7fc', x: 2, lane: 1, p: ['1c13'], c: 'grn' }, { id: '10d4', x: 3, lane: 1, p: ['f7fc'], c: 'grn' }, { id: 'e98b', x: 4, lane: 1, p: ['10d4'], c: 'grn', hl: true },
    ], refs: [{ to: '41d2', n: 'giữ nguyên', k: 'note' }, { to: '723e', n: 'commit bẩn đầu tiên', k: 'remote' }] })}
    ${two(
      T(['$ git filter-repo --invert-paths --path .env', '! Aborting: Refusing to destructively overwrite repo history since', '! this does not look like a fresh clone.', 'Please operate on a fresh clone instead.'], 'chạy trên kho đang làm việc', '~/thu-git'),
      T(['$ git clone --mirror origin.git sach.git && cd sach.git', '$ git filter-repo --invert-paths --path .env', "NOTICE: Removing 'origin' remote; see 'Why is my origin removed?'", 'Parsed 5 commits', '= Completely finished after 0.21 seconds.'], 'trên bản clone MỚI', '~/k', ''), '')}` },

  /* 15 */
  { t: 'Quy trình GitHub khuyên dùng (filter-repo 2.47+)', body: two(
    term(['$ git clone --no-local origin2.git sach2 && cd sach2', '$ git filter-repo --sensitive-data-removal --invert-paths --path .env', 'NOTICE: Fetching all refs from origin to make sure we rewrite', '        all history that may reference the sensitive data, via', 'You rewrote 4 (of 5) commits.', '+ NOTE: First Changed Commit(s) is/are:', '+   723ea29a3a19e3991980c23bab013454b9d87f3e', '# remote origin vẫn còn — không phải thêm lại', '$ git push --force --mirror origin', '=  + 1dcc959...e98bdbf main -> main (forced update)'], { title: 'output thật — git-filter-repo 2.47', dir: '~/k', branch: '' }),
    `${list(['<code>--sensitive-data-removal</code> kéo <b>mọi ref</b> (cả <code>refs/pull/*</code>) về để viết lại hết, và <b>giữ</b> remote origin', '“First Changed Commit” — mã băm cần gửi GitHub Support', 'Thay chữ thay vì xoá file: <code>--replace-text rules.txt</code> với dòng <code>AKIA…==&gt;***REMOVED***</code>'])}
    ${box('info', 'Theo docs.github.com (tính đến 09/2026): đổi/thu hồi khoá là <b>bước đầu tiên</b>; <code>refs/pull/*</code> chỉ đọc nên chỉ Support gỡ được.')}`, 'l') },

  /* 16 */
  { t: 'Force-push xong vẫn còn sót — ở ba chỗ', body: `
    ${diagram({ w: 1160, h: 200, nodes: [
      { id: 's', x: 0, y: 40, w: 340, h: 120, ic: '☁️', t: 'Server', d: 'object 723ea29 vẫn còn\nmở được bằng mã băm đầy đủ\nPR refs · cache', c: 'red' },
      { id: 'f', x: 410, y: 40, w: 340, h: 120, ic: '🍴', t: 'Fork', d: 'bản sao riêng của người khác\nGitHub không xoá hộ', c: 'amb' },
      { id: 'b', x: 820, y: 40, w: 340, h: 120, ic: '💻', t: 'Clone cũ của đồng đội', d: 'pull + push = đẩy khoá\nlên LẠI', c: 'vio' },
    ] })}
    ${two(
      T(['$ git cat-file -p 723ea29:.env', '! STRIPE_KEY=sk_live_51H8xK2abcdef', '$ git branch --contains 723ea29', '# (trống) — không nhánh nào, object vẫn đó'], 'server sau force-push', '~/origin.git', ''),
      T(['$ git pull', ' + 1dcc959...80f1408 main       -> origin/main  (forced update)', '! fatal: Need to specify how to reconcile divergent branches.', '$ git status -sb', '+ ## main...origin/main [ahead 5, behind 4]'], 'máy Bình (clone cũ)', '~/binh'), '')}` },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 8', body: table(['Muốn…', 'Gõ'], [
    ['Sửa lời nhắn commit cuối (chưa push)', '<code>git commit --amend -m "…"</code>'],
    ['Thêm file quên vào commit cuối', '<code>git add f</code> → <code>git commit --amend --no-edit</code>'],
    ['Commit còn là của riêng mình không?', '<code>git log --oneline @{u}..HEAD</code> (có dòng = chưa push)'],
    ['Force-push nhánh riêng một cách an toàn', '<code>git push --force-with-lease --force-if-includes</code>'],
    ['Bật mặc định cho lease', '<code>git config --global push.useForceIfIncludes true</code>'],
    ['Bị từ chối “stale info”', '<code>git fetch</code> → <code>git log HEAD..origin/&lt;nhánh&gt;</code> → <code>git rebase origin/&lt;nhánh&gt;</code>'],
    ['Tìm khoá trong mọi commit', '<code>git log -S"sk_live_" --all</code> · <code>git grep -nE "…" $(git rev-list --all)</code>'],
    ['Gỡ file khỏi toàn bộ lịch sử', 'ĐỔI KHOÁ → <code>git filter-repo --sensitive-data-removal --invert-paths --path .env</code>'],
    ['Đẩy lịch sử đã dọn', '<code>git push --force --mirror origin</code> → cả nhóm clone lại'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 8 (30 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: commit có lỗi chính tả → <code>--amend</code>', 'so mã băm trước/sau bằng <code>git reflog -2</code>'],
      ['Clone <code>thu-git-server.git</code> ra thư mục <code>ban-an</code>, push một commit từ đó', 'đóng vai bạn cùng nhóm'],
      ['Quay lại <code>thu-git</code>: amend commit đã push rồi <code>git push --force-with-lease</code>', 'phải thấy <code>(stale info)</code>'],
      ['<code>git fetch</code> rồi thử lại với <code>--force-if-includes</code>', 'phải thấy <code>(remote ref updated since checkout)</code>'],
      ['Commit một <code>.env</code> giả, dọn bằng <code>git filter-repo</code> trên bản clone MỚI', '<code>git log -S</code> trả về trống'],
    ])}
    ${box('good', '<b>Đạt khi:</b> commit của “bạn cùng nhóm” vẫn còn trên server sau mọi lần push của bạn, và <code>git log -S"sk_live_" --all</code> trên bản đã dọn không in dòng nào.')}` },
]);
