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

<h3>Why <code>actions/cache</code> uses zstd</h3>
<p>The two DIY rows are the same data with different compressors, and the difference is not marginal:</p>

<div class="out">gzip -1   nen 11.040 ms  ->  192 MB
zstd -3   nen  1.727 ms  ->  152 MB
                6,4x nhanh hon, va NHO HON</div>

<div class="callout ok">
<p><strong>Faster and smaller at the same time</strong> — which is unusual enough to be worth noticing, and is the whole reason the cache action switched. It matters in a specific way: compression happens in the <em>post</em> step, after your job&#39;s real work is done, so those nine saved seconds come off the tail of every job that saves a cache.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — caching something that is cheap to recreate.</strong> A cache pays only when restoring is faster than rebuilding, and both sides have to be measured, not assumed. A <code>dist/</code> directory that takes four seconds to build is not worth a cache entry: the save and restore overhead plus the transfer will exceed four seconds, and you have added an invalidation bug surface for a negative return. The rule that follows from the table above: measure the rebuild first, and only cache what is slower than the round trip.</p>
</div>

<h3>Where the time actually goes</h3>
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

<h3>Sources</h3>
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

<h3>Nguồn</h3>
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
<p><strong>A key that never changes gives you a cache that never updates.</strong> This is not a corner case — it is what happens by default if you write <code>key: node-modules</code> and move on. The workflow gets fast, stays fast, and quietly serves the dependency tree from whenever the cache was first written. Lesson 3.4 measured the version of this bug that arrives by accident: a <code>hashFiles()</code> whose glob matches nothing returns an empty string, so <code>my-cache-\${{ hashFiles('typo') }}</code> collapses to the constant <code>my-cache-</code>.</p>
</div>

<h3>The key is a claim about what the content depends on</h3>
<p>This repository&#39;s working cache key, from <code>deploy-ghcr.yml</code>:</p>

<pre><code>key: nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles('frontend/package-lock.json') }}</code></pre>

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

<pre><code>key: nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles('frontend/package-lock.json') }}
restore-keys: |
  nextjs-cache-\${{ runner.os }}-frontend-lock-
  nextjs-cache-\${{ runner.os }}-frontend-</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">exact key hits</span><span class="lz-lnote">the lockfile is unchanged — restore, and do not save. This is the common case</span></div>
<div class="lz-layer"><span class="lz-lname">exact miss, first prefix hits</span><span class="lz-lnote">the lockfile changed. You get the <em>previous</em> lockfile&#39;s cache — for a Next.js build cache that is still most of the value, because most compiled output is unaffected by one dependency bump</span></div>
<div class="lz-layer"><span class="lz-lname">and then it <strong>saves</strong> under the new key</span><span class="lz-lnote">this is the part people miss. A restore-key hit is still a primary-key <em>miss</em>, so the post step writes a new entry. The cache rolls forward on its own</span></div>
<div class="lz-layer"><span class="lz-lname">everything misses</span><span class="lz-lnote">a cold job. Slower, correct, and self-healing on the next run</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>restore-keys</code> on a cache where partial content is wrong.</strong> A build cache tolerates being slightly out of date because the build tool re-checks what it uses. A <code>node_modules</code> cache does not: restoring the previous lockfile&#39;s tree and then <em>not</em> running the install leaves you building against dependency versions your lockfile does not name. The rule: use <code>restore-keys</code> when a stale hit is a speed-up on top of a correct step that still runs, and not when a stale hit <em>replaces</em> that step.</p>
</div>

<h3>The scoping rule that explains "my cache never hits"</h3>
<div class="kv-grid">
<div class="kv"><span class="k">a branch reads its own caches</span><span class="v">plus those of its base branch. A feature branch can restore what <code>main</code> saved</span></div>
<div class="kv"><span class="k">branches cannot read each other</span><span class="v">two feature branches are isolated. A cache warmed on <code>feature/a</code> is invisible to <code>feature/b</code>, which is the usual reason a PR seems to never hit</span></div>
<div class="kv"><span class="k">so warm the default branch</span><span class="v">a scheduled or push-triggered job on <code>main</code> that populates the cache makes every PR benefit. Without it, the first run of every branch is cold</span></div>
<div class="kv"><span class="k">and PR runs write to the PR&#39;s scope</span><span class="v">a cache saved during a <code>pull_request</code> run does not warm <code>main</code>. The direction only goes one way</span></div>
</div>

<h3>Restore without save, and save without restore</h3>
<p>Two variants exist and both solve real problems:</p>

<pre><code><span class="tok-comment"># chi PHUC HOI, khong bao gio luu — cho cac job an theo</span>
- uses: actions/cache/restore@v4
  with: { path: dist, key: build-\${{ github.sha }} }

<span class="tok-comment"># chi LUU — chay o cuoi job dung, du cac buoc truoc co hong</span>
- uses: actions/cache/save@v4
  if: always()
  with: { path: dist, key: build-\${{ github.sha }} }</code></pre>

<div class="callout">
<p><strong>The split is what makes a cache usable as a hand-off between jobs</strong> — one job saves, several restore. It is not a replacement for artifacts: a cache can be evicted at any time and a restore miss must be survivable, whereas an artifact is guaranteed to be there for its retention period. Use the cache when a miss means "slower"; use an artifact when a miss means "broken". 5.4 measures the difference.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> Cache entries are write-once, so the key is the whole design: put a content hash in it so it changes when the content should, put the platform in it so it does not cross architectures, and use <code>restore-keys</code> only where a stale hit is an optimisation rather than an answer.</p>
</div>

<h3>Sources</h3>
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
<p><strong>Một cái khoá không bao giờ đổi cho bạn một cái cache không bao giờ cập nhật.</strong> Đây không phải một ca hiếm — nó là thứ xảy ra MẶC ĐỊNH nếu bạn viết <code>key: node-modules</code> rồi đi tiếp. Workflow nhanh lên, giữ nguyên nhanh, và âm thầm phục vụ cây phụ thuộc từ cái thời điểm cache được ghi lần đầu. Bài 3.4 đã đo phiên bản của lỗi này khi nó tới do TAI NẠN: một <code>hashFiles()</code> mà mẫu glob không khớp gì sẽ trả về chuỗi rỗng, nên <code>my-cache-\${{ hashFiles('go-sai') }}</code> co lại thành hằng số <code>my-cache-</code>.</p>
</div>

<h3>Cái khoá là một LỜI KHẲNG ĐỊNH về việc nội dung phụ thuộc vào cái gì</h3>
<p>Khoá cache đang hoạt động của kho này, lấy từ <code>deploy-ghcr.yml</code>:</p>

<pre><code>key: nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles('frontend/package-lock.json') }}</code></pre>

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

<pre><code>key: nextjs-cache-\${{ runner.os }}-frontend-lock-\${{ hashFiles('frontend/package-lock.json') }}
restore-keys: |
  nextjs-cache-\${{ runner.os }}-frontend-lock-
  nextjs-cache-\${{ runner.os }}-frontend-</code></pre>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">khoá chính xác TRÚNG</span><span class="lz-lnote">tệp khoá không đổi — phục hồi, và KHÔNG lưu. Đây là ca thường gặp</span></div>
<div class="lz-layer"><span class="lz-lname">trượt chính xác, tiền tố đầu trúng</span><span class="lz-lnote">tệp khoá đã đổi. Bạn nhận cache của tệp khoá <em>TRƯỚC ĐÓ</em> — với một cache dựng của Next.js thì đó vẫn là phần lớn giá trị, vì đa số đầu ra biên dịch không bị ảnh hưởng bởi một lần nâng cấp phụ thuộc</span></div>
<div class="lz-layer"><span class="lz-lname">và rồi nó <strong>LƯU</strong> dưới khoá mới</span><span class="lz-lnote">đây là phần người ta bỏ sót. Trúng một restore-key vẫn là TRƯỢT khoá chính, nên bước post ghi ra một mục mới. Cái cache tự lăn về phía trước</span></div>
<div class="lz-layer"><span class="lz-lname">trượt hết</span><span class="lz-lnote">một job lạnh. Chậm hơn, đúng đắn, và tự chữa ở lần chạy kế</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — <code>restore-keys</code> trên một cái cache mà nội dung một-phần là SAI.</strong> Một cache dựng thì chịu được chuyện hơi cũ, bởi công cụ dựng sẽ tự kiểm lại thứ nó dùng. Một cache <code>node_modules</code> thì KHÔNG: phục hồi cây của tệp khoá cũ rồi <em>KHÔNG</em> chạy bước cài là bạn đang dựng trên những phiên bản phụ thuộc mà tệp khoá của bạn không hề nêu tên. Quy tắc: dùng <code>restore-keys</code> khi một lần trúng cũ là một khoản TĂNG TỐC nằm trên một bước đúng đắn VẪN CHẠY, và không dùng khi một lần trúng cũ THAY THẾ bước ấy.</p>
</div>

<h3>Luật khoanh vùng giải thích câu "cache của tôi không bao giờ trúng"</h3>
<div class="kv-grid">
<div class="kv"><span class="k">một nhánh đọc cache của chính nó</span><span class="v">cộng với cache của nhánh GỐC của nó. Một nhánh tính năng phục hồi được thứ <code>main</code> đã lưu</span></div>
<div class="kv"><span class="k">các nhánh KHÔNG đọc được của nhau</span><span class="v">hai nhánh tính năng bị cách ly. Một cache đã hâm nóng trên <code>feature/a</code> thì <code>feature/b</code> không nhìn thấy, và đó là lý do thường gặp khiến một PR có vẻ không bao giờ trúng</span></div>
<div class="kv"><span class="k">nên hãy hâm nóng nhánh MẶC ĐỊNH</span><span class="v">một job theo lịch hay theo push trên <code>main</code> đi nạp cache sẽ khiến MỌI PR được hưởng. Không có nó thì lần chạy đầu của mọi nhánh đều lạnh</span></div>
<div class="kv"><span class="k">và lần chạy PR ghi vào phạm vi CỦA PR</span><span class="v">một cache lưu trong một lần chạy <code>pull_request</code> KHÔNG hâm nóng <code>main</code>. Chiều đi chỉ có một</span></div>
</div>

<h3>Phục hồi mà không lưu, và lưu mà không phục hồi</h3>
<p>Có hai biến thể và cả hai giải quyết vấn đề thật:</p>

<pre><code><span class="tok-comment"># chi PHUC HOI, khong bao gio luu — cho cac job an theo</span>
- uses: actions/cache/restore@v4
  with: { path: dist, key: build-\${{ github.sha }} }

<span class="tok-comment"># chi LUU — chay o cuoi job dung, du cac buoc truoc co hong</span>
- uses: actions/cache/save@v4
  if: always()
  with: { path: dist, key: build-\${{ github.sha }} }</code></pre>

<div class="callout">
<p><strong>Chỗ tách ấy là thứ khiến một cache dùng được như một lượt bàn giao giữa các job</strong> — một job lưu, nhiều job phục hồi. Nó KHÔNG thay thế được artifact: một cache bị thu hồi lúc nào cũng được và một lần trượt phục hồi phải SỐNG SÓT ĐƯỢC, trong khi một artifact thì được bảo đảm có mặt suốt thời hạn giữ của nó. Dùng cache khi một lần trượt nghĩa là "chậm hơn"; dùng artifact khi một lần trượt nghĩa là "hỏng". Bài 5.4 đo chỗ khác biệt ấy.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Mục cache là ghi-một-lần, nên CÁI KHOÁ chính là toàn bộ thiết kế: đặt một hash nội dung vào để nó đổi khi nội dung đáng đổi, đặt nền tảng vào để nó không vượt kiến trúc, và chỉ dùng <code>restore-keys</code> ở chỗ mà một lần trúng cũ là một phép tối ưu chứ không phải một câu trả lời.</p>
</div>

<h3>Nguồn</h3>
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
<p>From the cleanup phase of job 85355071479:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>Two <code>actions/cache</code> steps ran in that job. The other one printed a hit. So one of the two has a <code>path:</code> that does not exist — and the workflow says which:</p>

<pre><code>- name: Restore backend build cache
  uses: actions/cache@v4
  with:
    path: |
      node_modules/.cache          <span class="tok-comment"># &lt;- day</span>
    key: backend-cache-\${{ runner.os }}-lock-\${{ hashFiles('package-lock.json') }}
    restore-keys: |
      backend-cache-\${{ runner.os }}-lock-</code></pre>

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

<h3>Auditing your own</h3>
<p>Every <code>actions/cache</code> step prints exactly one of three things in the log, and reading them is the entire audit:</p>

<div class="out">Cache hit occurred on the primary key &lt;key&gt;, not saving cache.
        -> DANG CHAY. Khoa on dinh, noi dung khong doi

Cache not found for input keys: &lt;key&gt;, &lt;restore-key&gt;
        -> TRUOT. Binh thuong o lan dau; DANG NGO neu no lap lai moi lan

[warning]Path Validation Error: ... do(es) not exist
        -> CHET. Chua bao gio luu duoc gi, va se khong bao gio</div>

<div class="pitfall">
<p><strong>Bẫy — the miss that repeats every run, which looks like nothing at all.</strong> The dead cache at least prints a warning. A cache whose key changes on every run — because it contains <code>github.sha</code>, or a timestamp, or a <code>hashFiles</code> over a generated file — prints a perfectly ordinary "Cache not found" every time, saves a new entry every time, and is <em>worse</em> than having no cache: you pay the upload and never collect. The tell is that the "not found" line never becomes a "hit" line, over many runs.</p>
</div>

<div class="callout ok">
<p><strong>The three-run rule.</strong> After adding or changing a cache, look at the log of three consecutive runs on the same branch. Run one should miss and save. Runs two and three should hit. Any other pattern is a bug, and it is a bug you can see in ten seconds — which is the only reason dead caches are worth talking about at all, since nothing else will ever tell you.</p>
</div>

<h3>Why this survived</h3>
<p>The step was added in a commit that also added the frontend cache, which works. Both were plausible, one was right, and the reviewer had no way to tell them apart by reading — the difference is not in the YAML, it is in whether a directory exists at run time. It printed a warning on every run for months, in a log nobody opens when the job is green.</p>

<div class="callout">
<p><strong>That is the general shape of this class of bug.</strong> Optimisations fail silently by construction: the workflow still produces the right answer, just without the speed-up. Correctness bugs announce themselves; performance bugs have to be measured. It is the same argument as lesson 1.5&#39;s missing job and lesson 4.4&#39;s opaque key — the things that do not work are invisible until somebody goes looking with a number in mind.</p>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A cache step can be entirely correct except for pointing at a path that never exists, and the only signal is one warning line in a green job — so audit by reading three runs&#39; logs, not by reading the YAML.</p>
</div>

<h3>Sources</h3>
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
<p>Từ pha dọn dẹp của job 85355071479:</p>

<div class="out">[warning]Path Validation Error: Path(s) specified in the action for caching
         do(es) not exist, hence no cache is being saved.</div>

<p>Có hai bước <code>actions/cache</code> chạy trong job ấy. Cái kia in ra một lần trúng. Vậy một trong hai có <code>path:</code> không tồn tại — và workflow nói rõ là cái nào:</p>

<pre><code>- name: Restore backend build cache
  uses: actions/cache@v4
  with:
    path: |
      node_modules/.cache          <span class="tok-comment"># &lt;- day</span>
    key: backend-cache-\${{ runner.os }}-lock-\${{ hashFiles('package-lock.json') }}
    restore-keys: |
      backend-cache-\${{ runner.os }}-lock-</code></pre>

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

<h3>Vì sao nó sống sót</h3>
<p>Bước ấy được thêm trong một commit cũng thêm luôn cái cache frontend, và cái đó CHẠY. Cả hai đều hợp lý, một cái đúng, và người review không có cách nào phân biệt chúng bằng cách ĐỌC — khác biệt không nằm trong YAML, nó nằm ở chuyện một thư mục có tồn tại lúc chạy hay không. Nó in một cảnh báo ở mọi lần chạy suốt nhiều tháng, trong một cái log mà không ai mở khi job đang xanh.</p>

<div class="callout">
<p><strong>Đó là hình dạng chung của lớp lỗi này.</strong> Các phép tối ưu hỏng ÂM THẦM theo cấu tạo: workflow vẫn cho ra đáp án đúng, chỉ là không có phần tăng tốc. Lỗi ĐÚNG-SAI thì tự nó lên tiếng; lỗi HIỆU NĂNG thì phải đem ĐO. Vẫn là lập luận của cái job vắng mặt ở bài 1.5 và cái khoá đục ở bài 4.4 — những thứ không hoạt động thì vô hình cho tới khi có người đi tìm với một con số trong đầu.</p>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một bước cache có thể hoàn toàn đúng trừ chuyện trỏ vào một đường dẫn không bao giờ tồn tại, và tín hiệu duy nhất là một dòng cảnh báo trong một job đang xanh — nên hãy soát bằng cách ĐỌC LOG BA LẦN CHẠY, đừng soát bằng cách đọc YAML.</p>
</div>

<h3>Nguồn</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">a deliverable. Guaranteed present for its retention period, listed on the run page, downloadable by a human. A missing artifact means <strong>broken</strong></span></div>
<div class="kv"><span class="k">cache</span><span class="v">an optimisation. Can be evicted at any moment, invisible in the run UI, keyed rather than named. A missing cache means <strong>slower</strong></span></div>
<div class="kv"><span class="k">the test</span><span class="v">if a miss would break the workflow, it is an artifact. If a miss would merely cost time, it is a cache. Using one for the other is the most common structural mistake here</span></div>
<div class="kv"><span class="k">immutable since v4</span><span class="v">an artifact name can be written once per run. The old "several matrix legs append to one artifact" pattern fails outright — which is why this repository names its artifacts <code>ban-cai-\${{ matrix.ten }}</code>, one per leg</span></div>
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

<h3>The runner numbers, for scale</h3>
<p>From run 32662461744, uploading the same installer on three platforms:</p>

<div class="out">tai artifact len:   Linux 8s  ·  Windows 6s  ·  macOS 27s
tai ca ba ve (job cong bo):  12s</div>

<div class="callout">
<p><strong>macOS is 3.4× Windows for the same output</strong> — consistent with 2.3&#39;s finding that macOS is weak at network upload specifically. And note the download: twelve seconds for all three together, less than macOS spent uploading one. Downloads are cheap; the upload is where artifact cost lives, which is the opposite of most people&#39;s intuition.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — uploading a directory tree when you meant to upload a deliverable.</strong> <code>path: dist/</code> on a 40,000-file tree is the measurement above, at scale, on every run. If what the next job needs is one installer or one bundle, <code>tar</code> it first and upload the tarball: one file, one compression pass, and the measured 2.3–2.9× disappears. The exception is when a human needs to browse the artifact in the UI — then the file listing is the point, and the cost is what you are paying for.</p>
</div>

<h3>Retention, and what it costs</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">default 90 days</span><span class="lz-lnote">settable per artifact with <code>retention-days:</code>, or repository-wide. Ninety days of every build of every PR adds up quietly, and artifacts count against repository storage</span></div>
<div class="lz-layer"><span class="lz-lname">a sensible split</span><span class="lz-lnote">release artifacts long, PR artifacts short. A test report from a PR that merged three weeks ago is not evidence anybody will look at — <code>retention-days: 5</code> on those and 90 on releases costs nothing and stops the growth</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code> on the upload</span><span class="lz-lnote">this repository does it, and 3.5 argued it is the legitimate use: when the build fails, the partial output and the logs are exactly what you want to look at, and a step with the implicit <code>success()</code> would skip</span></div>
<div class="lz-layer"><span class="lz-lname">and it is not a cache</span><span class="lz-lnote">artifacts are per-run. A later run cannot restore a previous run&#39;s artifact by name from inside a workflow without going through the API — which is a signal that you wanted a cache</span></div>
</div>

<h3>The pattern this repository uses</h3>
<pre><code><span class="tok-comment"># moi nhanh ma tran tai len duoi TEN RIENG</span>
- name: Luu ban cai lam artifact
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: ban-cai-\${{ matrix.ten }}      <span class="tok-comment"># ban-cai-macOS, -Windows, -Linux</span>
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

<h3>Sources</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k">artifact</span><span class="v">một SẢN PHẨM BÀN GIAO. Được bảo đảm có mặt suốt thời hạn giữ, liệt kê trên trang lần chạy, con người tải về được. Thiếu một artifact nghĩa là <strong>HỎNG</strong></span></div>
<div class="kv"><span class="k">cache</span><span class="v">một PHÉP TỐI ƯU. Bị thu hồi lúc nào cũng được, vô hình trên giao diện lần chạy, định danh bằng khoá chứ không bằng tên. Thiếu một cache nghĩa là <strong>CHẬM HƠN</strong></span></div>
<div class="kv"><span class="k">phép thử</span><span class="v">nếu một lần trượt làm VỠ workflow thì nó là artifact. Nếu một lần trượt chỉ tốn thời gian thì nó là cache. Dùng cái này thay cái kia là sai lầm cấu trúc phổ biến nhất ở đây</span></div>
<div class="kv"><span class="k">bất biến từ v4</span><span class="v">một tên artifact chỉ ghi được MỘT lần trong mỗi lần chạy. Khuôn mẫu cũ "nhiều nhánh ma trận cùng nối thêm vào một artifact" hỏng thẳng — và đó là lý do kho này đặt tên artifact là <code>ban-cai-\${{ matrix.ten }}</code>, mỗi nhánh một cái</span></div>
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

<h3>Thời hạn giữ, và nó tốn gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">mặc định 90 ngày</span><span class="lz-lnote">đặt được theo từng artifact bằng <code>retention-days:</code>, hoặc theo cả kho. Chín mươi ngày của mọi bản dựng của mọi PR cộng dồn một cách âm thầm, và artifact tính vào dung lượng lưu trữ của kho</span></div>
<div class="lz-layer"><span class="lz-lname">một cách chia hợp lý</span><span class="lz-lnote">artifact phát hành thì giữ lâu, artifact PR thì giữ ngắn. Một báo cáo test từ một PR gộp ba tuần trước không phải bằng chứng ai sẽ đi xem — <code>retention-days: 5</code> cho mấy cái đó và 90 cho bản phát hành thì không tốn gì mà chặn được đà phình</span></div>
<div class="lz-layer"><span class="lz-lname"><code>if: always()</code> trên lượt tải lên</span><span class="lz-lnote">kho này có làm, và bài 3.5 đã lập luận rằng đó là cách dùng chính đáng: khi bản dựng hỏng thì phần đầu ra dở dang và log lại ĐÚNG là thứ bạn muốn xem, mà một bước với <code>success()</code> ngầm định sẽ bỏ qua</span></div>
<div class="lz-layer"><span class="lz-lname">và nó KHÔNG phải một cache</span><span class="lz-lnote">artifact là theo từng lần chạy. Một lần chạy sau không phục hồi được artifact của lần chạy trước theo tên từ bên trong workflow mà không đi qua API — và đó là tín hiệu rằng thứ bạn muốn là một cái CACHE</span></div>
</div>

<h3>Khuôn mẫu kho này dùng</h3>
<pre><code><span class="tok-comment"># moi nhanh ma tran tai len duoi TEN RIENG</span>
- name: Luu ban cai lam artifact
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: ban-cai-\${{ matrix.ten }}      <span class="tok-comment"># ban-cai-macOS, -Windows, -Linux</span>
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

<h3>Nguồn</h3>
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

<h3>The decision table</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k">10 GB per repository</span><span class="v">when exceeded, GitHub evicts least-recently-used entries until it fits. So a large cache does not fail — it quietly pushes out everybody else&#39;s, including the one you actually rely on</span></div>
<div class="kv"><span class="k">7 days unused</span><span class="v">an entry not accessed for a week is removed. A workflow that runs monthly effectively never has a cache, no matter how well its key is designed</span></div>
<div class="kv"><span class="k">branch scoping</span><span class="v">from 5.2 — branches read their own and their base&#39;s caches, never each other&#39;s. Combined with the 7-day rule, a quiet repository&#39;s PR builds are usually cold</span></div>
<div class="kv"><span class="k">no per-entry size cap worth planning around</span><span class="v">the ceiling is the repository total. The practical limit is the transfer time, which is the model above rather than a policy</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — the large cache that evicts the useful ones.</strong> A 4 GB <code>node_modules</code> cache saved per branch will, on a repository with a few active branches, fill the 10 GB allowance by itself and evict the small, frequently-hit caches that were doing the real work. The symptom is that the <em>other</em> workflows get slower after somebody optimises one — and nothing in any log connects the two. If cache hit rates fall for no reason, look at what was recently added, not at what got slower.</p>
</div>

<h3>Reading whether it is working, at repository level</h3>
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
<div class="kv"><span class="k">caching <code>node_modules</code> as well</span><span class="v">the 4.1-second row. Not recommended without measuring the transfer, and the transfer is the part nobody measures</span></div>
</div>

<div class="callout ok">
<p><strong>The one sentence.</strong> A cache is worth having when the rebuild it replaces is slower than compressing, transferring and decompressing it — which for this repository is true of the package download and not obviously true of anything else.</p>
</div>

<h3>Sources</h3>
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

<h3>Bảng quyết định</h3>
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
<div class="kv-grid">
<div class="kv"><span class="k">10 GB cho mỗi kho</span><span class="v">khi vượt, GitHub thu hồi các mục ÍT DÙNG NHẤT cho tới khi vừa. Nên một cái cache lớn KHÔNG hỏng — nó âm thầm đẩy mọi cái khác ra ngoài, kể cả cái bạn thật sự đang dựa vào</span></div>
<div class="kv"><span class="k">7 ngày không dùng</span><span class="v">một mục không được chạm tới suốt một tuần thì bị gỡ. Một workflow chạy hằng tháng thì thực tế KHÔNG BAO GIỜ có cache, dù khoá của nó thiết kế khéo tới đâu</span></div>
<div class="kv"><span class="k">khoanh vùng theo nhánh</span><span class="v">từ bài 5.2 — các nhánh đọc cache của chính nó và của nhánh gốc, không bao giờ đọc của nhau. Ghép với luật 7 ngày, các bản dựng PR của một kho im ắng thường LẠNH</span></div>
<div class="kv"><span class="k">không có trần dung lượng từng mục đáng phải tính</span><span class="v">cái trần là TỔNG của kho. Giới hạn thực dụng là THỜI GIAN TRUYỀN, tức là cái mô hình bên trên chứ không phải một chính sách</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — cái cache LỚN đẩy mất những cái hữu ích.</strong> Một cache <code>node_modules</code> 4 GB lưu theo từng nhánh sẽ, ở một kho có vài nhánh đang hoạt động, tự nó lấp đầy hạn mức 10 GB và thu hồi mất những cache nhỏ, trúng thường xuyên, vốn đang làm phần việc thật. Triệu chứng là những workflow <em>KHÁC</em> chậm đi sau khi có người tối ưu MỘT cái — và không có gì trong bất kỳ log nào nối hai chuyện ấy lại. Nếu tỉ lệ trúng cache tụt mà không rõ lý do, hãy nhìn vào thứ MỚI ĐƯỢC THÊM, đừng nhìn vào thứ chậm đi.</p>
</div>

<h3>Đọc xem nó có chạy không, ở mức cả kho</h3>
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
<div class="kv"><span class="k">cache thêm cả <code>node_modules</code></span><span class="v">chính là hàng 4,1 giây. Không khuyến nghị nếu chưa đo phần truyền, mà phần truyền lại là phần không ai đo</span></div>
</div>

<div class="callout ok">
<p><strong>Một câu.</strong> Một cái cache đáng có khi lượt dựng lại mà nó thay thế CHẬM HƠN việc nén, truyền và giải nén nó — điều mà ở kho này đúng với lượt tải gói và không hiển nhiên đúng với thứ gì khác.</p>
</div>

<h3>Nguồn</h3>
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
      description: 'Tám câu: `cache: npm` cắt 40%, mục cache ghi-một-lần, cái cache chết trong kho này, và con số artifact phải đo hai lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>What Chapter 5 measured</h2>
<p class="lead">Eight questions, twelve minutes. Two of this chapter&#39;s numbers came from measuring twice: the artifact ratio, whose first version measured the test rig, and the <code>node_modules</code> cache, whose saving is smaller than its transfer.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">5.1 — what a cache buys</span><span class="lz-lnote"><code>npm ci</code> 31.4 s cold, 18.8 s warm — the one-line built-in is worth 40%, and it does not remove the install</span></div>
<div class="lz-layer"><span class="lz-lname">5.2 — keys</span><span class="lz-lnote">entries are write-once, so a constant key freezes on run one; <code>restore-keys</code> gives partial credit and then saves under the new key</span></div>
<div class="lz-layer"><span class="lz-lname">5.3 — the dead cache</span><span class="lz-lnote">one step in this repository has never saved a byte; three checks confirmed <code>tsc</code> writes no cache at all</span></div>
<div class="lz-layer"><span class="lz-lname">5.4 — artifacts</span><span class="lz-lnote">identical bytes, 5,000 files against one: 2.3× to pack and 2.9× to unpack — after the first measurement&#39;s 64× turned out to be an artefact of identical content</span></div>
<div class="lz-layer"><span class="lz-lname">5.5 — break-even</span><span class="lz-lnote">4.1 seconds saved against 1.5–6.1 seconds of transfer: an optimisation whose sign you cannot predict</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Chương 5 đã đo được gì</h2>
<p class="lead">Tám câu, mười hai phút. Hai con số của chương này tới từ việc đo HAI LẦN: tỉ lệ artifact, mà bản đầu đo trúng cái bộ đồ nghề, và cache <code>node_modules</code>, mà khoản tiết kiệm nhỏ hơn phần truyền của nó.</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">5.1 — cache mua được gì</span><span class="lz-lnote"><code>npm ci</code> 31,4 s lạnh, 18,8 s ấm — cái dựng sẵn một dòng đáng 40%, và nó KHÔNG gỡ bỏ được bước cài</span></div>
<div class="lz-layer"><span class="lz-lname">5.2 — khoá</span><span class="lz-lnote">mục cache là ghi-một-lần, nên một khoá hằng đông cứng ở lần chạy một; <code>restore-keys</code> cho điểm an ủi rồi lưu dưới khoá mới</span></div>
<div class="lz-layer"><span class="lz-lname">5.3 — cái cache chết</span><span class="lz-lnote">một bước trong kho này chưa từng lưu được một byte; ba phép kiểm xác nhận <code>tsc</code> không ghi cache ở đâu cả</span></div>
<div class="lz-layer"><span class="lz-lname">5.4 — artifact</span><span class="lz-lnote">cùng số byte, 5.000 file so với một: 2,3× khi gói và 2,9× khi mở — sau khi con số 64× của lượt đo đầu hoá ra là sản phẩm của nội dung giống hệt nhau</span></div>
<div class="lz-layer"><span class="lz-lname">5.5 — hoà vốn</span><span class="lz-lnote">4,1 giây tiết kiệm so với 1,5–6,1 giây truyền: một phép tối ưu mà bạn không đoán trước được DẤU của nó</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Measured on this repository&#39;s lockfile: npm ci takes 31.4 s with a cold ~/.npm and 18.8 s with a warm one. What does that tell you about `cache: \'npm\'`?|||Đo trên tệp khoá của kho này: npm ci mất 31,4 s với ~/.npm lạnh và 18,8 s với ~/.npm ấm. Điều đó cho bạn biết gì về `cache: \'npm\'`?',
            options: [
              'It is worth 40% of the install and does not remove it — 18.8 s still go into rebuilding 38,909 files; only the network fetch is skipped|||Nó đáng 40% của bước cài và KHÔNG gỡ bỏ được bước ấy — 18,8 s vẫn đổ vào việc dựng lại 38.909 file; chỉ lượt tải qua mạng bị bỏ qua',
              'It removes the install step entirely on a cache hit|||Nó gỡ bỏ hoàn toàn bước cài khi trúng cache',
              'It caches node_modules, so nothing needs rebuilding|||Nó cache node_modules nên không có gì cần dựng lại',
              'It has no measurable effect; the two numbers are within noise|||Nó không có tác dụng đo được nào; hai con số nằm trong tiếng ồn',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A workflow uses `key: node-modules` with no hash. What happens over many runs?|||Một workflow dùng `key: node-modules` mà không có hash nào. Chuyện gì xảy ra qua nhiều lần chạy?',
            options: [
              'The first run saves and every run after that restores the same entry forever — cache entries cannot be overwritten, so a constant key freezes on run one|||Lần chạy đầu lưu và mọi lần sau phục hồi đúng mục ấy mãi mãi — mục cache KHÔNG ghi đè được, nên một khoá hằng đông cứng ở lần chạy một',
              'Each run overwrites the entry, so the cache stays current|||Mỗi lần chạy ghi đè lên mục ấy, nên cache luôn mới',
              'GitHub rejects a key with no expression in it|||GitHub từ chối một khoá không có biểu thức nào trong đó',
              'The cache is evicted after every run because the key is not unique|||Cache bị thu hồi sau mỗi lần chạy vì khoá không duy nhất',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A cache step&#39;s exact key misses but a restore-key prefix hits. What does the post step do?|||Khoá chính xác của một bước cache trượt nhưng một tiền tố restore-key thì trúng. Bước post làm gì?',
            options: [
              'Saves a new entry under the new primary key — a restore-key hit is still a primary-key miss, which is how the cache rolls forward on its own|||LƯU một mục mới dưới khoá chính mới — trúng một restore-key vẫn là TRƯỢT khoá chính, và đó là cách cái cache tự lăn về phía trước',
              'Nothing — a restore-key hit counts as a hit, so no save happens|||Không gì cả — trúng restore-key được tính là trúng, nên không có lượt lưu nào',
              'Overwrites the entry the restore-key matched|||Ghi đè lên cái mục mà restore-key vừa khớp',
              'Deletes the stale entry so the next run misses cleanly|||Xoá mục cũ đi để lần chạy sau trượt cho sạch',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A log line reads "Path Validation Error: Path(s) specified in the action for caching do(es) not exist". What has been true of that cache step?|||Một dòng log ghi "Path Validation Error: Path(s) specified in the action for caching do(es) not exist". Điều gì đã đúng với bước cache đó?',
            options: [
              'It has never saved anything and never will — its key and restore-keys are fine, the path simply does not exist|||Nó chưa bao giờ lưu được gì và sẽ không bao giờ — khoá và restore-keys của nó thì ổn, chỉ mỗi đường dẫn là không tồn tại',
              'It failed once because of a transient storage error|||Nó hỏng một lần vì một lỗi lưu trữ nhất thời',
              'It saved but could not restore, so the next run will be cold|||Nó lưu được nhưng không phục hồi được, nên lần chạy sau sẽ lạnh',
              'The cache exceeded the 10 GB repository ceiling and was evicted|||Cache vượt trần 10 GB của kho và bị thu hồi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The first artifact measurement gave 64× and was not published as-is. Why not?|||Phép đo artifact đầu tiên ra 64 lần và đã không được công bố nguyên như thế. Vì sao?',
            options: [
              'The 5,000 files were identical copies, so the concatenated version compressed almost perfectly — an upper bound produced by the test data, not by the phenomenon|||5.000 file kia là những bản chép giống hệt nhau, nên bản gộp nén được gần như hoàn hảo — một trần trên do DỮ LIỆU THỬ đẻ ra, không phải do hiện tượng',
              'The measurement used the wrong compression tool|||Phép đo dùng nhầm công cụ nén',
              'The two sides had different total byte counts|||Hai phía có tổng số byte khác nhau',
              'It was measured on local disk rather than on a runner|||Nó được đo trên đĩa cục bộ chứ không trên một runner',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'With realistic partially-similar content and identical total bytes, how much worse is uploading 5,000 files than one file?|||Với nội dung giống-một-phần thực tế và tổng byte bằng nhau, tải lên 5.000 file tệ hơn tải lên một file bao nhiêu?',
            options: [
              '2.3× to pack, 2.9× to unpack, and 24% larger — because zip compresses each entry independently|||2,3× khi gói, 2,9× khi mở, và lớn hơn 24% — vì zip nén từng mục một cách độc lập',
              'Identical — the total byte count is what determines cost|||Y hệt — tổng số byte mới là thứ quyết định chi phí',
              '64× larger, as the first measurement showed|||Lớn hơn 64 lần, như phép đo đầu tiên đã cho thấy',
              'Faster, because many small files compress in parallel|||NHANH HƠN, vì nhiều file nhỏ được nén song song',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which of these should be an artifact rather than a cache?|||Thứ nào trong số này nên là một artifact chứ không phải một cache?',
            options: [
              'An installer that the publish job must have — a miss would break the release, not just slow it down|||Một bản cài mà job công bố BẮT BUỘC phải có — một lần trượt sẽ làm VỠ bản phát hành chứ không chỉ làm nó chậm đi',
              'The npm download directory, because it is large|||Thư mục tải về của npm, vì nó lớn',
              'Anything over 100 MB, regardless of what it is for|||Bất cứ thứ gì trên 100 MB, bất kể nó dùng để làm gì',
              'Whatever the previous job produced, since caches cannot cross jobs|||Bất cứ thứ gì job trước tạo ra, vì cache không vượt được giữa các job',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Caching node_modules on top of `cache: npm` saves 4.1 s of compute and costs 1.5–6.1 s of transfer. What is the honest conclusion?|||Cache node_modules chồng lên `cache: npm` tiết kiệm 4,1 s tính toán và tốn 1,5–6,1 s truyền. Kết luận trung thực là gì?',
            options: [
              'Its sign is unpredictable — depending on bandwidth it is worth somewhere between +3 seconds and −2, so it is a change to measure rather than an improvement to assume|||DẤU của nó không đoán được — tuỳ băng thông, nó đáng đâu đó giữa +3 giây và −2, nên đó là một thay đổi cần ĐO chứ không phải một cải thiện để mặc định',
              'It is always worth it, since 4.1 s is a real saving|||Luôn đáng, vì 4,1 s là một khoản tiết kiệm thật',
              'It is never worth it under any circumstances|||Không bao giờ đáng, trong bất kỳ hoàn cảnh nào',
              'The transfer is free because the cache service is inside GitHub|||Phần truyền là miễn phí vì dịch vụ cache nằm bên trong GitHub',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
