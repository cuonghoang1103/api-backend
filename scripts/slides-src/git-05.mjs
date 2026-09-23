/**
 * Git & GitHub · Deck git-05 — Chương 5: Remote & GitHub.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1) của kho thử dựng bằng
 * scratchpad/ch05-lab/lab.sh — "máy chủ" là kho trần (git init --bare) trên cùng đĩa,
 * nên URL remote là ../server.git thay vì git@github.com:… (KHÔNG push lên GitHub thật).
 * Ngày giờ cố định ⇒ mã băm tái lập được:
 *   abdf9a8 init · 5c1df3b form đăng nhập · ca54b35 (An) thêm footer
 *   09dbc98 (Cường) kiểm mật khẩu rỗng → pull merge: 0411510 · pull --rebase: 78096f0
 *   feature/avatar 2acba20 → becf82d · tag v1.0 (trên 78096f0) · v1.1 trên d49e34b
 *   fork: 1ee814d init · de6d59f feed · upstream thêm c55a330, 10655e6
 * Dòng "Rebasing (1/1)" (in bằng \r, bị ghi đè trên terminal thật) đã bỏ.
 */
import { S, cover, box, steps, table, two, list, code, mindmap, graph, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-05', code: 'GIT · CHƯƠNG 5', title: 'Remote & GitHub', sub: 'Git & GitHub · Chương 5' };

/** Chèn khung nhóm (nền mờ + nhãn) vào SVG của diagram(), vẽ DƯỚI các hộp. */
const khung = (svg, frames) => svg.replace('</defs>', '</defs>' + frames.map(({ x, y, w, h, t, c = '#9da7b3' }) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="rgba(255,255,255,.025)" stroke="${c}" stroke-width="1.5" stroke-dasharray="6 6"/>` +
  `<text x="${x + 16}" y="${y + 26}" font-size="16" font-weight="800" fill="${c}">${t}</text>`).join(''));

export const slides = S([
  cover({ t: 'Chương 5 — Remote & GitHub', sub: 'origin/main · fetch vs pull · SSH & token · push, tag, xoá nhánh · fork & upstream', chap: 'CHƯƠNG 5' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Remote', 'một bản clone khác, có tên', [
    { t: '5.1 Remote, fetch, pull', d: 'origin/main là ẢNH CHỤP · fetch an toàn · pull = fetch + merge', c: 'blu' },
    { t: '5.2 Xác thực', d: 'SSH key ed25519 · HTTPS + token fine-grained · credential helper', c: 'amb' },
    { t: '5.3 Push', d: '-u (upstream) · ba lời từ chối · xoá nhánh · tag phải push riêng', c: 'git' },
    { t: '5.4 Fork & upstream', d: 'hai remote · đồng bộ fork · pull request từ fork', c: 'grn' },
  ]) },

  /* 3 */
  { t: 'Máy bạn ↔ origin: ba thứ mang tên "main"', body: `
    ${khung(diagram({ w: 1160, h: 330, nodes: [
      { id: 'm', x: 40, y: 60, w: 300, h: 90, t: 'main', d: 'nhánh cục bộ — bạn commit lên', c: 'grn', mono: true },
      { id: 'om', x: 40, y: 200, w: 300, h: 90, t: 'origin/main', d: 'ảnh chụp lần fetch/push cuối', c: 'red', dash: true, mono: true },
      { id: 's', x: 830, y: 70, w: 290, h: 100, t: 'main', d: 'bản THẬT trên máy chủ', c: 'blu', mono: true },
    ], edges: [
      { from: 's', to: 'om', t: 'git fetch (tải về)', c: 'blu', fs: 'b', ts: 'r', off: 22 },
      { from: 'm', to: 's', t: 'git push (đẩy lên)', c: 'grn', fs: 'r', ts: 'l', off: -8 },
      { from: 'om', to: 'm', t: 'merge / rebase', c: 'amb', fs: 't', ts: 'b', off: 6 },
    ] }), [
      { x: 10, y: 10, w: 470, h: 310, t: '💻 Máy bạn — ~/thu-git', c: '#ffc233' },
      { x: 800, y: 10, w: 350, h: 200, t: '☁️ origin — GitHub', c: '#58a6ff' },
    ])}
    ${two(term(['$ git remote -v', 'origin\t../server.git (fetch)', 'origin\t../server.git (push)'], { title: 'output thật (máy chủ giả)', dir: '~/thu-git' }),
      box('info', '<b>origin</b> chỉ là biệt danh của một URL. <b>origin/main</b> không tự cập nhật — nó chỉ dịch khi bạn chạy fetch, pull hoặc push.'))}` },

  /* 4 */
  { t: 'origin/main KHÔNG phải bản trực tiếp', body: `
    ${two(
      `${box('warn', '<b>Máy Cường</b> — chưa fetch')}
      ${graph({ w: 560, h: 190, x0: 60, y0: 92, dx: 180, commits: [
        { id: 'abdf', x: 0, t: 'init' }, { id: '5c1d', x: 1, p: ['abdf'], t: 'form login' },
        { id: '09db', x: 2, p: ['5c1d'], t: 'kiểm mk rỗng', c: 'amb', hl: true },
      ], refs: [{ to: '5c1d', n: 'origin/main', k: 'remote' }, { to: '09db', n: 'HEAD → main', k: 'head' }] })}`,
      `${box('info', '<b>Máy chủ</b> — An vừa push')}
      ${graph({ w: 560, h: 190, x0: 60, y0: 92, dx: 180, commits: [
        { id: 'abdf', x: 0, t: 'init' }, { id: '5c1d', x: 1, p: ['abdf'], t: 'form login' },
        { id: 'ca54', x: 2, p: ['5c1d'], t: 'footer (An)', c: 'blu', hl: true },
      ], refs: [{ to: 'ca54', n: 'main', k: 'branch' }] })}`)}
    ${two(term(['$ git status -sb', '## main...origin/main [ahead 1]', '# "ahead 1" — nhưng thật ra đã lệch nhau!'], { title: 'output thật — trước khi fetch', dir: '~/thu-git' }),
      box('bad', '<code>git status</code> so với <b>ảnh chụp cũ</b>, không hỏi máy chủ. Nó không biết commit <b>ca54</b> của An tồn tại.'))}` },

  /* 5 */
  { t: 'git fetch — tải về, KHÔNG đụng việc của bạn', body: two(
    `${graph({ w: 440, h: 310, x0: 50, y0: 100, dx: 150, dy: 110, commits: [
      { id: 'abdf', x: 0, t: 'init' }, { id: '5c1d', x: 1, p: ['abdf'], t: 'form login' },
      { id: '09db', x: 2, p: ['5c1d'], t: 'của Cường', c: 'amb' },
      { id: 'ca54', x: 2, lane: 1, p: ['5c1d'], t: 'của An', c: 'blu', hl: true },
    ], refs: [{ to: '09db', n: 'HEAD → main', k: 'head' }, { to: 'ca54', n: 'origin/main', k: 'remote', side: 'down' }] })}
    ${box('good', 'Chỉ <b>origin/main</b> dịch. main, Index, thư mục làm việc: <b>y nguyên</b>.')}`,
    term(['$ git fetch', 'From ../server', '+    5c1df3b..ca54b35  main       -> origin/main', '$ git status', 'On branch main', "! Your branch and 'origin/main' have diverged,", '! and have 1 and 1 different commits each, respectively.', '$ git branch -vv', '* main 09dbc98 [origin/main: ahead 1, behind 1] fix(auth): kiểm mật khẩu rỗng'], { title: 'output thật', dir: '~/thu-git' }), 'r2') },

  /* 6 */
  { t: 'pull = fetch + tích hợp: merge hay rebase', body: two(
    `${box('info', '<code>git pull --no-rebase</code> → commit hợp nhất')}
    ${graph({ w: 560, h: 250, x0: 60, y0: 80, dx: 150, dy: 100, commits: [
      { id: '5c1d', x: 0, t: 'form login' }, { id: '09db', x: 1, p: ['5c1d'], c: 'amb', t: 'Cường' },
      { id: 'ca54', x: 1, lane: 1, p: ['5c1d'], c: 'blu', t: 'An' },
      { id: '0411', x: 2.2, p: ['09db', 'ca54'], star: true, hl: true, t: 'Merge branch…' },
    ], refs: [{ to: '0411', n: 'HEAD → main', k: 'head' }] })}
    ${list(['Giữ nguyên hình rẽ đôi', 'Thêm một commit “Merge branch ’main’ of …”'])}`,
    `${box('good', '<code>git pull --rebase</code> → một đường thẳng')}
    ${graph({ w: 560, h: 250, x0: 60, y0: 80, dx: 150, dy: 100, commits: [
      { id: '5c1d', x: 0, t: 'form login' }, { id: 'ca54', x: 1, p: ['5c1d'], c: 'blu', t: 'An' },
      { id: '7809', x: 2, p: ['ca54'], c: 'amb', hl: true, t: 'Cường (mới)' },
      { id: '09db', x: 1, lane: 1, p: ['5c1d'], ghost: true, t: 'bản cũ' },
    ], refs: [{ to: '7809', n: 'HEAD → main', k: 'head' }] })}
    ${list(['Commit của bạn được <b>chép lại</b> lên trên → mã băm mới 78096f0', 'Chỉ làm với commit CHƯA push'])}`) },

  /* 7 */
  { t: 'git 2.51: pull trần từ chối khi hai bên lệch nhau', body: two(
    term(['$ git pull', 'hint: You have divergent branches and need to specify how to reconcile them.', 'hint:   git config pull.rebase false  # merge', 'hint:   git config pull.rebase true   # rebase', 'hint:   git config pull.ff only       # fast-forward only', '! fatal: Need to specify how to reconcile divergent branches.', '$ git pull --ff-only', '! fatal: Not possible to fast-forward, aborting.'], { title: 'output thật (đã cắt vài dòng hint)', dir: '~/thu-git' }),
    `${table(['Cấu hình', 'Khi hai bên lệch'], [
      ['<code>pull.ff only</code>', '+dừng lại, để BẠN chọn'],
      ['<code>pull.rebase true</code>', '!tự rebase'],
      ['<code>pull.rebase false</code>', 'tự merge (kiểu cũ)'],
    ], { sm: true })}
    ${box('tip', 'Đặt một lần: <code>git config --global pull.ff only</code>. Không lệch ⇒ pull tua thẳng (fast-forward) bình thường.')}`, 'l') },

  /* 8 */
  { t: 'Xác thực: SSH key hay HTTPS + token', body: `
    ${khung(diagram({ w: 1160, h: 300, nodes: [
      { id: 'k', x: 30, y: 44, w: 330, h: 90, t: '🔑 ~/.ssh/id_ed25519', d: 'khoá BÍ MẬT — không rời máy', c: 'amb', mono: true },
      { id: 'kp', x: 800, y: 44, w: 330, h: 90, t: 'id_ed25519.pub', d: 'khoá CÔNG KHAI — dán lên GitHub', c: 'grn', mono: true },
      { id: 't', x: 30, y: 192, w: 330, h: 90, t: '🗝 Keychain / GCM', d: 'giữ token github_pat_… đã mã hoá', c: 'blu' },
      { id: 'gh', x: 800, y: 192, w: 330, h: 90, t: 'github.com :443', d: 'token thay cho MẬT KHẨU', c: 'vio' },
    ], edges: [
      { from: 'k', to: 'kp', t: 'git@github.com:… (SSH, cổng 22)', c: 'amb' },
      { from: 't', to: 'gh', t: 'https://github.com/… (HTTPS)', c: 'blu' },
    ] }), [
      { x: 12, y: 4, w: 366, h: 292, t: '💻 Máy bạn', c: '#ffc233' },
      { x: 782, y: 4, w: 366, h: 292, t: '☁️ GitHub', c: '#58a6ff' },
    ])}
    ${table(['', 'SSH', 'HTTPS + token'], [
      ['Thiết lập', 'một lần: tạo khoá, dán .pub', 'tạo token, dán khi Git hỏi mật khẩu'],
      ['Hết hạn', '+không (đến khi bạn gỡ)', '!theo ngày bạn chọn khi tạo'],
      ['Mạng chặn cổng 22', '-hỏng (dùng ssh.github.com:443)', '+vẫn chạy'],
    ], { sm: true })}` },

  /* 9 */
  { t: 'Token fine-grained: chỉ cấp đúng thứ cần', body: two(
    steps([
      ['Settings → Developer settings → Personal access tokens → <b>Fine-grained tokens</b>', 'Generate new token'],
      ['<b>Expiration</b>: đặt hạn (vd 90 ngày)', 'vô thời hạn được phép nhưng đừng'],
      ['<b>Repository access</b>: Only select repositories', 'chỉ kho đồ án, không phải mọi kho'],
      ['<b>Permissions → Contents: Read and write</b>', 'đủ để push; sửa .github/workflows thì thêm Workflows'],
    ]),
    `${table(['Máy', 'credential.helper'], [
      ['macOS', '<code>osxkeychain</code>'],
      ['Windows', '<code>manager</code> (GCM, có sẵn)'],
      ['Linux', '<code>libsecret</code> · tạm: <code>cache</code>'],
      ['Đừng dùng', '-<code>store</code> — chữ thô trong ~/.git-credentials'],
    ], { sm: true })}
    ${box('bad', 'Không nhét token vào URL: <code>https://ghp_…@github.com</code> nằm chữ thô trong <code>.git/config</code>.')}`, 'r') },

  /* 10 */
  { t: 'Tạo khoá ed25519 và nối vào GitHub', body: two(
    term(['$ ssh-keygen -t ed25519 -C cuong@example.com -f ../khoa_thu -N \'\'', 'Generating public/private ed25519 key pair.', 'Your identification has been saved in ../khoa_thu', 'Your public key has been saved in ../khoa_thu.pub', 'The key fingerprint is:', '+ SHA256:b9smUStcZs3xPsC9vgayZ3Q23ak006tYMZ/xnfkPNzM cuong@example.com', '$ cat ../khoa_thu.pub', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJM+7Ufq0oJ22Zt4UDvOhdzJZYqsufqxE2mAveQbAqzI cuong@example.com', '# dùng thật: bỏ -f/-N ⇒ lưu ~/.ssh/id_ed25519 + đặt passphrase'], { title: 'output thật — khoá thử, đã xoá', dir: '~/lab', branch: '' }),
    `${code('Host github.com\n  AddKeysToAgent yes\n  UseKeychain yes\n  IdentityFile ~/.ssh/id_ed25519', 'bash')}
    ${table(['Thông báo', 'Nghĩa là'], [
      ['<code>Permission denied (publickey)</code>', 'khoá chưa nạp / chưa dán .pub'],
      ['<code>Invalid username or token</code>', 'gõ MẬT KHẨU thay vì token, hoặc token hết hạn'],
      ['<code>403</code> khi push', 'token thiếu Contents: write'],
    ], { sm: true })}`, 'l') },

  /* 11 */
  { t: 'push -u: nối nhánh của bạn với nhánh trên máy chủ', body: two(
    term(['$ git push', '! fatal: The current branch feature/avatar has no upstream branch.', 'To push the current branch and set the remote as upstream, use', '    git push --set-upstream origin feature/avatar', '$ git push -u origin feature/avatar', ' * [new branch]      feature/avatar -> feature/avatar', "= branch 'feature/avatar' set up to track 'origin/feature/avatar'.", '$ git status -sb', '## feature/avatar...origin/feature/avatar [ahead 1]', '$ git log --oneline @{u}..HEAD', '+ becf82d feat(profile): cắt ảnh vuông'], { title: 'output thật', branch: 'feature/avatar', dir: '~/thu-git' }),
    `${table(['Sau khi có upstream', 'Chạy không cần tham số'], [
      ['<code>git push</code>', 'biết đẩy đi đâu'],
      ['<code>git pull</code>', 'biết lấy từ đâu'],
      ['<code>git status</code>', 'nói được ahead / behind'],
      ['<code>@{u}</code>', 'viết tắt của upstream'],
    ], { sm: true })}
    ${box('tip', '<code>git config --global push.autoSetupRemote true</code> — lần push đầu tự làm <code>-u</code>.')}`, 'l') },

  /* 12 */
  { t: 'Push bị từ chối: máy chủ có commit bạn chưa có', body: `
    ${two(
      graph({ w: 440, h: 250, x0: 70, y0: 80, dx: 200, dy: 100, commits: [
        { id: '5c1d', x: 0, t: 'form login' }, { id: 'ca54', x: 1, p: ['5c1d'], c: 'blu', t: 'An đã push' },
        { id: '09db', x: 1, lane: 1, p: ['5c1d'], c: 'amb', hl: true, t: 'Cường muốn push' },
      ], refs: [{ to: 'ca54', n: 'main (máy chủ)', k: 'branch' }] }),
      table(['Lời từ chối', 'Nghĩa là', 'Làm gì'], [
        ['<code>(fetch first)</code>', 'máy chủ có commit bạn CHƯA TẢI', '+pull --rebase rồi push'],
        ['<code>(non-fast-forward)</code>', 'đã tải nhưng CHƯA tích hợp — hoặc bạn viết lại lịch sử', '+tích hợp; chỉ nhánh riêng mới --force-with-lease'],
        ['<code>[remote rejected]</code>', 'luật bảo vệ nhánh', '+push nhánh khác, mở PR'],
      ], { sm: true }), 'r')}
    ${two(
      term(['# (An vừa push, Cường chưa fetch)', '$ git push', '!  ! [rejected]        main -> main (fetch first)', "! error: failed to push some refs to '../server.git'"], { title: 'thật — trước fetch', dir: '~/thu-git' }),
      term(['# (đã chạy git fetch, chưa merge/rebase)', '$ git push', '!  ! [rejected]        main -> main (non-fast-forward)', "! error: failed to push some refs to '../server.git'"], { title: 'thật — sau fetch, chưa tích hợp', dir: '~/thu-git' }))}` },

  /* 13 */
  { t: 'Xoá nhánh trên máy chủ, rồi dọn ảnh chụp cũ', body: two(
    term(['$ git push origin --delete feature/avatar', 'To ../server.git', '!  - [deleted]         feature/avatar'], { title: 'máy Cường — output thật', dir: '~/thu-git' }),
    term(['$ git branch -a', '* main', '  remotes/origin/HEAD -> origin/main', '! remotes/origin/feature/avatar', '# nhánh đã xoá trên máy chủ vẫn còn ở đây', '$ git fetch --prune', ' - [deleted]         (none)     -> origin/feature/avatar', '$ git branch -a', '* main', '  remotes/origin/HEAD -> origin/main', '  remotes/origin/main'], { title: 'máy An — output thật', dir: '~/an' })) + box('tip', 'Bật một lần: <code>git config --global fetch.prune true</code>. PR merge xong: xoá nhánh remote (hoặc nút Delete branch) + <code>git branch -d</code> ở máy.') },

  /* 14 */
  { t: 'Tag KHÔNG tự đi theo commit', body: two(
    term(["$ git tag -a v1.0 -m 'Bản nộp giữa kỳ'", '$ git push', '! Everything up-to-date', '$ git ls-remote --tags origin', '# (trống — máy chủ chưa có tag nào)', '$ git push origin v1.0', ' * [new tag]         v1.0 -> v1.0', '$ git push --follow-tags', '   78096f0..d49e34b  main -> main', '+  * [new tag]         v1.1 -> v1.1'], { title: 'output thật', dir: '~/thu-git' }),
    `${table(['Lệnh', 'Đẩy gì'], [
      ['<code>git push</code>', '-commit, KHÔNG tag'],
      ['<code>git push origin v1.0</code>', 'đúng một tag'],
      ['<code>git push --follow-tags</code>', '+commit + tag có chú thích (-a) trỏ vào chúng'],
      ['<code>git push origin --tags</code>', '!mọi tag trên máy, cả tag rác'],
      ['<code>git push origin --delete v1.0</code>', 'xoá tag trên máy chủ'],
    ], { sm: true })}
    ${box('warn', 'CI chạy theo tag không hề chạy nếu bạn quên đẩy tag.')}`, 'l') },

  /* 15 */
  { t: 'Fork: tam giác upstream — origin — máy bạn', body: `
    ${diagram({ w: 1160, h: 400, nodes: [
      { id: 'u', x: 40, y: 60, w: 340, h: 96, t: 'upstream', d: 'kho GỐC của người khác\nbạn chỉ đọc (fetch)', c: 'blu', mono: true },
      { id: 'o', x: 780, y: 60, w: 340, h: 96, t: 'origin', d: 'FORK của bạn trên GitHub\nbạn push được', c: 'grn', mono: true },
      { id: 'l', x: 410, y: 296, w: 340, h: 96, t: '💻 máy bạn', d: 'git clone fork\n+ remote add upstream', c: 'amb' },
    ], edges: [
      { from: 'u', to: 'o', t: 'nút Fork trên GitHub (một lần)', c: 'dim', dash: true, fs: 't', ts: 't', bend: -110, off: 6 },
      { from: 'o', to: 'u', t: 'Pull request (xin merge)', c: 'vio', fs: 'l', ts: 'r', off: -10 },
      { from: 'u', to: 'l', t: 'git fetch upstream', c: 'blu', fs: 'b', ts: 'l' },
      { from: 'l', to: 'o', t: 'git push origin', c: 'grn', fs: 'r', ts: 'b' },
    ] })}
    ${box('info', 'Nhớ theo chiều mũi tên: <b>lấy về từ upstream, đẩy lên origin, xin vào upstream bằng PR</b>. Không bao giờ push thẳng vào upstream.')}` },

  /* 16 */
  { t: 'Đồng bộ fork: status nói "up to date" — và SAI', body: two(
    term(['$ git remote set-url --push upstream DISABLED', '$ git status -sb', '! ## main...origin/main', '# fork không tự cập nhật — upstream đã có 2 commit mới', '$ git fetch upstream', '$ git log --oneline main..upstream/main', '+ 10655e6 perf(feed): phân trang', '+ c55a330 fix(feed): tác giả null', '$ git merge --ff-only upstream/main', '= Fast-forward', '$ git push origin main', '   de6d59f..10655e6  main -> main', '$ git push upstream main', "! fatal: 'DISABLED' does not appear to be a git repository"], { title: 'output thật (đã cắt vài dòng)', dir: '~/cuong-fork' }),
    `${graph({ w: 470, h: 230, x0: 50, y0: 84, dx: 105, commits: [
      { id: '1ee8', x: 0 }, { id: 'de6d', x: 1, p: ['1ee8'] },
      { id: 'c55a', x: 2, p: ['de6d'], c: 'blu' }, { id: '1065', x: 3, p: ['c55a'], c: 'blu', hl: true },
    ], refs: [{ to: 'de6d', n: 'main = origin/main (cũ)', k: 'remote' }, { to: '1065', n: 'upstream/main', k: 'note', side: 'down' }] })}
    ${list(['Làm TRƯỚC mỗi nhánh mới, không đợi người review nhắc', '<code>--ff-only</code> báo lỗi nếu bạn lỡ commit lên main của fork', 'Trên web: nút <b>Sync fork</b> làm đúng việc này'])}`, 'l') },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 5', body: table(['Muốn…', 'Gõ'], [
    ['Xem remote nào đang trỏ đi đâu', '<code>git remote -v</code>'],
    ['Biết máy chủ có gì mới — an toàn tuyệt đối', '<code>git fetch</code> (dọn nhánh cũ: <code>--prune</code>)'],
    ['Xem họ thêm gì / mình có gì chưa đẩy', '<code>git log --oneline main..origin/main</code> · <code>@{u}..HEAD</code>'],
    ['Kéo về khi hai bên lệch', '<code>git pull --rebase</code> (hoặc <code>--no-rebase</code>) · mặc định: <code>pull.ff only</code>'],
    ['Đẩy nhánh mới lần đầu', '<code>git push -u origin feature/x</code>'],
    ['Bị <code>(fetch first)</code>', '<code>git pull --rebase</code> → test → <code>git push</code> — KHÔNG --force'],
    ['Xoá nhánh trên máy chủ', '<code>git push origin --delete feature/x</code>'],
    ['Đẩy tag', '<code>git push origin v1.0</code> · <code>git push --follow-tags</code>'],
    ['Đổi HTTPS sang SSH', '<code>git remote set-url origin git@github.com:user/repo.git</code>'],
    ['Đồng bộ fork', '<code>git fetch upstream</code> → <code>git merge --ff-only upstream/main</code> → <code>git push origin main</code>'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 5 (30 phút)', body: `
    ${steps([
      ['Dựng máy chủ giả: <code>git init --bare ../thu-git-server.git</code>, nối làm <code>origin</code>, <code>git push -u origin main</code>', 'bài 4.1 đã dựng thì bỏ qua — không cần tài khoản GitHub'],
      ['Clone nó thành <code>../ban-cung-nhom</code>, commit + push từ đó', 'đóng vai bạn cùng nhóm'],
      ['Quay lại <code>thu-git</code>: commit rồi push → đọc lời từ chối', 'phải thấy <code>(fetch first)</code>'],
      ['<code>git fetch</code> → <code>git status</code> → <code>git pull --rebase</code> → <code>git push</code>', 'đoán mỗi bước sẽ in gì TRƯỚC khi chạy'],
      ['Tạo tag <code>v0.1</code>, push nhánh, kiểm <code>git ls-remote --tags origin</code>, rồi đẩy tag', 'lần đầu trống, lần sau có tag'],
    ])}
    ${box('good', '<b>Đạt khi:</b> sau một <code>git pull</code> ở <code>ban-cung-nhom</code>, hai kho có <code>git log --oneline</code> giống hệt, và <code>ls-remote --tags</code> in ra <code>v0.1</code>.')}` },
]);
