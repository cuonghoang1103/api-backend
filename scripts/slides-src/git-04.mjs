/**
 * Git & GitHub · Deck git-04 — Chương 4: Hoàn tác — lưới an toàn.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1) của kho thử dựng bằng
 * scratchpad/ch04-lab/lab.sh (ngày giờ cố định ⇒ mã băm tái lập được):
 *   06edfab init · 0c0004b form đăng nhập · 184ab71 kiểm mật khẩu (= origin/main)
 *   bd06a69 style.css · 0e8a447 chặn email rỗng · c4c3f03 revert style
 *   78732ac merge feature/avatar · 2d853f2 revert merge · 40dc208 nhánh feature/profile
 *   stash b8e4a76 (index 6340c11, untracked 090de0f)
 * Dòng " Date: …" trong output revert đã được cắt (chỉ hiện vì kho thử đặt ngày cố định).
 */
import { S, cover, box, steps, table, flow, two, list, mindmap, graph, trees, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-04', code: 'GIT · CHƯƠNG 4', title: 'Hoàn tác: lưới an toàn', sub: 'Git & GitHub · Chương 4' };

/* Đồ thị năm commit đầu của kho thử — dùng lại ở nhiều slide. */
const C5 = [
  { id: '06ed', x: 0, t: 'init' },
  { id: '0c00', x: 1, p: ['06ed'], t: 'form login' },
  { id: '184a', x: 2, p: ['0c00'], t: 'kiểm mật khẩu' },
  { id: 'bd06', x: 3, p: ['184a'], t: 'style.css' },
  { id: '0e8a', x: 4, p: ['bd06'], t: 'chặn email rỗng' },
];

/* Đồ thị nhỏ cho ba slide reset: 184a → bd06 → 0e8a, nhánh lùi về `to`, commit sau nó thành bóng ma. */
const lui = (to) => {
  const ids = ['184a', 'bd06', '0e8a'];
  const k = ids.indexOf(to);
  return graph({ w: 540, h: 150, x0: 70, y0: 72, dx: 190, r: 22, commits: ids.map((id, i) => ({
    id, x: i, p: i ? [ids[i - 1]] : [], ghost: i > k, hl: i === k,
    t: i > k ? 'bị bỏ rơi' : ['kiểm mật khẩu', 'style.css', 'chặn email'][i],
  })), refs: [{ to, n: 'HEAD → main', k: 'head' }, { to: '0e8a', n: 'HEAD@{1}', k: 'note' }].filter((r) => !(r.k === 'note' && to === '0e8a')) });
};

export const slides = S([
  cover({ t: 'Chương 4 — Hoàn tác', sub: 'Bản đồ hoàn tác · reset soft/mixed/hard · revert · reflog · stash', chap: 'CHƯƠNG 4' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Hoàn tác', 'lệnh nào lấy lại được thứ gì', [
    { t: '4.1 Bản đồ hoàn tác', d: 'lệnh nào chạm cây nào · đã push chưa?', c: 'amb' },
    { t: '4.2 git reset', d: '--soft · --mixed · --hard: ba độ sâu', c: 'git' },
    { t: '4.3 git revert', d: 'hoàn tác bằng một commit MỚI — an toàn trên nhánh chung', c: 'grn' },
    { t: '4.4 git reflog', d: 'nhật ký HEAD — cứu commit “đã mất”', c: 'blu' },
    { t: '4.5 git stash', d: 'ngăn kéo cất việc dở trong 5 phút', c: 'vio' },
  ]) },

  /* 3 */
  { t: 'Lệnh hoàn tác nào chạm cây nào', body: `
    ${trees({
      wd: [['login.js', 'M', 'amb'], ['notes.txt', '??', 'red']],
      idx: [['login.js', 'bản add', 'blu']],
      head: [['login.js', 'bản commit', 'grn']],
      arrows: [{ from: 0, to: 1, t: 'git add', up: true }, { from: 1, to: 2, t: 'git commit', up: true },
        { from: 1, to: 0, t: 'git restore <file>', c: 'red' }, { from: 2, to: 1, t: 'restore --staged', c: 'amb' }],
    })}
    ${box('bad', '<b>Mũi tên đỏ</b> ghi đè thư mục làm việc: phần sửa chưa add <b>mất hẳn</b>, không lệnh nào lấy lại. Mũi tên vàng chỉ chép vào Index — file trên đĩa không bị đụng.')}` },

  /* 4 */
  { t: 'Cả chương trong một bảng', body: `
    ${table(['Lệnh', 'Nhánh / HEAD', 'Index', 'Working dir', 'Mất việc chưa commit?'], [
      ['<code>git restore &lt;file&gt;</code>', '—', '—', '!ghi đè', '-CÓ'],
      ['<code>git restore --staged &lt;file&gt;</code>', '—', '!chép từ HEAD', '—', '+không'],
      ['<code>git reset --soft &lt;c&gt;</code>', '!dời về c', '—', '—', '+không'],
      ['<code>git reset --mixed &lt;c&gt;</code>', '!dời về c', '!đặt lại', '—', '+không'],
      ['<code>git reset --hard &lt;c&gt;</code>', '!dời về c', '!đặt lại', '!ghi đè', '-CÓ'],
      ['<code>git revert &lt;c&gt;</code>', '!thêm commit mới', '!khớp commit mới', '!khớp commit mới', '+không (cần cây sạch)'],
      ['<code>git stash -u</code>', '—', '!cất đi', '!cất đi', '+không (pop lại được)'],
    ], { sm: true, center: [1, 2, 3, 4] })}
    ${box('info', '<b>Luật duy nhất:</b> Git cứu được mọi thứ nó <b>đã thấy</b> (đã commit). Thứ chưa commit mà bị ghi đè thì không ai cứu nổi.')}` },

  /* 5 */
  { t: 'Đã push chưa? — lằn ranh quyết định lệnh nào', body: `
    ${graph({ w: 1160, h: 200, y0: 96, dx: 210, x0: 90, commits: C5.map((c) => ({ ...c, hl: c.x >= 3, c: c.x >= 3 ? 'amb' : undefined })),
      refs: [{ to: '184a', n: 'origin/main', k: 'remote' }, { to: '0e8a', n: 'HEAD → main', k: 'head' }] })}
    ${two(
      term(['$ git log --oneline origin/main..HEAD', '+ 0e8a447 fix(auth): chặn email rỗng', '+ bd06a69 style: thêm style.css', '# 2 commit chỉ có trên máy bạn → reset thoải mái'], { title: 'output thật — git 2.51', dir: '~/thu-git' }),
      table(['Commit ở đâu', 'Dùng'], [
        ['Chỉ trên máy bạn', '+reset · amend · rebase'],
        ['Đã push, nhánh riêng', '!viết lại + <code>--force-with-lease</code>'],
        ['Đã push, nhánh chung', '-CHỈ <code>git revert</code>'],
      ], { sm: true }), 'l')}` },

  /* 6 */
  { t: 'git reset làm MỘT việc trước tiên: dời nhánh', body: `
    ${graph({ w: 1160, h: 210, y0: 100, dx: 210, x0: 90, commits: C5.map((c) => ({ ...c, ghost: c.x >= 3, hl: c.x === 2, t: c.x >= 3 ? 'bị bỏ rơi' : c.t })),
      refs: [{ to: '184a', n: 'HEAD → main', k: 'head' }, { to: '0e8a', n: 'HEAD@{1} (reflog nhớ)', k: 'note' }] })}
    ${flow([
      { e: '🪶', t: '--soft', d: 'chỉ dời nhánh', c: 'grn' },
      { e: '📋', t: '--mixed (mặc định)', d: 'dời nhánh + đặt lại Index', c: 'blu' },
      { e: '💣', t: '--hard', d: 'dời nhánh + Index + GHI ĐÈ thư mục làm việc', c: 'red' },
    ])}
    ${box('tip', '<code>git reset --hard HEAD~2</code>: hai commit nét đứt không bị xoá — chỉ là không nhánh nào trỏ tới nữa.')}` },

  /* 7 */
  { t: 'reset --soft HEAD~1 — commit biến, thay đổi nằm ở STAGING', body: `
    ${trees({ wd: [['login.js', 'mới', 'grn']], idx: [['login.js', 'mới', 'grn']], head: [['login.js', 'cũ', 'dim']],
      arrows: [{ from: 1, to: 2, t: 'git commit (làm lại)', up: true }] })}
    ${two(lui('bd06'), term(['$ git reset --soft HEAD~1', '$ git status -s', '= M  login.js', '$ git log --oneline -2', 'bd06a69 style: thêm style.css', '184ab71 feat(auth): kiểm độ dài mật khẩu'], { title: 'output thật', dir: '~/thu-git' }), 'r')}` },

  /* 8 */
  { t: 'reset --mixed HEAD~1 — thay đổi quay về file, CHƯA staging', body: `
    ${trees({ wd: [['login.js', 'mới', 'grn']], idx: [['login.js', 'cũ', 'dim']], head: [['login.js', 'cũ', 'dim']],
      arrows: [{ from: 0, to: 1, t: 'git add -p (chọn lại)', up: true }, { from: 2, to: 1, t: 'Index ← HEAD', c: 'blu' }] })}
    ${two(lui('bd06'), term(['$ git reset HEAD~1', 'Unstaged changes after reset:', 'M\tlogin.js', '$ git status -s', '!  M login.js', '# không ghi cờ = --mixed'], { title: 'output thật', dir: '~/thu-git' }), 'r')}` },

  /* 9 */
  { t: 'reset --hard HEAD~2 — cả ba cây bị ghi đè', body: `
    ${trees({ wd: [['login.js', 'cũ', 'dim'], ['README.md', 'MẤT sửa', 'red'], ['debug.log', '?? còn', 'amb']], idx: [['login.js', 'cũ', 'dim'], ['README.md']], head: [['login.js', 'cũ', 'dim'], ['README.md']],
      arrows: [{ from: 2, to: 1, t: 'Index ← HEAD', c: 'red' }, { from: 1, to: 0, t: 'ghi đè đĩa', c: 'red' }] })}
    ${two(lui('184a'), term(['$ git status -s', '!  M README.md', '! ?? debug.log', '$ git reset --hard HEAD~2', 'HEAD is now at 184ab71 feat(auth): kiểm độ dài mật khẩu', '$ git status -s', '?? debug.log'], { title: 'output thật — không hỏi lại một câu', dir: '~/thu-git' }), 'r')}` },

  /* 10 */
  { t: 'git revert — hoàn tác bằng cách ĐI TỚI', body: `
    ${graph({ w: 1160, h: 200, y0: 96, dx: 200, x0: 90, commits: [
      { id: '184a', x: 0, t: 'kiểm mật khẩu' }, { id: 'bd06', x: 1, p: ['184a'], t: 'style.css', c: 'red' },
      { id: '0e8a', x: 2, p: ['bd06'], t: 'chặn email rỗng' },
      { id: 'c4c3', x: 3, p: ['0e8a'], t: 'Revert "style"', hl: true, c: 'grn' },
    ], refs: [{ to: 'c4c3', n: 'HEAD → main', k: 'head' }, { to: 'bd06', n: 'commit tồi', k: 'note' }] })}
    ${two(
      term(['$ git revert --no-edit bd06a69', '= [main c4c3f03] Revert "style: thêm style.css"', ' 1 file changed, 1 deletion(-)', ' delete mode 100644 style.css'], { title: 'output thật', dir: '~/thu-git' }),
      list(['c4c3 chứa <b>nghịch đảo</b> của bd06: bd06 thêm style.css ⇒ c4c3 xoá nó', 'Không commit cũ nào đổi ⇒ clone của cả nhóm vẫn hợp lệ', 'Lịch sử <b>dài thêm</b> một commit, không ngắn đi']), 'l')}` },

  /* 11 */
  { t: 'Trên nhánh chung: reset + force-push phá cả nhóm', body: two(
    `${box('bad', '<b>reset --hard HEAD~2 + push -f</b>')}
    ${graph({ w: 560, h: 250, x0: 60, y0: 90, dx: 125, dy: 100, commits: [
      { id: '184a', x: 0 }, { id: 'bd06', x: 1, p: ['184a'], ghost: true }, { id: '0e8a', x: 2, p: ['bd06'], ghost: true },
    ], refs: [{ to: '184a', n: 'origin/main', k: 'remote' }, { to: '0e8a', n: 'main của bạn cùng nhóm', k: 'note', side: 'down' }] })}
    ${list(['Clone của 4 bạn còn lại vẫn có bd06, 0e8a', '<code>git pull</code> sau đó: lịch sử lệch, dễ đẩy commit tồi lên lại'])}`,
    `${box('good', '<b>git revert bd06a69 + push</b>')}
    ${graph({ w: 560, h: 250, x0: 60, y0: 90, dx: 125, commits: [
      { id: '184a', x: 0 }, { id: 'bd06', x: 1, p: ['184a'] }, { id: '0e8a', x: 2, p: ['bd06'] }, { id: 'c4c3', x: 3, p: ['0e8a'], hl: true, c: 'grn' },
    ], refs: [{ to: 'c4c3', n: 'origin/main', k: 'remote' }, { to: 'c4c3', n: 'main', side: 'down' }] })}
    ${list(['Mọi người chỉ nhận THÊM một commit', '<code>git pull</code> tua thẳng (fast-forward), không ai phải làm gì'])}`) },

  /* 12 */
  { t: 'Revert một commit merge: phải nói giữ cha nào (-m 1)', body: `
    ${two(
    graph({ w: 640, h: 225, x0: 70, y0: 70, dx: 150, dy: 100, commits: [
      { id: 'c4c3', x: 0, t: 'cha 1 (main)' },
      { id: '5cc0', x: 0.9, lane: 1, p: ['c4c3'], c: 'blu', t: 'ảnh đại diện' },
      { id: '95d2', x: 1.8, lane: 1, p: ['5cc0'], c: 'blu', t: 'cha 2 (nhánh)' },
      { id: '7873', x: 2.2, p: ['c4c3', '95d2'], star: true, t: 'merge' },
      { id: '2d85', x: 3.2, p: ['7873'], hl: true, c: 'grn', t: 'revert merge' },
    ], refs: [{ to: '2d85', n: 'HEAD → main', k: 'head' }] }),
    box('warn', '<b>-m 1</b> = giữ dòng của cha 1 (main), huỷ mọi thứ nhánh mang vào. Muốn merge lại nhánh đó sau này ⇒ <b>revert chính cái revert</b> trước.'), 'l')}
    ${term(['$ git revert 78732ac', '! error: commit 78732ac939a34cdf603d2729a995d9fc5b6b3908 is a merge but no -m option was given.', '! fatal: revert failed', '$ git revert -m 1 --no-edit 78732ac', "= [main 2d853f2] Revert \"Merge branch 'feature/avatar'\"", ' 1 file changed, 1 deletion(-)', ' delete mode 100644 avatar.js'], { title: 'output thật', dir: '~/thu-git' })}` },

  /* 13 */
  { t: 'reflog — cứu hai commit sau một lần reset --hard', body: `
    ${graph({ w: 1160, h: 190, y0: 92, dx: 210, x0: 90, commits: C5.map((c) => ({ ...c, ghost: c.x >= 3, hl: c.x === 4, c: c.x === 4 ? 'grn' : undefined, t: c.x === 4 ? 'đích cứu' : c.t })),
      refs: [{ to: '184a', n: 'HEAD → main', k: 'head' }, { to: '0e8a', n: 'HEAD@{1}', k: 'note' }, { to: 'bd06', n: 'HEAD@{2}', k: 'note' }] })}
    ${term(['$ git reflog -3', '+ 184ab71 HEAD@{0}: reset: moving to HEAD~2', '0e8a447 HEAD@{1}: commit: fix(auth): chặn email rỗng', 'bd06a69 HEAD@{2}: commit: style: thêm style.css', '$ git reset --hard HEAD@{1}', '= HEAD is now at 0e8a447 fix(auth): chặn email rỗng'], { title: 'output thật', dir: '~/thu-git' })}` },

  /* 14 */
  { t: 'reflog: nhánh đã xoá, rebase hỏng — và giới hạn', body: two(
    `${term(['$ git branch -D feature/profile', 'Deleted branch feature/profile (was 40dc208).', '$ git reflog | grep -A1 "from feature/profile"', '2d853f2 HEAD@{0}: checkout: moving from feature/profile to main', '+ 40dc208 HEAD@{1}: commit: feat(profile): thêm tiểu sử', '$ git switch -c feature/profile 40dc208'], { title: 'output thật', dir: '~/thu-git' })}
    ${box('warn', 'Dòng <code>checkout</code> ghi chỗ HEAD <b>đi tới</b> (main). Đỉnh nhánh cũ là dòng <b>ngay dưới</b>. Rebase hỏng: lấy dòng ngay dưới <code>rebase (start)</code>.')}`,
    steps([
      ['Chỉ trên máy bạn', 'reflog nằm ở <code>.git/logs/</code>, không push, không clone'],
      ['Có hạn', 'dòng không với tới được: 30 ngày · còn với tới: 90 ngày'],
      ['Chỉ nhớ COMMIT', 'phần sửa chưa commit bị <code>reset --hard</code> ghi đè thì không có ở đây'],
    ]), 'l2') },

  /* 15 */
  { t: 'git stash — ngăn kéo cất việc dở', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'wd', x: 0, y: 20, w: 330, h: 120, t: 'Bàn làm việc bừa', d: 'M  login.js (đã add)\n M README.md · ?? notes.txt', c: 'amb', mono: true },
      { id: 'cl', x: 0, y: 200, w: 330, h: 90, t: 'Cây sạch', d: 'git status -s trống → switch main, vá lỗi gấp', c: 'grn' },
      { id: 's0', x: 790, y: 40, w: 370, h: 80, t: 'stash@{0}', d: 'On main: dở: validate email', c: 'vio', mono: true },
      { id: 's1', x: 790, y: 140, w: 370, h: 80, t: 'stash@{1}', d: 'cũ hơn — tên rõ ràng mới nhận ra', c: 'dim', dash: true, mono: true },
      { id: 's2', x: 790, y: 240, w: 370, h: 80, t: 'stash@{2}', d: '“WIP on main” … là gì nhỉ?', c: 'dim', dash: true, mono: true },
    ], edges: [
      { from: 'wd', to: 's0', t: 'git stash push -u -m "…"', c: 'vio', fs: 'r', ts: 'l' },
      { from: 's0', to: 'wd', t: 'git stash pop --index', c: 'grn', fs: 'l', ts: 'r', bend: 90, off: 12 },
      { from: 'wd', to: 'cl', c: 'grn', fs: 'b', ts: 't', t: 'sau khi cất' },
    ] })}
    ${box('tip', 'Ngăn kéo cho <b>5 phút</b> gián đoạn. Việc để qua đêm ⇒ commit “wip” lên một nhánh (thấy được, push được).')}` },

  /* 16 */
  { t: 'Bên trong stash — và vì sao cần pop --index', body: two(
    `${graph({ w: 540, h: 300, x0: 60, y0: 74, dx: 200, dy: 90, commits: [
      { id: '2d85', x: 0, t: 'HEAD lúc cất' },
      { id: '6340', x: 1, lane: 1, p: ['2d85'], c: 'blu', t: 'index' },
      { id: '090d', x: 1, lane: 2, p: ['2d85'], c: 'amb', t: 'untracked' },
      { id: 'b8e4', x: 2, p: ['2d85', '6340', '090d'], star: true, c: 'vio', t: 'WIP' },
    ], refs: [{ to: 'b8e4', n: 'refs/stash', k: 'note' }] })}
    ${list(['<b>b8e4</b> — thư mục làm việc (commit có 3 cha)', '<b>6340</b> — Index lúc cất · <b>090d</b> — file mới (nhờ <code>-u</code>)'])}`,
    `${table(['Lệnh', 'Kết quả (thật)'], [
      ['<code>git stash pop</code>', '<code>&nbsp;M login.js</code> — phần đã add thành CHƯA add'],
      ['<code>git stash pop --index</code>', '<code>M&nbsp; login.js</code> — giữ đúng staging'],
      ['<code>git stash apply</code>', 'áp lại nhưng GIỮ mục trong ngăn kéo'],
    ], { sm: true })}
    ${term(['$ git stash pop', 'CONFLICT (content): Merge conflict in f', '+ The stash entry is kept in case you need it again.'], { title: 'pop gặp xung đột (kho thử t2)', dir: '~/t2' })}`, 'r') },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 4', body: table(['Muốn…', 'Gõ'], [
    ['Bỏ phần sửa chưa add của một file (MẤT thật)', '<code>git restore app.js</code>'],
    ['Gỡ khỏi staging, giữ phần sửa', '<code>git restore --staged app.js</code>'],
    ['Làm lại commit cuối (giữ mọi thứ ở staging)', '<code>git reset --soft HEAD~1</code>'],
    ['Huỷ commit cuối, chọn lại thứ để add', '<code>git reset HEAD~1</code>'],
    ['Vứt hẳn 2 commit cuối CHƯA push', '<code>git status</code> → <code>git reset --hard HEAD~2</code>'],
    ['Hoàn tác commit ĐÃ push', '<code>git revert &lt;mã&gt;</code> · merge: <code>-m 1</code>'],
    ['Cứu commit “đã mất”', '<code>git reflog</code> → <code>git reset --hard HEAD@{n}</code>'],
    ['Cất việc dở / lấy lại', '<code>git stash push -u -m "…"</code> · <code>git stash pop --index</code>'],
    ['Xem file/thư mục rác sẽ bị xoá', '<code>git clean -nd</code> (luôn trước <code>-fd</code>)'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 4 (30 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo 2 commit mới, rồi sửa README mà KHÔNG commit', 'ghi lại mã băm bằng <code>git log --oneline -3</code>'],
      ['Cố tình <code>git reset --hard HEAD~2</code>', 'đoán trước: cái gì mất hẳn, cái gì còn cứu được?'],
      ['Cứu 2 commit bằng <code>git reflog</code> + <code>git reset --hard HEAD@{1}</code>', 'kiểm: log có lại đúng 2 mã băm cũ; README thì không'],
      ['<code>git revert</code> một commit cũ, đọc <code>git log</code>', 'lịch sử dài thêm, không ngắn đi'],
      ['Sửa 2 file (1 cái đã add) + 1 file mới → <code>stash push -u -m</code> → <code>stash pop --index</code>', '<code>git status -s</code> trước và sau phải giống hệt'],
    ])}
    ${box('good', '<b>Đạt khi:</b> hai mã băm “đã mất” quay lại đúng như cũ, và bạn giải thích được vì sao dòng sửa README không quay lại.')}` },
]);
