/**
 * OSG202 · 7.1 — Essential Linux commands. Đầu ra của các lệnh trong bài 2 đã được CHẠY THẬT bằng bash trên tệp mẫu.
 */
import { doiDau, KHOA, S, bi, hai, giai, pre, tinh, jsDe, mc, tn, nguon } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Linux 1 — Commands, redirection and pipes (concepts)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on the everyday Linux command line.</p>', '<p>Năm câu về dòng lệnh Linux hằng ngày.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What is the difference between <code>&gt;</code> and <code>&gt;&gt;</code>?', '<code>&gt;</code> khác <code>&gt;&gt;</code> ở chỗ nào?'], [['a', '> overwrites (truncates) the file, >> appends to it'], ['b', '> appends, >> overwrites'], ['c', 'They are identical'], ['d', '> is for input, >> for output']], 'a', ['Use >> for logs; a stray > destroys the old content.', 'Dùng >> cho log; một dấu > lỡ tay sẽ xoá nội dung cũ.']),
    mc('c2', ['What does <code>ls | wc -l</code> print?', '<code>ls | wc -l</code> in ra gì?'], [['a', 'The number of entries listed by ls'], ['b', 'The size of the directory in bytes'], ['c', 'The words in each file'], ['d', 'Nothing; a pipe needs a file name']], 'a', ['The pipe connects ls’s standard output to wc’s standard input; -l counts lines.', 'Pipe nối stdout của ls vào stdin của wc; -l đếm số dòng.']),
    mc('c3', ['Which command shows permissions, owner, size and date in a long listing?', 'Lệnh nào hiện quyền, chủ sở hữu, kích thước và ngày trong danh sách dài?'], [['a', 'ls -l'], ['b', 'ls -a'], ['c', 'pwd'], ['d', 'cat']], 'a', ['-a shows hidden files; -l the long format.', '-a hiện tệp ẩn; -l là dạng dài.']),
    mc('c4', ['<code>cmd &gt; out.txt 2&gt;&amp;1</code> sends …', '<code>cmd &gt; out.txt 2&gt;&amp;1</code> gửi …'], [['a', 'both stdout and stderr to out.txt'], ['b', 'only stderr to out.txt'], ['c', 'stdout to the screen and stderr to a file'], ['d', 'stdin to out.txt']], 'a', ['Order matters: first stdout goes to the file, then stderr is duplicated onto stdout’s destination. <code>2&gt;&amp;1 &gt; out.txt</code> would leave stderr on the terminal.', 'Thứ tự quan trọng: stdout vào tệp rồi stderr nhân đôi theo đích của stdout. <code>2&gt;&amp;1 &gt; out.txt</code> sẽ để stderr ở terminal.']),
    mc('c5', ['Which command finds files named *.log under /var and below?', 'Lệnh nào tìm tệp *.log trong /var và các thư mục con?'], [['a', 'find /var -name "*.log"'], ['b', 'ls /var -name *.log'], ['c', 'grep /var *.log'], ['d', 'cd /var *.log']], 'a', ['find walks the tree; grep searches INSIDE files.', 'find duyệt cây thư mục; grep tìm BÊN TRONG tệp.']),
  ],
  goiY: ['Pipes connect processes; redirections connect a process to a file.', 'find looks at names, grep at contents.'],
  loiHayGap: ['Overwriting a log with > instead of appending with >>.', 'Using grep to look for file names.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('pipe', 'đường ống: stdout của lệnh này thành stdin của lệnh kia'), tn('redirection', 'chuyển hướng I/O chuẩn')],
  khaiNiem: ['redirection', 'pipes', 'find'],
});

const FILE = 'ana:90\nbao:75\nchi:90\ndung:60';
const cmds = [
  ['wc -l < scores.txt', '4'], ['grep -c 90 scores.txt', '2'], ['cut -d: -f2 scores.txt | sort -n | head -1', '60'], ['tail -n 1 scores.txt | cut -d: -f1', 'dung'],
  ['head -n 2 scores.txt | tail -n 1', 'bao:75'], ['cut -d: -f1 scores.txt | tr a-z A-Z | head -n 1', 'ANA'], ["awk -F: '{s+=$2} END {print s}' scores.txt", '315'], ['grep -n chi scores.txt', '3:chi:90'], ['sed s/a/A/g scores.txt | head -1', 'AnA:90'],
];
const E2 = tinh({
  tieuDe: 'Linux 2 — Predict the output of the pipeline',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>The file <code>scores.txt</code> contains:</p>${pre(FILE)}<p>Write the exact output of each command (a single line each; ignore leading spaces).</p>`,
    `<p>Tệp <code>scores.txt</code> chứa:</p>${pre(FILE)}<p>Viết đúng đầu ra của từng lệnh (mỗi lệnh một dòng; bỏ qua khoảng trắng đầu dòng).</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Output', 'Đầu ra'),
    cot: [{ ma: 'c', ten: 'Command' }, { ma: 'o', ten: 'Output' }],
    hang: cmds.map(([c], i) => ({ ma: `c${i}`, o: { c } })),
    dapAn: Object.fromEntries(cmds.map(([, o], i) => [`c${i}.o`, o])),
    giaiThich: giai('Every output was produced by running the command in bash. Key ideas: wc -l counts lines; grep -c counts matching lines (both 90s); cut -f2 isolates the score; sed s/a/A/g replaces EVERY a on the line (without g only the first); awk sums column 2 (90+75+90+60 = 315).', 'Mọi đầu ra đã được chạy thật bằng bash. Ý chính: wc -l đếm dòng; grep -c đếm dòng khớp (cả hai điểm 90); cut -f2 tách điểm; sed s/a/A/g thay MỌI chữ a trên dòng (không có g chỉ thay chữ đầu); awk cộng cột 2 (90+75+90+60 = 315).'),
  }],
  goiY: ['Work left to right: the output of each stage is the input of the next.', 'grep -n prefixes the line number and a colon.'],
  loiHayGap: ['Forgetting that sed without g replaces only the first match per line.', 'Counting words instead of lines with wc -l.'],
  giaiThich: '<p>' + cmds.map(([, o]) => o).join(' · ') + '</p>',
  thuatNgu: [tn('standard input/output', 'stdin / stdout'), tn('filter', 'lệnh đọc stdin, ghi stdout')],
  khaiNiem: ['text processing', 'pipelines'],
});

const LS = '-rwxr-x--- 2 ana staff 4096 Oct 30 12:00 run.sh';
const E3 = tinh({
  tieuDe: 'Linux 3 — Read an ls -l line',
  doKho: 'EASY', phut: 7,
  moTa: bi(`<p>Decode this line of <code>ls -l</code>:</p>${pre(LS)}`, `<p>Giải mã dòng <code>ls -l</code> này:</p>${pre(LS)}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Fields', 'Các trường'),
    cot: [{ ma: 'q', ten: 'Question' }, { ma: 'a', ten: 'Answer' }],
    hang: [['t', 'File type (first character: - regular, d directory, l symlink)'], ['o', 'Permissions of the owner (3 characters)'], ['g', 'Permissions of the group'], ['x', 'Permissions of others'], ['n', 'Number of hard links'], ['u', 'Owner'], ['s', 'Size in bytes']].map(([m, q]) => ({ ma: m, o: { q } })),
    dapAn: { 't.a': '-', 'o.a': 'rwx', 'g.a': 'r-x', 'x.a': '---', 'n.a': '2', 'u.a': 'ana', 's.a': '4096' },
    giaiThich: giai('-rwxr-x--- = regular file, owner rwx (7), group r-x (5), others none (0): mode 750. Link count 2, owner ana, group staff, 4096 bytes.', '-rwxr-x--- = tệp thường, chủ rwx (7), nhóm r-x (5), người khác không có (0): mode 750. Số liên kết 2, chủ ana, nhóm staff, 4096 byte.'),
  }],
  goiY: ['The 10 characters are 1 type + 3 owner + 3 group + 3 others.', 'After the permissions: links, owner, group, size, date, name.'],
  loiHayGap: ['Reading the first character as part of the owner’s permissions.', 'Mixing owner and group columns.'],
  giaiThich: '<p>- · rwx · r-x · --- · 2 · ana · 4096.</p>',
  thuatNgu: [tn('ls -l', 'liệt kê dạng dài')],
  khaiNiem: ['ls -l', 'permissions'],
});

const E4 = tinh({
  tieuDe: 'Linux 4 — Redirection order, jobs and signals',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five questions on redirection, background jobs and signals.</p>', '<p>Năm câu về chuyển hướng, tiến trình nền và tín hiệu.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What does a trailing <code>&amp;</code> do, as in <code>sleep 100 &amp;</code>?', 'Dấu <code>&amp;</code> ở cuối, như <code>sleep 100 &amp;</code>, làm gì?'], [['a', 'Runs the command in the background; the shell returns the prompt at once'], ['b', 'Runs it twice'], ['c', 'Makes it run as root'], ['d', 'Pipes it to the next command']], 'a', ['The shell forks the child but does not wait for it.', 'Shell fork tiến trình con nhưng không chờ nó.']),
    mc('c2', ['Ctrl-C in a terminal sends which signal to the foreground job?', 'Ctrl-C trong terminal gửi tín hiệu nào cho tiến trình foreground?'], [['a', 'SIGINT'], ['b', 'SIGKILL'], ['c', 'SIGSTOP'], ['d', 'SIGHUP']], 'a', ['SIGINT can be caught; SIGKILL and SIGSTOP cannot.', 'SIGINT bắt được; SIGKILL và SIGSTOP thì không.']),
    mc('c3', ['Which signal can a process NOT catch or ignore?', 'Tín hiệu nào tiến trình KHÔNG thể bắt hay bỏ qua?'], [['a', 'SIGKILL (9)'], ['b', 'SIGTERM (15)'], ['c', 'SIGINT (2)'], ['d', 'SIGHUP (1)']], 'a', ['SIGTERM is the polite request that lets a program clean up; kill -9 is the last resort.', 'SIGTERM là lời yêu cầu lịch sự để chương trình dọn dẹp; kill -9 là cách cuối cùng.']),
    mc('c4', ['Ctrl-Z followed by <code>bg</code> …', 'Ctrl-Z rồi <code>bg</code> …'], [['a', 'suspends the job, then resumes it in the background'], ['b', 'kills the job'], ['c', 'moves it to another terminal'], ['d', 'restarts it from the beginning']], 'a', ['Ctrl-Z sends SIGTSTP; bg sends SIGCONT and keeps it in the background; fg brings it back.', 'Ctrl-Z gửi SIGTSTP; bg gửi SIGCONT và để nó chạy nền; fg đưa lại foreground.']),
    mc('c5', ['<code>cat missing.txt 2&gt;&amp;1 &gt; out.txt</code> (file missing.txt does not exist) puts the error message …', '<code>cat missing.txt 2&gt;&amp;1 &gt; out.txt</code> (tệp missing.txt không tồn tại) đưa thông báo lỗi …'], [['a', 'on the terminal, because stderr was duplicated onto the terminal BEFORE stdout moved to the file'], ['b', 'into out.txt'], ['c', 'nowhere'], ['d', 'into missing.txt']], 'a', ['Redirections are processed left to right: 2>&1 copies the current stdout (the terminal), then > moves stdout only.', 'Chuyển hướng xử lý từ trái sang phải: 2>&1 sao chép stdout hiện tại (terminal), rồi > chỉ dời stdout.']),
  ],
  goiY: ['Think of redirections as assignments evaluated left to right.', 'Catchable signals allow a clean shutdown.'],
  loiHayGap: ['Believing kill -9 is a good first choice.', 'Writing 2>&1 first and expecting the error in the file.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('SIGTERM / SIGKILL', 'yêu cầu dừng / buộc dừng'), tn('background job', 'công việc chạy nền')],
  khaiNiem: ['job control', 'signals', 'redirection order'],
});

/* Bài 5 HARD: chmod ký hiệu */
function applyChmod(mode, spec) {
  var m = parseInt(mode, 8);
  var sh = { u: 6, g: 3, o: 0 };
  spec.split(',').forEach(function (clause) {
    var mt = /^([ugoa]*)([-+=])([rwx]*)$/.exec(clause);
    if (!mt) throw new Error('bad clause: ' + clause);
    var who = mt[1] || 'a';
    if (who.indexOf('a') >= 0) who = 'ugo';
    var bits = (mt[3].indexOf('r') >= 0 ? 4 : 0) + (mt[3].indexOf('w') >= 0 ? 2 : 0) + (mt[3].indexOf('x') >= 0 ? 1 : 0);
    who.split('').forEach(function (c) {
      var b = bits << sh[c];
      var mask = 7 << sh[c];
      if (mt[2] === '+') m |= b;
      else if (mt[2] === '-') m &= ~b;
      else m = (m & ~mask) | b;
    });
  });
  return ('000' + m.toString(8)).slice(-3);
}
const E5 = jsDe({
  tieuDe: 'Linux 5 — Implement chmod with symbolic modes',
  doKho: 'HARD', phut: 25,
  moTa: bi(`<p>Write <code>applyChmod(mode, spec)</code>. <code>mode</code> is the current permission as a 3-digit octal string such as <code>'644'</code>; <code>spec</code> is a comma-separated list of clauses <code>[ugoa]*[+-=][rwx]*</code> exactly as accepted by <code>chmod</code> (<code>u</code> owner, <code>g</code> group, <code>o</code> others, <code>a</code> all; an empty “who” means all; <code>+</code> adds, <code>-</code> removes, <code>=</code> sets exactly those bits for the named classes). Clauses are applied left to right. Return the new mode as a 3-digit octal string.</p>`,
    `<p>Viết <code>applyChmod(mode, spec)</code>. <code>mode</code> là quyền hiện tại dạng chuỗi bát phân 3 chữ số như <code>'644'</code>; <code>spec</code> là danh sách các mệnh đề cách nhau bằng dấu phẩy dạng <code>[ugoa]*[+-=][rwx]*</code> đúng như <code>chmod</code> chấp nhận (<code>u</code> chủ, <code>g</code> nhóm, <code>o</code> người khác, <code>a</code> tất cả; “who” rỗng nghĩa là tất cả; <code>+</code> thêm, <code>-</code> bớt, <code>=</code> đặt đúng các bit đó cho các lớp được nêu). Các mệnh đề áp dụng từ trái sang phải. Trả mode mới dạng chuỗi bát phân 3 chữ số.</p>`),
  yeuCau: [bi('Ignore the umask and the special bits (setuid, sticky).', 'Bỏ qua umask và các bit đặc biệt (setuid, sticky).')],
  viDu: [{ input: "applyChmod('644', 'u+x')", output: JSON.stringify(applyChmod('644', 'u+x')), explanation: 'rw-r--r-- plus execute for the owner = rwxr--r--.|||rw-r--r-- thêm thực thi cho chủ = rwxr--r--.' }],
  goiY: ['Each class occupies 3 bits: user 6–8, group 3–5, others 0–2.', '“=” clears the 3 bits of the class before setting the new ones.'],
  loiHayGap: ['Treating “=” like “+” (the old bits remain).', 'Forgetting that an empty “who” means all three classes.'],
  giaiThich: '<p>Symbolic chmod is bit arithmetic: shift the rwx value into the class position and OR, AND-NOT or replace.</p>',
  khaiNiem: ['chmod', 'permission bits'],
  fn: 'applyChmod',
  dau: "function applyChmod(mode, spec) {\n  return mode;\n}\n",
  giaiMa: '// Parse each clause; shift the bits into the right class.\n' + nguon(applyChmod),
  ref: applyChmod,
  cases: [{ args: ['644', 'u+x'] }, { args: ['755', 'go-rx'] }, { args: ['600', 'a+r'] }, { args: ['777', 'u=rw,g=r,o='] }, { args: ['000', 'a=rwx'] }, { args: ['644', '+x'], an: true }, { args: ['750', 'g+w,o+r,u-x'], an: true }, { args: ['640', 'ug=rw'], an: true }],
});

export default doiDau({
  slug: 'osg202-7-1-lenh-linux',
  ten: '7.1 Essential Linux commands',
  khoa: KHOA,
  baiHoc: 'osg202-7-1-lenh-linux',
  de: [E1, E2, E3, E4, E5],
});
void hai; void S;
