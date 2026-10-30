/**
 * OSG202 · 7.2 — Shell scripting basics. Mọi đầu ra / mã thoát trong bài đã được CHẠY THẬT bằng bash.
 */
import { doiDau, KHOA, bi, hai, giai, pre, tinh, jsDe, mc, tn, nguon } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Shell 1 — Variables, quoting and special parameters',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on shell basics.</p>', '<p>Năm câu về cơ bản của shell.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['<code>x=hello; echo \'$x\' "$x"</code> prints …', '<code>x=hello; echo \'$x\' "$x"</code> in ra …'], [['a', '$x hello'], ['b', 'hello hello'], ['c', '$x $x'], ['d', 'hello $x']], 'a', ['Single quotes block all expansion; double quotes still expand variables.', 'Nháy đơn chặn mọi khai triển; nháy kép vẫn khai triển biến.']),
    mc('c2', ['What is <code>$?</code>?', '<code>$?</code> là gì?'], [['a', 'The exit status of the last command (0 = success)'], ['b', 'The PID of the shell'], ['c', 'The number of arguments'], ['d', 'The last argument']], 'a', ['$$ is the PID, $# the argument count, $@ the arguments.', '$$ là PID, $# số đối số, $@ các đối số.']),
    mc('c3', ['Why write <code>"$@"</code> instead of <code>$*</code> when passing arguments on?', 'Vì sao nên viết <code>"$@"</code> thay vì <code>$*</code> khi chuyển tiếp đối số?'], [['a', '"$@" keeps each argument as one word, even if it contains spaces'], ['b', '$* is slower'], ['c', '"$@" sorts the arguments'], ['d', '$* is not valid in bash']], 'a', ['Unquoted $* is re-split on whitespace: “b c” becomes two words.', '$* không nháy bị tách lại theo khoảng trắng: “b c” thành hai từ.']),
    mc('c4', ['What does <code>${f%.*}</code> do for f=report.tar.gz?', '<code>${f%.*}</code> làm gì với f=report.tar.gz?'], [['a', 'Removes the shortest suffix matching .* → report.tar'], ['b', 'Removes the longest suffix → report'], ['c', 'Removes the prefix'], ['d', 'Returns gz']], 'a', ['% = shortest suffix, %% = longest suffix; # and ## do the same for prefixes.', '% = hậu tố ngắn nhất, %% = dài nhất; # và ## làm vậy cho tiền tố.']),
    mc('c5', ['The first line <code>#!/bin/bash</code> of a script is called …', 'Dòng đầu <code>#!/bin/bash</code> của script gọi là …'], [['a', 'the shebang: it names the interpreter the kernel runs'], ['b', 'a comment that is ignored by everything'], ['c', 'the exit code'], ['d', 'a variable assignment']], 'a', ['exec of a file starting with #! makes the kernel start the named interpreter with the script path.', 'exec một tệp bắt đầu bằng #! làm kernel chạy trình thông dịch được nêu với đường dẫn script.']),
  ],
  goiY: ['Single quotes = literal; double quotes = expand $ and `.', '% removes from the END, # removes from the START.'],
  loiHayGap: ['Using $* when arguments may contain spaces.', 'Confusing $? with $#.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('shebang', '#! chỉ trình thông dịch'), tn('exit status', 'mã thoát')],
  khaiNiem: ['variables', 'quoting', 'parameter expansion'],
});

const SN = [
  ['x=5; y=$((x*2+1)); echo "$y"', '11'], ['name="Ana Maria"; echo ${#name}', '9'], ['f=report.tar.gz; echo ${f%.*} ${f%%.*} ${f##*.}', 'report.tar report gz'],
  ['set -- a "b c" d; echo $#', '3'], ['echo $(( 7 / 2 )) $(( 7 % 2 )) $(( 2 ** 5 ))', '3 1 32'], ['arr=(a b c); echo ${#arr[@]} ${arr[1]}', '3 b'], ['unset y; echo ${y:-d} ${y:=e} $y', 'd e e'],
];
const E2 = tinh({
  tieuDe: 'Shell 2 — Predict the output of the one-liner',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Write exactly what each bash one-liner prints (one line).</p>', '<p>Viết đúng những gì mỗi lệnh bash một dòng in ra (một dòng).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Output', 'Đầu ra'),
    cot: [{ ma: 'c', ten: 'Snippet' }, { ma: 'o', ten: 'Output' }],
    hang: SN.map(([c], i) => ({ ma: `c${i}`, o: { c } })),
    dapAn: Object.fromEntries(SN.map(([, o], i) => [`c${i}.o`, o])),
    giaiThich: giai('All answers were produced by running the snippets in bash. Integer division truncates (7/2 = 3); ** is exponentiation; ${y:=e} assigns when y is unset; ${#arr[@]} counts array elements.', 'Mọi đáp án được chạy thật trong bash. Chia nguyên cắt phần thập phân (7/2 = 3); ** là luỹ thừa; ${y:=e} gán khi y chưa đặt; ${#arr[@]} đếm phần tử mảng.'),
  }],
  goiY: ['Evaluate arithmetic expansions $(( )) first.', '${var:-d} substitutes without assigning; ${var:=d} assigns.'],
  loiHayGap: ['Expecting 3.5 from $(( 7 / 2 )).', 'Forgetting that ${y:=e} also changes y for the last echo argument.'],
  giaiThich: '<p>' + SN.map(([, o]) => o).join(' · ') + '</p>',
  thuatNgu: [tn('parameter expansion', 'khai triển tham số'), tn('arithmetic expansion', 'khai triển số học $(( ))')],
  khaiNiem: ['parameter expansion', 'arithmetic'],
});

const EX = [
  ['[ 3 -gt 5 ]; echo $?', '1'], ['(exit 3); echo $?', '3'], ['echo hi | grep -q x; echo $?', '1'], ['test -d /; echo $?', '0'], ['f(){ return 7; }; f; echo $?', '7'],
  ['true && false || echo C; echo $?', 'C 0'], ['false || true && echo D', 'D'],
];
const E3 = tinh({
  tieuDe: 'Shell 3 — Exit codes and && / || chains',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Give the output of each snippet. For the two chains, the output has two lines: write them separated by a single space (e.g. <code>C 0</code>).</p>', '<p>Cho đầu ra của từng đoạn. Với hai chuỗi lệnh, đầu ra có hai dòng: viết chúng cách nhau một dấu cách (vd <code>C 0</code>).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Output', 'Đầu ra'),
    cot: [{ ma: 'c', ten: 'Snippet' }, { ma: 'o', ten: 'Output' }],
    hang: EX.map(([c], i) => ({ ma: `c${i}`, o: { c } })),
    dapAn: Object.fromEntries(EX.map(([, o], i) => [`c${i}.o`, o])),
    giaiThich: giai('0 means success. [ 3 -gt 5 ] is false → 1; (exit 3) runs in a subshell and its status becomes $?; grep -q x fails → 1. In `true && false || echo C` the && yields 1, so the || branch runs and prints C, and the status of the whole list is that of echo = 0. `false || true && echo D` evaluates left to right: false → run true (0) → run echo.', '0 là thành công. [ 3 -gt 5 ] sai → 1; (exit 3) chạy trong subshell, mã của nó thành $?; grep -q x thất bại → 1. Với `true && false || echo C` thì && cho 1, nhánh || chạy và in C, mã của cả danh sách là của echo = 0. `false || true && echo D` tính từ trái sang phải: false → chạy true (0) → chạy echo.'),
  }],
  goiY: ['&& runs the right side only if the left succeeded; || only if it failed. Both associate to the left.', '$? always refers to the LAST command executed.'],
  loiHayGap: ['Thinking a && b || c is “if a then b else c” (c also runs when b fails).', 'Expecting `exit 3` inside parentheses to end the whole shell.'],
  giaiThich: '<p>' + EX.map(([, o]) => o).join(' · ') + '</p>',
  thuatNgu: [tn('subshell', 'shell con chạy trong (...)'), tn('command list', 'danh sách lệnh nối bằng && ||')],
  khaiNiem: ['exit status', 'and-or lists'],
});

/* Bài 4 HARD: tách từ kiểu shell */
function splitWords(line) {
  var out = [], cur = '', has = false, i = 0, q = null;
  while (i < line.length) {
    var ch = line[i];
    if (q === "'") { if (ch === "'") q = null; else cur += ch; i++; continue; }
    if (q === '"') {
      if (ch === '"') q = null;
      else if (ch === '\\' && (line[i + 1] === '"' || line[i + 1] === '\\')) { cur += line[i + 1]; i++; }
      else cur += ch;
      i++; continue;
    }
    if (ch === "'" || ch === '"') { q = ch; has = true; i++; continue; }
    if (ch === '\\') { if (i + 1 >= line.length) return null; cur += line[i + 1]; has = true; i += 2; continue; }
    if (ch === ' ' || ch === '\t') { if (has || cur !== '') { out.push(cur); cur = ''; has = false; } i++; continue; }
    cur += ch; has = true; i++;
  }
  if (q) return null;
  if (has || cur !== '') out.push(cur);
  return out;
}
const E4 = jsDe({
  tieuDe: 'Shell 4 — Split a command line into words like the shell',
  doKho: 'HARD', phut: 25,
  moTa: bi(`<p>Write <code>splitWords(line)</code>, the first stage of a shell parser. Words are separated by spaces or tabs. Single quotes keep everything inside literally; double quotes keep spaces and only treat <code>\\"</code> and <code>\\\\</code> as escapes; outside quotes a backslash makes the next character literal. Adjacent pieces form ONE word (<code>a"b c"d</code> → <code>ab cd</code>) and an empty pair of quotes still makes an (empty) word. Return the array of words, or <code>null</code> if a quote is not closed or the line ends with a lone backslash. Do not expand variables.</p>`,
    `<p>Viết <code>splitWords(line)</code>, giai đoạn đầu của bộ phân tích cú pháp shell. Từ cách nhau bởi dấu cách hoặc tab. Nháy đơn giữ nguyên mọi thứ bên trong; nháy kép giữ dấu cách và chỉ coi <code>\\"</code> và <code>\\\\</code> là thoát; ngoài nháy, dấu gạch ngược làm ký tự kế tiếp thành nghĩa đen. Các mảnh liền nhau tạo thành MỘT từ (<code>a"b c"d</code> → <code>ab cd</code>) và cặp nháy rỗng vẫn tạo ra một từ (rỗng). Trả mảng các từ, hoặc <code>null</code> nếu có nháy chưa đóng hoặc dòng kết thúc bằng một dấu gạch ngược đơn độc. Không khai triển biến.</p>`),
  yeuCau: [bi('Do not use a regular expression for the whole job: use a small state machine.', 'Đừng dùng một biểu thức chính quy cho cả bài: dùng máy trạng thái nhỏ.')],
  viDu: [{ input: 'splitWords(\'echo "hello world" \\\'x y\\\'\')', output: JSON.stringify(splitWords('echo "hello world" \'x y\'')), explanation: 'Quotes group words and are removed.|||Nháy gom từ và bị bỏ đi.' }],
  goiY: ['States: normal, inside single quotes, inside double quotes. Keep a flag “word started” so that "" produces an empty word.', 'On a space in the normal state, push the current word if it started.'],
  loiHayGap: ['Dropping empty words made by "".', 'Treating backslash inside single quotes as an escape.'],
  giaiThich: '<p>This is how <code>/bin/sh</code> decides that <code>cp "my file" dir</code> has three words, not four.</p>',
  khaiNiem: ['shell parsing', 'quoting'],
  fn: 'splitWords',
  dau: "function splitWords(line) {\n  return [];\n}\n",
  giaiMa: '// A tiny quoting state machine.\n' + nguon(splitWords),
  ref: splitWords,
  cases: [{ args: ['ls -l /tmp'] }, { args: ['echo "hello world" \'x y\''] }, { args: ['cp "my file" dir'] }, { args: ['a"b c"d e'] }, { args: ['echo \'\' x'] }, { args: ['echo "unterminated'], an: true }, { args: ['  spaced   out  '], an: true }, { args: ['say \\"hi\\" "a\\"b" \'c\\d\''], an: true }, { args: ['bad\\'], an: true }, { args: [''], an: true }],
});

const E5 = tinh({
  tieuDe: 'Shell 5 — Subshells, pipelines, jobs and trap',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Five questions on how the shell uses processes. All outputs were checked in bash.</p>', '<p>Năm câu về cách shell dùng tiến trình. Mọi đầu ra đã được kiểm trong bash.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['<code>x=1; (x=2); echo $x</code> prints …', '<code>x=1; (x=2); echo $x</code> in ra …'], [['a', '1'], ['b', '2'], ['c', 'nothing'], ['d', 'an error']], 'a', ['Parentheses run a subshell (a forked child): its variables disappear when it exits.', 'Dấu ngoặc chạy subshell (tiến trình con): biến của nó mất khi nó thoát.']),
    mc('c2', ['<code>cnt=0; echo a | while read l; do cnt=$((cnt+1)); done; echo $cnt</code> prints …', '<code>cnt=0; echo a | while read l; do cnt=$((cnt+1)); done; echo $cnt</code> in ra …'], [['a', '0 (in bash: the loop ran in a subshell)'], ['b', '1'], ['c', '2'], ['d', 'a']], 'a', ['Each stage of a pipeline is a separate process; the counter changed in the child only. Use process substitution or a here-string to keep it in the parent.', 'Mỗi tầng của pipeline là một tiến trình riêng; biến đếm chỉ đổi ở tiến trình con. Dùng process substitution hoặc here-string để giữ ở tiến trình cha.']),
    mc('c3', ['What does <code>$$</code> contain?', '<code>$$</code> chứa gì?'], [['a', 'The PID of the current shell'], ['b', 'The exit status'], ['c', 'The number of arguments'], ['d', 'The PID of the last background job']], 'a', ['$! is the last background job.', '$! là công việc nền cuối cùng.']),
    mc('c4', ['A script runs a long job in the background with <code>cmd &amp;</code> and later needs its result. Which builtin waits for it?', 'Script chạy công việc dài ở nền bằng <code>cmd &amp;</code> và cần kết quả sau đó. Lệnh dựng sẵn nào chờ nó?'], [['a', 'wait'], ['b', 'sleep'], ['c', 'fg'], ['d', 'exec']], 'a', ['wait blocks until the background children finish and returns their status.', 'wait chặn tới khi các tiến trình con nền xong và trả mã thoát của chúng.']),
    mc('c5', ['<code>trap \'rm -f /tmp/lock\' EXIT</code> in a script …', '<code>trap \'rm -f /tmp/lock\' EXIT</code> trong script …'], [['a', 'runs the cleanup command whenever the script exits'], ['b', 'prevents the script from exiting'], ['c', 'kills the script'], ['d', 'runs it only on SIGKILL']], 'a', ['trap installs a handler; EXIT fires on any exit (but not on SIGKILL, which cannot be caught).', 'trap cài trình xử lý; EXIT chạy ở mọi lần thoát (trừ SIGKILL không bắt được).']),
  ],
  goiY: ['A subshell is a fork: its variable changes are private.', 'Pipeline stages run in parallel as separate processes.'],
  loiHayGap: ['Expecting a variable set in a pipeline loop to survive.', 'Confusing $$ with $!.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('process substitution', 'thay thế tiến trình <( )'), tn('trap', 'bắt tín hiệu hoặc sự kiện thoát')],
  khaiNiem: ['subshell', 'pipelines', 'jobs', 'trap'],
});

export default doiDau({
  slug: 'osg202-7-2-shell-script',
  ten: '7.2 Shell scripting basics',
  khoa: KHOA,
  baiHoc: 'osg202-7-2-shell-script',
  de: [E1, E2, E3, E4, E5],
});
void hai; void pre;
