/**
 * Git & GitHub — Chương 14 (MỚI 09/2026): Git hằng ngày trong công cụ.
 * VS Code (Source Control, stage từng dòng, merge editor 3 cột, Timeline) · công cụ đồ hoạ
 * (Source Control Graph, Git Graph, GitLens Community, GitHub Desktop, lazygit) · .gitconfig nâng cao
 * (alias, includeIf hai danh tính, --show-origin) · làm nhóm với bạn dùng Windows (CRLF/LF, .gitattributes,
 * renormalize, đổi tên hoa/thường, bit chạy, đường dẫn dài).
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG <svg>.
 * Output lệnh: chạy thật bằng git 2.51.1 trong kho thử scratchpad/ch14-lab với HOME tạm; đường dẫn HOME
 * thử in tắt thành "~". Tên menu VS Code / GitHub Desktop / GitLens / Git Graph / lazygit kiểm trên trang
 * chính thức, tính đến 09/2026.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 14 — Everyday Git in your tools: VS Code, GUIs & config|||Chương 14 — Git hằng ngày trong công cụ: VS Code, giao diện đồ hoạ & cấu hình',
  description: 'Phần lớn thời gian bạn không gõ git mà bấm nút trong VS Code. Chương này nối mỗi nút bấm với lệnh thật bên dưới, chọn công cụ đồ hoạ đúng việc, dựng một .gitconfig tách danh tính trường và cá nhân, và làm cho một nhóm Mac + Windows hết cãi nhau vì ký tự xuống dòng.',
  lessons: [
    /* ─────────────────────────── 14.0 ─────────────────────────── */
    {
      title: '14.0 — Chapter 14 slides: Git inside your everyday tools|||14.0 — Slide Chương 14: Git bên trong công cụ hằng ngày',
      slug: 'git-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 14: panel Source Control và merge editor 3 cột vẽ lại, bảng so năm công cụ nhìn lịch sử, lazygit, các tầng cấu hình và includeIf hai danh tính, CRLF/LF, .gitattributes, renormalize, đổi tên hoa/thường và bit chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Most days you do not type <code>git</code> at all — you click buttons in VS Code. This chapter connects each of those buttons to the command it really runs, so that when something goes wrong you know which lever to pull.</p>
<p>There are no screenshots here: the VS Code Source Control panel, the three-pane merge editor and the lazygit screen are redrawn as wireframes, using the names that appear on the official pages (code.visualstudio.com, docs.github.com, the VS Code Marketplace and the lazygit README) as of 09/2026. Every terminal line — the conflict, <code>git config --list --show-origin</code>, the two <code>includeIf</code> traps, <code>git ls-files --eol</code>, the renormalize commit and the case-only rename — is real output from Git 2.51 in a throw-away repository with a temporary home directory (printed as <code>~</code>). The last two slides are a cheat sheet and a 45-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Phần lớn các ngày bạn không gõ <code>git</code> chút nào — bạn bấm nút trong VS Code. Chương này nối từng nút bấm đó với lệnh thật nó chạy bên dưới, để khi có chuyện bạn biết phải kéo cần gạt nào.</p>
<p>Ở đây không có ảnh chụp màn hình: panel Source Control (quản lý mã nguồn) của VS Code, merge editor (trình gộp) ba khung và màn hình lazygit được vẽ lại thành wireframe (bản phác giao diện), dùng đúng tên gọi trên trang chính thức (code.visualstudio.com, docs.github.com, VS Code Marketplace và README của lazygit) tính đến 09/2026. Mọi dòng terminal — vụ xung đột, <code>git config --list --show-origin</code>, hai cái bẫy của <code>includeIf</code>, <code>git ls-files --eol</code>, commit chuẩn hoá xuống dòng và vụ đổi tên chỉ khác hoa/thường — đều là output thật của Git 2.51 trong một kho thử với thư mục HOME tạm (in tắt thành <code>~</code>). Hai slide cuối là bảng tra nhanh và một buổi thực hành 45 phút.</p>
</div>
${gallery('git-14', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Panel Source Control của VS Code'], [4, 'Mỗi nút bấm là một lệnh Git'],
  [5, 'Merge editor 3 cột: Incoming · Current · Result'], [6, 'Năm cách nhìn lịch sử — bảng so'],
  [7, 'lazygit trong terminal'], [8, 'GUI để nhìn, terminal để hiểu và cứu hộ'], [9, 'Các tầng cấu hình và --show-origin'],
  [10, 'Alias và sáu thiết lập đáng bật'], [11, 'includeIf: hai danh tính'], [12, 'Hai cái bẫy includeIf'],
  [13, 'CRLF và LF'], [14, 'core.autocrlf và .gitattributes'], [15, 'Chuẩn hoá bằng renormalize'],
  [16, 'Đổi tên hoa/thường và quyền chạy file'], [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 14'],
])}
`,
    },

    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — Git in VS Code: every button is a command|||14.1 — Git trong VS Code: mỗi nút bấm là một lệnh',
      slug: 'git-14-1-vs-code',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Panel Source Control, stage từng dòng (tương đương git add -p), diff, commit và Sync, merge editor ba khung để giải xung đột, Timeline — và những chỗ giao diện giấu mất lệnh thật bên dưới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>VS Code is a Git client — learn which command each button runs</h2>
<p class="lead">You already know the commands: <code>add</code>, <code>add -p</code>, <code>commit</code>, <code>restore</code>, <code>pull</code>, <code>push</code>, <code>merge</code>. VS Code does not replace them — it runs them for you. That is a real speed-up, as long as you can still say, for every button, which command it is and what that command can destroy.</p>

<h3>The Source Control view</h3>
${slide('git-14', 3, 'Panel Source Control của VS Code (vẽ lại)')}
<p>Open it with <code>Ctrl+Shift+G</code> (<code>⌃⇧G</code> on a Mac — yes, Control, not Command). From top to bottom it is a picture of the three trees from Chapter 1:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Message box + Commit</span><span class="v">What you type becomes the commit message. The sparkle icon in the box asks an AI model to draft it — read what it wrote before accepting; it describes the diff, not your reason.</span></div>
  <div class="kv"><span class="k">Staged Changes</span><span class="v">The index. Exactly what the next commit will contain — the same list as the "Changes to be committed" block of <code>git status</code>.</span></div>
  <div class="kv"><span class="k">Changes</span><span class="v">The working directory: modified (<code>M</code>) and untracked (<code>U</code>) files. <code>+</code> stages a file, <code>↶</code> discards its changes.</span></div>
  <div class="kv"><span class="k">Graph</span><span class="v">The Source Control Graph: commits and branches, with <em>incoming</em> commits (on the remote, not yet pulled) and <em>outgoing</em> commits (local, not yet pushed).</span></div>
  <div class="kv"><span class="k">Status bar</span><span class="v">The current branch (click to switch) and the sync indicator with incoming/outgoing counts.</span></div>
</div>

<h3>Staging lines, not files — the button version of <code>git add -p</code></h3>
<p>Click a file in Changes and VS Code opens the diff editor: the committed version on the left, your working copy on the right. Now the most useful habit of this lesson: select only the lines that belong to one idea, right-click and choose <strong>Stage Selected Ranges</strong> (the same command exists in the Command Palette as <strong>Git: Stage Selected Ranges</strong>, and the diff gutter shows a <strong>Stage</strong> button next to a selection). The <code>console.log("debug")</code> two lines below stays in Changes.</p>
<p>That is exactly <code>git add -p</code> from Chapter 1 — answer <code>y</code> for the hunk you want and <code>n</code> for the rest — just with a mouse. To go back, the Staged Changes list has <strong>−</strong> (<strong>Unstage Changes</strong>), and the diff gutter has an <strong>Unstage</strong> button for single lines.</p>
<pre><code class="language-bash"><span class="tok-comment"># the terminal equivalent, for when VS Code is not there (SSH, a VPS, a teammate's laptop)</span>
git add -p lich.js      <span class="tok-comment"># y = stage this hunk, n = skip, s = split into smaller hunks</span>
git diff --staged       <span class="tok-comment"># what the commit will contain</span>
git diff                <span class="tok-comment"># what stays behind</span></code></pre>

<h3>Every button is a command</h3>
${slide('git-14', 4, 'Mỗi nút bấm là một lệnh Git')}
<table>
<thead><tr><th>In VS Code</th><th>Roughly equivalent to</th><th>Watch out</th></tr></thead>
<tbody>
<tr><td><code>+</code> Stage Changes</td><td><code>git add lich.js</code></td><td>—</td></tr>
<tr><td>Stage Selected Ranges</td><td><code>git add -p</code></td><td>the cheapest way to make clean commits</td></tr>
<tr><td>Commit with nothing staged</td><td><code>git add -A</code> + <code>git commit</code></td><td>VS Code may offer to stage everything — including the <code>.env</code> you just created</td></tr>
<tr><td>Commit (Amend)</td><td><code>git commit --amend</code></td><td>new hash; never on a commit you already pushed to a shared branch</td></tr>
<tr><td>More Actions (…) → Commit → Undo Last Commit</td><td><code>git reset --soft HEAD~1</code></td><td>safe: the changes come back as Staged</td></tr>
<tr><td><code>↶</code> Discard Changes</td><td><code>git restore lich.js</code> (untracked file: deleted)</td><td>uncommitted work is gone — it was never in the reflog</td></tr>
<tr><td>Sync Changes</td><td><code>git pull</code>, then <code>git push</code></td><td>the pull may merge or rebase; you are not asked which</td></tr>
</tbody>
</table>
<p>"Roughly" is honest: VS Code adds flags of its own. When you need the exact command line, stop guessing and read it: <strong>More Actions (…) → Show Git Output</strong>, or the Output panel with the <strong>Git</strong> channel selected (code.visualstudio.com, 09/2026). Every command the editor ran is logged there, together with Git's full error message — which the pop-up notification often shortens to "Git: failed".</p>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>"Commit" with nothing staged.</b> VS Code offers to stage all changes and commit them directly; you click yes at 1 a.m., and the <code>.env</code> with the database password travels to GitHub with the fix. <b>Discard to "clean up".</b> You meant to throw away one debug line and discarded the whole file — including two hours of work that was never committed and therefore never in the reflog. <b>Sync on the wrong branch.</b> The status bar said <code>main</code>, not your feature branch; Sync pushed your half-finished commit straight to the branch the whole team pulls from.</div>

<h3>Resolving conflicts in the three-pane merge editor</h3>
${slide('git-14', 5, 'Merge editor 3 cột: Incoming · Current · Result')}
<p>Here is a real conflict from the test repository — the doctor wanted the clinic to open at 07:00, a teammate's branch says 07:30:</p>
<pre><code class="language-bash">git merge feature/gio-sang</code></pre>
<div class="out">Auto-merging lich.js
CONFLICT (content): Merge conflict in lich.js
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git status -s</code></pre>
<div class="out">UU lich.js</div>
<p>Open <code>lich.js</code> and VS Code shows the familiar markers with small inline actions above them — <strong>Accept Current Change</strong>, <strong>Accept Incoming Change</strong>, <strong>Accept Both Changes</strong>, <strong>Compare Changes</strong>. For anything bigger than one line, click <strong>Resolve in Merge Editor</strong> (or right-click the file → <strong>Open in Merge Editor</strong>). You get three panes:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Incoming (top left)</span><span class="v">The branch being merged in — <code>feature/gio-sang</code>. In Git's words, "theirs".</span></div>
  <div class="kv"><span class="k">Current (top right)</span><span class="v">The branch you are on — <code>HEAD</code>, "ours". Here: <code>main</code> with 07:00.</span></div>
  <div class="kv"><span class="k">Result (bottom)</span><span class="v">The file that will be written. You can also type in it directly.</span></div>
</div>
<p>Above each conflict in Incoming and Current there are small actions — <strong>Accept Incoming</strong> / <strong>Accept Current</strong>, <strong>Accept Combination</strong> and <strong>Ignore</strong> — and a counter shows how many conflicts remain. When the counter reaches zero, press <strong>Complete Merge</strong>. Read the docs' own warning carefully: Complete Merge stages <em>this file</em>; it does not finish the merge. The terminal shows the difference:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">On branch main
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)</div>
<p>You still have to commit (the Commit button, or <code>git commit</code>). If you are in the middle of a rebase instead, the next step is <code>git rebase --continue</code>, not a commit — which is exactly the kind of thing a button hides from you.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t"><code>git merge</code></div><div class="lz-d">CONFLICT — the file shows as <code>UU</code>.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Resolve in Merge Editor</div><div class="lz-d">Pick Incoming, Current or a combination; edit Result if needed.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Complete Merge</div><div class="lz-d">Stages this file — the same as <code>git add lich.js</code>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t"><code>git commit</code></div><div class="lz-d">Concludes the merge (during a rebase: <code>git rebase --continue</code>).</div></div>
</div>
<div class="callout ok">Want VS Code as the tool behind <code>git mergetool</code> and <code>git commit</code> too? <code>git config --global core.editor "code --wait"</code> makes commit messages and interactive rebases open in a VS Code tab; <code>code --wait --merge</code> is the command-line entry to the same merge editor. Both need the <code>code</code> command on your PATH (Command Palette → "Shell Command: Install 'code' command in PATH" on macOS).</div>

<h3>Timeline, blame and the graph</h3>
<p>Three places answer "who changed this, and when?" without leaving the editor:</p>
<ul>
<li><strong>Timeline</strong> — in the Explorer view (<code>Ctrl+Shift+E</code>), expand Timeline: the Git commits (and local saves) of the file that is open. The filter can show only Git commits. It is <code>git log --follow -- lich.js</code> as a list.</li>
<li><strong>Blame</strong> — the settings <code>git.blame.editorDecoration.enabled</code> (inline, at the end of the current line) and <code>git.blame.statusBarItem.enabled</code> (in the status bar) show who last touched a line. That is <code>git blame -L 12,12 lich.js</code>.</li>
<li><strong>Source Control Graph</strong> — in the Source Control view. It answers "am I behind?" at a glance: incoming commits are on the remote and not pulled yet, outgoing commits are local and not pushed.</li>
</ul>

<h3>When the interface hides what matters</h3>
<p>A GUI is optimised for the common case, and the common case is fine. The trouble is the other five percent:</p>
<ul>
<li><strong>One button, two operations.</strong> Sync is pull-then-push. If your pull strategy is merge, a merge commit may appear that you never asked for; if it is rebase, your commits get new hashes. Set <code>pull.rebase</code> deliberately (14.3) so Sync behaves the way you expect.</li>
<li><strong>State you cannot see.</strong> "Rebasing", "merging", "detached HEAD" show up as a small hint at best. <code>git status</code> always prints the state on its first lines.</li>
<li><strong>No undo for discard.</strong> The reflog (Chapter 13) only remembers commits. Uncommitted work that you discard is gone — the only safety net is to commit or stash first.</li>
<li><strong>Errors in one sentence.</strong> The notification says "failed"; Show Git Output has the paragraph that tells you why.</li>
</ul>

<div class="pitfall"><strong>Trap:</strong> Commit (Amend) after Sync. The commit is already on GitHub; amending gives it a new hash, and the next Sync either refuses or pulls the old version back and merges it with the new one — two copies of the same change in the history. Amend only commits you have not pushed.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Open <code>thu-git</code> in VS Code (<code>code .</code>). In one file make three unrelated edits: fix a typo on the first line, rename a variable near the bottom, and add <code>console.log("debug")</code> in the middle.</li><li>In the diff editor select only the typo line → <strong>Stage Selected Ranges</strong>. Before committing, check in the terminal: <code>git diff --staged</code> must show only the typo. Commit <code>fix: typo</code>. Do the same for the rename (<code>refactor: …</code>). Discard only the debug line.</li><li>Make a conflict: <code>git switch -c gio-sang</code>, change one line, commit; <code>git switch main</code>, change the same line differently, commit; <code>git merge gio-sang</code>. Resolve it in the merge editor and press Complete Merge — then run <code>git status</code> before you commit, and read what it says.</li><li>Open <strong>Show Git Output</strong> and find the lines VS Code ran for your two stage-and-commit steps.</li></ol>
<p><strong>Done when:</strong> <code>git log -p -3</code> shows the typo fix and the rename as two separate commits with no <code>console.log</code> in either, <code>git log --oneline --graph -5</code> shows your merge commit with two parents, and you can name one command you saw in the Git output.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Source Control view</span><span class="v">VS Code's Git panel (<code>Ctrl+Shift+G</code>): message box, Staged Changes, Changes, Graph.</span></div>
  <div class="kv"><span class="k">Stage Selected Ranges</span><span class="v">Stage only the selected lines of a file — the mouse version of <code>git add -p</code>.</span></div>
  <div class="kv"><span class="k">Merge editor</span><span class="v">VS Code's three-pane conflict view: Incoming, Current, Result, finished with Complete Merge.</span></div>
  <div class="kv"><span class="k">Incoming / Current</span><span class="v">The branch being merged in ("theirs") / the branch you are on, <code>HEAD</code> ("ours").</span></div>
  <div class="kv"><span class="k">Sync Changes</span><span class="v">Pull, then push — two operations behind one button.</span></div>
  <div class="kv"><span class="k">Git output channel</span><span class="v">The log of every Git command VS Code ran, with full error text (More Actions → Show Git Output).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Every Source Control button runs a Git command; know which one before you click, especially Discard, Amend and Sync.</li><li>Stage Selected Ranges is <code>git add -p</code> with a mouse, and the easiest way to keep one idea per commit.</li><li>In the merge editor, Incoming is the branch coming in and Current is <code>HEAD</code>; Complete Merge only stages the file — you still commit.</li><li>Discarded uncommitted work is not in the reflog; commit or stash before "cleaning up".</li><li>When a button fails, read Show Git Output or run <code>git status</code> — the full answer is there, not in the notification.</li></ul>

<a class="link-card" href="https://code.visualstudio.com/docs/sourcecontrol/staging-commits" target="_blank" rel="noopener">
  <span class="lc-ico">🟦</span>
  <span class="lc-body"><span class="lc-title">VS Code Docs — Staging and committing</span><span class="lc-sub">Stage Selected Ranges, Unstage, Commit (Amend), Undo Last Commit, Discard.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/sourcecontrol/merge-conflicts" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">VS Code Docs — Resolve merge conflicts</span><span class="lc-sub">Inline actions, the three-pane merge editor, Complete Merge.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/sourcecontrol/troubleshooting" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">VS Code Docs — Source control troubleshooting</span><span class="lc-sub">Show Git Output, the Git channel, log levels, git.path.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> the GUI is a faster keyboard, not a different Git. Use it for the ninety-five percent of the day that is routine, and keep the terminal for the moment the state is unclear — that is when a button guesses and a command tells you.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>VS Code là một Git client — hãy biết mỗi nút chạy lệnh gì</h2>
<p class="lead">Bạn đã biết các lệnh: <code>add</code>, <code>add -p</code>, <code>commit</code>, <code>restore</code>, <code>pull</code>, <code>push</code>, <code>merge</code>. VS Code không thay chúng — nó chạy chúng hộ bạn. Đó là một cú tăng tốc thật, miễn là với mỗi nút bạn vẫn nói được nó là lệnh nào và lệnh đó có thể phá mất cái gì.</p>

<h3>Panel Source Control</h3>
${slide('git-14', 3, 'Panel Source Control của VS Code (vẽ lại)')}
<p>Mở bằng <code>Ctrl+Shift+G</code> (trên Mac là <code>⌃⇧G</code> — đúng, phím Control, không phải Command). Từ trên xuống, nó chính là bức tranh ba cây ở Chương 1:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ô lời nhắn + Commit</span><span class="v">Chữ bạn gõ thành lời nhắn commit (commit message). Biểu tượng lấp lánh trong ô nhờ AI viết nháp — đọc kỹ trước khi nhận: nó tả bản diff, không biết lý do của bạn.</span></div>
  <div class="kv"><span class="k">Staged Changes</span><span class="v">Thay đổi đã stage (đưa vào vùng chờ) — chính là index. Đúng thứ commit tới sẽ chứa, cùng danh sách với khối "Changes to be committed" của <code>git status</code>.</span></div>
  <div class="kv"><span class="k">Changes</span><span class="v">Thay đổi chưa stage — thư mục làm việc: file đã sửa (<code>M</code>) và file chưa được theo dõi (<code>U</code>, untracked). <code>+</code> là stage file, <code>↶</code> là vứt bỏ thay đổi (discard).</span></div>
  <div class="kv"><span class="k">Graph</span><span class="v">Source Control Graph (đồ thị quản lý mã nguồn): commit và nhánh, có commit <em>incoming</em> (đến — có trên remote, chưa pull) và <em>outgoing</em> (đi — có ở máy, chưa push).</span></div>
  <div class="kv"><span class="k">Thanh trạng thái</span><span class="v">Status bar ở đáy cửa sổ: nhánh hiện tại (bấm để đổi nhánh) và nút đồng bộ kèm số commit đến/đi.</span></div>
</div>

<h3>Stage từng dòng chứ không phải cả file — phiên bản nút bấm của <code>git add -p</code></h3>
<p>Bấm một file trong Changes, VS Code mở trình so sánh (diff editor): bản đã commit bên trái, bản đang sửa bên phải. Giờ tới thói quen đáng giá nhất của bài này: bôi đen chỉ những dòng thuộc về MỘT ý, chuột phải, chọn <strong>Stage Selected Ranges</strong> (stage các vùng đang chọn; lệnh này cũng có trong Command Palette dưới tên <strong>Git: Stage Selected Ranges</strong>, và lề diff hiện một nút <strong>Stage</strong> cạnh vùng chọn). Dòng <code>console.log("debug")</code> ở dưới hai dòng vẫn nằm lại trong Changes.</p>
<p>Đó đúng là <code>git add -p</code> của Chương 1 — trả lời <code>y</code> cho khúc (hunk) bạn muốn, <code>n</code> cho phần còn lại — chỉ là làm bằng chuột. Muốn lùi lại thì danh sách Staged Changes có nút <strong>−</strong> (<strong>Unstage Changes</strong> — bỏ stage), còn lề diff có nút <strong>Unstage</strong> cho từng dòng.</p>
<pre><code class="language-bash"><span class="tok-comment"># bản tương đương ở terminal, cho lúc không có VS Code (SSH, VPS, laptop của bạn cùng nhóm)</span>
git add -p lich.js      <span class="tok-comment"># y = stage khúc này, n = bỏ qua, s = chẻ nhỏ khúc</span>
git diff --staged       <span class="tok-comment"># thứ commit sẽ chứa</span>
git diff                <span class="tok-comment"># thứ còn nằm lại</span></code></pre>

<h3>Mỗi nút bấm là một lệnh</h3>
${slide('git-14', 4, 'Mỗi nút bấm là một lệnh Git')}
<table>
<thead><tr><th>Trong VS Code</th><th>Tương đương gần đúng</th><th>Cần để ý</th></tr></thead>
<tbody>
<tr><td><code>+</code> Stage Changes</td><td><code>git add lich.js</code></td><td>—</td></tr>
<tr><td>Stage Selected Ranges</td><td><code>git add -p</code></td><td>cách rẻ nhất để có commit sạch</td></tr>
<tr><td>Commit khi CHƯA stage gì</td><td><code>git add -A</code> + <code>git commit</code></td><td>VS Code có thể đề nghị stage hết — kể cả file <code>.env</code> bạn vừa tạo</td></tr>
<tr><td>Commit (Amend)</td><td><code>git commit --amend</code></td><td>ra mã băm mới; đừng bao giờ làm với commit đã push lên nhánh chung</td></tr>
<tr><td>More Actions (…) → Commit → Undo Last Commit</td><td><code>git reset --soft HEAD~1</code></td><td>an toàn: thay đổi quay về Staged</td></tr>
<tr><td><code>↶</code> Discard Changes</td><td><code>git restore lich.js</code> (file chưa track: bị xoá)</td><td>công việc chưa commit mất hẳn — nó chưa từng vào reflog</td></tr>
<tr><td>Sync Changes</td><td><code>git pull</code> rồi <code>git push</code></td><td>bước pull có thể merge hoặc rebase; bạn không được hỏi</td></tr>
</tbody>
</table>
<p>Chữ "gần đúng" là nói thật: VS Code thêm cờ (flag) của riêng nó. Khi cần đúng dòng lệnh, đừng đoán mà hãy đọc: <strong>More Actions (…) → Show Git Output</strong>, hoặc panel Output rồi chọn kênh <strong>Git</strong> (code.visualstudio.com, 09/2026). Mọi lệnh trình soạn thảo đã chạy đều được ghi ở đó, kèm nguyên văn lỗi của Git — thứ mà thông báo bật lên thường rút gọn thành một câu "Git: failed".</p>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Bấm "Commit" khi chưa stage gì.</b> VS Code đề nghị stage hết rồi commit luôn; một giờ sáng bạn bấm đồng ý, và file <code>.env</code> chứa mật khẩu cơ sở dữ liệu đi lên GitHub cùng bản sửa lỗi. <b>Discard để "dọn cho sạch".</b> Bạn định vứt một dòng debug, lại vứt cả file — kèm hai giờ làm việc chưa commit nên chưa từng có trong reflog. <b>Sync nhầm nhánh.</b> Thanh trạng thái ghi <code>main</code> chứ không phải nhánh tính năng của bạn; Sync đẩy thẳng commit làm dở lên đúng nhánh cả nhóm đang pull về.</div>

<h3>Giải xung đột bằng merge editor ba khung</h3>
${slide('git-14', 5, 'Merge editor 3 cột: Incoming · Current · Result')}
<p>Đây là một xung đột thật trong kho thử — bác sĩ muốn phòng khám mở cửa lúc 07:00, còn nhánh của bạn cùng nhóm ghi 07:30:</p>
<pre><code class="language-bash">git merge feature/gio-sang</code></pre>
<div class="out">Auto-merging lich.js
CONFLICT (content): Merge conflict in lich.js
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git status -s</code></pre>
<div class="out">UU lich.js</div>
<p>Mở <code>lich.js</code>, VS Code hiện các dấu xung đột quen thuộc kèm vài nút nhỏ ngay phía trên — <strong>Accept Current Change</strong> (nhận bản hiện tại), <strong>Accept Incoming Change</strong> (nhận bản đến), <strong>Accept Both Changes</strong> (nhận cả hai), <strong>Compare Changes</strong> (so sánh). Với thứ gì lớn hơn một dòng, bấm <strong>Resolve in Merge Editor</strong> (hoặc chuột phải vào file → <strong>Open in Merge Editor</strong>). Bạn có ba khung:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Incoming (trên, trái)</span><span class="v">Nhánh đang được nhập vào — <code>feature/gio-sang</code>. Theo cách Git gọi là "theirs" (của họ).</span></div>
  <div class="kv"><span class="k">Current (trên, phải)</span><span class="v">Nhánh bạn đang đứng — <code>HEAD</code>, "ours" (của mình). Ở đây là <code>main</code> với 07:00.</span></div>
  <div class="kv"><span class="k">Result (dưới)</span><span class="v">Kết quả — file sẽ được ghi ra. Bạn cũng gõ thẳng vào đây được.</span></div>
</div>
<p>Phía trên mỗi xung đột trong Incoming và Current có vài nút nhỏ — <strong>Accept Incoming</strong> / <strong>Accept Current</strong>, <strong>Accept Combination</strong> (nhận cả hai, ghép lại) và <strong>Ignore</strong> (bỏ qua) — và một bộ đếm cho biết còn bao nhiêu xung đột. Bộ đếm về 0 thì bấm <strong>Complete Merge</strong> (hoàn tất gộp). Đọc kỹ lời cảnh báo của chính tài liệu VS Code: Complete Merge chỉ stage <em>file này</em>; nó không kết thúc lần merge. Terminal cho thấy khác biệt đó:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">On branch main
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)</div>
<p>Bạn vẫn phải commit (nút Commit, hoặc <code>git commit</code>). Còn nếu bạn đang ở giữa một lần rebase, bước tiếp theo là <code>git rebase --continue</code>, không phải commit — đúng loại chuyện mà một nút bấm che mất khỏi mắt bạn.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t"><code>git merge</code></div><div class="lz-d">CONFLICT — file hiện trạng thái <code>UU</code>.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Resolve in Merge Editor</div><div class="lz-d">Chọn Incoming, Current hay ghép cả hai; sửa Result nếu cần.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Complete Merge</div><div class="lz-d">Stage file này — tương đương <code>git add lich.js</code>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t"><code>git commit</code></div><div class="lz-d">Kết thúc lần merge (đang rebase thì: <code>git rebase --continue</code>).</div></div>
</div>
<div class="callout ok">Muốn VS Code làm luôn công cụ đứng sau <code>git mergetool</code> và <code>git commit</code>? <code>git config --global core.editor "code --wait"</code> làm lời nhắn commit và rebase tương tác mở trong một tab VS Code; <code>code --wait --merge</code> là lối vào từ dòng lệnh tới đúng merge editor đó. Cả hai cần lệnh <code>code</code> có trong PATH (trên macOS: Command Palette → "Shell Command: Install 'code' command in PATH").</div>

<h3>Timeline, blame và đồ thị</h3>
<p>Ba chỗ trả lời câu "ai đổi dòng này, lúc nào?" mà không cần rời trình soạn thảo:</p>
<ul>
<li><strong>Timeline</strong> (dòng thời gian) — trong Explorer (<code>Ctrl+Shift+E</code>), mở mục Timeline: các commit Git (và các lần lưu cục bộ) của file đang mở. Bộ lọc cho phép chỉ hiện commit Git. Nó là <code>git log --follow -- lich.js</code> dưới dạng danh sách.</li>
<li><strong>Blame</strong> (ai sửa dòng này) — hai thiết lập <code>git.blame.editorDecoration.enabled</code> (hiện ngay cuối dòng đang đứng) và <code>git.blame.statusBarItem.enabled</code> (hiện ở thanh trạng thái) cho biết ai chạm vào dòng đó lần cuối. Tức là <code>git blame -L 12,12 lich.js</code>.</li>
<li><strong>Source Control Graph</strong> — ngay trong panel Source Control. Nó trả lời câu "mình có đang tụt lại không?" trong một cái liếc: commit incoming có trên remote mà chưa pull, commit outgoing có ở máy mà chưa push.</li>
</ul>

<h3>Khi giao diện che mất điều quan trọng</h3>
<p>Giao diện đồ hoạ (GUI) được tối ưu cho trường hợp thường gặp, và trường hợp thường gặp thì ổn. Rắc rối nằm ở năm phần trăm còn lại:</p>
<ul>
<li><strong>Một nút, hai thao tác.</strong> Sync là pull rồi push. Nếu kiểu pull của bạn là merge, một merge commit bạn không hề muốn có thể xuất hiện; nếu là rebase, commit của bạn đổi mã băm. Hãy đặt <code>pull.rebase</code> có chủ đích (bài 14.3) để Sync làm đúng điều bạn chờ đợi.</li>
<li><strong>Trạng thái bạn không nhìn thấy.</strong> "Đang rebase", "đang merge", "detached HEAD" (HEAD tách rời) cùng lắm chỉ hiện thành một gợi ý nhỏ. <code>git status</code> thì luôn in trạng thái ở mấy dòng đầu.</li>
<li><strong>Discard không có "hoàn tác".</strong> Reflog (Chương 13) chỉ nhớ commit. Công việc chưa commit mà bạn vứt đi là mất — lưới an toàn duy nhất là commit hoặc stash trước.</li>
<li><strong>Lỗi gói trong một câu.</strong> Thông báo ghi "failed"; Show Git Output có cả đoạn văn giải thích vì sao.</li>
</ul>

<div class="pitfall"><strong>Bẫy:</strong> Commit (Amend) sau khi đã Sync. Commit đó đã nằm trên GitHub; amend cho nó một mã băm mới, và lần Sync kế tiếp hoặc bị từ chối, hoặc kéo bản cũ về rồi merge với bản mới — hai bản sao của cùng một thay đổi trong lịch sử. Chỉ amend những commit chưa push.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Mở <code>thu-git</code> bằng VS Code (<code>code .</code>). Trong một file, làm ba sửa đổi không liên quan: sửa một lỗi chính tả ở dòng đầu, đổi tên một biến gần cuối, và thêm <code>console.log("debug")</code> ở giữa.</li><li>Trong diff editor chỉ bôi đen dòng lỗi chính tả → <strong>Stage Selected Ranges</strong>. Trước khi commit, kiểm ở terminal: <code>git diff --staged</code> phải chỉ có lỗi chính tả. Commit <code>fix: typo</code>. Làm tương tự với việc đổi tên (<code>refactor: …</code>). Discard riêng dòng debug.</li><li>Tạo xung đột: <code>git switch -c gio-sang</code>, sửa một dòng, commit; <code>git switch main</code>, sửa đúng dòng đó theo cách khác, commit; <code>git merge gio-sang</code>. Giải bằng merge editor và bấm Complete Merge — rồi chạy <code>git status</code> TRƯỚC khi commit, và đọc nó nói gì.</li><li>Mở <strong>Show Git Output</strong>, tìm những dòng VS Code đã chạy cho hai lần stage-và-commit của bạn.</li></ol>
<p><strong>Đạt khi:</strong> <code>git log -p -3</code> cho thấy sửa chính tả và đổi tên là hai commit riêng, không commit nào có <code>console.log</code>; <code>git log --oneline --graph -5</code> cho thấy merge commit có hai cha; và bạn kể tên được một lệnh đã thấy trong Git output.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Source Control view</span><span class="v">Panel quản lý mã nguồn — khung Git của VS Code (<code>Ctrl+Shift+G</code>): ô lời nhắn, Staged Changes, Changes, Graph.</span></div>
  <div class="kv"><span class="k">Stage Selected Ranges</span><span class="v">Stage các vùng đang chọn — chỉ đưa những dòng được bôi đen vào index; phiên bản chuột của <code>git add -p</code>.</span></div>
  <div class="kv"><span class="k">Merge editor</span><span class="v">Trình gộp — khung giải xung đột ba phần của VS Code: Incoming, Current, Result, kết thúc bằng Complete Merge.</span></div>
  <div class="kv"><span class="k">Incoming / Current</span><span class="v">Bản đến / bản hiện tại — nhánh đang được nhập vào ("theirs") / nhánh bạn đang đứng, <code>HEAD</code> ("ours").</span></div>
  <div class="kv"><span class="k">Sync Changes</span><span class="v">Đồng bộ thay đổi — pull rồi push, hai thao tác sau một nút bấm.</span></div>
  <div class="kv"><span class="k">Git output channel</span><span class="v">Kênh nhật ký Git — nơi ghi mọi lệnh Git VS Code đã chạy, kèm nguyên văn lỗi (More Actions → Show Git Output).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mỗi nút trong Source Control chạy một lệnh Git; biết nó là lệnh nào trước khi bấm, nhất là Discard, Amend và Sync.</li><li>Stage Selected Ranges là <code>git add -p</code> bằng chuột, và là cách dễ nhất để mỗi commit chỉ chứa một ý.</li><li>Trong merge editor, Incoming là nhánh đang vào, Current là <code>HEAD</code>; Complete Merge chỉ stage file — bạn vẫn phải commit.</li><li>Công việc chưa commit bị discard thì không có trong reflog; commit hoặc stash trước khi "dọn dẹp".</li><li>Khi một nút báo lỗi, đọc Show Git Output hoặc chạy <code>git status</code> — câu trả lời đầy đủ nằm ở đó, không nằm trong thông báo.</li></ul>

<a class="link-card" href="https://code.visualstudio.com/docs/sourcecontrol/staging-commits" target="_blank" rel="noopener">
  <span class="lc-ico">🟦</span>
  <span class="lc-body"><span class="lc-title">VS Code Docs — Staging and committing</span><span class="lc-sub">Stage Selected Ranges, Unstage, Commit (Amend), Undo Last Commit, Discard.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/sourcecontrol/merge-conflicts" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">VS Code Docs — Resolve merge conflicts</span><span class="lc-sub">Các nút ngay trên xung đột, merge editor ba khung, Complete Merge.</span></span>
</a>
<a class="link-card" href="https://code.visualstudio.com/docs/sourcecontrol/troubleshooting" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">VS Code Docs — Source control troubleshooting</span><span class="lc-sub">Show Git Output, kênh Git, mức log, git.path.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> GUI là một bàn phím nhanh hơn, không phải một Git khác. Dùng nó cho chín mươi lăm phần trăm công việc thường ngày, và giữ terminal cho khoảnh khắc trạng thái không rõ ràng — đó là lúc nút bấm đoán, còn lệnh thì nói thật.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Seeing history: Git Graph, GitLens, GitHub Desktop, lazygit|||14.2 — Nhìn lịch sử bằng đồ hoạ: Git Graph, GitLens, GitHub Desktop, lazygit',
      slug: 'git-14-2-gitlens-desktop',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm cách nhìn lịch sử — đồ thị có sẵn của VS Code, Git Graph, GitLens bản miễn phí, GitHub Desktop, lazygit — mỗi cái hợp việc gì, giới hạn gì (tính đến 09/2026), và nguyên tắc GUI để nhìn, terminal để hiểu và cứu hộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Pick the viewer for the job — and keep the terminal for the rescue</h2>
<p class="lead">History is a graph, and graphs are easier to read as pictures. That is the whole case for a graphical Git tool. The case against is just as short: a picture shows you the state, it rarely explains how you got there, and when something is half-broken it is the last place that tells you. This lesson sorts five popular viewers by what they are good at.</p>

<h3>Five ways to look at the same history</h3>
${slide('git-14', 6, 'Năm cách nhìn lịch sử — cái nào hợp việc gì')}
<table>
<thead><tr><th></th><th>What it is</th><th>Best at</th><th>Limits (as of 09/2026)</th></tr></thead>
<tbody>
<tr><td><strong>Source Control Graph</strong></td><td>Built into VS Code, in the Source Control view</td><td>"Am I behind?" — incoming and outgoing commits at a glance</td><td>Current repository, simple view</td></tr>
<tr><td><strong>Git Graph</strong> (mhutchie)</td><td>VS Code extension, free</td><td>The whole repository as one graph: every branch, tag, remote branch and uncommitted changes; merge, rebase, cherry-pick from a right-click</td><td>Last release 1.30.0, April 2021 — it still installs and works, but nobody is updating it</td></tr>
<tr><td><strong>GitLens</strong> (Community)</td><td>VS Code extension, free and open source</td><td>Who and why for a single line: inline blame, CodeLens, hovers, File History, Line History, an interactive rebase editor</td><td>Commit Graph free on <em>public</em> repos (needs a free GitKraken account); on private repos the Graph, Visual History and Launchpad are Pro</td></tr>
<tr><td><strong>GitHub Desktop</strong></td><td>Separate app from GitHub</td><td>Beginners and teammates who fear the terminal; committing selected lines with the mouse</td><td>macOS 12+ and Windows 10 64-bit+; <strong>Linux is not supported</strong></td></tr>
<tr><td><strong>lazygit</strong></td><td>Terminal UI (TUI), MIT licence</td><td>Speed with the keyboard, staging lines, interactive rebase, cherry-pick — anywhere a terminal runs, including over SSH</td><td>A new set of keys to learn</td></tr>
</tbody>
</table>

<h3>Git Graph — the map of the whole repository</h3>
<p>Install "Git Graph" by mhutchie from the Extensions view, then click <strong>Git Graph</strong> in the status bar or run <strong>Git Graph: View Git Graph</strong> from the Command Palette. Every branch, local and remote, is drawn in its own colour; click a commit to see its files and diff; right-click to merge, rebase, cherry-pick, create a branch or a tag. It is the fastest way to answer "where did <code>feature/gio-sang</code> leave <code>main</code>, and did it ever come back?".</p>
<p>One honest caveat: the Marketplace page shows version 1.30.0 dated April 2021. It still works on current VS Code and has more than fifteen million installs, but nothing is being fixed. For a quick picture it is fine; do not rely on it for anything the built-in graph or the terminal can do.</p>

<h3>GitLens — who changed this line, and why</h3>
<p>GitLens (by GitKraken) answers questions about <em>one line</em> rather than the whole graph. What the free Community edition gives you, according to its Marketplace page (09/2026):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Inline and status-bar blame</span><span class="v">Author and age of the current line, at the end of that line.</span></div>
  <div class="kv"><span class="k">CodeLens</span><span class="v">Recent-change and authorship summary at the top of each file and block.</span></div>
  <div class="kv"><span class="k">Hovers</span><span class="v">Hover a blame annotation for the commit, and the issue or pull request it links to.</span></div>
  <div class="kv"><span class="k">File History / Line History</span><span class="v">Follow a file or a single line across renames and merges.</span></div>
  <div class="kv"><span class="k">Interactive Rebase Editor</span><span class="v">A drag-and-drop view of the <code>git rebase -i</code> to-do list from Chapter 3.</span></div>
</div>
<p>The Commit Graph is free on public repositories with a free GitKraken account; on private repositories the Commit Graph, Visual History and Launchpad need GitLens Pro. For a student whose SWP391 repository is private, that means: use GitLens for blame and line history, and the built-in graph or Git Graph for the picture.</p>
<p>What blame shows is exactly what the terminal shows — here on the real test repository:</p>
<pre><code class="language-bash">git blame -L 1,1 lich.js</code></pre>
<div class="out">0f2bae38 (Cuong Hoang 2026-09-23 11:20:00 +0700 1) export const GIO_MO = "07:00";</div>

<h3>GitHub Desktop — for the teammate who fears the terminal</h3>
<p>GitHub Desktop is a separate application, and it is the kindest tool for a teammate on their first Git project. The <strong>Changes</strong> tab lists changed files with coloured icons; clicking line numbers in the diff selects or deselects individual lines (the lines still highlighted in blue are the ones that will be committed). You type a <strong>Summary</strong> and optional <strong>Description</strong>, add co-authors from the icon in the Description field, press <strong>Commit to &lt;branch&gt;</strong>, then <strong>Push origin</strong>. The <strong>History</strong> tab lists earlier commits.</p>
<p>Two limits matter for a mixed team. It runs on macOS 12 or later and Windows 10 64-bit or later — GitHub's own docs say Linux is not supported yet. And it has no terminal inside: when a rebase stops half-way, the teammate needs someone who can open one.</p>

<h3>lazygit — the whole thing on the keyboard, inside a terminal</h3>
${slide('git-14', 7, 'lazygit: Git bằng bàn phím, ngay trong terminal (vẽ lại)')}
<p>lazygit is a terminal user interface: panels for Status, Files, Branches, Commits and Stash on the left, the diff on the right, and single keys for everything. Because it lives in a terminal, it is the one graphical tool you can use on the VPS over SSH or on the Linux machine without a desktop.</p>
<pre><code class="language-bash">brew install lazygit                               <span class="tok-comment"># macOS</span>
winget install -e --id=JesseDuffield.lazygit       <span class="tok-comment"># Windows (or: scoop install lazygit)</span>
lazygit                                            <span class="tok-comment"># run inside a repository</span></code></pre>
<p>The keys from its README worth learning first: <code>space</code> stages the selected line, <code>v</code> starts selecting a range; <code>i</code> starts an interactive rebase, then <code>s</code> squash, <code>f</code> fixup, <code>d</code> drop, <code>e</code> edit; <code>shift+c</code> copies a commit and <code>shift+v</code> pastes it (cherry-pick); <code>z</code> undoes and <code>shift+z</code> redoes. Press <code>?</code> for the full list.</p>
<div class="callout warn">lazygit's <code>z</code> undo works by walking the reflog, like your own rescue in Chapter 13. It does not bring back uncommitted work you discarded — no tool can, because Git never stored it.</div>

<h3>The rule: GUI to <em>see</em>, terminal to <em>understand</em> and to rescue</h3>
${slide('git-14', 8, 'GUI để NHÌN — terminal để HIỂU và cứu hộ')}
<p>The same history, twice. The picture on the left makes the fork and the merge obvious; the text on the right is what you get on any machine with Git, and you can paste it into a chat when you ask for help:</p>
<pre><code class="language-bash">git lg          <span class="tok-comment"># the alias from lesson 14.3: log --oneline --graph --all --decorate -20</span></code></pre>
<div class="out">*   640154e (HEAD -&gt; main) Merge branch 'feature/gio-sang'
|\\
| * 3f76892 (feature/gio-sang) feat: mở sớm 07:30
* | 0f2bae3 fix: bác sĩ yêu cầu 07:00
|/
* 423371e feat: giờ làm việc</div>
<p>Where each side wins:</p>
<ul>
<li><strong>GUI wins</strong> at reading a graph with many branches, comparing a diff side by side, blaming one line, selecting lines to stage, and showing a beginner what a branch is.</li>
<li><strong>The terminal wins</strong> whenever things are broken: a rebase stopped half-way, detached HEAD, a lost commit that only <code>git reflog</code> remembers, work on a server over SSH, anything you want to script, and every error message in full.</li>
</ul>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">"Am I behind?"</span><span class="lz-v">Source Control Graph — incoming / outgoing</span></div>
  <div class="lz-layer"><span class="lz-k">"Where did this branch split off?"</span><span class="lz-v">Git Graph, lazygit, or <code>git lg</code></span></div>
  <div class="lz-layer"><span class="lz-k">"Who changed this line, and why?"</span><span class="lz-v">GitLens blame / Line History, or <code>git blame -L</code></span></div>
  <div class="lz-layer"><span class="lz-k">"My teammate is new and scared"</span><span class="lz-v">GitHub Desktop (macOS, Windows)</span></div>
  <div class="lz-layer"><span class="lz-k">"I am on the VPS over SSH"</span><span class="lz-v">lazygit, or plain <code>git</code></span></div>
  <div class="lz-layer"><span class="lz-k">"Something is broken"</span><span class="lz-v">The terminal: <code>git status</code>, <code>git reflog</code>, full error text</span></div>
</div>
<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Five tools, five pictures.</b> One teammate uses GitHub Desktop, one Git Graph, one the terminal — and the stand-up turns into an argument about why "my screen shows your commit and yours doesn't". The answer is almost always a missing <code>git fetch</code>; agree to settle every argument with <code>git log --oneline --graph --all</code>, pasted as text. <b>Clicking through a rebase you don't understand.</b> A drag-and-drop rebase editor makes rewriting history feel harmless. It is exactly as dangerous as <code>git rebase -i</code> on a shared branch (Chapter 8) — the picture just hides the force-push that has to follow.</div>

<div class="pitfall"><strong>Trap:</strong> GitLens asks you to sign in or start a trial when you open the Commit Graph on your private SWP391 repository. That is the Pro boundary, not a broken install — and you do not need to cross it: the built-in Source Control Graph or <code>git lg</code> shows the same history for free.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, make sure you have at least one merge commit (the conflict from 14.1 is perfect). Run <code>git log --merges --oneline</code> and write down the hash.</li><li>Install one viewer — Git Graph in VS Code, or <code>brew install lazygit</code> — and open the same repository. Find that merge commit in the picture and name its two parents.</li><li>Check your answer in the terminal: <code>git log --format='%h %p %s' -1 &lt;hash&gt;</code> prints the commit followed by its parents.</li><li>Pick one line of a file. Find its author in the GUI (GitLens inline blame, or Timeline), then with <code>git blame -L &lt;n&gt;,&lt;n&gt; &lt;file&gt;</code>.</li></ol>
<pre><code class="language-bash">git log --merges --oneline
<span class="tok-comment"># 640154e Merge branch 'feature/gio-sang'</span>
git log --format='%h %p %s' -1 640154e
<span class="tok-comment"># 640154e 0f2bae3 3f76892 Merge branch 'feature/gio-sang'   (real output, author's test repo — yours will differ)</span></code></pre>
<p><strong>Done when:</strong> the two parents you read off the picture match the two hashes after the merge commit in the terminal, and the author the GUI shows for your line matches <code>git blame</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GUI</span><span class="v">Graphical user interface — windows, buttons and mouse instead of typed commands.</span></div>
  <div class="kv"><span class="k">TUI</span><span class="v">Terminal user interface — panels and keys drawn inside a terminal, like lazygit; works over SSH.</span></div>
  <div class="kv"><span class="k">Blame</span><span class="v">For each line, the commit and author that last changed it (<code>git blame</code>).</span></div>
  <div class="kv"><span class="k">Commit graph</span><span class="v">History drawn as dots and lines: forks where branches start, joins where they merge.</span></div>
  <div class="kv"><span class="k">Community / Pro</span><span class="v">The free edition of GitLens and its paid tier; some features are free only on public repositories.</span></div>
  <div class="kv"><span class="k">Extension</span><span class="v">An add-on installed into VS Code from the Marketplace (Git Graph, GitLens).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>VS Code's built-in Source Control Graph already answers "am I behind?"; install something else only for a job it cannot do.</li><li>Git Graph draws the whole repository but has not been updated since April 2021; GitLens Community is the tool for blame and line history.</li><li>GitHub Desktop suits beginners on macOS and Windows but does not run on Linux and has no terminal inside.</li><li>lazygit is the graphical tool that also works over SSH, and its undo is the reflog — it cannot restore discarded uncommitted work.</li><li>Use a GUI to see, the terminal to understand and to rescue; settle team arguments with <code>git log --oneline --graph --all</code> as text.</li></ul>

<a class="link-card" href="https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">GitLens — VS Code Marketplace</span><span class="lc-sub">What is in Community and what needs Pro, public vs private repositories.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/desktop" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Desktop</span><span class="lc-sub">Installing, committing selected lines, co-authors, supported systems.</span></span>
</a>
<a class="link-card" href="https://github.com/jesseduffield/lazygit" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">lazygit on GitHub</span><span class="lc-sub">Installation for every OS and the keybindings from the README.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> a viewer is a lens, not the repository. Pick the one that makes today's question easy, and when two lenses disagree, the terminal is the judge.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Chọn đúng công cụ để nhìn — và giữ terminal cho lúc cứu hộ</h2>
<p class="lead">Lịch sử là một đồ thị, mà đồ thị thì đọc bằng hình dễ hơn. Đó là toàn bộ lý do để dùng một công cụ Git đồ hoạ. Lý do để dè chừng cũng ngắn không kém: một bức hình cho bạn thấy trạng thái, hiếm khi giải thích bạn đã tới đó bằng cách nào, và khi mọi thứ hỏng một nửa thì nó là nơi cuối cùng nói cho bạn biết. Bài này xếp năm công cụ phổ biến theo việc mỗi cái làm giỏi.</p>

<h3>Năm cách nhìn cùng một lịch sử</h3>
${slide('git-14', 6, 'Năm cách nhìn lịch sử — cái nào hợp việc gì')}
<table>
<thead><tr><th></th><th>Là gì</th><th>Giỏi nhất ở</th><th>Giới hạn (tính đến 09/2026)</th></tr></thead>
<tbody>
<tr><td><strong>Source Control Graph</strong></td><td>Có sẵn trong VS Code, trong panel Source Control</td><td>"Mình có đang tụt lại không?" — thấy ngay commit đến và đi</td><td>Chỉ kho đang mở, hiển thị đơn giản</td></tr>
<tr><td><strong>Git Graph</strong> (mhutchie)</td><td>Extension (tiện ích mở rộng) VS Code, miễn phí</td><td>Cả kho thành một đồ thị: mọi nhánh, tag, nhánh remote và thay đổi chưa commit; merge, rebase, cherry-pick bằng chuột phải</td><td>Bản cuối 1.30.0, tháng 04/2021 — vẫn cài và chạy được, nhưng không ai cập nhật nữa</td></tr>
<tr><td><strong>GitLens</strong> (Community)</td><td>Extension VS Code, miễn phí, mã nguồn mở</td><td>Ai và vì sao cho TỪNG dòng: blame ngay trên dòng, CodeLens, hover, File History, Line History, trình rebase tương tác</td><td>Commit Graph miễn phí với repo <em>public</em> (cần tài khoản GitKraken miễn phí); với repo private thì Graph, Visual History và Launchpad thuộc bản Pro</td></tr>
<tr><td><strong>GitHub Desktop</strong></td><td>Ứng dụng riêng của GitHub</td><td>Người mới và bạn cùng nhóm sợ terminal; commit từng dòng bằng chuột</td><td>macOS 12+ và Windows 10 64-bit+; <strong>không hỗ trợ Linux</strong></td></tr>
<tr><td><strong>lazygit</strong></td><td>Giao diện trong terminal (TUI), giấy phép MIT</td><td>Nhanh bằng bàn phím, stage từng dòng, rebase tương tác, cherry-pick — chạy ở mọi nơi có terminal, kể cả qua SSH</td><td>Phải học một bộ phím mới</td></tr>
</tbody>
</table>

<h3>Git Graph — bản đồ của cả kho</h3>
<p>Cài "Git Graph" của mhutchie từ mục Extensions, rồi bấm <strong>Git Graph</strong> trên thanh trạng thái hoặc chạy <strong>Git Graph: View Git Graph</strong> từ Command Palette. Mỗi nhánh, cả ở máy lẫn trên remote, được vẽ một màu; bấm vào commit để xem file và diff; chuột phải để merge, rebase, cherry-pick, tạo nhánh hay tag. Đây là cách nhanh nhất để trả lời "<code>feature/gio-sang</code> rẽ khỏi <code>main</code> ở đâu, và đã quay về chưa?".</p>
<p>Một lưu ý thật thà: trang Marketplace ghi phiên bản 1.30.0, ngày tháng 04/2021. Nó vẫn chạy trên VS Code hiện tại và có hơn mười lăm triệu lượt cài, nhưng không còn ai sửa lỗi. Để xem nhanh một bức hình thì ổn; đừng dựa vào nó cho việc mà đồ thị có sẵn hoặc terminal làm được.</p>

<h3>GitLens — ai đổi dòng này, và vì sao</h3>
<p>GitLens (của GitKraken) trả lời câu hỏi về <em>một dòng</em> thay vì cả đồ thị. Bản Community miễn phí có những gì, theo trang Marketplace của nó (09/2026):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Blame trên dòng và trên thanh trạng thái</span><span class="v">Tác giả và tuổi của dòng đang đứng, hiện ngay cuối dòng đó.</span></div>
  <div class="kv"><span class="k">CodeLens</span><span class="v">Dòng tóm tắt thay đổi gần nhất và tác giả, ở đầu mỗi file và mỗi khối mã.</span></div>
  <div class="kv"><span class="k">Hover</span><span class="v">Rê chuột lên chú thích blame để thấy commit, cùng issue hay pull request nó liên kết.</span></div>
  <div class="kv"><span class="k">File History / Line History</span><span class="v">Lịch sử file / lịch sử dòng — lần theo một file hay một dòng qua các lần đổi tên và merge.</span></div>
  <div class="kv"><span class="k">Interactive Rebase Editor</span><span class="v">Trình rebase tương tác — danh sách việc của <code>git rebase -i</code> (Chương 3) dạng kéo-thả.</span></div>
</div>
<p>Commit Graph miễn phí với repo public khi có tài khoản GitKraken miễn phí; với repo private thì Commit Graph, Visual History và Launchpad cần GitLens Pro. Với một sinh viên có repo SWP391 để private, nghĩa là: dùng GitLens cho blame và lịch sử dòng, còn bức hình thì lấy từ đồ thị có sẵn hoặc Git Graph.</p>
<p>Thứ blame cho thấy chính là thứ terminal cho thấy — đây là trên kho thử thật:</p>
<pre><code class="language-bash">git blame -L 1,1 lich.js</code></pre>
<div class="out">0f2bae38 (Cuong Hoang 2026-09-23 11:20:00 +0700 1) export const GIO_MO = "07:00";</div>

<h3>GitHub Desktop — cho bạn cùng nhóm sợ terminal</h3>
<p>GitHub Desktop là một ứng dụng riêng, và là công cụ dễ chịu nhất cho một bạn cùng nhóm lần đầu làm dự án có Git. Tab <strong>Changes</strong> liệt kê file đã đổi với biểu tượng màu; bấm vào số dòng trong diff để chọn hoặc bỏ chọn từng dòng (những dòng còn tô xanh dương là những dòng sẽ được commit). Bạn gõ <strong>Summary</strong> (tóm tắt) và <strong>Description</strong> (mô tả, tuỳ chọn), thêm đồng tác giả (co-author) bằng biểu tượng ở góc ô Description, bấm <strong>Commit to &lt;nhánh&gt;</strong>, rồi <strong>Push origin</strong>. Tab <strong>History</strong> liệt kê các commit trước đó.</p>
<p>Hai giới hạn quan trọng với một nhóm dùng lẫn máy. Nó chạy trên macOS 12 trở lên và Windows 10 64-bit trở lên — chính tài liệu của GitHub ghi Linux chưa được hỗ trợ. Và nó không có terminal bên trong: khi một lần rebase dừng giữa chừng, bạn ấy cần một người biết mở terminal.</p>

<h3>lazygit — mọi thứ bằng bàn phím, ngay trong terminal</h3>
${slide('git-14', 7, 'lazygit: Git bằng bàn phím, ngay trong terminal (vẽ lại)')}
<p>lazygit là một TUI (terminal user interface — giao diện vẽ trong terminal): các khung Status, Files, Branches, Commits và Stash bên trái, diff bên phải, và mỗi việc là một phím. Vì sống trong terminal, nó là công cụ đồ hoạ duy nhất bạn dùng được trên VPS qua SSH hay trên máy Linux không có màn hình desktop.</p>
<pre><code class="language-bash">brew install lazygit                               <span class="tok-comment"># macOS</span>
winget install -e --id=JesseDuffield.lazygit       <span class="tok-comment"># Windows (hoặc: scoop install lazygit)</span>
lazygit                                            <span class="tok-comment"># chạy bên trong một kho</span></code></pre>
<p>Những phím trong README đáng học trước: <code>space</code> stage dòng đang chọn, <code>v</code> bắt đầu chọn một khoảng; <code>i</code> bắt đầu rebase tương tác, rồi <code>s</code> squash, <code>f</code> fixup, <code>d</code> drop, <code>e</code> edit; <code>shift+c</code> chép một commit và <code>shift+v</code> dán nó (cherry-pick); <code>z</code> hoàn tác và <code>shift+z</code> làm lại. Bấm <code>?</code> để xem đủ danh sách.</p>
<div class="callout warn">Phím hoàn tác <code>z</code> của lazygit hoạt động bằng cách lần theo reflog, giống cách bạn tự cứu hộ ở Chương 13. Nó không mang lại được công việc chưa commit mà bạn đã vứt — không công cụ nào làm được, vì Git chưa bao giờ lưu nó.</div>

<h3>Nguyên tắc: GUI để <em>NHÌN</em>, terminal để <em>HIỂU</em> và cứu hộ</h3>
${slide('git-14', 8, 'GUI để NHÌN — terminal để HIỂU và cứu hộ')}
<p>Cùng một lịch sử, hai lần. Bức hình bên trái làm chỗ rẽ nhánh và chỗ gộp hiện ra rõ ràng; phần chữ bên phải là thứ bạn có trên bất kỳ máy nào có Git, và dán được vào nhóm chat khi nhờ người giúp:</p>
<pre><code class="language-bash">git lg          <span class="tok-comment"># alias ở bài 14.3: log --oneline --graph --all --decorate -20</span></code></pre>
<div class="out">*   640154e (HEAD -&gt; main) Merge branch 'feature/gio-sang'
|\\
| * 3f76892 (feature/gio-sang) feat: mở sớm 07:30
* | 0f2bae3 fix: bác sĩ yêu cầu 07:00
|/
* 423371e feat: giờ làm việc</div>
<p>Mỗi bên thắng ở đâu:</p>
<ul>
<li><strong>GUI thắng</strong> khi đọc một đồ thị nhiều nhánh, so diff hai bên cạnh nhau, blame một dòng, chọn dòng để stage, và khi cho người mới thấy nhánh là gì.</li>
<li><strong>Terminal thắng</strong> mỗi khi có thứ hỏng: rebase dừng giữa chừng, detached HEAD, một commit thất lạc mà chỉ <code>git reflog</code> còn nhớ, làm việc trên máy chủ qua SSH, mọi thứ bạn muốn viết thành script, và mọi thông báo lỗi ở dạng đầy đủ.</li>
</ul>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">"Mình có tụt lại không?"</span><span class="lz-v">Source Control Graph — commit đến / đi</span></div>
  <div class="lz-layer"><span class="lz-k">"Nhánh này rẽ ra từ đâu?"</span><span class="lz-v">Git Graph, lazygit, hoặc <code>git lg</code></span></div>
  <div class="lz-layer"><span class="lz-k">"Ai đổi dòng này, vì sao?"</span><span class="lz-v">Blame / Line History của GitLens, hoặc <code>git blame -L</code></span></div>
  <div class="lz-layer"><span class="lz-k">"Bạn cùng nhóm mới và đang sợ"</span><span class="lz-v">GitHub Desktop (macOS, Windows)</span></div>
  <div class="lz-layer"><span class="lz-k">"Mình đang ở VPS qua SSH"</span><span class="lz-v">lazygit, hoặc <code>git</code> trần</span></div>
  <div class="lz-layer"><span class="lz-k">"Có thứ gì đó hỏng"</span><span class="lz-v">Terminal: <code>git status</code>, <code>git reflog</code>, nguyên văn lỗi</span></div>
</div>
<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Năm công cụ, năm bức hình.</b> Một bạn dùng GitHub Desktop, một bạn dùng Git Graph, một bạn dùng terminal — và buổi họp nhanh biến thành cuộc cãi "màn hình mình thấy commit của cậu mà màn hình cậu thì không". Câu trả lời gần như luôn là thiếu một lần <code>git fetch</code>; hãy thống nhất phân xử mọi tranh cãi bằng <code>git log --oneline --graph --all</code>, dán ra dạng chữ. <b>Bấm qua một lần rebase mà không hiểu.</b> Trình rebase kéo-thả làm việc viết lại lịch sử trông vô hại. Nó nguy hiểm y như <code>git rebase -i</code> trên nhánh chung (Chương 8) — bức hình chỉ giấu đi lần force-push bắt buộc phải theo sau.</div>

<div class="pitfall"><strong>Bẫy:</strong> GitLens đòi đăng nhập hoặc dùng thử khi bạn mở Commit Graph trên repo SWP391 để private. Đó là ranh giới của bản Pro, không phải cài hỏng — và bạn không cần vượt qua nó: Source Control Graph có sẵn hoặc <code>git lg</code> cho thấy đúng lịch sử đó, miễn phí.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, bảo đảm có ít nhất một merge commit (vụ xung đột ở bài 14.1 là vừa khéo). Chạy <code>git log --merges --oneline</code> và ghi lại mã băm.</li><li>Cài một công cụ nhìn — Git Graph trong VS Code, hoặc <code>brew install lazygit</code> — rồi mở cùng kho đó. Tìm merge commit ấy trên hình và gọi tên hai commit cha của nó.</li><li>Kiểm đáp án ở terminal: <code>git log --format='%h %p %s' -1 &lt;mã&gt;</code> in ra commit rồi tới các cha của nó.</li><li>Chọn một dòng trong một file. Tìm tác giả của nó trong GUI (blame của GitLens, hoặc Timeline), rồi tìm lại bằng <code>git blame -L &lt;n&gt;,&lt;n&gt; &lt;file&gt;</code>.</li></ol>
<pre><code class="language-bash">git log --merges --oneline
<span class="tok-comment"># 640154e Merge branch 'feature/gio-sang'</span>
git log --format='%h %p %s' -1 640154e
<span class="tok-comment"># 640154e 0f2bae3 3f76892 Merge branch 'feature/gio-sang'   (output thật, kho thử của tác giả — của bạn sẽ khác)</span></code></pre>
<p><strong>Đạt khi:</strong> hai commit cha bạn đọc từ hình khớp với hai mã băm đứng sau merge commit ở terminal, và tác giả GUI hiện cho dòng của bạn khớp với <code>git blame</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GUI</span><span class="v">Giao diện đồ hoạ (graphical user interface) — cửa sổ, nút bấm và chuột thay cho gõ lệnh.</span></div>
  <div class="kv"><span class="k">TUI</span><span class="v">Giao diện trong terminal (terminal user interface) — khung và phím vẽ ngay trong terminal, như lazygit; chạy được qua SSH.</span></div>
  <div class="kv"><span class="k">Blame</span><span class="v">Truy tác giả — với mỗi dòng, commit và người đã đổi nó lần cuối (<code>git blame</code>).</span></div>
  <div class="kv"><span class="k">Commit graph</span><span class="v">Đồ thị commit — lịch sử vẽ bằng chấm và đường: rẽ ra chỗ nhánh bắt đầu, nhập lại chỗ nhánh được merge.</span></div>
  <div class="kv"><span class="k">Community / Pro</span><span class="v">Bản cộng đồng miễn phí / bản trả phí của GitLens; có tính năng chỉ miễn phí với repo public.</span></div>
  <div class="kv"><span class="k">Extension</span><span class="v">Tiện ích mở rộng — phần gắn thêm cài vào VS Code từ Marketplace (Git Graph, GitLens).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Source Control Graph có sẵn trong VS Code đã trả lời được câu "mình có tụt lại không?"; chỉ cài thêm thứ khác cho việc nó không làm được.</li><li>Git Graph vẽ cả kho nhưng không được cập nhật từ 04/2021; GitLens Community là công cụ cho blame và lịch sử từng dòng.</li><li>GitHub Desktop hợp người mới trên macOS và Windows, nhưng không chạy trên Linux và không có terminal bên trong.</li><li>lazygit là công cụ đồ hoạ chạy được cả qua SSH, và phím hoàn tác của nó là reflog — không khôi phục được công việc chưa commit đã vứt.</li><li>Dùng GUI để nhìn, terminal để hiểu và cứu hộ; phân xử tranh cãi trong nhóm bằng <code>git log --oneline --graph --all</code> dạng chữ.</li></ul>

<a class="link-card" href="https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens" target="_blank" rel="noopener">
  <span class="lc-ico">🔎</span>
  <span class="lc-body"><span class="lc-title">GitLens — VS Code Marketplace</span><span class="lc-sub">Bản Community có gì, cái gì cần Pro, repo public khác private ra sao.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/desktop" target="_blank" rel="noopener">
  <span class="lc-ico">🖥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Desktop</span><span class="lc-sub">Cài đặt, commit từng dòng, đồng tác giả, hệ điều hành được hỗ trợ.</span></span>
</a>
<a class="link-card" href="https://github.com/jesseduffield/lazygit" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">lazygit trên GitHub</span><span class="lc-sub">Cách cài cho mọi hệ điều hành và bảng phím trong README.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> công cụ nhìn là một thấu kính, không phải là kho. Chọn cái làm câu hỏi hôm nay dễ trả lời, và khi hai thấu kính nói khác nhau thì terminal là trọng tài.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — A better .gitconfig: aliases, two identities with includeIf, --show-origin|||14.3 — .gitconfig nâng cao: alias, hai danh tính với includeIf, --show-origin',
      slug: 'git-14-3-cau-hinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Các tầng cấu hình và luật "đọc sau thắng", git config --list --show-origin, alias hữu ích, sáu thiết lập đáng bật, và includeIf để kho trường tự dùng email FPT còn kho cá nhân dùng email riêng — kèm hai cái bẫy im lặng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Configure Git once, for every repository you will ever open</h2>
<p class="lead">In the introduction you set a name and an email. That was the minimum. A few more lines in <code>~/.gitconfig</code> give you shorter commands, safer defaults, and — the one that saves real embarrassment — the right email in every repository automatically: your FPT address in school projects, your personal one everywhere else.</p>

<h3>Where configuration lives, and who wins</h3>
${slide('git-14', 9, 'Cấu hình có nhiều tầng — giá trị đọc SAU thắng')}
<p>Git reads configuration from several files, in a fixed order, and when the same key appears twice <strong>the value read last wins</strong>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">system</span><span class="v"><code>/etc/gitconfig</code> (or inside the Git for Windows install) — every user of the machine. <code>git config --system</code>.</span></div>
  <div class="kv"><span class="k">global</span><span class="v"><code>~/.gitconfig</code> — you, in every repository. <code>git config --global</code>.</span></div>
  <div class="kv"><span class="k">local</span><span class="v"><code>.git/config</code> of one repository — the default when you run <code>git config</code> inside a repository.</span></div>
  <div class="kv"><span class="k">command line</span><span class="v"><code>git -c key=value …</code> — one command only.</span></div>
</div>
<p>An <code>include</code> or <code>includeIf</code> is read <em>at the exact place</em> where it appears in its file, as if the included file were pasted in. Remember that sentence; both traps at the end of this lesson come from it.</p>
<p>When a setting surprises you, do not guess which file it came from — ask. This is the real output inside the school repository of the test setup (the temporary home directory is printed as <code>~</code>; lines cut):</p>
<pre><code class="language-bash">git config --list --show-origin</code></pre>
<div class="out">file:~/.gitconfig	user.name=Cuong Hoang
file:~/.gitconfig	user.email=cuong@example.com
file:~/.gitconfig	init.defaultbranch=main
file:~/.gitconfig	pull.rebase=true
file:~/.gitconfig	alias.lg=log --oneline --graph --all --decorate -20
file:~/.gitconfig	includeif.gitdir:~/fpt/.path=~/.gitconfig-fpt
file:~/.gitconfig-fpt	user.email=cuonghse180000@fpt.edu.vn
file:.git/config	core.ignorecase=true</div>
<p><code>user.email</code> appears twice. The line from <code>~/.gitconfig-fpt</code> comes later, so it wins — which you can confirm by asking for just that key:</p>
<pre><code class="language-bash">git config --show-origin user.email
git config --show-scope --show-origin --get-all user.email</code></pre>
<div class="out">file:~/.gitconfig-fpt	cuonghse180000@fpt.edu.vn
global	file:~/.gitconfig	cuong@example.com
global	file:~/.gitconfig-fpt	cuonghse180000@fpt.edu.vn</div>
<p>Notice also what <code>git init</code> put in <code>.git/config</code> on a Mac: <code>core.ignorecase=true</code>. That line becomes important in lesson 14.4.</p>

<h3>Aliases: your own short commands</h3>
${slide('git-14', 10, 'Alias và sáu thiết lập đáng bật')}
<pre><code class="language-bash">git config --global alias.st <span class="tok-string">"status -sb"</span>
git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git config --global alias.undo <span class="tok-string">"reset --soft HEAD~1"</span>
git config --global alias.last <span class="tok-string">"log -1 HEAD --stat"</span></code></pre>
<p><code>git st</code> is the status you actually read ten times a day — branch on the first line, one line per file:</p>
<pre><code class="language-bash">git st</code></pre>
<div class="out">## main
 M lich.js
?? nhap.txt</div>
<p><code>git undo</code> takes back the last commit and leaves its changes staged — the "I committed too early" button, with no data lost. <code>git lg</code> is the picture from lesson 14.2 in text. Keep aliases few and boring: an alias you type every day is worth it; twenty clever ones you forget are not, and a teammate reading your screen should still be able to guess what each one does.</p>

<h3>Six settings worth turning on</h3>
<table>
<thead><tr><th>Setting</th><th>What it changes</th></tr></thead>
<tbody>
<tr><td><code>init.defaultBranch = main</code></td><td>New repositories start on <code>main</code>, the same name GitHub uses.</td></tr>
<tr><td><code>pull.rebase = true</code></td><td><code>git pull</code> = fetch + rebase your local commits on top, instead of a merge commit every time someone else pushed first. (If you prefer to be stopped instead, <code>pull.ff = only</code> refuses any pull that is not a fast-forward.)</td></tr>
<tr><td><code>push.autoSetupRemote = true</code></td><td>The first <code>git push</code> of a new branch creates and tracks <code>origin/&lt;branch&gt;</code> — no more <code>-u origin …</code>.</td></tr>
<tr><td><code>rerere.enabled = true</code></td><td>"Reuse recorded resolution": Git remembers how you resolved a conflict and applies it again when the same conflict returns (Chapter 3).</td></tr>
<tr><td><code>diff.algorithm = histogram</code></td><td>A diff algorithm that usually lines up changed blocks more sensibly, especially around repeated lines like <code>}</code>.</td></tr>
<tr><td><code>help.autocorrect = prompt</code></td><td>Typos such as <code>git sttus</code> offer to run the command Git thinks you meant.</td></tr>
</tbody>
</table>
<p>Three of them, running for real. Without <code>push.autoSetupRemote</code>:</p>
<div class="out">fatal: The current branch feature/c has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin feature/c

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.</div>
<p>With it, a plain <code>git push</code> on a new branch:</p>
<div class="out">To ../remote.git
 * [new branch]      feature/dat-lich -&gt; feature/dat-lich
branch 'feature/dat-lich' set up to track 'origin/feature/dat-lich'.</div>
<p>With <code>rerere.enabled</code>, the conflict from lesson 14.1 the second time it happens:</p>
<div class="out">Auto-merging lich.js
CONFLICT (content): Merge conflict in lich.js
Resolved 'lich.js' using previous resolution.
Automatic merge failed; fix conflicts and then commit the result.</div>
<p>The file already contains your earlier answer; you check it, <code>git add</code>, and continue. And <code>help.autocorrect = prompt</code>:</p>
<div class="out">WARNING: You called a Git command named 'sttus', which does not exist.
Run 'status' instead [y/N]? y</div>

<h3>Two identities with <code>includeIf</code></h3>
${slide('git-14', 11, 'includeIf: hai danh tính, không bao giờ nhầm email')}
<p>The problem: your SWP391 lecturer checks that every commit in the team repository comes from an <code>@fpt.edu.vn</code> address, and your personal blog should not show your student number. Setting <code>user.email</code> by hand in each repository works until the one time you forget. Instead, keep all school repositories under one folder, <code>~/fpt/</code>, and let Git choose:</p>
<pre><code class="language-bash"><span class="tok-comment"># ~/.gitconfig — the [includeIf] block goes AFTER [user]</span>
[user]
	name = Cuong Hoang
	email = cuong@example.com
[includeIf <span class="tok-string">"gitdir:~/fpt/"</span>]
	path = ~/.gitconfig-fpt

<span class="tok-comment"># ~/.gitconfig-fpt</span>
[user]
	email = cuonghse180000@fpt.edu.vn</code></pre>
<p>A commit made inside <code>~/fpt/swp391</code> in the test setup, with no local configuration at all:</p>
<pre><code class="language-bash">git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">f0ca57c Cuong Hoang &lt;cuonghse180000@fpt.edu.vn&gt;</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t"><code>~/.gitconfig</code> [user]</div><div class="lz-d"><code>user.email = cuong@example.com</code> is read first.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">includeIf <code>gitdir:~/fpt/</code></div><div class="lz-d">This repository is inside <code>~/fpt/</code> → <code>~/.gitconfig-fpt</code> is read right here.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t"><code>.git/config</code></div><div class="lz-d">No <code>user.email</code> in the local file — nothing to override.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Result</div><div class="lz-d">The last value read wins: <code>cuonghse180000@fpt.edu.vn</code>.</div></div>
</div>
<p>And inside <code>~/ca-nhan/blog</code>, <code>git config --show-origin user.email</code> prints <code>file:~/.gitconfig	cuong@example.com</code>. Two identities, zero discipline required.</p>
<ul>
<li><strong>Windows:</strong> write the path with forward slashes (<code>gitdir/i:C:/Users/an/fpt/</code>); <code>gitdir/i</code> matches case-insensitively, which suits Windows paths.</li>
<li><strong>Match by remote instead of folder:</strong> <code>[includeIf "hasconfig:remote.*.url:https://github.com/swp391-nhom4/**"]</code> applies the file to any repository whose remote points at the team's organisation. Tested: the email changed the moment <code>origin</code> was added.</li>
<li><strong>GitHub side:</strong> commits are linked to your profile only if that email is added (and verified) in GitHub Settings → Emails. Add both addresses to the same account.</li>
</ul>

<h3>The two silent traps</h3>
${slide('git-14', 12, 'Hai cái bẫy includeIf — đều IM LẶNG')}
<p><strong>Trap 1 — no trailing slash.</strong> <code>gitdir:~/fpt</code> (without <code>/</code>) does not mean "everything under <code>~/fpt</code>"; it matches only a <code>.git</code> directory with exactly that path. Nothing matches, nothing is included, and Git says nothing — in the test, <code>git config --show-origin user.email</code> printed no line at all and exited with 1 (the key was not set anywhere). With the trailing <code>/</code>, Git adds <code>**</code> for you and every repository inside the folder matches.</p>
<p><strong>Trap 2 — <code>includeIf</code> before <code>[user]</code>.</strong> The included file is read where the <code>includeIf</code> line stands. Put it at the top and the plain <code>[user] email</code> below is read later and wins:</p>
<div class="out">file:~/.gitconfig	cuong@example.com</div>
<p>— your personal email, inside the school repository, with no warning. Always put <code>includeIf</code> blocks at the <em>end</em> of <code>~/.gitconfig</code>, and verify once in each root folder with <code>git config --show-origin user.email</code>.</p>
<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Three weeks of commits under the wrong name.</b> A teammate's laptop had <code>user.email</code> from an old internship; GitHub shows the commits with a grey avatar and nobody's name, and the lecturer's contribution report credits them with zero. Rewriting that history now means a force-push on a shared branch (Chapter 8). A two-line <code>includeIf</code> on day one prevents it. <b>"I set it, it's fine."</b> The <code>includeIf</code> had no trailing slash. Nobody checked with <code>--show-origin</code> until the report came out.</div>

<div class="pitfall"><strong>Trap:</strong> fixing the email with <code>git config user.email …</code> — without <code>--global</code> — inside one repository. It works, for that repository only, stored silently in <code>.git/config</code>. Clone the project again next semester, or open the next school repository, and the wrong email is back.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Add the four aliases above with <code>git config --global</code>, then open <code>~/.gitconfig</code> (<code>git config --global --edit</code>) and look at the file Git wrote. Try <code>git st</code> and <code>git lg</code> in <code>thu-git</code>.</li><li>Create <code>~/fpt/</code>, move or clone one school repository into it (or <code>git init ~/fpt/thu-truong</code>), and write <code>~/.gitconfig-fpt</code> with your school email.</li><li>Add the <code>[includeIf "gitdir:~/fpt/"]</code> block at the <em>end</em> of <code>~/.gitconfig</code>. Run <code>git config --show-origin user.email</code> inside <code>~/fpt/thu-truong</code> and inside <code>thu-git</code>.</li><li>Break it on purpose: remove the trailing slash, run the same command, see nothing change; put it back. Then make one commit in each repository and compare <code>git log -1 --format="%ae"</code>.</li></ol>
<p><strong>Done when:</strong> the two repositories print two different emails, each with the file it came from, and <code>git config --list --show-origin | grep includeif</code> shows your <code>includeIf</code> line coming from <code>~/.gitconfig</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scope (system / global / local)</span><span class="v">Which file a setting lives in: the whole machine, your user, or one repository.</span></div>
  <div class="kv"><span class="k"><code>--show-origin</code></span><span class="v">Print the file each value came from — the answer to "who set this?".</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">A short name for a longer Git command, stored as <code>alias.&lt;name&gt;</code>.</span></div>
  <div class="kv"><span class="k"><code>includeIf</code></span><span class="v">Include another config file only when a condition holds — the repository's folder (<code>gitdir:</code>) or its remote URL (<code>hasconfig:</code>).</span></div>
  <div class="kv"><span class="k">Upstream / tracking branch</span><span class="v">The remote branch your local branch pushes to and pulls from; <code>push.autoSetupRemote</code> creates it on the first push.</span></div>
  <div class="kv"><span class="k">rerere</span><span class="v">"Reuse recorded resolution" — Git remembers how you resolved a conflict and repeats it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Configuration is read system → global → local → command line, and the value read last wins.</li><li><code>git config --list --show-origin</code> answers "where does this setting come from?" — ask it instead of guessing.</li><li>A handful of aliases and six settings (<code>defaultBranch</code>, <code>pull.rebase</code>, <code>push.autoSetupRemote</code>, <code>rerere</code>, <code>histogram</code>, <code>autocorrect</code>) remove most daily friction.</li><li><code>[includeIf "gitdir:~/fpt/"]</code> gives school repositories the school email automatically.</li><li>Both <code>includeIf</code> traps are silent: keep the trailing slash, put the block after <code>[user]</code>, and verify with <code>--show-origin</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-config#_conditional_includes" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">git-config — Conditional includes</span><span class="lc-sub">gitdir, gitdir/i, onbranch and hasconfig:remote.*.url, with examples.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Pro Git — Git Configuration</span><span class="lc-sub">The configuration files, core settings, colours and external tools.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> your <code>.gitconfig</code> is a set of decisions made once, calmly, so you do not have to make them at 1 a.m. before a deadline. Write each decision down, and check it with <code>--show-origin</code> — a setting you cannot trace is a setting you do not control.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Cấu hình Git một lần, cho mọi kho bạn sẽ mở</h2>
<p class="lead">Ở phần mở đầu bạn đã đặt tên và email. Đó là mức tối thiểu. Thêm vài dòng vào <code>~/.gitconfig</code> là bạn có lệnh ngắn hơn, mặc định an toàn hơn, và — cái cứu bạn khỏi những pha ngượng thật sự — đúng email trong mọi kho một cách tự động: địa chỉ FPT trong dự án của trường, địa chỉ cá nhân ở mọi chỗ còn lại.</p>

<h3>Cấu hình nằm ở đâu, và ai thắng</h3>
${slide('git-14', 9, 'Cấu hình có nhiều tầng — giá trị đọc SAU thắng')}
<p>Git đọc cấu hình từ nhiều file, theo một thứ tự cố định, và khi cùng một khoá (key) xuất hiện hai lần thì <strong>giá trị được đọc sau cùng sẽ thắng</strong>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">system</span><span class="v">Cấp hệ thống — <code>/etc/gitconfig</code> (hoặc bên trong thư mục cài Git for Windows), áp cho mọi người dùng của máy. <code>git config --system</code>.</span></div>
  <div class="kv"><span class="k">global</span><span class="v">Cấp người dùng — <code>~/.gitconfig</code>, áp cho bạn ở mọi kho. <code>git config --global</code>.</span></div>
  <div class="kv"><span class="k">local</span><span class="v">Cấp kho — <code>.git/config</code> của một kho; là mặc định khi bạn chạy <code>git config</code> bên trong một kho.</span></div>
  <div class="kv"><span class="k">dòng lệnh</span><span class="v"><code>git -c khoá=giá-trị …</code> — chỉ cho đúng một lệnh.</span></div>
</div>
<p>Một dòng <code>include</code> hay <code>includeIf</code> (chèn file có điều kiện) được đọc <em>đúng tại chỗ</em> nó nằm trong file, như thể nội dung file được chèn vào dán ngay ở đó. Nhớ câu này; cả hai cái bẫy ở cuối bài đều sinh ra từ nó.</p>
<p>Khi một thiết lập làm bạn bất ngờ, đừng đoán nó từ file nào ra — hãy hỏi. Đây là output thật bên trong kho trường của bộ thử (thư mục HOME tạm in tắt thành <code>~</code>; đã cắt bớt dòng):</p>
<pre><code class="language-bash">git config --list --show-origin</code></pre>
<div class="out">file:~/.gitconfig	user.name=Cuong Hoang
file:~/.gitconfig	user.email=cuong@example.com
file:~/.gitconfig	init.defaultbranch=main
file:~/.gitconfig	pull.rebase=true
file:~/.gitconfig	alias.lg=log --oneline --graph --all --decorate -20
file:~/.gitconfig	includeif.gitdir:~/fpt/.path=~/.gitconfig-fpt
file:~/.gitconfig-fpt	user.email=cuonghse180000@fpt.edu.vn
file:.git/config	core.ignorecase=true</div>
<p><code>user.email</code> xuất hiện hai lần. Dòng từ <code>~/.gitconfig-fpt</code> đến sau, nên nó thắng — kiểm lại bằng cách chỉ hỏi đúng khoá đó:</p>
<pre><code class="language-bash">git config --show-origin user.email
git config --show-scope --show-origin --get-all user.email</code></pre>
<div class="out">file:~/.gitconfig-fpt	cuonghse180000@fpt.edu.vn
global	file:~/.gitconfig	cuong@example.com
global	file:~/.gitconfig-fpt	cuonghse180000@fpt.edu.vn</div>
<p>Để ý cả thứ <code>git init</code> đã ghi vào <code>.git/config</code> trên Mac: <code>core.ignorecase=true</code> (bỏ qua khác biệt hoa/thường). Dòng đó sẽ trở nên quan trọng ở bài 14.4.</p>

<h3>Alias: lệnh tắt của riêng bạn</h3>
${slide('git-14', 10, 'Alias và sáu thiết lập đáng bật')}
<pre><code class="language-bash">git config --global alias.st <span class="tok-string">"status -sb"</span>
git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git config --global alias.undo <span class="tok-string">"reset --soft HEAD~1"</span>
git config --global alias.last <span class="tok-string">"log -1 HEAD --stat"</span></code></pre>
<p><code>git st</code> là bản status bạn thật sự đọc mười lần mỗi ngày — nhánh ở dòng đầu, mỗi file một dòng:</p>
<pre><code class="language-bash">git st</code></pre>
<div class="out">## main
 M lich.js
?? nhap.txt</div>
<p><code>git undo</code> rút lại commit cuối và để nguyên thay đổi của nó ở trạng thái đã stage — nút "mình commit sớm quá", không mất dữ liệu gì. <code>git lg</code> là bức hình của bài 14.2 ở dạng chữ. Giữ alias ít và nhàm chán: alias bạn gõ hằng ngày thì đáng; hai mươi alias thông minh mà bạn quên thì không, và bạn cùng nhóm nhìn màn hình của bạn vẫn phải đoán được mỗi cái làm gì.</p>

<h3>Sáu thiết lập đáng bật</h3>
<table>
<thead><tr><th>Thiết lập</th><th>Nó đổi gì</th></tr></thead>
<tbody>
<tr><td><code>init.defaultBranch = main</code></td><td>Kho mới bắt đầu trên nhánh <code>main</code>, trùng tên GitHub dùng.</td></tr>
<tr><td><code>pull.rebase = true</code></td><td><code>git pull</code> = fetch + rebase commit ở máy lên trên, thay vì đẻ một merge commit mỗi lần có người push trước bạn. (Nếu thích bị chặn lại hơn thì <code>pull.ff = only</code> từ chối mọi lần pull không tua thẳng — fast-forward — được.)</td></tr>
<tr><td><code>push.autoSetupRemote = true</code></td><td>Lần <code>git push</code> đầu tiên của nhánh mới tự tạo và theo dõi <code>origin/&lt;nhánh&gt;</code> — hết phải gõ <code>-u origin …</code>.</td></tr>
<tr><td><code>rerere.enabled = true</code></td><td>"Reuse recorded resolution" (dùng lại cách giải đã ghi): Git nhớ bạn đã giải một xung đột thế nào và tự áp lại khi đúng xung đột đó quay về (Chương 3).</td></tr>
<tr><td><code>diff.algorithm = histogram</code></td><td>Một thuật toán diff thường xếp các khối thay đổi hợp lý hơn, nhất là quanh những dòng lặp lại như <code>}</code>.</td></tr>
<tr><td><code>help.autocorrect = prompt</code></td><td>Gõ nhầm như <code>git sttus</code> thì Git hỏi có chạy lệnh nó đoán bạn muốn không.</td></tr>
</tbody>
</table>
<p>Ba trong số đó, chạy thật. Khi KHÔNG có <code>push.autoSetupRemote</code>:</p>
<div class="out">fatal: The current branch feature/c has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin feature/c

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.</div>
<p>Khi có nó, một lệnh <code>git push</code> trần trên nhánh mới:</p>
<div class="out">To ../remote.git
 * [new branch]      feature/dat-lich -&gt; feature/dat-lich
branch 'feature/dat-lich' set up to track 'origin/feature/dat-lich'.</div>
<p>Khi bật <code>rerere.enabled</code>, vụ xung đột ở bài 14.1 xảy ra lần thứ hai:</p>
<div class="out">Auto-merging lich.js
CONFLICT (content): Merge conflict in lich.js
Resolved 'lich.js' using previous resolution.
Automatic merge failed; fix conflicts and then commit the result.</div>
<p>File đã chứa sẵn câu trả lời lần trước của bạn; bạn kiểm lại, <code>git add</code>, rồi đi tiếp. Còn <code>help.autocorrect = prompt</code>:</p>
<div class="out">WARNING: You called a Git command named 'sttus', which does not exist.
Run 'status' instead [y/N]? y</div>

<h3>Hai danh tính với <code>includeIf</code></h3>
${slide('git-14', 11, 'includeIf: hai danh tính, không bao giờ nhầm email')}
<p>Vấn đề: giảng viên SWP391 kiểm rằng mọi commit trong kho nhóm đến từ địa chỉ <code>@fpt.edu.vn</code>, còn blog cá nhân thì không nên lộ mã số sinh viên của bạn. Đặt <code>user.email</code> bằng tay trong từng kho thì ổn cho tới cái lần duy nhất bạn quên. Thay vào đó, để mọi kho của trường trong một thư mục, <code>~/fpt/</code>, và để Git tự chọn:</p>
<pre><code class="language-bash"><span class="tok-comment"># ~/.gitconfig — khối [includeIf] đặt SAU [user]</span>
[user]
	name = Cuong Hoang
	email = cuong@example.com
[includeIf <span class="tok-string">"gitdir:~/fpt/"</span>]
	path = ~/.gitconfig-fpt

<span class="tok-comment"># ~/.gitconfig-fpt</span>
[user]
	email = cuonghse180000@fpt.edu.vn</code></pre>
<p>Một commit tạo trong <code>~/fpt/swp391</code> của bộ thử, không có chút cấu hình cục bộ nào:</p>
<pre><code class="language-bash">git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">f0ca57c Cuong Hoang &lt;cuonghse180000@fpt.edu.vn&gt;</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t"><code>~/.gitconfig</code> [user]</div><div class="lz-d"><code>user.email = cuong@example.com</code> được đọc trước.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">includeIf <code>gitdir:~/fpt/</code></div><div class="lz-d">Kho này nằm trong <code>~/fpt/</code> → <code>~/.gitconfig-fpt</code> được đọc ngay tại đây.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t"><code>.git/config</code></div><div class="lz-d">File cục bộ không có <code>user.email</code> — không có gì đè lên.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Kết quả</div><div class="lz-d">Giá trị đọc sau cùng thắng: <code>cuonghse180000@fpt.edu.vn</code>.</div></div>
</div>
<p>Còn bên trong <code>~/ca-nhan/blog</code>, <code>git config --show-origin user.email</code> in ra <code>file:~/.gitconfig	cuong@example.com</code>. Hai danh tính, không cần chút kỷ luật nào.</p>
<ul>
<li><strong>Windows:</strong> viết đường dẫn bằng gạch chéo xuôi (<code>gitdir/i:C:/Users/an/fpt/</code>); <code>gitdir/i</code> so khớp không phân biệt hoa/thường, hợp với đường dẫn Windows.</li>
<li><strong>Khớp theo remote thay vì theo thư mục:</strong> <code>[includeIf "hasconfig:remote.*.url:https://github.com/swp391-nhom4/**"]</code> áp file cho mọi kho có remote trỏ vào tổ chức (organization) của nhóm. Đã thử: email đổi ngay khi thêm <code>origin</code>.</li>
<li><strong>Phía GitHub:</strong> commit chỉ gắn với hồ sơ của bạn nếu email đó đã được thêm (và xác minh) trong GitHub Settings → Emails. Thêm cả hai địa chỉ vào cùng một tài khoản.</li>
</ul>

<h3>Hai cái bẫy im lặng</h3>
${slide('git-14', 12, 'Hai cái bẫy includeIf — đều IM LẶNG')}
<p><strong>Bẫy 1 — thiếu dấu gạch chéo cuối.</strong> <code>gitdir:~/fpt</code> (không có <code>/</code>) không có nghĩa là "mọi thứ bên trong <code>~/fpt</code>"; nó chỉ khớp một thư mục <code>.git</code> có đúng đường dẫn đó. Không gì khớp, không gì được chèn, và Git không nói gì — trong bộ thử, <code>git config --show-origin user.email</code> không in dòng nào và thoát với mã 1 (khoá chưa được đặt ở đâu cả). Có <code>/</code> ở cuối thì Git tự thêm <code>**</code> và mọi kho bên trong thư mục đều khớp.</p>
<p><strong>Bẫy 2 — <code>includeIf</code> đặt TRƯỚC <code>[user]</code>.</strong> File được chèn vào đọc tại chỗ dòng <code>includeIf</code> đứng. Đặt nó ở đầu file thì dòng <code>[user] email</code> thường ở dưới được đọc sau và thắng:</p>
<div class="out">file:~/.gitconfig	cuong@example.com</div>
<p>— email cá nhân, bên trong kho của trường, không một lời cảnh báo. Luôn đặt các khối <code>includeIf</code> ở <em>cuối</em> <code>~/.gitconfig</code>, và kiểm một lần trong mỗi thư mục gốc bằng <code>git config --show-origin user.email</code>.</p>
<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Ba tuần commit dưới một cái tên sai.</b> Laptop của một bạn còn <code>user.email</code> từ hồi thực tập cũ; GitHub hiện các commit với ảnh đại diện xám không tên ai, và báo cáo đóng góp của giảng viên ghi bạn ấy bằng không. Viết lại lịch sử đó bây giờ nghĩa là force-push trên nhánh chung (Chương 8). Hai dòng <code>includeIf</code> ngay ngày đầu là tránh được. <b>"Mình đặt rồi, ổn mà."</b> Dòng <code>includeIf</code> thiếu gạch chéo cuối. Không ai kiểm bằng <code>--show-origin</code> cho tới khi báo cáo ra.</div>

<div class="pitfall"><strong>Bẫy:</strong> sửa email bằng <code>git config user.email …</code> — không có <code>--global</code> — bên trong một kho. Nó chạy, nhưng chỉ cho kho đó, lưu im lặng trong <code>.git/config</code>. Kỳ sau clone lại dự án, hay mở kho tiếp theo của trường, là email sai quay về.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Thêm bốn alias ở trên bằng <code>git config --global</code>, rồi mở <code>~/.gitconfig</code> (<code>git config --global --edit</code>) xem file Git đã ghi ra. Thử <code>git st</code> và <code>git lg</code> trong <code>thu-git</code>.</li><li>Tạo <code>~/fpt/</code>, chuyển hoặc clone một kho của trường vào đó (hoặc <code>git init ~/fpt/thu-truong</code>), và viết <code>~/.gitconfig-fpt</code> chứa email trường.</li><li>Thêm khối <code>[includeIf "gitdir:~/fpt/"]</code> vào <em>cuối</em> <code>~/.gitconfig</code>. Chạy <code>git config --show-origin user.email</code> bên trong <code>~/fpt/thu-truong</code> và bên trong <code>thu-git</code>.</li><li>Cố tình làm hỏng: bỏ dấu gạch chéo cuối, chạy lại lệnh đó, thấy không có gì đổi; sửa lại như cũ. Rồi tạo một commit trong mỗi kho và so <code>git log -1 --format="%ae"</code>.</li></ol>
<p><strong>Đạt khi:</strong> hai kho in ra hai email khác nhau, mỗi cái kèm file nó đến từ đó, và <code>git config --list --show-origin | grep includeif</code> cho thấy dòng <code>includeIf</code> của bạn đến từ <code>~/.gitconfig</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Scope (system / global / local)</span><span class="v">Phạm vi — thiết lập nằm ở file nào: cả máy, người dùng của bạn, hay một kho.</span></div>
  <div class="kv"><span class="k"><code>--show-origin</code></span><span class="v">Hiện nguồn gốc — in ra file mà mỗi giá trị đến từ đó; câu trả lời cho "ai đặt cái này?".</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">Bí danh — tên ngắn cho một lệnh Git dài hơn, lưu dưới dạng <code>alias.&lt;tên&gt;</code>.</span></div>
  <div class="kv"><span class="k"><code>includeIf</code></span><span class="v">Chèn có điều kiện — chèn một file cấu hình khác chỉ khi điều kiện đúng: thư mục của kho (<code>gitdir:</code>) hoặc URL remote của nó (<code>hasconfig:</code>).</span></div>
  <div class="kv"><span class="k">Upstream / tracking branch</span><span class="v">Nhánh theo dõi — nhánh trên remote mà nhánh ở máy push lên và pull về; <code>push.autoSetupRemote</code> tạo nó ở lần push đầu.</span></div>
  <div class="kv"><span class="k">rerere</span><span class="v">"Reuse recorded resolution" — dùng lại cách giải đã ghi: Git nhớ bạn giải một xung đột thế nào và làm lại y như vậy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cấu hình được đọc system → global → local → dòng lệnh, và giá trị đọc sau cùng thắng.</li><li><code>git config --list --show-origin</code> trả lời câu "thiết lập này từ đâu ra?" — hỏi nó thay vì đoán.</li><li>Vài alias và sáu thiết lập (<code>defaultBranch</code>, <code>pull.rebase</code>, <code>push.autoSetupRemote</code>, <code>rerere</code>, <code>histogram</code>, <code>autocorrect</code>) gỡ đi phần lớn phiền toái hằng ngày.</li><li><code>[includeIf "gitdir:~/fpt/"]</code> tự cho các kho của trường dùng email trường.</li><li>Cả hai bẫy của <code>includeIf</code> đều im lặng: giữ dấu gạch chéo cuối, đặt khối sau <code>[user]</code>, và kiểm bằng <code>--show-origin</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-config#_conditional_includes" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">git-config — Conditional includes</span><span class="lc-sub">gitdir, gitdir/i, onbranch và hasconfig:remote.*.url, có ví dụ.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Pro Git — Git Configuration</span><span class="lc-sub">Các file cấu hình, thiết lập lõi, màu sắc và công cụ ngoài.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> <code>.gitconfig</code> là một tập quyết định đưa ra một lần, lúc bình tĩnh, để bạn khỏi phải quyết lúc một giờ sáng trước hạn nộp. Ghi từng quyết định ra, và kiểm bằng <code>--show-origin</code> — một thiết lập bạn không lần ra được nguồn là một thiết lập bạn không kiểm soát.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — Working with Windows teammates: CRLF/LF, .gitattributes, case and exec bits|||14.4 — Làm nhóm với bạn dùng Windows: CRLF/LF, .gitattributes, hoa/thường và quyền chạy',
      slug: 'git-14-4-windows-crlf',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao một file không đổi chữ nào lại đỏ cả diff, core.autocrlf và .gitattributes (* text=auto eol=lf, *.png binary), chuẩn hoá bằng git add --renormalize, đổi tên chỉ khác hoa/thường bằng git mv, bit chạy với git update-index --chmod=+x, và đường dẫn dài trên Windows.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>One invisible character, a whole file in red</h2>
<p class="lead">Your SWP391 team has two Macs, one Linux laptop and two Windows machines. Everything works until someone opens <code>README.md</code>, saves it without changing a letter, and the pull request shows every line deleted and added again. Or <code>deploy.sh</code> works on your Mac and dies in Docker with "no such file or directory" — about a file that is clearly there. Both are the same story, plus two cousins: file names that differ only in case, and the executable bit.</p>

<h3>CRLF and LF: what is actually different</h3>
${slide('git-14', 13, 'CRLF và LF: một ký tự vô hình làm diff đỏ cả file')}
<p>A text file ends each line with an invisible character. macOS and Linux use one: <strong>LF</strong> (line feed, <code>\\n</code>). Windows traditionally uses two: <strong>CR</strong> (carriage return, <code>\\r</code>) followed by LF — <strong>CRLF</strong>. Git compares bytes, so a line that ends in <code>\\r\\n</code> and the same line ending in <code>\\n</code> are different lines.</p>
<p>In the test repository a Windows teammate committed with no conversion. <code>git ls-files --eol</code> shows what is stored in the index (<code>i/</code>) and in your working copy (<code>w/</code>):</p>
<pre><code class="language-bash">git ls-files --eol</code></pre>
<div class="out">i/crlf  w/crlf  attr/                 	README.md
i/lf    w/lf    attr/                 	app.js
i/crlf  w/crlf  attr/                 	deploy.sh
i/-text w/-text attr/                 	logo.png</div>
<p>Now Cường opens <code>README.md</code> on his Mac and saves it — his editor writes LF. Not one visible character changed:</p>
<pre><code class="language-bash">git diff --stat
git diff | cat -v</code></pre>
<div class="out"> README.md | 4 ++--
-# Clinic^M
-Dat lich^M
+# Clinic
+Dat lich</div>
<p><code>^M</code> is how <code>cat -v</code> prints <code>\\r</code>. On a real 300-line file that is a 600-line diff that hides the one line anyone cares about — and a merge conflict on every line the next time someone touches it.</p>
<p>Worse, a shell script with CRLF endings does not run on Linux at all. The first line <code>#!/bin/bash</code> becomes <code>#!/bin/bash\\r</code>, and there is no program called <code>bash\\r</code>:</p>
<div class="out">bash: ./deploy.sh: /bin/bash^M: bad interpreter: No such file or directory</div>
<p>Inside a Docker container (a real <code>debian:12</code> run of the same file) the message is even less helpful — it blames the script itself:</p>
<div class="out">exec ./deploy.sh: no such file or directory</div>

<h3><code>core.autocrlf</code> is a habit of each machine</h3>
${slide('git-14', 14, 'autocrlf là thói quen từng MÁY — .gitattributes là luật của KHO')}
<p>The introduction (lesson 0) set <code>core.autocrlf</code>: <code>true</code> on Windows (convert to LF when committing, back to CRLF when checking out), <code>input</code> on macOS and Linux (convert CRLF to LF when committing, never the other way). Git warns you when it is about to convert:</p>
<div class="out">warning: in the working copy of 'lf.txt', LF will be replaced by CRLF the next time Git touches it</div>
<p>That setting is correct, but it lives in each person's own configuration. The new teammate who installed Git with other options, the lab machine at school, the CI runner — none of them have it. A rule that depends on five people remembering is not a rule.</p>

<h3><code>.gitattributes</code> is a rule of the repository</h3>
<p>A <code>.gitattributes</code> file is committed with the code, so it applies to every clone, every machine, every CI run — and where it conflicts with <code>core.autocrlf</code>, <code>.gitattributes</code> wins. A good default for a Node.js/Next.js project:</p>
<pre><code class="language-bash"><span class="tok-comment"># .gitattributes — at the root of the repository</span>
* text=auto eol=lf        <span class="tok-comment"># Git decides what is text; text is stored AND checked out with LF</span>
*.png binary              <span class="tok-comment"># never convert, never try to diff or merge as text</span>
*.sh text eol=lf          <span class="tok-comment"># shell scripts: LF even on Windows, or Linux cannot run them</span></code></pre>
<p>Add <code>*.jpg binary</code>, <code>*.pdf binary</code> and so on for other binary types you keep in the repository; if the project has Windows-only <code>.bat</code> files, <code>*.bat text eol=crlf</code> keeps them in the form Windows expects. Check what Git decided for a file with <code>git check-attr</code>:</p>
<pre><code class="language-bash">git check-attr -a README.md logo.png</code></pre>
<div class="out">README.md: text: auto
README.md: eol: lf
logo.png: binary: set
logo.png: diff: unset
logo.png: merge: unset
logo.png: text: unset
logo.png: eol: lf</div>
<p>(<code>binary</code> is shorthand for "no text conversion, no text diff, no text merge" — which is what the three <code>unset</code> lines say.)</p>

<h3>Cleaning up a repository that already mixed them: <code>--renormalize</code></h3>
${slide('git-14', 15, 'Chuẩn hoá một kho đã lỡ trộn CRLF: renormalize')}
<p>Adding <code>.gitattributes</code> changes the rule, not the files already committed. <code>ls-files</code> now shows the rule next to the old content:</p>
<div class="out">i/crlf  w/crlf  attr/text=auto eol=lf 	README.md
i/crlf  w/crlf  attr/text eol=lf      	deploy.sh</div>
<p>To apply the rule to everything, re-add every file through the new filters, in one dedicated commit:</p>
<pre><code class="language-bash">git add --renormalize .
git status -s</code></pre>
<div class="out">M  README.md
M  deploy.sh
?? .gitattributes</div>
<pre><code class="language-bash">git add .gitattributes
git commit -m <span class="tok-string">"chore: chuẩn hoá xuống dòng về LF (.gitattributes)"</span>
git ls-files --eol</code></pre>
<div class="out">i/lf    w/crlf  attr/text=auto eol=lf 	README.md
i/lf    w/crlf  attr/text eol=lf      	deploy.sh</div>
<p>The repository (<code>i/lf</code>) is fixed; your working copy still has the old CRLF files until Git rewrites them. Delete and check them out again:</p>
<pre><code class="language-bash">rm README.md deploy.sh
git checkout -- README.md deploy.sh
git ls-files --eol</code></pre>
<div class="out">i/lf    w/lf    attr/text=auto eol=lf 	README.md
i/lf    w/lf    attr/text eol=lf      	deploy.sh</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t"><code>.gitattributes</code></div><div class="lz-d">Commit the rule: <code>* text=auto eol=lf</code>, <code>binary</code> for images.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t"><code>git add --renormalize .</code></div><div class="lz-d">Re-add every tracked file through the rule.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">One commit, alone</div><div class="lz-d"><code>chore: …</code> — only line endings change.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Refresh the working copy</div><div class="lz-d">Delete and <code>git checkout --</code> the converted files.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Team pulls</div><div class="lz-d">Before starting the next branch.</div></div>
</div>
<p>Only files whose line endings really changed appear in that commit, and it changes nothing else — so it is easy to review and easy to recognise later in <code>git blame</code>. Tell the team to pull it before their next branch; a feature branch started before it may see line-ending conflicts once, and after that never again. Do it in its own pull request, never mixed with a feature.</p>

<h3>Two more cousins: case-only renames and the executable bit</h3>
${slide('git-14', 16, 'Hai cái bẫy nữa: hoa/thường và quyền chạy file')}
<p><strong>Case-only renames.</strong> The macOS and Windows file systems are case-insensitive by default: <code>Button.tsx</code> and <code>button.tsx</code> are the same file to them. That is why <code>git init</code> wrote <code>core.ignorecase=true</code> on the Mac (lesson 14.3). Rename a file only in case in Finder or with <code>mv</code>, and Git sees nothing:</p>
<pre><code class="language-bash">mv src/Button.tsx src/button.tsx
git status -s                <span class="tok-comment"># prints nothing</span>
git ls-files src</code></pre>
<div class="out">src/Button.tsx</div>
<p>The repository still says <code>Button.tsx</code>. Your code imports <code>./button</code>, it works on your Mac, and the Linux build — CI, the Docker image, the VPS — fails because Linux is case-sensitive and no <code>button.tsx</code> exists there. The fix is to rename through Git:</p>
<pre><code class="language-bash">mv src/button.tsx src/Button.tsx      <span class="tok-comment"># put the old name back first</span>
git mv src/Button.tsx src/button.tsx
git status -s</code></pre>
<div class="out">R  src/Button.tsx -&gt; src/button.tsx</div>
<p>Do not "fix" this by setting <code>core.ignorecase false</code> on a Mac — the file system is still case-insensitive, and Git would start seeing two files where there is one.</p>
<p><strong>The executable bit.</strong> Git stores one permission per file: <code>100644</code> (normal) or <code>100755</code> (executable). A script committed from Windows is usually <code>100644</code>, and on Linux it refuses to run with "permission denied". On macOS or Linux, <code>chmod +x deploy.sh</code> and commit is enough. Windows has no such bit (Git for Windows sets <code>core.filemode=false</code>), so a Windows teammate sets it in the index directly:</p>
<pre><code class="language-bash">git ls-files -s --abbrev deploy.sh
git update-index --chmod=+x deploy.sh
git diff --cached</code></pre>
<div class="out">100644 227c13b 0	deploy.sh
diff --git a/deploy.sh b/deploy.sh
old mode 100644
new mode 100755</div>
<p><strong>Long paths on Windows.</strong> Windows limits paths to about 260 characters by default, and a deep <code>node_modules</code> or a long branch of nested folders can exceed it; Git for Windows then fails to check out files with a "Filename too long" error. The Git for Windows setting <code>git config --system core.longpaths true</code> (run from an administrator terminal) lifts the limit for Git. Keeping <code>node_modules</code> out of the repository with <code>.gitignore</code> avoids most of it in the first place.</p>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>The 4,000-line "formatting" commit.</b> A teammate's editor converted every file to CRLF; the PR is unreadable, and two other branches conflict on every line. Fix the rule (<code>.gitattributes</code>), renormalize once, and close that PR. <b>"It works on my machine."</b> <code>import Header from './header'</code> passes on three Macs and one Windows laptop, and the Linux CI and Docker build fail on Friday night — the repository still has <code>Header.tsx</code>. <b>The Docker entrypoint that "does not exist".</b> <code>exec ./entrypoint.sh: no such file or directory</code> — the file exists; its first line ends in <code>\\r</code>. <code>*.sh text eol=lf</code> would have stopped it.</div>

<div class="pitfall"><strong>Trap:</strong> renormalizing inside a feature branch. The line-ending commit touches many files; mixed into a feature PR it hides the real change, and every other open branch conflicts with it. Do it on <code>main</code>, in its own pull request, at a moment when few branches are open.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, create a CRLF file the way a Windows teammate would: <code>printf 'dong 1\\r\\ndong 2\\r\\n' &gt; windows.txt</code>, and a script <code>printf '#!/bin/sh\\r\\necho chay\\r\\n' &gt; chay.sh</code>. Commit both with <code>git -c core.autocrlf=false commit</code> after adding them the same way (<code>git -c core.autocrlf=false add .</code>).</li><li>Run <code>git ls-files --eol</code> and find the two <code>i/crlf</code> lines. Try <code>sh chay.sh | cat -v</code> and look for <code>^M</code>.</li><li>Create <code>.gitattributes</code> with <code>* text=auto eol=lf</code> and <code>*.sh text eol=lf</code>, then <code>git add --renormalize .</code>, <code>git add .gitattributes</code> and commit <code>chore: chuẩn hoá xuống dòng về LF</code>. Refresh the working copy (delete and <code>git checkout --</code> the two files).</li><li>Make <code>chay.sh</code> executable with <code>git update-index --chmod=+x chay.sh</code> (the Windows way), commit, and run <code>chmod +x chay.sh &amp;&amp; ./chay.sh</code>. Finally rename a file only in case with <code>git mv</code> and check <code>git status -s</code> shows <code>R</code>.</li></ol>
<p><strong>Done when:</strong> <code>git ls-files --eol</code> shows no <code>i/crlf</code> line, <code>git ls-files -s chay.sh</code> starts with <code>100755</code>, <code>./chay.sh</code> prints <code>chay</code>, and <code>git ls-files</code> shows the new lowercase (or uppercase) name.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">LF / CRLF</span><span class="v">Line endings: <code>\\n</code> (macOS, Linux) / <code>\\r\\n</code> (Windows). <code>^M</code> is how <code>\\r</code> is printed.</span></div>
  <div class="kv"><span class="k"><code>core.autocrlf</code></span><span class="v">A per-machine setting that converts line endings on commit and checkout: <code>true</code> on Windows, <code>input</code> on macOS/Linux.</span></div>
  <div class="kv"><span class="k"><code>.gitattributes</code></span><span class="v">A committed file of per-path rules (<code>text</code>, <code>eol</code>, <code>binary</code>) that applies to every clone and overrides <code>core.autocrlf</code>.</span></div>
  <div class="kv"><span class="k">Renormalize</span><span class="v"><code>git add --renormalize .</code> — re-add every tracked file through the current rules, so the index matches <code>.gitattributes</code>.</span></div>
  <div class="kv"><span class="k">Case-insensitive file system</span><span class="v">macOS and Windows treat <code>Button.tsx</code> and <code>button.tsx</code> as the same file; Linux does not. Rename with <code>git mv</code>.</span></div>
  <div class="kv"><span class="k">Executable bit (mode 100755)</span><span class="v">The one permission Git stores; set it from Windows with <code>git update-index --chmod=+x</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>CRLF and LF are different bytes, so a line-ending change makes the whole file look rewritten and breaks shell scripts on Linux.</li><li><code>core.autocrlf</code> depends on every machine being set up right; <code>.gitattributes</code> is committed and applies to everyone.</li><li><code>* text=auto eol=lf</code> plus <code>binary</code> for images is a safe default; <code>git check-attr</code> shows what Git decided.</li><li>Fix an existing repository once with <code>git add --renormalize .</code> in a dedicated commit, then refresh the working copy.</li><li>Rename case-only with <code>git mv</code>, set the executable bit with <code>git update-index --chmod=+x</code>, and enable <code>core.longpaths</code> on Windows when paths get long.</li></ul>

<a class="link-card" href="https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Configuring Git to handle line endings</span><span class="lc-sub">core.autocrlf per OS, an example .gitattributes, refreshing a repository.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitattributes" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">gitattributes — reference</span><span class="lc-sub">text, eol, binary, and every other attribute a path can carry.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-update-index" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">git-update-index — reference</span><span class="lc-sub">--chmod=(+|-)x and the other ways to edit the index directly.</span></span>
</a>
<p class="note-ct"><strong>How to think about it:</strong> a mixed team does not need everyone to configure their machine perfectly — it needs the repository to carry its own rules. Commit <code>.gitattributes</code> on day one, and line endings stop being a topic.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Một ký tự vô hình, cả file đỏ rực</h2>
<p class="lead">Nhóm SWP391 của bạn có hai máy Mac, một laptop Linux và hai máy Windows. Mọi thứ đều ổn cho tới khi có người mở <code>README.md</code>, lưu lại mà không đổi một chữ nào, và pull request hiện mọi dòng bị xoá rồi thêm lại. Hoặc <code>deploy.sh</code> chạy tốt trên Mac của bạn rồi chết trong Docker với lỗi "no such file or directory" — về một file rõ ràng là có ở đó. Hai chuyện là một, cộng thêm hai người họ hàng: tên file chỉ khác hoa/thường, và quyền chạy (executable bit).</p>

<h3>CRLF và LF: thật ra khác nhau ở đâu</h3>
${slide('git-14', 13, 'CRLF và LF: một ký tự vô hình làm diff đỏ cả file')}
<p>Một file văn bản kết thúc mỗi dòng bằng một ký tự vô hình. macOS và Linux dùng một ký tự: <strong>LF</strong> (line feed — xuống dòng, <code>\\n</code>). Windows theo truyền thống dùng hai: <strong>CR</strong> (carriage return — về đầu dòng, <code>\\r</code>) rồi tới LF — gọi là <strong>CRLF</strong>. Git so sánh từng byte, nên một dòng kết thúc bằng <code>\\r\\n</code> và cùng dòng đó kết thúc bằng <code>\\n</code> là hai dòng khác nhau.</p>
<p>Trong kho thử, một bạn dùng Windows đã commit mà không có chuyển đổi nào. <code>git ls-files --eol</code> cho thấy thứ đang lưu trong index (<code>i/</code>) và trong bản làm việc của bạn (<code>w/</code>):</p>
<pre><code class="language-bash">git ls-files --eol</code></pre>
<div class="out">i/crlf  w/crlf  attr/                 	README.md
i/lf    w/lf    attr/                 	app.js
i/crlf  w/crlf  attr/                 	deploy.sh
i/-text w/-text attr/                 	logo.png</div>
<p>Giờ Cường mở <code>README.md</code> trên Mac và lưu lại — trình soạn thảo của cậu ghi LF. Không một ký tự nhìn thấy được nào đổi:</p>
<pre><code class="language-bash">git diff --stat
git diff | cat -v</code></pre>
<div class="out"> README.md | 4 ++--
-# Clinic^M
-Dat lich^M
+# Clinic
+Dat lich</div>
<p><code>^M</code> là cách <code>cat -v</code> in ra <code>\\r</code>. Với một file thật 300 dòng, đó là một bản diff 600 dòng che mất đúng một dòng mà ai cũng quan tâm — và một xung đột trên mọi dòng ở lần kế tiếp có người đụng vào file.</p>
<p>Tệ hơn, một shell script có đuôi CRLF không chạy được trên Linux. Dòng đầu <code>#!/bin/bash</code> thành <code>#!/bin/bash\\r</code>, mà không có chương trình nào tên <code>bash\\r</code>:</p>
<div class="out">bash: ./deploy.sh: /bin/bash^M: bad interpreter: No such file or directory</div>
<p>Trong một container Docker (chạy thật cùng file đó trên <code>debian:12</code>) thông báo còn khó hiểu hơn — nó đổ lỗi cho chính file script:</p>
<div class="out">exec ./deploy.sh: no such file or directory</div>

<h3><code>core.autocrlf</code> là thói quen của từng máy</h3>
${slide('git-14', 14, 'autocrlf là thói quen từng MÁY — .gitattributes là luật của KHO')}
<p>Phần mở đầu (Mục 0) đã đặt <code>core.autocrlf</code>: <code>true</code> trên Windows (đổi sang LF khi commit, đổi về CRLF khi checkout), <code>input</code> trên macOS và Linux (đổi CRLF sang LF khi commit, không bao giờ làm chiều ngược lại). Git cảnh báo khi sắp chuyển đổi:</p>
<div class="out">warning: in the working copy of 'lf.txt', LF will be replaced by CRLF the next time Git touches it</div>
<p>Thiết lập đó đúng, nhưng nó sống trong cấu hình riêng của từng người. Bạn mới vào nhóm cài Git với tuỳ chọn khác, máy phòng lab ở trường, máy chạy CI — không ai trong số đó có nó. Một luật phụ thuộc vào việc năm người cùng nhớ thì không phải là luật.</p>

<h3><code>.gitattributes</code> là luật của kho</h3>
<p>File <code>.gitattributes</code> (thuộc tính theo đường dẫn) được commit cùng mã nguồn, nên nó áp cho mọi bản clone, mọi máy, mọi lần chạy CI — và chỗ nào mâu thuẫn với <code>core.autocrlf</code> thì <code>.gitattributes</code> thắng. Một mặc định tốt cho dự án Node.js/Next.js:</p>
<pre><code class="language-bash"><span class="tok-comment"># .gitattributes — đặt ở gốc kho</span>
* text=auto eol=lf        <span class="tok-comment"># Git tự nhận file văn bản; văn bản được lưu VÀ checkout bằng LF</span>
*.png binary              <span class="tok-comment"># không bao giờ chuyển đổi, không diff hay merge như văn bản</span>
*.sh text eol=lf          <span class="tok-comment"># shell script: LF kể cả trên Windows, không thì Linux không chạy được</span></code></pre>
<p>Thêm <code>*.jpg binary</code>, <code>*.pdf binary</code>… cho các loại file nhị phân (binary) khác bạn giữ trong kho; nếu dự án có file <code>.bat</code> chỉ dành cho Windows thì <code>*.bat text eol=crlf</code> giữ chúng ở dạng Windows cần. Xem Git đã quyết định gì cho một file bằng <code>git check-attr</code>:</p>
<pre><code class="language-bash">git check-attr -a README.md logo.png</code></pre>
<div class="out">README.md: text: auto
README.md: eol: lf
logo.png: binary: set
logo.png: diff: unset
logo.png: merge: unset
logo.png: text: unset
logo.png: eol: lf</div>
<p>(<code>binary</code> là cách viết tắt của "không chuyển đổi văn bản, không diff văn bản, không merge văn bản" — đúng như ba dòng <code>unset</code> nói.)</p>

<h3>Dọn một kho đã lỡ trộn lẫn: <code>--renormalize</code></h3>
${slide('git-14', 15, 'Chuẩn hoá một kho đã lỡ trộn CRLF: renormalize')}
<p>Thêm <code>.gitattributes</code> là đổi luật, không đổi những file đã commit. <code>ls-files</code> giờ hiện luật mới nằm cạnh nội dung cũ:</p>
<div class="out">i/crlf  w/crlf  attr/text=auto eol=lf 	README.md
i/crlf  w/crlf  attr/text eol=lf      	deploy.sh</div>
<p>Để áp luật cho mọi thứ, đưa lại mọi file vào index qua bộ lọc mới (renormalize — chuẩn hoá lại), trong một commit riêng:</p>
<pre><code class="language-bash">git add --renormalize .
git status -s</code></pre>
<div class="out">M  README.md
M  deploy.sh
?? .gitattributes</div>
<pre><code class="language-bash">git add .gitattributes
git commit -m <span class="tok-string">"chore: chuẩn hoá xuống dòng về LF (.gitattributes)"</span>
git ls-files --eol</code></pre>
<div class="out">i/lf    w/crlf  attr/text=auto eol=lf 	README.md
i/lf    w/crlf  attr/text eol=lf      	deploy.sh</div>
<p>Kho (<code>i/lf</code>) đã sạch; bản làm việc của bạn vẫn giữ file CRLF cũ cho tới khi Git ghi lại chúng. Xoá rồi checkout lại:</p>
<pre><code class="language-bash">rm README.md deploy.sh
git checkout -- README.md deploy.sh
git ls-files --eol</code></pre>
<div class="out">i/lf    w/lf    attr/text=auto eol=lf 	README.md
i/lf    w/lf    attr/text eol=lf      	deploy.sh</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t"><code>.gitattributes</code></div><div class="lz-d">Commit luật: <code>* text=auto eol=lf</code>, <code>binary</code> cho ảnh.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t"><code>git add --renormalize .</code></div><div class="lz-d">Đưa lại mọi file đang theo dõi qua luật.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Một commit, riêng biệt</div><div class="lz-d"><code>chore: …</code> — chỉ đổi đuôi dòng.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Làm mới bản làm việc</div><div class="lz-d">Xoá rồi <code>git checkout --</code> các file đã chuyển.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Cả nhóm pull</div><div class="lz-d">Trước khi tạo nhánh tiếp theo.</div></div>
</div>
<p>Chỉ những file thật sự đổi đuôi dòng mới có mặt trong commit đó, và nó không đổi gì khác — nên dễ review và sau này dễ nhận ra trong <code>git blame</code>. Báo cả nhóm pull nó về trước khi tạo nhánh tiếp theo; một nhánh tính năng tạo từ trước đó có thể gặp xung đột đuôi dòng một lần, rồi không bao giờ nữa. Làm việc này trong một pull request riêng, đừng bao giờ trộn với một tính năng.</p>

<h3>Hai người họ hàng: đổi tên chỉ khác hoa/thường, và quyền chạy</h3>
${slide('git-14', 16, 'Hai cái bẫy nữa: hoa/thường và quyền chạy file')}
<p><strong>Đổi tên chỉ khác hoa/thường.</strong> Hệ thống file của macOS và Windows mặc định không phân biệt hoa/thường (case-insensitive): <code>Button.tsx</code> và <code>button.tsx</code> với chúng là một file. Đó là lý do <code>git init</code> ghi <code>core.ignorecase=true</code> trên Mac (bài 14.3). Đổi tên một file chỉ khác hoa/thường bằng Finder hay <code>mv</code>, Git không thấy gì:</p>
<pre><code class="language-bash">mv src/Button.tsx src/button.tsx
git status -s                <span class="tok-comment"># không in gì</span>
git ls-files src</code></pre>
<div class="out">src/Button.tsx</div>
<p>Kho vẫn ghi <code>Button.tsx</code>. Mã của bạn import <code>./button</code>, chạy được trên Mac, còn bản build Linux — CI, ảnh Docker, VPS — thì hỏng, vì Linux phân biệt hoa/thường và ở đó không có <code>button.tsx</code> nào. Cách sửa là đổi tên thông qua Git:</p>
<pre><code class="language-bash">mv src/button.tsx src/Button.tsx      <span class="tok-comment"># trả lại tên cũ trước</span>
git mv src/Button.tsx src/button.tsx
git status -s</code></pre>
<div class="out">R  src/Button.tsx -&gt; src/button.tsx</div>
<p>Đừng "sửa" chuyện này bằng cách đặt <code>core.ignorecase false</code> trên Mac — hệ thống file vẫn không phân biệt hoa/thường, và Git sẽ bắt đầu thấy hai file ở chỗ chỉ có một.</p>
<p><strong>Quyền chạy.</strong> Git lưu đúng một quyền cho mỗi file: <code>100644</code> (thường) hoặc <code>100755</code> (chạy được). Một script commit từ Windows thường là <code>100644</code>, và trên Linux nó từ chối chạy với lỗi "permission denied". Trên macOS hay Linux, <code>chmod +x deploy.sh</code> rồi commit là đủ. Windows không có bit này (Git for Windows đặt <code>core.filemode=false</code>), nên bạn dùng Windows đặt thẳng vào index:</p>
<pre><code class="language-bash">git ls-files -s --abbrev deploy.sh
git update-index --chmod=+x deploy.sh
git diff --cached</code></pre>
<div class="out">100644 227c13b 0	deploy.sh
diff --git a/deploy.sh b/deploy.sh
old mode 100644
new mode 100755</div>
<p><strong>Đường dẫn dài trên Windows.</strong> Windows mặc định giới hạn đường dẫn khoảng 260 ký tự, và một <code>node_modules</code> sâu hay một chuỗi thư mục lồng nhau dài có thể vượt qua; khi đó Git for Windows không checkout được file và báo lỗi "Filename too long". Thiết lập của Git for Windows <code>git config --system core.longpaths true</code> (chạy trong terminal quyền quản trị) gỡ giới hạn đó cho Git. Giữ <code>node_modules</code> ngoài kho bằng <code>.gitignore</code> thì tránh được phần lớn chuyện này ngay từ đầu.</p>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Commit "định dạng lại" 4.000 dòng.</b> Trình soạn thảo của một bạn đổi mọi file sang CRLF; PR không đọc nổi, và hai nhánh khác xung đột trên từng dòng. Sửa luật (<code>.gitattributes</code>), renormalize một lần, và đóng PR đó lại. <b>"Máy mình chạy được mà."</b> <code>import Header from './header'</code> chạy trên ba máy Mac và một laptop Windows, còn CI Linux và bản build Docker thì hỏng vào tối thứ Sáu — kho vẫn ghi <code>Header.tsx</code>. <b>Entrypoint của Docker "không tồn tại".</b> <code>exec ./entrypoint.sh: no such file or directory</code> — file có đó; dòng đầu của nó kết thúc bằng <code>\\r</code>. Một dòng <code>*.sh text eol=lf</code> là chặn được.</div>

<div class="pitfall"><strong>Bẫy:</strong> renormalize ngay trong một nhánh tính năng. Commit đổi đuôi dòng chạm vào nhiều file; trộn vào một PR tính năng thì nó che mất thay đổi thật, và mọi nhánh khác đang mở đều xung đột với nó. Làm trên <code>main</code>, trong một pull request riêng, vào lúc ít nhánh đang mở.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, tạo một file CRLF đúng như bạn dùng Windows sẽ tạo: <code>printf 'dong 1\\r\\ndong 2\\r\\n' &gt; windows.txt</code>, và một script <code>printf '#!/bin/sh\\r\\necho chay\\r\\n' &gt; chay.sh</code>. Add và commit cả hai mà tắt chuyển đổi: <code>git -c core.autocrlf=false add .</code> rồi <code>git -c core.autocrlf=false commit</code>.</li><li>Chạy <code>git ls-files --eol</code> và tìm hai dòng <code>i/crlf</code>. Thử <code>sh chay.sh | cat -v</code> và tìm <code>^M</code>.</li><li>Tạo <code>.gitattributes</code> gồm <code>* text=auto eol=lf</code> và <code>*.sh text eol=lf</code>, rồi <code>git add --renormalize .</code>, <code>git add .gitattributes</code> và commit <code>chore: chuẩn hoá xuống dòng về LF</code>. Làm mới bản làm việc (xoá rồi <code>git checkout --</code> hai file đó).</li><li>Cho <code>chay.sh</code> quyền chạy bằng <code>git update-index --chmod=+x chay.sh</code> (cách của Windows), commit, rồi chạy <code>chmod +x chay.sh &amp;&amp; ./chay.sh</code>. Cuối cùng đổi tên một file chỉ khác hoa/thường bằng <code>git mv</code> và kiểm <code>git status -s</code> hiện <code>R</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>git ls-files --eol</code> không còn dòng <code>i/crlf</code> nào, <code>git ls-files -s chay.sh</code> bắt đầu bằng <code>100755</code>, <code>./chay.sh</code> in ra <code>chay</code>, và <code>git ls-files</code> hiện tên mới đúng hoa/thường.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">LF / CRLF</span><span class="v">Ký tự cuối dòng — <code>\\n</code> (macOS, Linux) / <code>\\r\\n</code> (Windows). <code>^M</code> là cách <code>\\r</code> được in ra.</span></div>
  <div class="kv"><span class="k"><code>core.autocrlf</code></span><span class="v">Tự đổi đuôi dòng — thiết lập theo từng máy, chuyển đổi khi commit và checkout: <code>true</code> trên Windows, <code>input</code> trên macOS/Linux.</span></div>
  <div class="kv"><span class="k"><code>.gitattributes</code></span><span class="v">File thuộc tính — luật theo đường dẫn (<code>text</code>, <code>eol</code>, <code>binary</code>) được commit, áp cho mọi bản clone và thắng <code>core.autocrlf</code>.</span></div>
  <div class="kv"><span class="k">Renormalize</span><span class="v">Chuẩn hoá lại — <code>git add --renormalize .</code> đưa lại mọi file đang theo dõi qua luật hiện tại, để index khớp <code>.gitattributes</code>.</span></div>
  <div class="kv"><span class="k">Case-insensitive file system</span><span class="v">Hệ thống file không phân biệt hoa/thường — macOS và Windows coi <code>Button.tsx</code> và <code>button.tsx</code> là một; Linux thì không. Đổi tên bằng <code>git mv</code>.</span></div>
  <div class="kv"><span class="k">Executable bit (mode 100755)</span><span class="v">Quyền chạy — quyền duy nhất Git lưu; đặt từ Windows bằng <code>git update-index --chmod=+x</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>CRLF và LF là những byte khác nhau, nên đổi đuôi dòng làm cả file trông như bị viết lại và làm shell script chết trên Linux.</li><li><code>core.autocrlf</code> phụ thuộc vào việc mọi máy được cài đúng; <code>.gitattributes</code> được commit và áp cho tất cả mọi người.</li><li><code>* text=auto eol=lf</code> cộng <code>binary</code> cho ảnh là một mặc định an toàn; <code>git check-attr</code> cho biết Git đã quyết định gì.</li><li>Sửa một kho đang có sẵn một lần bằng <code>git add --renormalize .</code> trong một commit riêng, rồi làm mới bản làm việc.</li><li>Đổi tên chỉ khác hoa/thường bằng <code>git mv</code>, đặt quyền chạy bằng <code>git update-index --chmod=+x</code>, và bật <code>core.longpaths</code> trên Windows khi đường dẫn dài.</li></ul>

<a class="link-card" href="https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Configuring Git to handle line endings</span><span class="lc-sub">core.autocrlf theo hệ điều hành, một .gitattributes mẫu, làm mới kho.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitattributes" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">gitattributes — tài liệu tham khảo</span><span class="lc-sub">text, eol, binary, và mọi thuộc tính khác một đường dẫn có thể mang.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-update-index" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">git-update-index — tài liệu tham khảo</span><span class="lc-sub">--chmod=(+|-)x và các cách khác để sửa thẳng index.</span></span>
</a>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> một nhóm dùng lẫn máy không cần mọi người cài máy hoàn hảo — nó cần kho tự mang luật của mình. Commit <code>.gitattributes</code> ngay ngày đầu, và chuyện đuôi dòng không còn là đề tài bàn cãi.</p>
</div>
`,
    },
    /* ─────────────────────────── 14.5 Quiz ─────────────────────────── */
    {
      title: '14.5 — Chapter 14 quiz|||14.5 — Kiểm tra Chương 14',
      slug: 'git-14-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: merge editor và Complete Merge, stage từng dòng, Discard không có đường lùi, Sync và pull.rebase, chọn công cụ cho Linux/SSH, hai bẫy includeIf, --show-origin, CRLF trong PR và trong Docker, đổi tên chỉ khác hoa/thường.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from a mixed Mac/Windows/Linux team using VS Code and GitHub — each one is decided by what a button really runs, which file a setting really comes from, or which byte really ends a line. Read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say which Git command each Source Control button runs, and which ones can destroy uncommitted work.</li>
<li>I can resolve a conflict in the merge editor and know what is still left to do after Complete Merge.</li>
<li>I can pick a history viewer for the job and explain why the terminal stays the tool for rescue.</li>
<li>I can find where any setting comes from with <code>--show-origin</code>, and set up two identities with <code>includeIf</code> without falling into its two silent traps.</li>
<li>I can fix a repository with mixed line endings using <code>.gitattributes</code> and <code>git add --renormalize .</code>, and rename a file by case only with <code>git mv</code>.</li>
</ul>
${slide('git-14', 17, 'Bảng tra nhanh Chương 14')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ một nhóm dùng lẫn Mac/Windows/Linux với VS Code và GitHub — câu nào cũng được quyết định bởi thứ một nút bấm thật sự chạy, file mà một thiết lập thật sự đến từ đó, hay byte thật sự kết thúc một dòng. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được mỗi nút trong Source Control chạy lệnh Git nào, và nút nào có thể phá mất công việc chưa commit.</li>
<li>Tôi giải được xung đột bằng merge editor và biết còn phải làm gì sau Complete Merge.</li>
<li>Tôi chọn được công cụ nhìn lịch sử hợp việc và giải thích được vì sao terminal vẫn là công cụ để cứu hộ.</li>
<li>Tôi tìm được bất kỳ thiết lập nào đến từ đâu bằng <code>--show-origin</code>, và dựng được hai danh tính bằng <code>includeIf</code> mà không rơi vào hai cái bẫy im lặng của nó.</li>
<li>Tôi sửa được một kho lẫn lộn đuôi dòng bằng <code>.gitattributes</code> và <code>git add --renormalize .</code>, và đổi tên một file chỉ khác hoa/thường bằng <code>git mv</code>.</li>
</ul>
${slide('git-14', 17, 'Bảng tra nhanh Chương 14')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You resolved the only conflict in lich.js in VS Code’s merge editor and pressed "Complete Merge". The tab closed. What is the state of the repository now?|||Bạn giải xung đột duy nhất trong lich.js bằng merge editor của VS Code và bấm "Complete Merge". Tab đóng lại. Kho đang ở trạng thái nào?',
            options: [
              'The merge is finished and a merge commit has been created|||Lần merge đã xong và một merge commit đã được tạo',
              'The merge was aborted and main is back where it was|||Lần merge đã bị huỷ và main quay về chỗ cũ',
              'lich.js is staged, but Git is still merging — you still have to commit|||lich.js đã được stage, nhưng Git vẫn đang merge — bạn vẫn phải commit',
              'The merge commit has been created and pushed to origin|||Merge commit đã được tạo và push lên origin',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Complete Merge stages the file and closes the editor; it does not conclude the merge. git status says "All conflicts fixed but you are still merging" and asks for git commit (or git rebase --continue during a rebase). The tempting answer "the merge is finished" is exactly what the closed tab suggests — which is why you check with git status rather than with the UI.|||VI: Complete Merge stage file rồi đóng trình gộp; nó không kết thúc lần merge. git status báo "All conflicts fixed but you are still merging" và bảo bạn git commit (hoặc git rebase --continue nếu đang rebase). Đáp án hấp dẫn "merge đã xong" đúng là điều cái tab đóng lại gợi ý — vì thế hãy kiểm bằng git status chứ không bằng giao diện.',
          },
          {
            question: 'In api.ts you fixed a real bug (lines 12–14) and also left a console.log on line 40. You want one commit containing only the fix. What is the direct way in VS Code?|||Trong api.ts bạn sửa một lỗi thật (dòng 12–14) và còn để một console.log ở dòng 40. Bạn muốn một commit chỉ chứa bản sửa. Cách trực tiếp trong VS Code là gì?',
            options: [
              'Select lines 12–14 in the diff editor → Stage Selected Ranges, then commit|||Bôi đen dòng 12–14 trong diff editor → Stage Selected Ranges, rồi commit',
              'Press + on api.ts, commit, then remove the console.log in a second commit|||Bấm + trên api.ts, commit, rồi xoá console.log ở commit thứ hai',
              'Commit with nothing staged and choose to stage all changes|||Commit khi chưa stage gì và chọn stage tất cả thay đổi',
              'Use Commit (Amend) so the console.log is folded into the previous commit|||Dùng Commit (Amend) để console.log được gộp vào commit trước',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Stage Selected Ranges puts only the selected lines in the index — the mouse version of git add -p — so the commit contains exactly the fix and the debug line stays unstaged. Staging the whole file and "cleaning up later" ships the console.log in the first commit anyway; staging everything is the same mistake bigger; amending hides it in an unrelated commit.|||VI: Stage Selected Ranges chỉ đưa những dòng được chọn vào index — phiên bản chuột của git add -p — nên commit chứa đúng bản sửa, còn dòng debug vẫn chưa stage. Stage cả file rồi "dọn sau" thì console.log vẫn đi theo commit đầu; stage tất cả là cùng lỗi đó nhưng to hơn; amend thì giấu nó vào một commit không liên quan.',
          },
          {
            question: 'You right-clicked an untracked file with two hours of work in the Changes list and chose Discard Changes by mistake. It was never staged or committed. What can bring it back?|||Bạn chuột phải vào một file chưa theo dõi chứa hai giờ làm việc trong danh sách Changes và lỡ chọn Discard Changes. Nó chưa từng được stage hay commit. Cái gì mang nó về được?',
            options: [
              'git reflog, then git reset --hard to the entry before the discard|||git reflog, rồi git reset --hard về mục trước lần discard',
              'git fsck --lost-found, which recovers any file deleted from the folder|||git fsck --lost-found, lệnh khôi phục mọi file bị xoá khỏi thư mục',
              'git stash pop, because VS Code stashes a file before discarding it|||git stash pop, vì VS Code stash file trước khi discard',
              'Nothing in Git — it never stored the file; only something outside Git, like VS Code’s local history in Timeline, might|||Không gì trong Git — Git chưa bao giờ lưu file đó; chỉ thứ nằm ngoài Git, như lịch sử cục bộ trong Timeline của VS Code, may ra còn',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The reflog records where refs pointed, i.e. commits; git fsck --lost-found can only find blobs that were once added to the index. A file that was never staged or committed never became a Git object, so Git has nothing to restore. The tempting reflog answer works for lost commits (Chapter 13), not for uncommitted work. The Timeline view can include local file saves, which is the only realistic hope — and the lesson: commit or stash before cleaning up.|||VI: Reflog ghi lại các ref đã trỏ vào đâu, tức là commit; git fsck --lost-found chỉ tìm được blob từng được add vào index. Một file chưa từng stage hay commit thì chưa bao giờ thành đối tượng Git, nên Git không có gì để khôi phục. Đáp án reflog hấp dẫn đúng với commit bị mất (Chương 13), không đúng với việc chưa commit. Timeline có thể chứa các lần lưu file cục bộ, đó là hi vọng thực tế duy nhất — và bài học: commit hoặc stash trước khi dọn dẹp.',
          },
          {
            question: 'Teammates complain that every time you press Sync Changes, a "Merge branch “main” of github.com:…" commit appears in the shared history. Which one setting stops it without changing how you work?|||Các bạn cùng nhóm phàn nàn rằng mỗi lần bạn bấm Sync Changes, một commit "Merge branch “main” of github.com:…" lại xuất hiện trong lịch sử chung. Thiết lập nào, chỉ một dòng, chặn được chuyện đó mà bạn không phải đổi cách làm?',
            options: [
              'git config --global push.autoSetupRemote true',
              'git config --global pull.rebase true',
              'git config --global rerere.enabled true',
              'git config --global diff.algorithm histogram',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Sync is pull, then push. When your local commits and the remote have diverged, a merge-style pull creates exactly that "Merge branch main of …" commit. With pull.rebase = true the pull replays your local commits on top of the remote instead, so the history stays a straight line. push.autoSetupRemote only affects the first push of a new branch; rerere reuses conflict resolutions; histogram changes how diffs are displayed.|||VI: Sync là pull rồi push. Khi commit ở máy và remote đã rẽ nhau, một lần pull kiểu merge tạo ra đúng commit "Merge branch main of …" đó. Với pull.rebase = true, lần pull phát lại commit ở máy lên trên remote, nên lịch sử giữ là một đường thẳng. push.autoSetupRemote chỉ ảnh hưởng lần push đầu của nhánh mới; rerere dùng lại cách giải xung đột; histogram chỉ đổi cách hiển thị diff.',
          },
          {
            question: 'A teammate works on an Ubuntu laptop and also fixes things on the team’s VPS over SSH. They want a visual way to stage lines and do an interactive rebase in both places. Which tool fits?|||Một bạn cùng nhóm làm trên laptop Ubuntu và còn sửa việc trên VPS của nhóm qua SSH. Bạn ấy muốn một cách trực quan để stage từng dòng và rebase tương tác ở cả hai nơi. Công cụ nào hợp?',
            options: [
              'GitHub Desktop, installed on both the laptop and the VPS|||GitHub Desktop, cài trên cả laptop lẫn VPS',
              'The GitLens Commit Graph, free for the team’s private repository|||Commit Graph của GitLens, miễn phí cho repo private của nhóm',
              'lazygit, a terminal UI that runs wherever a terminal does, including over SSH|||lazygit, một giao diện trong terminal chạy ở mọi nơi có terminal, kể cả qua SSH',
              'Git Graph, opened as a standalone app on the VPS|||Git Graph, mở như một ứng dụng riêng trên VPS',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: lazygit draws its interface inside the terminal, so it works on a Linux desktop and in an SSH session alike, and supports staging single lines (space, v) and interactive rebase (i). GitHub Desktop does not support Linux (GitHub Docs, 09/2026) and needs a desktop anyway; the GitLens Commit Graph is a Pro feature on private repositories; Git Graph is a VS Code extension, not a standalone app.|||VI: lazygit vẽ giao diện ngay trong terminal, nên chạy được trên desktop Linux lẫn trong một phiên SSH, và hỗ trợ stage từng dòng (space, v) và rebase tương tác (i). GitHub Desktop không hỗ trợ Linux (GitHub Docs, 09/2026) và dù sao cũng cần màn hình desktop; Commit Graph của GitLens là tính năng Pro với repo private; Git Graph là extension của VS Code, không phải ứng dụng riêng.',
          },
          {
            question: 'Commits in ~/fpt/swp391 still carry your personal email. The last lines of ~/.gitconfig are: [includeIf "gitdir:~/fpt"] path = ~/.gitconfig-fpt. What fixes it?|||Commit trong ~/fpt/swp391 vẫn mang email cá nhân của bạn. Mấy dòng cuối ~/.gitconfig là: [includeIf "gitdir:~/fpt"] path = ~/.gitconfig-fpt. Sửa thế nào?',
            options: [
              'Add the trailing slash: [includeIf "gitdir:~/fpt/"]|||Thêm dấu gạch chéo cuối: [includeIf "gitdir:~/fpt/"]',
              'Move the includeIf block to the top of ~/.gitconfig|||Chuyển khối includeIf lên đầu ~/.gitconfig',
              'Rename ~/.gitconfig-fpt to ~/.gitconfig.local|||Đổi tên ~/.gitconfig-fpt thành ~/.gitconfig.local',
              'Run git config --system user.email with the school address|||Chạy git config --system user.email với địa chỉ trường',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Without the trailing slash, gitdir:~/fpt matches only a .git directory at exactly that path, so nothing inside ~/fpt/ matches and nothing is included — silently. With ~/fpt/ Git appends ** and every repository inside matches. Moving the block to the top is the second trap: the plain [user] email below would then be read later and win. A --system email would apply to every repository on the machine, and global still overrides it.|||VI: Thiếu gạch chéo cuối, gitdir:~/fpt chỉ khớp một thư mục .git ở đúng đường dẫn đó, nên không kho nào bên trong ~/fpt/ khớp và không gì được chèn — trong im lặng. Với ~/fpt/ Git tự thêm ** và mọi kho bên trong đều khớp. Chuyển khối lên đầu là cái bẫy thứ hai: dòng [user] email thường ở dưới sẽ được đọc sau và thắng. Đặt email ở --system thì áp cho mọi kho trên máy, và global vẫn đè lên nó.',
          },
          {
            question: 'In one repository Git signs your commits with an email you do not expect. What is the quickest way to find which file is setting it?|||Trong một kho, Git ký commit của bạn bằng một email bạn không ngờ tới. Cách nhanh nhất để tìm file nào đang đặt nó?',
            options: [
              'git config --global user.email|||git config --global user.email',
              'cat ~/.gitconfig and look for [user]|||cat ~/.gitconfig rồi tìm [user]',
              'git log -1 --format="%ae"|||git log -1 --format="%ae"',
              'git config --show-origin user.email|||git config --show-origin user.email',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: --show-origin prints the effective value together with the file it came from — including .git/config and files pulled in by includeIf. git config --global and cat ~/.gitconfig look at one file only and miss a local override or an include; git log shows which email was used, not where it was configured.|||VI: --show-origin in giá trị đang có hiệu lực kèm file nó đến từ đó — kể cả .git/config và những file được includeIf chèn vào. git config --global và cat ~/.gitconfig chỉ nhìn một file nên bỏ sót thiết lập cục bộ hay file được chèn; git log cho biết email nào đã được dùng, không cho biết nó được đặt ở đâu.',
          },
          {
            question: 'A Mac teammate opened README.md, saved it without editing, and the PR shows every line removed and re-added; git diff | cat -v shows ^M on the removed lines. What is the durable fix for the whole team?|||Một bạn dùng Mac mở README.md, lưu lại mà không sửa gì, và PR hiện mọi dòng bị xoá rồi thêm lại; git diff | cat -v cho thấy ^M ở các dòng bị xoá. Cách sửa bền vững cho cả nhóm là gì?',
            options: [
              'Ask everyone to set core.autocrlf true on their own machine|||Nhờ mọi người tự đặt core.autocrlf true trên máy mình',
              'Review such PRs with whitespace changes hidden and merge them anyway|||Review các PR kiểu này với chế độ ẩn thay đổi khoảng trắng rồi cứ merge',
              'Commit a .gitattributes with * text=auto eol=lf and run git add --renormalize . in its own commit|||Commit một .gitattributes có * text=auto eol=lf và chạy git add --renormalize . trong một commit riêng',
              'Configure the Mac editor to save with CRLF so it matches the repository|||Chỉnh trình soạn thảo trên Mac lưu bằng CRLF để khớp với kho',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: ^M is the \\r of CRLF endings already stored in the repository. .gitattributes is committed, so the rule applies to every clone and overrides personal settings; --renormalize converts what is already stored, once. Per-machine core.autocrlf depends on everyone remembering (and true is the Windows setting, wrong on a Mac); hiding whitespace only hides the problem; saving CRLF on the Mac spreads it.|||VI: ^M chính là \\r của đuôi CRLF đang nằm sẵn trong kho. .gitattributes được commit, nên luật áp cho mọi bản clone và đè lên thiết lập cá nhân; --renormalize chuyển đổi những gì đã lưu, một lần. core.autocrlf theo từng máy phụ thuộc vào việc mọi người cùng nhớ (và true là thiết lập của Windows, sai trên Mac); ẩn khoảng trắng chỉ giấu vấn đề; lưu CRLF trên Mac thì lây lan nó.',
          },
          {
            question: 'Your Docker container exits with "exec ./entrypoint.sh: no such file or directory", yet ls inside the image shows entrypoint.sh right there. The script was last edited on a Windows laptop. What is the most likely cause?|||Container Docker của bạn thoát với lỗi "exec ./entrypoint.sh: no such file or directory", vậy mà ls bên trong image vẫn thấy entrypoint.sh nằm đó. Script được sửa lần cuối trên một laptop Windows. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The file is not executable (mode 100644)|||File không có quyền chạy (mode 100644)',
              'The script has CRLF endings, so its first line asks for an interpreter ending in \\r|||Script có đuôi CRLF, nên dòng đầu đòi một trình thông dịch có tên kết thúc bằng \\r',
              'Docker’s COPY is case-sensitive and the file was renamed|||Lệnh COPY của Docker phân biệt hoa/thường và file đã bị đổi tên',
              'A .dockerignore rule excluded the file from the build|||Một luật .dockerignore đã loại file khỏi bản build',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: With CRLF the shebang becomes #!/bin/sh\\r; the kernel looks for a program literally named "sh\\r", does not find it, and reports "no such file or directory" about the script. Check with git ls-files --eol entrypoint.sh (i/crlf) and fix with *.sh text eol=lf plus renormalize. A missing executable bit gives "permission denied", not this message; a case or .dockerignore problem would make ls fail to find the file.|||VI: Với CRLF, dòng shebang thành #!/bin/sh\\r; nhân hệ điều hành tìm một chương trình tên đúng là "sh\\r", không thấy, và báo "no such file or directory" về chính script. Kiểm bằng git ls-files --eol entrypoint.sh (i/crlf) và sửa bằng *.sh text eol=lf cộng renormalize. Thiếu quyền chạy thì báo "permission denied", không phải lỗi này; lỗi hoa/thường hay .dockerignore thì ls đã không thấy file.',
          },
          {
            question: 'On your Mac you renamed Header.tsx to header.tsx in Finder and changed the imports. git status shows nothing to commit, and the Linux CI fails with "Cannot find module “./header”". What do you do?|||Trên Mac bạn đổi tên Header.tsx thành header.tsx trong Finder và sửa các dòng import. git status báo không có gì để commit, còn CI Linux hỏng với lỗi "Cannot find module “./header”". Bạn làm gì?',
            options: [
              'Restore the old name, then git mv Header.tsx header.tsx and commit|||Trả lại tên cũ, rồi git mv Header.tsx header.tsx và commit',
              'Run git config core.ignorecase false so Git notices the rename|||Chạy git config core.ignorecase false để Git nhận ra lần đổi tên',
              'Run git add -A again, since the rename was not staged yet|||Chạy lại git add -A, vì lần đổi tên chưa được stage',
              'Clear the CI cache and node_modules, then re-run the pipeline|||Xoá cache CI và node_modules, rồi chạy lại pipeline',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: macOS is case-insensitive, so Git (core.ignorecase=true) sees no change and the repository still contains Header.tsx; Linux, being case-sensitive, has no header.tsx. git mv records the rename in the index: git status then shows R Header.tsx -> header.tsx. Setting core.ignorecase false on a case-insensitive disk makes Git see phantom duplicates; git add -A finds nothing to add; the CI cache is not the problem.|||VI: macOS không phân biệt hoa/thường, nên Git (core.ignorecase=true) không thấy thay đổi và kho vẫn chứa Header.tsx; Linux phân biệt hoa/thường nên không có header.tsx nào. git mv ghi lần đổi tên vào index: git status sau đó hiện R Header.tsx -> header.tsx. Đặt core.ignorecase false trên ổ đĩa không phân biệt hoa/thường khiến Git thấy các bản trùng ma; git add -A không tìm thấy gì để add; cache CI không phải là vấn đề.',
          },
        ],
      },
    },
  ],
};
