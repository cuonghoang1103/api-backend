/**
 * Bài 0.3 — Cài đặt máy (nâng cấp 02/11/2026). Output thật: _demo/_t0/chay-may.sh (Node 22.23.3, npm 10.9.9, git 2.51.1,
 * VS Code 1.124.2) trong thư mục tạm, cấu hình git dùng GIT_CONFIG_GLOBAL tạm nên không đụng ~/.gitconfig.
 * Deck: scripts/slides-src/wf-0-3.mjs (10 slide, WF/v1/wf-0-3). Giữ video YouTube cũ.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-0-3', 'Set up your machine', 'Cài đặt máy của bạn', [
  [1, 'Set up your machine',
    '<p>Four free tools, installed once, used in every lesson after this one. We install them, prove each one works with a command, and finish with a small script that checks the whole machine for you.</p>',
    '<p>Bốn công cụ miễn phí, cài một lần, dùng trong mọi bài sau đây. Chúng ta cài chúng, chứng minh từng cái chạy được bằng một lệnh, và kết thúc bằng một script nhỏ tự kiểm cả máy giúp bạn.</p>'],
  [2, 'After this lesson you can…',
    '<p>A half-installed tool is the worst way to start: its errors look exactly like your own mistakes, and you cannot tell which problem you have. Spending twenty minutes here removes a whole class of confusion from every later chapter.</p>',
    '<p>Một công cụ cài dở là cách khởi đầu tệ nhất: lỗi của nó trông y hệt lỗi của chính bạn, và bạn không phân biệt được mình đang gặp vấn đề nào. Bỏ hai mươi phút ở đây sẽ gạt đi cả một loại rối rắm trong mọi chương sau.</p>'],
  [3, 'The four tools',
    '<p>A browser with DevTools to see the result, VS Code to write code, Node.js with npm to run JavaScript outside the browser and install libraries, and Git to save history. All free, all on Windows, macOS and Linux.</p>',
    '<p>Một trình duyệt có DevTools để xem kết quả, VS Code để viết mã, Node.js kèm npm để chạy JavaScript ngoài trình duyệt và cài thư viện, và Git để lưu lịch sử. Tất cả miễn phí, chạy trên Windows, macOS và Linux.</p>'],
  [4, 'Install, then ask the tool',
    '<p>Every tool answers a version question. If it prints a number, it is installed and your terminal can find it. These are the real versions used to make this course. Write yours down — "which version were you on?" is the first question when something breaks.</p>',
    '<p>Công cụ nào cũng trả lời được câu hỏi phiên bản. Nếu nó in ra một con số, nghĩa là đã cài và terminal tìm được nó. Đây là các phiên bản thật dùng để làm khoá này. Hãy ghi lại của bạn — "bạn đang ở phiên bản nào?" là câu hỏi đầu tiên khi có gì hỏng.</p>'],
  [5, 'command not found',
    '<p>This is the most common first error. The shell looked through a list of folders called PATH and did not find a program with that name. Either the tool is not installed, or the name is misspelled, or this terminal was opened before the installation and still has the old list.</p>',
    '<p>Đây là lỗi đầu tiên phổ biến nhất. Shell tìm trong một danh sách thư mục tên là PATH và không thấy chương trình nào mang tên đó. Hoặc công cụ chưa được cài, hoặc gõ sai tên, hoặc terminal này được mở trước khi cài nên vẫn giữ danh sách cũ.</p>'],
  [6, 'Run JavaScript with Node',
    '<p>Three lines in a file, one command in the terminal. No browser is involved: Node.js ran the file itself and printed to the terminal. Everything a backend does later — answering requests, reading a database — starts exactly like this.</p>',
    '<p>Ba dòng trong một tệp, một lệnh trong terminal. Không có trình duyệt nào tham gia: Node.js tự chạy tệp đó và in ra terminal. Mọi việc backend làm về sau — trả lời request, đọc cơ sở dữ liệu — đều bắt đầu đúng như thế này.</p>'],
  [7, 'Your first npm project',
    '<p><code>npm init -y</code> creates a <code>package.json</code>: the identity card of a JavaScript project. Its name, version and scripts live here, and from Lesson 1.5 on, so does the list of libraries it depends on.</p>',
    '<p><code>npm init -y</code> tạo ra <code>package.json</code>: tấm căn cước của một dự án JavaScript. Tên, phiên bản và các script nằm ở đây, và từ Bài 1.5 trở đi, cả danh sách thư viện dự án phụ thuộc vào.</p>'],
  [8, 'Tell Git who you are',
    '<p>Git stamps every saved snapshot with a name and an email, so it refuses to commit until you set them. You do this once per machine. The last command reads the settings back — always verify a setting by reading it, not by assuming it worked.</p>',
    '<p>Git đóng dấu tên và email lên mỗi bản lưu, nên nó từ chối commit tới khi bạn khai báo. Bạn làm việc này một lần cho mỗi máy. Lệnh cuối đọc lại cấu hình — luôn kiểm một thiết lập bằng cách đọc lại nó, đừng đoán là nó đã chạy.</p>'],
  [9, 'Check the whole machine',
    '<p>A small script runs each version command and prints a tick or a cross. The first run is a complete machine; the second is one where Git and VS Code are not reachable yet. It tells you exactly what is missing and what to do next.</p>',
    '<p>Một script nhỏ chạy từng lệnh hỏi phiên bản rồi in dấu tích hoặc dấu chéo. Lần chạy đầu là một máy đầy đủ; lần thứ hai là máy chưa gọi được Git và VS Code. Nó cho bạn biết chính xác thiếu gì và phải làm gì tiếp theo.</p>'],
  [10, 'Summary & practice',
    '<p>The practice is the checker itself. When it prints four out of four on your own machine, the setup is proven — not assumed — and every later lesson can start from a known good state.</p>',
    '<p>Bài luyện chính là script kiểm đó. Khi nó in bốn trên bốn trên máy của bạn, việc cài đặt đã được chứng minh — không phải giả định — và mọi bài sau đều bắt đầu từ một trạng thái chắc chắn tốt.</p>'],
]);

export default {
  title: '0.3 — Set up your machine (free tools)|||0.3 — Cài đặt máy của bạn (công cụ miễn phí)',
  slug: 'wf-0-3-cai-dat-may',
  type: 'VIDEO',
  // "Git and GitHub for Beginners - Crash Course" — freeCodeCamp.
  video: { url: 'https://youtu.be/RGOj5yH7evk', durationSeconds: 0 },
  description: 'Bốn công cụ miễn phí (trình duyệt + DevTools, VS Code, Node.js 22 + npm, Git): cài theo từng hệ điều hành, kiểm bằng lệnh --version (output thật), PATH và lỗi command not found, chạy tệp JS đầu tiên, npm init, cấu hình Git, và script kiem-may.mjs tự soát cả máy.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Four tools you install once and use forever</h2>
<p class="lead">After this lesson your computer has everything this course needs: a browser with its developer tools, VS Code, Node.js with npm, and Git. More importantly, you can <em>prove</em> each one works with a single command, you understand why "command not found" happens and how to fix it, and you have run your first JavaScript file outside a browser. You need this because a half-installed tool is the worst way to start: its errors look exactly like your own mistakes, and you cannot tell whether you misunderstood the lesson or the machine is broken.</p>

<h3>What you are installing, and why</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Browser + DevTools</span><span class="lz-t">see the result</span><span class="lz-d">Chrome or Firefox. DevTools (F12) shows the page's elements, JavaScript messages and every network request.</span></div>
<div class="lz-layer"><span class="lz-k">VS Code</span><span class="lz-t">write the code</span><span class="lz-d">A free code editor. It understands HTML, CSS and JavaScript and has a terminal built in. Lesson 1.2 turns it into a workshop.</span></div>
<div class="lz-layer"><span class="lz-k">Node.js + npm</span><span class="lz-t">run JavaScript anywhere</span><span class="lz-d">Node runs JavaScript without a browser — that is what a backend is. npm comes with it and installs libraries.</span></div>
<div class="lz-layer"><span class="lz-k">Git</span><span class="lz-t">save your history</span><span class="lz-d">Records snapshots of your code so you can undo mistakes and share work. GitHub, the website that hosts them, comes in Lesson 1.4.</span></div>
</div>
<p>Everything here is free and works on Windows, macOS and Linux. Installers change their screens over the years, but the checks in this lesson do not: if the check passes, the install is right.</p>

<h3>Install in this order</h3>
<table>
<thead><tr><th>Tool</th><th>Windows</th><th>macOS</th><th>Linux (Ubuntu)</th></tr></thead>
<tbody>
<tr><td>Chrome</td><td colspan="3">google.com/chrome — or use Firefox. Safari and Edge also work, but screenshots in this course use Chrome's DevTools.</td></tr>
<tr><td>VS Code</td><td>code.visualstudio.com, or <code>winget install Microsoft.VisualStudioCode</code></td><td>code.visualstudio.com, drag to Applications</td><td>the <code>.deb</code> from code.visualstudio.com</td></tr>
<tr><td>Node.js 22 LTS</td><td>nodejs.org (the LTS installer), or <code>winget install OpenJS.NodeJS.LTS</code></td><td>nodejs.org (the LTS <code>.pkg</code>)</td><td>nvm (<code>nvm install 22</code>) — the version in <code>apt</code> is often old</td></tr>
<tr><td>Git</td><td>git-scm.com, or <code>winget install Git.Git</code>. Keep the default options.</td><td>Run <code>git --version</code>; macOS offers to install it</td><td><code>sudo apt install git</code></td></tr>
</tbody>
</table>
<p><strong>LTS</strong> means Long-Term Support: the version that receives fixes for years. It is what companies run, and what this course uses. On macOS, after installing VS Code, open it, press Cmd+Shift+P, type "shell command" and choose <strong>Install 'code' command in PATH</strong>, so that the terminal can open it. On Windows the installer does this for you.</p>

<h3>Step 1 — ask each tool for its version</h3>
<p>Open a terminal: on macOS, the Terminal app; on Windows, PowerShell; on Linux, your usual one. Or use the one inside VS Code (View → Terminal). Then ask each tool who it is:</p>
${ra(OUT['_t0/out/versions'])}
<p>These are the real versions on the machine that built this course. Yours may be newer, and that is fine: Node must be 22 or higher, npm 10 or higher. If each command prints a number, the tool is installed and your terminal can find it. <strong>Write the numbers down</strong> in a note — when something breaks in three weeks, "which version were you on?" is the first question.</p>

<h3>Step 2 — understand "command not found"</h3>
<p>Sooner or later you will see this. Here it is on purpose, by misspelling <code>node</code>:</p>
${ra(OUT['_t0/out/not-found'])}
<p>The number 127 is the shell's exit code for "I could not find that program". To understand why it happens, you need one idea: <strong>PATH</strong>.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You type a word</span><span class="lz-d">The shell (the program inside the terminal) takes the first word, <code>node</code>, as a program name.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It searches PATH</span><span class="lz-d">PATH is a list of folders, stored in your terminal's environment. The shell looks through them in order.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">First match runs</span><span class="lz-d">It runs the first file with that name. See which one with <code>which node</code> (macOS/Linux) or <code>where node</code> (Windows).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">No match</span><span class="lz-d">"command not found". The program may exist on the disk — just not in a folder on the list.</span></div>
</div>
<p>Installers add their folder to PATH. But a terminal reads PATH <em>once, when it opens</em>. So there are three causes, and the checks are quick:</p>
<ol>
<li><strong>A typo.</strong> Read the command again.</li>
<li><strong>A stale terminal.</strong> Close it and open a new one — this fixes most "it did not install" reports. In VS Code, close the whole app, because its terminals inherit from it.</li>
<li><strong>Really not installed</strong> (or installed without adding to PATH). Reinstall and keep the default options.</li>
</ol>

<div class="pitfall co-tieu-de"><p><strong>Trap — Windows: "running scripts is disabled on this system".</strong> In PowerShell, <code>npm</code> can fail with an error mentioning <code>npm.ps1</code> and execution policies, even though <code>node --version</code> works. npm is fine; PowerShell is blocking script files. Run this once: <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>, then open a new terminal. Using Git Bash or Command Prompt avoids it too.</p></div>

<h3>Step 3 — run JavaScript without a browser</h3>
<p>Create a folder for your work, for example <code>code</code> in your home folder. In VS Code use <strong>File → Open Folder…</strong> to open it, create a file <code>hello.js</code>, and type:</p>
${ma('javascript', CODE['_t0/may/hello.js'])}
<p>Save it, open the terminal inside VS Code (it starts in that folder) and run it:</p>
${ra(OUT['_t0/out/hello'])}
<p>No browser was involved. Node.js read your file and ran it, and <code>console.log</code> printed to the terminal instead of the DevTools console. This is the same JavaScript you will learn in Chapter 4, and the same program that ran the 13-line server in Lesson 0.2.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "Cannot find module" on your very first file.</strong> If <code>node hello.js</code> complains that it cannot find the module, the terminal is usually in a different folder from the file. Node looks for <code>hello.js</code> in the <em>current</em> folder. Type <code>pwd</code> (where am I?) and <code>ls</code> (what is here? — <code>dir</code> in Command Prompt), then <code>cd</code> into the right folder. Also check VS Code really saved the file: a dot on its tab means unsaved changes.</p></div>

<h3>Three terminal commands for today</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pwd</span><span class="v">"Where am I?" — prints the current folder.</span></div>
  <div class="kv"><span class="k">ls</span><span class="v">"What is here?" — lists files (<code>dir</code> in Command Prompt).</span></div>
  <div class="kv"><span class="k">cd folder</span><span class="v">"Go into this folder." <code>cd ..</code> goes up one level.</span></div>
</div>
<p>That is all you need now. Lesson 1.1 teaches the terminal properly.</p>

<h3>Step 4 — your first npm project</h3>
<p>A JavaScript project is a folder with a <code>package.json</code> file — its identity card. Create a folder, go into it, and let npm make one:</p>
${ra(OUT['_t0/out/npm-init'])}
<p><code>-y</code> means "yes to all the questions". Now the folder is a project: it has a <code>name</code> and <code>version</code>, a <code>scripts</code> section for commands you run often, and from Lesson 1.5 on, the list of libraries it depends on.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — never fix npm with <code>sudo</code>.</strong> If <code>npm install -g something</code> says <code>EACCES: permission denied</code>, the instinct is to add <code>sudo</code>. That installs files owned by the system administrator into your project tools and creates worse permission errors later. Install locally in the project instead (Lesson 1.5), or use nvm, which keeps Node in your own home folder.</p></div>

<h3>Step 5 — tell Git who you are</h3>
<p>Git stamps every snapshot with a name and an email, and refuses to work until you set them. You do this once per machine. <code>init.defaultBranch main</code> names the first branch "main", matching GitHub:</p>
${ra(OUT['_t0/out/git-config'])}
<p>The last command reads the settings back. Make it a habit: <strong>a setting is confirmed by reading it back</strong>, not by the absence of an error. Use your real name and the email you will use on GitHub. (The demo ran with a temporary config file, so the output shows a made-up person.)</p>

<h3>Step 6 — let a script check the whole machine</h3>
<p>Typing four commands is fine once. Here is a tiny program that does it for you and tells you what to fix. You do not need to understand the code yet — after Chapter 4 you will. Save it as <code>kiem-may.mjs</code>:</p>
${ma('javascript', CODE['_t0/may/kiem-may.mjs'])}
<p>On a complete machine it prints:</p>
${ra(OUT['_t0/out/kiem-may'])}
<p>And on a machine where Git and VS Code cannot be found yet:</p>
${ra(OUT['_t0/out/kiem-may-thieu'])}

<div class="pitfall co-tieu-de"><p><strong>Trap — following a tutorial written for a different major version.</strong> A blog post from 2019 that says <code>npm install -g create-react-app</code>, or a video using Node 14 syntax, will fail in ways that look like <em>your</em> mistake. The error rarely says "wrong version"; it mentions a missing module or an unexpected token, and you lose an hour. Before trusting a tutorial, check its date and compare the version it assumes with what <code>--version</code> printed. When they differ, prefer the official documentation, which is versioned.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — keeping projects in a synced folder or a path with spaces.</strong> OneDrive, iCloud Drive and Google Drive try to sync every file, and a project's <code>node_modules</code> folder holds tens of thousands. Your machine crawls and files get locked. Some older tools also break on paths with spaces or accented letters, like <code>C:&#92;Users&#92;Đức Anh&#92;</code>. Keep your work in a plain folder such as <code>C:&#92;code</code> or <code>~/code</code>.</p></div>

<h3>A first look at DevTools</h3>
<p>Open any page in Chrome and press <strong>F12</strong> (Cmd+Option+I on a Mac). You will live in three tabs:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Elements</span><span class="v">The page's real HTML and CSS. Try editing some text directly; a reload undoes it. Chapters 2–3.</span></div>
  <div class="kv"><span class="k">Console</span><span class="v">JavaScript messages and errors. You can type JavaScript here: try <code>2 + 3</code>. Chapter 4.</span></div>
  <div class="kv"><span class="k">Network</span><span class="v">Every request and response, as in Lesson 0.2. Chapters 5–7.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes, mostly waiting for downloads)</strong></p>
<ol>
<li>Install the four tools. Then open a <strong>new</strong> terminal.</li>
<li>Run the four version commands and write the numbers in a note.</li>
<li>Run <code>hello.js</code> with your own name in it.</li>
<li>Create a folder <code>my-first-project</code> and run <code>npm init -y</code>.</li>
<li>Set your Git name and email, and read them back with <code>git config --global --list</code>.</li>
<li>Save <code>kiem-may.mjs</code> and run <code>node kiem-may.mjs</code>.</li>
</ol>
<p>Hint: a line with ✗ names the tool; install it, or on macOS run the "shell command" step for <code>code</code>, then open a new terminal and run the script again.</p>
<p><strong>Done when:</strong> <code>node kiem-may.mjs</code> prints <code>4/4 tools ready</code> on your machine, <code>my-first-project/package.json</code> exists, and <code>git config --global user.name</code> prints your name.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">terminal</span><span class="v">cửa sổ dòng lệnh — nơi gõ lệnh bằng chữ.</span></div>
  <div class="kv"><span class="k">shell</span><span class="v">chương trình đọc lệnh trong terminal (zsh, bash, PowerShell).</span></div>
  <div class="kv"><span class="k">PATH</span><span class="v">danh sách thư mục shell tìm chương trình.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — số một lệnh trả về; 0 = thành công.</span></div>
  <div class="kv"><span class="k">Node.js</span><span class="v">môi trường chạy JavaScript ngoài trình duyệt.</span></div>
  <div class="kv"><span class="k">npm</span><span class="v">trình quản lý gói của Node.js — cài thư viện.</span></div>
  <div class="kv"><span class="k">LTS</span><span class="v">hỗ trợ dài hạn — bản được vá lỗi nhiều năm.</span></div>
  <div class="kv"><span class="k">package.json</span><span class="v">"căn cước" của một dự án JavaScript.</span></div>
  <div class="kv"><span class="k">Git</span><span class="v">hệ thống quản lý phiên bản — lưu lịch sử mã.</span></div>
  <div class="kv"><span class="k">DevTools</span><span class="v">công cụ nhà phát triển trong trình duyệt (F12).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Four tools: browser + DevTools, VS Code, Node.js + npm, Git. All free.</li>
  <li>Prove every install with <code>--version</code>; write the numbers down.</li>
  <li>"command not found" means the shell did not find it on PATH: check for a typo, open a new terminal, then reinstall.</li>
  <li><code>node file.js</code> runs JavaScript without a browser, from the current folder.</li>
  <li><code>npm init -y</code> creates <code>package.json</code>; never fix npm with <code>sudo</code>.</li>
  <li>Set your Git name and email once and read them back.</li>
  <li>Check tutorials' dates; keep projects outside synced folders.</li>
</ul>
${nguon('📗', 'Node.js — download the LTS version', 'The official installers for every system', 'https://nodejs.org/en/download')}
${nguon('📘', 'VS Code — Setup overview', 'Installation notes for Windows, macOS and Linux, including the code command', 'https://code.visualstudio.com/docs/setup/setup-overview')}
${nguon('📙', 'Git — Installing Git', 'From the free Pro Git book', 'https://git-scm.com/book/en/v2/Getting-Started-Installing-Git')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-3-cai-dat', title: 'Node.js 0.3 — setup for the backend course', sub: 'The next stage: a Node version manager and a readiness check for the backend course', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Bốn công cụ cài một lần, dùng mãi mãi</h2>
<p class="lead">Học xong bài này máy của bạn có đủ mọi thứ khoá cần: một trình duyệt kèm công cụ nhà phát triển, VS Code, Node.js kèm npm, và Git. Quan trọng hơn, bạn <em>chứng minh</em> được từng cái chạy tốt bằng một lệnh duy nhất, hiểu vì sao có lỗi "command not found" và sửa thế nào, và đã chạy tệp JavaScript đầu tiên ngoài trình duyệt. Bạn cần điều này vì một công cụ cài dở là cách khởi đầu tệ nhất: lỗi của nó trông y hệt lỗi của chính bạn, và bạn không phân biệt nổi mình hiểu sai bài hay máy đang hỏng.</p>

<h3>Bạn đang cài gì, và để làm gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Trình duyệt + DevTools</span><span class="lz-t">xem kết quả</span><span class="lz-d">Chrome hoặc Firefox. DevTools (F12) hiện các phần tử của trang, thông điệp JavaScript và mọi request mạng.</span></div>
<div class="lz-layer"><span class="lz-k">VS Code</span><span class="lz-t">viết mã</span><span class="lz-d">Trình soạn mã miễn phí. Nó hiểu HTML, CSS, JavaScript và có sẵn terminal. Bài 1.2 biến nó thành một xưởng làm việc.</span></div>
<div class="lz-layer"><span class="lz-k">Node.js + npm</span><span class="lz-t">chạy JavaScript ở mọi nơi</span><span class="lz-d">Node chạy JavaScript không cần trình duyệt — đó chính là backend. npm đi kèm và dùng để cài thư viện.</span></div>
<div class="lz-layer"><span class="lz-k">Git</span><span class="lz-t">lưu lịch sử</span><span class="lz-d">Ghi lại các bản chụp mã nguồn để bạn hoàn tác lỗi và chia sẻ công việc. GitHub, website lưu trữ chúng, đến ở Bài 1.4.</span></div>
</div>
<p>Mọi thứ ở đây miễn phí và chạy trên Windows, macOS, Linux. Màn hình trình cài đặt đổi theo năm tháng, nhưng các phép kiểm trong bài này thì không: phép kiểm đạt nghĩa là đã cài đúng.</p>

<h3>Cài theo thứ tự này</h3>
<table>
<thead><tr><th>Công cụ</th><th>Windows</th><th>macOS</th><th>Linux (Ubuntu)</th></tr></thead>
<tbody>
<tr><td>Chrome</td><td colspan="3">google.com/chrome — hoặc dùng Firefox. Safari và Edge cũng được, nhưng ảnh trong khoá dùng DevTools của Chrome.</td></tr>
<tr><td>VS Code</td><td>code.visualstudio.com, hoặc <code>winget install Microsoft.VisualStudioCode</code></td><td>code.visualstudio.com, kéo vào Applications</td><td>tệp <code>.deb</code> từ code.visualstudio.com</td></tr>
<tr><td>Node.js 22 LTS</td><td>nodejs.org (bản cài LTS), hoặc <code>winget install OpenJS.NodeJS.LTS</code></td><td>nodejs.org (tệp <code>.pkg</code> LTS)</td><td>nvm (<code>nvm install 22</code>) — bản trong <code>apt</code> thường cũ</td></tr>
<tr><td>Git</td><td>git-scm.com, hoặc <code>winget install Git.Git</code>. Giữ tuỳ chọn mặc định.</td><td>Chạy <code>git --version</code>; macOS sẽ đề nghị cài</td><td><code>sudo apt install git</code></td></tr>
</tbody>
</table>
<p><strong>LTS</strong> là Long-Term Support (hỗ trợ dài hạn): phiên bản được vá lỗi nhiều năm. Đó là bản các công ty dùng, và là bản khoá này dùng. Trên macOS, cài VS Code xong hãy mở nó, nhấn Cmd+Shift+P, gõ "shell command" rồi chọn <strong>Install 'code' command in PATH</strong>, để terminal mở được nó. Trên Windows trình cài đặt tự làm việc này.</p>

<h3>Bước 1 — hỏi phiên bản của từng công cụ</h3>
<p>Mở một terminal: trên macOS là ứng dụng Terminal; trên Windows là PowerShell; trên Linux là cái bạn vẫn dùng. Hoặc dùng terminal trong VS Code (View → Terminal). Rồi hỏi từng công cụ xem nó là ai:</p>
${ra(OUT['_t0/out/versions'])}
<p>Đây là phiên bản thật trên máy đã dựng khoá này. Của bạn có thể mới hơn, không sao: Node phải từ 22 trở lên, npm từ 10 trở lên. Nếu mỗi lệnh in ra một con số, công cụ đã được cài và terminal tìm được nó. <strong>Ghi các con số lại</strong> vào sổ — ba tuần sau có gì hỏng, "bạn đang ở phiên bản nào?" sẽ là câu hỏi đầu tiên.</p>

<h3>Bước 2 — hiểu "command not found"</h3>
<p>Sớm muộn gì bạn cũng gặp nó. Đây là cố ý tạo ra, bằng cách gõ sai <code>node</code>:</p>
${ra(OUT['_t0/out/not-found'])}
<p>Số 127 là mã thoát của shell có nghĩa "tôi không tìm thấy chương trình đó". Muốn hiểu vì sao, bạn cần một ý: <strong>PATH</strong>.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn gõ một từ</span><span class="lz-d">Shell (chương trình bên trong terminal) coi từ đầu tiên, <code>node</code>, là tên chương trình.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó tìm trong PATH</span><span class="lz-d">PATH là danh sách thư mục, nằm trong môi trường của terminal. Shell duyệt chúng theo thứ tự.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Thấy đầu tiên thì chạy</span><span class="lz-d">Nó chạy tệp đầu tiên trùng tên. Xem là tệp nào bằng <code>which node</code> (macOS/Linux) hoặc <code>where node</code> (Windows).</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Không thấy</span><span class="lz-d">"command not found". Chương trình có thể có trên đĩa — chỉ là không nằm trong thư mục nào của danh sách.</span></div>
</div>
<p>Trình cài đặt thêm thư mục của nó vào PATH. Nhưng terminal chỉ đọc PATH <em>một lần, lúc mở</em>. Vậy là có ba nguyên nhân, và kiểm rất nhanh:</p>
<ol>
<li><strong>Gõ sai.</strong> Đọc lại lệnh.</li>
<li><strong>Terminal cũ.</strong> Đóng và mở cái mới — cách này giải quyết đa số trường hợp "cài không được". Trong VS Code, hãy đóng hẳn ứng dụng, vì terminal của nó thừa hưởng từ nó.</li>
<li><strong>Thật sự chưa cài</strong> (hoặc cài mà không thêm vào PATH). Cài lại và giữ tuỳ chọn mặc định.</li>
</ol>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — Windows: "running scripts is disabled on this system".</strong> Trong PowerShell, <code>npm</code> có thể báo lỗi nhắc tới <code>npm.ps1</code> và execution policy, dù <code>node --version</code> vẫn chạy. npm không sao cả; PowerShell đang chặn tệp script. Chạy một lần: <code>Set-ExecutionPolicy -Scope CurrentUser RemoteSigned</code>, rồi mở terminal mới. Dùng Git Bash hoặc Command Prompt cũng tránh được.</p></div>

<h3>Bước 3 — chạy JavaScript không cần trình duyệt</h3>
<p>Tạo một thư mục làm việc, ví dụ <code>code</code> trong thư mục nhà. Trong VS Code dùng <strong>File → Open Folder…</strong> để mở nó, tạo tệp <code>hello.js</code>, rồi gõ:</p>
${ma('javascript', CODE['_t0/may/hello.js'])}
<p>Lưu lại, mở terminal trong VS Code (nó bắt đầu ở đúng thư mục đó) rồi chạy:</p>
${ra(OUT['_t0/out/hello'])}
<p>Không có trình duyệt nào tham gia. Node.js đọc tệp của bạn và chạy nó, và <code>console.log</code> in ra terminal thay vì console của DevTools. Đây vẫn là thứ JavaScript bạn sẽ học ở Chương 4, và là chương trình đã chạy máy chủ 13 dòng ở Bài 0.2.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "Cannot find module" ngay với tệp đầu tiên.</strong> Nếu <code>node hello.js</code> báo không tìm thấy module, thường là terminal đang ở thư mục khác với tệp. Node tìm <code>hello.js</code> trong thư mục <em>hiện tại</em>. Gõ <code>pwd</code> (tôi đang ở đâu?) và <code>ls</code> (ở đây có gì? — <code>dir</code> trong Command Prompt), rồi <code>cd</code> vào đúng thư mục. Cũng kiểm xem VS Code đã lưu tệp chưa: dấu chấm trên thẻ nghĩa là còn thay đổi chưa lưu.</p></div>

<h3>Ba lệnh terminal cho hôm nay</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pwd</span><span class="v">"Tôi đang ở đâu?" — in thư mục hiện tại.</span></div>
  <div class="kv"><span class="k">ls</span><span class="v">"Ở đây có gì?" — liệt kê tệp (<code>dir</code> trong Command Prompt).</span></div>
  <div class="kv"><span class="k">cd thumuc</span><span class="v">"Đi vào thư mục này." <code>cd ..</code> đi lên một cấp.</span></div>
</div>
<p>Giờ chỉ cần chừng đó. Bài 1.1 sẽ dạy terminal bài bản.</p>

<h3>Bước 4 — dự án npm đầu tiên</h3>
<p>Một dự án JavaScript là một thư mục có tệp <code>package.json</code> — tấm căn cước của nó. Tạo một thư mục, đi vào, và để npm tạo tệp đó:</p>
${ra(OUT['_t0/out/npm-init'])}
<p><code>-y</code> nghĩa là "đồng ý hết các câu hỏi". Giờ thư mục đã là một dự án: nó có <code>name</code> và <code>version</code>, mục <code>scripts</code> cho những lệnh hay chạy, và từ Bài 1.5 trở đi, cả danh sách thư viện nó phụ thuộc vào.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đừng bao giờ sửa npm bằng <code>sudo</code>.</strong> Nếu <code>npm install -g thu-gi-do</code> báo <code>EACCES: permission denied</code>, phản xạ là thêm <code>sudo</code>. Làm vậy sẽ cài các tệp thuộc quyền quản trị hệ thống vào bộ công cụ của bạn và tạo ra lỗi quyền tệ hơn về sau. Hãy cài cục bộ trong dự án (Bài 1.5), hoặc dùng nvm, thứ giữ Node trong thư mục nhà của bạn.</p></div>

<h3>Bước 5 — cho Git biết bạn là ai</h3>
<p>Git đóng dấu tên và email lên mỗi bản chụp, và từ chối làm việc tới khi bạn khai báo. Bạn làm việc này một lần cho mỗi máy. <code>init.defaultBranch main</code> đặt tên nhánh đầu tiên là "main", khớp với GitHub:</p>
${ra(OUT['_t0/out/git-config'])}
<p>Lệnh cuối đọc lại các thiết lập. Hãy tạo thói quen: <strong>một thiết lập được xác nhận bằng cách đọc lại nó</strong>, không phải bằng việc không có lỗi. Hãy dùng tên thật và email bạn sẽ dùng trên GitHub. (Bản demo chạy với tệp cấu hình tạm, nên output hiện một người giả định.)</p>

<h3>Bước 6 — để script kiểm cả máy</h3>
<p>Gõ bốn lệnh thì được một lần. Đây là một chương trình tí hon làm hộ bạn và nói cho bạn biết phải sửa gì. Bạn chưa cần hiểu mã — học xong Chương 4 sẽ hiểu. Lưu nó thành <code>kiem-may.mjs</code>:</p>
${ma('javascript', CODE['_t0/may/kiem-may.mjs'])}
<p>Trên một máy đầy đủ nó in ra:</p>
${ra(OUT['_t0/out/kiem-may'])}
<p>Và trên một máy chưa tìm thấy Git và VS Code:</p>
${ra(OUT['_t0/out/kiem-may-thieu'])}

<div class="pitfall co-tieu-de"><p><strong>Bẫy — làm theo hướng dẫn viết cho phiên bản chính khác.</strong> Một bài blog năm 2019 bảo <code>npm install -g create-react-app</code>, hay một video dùng cú pháp Node 14, sẽ hỏng theo cách trông như lỗi <em>của bạn</em>. Lỗi hiếm khi nói "sai phiên bản"; nó nhắc tới một module thiếu hay một token lạ, và bạn mất một giờ. Trước khi tin một hướng dẫn, xem ngày viết và so phiên bản nó giả định với thứ <code>--version</code> đã in. Nếu khác, ưu tiên tài liệu chính thức, vốn được đánh phiên bản.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — để dự án trong thư mục đồng bộ hoặc đường dẫn có dấu cách.</strong> OneDrive, iCloud Drive và Google Drive cố đồng bộ từng tệp, mà thư mục <code>node_modules</code> của một dự án chứa hàng chục nghìn tệp. Máy ì ạch và tệp bị khoá. Vài công cụ cũ cũng hỏng với đường dẫn có dấu cách hay chữ có dấu, như <code>C:&#92;Users&#92;Đức Anh&#92;</code>. Hãy để công việc trong một thư mục đơn giản như <code>C:&#92;code</code> hoặc <code>~/code</code>.</p></div>

<h3>Cái nhìn đầu tiên về DevTools</h3>
<p>Mở một trang bất kỳ trong Chrome và nhấn <strong>F12</strong> (Cmd+Option+I trên Mac). Bạn sẽ sống trong ba thẻ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Elements</span><span class="v">HTML và CSS thật của trang. Thử sửa trực tiếp một dòng chữ; tải lại là mất. Chương 2–3.</span></div>
  <div class="kv"><span class="k">Console</span><span class="v">Thông điệp và lỗi JavaScript. Bạn gõ được JavaScript ở đây: thử <code>2 + 3</code>. Chương 4.</span></div>
  <div class="kv"><span class="k">Network</span><span class="v">Mọi request và response, như ở Bài 0.2. Chương 5–7.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút, chủ yếu là chờ tải)</strong></p>
<ol>
<li>Cài bốn công cụ. Rồi mở một terminal <strong>mới</strong>.</li>
<li>Chạy bốn lệnh hỏi phiên bản và ghi các con số vào sổ.</li>
<li>Chạy <code>hello.js</code> với tên của bạn.</li>
<li>Tạo thư mục <code>my-first-project</code> và chạy <code>npm init -y</code>.</li>
<li>Đặt tên và email Git, rồi đọc lại bằng <code>git config --global --list</code>.</li>
<li>Lưu <code>kiem-may.mjs</code> và chạy <code>node kiem-may.mjs</code>.</li>
</ol>
<p>Gợi ý: dòng có ✗ nêu tên công cụ; hãy cài nó, hoặc trên macOS chạy bước "shell command" cho <code>code</code>, rồi mở terminal mới và chạy lại script.</p>
<p><strong>Xong khi:</strong> <code>node kiem-may.mjs</code> in <code>4/4 tools ready</code> trên máy bạn, có tệp <code>my-first-project/package.json</code>, và <code>git config --global user.name</code> in ra tên bạn.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">terminal</span><span class="v">cửa sổ dòng lệnh — nơi gõ lệnh bằng chữ.</span></div>
  <div class="kv"><span class="k">shell</span><span class="v">chương trình đọc lệnh trong terminal (zsh, bash, PowerShell).</span></div>
  <div class="kv"><span class="k">PATH</span><span class="v">danh sách thư mục shell tìm chương trình.</span></div>
  <div class="kv"><span class="k">exit code</span><span class="v">mã thoát — số một lệnh trả về; 0 = thành công.</span></div>
  <div class="kv"><span class="k">Node.js</span><span class="v">môi trường chạy JavaScript ngoài trình duyệt.</span></div>
  <div class="kv"><span class="k">npm</span><span class="v">trình quản lý gói của Node.js — cài thư viện.</span></div>
  <div class="kv"><span class="k">LTS</span><span class="v">hỗ trợ dài hạn — bản được vá lỗi nhiều năm.</span></div>
  <div class="kv"><span class="k">package.json</span><span class="v">"căn cước" của một dự án JavaScript.</span></div>
  <div class="kv"><span class="k">Git</span><span class="v">hệ thống quản lý phiên bản — lưu lịch sử mã.</span></div>
  <div class="kv"><span class="k">DevTools</span><span class="v">công cụ nhà phát triển trong trình duyệt (F12).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bốn công cụ: trình duyệt + DevTools, VS Code, Node.js + npm, Git. Đều miễn phí.</li>
  <li>Chứng minh mỗi lần cài bằng <code>--version</code>; ghi con số lại.</li>
  <li>"command not found" nghĩa là shell không thấy nó trong PATH: kiểm lỗi gõ, mở terminal mới, rồi cài lại.</li>
  <li><code>node tep.js</code> chạy JavaScript không cần trình duyệt, tính từ thư mục hiện tại.</li>
  <li><code>npm init -y</code> tạo <code>package.json</code>; đừng bao giờ sửa npm bằng <code>sudo</code>.</li>
  <li>Đặt tên và email Git một lần rồi đọc lại.</li>
  <li>Xem ngày viết của hướng dẫn; để dự án ngoài thư mục đồng bộ.</li>
</ul>
${nguon('📗', 'Node.js — tải bản LTS', 'Trình cài đặt chính thức cho mọi hệ điều hành', 'https://nodejs.org/en/download')}
${nguon('📘', 'VS Code — Setup overview', 'Ghi chú cài đặt cho Windows, macOS và Linux, gồm cả lệnh code', 'https://code.visualstudio.com/docs/setup/setup-overview')}
${nguon('📙', 'Git — Installing Git', 'Trích cuốn Pro Git miễn phí', 'https://git-scm.com/book/en/v2/Getting-Started-Installing-Git')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-0-3-cai-dat', title: 'Node.js 0.3 — cài đặt cho khoá backend', sub: 'Chặng tiếp theo: trình quản lý phiên bản Node và phép kiểm máy cho khoá backend', cta: 'Mở bài' })}
</div>
`,
};
