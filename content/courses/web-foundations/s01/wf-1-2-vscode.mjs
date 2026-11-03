/**
 * Bài 1.2 — VS Code: xưởng làm việc (nâng cấp 01/11/2026). Output thật: Prettier 3.9.10, ESLint 10.14.0,
 * TypeScript 5.9.3 (dịch vụ ngôn ngữ mà F2 gọi), Node 22.23.3 — chạy trong _demo/_t1/vscode.
 * Deck: scripts/slides-src/wf-1-2.mjs (11 slide). Giữ video YouTube ngoài của bài cũ.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const SHOP = CODE['_t1/vscode/rename.mjs'].split('`')[1].trim();

const G = walkWf('wf-1-2', 'VS Code: your workshop', 'VS Code: xưởng làm việc', [
  [1, 'VS Code: your workshop',
    '<p>You will spend more hours in your editor than in any other program, so a little setup pays back every day. This lesson sets VS Code up the way professional teams do: tools that format your code and catch mistakes automatically, so your attention goes to the actual problem.</p>',
    '<p>Bạn sẽ ngồi trong trình soạn thảo nhiều giờ hơn mọi chương trình khác, nên cài đặt một chút là được trả lại mỗi ngày. Bài này cài VS Code theo cách các nhóm chuyên nghiệp làm: công cụ tự định dạng mã và tự bắt lỗi, để sự chú ý của bạn dành cho vấn đề thật.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills: open a project the right way and know the four areas of the window, let Prettier format on every save, read what ESLint underlines, rename safely with F2, and share editor settings with a team through a folder named <code>.vscode</code>.</p>',
    '<p>Năm kỹ năng: mở dự án đúng cách và biết bốn vùng của cửa sổ, để Prettier định dạng mỗi lần lưu, đọc những gì ESLint gạch chân, đổi tên an toàn bằng F2, và chia sẻ cài đặt trình soạn thảo với cả nhóm qua thư mục <code>.vscode</code>.</p>'],
  [3, 'Open a folder, not a file',
    '<p>The most important habit. A project is a folder: source files, configuration files, and a <code>.vscode</code> folder with settings for this project. When you open the folder, every feature that needs the whole project — search, the terminal, the linter — starts working.</p>',
    '<p>Thói quen quan trọng nhất. Một dự án là một thư mục: file mã nguồn, file cấu hình, và thư mục <code>.vscode</code> chứa cài đặt cho riêng dự án này. Khi bạn mở thư mục, mọi tính năng cần cả dự án — tìm kiếm, terminal, linter — bắt đầu hoạt động.</p>'],
  [4, 'The four areas',
    '<p>Explorer on the left, the editor in the middle, the terminal at the bottom, and the Command Palette, which you open with a shortcut. If you remember only one shortcut, make it the Command Palette: every command in every menu can be found there by typing its name.</p>',
    '<p>Explorer bên trái, trình soạn thảo ở giữa, terminal ở dưới, và Command Palette mở bằng phím tắt. Nếu chỉ nhớ một phím tắt, hãy nhớ Command Palette: mọi lệnh trong mọi menu đều tìm được ở đó bằng cách gõ tên.</p>'],
  [5, 'Prettier',
    '<p>A real file written in a hurry. Prettier’s check fails with exit code one; the write command rewrites the file into a standard layout, and the program prints the same total as before. Format on Save is exactly this command, run every time you press save.</p>',
    '<p>Một file thật viết vội. Lệnh kiểm của Prettier thất bại với mã thoát một; lệnh ghi viết lại file theo bố cục chuẩn, và chương trình in đúng tổng như trước. Format on Save chính là lệnh này, chạy mỗi lần bạn bấm lưu.</p>'],
  [6, 'ESLint',
    '<p>This file loads without any error, yet ESLint finds five problems: an unused variable, an assignment where a comparison was meant, a loose equality, and a misspelled function name. The ESLint extension draws exactly this list as squiggly underlines while you type.</p>',
    '<p>File này nạp không báo lỗi gì, vậy mà ESLint tìm ra năm vấn đề: một biến không dùng, một phép gán ở chỗ lẽ ra là phép so sánh, một phép so sánh lỏng, và một tên hàm gõ sai. Extension ESLint vẽ đúng danh sách này thành các đường gạch lượn sóng ngay khi bạn gõ.</p>'],
  [7, 'F2 rename',
    '<p>A plain text search for "total" finds nine matches, including a comment, a string, a different word and a different variable. Rename Symbol asks the language service, which understands scope, and changes exactly the three places that are this variable.</p>',
    '<p>Tìm chữ "total" thông thường ra chín chỗ, gồm cả một chú thích, một chuỗi, một từ khác và một biến khác. Rename Symbol hỏi dịch vụ ngôn ngữ — thứ hiểu phạm vi — và chỉ đổi đúng ba chỗ là biến này.</p>'],
  [8, 'Project settings',
    '<p>Settings in <code>.vscode/settings.json</code> apply to everyone who opens this folder: format on save and automatic ESLint fixes. <code>extensions.json</code> makes VS Code suggest the right extensions. Commit both; keep personal choices like the theme in your user settings.</p>',
    '<p>Cài đặt trong <code>.vscode/settings.json</code> áp dụng cho mọi người mở thư mục này: định dạng khi lưu và tự sửa lỗi ESLint. <code>extensions.json</code> khiến VS Code gợi ý đúng extension. Commit cả hai; lựa chọn cá nhân như giao diện màu thì để trong cài đặt người dùng.</p>'],
  [9, 'The debugger',
    '<p>Instead of adding <code>console.log</code> everywhere, set a breakpoint, press F5, and the program pauses on that line. You can read every variable, step one line at a time, and watch the total grow. <code>launch.json</code> tells F5 which program to start.</p>',
    '<p>Thay vì rải <code>console.log</code> khắp nơi, đặt một điểm dừng, bấm F5, và chương trình dừng ở dòng đó. Bạn đọc được mọi biến, đi từng dòng một, và nhìn tổng tăng dần. <code>launch.json</code> cho F5 biết chạy chương trình nào.</p>'],
  [10, 'Shortcuts and traps',
    '<p>Six shortcuts cover most of the day. The traps are the opposite of the habits in this lesson: opening single files, installing twenty extensions in the first week, and fixing spacing by hand instead of letting the formatter do it.</p>',
    '<p>Sáu phím tắt đủ cho phần lớn một ngày làm việc. Các bẫy là mặt trái của thói quen trong bài: mở từng file lẻ, cài hai chục extension ngay tuần đầu, và tự tay chỉnh khoảng trắng thay vì để bộ định dạng làm.</p>'],
  [11, 'Summary & practice',
    '<p>The practice builds this exact setup in your own folder. When saving a messy file fixes it and ESLint reports nothing, your editor is doing a share of the work for you — and it will keep doing it in every chapter after this one.</p>',
    '<p>Bài luyện dựng đúng cấu hình này trong thư mục của bạn. Khi lưu một file lộn xộn là nó tự gọn và ESLint không báo gì, trình soạn thảo đã gánh một phần việc cho bạn — và nó sẽ tiếp tục gánh ở mọi chương sau.</p>'],
]);

export default {
  title: '1.2 — VS Code: your workshop|||1.2 — VS Code: xưởng làm việc của bạn',
  slug: 'wf-1-2-vscode',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/B-s71n0dHUk', durationSeconds: 0 },
  description: 'Mở thư mục làm dự án, bốn vùng của cửa sổ, Prettier định dạng khi lưu và ESLint bắt 5 lỗi thật trong một file vẫn chạy (output thật), F2 đổi tên đúng 3 chỗ thay vì 9, .vscode/settings.json + extensions.json cho cả nhóm, trình gỡ lỗi với điểm dừng, phím tắt và bẫy.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Your editor is a workshop, not a notepad</h2>
<p class="lead">After this lesson you can open a project the way professionals do, find your way around VS Code’s four main areas, make your code format itself every time you save, read the mistakes a linter underlines before you even run the program, rename a variable safely, share editor settings with a team, and pause a running program with the debugger. Why it matters: a plain text editor only stores what you type, while a configured editor works alongside you — it fixes layout, spots typos in variable names, and catches the classic <code>=</code> versus <code>===</code> bug that would otherwise cost you an hour. Every output below comes from real runs of Prettier 3.9, ESLint 10 and the TypeScript 5.9 language service (the engine behind VS Code’s JavaScript features) on Node 22.</p>

<h3>Step 0 — install, then open a folder</h3>
<p>Download VS Code from <strong>code.visualstudio.com</strong> (Windows, macOS and Linux are all free). Then make one habit automatic: <strong>File → Open Folder…</strong> and choose the folder of your project — never a single file, and never a huge parent folder such as <code>Documents</code>. On macOS, run <em>Shell Command: Install 'code' command in PATH</em> from the Command Palette once; after that, typing <code>code .</code> in a terminal opens the current folder (on Windows the installer adds this for you).</p>
${ma('bash', `ct-shop/            ← File → Open Folder…  (or: cd ct-shop && code .)
├─ .vscode/        ← settings for THIS project, committed with it
│  ├─ settings.json
│  ├─ extensions.json
│  └─ launch.json
├─ src/
│  ├─ cart.js
│  └─ messy.js
├─ eslint.config.js
├─ .prettierrc.json
├─ .editorconfig
└─ package.json`)}
<p>This is the small project used throughout the lesson. When VS Code opens it as a folder, it treats everything inside as one project: the file tree shows it, project-wide search covers it, the built-in terminal starts inside it, the linter finds its configuration file, and the settings in <code>.vscode/</code> apply. Open just <code>cart.js</code> on its own and none of that happens — which is the most common reason a beginner says "the extension does not work".</p>

<h3>The four areas you will use every day</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Explorer (left) — Ctrl/Cmd+Shift+E</span><span class="v">The file tree. Click to open; right-click to create, rename or delete. The dot next to a file name means unsaved changes.</span></div>
  <div class="kv"><span class="k">Editor (centre)</span><span class="v">Where you write. Files open as tabs; drag a tab to the side to see two files at once.</span></div>
  <div class="kv"><span class="k">Terminal (bottom) — Ctrl+&#96;</span><span class="v">A real terminal (lesson 1.1) that already starts inside your project folder. Run <code>npm</code>, <code>git</code> and <code>node</code> here.</span></div>
  <div class="kv"><span class="k">Command Palette — Ctrl/Cmd+Shift+P</span><span class="v">A search box for every command. Type "format", "settings" or "git" instead of hunting through menus.</span></div>
</div>
<p>Two more places are worth knowing early. The <strong>status bar</strong> at the very bottom shows the language of the current file, line endings, and whether the formatter or linter is running. The <strong>Problems panel</strong> (Ctrl/Cmd+Shift+M) lists every error and warning in the project in one place — the same list you will see in the terminal below.</p>

<h3>What happens when you press save</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">You type</span><span class="lz-d">Messy spacing, quotes of both kinds, a typo in a variable name — normal when you are thinking about the problem.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Prettier formats</span><span class="lz-d">On save, the formatter rewrites the layout to one standard style. Meaning never changes.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ESLint checks</span><span class="lz-d">The linter reads the code without running it and underlines likely bugs. Some it can fix itself.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">You fix what is left</span><span class="lz-d">Only real problems remain on screen, so your attention goes where it matters — then you commit (lesson 1.3).</span></div>
</div>

<h3>Step 1 — Prettier: formatting is not your job</h3>
<p>Here is a file written in a hurry. It works; it is just hard to read.</p>
${ma('javascript', CODE['_t1/vscode/src/messy.js'])}
<p>Prettier is a <strong>formatter</strong>: it rewrites code into one consistent layout. First ask it to check the file:</p>
${ra(OUT['_t1/vscode/out/prettier-check'])}
<p>Exit code 1 means "not formatted" — that is how a CI pipeline can refuse unformatted code (lesson 13.4). Now let it fix the file:</p>
${ra(OUT['_t1/vscode/out/prettier-write'])}
<p>Look at what changed and what did not. Spaces, line breaks, the trailing semicolons and the quote style (single quotes, because <code>.prettierrc.json</code> says <code>"singleQuote": true</code>) all changed. The behaviour did not: the program prints <code>Total: 600000</code> before and after. That is the promise of a formatter — layout only, never meaning.</p>
${ma('json', CODE['_t1/vscode/.prettierrc.json'])}
<p>Why bother? Because consistent formatting makes <strong>Git diffs</strong> show only real changes. If two people format differently, every commit becomes a wall of red and green spacing changes and nobody can see the one line that matters. When the whole team formats on save with the same configuration file, that problem disappears and nobody ever argues about tabs again.</p>
<p>In VS Code you never run the command yourself: install the <strong>Prettier</strong> extension, set it as the default formatter and turn on <strong>Format On Save</strong> (Step 4 does it for the whole project). From then on, pressing Ctrl/Cmd+S runs exactly the <code>--write</code> above on the current file.</p>

<h3>Step 2 — ESLint: bugs underlined before you run anything</h3>
<p>This file has no syntax error. Node loads it without complaint. It still contains three real bugs:</p>
${ma('javascript', CODE['_t1/vscode/src/cart.js'])}
<p>ESLint is a <strong>linter</strong>: it reads code without running it and reports patterns that are almost always mistakes. Its configuration lives in one file:</p>
${ma('javascript', CODE['_t1/vscode/eslint.config.js'])}
${ra(OUT['_t1/vscode/out/eslint'])}
<p>Read each line as <em>line:column — severity — message — rule name</em>. What they mean, in plain words:</p>
<ul>
  <li><strong>3:9 no-unused-vars</strong> — <code>discount</code> is created and never used. Usually it means you forgot to apply it, so the price is wrong.</li>
  <li><strong>4:7 no-cond-assign</strong> and <strong>no-constant-condition</strong> — <code>if (qty = 0)</code> <em>assigns</em> 0 to <code>qty</code>; it does not compare. The condition is always false, the early return never happens, and every item is pushed into the cart with quantity 0. One missing <code>=</code>, two warnings.</li>
  <li><strong>7:18 eqeqeq</strong> — <code>==</code> converts types before comparing, so <code>0 == '0'</code> is true. The rule we added asks for <code>===</code>, which compares type and value (lesson 4.1).</li>
  <li><strong>11:10 no-undef</strong> — <code>totl</code> does not exist. JavaScript would only find out when this line runs, by throwing <code>ReferenceError: totl is not defined</code> — maybe in front of a user. ESLint found it instantly.</li>
</ul>
<p>With the <strong>ESLint</strong> extension installed, VS Code shows this exact list as squiggly underlines in the editor and in the Problems panel, updated as you type. Hover an underline to read the message; the light-bulb menu (Ctrl/Cmd+.) offers fixes for the rules that have one.</p>

<h3>Step 3 — rename the symbol, not the text</h3>
<p>Suppose you want to rename the variable <code>total</code> to <code>runningTotal</code> in this file:</p>
${ma('javascript', SHOP)}
<p>Find-and-replace works on <em>text</em>. Rename Symbol (<strong>F2</strong>) works on <em>meaning</em>: VS Code asks the JavaScript language service which identifiers refer to the same variable. The script below calls that same service directly and compares the two approaches:</p>
${ra(OUT['_t1/vscode/out/rename'])}
<p>A text search finds nine matches: the variable itself, but also the word in a comment, the string <code>"total"</code> that is shown to users, part of <code>subtotal</code>, and a completely different variable inside <code>report()</code> that happens to share the name. Replace-all would break all of them. F2 changes exactly three places — the declaration on line 1, the use on line 4 and the use on line 12 — because it understands <strong>scope</strong> (lesson 4.3). Use F2 for code, and keep find-and-replace for plain text.</p>
<p>Two related tools use the same service: <strong>F12 — Go to Definition</strong> jumps from a function call to where the function is written, and <strong>Shift+F12 — Find All References</strong> lists every place a function is used. Before changing a function, Shift+F12 answers the question every developer asks: "what breaks if I change this?"</p>

<h3>Step 4 — project settings travel with the project</h3>
<p>VS Code has two levels of settings. <strong>User settings</strong> are yours on this computer: theme, font size, keyboard layout. <strong>Workspace settings</strong> live in the project’s <code>.vscode/</code> folder and apply to everyone who opens it. Rules that keep a team consistent belong in the workspace:</p>
${ma('javascript', CODE['_t1/vscode/.vscode/settings.json'])}
${ma('javascript', CODE['_t1/vscode/.vscode/extensions.json'])}
<p>The first file turns on format-on-save with Prettier, runs ESLint’s automatic fixes on save, and trims stray spaces. The second makes VS Code show a pop-up — "This workspace has extension recommendations" — to anyone who opens the folder, so a new teammate gets the right tools with one click. (These files allow comments and trailing commas; VS Code reads them as "JSON with comments".)</p>
${ma('ini', CODE['_t1/vscode/.editorconfig'])}
<p><code>.editorconfig</code> is the editor-neutral version of the basics — indentation and line endings — understood by most editors, so teammates on other editors get the same results.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">User settings</span><span class="v">Your taste, your machine: theme, font, zoom. Ctrl/Cmd+, → "User".</span></div>
  <div class="kv"><span class="k">Workspace settings</span><span class="v">Team rules, in <code>.vscode/settings.json</code>, committed with the code.</span></div>
  <div class="kv"><span class="k">Project config files</span><span class="v"><code>.prettierrc.json</code>, <code>eslint.config.js</code> — read by the tools themselves, so CI and the terminal give the same answers as the editor.</span></div>
</div>

<h3>Step 5 — the debugger: watch the code run</h3>
<p><code>console.log</code> is fine for a quick look, but when you need to understand a loop, the debugger is faster. Take a tiny script:</p>
${ma('javascript', CODE['_t1/vscode/total.mjs'])}
${ma('json', CODE['_t1/vscode/.vscode/launch.json'])}
<ol>
  <li>Click in the gutter left of the line <code>sum += price</code>. A red dot appears: a <strong>breakpoint</strong>.</li>
  <li>Press <strong>F5</strong>. VS Code starts the program described in <code>launch.json</code> and pauses on that line, before running it.</li>
  <li>Look at the <strong>Variables</strong> panel, or hover <code>sum</code>: it shows 0 the first time, then 450000, then 600000.</li>
  <li><strong>F10</strong> runs one line; <strong>F5</strong> continues to the next breakpoint; <strong>Shift+F5</strong> stops.</li>
</ol>
<p>No <code>launch.json</code> yet? Open the file and choose <em>Run and Debug</em> in the left bar; VS Code offers to debug the current file with Node and can create the file for you. Lesson 10.2 uses the same skill on a real bug, and the browser has its own debugger in DevTools (lesson 4.5).</p>

<h3>Shortcuts worth learning — two at a time</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl/Cmd + P</span><span class="v">Go to a file by typing part of its name.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + Shift + F</span><span class="v">Search the whole project.</span></div>
  <div class="kv"><span class="k">F2 · F12 · Shift+F12</span><span class="v">Rename symbol · go to definition · find all references.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + D</span><span class="v">Select the next occurrence of the selected word — edit several at once.</span></div>
  <div class="kv"><span class="k">Alt/Option + ↑ / ↓</span><span class="v">Move the current line up or down.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + /</span><span class="v">Comment or uncomment the current line(s).</span></div>
</div>
<p>Do not try to memorise the list. Pick two, use them until your hands do it without thinking, then add two more. The official cheat sheet below has the full set.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — "Format on Save does nothing".</strong> Three usual causes, in order: the folder was not opened as a folder (you opened one file); no default formatter is set, so VS Code does not know which extension to use (the status bar shows a warning — set <code>editor.defaultFormatter</code> as in Step 4); or the file has a syntax error, and Prettier refuses to format code it cannot parse. Fix the red syntax error first, then save again.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — the ESLint extension shows no underlines.</strong> The extension only runs the ESLint installed <em>in your project</em> with the configuration file <em>in your project</em>. If <code>npx eslint src</code> in the terminal also prints nothing, the problem is the configuration, not VS Code. If the terminal finds problems but the editor does not, open the Output panel, choose "ESLint" in its drop-down and read the error — usually a missing <code>npm install</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — installing twenty extensions in the first week.</strong> Each one adds behaviour you did not choose: code reformatted in a way you did not ask for, an auto-import from the wrong package, a slower editor that you assume is normal. When something odd happens you then have twenty suspects. Start with a formatter and a linter, add anything else only when you have felt the specific pain it solves, and when the editor misbehaves, disable extensions and turn them back on one at a time.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (20 min)</strong></p>
<p>Create a folder <code>editor-practice</code>, open it in VS Code, and in the built-in terminal run <code>npm init -y</code> then <code>npm install -D prettier eslint @eslint/js globals</code>. Copy <code>cart.js</code> and <code>messy.js</code> from this lesson into <code>src/</code>, copy <code>eslint.config.js</code>, <code>.prettierrc.json</code> and the two files in <code>.vscode/</code>, and install the two recommended extensions when VS Code asks.</p>
<p><strong>Done when:</strong> saving <code>messy.js</code> reformats it instantly; the five ESLint problems are underlined in <code>cart.js</code> and you have fixed them until <code>npx eslint src</code> prints nothing; you renamed <code>sum</code> in <code>total.mjs</code> with F2; and you stopped at a breakpoint once and read the value of <code>sum</code>. Code Lab module 1.2 practises the editor features themselves — go-to-file matching, line moves, comment toggling — as small functions.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">workspace / open folder</span><span class="v">không gian làm việc / mở thư mục dự án.</span></div>
  <div class="kv"><span class="k">Command Palette</span><span class="v">bảng lệnh — tìm mọi lệnh theo tên.</span></div>
  <div class="kv"><span class="k">formatter (Prettier)</span><span class="v">bộ định dạng — chỉnh bố cục, không đổi ý nghĩa.</span></div>
  <div class="kv"><span class="k">linter (ESLint)</span><span class="v">bộ soát lỗi tĩnh — đọc mã không chạy, báo mẫu hay sai.</span></div>
  <div class="kv"><span class="k">rename symbol</span><span class="v">đổi tên ký hiệu — đổi đúng biến, hiểu phạm vi.</span></div>
  <div class="kv"><span class="k">user / workspace settings</span><span class="v">cài đặt người dùng / cài đặt dự án.</span></div>
  <div class="kv"><span class="k">breakpoint</span><span class="v">điểm dừng — chương trình tạm dừng tại dòng đó.</span></div>
  <div class="kv"><span class="k">step over (F10)</span><span class="v">chạy qua một dòng khi đang gỡ lỗi.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Open the project <strong>folder</strong>; most "it does not work" problems come from opening a single file.</li>
  <li>Prettier changes layout, never meaning (the program printed the same total); format on save makes it automatic.</li>
  <li>ESLint found five problems in a file that loads without error — including <code>=</code> instead of <code>===</code> and a misspelled name.</li>
  <li>F2 renamed 3 places where a text search found 9: it understands scope.</li>
  <li>Commit <code>.vscode/settings.json</code> and <code>extensions.json</code> so the whole team gets the same setup; keep taste in user settings.</li>
  <li>A breakpoint plus F5 shows the program’s state without adding <code>console.log</code>.</li>
</ul>
${nguon('📗', 'VS Code — Tips and Tricks', 'The official tour of the features in this lesson and many more', 'https://code.visualstudio.com/docs/getstarted/tips-and-tricks')}
${nguon('📘', 'VS Code — Keyboard shortcuts (PDF)', 'One-page cheat sheet for Windows; macOS and Linux versions are linked from the same page', 'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf')}
${nguon('📙', 'ESLint — Getting Started', 'Install, configure with eslint.config.js, and read the rules reference', 'https://eslint.org/docs/latest/use/getting-started')}
${lienKet({ khoa: 'git', bai: 'git-14-1-vs-code', title: 'Git 14.1 — Git in VS Code: every button is a command', sub: 'The Source Control panel, explained command by command', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Web Foundations 10.2 — reading errors and debugging', sub: 'Use the debugger and the stack trace on real bugs', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-13-4-mocking-ci', title: 'Web Foundations 13.4 — CI runs the same checks', sub: 'prettier --check and eslint in a pipeline that blocks bad commits', cta: 'Open lesson' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Trình soạn thảo là xưởng làm việc, không phải sổ ghi chép</h2>
<p class="lead">Sau bài này bạn mở được dự án theo cách người làm nghề vẫn làm, biết đường đi trong bốn vùng chính của VS Code, cho mã tự định dạng mỗi lần lưu, đọc được những lỗi mà linter gạch chân trước cả khi chạy chương trình, đổi tên biến an toàn, chia sẻ cài đặt trình soạn thảo cho cả nhóm, và cho chương trình đang chạy dừng lại bằng trình gỡ lỗi. Vì sao cần: một trình soạn thảo văn bản trơn chỉ lưu những gì bạn gõ, còn một trình soạn thảo đã cài đặt thì làm việc cùng bạn — nó chỉnh bố cục, phát hiện tên biến gõ sai, và bắt lỗi kinh điển <code>=</code> thay vì <code>===</code> mà nếu không thì bạn mất cả tiếng đồng hồ. Mọi output dưới đây là từ lần chạy thật của Prettier 3.9, ESLint 10 và dịch vụ ngôn ngữ TypeScript 5.9 (động cơ đứng sau các tính năng JavaScript của VS Code) trên Node 22.</p>

<h3>Bước 0 — cài đặt, rồi mở một thư mục</h3>
<p>Tải VS Code từ <strong>code.visualstudio.com</strong> (Windows, macOS và Linux đều miễn phí). Rồi biến một thói quen thành phản xạ: <strong>File → Open Folder…</strong> và chọn thư mục của dự án — không bao giờ một file lẻ, và cũng không phải một thư mục cha khổng lồ như <code>Documents</code>. Trên macOS, chạy một lần lệnh <em>Shell Command: Install 'code' command in PATH</em> trong Command Palette; sau đó gõ <code>code .</code> trong terminal là mở thư mục hiện tại (trên Windows trình cài đặt đã thêm sẵn).</p>
${ma('bash', `ct-shop/            ← File → Open Folder…  (hoặc: cd ct-shop && code .)
├─ .vscode/        ← cài đặt cho RIÊNG dự án này, commit cùng dự án
│  ├─ settings.json
│  ├─ extensions.json
│  └─ launch.json
├─ src/
│  ├─ cart.js
│  └─ messy.js
├─ eslint.config.js
├─ .prettierrc.json
├─ .editorconfig
└─ package.json`)}
<p>Đây là dự án nhỏ dùng suốt bài. Khi VS Code mở nó dưới dạng thư mục, nó coi mọi thứ bên trong là một dự án: cây file hiện nó ra, tìm kiếm toàn dự án phủ lên nó, terminal tích hợp khởi động ngay trong nó, linter tìm thấy file cấu hình của nó, và các cài đặt trong <code>.vscode/</code> có hiệu lực. Mở riêng <code>cart.js</code> thì không điều gì trong số đó xảy ra — và đó là lý do phổ biến nhất khiến người mới nói "extension không chạy".</p>

<h3>Bốn vùng bạn dùng mỗi ngày</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Explorer (trái) — Ctrl/Cmd+Shift+E</span><span class="v">Cây file. Bấm để mở; chuột phải để tạo, đổi tên hoặc xoá. Dấu chấm cạnh tên file nghĩa là còn thay đổi chưa lưu.</span></div>
  <div class="kv"><span class="k">Editor (giữa)</span><span class="v">Nơi bạn viết. File mở thành các tab; kéo một tab sang bên để xem hai file cùng lúc.</span></div>
  <div class="kv"><span class="k">Terminal (dưới) — Ctrl+&#96;</span><span class="v">Một terminal thật (bài 1.1) khởi động sẵn trong thư mục dự án. Chạy <code>npm</code>, <code>git</code> và <code>node</code> ở đây.</span></div>
  <div class="kv"><span class="k">Command Palette — Ctrl/Cmd+Shift+P</span><span class="v">Ô tìm kiếm cho mọi lệnh. Gõ "format", "settings" hay "git" thay vì lục tìm trong menu.</span></div>
</div>
<p>Còn hai chỗ đáng biết sớm. <strong>Thanh trạng thái</strong> ở đáy cửa sổ cho biết ngôn ngữ của file hiện tại, kiểu xuống dòng, và bộ định dạng hay linter có đang chạy không. <strong>Bảng Problems</strong> (Ctrl/Cmd+Shift+M) liệt kê mọi lỗi và cảnh báo của dự án ở một chỗ — đúng danh sách bạn sẽ thấy trong terminal ở dưới.</p>

<h3>Chuyện gì xảy ra khi bạn bấm lưu</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Bạn gõ</span><span class="lz-d">Khoảng trắng lộn xộn, đủ cả hai loại nháy, một tên biến gõ sai — bình thường khi đầu óc đang nghĩ về bài toán.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Prettier định dạng</span><span class="lz-d">Khi lưu, bộ định dạng viết lại bố cục theo một kiểu chuẩn. Ý nghĩa không bao giờ đổi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ESLint soát</span><span class="lz-d">Linter đọc mã mà không chạy và gạch chân những chỗ khả năng cao là lỗi. Một số nó tự sửa được.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Bạn sửa phần còn lại</span><span class="lz-d">Trên màn hình chỉ còn vấn đề thật, nên sự chú ý dồn vào đúng chỗ — rồi bạn commit (bài 1.3).</span></div>
</div>

<h3>Bước 1 — Prettier: định dạng không phải việc của bạn</h3>
<p>Đây là một file viết vội. Nó chạy được; chỉ là khó đọc.</p>
${ma('javascript', CODE['_t1/vscode/src/messy.js'])}
<p>Prettier là một <strong>bộ định dạng (formatter)</strong>: nó viết lại mã theo một bố cục nhất quán. Trước tiên hãy nhờ nó kiểm file:</p>
${ra(OUT['_t1/vscode/out/prettier-check'])}
<p>Mã thoát 1 nghĩa là "chưa định dạng" — đó là cách một quy trình CI từ chối mã chưa định dạng (bài 13.4). Giờ cho nó sửa file:</p>
${ra(OUT['_t1/vscode/out/prettier-write'])}
<p>Hãy xem cái gì đổi và cái gì không. Dấu cách, xuống dòng, dấu chấm phẩy cuối câu và kiểu nháy (nháy đơn, vì <code>.prettierrc.json</code> ghi <code>"singleQuote": true</code>) đều đổi. Hành vi thì không: chương trình in <code>Total: 600000</code> cả trước lẫn sau. Đó là lời hứa của một bộ định dạng — chỉ bố cục, không bao giờ ý nghĩa.</p>
${ma('json', CODE['_t1/vscode/.prettierrc.json'])}
<p>Để làm gì? Vì định dạng nhất quán làm <strong>diff của Git</strong> chỉ hiện thay đổi thật. Nếu hai người định dạng khác nhau, mỗi commit thành một bức tường đỏ xanh toàn khoảng trắng và không ai thấy được một dòng quan trọng. Khi cả nhóm định dạng khi lưu với cùng một file cấu hình, vấn đề đó biến mất và không ai còn phải cãi nhau về tab hay dấu cách.</p>
<p>Trong VS Code bạn không bao giờ tự gõ lệnh: cài extension <strong>Prettier</strong>, đặt nó làm bộ định dạng mặc định và bật <strong>Format On Save</strong> (Bước 4 làm việc đó cho cả dự án). Từ đó, bấm Ctrl/Cmd+S là chạy đúng lệnh <code>--write</code> ở trên cho file hiện tại.</p>

<h3>Bước 2 — ESLint: lỗi bị gạch chân trước khi bạn chạy gì cả</h3>
<p>File này không có lỗi cú pháp. Node nạp nó mà không kêu ca gì. Vậy mà nó vẫn chứa ba lỗi thật:</p>
${ma('javascript', CODE['_t1/vscode/src/cart.js'])}
<p>ESLint là một <strong>linter</strong>: nó đọc mã mà không chạy và báo những mẫu gần như luôn là sai. Cấu hình của nó nằm trong một file:</p>
${ma('javascript', CODE['_t1/vscode/eslint.config.js'])}
${ra(OUT['_t1/vscode/out/eslint'])}
<p>Đọc mỗi dòng theo thứ tự <em>dòng:cột — mức độ — thông điệp — tên luật</em>. Nghĩa của chúng, bằng lời thường:</p>
<ul>
  <li><strong>3:9 no-unused-vars</strong> — <code>discount</code> được tạo ra mà không bao giờ dùng. Thường nghĩa là bạn quên áp dụng nó, nên giá bị sai.</li>
  <li><strong>4:7 no-cond-assign</strong> và <strong>no-constant-condition</strong> — <code>if (qty = 0)</code> <em>gán</em> 0 cho <code>qty</code>; nó không so sánh. Điều kiện luôn sai, lệnh return sớm không bao giờ chạy, và mọi món hàng bị đẩy vào giỏ với số lượng 0. Thiếu một dấu <code>=</code>, hai cảnh báo.</li>
  <li><strong>7:18 eqeqeq</strong> — <code>==</code> đổi kiểu trước khi so, nên <code>0 == '0'</code> là true. Luật ta thêm yêu cầu <code>===</code>, so cả kiểu lẫn giá trị (bài 4.1).</li>
  <li><strong>11:10 no-undef</strong> — <code>totl</code> không tồn tại. JavaScript chỉ phát hiện khi dòng này chạy, bằng cách ném <code>ReferenceError: totl is not defined</code> — có thể ngay trước mặt người dùng. ESLint tìm ra ngay lập tức.</li>
</ul>
<p>Khi cài extension <strong>ESLint</strong>, VS Code hiện đúng danh sách này thành các đường gạch lượn sóng trong trình soạn thảo và trong bảng Problems, cập nhật ngay khi bạn gõ. Rê chuột lên đường gạch để đọc thông điệp; menu bóng đèn (Ctrl/Cmd+.) đưa ra cách sửa cho những luật có cách sửa.</p>

<h3>Bước 3 — đổi tên ký hiệu, không đổi chữ</h3>
<p>Giả sử bạn muốn đổi tên biến <code>total</code> thành <code>runningTotal</code> trong file này:</p>
${ma('javascript', SHOP)}
<p>Tìm-và-thay làm việc trên <em>chữ</em>. Rename Symbol (<strong>F2</strong>) làm việc trên <em>ý nghĩa</em>: VS Code hỏi dịch vụ ngôn ngữ JavaScript xem những định danh nào trỏ tới cùng một biến. Đoạn script dưới gọi thẳng dịch vụ đó và so sánh hai cách:</p>
${ra(OUT['_t1/vscode/out/rename'])}
<p>Tìm theo chữ ra chín chỗ: chính biến đó, nhưng cả chữ trong một chú thích, chuỗi <code>"total"</code> hiện cho người dùng, một phần của <code>subtotal</code>, và một biến hoàn toàn khác bên trong <code>report()</code> tình cờ trùng tên. Thay-tất-cả sẽ làm hỏng hết. F2 đổi đúng ba chỗ — khai báo ở dòng 1, chỗ dùng ở dòng 4 và dòng 12 — vì nó hiểu <strong>phạm vi (scope)</strong> (bài 4.3). Dùng F2 cho mã, giữ tìm-và-thay cho văn bản thường.</p>
<p>Hai công cụ cùng họ dùng chung dịch vụ đó: <strong>F12 — Go to Definition</strong> nhảy từ chỗ gọi hàm tới nơi hàm được viết, và <strong>Shift+F12 — Find All References</strong> liệt kê mọi nơi một hàm được dùng. Trước khi sửa một hàm, Shift+F12 trả lời câu mà lập trình viên nào cũng hỏi: "đổi cái này thì hỏng cái gì?"</p>

<h3>Bước 4 — cài đặt dự án đi theo dự án</h3>
<p>VS Code có hai tầng cài đặt. <strong>Cài đặt người dùng (User)</strong> là của bạn trên máy này: giao diện màu, cỡ chữ, bố cục bàn phím. <strong>Cài đặt dự án (Workspace)</strong> nằm trong thư mục <code>.vscode/</code> của dự án và áp dụng cho mọi người mở nó. Các luật giữ cả nhóm nhất quán thuộc về dự án:</p>
${ma('javascript', CODE['_t1/vscode/.vscode/settings.json'])}
${ma('javascript', CODE['_t1/vscode/.vscode/extensions.json'])}
<p>File thứ nhất bật định dạng khi lưu bằng Prettier, chạy các bản sửa tự động của ESLint khi lưu, và cắt khoảng trắng thừa. File thứ hai khiến VS Code hiện một thông báo — "This workspace has extension recommendations" — cho bất kỳ ai mở thư mục, để đồng đội mới có đúng công cụ chỉ bằng một cú bấm. (Hai file này cho phép chú thích và dấu phẩy cuối; VS Code đọc chúng dưới dạng "JSON có chú thích".)</p>
${ma('ini', CODE['_t1/vscode/.editorconfig'])}
<p><code>.editorconfig</code> là phiên bản không phụ thuộc trình soạn thảo của phần cơ bản — thụt lề và kiểu xuống dòng — được đa số trình soạn thảo hiểu, nên đồng đội dùng trình soạn thảo khác vẫn ra cùng kết quả.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cài đặt người dùng</span><span class="v">Sở thích của bạn, máy của bạn: giao diện, phông, độ phóng. Ctrl/Cmd+, → "User".</span></div>
  <div class="kv"><span class="k">Cài đặt dự án</span><span class="v">Luật của nhóm, trong <code>.vscode/settings.json</code>, commit cùng mã.</span></div>
  <div class="kv"><span class="k">File cấu hình của dự án</span><span class="v"><code>.prettierrc.json</code>, <code>eslint.config.js</code> — chính các công cụ đọc, nên CI và terminal trả lời giống hệt trình soạn thảo.</span></div>
</div>

<h3>Bước 5 — trình gỡ lỗi: xem mã chạy</h3>
<p><code>console.log</code> ổn để nhìn nhanh, nhưng khi cần hiểu một vòng lặp, trình gỡ lỗi (debugger) nhanh hơn. Lấy một script nhỏ:</p>
${ma('javascript', CODE['_t1/vscode/total.mjs'])}
${ma('json', CODE['_t1/vscode/.vscode/launch.json'])}
<ol>
  <li>Bấm vào lề bên trái dòng <code>sum += price</code>. Một chấm đỏ hiện ra: một <strong>điểm dừng (breakpoint)</strong>.</li>
  <li>Bấm <strong>F5</strong>. VS Code chạy chương trình mô tả trong <code>launch.json</code> và dừng ở dòng đó, trước khi chạy nó.</li>
  <li>Nhìn bảng <strong>Variables</strong>, hoặc rê chuột lên <code>sum</code>: lần đầu là 0, rồi 450000, rồi 600000.</li>
  <li><strong>F10</strong> chạy một dòng; <strong>F5</strong> chạy tới điểm dừng kế tiếp; <strong>Shift+F5</strong> dừng hẳn.</li>
</ol>
<p>Chưa có <code>launch.json</code>? Mở file rồi chọn <em>Run and Debug</em> ở thanh bên trái; VS Code đề nghị gỡ lỗi file hiện tại bằng Node và có thể tạo file đó giúp bạn. Bài 10.2 dùng đúng kỹ năng này trên một lỗi thật, và trình duyệt có trình gỡ lỗi riêng trong DevTools (bài 4.5).</p>

<h3>Phím tắt đáng học — mỗi lần hai cái</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl/Cmd + P</span><span class="v">Mở file bằng cách gõ một phần tên.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + Shift + F</span><span class="v">Tìm khắp dự án.</span></div>
  <div class="kv"><span class="k">F2 · F12 · Shift+F12</span><span class="v">Đổi tên ký hiệu · tới định nghĩa · tìm mọi chỗ dùng.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + D</span><span class="v">Chọn lần xuất hiện kế tiếp của từ đang chọn — sửa nhiều chỗ một lúc.</span></div>
  <div class="kv"><span class="k">Alt/Option + ↑ / ↓</span><span class="v">Đưa dòng hiện tại lên hoặc xuống.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + /</span><span class="v">Bật/tắt chú thích cho các dòng đang chọn.</span></div>
</div>
<p>Đừng cố học thuộc cả danh sách. Chọn hai cái, dùng tới khi tay tự làm không cần nghĩ, rồi thêm hai cái nữa. Bảng tra chính thức ở dưới có đủ bộ.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "Format on Save chẳng làm gì".</strong> Ba nguyên nhân thường gặp, theo thứ tự: thư mục không được mở dưới dạng thư mục (bạn mở một file); chưa đặt bộ định dạng mặc định, nên VS Code không biết dùng extension nào (thanh trạng thái hiện cảnh báo — đặt <code>editor.defaultFormatter</code> như ở Bước 4); hoặc file đang có lỗi cú pháp, và Prettier từ chối định dạng mã nó không đọc được. Sửa lỗi cú pháp màu đỏ trước, rồi lưu lại.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — extension ESLint không gạch chân gì.</strong> Extension chỉ chạy ESLint được cài <em>trong dự án của bạn</em> với file cấu hình <em>trong dự án của bạn</em>. Nếu <code>npx eslint src</code> trong terminal cũng không in ra gì, vấn đề nằm ở cấu hình chứ không ở VS Code. Nếu terminal tìm ra vấn đề mà trình soạn thảo thì không, mở bảng Output, chọn "ESLint" trong danh sách thả xuống và đọc lỗi — thường là thiếu <code>npm install</code>.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — cài hai chục extension ngay tuần đầu.</strong> Mỗi cái thêm một hành vi bạn không chọn: mã bị định dạng lại theo kiểu bạn không yêu cầu, một import tự động từ sai package, một trình soạn thảo chậm hơn mà bạn tưởng là bình thường. Khi có chuyện lạ, bạn có hai chục kẻ tình nghi. Bắt đầu với một bộ định dạng và một linter, chỉ thêm thứ khác khi đã thật sự thấy đau vì thiếu nó, và khi trình soạn thảo cư xử lạ, tắt hết extension rồi bật lại từng cái một.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Tạo thư mục <code>editor-practice</code>, mở nó trong VS Code, và trong terminal tích hợp chạy <code>npm init -y</code> rồi <code>npm install -D prettier eslint @eslint/js globals</code>. Chép <code>cart.js</code> và <code>messy.js</code> của bài vào <code>src/</code>, chép <code>eslint.config.js</code>, <code>.prettierrc.json</code> và hai file trong <code>.vscode/</code>, rồi cài hai extension được gợi ý khi VS Code hỏi.</p>
<p><strong>Xong khi:</strong> lưu <code>messy.js</code> là nó tự định dạng ngay; năm vấn đề ESLint bị gạch chân trong <code>cart.js</code> và bạn đã sửa tới khi <code>npx eslint src</code> không in gì; bạn đã đổi tên <code>sum</code> trong <code>total.mjs</code> bằng F2; và bạn đã dừng ở một điểm dừng một lần và đọc giá trị của <code>sum</code>. Code Lab module 1.2 luyện chính các tính năng của trình soạn thảo — khớp tên file khi Go to File, di chuyển dòng, bật/tắt chú thích — dưới dạng các hàm nhỏ.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">workspace / open folder</span><span class="v">không gian làm việc / mở thư mục dự án.</span></div>
  <div class="kv"><span class="k">Command Palette</span><span class="v">bảng lệnh — tìm mọi lệnh theo tên.</span></div>
  <div class="kv"><span class="k">formatter (Prettier)</span><span class="v">bộ định dạng — chỉnh bố cục, không đổi ý nghĩa.</span></div>
  <div class="kv"><span class="k">linter (ESLint)</span><span class="v">bộ soát lỗi tĩnh — đọc mã không chạy, báo mẫu hay sai.</span></div>
  <div class="kv"><span class="k">rename symbol</span><span class="v">đổi tên ký hiệu — đổi đúng biến, hiểu phạm vi.</span></div>
  <div class="kv"><span class="k">user / workspace settings</span><span class="v">cài đặt người dùng / cài đặt dự án.</span></div>
  <div class="kv"><span class="k">breakpoint</span><span class="v">điểm dừng — chương trình tạm dừng tại dòng đó.</span></div>
  <div class="kv"><span class="k">step over (F10)</span><span class="v">chạy qua một dòng khi đang gỡ lỗi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Mở <strong>thư mục</strong> dự án; phần lớn chuyện "không chạy" bắt nguồn từ việc mở một file lẻ.</li>
  <li>Prettier đổi bố cục, không đổi ý nghĩa (chương trình in cùng một tổng); định dạng khi lưu biến nó thành tự động.</li>
  <li>ESLint tìm ra năm vấn đề trong một file nạp không lỗi — gồm cả <code>=</code> thay vì <code>===</code> và một tên gõ sai.</li>
  <li>F2 đổi 3 chỗ trong khi tìm theo chữ ra 9: nó hiểu phạm vi.</li>
  <li>Commit <code>.vscode/settings.json</code> và <code>extensions.json</code> để cả nhóm có cùng cấu hình; sở thích riêng để trong cài đặt người dùng.</li>
  <li>Một điểm dừng cộng F5 cho thấy trạng thái chương trình mà không cần thêm <code>console.log</code>.</li>
</ul>
${nguon('📗', 'VS Code — Tips and Tricks', 'Chuyến tham quan chính thức các tính năng trong bài và nhiều hơn nữa', 'https://code.visualstudio.com/docs/getstarted/tips-and-tricks')}
${nguon('📘', 'VS Code — Keyboard shortcuts (PDF)', 'Bảng tra một trang cho Windows; bản macOS và Linux có link ở cùng trang', 'https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf')}
${nguon('📙', 'ESLint — Getting Started', 'Cài đặt, cấu hình bằng eslint.config.js, và tra cứu các luật', 'https://eslint.org/docs/latest/use/getting-started')}
${lienKet({ khoa: 'git', bai: 'git-14-1-vs-code', title: 'Git 14.1 — Git trong VS Code: mỗi nút bấm là một lệnh', sub: 'Bảng Source Control, giải thích từng lệnh một', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-10-2-reading-errors-debugging', title: 'Nền tảng Web 10.2 — đọc lỗi và gỡ lỗi', sub: 'Dùng trình gỡ lỗi và stack trace trên lỗi thật', cta: 'Mở bài' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-13-4-mocking-ci', title: 'Nền tảng Web 13.4 — CI chạy đúng các phép kiểm đó', sub: 'prettier --check và eslint trong một quy trình chặn commit hỏng', cta: 'Mở bài' })}
</div>
`,
};
