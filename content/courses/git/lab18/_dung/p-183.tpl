    /* ─────────────────────────── 18.3 ─────────────────────────── */
    {
      title: '18.3 — Accident: pulling main into the wrong place, and "push rejected"|||18.3 — Tai nạn: kéo main nhầm chỗ và push bị từ chối',
      slug: 'git-18-3-keo-main-va-push-tu-choi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba thông báo làm sinh viên hoảng nhất khi đồng bộ: "local changes would be overwritten", "no tracking information", "rejected (fetch first)" rồi "divergent branches". Tái hiện từng cái, đọc đúng, sửa an toàn, và vì sao KHÔNG bao giờ dùng --force để cho qua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3</span>
<h2>Four messages that scare every student team, and what each one really says</h2>
<p class="lead">Syncing with teammates produces the loudest-looking errors in Git: "would be overwritten", "no tracking information", "rejected", "divergent branches". None of them means something is broken. Each one is Git refusing to guess. This lesson reproduces all four in the lab, tells you in one sentence what each one means, and gives the safe move. It also shows, with real output, what happens to a teammate's work when somebody "fixes" the rejection with <code>--force</code>.</p>
<p>Outputs: this chapter's lab, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. How <code>fetch</code>, <code>pull</code> and tracking work in general is Chapter 5; merge versus rebase is Chapter 3. Here: the four accidents.</p>

<h3>The mental model: a pull is a fetch plus a merge</h3>
${slide('git-18', 9, 'git pull = fetch + merge, và ba chỗ nó vấp')}
<p><code>git pull</code> does two things: <code>git fetch</code> (download the remote's new commits into <code>origin/…</code>, touching nothing of yours) and then a merge (or rebase) of that into the branch you are on. Every error below comes from the second half. The first half is always safe, which is why the habit that prevents most accidents is: <strong>fetch first, look, then merge</strong>.</p>

<h3>Accident A — you have unsaved work and pull main</h3>
<p>An pushes a change to <code>HomeServlet.java</code> on <code>main</code>. Meanwhile Chi opened a branch, edited <em>the same file</em> and did not commit. Thinking "I need the latest main", she types <code>git pull origin main</code>:</p>
@@T('keo-main-nham','git commit','git switch -c')@@
@@T('keo-main-nham','git switch -c','git commit')@@
<p>Two different messages appeared, for two different reasons:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">"Your local changes … would be overwritten by merge"</span><span class="v">The incoming commit changes a file that you have modified and not committed. Git will not blend them silently. Nothing was lost; the pull simply did not happen (<code>Aborting</code>).</span></div>
  <div class="kv"><span class="k">"There is no tracking information for the current branch"</span><span class="v">A plain <code>git pull</code> asks "pull from where?" — and a branch never pushed has no upstream (the remote branch it follows). Say where (<code>git pull origin main</code>) or set it once (<code>git push -u origin &lt;branch&gt;</code>).</span></div>
</div>
<p><strong>The safe move is always the same order:</strong> commit your work (a commit on your own branch is safe and reversible), <code>git fetch</code>, look at what is coming, merge it into your branch:</p>
@@T('keo-main-nham','git commit','git merge origin/main',nth=1)@@
<p><code>git log main..origin/main</code> reads "commits on origin/main that my main does not have": one line, An's commit. Now the merge into the branch:</p>
@@T('keo-main-nham','git merge origin/main')@@
<p>The merge conflicted because both people appended to the end of the same file. Here the two added lines are independent comments, so the resolution is to keep both (after reading them, not by deleting markers blindly — see 18.2), then commit. The graph shows the merge commit with two parents. Work on a feature branch, bring <code>main</code> in with a merge, and <code>main</code> itself is never touched.</p>
<div class="callout warn"><code>git stash</code> is the other safe option when you are not ready to commit: <code>git stash</code>, then pull, then <code>git stash pop</code>. It can conflict at the <code>pop</code> step too — the cure is the same, and your stashed work stays in the stash until the pop succeeds (Chapter 4).</div>

<h3>Accident B — "rejected", then "divergent branches"</h3>
${slide('git-18', 10, 'Hai người cùng đẩy lên main: lịch sử rẽ đôi')}
<p>An and Bình both commit on <code>main</code> (a bad habit — see 18.4 — but it is what happens before a team has a rule). An pushes first. Bình pushes second and is refused; he types the <code>git pull</code> the message suggested and gets a second error:</p>
@@T('push-tu-choi','git commit','git pull',nth=0)@@
@@T('push-tu-choi','git pull','git pull --no-rebase')@@
<div class="kv-grid">
  <div class="kv"><span class="k">"! [rejected] main -> main (fetch first)"</span><span class="v">The remote's <code>main</code> has a commit that yours does not. Git refuses a push that would make the remote forget it. Remedy: bring that commit in, then push again.</span></div>
  <div class="kv"><span class="k">"Need to specify how to reconcile divergent branches"</span><span class="v">Your <code>main</code> and <code>origin/main</code> each have a commit the other lacks, so Git needs you to choose <em>how</em> to join them — merge, rebase, or fast-forward only. Recent Git versions (2.33 and later) refuse to guess. It is a question, not a failure.</span></div>
</div>
<p>Pick one and say it on the command line. <strong>Merge</strong> keeps both commits and adds a merge commit:</p>
@@T('push-tu-choi','git pull --no-rebase')@@
<p><strong>Rebase</strong> replays your commit on top of the new <code>main</code> and leaves a straight line (a new commit hash for yours, which is fine because you have not shared it yet — Chapter 3):</p>
@@T('push-tu-choi-rebase','git pull --rebase')@@
<p>For a beginner team, merge is the safer default: it never rewrites anything and its conflicts look the same as every other conflict. Choose once and stop being asked: <code>git config --global pull.rebase false</code> (merge) or <code>true</code> (rebase). If you already set one, you will not see the "divergent" message at all — check with <code>git config --global --get pull.rebase</code>.</p>

<h3>Accident C — the shortcut that destroys work: --force</h3>
<p>The rejection is annoying, and the internet suggests <code>git push --force</code>. Here is what that does to the same situation:</p>
@@T('push-force','git push --force')@@
<p>The remote's <code>main</code> was moved <em>backwards and sideways</em> to Bình's commit (<code>+ … (forced update)</code>). An's commit is gone from the shared branch. An's own clone still has it (<code>ahead 1, behind 1</code>), and that copy is the only reason it is recoverable: the remote no longer holds it, so the commit survives only where somebody still has it. The rejection was Git protecting An's work. Rule for the team: <strong><code>--force</code> is never the answer to "rejected"</strong>; fetch, integrate, push. If you truly rewrote your own branch (an amended or rebased commit that you already pushed), use <code>git push --force-with-lease</code>, which refuses if somebody else pushed in the meantime — and only on a branch nobody else is using. On GitHub you can switch force pushes off for <code>main</code> (18.5).</p>

<h3>Prevent it</h3>
<ul>
<li><strong>Fetch first.</strong> Start a work session with <code>git fetch</code> and <code>git status -sb</code>; the <code>[behind 2]</code> in the status line is the whole story.</li>
<li><strong>Never work on <code>main</code></strong> (18.4) and nothing can diverge there.</li>
<li><strong>Commit before you integrate</strong>, so there is no "unsaved work" to protect.</li>
<li><strong>Push with <code>-u</code> the first time</strong>: <code>git push -u origin feature/x</code> sets the upstream and cures "no tracking information" for good.</li>
<li><strong>Set <code>pull.rebase</code> once</strong> on every teammate's machine, so everybody's pull behaves the same.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In the <code>thu-git</code> sandbox build a bare remote and two clones (<code>an</code>, <code>binh</code>) as in 18.1. Commit a file <code>Home.java</code> with three lines and push.</li>
<li><strong>Accident A.</strong> In <code>an</code> add a line at the end of <code>Home.java</code>, commit, push. In <code>binh</code>: create the branch <code>feature/x</code>, edit the last line of the same file <em>without</em> committing, run <code>git pull origin main</code>. Copy the message. Then commit, <code>git fetch</code>, <code>git log main..origin/main</code>, <code>git merge origin/main</code>, resolve, commit.</li>
<li><strong>Accident B.</strong> In both clones switch to <code>main</code>. <code>an</code> commits and pushes; <code>binh</code> commits and pushes (rejected). Run <code>git pull</code> and copy the "divergent" message. Fix it once with <code>--no-rebase</code> in this exercise.</li>
<li>Redo step 3 from scratch but fix it with <code>--rebase</code>. Compare <code>git log --oneline --graph</code> in the two runs.</li>
<li><strong>Accident C (only in the sandbox).</strong> Redo the situation of step 3, then run <code>git push --force origin main</code> from <code>binh</code> and run <code>git fetch</code> and <code>git status -sb</code> in <code>an</code>. Write one sentence on what An would have lost if he had no local copy.</li>
</ol>
<p><strong>Done when:</strong> (a) you have copied all four messages and can say in one sentence what each means; (b) the merge run shows a commit with two parents and the rebase run a straight line; (c) after the forced push <code>git status -sb</code> in <code>an</code> shows <code>ahead 1, behind 1</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fetch</span><span class="v">Download the remote's new commits into <code>origin/…</code> without changing your branch or files. Always safe.</span></div>
  <div class="kv"><span class="k">upstream / tracking branch</span><span class="v">The remote branch your local branch follows; it is what a bare <code>git pull</code> and <code>git push</code> use.</span></div>
  <div class="kv"><span class="k">fast-forward</span><span class="v">A merge that only moves the branch pointer forward because nothing diverged. A push is accepted only if it is a fast-forward.</span></div>
  <div class="kv"><span class="k">divergent branches</span><span class="v">Two branches that each have commits the other lacks.</span></div>
  <div class="kv"><span class="k">git push --force</span><span class="v">Make the remote branch equal yours even if that discards its commits. Dangerous on a shared branch.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">A safer force: refused if the remote moved since you last fetched.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A pull is a fetch plus a merge; every sync error comes from the merge half, and <code>git fetch</code> is always safe.</li><li>"Would be overwritten" means commit (or stash) first; "no tracking information" means push with <code>-u</code> or name the remote and branch.</li><li>"Rejected (fetch first)" and "divergent branches" mean: choose merge or rebase once, integrate, then push.</li><li>A merge is the safer default for beginners; a rebase gives a straight line but rewrites your own unshared commits.</li><li><code>--force</code> is not a fix for "rejected": it deletes teammates' commits from the shared branch.</li></ul>

<a class="link-card" href="https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Dealing with non-fast-forward errors</span><span class="lc-sub">Why pushes are rejected and the safe ways to fix them.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-pull" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git pull</span><span class="lc-sub">--rebase, --no-rebase, --ff-only and the pull.rebase setting.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git push</span><span class="lc-sub">The --force and --force-with-lease options and the "Note about fast-forwards".</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Typing <code>git push --force</code> because Stack Overflow said so</b>, and the teammate who pushed ten minutes earlier loses a commit without any message. <b>Reading "would be overwritten" as "Git is broken" and re-cloning the project</b>, losing the uncommitted work that the message was protecting. <b>Running <code>git pull</code> on a branch you never pushed</b> and then deleting the folder at "no tracking information". <b>Choosing rebase on a branch two people share</b> because it "looks cleaner".</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.3</span>
<h2>Bốn thông báo làm nhóm sinh viên nào cũng hoảng, và mỗi cái thật sự nói gì</h2>
<p class="lead">Đồng bộ với đồng đội sinh ra những lỗi trông dữ nhất của Git: "would be overwritten", "no tracking information", "rejected", "divergent branches". Không cái nào nghĩa là hỏng. Mỗi cái là Git từ chối đoán mò. Bài này tái hiện cả bốn trong lab, nói trong một câu mỗi cái nghĩa là gì, và đưa ra nước đi an toàn. Bài cũng cho thấy bằng output thật điều gì xảy ra với việc của đồng đội khi ai đó "sửa" lỗi rejected bằng <code>--force</code>.</p>
<p>Output: lab của chương, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. <code>fetch</code>, <code>pull</code> và tracking nói chung ở Chương 5; merge so với rebase ở Chương 3. Ở đây chỉ nói bốn tai nạn.</p>

<h3>Mô hình trong đầu: pull = fetch + merge</h3>
${slide('git-18', 9, 'git pull = fetch + merge, và ba chỗ nó vấp')}
<p><code>git pull</code> làm hai việc: <code>git fetch</code> (tải commit mới của remote về <code>origin/…</code>, không đụng gì của bạn) rồi merge (hoặc rebase) cái đó vào nhánh bạn đang đứng. Mọi lỗi dưới đây đến từ nửa sau. Nửa đầu luôn an toàn, nên thói quen ngăn được phần lớn tai nạn là: <strong>fetch trước, nhìn, rồi mới merge</strong>.</p>

<h3>Tai nạn A — đang làm dở chưa commit mà pull main</h3>
<p>An push một thay đổi cho <code>HomeServlet.java</code> lên <code>main</code>. Cùng lúc đó Chi mở một nhánh, sửa <em>đúng tệp đó</em> và chưa commit. Nghĩ "mình cần main mới nhất", bạn ấy gõ <code>git pull origin main</code>:</p>
@@T('keo-main-nham','git commit','git switch -c')@@
@@T('keo-main-nham','git switch -c','git commit')@@
<p>Hai thông báo khác nhau xuất hiện, vì hai lý do khác nhau:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">"Your local changes … would be overwritten by merge"</span><span class="v">Commit sắp vào sửa một tệp mà bạn đã sửa và chưa commit. Git không trộn âm thầm. Không mất gì; chỉ là pull không xảy ra (<code>Aborting</code>).</span></div>
  <div class="kv"><span class="k">"There is no tracking information for the current branch"</span><span class="v"><code>git pull</code> trơn hỏi "pull từ đâu?" — mà nhánh chưa từng push thì chưa có upstream (nhánh remote nó theo dõi). Hãy nói rõ (<code>git pull origin main</code>) hoặc đặt một lần (<code>git push -u origin &lt;nhánh&gt;</code>).</span></div>
</div>
<p><strong>Nước đi an toàn luôn cùng một thứ tự:</strong> commit việc của bạn (commit trên nhánh riêng là an toàn và hoàn tác được), <code>git fetch</code>, xem cái gì sắp về, merge nó vào nhánh của bạn:</p>
@@T('keo-main-nham','git commit','git merge origin/main',nth=1)@@
<p><code>git log main..origin/main</code> đọc là "các commit trên origin/main mà main của tôi chưa có": một dòng, commit của An. Giờ merge vào nhánh:</p>
@@T('keo-main-nham','git merge origin/main')@@
<p>Merge xung đột vì hai người cùng nối thêm vào cuối một tệp. Ở đây hai dòng thêm là hai chú thích độc lập nên cách giải là giữ cả hai (sau khi đọc chúng, không phải xoá dấu hiệu một cách mù quáng — xem 18.2), rồi commit. Đồ thị cho thấy commit merge có hai cha. Làm trên nhánh tính năng, đưa <code>main</code> vào bằng merge, và bản thân <code>main</code> không bao giờ bị đụng.</p>
<div class="callout warn"><code>git stash</code> là lựa chọn an toàn còn lại khi bạn chưa muốn commit: <code>git stash</code>, rồi pull, rồi <code>git stash pop</code>. Bước <code>pop</code> cũng có thể xung đột — cách chữa y hệt, và việc đã cất vẫn nằm trong stash cho tới khi pop thành công (Chương 4).</div>

<h3>Tai nạn B — "rejected", rồi "divergent branches"</h3>
${slide('git-18', 10, 'Hai người cùng đẩy lên main: lịch sử rẽ đôi')}
<p>An và Bình cùng commit trên <code>main</code> (thói quen xấu — xem 18.4 — nhưng đó là chuyện xảy ra trước khi nhóm có luật). An push trước. Bình push sau và bị từ chối; bạn ấy gõ <code>git pull</code> theo gợi ý của thông báo và nhận lỗi thứ hai:</p>
@@T('push-tu-choi','git commit','git pull',nth=0)@@
@@T('push-tu-choi','git pull','git pull --no-rebase')@@
<div class="kv-grid">
  <div class="kv"><span class="k">"! [rejected] main -> main (fetch first)"</span><span class="v"><code>main</code> trên remote có một commit mà máy bạn chưa có. Git từ chối một lần push làm remote "quên" nó. Cách chữa: đưa commit đó về, rồi push lại.</span></div>
  <div class="kv"><span class="k">"Need to specify how to reconcile divergent branches"</span><span class="v"><code>main</code> của bạn và <code>origin/main</code> mỗi bên có một commit bên kia không có, nên Git cần bạn chọn <em>cách</em> nối — merge, rebase, hay chỉ fast-forward. Git đời mới (từ 2.33) từ chối đoán. Đó là một câu hỏi, không phải thất bại.</span></div>
</div>
<p>Chọn một cách và nói rõ trên dòng lệnh. <strong>Merge</strong> giữ cả hai commit và thêm một commit merge:</p>
@@T('push-tu-choi','git pull --no-rebase')@@
<p><strong>Rebase</strong> phát lại commit của bạn lên trên <code>main</code> mới và để lại một đường thẳng (commit của bạn có mã băm mới, không sao vì bạn chưa chia sẻ nó — Chương 3):</p>
@@T('push-tu-choi-rebase','git pull --rebase')@@
<p>Với nhóm mới học, merge là mặc định an toàn hơn: nó không viết lại gì và xung đột của nó trông giống mọi xung đột khác. Chọn một lần để khỏi bị hỏi: <code>git config --global pull.rebase false</code> (merge) hoặc <code>true</code> (rebase). Nếu bạn đã đặt một trong hai thì sẽ không thấy thông báo "divergent" — kiểm bằng <code>git config --global --get pull.rebase</code>.</p>

<h3>Tai nạn C — đường tắt phá hỏng công việc: --force</h3>
<p>Bị từ chối thì khó chịu, và Internet gợi ý <code>git push --force</code>. Đây là điều nó làm với đúng tình huống trên:</p>
@@T('push-force','git push --force')@@
<p><code>main</code> trên remote bị kéo <em>lùi và sang ngang</em> về commit của Bình (<code>+ … (forced update)</code>). Commit của An biến khỏi nhánh chung. Clone của An vẫn còn nó (<code>ahead 1, behind 1</code>), và bản sao đó là lý do duy nhất nó cứu được: remote không còn giữ nó, nên commit chỉ sống ở nơi nào còn có người giữ. Việc bị từ chối là Git đang bảo vệ việc của An. Luật cho nhóm: <strong><code>--force</code> không bao giờ là câu trả lời cho "rejected"</strong>; fetch, tích hợp, push. Nếu bạn thật sự viết lại nhánh của riêng mình (commit amend hoặc rebase mà đã push), dùng <code>git push --force-with-lease</code>, nó từ chối nếu giữa chừng có người khác đã push — và chỉ trên nhánh không ai khác dùng. Trên GitHub bạn có thể tắt force push cho <code>main</code> (18.5).</p>

<h3>Phòng ngừa</h3>
<ul>
<li><strong>Fetch trước.</strong> Mở phiên làm việc bằng <code>git fetch</code> và <code>git status -sb</code>; chữ <code>[behind 2]</code> trên dòng trạng thái là toàn bộ câu chuyện.</li>
<li><strong>Không bao giờ làm trên <code>main</code></strong> (18.4) thì ở đó không gì rẽ đôi được.</li>
<li><strong>Commit trước khi tích hợp</strong>, để không còn "việc chưa lưu" cần bảo vệ.</li>
<li><strong>Push với <code>-u</code> lần đầu</strong>: <code>git push -u origin feature/x</code> đặt upstream và chữa "no tracking information" vĩnh viễn.</li>
<li><strong>Đặt <code>pull.rebase</code> một lần</strong> trên máy mọi người, để pull của ai cũng hành xử giống nhau.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong kho sân tập <code>thu-git</code> dựng một remote bare và hai clone (<code>an</code>, <code>binh</code>) như ở 18.1. Commit tệp <code>Home.java</code> ba dòng và push.</li>
<li><strong>Tai nạn A.</strong> Trong <code>an</code> thêm một dòng cuối <code>Home.java</code>, commit, push. Trong <code>binh</code>: tạo nhánh <code>feature/x</code>, sửa dòng cuối của cùng tệp <em>mà không</em> commit, chạy <code>git pull origin main</code>. Chép thông báo. Rồi commit, <code>git fetch</code>, <code>git log main..origin/main</code>, <code>git merge origin/main</code>, giải xung đột, commit.</li>
<li><strong>Tai nạn B.</strong> Ở cả hai clone chuyển sang <code>main</code>. <code>an</code> commit và push; <code>binh</code> commit và push (bị từ chối). Chạy <code>git pull</code> và chép thông báo "divergent". Bài này sửa một lần bằng <code>--no-rebase</code>.</li>
<li>Làm lại bước 3 từ đầu nhưng sửa bằng <code>--rebase</code>. So sánh <code>git log --oneline --graph</code> của hai lần.</li>
<li><strong>Tai nạn C (chỉ trong sân tập).</strong> Làm lại tình huống bước 3, rồi chạy <code>git push --force origin main</code> từ <code>binh</code> và chạy <code>git fetch</code>, <code>git status -sb</code> trong <code>an</code>. Viết một câu: nếu An không có bản sao cục bộ thì sẽ mất gì.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) bạn đã chép cả bốn thông báo và nói được trong một câu mỗi cái nghĩa là gì; (b) lần merge cho một commit có hai cha còn lần rebase cho một đường thẳng; (c) sau lần force push, <code>git status -sb</code> trong <code>an</code> hiện <code>ahead 1, behind 1</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fetch</span><span class="v">Tải commit mới của remote về <code>origin/…</code> mà không đổi nhánh hay tệp của bạn. Luôn an toàn.</span></div>
  <div class="kv"><span class="k">upstream / tracking branch</span><span class="v">Nhánh remote mà nhánh cục bộ của bạn theo dõi; <code>git pull</code> và <code>git push</code> trơn dùng nó.</span></div>
  <div class="kv"><span class="k">fast-forward</span><span class="v">Tua thẳng: merge chỉ dời con trỏ nhánh về phía trước vì không có gì rẽ đôi. Một lần push chỉ được nhận nếu là fast-forward.</span></div>
  <div class="kv"><span class="k">divergent branches</span><span class="v">Hai nhánh rẽ đôi: mỗi bên có commit mà bên kia không có.</span></div>
  <div class="kv"><span class="k">git push --force</span><span class="v">Ép nhánh remote bằng nhánh của bạn dù phải bỏ commit của nó. Nguy hiểm trên nhánh chung.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">Force an toàn hơn: bị từ chối nếu remote đã đổi từ lần fetch cuối của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Pull là fetch cộng merge; mọi lỗi đồng bộ đến từ nửa merge, và <code>git fetch</code> luôn an toàn.</li><li>"Would be overwritten" nghĩa là commit (hoặc stash) trước; "no tracking information" nghĩa là push với <code>-u</code> hoặc nêu rõ remote và nhánh.</li><li>"Rejected (fetch first)" và "divergent branches" nghĩa là: chọn merge hay rebase một lần, tích hợp, rồi push.</li><li>Merge là mặc định an toàn hơn cho người mới; rebase cho đường thẳng nhưng viết lại commit chưa chia sẻ của bạn.</li><li><code>--force</code> không phải cách sửa "rejected": nó xoá commit của đồng đội khỏi nhánh chung.</li></ul>

<a class="link-card" href="https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Dealing with non-fast-forward errors</span><span class="lc-sub">Vì sao push bị từ chối và những cách sửa an toàn.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-pull" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git pull</span><span class="lc-sub">--rebase, --no-rebase, --ff-only và cài đặt pull.rebase.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git push</span><span class="lc-sub">Tuỳ chọn --force và --force-with-lease, và mục "Note about fast-forwards".</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Gõ <code>git push --force</code> vì Stack Overflow bảo vậy</b>, và bạn push mười phút trước mất một commit mà không có thông báo nào. <b>Đọc "would be overwritten" thành "Git hỏng" rồi clone lại cả dự án</b>, mất luôn phần chưa commit mà thông báo đang bảo vệ. <b>Chạy <code>git pull</code> trên nhánh chưa từng push</b> rồi xoá thư mục khi gặp "no tracking information". <b>Chọn rebase trên nhánh hai người cùng dùng</b> vì nó "nhìn gọn hơn".</div>
</div>
`,
    },

