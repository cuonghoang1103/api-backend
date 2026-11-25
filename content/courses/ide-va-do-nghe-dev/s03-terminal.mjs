/**
 * IDE & đồ nghề dev — Chương 3: Terminal làm việc thay bạn (soạn 24/11/2026, agent ide trên máy nhà).
 * Slug + title chương GIỮ NGUYÊN theo khung trong ../ide-va-do-nghe-dev.mjs (ghép bằng ghep()).
 * Ranh giới với linux-bash: cú pháp alias/hàm/HISTCONTROL đầy đủ ở lnx-8-4, sống sót khi rớt SSH ở lnx-5-4 + lnx-9-3,
 * grep/regex vừa đủ ở lnx-3-3. Ở đây: quy trình làm việc hằng ngày của dev + terminal trong IDE + công cụ hiện đại —
 * vẫn dạy đủ từ số 0 phần cần dùng, liên kết linux-bash chỉ để đọc thêm.
 * Mọi output chạy THẬT ngày 24/11/2026 trong container "máy SV" Ubuntu 24.04 (ripgrep 14.1.0, fd 9.0.0, fzf 0.44.1,
 * bat 0.24.0, jq 1.7, tmux 3.4, zsh 5.9, bash 5.2, Node 22.21.1) trên labflow-mini (+ tao-ch3.sh) và gear-mini;
 * PowerShell 7.4.2 + PSReadLine 2.3.5 (ảnh mcr.microsoft.com/powershell); gear-mini chạy trong eclipse-temurin:21.
 * Màn hình tương tác (Ctrl+R, fzf, tmux) chụp bằng tmux capture-pane — chữ thật, chỉ mất màu.
 * Mã/output nhúng dạng chuỗi JSON (sinh bằng scratchpad/ide/parts/s03/ghep.py) nên không có backtick trần.
 */
import { bash, out, tl, giai, json, phim, bai, Q } from './_chung.mjs';

/* ═════════════ 3.1 — Nền tảng shell ═════════════ */
const O_CTRL_R = out("# Ctrl+R rồi gõ: spring\n(reverse-i-search)`spring': ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev\n# bấm Ctrl+R lần nữa\n(reverse-i-search)`spring': ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev\n# bấm Ctrl+R lần ba\n(failed reverse-i-search)`spring': ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev\n# Ctrl+R, gõ test, rồi phím → để đưa lệnh ra dấu nhắc mà CHƯA chạy\nsv@may-sv:~/do-nghe/gear-mini$ ./mvnw -q test -Dtest=GearServiceTest\n");
const O_BANG = out("sv@may-sv:~/do-nghe/gear-mini$ ls src/main/java/com/labflow/gear/gear\nGear.java                   GearRepository.java          LecturerPolicy.java  StudentPolicy.java\nGearController.java         GearService.java             LoanPolicy.java\nGearNotFoundException.java  InMemoryGearRepository.java  StartupLog.java\nsv@may-sv:~/do-nghe/gear-mini$ cd !$\ncd src/main/java/com/labflow/gear/gear\nsv@may-sv:~/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear$ pwd\n/home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear\nsv@may-sv:~/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear$ cd ~/do-nghe/gear-mini\nsv@may-sv:~/do-nghe/gear-mini$ cat pom.xml | grep -c depndency\n0\nsv@may-sv:~/do-nghe/gear-mini$ ^depndency^dependency\ncat pom.xml | grep -c dependency\n4\n");
const B_DEV_SH = bash("# ~/.config/do-nghe/dev.sh — alias và hàm hằng ngày, chạy được cả bash lẫn zsh.\n# Nạp từ ~/.bashrc hoặc ~/.zshrc bằng dòng:  [ -f ~/.config/do-nghe/dev.sh ] && . ~/.config/do-nghe/dev.sh\n\n# --- alias: chỉ là viết tắt, chữ được dán vào ĐẦU dòng lệnh ---\nalias gs='git status -sb'\nalias gl='git log --oneline --graph -12'\nalias gd='git diff --stat'\nalias ..='cd ..'\n\n# --- hàm: khi cần tham số ở giữa, cần logic, cần đổi thư mục ---\n# mw <đối số mvn>: chạy ./mvnw của dự án từ BẤT KỲ thư mục con nào\nmw() {\n  local d=$PWD\n  while [ \"$d\" != \"/\" ] && [ ! -x \"$d/mvnw\" ]; do d=$(dirname \"$d\"); done\n  [ -x \"$d/mvnw\" ] || { echo \"mw: khong tim thay mvnw tu $PWD tro len\" >&2; return 1; }\n  (cd \"$d\" && ./mvnw \"$@\")\n}\n\n# mkcd <thư mục>: tạo rồi vào luôn\nmkcd() { mkdir -p -- \"$1\" && cd -- \"$1\"; }\n\n# cong <số cổng>: tiến trình nào đang nghe cổng đó (Mac + Linux)\ncong() { lsof -nP -iTCP:\"$1\" -sTCP:LISTEN || echo \"cong $1: khong co ai nghe\"; }\n\n# api <đường dẫn>: gọi API đang chạy ở máy mình, in JSON cho dễ đọc\napi() { curl -sS \"http://localhost:${API_PORT:-3000}$1\" | jq .; }\n");
const O_ALIAS = out("$ pwd\n/home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear\n\n$ type gs\ngs is aliased to `git status -sb'\n\n$ type mw | head -3\nmw is a function\nmw () \n{ \n\n$ gs\n## master\n\n$ cong 41300\nCOMMAND PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME\nnode    306   sv   18u  IPv6 1934608034      0t0  TCP *:41300 (LISTEN)\n\n$ cong 41301\ncong 41301: khong co ai nghe\n\n$ API_PORT=41300 api /users/2\n{\n  \"id\": 2,\n  \"name\": \"Binh\",\n  \"role\": \"DEV\"\n}\n\n$ alias cong2=\"lsof -nP -iTCP: -sTCP:LISTEN\"\n\n$ cong2 41300\nlsof: unacceptable port specification in: -i TCP:\n# … (lsof in tiếp 8 dòng hướng dẫn dùng — đã cắt)\n\n$ cd /tmp && mw -q -v\nmw: khong tim thay mvnw tu /tmp tro len\n");
const O_MW = out("$ pwd\n/w/src/main/java/com/labflow\n$ mw -v | head -3\nApache Maven 3.10.1 (3afd8084b5629f80b97750906a719879ed4cd283)\nMaven home: /m2/wrapper/dists/apache-maven-3.10.1/987df3ef\nJava version: 21.0.13.1, vendor: Eclipse Adoptium, runtime: /opt/java/openjdk\n$ mw -q test -Dtest=GearServiceTest && echo XANH\nXANH\n$ pwd\n/w/src/main/java/com/labflow\n");
const O_ALIAS_ZSH = out("$ echo $ZSH_VERSION\n5.9\n$ type gs mw cong\ngs is an alias for git status -sb\nmw is a shell function from /home/sv/.config/do-nghe/dev.sh\ncong is a shell function from /home/sv/.config/do-nghe/dev.sh\n$ cong 41300\nCOMMAND PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME\nnode    324   sv   18u  IPv6 1936877616      0t0  TCP *:41300 (LISTEN)\n$ API_PORT=41300 api /users/9\n{\n  \"error\": \"user not found\"\n}\n$ mkcd /tmp/thu/a/b && pwd\n/tmp/thu/a/b\n");
const B_PROMPT_BASH = bash("# Dấu nhắc bash: thư mục ngắn + nhánh Git + mã thoát khi lệnh trước lỗi\n__nhanh() { local b; b=$(git branch --show-current 2>/dev/null) && [ -n \"$b\" ] && printf ' (%s)' \"$b\"; }\n__ma() { local e=$?; [ $e -ne 0 ] && printf '[%d] ' \"$e\"; }\nPS1='$(__ma)\\W$(__nhanh) \\$ '\n");
const B_PROMPT_ZSH = bash("# Dấu nhắc zsh: vcs_info có sẵn trong zsh, không cần cài gì\nautoload -Uz vcs_info\nprecmd() { vcs_info }\nzstyle ':vcs_info:git:*' formats ' (%b)'\nsetopt PROMPT_SUBST\nPROMPT='%(?..[%?] )%1~${vcs_info_msg_0_} %# '\n");
const O_PROMPT = out("labflow-mini (master) $ git switch -q -c feature/LF-7-loc-han\nlabflow-mini (feature/LF-7-loc-han) $ rg -q khong-co-chu-nay .\n[1] labflow-mini (feature/LF-7-loc-han) $ cd src\nsrc (feature/LF-7-loc-han) $ git switch -q master; cd /tmp\ntmp $\nlabflow-mini (master) % git switch -q -c feature/LF-7-loc-han\nlabflow-mini (feature/LF-7-loc-han) % rg -q khong-co-chu-nay .\n[1] labflow-mini (feature/LF-7-loc-han) % cd src\nsrc (feature/LF-7-loc-han) % git switch -q master; cd /tmp\n/tmp %\n");
const O_PS_ALIAS = out("PS /> $PSVersionTable.PSVersion.ToString(); (Get-Module PSReadLine).Version.ToString()\n7.4.2\n2.3.5\nPS /> $PROFILE\n/root/.config/powershell/Microsoft.PowerShell_profile.ps1\nPS /> Set-Alias gs \"git status -sb\"\nPS /> gs\ngs: The term 'git status -sb' is not recognized as a name of a cmdlet, function, script file, or executable pr\nogram.\nCheck the spelling of the name, or if a path was included, verify that the path is correct and try again.\nPS /> function mkcd { param([string]$Dir) New-Item -ItemType Directory -Force -Path $Dir | Out-Null; Set-Locat\nion $Dir }\nPS /> mkcd /tmp/do-nghe/thu\nPS /tmp/do-nghe/thu> Get-Location\n\nPath\n----\n/tmp/do-nghe/thu\n\nPS /tmp/do-nghe/thu> Get-Command gs, mkcd | Format-Table CommandType, Name, Definition -AutoSize\n\nCommandType Name Definition\n----------- ---- ----------\n      Alias gs   git status -sb\n   Function mkcd  param([string]$Dir) New-Item -ItemType Directory -Force -Path $Dir | Out-Null; Set-Locatio…\n");
const B_PS_PROFILE = bash("# $PROFILE của PowerShell 7 — tạo và mở:  New-Item -Force $PROFILE; code $PROFILE\n# Gợi ý lệnh từ lịch sử, hiện dạng danh sách (F2 để đổi kiểu)\nSet-PSReadLineOption -PredictionSource History -PredictionViewStyle ListView\n\n# Set-Alias KHÔNG nhận tham số ⇒ việc có tham số phải viết thành hàm\nfunction gs   { git status -sb @args }\nfunction mkcd { param([string]$Dir) New-Item -ItemType Directory -Force -Path $Dir | Out-Null; Set-Location $Dir }\n\n# cong 41300 — tiến trình nào đang nghe cổng (cmdlet này chỉ có trên Windows)\nfunction cong { param([int]$Port)\n  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |\n    ForEach-Object { Get-Process -Id $_.OwningProcess } }\n");
const O_PS_PROFILE = out("WARNING: The prediction 'ListView' is temporarily disabled because the current window size of the console is too small. To use the 'ListView', please make sure the 'WindowWidth' is not less than '50' and the 'WindowHeight' is not less than '5'.\n\nCommandType Name Source\n----------- ---- ------\n   Function gs   \n   Function mkcd \n   Function cong \n\n/tmp/a/b\n");
const O_PS_CTRL_R = out("PS /tmp/do-nghe/thu> $env:API_URL = \"http://localhost:41300\"\nbck-i-search: API_\n");
const VSC_TERM_JSON = json("{\n  // shell mặc định của terminal tích hợp — tên lấy từ danh sách \"Terminal: Select Default Profile\"\n  \"terminal.integrated.defaultProfile.windows\": \"Git Bash\",\n  \"terminal.integrated.defaultProfile.osx\": \"zsh\",\n  \"terminal.integrated.defaultProfile.linux\": \"bash\",\n  // giữ nhiều dòng hơn để cuộn lại log dài (mặc định 1000)\n  \"terminal.integrated.scrollback\": 10000,\n  // biến môi trường chỉ có trong terminal của VS Code\n  \"terminal.integrated.env.linux\": { \"API_PORT\": \"41300\" },\n  \"terminal.integrated.env.osx\": { \"API_PORT\": \"41300\" },\n  \"terminal.integrated.env.windows\": { \"API_PORT\": \"41300\" }\n}\n");
const NAP_DEV = bash("mkdir -p ~/.config/do-nghe\n# dán nội dung trên vào ~/.config/do-nghe/dev.sh, rồi cho shell nạp nó mỗi lần khởi động:\necho '[ -f ~/.config/do-nghe/dev.sh ] && . ~/.config/do-nghe/dev.sh' >> ~/.bashrc   # macOS (zsh): ~/.zshrc\nexec \"$SHELL\"      # thay shell hiện tại bằng shell mới đã nạp file\n");

const PHIM_SUA = (en) => `<table>
<thead><tr><th>${en ? 'Action' : 'Việc'}</th><th>bash / zsh</th><th>PowerShell (PSReadLine)</th></tr></thead>
<tbody>
<tr><td>${en ? 'Search history backwards' : 'Tìm ngược trong lịch sử'}</td><td><code>Ctrl+R</code></td><td><code>Ctrl+R</code></td></tr>
<tr><td>${en ? 'Jump to start / end of line' : 'Về đầu / cuối dòng'}</td><td><code>Ctrl+A</code> / <code>Ctrl+E</code></td><td><code>Home</code> / <code>End</code></td></tr>
<tr><td>${en ? 'Move one word back / forward' : 'Lùi / tiến một từ'}</td><td><code>Alt+B</code> / <code>Alt+F</code></td><td><code>Ctrl+←</code> / <code>Ctrl+→</code></td></tr>
<tr><td>${en ? 'Delete the word before the cursor' : 'Xoá từ đứng trước con trỏ'}</td><td><code>Ctrl+W</code></td><td><code>Ctrl+Backspace</code></td></tr>
<tr><td>${en ? 'Delete to start / to end of line' : 'Xoá tới đầu / tới cuối dòng'}</td><td><code>Ctrl+U</code> / <code>Ctrl+K</code></td><td><code>Ctrl+Home</code> / <code>Ctrl+End</code></td></tr>
<tr><td>${en ? 'Insert the last argument of the previous command' : 'Chèn đối số cuối của lệnh trước'}</td><td><code>Alt+.</code></td><td><code>Alt+.</code></td></tr>
<tr><td>${en ? 'Clear the screen (scrollback stays)' : 'Xoá màn hình (scrollback vẫn còn)'}</td><td><code>Ctrl+L</code></td><td><code>Ctrl+L</code></td></tr>
<tr><td>${en ? 'Edit the current line in your editor' : 'Mở dòng đang gõ trong editor'}</td><td><code>Ctrl+X Ctrl+E</code> (bash)</td><td>—</td></tr>
<tr><td>${en ? 'Cancel the line / the search' : 'Bỏ dòng đang gõ / thoát tìm'}</td><td><code>Ctrl+C</code> / <code>Ctrl+G</code></td><td><code>Esc</code></td></tr>
</tbody>
</table>`;

const PHIM_IDE_TERM = [
  ['VS Code: show / hide the terminal', 'VS Code: hiện / ẩn terminal', 'Ctrl+`', '⌃`'],
  ['VS Code: new terminal', 'VS Code: mở terminal mới', 'Ctrl+Shift+`', '⌃⇧`'],
  ['VS Code: split the terminal', 'VS Code: chia đôi terminal', 'Ctrl+Shift+5', '⌘\\'],
  ['VS Code: jump to previous / next command (shell integration)', 'VS Code: nhảy tới lệnh trước / sau (shell integration)', 'Ctrl+↑ / Ctrl+↓', '⌘↑ / ⌘↓'],
  ['VS Code: run a recent command (searchable list)', 'VS Code: chạy lại lệnh gần đây (danh sách tìm được)', 'Ctrl+Alt+R', '⌃⌥R'],
  ['IntelliJ: Terminal tool window', 'IntelliJ: cửa sổ Terminal', 'Alt+F12', '⌥F12'],
  ['IntelliJ: Run Anything (mvn, gradle, npm…)', 'IntelliJ: Run Anything (mvn, gradle, npm…)', 'Ctrl Ctrl', '⌃⌃'],
];

const L1 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Terminal' : 'Chương 3 · Terminal'}</span>
<h2>${en ? '3.1 — Shell essentials: history search, aliases, functions, prompt, the integrated terminal' : '3.1 — Nền tảng shell: tìm lịch sử, alias, hàm, prompt, terminal tích hợp trong IDE'}</h2>
<p class="lead">${en
    ? 'Watch a new intern for an hour and count how many times they type <code>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</code> by hand — 53 characters, often with a typo, often after scrolling up with the arrow key twenty times. A senior types <code>Ctrl+R spr Enter</code>: five keys. Nothing in this lesson is clever; it is the handful of habits that make the terminal type for you — finding old commands, short names for long ones, a prompt that warns you, and a terminal that lives inside your IDE.'
    : 'Ngồi xem một bạn thực tập trong một giờ và đếm số lần bạn ấy gõ tay <code>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</code> — 53 ký tự, hay gõ sai, hay phải bấm mũi tên lên hai chục lần để tìm. Một senior gõ <code>Ctrl+R spr Enter</code>: năm phím. Bài này không có gì cao siêu; nó là vài thói quen khiến terminal gõ thay bạn — tìm lại lệnh cũ, đặt tên ngắn cho lệnh dài, một dấu nhắc biết cảnh báo, và một terminal nằm ngay trong IDE.'}</p>

<h3>${en ? 'Three layers you should not confuse' : 'Ba lớp đừng nhầm lẫn'}</h3>
<p>${en
    ? 'When people say “the terminal” they mean three different programs stacked on top of each other. Knowing which layer you are talking to explains most “it works on my friend’s machine” moments in this chapter.'
    : 'Khi người ta nói “terminal”, thật ra là ba chương trình khác nhau xếp chồng lên nhau. Biết mình đang nói chuyện với lớp nào sẽ giải thích gần hết các tình huống “máy bạn kia chạy, máy mình không” trong chương này.'}</p>
<div class="lz-stack">
  <div class="lz-layer"><strong>${en ? 'Terminal window (emulator)' : 'Cửa sổ terminal (trình giả lập)'}</strong> — ${en ? 'Windows Terminal, macOS Terminal/iTerm2, GNOME Terminal, the terminal panel of VS Code and IntelliJ. Draws text, handles fonts, colours, tabs, panes, scrollback.' : 'Windows Terminal, Terminal/iTerm2 của macOS, GNOME Terminal, ô terminal của VS Code và IntelliJ. Vẽ chữ, lo phông, màu, tab, ô chia, scrollback.'}</div>
  <div class="lz-layer"><strong>Shell</strong> — ${en ? 'bash, zsh, PowerShell, Git Bash (bash for Windows). Reads what you type, keeps history, expands aliases and variables, starts programs. Has its own config file.' : 'bash, zsh, PowerShell, Git Bash (bash cho Windows). Đọc thứ bạn gõ, giữ lịch sử, khai triển alias và biến, khởi động chương trình. Có file cấu hình riêng.'}</div>
  <div class="lz-layer"><strong>${en ? 'Programs' : 'Chương trình'}</strong> — ${en ? 'git, mvn, node, docker, rg, jq… The same on every shell, but quoting rules come from the shell.' : 'git, mvn, node, docker, rg, jq… Giống nhau trên mọi shell, nhưng luật đặt nháy lại do shell quyết định.'}</div>
</div>
<table>
<thead><tr><th>${en ? 'Machine' : 'Máy'}</th><th>${en ? 'Default shell' : 'Shell mặc định'}</th><th>${en ? 'Config file' : 'File cấu hình'}</th></tr></thead>
<tbody>
<tr><td>macOS (${en ? 'since Catalina, 2019' : 'từ Catalina, 2019'})</td><td>zsh</td><td><code>~/.zshrc</code></td></tr>
<tr><td>Ubuntu, WSL2, ${en ? 'most Linux servers' : 'đa số máy chủ Linux'}</td><td>bash</td><td><code>~/.bashrc</code></td></tr>
<tr><td>Windows</td><td>${en ? 'Windows PowerShell 5.1 (built in); PowerShell 7 = <code>pwsh</code>, installed separately' : 'Windows PowerShell 5.1 (có sẵn); PowerShell 7 = <code>pwsh</code>, cài thêm'}</td><td><code>$PROFILE</code></td></tr>
<tr><td>${en ? 'Windows + Git for Windows' : 'Windows + Git for Windows'}</td><td>Git Bash (bash)</td><td><code>~/.bashrc</code> ${en ? '(in C:\\Users\\you)' : '(trong C:\\Users\\tên-bạn)'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'The same idea is spelled differently per shell: <code>export API_PORT=41300</code> in bash/zsh is <code>$env:API_PORT = "41300"</code> in PowerShell. Which startup file each shell reads, and why an SSH session behaves differently from a terminal tab, is covered in detail in'
    : 'Cùng một ý nhưng mỗi shell viết khác: <code>export API_PORT=41300</code> của bash/zsh là <code>$env:API_PORT = "41300"</code> trong PowerShell. Shell nào đọc file khởi động nào, và vì sao phiên SSH hành xử khác tab terminal, được dạy kỹ ở'} ${bai('linux-bash', 'lnx-8-2-file-khoi-dong', en ? 'Linux & Bash 8.2' : 'Linux & Bash 8.2')}${en ? '; PowerShell for bash users in' : '; PowerShell cho người biết bash ở'} ${bai('linux-bash', 'lnx-15-4-powershell-cho-nguoi-biet-bash', 'Linux & Bash 15.4')}.</p>

<h3>${en ? 'Never retype: Ctrl+R searches your history' : 'Đừng gõ lại: Ctrl+R tìm trong lịch sử'}</h3>
<p>${en
    ? 'Every command you run is appended to a history list (and, when the shell exits, to a file: <code>~/.bash_history</code>, <code>~/.zsh_history</code>, or PSReadLine’s file on PowerShell). <code>Ctrl+R</code> starts an incremental search backwards through that list: type any piece of the command — not necessarily the start — and the most recent match appears. Below is a real session in gear-mini with a typical day of history (16 commands); the screen is captured exactly as bash drew it:'
    : 'Mọi lệnh bạn chạy đều được nối vào danh sách lịch sử (và khi shell thoát thì ghi ra file: <code>~/.bash_history</code>, <code>~/.zsh_history</code>, hoặc file của PSReadLine trên PowerShell). <code>Ctrl+R</code> mở tìm kiếm ngược dần trong danh sách đó: gõ một mẩu bất kỳ của lệnh — không cần là phần đầu — và lệnh khớp gần nhất hiện ra. Dưới đây là phiên thật trong gear-mini với lịch sử của một ngày làm việc điển hình (16 lệnh); màn hình được chụp đúng như bash vẽ:'}</p>
${O_CTRL_R}
<ul>
<li>${en ? '<strong>Enter</strong> runs the match; <strong>→</strong> (or <code>Ctrl+E</code>) puts it on the prompt so you can edit first — the last screen shows exactly that: the command is waiting, not running.' : '<strong>Enter</strong> chạy ngay lệnh khớp; <strong>→</strong> (hoặc <code>Ctrl+E</code>) đưa nó ra dấu nhắc để sửa trước — màn hình cuối cho thấy đúng như vậy: lệnh đang chờ, chưa chạy.'}</li>
<li>${en ? '<strong>Ctrl+R again</strong> jumps to the next older match. Notice the second press showed the <em>same</em> text: the history contains that command twice (once in the morning, once after lunch). The third press says <code>failed</code> — nothing older. Duplicates cost key presses; <code>HISTCONTROL=ignoreboth:erasedups</code> in bash removes them (explained in' : '<strong>Ctrl+R lần nữa</strong> nhảy tới lệnh khớp cũ hơn. Để ý lần bấm thứ hai hiện <em>đúng chữ cũ</em>: lịch sử có lệnh đó hai lần (sáng một lần, sau trưa một lần). Lần thứ ba báo <code>failed</code> — không còn gì cũ hơn. Bản trùng làm tốn phím; <code>HISTCONTROL=ignoreboth:erasedups</code> trong bash xoá chúng (giải thích ở'} ${bai('linux-bash', 'lnx-8-4-tuy-bien-shell', 'Linux & Bash 8.4')}${en ? '), and lesson 3.2 replaces this one-line search with a full list.' : '), còn bài 3.2 thay ô tìm một dòng này bằng cả một danh sách.'}</li>
<li>${en ? '<strong>Ctrl+G</strong> (bash) or <strong>Esc</strong> (PowerShell) cancels and gives you back an empty prompt.' : '<strong>Ctrl+G</strong> (bash) hoặc <strong>Esc</strong> (PowerShell) huỷ tìm, trả lại dấu nhắc trống.'}</li>
</ul>

<h3>${en ? 'History expansion: !!, !$ and ^old^new' : 'Khai triển lịch sử: !!, !$ và ^cũ^mới'}</h3>
<p>${en
    ? 'bash and zsh also let you reuse pieces of earlier commands with <code>!</code>. Three are worth memorising; the shell prints the expanded command before running it, so you can see what happened:'
    : 'bash và zsh còn cho dùng lại từng mẩu của lệnh trước bằng dấu <code>!</code>. Ba dạng đáng thuộc; shell in lệnh đã khai triển ra trước khi chạy, nên bạn thấy được chuyện gì vừa xảy ra:'}</p>
${O_BANG}
<table>
<thead><tr><th>${en ? 'You type' : 'Bạn gõ'}</th><th>${en ? 'Becomes' : 'Thành'}</th><th>${en ? 'Typical use' : 'Dùng khi'}</th></tr></thead>
<tbody>
<tr><td><code>!!</code></td><td>${en ? 'the whole previous command' : 'nguyên lệnh trước'}</td><td><code>sudo !!</code> ${en ? 'after “Permission denied”' : 'sau khi bị “Permission denied”'}</td></tr>
<tr><td><code>!$</code></td><td>${en ? 'last argument of the previous command' : 'đối số cuối của lệnh trước'}</td><td><code>ls dir</code> ${en ? 'then' : 'rồi'} <code>cd !$</code>; <code>mkdir x</code> ${en ? 'then' : 'rồi'} <code>cd !$</code></td></tr>
<tr><td><code>^cũ^mới</code></td><td>${en ? 'previous command with the first “cũ” replaced' : 'lệnh trước, thay chữ “cũ” đầu tiên bằng “mới”'}</td><td>${en ? 'fixing a typo in a long command' : 'sửa lỗi gõ trong một lệnh dài'}</td></tr>
<tr><td><code>!mvn</code></td><td>${en ? 'the latest command starting with “mvn”' : 'lệnh gần nhất bắt đầu bằng “mvn”'}</td><td>${en ? 'risky — see below' : 'nguy hiểm — xem dưới'}</td></tr>
<tr><td><code>!mvn:p</code></td><td>${en ? 'only <em>prints</em> it, does not run' : 'chỉ <em>in</em> ra, không chạy'}</td><td>${en ? 'checking before running' : 'xem trước khi chạy'}</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>${en ? '!prefix runs whatever matched, immediately' : '!tiền-tố chạy ngay thứ gì khớp'}</strong></p><p>${en
    ? '<code>!git</code> may be <code>git push --force</code> from an hour ago. On a server, <code>!rm</code> is a classic way to delete the wrong folder. Prefer <code>Ctrl+R</code> (you see before you run), or make bash show expansions first: <code>shopt -s histverify</code> in <code>~/.bashrc</code> (zsh: <code>setopt HIST_VERIFY</code>). In PowerShell <code>!</code> means “not” — none of this exists there.'
    : '<code>!git</code> có thể là <code>git push --force</code> từ một tiếng trước. Trên máy chủ, <code>!rm</code> là cách kinh điển để xoá nhầm thư mục. Ưu tiên <code>Ctrl+R</code> (nhìn thấy rồi mới chạy), hoặc bắt bash hiện kết quả khai triển trước: <code>shopt -s histverify</code> trong <code>~/.bashrc</code> (zsh: <code>setopt HIST_VERIFY</code>). Trong PowerShell <code>!</code> nghĩa là “phủ định” — không có mấy thứ này.'}</p></div>

<h3>${en ? 'Editing a long command without the arrow keys' : 'Sửa một lệnh dài không cần phím mũi tên'}</h3>
<p>${en
    ? 'The line you are typing is edited by a small editor built into the shell (Readline in bash, ZLE in zsh, PSReadLine in PowerShell). Its defaults are Emacs-style keys. The ones below cover 95% of daily use; on macOS enable <em>Use Option as Meta key</em> in Terminal (or <em>Esc+</em> in iTerm2) so that Alt-keys work. The full list is in'
    : 'Dòng bạn đang gõ được sửa bởi một editor nhỏ nằm trong shell (Readline của bash, ZLE của zsh, PSReadLine của PowerShell). Phím mặc định theo kiểu Emacs. Bảng dưới phủ 95% nhu cầu hằng ngày; trên macOS bật <em>Use Option as Meta key</em> trong Terminal (hoặc <em>Esc+</em> trong iTerm2) để các phím Alt chạy được. Danh sách đầy đủ ở'} ${bai('linux-bash', 'lnx-8-4-tuy-bien-shell', 'Linux & Bash 8.4')}.</p>
${PHIM_SUA(en)}
<p>${en
    ? '<code>Ctrl+X Ctrl+E</code> deserves a special mention: a 6-line <code>curl</code> with JSON body is miserable to edit on one line; this opens it in <code>$EDITOR</code> (set <code>export EDITOR="code --wait"</code> to use VS Code), and when you save and close, the command runs.'
    : '<code>Ctrl+X Ctrl+E</code> đáng nhắc riêng: một lệnh <code>curl</code> 6 dòng kèm thân JSON mà sửa trên một dòng thì rất khổ; phím này mở nó trong <code>$EDITOR</code> (đặt <code>export EDITOR="code --wait"</code> để dùng VS Code), lưu và đóng là lệnh chạy.'}</p>

<h3>${en ? 'Aliases and functions: name your daily commands' : 'Alias và hàm: đặt tên cho lệnh hằng ngày'}</h3>
<p>${en
    ? 'An <strong>alias</strong> is pure text substitution: when the <em>first word</em> of a command matches, the shell pastes the replacement there and continues. A <strong>function</strong> is a small program: it receives arguments (<code>$1</code>, <code>$@</code>), can use <code>if</code>/loops, and can change the current directory. Rule of thumb: if you need an argument anywhere except at the end, or any logic — write a function.'
    : '<strong>Alias</strong> chỉ là thay chữ: khi <em>từ đầu tiên</em> của lệnh khớp, shell dán đoạn thay thế vào đó rồi chạy tiếp. <strong>Hàm</strong> là một chương trình nhỏ: nhận đối số (<code>$1</code>, <code>$@</code>), dùng được <code>if</code>/vòng lặp, và đổi được thư mục hiện tại. Quy tắc nhanh: cần đối số ở bất kỳ đâu ngoài cuối lệnh, hoặc cần chút logic — viết hàm.'}</p>
<p>${en
    ? 'Put them in one file of your own, not scattered across <code>~/.bashrc</code> and <code>~/.zshrc</code>: the same file then works in bash (Linux, WSL, Git Bash) and zsh (macOS), and in Chapter 6 it goes into your dotfiles repository unchanged. This is the file used in the rest of the course:'
    : 'Gom chúng vào một file của riêng bạn, đừng rải ra <code>~/.bashrc</code> và <code>~/.zshrc</code>: khi đó cùng một file chạy được cả bash (Linux, WSL, Git Bash) lẫn zsh (macOS), và sang Chương 6 nó vào thẳng repo dotfiles không cần sửa. Đây là file dùng trong suốt phần còn lại của khoá:'}</p>
${B_DEV_SH}
${NAP_DEV}
<p>${en ? 'Real run in bash, standing deep inside gear-mini, with labflow-mini running on port 41300:' : 'Chạy thật trong bash, đứng sâu trong gear-mini, labflow-mini đang chạy ở cổng 41300:'}</p>
${O_ALIAS}
<p>${en
    ? 'Read the failure: the alias <code>cong2</code> tried to put the port <em>in the middle</em> (<code>-iTCP:41300</code>), but an alias can only paste text at the front, so lsof received <code>-iTCP:</code> and then a stray <code>41300</code>. That is exactly the case for a function. <code>type</code> tells you what a name really is — alias, function, or a program on PATH — the first thing to check when a command “behaves strangely” on a colleague’s machine.'
    : 'Đọc chỗ lỗi: alias <code>cong2</code> muốn đặt số cổng <em>vào giữa</em> (<code>-iTCP:41300</code>), nhưng alias chỉ dán được chữ ở đầu, nên lsof nhận <code>-iTCP:</code> rồi một <code>41300</code> lạc chỗ. Đó đúng là trường hợp cần hàm. <code>type</code> cho biết một cái tên thật ra là gì — alias, hàm, hay chương trình trên PATH — việc đầu tiên cần kiểm khi một lệnh “hành xử lạ” trên máy đồng nghiệp.'}</p>
<p>${en ? 'The <code>mw</code> function needs Java, so it was run in a Temurin 21 container on gear-mini: from four folders deep it finds <code>mvnw</code> at the project root, runs the tests, and leaves you where you were (the <code>( … )</code> subshell):' : 'Hàm <code>mw</code> cần Java nên được chạy trong container Temurin 21 trên gear-mini: đứng sâu bốn tầng thư mục, nó tìm thấy <code>mvnw</code> ở gốc dự án, chạy test, và để bạn nguyên chỗ cũ (nhờ subshell <code>( … )</code>):'}</p>
${O_MW}
<p>${en ? 'And the same file loaded by zsh 5.9 (the macOS shell) — no change needed:' : 'Và cùng file đó nạp bởi zsh 5.9 (shell của macOS) — không phải sửa gì:'}</p>
${O_ALIAS_ZSH}
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Do not alias over real commands' : 'Đừng đặt alias đè lên lệnh thật'}</strong></p><p>${en
    ? '<code>alias rm="rm -i"</code> feels safe on your laptop — until you are on a server without it and your fingers expect a confirmation that never comes. Give your shortcuts new names (<code>gs</code>, <code>mw</code>), and when you need the original command untouched, write <code>command rm</code> or <code>\\rm</code>.'
    : '<code>alias rm="rm -i"</code> nghe an toàn trên laptop — cho tới khi bạn lên máy chủ không có nó và ngón tay chờ một câu hỏi xác nhận không bao giờ tới. Đặt tên mới cho phím tắt của mình (<code>gs</code>, <code>mw</code>), và khi cần đúng lệnh gốc, gõ <code>command rm</code> hoặc <code>\\rm</code>.'}</p></div>

<h3>${en ? 'A prompt that tells you the branch and the last failure' : 'Dấu nhắc cho biết nhánh và lần lỗi vừa rồi'}</h3>
<p>${en
    ? 'Two things in the prompt prevent real mistakes: the current <strong>Git branch</strong> (no more committing to <code>main</code> by accident) and the <strong>exit code</strong> of the last command when it failed (a silent failure — exit 1 with no message, like <code>rg -q</code> below — becomes visible). You do not need a theme framework for that:'
    : 'Hai thứ trên dấu nhắc ngăn được lỗi thật: <strong>nhánh Git</strong> hiện tại (hết cảnh lỡ commit vào <code>main</code>) và <strong>mã thoát</strong> của lệnh trước khi nó lỗi (một lỗi im lặng — thoát 1 mà không in gì, như <code>rg -q</code> dưới đây — trở nên nhìn thấy được). Không cần cài bộ giao diện nào cho việc đó:'}</p>
${B_PROMPT_BASH}
${B_PROMPT_ZSH}
${O_PROMPT}
<p>${en
    ? 'Frameworks like Oh My Zsh or Starship give you the same plus icons; fine, but measure: a prompt that takes 300 ms to draw is a delay you pay hundreds of times a day. Whatever you choose, branch + exit code is the minimum.'
    : 'Các bộ như Oh My Zsh hay Starship cho bạn đúng những thứ này kèm biểu tượng; dùng cũng được, nhưng hãy đo: dấu nhắc mất 300 ms để vẽ là độ trễ bạn trả hàng trăm lần mỗi ngày. Chọn gì thì chọn, nhánh + mã thoát là mức tối thiểu.'}</p>

<h3>${en ? 'PowerShell: $PROFILE, and why Set-Alias is not enough' : 'PowerShell: $PROFILE, và vì sao Set-Alias không đủ'}</h3>
<p>${en
    ? 'On a Windows laptop from your company, the shell you get may be PowerShell. Its startup file is whatever <code>$PROFILE</code> points to, and its aliases are even more limited than bash’s: they can only point to a <em>command name</em>, never a command with arguments. Real run (PowerShell 7.4.2, PSReadLine 2.3.5):'
    : 'Trên laptop Windows công ty cấp, shell bạn có thể là PowerShell. File khởi động của nó là đường dẫn trong <code>$PROFILE</code>, và alias của nó còn hạn chế hơn bash: chỉ được trỏ tới <em>tên một lệnh</em>, không bao giờ kèm đối số. Chạy thật (PowerShell 7.4.2, PSReadLine 2.3.5):'}</p>
${O_PS_ALIAS}
<p>${en ? 'So in PowerShell everything with arguments is a function. A starting profile — the same ideas as <code>dev.sh</code>:' : 'Nên trong PowerShell, mọi thứ có đối số đều là hàm. Một profile khởi đầu — cùng ý tưởng với <code>dev.sh</code>:'}</p>
${B_PS_PROFILE}
${O_PS_PROFILE}
<p>${en
    ? '(The warning appears only because this check ran without a real console window; in Windows Terminal the list view works.) <code>Ctrl+R</code> exists in PSReadLine too — it shows <code>bck-i-search:</code> at the bottom:'
    : '(Cảnh báo chỉ hiện vì lần kiểm này chạy không có cửa sổ console thật; trong Windows Terminal kiểu danh sách chạy bình thường.) <code>Ctrl+R</code> cũng có trong PSReadLine — nó hiện <code>bck-i-search:</code> ở đáy:'}</p>
${O_PS_CTRL_R}
<p>${en
    ? 'If the profile is not loaded at all on Windows, the usual cause is the execution policy (lesson 6.4): <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>. And check where <code>$PROFILE</code> lives: with OneDrive folder backup on, it sits in <code>OneDrive\\Documents\\PowerShell</code> and is synced to the cloud — one more reason never to put a token in it.'
    : 'Nếu trên Windows profile không được nạp, nguyên nhân thường gặp là execution policy (bài 6.4): <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>. Và kiểm xem <code>$PROFILE</code> nằm đâu: khi bật sao lưu thư mục OneDrive, nó nằm trong <code>OneDrive\\Documents\\PowerShell</code> và được đồng bộ lên mây — thêm một lý do để không bao giờ đặt token trong đó.'}</p>

<h3>${en ? 'The terminal inside your IDE' : 'Terminal nằm ngay trong IDE'}</h3>
<p>${en
    ? 'The IDE terminal is a normal terminal emulator running your normal shell — same history, same <code>dev.sh</code> — with three advantages: it opens in the project root, it inherits the project’s environment settings, and its output is clickable. In VS Code, a line such as <code>src/routes/users.routes.js:9:…</code> printed by <code>rg</code> (next lesson) opens that file at line 9 with <code>Ctrl</code>/<code>⌘</code>+click.'
    : 'Terminal trong IDE là một trình giả lập terminal bình thường chạy đúng shell bình thường của bạn — cùng lịch sử, cùng <code>dev.sh</code> — với ba lợi thế: mở sẵn ở gốc dự án, thừa hưởng cấu hình môi trường của dự án, và output bấm được. Trong VS Code, một dòng như <code>src/routes/users.routes.js:9:…</code> do <code>rg</code> in ra (bài sau) mở đúng file ở dòng 9 khi <code>Ctrl</code>/<code>⌘</code>+click.'}</p>
${phim(PHIM_IDE_TERM, !en)}
<p>${en
    ? '<strong>Shell integration</strong> (VS Code turns it on automatically for bash, zsh, PowerShell and fish) marks every command with a small circle in the gutter — blue when it succeeded, red when it failed — and enables the jump/recent-command keys above. Settings worth committing per developer (user settings, not the shared workspace, because shells differ between teammates):'
    : '<strong>Shell integration</strong> (VS Code tự bật cho bash, zsh, PowerShell và fish) đánh dấu mỗi lệnh bằng một chấm tròn bên lề — xanh khi chạy được, đỏ khi lỗi — và mở khoá các phím nhảy/lệnh gần đây ở bảng trên. Các cài đặt đáng đặt cho từng người (user settings, không phải workspace chung, vì mỗi người một shell):'}</p>
${VSC_TERM_JSON}
<p>${en
    ? 'In IntelliJ, <em>Settings → Tools → Terminal</em> holds the same choices: <em>Shell path</em> (<code>pwsh.exe</code>, <code>wsl.exe</code>, or <code>"C:\\Program Files\\Git\\bin\\bash.exe" --login -i</code> for Git Bash), the start directory and extra environment variables. Two habits pay off immediately: right-click a folder in the Project view → <em>Open In → Terminal</em> to land in that folder, and press <code>Ctrl</code> twice for <em>Run Anything</em> — type <code>mvn test</code> or <code>npm run dev</code> and the IDE runs it in its own Run window, with clickable stack traces and a re-run button.'
    : 'Trong IntelliJ, <em>Settings → Tools → Terminal</em> có đúng các lựa chọn đó: <em>Shell path</em> (<code>pwsh.exe</code>, <code>wsl.exe</code>, hoặc <code>"C:\\Program Files\\Git\\bin\\bash.exe" --login -i</code> cho Git Bash), thư mục bắt đầu và biến môi trường thêm. Hai thói quen có lợi ngay: chuột phải một thư mục trong cửa sổ Project → <em>Open In → Terminal</em> để mở terminal đúng thư mục đó, và bấm <code>Ctrl</code> hai lần để mở <em>Run Anything</em> — gõ <code>mvn test</code> hay <code>npm run dev</code> là IDE chạy nó trong cửa sổ Run riêng, có stack trace bấm được và nút chạy lại.'}</p>

<h3>${en ? 'In everyday terms' : 'Liên hệ đời thường'}</h3>
<p>${en
    ? 'Shell history is your call log: you do not dial a number you called yesterday digit by digit, you search the log. An alias is a speed-dial entry; a function is a saved routine (“call mum, then send the address”). The prompt is the dashboard of a motorbike: you do not stop to check the fuel, it is always in view.'
    : 'Lịch sử shell là nhật ký cuộc gọi: không ai bấm lại từng số của người hôm qua vừa gọi, người ta tìm trong nhật ký. Alias là số gọi nhanh; hàm là một “lối tắt” lưu sẵn kiểu “gọi mẹ, rồi gửi địa chỉ”. Dấu nhắc là đồng hồ trên xe máy: không ai dừng xe để kiểm xăng, nó luôn nằm trước mắt.'}</p>

<h3>${en ? '💼 At work: the company laptop decides your shell' : '💼 Đi làm: laptop công ty quyết định shell của bạn'}</h3>
<p>${en
    ? 'At an outsourcing company you usually receive a Windows laptop without admin rights. You will have PowerShell 5.1 for sure, Git Bash if Git is installed, and WSL only if IT allows it (some security policies block it). Do not fight this on day one: ask your mentor which shell the team’s scripts assume (a <code>build.sh</code> needs bash; a <code>setup.ps1</code> needs PowerShell), put your aliases in the matching file, and point the IDE terminal at the same shell so the IDE and the README agree. Write down your shell choice in your onboarding notes — Chapter 6 automates it.'
    : 'Ở công ty outsourcing bạn thường được cấp laptop Windows không có quyền admin. Chắc chắn có PowerShell 5.1, có Git Bash nếu đã cài Git, và chỉ có WSL nếu IT cho phép (một số chính sách bảo mật chặn). Đừng chống lại chuyện đó trong ngày đầu: hỏi mentor script của nhóm giả định shell nào (<code>build.sh</code> cần bash; <code>setup.ps1</code> cần PowerShell), đặt alias vào file tương ứng, và trỏ terminal của IDE vào đúng shell đó để IDE và README nói cùng một thứ. Ghi lựa chọn shell vào ghi chú onboarding — Chương 6 sẽ tự động hoá nó.'}</p>

<h3>${en ? 'The hacker’s view: your startup file runs every time you open a terminal' : 'Góc hacker: file khởi động chạy mỗi lần bạn mở terminal'}</h3>
<p>${en
    ? '<code>~/.bashrc</code>, <code>~/.zshrc</code> and <code>$PROFILE</code> are programs that run with your permissions every time a shell starts — including every terminal tab in your IDE. That makes them a favourite place to hide persistence after a break-in: MITRE ATT&amp;CK lists it as technique <strong>T1546.004 — Unix Shell Configuration Modification</strong>, and a malicious <code>npm</code> post-install script or a fake “coding test” repository only needs one appended line. A nastier variant defines an alias or function over <code>sudo</code> or <code>ssh</code> to capture what you type next.'
    : '<code>~/.bashrc</code>, <code>~/.zshrc</code> và <code>$PROFILE</code> là chương trình chạy bằng quyền của bạn mỗi khi một shell khởi động — kể cả mỗi tab terminal trong IDE. Vì thế chúng là chỗ ưa thích để cài “cửa hậu” sau khi đột nhập: MITRE ATT&amp;CK ghi nhận đây là kỹ thuật <strong>T1546.004 — Unix Shell Configuration Modification</strong>, và một script post-install của gói <code>npm</code> độc hay một repo “bài test tuyển dụng” giả chỉ cần nối thêm đúng một dòng. Biến thể nguy hiểm hơn định nghĩa alias hoặc hàm đè lên <code>sudo</code> hay <code>ssh</code> để bắt thứ bạn gõ tiếp theo.'}</p>
<ul>
<li>${en ? 'Keep your startup files short and in Git (Chapter 6) — then <code>git diff</code> shows any line you did not write.' : 'Giữ file khởi động ngắn và đưa vào Git (Chương 6) — khi đó <code>git diff</code> cho thấy ngay dòng nào không phải bạn viết.'}</li>
<li>${en ? 'When something sensitive behaves oddly, ask the shell: <code>type -a sudo</code>, <code>type -a ssh</code>, <code>alias</code> — you expect “is /usr/bin/sudo”, not “is a function”.' : 'Khi một lệnh nhạy cảm hành xử lạ, hỏi shell: <code>type -a sudo</code>, <code>type -a ssh</code>, <code>alias</code> — kết quả mong đợi là “is /usr/bin/sudo”, không phải “is a function”.'}</li>
<li>${en ? 'Never paste “install” one-liners into your startup file without reading them; lesson 3.2 shows the real Codecov case of a modified install script.' : 'Đừng dán dòng lệnh “cài đặt” nào vào file khởi động khi chưa đọc nó; bài 3.2 kể vụ Codecov có thật về một script cài đặt bị sửa.'}</li>
</ul>

<h3>${en ? '🧪 Practice (25 minutes)' : '🧪 Thực hành (25 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Create <code>~/.config/do-nghe/dev.sh</code> with the content above and the loading line in your <code>~/.bashrc</code> or <code>~/.zshrc</code> (Windows: Git Bash; or the PowerShell profile). Open a new terminal and run <code>type gs mw cong</code>.' : 'Tạo <code>~/.config/do-nghe/dev.sh</code> với nội dung trên và dòng nạp trong <code>~/.bashrc</code> hoặc <code>~/.zshrc</code> (Windows: Git Bash; hoặc profile PowerShell). Mở terminal mới và chạy <code>type gs mw cong</code>.'}</li>
<li>${en ? 'Start labflow-mini (<code>PORT=41300 npm run dev</code>), then in another terminal: <code>cong 41300</code> and <code>API_PORT=41300 api /tasks</code>.' : 'Chạy labflow-mini (<code>PORT=41300 npm run dev</code>), rồi ở terminal khác: <code>cong 41300</code> và <code>API_PORT=41300 api /tasks</code>.'}</li>
<li>${en ? 'From <code>gear-mini/src/main/java</code> run <code>mw -q test</code>. Then from <code>/tmp</code> and read the error.' : 'Từ <code>gear-mini/src/main/java</code> chạy <code>mw -q test</code>. Rồi chạy từ <code>/tmp</code> và đọc thông báo lỗi.'}</li>
<li>${en ? 'Add the prompt for your shell, create a branch, run a command that fails (<code>rg -q khong-co .</code>) and watch the prompt.' : 'Thêm dấu nhắc cho shell của bạn, tạo một nhánh, chạy một lệnh lỗi (<code>rg -q khong-co .</code>) và nhìn dấu nhắc.'}</li>
<li>${en ? 'Speed check: run the long <code>spring-boot:run</code> command once, then three times with <code>Ctrl+R</code>. Count keys each time.' : 'Đo tốc độ: chạy lệnh <code>spring-boot:run</code> dài một lần, rồi chạy lại ba lần bằng <code>Ctrl+R</code>. Đếm số phím mỗi lần.'}</li>
<li>${en ? 'In your IDE: open the terminal by key, split it, set the default profile to the shell your team uses.' : 'Trong IDE: mở terminal bằng phím, chia đôi, đặt profile mặc định là shell nhóm bạn dùng.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? '<code>type</code> shows your alias and functions; <code>cong</code> names the node process; <code>mw</code> works from a subfolder and fails clearly outside a project; the prompt shows branch and <code>[1]</code>; the repeated command costs ≤ 6 keys.' : '<code>type</code> hiện alias và hàm của bạn; <code>cong</code> chỉ ra tiến trình node; <code>mw</code> chạy được từ thư mục con và báo lỗi rõ khi ở ngoài dự án; dấu nhắc hiện nhánh và <code>[1]</code>; lệnh lặp lại chỉ tốn ≤ 6 phím.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Terminal emulator' : 'Trình giả lập terminal'}</span><span class="v">${en ? 'The window that draws text; the shell runs inside it.' : 'Cửa sổ vẽ chữ; shell chạy bên trong nó.'}</span></div>
  <div class="kv"><span class="k">Shell</span><span class="v">${en ? 'Program that reads commands, keeps history, expands aliases: bash, zsh, PowerShell.' : 'Chương trình đọc lệnh, giữ lịch sử, khai triển alias: bash, zsh, PowerShell.'}</span></div>
  <div class="kv"><span class="k">Ctrl+R (reverse-i-search)</span><span class="v">${en ? 'Incremental search backwards in history.' : 'Tìm ngược dần trong lịch sử.'}</span></div>
  <div class="kv"><span class="k">${en ? 'History expansion' : 'Khai triển lịch sử'}</span><span class="v">${en ? '!!, !$, ^a^b — reuse parts of earlier commands (bash/zsh).' : '!!, !$, ^a^b — dùng lại mẩu của lệnh trước (bash/zsh).'}</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">${en ? 'Text pasted in place of the first word of a command.' : 'Chữ được dán thay cho từ đầu tiên của lệnh.'}</span></div>
  <div class="kv"><span class="k">${en ? 'Shell function' : 'Hàm shell'}</span><span class="v">${en ? 'Named mini-program with arguments and logic.' : 'Chương trình nhỏ có tên, nhận đối số, có logic.'}</span></div>
  <div class="kv"><span class="k">$PROFILE</span><span class="v">${en ? 'PowerShell’s startup script path.' : 'Đường dẫn script khởi động của PowerShell.'}</span></div>
  <div class="kv"><span class="k">Shell integration</span><span class="v">${en ? 'IDE feature that knows where each command starts/ends and whether it failed.' : 'Tính năng IDE biết mỗi lệnh bắt đầu/kết thúc ở đâu và có lỗi không.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'Terminal window ≠ shell ≠ program; config lives in the shell’s file (~/.bashrc, ~/.zshrc, $PROFILE).' : 'Cửa sổ terminal ≠ shell ≠ chương trình; cấu hình nằm ở file của shell (~/.bashrc, ~/.zshrc, $PROFILE).'}</li>
<li>${en ? 'Ctrl+R before retyping; → to edit before running; !! and !$ for quick reuse, never blind !prefix.' : 'Ctrl+R trước khi gõ lại; → để sửa trước khi chạy; !! và !$ để dùng lại nhanh, đừng dùng !tiền-tố mù quáng.'}</li>
<li>${en ? 'Alias = prefix text; anything with arguments in the middle or logic = function. One dev.sh for bash and zsh.' : 'Alias = chữ đặt đầu; có đối số ở giữa hoặc logic = hàm. Một dev.sh cho cả bash và zsh.'}</li>
<li>${en ? 'Prompt shows Git branch + failed exit code; PowerShell needs functions, not Set-Alias, for arguments.' : 'Dấu nhắc hiện nhánh Git + mã thoát khi lỗi; PowerShell cần hàm, không phải Set-Alias, khi có đối số.'}</li>
<li>${en ? 'Startup files run on every terminal: keep them short, versioned, and check type -a for sensitive commands.' : 'File khởi động chạy ở mọi terminal: giữ ngắn, có phiên bản, và kiểm type -a cho lệnh nhạy cảm.'}</li>
</ul>
${tl('https://www.gnu.org/software/bash/manual/html_node/History-Interaction.html', '📘', 'GNU Bash Manual — History Interaction', en ? 'Ctrl+R, !!, !$, ^old^new, histverify' : 'Ctrl+R, !!, !$, ^cũ^mới, histverify')}
${tl('https://code.visualstudio.com/docs/terminal/shell-integration', '🖥', 'VS Code Docs — Terminal shell integration', en ? 'Command decorations, recent commands, navigation keys' : 'Dấu lệnh, lệnh gần đây, phím điều hướng')}
${tl('https://www.jetbrains.com/help/idea/terminal-emulator.html', '☕', 'IntelliJ IDEA Docs — Terminal', en ? 'Shell path, start directory, Run Anything' : 'Shell path, thư mục bắt đầu, Run Anything')}
${tl('https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_profiles', '🪟', 'Microsoft Learn — about_Profiles', en ? 'Where $PROFILE lives and when it loads' : '$PROFILE nằm đâu và nạp khi nào')}
${tl('https://attack.mitre.org/techniques/T1546/004/', '🛡', 'MITRE ATT&CK — T1546.004 Unix Shell Configuration Modification', en ? 'Startup files as persistence' : 'File khởi động làm chỗ cài cửa hậu')}
</div>
`;

/* ═════════════ 3.2 — Công cụ dòng lệnh hiện đại ═════════════ */
const B_TAO_CH3 = bash("#!/usr/bin/env bash\n# tao-ch3.sh — chuẩn bị labflow-mini cho Chương 3 (chạy trong thư mục labflow-mini, cần Node 20+ và mạng để npm install)\nset -euo pipefail\n[ -f package.json ] && grep -q '\"labflow-mini\"' package.json || { echo \"Hay chay trong thu muc labflow-mini\"; exit 1; }\n\n# 1) Front-end React + Vite thật (để có node_modules và dist cỡ dự án thật)\ncat > web/package.json <<'EOF'\n{\n  \"name\": \"labflow-web\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"scripts\": { \"dev\": \"vite\", \"build\": \"vite build\" },\n  \"dependencies\": { \"react\": \"^19.0.0\", \"react-dom\": \"^19.0.0\" },\n  \"devDependencies\": {\n    \"vite\": \"^7.0.0\", \"@vitejs/plugin-react\": \"^5.0.0\", \"typescript\": \"^5.9.0\",\n    \"eslint\": \"^9.0.0\", \"@types/react\": \"^19.0.0\", \"vitest\": \"^3.0.0\", \"jsdom\": \"^27.0.0\"\n  }\n}\nEOF\ncat > web/index.html <<'EOF'\n<!doctype html>\n<html lang=\"vi\"><head><meta charset=\"UTF-8\" /><title>LabFlow mini</title></head>\n<body><div id=\"root\"></div><script type=\"module\" src=\"/src/main.jsx\"></script></body></html>\nEOF\ncat > web/src/main.jsx <<'EOF'\nimport { createRoot } from 'react-dom/client';\nimport { TaskList } from './TaskList.jsx';\n\ncreateRoot(document.getElementById('root')).render(<TaskList />);\nEOF\ncat > web/vite.config.js <<'EOF'\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\nEOF\n(cd web && npm install --no-audit --no-fund --silent && npx vite build --logLevel warn)\ngrep -qx 'dist/' .gitignore || echo 'dist/' >> .gitignore\n\n# 2) Vài ghi chú việc còn dở trong mã (để tìm bằng rg)\ngrep -q 'TODO(binh)' src/services/task.service.js || sed -i.bak \\\n  -e 's|^export function createTask(input) {|// TODO(binh): kiem tra assigneeId co ton tai truoc khi tao\\nexport function createTask(input) {|' \\\n  -e 's|^export function markDone(id) {|// FIXME: markDone chua ghi lai ai la nguoi bam Done\\nexport function markDone(id) {|' \\\n  src/services/task.service.js && rm -f src/services/task.service.js.bak\ngrep -q '// TODO' web/src/api.js || sed -i.bak '1i // TODO: doc BASE tu import.meta.env thay vi viet cung' web/src/api.js && rm -f web/src/api.js.bak\n\n# 3) Log bốn ngày (tất định — chạy lại ra đúng y như cũ)\nmkdir -p logs\nnode --input-type=module -e '\nimport { writeFileSync } from \"node:fs\";\nlet s = 20261120;\nconst r = (n) => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return s % n; };\nconst api = [[\"GET\",\"/tasks\",200],[\"GET\",\"/users/1\",200],[\"POST\",\"/tasks\",201],[\"PATCH\",\"/tasks/2/done\",200],[\"GET\",\"/users/9\",404],[\"POST\",\"/tasks\",400]];\nfor (const day of [20, 21, 22, 23]) {\n  const lines = [], json = [];\n  for (let i = 0; i < 120; i++) {\n    const h = String(8 + r(10)).padStart(2, \"0\"), m = String(r(60)).padStart(2, \"0\"), sec = String(r(60)).padStart(2, \"0\");\n    const t = \"2026-11-\" + day + \"T\" + h + \":\" + m + \":\" + sec + \"+07:00\";\n    let [method, path, st] = api[r(api.length)];\n    let lv = st >= 400 ? \"WARN \" : \"INFO \", ms = 3 + r(40);\n    if (r(25) === 0) { st = 500; lv = \"ERROR\"; ms = 900 + r(2000); }\n    const user = 1 + r(3);\n    lines.push([t, lv, method, path, st, ms + \"ms\", \"user=\" + user].join(\" \"));\n    json.push(JSON.stringify({ time: t, level: lv.trim(), method, path, status: st, ms, user }));\n  }\n  lines.sort(); json.sort();\n  writeFileSync(\"logs/app-2026-11-\" + day + \".log\", lines.join(\"\\n\") + \"\\n\");\n  writeFileSync(\"logs/access-2026-11-\" + day + \".jsonl\", json.join(\"\\n\") + \"\\n\");\n}'\ntouch -t 202611202359 logs/*-20.*; touch -t 202611212359 logs/*-21.*\ntouch -t 202611222359 logs/*-22.*; touch -t 202611232359 logs/*-23.*\ngrep -qx 'logs/' .gitignore || echo 'logs/' >> .gitignore\n[ -f .env ] || printf \"DB_URL=postgres://app:S3cret-Dev@localhost:5432/labflow\\nJWT_SECRET=dev-only-change-me\\n\" > .env\necho \"Chuong 3 san sang: $(ls logs | wc -l) file log, $(grep -rE '// (TODO|FIXME)' src web/src | wc -l | tr -d ' ') ghi chu TODO/FIXME\"\n");
const O_GREP_RG = out("$ du -sh web/node_modules; find . -type f | wc -l\n118M\tweb/node_modules\n6643\n\n$ time (grep -rn useEffect . | wc -l)\n182\nreal 1.923s\n\n$ time (rg -n useEffect | wc -l)\n2\nreal 0.007s\n\n$ rg -n useEffect\nweb/src/TaskList.jsx:1:import { useEffect, useState } from 'react';\nweb/src/TaskList.jsx:6:  useEffect(() => { fetchTasks().then(setTasks); }, []);\n\n$ grep -rln \"localhost:3000\" . | wc -l\n10\n\n$ grep -rn \"localhost:3000\" web/dist | wc -c\n52001\n\n$ rg -n \"localhost:3000\"\nweb/src/api.js:2:const BASE = 'http://localhost:3000';\n");
const O_RG_TIM = out("$ rg -c '\\.post\\(|@PostMapping'\nlabflow-mini/src/routes/tasks.routes.js:1\ngear-mini/src/main/java/com/labflow/gear/gear/GearController.java:1\n\n$ rg -n -t java '@(Get|Post|Patch|Delete)Mapping'\ngear-mini/src/main/java/com/labflow/gear/gear/GearController.java:24:    @GetMapping(\"/available\")\ngear-mini/src/main/java/com/labflow/gear/gear/GearController.java:29:    @PostMapping(\"/{id}/borrow\")\n\n$ rg -F 'res.status(' labflow-mini/src\nlabflow-mini/src/routes/tasks.routes.js:  res.status(201).json(task);\nlabflow-mini/src/app.js:  app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));\nlabflow-mini/src/routes/users.routes.js:  if (!user) return res.status(404).json({ error: 'user not found' });\n\n$ rg -n -C1 'status = 400' labflow-mini\nlabflow-mini/src/services/task.service.js-23-    const err = new Error('title is required');\nlabflow-mini/src/services/task.service.js:24:    err.status = 400;\nlabflow-mini/src/services/task.service.js-25-    throw err;\n\n$ rg -S createtask labflow-mini/src | head -2\nlabflow-mini/src/services/task.service.js:export function createTask(input) {\nlabflow-mini/src/routes/tasks.routes.js:import { listTasks, createTask, markDone } from '../services/task.service.js';\n\n$ rg --files labflow-mini | wc -l\n17\n");
const O_RG_TYPE = out("$ rg --type-list | rg \"^(js|java|ts):\"\njava: *.java, *.jsp, *.jspx, *.properties\njs: *.cjs, *.js, *.jsx, *.mjs, *.vue\nts: *.cts, *.mts, *.ts, *.tsx\n");
const O_RG_TODO = out("$ rg -n 'TODO|FIXME'\nlabflow-mini/web/src/api.js:1:// TODO: doc BASE tu import.meta.env thay vi viet cung\nlabflow-mini/test/task.service.test.js:11:  assert.ok(listTasks('TODO').every((t) => t.status === 'TODO'));\nlabflow-mini/src/services/task.service.js:5:  { id: 1, title: 'Viet API dang nhap', assigneeId: 1, status: 'TODO', due: '2026-12-01' },\nlabflow-mini/src/services/task.service.js:7:  { id: 3, title: 'Viet test cho task service', assigneeId: 3, status: 'TODO', due: '2026-12-05' },\nlabflow-mini/src/services/task.service.js:20:// TODO(binh): kiem tra assigneeId co ton tai truoc khi tao\nlabflow-mini/src/services/task.service.js:27:  const task = { id: TASKS.length + 1, status: 'TODO', assigneeId: null, due: null, ...input };\nlabflow-mini/src/services/task.service.js:32:// FIXME: markDone chua ghi lai ai la nguoi bam Done\n\n$ rg -n '//\\s*(TODO|FIXME)'\nlabflow-mini/web/src/api.js:1:// TODO: doc BASE tu import.meta.env thay vi viet cung\nlabflow-mini/src/services/task.service.js:20:// TODO(binh): kiem tra assigneeId co ton tai truoc khi tao\nlabflow-mini/src/services/task.service.js:32:// FIXME: markDone chua ghi lai ai la nguoi bam Done\n");
const O_RG_ENV = out("$ rg JWT_SECRET labflow-mini; echo \"exit=$?\"\nexit=1\n\n$ rg --hidden JWT_SECRET labflow-mini; echo \"exit=$?\"\nexit=1\n\n$ rg -uu JWT_SECRET labflow-mini\nlabflow-mini/.env:JWT_SECRET=dev-only-change-me\n");
const O_RG_STDIN = out("$ timeout 5 rg -n \"// TODO\"\nexit=124\n$ timeout 5 rg -n \"// TODO\" .\n./web/src/api.js:1:// TODO: doc BASE tu import.meta.env thay vi viet cung\n./src/services/task.service.js:20:// TODO(binh): kiem tra assigneeId co ton tai truoc khi tao\nexit=0\n");
const O_RG_THAY = out("$ rg ERROR logs/app-2026-11-23.log | head -3\n2026-11-23T09:30:11+07:00 ERROR GET /users/9 500 2787ms user=1\n2026-11-23T10:31:12+07:00 ERROR POST /tasks 500 2764ms user=2\n2026-11-23T11:26:07+07:00 ERROR GET /users/9 500 1371ms user=3\n\n$ rg -o 'T(\\d\\d):.* ERROR' -r '$1h' logs/app-*.log --no-filename | sort | uniq -c\n     20 \n\n$ rg -o 'T(\\d\\d):.* ERROR' -r '${1}h' logs/app-*.log --no-filename | sort | uniq -c\n      4 08h\n      1 09h\n      3 10h\n      3 11h\n      2 12h\n      2 13h\n      3 14h\n      2 17h\n\n$ rg -c ERROR logs/app-*.log\nlogs/app-2026-11-20.log:6\nlogs/app-2026-11-22.log:2\nlogs/app-2026-11-21.log:4\nlogs/app-2026-11-23.log:8\n\n$ rg -c ERROR logs/app-*.log --sort path\nlogs/app-2026-11-20.log:6\nlogs/app-2026-11-21.log:4\nlogs/app-2026-11-22.log:2\nlogs/app-2026-11-23.log:8\n");
const O_FD = out("$ find . -name '*.js' | wc -l\n3632\n\n$ fd -e js | wc -l\n10\n\n$ fd Controller\ngear-mini/src/main/java/com/labflow/gear/gear/GearController.java\n\n$ fd -e java . gear-mini/src/test\ngear-mini/src/test/java/com/labflow/gear/GearMiniApplicationTests.java\ngear-mini/src/test/java/com/labflow/gear/gear/GearServiceTest.java\n\n$ fd -H -I '^\\.env$'\nlabflow-mini/.env\n\n$ fd -t d -d 2 . labflow-mini\nlabflow-mini/src/\nlabflow-mini/src/routes/\nlabflow-mini/src/services/\nlabflow-mini/src/utils/\nlabflow-mini/test/\nlabflow-mini/web/\nlabflow-mini/web/src/\n\n$ fd -e java . gear-mini/src/main -X wc -l | tail -3\n   7 gear-mini/src/main/java/com/labflow/gear/gear/Gear.java\n  13 gear-mini/src/main/java/com/labflow/gear/GearMiniApplication.java\n 195 total\n");
const O_FD_X = out("$ fd -I -e log --changed-before 2026-11-22 . logs -x echo mv {} {}.old\nmv logs/app-2026-11-21.log logs/app-2026-11-21.log.old\nmv logs/app-2026-11-20.log logs/app-2026-11-20.log.old\n");
const B_FZF_SETUP = bash("# --- fzf: thêm vào ~/.config/do-nghe/dev.sh ---\n# fzf 0.48 trở lên (Homebrew, winget, bản mới): một dòng là có Ctrl+R, Ctrl+T, Alt+C\nif fzf --bash >/dev/null 2>&1; then\n  [ -n \"$BASH_VERSION\" ] && eval \"$(fzf --bash)\"\n  [ -n \"$ZSH_VERSION\" ] && source <(fzf --zsh)\nelse  # fzf cũ hơn (Ubuntu 24.04 apt là 0.44): nạp file mẫu đi kèm gói\n  [ -n \"$BASH_VERSION\" ] && [ -f /usr/share/doc/fzf/examples/key-bindings.bash ] && . /usr/share/doc/fzf/examples/key-bindings.bash\n  [ -n \"$ZSH_VERSION\" ] && [ -f /usr/share/doc/fzf/examples/key-bindings.zsh ] && . /usr/share/doc/fzf/examples/key-bindings.zsh\nfi\n# Ctrl+T, Alt+C và fzf trần dùng fd ⇒ tôn trọng .gitignore, bỏ qua node_modules/target\nexport FZF_DEFAULT_COMMAND='fd --type f'\nexport FZF_CTRL_T_COMMAND=\"$FZF_DEFAULT_COMMAND\"\nexport FZF_ALT_C_COMMAND='fd --type d'\n");
const O_FZF = out("  2       ./mvnw -q test\n> 12      ./mvnw -q test -Dtest=GearServiceTest\n  2/16 +S ─────────────────────────────────────────────────────────────────────────────────────────\n> mvn test\n");
const O_FZF_T_FIND = out("> tsk serv\n  45/7358 (0) ─────────────────────────────────────────────────────────────────────────────────────\n> src/services/task.service.js                                                                     │\n  test/task.service.test.js\n  web/node_modules/caniuse-lite/data/features/serviceworkers.js\n  web/node_modules/vite/dist/node/chunks/server.js\n  web/node_modules/scheduler/cjs/scheduler-unstable_post_task.development.js\n  web/node_modules/json-schema-traverse/package.json\n  web/node_modules/caniuse-lite/dist/unpacker/browserVersions.js\n  web/node_modules/jsdom/lib/jsdom/living/events/KeyboardEvent-impl.js\n");
const O_FZF_T_FD = out("> tsk serv\n  2/17 (0) ────────────────────────────────────────────────────────────────────────────────────────\n> src/services/task.service.js\n  test/task.service.test.js\n");
const O_FZF_PREV = out("                                        ╭──────────────────────────────────────────────────────────╮\n                                        │ export function formatDueDate(iso) {                     │\n                                        │   if (!iso) return 'Khong han';                          │\n                                        │   const [y, m, d] = iso.split('-');                      │\n                                        │   return d + '/' + m + '/' + y;                          │\n                                        │ }                                                        │\n                                        │                                                          │\n                                        │                                                          │\n                                        │                                                          │\n> src/utils/format.js                   │                                                          │\n  1/17 ──────────────────────────────── │                                                          │\n> format                                ╰──────────────────────────────────────────────────────────╯\n");
const O_THEM32 = out("$ git branch feature/GEAR-12-tra-thiet-bi; git branch feature/GEAR-15-han-muon; git branch hotfix/login-500\n\n$ git branch --format='%(refname:short)' | fzf --filter gear\nfeature/GEAR-15-han-muon\nfeature/GEAR-12-tra-thiet-bi\n\n$ git switch \"$(git branch --format='%(refname:short)' | fzf --filter 'gear 15' | head -1)\"\nSwitched to branch 'feature/GEAR-15-han-muon'\n\n$ git switch -q master; git branch -q -D feature/GEAR-12-tra-thiet-bi feature/GEAR-15-han-muon hotfix/login-500\n\n$ printf 'echo xin chao\\r\\n' > /tmp/chay.sh; bash /tmp/chay.sh | od -c | head -2\n0000000   x   i   n       c   h   a   o  \\r  \\n\n0000012\n\n$ bat -A /tmp/chay.sh\necho·xin·chao␍␊\n");
const O_BAT = out("sv@may-sv:~/do-nghe/labflow-mini$ bat src/utils/format.js\n───────┬──────────────────────────────────────────────────────────────────────────────────\n       │ File: src/utils/format.js\n───────┼──────────────────────────────────────────────────────────────────────────────────\n   1   │ export function formatDueDate(iso) {\n   2   │   if (!iso) return 'Khong han';\n   3   │   const [y, m, d] = iso.split('-');\n   4   │   return d + '/' + m + '/' + y;\n   5   │ }\n───────┴──────────────────────────────────────────────────────────────────────────────────\nsv@may-sv:~/do-nghe/labflow-mini$ echo \"// thu\" >> src/utils/format.js; bat --diff src/uti\nls/format.js\n───────┬──────────────────────────────────────────────────────────────────────────────────\n       │ File: src/utils/format.js\n───────┼──────────────────────────────────────────────────────────────────────────────────\n   4   │   return d + '/' + m + '/' + y;\n   5   │ }\n   6 + │ // thu\n───────┴──────────────────────────────────────────────────────────────────────────────────\nsv@may-sv:~/do-nghe/labflow-mini$ git checkout -q src/utils/format.js\nsv@may-sv:~/do-nghe/labflow-mini$\n");
const O_JQ_RAW = out("$ curl -s localhost:41300/tasks\n[{\"id\":1,\"title\":\"Viet API dang nhap\",\"assigneeId\":1,\"status\":\"TODO\",\"due\":\"2026-12-01\",\"assignee\":\"An\",\"dueText\":\"01/12/2026\"},{\"id\":2,\"title\":\"Ve man hinh danh sach\",\"assigneeId\":2,\"status\":\"DOING\",\"due\":\"2026-12-03\",\"assignee\":\"Binh\",\"dueText\":\"03/12/2026\"},{\"id\":3,\"title\":\"Viet test cho task service\",\"assigneeId\":3,\"status\":\"TODO\",\"due\":\"2026-12-05\",\"assignee\":\"Chi\",\"dueText\":\"05/12/2026\"}]\n");
const O_JQ_CO_BAN = out("$ curl -s localhost:41300/tasks | jq \".[0]\"\n{\n  \"id\": 1,\n  \"title\": \"Viet API dang nhap\",\n  \"assigneeId\": 1,\n  \"status\": \"TODO\",\n  \"due\": \"2026-12-01\",\n  \"assignee\": \"An\",\n  \"dueText\": \"01/12/2026\"\n}\n\n$ curl -s localhost:41300/tasks | jq -r \".[].title\"\nViet API dang nhap\nVe man hinh danh sach\nViet test cho task service\n\n$ curl -s localhost:41300/tasks | jq \"map({id, title, assignee})\" -c\n[{\"id\":1,\"title\":\"Viet API dang nhap\",\"assignee\":\"An\"},{\"id\":2,\"title\":\"Ve man hinh danh sach\",\"assignee\":\"Binh\"},{\"id\":3,\"title\":\"Viet test cho task service\",\"assignee\":\"Chi\"}]\n\n$ curl -s localhost:41300/tasks | jq length\n3\n");
const O_JQ_LOC = out("$ curl -s localhost:41300/tasks | jq -r '.[] | select(.status == \"TODO\") | .title'\nViet API dang nhap\nViet test cho task service\n\n$ curl -s localhost:41300/tasks | jq -c 'group_by(.status) | map({status: .[0].status, n: length})'\n[{\"status\":\"DOING\",\"n\":1},{\"status\":\"TODO\",\"n\":2}]\n\n$ curl -s localhost:41300/tasks | jq -r '.[] | [.id, .status, .assignee, .dueText] | @tsv'\n1\tTODO\tAn\t01/12/2026\n2\tDOING\tBinh\t03/12/2026\n3\tTODO\tChi\t05/12/2026\n\n$ curl -s -X POST localhost:41300/tasks -H 'Content-Type: application/json' -d '{}' | jq -r .error\ntitle is required\n\n$ jq -r '.devDependencies | to_entries[] | \"\\(.key)@\\(.value)\"' web/package.json\nvite@^7.0.0\n@vitejs/plugin-react@^5.0.0\ntypescript@^5.9.0\neslint@^9.0.0\n@types/react@^19.0.0\nvitest@^3.0.0\njsdom@^27.0.0\n");
const O_JQ_LOG = out("$ jq -c 'select(.status >= 500)' logs/access-2026-11-23.jsonl | head -3\n{\"time\":\"2026-11-23T09:30:11+07:00\",\"level\":\"ERROR\",\"method\":\"GET\",\"path\":\"/users/9\",\"status\":500,\"ms\":2787,\"user\":1}\n{\"time\":\"2026-11-23T10:31:12+07:00\",\"level\":\"ERROR\",\"method\":\"POST\",\"path\":\"/tasks\",\"status\":500,\"ms\":2764,\"user\":2}\n{\"time\":\"2026-11-23T11:26:07+07:00\",\"level\":\"ERROR\",\"method\":\"GET\",\"path\":\"/users/9\",\"status\":500,\"ms\":1371,\"user\":3}\n\n$ jq -s 'map(select(.status >= 500)) | length' logs/access-*.jsonl\n20\n\n$ jq -r 'select(.level == \"ERROR\") | .path' logs/access-*.jsonl | sort | uniq -c | sort -rn\n      8 /tasks\n      5 /users/1\n      4 /tasks/2/done\n      3 /users/9\n\n$ jq -s -c 'group_by(.path) | map({path: .[0].path, n: length, tb_ms: (map(.ms) | add / length | floor)}) | sort_by(-.tb_ms)' logs/access-2026-11-23.jsonl\n[{\"path\":\"/users/9\",\"n\":21,\"tb_ms\":222},{\"path\":\"/users/1\",\"n\":27,\"tb_ms\":157},{\"path\":\"/tasks\",\"n\":59,\"tb_ms\":138},{\"path\":\"/tasks/2/done\",\"n\":13,\"tb_ms\":136}]\n");
const O_JQ_LOI = out("$ curl -s localhost:41300/task | jq\njq: parse error: Invalid numeric literal at line 1, column 10\n\n$ curl -s localhost:41300/task\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /task</pre>\n</body>\n</html>\n\n$ curl -s -o /dev/null -w \"%{http_code} %{content_type}\\n\" localhost:41300/task\n404 text/html; charset=utf-8\n");
const O_TLDR = out("$ tldr --update\nDownloading tldr pages to /home/sv/.local/share/tldr\ntldr: Data.Binary.Get.runGet at position 4: Did not find end of central directory signature\nCallStack (from HasCallStack):\n  error, called at libraries/binary/src/Data/Binary/Get.hs:345:5 in binary-0.8.9.1:Data.Binary.Get\n\n$ tldr tar\nNo tldr entry for tar\n");
const B_CAI_DAT = bash("# macOS (Homebrew)\nbrew install ripgrep fd fzf bat jq tlrc\n\n# Windows (winget, không cần quyền admin với đa số gói)\nwinget install BurntSushi.ripgrep.MSVC\nwinget install sharkdp.fd\nwinget install junegunn.fzf\nwinget install sharkdp.bat\nwinget install jqlang.jq\n\n# Ubuntu / WSL2 (apt) — hai gói bị đổi tên lệnh: fd ⇒ fdfind, bat ⇒ batcat\nsudo apt install ripgrep fd-find fzf bat jq\nmkdir -p ~/.local/bin\nln -s \"$(command -v fdfind)\" ~/.local/bin/fd\nln -s \"$(command -v batcat)\" ~/.local/bin/bat\n");
const B_CURL_AN_TOAN = bash("# ĐỪNG: chạy thẳng thứ máy chủ trả về, chưa đọc, chưa kiểm\ncurl -fsSL https://example.com/install.sh | bash\n\n# NÊN: tải về ⇒ đọc ⇒ kiểm tổng do nhà phát hành công bố ⇒ mới chạy\ncurl -fsSLo install.sh https://example.com/install.sh\nless install.sh\nsha256sum install.sh        # macOS: shasum -a 256 install.sh — so với số trên trang phát hành\nbash install.sh\n");
const O_SHA = out("$ curl -fsSLO https://nodejs.org/dist/v22.21.1/node-v22.21.1-linux-x64.tar.xz\n$ curl -fsSLO https://nodejs.org/dist/v22.21.1/SHASUMS256.txt\n$ sha256sum -c --ignore-missing SHASUMS256.txt\nnode-v22.21.1-linux-x64.tar.xz: OK\n$ printf x >> node-v22.21.1-linux-x64.tar.xz; sha256sum -c --ignore-missing SHASUMS256.txt; echo \"exit=$?\"\nnode-v22.21.1-linux-x64.tar.xz: FAILED\nsha256sum: WARNING: 1 computed checksum did NOT match\nsha256sum: SHASUMS256.txt: no file was verified\nexit=1\n");

const CO_RG = (en) => `<table>
<thead><tr><th>${en ? 'Flag' : 'Cờ'}</th><th>${en ? 'Meaning' : 'Nghĩa'}</th><th>${en ? 'grep equivalent' : 'Tương đương grep'}</th></tr></thead>
<tbody>
<tr><td><code>-n</code></td><td>${en ? 'line numbers (on by default in a terminal)' : 'số dòng (mặc định bật khi in ra terminal)'}</td><td><code>-n</code></td></tr>
<tr><td><code>-w</code></td><td>${en ? 'whole word only' : 'chỉ khớp nguyên từ'}</td><td><code>-w</code></td></tr>
<tr><td><code>-F</code></td><td>${en ? 'literal text, no regex — for things like <code>res.status(</code>' : 'chữ nguyên văn, không regex — cho thứ như <code>res.status(</code>'}</td><td><code>-F</code></td></tr>
<tr><td><code>-i</code> / <code>-S</code></td><td>${en ? 'ignore case / smart case (ignore case unless you typed a capital)' : 'bỏ qua hoa thường / “thông minh” (bỏ qua trừ khi bạn gõ chữ hoa)'}</td><td><code>-i</code></td></tr>
<tr><td><code>-t java</code> / <code>-T js</code></td><td>${en ? 'only / exclude a file type (<code>rg --type-list</code>)' : 'chỉ / loại một kiểu file (<code>rg --type-list</code>)'}</td><td><code>--include</code></td></tr>
<tr><td><code>-g '*.test.js'</code> / <code>-g '!dist'</code></td><td>${en ? 'include / exclude by glob' : 'lấy / loại theo mẫu tên'}</td><td><code>--include</code> / <code>--exclude-dir</code></td></tr>
<tr><td><code>-l</code> / <code>-c</code></td><td>${en ? 'file names only / count per file' : 'chỉ tên file / đếm theo file'}</td><td><code>-l</code> / <code>-c</code></td></tr>
<tr><td><code>-C 2</code> (<code>-A</code>, <code>-B</code>)</td><td>${en ? 'lines of context around (after, before)' : 'số dòng ngữ cảnh quanh (sau, trước)'}</td><td>${en ? 'same' : 'giống'}</td></tr>
<tr><td><code>-o</code>, <code>-r '$1'</code></td><td>${en ? 'print only the match / print a replacement (file unchanged)' : 'chỉ in phần khớp / in bản thay thế (file không đổi)'}</td><td><code>-o</code> / —</td></tr>
<tr><td><code>--hidden</code>, <code>-u</code>, <code>-uu</code>, <code>-uuu</code></td><td>${en ? 'also hidden files / also ignored / both / also binary' : 'cả file ẩn / cả file bị ignore / cả hai / cả nhị phân'}</td><td>${en ? '(grep searches everything)' : '(grep tìm hết)'}</td></tr>
<tr><td><code>--files</code>, <code>--sort path</code></td><td>${en ? 'list files that would be searched / stable order' : 'liệt kê file sẽ được tìm / thứ tự ổn định'}</td><td>—</td></tr>
</tbody>
</table>`;

const L2 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Terminal' : 'Chương 3 · Terminal'}</span>
<h2>${en ? '3.2 — Modern CLI tools: ripgrep, fd, fzf, bat, jq, tldr' : '3.2 — Công cụ dòng lệnh hiện đại: ripgrep, fd, fzf, bat, jq, tldr'}</h2>
<p class="lead">${en
    ? 'You already use ripgrep every day without knowing it: the search box of VS Code runs <code>rg</code> underneath. This lesson takes the same engine — and five companions — to the terminal, where you can combine them: find every endpoint of two projects, pick a file by typing three letters, read the JSON an API returns, and count errors per hour in four days of logs. Every output below is real, run on labflow-mini and gear-mini.'
    : 'Bạn đã dùng ripgrep mỗi ngày mà không biết: ô tìm kiếm của VS Code chạy <code>rg</code> ở bên dưới. Bài này mang đúng bộ máy đó — cùng năm người bạn đồng hành — ra terminal, nơi bạn kết hợp được chúng: tìm mọi endpoint của hai dự án, chọn file bằng ba chữ cái, đọc JSON mà API trả về, và đếm lỗi theo giờ trong log của bốn ngày. Mọi output dưới đây là thật, chạy trên labflow-mini và gear-mini.'}</p>

<h3>${en ? 'Prepare the data for this chapter' : 'Chuẩn bị dữ liệu cho chương này'}</h3>
<p>${en
    ? 'The script below turns labflow-mini into a project the size of a real one: a React + Vite front-end with its 118 MB <code>node_modules</code> and a minified build in <code>web/dist</code>, three TODO/FIXME notes in the code, a fake <code>.env</code>, and four days of logs in two formats (text and JSON lines). The logs are deterministic — your numbers will match the ones in this chapter. It needs Node 20+ and Internet for <code>npm install</code>; on Windows run it in Git Bash.'
    : 'Script dưới đây biến labflow-mini thành một dự án cỡ thật: front-end React + Vite với <code>node_modules</code> 118 MB và bản build đã nén trong <code>web/dist</code>, ba ghi chú TODO/FIXME trong mã, một file <code>.env</code> giả, và log bốn ngày ở hai dạng (chữ thường và JSON từng dòng). Log được sinh tất định — số của bạn sẽ khớp với số trong chương. Cần Node 20+ và mạng để <code>npm install</code>; trên Windows chạy trong Git Bash.'}</p>
${giai(en ? 'tao-ch3.sh — click to open, save as ~/do-nghe/tao-ch3.sh, run inside labflow-mini' : 'tao-ch3.sh — bấm để mở, lưu thành ~/do-nghe/tao-ch3.sh, chạy trong labflow-mini', B_TAO_CH3)}
${out('$ cd ~/do-nghe/labflow-mini && bash ../tao-ch3.sh\nChuong 3 san sang: 8 file log, 3 ghi chu TODO/FIXME')}

<h3>${en ? 'Why not just grep -r?' : 'Sao không dùng luôn grep -r?'}</h3>
<p>${en
    ? '<code>grep -r</code> searches <em>everything</em> under the folder: dependencies, build output, minified bundles, <code>.git</code>. On a real JavaScript project that is thousands of files you did not write. Same question, both tools, measured:'
    : '<code>grep -r</code> tìm <em>mọi thứ</em> dưới thư mục: thư viện, kết quả build, bundle đã nén, cả <code>.git</code>. Với một dự án JavaScript thật, đó là hàng nghìn file không phải bạn viết. Cùng một câu hỏi, hai công cụ, đo thật:'}</p>
${O_GREP_RG}
<ul>
<li>${en ? '<strong>Noise</strong>: 182 lines from grep, 2 from rg — the 2 you care about. The 180 others are inside <code>node_modules</code>.' : '<strong>Nhiễu</strong>: grep ra 182 dòng, rg ra 2 — đúng 2 dòng bạn cần. 180 dòng kia nằm trong <code>node_modules</code>.'}</li>
<li>${en ? '<strong>One-line monsters</strong>: grep also matched <code>web/dist</code>, where the whole bundle is a single line — printing it costs 52,001 characters on your screen. rg skips <code>dist/</code> because it is in <code>.gitignore</code>.' : '<strong>Dòng quái vật</strong>: grep còn khớp trong <code>web/dist</code>, nơi cả bundle nằm trên một dòng — in nó ra là 52.001 ký tự tràn màn hình. rg bỏ qua <code>dist/</code> vì nó có trong <code>.gitignore</code>.'}</li>
<li>${en ? '<strong>Time</strong>: 1.9 s versus 0.007 s on the first run (files not cached yet); on later runs grep took about 0.15 s and rg 0.003 s. On a monorepo with millions of files the gap becomes minutes.' : '<strong>Thời gian</strong>: 1,9 giây so với 0,007 giây ở lần đầu (file chưa nằm trong bộ nhớ đệm); các lần sau grep mất khoảng 0,15 giây, rg 0,003 giây. Với monorepo hàng triệu file, khoảng cách thành vài phút.'}</li>
</ul>
<p>${en
    ? 'ripgrep’s defaults are the whole trick: it reads <code>.gitignore</code>, <code>.ignore</code> and <code>.rgignore</code>, skips hidden files and binary files, and searches with all CPU cores. grep is still the right tool on a server where only grep exists, and its options are taught in'
    : 'Toàn bộ bí quyết của ripgrep nằm ở mặc định: nó đọc <code>.gitignore</code>, <code>.ignore</code> và <code>.rgignore</code>, bỏ qua file ẩn và file nhị phân, và tìm bằng mọi nhân CPU. grep vẫn là công cụ đúng trên máy chủ chỉ có grep, và các cờ của nó được dạy ở'} ${bai('linux-bash', 'lnx-3-3-grep-regex', 'Linux &amp; Bash 3.3')}.</p>

<h3>${en ? 'ripgrep: the flags you will actually use' : 'ripgrep: những cờ bạn sẽ thật sự dùng'}</h3>
${CO_RG(en)}
${O_RG_TIM}
<p>${en
    ? 'Read the first two answers together: across both projects there is exactly one POST in each — <code>tasksRouter.post</code> in Express and <code>@PostMapping</code> in Spring — and <code>-t java</code> lists the Spring endpoints with line numbers. <code>-S createtask</code> (lower case) still found <code>createTask</code>; typing a capital would make it exact. File types are predefined; note that <code>js</code> already includes <code>.jsx</code>, <code>.mjs</code> and <code>.vue</code>:'
    : 'Đọc hai kết quả đầu cùng nhau: trong cả hai dự án có đúng một POST mỗi bên — <code>tasksRouter.post</code> của Express và <code>@PostMapping</code> của Spring — và <code>-t java</code> liệt kê endpoint Spring kèm số dòng. <code>-S createtask</code> (chữ thường) vẫn tìm ra <code>createTask</code>; gõ một chữ hoa thì nó tìm chính xác. Kiểu file được định nghĩa sẵn; để ý <code>js</code> đã gồm cả <code>.jsx</code>, <code>.mjs</code> và <code>.vue</code>:'}</p>
${O_RG_TYPE}

<h3>${en ? 'A pattern that is too loose lies to you' : 'Mẫu tìm quá lỏng sẽ nói dối bạn'}</h3>
<p>${en ? 'The team lead asks: “How many TODO/FIXME notes are left in labflow-mini?” The obvious search:' : 'Trưởng nhóm hỏi: “labflow-mini còn bao nhiêu ghi chú TODO/FIXME?” Lệnh tìm hiển nhiên:'}</p>
${O_RG_TODO}
<p>${en
    ? 'Seven lines, but only three are notes — the other four are the task <em>status</em> value <code>\'TODO\'</code>. Anchoring the pattern to a comment (<code>//</code>, optional spaces) gives the honest answer. Always look at a sample of matches before you report a count — the same rule will matter a lot when you <em>replace</em> with regex in Chapter 4.'
    : 'Bảy dòng, nhưng chỉ ba là ghi chú — bốn dòng còn lại là giá trị <em>trạng thái</em> <code>\'TODO\'</code> của task. Neo mẫu vào chú thích (<code>//</code>, có thể có khoảng trắng) cho câu trả lời trung thực. Luôn nhìn một ít kết quả khớp trước khi báo con số — quy tắc này càng quan trọng khi bạn <em>thay thế</em> bằng regex ở Chương 4.'}</p>

<h3>${en ? '“rg found nothing” is not “nothing is there”' : '“rg không thấy” không có nghĩa “không có”'}</h3>
<p>${en ? 'A security reviewer asks you to check whether <code>JWT_SECRET</code> appears anywhere in the project:' : 'Người review bảo mật nhờ bạn kiểm xem <code>JWT_SECRET</code> có xuất hiện ở đâu trong dự án không:'}</p>
${O_RG_ENV}
<p>${en
    ? '<code>.env</code> is both hidden (starts with a dot) <em>and</em> listed in <code>.gitignore</code>, so <code>--hidden</code> alone is not enough; <code>-uu</code> lifts both filters. The smart defaults that make rg pleasant for code are exactly what make it wrong for an audit. When the question is “is this secret anywhere on disk?”, search with <code>-uu</code> (or <code>-uuu</code> to include binaries) and say so in your answer.'
    : '<code>.env</code> vừa là file ẩn (bắt đầu bằng dấu chấm) <em>vừa</em> có trong <code>.gitignore</code>, nên chỉ <code>--hidden</code> là chưa đủ; <code>-uu</code> gỡ cả hai lớp lọc. Chính các mặc định thông minh khiến rg dễ chịu khi tìm mã lại khiến nó sai khi kiểm tra bảo mật. Khi câu hỏi là “bí mật này có nằm đâu trên đĩa không?”, hãy tìm bằng <code>-uu</code> (hoặc <code>-uuu</code> để gồm cả file nhị phân) và nói rõ điều đó trong câu trả lời.'}</p>

<div class="pitfall co-tieu-de"><p><strong>${en ? 'In a script, always give rg a path' : 'Trong script, luôn đưa đường dẫn cho rg'}</strong></p><p>${en
    ? 'Without a path, rg decides what to search by looking at its input: in a terminal it searches the current folder, but if standard input is a pipe — inside a CI job, a git hook, a <code>docker exec -i</code>, or the Bash tool of an editor — it searches <em>standard input</em> instead. Real run of the same command, once without and once with <code>.</code>:'
    : 'Không có đường dẫn, rg tự đoán phải tìm gì dựa vào đầu vào: trong terminal nó tìm thư mục hiện tại, nhưng nếu đầu vào chuẩn là một ống — trong job CI, git hook, <code>docker exec -i</code>, hay công cụ chạy lệnh của editor — nó tìm trong <em>đầu vào chuẩn</em>. Chạy thật cùng một lệnh, một lần không có và một lần có <code>.</code>:'}</p>
${O_RG_STDIN}
<p>${en
    ? 'Exit 124 is <code>timeout</code> killing a hung process; with a closed pipe instead you get exit 1 and silence, which a script reads as “no TODO left”. Both are bugs you only see on the build server.'
    : 'Mã 124 là <code>timeout</code> giết một tiến trình đang treo; còn nếu ống đã đóng, bạn nhận mã 1 và im lặng — script hiểu thành “hết TODO rồi”. Cả hai đều là lỗi chỉ lộ ra trên máy build.'}</p></div>

<h3>${en ? 'Extracting with -o and -r: errors per hour' : 'Trích bằng -o và -r: lỗi theo từng giờ'}</h3>
<p>${en ? 'The on-call engineer wants to know at which hours the 500 errors cluster. <code>-o</code> prints only the match, <code>-r</code> rewrites it using capture groups — the files are not changed:' : 'Người trực sự cố muốn biết lỗi 500 dồn vào những giờ nào. <code>-o</code> chỉ in phần khớp, <code>-r</code> viết lại phần đó theo nhóm bắt — file không hề bị sửa:'}</p>
${O_RG_THAY}
<p>${en
    ? 'Two real traps in one screen. <code>$1h</code> printed 20 empty lines because rg reads it as a group named <code>1h</code>, which does not exist; write <code>\${1}h</code>. And without <code>--sort path</code>, the per-file counts come out in whatever order the threads finish (20, 22, 21, 23) — fine for your eyes, wrong for a report or a diff.'
    : 'Hai cái bẫy thật trong cùng một màn hình. <code>$1h</code> in ra 20 dòng rỗng vì rg hiểu đó là nhóm tên <code>1h</code> — không tồn tại; phải viết <code>\${1}h</code>. Và thiếu <code>--sort path</code>, số đếm theo file ra theo thứ tự luồng nào xong trước (20, 22, 21, 23) — xem bằng mắt thì được, đưa vào báo cáo hay so sánh thì sai.'}</p>

<h3>${en ? 'fd: find files by name, with sane defaults' : 'fd: tìm file theo tên, mặc định hợp lý'}</h3>
<p>${en ? '<code>fd</code> is to <code>find</code> what rg is to grep: same ignore rules, regex on the name by default, coloured output, short flags.' : '<code>fd</code> với <code>find</code> giống như rg với grep: cùng luật bỏ qua, mặc định khớp regex trên tên, có màu, cờ ngắn.'}</p>
${O_FD}
<table>
<thead><tr><th>${en ? 'Task' : 'Việc'}</th><th>find</th><th>fd</th></tr></thead>
<tbody>
<tr><td>${en ? 'Files whose name contains “Controller”' : 'File có tên chứa “Controller”'}</td><td><code>find . -name '*Controller*'</code></td><td><code>fd Controller</code></td></tr>
<tr><td>${en ? 'By extension' : 'Theo đuôi'}</td><td><code>find . -name '*.java'</code></td><td><code>fd -e java</code></td></tr>
<tr><td>${en ? 'Only folders, max depth 2' : 'Chỉ thư mục, sâu tối đa 2'}</td><td><code>find . -maxdepth 2 -type d</code></td><td><code>fd -t d -d 2</code></td></tr>
<tr><td>${en ? 'Include hidden + ignored' : 'Gồm cả ẩn + bị ignore'}</td><td>${en ? '(default)' : '(mặc định)'}</td><td><code>fd -H -I</code></td></tr>
<tr><td>${en ? 'Modified before a date' : 'Sửa trước một ngày'}</td><td><code>find . ! -newermt 2026-11-22</code></td><td><code>fd --changed-before 2026-11-22</code></td></tr>
<tr><td>${en ? 'Run a command per file / once for all' : 'Chạy lệnh cho từng file / một lần cho tất cả'}</td><td><code>-exec … {} \\;</code> / <code>-exec … {} +</code></td><td><code>-x …</code> / <code>-X …</code></td></tr>
</tbody>
</table>
<p>${en
    ? 'Batch renaming is where <code>-x</code> shines — and where you <strong>always preview first</strong> by putting <code>echo</code> in front. <code>{}</code> is the path; <code>{.}</code> the path without extension; <code>{/}</code> the file name only. Here <code>-I</code> is optional — <code>logs</code> is typed as the search path, and paths you type are always searched (measured with fd 9.0.0); searching from the project root (<code>fd -e log</code>) would need <code>-I</code>, because <code>logs/</code> is git-ignored:'
    : 'Đổi tên hàng loạt là chỗ <code>-x</code> toả sáng — và cũng là chỗ <strong>luôn xem trước</strong> bằng cách đặt <code>echo</code> phía trước. <code>{}</code> là đường dẫn; <code>{.}</code> là đường dẫn bỏ đuôi; <code>{/}</code> chỉ tên file. Ở đây <code>-I</code> không bắt buộc — <code>logs</code> được gõ thẳng làm đường tìm, mà đường gõ thẳng luôn được tìm (đo với fd 9.0.0); tìm từ gốc dự án (<code>fd -e log</code>) thì mới cần <code>-I</code>, vì <code>logs/</code> nằm trong .gitignore:'}</p>
${O_FD_X}
<p>${en ? 'Remove the <code>echo</code> only when the printed commands are exactly what you want (the lab does it for real).' : 'Chỉ bỏ <code>echo</code> khi các lệnh in ra đúng y điều bạn muốn (lab sẽ chạy thật).'}</p>

<h3>${en ? 'fzf: pick anything from a list by typing a few letters' : 'fzf: chọn bất cứ thứ gì trong danh sách bằng vài chữ cái'}</h3>
<p>${en
    ? 'fzf reads a list of lines, lets you filter it by typing fragments in any order (“tsk serv” matches <code>task.service.js</code>), and prints what you chose. On its own that sounds small; wired into the shell it replaces three daily chores. Add this to <code>dev.sh</code>:'
    : 'fzf đọc một danh sách dòng, cho bạn lọc bằng cách gõ vài mẩu theo bất kỳ thứ tự nào (“tsk serv” khớp <code>task.service.js</code>), rồi in ra thứ bạn chọn. Nghe thì nhỏ; gắn vào shell thì nó thay ba việc vặt hằng ngày. Thêm đoạn này vào <code>dev.sh</code>:'}</p>
${B_FZF_SETUP}
<p>${en ? '<strong>Ctrl+R becomes a list.</strong> Same 16-command history as lesson 3.1, typing <code>mvn test</code>: both matching commands are visible at once, with the history number, instead of one at a time:' : '<strong>Ctrl+R thành một danh sách.</strong> Cùng lịch sử 16 lệnh như bài 3.1, gõ <code>mvn test</code>: cả hai lệnh khớp hiện cùng lúc kèm số thứ tự lịch sử, thay vì từng lệnh một:'}</p>
${O_FZF}
<p>${en ? '<strong>Ctrl+T inserts a file path</strong> at the cursor. Typed <code>bat -r 18:30 </code>, pressed <code>Ctrl+T</code>, typed <code>tsk serv</code>. With the default settings fzf lists files with <code>find</code> — 7,358 candidates, including <code>node_modules</code>:' : '<strong>Ctrl+T chèn đường dẫn file</strong> vào chỗ con trỏ. Gõ <code>bat -r 18:30 </code>, bấm <code>Ctrl+T</code>, gõ <code>tsk serv</code>. Với cài đặt mặc định, fzf lấy danh sách bằng <code>find</code> — 7.358 ứng viên, gồm cả <code>node_modules</code>:'}</p>
${O_FZF_T_FIND}
<p>${en ? 'After <code>FZF_CTRL_T_COMMAND=\'fd --type f\'</code>, the same keystrokes see 17 files and two sensible matches:' : 'Sau khi đặt <code>FZF_CTRL_T_COMMAND=\'fd --type f\'</code>, cùng các phím đó chỉ còn 17 file và hai kết quả hợp lý:'}</p>
${O_FZF_T_FD}
<p>${en ? '<strong>Preview while choosing.</strong> <code>fzf --preview "bat --color=always --style=numbers {}"</code>, typing <code>format</code>: the right side shows the file before you open it (captured without colours):' : '<strong>Xem trước khi chọn.</strong> <code>fzf --preview "bat --color=always --style=numbers {}"</code>, gõ <code>format</code>: bên phải hiện nội dung file trước khi bạn mở (chụp không màu):'}</p>
${O_FZF_PREV}
<p>${en ? '<strong>In pipelines.</strong> Anything that prints a list can feed fzf. Here the non-interactive <code>--filter</code> mode shows what the picker would match when switching branches:' : '<strong>Trong ống lệnh.</strong> Thứ gì in ra danh sách cũng đưa được vào fzf. Ở đây chế độ không tương tác <code>--filter</code> cho thấy bộ chọn sẽ khớp gì khi đổi nhánh:'}</p>
${O_THEM32}
<p>${en
    ? 'In daily use drop <code>--filter</code> and <code>head</code>: <code>git switch "$(git branch --format=\'%(refname:short)\' | fzf)"</code> opens the picker. The last two commands of that screen belong to <code>bat</code>, next.'
    : 'Dùng hằng ngày thì bỏ <code>--filter</code> và <code>head</code>: <code>git switch "$(git branch --format=\'%(refname:short)\' | fzf)"</code> sẽ mở bộ chọn. Hai lệnh cuối trên màn hình đó thuộc về <code>bat</code>, ngay sau đây.'}</p>

<h3>${en ? 'bat: cat with line numbers, highlighting and invisible characters' : 'bat: cat có số dòng, tô màu và hiện ký tự vô hình'}</h3>
${O_BAT}
<p>${en
    ? '<code>-r 18:30</code> shows a line range (handy right after rg told you “line 20”); <code>--diff</code> shows only the changed lines with a <code>+</code> in the gutter. <code>-A</code> reveals what <code>cat</code> hides: in the previous screen a script saved with Windows line endings ends in <code>␍␊</code> — the CRLF that makes bash fail with “<code>$\'\\r\': command not found</code>” (the full story is in'
    : '<code>-r 18:30</code> hiện một khoảng dòng (tiện ngay sau khi rg báo “dòng 20”); <code>--diff</code> chỉ hiện các dòng đã đổi, có dấu <code>+</code> bên lề. <code>-A</code> lộ ra thứ <code>cat</code> giấu: ở màn hình trước, một script lưu bằng xuống dòng kiểu Windows kết thúc bằng <code>␍␊</code> — chính CRLF làm bash báo lỗi “<code>$\'\\r\': command not found</code>” (đầu đuôi câu chuyện ở'} ${bai('linux-bash', 'lnx-15-3-windows-wsl2', 'Linux &amp; Bash 15.3')}). ${en ? 'On Ubuntu and WSL the command is named <code>batcat</code>; the install section below links it as <code>bat</code>. When output goes into a pipe, bat behaves like plain cat, so it is safe in scripts.' : 'Trên Ubuntu và WSL lệnh tên là <code>batcat</code>; phần cài đặt bên dưới tạo liên kết thành <code>bat</code>. Khi output đi vào ống, bat cư xử như cat thường, nên dùng trong script vẫn an toàn.'}</p>

<h3>${en ? 'jq: read and reshape JSON from an API' : 'jq: đọc và nhào nặn JSON từ API'}</h3>
<p>${en ? 'This is what <code>curl</code> gives you from labflow-mini — correct, and unreadable:' : 'Đây là thứ <code>curl</code> trả về từ labflow-mini — đúng, nhưng không đọc nổi:'}</p>
${O_JQ_RAW}
<p>${en
    ? 'jq is a small language for JSON. A <em>filter</em> takes JSON in and gives JSON out; filters are chained with <code>|</code> like shell commands. Six pieces cover most of daily work: <code>.</code> (everything), <code>.field</code>, <code>.[]</code> (each element), <code>.[0]</code>, <code>{a, b}</code> (build an object), and <code>length</code>. Flags: <code>-r</code> prints strings without quotes, <code>-c</code> one JSON per line.'
    : 'jq là một ngôn ngữ nhỏ dành cho JSON. Một <em>bộ lọc</em> nhận JSON vào và cho JSON ra; các bộ lọc nối nhau bằng <code>|</code> như lệnh shell. Sáu mảnh đủ cho phần lớn việc hằng ngày: <code>.</code> (tất cả), <code>.field</code>, <code>.[]</code> (từng phần tử), <code>.[0]</code>, <code>{a, b}</code> (dựng object), và <code>length</code>. Cờ: <code>-r</code> in chuỗi không kèm nháy, <code>-c</code> mỗi JSON một dòng.'}</p>
${O_JQ_CO_BAN}
<p>${en ? 'Then the four functions that turn jq into a reporting tool — <code>select</code> (keep if true), <code>map</code>, <code>group_by</code> and <code>@tsv</code> (tab-separated text for spreadsheets or <code>sort</code>) — plus string interpolation <code>"\\(.key)@\\(.value)"</code>:' : 'Tiếp theo là bốn hàm biến jq thành công cụ làm báo cáo — <code>select</code> (giữ nếu đúng), <code>map</code>, <code>group_by</code> và <code>@tsv</code> (chữ ngăn bằng tab, dán vào bảng tính hay đưa cho <code>sort</code>) — cùng cách ghép chuỗi <code>"\\(.key)@\\(.value)"</code>:'}</p>
${O_JQ_LOC}
<p>${en
    ? 'Logs in JSON lines (one object per line, the format of most production loggers) are a stream: jq applies the filter to each line. Add <code>-s</code> (“slurp”) when you need the whole set at once, for counting or grouping:'
    : 'Log dạng JSON từng dòng (mỗi dòng một object — định dạng của đa số thư viện log ở production) là một dòng chảy: jq áp bộ lọc cho từng dòng. Thêm <code>-s</code> (“nuốt cả”) khi cần cả tập cùng lúc để đếm hay nhóm:'}</p>
${O_JQ_LOG}
<p>${en
    ? 'In one minute you know: 20 server errors in four days, <code>/tasks</code> has the most, and <code>/users/9</code> — a user that does not exist — is the slowest path on average. Reading production logs with jq, step by step, is in'
    : 'Trong một phút bạn biết: 20 lỗi máy chủ trong bốn ngày, <code>/tasks</code> nhiều nhất, và <code>/users/9</code> — một người dùng không tồn tại — là đường chậm nhất tính trung bình. Đọc log production bằng jq từng bước có ở khoá'} ${bai('log-tu-a-den-z', 'log-2-4-jq', en ? 'Logging from A to Z, lesson 2.4 (jq on real logs)' : 'Log từ A tới Z, bài 2.4 (jq trên log thật)')}.</p>
<div class="pitfall co-tieu-de"><p><strong>${en ? '“parse error” usually means it was not JSON' : '“parse error” thường nghĩa là nó không phải JSON'}</strong></p><p>${en ? 'A typo in the URL (<code>/task</code> instead of <code>/tasks</code>):' : 'Gõ nhầm URL (<code>/task</code> thay vì <code>/tasks</code>):'}</p>
${O_JQ_LOI}
<p>${en
    ? 'The server answered with an HTML 404 page, and jq choked on <code>&lt;!DOCTYPE</code>. Before debugging your filter, look at the status and content type with <code>curl -s -o /dev/null -w "%{http_code} %{content_type}\\n"</code>, or use <code>curl -i</code>.'
    : 'Máy chủ trả về trang 404 bằng HTML, và jq nghẹn ở <code>&lt;!DOCTYPE</code>. Trước khi gỡ lỗi bộ lọc, hãy xem mã trạng thái và kiểu nội dung bằng <code>curl -s -o /dev/null -w "%{http_code} %{content_type}\\n"</code>, hoặc dùng <code>curl -i</code>.'}</p></div>

<h3>${en ? 'tldr: examples instead of a manual — and a real broken client' : 'tldr: ví dụ thay cho sách hướng dẫn — và một client hỏng thật'}</h3>
<p>${en
    ? '<code>man tar</code> is 1,000 lines; the community <em>tldr pages</em> give the five commands people actually type, per tool. The pages are data; you read them with a client. The client shipped by Ubuntu 24.04 (<code>apt install tldr</code>, version 0.9.2) could not even download the pages when this lesson was written:'
    : '<code>man tar</code> dài cả nghìn dòng; bộ <em>tldr pages</em> của cộng đồng cho bạn năm lệnh người ta thật sự gõ, cho từng công cụ. Các trang là dữ liệu; bạn đọc chúng bằng một client. Client đi kèm Ubuntu 24.04 (<code>apt install tldr</code>, bản 0.9.2) còn không tải nổi các trang vào lúc soạn bài này:'}</p>
${O_TLDR}
<p>${en
    ? 'Lesson: a tool from your distribution is not automatically maintained. Use the client the tldr project itself publishes (<code>tlrc</code>: <code>brew install tlrc</code>, or from its release page), the web version at tldr.inbrowser.app, or fall back to <code>rg -A3 &lt;word&gt;</code> on <code>--help</code> output. Whatever you use, tldr is a reminder, not documentation: check the flags against the official manual before running anything destructive.'
    : 'Bài học: công cụ có sẵn trong bản phân phối chưa chắc còn được bảo trì. Dùng client do chính dự án tldr phát hành (<code>tlrc</code>: <code>brew install tlrc</code>, hoặc tải từ trang phát hành), bản web tldr.inbrowser.app, hoặc quay về <code>rg -A3 &lt;từ&gt;</code> trên output của <code>--help</code>. Dùng gì cũng vậy, tldr là lời nhắc, không phải tài liệu: đối chiếu cờ với sách hướng dẫn chính thức trước khi chạy thứ gì có thể phá huỷ.'}</p>

<h3>${en ? 'Installing the set on each OS' : 'Cài cả bộ trên từng hệ điều hành'}</h3>
${B_CAI_DAT}
<p>${en ? 'The Ubuntu lines were run for this lesson (inside the lab container, as root); the Homebrew and winget lines follow each project’s README and could not be run on the Linux machine used to write it.' : 'Các dòng Ubuntu đã chạy khi soạn bài (trong container lab, quyền root); các dòng Homebrew và winget theo README của từng dự án, không chạy được trên máy Linux dùng để soạn.'}</p>

<h3>${en ? 'In everyday terms' : 'Liên hệ đời thường'}</h3>
<p>${en
    ? 'grep -r is searching every drawer of the office, including the recycling bin; rg is searching only the filing cabinet, because the bin is labelled “ignore”. fzf is the contacts app: you type “ng an” and Nguyễn Văn An appears. jq is the filter row of a spreadsheet, for data that arrives as JSON.'
    : 'grep -r là lục từng ngăn kéo trong văn phòng, kể cả thùng rác; rg chỉ lục tủ hồ sơ, vì thùng rác đã dán nhãn “bỏ qua”. fzf là danh bạ điện thoại: gõ “ng an” là ra Nguyễn Văn An. jq là hàng lọc của bảng tính, dành cho dữ liệu đến dưới dạng JSON.'}</p>

<h3>${en ? '💼 At work: two tickets this lesson solves' : '💼 Đi làm: hai ticket bài này giải được'}</h3>
<ul>
<li>${en ? '<strong>“Rename the field <code>status</code> to <code>state</code> in the API.”</strong> Before touching anything, <code>rg -w -t js -t java status ~/repos/fe ~/repos/be --sort path</code> gives every place in both repositories — paste the count into the ticket so the reviewer knows the size. The IDE refactoring (Chapter 2) changes the code; rg tells you about the places the IDE cannot see: SQL strings, JSON fixtures, the other repository.' : '<strong>“Đổi tên field <code>status</code> thành <code>state</code> trong API.”</strong> Trước khi đụng gì, <code>rg -w -t js -t java status ~/repos/fe ~/repos/be --sort path</code> cho bạn mọi chỗ trong cả hai repo — dán con số vào ticket để người review biết quy mô. Refactor của IDE (Chương 2) sửa mã; rg cho bạn biết những chỗ IDE không thấy: chuỗi SQL, file JSON mẫu, repo bên kia.'}</li>
<li>${en ? '<strong>“Customer reports slow requests yesterday afternoon.”</strong> On the test server, <code>jq</code> over the JSON log answers “which path, how many, how slow” before you open any code. Servers do not always have jq; <code>python3 -m json.tool</code> pretty-prints in an emergency, and you should ask DevOps to add jq to the base image.' : '<strong>“Khách báo chiều qua request chậm.”</strong> Trên máy test, <code>jq</code> chạy trên log JSON trả lời “đường nào, bao nhiêu, chậm cỡ nào” trước khi bạn mở bất kỳ dòng mã nào. Máy chủ không phải lúc nào cũng có jq; lúc gấp có <code>python3 -m json.tool</code> để in đẹp, và nên nhờ DevOps thêm jq vào image gốc.'}</li>
</ul>
<p>${en
    ? 'Company laptops often block installers. winget user-scope installs and single-binary downloads (all six tools are one executable each) usually work without admin rights — but ask IT before you put any binary from the Internet on a client’s machine; some projects forbid it in the contract.'
    : 'Laptop công ty thường chặn trình cài đặt. Cài winget theo phạm vi người dùng và tải bản một-file-chạy (cả sáu công cụ đều là một file thực thi) thường không cần quyền admin — nhưng hỏi IT trước khi đặt bất kỳ file chạy nào tải từ Internet lên máy của khách hàng; một số dự án cấm việc đó trong hợp đồng.'}</p>

<h3>${en ? 'The hacker’s view: curl | bash and the Codecov breach (2021)' : 'Góc hacker: curl | bash và vụ Codecov (2021)'}</h3>
<p>${en
    ? 'Many tools — including some in this chapter — offer a one-line installer: <code>curl … | bash</code>. That line runs whatever the server sends at that second, with your permissions, without you seeing it. In 2021 Codecov, a code-coverage service used in thousands of CI pipelines, disclosed exactly this scenario: an attacker modified its Bash Uploader script on 31 January; every CI job that ran <code>curl … | bash</code> for the next two months also sent its environment variables — tokens, keys, credentials — to the attacker. The change was discovered on 1 April by a customer who compared the script’s checksum with the one published on GitHub, and disclosed on 15 April 2021. That customer did the one step everybody else skipped:'
    : 'Rất nhiều công cụ — kể cả vài cái trong chương này — có lệnh cài một dòng: <code>curl … | bash</code>. Dòng đó chạy bất cứ thứ gì máy chủ gửi về đúng giây ấy, bằng quyền của bạn, mà bạn không hề nhìn thấy. Năm 2021 Codecov, một dịch vụ đo độ phủ mã dùng trong hàng nghìn pipeline CI, công bố đúng kịch bản này: kẻ tấn công sửa script Bash Uploader của họ từ ngày 31/01; suốt hai tháng sau, mọi job CI chạy <code>curl … | bash</code> đồng thời gửi luôn biến môi trường — token, khoá, thông tin đăng nhập — cho kẻ tấn công. Thay đổi bị phát hiện ngày 01/04 nhờ một khách hàng so tổng kiểm (checksum) của script với số công bố trên GitHub, và được công bố ngày 15/04/2021. Khách hàng đó đã làm đúng một bước mà mọi người khác bỏ qua:'}</p>
${B_CURL_AN_TOAN}
<p>${en ? 'The same check done for real on the Node.js 22.21.1 download used in this lesson’s lab image — and what happens when one byte is changed:' : 'Cùng phép kiểm đó làm thật với bản tải Node.js 22.21.1 dùng trong image lab của bài — và chuyện gì xảy ra khi chỉ một byte bị đổi:'}</p>
${O_SHA}
<p>${en
    ? 'A checksum from the <em>same</em> server only proves the download was not damaged; it protects against a tampered mirror, not a hacked origin. Package managers (brew, winget, apt) add signatures and review on top, which is why they are the first choice above.'
    : 'Tổng kiểm lấy từ <em>cùng</em> máy chủ chỉ chứng minh file tải về không hỏng; nó chống được bản sao (mirror) bị sửa, không chống được máy chủ gốc bị chiếm. Trình quản lý gói (brew, winget, apt) thêm chữ ký và khâu duyệt lên trên, nên chúng là lựa chọn đầu tiên ở phần cài đặt.'}</p>

<h3>${en ? '🧪 Practice (30 minutes)' : '🧪 Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Install the six tools; run <code>tao-ch3.sh</code> in labflow-mini; reproduce the grep vs rg comparison on your machine and note your times.' : 'Cài sáu công cụ; chạy <code>tao-ch3.sh</code> trong labflow-mini; làm lại phép so grep với rg trên máy bạn và ghi thời gian của mình.'}</li>
<li>${en ? 'With rg only: list every <code>import</code> of <code>user.service.js</code>; count lines containing <code>assert</code> per test file; show 2 lines of context around <code>err.status = 404</code>.' : 'Chỉ dùng rg: liệt kê mọi chỗ <code>import</code> từ <code>user.service.js</code>; đếm số dòng chứa <code>assert</code> theo từng file test; hiện 2 dòng ngữ cảnh quanh <code>err.status = 404</code>.'}</li>
<li>${en ? 'Prove to yourself that <code>.env</code> is invisible to <code>rg DB_URL</code> and visible to <code>rg -uu DB_URL</code>.' : 'Tự chứng minh <code>.env</code> vô hình với <code>rg DB_URL</code> và hiện ra với <code>rg -uu DB_URL</code>.'}</li>
<li>${en ? 'Add the fzf block to <code>dev.sh</code>; use Ctrl+R, Ctrl+T and the preview once each.' : 'Thêm khối fzf vào <code>dev.sh</code>; dùng Ctrl+R, Ctrl+T và bản xem trước mỗi thứ một lần.'}</li>
<li>${en ? 'With the server running: print <code>assignee — title</code> for every task with jq; then, from the JSON logs, the number of 4xx responses per day.' : 'Khi máy chủ đang chạy: in <code>người-làm — tiêu-đề</code> cho mọi task bằng jq; rồi từ log JSON, đếm số phản hồi 4xx theo từng ngày.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'every answer is one command line; your 4xx count for 23/11 is 38; you can explain why each rg result is not polluted by <code>node_modules</code>.' : 'mỗi câu trả lời là một dòng lệnh; số 4xx của ngày 23/11 bạn đếm được là 38; bạn giải thích được vì sao kết quả rg không lẫn <code>node_modules</code>.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ripgrep (rg)</span><span class="v">${en ? 'Recursive search that respects .gitignore; the engine behind VS Code search.' : 'Tìm đệ quy tôn trọng .gitignore; bộ máy của ô tìm trong VS Code.'}</span></div>
  <div class="kv"><span class="k">-uu</span><span class="v">${en ? 'rg: also search hidden and ignored files (audits, secrets).' : 'rg: tìm cả file ẩn và file bị ignore (kiểm tra, tìm bí mật).'}</span></div>
  <div class="kv"><span class="k">fd</span><span class="v">${en ? 'find by file name with the same ignore rules; -x/-X run commands.' : 'Tìm theo tên file với cùng luật bỏ qua; -x/-X chạy lệnh.'}</span></div>
  <div class="kv"><span class="k">fzf</span><span class="v">${en ? 'Interactive fuzzy filter for any list; Ctrl+R, Ctrl+T, Alt+C.' : 'Bộ lọc mờ tương tác cho mọi danh sách; Ctrl+R, Ctrl+T, Alt+C.'}</span></div>
  <div class="kv"><span class="k">bat</span><span class="v">${en ? 'cat with highlighting, line ranges, -A for invisible characters.' : 'cat có tô màu, khoảng dòng, -A hiện ký tự vô hình.'}</span></div>
  <div class="kv"><span class="k">${en ? 'jq filter' : 'Bộ lọc jq'}</span><span class="v">${en ? 'Expression from JSON to JSON, chained with |; -r raw, -c compact, -s slurp.' : 'Biểu thức từ JSON ra JSON, nối bằng |; -r chuỗi trần, -c gọn, -s nuốt cả.'}</span></div>
  <div class="kv"><span class="k">JSON lines</span><span class="v">${en ? 'One JSON object per line; common log format.' : 'Mỗi dòng một object JSON; dạng log phổ biến.'}</span></div>
  <div class="kv"><span class="k">Checksum</span><span class="v">${en ? 'Hash compared with the published value before running a download.' : 'Giá trị băm so với số được công bố trước khi chạy file tải về.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'rg and fd search what you wrote: they skip ignored, hidden and binary files — and for audits you must turn that off (-uu).' : 'rg và fd tìm thứ bạn viết: bỏ qua file bị ignore, ẩn và nhị phân — và khi kiểm tra bảo mật phải tắt điều đó (-uu).'}</li>
<li>${en ? 'Check a sample before reporting a count; anchor loose patterns; give rg a path in scripts; use \${1} and --sort path.' : 'Xem mẫu trước khi báo con số; neo mẫu lỏng; trong script đưa đường dẫn cho rg; dùng \${1} và --sort path.'}</li>
<li>${en ? 'fd -x with echo first for batch work; fzf turns any list into a picker; bat -A shows CRLF.' : 'fd -x kèm echo trước khi làm hàng loạt; fzf biến mọi danh sách thành bộ chọn; bat -A lộ CRLF.'}</li>
<li>${en ? 'jq: . .field .[] select map group_by @tsv; -s for whole-file questions; “parse error” → check it is JSON.' : 'jq: . .field .[] select map group_by @tsv; -s cho câu hỏi trên cả file; “parse error” ⇒ kiểm xem có phải JSON.'}</li>
<li>${en ? 'Install from package managers; never curl | bash unread — Codecov 2021.' : 'Cài qua trình quản lý gói; không curl | bash khi chưa đọc — vụ Codecov 2021.'}</li>
</ul>
${tl('https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md', '🔎', 'ripgrep — User Guide', en ? 'Ignore rules, types, replacements, -u levels' : 'Luật bỏ qua, kiểu file, thay thế, các mức -u')}
${tl('https://github.com/sharkdp/fd', '📁', 'fd — README', en ? 'Placeholders {} {.} {/}, -x/-X, time filters' : 'Chỗ giữ {} {.} {/}, -x/-X, lọc theo thời gian')}
${tl('https://github.com/junegunn/fzf', '🧭', 'fzf — README', en ? 'Shell integration, FZF_* variables, preview' : 'Tích hợp shell, biến FZF_*, xem trước')}
${tl('https://jqlang.org/manual/', '🧩', 'jq Manual', en ? 'Filters, select, map, group_by, @tsv, -s' : 'Bộ lọc, select, map, group_by, @tsv, -s')}
${tl('https://about.codecov.io/security-update/', '🛡', 'Codecov — Security update (April 2021)', en ? 'Timeline of the modified Bash Uploader' : 'Diễn biến vụ Bash Uploader bị sửa')}
</div>
`;

/* ═════════════ 3.3 — tmux, ô chia Windows Terminal, lịch sử chứa mật khẩu ═════════════ */
const O_TMUX_LS = out("$ tmux new-session -d -s GEAR-12 -c ~/do-nghe/gear-mini\n\n$ tmux new-session -d -s labflow -c ~/do-nghe/labflow-mini\n\n$ tmux ls\nGEAR-12: 1 windows (created …)\nlabflow: 1 windows (created …)\n\n$ tmux new-window -t labflow -n log; tmux list-windows -t labflow\n0: bash- (1 panes) [80x24] [layout b25e,80x24,0,0,1] @1\n1: log* (1 panes) [80x24] [layout b25f,80x24,0,0,2] @2 (active)\n\n$ tmux kill-session -t GEAR-12; tmux ls\nlabflow: 2 windows (created …)\n");
const B_DEV_TMUX = bash("#!/usr/bin/env bash\n# dev-tmux.sh — mở (hoặc quay lại) phiên tmux \"labflow\": máy chủ | test | lệnh tay\nset -euo pipefail\nS=labflow\nD=${1:-$HOME/do-nghe/labflow-mini}\nP=${PORT:-41300}\nif ! tmux has-session -t \"$S\" 2>/dev/null; then\n  # -P -F '#{pane_id}' in ra mã ô (%3, %4…) — mã này KHÔNG đổi khi chia thêm ô, chỉ số 0/1/2 thì có\n  may=$(tmux new-session -d -s \"$S\" -n dev -c \"$D\" -P -F '#{pane_id}')\n  test=$(tmux split-window -h -t \"$may\" -c \"$D\" -P -F '#{pane_id}')\n  tay=$(tmux split-window -v -t \"$may\" -c \"$D\" -P -F '#{pane_id}')\n  tmux send-keys -t \"$may\"  \"PORT=$P npm run dev\" Enter\n  tmux send-keys -t \"$test\" \"node --test --watch\" Enter\n  tmux send-keys -t \"$tay\"  \"sleep 2; curl -s localhost:$P/tasks | jq -c '.[] | {id, status}'\" Enter\n  tmux select-pane -t \"$tay\"\nfi\n# Đang ở trong tmux thì chuyển phiên, chưa thì gắn vào\nif [ -n \"${TMUX:-}\" ]; then tmux switch-client -t \"$S\"; else tmux attach -t \"$S\"; fi\n");
const O_TMUX_LAYOUT = out("sv@may-sv:~/do-nghe/labflow-mini$ PORT=41300 npm run dev    │sv@may-sv:~/do-nghe/labflow-mini$ node --test --watch\n                                                            │✔ formatDueDate doi yyyy-mm-dd thanh dd/mm/yyyy (0.49175ms)\n> labflow-mini@1.0.0 dev                                    │✔ listTasks loc theo status (0.177565ms)\n> node --watch src/server.js                                │✔ createTask bat buoc co title (0.869705ms)\n                                                            │ℹ tests 3\nlabflow-mini on http://localhost:41300                      │ℹ suites 0\n                                                            │ℹ pass 3\n                                                            │ℹ fail 0\n                                                            │ℹ cancelled 0\n                                                            │ℹ skipped 0\n                                                            │ℹ todo 0\n                                                            │ℹ duration_ms 135.18112\n                                                            │\n────────────────────────────────────────────────────────────\nsleep 2; curl -s localhost:41300/tasks | jq -c '.[] | {id, s│\ntatus}'                                                     │\nsv@may-sv:~/do-nghe/labflow-mini$ sleep 2; curl -s localhost│\n:41300/tasks | jq -c '.[] | {id, status}'                   │\n{\"id\":1,\"status\":\"TODO\"}                                    │\n{\"id\":2,\"status\":\"DOING\"}                                   │\n{\"id\":3,\"status\":\"TODO\"}                                    │\nsv@may-sv:~/do-nghe/labflow-mini$                           │\n                                                            │\n                                                            │\n                                                            │\n");
const O_TMUX_TEST_DO = out("✖ formatDueDate doi yyyy-mm-dd thanh dd/mm/yyyy (1.416995ms\n)\n  AssertionError [ERR_ASSERTION]: Expected values to be str\nictly equal:\n  actual expected\n  '012/012/2026'\n      at TestContext.<anonymous> (file:///home/sv/do-nghe/l\nabflow-mini/test/task.service.test.js:7:10)\n      at Test.runInAsyncScope (node:async_hooks:214:14)\n      at Test.run (node:internal/test_runner/test:1047:25)\n      at Test.start (node:internal/test_runner/test:944:17)\n      at startSubtestAfterBootstrap (node:internal/test_run\nner/harness:296:17)\n      at process.processTicksAndRejections (node:internal/p\nrocess/task_queues:105:5) {\n    generatedMessage: true,\n    code: 'ERR_ASSERTION',\n    actual: '12/01/2026',\n    expected: '01/12/2026',\n    operator: 'strictEqual',\n    diff: 'simple'\n  }\n");
const B_TMUX_CONF = bash("# ~/.tmux.conf — bản tối thiểu cho dev (tmux 3.x)\nset -g mouse on                      # cuộn, chọn ô, kéo viền bằng chuột\nset -g history-limit 20000           # scrollback mỗi ô (mặc định 2000)\nset -g base-index 1                  # cửa sổ đánh số từ 1, khớp hàng phím số\nsetw -g pane-base-index 1\nset -g renumber-windows on           # đóng cửa sổ 2 thì 3 thành 2\nset -sg escape-time 10               # Esc trong vim không bị trễ\n# chia ô mở đúng thư mục đang đứng; | và - dễ nhớ hơn % và \"\nbind | split-window -h -c \"#{pane_current_path}\"\nbind - split-window -v -c \"#{pane_current_path}\"\nbind c new-window -c \"#{pane_current_path}\"\nbind r source-file ~/.tmux.conf \\; display \"da nap lai ~/.tmux.conf\"\n");
const O_TMUX_SHOW = out("$ tmux show -g history-limit; tmux show -g base-index; tmux show -g mouse\nhistory-limit 20000\nbase-index 1\nmouse on\n");
const O_HIST_BASH = out("sv@may-sv:~$ echo $HISTCONTROL\nignoreboth\nsv@may-sv:~$ export DB_PASSWORD=S3cret-Prod-01\nsv@may-sv:~$  export DB_PASSWORD=S3cret-Prod-02\nsv@may-sv:~$ history | tail -3\n    2  echo $HISTCONTROL\n    3  export DB_PASSWORD=S3cret-Prod-01\n    4  history | tail -3\nsv@may-sv:~$\n$ grep -n DB_PASSWORD ~/.bash_history\n3:export DB_PASSWORD=S3cret-Prod-01\n");
const O_HIST_ZSH = out("# zsh với cấu hình như /etc/zshrc của macOS (HISTFILE, SAVEHIST)\nsv@may-sv ~ % setopt | grep -i histignorespace; echo \"(trống = TẮT)\"\n(trống = TẮT)\nsv@may-sv ~ %  export DB_PASSWORD=S3cret-Prod-03\nsv@may-sv ~ %\n$ grep DB_PASSWORD ~/.zsh_history\n export DB_PASSWORD=S3cret-Prod-03\n# thêm \"setopt HIST_IGNORE_SPACE\" vào ~/.zshrc, mở zsh mới, gõ lại\nsv@may-sv ~ %  export DB_PASSWORD=S3cret-Prod-04\nsv@may-sv ~ %\n$ grep DB_PASSWORD ~/.zsh_history\n export DB_PASSWORD=S3cret-Prod-03\n");
const O_PS_HIST = out("PS /> $env:DB_PASSWORD = \"S3cret-Prod-07\"\nPS /> $env:API_URL = \"http://localhost:41300\"\nPS /> (Get-History).Count\n7\nPS /> Get-Content (Get-PSReadLineOption).HistorySavePath\nClear-Host\n$PSVersionTable.PSVersion.ToString(); (Get-Module PSReadLine).Version.ToString()\n$PROFILE\nSet-Alias gs \"git status -sb\"\ngs\n$env:API_URL = \"http://localhost:41300\"\n(Get-History).Count\nGet-Content (Get-PSReadLineOption).HistorySavePath\nPS />\n");
const O_READ_S = out("sv@may-sv:~$ read -rsp \"Mat khau DB: \" DB_PASSWORD; echo; export DB_PASSWORD\nMat khau DB:\nsv@may-sv:~$ echo \"do dai: ${#DB_PASSWORD}\"\ndo dai: 14\nsv@may-sv:~$ cd ~/do-nghe/labflow-mini; set -a; . ./.env; set +a; echo \"${DB_URL%%:*}... J\nWT dai ${#JWT_SECRET}\"\npostgres... JWT dai 18\nsv@may-sv:~/do-nghe/labflow-mini$ history | tail -4\n   35  read -rsp \"Mat khau DB: \" DB_PASSWORD; echo; export DB_PASSWORD\n   36  echo \"do dai: ${#DB_PASSWORD}\"\n   37  cd ~/do-nghe/labflow-mini; set -a; . ./.env; set +a; echo \"${DB_URL%%:*}... JWT dai\n ${#JWT_SECRET}\"\n   38  history | tail -4\nsv@may-sv:~/do-nghe/labflow-mini$\n");
const O_PS_ARGS = out("$ id -u; ps -eo pid,user,args | grep -i [p]assword\n4242\n      1 ubuntu   java -jar target/gear-mini-0.0.1-SNAPSHOT.jar --server.port=41808 --spring.datasource.password=S3cret-Prod-05\n$ tr \"\\0\" \" \" < /proc/1/cmdline\njava -jar target/gear-mini-0.0.1-SNAPSHOT.jar --server.port=41808 --spring.datasource.password=S3cret-Prod-05 \n$ cat /proc/1/environ\ncat: /proc/1/environ: Permission denied\nexit=1\n-r--r--r--+ 1 ubuntu ubuntu 0 Nov 23 21:04 /proc/1/cmdline\n-r--------+ 1 ubuntu ubuntu 0 Nov 23 21:04 /proc/1/environ\n");
const O_SCROLLBACK = out("# đã chạy: cat .env, rồi bấm Ctrl+L — màn hình sạch:\nsv@may-sv:~/do-nghe/labflow-mini$\n$ tmux capture-pane -p -S - -t sb | grep S3cret\nDB_URL=postgres://app:S3cret-Dev@localhost:5432/labflow\n# gõ lệnh clear (không phải Ctrl+L) rồi tìm lại:\n$ tmux capture-pane -p -S - -t sb | grep -c S3cret\n0\n");

const PHIM_TMUX = (en) => `<table>
<thead><tr><th>${en ? 'Action' : 'Việc'}</th><th>${en ? 'Keys (after the prefix Ctrl+B)' : 'Phím (sau tiền tố Ctrl+B)'}</th><th>${en ? 'Command form' : 'Dạng lệnh'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Split left | right' : 'Chia trái | phải'}</td><td><code>%</code></td><td><code>tmux split-window -h</code></td></tr>
<tr><td>${en ? 'Split top / bottom' : 'Chia trên / dưới'}</td><td><code>"</code></td><td><code>tmux split-window -v</code></td></tr>
<tr><td>${en ? 'Move between panes' : 'Đi giữa các ô'}</td><td><code>← ↑ → ↓</code></td><td><code>tmux select-pane -L/-U/-R/-D</code></td></tr>
<tr><td>${en ? 'Zoom a pane to full window and back' : 'Phóng một ô ra cả cửa sổ rồi thu lại'}</td><td><code>z</code></td><td><code>tmux resize-pane -Z</code></td></tr>
<tr><td>${en ? 'Cycle layouts' : 'Đổi lần lượt các bố cục'}</td><td><code>Space</code></td><td><code>tmux select-layout -n</code></td></tr>
<tr><td>${en ? 'New window / next / previous / number' : 'Cửa sổ mới / sau / trước / theo số'}</td><td><code>c</code> / <code>n</code> / <code>p</code> / <code>0…9</code></td><td><code>tmux new-window</code></td></tr>
<tr><td>${en ? 'Rename window / session' : 'Đổi tên cửa sổ / phiên'}</td><td><code>,</code> / <code>$</code></td><td><code>tmux rename-window</code></td></tr>
<tr><td>${en ? 'Detach (everything keeps running)' : 'Tách ra (mọi thứ vẫn chạy)'}</td><td><code>d</code></td><td><code>tmux detach</code></td></tr>
<tr><td>${en ? 'Choose a session from a list' : 'Chọn phiên từ danh sách'}</td><td><code>s</code></td><td><code>tmux ls</code> + <code>tmux attach -t …</code></td></tr>
<tr><td>${en ? 'Scroll / search the scrollback (q to leave)' : 'Cuộn / tìm trong scrollback (q để thoát)'}</td><td><code>[</code> ${en ? 'then' : 'rồi'} <code>?</code> ${en ? 'or' : 'hoặc'} <code>/</code></td><td><code>tmux copy-mode</code></td></tr>
<tr><td>${en ? 'Close a pane' : 'Đóng một ô'}</td><td><code>x</code></td><td><code>tmux kill-pane</code></td></tr>
<tr><td>${en ? 'Show every key' : 'Xem mọi phím'}</td><td><code>?</code></td><td><code>tmux list-keys</code></td></tr>
</tbody>
</table>`;

const PHIM_WT = [
  ['New pane to the right / below', 'Ô mới bên phải / bên dưới', 'Alt+Shift+= / Alt+Shift+-', '—'],
  ['Duplicate the pane (direction chosen automatically)', 'Nhân đôi ô (tự chọn hướng)', 'Alt+Shift+D', '—'],
  ['Move focus between panes', 'Chuyển giữa các ô', 'Alt+← ↑ → ↓', '—'],
  ['Resize the pane', 'Đổi cỡ ô', 'Alt+Shift+← ↑ → ↓', '—'],
  ['Close the pane', 'Đóng ô', 'Ctrl+Shift+W', '—'],
  ['Command palette (search any action)', 'Bảng lệnh (tìm mọi thao tác)', 'Ctrl+Shift+P', '—'],
];

const L3 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Terminal' : 'Chương 3 · Terminal'}</span>
<h2>${en ? '3.3 — Sessions and panes: tmux basics or Windows Terminal panes' : '3.3 — Phiên và ô chia: tmux cơ bản hoặc chia ô Windows Terminal'}</h2>
<p class="lead">${en
    ? 'A normal working day on a full-stack ticket needs four terminals at once: the backend, the test watcher, a place to type <code>curl</code>, and a log. Six tabs later you no longer know which one runs what, and when the SSH connection to the test server drops in the middle of a data import, the import dies with it. This lesson builds one screen with everything in view, reproducible by a script, that survives a closed laptop — then deals with the uncomfortable side of terminals: everything you type and see is recorded somewhere.'
    : 'Một ngày làm ticket full-stack bình thường cần bốn terminal cùng lúc: backend, bộ chạy test tự động, một chỗ để gõ <code>curl</code>, và log. Sáu tab sau bạn chẳng còn nhớ tab nào chạy gì, và khi kết nối SSH tới máy test rớt giữa lúc đang nạp dữ liệu, việc nạp chết theo. Bài này dựng một màn hình thấy hết mọi thứ, dựng lại được bằng script, sống sót khi gập laptop — rồi xử lý mặt khó chịu của terminal: mọi thứ bạn gõ và nhìn thấy đều được ghi lại ở đâu đó.'}</p>

<h3>${en ? 'The tmux model: server, sessions, windows, panes' : 'Mô hình tmux: máy chủ, phiên, cửa sổ, ô'}</h3>
<div class="lz-stack">
  <div class="lz-layer"><strong>${en ? 'tmux server' : 'Máy chủ tmux'}</strong> — ${en ? 'a background process that owns all your shells. Closing the terminal window or losing SSH does <em>not</em> stop it.' : 'một tiến trình nền giữ mọi shell của bạn. Đóng cửa sổ terminal hay rớt SSH <em>không</em> làm nó dừng.'}</div>
  <div class="lz-layer"><strong>${en ? 'Session' : 'Phiên (session)'}</strong> — ${en ? 'one per project or ticket: <code>labflow</code>, <code>GEAR-12</code>. You attach to it and detach from it.' : 'mỗi dự án hay ticket một phiên: <code>labflow</code>, <code>GEAR-12</code>. Bạn gắn vào (attach) và tách ra (detach).'}</div>
  <div class="lz-layer"><strong>${en ? 'Window' : 'Cửa sổ (window)'}</strong> — ${en ? 'like a browser tab inside the session: <code>dev</code>, <code>log</code>, <code>db</code>.' : 'giống tab trình duyệt trong phiên: <code>dev</code>, <code>log</code>, <code>db</code>.'}</div>
  <div class="lz-layer"><strong>${en ? 'Pane' : 'Ô (pane)'}</strong> — ${en ? 'a window split into rectangles, each running its own shell.' : 'một cửa sổ chia thành các ô chữ nhật, mỗi ô chạy một shell riêng.'}</div>
</div>
<p>${en
    ? 'Every key is “prefix, then key”: press <code>Ctrl+B</code>, release, press the key. Each key also exists as a command, which is what makes tmux scriptable:'
    : 'Mọi phím đều theo kiểu “tiền tố rồi phím”: bấm <code>Ctrl+B</code>, thả ra, rồi bấm phím. Phím nào cũng có dạng lệnh tương ứng, nhờ đó tmux viết script được:'}</p>
${PHIM_TMUX(en)}
<p>${en ? 'Sessions from the command line (real output; creation dates shortened to “…”):' : 'Làm với phiên từ dòng lệnh (output thật; ngày giờ tạo được rút thành “…”):'}</p>
${O_TMUX_LS}
<p>${en
    ? 'Why detaching matters, in one sentence: when the terminal closes, the shell inside it receives a hang-up signal and takes its children down, but the shells inside tmux belong to the tmux server, not to your terminal. The signal mechanics (SIGHUP, <code>nohup</code>, <code>disown</code>) are explained in'
    : 'Vì sao tách ra lại quan trọng, gói trong một câu: khi terminal đóng, shell bên trong nhận tín hiệu “cúp máy” và kéo các tiến trình con chết theo, còn shell trong tmux thuộc về máy chủ tmux, không thuộc terminal của bạn. Cơ chế tín hiệu (SIGHUP, <code>nohup</code>, <code>disown</code>) được giải thích ở'} ${bai('linux-bash', 'lnx-5-4-job-chay-nen', 'Linux &amp; Bash 5.4')}${en ? ', and the SSH routine (<code>tmux new -A -s work</code> right after logging in) in' : ', còn thói quen khi SSH (<code>tmux new -A -s work</code> ngay sau khi đăng nhập) ở'} ${bai('linux-bash', 'lnx-9-3-ssh', 'Linux &amp; Bash 9.3')}.</p>

<h3>${en ? 'A dev layout as a script' : 'Bố cục làm việc viết thành script'}</h3>
<p>${en
    ? 'Building the same three panes by hand every morning is exactly the kind of repetition this chapter removes. The script creates the session only if it does not exist yet, starts the server, the test watcher and a first request, then attaches — so running it again simply takes you back:'
    : 'Sáng nào cũng tự tay dựng ba ô giống hệt nhau chính là kiểu lặp lại mà chương này muốn bỏ. Script chỉ tạo phiên khi nó chưa có, khởi động máy chủ, bộ chạy test và một request đầu tiên, rồi gắn vào — nên chạy lại lần nữa chỉ đơn giản là đưa bạn trở về:'}</p>
${B_DEV_TMUX}
<p>${en ? 'The real screen right after <code>~/bin/dev-tmux.sh</code> (120 × 25, reconstructed from each pane with <code>tmux capture-pane</code>):' : 'Màn hình thật ngay sau <code>~/bin/dev-tmux.sh</code> (120 × 25, ghép lại từ từng ô bằng <code>tmux capture-pane</code>):'}</p>
${O_TMUX_LAYOUT}
<p>${en
    ? 'The command in the bottom pane appears twice because tmux typed it before bash had drawn its prompt — harmless. Now the point of the layout: in the bottom pane, a one-character mistake in <code>format.js</code> (swapping day and month). Without touching the other panes, the test pane on the right re-ran on its own:'
    : 'Lệnh ở ô dưới hiện hai lần vì tmux gõ nó trước khi bash kịp vẽ dấu nhắc — vô hại. Giờ tới giá trị của bố cục: ở ô dưới, sửa sai một chỗ trong <code>format.js</code> (đảo ngày với tháng). Không cần đụng tới ô nào khác, ô test bên phải tự chạy lại:'}</p>
${O_TMUX_TEST_DO}
<div class="pitfall co-tieu-de"><p><strong>${en ? 'Pane numbers change when you split — use pane IDs' : 'Số thứ tự ô đổi khi chia thêm — hãy dùng mã ô'}</strong></p><p>${en
    ? 'The first version of this script used <code>-t labflow:dev.1</code> and <code>dev.2</code>. tmux numbers panes by <em>position</em>, so after the second split the right pane silently became number 2 and the <code>curl</code> line was typed into the test watcher. <code>-P -F \'#{pane_id}\'</code> returns IDs like <code>%3</code> that never change for the life of the pane. The same trap bit a second time when the screen above was captured, with a hand-written <code>set -- $(tmux list-panes …)</code> — list order is position order too.'
    : 'Bản đầu của script này dùng <code>-t labflow:dev.1</code> và <code>dev.2</code>. tmux đánh số ô theo <em>vị trí</em>, nên sau lần chia thứ hai ô bên phải lặng lẽ thành số 2 và dòng <code>curl</code> bị gõ vào ô chạy test. <code>-P -F \'#{pane_id}\'</code> trả về mã dạng <code>%3</code> không bao giờ đổi trong suốt đời của ô. Cái bẫy này cắn lần thứ hai ngay lúc chụp màn hình phía trên, khi viết tay <code>set -- $(tmux list-panes …)</code> — thứ tự danh sách cũng là thứ tự vị trí.'}</p></div>

<h3>${en ? 'A minimal ~/.tmux.conf' : 'Một ~/.tmux.conf tối thiểu'}</h3>
${B_TMUX_CONF}
${O_TMUX_SHOW}
<p>${en
    ? 'Prefix <code>r</code> reloads the file after edits. With <code>mouse on</code> you can scroll a pane with the wheel and drag borders; for keyboard search in old output use prefix <code>[</code>, then <code>?</code> and a word. Resist the urge to install twenty plugins on day one: a config you understand line by line is one you can also use on a server.'
    : 'Tiền tố rồi <code>r</code> nạp lại file sau khi sửa. Có <code>mouse on</code> bạn cuộn được từng ô bằng bánh xe chuột và kéo viền; để tìm bằng bàn phím trong output cũ thì dùng tiền tố rồi <code>[</code>, rồi <code>?</code> và một từ. Đừng vội cài hai chục plugin ngay ngày đầu: một file cấu hình bạn hiểu từng dòng là file bạn dùng được cả trên máy chủ.'}</p>
<div class="pitfall co-tieu-de"><p><strong>synchronize-panes</strong></p><p>${en
    ? '<code>setw synchronize-panes on</code> sends every key to all panes of the window — handy to run the same check on three servers, catastrophic when one of those panes is production and you type <code>rm</code>. If you use it, turn it off immediately after (<code>setw synchronize-panes off</code>), and never with a production pane open.'
    : '<code>setw synchronize-panes on</code> gửi mọi phím tới tất cả các ô của cửa sổ — tiện để chạy cùng một lệnh kiểm trên ba máy chủ, thảm hoạ khi một trong các ô đó là production và bạn gõ <code>rm</code>. Nếu dùng, tắt ngay sau đó (<code>setw synchronize-panes off</code>), và đừng bao giờ dùng khi có một ô production đang mở.'}</p></div>

<h3>${en ? 'On Windows: panes in Windows Terminal' : 'Trên Windows: chia ô trong Windows Terminal'}</h3>
<p>${en
    ? 'tmux runs inside WSL2 and over SSH; in native PowerShell, Windows Terminal gives you panes (but no detach — closing the window ends the shells). The default key bindings, per Microsoft Learn (not runnable on the Linux machine used to write this lesson):'
    : 'tmux chạy trong WSL2 và qua SSH; còn với PowerShell gốc của Windows, Windows Terminal cho bạn chia ô (nhưng không có tách ra — đóng cửa sổ là shell tắt theo). Phím mặc định theo Microsoft Learn (không chạy được trên máy Linux dùng để soạn bài):'}</p>
${phim(PHIM_WT, !en)}
<p>${en
    ? 'The layout can be scripted too: <code>wt -d . ; split-pane -V -d . ; split-pane -H -d .</code> from cmd opens a tab with three panes in the current folder (in PowerShell, escape each <code>;</code> as <code>&#96;;</code>). VS Code’s own split (<code>Ctrl+Shift+5</code>, lesson 3.1) is the simplest option of all when you are already in the editor.'
    : 'Bố cục cũng viết thành lệnh được: <code>wt -d . ; split-pane -V -d . ; split-pane -H -d .</code> chạy từ cmd mở một tab ba ô ở thư mục hiện tại (trong PowerShell phải thoát mỗi dấu <code>;</code> thành <code>&#96;;</code>). Chia đôi ngay trong VS Code (<code>Ctrl+Shift+5</code>, bài 3.1) là cách đơn giản nhất khi bạn đang ở trong editor.'}</p>

<h3>${en ? '🔐 Safety: your history remembers the password you typed' : '🔐 An toàn: lịch sử nhớ cả mật khẩu bạn đã gõ'}</h3>
<p>${en
    ? 'Everything in this chapter that makes the terminal convenient — history, scrollback, the process list — also stores secrets if you put them on the command line. Measure it before you trust any trick. <strong>bash on Ubuntu</strong> (default <code>HISTCONTROL=ignoreboth</code>):'
    : 'Mọi thứ trong chương này làm terminal tiện lợi — lịch sử, scrollback, danh sách tiến trình — cũng sẽ cất giữ bí mật nếu bạn đặt chúng trên dòng lệnh. Hãy đo trước khi tin bất kỳ mẹo nào. <strong>bash trên Ubuntu</strong> (mặc định <code>HISTCONTROL=ignoreboth</code>):'}</p>
${O_HIST_BASH}
<p>${en
    ? 'The command typed with a leading space (<code>Prod-02</code>) was not recorded; the normal one (<code>Prod-01</code>) is now in a plain-text file in your home folder. This only works because Ubuntu’s default <code>~/.bashrc</code> sets <code>ignoreboth</code> — Fedora’s does not, as measured in'
    : 'Lệnh gõ có dấu cách ở đầu (<code>Prod-02</code>) không bị ghi; lệnh bình thường (<code>Prod-01</code>) giờ nằm trong một file chữ thường ngay trong thư mục nhà. Mẹo này chạy được chỉ vì <code>~/.bashrc</code> mặc định của Ubuntu đặt <code>ignoreboth</code> — của Fedora thì không, như đã đo ở'} ${bai('linux-bash', 'lnx-8-4-tuy-bien-shell', 'Linux &amp; Bash 8.4')}. ${en ? '<strong>zsh</strong>, configured like the default <code>/etc/zshrc</code> of macOS:' : '<strong>zsh</strong>, cấu hình giống <code>/etc/zshrc</code> mặc định của macOS:'}</p>
${O_HIST_ZSH}
<p>${en
    ? 'zsh saves the leading-space command unless you add <code>setopt HIST_IGNORE_SPACE</code> — then <code>Prod-04</code> stays out. <strong>PowerShell</strong> works differently: PSReadLine 2.3.5 refuses to write lines containing words such as <code>password</code>, <code>token</code>, <code>secret</code>, <code>apikey</code> to its history file (same session as lesson 3.1):'
    : 'zsh vẫn lưu lệnh có dấu cách đầu trừ khi bạn thêm <code>setopt HIST_IGNORE_SPACE</code> — khi đó <code>Prod-04</code> mới thoát. <strong>PowerShell</strong> thì khác: PSReadLine 2.3.5 từ chối ghi vào file lịch sử những dòng chứa các từ như <code>password</code>, <code>token</code>, <code>secret</code>, <code>apikey</code> (cùng phiên với bài 3.1):'}</p>
${O_PS_HIST}
<p>${en
    ? 'The <code>DB_PASSWORD</code> line is missing from the file — but it is still in the session (<code>(Get-History).Count</code> was 7, counting it), and a secret in a variable named <code>DB_PASS</code> or <code>MAT_KHAU</code> would be saved. Every shell has a different rule; none of them is a safety net.'
    : 'Dòng <code>DB_PASSWORD</code> không có trong file — nhưng vẫn nằm trong phiên (<code>(Get-History).Count</code> ra 7, có tính dòng đó), và một bí mật đặt trong biến tên <code>DB_PASS</code> hay <code>MAT_KHAU</code> thì vẫn bị lưu. Mỗi shell một luật khác nhau; không luật nào là lưới an toàn.'}</p>

<h3>${en ? 'Better: never put the secret on the command line' : 'Tốt hơn: đừng bao giờ đặt bí mật lên dòng lệnh'}</h3>
<p>${en ? '<code>read -rs</code> asks for it without echo; a git-ignored <code>.env</code> loaded with <code>set -a</code> exports every variable in it. Real session — note what <code>history</code> contains:' : '<code>read -rs</code> hỏi mà không hiện chữ; file <code>.env</code> nằm trong .gitignore nạp bằng <code>set -a</code> sẽ export mọi biến trong đó. Phiên thật — để ý <code>history</code> chứa gì:'}</p>
${O_READ_S}
<p>${en
    ? 'The history shows <em>how</em> the value arrived, never the value. Tools designed for this have their own flags: <code>docker login --password-stdin</code>, <code>psql</code> reading <code>~/.pgpass</code>, <code>curl -u user</code> without the password (it prompts). Spring Boot reads <code>SPRING_DATASOURCE_PASSWORD</code> from the environment, which matters for the next measurement.'
    : 'Lịch sử chỉ cho thấy giá trị đến <em>bằng cách nào</em>, không bao giờ là giá trị. Các công cụ được thiết kế cho việc này đều có cờ riêng: <code>docker login --password-stdin</code>, <code>psql</code> đọc <code>~/.pgpass</code>, <code>curl -u user</code> không kèm mật khẩu (nó sẽ hỏi). Spring Boot đọc <code>SPRING_DATASOURCE_PASSWORD</code> từ biến môi trường, điều này quan trọng với phép đo tiếp theo.'}</p>

<h3>${en ? 'Command-line arguments are public on the machine' : 'Đối số dòng lệnh là công khai trên cả máy'}</h3>
<p>${en
    ? 'gear-mini started with the password as an argument and a token in the environment; then a <em>different</em> user (uid 4242) looked at it:'
    : 'gear-mini được khởi động với mật khẩu ở đối số và một token trong biến môi trường; rồi một người dùng <em>khác</em> (uid 4242) nhìn vào:'}</p>
${O_PS_ARGS}
<p>${en
    ? '<code>/proc/&lt;pid&gt;/cmdline</code> is readable by everyone (<code>-r--r--r--</code>); <code>environ</code> only by the owner (<code>-r--------</code>). On a shared test server or a jump host, every colleague — and every compromised account — can run <code>ps</code>. Secrets go in environment variables or files with tight permissions, never in arguments.'
    : '<code>/proc/&lt;pid&gt;/cmdline</code> ai cũng đọc được (<code>-r--r--r--</code>); <code>environ</code> chỉ chủ sở hữu đọc được (<code>-r--------</code>). Trên máy test dùng chung hay máy trung gian (jump host), mọi đồng nghiệp — và mọi tài khoản bị chiếm — đều chạy được <code>ps</code>. Bí mật đặt trong biến môi trường hoặc file có quyền chặt, không bao giờ đặt ở đối số.'}</p>

<h3>${en ? 'Scrollback keeps what you printed' : 'Scrollback giữ lại thứ bạn đã in ra'}</h3>
${O_SCROLLBACK}
<p>${en
    ? '<code>Ctrl+L</code> only pushes the screen up; the line with the password is still one scroll away — and in any screen recording or shared screen during a meeting. The <code>clear</code> command also wiped tmux’s scrollback here (it sends an extra “erase saved lines” code); <code>tmux clear-history</code> does it explicitly. Better still, do not <code>cat .env</code> at all: <code>rg -c . .env</code> tells you it has content, <code>cut -d= -f1 .env</code> lists the names without values.'
    : '<code>Ctrl+L</code> chỉ đẩy màn hình lên; dòng chứa mật khẩu vẫn cách bạn một lần cuộn — và nằm trong mọi bản ghi màn hình hay màn hình chia sẻ trong cuộc họp. Lệnh <code>clear</code> thì xoá luôn scrollback của tmux ở đây (nó gửi thêm mã “xoá các dòng đã lưu”); <code>tmux clear-history</code> làm việc đó một cách tường minh. Tốt hơn hết là đừng <code>cat .env</code>: <code>rg -c . .env</code> cho biết file có nội dung, <code>cut -d= -f1 .env</code> liệt kê tên biến mà không lộ giá trị.'}</p>
<div class="callout warn"><p>${en
    ? '<strong>If a real secret already went into history:</strong> remove it (<code>history -d &lt;number&gt;</code>, then edit <code>~/.bash_history</code>; zsh: edit <code>~/.zsh_history</code>; PowerShell: the file at <code>(Get-PSReadLineOption).HistorySavePath</code>) — and still treat it as leaked: <strong>rotate it</strong> and tell your lead. Deleting a line does not delete backups, synced dotfiles or screenshots.'
    : '<strong>Nếu một bí mật thật đã lỡ vào lịch sử:</strong> xoá nó (<code>history -d &lt;số&gt;</code>, rồi sửa <code>~/.bash_history</code>; zsh: sửa <code>~/.zsh_history</code>; PowerShell: file ở <code>(Get-PSReadLineOption).HistorySavePath</code>) — và vẫn coi như đã lộ: <strong>đổi nó</strong> và báo trưởng nhóm. Xoá một dòng không xoá được bản sao lưu, dotfiles đã đồng bộ hay ảnh chụp màn hình.'}</p></div>

<h3>${en ? 'The hacker’s view: the developer laptop is the target (CircleCI, 2023)' : 'Góc hacker: laptop của dev mới là mục tiêu (CircleCI, 2023)'}</h3>
<p>${en
    ? 'MITRE ATT&amp;CK files reading shell history under <strong>T1552.003 — Unsecured Credentials: Shell History</strong>: after getting in, attackers run <code>cat ~/.*history</code> before anything else, because people type passwords there. The best-documented recent case started exactly on a developer’s machine: in its incident report of 13 January 2023, CircleCI explained that malware on one engineer’s laptop stole a valid, 2FA-backed single-sign-on session, which the attacker used to reach production systems and exfiltrate customer secrets; CircleCI asked every customer to rotate all secrets stored on the platform. Whatever sits on your laptop — history files, a forgotten <code>.env</code>, a token visible in a tmux pane — is what such malware collects first.'
    : 'MITRE ATT&amp;CK xếp việc đọc lịch sử shell vào <strong>T1552.003 — Unsecured Credentials: Shell History</strong>: vào được máy rồi, kẻ tấn công chạy <code>cat ~/.*history</code> trước tiên, vì người ta hay gõ mật khẩu ở đó. Vụ gần đây được ghi chép kỹ nhất bắt đầu đúng trên máy một lập trình viên: trong báo cáo sự cố ngày 13/01/2023, CircleCI giải thích rằng mã độc trên laptop của một kỹ sư đã đánh cắp một phiên đăng nhập một lần (SSO) hợp lệ, đã qua xác thực hai lớp, rồi kẻ tấn công dùng nó vào hệ thống production và lấy cắp bí mật của khách hàng; CircleCI yêu cầu mọi khách hàng đổi toàn bộ bí mật lưu trên nền tảng. Thứ gì nằm trên laptop của bạn — file lịch sử, một <code>.env</code> bị quên, một token hiện trong ô tmux — chính là thứ loại mã độc đó gom đầu tiên.'}</p>

<h3>${en ? 'In everyday terms' : 'Liên hệ đời thường'}</h3>
<p>${en
    ? 'tmux is leaving your desk at the office exactly as it is — papers open, computer running — and sitting back down tomorrow to the same view, instead of packing everything into a bag every evening. Shell history is a dashcam: it records the whole trip, including the moment you read your PIN out loud.'
    : 'tmux giống như để nguyên bàn làm việc ở văn phòng — giấy tờ đang mở, máy đang chạy — rồi hôm sau ngồi xuống là thấy y như cũ, thay vì tối nào cũng dọn hết vào cặp. Lịch sử shell là camera hành trình: nó ghi cả chuyến đi, kể cả lúc bạn đọc to mã PIN.'}</p>

<h3>${en ? '💼 At work: long jobs on the test server' : '💼 Đi làm: việc chạy lâu trên máy test'}</h3>
<ul>
<li>${en ? 'Before any job longer than a minute over SSH — a migration, a data import, <code>mvn verify</code> of a big module — start or re-attach a session named after the ticket: <code>tmux new -A -s GEAR-12</code>. When Wi-Fi drops, you reconnect and attach; the job never noticed.' : 'Trước mọi việc dài hơn một phút qua SSH — migration, nạp dữ liệu, <code>mvn verify</code> một module lớn — mở hoặc gắn lại phiên đặt tên theo ticket: <code>tmux new -A -s GEAR-12</code>. Rớt Wi-Fi thì kết nối lại và gắn vào; việc đang chạy không hề hay biết.'}</li>
<li>${en ? 'On a shared server, check <code>tmux ls</code> before creating sessions, and kill yours when the ticket is done — forgotten sessions keep ports and memory busy for weeks.' : 'Trên máy chủ dùng chung, xem <code>tmux ls</code> trước khi tạo phiên, và tắt phiên của mình khi xong ticket — phiên bị quên giữ cổng và bộ nhớ hàng tuần liền.'}</li>
<li>${en ? 'Screen sharing in a meeting: close panes that show logs with tokens or customer data first. Many outsourcing contracts treat customer data on a shared screen as an incident.' : 'Chia sẻ màn hình trong cuộc họp: đóng trước các ô đang hiện log có token hay dữ liệu khách hàng. Nhiều hợp đồng outsourcing coi dữ liệu khách hàng lộ trên màn hình chia sẻ là một sự cố.'}</li>
</ul>

<h3>${en ? '🧪 Practice (30 minutes)' : '🧪 Thực hành (30 phút)'}</h3>
<div class="callout ok"><ol>
<li>${en ? 'Install tmux (macOS: <code>brew install tmux</code>; Windows: inside WSL2). Create, list, detach from and re-attach to a session called <code>thu</code> using only the keys from the table.' : 'Cài tmux (macOS: <code>brew install tmux</code>; Windows: trong WSL2). Tạo, liệt kê, tách ra và gắn lại một phiên tên <code>thu</code> chỉ bằng các phím trong bảng.'}</li>
<li>${en ? 'Save <code>dev-tmux.sh</code> into <code>~/bin</code>, run it, break <code>format.js</code> in the bottom pane and watch the test pane turn red; <code>git checkout src/utils/format.js</code> and watch it turn green.' : 'Lưu <code>dev-tmux.sh</code> vào <code>~/bin</code>, chạy nó, làm hỏng <code>format.js</code> ở ô dưới và nhìn ô test chuyển đỏ; <code>git checkout src/utils/format.js</code> và nhìn nó xanh lại.'}</li>
<li>${en ? 'Close the terminal window completely. Open a new one and run <code>dev-tmux.sh</code> again: you must be back in the same layout, server still running.' : 'Đóng hẳn cửa sổ terminal. Mở cửa sổ mới, chạy lại <code>dev-tmux.sh</code>: bạn phải trở về đúng bố cục cũ, máy chủ vẫn đang chạy.'}</li>
<li>${en ? 'Measure your own shell: type <code> export THU=1</code> with a leading space, exit, and grep your history file. Fix your config if it was saved.' : 'Đo shell của chính bạn: gõ <code> export THU=1</code> có dấu cách đầu, thoát, rồi grep file lịch sử. Sửa cấu hình nếu nó bị lưu.'}</li>
<li>${en ? 'Replace one place where you used to type a password with <code>read -rs</code> or a <code>.env</code> + <code>set -a</code>.' : 'Thay một chỗ bạn từng gõ mật khẩu bằng <code>read -rs</code> hoặc <code>.env</code> + <code>set -a</code>.'}</li>
</ol>
<p><strong>${en ? 'Done when:' : 'Đạt khi:'}</strong> ${en ? 'the layout comes back after closing the terminal; you can say which key or command does each step; your history file does not contain the leading-space line; no secret of yours appears in <code>ps -eo args</code>.' : 'bố cục trở lại sau khi đóng terminal; bạn nói được phím hay lệnh nào làm từng bước; file lịch sử không chứa dòng có dấu cách đầu; không bí mật nào của bạn hiện trong <code>ps -eo args</code>.'}</p></div>

<h3>${en ? '🗂 Key terms' : '🗂 Thuật ngữ trong bài'}</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">${en ? 'Session / window / pane' : 'Phiên / cửa sổ / ô'}</span><span class="v">${en ? 'tmux’s three levels: project, tab, split.' : 'Ba tầng của tmux: dự án, tab, ô chia.'}</span></div>
  <div class="kv"><span class="k">Prefix (Ctrl+B)</span><span class="v">${en ? 'Key pressed before every tmux shortcut.' : 'Phím bấm trước mọi phím tắt tmux.'}</span></div>
  <div class="kv"><span class="k">Detach / attach</span><span class="v">${en ? 'Leave a session running / return to it.' : 'Rời phiên mà nó vẫn chạy / quay lại phiên.'}</span></div>
  <div class="kv"><span class="k">pane_id</span><span class="v">${en ? 'Stable pane identifier (%3); indexes change with position.' : 'Mã ô cố định (%3); số thứ tự đổi theo vị trí.'}</span></div>
  <div class="kv"><span class="k">Scrollback</span><span class="v">${en ? 'Lines kept above the visible screen; Ctrl+L does not erase them.' : 'Các dòng giữ phía trên màn hình; Ctrl+L không xoá chúng.'}</span></div>
  <div class="kv"><span class="k">HISTCONTROL / HIST_IGNORE_SPACE</span><span class="v">${en ? 'bash / zsh settings that skip leading-space commands.' : 'Thiết lập bash / zsh bỏ qua lệnh có dấu cách đầu.'}</span></div>
  <div class="kv"><span class="k">/proc/&lt;pid&gt;/cmdline</span><span class="v">${en ? 'Arguments of a process, readable by every user.' : 'Đối số của tiến trình, mọi người dùng đều đọc được.'}</span></div>
</div>

<h3>${en ? '📌 Summary' : '📌 Tóm tắt'}</h3>
<ul>
<li>${en ? 'tmux server owns your shells: detach, close the laptop, attach again — the work goes on.' : 'Máy chủ tmux giữ shell của bạn: tách ra, gập máy, gắn lại — việc vẫn chạy.'}</li>
<li>${en ? 'Script your layout; address panes by pane_id; keep .tmux.conf short and understood.' : 'Viết script cho bố cục; gọi ô bằng pane_id; giữ .tmux.conf ngắn và hiểu từng dòng.'}</li>
<li>${en ? 'Windows Terminal: Alt+Shift+= / - / D for panes, no detach.' : 'Windows Terminal: Alt+Shift+= / - / D để chia ô, không có tách ra.'}</li>
<li>${en ? 'Leading space works on Ubuntu bash, not on default zsh; PSReadLine filters by keywords — none is a safety net.' : 'Dấu cách đầu chạy với bash Ubuntu, không chạy với zsh mặc định; PSReadLine lọc theo từ khoá — không cái nào là lưới an toàn.'}</li>
<li>${en ? 'Never type secrets as arguments (ps shows them to everyone); use read -rs, .env + set -a, --password-stdin; leaked ⇒ rotate.' : 'Đừng gõ bí mật thành đối số (ps cho mọi người thấy); dùng read -rs, .env + set -a, --password-stdin; lỡ lộ ⇒ đổi ngay.'}</li>
</ul>
${tl('https://github.com/tmux/tmux/wiki/Getting-Started', '🪟', 'tmux Wiki — Getting Started', en ? 'Sessions, windows, panes, keys, copy mode' : 'Phiên, cửa sổ, ô, phím, copy mode')}
${tl('https://learn.microsoft.com/windows/terminal/panes', '🖥', 'Microsoft Learn — Windows Terminal panes', en ? 'Split, focus, resize, wt command line' : 'Chia, chuyển, đổi cỡ, dòng lệnh wt')}
${tl('https://learn.microsoft.com/powershell/module/psreadline/about/about_psreadline', '🔐', 'Microsoft Learn — about_PSReadLine', en ? 'History file and sensitive-command filtering' : 'File lịch sử và cơ chế lọc lệnh nhạy cảm')}
${tl('https://attack.mitre.org/techniques/T1552/003/', '🛡', 'MITRE ATT&CK — T1552.003 Shell History', en ? 'Why attackers read history first' : 'Vì sao kẻ tấn công đọc lịch sử đầu tiên')}
${tl('https://circleci.com/blog/jan-4-2023-incident-report/', '📰', 'CircleCI — Incident report (13/01/2023)', en ? 'Malware on an engineer laptop, stolen SSO session' : 'Mã độc trên laptop kỹ sư, phiên SSO bị đánh cắp')}
</div>
`;

/* ═════════════ 3.4 — Lab: Mười việc hằng ngày ═════════════ */
const O_LAB = out("$ rg -nw findUserById ~/do-nghe\n/home/sv/do-nghe/labflow-mini/src/routes/users.routes.js:2:import { findUserById, listUsers } from '../services/user.service.js';\n/home/sv/do-nghe/labflow-mini/src/routes/users.routes.js:9:  const user = findUserById(Number(req.params.id));\n/home/sv/do-nghe/labflow-mini/src/services/user.service.js:11:export function findUserById(id) {\n/home/sv/do-nghe/labflow-mini/src/services/task.service.js:1:import { findUserById } from './user.service.js';\n/home/sv/do-nghe/labflow-mini/src/services/task.service.js:11:  const user = findUserById(task.assigneeId);\n\n$ rg -c -t js -t java '\\.(get|post|patch|delete)\\(|@(Get|Post|Patch|Delete)Mapping' ~/do-nghe --sort path\n/home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear/GearController.java:2\n/home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear/InMemoryGearRepository.java:1\n/home/sv/do-nghe/labflow-mini/src/routes/tasks.routes.js:3\n/home/sv/do-nghe/labflow-mini/src/routes/users.routes.js:2\n\n$ rg -c -t js -t java 'Router\\.(get|post|patch|delete)\\(|@(Get|Post|Patch|Delete)Mapping' ~/do-nghe --sort path\n/home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear/GearController.java:2\n/home/sv/do-nghe/labflow-mini/src/routes/tasks.routes.js:3\n/home/sv/do-nghe/labflow-mini/src/routes/users.routes.js:2\n\n$ rg -n '//\\s*(TODO|FIXME)' ~/do-nghe --sort path\n/home/sv/do-nghe/labflow-mini/src/services/task.service.js:20:// TODO(binh): kiem tra assigneeId co ton tai truoc khi tao\n/home/sv/do-nghe/labflow-mini/src/services/task.service.js:32:// FIXME: markDone chua ghi lai ai la nguoi bam Done\n/home/sv/do-nghe/labflow-mini/web/src/api.js:1:// TODO: doc BASE tu import.meta.env thay vi viet cung\n\n$ fd '(Test\\.java|\\.test\\.js)$' ~/do-nghe\n/home/sv/do-nghe/gear-mini/src/test/java/com/labflow/gear/gear/GearServiceTest.java\n/home/sv/do-nghe/labflow-mini/test/task.service.test.js\n\n$ fd -t f -e js -e jsx -e java . ~/do-nghe -X wc -l | sort -rn | sed -n '2,6p'\n   43 /home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear/GearController.java\n   42 /home/sv/do-nghe/labflow-mini/src/services/task.service.js\n   36 /home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear/InMemoryGearRepository.java\n   36 /home/sv/do-nghe/gear-mini/src/main/java/com/labflow/gear/gear/GearService.java\n   27 /home/sv/do-nghe/gear-mini/src/test/java/com/labflow/gear/gear/GearServiceTest.java\n\n$ curl -s localhost:41300/tasks | jq -r '.[] | select(.status == \"TODO\") | .title'\nViet API dang nhap\nViet test cho task service\n\n$ curl -s localhost:41300/tasks | jq -c 'group_by(.status) | map({(.[0].status): length}) | add'\n{\"DOING\":1,\"TODO\":2}\n\n$ jq -r 'select(.status >= 500) | .path' logs/access-*.jsonl | sort | uniq -c | sort -rn\n      8 /tasks\n      5 /users/1\n      4 /tasks/2/done\n      3 /users/9\n\n$ fd -I -e log --changed-before 2026-11-22 . logs -x echo mv {} {}.old\nmv logs/app-2026-11-20.log logs/app-2026-11-20.log.old\nmv logs/app-2026-11-21.log logs/app-2026-11-21.log.old\n\n$ fd -I -e log --changed-before 2026-11-22 . logs -x mv {} {}.old; ls logs | rg old\napp-2026-11-20.log.old\napp-2026-11-21.log.old\n\n$ cong 41300\nCOMMAND PID USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME\nnode     58   sv   18u  IPv6 1937569333      0t0  TCP *:41300 (LISTEN)\n\n$ lsof -t -iTCP:41300 -sTCP:LISTEN | xargs -r kill; sleep 0.5; cong 41300\ncong 41300: khong co ai nghe\n\n$ git log -S 'TODO(binh)' --oneline\n8c10591 Chuong 3: web + TODO\n");

const VIEC = [
  ['Where is <code>findUserById</code> defined, and who calls it?', '<code>findUserById</code> được định nghĩa ở đâu, ai gọi nó?', 'rg', '-w'],
  ['How many HTTP endpoints per file, in both projects? (Express routers and Spring mappings — no false positives.)', 'Mỗi file có bao nhiêu endpoint HTTP, tính cả hai dự án? (router Express và mapping Spring — không đếm nhầm.)', 'rg', '-c -t js -t java, --sort path'],
  ['List the real TODO/FIXME notes with file and line.', 'Liệt kê các ghi chú TODO/FIXME thật, kèm file và dòng.', 'rg', '-n, //\\s*'],
  ['List the test files of both projects.', 'Liệt kê các file test của cả hai dự án.', 'fd', 'regex on the name'],
  ['The five largest source files (by lines), ignoring dependencies.', 'Năm file mã lớn nhất (theo số dòng), bỏ qua thư viện.', 'fd + wc + sort', '-X'],
  ['Titles of the tasks still in TODO, from the running API.', 'Tiêu đề các task còn TODO, lấy từ API đang chạy.', 'curl + jq', '-r, select'],
  ['Number of tasks per status, as one JSON object.', 'Số task theo từng trạng thái, gói trong một object JSON.', 'jq', 'group_by, add'],
  ['From four days of JSON logs: which paths returned 500, most first?', 'Từ log JSON bốn ngày: những đường nào trả 500, nhiều nhất đứng đầu?', 'jq + sort + uniq', 'select'],
  ['Rename the text logs older than 22/11 to <code>*.log.old</code> — preview first.', 'Đổi tên các log chữ cũ hơn 22/11 thành <code>*.log.old</code> — xem trước đã.', 'fd', '--changed-before, -x, echo'],
  ['Who is listening on port 41300? Stop it, and prove the port is free.', 'Ai đang nghe cổng 41300? Tắt nó, rồi chứng minh cổng đã trống.', 'cong / lsof', '-t, xargs -r'],
];

const DAP_PV3 = (en) => `<ol>
<li>${en
    ? '“I search with ripgrep, whole word, limited to the source types: <code>rg -nw findUserById -t js</code>. It respects .gitignore, so it does not drown the answer in node_modules or build output — on our sample project grep -r returned 182 lines where rg returned the 2 that mattered. For an audit (secrets) I add <code>-uu</code>, because then I do want ignored files. In the IDE I would use Find Usages for code and rg for everything the IDE does not index: SQL strings, configs, the other repository.”'
    : '“Em tìm bằng ripgrep, nguyên từ, giới hạn kiểu file mã: <code>rg -nw findUserById -t js</code>. Nó tôn trọng .gitignore nên câu trả lời không bị chìm trong node_modules hay kết quả build — trên dự án mẫu grep -r ra 182 dòng trong khi rg ra đúng 2 dòng cần. Khi kiểm tra bảo mật (tìm bí mật) em thêm <code>-uu</code>, vì lúc đó em lại cần cả file bị ignore. Trong IDE em dùng Find Usages cho mã, còn rg cho mọi thứ IDE không lập chỉ mục: chuỗi SQL, file cấu hình, repo bên kia.”'}</li>
<li>${en
    ? '“<code>curl -s url | jq</code> to see the structure, then narrow: <code>.[] | select(.status == "TODO") | .title</code> with <code>-r</code> for plain text, <code>group_by</code> for counts, <code>@tsv</code> if it goes into a spreadsheet. If jq says parse error I check the status and content type first — usually it is an HTML error page, not JSON.”'
    : '“<code>curl -s url | jq</code> để xem cấu trúc, rồi thu hẹp dần: <code>.[] | select(.status == "TODO") | .title</code> kèm <code>-r</code> để ra chữ trần, <code>group_by</code> để đếm, <code>@tsv</code> nếu cần dán vào bảng tính. Nếu jq báo parse error, em xem mã trạng thái và kiểu nội dung trước — thường đó là trang lỗi HTML chứ không phải JSON.”'}</li>
<li>${en
    ? '“Without tmux, the SSH session closes, the shell gets SIGHUP and the migration is killed halfway — possibly leaving the schema in between versions. I always start long jobs inside <code>tmux new -A -s TICKET</code>; after reconnecting I attach and the job is still running. For jobs that must outlive the server login entirely, the right tool is a proper service or CI job, not my terminal.”'
    : '“Không có tmux, phiên SSH đóng, shell nhận SIGHUP và migration bị giết giữa chừng — có thể để schema lửng lơ giữa hai phiên bản. Em luôn chạy việc dài trong <code>tmux new -A -s TICKET</code>; kết nối lại thì gắn vào, việc vẫn đang chạy. Với việc phải sống lâu hơn cả phiên đăng nhập, công cụ đúng là một service hoặc job CI, không phải terminal của em.”'}</li>
<li>${en
    ? '“Three leaks at once: it is saved to the history file (depending on the shell, even with a leading space), it is visible to every user on the machine in <code>ps</code> as long as the process runs, and it stays in the terminal scrollback and any screen share. I would ask them to use an environment variable or <code>.env</code> loaded with <code>set -a</code>, <code>read -rs</code>, or the tool’s own <code>--password-stdin</code> — and since it has already been typed, to rotate that password.”'
    : '“Ba chỗ lộ cùng lúc: nó vào file lịch sử (tuỳ shell, kể cả khi có dấu cách đầu), mọi người dùng trên máy đều thấy nó trong <code>ps</code> chừng nào tiến trình còn chạy, và nó nằm lại trong scrollback của terminal cùng mọi lần chia sẻ màn hình. Em sẽ đề nghị dùng biến môi trường hoặc <code>.env</code> nạp bằng <code>set -a</code>, <code>read -rs</code>, hoặc cờ <code>--password-stdin</code> của chính công cụ — và vì đã lỡ gõ rồi, nên đổi mật khẩu đó.”'}</li>
<li>${en
    ? '“Without a path rg searches standard input when stdin is not a terminal. In CI stdin is a pipe, so rg either waits forever or reads an empty input and reports ‘no match’ with exit 1 — the script then believes there is nothing to find. Fix: always pass a path (<code>rg -n TODO .</code>), and in scripts check exit codes explicitly: 0 found, 1 not found, 2 error.”'
    : '“Không có đường dẫn, rg tìm trong đầu vào chuẩn khi stdin không phải terminal. Trong CI stdin là một ống, nên rg hoặc chờ mãi, hoặc đọc phải đầu vào rỗng rồi báo ‘không khớp’ với mã 1 — script tưởng là chẳng có gì. Cách sửa: luôn đưa đường dẫn (<code>rg -n TODO .</code>), và trong script kiểm mã thoát rõ ràng: 0 có kết quả, 1 không có, 2 là lỗi.”'}</li>
</ol>`;

const L4 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Lab' : 'Chương 3 · Lab'}</span>
<h2>${en ? '3.4 — Lab: Ten everyday tasks in one line each' : '3.4 — Lab: Mười việc hằng ngày, mỗi việc một dòng lệnh'}</h2>
<p class="lead">${en
    ? 'Ticket <strong>LF-31 — support rotation</strong>. This week you are the developer on support for LabFlow. On Monday morning the team lead sends ten questions in the chat, one after another, and expects each answer within a minute or two. Answer every one with <strong>one command line</strong> (pipes allowed) on labflow-mini and gear-mini, paste the command and its output into the ticket, and be ready to explain every flag.'
    : 'Ticket <strong>LF-31 — trực hỗ trợ</strong>. Tuần này bạn là dev trực hỗ trợ cho LabFlow. Sáng thứ Hai trưởng nhóm gửi mười câu hỏi vào nhóm chat, câu này nối câu kia, và chờ mỗi câu trả lời trong một hai phút. Trả lời mỗi câu bằng <strong>một dòng lệnh</strong> (được dùng ống) trên labflow-mini và gear-mini, dán lệnh và output vào ticket, và sẵn sàng giải thích từng cờ.'}</p>

<h3>${en ? 'Starting point' : 'Điểm xuất phát'}</h3>
<ul>
<li>${en ? '<code>~/do-nghe/labflow-mini</code> after <code>tao-ch3.sh</code> (lesson 3.2) and committed; <code>~/do-nghe/gear-mini</code> with the Chapter 2 code.' : '<code>~/do-nghe/labflow-mini</code> sau khi chạy <code>tao-ch3.sh</code> (bài 3.2) và đã commit; <code>~/do-nghe/gear-mini</code> có mã của Chương 2.'}</li>
<li>${en ? 'rg, fd, fzf, bat, jq installed; <code>dev.sh</code> loaded (you need <code>cong</code>); labflow-mini running: <code>PORT=41300 npm run dev</code> — or simply <code>~/bin/dev-tmux.sh</code>.' : 'Đã cài rg, fd, fzf, bat, jq; đã nạp <code>dev.sh</code> (cần hàm <code>cong</code>); labflow-mini đang chạy: <code>PORT=41300 npm run dev</code> — hoặc đơn giản <code>~/bin/dev-tmux.sh</code>.'}</li>
<li>${en ? 'Work from <code>~/do-nghe/labflow-mini</code>; questions about both projects search <code>~/do-nghe</code>. Start a timer.' : 'Đứng ở <code>~/do-nghe/labflow-mini</code>; câu hỏi về cả hai dự án thì tìm trong <code>~/do-nghe</code>. Bật đồng hồ bấm giờ.'}</li>
</ul>

<h3>${en ? 'The ten questions' : 'Mười câu hỏi'}</h3>
<ol>
${VIEC.map(([e, v]) => `<li>${en ? e : v}</li>`).join('\n')}
</ol>
<p>${en ? 'Extra for strong students: (11) which commit introduced the note <code>TODO(binh)</code>? (12) Turn your three most useful answers into functions in <code>dev.sh</code> that take the project folder as an argument.' : 'Thêm cho bạn khá: (11) commit nào đã thêm ghi chú <code>TODO(binh)</code>? (12) Biến ba câu trả lời hữu ích nhất thành hàm trong <code>dev.sh</code>, nhận thư mục dự án làm đối số.'}</p>

<h3>${en ? 'Hints, one level at a time' : 'Gợi ý, mở từng bậc'}</h3>
${giai(en ? 'Level 1 — which tool for each question' : 'Bậc 1 — mỗi câu dùng công cụ nào', `<table>
<thead><tr><th>#</th><th>${en ? 'Tool' : 'Công cụ'}</th></tr></thead>
<tbody>
${VIEC.map(([, , t], i) => `<tr><td>${i + 1}</td><td><code>${t}</code></td></tr>`).join('\n')}
</tbody>
</table>`)}
${giai(en ? 'Level 2 — the key flag or function' : 'Bậc 2 — cờ hoặc hàm then chốt', `<table>
<thead><tr><th>#</th><th>${en ? 'Key flag / function' : 'Cờ / hàm then chốt'}</th></tr></thead>
<tbody>
${VIEC.map(([, , , k], i) => `<tr><td>${i + 1}</td><td><code>${k}</code></td></tr>`).join('\n')}
</tbody>
</table>
<p>${en ? 'Question 2 has a trap: the obvious pattern also counts <code>data.get(</code> in a repository class. Look at what you matched before you answer.' : 'Câu 2 có bẫy: mẫu hiển nhiên đếm luôn cả <code>data.get(</code> trong một lớp repository. Nhìn xem mình đã khớp những gì trước khi trả lời.'}</p>`)}

<h3>${en ? 'Model solution (real run)' : 'Lời giải mẫu (chạy thật)'}</h3>
${giai(en ? 'Open only after you have your own ten lines' : 'Chỉ mở khi đã có mười dòng của riêng bạn', `${O_LAB}
<ul>
<li>${en ? '<strong>Q2</strong> is shown twice on purpose: the first pattern reports four files, one of them <code>InMemoryGearRepository.java</code> because of <code>data.get(</code>. Anchoring on <code>Router.</code> gives the honest 2 + 3 + 2 = 7 endpoints. Reporting the first number would have been wrong in front of the whole team.' : '<strong>Câu 2</strong> được để hai lần có chủ ý: mẫu đầu báo bốn file, trong đó có <code>InMemoryGearRepository.java</code> chỉ vì <code>data.get(</code>. Neo vào <code>Router.</code> mới ra con số trung thực 2 + 3 + 2 = 7 endpoint. Báo con số đầu là sai trước cả nhóm.'}</li>
<li>${en ? '<strong>Q5</strong>: <code>wc -l</code> prints a <code>total</code> line, which is the largest number after sorting — <code>sed -n \'2,6p\'</code> skips it.' : '<strong>Câu 5</strong>: <code>wc -l</code> in thêm dòng <code>total</code>, sau khi sắp xếp nó là số lớn nhất — <code>sed -n \'2,6p\'</code> bỏ qua nó.'}</li>
<li>${en ? '<strong>Q7</strong>: <code>{(.[0].status): length}</code> — parentheses make the key computed; <code>add</code> merges the small objects into one.' : '<strong>Câu 7</strong>: <code>{(.[0].status): length}</code> — dấu ngoặc khiến khoá được tính ra; <code>add</code> gộp các object nhỏ thành một.'}</li>
<li>${en ? '<strong>Q9</strong>: the preview line is part of the answer. <code>-I</code> is optional here because <code>logs</code> is typed as the search path (from the project root it would be required — <code>logs/</code> is ignored); <code>{}.old</code> keeps <code>.log</code> in the name (<code>{.}.old</code> would drop it).' : '<strong>Câu 9</strong>: dòng xem trước là một phần của câu trả lời. <code>-I</code> ở đây không bắt buộc vì <code>logs</code> được gõ thẳng làm đường tìm (tìm từ gốc dự án thì phải có, vì <code>logs/</code> bị ignore); <code>{}.old</code> giữ <code>.log</code> trong tên (<code>{.}.old</code> sẽ làm mất nó).'}</li>
<li>${en ? '<strong>Q10</strong>: <code>lsof -t</code> prints only PIDs; <code>xargs -r</code> does nothing when the list is empty, so the line is safe to run twice.' : '<strong>Câu 10</strong>: <code>lsof -t</code> chỉ in PID; <code>xargs -r</code> không làm gì khi danh sách rỗng, nên chạy dòng này hai lần vẫn an toàn.'}</li>
<li>${en ? '<strong>Q11</strong>: <code>git log -S</code> (the “pickaxe”) finds commits where the number of occurrences of a string changed.' : '<strong>Câu 11</strong>: <code>git log -S</code> (“cái cuốc”) tìm các commit làm thay đổi số lần xuất hiện của một chuỗi.'}</li>
</ul>`)}

<h3>${en ? 'Rubric' : 'Tiêu chí chấm (rubric)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Each of the ten questions answered correctly with one command line' : 'Mỗi câu trong mười câu trả lời đúng bằng một dòng lệnh'}</td><td>${en ? '0.6 each (6)' : '0,6 mỗi câu (6)'}</td></tr>
<tr><td>${en ? 'No search polluted by node_modules / target / dist (no plain grep -r)' : 'Không lần tìm nào bị node_modules / target / dist làm nhiễu (không dùng grep -r trần)'}</td><td>1</td></tr>
<tr><td>${en ? 'Q2 answer excludes the false positive, and you can say why' : 'Câu 2 loại được kết quả nhầm, và nói được vì sao'}</td><td>1</td></tr>
<tr><td>${en ? 'Q9 previewed with echo before renaming; Q10 safe to repeat' : 'Câu 9 xem trước bằng echo rồi mới đổi tên; câu 10 chạy lại vẫn an toàn'}</td><td>1</td></tr>
<tr><td>${en ? 'You explain every flag of three randomly chosen answers' : 'Giải thích được từng cờ của ba câu chọn ngẫu nhiên'}</td><td>1</td></tr>
</tbody>
</table>
<p><strong>${en ? 'Pass:' : 'Đạt:'}</strong> ${en ? '≥ 8/10 in under 25 minutes. Record your time next to your Section 0 baseline — Chapter 7 compares them.' : '≥ 8/10 trong dưới 25 phút. Ghi thời gian của bạn cạnh mốc đo ở Mục 0 — Chương 7 sẽ so hai con số.'}</p>

<h3>${en ? '🏁 Extra challenge' : '🏁 Thử thách thêm'}</h3>
<ul>
<li>${en ? 'Write <code>baocao-sang</code>: one function that prints, for a given day, the number of requests, the 4xx and 5xx counts and the slowest path — from the JSON log, with jq only.' : 'Viết <code>baocao-sang</code>: một hàm in ra, cho một ngày cho trước, số request, số 4xx, số 5xx và đường chậm nhất — từ log JSON, chỉ dùng jq.'}</li>
<li>${en ? 'Add a fourth pane to <code>dev-tmux.sh</code> that follows today’s log, filtered to ERROR lines.' : 'Thêm ô thứ tư vào <code>dev-tmux.sh</code>, theo dõi log hôm nay và chỉ hiện dòng ERROR.'}</li>
</ul>

<h3>${en ? '🎤 What an interviewer will ask about this chapter' : '🎤 Phỏng vấn viên sẽ hỏi gì về chương này'}</h3>
<ol>
<li>${en ? '“How do you find every place a function is used in a large repository, from the terminal? Why would grep -r give a different answer?”' : '“Em tìm mọi chỗ một hàm được dùng trong repo lớn bằng terminal thế nào? Vì sao grep -r có thể cho kết quả khác?”'}</li>
<li>${en ? '“An API returns a big JSON. How do you get just the fields you need, quickly?”' : '“API trả về một JSON lớn. Em lấy nhanh đúng vài field cần thế nào?”'}</li>
<li>${en ? '“You run a 30-minute migration over SSH and the connection drops. What happens, and how do you prevent it?”' : '“Em chạy migration 30 phút qua SSH thì rớt mạng. Chuyện gì xảy ra, và em phòng thế nào?”'}</li>
<li>${en ? '“A colleague types the database password directly in a command. What is the problem?”' : '“Đồng nghiệp gõ thẳng mật khẩu database trong lệnh. Có vấn đề gì?”'}</li>
<li>${en ? '“Your CI script uses rg without a path. It works locally but hangs in CI. Why?”' : '“Script CI của em dùng rg không có đường dẫn. Trên máy em chạy được, lên CI thì treo. Vì sao?”'}</li>
</ol>
${giai(en ? 'Model answers' : 'Gợi ý trả lời', DAP_PV3(en))}

<h3>${en ? '🛠 Project milestone' : '🛠 Mốc dự án'}</h3>
<p>${en
    ? 'Create <code>~/dotfiles</code> (a Git repository, not pushed yet) and move into it: <code>dev.sh</code> with the fzf block, your prompt file, <code>tmux.conf</code> and <code>bin/dev-tmux.sh</code> adapted to the project you registered at the start of the course (or your SWP project). Add a <code>NOTES.md</code> with your ten lab commands — they become part of your cheat sheet in lesson 7.2. Chapter 6 turns this folder into a repo that rebuilds a machine; before it is ever pushed, it will be scanned for secrets.'
    : 'Tạo <code>~/dotfiles</code> (một repo Git, chưa push) và chuyển vào đó: <code>dev.sh</code> kèm khối fzf, file dấu nhắc, <code>tmux.conf</code> và <code>bin/dev-tmux.sh</code> sửa cho dự án bạn đăng ký đầu khoá (hoặc dự án SWP). Thêm <code>NOTES.md</code> ghi mười lệnh của lab — chúng sẽ thành một phần bảng tra của bạn ở bài 7.2. Chương 6 biến thư mục này thành repo dựng lại được cả một máy; trước khi push lần đầu, nó sẽ được quét tìm bí mật.'}</p>
</div>
`;

/* ═════════════ 3.5 — Kiểm tra Chương 3 ═════════════ */
const QUIZ3 = [
  Q('ide-3-1', 'In labflow-mini (with web/node_modules and web/dist), grep -rn useEffect . prints 182 lines and rg -n useEffect prints 2. Why?|||Trong labflow-mini (có web/node_modules và web/dist), grep -rn useEffect . in 182 dòng còn rg -n useEffect in 2. Vì sao?', [
    'rg only searches files changed since the last commit|||rg chỉ tìm các file đã đổi kể từ commit cuối',
    'rg skips paths listed in .gitignore, hidden files and binaries by default|||Mặc định rg bỏ qua đường dẫn trong .gitignore, file ẩn và file nhị phân',
    'grep counts every match twice when -n is used|||grep đếm mỗi kết quả hai lần khi dùng -n',
    'rg stops after the first two matches|||rg dừng sau hai kết quả đầu tiên',
  ], 1, 'EN: node_modules/ and dist/ are git-ignored, so rg never opens them; grep -r reads everything, including a 52,001-character minified line.|||VI: node_modules/ và dist/ nằm trong .gitignore nên rg không mở chúng; grep -r đọc hết, kể cả một dòng nén dài 52.001 ký tự.'),
  Q('ide-3-2', 'rg JWT_SECRET labflow-mini and rg --hidden JWT_SECRET labflow-mini both exit 1, yet .env contains JWT_SECRET. Which command finds it?|||rg JWT_SECRET labflow-mini và rg --hidden JWT_SECRET labflow-mini đều thoát mã 1, dù .env có chứa JWT_SECRET. Lệnh nào tìm ra?', [
    'rg -i JWT_SECRET labflow-mini|||rg -i JWT_SECRET labflow-mini',
    'rg -w JWT_SECRET labflow-mini|||rg -w JWT_SECRET labflow-mini',
    'rg -uu JWT_SECRET labflow-mini|||rg -uu JWT_SECRET labflow-mini',
    'rg -F JWT_SECRET labflow-mini|||rg -F JWT_SECRET labflow-mini',
  ], 2, 'EN: .env is hidden and git-ignored; --hidden lifts only the first filter, -uu lifts both. For secret audits, always search with -uu.|||VI: .env vừa ẩn vừa bị ignore; --hidden chỉ gỡ lớp đầu, -uu gỡ cả hai. Khi kiểm tra bí mật, luôn tìm bằng -uu.'),
  Q('ide-3-3', 'A CI step runs rg -n "// TODO" (no path). On your laptop it works; in CI it hangs until the job times out. What is the fix?|||Một bước CI chạy rg -n "// TODO" (không có đường dẫn). Trên laptop chạy được; lên CI thì treo tới khi job hết giờ. Sửa thế nào?', [
    'Add . (or another path) at the end of the command|||Thêm . (hoặc một đường dẫn) vào cuối lệnh',
    'Add -uu so rg searches more files|||Thêm -uu để rg tìm nhiều file hơn',
    'Replace the quotes with single quotes|||Đổi nháy kép thành nháy đơn',
    'Run it with sudo|||Chạy bằng sudo',
  ], 0, 'EN: Without a path, rg searches standard input when stdin is not a terminal; in CI stdin is a pipe. With a closed pipe you get exit 1 and silence instead — also wrong.|||VI: Không có đường dẫn, rg tìm trong đầu vào chuẩn khi stdin không phải terminal; trong CI stdin là một ống. Nếu ống đã đóng thì ra mã 1 và im lặng — cũng sai.'),
  Q('ide-3-4', 'alias cong2="lsof -nP -iTCP: -sTCP:LISTEN" then cong2 41300 fails with “unacceptable port specification”. Why?|||alias cong2="lsof -nP -iTCP: -sTCP:LISTEN" rồi cong2 41300 lỗi “unacceptable port specification”. Vì sao?', [
    'lsof needs sudo to see ports|||lsof cần sudo mới thấy cổng',
    'An alias only pastes text at the front; 41300 lands after the whole text, not after TCP:|||Alias chỉ dán chữ ở đầu; 41300 rơi vào sau cả đoạn, không phải ngay sau TCP:',
    'Aliases cannot contain colons|||Alias không được chứa dấu hai chấm',
    'The alias was defined in zsh and run in bash|||Alias được định nghĩa trong zsh mà chạy trong bash',
  ], 1, 'EN: Anything with an argument in the middle needs a function: cong() { lsof -nP -iTCP:"$1" -sTCP:LISTEN; }|||VI: Có đối số ở giữa thì phải viết hàm: cong() { lsof -nP -iTCP:"$1" -sTCP:LISTEN; }'),
  Q('ide-3-5', 'Ctrl+R, typing spring: the second Ctrl+R shows exactly the same command again, the third says failed. What does that tell you?|||Ctrl+R, gõ spring: lần Ctrl+R thứ hai hiện lại y hệt lệnh cũ, lần thứ ba báo failed. Điều đó cho biết gì?', [
    'History is corrupted and must be deleted|||Lịch sử bị hỏng, phải xoá đi',
    'Ctrl+R only searches the last two commands|||Ctrl+R chỉ tìm hai lệnh gần nhất',
    'The same command is stored twice; HISTCONTROL=erasedups or fzf’s list view avoids the wasted press|||Cùng một lệnh được lưu hai lần; HISTCONTROL=erasedups hoặc danh sách của fzf tránh phím bấm thừa',
    'bash cannot search for words containing a hyphen|||bash không tìm được từ có dấu gạch nối',
  ], 2, 'EN: ignoredups only drops consecutive duplicates; the command was run in the morning and again after lunch.|||VI: ignoredups chỉ bỏ bản trùng liền nhau; lệnh đó được chạy buổi sáng và lại chạy sau trưa.'),
  Q('ide-3-6', 'Which command prints only the titles (no quotes) of tasks whose status is TODO?|||Lệnh nào chỉ in tiêu đề (không kèm nháy) của các task có status là TODO?', [
    'curl -s localhost:41300/tasks | jq \'.[].title | select("TODO")\'|||curl -s localhost:41300/tasks | jq \'.[].title | select("TODO")\'',
    'curl -s localhost:41300/tasks | jq -c \'.[] | .status == "TODO"\'|||curl -s localhost:41300/tasks | jq -c \'.[] | .status == "TODO"\'',
    'curl -s localhost:41300/tasks | rg TODO|||curl -s localhost:41300/tasks | rg TODO',
    'curl -s localhost:41300/tasks | jq -r \'.[] | select(.status == "TODO") | .title\'|||curl -s localhost:41300/tasks | jq -r \'.[] | select(.status == "TODO") | .title\'',
  ], 3, 'EN: .[] streams each task, select keeps the ones where the condition is true, .title picks the field, -r drops the quotes. Option 2 prints true/false.|||VI: .[] tách từng task, select giữ task có điều kiện đúng, .title lấy field, -r bỏ nháy. Phương án 2 chỉ in true/false.'),
  Q('ide-3-7', 'curl -s localhost:41300/task | jq prints “parse error: Invalid numeric literal at line 1, column 10”. Most likely cause?|||curl -s localhost:41300/task | jq báo “parse error: Invalid numeric literal at line 1, column 10”. Nguyên nhân khả dĩ nhất?', [
    'The response is not JSON — here an HTML 404 page for a mistyped URL|||Phản hồi không phải JSON — ở đây là trang 404 HTML vì gõ nhầm URL',
    'jq cannot read numbers larger than 32 bits|||jq không đọc được số lớn hơn 32 bit',
    'The JSON uses single quotes|||JSON dùng nháy đơn',
    'jq needs the -s flag for API responses|||jq cần cờ -s cho phản hồi API',
  ], 0, 'EN: Check with curl -s -o /dev/null -w "%{http_code} %{content_type}" before debugging the filter.|||VI: Kiểm bằng curl -s -o /dev/null -w "%{http_code} %{content_type}" trước khi gỡ lỗi bộ lọc.'),
  Q('ide-3-8', 'On zsh configured like macOS’s default /etc/zshrc, you type  export DB_PASSWORD=… with a leading space. Is it saved to ~/.zsh_history?|||Trên zsh cấu hình như /etc/zshrc mặc định của macOS, bạn gõ  export DB_PASSWORD=… có dấu cách ở đầu. Nó có vào ~/.zsh_history không?', [
    'No — every shell skips leading-space commands|||Không — mọi shell đều bỏ qua lệnh có dấu cách đầu',
    'Yes, unless setopt HIST_IGNORE_SPACE is set|||Có, trừ khi đã đặt setopt HIST_IGNORE_SPACE',
    'No — zsh never saves export commands|||Không — zsh không bao giờ lưu lệnh export',
    'Only if the terminal is inside tmux|||Chỉ khi terminal nằm trong tmux',
  ], 1, 'EN: Measured in lesson 3.3: saved by default, skipped after HIST_IGNORE_SPACE. Ubuntu bash skips it because its .bashrc sets HISTCONTROL=ignoreboth.|||VI: Đã đo ở bài 3.3: mặc định bị lưu, chỉ bỏ qua khi có HIST_IGNORE_SPACE. bash của Ubuntu bỏ qua vì .bashrc đặt HISTCONTROL=ignoreboth.'),
  Q('ide-3-9', 'On a shared test server you start java -jar app.jar --spring.datasource.password=S3cret. What can another, unprivileged user see?|||Trên máy test dùng chung, bạn chạy java -jar app.jar --spring.datasource.password=S3cret. Một người dùng khác, không có quyền đặc biệt, thấy được gì?', [
    'Nothing — other users cannot see your processes|||Không gì cả — người dùng khác không thấy tiến trình của bạn',
    'The password only if they are root|||Chỉ thấy mật khẩu nếu họ là root',
    'The full command line with the password (ps, /proc/<pid>/cmdline), but not your environment variables|||Toàn bộ dòng lệnh kèm mật khẩu (ps, /proc/<pid>/cmdline), nhưng không thấy biến môi trường của bạn',
    'Only the process name java|||Chỉ thấy tên tiến trình java',
  ], 2, 'EN: cmdline is world-readable (-r--r--r--), environ is owner-only (-r--------). Pass secrets via SPRING_DATASOURCE_PASSWORD or a protected file.|||VI: cmdline ai cũng đọc được (-r--r--r--), environ chỉ chủ sở hữu (-r--------). Truyền bí mật qua SPRING_DATASOURCE_PASSWORD hoặc file được bảo vệ.'),
  Q('ide-3-10', 'Your tmux script runs split-window twice, then send-keys -t labflow:dev.2 "curl …". The curl ends up in the test pane instead of the new bottom pane. Why?|||Script tmux của bạn chạy split-window hai lần, rồi send-keys -t labflow:dev.2 "curl …". Lệnh curl lại rơi vào ô test thay vì ô dưới mới tạo. Vì sao?', [
    'send-keys always targets the first pane|||send-keys luôn nhắm vào ô đầu tiên',
    'tmux numbers panes by position, so the indexes shifted after the second split; use the pane_id returned by -P -F \'#{pane_id}\'|||tmux đánh số ô theo vị trí nên số thứ tự bị dịch sau lần chia thứ hai; hãy dùng pane_id trả về từ -P -F \'#{pane_id}\'',
    'The bottom pane was not ready yet|||Ô dưới chưa sẵn sàng',
    'Pane numbers start at 1, not 0|||Số ô bắt đầu từ 1, không phải 0',
  ], 1, 'EN: This exact bug happened while writing the lesson. Pane IDs like %3 never change for the life of the pane.|||VI: Lỗi này đã xảy ra thật khi soạn bài. Mã ô dạng %3 không đổi trong suốt đời của ô.'),
];

const L5 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 3 · Quiz' : 'Chương 3 · Kiểm tra'}</span>
<h2>${en ? '3.5 — Chapter 3 quiz' : '3.5 — Kiểm tra Chương 3'}</h2>
<p class="lead">${en
    ? 'Ten situations taken from the real runs of this chapter: rg versus grep, finding secrets, rg in scripts, alias versus function, history search, jq filters and errors, history and secrets in zsh, process arguments, and tmux pane IDs. Fifteen minutes; every answer has an explanation.'
    : 'Mười tình huống lấy từ chính các lần chạy thật trong chương: rg so với grep, tìm bí mật, rg trong script, alias so với hàm, tìm lịch sử, bộ lọc và lỗi của jq, lịch sử và bí mật trong zsh, đối số tiến trình, và mã ô của tmux. Mười lăm phút; câu nào cũng có giải thích.'}</p>
<p>${en ? 'Scored below 7? Re-read the lesson named in the explanation and redo its practice block before moving on to Chapter 4 (regex) — Chapter 4 uses rg on every page.' : 'Dưới 7 điểm? Đọc lại bài được nhắc trong phần giải thích và làm lại khối thực hành của bài đó trước khi sang Chương 4 (regex) — Chương 4 dùng rg ở mọi trang.'}</p>
</div>
`;

export default {
  title: 'Chapter 3 — A terminal that works for you|||Chương 3 — Terminal làm việc thay bạn',
  description: 'Ít gõ lại, tìm nhanh, đọc JSON dễ: Ctrl+R, alias/hàm dùng chung bash–zsh, PowerShell profile, terminal trong IDE; rg, fd, fzf, bat, jq đo thật trên dự án có node_modules; tmux dựng bố cục bằng script; lịch sử và đối số làm lộ mật khẩu.',
  lessons: [
    { title: '3.1 — Shell essentials: history search, aliases, functions, prompt, the integrated terminal|||3.1 — Nền tảng shell: tìm lịch sử, alias, hàm, prompt, terminal tích hợp trong IDE', slug: 'ide-3-1-shell', type: 'LESSON', isFreePreview: true, description: 'Ba lớp terminal/shell/chương trình, Ctrl+R và !!/!$ chụp thật, dev.sh chạy cả bash lẫn zsh (alias hỏng vì đối số ở giữa), dấu nhắc có nhánh + mã lỗi, $PROFILE PowerShell, terminal VS Code/IntelliJ, file khởi động làm cửa hậu.', content: L1(true) + L1(false) },
    { title: '3.2 — Modern CLI tools: ripgrep, fd, fzf, bat, jq, tldr|||3.2 — Công cụ dòng lệnh hiện đại: ripgrep, fd, fzf, bat, jq, tldr', slug: 'ide-3-2-cong-cu-hien-dai', type: 'LESSON', isFreePreview: true, description: 'grep -r 182 dòng so với rg 2 dòng, rg không thấy .env, rg đọc stdin trong script, $1h, fd -x có xem trước, fzf Ctrl+R/Ctrl+T, bat -A lộ CRLF, jq trên API và log, tldr apt hỏng, Codecov 2021.', content: L2(true) + L2(false) },
    { title: '3.3 — Sessions and panes: tmux basics or Windows Terminal panes|||3.3 — Phiên và ô chia: tmux cơ bản hoặc chia ô Windows Terminal', slug: 'ide-3-3-tmux', type: 'LESSON', isFreePreview: true, description: 'Mô hình phiên/cửa sổ/ô, bố cục dev bằng script (bẫy số thứ tự ô), test tự chạy lại, .tmux.conf, Windows Terminal; lịch sử bash/zsh/PowerShell lưu mật khẩu, ps lộ đối số, scrollback, CircleCI 2023.', content: L3(true) + L3(false) },
    { title: '3.4 — Lab: Ten everyday tasks in one line each|||3.4 — Lab: Mười việc hằng ngày, mỗi việc một dòng lệnh', slug: 'ide-3-4-lab', type: 'LESSON', isFreePreview: true, description: 'Ticket LF-31 trực hỗ trợ: 10 câu hỏi trả lời bằng một dòng lệnh trên labflow-mini + gear-mini, gợi ý hai bậc, lời giải chạy thật, rubric 10 điểm, 5 câu phỏng vấn có gợi ý, mốc dự án dotfiles.', content: L4(true) + L4(false) },
    { title: '3.5 — Chapter 3 quiz|||3.5 — Kiểm tra Chương 3', slug: 'ide-3-5-quiz', type: 'QUIZ', isFreePreview: true, description: 'Mười câu tình huống: rg với grep, -uu, rg trong CI, alias với hàm, Ctrl+R, jq select và parse error, zsh lưu lệnh có dấu cách, ps lộ mật khẩu, pane_id của tmux.', content: L5(true) + L5(false), quiz: { timeLimitSeconds: 900, questions: QUIZ3 } },
  ],
};
