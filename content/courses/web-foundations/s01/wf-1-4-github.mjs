/**
 * Bài 1.4 — GitHub: mã của bạn trên đám mây (nâng cấp 01/11/2026). Output thật: git 2.51.1 — một kho TRẦN trên đĩa
 * đóng vai github.com, hai bản clone đóng vai An và Binh (_demo/_t1/github/sim.sh); ssh-keygen trong thư mục tạm
 * (_demo/_t1/github/ssh.sh, khoá xoá ngay sau đó). Deck: scripts/slides-src/wf-1-4.mjs (11 slide). Giữ video YouTube ngoài.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

// sim.out chia theo "### N." — B(n) = output của bước n (bỏ dòng tiêu đề)
const SIM = OUT['_t1/github/out/sim'].split(/^### /m);
const B = (n) => SIM[n].split('\n').slice(1).join('\n');
const S = CODE['_t1/github/sim.sh'];

const G = walkWf('wf-1-4', 'GitHub: your code in the cloud', 'GitHub: mã của bạn trên đám mây', [
  [1, 'GitHub: your code in the cloud',
    '<p>In the last lesson Git recorded snapshots on your own disk. This lesson sends them somewhere else: to GitHub, where they are backed up, where teammates can get them, and where an employer can see your work. Every command is shown with its real output.</p>',
    '<p>Bài trước, Git ghi các ảnh chụp lên đĩa của chính bạn. Bài này gửi chúng đi nơi khác: lên GitHub, nơi chúng được sao lưu, đồng đội lấy được, và nhà tuyển dụng nhìn thấy việc bạn làm. Mọi lệnh đều kèm output thật.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills: tell Git and GitHub apart, connect a project and push it the first time, clone a project and keep it in sync, fix the single most common error — a rejected push — and explain what a pull request really is underneath the website.</p>',
    '<p>Năm kỹ năng: phân biệt Git và GitHub, nối một dự án và push lần đầu, clone một dự án và giữ nó đồng bộ, sửa lỗi phổ biến nhất — push bị từ chối — và giải thích pull request thật ra là gì bên dưới giao diện web.</p>'],
  [3, 'Git is local, GitHub is a remote',
    '<p>Commit writes to the hidden <code>.git</code> folder on your disk; nothing leaves your computer. Push uploads those commits to a remote — by convention called <code>origin</code> — which, for most people, lives on GitHub. Until you push, your work exists in one place only.</p>',
    '<p>Commit ghi vào thư mục ẩn <code>.git</code> trên đĩa của bạn; không có gì rời khỏi máy. Push tải các commit đó lên một remote — theo quy ước tên là <code>origin</code> — mà với đa số người thì nằm trên GitHub. Chưa push thì công sức của bạn chỉ tồn tại ở đúng một nơi.</p>'],
  [4, 'Create, connect, first push',
    '<p>On the website you create an empty repository. On your machine, three commands connect and upload: add the remote, check it, and push with <code>-u</code> so the branch remembers where it belongs. The output confirms a new branch was created on the remote.</p>',
    '<p>Trên website bạn tạo một repository rỗng. Trên máy, ba lệnh để nối và tải lên: thêm remote, kiểm lại, và push kèm <code>-u</code> để nhánh nhớ nó thuộc về đâu. Output xác nhận một nhánh mới đã được tạo trên remote.</p>'],
  [5, 'Committed is not pushed',
    '<p>After one more commit, the status line says <code>ahead 1</code>: one commit exists only on this machine. After pushing, the bracket disappears because both sides agree. Reading this one line prevents most "but I committed it" accidents.</p>',
    '<p>Sau thêm một commit, dòng trạng thái ghi <code>ahead 1</code>: một commit chỉ tồn tại trên máy này. Sau khi push, phần trong ngoặc biến mất vì hai bên đã khớp. Đọc đúng một dòng này tránh được phần lớn tai nạn kiểu "nhưng tôi đã commit rồi mà".</p>'],
  [6, 'Clone',
    '<p>A teammate who does not have the project yet clones it — once. The clone contains the full history, as the log shows. From then on they commit and push like you do, and you use pull to receive their work.</p>',
    '<p>Một đồng đội chưa có dự án sẽ clone nó — một lần. Bản clone chứa đủ lịch sử, như log cho thấy. Từ đó họ commit và push giống bạn, còn bạn dùng pull để nhận công sức của họ.</p>'],
  [7, 'Push rejected',
    '<p>You committed without pulling first, and the remote already has your teammate’s commit. Git refuses the push rather than throw their work away. The message is long but the meaning is short: fetch what you do not have, then push again.</p>',
    '<p>Bạn commit mà chưa pull trước, trong khi remote đã có commit của đồng đội. Git từ chối push thay vì vứt bỏ công sức của họ. Thông điệp dài nhưng ý nghĩa ngắn: lấy về thứ bạn chưa có, rồi push lại.</p>'],
  [8, 'pull --rebase, then push',
    '<p><code>git pull --rebase</code> downloads the new commit and replays yours on top of it, so the history stays one straight line. Then the push succeeds. This sequence — pull, then push — is something you will do many times a day in a team.</p>',
    '<p><code>git pull --rebase</code> tải commit mới về rồi đặt lại commit của bạn lên trên nó, nên lịch sử vẫn là một đường thẳng. Rồi push thành công. Chuỗi này — pull rồi push — là thứ bạn sẽ làm nhiều lần mỗi ngày khi làm nhóm.</p>'],
  [9, 'A pull request',
    '<p>A pull request is not a Git feature. It is a branch pushed to the remote plus a web page where people discuss and review it. When someone presses the merge button, the host makes a merge commit on <code>main</code> — exactly the graph shown here.</p>',
    '<p>Pull request không phải tính năng của Git. Nó là một nhánh đã push lên remote cộng với một trang web nơi mọi người thảo luận và review. Khi ai đó bấm nút merge, máy chủ tạo một commit gộp trên <code>main</code> — đúng như đồ thị ở đây.</p>'],
  [10, 'Logging in',
    '<p>GitHub does not accept your account password for Git. Use HTTPS with a token, which a credential manager can handle for you, or an SSH key: a pair of files where only the public one, ending in <code>.pub</code>, is given to GitHub.</p>',
    '<p>GitHub không nhận mật khẩu tài khoản cho Git. Hãy dùng HTTPS kèm token — thứ mà trình quản lý thông tin đăng nhập có thể lo giúp — hoặc khoá SSH: một cặp file trong đó chỉ file công khai, đuôi <code>.pub</code>, được đưa cho GitHub.</p>'],
  [11, 'Summary & practice',
    '<p>The practice makes you meet the rejected push on purpose, with two folders and one repository. Once you have fixed it yourself, it stops being scary — and you have a public repository to show for it.</p>',
    '<p>Bài luyện bắt bạn gặp push bị từ chối một cách có chủ đích, với hai thư mục và một repository. Một khi đã tự sửa được, nó hết đáng sợ — và bạn có một repository công khai để khoe.</p>'],
]);

export default {
  title: '1.4 — GitHub: your code in the cloud|||1.4 — GitHub: mã của bạn trên đám mây',
  slug: 'wf-1-4-github',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/RGOj5yH7evk', durationSeconds: 0 },
  description: 'Git cục bộ và GitHub là remote; tạo repo, remote add + push -u lần đầu, commit ≠ push (ahead 1), clone, push bị từ chối (fetch first) và sửa bằng pull --rebase, pull request = nhánh + merge, đăng nhập bằng token hoặc khoá SSH — mọi output chạy thật với git 2.51.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Git keeps the history; GitHub shares it</h2>
<p class="lead">After this lesson you can put a project on GitHub, keep two computers (or two people) in sync, recover from the error every beginner meets in their first week — "push rejected" — and explain what a pull request is underneath the website. Why it matters: a laptop can be lost or broken, and work that exists only on it is gone with it; teams cannot work together without a shared copy; and a public GitHub profile is the portfolio recruiters actually open. To show real output without creating accounts, this lesson runs git 2.51 against a <strong>bare repository</strong> on disk that plays the role of github.com. The commands are exactly the ones you type for GitHub — only the URL differs.</p>

<h3>The picture first</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">commit — on your disk</span><span class="lz-d">Saves a snapshot into the <code>.git</code> folder of your project. Instant, offline, visible to nobody else.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">push — upload</span><span class="lz-d">Sends the commits the remote does not have yet. Only now does your work exist in two places.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">the remote — "origin"</span><span class="lz-d">A copy of the repository on a server (GitHub, GitLab, a company server). <code>origin</code> is just the usual nickname for it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">clone / pull — download</span><span class="lz-d">Clone copies the whole repository once; pull fetches and merges what changed since your last pull.</span></div>
</div>
<p>Git (the program) and GitHub (the website) are different things. Git works perfectly without any website — you used it that way in lesson 1.3. GitHub stores a copy of your repository and adds things Git does not have: a web page for every file, pull requests, issues, and automation (CI, lesson 13.4).</p>

<h3>Step 1 — "Create repository" makes an empty bare repository</h3>
${ma('bash', S, [19, 21])}
${ra(B(1))}
<p>A <strong>bare</strong> repository is a <code>.git</code> folder with no working files: just the database of commits (<code>objects</code>) and the branch pointers (<code>refs</code>). That is what GitHub keeps on its servers for each repository. On the website the steps are: <strong>+ → New repository</strong>, type a name, choose <strong>Public</strong> or <strong>Private</strong>, and — when you already have a project on your machine — do <em>not</em> tick "Add a README", so the remote starts empty and your first push goes through cleanly. GitHub then shows the URL to copy, in two forms: <code>https://github.com/you/ct-shop.git</code> or <code>git@github.com:you/ct-shop.git</code> (SSH, see Step 6).</p>

<h3>Step 2 — connect a project and push it for the first time</h3>
${ma('bash', S, [23, 36])}
${ra(B(2))}
<p>Read it from the top. The project has a <code>.gitignore</code> that lists <code>.env</code>, so the file holding a database password shows up as <code>!!</code> (ignored) and <code>git check-ignore -v</code> names the exact line responsible. Ignored files are never committed, so they can never be pushed — that is how passwords stay off GitHub (lesson 14.2 shows what happens when they do not).</p>
<ul>
  <li><code>git remote add origin URL</code> saves the address under the nickname <code>origin</code>. Nothing is sent yet.</li>
  <li><code>git remote -v</code> shows the saved addresses — check this first whenever a push goes "somewhere strange".</li>
  <li><code>git push -u origin main</code> uploads the branch <code>main</code>. <code>* [new branch]</code> means it did not exist on the remote before. The <code>-u</code> links your <code>main</code> to <code>origin/main</code> once, so from now on plain <code>git push</code> and <code>git pull</code> know where to go.</li>
  <li><code>git status -sb</code> prints one short line: <code>## main...origin/main</code> — your branch and the remote branch it tracks, and nothing in brackets, so they are equal.</li>
</ul>

<h3>Step 3 — committed is not pushed</h3>
${ma('bash', S, [38, 43])}
${ra(B(3))}
<p>After a new commit the status says <code>[ahead 1]</code>: one commit exists only on this laptop. The push output <code>8161c6f..6ea36d0 main -&gt; main</code> means "the remote’s main moved from the old commit to the new one". Then the bracket disappears. The habit to build: <strong>look at <code>git status -sb</code> before you close the laptop.</strong> <code>ahead</code> means unpushed work; <code>behind</code> (you will see it soon) means the remote has commits you have not pulled.</p>

<h3>Step 4 — a teammate clones the project</h3>
${ma('bash', S, [46, 54])}
${ra(B(4))}
<p>Binh did not have the project, so he <strong>clones</strong> it: one command downloads every commit and sets up <code>origin</code> automatically. His log shows the full history — both of An’s commits, with the same identifiers, because a commit’s identifier is computed from its content. He adds a line and pushes; the remote’s <code>main</code> moves again.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">git clone URL</span><span class="v">Once, to get a repository you do not have. Creates the folder, the history and the <code>origin</code> remote.</span></div>
  <div class="kv"><span class="k">git pull</span><span class="v">Every time you start work: fetch what is new on the remote and combine it with your branch.</span></div>
  <div class="kv"><span class="k">git push</span><span class="v">When your commits are ready to be shared. Rejected if the remote has commits you do not have.</span></div>
  <div class="kv"><span class="k">git fetch</span><span class="v">Download only, without changing your files — useful to look before you merge (Git course, chapter 5).</span></div>
</div>

<h3>Step 5 — push rejected, and how to fix it</h3>
<p>Meanwhile An, who has not pulled, edits the README, commits, and pushes:</p>
${ma('bash', S, [56, 64])}
${ra(B(5))}
<p>The first push is <strong>rejected (fetch first)</strong>. This is not a bug in your code and nothing is broken: the remote has a commit (Binh’s) that your branch does not contain. If Git accepted your push, Binh’s commit would vanish from <code>main</code>, so it refuses and the hints tell you what to do.</p>
<p><code>git pull --rebase</code> fetches Binh’s commit and then <strong>replays</strong> your commit on top of it ("Rebasing (1/1)"). The graph shows one straight line: Binh’s commit, then yours. Now your branch contains everything the remote has, and the push succeeds. Plain <code>git pull</code> also works — it creates a small "merge" commit instead of replaying — and many teams set <code>git config --global pull.rebase true</code> to make the straight-line version the default. If both of you edited the <em>same lines</em>, Git stops and asks you to resolve a conflict; lesson 10.3 walks through that.</p>

<h3>Step 6 — a pull request is a branch plus a conversation</h3>
${ma('bash', S, [66, 78])}
${ra(B(6))}
${ra(B(7))}
<p>On a team you rarely push straight to <code>main</code>. You create a <strong>branch</strong>, push it (<code>* [new branch] feature/cart</code>), and on GitHub press <strong>Compare &amp; pull request</strong>. The pull request (PR) is a page that shows the branch’s changes, lets teammates comment line by line, and runs automatic checks. <code>git branch -a</code> and <code>git ls-remote</code> prove that, underneath, it is simply a second branch on the remote. When a reviewer presses <strong>Merge pull request</strong>, GitHub creates a merge commit on <code>main</code> — the <code>--no-ff</code> merge above produces the same shape you see in the graph, with the feature branch joining the main line.</p>

<h3>Step 7 — logging in: tokens and SSH keys</h3>
<p>Pushing to a real GitHub repository needs proof that you are allowed. GitHub <strong>does not accept your account password</strong> for Git. There are two good ways:</p>
<ul>
  <li><strong>HTTPS + credential manager</strong> — the simplest. Git for Windows ships Git Credential Manager; on the first push a browser window asks you to sign in to GitHub, and the credential is stored for you. With the GitHub CLI, <code>gh auth login</code> does the same. Without either, you create a <em>personal access token</em> in GitHub settings and paste it where Git asks for a password.</li>
  <li><strong>SSH key</strong> — a pair of files. You keep the private one; you give GitHub the public one.</li>
</ul>
${ma('bash', CODE['_t1/github/ssh.sh'], [6, 15])}
${ra(OUT['_t1/github/out/ssh'])}
<p>The key above was generated in a throw-away folder and deleted right after — never reuse a key from a web page. Notice the permissions: the private key <code>id_ed25519</code> is <code>-rw-------</code> (only you can read it), the public key is readable by anyone, and that is fine: the single line in <code>id_ed25519.pub</code> is what you paste into <strong>GitHub → Settings → SSH and GPG keys</strong>. With your real key in <code>~/.ssh</code>, <code>ssh -T git@github.com</code> checks the connection; GitHub answers with a greeting that contains your username and says it does not provide shell access, which means it worked. Then use the <code>git@github.com:…</code> form of the URL.</p>

<h3>A README worth opening</h3>
<p>The first thing anyone sees on a repository page is <code>README.md</code>, rendered from Markdown. For a practice project, five short parts are enough:</p>
${ma('markdown', `# CT Shop

A one-page shop built while learning HTML, CSS and JavaScript.

![Screenshot](docs/screenshot.png)

## Run it
Open index.html in a browser — or: npm install && npm run dev

## What I practised
- Semantic HTML and a responsive CSS grid
- fetch() to load products from a JSON file

## Next
Add a cart that survives a page reload (localStorage).`)}
<p>A title, one sentence about what it is, a screenshot, how to run it, and what you learned. Six months of small repositories like this are a stronger portfolio than any line on a CV — the Git course, chapter 15, turns them into a full GitHub profile.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — public when you thought it was private.</strong> The choice is one radio button when you create the repository. A public repository is indexed within hours and scanned continuously by bots looking for one thing: keys and passwords committed by accident. Check the <em>Public / Private</em> label next to the repository name before the first push. If a secret is ever pushed, <strong>rotate it first</strong> (create a new key, revoke the old one) — deleting the commit does not help, because copies were taken within minutes (lesson 14.2).</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "fixing" a rejected push with <code>--force</code>.</strong> <code>git push --force</code> makes the push succeed by overwriting the remote branch with yours, which deletes your teammate’s commits from it. Search engines are full of answers suggesting it. The right fix is always <code>git pull --rebase</code> (or <code>git pull</code>), then push. Force-pushing belongs only to your own branch that nobody else uses — and even there <code>--force-with-lease</code> is safer.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — pushing <code>node_modules/</code> or build output.</strong> Without a <code>.gitignore</code>, the first <code>git add .</code> picks up tens of thousands of dependency files; the push is slow, the repository huge, and every teammate’s install creates conflicts. Create <code>.gitignore</code> <em>before</em> the first commit (Step 2 shows a minimal one: <code>node_modules/</code>, <code>dist/</code>, <code>.env</code>).</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (30 min)</strong></p>
<p>Create a <strong>public</strong> repository on GitHub without a README. On your machine make a folder with a <code>README.md</code> and a <code>.gitignore</code>, commit, connect it with <code>git remote add origin …</code> and <code>git push -u origin main</code>. Then clone the same repository into a second folder (pretend it is a teammate’s laptop). Commit and push a change from the second folder; then, <em>without pulling</em>, commit a change in the first folder and push.</p>
<p><strong>Done when:</strong> you have seen <code>! [rejected] main -&gt; main (fetch first)</code> with your own eyes, fixed it with <code>git pull --rebase</code> and a push, <code>git status -sb</code> shows no <code>[ahead]</code> or <code>[behind]</code> in either folder, and the repository page on GitHub shows all three commits and a rendered README. Code Lab module 1.4 practises reading remote URLs, ahead/behind counts and <code>.gitignore</code> patterns.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">remote / origin</span><span class="v">kho ở xa / tên quen gọi của remote chính.</span></div>
  <div class="kv"><span class="k">push / pull / fetch</span><span class="v">đẩy lên / kéo về và gộp / chỉ tải về.</span></div>
  <div class="kv"><span class="k">clone</span><span class="v">sao chép nguyên kho (kèm lịch sử) về máy.</span></div>
  <div class="kv"><span class="k">bare repository</span><span class="v">kho trần — chỉ có lịch sử, không có file làm việc.</span></div>
  <div class="kv"><span class="k">upstream / tracking branch</span><span class="v">nhánh theo dõi — <code>origin/main</code> mà <code>main</code> gắn với.</span></div>
  <div class="kv"><span class="k">ahead / behind</span><span class="v">đi trước (chưa push) / đi sau (chưa pull).</span></div>
  <div class="kv"><span class="k">rebase</span><span class="v">đặt lại commit của mình lên trên commit mới.</span></div>
  <div class="kv"><span class="k">pull request (PR)</span><span class="v">yêu cầu gộp — nhánh + trang review trên GitHub.</span></div>
  <div class="kv"><span class="k">personal access token / SSH key</span><span class="v">mã truy cập cá nhân / khoá SSH để đăng nhập cho Git.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Commit is local; push makes a second copy on the remote. <code>[ahead N]</code> means N commits exist only on your machine.</li>
  <li>First time: <code>git remote add origin URL</code>, then <code>git push -u origin main</code>; afterwards just <code>git push</code>.</li>
  <li>Clone once; pull every time you start work.</li>
  <li><code>rejected (fetch first)</code> ⇒ <code>git pull --rebase</code> ⇒ <code>git push</code>. Never <code>--force</code> a shared branch.</li>
  <li>A pull request is a branch on the remote plus review; merging creates a merge commit on <code>main</code>.</li>
  <li>Log in with a token/credential manager or an SSH key — never your password; only the <code>.pub</code> file goes to GitHub.</li>
</ul>
${nguon('📗', 'GitHub Docs — Hello World', 'The official ten-minute first repository, branch and pull request', 'https://docs.github.com/en/get-started/start-your-journey/hello-world')}
${nguon('📘', 'GitHub Docs — About remote repositories', 'HTTPS vs SSH URLs, and how Git talks to GitHub', 'https://docs.github.com/en/get-started/git-basics/about-remote-repositories')}
${nguon('📙', 'GitHub Docs — Connecting to GitHub with SSH', 'Generate a key, add it to your account, test the connection', 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh')}
${lienKet({ khoa: 'git', bai: 'git-5-1-remote-fetch-pull', title: 'Git 5.1 — what a remote is, and why fetch ≠ pull', sub: 'The same ideas one level deeper: remote-tracking branches', cta: 'Open lesson' })}
${lienKet({ khoa: 'git', bai: 'git-5-2-xac-thuc', title: 'Git 5.2 — authenticating with GitHub: SSH, tokens, credentials', sub: 'Every login method step by step, on each operating system', cta: 'Open lesson' })}
${lienKet({ khoa: 'git', bai: 'git-6-1-giai-phau-pr', title: 'Git 6.1 — anatomy of a pull request that gets reviewed', sub: 'Title, description, size — and what reviewers look for', cta: 'Open lesson' })}
${lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', title: 'Git 15.1 — your GitHub profile as a CV', sub: 'Profile README, pinned repositories and project READMEs', cta: 'Open lesson' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Git giữ lịch sử; GitHub chia sẻ nó</h2>
<p class="lead">Sau bài này bạn đưa được dự án lên GitHub, giữ hai máy (hoặc hai người) đồng bộ, thoát khỏi lỗi mà người mới nào cũng gặp ngay tuần đầu — "push bị từ chối" — và giải thích được pull request là gì bên dưới giao diện web. Vì sao cần: laptop có thể mất hoặc hỏng, và công sức chỉ nằm trên nó sẽ mất theo; cả nhóm không thể làm cùng nhau nếu không có một bản dùng chung; và một hồ sơ GitHub công khai là danh mục dự án mà nhà tuyển dụng thật sự mở ra xem. Để có output thật mà không phải tạo tài khoản, bài này chạy git 2.51 với một <strong>kho trần (bare repository)</strong> trên đĩa đóng vai github.com. Các lệnh y hệt lệnh bạn gõ với GitHub — chỉ khác địa chỉ URL.</p>

<h3>Bức tranh trước đã</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">commit — trên đĩa của bạn</span><span class="lz-d">Lưu một ảnh chụp vào thư mục <code>.git</code> của dự án. Tức thì, không cần mạng, không ai khác thấy.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">push — tải lên</span><span class="lz-d">Gửi những commit mà remote chưa có. Chỉ tới lúc này công sức của bạn mới tồn tại ở hai nơi.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">remote — "origin"</span><span class="lz-d">Một bản sao của repository trên máy chủ (GitHub, GitLab, máy chủ công ty). <code>origin</code> chỉ là biệt danh quen dùng cho nó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">clone / pull — tải về</span><span class="lz-d">Clone chép nguyên repository một lần; pull lấy về và gộp những gì đã đổi kể từ lần pull trước.</span></div>
</div>
<p>Git (chương trình) và GitHub (website) là hai thứ khác nhau. Git chạy hoàn hảo không cần website nào — bạn đã dùng nó như vậy ở bài 1.3. GitHub lưu một bản sao repository của bạn và thêm những thứ Git không có: một trang web cho từng file, pull request, issue, và tự động hoá (CI, bài 13.4).</p>

<h3>Bước 1 — "Create repository" tạo một kho trần rỗng</h3>
${ma('bash', S, [19, 21])}
${ra(B(1))}
<p>Một kho <strong>trần</strong> là một thư mục <code>.git</code> không có file làm việc: chỉ có cơ sở dữ liệu commit (<code>objects</code>) và các con trỏ nhánh (<code>refs</code>). Đó là thứ GitHub giữ trên máy chủ cho mỗi repository. Trên website các bước là: <strong>+ → New repository</strong>, gõ tên, chọn <strong>Public</strong> hoặc <strong>Private</strong>, và — khi bạn đã có dự án trên máy — <em>đừng</em> tick "Add a README", để remote bắt đầu rỗng và lần push đầu đi trót lọt. GitHub sau đó hiện URL để chép, ở hai dạng: <code>https://github.com/ban/ct-shop.git</code> hoặc <code>git@github.com:ban/ct-shop.git</code> (SSH, xem Bước 7).</p>

<h3>Bước 2 — nối dự án và push lần đầu</h3>
${ma('bash', S, [23, 36])}
${ra(B(2))}
<p>Đọc từ trên xuống. Dự án có một <code>.gitignore</code> liệt kê <code>.env</code>, nên file chứa mật khẩu cơ sở dữ liệu hiện ra là <code>!!</code> (bị bỏ qua) và <code>git check-ignore -v</code> chỉ ra đúng dòng chịu trách nhiệm. File bị bỏ qua không bao giờ được commit, nên không bao giờ bị push — đó là cách mật khẩu tránh xa GitHub (bài 14.2 cho thấy chuyện gì xảy ra khi không làm vậy).</p>
<ul>
  <li><code>git remote add origin URL</code> lưu địa chỉ dưới biệt danh <code>origin</code>. Chưa gửi gì cả.</li>
  <li><code>git remote -v</code> hiện các địa chỉ đã lưu — kiểm cái này đầu tiên mỗi khi push đi "đâu đó lạ lạ".</li>
  <li><code>git push -u origin main</code> tải nhánh <code>main</code> lên. <code>* [new branch]</code> nghĩa là trước đó nhánh chưa có trên remote. <code>-u</code> gắn <code>main</code> của bạn với <code>origin/main</code> một lần, nên từ giờ <code>git push</code> và <code>git pull</code> trơn tự biết đi đâu.</li>
  <li><code>git status -sb</code> in một dòng ngắn: <code>## main...origin/main</code> — nhánh của bạn và nhánh trên remote mà nó theo dõi, không có gì trong ngoặc, tức là hai bên bằng nhau.</li>
</ul>

<h3>Bước 3 — đã commit không có nghĩa là đã push</h3>
${ma('bash', S, [38, 43])}
${ra(B(3))}
<p>Sau một commit mới, trạng thái ghi <code>[ahead 1]</code>: một commit chỉ tồn tại trên laptop này. Output của push <code>8161c6f..6ea36d0 main -&gt; main</code> nghĩa là "main trên remote đã dời từ commit cũ sang commit mới". Rồi phần trong ngoặc biến mất. Thói quen cần tập: <strong>nhìn <code>git status -sb</code> trước khi gập laptop.</strong> <code>ahead</code> nghĩa là có việc chưa push; <code>behind</code> (bạn sẽ sớm gặp) nghĩa là remote có commit bạn chưa pull.</p>

<h3>Bước 4 — đồng đội clone dự án</h3>
${ma('bash', S, [46, 54])}
${ra(B(4))}
<p>Binh chưa có dự án, nên anh ấy <strong>clone</strong>: một lệnh tải về mọi commit và tự thiết lập <code>origin</code>. Log của anh ấy cho thấy đủ lịch sử — cả hai commit của An, cùng mã định danh, vì mã định danh của commit được tính từ nội dung của nó. Anh ấy thêm một dòng rồi push; <code>main</code> trên remote lại dời đi.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">git clone URL</span><span class="v">Một lần, để lấy repository bạn chưa có. Tạo thư mục, lịch sử và remote <code>origin</code>.</span></div>
  <div class="kv"><span class="k">git pull</span><span class="v">Mỗi lần bắt đầu làm việc: lấy về cái mới trên remote và gộp vào nhánh của bạn.</span></div>
  <div class="kv"><span class="k">git push</span><span class="v">Khi commit của bạn đã sẵn sàng chia sẻ. Bị từ chối nếu remote có commit bạn chưa có.</span></div>
  <div class="kv"><span class="k">git fetch</span><span class="v">Chỉ tải về, không đổi file của bạn — hữu ích để xem trước khi gộp (khoá Git, chương 5).</span></div>
</div>

<h3>Bước 5 — push bị từ chối, và cách sửa</h3>
<p>Trong lúc đó An, chưa pull, sửa README, commit rồi push:</p>
${ma('bash', S, [56, 64])}
${ra(B(5))}
<p>Lần push đầu bị <strong>rejected (fetch first)</strong>. Đây không phải lỗi trong mã của bạn và chẳng có gì hỏng: remote có một commit (của Binh) mà nhánh của bạn không chứa. Nếu Git nhận push của bạn, commit của Binh sẽ biến khỏi <code>main</code>, nên nó từ chối và các dòng hint bảo bạn phải làm gì.</p>
<p><code>git pull --rebase</code> lấy commit của Binh về rồi <strong>đặt lại (replay)</strong> commit của bạn lên trên nó ("Rebasing (1/1)"). Đồ thị cho thấy một đường thẳng: commit của Binh, rồi của bạn. Giờ nhánh của bạn chứa mọi thứ remote có, và push thành công. <code>git pull</code> trơn cũng được — nó tạo một commit "merge" nhỏ thay vì đặt lại — và nhiều nhóm đặt <code>git config --global pull.rebase true</code> để kiểu đường thẳng thành mặc định. Nếu hai người cùng sửa <em>đúng những dòng giống nhau</em>, Git dừng lại và nhờ bạn giải quyết xung đột; bài 10.3 đi qua chuyện đó.</p>

<h3>Bước 6 — pull request là một nhánh cộng một cuộc trao đổi</h3>
${ma('bash', S, [66, 78])}
${ra(B(6))}
${ra(B(7))}
<p>Khi làm nhóm, bạn hiếm khi push thẳng lên <code>main</code>. Bạn tạo một <strong>nhánh</strong>, push nó (<code>* [new branch] feature/cart</code>), rồi trên GitHub bấm <strong>Compare &amp; pull request</strong>. Pull request (PR) là một trang hiện các thay đổi của nhánh, cho đồng đội bình luận từng dòng, và chạy các phép kiểm tự động. <code>git branch -a</code> và <code>git ls-remote</code> chứng minh rằng bên dưới, nó đơn giản là nhánh thứ hai trên remote. Khi người review bấm <strong>Merge pull request</strong>, GitHub tạo một commit gộp trên <code>main</code> — phép merge <code>--no-ff</code> ở trên tạo đúng hình dạng bạn thấy trong đồ thị, với nhánh tính năng nhập lại vào đường chính.</p>

<h3>Bước 7 — đăng nhập: token và khoá SSH</h3>
<p>Push lên một repository GitHub thật cần bằng chứng là bạn được phép. GitHub <strong>không nhận mật khẩu tài khoản</strong> cho Git. Có hai cách tốt:</p>
<ul>
  <li><strong>HTTPS + trình quản lý thông tin đăng nhập</strong> — đơn giản nhất. Git cho Windows kèm sẵn Git Credential Manager; ở lần push đầu, một cửa sổ trình duyệt mời bạn đăng nhập GitHub, và thông tin được lưu giúp bạn. Với GitHub CLI, <code>gh auth login</code> làm điều tương tự. Không có cả hai thì bạn tạo một <em>personal access token</em> trong cài đặt GitHub và dán nó vào chỗ Git hỏi mật khẩu.</li>
  <li><strong>Khoá SSH</strong> — một cặp file. Bạn giữ file bí mật; bạn đưa GitHub file công khai.</li>
</ul>
${ma('bash', CODE['_t1/github/ssh.sh'], [6, 15])}
${ra(OUT['_t1/github/out/ssh'])}
<p>Khoá ở trên được tạo trong một thư mục dùng một lần và xoá ngay sau đó — đừng bao giờ dùng lại một khoá chép từ trang web. Để ý quyền truy cập: khoá bí mật <code>id_ed25519</code> là <code>-rw-------</code> (chỉ mình bạn đọc được), khoá công khai thì ai đọc cũng được, và điều đó ổn: đúng một dòng trong <code>id_ed25519.pub</code> là thứ bạn dán vào <strong>GitHub → Settings → SSH and GPG keys</strong>. Khi khoá thật của bạn nằm trong <code>~/.ssh</code>, lệnh <code>ssh -T git@github.com</code> kiểm kết nối; GitHub trả lời bằng một lời chào có tên tài khoản của bạn và nói rằng nó không cung cấp quyền vào shell, nghĩa là đã thành công. Sau đó dùng dạng URL <code>git@github.com:…</code>.</p>

<h3>Một README đáng mở ra xem</h3>
<p>Thứ đầu tiên ai cũng thấy trên trang repository là <code>README.md</code>, được hiển thị từ Markdown. Với một dự án luyện tập, năm phần ngắn là đủ:</p>
${ma('markdown', `# CT Shop

A one-page shop built while learning HTML, CSS and JavaScript.

![Screenshot](docs/screenshot.png)

## Run it
Open index.html in a browser — or: npm install && npm run dev

## What I practised
- Semantic HTML and a responsive CSS grid
- fetch() to load products from a JSON file

## Next
Add a cart that survives a page reload (localStorage).`)}
<p>Một tiêu đề, một câu nói nó là gì, một ảnh chụp màn hình, cách chạy, và bạn đã học được gì. Sáu tháng với những repository nhỏ như thế là một danh mục mạnh hơn mọi dòng trong CV — khoá Git, chương 15, biến chúng thành một hồ sơ GitHub đầy đủ.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — công khai trong khi bạn tưởng là riêng tư.</strong> Lựa chọn chỉ là một nút radio lúc tạo repository. Một repository công khai bị lập chỉ mục trong vài giờ và bị bot quét liên tục để tìm đúng một thứ: khoá và mật khẩu lỡ tay commit. Kiểm nhãn <em>Public / Private</em> cạnh tên repository trước lần push đầu. Nếu lỡ push một bí mật, <strong>đổi nó trước tiên</strong> (tạo khoá mới, thu hồi khoá cũ) — xoá commit không giúp gì, vì các bản sao đã bị lấy trong vài phút (bài 14.2).</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "sửa" push bị từ chối bằng <code>--force</code>.</strong> <code>git push --force</code> làm push thành công bằng cách ghi đè nhánh trên remote bằng nhánh của bạn, tức là xoá commit của đồng đội khỏi đó. Trên mạng đầy câu trả lời gợi ý cách này. Cách sửa đúng luôn là <code>git pull --rebase</code> (hoặc <code>git pull</code>), rồi push. Force-push chỉ dành cho nhánh của riêng bạn mà không ai khác dùng — và ngay cả khi đó <code>--force-with-lease</code> vẫn an toàn hơn.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — push cả <code>node_modules/</code> hay đầu ra build.</strong> Không có <code>.gitignore</code>, lần <code>git add .</code> đầu tiên nhặt cả chục nghìn file thư viện; push chậm, repository phình to, và mỗi lần đồng đội cài lại là sinh xung đột. Tạo <code>.gitignore</code> <em>trước</em> commit đầu tiên (Bước 2 có một bản tối thiểu: <code>node_modules/</code>, <code>dist/</code>, <code>.env</code>).</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút)</strong></p>
<p>Tạo một repository <strong>công khai</strong> trên GitHub, không kèm README. Trên máy, tạo một thư mục có <code>README.md</code> và <code>.gitignore</code>, commit, nối bằng <code>git remote add origin …</code> và <code>git push -u origin main</code>. Rồi clone chính repository đó vào thư mục thứ hai (giả như laptop của đồng đội). Commit và push một thay đổi từ thư mục thứ hai; rồi, <em>không pull</em>, commit một thay đổi ở thư mục thứ nhất và push.</p>
<p><strong>Xong khi:</strong> bạn đã tận mắt thấy <code>! [rejected] main -&gt; main (fetch first)</code>, sửa được bằng <code>git pull --rebase</code> rồi push, <code>git status -sb</code> không còn <code>[ahead]</code> hay <code>[behind]</code> ở cả hai thư mục, và trang repository trên GitHub hiện đủ ba commit cùng README đã hiển thị. Code Lab module 1.4 luyện đọc URL remote, đếm ahead/behind và mẫu <code>.gitignore</code>.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">remote / origin</span><span class="v">kho ở xa / tên quen gọi của remote chính.</span></div>
  <div class="kv"><span class="k">push / pull / fetch</span><span class="v">đẩy lên / kéo về và gộp / chỉ tải về.</span></div>
  <div class="kv"><span class="k">clone</span><span class="v">sao chép nguyên kho (kèm lịch sử) về máy.</span></div>
  <div class="kv"><span class="k">bare repository</span><span class="v">kho trần — chỉ có lịch sử, không có file làm việc.</span></div>
  <div class="kv"><span class="k">upstream / tracking branch</span><span class="v">nhánh theo dõi — <code>origin/main</code> mà <code>main</code> gắn với.</span></div>
  <div class="kv"><span class="k">ahead / behind</span><span class="v">đi trước (chưa push) / đi sau (chưa pull).</span></div>
  <div class="kv"><span class="k">rebase</span><span class="v">đặt lại commit của mình lên trên commit mới.</span></div>
  <div class="kv"><span class="k">pull request (PR)</span><span class="v">yêu cầu gộp — nhánh + trang review trên GitHub.</span></div>
  <div class="kv"><span class="k">personal access token / SSH key</span><span class="v">mã truy cập cá nhân / khoá SSH để đăng nhập cho Git.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Commit là cục bộ; push tạo bản thứ hai trên remote. <code>[ahead N]</code> nghĩa là N commit chỉ có trên máy bạn.</li>
  <li>Lần đầu: <code>git remote add origin URL</code>, rồi <code>git push -u origin main</code>; về sau chỉ cần <code>git push</code>.</li>
  <li>Clone một lần; pull mỗi lần bắt đầu làm việc.</li>
  <li><code>rejected (fetch first)</code> ⇒ <code>git pull --rebase</code> ⇒ <code>git push</code>. Không bao giờ <code>--force</code> một nhánh dùng chung.</li>
  <li>Pull request là một nhánh trên remote cộng phần review; merge tạo một commit gộp trên <code>main</code>.</li>
  <li>Đăng nhập bằng token/trình quản lý thông tin đăng nhập hoặc khoá SSH — không bao giờ bằng mật khẩu; chỉ file <code>.pub</code> được đưa lên GitHub.</li>
</ul>
${nguon('📗', 'GitHub Docs — Hello World', 'Repository, nhánh và pull request đầu tiên trong mười phút, bản chính thức', 'https://docs.github.com/en/get-started/start-your-journey/hello-world')}
${nguon('📘', 'GitHub Docs — About remote repositories', 'URL HTTPS và SSH khác nhau ra sao, và Git nói chuyện với GitHub thế nào', 'https://docs.github.com/en/get-started/git-basics/about-remote-repositories')}
${nguon('📙', 'GitHub Docs — Connecting to GitHub with SSH', 'Tạo khoá, thêm vào tài khoản, kiểm kết nối', 'https://docs.github.com/en/authentication/connecting-to-github-with-ssh')}
${lienKet({ khoa: 'git', bai: 'git-5-1-remote-fetch-pull', title: 'Git 5.1 — remote là gì, và vì sao fetch ≠ pull', sub: 'Cùng những ý này, sâu thêm một tầng: nhánh theo dõi remote', cta: 'Mở bài' })}
${lienKet({ khoa: 'git', bai: 'git-5-2-xac-thuc', title: 'Git 5.2 — xác thực với GitHub: SSH, token, thông tin đăng nhập', sub: 'Từng cách đăng nhập, từng bước, trên từng hệ điều hành', cta: 'Mở bài' })}
${lienKet({ khoa: 'git', bai: 'git-6-1-giai-phau-pr', title: 'Git 6.1 — giải phẫu một pull request được review', sub: 'Tiêu đề, mô tả, kích thước — và người review nhìn vào đâu', cta: 'Mở bài' })}
${lienKet({ khoa: 'git', bai: 'git-15-1-ho-so-github', title: 'Git 15.1 — hồ sơ GitHub như một CV', sub: 'README hồ sơ, repository ghim và README dự án', cta: 'Mở bài' })}
</div>
`,
};
