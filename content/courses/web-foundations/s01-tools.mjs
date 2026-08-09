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
