/**
 * Git & GitHub · Deck git-09 — Chương 9: Bên dưới nắp capo — kho đối tượng.
 * Mọi output terminal trên slide là output THẬT (git 2.51.1) của ba kịch bản trong
 * scratchpad/ch09-lab (ngày giờ cố định ⇒ mã băm tái lập được):
 *   lab.sh  — kho thu-git: 1a63b2e init · 6a952eb đổi lời chào · tag có chú thích v1.0 (đối tượng 54827a0)
 *             blob 5c661fc README.md · ecabde4 auth.js · 1ac74b4 app.js "hi" · 7728117 app.js "hello"
 *             tree gốc dbbbf42 / 713039b · tree src 8a04503 / 8230aab
 *   lab2.sh — ghi-chu.md 40.374 byte sửa 6 lần (7a38eea … 4098f32) → git gc → 1 packfile
 *   lab3.sh — kho by-hand: commit dựng bằng 5 lệnh tầng thấp → 826b62e
 */
import { S, cover, cards, box, steps, table, flow, two, list, kpis, mindmap, graph, term, diagram, esc } from './_git-chung.mjs';

export const deck = { key: 'git-09', code: 'GIT · CHƯƠNG 9', title: 'Bên dưới nắp capo: kho đối tượng', sub: 'Git & GitHub · Chương 9' };

/* Cây thư mục kiểu `tree`: thư mục vàng, file xanh, chú thích (sau "#") xanh lá. */
const dirTree = (src, fs = 16) => `<pre style="margin:0;font-family:SF Mono,Menlo,monospace;font-size:${fs}px;line-height:1.5;` +
  `background:#0a0d12;border:1.5px solid #30363d;border-radius:12px;padding:12px 18px;text-align:left;color:#6e7681">` +
  src.split('\n').map((ln) => {
    const [a, ...c] = ln.split('#');
    const m = a.match(/^([│├└─ ]*)(.*?)(\s*)$/);
    const name = m[2];
    const star = name.startsWith('★');
    const n = star ? name.slice(1) : name;
    const colr = /\/$/.test(n) || /\/ /.test(n) ? '#ffc233' : '#79c0ff';
    return `${esc(m[1])}<span style="color:${colr};${star ? 'font-weight:800;' : ''}">${esc(n)}</span>${m[3]}` +
      (c.length ? `<span style="color:#3fb950">#${esc(c.join('#'))}</span>` : '');
  }).join('\n') + '</pre>';

const LAB = 'output thật — git 2.51';

export const slides = S([
  /* 1 */
  cover({ t: 'Chương 9 — Bên dưới nắp capo', sub: 'Thư mục .git · bốn đối tượng blob/tree/commit/tag · commit bằng tay · packfile & gc', chap: 'CHƯƠNG 9' }),

  /* 2 */
  { t: 'Bản đồ chương', body: mindmap('Kho đối tượng', 'mở .git ra — hết bí ẩn', [
    { t: '9.1 Thư mục .git', d: 'objects/ + refs/ là cả kho · HEAD, index là file thật', c: 'amb' },
    { t: '9.2 Bốn đối tượng', d: 'blob · tree · commit · tag — đọc bằng cat-file', c: 'grn' },
    { t: '9.2 Commit bằng tay', d: 'hash-object → update-index → write-tree → commit-tree → update-ref', c: 'blu' },
    { t: '9.3 Packfile & delta', d: 'nhiều file rời → một pack; bản cũ chỉ là phần khác', c: 'vio' },
    { t: '9.3 gc & prune', d: 'khi nào commit “đã xoá” biến thật — và reflog giữ nó sống', c: 'git' },
  ]) },

  /* 3 */
  { t: 'Tham quan .git — thứ gì nằm ở đâu', body: two(
    dirTree(`thu-git/.git/
├── HEAD              # "ref: refs/heads/main"
├── config            # cấu hình --local, remote
├── index             # vùng staging (325 byte)
├── COMMIT_EDITMSG    # lời nhắn vừa gõ
├── ★objects/          # KHO ĐỐI TƯỢNG
│   ├── 1a/ 54/ 5c/ 6a/ 71/ 77/ …
│   ├── info/
│   └── pack/         # trống — chưa gc
├── ★refs/             # TÊN → mã băm
│   ├── heads/main
│   ├── heads/feature/login
│   └── tags/v1.0
├── logs/             # reflog (Chương 4)
├── hooks/            # 14 file .sample
└── info/exclude      # ignore riêng máy bạn`),
    `${box('info', '<b>objects/</b> + <b>refs/</b> = toàn bộ kho mã. Mọi thứ khác là cấu hình, bộ đệm, hoặc tiện ích.')}
    ${list(['<code>feature/login</code> là một <b>thư mục con</b> thật ⇒ không thể có thêm nhánh tên <code>feature</code>', '<code>logs/</code> không bao giờ được push — reflog chỉ sống trên máy bạn', 'Đọc thoải mái. <b>Ghi</b> thì qua lệnh Git'])}`, 'l2') },

  /* 4 */
  { t: 'HEAD và nhánh chỉ là file chữ một dòng', body: `
    ${diagram({ w: 1160, h: 215, nodes: [
      { id: 'h', x: 0, y: 14, w: 320, h: 80, t: '.git/HEAD', d: 'ref: refs/heads/main\n21 byte', c: 'amb', mono: true },
      { id: 'm', x: 420, y: 14, w: 320, h: 80, t: 'refs/heads/main', d: '6a952eb80d5a…\n41 byte', c: 'grn', mono: true },
      { id: 'c', x: 860, y: 14, w: 290, h: 80, t: 'commit 6a952eb', d: 'feat: doi loi chao', c: 'blu', mono: true },
      { id: 'hd', x: 0, y: 140, w: 320, h: 66, t: 'HEAD lìa cành', d: '6a952eb80d5a… (mã băm trần)', c: 'dim', dash: true, mono: true },
    ], edges: [
      { from: 'h', to: 'm', t: 'tên nhánh', c: 'amb' }, { from: 'm', to: 'c', t: 'mã băm', c: 'grn' },
      { from: 'hd', to: 'c', c: 'dim', dash: true, fs: 'r', ts: 'b', t: 'switch --detach v1.0', off: 22 },
    ] })}
    ${term(['$ cat .git/HEAD', 'ref: refs/heads/main', '$ cat .git/refs/heads/main', '6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b', '$ git switch --detach v1.0', 'HEAD is now at 6a952eb feat: doi loi chao', '$ cat .git/HEAD', '+ 6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b', '# lìa cành = HEAD chứa thẳng mã băm thay vì tên nhánh'], { title: LAB, dir: '~/thu-git', branch: '' })}` },

  /* 5 */
  { t: 'objects/ — mỗi đối tượng rời là một file', body: two(
    term(['$ find .git/objects -type f | sort', '.git/objects/1a/63b2e3f7da94abc96ba94cfaee3a770d5acc19', '.git/objects/1a/c74b42183215c938310f9bd404c60ee49770d5', '.git/objects/54/827a044184e7f5160e473c3fb32308e599aa91', '.git/objects/5c/661fc60ece6565d0dab8d1f5247a965eb77998', '.git/objects/6a/952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b', '.git/objects/71/3039bfa4cf6f8cf7be34068bfb4ec28d5537ea', '.git/objects/77/2811768644cee9dc59429c2e66a51d587d046f', '.git/objects/82/30aab1da15ca4d74ba45d6200ce9172d7cb455', '.git/objects/8a/04503091078941658b36d932e45d7176d2ecac', '.git/objects/db/bbf4270fe1167b534d2de4b47de7c2fa65d9c0', '.git/objects/ec/abde4c6a34b2c45d31ce3329765ed0ff8a0e22'], { title: LAB + ' — 2 commit, 1 tag', dir: '~/thu-git', branch: '' }),
    `${list(['Mã băm 40 ký tự bị chẻ: <b>2 ký tự đầu</b> = tên thư mục, <b>38 còn lại</b> = tên file', 'Thư mục <code>1a/</code> chứa <b>hai</b> đối tượng — một commit và một blob', 'Nội dung nén zlib ⇒ <code>cat</code> ra rác nhị phân'])}
    ${box('tip', 'Đọc bằng <code>git cat-file -t</code> (loại) · <code>-s</code> (byte) · <code>-p</code> (nội dung)')}`, 'l2') },

  /* 6 */
  { t: 'Bốn loại đối tượng — và chỉ bốn', body: `
    ${cards([
      { ic: '📄', t: 'blob', d: 'Nội dung MỘT file. Không tên, không đường dẫn — chỉ byte.<br><code>5c661fc</code> README.md · 33 byte', c: 'amb' },
      { ic: '📁', t: 'tree', d: 'Danh sách thư mục: chế độ + TÊN + mã băm blob/tree con.<br><code>713039b</code> gốc · 67 byte', c: 'blu' },
      { ic: '📸', t: 'commit', d: 'Một tree gốc + cha + tác giả + lời nhắn.<br><code>6a952eb</code> · 217 byte', c: 'grn' },
      { ic: '🏷', t: 'tag', d: 'Tag CÓ CHÚ THÍCH: trỏ tới đối tượng khác + người gắn + lời nhắn.<br><code>54827a0</code> · 133 byte', c: 'vio' },
    ], 4)}
    ${term(['$ git cat-file --batch-all-objects --batch-check', '1a63b2e3f7da94abc96ba94cfaee3a770d5acc19 commit 168', '1ac74b42183215c938310f9bd404c60ee49770d5 blob 18', '54827a044184e7f5160e473c3fb32308e599aa91 tag 133', '5c661fc60ece6565d0dab8d1f5247a965eb77998 blob 33', '6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b commit 217', '713039bfa4cf6f8cf7be34068bfb4ec28d5537ea tree 67', '# … (6/11 dòng) — tổng: 4 blob · 4 tree · 2 commit · 1 tag'], { title: LAB, dir: '~/thu-git' })}` },

  /* 7 */
  { t: 'Một commit, mở bung ra: commit → tree → blob', body: `
    ${diagram({ w: 1160, h: 420, nodes: [
      { id: 'c', x: 420, y: 0, w: 300, h: 80, t: 'commit 6a952eb', d: 'tác giả · lời nhắn', c: 'grn', mono: true },
      { id: 'p', x: 900, y: 6, w: 250, h: 68, t: 'commit 1a63b2e', d: 'cha (init)', c: 'dim', dash: true, mono: true },
      { id: 't', x: 420, y: 150, w: 300, h: 72, t: 'tree 713039b', d: 'thư mục gốc', c: 'blu', mono: true },
      { id: 'r', x: 20, y: 150, w: 250, h: 72, t: 'blob 5c661fc', d: '"# thu-git…"', c: 'amb', mono: true },
      { id: 's', x: 420, y: 300, w: 300, h: 72, t: 'tree 8230aab', d: 'thư mục con', c: 'blu', mono: true },
      { id: 'a', x: 20, y: 300, w: 250, h: 72, t: 'blob 7728117', d: 'console.log("hello")', c: 'amb', mono: true },
      { id: 'u', x: 880, y: 300, w: 270, h: 72, t: 'blob ecabde4', d: 'export const login…', c: 'amb', mono: true },
    ], edges: [
      { from: 'c', to: 'p', t: 'parent', c: 'dim', dash: true },
      { from: 'c', to: 't', t: 'tree', c: 'blu' },
      { from: 't', to: 'r', t: 'README.md', c: 'amb' },
      { from: 't', to: 's', t: 'src/', c: 'blu' },
      { from: 's', to: 'a', t: 'app.js', c: 'amb' },
      { from: 's', to: 'u', t: 'auth.js', c: 'amb' },
    ] })}
    ${box('info', 'Chữ trên mũi tên là <b>tên file</b> — nó nằm trong <b>tree</b>, không nằm trong blob. Đổi tên file = tree mới, blob giữ nguyên.')}` },

  /* 8 */
  { t: 'Hai commit dùng chung blob — file không đổi, không tốn thêm', body: `
    ${diagram({ w: 1160, h: 392, nodes: [
      { id: 'c1', x: 40, y: 0, w: 240, h: 64, t: 'commit 1a63b2e', d: 'init', c: 'dim', mono: true },
      { id: 'c2', x: 880, y: 0, w: 240, h: 64, t: 'commit 6a952eb', d: 'đổi lời chào', c: 'grn', mono: true },
      { id: 'r1', x: 40, y: 108, w: 240, h: 60, t: 'tree dbbbf42', c: 'blu', mono: true },
      { id: 'r2', x: 880, y: 108, w: 240, h: 60, t: 'tree 713039b', c: 'blu', mono: true },
      { id: 'rd', x: 450, y: 108, w: 260, h: 60, t: 'blob 5c661fc', d: 'README.md — DÙNG CHUNG', c: 'tea', mono: true },
      { id: 's1', x: 40, y: 214, w: 240, h: 60, t: 'tree 8a04503', d: 'src/', c: 'blu', mono: true },
      { id: 's2', x: 880, y: 214, w: 240, h: 60, t: 'tree 8230aab', d: 'src/', c: 'blu', mono: true },
      { id: 'au', x: 450, y: 214, w: 260, h: 60, t: 'blob ecabde4', d: 'auth.js — DÙNG CHUNG', c: 'tea', mono: true },
      { id: 'a1', x: 40, y: 322, w: 240, h: 64, t: 'blob 1ac74b4', d: 'app.js "hi"', c: 'amb', mono: true },
      { id: 'a2', x: 880, y: 322, w: 240, h: 64, t: 'blob 7728117', d: 'app.js "hello"', c: 'git', mono: true },
    ], edges: [
      { from: 'c2', to: 'c1', t: 'parent', c: 'dim', dash: true },
      { from: 'c1', to: 'r1', c: 'blu' }, { from: 'c2', to: 'r2', c: 'blu' },
      { from: 'r1', to: 'rd', c: 'tea' }, { from: 'r2', to: 'rd', c: 'tea' },
      { from: 'r1', to: 's1', c: 'blu' }, { from: 'r2', to: 's2', c: 'blu' },
      { from: 's1', to: 'au', c: 'tea' }, { from: 's2', to: 'au', c: 'tea' },
      { from: 's1', to: 'a1', c: 'amb' }, { from: 's2', to: 'a2', c: 'git' },
    ] })}
    ${box('good', 'Commit 2 chỉ sửa <code>app.js</code> ⇒ đúng <b>4</b> đối tượng mới: blob app.js · tree src · tree gốc · commit.')}` },

  /* 9 */
  { t: 'Lần theo từng tầng bằng git cat-file -p', body: term([
    '$ git cat-file -p HEAD',
    'tree 713039bfa4cf6f8cf7be34068bfb4ec28d5537ea',
    'parent 1a63b2e3f7da94abc96ba94cfaee3a770d5acc19',
    'author Cuong <cuong@example.com> 1790000600 +0700',
    'committer Cuong <cuong@example.com> 1790000600 +0700',
    '',
    'feat: doi loi chao',
    '$ git cat-file -p HEAD^{tree}',
    '100644 blob 5c661fc60ece6565d0dab8d1f5247a965eb77998\tREADME.md',
    '+ 040000 tree 8230aab1da15ca4d74ba45d6200ce9172d7cb455\tsrc',
    '$ git cat-file -p HEAD:src',
    '100644 blob 772811768644cee9dc59429c2e66a51d587d046f\tapp.js',
    '100644 blob ecabde4c6a34b2c45d31ce3329765ed0ff8a0e22\tauth.js',
    '$ git cat-file -p 7728117',
    '= console.log("hello")',
  ], { title: LAB + ' — commit → tree → tree con → blob', dir: '~/thu-git' }) },

  /* 10 */
  { t: 'index — vùng staging là một file thật', body: two(
    `${term(['$ git ls-files --stage', '100644 5c661fc60ece6565d0dab8d1f5247a965eb77998 0\tREADME.md', '100644 772811768644cee9dc59429c2e66a51d587d046f 0\tsrc/app.js', '100644 ecabde4c6a34b2c45d31ce3329765ed0ff8a0e22 0\tsrc/auth.js'], { title: LAB, dir: '~/thu-git' })}
    <div style="height:14px"></div>${table(['Cột', 'Nghĩa'], [
      ['<code>100644</code> / <code>100755</code>', 'file thường / file chạy được'],
      ['mã băm', 'blob giữ nội dung ĐÃ staging'],
      ['<code>0</code>', 'giai đoạn hợp nhất — xung đột thì thành 1 · 2 · 3'],
    ], { sm: true })}`,
    steps([
      ['<code>git add</code>', '= <code>hash-object -w</code> + <code>update-index</code>'],
      ['<code>git commit</code>', '= <code>write-tree</code> + <code>commit-tree</code> + <code>update-ref</code>'],
      ['Ba cây của bài 1.1', 'Working dir · <b>file .git/index</b> · tree của HEAD'],
    ]), 'l2') },

  /* 11 */
  { t: 'Mã băm = SHA-1 của “loại + kích thước + nội dung”', body: `
    ${flow([
      { e: '🏷', t: 'blob 33\\0', d: 'header: loại · số byte · ký tự NUL', c: 'vio' },
      { e: '📄', t: 'nội dung', d: '"# thu-git\\nSan tap Git cua Cuong.\\n"', c: 'amb' },
      { e: '⚙️', t: 'SHA-1', d: 'hàm băm → 40 ký tự hex', c: 'blu' },
      { e: '🔖', t: '5c661fc…', d: 'tên của đối tượng', c: 'grn' },
    ])}
    ${term(["$ printf 'blob 33\\0# thu-git\\nSan tap Git cua Cuong.\\n' | shasum", '5c661fc60ece6565d0dab8d1f5247a965eb77998  -', '$ git hash-object README.md', '= 5c661fc60ece6565d0dab8d1f5247a965eb77998', '# Linux, Git Bash (Windows): sha1sum · macOS: shasum (hoặc sha1sum ở bản mới)'], { title: LAB, dir: '~/thu-git' })}
    ${box('tip', 'Cùng nội dung ⇒ cùng mã băm trên <b>mọi máy</b> ⇒ Git tự khử trùng lặp. Đổi 1 byte ⇒ một đối tượng mới hoàn toàn.')}` },

  /* 12 */
  { t: 'Dựng một commit BẰNG TAY — năm lệnh tầng thấp', body: `
    ${flow([
      { t: 'hash-object -w', d: 'nội dung → blob', c: 'amb' },
      { t: 'update-index', d: 'blob + tên → index', c: 'blu' },
      { t: 'write-tree', d: 'index → tree', c: 'tea' },
      { t: 'commit-tree', d: 'tree → commit', c: 'grn' },
      { t: 'update-ref', d: 'nhánh → commit', c: 'git' },
    ])}
    ${term(['$ echo "hello world" | git hash-object -w --stdin', '3b18e512dba79e4c8300dd08aeb37f8e728b8dad', '$ git update-index --add --cacheinfo 100644,3b18e512dba79e4c8300dd08aeb37f8e728b8dad,hello.txt', '$ git write-tree', '68aba62e560c0ebc3396e8ae9335232cd93a3f60', '$ echo "first commit, made by hand" | git commit-tree 68aba62', '+ 826b62edec33ae69e4f04a1ba2c40744ec4938c8', '$ git update-ref refs/heads/main 826b62e', '$ git log --oneline', '= 826b62e first commit, made by hand', '$ git status -s', '!  D hello.txt', '# hello.txt chưa từng được ghi ra đĩa → git restore hello.txt'], { title: LAB + ' — kho by-hand', dir: '~/by-hand' })}` },

  /* 13 */
  { t: 'Tag có chú thích là một ĐỐI TƯỢNG; tag nhẹ chỉ là file', body: two(
    diagram({ w: 560, h: 400, nodes: [
      { id: 'ra', x: 0, y: 10, w: 250, h: 70, t: 'refs/tags/v1.0', d: '54827a0…', c: 'vio', mono: true },
      { id: 'tg', x: 0, y: 160, w: 250, h: 84, t: 'tag 54827a0', d: 'tagger Cuong\n"ban dau tien"', c: 'vio', mono: true },
      { id: 'cm', x: 300, y: 300, w: 250, h: 76, t: 'commit 6a952eb', d: 'feat: doi loi chao', c: 'grn', mono: true },
      { id: 'rl', x: 300, y: 10, w: 250, h: 70, t: 'refs/tags/v1.0-nhe', d: '6a952eb…', c: 'dim', dash: true, mono: true },
    ], edges: [
      { from: 'ra', to: 'tg', t: 'file', c: 'vio' }, { from: 'tg', to: 'cm', t: 'object', c: 'vio', fs: 'b', ts: 'l' },
      { from: 'rl', to: 'cm', t: 'tag nhẹ: trỏ thẳng', c: 'dim', dash: true },
    ] }),
    term(['$ git cat-file -t v1.0', '+ tag', '$ git cat-file -p v1.0', 'object 6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b', 'type commit', 'tag v1.0', 'tagger Cuong <cuong@example.com> 1790001200 +0700', '', 'ban dau tien', '$ git tag v1.0-nhe', '$ git cat-file -t v1.0-nhe', '+ commit'], { title: LAB, dir: '~/thu-git' }), 'r') },

  /* 14 */
  { t: 'Đối tượng rời → packfile: git gc gói lại', body: `
    ${kpis([
      { v: '29', l: 'đối tượng rời sau 8 commit (29 file)', c: 'amb' },
      { v: '25.239 B', l: 'tổng byte thật của 29 file đó', c: 'git' },
      { v: '6.391 B', l: 'một file .pack chứa đủ 29 đối tượng', c: 'grn' },
    ])}
    ${two(
      term(['$ git count-objects -vH', 'count: 29', 'size: 116.00 KiB', 'in-pack: 0', 'packs: 0', '$ git gc', '$ git count-objects -vH', 'count: 0', '= in-pack: 29', 'packs: 1', '= size-pack: 8.08 KiB'], { title: LAB + ' (cắt bớt dòng)', dir: '~/thu-git' }),
      `${list(['<code>size: 116 KiB</code> là dung lượng <b>trên đĩa</b>: mỗi file nhỏ vẫn chiếm ít nhất một khối 4 KiB', '<code>size-pack</code> tính cả <code>.pack</code> lẫn <code>.idx</code> (bảng tra: mã băm → vị trí byte)', 'gc cũng gói các ref vào <code>packed-refs</code> — <code>refs/heads/main</code> biến mất khỏi thư mục'])}`, 'l') }` },

  /* 15 */
  { t: 'Delta: bản cũ chỉ còn là “phần khác”', body: `
    ${term(['$ git verify-pack -v .git/objects/pack/pack-*.idx', '5c661fc60ece6565d0dab8d1f5247a965eb77998 blob   33 43 2329', '+ ce4edba70b635e2c75874dc7ca7bd2bcdeee58de blob   40374 3796 2372', '7563b513b6e7cc02d257184745f7a7e3a5d969cb blob   9 21 6168 1 ce4edba70b635e2c75874dc7ca7bd2bcdeee58de', 'f3c542429d578af653ecf5d35af46dfe185f590b blob   9 21 6189 1 ce4edba70b635e2c75874dc7ca7bd2bcdeee58de', '71ddbee31ad8ad4a238e172b0ecbcfab3bce251d blob   9 20 6210 1 ce4edba70b635e2c75874dc7ca7bd2bcdeee58de', 'non delta: 24 objects', 'chain length = 1: 5 objects'], { title: LAB + ' — ghi-chu.md sửa 6 lần (cắt bớt dòng)', dir: '~/thu-git' })}
    ${table(['Cột', 'Dòng ce4edba', 'Dòng 7563b51'], [
      ['cột 3 · size', '40.374 byte (nội dung đầy đủ)', '9 byte (chỉ dữ liệu delta)'],
      ['cột 4 · chiếm trong pack', '3.796 byte (đã nén zlib)', '21 byte'],
      ['cột 6–7 · độ sâu, gốc delta', '— (lưu nguyên)', '1 · dựa trên ce4edba'],
    ], { sm: true })}
    ${box('info', 'Bản <b>MỚI NHẤT</b> lưu nguyên, bản CŨ là delta trỏ về nó. Mô hình vẫn là ảnh chụp — chỉ <b>cách cất</b> là delta.')}` },

  /* 16 */
  { t: 'gc --prune=now không xoá thứ reflog còn nhắc tới', body: two(
    `${graph({ w: 540, h: 190, x0: 70, y0: 90, dx: 190, commits: [
      { id: '20a5', x: 0, t: 'lần 4' }, { id: '49c5', x: 1, p: ['20a5'], t: 'lần 5', hl: true },
      { id: '4098', x: 2, p: ['49c5'], t: 'lần 6', ghost: true },
    ], refs: [{ to: '49c5', n: 'HEAD → main', k: 'head' }, { to: '4098', n: 'HEAD@{1}', k: 'note' }] })}
    ${steps([
      ['Còn ref hoặc reflog trỏ tới', 'gc KHÔNG đụng — vẫn cứu được'],
      ['Reflog hết hạn (30/90 ngày) hoặc bị expire', 'đối tượng thành “không với tới được”'],
      ['gc prune đối tượng không với tới được', 'mất thật — không lệnh nào lấy lại'],
    ])}`,
    term(['$ git reset --hard HEAD~1', 'HEAD is now at 49c5640 docs: sua ghi chu lan 5', '$ git gc --prune=now', '$ git cat-file -t 4098f32', '= commit', '# vẫn sống: reflog còn giữ HEAD@{1}', '$ git fsck --unreachable --no-reflogs', 'unreachable commit 4098f32947c67575db77289057dc6abbaa55cbe1', 'unreachable blob ce4edba70b635e2c75874dc7ca7bd2bcdeee58de', 'unreachable tree 3e93c49e872620e451b9ed13e687da7909fcd5c6', '$ git reflog expire --expire=now --all', '$ git gc --prune=now', '$ git cat-file -t 4098f32', '! fatal: Not a valid object name 4098f32'], { title: LAB + ' — bản sao thu-git-prune', dir: '~/thu-git-prune' }), 'r') },

  /* 17 */
  { t: 'Bảng tra nhanh Chương 9', body: table(['Muốn…', 'Gõ'], [
    ['Biết một mã băm là loại gì / nặng bao nhiêu', '<code>git cat-file -t &lt;mã&gt;</code> · <code>-s</code>'],
    ['Đọc commit / tree / blob / tag', '<code>git cat-file -p HEAD</code> · <code>HEAD^{tree}</code> · <code>HEAD:src/app.js</code>'],
    ['Nhánh đang trỏ vào đâu (kể cả trong packed-refs)', '<code>git rev-parse main</code>'],
    ['Xem index (vùng staging) thật', '<code>git ls-files --stage</code>'],
    ['Tính mã băm của một file', '<code>git hash-object app.js</code> (thêm <code>-w</code> để ghi)'],
    ['Đo kho: đối tượng rời và pack', '<code>git count-objects -vH</code>'],
    ['Soi bên trong packfile, delta', '<code>git verify-pack -v .git/objects/pack/pack-*.idx</code>'],
    ['Liệt kê đối tượng không với tới được', '<code>git fsck --unreachable --no-reflogs</code>'],
    ['Dọn dẹp bình thường (an toàn)', '<code>git gc</code> — KHÔNG <code>--prune=now</code> khi đang cứu hộ'],
  ], { sm: true }) },

  /* 18 */
  { t: 'Thực hành chương 9 (40 phút)', body: `
    ${steps([
      ['Trong <code>thu-git</code>: đoán <code>find .git/objects -type f | wc -l</code> rồi chạy', 'đếm tay: mỗi commit mới thêm bao nhiêu blob/tree?'],
      ['Lần <code>git cat-file -p</code> từ HEAD xuống tới nội dung một file trong thư mục con', 'ghi lại 4 mã băm trên đường đi'],
      ['Dựng một commit bằng 5 lệnh tầng thấp trong kho mới <code>by-hand</code>', '<code>hash-object → update-index → write-tree → commit-tree → update-ref</code>'],
      ['Sửa một file lớn 5 lần, commit mỗi lần → <code>count-objects -vH</code> → <code>gc</code> → <code>verify-pack -v</code>', 'tìm dòng có cột độ sâu = 1'],
      ['Trên BẢN SAO: <code>reset --hard HEAD~1</code> → <code>gc --prune=now</code> → commit còn không?', 'rồi <code>reflog expire</code> + gc lần nữa'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>by-hand</code> có commit bạn tự dựng, và bạn giải thích được vì sao gc lần 1 KHÔNG xoá, lần 2 thì xoá.')}` },
]);
