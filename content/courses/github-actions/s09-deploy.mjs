const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 9: Deploy từ CI, và vì sao kho này ĐÃ THÔI.
 * Số đo: 10/11 workflow của kho này là workflow_dispatch. Lý do có ghi trong
 * CLAUDE.md — hai sự cố ngày 2026-07-03 và 2026-07-06.
 */

export default {
  title: 'Chapter 9 — Deploying from CI, and why this repository stopped|||Chương 9 — Deploy từ CI, và vì sao kho này ĐÃ THÔI',
  slug: 'ga-ch9-deploy',
  description: '10/11 workflow của kho này chỉ chạy tay (workflow_dispatch). Không phải vì lười — có hai sự cố có ngày tháng khiến push-để-deploy bị GỠ. Bài này đo lý do và các mẫu thay thế.',
  sortOrder: 10,
  lessons: [

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Push-to-deploy, and the two outages that ended it here|||9.1 — Push-để-deploy, và hai sự cố đã kết liễu nó ở đây',
      slug: 'ga-9-1-push-de-deploy',
      type: 'VIDEO',
      description: '10/11 workflow của kho này bị đặt `workflow_dispatch`. Không phải phong cách — hai sự cố có ngày (2026-07-03 và 2026-07-06) đã kết liễu cách push-để-deploy. Bài này đo cả hai và nêu tên cơ chế thất bại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Push-to-deploy, and the two outages that ended it here</h2>
<p class="lead">Every guide to CI/CD ends with "push to main and it deploys". This repository&#39;s workflows have moved in the opposite direction: 10 of 11 are <code>workflow_dispatch</code> only. That is not conservatism — it is a decision made after two dated outages, both of which had the same shape.</p>

<h3>The trigger inventory today</h3>
<div class="out">backend-vps.yml           workflow_dispatch
ci-lint.yml               pull_request, push        <- DUY NHAT chay tren push
deploy-ghcr.yml           workflow_dispatch
desktop-release.yml       workflow_dispatch
e2e-message-button.yml    workflow_dispatch
fix-containers.yml        workflow_dispatch
full-deploy.yml           workflow_dispatch
guard-no-duplicates.yml   workflow_dispatch
restart-containers.yml    workflow_dispatch
sync-frontend.yml         workflow_dispatch
vps-cleanup-weekly.yml    schedule, workflow_dispatch

10 / 11 chi chay tay. deploy KHONG con la HE QUA cua push.</div>

<div class="callout">
<p><strong>The lint workflow runs on push, and that is it.</strong> The two deploy workflows once did too, and the repository&#39;s own operations notes record exactly what stopped them: two production incidents, in the same week, both caused by <em>two deploy workflows racing each other</em>.</p>
</div>

<h3>Incident 1 · 2026-07-03 — feed 500 while schema lagged the image</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push to main</span><span class="lz-t">both workflows trigger</span><span class="lz-d"><code>deploy-ghcr.yml</code> and <code>backend-vps.yml</code> were both configured <code>on: push</code>. Two runs entered the queue at the same commit</span></div>
<div class="lz-step"><span class="lz-k">the two deploys interleave</span><span class="lz-t">image swapped, migration not yet applied</span><span class="lz-d">the container recreated with new code before <code>prisma migrate deploy</code> from the other workflow finished. New code hit an old schema</span></div>
<div class="lz-step"><span class="lz-k">what users saw</span><span class="lz-t">HTTP 500 on the feed</span><span class="lz-d">a real outage caused by ordering, not by any single workflow being wrong</span></div>
</div>

<h3>Incident 2 · 2026-07-06 — Exited(137) and orphan containers</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push to main</span><span class="lz-t">two workflows again, both mid-recreate</span><span class="lz-d">both called <code>docker compose up -d --force-recreate</code> against the same container names</span></div>
<div class="lz-step"><span class="lz-k">docker refuses</span><span class="lz-t">"container name is already in use"</span><span class="lz-d">the second recreate could not run — but the first had already stopped the running container. Backend was down</span></div>
<div class="lz-step"><span class="lz-k">recovery</span><span class="lz-t"><code>Exited(137)</code>, orphans, manual <code>docker start</code></span><span class="lz-d">the backend container was in state <code>Exited(137)</code> — killed. Recovered with <code>docker start cuonghoangdev_backend</code> from the operator&#39;s shell</span></div>
</div>

<div class="callout warn">
<p><strong>Both incidents were the same failure with two different symptoms.</strong> Nothing was wrong with either workflow individually. The failure was that pushing a commit triggered two of them and there was no coordination between them — no shared lock, no compose project name, no acceptance test that would have refused to swap before the migration completed. The obvious remedies (add <code>concurrency:</code>, pin the compose project) were tried; the observed solution was to <em>remove the automatic trigger</em>.</p>
</div>

<h3>What "deploy is a script you run" changed</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">now: <code>bash deploy-nha.sh</code></span><span class="lz-lnote">a script on a person&#39;s machine builds the images, pushes to GHCR, and swaps on the VPS. One process, one order, no races. Recorded in CLAUDE.md as "the STANDARD path since 2026-08-18"</span></div>
<div class="lz-layer"><span class="lz-lname">the human is the concurrency control</span><span class="lz-lnote">from 7.2: nine workflows here have no <code>concurrency:</code> block because the trigger is a person. That is a real control with a real property — a person knows whether the last one finished. It breaks the day there are two people</span></div>
<div class="lz-layer"><span class="lz-lname">push still deploys nothing</span><span class="lz-lnote">the CLAUDE.md guidance is emphatic: "Deploying stays a script you run, never a side effect of pushing." One line, and it is the residue of two outages</span></div>
<div class="lz-layer"><span class="lz-lname">what push does now</span><span class="lz-lnote">only <code>ci-lint.yml</code>: lint, typecheck, unit tests. No credentials, no side effects. If it breaks, nothing user-facing changes</span></div>
</div>

<h3>The general pattern, stated once</h3>
<p>Push-to-deploy is safe when three things are true, and this repository had none of them in July:</p>

<div class="kv-grid">
<div class="kv"><span class="k">exactly one workflow deploys</span><span class="v">not "one workflow per environment" — one workflow, full stop, that owns the sequence. Two workflows deploying the same environment are two workflows racing</span></div>
<div class="kv"><span class="k">deploys are idempotent</span><span class="v">not "usually converge" — actually idempotent. From 7.2: <code>concurrency</code> only serialises; the second run must not overwrite what the first produced if they are the same commit, and it must not corrupt if they are not</span></div>
<div class="kv"><span class="k">rollback is on the deploy path</span><span class="v">a red run in production must produce the previous known-good state, automatically. Otherwise every failed deploy is an outage, and every deploy is a decision to accept outages</span></div>
</div>

<div class="callout ok">
<p><strong>Manual deploy is not the answer everywhere.</strong> A repository with all three properties above should absolutely push to deploy — the operational payoff is real, and the "push a commit and it lands" workflow is what makes many teams fast. This repository does not have the properties yet; the honest response was to stop deploying automatically until it does, and the honest documentation is the CLAUDE.md sentence "Deploying stays a script you run".</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — adding <code>concurrency:</code> and thinking the problem is solved.</strong> 7.2 measured what <code>concurrency</code> does — it queues, it does not enforce ordering across separate workflows unless they share a group, and it does not make anything idempotent. Both July incidents involved two <em>different</em> workflows, so a per-workflow concurrency block would not have prevented them. Sharing a group across workflows is possible; making sure two people never trigger overlapping runs is not.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Push-to-deploy is not primitively unsafe, but it demands three properties this repository did not have — a single deploying workflow, idempotent deploys, automatic rollback — so after two outages in one week the observable fix was to remove the automatic trigger and encode the deploy as a script that a person runs on purpose.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the deploy policy in this repository</span><span class="lc-sub">the <code>Docker &amp; Deploy</code> section, including "Deploying stays a script you run, never a side effect of pushing" and the two dated incidents that produced that rule.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.concurrency across workflows</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-concurrency — the shared-group form that <em>could</em> coordinate two workflows, and the reasons it is still not enough on its own.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Accelerate — deployment frequency and change fail rate</span><span class="lc-sub">itrevolution.com/product/accelerate/ — the industry evidence for push-to-deploy at scale, including the observation that the operational discipline it demands is a bigger investment than the trigger itself.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the deploy script this repository actually uses</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — <code>deploy-nha.sh</code>, the smoke tests, and the fallback path when the home machine is not available.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — recreate races and named containers</span><span class="lc-sub">/courses/docker/learn${REF} — the specific "container name already in use" mechanism behind the second incident, and the project-name pinning that avoids it within a single workflow.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Push-để-deploy, và hai sự cố đã kết liễu nó ở đây</h2>
<p class="lead">Mọi hướng dẫn về CI/CD đều kết thúc bằng "push lên main là deploy". Các workflow của kho này đã đi theo hướng NGƯỢC LẠI: 10 trên 11 là <code>workflow_dispatch</code> only. Đó không phải bảo thủ — đó là một quyết định đưa ra sau HAI sự cố có ngày tháng, cả hai đều cùng một hình dạng.</p>

<h3>Kiểm kê kích hoạt hôm nay</h3>
<div class="out">backend-vps.yml           workflow_dispatch
ci-lint.yml               pull_request, push        <- DUY NHAT chay tren push
deploy-ghcr.yml           workflow_dispatch
desktop-release.yml       workflow_dispatch
e2e-message-button.yml    workflow_dispatch
fix-containers.yml        workflow_dispatch
full-deploy.yml           workflow_dispatch
guard-no-duplicates.yml   workflow_dispatch
restart-containers.yml    workflow_dispatch
sync-frontend.yml         workflow_dispatch
vps-cleanup-weekly.yml    schedule, workflow_dispatch

10 / 11 chi chay tay. deploy KHONG con la HE QUA cua push.</div>

<div class="callout">
<p><strong>Workflow lint chạy khi có push, và chỉ có thế.</strong> Hai workflow deploy TỪNG chạy như vậy, và chính sổ vận hành của kho ghi lại chính xác cái gì đã DỪNG chúng: hai sự cố production, cùng một tuần, cả hai đều do <em>hai workflow deploy đua nhau</em>.</p>
</div>

<h3>Sự cố 1 · 2026-07-03 — feed 500 khi schema tụt sau image</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push lên main</span><span class="lz-t">cả hai workflow kích hoạt</span><span class="lz-d"><code>deploy-ghcr.yml</code> và <code>backend-vps.yml</code> đều được cấu hình <code>on: push</code>. Hai lần chạy vào hàng đợi tại CÙNG một commit</span></div>
<div class="lz-step"><span class="lz-k">hai cuộc deploy chen nhau</span><span class="lz-t">ảnh đã tráo, migration chưa áp</span><span class="lz-d">container tái tạo với mã mới trước khi <code>prisma migrate deploy</code> của workflow kia xong. Mã mới đụng schema cũ</span></div>
<div class="lz-step"><span class="lz-k">người dùng thấy gì</span><span class="lz-t">HTTP 500 ở feed</span><span class="lz-d">một sự cố thật gây bởi THỨ TỰ, không phải bởi bất kỳ workflow nào bị sai</span></div>
</div>

<h3>Sự cố 2 · 2026-07-06 — Exited(137) và container mồ côi</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push lên main</span><span class="lz-t">lại hai workflow, cả hai đang giữa cuộc tái tạo</span><span class="lz-d">cả hai đều gọi <code>docker compose up -d --force-recreate</code> lên CÙNG các tên container</span></div>
<div class="lz-step"><span class="lz-k">docker từ chối</span><span class="lz-t">"container name is already in use"</span><span class="lz-d">cuộc tái tạo thứ hai không chạy được — nhưng cuộc đầu ĐÃ dừng container đang chạy. Backend chết</span></div>
<div class="lz-step"><span class="lz-k">khôi phục</span><span class="lz-t"><code>Exited(137)</code>, mồ côi, <code>docker start</code> thủ công</span><span class="lz-d">container backend ở trạng thái <code>Exited(137)</code> — bị giết. Khôi phục bằng <code>docker start cuonghoangdev_backend</code> từ shell của người vận hành</span></div>
</div>

<div class="callout warn">
<p><strong>Cả hai sự cố là CÙNG một kiểu hỏng với hai triệu chứng khác nhau.</strong> Không có gì sai trong từng workflow riêng lẻ. Kiểu hỏng là push một commit kích hoạt HAI cái và không có phối hợp nào giữa chúng — không khoá chung, không tên project compose chung, không bài nghiệm thu nào từ chối tráo trước khi migration xong. Các biện pháp khắc phục hiển nhiên (thêm <code>concurrency:</code>, ghim tên project) đã được thử; giải pháp thật sự quan sát được là <em>GỠ kích hoạt tự động</em>.</p>
</div>

<h3>"Deploy là một script bạn CHẠY" đã đổi cái gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">giờ: <code>bash deploy-nha.sh</code></span><span class="lz-lnote">một script trên máy của một người dựng ảnh, đẩy lên GHCR, và tráo trên VPS. MỘT tiến trình, MỘT thứ tự, không đua nhau. Ghi trong CLAUDE.md là "đường CHUẨN từ 2026-08-18"</span></div>
<div class="lz-layer"><span class="lz-lname">CON NGƯỜI là biện pháp kiểm soát đồng thời</span><span class="lz-lnote">từ bài 7.2: chín workflow ở đây không có khối <code>concurrency:</code> vì kích hoạt là một CON NGƯỜI. Đó là biện pháp thật với tính chất thật — một người BIẾT cái trước đã xong hay chưa. Nó vỡ vào cái ngày có HAI người</span></div>
<div class="lz-layer"><span class="lz-lname">push vẫn KHÔNG deploy gì</span><span class="lz-lnote">chỉ dẫn CLAUDE.md rất dứt khoát: "Deploying stays a script you run, never a side effect of pushing." Một dòng, và nó là phần cặn để lại từ hai sự cố</span></div>
<div class="lz-layer"><span class="lz-lname">push giờ làm gì</span><span class="lz-lnote">chỉ <code>ci-lint.yml</code>: lint, kiểm kiểu, unit test. Không thông tin đăng nhập, không tác dụng phụ. Nếu nó vỡ, không có gì phía người dùng thay đổi</span></div>
</div>

<h3>Khuôn mẫu tổng quát, phát biểu một lần</h3>
<p>Push-để-deploy AN TOÀN khi ba điều đúng, và kho này không có cái nào trong tháng Bảy:</p>

<div class="kv-grid">
<div class="kv"><span class="k">đúng MỘT workflow deploy</span><span class="v">không phải "một workflow cho mỗi môi trường" — một workflow, chấm hết, sở hữu cả trình tự. Hai workflow deploy vào cùng một môi trường là hai workflow đua nhau</span></div>
<div class="kv"><span class="k">deploy BẤT BIẾN (idempotent)</span><span class="v">không phải "thường thì hội tụ" — thật sự bất biến. Từ bài 7.2: <code>concurrency</code> chỉ tuần tự hoá; lần chạy thứ hai không được ghi đè cái lần đầu đẻ ra nếu chúng cùng commit, và không được làm hỏng nếu chúng khác</span></div>
<div class="kv"><span class="k">rollback nằm TRÊN đường deploy</span><span class="v">một lần chạy đỏ trong production phải đẻ ra trạng thái tốt-đã-biết trước đó, TỰ ĐỘNG. Nếu không, mọi cuộc deploy hỏng là một sự cố, và mọi cuộc deploy là một quyết định chấp nhận sự cố</span></div>
</div>

<div class="callout ok">
<p><strong>Deploy thủ công KHÔNG phải câu trả lời ở mọi nơi.</strong> Một kho có cả ba tính chất bên trên thì HOÀN TOÀN nên push-để-deploy — lợi ích vận hành có thật, và cái workflow "push một commit là nó lên" là thứ khiến nhiều đội làm nhanh. Kho này CHƯA có mấy tính chất ấy; đáp trả trung thực là NGƯNG deploy tự động cho tới khi có, và tài liệu trung thực là câu CLAUDE.md "Deploying stays a script you run".</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — thêm <code>concurrency:</code> rồi nghĩ vấn đề đã xong.</strong> Bài 7.2 đã đo cái <code>concurrency</code> làm gì — nó xếp hàng, không ép được thứ tự giữa các workflow KHÁC NHAU trừ khi chúng cùng một nhóm, và nó không làm cái gì thành bất biến. Cả hai sự cố tháng Bảy đều dính HAI workflow <em>KHÁC NHAU</em>, nên một khối concurrency theo từng workflow không ngăn được. Dùng chung một nhóm giữa các workflow thì làm được; đảm bảo hai người không bao giờ kích hoạt các lần chạy chồng nhau thì không.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Push-để-deploy không bất an một cách nguyên thuỷ, nhưng nó ĐÒI ba tính chất mà kho này không có — MỘT workflow deploy, deploy BẤT BIẾN, ROLLBACK tự động — nên sau HAI sự cố trong một tuần, cách vá quan sát được là GỠ kích hoạt tự động và mã hoá cuộc deploy thành một SCRIPT mà một người CHẠY CÓ CHỦ Ý.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — chính sách deploy trong kho này</span><span class="lc-sub">phần <code>Docker &amp; Deploy</code>, gồm câu "Deploying stays a script you run, never a side effect of pushing" và hai sự cố có ngày tháng đẻ ra quy tắc ấy.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — jobs.&lt;id&gt;.concurrency xuyên workflow</span><span class="lc-sub">docs.github.com/en/actions/using-jobs/using-concurrency — dạng chia sẻ nhóm <em>CÓ THỂ</em> phối hợp hai workflow, và các lý do nó vẫn KHÔNG đủ tự nó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Accelerate — deployment frequency và change fail rate</span><span class="lc-sub">itrevolution.com/product/accelerate/ — bằng chứng ngành cho push-để-deploy ở quy mô lớn, gồm cả nhận xét rằng kỷ luật vận hành nó ĐÒI là một khoản đầu tư lớn hơn CHÍNH cái kích hoạt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — script deploy kho này thật sự dùng</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — <code>deploy-nha.sh</code>, các bài smoke test, và đường lùi khi máy nhà không có sẵn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — cuộc đua tái tạo và container mang tên</span><span class="lc-sub">/courses/docker/learn${REF} — cơ chế "container name already in use" cụ thể đứng sau sự cố thứ hai, và việc ghim tên project né được nó bên trong MỘT workflow.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — Build here, ship there, and where things should run|||9.2 — Dựng ở đây, ship ở kia, và các bước nên chạy ở đâu',
      slug: 'ga-9-2-o-dau',
      type: 'VIDEO',
      description: 'CI dựng ảnh và đẩy lên registry; VPS chỉ kéo về và tráo. Đo trên kho này: `deploy-nha.sh` dựng ở nhà rồi đẩy — nhanh gấp ~3× cách dựng trên VPS. Kèm bài học đau: build XANH không có nghĩa là ảnh CHẠY được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Build here, ship there, and where things should run</h2>
<p class="lead">A deploy pipeline is a sequence of steps happening on different machines. The interesting question is not "how do we automate it" but "which step runs where", and this repository&#39;s own history contains a measurement that answers it — plus one dated case where the same answer led to a seven-minute outage.</p>

<h3>The three places a step can run</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">a CI runner</span><span class="lz-t">clean, disposable, standard</span><span class="lz-d">the machine 4.1 measured: 11.3% of step time is other people&#39;s code, and every job gets a fresh instance</span></div>
<div class="lz-step"><span class="lz-k">a build server (or the developer’s machine)</span><span class="lz-t">specialised, warm caches, real hardware</span><span class="lz-d">this repository&#39;s "home machine": 12 cores, 31 GB. Kept because parallel builds on the VPS died from OOM</span></div>
<div class="lz-step"><span class="lz-k">the target — the VPS</span><span class="lz-t">production, with all the state that means</span><span class="lz-d">the postgres data lives here. Every second of build time on this machine is a second stolen from serving users</span></div>
</div>

<h3>The measurement in this repository&#39;s history</h3>
<p>CLAUDE.md records why <code>deploy-nha.sh</code> replaced the old build-on-VPS path in August 2026:</p>

<div class="out">deploy-nha.sh (may nha dung, VPS chi trao):
  build song song o nha  ~3-6 phut
  VPS chi keo anh ve va trao (khong build)

deploy.sh (build tren VPS):
  build tuan tu (song song bi OOM giet, exit 137)
  ~15 phut, cache build phinh 7,6 GB tren dia chua postgres</div>

<div class="callout warn">
<p><strong>The single most important word in that block is "postgres".</strong> The VPS build was competing for disk with the database. On 2026-08-18 the disk dropped to 1.8 GB free during a <code>next build</code> and the deploy failed with <code>no space left on device</code>. A build server that shares disk with production is a build server that can take production down by trying to be helpful.</p>
</div>

<h3>What each place is good at, and what it costs</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CI runner · used for</span><span class="v">tests, linters, image builds when you have not moved past small. Repeatable, throwaway, no persistent state. Chapter 7 measured that macOS is the expensive slot; keep it for what needs macOS</span></div>
<div class="kv"><span class="k">CI runner · limits</span><span class="v">wall-clock is bounded by the platform multipliers, not by capacity. Multiple back-to-back deploys queue behind concurrency, not runners</span></div>
<div class="kv"><span class="k">build server · used for</span><span class="v">the expensive build that CI cannot amortise — the images, the desktop bundles, the datasets. Warm caches survive between runs, so the second build is a fraction of the first</span></div>
<div class="kv"><span class="k">build server · limits</span><span class="v">availability. This repository&#39;s deploy-nha.sh has a fallback path (<code>deploy.sh</code>) for when the home machine is down or the network is cut — and the fallback path exists because the primary one has a real failure mode</span></div>
<div class="kv"><span class="k">the target · used for</span><span class="v">the swap. Pull the pre-built image, restart the container, run migrations, verify. Nothing built here, nothing large downloaded</span></div>
<div class="kv"><span class="k">the target · limits</span><span class="v">it is production. Everything that happens here happens while users are on the site. The rule is: no work here that is not the smallest possible</span></div>
</div>

<h3>The 2026-08-18 outage · seven minutes of 502</h3>
<p>Even with the right places, one line of build script decided which one was authoritative:</p>

<div class="out">18/08/2026 — deploy-nha.sh chay &#96;docker build .&#96; (KHONG -f)
  Default Dockerfile: node:22-alpine (musl)
  Prisma engine: debian-openssl-3.0.x (glibc)
  ⇒ build XANH, day XANH, trao XANH
  ⇒ backend restart vo tan tren VPS
  ⇒ API 502 suot 7 phut</div>

<div class="callout warn">
<p><strong>Build succeeded, image ran nowhere.</strong> The build machine and the deploy machine agreed the image was valid; the runtime disagreed. The lesson recorded in CLAUDE.md is dry and specific — a green build does not mean the image runs — and an acceptance check for libc ↔ engine mismatch was added <em>before the push</em>. Not at deploy, at build. Different place, different guarantee.</p>
</div>

<h3>The three-place recipe</h3>
<pre><code><span class="tok-comment"># o nha (hoac tren mot build server co cache am):</span>
docker build -f Dockerfile.backend -t ghcr.io/&lt;owner&gt;/backend:\$SHA .
docker build -f Dockerfile.frontend -t ghcr.io/&lt;owner&gt;/frontend:\$SHA ./frontend
docker push ghcr.io/&lt;owner&gt;/backend:\$SHA
docker push ghcr.io/&lt;owner&gt;/frontend:\$SHA

<span class="tok-comment"># o VPS (rsync mot vai tep + ssh mot vai lenh):</span>
docker pull ghcr.io/&lt;owner&gt;/backend:\$SHA
docker pull ghcr.io/&lt;owner&gt;/frontend:\$SHA
docker compose up -d --no-deps --no-build backend frontend
docker exec backend npx prisma migrate deploy
curl -f https://api/health || rollback</code></pre>

<div class="callout ok">
<p><strong>Note the <code>--no-build</code> on the VPS side, which is doing real work.</strong> Without it, <code>docker compose up</code> is allowed to build if it thinks it needs to, and the moment that happens the target is now a build server too, competing with itself for disk. The flag is one word and it removes an entire failure mode.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — the deploy that only tests itself.</strong> A deploy script that hits <code>/health</code> and considers a 200 sufficient proves that <em>the router mounted</em>. It does not prove that a route this deploy actually changed still works. CLAUDE.md documents an incident from 2026-07-02 where the entire <code>/api/v1/gifs</code> route was missing from a stale image and <code>/health</code> was fine. This repository&#39;s deploy script now checks core routes (401 or 200 = mounted; 404 = stale build) — a specific, cheap test that catches a specific, expensive failure.</p>
</div>

<h3>The general question, stated once</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">the question</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">what does this step need that only exists in one place?</span><span class="lz-nsub">a specific version of Xcode, the production database, a signed certificate, a warm cache — each is a constraint that pins the step to a place</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">the answer</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">put it in that place, and nothing else</span><span class="lz-nsub">everything else runs somewhere disposable. The target executes only what must happen against real state — the swap, the migration, the verify</span></div></div>
</div>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Build where machines are cheap and disk is separate, ship a pre-built artifact, and let the target do only the tiny amount of work that requires being the target — because the day the build server tries to be helpful, the target learns it does not have disk to spare.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — deploy-nha.sh versus deploy.sh, and the disk-full incident</span><span class="lc-sub">the dated notes for both scripts, including the observation that the build cache once grew to 7.6 GB on the same disk as Postgres, and the libc/engine mismatch outage.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker/build-push-action — build once, push, use everywhere</span><span class="lc-sub">github.com/docker/build-push-action — the standard CI-side of the recipe above, with buildx caching that makes the image build cheap after the first run.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Compose — --no-build and pull_policy</span><span class="lc-sub">docs.docker.com/compose/reference/up — the flags that make sure compose on the target does exactly what it is told, and no more.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — deploy-nha.sh in full</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the whole script, the smoke tests, and the recovery procedure for the orphan-image case measured above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — musl versus glibc, and the build that ran nowhere</span><span class="lc-sub">/courses/docker/learn${REF} — the specific mismatch behind the 2026-08-18 outage, and the one-line acceptance test that would have caught it before the swap.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Dựng ở đây, ship ở kia, và các bước NÊN chạy ở đâu</h2>
<p class="lead">Một đường ống deploy là một chuỗi các bước xảy ra ở nhiều CỖ MÁY khác nhau. Câu hỏi thú vị không phải "chúng ta tự động hoá nó thế nào" mà là "bước nào chạy ở đâu", và chính lịch sử kho này chứa một phép đo trả lời được — kèm MỘT ca có ngày tháng nơi CÙNG cái đáp án dẫn tới bảy phút ngừng dịch vụ.</p>

<h3>Ba nơi mà một bước có thể chạy</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">một runner CI</span><span class="lz-t">sạch, dùng một lần, tiêu chuẩn</span><span class="lz-d">cỗ máy bài 4.1 đã đo: 11,3% thời gian bước là mã người khác, và mỗi job được một instance mới</span></div>
<div class="lz-step"><span class="lz-k">một máy dựng (hoặc máy người viết)</span><span class="lz-t">chuyên dụng, cache ẤM, phần cứng thật</span><span class="lz-d">"máy nhà" của kho này: 12 nhân, 31 GB. Giữ vì dựng song song trên VPS chết do OOM</span></div>
<div class="lz-step"><span class="lz-k">đích — VPS</span><span class="lz-t">production, với TẤT CẢ trạng thái đi kèm</span><span class="lz-d">dữ liệu postgres nằm ở đây. MỖI giây thời gian dựng trên cỗ máy này là một giây đánh cắp từ việc phục vụ người dùng</span></div>
</div>

<h3>Phép đo trong lịch sử kho này</h3>
<p>CLAUDE.md ghi rõ vì sao <code>deploy-nha.sh</code> thay đường build-trên-VPS cũ vào tháng 8/2026:</p>

<div class="out">deploy-nha.sh (may nha dung, VPS chi trao):
  build song song o nha  ~3-6 phut
  VPS chi keo anh ve va trao (khong build)

deploy.sh (build tren VPS):
  build tuan tu (song song bi OOM giet, exit 137)
  ~15 phut, cache build phinh 7,6 GB tren dia chua postgres</div>

<div class="callout warn">
<p><strong>Từ quan trọng nhất trong khối trên là "postgres".</strong> Cuộc dựng trên VPS đang tranh giành ĐĨA với cơ sở dữ liệu. Ngày 2026-08-18 đĩa tụt xuống còn 1,8 GB trống trong lúc <code>next build</code> chạy và deploy hỏng với <code>no space left on device</code>. Một máy dựng CHIA SẺ ĐĨA với production là một máy dựng có thể LÀM CHẾT production khi cố tỏ ra hữu ích.</p>
</div>

<h3>Mỗi nơi tốt vì cái gì, và tốn gì</h3>
<div class="kv-grid">
<div class="kv"><span class="k">runner CI · dùng cho</span><span class="v">tests, linter, dựng ảnh KHI bạn chưa vượt qua mức nhỏ. Lặp lại được, dùng một lần, không trạng thái bền. Chương 7 đo được macOS là slot đắt; giữ nó cho cái CẦN macOS</span></div>
<div class="kv"><span class="k">runner CI · giới hạn</span><span class="v">thời gian đồng hồ bị chặn bởi hệ số nền tảng, không bởi năng lực. Nhiều cuộc deploy liên tiếp xếp hàng sau concurrency, không sau runner</span></div>
<div class="kv"><span class="k">máy dựng · dùng cho</span><span class="v">cuộc dựng ĐẮT mà CI không phân bổ được — các ảnh, các bundle desktop, các bộ dữ liệu. Cache ẤM sống qua các lần chạy, nên bản dựng thứ hai chỉ bằng một phần bản đầu</span></div>
<div class="kv"><span class="k">máy dựng · giới hạn</span><span class="v">tính SẴN CÓ. deploy-nha.sh của kho này có đường LÙI (<code>deploy.sh</code>) cho lúc máy nhà tắt hoặc mất mạng — và đường lùi tồn tại VÌ đường chính có kiểu hỏng thật</span></div>
<div class="kv"><span class="k">đích · dùng cho</span><span class="v">phần TRÁO. Kéo ảnh đã-dựng-sẵn về, khởi động lại container, chạy migration, kiểm. KHÔNG dựng gì ở đây, KHÔNG tải gì lớn</span></div>
<div class="kv"><span class="k">đích · giới hạn</span><span class="v">nó là PRODUCTION. Mọi thứ xảy ra ở đây xảy ra trong khi người dùng đang trên site. Quy tắc là: không có việc nào ở đây mà không phải việc NHỎ NHẤT CÓ THỂ</span></div>
</div>

<h3>Sự cố 2026-08-18 · bảy phút 502</h3>
<p>Ngay cả khi ĐÚNG các chỗ, một dòng trong script dựng đã quyết định NƠI NÀO là nguồn xác thực:</p>

<div class="out">18/08/2026 — deploy-nha.sh chay &#96;docker build .&#96; (KHONG -f)
  Default Dockerfile: node:22-alpine (musl)
  Prisma engine: debian-openssl-3.0.x (glibc)
  ⇒ build XANH, day XANH, trao XANH
  ⇒ backend restart vo tan tren VPS
  ⇒ API 502 suot 7 phut</div>

<div class="callout warn">
<p><strong>Build thành công, ảnh KHÔNG CHẠY được ở đâu.</strong> Máy dựng và máy deploy ĐỒNG Ý rằng ảnh hợp lệ; runtime thì KHÔNG. Bài học ghi trong CLAUDE.md khô khan và cụ thể: "build xanh không có nghĩa là ảnh chạy được" — và một phép kiểm nghiệm thu cho libc ↔ engine không khớp đã được thêm <em>TRƯỚC lúc đẩy</em>. Không phải lúc deploy, mà lúc dựng. Khác chỗ, khác bảo đảm.</p>
</div>

<h3>Công thức ba-chỗ</h3>
<pre><code><span class="tok-comment"># o nha (hoac tren mot build server co cache am):</span>
docker build -f Dockerfile.backend -t ghcr.io/&lt;owner&gt;/backend:\$SHA .
docker build -f Dockerfile.frontend -t ghcr.io/&lt;owner&gt;/frontend:\$SHA ./frontend
docker push ghcr.io/&lt;owner&gt;/backend:\$SHA
docker push ghcr.io/&lt;owner&gt;/frontend:\$SHA

<span class="tok-comment"># o VPS (rsync mot vai tep + ssh mot vai lenh):</span>
docker pull ghcr.io/&lt;owner&gt;/backend:\$SHA
docker pull ghcr.io/&lt;owner&gt;/frontend:\$SHA
docker compose up -d --no-deps --no-build backend frontend
docker exec backend npx prisma migrate deploy
curl -f https://api/health || rollback</code></pre>

<div class="callout ok">
<p><strong>Để ý <code>--no-build</code> ở phía VPS, đang làm việc THẬT.</strong> Không có nó, <code>docker compose up</code> được phép dựng nếu nó nghĩ nó cần — và khoảnh khắc chuyện đó xảy ra thì cái ĐÍCH giờ cũng là một máy dựng, tranh giành đĩa với chính nó. Cái cờ chỉ một từ và nó GỠ bỏ trọn một kiểu hỏng.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — cuộc deploy CHỈ tự kiểm.</strong> Một script deploy đụng <code>/health</code> rồi coi 200 là đủ chứng minh <em>ROUTER ĐÃ MOUNT</em>. Nó KHÔNG chứng minh rằng một route mà cuộc deploy này thật sự đã đổi vẫn còn CHẠY. CLAUDE.md ghi lại một sự cố 2026-07-02 nơi trọn route <code>/api/v1/gifs</code> vắng mặt khỏi một ảnh CŨ mà <code>/health</code> thì OK. Script deploy của kho này giờ kiểm các route lõi (401 hoặc 200 = mounted; 404 = build cũ) — một phép kiểm cụ thể, rẻ, bắt được một cú hỏng cụ thể, đắt.</p>
</div>

<h3>Câu hỏi tổng quát, phát biểu một lần</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">câu hỏi</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">bước này cần cái gì mà chỉ tồn tại ở MỘT CHỖ?</span><span class="lz-nsub">một phiên bản Xcode cụ thể, cơ sở dữ liệu production, một chứng chỉ đã ký, một cache ấm — mỗi cái là một ràng buộc GHIM bước ấy vào một chỗ</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">câu trả lời</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">đặt nó ở CHỖ ẤY, và không gì khác</span><span class="lz-nsub">mọi thứ khác chạy ở chỗ DÙNG-MỘT-LẦN. Cái ĐÍCH thực thi CHỈ những gì phải xảy ra trước trạng thái thật — tráo, migration, verify</span></div></div>
</div>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Dựng ở nơi cỗ máy rẻ và đĩa TÁCH BIỆT, ship một artifact đã dựng sẵn, và để cái đích LÀM ĐÚNG một khoản việc BÉ TÍ đòi phải là cái đích — bởi cái ngày máy dựng cố tỏ ra hữu ích, cái đích sẽ HỌC ra rằng nó KHÔNG có đĩa để chia sẻ.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — deploy-nha.sh so với deploy.sh, và sự cố hết đĩa</span><span class="lc-sub">các ghi chú có ngày cho cả hai script, gồm "cache build từng phình 7,6GB trên chính cái đĩa chứa Postgres" và sự cố libc/engine không khớp.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">docker/build-push-action — dựng một lần, đẩy, dùng khắp nơi</span><span class="lc-sub">github.com/docker/build-push-action — phía CI tiêu chuẩn của công thức trên, kèm cache buildx làm cho việc dựng ảnh RẺ sau lần đầu.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Docker Compose — --no-build và pull_policy</span><span class="lc-sub">docs.docker.com/compose/reference/up — các cờ đảm bảo compose ở phía đích làm ĐÚNG thứ nó được bảo, không hơn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — deploy-nha.sh đầy đủ</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cả script, các bài smoke test, và quy trình khôi phục cho ca ảnh mồ côi đã đo bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — musl với glibc, và bản dựng chạy được ở ĐÂU</span><span class="lc-sub">/courses/docker/learn${REF} — cái không khớp cụ thể đứng sau sự cố 2026-08-18, và phép nghiệm thu một dòng lẽ ra đã bắt được nó trước lúc tráo.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Rollback, the branch you never take is the branch that is broken|||9.3 — Rollback, cái nhánh bạn không bao giờ đi là cái nhánh đang hỏng',
      slug: 'ga-9-3-rollback',
      type: 'VIDEO',
      description: 'Rollback là cái điều kiện SIT ưa dí vào giữa đêm. Nếu nó chưa từng được đi qua thì nó không hoạt động, chấm hết. Bài này đo cái phương pháp DUY NHẤT khiến rollback đáng tin: cố ý gọi tới nó, ở dev, một cách định kỳ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Rollback, the branch you never take is the branch that is broken</h2>
<p class="lead">Every deploy pipeline has a rollback path in its documentation, and most rollback paths have never been exercised. Lesson 8.2 said something adjacent about tests: a condition that has never been true is a condition you cannot claim works. For rollback the version is stronger, because it is the condition you invoke when everything else is on fire.</p>

<h3>The three real rollback shapes</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">image tag swap</span><span class="lz-lnote">the previous image is still on the registry. <code>docker pull ghcr.io/...:main-\$PREV_SHA</code> then <code>docker compose up -d</code>. This repository&#39;s CLAUDE.md documents an operator recovery of exactly this shape when a bad image was swapped in: 40 seconds instead of 15 minutes to rebuild</span></div>
<div class="lz-layer"><span class="lz-lname">git revert</span><span class="lz-lnote">revert the offending commit, run the normal deploy path. Works when the code is the only thing that broke. Does not work for schema changes — reverting the migration is a separate, harder operation</span></div>
<div class="lz-layer"><span class="lz-lname">snapshot restore</span><span class="lz-lnote">for state: database, uploaded files, config. Different from code rollback in kind and much slower, and often the reason a schema-changing deploy is a one-way door</span></div>
</div>

<h3>The measurement from this repository&#39;s notes</h3>
<div class="out">CLAUDE.md, phan khoi phuc nhanh khi trao trung anh chet:
  ssh vps "docker images -a --filter dangling=true"   <- doi chieu kich thuoc
  ssh vps "docker tag <id> cuonghoangdev-backend:latest"
  ssh vps "cd /opt/... && docker compose up -d --no-build backend"

  ~40 giay, thay vi dung lai 15 phut</div>

<div class="callout ok">
<p><strong>Forty seconds against fifteen minutes.</strong> The old image was still there, orphaned, and re-tagging it and restarting is a rollback in three commands. The reason it worked was the commands were documented before they were needed — the incident produced them, but the documentation is what makes them available at 3am for the next incident.</p>
</div>

<h3>What makes a rollback actually work</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the previous version must still exist</span><span class="v">a registry that garbage-collects too aggressively is a repository whose rollback never worked. Tag by SHA, and keep the last several images regardless of tag policy</span></div>
<div class="kv"><span class="k">schema changes must be backwards-compatible for one deploy</span><span class="v">a migration that drops a column and its code that reads the column are two commits. If you deploy both together, you cannot roll back the code without rolling back the schema — which is a snapshot restore, at production data volume</span></div>
<div class="kv"><span class="k">the runbook fits on one card</span><span class="v">not "check the monitoring dashboard, notify the team, then follow the runbook" — the runbook itself has to be executable at 3am. Three commands, in the order they must be run, is a rollback. Two paragraphs of prose is not</span></div>
<div class="kv"><span class="k">it has been rehearsed</span><span class="v">this is the part almost nobody does, and the reason it is worth doing is that everything else on this list will be wrong the first time</span></div>
</div>

<h3>The two-migration pattern for schema rollback</h3>
<pre><code><span class="tok-comment"># DUNG</span>
1. Add nullable column          -&gt; deploy code that writes it
2. Backfill in the background
3. Make column not-null         -&gt; deploy code that reads it
4. Later, remove old column     -&gt; separate deploy

<span class="tok-comment"># SAI</span>
1. Rename column A to B and change code to read B    -&gt; deploy</code></pre>

<div class="callout warn">
<p><strong>The wrong shape has a rollback that requires restoring the database.</strong> The right shape has a rollback at every step that is just "deploy the previous code" — because each intermediate state is a valid pair of code and schema. The two-migration pattern is more work in the good case and vastly less work in the bad one.</p>
</div>

<h3>Rehearsing it, at the cadence that keeps it working</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">before you need it</span><span class="lz-t">a scheduled roll-forward-and-back on staging</span><span class="lz-d">deploy a known-bad commit deliberately, roll back, deploy the fix. If any step of that sequence fails, the rollback did not work — and you have found out on a Tuesday afternoon rather than at 3am</span></div>
<div class="lz-step"><span class="lz-k">during a real deploy</span><span class="lz-t">the previous SHA in a variable</span><span class="lz-d">the deploy script captures <code>PREV_SHA=\$(docker inspect ...)</code> before the swap. If the swap fails or the health check fails, the same script restores it. Rollback becomes an <em>else</em> branch, not a separate document</span></div>
<div class="lz-step"><span class="lz-k">after a rollback</span><span class="lz-t">a post-mortem that includes "did the rollback work"</span><span class="lz-d">not just "did we recover" — did the rollback path itself do what it was documented to do? A partial success is a rollback that will fail differently next time</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — a rollback that requires the deploying human to be awake.</strong> If the recovery procedure is "SSH to the VPS and run these commands", then the on-call person needs SSH access, needs the runbook, and needs to be conscious. All three fail at the times rollback is most needed. The alternative is the deploy script encoding the rollback as its own else branch — the first two failures still stop you from responding, but the third one is automated.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A rollback works when it has been used deliberately, and every rollback path this repository documents was written after an incident that used it — which is a fine way to end up with a working rollback and a slow way to find out you did not have one.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — the &quot;Rollback procedure&quot; section</span><span class="lc-sub">the operator recovery steps for the orphan-image case, and the explicit &quot;NEVER git push --force to roll back&quot; rule that is the specific bad idea it saw before writing this down.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — release engineering</span><span class="lc-sub">sre.google/sre-book/release-engineering/ — the industry version of the two-migration pattern above and the "rehearse the rollback" discipline, with the argument for why release engineering is a specialised skill rather than a task.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — expand and contract migrations</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/data-migration — the specific pattern applied to Prisma&#39;s migration workflow, which is what this repository uses.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the rollback that took forty seconds</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the specific incident, the commands used, and the documentation change that came out of it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — backwards-compatible schema changes</span><span class="lc-sub">/courses/postgresql/learn${REF} — the two-migration pattern in more detail, including online index creation and the specific operations that require table locks.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Rollback, cái nhánh bạn không bao giờ đi là cái nhánh đang hỏng</h2>
<p class="lead">Mọi đường ống deploy đều có một đường rollback trong tài liệu, và phần lớn đường rollback CHƯA TỪNG được đi qua. Bài 8.2 nói một điều tương tự về test: một điều kiện chưa từng đúng là một điều kiện bạn KHÔNG khẳng định nó chạy được. Với rollback thì phiên bản mạnh hơn, bởi nó là ĐIỀU KIỆN bạn gọi tới khi mọi thứ khác đang cháy.</p>

<h3>Ba hình dạng rollback THẬT</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">tráo thẻ ảnh</span><span class="lz-lnote">ảnh cũ vẫn còn trên registry. <code>docker pull ghcr.io/...:main-\$PREV_SHA</code> rồi <code>docker compose up -d</code>. CLAUDE.md của kho này ghi lại một cuộc khôi phục có ĐÚNG hình dạng ấy khi một ảnh xấu bị tráo vào: 40 giây thay vì 15 phút để dựng lại</span></div>
<div class="lz-layer"><span class="lz-lname">git revert</span><span class="lz-lnote">revert commit gây hại, chạy đường deploy bình thường. Chạy được khi MÃ là thứ duy nhất bị hỏng. KHÔNG chạy được với thay đổi schema — revert một migration là một thao tác RIÊNG, khó hơn</span></div>
<div class="lz-layer"><span class="lz-lname">khôi phục snapshot</span><span class="lz-lnote">cho TRẠNG THÁI: cơ sở dữ liệu, tệp đã tải lên, cấu hình. Khác rollback mã về BẢN CHẤT và chậm hơn nhiều, và thường là lý do một cuộc deploy có đổi schema là một CÁNH CỬA MỘT CHIỀU</span></div>
</div>

<h3>Phép đo từ ghi chú của kho này</h3>
<div class="out">CLAUDE.md, phan khoi phuc nhanh khi trao trung anh chet:
  ssh vps "docker images -a --filter dangling=true"   <- doi chieu kich thuoc
  ssh vps "docker tag <id> cuonghoangdev-backend:latest"
  ssh vps "cd /opt/... && docker compose up -d --no-build backend"

  ~40 giay, thay vi dung lai 15 phut</div>

<div class="callout ok">
<p><strong>Bốn mươi giây so với mười lăm phút.</strong> Ảnh cũ vẫn còn ở đó, mồ côi, và gắn lại thẻ rồi khởi động lại là một cuộc rollback trong BA lệnh. Lý do nó chạy được là mấy câu lệnh ấy đã được TÀI LIỆU HOÁ TRƯỚC khi cần — sự cố đẻ ra chúng, nhưng chính CÁI TÀI LIỆU mới là thứ khiến chúng SẴN CÓ lúc 3 giờ sáng cho sự cố kế.</p>
</div>

<h3>Cái gì khiến một cuộc rollback thật sự chạy được</h3>
<div class="kv-grid">
<div class="kv"><span class="k">phiên bản trước phải CÒN tồn tại</span><span class="v">một registry thu gom rác quá hăng là một kho mà rollback CHƯA BAO GIỜ hoạt động. Gắn thẻ theo SHA, và giữ vài ảnh gần nhất BẤT KỂ chính sách thẻ</span></div>
<div class="kv"><span class="k">thay đổi schema phải TƯƠNG THÍCH NGƯỢC trong một cuộc deploy</span><span class="v">một migration xoá một cột và mã đọc cột ấy là HAI commit. Nếu bạn deploy chúng cùng nhau, bạn không rollback được MÃ mà không rollback SCHEMA — mà đó là khôi phục snapshot, ở volume dữ liệu production</span></div>
<div class="kv"><span class="k">runbook vừa MỘT THẺ</span><span class="v">không phải "kiểm bảng giám sát, thông báo đội, rồi làm theo runbook" — chính cái runbook phải THỰC THI ĐƯỢC lúc 3 giờ sáng. Ba lệnh, theo thứ tự phải chạy, LÀ một cuộc rollback. Hai đoạn văn xuôi thì KHÔNG</span></div>
<div class="kv"><span class="k">nó ĐÃ ĐƯỢC DIỄN TẬP</span><span class="v">đây là phần gần như không ai làm, và lý do đáng làm là mọi thứ khác trong danh sách này SẼ SAI ở lần đầu</span></div>
</div>

<h3>Khuôn mẫu HAI MIGRATION cho rollback schema</h3>
<pre><code><span class="tok-comment"># DUNG</span>
1. Add nullable column          -&gt; deploy code that writes it
2. Backfill in the background
3. Make column not-null         -&gt; deploy code that reads it
4. Later, remove old column     -&gt; separate deploy

<span class="tok-comment"># SAI</span>
1. Rename column A to B and change code to read B    -&gt; deploy</code></pre>

<div class="callout warn">
<p><strong>Hình dạng SAI có một cuộc rollback đòi phải KHÔI PHỤC cơ sở dữ liệu.</strong> Hình dạng ĐÚNG có rollback ở MỌI bước và nó chỉ là "deploy mã trước đó" — bởi mỗi trạng thái trung gian là một CẶP mã và schema hợp lệ. Khuôn mẫu hai-migration TỐN nhiều công hơn trong ca tốt và tốn ÍT hơn HẲN trong ca xấu.</p>
</div>

<h3>Diễn tập nó, ở nhịp GIỮ nó hoạt động</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">trước khi bạn cần</span><span class="lz-t">một cuộc lăn-tới-rồi-lăn-lui theo lịch trên staging</span><span class="lz-d">CỐ Ý deploy một commit đã biết là xấu, rollback, deploy bản vá. Nếu bất kỳ bước nào trong chuỗi ấy HỎNG, rollback không chạy được — và bạn tìm ra vào một chiều thứ Ba chứ không phải lúc 3 giờ sáng</span></div>
<div class="lz-step"><span class="lz-k">trong một cuộc deploy thật</span><span class="lz-t">SHA trước đó trong một biến</span><span class="lz-d">script deploy bắt <code>PREV_SHA=\$(docker inspect ...)</code> TRƯỚC lúc tráo. Nếu tráo hỏng hoặc phép kiểm sức khoẻ hỏng, CÙNG script khôi phục nó. Rollback trở thành một nhánh <em>else</em>, không phải một tài liệu riêng</span></div>
<div class="lz-step"><span class="lz-k">sau một cuộc rollback</span><span class="lz-t">post-mortem có câu "rollback có chạy đúng không"</span><span class="lz-d">không chỉ là "chúng ta có khôi phục được không" — chính đường rollback có làm ĐÚNG thứ nó được ghi trong tài liệu không? Một thành công một phần là một cuộc rollback SẼ HỎNG THEO CÁCH KHÁC ở lần sau</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một cuộc rollback đòi CON NGƯỜI đang tỉnh táo.</strong> Nếu quy trình khôi phục là "SSH vào VPS rồi chạy mấy lệnh này", thì người trực on-call cần quyền SSH, cần runbook, và cần TỈNH. Cả ba đều VỠ vào những lúc rollback CẦN NHẤT. Cách thay thế là script deploy MÃ HOÁ rollback thành nhánh else của chính nó — hai cú vỡ đầu vẫn ngăn bạn phản ứng, nhưng cú vỡ thứ ba đã được TỰ ĐỘNG.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một cuộc rollback CHẠY khi nó đã được DÙNG có chủ ý, và mọi đường rollback mà kho này ghi lại đều được viết SAU một sự cố đã dùng nó — đó là một cách ổn để có được một cuộc rollback chạy được, và là một cách CHẬM để phát hiện ra bạn KHÔNG có nó.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">CLAUDE.md — phần "Rollback procedure"</span><span class="lc-sub">các bước khôi phục của người vận hành cho ca ảnh mồ côi, và quy tắc TƯỜNG MINH "NEVER git push --force to roll back" tức là cụ thể cái ý tưởng xấu nó đã thấy trước khi ghi câu này xuống.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — release engineering</span><span class="lc-sub">sre.google/sre-book/release-engineering/ — bản ngành công nghiệp của khuôn mẫu hai-migration bên trên và kỷ luật "diễn tập rollback", kèm lập luận vì sao kỹ thuật phát hành là một KỸ NĂNG CHUYÊN BIỆT chứ không phải một tác vụ.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prisma — expand and contract migrations</span><span class="lc-sub">prisma.io/docs/orm/prisma-migrate/workflows/data-migration — khuôn mẫu cụ thể áp cho quy trình migration của Prisma, thứ mà kho này đang dùng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — cuộc rollback tốn bốn mươi giây</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — sự cố cụ thể, các câu lệnh đã dùng, và thay đổi tài liệu ra từ nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">PostgreSQL — thay đổi schema tương thích ngược</span><span class="lc-sub">/courses/postgresql/learn${REF} — khuôn mẫu hai-migration chi tiết hơn, gồm tạo index online và các thao tác cụ thể ĐÒI khoá bảng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Environments, and the human as a control|||9.4 — Environment, và CON NGƯỜI như một biện pháp kiểm soát',
      slug: 'ga-9-4-moi-truong',
      type: 'VIDEO',
      description: 'Ở kho này, cổng con người là NÚT bấm. Đó là một biện pháp thật với một tính chất thật — nó vỡ vào ngày có hai người. `environment:` cùng người duyệt là cơ chế SỐNG SÓT được cái ngày ấy, và nó tốn một dòng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Environments, and the human as a control</h2>
<p class="lead">Lesson 6.2 measured that 0 of 11 workflows here declare an <code>environment:</code>, and explained why: every deploy is <code>workflow_dispatch</code>, and pressing the button is a human control. This lesson picks up where that stopped, because the human control has a specific and knowable failure mode.</p>

<h3>The human as a control</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">works when</span><span class="lz-lnote">one person deploys at a time and knows whether the previous one finished. This is genuine — 7.2 measured that 9 of 11 workflows have no <code>concurrency:</code> block for exactly this reason</span></div>
<div class="lz-layer"><span class="lz-lname">breaks when</span><span class="lz-lnote">two people deploy at once (races), or one person is asleep and a schedule fires (no oversight), or one person leaves and nobody replaces the knowledge</span></div>
<div class="lz-layer"><span class="lz-lname">the vps-cleanup case</span><span class="lz-lnote"><code>vps-cleanup-weekly.yml</code> has both <code>schedule</code> and <code>workflow_dispatch</code> — so a manual run and a scheduled run genuinely can overlap, and 7.2 named this without measuring what to do about it</span></div>
<div class="lz-layer"><span class="lz-lname">the growth problem</span><span class="lz-lnote">a repository with two contributors has one human control; a repository with twenty has coordination overhead. The button that works at two people is not the same button as at twenty</span></div>
</div>

<h3>What <code>environment:</code> actually adds</h3>
<pre><code>jobs:
  deploy:
    environment:
      name: production
      url: https://cuongthai.com
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      ...</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">required reviewers</span><span class="v">the job waits until a human on the list approves it in the UI. This is the mechanism that survives the trigger changing from <code>workflow_dispatch</code> to <code>push</code>: the approval gate is still there</span></div>
<div class="kv"><span class="k">wait timer</span><span class="v">between five minutes and 43,200 minutes (30 days). Rarely useful for deploys; occasionally useful to hold a deploy for a maintenance window</span></div>
<div class="kv"><span class="k">deployment branches policy</span><span class="v">restrict which branches can deploy to this environment. A production environment that only accepts <code>main</code> catches a wrong-branch deploy that the workflow itself would allow</span></div>
<div class="kv"><span class="k">environment-scoped secrets</span><span class="v">a secret that only exists in this environment. Combined with the branches policy, this means a leaked production key from a fork PR is impossible in principle, not just improbable</span></div>
</div>

<div class="callout ok">
<p><strong>The value of the branches policy is worth stating precisely.</strong> Without it, a workflow with the production secret in <code>secrets.PROD_KEY</code> hands that secret to any workflow file that reads it — including one committed on a branch. With it, the secret is only injected when the deploy targets the production environment, and the environment only accepts <code>main</code>. A commit to a feature branch that reads the secret gets nothing.</p>
</div>

<h3>The pattern for a repository that grew</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">start</span><span class="lz-t">workflow_dispatch, one person</span><span class="lz-d">the current state here. Simple, and the human control is real</span></div>
<div class="lz-step"><span class="lz-k">first hire</span><span class="lz-t">add an environment with the deploy team as reviewers</span><span class="lz-d">the button still exists; approval now requires someone else to see it. No trigger change, one line added</span></div>
<div class="lz-step"><span class="lz-k">move to push</span><span class="lz-t">the environment gate is already in place</span><span class="lz-d">the change from <code>workflow_dispatch</code> to <code>push</code> does not remove any control — the approval step catches every deploy the same way</span></div>
<div class="lz-step"><span class="lz-k">multiple environments</span><span class="lz-t">staging without approval, production with</span><span class="lz-d">the same workflow gates its steps by environment. The staging deploy is fast; the production deploy waits</span></div>
</div>

<h3>What this repository would gain, specifically</h3>
<div class="out">workflow                     ap dung environment: production ?
--------------------------------------------------------------
backend-vps.yml              CO (deploy code)
deploy-ghcr.yml              CO (deploy code + image)
desktop-release.yml          CO (cong bo release)
fix-containers.yml           KHONG (chi khoi phuc)
full-deploy.yml              CO
guard-no-duplicates.yml      KHONG
restart-containers.yml       KHONG
sync-frontend.yml            CO
vps-cleanup-weekly.yml       KHONG (chi don dep)
                             + ban thu tu voi lich cron</div>

<div class="callout">
<p><strong>Five workflows out of eleven touch production and would benefit from an environment gate.</strong> That is a one-line change per workflow with no test overhead — the workflow still runs the same, it just waits for one click first. And the click is the same click somebody is already making with <code>workflow_dispatch</code>, just under a name that survives the trigger changing.</p>
</div>

<h3>The gate that is worth adding first</h3>
<p>Not the required reviewer — the <strong>deployment branches</strong> policy. Setting production to accept only <code>main</code> is a one-line change that catches an entire class of mistake:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">without</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">workflow_dispatch with a branch selector</span><span class="lz-nsub">the deploy UI shows a branch dropdown. Somebody selects a feature branch and clicks Run. Production takes the feature branch</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">with</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">environment restricted to main</span><span class="lz-nsub">the same click, on a non-main branch, fails at the environment gate. No deploy, no rollback needed</span></div></div>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the reviewer who always approves.</strong> A required reviewer who says yes to every deploy provides paperwork, not a gate. The value of the human step is that the human <em>reads</em>: the commit range, the changed files, the migration. If the workflow does not surface those to the approver, the reviewer approves what they cannot see, which is worse than no approval. Include the deploy summary in the workflow — commit range, changed files, migration count — as a comment or a job summary before the environment gate.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> The human pressing a button is a real control today and stops being one the day there are two people or one schedule — and <code>environment:</code> is the mechanism that survives that transition, so the time to add it is <em>before</em> the transition, not after.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment — required reviewers, wait timers, deployment branches policy, and environment-scoped secrets.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reviewing deployments</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/reviewing-deployments — the UI a reviewer sees, and how to include a link, a summary, and inputs so the reviewer can actually judge.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deploying with GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/deployment — the recommended deploy shape overall, including the staging/production split behind the "multiple environments" step above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — the reviewer who cannot see what they approve</span><span class="lc-sub">/courses/authentication/learn${REF} — the general pattern of a control that becomes performative when the reviewer is not shown the object under review.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the staging that catches everything production would</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the environment split argued for above, with the measured case where staging refused a deploy that production would have accepted.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Environment, và CON NGƯỜI như một biện pháp kiểm soát</h2>
<p class="lead">Bài 6.2 đo được 0 trên 11 workflow ở đây khai <code>environment:</code>, và giải thích lý do: mọi deploy là <code>workflow_dispatch</code>, và bấm nút là một biện pháp kiểm soát CON NGƯỜI. Bài này tiếp tục từ chỗ đó dừng, bởi biện pháp kiểm soát con người có một kiểu hỏng CỤ THỂ và BIẾT TRƯỚC ĐƯỢC.</p>

<h3>Con người như một biện pháp kiểm soát</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">chạy được khi</span><span class="lz-lnote">một người deploy tại một thời điểm và BIẾT cái trước đã xong hay chưa. Đây là biện pháp THẬT — bài 7.2 đo được 9 trên 11 workflow không có khối <code>concurrency:</code> đúng vì lý do này</span></div>
<div class="lz-layer"><span class="lz-lname">VỠ khi</span><span class="lz-lnote">hai người deploy cùng lúc (đua nhau), hoặc một người ngủ và một cái lịch nổ (không giám sát), hoặc một người rời đi và không ai thay thế phần kiến thức</span></div>
<div class="lz-layer"><span class="lz-lname">ca vps-cleanup</span><span class="lz-lnote"><code>vps-cleanup-weekly.yml</code> có cả <code>schedule</code> và <code>workflow_dispatch</code> — nên một lượt chạy tay và một lượt chạy theo lịch THẬT SỰ chồng lên nhau được, và bài 7.2 nêu tên chuyện đó mà không đo phải làm gì</span></div>
<div class="lz-layer"><span class="lz-lname">bài toán TĂNG QUY MÔ</span><span class="lz-lnote">một kho hai người đóng góp có MỘT biện pháp con người; một kho hai mươi người có PHÍ TỔN PHỐI HỢP. Cái nút chạy được ở hai người KHÔNG phải cùng nút ở hai mươi người</span></div>
</div>

<h3><code>environment:</code> thật ra thêm gì</h3>
<pre><code>jobs:
  deploy:
    environment:
      name: production
      url: https://cuongthai.com
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      ...</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">người duyệt BẮT BUỘC</span><span class="v">job chờ tới khi một người trong danh sách duyệt trên giao diện. Đây là cơ chế SỐNG SÓT được cái ngày kích hoạt đổi từ <code>workflow_dispatch</code> sang <code>push</code>: cổng phê duyệt vẫn còn</span></div>
<div class="kv"><span class="k">bộ hẹn chờ</span><span class="v">từ năm phút tới 43.200 phút (30 ngày). Hiếm khi hữu ích cho deploy; thỉnh thoảng hữu ích để giữ một cuộc deploy chờ khung bảo trì</span></div>
<div class="kv"><span class="k">chính sách nhánh deploy</span><span class="v">giới hạn nhánh nào deploy được vào environment này. Một environment production chỉ chấp nhận <code>main</code> bắt được một cuộc deploy sai-nhánh mà chính workflow sẽ cho phép</span></div>
<div class="kv"><span class="k">bí mật khoanh theo environment</span><span class="v">một bí mật CHỈ tồn tại trong environment này. Kết hợp với chính sách nhánh, nghĩa là một bí mật production rò từ một PR fork là BẤT KHẢ về nguyên tắc, không chỉ là ít khả năng</span></div>
</div>

<div class="callout ok">
<p><strong>Giá trị của chính sách nhánh đáng phát biểu cho chính xác.</strong> Không có nó, một workflow có bí mật production ở <code>secrets.PROD_KEY</code> TRAO bí mật ấy cho bất kỳ tệp workflow nào đọc nó — kể cả một tệp commit trên một nhánh. Có nó, bí mật chỉ được BƠM VÀO khi deploy nhắm tới environment production, và environment chỉ chấp nhận <code>main</code>. Một commit lên nhánh tính năng đọc bí mật thì nhận CON SỐ KHÔNG.</p>
</div>

<h3>Khuôn mẫu cho một kho ĐÃ LỚN LÊN</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">bắt đầu</span><span class="lz-t">workflow_dispatch, một người</span><span class="lz-d">trạng thái hiện tại ở đây. Đơn giản, và biện pháp con người là THẬT</span></div>
<div class="lz-step"><span class="lz-k">tuyển người đầu</span><span class="lz-t">thêm một environment với đội deploy làm người duyệt</span><span class="lz-d">cái nút vẫn có; phê duyệt giờ ĐÒI ai đó KHÁC nhìn thấy. Không đổi kích hoạt, thêm một dòng</span></div>
<div class="lz-step"><span class="lz-k">chuyển sang push</span><span class="lz-t">cổng environment đã sẵn ở đó</span><span class="lz-d">việc đổi từ <code>workflow_dispatch</code> sang <code>push</code> KHÔNG gỡ biện pháp kiểm soát nào — bước phê duyệt bắt MỌI cuộc deploy theo cùng cách</span></div>
<div class="lz-step"><span class="lz-k">nhiều environment</span><span class="lz-t">staging không phê duyệt, production có</span><span class="lz-d">cùng workflow đặt cổng theo environment. Deploy staging thì nhanh; deploy production thì chờ</span></div>
</div>

<h3>Kho này CỤ THỂ sẽ được gì</h3>
<div class="out">workflow                     ap dung environment: production ?
--------------------------------------------------------------
backend-vps.yml              CO (deploy code)
deploy-ghcr.yml              CO (deploy code + image)
desktop-release.yml          CO (cong bo release)
fix-containers.yml           KHONG (chi khoi phuc)
full-deploy.yml              CO
guard-no-duplicates.yml      KHONG
restart-containers.yml       KHONG
sync-frontend.yml            CO
vps-cleanup-weekly.yml       KHONG (chi don dep)
                             + ban thu tu voi lich cron</div>

<div class="callout">
<p><strong>Năm workflow trên mười một chạm vào production và sẽ hưởng lợi từ một cổng environment.</strong> Đó là thay đổi MỘT DÒNG cho mỗi workflow, không có chi phí test — workflow vẫn chạy y hệt, nó chỉ chờ một cú click trước. Và cú click ấy là CÙNG cú click ai đó đang làm với <code>workflow_dispatch</code>, chỉ dưới một cái tên SỐNG SÓT được cái ngày kích hoạt thay đổi.</p>
</div>

<h3>Cổng đáng thêm ĐẦU TIÊN</h3>
<p>Không phải người duyệt — <strong>chính sách nhánh deploy</strong>. Đặt production chỉ chấp nhận <code>main</code> là thay đổi một dòng bắt được trọn một lớp lỗi:</p>

<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">không có</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">workflow_dispatch với ô chọn nhánh</span><span class="lz-nsub">giao diện deploy hiện danh sách nhánh. Ai đó chọn một nhánh tính năng và bấm Run. Production LẤY nhánh tính năng</span></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">có</span>
<div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">environment giới hạn về main</span><span class="lz-nsub">cùng cú click, trên một nhánh không phải main, HỎNG ở cổng environment. Không deploy, không cần rollback</span></div></div>
</div>
</div>

<div class="pitfall">
<p><strong>Bẫy — người duyệt LUÔN LUÔN duyệt.</strong> Một người duyệt bắt buộc nói CÓ với mọi cuộc deploy đẻ ra giấy tờ, không phải một cái cổng. Giá trị của bước con người là con người ĐỌC: khoảng commit, các tệp đã đổi, cái migration. Nếu workflow không phơi mấy thứ đó cho người duyệt, người duyệt duyệt cái họ KHÔNG nhìn thấy, mà điều đó CÒN TỆ HƠN là không có phê duyệt. Hãy đưa tóm tắt deploy vào workflow — khoảng commit, tệp đã đổi, số migration — dưới dạng bình luận hoặc tóm tắt job TRƯỚC cổng environment.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Con người bấm một cái nút là một biện pháp thật HÔM NAY và THÔI là biện pháp thật vào cái ngày có hai người hoặc một cái lịch — và <code>environment:</code> là cơ chế SỐNG SÓT được cuộc chuyển tiếp ấy, nên thời điểm thêm nó là <em>TRƯỚC</em> cuộc chuyển tiếp, không phải sau.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Using environments for deployment</span><span class="lc-sub">docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment — người duyệt bắt buộc, bộ hẹn chờ, chính sách nhánh deploy, và bí mật khoanh theo environment.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Reviewing deployments</span><span class="lc-sub">docs.github.com/en/actions/managing-workflow-runs/reviewing-deployments — giao diện một người duyệt nhìn thấy, và cách bao gồm một link, một tóm tắt, và các tham số để người duyệt thật sự có thể PHÁN.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Deploying with GitHub Actions</span><span class="lc-sub">docs.github.com/en/actions/deployment — hình dạng deploy được khuyến nghị nói chung, gồm cả cách chia staging/production đứng sau bước "nhiều environment" bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — người duyệt KHÔNG nhìn thấy cái họ duyệt</span><span class="lc-sub">/courses/authentication/learn${REF} — khuôn mẫu tổng quát của một biện pháp kiểm soát trở thành TRÌNH DIỄN khi người duyệt không được xem cái đối tượng đang xét.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — staging bắt được mọi thứ production sẽ bắt</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cách chia environment được lập luận bên trên, kèm ca đo được mà staging từ chối một cuộc deploy mà production sẽ chấp nhận.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Notifications, and the message that says only what happened|||9.5 — Thông báo, và cái tin nhắn chỉ nói ĐÚNG chuyện đã xảy ra',
      slug: 'ga-9-5-thong-bao',
      type: 'VIDEO',
      description: 'Kho này không gửi thông báo deploy. Có lý do: 526 lần chạy ci-lint mà mỗi lần gửi tin thì con người sẽ TẮT thông báo mất. Bài này đo cái ngưỡng tần suất và trả lời câu "gửi cái gì" bằng một mẫu duy nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Notifications, and the message that says only what happened</h2>
<p class="lead">A deploy pipeline that no human sees is a deploy pipeline whose failures are found by users. But a notification for every run is a notification nobody reads, and there is a real number for how many messages a human tolerates before muting the channel.</p>

<h3>The base rate that decides everything</h3>
<div class="out">ci-lint      526 lan chay, 141s TB
desktop-release 85 lan chay
tong repo     2.343 lan chay

neu gui MOT tin nhan CHO MOI lan chay:
  2.343 tin / thoi gian ton tai kho = ~10 tin / ngay

va do la CHUA phan biet xanh voi do.</div>

<div class="callout warn">
<p><strong>Ten messages a day is the threshold at which a channel gets muted.</strong> The precise number varies but the shape does not: humans habituate to notifications, and the habituation happens fast. A channel that ping ten times a day is a channel where the eleventh ping — the one that mattered — is ignored. The best notification is one that arrives rarely and always means something.</p>
</div>

<h3>What earns a message</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a production deploy failed</span><span class="v">the only category that always earns a message. Include the run URL, the commit range, and the failing step&#39;s name — everything an on-call person needs to open the run</span></div>
<div class="kv"><span class="k">a production deploy succeeded</span><span class="v">post to a low-priority channel, not a paging one. Useful for audit and for the developer who wants to see their commit land, harmful when it wakes anyone up</span></div>
<div class="kv"><span class="k">CI on main is red</span><span class="v">a real signal. CI on a PR is red is not — the PR is the notification, and the author already sees it</span></div>
<div class="kv"><span class="k">a scheduled job failed</span><span class="v">if it is the weekly backup or cleanup that has no other observer, this is the only way anybody will know. Different priority from a production deploy</span></div>
<div class="kv"><span class="k">everything else</span><span class="v">silent. A green run is not news, and a PR run is between the developer and CI</span></div>
</div>

<h3>The single-message template</h3>
<pre><code><span class="tok-comment"># tren viec DEPLOY PRODUCTION hong:</span>
- name: Bao Slack neu deploy hong
  if: failure() &amp;&amp; github.ref == 'refs/heads/main'
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}
    SLACK_TITLE: 'Deploy hong: \${{ github.workflow }}'
    SLACK_MESSAGE: |
      Commit: <\${{ github.event.head_commit.url }}|\${{ github.sha }}>
      Bi hong o buoc: \${{ steps.deploy.outcome }}
      Log: \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}
    SLACK_COLOR: danger</code></pre>

<div class="callout">
<p><strong>Read the <code>if:</code> line carefully.</strong> Two conditions have to be true: something failed, and this is a run against <code>main</code>. Without the second, every failed CI run on every PR pings the channel — the noisy version measured above. The condition names the class of failure worth waking somebody up for.</p>
</div>

<h3>The pattern for the deploy summary itself</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">before the deploy</span><span class="lz-t">post the intent</span><span class="lz-d">"deploying \$SHA to production" — one line in a low-priority channel. Useful for the on-call to know a deploy is happening if something starts going wrong</span></div>
<div class="lz-step"><span class="lz-k">after success</span><span class="lz-t">update the same message</span><span class="lz-d">"deploy of \$SHA succeeded in 4m32s". Same channel, same thread — no new notification, just a status update</span></div>
<div class="lz-step"><span class="lz-k">after failure</span><span class="lz-t">page the on-call</span><span class="lz-d">and only after failure. A rollback that started automatically is a status update; a rollback that could not start is another page</span></div>
</div>

<h3>What NOT to send</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">green CI on every PR</span><span class="lz-lnote">the PR is the notification. The status check on the PR page is the message; a Slack copy is redundant, and it teaches the reader to ignore Slack</span></div>
<div class="lz-layer"><span class="lz-lname">every step of a long workflow</span><span class="lz-lnote">one message per workflow, not one per step. A workflow with five notifications is a workflow where the actual failure message is one of five and cannot be spotted</span></div>
<div class="lz-layer"><span class="lz-lname">"the deploy started"</span><span class="lz-lnote">rarely worth a message on its own, especially when a deploy takes six minutes. Include the intent in the pre-deploy message, or skip it — nobody is waiting to be told the deploy started</span></div>
<div class="lz-layer"><span class="lz-lname">a per-run digest</span><span class="lz-lnote">a bot summarising the last ten runs at midnight is often more useful than ten individual pings. Different mechanism, different channel, and the recipient does not need to acknowledge each one</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the notification that has no context.</strong> "CI failed on main" with a run URL and nothing else forces the recipient to open a browser, wait for it to load, and read the log — the exact thing the notification was meant to alert them to. Include the failing step&#39;s name, the exit code from 8.1, and the commit URL. Then the message on somebody&#39;s phone is enough to know whether it needs the on-call to log in or can wait until morning.</p>
</div>

<h3>What this repository does today</h3>
<div class="out">grep 'SLACK\\|DISCORD\\|EMAIL\\|notif' .github/workflows/*.yml    -> 0 matches

khong workflow nao gui thong bao. Ai dung ma soi ket qua.
CLAUDE.md quy dinh nguoi vien hanh chay &#96;bash deploy-nha.sh&#96; va CHO TAY ma xac nhan.</div>

<div class="callout ok">
<p><strong>Zero notifications is a defensible position when zero workflows deploy automatically.</strong> The human running <code>deploy-nha.sh</code> is watching the terminal — the deploy script itself is the notification channel, and its output is streaming to the operator&#39;s screen. That reasoning holds as long as the trigger is <code>workflow_dispatch</code> plus a human. It stops holding the day a schedule fires a deploy at 3am, or the day two people are deploying and the second one needs to know the first is still running.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A notification is a message that has to be worth interrupting somebody for, and the only way to keep it worth it is to send fewer of them — starting with zero, adding one when a production deploy fails, and stopping there unless a specific gap in the operator&#39;s workflow demands more.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Notifications for workflow runs</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/notifications-for-workflow-runs — the built-in email and web notifications, and the settings that turn per-run pings off.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rtCamp/action-slack-notify</span><span class="lc-sub">github.com/rtCamp/action-slack-notify — a working Slack action with the fields worth setting, and a README that documents the payload shape.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Being On-Call</span><span class="lc-sub">sre.google/sre-book/being-on-call/ — the industry treatment of paging thresholds, alert fatigue, and the discipline of "every page should be actionable".</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — the smoke test that pages nobody</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the deploy script&#39;s built-in checks, which is where this repository&#39;s current notification mechanism lives.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — the alert that trained you to ignore alerts</span><span class="lc-sub">/courses/authentication/learn${REF} — a security case of the same shape: too many warnings and the important one is invisible.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Thông báo, và cái tin nhắn chỉ nói ĐÚNG chuyện đã xảy ra</h2>
<p class="lead">Một đường ống deploy không có ai xem là một đường ống mà các cú hỏng được TÌM RA bởi NGƯỜI DÙNG. Nhưng thông báo cho MỖI lần chạy là thông báo không ai đọc, và có một con số THẬT cho bao nhiêu tin nhắn một con người CHỊU ĐƯỢC trước khi tắt cả kênh.</p>

<h3>Con số nền quyết định mọi thứ</h3>
<div class="out">ci-lint      526 lan chay, 141s TB
desktop-release 85 lan chay
tong repo     2.343 lan chay

neu gui MOT tin nhan CHO MOI lan chay:
  2.343 tin / thoi gian ton tai kho = ~10 tin / ngay

va do la CHUA phan biet xanh voi do.</div>

<div class="callout warn">
<p><strong>Mười tin một ngày là ngưỡng mà một kênh bị TẮT.</strong> Con số chính xác thay đổi nhưng HÌNH DẠNG thì không: con người quen với thông báo, và sự quen ấy xảy ra NHANH. Một kênh ping mười lần một ngày là một kênh mà cái ping thứ mười một — cái CÓ NGHĨA — bị bỏ qua. Thông báo tốt nhất là thông báo tới HIẾM và LUÔN có ý nghĩa.</p>
</div>

<h3>Cái gì XỨNG ĐÁNG một tin nhắn</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một cuộc deploy production HỎNG</span><span class="v">hạng mục DUY NHẤT luôn xứng đáng một tin. Bao gồm URL lần chạy, khoảng commit, và tên bước hỏng — mọi thứ một người on-call cần để MỞ lần chạy</span></div>
<div class="kv"><span class="k">một cuộc deploy production THÀNH CÔNG</span><span class="v">đăng vào một kênh ƯU TIÊN THẤP, không phải kênh paging. Hữu ích để KIỂM TOÁN và cho lập trình viên muốn thấy commit của họ HẠ CÁNH, có HẠI khi nó đánh thức ai đó</span></div>
<div class="kv"><span class="k">CI trên main ĐỎ</span><span class="v">một tín hiệu thật. CI trên một PR đỏ thì KHÔNG — cái PR là thông báo, và tác giả đã thấy rồi</span></div>
<div class="kv"><span class="k">một job theo lịch hỏng</span><span class="v">nếu nó là backup hằng tuần hay cleanup không có người quan sát khác, đây là cách DUY NHẤT ai đó BIẾT được. Ưu tiên khác với một cuộc deploy production</span></div>
<div class="kv"><span class="k">mọi thứ khác</span><span class="v">IM LẶNG. Một lần chạy XANH không phải tin tức, và một lần chạy PR là chuyện giữa lập trình viên và CI</span></div>
</div>

<h3>Mẫu tin nhắn ĐƠN LẺ</h3>
<pre><code><span class="tok-comment"># tren viec DEPLOY PRODUCTION hong:</span>
- name: Bao Slack neu deploy hong
  if: failure() &amp;&amp; github.ref == 'refs/heads/main'
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}
    SLACK_TITLE: 'Deploy hong: \${{ github.workflow }}'
    SLACK_MESSAGE: |
      Commit: <\${{ github.event.head_commit.url }}|\${{ github.sha }}>
      Bi hong o buoc: \${{ steps.deploy.outcome }}
      Log: \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}
    SLACK_COLOR: danger</code></pre>

<div class="callout">
<p><strong>Đọc kỹ cái dòng <code>if:</code>.</strong> Hai điều kiện phải đúng: có thứ gì hỏng, và đây là lần chạy trên <code>main</code>. Không có cái thứ hai, mọi lần chạy CI hỏng trên mọi PR ping cả kênh — phiên bản ồn ào đã đo bên trên. Cái điều kiện gọi tên LỚP cú hỏng đáng đánh thức ai đó.</p>
</div>

<h3>Khuôn mẫu cho chính cái TÓM TẮT DEPLOY</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">TRƯỚC lúc deploy</span><span class="lz-t">đăng ý định</span><span class="lz-d">"đang deploy \$SHA lên production" — một dòng ở kênh ƯU TIÊN THẤP. Hữu ích để người on-call BIẾT một cuộc deploy đang xảy ra nếu có gì bắt đầu sai</span></div>
<div class="lz-step"><span class="lz-k">SAU khi thành công</span><span class="lz-t">CẬP NHẬT chính cái tin đó</span><span class="lz-d">"deploy \$SHA đã xong trong 4m32s". Cùng kênh, cùng thread — không có thông báo mới, chỉ một cập nhật trạng thái</span></div>
<div class="lz-step"><span class="lz-k">SAU khi hỏng</span><span class="lz-t">PAGE người on-call</span><span class="lz-d">và CHỈ sau khi hỏng. Một rollback đã bắt đầu tự động là một cập nhật trạng thái; một rollback không khởi động được là một cú page KHÁC</span></div>
</div>

<h3>Cái KHÔNG được gửi</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">CI xanh trên MỌI PR</span><span class="lz-lnote">cái PR là thông báo. Ô kiểm trạng thái trên trang PR là tin nhắn; một bản chép sang Slack là DƯ THỪA, và nó dạy người đọc BỎ QUA Slack</span></div>
<div class="lz-layer"><span class="lz-lname">mọi bước của một workflow dài</span><span class="lz-lnote">một tin cho MỘT workflow, không phải một tin cho MỘT bước. Một workflow với năm thông báo là một workflow mà cái tin hỏng THẬT là một trong năm và không nhận ra được</span></div>
<div class="lz-layer"><span class="lz-lname">"deploy đã bắt đầu"</span><span class="lz-lnote">hiếm khi đáng một tin riêng, đặc biệt khi một cuộc deploy mất sáu phút. Đưa ý định vào tin nhắn TRƯỚC-deploy, hoặc bỏ đi — không ai đang chờ để được BÁO là deploy đã bắt đầu</span></div>
<div class="lz-layer"><span class="lz-lname">một bản tổng hợp theo LẦN CHẠY</span><span class="lz-lnote">một bot tóm tắt mười lần chạy gần nhất vào nửa đêm thường hữu ích hơn mười cú ping riêng lẻ. Cơ chế khác, kênh khác, và người nhận không phải thừa nhận từng cái</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — thông báo KHÔNG có ngữ cảnh.</strong> "CI hỏng trên main" kèm một URL lần chạy và không gì khác BUỘC người nhận mở một trình duyệt, chờ nó tải, và ĐỌC log — đúng thứ mà cái thông báo được thiết kế để CẢNH BÁO họ. Bao gồm tên bước hỏng, mã thoát từ bài 8.1, và URL commit. Rồi cái tin nhắn trên điện thoại ai đó đủ để BIẾT nó có cần người on-call đăng nhập hay có thể đợi tới sáng.</p>
</div>

<h3>Kho này hôm nay làm gì</h3>
<div class="out">grep 'SLACK\\|DISCORD\\|EMAIL\\|notif' .github/workflows/*.yml    -> 0 matches

khong workflow nao gui thong bao. Ai dung ma soi ket qua.
CLAUDE.md quy dinh nguoi vien hanh chay &#96;bash deploy-nha.sh&#96; va CHO TAY ma xac nhan.</div>

<div class="callout ok">
<p><strong>Không thông báo là một vị thế BẢO VỆ ĐƯỢC khi không workflow nào deploy tự động.</strong> Con người chạy <code>deploy-nha.sh</code> đang xem cái terminal — chính script deploy là kênh thông báo, và đầu ra của nó đang chảy vào màn hình người vận hành. Lý lẽ ấy đứng vững chừng nào kích hoạt còn là <code>workflow_dispatch</code> cộng một con người. Nó THÔI đứng vững cái ngày một cái lịch nổ một cuộc deploy lúc 3 giờ sáng, hay cái ngày hai người đang deploy và người thứ hai cần BIẾT người đầu vẫn đang chạy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Thông báo là một tin nhắn PHẢI xứng đáng làm gián đoạn ai đó, và cách duy nhất giữ nó xứng đáng là GỬI ÍT HƠN — bắt đầu từ CON SỐ KHÔNG, thêm MỘT khi một cuộc deploy production hỏng, và DỪNG ở đó trừ khi một chỗ trống cụ thể trong luồng công việc của người vận hành đòi thêm.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Notifications for workflow runs</span><span class="lc-sub">docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/notifications-for-workflow-runs — các thông báo email và web dựng sẵn, và các thiết lập tắt cái ping-theo-từng-lần-chạy đi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">rtCamp/action-slack-notify</span><span class="lc-sub">github.com/rtCamp/action-slack-notify — một action Slack chạy được kèm các trường đáng đặt, và README có ghi hình dạng payload.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Being On-Call</span><span class="lc-sub">sre.google/sre-book/being-on-call/ — bản ngành công nghiệp về ngưỡng paging, mệt-mỏi-cảnh-báo, và kỷ luật "mọi cú page phải có thể HÀNH ĐỘNG".</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — smoke test không page ai cả</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — các phép kiểm dựng sẵn của script deploy, tức là chỗ cơ chế thông báo hiện tại của kho này SỐNG.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Authentication — cảnh báo dạy bạn BỎ QUA cảnh báo</span><span class="lc-sub">/courses/authentication/learn${REF} — một ca bảo mật cùng hình dạng: quá nhiều cảnh báo và cái QUAN TRỌNG trở nên VÔ HÌNH.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra Chương 9',
      slug: 'ga-9-6-kiem-tra',
      type: 'QUIZ',
      description: 'Tám câu: 10/11 dispatch, hai sự cố tháng 7, ba nơi cho ba loại việc, rollback tốn 40 giây, environment sống sót thay đổi kích hoạt, và thông báo ít hơn thì tốt hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>What Chapter 9 measured</h2>
<p class="lead">Eight questions, twelve minutes. This chapter is about deploying <em>from</em> CI and where this repository stopped, so most answers are drawn from CLAUDE.md&#39;s dated notes rather than API data.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">9.1 — push-to-deploy</span><span class="lz-lnote">10/11 workflows here are dispatch-only, after two July 2026 outages caused by two deploy workflows racing</span></div>
<div class="lz-layer"><span class="lz-lname">9.2 — where to run</span><span class="lz-lnote">build at home, ship pre-built, VPS only swaps. And "build xanh" does not mean "image runs" — one deploy proved that in seven minutes of 502</span></div>
<div class="lz-layer"><span class="lz-lname">9.3 — rollback</span><span class="lz-lnote">forty seconds vs fifteen minutes when the orphan image was still there; the two-migration pattern for schema</span></div>
<div class="lz-layer"><span class="lz-lname">9.4 — environments</span><span class="lz-lnote">the human as a control breaks at N=2 people, or at any schedule; <code>environment:</code> survives that transition</span></div>
<div class="lz-layer"><span class="lz-lname">9.5 — notifications</span><span class="lz-lnote">2,343 runs, so per-run pings mean a muted channel; production failure is the one message worth sending</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Chương 9 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Chương này về deploy <em>TỪ</em> CI và chỗ kho này ĐÃ NGƯNG, nên phần lớn đáp án lấy từ ghi chú có ngày của CLAUDE.md chứ không từ dữ liệu API.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">9.1 — push-để-deploy</span><span class="lz-lnote">10/11 workflow ở đây chỉ chạy tay, SAU hai sự cố tháng 7/2026 do hai workflow deploy đua nhau</span></div>
<div class="lz-layer"><span class="lz-lname">9.2 — chạy ở đâu</span><span class="lz-lnote">dựng ở nhà, ship dựng-sẵn, VPS chỉ tráo. Và "build xanh" không nghĩa là "ảnh chạy" — một cuộc deploy đã chứng minh trong bảy phút 502</span></div>
<div class="lz-layer"><span class="lz-lname">9.3 — rollback</span><span class="lz-lnote">bốn mươi giây so với mười lăm phút khi ảnh mồ côi còn ở đó; khuôn mẫu hai-migration cho schema</span></div>
<div class="lz-layer"><span class="lz-lname">9.4 — environment</span><span class="lz-lnote">con người như biện pháp kiểm soát VỠ ở N=2 người, hoặc ở bất kỳ cái lịch nào; <code>environment:</code> sống sót được cuộc chuyển tiếp ấy</span></div>
<div class="lz-layer"><span class="lz-lname">9.5 — thông báo</span><span class="lz-lnote">2.343 lần chạy, nên ping-theo-từng-lần nghĩa là một kênh bị tắt; deploy production hỏng là tin nhắn ĐÁNG gửi</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'This repository has 10 of 11 workflows as workflow_dispatch only. What produced that decision?|||Kho này có 10 trên 11 workflow chỉ chạy tay. Cái gì đẻ ra quyết định ấy?',
            options: [
              'Two production outages in July 2026 caused by two deploy workflows racing on the same push, one causing HTTP 500 on the feed and the other Exited(137) containers|||Hai sự cố production tháng 7/2026 do hai workflow deploy ĐUA nhau trên cùng một cú push, một cái gây HTTP 500 ở feed và cái kia Exited(137) container',
              'A policy inherited from the organisation with no repository-specific reasoning|||Một chính sách thừa kế từ tổ chức, không có lý lẽ riêng của kho',
              'GitHub deprecated the push trigger for deploy workflows|||GitHub khai tử kích hoạt push cho các workflow deploy',
              'Nothing measurable — the workflows were written this way for style|||Không gì đo được — các workflow được viết vậy vì PHONG CÁCH',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What three properties does push-to-deploy require to be safe?|||Push-để-deploy đòi ba tính chất nào để AN TOÀN?',
            options: [
              'Exactly one workflow deploys, deploys are idempotent, and rollback is on the deploy path — this repository had none of them in July|||Đúng MỘT workflow deploy, deploy BẤT BIẾN, và rollback nằm TRÊN đường deploy — kho này không có cái nào trong tháng 7',
              'A test suite over 90% coverage, code review, and a security scanner|||Bộ test phủ trên 90%, code review, và bộ quét bảo mật',
              'A staging environment, a canary deploy, and blue-green infrastructure|||Một environment staging, một cuộc deploy canary, và hạ tầng blue-green',
              'The `concurrency:` key on every workflow|||Khoá `concurrency:` trên mọi workflow',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'CLAUDE.md documents "build xanh không có nghĩa là ảnh chạy được" after a specific outage. What happened?|||CLAUDE.md ghi câu "build xanh không có nghĩa là ảnh chạy được" sau một sự cố cụ thể. Chuyện gì đã xảy ra?',
            options: [
              'A libc/engine mismatch — Alpine (musl) base with a debian-glibc Prisma engine — built green, pushed green, swapped green, then the backend restart-looped and API returned 502 for seven minutes|||libc/engine không khớp — nền Alpine (musl) với engine Prisma cho debian-glibc — build xanh, đẩy xanh, tráo xanh, rồi backend restart-loop và API trả 502 suốt bảy phút',
              'The image never pushed to the registry, so the VPS pulled a stale version|||Ảnh không bao giờ đẩy lên registry nên VPS kéo phiên bản cũ',
              'The migration failed silently and the app started with an old schema|||Migration hỏng âm thầm và app khởi động với schema cũ',
              'A load balancer routed traffic before the container was healthy|||Load balancer định tuyến lưu lượng trước khi container khoẻ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repository&#39;s docker compose command on the VPS uses `--no-build`. What does removing it enable?|||Câu docker compose trên VPS của kho này dùng `--no-build`. Bỏ nó đi thì cho phép gì?',
            options: [
              'Compose is then allowed to build if it thinks it needs to — turning the production target into a build server that competes with itself for disk|||Compose khi đó được PHÉP dựng nếu nó nghĩ nó cần — biến cái đích production thành một máy dựng TRANH GIÀNH đĩa với chính nó',
              'Faster deploys because building in place avoids a network round-trip|||Deploy nhanh hơn vì dựng tại chỗ tránh một chuyến qua mạng',
              'Nothing — --no-build is deprecated in modern compose|||Không gì — --no-build đã bị khai tử trong compose hiện đại',
              'Compose ignores the docker-compose.yml file entirely|||Compose bỏ qua hoàn toàn tệp docker-compose.yml',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A bad image was swapped into production. Recovery took 40 seconds using a specific procedure. What was it?|||Một ảnh xấu bị tráo vào production. Khôi phục mất 40 giây bằng một quy trình cụ thể. Là gì?',
            options: [
              'The previous image was still there as an orphan (docker images -a --filter dangling=true); re-tag it and docker compose up -d --no-build|||Ảnh cũ vẫn còn dạng mồ côi (docker images -a --filter dangling=true); gắn thẻ lại rồi docker compose up -d --no-build',
              'Restore from the nightly database snapshot|||Khôi phục từ snapshot database hằng đêm',
              'git revert the offending commit and re-run the deploy workflow, which took the standard 15 minutes|||git revert commit gây hại rồi chạy lại workflow deploy, mất 15 phút tiêu chuẩn',
              'Rebuild the previous image on the VPS from source|||Dựng lại ảnh cũ trên VPS TỪ MÃ NGUỒN',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You rename column A to B and change the code to read B in one deploy. What does rollback require?|||Bạn đổi tên cột A thành B và đổi mã để đọc B trong MỘT cuộc deploy. Rollback đòi hỏi gì?',
            options: [
              'Restoring the database at production data volume — because reverting the code alone leaves the code reading column B which no longer exists|||Khôi phục database ở volume dữ liệu production — bởi revert MỖI mã để lại mã đọc cột B vốn không còn tồn tại',
              'Just docker pull the previous image, no schema work needed|||Chỉ docker pull ảnh cũ, không cần việc schema nào',
              'Nothing special — Prisma migrations are automatically reversible|||Không có gì đặc biệt — migration Prisma tự động đảo ngược được',
              'Waiting for the two-migration pattern to auto-heal within a day|||Chờ khuôn mẫu hai-migration tự chữa trong một ngày',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The human-as-control model that this repository uses breaks under which condition first?|||Mô hình con-người-như-biện-pháp mà kho này dùng VỠ dưới điều kiện nào ĐẦU TIÊN?',
            options: [
              'A scheduled trigger fires without human oversight, or two people trigger deploys at once — both defeat the "one operator watching one terminal" assumption|||Một kích hoạt theo lịch nổ mà không có giám sát người, hoặc hai người kích hoạt deploy cùng lúc — cả hai đều đánh bại giả định "một người vận hành xem một terminal"',
              'The dispatch UI stops working|||Giao diện dispatch thôi hoạt động',
              'GitHub Actions is deprecated|||GitHub Actions bị khai tử',
              'A person forgets their SSH key|||Một người quên khoá SSH của họ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'This repository has 2,343 total workflow runs. What does that number say about a per-run notification?|||Kho này có 2.343 lần chạy workflow. Con số ấy nói gì về việc gửi thông báo THEO LẦN CHẠY?',
            options: [
              'It would flood any channel to the point of being muted; the honest baseline is zero notifications, adding one only for production deploy failure|||Nó sẽ NGẬP mọi kênh tới mức bị tắt; đường nền trung thực là KHÔNG thông báo, thêm MỘT chỉ cho cú hỏng deploy production',
              'It is the correct volume for a healthy CI channel|||Đó là khối lượng đúng cho một kênh CI khoẻ mạnh',
              'Slack rate-limits webhooks so most would be dropped anyway|||Slack giới hạn tần suất webhook nên phần lớn sẽ bị rớt',
              'Notifications should be per-day digest, not per-run|||Thông báo nên là bản tổng hợp hằng ngày, không phải theo từng lần',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
