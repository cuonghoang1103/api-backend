/** Git & GitHub · Deck git-03 — Chương 3: Nhánh & hợp nhất.
 *  Mọi output terminal / xung đột / mã băm dưới đây là output THẬT của git 2.51.1, chạy trong kho thử
 *  (scratchpad/ch03-lab, ngày commit cố định 2026-09-20 nên chạy lại ra đúng mã băm này).
 */
import { S, cover, cards, box, steps, table, two, list, code, mindmap, graph, term, conflict } from './_git-chung.mjs';

export const deck = { key: 'git-03', code: 'GIT · CHƯƠNG 3', title: 'Nhánh & hợp nhất', sub: 'Git & GitHub · Chương 3' };

/** conflict() luôn in "||||||| merge base"; git 2.51 in mã băm / "parent of …" thật ⇒ thay nhãn cho đúng. */
const conflictAs = (baseLabel, o) => conflict(o).replace('||||||| merge base', `||||||| ${baseLabel}`);

export const slides = S([
  cover({ t: 'Chương 3 — Nhánh &amp; hợp nhất', sub: 'Nhánh là file 41 byte · fast-forward vs ba chiều · xung đột · rebase · rebase -i', chap: 'CHƯƠNG 3' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Nhánh &amp; hợp nhất', 'rẽ ra rẻ — nhập lại có chủ ý', [
    { t: '3.1 Nhánh là gì', d: 'một file 41 byte · HEAD · switch · detached HEAD', c: 'grn' },
    { t: '3.2 Hai kiểu merge', d: 'fast-forward (tua thẳng) vs ba chiều (commit hai cha)', c: 'blu' },
    { t: '3.3 Xung đột', d: 'đọc &lt;&lt;&lt; === &gt;&gt;&gt; · zdiff3 · bốn bước giải', c: 'red' },
    { t: '3.4 Rebase vs merge', d: 'phát lại = SAO CHÉP commit · luật vàng', c: 'vio' },
    { t: '3.5 Rebase tương tác', d: 'pick · squash · fixup · reword · cứu bằng reflog', c: 'amb' },
  ]) },

  /* 3 */
  { t: 'Một nhánh = một file 41 byte', body: two(
    term([
      '$ git branch feature/login',
      '$ cat .git/refs/heads/feature/login',
      '314e313fce8c22eca0e4198907c83397d9d27cc7',
      '$ wc -c < .git/refs/heads/feature/login',
      '+       41',
      '$ cat .git/HEAD',
      'ref: refs/heads/main',
      '# 40 ký tự mã băm + 1 dấu xuống dòng. Không chép file nào.',
    ], { title: 'output thật — git 2.51' }),
    `${graph({ w: 520, h: 250, y0: 150, dx: 220, x0: 110, commits: [
      { id: 'A', x: 0, t: '3d1f92e' }, { id: 'B', x: 1, p: ['A'], t: '314e313', hl: true },
    ], refs: [{ to: 'B', n: 'feature/login' }, { to: 'B', n: 'HEAD → main', k: 'head' }] })}
    ${box('info', '<b>HEAD</b> trỏ vào <b>tên nhánh</b>, nhánh mới trỏ vào commit. Hai nhánh đứng cùng một commit là chuyện bình thường.')}`, 'l') },

  /* 4 */
  { t: 'Commit mới chỉ dời nhánh mà HEAD đang trỏ', body: `
    ${graph({ w: 1160, h: 180, y0: 112, dx: 190, x0: 170, lanes: [{ lane: 0, n: 'trước', c: 'dim' }], commits: [
      { id: 'A', x: 0 }, { id: 'B', x: 1, p: ['A'] },
    ], refs: [{ to: 'B', n: 'main' }, { to: 'B', n: 'HEAD → feature/login', k: 'head' }] })}
    ${graph({ w: 1160, h: 200, y0: 112, dx: 190, x0: 170, lanes: [{ lane: 0, n: 'sau', c: 'git' }], commits: [
      { id: 'A', x: 0 }, { id: 'B', x: 1, p: ['A'] },
      { id: 'C', x: 2, p: ['B'], t: '3b61659', c: 'blu' }, { id: 'D', x: 3, p: ['C'], t: '47a310c', c: 'blu', hl: true },
    ], refs: [{ to: 'B', n: 'main' }, { to: 'D', n: 'feature/login' }, { to: 'D', n: 'HEAD', k: 'head' }] })}
    ${box('tip', 'Hai lần <code>git commit</code> trên feature/login: Git ghi mã băm mới vào <code>.git/refs/heads/feature/login</code>. File <code>main</code> không bị đụng tới — đó là toàn bộ “phép màu” của nhánh.')}` },

  /* 5 */
  { t: 'Detached HEAD (HEAD lìa cành) — commit ở đó dễ bị bỏ rơi', body: two(
    `${graph({ w: 430, h: 400, y0: 90, dy: 160, dx: 100, x0: 50, commits: [
      { id: 'A', x: 0 }, { id: 'B', x: 1, p: ['A'], t: '314e313' }, { id: 'C', x: 2, p: ['B'] }, { id: 'D', x: 3, p: ['C'] },
      { id: 'X', x: 2, lane: 1, p: ['B'], ghost: true, t: 'd4d5ceb thử nghiệm' },
    ], refs: [{ to: 'D', n: 'HEAD → main', k: 'head' }, { to: 'X', n: 'không nhánh nào trỏ', k: 'note', side: 'down' }] })}`,
    `${term([
      '$ git switch --detach HEAD~2',
      'HEAD is now at 314e313 refactor(api): tách phân trang ra helper',
      '$ cat .git/HEAD',
      '314e313fce8c22eca0e4198907c83397d9d27cc7',
      '# ... commit "thử nghiệm" rồi quay về main:',
      '$ git switch main',
      '! Warning: you are leaving 1 commit behind, not connected to',
      '! any of your branches:',
      '    d4d5ceb thử nghiệm',
    ], { title: 'output thật', branch: '' })}
    ${box('good', 'Muốn giữ: <code>git switch -c rescue</code> <b>trước</b> khi rời đi. Lỡ rời rồi: <code>git branch rescue d4d5ceb</code>.')}`, 'r2') },

  /* 6 */
  { t: 'Fast-forward (tua thẳng): không có gì để hợp nhất', body: `
    ${two(
      graph({ w: 560, h: 230, y0: 160, dx: 128, x0: 60, lanes: [], commits: [
        { id: 'A', x: 0 }, { id: 'B', x: 1, p: ['A'], t: '314e313' },
        { id: 'C', x: 2, p: ['B'], c: 'blu' }, { id: 'D', x: 3, p: ['C'], c: 'blu', t: '47a310c' },
      ], refs: [{ to: 'B', n: 'main' }, { to: 'B', n: 'HEAD', k: 'head' }, { to: 'D', n: 'feature/login' }] }),
      graph({ w: 560, h: 230, y0: 160, dx: 128, x0: 60, commits: [
        { id: 'A', x: 0 }, { id: 'B', x: 1, p: ['A'] },
        { id: 'C', x: 2, p: ['B'], c: 'blu' }, { id: 'D', x: 3, p: ['C'], c: 'blu', t: '47a310c', hl: true },
      ], refs: [{ to: 'D', n: 'feature/login' }, { to: 'D', n: 'main' }, { to: 'D', n: 'HEAD', k: 'head' }] }))}
    ${two(
      term(['$ git merge feature/login', 'Updating 314e313..47a310c', '+ Fast-forward', ' src/services/auth.service.ts | 2 ++', ' 1 file changed, 2 insertions(+)'], { title: 'trước → sau: main chỉ trượt tới D' }),
      box('info', '<b>main</b> là tổ tiên của feature/login ⇒ Git chỉ dời con trỏ. <b>Không có commit mới</b>, lịch sử thẳng, không còn dấu vết là đã từng có nhánh.'), 'l')}` },

  /* 7 */
  { t: 'Hợp nhất ba chiều: commit merge có HAI cha', body: `
    ${graph({ w: 1160, h: 330, y0: 110, dy: 130, dx: 190, x0: 170, lanes: [{ lane: 0, n: 'feature', c: 'blu' }, { lane: 1, n: 'main', c: 'git' }], commits: [
      { id: 'A', x: 0, lane: 1 }, { id: 'B', x: 1, lane: 1, p: ['A'], t: 'merge base 314e313', c: 'amb', hl: true },
      { id: 'C', x: 2, lane: 0, p: ['B'], t: '3b61659', c: 'blu' }, { id: 'D', x: 3, lane: 0, p: ['C'], t: '47a310c', c: 'blu' },
      { id: 'F', x: 2, lane: 1, p: ['B'], t: 'a063c84 fix(feed)' },
      { id: 'M', x: 4, lane: 1, p: ['F', 'D'], star: true, t: '7b40595', hl: true },
    ], refs: [{ to: 'D', n: 'feature/login' }, { to: 'M', n: 'HEAD → main', k: 'head', side: 'down' }] })}
    ${two(
      term(['$ git show --no-patch --format="%h cha: %p" HEAD', '+ 7b40595 cha: a063c84 47a310c'], { title: 'output thật' }),
      list(['Ba chiều = <b>B</b> (tổ tiên chung) + <b>F</b> + <b>D</b>', '<code>HEAD^1</code> = a063c84 (phía main)', '<code>HEAD^2</code> = 47a310c (phía feature)']), 'l2')}` },

  /* 8 */
  { t: 'Đọc hình dạng lịch sử — và chọn kiểu merge', body: `
    ${term([
      '$ git log --oneline --graph --decorate -6',
      "*   7b40595 (HEAD -> main) Merge branch 'feature/login'",
      '|\\',
      '| * 47a310c (feature/login) fix(auth): từ chối token hết hạn',
      '| * 3b61659 feat(auth): xoay vòng refresh token',
      '* | a063c84 fix(feed): hết lỗi 500 khi bài viết không có tác giả',
      '|/',
      '* 314e313 refactor(api): tách phân trang ra helper',
    ], { title: 'output thật — đọc từ DƯỚI lên: |/ = tách ra · |\\ = nhập lại' })}
    ${table(['Cờ', 'Kết quả'], [
      ['(mặc định)', 'Tua thẳng nếu được, không thì tạo commit hai cha'],
      ['<code>--no-ff</code>', 'Luôn tạo commit merge — mỗi tính năng để lại một “nút” thấy được'],
      ['<code>--ff-only</code>', '-Không tua thẳng được thì dừng: fatal: Not possible to fast-forward, aborting.'],
      ['<code>--squash</code>', 'Gom cả nhánh thành một cục chưa commit (nút “Squash and merge” của GitHub)'],
    ], { sm: true })}` },

  /* 9 */
  { t: 'Xung đột: Git hỏi, không phải Git hỏng', body: two(
    conflictAs('314e313', {
      ours: ['export const ttl = 60 * 60; // 1 giờ'],
      base: ['export const ttl = 30 * 60; // 30 phút'],
      theirs: ['export const ttl = 15 * 60; // 15 phút'],
      theirsName: 'feature/login', fs: 17,
    }),
    `${list([
      '<b style="color:#7ee787">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</b> — bản của nhánh bạn đang đứng (main)',
      '<b>||||||| 314e313</b> — bản GỐC ở tổ tiên chung (zdiff3 mới có)',
      '<b style="color:#a5d6ff">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</b> — bản của nhánh được nhập vào',
    ])}
    ${box('tip', 'Gốc 30 phút: một bên <b>nâng</b>, một bên <b>hạ</b> ⇒ bất đồng thật, phải hỏi nhóm. Bật một lần:<br><code>git config --global merge.conflictStyle zdiff3</code>')}`, 'r') },

  /* 10 */
  { t: 'Bốn bước giải xung đột (và một cửa thoát)', body: two(
    steps([
      ['Xem file nào xung đột', '<code>git status</code> → “both modified”, <code>git status -s</code> → <code>UU</code>'],
      ['Sửa file, xoá HẾT ký hiệu', 'kết quả có thể là bản thứ ba, không bắt buộc chọn một bên'],
      ['Kiểm sót ký hiệu rồi <code>git add</code>', '<code>git diff --check</code> không in gì = sạch'],
      ['<code>git commit</code> rồi CHẠY TEST', 'hoặc bỏ cuộc bất cứ lúc nào: <code>git merge --abort</code>'],
    ]),
    term([
      '$ git merge feature/login',
      'Auto-merging src/services/auth.service.ts',
      '! CONFLICT (content): Merge conflict in',
      '!   src/services/auth.service.ts',
      '$ git status -s',
      '! UU src/services/auth.service.ts',
      '# ...sửa file...',
      '$ git add src/services/auth.service.ts',
      '$ git status -s',
      '= M  src/services/auth.service.ts',
      '$ git commit --no-edit',
      "[main c191f4b] Merge branch 'feature/login'",
    ], { title: 'output thật' }), 'r') },

  /* 11 */
  { t: 'Rebase = SAO CHÉP commit lên đầu main', body: `
    ${graph({ w: 1160, h: 410, y0: 102, dy: 130, dx: 180, x0: 190, lanes: [{ lane: 0, n: 'sau rebase', c: 'grn' }, { lane: 1, n: 'main', c: 'git' }, { lane: 2, n: 'bản cũ', c: 'dim' }], commits: [
      { id: 'A', x: 0, lane: 1 }, { id: 'B', x: 1, lane: 1, p: ['A'], t: '314e313' },
      { id: 'F', x: 2, lane: 1, p: ['B'], t: 'a063c84' },
      { id: 'C', x: 2, lane: 2, p: ['B'], ghost: true, t: '3b61659' }, { id: 'D', x: 3, lane: 2, p: ['C'], ghost: true, t: '47a310c' },
      { id: "C'", x: 3, lane: 0, p: ['F'], t: 'b50571e', c: 'grn' }, { id: "D'", x: 4, lane: 0, p: ["C'"], t: '1ad5e22', c: 'grn', hl: true },
    ], refs: [{ to: 'F', n: 'main' }, { to: "D'", n: 'feature/login' }, { to: "D'", n: 'HEAD', k: 'head' }] })}
    ${box('warn', '<code>git rebase main</code>: cùng thay đổi, cùng lời nhắn, cùng tác giả — nhưng <b>mã băm mới</b> (C → C′). Commit cũ (nét đứt) vẫn còn trên đĩa, chỉ reflog còn nhớ — không nhánh nào trỏ tới nữa.')}` },

  /* 12 */
  { t: 'Merge vs rebase — cùng một việc, hai hình dạng', body: `
    ${two(
      `<b style="font-size:20px;color:#58a6ff">git merge main (trên feature)</b>${graph({ w: 560, h: 290, y0: 90, dy: 110, dx: 125, x0: 50, commits: [
        { id: 'B', x: 0 }, { id: 'F', x: 1, p: ['B'] },
        { id: 'C', x: 1, lane: 1, p: ['B'] }, { id: 'D', x: 2, lane: 1, p: ['C'] },
        { id: 'M', x: 3, lane: 1, p: ['D', 'F'], star: true },
      ], refs: [{ to: 'F', n: 'main' }, { to: 'M', n: 'feature/login', side: 'down' }] })}`,
      `<b style="font-size:20px;color:#3fb950">git rebase main (trên feature)</b>${graph({ w: 560, h: 290, y0: 90, dx: 125, x0: 50, commits: [
        { id: 'B', x: 0 }, { id: 'F', x: 1, p: ['B'] },
        { id: "C'", x: 2, p: ['F'], c: 'grn' }, { id: "D'", x: 3, p: ["C'"], c: 'grn' },
      ], refs: [{ to: 'F', n: 'main' }, { to: "D'", n: 'feature/login' }] })}`)}
    ${box('bad', '<b>Luật vàng:</b> KHÔNG rebase commit người khác đã kéo về. Nhánh riêng của bạn → rebase thoải mái. <code>main</code>, <code>develop</code>, nhánh hai người cùng làm → chỉ merge.')}` },

  /* 13 */
  { t: 'Xung đột khi REBASE: nhãn bị đảo', body: `
    ${conflictAs('parent of afa2f38 (fix(auth): rút TTL token còn 15 phút)', {
      ours: ['export const ttl = 60 * 60; // 1 giờ'],
      base: ['export const ttl = 30 * 60; // 30 phút'],
      theirs: ['export const ttl = 15 * 60; // 15 phút'],
      theirsName: 'afa2f38 (fix(auth): rút TTL token còn 15 phút)', fs: 16,
    })}
    ${table(['', 'git merge feature/login (đứng trên main)', 'git rebase main (đứng trên feature)'], [
      ['<code>HEAD</code> / ours', 'main — nhánh của bạn', '!main — nhánh bạn rebase LÊN'],
      ['theirs / dưới <code>=======</code>', 'feature/login', '!commit CỦA BẠN đang được phát lại'],
      ['Xong một chỗ thì', '<code>git add</code> → <code>git commit</code>', '<code>git add</code> → <code>git rebase --continue</code>'],
    ], { sm: true })}` },

  /* 14 */
  { t: 'rebase -i: danh sách việc là một kịch bản bạn sửa', body: two(
    code(`# git rebase -i main  — git 2.51 in thêm dấu #
pick   b6e78d0 # feat(auth): add refresh token rotation
fixup  8b46e41 # wip
fixup  bf9fc62 # fix typo
fixup  521d5c4 # actually fix it
pick   4a751fa # add tests

# CŨ NHẤT ở trên cùng (ngược git log)`, 'plaintext'),
    table(['Lệnh', 'Làm gì'], [
      ['<code>pick</code>', 'Giữ nguyên'],
      ['<code>reword</code>', 'Giữ thay đổi, sửa lời nhắn'],
      ['<code>edit</code>', 'Dừng lại để sửa nội dung / chẻ đôi'],
      ['<code>squash</code>', 'Gộp vào dòng TRÊN, giữ cả hai lời nhắn để bạn viết lại'],
      ['<code>fixup</code>', 'Gộp vào dòng TRÊN, VỨT lời nhắn này'],
      ['<code>drop</code>', 'Bỏ hẳn commit (xoá dòng cũng vậy)'],
    ], { sm: true }), 'l') },

  /* 15 */
  { t: '5 commit lộn xộn → 2 commit có nghĩa', body: `
    ${graph({ w: 1160, h: 330, y0: 60, dy: 150, dx: 185, x0: 170, lanes: [{ lane: 0, n: 'trước', c: 'dim' }, { lane: 1, n: 'sau', c: 'grn' }], commits: [
      { id: '1', x: 0, ghost: true, t: 'feat(auth)' }, { id: '2', x: 1, p: ['1'], ghost: true, t: 'wip' },
      { id: '3', x: 2, p: ['2'], ghost: true, t: 'fix typo' }, { id: '4', x: 3, p: ['3'], ghost: true, t: 'actually fix it' },
      { id: '5', x: 4, p: ['4'], ghost: true, t: 'add tests' },
      { id: "1'", x: 1, lane: 1, t: '10f06eb = 1+2+3+4 gộp lại', c: 'grn' },
      { id: "5'", x: 3, lane: 1, p: ["1'"], t: '3d76dab = 5 (pick)', c: 'grn', hl: true },
    ], refs: [{ to: "5'", n: 'feature/login', side: 'down' }] })}
    ${two(
      term(['$ git log --oneline main..HEAD', '3d76dab add tests', '10f06eb feat(auth): add refresh token rotation'], { title: 'output thật, sau rebase', branch: 'feature/login' }),
      box('tip', 'Đỡ phải sửa tay: <code>git commit --fixup &lt;mã&gt;</code> lúc làm, rồi <code>git rebase -i --autosquash main</code> — Git tự xếp dòng <code>fixup</code> vào đúng chỗ.'), 'l')}` },

  /* 16 */
  { t: 'Rebase xong mà hỏng? Reflog vẫn nhớ tất cả', body: `
    ${term([
      '$ git reflog -8',
      '3d76dab HEAD@{0}: rebase (finish): returning to refs/heads/feature/login',
      '3d76dab HEAD@{1}: rebase (pick): add tests',
      '10f06eb HEAD@{2}: rebase (fixup): feat(auth): add refresh token rotation',
      'b914559 HEAD@{3}: rebase (fixup): # This is a combination of 3 commits.',
      '3abac84 HEAD@{4}: rebase (fixup): # This is a combination of 2 commits.',
      'b6e78d0 HEAD@{5}: rebase (start): checkout main',
      '+ 4a751fa HEAD@{6}: commit: add tests',
      '521d5c4 HEAD@{7}: commit: actually fix it',
      '$ git reset --hard HEAD@{6}',
      '= HEAD is now at 4a751fa add tests',
    ], { title: 'output thật', branch: 'feature/login' })}
    ${box('good', 'Tìm dòng <b>ngay DƯỚI</b> “rebase (start)” — đó là đầu nhánh trước khi rebase. Còn đang giữa chừng thì gọn hơn: <code>git rebase --abort</code>.')}` },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 3', body: table(['Muốn…', 'Gõ'], [
    ['Tạo nhánh và chuyển sang', '<code>git switch -c feature/login</code>'],
    ['Về nhánh trước / xoá nhánh đã merge', '<code>git switch -</code> · <code>git branch -d ten</code>'],
    ['Hợp nhất, luôn giữ “nút” tính năng', '<code>git merge --no-ff feature/login</code>'],
    ['Chỉ chịu tua thẳng (an toàn cho pull)', '<code>git merge --ff-only</code> · <code>git config --global pull.ff only</code>'],
    ['Thấy bản gốc trong xung đột', '<code>git config --global merge.conflictStyle zdiff3</code>'],
    ['Kiểm ký hiệu xung đột còn sót', '<code>git diff --check</code>'],
    ['Bỏ ngang merge / rebase', '<code>git merge --abort</code> · <code>git rebase --abort</code>'],
    ['Cập nhật nhánh riêng theo main', '<code>git rebase main</code> · <code>git pull --rebase</code>'],
    ['Dọn commit trước khi mở PR', '<code>git rebase -i main</code> (+ <code>--autosquash</code>)'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 3 (40 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: tạo nhánh, <code>cat .git/refs/heads/&lt;nhánh&gt;</code>', 'đếm byte bằng <code>wc -c</code> — phải ra 41'],
      ['Làm một fast-forward rồi một merge ba chiều', 'so hai hình dạng bằng <code>git log --oneline --graph</code>'],
      ['Tự tạo xung đột: hai nhánh sửa CÙNG một dòng', 'bật zdiff3, giải, <code>git diff --check</code>, commit'],
      ['Tạo 4 commit lộn xộn rồi gộp thành 2', '<code>git rebase -i main</code>: đổi thứ tự + <code>fixup</code> + <code>squash</code>'],
      ['Phá thử một rebase rồi cứu', '<code>git reflog</code> → <code>git reset --hard HEAD@{n}</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> đồ thị có ít nhất một commit hai cha, không file nào còn <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, và <code>git log --oneline main..feature/profile</code> đúng 2 dòng.')}` },
]);
