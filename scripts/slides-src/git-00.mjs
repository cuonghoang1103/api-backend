/** Git & GitHub · Deck git-00 — Mục 0: Giới thiệu · Vì sao cần Git · Cài đặt · Cách học.
 * Output terminal trên slide là output THẬT (git 2.51.1, OpenSSH 10.3, HOME tạm — 23/09/2026).
 * Dòng in đường dẫn HOME tạm dài đã được CẮT BỎ (không sửa chữ). */
import { S, G, esc, cover, cards, box, steps, table, vs, flow, two, list, code, mindmap, term, diagram } from './_git-chung.mjs';

export const deck = { key: 'git-00', code: 'GIT · MỤC 0', title: 'Giới thiệu, cài đặt & cách học', sub: 'Git & GitHub · Mục 0' };

/* ───────── Bản đồ lộ trình 17 phần — tàu điện ngoằn ngoèo 3 hàng (SVG nội tuyến) ───────── */
const STAGES = [
  { n: 'Nhập môn', c: G.mu },
  { n: 'Mô hình', c: G.git },
  { n: 'Di chuyển trong lịch sử', c: G.amb },
  { n: 'Làm việc nhóm', c: G.blu },
  { n: 'Chiều sâu & quy mô', c: G.vio },
  { n: 'Khi hỏng', c: G.red },
  { n: 'Công cụ & ra nghề (MỚI)', c: G.grn },
];
const STOPS = [
  [0, 'Giới thiệu', '& cài đặt', 0], [1, 'Mô hình:', 'ảnh chụp', 1], [2, 'Đọc', 'lịch sử', 1],
  [3, 'Nhánh &', 'hợp nhất', 2], [4, 'Hoàn tác', 'an toàn', 2], [5, 'Remote', '& GitHub', 3],
  [6, 'Pull request', '& review', 3], [7, 'Quy trình', 'nhóm & tag', 3], [8, 'Viết lại', 'lịch sử', 3],
  [9, 'Ruột gan:', 'kho đối tượng', 4], [10, 'Kho mã', 'lớn', 4], [11, 'Nền tảng', 'GitHub', 4],
  [12, 'Hook &', 'ký commit', 4], [13, 'Cứu hộ &', 'quy trình thật', 5], [14, 'Git trong', 'công cụ', 6],
  [15, 'GitHub cho', 'sinh viên', 6], [16, 'Dự án nhóm', 'cuối khoá', 6], ['🏁', 'Thi cuối khoá', '20 câu', 6],
];
const roadmap = () => {
  const W = 1160, H = 452, X = (i) => 92 + i * 195, Y = [44, 206, 368], R = 25;
  const pos = STOPS.map((_, k) => { const row = Math.floor(k / 6), i = k % 6; return [row % 2 ? X(5 - i) : X(i), Y[row]]; });
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
  // đường ray: đoạn nối giữa hai trạm, tô màu theo chặng của trạm sau
  for (let k = 1; k < STOPS.length; k++) {
    const [x1, y1] = pos[k - 1], [x2, y2] = pos[k], c = STAGES[STOPS[k][3]].c;
    if (y1 === y2) s += `<path d="M${x1} ${y1} H${x2}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    else { const ex = x1 > W / 2 ? x1 + 72 : x1 - 72; s += `<path d="M${x1} ${y1} C${ex} ${y1} ${ex} ${y2} ${x2} ${y2}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/>`; }
  }
  STOPS.forEach(([num, a, b, st], k) => {
    const [x, y] = pos[k], c = STAGES[st].c, fin = num === '🏁';
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${fin ? '#1d2a1f' : '#0d1117'}" stroke="${c}" stroke-width="5"/>`;
    s += `<text x="${x}" y="${y + (fin ? 8 : 7)}" text-anchor="middle" font-size="${fin ? 22 : 20}" font-weight="800" fill="#fff">${esc(num)}</text>`;
    s += `<text x="${x}" y="${y + 52}" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">${esc(a)}</text>`;
    s += `<text x="${x}" y="${y + 71}" text-anchor="middle" font-size="15" fill="${G.mu}">${esc(b)}</text>`;
  });
  return s + `</svg>`;
};
const legend = () => `<div style="display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;font-size:15px;color:${G.mu};margin-top:4px">` +
  STAGES.map((x) => `<span><i style="display:inline-block;width:22px;height:8px;border-radius:4px;background:${x.c};margin-right:6px;vertical-align:middle"></i>${esc(x.n)}</span>`).join('') + `</div>`;

/* ───────── Cây thư mục "final_v2" (HTML) ───────── */
const folder = () => `<div class="g-term"><div class="tb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span>📁 Bao-cao-SWP391 — Finder</span></div><pre style="font-size:15px;line-height:1.7">` +
  ['bao_cao.docx', 'bao_cao_v2.docx', 'bao_cao_final.docx', 'bao_cao_final_SUA.docx', 'bao_cao_final_v2_THẬT.docx', 'bao_cao_final_v2_THẬT (bản của An).docx', 'bao_cao_final_v2_THẬT (bản của Bình).docx']
    .map((f, i) => `<span class="${i >= 5 ? 'e' : 'o'}">📄 ${esc(f)}</span>`).join('\n') +
  `\n<span class="n"># Ai sửa gì? Vì sao? Bản nào mới nhất?</span></pre></div>`;

export const slides = S([
  cover({ t: 'Mục 0 — Bắt đầu với Git', sub: 'Khoá này cho ai · Git giải quyết vấn đề gì · cài đặt & khoá SSH · sân tập an toàn', chap: 'MỤC 0' }),

  { t: 'Bản đồ Mục 0', body: mindmap('Mục 0', 'chuẩn bị trước Chương 1', [
    { t: '0.1 Cho ai & lộ trình', d: '17 phần: Mục 0 + 16 chương, thi cuối khoá ở Ch16', c: 'amb' },
    { t: '0.2 Vấn đề Git giải quyết', d: 'final_v2_THẬT.docx · VCS phân tán · Git ≠ GitHub', c: 'git' },
    { t: '0.3 Cài đặt & cấu hình', d: 'macOS / Windows / Linux · git config · khoá SSH', c: 'blu' },
    { t: '0.4 Cách học', d: 'sân tập thu-git · 3 câu hỏi trước Enter · bộ ba chẩn đoán', c: 'grn' },
  ]) },

  { t: 'Khoá này viết cho ai?', body: `
    ${cards([
      { ic: '🌱', t: 'Người mới hoàn toàn', d: 'Chưa từng commit. Bắt đầu từ 0.2 — chỉ cần mở được terminal.', c: 'grn' },
      { ic: '🖐️', t: 'Người “năm lệnh”', d: 'add . / commit / push hằng ngày nhưng sợ rebase, sợ reset. Ch 1, 3, 4.', c: 'amb' },
      { ic: '👥', t: 'Trưởng nhóm đồ án', d: 'Nhóm SWP391 4–5 người: nhánh, PR, review, bảo vệ main. Ch 6–8, 16.', c: 'blu' },
      { ic: '🔥', t: 'Người đang gặp sự cố', d: 'Lỡ push nhầm, mất nhánh, lộ khoá API? Nhảy thẳng tới Ch 13.', c: 'red' },
    ], 2)}
    ${box('info', 'Một ý xuyên suốt: Git lưu <b>ảnh chụp</b> (snapshot) + vài <b>con trỏ</b> (nhánh, tag, <code>HEAD</code>). Mọi lệnh hoặc tạo ảnh chụp, hoặc dời con trỏ.')}` },

  { t: 'Lộ trình toàn khoá — 17 phần', body: `${roadmap()}${legend()}` },

  { t: 'Ba chương MỚI (bổ sung 09/2026)', body: `
    ${cards([
      { ic: '🧰', t: 'Ch 14 — Git trong công cụ', d: 'VS Code (stage từng dòng, merge editor 3 cột), Git Graph/GitLens, GitHub Desktop, lazygit · .gitconfig nâng cao · làm nhóm với bạn dùng Windows (CRLF/LF)', c: 'grn' },
      { ic: '🎓', t: 'Ch 15 — GitHub cho sinh viên', d: 'Profile README, ghim repo, README dự án · GitHub Pages cho portfolio · Student Pack, Codespaces · đóng góp mã nguồn mở lần đầu', c: 'blu' },
      { ic: '🏁', t: 'Ch 16 — Dự án nhóm cuối khoá', d: 'Nhóm 4 SV, đồ án “Đặt lịch phòng khám”, 3 tuần: dựng repo, 1 sprint, phát hành & hotfix, 8 sự cố kinh điển', c: 'git' },
    ], 3)}
    ${box('good', '<b>Bài thi cuối khoá 20 câu</b> nằm ở <b>cuối Chương 16</b> (bài 16.5), trải đều Ch 1–16. Bài 13.3 giờ chỉ kiểm tra riêng Chương 13.')}` },

  { t: 'Bạn đã từng tự làm “quản lý phiên bản”', body: two(
    folder(),
    term(['$ git log --format="%h %ad %an: %s" --date=format:%d/%m',
      'c09109c 16/09 An: Sửa tên đề tài theo góp ý của thầy',
      '9925789 15/09 Binh: Viết chương 2: yêu cầu hệ thống',
      '63a7a1a 14/09 An: Thêm dàn ý báo cáo',
      '$ git diff HEAD~1 --stat', ' bao-cao.md | 2 +-', ' 1 file changed, 1 insertion(+), 1 deletion(-)',
      '# ai · khi nào · vì sao · đổi đúng dòng nào'], { title: 'output thật — git 2.51', dir: '~/bao-cao', branch: '' }), 'r2') },

  { t: 'Bốn thứ thư mục “final_v2” không làm được', body: table(['Cách làm bằng thư mục', 'Git làm thay bạn', 'Lệnh / chương'], [
    ['Không nói <b>vì sao</b> (“SUA” là sửa gì?)', 'Mỗi phiên bản có lời nhắn + tác giả + thời điểm', '<code>git log</code> · Ch 1–2'],
    ['Không cho thấy <b>đổi gì</b> — phải đọc cả hai bản', 'Tính khác biệt từng dòng trong một giây', '<code>git diff</code> · Ch 1'],
    ['Hai người sửa cùng file ⇒ <b>một người mất công</b>', 'Hợp nhất tự động, chỉ hỏi ở chỗ chồng lấn thật', '<code>git merge</code> · Ch 3'],
    ['Quay lại bản cũ = <b>chép đè</b>, mất bản mới', 'Mọi phiên bản còn đó; quay lại là THÊM lịch sử', '<code>git revert</code> · Ch 4'],
  ]) },

  { t: 'Ba thế hệ quản lý phiên bản', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'l', x: 10, y: 20, w: 350, h: 110, t: '① Cục bộ', d: 'RCS, thư mục _final_v2\nlaptop chết = dự án chết', c: 'dim' },
      { id: 'c', x: 405, y: 20, w: 350, h: 110, t: '② Tập trung', d: 'CVS, Subversion, Perforce\nmột máy chủ = một điểm chết', c: 'amb' },
      { id: 'd', x: 800, y: 20, w: 350, h: 110, t: '③ Phân tán (Git)', d: 'mỗi bản clone = ĐỦ lịch sử\ncommit được khi không có mạng', c: 'grn' },
      { id: 'a', x: 70, y: 200, w: 240, h: 90, t: '💻 máy An', d: 'đủ lịch sử', c: 'blu' },
      { id: 's', x: 440, y: 200, w: 280, h: 90, t: '☁️ GitHub', d: 'bản clone cả nhóm coi là chung', c: 'git' },
      { id: 'b', x: 850, y: 200, w: 240, h: 90, t: '💻 máy Bình', d: 'đủ lịch sử', c: 'blu' },
    ], edges: [
      { from: 'l', to: 'c', c: 'dim' }, { from: 'c', to: 'd', c: 'dim' },
      { from: 'a', to: 's', t: 'push / pull', both: true, c: 'blu' },
      { from: 'b', to: 's', t: 'push / pull', both: true, c: 'blu' },
    ] })}
    ${box('info', '<code>git clone</code> tải <b>mọi phiên bản của mọi file</b> từ ngày đầu dự án ⇒ <code>git log</code> chạy tức thì, không cần mạng; GitHub sập bạn vẫn commit được.')}` },

  { t: 'Git ≠ GitHub', body: `
    ${diagram({ w: 1160, h: 330, nodes: [
      { id: 'g', x: 10, y: 30, w: 400, h: 150, t: '💻 Git — trên máy bạn', d: 'phần mềm miễn phí, mã nguồn mở\ncommit · nhánh · merge · lịch sử\nnằm trong thư mục ẩn .git/', c: 'git' },
      { id: 'h', x: 750, y: 10, w: 400, h: 90, t: '🐙 GitHub', d: 'dịch vụ lưu kho Git trên mạng (Microsoft)', c: 'blu' },
      { id: 'f', x: 750, y: 125, w: 400, h: 80, t: 'Thứ GitHub thêm vào', d: 'Pull request · Issues · Actions · Pages', c: 'vio' },
      { id: 'x', x: 750, y: 240, w: 400, h: 80, t: 'GitLab · Bitbucket · Gitea…', d: 'dịch vụ khác, cùng nói giao thức Git', c: 'dim', dash: true },
    ], edges: [
      { from: 'g', to: 'h', t: 'git push / git pull', both: true, c: 'grn', fs: 'r', ts: 'l' },
      { from: 'g', to: 'x', c: 'dim', dash: true, fs: 'r', ts: 'l' },
      { from: 'h', to: 'f', c: 'vio', fs: 'b', ts: 't' },
    ] })}
    ${box('tip', 'Không có mạng, không có tài khoản GitHub — Git vẫn chạy đủ. GitHub là <b>nơi gửi</b> kho, không phải Git. Và Git cũng <b>không phải Dropbox</b>: nó chỉ đồng bộ khi BẠN <code>commit</code> rồi <code>push</code>.')}` },

  { t: 'Cài Git — mỗi hệ điều hành một cách', body: `
    ${table(['Hệ điều hành', 'Cách cài khuyên dùng', 'Ghi chú'], [
      ['🍎 macOS (Mac M1)', '<code>brew install git</code>', 'Không có Homebrew: <code>xcode-select --install</code> (bản Apple, cũ hơn)'],
      ['🪟 Windows', '<b>Git for Windows</b> từ git-scm.com<br><code>winget install --id Git.Git -e --source winget</code>', 'Kèm <b>Git Bash</b> — dùng nó để lệnh trong khoá chạy nguyên văn'],
      ['🐧 Ubuntu / Debian', '<code>sudo apt install git</code>', 'Muốn bản mới nhất: PPA <code>ppa:git-core/ppa</code>'],
      ['🐧 Fedora · Arch', '<code>sudo dnf install git</code> · <code>sudo pacman -S git</code>', ''],
    ], { sm: true })}
    ${two(term(['$ git --version', 'git version 2.51.1'], { title: 'máy soạn bài — Mac M1', dir: '~', branch: '' }),
      box('info', 'Tính đến 09/2026: Git mới nhất <b>2.55.0</b>, Git for Windows <b>2.55.0(5)</b> (20/08/2026). Từ <b>2.30</b> trở lên là đủ cho cả khoá.'), '')}` },

  { t: 'git config — 6 dòng cài một lần', body: two(
    code(`# 1. Danh tính — ghi vào MỌI commit
git config --global user.name "Nguyen Van Cuong"
git config --global user.email "cuong@example.com"

# 2. Chặn lỗi vặt từ ngày đầu
git config --global init.defaultBranch main
git config --global pull.rebase false
git config --global core.autocrlf input
# (Windows: core.autocrlf true)
git config --global core.editor "code --wait"`, 'bash'),
    term(['$ git config --list --show-scope', 'global\tuser.name=Nguyen Van Cuong', 'global\tuser.email=cuong@example.com', 'global\tinit.defaultbranch=main',
      'global\tpull.rebase=false', 'global\tcore.autocrlf=input', 'global\tcore.editor=code --wait',
      '# trong kho đồ án: đè email bằng email trường', '$ git config user.email "cuong.nv@fpt.edu.vn"', '$ git config --show-scope --get-all user.email',
      'global\tcuong@example.com', '+ local\tcuong.nv@fpt.edu.vn', '$ git config user.email', '= cuong.nv@fpt.edu.vn'], { title: 'output thật — git 2.51', dir: '~/thu-git', branch: '' }), '') },

  { t: 'Khoá SSH: một cặp, hai nửa', body: `
    ${diagram({ w: 1160, h: 300, nodes: [
      { id: 'k', x: 0, y: 95, w: 230, h: 100, t: '① ssh-keygen', d: '-t ed25519\ntạo một CẶP khoá', c: 'amb', mono: true },
      { id: 'pr', x: 300, y: 10, w: 290, h: 100, t: '🔒 id_ed25519', d: 'khoá RIÊNG = mật khẩu\nKHÔNG rời máy bạn', c: 'red', mono: true },
      { id: 'pu', x: 300, y: 180, w: 290, h: 100, t: '🔓 id_ed25519.pub', d: 'khoá CÔNG KHAI\ndán đâu cũng an toàn', c: 'grn', mono: true },
      { id: 'gh', x: 680, y: 180, w: 230, h: 100, t: '② GitHub', d: 'Settings → SSH and\nGPG keys → New', c: 'blu' },
      { id: 't', x: 950, y: 95, w: 210, h: 100, t: '③ ssh -T', d: 'git@github.com\n“Hi …!” = xong', c: 'vio', mono: true },
    ], edges: [
      { from: 'k', to: 'pr', c: 'amb', fs: 'r', ts: 'l' }, { from: 'k', to: 'pu', c: 'amb', fs: 'r', ts: 'l' },
      { from: 'pu', to: 'gh', t: 'dán', c: 'grn' }, { from: 'gh', to: 't', c: 'blu', fs: 'r', ts: 'b' },
      { from: 'pr', to: 't', t: 'chứng minh', c: 'red', dash: true, fs: 'r', ts: 't' },
    ] })}
    ${box('bad', 'Dán nhầm file <b>không có đuôi .pub</b> lên web/chat/commit = lộ mật khẩu. Lộ rồi: xoá khoá trên GitHub, tạo cặp mới.')}` },

  { t: 'Khoá SSH — output thật', body: two(
    '<div class="g-wrap">' + term(['$ ssh-keygen -t ed25519 -C "cuong@example.com"', 'Generating public/private ed25519 key pair.', '# … hỏi chỗ lưu (Enter), rồi passphrase 2 lần …',
      'The key fingerprint is:', 'SHA256:asAafUeDlp1FG1HSFW5Ar4TpAUo7zkvyEt3QbKu9E58 cuong@example.com',
      '$ cat ~/.ssh/id_ed25519.pub', '= ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvO9wVSAOC3wnM8Kabj3qANfcgBL4Wh122bycaQSOjT cuong@example.com'], { title: 'OpenSSH 10.3 — máy soạn bài', dir: '~', branch: '' }) + '</div><style>.g-wrap .g-term pre{word-break:break-all}</style>',
    `${term(['# chưa nạp khoá lên GitHub:', '$ ssh -T git@github.com', "Warning: Permanently added 'github.com' (ED25519) to the list of known hosts.", '! git@github.com: Permission denied (publickey).'], { title: 'output thật', dir: '~', branch: '' })}
    ${box('good', 'Nạp khoá xong, GitHub Docs ghi câu trả lời là:<br><code>Hi USERNAME! You\'ve successfully authenticated, but GitHub does not provide shell access.</code> — đó là THÀNH CÔNG.')}
    ${box('warn', 'Lần đầu máy hỏi vân tay github.com: chỉ gõ <code>yes</code> khi khớp <code>SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU</code>')}`, 'r') },

  { t: 'Sân tập thu-git: phá thoải mái, cứu được hết', body: two(
    term(['$ git lg', '* 17f6418 (HEAD -> main) commit số 5', '* f1c7ab1 commit số 4', '* 9e09032 commit số 3', '* 9bdc2af commit số 2',
      '$ git reset --hard HEAD~3', '! HEAD is now at 9bdc2af commit số 2', '$ git reflog -2', '9bdc2af HEAD@{0}: reset: moving to HEAD~3', '+ 17f6418 HEAD@{1}: commit: commit số 5',
      '$ git reset --hard "HEAD@{1}"', '= HEAD is now at 17f6418 commit số 5'], { title: 'output thật — git 2.51', dir: '~/thu-git' }),
    `${steps([['<code>mkdir thu-git &amp;&amp; cd thu-git &amp;&amp; git init</code>', 'một kho vứt đi, KHÔNG phải repo đồ án'], ['Sinh vài commit bằng vòng lặp', 'có lịch sử để nghịch'], ['Phá: <code>reset --hard</code>', 'ba commit “biến mất”'], ['Cứu: <code>git reflog</code>', 'đã từng commit thì chưa mất']])}
    ${box('warn', 'Thứ DUY NHẤT không cứu được: thay đổi <b>chưa bao giờ commit</b>.')}`, 'l') },

  { t: 'Ba câu hỏi trước khi bấm Enter', body: `
    ${flow([
      { e: '🌳', t: 'Đụng cây nào?', d: 'thư mục làm việc · staging · lịch sử (Ch 1)', c: 'amb' },
      { e: '👉', t: 'Dời con trỏ hay tạo đối tượng?', d: 'dời con trỏ: rẻ, đảo được', c: 'blu' },
      { e: '📤', t: 'Commit đã push chưa?', d: 'đã push = việc của cả nhóm', c: 'red' },
    ])}
    ${code(`git status                             # đang ở đâu, gì đã add
git log --oneline --graph --all -20    # hình dạng lịch sử
git reflog -10                         # HEAD vừa đi đâu`, 'bash')}
    ${box('tip', 'Lạc thì chạy <b>bộ ba chẩn đoán</b> trước khi gõ bất cứ gì khác. Đặt alias một lần:<br><code>git config --global alias.lg "log --oneline --graph --all --decorate -20"</code>')}` },

  { t: 'Bảng tra nhanh Mục 0', body: table(['Muốn…', 'Gõ'], [
    ['Biết đã cài Git bản nào', '<code>git --version</code>'],
    ['Đặt tên + email (một lần)', '<code>git config --global user.name "…"</code> · <code>user.email "…"</code>'],
    ['Riêng một kho dùng email khác', '<code>git config user.email "…"</code> (trong kho đó)'],
    ['Xem cấu hình + nó đến từ mức nào', '<code>git config --list --show-scope</code> · <code>--show-origin</code>'],
    ['Tạo khoá SSH', '<code>ssh-keygen -t ed25519 -C "email"</code>'],
    ['In khoá công khai để dán lên GitHub', '<code>cat ~/.ssh/id_ed25519.pub</code>'],
    ['Kiểm kết nối GitHub', '<code>ssh -T git@github.com</code>'],
    ['Lạc — đang ở đâu?', '<code>git status</code> · <code>git lg</code> · <code>git reflog -10</code>'],
  ], { sm: true }) },

  { t: 'Thực hành Mục 0 (30 phút)', body: `
    ${steps([
      ['Cài Git, <code>git --version</code> ≥ 2.30', 'Windows: mở Git Bash, không dùng cmd'],
      ['Chạy 6 dòng <code>git config --global</code>', 'kiểm bằng <code>git config --list --show-scope</code>'],
      ['Tạo khoá ed25519 có passphrase, nạp lên GitHub', '<code>ssh -T git@github.com</code> phải chào đúng username của bạn'],
      ['Dựng <code>thu-git</code>, 5 commit, <code>reset --hard HEAD~3</code>', 'cứu lại bằng <code>git reflog</code>'],
    ])}
    ${box('good', '<b>Đạt khi:</b> <code>git config user.email</code> in đúng email trên GitHub · <code>ssh -T</code> chào tên bạn · <code>git lg</code> trong thu-git lại thấy “commit số 5”.')}` },
]);
