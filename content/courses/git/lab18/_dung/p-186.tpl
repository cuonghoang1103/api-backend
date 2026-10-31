    /* ─────────────────────────── 18.6 ─────────────────────────── */
    {
      title: '18.6 — Accident: undoing a merge that is already on main|||18.6 — Tai nạn: hoàn tác một merge đã nằm trên main',
      slug: 'git-18-6-hoan-tac-merge',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Merge hỏng chưa push thì reset về ORIG_HEAD; đã push thì git revert -m 1, và cái bẫy kinh điển sau đó: merge lại nhánh cũ báo "Already up to date" — cách thoát là revert cái revert. Mọi bước chạy thật trong lab.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.6</span>
<h2>The merge was a mistake. Can we take it back?</h2>
<p class="lead">You can, always — but the way depends on one fact: <strong>has the merge been pushed?</strong> Before the push the merge is a private experiment and you can erase it. After the push it is shared history, and the only safe way is to add a commit that cancels it. And then comes the trap that catches nearly everybody: after you cancel a merge, merging the same branch again does <em>nothing</em>. This lesson walks through all three situations with real output.</p>
<p>Outputs: this chapter's lab, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Reverting an ordinary commit is Chapter 4.3 and the reset-or-revert table is in 18.4; here we deal with a <em>merge</em> commit, which has two parents and needs one extra option.</p>

<h3>Situation 1 — merged locally, not pushed yet</h3>
${slide('git-18', 14, 'Hoàn tác merge: ORIG_HEAD, revert -m 1, và revert cái revert')}
<p>Bình merges his branch into <code>main</code> and, before pushing, remembers the URL mapping is wrong:</p>
@@T('hoan-tac-merge-chua-push','git switch -c')@@
<p><code>[ahead 2]</code> — the merge commit and the branch commit are only here. Git stores the position <code>main</code> had before a merge in <code>ORIG_HEAD</code>, so going back is one command, and it is safe precisely because nothing was shared. The branch keeps the servlet commit, so no work is lost: the log at the end shows the branch's commit hanging off the original commit and <code>main</code> back where it was. (If the merge is still <em>in progress</em> with conflicts, the command is <code>git merge --abort</code> — 18.2.)</p>

<h3>Situation 2 — already on main: revert the merge</h3>
<h3>First, look at what a merge commit is</h3>
<p>A merge commit is the one place where a commit has <strong>two parents</strong>. <code>%p</code> prints them in order, and <code>HEAD^1</code>, <code>HEAD^2</code> name them:</p>
@@T('hoan-tac-merge','git log --merges','git revert -m 1')@@
<p>Parent 1 is the commit <code>main</code> was on when the merge was made; parent 2 is the tip of the merged branch. "Undo this merge" therefore means "go back to parent 1" — and Git needs you to say so.</p>
<p>Now suppose Bình pushed, An pulled, and Tomcat refuses to start. A merge commit has <em>two</em> parents, so <code>git revert</code> must be told which side is "the mainline" to return to. <code>-m 1</code> means "parent number 1", which for a merge made on <code>main</code> is <code>main</code> itself (the first parent is the branch you were on):</p>
@@T('hoan-tac-merge','git revert -m 1','git pull -q')@@
<p>The history is not rewritten: the merge commit <code>…</code> stays, and a new commit <em>Revert "Merge …"</em> sits on top and removes the eight lines that the branch had added (<code>1 file changed, 8 deletions(-)</code>). Everybody's next pull is an ordinary fast-forward. Without <code>-m 1</code> Git refuses (<code>error: commit … is a merge but no -m option was given</code>): it cannot know which parent you want to keep. If you pick the wrong number you "revert" the main side and keep the bad side.</p>

<h3>The trap: merging the fixed branch again does nothing</h3>
<p>Bình fixes the mapping and wants to bring the branch back. He switches to <code>main</code> and merges it:</p>
@@T('hoan-tac-merge','git pull -q','git switch feature')@@
<p><strong><code>Already up to date.</code></strong> To Git the branch's commit is already an ancestor of <code>main</code> — it was merged, and the later revert is just another commit on top. Git only merges commits that are <em>not yet</em> ancestors. The original change is therefore "merged and cancelled", and no amount of re-merging will bring it back. There is a worse variant: Bình fixes the branch first and merges at once.</p>
@@T('hoan-tac-merge','git switch feature','git revert --no-edit')@@
<p>This time the merge brings in only the <em>fix</em> (one line changed), but <code>main</code> no longer contains the block that the fix modifies — the revert removed it — so the two sides conflict on <code>web.xml</code>. It looks like a mysterious conflict; it is the revert at work.</p>

<h3>The way out: revert the revert</h3>
<p>Cancel the cancellation. That restores everything the merge brought, and then the merge of the fixed branch is a clean, small one. Do it <strong>locally and before you push</strong>, so the faulty state never reaches anyone:</p>
@@T('hoan-tac-merge','git revert --no-edit')@@
<p>In Git 2.51 the command names its new commit <em>Reapply "Merge …"</em>. The merge of the fixed branch then applies only the one changed line (<code>1 insertion(+), 1 deletion(-)</code>), the check <code>git grep url-pattern</code> shows <code>/trang-chu</code> instead of a second <code>/home</code>, and only then is it pushed. The graph is longer than anyone would like — merge, revert, reapply, fix, merge — and perfectly honest about what happened.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Alternative: a new branch</span><span class="v">Instead of reverting the revert, create a fresh branch from <code>main</code>, copy the fixed change onto it (<code>git cherry-pick</code> the feature commits — Chapter 8), and open a new pull request. Cleaner history of intent, more typing; good when the original branch was messy.</span></div>
  <div class="kv"><span class="k">Why not reset and force?</span><span class="v">It would hide the merge from the log, but every teammate who pulled has it, and a force push on <code>main</code> is the accident of 18.3.</span></div>
</div>

<h3>Prevent it</h3>
<ul>
<li><strong>Check before the push:</strong> <code>git status -sb</code> and <code>git log --oneline --graph -5</code>; two seconds that turn Situation 2 into Situation 1.</li>
<li><strong>Merge through a pull request</strong> (18.5): the merge button is "undo-able" in one click on GitHub (<em>Revert</em> on the merged pull request opens a new pull request that does exactly <code>revert -m 1</code> for you).</li>
<li><strong>Run the app after merging into your branch</strong> (18.2), not after merging into <code>main</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Sandbox: bare remote, clones <code>an</code> and <code>binh</code>, a <code>web.xml</code> with a <code>/home</code> mapping pushed.</li>
<li><strong>Situation 1.</strong> In <code>binh</code> make a branch that adds a second <code>/home</code> mapping, merge it into <code>main</code> with <code>--no-ff</code> and do <em>not</em> push. Run <code>git status -sb</code>, then <code>git reset --hard ORIG_HEAD</code>, then <code>git status -sb</code> again.</li>
<li><strong>Situation 2.</strong> Repeat the merge, this time push it, and pull in <code>an</code>. In <code>an</code> run <code>git revert -m 1 --no-edit HEAD</code>, then push. Try the same command without <code>-m 1</code> in a scratch copy and copy the error.</li>
<li><strong>The trap.</strong> In <code>binh</code> pull, switch to <code>main</code> and run <code>git merge &lt;branch&gt;</code> — copy the message. Fix the mapping on the branch, commit, and merge again to see the conflict; <code>git merge --abort</code>.</li>
<li><strong>The way out.</strong> On <code>main</code> run <code>git revert --no-edit &lt;hash of the Revert commit&gt;</code>, merge the fixed branch with <code>--no-ff</code>, check <code>git grep url-pattern</code>, push.</li>
</ol>
<p><strong>Done when:</strong> (a) Situation 1 ends with <code>main</code> level with <code>origin/main</code> and the branch still holding its commit; (b) the revert of the merge removes the lines and pulls cleanly in <code>an</code>; (c) you have seen both <code>Already up to date.</code> and the conflict; (d) the final <code>web.xml</code> has exactly one <code>/home</code> and one <code>/trang-chu</code> mapping.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">merge commit</span><span class="v">A commit with two parents, created when two lines of history are joined.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">A pointer Git sets before risky operations (merge, reset, rebase) remembering where <code>HEAD</code> was.</span></div>
  <div class="kv"><span class="k">revert -m 1</span><span class="v">Revert a merge commit, keeping parent 1 (the branch you merged <em>into</em>) as the mainline.</span></div>
  <div class="kv"><span class="k">revert the revert</span><span class="v">Revert the commit that cancelled a merge, so that the original changes are present again.</span></div>
  <div class="kv"><span class="k">ancestor</span><span class="v">A commit reachable by following parent links. Git merges only commits that are not already ancestors.</span></div>
  <div class="kv"><span class="k">merge --abort</span><span class="v">Cancel a merge that stopped on conflicts and return to the state before it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Not pushed: <code>git reset --hard ORIG_HEAD</code> (or <code>git merge --abort</code> if still in conflict); the branch keeps its work.</li><li>Pushed: <code>git revert -m 1 &lt;merge&gt;</code> adds a cancelling commit; the number says which parent is the mainline.</li><li>After a revert, merging the same branch says <code>Already up to date</code> because its commits are already ancestors.</li><li>The way out is to revert the revert (locally, before pushing), then merge the fixed branch — or cherry-pick onto a fresh branch.</li><li>Reading the log (<code>--graph</code>) beats guessing: the history shows exactly which of these situations you are in.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git revert</span><span class="lc-sub">The -m option for reverting a merge commit.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/howto/revert-a-faulty-merge.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">git-scm — How to revert a faulty merge</span><span class="lc-sub">The Git project's own account of the "revert the revert" problem.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge</span><span class="lc-sub">--abort, --no-ff and how ORIG_HEAD is used.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/reverting-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">🧯</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Reverting a pull request</span><span class="lc-sub">The Revert button on a merged pull request.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Reverting a merge without <code>-m 1</code></b> or with <code>-m 2</code>, and "reverting" the good side. <b>Re-merging the fixed branch, getting "Already up to date", and concluding that the fix was lost</b>; it was not, it just was never brought over. <b>Reverting the merge, then merging the branch again after fixing it</b> and resolving the surprise conflict by "accept mine", which silently drops the code. <b>Deleting the branch after the revert</b>, losing the only clean copy of the change.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.6</span>
<h2>Merge nhầm rồi. Rút lại được không?</h2>
<p class="lead">Được, luôn luôn — nhưng cách làm phụ thuộc vào một sự thật: <strong>merge đã được push chưa?</strong> Trước khi push, merge là một thí nghiệm riêng và bạn xoá được nó. Sau khi push, nó là lịch sử chung, và cách an toàn duy nhất là thêm một commit huỷ nó. Rồi tới cái bẫy bắt gần như mọi người: sau khi huỷ một merge, merge lại cùng nhánh đó <em>không làm gì cả</em>. Bài này đi qua cả ba tình huống bằng output thật.</p>
<p>Output: lab của chương, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Revert một commit thường ở Chương 4.3 và bảng reset-hay-revert ở 18.4; ở đây nói về một commit <em>merge</em>, có hai cha và cần thêm một tuỳ chọn.</p>

<h3>Tình huống 1 — merge cục bộ, chưa push</h3>
${slide('git-18', 14, 'Hoàn tác merge: ORIG_HEAD, revert -m 1, và revert cái revert')}
<p>Bình merge nhánh của mình vào <code>main</code> và, trước khi push, nhớ ra ánh xạ URL bị sai:</p>
@@T('hoan-tac-merge-chua-push','git switch -c')@@
<p><code>[ahead 2]</code> — commit merge và commit của nhánh chỉ có ở đây. Git lưu vị trí <code>main</code> đứng trước một lần merge trong <code>ORIG_HEAD</code>, nên quay lại chỉ một lệnh, và an toàn chính vì chưa chia sẻ gì. Nhánh vẫn giữ commit servlet nên không mất việc: log cuối cho thấy commit của nhánh treo vào commit gốc và <code>main</code> về chỗ cũ. (Nếu merge còn <em>đang dở</em> vì xung đột thì lệnh là <code>git merge --abort</code> — 18.2.)</p>

<h3>Tình huống 2 — đã nằm trên main: revert cái merge</h3>
<h3>Trước hết, nhìn một commit merge là gì</h3>
<p>Commit merge là chỗ duy nhất một commit có <strong>hai cha</strong>. <code>%p</code> in chúng theo thứ tự, còn <code>HEAD^1</code>, <code>HEAD^2</code> gọi tên chúng:</p>
@@T('hoan-tac-merge','git log --merges','git revert -m 1')@@
<p>Cha 1 là commit mà <code>main</code> đang đứng khi làm merge; cha 2 là đầu nhánh được merge. "Huỷ merge này" vì vậy nghĩa là "quay về cha 1" — và Git cần bạn nói rõ điều đó.</p>
<p>Giờ giả sử Bình đã push, An đã pull, và Tomcat không chịu khởi động. Một commit merge có <em>hai</em> cha, nên <code>git revert</code> phải được cho biết phía nào là "dòng chính" để quay về. <code>-m 1</code> nghĩa là "cha số 1", với một merge làm trên <code>main</code> thì đó chính là <code>main</code> (cha đầu tiên là nhánh bạn đang đứng):</p>
@@T('hoan-tac-merge','git revert -m 1','git pull -q')@@
<p>Lịch sử không bị viết lại: commit merge vẫn còn, và một commit mới <em>Revert "Merge …"</em> nằm trên cùng, xoá tám dòng mà nhánh đã thêm (<code>1 file changed, 8 deletions(-)</code>). Lần pull kế của mọi người là một fast-forward bình thường. Thiếu <code>-m 1</code> thì Git từ chối (<code>error: commit … is a merge but no -m option was given</code>): nó không biết bạn muốn giữ cha nào. Nếu chọn sai số, bạn "revert" nhầm phía main và giữ lại phía hỏng.</p>

<h3>Cái bẫy: merge lại nhánh đã sửa mà không có gì xảy ra</h3>
<p>Bình sửa ánh xạ và muốn đưa nhánh quay lại. Bạn ấy chuyển sang <code>main</code> và merge nó:</p>
@@T('hoan-tac-merge','git pull -q','git switch feature')@@
<p><strong><code>Already up to date.</code></strong> Với Git, commit của nhánh đã là tổ tiên của <code>main</code> — nó đã được merge, và lần revert sau chỉ là một commit nữa nằm trên. Git chỉ merge những commit <em>chưa</em> là tổ tiên. Vì vậy thay đổi gốc là "đã merge và đã bị huỷ", và merge lại bao nhiêu lần cũng không đem nó về. Còn có biến thể tệ hơn: Bình sửa nhánh trước rồi merge ngay.</p>
@@T('hoan-tac-merge','git switch feature','git revert --no-edit')@@
<p>Lần này merge chỉ mang về mỗi <em>bản sửa</em> (một dòng đổi), nhưng <code>main</code> không còn khối mà bản sửa chỉnh — revert đã xoá nó — nên hai phía xung đột ở <code>web.xml</code>. Nhìn như một xung đột bí ẩn; thật ra là tác dụng của lần revert.</p>

<h3>Lối ra: revert cái revert</h3>
<p>Huỷ việc huỷ. Việc đó khôi phục mọi thứ merge đã mang vào, và sau đó merge nhánh đã sửa là một phép merge sạch, nhỏ. Làm nó <strong>cục bộ và trước khi push</strong>, để trạng thái lỗi không bao giờ tới ai:</p>
@@T('hoan-tac-merge','git revert --no-edit')@@
<p>Ở Git 2.51 lệnh đặt tên commit mới là <em>Reapply "Merge …"</em>. Phép merge nhánh đã sửa khi đó chỉ áp đúng một dòng đã đổi (<code>1 insertion(+), 1 deletion(-)</code>), phép kiểm <code>git grep url-pattern</code> cho thấy <code>/trang-chu</code> thay cho <code>/home</code> thứ hai, và chỉ lúc đó mới push. Đồ thị dài hơn ai cũng muốn — merge, revert, reapply, sửa, merge — và hoàn toàn trung thực về điều đã xảy ra.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cách khác: nhánh mới</span><span class="v">Thay vì revert cái revert, tạo nhánh mới từ <code>main</code>, chép thay đổi đã sửa sang đó (<code>git cherry-pick</code> các commit tính năng — Chương 8) và mở pull request mới. Lịch sử về ý định sạch hơn, gõ nhiều hơn; hợp khi nhánh gốc lộn xộn.</span></div>
  <div class="kv"><span class="k">Sao không reset rồi force?</span><span class="v">Nó giấu merge khỏi log, nhưng mọi bạn đã pull đều có nó, và force push trên <code>main</code> là tai nạn của 18.3.</span></div>
</div>

<h3>Phòng ngừa</h3>
<ul>
<li><strong>Kiểm trước khi push:</strong> <code>git status -sb</code> và <code>git log --oneline --graph -5</code>; hai giây biến Tình huống 2 thành Tình huống 1.</li>
<li><strong>Merge qua pull request</strong> (18.5): nút merge "hoàn tác được" bằng một cú bấm trên GitHub (nút <em>Revert</em> trên pull request đã merge mở một pull request mới làm đúng <code>revert -m 1</code> hộ bạn).</li>
<li><strong>Chạy ứng dụng sau khi merge vào nhánh của bạn</strong> (18.2), không phải sau khi merge vào <code>main</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Sân tập: remote bare, clone <code>an</code> và <code>binh</code>, một <code>web.xml</code> có ánh xạ <code>/home</code> đã push.</li>
<li><strong>Tình huống 1.</strong> Trong <code>binh</code> tạo nhánh thêm ánh xạ <code>/home</code> thứ hai, merge vào <code>main</code> bằng <code>--no-ff</code> và <em>không</em> push. Chạy <code>git status -sb</code>, rồi <code>git reset --hard ORIG_HEAD</code>, rồi <code>git status -sb</code> lần nữa.</li>
<li><strong>Tình huống 2.</strong> Lặp lại merge, lần này push, và pull trong <code>an</code>. Trong <code>an</code> chạy <code>git revert -m 1 --no-edit HEAD</code>, rồi push. Thử cùng lệnh không có <code>-m 1</code> trong một bản sao nháp và chép lỗi.</li>
<li><strong>Cái bẫy.</strong> Trong <code>binh</code> pull, chuyển sang <code>main</code> và chạy <code>git merge &lt;nhánh&gt;</code> — chép thông báo. Sửa ánh xạ trên nhánh, commit, merge lại để thấy xung đột; <code>git merge --abort</code>.</li>
<li><strong>Lối ra.</strong> Trên <code>main</code> chạy <code>git revert --no-edit &lt;mã băm của commit Revert&gt;</code>, merge nhánh đã sửa bằng <code>--no-ff</code>, kiểm <code>git grep url-pattern</code>, push.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) Tình huống 1 kết thúc với <code>main</code> ngang <code>origin/main</code> và nhánh vẫn giữ commit của nó; (b) revert của merge xoá các dòng và pull êm trong <code>an</code>; (c) bạn đã thấy cả <code>Already up to date.</code> lẫn xung đột; (d) <code>web.xml</code> cuối cùng có đúng một ánh xạ <code>/home</code> và một <code>/trang-chu</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">merge commit</span><span class="v">Commit có hai cha, sinh ra khi nối hai dòng lịch sử.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">Con trỏ Git đặt trước các thao tác rủi ro (merge, reset, rebase) để nhớ <code>HEAD</code> từng ở đâu.</span></div>
  <div class="kv"><span class="k">revert -m 1</span><span class="v">Revert một commit merge, giữ cha 1 (nhánh bạn merge <em>vào</em>) làm dòng chính.</span></div>
  <div class="kv"><span class="k">revert the revert</span><span class="v">Revert commit đã huỷ một merge, để thay đổi gốc có mặt trở lại.</span></div>
  <div class="kv"><span class="k">ancestor</span><span class="v">Tổ tiên: commit với tới được bằng cách đi theo liên kết cha. Git chỉ merge các commit chưa là tổ tiên.</span></div>
  <div class="kv"><span class="k">merge --abort</span><span class="v">Huỷ một merge đang dừng vì xung đột và quay về trạng thái trước nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chưa push: <code>git reset --hard ORIG_HEAD</code> (hoặc <code>git merge --abort</code> nếu còn đang xung đột); nhánh giữ nguyên việc.</li><li>Đã push: <code>git revert -m 1 &lt;merge&gt;</code> thêm một commit huỷ; con số nói cha nào là dòng chính.</li><li>Sau một lần revert, merge lại cùng nhánh báo <code>Already up to date</code> vì các commit của nó đã là tổ tiên.</li><li>Lối ra là revert cái revert (cục bộ, trước khi push) rồi merge nhánh đã sửa — hoặc cherry-pick sang nhánh mới.</li><li>Đọc log (<code>--graph</code>) hơn đoán mò: lịch sử cho biết chính xác bạn đang ở tình huống nào.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git revert</span><span class="lc-sub">Tuỳ chọn -m để revert một commit merge.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/howto/revert-a-faulty-merge.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">git-scm — How to revert a faulty merge</span><span class="lc-sub">Bài của chính dự án Git về vấn đề "revert cái revert".</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge</span><span class="lc-sub">--abort, --no-ff và cách ORIG_HEAD được dùng.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/reverting-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">🧯</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Reverting a pull request</span><span class="lc-sub">Nút Revert trên một pull request đã merge.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Revert một merge mà thiếu <code>-m 1</code></b> hoặc dùng <code>-m 2</code>, và "revert" nhầm phía tốt. <b>Merge lại nhánh đã sửa, nhận "Already up to date", rồi kết luận bản sửa đã mất</b>; không mất, chỉ là chưa từng được mang sang. <b>Revert merge rồi merge lại nhánh sau khi sửa</b> và giải xung đột bất ngờ bằng "accept mine", âm thầm bỏ mất mã. <b>Xoá nhánh sau khi revert</b>, mất bản sạch duy nhất của thay đổi.</div>
</div>
`,
    },

