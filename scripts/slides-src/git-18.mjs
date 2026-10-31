/** Git & GitHub · Deck git-18 — Chương 18: Tai nạn Git thật của nhóm (dự án Java web NetBeans, 3 SV: An, Bình, Chi).
 *  Mọi dòng terminal / mã băm / đồ thị là output THẬT của git 2.51.1 chạy từ content/courses/git/lab18/tao-nhom.sh
 *  (HOME tạm, remote là kho bare cục bộ, không gọi mạng). Đường dẫn kho giả lập được in tắt thành "<LAB>".
 *  Tên người và mật khẩu trong dự án mẫu là GIẢ. Hook "main chỉ nhận PR" của lab là MÔ PHỎNG (không phải thông báo của GitHub).
 *  Mã băm mỗi slide lấy từ MỘT lần chạy lab (lab18/_dung/out/*.txt) nên khớp bài học cùng lần chạy; chạy lại lab = mã băm mới.
 */
import { S, cover, cards, box, steps, table, vs, flow, two, list, code, cap, mindmap, graph, trees, term, diagram, conflict, G } from './_git-chung.mjs';

export const deck = { key: 'git-18', code: 'GIT · CHƯƠNG 18', title: 'Tai nạn Git thật của nhóm', sub: 'Git & GitHub · Chương 18' };

const T = (lines, title = 'output thật — git 2.51', dir = '<LAB>/binh', branch = 'main') => term(lines, { title, dir, branch });

export const slides = S([
  cover({ t: 'Tai nạn Git thật của nhóm', sub: 'build/ lọt vào kho · xung đột web.xml · pull và push bị chặn · làm nhầm trên main · tự merge · hoàn tác merge', chap: 'CHƯƠNG 18' }),

  /* 2 */
  { t: 'Bản đồ chương: bảy tai nạn, mỗi tai nạn tự tái hiện rồi tự sửa', body: mindmap('Tai nạn của nhóm', 'dự án Java web NetBeans · An, Bình, Chi · Windows + Mac', [
    { t: '18.1 build/ lọt vào kho', d: 'git add . sau Build · rm --cached · xoay vòng mật khẩu', c: 'amb' },
    { t: '18.2 web.xml + PR để lâu', d: 'hai người cùng chèn · merge-tree · xmllint', c: 'red' },
    { t: '18.3 Đồng bộ bị chặn', d: 'overwritten · no tracking · rejected · divergent', c: 'blu' },
    { t: '18.4 Làm nhầm trên main', d: 'ahead 2 → branch + reset · đã push → revert', c: 'vio' },
    { t: '18.5 Tự merge không review', d: 'ruleset · CODEOWNERS · năm câu hỏi', c: 'git' },
    { t: '18.6–18.7 Hoàn tác và cứu hộ', d: 'revert -m 1 · revert cái revert · chẩn đoán trước', c: 'grn' },
  ]) },

  /* 3 */
  { t: 'Ba loại tệp trong một dự án NetBeans: chỉ loại thứ nhất vào kho', body: `${diagram({ w: 1160, h: 400, nodes: [
    { id: 'p', x: 0, y: 150, w: 250, h: 100, t: 'Dự án NetBeans', d: 'QuanLyPhongKham/', c: 'git', mono: true },
    { id: 'a', x: 400, y: 0, w: 330, h: 90, t: 'Mã nguồn', d: 'src/ · web/ · build.xml\nnbproject/project.properties', c: 'grn', mono: true },
    { id: 'b', x: 400, y: 155, w: 330, h: 90, t: 'Sản phẩm build', d: 'build/ · dist/ (Ant)\ntarget/ (Maven)', c: 'amb', mono: true },
    { id: 'c', x: 400, y: 310, w: 330, h: 90, t: 'Riêng từng máy', d: 'nbproject/private/\n(đường dẫn Tomcat, mật khẩu…)', c: 'blu', mono: true },
    { id: 'r', x: 890, y: 0, w: 270, h: 90, t: 'Kho Git', d: 'commit + push', c: 'grn' },
    { id: 'i', x: 890, y: 232, w: 270, h: 100, t: '.gitignore', d: 'bỏ qua — KHÔNG vào kho', c: 'red', dash: true },
  ], edges: [
    { from: 'p', to: 'a', c: 'grn' }, { from: 'p', to: 'b', c: 'amb' }, { from: 'p', to: 'c', c: 'blu' },
    { from: 'a', to: 'r', t: 'commit', c: 'grn' }, { from: 'b', to: 'i', c: 'red', dash: true }, { from: 'c', to: 'i', c: 'red', dash: true },
  ] })}
  ${box('warn', '<code>git add .</code> đưa vào MỌI thứ chưa bị bỏ qua. Git không biết thư mục nào là “sản phẩm” — <code>.gitignore</code> là cách cả nhóm nói cho nó biết, và phải có <b>trước</b> lần add đầu tiên.')}` },

  /* 4 */
  { t: 'Đã theo dõi rồi thì .gitignore vô tác dụng', body: two(
    `${T([
      '$ git status --short',
      '! M .gitignore',
      '! M build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class',
      '! M dist/QuanLyPhongKham.war',
      '$ git check-ignore -v build/…/HomeServlet.class',
      '# (im lặng — tệp đã theo dõi)',
      '$ git check-ignore -v --no-index build/…/HomeServlet.class',
      '+ .gitignore:3:build/   build/web/WEB-INF/classes/…/HomeServlet.class',
    ], 'An · sau khi thêm build/ vào .gitignore', '<LAB>/an', 'main')}
    ${box('info', '<code>--no-index</code> = “coi như index trống” — nó chỉ ra luật <b>sẽ</b> khớp nếu tệp chưa bị theo dõi.')}`,
    `${steps([
      ['<code>git rm -r --cached build dist nbproject/private</code>', 'gỡ khỏi index, tệp vẫn nằm trên đĩa'],
      ['<code>git add .gitignore</code> rồi commit + push', 'status trống, ls-files chỉ còn project.properties'],
      ['Đồng đội <b>stash</b> bản build của mình rồi pull', 'tệp bị XOÁ khỏi đĩa của họ — NetBeans tạo lại'],
    ])}
    ${box('bad', 'Thiếu <code>--cached</code> thì <code>git rm</code> xoá luôn tệp khỏi đĩa của bạn.')}`, 'l') },

  /* 5 */
  { t: 'Tệp đã xoá vẫn nằm trong lịch sử — mật khẩu phải được xoay vòng', body: two(
    `${graph({ w: 560, h: 250, y0: 78, dy: 100, dx: 115, x0: 130, lanes: [{ lane: 0, n: 'main', c: 'git' }], commits: [
      { id: '3ed4562', x: 0, t: 'khởi tạo' }, { id: 'd0decdb', x: 1, p: ['3ed4562'], hl: true, c: 'red', t: 'có mật khẩu' },
      { id: '27d21c7', x: 2, p: ['d0decdb'], hl: true, c: 'red', t: 'vẫn có' }, { id: '4493beb', x: 3, p: ['27d21c7'], t: 'đã gỡ' },
    ], refs: [{ to: '4493beb', n: 'main' }] })}
    ${T([
      '$ git log --all --oneline -S Tomcat@FPT2026',
      '+ 4493beb Ngung theo doi build/, dist/, nbproject/private/',
      '+ d0decdb Them DatLichServlet',
      '$ git grep -n tomcat.manager.password HEAD~1 -- nbproject/private/…',
      '! …private.properties:5:tomcat.manager.password=Tomcat@FPT2026',
    ], 'An · mật khẩu GIẢ', '<LAB>/an', 'main')}`,
    `${table(['Đã lộ gì', 'Làm gì'], [
      ['Chỉ <code>.class</code>, <code>.war</code>, đường dẫn', '+Để yên — đừng viết lại lịch sử vì vài trăm KB'],
      ['Mật khẩu, token, khoá API', '-<b>Xoay vòng ngay</b>: đổi mật khẩu, thu hồi khoá, ở MỌI nơi dùng lại'],
      ['Sau khi xoay vòng', '!filter-repo + force-push là tuỳ chọn; cả nhóm clone lại'],
    ], { sm: true })}
    ${box('info', 'GitHub Docs (10/2026): “as a first step you need to revoke and/or rotate that secret”. Bản sao còn trong fork và bản xem lưu đệm của PR.')}`, 'l') },

  /* 6 */
  { t: 'Hai người cùng chèn một khối vào web.xml — chỗ ai cũng chèn', body: `${diagram({ w: 1160, h: 390, nodes: [
    { id: 'm', x: 440, y: 0, w: 280, h: 80, t: 'main', d: 'web.xml có 2 servlet', c: 'git' },
    { id: 'a', x: 0, y: 130, w: 330, h: 90, t: 'feature/dat-lich (An)', d: '+ DatLichServlet\ntrước <session-config>', c: 'grn', mono: true },
    { id: 'b', x: 830, y: 130, w: 330, h: 90, t: 'feature/tra-cuu (Bình)', d: '+ TraCuuServlet\ntrước <session-config>', c: 'blu', mono: true },
    { id: 'x', x: 330, y: 300, w: 500, h: 80, t: 'web.xml — một tệp, MỘT chỗ', d: 'PR của An merge trước ⇒ PR của Bình xung đột', c: 'red', dash: true },
  ], edges: [
    { from: 'm', to: 'a', t: 'rẽ nhánh', c: 'grn' }, { from: 'm', to: 'b', t: 'rẽ nhánh', c: 'blu' },
    { from: 'a', to: 'x', fs: 'b', ts: 'l', t: 'merge #1', c: 'grn' }, { from: 'b', to: 'x', fs: 'b', ts: 'r', t: 'chờ…', c: 'red', dash: true },
  ] })}
  ${box('tip', 'Tệp dùng chung (web.xml, pom.xml, trang menu) là nguồn xung đột số một. Giảm nó: <code>@WebServlet("/tra-cuu")</code> thay vì khai báo trong web.xml, và nhắn nhóm trước khi sửa.')}` },

  /* 7 */
  { t: 'Xoá ba dòng dấu hiệu rồi giữ hết: Git cắt vùng xung đột giữa một thẻ XML', body: two(
    `${conflict({ before: ['    </servlet-mapping>', '    <servlet>'], ours: ['        <servlet-name>TraCuuServlet</servlet-name>', '        …', '        <url-pattern>/tra-cuu</url-pattern>'], theirs: ['        <servlet-name>DatLichServlet</servlet-name>', '        …', '        <url-pattern>/dat-lich</url-pattern>'], after: ['    </servlet-mapping>', '    <session-config>'], oursName: 'HEAD', theirsName: 'origin/main', fs: 15 })}`,
    `${T([
      '# xoá 3 dòng dấu hiệu, rồi:',
      '$ xmllint --noout web/WEB-INF/web.xml',
      '! web/WEB-INF/web.xml:28: parser error : Opening and ending tag mismatch: servlet-mapping line 23 and servlet',
      '!     </servlet>',
      '# sửa: dựng lại từ bản main + khối của mình:',
      '$ xmllint --noout web/WEB-INF/web.xml',
      '+ (im lặng = XML hợp lệ)',
    ], 'Bình · web.xml', '<LAB>/binh', 'feature/tra-cuu')}
    ${box('warn', 'Mỗi phía bắt đầu và dừng GIỮA một phần tử. Hết dấu hiệu ≠ xong: kiểm bằng xmllint / IDE / build.')}`, 'l') },

  /* 8 */
  { t: 'PR để lâu: main đi xa dần, xung đột càng đắt', body: two(
    `${graph({ w: 560, h: 320, y0: 70, dy: 115, dx: 140, x0: 130, lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'tra-cuu', c: 'blu' }], commits: [
      { id: '935c46b', x: 0, t: 'khởi tạo' }, { id: 'cf533ac', x: 1, p: ['935c46b'], t: 'An: web.xml', hl: true, c: 'red' },
      { id: '78bd742', x: 2, p: ['935c46b', 'cf533ac'], star: true, t: 'merge PR #1' },
      { id: '86db42b', x: 1, lane: 1, p: ['935c46b'], t: 'Bình: web.xml', hl: true, c: 'red' },
    ], refs: [{ to: '78bd742', n: 'origin/main', k: 'remote' }, { to: '86db42b', n: 'feature/tra-cuu', side: 'down' }] })}`,
    `${T([
      '$ git rev-list --left-right --count feature/tra-cuu...origin/main',
      '+ 1\t2',
      '$ git log --oneline feature/tra-cuu..origin/main -- web/WEB-INF/web.xml',
      '+ cf533ac Them DatLichServlet va khai bao web.xml',
      '$ git merge-tree --write-tree --name-only feature/tra-cuu origin/main',
      '1b7b5b5a34e6e8a599f31b2fbf3904a412d25916',
      '! web/WEB-INF/web.xml',
      '! CONFLICT (content): Merge conflict in web/WEB-INF/web.xml',
    ], 'xem trước, không đụng thư mục làm việc', '<LAB>/binh', 'feature/tra-cuu')}
    ${box('tip', 'Mỗi ngày: <code>git fetch</code> + <code>git merge origin/main</code> trên nhánh mình. PR mở quá 2 ngày ⇒ nhắn nhóm.')}`, 'l') },

  /* 9 */
  { t: 'git pull = fetch + merge — và ba chỗ nó vấp', body: `${flow([
    { e: '⬇️', t: 'git fetch', d: 'tải commit mới về origin/…\nKHÔNG đụng nhánh bạn', c: 'grn' },
    { e: '🔀', t: 'merge (hoặc rebase)', d: 'đưa origin/main vào\nnhánh đang đứng', c: 'amb' },
  ])}
  ${table(['Thông báo', 'Nghĩa là', 'Nước đi an toàn'], [
    ['<code>Your local changes … would be overwritten by merge</code> · <code>Aborting</code>', 'commit sắp vào sửa tệp bạn đã sửa mà chưa commit — không mất gì', '!commit (hoặc stash) → <code>fetch</code> → <code>merge origin/main</code>'],
    ['<code>There is no tracking information for the current branch</code>', 'nhánh chưa từng push nên chưa có upstream', '!<code>git push -u origin &lt;nhánh&gt;</code> một lần, hoặc <code>git pull origin main</code>'],
    ['<code>! [rejected] main -> main (fetch first)</code>', 'remote có commit bạn chưa có', '!đưa nó về rồi push; KHÔNG <code>--force</code>'],
    ['<code>fatal: Need to specify how to reconcile divergent branches.</code>', 'hai phía mỗi bên có commit bên kia không có', '!chọn một lần: <code>--no-rebase</code> hoặc <code>--rebase</code>'],
  ], { sm: true })}` },

  /* 10 */
  { t: 'Hai người cùng đẩy lên main: lịch sử rẽ đôi — merge, rebase, hay force?', body: two(
    `${graph({ w: 560, h: 270, y0: 76, dy: 100, dx: 130, x0: 130, lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'Bình', c: 'blu' }], commits: [
      { id: '308c8b1', x: 0, t: 'khởi tạo' }, { id: 'c5ab7af', x: 1, p: ['308c8b1'], t: 'An: menu', c: 'grn' },
      { id: '2083c59', x: 1, lane: 1, p: ['308c8b1'], t: 'Bình: login', c: 'blu' },
      { id: 'bf3c59a', x: 2, p: ['c5ab7af', '2083c59'], star: true, t: 'pull --no-rebase' },
    ], refs: [{ to: 'bf3c59a', n: 'main' }] })}
    ${cap('Merge: giữ cả hai commit, thêm một commit merge. Không viết lại gì — mặc định an toàn cho người mới.')}`,
    `${vs({
      no: { t: 'git push --force origin main', items: ['push in <code>(forced update)</code>', 'commit “them menu” của An <b>biến khỏi</b> main trên remote', 'An: <code>## main...origin/main [ahead 1, behind 1]</code>', 'chỉ còn sống ở clone của An'] },
      yes: { t: 'git pull --rebase / --no-rebase, rồi push', items: ['<code>--no-rebase</code>: merge, đồ thị rẽ rồi nối', '<code>--rebase</code>: thẳng hàng, commit của bạn đổi mã băm (chưa chia sẻ nên không sao)', 'đặt <code>pull.rebase</code> một lần cho cả nhóm', 'lỡ force nhánh riêng: <code>--force-with-lease</code>'] },
    })}`, 'l') },

  /* 11 */
  { t: 'main ahead 2: dời việc sang nhánh rồi đưa main về origin/main', body: two(
    `${T([
      '$ git status -sb',
      '! ## main...origin/main [ahead 2]',
      '$ git branch feature/dang-nhap-email',
      '$ git reset --hard origin/main',
      '= HEAD is now at 6994417 Khoi tao du an NetBeans: Login, Home, web.xml',
      '$ git switch feature/dang-nhap-email',
      '$ git log --oneline --graph --all --decorate',
      '* 182ad94 (HEAD -> feature/dang-nhap-email) index: nut dang nhap',
      '* a135628 Login bang email',
      '* 6994417 (origin/main, origin/HEAD, main) Khoi tao du an NetBeans: Login, Home, web.xml',
    ], 'Chi · CHƯA push', '<LAB>/chi', 'main')}`,
    `${graph({ w: 520, h: 250, y0: 70, dy: 100, dx: 110, x0: 130, lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'nhánh', c: 'vio' }], commits: [
      { id: '6994417', x: 0, t: 'origin/main' }, { id: 'a135628', x: 1, lane: 1, p: ['6994417'], c: 'vio' }, { id: '182ad94', x: 2, lane: 1, p: ['a135628'], c: 'vio' },
    ], refs: [{ to: '6994417', n: 'main' }, { to: '182ad94', n: 'feature/dang-nhap-email' }, { to: '182ad94', n: 'HEAD', k: 'head', side: 'down' }] })}
    ${box('warn', 'Thứ tự quan trọng: <b>branch trước, reset sau</b>. Reset trước thì không nhánh nào trỏ tới hai commit — chỉ <code>git reflog</code> còn nhớ (<code>HEAD@{2}</code>) và <code>git branch cuu-ho HEAD@{2}</code> mang chúng về.')}`, 'l') },

  /* 12 */
  { t: 'reset hay revert: hỏi MỘT câu — commit đã rời máy mình chưa?', body: `${table(['Tình huống', 'Dùng', 'Vì sao'], [
    ['Commit chỉ ở laptop bạn (<code>ahead N</code>)', '+<code>branch</code> + <code>reset --hard origin/main</code>', 'chưa ai khác có; viết lại lịch sử chưa chia sẻ là miễn phí'],
    ['Đã push lên nhánh chung', '+<code>git revert HEAD~N..HEAD</code>', 'thêm lịch sử thay vì đổi nó; pull của mọi người vẫn chạy'],
    ['Đã push lên nhánh riêng không ai dùng', '!<code>reset</code> + <code>push --force-with-lease</code>', 'chỉ khi chắc chưa ai pull'],
    ['Không chắc ai đang có', '+<code>revert</code>', 'luôn an toàn; cái giá là thêm hai commit'],
  ], { sm: true })}
  ${two(`${T([
      '$ git revert --no-edit HEAD~2..HEAD',
      '[main e74c7ce] Revert "index: nut dang nhap"',
      '[main d76505a] Revert "Login bang email"',
      '$ git diff --stat origin/main~4 origin/main',
      '# (không in gì: nội dung main bằng bốn commit trước)',
    ], 'Chi · ĐÃ push', '<LAB>/chi', 'main')}`, box('tip', 'Hai commit gốc <b>ở lại</b> lịch sử, hai commit <code>Revert …</code> theo sau. Việc của Chi sống trên <code>feature/dang-nhap-email</code>, sẵn sàng cho PR.'), 'l')}` },

  /* 13 */
  { t: 'Merge không qua PR và merge có rào chắn', body: two(
    `${T([
      '$ git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi (khong qua PR)"',
      '$ git push origin main',
      '# …cả nhóm pull về hai servlet cùng /home',
      '$ git log --merges --first-parent --format="%h %an: %s" -3',
      '! 4f830c9 Binh Tran: Merge nhanh trang-chu-moi (khong qua PR)',
      '$ git push origin main      # An, SAU KHI bật rào chắn MÔ PHỎNG',
      '! remote: MO PHONG luat bao ve nhanh: main chi nhan thay doi qua pull request.',
      '! ! [remote rejected] main -> main (pre-receive hook declined)',
      '$ git push -u origin feature/footer     # đúng cách: nhánh rồi PR',
    ], 'lab — hook MÔ PHỎNG, không phải thông báo của GitHub', '<LAB>/an', 'main')}`,
    `${steps([
      ['<b>Ruleset</b> trên main', 'Settings → Rulesets → New ruleset → New branch ruleset · Enforcement: Active'],
      ['Tick: <b>Require a pull request before merging</b> (1 lượt duyệt)', '+ Require status checks · Block force pushes · Restrict deletions'],
      ['<b>Bypass list: để trống</b>', 'trưởng nhóm cũng đi qua PR'],
      ['<b>CODEOWNERS</b> cho web.xml, pom.xml', 'dòng khớp cuối cùng thắng · owner cần quyền ghi'],
    ])}
    ${box('warn', 'Kiểm trên repo của bạn xem gói có cho dùng ruleset không (docs ghi điều kiện gói). Tạo xong, <b>thử push thẳng lên main</b> để thấy nó bị từ chối.')}`, 'l') },

  /* 14 */
  { t: 'Hoàn tác một merge: ORIG_HEAD, revert -m 1, và revert cái revert', body: two(
    `${graph({ w: 560, h: 330, y0: 66, dy: 100, dx: 78, x0: 112, lanes: [{ lane: 0, n: 'main', c: 'git' }, { lane: 1, n: 'nhánh', c: 'blu' }], commits: [
      { id: '77fb638', x: 0, t: 'khởi tạo' }, { id: 'a89b8c2', x: 1, lane: 1, p: ['77fb638'], t: 'có lỗi', c: 'red' },
      { id: '5a123a1', x: 2, p: ['77fb638', 'a89b8c2'], star: true, t: 'merge' }, { id: '0e2418c', x: 3, p: ['5a123a1'], t: 'Revert', c: 'amb' },
      { id: 'db94c00', x: 4, p: ['0e2418c'], t: 'Reapply', c: 'grn' }, { id: '0710bca', x: 3, lane: 1, p: ['a89b8c2'], t: 'sửa', c: 'grn' },
      { id: 'cd917a8', x: 5, p: ['db94c00', '0710bca'], star: true, t: 'merge lại' },
    ], refs: [{ to: 'cd917a8', n: 'main' }] })}`,
    `${T([
      '$ git revert -m 1 --no-edit HEAD',
      '$ git merge feature/trang-chu-moi',
      '! Already up to date.',
      '# sửa nhánh rồi merge NGAY (chưa revert cái revert):',
      '! CONFLICT (content): Merge conflict in web/WEB-INF/web.xml',
      '$ git revert --no-edit 0e2418c',
      '+ [main db94c00] Reapply "Merge nhanh trang-chu-moi (khong qua PR)"',
      '$ git merge --no-ff feature/trang-chu-moi',
    ], 'Bình', '<LAB>/binh', 'main')}
    ${box('tip', 'Chưa push: <code>reset --hard ORIG_HEAD</code>. Đã push: <code>-m 1</code> = giữ cha 1 (phía main). “Already up to date” vì commit nhánh đã là <b>tổ tiên</b> của main.')}`, 'l') },

  /* 15 */
  { t: 'Đêm trước hạn nộp: chẩn đoán trước, rồi sửa từng lớp', body: two(
    `${T([
      '$ git status -sb',
      '! ## main...origin/main [ahead 1, behind 2]',
      '! UU web/WEB-INF/web.xml',
      '$ git diff --name-only --diff-filter=U',
      '! web/WEB-INF/web.xml',
      '$ git log --oneline --graph --all',
      '* 8013b62 Them TraCuuServlet',
      '| * 31f81f7 Merge pull request #1 from an/dat-lich',
      '$ git ls-files build dist nbproject/private',
      '! build/web/WEB-INF/classes/…/HomeServlet.class  (+4 tệp)',
    ], 'Chi · CHỈ ĐỌC — chưa sửa gì', '<LAB>/chi', 'main')}`,
    `${steps([
      ['<code>git merge --abort</code>', 'huỷ mọi thứ đang dở trước'],
      ['<code>branch</code> → <code>reset --hard origin/main</code> → <code>switch</code>', 'cất việc lên nhánh TRƯỚC khi dời main'],
      ['<code>git rm -r --cached</code> + .gitignore', 'dọn nội dung trên nhánh'],
      ['<code>merge origin/main</code> → dựng lại web.xml → <code>xmllint</code>', 'tích hợp trên nhánh của mình'],
      ['<code>push -u origin feature/tra-cuu</code> → PR', 'main chỉ đổi qua pull request'],
    ])}`, 'l') },

  /* 16 */
  { t: 'Bảng tra nhanh: triệu chứng → cách sửa → cách phòng', body: table(['Bạn thấy', 'Nghĩa là', 'Sửa', 'Phòng', 'Bài'], [
    ['pull: <code>build/…class</code> would be overwritten', 'build đang được theo dõi', '<code>rm -r --cached</code> + .gitignore; xoay vòng bí mật', '.gitignore trước · <code>add -n .</code>', '18.1'],
    ['<code>UU web.xml</code> · CONFLICT', 'hai người sửa cùng chỗ', 'dựng lại từ main + khối của bạn; <code>xmllint</code>', 'PR nhỏ · merge main hằng ngày', '18.2'],
    ['overwritten / no tracking information', 'việc chưa lưu / chưa có upstream', 'commit → fetch → merge · <code>push -u</code>', 'fetch trước', '18.3'],
    ['rejected (fetch first) / divergent', 'remote có commit bạn chưa có', '<code>pull --no-rebase|--rebase</code> → push', '<code>pull.rebase</code> · không <code>--force</code>', '18.3'],
    ['<code>main … [ahead 2]</code>', 'việc nằm trên main', 'branch + <code>reset --hard</code>; đã push: <code>revert</code>', 'rẽ nhánh trước · main được bảo vệ', '18.4'],
    ['merge không có “Pull request #”', 'không có review', 'revert nếu hỏng · bật ruleset', 'ruleset · CODEOWNERS · review 5 câu', '18.5'],
    ['“Already up to date.” sau revert', 'commit đã là tổ tiên', '<code>revert -m 1</code> · revert cái revert', 'kiểm trước khi push', '18.6'],
  ], { sm: true }) },

  /* 17 */
  { t: 'Thực hành chương 18: ba người, một đêm, một phương pháp', body: two(
    `${steps([
      ['Dán <code>nhom-mini.sh</code> (bài 18.7) và chạy', 'remote bare + ba clone an / binh / chi, HOME riêng'],
      ['Tái hiện 18.1: <code>git add .</code> sau khi “build”', 'sửa bằng <code>rm --cached</code>; chạy pickaxe <code>-S</code>'],
      ['Tái hiện 18.2: hai khối cùng chỗ trong web.xml', '<code>merge-tree</code> dự đoán → giải → <code>xmllint</code>'],
      ['Tái hiện 18.3–18.4: push bị từ chối, commit trên main', 'merge hay rebase; branch + reset; revert'],
    ])}`,
    `${steps([
      ['18.5: viết hook (hoặc ruleset) cho main và CODEOWNERS', 'thử push thẳng để thấy bị từ chối'],
      ['18.6: merge hỏng → <code>revert -m 1</code> → “Already up to date”', 'revert cái revert, merge lại'],
      ['18.7: gộp tất cả thành MỘT đêm', 'chẩn đoán 4 lệnh → viết một câu → sửa từ ngoài vào trong'],
    ])}
    ${box('good', '<b>Đạt khi</b> không còn tệp dưới <code>build/</code> và <code>nbproject/private/</code> trong <code>git ls-files</code>, main bằng <code>origin/main</code>, và không có <code>--force</code> nào trong lịch sử lệnh của bạn.')}`, 'l') },
]);
