import { gallery, slide } from './_slides.mjs';

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

    /* ─────────────────────────── 9.0 ─────────────────────────── */
    {
      title: '9.0 — Chapter 9 slides: deploying from CI, and why this repository stopped, in pictures|||9.0 — Slide Chương 9: deploy từ CI, và vì sao kho này đã thôi, bằng hình',
      slug: 'ga-9-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 29 slide của Chương 9: dòng thời gian thật của sự cố 06/07 tới từng giây, cuộc đua dựng lại trên sân tập (79 s ảnh mới + schema cũ), khoá chung vẫn thiếu migration, deploy-nha.sh so với pipeline CD, tự rollback trong 12,6 s, cổng environment duyệt/từ chối/chặn nhánh, và thông báo đúng việc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Slides</span>
<h2>The whole chapter in 29 slides</h2>
<p class="lead">Skim these before the lessons, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: one push that used to start four workflows, the 6 July 2026 incident timed to the second from the API, the July race rebuilt on a sandbox with a text file as "production", a shared lock that still lost the migration, your own <code>deploy-nha.sh</code> set against a CD pipeline row by row, a broken image rolled back automatically, an environment gate that approves, rejects and refuses a branch, and the notification that says what production runs now.</p>
<p>Slides 3–8 belong to Lesson 9.1, 9–14 to 9.2, 15–19 to 9.3, 20–23 to 9.4 and 24–26 to 9.5. The last three are the chapter&#39;s common mistakes, a cheat sheet and a 60-minute practice session. Everything is real: this repository&#39;s runs read through the API on 24 September 2026, and new runs on GitHub-hosted runners in the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch09-deploy" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch09-deploy</code>, where no workflow touches a real server. Four slides correct earlier versions of this chapter: the 6 July error message, the wait-timer range, the notification template, and the claim that nothing here sends messages. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Slide</span>
<h2>Cả chương trong 29 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình đều xuất hiện lại trong bài giảng giải thích nó: một cú push từng khởi động bốn workflow, sự cố 06/07/2026 đo tới từng giây từ API, cuộc đua tháng 7 dựng lại trên sân tập với một tệp chữ làm "production", một khoá chung vẫn làm mất migration, chính <code>deploy-nha.sh</code> của bạn đặt cạnh một pipeline CD từng hàng một, một ảnh hỏng tự rollback, một cổng environment duyệt, từ chối và chặn cả nhánh, và cái thông báo nói rõ production BÂY GIỜ đang chạy gì.</p>
<p>Slide 3–8 thuộc Bài 9.1, 9–14 thuộc 9.2, 15–19 thuộc 9.3, 20–23 thuộc 9.4 và 24–26 thuộc 9.5. Ba slide cuối là sai lầm hay gặp, bảng tra nhanh và một buổi thực hành 60 phút. Mọi thứ đều THẬT: các lần chạy của kho này đọc qua API ngày 24/09/2026, và các lần chạy mới trên runner của GitHub trong sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch09-deploy" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch09-deploy</code>, nơi không workflow nào chạm vào máy chủ thật. Bốn slide đính chính bản cũ của chương: câu báo lỗi ngày 06/07, khoảng giá trị của bộ hẹn chờ, mẫu tin thông báo, và nhận định rằng ở đây không có gì gửi tin.</p>
</div>
${gallery('ga-09', [
[1, "Bìa"],
[2, "Bản đồ chương: deploy là một TRÌNH TỰ, không phải một nút"],
[3, "Tháng 7: một cú push = bốn workflow, ba cái SSH vào VPS"],
[4, "paths: trùng nhau ⇒ hai workflow deploy luôn chạy cùng lúc"],
[5, "Sự cố 06/07/2026: 74 giây ba lần chạy cùng sửa container"],
[6, "Log thật: lần chạy thứ ba vấp container mà lần khác đang dùng"],
[7, "Sân tập chép cấu hình tháng 7: ảnh mới + schema cũ 79 giây"],
[8, "Khoá chung chưa đủ: workflow có migration bị thay khi chờ"],
[9, "Site bạn deploy bằng script tay — GitHub Actions chỉ làm CI"],
[10, "Chọn cái nào: đếm người, đếm máy, đếm số lần deploy"],
[11, "Ba nơi một bước có thể chạy — kho này đặt bước nào ở đâu"],
[12, "deploy-ghcr.yml: runner dựng 4 phút, rồi mọi việc thật đi qua SSH"],
[13, "Dựng MỘT lần, gửi ảnh dạng artifact, đích chỉ nạp và tráo"],
[14, "Hai đường deploy, hai khoá không biết nhau"],
[15, "Ba kiểu rollback — chỉ một kiểu nhanh, và chỉ khi ảnh cũ còn"],
[16, "Sân tập: ảnh hỏng → 5 lần kiểm → tự rollback, sập 12,6 giây"],
[17, "Log thật của rollback: nhánh else nằm NGAY trong workflow"],
[18, "\"Bản trước\" không phải HEAD^ — hỏi production đang chạy gì"],
[19, "Schema: mở rộng trước, thu hẹp sau — rollback bằng MÃ"],
[20, "environment: biến một job thành cuộc deploy có cổng"],
[21, "Một deployment đi qua bốn trạng thái — và API ghi lại cả bốn"],
[22, "Ba lần cổng nói KHÔNG, ba câu báo lỗi khác nhau"],
[23, "Luật environment tuỳ gói và kho công khai/riêng tư (09/2026)"],
[24, "Thông báo rẻ nhất: tóm tắt job + một annotation lỗi"],
[25, "Gửi gì, cho ai, qua đâu — xanh không phải tin tức"],
[26, "Script của bạn đã có thông báo: ba chỗ gọi bao-tin.sh"],
[27, "Sai lầm hay gặp ở Chương 9"],
[28, "Bảng tra nhanh Chương 9"],
[29, "Thực hành Chương 9 (60 phút) trên kho thử của chính bạn"]
])}
`,
    },

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
${slide('ga-09', 3, 'Tháng 7: một cú push = bốn workflow, ba cái SSH vào VPS')}
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

<div class="callout ok">
<p><strong>Update, 24 September 2026 — the count grew, the shape did not.</strong> The folder now holds 14 workflows. Three are new since this lesson was written (<code>ship-lab211.yml</code>, <code>ssh-port-apply.yml</code>, <code>ssh-port-diagnostic.yml</code>), and all three are <code>workflow_dispatch</code> only. <code>ci-lint.yml</code> gained a manual trigger as well, so today it is <code>pull_request</code> + <code>push</code> + <code>workflow_dispatch</code>; <code>vps-cleanup-weekly.yml</code> is still <code>schedule</code> + <code>workflow_dispatch</code>. That makes 12 of 14 manual-only, and still exactly one workflow that a push can start. Three of the fourteen declare a <code>concurrency</code> group (<code>deploy-ghcr</code>, <code>desktop-release</code>, <code>ship-lab211</code>). Measure it yourself with <code>grep -A4 &#39;^on:&#39; .github/workflows/*.yml</code>.</p>
</div>

<div class="callout">
<p><strong>The lint workflow runs on push, and that is it.</strong> The two deploy workflows once did too, and the repository&#39;s own operations notes record exactly what stopped them: two production incidents, in the same week, both caused by <em>two deploy workflows racing each other</em>.</p>
</div>

<h3>Incident 1 · 2026-07-03 — feed 500 while schema lagged the image</h3>
${slide('ga-09', 4, 'paths: trùng nhau ⇒ hai workflow deploy luôn chạy cùng lúc')}
<p>Before reading the incident, read the triggers as they were. <code>git show 094db93b^:.github/workflows/deploy-ghcr.yml</code> prints the version of both files from the day before they were switched off. Each had <code>on: push</code> with a <code>paths:</code> filter, and the GHCR file carried a comment saying that commits outside its list "keep using backend-vps.yml". The lists were not disjoint: <code>src/**</code>, <code>prisma/**</code>, <code>frontend/**</code> and <code>nginx/**</code> appear in <em>both</em>. So every push that touched application code started both workflows at the same second. The comment described an intention; the YAML described the opposite. A <code>paths:</code> filter is a set, and two sets that overlap mean two runs.</p>
<p>The run history of 3 July makes the consequence visible. There were nine pushes to <code>main</code> that day, and every one of them started four workflows: <code>CI - Lint &amp; Type Check</code>, <code>CI/CD Guard - Prevent duplicate frontend containers</code> (which SSHes into the VPS and stops duplicate containers), <code>Deploy via GHCR</code> and <code>Deploy Backend to VPS</code>. Three of the four touch the server.</p>
<div class="out">gh api "repos/cuonghoang1103/api-backend/actions/runs?created=2026-07-03" ...
push f8aa76b2  10:23:27   guard -&gt; 10:23:51   ghcr -&gt; 10:30:04   vps -&gt; 10:32:36
push a605c7db  11:00:24   guard -&gt; 11:00:48   ghcr -&gt; 11:06:55   vps -&gt; 11:09:27
push e93c99fd  12:05:38   guard -&gt; 12:06:03   ghcr -&gt; 12:12:33   vps -&gt; 12:15:40
... 9 pushes, 36 runs, every deploy pair overlapping for 6-9 minutes (UTC)</div>
<p>Nothing in that table is red: every one of those deploy runs reported <code>success</code>. The operations log records a feed that returned HTTP 500 that day, and the mechanism is the one in the flow below. The table shows why nobody saw it in the Actions tab: two green deploy runs of the same commit is exactly what a race between two correct workflows looks like.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push to main</span><span class="lz-t">both workflows trigger</span><span class="lz-d"><code>deploy-ghcr.yml</code> and <code>backend-vps.yml</code> were both configured <code>on: push</code>. Two runs entered the queue at the same commit</span></div>
<div class="lz-step"><span class="lz-k">the two deploys interleave</span><span class="lz-t">image swapped, migration not yet applied</span><span class="lz-d">the container recreated with new code before <code>prisma migrate deploy</code> from the other workflow finished. New code hit an old schema</span></div>
<div class="lz-step"><span class="lz-k">what users saw</span><span class="lz-t">HTTP 500 on the feed</span><span class="lz-d">a real outage caused by ordering, not by any single workflow being wrong</span></div>
</div>

<h3>Incident 2 · 2026-07-06 — Exited(137) and orphan containers</h3>
${slide('ga-09', 5, 'Sự cố 06/07/2026: 74 giây ba lần chạy cùng sửa container')}
<p>This one can be timed to the second, because every step of every run is still in the API. Two pushes landed 19 seconds apart (<code>3a42ec18</code> at 10:26:49 UTC, <code>89a38611</code> at 10:27:08), which made four runs. The GHCR workflow&#39;s own <code>concurrency</code> group cancelled its first run after 23 seconds — the key did exactly what it says. The backend-vps workflow had no group, so both of its runs went on. From 10:35:03 to 10:36:17 three runs were changing the same two containers at once: two runs "injecting fresh dist" and then copying <code>.next/</code> into the frontend container, and the second GHCR run recreating both containers.</p>
${slide('ga-09', 6, 'Log thật: lần chạy thứ ba vấp container mà lần khác đang dùng')}
<p>The red run is the honest one. Its <code>docker compose up -d --force-recreate</code> could not remove a container that another run was using, it exited 1, and every step after it was skipped — including <em>Apply Prisma migrations</em>. The two backend-vps runs finished green two seconds earlier. A reader of the Actions tab saw "two green, one red" and had no way to tell which image, which files and which schema production was left with. That is the general property of a deploy race: the per-run status is true for each run and says nothing about the server.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push to main</span><span class="lz-t">two workflows again, both mid-recreate</span><span class="lz-d">both called <code>docker compose up -d --force-recreate</code> against the same container names</span></div>
<div class="lz-step"><span class="lz-k">docker refuses</span><span class="lz-t">"cannot remove container …: container is running"</span><span class="lz-d">the GHCR run&#39;s recreate (run 28784932814) failed while two backend-vps runs were injecting files into the same containers; its migration, nginx reload and health checks were all skipped. The "container name is already in use" message belongs to a later incident (13 August) that <code>deploy-nha.sh</code> records next to its lock</span></div>
<div class="lz-step"><span class="lz-k">recovery</span><span class="lz-t"><code>Exited(137)</code>, orphans, manual <code>docker start</code></span><span class="lz-d">the backend container was in state <code>Exited(137)</code> — killed. Recovered with <code>docker start cuonghoangdev_backend</code> from the operator&#39;s shell</span></div>
</div>

<div class="callout warn">
<p><strong>Both incidents were the same failure with two different symptoms.</strong> Nothing was wrong with either workflow individually. The failure was that pushing a commit triggered two of them and there was no coordination between them — no shared lock, no compose project name, no acceptance test that would have refused to swap before the migration completed. The obvious remedies (add <code>concurrency:</code>, pin the compose project) were tried; the observed solution was to <em>remove the automatic trigger</em>.</p>
</div>

<h3>Run it yourself: the July race, rebuilt in a sandbox</h3>
<p>Incidents are persuasive and unrepeatable. So the race was rebuilt on the public sandbox <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch09-deploy" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch09-deploy</code>, with no server anywhere. "Production" is a text file, <code>production.txt</code> on a branch called <code>ch09-prod</code>, with two lines: <code>anh=</code> (which image runs) and <code>schema=</code> (which migration was applied). A small script, <code>ch09/ghi.sh</code>, changes one line through the contents API, so every "touch the server" is a commit with a timestamp — the branch history is the incident timeline.</p>
<pre><code class="language-yaml"># .github/workflows/ch09-dua-ghcr.yml (copied from deploy-ghcr.yml before 6 July)
on:
  push:
    branches: [ch09-deploy]
    paths: ['ch09/dua/**']
concurrency:
  group: ch09-dua-ghcr          # its OWN group, like the real one
  cancel-in-progress: true
permissions:
  contents: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-24.04
    env:
      GH_TOKEN: &#36;{{ github.token }}
    steps:
      - uses: actions/checkout@v4
      - run: sleep 70                                   # build + push image
      - run: ch09/ghi.sh anh "&#36;{GITHUB_SHA::7}" "ghcr run &#36;{GITHUB_RUN_ID}"
      - run: |                                          # migrate AFTER the swap
          sleep 15
          ch09/ghi.sh schema "&#36;{GITHUB_SHA::7}" "ghcr run &#36;{GITHUB_RUN_ID}"</code></pre>
<p>The twin, <code>ch09-dua-vps.yml</code>, has the same trigger, no <code>concurrency</code>, a 40-second "build", and writes only <code>anh=</code> — just as the real backend-vps workflow injected code but never migrated. Two pushes, 22 seconds apart:</p>
${slide('ga-09', 7, 'Sân tập chép cấu hình tháng 7: ảnh mới + schema cũ 79 giây')}
<div class="out">cd ch09-prod &amp;&amp; git log --format='%s'      # oldest last
15:04:20 ghcr run 36017208796: schema=383f043
15:04:03 ghcr run 36017208796: anh=383f043
15:03:16 vps run 36017208846: anh=383f043
15:03:01 vps run 36017162535: anh=683e7f8
ch09: production gia lap (khoi dau)</div>
<p>Read it bottom-up. At 15:03:01 production switched to the image of push 1 while the schema was still the starting one. Push 1&#39;s migration never happened: its GHCR run (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017162526" target="_blank" rel="noopener">36017162526</a>) was cancelled by its own group when push 2 arrived. From 15:03:01 to 15:04:20 — <strong>79 seconds</strong> — new code ran against an old schema. In the real repository that window is what a feed returning 500 looks like. Every run involved was green except the one that was cancelled on purpose.</p>

<h3>The obvious fix, measured: one shared lock</h3>
<p>The first fix everyone proposes is "give both workflows the same concurrency group". Chapter 7 (lesson 7.2) measured what that does for two plain workflows: they queue. Here it was measured on the deploy shape. <code>ch09-khoa-ghcr.yml</code> and <code>ch09-khoa-vps.yml</code> are the same two workflows with <code>group: ch09-prod-khoa</code> and <code>cancel-in-progress: false</code> in both, and the GHCR one now migrates <em>before</em> it swaps.</p>
${slide('ga-09', 8, 'Khoá chung chưa đủ: workflow có migration bị thay khi chờ')}
<p>The lock worked: no two runs touched production at the same time. And the result was still wrong. A group holds one running run and <strong>one</strong> pending run; a newer pending run replaces the older one. The backend-vps run of push 1 started first, so both GHCR runs waited — and both were replaced before they ever got a machine (0 jobs each, runs <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017502683" target="_blank" rel="noopener">36017502683</a> and <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017548107" target="_blank" rel="noopener">36017548107</a>). The only workflow that knew how to migrate never ran. Two commits reached "production" and the schema line did not move.</p>
<div class="callout warn">
<p><strong>This is why the chapter lists three properties, not one.</strong> A shared lock gives you "never two at once". It does not give you "the migration always runs", because which run survives the queue is decided by arrival order, not by which run carries the work. Only <em>one workflow that owns the whole sequence</em> — migrate, swap, check — gives you that. In this repository that single owner is now <code>deploy-nha.sh</code>, and it is a script, not a workflow.</p>
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
<p><strong>Trap — adding <code>concurrency:</code> and thinking the problem is solved.</strong> 7.2 measured what <code>concurrency</code> does — it queues, it does not enforce ordering across separate workflows unless they share a group, and it does not make anything idempotent. Both July incidents involved two <em>different</em> workflows, so a per-workflow concurrency block would not have prevented them. Sharing a group across workflows is possible; making sure two people never trigger overlapping runs is not.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Push-to-deploy is not primitively unsafe, but it demands three properties this repository did not have — a single deploying workflow, idempotent deploys, automatic rollback — so after two outages in one week the observable fix was to remove the automatic trigger and encode the deploy as a script that a person runs on purpose.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Your team deploys on every push to main. What can go wrong?</strong><br>A: Two workflows whose <code>paths:</code> filters overlap both deploy the same commit; a fast follow-up push starts a second deploy while the first is mid-swap; a cancelled run leaves the image swapped but the migration not run. I would check that exactly one workflow deploys, that it holds a lock shared by everything that touches the target, that migrations are backward compatible, and that a failed health check rolls back automatically.</p>
<p><strong>Q: Would adding <code>concurrency:</code> fix a deploy race?</strong><br>A: It serialises runs that share the same group name — nothing else. Different workflows need the same group, and even then a group keeps only one pending run, so the run that carries the migration can be replaced. It removes overlap, not ordering or completeness.</p>
<p><strong>Q: Why might a team stop auto-deploying?</strong><br>A: Because auto-deploy is only safe with one deploy path, idempotent deploys and automatic rollback. If those are missing, a human-triggered script is a legitimate control while they are built — as long as the script itself is the single path, takes a lock and checks what production actually runs.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you want to know whether any two workflows in your own repository could deploy the same push.</p><ol>
<li>In your repository run <code>grep -n -A12 &#39;^on:&#39; .github/workflows/*.yml</code> and write down, for every workflow, its events and its <code>paths:</code> list.</li>
<li>Mark every workflow that uses <code>secrets.VPS_*</code>, <code>ssh</code>, <code>docker</code> on a server or a cloud CLI — those touch a target.</li>
<li>For each pair of target-touching workflows, find one file path that matches both filters. If you find one, that pair can race.</li>
<li>Open <code>gh run list --limit 40 --json workflowName,headSha,createdAt,updatedAt</code> and look for two deploy runs with the same <code>headSha</code> whose times overlap.</li>
<li>(Optional) Copy <code>ch09-dua-*.yml</code> and <code>ch09/ghi.sh</code> from the sandbox branch into a test repository, create a <code>ch09-prod</code> branch with a <code>production.txt</code>, push twice 20 seconds apart, and read <code>git log</code> of <code>ch09-prod</code>.</li></ol>
<p><strong>Done when:</strong> you have a table "workflow · events · paths · touches the target?", and either one concrete path that triggers two deploys (plus the run IDs that prove it) or a one-line argument why no pair can overlap.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Push-to-deploy</span><span class="v">A workflow on <code>on: push</code> that changes production. Fast, and safe only with the three properties below.</span></div>
  <div class="kv"><span class="k">paths filter</span><span class="v">The file globs that decide whether a push starts a workflow. Two filters that share a path start two runs.</span></div>
  <div class="kv"><span class="k">Deploy race (đua deploy)</span><span class="v">Two runs changing one target at the same time; each run can be green while the target ends up wrong.</span></div>
  <div class="kv"><span class="k">Concurrency group (nhóm tuần tự)</span><span class="v">A name; runs with the same name wait for each other. One running + one pending per group.</span></div>
  <div class="kv"><span class="k">Idempotent deploy (deploy bất biến)</span><span class="v">Running it twice for the same commit leaves the same state as running it once.</span></div>
  <div class="kv"><span class="k">Schema lag (schema tụt sau ảnh)</span><span class="v">New code running against an old database schema, because the swap happened before the migration.</span></div>
  <div class="kv"><span class="k">workflow_dispatch</span><span class="v">Manual trigger. A human button — a real control while there is one human.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Before 6 July 2026 every push to <code>main</code> started four workflows here, three of which touched the VPS, because two <code>paths:</code> filters overlapped.</li>
<li>6 July, 10:35:03–10:36:17: three runs changed the same containers; the one that failed skipped its migration, the other two were green.</li>
<li>The sandbox rebuild shows the 3 July shape: 79 seconds of new image on old schema, every run green except a deliberate cancel.</li>
<li>A shared concurrency group removes overlap but not correctness: the migration-carrying run was replaced twice while waiting.</li>
<li>Push-to-deploy needs one deploy path, idempotent deploys and rollback on the deploy path. This repository chose a script run by a human until it has them.</li>
<li>Today 12 of 14 workflows are manual-only; only <code>ci-lint.yml</code> runs on push.</li>
</ul>

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
${slide('ga-09', 3, 'Tháng 7: một cú push = bốn workflow, ba cái SSH vào VPS')}
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

<div class="callout ok">
<p><strong>Cập nhật 24/09/2026 — con số lớn lên, hình dạng giữ nguyên.</strong> Thư mục giờ có 14 workflow. Ba cái mới từ khi bài này được viết (<code>ship-lab211.yml</code>, <code>ssh-port-apply.yml</code>, <code>ssh-port-diagnostic.yml</code>), cả ba đều chỉ <code>workflow_dispatch</code>. <code>ci-lint.yml</code> có thêm nút chạy tay, nên hôm nay nó là <code>pull_request</code> + <code>push</code> + <code>workflow_dispatch</code>; <code>vps-cleanup-weekly.yml</code> vẫn là <code>schedule</code> + <code>workflow_dispatch</code>. Tức là 12 trên 14 chỉ chạy tay, và vẫn đúng MỘT workflow mà cú push khởi động được. Ba trên mười bốn khai nhóm <code>concurrency</code> (<code>deploy-ghcr</code>, <code>desktop-release</code>, <code>ship-lab211</code>). Tự đo bằng <code>grep -A4 &#39;^on:&#39; .github/workflows/*.yml</code>.</p>
</div>

<div class="callout">
<p><strong>Workflow lint chạy khi có push, và chỉ có thế.</strong> Hai workflow deploy TỪNG chạy như vậy, và chính sổ vận hành của kho ghi lại chính xác cái gì đã DỪNG chúng: hai sự cố production, cùng một tuần, cả hai đều do <em>hai workflow deploy đua nhau</em>.</p>
</div>

<h3>Sự cố 1 · 2026-07-03 — feed 500 khi schema tụt sau image</h3>
${slide('ga-09', 4, 'paths: trùng nhau ⇒ hai workflow deploy luôn chạy cùng lúc')}
<p>Trước khi đọc sự cố, hãy đọc kích hoạt đúng như nó từng là. <code>git show 094db93b^:.github/workflows/deploy-ghcr.yml</code> in ra bản của cả hai tệp vào ngày trước khi chúng bị tắt. Mỗi tệp có <code>on: push</code> kèm bộ lọc <code>paths:</code>, và tệp GHCR còn có dòng chú thích nói rằng commit nằm ngoài danh sách của nó thì "vẫn dùng backend-vps.yml". Hai danh sách KHÔNG tách rời nhau: <code>src/**</code>, <code>prisma/**</code>, <code>frontend/**</code> và <code>nginx/**</code> có mặt ở <em>cả hai</em>. Nên mọi cú push đụng vào mã ứng dụng đều khởi động cả hai workflow trong cùng một giây. Chú thích mô tả một ý định; YAML mô tả điều ngược lại. Bộ lọc <code>paths:</code> là một tập hợp, và hai tập hợp giao nhau nghĩa là hai lần chạy.</p>
<p>Lịch sử chạy ngày 03/07 cho thấy hệ quả. Hôm đó có chín cú push lên <code>main</code>, và cú nào cũng khởi động bốn workflow: <code>CI - Lint &amp; Type Check</code>, <code>CI/CD Guard - Prevent duplicate frontend containers</code> (SSH vào VPS rồi dừng container trùng), <code>Deploy via GHCR</code> và <code>Deploy Backend to VPS</code>. Ba trong bốn cái chạm vào máy chủ.</p>
<div class="out">gh api "repos/cuonghoang1103/api-backend/actions/runs?created=2026-07-03" ...
push f8aa76b2  10:23:27   guard -&gt; 10:23:51   ghcr -&gt; 10:30:04   vps -&gt; 10:32:36
push a605c7db  11:00:24   guard -&gt; 11:00:48   ghcr -&gt; 11:06:55   vps -&gt; 11:09:27
push e93c99fd  12:05:38   guard -&gt; 12:06:03   ghcr -&gt; 12:12:33   vps -&gt; 12:15:40
... 9 cu push, 36 lan chay, moi cap deploy chong nhau 6-9 phut (gio UTC)</div>
<p>Không có dòng nào trong bảng đó màu đỏ: mọi lần chạy deploy đều báo <code>success</code>. Sổ vận hành ghi lại một feed trả HTTP 500 hôm đó, và cơ chế là cái trong luồng bên dưới. Bảng cho thấy vì sao không ai thấy nó trong tab Actions: hai lần deploy xanh của cùng một commit chính là hình dạng của cuộc đua giữa hai workflow ĐÚNG.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push lên main</span><span class="lz-t">cả hai workflow kích hoạt</span><span class="lz-d"><code>deploy-ghcr.yml</code> và <code>backend-vps.yml</code> đều được cấu hình <code>on: push</code>. Hai lần chạy vào hàng đợi tại CÙNG một commit</span></div>
<div class="lz-step"><span class="lz-k">hai cuộc deploy chen nhau</span><span class="lz-t">ảnh đã tráo, migration chưa áp</span><span class="lz-d">container tái tạo với mã mới trước khi <code>prisma migrate deploy</code> của workflow kia xong. Mã mới đụng schema cũ</span></div>
<div class="lz-step"><span class="lz-k">người dùng thấy gì</span><span class="lz-t">HTTP 500 ở feed</span><span class="lz-d">một sự cố thật gây bởi THỨ TỰ, không phải bởi bất kỳ workflow nào bị sai</span></div>
</div>

<h3>Sự cố 2 · 2026-07-06 — Exited(137) và container mồ côi</h3>
${slide('ga-09', 5, 'Sự cố 06/07/2026: 74 giây ba lần chạy cùng sửa container')}
<p>Sự cố này đo được tới từng giây, vì mọi bước của mọi lần chạy vẫn còn trong API. Hai cú push cách nhau 19 giây (<code>3a42ec18</code> lúc 10:26:49 UTC, <code>89a38611</code> lúc 10:27:08), thành bốn lần chạy. Nhóm <code>concurrency</code> riêng của workflow GHCR huỷ lần chạy đầu của nó sau 23 giây — cái khoá làm đúng như tên nó. Workflow backend-vps không có nhóm nào, nên cả hai lần chạy của nó cứ thế chạy. Từ 10:35:03 tới 10:36:17, ba lần chạy cùng thay đổi hai container: hai lần "bơm dist mới" rồi chép <code>.next/</code> vào container frontend, và lần GHCR thứ hai tái tạo cả hai container.</p>
${slide('ga-09', 6, 'Log thật: lần chạy thứ ba vấp container mà lần khác đang dùng')}
<p>Lần chạy đỏ là lần trung thực. Lệnh <code>docker compose up -d --force-recreate</code> của nó không xoá được một container mà lần chạy khác đang dùng, nó thoát mã 1, và mọi bước sau đó bị bỏ qua — gồm cả <em>Apply Prisma migrations</em>. Hai lần chạy backend-vps xong XANH trước đó hai giây. Người đọc tab Actions thấy "hai xanh, một đỏ" và không có cách nào biết production còn lại ảnh nào, tệp nào, schema nào. Đó là tính chất chung của cuộc đua deploy: trạng thái của TỪNG lần chạy đúng với lần chạy ấy và không nói gì về máy chủ.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">push lên main</span><span class="lz-t">lại hai workflow, cả hai đang giữa cuộc tái tạo</span><span class="lz-d">cả hai đều gọi <code>docker compose up -d --force-recreate</code> lên CÙNG các tên container</span></div>
<div class="lz-step"><span class="lz-k">docker từ chối</span><span class="lz-t">"cannot remove container …: container is running"</span><span class="lz-d">bước recreate của lần chạy GHCR (run 28784932814) hỏng trong lúc hai lần chạy backend-vps đang bơm tệp vào đúng các container ấy; migration, nạp lại nginx và kiểm sức khoẻ của nó đều bị bỏ qua. Câu "container name is already in use" thuộc về một sự cố SAU (13/08) mà <code>deploy-nha.sh</code> ghi ngay cạnh cái khoá của nó</span></div>
<div class="lz-step"><span class="lz-k">khôi phục</span><span class="lz-t"><code>Exited(137)</code>, mồ côi, <code>docker start</code> thủ công</span><span class="lz-d">container backend ở trạng thái <code>Exited(137)</code> — bị giết. Khôi phục bằng <code>docker start cuonghoangdev_backend</code> từ shell của người vận hành</span></div>
</div>

<div class="callout warn">
<p><strong>Cả hai sự cố là CÙNG một kiểu hỏng với hai triệu chứng khác nhau.</strong> Không có gì sai trong từng workflow riêng lẻ. Kiểu hỏng là push một commit kích hoạt HAI cái và không có phối hợp nào giữa chúng — không khoá chung, không tên project compose chung, không bài nghiệm thu nào từ chối tráo trước khi migration xong. Các biện pháp khắc phục hiển nhiên (thêm <code>concurrency:</code>, ghim tên project) đã được thử; giải pháp thật sự quan sát được là <em>GỠ kích hoạt tự động</em>.</p>
</div>

<h3>Chạy thử từng bước: dựng lại cuộc đua tháng 7 trên sân tập</h3>
<p>Sự cố thì thuyết phục nhưng không lặp lại được. Nên cuộc đua được dựng lại trên sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch09-deploy" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch09-deploy</code>, không có máy chủ nào cả. "Production" là một tệp chữ, <code>production.txt</code> trên nhánh <code>ch09-prod</code>, có hai dòng: <code>anh=</code> (ảnh nào đang chạy) và <code>schema=</code> (migration nào đã áp). Một script nhỏ, <code>ch09/ghi.sh</code>, sửa MỘT dòng qua API contents, nên mỗi lần "chạm vào máy chủ" là một commit có giờ — lịch sử nhánh chính là dòng thời gian sự cố.</p>
<pre><code class="language-yaml"># .github/workflows/ch09-dua-ghcr.yml (chép từ deploy-ghcr.yml trước 06/07)
on:
  push:
    branches: [ch09-deploy]
    paths: ['ch09/dua/**']
concurrency:
  group: ch09-dua-ghcr          # nhóm RIÊNG, như bản thật
  cancel-in-progress: true
permissions:
  contents: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-24.04
    env:
      GH_TOKEN: &#36;{{ github.token }}
    steps:
      - uses: actions/checkout@v4
      - run: sleep 70                                   # dựng + đẩy ảnh
      - run: ch09/ghi.sh anh "&#36;{GITHUB_SHA::7}" "ghcr run &#36;{GITHUB_RUN_ID}"
      - run: |                                          # migrate SAU khi tráo
          sleep 15
          ch09/ghi.sh schema "&#36;{GITHUB_SHA::7}" "ghcr run &#36;{GITHUB_RUN_ID}"</code></pre>
<p>Bản sinh đôi, <code>ch09-dua-vps.yml</code>, có cùng kích hoạt, KHÔNG có <code>concurrency</code>, "dựng" 40 giây, và chỉ ghi <code>anh=</code> — đúng như workflow backend-vps thật từng bơm mã mà không bao giờ migrate. Hai cú push, cách nhau 22 giây:</p>
${slide('ga-09', 7, 'Sân tập chép cấu hình tháng 7: ảnh mới + schema cũ 79 giây')}
<div class="out">cd ch09-prod &amp;&amp; git log --format='%s'      # cu nhat o duoi
15:04:20 ghcr run 36017208796: schema=383f043
15:04:03 ghcr run 36017208796: anh=383f043
15:03:16 vps run 36017208846: anh=383f043
15:03:01 vps run 36017162535: anh=683e7f8
ch09: production gia lap (khoi dau)</div>
<p>Đọc từ dưới lên. Lúc 15:03:01 production chuyển sang ảnh của push 1 trong khi schema vẫn là bản khởi đầu. Migration của push 1 KHÔNG BAO GIỜ xảy ra: lần chạy GHCR của nó (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017162526" target="_blank" rel="noopener">36017162526</a>) bị chính nhóm của nó huỷ khi push 2 tới. Từ 15:03:01 tới 15:04:20 — <strong>79 giây</strong> — mã mới chạy trên schema cũ. Ở kho thật, cái cửa sổ ấy chính là hình dạng của một feed trả 500. Mọi lần chạy liên quan đều xanh, trừ lần bị huỷ có chủ ý.</p>

<h3>Cách vá hiển nhiên, đem đi đo: một khoá chung</h3>
<p>Cách vá đầu tiên ai cũng đề xuất là "cho hai workflow chung một nhóm concurrency". Chương 7 (bài 7.2) đã đo điều đó với hai workflow trơn: chúng xếp hàng. Ở đây nó được đo trên đúng hình dạng deploy. <code>ch09-khoa-ghcr.yml</code> và <code>ch09-khoa-vps.yml</code> là hai workflow y hệt, cùng <code>group: ch09-prod-khoa</code> và <code>cancel-in-progress: false</code>, và bản GHCR giờ migrate <em>TRƯỚC</em> khi tráo.</p>
${slide('ga-09', 8, 'Khoá chung chưa đủ: workflow có migration bị thay khi chờ')}
<p>Khoá chạy đúng: không lúc nào có hai lần chạy cùng chạm production. Và kết quả VẪN sai. Một nhóm giữ một lần đang chạy và <strong>MỘT</strong> lần đang chờ; lần chờ mới hơn thay thế lần chờ cũ. Lần backend-vps của push 1 bắt đầu trước, nên cả hai lần GHCR phải chờ — và cả hai bị thay trước khi kịp nhận máy (0 job mỗi lần, run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017502683" target="_blank" rel="noopener">36017502683</a> và <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017548107" target="_blank" rel="noopener">36017548107</a>). Workflow DUY NHẤT biết migrate không bao giờ chạy. Hai commit lên "production" mà dòng schema không nhúc nhích.</p>
<div class="callout warn">
<p><strong>Đây là lý do chương này kể BA tính chất chứ không phải một.</strong> Khoá chung cho bạn "không bao giờ hai cái cùng lúc". Nó không cho bạn "migration luôn chạy", vì lần chạy nào sống sót khỏi hàng đợi do THỨ TỰ TỚI quyết định, không do lần chạy nào mang việc. Chỉ có <em>một workflow sở hữu cả trình tự</em> — migrate, tráo, kiểm — mới cho bạn điều đó. Ở kho này, chủ sở hữu duy nhất ấy giờ là <code>deploy-nha.sh</code>, và nó là một script, không phải workflow.</p>
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

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Đội bạn deploy mỗi lần push lên main. Cái gì có thể hỏng?</strong><br>Đ: Hai workflow có bộ lọc <code>paths:</code> giao nhau cùng deploy một commit; một cú push theo sau khởi động deploy thứ hai khi cái đầu đang tráo dở; một lần chạy bị huỷ để lại ảnh đã tráo mà migration chưa chạy. Tôi sẽ kiểm rằng đúng MỘT workflow deploy, nó giữ một khoá chung với mọi thứ chạm vào đích, migration tương thích ngược, và kiểm sức khoẻ hỏng thì tự rollback.</p>
<p><strong>H: Thêm <code>concurrency:</code> có vá được cuộc đua deploy không?</strong><br>Đ: Nó tuần tự hoá những lần chạy CÙNG tên nhóm — không hơn. Các workflow khác nhau phải dùng chung tên, và kể cả vậy một nhóm chỉ giữ một lần chờ, nên lần chạy mang migration có thể bị thay. Nó xoá sự CHỒNG NHAU, không xoá chuyện sai THỨ TỰ hay THIẾU bước.</p>
<p><strong>H: Vì sao một đội lại thôi deploy tự động?</strong><br>Đ: Vì deploy tự động chỉ an toàn khi có một đường deploy, deploy bất biến và rollback tự động. Thiếu chúng thì một script do người chạy là biện pháp kiểm soát chính đáng trong lúc xây — miễn chính script là đường DUY NHẤT, giữ khoá và kiểm xem production thật sự đang chạy gì.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn biết trong kho của CHÍNH MÌNH có hai workflow nào có thể cùng deploy một cú push không.</p><ol>
<li>Trong kho của bạn chạy <code>grep -n -A12 &#39;^on:&#39; .github/workflows/*.yml</code> và ghi ra, cho từng workflow, các sự kiện và danh sách <code>paths:</code>.</li>
<li>Đánh dấu mọi workflow dùng <code>secrets.VPS_*</code>, <code>ssh</code>, <code>docker</code> trên máy chủ hay CLI của cloud — đó là những cái chạm vào đích.</li>
<li>Với mỗi cặp workflow chạm đích, tìm MỘT đường dẫn tệp khớp cả hai bộ lọc. Tìm được là cặp đó có thể đua.</li>
<li>Mở <code>gh run list --limit 40 --json workflowName,headSha,createdAt,updatedAt</code> và tìm hai lần deploy cùng <code>headSha</code> có giờ chồng nhau.</li>
<li>(Tuỳ chọn) Chép <code>ch09-dua-*.yml</code> và <code>ch09/ghi.sh</code> từ nhánh sân tập vào một kho thử, tạo nhánh <code>ch09-prod</code> có <code>production.txt</code>, push hai lần cách nhau 20 giây, rồi đọc <code>git log</code> của <code>ch09-prod</code>.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bảng "workflow · sự kiện · paths · chạm đích?", và hoặc một đường dẫn cụ thể khởi động hai deploy (kèm run ID chứng minh) hoặc một câu lập luận vì sao không cặp nào chồng được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Push-to-deploy (push-để-deploy)</span><span class="v">Workflow <code>on: push</code> thay đổi production. Nhanh, và chỉ an toàn khi có ba tính chất bên dưới.</span></div>
  <div class="kv"><span class="k">paths filter (bộ lọc đường dẫn)</span><span class="v">Các mẫu tệp quyết định cú push có khởi động workflow không. Hai bộ lọc chung một đường dẫn = hai lần chạy.</span></div>
  <div class="kv"><span class="k">Deploy race (đua deploy)</span><span class="v">Hai lần chạy cùng thay đổi một đích; từng lần có thể xanh trong khi đích ra sai.</span></div>
  <div class="kv"><span class="k">Concurrency group (nhóm tuần tự)</span><span class="v">Một cái tên; các lần chạy cùng tên chờ nhau. Mỗi nhóm: một đang chạy + một đang chờ.</span></div>
  <div class="kv"><span class="k">Idempotent deploy (deploy bất biến)</span><span class="v">Chạy hai lần cho cùng commit cho ra đúng trạng thái như chạy một lần.</span></div>
  <div class="kv"><span class="k">Schema lag (schema tụt sau ảnh)</span><span class="v">Mã mới chạy trên schema cũ, vì tráo xảy ra trước migration.</span></div>
  <div class="kv"><span class="k">workflow_dispatch (chạy tay)</span><span class="v">Nút bấm của con người — biện pháp kiểm soát thật chừng nào chỉ có một người.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trước 06/07/2026 mỗi cú push lên <code>main</code> ở đây khởi động bốn workflow, ba cái chạm VPS, vì hai bộ lọc <code>paths:</code> giao nhau.</li>
<li>06/07, 10:35:03–10:36:17: ba lần chạy cùng sửa các container; lần hỏng bỏ qua migration, hai lần kia xanh.</li>
<li>Bản dựng lại trên sân tập cho thấy hình dạng 03/07: 79 giây ảnh mới trên schema cũ, mọi lần chạy xanh trừ một lần huỷ có chủ ý.</li>
<li>Nhóm concurrency chung xoá sự chồng nhau nhưng không làm đúng: lần chạy mang migration bị thay hai lần khi đang chờ.</li>
<li>Push-để-deploy cần một đường deploy, deploy bất biến, và rollback nằm trên đường deploy. Kho này chọn script do người chạy cho tới khi có đủ.</li>
<li>Hôm nay 12/14 workflow chỉ chạy tay; chỉ <code>ci-lint.yml</code> chạy khi push.</li>
</ul>

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

<h3>Your question first: "my site deploys with deploy.sh, not GitHub Actions — right? What is the difference?"</h3>
<p>Right — with one correction of name. The standard path since 18 August 2026 is <code>bash deploy-nha.sh</code>, run from your Mac; <code>deploy.sh</code> is the fallback it drops back to when the home machine is off or unreachable. GitHub Actions runs exactly one workflow on its own: <code>ci-lint.yml</code> (type check, tests, the two golden-set evals) on every push and pull request. The two deploy workflows, <code>deploy-ghcr.yml</code> and <code>backend-vps.yml</code>, still exist, but only a human pressing <em>Run workflow</em> can start them. So: CI lives on GitHub, CD lives in a script.</p>
${slide('ga-09', 9, 'Site bạn deploy bằng script tay — GitHub Actions chỉ làm CI')}
<p>The table is the whole difference, row by row. The questions a deploy system must answer are the same in both columns — who starts it, where it builds, how it gets the code, what stops two deploys from overlapping, where the secrets are, who approves, what is recorded — only the answers live in different places.</p>
<ul>
<li><strong>Who starts it.</strong> The script starts when you decide, and you are watching the terminal while it runs. A pipeline starts on an event, including events nobody is watching (a merge at midnight, a tag pushed from a phone).</li>
<li><strong>Where it builds.</strong> The script builds both images <em>in parallel</em> on a 12-core, 31 GB machine at home; a GitHub-hosted runner for a public repository has 4 cores and 16 GB and starts cold every time. The history of this repository measured the difference: 1&#39;34 and 5&#39;56 at home against 4&#39;37 and 11&#39;00 on the VPS.</li>
<li><strong>How it gets the code.</strong> <code>deploy-nha.sh</code> sends only what is committed (<code>git push</code> into a bare repository at home), and asks <code>[y/N]</code> if your working tree is dirty, because uncommitted changes will <em>not</em> go to production. A pipeline checks out the commit that is on GitHub — which is why it can never deploy something that is not pushed, and why the script and the pipeline can disagree about what "main" is (lesson 9.2, below).</li>
<li><strong>What stops overlap.</strong> The script takes <code>flock /var/lock/cuongthai-deploy.lock</code> <em>on the VPS</em> before swapping. A pipeline uses <code>concurrency:</code> <em>on GitHub</em>. Neither knows about the other.</li>
<li><strong>Pushing.</strong> The script pushes to <code>origin/main</code> itself at the very end — after re-running the checks <code>ci-lint.yml</code> marks as required — so "deploy" and "push" are one action here. In a pipeline the push comes first and the deploy follows.</li>
</ul>
${slide('ga-09', 10, 'Chọn cái nào: đếm người, đếm máy, đếm số lần deploy')}
<p>When to choose which is a question of counts, not of fashion. One or two people, one server, a build heavy enough to want a strong machine, and the occasional need to deploy something not yet on GitHub: the script is the right tool, and <code>deploy.sh</code> exists precisely for that last case. A second or third person who deploys, a need for a record of who shipped what, an approver who is not the author, several deploys a day: that is when a pipeline with <code>environment:</code> starts paying for itself. Lessons 9.3 to 9.5 build that pipeline on the sandbox so you can see both sides with real logs.</p>
<div class="callout">
<p><strong>What actually happens when you type <code>bash deploy-nha.sh</code>.</strong> 0 — read <code>HEAD</code>, warn about uncommitted changes. 0a — ask the VPS which commit production runs and stop if <code>HEAD</code> does not contain it (the anti-rollback guard). 1 — is the home machine alive (LAN first, tunnel second). 1b — can we log in to GHCR, <em>before</em> six minutes of building. 2 — <code>git push</code> the committed code to the bare repository at home. 3 — build both images in parallel. 3b — does the backend image even start (musl/glibc vs the Prisma engine). 4 — push both images to GHCR. 5 — on the VPS: take the lock, pull, re-tag, <code>docker compose up -d --no-build</code>. 5b/5c — reload nginx and check from outside. 6 — <code>prisma migrate deploy</code>, health, smoke test. 6b — seed content. 6c — sync nginx.conf. 7 — delete old image tags on the VPS. 8 — rerun CI&#39;s required checks and <code>git push origin HEAD:main</code>. Last — compare the running container&#39;s image hash with the one recorded at swap time. Every numbered step is a comment block in the file, most of them with the date of the incident that created it.</p>
</div>

<h3>The three places a step can run</h3>
${slide('ga-09', 11, 'Ba nơi một bước có thể chạy — kho này đặt bước nào ở đâu')}
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

<h3>deploy-ghcr.yml, step by step: what the runner does and what SSH does</h3>
${slide('ga-09', 12, 'deploy-ghcr.yml: runner dựng 4 phút, rồi mọi việc thật đi qua SSH')}
<p>The pipeline version of the same recipe is worth reading as a timeline, because it shows where the work really happens. In run 28784932814 the runner spent four minutes on <code>npm ci</code>, the TypeScript build and <code>next build</code>, and about a minute and a half building and pushing two images. Everything after that — pulling the images, recreating the containers, running migrations, reloading nginx, checking health — is a step whose body is <code>ssh vps "…"</code>. The runner is a remote control. Its log shows what SSH printed and nothing else, and when two runs hold the remote control at the same time (lesson 9.1) nothing on the runner can see it.</p>
<p>That is not a reason to avoid pipelines. It is the reason the <em>target</em> must hold the lock and keep the record — which is exactly what <code>deploy-nha.sh</code> moved to the VPS with <code>flock</code> and the image-hash check.</p>

<h3>The three-place recipe</h3>
<p>The sandbox pipeline <code>ch09-cd.yml</code> is this recipe with GitHub as the build place: build once, send the image as an artifact, and let the deploy job only load and swap.</p>
${slide('ga-09', 13, 'Dựng MỘT lần, gửi ảnh dạng artifact, đích chỉ nạp và tráo')}
<pre><code class="language-yaml">  dung:                                   # build ONCE, tag by SHA
    steps:
      - run: |
          docker build -q --build-arg PHIEN_BAN="&#36;{GITHUB_SHA::8}" -t "ch09-app:&#36;{GITHUB_SHA::8}" ch09/app
          docker save "ch09-app:&#36;{GITHUB_SHA::8}" | gzip &gt; anh.tar.gz      # 2.2 MB
      - uses: actions/upload-artifact@v4
        with: { name: anh-ch09, path: anh.tar.gz, retention-days: 3 }
  trien-khai:
    needs: dung
    steps:
      - uses: actions/download-artifact@v4
        with: { name: anh-ch09 }
      - run: gunzip -c anh.tar.gz | docker load    # "Loaded image: ch09-app:ff166e70"</code></pre>
<p>In run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018120566" target="_blank" rel="noopener">36018120566</a> the build job took 8 seconds and the deploy job 17. The point is not speed: the image that was tested is byte-for-byte the image that was deployed. Building again at the target produces a <em>different</em> image from the one you checked — and on 18 August this repository built the wrong Dockerfile at exactly that step.</p>
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
<p><strong>Trap — the deploy that only tests itself.</strong> A deploy script that hits <code>/health</code> and considers a 200 sufficient proves that <em>the router mounted</em>. It does not prove that a route this deploy actually changed still works. CLAUDE.md documents an incident from 2026-07-02 where the entire <code>/api/v1/gifs</code> route was missing from a stale image and <code>/health</code> was fine. This repository&#39;s deploy script now checks core routes (401 or 200 = mounted; 404 = stale build) — a specific, cheap test that catches a specific, expensive failure.</p>
</div>

<h3>Two deploy paths, two locks that do not know each other</h3>
${slide('ga-09', 14, 'Hai đường deploy, hai khoá không biết nhau')}
<p>The July lesson was learned; a September incident shows it has a second half. On 10 September at 21:00 UTC, <code>deploy-nha.sh</code> finished swapping an image that contained a new route. At 21:02 another session pressed <em>Run workflow</em> on <code>deploy-ghcr.yml</code> (run 34529884942). That workflow built from <code>main</code> <em>on GitHub</em> — still an older commit, because the script pushes only at the end, after its checks — and recreated the containers. Production went backwards, both logs were green, and the new route answered 404 until someone looked by hand.</p>
<p>The script had a lock. The workflow had a lock. They were different locks: <code>flock</code> lives in <code>/var/lock</code> on the VPS, <code>concurrency</code> lives on GitHub, and neither asks the other. The fix in the script is the last check it runs: compare the image hash of the running container with the hash recorded at swap time; if they differ, someone swapped over you, so say so loudly and send a message. The general rule: <strong>a lock protects only the paths that take it</strong>. As long as a second path exists, either give it the same lock or make the first path verify the result.</p>

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

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: Where should the build for a deployment happen?</strong><br>A: Somewhere reproducible and separate from production, once. Then ship the built artifact — an image tagged by commit SHA — and let the target only pull, swap and verify. Building on the production host competes with production for CPU, memory and disk, and building again at deploy time means you deploy something you did not test.</p>
<p><strong>Q: What is the difference between a deploy script and a CD pipeline?</strong><br>A: Not the language. The same questions — trigger, build place, lock, secrets, approval, record — are answered on a laptop in one case and on the CI platform in the other. A script is fine for one operator; a pipeline wins when several people deploy and you need an audit trail and approvals by someone other than the author.</p>
<p><strong>Q: Your CD job only SSHes into the server and runs commands. What is the weakness?</strong><br>A: The runner cannot see the server&#39;s state; the lock and the record must live where the change happens. I would make the server-side step take a lock and verify afterwards that the running image is the one we meant to deploy.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a classmate asks "does your site deploy with GitHub Actions?" and you want to answer from your own files, not from memory.</p><ol>
<li>Open <code>deploy-nha.sh</code> and list its numbered steps (search for <code># ─── </code>). For each step write where it runs: Mac, home machine, VPS or GitHub.</li>
<li>Run <code>grep -A4 &#39;^on:&#39; .github/workflows/*.yml</code> and mark which workflows a push can start.</li>
<li>Open run 28784932814 of <code>deploy-ghcr.yml</code> with <code>gh run view 28784932814 -R cuonghoang1103/api-backend --json jobs --jq &#39;.jobs[].steps[]|[.name,.startedAt,.completedAt]&#39;</code> and mark which steps are <code>ssh</code>.</li>
<li>Fill the comparison table of slide 9 for <em>your</em> project in your own words.</li></ol>
<p><strong>Done when:</strong> you have a two-column table (script vs pipeline) with at least six rows filled from your own files, one sentence saying which you use today and why, and one sentence saying what would make you switch.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CD pipeline (đường ống triển khai)</span><span class="v">A workflow on the CI platform that builds and deploys on an event.</span></div>
  <div class="kv"><span class="k">Deploy script (script deploy)</span><span class="v">A program a person runs that does the same steps from their machine — here <code>deploy-nha.sh</code>.</span></div>
  <div class="kv"><span class="k">Artifact (sản phẩm dựng)</span><span class="v">The built thing you ship: here an image tagged by SHA, or a <code>docker save</code> file.</span></div>
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Where images live between build and deploy — GHCR for this repository.</span></div>
  <div class="kv"><span class="k">Build host (máy dựng)</span><span class="v">The machine that builds. Warm cache, separate disk, never production.</span></div>
  <div class="kv"><span class="k">flock</span><span class="v">A Linux file lock; <code>flock -n</code> fails at once if someone holds it. The script&#39;s version of <code>concurrency</code>.</span></div>
  <div class="kv"><span class="k">--no-build</span><span class="v">Compose flag that forbids building at the target: pull and run only.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Your site deploys with <code>bash deploy-nha.sh</code> (fallback <code>deploy.sh</code>); GitHub Actions runs only CI automatically.</li>
<li>Script and pipeline answer the same questions — trigger, build place, lock, secrets, approval, record — in different places.</li>
<li>Choose by counts: one operator and one server favour the script; several deployers, audit and approvals favour a pipeline.</li>
<li>A pipeline that only SSHes into the server sees nothing of the server; lock and verification must live at the target.</li>
<li>Build once, ship the artifact, deploy exactly what was tested.</li>
<li>A lock protects only the paths that take it: 10–11 September, a manual <code>deploy-ghcr.yml</code> run overwrote a script deploy.</li>
</ul>

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

<h3>Trả lời câu hỏi của bạn trước: "web tôi dùng deploy.sh chứ không phải GitHub Actions đúng không? Khác nhau sao?"</h3>
<p>Đúng — chỉ sửa một cái tên. Đường CHUẨN từ 18/08/2026 là <code>bash deploy-nha.sh</code>, chạy từ máy Mac của bạn; <code>deploy.sh</code> là đường LÙI mà nó tự quay về khi máy nhà tắt hay mất mạng. GitHub Actions chỉ tự chạy ĐÚNG MỘT workflow: <code>ci-lint.yml</code> (kiểm kiểu, test, hai bộ eval golden-set) mỗi lần push và mỗi pull request. Hai workflow deploy, <code>deploy-ghcr.yml</code> và <code>backend-vps.yml</code>, vẫn còn đó, nhưng chỉ khi có người bấm <em>Run workflow</em> thì chúng mới chạy. Tóm lại: CI sống trên GitHub, CD sống trong một script.</p>
${slide('ga-09', 9, 'Site bạn deploy bằng script tay — GitHub Actions chỉ làm CI')}
<p>Cái bảng chính là toàn bộ sự khác nhau, từng hàng một. Những câu một hệ thống deploy phải trả lời thì giống hệt nhau ở hai cột — ai khởi động, dựng ở đâu, lấy mã thế nào, cái gì chặn hai cuộc deploy chồng nhau, bí mật nằm đâu, ai duyệt, cái gì được ghi lại — chỉ là câu trả lời nằm ở những chỗ khác nhau.</p>
<ul>
<li><strong>Ai khởi động.</strong> Script chạy khi bạn quyết định, và bạn đang nhìn terminal trong lúc nó chạy. Pipeline chạy theo một sự kiện, kể cả sự kiện không ai nhìn (merge lúc nửa đêm, tag đẩy từ điện thoại).</li>
<li><strong>Dựng ở đâu.</strong> Script dựng cả hai ảnh <em>SONG SONG</em> trên máy nhà 12 nhân, 31 GB; runner của GitHub cho kho công khai có 4 nhân, 16 GB và lần nào cũng khởi động nguội. Lịch sử kho này đã đo: ở nhà 1&#39;34 và 5&#39;56, trên VPS 4&#39;37 và 11&#39;00.</li>
<li><strong>Lấy mã thế nào.</strong> <code>deploy-nha.sh</code> chỉ gửi thứ ĐÃ COMMIT (<code>git push</code> vào một kho trần ở máy nhà), và hỏi <code>[y/N]</code> nếu cây làm việc còn bẩn, vì thay đổi chưa commit sẽ KHÔNG lên production. Pipeline checkout commit đang nằm trên GitHub — nên nó không bao giờ deploy được thứ chưa push, và cũng vì thế script với pipeline có thể bất đồng về "main là gì" (xem bên dưới).</li>
<li><strong>Cái gì chặn chồng nhau.</strong> Script giữ <code>flock /var/lock/cuongthai-deploy.lock</code> <em>trên VPS</em> trước khi tráo. Pipeline dùng <code>concurrency:</code> <em>trên GitHub</em>. Hai cái không biết nhau.</li>
<li><strong>Push.</strong> Script TỰ push lên <code>origin/main</code> ở cuối — sau khi chạy lại các phép kiểm mà <code>ci-lint.yml</code> đánh dấu bắt buộc — nên ở đây "deploy" và "push" là MỘT hành động. Trong pipeline thì push đi trước, deploy theo sau.</li>
</ul>
${slide('ga-09', 10, 'Chọn cái nào: đếm người, đếm máy, đếm số lần deploy')}
<p>Chọn cái nào là chuyện ĐẾM, không phải chuyện mốt. Một hai người, một máy chủ, bản dựng đủ nặng để cần máy khoẻ, và thỉnh thoảng cần deploy thứ chưa lên GitHub: script là công cụ đúng, và <code>deploy.sh</code> tồn tại chính vì trường hợp cuối. Người thứ hai, thứ ba cũng deploy, cần sổ ghi ai đã ship cái gì, cần người duyệt KHÁC người viết, deploy nhiều lần mỗi ngày: đó là lúc một pipeline có <code>environment:</code> bắt đầu đáng tiền. Bài 9.3 tới 9.5 dựng đúng pipeline ấy trên sân tập để bạn thấy cả hai phía bằng log thật.</p>
<div class="callout">
<p><strong>Chuyện gì thật sự xảy ra khi bạn gõ <code>bash deploy-nha.sh</code>.</strong> 0 — đọc <code>HEAD</code>, cảnh báo nếu còn thay đổi chưa commit. 0a — hỏi VPS production đang chạy commit nào, DỪNG nếu <code>HEAD</code> không chứa nó (chốt chống lùi). 1 — máy nhà còn sống không (thử LAN trước, đường hầm sau). 1b — đăng nhập GHCR được không, <em>trước</em> sáu phút dựng. 2 — <code>git push</code> mã đã commit sang kho trần ở nhà. 3 — dựng hai ảnh song song. 3b — ảnh backend có khởi động nổi không (musl/glibc so với engine Prisma). 4 — đẩy hai ảnh lên GHCR. 5 — trên VPS: giữ khoá, pull, gắn lại thẻ, <code>docker compose up -d --no-build</code>. 5b/5c — nạp lại nginx và kiểm từ bên ngoài. 6 — <code>prisma migrate deploy</code>, sức khoẻ, smoke test. 6b — seed nội dung. 6c — đồng bộ nginx.conf. 7 — xoá thẻ ảnh cũ trên VPS. 8 — chạy lại các phép kiểm bắt buộc của CI rồi <code>git push origin HEAD:main</code>. Cuối cùng — so mã băm ảnh của container đang chạy với mã băm ghi lúc tráo. Mỗi bước đánh số là một khối chú thích trong tệp, phần lớn kèm ngày của sự cố đã sinh ra nó.</p>
</div>

<h3>Ba nơi mà một bước có thể chạy</h3>
${slide('ga-09', 11, 'Ba nơi một bước có thể chạy — kho này đặt bước nào ở đâu')}
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

<h3>deploy-ghcr.yml từng bước: runner làm gì, SSH làm gì</h3>
${slide('ga-09', 12, 'deploy-ghcr.yml: runner dựng 4 phút, rồi mọi việc thật đi qua SSH')}
<p>Bản pipeline của cùng công thức đáng đọc như một dòng thời gian, vì nó cho thấy việc thật xảy ra ở đâu. Trong run 28784932814, runner tốn bốn phút cho <code>npm ci</code>, dựng TypeScript và <code>next build</code>, rồi khoảng một phút rưỡi dựng và đẩy hai ảnh. Mọi thứ sau đó — kéo ảnh, tái tạo container, chạy migration, nạp lại nginx, kiểm sức khoẻ — là những bước có thân là <code>ssh vps "…"</code>. Runner là một cái điều khiển từ xa. Log của nó chỉ thấy cái SSH in ra, không hơn, và khi hai lần chạy cùng cầm điều khiển (bài 9.1) thì không gì trên runner thấy được chuyện đó.</p>
<p>Đó không phải lý do để tránh pipeline. Đó là lý do cái <em>ĐÍCH</em> phải giữ khoá và giữ sổ — đúng thứ <code>deploy-nha.sh</code> đã dời sang VPS bằng <code>flock</code> và phép so mã băm ảnh.</p>

<h3>Công thức ba-chỗ</h3>
<p>Pipeline sân tập <code>ch09-cd.yml</code> chính là công thức này với GitHub làm nơi dựng: dựng MỘT lần, gửi ảnh dưới dạng artifact, để job deploy chỉ nạp và tráo.</p>
${slide('ga-09', 13, 'Dựng MỘT lần, gửi ảnh dạng artifact, đích chỉ nạp và tráo')}
<pre><code class="language-yaml">  dung:                                   # dựng MỘT lần, gắn thẻ theo SHA
    steps:
      - run: |
          docker build -q --build-arg PHIEN_BAN="&#36;{GITHUB_SHA::8}" -t "ch09-app:&#36;{GITHUB_SHA::8}" ch09/app
          docker save "ch09-app:&#36;{GITHUB_SHA::8}" | gzip &gt; anh.tar.gz      # 2,2 MB
      - uses: actions/upload-artifact@v4
        with: { name: anh-ch09, path: anh.tar.gz, retention-days: 3 }
  trien-khai:
    needs: dung
    steps:
      - uses: actions/download-artifact@v4
        with: { name: anh-ch09 }
      - run: gunzip -c anh.tar.gz | docker load    # "Loaded image: ch09-app:ff166e70"</code></pre>
<p>Ở run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018120566" target="_blank" rel="noopener">36018120566</a>, job dựng mất 8 giây và job deploy 17 giây. Điểm chính không phải tốc độ: ảnh được kiểm chính là ảnh được deploy, trùng tới từng byte. Dựng lại ở đích là tạo ra một ảnh <em>KHÁC</em> cái bạn đã kiểm — và ngày 18/08 kho này dựng nhầm Dockerfile đúng ở bước ấy.</p>
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

<h3>Hai đường deploy, hai khoá không biết nhau</h3>
${slide('ga-09', 14, 'Hai đường deploy, hai khoá không biết nhau')}
<p>Bài học tháng 7 đã được học; một sự cố tháng 9 cho thấy nó còn nửa sau. Ngày 10/09 lúc 21:00 UTC (04:00 ngày 11/09 giờ Việt Nam), <code>deploy-nha.sh</code> tráo xong một ảnh có route mới. Lúc 21:02 một phiên khác bấm <em>Run workflow</em> trên <code>deploy-ghcr.yml</code> (run 34529884942). Workflow ấy dựng từ <code>main</code> <em>trên GitHub</em> — lúc đó vẫn là commit cũ hơn, vì script chỉ push ở CUỐI, sau các phép kiểm — rồi tái tạo container. Production lùi lại, cả hai log đều xanh, và route mới trả 404 cho tới khi có người dò tay.</p>
<p>Script có khoá. Workflow có khoá. Chúng là hai khoá KHÁC nhau: <code>flock</code> nằm trong <code>/var/lock</code> trên VPS, <code>concurrency</code> nằm trên GitHub, và không cái nào hỏi cái kia. Cách vá trong script là phép kiểm cuối cùng của nó: so mã băm ảnh của container đang chạy với mã băm ghi lúc tráo; khác nhau nghĩa là có ai tráo đè lên bạn, nên kêu to và gửi tin. Quy tắc chung: <strong>khoá chỉ bảo vệ những đường ĐI QUA nó</strong>. Chừng nào còn đường thứ hai, hoặc cho nó dùng chung khoá, hoặc bắt đường thứ nhất kiểm lại kết quả.</p>

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

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bản dựng cho một lần deploy nên xảy ra ở đâu?</strong><br>Đ: Ở một nơi lặp lại được và TÁCH khỏi production, một lần. Rồi ship sản phẩm đã dựng — một ảnh gắn thẻ theo SHA commit — và để đích chỉ kéo, tráo, kiểm. Dựng trên máy production thì tranh CPU, RAM và đĩa với chính production, còn dựng lại lúc deploy nghĩa là deploy một thứ bạn chưa kiểm.</p>
<p><strong>H: Script deploy khác pipeline CD ở đâu?</strong><br>Đ: Không ở ngôn ngữ. Cùng những câu hỏi — kích hoạt, nơi dựng, khoá, bí mật, người duyệt, sổ ghi — được trả lời trên laptop ở một bên và trên nền tảng CI ở bên kia. Script ổn khi có một người vận hành; pipeline thắng khi nhiều người deploy và cần sổ kiểm toán cùng người duyệt khác người viết.</p>
<p><strong>H: Job CD của bạn chỉ SSH vào máy chủ rồi chạy lệnh. Điểm yếu là gì?</strong><br>Đ: Runner không thấy trạng thái máy chủ; khoá và sổ ghi phải nằm ở nơi thay đổi xảy ra. Tôi sẽ cho bước phía máy chủ giữ khoá và kiểm lại sau đó rằng ảnh đang chạy đúng là ảnh định deploy.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng lớp hỏi "web của ông deploy bằng GitHub Actions à?" và bạn muốn trả lời bằng chính tệp của mình, không bằng trí nhớ.</p><ol>
<li>Mở <code>deploy-nha.sh</code> và liệt kê các bước đánh số (tìm <code># ─── </code>). Với mỗi bước ghi nó chạy ở đâu: Mac, máy nhà, VPS hay GitHub.</li>
<li>Chạy <code>grep -A4 &#39;^on:&#39; .github/workflows/*.yml</code> và đánh dấu những workflow mà cú push khởi động được.</li>
<li>Mở run 28784932814 của <code>deploy-ghcr.yml</code> bằng <code>gh run view 28784932814 -R cuonghoang1103/api-backend --json jobs --jq &#39;.jobs[].steps[]|[.name,.startedAt,.completedAt]&#39;</code> và đánh dấu bước nào là <code>ssh</code>.</li>
<li>Điền bảng so sánh của slide 9 cho dự án CỦA BẠN bằng lời của bạn.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bảng hai cột (script vs pipeline) với ít nhất sáu hàng điền từ tệp của chính bạn, một câu nói hôm nay bạn dùng cái nào và vì sao, và một câu nói điều gì sẽ khiến bạn chuyển.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">CD pipeline (đường ống triển khai)</span><span class="v">Workflow trên nền tảng CI tự dựng và deploy theo một sự kiện.</span></div>
  <div class="kv"><span class="k">Deploy script (script deploy)</span><span class="v">Chương trình một người chạy để làm cùng các bước từ máy của họ — ở đây là <code>deploy-nha.sh</code>.</span></div>
  <div class="kv"><span class="k">Artifact (sản phẩm dựng)</span><span class="v">Thứ đã dựng mà bạn ship: ở đây là ảnh gắn thẻ SHA, hoặc tệp <code>docker save</code>.</span></div>
  <div class="kv"><span class="k">Registry (kho ảnh)</span><span class="v">Nơi ảnh nằm giữa lúc dựng và lúc deploy — GHCR với kho này.</span></div>
  <div class="kv"><span class="k">Build host (máy dựng)</span><span class="v">Máy làm việc dựng. Cache ấm, đĩa riêng, không bao giờ là production.</span></div>
  <div class="kv"><span class="k">flock (khoá tệp)</span><span class="v">Khoá tệp của Linux; <code>flock -n</code> thất bại ngay nếu ai đang giữ. Phiên bản <code>concurrency</code> của script.</span></div>
  <div class="kv"><span class="k">--no-build</span><span class="v">Cờ compose CẤM dựng ở đích: chỉ kéo và chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Web của bạn deploy bằng <code>bash deploy-nha.sh</code> (đường lùi <code>deploy.sh</code>); GitHub Actions chỉ tự chạy CI.</li>
<li>Script và pipeline trả lời cùng một bộ câu hỏi — kích hoạt, nơi dựng, khoá, bí mật, người duyệt, sổ ghi — ở những chỗ khác nhau.</li>
<li>Chọn bằng cách đếm: một người vận hành, một máy chủ thì nghiêng về script; nhiều người deploy, cần kiểm toán và duyệt thì nghiêng về pipeline.</li>
<li>Pipeline chỉ SSH vào máy chủ thì không thấy gì của máy chủ; khoá và phép kiểm phải nằm ở đích.</li>
<li>Dựng một lần, ship sản phẩm dựng, deploy đúng cái đã kiểm.</li>
<li>Khoá chỉ bảo vệ đường đi qua nó: đêm 10→11/09 một lần bấm tay <code>deploy-ghcr.yml</code> đã đè lên cuộc deploy của script.</li>
</ul>

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
${slide('ga-09', 15, 'Ba kiểu rollback — chỉ một kiểu nhanh, và chỉ khi ảnh cũ còn')}
<div class="callout ok">
<p><strong>Update, 24 September 2026 — where the old image lives now.</strong> The 40-second recovery below relied on the previous image still sitting on the VPS as an orphan. Since 13 September, step 7 of <code>deploy-nha.sh</code> deletes every <code>ghcr.io/…:&lt;old SHA&gt;</code> tag on the VPS after a deploy (tagged images had piled up to about 20 GB on the disk Postgres lives on and took the database down). So the fast path today is not "find the orphan" but "pull the old tag back from GHCR", which still holds every version — 1,647 of them for the backend image when read through the packages API. And the script has a named flag for a deliberate rollback: <code>bash deploy-nha.sh --cho-lui</code> from the older commit, which disables the anti-rollback guard (step 0a) for that one run.</p>
</div>
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
${slide('ga-09', 19, 'Schema: mở rộng trước, thu hẹp sau — rollback bằng MÃ')}
<p>The pattern has a name, <em>expand and contract</em>, and one detail that matters for this repository: the order of swap and migrate. <code>deploy-nha.sh</code> swaps the image in step 5 and runs <code>npx prisma migrate deploy</code> in step 6, so for a few seconds new code runs on the old schema. That is safe only when every migration is an <em>expand</em> step the old schema can live with. The sandbox workflow <code>ch09-khoa-ghcr.yml</code> uses the opposite order (migrate, then swap), which is safe only when the old code can live with the new schema. Both orders work under expand and contract; neither works with a rename done in one deploy. Prisma Migrate does not generate "down" migrations for you, so going back on a schema means writing a new forward migration — another reason to make every step backward compatible.</p>
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

<h3>Run it yourself: an automatic rollback on the sandbox</h3>
<p>"Rollback is an <em>else</em> branch, not a document" is easy to say. Here is the branch, run for real. The sandbox pipeline <code>ch09-cd.yml</code> deploys a tiny image (busybox <code>httpd</code> serving its own version) to a container <em>inside the job</em> on port 19090 — no server, no SSH. The image can be built "broken" with <code>HONG=1</code>: it builds green, loads green, and the process exits at start with a message, the same shape as this repository&#39;s 18 August image whose Prisma engine did not match its libc.</p>
${slide('ga-09', 16, 'Sân tập: ảnh hỏng → 5 lần kiểm → tự rollback, sập 12,6 giây')}
<p>Commit <code>547a5ca</code> set <code>HONG=1</code>. Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017616624" target="_blank" rel="noopener">36017616624</a> did exactly what the YAML below says: the swap took a fraction of a second, the five health checks failed two seconds apart (<code>curl: (56)</code> on the first, then <code>curl: (7)</code> — nothing listening), the container log showed the reason, and the rollback step started the previous image and got <code>phien-ban=1b2d46bf</code> back. Production was not serving for <strong>12.6 seconds</strong>: 10 seconds of health-check budget plus 2.2 seconds of rollback.</p>
${slide('ga-09', 17, 'Log thật của rollback: nhánh else nằm NGAY trong workflow')}<pre><code class="language-yaml">  trien-khai:
    environment: { name: ch09-production }
    concurrency: { group: ch09-production, cancel-in-progress: false }
    steps:
      - name: Ask production what it RUNS (not HEAD^)
        run: |
          PREV=$(gh api "repos/&#36;{GITHUB_REPOSITORY}/contents/cd-dang-chay.txt?ref=ch09-prod" --jq .content | base64 -d)
          # ... start "production" on ch09-app:$PREV (port 19090) ...
          echo "PREV=ch09-app:$PREV" &gt;&gt; "$GITHUB_ENV"          # remembered BEFORE the swap
      - name: Swap to the new image
        run: |
          docker rm -f ch09-prod
          docker run -d --name ch09-prod -p 19090:8080 "$ANH"
      - name: Health check (5 x 2 s)
        id: kiem_suc_khoe
        run: |
          for i in 1 2 3 4 5; do
            if curl -fsS localhost:19090; then echo "khoe sau lan $i"; exit 0; fi
            sleep 2
          done
          docker logs ch09-prod 2&gt;&amp;1 | tail -3
          exit 1
      - name: Record "production runs" = new image       # only runs on success
        run: ...                                          # PUT cd-dang-chay.txt
      - name: Roll back automatically
        if: failure() &amp;&amp; steps.kiem_suc_khoe.outcome == 'failure'
        run: |
          docker rm -f ch09-prod
          docker run -d --name ch09-prod -p 19090:8080 "$PREV"
          sleep 2; curl -fsS localhost:19090 &amp;&amp; echo "rollback XONG, production khoe lai"</code></pre>
<p>Three details carry the whole mechanism. <code>PREV</code> is written to <code>$GITHUB_ENV</code> <em>before</em> the swap, because after the swap the old container is gone and nothing remembers what it was. The health step has an <code>id</code> so the rollback can ask specifically whether <em>the check</em> failed — <code>failure()</code> alone is also true when the artifact download failed, and rolling back a swap that never happened is its own incident. And the job stays red after a successful rollback: the deploy failed, production is fine, and both facts must reach whoever reads the run.</p>
<div class="callout warn">
<p><strong>The health-check budget is your outage length.</strong> Five tries two seconds apart means a broken image is served for about ten seconds before anything reacts. Longer budgets tolerate slow starts; shorter ones roll back healthy images that were merely slow. Choose it from a measurement of how long your real container needs to answer, not from a default.</p>
</div>

<h3>What is "the previous version"? Ask production, do not guess</h3>
${slide('ga-09', 18, '"Bản trước" không phải HEAD^ — hỏi production đang chạy gì')}
<p>The first version of this pipeline guessed. Its preparation step started "production" from the parent commit, <code>HEAD^</code>, on the reasoning that the previous commit is what was running. Right after the rollback above, the fix commit <code>b406a95</code> ran <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017879471" target="_blank" rel="noopener">36017879471</a> — and went red before deploying anything. Its parent was <code>547a5ca</code>, the broken image that had just been rolled back. Production was actually running <code>1b2d46bf</code>, older still. A rollback built on that guess would have "restored" the broken version.</p>
<p>The fix is to ask the target. On the sandbox the "server" keeps a file <code>cd-dang-chay.txt</code> on branch <code>ch09-prod</code>, written only after a successful health check; the next run (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018120566" target="_blank" rel="noopener">36018120566</a>) read <code>production dang chay: 1b2d46bf</code>, swapped to <code>ff166e70</code>, and recorded it. <code>deploy-nha.sh</code> does the same against the real server in step 0a: it reads the image hash of the running <code>cuonghoangdev_backend</code> container, maps it to a <code>ghcr.io/…:&lt;sha&gt;</code> tag, and uses <code>git merge-base --is-ancestor</code> to refuse any deploy that does not contain what production runs. That guard exists because on 13 September a deploy from a branch cut earlier silently removed a morning&#39;s work from production.</p>

<h3>Rehearsing it, at the cadence that keeps it working</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">before you need it</span><span class="lz-t">a scheduled roll-forward-and-back on staging</span><span class="lz-d">deploy a known-bad commit deliberately, roll back, deploy the fix. If any step of that sequence fails, the rollback did not work — and you have found out on a Tuesday afternoon rather than at 3am</span></div>
<div class="lz-step"><span class="lz-k">during a real deploy</span><span class="lz-t">the previous SHA in a variable</span><span class="lz-d">the deploy script captures <code>PREV_SHA=\$(docker inspect ...)</code> before the swap. If the swap fails or the health check fails, the same script restores it. Rollback becomes an <em>else</em> branch, not a separate document</span></div>
<div class="lz-step"><span class="lz-k">after a rollback</span><span class="lz-t">a post-mortem that includes "did the rollback work"</span><span class="lz-d">not just "did we recover" — did the rollback path itself do what it was documented to do? A partial success is a rollback that will fail differently next time</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — a rollback that requires the deploying human to be awake.</strong> If the recovery procedure is "SSH to the VPS and run these commands", then the on-call person needs SSH access, needs the runbook, and needs to be conscious. All three fail at the times rollback is most needed. The alternative is the deploy script encoding the rollback as its own else branch — the first two failures still stop you from responding, but the third one is automated.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A rollback works when it has been used deliberately, and every rollback path this repository documents was written after an incident that used it — which is a fine way to end up with a working rollback and a slow way to find out you did not have one.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: How do you roll back a bad deploy?</strong><br>A: Redeploy the previous image by its SHA tag — it is already built and was already tested. That covers code. For schema I rely on expand and contract so that every intermediate state is valid with the previous code, which turns a schema rollback into a code rollback. Data restores are a separate, slower procedure, not a rollback.</p>
<p><strong>Q: How does your pipeline know what to roll back to?</strong><br>A: It asks the target what is running before it swaps and keeps that in a variable. It does not assume the parent commit: after an earlier rollback, the parent is the version that was removed.</p>
<p><strong>Q: Should an automatic rollback leave the pipeline green?</strong><br>A: No. The deploy failed. Production being healthy is a second fact that goes in the summary. A green run after a rollback teaches people that the change shipped.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you want to see your own pipeline roll itself back before you ever need it at 3 a.m.</p><ol>
<li>In a public test repository, copy <code>.github/workflows/ch09-cd.yml</code> and the folder <code>ch09/app/</code> from the sandbox branch <code>ch09-deploy</code>. Commit, then create a branch <code>ch09-prod</code> containing a file <code>cd-dang-chay.txt</code> whose content is the first 8 characters of that commit&#39;s SHA.</li>
<li>Remove the <code>environment:</code> block for now (lesson 9.4 adds it back) and push a change under <code>ch09/app/</code> to a branch named <code>ch09-thu</code> — the workflow only listens to <code>ch09-*</code> branches. Expect a green run.</li>
<li>Set <code>HONG=1</code> in <code>ch09/app/cau-hinh.env</code> and push. Open the run and find the five failed checks, the container log line and <code>rollback XONG</code>.</li>
<li>Set <code>HONG=0</code> and push again. Check the log line <code>production dang chay:</code> — it must name the last <em>healthy</em> version, not the broken one.</li></ol>
<p><strong>Done when:</strong> you have three run links (green, rolled back, green), the rollback run is red with <code>rollback XONG</code> in its log, and the third run&#39;s <code>production dang chay:</code> is the SHA of the first run, not the second.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Put the previous known-good version back. Fast only when that version is already built.</span></div>
  <div class="kv"><span class="k">Health check (kiểm sức khoẻ)</span><span class="v">A request that proves the new version answers. Its time budget is the length of a failed deploy&#39;s outage.</span></div>
  <div class="kv"><span class="k">PREV</span><span class="v">The version running before the swap, read from the target and saved before touching it.</span></div>
  <div class="kv"><span class="k">steps.&lt;id&gt;.outcome</span><span class="v">The result of one step before <code>continue-on-error</code>; lets a rollback react to one specific failure.</span></div>
  <div class="kv"><span class="k">Expand / contract (mở rộng / thu hẹp)</span><span class="v">Add new schema first, remove old schema last, so every deploy in between can be rolled back as code.</span></div>
  <div class="kv"><span class="k">Anti-rollback guard (chốt chống lùi)</span><span class="v">Refuse to deploy a commit that does not contain what production runs, unless asked explicitly (<code>--cho-lui</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Three rollback shapes: re-deploy an old image (seconds), revert and redeploy (minutes), restore data (hours — an incident, not a rollback).</li>
<li>On the VPS old image tags are now cleaned up; old images live in GHCR, and <code>--cho-lui</code> is the named flag for going back on purpose.</li>
<li>The sandbox rolled a broken image back automatically: 12.6 s outage, 2.2 s of it the rollback itself.</li>
<li>Save <code>PREV</code> before the swap, give the health step an <code>id</code>, and keep the job red after a successful rollback.</li>
<li>"Previous version" means what production runs, not <code>HEAD^</code>: the guess went red on the very next run.</li>
<li>Expand and contract makes schema rollbacks into code rollbacks; the order of swap and migrate is safe only under it.</li>
</ul>

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
${slide('ga-09', 15, 'Ba kiểu rollback — chỉ một kiểu nhanh, và chỉ khi ảnh cũ còn')}
<div class="callout ok">
<p><strong>Cập nhật 24/09/2026 — ảnh cũ giờ nằm ở đâu.</strong> Cuộc khôi phục 40 giây bên dưới dựa vào việc ảnh trước vẫn nằm trên VPS dưới dạng mồ côi. Từ 13/09, bước 7 của <code>deploy-nha.sh</code> xoá mọi thẻ <code>ghcr.io/…:&lt;SHA cũ&gt;</code> trên VPS sau mỗi lần deploy (ảnh có thẻ đã dồn tới khoảng 20 GB trên đúng cái đĩa chứa Postgres và làm sập cơ sở dữ liệu). Nên đường nhanh hôm nay không phải "tìm ảnh mồ côi" mà là "kéo thẻ cũ về từ GHCR" — nơi vẫn giữ mọi phiên bản, 1.647 phiên bản của ảnh backend khi đọc qua API packages. Và script có một cờ mang tên riêng cho việc cố ý lùi: <code>bash deploy-nha.sh --cho-lui</code> từ commit cũ hơn, cờ này tắt chốt chống lùi (bước 0a) cho đúng một lần chạy đó.</p>
</div>
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
${slide('ga-09', 19, 'Schema: mở rộng trước, thu hẹp sau — rollback bằng MÃ')}
<p>Khuôn mẫu này có tên, <em>expand and contract</em> (mở rộng rồi thu hẹp), và có một chi tiết quan trọng với kho này: thứ tự giữa tráo và migrate. <code>deploy-nha.sh</code> tráo ảnh ở bước 5 và chạy <code>npx prisma migrate deploy</code> ở bước 6, nên trong vài giây mã mới chạy trên schema cũ. Điều đó chỉ an toàn khi mọi migration là bước <em>expand</em> mà schema cũ sống chung được. Workflow sân tập <code>ch09-khoa-ghcr.yml</code> dùng thứ tự ngược (migrate rồi mới tráo), chỉ an toàn khi mã cũ sống được với schema mới. Cả hai thứ tự đều chạy được dưới expand and contract; không thứ tự nào chạy được với một lần đổi tên cột trong một cuộc deploy. Prisma Migrate không tự sinh migration "down" cho bạn, nên lùi schema nghĩa là viết một migration TIẾN mới — thêm một lý do để mọi bước đều tương thích ngược.</p>
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

<h3>Chạy thử: một cuộc rollback tự động trên sân tập</h3>
<p>"Rollback là một nhánh <em>else</em>, không phải một tài liệu" thì nói dễ. Đây là cái nhánh ấy, chạy thật. Pipeline sân tập <code>ch09-cd.yml</code> deploy một ảnh tí hon (busybox <code>httpd</code> phục vụ số phiên bản của chính nó) vào một container <em>NGAY TRONG job</em> ở cổng 19090 — không máy chủ, không SSH. Ảnh có thể được dựng "hỏng" bằng <code>HONG=1</code>: dựng xanh, nạp xanh, và tiến trình thoát ngay lúc khởi động kèm một dòng báo lỗi — đúng hình dạng ảnh ngày 18/08 của kho này, khi engine Prisma không hợp libc của ảnh.</p>
${slide('ga-09', 16, 'Sân tập: ảnh hỏng → 5 lần kiểm → tự rollback, sập 12,6 giây')}
<p>Commit <code>547a5ca</code> đặt <code>HONG=1</code>. Run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017616624" target="_blank" rel="noopener">36017616624</a> làm đúng như YAML bên dưới nói: tráo mất chưa tới một giây, năm lần kiểm sức khoẻ hỏng cách nhau hai giây (lần đầu <code>curl: (56)</code>, sau đó <code>curl: (7)</code> — không có gì đang nghe), log container cho biết lý do, và bước rollback khởi động ảnh trước rồi nhận lại <code>phien-ban=1b2d46bf</code>. Production không phục vụ trong <strong>12,6 giây</strong>: 10 giây ngân sách kiểm cộng 2,2 giây rollback.</p>
${slide('ga-09', 17, 'Log thật của rollback: nhánh else nằm NGAY trong workflow')}<pre><code class="language-yaml">  trien-khai:
    environment: { name: ch09-production }
    concurrency: { group: ch09-production, cancel-in-progress: false }
    steps:
      - name: Hỏi production ĐANG CHẠY gì (không đoán HEAD^)
        run: |
          PREV=$(gh api "repos/&#36;{GITHUB_REPOSITORY}/contents/cd-dang-chay.txt?ref=ch09-prod" --jq .content | base64 -d)
          # ... chạy "production" bằng ch09-app:$PREV (port 19090) ...
          echo "PREV=ch09-app:$PREV" &gt;&gt; "$GITHUB_ENV"          # ghi nhớ TRƯỚC khi tráo
      - name: Tráo sang ảnh mới
        run: |
          docker rm -f ch09-prod
          docker run -d --name ch09-prod -p 19090:8080 "$ANH"
      - name: Kiểm sức khoẻ (5 lần × 2 s)
        id: kiem_suc_khoe
        run: |
          for i in 1 2 3 4 5; do
            if curl -fsS localhost:19090; then echo "khoe sau lan $i"; exit 0; fi
            sleep 2
          done
          docker logs ch09-prod 2&gt;&amp;1 | tail -3
          exit 1
      - name: Ghi "production đang chạy" = bản mới     # chỉ chạy khi xanh
        run: ...                                          # PUT cd-dang-chay.txt
      - name: TỰ rollback về ảnh trước
        if: failure() &amp;&amp; steps.kiem_suc_khoe.outcome == 'failure'
        run: |
          docker rm -f ch09-prod
          docker run -d --name ch09-prod -p 19090:8080 "$PREV"
          sleep 2; curl -fsS localhost:19090 &amp;&amp; echo "rollback XONG, production khoe lai"</code></pre>
<p>Ba chi tiết gánh toàn bộ cơ chế. <code>PREV</code> được ghi vào <code>$GITHUB_ENV</code> <em>TRƯỚC</em> khi tráo, vì sau khi tráo container cũ đã mất và không còn gì nhớ nó là gì. Bước kiểm có <code>id</code> để bước rollback hỏi CỤ THỂ rằng <em>phép kiểm</em> có hỏng không — riêng <code>failure()</code> cũng đúng khi bước tải artifact hỏng, và rollback một cú tráo chưa từng xảy ra là một sự cố riêng. Và job vẫn ĐỎ sau khi rollback thành công: deploy thất bại, production ổn, và cả hai sự thật phải tới được người đọc run.</p>
<div class="callout warn">
<p><strong>Ngân sách kiểm sức khoẻ chính là độ dài cú sập.</strong> Năm lần thử cách nhau hai giây nghĩa là ảnh hỏng được phục vụ khoảng mười giây trước khi có gì phản ứng. Ngân sách dài chịu được ảnh khởi động chậm; ngân sách ngắn thì rollback cả những ảnh khoẻ mà chỉ chậm. Chọn nó từ phép đo xem container THẬT của bạn cần bao lâu để trả lời, không từ giá trị mặc định.</p>
</div>

<h3>"Bản trước" là gì? Hỏi production, đừng đoán</h3>
${slide('ga-09', 18, '"Bản trước" không phải HEAD^ — hỏi production đang chạy gì')}
<p>Bản đầu của pipeline này đã ĐOÁN. Bước chuẩn bị của nó khởi động "production" từ commit cha, <code>HEAD^</code>, với lý lẽ rằng commit trước là thứ đang chạy. Ngay sau cuộc rollback bên trên, commit vá <code>b406a95</code> chạy <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017879471" target="_blank" rel="noopener">36017879471</a> — và ĐỎ trước khi deploy được gì. Cha của nó là <code>547a5ca</code>, chính ảnh hỏng vừa bị rollback. Production thật đang chạy <code>1b2d46bf</code>, cũ hơn nữa. Một cuộc rollback dựng trên phỏng đoán ấy sẽ "khôi phục" đúng bản hỏng.</p>
<p>Cách vá là HỎI cái đích. Trên sân tập, "máy chủ" giữ một tệp <code>cd-dang-chay.txt</code> trên nhánh <code>ch09-prod</code>, chỉ được ghi sau khi kiểm sức khoẻ xanh; lần chạy kế (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018120566" target="_blank" rel="noopener">36018120566</a>) đọc được <code>production dang chay: 1b2d46bf</code>, tráo sang <code>ff166e70</code>, rồi ghi lại. <code>deploy-nha.sh</code> làm đúng điều đó với máy chủ thật ở bước 0a: đọc mã băm ảnh của container <code>cuonghoangdev_backend</code> đang chạy, tra ra thẻ <code>ghcr.io/…:&lt;sha&gt;</code>, rồi dùng <code>git merge-base --is-ancestor</code> để từ chối mọi lần deploy KHÔNG chứa thứ production đang chạy. Chốt ấy tồn tại vì ngày 13/09 một lần deploy từ nhánh tách sớm đã lặng lẽ gỡ cả một buổi sáng làm việc khỏi production.</p>

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

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn rollback một lần deploy hỏng thế nào?</strong><br>Đ: Deploy lại ảnh trước theo thẻ SHA của nó — nó đã được dựng và đã được kiểm. Thế là xong phần mã. Với schema tôi dựa vào expand and contract để mọi trạng thái trung gian đều hợp lệ với mã trước, biến rollback schema thành rollback mã. Khôi phục dữ liệu là quy trình riêng, chậm hơn, không phải rollback.</p>
<p><strong>H: Pipeline của bạn biết rollback về đâu bằng cách nào?</strong><br>Đ: Nó hỏi đích đang chạy gì TRƯỚC khi tráo và giữ trong một biến. Nó không giả định commit cha: sau một lần rollback trước đó, commit cha chính là bản đã bị gỡ.</p>
<p><strong>H: Rollback tự động xong thì pipeline nên xanh không?</strong><br>Đ: Không. Deploy đã thất bại. Production khoẻ là sự thật thứ hai, ghi vào phần tóm tắt. Run xanh sau rollback dạy mọi người rằng thay đổi đã lên.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn thấy pipeline của chính mình tự rollback TRƯỚC khi phải cần nó lúc 3 giờ sáng.</p><ol>
<li>Trong một kho thử công khai, chép <code>.github/workflows/ch09-cd.yml</code> và thư mục <code>ch09/app/</code> từ nhánh sân tập <code>ch09-deploy</code>. Commit, rồi tạo nhánh <code>ch09-prod</code> chứa tệp <code>cd-dang-chay.txt</code> có nội dung là 8 ký tự đầu SHA của commit đó.</li>
<li>Tạm bỏ khối <code>environment:</code> (bài 9.4 sẽ thêm lại) rồi push một thay đổi trong <code>ch09/app/</code> lên nhánh tên <code>ch09-thu</code> — workflow chỉ nghe các nhánh <code>ch09-*</code>. Chờ một run xanh.</li>
<li>Đặt <code>HONG=1</code> trong <code>ch09/app/cau-hinh.env</code> rồi push. Mở run và tìm năm lần kiểm hỏng, dòng log container và <code>rollback XONG</code>.</li>
<li>Đặt lại <code>HONG=0</code> rồi push. Xem dòng log <code>production dang chay:</code> — nó phải gọi tên bản KHOẺ cuối cùng, không phải bản hỏng.</li></ol>
<p><strong>Đạt khi:</strong> bạn có ba link run (xanh, rollback, xanh), run rollback màu đỏ và có <code>rollback XONG</code> trong log, và <code>production dang chay:</code> của run thứ ba là SHA của run thứ nhất, không phải run thứ hai.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rollback (quay lui)</span><span class="v">Đặt lại bản tốt đã biết trước đó. Nhanh chỉ khi bản ấy đã được dựng sẵn.</span></div>
  <div class="kv"><span class="k">Health check (kiểm sức khoẻ)</span><span class="v">Một yêu cầu chứng minh bản mới trả lời được. Ngân sách thời gian của nó là độ dài cú sập khi deploy hỏng.</span></div>
  <div class="kv"><span class="k">PREV</span><span class="v">Bản đang chạy trước khi tráo, đọc từ đích và lưu lại trước khi đụng vào.</span></div>
  <div class="kv"><span class="k">steps.&lt;id&gt;.outcome</span><span class="v">Kết quả của MỘT bước (trước <code>continue-on-error</code>); cho phép rollback phản ứng với một lỗi cụ thể.</span></div>
  <div class="kv"><span class="k">Expand / contract (mở rộng / thu hẹp)</span><span class="v">Thêm schema mới trước, xoá schema cũ sau cùng, để mọi lần deploy ở giữa rollback được như mã.</span></div>
  <div class="kv"><span class="k">Anti-rollback guard (chốt chống lùi)</span><span class="v">Từ chối deploy commit không chứa thứ production đang chạy, trừ khi được yêu cầu rõ (<code>--cho-lui</code>).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba hình dạng rollback: deploy lại ảnh cũ (giây), revert rồi deploy lại (phút), khôi phục dữ liệu (giờ — là sự cố, không phải rollback).</li>
<li>Trên VPS thẻ ảnh cũ giờ bị dọn; ảnh cũ nằm ở GHCR, và <code>--cho-lui</code> là cờ mang tên riêng cho việc cố ý lùi.</li>
<li>Sân tập tự rollback một ảnh hỏng: sập 12,6 giây, trong đó 2,2 giây là chính cuộc rollback.</li>
<li>Lưu <code>PREV</code> trước khi tráo, đặt <code>id</code> cho bước kiểm, và để job ĐỎ sau khi rollback thành công.</li>
<li>"Bản trước" là thứ production đang chạy, không phải <code>HEAD^</code>: phỏng đoán ấy đỏ ngay ở lần chạy kế.</li>
<li>Expand and contract biến rollback schema thành rollback mã; thứ tự tráo/migrate chỉ an toàn dưới khuôn mẫu này.</li>
</ul>

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
${slide('ga-09', 20, 'environment: biến một job thành cuộc deploy có cổng')}
<p>An environment is created in <em>Settings → Environments</em>, or through the API, which is how the sandbox one was made. Everything in the right-hand table of the slide is one of these three calls:</p>
<pre><code># 1. create the environment: one required reviewer (you), self-review allowed, only chosen branches
gh api -X PUT repos/cuonghoang1103/ga-san-tap/environments/ch09-production --input - &lt;&lt;'EOF'
{"reviewers":[{"type":"User","id":125522434}],
 "prevent_self_review":false,
 "deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}
EOF
# 2. the only branch allowed to deploy into it
gh api -X POST repos/cuonghoang1103/ga-san-tap/environments/ch09-production/deployment-branch-policies \\
  -f name=ch09-deploy -f type=branch
# 3. approve (or reject) a waiting run without opening the browser
gh api repos/cuonghoang1103/ga-san-tap/actions/runs/&lt;run_id&gt;/pending_deployments \\
  --jq '.[]|{env:.environment.name,id:.environment.id,can:.current_user_can_approve}'
gh api -X POST repos/cuonghoang1103/ga-san-tap/actions/runs/&lt;run_id&gt;/pending_deployments \\
  -F 'environment_ids[]=22667155618' -f state=approved -f comment="Read: commit, image, no migration."</code></pre>
<p>Two behaviours are worth knowing before you rely on it. A job that names an environment runs <em>none</em> of its steps — and receives none of the environment&#39;s secrets — until every protection rule has passed. And by default a repository administrator can bypass the rules ("Start all waiting jobs" in the run page); on a personal repository you are the administrator, so "requires a reviewer" does not yet stop <em>you</em> unless you also disable administrator bypass. Both facts come from the GitHub documentation on deployments and environments, read on 24 September 2026.</p>
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
<div class="kv"><span class="k">wait timer</span><span class="v">between 1 and 43,200 minutes (30 days) — corrected: an earlier version of this lesson said five minutes; the documentation (read 24 September 2026) says an integer from 1. Rarely useful for deploys; occasionally useful to hold a deploy for a maintenance window</span></div>
<div class="kv"><span class="k">deployment branches policy</span><span class="v">restrict which branches can deploy to this environment. A production environment that only accepts <code>main</code> catches a wrong-branch deploy that the workflow itself would allow</span></div>
<div class="kv"><span class="k">environment-scoped secrets</span><span class="v">a secret that only exists in this environment. Combined with the branches policy, this means a leaked production key from a fork PR is impossible in principle, not just improbable</span></div>
</div>

<div class="callout ok">
<p><strong>The value of the branches policy is worth stating precisely.</strong> Without it, a workflow with the production secret in <code>secrets.PROD_KEY</code> hands that secret to any workflow file that reads it — including one committed on a branch. With it, the secret is only injected when the deploy targets the production environment, and the environment only accepts <code>main</code>. A commit to a feature branch that reads the secret gets nothing.</p>
</div>

<h3>Run it yourself: approve, reject, and a branch that is not allowed</h3>
<p>The sandbox pipeline&#39;s deploy job names <code>ch09-production</code>. Six runs went through that gate on 24 September 2026, and each one left a <em>deployment</em> record that the API can list afterwards — which is the audit trail a script run from a laptop does not produce.</p>
${slide('ga-09', 21, 'Một deployment đi qua bốn trạng thái — và API ghi lại cả bốn')}
<p>A deployment walks through <code>waiting</code> (the job is ready, the gate is closed), <code>queued</code> (approved, waiting for a runner and for the <code>ch09-production</code> concurrency group), <code>in_progress</code> (environment secrets become available here) and finally <code>success</code> or <code>failure</code>. In run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018120566" target="_blank" rel="noopener">36018120566</a> the gate was open for 7 seconds because the approval came from a script; with a human it is as long as the human takes, up to the 30-day limit on gate approval.</p>
${slide('ga-09', 22, 'Ba lần cổng nói KHÔNG, ba câu báo lỗi khác nhau')}
<p>The three "no" answers are different on purpose and produce different messages. A reviewer&#39;s rejection (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018283303" target="_blank" rel="noopener">36018283303</a>, comment "dang gio cao diem, deploy sau 22h") ends the job with <em>The deployment was rejected or didn&#39;t satisfy other protection rules.</em> A push from a branch that is not in the policy (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017890545" target="_blank" rel="noopener">36017890545</a>, branch <code>ch09-nhanh-la</code>) is refused before any human is asked: <em>Branch "ch09-nhanh-la" is not allowed to deploy to ch09-production due to environment protection rules.</em> The build job of that run still ran green — the gate protects the target, not the CI.</p>
<div class="out">gh api "repos/cuonghoang1103/ga-san-tap/deployments?environment=ch09-production" + /statuses
6641181764 edb5b3ed ch09-deploy   15:11:32  failure &lt;- waiting                          (rejected)
6641150190 ff166e70 ch09-deploy   15:10:09  success &lt;- in_progress &lt;- queued &lt;- waiting
6641109452 42d7937f ch09-nhanh-la 15:08:17  failure &lt;- waiting &lt;- waiting              (branch policy)
6641108459 b406a958 ch09-deploy   15:08:14  failure &lt;- in_progress &lt;- queued &lt;- waiting
6641062225 547a5cab ch09-deploy   15:06:10  failure &lt;- in_progress &lt;- queued &lt;- waiting
6640979876 78efe782 ch09-deploy   15:02:29  success &lt;- in_progress &lt;- queued &lt;- waiting</div>
<div class="callout">
<p><strong>The comment is the valuable part.</strong> <code>gh api …/runs/&lt;id&gt;/approvals</code> returns who approved or rejected, when, and what they wrote. "Read: commit 78efe78, image ch09-app:78efe78, no migration. Approve." is a record that a reviewer looked at something. An approval with an empty comment is the "reviewer always says yes" trap from the pitfall below, written down.</p>
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

<div class="callout ok">
<p><strong>Update, 24 September 2026.</strong> The table above was written when the folder held 11 workflows. Of the three added since, <code>ship-lab211.yml</code> (pushes lesson content to production over SSH) and <code>ssh-port-apply.yml</code> (installs a second sshd service on the VPS) both touch production and would belong in the "yes" column; <code>ssh-port-diagnostic.yml</code> is read-only. Still 0 of 14 declare <code>environment:</code>.</p>
</div>

<h3>What your plan allows (September 2026)</h3>
${slide('ga-09', 23, 'Luật environment tuỳ gói và kho công khai/riêng tư (09/2026)')}
<p>Environment protection is one of the features whose availability depends on both the plan and the repository&#39;s visibility. For public repositories every rule is available on every plan. For private repositories on GitHub Free there are no required reviewers, no wait timer, no branch rules and no environment secrets; GitHub Pro and Team add branch rules and environment secrets for private repositories, but still not required reviewers or wait timers; Enterprise has all of them. <code>api-backend</code> is public, so every rule in this lesson is available to it today.</p>

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
<p><strong>Trap — the reviewer who always approves.</strong> A required reviewer who says yes to every deploy provides paperwork, not a gate. The value of the human step is that the human <em>reads</em>: the commit range, the changed files, the migration. If the workflow does not surface those to the approver, the reviewer approves what they cannot see, which is worse than no approval. Include the deploy summary in the workflow — commit range, changed files, migration count — as a comment or a job summary before the environment gate.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> The human pressing a button is a real control today and stops being one the day there are two people or one schedule — and <code>environment:</code> is the mechanism that survives that transition, so the time to add it is <em>before</em> the transition, not after.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: How would you require approval before a production deploy in GitHub Actions?</strong><br>A: Put the deploy job in an environment with required reviewers and a deployment branch policy that allows only <code>main</code> or release tags. The job waits before any step runs and gets the environment&#39;s secrets only after approval. I would disable administrator bypass and prevent self-review if the team is large enough.</p>
<p><strong>Q: What is the difference between a repository secret and an environment secret?</strong><br>A: A repository secret is available to any workflow in the repository that references it. An environment secret is only given to jobs that reference that environment, and only after its rules pass — so a workflow on a feature branch cannot read the production key if the branch policy excludes it.</p>
<p><strong>Q: A reviewer approves everything. Is the gate useless?</strong><br>A: Nearly. Put the commit range, the image tag and the migrations in the job summary before the gate, and ask for a comment with the approval. Then the approval is evidence that someone read something.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you want your test pipeline from lesson 9.3 to wait for you before it touches "production".</p><ol>
<li>In your public test repository create an environment <code>thu-production</code> (Settings → Environments, or the <code>gh api -X PUT …/environments/…</code> call above) with yourself as required reviewer and a branch rule that allows only <code>ch09-thu</code>.</li>
<li>Put <code>environment: { name: thu-production }</code> back on the deploy job and push to <code>ch09-thu</code>. Approve it with a comment — in the browser or with <code>pending_deployments</code>.</li>
<li>Push again and <em>reject</em> it with a comment.</li>
<li>Create a branch <code>ch09-khac</code>, push a change under <code>ch09/app/</code>, and find the "is not allowed to deploy" annotation.</li>
<li>List your deployments with <code>gh api "repos/&lt;you&gt;/&lt;repo&gt;/deployments?environment=thu-production"</code> and read each one&#39;s statuses.</li></ol>
<p><strong>Done when:</strong> you have three run links (approved, rejected, branch refused), the approvals API shows your two comments, and the deployments list shows one <code>success</code> and two <code>failure</code> records for your environment.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment (môi trường triển khai)</span><span class="v">A named target with its own rules and secrets; a job joins it with <code>environment:</code>.</span></div>
  <div class="kv"><span class="k">Required reviewers (người duyệt bắt buộc)</span><span class="v">Up to six users or teams; one approval lets the job continue.</span></div>
  <div class="kv"><span class="k">Deployment branch policy (luật nhánh)</span><span class="v">Which branches or tags may deploy to the environment; others fail before any review.</span></div>
  <div class="kv"><span class="k">Wait timer (bộ hẹn chờ)</span><span class="v">1–43,200 minutes of forced waiting before the job starts.</span></div>
  <div class="kv"><span class="k">Environment secret (bí mật môi trường)</span><span class="v">Given only to jobs in that environment, and only after its rules pass.</span></div>
  <div class="kv"><span class="k">Deployment (bản ghi triển khai)</span><span class="v">The record GitHub keeps per job that uses an environment, with statuses waiting → queued → in_progress → success/failure.</span></div>
  <div class="kv"><span class="k">Admin bypass (quản trị vượt cổng)</span><span class="v">On by default: an administrator can start waiting jobs without review.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>environment:</code> turns a job into a gated deployment: no step and no environment secret before the rules pass.</li>
<li>On the sandbox the same gate approved one run, rejected another with a comment, and refused a whole branch before asking anyone.</li>
<li>Every gated job leaves a deployment record with statuses; the approvals API keeps who decided and what they wrote.</li>
<li>Rules depend on plan and visibility; <code>api-backend</code> is public, so all of them are available.</li>
<li>Administrators bypass by default — on your own repository that includes you.</li>
<li>A gate is worth only what the reviewer reads; put commit, image and migrations in front of the gate.</li>
</ul>

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
${slide('ga-09', 20, 'environment: biến một job thành cuộc deploy có cổng')}
<p>Environment được tạo ở <em>Settings → Environments</em>, hoặc qua API — cách tạo cái của sân tập. Mọi thứ trong bảng bên phải của slide là một trong ba lời gọi sau:</p>
<pre><code># 1. tạo environment: một người duyệt bắt buộc (bạn), cho tự duyệt, chỉ nhánh được chọn
gh api -X PUT repos/cuonghoang1103/ga-san-tap/environments/ch09-production --input - &lt;&lt;'EOF'
{"reviewers":[{"type":"User","id":125522434}],
 "prevent_self_review":false,
 "deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}
EOF
# 2. nhánh DUY NHẤT được deploy vào nó
gh api -X POST repos/cuonghoang1103/ga-san-tap/environments/ch09-production/deployment-branch-policies \\
  -f name=ch09-deploy -f type=branch
# 3. duyệt (hoặc từ chối) một run đang chờ mà không mở trình duyệt
gh api repos/cuonghoang1103/ga-san-tap/actions/runs/&lt;run_id&gt;/pending_deployments \\
  --jq '.[]|{env:.environment.name,id:.environment.id,can:.current_user_can_approve}'
gh api -X POST repos/cuonghoang1103/ga-san-tap/actions/runs/&lt;run_id&gt;/pending_deployments \\
  -F 'environment_ids[]=22667155618' -f state=approved -f comment="Read: commit, image, no migration."</code></pre>
<p>Có hai hành vi nên biết trước khi dựa vào nó. Một job gọi tên environment sẽ KHÔNG chạy bước nào — và KHÔNG nhận bí mật nào của environment — cho tới khi mọi luật bảo vệ qua. Và mặc định quản trị viên của kho vượt được luật ("Start all waiting jobs" trên trang run); với kho cá nhân thì bạn chính là quản trị viên, nên "cần người duyệt" chưa chặn được <em>bạn</em>, trừ khi tắt luôn quyền vượt của quản trị viên. Cả hai điều lấy từ tài liệu GitHub về deployments và environments, đọc ngày 24/09/2026.</p>
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
<div class="kv"><span class="k">bộ hẹn chờ</span><span class="v">từ 1 tới 43.200 phút (30 ngày) — đã sửa: bản trước của bài ghi "từ năm phút"; tài liệu (đọc 24/09/2026) nói một số nguyên từ 1. Hiếm khi hữu ích cho deploy; thỉnh thoảng hữu ích để giữ một cuộc deploy chờ khung bảo trì</span></div>
<div class="kv"><span class="k">chính sách nhánh deploy</span><span class="v">giới hạn nhánh nào deploy được vào environment này. Một environment production chỉ chấp nhận <code>main</code> bắt được một cuộc deploy sai-nhánh mà chính workflow sẽ cho phép</span></div>
<div class="kv"><span class="k">bí mật khoanh theo environment</span><span class="v">một bí mật CHỈ tồn tại trong environment này. Kết hợp với chính sách nhánh, nghĩa là một bí mật production rò từ một PR fork là BẤT KHẢ về nguyên tắc, không chỉ là ít khả năng</span></div>
</div>

<div class="callout ok">
<p><strong>Giá trị của chính sách nhánh đáng phát biểu cho chính xác.</strong> Không có nó, một workflow có bí mật production ở <code>secrets.PROD_KEY</code> TRAO bí mật ấy cho bất kỳ tệp workflow nào đọc nó — kể cả một tệp commit trên một nhánh. Có nó, bí mật chỉ được BƠM VÀO khi deploy nhắm tới environment production, và environment chỉ chấp nhận <code>main</code>. Một commit lên nhánh tính năng đọc bí mật thì nhận CON SỐ KHÔNG.</p>
</div>

<h3>Chạy thử: duyệt, từ chối, và một nhánh không được phép</h3>
<p>Job deploy của pipeline sân tập gọi tên <code>ch09-production</code>. Sáu lần chạy đi qua cổng ấy ngày 24/09/2026, và mỗi lần để lại một bản ghi <em>deployment</em> mà API liệt kê lại được sau này — đúng cái sổ kiểm toán mà một script chạy từ laptop không tạo ra.</p>
${slide('ga-09', 21, 'Một deployment đi qua bốn trạng thái — và API ghi lại cả bốn')}
<p>Một deployment đi qua <code>waiting</code> (job sẵn sàng, cổng đóng), <code>queued</code> (đã duyệt, chờ runner và chờ nhóm concurrency <code>ch09-production</code>), <code>in_progress</code> (bí mật environment mở ra từ đây) và cuối cùng <code>success</code> hoặc <code>failure</code>. Ở run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018120566" target="_blank" rel="noopener">36018120566</a> cổng mở trong 7 giây vì người duyệt là một script; với con người thì nó dài bằng thời gian người đó cần, tối đa tới giới hạn 30 ngày chờ duyệt.</p>
${slide('ga-09', 22, 'Ba lần cổng nói KHÔNG, ba câu báo lỗi khác nhau')}
<p>Ba câu trả lời "KHÔNG" khác nhau có chủ ý và sinh ra ba thông báo khác nhau. Người duyệt từ chối (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36018283303" target="_blank" rel="noopener">36018283303</a>, lời bình "dang gio cao diem, deploy sau 22h") kết thúc job bằng <em>The deployment was rejected or didn&#39;t satisfy other protection rules.</em> Một cú push từ nhánh không có trong luật (<a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017890545" target="_blank" rel="noopener">36017890545</a>, nhánh <code>ch09-nhanh-la</code>) bị chặn trước khi hỏi bất kỳ ai: <em>Branch "ch09-nhanh-la" is not allowed to deploy to ch09-production due to environment protection rules.</em> Job dựng của run đó vẫn xanh — cổng bảo vệ cái đích, không bảo vệ CI.</p>
<div class="out">gh api "repos/cuonghoang1103/ga-san-tap/deployments?environment=ch09-production" + /statuses
6641181764 edb5b3ed ch09-deploy   15:11:32  failure &lt;- waiting                          (rejected)
6641150190 ff166e70 ch09-deploy   15:10:09  success &lt;- in_progress &lt;- queued &lt;- waiting
6641109452 42d7937f ch09-nhanh-la 15:08:17  failure &lt;- waiting &lt;- waiting              (branch policy)
6641108459 b406a958 ch09-deploy   15:08:14  failure &lt;- in_progress &lt;- queued &lt;- waiting
6641062225 547a5cab ch09-deploy   15:06:10  failure &lt;- in_progress &lt;- queued &lt;- waiting
6640979876 78efe782 ch09-deploy   15:02:29  success &lt;- in_progress &lt;- queued &lt;- waiting</div>
<div class="callout">
<p><strong>Lời bình mới là phần đáng giá.</strong> <code>gh api …/runs/&lt;id&gt;/approvals</code> trả về ai duyệt hay từ chối, lúc nào, và họ viết gì. "Da doc: commit 78efe78, anh ch09-app:78efe78, khong migration. Duyet." là bằng chứng rằng người duyệt đã NHÌN một thứ gì đó. Một lần duyệt với lời bình trống chính là cái bẫy "người duyệt luôn nói có" ở phần bẫy bên dưới, được ghi thành văn bản.</p>
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

<div class="callout ok">
<p><strong>Cập nhật 24/09/2026.</strong> Bảng trên được viết khi thư mục có 11 workflow. Trong ba cái thêm sau, <code>ship-lab211.yml</code> (đẩy nội dung bài giảng lên production qua SSH) và <code>ssh-port-apply.yml</code> (cài thêm một dịch vụ sshd trên VPS) đều chạm production và thuộc cột "CÓ"; <code>ssh-port-diagnostic.yml</code> chỉ đọc. Vẫn 0 trên 14 khai <code>environment:</code>.</p>
</div>

<h3>Gói của bạn cho phép gì (09/2026)</h3>
${slide('ga-09', 23, 'Luật environment tuỳ gói và kho công khai/riêng tư (09/2026)')}
<p>Bảo vệ environment là một trong những tính năng mà việc có hay không phụ thuộc cả GÓI lẫn việc kho CÔNG KHAI hay RIÊNG TƯ. Với kho công khai, mọi luật có ở mọi gói. Với kho riêng tư ở gói GitHub Free thì không có người duyệt bắt buộc, không bộ hẹn chờ, không luật nhánh, không bí mật environment; GitHub Pro và Team thêm luật nhánh và bí mật environment cho kho riêng tư, nhưng vẫn không có người duyệt bắt buộc hay bộ hẹn chờ; Enterprise có tất cả. <code>api-backend</code> là kho công khai, nên mọi luật trong bài này hôm nay đều dùng được.</p>

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

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Bạn bắt buộc phải duyệt trước khi deploy production trong GitHub Actions thế nào?</strong><br>Đ: Đặt job deploy vào một environment có người duyệt bắt buộc và luật nhánh chỉ cho <code>main</code> hoặc tag phát hành. Job chờ trước khi chạy bất kỳ bước nào và chỉ nhận bí mật của environment sau khi được duyệt. Đội đủ lớn thì tôi tắt quyền vượt của quản trị viên và cấm tự duyệt.</p>
<p><strong>H: Bí mật của kho khác bí mật của environment ở đâu?</strong><br>Đ: Bí mật của kho có cho mọi workflow trong kho gọi tới nó. Bí mật environment chỉ trao cho job gọi environment đó, và chỉ sau khi luật của nó qua — nên workflow trên nhánh tính năng không đọc được khoá production nếu luật nhánh loại nhánh ấy ra.</p>
<p><strong>H: Người duyệt cái gì cũng duyệt. Cổng có vô dụng không?</strong><br>Đ: Gần như. Đưa khoảng commit, thẻ ảnh và migration vào phần tóm tắt job TRƯỚC cổng, và đòi lời bình kèm lần duyệt. Khi đó lần duyệt là bằng chứng có người đã đọc một thứ gì đó.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn muốn pipeline thử ở bài 9.3 CHỜ bạn trước khi chạm "production".</p><ol>
<li>Trong kho thử công khai, tạo environment <code>thu-production</code> (Settings → Environments, hoặc lời gọi <code>gh api -X PUT …/environments/…</code> ở trên) với chính bạn là người duyệt bắt buộc và luật nhánh chỉ cho <code>ch09-thu</code>.</li>
<li>Đặt lại <code>environment: { name: thu-production }</code> trên job deploy rồi push lên <code>ch09-thu</code>. Duyệt kèm lời bình — trên trình duyệt hoặc bằng <code>pending_deployments</code>.</li>
<li>Push lần nữa và <em>TỪ CHỐI</em> kèm lời bình.</li>
<li>Tạo nhánh <code>ch09-khac</code>, push một thay đổi trong <code>ch09/app/</code>, rồi tìm annotation "is not allowed to deploy".</li>
<li>Liệt kê deployments bằng <code>gh api "repos/&lt;bạn&gt;/&lt;kho&gt;/deployments?environment=thu-production"</code> và đọc statuses của từng cái.</li></ol>
<p><strong>Đạt khi:</strong> bạn có ba link run (được duyệt, bị từ chối, nhánh bị chặn), API approvals hiện hai lời bình của bạn, và danh sách deployments có một bản ghi <code>success</code> và hai bản ghi <code>failure</code> cho environment của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Environment (môi trường triển khai)</span><span class="v">Một đích có tên, có luật và bí mật riêng; job gia nhập bằng <code>environment:</code>.</span></div>
  <div class="kv"><span class="k">Required reviewers (người duyệt bắt buộc)</span><span class="v">Tối đa sáu người hoặc nhóm; một lần duyệt là job đi tiếp.</span></div>
  <div class="kv"><span class="k">Deployment branch policy (luật nhánh)</span><span class="v">Nhánh hay tag nào được deploy vào environment; còn lại hỏng trước khi ai được hỏi.</span></div>
  <div class="kv"><span class="k">Wait timer (bộ hẹn chờ)</span><span class="v">1–43.200 phút chờ bắt buộc trước khi job bắt đầu.</span></div>
  <div class="kv"><span class="k">Environment secret (bí mật môi trường)</span><span class="v">Chỉ trao cho job trong environment đó, và chỉ sau khi luật qua.</span></div>
  <div class="kv"><span class="k">Deployment (bản ghi triển khai)</span><span class="v">Bản ghi GitHub giữ cho mỗi job dùng environment, với trạng thái waiting → queued → in_progress → success/failure.</span></div>
  <div class="kv"><span class="k">Admin bypass (quản trị vượt cổng)</span><span class="v">Bật sẵn: quản trị viên khởi động được job đang chờ mà không cần duyệt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>environment:</code> biến một job thành cuộc deploy có cổng: không bước nào, không bí mật environment nào trước khi luật qua.</li>
<li>Trên sân tập, cùng một cổng đã duyệt một run, từ chối một run kèm lời bình, và chặn cả một nhánh trước khi hỏi ai.</li>
<li>Mỗi job qua cổng để lại một bản ghi deployment có trạng thái; API approvals giữ ai quyết và họ viết gì.</li>
<li>Luật tuỳ gói và tuỳ công khai/riêng tư; <code>api-backend</code> công khai nên dùng được hết.</li>
<li>Quản trị viên mặc định vượt được cổng — ở kho của bạn, đó là chính bạn.</li>
<li>Cổng chỉ đáng giá bằng thứ người duyệt ĐỌC; đưa commit, ảnh và migration ra trước cổng.</li>
</ul>

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
${slide('ga-09', 25, 'Gửi gì, cho ai, qua đâu — xanh không phải tin tức')}
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
    SLACK_WEBHOOK: &#36;{{ secrets.SLACK_WEBHOOK }}
    SLACK_TITLE: 'Deploy hong: &#36;{{ github.workflow }}'
    SLACK_MESSAGE: |
      Commit: <&#36;{{ github.event.head_commit.url }}|&#36;{{ github.sha }}>
      Ket qua buoc deploy: &#36;{{ steps.deploy.outcome }}
      Log: &#36;{{ github.server_url }}/&#36;{{ github.repository }}/actions/runs/&#36;{{ github.run_id }}
    SLACK_COLOR: danger</code></pre>

<div class="callout">
<p><strong>Read the <code>if:</code> line carefully.</strong> Two conditions have to be true: something failed, and this is a run against <code>main</code>. Without the second, every failed CI run on every PR pings the channel — the noisy version measured above. The condition names the class of failure worth waking somebody up for.</p>
</div>

<div class="callout warn">
<p><strong>Two corrections to the template above.</strong> The line that used to read "failed at step: <code>steps.deploy.outcome</code>" was wrong: <code>outcome</code> is the <em>result</em> of the step with id <code>deploy</code> (<code>success</code>, <code>failure</code>, <code>cancelled</code> or <code>skipped</code>), not the name of the step that broke — it now says so. And <code>github.event.head_commit.url</code> exists only on <code>push</code> events; on <code>workflow_dispatch</code> it is empty, so for a manual deploy build the link from <code>github.server_url</code>, <code>github.repository</code> and <code>github.sha</code> instead.</p>
</div>

<h3>A message that needs no external service: job summary and annotation</h3>
${slide('ga-09', 24, 'Thông báo rẻ nhất: tóm tắt job + một annotation lỗi')}
<p>Before a webhook, a bot or a paid integration, GitHub already gives you two channels that cost nothing and cannot leak a secret to a third party. The <strong>job summary</strong>: any Markdown a step appends to the file named in <code>$GITHUB_STEP_SUMMARY</code> is shown on the run&#39;s summary page, above the logs. The <strong>annotation</strong>: a line <code>::error title=…::message</code> printed to the log becomes a red box on the same page and in the checks of the commit, and it can be read back through the API. The sandbox deploy job writes both, and run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017616624" target="_blank" rel="noopener">36017616624</a> — the one that rolled back — shows what a reader sees without opening a single log line: commit, image it tried, health check <code>failure</code>, image production actually runs, 13 seconds.</p>
<div class="out">gh api repos/cuonghoang1103/ga-san-tap/check-runs/&lt;job_id&gt;/annotations --jq '.[]|[.annotation_level,.title,.message]|@tsv'
warning             Node.js 20 is deprecated. The following actions target Node.js 20 but are being
                    forced to run on Node.js 24: actions/checkout@v4, actions/download-artifact@v4. ...
failure  Deploy hong  547a5cab khong qua kiem suc khoe, da rollback ve ch09-app:1b2d46bf
failure             Process completed with exit code 1.</div>
<p>Three rules make this work. Write the summary with <code>if: always()</code>, so a red run still says what production is running. Write the error with <code>if: failure()</code>, so green runs stay silent. And put the <em>state of the target</em> in the message, not just the state of the run — "deploy failed" sends someone to the logs, "deploy failed, production is back on 1b2d46bf" tells them whether to get up. Summaries are limited to 1 MiB per step and 20 displayed per job, and secrets written into them are masked (documentation read 24 September 2026). The first annotation above is a bonus: a real deprecation warning, <code>actions/checkout@v4</code> still targets Node.js 20 — the kind of message you only notice if you read annotations.</p>
<p>And GitHub already sends one notification for free: if you enable email or web notifications for Actions, you are notified when a run <em>you triggered</em> completes, and you can choose "failed runs only". For a scheduled workflow the notification goes to the person who last changed its cron line. That is often enough for one person; the webhook is for when the person who must react is not the person who pushed.</p>

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
<p><strong>Trap — the notification that has no context.</strong> "CI failed on main" with a run URL and nothing else forces the recipient to open a browser, wait for it to load, and read the log — the exact thing the notification was meant to alert them to. Include the failing step&#39;s name, the exit code from 8.1, and the commit URL. Then the message on somebody&#39;s phone is enough to know whether it needs the on-call to log in or can wait until morning.</p>
</div>

<h3>What this repository does today</h3>
${slide('ga-09', 26, 'Script của bạn đã có thông báo: ba chỗ gọi bao-tin.sh')}
<div class="callout ok">
<p><strong>Update, 24 September 2026 — the script does send messages.</strong> The <code>grep</code> below is still right about <code>.github/workflows/</code>: no workflow sends anything. But <code>deploy-nha.sh</code> sends a Telegram message through <code>$HOME/bin/bao-tin.sh</code> on the home machine in exactly three cases: step 5c finds the containers healthy but the site returns 502 from outside; step 8&#39;s CI checks fail, so production runs the new commit but GitHub was not updated; and the final hash check finds that someone swapped another image over this deploy. Every other outcome stays in the terminal the operator is watching. That is the "send less" rule of this lesson, already applied.</p>
<p>The history behind it is the best argument for the rule. Until 6 September step 8 <em>asked</em> for approval over Telegram and waited 15 minutes. On one day four deploys in a row timed out, each logged "not pushing" and finished <strong>green</strong>, and 288 commits piled up on one machine. A message that waits for an answer is a gate; when a gate times out it must fail loudly, not quietly take the safe branch.</p>
</div>
<div class="out">grep 'SLACK\\|DISCORD\\|EMAIL\\|notif' .github/workflows/*.yml    -> 0 matches

khong workflow nao gui thong bao. Ai dung ma soi ket qua.
CLAUDE.md quy dinh nguoi vien hanh chay &#96;bash deploy-nha.sh&#96; va CHO TAY ma xac nhan.</div>

<div class="callout ok">
<p><strong>Zero notifications is a defensible position when zero workflows deploy automatically.</strong> The human running <code>deploy-nha.sh</code> is watching the terminal — the deploy script itself is the notification channel, and its output is streaming to the operator&#39;s screen. That reasoning holds as long as the trigger is <code>workflow_dispatch</code> plus a human. It stops holding the day a schedule fires a deploy at 3am, or the day two people are deploying and the second one needs to know the first is still running.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> A notification is a message that has to be worth interrupting somebody for, and the only way to keep it worth it is to send fewer of them — starting with zero, adding one when a production deploy fails, and stopping there unless a specific gap in the operator&#39;s workflow demands more.</p>
</div>

<h3>When a message must leave GitHub: the webhook, done safely</h3>
<p>Sometimes the person who must react does not watch GitHub: an on-call phone, a team channel. Then a webhook is the right tool, and four details decide whether it helps or hurts. The URL is a credential — anyone who has it can post to your channel — so it lives in a secret and is passed through <code>env:</code>, never interpolated into the script and never printed. The message is built with <code>jq</code> so a commit message with quotes cannot break the JSON (the same reason Chapter 6 passes untrusted text through <code>env:</code>). The call has <code>--fail</code> and a timeout, so a dead webhook fails visibly instead of hanging the job. And the step has a <strong>dry-run mode</strong>: with no secret it prints what it would have sent as a <code>::notice</code> and exits 0.</p>
<pre><code class="language-yaml">      - name: Notify on deploy failure (webhook, with a dry-run mode)
        if: failure() &amp;&amp; github.ref == 'refs/heads/main'
        env:
          WEBHOOK: &#36;{{ secrets.DEPLOY_WEBHOOK }}          # never echo it
          TEXT: &gt;-
            Deploy &#36;{{ github.sha }} FAILED at health check.
            Production is back on &#36;{{ env.PREV }}.
            &#36;{{ github.server_url }}/&#36;{{ github.repository }}/actions/runs/&#36;{{ github.run_id }}
        run: |
          if [ -z "$WEBHOOK" ]; then
            echo "::notice title=Notify skipped::no DEPLOY_WEBHOOK secret — would have sent: $TEXT"
            exit 0
          fi
          jq -n --arg t "$TEXT" '{text: $t}' |
            curl --fail --silent --show-error --max-time 10 -H 'Content-Type: application/json' -d @- "$WEBHOOK"</code></pre>
<p>That last detail is the same pattern this repository already uses for a different reason: the CV fabrication test in <code>ci-lint.yml</code> skips and stays green while its API key secret is deliberately absent. A notification step that can run without its secret is a step you can test on every branch and every fork; a step that only works with the real webhook is a step you first exercise during a real incident. The sandbox deliberately stops at the dry-run: no message is sent anywhere.</p>
<div class="callout">
<p><strong>A digest beats ten pings.</strong> For everything that is not a production failure — flaky tests, slow runs, a cleanup cron that warned — a daily digest is kinder than live messages: one scheduled job that runs <code>gh run list --status failure --created "&gt;=$(date -u -d yesterday +%F)"</code>, formats the list, and sends one message (or writes one job summary). The people reading it can triage at a time they choose.</p>
</div>

<div class="callout">
<p><strong>Interview questions you will hear.</strong></p>
<p><strong>Q: What should a deploy failure notification contain?</strong><br>A: What failed (workflow, step, exit code), what production is running <em>now</em>, the commit, and the run link. The reader should know from the message alone whether they must act immediately.</p>
<p><strong>Q: Should the pipeline notify on success?</strong><br>A: Record it — job summary, deployment status, a low-priority channel — but do not page. A channel that pings on every green run gets muted, and then the red one is missed.</p>
<p><strong>Q: How do you show results in GitHub Actions without a third-party service?</strong><br>A: Append Markdown to <code>$GITHUB_STEP_SUMMARY</code> with <code>if: always()</code>, and print <code>::error title=…::…</code> on failure so it becomes an annotation. Both are visible on the run page and readable through the API.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your test pipeline from lessons 9.3–9.4 rolls back correctly, but nobody would know unless they opened the logs.</p><ol>
<li>Add a step with <code>if: always()</code> that appends a Markdown table to <code>"$GITHUB_STEP_SUMMARY"</code>: commit, image tried, health result, image production runs, duration.</li>
<li>Add a step with <code>if: failure()</code> that prints <code>::error title=Deploy failed::…</code> naming the image production went back to.</li>
<li>Push a good change and a <code>HONG=1</code> change. Open both run pages without opening any log.</li>
<li>Read the annotations of the failed job through <code>gh api repos/&lt;you&gt;/&lt;repo&gt;/check-runs/&lt;job_id&gt;/annotations</code>.</li>
<li>In your GitHub notification settings, set Actions to "failed runs only" and check that only the second run reached you.</li></ol>
<p><strong>Done when:</strong> both runs have a summary table on their page, the failed run shows a red "Deploy failed" annotation naming the rolled-back image, the API returns that annotation, and you received exactly one notification.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job summary (tóm tắt job)</span><span class="v">Markdown appended to <code>$GITHUB_STEP_SUMMARY</code>; shown on the run page. 1 MiB per step.</span></div>
  <div class="kv"><span class="k">Annotation (chú thích lỗi)</span><span class="v">A message created by <code>::error</code>/<code>::warning</code>/<code>::notice</code>; shown on the run and the commit checks, readable through the API.</span></div>
  <div class="kv"><span class="k">Alert fatigue (nhờn cảnh báo)</span><span class="v">People stop reading a channel that sends too much; the important message is lost among the rest.</span></div>
  <div class="kv"><span class="k">Page (gọi trực)</span><span class="v">A message meant to interrupt someone now. Only for production failures that need a human.</span></div>
  <div class="kv"><span class="k">if: always() / if: failure()</span><span class="v">Run a step whatever happened / only if something before it failed.</span></div>
  <div class="kv"><span class="k">Webhook</span><span class="v">A URL that receives a message (Slack, Discord, Telegram bot). Stored as a secret; never printed.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A deploy failure is the one message that always deserves to be sent; green runs are records, not news.</li>
<li>Job summary with <code>if: always()</code> and <code>::error</code> with <code>if: failure()</code> cover most needs without any external service.</li>
<li>Put the state of production in the message, not only the state of the run.</li>
<li>GitHub already notifies whoever triggered a run; "failed runs only" is one setting.</li>
<li><code>deploy-nha.sh</code> sends a message in exactly three cases: 502 from outside, push skipped, image overwritten.</li>
<li>A message that waits for a reply is a gate; when it times out it must fail loudly (the 288-commit lesson).</li>
</ul>

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
${slide('ga-09', 25, 'Gửi gì, cho ai, qua đâu — xanh không phải tin tức')}
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
    SLACK_WEBHOOK: &#36;{{ secrets.SLACK_WEBHOOK }}
    SLACK_TITLE: 'Deploy hong: &#36;{{ github.workflow }}'
    SLACK_MESSAGE: |
      Commit: <&#36;{{ github.event.head_commit.url }}|&#36;{{ github.sha }}>
      Ket qua buoc deploy: &#36;{{ steps.deploy.outcome }}
      Log: &#36;{{ github.server_url }}/&#36;{{ github.repository }}/actions/runs/&#36;{{ github.run_id }}
    SLACK_COLOR: danger</code></pre>

<div class="callout">
<p><strong>Đọc kỹ cái dòng <code>if:</code>.</strong> Hai điều kiện phải đúng: có thứ gì hỏng, và đây là lần chạy trên <code>main</code>. Không có cái thứ hai, mọi lần chạy CI hỏng trên mọi PR ping cả kênh — phiên bản ồn ào đã đo bên trên. Cái điều kiện gọi tên LỚP cú hỏng đáng đánh thức ai đó.</p>
</div>

<div class="callout warn">
<p><strong>Hai đính chính cho mẫu bên trên.</strong> Dòng từng ghi "bị hỏng ở bước: <code>steps.deploy.outcome</code>" là SAI: <code>outcome</code> là <em>KẾT QUẢ</em> của bước có id <code>deploy</code> (<code>success</code>, <code>failure</code>, <code>cancelled</code> hoặc <code>skipped</code>), không phải tên bước bị hỏng — giờ đã ghi đúng như vậy. Và <code>github.event.head_commit.url</code> chỉ có ở sự kiện <code>push</code>; với <code>workflow_dispatch</code> nó rỗng, nên deploy chạy tay thì dựng link từ <code>github.server_url</code>, <code>github.repository</code> và <code>github.sha</code>.</p>
</div>

<h3>Tin nhắn không cần dịch vụ ngoài: tóm tắt job và annotation</h3>
${slide('ga-09', 24, 'Thông báo rẻ nhất: tóm tắt job + một annotation lỗi')}
<p>Trước webhook, bot hay tích hợp trả phí, GitHub đã cho bạn hai kênh không tốn gì và không thể làm lộ bí mật cho bên thứ ba. <strong>Tóm tắt job</strong>: mọi đoạn Markdown một bước ghi thêm vào tệp có tên trong <code>$GITHUB_STEP_SUMMARY</code> sẽ hiện trên trang tóm tắt của run, phía trên log. <strong>Annotation</strong>: một dòng <code>::error title=…::nội dung</code> in ra log trở thành một ô đỏ trên cùng trang đó và trong phần checks của commit, và đọc lại được qua API. Job deploy của sân tập ghi cả hai, và run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36017616624" target="_blank" rel="noopener">36017616624</a> — lần đã rollback — cho thấy người đọc thấy gì mà không cần mở một dòng log nào: commit, ảnh định tráo, kiểm sức khoẻ <code>failure</code>, ảnh production thật sự đang chạy, 13 giây.</p>
<div class="out">gh api repos/cuonghoang1103/ga-san-tap/check-runs/&lt;job_id&gt;/annotations --jq '.[]|[.annotation_level,.title,.message]|@tsv'
warning             Node.js 20 is deprecated. The following actions target Node.js 20 but are being
                    forced to run on Node.js 24: actions/checkout@v4, actions/download-artifact@v4. ...
failure  Deploy hong  547a5cab khong qua kiem suc khoe, da rollback ve ch09-app:1b2d46bf
failure             Process completed with exit code 1.</div>
<p>Ba quy tắc làm nó chạy được. Ghi tóm tắt với <code>if: always()</code>, để run đỏ vẫn nói được production đang chạy gì. Ghi lỗi với <code>if: failure()</code>, để run xanh im lặng. Và đưa <em>TRẠNG THÁI CỦA ĐÍCH</em> vào tin, không chỉ trạng thái của run — "deploy hỏng" bắt người ta đi đọc log, "deploy hỏng, production đã về 1b2d46bf" cho họ biết có cần dậy không. Tóm tắt giới hạn 1 MiB mỗi bước và hiển thị tối đa 20 cái mỗi job, và bí mật lỡ ghi vào sẽ bị che (tài liệu đọc 24/09/2026). Annotation đầu tiên ở trên là quà tặng: một cảnh báo khai tử THẬT, <code>actions/checkout@v4</code> vẫn nhắm Node.js 20 — loại tin bạn chỉ để ý khi có đọc annotation.</p>
<p>Và GitHub đã gửi sẵn một thông báo miễn phí: nếu bạn bật thông báo email hoặc web cho Actions, bạn được báo khi một run <em>DO BẠN khởi động</em> kết thúc, và có thể chọn "chỉ run hỏng". Với workflow chạy theo lịch, thông báo đi tới người sửa dòng cron gần nhất. Với một người thì thường thế là đủ; webhook dành cho lúc người phải phản ứng KHÔNG phải người đã push.</p>

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
${slide('ga-09', 26, 'Script của bạn đã có thông báo: ba chỗ gọi bao-tin.sh')}
<div class="callout ok">
<p><strong>Cập nhật 24/09/2026 — script CÓ gửi tin.</strong> Lệnh <code>grep</code> bên dưới vẫn đúng với <code>.github/workflows/</code>: không workflow nào gửi gì. Nhưng <code>deploy-nha.sh</code> gửi tin Telegram qua <code>$HOME/bin/bao-tin.sh</code> ở máy nhà trong đúng ba trường hợp: bước 5c thấy container khoẻ mà từ bên ngoài site trả 502; bộ kiểm CI ở bước 8 hỏng, nên production chạy commit mới mà GitHub chưa được cập nhật; và phép so mã băm cuối cùng thấy có người tráo ảnh khác đè lên lần deploy này. Mọi kết cục khác nằm lại trong terminal mà người vận hành đang nhìn. Đó chính là quy tắc "gửi ít hơn" của bài này, đã được áp dụng.</p>
<p>Lịch sử phía sau là lý lẽ tốt nhất cho quy tắc ấy. Tới 06/09, bước 8 HỎI DUYỆT qua Telegram rồi chờ 15 phút. Có một ngày bốn lần deploy liên tiếp hết giờ, lần nào cũng ghi "không push" rồi kết thúc <strong>XANH</strong>, và 288 commit dồn lại trên một cái máy. Tin nhắn chờ trả lời là một cái cổng; cổng hết giờ thì phải hỏng TO, không được lặng lẽ chọn nhánh an toàn.</p>
</div>
<div class="out">grep 'SLACK\\|DISCORD\\|EMAIL\\|notif' .github/workflows/*.yml    -> 0 matches

khong workflow nao gui thong bao. Ai dung ma soi ket qua.
CLAUDE.md quy dinh nguoi vien hanh chay &#96;bash deploy-nha.sh&#96; va CHO TAY ma xac nhan.</div>

<div class="callout ok">
<p><strong>Không thông báo là một vị thế BẢO VỆ ĐƯỢC khi không workflow nào deploy tự động.</strong> Con người chạy <code>deploy-nha.sh</code> đang xem cái terminal — chính script deploy là kênh thông báo, và đầu ra của nó đang chảy vào màn hình người vận hành. Lý lẽ ấy đứng vững chừng nào kích hoạt còn là <code>workflow_dispatch</code> cộng một con người. Nó THÔI đứng vững cái ngày một cái lịch nổ một cuộc deploy lúc 3 giờ sáng, hay cái ngày hai người đang deploy và người thứ hai cần BIẾT người đầu vẫn đang chạy.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Thông báo là một tin nhắn PHẢI xứng đáng làm gián đoạn ai đó, và cách duy nhất giữ nó xứng đáng là GỬI ÍT HƠN — bắt đầu từ CON SỐ KHÔNG, thêm MỘT khi một cuộc deploy production hỏng, và DỪNG ở đó trừ khi một chỗ trống cụ thể trong luồng công việc của người vận hành đòi thêm.</p>
</div>

<h3>Khi tin phải rời GitHub: webhook, làm cho an toàn</h3>
<p>Có lúc người phải phản ứng không nhìn GitHub: điện thoại của người trực, kênh của cả đội. Khi đó webhook là công cụ đúng, và bốn chi tiết quyết định nó giúp hay hại. URL là một thông tin đăng nhập — ai có nó cũng đăng được vào kênh của bạn — nên nó nằm trong secret và đi qua <code>env:</code>, không bao giờ chèn thẳng vào script và không bao giờ in ra. Nội dung được dựng bằng <code>jq</code> để một commit message có dấu nháy không làm vỡ JSON (cùng lý do Chương 6 cho chữ không tin cậy đi qua <code>env:</code>). Lời gọi có <code>--fail</code> và giới hạn thời gian, để webhook chết thì hỏng rõ ràng thay vì treo job. Và bước ấy có <strong>chế độ khô</strong>: không có secret thì nó in ra thứ lẽ ra đã gửi dưới dạng <code>::notice</code> rồi thoát 0.</p>
<pre><code class="language-yaml">      - name: Báo khi deploy hỏng (webhook, có chế độ khô)
        if: failure() &amp;&amp; github.ref == 'refs/heads/main'
        env:
          WEBHOOK: &#36;{{ secrets.DEPLOY_WEBHOOK }}          # không bao giờ echo
          TEXT: &gt;-
            Deploy &#36;{{ github.sha }} FAILED at health check.
            Production is back on &#36;{{ env.PREV }}.
            &#36;{{ github.server_url }}/&#36;{{ github.repository }}/actions/runs/&#36;{{ github.run_id }}
        run: |
          if [ -z "$WEBHOOK" ]; then
            echo "::notice title=Notify skipped::no DEPLOY_WEBHOOK secret — would have sent: $TEXT"
            exit 0
          fi
          jq -n --arg t "$TEXT" '{text: $t}' |
            curl --fail --silent --show-error --max-time 10 -H 'Content-Type: application/json' -d @- "$WEBHOOK"</code></pre>
<p>Chi tiết cuối chính là khuôn mẫu kho này đã dùng vì một lý do khác: bài kiểm bịa số liệu CV trong <code>ci-lint.yml</code> tự bỏ qua và vẫn xanh trong lúc secret khoá API của nó bị gỡ có chủ ý. Một bước thông báo chạy được khi thiếu secret là bước bạn thử được trên mọi nhánh và mọi fork; một bước chỉ chạy với webhook thật là bước mà lần đầu bạn dùng tới nó là giữa một sự cố thật. Sân tập cố ý dừng ở chế độ khô: không tin nào được gửi đi đâu cả.</p>
<div class="callout">
<p><strong>Một bản tổng hợp hơn mười cú ping.</strong> Với mọi thứ không phải production hỏng — test chập chờn, run chậm, cron dọn dẹp có cảnh báo — một bản tổng hợp mỗi ngày dễ chịu hơn tin nhắn tức thời: một job theo lịch chạy <code>gh run list --status failure --created "&gt;=$(date -u -d yesterday +%F)"</code>, định dạng danh sách, rồi gửi MỘT tin (hoặc ghi MỘT tóm tắt job). Người đọc phân loại vào lúc họ chọn.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Một thông báo deploy hỏng nên chứa gì?</strong><br>Đ: Cái gì hỏng (workflow, bước, mã thoát), production <em>BÂY GIỜ</em> đang chạy gì, commit, và link run. Chỉ đọc tin là người nhận biết mình có phải hành động ngay không.</p>
<p><strong>H: Pipeline có nên báo khi thành công không?</strong><br>Đ: Ghi lại — tóm tắt job, trạng thái deployment, một kênh ít ưu tiên — nhưng đừng gọi ai. Kênh ping mỗi lần xanh sẽ bị tắt tiếng, và rồi tin đỏ bị bỏ lỡ.</p>
<p><strong>H: Hiển thị kết quả trong GitHub Actions mà không dùng dịch vụ ngoài thế nào?</strong><br>Đ: Ghi Markdown vào <code>$GITHUB_STEP_SUMMARY</code> với <code>if: always()</code>, và in <code>::error title=…::…</code> khi hỏng để thành annotation. Cả hai hiện trên trang run và đọc được qua API.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> pipeline thử của bạn ở bài 9.3–9.4 rollback đúng, nhưng không ai biết trừ khi mở log.</p><ol>
<li>Thêm một bước <code>if: always()</code> ghi một bảng Markdown vào <code>"$GITHUB_STEP_SUMMARY"</code>: commit, ảnh định tráo, kết quả kiểm, ảnh production đang chạy, thời gian.</li>
<li>Thêm một bước <code>if: failure()</code> in <code>::error title=Deploy hong::…</code> gọi tên ảnh mà production đã quay về.</li>
<li>Push một thay đổi tốt và một thay đổi <code>HONG=1</code>. Mở trang của cả hai run mà KHÔNG mở log nào.</li>
<li>Đọc annotation của job hỏng qua <code>gh api repos/&lt;bạn&gt;/&lt;kho&gt;/check-runs/&lt;job_id&gt;/annotations</code>.</li>
<li>Trong cài đặt thông báo GitHub, đặt Actions thành "chỉ run hỏng" rồi kiểm rằng chỉ run thứ hai tới được bạn.</li></ol>
<p><strong>Đạt khi:</strong> cả hai run có bảng tóm tắt trên trang, run hỏng có annotation đỏ "Deploy hong" gọi tên ảnh đã rollback về, API trả về annotation đó, và bạn nhận đúng một thông báo.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Job summary (tóm tắt job)</span><span class="v">Markdown ghi thêm vào <code>$GITHUB_STEP_SUMMARY</code>; hiện trên trang run. 1 MiB mỗi bước.</span></div>
  <div class="kv"><span class="k">Annotation (chú thích lỗi)</span><span class="v">Tin tạo bởi <code>::error</code>/<code>::warning</code>/<code>::notice</code>; hiện trên run và phần checks của commit, đọc được qua API.</span></div>
  <div class="kv"><span class="k">Alert fatigue (nhờn cảnh báo)</span><span class="v">Người ta thôi đọc một kênh gửi quá nhiều; tin quan trọng lạc giữa những tin còn lại.</span></div>
  <div class="kv"><span class="k">Page (gọi trực)</span><span class="v">Tin dùng để làm gián đoạn ai đó NGAY. Chỉ cho sự cố production cần người.</span></div>
  <div class="kv"><span class="k">if: always() / if: failure()</span><span class="v">Chạy bước dù chuyện gì xảy ra / chỉ khi có gì trước đó hỏng.</span></div>
  <div class="kv"><span class="k">Webhook</span><span class="v">Một URL nhận tin (Slack, Discord, bot Telegram). Cất trong secret; không bao giờ in ra.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deploy hỏng là tin DUY NHẤT luôn đáng gửi; run xanh là sổ ghi, không phải tin tức.</li>
<li>Tóm tắt job với <code>if: always()</code> và <code>::error</code> với <code>if: failure()</code> đủ cho phần lớn nhu cầu mà không cần dịch vụ ngoài.</li>
<li>Đưa trạng thái production vào tin, không chỉ trạng thái của run.</li>
<li>GitHub đã báo sẵn cho người khởi động run; "chỉ run hỏng" là một cài đặt.</li>
<li><code>deploy-nha.sh</code> gửi tin trong đúng ba trường hợp: 502 từ bên ngoài, bỏ push, ảnh bị tráo đè.</li>
<li>Tin chờ trả lời là một cổng; hết giờ thì phải hỏng to (bài học 288 commit).</li>
</ul>

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
      description: 'Mười câu tình huống: paths: trùng nhau, khoá chung vẫn thiếu migration, site của bạn deploy thế nào, hai khoá không biết nhau, rollback tự động và "bản trước", cổng environment, và thông báo đúng việc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Deploying from CI, checked against real runs</h2>
<p class="lead">Ten situations, fifteen minutes. Every question is built on something that really ran — in this repository&#39;s history (6 July, 10–11 September) or on the sandbox branch <code>ch09-deploy</code> on 24 September 2026 — so the right answer is the one the logs support, not the one that sounds safest.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why one push used to start two deploy workflows here, and why a shared concurrency group alone did not fix the sandbox race.</li>
<li>I can describe how my site deploys today — which machine does what in <code>deploy-nha.sh</code> — and when I would switch to a pipeline.</li>
<li>I can write a deploy job that saves the running version, checks health, rolls back, and stays red.</li>
<li>I can explain why "the previous version" must be read from the target, not from <code>HEAD^</code>.</li>
<li>I can set up an environment with a reviewer and a branch rule and read its deployments through the API.</li>
<li>I can design a failure notification that says what production runs now.</li>
<li>I can rebuild an incident timeline from the API: <code>gh run view &lt;id&gt; --json jobs</code> gives every step&#39;s start and end.</li>
</ul>
${slide('ga-09', 28, 'Bảng tra nhanh Chương 9')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Deploy từ CI, đối chiếu với những lần chạy thật</h2>
<p class="lead">Mười tình huống, mười lăm phút. Câu nào cũng dựng trên một thứ đã chạy thật — trong lịch sử kho này (06/07, 10–11/09) hoặc trên nhánh sân tập <code>ch09-deploy</code> ngày 24/09/2026 — nên đáp án đúng là cái mà log ủng hộ, không phải cái nghe an toàn nhất.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao một cú push từng khởi động hai workflow deploy ở đây, và vì sao riêng một nhóm concurrency chung không vá được cuộc đua trên sân tập.</li>
<li>Tôi mô tả được site của mình hôm nay deploy thế nào — máy nào làm gì trong <code>deploy-nha.sh</code> — và khi nào tôi sẽ chuyển sang pipeline.</li>
<li>Tôi viết được job deploy lưu bản đang chạy, kiểm sức khoẻ, rollback, và vẫn để đỏ.</li>
<li>Tôi giải thích được vì sao "bản trước" phải đọc từ đích, không từ <code>HEAD^</code>.</li>
<li>Tôi dựng được environment có người duyệt và luật nhánh, và đọc deployments của nó qua API.</li>
<li>Tôi thiết kế được thông báo hỏng nói rõ production BÂY GIỜ đang chạy gì.</li>
<li>Tôi dựng lại được dòng thời gian một sự cố từ API: <code>gh run view &lt;id&gt; --json jobs</code> cho giờ bắt đầu và kết thúc của từng bước.</li>
</ul>
${slide('ga-09', 28, 'Bảng tra nhanh Chương 9')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "Before 6 July 2026, why did one push to main that changed src/ start BOTH deploy workflows?|||Trước 06/07/2026, vì sao một cú push lên main sửa src/ lại khởi động CẢ HAI workflow deploy?",
            options: [
              "Both workflows listed the same concurrency group, and GitHub starts every workflow in a group together|||Hai workflow khai cùng một nhóm concurrency, và GitHub khởi động mọi workflow trong nhóm cùng lúc",
              "Their paths: filters overlapped — src/**, prisma/**, frontend/** and nginx/** were in both lists|||Bộ lọc paths: của chúng giao nhau — src/**, prisma/**, frontend/** và nginx/** có trong cả hai danh sách",
              "backend-vps.yml called deploy-ghcr.yml as a reusable workflow at its last step|||backend-vps.yml gọi deploy-ghcr.yml như một reusable workflow ở bước cuối",
              "GitHub retries a deploy in a second workflow when the first one is slower than ten minutes|||GitHub tự chạy lại deploy ở workflow thứ hai khi cái đầu chậm hơn mười phút",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: git show 094db93b^ prints both files: each had on: push with a paths: list, and the lists shared src/**, prisma/**, frontend/** and nginx/**. The comment that said other commits \"keep using backend-vps.yml\" described an intention the YAML did not implement. The concurrency option is the tempting one, but the two workflows had DIFFERENT groups (one had none) — a shared group would have queued them, not started them together.|||VI: git show 094db93b^ in ra cả hai tệp: mỗi tệp có on: push kèm danh sách paths:, và hai danh sách chung src/**, prisma/**, frontend/**, nginx/**. Dòng chú thích nói commit khác \"vẫn dùng backend-vps.yml\" chỉ là ý định mà YAML không làm. Phương án concurrency hấp dẫn nhất nhưng sai: hai workflow có nhóm KHÁC nhau (một cái không có nhóm) — nhóm chung sẽ bắt chúng xếp hàng, không khởi động cùng lúc.",
          },
          {
            question: "On the sandbox, two deploy workflows were given the SAME concurrency group (cancel-in-progress: false) and two pushes arrived 23 s apart. What happened to the schema line?|||Trên sân tập, hai workflow deploy được cho CHUNG một nhóm concurrency (cancel-in-progress: false) và hai cú push tới cách nhau 23 s. Dòng schema ra sao?",
            options: [
              "It moved twice, once per push, because the lock made the four runs strictly sequential|||Nó đổi hai lần, mỗi push một lần, vì khoá khiến bốn lần chạy tuần tự nghiêm ngặt",
              "It moved once, to the second commit, because cancel-in-progress: false keeps every pending run|||Nó đổi một lần, sang commit thứ hai, vì cancel-in-progress: false giữ mọi lần chạy đang chờ",
              "The runs failed with a lock error and production stayed on the starting image|||Các lần chạy hỏng vì lỗi khoá và production giữ nguyên ảnh ban đầu",
              "It never moved: both runs of the migrating workflow were replaced while pending and ran 0 jobs|||Nó không nhúc nhích: cả hai lần chạy của workflow biết migrate bị thay khi đang chờ và chạy 0 job",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: A group holds one running and ONE pending run; a newer pending run replaces the older one. The vps run of push 1 started first, so both ghcr runs (36017502683, 36017548107) waited and were replaced with 0 jobs. The lock removed overlap but the only workflow that migrates never ran. \"cancel-in-progress: false keeps every pending run\" is the common misreading: it only stops cancelling the RUNNING one; keeping every pending run needs queue: max.|||VI: Một nhóm giữ một lần đang chạy và MỘT lần đang chờ; lần chờ mới hơn thay lần chờ cũ. Lần vps của push 1 chạy trước, nên cả hai lần ghcr (36017502683, 36017548107) phải chờ rồi bị thay, 0 job. Khoá xoá sự chồng nhau nhưng workflow duy nhất biết migrate không bao giờ chạy. \"cancel-in-progress: false giữ mọi lần chờ\" là cách hiểu sai phổ biến: nó chỉ thôi huỷ lần ĐANG CHẠY; giữ mọi lần chờ cần queue: max.",
          },
          {
            question: "In the 6 July 2026 incident, run 28784932814 failed at \"Recreate backend + frontend containers\". What did that mean for production?|||Trong sự cố 06/07/2026, run 28784932814 hỏng ở bước \"Recreate backend + frontend containers\". Điều đó nghĩa là gì với production?",
            options: [
              "Its migration, nginx reload and health checks were skipped while two backend-vps runs finished green — the Actions tab could not say what production was running|||Migration, nạp lại nginx và kiểm sức khoẻ của nó bị bỏ qua trong khi hai lần backend-vps xong xanh — tab Actions không nói được production đang chạy gì",
              "GitHub automatically restored the previous containers because the step failed|||GitHub tự khôi phục các container cũ vì bước đó hỏng",
              "Nothing changed on the VPS: a failed recreate never touches running containers|||Không gì đổi trên VPS: recreate hỏng thì không bao giờ đụng container đang chạy",
              "The run retried the recreate until the other runs released the containers|||Lần chạy thử lại recreate cho tới khi các lần khác nhả container",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Every step after the failed one was skipped, including Apply Prisma migrations, and the two backend-vps runs that had been injecting files into the same containers ended green two seconds earlier. Per-run status was true for each run and said nothing about the server. Nothing in GitHub restores containers on a failed step; that only happens if your workflow has a rollback step.|||VI: Mọi bước sau bước hỏng bị bỏ qua, kể cả Apply Prisma migrations, còn hai lần backend-vps đang bơm tệp vào đúng các container ấy xong xanh trước đó hai giây. Trạng thái từng lần chạy đúng với lần chạy đó mà không nói gì về máy chủ. GitHub không tự khôi phục container khi một bước hỏng; chỉ có khi workflow của bạn có bước rollback.",
          },
          {
            question: "Your friend asks: \"cuongthai.com deploys with GitHub Actions, right?\" Which answer is accurate in September 2026?|||Bạn bạn hỏi: \"cuongthai.com deploy bằng GitHub Actions đúng không?\" Câu trả lời nào chính xác vào 09/2026?",
            options: [
              "Yes — every push to main runs deploy-ghcr.yml, which builds on a runner and swaps on the VPS|||Đúng — mỗi push lên main chạy deploy-ghcr.yml, dựng trên runner rồi tráo trên VPS",
              "No — deploy.sh on the VPS is started by a cron job every night and GitHub is not involved|||Không — deploy.sh trên VPS được cron khởi động mỗi đêm, GitHub không liên quan",
              "No — bash deploy-nha.sh from the Mac: home machine builds, GHCR stores, VPS swaps, and the script pushes to origin/main at the end; Actions only runs CI automatically|||Không — bash deploy-nha.sh từ máy Mac: máy nhà dựng, GHCR chứa, VPS tráo, và script tự push lên origin/main ở cuối; Actions chỉ tự chạy CI",
              "Partly — ci-lint.yml deploys the backend and deploy-nha.sh deploys only the frontend|||Một phần — ci-lint.yml deploy backend còn deploy-nha.sh chỉ deploy frontend",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Since 18 August 2026 the standard path is deploy-nha.sh (fallback deploy.sh). ci-lint.yml is the only workflow a push starts; deploy-ghcr.yml and backend-vps.yml are workflow_dispatch only since 6 July. The first option describes the repository before 6 July. Note the script pushes to GitHub itself after re-running CI's required checks, so deploying here IS pushing.|||VI: Từ 18/08/2026 đường chuẩn là deploy-nha.sh (đường lùi deploy.sh). ci-lint.yml là workflow duy nhất cú push khởi động; deploy-ghcr.yml và backend-vps.yml chỉ chạy tay từ 06/07. Phương án đầu mô tả kho TRƯỚC 06/07. Lưu ý script tự push lên GitHub sau khi chạy lại bộ kiểm bắt buộc của CI, nên ở đây deploy CHÍNH LÀ push.",
          },
          {
            question: "Which change in your situation is the strongest reason to move from a hand-run deploy script to a CD pipeline with environment:?|||Thay đổi nào trong hoàn cảnh của bạn là lý do mạnh nhất để chuyển từ script deploy chạy tay sang pipeline CD có environment:?",
            options: [
              "The build became slow, so you want GitHub's faster runners|||Bản dựng chậm đi, nên bạn muốn runner nhanh hơn của GitHub",
              "A second and third person now deploy, and you need a record of who shipped what plus approval by someone other than the author|||Người thứ hai, thứ ba giờ cũng deploy, và bạn cần sổ ghi ai ship gì cùng sự duyệt của người KHÁC người viết",
              "You want deploys to stop pushing to GitHub automatically|||Bạn muốn deploy thôi tự push lên GitHub",
              "YAML is easier to read than bash|||YAML dễ đọc hơn bash",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The script is a sound control for one operator watching one terminal. What a pipeline adds that a laptop cannot is a shared record (runs, deployments, approvals with comments) and a gate that a different person opens. Speed points the other way here: the home machine builds in parallel on 12 cores, faster than a 4-core hosted runner.|||VI: Script là biện pháp kiểm soát vững cho một người vận hành nhìn một terminal. Thứ pipeline thêm mà laptop không có là sổ ghi chung (run, deployment, lượt duyệt kèm lời bình) và một cổng do NGƯỜI KHÁC mở. Tốc độ ở đây lại nghiêng về phía ngược: máy nhà dựng song song trên 12 nhân, nhanh hơn runner 4 nhân.",
          },
          {
            question: "On the night of 10→11 September 2026 production went BACKWARDS although deploy-nha.sh holds a flock on the VPS. Why?|||Đêm 10→11/09/2026 production bị LÙI dù deploy-nha.sh giữ flock trên VPS. Vì sao?",
            options: [
              "A manual run of deploy-ghcr.yml built from main on GitHub, which did not yet contain the new commit, and it never takes the flock — two paths, two unrelated locks|||Một lần bấm tay deploy-ghcr.yml dựng từ main trên GitHub, lúc đó chưa có commit mới, và nó không hề giữ flock — hai đường, hai khoá không liên quan",
              "flock does not work across SSH sessions, so both deploys held it at the same time|||flock không chạy qua các phiên SSH, nên hai lần deploy cùng giữ nó",
              "deploy-nha.sh cancelled itself because cancel-in-progress was true|||deploy-nha.sh tự huỷ vì cancel-in-progress là true",
              "GHCR served a cached :latest image to the VPS|||GHCR trả cho VPS một ảnh :latest đã cache",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: At 21:00 UTC the script swapped the new image; at 21:02 run 34529884942 of deploy-ghcr.yml rebuilt from GitHub's main — older, because the script pushes only at the end — and recreated the containers. The workflow's lock is a concurrency group on GitHub; the script's is a file lock on the VPS; neither asks the other. The flock option is wrong: flock worked, the workflow simply never asked for it. The script's fix is its final check: compare the running container's image hash with the one recorded at swap time.|||VI: Lúc 21:00 UTC script tráo ảnh mới; 21:02 run 34529884942 của deploy-ghcr.yml dựng lại từ main trên GitHub — cũ hơn, vì script chỉ push ở cuối — rồi tái tạo container. Khoá của workflow là nhóm concurrency trên GitHub; khoá của script là khoá tệp trên VPS; không cái nào hỏi cái kia. Phương án flock sai: flock chạy đúng, workflow chỉ đơn giản không hỏi nó. Cách vá của script là phép kiểm cuối: so mã băm ảnh container đang chạy với mã băm ghi lúc tráo.",
          },
          {
            question: "In ch09-cd.yml the rollback step uses if: failure() && steps.kiem_suc_khoe.outcome == 'failure'. Why not just if: failure()?|||Trong ch09-cd.yml bước rollback dùng if: failure() && steps.kiem_suc_khoe.outcome == 'failure'. Sao không chỉ if: failure()?",
            options: [
              "failure() is only true for the job's last step, so the extra condition is required for syntax|||failure() chỉ đúng với bước cuối của job, nên điều kiện thêm là bắt buộc về cú pháp",
              "outcome makes the rollback run even when the job is cancelled|||outcome khiến rollback chạy cả khi job bị huỷ",
              "failure() would also be true if an EARLIER step failed (e.g. the artifact download) — rolling back a swap that never happened is its own incident|||failure() cũng đúng khi một bước TRƯỚC hỏng (vd tải artifact) — rollback một cú tráo chưa từng xảy ra là một sự cố riêng",
              "steps.&lt;id&gt;.outcome is faster to evaluate than failure()|||steps.&lt;id&gt;.outcome được tính nhanh hơn failure()",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: failure() is true when any previous step failed. Only a failed HEALTH CHECK means the new image is live and broken, so the rollback asks about that step by id. The first option is false: failure() is valid in any step's if:. outcome is the step's result before continue-on-error, and has nothing to do with cancellation.|||VI: failure() đúng khi BẤT KỲ bước nào trước đó hỏng. Chỉ khi PHÉP KIỂM SỨC KHOẺ hỏng mới có nghĩa ảnh mới đang chạy và hỏng, nên rollback hỏi đúng bước đó theo id. Phương án đầu sai: failure() dùng được trong if: của mọi bước. outcome là kết quả của bước trước continue-on-error, không liên quan tới việc huỷ.",
          },
          {
            question: "Run 36017879471 went red before deploying anything. Its preparation step started \"production\" from HEAD^. What was wrong?|||Run 36017879471 đỏ trước khi deploy được gì. Bước chuẩn bị của nó khởi động \"production\" từ HEAD^. Sai ở đâu?",
            options: [
              "HEAD^ does not exist in a shallow checkout, so git show failed|||HEAD^ không tồn tại trong checkout nông, nên git show hỏng",
              "HEAD^ was the broken commit that had just been rolled back; production actually ran an older version — the previous version must be read from the target, not guessed from git|||HEAD^ là commit hỏng vừa bị rollback; production thật chạy một bản cũ hơn — bản trước phải đọc từ đích, không đoán từ git",
              "The port 19090 was still held by the previous run's container|||Cổng 19090 vẫn bị container của lần chạy trước giữ",
              "The environment reviewer had not approved the preparation step|||Người duyệt environment chưa duyệt bước chuẩn bị",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: The parent of b406a95 was 547a5ca — the HONG=1 image rolled back one run earlier. Production ran 1b2d46bf. Starting 547a5ca failed with curl: (7). The fix reads cd-dang-chay.txt, written only after a healthy swap; deploy-nha.sh step 0a does the same by reading the running container's image hash. The checkout was fetch-depth: 2, so HEAD^ existed; and every runner is fresh, so no old container held the port.|||VI: Cha của b406a95 là 547a5ca — ảnh HONG=1 bị rollback ở lần chạy trước. Production chạy 1b2d46bf. Khởi động 547a5ca hỏng với curl: (7). Cách vá đọc cd-dang-chay.txt, chỉ được ghi sau khi tráo khoẻ; deploy-nha.sh bước 0a làm y vậy bằng cách đọc mã băm ảnh của container đang chạy. Checkout có fetch-depth: 2 nên HEAD^ tồn tại; và mỗi runner đều mới nên không container cũ nào giữ cổng.",
          },
          {
            question: "A push from branch ch09-nhanh-la triggered the sandbox CD pipeline. The build job was green. What happened to the deploy job, which uses environment: ch09-production?|||Một cú push từ nhánh ch09-nhanh-la kích hoạt pipeline CD của sân tập. Job dựng xanh. Job deploy, dùng environment: ch09-production, ra sao?",
            options: [
              "It waited for the reviewer, who then saw a warning that the branch is unusual|||Nó chờ người duyệt, người này thấy cảnh báo rằng nhánh khác thường",
              "It deployed, because branch rules only apply to pull requests|||Nó deploy, vì luật nhánh chỉ áp dụng cho pull request",
              "It was skipped silently and the run ended green|||Nó bị bỏ qua lặng lẽ và run kết thúc xanh",
              "It failed before any reviewer was asked: \"Branch ch09-nhanh-la is not allowed to deploy to ch09-production due to environment protection rules.\"|||Nó hỏng trước khi hỏi bất kỳ người duyệt nào: \"Branch ch09-nhanh-la is not allowed to deploy to ch09-production due to environment protection rules.\"",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Run 36017890545: the deployment branch policy allows only ch09-deploy, so the job failed with that annotation and a failure deployment record, without a review request. Branch rules match GITHUB_REF of any event, not only pull requests. The gate protects the target, which is why the build job still ran green.|||VI: Run 36017890545: luật nhánh chỉ cho ch09-deploy, nên job hỏng kèm annotation đó và một bản ghi deployment failure, không có yêu cầu duyệt nào. Luật nhánh so với GITHUB_REF của mọi sự kiện, không riêng pull request. Cổng bảo vệ cái đích, nên job dựng vẫn xanh.",
          },
          {
            question: "Your deploy job fails its health check and rolls back successfully. Which notification design matches this chapter?|||Job deploy của bạn hỏng ở kiểm sức khoẻ và rollback thành công. Thiết kế thông báo nào khớp với chương này?",
            options: [
              "Leave the job red; write a job summary with if: always() naming the image production runs now, and one ::error annotation (or one webhook message) with if: failure()|||Để job ĐỎ; ghi tóm tắt job với if: always() gọi tên ảnh production đang chạy, và một annotation ::error (hoặc một tin webhook) với if: failure()",
              "Mark the job green because production is healthy, and send nothing|||Đánh dấu job xanh vì production khoẻ, và không gửi gì",
              "Send a message at every step so the on-call person can follow the rollback live|||Gửi tin ở mỗi bước để người trực theo dõi rollback trực tiếp",
              "Send one message on success and one on failure to the same paging channel|||Gửi một tin khi xanh và một tin khi đỏ vào cùng kênh gọi trực",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: The deploy failed and production is fine — two facts, both reported. Run 36017616624 did exactly this: red job, summary showing \"Production đang chạy ch09-app:1b2d46bf\", annotation \"Deploy hong\". Turning it green teaches people the change shipped; per-step or per-success pings train people to mute the channel.|||VI: Deploy thất bại và production ổn — hai sự thật, báo cả hai. Run 36017616624 làm đúng vậy: job đỏ, tóm tắt ghi \"Production đang chạy ch09-app:1b2d46bf\", annotation \"Deploy hong\". Biến nó thành xanh dạy mọi người rằng thay đổi đã lên; ping từng bước hay mỗi lần xanh dạy người ta tắt tiếng kênh.",
          },
        ],
      },
    },
  ],
};
