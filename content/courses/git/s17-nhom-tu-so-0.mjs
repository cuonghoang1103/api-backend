/**
 * Git & GitHub — Khởi động nhanh (MỚI 10/2026, đặt NGAY SAU Mục 0): Làm việc nhóm trên GitHub từ số 0 (Windows + Mac).
 * Viết từ chuyện THẬT 16–17/10/2026: nhóm PRJ301 của Cường (mentor, Mac) — Long (trưởng nhóm, GitHub `longbh2006`),
 * Khoa, Anh Tú (cả ba dùng Windows) — lần đầu đưa đồ án lên GitHub và vấp đúng những lỗi được kể trong chương.
 * KĐ.0 slide · KĐ.1 cài Git · KĐ.2 danh tính · KĐ.3 đăng nhập · KĐ.4 tạo repo · KĐ.5 mời · KĐ.6 clone ·
 * KĐ.7 một lần vs mỗi ngày · KĐ.8 lấy code của bạn · KĐ.9 lỗi thật · KĐ.10 nối CT Work · KĐ.11 kiểm tra.
 * Output git: CHẠY THẬT git 2.51.1 trong /tmp/kdsb2 (HOME tạm cho từng "người", GIT_CONFIG_NOSYSTEM=1 — không đụng
 * ~/.gitconfig, ~/.ssh, Keychain thật). "GitHub" là kho bare cục bộ nối qua url.insteadOf ⇒ chuỗi
 * "file:///tmp/kdsb2/gh/" được in lại thành "https://github.com/" và HOME tạm thành "~" (thay chuỗi, không sửa chữ khác).
 * Thông báo chỉ Windows / chỉ máy chủ GitHub mới in (GCM, 403, GH007, Filename too long, SSL, Repository not found…)
 * chép đúng dạng Git for Windows / GitHub in ra; nhãn giao diện GCM đối chiếu mã nguồn git-credential-manager,
 * lời nhắc gh đối chiếu mã nguồn cli/cli, menu GitHub đối chiếu docs.github.com (10/2026).
 * LUẬT: backtick → &#96;; ${ → \${; \ → \\; < > & trong code → &lt; &gt; &amp;. KHÔNG <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const D = 'git-17';
/** Thẻ liên kết tới một bài khác của khoá (mở tại chỗ). */
const LT = (slug, ico, title, sub) => '<a class="link-card" href="/courses/git/learn?lessonSlug=' + slug + '"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';
/** Thẻ liên kết ra ngoài. */
const LX = (href, ico, title, sub) => '<a class="link-card" href="' + href + '" target="_blank" rel="noopener"><span class="lc-ico">' + ico + '</span><span class="lc-body"><span class="lc-title">' + title + '</span><span class="lc-sub">' + sub + '</span></span></a>';

export default {
  title: 'Quick start — Team work on GitHub from zero (Windows + Mac)|||Khởi động nhanh — Làm việc nhóm trên GitHub từ số 0 (Windows + Mac)',
  description: 'Chương thực chiến cho nhóm đồ án mới lên GitHub lần đầu: cài Git trên Windows và Mac, đặt danh tính, đăng nhập, trưởng nhóm tạo repo và mời, thành viên clone, vòng lặp mỗi ngày theo thẻ việc, lấy code của bạn, 15+ lỗi thật và cách sửa, nối repo với CT Work — viết từ chuyện thật của một nhóm PRJ301.',
  lessons: [
    /* ─────────────────────────── KĐ.0 ─────────────────────────── */
    {
      title: 'KĐ.0 — Quick start slides: a team on GitHub from zero|||KĐ.0 — Slide Khởi động nhanh: cả nhóm lên GitHub từ số 0',
      slug: 'git-kd-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 35 slide của chương Khởi động nhanh: cài đặt, danh tính, đăng nhập, tạo repo, mời, clone, vòng lặp mỗi ngày, lỗi thật và CT Work — xem trước buổi ngồi cùng nhóm, hoặc mở ra tra khi gặp lỗi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Slides</span>
<h2>From a blank laptop to the team's first pull request, in 35 slides</h2>
<p class="lead">This chapter exists because of one real evening. On 16–17 October 2026 a PRJ301 team — Long (team leader, GitHub <code>longbh2006</code>), Khoa and Anh Tú on Windows, their mentor Cường on a Mac — put their project on GitHub for the first time and hit, one after another, every trap in these slides. None of the traps were hard. All of them were invisible until someone explained them.</p>
<p>Read the slides once before the team sits down together, then keep the two "real errors" slides (30–31) open while you work: when a command prints something red, look the first words up there. The slides are in Vietnamese; every command and every error message on them is exactly what Git prints. The last two slides are a cheat sheet and a 60-minute session the whole team does together.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Slide</span>
<h2>Từ máy trắng tới Pull Request đầu tiên của cả nhóm, trong 35 slide</h2>
<p class="lead">Chương này ra đời từ một buổi tối có thật. Ngày 16–17/10/2026, một nhóm PRJ301 — Long (trưởng nhóm, GitHub <code>longbh2006</code>), Khoa và Anh Tú dùng Windows, mentor Cường dùng Mac — lần đầu đưa đồ án lên GitHub, và lần lượt vấp đúng từng cái bẫy trong bộ slide này. Không cái bẫy nào khó. Cái nào cũng vô hình cho tới khi có người giải thích.</p>
<p>Đọc lướt bộ slide một lần trước khi cả nhóm ngồi lại với nhau, rồi để mở hai slide "bảng lỗi thật" (30–31) trong lúc làm: lệnh nào in ra chữ đỏ, tra mấy chữ đầu ở đó. Mọi lệnh và mọi thông báo lỗi trên slide là đúng nguyên văn Git in ra. Hai slide cuối là bảng tra nhanh và một buổi thực hành 60 phút cả nhóm làm cùng nhau.</p>
</div>
${gallery(D, [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Chuyện thật 16–17/10: bảy cái bẫy'], [4, 'Git Bash, CMD, PowerShell hay Terminal'],
  [5, 'Sáu màn hình đáng dừng lại trong trình cài Git for Windows'], [6, 'Mở terminal đúng thư mục'], [7, 'Email commit lấy từ GitHub'],
  [8, 'Lỗi key does not contain a section'], [9, 'Cấu hình một lần cho mỗi máy'], [10, 'Đăng nhập GitHub qua HTTPS'],
  [11, 'Cửa sổ Git Credential Manager'], [12, 'gh trên Windows và winpty'], [13, 'Push bị 403 vì nhớ tài khoản khác'],
  [14, 'Trưởng nhóm tạo repo — hai cách'], [15, 'README + git init = hai lịch sử'], [16, '.gitignore NetBeans/Maven và db.properties'],
  [17, 'Git không lưu thư mục rỗng'], [18, 'master hay main'], [19, 'Mời thành viên'], [20, 'Quyền của collaborator'],
  [21, 'Clone, đừng tải ZIP'], [22, 'Sau khi clone'], [23, 'Một lần hay mỗi ngày'], [24, 'Sổ chung, tờ nháp, thư viện'],
  [25, 'Vòng lặp của một thẻ việc'], [26, 'origin, -u, upstream'], [27, 'Lấy code của bạn vào nhánh mình'],
  [28, 'Pull rồi mà NetBeans vẫn cũ'], [29, 'Xung đột đầu tiên'], [30, 'Bảng lỗi thật (1/2)'], [31, 'Bảng lỗi thật (2/2)'],
  [32, 'Nối GitHub với CT Work'], [33, 'Mã thẻ trong tên nhánh, commit, PR'], [34, 'Bảng tra nhanh'], [35, 'Thực hành cả nhóm'],
])}
`,
    },

    /* ─────────────────────────── KĐ.1 ─────────────────────────── */
    {
      title: 'KĐ.1 — Install and check Git on Windows and Mac, and open the terminal in the right folder|||KĐ.1 — Cài và kiểm tra Git trên Windows và Mac, mở terminal đúng thư mục',
      slug: 'git-kd-1-kiem-tra-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cài Git for Windows với đúng sáu lựa chọn quan trọng, cài Git trên Mac bằng xcode-select hoặc Homebrew, phân biệt Git Bash / CMD / PowerShell / Terminal, và năm lệnh di chuyển (pwd, ls, dir, cd, mkdir) để luôn đứng đúng thư mục.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.1</span>
<h2>Before Git can help the team, every laptop must answer "git --version"</h2>
<p class="lead">Half of what went wrong on the PRJ301 team's first evening had nothing to do with Git itself: a command typed into the wrong window, a terminal opened in <code>C:\\Users\\Lenovo</code> instead of the project, a program that was never installed. This lesson removes that half. By the end, each of you — on Windows or Mac — has Git installed, knows which window to type into, and can always answer the question "where am I standing right now?".</p>
${slide(D, 3, 'Chuyện thật 16–17/10: bảy cái bẫy của một buổi tối')}

<h3>What you are installing (and what you are not)</h3>
<p><strong>Git</strong> is a program on your laptop. It keeps the history of a folder and can send that history to, and fetch it from, another copy. <strong>GitHub</strong> is a website that stores one shared copy for the team. You install Git; you only create an account on GitHub. A third thing, the <strong>GitHub CLI</strong> (<code>gh</code>), is an optional extra program — it is <em>not</em> part of Git, which is exactly why Khoa's <code>gh auth login</code> failed in KĐ.3. Mục 0 lesson 0.3 covers installation briefly; here we go through the screens that matter for a team.</p>

<h3>Windows: Git for Windows, six screens worth reading</h3>
${slide(D, 5, 'Sáu màn hình đáng dừng lại trong trình cài Git for Windows')}
<p>Download the installer from <code>git-scm.com/install/windows</code> (as of 10/2026 it offers Git for Windows 2.56.0(2), x64 and ARM64, plus a "portable" edition). The installer asks about fifteen questions. Pressing <strong>Next</strong> everywhere is almost fine; these six are where a team gets hurt:</p>
<table>
<thead><tr><th>Screen</th><th>Choose</th><th>Why it matters for the team</th></tr></thead>
<tbody>
<tr><td>Choosing the default editor used by Git</td><td>Visual Studio Code, or Nano</td><td>The default is Vim. The first merge commit opens it and a beginner cannot get out.</td></tr>
<tr><td>Adjusting the name of the initial branch in new repositories</td><td><strong>Override…</strong> and type <code>main</code></td><td>Otherwise new repositories start on <code>master</code> while GitHub uses <code>main</code> — Long's <code>invalid reference: main</code> (KĐ.4).</td></tr>
<tr><td>Adjusting your PATH environment</td><td>Git from the command line and also from 3rd-party software (the recommended one)</td><td>NetBeans, VS Code and PowerShell can only find <code>git</code> if it is on the PATH.</td></tr>
<tr><td>Choosing HTTPS transport backend</td><td>OpenSSL is fine at home; on a school network that inspects traffic, <strong>native Windows Secure Channel</strong></td><td>Avoids <code>SSL certificate problem</code> on campus Wi-Fi (KĐ.9). Changeable later with one command.</td></tr>
<tr><td>Configuring the line ending conversions</td><td>Checkout Windows-style, commit Unix-style line endings</td><td>Equals <code>core.autocrlf true</code>; keeps Windows and Mac teammates from rewriting every line (Chapter 14.4).</td></tr>
<tr><td>Choose a credential helper</td><td>Git Credential Manager</td><td>This is what pops up "Sign in with your browser" on your first push (KĐ.3).</td></tr>
</tbody>
</table>
<p>If a later screen offers <strong>Enable experimental support for pseudo consoles</strong>, ticking it makes interactive programs such as <code>gh auth login</code> work inside Git Bash. You can also install from PowerShell with <code>winget install --id Git.Git -e --source winget</code>; git-scm.com notes that this package is not maintained by the Git for Windows project itself and may lag a version behind.</p>

<h3>Mac: two ways, both one command</h3>
<pre><code class="language-bash"><span class="tok-comment"># Way 1 — Apple's Command Line Tools (a dialog asks you to confirm, ~5 minutes)</span>
xcode-select --install

<span class="tok-comment"># Way 2 — Homebrew, if you already use it (newer Git than Apple's)</span>
brew install git</code></pre>
<p>On a fresh Mac, simply typing <code>git</code> also opens the "command line developer tools" dialog. Either way is enough for this course. If after a macOS upgrade <code>git</code> suddenly prints <code>xcrun: error: invalid active developer path</code>, run <code>xcode-select --install</code> again — the upgrade removed the tools, not your projects.</p>

<h3>Check: the same command everywhere</h3>
<pre><code class="language-bash">git --version</code></pre>
<div class="out">git version 2.51.1</div>
<p>That is the Mac (Homebrew) answer on Cường's machine. On Windows the number ends with <code>.windows.N</code>, for example <code>git version 2.56.0.windows.2</code>; Apple's own build adds <code>(Apple Git-…)</code>. Any version from 2.30 up is fine. If you see <code>'git' is not recognized as an internal or external command, operable program or batch file.</code> (CMD) or <code>bash: git: command not found</code>, either Git is not installed or the window was opened <em>before</em> the installation finished — close it and open a new one.</p>

<h3>Which window do I type into?</h3>
${slide(D, 4, 'Git Bash, CMD, PowerShell hay Terminal')}
<p>A Windows laptop has three command windows, and they do not speak the same language. <strong>Git Bash</strong> (installed with Git) understands the same commands as the Mac Terminal, so every command in this course runs in it word for word. <strong>CMD</strong> does not know <code>ls</code>, <code>pwd</code>, <code>~</code> or paths like <code>/c/Code</code>. <strong>PowerShell</strong> knows most of them as aliases but differs in details. Rule for the team: <strong>Windows → Git Bash, Mac → Terminal</strong>. The one exception is <code>gh auth login</code>, whose arrow-key menus can freeze in Git Bash (KĐ.3).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Git Bash path</span><span class="v"><code>/c/Code/prj301-nhom</code> — drive letter becomes a folder, slashes go forward.</span></div>
  <div class="kv"><span class="k">CMD / PowerShell path</span><span class="v"><code>C:\\Code\\prj301-nhom</code> — the same folder, written the Windows way.</span></div>
  <div class="kv"><span class="k">Mac path</span><span class="v"><code>~/Code/prj301-nhom</code> — <code>~</code> means your home folder, <code>/Users/&lt;you&gt;</code>.</span></div>
</div>

<h3>Five commands to always know where you are</h3>
${slide(D, 6, 'Mở terminal đúng thư mục')}
<pre><code class="language-bash">pwd                  <span class="tok-comment"># print working directory — where am I?</span>
ls                   <span class="tok-comment"># what is here? (CMD: dir)   ls -a also shows hidden .git</span>
cd /c/Code           <span class="tok-comment"># go into a folder (Mac: cd ~/Code)</span>
cd ..                <span class="tok-comment"># go up one level</span>
mkdir -p /c/Code     <span class="tok-comment"># create the folder if missing (Mac: mkdir -p ~/Code)</span></code></pre>
<p>Git commands act on the repository <em>you are standing in</em>. Typing <code>git pull</code> while standing in <code>C:\\Users\\Lenovo</code> does not update the project in <code>C:\\Code</code>; it fails, or worse, acts on some other folder. That is why every lesson after this one starts with <code>cd</code>. Two ways to skip the typing:</p>
<ul>
<li><strong>Windows:</strong> open the folder in File Explorer, right-click on empty space <em>inside</em> it → (Windows 11: <strong>Show more options</strong>) → <strong>Open Git Bash here</strong>. The window starts in that folder.</li>
<li><strong>Mac:</strong> type <code>cd </code> (with a space) in Terminal, drag the folder from Finder into the window, press Enter.</li>
</ul>
<div class="callout warn"><strong>Where to keep code:</strong> make one folder <code>C:\\Code</code> (Windows) or <code>~/Code</code> (Mac) and clone every project into it. Avoid <code>Desktop</code> and <code>Documents</code> when OneDrive or iCloud syncs them: the sync client locks files while Git is writing, keeps "online-only" placeholders that NetBeans cannot open, and adds to path length. Tú's first clone landed in <code>C:\\Users\\Lenovo</code> simply because that is where Git Bash opens by default — it worked, but nobody could find it later.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Run <code>git --version</code>. Windows: in Git Bash. Mac: in Terminal. Write the version in the team chat.</li><li>Create your code folder: <code>mkdir -p /c/Code</code> (Windows Git Bash) or <code>mkdir -p ~/Code</code> (Mac), then <code>cd</code> into it and run <code>pwd</code>.</li><li>Run <code>git status</code> there. It must fail with <code>not a git repository</code> — this folder is a shelf for projects, not a project.</li><li>Close the window. Open the same folder again the fast way (Open Git Bash here / drag into Terminal) and confirm with <code>pwd</code>.</li><li>Windows only: open CMD, type <code>ls</code>, read the error, close CMD. You now know what the wrong window looks like.</li></ol>
<pre><code class="language-bash">pwd
/c/Code
git status
fatal: not a git repository (or any of the parent directories): .git</code></pre>
<p><strong>Done when:</strong> everyone on the team has posted a <code>git --version</code> of 2.30 or newer, and <code>pwd</code> in a freshly opened window prints <code>/c/Code</code> or <code>/Users/&lt;you&gt;/Code</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Git for Windows</span><span class="v">The Windows installer of Git; it also brings Git Bash and Git Credential Manager.</span></div>
  <div class="kv"><span class="k">Git Bash</span><span class="v">A terminal for Windows that understands the same commands as Mac/Linux.</span></div>
  <div class="kv"><span class="k">PATH</span><span class="v">The list of folders Windows searches for programs; Git must be on it for NetBeans to find it.</span></div>
  <div class="kv"><span class="k">Working directory</span><span class="v">The folder your terminal is standing in; <code>pwd</code> prints it.</span></div>
  <div class="kv"><span class="k">Command Line Tools</span><span class="v">Apple's developer tools package that contains Git on a Mac.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Install Git for Windows with VS Code/Nano as editor, <code>main</code> as initial branch, the recommended PATH and Git Credential Manager.</li><li>On a Mac, <code>xcode-select --install</code> or <code>brew install git</code> is enough.</li><li><code>git --version</code> ≥ 2.30 on every laptop before anything else.</li><li>Windows types into Git Bash, Mac into Terminal; CMD does not understand the course's commands.</li><li>Keep projects in <code>C:\\Code</code> / <code>~/Code</code> and check <code>pwd</code> before every Git command.</li></ul>

${LX('https://git-scm.com/install/windows', '⬇️', 'git-scm.com — Install Git on Windows', 'The official installer, current version and the winget command.')}
${LX('https://git-scm.com/install/mac', '🍎', 'git-scm.com — Install Git on macOS', 'Homebrew, MacPorts and Apple’s Command Line Tools.')}
${LT('git-0-3-cai-dat-cau-hinh', '↩️', 'Lesson 0.3 — Installation and configuration', 'The general install, three config levels and an SSH key.')}

<div class="pitfall co-tieu-de"><strong>The classic first-evening mistake.</strong> Installing Git, leaving the old Git Bash or NetBeans window open, and concluding "Git doesn't work" when it says <code>command not found</code>. A program's PATH is read when the window starts. After installing anything — Git, <code>gh</code>, a JDK — close every terminal and the IDE, then open them again.</div>
<p class="note-ct"><strong>For the team leader:</strong> do this lesson on a video call with everyone sharing their screen. Ten minutes of watching four <code>git --version</code> answers saves an hour of debugging a teammate who was typing into CMD all along.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.1</span>
<h2>Trước khi Git giúp được cả nhóm, máy nào cũng phải trả lời được "git --version"</h2>
<p class="lead">Một nửa số thứ hỏng trong buổi tối đầu tiên của nhóm PRJ301 chẳng dính gì tới Git: gõ lệnh nhầm cửa sổ, terminal mở ở <code>C:\\Users\\Lenovo</code> thay vì thư mục dự án, một chương trình chưa từng được cài. Bài này dọn sạch nửa đó. Học xong, mỗi bạn — dù Windows hay Mac — đã cài Git, biết gõ lệnh vào cửa sổ nào, và luôn trả lời được câu "mình đang đứng ở đâu?".</p>
${slide(D, 3, 'Chuyện thật 16–17/10: bảy cái bẫy của một buổi tối')}

<h3>Bạn đang cài cái gì (và không cài cái gì)</h3>
<p><strong>Git</strong> là một chương trình trên laptop của bạn. Nó giữ lịch sử của một thư mục, và gửi lịch sử đó tới / lấy về từ một bản sao khác. <strong>GitHub</strong> là một trang web giữ MỘT bản sao chung cho cả nhóm. Git thì phải cài; GitHub thì chỉ cần tạo tài khoản. Thứ ba là <strong>GitHub CLI</strong> (<code>gh</code> — công cụ dòng lệnh của GitHub), một chương trình phụ, tuỳ chọn — nó <em>không</em> nằm trong Git, và đó chính là lý do <code>gh auth login</code> của Khoa không chạy (KĐ.3). Bài 0.3 ở Mục 0 nói gọn phần cài đặt; ở đây ta đi qua đúng những màn hình quan trọng với một nhóm.</p>

<h3>Windows: Git for Windows, sáu màn hình đáng đọc</h3>
${slide(D, 5, 'Sáu màn hình đáng dừng lại trong trình cài Git for Windows')}
<p>Tải bộ cài ở <code>git-scm.com/install/windows</code> (tính đến 10/2026 là Git for Windows 2.56.0(2), có bản x64 và ARM64, cùng một bản "portable" — chạy không cần cài). Trình cài hỏi khoảng mười lăm câu. Bấm <strong>Next</strong> liên tục gần như ổn; sáu màn hình dưới đây là chỗ một nhóm hay bị đau:</p>
<table>
<thead><tr><th>Màn hình</th><th>Chọn</th><th>Vì sao quan trọng với nhóm</th></tr></thead>
<tbody>
<tr><td>Choosing the default editor used by Git (trình soạn thảo mặc định)</td><td>Visual Studio Code, hoặc Nano</td><td>Mặc định là Vim. Commit merge đầu tiên sẽ mở Vim và người mới không biết cách thoát.</td></tr>
<tr><td>Adjusting the name of the initial branch (tên nhánh đầu tiên)</td><td><strong>Override…</strong> rồi gõ <code>main</code></td><td>Không thì kho mới bắt đầu ở <code>master</code> trong khi GitHub dùng <code>main</code> — đúng lỗi <code>invalid reference: main</code> của Long (KĐ.4).</td></tr>
<tr><td>Adjusting your PATH environment (biến PATH)</td><td>Git from the command line and also from 3rd-party software (dòng được khuyến nghị)</td><td>NetBeans, VS Code và PowerShell chỉ tìm thấy <code>git</code> khi nó nằm trong PATH.</td></tr>
<tr><td>Choosing HTTPS transport backend (thư viện HTTPS)</td><td>Ở nhà để OpenSSL; mạng trường có soi gói tin thì chọn <strong>native Windows Secure Channel</strong></td><td>Tránh lỗi <code>SSL certificate problem</code> trên Wi-Fi trường (KĐ.9). Đổi lại sau bằng một lệnh cũng được.</td></tr>
<tr><td>Configuring the line ending conversions (ký tự xuống dòng)</td><td>Checkout Windows-style, commit Unix-style line endings</td><td>Tương đương <code>core.autocrlf true</code>; giữ cho bạn Windows và bạn Mac không "sửa" lại mọi dòng của nhau (Chương 14.4).</td></tr>
<tr><td>Choose a credential helper (trình giữ đăng nhập)</td><td>Git Credential Manager</td><td>Chính nó bật cửa sổ "Sign in with your browser" ở lần push đầu (KĐ.3).</td></tr>
</tbody>
</table>
<p>Nếu một màn hình sau có ô <strong>Enable experimental support for pseudo consoles</strong>, tích nó giúp những chương trình có menu tương tác như <code>gh auth login</code> chạy được trong Git Bash. Bạn cũng có thể cài từ PowerShell bằng <code>winget install --id Git.Git -e --source winget</code>; git-scm.com ghi rõ gói winget này không do chính dự án Git for Windows bảo trì nên có thể chậm một phiên bản.</p>

<h3>Mac: hai cách, cách nào cũng một lệnh</h3>
<pre><code class="language-bash"><span class="tok-comment"># Cách 1 — Command Line Tools của Apple (hiện hộp thoại xác nhận, ~5 phút)</span>
xcode-select --install

<span class="tok-comment"># Cách 2 — Homebrew, nếu máy đã có (Git mới hơn bản của Apple)</span>
brew install git</code></pre>
<p>Trên Mac mới tinh, chỉ cần gõ <code>git</code> là máy cũng mở hộp thoại cài "command line developer tools". Cách nào cũng đủ cho khoá này. Nếu sau khi nâng cấp macOS mà <code>git</code> bỗng in <code>xcrun: error: invalid active developer path</code>, chạy lại <code>xcode-select --install</code> — bản nâng cấp gỡ bộ công cụ, không đụng tới dự án của bạn.</p>

<h3>Kiểm tra: cùng một lệnh ở mọi máy</h3>
<pre><code class="language-bash">git --version</code></pre>
<div class="out">git version 2.51.1</div>
<p>Đó là câu trả lời trên máy Mac (Homebrew) của Cường. Trên Windows con số có đuôi <code>.windows.N</code>, ví dụ <code>git version 2.56.0.windows.2</code>; bản của Apple thì thêm <code>(Apple Git-…)</code>. Từ 2.30 trở lên là đủ. Nếu thấy <code>'git' is not recognized as an internal or external command, operable program or batch file.</code> (trong CMD) hoặc <code>bash: git: command not found</code>, thì hoặc Git chưa được cài, hoặc cửa sổ đã mở <em>trước</em> khi cài xong — đóng nó, mở cửa sổ mới.</p>

<h3>Gõ lệnh vào cửa sổ nào?</h3>
${slide(D, 4, 'Git Bash, CMD, PowerShell hay Terminal')}
<p>Một máy Windows có ba cửa sổ lệnh, và chúng không nói cùng một thứ tiếng. <strong>Git Bash</strong> (cài cùng Git) hiểu đúng những lệnh mà Terminal của Mac hiểu, nên mọi lệnh trong khoá chạy nguyên văn trong nó. <strong>CMD</strong> không biết <code>ls</code>, <code>pwd</code>, <code>~</code> hay đường dẫn kiểu <code>/c/Code</code>. <strong>PowerShell</strong> biết phần lớn qua bí danh (alias) nhưng khác ở chi tiết. Luật của nhóm: <strong>Windows → Git Bash, Mac → Terminal</strong>. Ngoại lệ duy nhất là <code>gh auth login</code>, vì menu chọn bằng phím mũi tên của nó có thể đứng im trong Git Bash (KĐ.3).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Đường dẫn Git Bash</span><span class="v"><code>/c/Code/prj301-nhom</code> — ổ đĩa thành một thư mục, gạch chéo xuôi.</span></div>
  <div class="kv"><span class="k">Đường dẫn CMD / PowerShell</span><span class="v"><code>C:\\Code\\prj301-nhom</code> — cùng thư mục đó, viết kiểu Windows.</span></div>
  <div class="kv"><span class="k">Đường dẫn Mac</span><span class="v"><code>~/Code/prj301-nhom</code> — <code>~</code> là thư mục nhà của bạn, <code>/Users/&lt;tên-bạn&gt;</code>.</span></div>
</div>

<h3>Năm lệnh để luôn biết mình đang ở đâu</h3>
${slide(D, 6, 'Mở terminal đúng thư mục')}
<pre><code class="language-bash">pwd                  <span class="tok-comment"># print working directory — mình đang ở đâu?</span>
ls                   <span class="tok-comment"># ở đây có gì? (CMD: dir)   ls -a hiện cả thư mục ẩn .git</span>
cd /c/Code           <span class="tok-comment"># đi vào một thư mục (Mac: cd ~/Code)</span>
cd ..                <span class="tok-comment"># lùi ra một cấp</span>
mkdir -p /c/Code     <span class="tok-comment"># tạo thư mục nếu chưa có (Mac: mkdir -p ~/Code)</span></code></pre>
<p>Lệnh git tác động lên kho mã <em>mà bạn đang đứng bên trong</em>. Gõ <code>git pull</code> khi đang đứng ở <code>C:\\Users\\Lenovo</code> thì không cập nhật được dự án nằm ở <code>C:\\Code</code>; nó báo lỗi, hoặc tệ hơn, chạy trên một thư mục khác. Vì thế mọi bài sau bài này đều mở đầu bằng <code>cd</code>. Hai cách khỏi phải gõ đường dẫn:</p>
<ul>
<li><strong>Windows:</strong> mở thư mục trong File Explorer, chuột phải vào chỗ trống <em>bên trong</em> nó → (Windows 11: <strong>Show more options</strong>) → <strong>Open Git Bash here</strong>. Cửa sổ mở ra đã đứng sẵn ở đó.</li>
<li><strong>Mac:</strong> gõ <code>cd </code> (có dấu cách) trong Terminal, kéo thư mục từ Finder thả vào cửa sổ, nhấn Enter.</li>
</ul>
<div class="callout warn"><strong>Để code ở đâu:</strong> tạo một thư mục <code>C:\\Code</code> (Windows) hoặc <code>~/Code</code> (Mac) và clone mọi dự án vào đó. Tránh <code>Desktop</code> và <code>Documents</code> khi OneDrive hay iCloud đang đồng bộ chúng: trình đồng bộ khoá file đúng lúc Git đang ghi, để lại file "chỉ có trên mạng" mà NetBeans không mở được, và làm đường dẫn dài thêm. Bản clone đầu tiên của Tú rơi vào <code>C:\\Users\\Lenovo</code> chỉ vì Git Bash mặc định mở ở đó — vẫn chạy, nhưng sau đó không ai tìm ra.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Chạy <code>git --version</code>. Windows: trong Git Bash. Mac: trong Terminal. Gửi con số vào nhóm chat.</li><li>Tạo thư mục code: <code>mkdir -p /c/Code</code> (Git Bash trên Windows) hoặc <code>mkdir -p ~/Code</code> (Mac), rồi <code>cd</code> vào đó và chạy <code>pwd</code>.</li><li>Chạy <code>git status</code> ở đó. Nó PHẢI báo lỗi <code>not a git repository</code> — thư mục này là cái kệ để dự án, chưa phải một dự án.</li><li>Đóng cửa sổ. Mở lại đúng thư mục đó bằng cách nhanh (Open Git Bash here / kéo thả vào Terminal) và xác nhận bằng <code>pwd</code>.</li><li>Riêng Windows: mở CMD, gõ <code>ls</code>, đọc lỗi, đóng CMD. Giờ bạn biết "nhầm cửa sổ" trông thế nào.</li></ol>
<pre><code class="language-bash">pwd
/c/Code
git status
fatal: not a git repository (or any of the parent directories): .git</code></pre>
<p><strong>Đạt khi:</strong> cả nhóm đã gửi <code>git --version</code> từ 2.30 trở lên, và <code>pwd</code> trong một cửa sổ vừa mở in ra <code>/c/Code</code> hoặc <code>/Users/&lt;tên-bạn&gt;/Code</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Git for Windows</span><span class="v">Bộ cài Git cho Windows — cài kèm luôn Git Bash và Git Credential Manager.</span></div>
  <div class="kv"><span class="k">Git Bash</span><span class="v">Cửa sổ lệnh trên Windows hiểu đúng các lệnh của Mac/Linux.</span></div>
  <div class="kv"><span class="k">PATH</span><span class="v">Biến đường dẫn — danh sách thư mục Windows tìm chương trình; thiếu Git trong đó thì NetBeans không thấy git.</span></div>
  <div class="kv"><span class="k">Working directory</span><span class="v">Thư mục hiện hành — chỗ terminal đang đứng; <code>pwd</code> in nó ra.</span></div>
  <div class="kv"><span class="k">Command Line Tools</span><span class="v">Bộ công cụ dòng lệnh của Apple — gói chứa Git trên Mac.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cài Git for Windows với editor VS Code/Nano, nhánh đầu tên <code>main</code>, PATH được khuyến nghị và Git Credential Manager.</li><li>Trên Mac, <code>xcode-select --install</code> hoặc <code>brew install git</code> là đủ.</li><li>Máy nào cũng phải có <code>git --version</code> ≥ 2.30 trước khi làm gì khác.</li><li>Windows gõ vào Git Bash, Mac gõ vào Terminal; CMD không hiểu lệnh trong khoá.</li><li>Để dự án ở <code>C:\\Code</code> / <code>~/Code</code> và nhìn <code>pwd</code> trước mỗi lệnh git.</li></ul>

${LX('https://git-scm.com/install/windows', '⬇️', 'git-scm.com — Cài Git trên Windows', 'Bộ cài chính thức, phiên bản hiện hành và lệnh winget.')}
${LX('https://git-scm.com/install/mac', '🍎', 'git-scm.com — Cài Git trên macOS', 'Homebrew, MacPorts và Command Line Tools của Apple.')}
${LT('git-0-3-cai-dat-cau-hinh', '↩️', 'Bài 0.3 — Cài đặt và cấu hình', 'Phần cài chung, ba mức cấu hình và khoá SSH.')}

<div class="pitfall co-tieu-de"><strong>Lỗi kinh điển của buổi tối đầu tiên.</strong> Cài Git xong, để nguyên cửa sổ Git Bash hay NetBeans cũ đang mở, thấy <code>command not found</code> rồi kết luận "Git hỏng". PATH của một chương trình được đọc lúc cửa sổ khởi động. Cài bất cứ thứ gì — Git, <code>gh</code>, JDK — xong thì đóng hết terminal và IDE, rồi mở lại.</div>
<p class="note-ct"><strong>Dành cho trưởng nhóm:</strong> làm bài này trong một cuộc gọi video, mọi người chia sẻ màn hình. Mười phút nhìn bốn câu trả lời <code>git --version</code> tiết kiệm một giờ gỡ lỗi cho một bạn hoá ra nãy giờ toàn gõ vào CMD.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.2 ─────────────────────────── */
    {
      title: 'KĐ.2 — Your identity: user.name, user.email and the settings you set once per machine|||KĐ.2 — Danh tính: user.name, user.email và những cài đặt làm một lần cho mỗi máy',
      slug: 'git-kd-2-danh-tinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đặt tên và email đúng cách (email lấy từ GitHub Settings → Emails, địa chỉ noreply, lỗi GH007), hiểu vì sao "git config --global longbh2006" báo key does not contain a section, và năm cài đặt một lần cho mỗi máy Windows/Mac.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.2</span>
<h2>Git writes a name and an email on every commit — make them the right ones</h2>
<p class="lead">The first command Long typed after installing Git was <code>git config --global longbh2006</code>, and Git answered <code>error: key does not contain a section: longbh2006</code>. He had mixed up two different things: his GitHub <em>username</em>, which is how he logs in, and his commit <em>identity</em>, which is a display name plus an email written into every commit forever. This lesson separates them and sets up, once per machine, everything Git needs before the first commit.</p>

<h3>Identity is not login</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user.name</span><span class="v">A display name printed on each commit, e.g. <code>Bui Hoang Long</code>. Any text; GitHub does not check it.</span></div>
  <div class="kv"><span class="k">user.email</span><span class="v">The email printed on each commit. GitHub uses <em>this</em> to link the commit to your account (avatar, contribution graph, CT Work's Contributions).</span></div>
  <div class="kv"><span class="k">GitHub username + login</span><span class="v"><code>longbh2006</code> plus a browser sign-in. Used only when you push or pull — that is KĐ.3, not <code>git config</code>.</span></div>
</div>

<h3>Why "key does not contain a section"</h3>
${slide(D, 8, 'Lỗi key does not contain a section')}
<p><code>git config</code> always takes a <em>key</em> and a <em>value</em>. A key has two parts joined by a dot: <code>section.name</code>, such as <code>user.name</code> or <code>core.autocrlf</code>. Long gave only one word, so Git read <code>longbh2006</code> as a key and could not find the dot. The variant with a space instead of a dot fails the same way:</p>
<pre><code class="language-bash">git config --global longbh2006
git config --global user name <span class="tok-string">"Bui Hoang Long"</span></code></pre>
<div class="out">error: key does not contain a section: longbh2006
error: key does not contain a section: user</div>
<p>The correct form — identical in Git Bash and Mac Terminal — has the dot, and quotes because the name contains spaces:</p>
<pre><code class="language-bash">git config --global user.name <span class="tok-string">"Bui Hoang Long"</span>
git config --global user.name          <span class="tok-comment"># no value = read it back</span></code></pre>
<div class="out">Bui Hoang Long</div>

<h3>Where the email comes from: GitHub → Settings → Emails</h3>
${slide(D, 7, 'Email commit lấy từ GitHub Settings → Emails')}
<p>Do not invent an email and do not use your school one by habit. Open GitHub, click your avatar → <strong>Settings</strong> → <strong>Emails</strong>. You will see:</p>
<ol>
<li>Your primary email (the Gmail you signed up with).</li>
<li>A checkbox <strong>Keep my email addresses private</strong>. When ticked, GitHub shows you a private address of the form <code>ID+USERNAME@users.noreply.github.com</code> — for an account created after July 2017 the ID is a number, e.g. <code>12345678+longbh2006@users.noreply.github.com</code>.</li>
<li>A checkbox <strong>Block command line pushes that expose my email</strong>.</li>
</ol>
<p>Copy the noreply address <em>exactly</em> from that page and use it in Git. It still links every commit to your account, but your Gmail never appears in the project history that the lecturer, teammates and anyone with access will read.</p>
<pre><code class="language-bash">git config --global user.email <span class="tok-string">"12345678+longbh2006@users.noreply.github.com"</span></code></pre>
<div class="callout warn"><strong>GH007.</strong> If "Block command line pushes" is on and a commit still carries your private Gmail, GitHub refuses the whole push:
<div class="out">remote: error: GH007: Your push would publish a private email address.
remote: You can make your email public or disable this protection by visiting:
remote: https://github.com/settings/emails
 ! [remote rejected] main -&gt; main (push declined due to email privacy restrictions)
error: failed to push some refs to 'https://github.com/longbh2006/prj301-nhom.git'</div>
Fixing the config is not enough — the commit already has the old email in it. For your last commit, set the noreply email and rewrite just that commit with <code>--reset-author</code> (KĐ.9 shows it on real output).</div>

<h3>The settings to make once per machine</h3>
${slide(D, 9, 'Cấu hình một lần cho mỗi máy — Windows và Mac')}
<p>These go into your <em>global</em> config file (<code>C:\\Users\\&lt;you&gt;\\.gitconfig</code> on Windows, <code>~/.gitconfig</code> on Mac), so they apply to every project on that laptop. You run them once; on a new laptop, once again.</p>
<pre><code class="language-bash"><span class="tok-comment"># Both systems</span>
git config --global user.name  <span class="tok-string">"Nguyen Dang Khoa"</span>
git config --global user.email <span class="tok-string">"23456789+khoa-nd@users.noreply.github.com"</span>
git config --global init.defaultBranch main
git config --global pull.rebase false

<span class="tok-comment"># Windows (Git Bash) only</span>
git config --global core.autocrlf true
git config --global core.longpaths true

<span class="tok-comment"># Mac only</span>
git config --global core.autocrlf input</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">init.defaultBranch main</span><span class="v">New repositories start on <code>main</code>, the same name GitHub uses. Without it you get a long hint and a <code>master</code> branch.</span></div>
  <div class="kv"><span class="k">pull.rebase false</span><span class="v"><code>git pull</code> = fetch + merge. Without any choice, modern Git stops at the first divergence with <code>fatal: Need to specify how to reconcile divergent branches.</code></span></div>
  <div class="kv"><span class="k">core.autocrlf</span><span class="v">Windows <code>true</code>, Mac <code>input</code>: the repository always stores LF line endings, each laptop sees its own. Deep dive: Chapter 14.4.</span></div>
  <div class="kv"><span class="k">core.longpaths true</span><span class="v">Windows only: lets Git create files whose full path is over 260 characters — common with deep Java packages.</span></div>
</div>
<p>Check what you set. On Cường's Mac (sandbox, real output):</p>
<pre><code class="language-bash">git config --global --list</code></pre>
<div class="out">user.name=Hoang Cuong
user.email=hoangcuong@example.com
init.defaultbranch=main
core.autocrlf=input
pull.rebase=false</div>
<p>Notice the email: this is the "before" state — a made-up address. When a value seems wrong, ask where it comes from with <code>--show-origin</code>:</p>
<pre><code class="language-bash">git config --list --show-origin</code></pre>
<div class="out">file:/Users/cuong/.gitconfig	user.name=Hoang Cuong
file:/Users/cuong/.gitconfig	user.email=hoangcuong@example.com
file:/Users/cuong/.gitconfig	init.defaultbranch=main
file:/Users/cuong/.gitconfig	core.autocrlf=input
file:/Users/cuong/.gitconfig	pull.rebase=false</div>
<p>On Windows the list is longer, because the installer wrote its answers into a <em>system</em> file. An excerpt of what Git for Windows prints:</p>
<div class="out">file:C:/Program Files/Git/etc/gitconfig	core.autocrlf=true
file:C:/Program Files/Git/etc/gitconfig	credential.helper=manager
file:C:/Program Files/Git/etc/gitconfig	pull.rebase=false
file:C:/Users/Lenovo/.gitconfig	user.name=Nguyen Dang Khoa
file:C:/Users/Lenovo/.gitconfig	user.email=23456789+khoa-nd@users.noreply.github.com</div>
<p>Those system lines are why a Windows teammate may already have <code>core.autocrlf=true</code> without ever typing it. Setting it again globally does no harm.</p>

<h3>Checking a real commit</h3>
<p>The config is a promise; the commit is the proof. After your first commit, look at what was actually recorded:</p>
<pre><code class="language-bash">git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">05f1989 Hoang Cuong &lt;hoangcuong@example.com&gt;</div>
<p>Wrong email in the last, not-yet-pushed commit? Fix the config, then rewrite that one commit's author:</p>
<pre><code class="language-bash">git config --global user.email <span class="tok-string">"45678901+cuonghoang1103@users.noreply.github.com"</span>
git commit --amend --reset-author --no-edit
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">[main 801dcf9] thử danh tính
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
801dcf9 Hoang Cuong &lt;45678901+cuonghoang1103@users.noreply.github.com&gt;</div>
<p>The hash changed (05f1989 → 801dcf9) because the author is part of the commit's content. That is fine before pushing. After pushing to a shared branch, ask the team first (Chapter 8).</p>
<div class="callout ok"><strong>One project, different email?</strong> Run the same command <em>without</em> <code>--global</code> inside that repository, e.g. <code>git config user.email "you@fpt.edu.vn"</code>. Local config beats global for that repository only (lesson 0.3, Chapter 14.3).</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>On GitHub: Settings → Emails, tick <strong>Keep my email addresses private</strong>, copy your noreply address.</li><li>In Git Bash / Terminal, reproduce Long's mistake once on purpose: <code>git config --global yourusername</code>. Read the error.</li><li>Run the block of once-per-machine settings above for <em>your</em> system, with your name and noreply email.</li><li>Run <code>git config --global --list</code> and post the output (it contains no secret) in the team chat; each member checks one other member's email ends in <code>users.noreply.github.com</code>.</li><li>In <code>~/Code</code> make a throwaway repo (<code>git init thu-danh-tinh</code>, one file, one commit) and check it with <code>git log -1 --format="%an &lt;%ae&gt;"</code>.</li></ol>
<p><strong>Done when:</strong> <code>git config --global --list</code> shows <code>user.name</code>, a <code>…@users.noreply.github.com</code> email, <code>init.defaultbranch=main</code>, <code>pull.rebase=false</code> and the right <code>core.autocrlf</code> for your OS, and the test commit shows the same email.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Config key</span><span class="v">A setting name of the form <code>section.name</code>, e.g. <code>user.email</code>.</span></div>
  <div class="kv"><span class="k">--global</span><span class="v">Write to your personal config file: this user, every repository on this machine.</span></div>
  <div class="kv"><span class="k">noreply email</span><span class="v">A private address GitHub gives you (<code>ID+username@users.noreply.github.com</code>) that still links commits to your account.</span></div>
  <div class="kv"><span class="k">GH007</span><span class="v">GitHub's refusal of a push whose commits would publish your private email.</span></div>
  <div class="kv"><span class="k">--reset-author</span><span class="v">With <code>git commit --amend</code>: re-stamp the last commit with your current name/email.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Identity (name + email on commits) and login (username + browser sign-in) are separate.</li><li>A config key always has a dot: <code>user.name</code>, never a bare username.</li><li>Take the email from GitHub → Settings → Emails; prefer the noreply address.</li><li>Once per machine: name, email, <code>init.defaultBranch main</code>, <code>pull.rebase false</code>, <code>core.autocrlf</code> (Windows true / Mac input), <code>core.longpaths</code> on Windows.</li><li>Verify on a real commit with <code>git log -1 --format="%an &lt;%ae&gt;"</code>.</li></ul>

${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address', '✉️', 'GitHub Docs — Setting your commit email address', 'Where the noreply address is and how commits are linked to your account.')}
${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/blocking-command-line-pushes-that-expose-your-personal-email-address', '🛡️', 'GitHub Docs — Blocking pushes that expose your email', 'The setting behind GH007.')}
${LT('git-14-4-windows-crlf', '↔️', 'Lesson 14.4 — Working with Windows teammates', 'CRLF/LF, core.autocrlf and .gitattributes in depth.')}

<div class="pitfall co-tieu-de"><strong>The silent version of this mistake.</strong> Two teammates copy the same command from the group chat and both set <code>user.email</code> to the team leader's address. Nothing fails; every commit is simply credited to the leader, and at the end of the term the Contributions report says one person wrote everything. Each person types their <em>own</em> email, then checks with <code>git log -1 --format="%an &lt;%ae&gt;"</code>.</div>
<p class="note-ct"><strong>Remember the layers:</strong> what you set here is per machine and survives every project. Change laptop or reinstall Windows, and you do this lesson again — nothing else in the project needs to change.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.2</span>
<h2>Git ghi một cái tên và một email lên mọi commit — hãy để đó là cái đúng</h2>
<p class="lead">Lệnh đầu tiên Long gõ sau khi cài Git là <code>git config --global longbh2006</code>, và Git trả lời <code>error: key does not contain a section: longbh2006</code>. Long đã trộn hai thứ khác nhau: <em>username</em> GitHub, thứ dùng để đăng nhập, và <em>danh tính</em> commit (commit identity), tức một tên hiển thị cộng một email được ghi vĩnh viễn vào mỗi commit. Bài này tách hai thứ đó ra, và cài một lần cho mỗi máy mọi thứ Git cần trước commit đầu tiên.</p>

<h3>Danh tính không phải là đăng nhập</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">user.name</span><span class="v">Tên hiển thị in trên mỗi commit, ví dụ <code>Bui Hoang Long</code>. Chữ gì cũng được; GitHub không kiểm.</span></div>
  <div class="kv"><span class="k">user.email</span><span class="v">Email in trên mỗi commit. GitHub dùng CHÍNH nó để nối commit với tài khoản của bạn (ảnh đại diện, biểu đồ đóng góp, mục Đóng góp của CT Work).</span></div>
  <div class="kv"><span class="k">Username GitHub + đăng nhập</span><span class="v"><code>longbh2006</code> cộng một lần đăng nhập bằng trình duyệt. Chỉ dùng khi push hay pull — đó là KĐ.3, không phải <code>git config</code>.</span></div>
</div>

<h3>Vì sao "key does not contain a section"</h3>
${slide(D, 8, 'Lỗi key does not contain a section')}
<p><code>git config</code> luôn nhận một <em>khoá</em> (key) và một <em>giá trị</em> (value). Khoá gồm hai phần nối bằng dấu chấm: <code>mục.tên</code> (section.name), như <code>user.name</code> hay <code>core.autocrlf</code>. Long chỉ đưa một chữ, nên Git đọc <code>longbh2006</code> là khoá và không tìm thấy dấu chấm. Biến thể dùng dấu cách thay dấu chấm cũng hỏng y như vậy:</p>
<pre><code class="language-bash">git config --global longbh2006
git config --global user name <span class="tok-string">"Bui Hoang Long"</span></code></pre>
<div class="out">error: key does not contain a section: longbh2006
error: key does not contain a section: user</div>
<p>Dạng đúng — giống hệt nhau trong Git Bash và Terminal của Mac — có dấu chấm, và có ngoặc kép vì tên chứa dấu cách:</p>
<pre><code class="language-bash">git config --global user.name <span class="tok-string">"Bui Hoang Long"</span>
git config --global user.name          <span class="tok-comment"># không có giá trị = đọc lại</span></code></pre>
<div class="out">Bui Hoang Long</div>

<h3>Email lấy từ đâu: GitHub → Settings → Emails</h3>
${slide(D, 7, 'Email commit lấy từ GitHub Settings → Emails')}
<p>Đừng tự nghĩ ra email và đừng theo thói quen dùng email trường. Mở GitHub, bấm ảnh đại diện → <strong>Settings</strong> → <strong>Emails</strong>. Bạn sẽ thấy:</p>
<ol>
<li>Email chính (primary) — cái Gmail bạn dùng để đăng ký.</li>
<li>Ô <strong>Keep my email addresses private</strong> (giữ kín email). Tích vào, GitHub cho bạn một địa chỉ riêng dạng <code>ID+USERNAME@users.noreply.github.com</code> — với tài khoản tạo sau tháng 7/2017, ID là một con số, ví dụ <code>12345678+longbh2006@users.noreply.github.com</code>.</li>
<li>Ô <strong>Block command line pushes that expose my email</strong> (chặn push làm lộ email).</li>
</ol>
<p>Chép <em>đúng nguyên văn</em> địa chỉ noreply từ trang đó và dùng nó trong Git. Nó vẫn nối mọi commit với tài khoản của bạn, nhưng Gmail của bạn không bao giờ xuất hiện trong lịch sử dự án — thứ mà giảng viên, bạn cùng nhóm và bất kỳ ai có quyền đều đọc được.</p>
<pre><code class="language-bash">git config --global user.email <span class="tok-string">"12345678+longbh2006@users.noreply.github.com"</span></code></pre>
<div class="callout warn"><strong>GH007.</strong> Nếu ô "Block command line pushes" đang bật mà một commit vẫn mang Gmail riêng của bạn, GitHub từ chối cả lần push:
<div class="out">remote: error: GH007: Your push would publish a private email address.
remote: You can make your email public or disable this protection by visiting:
remote: https://github.com/settings/emails
 ! [remote rejected] main -&gt; main (push declined due to email privacy restrictions)
error: failed to push some refs to 'https://github.com/longbh2006/prj301-nhom.git'</div>
Sửa cấu hình thôi là chưa đủ — commit đã mang email cũ bên trong. Với commit cuối cùng, đặt email noreply rồi viết lại đúng commit đó bằng <code>--reset-author</code> (KĐ.9 chạy lại trên output thật).</div>

<h3>Những cài đặt làm một lần cho mỗi máy</h3>
${slide(D, 9, 'Cấu hình một lần cho mỗi máy — Windows và Mac')}
<p>Các lệnh này ghi vào file cấu hình <em>toàn cục</em> (global — <code>C:\\Users\\&lt;tên-bạn&gt;\\.gitconfig</code> trên Windows, <code>~/.gitconfig</code> trên Mac), nên áp dụng cho mọi dự án trên laptop đó. Chạy một lần; đổi laptop thì chạy lại một lần nữa.</p>
<pre><code class="language-bash"><span class="tok-comment"># Cả hai hệ điều hành</span>
git config --global user.name  <span class="tok-string">"Nguyen Dang Khoa"</span>
git config --global user.email <span class="tok-string">"23456789+khoa-nd@users.noreply.github.com"</span>
git config --global init.defaultBranch main
git config --global pull.rebase false

<span class="tok-comment"># Chỉ Windows (Git Bash)</span>
git config --global core.autocrlf true
git config --global core.longpaths true

<span class="tok-comment"># Chỉ Mac</span>
git config --global core.autocrlf input</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">init.defaultBranch main</span><span class="v">Kho mới bắt đầu ở <code>main</code>, trùng tên GitHub dùng. Thiếu nó bạn nhận một đoạn gợi ý dài và một nhánh <code>master</code>.</span></div>
  <div class="kv"><span class="k">pull.rebase false</span><span class="v"><code>git pull</code> = fetch + merge (tải về rồi hợp nhất). Không chọn gì, Git đời mới dừng ngay lần lệch nhánh đầu tiên với <code>fatal: Need to specify how to reconcile divergent branches.</code></span></div>
  <div class="kv"><span class="k">core.autocrlf</span><span class="v">Windows <code>true</code>, Mac <code>input</code>: kho luôn lưu ký tự xuống dòng LF, mỗi máy thấy kiểu của mình. Học sâu: Chương 14.4.</span></div>
  <div class="kv"><span class="k">core.longpaths true</span><span class="v">Chỉ Windows: cho Git tạo file có đường dẫn đầy đủ dài hơn 260 ký tự — rất hay gặp với package Java lồng sâu.</span></div>
</div>
<p>Kiểm lại thứ mình vừa đặt. Trên máy Mac của Cường (kho thử, output thật):</p>
<pre><code class="language-bash">git config --global --list</code></pre>
<div class="out">user.name=Hoang Cuong
user.email=hoangcuong@example.com
init.defaultbranch=main
core.autocrlf=input
pull.rebase=false</div>
<p>Để ý email: đây là trạng thái "trước khi sửa" — một địa chỉ bịa. Khi một giá trị trông sai, hỏi xem nó đến từ đâu bằng <code>--show-origin</code>:</p>
<pre><code class="language-bash">git config --list --show-origin</code></pre>
<div class="out">file:/Users/cuong/.gitconfig	user.name=Hoang Cuong
file:/Users/cuong/.gitconfig	user.email=hoangcuong@example.com
file:/Users/cuong/.gitconfig	init.defaultbranch=main
file:/Users/cuong/.gitconfig	core.autocrlf=input
file:/Users/cuong/.gitconfig	pull.rebase=false</div>
<p>Trên Windows danh sách dài hơn, vì trình cài đã ghi các câu trả lời của bạn vào một file <em>hệ thống</em> (system). Trích đoạn Git for Windows in ra:</p>
<div class="out">file:C:/Program Files/Git/etc/gitconfig	core.autocrlf=true
file:C:/Program Files/Git/etc/gitconfig	credential.helper=manager
file:C:/Program Files/Git/etc/gitconfig	pull.rebase=false
file:C:/Users/Lenovo/.gitconfig	user.name=Nguyen Dang Khoa
file:C:/Users/Lenovo/.gitconfig	user.email=23456789+khoa-nd@users.noreply.github.com</div>
<p>Mấy dòng hệ thống đó giải thích vì sao bạn Windows có thể đã có <code>core.autocrlf=true</code> dù chưa từng gõ. Đặt lại ở mức global cũng không sao.</p>

<h3>Kiểm trên một commit thật</h3>
<p>Cấu hình là lời hứa; commit mới là bằng chứng. Sau commit đầu tiên, xem cái thật sự được ghi:</p>
<pre><code class="language-bash">git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">05f1989 Hoang Cuong &lt;hoangcuong@example.com&gt;</div>
<p>Commit cuối, chưa push, mang sai email? Sửa cấu hình, rồi viết lại tác giả của đúng commit đó:</p>
<pre><code class="language-bash">git config --global user.email <span class="tok-string">"45678901+cuonghoang1103@users.noreply.github.com"</span>
git commit --amend --reset-author --no-edit
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">[main 801dcf9] thử danh tính
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
801dcf9 Hoang Cuong &lt;45678901+cuonghoang1103@users.noreply.github.com&gt;</div>
<p>Mã băm đổi (05f1989 → 801dcf9) vì tác giả là một phần nội dung của commit. Trước khi push thì không sao. Đã push lên nhánh chung rồi thì hỏi cả nhóm trước (Chương 8).</p>
<div class="callout ok"><strong>Một dự án cần email khác?</strong> Chạy cùng lệnh nhưng <em>bỏ</em> <code>--global</code>, ngay bên trong kho đó, ví dụ <code>git config user.email "ban@fpt.edu.vn"</code>. Cấu hình cục bộ (local) thắng toàn cục, chỉ trong kho đó (bài 0.3, Chương 14.3).</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trên GitHub: Settings → Emails, tích <strong>Keep my email addresses private</strong>, chép địa chỉ noreply của bạn.</li><li>Trong Git Bash / Terminal, cố ý lặp lại lỗi của Long một lần: <code>git config --global username-cua-ban</code>. Đọc lỗi.</li><li>Chạy khối cài đặt một-lần-mỗi-máy ở trên cho <em>hệ điều hành của bạn</em>, với tên và email noreply của bạn.</li><li>Chạy <code>git config --global --list</code> rồi gửi output (không có gì bí mật) vào nhóm chat; mỗi bạn kiểm email của một bạn khác có đuôi <code>users.noreply.github.com</code>.</li><li>Trong <code>~/Code</code> tạo một kho thử (<code>git init thu-danh-tinh</code>, một file, một commit) và kiểm bằng <code>git log -1 --format="%an &lt;%ae&gt;"</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>git config --global --list</code> có <code>user.name</code>, email <code>…@users.noreply.github.com</code>, <code>init.defaultbranch=main</code>, <code>pull.rebase=false</code> và <code>core.autocrlf</code> đúng hệ điều hành, và commit thử mang đúng email đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Config key</span><span class="v">Khoá cấu hình — tên cài đặt dạng <code>mục.tên</code>, ví dụ <code>user.email</code>.</span></div>
  <div class="kv"><span class="k">--global</span><span class="v">Toàn cục — ghi vào file cấu hình riêng của bạn: người dùng này, mọi kho trên máy này.</span></div>
  <div class="kv"><span class="k">noreply email</span><span class="v">Email ẩn danh — địa chỉ riêng GitHub cấp (<code>ID+username@users.noreply.github.com</code>), vẫn nối commit với tài khoản.</span></div>
  <div class="kv"><span class="k">GH007</span><span class="v">Mã lỗi GitHub từ chối một lần push vì commit sẽ làm lộ email riêng của bạn.</span></div>
  <div class="kv"><span class="k">--reset-author</span><span class="v">Đặt lại tác giả — đi cùng <code>git commit --amend</code>: đóng dấu lại commit cuối bằng tên/email hiện tại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Danh tính (tên + email trên commit) và đăng nhập (username + trình duyệt) là hai việc riêng.</li><li>Khoá cấu hình luôn có dấu chấm: <code>user.name</code>, không bao giờ là một username trần.</li><li>Lấy email từ GitHub → Settings → Emails; ưu tiên địa chỉ noreply.</li><li>Một lần mỗi máy: tên, email, <code>init.defaultBranch main</code>, <code>pull.rebase false</code>, <code>core.autocrlf</code> (Windows true / Mac input), <code>core.longpaths</code> trên Windows.</li><li>Kiểm trên commit thật bằng <code>git log -1 --format="%an &lt;%ae&gt;"</code>.</li></ul>

${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address', '✉️', 'GitHub Docs — Đặt email cho commit', 'Địa chỉ noreply nằm ở đâu và commit được nối với tài khoản thế nào.')}
${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/blocking-command-line-pushes-that-expose-your-personal-email-address', '🛡️', 'GitHub Docs — Chặn push làm lộ email', 'Cài đặt đứng sau lỗi GH007.')}
${LT('git-14-4-windows-crlf', '↔️', 'Bài 14.4 — Làm nhóm với bạn dùng Windows', 'CRLF/LF, core.autocrlf và .gitattributes, học sâu.')}

<div class="pitfall co-tieu-de"><strong>Phiên bản im lặng của lỗi này.</strong> Hai bạn chép cùng một lệnh từ nhóm chat và cả hai đặt <code>user.email</code> thành email của trưởng nhóm. Không có gì báo lỗi; mọi commit chỉ đơn giản được ghi công cho trưởng nhóm, và cuối kỳ báo cáo Đóng góp nói một người viết hết. Mỗi người gõ email <em>của chính mình</em>, rồi kiểm bằng <code>git log -1 --format="%an &lt;%ae&gt;"</code>.</div>
<p class="note-ct"><strong>Nhớ các tầng:</strong> thứ bạn đặt ở bài này thuộc về máy, sống qua mọi dự án. Đổi laptop hay cài lại Windows thì làm lại bài này — trong dự án không có gì phải đổi.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.3 ─────────────────────────── */
    {
      title: 'KĐ.3 — Logging in to GitHub over HTTPS (Windows + Mac) and the 403 trap|||KĐ.3 — Đăng nhập GitHub qua HTTPS (Windows + Mac) và bẫy 403 nhầm tài khoản',
      slug: 'git-kd-3-dang-nhap-github',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao mật khẩu GitHub không dùng được trong terminal, Git Credential Manager bật "Sign in with your browser" ở lần push đầu trên Windows, cài gh trên Windows (winget/msi, winpty) và Mac (brew, Keychain), kiểm bằng gh auth status, và gỡ lỗi 403 do máy nhớ nhầm tài khoản.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.3</span>
<h2>Proving to GitHub who you are — once per machine, in the browser</h2>
<p class="lead">Khoa followed a tutorial that said "run <code>gh auth login</code>". On his Windows laptop Git Bash answered <code>bash: gh: command not found</code>; after installing it, the menu appeared and froze. When he finally pushed, GitHub said 403: Windows still remembered a different GitHub account from an old course. Three problems, one root: nobody had told him how logging in actually works. Here is the whole picture, for Windows and Mac. (SSH keys are the other way to log in; they are covered in lesson 5.2 — HTTPS is simpler for a first team project.)</p>

<h3>Your GitHub password does not work in the terminal</h3>
${slide(D, 10, 'Đăng nhập GitHub qua HTTPS — mật khẩu không còn dùng được')}
<p>Since 13 August 2021 GitHub refuses account passwords for Git operations. If Git ever prints <code>Username for 'https://github.com':</code> and you type your password, the answer is:</p>
<div class="out">remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/longbh2006/prj301-nhom.git/'</div>
<p>Instead, a small helper program signs you in <strong>through the browser</strong>, receives a token from GitHub, and stores it in the operating system's safe: <strong>Windows Credential Manager</strong> or the <strong>macOS Keychain</strong>. Git asks the helper every time it talks to github.com. You sign in once per machine; after that, push and pull just work.</p>

<h3>Windows: Git Credential Manager does it on your first push</h3>
${slide(D, 11, 'Cửa sổ Git Credential Manager ở lần push đầu')}
<p>Git for Windows ships Git Credential Manager (GCM) and the installer turns it on (<code>credential.helper=manager</code> in the system config you saw in KĐ.2). So on Windows <strong>you do not need to run any login command</strong>. The first time you push (or clone a private repository), a window titled GitHub → <strong>Sign in</strong> appears:</p>
<ol>
<li>Click <strong>Sign in with your browser</strong>. (The other options — <em>Sign in with a code</em> and a <em>Token</em> tab — are for machines without a browser.)</li>
<li>The browser opens github.com. Check the avatar in the top-right corner: is this <em>your</em> account? If a classmate or an old account is signed in, sign out first.</li>
<li>Click <strong>Authorize</strong> for Git Credential Manager.</li>
<li>Go back to Git Bash. The push you started continues by itself.</li>
</ol>
<p>To see which GitHub accounts GCM remembers, GCM has its own small command (identical in Git Bash, CMD and PowerShell):</p>
<pre><code class="language-bash">git credential-manager github list           <span class="tok-comment"># accounts GCM knows</span>
git credential-manager github logout khoa-cu   <span class="tok-comment"># forget one of them</span></code></pre>

<h3>gh on Windows: not included, and its menus can freeze in Git Bash</h3>
${slide(D, 12, 'gh trên Windows: cài riêng, menu treo trong Git Bash, winpty')}
<p><code>gh</code> (GitHub CLI) is useful — it can create repositories and pull requests from the terminal — but it is a <strong>separate program</strong>. Git for Windows does not include it, hence <code>bash: gh: command not found</code>. Install it with <code>winget install --id GitHub.cli</code> in PowerShell, or the <code>.msi</code> from <code>cli.github.com</code>, then <strong>close and reopen</strong> Git Bash.</p>
<p>The second surprise: Git Bash runs in a terminal called <strong>MinTTY</strong>, and the gh manual itself says MinTTY has known issues with gh's prompts. <code>gh auth login</code> prints <code>? Where do you use GitHub?</code> and then ignores the arrow keys and Enter. Three ways out, from the gh manual:</p>
<pre><code class="language-bash">winpty gh auth login        <span class="tok-comment"># 1. wrap it (may show small display glitches)</span>
<span class="tok-comment"># 2. run the same command in PowerShell or Windows Terminal instead of Git Bash</span>
<span class="tok-comment"># 3. reinstall Git for Windows with "experimental support for pseudo consoles"</span></code></pre>
<div class="callout ok"><strong>The simplest answer for the team:</strong> on Windows, skip gh entirely for now. Git Credential Manager already logs you in at the first push. Install gh later, when you actually want <code>gh pr create</code>.</div>

<h3>Mac: gh auth login and the Keychain</h3>
<p>macOS has no Credential Manager pop-up by default, so on a Mac the smoothest path is gh (install once with Homebrew):</p>
<pre><code class="language-bash">brew install gh
gh auth login</code></pre>
<div class="out">? Where do you use GitHub? GitHub.com
? What is your preferred protocol for Git operations on this host? HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate GitHub CLI? Login with a web browser

! First copy your one-time code: 1A2B-3C4D
Press Enter to open https://github.com/login/device in your browser...
✓ Authentication complete.
- gh config set -h github.com git_protocol https
✓ Configured git protocol
✓ Logged in as cuonghoang1103</div>
<p>Answer <strong>HTTPS</strong>, and <strong>Yes</strong> to "Authenticate Git with your GitHub credentials?" — that answer makes gh register itself as Git's credential helper for github.com, so plain <code>git push</code> uses the same login. Paste the one-time code into the page that opens, approve, and gh stores the token in the macOS Keychain. (The code above is an example; yours is new every time.)</p>
<p>Check at any time — on both systems:</p>
<pre><code class="language-bash">gh auth status</code></pre>
<div class="out">github.com
  ✓ Logged in to github.com account cuonghoang1103 (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'</div>
<p>Not logged in yet, it prints <code>You are not logged into any GitHub hosts. To log in, run: gh auth login</code> (real output from a fresh profile).</p>

<h3>403: the machine remembers someone else</h3>
${slide(D, 13, 'Push bị 403 — xoá mục github.com trong Credential Manager / Keychain')}
<p>Khoa's push failed like this (the message names the account Git actually used):</p>
<div class="out">remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu.
fatal: unable to access 'https://github.com/longbh2006/prj301-nhom.git/': The requested URL returned error: 403</div>
<p><code>khoa-cu</code> was an account he made for another subject; GCM had saved it a year earlier and kept using it silently. With a private repository the same mix-up can instead look like <code>remote: Repository not found.</code> — GitHub hides private repositories from accounts without access. Fix: make the machine forget the old login, then push again and sign in with the right one.</p>
<table>
<thead><tr><th></th><th>Windows</th><th>Mac</th></tr></thead>
<tbody>
<tr><td>Graphical</td><td>Control Panel → <strong>Credential Manager</strong> → <strong>Windows Credentials</strong> → entry <code>git:https://github.com</code> → <strong>Remove</strong></td><td><strong>Keychain Access</strong> → search <code>github.com</code> → delete the <em>Internet password</em> item</td></tr>
<tr><td>Command</td><td>In CMD or PowerShell: <code>cmdkey /delete:git:https://github.com</code> — or <code>git credential-manager github logout khoa-cu</code></td><td>If you use gh: <code>gh auth logout</code> then <code>gh auth login</code> (or <code>gh auth switch</code> between two accounts)</td></tr>
</tbody>
</table>
<div class="callout warn">Run <code>cmdkey</code> in CMD or PowerShell, not in Git Bash: Git Bash rewrites arguments that start with <code>/</code> as if they were paths, so <code>/delete:…</code> arrives mangled.</div>
<p>Before blaming the account, also check that the invitation was accepted (KĐ.5) — an account that has not accepted has no access at all.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Windows: open Control Panel → Credential Manager → Windows Credentials and look for <code>git:https://github.com</code>. Mac: open Keychain Access and search <code>github.com</code>. Note whether an old login is there.</li><li>Mac: <code>brew install gh</code>, then <code>gh auth login</code> with HTTPS + "Yes" + web browser. Windows: optional — install gh with winget, reopen Git Bash, run <code>winpty gh auth login</code> (or skip gh).</li><li>Run <code>gh auth status</code> (or, on Windows without gh, <code>git credential-manager github list</code>) and confirm the account name is yours.</li><li>Clone any of your own private repositories into <code>~/Code</code> (create an empty private one if you have none). Windows users without a saved login will see the Credential Manager window here — sign in with the browser.</li></ol>
<p><strong>Done when:</strong> your account name — and only yours — appears in <code>gh auth status</code> or <code>git credential-manager github list</code>, and cloning your private repository finishes without asking for a password.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Credential helper</span><span class="v">The program Git asks for your GitHub login; it stores a token in the OS safe.</span></div>
  <div class="kv"><span class="k">Git Credential Manager (GCM)</span><span class="v">Windows' default helper; shows "Sign in with your browser" on first use.</span></div>
  <div class="kv"><span class="k">GitHub CLI (gh)</span><span class="v">A separate program for GitHub tasks; <code>gh auth login</code> can also log Git in.</span></div>
  <div class="kv"><span class="k">MinTTY / winpty</span><span class="v">Git Bash's terminal, and a wrapper that lets console programs like gh prompt inside it.</span></div>
  <div class="kv"><span class="k">403 Forbidden</span><span class="v">GitHub knows who you are, but that account may not push to this repository.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>GitHub passwords stopped working for Git in August 2021; you sign in through the browser.</li><li>Windows: do nothing — Git Credential Manager asks at the first push.</li><li>Mac: <code>brew install gh</code> + <code>gh auth login</code> (HTTPS, Yes, web browser).</li><li><code>gh</code> is not part of Git; in Git Bash use <code>winpty gh …</code> or PowerShell.</li><li>403 "denied to <em>other-account</em>" = remove the <code>github.com</code> entry from Credential Manager / Keychain and sign in again.</li></ul>

${LT('git-5-2-xac-thuc', '🔐', 'Lesson 5.2 — Authentication: SSH, tokens, credential helpers', 'SSH keys, fine-grained tokens and two accounts on one machine.')}
${LX('https://cli.github.com/manual/gh_help_mintty', '🖥️', 'gh manual — MinTTY', 'The official note on gh prompts in Git Bash and the three workarounds.')}
${LX('https://github.com/git-ecosystem/git-credential-manager', '🗝️', 'Git Credential Manager', 'Source and docs of the helper Git for Windows uses.')}

<div class="pitfall co-tieu-de"><strong>"I'll just put my token in the URL."</strong> Some tutorials suggest <code>https://user:token@github.com/…</code>. The token then sits in plain text in <code>.git/config</code>, in your shell history and in every screenshot of <code>git remote -v</code> you post to the group. Let the helper hold it.</div>
<p class="note-ct"><strong>Shared lab computers:</strong> if you ever sign in on a school PC, remove the <code>github.com</code> entry (or run <code>gh auth logout</code>) before you leave — otherwise the next student pushes as you.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.3</span>
<h2>Chứng minh với GitHub bạn là ai — một lần mỗi máy, qua trình duyệt</h2>
<p class="lead">Khoa làm theo một hướng dẫn bảo "chạy <code>gh auth login</code>". Trên laptop Windows, Git Bash trả lời <code>bash: gh: command not found</code>; cài xong thì menu hiện ra rồi đứng im. Lúc cuối cùng push được, GitHub báo 403: Windows vẫn nhớ một tài khoản GitHub khác từ một môn học cũ. Ba vấn đề, một gốc: chưa ai giải thích cho Khoa việc đăng nhập thật ra chạy thế nào. Đây là toàn cảnh, cho cả Windows lẫn Mac. (Khoá SSH là cách đăng nhập còn lại, đã có ở bài 5.2 — với dự án nhóm đầu tiên, HTTPS đơn giản hơn.)</p>

<h3>Mật khẩu GitHub không dùng được trong terminal</h3>
${slide(D, 10, 'Đăng nhập GitHub qua HTTPS — mật khẩu không còn dùng được')}
<p>Từ ngày 13/08/2021, GitHub từ chối mật khẩu tài khoản cho các thao tác Git. Nếu Git có lúc in <code>Username for 'https://github.com':</code> và bạn gõ mật khẩu, câu trả lời sẽ là:</p>
<div class="out">remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/longbh2006/prj301-nhom.git/'</div>
<p>Thay vào đó, một chương trình trợ giúp nhỏ đăng nhập cho bạn <strong>qua trình duyệt</strong>, nhận một token (mã truy cập) từ GitHub, rồi cất nó vào két an toàn của hệ điều hành: <strong>Windows Credential Manager</strong> hoặc <strong>macOS Keychain</strong>. Mỗi lần nói chuyện với github.com, Git hỏi chương trình đó. Bạn đăng nhập một lần cho mỗi máy; từ đó push và pull cứ thế chạy.</p>

<h3>Windows: Git Credential Manager tự lo ở lần push đầu</h3>
${slide(D, 11, 'Cửa sổ Git Credential Manager ở lần push đầu')}
<p>Git for Windows có sẵn Git Credential Manager (GCM) và trình cài đã bật nó (<code>credential.helper=manager</code> trong cấu hình hệ thống bạn thấy ở KĐ.2). Nên trên Windows <strong>bạn không cần chạy lệnh đăng nhập nào</strong>. Lần đầu bạn push (hoặc clone một repo private), một cửa sổ GitHub → <strong>Sign in</strong> hiện ra:</p>
<ol>
<li>Bấm <strong>Sign in with your browser</strong>. (Các lựa chọn còn lại — <em>Sign in with a code</em> và tab <em>Token</em> — dành cho máy không có trình duyệt.)</li>
<li>Trình duyệt mở github.com. Nhìn ảnh đại diện ở góc trên bên phải: đây có phải tài khoản <em>của bạn</em> không? Nếu đang đăng nhập tài khoản của bạn khác hay tài khoản cũ, đăng xuất trước.</li>
<li>Bấm <strong>Authorize</strong> (cho phép) cho Git Credential Manager.</li>
<li>Quay lại Git Bash. Lệnh push đang dở tự chạy tiếp.</li>
</ol>
<p>Muốn xem GCM đang nhớ những tài khoản GitHub nào, GCM có lệnh riêng (giống nhau trong Git Bash, CMD và PowerShell):</p>
<pre><code class="language-bash">git credential-manager github list           <span class="tok-comment"># các tài khoản GCM đang nhớ</span>
git credential-manager github logout khoa-cu   <span class="tok-comment"># quên một tài khoản</span></code></pre>

<h3>gh trên Windows: không có sẵn, và menu có thể treo trong Git Bash</h3>
${slide(D, 12, 'gh trên Windows: cài riêng, menu treo trong Git Bash, winpty')}
<p><code>gh</code> (GitHub CLI) rất tiện — tạo được repo và pull request ngay từ terminal — nhưng nó là <strong>một chương trình riêng</strong>. Git for Windows không kèm nó, nên mới có <code>bash: gh: command not found</code>. Cài bằng <code>winget install --id GitHub.cli</code> trong PowerShell, hoặc file <code>.msi</code> ở <code>cli.github.com</code>, rồi <strong>đóng và mở lại</strong> Git Bash.</p>
<p>Bất ngờ thứ hai: Git Bash chạy trong một trình giả lập terminal tên <strong>MinTTY</strong>, và chính tài liệu của gh ghi MinTTY có lỗi đã biết với các câu hỏi tương tác của gh. <code>gh auth login</code> in <code>? Where do you use GitHub?</code> rồi bỏ qua phím mũi tên và Enter. Ba lối thoát, lấy từ tài liệu gh:</p>
<pre><code class="language-bash">winpty gh auth login        <span class="tok-comment"># 1. bọc lệnh bằng winpty (có thể lỗi hiển thị lặt vặt)</span>
<span class="tok-comment"># 2. chạy đúng lệnh đó trong PowerShell hoặc Windows Terminal thay vì Git Bash</span>
<span class="tok-comment"># 3. cài lại Git for Windows, tích "experimental support for pseudo consoles"</span></code></pre>
<div class="callout ok"><strong>Câu trả lời đơn giản nhất cho cả nhóm:</strong> trên Windows, tạm bỏ qua gh. Git Credential Manager đã đăng nhập cho bạn ở lần push đầu rồi. Khi nào thật sự cần <code>gh pr create</code> thì cài gh sau.</div>

<h3>Mac: gh auth login và Keychain</h3>
<p>macOS mặc định không có cửa sổ Credential Manager, nên trên Mac đường êm nhất là gh (cài một lần bằng Homebrew):</p>
<pre><code class="language-bash">brew install gh
gh auth login</code></pre>
<div class="out">? Where do you use GitHub? GitHub.com
? What is your preferred protocol for Git operations on this host? HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate GitHub CLI? Login with a web browser

! First copy your one-time code: 1A2B-3C4D
Press Enter to open https://github.com/login/device in your browser...
✓ Authentication complete.
- gh config set -h github.com git_protocol https
✓ Configured git protocol
✓ Logged in as cuonghoang1103</div>
<p>Chọn <strong>HTTPS</strong>, và <strong>Yes</strong> ở câu "Authenticate Git with your GitHub credentials?" — câu trả lời đó khiến gh tự đăng ký làm trình giữ đăng nhập (credential helper) của Git cho github.com, nên <code>git push</code> thường cũng dùng chung lần đăng nhập này. Dán mã một lần (one-time code) vào trang vừa mở, bấm duyệt, gh cất token vào Keychain của macOS. (Mã ở trên chỉ là ví dụ; mỗi lần mã mới.)</p>
<p>Kiểm bất cứ lúc nào — trên cả hai hệ điều hành:</p>
<pre><code class="language-bash">gh auth status</code></pre>
<div class="out">github.com
  ✓ Logged in to github.com account cuonghoang1103 (keyring)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_************************************
  - Token scopes: 'gist', 'read:org', 'repo', 'workflow'</div>
<p>Chưa đăng nhập thì nó in <code>You are not logged into any GitHub hosts. To log in, run: gh auth login</code> (output thật từ một hồ sơ gh trống).</p>

<h3>403: máy đang nhớ một người khác</h3>
${slide(D, 13, 'Push bị 403 — xoá mục github.com trong Credential Manager / Keychain')}
<p>Lần push của Khoa hỏng thế này (thông báo nêu đúng tài khoản Git đã thật sự dùng):</p>
<div class="out">remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu.
fatal: unable to access 'https://github.com/longbh2006/prj301-nhom.git/': The requested URL returned error: 403</div>
<p><code>khoa-cu</code> là tài khoản Khoa tạo cho một môn khác; GCM đã lưu nó từ năm trước và cứ thế âm thầm dùng. Với repo private, cùng sự nhầm lẫn đó có thể hiện ra thành <code>remote: Repository not found.</code> — GitHub giấu repo private khỏi tài khoản không có quyền. Cách sửa: bắt máy quên lần đăng nhập cũ, rồi push lại và đăng nhập đúng tài khoản.</p>
<table>
<thead><tr><th></th><th>Windows</th><th>Mac</th></tr></thead>
<tbody>
<tr><td>Bằng giao diện</td><td>Control Panel → <strong>Credential Manager</strong> → <strong>Windows Credentials</strong> → mục <code>git:https://github.com</code> → <strong>Remove</strong></td><td><strong>Keychain Access</strong> → tìm <code>github.com</code> → xoá mục loại <em>Internet password</em></td></tr>
<tr><td>Bằng lệnh</td><td>Trong CMD hoặc PowerShell: <code>cmdkey /delete:git:https://github.com</code> — hoặc <code>git credential-manager github logout khoa-cu</code></td><td>Nếu dùng gh: <code>gh auth logout</code> rồi <code>gh auth login</code> (hoặc <code>gh auth switch</code> khi có hai tài khoản)</td></tr>
</tbody>
</table>
<div class="callout warn">Chạy <code>cmdkey</code> trong CMD hoặc PowerShell, đừng chạy trong Git Bash: Git Bash tự đổi các tham số bắt đầu bằng <code>/</code> như thể chúng là đường dẫn, nên <code>/delete:…</code> tới nơi đã bị méo.</div>
<p>Trước khi đổ lỗi cho tài khoản, kiểm luôn lời mời đã được chấp nhận chưa (KĐ.5) — tài khoản chưa nhận lời mời thì không có quyền gì cả.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Windows: mở Control Panel → Credential Manager → Windows Credentials và tìm <code>git:https://github.com</code>. Mac: mở Keychain Access, tìm <code>github.com</code>. Ghi lại có lần đăng nhập cũ nào không.</li><li>Mac: <code>brew install gh</code>, rồi <code>gh auth login</code> với HTTPS + "Yes" + web browser. Windows: tuỳ chọn — cài gh bằng winget, mở lại Git Bash, chạy <code>winpty gh auth login</code> (hoặc bỏ qua gh).</li><li>Chạy <code>gh auth status</code> (hoặc trên Windows không có gh: <code>git credential-manager github list</code>) và xác nhận tên tài khoản là của bạn.</li><li>Clone một repo private bất kỳ của chính bạn vào <code>~/Code</code> (chưa có thì tạo một repo private rỗng). Bạn Windows chưa lưu đăng nhập sẽ thấy cửa sổ Credential Manager ở bước này — đăng nhập bằng trình duyệt.</li></ol>
<p><strong>Đạt khi:</strong> tên tài khoản của bạn — và chỉ của bạn — hiện trong <code>gh auth status</code> hoặc <code>git credential-manager github list</code>, và clone repo private chạy xong mà không hỏi mật khẩu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Credential helper</span><span class="v">Trình giữ đăng nhập — chương trình Git hỏi lấy thông tin đăng nhập GitHub; cất token trong két của hệ điều hành.</span></div>
  <div class="kv"><span class="k">Git Credential Manager (GCM)</span><span class="v">Trình giữ đăng nhập mặc định trên Windows; hiện "Sign in with your browser" ở lần dùng đầu.</span></div>
  <div class="kv"><span class="k">GitHub CLI (gh)</span><span class="v">Công cụ dòng lệnh của GitHub — chương trình riêng; <code>gh auth login</code> đăng nhập được cho cả Git.</span></div>
  <div class="kv"><span class="k">MinTTY / winpty</span><span class="v">Trình giả lập terminal của Git Bash, và lớp bọc giúp chương trình console như gh hỏi đáp được bên trong nó.</span></div>
  <div class="kv"><span class="k">403 Forbidden</span><span class="v">Bị cấm — GitHub biết bạn là ai, nhưng tài khoản đó không được push vào repo này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mật khẩu GitHub ngừng dùng được cho Git từ 08/2021; đăng nhập đi qua trình duyệt.</li><li>Windows: không phải làm gì — Git Credential Manager hỏi ở lần push đầu.</li><li>Mac: <code>brew install gh</code> + <code>gh auth login</code> (HTTPS, Yes, web browser).</li><li><code>gh</code> không thuộc Git; trong Git Bash dùng <code>winpty gh …</code> hoặc chạy trong PowerShell.</li><li>403 "denied to <em>tài-khoản-khác</em>" = xoá mục <code>github.com</code> trong Credential Manager / Keychain rồi đăng nhập lại.</li></ul>

${LT('git-5-2-xac-thuc', '🔐', 'Bài 5.2 — Xác thực: SSH, token, credential helper', 'Khoá SSH, token fine-grained và hai tài khoản trên một máy.')}
${LX('https://cli.github.com/manual/gh_help_mintty', '🖥️', 'Tài liệu gh — MinTTY', 'Ghi chú chính thức về lời nhắc của gh trong Git Bash và ba cách xử lý.')}
${LX('https://github.com/git-ecosystem/git-credential-manager', '🗝️', 'Git Credential Manager', 'Mã nguồn và tài liệu của trình giữ đăng nhập mà Git for Windows dùng.')}

<div class="pitfall co-tieu-de"><strong>"Thôi dán token vào URL cho nhanh."</strong> Vài hướng dẫn gợi ý <code>https://user:token@github.com/…</code>. Khi đó token nằm dạng chữ thô trong <code>.git/config</code>, trong lịch sử lệnh, và trong mọi ảnh chụp <code>git remote -v</code> bạn gửi vào nhóm. Hãy để trình giữ đăng nhập giữ nó.</div>
<p class="note-ct"><strong>Máy tính dùng chung ở phòng lab:</strong> lỡ đăng nhập trên máy trường thì xoá mục <code>github.com</code> (hoặc <code>gh auth logout</code>) trước khi về — không thì bạn sinh viên ca sau sẽ push dưới tên bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.4 ─────────────────────────── */
    {
      title: 'KĐ.4 — The team leader creates the repository: on github.com or from the terminal|||KĐ.4 — Trưởng nhóm tạo repo: trên github.com hoặc từ terminal',
      slug: 'git-kd-4-truong-nhom-tao-repo',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai cách tạo repo private cho nhóm (trên web — có tích README hay không và vì sao quan trọng; từ terminal — git init, .gitignore cho dự án NetBeans/Maven, remote add, branch -M main, push -u, hoặc gh repo create), thư mục rỗng cần .gitkeep, và db.properties không bao giờ được commit.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.4</span>
<h2>One person creates the repository, once — and the first commit decides what the whole team inherits</h2>
<p class="lead">Only the team leader does this lesson; everyone else watches, because the choices made here — private or public, README or not, what goes into <code>.gitignore</code> — are inherited by every clone for the rest of the term. Long already had a NetBeans project on his laptop. This lesson follows exactly what he ran, on real output, and the two mistakes that cost the team half an hour: a folder that never reached GitHub, and a branch called <code>master</code>.</p>

<h3>Two ways — pick one</h3>
${slide(D, 14, 'Trưởng nhóm tạo repo — hai cách, chọn một')}
<p><strong>Way 1 — on github.com.</strong> Click <strong>+</strong> (top right) → <strong>New repository</strong>. Owner: your account. Repository name: <code>prj301-nhom</code>. Visibility: <strong>Private</strong> (graded coursework should not be public unless the lecturer says so). Then the one question that matters: <strong>Add README</strong>.</p>
<ul>
<li><strong>README on</strong> → the repository is created with one commit ("Initial commit"). Correct next step: <em>clone</em> it (KĐ.6), copy your project files into the clone, commit, push. Right when the code does not exist yet.</li>
<li><strong>README off</strong> → the repository is empty and GitHub shows a "Quick setup" page with a block titled <em>…or push an existing repository from the command line</em>. Right when the code already exists on your laptop — Long's case — and it leads straight into way 2.</li>
</ul>
<p><strong>Way 2 — from the terminal</strong>, when the project is already on your disk. Same commands in Git Bash and Mac Terminal:</p>
<pre><code class="language-bash">cd /c/Code/prj301-nhom          <span class="tok-comment"># Mac: cd ~/Code/prj301-nhom</span>
git init
<span class="tok-comment"># write .gitignore (below), then:</span>
git add .
git commit -m <span class="tok-string">"NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)"</span>
git remote add origin https://github.com/longbh2006/prj301-nhom.git
git branch -M main
git push -u origin main</code></pre>
<p>The last three lines are literally what GitHub's Quick setup page shows for an empty repository. With gh installed and logged in (KĐ.3), one command replaces "create on the web + remote add + push": <code>gh repo create prj301-nhom --private --source . --push</code> (from <code>gh repo create --help</code>: <code>--source</code> = an existing local repository, <code>--push</code> = push its commits).</p>

<h3>The mixed path that breaks: README on the web and git init at home</h3>
${slide(D, 15, 'Tích README rồi lại git init ở máy = hai lịch sử không chung gốc')}
<p>If you tick README on the web <em>and</em> run <code>git init</code> + commit on your laptop, you now have two histories with no common ancestor. The push is refused, and a plain pull refuses too (real output, git 2.51.1):</p>
<pre><code class="language-bash">git push -u origin main</code></pre>
<div class="out">To https://github.com/longbh2006/prj301-readme.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'https://github.com/longbh2006/prj301-readme.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.</div>
<pre><code class="language-bash">git pull --no-rebase origin main</code></pre>
<div class="out">From https://github.com/longbh2006/prj301-readme
 * branch            main       -&gt; FETCH_HEAD
fatal: refusing to merge unrelated histories</div>
<p>Since nothing important is on GitHub yet, join the two once, explicitly, and push:</p>
<pre><code class="language-bash">git pull --no-rebase origin main --allow-unrelated-histories --no-edit
git push -u origin main</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 README.md | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
To https://github.com/longbh2006/prj301-readme.git
   5a22ac7..ed7d6ab  main -&gt; main
branch 'main' set up to track 'origin/main'.</div>
<p>(Without <code>pull.rebase false</code> from KĐ.2 the pull would first stop with <code>fatal: Need to specify how to reconcile divergent branches.</code> — that is why <code>--no-rebase</code> is written out here.) Use <code>--allow-unrelated-histories</code> only for this first-day situation; seeing it later means something else is wrong.</p>

<h3>.gitignore for a NetBeans + Maven web project — before the first add</h3>
${slide(D, 16, '.gitignore cho NetBeans + Maven và db.properties')}
<p>Right after <code>git init</code>, <code>git status</code> on Long's project showed four things to add, two of which must never be committed:</p>
<div class="out">On branch main

No commits yet

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	nbproject/
	pom.xml
	src/
	target/</div>
<p><code>target/</code> is Maven's build output (compiled <code>.class</code> files, the <code>.war</code>); <code>nbproject/private/</code> holds paths that exist only on Long's laptop (his Tomcat folder). Everyone rebuilds these. Create <code>.gitignore</code> in the project root:</p>
<pre><code><span class="tok-comment"># Maven / NetBeans — sinh ra khi build, ai build cũng có</span>
target/
build/
dist/
nbproject/private/
*.class

<span class="tok-comment"># Bí mật: mật khẩu SQL Server của từng máy</span>
src/main/resources/db.properties

<span class="tok-comment"># Rác của hệ điều hành</span>
.DS_Store
Thumbs.db</code></pre>
<p><code>build/</code> and <code>dist/</code> cover the older Ant-based NetBeans web projects too. Then commit a template next to the real file: <code>src/main/resources/db.properties.example</code> with every key and an empty password. Each teammate copies it to <code>db.properties</code> and fills in their own SQL Server password (KĐ.6). If your code still hard-codes <code>sa</code>/password inside a <code>DBContext.java</code>, move them into <code>db.properties</code> now — a password in a <code>.java</code> file is committed with it.</p>
<pre><code class="language-bash">git add .
git status --short
git commit -m <span class="tok-string">"NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)"</span>
git check-ignore -v src/main/resources/db.properties</code></pre>
<div class="out">A  .gitignore
A  pom.xml
A  src/main/java/com/nhom/controller/LoginServlet.java
A  src/main/resources/db.properties.example
A  src/main/webapp/WEB-INF/web.xml
A  src/main/webapp/index.jsp
[main (root-commit) 84a3412] NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)
 6 files changed, 33 insertions(+)
.gitignore:9:src/main/resources/db.properties	src/main/resources/db.properties</div>
<p>No <code>target/</code>, no <code>nbproject/private/</code>, no <code>db.properties</code> — and <code>check-ignore</code> names the exact line that protects the password file.</p>

<h3>Empty folders do not exist for Git</h3>
${slide(D, 17, 'Package mới không hiện — Git không lưu thư mục rỗng')}
<p>Look again at the list above: Long had created packages <code>dao</code> and <code>model</code> in NetBeans, yet neither appears. A Java package with no class yet is an <em>empty folder</em>, and Git stores files, not folders. Khoa and Tú cloned and asked "where are the packages?". Real output:</p>
<pre><code class="language-bash">ls src/main/java/com/nhom/
git ls-files</code></pre>
<div class="out">controller	dao	model
.gitignore
pom.xml
src/main/java/com/nhom/controller/LoginServlet.java
src/main/resources/db.properties.example
src/main/webapp/WEB-INF/web.xml
src/main/webapp/index.jsp</div>
<p>Two fixes. Better: create the first real class in each package (<code>UserDAO.java</code>, <code>User.java</code>). Quick: put an empty placeholder file named <code>.gitkeep</code> (a convention, not a Git feature):</p>
<pre><code class="language-bash">touch src/main/java/com/nhom/dao/.gitkeep src/main/java/com/nhom/model/.gitkeep
git status --short
git add . &amp;&amp; git commit -m <span class="tok-string">"NT-1 giữ thư mục dao/ và model/ bằng .gitkeep"</span></code></pre>
<div class="out">?? src/main/java/com/nhom/dao/
?? src/main/java/com/nhom/model/
[main f24c332] NT-1 giữ thư mục dao/ và model/ bằng .gitkeep
 2 files changed, 0 insertions(+), 0 deletions(-)</div>
<p><code>touch</code> works in Git Bash and Terminal; in File Explorer you can also create a new text file and rename it.</p>

<h3>Connect and push — and what master vs main means</h3>
<pre><code class="language-bash">git remote add origin https://github.com/longbh2006/prj301-nhom.git
git branch -M main
git push -u origin main</code></pre>
<div class="out">Enumerating objects: 26, done.
Counting objects: 100% (26/26), done.
Delta compression using up to 10 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (26/26), 1.92 KiB | 1.92 MiB/s, done.
Total 26 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/longbh2006/prj301-nhom.git
 * [new branch]      main -&gt; main
branch 'main' set up to track 'origin/main'.</div>
<p><code>git branch -M main</code> renames whatever branch you are on to <code>main</code>. It is there because a laptop without <code>init.defaultBranch main</code> (KĐ.2) starts repositories on <code>master</code>, while GitHub calls the default branch <code>main</code>. Long's version of this — <code>git switch main</code> answering <code>fatal: invalid reference: main</code>, then <code>git branch -m master main</code> answering <code>fatal: no branch named 'master'</code> once it had already been renamed — is replayed on real output in KĐ.9. The habit that prevents both: type <code>git branch</code> first and read the <code>*</code>.</p>
<p>Refresh the repository page on GitHub: files listed, branch <code>main</code>, 2 commits, and no <code>target</code> folder. That is the state every teammate will clone.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Leader on GitHub; everyone can rehearse locally with a fake "GitHub" made by <code>git init --bare</code>:</p><ol><li>Make a fake remote: <code>git init --bare ~/Code/gia-github/prj301-thu.git</code> (Windows Git Bash: write <code>/c/Code</code> wherever this practice says <code>~/Code</code>).</li><li>Make a project: <code>mkdir -p ~/Code/prj301-thu/src/main/resources ~/Code/prj301-thu/target ~/Code/prj301-thu/src/main/java/com/nhom/dao</code>, add a <code>pom.xml</code>, a <code>db.properties</code> with a fake password, and a file in <code>target/</code>.</li><li><code>git init</code>, write the <code>.gitignore</code> above, <code>git add .</code>, and check with <code>git status --short</code> that neither <code>target/</code> nor <code>db.properties</code> is listed — and that <code>dao/</code> is missing until you add <code>.gitkeep</code>.</li><li>Commit, then <code>git remote add origin ~/Code/gia-github/prj301-thu.git</code>, <code>git branch -M main</code>, <code>git push -u origin main</code>.</li><li>Leader only: do the same for real with an empty private repository on github.com.</li></ol>
<p><strong>Done when:</strong> <code>git ls-files</code> lists <code>.gitignore</code>, <code>db.properties.example</code> and <code>dao/.gitkeep</code> but no <code>target/</code> and no <code>db.properties</code>, and <code>git status</code> says <code>Your branch is up to date with 'origin/main'.</code></p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">A project folder whose history Git tracks; on GitHub, the shared copy.</span></div>
  <div class="kv"><span class="k">Private repository</span><span class="v">Visible only to the owner and invited collaborators.</span></div>
  <div class="kv"><span class="k">Unrelated histories</span><span class="v">Two commit chains with no common first commit — README on the web plus <code>git init</code> at home.</span></div>
  <div class="kv"><span class="k">.gitkeep</span><span class="v">An empty placeholder file by convention, so that an otherwise empty folder gets committed.</span></div>
  <div class="kv"><span class="k">.example file</span><span class="v">A committed template of a secret config (<code>db.properties.example</code>) with blank values.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>One leader creates the repository: Private, and README only if you will clone it before adding code.</li><li>Existing code: <code>git init</code> → <code>.gitignore</code> → commit → <code>remote add origin</code> → <code>branch -M main</code> → <code>push -u origin main</code>.</li><li>Ignore <code>target/</code>, <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code>, <code>*.class</code> and <code>db.properties</code>; commit <code>db.properties.example</code>.</li><li>Git does not store empty folders: add a class or a <code>.gitkeep</code>.</li><li><code>refusing to merge unrelated histories</code> on day one = README + local init; join once with <code>--allow-unrelated-histories</code>.</li></ul>

${LX('https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository', '📦', 'GitHub Docs — Creating a new repository', 'Owner, visibility and the README/.gitignore/license options.')}
${LX('https://github.com/github/gitignore', '📋', 'github/gitignore — official templates', 'Java.gitignore and Maven.gitignore are good starting points.')}
${LT('git-16-1-khoi-tao-repo-nhom', '🏗️', 'Lesson 16.1 — Day 0 of a team repository', 'Organizations, CONTRIBUTING, templates, CODEOWNERS and CI — the next level.')}

<div class="pitfall co-tieu-de"><strong>Committing first, ignoring later.</strong> If <code>target/</code> or <code>db.properties</code> went into the first commit, adding them to <code>.gitignore</code> afterwards changes nothing — Git keeps tracking files it already has. Untrack with <code>git rm -r --cached target</code> and <code>git rm --cached src/main/resources/db.properties</code>, commit, and change the SQL Server password if the repository was ever pushed (lesson 1.5).</div>
<p class="note-ct"><strong>Per project, not per machine:</strong> everything in this lesson belongs to <em>this</em> repository. Next term's project, or a new team, means doing KĐ.4 again from scratch.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.4</span>
<h2>Một người tạo repo, một lần — và commit đầu tiên quyết định cả nhóm thừa hưởng gì</h2>
<p class="lead">Chỉ trưởng nhóm làm bài này; các bạn còn lại ngồi xem, vì những lựa chọn ở đây — private hay public, có README hay không, <code>.gitignore</code> chứa gì — được mọi bản clone thừa hưởng suốt cả kỳ. Long đã có sẵn dự án NetBeans trên laptop. Bài này đi theo đúng những lệnh Long đã chạy, trên output thật, cùng hai lỗi làm cả nhóm mất nửa tiếng: một thư mục không bao giờ lên GitHub, và một nhánh tên <code>master</code>.</p>

<h3>Hai cách — chọn một</h3>
${slide(D, 14, 'Trưởng nhóm tạo repo — hai cách, chọn một')}
<p><strong>Cách 1 — trên github.com.</strong> Bấm <strong>+</strong> (góc trên phải) → <strong>New repository</strong>. Owner (chủ sở hữu): tài khoản của bạn. Repository name: <code>prj301-nhom</code>. Visibility (chế độ hiển thị): <strong>Private</strong> (bài có chấm điểm thì không để công khai, trừ khi giảng viên yêu cầu). Rồi tới câu hỏi duy nhất quan trọng: <strong>Add README</strong>.</p>
<ul>
<li><strong>Bật README</strong> → repo được tạo kèm một commit ("Initial commit"). Bước tiếp theo đúng là <em>clone</em> nó về (KĐ.6), chép file dự án vào bản clone, commit, push. Hợp khi code chưa có gì.</li>
<li><strong>Tắt README</strong> → repo rỗng, GitHub hiện trang "Quick setup" có khối <em>…or push an existing repository from the command line</em>. Hợp khi code đã nằm sẵn trên laptop — đúng trường hợp của Long — và dẫn thẳng sang cách 2.</li>
</ul>
<p><strong>Cách 2 — từ terminal</strong>, khi dự án đã có trên ổ đĩa. Lệnh giống nhau trong Git Bash và Terminal của Mac:</p>
<pre><code class="language-bash">cd /c/Code/prj301-nhom          <span class="tok-comment"># Mac: cd ~/Code/prj301-nhom</span>
git init
<span class="tok-comment"># viết .gitignore (bên dưới), rồi:</span>
git add .
git commit -m <span class="tok-string">"NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)"</span>
git remote add origin https://github.com/longbh2006/prj301-nhom.git
git branch -M main
git push -u origin main</code></pre>
<p>Ba dòng cuối chính là thứ trang Quick setup của GitHub hiện cho một repo rỗng. Đã cài gh và đăng nhập (KĐ.3) thì một lệnh thay cho "tạo trên web + remote add + push": <code>gh repo create prj301-nhom --private --source . --push</code> (theo <code>gh repo create --help</code>: <code>--source</code> = một kho cục bộ có sẵn, <code>--push</code> = đẩy các commit của nó lên).</p>

<h3>Con đường lai bị gãy: tích README trên web mà vẫn git init ở nhà</h3>
${slide(D, 15, 'Tích README rồi lại git init ở máy = hai lịch sử không chung gốc')}
<p>Nếu bạn tích README trên web <em>và</em> chạy <code>git init</code> + commit trên laptop, bạn đang có hai lịch sử không có commit tổ tiên chung. Push bị từ chối, và pull trần cũng từ chối (output thật, git 2.51.1):</p>
<pre><code class="language-bash">git push -u origin main</code></pre>
<div class="out">To https://github.com/longbh2006/prj301-readme.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'https://github.com/longbh2006/prj301-readme.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.</div>
<pre><code class="language-bash">git pull --no-rebase origin main</code></pre>
<div class="out">From https://github.com/longbh2006/prj301-readme
 * branch            main       -&gt; FETCH_HEAD
fatal: refusing to merge unrelated histories</div>
<p>Vì trên GitHub chưa có gì quan trọng, nối hai lịch sử một lần, nói rõ ý định, rồi push:</p>
<pre><code class="language-bash">git pull --no-rebase origin main --allow-unrelated-histories --no-edit
git push -u origin main</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 README.md | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
To https://github.com/longbh2006/prj301-readme.git
   5a22ac7..ed7d6ab  main -&gt; main
branch 'main' set up to track 'origin/main'.</div>
<p>(Thiếu <code>pull.rebase false</code> ở KĐ.2 thì lệnh pull sẽ dừng trước ở <code>fatal: Need to specify how to reconcile divergent branches.</code> — vì thế ở đây ghi rõ <code>--no-rebase</code>.) Chỉ dùng <code>--allow-unrelated-histories</code> cho đúng tình huống ngày đầu này; gặp nó về sau nghĩa là có chuyện khác sai.</p>

<h3>.gitignore cho dự án web NetBeans + Maven — trước lần add đầu tiên</h3>
${slide(D, 16, '.gitignore cho NetBeans + Maven và db.properties')}
<p>Ngay sau <code>git init</code>, <code>git status</code> trên dự án của Long hiện bốn thứ chờ add, trong đó hai thứ không bao giờ được commit:</p>
<div class="out">On branch main

No commits yet

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	nbproject/
	pom.xml
	src/
	target/</div>
<p><code>target/</code> là sản phẩm build của Maven (file <code>.class</code> đã biên dịch, file <code>.war</code>); <code>nbproject/private/</code> chứa đường dẫn chỉ tồn tại trên laptop của Long (thư mục Tomcat của Long). Ai build cũng tự sinh ra mấy thứ này. Tạo <code>.gitignore</code> ở thư mục gốc dự án:</p>
<pre><code><span class="tok-comment"># Maven / NetBeans — sinh ra khi build, ai build cũng có</span>
target/
build/
dist/
nbproject/private/
*.class

<span class="tok-comment"># Bí mật: mật khẩu SQL Server của từng máy</span>
src/main/resources/db.properties

<span class="tok-comment"># Rác của hệ điều hành</span>
.DS_Store
Thumbs.db</code></pre>
<p><code>build/</code> và <code>dist/</code> phủ luôn kiểu dự án web NetBeans cũ dùng Ant. Rồi commit một file mẫu đặt cạnh file thật: <code>src/main/resources/db.properties.example</code> có đủ mọi khoá, mật khẩu để trống. Mỗi bạn chép nó thành <code>db.properties</code> và điền mật khẩu SQL Server của máy mình (KĐ.6). Nếu code còn ghi cứng <code>sa</code>/mật khẩu trong một file <code>DBContext.java</code>, chuyển chúng sang <code>db.properties</code> ngay — mật khẩu nằm trong file <code>.java</code> thì bị commit theo.</p>
<pre><code class="language-bash">git add .
git status --short
git commit -m <span class="tok-string">"NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)"</span>
git check-ignore -v src/main/resources/db.properties</code></pre>
<div class="out">A  .gitignore
A  pom.xml
A  src/main/java/com/nhom/controller/LoginServlet.java
A  src/main/resources/db.properties.example
A  src/main/webapp/WEB-INF/web.xml
A  src/main/webapp/index.jsp
[main (root-commit) 84a3412] NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)
 6 files changed, 33 insertions(+)
.gitignore:9:src/main/resources/db.properties	src/main/resources/db.properties</div>
<p>Không có <code>target/</code>, không có <code>nbproject/private/</code>, không có <code>db.properties</code> — và <code>check-ignore</code> chỉ đúng dòng đang bảo vệ file mật khẩu.</p>

<h3>Với Git, thư mục rỗng không tồn tại</h3>
${slide(D, 17, 'Package mới không hiện — Git không lưu thư mục rỗng')}
<p>Nhìn lại danh sách phía trên: Long đã tạo package <code>dao</code> và <code>model</code> trong NetBeans, vậy mà không cái nào xuất hiện. Một package Java chưa có class nào là một <em>thư mục rỗng</em>, và Git lưu file, không lưu thư mục. Khoa và Tú clone về rồi hỏi "package đâu?". Output thật:</p>
<pre><code class="language-bash">ls src/main/java/com/nhom/
git ls-files</code></pre>
<div class="out">controller	dao	model
.gitignore
pom.xml
src/main/java/com/nhom/controller/LoginServlet.java
src/main/resources/db.properties.example
src/main/webapp/WEB-INF/web.xml
src/main/webapp/index.jsp</div>
<p>Hai cách sửa. Tốt hơn: tạo luôn class thật đầu tiên trong mỗi package (<code>UserDAO.java</code>, <code>User.java</code>). Nhanh: đặt một file rỗng tên <code>.gitkeep</code> (một quy ước, không phải tính năng của Git):</p>
<pre><code class="language-bash">touch src/main/java/com/nhom/dao/.gitkeep src/main/java/com/nhom/model/.gitkeep
git status --short
git add . &amp;&amp; git commit -m <span class="tok-string">"NT-1 giữ thư mục dao/ và model/ bằng .gitkeep"</span></code></pre>
<div class="out">?? src/main/java/com/nhom/dao/
?? src/main/java/com/nhom/model/
[main f24c332] NT-1 giữ thư mục dao/ và model/ bằng .gitkeep
 2 files changed, 0 insertions(+), 0 deletions(-)</div>
<p><code>touch</code> chạy được trong Git Bash và Terminal; trong File Explorer bạn cũng có thể tạo file văn bản mới rồi đổi tên.</p>

<h3>Nối và push — và master với main nghĩa là gì</h3>
<pre><code class="language-bash">git remote add origin https://github.com/longbh2006/prj301-nhom.git
git branch -M main
git push -u origin main</code></pre>
<div class="out">Enumerating objects: 26, done.
Counting objects: 100% (26/26), done.
Delta compression using up to 10 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (26/26), 1.92 KiB | 1.92 MiB/s, done.
Total 26 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
To https://github.com/longbh2006/prj301-nhom.git
 * [new branch]      main -&gt; main
branch 'main' set up to track 'origin/main'.</div>
<p><code>git branch -M main</code> đổi tên nhánh bạn đang đứng thành <code>main</code>. Nó có mặt vì máy chưa đặt <code>init.defaultBranch main</code> (KĐ.2) sẽ tạo kho mới ở nhánh <code>master</code>, trong khi GitHub gọi nhánh mặc định là <code>main</code>. Phiên bản của Long — <code>git switch main</code> trả lời <code>fatal: invalid reference: main</code>, rồi <code>git branch -m master main</code> trả lời <code>fatal: no branch named 'master'</code> khi nhánh đã được đổi tên rồi — được chạy lại trên output thật ở KĐ.9. Thói quen phòng cả hai: gõ <code>git branch</code> trước, đọc dấu <code>*</code>.</p>
<p>Tải lại trang repo trên GitHub: thấy danh sách file, nhánh <code>main</code>, 2 commit, và không có thư mục <code>target</code>. Đó là trạng thái mọi bạn trong nhóm sẽ clone về.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Trưởng nhóm làm trên GitHub thật; ai cũng tập được ở máy với một "GitHub giả" tạo bằng <code>git init --bare</code>:</p><ol><li>Tạo remote giả: <code>git init --bare ~/Code/gia-github/prj301-thu.git</code> (Git Bash trên Windows: chỗ nào bài tập ghi <code>~/Code</code> thì viết <code>/c/Code</code>).</li><li>Tạo dự án: <code>mkdir -p ~/Code/prj301-thu/src/main/resources ~/Code/prj301-thu/target ~/Code/prj301-thu/src/main/java/com/nhom/dao</code>, thêm một <code>pom.xml</code>, một <code>db.properties</code> có mật khẩu giả, và một file trong <code>target/</code>.</li><li><code>git init</code>, viết <code>.gitignore</code> như trên, <code>git add .</code>, rồi kiểm bằng <code>git status --short</code> rằng không có <code>target/</code> lẫn <code>db.properties</code> — và <code>dao/</code> vắng mặt cho tới khi thêm <code>.gitkeep</code>.</li><li>Commit, rồi <code>git remote add origin ~/Code/gia-github/prj301-thu.git</code>, <code>git branch -M main</code>, <code>git push -u origin main</code>.</li><li>Riêng trưởng nhóm: làm lại y như vậy với một repo private rỗng thật trên github.com.</li></ol>
<p><strong>Đạt khi:</strong> <code>git ls-files</code> có <code>.gitignore</code>, <code>db.properties.example</code> và <code>dao/.gitkeep</code> nhưng không có <code>target/</code> và không có <code>db.properties</code>, và <code>git status</code> báo <code>Your branch is up to date with 'origin/main'.</code></p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">Kho mã — thư mục dự án được Git theo dõi lịch sử; trên GitHub là bản chung.</span></div>
  <div class="kv"><span class="k">Private repository</span><span class="v">Repo riêng tư — chỉ chủ repo và người được mời thấy.</span></div>
  <div class="kv"><span class="k">Unrelated histories</span><span class="v">Lịch sử không liên quan — hai chuỗi commit không có commit đầu chung: README trên web cộng <code>git init</code> ở nhà.</span></div>
  <div class="kv"><span class="k">.gitkeep</span><span class="v">File giữ chỗ rỗng theo quy ước, để một thư mục đang trống được commit.</span></div>
  <div class="kv"><span class="k">File .example</span><span class="v">File mẫu — bản được commit của một cấu hình bí mật (<code>db.properties.example</code>), giá trị để trống.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một trưởng nhóm tạo repo: Private, và chỉ bật README nếu sẽ clone về trước khi có code.</li><li>Code có sẵn: <code>git init</code> → <code>.gitignore</code> → commit → <code>remote add origin</code> → <code>branch -M main</code> → <code>push -u origin main</code>.</li><li>Bỏ qua <code>target/</code>, <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code>, <code>*.class</code> và <code>db.properties</code>; commit <code>db.properties.example</code>.</li><li>Git không lưu thư mục rỗng: thêm một class hoặc một <code>.gitkeep</code>.</li><li><code>refusing to merge unrelated histories</code> ngày đầu = README + init ở máy; nối một lần bằng <code>--allow-unrelated-histories</code>.</li></ul>

${LX('https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository', '📦', 'GitHub Docs — Tạo repository mới', 'Owner, chế độ hiển thị và các lựa chọn README/.gitignore/license.')}
${LX('https://github.com/github/gitignore', '📋', 'github/gitignore — mẫu chính thức', 'Java.gitignore và Maven.gitignore là điểm xuất phát tốt.')}
${LT('git-16-1-khoi-tao-repo-nhom', '🏗️', 'Bài 16.1 — Ngày 0 của một repo nhóm', 'Organization, CONTRIBUTING, mẫu issue/PR, CODEOWNERS và CI — nấc tiếp theo.')}

<div class="pitfall co-tieu-de"><strong>Commit trước, ignore sau.</strong> Nếu <code>target/</code> hay <code>db.properties</code> đã vào commit đầu tiên, thêm chúng vào <code>.gitignore</code> sau đó chẳng thay đổi gì — Git tiếp tục theo dõi file nó đã có. Gỡ theo dõi bằng <code>git rm -r --cached target</code> và <code>git rm --cached src/main/resources/db.properties</code>, commit, và đổi mật khẩu SQL Server nếu repo đã từng được push (bài 1.5).</div>
<p class="note-ct"><strong>Theo dự án, không theo máy:</strong> mọi thứ trong bài này thuộc về <em>repo này</em>. Đồ án kỳ sau, hay một nhóm mới, nghĩa là làm lại KĐ.4 từ đầu.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.5 ─────────────────────────── */
    {
      title: 'KĐ.5 — Inviting members: collaborators, pending invitations and checking access|||KĐ.5 — Mời thành viên: collaborator, lời mời đang chờ và kiểm tra quyền truy cập',
      slug: 'git-kd-5-moi-thanh-vien',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Trưởng nhóm mời bạn vào repo private (Settings → Collaborators → Add people), lời mời chờ và hết hạn sau 7 ngày, thành viên chấp nhận qua email hoặc github.com/notifications, collaborator được làm gì, vì sao 404 nghĩa là chưa nhận lời mời, và khoá main khi có GitHub Pro.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.5</span>
<h2>A private repository is invisible until you are invited — and until you say yes</h2>
<p class="lead">After KĐ.4 the repository exists, but only Long can see it. Tú opened the link from the group chat and got GitHub's 404 page: "This is not the web page you are looking for." Nothing was broken. A private repository pretends not to exist for everyone who is not a collaborator, and an invitation does nothing until it is accepted. This lesson is the two-person handshake that fixes it: the leader invites, each member accepts, and everyone proves they have access before cloning.</p>

<h3>Before inviting: collect GitHub usernames</h3>
<p>Ask each member for their GitHub <strong>username</strong> — the name in their profile URL, <code>github.com/khoa-nd</code> — not their Gmail, not their student ID. Also check each one is logged into the right account (KĐ.3); inviting <code>khoa-cu</code> when Khoa now uses <code>khoa-nd</code> is how the 403 story started. Do not forget the mentor or lecturer if they should see the code: Cường was invited as <code>cuonghoang1103</code>.</p>

<h3>The leader: Settings → Collaborators → Add people</h3>
${slide(D, 19, 'Mời thành viên — năm bước, hai người')}
<ol>
<li>Open the repository page (<code>github.com/longbh2006/prj301-nhom</code>) and click <strong>Settings</strong> — the last tab under the repository name. If it is not there, open the <strong>…</strong> menu; if it is not in that menu either, you are not the owner.</li>
<li>In the left sidebar, section <strong>Access</strong>, click <strong>Collaborators</strong>. GitHub may ask for your password or a 2FA code again (sudo mode) — that is normal.</li>
<li>Click <strong>Add people</strong>, type the username, click the right person in the list, then the green button <strong>Add <em>name</em> to <em>repository</em></strong>.</li>
<li>The person appears in the list with the label <strong>Pending invite</strong>. Repeat for each member.</li>
</ol>
<p>On GitHub Free, a personal account can add unlimited collaborators to private repositories. GitHub does limit how many invitations you send in 24 hours; a team of four is nowhere near it.</p>

<h3>Each member: accept the invitation</h3>
<p>An invitation is a question, not a permission. Each member must answer it, in one of three places:</p>
<ul>
<li>The <strong>email</strong> GitHub sends to their primary address, with a <strong>View invitation</strong> button.</li>
<li><code>github.com/notifications</code> — the bell icon on GitHub.</li>
<li>Directly: <code>github.com/longbh2006/prj301-nhom/invitations</code> while logged in as the invited account.</li>
</ul>
<p>Click <strong>Accept invitation</strong>. Invitations that nobody answers expire after <strong>7 days</strong> (GitHub changelog, February 2020); the leader then simply invites again. Accepting on the wrong account — a phone still logged in as <code>khoa-cu</code> — gives access to the wrong account, so look at the avatar before clicking.</p>

<h3>Proving you have access — before you clone</h3>
<p>The quickest check is the browser: the repository link opens instead of 404. From the terminal, <code>git ls-remote</code> asks GitHub for the list of branches without downloading anything (Khoa's machine, real output; identical in Git Bash and Terminal):</p>
<pre><code class="language-bash">git ls-remote https://github.com/longbh2006/prj301-nhom.git</code></pre>
<div class="out">f24c3322c7e089ed994a0f9cf355580e9aa99555	HEAD
f24c3322c7e089ed994a0f9cf355580e9aa99555	refs/heads/main</div>
<p>That full hash is the same <code>f24c332</code> Long pushed in KĐ.4. Without access, GitHub gives the same answer it gives for a repository that does not exist:</p>
<div class="out">remote: Repository not found.
fatal: repository 'https://github.com/longbh2006/prj301-nhom.git/' not found</div>
<table>
<thead><tr><th>You see</th><th>Most likely</th><th>Check</th></tr></thead>
<tbody>
<tr><td>404 in the browser / <code>Repository not found</code></td><td>Invitation not accepted yet, or expired</td><td><code>github.com/notifications</code>; ask the leader whether you still show "Pending invite"</td></tr>
<tr><td>Same, but you did accept</td><td>Logged in as another account (browser or Credential Manager)</td><td>Avatar in the browser; <code>gh auth status</code> / <code>git credential-manager github list</code> (KĐ.3)</td></tr>
<tr><td>Same, everyone</td><td>Typo in the URL (<code>prj301_nhom</code> vs <code>prj301-nhom</code>)</td><td>Copy the URL from the green <strong>Code</strong> button, never retype it</td></tr>
</tbody>
</table>

<h3>What a collaborator can and cannot do</h3>
${slide(D, 20, 'Collaborator làm được gì, chủ repo giữ quyền gì')}
<p>On a repository owned by a <em>personal</em> account there is only one level: collaborators can read <strong>and write</strong> — GitHub's docs say collaborators cannot have read-only access there. They can push branches, open, review and merge pull requests, and manage issues. Only the owner can invite people, manage <strong>webhooks</strong> (which is why Long, not Khoa, does the CT Work step in KĐ.10), change visibility, rename the default branch, or delete the repository.</p>
<div class="callout warn"><strong>Protecting main.</strong> Because every collaborator can push, nothing technically stops someone from pushing straight to <code>main</code>. On a <em>private</em> repository, branch protection is part of GitHub Pro (GitHub's plans page lists "Protected branches" under Pro for private repositories). The GitHub Student Developer Pack includes Pro while you are a student (lesson 15.3), so a leader who claims it can require pull requests on <code>main</code>. Without it, the team relies on one agreed rule: <strong>nobody pushes to main; everything goes through a pull request</strong> (KĐ.7). Lesson 16.1 compares this with a GitHub Organization.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Each member posts their GitHub username in the team chat and checks, in a private browser window, that <code>github.com/&lt;username&gt;</code> is really them.</li><li>Leader: Settings → Collaborators → Add people, invite every member (and the mentor). Take a screenshot showing them as <strong>Pending invite</strong>.</li><li>Before accepting, each member runs <code>git ls-remote https://github.com/&lt;leader&gt;/&lt;repo&gt;.git</code> and reads the "not found" answer.</li><li>Each member accepts from email or <code>github.com/notifications</code>, then runs the same <code>git ls-remote</code> again.</li></ol>
<p><strong>Done when:</strong> the Collaborators page lists every member without "Pending invite", the repository link opens for each of them, and each <code>git ls-remote</code> prints a <code>refs/heads/main</code> line with the same hash.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Collaborator</span><span class="v">A GitHub account invited to a personal repository; on a personal repo it always has write access.</span></div>
  <div class="kv"><span class="k">Pending invite</span><span class="v">An invitation sent but not yet accepted; it grants nothing and expires after 7 days.</span></div>
  <div class="kv"><span class="k">git ls-remote</span><span class="v">Lists a remote's branches and their commits without downloading — a cheap access test.</span></div>
  <div class="kv"><span class="k">Branch protection</span><span class="v">Rules on a branch such as "require a pull request"; for private repos it needs GitHub Pro.</span></div>
  <div class="kv"><span class="k">Owner</span><span class="v">The account that owns the repository; only it manages settings, webhooks and invitations.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Leader: Settings → Collaborators → Add people, using GitHub usernames.</li><li>Members: accept from email, <code>github.com/notifications</code> or <code>/invitations</code> — within 7 days.</li><li>404 / <code>Repository not found</code> = not accepted, wrong account, or wrong URL.</li><li>Collaborators on a personal repo can push; only the owner manages webhooks and settings.</li><li>Without Pro, "never push to main" is a team rule, not a lock.</li></ul>

${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository', '👥', 'GitHub Docs — Inviting collaborators to a personal repository', 'The exact menu path and the 24-hour invitation limit.')}
${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-user-account-settings/permission-levels-for-a-personal-account-repository', '🔑', 'GitHub Docs — Permission levels for a personal account repository', 'What collaborators can do and what stays with the owner.')}
${LT('git-15-3-student-pack-codespaces', '🎓', 'Lesson 15.3 — Student Developer Pack', 'How to get GitHub Pro (and protected branches) as a student.')}

<div class="pitfall co-tieu-de"><strong>Sharing the leader's password instead.</strong> Some teams skip invitations and let everyone log in as the leader. Every commit and pull request then shows one author, GitHub sends security alerts for logins from four laptops, and the Contributions report (KĐ.10) credits one person with the whole project. Four accounts, four invitations — always.</div>
<p class="note-ct"><strong>Per project:</strong> inviting is done once per repository. A new project next term means new invitations, even with the same friends.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.5</span>
<h2>Repo private là vô hình cho tới khi bạn được mời — và cho tới khi bạn đồng ý</h2>
<p class="lead">Sau KĐ.4 repo đã tồn tại, nhưng chỉ Long thấy nó. Tú mở link trong nhóm chat và nhận trang 404 của GitHub: "This is not the web page you are looking for." Không có gì hỏng cả. Repo private giả vờ không tồn tại với mọi người không phải collaborator (cộng tác viên), và lời mời chẳng có tác dụng gì cho tới khi được chấp nhận. Bài này là cái bắt tay hai người để sửa chuyện đó: trưởng nhóm mời, từng thành viên chấp nhận, và ai cũng chứng minh mình có quyền trước khi clone.</p>

<h3>Trước khi mời: gom username GitHub</h3>
<p>Hỏi từng bạn <strong>username</strong> GitHub — cái tên nằm trong đường dẫn hồ sơ, <code>github.com/khoa-nd</code> — không phải Gmail, không phải mã số sinh viên. Kiểm luôn mỗi bạn đang đăng nhập đúng tài khoản (KĐ.3); mời <code>khoa-cu</code> trong khi Khoa giờ dùng <code>khoa-nd</code> chính là cách câu chuyện 403 bắt đầu. Đừng quên mentor hay giảng viên nếu họ cần xem code: Cường được mời bằng <code>cuonghoang1103</code>.</p>

<h3>Trưởng nhóm: Settings → Collaborators → Add people</h3>
${slide(D, 19, 'Mời thành viên — năm bước, hai người')}
<ol>
<li>Mở trang repo (<code>github.com/longbh2006/prj301-nhom</code>) và bấm <strong>Settings</strong> — tab cuối dưới tên repo. Không thấy thì mở menu <strong>…</strong>; trong đó cũng không có thì bạn không phải chủ repo.</li>
<li>Ở thanh bên trái, mục <strong>Access</strong>, bấm <strong>Collaborators</strong>. GitHub có thể hỏi lại mật khẩu hoặc mã 2FA (chế độ sudo) — bình thường.</li>
<li>Bấm <strong>Add people</strong>, gõ username, bấm đúng người trong danh sách, rồi nút xanh <strong>Add <em>tên</em> to <em>repository</em></strong>.</li>
<li>Người đó hiện trong danh sách kèm nhãn <strong>Pending invite</strong> (lời mời đang chờ). Lặp lại cho từng thành viên.</li>
</ol>
<p>Với GitHub Free, tài khoản cá nhân thêm được không giới hạn collaborator vào repo private. GitHub có giới hạn số lời mời gửi trong 24 giờ; nhóm bốn người còn xa mới chạm tới.</p>

<h3>Từng thành viên: chấp nhận lời mời</h3>
<p>Lời mời là một câu hỏi, chưa phải quyền. Mỗi bạn phải trả lời nó, ở một trong ba chỗ:</p>
<ul>
<li><strong>Email</strong> GitHub gửi tới địa chỉ chính, có nút <strong>View invitation</strong>.</li>
<li><code>github.com/notifications</code> — biểu tượng chuông trên GitHub.</li>
<li>Trực tiếp: <code>github.com/longbh2006/prj301-nhom/invitations</code> khi đang đăng nhập đúng tài khoản được mời.</li>
</ul>
<p>Bấm <strong>Accept invitation</strong>. Lời mời không ai trả lời sẽ hết hạn sau <strong>7 ngày</strong> (changelog GitHub, tháng 2/2020); khi đó trưởng nhóm chỉ việc mời lại. Chấp nhận nhầm tài khoản — điện thoại còn đăng nhập <code>khoa-cu</code> — thì quyền rơi vào tài khoản sai, nên nhìn ảnh đại diện trước khi bấm.</p>

<h3>Chứng minh mình có quyền — trước khi clone</h3>
<p>Cách kiểm nhanh nhất là trình duyệt: link repo mở được thay vì 404. Từ terminal, <code>git ls-remote</code> hỏi GitHub danh sách nhánh mà không tải gì về (máy của Khoa, output thật; giống hệt trong Git Bash và Terminal):</p>
<pre><code class="language-bash">git ls-remote https://github.com/longbh2006/prj301-nhom.git</code></pre>
<div class="out">f24c3322c7e089ed994a0f9cf355580e9aa99555	HEAD
f24c3322c7e089ed994a0f9cf355580e9aa99555	refs/heads/main</div>
<p>Mã băm đầy đủ đó chính là <code>f24c332</code> Long đã push ở KĐ.4. Không có quyền, GitHub trả lời y như với một repo không tồn tại:</p>
<div class="out">remote: Repository not found.
fatal: repository 'https://github.com/longbh2006/prj301-nhom.git/' not found</div>
<table>
<thead><tr><th>Bạn thấy</th><th>Khả năng cao nhất</th><th>Kiểm</th></tr></thead>
<tbody>
<tr><td>404 trên trình duyệt / <code>Repository not found</code></td><td>Chưa nhận lời mời, hoặc lời mời đã hết hạn</td><td><code>github.com/notifications</code>; hỏi trưởng nhóm bạn còn hiện "Pending invite" không</td></tr>
<tr><td>Như trên, dù đã chấp nhận</td><td>Đang đăng nhập tài khoản khác (trình duyệt hoặc Credential Manager)</td><td>Ảnh đại diện trên trình duyệt; <code>gh auth status</code> / <code>git credential-manager github list</code> (KĐ.3)</td></tr>
<tr><td>Như trên, cả nhóm đều bị</td><td>Gõ sai URL (<code>prj301_nhom</code> thay vì <code>prj301-nhom</code>)</td><td>Chép URL từ nút xanh <strong>Code</strong>, đừng bao giờ gõ lại</td></tr>
</tbody>
</table>

<h3>Collaborator được làm gì, không được làm gì</h3>
${slide(D, 20, 'Collaborator làm được gì, chủ repo giữ quyền gì')}
<p>Trên repo thuộc tài khoản <em>cá nhân</em> chỉ có một mức: collaborator được đọc <strong>và ghi</strong> — tài liệu GitHub ghi rõ ở đó collaborator không thể chỉ có quyền đọc. Họ push được nhánh, mở, review và merge pull request, quản lý issue. Chỉ chủ repo mới mời người, quản lý <strong>webhook</strong> (vì thế Long, không phải Khoa, làm bước CT Work ở KĐ.10), đổi chế độ hiển thị, đổi tên nhánh mặc định, hay xoá repo.</p>
<div class="callout warn"><strong>Khoá main.</strong> Vì collaborator nào cũng push được, về kỹ thuật không gì ngăn một bạn push thẳng lên <code>main</code>. Với repo <em>private</em>, branch protection (bảo vệ nhánh) thuộc gói GitHub Pro (trang các gói của GitHub liệt kê "Protected branches" trong Pro cho repo private). GitHub Student Developer Pack tặng Pro khi bạn còn là sinh viên (bài 15.3), nên trưởng nhóm nhận gói này là bắt buộc được pull request trên <code>main</code>. Không có Pro, cả nhóm dựa vào một luật đã thống nhất: <strong>không ai push thẳng main; mọi thứ đi qua pull request</strong> (KĐ.7). Bài 16.1 so sánh với cách dùng GitHub Organization.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Từng thành viên gửi username GitHub vào nhóm chat và kiểm, trong một cửa sổ ẩn danh, rằng <code>github.com/&lt;username&gt;</code> đúng là mình.</li><li>Trưởng nhóm: Settings → Collaborators → Add people, mời mọi thành viên (và mentor). Chụp màn hình lúc họ đang hiện <strong>Pending invite</strong>.</li><li>Trước khi chấp nhận, từng bạn chạy <code>git ls-remote https://github.com/&lt;truong-nhom&gt;/&lt;repo&gt;.git</code> và đọc câu trả lời "not found".</li><li>Từng bạn chấp nhận từ email hoặc <code>github.com/notifications</code>, rồi chạy lại đúng lệnh <code>git ls-remote</code> đó.</li></ol>
<p><strong>Đạt khi:</strong> trang Collaborators liệt kê mọi thành viên mà không còn "Pending invite", link repo mở được với từng bạn, và mỗi lần <code>git ls-remote</code> in ra một dòng <code>refs/heads/main</code> với cùng một mã băm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Collaborator</span><span class="v">Cộng tác viên — tài khoản GitHub được mời vào một repo cá nhân; trên repo cá nhân luôn có quyền ghi.</span></div>
  <div class="kv"><span class="k">Pending invite</span><span class="v">Lời mời đang chờ — đã gửi nhưng chưa được chấp nhận; chưa cho quyền gì và hết hạn sau 7 ngày.</span></div>
  <div class="kv"><span class="k">git ls-remote</span><span class="v">Liệt kê nhánh và commit của remote mà không tải về — phép thử quyền truy cập rẻ nhất.</span></div>
  <div class="kv"><span class="k">Branch protection</span><span class="v">Bảo vệ nhánh — luật trên một nhánh như "bắt buộc pull request"; repo private cần GitHub Pro.</span></div>
  <div class="kv"><span class="k">Owner</span><span class="v">Chủ repo — tài khoản sở hữu repo; chỉ nó quản lý cài đặt, webhook và lời mời.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Trưởng nhóm: Settings → Collaborators → Add people, bằng username GitHub.</li><li>Thành viên: chấp nhận từ email, <code>github.com/notifications</code> hoặc <code>/invitations</code> — trong vòng 7 ngày.</li><li>404 / <code>Repository not found</code> = chưa nhận lời mời, nhầm tài khoản, hoặc sai URL.</li><li>Collaborator trên repo cá nhân push được; chỉ chủ repo quản lý webhook và cài đặt.</li><li>Không có Pro, "không push thẳng main" là luật của nhóm, không phải ổ khoá.</li></ul>

${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository', '👥', 'GitHub Docs — Mời collaborator vào repo cá nhân', 'Đường menu chính xác và giới hạn lời mời trong 24 giờ.')}
${LX('https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-user-account-settings/permission-levels-for-a-personal-account-repository', '🔑', 'GitHub Docs — Mức quyền trên repo của tài khoản cá nhân', 'Collaborator làm được gì và phần nào chỉ chủ repo giữ.')}
${LT('git-15-3-student-pack-codespaces', '🎓', 'Bài 15.3 — Student Developer Pack', 'Cách nhận GitHub Pro (và bảo vệ nhánh) khi là sinh viên.')}

<div class="pitfall co-tieu-de"><strong>Chia nhau mật khẩu của trưởng nhóm cho nhanh.</strong> Vài nhóm bỏ qua lời mời, cả nhóm đăng nhập bằng tài khoản trưởng nhóm. Khi đó mọi commit và pull request chỉ có một tác giả, GitHub gửi cảnh báo bảo mật vì đăng nhập từ bốn laptop, và báo cáo Đóng góp (KĐ.10) ghi công cả dự án cho một người. Bốn tài khoản, bốn lời mời — luôn luôn.</div>
<p class="note-ct"><strong>Theo dự án:</strong> mời thành viên làm một lần cho mỗi repo. Dự án mới kỳ sau nghĩa là mời lại, dù vẫn là những người bạn cũ.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.6 ─────────────────────────── */
    {
      title: 'KĐ.6 — Members get the project: git clone once, never the ZIP, and open THAT folder|||KĐ.6 — Thành viên lấy dự án về: git clone một lần, đừng tải ZIP, và mở ĐÚNG thư mục đó',
      slug: 'git-kd-6-clone-du-an',
      type: 'LESSON',
      isFreePreview: true,
      description: 'git clone tải code + toàn bộ lịch sử + đường nối origin, còn Download ZIP thì không — chuyện "pull được mà NetBeans vẫn code cũ" của Tú; cd vào bản clone, kiểm bằng git status / git remote -v, mở đúng thư mục trong NetBeans / VS Code, và tạo db.properties từ file mẫu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.6</span>
<h2>Getting the project is one command, once — and then you must open the copy you got</h2>
<p class="lead">On the second evening Tú said: "I ran <code>git pull</code>, it worked, but NetBeans still shows yesterday's code." It took twenty minutes to find out why. The day before, he had clicked GitHub's <strong>Code → Download ZIP</strong>, unzipped it in Downloads and opened <em>that</em> folder in NetBeans. Separately, following the team chat, he had also run <code>git clone</code> in <code>C:\\Users\\Lenovo</code>. His pulls updated the clone; NetBeans kept showing the ZIP. Two copies, and he was editing the one Git did not know about.</p>

<h3>Clone vs Download ZIP</h3>
${slide(D, 21, 'Clone một lần — đừng tải ZIP')}
<table>
<thead><tr><th></th><th><code>git clone &lt;URL&gt;</code></th><th>Code → Download ZIP</th></tr></thead>
<tbody>
<tr><td>Files of the latest commit</td><td>yes</td><td>yes</td></tr>
<tr><td>Whole history (<code>.git</code> folder)</td><td>yes</td><td><strong>no</strong></td></tr>
<tr><td>Knows where it came from (<code>origin</code>)</td><td>yes</td><td><strong>no</strong></td></tr>
<tr><td>Can <code>pull</code> / <code>push</code></td><td>yes</td><td><strong>no</strong> — <code>fatal: not a git repository</code></td></tr>
<tr><td>Folder name</td><td><code>prj301-nhom</code></td><td><code>prj301-nhom-main</code></td></tr>
</tbody>
</table>
<p>A ZIP is a photocopy of one page. A clone is your own complete copy of the notebook, with the address of the library written inside the cover. Real output in Tú's unzipped folder (it behaves the same in Git Bash and Terminal):</p>
<pre><code class="language-bash">cd ~/Downloads/prj301-nhom-main
ls -a
git status</code></pre>
<div class="out">.		..		.gitignore	pom.xml		src
fatal: not a git repository (or any of the parent directories): .git</div>
<p>No <code>.git</code>. Delete that folder (after copying out any change you made in it), and from now on only the clone exists.</p>

<h3>Clone — once per project, per machine</h3>
<p>On GitHub, click the green <strong>Code</strong> button, tab <strong>HTTPS</strong>, and copy the URL. Then, in Git Bash or Terminal, <em>first</em> go to your code shelf from KĐ.1, because <code>git clone</code> creates the project folder inside the folder you are standing in:</p>
<pre><code class="language-bash">cd /c/Code                         <span class="tok-comment"># Mac: cd ~/Code</span>
git clone https://github.com/longbh2006/prj301-nhom.git</code></pre>
<div class="out">Cloning into 'prj301-nhom'...
remote: Enumerating objects: 26, done.
remote: Counting objects: 100% (26/26), done.
remote: Compressing objects: 100% (13/13), done.
remote: Total 26 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (26/26), done.
Resolving deltas: 100% (2/2), done.</div>
<p>A Windows member who has never signed in sees the Git Credential Manager window here (KĐ.3) — the repository is private, so even reading it needs a login. One clone does three things at once: downloads every file of <code>main</code>, downloads the complete history, and records the URL under the nickname <code>origin</code>. You never clone the same project again on that laptop; from tomorrow you <code>pull</code>.</p>

<h3>cd into it — the step everyone forgets</h3>
${slide(D, 22, 'Sau khi clone: ba lệnh kiểm, một file tự tạo')}
<p>After cloning you are still standing <em>outside</em> the project. Every Git command typed now goes to the wrong place:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">fatal: not a git repository (or any of the parent directories): .git</div>
<pre><code class="language-bash">cd prj301-nhom
git status
git remote -v
git log --oneline</code></pre>
<div class="out">On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
origin	https://github.com/longbh2006/prj301-nhom.git (fetch)
origin	https://github.com/longbh2006/prj301-nhom.git (push)
f24c332 NT-1 giữ thư mục dao/ và model/ bằng .gitkeep
84a3412 NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)</div>
<p>Read them as three answers: <em>I am on main and in sync with GitHub</em>; <em>origin points at Long's repository</em>; <em>I have the same two commits Long pushed</em>. If <code>git remote -v</code> shows someone else's repository, or nothing at all, you are in the wrong folder.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">See hidden .git</span><span class="v"><code>ls -a</code> in Git Bash/Terminal; in File Explorer enable View → Show → Hidden items; in Finder press <code>Cmd+Shift+.</code></span></div>
  <div class="kv"><span class="k">All branches</span><span class="v"><code>git branch -a</code> shows <code>main</code> plus <code>remotes/origin/main</code> — GitHub's copy as last seen.</span></div>
</div>

<h3>Open THAT folder in your IDE</h3>
<ul>
<li><strong>NetBeans:</strong> <strong>File → Open Project…</strong>, browse to <code>C:\\Code\\prj301-nhom</code> (Mac: <code>~/Code/prj301-nhom</code>). A Maven project shows a special icon; select it and click <strong>Open Project</strong>. Because the folder contains <code>.git</code>, NetBeans' <strong>Team</strong> menu now offers Git actions too.</li>
<li><strong>VS Code:</strong> <strong>File → Open Folder…</strong> and choose the same folder. The Source Control panel lights up (Chapter 14.1).</li>
<li>If NetBeans already had the ZIP project open: right-click it → <strong>Close</strong> first. Two projects with the same name in one IDE is how Tú kept editing the wrong one.</li>
</ul>

<h3>The one file you create yourself: db.properties</h3>
<p>The clone has <code>db.properties.example</code> but not <code>db.properties</code> — on purpose (KĐ.4). Copy it and put <em>your</em> SQL Server password in the copy:</p>
<pre><code class="language-bash">cp src/main/resources/db.properties.example src/main/resources/db.properties
git status --short
git check-ignore -v src/main/resources/db.properties</code></pre>
<div class="out">.gitignore:9:src/main/resources/db.properties	src/main/resources/db.properties</div>
<p><code>git status --short</code> prints nothing: the new file is ignored, so it can never be committed by accident. (In CMD the copy command is <code>copy</code> with backslashes; in Git Bash <code>cp</code> works as shown.) If the project also has <code>database/setup.sql</code>, run it once in SQL Server Management Studio so your local database matches the code.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>If you ever downloaded a ZIP of the team project, find it (<code>Downloads</code>), close it in NetBeans, and delete it.</li><li><code>cd /c/Code</code> (Mac: <code>cd ~/Code</code>) and <code>git clone</code> the team repository using the URL from the green <strong>Code</strong> button.</li><li>Run <code>git status</code> once <em>before</em> <code>cd</code> (read the error), then <code>cd prj301-nhom</code> and run <code>git status</code>, <code>git remote -v</code>, <code>git log --oneline</code>.</li><li>Create <code>db.properties</code> from the example, fill your password, confirm <code>git status --short</code> stays empty.</li><li>Open the folder in NetBeans (File → Open Project) and run the project once.</li></ol>
<p><strong>Done when:</strong> <code>git remote -v</code> shows the leader's URL, <code>git log --oneline</code> shows the same top hash as the leader's, NetBeans' project path (right-click project → <strong>Properties</strong>) is inside <code>C:\\Code</code> / <code>~/Code</code>, and no ZIP copy remains.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Clone</span><span class="v">A full copy of a repository — files, history and the <code>origin</code> link — made once.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">The nickname <code>git clone</code> gives to the URL it cloned from.</span></div>
  <div class="kv"><span class="k">.git folder</span><span class="v">The hidden folder holding the history; without it a folder is not a repository.</span></div>
  <div class="kv"><span class="k">Download ZIP</span><span class="v">A snapshot of files only, with no history and no way to pull or push.</span></div>
  <div class="kv"><span class="k">Working tree clean</span><span class="v">Your files match the last commit; nothing to add or commit.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Clone once per project per laptop; never use Download ZIP for a team project.</li><li><code>cd /c/Code</code> or <code>~/Code</code> before cloning, <code>cd prj301-nhom</code> after.</li><li>Check with <code>git status</code>, <code>git remote -v</code>, <code>git log --oneline</code>.</li><li>Open exactly that folder in NetBeans / VS Code, and close any other copy.</li><li>Create <code>db.properties</code> from the <code>.example</code>; it stays ignored.</li></ul>

${LX('https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository', '📥', 'GitHub Docs — Cloning a repository', 'Where the Code button is and what each URL type means.')}
${LX('https://git-scm.com/docs/git-clone', '📖', 'git clone — reference', 'Every option, including cloning into a folder with a different name.')}
${LT('git-5-1-remote-fetch-pull', '🔁', 'Lesson 5.1 — Remotes, fetch and pull', 'What origin and origin/main really are.')}

<div class="pitfall co-tieu-de"><strong>Cloning inside another repository.</strong> Running <code>git clone</code> while standing inside <code>prj301-nhom</code> (or inside a OneDrive folder that is itself a repo) puts a repository inside a repository. Git then shows the inner one as a strange untracked folder, and the outer one may even try to commit it. Always <code>pwd</code> before <code>git clone</code>: you should be on the shelf (<code>/c/Code</code>), not in a project.</div>
<p class="note-ct"><strong>Tú's rule, now the team's rule:</strong> one project, one folder, one place — <code>C:\\Code\\prj301-nhom</code>. If you are ever unsure which copy NetBeans has open, right-click the project → Properties and read the path.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.6</span>
<h2>Lấy dự án về là một lệnh, một lần — và sau đó phải mở đúng bản vừa lấy</h2>
<p class="lead">Tối thứ hai Tú nói: "Mình chạy <code>git pull</code> được rồi, mà NetBeans vẫn hiện code hôm qua." Mất hai mươi phút mới tìm ra vì sao. Hôm trước Tú bấm <strong>Code → Download ZIP</strong> trên GitHub, giải nén ở Downloads rồi mở <em>thư mục đó</em> trong NetBeans. Riêng rẽ, theo nhóm chat, Tú cũng chạy <code>git clone</code> ở <code>C:\\Users\\Lenovo</code>. Các lần pull cập nhật bản clone; NetBeans vẫn hiện bản ZIP. Hai bản sao, và Tú đang sửa đúng bản mà Git không hề biết tới.</p>

<h3>Clone hay Download ZIP</h3>
${slide(D, 21, 'Clone một lần — đừng tải ZIP')}
<table>
<thead><tr><th></th><th><code>git clone &lt;URL&gt;</code></th><th>Code → Download ZIP</th></tr></thead>
<tbody>
<tr><td>File của commit mới nhất</td><td>có</td><td>có</td></tr>
<tr><td>Toàn bộ lịch sử (thư mục <code>.git</code>)</td><td>có</td><td><strong>không</strong></td></tr>
<tr><td>Biết mình đến từ đâu (<code>origin</code>)</td><td>có</td><td><strong>không</strong></td></tr>
<tr><td><code>pull</code> / <code>push</code> được</td><td>có</td><td><strong>không</strong> — <code>fatal: not a git repository</code></td></tr>
<tr><td>Tên thư mục</td><td><code>prj301-nhom</code></td><td><code>prj301-nhom-main</code></td></tr>
</tbody>
</table>
<p>File ZIP là bản photo một trang giấy. Bản clone là nguyên một cuốn sổ của riêng bạn, bìa trong ghi sẵn địa chỉ thư viện. Output thật trong thư mục Tú giải nén (Git Bash và Terminal như nhau):</p>
<pre><code class="language-bash">cd ~/Downloads/prj301-nhom-main
ls -a
git status</code></pre>
<div class="out">.		..		.gitignore	pom.xml		src
fatal: not a git repository (or any of the parent directories): .git</div>
<p>Không có <code>.git</code>. Xoá thư mục đó (sau khi chép ra những gì bạn lỡ sửa trong nó), và từ giờ chỉ còn bản clone tồn tại.</p>

<h3>Clone — một lần cho mỗi dự án, trên mỗi máy</h3>
<p>Trên GitHub, bấm nút xanh <strong>Code</strong>, tab <strong>HTTPS</strong>, chép URL. Rồi trong Git Bash hoặc Terminal, <em>trước tiên</em> đi tới cái kệ để code từ KĐ.1, vì <code>git clone</code> tạo thư mục dự án ngay bên trong thư mục bạn đang đứng:</p>
<pre><code class="language-bash">cd /c/Code                         <span class="tok-comment"># Mac: cd ~/Code</span>
git clone https://github.com/longbh2006/prj301-nhom.git</code></pre>
<div class="out">Cloning into 'prj301-nhom'...
remote: Enumerating objects: 26, done.
remote: Counting objects: 100% (26/26), done.
remote: Compressing objects: 100% (13/13), done.
remote: Total 26 (delta 2), reused 0 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (26/26), done.
Resolving deltas: 100% (2/2), done.</div>
<p>Bạn Windows chưa từng đăng nhập sẽ thấy cửa sổ Git Credential Manager ngay ở bước này (KĐ.3) — repo là private nên chỉ đọc thôi cũng cần đăng nhập. Một lần clone làm ba việc cùng lúc: tải mọi file của <code>main</code>, tải toàn bộ lịch sử, và ghi URL dưới biệt danh <code>origin</code>. Trên laptop đó bạn không bao giờ clone lại dự án này; từ ngày mai bạn <code>pull</code>.</p>

<h3>cd vào trong — bước ai cũng quên</h3>
${slide(D, 22, 'Sau khi clone: ba lệnh kiểm, một file tự tạo')}
<p>Clone xong bạn vẫn đang đứng <em>bên ngoài</em> dự án. Mọi lệnh git gõ lúc này đều đi nhầm chỗ:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">fatal: not a git repository (or any of the parent directories): .git</div>
<pre><code class="language-bash">cd prj301-nhom
git status
git remote -v
git log --oneline</code></pre>
<div class="out">On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
origin	https://github.com/longbh2006/prj301-nhom.git (fetch)
origin	https://github.com/longbh2006/prj301-nhom.git (push)
f24c332 NT-1 giữ thư mục dao/ và model/ bằng .gitkeep
84a3412 NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)</div>
<p>Đọc chúng như ba câu trả lời: <em>tôi đang ở main và khớp với GitHub</em>; <em>origin trỏ tới repo của Long</em>; <em>tôi có đúng hai commit Long đã push</em>. Nếu <code>git remote -v</code> hiện repo của người khác, hoặc không hiện gì, bạn đang đứng sai thư mục.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Xem thư mục ẩn .git</span><span class="v"><code>ls -a</code> trong Git Bash/Terminal; File Explorer bật View → Show → Hidden items; Finder bấm <code>Cmd+Shift+.</code></span></div>
  <div class="kv"><span class="k">Mọi nhánh</span><span class="v"><code>git branch -a</code> hiện <code>main</code> cùng <code>remotes/origin/main</code> — bản của GitHub theo lần nhìn gần nhất.</span></div>
</div>

<h3>Mở ĐÚNG thư mục đó trong IDE</h3>
<ul>
<li><strong>NetBeans:</strong> <strong>File → Open Project…</strong>, tìm tới <code>C:\\Code\\prj301-nhom</code> (Mac: <code>~/Code/prj301-nhom</code>). Dự án Maven có biểu tượng riêng; chọn nó rồi bấm <strong>Open Project</strong>. Vì thư mục có <code>.git</code>, menu <strong>Team</strong> của NetBeans giờ có thêm các thao tác Git.</li>
<li><strong>VS Code:</strong> <strong>File → Open Folder…</strong> và chọn cùng thư mục đó. Bảng Source Control sáng lên (Chương 14.1).</li>
<li>Nếu NetBeans đang mở dự án từ bản ZIP: chuột phải nó → <strong>Close</strong> trước. Hai dự án trùng tên trong một IDE chính là lý do Tú cứ sửa nhầm bản.</li>
</ul>

<h3>File duy nhất bạn tự tạo: db.properties</h3>
<p>Bản clone có <code>db.properties.example</code> nhưng không có <code>db.properties</code> — cố ý như vậy (KĐ.4). Chép nó ra và điền mật khẩu SQL Server <em>của bạn</em> vào bản chép:</p>
<pre><code class="language-bash">cp src/main/resources/db.properties.example src/main/resources/db.properties
git status --short
git check-ignore -v src/main/resources/db.properties</code></pre>
<div class="out">.gitignore:9:src/main/resources/db.properties	src/main/resources/db.properties</div>
<p><code>git status --short</code> không in gì: file mới đã bị bỏ qua (ignored), nên không bao giờ lỡ tay commit được. (Trong CMD lệnh chép là <code>copy</code> với dấu gạch ngược; trong Git Bash dùng <code>cp</code> như trên.) Nếu dự án có <code>database/setup.sql</code>, chạy nó một lần trong SQL Server Management Studio để database trên máy bạn khớp với code.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Nếu từng tải ZIP dự án của nhóm, tìm nó (<code>Downloads</code>), đóng nó trong NetBeans, và xoá đi.</li><li><code>cd /c/Code</code> (Mac: <code>cd ~/Code</code>) rồi <code>git clone</code> repo của nhóm bằng URL lấy từ nút xanh <strong>Code</strong>.</li><li>Chạy <code>git status</code> một lần <em>trước</em> khi <code>cd</code> (đọc lỗi), rồi <code>cd prj301-nhom</code> và chạy <code>git status</code>, <code>git remote -v</code>, <code>git log --oneline</code>.</li><li>Tạo <code>db.properties</code> từ file mẫu, điền mật khẩu, xác nhận <code>git status --short</code> vẫn trống.</li><li>Mở thư mục trong NetBeans (File → Open Project) và chạy dự án một lần.</li></ol>
<p><strong>Đạt khi:</strong> <code>git remote -v</code> hiện URL của trưởng nhóm, <code>git log --oneline</code> có mã băm trên cùng trùng của trưởng nhóm, đường dẫn dự án trong NetBeans (chuột phải dự án → <strong>Properties</strong>) nằm trong <code>C:\\Code</code> / <code>~/Code</code>, và không còn bản ZIP nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Clone</span><span class="v">Nhân bản — bản sao đầy đủ của repo: file, lịch sử và đường nối <code>origin</code>; làm một lần.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">Biệt danh mà <code>git clone</code> đặt cho URL nó đã clone từ đó.</span></div>
  <div class="kv"><span class="k">Thư mục .git</span><span class="v">Thư mục ẩn chứa lịch sử; thiếu nó thì một thư mục không phải là repo.</span></div>
  <div class="kv"><span class="k">Download ZIP</span><span class="v">Tải file nén — chỉ có ảnh chụp các file, không lịch sử, không pull/push được.</span></div>
  <div class="kv"><span class="k">Working tree clean</span><span class="v">Thư mục làm việc sạch — file khớp commit cuối; không có gì để add hay commit.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Clone một lần cho mỗi dự án trên mỗi laptop; dự án nhóm thì không bao giờ dùng Download ZIP.</li><li><code>cd /c/Code</code> hoặc <code>~/Code</code> trước khi clone, <code>cd prj301-nhom</code> sau khi clone.</li><li>Kiểm bằng <code>git status</code>, <code>git remote -v</code>, <code>git log --oneline</code>.</li><li>Mở đúng thư mục đó trong NetBeans / VS Code, và đóng mọi bản sao khác.</li><li>Tạo <code>db.properties</code> từ file <code>.example</code>; nó luôn bị bỏ qua.</li></ul>

${LX('https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository', '📥', 'GitHub Docs — Clone một repository', 'Nút Code nằm ở đâu và mỗi loại URL nghĩa là gì.')}
${LX('https://git-scm.com/docs/git-clone', '📖', 'git clone — tra cứu', 'Mọi tuỳ chọn, kể cả clone vào thư mục mang tên khác.')}
${LT('git-5-1-remote-fetch-pull', '🔁', 'Bài 5.1 — Remote, fetch và pull', 'origin và origin/main thật ra là gì.')}

<div class="pitfall co-tieu-de"><strong>Clone vào bên trong một repo khác.</strong> Chạy <code>git clone</code> khi đang đứng trong <code>prj301-nhom</code> (hoặc trong một thư mục OneDrive mà bản thân nó là repo) sẽ đặt một repo nằm trong một repo. Git khi đó hiện repo bên trong như một thư mục lạ chưa theo dõi, và repo bên ngoài có thể còn định commit nó. Luôn <code>pwd</code> trước <code>git clone</code>: bạn phải đứng ở cái kệ (<code>/c/Code</code>), không phải trong một dự án.</div>
<p class="note-ct"><strong>Luật của Tú, giờ là luật của nhóm:</strong> một dự án, một thư mục, một chỗ — <code>C:\\Code\\prj301-nhom</code>. Khi nào không chắc NetBeans đang mở bản nào, chuột phải dự án → Properties và đọc đường dẫn.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.7 ─────────────────────────── */
    {
      title: 'KĐ.7 — One-time vs every day: the daily loop for one task card, command by command|||KĐ.7 — Việc một lần và việc mỗi ngày: vòng lặp cho một thẻ việc, từng lệnh một',
      slug: 'git-kd-7-mot-lan-va-moi-ngay',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bảng phân tầng việc làm một lần (mỗi máy, mỗi dự án) và việc làm mỗi ngày, rồi vòng lặp trọn vẹn của một thẻ NT-34: switch main → pull → nhánh mới → commit có mã thẻ → push -u (origin, -u, upstream là gì) → Pull Request → review → merge → xoá nhánh → về main, giải thích bằng hình ảnh sổ chung / tờ nháp / thư viện.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.7</span>
<h2>Most of Git you do once. The rest is the same seven commands, every day</h2>
<p class="lead">"Do I have to run <code>git clone</code> every morning?" "Is <code>-u</code> every time?" "Why do I <code>cd</code> first?" — these were the questions the PRJ301 team asked most, and they all come from not seeing which steps are one-time and which are daily. This lesson draws that line, then walks through one complete task card, NT-34 "login form", exactly as Khoa ran it, with every command explained in plain words.</p>

<h3>What you do once, and what you do every day</h3>
${slide(D, 23, 'Việc nào làm một lần, việc nào làm mỗi ngày')}
<table>
<thead><tr><th>Layer</th><th>What</th><th>Who</th><th>How often</th></tr></thead>
<tbody>
<tr><td>Per machine</td><td>Install Git (KĐ.1), name + email + autocrlf (KĐ.2), sign in to GitHub (KĐ.3)</td><td>each person</td><td>once per laptop</td></tr>
<tr><td>Per project</td><td>Create repository + .gitignore (KĐ.4), invite (KĐ.5), CT Work webhook (KĐ.10)</td><td>team leader</td><td>once per project</td></tr>
<tr><td>Per project × per machine</td><td><code>git clone</code>, create <code>db.properties</code>, open in NetBeans (KĐ.6)</td><td>each person</td><td>once</td></tr>
<tr><td>Per task card</td><td>branch → commits → push → pull request → merge</td><td>whoever takes the card</td><td>a few times a week</td></tr>
<tr><td>Per coding session</td><td><code>cd</code> into the project, <code>git switch main</code>, <code>git pull</code></td><td>everyone</td><td>every time you sit down</td></tr>
</tbody>
</table>
<p>So: <code>clone</code> never again; <code>-u</code> once per new branch; <code>cd</code> every time you open a new terminal, because a fresh terminal starts in your home folder, not in the project.</p>

<h3>Three pictures to keep in your head</h3>
${slide(D, 24, 'Sổ chung, tờ nháp, thư viện')}
<div class="kv-grid">
  <div class="kv"><span class="k">📒 The shared notebook = main</span><span class="v">The version everyone agrees on. Nobody scribbles in it directly; changes are copied in only after someone else has read them.</span></div>
  <div class="kv"><span class="k">📝 A draft sheet = a branch</span><span class="v">One per task card. Write freely, cross out, try again — the notebook is untouched until the draft is approved.</span></div>
  <div class="kv"><span class="k">🏛 The library = GitHub (origin)</span><span class="v">Where the official notebook and everyone's drafts are kept. <code>origin</code> is just the nickname of its address.</span></div>
  <div class="kv"><span class="k">🙋 A request = Pull Request</span><span class="v">"Please copy my draft into the notebook." Teammates read it (review), then someone merges it.</span></div>
</div>

<h3>The loop for one card, on real output</h3>
${slide(D, 25, 'Vòng lặp của một thẻ việc')}
<p><strong>1. Stand on the notebook and copy the latest version.</strong> Commands are identical in Git Bash and Mac Terminal.</p>
<pre><code class="language-bash">cd /c/Code/prj301-nhom        <span class="tok-comment"># Mac: cd ~/Code/prj301-nhom</span>
git switch main               <span class="tok-comment"># stand on the shared notebook</span>
git pull                      <span class="tok-comment"># copy what the library has that I don't</span></code></pre>
<div class="out">Already on 'main'
Your branch is up to date with 'origin/main'.
Already up to date.</div>
<p><strong>2. Take a new draft sheet named after the card.</strong> <code>-c</code> means create. Lower-case card key + a short slug is enough; CT Work recognises <code>nt-34</code> in any case (KĐ.10).</p>
<pre><code class="language-bash">git switch -c nt-34-dang-nhap</code></pre>
<div class="out">Switched to a new branch 'nt-34-dang-nhap'</div>
<p><strong>3. Work, then look before you save.</strong> Edit in NetBeans as usual, then ask Git what changed:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">On branch nt-34-dang-nhap
Changes not staged for commit:
  (use "git add &lt;file&gt;..." to update what will be committed)
  (use "git restore &lt;file&gt;..." to discard changes in working directory)
	modified:   src/main/java/com/nhom/controller/LoginServlet.java

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	src/main/webapp/login.jsp

no changes added to commit (use "git add" and/or "git commit -a")</div>
<p><strong>4. Choose what goes into the snapshot, then take it.</strong> <code>git add</code> puts changes on the "next photo" pile; <code>git commit</code> takes the photo. Start the message with the card key.</p>
<pre><code class="language-bash">git add .
git commit -m <span class="tok-string">"NT-34 thêm form đăng nhập và LoginServlet"</span></code></pre>
<div class="out">warning: in the working copy of 'src/main/java/com/nhom/controller/LoginServlet.java', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/main/webapp/login.jsp', LF will be replaced by CRLF the next time Git touches it
[nt-34-dang-nhap e505e0c] NT-34 thêm form đăng nhập và LoginServlet
 2 files changed, 9 insertions(+), 1 deletion(-)
 create mode 100644 src/main/webapp/login.jsp</div>
<p>The two <code>warning</code> lines appear on Windows (<code>core.autocrlf true</code>) when a file was saved with Unix line endings. They are information, not errors — Git is telling you it will convert line endings on checkout (Chapter 14.4). A Mac with <code>input</code> prints nothing.</p>

<h3>origin, -u, upstream — the first push of a branch</h3>
${slide(D, 26, 'origin, -u, upstream')}
<p><strong>5. Send the draft to the library.</strong> A brand-new branch exists only on your laptop, so a plain <code>git push</code> does not know where to send it:</p>
<pre><code class="language-bash">git push</code></pre>
<div class="out">fatal: The current branch nt-34-dang-nhap has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin nt-34-dang-nhap

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.</div>
<pre><code class="language-bash">git push -u origin nt-34-dang-nhap</code></pre>
<div class="out">To https://github.com/longbh2006/prj301-nhom.git
 * [new branch]      nt-34-dang-nhap -&gt; nt-34-dang-nhap
branch 'nt-34-dang-nhap' set up to track 'origin/nt-34-dang-nhap'.</div>
<p>Word by word: <code>push</code> — send commits; <code>origin</code> — to the library at the URL nicknamed origin; <code>nt-34-dang-nhap</code> — as a branch with this name; <code>-u</code> (short for <code>--set-upstream</code>) — and <em>remember</em> that my local branch and that GitHub branch are a pair. That remembered partner is the branch's <strong>upstream</strong>. From now on, on this branch, plain <code>git push</code> and <code>git pull</code> know where to go. So <code>-u</code> is needed once per new branch, never again. (Real GitHub also prints four <code>remote:</code> lines with a ready-made link: <code>Create a pull request for 'nt-34-dang-nhap' on GitHub by visiting: https://github.com/longbh2006/prj301-nhom/pull/new/nt-34-dang-nhap</code>.)</p>

<h3>Pull request, review, merge — on github.com</h3>
<p><strong>6.</strong> Open the repository; a yellow bar offers <strong>Compare &amp; pull request</strong> for the branch you just pushed. Check the line <strong>base: main ← compare: nt-34-dang-nhap</strong>, give the PR a title with the card key (<code>NT-34: Form đăng nhập</code>), describe how to test it, pick a teammate under <strong>Reviewers</strong>, and click <strong>Create pull request</strong>. The reviewer reads the <strong>Files changed</strong> tab and leaves comments or approves. If changes are requested, keep committing on the same branch and run <code>git push</code> — no <code>-u</code> now — and the PR updates itself.</p>
<p><strong>7.</strong> When approved, the leader (or the author, as the team agrees) clicks <strong>Merge pull request → Confirm merge</strong>, then <strong>Delete branch</strong>. The draft has been copied into the notebook; GitHub's <code>main</code> now has a commit "Merge pull request #1 from longbh2006/nt-34-dang-nhap".</p>

<h3>Back to the notebook, clean up</h3>
<p><strong>8.</strong> Your laptop does not know about the merge until you ask:</p>
<pre><code class="language-bash">git switch main
git pull
git branch -d nt-34-dang-nhap
git fetch --prune</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.
From https://github.com/longbh2006/prj301-nhom
   f24c332..7d5fb09  main       -&gt; origin/main
Updating f24c332..7d5fb09
Fast-forward
 src/main/java/com/nhom/controller/LoginServlet.java | 5 ++++-
 src/main/webapp/login.jsp                           | 5 +++++
 2 files changed, 9 insertions(+), 1 deletion(-)
 create mode 100644 src/main/webapp/login.jsp
Deleted branch nt-34-dang-nhap (was e505e0c).
From https://github.com/longbh2006/prj301-nhom
 - [deleted]         (none)     -&gt; origin/nt-34-dang-nhap</div>
<p>Note the first line after <code>switch</code>: "up to date with 'origin/main'" only means "with what I last saw", not with GitHub right now — that is why you always <code>pull</code>. <code>Fast-forward</code> means main simply moved ahead, no conflict possible. <code>git branch -d</code> deletes the local draft (it refuses if the work was not merged — a safety net). <code>fetch --prune</code> forgets GitHub branches that were deleted. Next card: back to step 1.</p>
<pre><code class="language-bash">git log --oneline --graph</code></pre>
<div class="out">*   7d5fb09 Merge pull request #1 from longbh2006/nt-34-dang-nhap
|\\  
| * e505e0c NT-34 thêm form đăng nhập và LoginServlet
|/  
* f24c332 NT-1 giữ thư mục dao/ và model/ bằng .gitkeep
* 84a3412 NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>In the team repository (or the fake one from KĐ.4), each member does one tiny card:</p><ol><li><code>cd</code> into the project, <code>git switch main</code>, <code>git pull</code>.</li><li><code>git switch -c nt-&lt;your card number&gt;-&lt;short-name&gt;</code>, add one line to a JSP or a comment in a Java file.</li><li><code>git status</code> → <code>git add .</code> → <code>git commit -m "NT-&lt;n&gt; …"</code>. Try <code>git push</code> once without <code>-u</code> and read the message, then <code>git push -u origin &lt;branch&gt;</code>.</li><li>Open a pull request with the card key in the title, ask one teammate to review; the leader merges and deletes the branch.</li><li><code>git switch main</code>, <code>git pull</code>, <code>git branch -d &lt;branch&gt;</code>, <code>git log --oneline --graph</code>.</li></ol>
<p><strong>Done when:</strong> <code>git log --oneline --graph</code> on main shows one "Merge pull request" per member, and <code>git branch</code> lists only <code>main</code> on every laptop.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branch</span><span class="v">A movable name for a line of commits — your draft sheet for one card.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">Nickname of the GitHub repository's URL, set by <code>git clone</code>.</span></div>
  <div class="kv"><span class="k">-u / --set-upstream</span><span class="v">On the first push of a branch: remember its GitHub partner.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">The remote branch your local branch tracks; lets plain <code>push</code>/<code>pull</code> work.</span></div>
  <div class="kv"><span class="k">Pull Request (PR)</span><span class="v">A request on GitHub to merge a branch into main, with review in between.</span></div>
  <div class="kv"><span class="k">Fast-forward</span><span class="v">main just moves ahead to the new commits; nothing to merge by hand.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Clone once; sign in once; configure once — daily work is only the loop.</li><li>Every session: <code>cd</code> → <code>git switch main</code> → <code>git pull</code>.</li><li>Every card: <code>git switch -c nt-…</code> → <code>add</code>/<code>commit -m "NT-… "</code> → <code>git push -u origin nt-…</code> → PR → merge.</li><li><code>-u</code> only on a branch's first push; it sets the upstream.</li><li>After merge: <code>switch main</code>, <code>pull</code>, <code>branch -d</code>, <code>fetch --prune</code>.</li></ul>

${LT('git-6-1-giai-phau-pr', '🔀', 'Lesson 6.1 — Anatomy of a pull request', 'Titles, descriptions, drafts and what reviewers look for.')}
${LT('git-5-3-push', '⬆️', 'Lesson 5.3 — push in depth', 'The three rejections and what upstream really is.')}
${LT('git-16-2-sprint-mo-phong', '🏃', 'Lesson 16.2 — A full sprint', 'Four people, four branches, a real conflict and squash merges.')}

<div class="pitfall co-tieu-de"><strong>Working on main "just this once".</strong> Khoa committed a footer straight on main and pushed while Long was merging PR #2. GitHub refused (<code>! [rejected] main -&gt; main (fetch first)</code>, KĐ.9) and Khoa had to untangle it. Even a one-line change gets a branch. If you notice you committed on main by mistake and have not pushed, create the branch from where you are (<code>git switch -c nt-…</code>) and reset main later — or ask the leader before doing anything clever.</div>
<p class="note-ct"><strong>Say the loop out loud the first week:</strong> "main, pull, branch, commit, push, PR, merge, main, pull." After ten cards it becomes muscle memory and the questions stop.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.7</span>
<h2>Phần lớn Git bạn làm một lần. Phần còn lại là cùng bảy lệnh, mỗi ngày</h2>
<p class="lead">"Sáng nào cũng phải <code>git clone</code> à?" "Lần nào cũng <code>-u</code> hả?" "Sao phải <code>cd</code> trước?" — đó là những câu nhóm PRJ301 hỏi nhiều nhất, và tất cả đến từ chỗ không nhìn ra bước nào làm một lần, bước nào làm mỗi ngày. Bài này kẻ đường ranh đó, rồi đi trọn một thẻ việc (task card) NT-34 "form đăng nhập", đúng như Khoa đã chạy, mỗi lệnh giải thích bằng lời thường.</p>

<h3>Việc làm một lần, và việc làm mỗi ngày</h3>
${slide(D, 23, 'Việc nào làm một lần, việc nào làm mỗi ngày')}
<table>
<thead><tr><th>Tầng</th><th>Việc gì</th><th>Ai</th><th>Bao lâu một lần</th></tr></thead>
<tbody>
<tr><td>Mỗi máy</td><td>Cài Git (KĐ.1), tên + email + autocrlf (KĐ.2), đăng nhập GitHub (KĐ.3)</td><td>từng người</td><td>một lần cho mỗi laptop</td></tr>
<tr><td>Mỗi dự án</td><td>Tạo repo + .gitignore (KĐ.4), mời (KĐ.5), webhook CT Work (KĐ.10)</td><td>trưởng nhóm</td><td>một lần cho mỗi dự án</td></tr>
<tr><td>Mỗi dự án × mỗi máy</td><td><code>git clone</code>, tạo <code>db.properties</code>, mở trong NetBeans (KĐ.6)</td><td>từng người</td><td>một lần</td></tr>
<tr><td>Mỗi thẻ việc</td><td>nhánh → các commit → push → pull request → merge</td><td>người nhận thẻ</td><td>vài lần một tuần</td></tr>
<tr><td>Mỗi buổi ngồi code</td><td><code>cd</code> vào dự án, <code>git switch main</code>, <code>git pull</code></td><td>mọi người</td><td>mỗi lần ngồi xuống</td></tr>
</tbody>
</table>
<p>Vậy là: <code>clone</code> không bao giờ lặp lại; <code>-u</code> một lần cho mỗi nhánh mới; <code>cd</code> mỗi lần mở terminal mới, vì terminal mới luôn bắt đầu ở thư mục nhà chứ không ở trong dự án.</p>

<h3>Ba hình ảnh để giữ trong đầu</h3>
${slide(D, 24, 'Sổ chung, tờ nháp, thư viện')}
<div class="kv-grid">
  <div class="kv"><span class="k">📒 Cuốn sổ chung = main</span><span class="v">Bản cả nhóm cùng thống nhất. Không ai viết thẳng vào; thay đổi chỉ được chép vào sau khi có người khác đọc qua.</span></div>
  <div class="kv"><span class="k">📝 Tờ nháp = một nhánh (branch)</span><span class="v">Mỗi thẻ một tờ. Viết thoải mái, gạch xoá, làm lại — cuốn sổ không bị đụng tới cho tới khi tờ nháp được duyệt.</span></div>
  <div class="kv"><span class="k">🏛 Thư viện = GitHub (origin)</span><span class="v">Nơi giữ cuốn sổ chính thức và tờ nháp của mọi người. <code>origin</code> chỉ là biệt danh của địa chỉ thư viện.</span></div>
  <div class="kv"><span class="k">🙋 Lời xin = Pull Request</span><span class="v">"Làm ơn chép tờ nháp của tôi vào sổ." Bạn cùng nhóm đọc (review), rồi có người merge (hợp nhất).</span></div>
</div>

<h3>Vòng lặp cho một thẻ, trên output thật</h3>
${slide(D, 25, 'Vòng lặp của một thẻ việc')}
<p><strong>1. Đứng trên cuốn sổ và chép bản mới nhất.</strong> Lệnh giống hệt nhau trong Git Bash và Terminal của Mac.</p>
<pre><code class="language-bash">cd /c/Code/prj301-nhom        <span class="tok-comment"># Mac: cd ~/Code/prj301-nhom</span>
git switch main               <span class="tok-comment"># đứng lên cuốn sổ chung</span>
git pull                      <span class="tok-comment"># chép những gì thư viện có mà mình chưa có</span></code></pre>
<div class="out">Already on 'main'
Your branch is up to date with 'origin/main'.
Already up to date.</div>
<p><strong>2. Lấy một tờ nháp mới mang tên thẻ.</strong> <code>-c</code> nghĩa là create (tạo). Mã thẻ viết thường + vài chữ ngắn là đủ; CT Work nhận ra <code>nt-34</code> dù hoa hay thường (KĐ.10).</p>
<pre><code class="language-bash">git switch -c nt-34-dang-nhap</code></pre>
<div class="out">Switched to a new branch 'nt-34-dang-nhap'</div>
<p><strong>3. Làm việc, rồi nhìn trước khi lưu.</strong> Sửa trong NetBeans như thường, rồi hỏi Git đã đổi những gì:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">On branch nt-34-dang-nhap
Changes not staged for commit:
  (use "git add &lt;file&gt;..." to update what will be committed)
  (use "git restore &lt;file&gt;..." to discard changes in working directory)
	modified:   src/main/java/com/nhom/controller/LoginServlet.java

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
	src/main/webapp/login.jsp

no changes added to commit (use "git add" and/or "git commit -a")</div>
<p><strong>4. Chọn thứ đưa vào tấm ảnh, rồi chụp.</strong> <code>git add</code> đặt thay đổi lên chồng "tấm ảnh kế tiếp"; <code>git commit</code> bấm máy. Lời nhắn mở đầu bằng mã thẻ.</p>
<pre><code class="language-bash">git add .
git commit -m <span class="tok-string">"NT-34 thêm form đăng nhập và LoginServlet"</span></code></pre>
<div class="out">warning: in the working copy of 'src/main/java/com/nhom/controller/LoginServlet.java', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/main/webapp/login.jsp', LF will be replaced by CRLF the next time Git touches it
[nt-34-dang-nhap e505e0c] NT-34 thêm form đăng nhập và LoginServlet
 2 files changed, 9 insertions(+), 1 deletion(-)
 create mode 100644 src/main/webapp/login.jsp</div>
<p>Hai dòng <code>warning</code> hiện trên Windows (<code>core.autocrlf true</code>) khi file được lưu với ký tự xuống dòng kiểu Unix. Đó là thông tin, không phải lỗi — Git báo rằng nó sẽ đổi ký tự xuống dòng khi checkout (Chương 14.4). Mac đặt <code>input</code> thì không in gì.</p>

<h3>origin, -u, upstream — lần push đầu của một nhánh</h3>
${slide(D, 26, 'origin, -u, upstream')}
<p><strong>5. Gửi tờ nháp tới thư viện.</strong> Nhánh mới tinh chỉ tồn tại trên laptop của bạn, nên <code>git push</code> trần không biết gửi đi đâu:</p>
<pre><code class="language-bash">git push</code></pre>
<div class="out">fatal: The current branch nt-34-dang-nhap has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin nt-34-dang-nhap

To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.</div>
<pre><code class="language-bash">git push -u origin nt-34-dang-nhap</code></pre>
<div class="out">To https://github.com/longbh2006/prj301-nhom.git
 * [new branch]      nt-34-dang-nhap -&gt; nt-34-dang-nhap
branch 'nt-34-dang-nhap' set up to track 'origin/nt-34-dang-nhap'.</div>
<p>Từng chữ một: <code>push</code> — gửi commit đi; <code>origin</code> — tới thư viện ở địa chỉ mang biệt danh origin; <code>nt-34-dang-nhap</code> — thành một nhánh tên này; <code>-u</code> (viết tắt của <code>--set-upstream</code>) — và <em>ghi nhớ</em> rằng nhánh trên máy và nhánh trên GitHub là một cặp. Người bạn đồng hành được ghi nhớ đó là <strong>upstream</strong> (nhánh thượng nguồn) của nhánh. Từ giờ, trên nhánh này, <code>git push</code> và <code>git pull</code> trần đều biết đi đâu. Nên <code>-u</code> chỉ cần một lần cho mỗi nhánh mới, không bao giờ lặp lại. (GitHub thật còn in thêm bốn dòng <code>remote:</code> kèm link soạn sẵn: <code>Create a pull request for 'nt-34-dang-nhap' on GitHub by visiting: https://github.com/longbh2006/prj301-nhom/pull/new/nt-34-dang-nhap</code>.)</p>

<h3>Pull request, review, merge — trên github.com</h3>
<p><strong>6.</strong> Mở trang repo; một thanh vàng mời <strong>Compare &amp; pull request</strong> cho nhánh vừa push. Kiểm dòng <strong>base: main ← compare: nt-34-dang-nhap</strong>, đặt tiêu đề PR có mã thẻ (<code>NT-34: Form đăng nhập</code>), ghi cách thử, chọn một bạn ở mục <strong>Reviewers</strong>, rồi bấm <strong>Create pull request</strong>. Người review đọc tab <strong>Files changed</strong> rồi để lại nhận xét hoặc duyệt (approve). Nếu được yêu cầu sửa, cứ commit tiếp trên đúng nhánh đó và chạy <code>git push</code> — giờ không cần <code>-u</code> — PR tự cập nhật.</p>
<p><strong>7.</strong> Khi đã được duyệt, trưởng nhóm (hoặc chính người viết, tuỳ nhóm thống nhất) bấm <strong>Merge pull request → Confirm merge</strong>, rồi <strong>Delete branch</strong>. Tờ nháp đã được chép vào sổ; <code>main</code> trên GitHub giờ có commit "Merge pull request #1 from longbh2006/nt-34-dang-nhap".</p>

<h3>Về lại cuốn sổ, dọn dẹp</h3>
<p><strong>8.</strong> Laptop của bạn chưa biết gì về lần merge cho tới khi bạn hỏi:</p>
<pre><code class="language-bash">git switch main
git pull
git branch -d nt-34-dang-nhap
git fetch --prune</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.
From https://github.com/longbh2006/prj301-nhom
   f24c332..7d5fb09  main       -&gt; origin/main
Updating f24c332..7d5fb09
Fast-forward
 src/main/java/com/nhom/controller/LoginServlet.java | 5 ++++-
 src/main/webapp/login.jsp                           | 5 +++++
 2 files changed, 9 insertions(+), 1 deletion(-)
 create mode 100644 src/main/webapp/login.jsp
Deleted branch nt-34-dang-nhap (was e505e0c).
From https://github.com/longbh2006/prj301-nhom
 - [deleted]         (none)     -&gt; origin/nt-34-dang-nhap</div>
<p>Để ý dòng đầu sau <code>switch</code>: "up to date with 'origin/main'" chỉ có nghĩa "khớp với lần cuối mình nhìn thấy", không phải khớp với GitHub ngay lúc này — vì thế luôn phải <code>pull</code>. <code>Fast-forward</code> (tua thẳng) nghĩa là main chỉ việc tiến lên, không thể có xung đột. <code>git branch -d</code> xoá tờ nháp trên máy (nó từ chối nếu việc chưa được merge — một tấm lưới an toàn). <code>fetch --prune</code> quên các nhánh đã bị xoá trên GitHub. Thẻ tiếp theo: quay lại bước 1.</p>
<pre><code class="language-bash">git log --oneline --graph</code></pre>
<div class="out">*   7d5fb09 Merge pull request #1 from longbh2006/nt-34-dang-nhap
|\\  
| * e505e0c NT-34 thêm form đăng nhập và LoginServlet
|/  
* f24c332 NT-1 giữ thư mục dao/ và model/ bằng .gitkeep
* 84a3412 NT-1 khởi tạo dự án PRJ301 (Maven + NetBeans)</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Trong repo của nhóm (hoặc repo giả ở KĐ.4), mỗi bạn làm một thẻ thật nhỏ:</p><ol><li><code>cd</code> vào dự án, <code>git switch main</code>, <code>git pull</code>.</li><li><code>git switch -c nt-&lt;số thẻ của bạn&gt;-&lt;tên-ngắn&gt;</code>, thêm một dòng vào một file JSP hoặc một dòng chú thích trong file Java.</li><li><code>git status</code> → <code>git add .</code> → <code>git commit -m "NT-&lt;n&gt; …"</code>. Thử <code>git push</code> một lần không có <code>-u</code> và đọc thông báo, rồi <code>git push -u origin &lt;nhánh&gt;</code>.</li><li>Mở pull request có mã thẻ trong tiêu đề, nhờ một bạn review; trưởng nhóm merge và xoá nhánh.</li><li><code>git switch main</code>, <code>git pull</code>, <code>git branch -d &lt;nhánh&gt;</code>, <code>git log --oneline --graph</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>git log --oneline --graph</code> trên main có mỗi bạn một dòng "Merge pull request", và <code>git branch</code> trên mọi laptop chỉ còn <code>main</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branch</span><span class="v">Nhánh — cái tên di động gắn với một chuỗi commit; tờ nháp của bạn cho một thẻ.</span></div>
  <div class="kv"><span class="k">origin</span><span class="v">Biệt danh của URL repo trên GitHub, do <code>git clone</code> đặt.</span></div>
  <div class="kv"><span class="k">-u / --set-upstream</span><span class="v">Ở lần push đầu của một nhánh: ghi nhớ nhánh cặp đôi trên GitHub.</span></div>
  <div class="kv"><span class="k">Upstream</span><span class="v">Nhánh thượng nguồn — nhánh trên remote mà nhánh máy bạn đi cặp; nhờ nó <code>push</code>/<code>pull</code> trần chạy được.</span></div>
  <div class="kv"><span class="k">Pull Request (PR)</span><span class="v">Yêu cầu hợp nhất — lời xin trên GitHub để merge một nhánh vào main, có review ở giữa.</span></div>
  <div class="kv"><span class="k">Fast-forward</span><span class="v">Tua thẳng — main chỉ việc tiến tới commit mới; không có gì phải hợp nhất bằng tay.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Clone một lần, đăng nhập một lần, cấu hình một lần — việc hằng ngày chỉ là vòng lặp.</li><li>Mỗi buổi: <code>cd</code> → <code>git switch main</code> → <code>git pull</code>.</li><li>Mỗi thẻ: <code>git switch -c nt-…</code> → <code>add</code>/<code>commit -m "NT-… "</code> → <code>git push -u origin nt-…</code> → PR → merge.</li><li><code>-u</code> chỉ ở lần push đầu của một nhánh; nó đặt upstream.</li><li>Sau khi merge: <code>switch main</code>, <code>pull</code>, <code>branch -d</code>, <code>fetch --prune</code>.</li></ul>

${LT('git-6-1-giai-phau-pr', '🔀', 'Bài 6.1 — Giải phẫu một pull request', 'Tiêu đề, mô tả, PR nháp và người review nhìn gì.')}
${LT('git-5-3-push', '⬆️', 'Bài 5.3 — push, học sâu', 'Ba kiểu bị từ chối và upstream thật ra là gì.')}
${LT('git-16-2-sprint-mo-phong', '🏃', 'Bài 16.2 — Một sprint trọn vẹn', 'Bốn người, bốn nhánh, một xung đột thật và squash merge.')}

<div class="pitfall co-tieu-de"><strong>Làm thẳng trên main "chỉ lần này thôi".</strong> Khoa commit một cái footer thẳng trên main rồi push đúng lúc Long đang merge PR #2. GitHub từ chối (<code>! [rejected] main -&gt; main (fetch first)</code>, KĐ.9) và Khoa phải gỡ rối. Thay đổi một dòng cũng phải có nhánh. Nếu phát hiện mình lỡ commit trên main mà chưa push, tạo nhánh ngay tại chỗ (<code>git switch -c nt-…</code>) rồi đưa main về sau — hoặc hỏi trưởng nhóm trước khi làm gì "thông minh".</div>
<p class="note-ct"><strong>Tuần đầu, đọc to vòng lặp:</strong> "main, pull, nhánh, commit, push, PR, merge, main, pull." Sau mười thẻ nó thành phản xạ và các câu hỏi tự biến mất.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.8 ─────────────────────────── */
    {
      title: 'KĐ.8 — Getting teammates’ code: pull, merge main, refresh NetBeans, first conflict|||KĐ.8 — Lấy code của bạn: pull, merge main, làm mới NetBeans, xung đột đầu tiên',
      slug: 'git-kd-8-lay-code-cua-ban',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai bước lấy việc của bạn bè (pull trên main, rồi git merge main vào nhánh đang làm), vì sao "Already up to date" mà IDE vẫn cũ, sau khi pull phải làm gì trong NetBeans (Clean and Build, Build with Dependencies) và SSMS (chạy lại setup.sql), sửa dở chặn pull, và giải xung đột đầu tiên — trên output thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.8</span>
<h2>Your teammates' work reaches you in two steps — and Git only moves files, never your database</h2>
<p class="lead">On Thursday Khoa's login form and Long's home page were both merged into <code>main</code> on GitHub. Tú was halfway through card NT-40, which also touched the home page. He needed their code, without losing his. This lesson replays exactly what happened on his laptop, including the three red messages he hit and the conflict at the end — every output below is real.</p>

<h3>The two-step rule</h3>
${slide(D, 27, 'Pull trên main, rồi merge main vào nhánh mình')}
<ol>
<li><strong>Update your copy of the notebook:</strong> <code>git switch main</code> → <code>git pull</code>. On main you have no commits of your own, so this is always a fast-forward — it cannot conflict.</li>
<li><strong>Bring the notebook into your draft:</strong> <code>git switch nt-40-trang-chu</code> → <code>git merge main</code>. If you and a teammate touched the same lines, the conflict happens <em>here, on your laptop</em>, where you can test the result — not in the pull request.</li>
</ol>
<p>Do it when you start a session and before opening a pull request. Same commands in Git Bash and Terminal.</p>

<h3>Red message 1: pull on a branch that was never pushed</h3>
<p>Tú, still on his new branch, typed <code>git pull</code> first:</p>
<div class="out">From https://github.com/longbh2006/prj301-nhom
   f24c332..a1999ac  main       -&gt; origin/main
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull &lt;remote&gt; &lt;branch&gt;

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/&lt;branch&gt; nt-40-trang-chu</div>
<p>The branch has no upstream yet (KĐ.7) — it was never pushed — so Git does not know what to pull into it. The first two lines show the download <em>did</em> happen (<code>origin/main</code> moved to <code>a1999ac</code>); only the merge was skipped. The fix is not the command Git suggests, it is the two-step rule.</p>

<h3>Red message 2: unfinished changes block the pull</h3>
<pre><code class="language-bash">git switch main</code></pre>
<div class="out">Switched to branch 'main'
M	src/main/webapp/index.jsp
Your branch is behind 'origin/main' by 4 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)</div>
<p>Look at the <code>M</code> line: his uncommitted edit came along to <code>main</code> — uncommitted changes belong to the folder, not to a branch. Then:</p>
<pre><code class="language-bash">git pull</code></pre>
<div class="out">error: Your local changes to the following files would be overwritten by merge:
	src/main/webapp/index.jsp
Please commit your changes or stash them before you merge.
Aborting
Updating f24c332..a1999ac</div>
<p>Git refuses rather than overwrite your work — that is a good thing. The clean way out: go back to your branch and <strong>commit</strong> the work there.</p>
<pre><code class="language-bash">git switch nt-40-trang-chu
git add .
git commit -m <span class="tok-string">"NT-40 đổi tiêu đề trang chủ"</span></code></pre>
<div class="out">Switched to branch 'nt-40-trang-chu'
M	src/main/webapp/index.jsp
[nt-40-trang-chu 423d421] NT-40 đổi tiêu đề trang chủ
 1 file changed, 1 insertion(+), 1 deletion(-)</div>
<div class="callout warn"><strong>About <code>git stash</code>.</strong> The message offers stash as an alternative: it parks your edits, you pull, then <code>git stash pop</code> brings them back. It works, but it does not avoid conflicts — in the same situation, <code>stash pop</code> printed <code>CONFLICT (content): Merge conflict in src/main/webapp/index.jsp</code> and "The stash entry is kept in case you need it again." For beginners, a commit on your own branch is easier to see and harder to lose.</div>

<h3>Step 1 and step 2, now clean</h3>
<pre><code class="language-bash">git switch main
git pull</code></pre>
<div class="out">Switched to branch 'main'
Your branch is behind 'origin/main' by 4 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)
Updating f24c332..a1999ac
Fast-forward
 database/setup.sql                                  | 2 ++
 pom.xml                                             | 7 +++++++
 src/main/java/com/nhom/controller/LoginServlet.java | 5 ++++-
 src/main/webapp/index.jsp                           | 2 +-
 src/main/webapp/login.jsp                           | 5 +++++
 5 files changed, 19 insertions(+), 2 deletions(-)
 create mode 100644 database/setup.sql
 create mode 100644 src/main/webapp/login.jsp</div>
<p>Read that list — it is your to-do list for the IDE and the database (next section): <code>pom.xml</code> changed, <code>setup.sql</code> is new, Java and JSP files changed.</p>
<pre><code class="language-bash">git switch nt-40-trang-chu
git merge main</code></pre>
<div class="out">Switched to branch 'nt-40-trang-chu'
Auto-merging src/main/webapp/index.jsp
CONFLICT (content): Merge conflict in src/main/webapp/index.jsp
Automatic merge failed; fix conflicts and then commit the result.</div>

<h3>The first conflict, calmly</h3>
${slide(D, 29, 'Xung đột đầu tiên: hai người sửa cùng một dòng')}
<p>Long and Tú both rewrote the <code>&lt;h1&gt;</code> line. Git merged everything else (the new <code>setup.sql</code>, <code>pom.xml</code>, the login files) and stopped on that one line:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">On branch nt-40-trang-chu
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Changes to be committed:
	new file:   database/setup.sql
	modified:   pom.xml
	modified:   src/main/java/com/nhom/controller/LoginServlet.java
	new file:   src/main/webapp/login.jsp

Unmerged paths:
  (use "git add &lt;file&gt;..." to mark resolution)
	both modified:   src/main/webapp/index.jsp</div>
<p>Open <code>index.jsp</code> in NetBeans or VS Code:</p>
<pre><code>&lt;html&gt;
&lt;body&gt;
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
&lt;h1&gt;Cửa hàng sách PRJ301&lt;/h1&gt;
=======
&lt;h1&gt;BookStore - Trang chủ&lt;/h1&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; main
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> and <code>=======</code> is <em>your</em> version (the branch you are on); between <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; main</code> is what came from main. Decide what the line should be — here, ask Long in the chat — write it, and <strong>delete all three marker lines</strong>. Then tell Git you are done:</p>
<pre><code class="language-bash">git add src/main/webapp/index.jsp
git commit --no-edit
git push -u origin nt-40-trang-chu</code></pre>
<div class="out">[nt-40-trang-chu 83112ca] Merge branch 'main' into nt-40-trang-chu
To https://github.com/longbh2006/prj301-nhom.git
 * [new branch]      nt-40-trang-chu -&gt; nt-40-trang-chu
branch 'nt-40-trang-chu' set up to track 'origin/nt-40-trang-chu'.</div>
<p>Panicking is optional: <code>git merge --abort</code> puts everything back as it was before <code>git merge main</code>. Chapter 3.3 goes deeper into conflicts, and Chapter 14.1 shows VS Code's three-pane merge editor.</p>

<h3>"Already up to date" — but the IDE shows old code</h3>
${slide(D, 28, 'Pull rồi mà NetBeans vẫn cũ — kiểm sáu bước')}
<p>Git only changes files in the folder you are standing in. Everything else is your job. Check in this order:</p>
<table>
<thead><tr><th>#</th><th>Check</th><th>How</th></tr></thead>
<tbody>
<tr><td>1</td><td>Is the IDE showing the folder you pulled in?</td><td>NetBeans: right-click project → <strong>Properties</strong> → path. Tú's was <code>prj301-nhom-main</code> from the ZIP (KĐ.6).</td></tr>
<tr><td>2</td><td>Are you on the branch you think?</td><td><code>git branch</code> — the <code>*</code> line. Teammates' merged work is on <code>main</code> until you merge it into yours.</td></tr>
<tr><td>3</td><td>Is the code really on GitHub?</td><td><code>git log --oneline -3 origin/main</code>. If your friend's commit is missing, they have not pushed, or the PR is not merged yet.</td></tr>
<tr><td>4</td><td><code>pom.xml</code> changed</td><td>Right-click project → <strong>Build with Dependencies</strong> so Maven downloads new libraries (here: the SQL Server driver).</td></tr>
<tr><td>5</td><td>Java / JSP changed</td><td><strong>Clean and Build</strong>, then restart Tomcat. A running server keeps the old classes. If NetBeans' file tree looks stale, <strong>Source → Scan for External Changes</strong>, or close and reopen the project.</td></tr>
<tr><td>6</td><td><code>database/setup.sql</code> changed</td><td>Open it in SQL Server Management Studio and <strong>Execute</strong>. Git never touches your database; the new <code>Users</code> table does not exist until you run it.</td></tr>
</tbody>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Two teammates, A and B, same repository:</p><ol><li>Both: <code>git switch main</code>, <code>git pull</code>, then each makes a branch (<code>nt-&lt;n&gt;-…</code>) and changes the <em>same line</em> of <code>index.jsp</code> differently. Each commits.</li><li>A pushes, opens a PR, and the leader merges it.</li><li>B, without committing a second change, edits another file and tries <code>git switch main</code> + <code>git pull</code>; read the result. Commit on the branch instead.</li><li>B: <code>git switch main</code>, <code>git pull</code>, <code>git switch &lt;branch&gt;</code>, <code>git merge main</code> → resolve the conflict → <code>git add</code> → <code>git commit --no-edit</code> → push and open the PR.</li><li>B: in NetBeans run <strong>Clean and Build</strong> and confirm the page shows the agreed title.</li></ol>
<p><strong>Done when:</strong> B's PR shows no conflict on GitHub, <code>grep -c "&lt;&lt;&lt;&lt;&lt;&lt;&lt;" src/main/webapp/index.jsp</code> prints <code>0</code>, and the running app shows the merged title.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git pull</span><span class="v">Download (fetch) what GitHub has, then merge it into the branch you are on.</span></div>
  <div class="kv"><span class="k">git merge main</span><span class="v">Bring main's commits into your current branch.</span></div>
  <div class="kv"><span class="k">Merge conflict</span><span class="v">Two changes to the same lines; Git stops and asks you to choose.</span></div>
  <div class="kv"><span class="k">Conflict markers</span><span class="v"><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> — must all be deleted before <code>git add</code>.</span></div>
  <div class="kv"><span class="k">git stash</span><span class="v">Temporarily shelve uncommitted changes; <code>stash pop</code> brings them back (and can conflict).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Teammates' work: <code>switch main</code> + <code>pull</code>, then <code>switch</code> your branch + <code>merge main</code>.</li><li>"No tracking information" = pulling on an unpushed branch; use the two-step rule.</li><li>"Local changes would be overwritten" = commit on your branch first (or stash).</li><li>Resolve a conflict: edit, delete markers, <code>git add</code>, <code>git commit --no-edit</code>; or <code>git merge --abort</code>.</li><li>After a pull: Build with Dependencies for <code>pom.xml</code>, Clean and Build for code, rerun <code>setup.sql</code> in SSMS.</li></ul>

${LT('git-3-3-xung-dot', '⚔️', 'Lesson 3.3 — Merge conflicts', 'Reading markers, zdiff3, and resolving without fear.')}
${LT('git-14-1-vs-code', '🧩', 'Lesson 14.1 — Git in VS Code', 'The three-pane merge editor, button by button.')}
${LX('https://git-scm.com/docs/git-pull', '📖', 'git pull — reference', 'Merge vs rebase vs fast-forward-only, and the configuration that picks one.')}

<div class="pitfall co-tieu-de"><strong>Resolving by "accept mine" everywhere.</strong> Under deadline pressure it is tempting to keep your side of every conflict. You then silently delete a teammate's merged work — and nobody notices until the demo. Read both sides; when in doubt, ask the person whose name is on the other commit (<code>git log -1 main -- src/main/webapp/index.jsp</code>).</div>
<p class="note-ct"><strong>Make it boring:</strong> merge main into your branch every morning. Small daily conflicts take a minute; one big conflict the night before the deadline takes the evening.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.8</span>
<h2>Việc của bạn cùng nhóm tới tay bạn qua hai bước — và Git chỉ di chuyển file, không bao giờ đụng database</h2>
<p class="lead">Thứ Năm, form đăng nhập của Khoa và trang chủ của Long đều đã được merge vào <code>main</code> trên GitHub. Tú đang làm dở thẻ NT-40, cũng đụng vào trang chủ. Tú cần code của hai bạn mà không mất code của mình. Bài này chạy lại đúng những gì đã xảy ra trên laptop của Tú, kể cả ba thông báo đỏ Tú gặp và vụ xung đột cuối cùng — mọi output dưới đây đều là thật.</p>

<h3>Luật hai bước</h3>
${slide(D, 27, 'Pull trên main, rồi merge main vào nhánh mình')}
<ol>
<li><strong>Cập nhật bản sổ của bạn:</strong> <code>git switch main</code> → <code>git pull</code>. Trên main bạn không có commit riêng nào, nên đây luôn là tua thẳng (fast-forward) — không thể xung đột.</li>
<li><strong>Đem cuốn sổ vào tờ nháp:</strong> <code>git switch nt-40-trang-chu</code> → <code>git merge main</code>. Nếu bạn và một bạn khác sửa cùng dòng, xung đột xảy ra <em>ở đây, trên laptop của bạn</em>, nơi bạn chạy thử được kết quả — chứ không phải trong pull request.</li>
</ol>
<p>Làm việc này khi bắt đầu một buổi và trước khi mở pull request. Lệnh giống nhau trong Git Bash và Terminal.</p>

<h3>Thông báo đỏ 1: pull trên một nhánh chưa từng push</h3>
<p>Tú, vẫn đang ở nhánh mới, gõ <code>git pull</code> trước:</p>
<div class="out">From https://github.com/longbh2006/prj301-nhom
   f24c332..a1999ac  main       -&gt; origin/main
There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull &lt;remote&gt; &lt;branch&gt;

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/&lt;branch&gt; nt-40-trang-chu</div>
<p>Nhánh chưa có upstream (KĐ.7) — nó chưa từng được push — nên Git không biết phải kéo gì vào nó. Hai dòng đầu cho thấy việc tải về CÓ xảy ra (<code>origin/main</code> đã nhảy tới <code>a1999ac</code>); chỉ bước merge bị bỏ qua. Cách sửa không phải lệnh Git gợi ý, mà là luật hai bước.</p>

<h3>Thông báo đỏ 2: sửa dở chặn pull</h3>
<pre><code class="language-bash">git switch main</code></pre>
<div class="out">Switched to branch 'main'
M	src/main/webapp/index.jsp
Your branch is behind 'origin/main' by 4 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)</div>
<p>Nhìn dòng <code>M</code>: phần sửa chưa commit đi theo Tú sang <code>main</code> — thay đổi chưa commit thuộc về thư mục, không thuộc về nhánh nào. Rồi:</p>
<pre><code class="language-bash">git pull</code></pre>
<div class="out">error: Your local changes to the following files would be overwritten by merge:
	src/main/webapp/index.jsp
Please commit your changes or stash them before you merge.
Aborting
Updating f24c332..a1999ac</div>
<p>Git từ chối thay vì ghi đè lên việc của bạn — đó là điều tốt. Lối ra sạch sẽ: quay về nhánh của mình và <strong>commit</strong> ở đó.</p>
<pre><code class="language-bash">git switch nt-40-trang-chu
git add .
git commit -m <span class="tok-string">"NT-40 đổi tiêu đề trang chủ"</span></code></pre>
<div class="out">Switched to branch 'nt-40-trang-chu'
M	src/main/webapp/index.jsp
[nt-40-trang-chu 423d421] NT-40 đổi tiêu đề trang chủ
 1 file changed, 1 insertion(+), 1 deletion(-)</div>
<div class="callout warn"><strong>Về <code>git stash</code>.</strong> Thông báo gợi ý stash như một lựa chọn khác: nó cất tạm phần sửa, bạn pull, rồi <code>git stash pop</code> lấy chúng ra lại. Cách đó chạy được, nhưng không tránh được xung đột — trong đúng tình huống này, <code>stash pop</code> in <code>CONFLICT (content): Merge conflict in src/main/webapp/index.jsp</code> kèm "The stash entry is kept in case you need it again." Với người mới, một commit trên nhánh của chính mình dễ nhìn hơn và khó mất hơn.</div>

<h3>Bước 1 và bước 2, giờ thì sạch</h3>
<pre><code class="language-bash">git switch main
git pull</code></pre>
<div class="out">Switched to branch 'main'
Your branch is behind 'origin/main' by 4 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)
Updating f24c332..a1999ac
Fast-forward
 database/setup.sql                                  | 2 ++
 pom.xml                                             | 7 +++++++
 src/main/java/com/nhom/controller/LoginServlet.java | 5 ++++-
 src/main/webapp/index.jsp                           | 2 +-
 src/main/webapp/login.jsp                           | 5 +++++
 5 files changed, 19 insertions(+), 2 deletions(-)
 create mode 100644 database/setup.sql
 create mode 100644 src/main/webapp/login.jsp</div>
<p>Đọc danh sách đó — nó chính là việc cần làm cho IDE và database (mục sau): <code>pom.xml</code> đổi, <code>setup.sql</code> mới, file Java và JSP đổi.</p>
<pre><code class="language-bash">git switch nt-40-trang-chu
git merge main</code></pre>
<div class="out">Switched to branch 'nt-40-trang-chu'
Auto-merging src/main/webapp/index.jsp
CONFLICT (content): Merge conflict in src/main/webapp/index.jsp
Automatic merge failed; fix conflicts and then commit the result.</div>

<h3>Xung đột đầu tiên, bình tĩnh</h3>
${slide(D, 29, 'Xung đột đầu tiên: hai người sửa cùng một dòng')}
<p>Long và Tú cùng viết lại dòng <code>&lt;h1&gt;</code>. Git đã hợp nhất mọi thứ khác (<code>setup.sql</code> mới, <code>pom.xml</code>, các file đăng nhập) và dừng lại đúng ở một dòng đó:</p>
<pre><code class="language-bash">git status</code></pre>
<div class="out">On branch nt-40-trang-chu
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Changes to be committed:
	new file:   database/setup.sql
	modified:   pom.xml
	modified:   src/main/java/com/nhom/controller/LoginServlet.java
	new file:   src/main/webapp/login.jsp

Unmerged paths:
  (use "git add &lt;file&gt;..." to mark resolution)
	both modified:   src/main/webapp/index.jsp</div>
<p>Mở <code>index.jsp</code> trong NetBeans hoặc VS Code:</p>
<pre><code>&lt;html&gt;
&lt;body&gt;
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
&lt;h1&gt;Cửa hàng sách PRJ301&lt;/h1&gt;
=======
&lt;h1&gt;BookStore - Trang chủ&lt;/h1&gt;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; main
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<p>Giữa <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> và <code>=======</code> là bản <em>của bạn</em> (nhánh đang đứng); giữa <code>=======</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; main</code> là thứ đến từ main. Quyết định dòng đó phải là gì — ở đây, hỏi Long trong nhóm chat — viết nó vào, và <strong>xoá cả ba dòng đánh dấu</strong>. Rồi báo Git là xong:</p>
<pre><code class="language-bash">git add src/main/webapp/index.jsp
git commit --no-edit
git push -u origin nt-40-trang-chu</code></pre>
<div class="out">[nt-40-trang-chu 83112ca] Merge branch 'main' into nt-40-trang-chu
To https://github.com/longbh2006/prj301-nhom.git
 * [new branch]      nt-40-trang-chu -&gt; nt-40-trang-chu
branch 'nt-40-trang-chu' set up to track 'origin/nt-40-trang-chu'.</div>
<p>Hoảng thì có lối lùi: <code>git merge --abort</code> trả mọi thứ về đúng như trước lệnh <code>git merge main</code>. Chương 3.3 đi sâu vào xung đột, Chương 14.1 chỉ trình gộp ba khung của VS Code.</p>

<h3>"Already up to date" — mà IDE vẫn hiện code cũ</h3>
${slide(D, 28, 'Pull rồi mà NetBeans vẫn cũ — kiểm sáu bước')}
<p>Git chỉ đổi file trong thư mục bạn đang đứng. Mọi thứ còn lại là việc của bạn. Kiểm theo thứ tự này:</p>
<table>
<thead><tr><th>#</th><th>Kiểm</th><th>Cách</th></tr></thead>
<tbody>
<tr><td>1</td><td>IDE có đang mở đúng thư mục bạn vừa pull không?</td><td>NetBeans: chuột phải dự án → <strong>Properties</strong> → đường dẫn. Của Tú là <code>prj301-nhom-main</code> từ bản ZIP (KĐ.6).</td></tr>
<tr><td>2</td><td>Bạn có đang ở đúng nhánh mình nghĩ?</td><td><code>git branch</code> — dòng có <code>*</code>. Việc của bạn bè đã merge nằm trên <code>main</code> cho tới khi bạn merge nó vào nhánh mình.</td></tr>
<tr><td>3</td><td>Code đó đã thật sự lên GitHub chưa?</td><td><code>git log --oneline -3 origin/main</code>. Thiếu commit của bạn kia thì bạn ấy chưa push, hoặc PR chưa được merge.</td></tr>
<tr><td>4</td><td><code>pom.xml</code> đổi</td><td>Chuột phải dự án → <strong>Build with Dependencies</strong> để Maven tải thư viện mới (ở đây: driver SQL Server).</td></tr>
<tr><td>5</td><td>Java / JSP đổi</td><td><strong>Clean and Build</strong>, rồi khởi động lại Tomcat. Server đang chạy giữ class cũ. Nếu cây file của NetBeans trông cũ, <strong>Source → Scan for External Changes</strong>, hoặc đóng rồi mở lại dự án.</td></tr>
<tr><td>6</td><td><code>database/setup.sql</code> đổi</td><td>Mở trong SQL Server Management Studio và <strong>Execute</strong>. Git không bao giờ đụng vào database; bảng <code>Users</code> mới chưa tồn tại cho tới khi bạn chạy nó.</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Hai bạn A và B, cùng một repo:</p><ol><li>Cả hai: <code>git switch main</code>, <code>git pull</code>, rồi mỗi bạn tạo một nhánh (<code>nt-&lt;n&gt;-…</code>) và sửa <em>cùng một dòng</em> của <code>index.jsp</code> theo hai cách khác nhau. Mỗi bạn commit.</li><li>A push, mở PR, trưởng nhóm merge.</li><li>B, chưa commit thêm, sửa một file khác rồi thử <code>git switch main</code> + <code>git pull</code>; đọc kết quả. Thay vào đó, commit trên nhánh.</li><li>B: <code>git switch main</code>, <code>git pull</code>, <code>git switch &lt;nhánh&gt;</code>, <code>git merge main</code> → giải xung đột → <code>git add</code> → <code>git commit --no-edit</code> → push và mở PR.</li><li>B: trong NetBeans chạy <strong>Clean and Build</strong> và xác nhận trang hiện đúng tiêu đề đã thống nhất.</li></ol>
<p><strong>Đạt khi:</strong> PR của B trên GitHub không báo xung đột, <code>grep -c "&lt;&lt;&lt;&lt;&lt;&lt;&lt;" src/main/webapp/index.jsp</code> in ra <code>0</code>, và ứng dụng đang chạy hiện tiêu đề đã hợp nhất.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git pull</span><span class="v">Kéo về — tải (fetch) những gì GitHub có, rồi hợp nhất vào nhánh đang đứng.</span></div>
  <div class="kv"><span class="k">git merge main</span><span class="v">Đem các commit của main vào nhánh hiện tại.</span></div>
  <div class="kv"><span class="k">Merge conflict</span><span class="v">Xung đột hợp nhất — hai thay đổi trên cùng dòng; Git dừng lại và bắt bạn chọn.</span></div>
  <div class="kv"><span class="k">Conflict markers</span><span class="v">Dấu xung đột — <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>; phải xoá hết trước khi <code>git add</code>.</span></div>
  <div class="kv"><span class="k">git stash</span><span class="v">Cất tạm — để dành phần sửa chưa commit; <code>stash pop</code> lấy lại (và có thể xung đột).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Việc của bạn bè: <code>switch main</code> + <code>pull</code>, rồi <code>switch</code> về nhánh mình + <code>merge main</code>.</li><li>"No tracking information" = pull trên nhánh chưa push; dùng luật hai bước.</li><li>"Local changes would be overwritten" = commit trên nhánh của mình trước (hoặc stash).</li><li>Giải xung đột: sửa, xoá dấu, <code>git add</code>, <code>git commit --no-edit</code>; hoặc <code>git merge --abort</code>.</li><li>Sau khi pull: Build with Dependencies cho <code>pom.xml</code>, Clean and Build cho code, chạy lại <code>setup.sql</code> trong SSMS.</li></ul>

${LT('git-3-3-xung-dot', '⚔️', 'Bài 3.3 — Xung đột hợp nhất', 'Đọc dấu xung đột, zdiff3, và giải mà không sợ.')}
${LT('git-14-1-vs-code', '🧩', 'Bài 14.1 — Git trong VS Code', 'Trình gộp ba khung, từng nút một.')}
${LX('https://git-scm.com/docs/git-pull', '📖', 'git pull — tra cứu', 'Merge, rebase hay chỉ tua thẳng, và cấu hình chọn cái nào.')}

<div class="pitfall co-tieu-de"><strong>Giải xung đột kiểu "lấy của mình" ở mọi chỗ.</strong> Sát hạn chót, rất dễ cứ giữ phía của mình ở mọi xung đột. Khi đó bạn lặng lẽ xoá mất việc đã merge của bạn cùng nhóm — và không ai phát hiện cho tới buổi demo. Đọc cả hai phía; không chắc thì hỏi người có tên trên commit phía bên kia (<code>git log -1 main -- src/main/webapp/index.jsp</code>).</div>
<p class="note-ct"><strong>Biến nó thành việc nhàm chán:</strong> sáng nào cũng merge main vào nhánh mình. Xung đột nhỏ mỗi ngày mất một phút; một xung đột to đêm trước hạn nộp mất cả buổi tối.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.9 ─────────────────────────── */
    {
      title: 'KĐ.9 — The errors we actually hit: symptom → cause → fix, on Windows and Mac|||KĐ.9 — Những lỗi nhóm đã gặp thật: triệu chứng → nguyên nhân → cách sửa, trên Windows và Mac',
      slug: 'git-kd-9-loi-thuong-gap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hơn 20 thông báo lỗi thật của một nhóm mới lên GitHub — command not found, not a git repository, key does not contain a section, invalid reference: main, 403, Repository not found, GH007, rejected (fetch first), no upstream, unrelated histories, Filename too long, SSL certificate problem… — mỗi cái: chữ chính xác, nghĩa là gì, sửa thế nào trên Windows và Mac.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.9</span>
<h2>Read the first red line, then look it up here</h2>
<p class="lead">Every error in this lesson was either hit by the PRJ301 team on 16–17 October or reproduced on real Git 2.51.1 output. Git's messages look frightening but are usually precise: the first line says what went wrong, and the <code>hint:</code> lines often say what to do. Search this page for the first few words of what you see. The rule before any fix: <strong>run <code>pwd</code>, <code>git status</code> and <code>git branch</code></strong> — half of these errors are "wrong folder" or "wrong branch".</p>

<h3>Before you even start</h3>
${slide(D, 30, 'Bảng lỗi thật (1/2)')}
<table>
<thead><tr><th>You see</th><th>It means</th><th>Fix — Windows</th><th>Fix — Mac</th></tr></thead>
<tbody>
<tr><td><code>'git' is not recognized as an internal or external command, operable program or batch file.</code> / <code>bash: git: command not found</code></td><td>Git not installed, or the window was opened before installing</td><td>Install Git for Windows, close and reopen Git Bash/NetBeans</td><td><code>xcode-select --install</code> or <code>brew install git</code>, reopen Terminal</td></tr>
<tr><td><code>'ls' is not recognized…</code></td><td>You are in CMD, not Git Bash</td><td>Use Git Bash (or <code>dir</code> in CMD)</td><td>—</td></tr>
<tr><td><code>bash: gh: command not found</code></td><td>gh is a separate program</td><td><code>winget install --id GitHub.cli</code>, reopen Git Bash — or skip gh (KĐ.3)</td><td><code>brew install gh</code></td></tr>
<tr><td><code>gh auth login</code> menu frozen</td><td>MinTTY cannot run gh's prompts</td><td><code>winpty gh auth login</code> or run it in PowerShell</td><td>—</td></tr>
<tr><td><code>fatal: not a git repository (or any of the parent directories): .git</code></td><td>Wrong folder, or a ZIP copy without <code>.git</code></td><td colspan="2"><code>pwd</code>, then <code>cd /c/Code/prj301-nhom</code> (Mac: <code>cd ~/Code/prj301-nhom</code>); never work in a ZIP (KĐ.6)</td></tr>
<tr><td><code>error: key does not contain a section: longbh2006</code></td><td>A config key needs <code>section.name</code></td><td colspan="2"><code>git config --global user.name "Bui Hoang Long"</code> (KĐ.2)</td></tr>
</tbody>
</table>

<h3>Logging in and access</h3>
<table>
<thead><tr><th>You see</th><th>It means</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu.</code> … <code>error: 403</code></td><td>The saved login is another account</td><td>Windows: Credential Manager → remove <code>git:https://github.com</code>. Mac: Keychain Access → delete <code>github.com</code>, or <code>gh auth logout</code>. Push again and sign in correctly (KĐ.3).</td></tr>
<tr><td><code>remote: Repository not found.</code> / 404 in the browser</td><td>Invitation not accepted, wrong account, or wrong URL</td><td>Accept at <code>github.com/notifications</code>; check the account; copy the URL from the Code button (KĐ.5).</td></tr>
<tr><td><code>Password authentication is not supported for Git operations.</code></td><td>You typed your GitHub password at a <code>Password for</code> prompt</td><td>Windows: let Git Credential Manager open the browser. Mac: <code>gh auth login</code>, or a token (lesson 5.2).</td></tr>
<tr><td><code>remote: error: GH007: Your push would publish a private email address.</code></td><td>Commits carry your private Gmail and email privacy is on</td><td>Set the noreply email (KĐ.2), then re-stamp unpushed commits — see below.</td></tr>
</tbody>
</table>
<p>GH007 fix on real output: change the config, then rewrite the last commit's author (for several commits, ask the leader — that is history rewriting, Chapter 8):</p>
<pre><code class="language-bash">git config --global user.email <span class="tok-string">"45678901+cuonghoang1103@users.noreply.github.com"</span>
git commit --amend --reset-author --no-edit
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">[main 801dcf9] thử danh tính
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
801dcf9 Hoang Cuong &lt;45678901+cuonghoang1103@users.noreply.github.com&gt;</div>

<h3>Branches: master, main and "invalid reference"</h3>
${slide(D, 18, 'master hay main — hỏi Git trước khi đổi')}
<p>Long's repository was created on a laptop without <code>init.defaultBranch</code>, so his branch was <code>master</code>. Replayed on real output:</p>
<pre><code class="language-bash">git switch main
git branch
git branch -m master main
git branch
git branch -m master main</code></pre>
<div class="out">fatal: invalid reference: main
* master
* main
fatal: no branch named 'master'</div>
<p><code>invalid reference: main</code> = there is no branch called main (here: it is called master; in an empty repository with no commit yet, no branch exists at all). The second rename fails harmlessly because the branch is already <code>main</code> — exactly what confused Long when he ran a tutorial's command after someone had already fixed it. Always <code>git branch</code> first; and set <code>git config --global init.defaultBranch main</code> so it never happens again.</p>

<h3>The daily loop</h3>
${slide(D, 31, 'Bảng lỗi thật (2/2)')}
<table>
<thead><tr><th>You see</th><th>It means</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>! [rejected]        main -&gt; main (fetch first)</code></td><td>GitHub has commits you do not have (someone merged a PR while you worked on main)</td><td><code>git pull</code>, then push again — and next time use a branch (KĐ.7)</td></tr>
<tr><td><code>! [rejected] … (non-fast-forward)</code></td><td>Your branch is behind its GitHub copy</td><td><code>git pull</code>, resolve if needed, push</td></tr>
<tr><td><code>fatal: The current branch nt-34-dang-nhap has no upstream branch.</code></td><td>First push of a new branch</td><td><code>git push -u origin nt-34-dang-nhap</code></td></tr>
<tr><td><code>There is no tracking information for the current branch.</code></td><td><code>git pull</code> on a branch never pushed</td><td><code>git switch main</code> + <code>git pull</code>, then <code>git merge main</code> on your branch (KĐ.8)</td></tr>
<tr><td><code>error: Your local changes to the following files would be overwritten by merge</code></td><td>Uncommitted edits in the way</td><td>Commit them on your branch (or <code>git stash</code>), then pull</td></tr>
<tr><td><code>fatal: refusing to merge unrelated histories</code></td><td>README created on the web + <code>git init</code> at home</td><td>Once: <code>git pull --no-rebase origin main --allow-unrelated-histories</code> (KĐ.4)</td></tr>
<tr><td><code>fatal: Need to specify how to reconcile divergent branches.</code></td><td>No pull strategy configured</td><td><code>git config --global pull.rebase false</code> (KĐ.2)</td></tr>
<tr><td><code>CONFLICT (content): Merge conflict in …</code></td><td>Two people changed the same lines</td><td>Edit, delete markers, <code>git add</code>, <code>git commit --no-edit</code> — or <code>git merge --abort</code> (KĐ.8)</td></tr>
<tr><td><code>nothing to commit, working tree clean</code></td><td>Not an error: nothing changed since the last commit</td><td>Did you save the file? Are you in the right folder? Was it already committed?</td></tr>
<tr><td><code>warning: … LF will be replaced by CRLF the next time Git touches it</code></td><td>Windows line-ending conversion (<code>core.autocrlf true</code>)</td><td>Nothing to fix; see Chapter 14.4 for <code>.gitattributes</code></td></tr>
</tbody>
</table>
<p>The most common one, on real output — Khoa committed on main and pushed after Long had merged:</p>
<pre><code class="language-bash">git push
git status</code></pre>
<div class="out">To https://github.com/longbh2006/prj301-nhom.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'https://github.com/longbh2006/prj301-nhom.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean</div>
<p>Never answer this with <code>git push --force</code>: it would delete Long's merged work from GitHub. Pull, check, push — or better, move the commit to a branch and open a PR.</p>

<h3>Windows-only: long paths and school Wi-Fi</h3>
<table>
<thead><tr><th>You see</th><th>It means</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>error: unable to create file src/main/java/…/ThanhToanDonHangServiceImpl.java: Filename too long</code> (often followed by <code>warning: Clone succeeded, but checkout failed.</code>)</td><td>Windows' 260-character path limit</td><td><code>git config --global core.longpaths true</code>, clone into a short path like <code>C:\\Code</code>, then <code>git restore --source=HEAD :/</code> (or clone again)</td></tr>
<tr><td><code>fatal: unable to access 'https://github.com/…': SSL certificate problem: unable to get local issuer certificate</code></td><td>The network inserts its own certificate (common on campus Wi-Fi)</td><td>Windows: <code>git config --global http.sslBackend schannel</code> (uses the Windows certificate store). Mac: try another network or install the school certificate as IT instructs. Never <code>http.sslVerify false</code>.</td></tr>
</tbody>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p>Break things on purpose in the fake repository from KĐ.4 (<code>~/Code/prj301-thu</code>, Windows <code>/c/Code/prj301-thu</code>), so the real ones are familiar:</p><ol><li><code>cd ~</code> and run <code>git status</code> → read "not a git repository"; <code>cd</code> back.</li><li><code>git switch hello</code> → "invalid reference"; <code>git branch -m master main</code> on a repo already on main → "no branch named 'master'".</li><li>Make a clone in a second folder, commit and push from it; then commit on main in the first folder and <code>git push</code> → "rejected (fetch first)". Fix with <code>git pull</code> + push.</li><li>Create a branch and run <code>git push</code> without <code>-u</code> → "no upstream branch"; fix it.</li><li>Run <code>git commit -m "x"</code> with nothing changed → "nothing to commit".</li></ol>
<p><strong>Done when:</strong> you have produced five of the messages above yourself, and fixed each without deleting a folder or using <code>--force</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fatal / error / warning / hint</span><span class="v">Stopped / failed / worth knowing / Git's own advice — read hints, they are usually right.</span></div>
  <div class="kv"><span class="k">Rejected (fetch first)</span><span class="v">The remote branch moved ahead; integrate before pushing.</span></div>
  <div class="kv"><span class="k">Invalid reference</span><span class="v">The name you gave is not an existing branch or commit.</span></div>
  <div class="kv"><span class="k">core.longpaths</span><span class="v">Windows setting that allows paths longer than 260 characters.</span></div>
  <div class="kv"><span class="k">http.sslBackend schannel</span><span class="v">Windows setting: verify HTTPS with the Windows certificate store.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>First check: <code>pwd</code>, <code>git status</code>, <code>git branch</code>.</li><li>Login errors (403, not found, password not supported) are fixed in Credential Manager / Keychain / gh, not in the code.</li><li>Rejected pushes are fixed with <code>pull</code>, never with <code>--force</code> on a shared branch.</li><li><code>invalid reference: main</code> = the branch has another name; read <code>git branch</code>.</li><li>Windows: <code>core.longpaths true</code> for long Java paths, <code>http.sslBackend schannel</code> for school Wi-Fi.</li></ul>

${LT('git-16-4-su-co-nhom', '🚑', 'Lesson 16.4 — Eight team incidents', 'Force-push over a teammate, a leaked .env, a 200 MB file and more.')}
${LT('git-13-1-cuu-ho', '🧯', 'Chapter 13 — Rescue cookbook', 'Recovering commits and branches you thought were lost.')}
${LX('https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors', '📖', 'GitHub Docs — Dealing with non-fast-forward errors', 'Why pushes are rejected and the safe ways to fix them.')}

<div class="pitfall co-tieu-de"><strong>Fixing by deleting the folder and cloning again.</strong> It "works" — and silently throws away every commit you had not pushed and every file you had not committed. Before any drastic step, run <code>git status</code> and <code>git log --oneline origin/main..HEAD</code> (your unpushed commits). If either shows something, push it to a branch first.</div>
<p class="note-ct"><strong>Add to this list:</strong> when your team hits a new message, paste the exact first line into the team chat with the fix that worked. In a month you will have your own version of this page.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.9</span>
<h2>Đọc dòng đỏ đầu tiên, rồi tra ở đây</h2>
<p class="lead">Mọi lỗi trong bài này hoặc nhóm PRJ301 đã gặp thật ngày 16–17/10, hoặc được tái hiện trên output thật của Git 2.51.1. Thông báo của Git trông đáng sợ nhưng thường rất chính xác: dòng đầu nói cái gì hỏng, còn các dòng <code>hint:</code> (gợi ý) hay nói luôn phải làm gì. Tìm trên trang này vài chữ đầu của thứ bạn thấy. Luật trước mọi cách sửa: <strong>chạy <code>pwd</code>, <code>git status</code> và <code>git branch</code></strong> — một nửa số lỗi này là "sai thư mục" hoặc "sai nhánh".</p>

<h3>Trước khi kịp bắt đầu</h3>
${slide(D, 30, 'Bảng lỗi thật (1/2)')}
<table>
<thead><tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Sửa — Windows</th><th>Sửa — Mac</th></tr></thead>
<tbody>
<tr><td><code>'git' is not recognized as an internal or external command, operable program or batch file.</code> / <code>bash: git: command not found</code></td><td>Chưa cài Git, hoặc cửa sổ mở trước khi cài</td><td>Cài Git for Windows, đóng rồi mở lại Git Bash/NetBeans</td><td><code>xcode-select --install</code> hoặc <code>brew install git</code>, mở lại Terminal</td></tr>
<tr><td><code>'ls' is not recognized…</code></td><td>Bạn đang ở CMD, không phải Git Bash</td><td>Dùng Git Bash (hoặc <code>dir</code> trong CMD)</td><td>—</td></tr>
<tr><td><code>bash: gh: command not found</code></td><td>gh là chương trình riêng</td><td><code>winget install --id GitHub.cli</code>, mở lại Git Bash — hoặc bỏ qua gh (KĐ.3)</td><td><code>brew install gh</code></td></tr>
<tr><td>Menu <code>gh auth login</code> đứng im</td><td>MinTTY không chạy được lời nhắc của gh</td><td><code>winpty gh auth login</code> hoặc chạy trong PowerShell</td><td>—</td></tr>
<tr><td><code>fatal: not a git repository (or any of the parent directories): .git</code></td><td>Sai thư mục, hoặc bản ZIP không có <code>.git</code></td><td colspan="2"><code>pwd</code>, rồi <code>cd /c/Code/prj301-nhom</code> (Mac: <code>cd ~/Code/prj301-nhom</code>); không bao giờ làm trên bản ZIP (KĐ.6)</td></tr>
<tr><td><code>error: key does not contain a section: longbh2006</code></td><td>Khoá cấu hình phải có dạng <code>mục.tên</code></td><td colspan="2"><code>git config --global user.name "Bui Hoang Long"</code> (KĐ.2)</td></tr>
</tbody>
</table>

<h3>Đăng nhập và quyền truy cập</h3>
<table>
<thead><tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td><code>remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu.</code> … <code>error: 403</code></td><td>Lần đăng nhập đã lưu là tài khoản khác</td><td>Windows: Credential Manager → xoá <code>git:https://github.com</code>. Mac: Keychain Access → xoá <code>github.com</code>, hoặc <code>gh auth logout</code>. Push lại và đăng nhập đúng (KĐ.3).</td></tr>
<tr><td><code>remote: Repository not found.</code> / 404 trên trình duyệt</td><td>Chưa nhận lời mời, nhầm tài khoản, hoặc sai URL</td><td>Chấp nhận ở <code>github.com/notifications</code>; kiểm tài khoản; chép URL từ nút Code (KĐ.5).</td></tr>
<tr><td><code>Password authentication is not supported for Git operations.</code></td><td>Bạn gõ mật khẩu GitHub vào lời nhắc <code>Password for</code></td><td>Windows: để Git Credential Manager mở trình duyệt. Mac: <code>gh auth login</code>, hoặc dùng token (bài 5.2).</td></tr>
<tr><td><code>remote: error: GH007: Your push would publish a private email address.</code></td><td>Commit mang Gmail riêng trong khi chế độ giữ kín email đang bật</td><td>Đặt email noreply (KĐ.2), rồi đóng dấu lại các commit chưa push — xem dưới.</td></tr>
</tbody>
</table>
<p>Sửa GH007 trên output thật: đổi cấu hình, rồi viết lại tác giả của commit cuối (nhiều commit thì hỏi trưởng nhóm — đó là viết lại lịch sử, Chương 8):</p>
<pre><code class="language-bash">git config --global user.email <span class="tok-string">"45678901+cuonghoang1103@users.noreply.github.com"</span>
git commit --amend --reset-author --no-edit
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">[main 801dcf9] thử danh tính
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
801dcf9 Hoang Cuong &lt;45678901+cuonghoang1103@users.noreply.github.com&gt;</div>

<h3>Nhánh: master, main và "invalid reference"</h3>
${slide(D, 18, 'master hay main — hỏi Git trước khi đổi')}
<p>Repo của Long được tạo trên một laptop chưa đặt <code>init.defaultBranch</code>, nên nhánh của Long tên <code>master</code>. Chạy lại trên output thật:</p>
<pre><code class="language-bash">git switch main
git branch
git branch -m master main
git branch
git branch -m master main</code></pre>
<div class="out">fatal: invalid reference: main
* master
* main
fatal: no branch named 'master'</div>
<p><code>invalid reference: main</code> (tham chiếu không hợp lệ) = không có nhánh nào tên main (ở đây: nó tên master; trong một repo rỗng chưa có commit nào thì còn chưa có nhánh nào cả). Lần đổi tên thứ hai báo lỗi vô hại vì nhánh đã là <code>main</code> rồi — đúng thứ làm Long rối khi chạy lệnh trong một hướng dẫn sau khi đã có người sửa xong. Luôn <code>git branch</code> trước; và đặt <code>git config --global init.defaultBranch main</code> để chuyện này không lặp lại.</p>

<h3>Vòng lặp hằng ngày</h3>
${slide(D, 31, 'Bảng lỗi thật (2/2)')}
<table>
<thead><tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td><code>! [rejected]        main -&gt; main (fetch first)</code></td><td>GitHub có commit bạn chưa có (có người merge PR trong lúc bạn làm trên main)</td><td><code>git pull</code>, rồi push lại — và lần sau dùng nhánh (KĐ.7)</td></tr>
<tr><td><code>! [rejected] … (non-fast-forward)</code></td><td>Nhánh của bạn đi sau bản trên GitHub</td><td><code>git pull</code>, giải xung đột nếu có, push</td></tr>
<tr><td><code>fatal: The current branch nt-34-dang-nhap has no upstream branch.</code></td><td>Lần push đầu của nhánh mới</td><td><code>git push -u origin nt-34-dang-nhap</code></td></tr>
<tr><td><code>There is no tracking information for the current branch.</code></td><td><code>git pull</code> trên nhánh chưa từng push</td><td><code>git switch main</code> + <code>git pull</code>, rồi <code>git merge main</code> trên nhánh của bạn (KĐ.8)</td></tr>
<tr><td><code>error: Your local changes to the following files would be overwritten by merge</code></td><td>Sửa dở chưa commit đang cản đường</td><td>Commit trên nhánh của bạn (hoặc <code>git stash</code>), rồi pull</td></tr>
<tr><td><code>fatal: refusing to merge unrelated histories</code></td><td>Tạo README trên web + <code>git init</code> ở nhà</td><td>Một lần: <code>git pull --no-rebase origin main --allow-unrelated-histories</code> (KĐ.4)</td></tr>
<tr><td><code>fatal: Need to specify how to reconcile divergent branches.</code></td><td>Chưa cấu hình cách pull</td><td><code>git config --global pull.rebase false</code> (KĐ.2)</td></tr>
<tr><td><code>CONFLICT (content): Merge conflict in …</code></td><td>Hai người sửa cùng dòng</td><td>Sửa, xoá dấu, <code>git add</code>, <code>git commit --no-edit</code> — hoặc <code>git merge --abort</code> (KĐ.8)</td></tr>
<tr><td><code>nothing to commit, working tree clean</code></td><td>Không phải lỗi: không có gì đổi từ commit cuối</td><td>Đã lưu file chưa? Đứng đúng thư mục chưa? Đã commit rồi chăng?</td></tr>
<tr><td><code>warning: … LF will be replaced by CRLF the next time Git touches it</code></td><td>Windows đổi ký tự xuống dòng (<code>core.autocrlf true</code>)</td><td>Không cần sửa gì; xem Chương 14.4 về <code>.gitattributes</code></td></tr>
</tbody>
</table>
<p>Lỗi phổ biến nhất, trên output thật — Khoa commit trên main rồi push sau khi Long đã merge:</p>
<pre><code class="language-bash">git push
git status</code></pre>
<div class="out">To https://github.com/longbh2006/prj301-nhom.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'https://github.com/longbh2006/prj301-nhom.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
On branch main
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean</div>
<p>Đừng bao giờ đáp lại bằng <code>git push --force</code>: nó sẽ xoá việc đã merge của Long khỏi GitHub. Pull, kiểm, push — hoặc tốt hơn, chuyển commit sang một nhánh và mở PR.</p>

<h3>Chỉ Windows: đường dẫn dài và Wi-Fi trường</h3>
<table>
<thead><tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td><code>error: unable to create file src/main/java/…/ThanhToanDonHangServiceImpl.java: Filename too long</code> (thường kèm <code>warning: Clone succeeded, but checkout failed.</code>)</td><td>Giới hạn đường dẫn 260 ký tự của Windows</td><td><code>git config --global core.longpaths true</code>, clone vào đường dẫn ngắn như <code>C:\\Code</code>, rồi <code>git restore --source=HEAD :/</code> (hoặc clone lại)</td></tr>
<tr><td><code>fatal: unable to access 'https://github.com/…': SSL certificate problem: unable to get local issuer certificate</code></td><td>Mạng chèn chứng chỉ riêng (hay gặp ở Wi-Fi trường)</td><td>Windows: <code>git config --global http.sslBackend schannel</code> (dùng kho chứng chỉ của Windows). Mac: thử mạng khác hoặc cài chứng chỉ của trường theo hướng dẫn của phòng IT. Không bao giờ <code>http.sslVerify false</code>.</td></tr>
</tbody>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p>Cố ý làm hỏng trong repo giả ở KĐ.4 (<code>~/Code/prj301-thu</code>, Windows <code>/c/Code/prj301-thu</code>), để lỗi thật trở nên quen mặt:</p><ol><li><code>cd ~</code> rồi chạy <code>git status</code> → đọc "not a git repository"; <code>cd</code> về lại.</li><li><code>git switch hello</code> → "invalid reference"; <code>git branch -m master main</code> trên repo đã là main → "no branch named 'master'".</li><li>Clone sang một thư mục thứ hai, commit và push từ đó; rồi commit trên main ở thư mục thứ nhất và <code>git push</code> → "rejected (fetch first)". Sửa bằng <code>git pull</code> + push.</li><li>Tạo một nhánh và chạy <code>git push</code> không có <code>-u</code> → "no upstream branch"; sửa nó.</li><li>Chạy <code>git commit -m "x"</code> khi không đổi gì → "nothing to commit".</li></ol>
<p><strong>Đạt khi:</strong> bạn tự tạo ra được năm thông báo ở trên, và sửa từng cái mà không xoá thư mục nào, không dùng <code>--force</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fatal / error / warning / hint</span><span class="v">Dừng hẳn / thất bại / nên biết / lời khuyên của chính Git — đọc hint, chúng thường đúng.</span></div>
  <div class="kv"><span class="k">Rejected (fetch first)</span><span class="v">Bị từ chối, tải về trước — nhánh trên remote đã đi tiếp; phải tích hợp rồi mới push.</span></div>
  <div class="kv"><span class="k">Invalid reference</span><span class="v">Tham chiếu không hợp lệ — cái tên bạn đưa không phải nhánh hay commit nào đang có.</span></div>
  <div class="kv"><span class="k">core.longpaths</span><span class="v">Cài đặt Windows cho phép đường dẫn dài hơn 260 ký tự.</span></div>
  <div class="kv"><span class="k">http.sslBackend schannel</span><span class="v">Cài đặt Windows: kiểm HTTPS bằng kho chứng chỉ của Windows.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Kiểm đầu tiên: <code>pwd</code>, <code>git status</code>, <code>git branch</code>.</li><li>Lỗi đăng nhập (403, not found, password not supported) sửa ở Credential Manager / Keychain / gh, không sửa trong code.</li><li>Push bị từ chối thì sửa bằng <code>pull</code>, không bao giờ <code>--force</code> trên nhánh chung.</li><li><code>invalid reference: main</code> = nhánh mang tên khác; đọc <code>git branch</code>.</li><li>Windows: <code>core.longpaths true</code> cho đường dẫn Java dài, <code>http.sslBackend schannel</code> cho Wi-Fi trường.</li></ul>

${LT('git-16-4-su-co-nhom', '🚑', 'Bài 16.4 — Tám sự cố nhóm', 'Force-push đè việc bạn, lộ .env, file 200 MB và hơn nữa.')}
${LT('git-13-1-cuu-ho', '🧯', 'Chương 13 — Sách công thức cứu hộ', 'Lấy lại commit và nhánh tưởng đã mất.')}
${LX('https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors', '📖', 'GitHub Docs — Xử lý lỗi non-fast-forward', 'Vì sao push bị từ chối và những cách sửa an toàn.')}

<div class="pitfall co-tieu-de"><strong>Sửa bằng cách xoá thư mục rồi clone lại.</strong> Nó "được" — và lặng lẽ vứt đi mọi commit bạn chưa push cùng mọi file bạn chưa commit. Trước mọi bước mạnh tay, chạy <code>git status</code> và <code>git log --oneline origin/main..HEAD</code> (các commit chưa push). Cái nào có nội dung thì push nó lên một nhánh trước đã.</div>
<p class="note-ct"><strong>Viết tiếp danh sách này:</strong> khi nhóm gặp một thông báo mới, dán nguyên dòng đầu vào nhóm chat cùng cách sửa đã chạy được. Một tháng sau, nhóm có trang này phiên bản của riêng mình.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.10 ─────────────────────────── */
    {
      title: 'KĐ.10 — Connecting GitHub to CT Work: webhook, card keys, Development and Contributions|||KĐ.10 — Nối GitHub với CT Work: webhook, mã thẻ, mục Phát triển và Đóng góp',
      slug: 'git-kd-10-noi-ct-work',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Admin dự án CT Work lấy Payload URL + Secret ở Cài đặt dự án → GitHub, chủ repo thêm webhook (application/json; Pushes, Pull requests, Branch or tag creation), nhánh/commit/PR có mã thẻ như NT-21 hiện ở mục Phát triển của thẻ, báo cáo Đóng góp đếm commit từng người và ánh xạ Tác giả Git — và vì sao mỗi dự án mới phải làm lại từ KĐ.4.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Lesson KĐ.10</span>
<h2>Let the tracker see the code: one webhook, and card keys in every name</h2>
<p class="lead">The PRJ301 team plans its work as cards in CT Work (<code>cuongthai.com/work</code>): NT-21 "home page", NT-34 "login form", NT-40 "home page title". Until this step, CT Work and GitHub knew nothing of each other — Cường had to ask "is NT-34 actually done?". After it, each card shows its own branches, commits and pull requests, and the Contributions report counts every member's commits. It takes two people ten minutes, once per project.</p>

<h3>How the connection works</h3>
${slide(D, 32, 'Nối GitHub với CT Work: một webhook cho mỗi dự án')}
<p>A <strong>webhook</strong> is GitHub calling a URL every time something happens in the repository. CT Work gives the project a <strong>Payload URL</strong> (of the form <code>https://cuongthai.com/api/v1/work/github/webhook/&lt;project id&gt;</code>) and a <strong>Secret</strong>. GitHub signs every delivery with that secret; CT Work rejects anything whose signature does not match, so nobody can fake events. No GitHub app, no personal token. Two people are involved because of permissions:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">CT Work project admin</span><span class="v">Only a project admin can press <strong>Connect GitHub</strong> and see the Secret. In this team: Cường.</span></div>
  <div class="kv"><span class="k">GitHub repository owner</span><span class="v">Only the owner manages webhooks — collaborators cannot (KĐ.5). In this team: Long.</span></div>
</div>

<h3>Step 1 — CT Work admin: Project settings → GitHub</h3>
<ol>
<li>Open the project in CT Work → <strong>Project settings</strong> → group <strong>Automation &amp; integrations</strong> → <strong>GitHub</strong>.</li>
<li>Click <strong>Connect GitHub</strong>. The page now shows "Set up the webhook in GitHub" with the <strong>Payload URL</strong> and the <strong>Secret</strong> (hidden; the eye icon reveals it, the copy icon copies it).</li>
<li>Send both to the repository owner <em>privately</em> (direct message, not the group chat, never a screenshot in a public channel). Anyone holding the Secret can forge GitHub events for your project. If it leaks, <strong>Rotate secret</strong> on the same page and update GitHub.</li>
</ol>

<h3>Step 2 — repository owner: Settings → Webhooks → Add webhook</h3>
<table>
<thead><tr><th>Field on GitHub</th><th>Value</th></tr></thead>
<tbody>
<tr><td>Payload URL</td><td>paste from CT Work</td></tr>
<tr><td>Content type</td><td><strong><code>application/json</code></strong> — check it: the dropdown also offers <code>application/x-www-form-urlencoded</code>, which CT Work cannot read</td></tr>
<tr><td>Secret</td><td>paste from CT Work</td></tr>
<tr><td>SSL verification</td><td>leave enabled</td></tr>
<tr><td>Which events would you like to trigger this webhook?</td><td><strong>Let me select individual events</strong>, then tick <strong>Branch or tag creation</strong>, <strong>Pull requests</strong>, <strong>Pushes</strong></td></tr>
<tr><td>Active</td><td>ticked → <strong>Add webhook</strong></td></tr>
</tbody>
</table>
<p>GitHub immediately sends a <code>ping</code>. Open the webhook → <strong>Recent Deliveries</strong>: a green tick and response 200 means connected; CT Work's GitHub page then shows "Last event received …" and fills the repository name by itself. Red deliveries tell you what is wrong:</p>
<table>
<thead><tr><th>Delivery response</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>401 <code>Invalid signature</code></td><td>Secret mistyped, or rotated in CT Work but not updated on GitHub</td><td>Paste the current Secret again; <strong>Redeliver</strong></td></tr>
<tr><td>400 <code>Invalid JSON payload</code></td><td>Content type left as <code>x-www-form-urlencoded</code></td><td>Switch to <code>application/json</code>, save, Redeliver</td></tr>
<tr><td>No deliveries at all</td><td>Webhook added to a different repository, or not Active</td><td>Check the repository name in the browser bar</td></tr>
</tbody>
</table>

<h3>Card keys in names — the only thing CT Work looks for</h3>
${slide(D, 33, 'Mã thẻ trong tên nhánh, commit, PR')}
<p>CT Work links an event to a card when the card key appears in it — upper or lower case both work:</p>
<table>
<thead><tr><th>Where</th><th>Example</th><th>Appears on card NT-21 as</th></tr></thead>
<tbody>
<tr><td>Branch name</td><td><code>nt-21-trang-chu</code></td><td>a branch</td></tr>
<tr><td>Commit message</td><td><code>NT-21 trang chủ + bảng Users + driver SQL Server</code></td><td>a commit (first line, link to GitHub)</td></tr>
<tr><td>PR title or description</td><td><code>NT-21: Trang chủ</code></td><td>a pull request with its state: open, draft, merged, closed</td></tr>
</tbody>
</table>
<p>On the card, open the <strong>Development</strong> section: counts of branches, commits and pull requests, each linking to GitHub. With no key anywhere, the card stays empty and shows "Include NT-21 in a branch, commit or PR to link it here." Optionally, the admin can set automatic transitions on the same settings page: <em>When a pull request is opened, move the issue to…</em> (e.g. In Review) and <em>When a pull request is merged, move the issue to…</em> (e.g. Done); a move that the card's workflow does not allow is simply skipped.</p>
<p>Git can show the same thread from the terminal — every commit of a card, including its merge (real output on Long's laptop):</p>
<pre><code class="language-bash">git log --oneline -i --grep=<span class="tok-string">"nt-21"</span></code></pre>
<div class="out">a1999ac Merge pull request #2 from longbh2006/nt-21-trang-chu
5f8fa56 NT-21 trang chủ + bảng Users + driver SQL Server</div>
<p>The merge commit matched too: GitHub's merge message carries the branch name, and the branch name carries the key. That is why naming the branch after the card is worth the habit.</p>

<h3>Reports → Contributions and Git authors</h3>
<p>Every push is also recorded for the project's <strong>Reports → Contributions</strong> tab — including commits without a card key — so the lecturer and the team see commits and pull requests per person. CT Work matches each commit's author to a project member by GitHub login, by email (a <code>…@users.noreply.github.com</code> address is recognised as that GitHub username) or by name. Commits made with a wrong identity (KĐ.2) — a laptop's default name, a teammate's email — show as <em>Not matched</em>. A project admin fixes that in <strong>Contribution settings</strong> → <strong>Git authors</strong>, mapping each unmatched author to a member. The numbers show activity, not quality; CT Work itself says to use them to start a conversation, never alone to grade.</p>
<div class="callout warn"><strong>Only from now on.</strong> A webhook reports events that happen <em>after</em> it was created. Commits pushed before step 2 never reach CT Work. Connect the webhook on day 1, right after KĐ.4–KĐ.5, before anyone starts a card.</div>

<h3>Per project — again for every new project or team</h3>
<p>Nothing in this lesson belongs to a laptop. The Payload URL contains the CT Work project's id; the webhook lives in one GitHub repository. So next term's project, or a new team for the same subject, means: create the repository (KĐ.4), invite (KĐ.5), everyone clones (KĐ.6), and connect the webhook again (KĐ.10). What you keep for ever is KĐ.1–KĐ.3: Git installed, your identity, your GitHub login.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>CT Work admin: Project settings → GitHub → Connect GitHub; send the Payload URL and Secret privately to the repository owner.</li><li>Owner: Settings → Webhooks → Add webhook with <code>application/json</code>, the Secret and the three events. Check <strong>Recent Deliveries</strong> shows the ping with a green tick.</li><li>Any member: pick a real card (say NT-21), <code>git switch main</code>, <code>git pull</code>, <code>git switch -c nt-21-thu-webhook</code>, change one line, <code>git commit -m "NT-21 thử webhook"</code>, <code>git push -u origin nt-21-thu-webhook</code>, open a PR titled <code>NT-21: thử webhook</code>.</li><li>Open card NT-21 in CT Work → Development: one branch, one commit, one pull request. Open Reports → Contributions and find your commit under your name; if it is "not matched", fix your email (KĐ.2) and ask the admin to map it in Git authors.</li></ol>
<p><strong>Done when:</strong> the webhook's latest delivery is green, card NT-21's Development section lists the branch, commit and PR, and Contributions shows the commit under the right member.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Webhook</span><span class="v">GitHub calling a URL (CT Work) every time a chosen event happens in the repository.</span></div>
  <div class="kv"><span class="k">Payload URL</span><span class="v">The address GitHub sends events to; one per CT Work project.</span></div>
  <div class="kv"><span class="k">Secret</span><span class="v">Shared key used to sign each delivery so CT Work can reject forgeries.</span></div>
  <div class="kv"><span class="k">Card key</span><span class="v">The card's code (NT-21); putting it in branch/commit/PR names creates the link.</span></div>
  <div class="kv"><span class="k">Development panel</span><span class="v">Section of a CT Work card listing its branches, commits and pull requests.</span></div>
  <div class="kv"><span class="k">Git authors mapping</span><span class="v">Admin setting that assigns unmatched commit authors to project members.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>CT Work admin: Project settings → GitHub → Connect GitHub → Payload URL + Secret, shared privately.</li><li>Repository owner: Settings → Webhooks → <code>application/json</code>, Secret, Pushes + Pull requests + Branch or tag creation.</li><li>Put the card key (NT-21) in branch names, commit messages and PR titles.</li><li>Development panel per card; Reports → Contributions per person; fix unmatched authors in Git authors.</li><li>Per project and only for future events: set it up on day 1, and again for every new project.</li></ul>

${LX('https://cuongthai.com/work', '🗂️', 'CT Work', 'Project tracker used by the team: cards, sprints, reports and integrations.')}
${LX('https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks', '🪝', 'GitHub Docs — Creating webhooks', 'Where the webhook form is and what each field means.')}
${LT('git-16-1-khoi-tao-repo-nhom', '🏗️', 'Lesson 16.1 — Day 0 of a team repository', 'Branch and commit naming conventions for the whole project.')}

<div class="pitfall co-tieu-de"><strong>Posting the Secret in the group chat "so everyone has it".</strong> Members never need it — only the repository owner pastes it once. A Secret in a chat log is a Secret in every screenshot and every chat backup. If that already happened, rotate it in CT Work and update the webhook.</div>
<p class="note-ct"><strong>Make the key automatic:</strong> agree that branch names always start with the card key in lower case (<code>nt-34-…</code>) and commit messages with it in upper case (<code>NT-34 …</code>). After a week nobody forgets, and CT Work fills itself.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Bài KĐ.10</span>
<h2>Cho công cụ quản lý việc nhìn thấy code: một webhook, và mã thẻ trong mọi cái tên</h2>
<p class="lead">Nhóm PRJ301 lên kế hoạch bằng các thẻ trong CT Work (<code>cuongthai.com/work</code>): NT-21 "trang chủ", NT-34 "form đăng nhập", NT-40 "tiêu đề trang chủ". Trước bước này, CT Work và GitHub chẳng biết gì về nhau — Cường phải hỏi "NT-34 xong thật chưa?". Sau bước này, mỗi thẻ tự hiện nhánh, commit và pull request của nó, và báo cáo Đóng góp đếm commit của từng thành viên. Hai người, mười phút, một lần cho mỗi dự án.</p>

<h3>Kết nối hoạt động thế nào</h3>
${slide(D, 32, 'Nối GitHub với CT Work: một webhook cho mỗi dự án')}
<p><strong>Webhook</strong> là GitHub tự gọi tới một URL mỗi khi có chuyện xảy ra trong repo. CT Work cấp cho dự án một <strong>Payload URL</strong> (dạng <code>https://cuongthai.com/api/v1/work/github/webhook/&lt;id dự án&gt;</code>) và một <strong>Secret</strong> (khoá bí mật). GitHub ký mỗi lần gửi bằng secret đó; CT Work từ chối mọi thứ có chữ ký không khớp, nên không ai giả được sự kiện. Không cần GitHub app, không cần token cá nhân. Cần hai người vì chuyện quyền:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Admin dự án CT Work</span><span class="v">Chỉ admin dự án bấm được <strong>Kết nối GitHub</strong> và xem được Secret. Trong nhóm này: Cường.</span></div>
  <div class="kv"><span class="k">Chủ repo GitHub</span><span class="v">Chỉ chủ repo quản lý webhook — collaborator không làm được (KĐ.5). Trong nhóm này: Long.</span></div>
</div>

<h3>Bước 1 — admin CT Work: Cài đặt dự án → GitHub</h3>
<ol>
<li>Mở dự án trong CT Work → <strong>Cài đặt dự án</strong> → nhóm <strong>Tự động hoá &amp; tích hợp</strong> → <strong>GitHub</strong>.</li>
<li>Bấm <strong>Kết nối GitHub</strong>. Trang hiện mục "Cài webhook trong GitHub" với <strong>Payload URL</strong> và <strong>Secret</strong> (bị ẩn; biểu tượng con mắt để hiện, biểu tượng chép để chép).</li>
<li>Gửi cả hai cho chủ repo <em>riêng tư</em> (tin nhắn riêng, không phải nhóm chat, không bao giờ chụp màn hình vào kênh công khai). Ai giữ Secret là giả được sự kiện GitHub cho dự án của bạn. Lỡ lộ thì bấm <strong>Đổi khoá bí mật</strong> ngay trên trang đó rồi cập nhật bên GitHub.</li>
</ol>

<h3>Bước 2 — chủ repo: Settings → Webhooks → Add webhook</h3>
<table>
<thead><tr><th>Ô trên GitHub</th><th>Giá trị</th></tr></thead>
<tbody>
<tr><td>Payload URL</td><td>dán từ CT Work</td></tr>
<tr><td>Content type</td><td><strong><code>application/json</code></strong> — kiểm kỹ: danh sách còn có <code>application/x-www-form-urlencoded</code>, thứ CT Work không đọc được</td></tr>
<tr><td>Secret</td><td>dán từ CT Work</td></tr>
<tr><td>SSL verification</td><td>để bật</td></tr>
<tr><td>Which events would you like to trigger this webhook?</td><td><strong>Let me select individual events</strong>, rồi tích <strong>Branch or tag creation</strong>, <strong>Pull requests</strong>, <strong>Pushes</strong></td></tr>
<tr><td>Active</td><td>tích → <strong>Add webhook</strong></td></tr>
</tbody>
</table>
<p>GitHub gửi ngay một <code>ping</code>. Mở webhook → <strong>Recent Deliveries</strong>: dấu tích xanh và mã phản hồi 200 nghĩa là đã nối; trang GitHub của CT Work khi đó hiện "Sự kiện gần nhất nhận …" và tự điền tên repo. Lần gửi màu đỏ cho biết sai ở đâu:</p>
<table>
<thead><tr><th>Phản hồi của lần gửi</th><th>Nguyên nhân</th><th>Sửa</th></tr></thead>
<tbody>
<tr><td>401 <code>Invalid signature</code></td><td>Gõ sai Secret, hoặc đã đổi khoá trong CT Work mà chưa cập nhật bên GitHub</td><td>Dán lại Secret hiện tại; bấm <strong>Redeliver</strong></td></tr>
<tr><td>400 <code>Invalid JSON payload</code></td><td>Content type vẫn để <code>x-www-form-urlencoded</code></td><td>Đổi sang <code>application/json</code>, lưu, Redeliver</td></tr>
<tr><td>Không có lần gửi nào</td><td>Thêm webhook nhầm repo khác, hoặc chưa tích Active</td><td>Nhìn tên repo trên thanh địa chỉ trình duyệt</td></tr>
</tbody>
</table>

<h3>Mã thẻ trong tên — thứ duy nhất CT Work tìm</h3>
${slide(D, 33, 'Mã thẻ trong tên nhánh, commit, PR')}
<p>CT Work nối một sự kiện với một thẻ khi mã thẻ xuất hiện trong đó — viết hoa hay thường đều được:</p>
<table>
<thead><tr><th>Chỗ đặt</th><th>Ví dụ</th><th>Hiện trên thẻ NT-21 thành</th></tr></thead>
<tbody>
<tr><td>Tên nhánh</td><td><code>nt-21-trang-chu</code></td><td>một nhánh</td></tr>
<tr><td>Lời nhắn commit</td><td><code>NT-21 trang chủ + bảng Users + driver SQL Server</code></td><td>một commit (dòng đầu, link tới GitHub)</td></tr>
<tr><td>Tiêu đề hoặc mô tả PR</td><td><code>NT-21: Trang chủ</code></td><td>một pull request kèm trạng thái: open, draft, merged, closed</td></tr>
</tbody>
</table>
<p>Trên thẻ, mở mục <strong>Phát triển</strong> (Development): số nhánh, số commit, số pull request, cái nào cũng link về GitHub. Không có mã ở đâu cả thì thẻ để trống và nhắc "Đưa NT-21 vào tên nhánh, commit hoặc PR để liên kết vào đây." Tuỳ chọn, admin có thể đặt tự chuyển trạng thái ngay trên trang cài đặt đó: <em>khi mở pull request, chuyển thẻ sang…</em> (ví dụ In Review) và <em>khi merge pull request, chuyển thẻ sang…</em> (ví dụ Done); bước chuyển nào quy trình của thẻ không cho phép thì đơn giản là bỏ qua.</p>
<p>Git cũng cho xem cùng sợi chỉ đó từ terminal — mọi commit của một thẻ, kể cả commit merge (output thật trên laptop của Long):</p>
<pre><code class="language-bash">git log --oneline -i --grep=<span class="tok-string">"nt-21"</span></code></pre>
<div class="out">a1999ac Merge pull request #2 from longbh2006/nt-21-trang-chu
5f8fa56 NT-21 trang chủ + bảng Users + driver SQL Server</div>
<p>Commit merge cũng khớp: lời nhắn merge của GitHub mang tên nhánh, và tên nhánh mang mã thẻ. Đó là lý do đặt tên nhánh theo thẻ đáng thành thói quen.</p>

<h3>Báo cáo → Đóng góp và Tác giả Git</h3>
<p>Mỗi lần push cũng được ghi cho tab <strong>Báo cáo → Đóng góp</strong> (Contributions) của dự án — kể cả commit không có mã thẻ — nên giảng viên và cả nhóm thấy commit và pull request của từng người. CT Work khớp tác giả mỗi commit với một thành viên dự án theo login GitHub, theo email (địa chỉ <code>…@users.noreply.github.com</code> được nhận ra là username GitHub đó) hoặc theo tên. Commit tạo bằng danh tính sai (KĐ.2) — tên mặc định của laptop, email của bạn khác — hiện là <em>chưa khớp</em>. Admin dự án sửa ở Cài đặt đóng góp → <strong>Tác giả Git</strong>, gán từng tác giả chưa khớp cho một thành viên. Các con số cho thấy hoạt động, không phải chất lượng; chính CT Work ghi rõ hãy dùng chúng để bắt đầu một cuộc trò chuyện, đừng bao giờ dùng riêng chúng để chấm điểm.</p>
<div class="callout warn"><strong>Chỉ tính từ bây giờ.</strong> Webhook báo những sự kiện xảy ra <em>sau</em> khi nó được tạo. Commit đã push trước bước 2 không bao giờ tới được CT Work. Nối webhook ngay ngày đầu, ngay sau KĐ.4–KĐ.5, trước khi ai bắt đầu thẻ nào.</div>

<h3>Theo dự án — làm lại cho mỗi dự án hay nhóm mới</h3>
<p>Không thứ gì trong bài này thuộc về laptop. Payload URL chứa id của dự án CT Work; webhook sống trong một repo GitHub. Nên dự án kỳ sau, hay một nhóm mới cho cùng môn, nghĩa là: tạo repo (KĐ.4), mời (KĐ.5), cả nhóm clone (KĐ.6), và nối webhook lần nữa (KĐ.10). Thứ bạn giữ mãi là KĐ.1–KĐ.3: Git đã cài, danh tính của bạn, lần đăng nhập GitHub của bạn.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Admin CT Work: Cài đặt dự án → GitHub → Kết nối GitHub; gửi riêng Payload URL và Secret cho chủ repo.</li><li>Chủ repo: Settings → Webhooks → Add webhook với <code>application/json</code>, Secret và ba sự kiện. Kiểm <strong>Recent Deliveries</strong> có lần ping tích xanh.</li><li>Một thành viên bất kỳ: chọn một thẻ thật (ví dụ NT-21), <code>git switch main</code>, <code>git pull</code>, <code>git switch -c nt-21-thu-webhook</code>, sửa một dòng, <code>git commit -m "NT-21 thử webhook"</code>, <code>git push -u origin nt-21-thu-webhook</code>, mở PR tiêu đề <code>NT-21: thử webhook</code>.</li><li>Mở thẻ NT-21 trong CT Work → mục Phát triển: một nhánh, một commit, một pull request. Mở Báo cáo → Đóng góp và tìm commit dưới tên bạn; nếu "chưa khớp", sửa email (KĐ.2) và nhờ admin gán ở Tác giả Git.</li></ol>
<p><strong>Đạt khi:</strong> lần gửi gần nhất của webhook màu xanh, mục Phát triển của thẻ NT-21 liệt kê nhánh, commit và PR, và tab Đóng góp hiện commit dưới đúng thành viên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Webhook</span><span class="v">Móc gọi lại — GitHub gọi một URL (CT Work) mỗi khi một sự kiện đã chọn xảy ra trong repo.</span></div>
  <div class="kv"><span class="k">Payload URL</span><span class="v">Địa chỉ GitHub gửi sự kiện tới; mỗi dự án CT Work một cái.</span></div>
  <div class="kv"><span class="k">Secret</span><span class="v">Khoá bí mật dùng chung để ký mỗi lần gửi, nhờ đó CT Work từ chối được hàng giả.</span></div>
  <div class="kv"><span class="k">Card key</span><span class="v">Mã thẻ (NT-21); đặt nó trong tên nhánh/commit/PR là tạo ra liên kết.</span></div>
  <div class="kv"><span class="k">Development panel</span><span class="v">Mục Phát triển — phần của thẻ CT Work liệt kê nhánh, commit, pull request của nó.</span></div>
  <div class="kv"><span class="k">Git authors mapping</span><span class="v">Ánh xạ Tác giả Git — cài đặt của admin gán các tác giả commit chưa khớp cho thành viên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Admin CT Work: Cài đặt dự án → GitHub → Kết nối GitHub → Payload URL + Secret, gửi riêng.</li><li>Chủ repo: Settings → Webhooks → <code>application/json</code>, Secret, Pushes + Pull requests + Branch or tag creation.</li><li>Đặt mã thẻ (NT-21) trong tên nhánh, lời nhắn commit và tiêu đề PR.</li><li>Mục Phát triển cho từng thẻ; Báo cáo → Đóng góp cho từng người; sửa tác giả chưa khớp ở Tác giả Git.</li><li>Theo dự án và chỉ cho sự kiện về sau: cài ngay ngày đầu, và làm lại cho mỗi dự án mới.</li></ul>

${LX('https://cuongthai.com/work', '🗂️', 'CT Work', 'Công cụ quản lý dự án nhóm dùng: thẻ, sprint, báo cáo và tích hợp.')}
${LX('https://docs.github.com/en/webhooks/using-webhooks/creating-webhooks', '🪝', 'GitHub Docs — Tạo webhook', 'Form webhook nằm ở đâu và từng ô nghĩa là gì.')}
${LT('git-16-1-khoi-tao-repo-nhom', '🏗️', 'Bài 16.1 — Ngày 0 của một repo nhóm', 'Quy ước đặt tên nhánh và commit cho cả dự án.')}

<div class="pitfall co-tieu-de"><strong>Dán Secret vào nhóm chat "cho ai cũng có".</strong> Thành viên không bao giờ cần nó — chỉ chủ repo dán một lần. Secret nằm trong lịch sử chat là Secret nằm trong mọi ảnh chụp màn hình và mọi bản sao lưu chat. Lỡ rồi thì đổi khoá trong CT Work và cập nhật webhook.</div>
<p class="note-ct"><strong>Biến mã thẻ thành phản xạ:</strong> thống nhất tên nhánh luôn bắt đầu bằng mã thẻ viết thường (<code>nt-34-…</code>) và lời nhắn commit bắt đầu bằng mã viết hoa (<code>NT-34 …</code>). Sau một tuần không ai quên nữa, và CT Work tự đầy.</p>
</div>
`,
    },

    /* ─────────────────────────── KĐ.11 Quiz ─────────────────────────── */
    {
      title: 'KĐ.11 — Quick start check|||KĐ.11 — Kiểm tra Khởi động nhanh',
      slug: 'git-kd-11-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật của nhóm PRJ301: danh tính, đăng nhập 403, gh treo trong Git Bash, README + git init, thư mục rỗng, bản ZIP, upstream, lấy code của bạn, webhook CT Work, và việc nào phải làm lại khi sang dự án mới.',
      content: `
<div class="ml-en">
<span class="eyebrow">Quick start · Check</span>
<h2>Ten situations from one team's first week on GitHub</h2>
<p class="lead">Every question below happened to the PRJ301 team or very nearly did. Answer as if you were the teammate sitting next to them. Read the explanations afterwards — they say why the most tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can install and check Git on Windows and Mac, and I always know which folder my terminal is in.</li>
<li>I can set name, noreply email, <code>init.defaultBranch</code>, <code>pull.rebase</code> and <code>core.autocrlf</code> for my OS — and explain "key does not contain a section".</li>
<li>I can sign in to GitHub on my machine and fix a 403 caused by a remembered account.</li>
<li>I can create, invite to, clone and push a team repository without a ZIP or an empty-folder surprise.</li>
<li>I can run the daily loop for one card, explain <code>origin</code>, <code>-u</code> and upstream, and bring teammates' work into my branch.</li>
<li>I can connect the repository to CT Work and name branches, commits and PRs with the card key.</li>
</ul>
${slide(D, 34, 'Bảng tra nhanh Khởi động nhanh')}
</div>
<div class="ml-vi">
<span class="eyebrow">Khởi động nhanh · Kiểm tra</span>
<h2>Mười tình huống từ tuần đầu tiên của một nhóm trên GitHub</h2>
<p class="lead">Mọi câu dưới đây đã xảy ra với nhóm PRJ301, hoặc suýt xảy ra. Trả lời như thể bạn là người ngồi ngay cạnh họ. Đọc phần giải thích sau khi nộp — nó nói vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi cài và kiểm được Git trên Windows và Mac, và luôn biết terminal của mình đang đứng ở thư mục nào.</li>
<li>Tôi đặt được tên, email noreply, <code>init.defaultBranch</code>, <code>pull.rebase</code> và <code>core.autocrlf</code> đúng hệ điều hành — và giải thích được "key does not contain a section".</li>
<li>Tôi đăng nhập GitHub được trên máy mình và sửa được lỗi 403 do máy nhớ nhầm tài khoản.</li>
<li>Tôi tạo, mời, clone và push được một repo nhóm mà không dính bản ZIP hay bất ngờ về thư mục rỗng.</li>
<li>Tôi chạy được vòng lặp hằng ngày cho một thẻ, giải thích được <code>origin</code>, <code>-u</code> và upstream, và đem được việc của bạn vào nhánh mình.</li>
<li>Tôi nối được repo với CT Work và đặt tên nhánh, commit, PR có mã thẻ.</li>
</ul>
${slide(D, 34, 'Bảng tra nhanh Khởi động nhanh')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Long wants his commits to show his name. He types git config --global longbh2006 and gets "error: key does not contain a section". What should he run instead?|||Long muốn commit hiện tên mình. Long gõ git config --global longbh2006 và nhận "error: key does not contain a section". Long nên chạy gì?',
            options: [
              'git config --global user longbh2006|||git config --global user longbh2006',
              'git config --global username longbh2006, because Git needs the GitHub username|||git config --global username longbh2006, vì Git cần username GitHub',
              'git config --global user.name "Bui Hoang Long" and user.email set to his noreply address|||git config --global user.name "Bui Hoang Long" và user.email đặt bằng địa chỉ noreply của Long',
              'gh auth login, because identity is set by logging in|||gh auth login, vì danh tính được đặt khi đăng nhập',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A config key has the form section.name (user.name, user.email); the error says the dot is missing. The tempting "username longbh2006" fails with the same error (no section) and misunderstands the goal: commits carry a display name and an email; the GitHub username is only used to log in (KĐ.3).|||VI: Khoá cấu hình có dạng mục.tên (user.name, user.email); lỗi báo thiếu dấu chấm. Phương án hấp dẫn "username longbh2006" cũng báo đúng lỗi đó (không có mục) và hiểu sai mục đích: commit mang tên hiển thị và email; username GitHub chỉ dùng để đăng nhập (KĐ.3).',
          },
          {
            question: 'Tú runs git pull and sees "Updating … Fast-forward", but NetBeans still shows yesterday’s code. Project → Properties shows the path C:\\Users\\Lenovo\\Downloads\\prj301-nhom-main. What is going on?|||Tú chạy git pull, thấy "Updating … Fast-forward", nhưng NetBeans vẫn hiện code hôm qua. Project → Properties hiện đường dẫn C:\\Users\\Lenovo\\Downloads\\prj301-nhom-main. Chuyện gì đang xảy ra?',
            options: [
              'NetBeans is showing a Download ZIP copy; the pull updated the cloned folder elsewhere — close the ZIP project and open the clone|||NetBeans đang mở bản Download ZIP; lệnh pull cập nhật bản clone ở chỗ khác — đóng dự án ZIP, mở bản clone',
              'The pull only downloaded; he must run git push to apply the changes locally|||Lệnh pull mới chỉ tải về; phải chạy git push để áp thay đổi vào máy',
              'NetBeans caches files for 24 hours; wait or reinstall NetBeans|||NetBeans giữ bộ đệm file 24 giờ; chờ hoặc cài lại NetBeans',
              'Fast-forward means nothing changed; ask teammates to push again|||Fast-forward nghĩa là không có gì đổi; nhờ các bạn push lại',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A folder named …-main in Downloads is GitHub’s ZIP: no .git, invisible to git pull. The pull really did update files — in the clone. Fast-forward means main moved ahead to new commits, not that nothing changed; and push sends, it never updates your files.|||VI: Thư mục tên …-main trong Downloads là bản ZIP của GitHub: không có .git, git pull không nhìn thấy. Lệnh pull thật sự đã cập nhật file — trong bản clone. Fast-forward nghĩa là main tiến tới commit mới, không phải "không đổi gì"; còn push là gửi đi, không bao giờ cập nhật file của bạn.',
          },
          {
            question: 'Khoa pushes and gets "remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu." and error 403. khoa-cu is an old account from another subject. What fixes it on his Windows laptop?|||Khoa push và nhận "remote: Permission to longbh2006/prj301-nhom.git denied to khoa-cu." kèm lỗi 403. khoa-cu là tài khoản cũ của một môn khác. Cách nào sửa được trên laptop Windows của Khoa?',
            options: [
              'Change user.email to his new account’s email and push again|||Đổi user.email sang email của tài khoản mới rồi push lại',
              'Ask Long to make the repository public|||Nhờ Long chuyển repo sang public',
              'Delete the project folder and clone it again|||Xoá thư mục dự án rồi clone lại',
              'Remove the git:https://github.com entry from Windows Credential Manager (or git credential-manager github logout khoa-cu), push again and sign in with the right account|||Xoá mục git:https://github.com trong Windows Credential Manager (hoặc git credential-manager github logout khoa-cu), push lại và đăng nhập đúng tài khoản',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: "denied to khoa-cu" names the account used to log in, which comes from the saved credential, not from user.email (that only labels commits). Re-cloning reuses the same saved login and still fails; making the repo public would not give khoa-cu write access either.|||VI: "denied to khoa-cu" nêu tài khoản đã dùng để đăng nhập, lấy từ thông tin đăng nhập đã lưu, không phải từ user.email (thứ đó chỉ gắn nhãn commit). Clone lại vẫn dùng đúng lần đăng nhập đã lưu nên vẫn hỏng; chuyển repo sang public cũng không cho khoa-cu quyền ghi.',
          },
          {
            question: 'Long created packages dao and model in NetBeans, committed and pushed. Khoa clones and the two packages are missing. Why?|||Long tạo package dao và model trong NetBeans, commit rồi push. Khoa clone về thì không thấy hai package đó. Vì sao?',
            options: [
              'Khoa cloned the wrong branch|||Khoa clone nhầm nhánh',
              'The packages were empty folders and Git only stores files — add a class or a .gitkeep in each and commit|||Package là thư mục rỗng mà Git chỉ lưu file — thêm một class hoặc một .gitkeep vào mỗi thư mục rồi commit',
              '.gitignore ignores every folder that ends in a package name|||.gitignore bỏ qua mọi thư mục có tên package',
              'NetBeans needs Team → Git → Add Package before pushing|||NetBeans cần Team → Git → Add Package trước khi push',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A package without a class is an empty directory; git status even stays silent about it, and git ls-files on Long’s machine does not list it. The repository has only one branch (main), so "wrong branch" does not explain it, and the .gitignore in KĐ.4 ignores build output, not packages.|||VI: Package chưa có class là một thư mục rỗng; git status còn chẳng nhắc tới nó, và git ls-files trên máy Long không liệt kê nó. Repo chỉ có một nhánh (main), nên "nhầm nhánh" không giải thích được, còn .gitignore ở KĐ.4 bỏ qua sản phẩm build chứ không bỏ qua package.',
          },
          {
            question: 'On a new branch nt-34-dang-nhap Khoa runs git push and gets "The current branch nt-34-dang-nhap has no upstream branch." What should he do, and how often?|||Trên nhánh mới nt-34-dang-nhap, Khoa chạy git push và nhận "The current branch nt-34-dang-nhap has no upstream branch." Khoa nên làm gì, và bao lâu một lần?',
            options: [
              'git push --force, every time he pushes this branch|||git push --force, mỗi lần push nhánh này',
              'git push -u origin nt-34-dang-nhap, only for this first push of the branch|||git push -u origin nt-34-dang-nhap, chỉ ở lần push đầu tiên của nhánh',
              'git pull first, then git push — every morning|||git pull trước, rồi git push — mỗi sáng',
              'git clone the repository again so the branch gets an upstream|||git clone lại repo để nhánh có upstream',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: -u (--set-upstream) creates the branch on GitHub and remembers the pair; afterwards plain git push/pull work on that branch. --force is for rewriting history and is dangerous on shared branches; pulling first does not create an upstream, it fails with "no tracking information".|||VI: -u (--set-upstream) tạo nhánh trên GitHub và ghi nhớ cặp đôi; sau đó git push/pull trần chạy được trên nhánh đó. --force dùng để viết lại lịch sử và nguy hiểm trên nhánh chung; pull trước không tạo được upstream, nó báo "no tracking information".',
          },
          {
            question: 'Long ticked "Add README" when creating the repository on github.com, then ran git init and committed his project locally. git push is rejected (fetch first) and git pull --no-rebase says "refusing to merge unrelated histories". Best fix on day one?|||Long tích "Add README" khi tạo repo trên github.com, rồi chạy git init và commit dự án ở máy. git push bị từ chối (fetch first) và git pull --no-rebase báo "refusing to merge unrelated histories". Cách sửa tốt nhất ngày đầu?',
            options: [
              'git push --force to replace GitHub’s README commit with his history|||git push --force để thay commit README của GitHub bằng lịch sử của mình',
              'Delete the GitHub repository and make the team wait for a new one tomorrow|||Xoá repo trên GitHub và bắt cả nhóm chờ repo mới vào ngày mai',
              'Copy the README text by hand into his project and push again|||Chép tay nội dung README vào dự án của mình rồi push lại',
              'Join the two histories once: git pull --no-rebase origin main --allow-unrelated-histories, then git push -u origin main|||Nối hai lịch sử một lần: git pull --no-rebase origin main --allow-unrelated-histories, rồi git push -u origin main',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The two chains have no common commit, so Git asks you to confirm the join explicitly — once. Copying the README by hand does not help: his history still lacks GitHub’s commit and the push is still rejected. --force would work here only by discarding a commit — a habit that later destroys teammates’ work.|||VI: Hai chuỗi không có commit chung, nên Git bắt bạn xác nhận việc nối một cách rõ ràng — một lần. Chép tay README không giúp gì: lịch sử của Long vẫn thiếu commit của GitHub nên push vẫn bị từ chối. --force ở đây "được" chỉ vì vứt bỏ một commit — một thói quen về sau sẽ xoá việc của bạn cùng nhóm.',
          },
          {
            question: 'In Git Bash on Windows, gh auth login prints "? Where do you use GitHub?" and the arrow keys do nothing. What is a correct way forward?|||Trong Git Bash trên Windows, gh auth login in "? Where do you use GitHub?" rồi phím mũi tên không có tác dụng. Cách đi tiếp nào đúng?',
            options: [
              'Run winpty gh auth login, or run it in PowerShell — or skip gh and let Git Credential Manager sign in at the first push|||Chạy winpty gh auth login, hoặc chạy trong PowerShell — hoặc bỏ qua gh để Git Credential Manager đăng nhập ở lần push đầu',
              'Reinstall Git, because gh is part of Git for Windows and is broken|||Cài lại Git, vì gh nằm trong Git for Windows và đang hỏng',
              'Type the GitHub password when Git asks for it instead|||Thay vào đó gõ mật khẩu GitHub khi Git hỏi',
              'Switch to CMD and run git config --global gh.login true|||Chuyển sang CMD và chạy git config --global gh.login true',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Git Bash runs in MinTTY, which the gh manual lists as having problems with gh’s prompts; winpty or another terminal fixes it, and on Windows GCM already handles login. gh is a separate program, not part of Git for Windows; GitHub passwords are rejected for Git since 2021; gh.login is not a real setting.|||VI: Git Bash chạy trong MinTTY, thứ mà tài liệu gh ghi là có vấn đề với lời nhắc của gh; winpty hoặc một terminal khác sẽ sửa được, và trên Windows GCM đã lo việc đăng nhập. gh là chương trình riêng, không thuộc Git for Windows; mật khẩu GitHub bị từ chối cho Git từ 2021; gh.login không phải cài đặt có thật.',
          },
          {
            question: 'Tú is halfway through card NT-40 (uncommitted edits in index.jsp). Long’s PR, which also changes index.jsp, was just merged. Tú wants Long’s code in his branch. What is the safest sequence?|||Tú đang làm dở thẻ NT-40 (sửa index.jsp chưa commit). PR của Long, cũng sửa index.jsp, vừa được merge. Tú muốn có code của Long trong nhánh mình. Trình tự an toàn nhất?',
            options: [
              'git pull on his branch right away; Git will figure out where the changes go|||git pull ngay trên nhánh của mình; Git sẽ tự biết thay đổi đi đâu',
              'Download the ZIP of main and copy Long’s files over his own|||Tải ZIP của main rồi chép đè file của Long lên file của mình',
              'Commit on nt-40-trang-chu, then git switch main, git pull, git switch nt-40-trang-chu, git merge main, and resolve any conflict|||Commit trên nt-40-trang-chu, rồi git switch main, git pull, git switch nt-40-trang-chu, git merge main, và giải xung đột nếu có',
              'git push --force his branch so it overwrites main|||git push --force nhánh của mình để ghi đè lên main',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Committing protects his work; pulling on main is a conflict-free fast-forward; merging main into his branch puts any conflict on his laptop where he can test it. A plain pull on a never-pushed branch prints "There is no tracking information", and with uncommitted edits Git refuses to overwrite them anyway. Copying files over his own throws away one side silently.|||VI: Commit bảo vệ việc của Tú; pull trên main là tua thẳng không xung đột; merge main vào nhánh mình đặt mọi xung đột lên laptop của Tú, nơi chạy thử được. Pull trần trên nhánh chưa từng push in "There is no tracking information", và còn sửa dở chưa commit thì Git đằng nào cũng từ chối ghi đè. Chép đè file là lặng lẽ vứt đi một phía.',
          },
          {
            question: 'Long added the CT Work webhook. Recent Deliveries on GitHub shows the ping in red with response 400 "Invalid JSON payload". What did he most likely get wrong?|||Long đã thêm webhook CT Work. Recent Deliveries trên GitHub hiện lần ping màu đỏ, phản hồi 400 "Invalid JSON payload". Long nhiều khả năng đã sai chỗ nào?',
            options: [
              'He pasted the wrong Secret|||Long dán sai Secret',
              'He is not a collaborator on his own repository|||Long không phải collaborator trên chính repo của mình',
              'No branch name contains a card key yet|||Chưa có tên nhánh nào chứa mã thẻ',
              'Content type was left as application/x-www-form-urlencoded instead of application/json|||Content type vẫn để application/x-www-form-urlencoded thay vì application/json',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: CT Work reads the body as JSON; the x-www-form-urlencoded option sends form-encoded data, hence 400. A wrong Secret gives 401 "Invalid signature" instead. Missing card keys only mean nothing is linked to cards — the ping itself would still be accepted with 200.|||VI: CT Work đọc thân yêu cầu dạng JSON; lựa chọn x-www-form-urlencoded gửi dữ liệu dạng form, nên ra 400. Sai Secret thì ra 401 "Invalid signature". Thiếu mã thẻ chỉ có nghĩa là chưa gì được nối vào thẻ — bản thân lần ping vẫn được nhận với 200.',
          },
          {
            question: 'Next term the same laptop is used for a new PRJ project with a different team. What must be done again?|||Kỳ sau, cùng chiếc laptop đó dùng cho một dự án PRJ mới với nhóm khác. Việc nào phải làm lại?',
            options: [
              'Create the repository, invite members, everyone clones it, and connect the CT Work webhook — install, identity and GitHub login stay as they are|||Tạo repo, mời thành viên, mọi người clone, và nối webhook CT Work — phần cài đặt, danh tính và đăng nhập GitHub giữ nguyên',
              'Reinstall Git and set user.name/user.email again, because they belong to the old project|||Cài lại Git và đặt lại user.name/user.email, vì chúng thuộc dự án cũ',
              'Nothing: the old webhook will send the new repository’s events to the new CT Work project|||Không gì cả: webhook cũ sẽ gửi sự kiện của repo mới sang dự án CT Work mới',
              'Only git pull in the old project folder, which switches it to the new project|||Chỉ cần git pull trong thư mục dự án cũ, nó sẽ chuyển sang dự án mới',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: KĐ.1–3 are per machine and survive every project; KĐ.4–6 and KĐ.10 are per project. A webhook lives in one repository and its Payload URL contains one CT Work project’s id, so the old one cannot serve the new project. Pulling in an old clone only updates the old project.|||VI: KĐ.1–3 thuộc về máy và sống qua mọi dự án; KĐ.4–6 và KĐ.10 thuộc về từng dự án. Webhook sống trong một repo và Payload URL của nó chứa id của một dự án CT Work, nên cái cũ không phục vụ được dự án mới. Pull trong bản clone cũ chỉ cập nhật dự án cũ.',
          },
        ],
      },
    },
  ],
};
