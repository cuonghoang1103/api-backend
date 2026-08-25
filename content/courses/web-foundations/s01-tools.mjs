/**
 * Web Foundations — Chương 1: Bộ công cụ (terminal, VS Code, Git, GitHub, Node & npm).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 1 — Your toolbox: terminal, VS Code, Git, npm|||Chương 1 — Bộ công cụ: terminal, VS Code, Git, npm',
  description: 'Dùng thành thạo bốn công cụ nền: dòng lệnh, trình soạn thảo, quản lý phiên bản, và trình chạy JavaScript cùng npm. Đây là những thứ bạn gõ mỗi ngày trong mọi khoá sau.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — The terminal: talking to your computer with words|||1.1 — Terminal: nói chuyện với máy tính bằng chữ',
      slug: 'wf-1-1-terminal',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/uwAqEzhyjtw', durationSeconds: 0 },
      description: 'Di chuyển giữa thư mục, xem/ tạo/ xoá file, hiểu đường dẫn tuyệt đối vs tương đối — bằng dòng lệnh, thứ mọi công cụ lập trình đều dùng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The terminal is just a text way to give commands</h2>
<p class="lead">A graphical file explorer and the terminal do the same things — open folders, move files — but the terminal is faster, scriptable, and it is how every developer tool (Node, Git, npm) is run. Do not fear it; it is a small vocabulary.</p>

<h3>Where am I? Navigating folders</h3>
<p>Your terminal is always "inside" one folder. These are the essentials (macOS/Linux; Windows PowerShell is nearly identical, notes in brackets):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">pwd</span><span class="v">Print working directory — the folder you are in right now.</span></div>
  <div class="kv"><span class="k">ls  [dir]</span><span class="v">List the files and folders here. Try ls -la for details + hidden files.</span></div>
  <div class="kv"><span class="k">cd name</span><span class="v">Change directory into "name". cd .. goes up one level; cd ~ goes home.</span></div>
  <div class="kv"><span class="k">clear</span><span class="v">Wipe the screen (the history is still there, just scrolled up).</span></div>
</div>

<h3>Creating and removing things</h3>
<pre><code>mkdir my-project        # make a folder
cd my-project           # go into it
touch index.html        # create an empty file  [Windows: ni index.html]
mkdir src               # a sub-folder
mv index.html src/      # move a file into src/
cp src/index.html copy.html   # copy a file
rm copy.html            # delete a file — no undo, be careful!</code></pre>
<p class="pitfall"><strong>rm has no recycle bin.</strong> On the command line, delete is permanent. Read the path twice before pressing Enter, and never run a delete you copied from the internet without understanding it.</p>

<h3>Absolute vs relative paths — the idea that unlocks everything</h3>
<p>A <strong>path</strong> is an address for a file. There are two kinds, and mixing them up is the #1 beginner confusion:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Absolute</span><span class="v">From the root of the disk, e.g. /Users/binh/site/index.html. Always the same no matter where you are.</span></div>
  <div class="kv"><span class="k">Relative</span><span class="v">From where you are now. ./src/app.js means "src/app.js under my current folder"; ../ means "one folder up".</span></div>
</div>
<p>The same symbols appear in code: an <code>import "./utils.js"</code> in JavaScript uses a relative path from the current file. Learn it here once and it pays off everywhere.</p>

<h3>Two time-savers</h3>
<p><strong>Tab</strong> auto-completes a file or folder name — type <code>cd my-</code> then Tab. <strong>Up arrow</strong> recalls your previous commands so you do not retype them.</p>

<p class="note-ct"><strong>Try it now:</strong> make a folder, cd into it, create a file, list it, then delete it. Muscle memory for this pays back every single day.</p>
<h3>Reading a path the way the shell reads it</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Does it start with / ?</span><span class="lz-d">Then it is absolute — the shell starts at the root of the disk and ignores where you currently are. <code>/Users/binh/site</code> means the same thing typed from anywhere.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Does it start with ~ ?</span><span class="lz-d">The shell expands <code>~</code> to your home folder before doing anything else. <code>~/site</code> is really <code>/Users/binh/site</code> — absolute, just typed shorter.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Anything else is relative</span><span class="lz-d">It is glued onto your current folder. <code>src/app.js</code>, <code>./src/app.js</code> and <code>../other/app.js</code> all mean different files depending on where <code>pwd</code> says you are.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So pwd is the missing half of every relative path</span><span class="lz-d">When a command says "no such file" and you can see the file, run <code>pwd</code>. You are almost certainly in a different folder than you think.</span></div>
</div>
<pre><code>pwd
ls
cd src
pwd
cat app.js          # print a file's contents
cd ..               # back up one level</code></pre>
<div class="out">/Users/binh/site
index.html  src  package.json
/Users/binh/site/src
console.log('hello');</div>
<div class="pitfall"><p><strong>Trap — a space in a folder name breaks the command in a way the error does not explain.</strong> <code>cd My Project</code> does not try to enter "My Project"; the shell splits on spaces, so it sees two arguments and tries to enter a folder called <code>My</code>. The error is "no such file or directory: My" — a folder you never mentioned, which is exactly why beginners stare at it. Quote the path (<code>cd "My Project"</code>) or escape the space (<code>cd My\\ Project</code>). Better: avoid spaces in every folder that will hold code. This bites again later in npm scripts and in file paths inside your programs.</p></div>
<div class="link-card"><a href="https://www.learnenough.com/command-line-tutorial" target="_blank" rel="noopener">Learn Enough Command Line to Be Dangerous — a gentle, complete walkthrough</a></div>
<div class="link-card"><a href="https://explainshell.com/" target="_blank" rel="noopener">explainshell.com — paste any command, see what each flag does</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Terminal chỉ là cách ra lệnh bằng chữ</h2>
<p class="lead">Trình quản lý file đồ hoạ và terminal làm cùng những việc — mở thư mục, di chuyển file — nhưng terminal nhanh hơn, kịch bản hoá được, và là cách mọi công cụ lập trình (Node, Git, npm) được chạy. Đừng sợ; nó chỉ là một vốn từ nhỏ.</p>

<h3>Tôi đang ở đâu? Di chuyển giữa thư mục</h3>
<p>Terminal của bạn luôn "ở trong" một thư mục. Đây là những lệnh cốt lõi (macOS/Linux; PowerShell của Windows gần như y hệt, ghi chú trong ngoặc):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">pwd</span><span class="v">In ra thư mục hiện tại bạn đang đứng.</span></div>
  <div class="kv"><span class="k">ls  [dir]</span><span class="v">Liệt kê file và thư mục ở đây. Thử ls -la để xem chi tiết + file ẩn.</span></div>
  <div class="kv"><span class="k">cd tên</span><span class="v">Đi vào thư mục "tên". cd .. lùi một cấp; cd ~ về thư mục nhà.</span></div>
  <div class="kv"><span class="k">clear</span><span class="v">Xoá sạch màn hình (lịch sử vẫn còn, chỉ cuộn lên trên).</span></div>
</div>

<h3>Tạo và xoá</h3>
<pre><code>mkdir my-project        # tạo một thư mục
cd my-project           # đi vào nó
touch index.html        # tạo một file rỗng  [Windows: ni index.html]
mkdir src               # một thư mục con
mv index.html src/      # chuyển file vào src/
cp src/index.html copy.html   # sao chép file
rm copy.html            # xoá file — KHÔNG hoàn tác được, cẩn thận!</code></pre>
<p class="pitfall"><strong>rm không có thùng rác.</strong> Trên dòng lệnh, xoá là vĩnh viễn. Đọc đường dẫn hai lần trước khi bấm Enter, và đừng bao giờ chạy một lệnh xoá chép từ internet mà chưa hiểu nó.</p>

<h3>Đường dẫn tuyệt đối vs tương đối — ý tưởng mở khoá mọi thứ</h3>
<p>Một <strong>đường dẫn (path)</strong> là địa chỉ của một file. Có hai loại, và nhầm lẫn giữa chúng là điều gây rối số 1 cho người mới:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tuyệt đối</span><span class="v">Tính từ gốc ổ đĩa, vd /Users/binh/site/index.html. Luôn giống nhau bất kể bạn ở đâu.</span></div>
  <div class="kv"><span class="k">Tương đối</span><span class="v">Tính từ chỗ bạn đang đứng. ./src/app.js nghĩa là "src/app.js dưới thư mục hiện tại"; ../ nghĩa là "lùi một cấp".</span></div>
</div>
<p>Cùng ký hiệu đó xuất hiện trong code: một <code>import "./utils.js"</code> trong JavaScript dùng đường dẫn tương đối tính từ file hiện tại. Học ở đây một lần là lãi khắp nơi.</p>

<h3>Hai mẹo tiết kiệm thời gian</h3>
<p><strong>Tab</strong> tự hoàn thành tên file/thư mục — gõ <code>cd my-</code> rồi bấm Tab. <strong>Mũi tên lên</strong> gọi lại các lệnh trước để khỏi gõ lại.</p>

<p class="note-ct"><strong>Thử ngay:</strong> tạo một thư mục, cd vào, tạo một file, liệt kê nó, rồi xoá đi. Cơ bắp ghi nhớ việc này sẽ trả lãi mỗi ngày.</p>
<h3>Đọc một đường dẫn theo đúng cách shell đọc</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó có bắt đầu bằng / không?</span><span class="lz-d">Thì nó là tuyệt đối — shell bắt đầu từ gốc đĩa và mặc kệ bạn đang ở đâu. <code>/Users/binh/site</code> nghĩa y hệt nhau dù gõ từ đâu.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó có bắt đầu bằng ~ không?</span><span class="lz-d">Shell bung <code>~</code> thành thư mục nhà của bạn trước khi làm bất cứ gì khác. <code>~/site</code> thật ra là <code>/Users/binh/site</code> — vẫn tuyệt đối, chỉ gõ ngắn hơn.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Còn lại đều là tương đối</span><span class="lz-d">Nó bị dán vào thư mục hiện tại của bạn. <code>src/app.js</code>, <code>./src/app.js</code> và <code>../other/app.js</code> đều trỏ tới file khác nhau tuỳ theo <code>pwd</code> nói bạn đang ở đâu.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nên pwd là nửa còn thiếu của mọi đường dẫn tương đối</span><span class="lz-d">Khi một lệnh bảo "không có file đó" mà bạn nhìn thấy file rành rành, hãy chạy <code>pwd</code>. Gần như chắc chắn bạn đang ở một thư mục khác chỗ bạn tưởng.</span></div>
</div>
<pre><code>pwd
ls
cd src
pwd
cat app.js          # in nội dung một file
cd ..               # lùi lên một cấp</code></pre>
<div class="out">/Users/binh/site
index.html  src  package.json
/Users/binh/site/src
console.log('hello');</div>
<div class="pitfall"><p><strong>Bẫy — một dấu cách trong tên thư mục làm hỏng lệnh theo cách mà thông báo lỗi không hề giải thích.</strong> <code>cd My Project</code> không hề thử vào "My Project"; shell cắt theo dấu cách, nên nó thấy hai đối số và thử vào một thư mục tên <code>My</code>. Lỗi là "no such file or directory: My" — một thư mục bạn chưa từng nhắc tới, và đó đúng là lý do người mới ngồi nhìn nó trân trân. Hãy bọc đường dẫn trong nháy (<code>cd "My Project"</code>) hoặc thoát dấu cách (<code>cd My\\ Project</code>). Tốt hơn: đừng để dấu cách trong bất cứ thư mục nào sẽ chứa mã. Cái bẫy này còn cắn lại ở npm script và ở đường dẫn file bên trong chương trình của bạn.</p></div>
<div class="link-card"><a href="https://www.learnenough.com/command-line-tutorial" target="_blank" rel="noopener">Learn Enough Command Line to Be Dangerous — đi từ đầu tới cuối, nhẹ nhàng</a></div>
<div class="link-card"><a href="https://explainshell.com/" target="_blank" rel="noopener">explainshell.com — dán một lệnh vào, xem từng cờ làm gì</a></div>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — VS Code: your workshop|||1.2 — VS Code: xưởng làm việc của bạn',
      slug: 'wf-1-2-vscode',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/B-s71n0dHUk', durationSeconds: 0 },
      description: 'Mở một thư mục làm workspace, dùng terminal tích hợp, cài extension hữu ích, và những phím tắt tiết kiệm hàng giờ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Open a folder, not a file</h2>
<p class="lead">The single most important VS Code habit: open your whole <strong>project folder</strong> (File → Open Folder), not individual files. VS Code then understands the project, gives you a file tree on the left, and its terminal opens right inside that folder.</p>

<h3>The four areas you will use</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Explorer (left)</span><span class="v">The file tree of your project. Click to open, right-click to create/rename/delete.</span></div>
  <div class="kv"><span class="k">Editor (center)</span><span class="v">Where you write. Open several files as tabs; split the view side by side.</span></div>
  <div class="kv"><span class="k">Integrated terminal</span><span class="v">Ctrl+&#96; (backtick) opens a terminal already inside your project — no cd needed.</span></div>
  <div class="kv"><span class="k">Command Palette</span><span class="v">Ctrl/Cmd+Shift+P — search every command by name. When lost, start here.</span></div>
</div>

<h3>Extensions worth installing on day one</h3>
<ul>
  <li><strong>Prettier</strong> — formats your code automatically. Turn on "Format On Save" so messy code fixes itself.</li>
  <li><strong>ESLint</strong> — underlines likely mistakes as you type (you will use it heavily in the JS chapters).</li>
  <li><strong>Live Server</strong> — right-click an HTML file → "Open with Live Server" to preview in the browser and auto-reload on save.</li>
</ul>

<h3>Shortcuts that save hours</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl/Cmd + P</span><span class="v">Jump to any file by typing part of its name.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + /</span><span class="v">Comment or uncomment the current line.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + D</span><span class="v">Select the next occurrence of the word — edit many at once.</span></div>
  <div class="kv"><span class="k">Alt + ↑ / ↓</span><span class="v">Move the current line up or down.</span></div>
</div>

<p class="note-ct"><strong>Do not memorize all of these.</strong> Pick two, use them until they are automatic, then add more. Fluency in your editor is a real productivity multiplier — but it grows slowly and that is fine.</p>
<h3>The four editor features that actually save time</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Ctrl/Cmd + P</span><span class="lz-t">Jump to any file by name</span><span class="lz-d">Type three letters of the filename instead of clicking through folders. On a real project this replaces the file tree almost entirely.</span></div>
<div class="lz-node"><span class="lz-k">Ctrl/Cmd + Shift + F</span><span class="lz-t">Search the whole project</span><span class="lz-d">Find every place a function is called before you rename it. This is how you answer "what breaks if I change this?" — the most common real question.</span></div>
<div class="lz-node"><span class="lz-k">F2 — rename symbol</span><span class="lz-t">Rename everywhere at once</span><span class="lz-d">Unlike find-and-replace, it understands scope: it renames the variable, not every string that happens to match its letters.</span></div>
<div class="lz-node"><span class="lz-k">Format on save</span><span class="lz-t">Stop arguing with whitespace</span><span class="lz-d">Turn it on once in Settings. Consistent formatting also makes Git diffs readable, because only real changes show up.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — installing twenty extensions in the first week.</strong> Each one adds behaviour you did not choose and cannot attribute: your code reformats itself in a way you did not ask for, an unexpected autocompletion inserts an import from the wrong package, the editor gets slow and you assume that is normal. When something odd happens, you have twenty suspects and no way to tell which. Start with the language extension for what you are writing and a formatter, and add anything else only when you have felt the specific pain it solves. If the editor starts behaving strangely, the first debugging step is to disable extensions and re-enable them one at a time.</p></div>
<div class="link-card"><a href="https://code.visualstudio.com/docs/getstarted/tips-and-tricks" target="_blank" rel="noopener">VS Code — official tips &amp; tricks</a></div>
<div class="link-card"><a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf" target="_blank" rel="noopener">Keyboard shortcut cheat sheet (PDF)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Hãy mở một thư mục, đừng mở một file</h2>
<p class="lead">Thói quen VS Code quan trọng nhất: mở cả <strong>thư mục dự án</strong> (File → Open Folder), không phải từng file lẻ. Khi đó VS Code hiểu dự án, cho bạn cây thư mục bên trái, và terminal của nó mở ngay trong thư mục đó.</p>

<h3>Bốn vùng bạn sẽ dùng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Explorer (trái)</span><span class="v">Cây file của dự án. Bấm để mở, chuột phải để tạo/đổi tên/xoá.</span></div>
  <div class="kv"><span class="k">Editor (giữa)</span><span class="v">Nơi bạn viết. Mở nhiều file thành các tab; chia đôi màn hình cạnh nhau.</span></div>
  <div class="kv"><span class="k">Terminal tích hợp</span><span class="v">Ctrl+&#96; (dấu huyền) mở một terminal sẵn trong dự án — khỏi cần cd.</span></div>
  <div class="kv"><span class="k">Command Palette</span><span class="v">Ctrl/Cmd+Shift+P — tìm mọi lệnh theo tên. Khi lạc, bắt đầu từ đây.</span></div>
</div>

<h3>Extension đáng cài ngay ngày đầu</h3>
<ul>
  <li><strong>Prettier</strong> — tự định dạng mã. Bật "Format On Save" để mã lộn xộn tự chỉnh.</li>
  <li><strong>ESLint</strong> — gạch chân các lỗi khả dĩ ngay khi bạn gõ (dùng nhiều ở các chương JS).</li>
  <li><strong>Live Server</strong> — chuột phải một file HTML → "Open with Live Server" để xem trên trình duyệt và tự tải lại khi lưu.</li>
</ul>

<h3>Phím tắt tiết kiệm hàng giờ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Ctrl/Cmd + P</span><span class="v">Nhảy tới file bất kỳ bằng cách gõ một phần tên.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + /</span><span class="v">Ghi chú (comment) hoặc bỏ ghi chú dòng hiện tại.</span></div>
  <div class="kv"><span class="k">Ctrl/Cmd + D</span><span class="v">Chọn lần xuất hiện kế của từ — sửa nhiều chỗ cùng lúc.</span></div>
  <div class="kv"><span class="k">Alt + ↑ / ↓</span><span class="v">Di chuyển dòng hiện tại lên hoặc xuống.</span></div>
</div>

<p class="note-ct"><strong>Đừng học thuộc hết.</strong> Chọn hai cái, dùng tới khi thành phản xạ, rồi thêm. Thành thạo trình soạn thảo là một cấp số nhân năng suất thật — nhưng nó lớn chậm, và điều đó không sao.</p>
<h3>Bốn tính năng của trình soạn thảo thật sự tiết kiệm thời gian</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Ctrl/Cmd + P</span><span class="lz-t">Nhảy tới file bất kỳ bằng tên</span><span class="lz-d">Gõ ba chữ cái của tên file thay vì bấm lần qua các thư mục. Trên một dự án thật, cái này gần như thay hẳn cây thư mục.</span></div>
<div class="lz-node"><span class="lz-k">Ctrl/Cmd + Shift + F</span><span class="lz-t">Tìm khắp dự án</span><span class="lz-d">Tìm mọi chỗ gọi một hàm trước khi bạn đổi tên nó. Đây là cách trả lời "đổi cái này thì hỏng cái gì?" — câu hỏi thật hay gặp nhất.</span></div>
<div class="lz-node"><span class="lz-k">F2 — đổi tên ký hiệu</span><span class="lz-t">Đổi tên khắp nơi một lượt</span><span class="lz-d">Khác tìm-và-thay, nó hiểu phạm vi: nó đổi tên cái biến, chứ không đổi mọi chuỗi tình cờ trùng chữ.</span></div>
<div class="lz-node"><span class="lz-k">Format khi lưu</span><span class="lz-t">Thôi cãi nhau với khoảng trắng</span><span class="lz-d">Bật một lần trong Settings. Định dạng nhất quán còn làm các diff Git đọc được, vì chỉ thay đổi thật mới hiện ra.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — cài hai chục extension ngay tuần đầu.</strong> Mỗi cái thêm một hành vi bạn không chọn và không quy trách nhiệm được: mã tự định dạng lại theo kiểu bạn chẳng yêu cầu, một gợi ý tự động bất ngờ chèn import từ sai package, trình soạn thảo chậm đi và bạn tưởng thế là bình thường. Khi có chuyện lạ, bạn có hai chục kẻ tình nghi và không cách nào biết là ai. Hãy bắt đầu với extension của ngôn ngữ bạn đang viết cộng một bộ định dạng, và chỉ thêm thứ khác khi bạn đã thật sự thấy đau vì thiếu nó. Nếu trình soạn thảo bắt đầu cư xử lạ, bước gỡ lỗi đầu tiên là tắt hết extension rồi bật lại từng cái một.</p></div>
<div class="link-card"><a href="https://code.visualstudio.com/docs/getstarted/tips-and-tricks" target="_blank" rel="noopener">VS Code — mẹo &amp; thủ thuật chính thức</a></div>
<div class="link-card"><a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf" target="_blank" rel="noopener">Bảng tra phím tắt (PDF)</a></div>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — Git: a time machine for your code|||1.3 — Git: cỗ máy thời gian cho mã của bạn',
      slug: 'wf-1-3-git',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/8JJ101D3knE', durationSeconds: 0 },
      description: 'Repo, staging, commit, lịch sử, hoàn tác, .gitignore và branch — mô hình tư duy để không bao giờ mất code và luôn quay lại được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Git records snapshots so you can always go back</h2>
<p class="lead">Without version control, "save" means overwriting yesterday's work forever. Git instead keeps a <strong>timeline of snapshots</strong> (commits). You can see what changed, when, and why — and jump back if you break something. This is not optional for developers; it is the safety net under everything.</p>

<h3>The three areas — the mental model</h3>
<p>A file in a Git project moves through three places:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Working directory</span><span class="v">Your actual files as you edit them.</span></div>
  <div class="kv"><span class="k">Staging area</span><span class="v">A shortlist of changes you have chosen to include in the next snapshot (git add).</span></div>
  <div class="kv"><span class="k">Repository</span><span class="v">The permanent timeline of committed snapshots (git commit).</span></div>
</div>

<h3>The everyday commands</h3>
<pre><code>git init                 # turn a folder into a Git repo (once per project)
git status               # what changed? what is staged? — run this constantly
git add index.html       # stage one file  (git add . stages everything)
git commit -m "Add home page"   # snapshot the staged changes with a message
git log --oneline        # see the timeline of commits</code></pre>
<p>Think of it as a loop: edit → <code>git add</code> → <code>git commit</code>, over and over. Each commit is a labelled save point you can return to.</p>

<h3>Undo, safely</h3>
<pre><code>git restore index.html          # throw away un-staged edits to a file
git restore --staged index.html # un-stage (keep the edit, remove from shortlist)
git log --oneline               # find a commit hash to inspect or revert</code></pre>
<p class="pitfall"><strong>Write commit messages a human can read.</strong> "Fix login redirect bug" tells future-you what happened; "asdf" tells you nothing. Small, frequent, well-labelled commits are worth their weight in gold when something breaks.</p>

<h3>.gitignore — do not commit junk</h3>
<p>Some files should never be tracked: installed libraries (<code>node_modules/</code>), secrets (<code>.env</code>), build output. List them in a <code>.gitignore</code> file:</p>
<pre><code># .gitignore
node_modules/
.env
dist/</code></pre>

<h3>Branches, in one paragraph</h3>
<p>A <strong>branch</strong> is a parallel line of commits — a safe place to try a feature without touching the main code. <code>git switch -c new-feature</code> creates and moves to one; when it works, you merge it back into <code>main</code>. For solo learning you can live on <code>main</code>; branches shine when working with others.</p>

<h3>The three places your work can be</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Working directory</span><span class="lz-t">The files you are editing</span><span class="lz-d">What you see in the editor. Git knows they changed but has not recorded anything yet — <code>git status</code> lists them in red.</span></div>
<div class="lz-layer"><span class="lz-k">Staging area</span><span class="lz-t">What the next commit will contain</span><span class="lz-d"><code>git add</code> puts a file here. This step exists so you can commit three of your five changed files, which is how commits stay small and readable.</span></div>
<div class="lz-layer"><span class="lz-k">Repository</span><span class="lz-t">The permanent timeline</span><span class="lz-d"><code>git commit</code> writes a snapshot with a message and an author. Once here, the work is recoverable — this is the point of the whole exercise.</span></div>
<div class="lz-layer"><span class="lz-k">git status answers all three</span><span class="lz-t">Run it constantly</span><span class="lz-d">It tells you what is changed, what is staged, and what branch you are on. There is no such thing as running it too often.</span></div>
</div>
<div class="out">$ git status
On branch main
Changes to be committed:
  modified:   index.html

Changes not staged for commit:
  modified:   src/app.js

Untracked files:
  notes.txt</div>
<div class="pitfall"><p><strong>Trap — <code>git add .</code> commits the files you never meant to share.</strong> The dot means "everything here", including a <code>.env</code> with your database password, a 400MB video you were testing with, and the <code>node_modules</code> folder. Two of those are merely annoying; the <code>.env</code> is a real incident, because Git keeps history — deleting the file in a later commit does not remove it from the repository, and if it was pushed, it is public. Write a <code>.gitignore</code> before your first commit (Node projects need at least <code>node_modules/</code> and <code>.env</code>), and read what <code>git status</code> lists before every <code>git add .</code>.</p></div>
<div class="link-card"><a href="https://learngitbranching.js.org/" target="_blank" rel="noopener">Learn Git Branching — interactive visual practice</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Git ghi lại các ảnh chụp để bạn luôn quay lại được</h2>
<p class="lead">Không có quản lý phiên bản, "lưu" nghĩa là ghi đè vĩnh viễn công việc hôm qua. Git thì giữ một <strong>dòng thời gian các ảnh chụp</strong> (commit). Bạn thấy được cái gì đổi, khi nào, vì sao — và nhảy về nếu lỡ làm hỏng. Với lập trình viên đây không phải tuỳ chọn; nó là tấm lưới an toàn bên dưới mọi thứ.</p>

<h3>Ba vùng — mô hình tư duy</h3>
<p>Một file trong dự án Git đi qua ba nơi:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Working directory</span><span class="v">Các file thật khi bạn đang sửa.</span></div>
  <div class="kv"><span class="k">Staging area</span><span class="v">Danh sách rút gọn các thay đổi bạn chọn đưa vào ảnh chụp kế tiếp (git add).</span></div>
  <div class="kv"><span class="k">Repository</span><span class="v">Dòng thời gian vĩnh viễn các ảnh chụp đã commit (git commit).</span></div>
</div>

<h3>Các lệnh hằng ngày</h3>
<pre><code>git init                 # biến một thư mục thành repo Git (một lần mỗi dự án)
git status               # cái gì đổi? cái gì đã stage? — chạy liên tục
git add index.html       # stage một file  (git add . stage tất cả)
git commit -m "Them trang chu"   # chụp các thay đổi đã stage kèm thông điệp
git log --oneline        # xem dòng thời gian các commit</code></pre>
<p>Hãy coi như một vòng lặp: sửa → <code>git add</code> → <code>git commit</code>, lặp đi lặp lại. Mỗi commit là một điểm lưu có nhãn để bạn quay về.</p>

<h3>Hoàn tác, an toàn</h3>
<pre><code>git restore index.html          # vứt bỏ chỉnh sửa CHƯA stage của một file
git restore --staged index.html # bỏ stage (giữ chỉnh sửa, gỡ khỏi danh sách)
git log --oneline               # tìm mã hash của commit để xem hoặc revert</code></pre>
<p class="pitfall"><strong>Viết thông điệp commit để người đọc được.</strong> "Sua bug chuyen huong dang nhap" cho bạn-tương-lai biết đã xảy ra gì; "asdf" chẳng nói gì. Commit nhỏ, thường xuyên, có nhãn rõ đáng giá vàng khi có sự cố.</p>

<h3>.gitignore — đừng commit rác</h3>
<p>Có những file không bao giờ nên được theo dõi: thư viện đã cài (<code>node_modules/</code>), bí mật (<code>.env</code>), kết quả build. Liệt kê chúng trong file <code>.gitignore</code>:</p>
<pre><code># .gitignore
node_modules/
.env
dist/</code></pre>

<h3>Branch, trong một đoạn</h3>
<p>Một <strong>branch</strong> là một nhánh commit song song — chỗ an toàn để thử một tính năng mà không đụng mã chính. <code>git switch -c new-feature</code> tạo và chuyển sang một nhánh; khi chạy được, bạn gộp (merge) nó về <code>main</code>. Khi tự học một mình, bạn có thể ở luôn trên <code>main</code>; branch toả sáng khi làm việc nhóm.</p>

<h3>Ba chỗ mà công việc của bạn có thể đang nằm</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Thư mục làm việc</span><span class="lz-t">Những file bạn đang sửa</span><span class="lz-d">Thứ bạn thấy trong trình soạn thảo. Git biết chúng đã đổi nhưng chưa ghi lại gì cả — <code>git status</code> liệt kê chúng màu đỏ.</span></div>
<div class="lz-layer"><span class="lz-k">Vùng chờ (staging)</span><span class="lz-t">Thứ mà commit kế tiếp sẽ chứa</span><span class="lz-d"><code>git add</code> đặt một file vào đây. Bước này tồn tại để bạn commit được ba trong năm file đã sửa, và đó là cách các commit giữ được nhỏ gọn, dễ đọc.</span></div>
<div class="lz-layer"><span class="lz-k">Kho (repository)</span><span class="lz-t">Dòng thời gian vĩnh viễn</span><span class="lz-d"><code>git commit</code> ghi một ảnh chụp kèm thông điệp và tác giả. Vào tới đây rồi thì công việc lấy lại được — đó là toàn bộ mục đích của việc này.</span></div>
<div class="lz-layer"><span class="lz-k">git status trả lời cả ba</span><span class="lz-t">Chạy nó liên tục</span><span class="lz-d">Nó cho biết gì đã đổi, gì đã vào vùng chờ, và bạn đang ở nhánh nào. Không có chuyện chạy nó quá nhiều.</span></div>
</div>
<div class="out">$ git status
On branch main
Changes to be committed:
  modified:   index.html

Changes not staged for commit:
  modified:   src/app.js

Untracked files:
  notes.txt</div>
<div class="pitfall"><p><strong>Bẫy — <code>git add .</code> commit luôn những file bạn chẳng bao giờ định chia sẻ.</strong> Dấu chấm nghĩa là "mọi thứ ở đây", gồm cả một file <code>.env</code> chứa mật khẩu cơ sở dữ liệu, một video 400MB bạn đang thử, và cả thư mục <code>node_modules</code>. Hai thứ đầu chỉ phiền; còn <code>.env</code> là một sự cố thật, vì Git giữ lịch sử — xoá file ở một commit sau KHÔNG gỡ nó khỏi kho, và nếu đã push thì nó công khai rồi. Hãy viết <code>.gitignore</code> trước commit đầu tiên (dự án Node cần ít nhất <code>node_modules/</code> và <code>.env</code>), và đọc kỹ những gì <code>git status</code> liệt kê trước mỗi lần <code>git add .</code>.</p></div>
<div class="link-card"><a href="https://learngitbranching.js.org/" target="_blank" rel="noopener">Learn Git Branching — luyện trực quan, tương tác</a></div>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — GitHub: your code in the cloud|||1.4 — GitHub: mã của bạn trên đám mây',
      slug: 'wf-1-4-github',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/RGOj5yH7evk', durationSeconds: 0 },
      description: 'Remote, push/pull, clone, và vì sao GitHub vừa là bản sao lưu, vừa là hồ sơ nghề nghiệp, vừa là nơi cộng tác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Git is local; GitHub puts it online</h2>
<p class="lead">Git lives on your machine. <strong>GitHub</strong> is a website that hosts Git repositories, so your snapshots have an off-site backup, others can collaborate, and — importantly for a beginner — it becomes your public portfolio. Recruiters really do look.</p>

<h3>The word to learn: "remote"</h3>
<p>A <strong>remote</strong> is a copy of your repository somewhere else (on GitHub). By convention it is named <code>origin</code>. You <strong>push</strong> your local commits up to it and <strong>pull</strong> others' commits down.</p>
<pre><code># first time: connect your local repo to a GitHub repo you created
git remote add origin https://github.com/you/my-project.git
git branch -M main
git push -u origin main         # upload commits; -u links the branches

# from then on, the daily loop:
git add .
git commit -m "Describe what changed"
git push                        # send today's commits to GitHub</code></pre>

<h3>Clone vs pull</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git clone URL</span><span class="v">Download an entire repo you do not have yet (once, to start).</span></div>
  <div class="kv"><span class="k">git pull</span><span class="v">Fetch and merge new commits into a repo you already have (keep in sync).</span></div>
</div>

<h3>A pull request, briefly</h3>
<p>When collaborating, you push a branch and open a <strong>pull request (PR)</strong> — a proposal to merge your changes into <code>main</code>, where teammates review and discuss before it lands. You will not need PRs to learn solo, but knowing the word helps: it is how nearly all team software gets built.</p>

<p class="note-ct"><strong>Portfolio tip:</strong> push your practice projects to public GitHub repos with a short README explaining each. Six months from now that is real, browsable proof of what you can do — far more convincing than a line on a CV.</p>

<h3>Local Git and GitHub are two different things</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">git commit is local and instant</span><span class="lz-d">It writes to a <code>.git</code> folder on your own disk. No network involved, and nobody else can see it — you can commit on a plane.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">git push sends commits to GitHub</span><span class="lz-d">Only now does anything leave your machine. "I committed it" and "it is on GitHub" are different claims, and confusing them loses work when a laptop dies.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">git pull brings others' commits down</span><span class="lz-d">Fetches what changed and merges it into your branch. Do it before you start work, not after you have written for three hours.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">GitHub adds the collaboration layer</span><span class="lz-d">Pull requests, issues, review, CI. None of that is Git — it is GitHub's product built on top of Git's timeline.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — a repository that is public when you thought it was private.</strong> GitHub asks once, in a small radio button, and the default has changed over the years. A public repo is indexed by search engines within hours and scraped continuously by bots looking for exactly one thing: API keys committed by accident. People have woken up to thousands of dollars of cloud charges from a key pushed the night before. Check the badge next to the repository name — it says Public or Private — before your first push, and if a secret ever does get pushed, rotate the key immediately rather than deleting the commit; assume it was read within minutes.</p></div>
<div class="link-card"><a href="https://docs.github.com/en/get-started/quickstart/hello-world" target="_blank" rel="noopener">GitHub Hello World — the official 10-minute first repository</a></div>
<div class="link-card"><a href="https://docs.github.com/en/get-started/quickstart/hello-world" target="_blank" rel="noopener">GitHub — Hello World quickstart</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Git ở máy bạn; GitHub đưa nó lên mạng</h2>
<p class="lead">Git sống trên máy của bạn. <strong>GitHub</strong> là một website lưu trữ các repository Git, để ảnh chụp của bạn có bản sao lưu ngoài máy, người khác cộng tác được, và — quan trọng với người mới — nó thành hồ sơ nghề nghiệp công khai. Nhà tuyển dụng thật sự có xem.</p>

<h3>Từ cần học: "remote"</h3>
<p>Một <strong>remote</strong> là một bản sao repository của bạn ở nơi khác (trên GitHub). Theo quy ước nó tên là <code>origin</code>. Bạn <strong>push</strong> các commit local lên nó và <strong>pull</strong> commit của người khác về.</p>
<pre><code># lần đầu: nối repo local với một repo GitHub bạn đã tạo
git remote add origin https://github.com/ban/my-project.git
git branch -M main
git push -u origin main         # tải commit lên; -u liên kết hai nhánh

# từ đó về sau, vòng lặp hằng ngày:
git add .
git commit -m "Mo ta thay doi"
git push                        # gửi commit hôm nay lên GitHub</code></pre>

<h3>Clone và pull</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git clone URL</span><span class="v">Tải toàn bộ một repo bạn chưa có (một lần, để bắt đầu).</span></div>
  <div class="kv"><span class="k">git pull</span><span class="v">Lấy về và gộp các commit mới vào repo bạn đã có (giữ đồng bộ).</span></div>
</div>

<h3>Pull request, ngắn gọn</h3>
<p>Khi cộng tác, bạn push một branch và mở một <strong>pull request (PR)</strong> — một đề xuất gộp thay đổi của bạn vào <code>main</code>, nơi đồng đội xem xét và thảo luận trước khi nó vào. Bạn chưa cần PR để tự học, nhưng biết từ này rất hữu ích: gần như mọi phần mềm làm theo nhóm đều được dựng theo cách đó.</p>

<p class="note-ct"><strong>Mẹo hồ sơ:</strong> hãy push các dự án luyện tập lên repo GitHub công khai kèm một README ngắn giải thích từng cái. Sáu tháng sau đó là bằng chứng thật, xem được về khả năng của bạn — thuyết phục hơn nhiều một dòng trong CV.</p>

<h3>Git ở máy và GitHub là hai thứ khác nhau</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">git commit là cục bộ và tức thì</span><span class="lz-d">Nó ghi vào một thư mục <code>.git</code> trên đĩa của chính bạn. Không dính gì tới mạng, và không ai khác thấy được — bạn commit được cả khi đang trên máy bay.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">git push mới gửi commit lên GitHub</span><span class="lz-d">Chỉ tới lúc này mới có thứ gì rời khỏi máy bạn. "Tôi commit rồi" và "nó có trên GitHub rồi" là hai khẳng định khác nhau, và lẫn lộn chúng là mất việc khi cái laptop chết.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">git pull kéo commit của người khác về</span><span class="lz-d">Lấy phần đã đổi rồi trộn vào nhánh của bạn. Hãy làm trước khi bắt tay vào việc, đừng làm sau khi đã viết ba tiếng.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">GitHub thêm vào tầng cộng tác</span><span class="lz-d">Pull request, issue, review, CI. Không cái nào là Git cả — đó là sản phẩm của GitHub dựng trên dòng thời gian của Git.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — một kho công khai trong khi bạn tưởng nó riêng tư.</strong> GitHub hỏi đúng một lần, ở một nút radio bé tí, và giá trị mặc định đã đổi qua nhiều năm. Một kho công khai bị công cụ tìm kiếm lập chỉ mục trong vài giờ và bị bot quét liên tục để tìm đúng một thứ: khoá API lỡ tay commit. Đã có người thức dậy với hàng nghìn đô tiền dịch vụ đám mây từ một cái khoá đẩy lên đêm hôm trước. Hãy kiểm cái nhãn cạnh tên kho — nó ghi Public hay Private — trước lần push đầu tiên, và nếu đã lỡ đẩy một bí mật lên thì hãy đổi khoá ngay lập tức thay vì đi xoá commit; cứ coi như nó đã bị đọc trong vòng vài phút.</p></div>
<div class="link-card"><a href="https://docs.github.com/en/get-started/quickstart/hello-world" target="_blank" rel="noopener">GitHub Hello World — kho đầu tiên trong 10 phút, chính thức</a></div>
<div class="link-card"><a href="https://docs.github.com/en/get-started/quickstart/hello-world" target="_blank" rel="noopener">GitHub — Hello World quickstart</a></div>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — Node & npm: running JS and installing libraries|||1.5 — Node & npm: chạy JS và cài thư viện',
      slug: 'wf-1-5-node-npm',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/TlB_eWDSMt4', durationSeconds: 0 },
      description: 'package.json, npm install, scripts, dependencies vs devDependencies, node_modules và package-lock — hệ sinh thái mọi dự án JS đứng trên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Node runs JavaScript; npm brings in other people's code</h2>
<p class="lead">The browser was JavaScript's only home for years. <strong>Node.js</strong> freed it to run anywhere — on your machine, on a server. <strong>npm</strong> (Node Package Manager) comes with Node and installs libraries so you do not reinvent everything. Together they define how every modern JS project is set up.</p>

<h3>package.json — the ID card of a project</h3>
<p>Every project has a <code>package.json</code>: its name, version, scripts, and the list of libraries it needs. Create one with:</p>
<pre><code>npm init -y        # -y accepts the defaults</code></pre>
<pre><code>{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}</code></pre>

<h3>Installing libraries</h3>
<pre><code>npm install dayjs        # a runtime dependency (your app needs it to run)
npm install -D prettier  # a dev dependency (only needed while developing)
npm install              # install everything listed in package.json</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">dependencies</span><span class="v">Libraries your app needs at runtime, e.g. a date formatter, a web framework.</span></div>
  <div class="kv"><span class="k">devDependencies</span><span class="v">Tools only used while building/testing, e.g. Prettier, ESLint. Not shipped to production.</span></div>
</div>

<h3>node_modules and package-lock.json</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">node_modules/</span><span class="v">The actual downloaded library code. Huge, regenerable — never commit it (it is in .gitignore).</span></div>
  <div class="kv"><span class="k">package-lock.json</span><span class="v">Records the exact versions installed so teammates get an identical setup. DO commit this.</span></div>
</div>
<p class="pitfall"><strong>Deleting node_modules is safe.</strong> If installs get weird, delete <code>node_modules</code> and run <code>npm install</code> again — it rebuilds from <code>package.json</code>/<code>package-lock.json</code>. Never edit files inside <code>node_modules</code> by hand.</p>

<h3>Scripts — your project's shortcuts</h3>
<p>Anything in <code>"scripts"</code> runs with <code>npm run &lt;name&gt;</code> (<code>start</code> and <code>test</code> can drop the "run"). This is how you will launch every project: <code>npm run dev</code> to develop, <code>npm run build</code> to package, <code>npm start</code> to run.</p>

<p class="note-ct"><strong>Where this leads:</strong> the Node.js course is entirely built on this — Express, Prisma, everything is <code>npm install</code>-ed and launched via a script. And Next.js projects are created and run the exact same way.</p>

<h3>What npm install actually does</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Reads package.json</span><span class="lz-d">The list of packages your project declares it needs, with version ranges like <code>^4.18.0</code> — "4.18.0 or any later 4.x".</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Downloads them, and their dependencies</span><span class="lz-d">Every package has its own dependencies. Four declared packages routinely become three hundred folders in <code>node_modules</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Writes package-lock.json</span><span class="lz-d">The exact version of every single one. This file is what makes your machine and the server install identical code — commit it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">node_modules is disposable</span><span class="lz-d">Never commit it, never edit inside it. Deleting it and re-running <code>npm install</code> is a legitimate first debugging step.</span></div>
</div>
<div class="out">$ npm install express

added 69 packages, and audited 70 packages in 3s

found 0 vulnerabilities</div>
<div class="pitfall"><p><strong>Trap — <code>npm install</code> can quietly give the server different code than your laptop has.</strong> The <code>^</code> in <code>"express": "^4.18.0"</code> permits any 4.x release, so a deploy three weeks later installs 4.19.2 while you tested on 4.18.0. Usually nothing happens; occasionally a patch release changes behaviour and you get a bug that reproduces on the server and nowhere else — the worst kind to chase. <code>package-lock.json</code> exists exactly to prevent this, but only if you commit it <em>and</em> the deploy uses <code>npm ci</code> (which installs strictly from the lock file) rather than <code>npm install</code>. Check both; the two-word difference is the whole guarantee.</p></div>
<div class="link-card"><a href="https://docs.npmjs.com/about-npm" target="_blank" rel="noopener">npm — official docs</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Node chạy JavaScript; npm mang code của người khác về</h2>
<p class="lead">Trong nhiều năm, trình duyệt là nhà duy nhất của JavaScript. <strong>Node.js</strong> giải phóng nó để chạy ở bất cứ đâu — trên máy bạn, trên server. <strong>npm</strong> (Node Package Manager) đi kèm Node và cài các thư viện để bạn khỏi phát minh lại mọi thứ. Cùng nhau, chúng định nghĩa cách mọi dự án JS hiện đại được dựng.</p>

<h3>package.json — chứng minh thư của một dự án</h3>
<p>Mọi dự án đều có <code>package.json</code>: tên, phiên bản, các script, và danh sách thư viện nó cần. Tạo một cái bằng:</p>
<pre><code>npm init -y        # -y chấp nhận các giá trị mặc định</code></pre>
<pre><code>{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}</code></pre>

<h3>Cài thư viện</h3>
<pre><code>npm install dayjs        # một dependency runtime (app cần để chạy)
npm install -D prettier  # một dev dependency (chỉ cần khi phát triển)
npm install              # cài tất cả những gì liệt kê trong package.json</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">dependencies</span><span class="v">Thư viện app cần lúc chạy, vd bộ định dạng ngày, một web framework.</span></div>
  <div class="kv"><span class="k">devDependencies</span><span class="v">Công cụ chỉ dùng khi build/test, vd Prettier, ESLint. Không gửi lên production.</span></div>
</div>

<h3>node_modules và package-lock.json</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">node_modules/</span><span class="v">Mã thư viện đã tải về thật. To, tái tạo được — đừng bao giờ commit (nó nằm trong .gitignore).</span></div>
  <div class="kv"><span class="k">package-lock.json</span><span class="v">Ghi lại đúng phiên bản đã cài để đồng đội có cài đặt y hệt. HÃY commit file này.</span></div>
</div>
<p class="pitfall"><strong>Xoá node_modules là an toàn.</strong> Nếu việc cài trở nên kỳ lạ, xoá <code>node_modules</code> rồi chạy lại <code>npm install</code> — nó dựng lại từ <code>package.json</code>/<code>package-lock.json</code>. Đừng bao giờ sửa tay file bên trong <code>node_modules</code>.</p>

<h3>Scripts — lối tắt của dự án</h3>
<p>Bất cứ thứ gì trong <code>"scripts"</code> đều chạy bằng <code>npm run &lt;tên&gt;</code> (<code>start</code> và <code>test</code> có thể bỏ chữ "run"). Đây là cách bạn khởi động mọi dự án: <code>npm run dev</code> để phát triển, <code>npm run build</code> để đóng gói, <code>npm start</code> để chạy.</p>

<p class="note-ct"><strong>Điều này dẫn tới đâu:</strong> khoá Node.js hoàn toàn đứng trên nền này — Express, Prisma, mọi thứ đều được <code>npm install</code> và khởi động qua một script. Và dự án Next.js cũng được tạo và chạy y hệt cách này.</p>

<h3>npm install thật ra làm gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đọc package.json</span><span class="lz-d">Danh sách các package mà dự án khai là nó cần, kèm khoảng phiên bản kiểu <code>^4.18.0</code> — "4.18.0 hoặc bất kỳ bản 4.x nào mới hơn".</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Tải chúng về, cùng phụ thuộc của chúng</span><span class="lz-d">Mỗi package lại có phụ thuộc riêng. Bốn package khai ra thường thành ba trăm thư mục trong <code>node_modules</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ghi ra package-lock.json</span><span class="lz-d">Phiên bản chính xác của từng cái một. Chính file này làm máy bạn và máy chủ cài đúng cùng một mã — hãy commit nó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">node_modules là thứ vứt đi được</span><span class="lz-d">Đừng bao giờ commit nó, đừng bao giờ sửa bên trong nó. Xoá nó rồi chạy lại <code>npm install</code> là một bước gỡ lỗi đầu tiên chính đáng.</span></div>
</div>
<div class="out">$ npm install express

added 69 packages, and audited 70 packages in 3s

found 0 vulnerabilities</div>
<div class="pitfall"><p><strong>Bẫy — <code>npm install</code> có thể lặng lẽ cho máy chủ một mã khác với máy bạn.</strong> Dấu <code>^</code> trong <code>"express": "^4.18.0"</code> cho phép mọi bản 4.x, nên một lần deploy ba tuần sau sẽ cài 4.19.2 trong khi bạn thử trên 4.18.0. Thường thì chẳng sao; thỉnh thoảng một bản vá đổi hành vi và bạn có một lỗi chỉ tái hiện trên máy chủ chứ không ở đâu khác — loại khó đuổi nhất. <code>package-lock.json</code> sinh ra đúng để ngăn chuyện đó, nhưng chỉ khi bạn commit nó <em>và</em> khi deploy dùng <code>npm ci</code> (cài đúng theo file lock) chứ không phải <code>npm install</code>. Hãy kiểm cả hai; khác biệt hai chữ ấy chính là toàn bộ bảo đảm.</p></div>
<div class="link-card"><a href="https://docs.npmjs.com/about-npm" target="_blank" rel="noopener">npm — tài liệu chính thức</a></div>
</div>
`,
    },

    /* ─────────────────────────── 1.6 quiz ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra chương 1',
      slug: 'wf-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về terminal, đường dẫn, VS Code, Git, GitHub và npm.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 1: terminal navigation, absolute vs relative paths, VS Code, the Git snapshot model, GitHub remotes, and npm/package.json.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> These tools stick only through repetition. Drill real terminal and Git commands on Code Lab until they are muscle memory.</p>
<div class="link-card"><a href="/code-lab/git">Practice on Code Lab → Git track</a></div>
<div class="link-card"><a href="/code-lab/linux-bash">Practice on Code Lab → Linux &amp; Bash (terminal) track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 1: di chuyển terminal, đường dẫn tuyệt đối vs tương đối, VS Code, mô hình ảnh chụp của Git, remote GitHub, và npm/package.json.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Mấy công cụ này chỉ thấm qua lặp lại. Hãy luyện lệnh terminal và Git thật ở Code Lab tới khi thành phản xạ.</p>
<div class="link-card"><a href="/code-lab/git">Luyện tập ở Code Lab → track Git</a></div>
<div class="link-card"><a href="/code-lab/linux-bash">Luyện tập ở Code Lab → track Linux &amp; Bash (terminal)</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which command prints the folder you are currently in?|||Lệnh nào in ra thư mục bạn đang đứng?',
            options: ['pwd|||pwd', 'ls|||ls', 'cd|||cd', 'clear|||clear'],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a path, what does ../ mean?|||Trong một đường dẫn, ../ nghĩa là gì?',
            options: [
              'Go up one folder from where you are|||Lùi lên một thư mục so với chỗ bạn đứng',
              'The root of the disk|||Gốc của ổ đĩa',
              'The current folder|||Thư mục hiện tại',
              'Your home folder|||Thư mục nhà của bạn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is an ABSOLUTE path?|||Cái nào là đường dẫn TUYỆT ĐỐI?',
            options: [
              '/Users/binh/site/index.html|||/Users/binh/site/index.html',
              './src/app.js|||./src/app.js',
              '../images/logo.png|||../images/logo.png',
              'index.html|||index.html',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The recommended way to work in VS Code is to…|||Cách làm việc được khuyến nghị trong VS Code là…',
            options: [
              'Open the whole project folder, not single files|||Mở cả thư mục dự án, không phải file lẻ',
              'Open one file at a time from the Desktop|||Mở từng file một từ Desktop',
              'Never use the integrated terminal|||Không bao giờ dùng terminal tích hợp',
              'Disable all extensions|||Tắt mọi extension',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In Git, what does "git add" do?|||Trong Git, "git add" làm gì?',
            options: [
              'Stages changes for the next commit|||Đưa các thay đổi vào vùng stage cho commit kế tiếp',
              'Uploads commits to GitHub|||Tải commit lên GitHub',
              'Creates a new repository|||Tạo một repository mới',
              'Permanently deletes a file|||Xoá vĩnh viễn một file',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which command takes a snapshot with a message?|||Lệnh nào chụp một ảnh kèm thông điệp?',
            options: [
              'git commit -m "message"|||git commit -m "thông điệp"',
              'git status|||git status',
              'git add .|||git add .',
              'git log|||git log',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is a "remote" named origin?|||"remote" tên origin là gì?',
            options: [
              'A copy of your repo hosted elsewhere, e.g. on GitHub|||Một bản sao repo của bạn lưu ở nơi khác, vd trên GitHub',
              'The main branch of your project|||Nhánh chính của dự án',
              'A deleted commit|||Một commit đã bị xoá',
              'A VS Code extension|||Một extension của VS Code',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which file should you NOT commit to Git?|||File nào bạn KHÔNG nên commit vào Git?',
            options: [
              'node_modules/ (installed libraries)|||node_modules/ (thư viện đã cài)',
              'package.json|||package.json',
              'index.html|||index.html',
              'README.md|||README.md',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between dependencies and devDependencies?|||Khác biệt giữa dependencies và devDependencies là gì?',
            options: [
              'dependencies are needed at runtime; devDependencies only while developing|||dependencies cần lúc chạy; devDependencies chỉ khi phát triển',
              'They are identical|||Chúng y hệt nhau',
              'devDependencies run in the browser only|||devDependencies chỉ chạy trong trình duyệt',
              'dependencies are never installed|||dependencies không bao giờ được cài',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You run "npm run dev". Where is "dev" defined?|||Bạn chạy "npm run dev". "dev" được định nghĩa ở đâu?',
            options: [
              'In the "scripts" section of package.json|||Trong mục "scripts" của package.json',
              'Inside node_modules|||Bên trong node_modules',
              'In the .gitignore file|||Trong file .gitignore',
              'It is a built-in Node command|||Đó là một lệnh có sẵn của Node',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
