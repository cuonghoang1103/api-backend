import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgithub-actions%2Flearn&reflabel=GitHub%20Actions';
/**
 * GitHub Actions — Chương 5: Cache và artifact.
 * Số đo: npm ci lạnh 31,4s / ấm 18,8s trên chính lockfile của kho này,
 * và một cái cache CHẾT tìm thấy trong log thật.
 */

export default {
  title: 'Chapter 5 — Caching and artifacts, measured|||Chương 5 — Cache và artifact, đo thật',
  slug: 'ga-ch5-cache',
  description: '`cache: npm` cắt 40% thời gian cài (31,4 → 18,8 giây, đo trên lockfile này). Cache thẳng `node_modules` chỉ nhanh hơn thêm 4,1 giây mà tốn 152 MB qua mạng hai chiều. Và một cái cache trong kho này chưa từng lưu được gì.',
  sortOrder: 6,
  lessons: [

    /* ─────────────────────────── 5.0 ─────────────────────────── */
    {
      title: '5.0 — Chapter 5 slides: caches and artifacts in pictures|||5.0 — Slide Chương 5: cache và artifact bằng hình',
      slug: 'ga-5-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 5: ba cách cài đo trên runner thật (17,5 s → 13,7 s → 3,6 s), cây khoá và restore-keys, mục cache bất biến, phạm vi nhánh đo bằng một PR thật, cache chết và cache rỗng 237 byte, artifact 28.484 file mất 37 giây so với tarball 4 giây, lỗi 409 và ID đổi khi overwrite, và điểm hoà vốn — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: three ways to install the same dependencies timed on a real runner, the timeline of a miss and a hit, the key tree and its prefixes, a cache entry that refuses to be overwritten, which branches can read which caches, the dead cache and the one that is alive but empty, a 28,000-file artifact against a single tarball, and the break-even line.</p>
<p>Slides 3–7 belong to Lesson 5.1, 8–11 and 13–14 to 5.2, 12 and 15–19 to 5.3, 20–25 to 5.4 and 26–29 to 5.5. The last three are the chapter&#39;s common mistakes, a cheat sheet, and a 45-minute practice session. Every new log and number on the slides is real: recorded on 24 September 2026 on GitHub-hosted <code>ubuntu-24.04</code> runners (runner 2.337.0) in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch05-cache</code> and pull request #4, with limits read from docs.github.com the same day. Three slides correct earlier versions of this chapter: a branch does <em>not</em> read the cache of the branch it was created from, caching <code>node_modules</code> is <em>not</em> an optimisation of unpredictable sign on a runner, and the 10 GB cache limit is now a default rather than a ceiling. The slides are in Vietnamese; the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để nắm hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: ba cách cài cùng một bộ phụ thuộc bấm giờ trên runner thật, dòng thời gian của một lần trượt và một lần trúng, cây khoá với các tiền tố, một mục cache nhất quyết không cho ghi đè, nhánh nào đọc được cache của nhánh nào, cái cache chết và cái cache sống mà rỗng, một artifact 28 nghìn file so với một tarball duy nhất, và đường hoà vốn.</p>
<p>Slide 3–7 thuộc Bài 5.1, 8–11 và 13–14 thuộc 5.2, 12 và 15–19 thuộc 5.3, 20–25 thuộc 5.4 và 26–29 thuộc 5.5. Ba slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh và một buổi thực hành 45 phút. Mọi log và con số mới trên slide là THẬT: ghi ngày 24/09/2026 trên runner <code>ubuntu-24.04</code> của GitHub (runner 2.337.0), trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch05-cache</code> và pull request #4, cùng các giới hạn đọc từ docs.github.com trong cùng ngày. Ba slide đính chính bản cũ của chương: một nhánh KHÔNG đọc được cache của nhánh nó tách ra, cache <code>node_modules</code> KHÔNG phải một phép tối ưu "không đoán được dấu" trên runner, và hạn mức cache 10 GB giờ là mức mặc định chứ không còn là trần cứng — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('ga-05', [
[1, "Bìa"],
[2, "Bản đồ chương: cache để NHANH, artifact để GIAO"],
[3, "Trên runner: cache: npm cắt 22%, cache node_modules cắt 79%"],
[4, "Dòng thời gian: trượt thì trả thêm tiền lưu, trúng mới thu lãi"],
[5, "Hai cái cache giữ hai thứ khác nhau: kho tải về và cây đã dựng"],
[6, "Máy cục bộ cắt 40%, runner chỉ 22% — runner tải gói rất nhanh"],
[7, "Cache chỉ chạm tới bước cài — bản dựng 149 giây vẫn nguyên"],
[8, "Cây khoá: khớp chính xác trước, rồi lùi dần theo tiền tố"],
[9, "Ghi một lần: lưu lại cùng khoá bị từ chối, job vẫn xanh"],
[10, "Khoá hằng số đông cứng ở lần chạy đầu tiên"],
[11, "Tiền tố lấy mục mới nhất; nhiều dòng thì dòng trên thắng"],
[12, "Hai bẫy: đổi path là mục khác, và khoá cũng khớp tiền tố"],
[13, "Đọc được: nhánh mình, nhánh mặc định, nhánh gốc của PR"],
[14, "Ma trận đo thật: 12 phép tra, chỉ 4 lần ✓"],
[15, "Bốn câu trong log cho biết cache sống hay chết"],
[16, "Còn tệ hơn cache chết: cache \"sống\" mà rỗng — 237 byte"],
[17, "Khoá chứa github.sha: trượt mọi lần, lưu mọi lần"],
[18, "Quy tắc ba lần chạy: trượt → trúng → trúng, trên cùng một nhánh"],
[19, "Cache .tsbuildinfo: tsc 3,4 s → 1,2 s, với 84 KB cache"],
[20, "Cache và artifact: hai dịch vụ, hai lời hứa khác nhau"],
[21, "Hình dạng quyết định giá: 28.484 file 37 giây, tarball 4 giây"],
[22, "Tên trùng bị từ chối 409; overwrite: true xoá bản cũ và đổi ID"],
[23, "Zip làm mất bit chạy và bỏ file ẩn — tar thì giữ"],
[24, "Ma trận ghi nhiều tên, job gom tải về một chỗ"],
[25, "Phiên bản action artifact đã đi tới đâu (09/2026)"],
[26, "Điểm hoà vốn: cache lãi khi dựng lại đắt hơn khôi phục"],
[27, "Bảng quyết định, bằng số đo trên runner"],
[28, "Giới hạn theo tài liệu GitHub (đọc 24/09/2026)"],
[29, "Đo cả kho bằng gh cache — và dọn khi xong"],
[30, "Sai lầm hay gặp ở Chương 5"],
[31, "Bảng tra nhanh Chương 5"],
[32, "Thực hành Chương 5 (45 phút) trên kho của chính bạn"]
])}
`,
    },

    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — What a cache actually buys|||5.1 — Một cái cache thật sự mua được gì',
      slug: 'ga-5-1-cache-mua-gi',
      type: 'VIDEO',
      description: 'Đo trên chính lockfile của kho này: `npm ci` lạnh 31,4 giây, ấm 18,8 giây. `cache: npm` cắt 40% và KHÔNG bỏ được bước cài. Cache thẳng `node_modules` chỉ nhanh hơn thêm 4,1 giây mà tốn 152 MB.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>What a cache actually buys</h2>
<p class="lead">Caching is the standard advice for a slow workflow, and it is usually given without a number attached. This lesson attaches one, measured on this repository&#39;s real lockfile: 898 packages, and a <code>node_modules</code> of 667 MB across 38,909 files.</p>

<h3>The measurement</h3>
<div class="out">cach                                        KHOI PHUC       LUU   dung luong
------------------------------------------------------------------------------
npm ci, ~/.npm LANH (khong cache gi)       31.409 ms         -           -
npm ci, ~/.npm AM   (= cache: npm)         18.757 ms         -      163 MB
cache thang node_modules, gzip -1          13.076 ms  11.040 ms     192 MB
cache thang node_modules, zstd -3          14.712 ms   1.727 ms     152 MB

(hai luot am do duoc 19.410 va 18.103 ms -> TB 18.757)</div>

<div class="callout ok">
<p><strong>The one-line built-in cache is worth 40%.</strong> <code>cache: 'npm'</code> on <code>setup-node</code> takes the install from 31.4 seconds to 18.8. That is a large, cheap win and it is why the line is in almost every workflow that installs anything.</p>
</div>

<div class="callout warn">
<p><strong>And it does not remove the install step.</strong> 18.8 seconds still go into rebuilding 38,909 files. Lesson 4.4 named this and here is the number behind it: what the cache skips is the <em>network fetch</em>, not the unpacking, linking and script-running that <code>npm ci</code> does afterwards. Anyone expecting "cached dependencies" to mean "no install" is expecting the other 60%.</p>
</div>

<h3>Should you cache <code>node_modules</code> itself?</h3>
<p>The rows below the built-in are the DIY version — <code>actions/cache</code> pointed straight at <code>node_modules</code>. Restoring the zstd tarball takes 14.7 seconds against <code>npm ci</code>&#39;s warm 18.8:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">the gain</span><span class="lz-t">4.1 seconds</span><span class="lz-d">14.7 s restore instead of 18.8 s install — a 22% further cut on an already-cached install</span></div>
<div class="lz-step"><span class="lz-k">the cost</span><span class="lz-t">152 MB, twice</span><span class="lz-d">uploaded on save, downloaded on restore. This measurement is on local disk, so the network time is <em>not</em> in the 14.7 s</span></div>
<div class="lz-step"><span class="lz-k">the honest verdict</span><span class="lz-t">it depends on bandwidth</span><span class="lz-d">the compute side favours the tarball; whether the transfer eats the 4.1 seconds is a property of the cache service, and it is not measured here</span></div>
</div>

<div class="callout">
<p><strong>Stating the limit of this measurement.</strong> Everything above is compute on one machine with local disk. In a real workflow both cache paths cross a network to GitHub&#39;s cache service, and that leg is the one that decides whether the extra 4.1 seconds survives. So the finding to carry away is not "cache <code>node_modules</code>" or "don&#39;t" — it is that the built-in <code>cache:</code> line captures the large, certain part of the win, and the DIY version is chasing a much smaller margin that your network may eat.</p>
</div>

<h3>Measured again, on a real runner</h3>
${slide('ga-05', 3, 'On the runner: cache: npm saves 22%, caching node_modules saves 79%')}
<p>Everything above was measured on one machine with a local disk, and the section on caching <code>node_modules</code> ended with an honest gap: the network leg was not measured. So on 24 September 2026 the same comparison ran where the code actually runs — GitHub-hosted <code>ubuntu-24.04</code> runners, in the public sandbox repository <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, branch <code>ch05-cache</code>. The project there is a stand-in with the shape of this site: Next.js, React, Express, Prisma, TypeScript, ESLint, Jest and Tailwind — a lockfile with 743 entries that installs 681 packages into an 854 MB <code>node_modules</code> of 28,446 files.</p>
<p>The workflow <code>ch05-do-cache.yml</code> has three jobs that install the same lockfile three ways, and it ran once on push (every cache cold) and five more times by <code>gh workflow run</code> (every cache warm):</p>
<pre><code class="language-yaml">jobs:
  khong-cache:            # no cache at all — ~/.npm starts empty every time
    steps:
      - uses: actions/setup-node@v6
        with: { node-version: '22' }
      - run: npm ci
  cache-npm:              # the one-line built-in: caches ~/.npm
    steps:
      - uses: actions/setup-node@v6
        with: { node-version: '22', cache: npm, cache-dependency-path: ch05/app/package-lock.json }
      - run: npm ci
  cache-node-modules:     # the do-it-yourself version: caches the built tree
    steps:
      - id: nm
        uses: actions/cache@v5
        with:
          path: ch05/app/node_modules
          key: ch05-nm-&#36;{{ runner.os }}-node22-&#36;{{ hashFiles('ch05/app/package-lock.json') }}
      - if: steps.nm.outputs.cache-hit != 'true'
        run: npm ci</code></pre>
<p>Every number below comes from the log timestamps of those runs (the time between "Cache hit for" and "Cache restored successfully", and <code>/usr/bin/time</code> around <code>npm ci</code>):</p>
<div class="out">run            khong-cache   cache: npm (restore + npm ci)   node_modules (restore)
36004518266    14.05 s       MISS: 19.49 s + 2.9 s save      MISS: 18.06 s + 4.9 s save
36004724418    18.36 s       2.09 + 11.29 s                  3.26 s
36004886526    15.74 s       1.43 + 15.94 s                  3.16 s
36004891780    16.71 s       3.55 + 15.10 s                  3.61 s
36004897271    18.80 s       1.39 + 10.93 s                  5.13 s
36005363122    22.26 s       3.15 + 11.64 s                  3.95 s
---------------------------------------------------------------------------------
median         17.5 s        2.1 + 11.6 = 13.7 s             3.6 s</div>
<div class="callout ok">
<p><strong>On the runner, the ranking is the same and the proportions are not.</strong> The built-in <code>cache: npm</code> saves about 3.8 seconds, 22% — roughly half the 40% it saved on a local machine. Restoring <code>node_modules</code> directly replaces a 17.5-second install with a 3.6-second restore, 79%, and the transfer that the local measurement could not see turned out to be small: the runner downloaded the 209 MB entry at 75–232 MB/s.</p>
</div>
<div class="callout warn">
<p><strong>Read the spread before the median.</strong> The same uncached <code>npm ci</code> took anything from 14.1 to 22.3 seconds on identical runners within ten minutes. A single run proves nothing about a two-second difference; a single run can prove a fourteen-second one. When you measure your own workflow, run it at least three times per variant and compare ranges, not the two numbers you happened to get first.</p>
</div>
${slide('ga-05', 4, 'Timeline: a miss pays extra to save, only a hit earns the saving')}
<p>The timeline shows the part that a single "cache hit" line hides: the <em>first</em> run of every cache is slower than no cache at all. The miss run still does the full install, then spends another 2.9 seconds (the npm download cache, 213 MB) or 4.9 seconds (the <code>node_modules</code> tarball, 209 MB) compressing and uploading in the Post step. A cache is an investment: you pay once on the miss and earn on every hit that follows — which is why the break-even arithmetic of Lesson 5.5 always needs the hit rate, not just the saving per hit.</p>

<h3>Two caches that hold two different things</h3>
${slide('ga-05', 5, 'Two caches hold two different things: the download store and the built tree')}
<p>The two approaches are not a faster and a slower version of the same idea. They store different objects, and that decides what they can skip:</p>
<table>
<thead><tr><th></th><th><code>cache: npm</code> (setup-node)</th><th><code>actions/cache</code> on <code>node_modules</code></th></tr></thead>
<tbody>
<tr><td>What is stored</td><td><code>~/.npm</code> — the package tarballs npm downloaded (225 MB on disk, 213 MB compressed)</td><td>the installed tree — 854 MB, 28,446 files (209 MB compressed)</td></tr>
<tr><td>What a hit skips</td><td>the network download only</td><td>the whole install: download, extraction, linking, lifecycle scripts</td></tr>
<tr><td>Does <code>npm ci</code> still run?</td><td>yes, always — and it deletes and rebuilds <code>node_modules</code></td><td>must <em>not</em> run on a hit, or it deletes what was just restored</td></tr>
<tr><td>What the key must contain</td><td>the lockfile hash (setup-node builds it for you, Lesson 4.4)</td><td>lockfile hash <strong>and</strong> OS <strong>and</strong> Node version — native modules are compiled for one ABI</td></tr>
<tr><td>Safe with <code>restore-keys</code>?</td><td>yes — npm re-checks every tarball against the lockfile</td><td>no — a stale tree would be used as-is, with no install to correct it</td></tr>
</tbody>
</table>
<div class="pitfall">
<p><strong>Trap — restoring <code>node_modules</code> and then running <code>npm ci</code> anyway.</strong> <code>npm ci</code> begins by deleting <code>node_modules</code>. A workflow that restores the tree and then runs an unconditional <code>npm ci</code> pays for the download and the restore and then throws the result away: it is strictly slower than no cache. The guard is the <code>if: steps.nm.outputs.cache-hit != 'true'</code> on the install step — and it has to test for the string <code>'true'</code>, because on a miss the output is an empty string, not <code>false</code> (the sandbox log printed <code>cache-hit = </code> with nothing after it).</p>
</div>

<h3>Why the local machine said 40% and the runner says 22%</h3>
${slide('ga-05', 6, 'The local machine said 40%, the runner says 22% — the runner fetches packages very fast')}
<p>Both measurements are correct; they measure different machines. A GitHub-hosted runner lives in an Azure data centre with a very fast path to the npm registry, so the part of <code>npm ci</code> that <code>cache: npm</code> removes — downloading tarballs — is already cheap there. What stays expensive on any machine is writing 28,000 files to disk, and only a <code>node_modules</code> cache removes that. On a home connection the proportions flip: the download is the slow part, and the built-in cache looks like the big win.</p>
<p>That is the general lesson, and it is worth more than either number: <strong>a performance measurement belongs to the machine it was taken on.</strong> Before you tell your team "the cache saves 40%", say where you measured it.</p>
<h3>When to use which — and when not</h3>
<table>
<thead><tr><th>Situation</th><th>Use</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Any Node job that installs dependencies</td><td><code>cache: npm</code> on setup-node</td><td>one line, safe, never worse than nothing after the first run</td></tr>
<tr><td>Install is the slowest step and runs on every push</td><td>also cache <code>node_modules</code>, keyed on OS + Node + lockfile, and skip <code>npm ci</code> on a hit</td><td>measured 17.5 s → 3.6 s here</td></tr>
<tr><td>Matrix over several Node versions or OSes</td><td>one <code>node_modules</code> entry per combination</td><td>native modules differ per ABI and platform</td></tr>
<tr><td>Dependencies with <code>postinstall</code> side effects outside <code>node_modules</code> (e.g. a Prisma client in <code>node_modules/.prisma</code> is fine; a global binary download is not)</td><td>stay with <code>cache: npm</code></td><td>a restored tree skips the scripts, so side effects elsewhere do not happen</td></tr>
<tr><td>Workflow runs less than once a week</td><td>no cache worth designing</td><td>entries unused for 7 days are deleted (Lesson 5.5)</td></tr>
<tr><td>The slow step is the build, not the install</td><td>neither — see the Chapter 2 critical path, or a build cache</td><td>no dependency cache touches the 149-second build</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Your CI takes eight minutes. Someone suggests "add caching". What do you do first?</strong><br>A: Read the step timings of a recent run (<code>gh run view --json jobs</code>) and find where the time goes. Caching only helps the step it replaces; if the build or the tests dominate, a dependency cache cannot move the total much. Then measure a hit against a miss on the runner, three times each.</p>
<p><strong>Q: What is the difference between <code>cache: npm</code> and caching <code>node_modules</code>?</strong><br>A: The first stores npm&#39;s download cache (<code>~/.npm</code>); <code>npm ci</code> still runs and rebuilds the tree, only the download is skipped. The second stores the built tree, so a hit can skip the install entirely — but the key must include OS and Node version, <code>restore-keys</code> are unsafe, and you must not run <code>npm ci</code> after a hit because it deletes <code>node_modules</code>.</p>
<p><strong>Q: Why is the first run after adding a cache slower?</strong><br>A: It misses, does the full work, and then compresses and uploads the entry in the Post step. The saving arrives on later hits.</p>
</div>

<h3>Why <code>actions/cache</code> uses zstd</h3>
<p>The two DIY rows are the same data with different compressors, and the difference is not marginal:</p>

<div class="out">gzip -1   nen 11.040 ms  ->  192 MB
zstd -3   nen  1.727 ms  ->  152 MB
                6,4x nhanh hon, va NHO HON</div>

<div class="callout ok">
<p><strong>Faster and smaller at the same time</strong> — which is unusual enough to be worth noticing, and is the whole reason the cache action switched. It matters in a specific way: compression happens in the <em>post</em> step, after your job&#39;s real work is done, so those nine saved seconds come off the tail of every job that saves a cache.</p>
</div>

<div class="pitfall">
<p><strong>Trap — caching something that is cheap to recreate.</strong> A cache pays only when restoring is faster than rebuilding, and both sides have to be measured, not assumed. A <code>dist/</code> directory that takes four seconds to build is not worth a cache entry: the save and restore overhead plus the transfer will exceed four seconds, and you have added an invalidation bug surface for a negative return. The rule that follows from the table above: measure the rebuild first, and only cache what is slower than the round trip.</p>
</div>

<h3>Where the time actually goes</h3>
${slide('ga-05', 7, 'Cache only touches the install step — the 149-second build stays')}
<p>Put this next to Chapter 2&#39;s measurements and the proportions become clear. On the Linux build job of run 32662461744:</p>

<div class="out">npm ci (hai lan)         35s   <- cai cache anh huong toi
Dung                    149s   <- cai cache KHONG anh huong toi
checkout + setup-node    20s
tai artifact len          8s</div>

<div class="callout warn">
<p><strong>Caching perfectly would take 35 seconds out of a 241-second job.</strong> Even eliminating the install entirely — which no cache does — leaves the 149-second build untouched. This is the same lesson as Chapter 2&#39;s critical path: the intuitive optimisation target is often not the expensive one, and the way to find out is to read the per-step timings before changing anything.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> <code>cache: 'npm'</code> is one line and measurably worth 40% of the install; everything beyond that is a smaller margin bought with a large transfer, and neither touches the build step that dominates the job.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team argues about whether caching is "worth it" for your project. Settle it with numbers from your own runner.</p><ol>
<li>In a test repository (or a branch of your own project), add a workflow with three jobs like the one above: no cache, <code>cache: npm</code>, and <code>actions/cache</code> on <code>node_modules</code> with <code>key: nm-&#36;{{ runner.os }}-node22-&#36;{{ hashFiles('package-lock.json') }}</code> and <code>npm ci</code> guarded by <code>if: steps.nm.outputs.cache-hit != 'true'</code>. Add <code>workflow_dispatch:</code>.</li>
<li>Wrap the install in <code>/usr/bin/time -f "npm ci: %e s"</code> and print <code>du -sh node_modules</code> and <code>du -sh ~/.npm</code>.</li>
<li>Push once (all misses), then run <code>gh workflow run &lt;file&gt;</code> three times (all hits).</li>
<li>Extract the numbers: <code>gh run view &lt;id&gt; --log | grep -E "npm ci:|Cache (hit|restored|Size)|Sent|Received"</code>.</li>
<li>Fill a table with the median and the range of each variant, and the extra cost of the miss run.</li></ol>
<p><strong>Done when:</strong> you have four runs per variant, a table with medians and ranges, the miss run&#39;s Post-step save time, and one sentence saying which variant your project should use and why — with the runner&#39;s numbers, not a local machine&#39;s.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache hit / miss</span><span class="v">Whether an entry matching the key existed. A hit restores files; a miss does the full work and (usually) saves in Post.</span></div>
  <div class="kv"><span class="k"><code>~/.npm</code></span><span class="v">npm&#39;s download cache of package tarballs — what <code>cache: npm</code> stores.</span></div>
  <div class="kv"><span class="k"><code>node_modules</code></span><span class="v">The installed dependency tree. Deleted by every <code>npm ci</code>.</span></div>
  <div class="kv"><span class="k">Post step</span><span class="v">The cleanup phase after the last step of a job; where <code>actions/cache</code> compresses and uploads on a miss.</span></div>
  <div class="kv"><span class="k">zstd</span><span class="v">The compressor the cache action uses: much faster than gzip at a similar or better ratio.</span></div>
  <div class="kv"><span class="k">Median / range</span><span class="v">The middle value and the spread of repeated measurements. Compare ranges before trusting a difference.</span></div>
  <div class="kv"><span class="k">ABI</span><span class="v">Binary interface of a Node version; native modules built for one do not load in another — why the Node version belongs in the key.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>On a local machine, <code>cache: npm</code> cut the install by 40%; on a GitHub runner, by 22% (17.5 s → 13.7 s), because the runner downloads packages fast.</li>
<li>Caching <code>node_modules</code> and skipping <code>npm ci</code> cut it by 79% (17.5 s → 3.6 s); the transfer of 209 MB took one to three seconds.</li>
<li>The first run of any cache is slower: full work plus 3–5 s to save in Post.</li>
<li><code>npm ci</code> deletes <code>node_modules</code> — guard it with <code>cache-hit != 'true'</code>; the output is empty, not <code>false</code>, on a miss.</li>
<li>A <code>node_modules</code> key needs OS + Node version + lockfile hash, and no <code>restore-keys</code>.</li>
<li>Numbers belong to the machine they were measured on; measure on the runner, three times, and read the range.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-do-cache.yml and its runs</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache — the three-way install measurement above; run 36004518266 is the cold one, 36004724418 and the four after it are warm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README and caching strategies</span><span class="lc-sub">github.com/actions/cache — the action&#39;s inputs, and <code>caching-strategies.md</code> in the same repository, which discusses the <code>node_modules</code>-versus-package-manager-cache question the measurement above answers with numbers.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Caching dependencies to speed up workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows — the cache service, the size limits, and the eviction policy that 5.5 measures against.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zstd — the Zstandard format</span><span class="lc-sub">facebook.github.io/zstd — the compression-ratio-versus-speed curve behind the 6.4× result above, and why level 3 is the usual default.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — measure the hit rate before you tune the cache</span><span class="lc-sub">/courses/redis/learn${REF} — the same discipline: a cache is an optimisation with a measurable return, and the first number to get is what it is actually saving.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — what npm ci does after the download</span><span class="lc-sub">/courses/nodejs/learn${REF} — unpacking, linking and lifecycle scripts, which is the 60% that no dependency cache removes.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Một cái cache thật sự mua được gì</h2>
<p class="lead">Cache là lời khuyên tiêu chuẩn cho một workflow chậm, và nó thường được đưa ra mà không kèm một con số nào. Bài này gắn một con số vào, đo trên chính tệp khoá thật của kho này: 898 gói, và một <code>node_modules</code> nặng 667 MB trải trên 38.909 file.</p>

<h3>Phép đo</h3>
<div class="out">cach                                        KHOI PHUC       LUU   dung luong
------------------------------------------------------------------------------
npm ci, ~/.npm LANH (khong cache gi)       31.409 ms         -           -
npm ci, ~/.npm AM   (= cache: npm)         18.757 ms         -      163 MB
cache thang node_modules, gzip -1          13.076 ms  11.040 ms     192 MB
cache thang node_modules, zstd -3          14.712 ms   1.727 ms     152 MB

(hai luot am do duoc 19.410 va 18.103 ms -> TB 18.757)</div>

<div class="callout ok">
<p><strong>Cái cache dựng sẵn một dòng đáng 40%.</strong> <code>cache: 'npm'</code> trên <code>setup-node</code> đưa bước cài từ 31,4 giây xuống 18,8. Đó là một khoản thắng lớn và rẻ, và đó là lý do cái dòng ấy có mặt trong gần như mọi workflow có cài thứ gì đó.</p>
</div>

<div class="callout warn">
<p><strong>Và nó KHÔNG gỡ bỏ được bước cài.</strong> 18,8 giây vẫn đổ vào việc dựng lại 38.909 file. Bài 4.4 đã gọi tên chuyện này và đây là con số đứng sau: thứ cache bỏ qua là <em>LƯỢT TẢI QUA MẠNG</em>, chứ không phải phần giải nén, liên kết và chạy script mà <code>npm ci</code> làm sau đó. Ai trông đợi "phụ thuộc đã cache" nghĩa là "không có bước cài" thì đang trông đợi 60% còn lại.</p>
</div>

<h3>Có nên cache thẳng <code>node_modules</code> không?</h3>
<p>Mấy hàng bên dưới cái dựng sẵn là bản tự làm — <code>actions/cache</code> trỏ thẳng vào <code>node_modules</code>. Khôi phục cái tarball zstd mất 14,7 giây so với 18,8 giây của <code>npm ci</code> ấm:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">phần được</span><span class="lz-t">4,1 giây</span><span class="lz-d">14,7 s khôi phục thay vì 18,8 s cài — cắt thêm 22% trên một lượt cài vốn đã có cache</span></div>
<div class="lz-step"><span class="lz-k">cái giá</span><span class="lz-t">152 MB, hai lần</span><span class="lz-d">tải lên khi lưu, tải xuống khi khôi phục. Phép đo này chạy trên đĩa cục bộ, nên thời gian mạng <em>KHÔNG</em> nằm trong 14,7 s</span></div>
<div class="lz-step"><span class="lz-k">phán quyết trung thực</span><span class="lz-t">tuỳ băng thông</span><span class="lz-d">phía tính toán nghiêng về cái tarball; còn phần truyền có nuốt mất 4,1 giây hay không là tính chất của dịch vụ cache, và nó KHÔNG được đo ở đây</span></div>
</div>

<div class="callout">
<p><strong>Nói rõ giới hạn của phép đo này.</strong> Mọi thứ bên trên là phần tính toán trên một cỗ máy với đĩa cục bộ. Trong một workflow thật, cả hai đường cache đều phải qua mạng tới dịch vụ cache của GitHub, và chính chặng ấy mới quyết định 4,1 giây thêm kia có sống sót không. Nên điều đáng mang đi không phải "hãy cache <code>node_modules</code>" hay "đừng" — mà là: dòng <code>cache:</code> dựng sẵn tóm được phần thắng LỚN và CHẮC CHẮN, còn bản tự làm đang đuổi theo một khoảng lề nhỏ hơn nhiều mà mạng của bạn có thể nuốt mất.</p>
</div>

<h3>Đo lại, trên runner thật</h3>
${slide('ga-05', 3, 'Trên runner: cache: npm cắt 22%, cache node_modules cắt 79%')}
<p>Mọi thứ bên trên được đo trên một cỗ máy với đĩa cục bộ, và phần "có nên cache thẳng <code>node_modules</code>" khép lại bằng một khoảng trống trung thực: chặng mạng chưa được đo. Nên ngày 24/09/2026, đúng phép so sánh ấy được chạy lại ở nơi code THẬT SỰ chạy — runner <code>ubuntu-24.04</code> của GitHub, trong kho sân tập công khai <a href="https://github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache" target="_blank" rel="noopener">cuonghoang1103/ga-san-tap</a>, nhánh <code>ch05-cache</code>. Dự án ở đó là một bản đóng thế có hình dạng của chính site này: Next.js, React, Express, Prisma, TypeScript, ESLint, Jest và Tailwind — một lockfile 743 mục cài ra 681 gói, thành một <code>node_modules</code> 854 MB gồm 28.446 file.</p>
<p>Workflow <code>ch05-do-cache.yml</code> có ba job cài CÙNG một lockfile theo ba cách, và nó chạy một lần do push (mọi cache đều lạnh) rồi năm lần nữa bằng <code>gh workflow run</code> (mọi cache đều ấm):</p>
<pre><code class="language-yaml">jobs:
  khong-cache:            # không cache gì — ~/.npm rỗng ở mọi lần
    steps:
      - uses: actions/setup-node@v6
        with: { node-version: '22' }
      - run: npm ci
  cache-npm:              # cái dựng sẵn một dòng: cache ~/.npm
    steps:
      - uses: actions/setup-node@v6
        with: { node-version: '22', cache: npm, cache-dependency-path: ch05/app/package-lock.json }
      - run: npm ci
  cache-node-modules:     # bản tự làm: cache cả cây đã dựng
    steps:
      - id: nm
        uses: actions/cache@v5
        with:
          path: ch05/app/node_modules
          key: ch05-nm-&#36;{{ runner.os }}-node22-&#36;{{ hashFiles('ch05/app/package-lock.json') }}
      - if: steps.nm.outputs.cache-hit != 'true'
        run: npm ci</code></pre>
<p>Mọi con số dưới đây lấy từ dấu thời gian trong log của các lần chạy ấy (khoảng giữa "Cache hit for" và "Cache restored successfully", và <code>/usr/bin/time</code> bọc quanh <code>npm ci</code>):</p>
<div class="out">run            khong-cache   cache: npm (khoi phuc + npm ci)  node_modules (khoi phuc)
36004518266    14,05 s       TRUOT: 19,49 s + 2,9 s luu       TRUOT: 18,06 s + 4,9 s luu
36004724418    18,36 s       2,09 + 11,29 s                   3,26 s
36004886526    15,74 s       1,43 + 15,94 s                   3,16 s
36004891780    16,71 s       3,55 + 15,10 s                   3,61 s
36004897271    18,80 s       1,39 + 10,93 s                   5,13 s
36005363122    22,26 s       3,15 + 11,64 s                   3,95 s
----------------------------------------------------------------------------------
trung vi       17,5 s        2,1 + 11,6 = 13,7 s              3,6 s</div>
<div class="callout ok">
<p><strong>Trên runner, thứ hạng giữ nguyên còn tỉ lệ thì không.</strong> <code>cache: npm</code> dựng sẵn tiết kiệm khoảng 3,8 giây, tức 22% — chừng một nửa con số 40% trên máy cục bộ. Khôi phục thẳng <code>node_modules</code> thì thay một lượt cài 17,5 giây bằng một lượt khôi phục 3,6 giây, tức 79%, và chặng truyền mà phép đo cục bộ không nhìn thấy hoá ra rất nhỏ: runner tải mục 209 MB xuống với tốc độ 75–232 MB/s.</p>
</div>
<div class="callout warn">
<p><strong>Đọc KHOẢNG dao động trước khi đọc trung vị.</strong> Cùng một lệnh <code>npm ci</code> không cache mất từ 14,1 tới 22,3 giây trên những runner giống hệt nhau trong vòng mười phút. Một lần chạy không chứng minh được gì về một chênh lệch hai giây; một lần chạy CÓ THỂ chứng minh một chênh lệch mười bốn giây. Khi đo workflow của mình, hãy chạy mỗi phương án ít nhất ba lần và so các khoảng, đừng so hai con số tình cờ ra đầu tiên.</p>
</div>
${slide('ga-05', 4, 'Dòng thời gian: trượt thì trả thêm tiền lưu, trúng mới thu lãi')}
<p>Dòng thời gian cho thấy phần mà một dòng "Cache hit" che mất: lần chạy <em>ĐẦU TIÊN</em> của mọi cái cache đều CHẬM HƠN không cache. Lần trượt vẫn cài đầy đủ, rồi tốn thêm 2,9 giây (kho tải về của npm, 213 MB) hoặc 4,9 giây (tarball <code>node_modules</code>, 209 MB) để nén và tải lên ở bước Post. Cache là một khoản ĐẦU TƯ: trả một lần lúc trượt, thu lại ở mọi lần trúng sau đó — và vì thế phép tính hoà vốn ở bài 5.5 luôn cần TỈ LỆ TRÚNG, không chỉ khoản tiết kiệm mỗi lần trúng.</p>

<h3>Hai cái cache giữ hai thứ khác nhau</h3>
${slide('ga-05', 5, 'Hai cái cache giữ hai thứ khác nhau: kho tải về và cây đã dựng')}
<p>Hai cách này không phải bản nhanh và bản chậm của cùng một ý. Chúng cất hai VẬT khác nhau, và chính điều đó quyết định chúng bỏ qua được gì:</p>
<table>
<thead><tr><th></th><th><code>cache: npm</code> (setup-node)</th><th><code>actions/cache</code> trên <code>node_modules</code></th></tr></thead>
<tbody>
<tr><td>Cất cái gì</td><td><code>~/.npm</code> — các tarball gói mà npm đã tải (225 MB trên đĩa, nén còn 213 MB)</td><td>cây đã cài — 854 MB, 28.446 file (nén còn 209 MB)</td></tr>
<tr><td>Trúng thì bỏ qua được gì</td><td>chỉ lượt tải qua mạng</td><td>cả bước cài: tải, giải nén, liên kết, script vòng đời</td></tr>
<tr><td><code>npm ci</code> còn chạy không?</td><td>có, luôn luôn — và nó XOÁ rồi dựng lại <code>node_modules</code></td><td>KHÔNG được chạy khi trúng, nếu không nó xoá đúng thứ vừa khôi phục</td></tr>
<tr><td>Khoá phải chứa gì</td><td>hash của lockfile (setup-node tự dựng, bài 4.4)</td><td>hash lockfile <strong>và</strong> hệ điều hành <strong>và</strong> phiên bản Node — module gốc được biên dịch cho đúng một ABI</td></tr>
<tr><td>Dùng <code>restore-keys</code> có an toàn?</td><td>có — npm kiểm lại từng tarball theo lockfile</td><td>không — một cây cũ sẽ được dùng nguyên như thế, chẳng có bước cài nào sửa lại</td></tr>
</tbody>
</table>
<div class="pitfall">
<p><strong>Bẫy — khôi phục <code>node_modules</code> rồi VẪN chạy <code>npm ci</code>.</strong> <code>npm ci</code> bắt đầu bằng việc XOÁ <code>node_modules</code>. Một workflow khôi phục cả cây rồi chạy <code>npm ci</code> vô điều kiện sẽ trả tiền tải về, trả tiền khôi phục, rồi vứt kết quả đi: nó chậm hơn hẳn không cache. Chốt chặn là <code>if: steps.nm.outputs.cache-hit != 'true'</code> trên bước cài — và phải so với CHUỖI <code>'true'</code>, vì khi trượt output là chuỗi RỖNG chứ không phải <code>false</code> (log sân tập in ra <code>cache-hit = </code> mà không có gì phía sau).</p>
</div>

<h3>Vì sao máy cục bộ nói 40% còn runner nói 22%</h3>
${slide('ga-05', 6, 'Máy cục bộ cắt 40%, runner chỉ 22% — runner tải gói rất nhanh')}
<p>Cả hai phép đo đều ĐÚNG; chúng đo hai cỗ máy khác nhau. Runner của GitHub nằm trong trung tâm dữ liệu Azure, có đường đi rất nhanh tới registry npm, nên phần <code>npm ci</code> mà <code>cache: npm</code> gỡ bỏ — tải tarball — vốn đã rẻ ở đó. Thứ vẫn đắt trên MỌI cỗ máy là ghi 28 nghìn file xuống đĩa, và chỉ cache <code>node_modules</code> mới gỡ được phần ấy. Trên mạng gia đình thì tỉ lệ đảo ngược: tải về mới là phần chậm, và cache dựng sẵn trông như khoản thắng lớn.</p>
<p>Đó là bài học chung, và nó đáng giá hơn cả hai con số: <strong>một phép đo hiệu năng thuộc về cỗ máy mà nó được đo trên đó.</strong> Trước khi nói với cả nhóm "cache tiết kiệm 40%", hãy nói bạn đo ở ĐÂU.</p>
<h3>Khi nào dùng cái nào — và khi nào KHÔNG</h3>
<table>
<thead><tr><th>Tình huống</th><th>Dùng</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Mọi job Node có cài phụ thuộc</td><td><code>cache: npm</code> trên setup-node</td><td>một dòng, an toàn, sau lần đầu thì không bao giờ tệ hơn không có</td></tr>
<tr><td>Bước cài là bước chậm nhất và chạy ở mọi lần push</td><td>cache thêm <code>node_modules</code>, khoá theo OS + Node + lockfile, bỏ <code>npm ci</code> khi trúng</td><td>đo ở đây: 17,5 s → 3,6 s</td></tr>
<tr><td>Ma trận nhiều phiên bản Node hoặc nhiều OS</td><td>mỗi tổ hợp một mục <code>node_modules</code></td><td>module gốc khác nhau theo ABI và nền tảng</td></tr>
<tr><td>Phụ thuộc có <code>postinstall</code> tạo thứ NGOÀI <code>node_modules</code> (Prisma client trong <code>node_modules/.prisma</code> thì ổn; tải một binary ra thư mục toàn cục thì không)</td><td>giữ <code>cache: npm</code></td><td>khôi phục cây thì bỏ qua script, nên tác dụng phụ ở chỗ khác không xảy ra</td></tr>
<tr><td>Workflow chạy ít hơn một lần mỗi tuần</td><td>không cache nào đáng thiết kế</td><td>mục không dùng 7 ngày bị xoá (bài 5.5)</td></tr>
<tr><td>Bước chậm là bản dựng, không phải bước cài</td><td>không cái nào — xem đường tới hạn ở Chương 2, hoặc cache của công cụ dựng</td><td>không cache phụ thuộc nào chạm tới bản dựng 149 giây</td></tr>
</tbody>
</table>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: CI của bạn mất tám phút. Có người đề xuất "thêm cache". Bạn làm gì trước tiên?</strong><br>Đ: Đọc thời gian từng bước của một lần chạy gần đây (<code>gh run view --json jobs</code>) và tìm xem thời gian đổ vào đâu. Cache chỉ giúp đúng bước mà nó thay thế; nếu bản dựng hay bộ test áp đảo thì cache phụ thuộc không lay được tổng bao nhiêu. Sau đó đo một lần trúng so với một lần trượt TRÊN RUNNER, mỗi bên ba lần.</p>
<p><strong>H: <code>cache: npm</code> khác gì cache <code>node_modules</code>?</strong><br>Đ: Cái đầu cất kho tải về của npm (<code>~/.npm</code>); <code>npm ci</code> vẫn chạy và dựng lại cây, chỉ lượt tải được bỏ qua. Cái sau cất cả cây đã dựng, nên một lần trúng bỏ được hẳn bước cài — nhưng khoá phải có OS và phiên bản Node, <code>restore-keys</code> là không an toàn, và không được chạy <code>npm ci</code> sau khi trúng vì nó xoá <code>node_modules</code>.</p>
<p><strong>H: Vì sao lần chạy đầu sau khi thêm cache lại chậm hơn?</strong><br>Đ: Nó trượt, làm đủ việc, rồi còn nén và tải mục cache lên ở bước Post. Khoản tiết kiệm đến ở những lần trúng sau.</p>
</div>

<h3>Vì sao <code>actions/cache</code> dùng zstd</h3>
<p>Hai hàng tự-làm là cùng một dữ liệu với hai bộ nén khác nhau, và khác biệt không hề nhỏ:</p>

<div class="out">gzip -1   nen 11.040 ms  ->  192 MB
zstd -3   nen  1.727 ms  ->  152 MB
                6,4x nhanh hon, va NHO HON</div>

<div class="callout ok">
<p><strong>Vừa nhanh hơn vừa nhỏ hơn cùng lúc</strong> — chuyện đủ bất thường để đáng để ý, và là toàn bộ lý do action cache đổi sang nó. Nó có ý nghĩa theo một cách cụ thể: việc nén xảy ra ở bước <em>POST</em>, sau khi phần việc thật của job đã xong, nên chín giây tiết kiệm ấy được cắt khỏi cái ĐUÔI của mọi job có lưu cache.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — cache một thứ vốn rẻ để tạo lại.</strong> Một cái cache chỉ có lãi khi KHÔI PHỤC nhanh hơn DỰNG LẠI, và cả hai vế đều phải được đo chứ không được đoán. Một thư mục <code>dist/</code> dựng hết bốn giây thì không đáng một mục cache: phần chi phí lưu với khôi phục cộng với lượt truyền sẽ vượt bốn giây, và bạn vừa thêm vào một bề mặt lỗi hết-hiệu-lực để đổi lấy một khoản lãi ÂM. Quy tắc rút ra từ bảng bên trên: hãy đo thời gian dựng lại TRƯỚC, và chỉ cache thứ chậm hơn một vòng đi-về.</p>
</div>

<h3>Thời gian thật ra đi đâu</h3>
${slide('ga-05', 7, 'Cache chỉ chạm tới bước cài — bản dựng 149 giây vẫn nguyên')}
<p>Đặt cái này cạnh các phép đo của Chương 2 thì tỉ lệ hiện ra rõ. Trên job dựng Linux của run 32662461744:</p>

<div class="out">npm ci (hai lan)         35s   <- cai cache anh huong toi
Dung                    149s   <- cai cache KHONG anh huong toi
checkout + setup-node    20s
tai artifact len          8s</div>

<div class="callout warn">
<p><strong>Cache hoàn hảo sẽ lấy ra 35 giây khỏi một job 241 giây.</strong> Ngay cả khi triệt tiêu hẳn bước cài — mà không cache nào làm được — thì bản dựng 149 giây vẫn còn nguyên. Đây vẫn là bài học về đường tới hạn của Chương 2: cái đích tối ưu theo trực giác thường không phải cái đắt, và cách biết được là ĐỌC nhịp thời gian từng bước trước khi đổi bất cứ thứ gì.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> <code>cache: 'npm'</code> chỉ một dòng và đo được là đáng 40% của bước cài; mọi thứ vượt quá đó là một khoảng lề nhỏ hơn mua bằng một lượt truyền lớn, và không cái nào chạm tới bước dựng vốn đang áp đảo cả job.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> cả nhóm cãi nhau xem cache "có đáng không" với dự án của mình. Chốt bằng con số từ runner của CHÍNH bạn.</p><ol>
<li>Trong một kho thử (hoặc một nhánh của dự án bạn), thêm workflow có ba job như bên trên: không cache, <code>cache: npm</code>, và <code>actions/cache</code> trên <code>node_modules</code> với <code>key: nm-&#36;{{ runner.os }}-node22-&#36;{{ hashFiles('package-lock.json') }}</code>, bước <code>npm ci</code> có chốt <code>if: steps.nm.outputs.cache-hit != 'true'</code>. Thêm <code>workflow_dispatch:</code>.</li>
<li>Bọc lệnh cài bằng <code>/usr/bin/time -f "npm ci: %e s"</code> và in <code>du -sh node_modules</code>, <code>du -sh ~/.npm</code>.</li>
<li>Push một lần (trượt hết), rồi chạy <code>gh workflow run &lt;tệp&gt;</code> ba lần (trúng hết).</li>
<li>Rút số: <code>gh run view &lt;id&gt; --log | grep -E "npm ci:|Cache (hit|restored|Size)|Sent|Received"</code>.</li>
<li>Điền bảng: trung vị và khoảng dao động của từng phương án, cộng phần tốn thêm của lần trượt.</li></ol>
<p><strong>Đạt khi:</strong> bạn có bốn lần chạy cho mỗi phương án, một bảng có trung vị và khoảng, thời gian lưu ở bước Post của lần trượt, và một câu nói dự án bạn nên dùng phương án nào và vì sao — bằng số của RUNNER, không phải của máy cục bộ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache hit / miss (trúng / trượt)</span><span class="v">Có hay không một mục khớp khoá. Trúng thì khôi phục file; trượt thì làm đủ việc và (thường) lưu ở bước Post.</span></div>
  <div class="kv"><span class="k"><code>~/.npm</code></span><span class="v">Kho tải về của npm, chứa tarball các gói — thứ mà <code>cache: npm</code> cất.</span></div>
  <div class="kv"><span class="k"><code>node_modules</code></span><span class="v">Cây phụ thuộc đã cài. Bị xoá ở MỌI lần <code>npm ci</code>.</span></div>
  <div class="kv"><span class="k">Bước Post (dọn dẹp)</span><span class="v">Pha chạy sau bước cuối cùng của job; nơi <code>actions/cache</code> nén và tải lên khi trượt.</span></div>
  <div class="kv"><span class="k">zstd</span><span class="v">Bộ nén mà action cache dùng: nhanh hơn gzip nhiều với tỉ lệ nén tương đương hoặc tốt hơn.</span></div>
  <div class="kv"><span class="k">Trung vị / khoảng dao động</span><span class="v">Giá trị ở giữa và độ trải của các lần đo lặp lại. So khoảng trước khi tin một chênh lệch.</span></div>
  <div class="kv"><span class="k">ABI (giao diện nhị phân)</span><span class="v">Giao diện nhị phân của một phiên bản Node; module gốc dựng cho bản này không nạp được ở bản khác — lý do phiên bản Node phải nằm trong khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trên máy cục bộ, <code>cache: npm</code> cắt 40% bước cài; trên runner của GitHub chỉ 22% (17,5 s → 13,7 s), vì runner tải gói rất nhanh.</li>
<li>Cache <code>node_modules</code> và bỏ <code>npm ci</code> cắt 79% (17,5 s → 3,6 s); truyền 209 MB chỉ mất một tới ba giây.</li>
<li>Lần chạy đầu của mọi cache đều chậm hơn: làm đủ việc cộng 3–5 s để lưu ở bước Post.</li>
<li><code>npm ci</code> xoá <code>node_modules</code> — chốt nó bằng <code>cache-hit != 'true'</code>; khi trượt output là chuỗi rỗng chứ không phải <code>false</code>.</li>
<li>Khoá của <code>node_modules</code> cần OS + phiên bản Node + hash lockfile, và không có <code>restore-keys</code>.</li>
<li>Con số thuộc về cỗ máy nó được đo; hãy đo trên runner, ba lần, và đọc khoảng dao động.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-do-cache.yml và các lần chạy</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache — phép đo cài ba cách bên trên; run 36004518266 là lần lạnh, 36004724418 và bốn lần sau là lần ấm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README và caching strategies</span><span class="lc-sub">github.com/actions/cache — các tham số của action, và tệp <code>caching-strategies.md</code> trong cùng kho, nơi bàn đúng câu hỏi node_modules-hay-cache-của-trình-quản-lý-gói mà phép đo bên trên trả lời bằng con số.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Caching dependencies to speed up workflows</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows — dịch vụ cache, các giới hạn dung lượng, và chính sách thu hồi mà bài 5.5 đối chiếu tới.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">zstd — định dạng Zstandard</span><span class="lc-sub">facebook.github.io/zstd — đường cong tỉ-lệ-nén với tốc-độ đứng sau kết quả 6,4 lần bên trên, và vì sao mức 3 là mặc định thường dùng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — đo tỉ lệ trúng TRƯỚC khi đi tinh chỉnh cache</span><span class="lc-sub">/courses/redis/learn${REF} — cùng kỷ luật ấy: một cái cache là một phép tối ưu có lãi ĐO ĐƯỢC, và con số đầu tiên cần lấy là nó đang tiết kiệm được cái gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Node.js — npm ci làm gì SAU khi tải xong</span><span class="lc-sub">/courses/nodejs/learn${REF} — giải nén, liên kết và các script vòng đời, tức là 60% mà không cache phụ thuộc nào gỡ bỏ được.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Keys, restore-keys, and immutability|||5.2 — Khoá, restore-keys, và tính bất biến',
      slug: 'ga-5-2-khoa-cache',
      type: 'VIDEO',
      description: 'Một mục cache KHÔNG ghi đè được: khoá đã ghi là đóng vĩnh viễn. Từ luật đó chảy ra mọi thứ — vì sao khoá phải chứa một hash, vì sao `restore-keys` là phần cứu vãn, và vì sao một khoá HẰNG cho ra một cache đông cứng mãi mãi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Keys, <code>restore-keys</code>, and immutability</h2>
<p class="lead">There is exactly one rule that makes cache design non-obvious, and it is not written prominently anywhere: <strong>a cache entry cannot be overwritten</strong>. Once a key has been written, that key is closed. Every other design decision follows from it.</p>

<h3>The rule, and its immediate consequence</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">first run</span><span class="lz-t">key miss → job runs → save</span><span class="lz-d">the entry now exists under that exact key</span></div>
<div class="lz-step"><span class="lz-k">every later run, same key</span><span class="lz-t">hit → restore → <em>no save</em></span><span class="lz-d">the log says so: "Cache hit occurred on the primary key …, not saving cache"</span></div>
<div class="lz-step"><span class="lz-k">so a constant key</span><span class="lz-t">freezes on run one</span><span class="lz-d">whatever was in the cache the first time is what every future run gets, forever</span></div>
</div>

<div class="callout warn">
<p><strong>A key that never changes gives you a cache that never updates.</strong> This is not a corner case — it is what happens by default if you write <code>key: node-modules</code> and move on. The workflow gets fast, stays fast, and quietly serves the dependency tree from whenever the cache was first written. Lesson 3.4 measured the version of this bug that arrives by accident: a <code>hashFiles()</code> whose glob matches nothing returns an empty string, so <code>my-cache-&#36;{{ hashFiles('typo') }}</code> collapses to the constant <code>my-cache-</code>.</p>
</div>

<h3>Measured: a second save is refused, and a constant key freezes</h3>
${slide('ga-05', 9, 'Write once: saving the same key again is refused, and the job stays green')}
<p>The rule is easy to state and easy to doubt, so the sandbox workflow <code>ch05-khoa.yml</code> tests it directly. One job writes a file, saves it with <code>actions/cache/save</code>, changes the file, saves again under the same key, deletes the directory and restores:</p>
<div class="out"># job bat-bien — run 36004518205
Cache saved with key: ch05-bb-36004518205
# step "Luu LAI cung khoa" (save again, same key):
Failed to save: Unable to reserve cache with key ch05-bb-36004518205,
  another job may be creating this cache.
$ cat bb/x.txt
lan ghi 1          &lt;- the FIRST content, not the second</div>
<p>Two details matter more than the refusal itself. The second save is not an error: the step is green and the message is a plain log line, not even a yellow warning. And the wording — "another job may be creating this cache" — sends people looking for a race between jobs when the real cause is simply that the entry already exists. If you see that line, the entry you wanted to update is still the old one.</p>

${slide('ga-05', 10, 'A constant key freezes on the first run')}
<p>The constant-key failure is the same rule seen across runs. The job <code>khoa-hang</code> uses <code>key: ch05-khoa-hang</code>, prints what the cache contains, then writes a line naming the current run:</p>
<div class="out"># run 1 — 36004518205
Cache not found for input keys: ch05-khoa-hang
noi dung trong cache: (trong)                 &lt;- empty
Cache saved with key: ch05-khoa-hang

# run 2 — 36004824230, three minutes later
Cache hit for: ch05-khoa-hang
noi dung trong cache: lan chay nay la run 36004518205 attempt 1
Cache hit occurred on the primary key ch05-khoa-hang, not saving cache.</div>
<p>Run 2 wrote its own line into the directory — and that line will never reach the cache, because a primary-key hit means the Post step does not save. From now on every run receives run 1&#39;s content. The only ways out are a new key or deleting the entry (<code>gh cache delete ch05-khoa-hang</code>, Lesson 5.5).</p>

<h3>The key is a claim about what the content depends on</h3>
${slide('ga-05', 8, 'The key tree: exact match first, then back off by prefix')}
<p>This repository&#39;s working cache key, from <code>deploy-ghcr.yml</code>:</p>

<pre><code>key: nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles('frontend/package-lock.json') }}</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">a literal prefix</span><span class="v"><code>nextjs-cache-</code> — names the contents, so the cache list is readable by a human</span></div>
<div class="kv"><span class="k">the platform</span><span class="v"><code>runner.os</code>, which the log showed expanding to <code>Linux</code>. Without it a macOS job could restore a Linux cache — and native modules would be the wrong architecture</span></div>
<div class="kv"><span class="k">a content hash</span><span class="v"><code>hashFiles</code> over the lockfile: the key changes exactly when the dependency set changes, verified reproducible in 3.4</span></div>
<div class="kv"><span class="k">what is <em>not</em> in it</span><span class="v">the branch, the commit, the run number. Any of those would make the key change every run, which means every run misses and every run saves — a cache that costs the upload and returns nothing</span></div>
</div>

<div class="callout ok">
<p><strong>The design question, stated once:</strong> a cache key should change when the cached content <em>should</em> change, and not otherwise. Too stable and you serve stale content forever; too volatile and you never get a hit. Everything else is detail.</p>
</div>

<h3><code>restore-keys</code> — the partial credit</h3>
<p>An exact key miss does not have to mean starting from nothing. <code>restore-keys</code> is a list of <em>prefixes</em>, tried in order, each matching the most recently created entry that starts with it:</p>

<pre><code>key: nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles('frontend/package-lock.json') }}
restore-keys: |
  nextjs-cache-&#36;{{ runner.os }}-frontend-lock-
  nextjs-cache-&#36;{{ runner.os }}-frontend-</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">exact key hits</span><span class="lz-lnote">the lockfile is unchanged — restore, and do not save. This is the common case</span></div>
<div class="lz-layer"><span class="lz-lname">exact miss, first prefix hits</span><span class="lz-lnote">the lockfile changed. You get the <em>previous</em> lockfile&#39;s cache — for a Next.js build cache that is still most of the value, because most compiled output is unaffected by one dependency bump</span></div>
<div class="lz-layer"><span class="lz-lname">and then it <strong>saves</strong> under the new key</span><span class="lz-lnote">this is the part people miss. A restore-key hit is still a primary-key <em>miss</em>, so the post step writes a new entry. The cache rolls forward on its own</span></div>
<div class="lz-layer"><span class="lz-lname">everything misses</span><span class="lz-lnote">a cold job. Slower, correct, and self-healing on the next run</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — <code>restore-keys</code> on a cache where partial content is wrong.</strong> A build cache tolerates being slightly out of date because the build tool re-checks what it uses. A <code>node_modules</code> cache does not: restoring the previous lockfile&#39;s tree and then <em>not</em> running the install leaves you building against dependency versions your lockfile does not name. The rule: use <code>restore-keys</code> when a stale hit is a speed-up on top of a correct step that still runs, and not when a stale hit <em>replaces</em> that step.</p>
</div>

<h3>Ordering, measured: newest within a line, first line wins</h3>
${slide('ga-05', 11, 'A prefix returns the newest match; with several lines, the upper line wins')}
<p>Two jobs of <code>ch05-khoa.yml</code> save <code>ch05-rk-&lt;run&gt;-a</code> (at 13:19:11) and then <code>ch05-rk-&lt;run&gt;-b</code> (at 13:19:19). A third job then asks two questions:</p>
<div class="out"># 1) key ...-c (does not exist), restore-keys: ch05-rk-&lt;run&gt;-
Cache hit for restore-key: ch05-rk-36004824230-b
ban MOI — job luu-moi, 13:19:19               &lt;- the NEWER of the two
cache-hit=false
Post: Cache saved with key: ch05-rk-36004824230-c

# 2) restore-keys: ch05-rk-&lt;run&gt;-a   then   ch05-rk-&lt;run&gt;-
Cache hit for restore-key: ch05-rk-36004824230-a
cache-hit=false  matched=ch05-rk-36004824230-a   &lt;- the first LINE, although -b is newer</div>
<ul>
<li><strong>Within one line</strong>, several entries can share the prefix, and the most recently created one is returned — exactly what the documentation says, and what makes a <code>restore-keys</code> fallback useful: after a lockfile change you get the latest cache, not a random old one.</li>
<li><strong>Between lines</strong>, order decides. The second lookup matched the <code>-a</code> line first and never looked further, although <code>-b</code> was newer and also matched the second line. So write <code>restore-keys</code> from the most specific prefix to the most general.</li>
<li><strong>The partial hit still saves</strong>: <code>cache-hit=false</code>, and the Post step wrote <code>-c</code>. That is the roll-forward described above, observed.</li>
</ul>
<p>The restore action also exposes which key actually matched. <code>actions/cache/restore</code> has the outputs <code>cache-hit</code>, <code>cache-primary-key</code> and <code>cache-matched-key</code>; the combined <code>actions/cache</code> exposes only <code>cache-hit</code> (checked in its <code>action.yml</code> at v5.1.0). When you need to know <em>which</em> old entry you received, use the split restore action.</p>
<table>
<thead><tr><th>Input of <code>actions/cache</code> v5</th><th>What it does</th><th>When you want it</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>exact key; tried first (and, as Lesson 5.3 shows, also as a prefix)</td><td>always</td></tr>
<tr><td><code>restore-keys</code></td><td>ordered list of prefixes, tried after the key</td><td>when a stale entry is a head start, not an answer</td></tr>
<tr><td><code>lookup-only</code></td><td>checks whether an entry exists, downloads nothing</td><td>to skip a whole job when a cache is already warm</td></tr>
<tr><td><code>fail-on-cache-miss</code></td><td>turns a miss into a failed step</td><td>a job that must never run cold (a deliberate hand-off)</td></tr>
<tr><td><code>enableCrossOsArchive</code></td><td>lets Windows share entries with other OSes</td><td>rarely; OS belongs in the key</td></tr>
</tbody>
</table>
<div class="callout warn">
<p><strong>The combined action saves only if the job succeeded.</strong> Its <code>action.yml</code> declares <code>post-if: "success()"</code>. A job that fails after a slow install therefore saves nothing, and the next attempt starts cold again. When that matters — a long build that fails late in tests — use <code>actions/cache/restore</code> at the start and <code>actions/cache/save</code> with <code>if: always()</code> at the end, exactly the split shown in the next section.</p>
</div>

<h3>The scoping rule that explains "my cache never hits"</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a branch reads its own caches</span><span class="v">plus those of the repository&#39;s <strong>default</strong> branch — and, for a <code>pull_request</code> run, the PR&#39;s base branch. A feature branch can restore what <code>main</code> saved; it can <em>not</em> restore what the branch it was created from saved, unless that branch is the default one (corrected — measured below)</span></div>
<div class="kv"><span class="k">branches cannot read each other</span><span class="v">two feature branches are isolated. A cache warmed on <code>feature/a</code> is invisible to <code>feature/b</code>, which is the usual reason a PR seems to never hit</span></div>
<div class="kv"><span class="k">so warm the default branch</span><span class="v">a scheduled or push-triggered job on <code>main</code> that populates the cache makes every PR benefit. Without it, the first run of every branch is cold</span></div>
<div class="kv"><span class="k">and PR runs write to the PR&#39;s scope</span><span class="v">a cache saved during a <code>pull_request</code> run does not warm <code>main</code>. The direction only goes one way</span></div>
</div>

${slide('ga-05', 13, 'Readable: your own branch, the default branch, the PR base branch')}
<p>The scoping rule was also tested rather than recited, because the phrase "a branch reads its base branch" is where most misunderstandings start. The sandbox has three places a cache can live: branch <code>ch05-cache</code>, a branch <code>ch05-cache-em</code> created <em>from</em> it, and <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/4" target="_blank" rel="noopener">pull request #4</a> from <code>ch05-cache-em</code> into <code>ch05-cache</code>. The workflow <code>ch05-pham-vi.yml</code> saves one tiny entry named after where it runs, and before that looks up (with <code>lookup-only: true</code>) the entries of every other place — plus an entry that Chapter 4 left on branch <code>ch04-action</code>.</p>

${slide('ga-05', 14, 'The measured matrix: 12 lookups, only 4 succeed')}
<div class="out"># from refs/pull/4/merge (PR run, then its re-run 36004957041 attempt 2)
Cache hit for: ch05-pv-ch05-cache                 &lt;- the PR base: readable
Cache not found for input keys: ch05-pv-ch05-cache-em   &lt;- the PR's OWN head branch: not
Cache hit for: ch05-pv-pr                         &lt;- its own entry, only on the re-run

# from refs/heads/ch05-cache (run 36005100779)
Cache hit for: ch05-pv-ch05-cache
Cache not found for input keys: ch05-pv-ch05-cache-em    &lt;- child branch
Cache not found for input keys: ch05-pv-pr               &lt;- the PR into it
Cache not found for input keys: node-cache-Linux-x64-npm-d94a99a0...   &lt;- ch04-action</div>
<div class="callout warn">
<p><strong>Correction to this lesson.</strong> An earlier version of the scoping table said a branch reads "its base branch". It does not — not in the sense of "the branch it was created from". <code>ch05-cache-em</code> was created from <code>ch05-cache</code> and could not read a single entry of it (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36004861851" target="_blank" rel="noopener">36004861851</a>). What a run can read, per the documentation and these runs, is: its own branch, the repository&#39;s <strong>default</strong> branch, and — only for a <code>pull_request</code> run — the PR&#39;s <strong>base</strong> branch. The first row of the table above has been corrected accordingly.</p>
</div>
<p>One more result is easy to miss: the PR run could <em>not</em> read the cache of its own head branch <code>ch05-cache-em</code>. A PR runs on <code>refs/pull/4/merge</code>, which is a different ref from the branch you pushed, so pushing to a feature branch and then opening a PR does not warm the PR. The practical consequence is the advice already given — warm <code>main</code> — plus a subtle one: a cache saved on a PR is readable only by re-runs of that same PR, so a repository that only runs CI on pull requests saves hundreds of entries nobody else can ever use.</p>
<p>(This sandbox deliberately does not push workflows to its <code>main</code> branch, so the "default branch is readable" row comes from the documentation rather than a run; every other cell of the matrix is measured.)</p>

<h3>Restore without save, and save without restore</h3>
<p>Two variants exist and both solve real problems:</p>

<pre><code><span class="tok-comment"># chi PHUC HOI, khong bao gio luu — cho cac job an theo</span>
- uses: actions/cache/restore@v4
  with: { path: dist, key: build-&#36;{{ github.sha }} }

<span class="tok-comment"># chi LUU — chay o cuoi job dung, du cac buoc truoc co hong</span>
- uses: actions/cache/save@v4
  if: always()
  with: { path: dist, key: build-&#36;{{ github.sha }} }</code></pre>

<div class="callout">
<p><strong>The split is what makes a cache usable as a hand-off between jobs</strong> — one job saves, several restore. It is not a replacement for artifacts: a cache can be evicted at any time and a restore miss must be survivable, whereas an artifact is guaranteed to be there for its retention period. Use the cache when a miss means "slower"; use an artifact when a miss means "broken". 5.4 measures the difference.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Cache entries are write-once, so the key is the whole design: put a content hash in it so it changes when the content should, put the platform in it so it does not cross architectures, and use <code>restore-keys</code> only where a stale hit is an optimisation rather than an answer.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: Design a cache key for <code>node_modules</code> in a matrix over Ubuntu and macOS and Node 20 and 22.</strong><br>A: <code>nm-&#36;{{ runner.os }}-&#36;{{ runner.arch }}-node&#36;{{ matrix.node }}-&#36;{{ hashFiles('**/package-lock.json') }}</code>. OS, architecture and Node version because native modules are compiled for them; the lockfile hash because the content depends on it; nothing that changes per run. No <code>restore-keys</code>, because a stale tree would be used without an install to fix it.</p>
<p><strong>Q: Why doesn&#39;t my cache update after I change a dependency?</strong><br>A: Entries are immutable. If the key does not include the lockfile hash (or the hash covers the wrong file), the key stays the same, every run hits, and the Post step never saves. Fix the key, or delete the entry once with <code>gh cache delete</code>.</p>
<p><strong>Q: A feature branch never gets a cache hit, although <code>develop</code> — which it was branched from — has a warm cache. Why?</strong><br>A: Runs read their own branch, the default branch, and for PRs the base branch. <code>develop</code> is none of those unless it is the default branch or the PR&#39;s base. Warm the default branch, or run the workflow on the PR into <code>develop</code>.</p>
<p><strong>Q: When is <code>restore-keys</code> dangerous?</strong><br>A: When a stale match replaces a step instead of speeding it up — a restored <code>node_modules</code> with no install afterwards. It is safe when a correct step still runs on top (npm download cache, a Next.js build cache, <code>.tsbuildinfo</code> with its outputs).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> prove the three rules of this lesson on your own repository instead of believing them.</p><ol>
<li>Add a job that saves a directory with <code>actions/cache/save</code>, changes a file, saves again under the same key, deletes the directory, and restores with <code>actions/cache/restore</code>. Print the file.</li>
<li>Add a job with <code>key: my-constant-key</code> that prints the cached file and then overwrites it with <code>&#36;{{ github.run_id }}</code>. Run the workflow twice.</li>
<li>Save two entries <code>demo-&#36;{{ github.run_id }}-a</code> and <code>-b</code> in two sequential jobs, then restore with <code>restore-keys: demo-&#36;{{ github.run_id }}-</code> and print <code>cache-matched-key</code>.</li>
<li>Create a branch from your feature branch, push it, and check with <code>lookup-only: true</code> whether it sees the parent&#39;s entry.</li></ol>
<p><strong>Done when:</strong> your logs show "Unable to reserve cache" with a green step, the second run of the constant key prints the first run&#39;s ID, the prefix lookup returns <code>-b</code>, and the child branch reports no hit — four facts you can now explain with a run link each.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Primary key</span><span class="v">The exact <code>key</code>. A hit on it means <code>cache-hit=true</code> and no save.</span></div>
  <div class="kv"><span class="k"><code>restore-keys</code></span><span class="v">Ordered prefixes tried after the key; newest entry per line, first matching line wins.</span></div>
  <div class="kv"><span class="k">Immutable entry</span><span class="v">An entry cannot be overwritten; a second save logs "Unable to reserve cache" and the step stays green.</span></div>
  <div class="kv"><span class="k"><code>cache-matched-key</code></span><span class="v">Output of the restore action naming the key that actually matched.</span></div>
  <div class="kv"><span class="k"><code>lookup-only</code></span><span class="v">Checks existence without downloading.</span></div>
  <div class="kv"><span class="k">Cache scope</span><span class="v">The ref an entry belongs to: branch, <code>refs/pull/N/merge</code>, or tag.</span></div>
  <div class="kv"><span class="k">Default / base branch</span><span class="v">The repository&#39;s main branch; the target branch of a pull request.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Entries are write-once: a second save is refused with a green step; a constant key freezes on run one.</li>
<li>The key must encode what the content depends on — OS, tool version, lockfile hash — and nothing that changes per run.</li>
<li><code>restore-keys</code>: newest entry within a line, first matching line wins, and a partial hit saves under the new key.</li>
<li>The combined action saves only on success; use restore + save with <code>if: always()</code> when late failures matter.</li>
<li>Runs read their own branch, the default branch, and (PRs) the base branch — not the branch they were created from, and not the PR&#39;s head branch.</li>
<li>Use <code>restore-keys</code> only where a correct step still runs on top of the stale content.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-khoa.yml, ch05-pham-vi.yml and pull request #4</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap — the immutability, constant-key, ordering and scoping runs quoted above (36004518205, 36004824230, 36005100779, 36004861851, 36005610825, 36004957041).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Caching dependencies: matching a cache key</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#matching-a-cache-key — the prefix-matching order for <code>restore-keys</code>, and the statement that entries cannot be updated once written.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Restrictions for accessing a cache</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache — the branch-scoping rules above, which are the documented answer to most "why is my cache always cold" questions.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — restore and save sub-actions</span><span class="lc-sub">github.com/actions/cache/tree/main/restore — the split variants, their inputs, and the <code>cache-hit</code> output that lets a later step branch on whether the restore succeeded.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — key design, TTL, and the stale-forever failure</span><span class="lc-sub">/courses/redis/learn${REF} — the same problem with different vocabulary: a key that does not encode what the value depends on produces correct-looking, permanently wrong answers.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — layer invalidation, and COPY package.json first</span><span class="lc-sub">/courses/docker/learn${REF} — the ordering trick that makes a build cache hit, which is the same claim-about-dependencies expressed as file ordering instead of a key.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Khoá, <code>restore-keys</code>, và tính bất biến</h2>
<p class="lead">Có đúng MỘT luật khiến việc thiết kế cache trở nên không hiển nhiên, và nó không được viết nổi bật ở đâu cả: <strong>một mục cache KHÔNG ghi đè được</strong>. Một khi một khoá đã được ghi, khoá ấy đóng lại. Mọi quyết định thiết kế khác đều chảy ra từ nó.</p>

<h3>Cái luật, và hệ quả tức thì của nó</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">lần chạy đầu</span><span class="lz-t">trượt khoá → job chạy → lưu</span><span class="lz-d">mục ấy giờ tồn tại dưới đúng cái khoá đó</span></div>
<div class="lz-step"><span class="lz-k">mọi lần sau, cùng khoá</span><span class="lz-t">trúng → phục hồi → <em>KHÔNG lưu</em></span><span class="lz-d">log nói thẳng ra: "Cache hit occurred on the primary key …, not saving cache"</span></div>
<div class="lz-step"><span class="lz-k">nên một khoá HẰNG</span><span class="lz-t">đông cứng ở lần chạy một</span><span class="lz-d">bất cứ thứ gì nằm trong cache lần đầu là thứ mọi lần chạy tương lai nhận được, mãi mãi</span></div>
</div>

<div class="callout warn">
<p><strong>Một cái khoá không bao giờ đổi cho bạn một cái cache không bao giờ cập nhật.</strong> Đây không phải một ca hiếm — nó là thứ xảy ra MẶC ĐỊNH nếu bạn viết <code>key: node-modules</code> rồi đi tiếp. Workflow nhanh lên, giữ nguyên nhanh, và âm thầm phục vụ cây phụ thuộc từ cái thời điểm cache được ghi lần đầu. Bài 3.4 đã đo phiên bản của lỗi này khi nó tới do TAI NẠN: một <code>hashFiles()</code> mà mẫu glob không khớp gì sẽ trả về chuỗi rỗng, nên <code>my-cache-&#36;{{ hashFiles('go-sai') }}</code> co lại thành hằng số <code>my-cache-</code>.</p>
</div>

<h3>Đo thật: lưu lần hai bị từ chối, và khoá hằng thì đông cứng</h3>
${slide('ga-05', 9, 'Ghi một lần: lưu lại cùng khoá bị từ chối, job vẫn xanh')}
<p>Luật này dễ phát biểu và cũng dễ bị nghi ngờ, nên workflow <code>ch05-khoa.yml</code> trên sân tập kiểm nó trực tiếp. Một job ghi một file, lưu bằng <code>actions/cache/save</code>, sửa file, lưu LẠI dưới cùng khoá, xoá thư mục rồi khôi phục:</p>
<div class="out"># job bat-bien — run 36004518205
Cache saved with key: ch05-bb-36004518205
# buoc "Luu LAI cung khoa" (luu lai, cung khoa):
Failed to save: Unable to reserve cache with key ch05-bb-36004518205,
  another job may be creating this cache.
$ cat bb/x.txt
lan ghi 1          &lt;- noi dung LAN DAU, khong phai lan hai</div>
<p>Có hai chi tiết quan trọng hơn cả việc bị từ chối. Lần lưu thứ hai KHÔNG phải lỗi: bước vẫn xanh và thông báo chỉ là một dòng log thường, thậm chí không phải cảnh báo vàng. Và câu chữ — "another job may be creating this cache" — khiến người ta đi tìm một cuộc đua giữa các job, trong khi lý do thật chỉ đơn giản là mục ấy ĐÃ TỒN TẠI. Thấy dòng đó thì mục bạn muốn cập nhật vẫn là bản cũ.</p>

${slide('ga-05', 10, 'Khoá hằng số đông cứng ở lần chạy đầu tiên')}
<p>Cú hỏng khoá hằng chính là luật ấy nhìn qua nhiều lần chạy. Job <code>khoa-hang</code> dùng <code>key: ch05-khoa-hang</code>, in ra nội dung đang có trong cache, rồi ghi một dòng nêu tên lần chạy hiện tại:</p>
<div class="out"># run 1 — 36004518205
Cache not found for input keys: ch05-khoa-hang
noi dung trong cache: (trong)                 &lt;- rong
Cache saved with key: ch05-khoa-hang

# run 2 — 36004824230, ba phut sau
Cache hit for: ch05-khoa-hang
noi dung trong cache: lan chay nay la run 36004518205 attempt 1
Cache hit occurred on the primary key ch05-khoa-hang, not saving cache.</div>
<p>Run 2 đã ghi dòng của nó vào thư mục — và dòng đó sẽ không bao giờ tới được cache, vì trúng khoá chính nghĩa là bước Post không lưu. Từ nay mọi lần chạy đều nhận nội dung của run 1. Lối thoát duy nhất là một khoá mới, hoặc xoá mục ấy (<code>gh cache delete ch05-khoa-hang</code>, bài 5.5).</p>

<h3>Cái khoá là một LỜI KHẲNG ĐỊNH về việc nội dung phụ thuộc vào cái gì</h3>
${slide('ga-05', 8, 'Cây khoá: khớp chính xác trước, rồi lùi dần theo tiền tố')}
<p>Khoá cache đang hoạt động của kho này, lấy từ <code>deploy-ghcr.yml</code>:</p>

<pre><code>key: nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles('frontend/package-lock.json') }}</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">một tiền tố viết thật</span><span class="v"><code>nextjs-cache-</code> — gọi tên phần nội dung, để danh sách cache còn đọc được bằng mắt người</span></div>
<div class="kv"><span class="k">nền tảng</span><span class="v"><code>runner.os</code>, thứ mà log cho thấy nở ra thành <code>Linux</code>. Thiếu nó thì một job macOS có thể phục hồi một cache của Linux — và các module biên dịch gốc sẽ sai kiến trúc</span></div>
<div class="kv"><span class="k">một hash nội dung</span><span class="v"><code>hashFiles</code> trên tệp khoá: khoá đổi ĐÚNG khi tập phụ thuộc đổi, đã kiểm chứng tái lập được ở bài 3.4</span></div>
<div class="kv"><span class="k">thứ KHÔNG có trong đó</span><span class="v">tên nhánh, mã commit, số hiệu lần chạy. Bất kỳ cái nào cũng khiến khoá đổi ở MỌI lần chạy, nghĩa là mọi lần đều trượt và mọi lần đều lưu — một cái cache tốn tiền tải lên mà trả về con số không</span></div>
</div>

<div class="callout ok">
<p><strong>Câu hỏi thiết kế, phát biểu một lần:</strong> một khoá cache phải đổi khi nội dung được cache <em>ĐÁNG LẼ</em> phải đổi, và không đổi vào lúc nào khác. Quá ổn định thì bạn phục vụ nội dung cũ mãi mãi; quá dao động thì bạn không bao giờ trúng. Mọi thứ khác là chi tiết.</p>
</div>

<h3><code>restore-keys</code> — phần điểm an ủi</h3>
<p>Trượt khoá chính xác không nhất thiết nghĩa là bắt đầu từ con số không. <code>restore-keys</code> là một danh sách các <em>TIỀN TỐ</em>, thử theo thứ tự, mỗi cái khớp với mục được tạo GẦN NHẤT có phần đầu như thế:</p>

<pre><code>key: nextjs-cache-&#36;{{ runner.os }}-frontend-lock-&#36;{{ hashFiles('frontend/package-lock.json') }}
restore-keys: |
  nextjs-cache-&#36;{{ runner.os }}-frontend-lock-
  nextjs-cache-&#36;{{ runner.os }}-frontend-</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">khoá chính xác TRÚNG</span><span class="lz-lnote">tệp khoá không đổi — phục hồi, và KHÔNG lưu. Đây là ca thường gặp</span></div>
<div class="lz-layer"><span class="lz-lname">trượt chính xác, tiền tố đầu trúng</span><span class="lz-lnote">tệp khoá đã đổi. Bạn nhận cache của tệp khoá <em>TRƯỚC ĐÓ</em> — với một cache dựng của Next.js thì đó vẫn là phần lớn giá trị, vì đa số đầu ra biên dịch không bị ảnh hưởng bởi một lần nâng cấp phụ thuộc</span></div>
<div class="lz-layer"><span class="lz-lname">và rồi nó <strong>LƯU</strong> dưới khoá mới</span><span class="lz-lnote">đây là phần người ta bỏ sót. Trúng một restore-key vẫn là TRƯỢT khoá chính, nên bước post ghi ra một mục mới. Cái cache tự lăn về phía trước</span></div>
<div class="lz-layer"><span class="lz-lname">trượt hết</span><span class="lz-lnote">một job lạnh. Chậm hơn, đúng đắn, và tự chữa ở lần chạy kế</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>restore-keys</code> trên một cái cache mà nội dung một-phần là SAI.</strong> Một cache dựng thì chịu được chuyện hơi cũ, bởi công cụ dựng sẽ tự kiểm lại thứ nó dùng. Một cache <code>node_modules</code> thì KHÔNG: phục hồi cây của tệp khoá cũ rồi <em>KHÔNG</em> chạy bước cài là bạn đang dựng trên những phiên bản phụ thuộc mà tệp khoá của bạn không hề nêu tên. Quy tắc: dùng <code>restore-keys</code> khi một lần trúng cũ là một khoản TĂNG TỐC nằm trên một bước đúng đắn VẪN CHẠY, và không dùng khi một lần trúng cũ THAY THẾ bước ấy.</p>
</div>

<h3>Thứ tự, đo thật: trong một dòng lấy mới nhất, giữa các dòng thì dòng trên thắng</h3>
${slide('ga-05', 11, 'Tiền tố lấy mục mới nhất; nhiều dòng thì dòng trên thắng')}
<p>Hai job của <code>ch05-khoa.yml</code> lần lượt lưu <code>ch05-rk-&lt;run&gt;-a</code> (lúc 13:19:11) rồi <code>ch05-rk-&lt;run&gt;-b</code> (lúc 13:19:19). Job thứ ba hỏi hai câu:</p>
<div class="out"># 1) key ...-c (khong co), restore-keys: ch05-rk-&lt;run&gt;-
Cache hit for restore-key: ch05-rk-36004824230-b
ban MOI — job luu-moi, 13:19:19               &lt;- cai MOI HON trong hai cai
cache-hit=false
Post: Cache saved with key: ch05-rk-36004824230-c

# 2) restore-keys: ch05-rk-&lt;run&gt;-a   roi   ch05-rk-&lt;run&gt;-
Cache hit for restore-key: ch05-rk-36004824230-a
cache-hit=false  matched=ch05-rk-36004824230-a   &lt;- DONG dau tien, du -b moi hon</div>
<ul>
<li><strong>Trong MỘT dòng</strong>, nhiều mục có thể chung tiền tố, và mục được tạo GẦN NHẤT được trả về — đúng như tài liệu nói, và là điều khiến <code>restore-keys</code> hữu ích: sau khi lockfile đổi bạn nhận cache mới nhất, chứ không phải một bản cũ ngẫu nhiên.</li>
<li><strong>Giữa CÁC dòng</strong>, thứ tự quyết định. Lần tra thứ hai khớp dòng <code>-a</code> trước và không nhìn tiếp nữa, dù <code>-b</code> mới hơn và cũng khớp dòng thứ hai. Vậy hãy viết <code>restore-keys</code> từ tiền tố CỤ THỂ nhất tới tiền tố CHUNG nhất.</li>
<li><strong>Trúng một phần vẫn LƯU</strong>: <code>cache-hit=false</code>, và bước Post đã ghi <code>-c</code>. Đó chính là cú "lăn về phía trước" mô tả bên trên, giờ nhìn thấy tận mắt.</li>
</ul>
<p>Action khôi phục còn cho biết khoá nào thật sự đã khớp. <code>actions/cache/restore</code> có các output <code>cache-hit</code>, <code>cache-primary-key</code> và <code>cache-matched-key</code>; còn <code>actions/cache</code> gộp chỉ có <code>cache-hit</code> (kiểm trong <code>action.yml</code> của v5.1.0). Khi cần biết mình nhận được mục cũ NÀO, hãy dùng action khôi phục tách rời.</p>
<table>
<thead><tr><th>Input của <code>actions/cache</code> v5</th><th>Làm gì</th><th>Khi nào cần</th></tr></thead>
<tbody>
<tr><td><code>key</code></td><td>khoá chính xác; được thử trước (và, như bài 5.3 cho thấy, cũng được khớp như một tiền tố)</td><td>luôn luôn</td></tr>
<tr><td><code>restore-keys</code></td><td>danh sách tiền tố có thứ tự, thử sau khoá</td><td>khi một mục cũ là bước đệm, không phải đáp án</td></tr>
<tr><td><code>lookup-only</code></td><td>chỉ kiểm mục có tồn tại không, không tải gì</td><td>để bỏ qua cả một job khi cache đã ấm</td></tr>
<tr><td><code>fail-on-cache-miss</code></td><td>biến một lần trượt thành bước đỏ</td><td>job không bao giờ được chạy lạnh (một cuộc bàn giao có chủ đích)</td></tr>
<tr><td><code>enableCrossOsArchive</code></td><td>cho Windows dùng chung mục với OS khác</td><td>hiếm khi; OS nên nằm trong khoá</td></tr>
</tbody>
</table>
<div class="callout warn">
<p><strong>Action gộp chỉ lưu khi job THÀNH CÔNG.</strong> <code>action.yml</code> của nó khai <code>post-if: "success()"</code>. Một job hỏng sau một lượt cài chậm vì thế không lưu gì cả, và lần thử lại bắt đầu lạnh. Khi điều đó quan trọng — một bản dựng dài hỏng muộn ở khâu test — hãy dùng <code>actions/cache/restore</code> ở đầu và <code>actions/cache/save</code> với <code>if: always()</code> ở cuối, đúng cách tách ở mục kế tiếp.</p>
</div>

<h3>Luật khoanh vùng giải thích câu "cache của tôi không bao giờ trúng"</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một nhánh đọc cache của chính nó</span><span class="v">cộng với cache của nhánh <strong>MẶC ĐỊNH</strong> của kho — và, với lần chạy <code>pull_request</code>, nhánh gốc (base) của PR. Một nhánh tính năng phục hồi được thứ <code>main</code> đã lưu; nó KHÔNG phục hồi được thứ mà nhánh nó tách ra đã lưu, trừ khi nhánh ấy là nhánh mặc định (đã đính chính — đo thật bên dưới)</span></div>
<div class="kv"><span class="k">các nhánh KHÔNG đọc được của nhau</span><span class="v">hai nhánh tính năng bị cách ly. Một cache đã hâm nóng trên <code>feature/a</code> thì <code>feature/b</code> không nhìn thấy, và đó là lý do thường gặp khiến một PR có vẻ không bao giờ trúng</span></div>
<div class="kv"><span class="k">nên hãy hâm nóng nhánh MẶC ĐỊNH</span><span class="v">một job theo lịch hay theo push trên <code>main</code> đi nạp cache sẽ khiến MỌI PR được hưởng. Không có nó thì lần chạy đầu của mọi nhánh đều lạnh</span></div>
<div class="kv"><span class="k">và lần chạy PR ghi vào phạm vi CỦA PR</span><span class="v">một cache lưu trong một lần chạy <code>pull_request</code> KHÔNG hâm nóng <code>main</code>. Chiều đi chỉ có một</span></div>
</div>

${slide('ga-05', 13, 'Đọc được: nhánh mình, nhánh mặc định, nhánh gốc của PR')}
<p>Luật khoanh vùng cũng được KIỂM chứ không đọc thuộc, vì cụm từ "một nhánh đọc được nhánh gốc của nó" chính là chỗ phần lớn hiểu lầm bắt đầu. Sân tập có ba nơi một cache có thể nằm: nhánh <code>ch05-cache</code>, nhánh <code>ch05-cache-em</code> tạo RA TỪ nó, và <a href="https://github.com/cuonghoang1103/ga-san-tap/pull/4" target="_blank" rel="noopener">pull request #4</a> từ <code>ch05-cache-em</code> vào <code>ch05-cache</code>. Workflow <code>ch05-pham-vi.yml</code> lưu một mục tí hon mang tên nơi nó chạy, và trước đó tra (với <code>lookup-only: true</code>) mục của mọi nơi khác — cộng một mục mà Chương 4 để lại trên nhánh <code>ch04-action</code>.</p>

${slide('ga-05', 14, 'Ma trận đo thật: 12 phép tra, chỉ 4 lần ✓')}
<div class="out"># tu refs/pull/4/merge (lan chay PR, roi lan chay lai 36004957041 attempt 2)
Cache hit for: ch05-pv-ch05-cache                 &lt;- nhanh GOC cua PR: doc duoc
Cache not found for input keys: ch05-pv-ch05-cache-em   &lt;- nhanh DAU cua chinh PR: khong
Cache hit for: ch05-pv-pr                         &lt;- muc cua chinh no, chi o lan chay lai

# tu refs/heads/ch05-cache (run 36005100779)
Cache hit for: ch05-pv-ch05-cache
Cache not found for input keys: ch05-pv-ch05-cache-em    &lt;- nhanh con
Cache not found for input keys: ch05-pv-pr               &lt;- PR vao chinh no
Cache not found for input keys: node-cache-Linux-x64-npm-d94a99a0...   &lt;- ch04-action</div>
<div class="callout warn">
<p><strong>Đính chính bài này.</strong> Bản trước của bảng khoanh vùng viết một nhánh đọc được "nhánh GỐC của nó". Không phải vậy — không theo nghĩa "nhánh mà nó được tạo ra từ đó". <code>ch05-cache-em</code> tạo ra từ <code>ch05-cache</code> mà không đọc được một mục nào của nó (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36004861851" target="_blank" rel="noopener">36004861851</a>). Thứ một lần chạy đọc được, theo tài liệu và theo các lần chạy này, là: nhánh của chính nó, nhánh <strong>MẶC ĐỊNH</strong> của kho, và — chỉ với lần chạy <code>pull_request</code> — nhánh <strong>gốc (base)</strong> của PR. Dòng đầu của bảng bên trên đã được sửa theo đúng như vậy.</p>
</div>
<p>Còn một kết quả dễ bỏ sót: lần chạy PR KHÔNG đọc được cache của chính nhánh đầu <code>ch05-cache-em</code> của nó. PR chạy trên <code>refs/pull/4/merge</code>, một ref khác với nhánh bạn đã push, nên push lên nhánh tính năng rồi mở PR không hề làm ấm PR. Hệ quả thực dụng là lời khuyên đã có — làm ấm <code>main</code> — cộng một điều tinh tế hơn: cache lưu trong một PR chỉ được đọc lại bởi các lần CHẠY LẠI của đúng PR đó, nên một kho chỉ chạy CI trên pull request sẽ lưu hàng trăm mục mà không ai khác dùng được.</p>
<p>(Sân tập này cố ý không đẩy workflow lên nhánh <code>main</code>, nên dòng "nhánh mặc định đọc được" lấy từ tài liệu chứ không từ một lần chạy; mọi ô còn lại của ma trận đều đo thật.)</p>

<h3>Phục hồi mà không lưu, và lưu mà không phục hồi</h3>
<p>Có hai biến thể và cả hai giải quyết vấn đề thật:</p>

<pre><code><span class="tok-comment"># chi PHUC HOI, khong bao gio luu — cho cac job an theo</span>
- uses: actions/cache/restore@v4
  with: { path: dist, key: build-&#36;{{ github.sha }} }

<span class="tok-comment"># chi LUU — chay o cuoi job dung, du cac buoc truoc co hong</span>
- uses: actions/cache/save@v4
  if: always()
  with: { path: dist, key: build-&#36;{{ github.sha }} }</code></pre>

<div class="callout">
<p><strong>Chỗ tách ấy là thứ khiến một cache dùng được như một lượt bàn giao giữa các job</strong> — một job lưu, nhiều job phục hồi. Nó KHÔNG thay thế được artifact: một cache bị thu hồi lúc nào cũng được và một lần trượt phục hồi phải SỐNG SÓT ĐƯỢC, trong khi một artifact thì được bảo đảm có mặt suốt thời hạn giữ của nó. Dùng cache khi một lần trượt nghĩa là "chậm hơn"; dùng artifact khi một lần trượt nghĩa là "hỏng". Bài 5.4 đo chỗ khác biệt ấy.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Mục cache là ghi-một-lần, nên CÁI KHOÁ chính là toàn bộ thiết kế: đặt một hash nội dung vào để nó đổi khi nội dung đáng đổi, đặt nền tảng vào để nó không vượt kiến trúc, và chỉ dùng <code>restore-keys</code> ở chỗ mà một lần trúng cũ là một phép tối ưu chứ không phải một câu trả lời.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Thiết kế khoá cache cho <code>node_modules</code> trong ma trận Ubuntu và macOS, Node 20 và 22.</strong><br>Đ: <code>nm-&#36;{{ runner.os }}-&#36;{{ runner.arch }}-node&#36;{{ matrix.node }}-&#36;{{ hashFiles('**/package-lock.json') }}</code>. OS, kiến trúc và phiên bản Node vì module gốc được biên dịch cho chúng; hash lockfile vì nội dung phụ thuộc vào nó; không có gì đổi theo từng lần chạy. Không <code>restore-keys</code>, vì một cây cũ sẽ được dùng mà không có bước cài nào sửa lại.</p>
<p><strong>H: Vì sao cache không cập nhật sau khi tôi đổi một phụ thuộc?</strong><br>Đ: Mục cache là bất biến. Nếu khoá không chứa hash lockfile (hoặc hash nhầm tệp), khoá giữ nguyên, mọi lần chạy đều trúng, và bước Post không bao giờ lưu. Sửa khoá, hoặc xoá mục ấy một lần bằng <code>gh cache delete</code>.</p>
<p><strong>H: Một nhánh tính năng không bao giờ trúng cache, dù <code>develop</code> — nơi nó tách ra — có cache ấm. Vì sao?</strong><br>Đ: Lần chạy đọc được nhánh của nó, nhánh mặc định, và với PR là nhánh gốc. <code>develop</code> không thuộc loại nào trừ khi nó là nhánh mặc định hoặc là base của PR. Làm ấm nhánh mặc định, hoặc chạy workflow trên PR vào <code>develop</code>.</p>
<p><strong>H: Khi nào <code>restore-keys</code> nguy hiểm?</strong><br>Đ: Khi một mục cũ THAY THẾ một bước thay vì tăng tốc nó — khôi phục <code>node_modules</code> mà không cài lại sau đó. Nó an toàn khi một bước đúng vẫn chạy chồng lên (kho tải npm, cache dựng Next.js, <code>.tsbuildinfo</code> cùng đầu ra của nó).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> chứng minh ba luật của bài này trên chính kho của bạn thay vì tin suông.</p><ol>
<li>Thêm một job lưu một thư mục bằng <code>actions/cache/save</code>, sửa một file, lưu lại cùng khoá, xoá thư mục, rồi khôi phục bằng <code>actions/cache/restore</code>. In file ra.</li>
<li>Thêm một job với <code>key: my-constant-key</code> in file đang có trong cache rồi ghi đè nó bằng <code>&#36;{{ github.run_id }}</code>. Chạy workflow hai lần.</li>
<li>Lưu hai mục <code>demo-&#36;{{ github.run_id }}-a</code> và <code>-b</code> ở hai job nối tiếp, rồi khôi phục với <code>restore-keys: demo-&#36;{{ github.run_id }}-</code> và in <code>cache-matched-key</code>.</li>
<li>Tạo một nhánh từ nhánh tính năng của bạn, push, và kiểm bằng <code>lookup-only: true</code> xem nó có thấy mục của nhánh "cha" không.</li></ol>
<p><strong>Đạt khi:</strong> log cho thấy "Unable to reserve cache" trong một bước xanh, lần chạy thứ hai của khoá hằng in ra ID của lần chạy đầu, phép tra tiền tố trả về <code>-b</code>, và nhánh con báo không trúng — bốn sự thật mà giờ bạn giải thích được, mỗi cái kèm một link lần chạy.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Primary key (khoá chính)</span><span class="v"><code>key</code> chính xác. Trúng nó nghĩa là <code>cache-hit=true</code> và không lưu.</span></div>
  <div class="kv"><span class="k"><code>restore-keys</code></span><span class="v">Các tiền tố có thứ tự, thử sau khoá; mỗi dòng lấy mục mới nhất, dòng khớp đầu tiên thắng.</span></div>
  <div class="kv"><span class="k">Mục bất biến</span><span class="v">Một mục không ghi đè được; lưu lần hai in "Unable to reserve cache" và bước vẫn xanh.</span></div>
  <div class="kv"><span class="k"><code>cache-matched-key</code></span><span class="v">Output của action khôi phục, cho biết khoá thật sự đã khớp.</span></div>
  <div class="kv"><span class="k"><code>lookup-only</code></span><span class="v">Chỉ kiểm tồn tại, không tải về.</span></div>
  <div class="kv"><span class="k">Phạm vi cache (scope)</span><span class="v">Ref mà một mục thuộc về: nhánh, <code>refs/pull/N/merge</code>, hoặc thẻ.</span></div>
  <div class="kv"><span class="k">Nhánh mặc định / nhánh gốc (base)</span><span class="v">Nhánh chính của kho; nhánh đích của một pull request.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mục cache ghi một lần: lưu lần hai bị từ chối trong một bước xanh; khoá hằng đông cứng ở lần chạy một.</li>
<li>Khoá phải mã hoá thứ nội dung phụ thuộc — OS, phiên bản công cụ, hash lockfile — và không chứa gì đổi theo từng lần chạy.</li>
<li><code>restore-keys</code>: mỗi dòng lấy mục mới nhất, dòng khớp đầu tiên thắng, và trúng một phần thì lưu dưới khoá mới.</li>
<li>Action gộp chỉ lưu khi thành công; dùng restore + save với <code>if: always()</code> khi lỗi muộn là chuyện thường.</li>
<li>Lần chạy đọc được nhánh của nó, nhánh mặc định, và (PR) nhánh gốc — không phải nhánh nó được tạo ra từ đó, và không phải nhánh đầu của PR.</li>
<li>Chỉ dùng <code>restore-keys</code> ở chỗ một bước đúng vẫn chạy chồng lên nội dung cũ.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-khoa.yml, ch05-pham-vi.yml và pull request #4</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap — các lần chạy về bất biến, khoá hằng, thứ tự và phạm vi trích bên trên (36004518205, 36004824230, 36005100779, 36004861851, 36005610825, 36004957041).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Caching dependencies: matching a cache key</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#matching-a-cache-key — thứ tự khớp tiền tố của <code>restore-keys</code>, và phát biểu rằng một mục không cập nhật được sau khi đã ghi.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Restrictions for accessing a cache</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#restrictions-for-accessing-a-cache — các luật khoanh vùng theo nhánh bên trên, đáp án chính thức cho phần lớn câu hỏi "vì sao cache của tôi luôn lạnh".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — action con restore và save</span><span class="lc-sub">github.com/actions/cache/tree/main/restore — hai biến thể tách rời, tham số của chúng, và output <code>cache-hit</code> cho phép một bước sau rẽ nhánh theo việc phục hồi có thành công hay không.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — thiết kế khoá, TTL, và cú hỏng cũ-mãi-mãi</span><span class="lc-sub">/courses/redis/learn${REF} — cùng bài toán với từ vựng khác: một cái khoá không mã hoá được việc giá trị phụ thuộc vào cái gì sẽ đẻ ra những câu trả lời TRÔNG ĐÚNG mà sai vĩnh viễn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — làm mất hiệu lực tầng, và mẹo COPY package.json trước</span><span class="lc-sub">/courses/docker/learn${REF} — cái mẹo sắp thứ tự khiến một cache dựng trúng, và đó cũng là một lời-khẳng-định-về-phụ-thuộc, chỉ diễn đạt bằng thứ tự tệp thay vì bằng một cái khoá.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — A dead cache in this repository, diagnosed|||5.3 — Một cái cache CHẾT trong kho này, chẩn đoán xong',
      slug: 'ga-5-3-cache-chet',
      type: 'VIDEO',
      description: 'Tìm thấy trong log thật: một bước `actions/cache` của kho này chưa bao giờ lưu được gì. Khoá đúng, `restore-keys` đúng, chỉ `path:` trỏ vào chỗ không tồn tại. Ba phép kiểm xác nhận, và hai cách vá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>A dead cache in this repository, diagnosed</h2>
<p class="lead">A cache that does nothing costs almost no time and produces no error, so it survives review indefinitely. This repository has one. Finding it took reading a log line; confirming it took three checks; and the whole thing is a template for auditing your own.</p>

<h3>The line in the log</h3>
${slide('ga-05', 15, 'Four sentences in the log tell you whether a cache is alive or dead')}
<p>The warning is reproducible in ten lines. The sandbox job <code>chet-that</code> caches a path that nothing ever creates, <code>build/.cache-tsc</code>:</p>
<div class="out"># run 36005567469, job chet-that
Cache not found for input keys: ch05-chet-that-Linux
job xanh, khong ai tao build/.cache-tsc
Post: [warning]Path Validation Error: Path(s) specified in the action for caching
      do(es) not exist, hence no cache is being saved.
job conclusion: success</div>
<p>Note where the warning appears: in the <em>Post</em> step, after every step of your own has finished, in a job whose conclusion is <code>success</code>. The run page shows a green check and one yellow annotation among possibly dozens. Nothing fails, so nothing asks you to look.</p>

<p>From the cleanup phase of job 85355071479:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>Two <code>actions/cache</code> steps ran in that job. The other one printed a hit. So one of the two has a <code>path:</code> that does not exist — and the workflow says which:</p>

<pre><code>- name: Restore backend build cache
  uses: actions/cache@v4
  with:
    path: |
      node_modules/.cache          <span class="tok-comment"># &lt;- day</span>
    key: backend-cache-&#36;{{ runner.os }}-lock-&#36;{{ hashFiles('package-lock.json') }}
    restore-keys: |
      backend-cache-&#36;{{ runner.os }}-lock-</code></pre>

<div class="callout">
<p><strong>Everything about that step is correct except one line.</strong> The key includes the platform and a content hash, exactly as 5.2 argues for. The <code>restore-keys</code> prefix is well chosen. And it has never saved a byte, because <code>node_modules/.cache</code> is not a path this project creates.</p>
</div>

<h3>Three checks, because one is not proof</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — run the install and look</span><span class="lz-lnote"><code>npm ci</code> on this repository&#39;s real lockfile, then <code>ls node_modules/.cache</code> → <code>No such file or directory</code>. So it is not created by installing</span></div>
<div class="lz-layer"><span class="lz-lname">2 — grep the project for the path</span><span class="lz-lnote">no reference to <code>node_modules/.cache</code> in <code>package.json</code> or <code>tsconfig.json</code>. So nothing is configured to write there</span></div>
<div class="lz-layer"><span class="lz-lname">3 — read what the build actually is</span><span class="lz-lnote"><code>"build": "tsc"</code>, and <code>tsconfig.json</code> sets neither <code>incremental</code> nor <code>tsBuildInfoFile</code>. So the compiler writes <em>no</em> cache anywhere — not to that path, not to any other</span></div>
</div>

<div class="callout warn">
<p><strong>The third check is the one that matters, and it changes the fix.</strong> If <code>tsc</code> were writing a cache to a different path, the repair would be to correct the path. It is not writing one at all, so pointing the cache at a different directory would cache an empty directory. The step is not misconfigured — it is caching a thing that does not exist.</p>
</div>

<h3>Two repairs, and the smaller one is probably right</h3>
<div class="kv-grid">
<div class="kv"><span class="k">enable incremental compilation</span><span class="v">add <code>"incremental": true</code> and <code>"tsBuildInfoFile": ".tsbuildinfo"</code> to <code>tsconfig.json</code>, then cache <code>.tsbuildinfo</code>. Now the cache has something real to hold, and <code>tsc</code> can skip unchanged files</span></div>
<div class="kv"><span class="k">delete the step</span><span class="v">the backend compile takes 21 seconds in the run measured. A cache that saves part of 21 seconds, at the cost of a save, a restore and an invalidation surface, is not obviously a win</span></div>
<div class="kv"><span class="k">how to decide</span><span class="v">measure the incremental rebuild first. If <code>tsc</code> with a warm <code>.tsbuildinfo</code> is not meaningfully faster than 21 seconds cold, delete the step and stop thinking about it</span></div>
<div class="kv"><span class="k">what not to do</span><span class="v">leave it. It is currently a line of configuration that implies a performance strategy nobody has and that no future reader can distinguish from a working one</span></div>
</div>

<h3>Measuring the first repair: incremental <code>tsc</code> with a cached <code>.tsbuildinfo</code></h3>
${slide('ga-05', 19, 'Caching .tsbuildinfo: tsc 3.4 s → 1.2 s with an 84 KB cache')}
<p>The table above says "measure the incremental rebuild first". Here is that measurement, on a stand-in project of 600 generated TypeScript modules with <code>"incremental": true</code> and <code>"tsBuildInfoFile": ".tsbuildinfo"</code>. The job compiles cold, deletes the output, restores <code>.tsbuildinfo</code> <em>and</em> <code>dist/</code> from the cache, and compiles again:</p>
<pre><code class="language-yaml">- name: Restore .tsbuildinfo + dist
  id: tb
  uses: actions/cache@v5
  with:
    path: |
      ch05/app/.tsbuildinfo
      ch05/app/dist
    key: ch05-tsb-&#36;{{ runner.os }}-&#36;{{ hashFiles('ch05/app/src/**', 'ch05/app/tsconfig.json') }}
    restore-keys: ch05-tsb-&#36;{{ runner.os }}-</code></pre>
<div class="out"># run 36005363653 (miss)                     # run 36005391539 (hit)
tsc lanh: 3.32 giay                          tsc lanh: 3.41 giay
Cache not found ... -> saved (83806 B)       Cache hit for: ch05-tsb-Linux-cae157ed...
                                             Cache Size: ~0 MB (83806 B)
                                             restore: 0.4 s
                                             tsc am: 1.20 giay</div>
<p>So the first repair is real and positive: 3.4 s becomes 1.2 s plus a 0.4-second restore, about 1.8 seconds saved per run, for an 84 KB entry that costs almost nothing to store. On this repository&#39;s 21-second backend compile the saving would be proportionally larger, and the answer to "delete the step or repair it" becomes: <strong>repair it — with both paths.</strong> Unlike <code>node_modules</code>, <code>restore-keys</code> is safe here, because <code>tsc</code> re-checks every file against the build info and recompiles what changed.</p>
<div class="pitfall">
<p><strong>Trap — caching <code>.tsbuildinfo</code> without the output directory.</strong> Tested locally with TypeScript 5.9.3: compile once, delete <code>dist/</code> but keep <code>.tsbuildinfo</code>, compile again — <code>tsc</code> trusts its build info, decides nothing changed, <strong>emits no files</strong> and exits 0. <code>dist/</code> does not exist, and the next step fails far from the cause (or, worse, a deploy step packages an empty directory). The build info describes outputs it assumes are present; cache them together or not at all.</p>
</div>
<h3>Auditing your own</h3>
<p>Every <code>actions/cache</code> step prints exactly one of three things in the log, and reading them is the entire audit:</p>

<div class="out">Cache hit occurred on the primary key &lt;key&gt;, not saving cache.
        -> DANG CHAY. Khoa on dinh, noi dung khong doi

Cache not found for input keys: &lt;key&gt;, &lt;restore-key&gt;
        -> TRUOT. Binh thuong o lan dau; DANG NGO neu no lap lai moi lan

[warning]Path Validation Error: ... do(es) not exist
        -> CHET. Chua bao gio luu duoc gi, va se khong bao gio</div>

<div class="pitfall">
<p><strong>Trap — the miss that repeats every run, which looks like nothing at all.</strong> The dead cache at least prints a warning. A cache whose key changes on every run — because it contains <code>github.sha</code>, or a timestamp, or a <code>hashFiles</code> over a generated file — prints a perfectly ordinary "Cache not found" every time, saves a new entry every time, and is <em>worse</em> than having no cache: you pay the upload and never collect. The tell is that the "not found" line never becomes a "hit" line, over many runs.</p>
</div>

<div class="callout ok">
<p><strong>The three-run rule.</strong> After adding or changing a cache, look at the log of three consecutive runs on the same branch. Run one should miss and save. Runs two and three should hit. Any other pattern is a bug, and it is a bug you can see in ten seconds — which is the only reason dead caches are worth talking about at all, since nothing else will ever tell you.</p>
</div>

<h3>Worse than dead: a cache that is alive and empty</h3>
${slide('ga-05', 16, 'Worse than a dead cache: one that is alive and empty — 237 bytes')}
<p>The sandbox also copied this repository&#39;s backend cache step exactly — <code>path: node_modules/.cache</code>, key on the lockfile — onto the stand-in project. The result was not the warning:</p>
<div class="out"># run 36005363653 (first)
Cache not found for input keys: ch05-chet-Linux-lock-74ddf72d..., ch05-chet-Linux-lock-
$ ls node_modules/.cache
jiti                                   &lt;- an EMPTY directory some package created
Cache saved with key: ch05-chet-Linux-lock-74ddf72d...

# run 36005567469 (third)
Cache hit for: ch05-chet-Linux-lock-74ddf72d...
Cache Size: ~0 MB (237 B)</div>
<p>One of the stand-in&#39;s dependencies creates an empty <code>node_modules/.cache/jiti</code> during install, so the path exists, the entry is saved, and every later run reports a hit. Every signal of the three-run rule says "healthy". The cache carries 237 bytes — a tar header and nothing else. On api-backend, whose dependencies create no such directory, the same step prints the dead-cache warning; on a project with one more dependency it would become this, with no warning at all.</p>
<div class="callout ok">
<p><strong>The fourth check: read <code>Cache Size</code>.</strong> Every restore prints the entry size. A cache worth having has a size that matches what you believe it contains — hundreds of megabytes for dependencies, kilobytes for a build-info file. "~0 MB" on a cache that is supposed to hold a build cache is a dead cache wearing a hit.</p>
</div>

<h3>The key that always misses, measured</h3>
${slide('ga-05', 17, 'A key containing github.sha: misses every time, saves every time')}
<p>The pitfall above describes a key that changes every run. The sandbox job <code>luon-truot</code> uses <code>key: ch05-luon-truot-&#36;{{ github.sha }}-&#36;{{ github.run_id }}</code>, and after four runs the repository&#39;s cache list shows what that does:</p>
<div class="out">$ gh cache list --key ch05-luon
ch05-luon-truot-a2b82e3d...-36005567469   254 B
ch05-luon-truot-2ef08436...-36005477680   252 B
ch05-luon-truot-2ef08436...-36005391539   253 B
ch05-luon-truot-fc047c8e...-36005363653   270 B
# every run: "Cache not found" -&gt; "Cache saved". 4 runs, 4 entries, 0 hits.</div>
<p>Note that two entries share a commit SHA: the same commit ran twice (a push and a <code>workflow_dispatch</code>) and still missed, because the run ID differs. The entries here are tiny; the same pattern on a 200 MB <code>node_modules</code> uploads 200 MB per run into a 10 GB repository allowance and evicts the entries that were actually hitting.</p>

${slide('ga-05', 18, 'The three-run rule: miss → hit → hit, on the same branch')}
<table>
<thead><tr><th>Pattern in the log</th><th>Run 1</th><th>Run 2</th><th>Run 3</th><th>Diagnosis</th></tr></thead>
<tbody>
<tr><td>Healthy</td><td>not found → saved</td><td>hit, not saving</td><td>hit, not saving</td><td>correct</td></tr>
<tr><td>Dead</td><td>Path Validation Error</td><td>Path Validation Error</td><td>Path Validation Error</td><td>path never exists</td></tr>
<tr><td>Empty</td><td>saved (237 B)</td><td>hit, ~0 MB</td><td>hit, ~0 MB</td><td>path exists but holds nothing</td></tr>
<tr><td>Always missing</td><td>not found → saved</td><td>not found → saved</td><td>not found → saved</td><td>key changes per run (SHA, date, run ID)</td></tr>
<tr><td>Frozen</td><td>not found → saved</td><td>hit</td><td>hit — old content</td><td>constant key, no hash</td></tr>
</tbody>
</table>
<p>One command reads all five patterns from a run: <code>gh run view &lt;id&gt; --log | grep -E "Cache (hit|not found|saved|Size)|Path Validation|Failed to save"</code>.</p>

<h3>When a cache hits the wrong thing</h3>
${slide('ga-05', 12, 'Two traps: a different path is a different entry, and the key also matches as a prefix')}
<p>Two further surprises came out of this chapter&#39;s runs, and both look like "the cache is broken" when it is doing exactly what it was told.</p>
<ul>
<li><strong>The path is part of the entry.</strong> The job <code>phien-ban-an</code> saved <code>ch05-ver-&lt;run&gt;</code> with <code>path: thu-a</code>, then asked for the same key with <code>path: thu-b</code>: "Cache not found". The same key with <code>path: thu-a</code> hit. The documentation calls this the cache <em>version</em> — a hash of the paths and the compression tool, stored with the key. Two workflows that share a key but list paths differently (or in a different order) never see each other&#39;s entries.</li>
<li><strong>The primary key is also matched as a prefix.</strong> On branch <code>ch05-cache-em</code>, a lookup for <code>ch05-pv-ch05-cache</code> — an entry that does not exist in that scope — answered <code>Cache hit for restore-key: ch05-pv-ch05-cache-em</code>, because the requested key is a prefix of the branch&#39;s own entry (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36005610825" target="_blank" rel="noopener">36005610825</a>). <code>cache-hit</code> was <code>false</code>, but files were restored. A key that ends at a word boundary, like <code>app-cache</code>, can therefore pick up <code>app-cache-old</code>. End keys with a hash, and branch on <code>cache-hit == 'true'</code>, never on "something was restored".</li>
</ul>
<h3>Why this survived</h3>
<p>The step was added in a commit that also added the frontend cache, which works. Both were plausible, one was right, and the reviewer had no way to tell them apart by reading — the difference is not in the YAML, it is in whether a directory exists at run time. It printed a warning on every run for months, in a log nobody opens when the job is green.</p>

<div class="callout">
<p><strong>That is the general shape of this class of bug.</strong> Optimisations fail silently by construction: the workflow still produces the right answer, just without the speed-up. Correctness bugs announce themselves; performance bugs have to be measured. It is the same argument as lesson 1.5&#39;s missing job and lesson 4.4&#39;s opaque key — the things that do not work are invisible until somebody goes looking with a number in mind.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A cache step can be entirely correct except for pointing at a path that never exists, and the only signal is one warning line in a green job — so audit by reading three runs&#39; logs, not by reading the YAML.</p>
</div>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How do you know a cache in your pipeline actually works?</strong><br>A: Look at three consecutive runs on one branch: the first must miss and save, the next two must hit and skip the save. Then check <code>Cache Size</code> against what the cache should contain, and compare the step duration on a hit with a miss. Reading the YAML proves nothing — a correct-looking step can cache a path that never exists.</p>
<p><strong>Q: A cache step shows "Cache not found" on every run. What do you look for?</strong><br>A: Something in the key that changes per run — <code>github.sha</code>, <code>github.run_id</code>, a date, or <code>hashFiles</code> over a generated file — or a <code>path</code> that differs between the saving and restoring workflows (the path is part of the cache version). <code>gh cache list</code> growing by one entry per run confirms the first.</p>
<p><strong>Q: Is it worth caching TypeScript&#39;s incremental build info?</strong><br>A: Measure: on 600 modules it saved about 1.8 s per run for an 84 KB entry, so yes when <code>tsc</code> is slow. Cache <code>.tsbuildinfo</code> together with the output directory — without the outputs, <code>tsc</code> can skip emitting entirely.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> audit every cache in your own repository in one sitting.</p><ol>
<li>List every cache step: <code>grep -n -A6 "actions/cache\\|cache:" .github/workflows/*.yml</code>.</li>
<li>For each workflow, take its last three runs on the same branch and run the <code>grep -E "Cache (hit|not found|saved|Size)|Path Validation|Failed to save"</code> command on each log.</li>
<li>Classify every step into one of the five patterns of the table above.</li>
<li>Run <code>gh cache list --sort size_in_bytes</code> and check each entry&#39;s size against what it should hold.</li>
<li>Fix one step that is not healthy (delete it, correct the path, or fix the key), then show three new runs with the healthy pattern.</li></ol>
<p><strong>Done when:</strong> you have a table "step → pattern → evidence (run ID + log line)" covering every cache step, and at least one repaired step whose next three runs read miss → hit → hit with a plausible <code>Cache Size</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dead cache</span><span class="v">A cache step whose path never exists: "Path Validation Error", never saves.</span></div>
  <div class="kv"><span class="k">Empty cache</span><span class="v">A path that exists but holds nothing useful: saves and hits, "Cache Size: ~0 MB".</span></div>
  <div class="kv"><span class="k">Three-run rule</span><span class="v">Miss → hit → hit on the same branch; any other pattern is a bug.</span></div>
  <div class="kv"><span class="k">Cache version</span><span class="v">Hash of the paths and compression tool stored with the key; a different path means a different entry.</span></div>
  <div class="kv"><span class="k"><code>.tsbuildinfo</code></span><span class="v">TypeScript&#39;s incremental build record; useful only together with the outputs it describes.</span></div>
  <div class="kv"><span class="k">Annotation</span><span class="v">A warning or error line shown on the run page; a green job can carry yellow ones.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A dead cache prints one yellow Post-step warning in a green job; reproduced in the sandbox in ten lines.</li>
<li>An empty cache is worse: no warning, saves, hits — only <code>Cache Size: ~0 MB</code> gives it away.</li>
<li>A key with <code>github.sha</code> or <code>run_id</code> misses and saves on every run; <code>gh cache list</code> grows by one per run.</li>
<li>Audit by reading three consecutive runs, the four log sentences and the size — never by reading YAML.</li>
<li>The path is part of the entry, and the key also matches as a prefix — end keys with a hash and test <code>cache-hit == 'true'</code>.</li>
<li>Caching <code>.tsbuildinfo</code> saved ~1.8 s on 600 modules; cache it with its output directory or <code>tsc</code> may emit nothing.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-chet.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache — the dead, empty and always-missing caches and the incremental <code>tsc</code> measurement (runs 36005363653, 36005391539, 36005477680, 36005567469).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README, the log output</span><span class="lc-sub">github.com/actions/cache — the exact strings the action prints on hit, miss and path-validation failure, which is the audit checklist above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TypeScript — incremental and tsBuildInfoFile</span><span class="lc-sub">typescriptlang.org/tsconfig#incremental — what <code>tsc</code> stores in a build-info file and what it lets the compiler skip, which is the prerequisite for the first repair above being worth anything.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing caches</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#managing-caches — the repository cache list in the UI and the API for it, which shows entry sizes and last-used times and makes a never-written cache obvious by its absence.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — a config directive that was never applied</span><span class="lc-sub">/courses/nginx/learn${REF} — the same failure shape in a server: syntactically valid configuration in a block that never matched, producing no error and no effect for months.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — check the checker before you trust it</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — a health check that could not have failed, and the practice of deliberately breaking a thing once to confirm the check notices.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Một cái cache CHẾT trong kho này, chẩn đoán xong</h2>
<p class="lead">Một cái cache chẳng làm gì thì gần như không tốn thời gian và không đẻ ra lỗi nào, nên nó sống sót qua review vô thời hạn. Kho này có một cái. Tìm ra nó tốn một lần đọc một dòng log; xác nhận nó tốn ba phép kiểm; và toàn bộ chuyện ấy là một khuôn mẫu để đi soát cái của bạn.</p>

<h3>Dòng trong log</h3>
${slide('ga-05', 15, 'Bốn câu trong log cho biết cache sống hay chết')}
<p>Cảnh báo này tái lập được trong mười dòng. Job <code>chet-that</code> trên sân tập cache một đường dẫn mà không gì tạo ra, <code>build/.cache-tsc</code>:</p>
<div class="out"># run 36005567469, job chet-that
Cache not found for input keys: ch05-chet-that-Linux
job xanh, khong ai tao build/.cache-tsc
Post: [warning]Path Validation Error: Path(s) specified in the action for caching
      do(es) not exist, hence no cache is being saved.
job conclusion: success</div>
<p>Để ý cảnh báo nằm ở ĐÂU: trong bước <em>Post</em>, sau khi mọi bước của bạn đã xong, trong một job có kết luận <code>success</code>. Trang lần chạy hiện một dấu tích xanh và một chú thích vàng lẫn giữa có khi hàng chục cái khác. Không có gì hỏng, nên không có gì bắt bạn phải nhìn.</p>

<p>Từ pha dọn dẹp của job 85355071479:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>Có hai bước <code>actions/cache</code> chạy trong job ấy. Cái kia in ra một lần trúng. Vậy một trong hai có <code>path:</code> không tồn tại — và workflow nói rõ là cái nào:</p>

<pre><code>- name: Restore backend build cache
  uses: actions/cache@v4
  with:
    path: |
      node_modules/.cache          <span class="tok-comment"># &lt;- day</span>
    key: backend-cache-&#36;{{ runner.os }}-lock-&#36;{{ hashFiles('package-lock.json') }}
    restore-keys: |
      backend-cache-&#36;{{ runner.os }}-lock-</code></pre>

<div class="callout">
<p><strong>Mọi thứ về cái bước ấy đều ĐÚNG trừ một dòng.</strong> Cái khoá có nền tảng và một hash nội dung, đúng y như bài 5.2 lập luận. Cái tiền tố <code>restore-keys</code> chọn khéo. Và nó chưa bao giờ lưu được một byte, bởi <code>node_modules/.cache</code> không phải một đường dẫn mà dự án này tạo ra.</p>
</div>

<h3>Ba phép kiểm, vì một phép thì chưa phải bằng chứng</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">1 — chạy lượt cài rồi nhìn</span><span class="lz-lnote"><code>npm ci</code> trên đúng tệp khoá thật của kho này, rồi <code>ls node_modules/.cache</code> → <code>No such file or directory</code>. Vậy nó không do việc cài tạo ra</span></div>
<div class="lz-layer"><span class="lz-lname">2 — grep cả dự án tìm đường dẫn ấy</span><span class="lz-lnote">không có tham chiếu nào tới <code>node_modules/.cache</code> trong <code>package.json</code> hay <code>tsconfig.json</code>. Vậy không có gì được cấu hình để ghi vào đó</span></div>
<div class="lz-layer"><span class="lz-lname">3 — đọc xem bản dựng THẬT RA là gì</span><span class="lz-lnote"><code>"build": "tsc"</code>, và <code>tsconfig.json</code> không đặt <code>incremental</code> lẫn <code>tsBuildInfoFile</code>. Vậy trình biên dịch KHÔNG ghi cache ở đâu cả — không vào đường dẫn ấy, không vào đường dẫn nào khác</span></div>
</div>

<div class="callout warn">
<p><strong>Phép kiểm thứ ba mới là phép có ý nghĩa, và nó ĐỔI cách vá.</strong> Nếu <code>tsc</code> có ghi cache vào một đường dẫn khác thì cách sửa sẽ là chữa lại đường dẫn. Nó không ghi cái nào cả, nên trỏ cache vào một thư mục khác cũng chỉ là cache một thư mục rỗng. Cái bước ấy không phải cấu hình sai — nó đang cache một thứ KHÔNG TỒN TẠI.</p>
</div>

<h3>Hai cách vá, và cái nhỏ hơn có lẽ mới đúng</h3>
<div class="kv-grid">
<div class="kv"><span class="k">bật biên dịch tăng dần</span><span class="v">thêm <code>"incremental": true</code> và <code>"tsBuildInfoFile": ".tsbuildinfo"</code> vào <code>tsconfig.json</code>, rồi cache <code>.tsbuildinfo</code>. Giờ cái cache có một thứ THẬT để giữ, và <code>tsc</code> bỏ qua được những tệp không đổi</span></div>
<div class="kv"><span class="k">xoá hẳn bước ấy</span><span class="v">lượt biên dịch backend mất 21 giây trong lần chạy đã đo. Một cái cache tiết kiệm được một phần của 21 giây, đổi lấy một lượt lưu, một lượt phục hồi và một bề mặt lỗi hết-hiệu-lực, thì không hiển nhiên là có lãi</span></div>
<div class="kv"><span class="k">quyết thế nào</span><span class="v">hãy ĐO lượt dựng lại tăng dần trước. Nếu <code>tsc</code> với một <code>.tsbuildinfo</code> ấm không nhanh hơn 21 giây lạnh một cách đáng kể, thì xoá bước ấy đi và thôi nghĩ về nó</span></div>
<div class="kv"><span class="k">đừng làm gì</span><span class="v">để nguyên. Hiện nó là một dòng cấu hình ngụ ý một chiến lược hiệu năng mà không ai có, và không người đọc tương lai nào phân biệt nổi nó với một cái đang chạy tốt</span></div>
</div>

<h3>Đo cách vá thứ nhất: <code>tsc</code> tăng dần với <code>.tsbuildinfo</code> được cache</h3>
${slide('ga-05', 19, 'Cache .tsbuildinfo: tsc 3,4 s → 1,2 s, với 84 KB cache')}
<p>Bảng bên trên dặn "hãy ĐO lượt dựng lại tăng dần trước". Đây là phép đo ấy, trên một dự án đóng thế gồm 600 module TypeScript sinh tự động, với <code>"incremental": true</code> và <code>"tsBuildInfoFile": ".tsbuildinfo"</code>. Job biên dịch lạnh, xoá đầu ra, khôi phục <code>.tsbuildinfo</code> <em>VÀ</em> <code>dist/</code> từ cache, rồi biên dịch lại:</p>
<pre><code class="language-yaml">- name: Khoi phuc .tsbuildinfo + dist
  id: tb
  uses: actions/cache@v5
  with:
    path: |
      ch05/app/.tsbuildinfo
      ch05/app/dist
    key: ch05-tsb-&#36;{{ runner.os }}-&#36;{{ hashFiles('ch05/app/src/**', 'ch05/app/tsconfig.json') }}
    restore-keys: ch05-tsb-&#36;{{ runner.os }}-</code></pre>
<div class="out"># run 36005363653 (truot)                    # run 36005391539 (trung)
tsc lanh: 3.32 giay                          tsc lanh: 3.41 giay
Cache not found ... -> saved (83806 B)       Cache hit for: ch05-tsb-Linux-cae157ed...
                                             Cache Size: ~0 MB (83806 B)
                                             khoi phuc: 0,4 s
                                             tsc am: 1.20 giay</div>
<p>Vậy cách vá thứ nhất là THẬT và có lãi: 3,4 s thành 1,2 s cộng 0,4 giây khôi phục, tiết kiệm khoảng 1,8 giây mỗi lần chạy, cho một mục 84 KB gần như không tốn gì để giữ. Với lượt biên dịch backend 21 giây của kho này thì khoản tiết kiệm sẽ lớn hơn theo tỉ lệ, và câu trả lời cho "xoá bước hay vá nó" trở thành: <strong>vá — với ĐỦ hai đường dẫn.</strong> Khác với <code>node_modules</code>, <code>restore-keys</code> an toàn ở đây, vì <code>tsc</code> kiểm lại từng tệp theo build info và biên dịch lại những gì đã đổi.</p>
<div class="pitfall">
<p><strong>Bẫy — cache <code>.tsbuildinfo</code> mà không có thư mục đầu ra.</strong> Thử trên máy cục bộ với TypeScript 5.9.3: biên dịch một lần, xoá <code>dist/</code> nhưng giữ <code>.tsbuildinfo</code>, biên dịch lại — <code>tsc</code> tin vào sổ ghi của nó, kết luận không có gì đổi, <strong>không phát ra file nào</strong> và thoát mã 0. <code>dist/</code> không tồn tại, và bước kế tiếp hỏng ở một chỗ xa nguyên nhân (hoặc tệ hơn, một bước deploy đóng gói một thư mục rỗng). Build info mô tả những đầu ra mà nó GIẢ ĐỊNH là đang có; cache chúng cùng nhau, hoặc đừng cache.</p>
</div>
<h3>Đi soát cái của bạn</h3>
<p>Mọi bước <code>actions/cache</code> đều in ra đúng MỘT trong ba thứ vào log, và đọc chúng chính là toàn bộ cuộc soát:</p>

<div class="out">Cache hit occurred on the primary key &lt;key&gt;, not saving cache.
        -> DANG CHAY. Khoa on dinh, noi dung khong doi

Cache not found for input keys: &lt;key&gt;, &lt;restore-key&gt;
        -> TRUOT. Binh thuong o lan dau; DANG NGO neu no lap lai moi lan

[warning]Path Validation Error: ... do(es) not exist
        -> CHET. Chua bao gio luu duoc gi, va se khong bao gio</div>

<div class="pitfall">
<p><strong>Bẫy — cú trượt LẶP LẠI ở mọi lần chạy, thứ trông chẳng ra làm sao cả.</strong> Cái cache chết ít nhất còn in một cảnh báo. Một cái cache mà khoá đổi ở mọi lần chạy — vì nó chứa <code>github.sha</code>, hay một dấu thời gian, hay một <code>hashFiles</code> trên một tệp sinh tự động — sẽ in một dòng "Cache not found" hoàn toàn bình thường mỗi lần, lưu một mục mới mỗi lần, và như thế còn <em>TỆ HƠN</em> là không có cache: bạn trả tiền tải lên mà không bao giờ thu về. Dấu hiệu là cái dòng "not found" ấy không bao giờ trở thành một dòng "hit", qua nhiều lần chạy.</p>
</div>

<div class="callout ok">
<p><strong>Quy tắc ba lần chạy.</strong> Sau khi thêm hay đổi một cái cache, hãy nhìn log của ba lần chạy LIÊN TIẾP trên cùng một nhánh. Lần một phải trượt rồi lưu. Lần hai và ba phải trúng. Mọi khuôn hình khác đều là lỗi, và là một lỗi bạn nhìn ra trong mười giây — mà đó là lý do duy nhất khiến cache chết đáng được nói tới, bởi sẽ chẳng có gì khác báo cho bạn.</p>
</div>

<h3>Còn tệ hơn cache chết: một cái cache sống mà rỗng</h3>
${slide('ga-05', 16, 'Còn tệ hơn cache chết: cache "sống" mà rỗng — 237 byte')}
<p>Sân tập cũng chép NGUYÊN bước cache backend của kho này — <code>path: node_modules/.cache</code>, khoá theo lockfile — lên dự án đóng thế. Kết quả không phải cảnh báo:</p>
<div class="out"># run 36005363653 (lan dau)
Cache not found for input keys: ch05-chet-Linux-lock-74ddf72d..., ch05-chet-Linux-lock-
$ ls node_modules/.cache
jiti                                   &lt;- mot thu muc RONG do mot goi tao ra
Cache saved with key: ch05-chet-Linux-lock-74ddf72d...

# run 36005567469 (lan ba)
Cache hit for: ch05-chet-Linux-lock-74ddf72d...
Cache Size: ~0 MB (237 B)</div>
<p>Một phụ thuộc của dự án đóng thế tạo ra thư mục rỗng <code>node_modules/.cache/jiti</code> trong lúc cài, nên đường dẫn TỒN TẠI, mục được lưu, và mọi lần chạy sau đều báo trúng. Mọi tín hiệu của quy tắc ba lần chạy đều nói "khoẻ mạnh". Cái cache chở 237 byte — một phần đầu tar và không gì khác. Trên api-backend, nơi các phụ thuộc không tạo thư mục ấy, cùng bước này in ra cảnh báo cache chết; ở một dự án chỉ cần thêm một phụ thuộc, nó sẽ thành thế này, không một lời cảnh báo.</p>
<div class="callout ok">
<p><strong>Phép kiểm thứ tư: đọc dòng <code>Cache Size</code>.</strong> Mỗi lần khôi phục đều in kích thước mục. Một cái cache đáng giá phải có kích thước khớp với thứ bạn tin là nó chứa — hàng trăm megabyte cho phụ thuộc, vài kilobyte cho một tệp build info. "~0 MB" trên một cái cache lẽ ra chứa cache dựng là một cái cache CHẾT khoác áo "trúng".</p>
</div>

<h3>Khoá luôn trượt, đo thật</h3>
${slide('ga-05', 17, 'Khoá chứa github.sha: trượt mọi lần, lưu mọi lần')}
<p>Cái bẫy bên trên mô tả một khoá đổi ở mọi lần chạy. Job <code>luon-truot</code> trên sân tập dùng <code>key: ch05-luon-truot-&#36;{{ github.sha }}-&#36;{{ github.run_id }}</code>, và sau bốn lần chạy, danh sách cache của kho cho thấy hậu quả:</p>
<div class="out">$ gh cache list --key ch05-luon
ch05-luon-truot-a2b82e3d...-36005567469   254 B
ch05-luon-truot-2ef08436...-36005477680   252 B
ch05-luon-truot-2ef08436...-36005391539   253 B
ch05-luon-truot-fc047c8e...-36005363653   270 B
# moi run: "Cache not found" -&gt; "Cache saved". 4 run, 4 muc, 0 lan trung.</div>
<p>Để ý hai mục chung một SHA commit: cùng một commit chạy hai lần (một do push, một do <code>workflow_dispatch</code>) mà vẫn trượt, vì run ID khác nhau. Các mục ở đây tí hon; cùng khuôn ấy trên một <code>node_modules</code> 200 MB là 200 MB tải lên mỗi lần chạy, đổ vào hạn mức 10 GB của kho và đẩy ra ngoài chính những mục đang trúng thật.</p>

${slide('ga-05', 18, 'Quy tắc ba lần chạy: trượt → trúng → trúng, trên cùng một nhánh')}
<table>
<thead><tr><th>Khuôn hình trong log</th><th>Lần 1</th><th>Lần 2</th><th>Lần 3</th><th>Chẩn đoán</th></tr></thead>
<tbody>
<tr><td>Khoẻ</td><td>not found → saved</td><td>hit, not saving</td><td>hit, not saving</td><td>đúng</td></tr>
<tr><td>Chết</td><td>Path Validation Error</td><td>Path Validation Error</td><td>Path Validation Error</td><td>đường dẫn không bao giờ tồn tại</td></tr>
<tr><td>Rỗng</td><td>saved (237 B)</td><td>hit, ~0 MB</td><td>hit, ~0 MB</td><td>đường dẫn có nhưng không chứa gì</td></tr>
<tr><td>Luôn trượt</td><td>not found → saved</td><td>not found → saved</td><td>not found → saved</td><td>khoá đổi mỗi lần (SHA, ngày, run ID)</td></tr>
<tr><td>Đông cứng</td><td>not found → saved</td><td>hit</td><td>hit — nội dung cũ</td><td>khoá hằng, thiếu hash</td></tr>
</tbody>
</table>
<p>Một lệnh đọc được cả năm khuôn từ một lần chạy: <code>gh run view &lt;id&gt; --log | grep -E "Cache (hit|not found|saved|Size)|Path Validation|Failed to save"</code>.</p>

<h3>Khi cache trúng NHẦM thứ</h3>
${slide('ga-05', 12, 'Hai bẫy: đổi path là mục khác, và khoá cũng khớp tiền tố')}
<p>Các lần chạy của chương này còn đẻ ra hai bất ngờ nữa, và cả hai trông như "cache hỏng" trong khi nó đang làm đúng y điều được bảo.</p>
<ul>
<li><strong>Đường dẫn là một phần của mục.</strong> Job <code>phien-ban-an</code> lưu <code>ch05-ver-&lt;run&gt;</code> với <code>path: thu-a</code>, rồi xin đúng khoá ấy với <code>path: thu-b</code>: "Cache not found". Cùng khoá với <code>path: thu-a</code> thì trúng. Tài liệu gọi đây là <em>version</em> của cache — một hash của các đường dẫn và công cụ nén, lưu kèm khoá. Hai workflow dùng chung khoá nhưng liệt kê đường dẫn khác nhau (hoặc khác thứ tự) sẽ không bao giờ thấy mục của nhau.</li>
<li><strong>Khoá chính CŨNG được khớp như tiền tố.</strong> Trên nhánh <code>ch05-cache-em</code>, một lần tra <code>ch05-pv-ch05-cache</code> — mục không tồn tại trong phạm vi đó — lại trả lời <code>Cache hit for restore-key: ch05-pv-ch05-cache-em</code>, vì khoá được hỏi là tiền tố của mục của chính nhánh ấy (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36005610825" target="_blank" rel="noopener">36005610825</a>). <code>cache-hit</code> là <code>false</code>, nhưng file VẪN được khôi phục. Một khoá dừng ở ranh giới chữ như <code>app-cache</code> vì thế có thể vớ phải <code>app-cache-old</code>. Hãy kết thúc khoá bằng một hash, và rẽ nhánh theo <code>cache-hit == 'true'</code>, đừng theo "có gì đó được khôi phục".</li>
</ul>
<h3>Vì sao nó sống sót</h3>
<p>Bước ấy được thêm trong một commit cũng thêm luôn cái cache frontend, và cái đó CHẠY. Cả hai đều hợp lý, một cái đúng, và người review không có cách nào phân biệt chúng bằng cách ĐỌC — khác biệt không nằm trong YAML, nó nằm ở chuyện một thư mục có tồn tại lúc chạy hay không. Nó in một cảnh báo ở mọi lần chạy suốt nhiều tháng, trong một cái log mà không ai mở khi job đang xanh.</p>

<div class="callout">
<p><strong>Đó là hình dạng chung của lớp lỗi này.</strong> Các phép tối ưu hỏng ÂM THẦM theo cấu tạo: workflow vẫn cho ra đáp án đúng, chỉ là không có phần tăng tốc. Lỗi ĐÚNG-SAI thì tự nó lên tiếng; lỗi HIỆU NĂNG thì phải đem ĐO. Vẫn là lập luận của cái job vắng mặt ở bài 1.5 và cái khoá đục ở bài 4.4 — những thứ không hoạt động thì vô hình cho tới khi có người đi tìm với một con số trong đầu.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một bước cache có thể hoàn toàn đúng trừ chuyện trỏ vào một đường dẫn không bao giờ tồn tại, và tín hiệu duy nhất là một dòng cảnh báo trong một job đang xanh — nên hãy soát bằng cách ĐỌC LOG BA LẦN CHẠY, đừng soát bằng cách đọc YAML.</p>
</div>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Làm sao biết một cái cache trong pipeline của bạn thật sự chạy?</strong><br>Đ: Nhìn ba lần chạy liên tiếp trên một nhánh: lần đầu phải trượt và lưu, hai lần sau phải trúng và bỏ qua việc lưu. Rồi so <code>Cache Size</code> với thứ cache lẽ ra chứa, và so thời lượng bước khi trúng với khi trượt. Đọc YAML không chứng minh được gì — một bước trông đúng vẫn có thể cache một đường dẫn không bao giờ tồn tại.</p>
<p><strong>H: Một bước cache báo "Cache not found" ở mọi lần chạy. Bạn tìm gì?</strong><br>Đ: Thứ gì đó trong khoá đổi theo từng lần chạy — <code>github.sha</code>, <code>github.run_id</code>, một ngày tháng, hay <code>hashFiles</code> trên một tệp sinh tự động — hoặc một <code>path</code> khác nhau giữa workflow lưu và workflow khôi phục (đường dẫn là một phần của version cache). <code>gh cache list</code> cứ dài thêm một mục mỗi lần chạy là xác nhận khả năng thứ nhất.</p>
<p><strong>H: Có đáng cache build info tăng dần của TypeScript không?</strong><br>Đ: Đo đã: với 600 module nó tiết kiệm khoảng 1,8 s mỗi lần cho một mục 84 KB, nên đáng khi <code>tsc</code> chậm. Cache <code>.tsbuildinfo</code> CÙNG thư mục đầu ra — thiếu đầu ra, <code>tsc</code> có thể bỏ hẳn việc phát file.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> soát mọi cái cache trong kho của chính bạn trong một lần ngồi.</p><ol>
<li>Liệt kê mọi bước cache: <code>grep -n -A6 "actions/cache\\|cache:" .github/workflows/*.yml</code>.</li>
<li>Với mỗi workflow, lấy ba lần chạy gần nhất trên cùng một nhánh và chạy lệnh <code>grep -E "Cache (hit|not found|saved|Size)|Path Validation|Failed to save"</code> trên log của từng lần.</li>
<li>Xếp mỗi bước vào một trong năm khuôn hình của bảng bên trên.</li>
<li>Chạy <code>gh cache list --sort size_in_bytes</code> và so kích thước từng mục với thứ nó lẽ ra chứa.</li>
<li>Sửa một bước chưa khoẻ (xoá, chữa đường dẫn, hoặc sửa khoá), rồi cho thấy ba lần chạy mới có khuôn hình khoẻ.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một bảng "bước → khuôn hình → bằng chứng (run ID + dòng log)" phủ mọi bước cache, và ít nhất một bước đã sửa mà ba lần chạy kế tiếp đọc ra trượt → trúng → trúng với một <code>Cache Size</code> hợp lý.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cache chết</span><span class="v">Bước cache mà đường dẫn không bao giờ tồn tại: "Path Validation Error", không bao giờ lưu.</span></div>
  <div class="kv"><span class="k">Cache rỗng</span><span class="v">Đường dẫn có nhưng không chứa gì đáng giá: lưu và trúng, "Cache Size: ~0 MB".</span></div>
  <div class="kv"><span class="k">Quy tắc ba lần chạy</span><span class="v">Trượt → trúng → trúng trên cùng một nhánh; mọi khuôn khác là lỗi.</span></div>
  <div class="kv"><span class="k">Version của cache</span><span class="v">Hash của đường dẫn và công cụ nén lưu kèm khoá; khác đường dẫn là khác mục.</span></div>
  <div class="kv"><span class="k"><code>.tsbuildinfo</code></span><span class="v">Sổ ghi dựng tăng dần của TypeScript; chỉ có ích khi đi cùng đầu ra mà nó mô tả.</span></div>
  <div class="kv"><span class="k">Annotation (chú thích lần chạy)</span><span class="v">Dòng cảnh báo hoặc lỗi hiện trên trang lần chạy; một job xanh vẫn có thể mang chú thích vàng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cache chết in một cảnh báo vàng ở bước Post trong một job xanh; tái lập trên sân tập trong mười dòng.</li>
<li>Cache rỗng còn tệ hơn: không cảnh báo, vẫn lưu, vẫn trúng — chỉ <code>Cache Size: ~0 MB</code> tố cáo nó.</li>
<li>Khoá chứa <code>github.sha</code> hay <code>run_id</code> trượt và lưu ở mọi lần; <code>gh cache list</code> dài thêm một mục mỗi lần.</li>
<li>Soát bằng cách đọc ba lần chạy liên tiếp, bốn câu log và kích thước — không bao giờ bằng cách đọc YAML.</li>
<li>Đường dẫn là một phần của mục, và khoá cũng khớp như tiền tố — kết thúc khoá bằng hash và kiểm <code>cache-hit == 'true'</code>.</li>
<li>Cache <code>.tsbuildinfo</code> tiết kiệm ~1,8 s trên 600 module; cache nó cùng thư mục đầu ra, không thì <code>tsc</code> có thể chẳng phát file nào.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-chet.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache — cache chết, cache rỗng, cache luôn trượt và phép đo <code>tsc</code> tăng dần (run 36005363653, 36005391539, 36005477680, 36005567469).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — README, phần đầu ra log</span><span class="lc-sub">github.com/actions/cache — đúng những chuỗi mà action in ra khi trúng, khi trượt và khi path-validation hỏng, tức là danh sách soát bên trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">TypeScript — incremental và tsBuildInfoFile</span><span class="lc-sub">typescriptlang.org/tsconfig#incremental — <code>tsc</code> lưu gì trong một tệp build-info và nó cho trình biên dịch bỏ qua được cái gì, điều kiện tiên quyết để cách vá thứ nhất bên trên có giá trị.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Managing caches</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#managing-caches — danh sách cache của kho trên giao diện và API của nó, nơi hiện kích thước từng mục và lần dùng cuối, khiến một cái cache chưa từng được ghi lộ ra bằng chính sự VẮNG MẶT của nó.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — một chỉ thị cấu hình chưa bao giờ được áp dụng</span><span class="lc-sub">/courses/nginx/learn${REF} — cùng hình dạng hỏng ở một máy chủ: cấu hình đúng cú pháp nằm trong một khối không bao giờ khớp, không đẻ ra lỗi và không có tác dụng gì suốt nhiều tháng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — kiểm bộ kiểm trước khi tin nó</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — một phép kiểm sức khoẻ vốn không thể hỏng được, và thói quen CỐ Ý làm hỏng một thứ đúng một lần để xác nhận phép kiểm có nhận ra.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Artifacts, and the number I had to measure twice|||5.4 — Artifact, và con số tôi phải đo hai lần',
      slug: 'ga-5-4-artifact',
      type: 'VIDEO',
      description: 'Cùng số byte chính xác, 5.000 file so với 1 file. Lượt đo đầu ra 64 lần — và nó ĐÁNH LỪA. Đo lại với nội dung thực tế hơn: 2,3–2,9 lần. Giữ cả hai, kèm lý do lượt đầu sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>Artifacts, and the number I had to measure twice</h2>
<p class="lead">An artifact is a file you upload from a job so that something later can download it. Chapter 2 measured the times; this lesson measures <em>why</em> those times differ, and the first attempt produced a number that was true and useless.</p>

<h3>Artifacts versus caches</h3>
${slide('ga-05', 20, 'Cache and artifact: two services, two different promises')}
<table>
<thead><tr><th></th><th>Cache (<code>actions/cache</code>)</th><th>Artifact (<code>upload-artifact</code>)</th></tr></thead>
<tbody>
<tr><td>Lives for</td><td>until unused for 7 days, or evicted when the repository exceeds its allowance</td><td>90 days by default; settable 1–90 days on public repositories, 1–400 on private ones (as of 09/2026)</td></tr>
<tr><td>Who can read it</td><td>runs on the same branch, the default branch, and PR runs whose base it is</td><td>later jobs of the same run; humans on the run page; other runs and tools through the API (<code>download-artifact</code> with <code>run-id</code> + <code>github-token</code>)</td></tr>
<tr><td>Identified by</td><td>key (+ paths + compression = "version")</td><td>name, unique within a run; plus a numeric ID</td></tr>
<tr><td>Overwrite</td><td>never</td><td>only with <code>overwrite: true</code>, which deletes the old one and creates a new ID</td></tr>
<tr><td>Limits</td><td>10 GB per repository by default (raisable, billed); 200 uploads and 1,500 downloads per minute per repository</td><td>500 artifacts per job; counts against the account&#39;s Actions storage (free for public repositories)</td></tr>
</tbody>
</table>

<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">a deliverable. Guaranteed present for its retention period, listed on the run page, downloadable by a human. A missing artifact means <strong>broken</strong></span></div>
<div class="kv"><span class="k">cache</span><span class="v">an optimisation. Can be evicted at any moment, invisible in the run UI, keyed rather than named. A missing cache means <strong>slower</strong></span></div>
<div class="kv"><span class="k">the test</span><span class="v">if a miss would break the workflow, it is an artifact. If a miss would merely cost time, it is a cache. Using one for the other is the most common structural mistake here</span></div>
<div class="kv"><span class="k">immutable since v4</span><span class="v">an artifact name can be written once per run (unless the upload passes <code>overwrite: true</code>, which deletes the old artifact and creates a new one with a new ID — measured below). The old "several matrix legs append to one artifact" pattern fails outright — which is why this repository names its artifacts <code>ban-cai-&#36;{{ matrix.ten }}</code>, one per leg</span></div>
</div>

<h3>Why a build output uploads fast and <code>node_modules</code> does not</h3>
<p><code>upload-artifact@v4</code> packs with <strong>zip</strong>, which compresses each file independently. So the shape of what you upload matters, not just the size. The measurement: five thousand files against one file, with the total byte count identical to the byte.</p>

<div class="out">--- luot 1: 5.000 ban chep GIONG HET nhau, 45,28 MB ---
dang          nen (zip -1)   kich thuoc     giai nen
5.000 file          728 ms        21 MB     1.126 ms
1 file              163 ms       336 KB       178 ms
ti le                 4,5x          64x         6,3x</div>

<div class="callout warn">
<p><strong>Sixty-four times larger — and that number should not be published as it stands.</strong> The five thousand files were <em>identical copies</em>, so the single concatenated file compressed almost perfectly while the five thousand separate ones could not share a dictionary at all. The measurement is real; it is also an upper bound produced by an artificial input, and quoting it would be quoting the rig rather than the phenomenon.</p>
</div>

<p>So: build the same comparison with content that resembles a real dependency tree — a shared preamble, a per-file body, and some incompressible bytes:</p>

<div class="out">--- luot 2: noi dung GIONG MOT PHAN, 31,44 MB ---
dang          nen (zip -1)   kich thuoc     giai nen
5.000 file          539 ms       7,7 MB       476 ms
1 file              233 ms       6,2 MB       163 ms
ti le                 2,3x        1,24x         2,9x</div>

<div class="callout ok">
<p><strong>2.3× slower to pack, 2.9× slower to unpack, 24% larger.</strong> That is the number worth carrying: real, substantial, and nothing like 64×. Both runs are kept here because the difference between them is the lesson — a measurement can be arithmetically correct and still answer a question about your test data instead of about the world.</p>
</div>


${slide('ga-05', 21, 'Shape decides the price: 28,484 files take 37 s, a tarball takes 4')}
<p>The measurement above was local. On the runner, the sandbox job <code>hinh-dang</code> uploaded the stand-in&#39;s real <code>node_modules</code> twice — once as the tree, once as a single <code>tar</code> + <code>zstd</code> archive — with <code>upload-artifact@v7</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36004824017" target="_blank" rel="noopener">36004824017</a>):</p>
<div class="out">node_modules: 854M, 28446 file
# as a tree
With the provided path, there will be 28484 files uploaded
Uploading artifact: nm-cay.zip
Uploaded bytes 8388608 ... 254761014               13:19:35 -&gt; 13:20:12   (37.2 s)
# as one file
tar+zstd: 2.29 giay       -&gt; nm.tar.zst 217038194 bytes
Uploading artifact: nm.tar.zst                     13:20:12.6 -&gt; 13:20:14.4 (1.8 s)</div>
<p><strong>37.2 seconds against 4.1</strong> (2.3 s to pack plus 1.8 s to upload) for the same content — a factor of nine, far larger than the 2.3–2.9 measured locally, because on the runner each of 28,484 files is read, deflated and appended to the zip stream one at a time while the network waits. The smaller experiment in job <code>tao</code> (5,000 generated files, 40 MB on disk) shows the same direction at a smaller scale: 3.7 s for the files, 2.9 s for tar plus the tarball, and on download 1.6–1.9 s against 0.8–1.3 s.</p>
<p>Two more lines of that log are worth noticing: the tree upload says <strong>28,484</strong> files while <code>find -type f</code> counted <strong>28,446</strong>. The 38 extra are the symbolic links in <code>node_modules/.bin</code> (a local install of the same lockfile has exactly 38): <code>find -type f</code> skips links, the upload follows them and stores each target as an ordinary file — one more thing a zip does not preserve. And the tarball was uploaded with <code>archive: false</code>, a v7 feature explained at the end of this lesson.</p>
<h3>The runner numbers, for scale</h3>
<p>From run 32662461744, uploading the same installer on three platforms:</p>

<div class="out">tai artifact len:   Linux 8s  ·  Windows 6s  ·  macOS 27s
tai ca ba ve (job cong bo):  12s</div>

<div class="callout">
<p><strong>macOS is 3.4× Windows for the same output</strong> — consistent with 2.3&#39;s finding that macOS is weak at network upload specifically. And note the download: twelve seconds for all three together, less than macOS spent uploading one. Downloads are cheap; the upload is where artifact cost lives, which is the opposite of most people&#39;s intuition.</p>
</div>

<div class="pitfall">
<p><strong>Trap — uploading a directory tree when you meant to upload a deliverable.</strong> <code>path: dist/</code> on a 40,000-file tree is the measurement above, at scale, on every run. If what the next job needs is one installer or one bundle, <code>tar</code> it first and upload the tarball: one file, one compression pass, and the measured 2.3–2.9× disappears. The exception is when a human needs to browse the artifact in the UI — then the file listing is the point, and the cost is what you are paying for.</p>
</div>

<h3>Same name twice: 409, <code>overwrite</code>, and the ID that changes</h3>
${slide('ga-05', 22, 'A duplicate name is refused with 409; overwrite: true deletes the old one and changes the ID')}
<p>Since v4, an artifact name is unique within a run. The sandbox job <code>tao</code> uploaded <code>mot-tarball</code>, uploaded it again under the same name, and then a third time with <code>overwrite: true</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36004518209" target="_blank" rel="noopener">36004518209</a>):</p>
<div class="out">Artifact mot-tarball has been successfully uploaded! ... Artifact ID is 10809103300
# second upload, same name
##[error]Failed to CreateArtifact: Received non-retryable error: Failed request:
  (409) Conflict: an artifact with this name already exists on the workflow run
# third upload, overwrite: true
Artifact 'mot-tarball' (ID: 10809103300) deleted
Artifact mot-tarball has been successfully uploaded! ... Artifact ID is 10809417256</div>
<p>Unlike the cache&#39;s silent "Unable to reserve", this refusal is a real error: the step is red (the sandbox marked it <code>continue-on-error: true</code> on purpose). And <code>overwrite: true</code> is not an in-place update — the old artifact is deleted and a new one with a <strong>new ID</strong> is created. That bit the sandbox itself: the job output passed the ID of the <em>first</em> upload to the next job, and</p>
<div class="out"># job dung, download by the ID captured before the overwrite
##[error]Unable to download artifact(s): None of the provided artifact IDs were found</div>
<p>The fix is to take <code>artifact-id</code> from the <em>last</em> upload step, or to download by name. For matrix jobs, the rule is simpler: never let two legs write the same name — put <code>&#36;{{ matrix.* }}</code> in it, as this repository does with <code>ban-cai-&#36;{{ matrix.ten }}</code>.</p>

<h3>What zip does not carry: the executable bit and hidden files</h3>
${slide('ga-05', 23, 'Zip loses the executable bit and drops hidden files — tar keeps both')}
<p>The job <code>quyen-va-file-an</code> put an executable script and a dot-file (with an obviously fake value) into a directory, uploaded the directory as an artifact, uploaded a <code>tar</code> of the same directory, and downloaded both:</p>
<div class="out"># before upload
-rw-r--r--  27  .env-thu
-rwxr-xr-x  25  chay.sh
# upload-artifact path: goi/   -&gt;   download
With the provided path, there will be 1 file uploaded
-rw-r--r--  25  chay.sh          &lt;- executable bit gone
                                  &lt;- .env-thu not there at all
# tar -cf goi.tar goi   -&gt;   upload   -&gt;   download   -&gt;   tar -xf
-rw-r--r--  27  .env-thu
-rwxr-xr-x  25  chay.sh          &lt;- both kept</div>
<ul>
<li><strong>Hidden files are excluded on purpose</strong> (since v4.4, per the README) so that a stray <code>.env</code> is not published. If you really need them, set <code>include-hidden-files: true</code> — and read the list of what you are about to upload.</li>
<li><strong>Permissions are not kept</strong> by the zip: every file comes back <code>644</code>, every directory <code>755</code> (README, "Limitations"). A packaged CLI, an installer script or a <code>gradlew</code> that the next job runs will fail with "Permission denied". Either <code>tar</code> first (tar keeps mode bits), or <code>chmod +x</code> after downloading.</li>
</ul>
<h3>Retention, and what it costs</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">default 90 days</span><span class="lz-lnote">settable per artifact with <code>retention-days:</code>, or repository-wide. Ninety days of every build of every PR adds up quietly, and artifacts count against repository storage</span></div>
<div class="lz-layer"><span class="lz-lname">a sensible split</span><span class="lz-lnote">release artifacts long, PR artifacts short. A test report from a PR that merged three weeks ago is not evidence anybody will look at — <code>retention-days: 5</code> on those and 90 on releases costs nothing and stops the growth</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code> on the upload</span><span class="lz-lnote">this repository does it, and 3.5 argued it is the legitimate use: when the build fails, the partial output and the logs are exactly what you want to look at, and a step with the implicit <code>success()</code> would skip</span></div>
<div class="lz-layer"><span class="lz-lname">and it is not a cache</span><span class="lz-lnote">artifacts are per-run. A later run cannot restore a previous run&#39;s artifact by name from inside a workflow without going through the API (<code>download-artifact</code> with <code>run-id</code> and <code>github-token</code> is that API) — and needing it is usually a signal that you wanted a cache</span></div>
</div>

<h3>The pattern this repository uses</h3>
${slide('ga-05', 24, 'Matrix legs write many names; the collecting job downloads them into one place')}
<p>The download side has two options that make the per-leg naming painless. In the sandbox job <code>dung</code>, three matrix legs had uploaded <code>ket-qua-linux</code>, <code>ket-qua-windows</code> and <code>ket-qua-macos</code>:</p>
<pre><code class="language-yaml">- uses: actions/download-artifact@v8
  with:
    pattern: 'ket-qua-*'      # filter by name
    merge-multiple: true      # all into ONE directory instead of one per artifact
    path: ve/gom</code></pre>
<div class="out">Found 8 artifact(s)
Filtering artifacts by pattern 'ket-qua-*'
- ket-qua-windows (ID: 10809736778, Size: 163, Expected Digest: sha256:d380562e...)
- ket-qua-macos   (ID: 10809377743, Size: 157, ...)
- ket-qua-linux   (ID: 10809343783, Size: 157, ...)
Total of 3 artifact(s) downloaded
$ cat ve/gom/*.txt
ket qua tu nhanh linux
ket qua tu nhanh macos
ket qua tu nhanh windows</div>
<p>Without <code>merge-multiple</code>, each artifact lands in its own subdirectory named after it, which is what you want when two legs produce files with the same name. Every download also prints the <strong>SHA-256 digest</strong> it expected and the one it computed; since download-artifact v8 a mismatch fails the step by default instead of printing a warning.</p>
<div class="pitfall">
<p><strong>Trap — downloading a name that does not exist.</strong> A typo in <code>name:</code> produces <code>Unable to download artifact(s): Artifact not found for name: khong-co-dau</code> — measured in the same job. The error is clear; the cause is usually that the upload was skipped (an <code>if:</code> on the uploading job, or a matrix leg that failed before its upload step). Check the uploading job first, not the name.</p>
</div>

<pre><code><span class="tok-comment"># moi nhanh ma tran tai len duoi TEN RIENG</span>
- name: Luu ban cai lam artifact
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: ban-cai-&#36;{{ matrix.ten }}      <span class="tok-comment"># ban-cai-macOS, -Windows, -Linux</span>
    path: |
      desktop/dist/*.zip
      desktop/dist/*.blockmap
      desktop/dist/latest-mac.yml

<span class="tok-comment"># job cong bo tai ca ba ve roi KIEM DU FILE truoc khi cong bo</span>
- name: Tai ban cai cua ca ba nen tang ve
  uses: actions/download-artifact@v4
- name: Kiem du file roi moi cong bo
  run: <span class="tok-comment"># thieu latest-mac.yml la tu-cap-nhat chet cam</span></code></pre>

<div class="callout ok">
<p><strong>The check after the download is the part worth copying.</strong> Missing <code>latest-mac.yml</code> in a release does not fail anything visibly — the release page looks complete and auto-update silently stops working for every installed copy. So the publish job counts the files before publishing. That is an artifact being treated as a deliverable with an acceptance test, which is the distinction at the top of this lesson made operational.</p>
</div>

<div class="callout">
<p><strong>The one sentence.</strong> Artifacts are guaranteed and caches are not, zip compresses per file so the <em>shape</em> of an upload costs 2.3–2.9× when it is many small files, and the honest version of that number took two measurements because the first one measured the test rig.</p>
</div>

<h3>Where the artifact and cache actions are, as of 09/2026</h3>
${slide('ga-05', 25, 'Where the artifact actions have got to (09/2026)')}
<p>The code in this chapter&#39;s older sections says <code>@v4</code>. It still runs, but the actions have moved on, and three of the changes affect what you write (release notes read from each repository on 24/09/2026):</p>
<table>
<thead><tr><th>Action</th><th>Latest</th><th>Changes worth knowing</th></tr></thead>
<tbody>
<tr><td><code>actions/upload-artifact</code></td><td>v7.0.1</td><td>v4: immutable names, 409 on duplicates · v4.x: <code>overwrite</code>, hidden files excluded · v5/v6: Node 24 · <strong>v7: <code>archive: false</code></strong> uploads a single file as-is, unzipped (the <code>name</code> input is then ignored; the artifact is named after the file)</td></tr>
<tr><td><code>actions/download-artifact</code></td><td>v8.0.1</td><td>v5: consistent paths when downloading by ID · v7: Node 24 · <strong>v8: a digest mismatch is an error by default</strong>; non-zipped artifacts are not unzipped</td></tr>
<tr><td><code>actions/cache</code></td><td>v6.1.0</td><td>v4.2+: the new cache service · v5: Node 24, needs runner ≥ 2.327.1 · v6: ESM · v6.1: handles read-only cache access</td></tr>
</tbody>
</table>
<div class="out"># upload-artifact@v7, archive: false — run 36004824017
Uploading artifact: nm.tar.zst
Uploaded bytes 217038194
Artifact nm.tar.zst successfully finalized.
Artifact artifact has been successfully uploaded!   &lt;- the log still says "artifact"</div>
<p>The practical consequence: for the "one file hand-off" pattern of this lesson, v7 removes the pointless zip-inside-a-zip — the tarball is stored as it is, and the next job downloads exactly those bytes. Pin the versions by SHA with a version comment and let Dependabot move them (Chapter 4), rather than editing <code>@v4</code> by hand across many files.</p>

<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: When do you use an artifact and when a cache?</strong><br>A: If a missing file would break the pipeline or the release, it is an artifact: guaranteed for its retention, visible, downloadable. If a missing file only costs time, it is a cache. Build outputs passed to a deploy job, test reports and installers are artifacts; dependency stores and compiler caches are caches.</p>
<p><strong>Q: Three matrix jobs upload test reports with <code>name: report</code> and the workflow fails with 409. Why, and how do you fix it?</strong><br>A: Since upload-artifact v4 a name is unique within a run. Use <code>name: report-&#36;{{ matrix.os }}</code>, then collect with <code>pattern: report-*</code> and <code>merge-multiple: true</code>.</p>
<p><strong>Q: The deploy job downloads a CLI from an artifact and gets "Permission denied". Why?</strong><br>A: The zip does not preserve file modes. Tar the directory before upload (and upload it with <code>archive: false</code> on v7), or <code>chmod +x</code> after download.</p>
<p><strong>Q: How do you keep artifact storage under control?</strong><br>A: <code>retention-days</code> short for PR artifacts and longer for releases, a repository or organisation default, and uploading one archive instead of large trees.</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your build job must hand its output to a deploy job, safely and quickly.</p><ol>
<li>In a test repository, add a job that builds (or just creates) a <code>dist/</code> with a few hundred files and one executable script.</li>
<li>Upload <code>dist/</code> as an artifact, and separately <code>tar -czf dist.tgz dist</code> and upload that with <code>upload-artifact@v7</code> and <code>archive: false</code>. Set <code>retention-days: 1</code>.</li>
<li>Add a second job with <code>needs:</code> that downloads both, extracts the tarball, and runs <code>ls -la</code> on the script in each copy.</li>
<li>Upload a second artifact with the same name as the first (<code>continue-on-error: true</code>), then again with <code>overwrite: true</code>, and print <code>steps.&lt;id&gt;.outputs.artifact-id</code> each time.</li>
<li>Compare the two upload step durations with <code>gh run view &lt;id&gt; --json jobs</code>.</li></ol>
<p><strong>Done when:</strong> your log shows the 409 conflict, a changed artifact ID after the overwrite, the script executable only in the tarball copy, and two upload durations you can compare — plus one sentence on which one your real deploy should use.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Artifact</span><span class="v">A file set uploaded from a job, kept for its retention period and downloadable by later jobs and humans.</span></div>
  <div class="kv"><span class="k"><code>retention-days</code></span><span class="v">How long an artifact is kept: 1–90 days on public repositories, 1–400 on private ones.</span></div>
  <div class="kv"><span class="k"><code>overwrite</code></span><span class="v">Replaces an artifact of the same name by deleting it and creating a new one with a new ID.</span></div>
  <div class="kv"><span class="k"><code>archive: false</code></span><span class="v">upload-artifact v7: store a single file as-is instead of zipping it.</span></div>
  <div class="kv"><span class="k"><code>merge-multiple</code></span><span class="v">download-artifact: put several artifacts into one directory.</span></div>
  <div class="kv"><span class="k">Digest</span><span class="v">SHA-256 of the artifact; checked on download, an error on mismatch since download-artifact v8.</span></div>
  <div class="kv"><span class="k"><code>include-hidden-files</code></span><span class="v">Opt-in to upload dot-files, which are excluded by default.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Artifact = guaranteed hand-off (90 days by default); cache = optimisation that may disappear.</li>
<li>Shape decides cost: 28,484 files took 37 s to upload, the same content as one <code>tar.zst</code> took 4 s.</li>
<li>A duplicate name fails with 409; <code>overwrite: true</code> deletes and recreates with a new ID — carry the last ID, or use names.</li>
<li>Zip drops the executable bit and (by default) hidden files; tar keeps both.</li>
<li>Name matrix artifacts per leg and collect them with <code>pattern</code> + <code>merge-multiple</code>.</li>
<li>Current versions (09/2026): upload v7 (<code>archive: false</code>), download v8 (digest enforced), cache v6.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-artifact.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache — the 409, overwrite, lost-ID, permission, hidden-file, matrix and <code>node_modules</code> upload runs (36004518209, 36004824017).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/upload-artifact — README and the v4 migration notes</span><span class="lc-sub">github.com/actions/upload-artifact — <code>retention-days</code>, <code>compression-level</code>, and the immutability change in v4 that breaks the multi-job append pattern.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Storing workflow data as artifacts</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts — retention defaults, storage billing, and the API for downloading an artifact from a different run.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PKZIP APPNOTE — per-entry compression</span><span class="lc-sub">pkware.cachefly.net/webdocs/APPNOTE/APPNOTE-6.3.9.TXT — the format detail that explains the measurement: each entry is compressed independently, so a zip cannot share a dictionary across files the way a compressed tar can.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tar, and why "tar then compress" beats "compress each"</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the ordering that makes the single-file column of the table above possible, and the cases where it does not help.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — acceptance checks before the swap</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the file-count check above is a release acceptance test, and this is the treatment of that idea at length.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Artifact, và con số tôi phải đo hai lần</h2>
<p class="lead">Một artifact là một tệp bạn tải lên từ một job để thứ gì đó về sau tải xuống được. Chương 2 đã đo thời gian; bài này đo <em>VÌ SAO</em> những thời gian ấy khác nhau, và lần thử đầu tiên đẻ ra một con số vừa ĐÚNG vừa VÔ DỤNG.</p>

<h3>Artifact so với cache</h3>
${slide('ga-05', 20, 'Cache và artifact: hai dịch vụ, hai lời hứa khác nhau')}
<table>
<thead><tr><th></th><th>Cache (<code>actions/cache</code>)</th><th>Artifact (<code>upload-artifact</code>)</th></tr></thead>
<tbody>
<tr><td>Sống bao lâu</td><td>tới khi 7 ngày không ai dùng, hoặc bị thu hồi khi kho vượt hạn mức</td><td>90 ngày mặc định; đặt được 1–90 ngày ở kho công khai, 1–400 ở kho riêng tư (tính đến 09/2026)</td></tr>
<tr><td>Ai đọc được</td><td>lần chạy trên cùng nhánh, trên nhánh mặc định, và lần chạy PR nhận nó làm nhánh gốc</td><td>các job sau trong cùng lần chạy; con người trên trang lần chạy; lần chạy khác và công cụ qua API (<code>download-artifact</code> với <code>run-id</code> + <code>github-token</code>)</td></tr>
<tr><td>Định danh bằng</td><td>khoá (+ đường dẫn + cách nén = "version")</td><td>tên, duy nhất trong một lần chạy; cộng một ID số</td></tr>
<tr><td>Ghi đè</td><td>không bao giờ</td><td>chỉ với <code>overwrite: true</code>, thứ xoá bản cũ và tạo ID mới</td></tr>
<tr><td>Giới hạn</td><td>10 GB mỗi kho mặc định (nâng được, tính tiền); 200 lượt lưu và 1.500 lượt tải mỗi phút mỗi kho</td><td>500 artifact mỗi job; tính vào dung lượng lưu trữ Actions của tài khoản (kho công khai miễn phí)</td></tr>
</tbody>
</table>

<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">một SẢN PHẨM BÀN GIAO. Được bảo đảm có mặt suốt thời hạn giữ, liệt kê trên trang lần chạy, con người tải về được. Thiếu một artifact nghĩa là <strong>HỎNG</strong></span></div>
<div class="kv"><span class="k">cache</span><span class="v">một PHÉP TỐI ƯU. Bị thu hồi lúc nào cũng được, vô hình trên giao diện lần chạy, định danh bằng khoá chứ không bằng tên. Thiếu một cache nghĩa là <strong>CHẬM HƠN</strong></span></div>
<div class="kv"><span class="k">phép thử</span><span class="v">nếu một lần trượt làm VỠ workflow thì nó là artifact. Nếu một lần trượt chỉ tốn thời gian thì nó là cache. Dùng cái này thay cái kia là sai lầm cấu trúc phổ biến nhất ở đây</span></div>
<div class="kv"><span class="k">bất biến từ v4</span><span class="v">một tên artifact chỉ ghi được MỘT lần trong mỗi lần chạy (trừ khi lượt tải lên đặt <code>overwrite: true</code> — xoá artifact cũ và tạo cái mới với ID mới, đo ở bên dưới). Khuôn mẫu cũ "nhiều nhánh ma trận cùng nối thêm vào một artifact" hỏng thẳng — và đó là lý do kho này đặt tên artifact là <code>ban-cai-&#36;{{ matrix.ten }}</code>, mỗi nhánh một cái</span></div>
</div>

<h3>Vì sao một bản dựng tải lên nhanh còn <code>node_modules</code> thì không</h3>
<p><code>upload-artifact@v4</code> gói bằng <strong>zip</strong>, thứ nén TỪNG TỆP một cách độc lập. Nên HÌNH DẠNG của thứ bạn tải lên có ý nghĩa, không phải chỉ mỗi kích thước. Phép đo: năm nghìn file so với một file, với tổng số byte giống nhau tới từng byte.</p>

<div class="out">--- luot 1: 5.000 ban chep GIONG HET nhau, 45,28 MB ---
dang          nen (zip -1)   kich thuoc     giai nen
5.000 file          728 ms        21 MB     1.126 ms
1 file              163 ms       336 KB       178 ms
ti le                 4,5x          64x         6,3x</div>

<div class="callout warn">
<p><strong>Lớn hơn sáu mươi tư lần — và con số ấy KHÔNG nên đem công bố như thế.</strong> Năm nghìn file kia là những <em>BẢN CHÉP GIỐNG HỆT</em>, nên tệp gộp nén được gần như hoàn hảo trong khi năm nghìn tệp riêng thì hoàn toàn không chia sẻ được từ điển nén. Phép đo có thật; nó cũng là một TRẦN TRÊN sinh ra bởi một đầu vào nhân tạo, và trích nó là trích cái BỘ ĐỒ NGHỀ chứ không phải trích hiện tượng.</p>
</div>

<p>Vậy thì: dựng lại đúng phép so sánh ấy với nội dung giống một cây phụ thuộc thật — một phần mở đầu chung, một phần thân riêng theo tệp, và một ít byte không nén được:</p>

<div class="out">--- luot 2: noi dung GIONG MOT PHAN, 31,44 MB ---
dang          nen (zip -1)   kich thuoc     giai nen
5.000 file          539 ms       7,7 MB       476 ms
1 file              233 ms       6,2 MB       163 ms
ti le                 2,3x        1,24x         2,9x</div>

<div class="callout ok">
<p><strong>Chậm hơn 2,3 lần khi gói, 2,9 lần khi mở, và lớn hơn 24%.</strong> Đó mới là con số đáng mang đi: thật, đáng kể, và chẳng giống 64 lần chút nào. Cả hai lượt được giữ lại ở đây vì chỗ KHÁC NHAU giữa chúng chính là bài học — một phép đo có thể đúng về số học mà vẫn đang trả lời một câu hỏi về DỮ LIỆU THỬ của bạn thay vì về THẾ GIỚI.</p>
</div>


${slide('ga-05', 21, 'Hình dạng quyết định giá: 28.484 file 37 giây, tarball 4 giây')}
<p>Phép đo bên trên là cục bộ. Trên runner, job <code>hinh-dang</code> của sân tập tải <code>node_modules</code> thật của dự án đóng thế lên hai lần — một lần nguyên cây, một lần thành một tệp <code>tar</code> + <code>zstd</code> — bằng <code>upload-artifact@v7</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36004824017" target="_blank" rel="noopener">36004824017</a>):</p>
<div class="out">node_modules: 854M, 28446 file
# nguyen cay
With the provided path, there will be 28484 files uploaded
Uploading artifact: nm-cay.zip
Uploaded bytes 8388608 ... 254761014               13:19:35 -&gt; 13:20:12   (37,2 s)
# mot tep
tar+zstd: 2.29 giay       -&gt; nm.tar.zst 217038194 byte
Uploading artifact: nm.tar.zst                     13:20:12,6 -&gt; 13:20:14,4 (1,8 s)</div>
<p><strong>37,2 giây so với 4,1</strong> (2,3 s đóng gói cộng 1,8 s tải lên) cho cùng một nội dung — gấp chín lần, lớn hơn nhiều con số 2,3–2,9 đo cục bộ, vì trên runner từng file trong 28.484 file được đọc, nén rồi nối vào luồng zip lần lượt trong khi mạng ngồi chờ. Thí nghiệm nhỏ hơn ở job <code>tao</code> (5.000 file sinh tự động, 40 MB trên đĩa) cho cùng chiều ở quy mô nhỏ hơn: 3,7 s cho đống file, 2,9 s cho tar cộng tarball, và khi tải về là 1,6–1,9 s so với 0,8–1,3 s.</p>
<p>Còn hai dòng trong log đáng để ý: lần tải nguyên cây báo <strong>28.484</strong> file trong khi <code>find -type f</code> đếm được <strong>28.446</strong>. 38 cái dôi ra là các liên kết tượng trưng (symlink) trong <code>node_modules/.bin</code> (cài cục bộ cùng lockfile có đúng 38 cái): <code>find -type f</code> bỏ qua liên kết, còn lượt tải lên đi theo chúng và cất mỗi đích thành một file thường — thêm một thứ nữa zip không giữ nguyên. Và tarball được tải lên với <code>archive: false</code>, một tính năng của v7 giải thích ở cuối bài.</p>
<h3>Số đo trên runner, để có cỡ</h3>
<p>Từ run 32662461744, tải lên cùng một bản cài trên ba nền tảng:</p>

<div class="out">tai artifact len:   Linux 8s  ·  Windows 6s  ·  macOS 27s
tai ca ba ve (job cong bo):  12s</div>

<div class="callout">
<p><strong>macOS gấp 3,4 lần Windows cho cùng một đầu ra</strong> — nhất quán với phát hiện ở bài 2.3 rằng macOS yếu ở ĐÚNG khâu tải lên qua mạng. Và để ý lượt tải xuống: mười hai giây cho cả ba cộng lại, ít hơn thời gian macOS tải lên MỘT bản. Tải xuống thì rẻ; chi phí artifact nằm ở lượt tải LÊN, ngược với trực giác của phần lớn người ta.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — tải lên cả một cây thư mục trong khi bạn định tải lên một sản phẩm.</strong> <code>path: dist/</code> trên một cây 40.000 file chính là phép đo bên trên, phóng to, ở mọi lần chạy. Nếu thứ job kế cần là MỘT bản cài hay MỘT gói bundle, hãy <code>tar</code> nó trước rồi tải cái tarball lên: một tệp, một lượt nén, và cái 2,3–2,9 lần đo được kia biến mất. Ngoại lệ là khi một CON NGƯỜI cần duyệt artifact trên giao diện — khi ấy chính danh sách tệp mới là mục đích, và cái giá là thứ bạn đang trả tiền để có.</p>
</div>

<h3>Trùng tên: 409, <code>overwrite</code>, và cái ID thay đổi</h3>
${slide('ga-05', 22, 'Tên trùng bị từ chối 409; overwrite: true xoá bản cũ và đổi ID')}
<p>Từ v4, tên artifact là duy nhất trong một lần chạy. Job <code>tao</code> trên sân tập tải <code>mot-tarball</code> lên, tải lại dưới đúng tên đó, rồi lần thứ ba với <code>overwrite: true</code> (run <a href="https://github.com/cuonghoang1103/ga-san-tap/actions/runs/36004518209" target="_blank" rel="noopener">36004518209</a>):</p>
<div class="out">Artifact mot-tarball has been successfully uploaded! ... Artifact ID is 10809103300
# tai len lan hai, cung ten
##[error]Failed to CreateArtifact: Received non-retryable error: Failed request:
  (409) Conflict: an artifact with this name already exists on the workflow run
# lan ba, overwrite: true
Artifact 'mot-tarball' (ID: 10809103300) deleted
Artifact mot-tarball has been successfully uploaded! ... Artifact ID is 10809417256</div>
<p>Khác với câu "Unable to reserve" lặng lẽ của cache, lần từ chối này là LỖI thật: bước đỏ (sân tập cố ý đánh dấu <code>continue-on-error: true</code>). Và <code>overwrite: true</code> không phải cập nhật tại chỗ — artifact cũ bị XOÁ và một artifact mới mang <strong>ID MỚI</strong> được tạo. Chính sân tập đã dính: output của job chuyển ID của lần tải ĐẦU TIÊN sang job sau, và</p>
<div class="out"># job dung, tai theo ID lay TRUOC khi overwrite
##[error]Unable to download artifact(s): None of the provided artifact IDs were found</div>
<p>Cách sửa là lấy <code>artifact-id</code> từ bước tải lên CUỐI CÙNG, hoặc tải theo tên. Với job ma trận thì luật còn đơn giản hơn: đừng bao giờ để hai nhánh ghi cùng một tên — đặt <code>&#36;{{ matrix.* }}</code> vào tên, như kho này làm với <code>ban-cai-&#36;{{ matrix.ten }}</code>.</p>

<h3>Thứ zip không mang theo: bit thực thi và file ẩn</h3>
${slide('ga-05', 23, 'Zip làm mất bit chạy và bỏ file ẩn — tar thì giữ')}
<p>Job <code>quyen-va-file-an</code> đặt một script có quyền chạy và một file bắt đầu bằng dấu chấm (giá trị giả rõ ràng) vào một thư mục, tải thư mục lên làm artifact, tải một bản <code>tar</code> của cùng thư mục, rồi tải cả hai về:</p>
<div class="out"># truoc khi tai len
-rw-r--r--  27  .env-thu
-rwxr-xr-x  25  chay.sh
# upload-artifact path: goi/   -&gt;   tai ve
With the provided path, there will be 1 file uploaded
-rw-r--r--  25  chay.sh          &lt;- mat bit thuc thi
                                  &lt;- .env-thu khong co mat
# tar -cf goi.tar goi   -&gt;   tai len   -&gt;   tai ve   -&gt;   tar -xf
-rw-r--r--  27  .env-thu
-rwxr-xr-x  25  chay.sh          &lt;- giu ca hai</div>
<ul>
<li><strong>File ẩn bị loại CÓ CHỦ ĐÍCH</strong> (từ v4.4, theo README) để một <code>.env</code> vô tình không bị công bố. Nếu thật sự cần, đặt <code>include-hidden-files: true</code> — và đọc danh sách thứ bạn sắp tải lên.</li>
<li><strong>Quyền không được giữ</strong> qua zip: mọi file về lại là <code>644</code>, mọi thư mục <code>755</code> (README, mục "Limitations"). Một CLI đóng gói, một script cài đặt hay một <code>gradlew</code> mà job sau chạy sẽ hỏng với "Permission denied". Hoặc <code>tar</code> trước (tar giữ bit quyền), hoặc <code>chmod +x</code> sau khi tải về.</li>
</ul>
<h3>Thời hạn giữ, và nó tốn gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mặc định 90 ngày</span><span class="lz-lnote">đặt được theo từng artifact bằng <code>retention-days:</code>, hoặc theo cả kho. Chín mươi ngày của mọi bản dựng của mọi PR cộng dồn một cách âm thầm, và artifact tính vào dung lượng lưu trữ của kho</span></div>
<div class="lz-layer"><span class="lz-lname">một cách chia hợp lý</span><span class="lz-lnote">artifact phát hành thì giữ lâu, artifact PR thì giữ ngắn. Một báo cáo test từ một PR gộp ba tuần trước không phải bằng chứng ai sẽ đi xem — <code>retention-days: 5</code> cho mấy cái đó và 90 cho bản phát hành thì không tốn gì mà chặn được đà phình</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code> trên lượt tải lên</span><span class="lz-lnote">kho này có làm, và bài 3.5 đã lập luận rằng đó là cách dùng chính đáng: khi bản dựng hỏng thì phần đầu ra dở dang và log lại ĐÚNG là thứ bạn muốn xem, mà một bước với <code>success()</code> ngầm định sẽ bỏ qua</span></div>
<div class="lz-layer"><span class="lz-lname">và nó KHÔNG phải một cache</span><span class="lz-lnote">artifact là theo từng lần chạy. Một lần chạy sau không phục hồi được artifact của lần chạy trước theo tên từ bên trong workflow mà không đi qua API (<code>download-artifact</code> với <code>run-id</code> và <code>github-token</code> chính là API đó) — và việc cần tới nó thường là tín hiệu rằng thứ bạn muốn là một cái CACHE</span></div>
</div>

<h3>Khuôn mẫu kho này dùng</h3>
${slide('ga-05', 24, 'Ma trận ghi nhiều tên, job gom tải về một chỗ')}
<p>Phía tải về có hai tuỳ chọn giúp việc đặt tên theo từng nhánh trở nên nhẹ nhàng. Ở job <code>dung</code> của sân tập, ba nhánh ma trận đã tải lên <code>ket-qua-linux</code>, <code>ket-qua-windows</code> và <code>ket-qua-macos</code>:</p>
<pre><code class="language-yaml">- uses: actions/download-artifact@v8
  with:
    pattern: 'ket-qua-*'      # loc theo ten
    merge-multiple: true      # do chung vao MOT thu muc thay vi moi artifact mot thu muc
    path: ve/gom</code></pre>
<div class="out">Found 8 artifact(s)
Filtering artifacts by pattern 'ket-qua-*'
- ket-qua-windows (ID: 10809736778, Size: 163, Expected Digest: sha256:d380562e...)
- ket-qua-macos   (ID: 10809377743, Size: 157, ...)
- ket-qua-linux   (ID: 10809343783, Size: 157, ...)
Total of 3 artifact(s) downloaded
$ cat ve/gom/*.txt
ket qua tu nhanh linux
ket qua tu nhanh macos
ket qua tu nhanh windows</div>
<p>Không có <code>merge-multiple</code>, mỗi artifact nằm trong thư mục con mang tên nó — đúng thứ bạn cần khi hai nhánh sinh ra file trùng tên. Mỗi lần tải về còn in <strong>digest SHA-256</strong> nó trông đợi và digest nó tính được; từ download-artifact v8, lệch digest làm bước ĐỎ theo mặc định thay vì chỉ in cảnh báo.</p>
<div class="pitfall">
<p><strong>Bẫy — tải một tên không tồn tại.</strong> Gõ sai <code>name:</code> đẻ ra <code>Unable to download artifact(s): Artifact not found for name: khong-co-dau</code> — đo ngay trong cùng job. Lỗi thì rõ; nguyên nhân thường là lượt tải lên đã bị bỏ qua (một <code>if:</code> trên job tải lên, hoặc một nhánh ma trận hỏng trước bước tải lên của nó). Kiểm job tải lên trước, đừng kiểm cái tên trước.</p>
</div>

<pre><code><span class="tok-comment"># moi nhanh ma tran tai len duoi TEN RIENG</span>
- name: Luu ban cai lam artifact
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: ban-cai-&#36;{{ matrix.ten }}      <span class="tok-comment"># ban-cai-macOS, -Windows, -Linux</span>
    path: |
      desktop/dist/*.zip
      desktop/dist/*.blockmap
      desktop/dist/latest-mac.yml

<span class="tok-comment"># job cong bo tai ca ba ve roi KIEM DU FILE truoc khi cong bo</span>
- name: Tai ban cai cua ca ba nen tang ve
  uses: actions/download-artifact@v4
- name: Kiem du file roi moi cong bo
  run: <span class="tok-comment"># thieu latest-mac.yml la tu-cap-nhat chet cam</span></code></pre>

<div class="callout ok">
<p><strong>Phép kiểm SAU lượt tải về mới là phần đáng chép lại.</strong> Thiếu <code>latest-mac.yml</code> trong một bản phát hành thì chẳng làm hỏng gì nhìn thấy được — trang phát hành trông vẫn đầy đủ và việc tự cập nhật âm thầm thôi hoạt động với mọi bản đã cài. Nên job công bố ĐẾM FILE trước khi công bố. Đó là một artifact được đối xử như một sản phẩm bàn giao kèm một bài kiểm nghiệm thu, tức là chỗ phân biệt ở đầu bài này được đem ra thi hành.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Artifact thì được bảo đảm còn cache thì không, zip nén theo TỪNG TỆP nên HÌNH DẠNG của một lượt tải lên tốn 2,3–2,9 lần khi nó là nhiều tệp nhỏ, và bản trung thực của con số ấy tốn hai lần đo bởi lần đầu đo trúng cái bộ đồ nghề.</p>
</div>

<h3>Các action artifact và cache đang ở đâu, tính đến 09/2026</h3>
${slide('ga-05', 25, 'Phiên bản action artifact đã đi tới đâu (09/2026)')}
<p>Code ở những phần cũ của chương này ghi <code>@v4</code>. Nó vẫn chạy, nhưng các action đã đi xa, và ba thay đổi ảnh hưởng tới thứ bạn viết (ghi chú phát hành đọc từ từng kho ngày 24/09/2026):</p>
<table>
<thead><tr><th>Action</th><th>Bản mới nhất</th><th>Thay đổi đáng biết</th></tr></thead>
<tbody>
<tr><td><code>actions/upload-artifact</code></td><td>v7.0.1</td><td>v4: tên bất biến, trùng thì 409 · v4.x: <code>overwrite</code>, loại file ẩn · v5/v6: Node 24 · <strong>v7: <code>archive: false</code></strong> tải thẳng một file, không nén zip (khi ấy input <code>name</code> bị bỏ qua; artifact mang tên file)</td></tr>
<tr><td><code>actions/download-artifact</code></td><td>v8.0.1</td><td>v5: đường dẫn nhất quán khi tải theo ID · v7: Node 24 · <strong>v8: lệch digest là LỖI theo mặc định</strong>; artifact không nén thì không giải nén</td></tr>
<tr><td><code>actions/cache</code></td><td>v6.1.0</td><td>v4.2+: dịch vụ cache mới · v5: Node 24, cần runner ≥ 2.327.1 · v6: ESM · v6.1: xử lý quyền cache chỉ-đọc</td></tr>
</tbody>
</table>
<div class="out"># upload-artifact@v7, archive: false — run 36004824017
Uploading artifact: nm.tar.zst
Uploaded bytes 217038194
Artifact nm.tar.zst successfully finalized.
Artifact artifact has been successfully uploaded!   &lt;- log van ghi "artifact"</div>
<p>Hệ quả thực dụng: với khuôn "bàn giao một tệp" của bài này, v7 bỏ đi cái zip-bọc-ngoài-tarball vô nghĩa — tarball được cất nguyên như thế, và job sau tải về đúng từng byte ấy. Ghim phiên bản bằng SHA kèm chú thích phiên bản và để Dependabot dời chúng (Chương 4), thay vì sửa tay <code>@v4</code> qua hàng loạt tệp.</p>

<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Khi nào dùng artifact, khi nào dùng cache?</strong><br>Đ: Nếu thiếu file sẽ làm VỠ pipeline hay bản phát hành thì đó là artifact: được bảo đảm suốt thời hạn giữ, nhìn thấy được, tải về được. Nếu thiếu file chỉ tốn thời gian thì đó là cache. Đầu ra dựng chuyển cho job deploy, báo cáo test, bản cài là artifact; kho phụ thuộc và cache của trình biên dịch là cache.</p>
<p><strong>H: Ba job ma trận tải báo cáo test với <code>name: report</code> và workflow hỏng với 409. Vì sao, và sửa thế nào?</strong><br>Đ: Từ upload-artifact v4, tên là duy nhất trong một lần chạy. Dùng <code>name: report-&#36;{{ matrix.os }}</code>, rồi gom bằng <code>pattern: report-*</code> và <code>merge-multiple: true</code>.</p>
<p><strong>H: Job deploy tải một CLI từ artifact và nhận "Permission denied". Vì sao?</strong><br>Đ: Zip không giữ quyền file. Tar thư mục trước khi tải lên (và tải bằng <code>archive: false</code> ở v7), hoặc <code>chmod +x</code> sau khi tải về.</p>
<p><strong>H: Làm sao giữ dung lượng artifact trong tầm kiểm soát?</strong><br>Đ: <code>retention-days</code> ngắn cho artifact của PR và dài hơn cho bản phát hành, một mặc định ở mức kho hoặc tổ chức, và tải lên một tệp nén thay vì những cây thư mục lớn.</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> job dựng của bạn phải bàn giao đầu ra cho job deploy, an toàn và nhanh.</p><ol>
<li>Trong một kho thử, thêm một job dựng (hoặc chỉ tạo) một <code>dist/</code> vài trăm file và một script có quyền chạy.</li>
<li>Tải <code>dist/</code> lên làm artifact, và riêng một lần <code>tar -czf dist.tgz dist</code> rồi tải tệp đó bằng <code>upload-artifact@v7</code> với <code>archive: false</code>. Đặt <code>retention-days: 1</code>.</li>
<li>Thêm job thứ hai có <code>needs:</code>, tải cả hai về, giải nén tarball, và chạy <code>ls -la</code> trên script ở mỗi bản.</li>
<li>Tải lên một artifact thứ hai trùng tên cái đầu (<code>continue-on-error: true</code>), rồi lại lần nữa với <code>overwrite: true</code>, và in <code>steps.&lt;id&gt;.outputs.artifact-id</code> mỗi lần.</li>
<li>So thời lượng hai bước tải lên bằng <code>gh run view &lt;id&gt; --json jobs</code>.</li></ol>
<p><strong>Đạt khi:</strong> log của bạn cho thấy xung đột 409, ID artifact đổi sau khi overwrite, script chỉ còn quyền chạy ở bản đi qua tarball, và hai thời lượng tải lên để so — cộng một câu nói lượt deploy thật của bạn nên dùng cách nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Artifact (sản phẩm dựng)</span><span class="v">Bộ file tải lên từ một job, được giữ suốt thời hạn và tải về được bởi job sau lẫn con người.</span></div>
  <div class="kv"><span class="k"><code>retention-days</code></span><span class="v">Giữ artifact bao lâu: 1–90 ngày ở kho công khai, 1–400 ở kho riêng tư.</span></div>
  <div class="kv"><span class="k"><code>overwrite</code></span><span class="v">Thay artifact cùng tên bằng cách xoá nó rồi tạo cái mới với ID mới.</span></div>
  <div class="kv"><span class="k"><code>archive: false</code></span><span class="v">upload-artifact v7: cất nguyên một file thay vì nén zip.</span></div>
  <div class="kv"><span class="k"><code>merge-multiple</code></span><span class="v">download-artifact: đổ nhiều artifact vào một thư mục.</span></div>
  <div class="kv"><span class="k">Digest (dấu băm)</span><span class="v">SHA-256 của artifact; được kiểm khi tải về, lệch là lỗi từ download-artifact v8.</span></div>
  <div class="kv"><span class="k"><code>include-hidden-files</code></span><span class="v">Chủ động cho phép tải file bắt đầu bằng dấu chấm, vốn bị loại theo mặc định.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Artifact = bàn giao được bảo đảm (mặc định 90 ngày); cache = phép tối ưu có thể biến mất.</li>
<li>Hình dạng quyết định giá: 28.484 file mất 37 s để tải lên, cùng nội dung dưới dạng một <code>tar.zst</code> mất 4 s.</li>
<li>Trùng tên thì hỏng với 409; <code>overwrite: true</code> xoá rồi tạo lại với ID mới — mang ID cuối cùng, hoặc dùng tên.</li>
<li>Zip bỏ bit thực thi và (mặc định) file ẩn; tar giữ cả hai.</li>
<li>Đặt tên artifact ma trận theo từng nhánh và gom bằng <code>pattern</code> + <code>merge-multiple</code>.</li>
<li>Phiên bản hiện tại (09/2026): upload v7 (<code>archive: false</code>), download v8 (bắt buộc khớp digest), cache v6.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">ga-san-tap — ch05-artifact.yml</span><span class="lc-sub">github.com/cuonghoang1103/ga-san-tap/tree/ch05-cache — các lần chạy về 409, overwrite, ID mất, quyền file, file ẩn, ma trận và tải <code>node_modules</code> lên (36004518209, 36004824017).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/upload-artifact — README và ghi chú chuyển sang v4</span><span class="lc-sub">github.com/actions/upload-artifact — <code>retention-days</code>, <code>compression-level</code>, và thay đổi về tính bất biến ở v4 làm vỡ khuôn mẫu nhiều-job-cùng-nối-thêm.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Storing workflow data as artifacts</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts — thời hạn giữ mặc định, cách tính tiền lưu trữ, và API tải một artifact từ một lần chạy KHÁC.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">PKZIP APPNOTE — nén theo từng mục</span><span class="lc-sub">pkware.cachefly.net/webdocs/APPNOTE/APPNOTE-6.3.9.TXT — chi tiết định dạng giải thích phép đo: mỗi mục được nén độc lập, nên một tệp zip không chia sẻ được từ điển giữa các tệp theo cách một tar-đã-nén làm được.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tar, và vì sao "tar rồi nén" thắng "nén từng cái"</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cái thứ tự làm cho cột một-tệp của bảng bên trên khả thi, và những ca mà nó KHÔNG giúp được gì.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — kiểm nghiệm thu TRƯỚC lúc tráo</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — phép đếm file bên trên là một bài kiểm nghiệm thu bản phát hành, và đây là phần trình bày đầy đủ của ý tưởng ấy.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.5 ─────────────────────────── */
    {
      title: '5.5 — Limits, eviction, and the break-even point|||5.5 — Giới hạn, thu hồi, và điểm hoà vốn',
      slug: 'ga-5-5-hoa-von',
      type: 'VIDEO',
      description: 'Ghép mọi số đo của chương thành một mô hình hoà vốn: cache node_modules ở kho này tiết kiệm 4,1 giây tính toán và tốn 1,5–6,1 giây đường mạng. Cộng trần 10 GB và luật thu hồi 7 ngày.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.5</span>
<h2>Limits, eviction, and the break-even point</h2>
<p class="lead">This chapter has produced four numbers. Put together they answer the question the chapter opened with — is this cache worth having — as arithmetic rather than as opinion.</p>

<h3>The fixed cost of one cache round trip</h3>
<div class="out">nen  (zstd -3, chay o post-step):     1.727 ms  cho 667 MB node_modules
giai nen (luc restore):              14.712 ms
=> phan TINH TOAN: ~16,4 s, tuc ~24,6 ms/MB</div>

<p>That is compute only. The transfer is on top, and it depends on a bandwidth this course has no way to measure from outside — so here it is as a range, for the 152 MB tarball:</p>

<div class="out">50 MB/s   -> 152 MB len + 152 MB xuong = 6,1 s
100 MB/s  ->                              3,0 s
200 MB/s  ->                              1,5 s</div>

<h3>The transfer, measured on the runner</h3>
${slide('ga-05', 26, 'Break-even: a cache pays when rebuilding costs more than restoring')}
<p>The range above was a guess, and this chapter has since measured it. Across the sandbox runs of 24/09/2026, the cache service moved data at these rates (every figure is a line the cache action printed itself):</p>
<div class="out">download (restore):  "Received 218882539 of 218882539 (100.0%), 75.6 / 106.0 / 120.8 / 163.8 / 181.8 / 231.7 MBs/sec"
upload   (save):     "Sent 223865560 of 223865560 (100.0%), 108.3 MBs/sec"
                     "Sent 218882539 of 218882539 (100.0%), 104.2 MBs/sec"

restore of 209 MB node_modules, end to end (lookup + download + unzstd of 28,446 files):
                     3.16 / 3.26 / 3.61 / 3.95 / 5.13 s      median 3.6 s
save of the same entry in Post (tar + zstd + upload):         4.9 s
restore of an 84 KB .tsbuildinfo entry:                        0.4 s</div>
<p>So the model becomes concrete: <strong>restore ≈ 0.3 s of lookup + size ÷ (75–230 MB/s) + decompression</strong>, and for a tree of tens of thousands of files the decompression — writing the files — is the largest of the three (about two of the 3.6 seconds). Profit per hit is then simply what the cache replaces minus that restore; the chart plots the three caches of this chapter on it.</p>
<div class="callout ok">
<p><strong>The general form, with the hit rate.</strong> Over <em>N</em> runs with hit rate <em>h</em>, a cache pays when <code>N × h × (rebuild − restore) &gt; N × (1 − h) × save</code>. With the sandbox numbers for <code>node_modules</code> (rebuild 17.5 s, restore 3.6 s, save 4.9 s) the break-even hit rate is 4.9 / (13.9 + 4.9) ≈ <strong>26%</strong>: as long as more than about one run in four hits, it pays. A key that changes every run (Lesson 5.3) has <em>h</em> = 0 and can only lose.</p>
</div>

<h3>The decision table</h3>
${slide('ga-05', 27, 'The decision table, with numbers measured on the runner')}
<div class="callout warn">
<p><strong>Correction to this lesson.</strong> The table and the verdict below were computed from the local measurement, with the transfer estimated, and concluded that caching <code>node_modules</code> on top of <code>cache: npm</code> was an optimisation "whose sign you cannot predict". Measured on the runner, the sign is clear: <code>npm ci</code> with a warm <code>~/.npm</code> takes 13.7 s there (restore included), restoring <code>node_modules</code> takes 3.6 s, so the row saves about <strong>10 seconds per hit</strong>, not 4.1 — because the runner&#39;s network is fast and the file writing that <code>npm ci</code> repeats is the expensive part. The original reasoning is kept below because the method is right; its input was a machine that was not the runner.</p>
</div>
<table>
<thead><tr><th>Job (runner, 24/09/2026)</th><th>No cache</th><th>Cache hit</th><th>Cost on a miss</th><th>Saved per hit</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td><code>npm ci</code> → <code>cache: npm</code></td><td>17.5 s</td><td>13.7 s</td><td>2.9 s save</td><td>3.8 s</td><td>yes — one line</td></tr>
<tr><td><code>npm ci</code> → cache <code>node_modules</code></td><td>17.5 s</td><td>3.6 s</td><td>4.9 s save</td><td>13.9 s</td><td>yes, with a strict key and no <code>restore-keys</code></td></tr>
<tr><td><code>tsc</code>, 600 modules → <code>.tsbuildinfo</code> + <code>dist</code></td><td>3.4 s</td><td>1.2 s + 0.4 s</td><td>0.8 s save</td><td>1.8 s</td><td>small but positive</td></tr>
<tr><td><code>node_modules/.cache</code> (api-backend)</td><td>—</td><td>—</td><td>every run</td><td>0</td><td>delete the step</td></tr>
<tr><td>key containing <code>github.sha</code></td><td>—</td><td>never hits</td><td>every run</td><td>negative</td><td>fix the key</td></tr>
</tbody>
</table>

<div class="out">viec                                 khong cache  co cache  tiet kiem
--------------------------------------------------------------------
npm ci lanh -> am (cache: npm)             31,4s     18,8s      12,6s
npm ci am  -> cache node_modules           18,8s     14,7s       4,1s
tsc backend cua kho nay                    21,0s         —    khong co gi de cache</div>

<div class="callout warn">
<p><strong>Row two is the interesting one, and it does not clear its own overhead.</strong> Caching <code>node_modules</code> on top of the built-in cache saves 4.1 seconds of compute and costs 1.5 to 6.1 seconds of transfer. Depending on the bandwidth on the day, that optimisation is worth somewhere between three seconds and minus two. It is not a mistake to add it; it is a change whose sign you cannot predict, which is a different thing from an improvement.</p>
</div>

<div class="callout ok">
<p><strong>Row one clears it comfortably.</strong> 12.6 seconds saved against the same transfer range: positive at every bandwidth in the table. This is why <code>cache: 'npm'</code> is the near-universal advice and caching <code>node_modules</code> is an argument.</p>
</div>

<h3>The rule this produces</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">saves &lt; ~5 s</span><span class="lz-t">almost certainly not worth it</span><span class="lz-d">the transfer eats it, and you have added an invalidation surface for nothing</span></div>
<div class="lz-step"><span class="lz-k">saves ~5–30 s</span><span class="lz-t">measure your own</span><span class="lz-d">the answer is a property of your cache size and your runner&#39;s bandwidth, not of the advice</span></div>
<div class="lz-step"><span class="lz-k">saves &gt; ~30 s</span><span class="lz-t">almost certainly worth it</span><span class="lz-d">no plausible transfer cost eats thirty seconds for a cache small enough to be worth caching</span></div>
</div>

<h3>The limits, from the documentation</h3>
${slide('ga-05', 28, 'Limits according to the GitHub documentation (read 24/09/2026)')}
<p>Read again on 24/09/2026, the documentation adds three things the list below did not have. The 10 GB is now a <em>default</em>: a user-owned repository can be configured up to 10 TB, and usage beyond the included 10 GB is billed at $0.07 per GB per month, measured as the peak of each hour. The service is rate-limited to 200 cache uploads and 1,500 downloads per minute per repository — relevant for a large matrix that saves one entry per leg. And the eviction order is by last <em>access</em> date, oldest first. On the artifact side: 90 days by default, settable to 1–90 days on public repositories and 1–400 on private ones, at most 500 artifacts per job, free storage for public repositories and 500 MB shared for private ones on a free personal account.</p>

<div class="kv-grid">
<div class="kv"><span class="k">10 GB per repository, by default</span><span class="v">(as of 09/2026 raisable — up to 10 TB for a user-owned repository — with the excess billed). When exceeded, GitHub evicts least-recently-used entries until it fits. So a large cache does not fail — it quietly pushes out everybody else&#39;s, including the one you actually rely on</span></div>
<div class="kv"><span class="k">7 days unused</span><span class="v">an entry not accessed for a week is removed. A workflow that runs monthly effectively never has a cache, no matter how well its key is designed</span></div>
<div class="kv"><span class="k">branch scoping</span><span class="v">from 5.2 — runs read their own branch&#39;s caches and the default branch&#39;s (plus the base branch for PR runs), never a sibling&#39;s. Combined with the 7-day rule, a quiet repository&#39;s PR builds are usually cold</span></div>
<div class="kv"><span class="k">no per-entry size cap worth planning around</span><span class="v">the ceiling is the repository total. The practical limit is the transfer time, which is the model above rather than a policy</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — the large cache that evicts the useful ones.</strong> A 4 GB <code>node_modules</code> cache saved per branch will, on a repository with a few active branches, fill the 10 GB allowance by itself and evict the small, frequently-hit caches that were doing the real work. The symptom is that the <em>other</em> workflows get slower after somebody optimises one — and nothing in any log connects the two. If cache hit rates fall for no reason, look at what was recently added, not at what got slower.</p>
</div>

<h3>Reading whether it is working, at repository level</h3>
${slide('ga-05', 29, 'Measure the whole repository with gh cache — and clean up when done')}
<p>All three questions have command-line answers, which also makes them scriptable in a weekly job:</p>
<div class="out">$ gh cache list --sort size_in_bytes --limit 3
node-cache-Linux-x64-npm-74ddf72d...   213.49 MiB   last used 13:25:41
ch05-nm-Linux-node22-74ddf72d...       208.74 MiB   last used 13:23:54
node-cache-Linux-x64-npm-d94a99a0...   353.96 KiB   last used 12:41:00
$ gh api repos/{owner}/{repo}/actions/cache/usage
{"active_caches_size_in_bytes":443114305,"active_caches_count":17}
$ gh cache delete ch05-khoa-hang
(no output, exit code 0 — the entry is gone)</div>
<p><code>gh cache delete &lt;key&gt;</code> is also the cleanest way to un-freeze a cache without touching YAML: delete the entry, re-run, and the next run misses and saves fresh content. <code>gh cache delete --all</code> exists too, and clears every entry of the repository — every branch starts cold afterwards, so treat it like a force-push.</p>

<p>Three questions, and all three are answerable without changing anything:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">is each cache hitting?</span><span class="lz-lnote">the three-run rule from 5.3: miss-then-hit-then-hit on the same branch. Anything else is a bug you can see in the log</span></div>
<div class="lz-layer"><span class="lz-lname">is it saving more than it costs?</span><span class="lz-lnote">compare the step duration on a hit run against a miss run. The difference is the actual saving, and it is frequently smaller than expected</span></div>
<div class="lz-layer"><span class="lz-lname">is it crowding out the others?</span><span class="lz-lnote">the repository&#39;s cache list shows entry sizes and last-used times. One entry at several gigabytes next to a 10 GB ceiling is the answer to a question somebody else is about to ask</span></div>
</div>

<h3>What this chapter changes about the repository it measured</h3>
<div class="kv-grid">
<div class="kv"><span class="k">the frontend Next.js cache</span><span class="v">working, hitting, well-keyed. Leave it</span></div>
<div class="kv"><span class="k">the backend build cache</span><span class="v">dead since it was written — <code>node_modules/.cache</code> never exists. Delete it, or enable <code>incremental</code> and cache <code>.tsbuildinfo</code>; the 21-second compile suggests deleting</span></div>
<div class="kv"><span class="k"><code>cache: 'npm'</code> on setup-node</span><span class="v">present, working, and measured at 40% of the install. The best line in the file per character</span></div>
<div class="kv"><span class="k">caching <code>node_modules</code> as well</span><span class="v">the 4.1-second row. Not recommended without measuring the transfer, and the transfer is the part nobody measures — <strong>since measured on the runner: about 10 s saved per hit over <code>cache: npm</code></strong>, so worth it with the strict key of Lesson 5.1</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A cache is worth having when the rebuild it replaces is slower than compressing, transferring and decompressing it — which for this repository is true of the package download and not obviously true of anything else.</p>
</div>

${slide('ga-05', 30, 'Common mistakes in Chapter 5')}
<div class="callout">
<p><strong>Common interview questions.</strong></p>
<p><strong>Q: How do you decide whether a cache is worth adding?</strong><br>A: Measure what it replaces and what restoring costs, on the runner: profit per hit = rebuild − restore. Then multiply by the hit rate and subtract the save cost on misses. For <code>node_modules</code> here that was 13.9 s saved per hit against 4.9 s per miss, so it pays above a ~26% hit rate. Small caches of expensive computations win easily; huge caches of cheap work do not.</p>
<p><strong>Q: The team&#39;s CI got slower after someone added a big cache to one workflow. What happened?</strong><br>A: Probably eviction: the repository&#39;s allowance (10 GB by default) filled up and the least-recently-accessed entries — often the small, useful ones — were deleted. Check <code>gh cache list --sort size_in_bytes</code> and the total from the usage API.</p>
<p><strong>Q: A monthly release workflow never hits its cache. Why?</strong><br>A: Entries not accessed for 7 days are removed. A workflow that runs less than weekly effectively has no cache; do not design one for it.</p>
<p><strong>Q: How would you monitor cache health across a repository?</strong><br>A: A scheduled job that reads <code>gh cache list</code> and the usage API — total size against the limit, entries per key prefix (a prefix growing every run is a key that always misses), and entries near 0 bytes (empty caches).</p>
</div>

<h3>🧪 Practice (15–20 min)</h3>

${slide('ga-05', 32, 'Chapter 5 practice (45 minutes) on your own repository')}
<div class="callout ok"><p><strong>Scenario:</strong> write the cache decision for your own repository as a one-page table the team can review.</p><ol>
<li>Run <code>gh cache list --sort size_in_bytes</code> and <code>gh api repos/{owner}/{repo}/actions/cache/usage</code> on your repository; note the total against 10 GB.</li>
<li>For each cache step, take one hit run and one miss run and read the restore and save durations from the log (Lesson 5.3 command).</li>
<li>For each, compute profit per hit = step without cache − (restore + step with cache), and the break-even hit rate = save ÷ (profit + save).</li>
<li>Estimate the real hit rate from the last ten runs (how many printed "Cache hit for").</li>
<li>Decide keep / fix / delete for every cache and write one line of evidence each.</li></ol>
<p><strong>Done when:</strong> you have a table with, for every cache: size, restore time, save time, profit per hit, break-even hit rate, observed hit rate and a decision — and every number traceable to a run ID.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Break-even</span><span class="v">The point where a cache&#39;s savings on hits equal its costs on misses.</span></div>
  <div class="kv"><span class="k">Hit rate</span><span class="v">The share of runs that hit; break-even for <code>node_modules</code> here was ~26%.</span></div>
  <div class="kv"><span class="k">Eviction</span><span class="v">Deleting entries: after 7 days unused, or oldest-accessed first when over the allowance.</span></div>
  <div class="kv"><span class="k">Cache allowance</span><span class="v">10 GB per repository by default, raisable (billed at $0.07/GB-month beyond it).</span></div>
  <div class="kv"><span class="k">Rate limit</span><span class="v">200 cache uploads and 1,500 downloads per minute per repository.</span></div>
  <div class="kv"><span class="k"><code>gh cache</code></span><span class="v">CLI to list, sort and delete a repository&#39;s cache entries.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Profit per hit = what the cache replaces − restore; restore ≈ 0.3 s + size ÷ (75–230 MB/s) + decompression.</li>
<li>Measured on the runner, caching <code>node_modules</code> saves 13.9 s per hit and pays above a ~26% hit rate — correcting the earlier "unpredictable sign".</li>
<li>10 GB per repository is a default now, raisable and billed; entries vanish after 7 days unused.</li>
<li>Large caches evict small useful ones; watch totals with <code>gh cache list</code> and the usage API.</li>
<li><code>gh cache delete &lt;key&gt;</code> un-freezes a cache without touching YAML.</li>
<li>For this repository: keep <code>cache: npm</code>, repair or delete the dead backend cache, and consider <code>node_modules</code> with a strict key.</li>
</ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Dependency caching reference</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — the default 10 GB and how to raise it, 7-day eviction, access order, rate limits and cache version (read 24/09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — GitHub Actions billing</span><span class="lc-sub">docs.github.com/en/billing/concepts/product-billing/github-actions — free usage on public repositories, included artifact storage, and cache storage billed at $0.07 per GB-month beyond 10 GB.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits and eviction policy</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy — the 10 GB repository ceiling, the 7-day unused rule, and the LRU behaviour when the ceiling is reached.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Actions cache usage</span><span class="lc-sub">docs.github.com/en/rest/actions/cache — the endpoints behind the repository cache list, for scripting the third question above rather than reading it in the UI.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — caching-strategies.md</span><span class="lc-sub">github.com/actions/cache/blob/main/caching-strategies.md — the maintainers&#39; own discussion of when a cache pays, which is the qualitative version of the break-even model measured above.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — eviction policies, and the key that gets pushed out</span><span class="lc-sub">/courses/redis/learn${REF} — LRU behaviour under a memory ceiling, including the case where a large infrequent value evicts the small hot ones.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — measure before optimising, and the target that was already idle</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — the same arithmetic applied to a deploy pipeline, where the obvious speed-up turned out to be off the critical path.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.5</span>
<h2>Giới hạn, thu hồi, và điểm hoà vốn</h2>
<p class="lead">Chương này đã đẻ ra bốn con số. Ghép lại, chúng trả lời đúng câu hỏi mà chương mở đầu bằng — cái cache này có đáng có không — dưới dạng SỐ HỌC chứ không dưới dạng quan điểm.</p>

<h3>Chi phí cố định của một vòng cache</h3>
<div class="out">nen  (zstd -3, chay o post-step):     1.727 ms  cho 667 MB node_modules
giai nen (luc restore):              14.712 ms
=> phan TINH TOAN: ~16,4 s, tuc ~24,6 ms/MB</div>

<p>Đó mới là phần tính toán. Phần truyền nằm thêm bên trên, và nó phụ thuộc vào một băng thông mà khoá học này không có cách nào đo được từ bên ngoài — nên đây là nó dưới dạng một KHOẢNG, cho cái tarball 152 MB:</p>

<div class="out">50 MB/s   -> 152 MB len + 152 MB xuong = 6,1 s
100 MB/s  ->                              3,0 s
200 MB/s  ->                              1,5 s</div>

<h3>Phần truyền, đo trên runner</h3>
${slide('ga-05', 26, 'Điểm hoà vốn: cache lãi khi dựng lại đắt hơn khôi phục')}
<p>Khoảng bên trên là ƯỚC ĐOÁN, và chương này sau đó đã đo nó. Qua các lần chạy trên sân tập ngày 24/09/2026, dịch vụ cache chuyển dữ liệu với tốc độ như sau (mỗi con số là một dòng do chính action cache in ra):</p>
<div class="out">tai xuong (khoi phuc):  "Received 218882539 of 218882539 (100.0%), 75.6 / 106.0 / 120.8 / 163.8 / 181.8 / 231.7 MBs/sec"
tai len   (luu):        "Sent 223865560 of 223865560 (100.0%), 108.3 MBs/sec"
                        "Sent 218882539 of 218882539 (100.0%), 104.2 MBs/sec"

khoi phuc node_modules 209 MB tron goi (tra + tai + unzstd 28.446 file):
                        3,16 / 3,26 / 3,61 / 3,95 / 5,13 s      trung vi 3,6 s
luu cung muc do o Post (tar + zstd + tai len):                   4,9 s
khoi phuc mot muc .tsbuildinfo 84 KB:                            0,4 s</div>
<p>Vậy mô hình trở nên cụ thể: <strong>khôi phục ≈ 0,3 s tra cứu + cỡ ÷ (75–230 MB/s) + giải nén</strong>, và với một cây hàng chục nghìn file thì phần giải nén — ghi file ra đĩa — là phần LỚN NHẤT trong ba (khoảng hai trong 3,6 giây). Lãi mỗi lần trúng khi ấy đơn giản là thứ cache thay thế trừ đi lượt khôi phục đó; biểu đồ đặt ba cái cache của chương này lên đúng mô hình ấy.</p>
<div class="callout ok">
<p><strong>Dạng tổng quát, có tỉ lệ trúng.</strong> Qua <em>N</em> lần chạy với tỉ lệ trúng <em>h</em>, cache có lãi khi <code>N × h × (dựng lại − khôi phục) &gt; N × (1 − h) × lưu</code>. Với số của sân tập cho <code>node_modules</code> (dựng lại 17,5 s, khôi phục 3,6 s, lưu 4,9 s) thì tỉ lệ trúng hoà vốn là 4,9 / (13,9 + 4,9) ≈ <strong>26%</strong>: chỉ cần hơn khoảng một phần tư số lần chạy trúng là có lãi. Một khoá đổi ở mọi lần chạy (bài 5.3) có <em>h</em> = 0 và chỉ có thể lỗ.</p>
</div>

<h3>Bảng quyết định</h3>
${slide('ga-05', 27, 'Bảng quyết định, bằng số đo trên runner')}
<div class="callout warn">
<p><strong>Đính chính bài này.</strong> Bảng và phán quyết bên dưới được tính từ phép đo cục bộ, với phần truyền được ƯỚC, và kết luận rằng cache <code>node_modules</code> chồng lên <code>cache: npm</code> là một phép tối ưu "không đoán trước được DẤU". Đo trên runner thì dấu rất rõ: ở đó <code>npm ci</code> với <code>~/.npm</code> ấm mất 13,7 s (đã gồm khôi phục), khôi phục <code>node_modules</code> mất 3,6 s, nên hàng này tiết kiệm khoảng <strong>10 giây mỗi lần trúng</strong>, không phải 4,1 — vì mạng của runner nhanh, và phần ghi file mà <code>npm ci</code> lặp lại mới là phần đắt. Lập luận gốc được giữ lại bên dưới vì PHƯƠNG PHÁP đúng; đầu vào của nó là một cỗ máy không phải runner.</p>
</div>
<table>
<thead><tr><th>Việc (runner, 24/09/2026)</th><th>Không cache</th><th>Có cache (trúng)</th><th>Phí khi trượt</th><th>Lãi mỗi lần trúng</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td><code>npm ci</code> → <code>cache: npm</code></td><td>17,5 s</td><td>13,7 s</td><td>2,9 s lưu</td><td>3,8 s</td><td>nên — một dòng</td></tr>
<tr><td><code>npm ci</code> → cache <code>node_modules</code></td><td>17,5 s</td><td>3,6 s</td><td>4,9 s lưu</td><td>13,9 s</td><td>nên, với khoá chặt và không <code>restore-keys</code></td></tr>
<tr><td><code>tsc</code> 600 module → <code>.tsbuildinfo</code> + <code>dist</code></td><td>3,4 s</td><td>1,2 s + 0,4 s</td><td>0,8 s lưu</td><td>1,8 s</td><td>nhỏ nhưng dương</td></tr>
<tr><td><code>node_modules/.cache</code> (api-backend)</td><td>—</td><td>—</td><td>mỗi lần</td><td>0</td><td>xoá bước</td></tr>
<tr><td>khoá chứa <code>github.sha</code></td><td>—</td><td>không bao giờ trúng</td><td>mỗi lần</td><td>âm</td><td>sửa khoá</td></tr>
</tbody>
</table>

<div class="out">viec                                 khong cache  co cache  tiet kiem
--------------------------------------------------------------------
npm ci lanh -> am (cache: npm)             31,4s     18,8s      12,6s
npm ci am  -> cache node_modules           18,8s     14,7s       4,1s
tsc backend cua kho nay                    21,0s         —    khong co gi de cache</div>

<div class="callout warn">
<p><strong>Hàng hai mới là hàng đáng chú ý, và nó KHÔNG vượt nổi chi phí của chính nó.</strong> Cache <code>node_modules</code> chồng lên cái cache dựng sẵn tiết kiệm 4,1 giây tính toán và tốn 1,5 tới 6,1 giây truyền. Tuỳ băng thông hôm ấy, phép tối ưu đó đáng giá đâu đó giữa ba giây và ÂM hai. Thêm nó vào không phải sai lầm; nó là một thay đổi mà bạn không đoán trước được DẤU của nó, và đó là một chuyện khác với một cải thiện.</p>
</div>

<div class="callout ok">
<p><strong>Hàng một thì vượt thoải mái.</strong> 12,6 giây tiết kiệm so với cùng khoảng truyền ấy: DƯƠNG ở mọi mức băng thông trong bảng. Đó là lý do <code>cache: 'npm'</code> là lời khuyên gần như phổ quát còn cache <code>node_modules</code> thì là một cuộc tranh luận.</p>
</div>

<h3>Quy tắc nó đẻ ra</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">tiết kiệm &lt; ~5 s</span><span class="lz-t">gần như chắc chắn không đáng</span><span class="lz-d">phần truyền ăn hết, và bạn vừa thêm một bề mặt hết-hiệu-lực để đổi lấy con số không</span></div>
<div class="lz-step"><span class="lz-k">tiết kiệm ~5–30 s</span><span class="lz-t">phải tự đo</span><span class="lz-d">đáp án là tính chất của kích thước cache của bạn và băng thông runner của bạn, không phải tính chất của lời khuyên</span></div>
<div class="lz-step"><span class="lz-k">tiết kiệm &gt; ~30 s</span><span class="lz-t">gần như chắc chắn đáng</span><span class="lz-d">không có chi phí truyền hợp lý nào ăn hết ba mươi giây, với một cái cache đủ nhỏ để đáng cache</span></div>
</div>

<h3>Các giới hạn, theo tài liệu</h3>
${slide('ga-05', 28, 'Giới hạn theo tài liệu GitHub (đọc 24/09/2026)')}
<p>Đọc lại ngày 24/09/2026, tài liệu có thêm ba điều mà danh sách bên dưới chưa có. 10 GB giờ là mức <em>MẶC ĐỊNH</em>: một kho của tài khoản cá nhân cấu hình được tới 10 TB, và phần dùng vượt 10 GB đi kèm được tính $0,07 mỗi GB mỗi tháng, đo theo mức đỉnh của từng giờ. Dịch vụ bị giới hạn tốc độ ở 200 lượt lưu cache và 1.500 lượt tải mỗi phút mỗi kho — đáng để ý với một ma trận lớn lưu một mục cho mỗi nhánh. Và thứ tự thu hồi là theo ngày TRUY CẬP cuối, cũ nhất trước. Về phía artifact: 90 ngày mặc định, đặt được 1–90 ngày ở kho công khai và 1–400 ở kho riêng tư, tối đa 500 artifact mỗi job, lưu trữ miễn phí cho kho công khai và 500 MB dùng chung cho kho riêng tư của tài khoản cá nhân miễn phí.</p>

<div class="kv-grid">
<div class="kv"><span class="k">10 GB cho mỗi kho, mặc định</span><span class="v">(tính đến 09/2026 nâng được — tới 10 TB cho kho của tài khoản cá nhân — phần vượt tính tiền). Khi vượt, GitHub thu hồi các mục ÍT DÙNG NHẤT cho tới khi vừa. Nên một cái cache lớn KHÔNG hỏng — nó âm thầm đẩy mọi cái khác ra ngoài, kể cả cái bạn thật sự đang dựa vào</span></div>
<div class="kv"><span class="k">7 ngày không dùng</span><span class="v">một mục không được chạm tới suốt một tuần thì bị gỡ. Một workflow chạy hằng tháng thì thực tế KHÔNG BAO GIỜ có cache, dù khoá của nó thiết kế khéo tới đâu</span></div>
<div class="kv"><span class="k">khoanh vùng theo nhánh</span><span class="v">từ bài 5.2 — lần chạy đọc cache của chính nhánh nó và của nhánh mặc định (cộng nhánh gốc với lần chạy PR), không bao giờ đọc của nhánh anh em. Ghép với luật 7 ngày, các bản dựng PR của một kho im ắng thường LẠNH</span></div>
<div class="kv"><span class="k">không có trần dung lượng từng mục đáng phải tính</span><span class="v">cái trần là TỔNG của kho. Giới hạn thực dụng là THỜI GIAN TRUYỀN, tức là cái mô hình bên trên chứ không phải một chính sách</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái cache LỚN đẩy mất những cái hữu ích.</strong> Một cache <code>node_modules</code> 4 GB lưu theo từng nhánh sẽ, ở một kho có vài nhánh đang hoạt động, tự nó lấp đầy hạn mức 10 GB và thu hồi mất những cache nhỏ, trúng thường xuyên, vốn đang làm phần việc thật. Triệu chứng là những workflow <em>KHÁC</em> chậm đi sau khi có người tối ưu MỘT cái — và không có gì trong bất kỳ log nào nối hai chuyện ấy lại. Nếu tỉ lệ trúng cache tụt mà không rõ lý do, hãy nhìn vào thứ MỚI ĐƯỢC THÊM, đừng nhìn vào thứ chậm đi.</p>
</div>

<h3>Đọc xem nó có chạy không, ở mức cả kho</h3>
${slide('ga-05', 29, 'Đo cả kho bằng gh cache — và dọn khi xong')}
<p>Cả ba câu hỏi đều có câu trả lời bằng dòng lệnh, nên cũng viết thành script chạy hằng tuần được:</p>
<div class="out">$ gh cache list --sort size_in_bytes --limit 3
node-cache-Linux-x64-npm-74ddf72d...   213.49 MiB   dung lan cuoi 13:25:41
ch05-nm-Linux-node22-74ddf72d...       208.74 MiB   dung lan cuoi 13:23:54
node-cache-Linux-x64-npm-d94a99a0...   353.96 KiB   dung lan cuoi 12:41:00
$ gh api repos/{owner}/{repo}/actions/cache/usage
{"active_caches_size_in_bytes":443114305,"active_caches_count":17}
$ gh cache delete ch05-khoa-hang
(khong in gi, ma thoat 0 — muc da mat)</div>
<p><code>gh cache delete &lt;khoá&gt;</code> cũng là cách gọn nhất để "rã đông" một cái cache mà không đụng YAML: xoá mục, chạy lại, lần sau trượt và lưu nội dung mới. <code>gh cache delete --all</code> cũng có, và xoá sạch mọi mục của kho — sau đó mọi nhánh đều bắt đầu lạnh, nên hãy đối xử với nó như một cú force-push.</p>

<p>Ba câu hỏi, và cả ba đều trả lời được mà không phải đổi gì:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">từng cache có TRÚNG không?</span><span class="lz-lnote">quy tắc ba lần chạy ở bài 5.3: trượt-rồi-trúng-rồi-trúng trên cùng một nhánh. Mọi khuôn hình khác là một lỗi bạn nhìn thấy được trong log</span></div>
<div class="lz-layer"><span class="lz-lname">nó có tiết kiệm nhiều hơn nó tốn không?</span><span class="lz-lnote">so thời lượng bước ở một lần chạy TRÚNG với một lần chạy TRƯỢT. Chênh lệch chính là khoản tiết kiệm thật, và nó thường nhỏ hơn người ta tưởng</span></div>
<div class="lz-layer"><span class="lz-lname">nó có chèn ép những cái khác không?</span><span class="lz-lnote">danh sách cache của kho hiện kích thước từng mục và lần dùng cuối. Một mục nặng vài gigabyte đứng cạnh một cái trần 10 GB chính là đáp án cho một câu hỏi mà người khác sắp hỏi</span></div>
</div>

<h3>Chương này thay đổi gì ở cái kho nó vừa đo</h3>
<div class="kv-grid">
<div class="kv"><span class="k">cache Next.js của frontend</span><span class="v">đang chạy, đang trúng, khoá đặt khéo. Để nguyên</span></div>
<div class="kv"><span class="k">cache dựng của backend</span><span class="v">chết từ lúc được viết ra — <code>node_modules/.cache</code> không bao giờ tồn tại. Hãy XOÁ nó, hoặc bật <code>incremental</code> rồi cache <code>.tsbuildinfo</code>; lượt biên dịch 21 giây gợi ý là nên xoá</span></div>
<div class="kv"><span class="k"><code>cache: 'npm'</code> trên setup-node</span><span class="v">có mặt, đang chạy, và đo được là 40% của bước cài. Dòng tốt nhất trong tệp tính theo từng ký tự</span></div>
<div class="kv"><span class="k">cache thêm cả <code>node_modules</code></span><span class="v">chính là hàng 4,1 giây. Không khuyến nghị nếu chưa đo phần truyền, mà phần truyền lại là phần không ai đo — <strong>nay đã đo trên runner: tiết kiệm khoảng 10 s mỗi lần trúng so với <code>cache: npm</code></strong>, nên đáng làm với khoá chặt của bài 5.1</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một cái cache đáng có khi lượt dựng lại mà nó thay thế CHẬM HƠN việc nén, truyền và giải nén nó — điều mà ở kho này đúng với lượt tải gói và không hiển nhiên đúng với thứ gì khác.</p>
</div>

${slide('ga-05', 30, 'Sai lầm hay gặp ở Chương 5')}
<div class="callout">
<p><strong>Câu hỏi phỏng vấn hay gặp.</strong></p>
<p><strong>H: Làm sao quyết một cái cache có đáng thêm không?</strong><br>Đ: Đo thứ nó thay thế và cái giá khôi phục, TRÊN RUNNER: lãi mỗi lần trúng = dựng lại − khôi phục. Rồi nhân với tỉ lệ trúng và trừ phí lưu ở những lần trượt. Với <code>node_modules</code> ở đây là 13,9 s lãi mỗi lần trúng so với 4,9 s mỗi lần trượt, nên có lãi khi tỉ lệ trúng trên ~26%. Cache nhỏ của một phép tính đắt thắng dễ; cache khổng lồ của một việc rẻ thì không.</p>
<p><strong>H: CI của cả nhóm chậm đi sau khi có người thêm một cache lớn vào một workflow. Chuyện gì đã xảy ra?</strong><br>Đ: Nhiều khả năng là thu hồi: hạn mức của kho (mặc định 10 GB) đầy và những mục truy cập lâu nhất — thường là những mục nhỏ mà hữu ích — bị xoá. Xem <code>gh cache list --sort size_in_bytes</code> và tổng từ API usage.</p>
<p><strong>H: Workflow phát hành hằng tháng không bao giờ trúng cache. Vì sao?</strong><br>Đ: Mục không được truy cập trong 7 ngày bị gỡ. Workflow chạy thưa hơn một tuần một lần thực tế không có cache; đừng thiết kế cache cho nó.</p>
<p><strong>H: Bạn giám sát sức khoẻ cache của cả kho thế nào?</strong><br>Đ: Một job theo lịch đọc <code>gh cache list</code> và API usage — tổng dung lượng so với hạn mức, số mục theo từng tiền tố khoá (một tiền tố dài ra ở mọi lần chạy là một khoá luôn trượt), và những mục gần 0 byte (cache rỗng).</p>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>

${slide('ga-05', 32, 'Thực hành Chương 5 (45 phút) trên kho của chính bạn')}
<div class="callout ok"><p><strong>Tình huống:</strong> viết quyết định về cache cho kho của chính bạn thành một bảng một trang để cả nhóm xem.</p><ol>
<li>Chạy <code>gh cache list --sort size_in_bytes</code> và <code>gh api repos/{owner}/{repo}/actions/cache/usage</code> trên kho của bạn; ghi tổng so với 10 GB.</li>
<li>Với mỗi bước cache, lấy một lần chạy trúng và một lần trượt, đọc thời gian khôi phục và lưu từ log (lệnh của bài 5.3).</li>
<li>Với mỗi cái, tính lãi mỗi lần trúng = bước không cache − (khôi phục + bước có cache), và tỉ lệ trúng hoà vốn = lưu ÷ (lãi + lưu).</li>
<li>Ước tỉ lệ trúng thật từ mười lần chạy gần nhất (bao nhiêu lần in "Cache hit for").</li>
<li>Quyết giữ / sửa / xoá cho mọi cache, mỗi cái một dòng bằng chứng.</li></ol>
<p><strong>Đạt khi:</strong> bạn có một bảng mà với mỗi cache có: kích thước, thời gian khôi phục, thời gian lưu, lãi mỗi lần trúng, tỉ lệ trúng hoà vốn, tỉ lệ trúng quan sát và một quyết định — và mọi con số truy được về một run ID.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hoà vốn (break-even)</span><span class="v">Điểm mà khoản tiết kiệm ở những lần trúng bằng phí ở những lần trượt.</span></div>
  <div class="kv"><span class="k">Tỉ lệ trúng (hit rate)</span><span class="v">Phần lần chạy trúng cache; hoà vốn cho <code>node_modules</code> ở đây là ~26%.</span></div>
  <div class="kv"><span class="k">Thu hồi (eviction)</span><span class="v">Xoá mục: sau 7 ngày không dùng, hoặc truy cập cũ nhất trước khi vượt hạn mức.</span></div>
  <div class="kv"><span class="k">Hạn mức cache</span><span class="v">Mặc định 10 GB mỗi kho, nâng được (phần vượt tính $0,07/GB/tháng).</span></div>
  <div class="kv"><span class="k">Giới hạn tốc độ (rate limit)</span><span class="v">200 lượt lưu và 1.500 lượt tải cache mỗi phút mỗi kho.</span></div>
  <div class="kv"><span class="k"><code>gh cache</code></span><span class="v">Lệnh CLI để liệt kê, sắp xếp và xoá các mục cache của một kho.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lãi mỗi lần trúng = thứ cache thay thế − khôi phục; khôi phục ≈ 0,3 s + cỡ ÷ (75–230 MB/s) + giải nén.</li>
<li>Đo trên runner, cache <code>node_modules</code> tiết kiệm 13,9 s mỗi lần trúng và có lãi khi tỉ lệ trúng trên ~26% — đính chính câu "không đoán được dấu" trước đây.</li>
<li>10 GB mỗi kho giờ là mức mặc định, nâng được và tính tiền; mục biến mất sau 7 ngày không dùng.</li>
<li>Cache lớn đẩy cache nhỏ hữu ích ra ngoài; theo dõi tổng bằng <code>gh cache list</code> và API usage.</li>
<li><code>gh cache delete &lt;khoá&gt;</code> rã đông một cái cache mà không đụng YAML.</li>
<li>Với kho này: giữ <code>cache: npm</code>, vá hoặc xoá cache backend chết, và cân nhắc <code>node_modules</code> với khoá chặt.</li>
</ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Dependency caching reference</span><span class="lc-sub">docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching — mức 10 GB mặc định và cách nâng, thu hồi sau 7 ngày, thứ tự truy cập, giới hạn tốc độ và version của cache (đọc 24/09/2026).</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Tính tiền GitHub Actions</span><span class="lc-sub">docs.github.com/en/billing/concepts/product-billing/github-actions — miễn phí với kho công khai, dung lượng artifact đi kèm, và lưu trữ cache vượt 10 GB tính $0,07 mỗi GB mỗi tháng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub Docs — Usage limits and eviction policy</span><span class="lc-sub">docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#usage-limits-and-eviction-policy — trần 10 GB cho mỗi kho, luật 7 ngày không dùng, và hành vi LRU khi chạm trần.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">GitHub REST API — Actions cache usage</span><span class="lc-sub">docs.github.com/en/rest/actions/cache — các endpoint đứng sau danh sách cache của kho, để viết script cho câu hỏi thứ ba bên trên thay vì đọc nó trên giao diện.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">actions/cache — caching-strategies.md</span><span class="lc-sub">github.com/actions/cache/blob/main/caching-strategies.md — chính người bảo trì bàn về lúc nào một cái cache có lãi, tức là bản định tính của mô hình hoà vốn vừa đo bên trên.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Redis — chính sách thu hồi, và cái khoá bị đẩy ra ngoài</span><span class="lc-sub">/courses/redis/learn${REF} — hành vi LRU dưới một trần bộ nhớ, gồm cả ca mà một giá trị LỚN ít dùng thu hồi mất những giá trị NHỎ đang nóng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Deploy VPS — đo TRƯỚC khi tối ưu, và cái đích vốn đã ngồi không</span><span class="lc-sub">/courses/deploy-vps/learn${REF} — cùng phép số học ấy áp lên một đường ống deploy, nơi khoản tăng tốc hiển nhiên hoá ra nằm ngoài đường tới hạn.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 5.6 ─────────────────────────── */
    {
      title: '5.6 — Chapter 5 quiz|||5.6 — Kiểm tra Chương 5',
      slug: 'ga-5-6-kiem-tra',
      type: 'QUIZ',
      description: 'Mười câu tình huống trên đúng những gì chương đã chạy thật: cache: npm chỉ 22% trên runner, npm ci xoá node_modules, mục cache bất biến, thứ tự restore-keys, phạm vi nhánh, cache rỗng 237 byte, khoá chứa github.sha, lỗi 409 khi ma trận tải artifact, zip làm mất quyền chạy, và tỉ lệ trúng hoà vốn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>What Chapter 5 measured</h2>
<p class="lead">Ten questions, fifteen minutes. Each is a situation you will meet in a real pipeline, and every answer was run on a real runner in this chapter — three of them overturn claims an earlier version of the chapter made. If an option feels like a matter of opinion, go back to the log it came from.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain what <code>cache: npm</code> stores and what caching <code>node_modules</code> stores, and which of them lets me skip <code>npm ci</code>.</li>
<li>I can design a key from what the content depends on, and predict what <code>restore-keys</code> returns when several entries match.</li>
<li>I know that entries are immutable, what a second save prints, and why a constant key freezes.</li>
<li>I can say which branches can read a cache: own branch, default branch, PR base — and not the branch mine was created from.</li>
<li>I can classify a cache from three runs and its <code>Cache Size</code>: healthy, dead, empty, always missing, frozen.</li>
<li>I can choose artifact or cache, avoid the 409 on matrix uploads, keep permissions with tar, and compute a break-even hit rate.</li>
</ul>
${slide('ga-05', 31, 'Chapter 5 cheat sheet')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Chương 5 đã đo được gì</h2>
<p class="lead">Mười câu, mười lăm phút. Câu nào cũng là một tình huống bạn sẽ gặp trong một pipeline thật, và mọi đáp án đều đã được CHẠY trên runner thật trong chương này — ba câu trong số đó lật lại điều mà bản cũ của chương từng nói. Nếu một phương án khiến bạn thấy nó tuỳ quan điểm, hãy quay lại cái log mà nó lấy ra.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được <code>cache: npm</code> cất gì và cache <code>node_modules</code> cất gì, và cái nào cho phép bỏ qua <code>npm ci</code>.</li>
<li>Tôi thiết kế được khoá từ thứ nội dung phụ thuộc vào, và đoán được <code>restore-keys</code> trả về gì khi nhiều mục cùng khớp.</li>
<li>Tôi biết mục cache là bất biến, lần lưu thứ hai in ra gì, và vì sao một khoá hằng bị đông cứng.</li>
<li>Tôi nói được nhánh nào đọc được một cache: nhánh mình, nhánh mặc định, nhánh gốc của PR — và KHÔNG phải nhánh mà nhánh mình tách ra.</li>
<li>Tôi phân loại được một cache từ ba lần chạy và dòng <code>Cache Size</code>: khoẻ, chết, rỗng, luôn trượt, đông cứng.</li>
<li>Tôi chọn được artifact hay cache, tránh được lỗi 409 khi ma trận tải lên, giữ quyền file bằng tar, và tính được tỉ lệ trúng hoà vốn.</li>
</ul>
${slide('ga-05', 31, 'Bảng tra nhanh Chương 5')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "On a GitHub runner, npm ci takes 17.5 s with no cache and 13.7 s with cache: npm (restore included). On a local machine the same built-in cache saved 40%. Why only about 22% on the runner?|||Trên runner của GitHub, npm ci mất 17,5 s khi không cache và 13,7 s với cache: npm (đã gồm khôi phục). Trên máy cục bộ, cùng cái cache dựng sẵn ấy tiết kiệm 40%. Vì sao trên runner chỉ khoảng 22%?",
            options: [
              "The runner restores the npm cache from a slower regional storage than the registry itself|||Runner khôi phục cache npm từ một kho lưu trữ vùng chậm hơn chính registry",
              "The runner downloads packages from the registry very fast, so skipping the download saves little; npm ci still rebuilds all 28,446 files|||Runner tải gói từ registry rất nhanh nên bỏ qua lượt tải chẳng tiết kiệm bao nhiêu; npm ci vẫn dựng lại đủ 28.446 file",
              "cache: npm on a runner stores node_modules instead of ~/.npm, which is larger to transfer|||Trên runner, cache: npm cất node_modules thay cho ~/.npm, nên phải truyền nhiều hơn",
              "The runner used an older npm that ignores the download cache for half of the packages|||Runner dùng một bản npm cũ bỏ qua kho tải về với một nửa số gói",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: cache: npm only removes the network download; npm ci still deletes and rebuilds node_modules. On a runner inside Azure the download from the npm registry is already cheap, so the saving shrinks to ~3.8 s; writing 28,446 files is the expensive part, and only a node_modules cache removes it (3.6 s restore). The regional-storage option is tempting, but the logs show the cache downloading at 75–232 MB/s — the restore took 1.4–3.6 s, not the difference.|||VI: cache: npm chỉ bỏ được lượt tải qua mạng; npm ci vẫn xoá rồi dựng lại node_modules. Trên runner nằm trong Azure, tải từ registry npm vốn đã rẻ, nên khoản tiết kiệm co lại còn ~3,8 s; ghi 28.446 file mới là phần đắt, và chỉ cache node_modules gỡ được nó (khôi phục 3,6 s). Phương án “kho vùng chậm” hấp dẫn, nhưng log cho thấy cache tải xuống 75–232 MB/s — lượt khôi phục mất 1,4–3,6 s, không phải chỗ chênh lệch.",
          },
          {
            question: "A workflow restores node_modules with actions/cache and then runs npm ci unconditionally. What is the effect on a cache hit?|||Một workflow khôi phục node_modules bằng actions/cache rồi chạy npm ci vô điều kiện. Khi trúng cache thì hậu quả là gì?",
            options: [
              "npm ci notices node_modules is already complete and finishes in under a second|||npm ci nhận ra node_modules đã đủ và xong trong chưa tới một giây",
              "npm ci fails because the restored tree does not match the lockfile timestamps|||npm ci hỏng vì cây đã khôi phục không khớp dấu thời gian của lockfile",
              "The Post step saves the reinstalled tree over the old entry, so the next hit is fresher|||Bước Post lưu cây vừa cài lại đè lên mục cũ, nên lần trúng sau mới hơn",
              "npm ci deletes node_modules first, so the restore is wasted and the job is slower than with no cache|||npm ci xoá node_modules trước tiên, nên lượt khôi phục bị phí và job còn chậm hơn không cache",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: npm ci always starts by removing node_modules, so the restored tree is thrown away and the full install runs anyway — restore time plus install time. Guard the install with if: steps.nm.outputs.cache-hit != 'true'. The “finishes quickly” option describes npm install, not npm ci; and the Post-step option is impossible because a primary-key hit never saves.|||VI: npm ci luôn bắt đầu bằng việc xoá node_modules, nên cây vừa khôi phục bị vứt đi và lượt cài đầy đủ vẫn chạy — thời gian khôi phục cộng thời gian cài. Chốt bước cài bằng if: steps.nm.outputs.cache-hit != 'true'. Phương án “xong nhanh” mô tả npm install chứ không phải npm ci; còn phương án bước Post là không thể, vì trúng khoá chính thì không bao giờ lưu.",
          },
          {
            question: "A job saves a cache, changes the file, and saves again with the same key. The second save step is green and prints “Failed to save: Unable to reserve cache with key …, another job may be creating this cache.” What is true?|||Một job lưu cache, sửa file, rồi lưu lại với cùng khoá. Bước lưu thứ hai xanh và in “Failed to save: Unable to reserve cache with key …, another job may be creating this cache.” Điều gì đúng?",
            options: [
              "The entry already exists and is immutable; the cache still holds the first content|||Mục ấy đã tồn tại và là bất biến; cache vẫn giữ nội dung lần đầu",
              "Two jobs are racing; retrying the step a few seconds later will overwrite the entry|||Hai job đang đua nhau; chạy lại bước sau vài giây sẽ ghi đè được mục",
              "The second save was queued and will replace the entry once the first upload finishes|||Lần lưu thứ hai được xếp hàng và sẽ thay mục khi lượt tải đầu xong",
              "The repository hit its 200-uploads-per-minute limit and the save was dropped|||Kho đã chạm giới hạn 200 lượt lưu mỗi phút và lượt lưu bị bỏ",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Cache entries cannot be changed once written; the sandbox restored “lan ghi 1”, the first content. The message wording suggests a race, which is why the race option is tempting — but no other job existed; the key was simply taken. The step is green, so this is easy to miss. To change content, use a new key or delete the entry.|||VI: Mục cache không sửa được sau khi đã ghi; sân tập khôi phục ra “lan ghi 1”, nội dung lần đầu. Câu chữ của thông báo gợi ý một cuộc đua, nên phương án đua hấp dẫn — nhưng không có job nào khác; khoá chỉ đơn giản đã có chủ. Bước vẫn xanh nên rất dễ bỏ sót. Muốn đổi nội dung thì dùng khoá mới hoặc xoá mục.",
          },
          {
            question: "Entries k-a (older) and k-b (newer) exist. A restore uses key k-z and restore-keys with two lines: “k-a” then “k-”. Which entry is restored?|||Có hai mục k-a (cũ hơn) và k-b (mới hơn). Một lượt khôi phục dùng key k-z và restore-keys hai dòng: “k-a” rồi “k-”. Mục nào được khôi phục?",
            options: [
              "k-b, because restore-keys always return the most recently created matching entry|||k-b, vì restore-keys luôn trả về mục khớp được tạo gần nhất",
              "None: restore-keys are only used when the key has no hash in it|||Không mục nào: restore-keys chỉ được dùng khi key không chứa hash",
              "k-a, because lines are tried in order and the first line already matches|||k-a, vì các dòng được thử theo thứ tự và dòng đầu đã khớp",
              "Both are merged into the path, newest files winning|||Cả hai được trộn vào path, file mới hơn thắng",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: The newest-entry rule applies within one prefix line; between lines, order decides. The sandbox run 36004824230 restored ch05-rk-…-a with the two-line list, and -b with a single “ch05-rk-…-” line. The “most recent” option is the half-truth that makes this tricky. Write restore-keys from most specific to most general.|||VI: Luật “mục mới nhất” áp dụng TRONG một dòng tiền tố; giữa các dòng thì thứ tự quyết định. Run 36004824230 trên sân tập khôi phục ch05-rk-…-a với danh sách hai dòng, và -b với một dòng “ch05-rk-…-” duy nhất. Phương án “mới nhất” là nửa sự thật khiến câu này khó. Viết restore-keys từ cụ thể nhất tới chung nhất.",
          },
          {
            question: "Branch feature-em was created from branch feature (neither is the default branch). feature has a warm cache, but runs on feature-em never hit it. Why?|||Nhánh feature-em được tạo từ nhánh feature (không nhánh nào là nhánh mặc định). feature có cache ấm, nhưng các lần chạy trên feature-em không bao giờ trúng. Vì sao?",
            options: [
              "A child branch reads its parent’s cache only after the parent has been merged once|||Nhánh con chỉ đọc được cache của nhánh cha sau khi nhánh cha đã được merge một lần",
              "The cache key contains the branch name implicitly through runner.os|||Khoá cache ngầm chứa tên nhánh thông qua runner.os",
              "Runs read only their own branch, the default branch, and (for PR runs) the PR base branch|||Lần chạy chỉ đọc nhánh của chính nó, nhánh mặc định, và (với lần chạy PR) nhánh gốc của PR",
              "Caches expire after 24 hours on non-default branches|||Cache hết hạn sau 24 giờ trên các nhánh không phải mặc định",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Measured in run 36004861851: ch05-cache-em, created from ch05-cache, could not read any of its entries. Only a PR from feature-em into feature would read feature’s cache, as its base. An earlier version of Lesson 5.2 said “its base branch”, which is exactly the misunderstanding the first option encodes. runner.os is Linux/Windows/macOS, not a branch; eviction is after 7 days unused on any branch.|||VI: Đo ở run 36004861851: ch05-cache-em, tạo từ ch05-cache, không đọc được mục nào của nó. Chỉ một PR từ feature-em vào feature mới đọc được cache của feature, với tư cách nhánh gốc. Bản cũ của bài 5.2 viết “nhánh gốc của nó”, đúng cái hiểu lầm mà phương án đầu mã hoá. runner.os là Linux/Windows/macOS, không phải tên nhánh; thu hồi là sau 7 ngày không dùng ở mọi nhánh.",
          },
          {
            question: "A cache step has saved once and hit on every later run, with no warnings. Its restore log says “Cache Size: ~0 MB (237 B)”. What is the diagnosis?|||Một bước cache đã lưu một lần và trúng ở mọi lần sau, không có cảnh báo nào. Log khôi phục ghi “Cache Size: ~0 MB (237 B)”. Chẩn đoán là gì?",
            options: [
              "The path exists but holds nothing useful — an empty cache that looks healthy|||Đường dẫn có tồn tại nhưng không chứa gì hữu ích — một cache rỗng trông như khoẻ",
              "The cache is healthy; sizes under 1 MB are reported as ~0 MB by design|||Cache khoẻ; kích thước dưới 1 MB được báo là ~0 MB theo thiết kế",
              "The entry was evicted and the service returned only its metadata|||Mục đã bị thu hồi và dịch vụ chỉ trả về siêu dữ liệu của nó",
              "Compression failed, so only the tar header was uploaded|||Việc nén hỏng, nên chỉ phần đầu tar được tải lên",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: 237 bytes is a tar of an empty directory. In the sandbox, a copy of api-backend’s node_modules/.cache step saved an empty jiti/ directory created by a dependency — no warning, saves, hits. The “~0 MB by design” option is tempting because the rounding is real, but the exact byte count in parentheses tells you it is empty. Always compare Cache Size with what the cache should contain.|||VI: 237 byte là một tar của thư mục rỗng. Ở sân tập, bản chép bước node_modules/.cache của api-backend đã lưu một thư mục jiti/ rỗng do một phụ thuộc tạo ra — không cảnh báo, vẫn lưu, vẫn trúng. Phương án “~0 MB theo thiết kế” hấp dẫn vì việc làm tròn là có thật, nhưng số byte chính xác trong ngoặc cho biết nó rỗng. Luôn so Cache Size với thứ cache lẽ ra chứa.",
          },
          {
            question: "gh cache list shows one new entry per run for the prefix app-deps-, and the step always logs “Cache not found … → Cache saved”. What is most likely in the key?|||gh cache list cho thấy mỗi lần chạy lại thêm một mục mới với tiền tố app-deps-, và bước luôn in “Cache not found … → Cache saved”. Khoá nhiều khả năng chứa gì?",
            options: [
              "runner.os, which changes between runs on hosted runners|||runner.os, thứ đổi giữa các lần chạy trên runner của GitHub",
              "hashFiles of the lockfile, which changes on every checkout|||hashFiles của lockfile, thứ đổi ở mọi lần checkout",
              "Nothing is wrong: each run is supposed to create its own entry|||Không có gì sai: mỗi lần chạy vốn phải tạo mục riêng",
              "Something that changes per run, such as github.sha or github.run_id — so it never hits and only pays to upload|||Thứ gì đó đổi theo từng lần chạy, như github.sha hay github.run_id — nên không bao giờ trúng mà chỉ tốn tiền tải lên",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: The sandbox job luon-truot used github.sha plus github.run_id: four runs, four entries, zero hits; even the same commit run twice missed. hashFiles of an unchanged lockfile is stable (Lesson 4.4 reproduced it byte for byte), and runner.os is constant on one OS. A key must not contain anything that changes per run.|||VI: Job luon-truot trên sân tập dùng github.sha cộng github.run_id: bốn lần chạy, bốn mục, không lần trúng nào; cùng một commit chạy hai lần vẫn trượt. hashFiles của một lockfile không đổi là ổn định (bài 4.4 đã tái lập từng byte), và runner.os không đổi trên một hệ điều hành. Khoá không được chứa thứ gì đổi theo từng lần chạy.",
          },
          {
            question: "Three matrix legs each run upload-artifact with name: report, and the workflow fails with “(409) Conflict: an artifact with this name already exists on the workflow run”. What is the right fix?|||Ba nhánh ma trận đều chạy upload-artifact với name: report, và workflow hỏng với “(409) Conflict: an artifact with this name already exists on the workflow run”. Cách sửa đúng là gì?",
            options: [
              "Add overwrite: true so each leg replaces the previous report|||Thêm overwrite: true để mỗi nhánh thay báo cáo của nhánh trước",
              "Name each artifact per leg (report-$" + "{{ matrix.os }}) and collect with pattern and merge-multiple|||Đặt tên theo từng nhánh (report-$" + "{{ matrix.os }}) rồi gom bằng pattern và merge-multiple",
              "Pin upload-artifact to v3, which allowed appending to one artifact|||Ghim upload-artifact về v3, bản cho phép nối thêm vào một artifact",
              "Run the matrix with max-parallel: 1 so the uploads do not collide|||Chạy ma trận với max-parallel: 1 để các lượt tải lên không va nhau",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Since v4 a name is unique within a run, so three legs need three names; download-artifact with pattern: report-* and merge-multiple: true gathers them. overwrite: true is tempting but deletes the previous leg’s report, leaving only the last one (and a new ID). v3 is deprecated, and serialising does not help — the name is still taken.|||VI: Từ v4, tên là duy nhất trong một lần chạy, nên ba nhánh cần ba tên; download-artifact với pattern: report-* và merge-multiple: true gom chúng lại. overwrite: true hấp dẫn nhưng XOÁ báo cáo của nhánh trước, chỉ còn lại cái cuối (với ID mới). v3 đã ngừng hỗ trợ, và chạy tuần tự không giúp gì — tên vẫn đã có chủ.",
          },
          {
            question: "A deploy job downloads a CLI binary from an artifact uploaded by the build job, and running it fails with “Permission denied”. Why?|||Một job deploy tải một CLI từ artifact do job dựng tải lên, và chạy nó thì hỏng với “Permission denied”. Vì sao?",
            options: [
              "The artifact zip does not keep file modes, so the executable bit is lost; tar before upload or chmod after download|||Zip của artifact không giữ quyền file, nên bit thực thi bị mất; tar trước khi tải lên hoặc chmod sau khi tải về",
              "Artifacts are downloaded as root-owned files that the runner user cannot execute|||Artifact được tải về dưới quyền sở hữu root nên user của runner không chạy được",
              "download-artifact v8 quarantines binaries until their digest is verified manually|||download-artifact v8 cách ly file nhị phân cho tới khi digest được kiểm bằng tay",
              "The build job must set retention-days: 0 to keep the original permissions|||Job dựng phải đặt retention-days: 0 để giữ quyền gốc",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Measured in run 36004824017: chay.sh uploaded as -rwxr-xr-x came back -rw-r--r-- through the zip, but kept +x through a tar. The README lists this under Limitations: files return as 644. The v8 option mixes up a real feature — digest checking — with something it does not do; ownership is the runner user, not root.|||VI: Đo ở run 36004824017: chay.sh tải lên với -rwxr-xr-x về lại thành -rw-r--r-- khi qua zip, nhưng giữ +x khi qua tar. README ghi điều này trong mục Limitations: file về lại là 644. Phương án v8 trộn một tính năng có thật — kiểm digest — với một việc nó không làm; chủ sở hữu là user của runner, không phải root.",
          },
          {
            question: "Measured on the runner: installing without a cache takes 17.5 s, restoring the cache takes 3.6 s, and saving it on a miss costs 4.9 s. Roughly what hit rate is needed for this cache to pay off?|||Đo trên runner: cài không cache mất 17,5 s, khôi phục cache mất 3,6 s, và lưu nó khi trượt tốn 4,9 s. Cần tỉ lệ trúng khoảng bao nhiêu để cái cache này có lãi?",
            options: [
              "About 80%, because saving costs more than a third of the install|||Khoảng 80%, vì lưu tốn hơn một phần ba lượt cài",
              "Any hit rate above 0%, because restoring is always faster than installing|||Bất kỳ tỉ lệ nào trên 0%, vì khôi phục luôn nhanh hơn cài",
              "About 26%: profit per hit 13.9 s against 4.9 s per miss|||Khoảng 26%: lãi mỗi lần trúng 13,9 s so với 4,9 s mỗi lần trượt",
              "Exactly 50%, since every cache must hit as often as it misses|||Đúng 50%, vì mọi cache đều phải trúng nhiều bằng trượt",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Break-even is h × (17.5 − 3.6) = (1 − h) × 4.9, so h = 4.9 / (13.9 + 4.9) ≈ 0.26. “Any hit rate above 0%” forgets that every miss pays 4.9 s extra in the Post step — a cache with a key that changes every run has h = 0 and only loses. This is the formula of Lesson 5.5, fed with the runner numbers of Lesson 5.1.|||VI: Hoà vốn khi h × (17,5 − 3,6) = (1 − h) × 4,9, nên h = 4,9 / (13,9 + 4,9) ≈ 0,26. “Bất kỳ tỉ lệ nào trên 0%” quên rằng mỗi lần trượt tốn thêm 4,9 s ở bước Post — một cache có khoá đổi mỗi lần chạy có h = 0 và chỉ có lỗ. Đây là công thức của bài 5.5, với số đo trên runner của bài 5.1.",
          },
        ],
      },
    },
  ],
};
