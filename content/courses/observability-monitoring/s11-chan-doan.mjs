/**
 * Observability — Chương 11 — Chẩn đoán: từ cảnh báo tới nguyên nhân.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${; < > → &lt; &gt;.
 */
const REF = '?ref=%2Fcourses%2Fobservability-monitoring%2Flearn&reflabel=Observability';

export default {
  title: 'Chapter 11 — Diagnosis: from alert to cause|||Chương 11 — Chẩn đoán: từ cảnh báo tới nguyên nhân',
  slug: 'obs-ch11-chan-doan',
  description: 'Năm phút đầu, bảy hình dạng hỏng hóc, đọc một sự cố thật của kho này, biên bản không đổ lỗi.',
  sortOrder: 12,
  lessons: [
    {
      title: '11.1 — The first five minutes|||11.1 — Năm phút đầu tiên',
      slug: 'obs-11-1-nam-phut-dau',
      type: 'VIDEO',
      description: 'Một quy trình cố định cho năm phút đầu, vì năm phút đầu là lúc bạn suy nghĩ tệ nhất.',
      isFreePreview: true,
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>The first five minutes</h2>
<p class="lead">Everything in this course exists for this moment. And the moment has a property nobody plans for: your reasoning is measurably worse during it. Adrenaline narrows attention, you jump to the most recent thing you touched, and you start typing before you have read anything. The defence is a checklist you wrote when you were calm.</p>

<h3>Why a fixed procedure beats judgement here</h3>
<pre><code>What actually happens without one:

  0:00  page fires
  0:10  "I deployed an hour ago" → open the diff
  2:00  read the diff, find nothing conclusive
  3:00  "maybe roll it back?" → start a rollback
  6:00  rollback done, still broken
  7:00  now start looking at data, having spent seven
        minutes and changed the system underneath yourself

The rollback was not unreasonable. It was just untested
against any evidence, and now you cannot tell whether the
current state is the original failure or something the
rollback caused.

The rule that prevents most of this: DO NOT CHANGE ANYTHING
IN THE FIRST FIVE MINUTES. Read first. Changes made before
you understand the failure make the failure harder to
understand.</code></pre>

<h3>The five minutes, as a sequence</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">0:00–0:30 · Is it real, and how big?</span><span class="lz-lnote">Open the 3am dashboard (lesson 10.1). Four numbers. Is the external check failing? Is the error rate a percentage or a fraction of one? This decides whether you are in an incident at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">0:30–1:00 · Is it us?</span><span class="lz-lnote">One curl from outside (lesson 8.5's layered command). It separates &quot;our app is broken&quot; from DNS, TLS, nginx and Cloudflare in one second, and those are four completely different investigations.</span></div>
  <div class="lz-layer"><span class="lz-lname">1:00–2:00 · When did it start, exactly?</span><span class="lz-lnote">Zoom the investigation dashboard until the transition is visible. A precise start time is the single most valuable fact you can get, because it converts &quot;what is wrong&quot; into &quot;what happened at 14:03&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">2:00–3:00 · What changed at that time?</span><span class="lz-lnote">Deploy annotations (lesson 10.2). A cron schedule. A dependency's status page. Most incidents have a change within minutes of the start time, and finding it now saves the next twenty minutes.</span></div>
  <div class="lz-layer"><span class="lz-lname">3:00–5:00 · Which layer?</span><span class="lz-lnote">Read the investigation dashboard top to bottom (lesson 10.1). Row 1 symptoms, row 2 this process, row 3 dependencies, row 4 context. Stop at the first row that is abnormal — that is your layer.</span></div>
</div>

<h3>The four questions, as commands you can paste</h3>
<pre><code class="language-bash"># 1. Is it us, or the network in front of us? (lesson 8.5)
curl -sS -o /dev/null -w \\
  'dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} \\
   ttfb:%{time_starttransfer} code:%{http_code}\\n' \\
  https://cuongthai.com/api/v1/courses

# 2. Is the app even mounted, or is this a stale build? (lesson 8.4)
curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com/api/v1/notes
#   401 = mounted   200 = mounted   404 = STALE BUILD

# 3. Is the process alive and unwedged? (lesson 8.2)
curl -s https://cuongthai.com/health/live
curl -s https://cuongthai.com/health          # this one checks Postgres

# 4. Is it restarting? (lesson 5.5)
#    uptime resetting every 30-45s is the liveness-probe loop
#    from lesson 8.2, and it looks like a database outage
docker ps --format '{{.Names}}\\t{{.Status}}'</code></pre>

<h3>What each answer eliminates</h3>
<pre><code>curl fails at TLS        → certificate. Not your code.
                           Layers 1-4 (lesson 8.5).

curl returns 404         → stale build. Not your logic.
                           Redeploy properly (lesson 8.4).

curl returns 502         → nginx reached, backend did not
                           answer. Container down, wedged,
                           or a timeout (lesson 3.5).

/health/live OK but      → Postgres. The app is fine and
/health 503                waiting on its dependency.

uptime keeps resetting   → restart loop. Read lesson 8.2
                           BEFORE assuming the database
                           is the problem — the restart may
                           be causing the database problem.

all four fine, users     → it is in the application. Now
still report errors        the dashboard rows 1-4, then
                           the trace, then the log.</code></pre>
<p>Four commands, under a minute, and each one removes an entire category. That is worth more than any single graph, because it tells you which of the previous ten chapters you are about to need.</p>

<h3>Write it down while it is happening</h3>
<pre><code>Keep a running note from minute zero. Not for the report —
for yourself, ten minutes from now.

  14:03  page: burn rate 14.4x
  14:04  external curl OK, 200. so not DNS/TLS/nginx
  14:05  err rate 3%, p99 4s. p50 normal at 15ms
  14:06  no deploy since 09:12. not us.
  14:07  event loop normal, memory normal, pool NOT waiting
  14:08  → so not this process, not the pool
  14:09  exemplar → trace: 3889ms in POST modelapi.vn

Why this matters more than it sounds:

  · You WILL forget what you already ruled out, and you
    will re-check it. The note is what stops the loop.
  · Timestamps make the post-incident write-up (lesson
    11.4) a copy-paste instead of a reconstruction.
  · If someone else joins, this note is the handover.
  · Writing "so not X" forces you to state the inference,
    which is when you notice the inferences that do not
    actually follow.</code></pre>

<h3>The two things to do before investigating further</h3>
<pre><code>Once you know the layer, and BEFORE you go deeper:

  1. STOP THE BLEEDING if you can do it safely.
     Roll back a deploy that correlates. Disable the
     feature. Shed load. Mitigation and diagnosis are
     different activities, and mitigation comes first —
     but only when you have a specific reason, not as
     a reflex in minute one.

  2. SAY SOMETHING. Even alone, write the status
     somewhere with a timestamp. Users tolerate an
     outage far better than silence, and for a
     one-person project the status is also what
     stops you from being asked while you work.</code></pre>

<div class="pitfall">
<p><strong>Trap — the first thing you check is whatever you most recently touched, and that bias is strongest exactly when it is least reliable.</strong> You deployed two hours ago, so you open the diff — and a diff always contains something that <em>could</em> plausibly be the cause, which is enough to consume twenty minutes even when the real cause is a certificate that expired on its own schedule. The failure is self-reinforcing: the more carefully you read the diff, the more invested you become in it being the answer. <strong>The precise start time is the antidote, which is why it is step three and not step ten</strong> — if the failure began at 14:03 and the deploy landed at 09:12, the diff is eliminated in one second by arithmetic rather than by twenty minutes of reading. Get the timestamp before you form the hypothesis, not after.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/managing-incidents/" target="_blank" rel="noopener">
  <span class="lc-ico">🚨</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — managing incidents</span><span class="lc-sub">Roles, communication and the discipline of separating mitigation from diagnosis, scaled down to whoever is available.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — effective troubleshooting</span><span class="lc-sub">The hypothesise-and-eliminate loop this checklist encodes, and the common cognitive traps it is designed to route around.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Năm phút đầu tiên</h2>
<p class="lead">Mọi thứ trong khoá học này tồn tại vì cái khoảnh khắc này. Và cái khoảnh khắc ấy có một tính chất chẳng ai lên kế hoạch trước: khả năng suy luận của bạn TỆ ĐI đo được trong lúc đó. Adrenaline làm hẹp sự chú ý, bạn nhảy tới cái thứ bạn vừa đụng vào gần nhất, và bạn bắt đầu gõ trước khi kịp đọc gì. Lớp phòng thủ là một danh sách kiểm mà bạn viết ra lúc còn bình tĩnh.</p>

<h3>Vì sao một quy trình cố định hơn hẳn sự phán đoán ở đây</h3>
<pre><code>Chuyện thật sự xảy ra khi không có nó:

  0:00  cảnh báo nổ
  0:10  "mình vừa deploy một tiếng trước" → mở cái diff ra
  2:00  đọc cái diff, chẳng thấy gì có tính kết luận
  3:00  "hay là quay lui?" → bắt đầu quay lui
  6:00  quay lui xong, vẫn hỏng
  7:00  giờ mới bắt đầu nhìn dữ liệu, sau khi đã tiêu bảy phút
        và đã thay đổi cái hệ thống ngay dưới chân mình

Việc quay lui không phải vô lý. Nó chỉ là chưa được kiểm chứng
với bằng chứng nào, và giờ bạn không phân biệt được trạng thái
hiện tại là cú hỏng ban đầu hay là thứ do việc quay lui gây ra.

Cái luật ngăn được phần lớn chuyện này: ĐỪNG THAY ĐỔI BẤT CỨ THỨ
GÌ TRONG NĂM PHÚT ĐẦU. Hãy đọc trước. Những thay đổi thực hiện
trước khi bạn hiểu cú hỏng chỉ làm cú hỏng khó hiểu hơn.</code></pre>

<h3>Năm phút, dưới dạng một chuỗi</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">0:00–0:30 · Nó có thật không, và lớn tới đâu?</span><span class="lz-lnote">Mở cái bảng 3-giờ-sáng (bài 10.1). Bốn con số. Phép kiểm bên ngoài có trượt không? Tỉ lệ lỗi là một phần trăm hay là một phần nhỏ của một phần trăm? Cái này quyết định bạn có đang ở trong một sự cố hay không.</span></div>
  <div class="lz-layer"><span class="lz-lname">0:30–1:00 · Có phải do CHÚNG TA không?</span><span class="lz-lnote">Một lệnh curl từ bên ngoài (lệnh phân tầng ở bài 8.5). Nó tách &quot;ứng dụng của ta hỏng&quot; khỏi DNS, TLS, nginx và Cloudflare trong một giây, mà bốn thứ đó là bốn cuộc điều tra hoàn toàn khác nhau.</span></div>
  <div class="lz-layer"><span class="lz-lname">1:00–2:00 · Nó bắt đầu chính xác lúc nào?</span><span class="lz-lnote">Thu phóng cái bảng điều tra cho tới khi thấy được điểm chuyển. Một mốc bắt đầu chính xác là sự thật giá trị nhất bạn có thể lấy được, vì nó biến &quot;cái gì sai&quot; thành &quot;chuyện gì đã xảy ra lúc 14:03&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">2:00–3:00 · Lúc đó có gì thay đổi?</span><span class="lz-lnote">Chú thích deploy (bài 10.2). Một lịch cron. Trang trạng thái của một phụ thuộc. Phần lớn sự cố đều có một thay đổi nằm trong vòng vài phút quanh mốc bắt đầu, và tìm ra nó ngay bây giờ tiết kiệm hai mươi phút sắp tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">3:00–5:00 · Ở tầng nào?</span><span class="lz-lnote">Đọc cái bảng điều tra từ trên xuống (bài 10.1). Hàng 1 triệu chứng, hàng 2 tiến trình này, hàng 3 phụ thuộc, hàng 4 ngữ cảnh. Dừng ở hàng bất thường ĐẦU TIÊN — đó là tầng của bạn.</span></div>
</div>

<h3>Bốn câu hỏi, dưới dạng lệnh dán vào là chạy</h3>
<pre><code class="language-bash"># 1. Do chúng ta, hay do cái mạng đứng trước chúng ta? (bài 8.5)
curl -sS -o /dev/null -w \\
  'dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} \\
   ttfb:%{time_starttransfer} code:%{http_code}\\n' \\
  https://cuongthai.com/api/v1/courses

# 2. Ứng dụng có được gắn không, hay đây là một bản dựng cũ? (bài 8.4)
curl -s -o /dev/null -w '%{http_code}\\n' https://cuongthai.com/api/v1/notes
#   401 = đã gắn   200 = đã gắn   404 = BẢN DỰNG CŨ

# 3. Tiến trình còn sống và không kẹt chứ? (bài 8.2)
curl -s https://cuongthai.com/health/live
curl -s https://cuongthai.com/health          # cái này có kiểm Postgres

# 4. Nó có đang khởi động lại không? (bài 5.5)
#    uptime về không mỗi 30-45 giây là cái vòng lặp thăm-dò-liveness
#    ở bài 8.2, và nó trông y hệt một sự cố cơ sở dữ liệu
docker ps --format '{{.Names}}\\t{{.Status}}'</code></pre>

<h3>Mỗi câu trả lời loại bỏ được cái gì</h3>
<pre><code>curl hỏng ở TLS          → chứng chỉ. Không phải mã của bạn.
                           Tầng 1-4 (bài 8.5).

curl trả 404             → bản dựng cũ. Không phải lô-gíc của bạn.
                           Hãy deploy lại cho tử tế (bài 8.4).

curl trả 502             → nginx với tới được, backend thì không
                           trả lời. Container chết, kẹt, hoặc
                           một cú hết giờ (bài 3.5).

/health/live OK mà       → Postgres. Ứng dụng vẫn ổn và đang chờ
/health 503                cái phụ thuộc của nó.

uptime cứ về không       → vòng lặp khởi động lại. Hãy đọc bài 8.2
                           TRƯỚC KHI giả định cơ sở dữ liệu là vấn
                           đề — việc khởi động lại có thể chính là
                           thứ đang gây ra vấn đề của cơ sở dữ liệu.

cả bốn đều ổn mà người   → nó nằm trong ứng dụng. Giờ mới tới các
dùng vẫn báo lỗi           hàng 1-4 của bảng, rồi trace, rồi log.</code></pre>
<p>Bốn lệnh, chưa tới một phút, và mỗi lệnh gạt bỏ trọn một hạng mục. Điều đó giá trị hơn bất cứ đồ thị đơn lẻ nào, vì nó nói cho bạn biết bạn sắp cần tới chương nào trong mười chương trước.</p>

<h3>Viết lại trong lúc nó đang xảy ra</h3>
<pre><code>Hãy giữ một ghi chú chạy dài từ phút số không. Không phải để
viết báo cáo — mà là cho chính bạn, mười phút sau.

  14:03  cảnh báo: tốc độ đốt 14,4x
  14:04  curl ngoài OK, 200. vậy không phải DNS/TLS/nginx
  14:05  tỉ lệ lỗi 3%, p99 4s. p50 bình thường ở 15ms
  14:06  không deploy gì từ 09:12. không phải do ta.
  14:07  vòng lặp bình thường, bộ nhớ bình thường, bể KHÔNG chờ
  14:08  → vậy không phải tiến trình này, không phải cái bể
  14:09  exemplar → trace: 3889ms trong POST modelapi.vn

Vì sao chuyện này quan trọng hơn vẻ ngoài của nó:

  · Bạn SẼ quên mất mình đã loại bỏ những gì, và bạn sẽ đi kiểm
    lại. Cái ghi chú là thứ chặn cái vòng lặp đó.
  · Dấu thời gian biến bản kiểm điểm sau sự cố (bài 11.4) thành
    một thao tác chép-dán thay vì một cuộc dựng lại.
  · Nếu có ai đó nhập cuộc thì cái ghi chú này chính là bàn giao.
  · Viết ra "vậy không phải X" ép bạn phải NÊU RÕ phép suy luận,
    và đó là lúc bạn nhận ra những phép suy luận thật ra không
    suy ra được.</code></pre>

<h3>Hai việc phải làm trước khi điều tra sâu hơn</h3>
<pre><code>Một khi đã biết tầng, và TRƯỚC KHI đi sâu hơn:

  1. CẦM MÁU nếu bạn làm được một cách an toàn.
     Quay lui một lần deploy có tương quan. Tắt cái tính năng.
     Bỏ bớt tải. Giảm nhẹ và chẩn đoán là hai hoạt động khác
     nhau, và giảm nhẹ đi trước — nhưng chỉ khi bạn có một lý
     do CỤ THỂ, không phải như một phản xạ ở phút thứ nhất.

  2. NÓI MỘT CÂU. Kể cả khi chỉ có một mình, hãy viết trạng thái
     ở đâu đó kèm dấu thời gian. Người dùng chịu đựng một sự cố
     dễ hơn nhiều so với chịu đựng sự im lặng, và với một dự án
     một người thì cái trạng thái ấy cũng là thứ giữ cho bạn khỏi
     bị hỏi han trong lúc đang làm.</code></pre>

<div class="pitfall">
<p><strong>Bẫy — thứ đầu tiên bạn đi kiểm là bất cứ thứ gì bạn vừa đụng vào gần nhất, và cái thiên kiến ấy mạnh nhất đúng vào lúc nó kém đáng tin nhất.</strong> Bạn deploy hai tiếng trước, nên bạn mở cái diff ra — mà một cái diff thì LÚC NÀO cũng chứa thứ gì đó <em>CÓ THỂ</em> là nguyên nhân một cách hợp lý, và chừng đó đủ để ngốn hai mươi phút kể cả khi nguyên nhân thật là một chứng chỉ hết hạn theo đúng lịch của nó. Cú hỏng này tự củng cố: bạn càng đọc cái diff kỹ thì bạn càng đầu tư vào việc nó phải là câu trả lời. <strong>Cái mốc bắt đầu chính xác là thuốc giải, và đó là lý do nó là bước ba chứ không phải bước mười</strong> — nếu cú hỏng bắt đầu lúc 14:03 và lần deploy đáp xuống lúc 09:12 thì cái diff bị loại trong một giây bằng số học, chứ không phải bằng hai mươi phút đọc. Hãy lấy dấu thời gian TRƯỚC khi hình thành giả thuyết, đừng lấy sau.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/managing-incidents/" target="_blank" rel="noopener">
  <span class="lc-ico">🚨</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — quản lý sự cố</span><span class="lc-sub">Vai trò, giao tiếp và kỷ luật tách giảm-nhẹ khỏi chẩn-đoán, thu nhỏ xuống cho bất cứ ai đang có mặt.</span></span>
</a>
<a class="link-card dl" href="https://sre.google/sre-book/effective-troubleshooting/" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — gỡ rối hiệu quả</span><span class="lc-sub">Vòng lặp giả-thuyết-rồi-loại-trừ mà danh sách kiểm này mã hoá, và những cái bẫy nhận thức phổ biến mà nó được thiết kế để đi vòng qua.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '11.2 — Seven failure shapes|||11.2 — Bảy hình dạng hỏng hóc',
      slug: 'obs-11-2-bay-hinh-dang',
      type: 'VIDEO',
      description: 'Gần như mọi sự cố backend đều có một trong bảy hình dạng. Nhận ra hình dạng là bỏ qua được nửa cuộc điều tra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Seven failure shapes</h2>
<p class="lead">After enough incidents you stop diagnosing from first principles and start pattern-matching. This lesson is that pattern library, written down — seven shapes, each with the signature that identifies it and the one metric that confirms it.</p>

<h3>Shape 1 — the cliff</h3>
<pre><code>  errors  ──────────────┐
                        │███████████
  time                  ▲
                        └ 14:03:22

Everything was fine, then instantly was not. A vertical
edge, not a ramp.

MEANS: a discrete event. Something switched.
  · a deploy (check the annotation first)
  · a container restart
  · a certificate expiring
  · a credential rotating
  · a feature flag

CONFIRM: the exact second. Then find what happened in
that second. A cliff never has a gradual cause, so
anything that ramps up — load, memory, a leak — is
eliminated immediately.</code></pre>

<h3>Shape 2 — the ramp</h3>
<pre><code>  latency        ╱────
              ╱─╯
          ╱──╯
  ──────╯
  time

Slow, steady degradation over minutes or hours.

MEANS: something is accumulating.
  · memory (lesson 5.2's rising sawtooth bottom)
  · connections not being released
  · a queue growing faster than it drains
  · a table growing past an index's usefulness

CONFIRM: extend the time range until the ramp starts.
Ramps have a beginning, and that beginning is a cliff —
which puts you back in shape 1 with a much better
timestamp.</code></pre>

<h3>Shape 3 — the sawtooth</h3>
<pre><code>  uptime  ╱│╱│╱│╱│╱│╱│
  time

Something recovers and dies, repeatedly, on a rhythm.

MEANS: an automatic loop is fighting the failure.
  · the liveness-probe restart loop (lesson 8.2) —
    period 30-45s with this repo's healthcheck settings
  · OOM kill → restart → fill memory → OOM (lesson 5.2)
  · a crash on startup after a fixed timeout

CONFIRM: measure the PERIOD. A regular period is
machine-driven and identifies the machine: 30-45s is the
healthcheck, ~10s is stop_grace_period, minutes is
usually memory filling at a steady rate.

Irregular period → it is load-driven, not a loop, and
this is really shape 5.</code></pre>

<h3>Shape 4 — the spike train</h3>
<pre><code>  latency  │  │  │  │  │
           ▲  ▲  ▲  ▲  ▲
  time     every 5 min, exactly

Brief, sharp, regular. Normal in between.

MEANS: a scheduled job.
  · cron (this repo has nightly cleanup and weekly
    re-embed jobs)
  · Prometheus scraping something expensive
    (lesson 5.5's collect() callbacks)
  · a cache expiring in unison, so every request
    misses at once

CONFIRM: the interval. Match it against your crontab and
your scrape_interval. If it matches, it is not an
incident — it is a schedule, and per lesson 9.4 it should
never have paged you.</code></pre>

<h3>Shape 5 — the correlation with load</h3>
<pre><code>  requests  ╱‾‾╲    ╱‾‾╲
  errors    ╱‾‾╲    ╱‾‾╲     ← same shape, same times
  time

Errors track traffic. Quiet periods are clean.

MEANS: a capacity limit, reached only under load.
  · connection pool exhaustion (lesson 5.4 — the
    waiting gauge is the confirmation)
  · event loop saturation (lesson 5.1)
  · a rate limit at an upstream
  · lock contention in the database

CONFIRM: plot errors against request rate. If the ratio
is CONSTANT, it is not capacity — it is a fixed
percentage of requests hitting a bad code path. If the
ratio RISES with load, it is capacity.

That distinction takes ten seconds and sends you to two
completely different places.</code></pre>

<h3>Shape 6 — the partial</h3>
<pre><code>  /api/v1/notes    ████ 100% errors
  /api/v1/posts    ░░░░   0% errors
  /api/v1/auth     ░░░░   0% errors

One route, one user, one region. Everything else fine.

MEANS: something specific to that slice.
  · one dependency (notes needs embeddings; posts does not)
  · one query hitting a missing index
  · data-shaped: one user's record triggers a bug
  · a canary or a partially-rolled deploy

CONFIRM: find the smallest slice that fails. If it is
ONE user, it is data. If it is one route, it is that
route's dependencies. If it is one container out of
several, it is that container.

This shape is the argument for the route label in
lesson 4.1 — without it, a 100% failure on one route
looks like a 3% failure overall.</code></pre>

<h3>Shape 7 — the silence</h3>
<pre><code>  requests  ────────────╲___________
  errors    ─────────────___________  ← also zero
  latency   ─────────────___________  ← also zero
  time

Everything goes to zero at once. No errors, because
there are no requests to fail.

MEANS: traffic is not reaching you.
  · DNS, TLS, nginx, Cloudflare (lesson 8.5, layers 1-5)
  · a broken frontend deploy (lesson 4.5's login case)
  · your own scrape failing (lesson 10.2's lie 5)

CONFIRM: up{job="backend"} first — that separates "no
traffic" from "no data". Then the external curl. This
is the shape where every internal metric is green and
the product is completely down, which is why lesson 9.1
made zero-traffic an alert.</code></pre>

<h3>The shape tells you which chapter to open</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Cliff · Spike train</span><span class="lz-t">Something changed or is scheduled</span><span class="lz-d">Deploy annotations and crontab. Chapters 10 and 9. Usually solved without opening a log.</span></div>
  <div class="lz-node"><span class="lz-k">Ramp · Sawtooth</span><span class="lz-t">A resource is running out</span><span class="lz-d">Chapter 5. Memory, handles, pool, event loop — and the sawtooth period names the mechanism.</span></div>
  <div class="lz-node"><span class="lz-k">Load correlation</span><span class="lz-t">A capacity limit</span><span class="lz-d">Chapter 5's saturation metrics, especially the pool waiting gauge that lesson 5.4 said nothing else can substitute for.</span></div>
  <div class="lz-node"><span class="lz-k">Partial · Silence</span><span class="lz-t">Scope, not severity</span><span class="lz-d">Partial → narrow the slice with labels and traces (chapters 4 and 6). Silence → go outside the process entirely (chapter 8).</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — two shapes at once reads as one confusing shape, and the instinct is to look for a single cause that explains both.</strong> A deploy at 14:03 (cliff) that introduces a memory leak (ramp) produces a graph that is neither: a step followed by a slow climb, which matches no pattern cleanly and invites you to discard the pattern library entirely. The same happens when a real incident triggers an automatic response — an OOM loop layered on top of a load correlation gives you a sawtooth whose period tracks traffic, which looks like nothing at all. <strong>The move is to separate them by time rather than by cause: identify the shape of the FIRST five minutes, treat everything after as possibly a consequence.</strong> Most compound incidents are one trigger plus one automatic reaction, and the reaction is almost always the more visible half — which is exactly why it steals the investigation.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/addressing-cascading-failures/" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — cascading failures</span><span class="lc-sub">How one trigger plus one automatic reaction compounds into the mixed shapes in the pitfall, and the standard mitigations.</span></span>
</a>
<a class="link-card dl" href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — the USE method</span><span class="lc-sub">A systematic sweep for shapes 2, 3 and 5, checking utilisation, saturation and errors for every resource in turn.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Bảy hình dạng hỏng hóc</h2>
<p class="lead">Sau đủ nhiều sự cố thì bạn thôi chẩn đoán từ nguyên lý gốc và bắt đầu KHỚP MẪU. Bài này là cái thư viện mẫu ấy, viết ra giấy — bảy hình dạng, mỗi cái kèm chữ ký nhận diện nó và MỘT chỉ số xác nhận nó.</p>

<h3>Hình 1 — vách đá</h3>
<pre><code>  lỗi     ──────────────┐
                        │███████████
  thời gian             ▲
                        └ 14:03:22

Mọi thứ đang ổn, rồi tức khắc thì không. Một cạnh THẲNG ĐỨNG,
không phải một cái dốc.

NGHĨA LÀ: một sự kiện rời rạc. Có cái gì đó vừa gạt công tắc.
  · một lần deploy (kiểm cái chú thích trước tiên)
  · một lần container khởi động lại
  · một chứng chỉ hết hạn
  · một thông tin xác thực xoay vòng
  · một cái cờ tính năng

XÁC NHẬN: cái giây chính xác. Rồi đi tìm chuyện gì xảy ra trong
cái giây đó. Một vách đá không bao giờ có nguyên nhân từ từ, nên
mọi thứ leo dần — tải, bộ nhớ, một chỗ rò rỉ — đều bị loại ngay.</code></pre>

<h3>Hình 2 — con dốc</h3>
<pre><code>  độ trễ         ╱────
              ╱─╯
          ╱──╯
  ──────╯
  thời gian

Xuống cấp chậm rãi, đều đặn, qua nhiều phút hoặc nhiều giờ.

NGHĨA LÀ: có cái gì đó đang TÍCH TỤ.
  · bộ nhớ (đáy răng cưa dâng lên ở bài 5.2)
  · kết nối không được thả
  · một hàng đợi phình nhanh hơn tốc độ rút cạn
  · một cái bảng phình vượt quá mức hữu ích của một chỉ mục

XÁC NHẬN: nới khoảng thời gian ra cho tới khi thấy con dốc BẮT
ĐẦU. Dốc thì có điểm khởi đầu, và cái khởi đầu ấy là một vách đá
— thứ đưa bạn quay lại hình 1 với một dấu thời gian tốt hơn hẳn.</code></pre>

<h3>Hình 3 — răng cưa</h3>
<pre><code>  uptime  ╱│╱│╱│╱│╱│╱│
  thời gian

Có cái gì đó hồi phục rồi chết, lặp đi lặp lại, theo một nhịp.

NGHĨA LÀ: một vòng lặp tự động đang đánh nhau với cú hỏng.
  · vòng lặp khởi-động-lại do thăm dò liveness (bài 8.2) —
    chu kỳ 30-45 giây với thiết lập healthcheck của kho này
  · OOM giết → khởi động lại → lấp đầy bộ nhớ → OOM (bài 5.2)
  · sập lúc khởi động sau một ngưỡng thời gian cố định

XÁC NHẬN: đo CHU KỲ. Một chu kỳ đều đặn là do máy móc điều khiển
và nó gọi tên luôn cái máy: 30-45 giây là cái healthcheck, ~10
giây là stop_grace_period, vài phút thường là bộ nhớ đầy dần với
một tốc độ ổn định.

Chu kỳ không đều → nó do TẢI điều khiển, không phải một vòng lặp,
và cái này thật ra là hình 5.</code></pre>

<h3>Hình 4 — đoàn tàu gai</h3>
<pre><code>  độ trễ   │  │  │  │  │
           ▲  ▲  ▲  ▲  ▲
  thời gian  cứ 5 phút, chính xác

Ngắn, sắc, đều đặn. Giữa các lần thì bình thường.

NGHĨA LÀ: một việc chạy theo lịch.
  · cron (kho này có việc dọn dẹp hằng đêm và việc tính lại
    embedding hằng tuần)
  · Prometheus đang quét một thứ đắt đỏ (các callback collect()
    ở bài 5.5)
  · một cái cache hết hạn đồng loạt, nên mọi request cùng trượt
    một lúc

XÁC NHẬN: cái khoảng cách. Đối chiếu nó với crontab và với
scrape_interval của bạn. Nếu khớp thì đó không phải một sự cố —
đó là một cái LỊCH, và theo bài 9.4 thì nó lẽ ra chưa bao giờ
nên gọi bạn dậy.</code></pre>

<h3>Hình 5 — tương quan với tải</h3>
<pre><code>  request  ╱‾‾╲    ╱‾‾╲
  lỗi      ╱‾‾╲    ╱‾‾╲     ← cùng hình dạng, cùng thời điểm
  thời gian

Lỗi bám theo lưu lượng. Những quãng vắng thì sạch.

NGHĨA LÀ: một giới hạn công suất, chỉ chạm tới khi có tải.
  · cạn bể kết nối (bài 5.4 — cái gauge waiting là phần xác nhận)
  · bão hoà vòng lặp sự kiện (bài 5.1)
  · một giới hạn tốc độ ở thượng nguồn
  · tranh chấp khoá trong cơ sở dữ liệu

XÁC NHẬN: vẽ lỗi đối chiếu với tốc độ request. Nếu tỉ lệ là HẰNG
SỐ thì đó không phải công suất — đó là một phần trăm cố định số
request đập vào một nhánh mã tồi. Nếu tỉ lệ TĂNG theo tải thì đó
là công suất.

Sự phân biệt ấy tốn mười giây và đưa bạn tới hai nơi hoàn toàn
khác nhau.</code></pre>

<h3>Hình 6 — cục bộ</h3>
<pre><code>  /api/v1/notes    ████ 100% lỗi
  /api/v1/posts    ░░░░   0% lỗi
  /api/v1/auth     ░░░░   0% lỗi

Một route, một người dùng, một vùng. Mọi thứ khác đều ổn.

NGHĨA LÀ: một thứ gì đó đặc thù cho lát cắt ấy.
  · một phụ thuộc (notes cần embedding; posts thì không)
  · một truy vấn đập vào một chỉ mục còn thiếu
  · do hình dạng DỮ LIỆU: bản ghi của một người dùng kích hoạt lỗi
  · một bản canary hoặc một lần deploy mới rải một phần

XÁC NHẬN: tìm cái lát cắt NHỎ NHẤT bị hỏng. Nếu là MỘT người dùng
thì đó là dữ liệu. Nếu là một route thì đó là các phụ thuộc của
route ấy. Nếu là một container trong số nhiều cái thì đó là
container ấy.

Hình này chính là lý lẽ cho cái nhãn route ở bài 4.1 — không có
nó, một cú hỏng 100% trên một route trông như một cú hỏng 3% trên
toàn bộ.</code></pre>

<h3>Hình 7 — sự im lặng</h3>
<pre><code>  request  ────────────╲___________
  lỗi      ─────────────___________  ← cũng bằng không
  độ trễ   ─────────────___________  ← cũng bằng không
  thời gian

Mọi thứ cùng về không một lúc. Không có lỗi nào, vì chẳng có
request nào để mà hỏng.

NGHĨA LÀ: lưu lượng không tới được bạn.
  · DNS, TLS, nginx, Cloudflare (bài 8.5, tầng 1-5)
  · một lần deploy frontend hỏng (ca đăng nhập ở bài 4.5)
  · chính lượt quét của bạn hỏng (lời nói dối 5 ở bài 10.2)

XÁC NHẬN: up{job="backend"} trước — cái đó tách "không có lưu
lượng" khỏi "không có dữ liệu". Rồi tới lệnh curl từ bên ngoài.
Đây là cái hình dạng mà mọi chỉ số nội bộ đều xanh còn sản phẩm
thì chết hoàn toàn, và đó là lý do bài 9.1 biến lưu-lượng-bằng-
không thành một cảnh báo.</code></pre>

<h3>Hình dạng nói cho bạn biết mở chương nào</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Vách đá · Đoàn tàu gai</span><span class="lz-t">Có gì đó đã đổi hoặc đang theo lịch</span><span class="lz-d">Chú thích deploy và crontab. Chương 10 và 9. Thường giải quyết xong mà không cần mở một dòng log nào.</span></div>
  <div class="lz-node"><span class="lz-k">Con dốc · Răng cưa</span><span class="lz-t">Một tài nguyên đang cạn</span><span class="lz-d">Chương 5. Bộ nhớ, handle, bể, vòng lặp sự kiện — và chu kỳ răng cưa gọi tên luôn cái cơ chế.</span></div>
  <div class="lz-node"><span class="lz-k">Tương quan với tải</span><span class="lz-t">Một giới hạn công suất</span><span class="lz-d">Các chỉ số bão hoà ở chương 5, đặc biệt là cái gauge chờ-bể mà bài 5.4 nói không có gì thay thế được.</span></div>
  <div class="lz-node"><span class="lz-k">Cục bộ · Im lặng</span><span class="lz-t">PHẠM VI, không phải mức nghiêm trọng</span><span class="lz-d">Cục bộ → thu hẹp lát cắt bằng nhãn và trace (chương 4 và 6). Im lặng → đi ra hẳn ngoài tiến trình (chương 8).</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hai hình dạng cùng lúc đọc ra thành MỘT hình dạng khó hiểu, và bản năng là đi tìm một nguyên nhân duy nhất giải thích được cả hai.</strong> Một lần deploy lúc 14:03 (vách đá) đem vào một chỗ rò rỉ bộ nhớ (con dốc) sinh ra một đồ thị không phải cái nào cả: một cái bậc rồi tới một cái leo chậm, thứ không khớp gọn với mẫu nào và mời gọi bạn vứt luôn cả cái thư viện mẫu đi. Điều tương tự xảy ra khi một sự cố thật kích hoạt một phản ứng tự động — một vòng lặp OOM chồng lên một tương quan với tải cho bạn một cái răng cưa có chu kỳ bám theo lưu lượng, thứ trông chẳng giống gì cả. <strong>Nước đi ở đây là tách chúng theo THỜI GIAN chứ không theo nguyên nhân: hãy nhận diện hình dạng của NĂM PHÚT ĐẦU, rồi coi mọi thứ sau đó là có thể chỉ là hệ quả.</strong> Phần lớn sự cố phức hợp là một cú kích hoạt cộng một phản ứng tự động, và cái phản ứng gần như luôn là nửa dễ thấy hơn — mà đó chính xác là lý do nó cướp mất cuộc điều tra.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/addressing-cascading-failures/" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — hỏng hóc dây chuyền</span><span class="lc-sub">Một cú kích hoạt cộng một phản ứng tự động dồn lại thành những hình dạng lẫn lộn ở cái bẫy trên thế nào, và các cách giảm nhẹ chuẩn mực.</span></span>
</a>
<a class="link-card dl" href="https://www.brendangregg.com/usemethod.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">Brendan Gregg — phương pháp USE</span><span class="lc-sub">Một lượt quét có hệ thống cho hình 2, 3 và 5, kiểm mức sử dụng, độ bão hoà và lỗi cho từng tài nguyên một.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '11.3 — Reading four real incidents from this repository|||11.3 — Đọc bốn sự cố THẬT của chính kho này',
      slug: 'obs-11-3-bon-su-co-that',
      type: 'VIDEO',
      description: 'Bốn cú hỏng đã xảy ra thật, đọc lại bằng bảy hình dạng — và mỗi cái mất bao lâu so với lẽ ra mất bao lâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Reading four real incidents from this repository</h2>
<p class="lead">This project keeps a condensed log of past failures. Four of them are worth reading against the seven shapes, because each one took hours and each one had a signature that would have named it in minutes.</p>

<h3>Incident 1 — the stale build (2026-07-02)</h3>
<pre><code>SYMPTOMS as reported:
  "GIF picker dead, chats disappearing." Survived a
  re-login, so it looked like neither auth nor session.
  Two apparently unrelated features, broken together.

ACTUAL CAUSE:
  Production ran a stale dist/index.js that never mounted
  /api/v1/gifs. A partial deploy shipped an old image even
  though dist/routes/gifs.routes.js existed on disk.

WHY IT TOOK SO LONG:
  Two unrelated symptoms invited a search for a single
  deep cause. And "chats disappearing" turned out to be a
  SEPARATE thing entirely — per-viewer deletedAt — so the
  investigation was chasing two bugs as one.

THE SHAPE: cliff. Instant, at a deploy.
THE ONE CHECK:
  curl -s -o /dev/null -w '%{http_code}' \\
    https://cuongthai.com/api/v1/gifs
  → 404. Not mounted. Diagnosis complete.

  401 or 200 would have proved the route was live and
  sent the investigation somewhere else immediately.

WHAT THE PROJECT BUILT AFTERWARDS:
  The deploy smoke test (lesson 8.4) — 52 routes, fails
  the deploy on any 404. This class of incident cannot
  recur silently now.</code></pre>

<h3>Incident 2 — the playground that never loaded (2026-07-30)</h3>
<pre><code>SYMPTOMS:
  /playground stuck on the loading screen. NO ERROR of
  any kind. Two sessions spent on it.

ACTUAL CAUSE:
  Next.js fixes the list of files in public/ AT SERVER
  START. Rebuilding the playground changed the JS bundle's
  content-hashed name, so the running server returned 404
  for a file that existed on disk. No JS ran, so the
  loading screen — plain HTML and CSS — spun forever with
  nothing to log.

WHY IT WAS INVISIBLE:
  The .ktx preload requests still returned 200, because
  their names had not changed. So the Network tab looked
  healthy, which is worse than looking broken.

THE SHAPE: silence, at the browser layer. Zero errors
  because zero code ran.

THE ONE CHECK: the browser Network tab filtered to JS,
  looking for 404 rather than for errors. A file that is
  404 while present on disk is a server-state problem,
  not a build problem.

THE COMPOUNDING FACTOR, and the better lesson:
  Killing the server did not work. pkill -f "next start"
  and pkill -f "standalone/server.js" both MISSED, because
  Node renames the process to next-server. So the new
  server died with EADDRINUSE while the old one kept
  serving — making the bug look unfixable.

  Kill by PORT, never by process name:
    lsof -ti:3000 | xargs -r kill -9</code></pre>

<h3>Incident 3 — the deploy that built the wrong image (2026-08-18)</h3>
<pre><code>SYMPTOMS:
  Build green. Push green. Swap green. Then the backend
  restarted forever and the API returned 502 for SEVEN
  MINUTES.

ACTUAL CAUSE:
  The deploy script ran &#96;docker build .&#96; without -f, so it
  used the default Dockerfile instead of Dockerfile.backend
  — the one compose actually uses. Result: a node:22-alpine
  (musl) base carrying a Prisma engine built for
  debian-openssl-3.0.x (glibc).

THE SHAPE: sawtooth. Restart loop with a regular period,
  starting exactly at a deploy — so it is a cliff (shape 1)
  whose consequence is a sawtooth (shape 3), which is the
  compound case from lesson 11.2's pitfall.

THE ONE CHECK: docker logs on the restarting container.
  A container that restarts on a fixed period is crashing
  at startup, and the crash message is in the first lines
  after each restart.

THE PROJECT'S OWN CONCLUSION, verbatim:
  "build xanh không có nghĩa là ảnh chạy được"
  — a green build does not mean the image runs.

WHAT THEY BUILT: a libc ↔ engine check BEFORE pushing,
  and the 40-second recovery recipe (retag the dangling
  old image) instead of a 15-minute rebuild.</code></pre>

<h3>Incident 4 — the enum rename that broke production seeding (2026-08-08)</h3>
<pre><code>SYMPTOMS:
  A ContentType enum value renamed CODE → CODE_REVIEW.
  Passed the ENTIRE pre-push checklist. Broke the seed
  on production.

ACTUAL CAUSE:
  prisma/seed.ts carried its own hand-written copy of the
  union type — 'VLOG' | ... | 'CODE' | ... — so it
  type-checked against ITSELF and agreed with itself.
  And tsconfig.json EXCLUDES prisma/**, so tsc --noEmit
  never looked at the file at all.

THE SHAPE: not a runtime shape. This one is a CHECKER
  blind spot, and it belongs here because it is the same
  failure as lesson 8.4's pitfall and lesson 10.3's:
  a check that runs successfully while covering nothing.

THE PATTERN:
  · a duplicated type is a drift waiting to happen —
    import from @prisma/client instead
  · a file in tsconfig's exclude is a file with NO type
    checking, and nothing tells you
  · "passed every check" is only as strong as what the
    checks actually read

WHAT THEY BUILT: tsconfig.seed.json plus
  npm run typecheck:seed, and prisma db seed added to
  the checklist — because only running it proves it runs.</code></pre>

<h3>The pattern across all four</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">None was diagnosed by reading code</span><span class="lz-d">All four were found by observing behaviour — a status code, a Network tab, a restart period, a production run. Reading the diff would have found none of them.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Three had a one-command check that would have ended it</span><span class="lz-d">A curl, a filtered Network tab, a <code>docker logs</code>. Under a minute each. The hours went into forming a hypothesis rather than eliminating categories (lesson 11.1).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Every one produced a permanent check</span><span class="lz-d">Smoke test, restart-Next rule, libc guard, typecheck:seed. That is what makes them worth reading: the write-up is the artefact, not the incident.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Two were green checks covering nothing</span><span class="lz-d">Incidents 3 and 4 both passed their gates completely. This is the recurring theme of the whole course — a check that succeeds while measuring the wrong thing is worse than no check, because it produces confidence.</span></div>
</div>

<div class="pitfall">
<p><strong>Trap — two symptoms reported together are usually two bugs, and treating them as one causes most of the wasted hours.</strong> Incident 1 is the clean example: &quot;GIF picker dead&quot; and &quot;chats disappearing&quot; arrived in the same message, so the search was for one deep cause that explained both — and there was none, because they were a stale build and a per-viewer delete flag with nothing in common. The bias is strong because a single explanation feels more elegant and because users genuinely do report everything they noticed at once. <strong>The discipline is to write the symptoms as a numbered list and diagnose them independently, and only look for a shared cause once each one has a start time that matches.</strong> If the two start times differ by more than a few minutes, they are two incidents and always were.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://github.com/danluu/post-mortems" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">A collection of public post-mortems</span><span class="lc-sub">Hundreds of real incident write-ups from large systems. Read them for the shapes — the same seven recur at every scale.</span></span>
</a>
<a class="link-card dl" href="https://how.complexsystems.fail/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">How Complex Systems Fail</span><span class="lc-sub">Eighteen short observations, including why failures need multiple contributing causes and why hindsight makes them look obvious.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Đọc bốn sự cố THẬT của chính kho này</h2>
<p class="lead">Dự án này có giữ một nhật ký cô đọng về những cú hỏng đã qua. Bốn cái trong số đó đáng đọc lại bằng bảy hình dạng, vì mỗi cái đều tốn hàng giờ và mỗi cái đều có một chữ ký lẽ ra đã gọi tên được nó trong vài phút.</p>

<h3>Sự cố 1 — bản dựng cũ (02/07/2026)</h3>
<pre><code>TRIỆU CHỨNG như được báo:
  "Trình chọn GIF chết, các cuộc trò chuyện biến mất." Sống sót
  qua một lần đăng nhập lại, nên trông như không phải xác thực
  mà cũng không phải phiên. Hai tính năng có vẻ chẳng liên quan,
  cùng hỏng một lúc.

NGUYÊN NHÂN THẬT:
  Production chạy một dist/index.js cũ chưa bao giờ gắn
  /api/v1/gifs. Một lần deploy dở dang đem lên một ảnh cũ dù
  dist/routes/gifs.routes.js vẫn có trên đĩa.

VÌ SAO NÓ TỐN LÂU THẾ:
  Hai triệu chứng chẳng liên quan mời gọi việc đi tìm MỘT nguyên
  nhân sâu duy nhất. Mà "trò chuyện biến mất" hoá ra lại là một
  chuyện HOÀN TOÀN RIÊNG — deletedAt theo từng người xem — nên
  cuộc điều tra đang đuổi theo hai cái lỗi như thể chúng là một.

HÌNH DẠNG: vách đá. Tức khắc, ngay tại một lần deploy.
PHÉP KIỂM DUY NHẤT:
  curl -s -o /dev/null -w '%{http_code}' \\
    https://cuongthai.com/api/v1/gifs
  → 404. Chưa được gắn. Chẩn đoán xong.

  Nếu là 401 hay 200 thì đã chứng minh được route còn sống và
  đưa cuộc điều tra đi chỗ khác ngay lập tức.

DỰ ÁN ĐÃ DỰNG GÌ SAU ĐÓ:
  Bài kiểm khói lúc deploy (bài 8.4) — 52 route, làm hỏng lần
  deploy nếu gặp bất cứ 404 nào. Lớp sự cố này giờ không thể tái
  diễn trong im lặng được nữa.</code></pre>

<h3>Sự cố 2 — sân chơi không bao giờ tải xong (30/07/2026)</h3>
<pre><code>TRIỆU CHỨNG:
  /playground kẹt mãi ở màn hình tải. KHÔNG một lỗi nào, kiểu gì
  cũng không. Tốn hai phiên làm việc.

NGUYÊN NHÂN THẬT:
  Next.js chốt danh sách file trong public/ NGAY LÚC SERVER KHỞI
  ĐỘNG. Dựng lại sân chơi làm đổi tên gói JS (tên mã băm theo nội
  dung), nên cái server đang chạy trả về 404 cho một file có thật
  trên đĩa. Không JS nào chạy, nên màn hình tải — HTML và CSS
  thuần — quay mãi mà chẳng có gì để log.

VÌ SAO NÓ VÔ HÌNH:
  Các lượt preload .ktx vẫn trả về 200, vì tên chúng không đổi.
  Nên tab Network nhìn có vẻ khoẻ mạnh, mà thế còn tệ hơn là
  nhìn có vẻ hỏng.

HÌNH DẠNG: sự im lặng, ở tầng trình duyệt. Không lỗi nào vì
  không mã nào chạy.

PHÉP KIỂM DUY NHẤT: tab Network của trình duyệt lọc theo JS, tìm
  404 chứ không tìm lỗi. Một file 404 trong khi nó có thật trên
  đĩa là một vấn đề về TRẠNG THÁI SERVER, không phải về bản dựng.

YẾU TỐ LÀM CHUYỆN TỆ THÊM, và là bài học hay hơn:
  Giết server không được. pkill -f "next start" và pkill -f
  "standalone/server.js" đều TRẬT, vì Node đổi tên tiến trình
  thành next-server. Nên server mới chết vì EADDRINUSE trong khi
  server cũ vẫn phục vụ — làm cái lỗi trông như bất trị.

  Hãy giết theo CỔNG, đừng bao giờ giết theo tên tiến trình:
    lsof -ti:3000 | xargs -r kill -9</code></pre>

<h3>Sự cố 3 — lần deploy dựng nhầm ảnh (18/08/2026)</h3>
<pre><code>TRIỆU CHỨNG:
  Dựng xanh. Đẩy xanh. Tráo xanh. Rồi backend khởi động lại vô
  tận và API trả 502 suốt BẢY PHÚT.

NGUYÊN NHÂN THẬT:
  Script deploy chạy &#96;docker build .&#96; mà không có -f, nên nó lấy
  Dockerfile mặc định thay vì Dockerfile.backend — cái mà compose
  thật sự dùng. Kết quả: một nền node:22-alpine (musl) mang một
  engine Prisma dựng cho debian-openssl-3.0.x (glibc).

HÌNH DẠNG: răng cưa. Vòng lặp khởi động lại với chu kỳ đều, bắt
  đầu đúng tại một lần deploy — nên nó là một vách đá (hình 1) mà
  hệ quả là một răng cưa (hình 3), đúng cái ca phức hợp ở cái bẫy
  của bài 11.2.

PHÉP KIỂM DUY NHẤT: docker logs trên cái container đang khởi động
  lại. Một container khởi động lại theo chu kỳ cố định là đang sập
  LÚC KHỞI ĐỘNG, và thông điệp sập nằm ở những dòng đầu tiên sau
  mỗi lần khởi động lại.

KẾT LUẬN CỦA CHÍNH DỰ ÁN, nguyên văn:
  "build xanh không có nghĩa là ảnh chạy được"

HỌ ĐÃ DỰNG GÌ: một chốt kiểm libc ↔ engine TRƯỚC KHI đẩy, và
  công thức khôi phục 40 giây (gắn lại thẻ cho cái ảnh cũ mồ côi)
  thay vì dựng lại mất 15 phút.</code></pre>

<h3>Sự cố 4 — đổi tên enum làm vỡ việc seed trên production (08/08/2026)</h3>
<pre><code>TRIỆU CHỨNG:
  Một giá trị enum ContentType đổi tên CODE → CODE_REVIEW. Qua
  sạch TOÀN BỘ danh sách kiểm trước khi đẩy. Vỡ seed trên production.

NGUYÊN NHÂN THẬT:
  prisma/seed.ts tự chép lại một bản union type viết tay của riêng
  nó — 'VLOG' | ... | 'CODE' | ... — nên nó tự kiểm với CHÍNH NÓ
  và tự đồng ý với mình. Mà tsconfig.json lại EXCLUDE prisma/**,
  nên tsc --noEmit chưa bao giờ nhìn tới cái file ấy.

HÌNH DẠNG: không phải một hình dạng lúc chạy. Cái này là một điểm
  mù của BỘ KIỂM, và nó thuộc về đây vì nó là đúng cái cú hỏng ở
  cái bẫy bài 8.4 và bài 10.3: một phép kiểm chạy thành công trong
  khi chẳng phủ được gì.

CÁI MẪU:
  · một kiểu dữ liệu chép tay là một sự trôi dạt đang chờ xảy ra —
    hãy import thẳng từ @prisma/client
  · một file nằm trong exclude của tsconfig là một file KHÔNG được
    kiểm kiểu gì cả, và chẳng có gì báo cho bạn
  · "đã qua mọi phép kiểm" chỉ mạnh bằng đúng cái mà các phép kiểm
    thật sự ĐỌC

HỌ ĐÃ DỰNG GÌ: tsconfig.seed.json cộng npm run typecheck:seed, và
  thêm prisma db seed vào danh sách kiểm — vì chỉ có CHẠY nó mới
  chứng minh được nó chạy được.</code></pre>

<h3>Cái mẫu xuyên suốt cả bốn</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Không cái nào được chẩn đoán bằng cách đọc mã</span><span class="lz-d">Cả bốn đều được tìm ra bằng cách QUAN SÁT HÀNH VI — một mã trạng thái, một tab Network, một chu kỳ khởi động lại, một lượt chạy trên production. Đọc cái diff thì chẳng tìm ra cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ba cái có một phép kiểm một-lệnh lẽ ra đã kết thúc chuyện</span><span class="lz-d">Một lệnh curl, một tab Network có lọc, một lệnh <code>docker logs</code>. Mỗi cái chưa tới một phút. Hàng giờ trôi vào việc hình thành giả thuyết thay vì loại trừ hạng mục (bài 11.1).</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Cái nào cũng sinh ra một phép kiểm vĩnh viễn</span><span class="lz-d">Bài kiểm khói, luật khởi-động-lại-Next, chốt kiểm libc, typecheck:seed. Đó là thứ làm cho chúng đáng đọc: BẢN GHI mới là sản phẩm, không phải cái sự cố.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Hai cái là những phép kiểm màu xanh chẳng phủ được gì</span><span class="lz-d">Sự cố 3 và 4 đều qua sạch mọi cổng kiểm. Đây là chủ đề lặp lại của cả khoá học — một phép kiểm thành công trong khi đo nhầm thứ thì tệ hơn không có phép kiểm nào, vì nó tạo ra sự tự tin.</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — hai triệu chứng được báo cùng nhau thường là HAI cái lỗi, và coi chúng là một chính là thứ gây ra phần lớn số giờ lãng phí.</strong> Sự cố 1 là ví dụ sạch sẽ: &quot;trình chọn GIF chết&quot; và &quot;trò chuyện biến mất&quot; tới trong cùng một tin nhắn, nên người ta đi tìm một nguyên nhân sâu duy nhất giải thích được cả hai — mà chẳng có cái nào cả, vì chúng là một bản dựng cũ và một cái cờ xoá-theo-người-xem, chẳng chung gì với nhau. Cái thiên kiến ấy rất mạnh vì một lời giải thích duy nhất thì có vẻ thanh lịch hơn, và vì người dùng thật sự có xu hướng báo mọi thứ họ nhận thấy cùng một lúc. <strong>Kỷ luật ở đây là viết các triệu chứng ra thành một danh sách đánh số rồi chẩn đoán chúng ĐỘC LẬP, và chỉ đi tìm nguyên nhân chung sau khi mỗi cái đã có một mốc bắt đầu khớp nhau.</strong> Nếu hai mốc bắt đầu lệch nhau quá vài phút thì chúng là hai sự cố, và vốn dĩ luôn là thế.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://github.com/danluu/post-mortems" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Một bộ sưu tập biên bản sự cố công khai</span><span class="lc-sub">Hàng trăm bản ghi sự cố thật từ các hệ thống lớn. Hãy đọc chúng để tìm HÌNH DẠNG — đúng bảy hình dạng ấy lặp lại ở mọi quy mô.</span></span>
</a>
<a class="link-card dl" href="https://how.complexsystems.fail/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Hệ thống phức tạp hỏng thế nào</span><span class="lc-sub">Mười tám nhận xét ngắn, kể cả vì sao một cú hỏng cần nhiều nguyên nhân góp phần và vì sao cái nhìn hồi cố làm chúng trông hiển nhiên.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '11.4 — The write-up that is worth more than the fix|||11.4 — Bản ghi lại còn giá trị hơn cả cách chữa',
      slug: 'obs-11-4-ban-ghi-lai',
      type: 'VIDEO',
      description: 'Kho này đã có một bảng nhật ký lỗi. Vì sao nó hiệu quả, và cái nó cố ý không làm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>The write-up that is worth more than the fix</h2>
<p class="lead">The fix stops this incident. The write-up stops the next one, and the one after that, for whoever is working on this in two years — which, on a solo project, is you with no memory of any of it. This repository already does this well, and it is worth reading what makes its version work.</p>

<h3>What this repo already has</h3>
<pre><code>A table in the project documentation:

  | Date | Error | Lesson |

Each row is one failure, one sentence of cause, one
sentence of what to do differently. Fifteen rows covering
two months.

The properties that make it work:

  · One line per incident. Long enough to be specific,
    short enough that the whole table is readable in
    two minutes.
  · The LESSON column is imperative — "always run the
    frontend build before push", not "we should consider".
  · It lives next to the instructions, not in a separate
    postmortems folder nobody opens.
  · Entries are never deleted, so the table is also a
    record of what this system is prone to.</code></pre>

<h3>The template, for anything longer than a line</h3>
<pre><code class="language-markdown">## &lt;date&gt; — &lt;one-line symptom as a USER would say it&gt;

**Impact:** who, how many, for how long, what they could
not do. Minutes of error budget spent (lesson 9.3).

**Timeline:**
  14:03  first 5xx (from metrics, not from memory)
  14:07  user reported it
  14:12  I looked
  14:31  cause identified
  14:38  mitigated
  15:02  fully resolved

**Cause:** the mechanism, not the culprit. "The liveness
probe checked Postgres, so a 20-second database stall
restarted every container" — a sentence that explains
HOW, which a name never does.

**Why it took N minutes:** the honest part. Which paths
were tried and abandoned, and which signal would have
short-circuited them.

**What we are changing:**
  - [ ] one concrete change, with an owner and a date
  - [ ] a detection change, so the next one is faster
  - [ ] anything to DELETE — an alert that misled, a
        check that gave false confidence</code></pre>

<h3>The timeline is the part that pays</h3>
<pre><code>Two numbers matter more than the cause:

  TIME TO DETECT   14:03 → 14:12   = 9 minutes
  TIME TO DIAGNOSE 14:12 → 14:31   = 19 minutes

Detection was 9 minutes and a USER found it before any
alert did. That is an alerting gap (chapter 9), and it is
a completely different fix from anything about the bug.

Diagnosis was 19 minutes. That is an observability gap
(chapters 1-10), and the question is which single signal
would have collapsed it.

Most write-ups record only the cause, which means they
improve the code and never the ability to see. Over a
year that produces a codebase with fewer bugs and no
better instrumentation — so the next NEW bug takes just
as long.</code></pre>

<h3>&quot;Blameless&quot; is not politeness, it is accuracy</h3>
<pre><code>❌ "I forgot to add -f to the docker build command."
   True, and it explains nothing. It also guarantees the
   only action item is "be more careful", which has never
   worked for anyone.

✅ "deploy-nha.sh built with &#96;docker build .&#96;, which
   silently used the default Dockerfile rather than the
   Dockerfile.backend that compose uses. Nothing compared
   the built image's base against the one compose expects,
   so a musl base carrying a glibc Prisma engine passed
   build, push and swap."

The second version names a MISSING CHECK, which can be
built. The first names a person, which cannot.

On a solo project this matters MORE, not less: you are
writing to a future self who will not remember the
context and cannot be blamed usefully. A write-up that
says "I was careless" tells that person nothing. One that
says "there was no check between build and swap" tells
them exactly what to look for.</code></pre>

<h3>Action items that survive contact with next week</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Specific</span><span class="lz-t">Nameable in one sentence</span><span class="lz-d">&quot;Add /api/v1/gifs to the smoke test list in deploy.sh&quot;, not &quot;improve deploy testing&quot;. The first gets done in four minutes; the second is still open in a year.</span></div>
  <div class="lz-node"><span class="lz-k">Small</span><span class="lz-t">Doable this week</span><span class="lz-d">An item that needs a day of work will lose to whatever is urgent. Split it, or accept that you are writing a wish rather than a plan.</span></div>
  <div class="lz-node"><span class="lz-k">Detection, not just prevention</span><span class="lz-t">At least one per incident</span><span class="lz-d">Preventing this exact bug is worth less than seeing the next unknown one faster. Every write-up should change something about what you can observe.</span></div>
  <div class="lz-node"><span class="lz-k">Sometimes a deletion</span><span class="lz-t">Remove what misled you</span><span class="lz-d">An alert that fired and pointed the wrong way, a dashboard panel that was read wrongly, a check that gave false confidence. Removing these is as valuable as adding, and much rarer.</span></div>
</div>

<h3>The counter-example: a decision NOT to fix</h3>
<pre><code>This project's CV fabrication CI test (lesson 7.5) is
deliberately dormant, and the documentation records:

  · WHY it is off — the AI account has no credit, so a key
    would trade HTTP 403 for an out-of-credit error and
    leave CI red either way
  · THE COST — nothing watches for the AI inventing
    metrics in CV critiques any more
  · THE FALLBACK — npm run eval:cv-fabrication, which
    prints SKIPPED today because there is no local key
  · HOW TO RE-ARM — the exact secret name and the code
    path that reads it

That is a write-up for a NON-incident, and it does the
same job: it stops the next person from "fixing" something
that is deliberately broken, and it makes the blind spot
visible instead of invisible.

Write these too. A documented gap is a decision; an
undocumented one is indistinguishable from working.</code></pre>

<div class="pitfall">
<p><strong>Trap — hindsight makes every cause look obvious, and a write-up that reads as obvious teaches nothing.</strong> Once you know the deploy used the wrong Dockerfile, the whole incident collapses into &quot;we used the wrong Dockerfile&quot; and the seven minutes of 502 look like carelessness. But at 14:03 that hypothesis was one of forty, and the ones you actually tried are the interesting data — they are what the next person will also try. <strong>A write-up that omits the abandoned paths is a story with the difficulty edited out, and the reader concludes they would have solved it faster, which is the opposite of learning.</strong> Include the wrong turns, and specifically include what made each one plausible at the time: &quot;I checked the diff first because I had deployed an hour earlier&quot; is the sentence that makes lesson 11.1's checklist feel necessary rather than pedantic.</p>
</div>

<h3>📚 Learn deeper</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/postmortem-culture/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Google SRE Book — postmortem culture</span><span class="lc-sub">What blameless means in practice, the template this lesson's is derived from, and how to keep write-ups from becoming ritual.</span></span>
</a>
<a class="link-card dl" href="https://www.etsy.com/codeascraft/blameless-postmortems/" target="_blank" rel="noopener">
  <span class="lc-ico">🕊️</span>
  <span class="lc-body"><span class="lc-title">Etsy — blameless postmortems</span><span class="lc-sub">The original argument that naming a person ends the investigation exactly where the useful part begins.</span></span>
</a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Bản ghi lại còn giá trị hơn cả cách chữa</h2>
<p class="lead">Cách chữa chặn được cái sự cố NÀY. Bản ghi lại chặn được cái kế tiếp, và cái sau nữa, cho bất cứ ai làm việc trên thứ này hai năm sau — mà trên một dự án một người thì đó là chính bạn, không còn nhớ gì về nó cả. Kho này vốn đã làm chuyện này tốt, và đáng đọc xem điều gì làm cho phiên bản của nó hiệu quả.</p>

<h3>Thứ kho này đã có</h3>
<pre><code>Một cái bảng trong tài liệu dự án:

  | Ngày | Lỗi | Bài học |

Mỗi hàng là một cú hỏng, một câu về nguyên nhân, một câu về việc
lần sau nên làm khác đi thế nào. Mười lăm hàng phủ hai tháng.

Những tính chất làm nó hiệu quả:

  · Một dòng cho mỗi sự cố. Đủ dài để cụ thể, đủ ngắn để cả cái
    bảng đọc hết trong hai phút.
  · Cột BÀI HỌC ở thể mệnh lệnh — "luôn chạy frontend build
    trước khi đẩy", không phải "chúng ta nên cân nhắc".
  · Nó nằm ngay cạnh phần hướng dẫn, không nằm trong một thư mục
    biên-bản-sự-cố riêng mà chẳng ai mở.
  · Các mục không bao giờ bị xoá, nên cái bảng cũng là một bản
    ghi về việc hệ thống này có xu hướng hỏng theo kiểu gì.</code></pre>

<h3>Cái mẫu, cho bất cứ thứ gì dài hơn một dòng</h3>
<pre><code class="language-markdown">## &lt;ngày&gt; — &lt;triệu chứng một dòng, nói như một NGƯỜI DÙNG sẽ nói&gt;

**Ảnh hưởng:** ai, bao nhiêu người, trong bao lâu, họ không làm
được gì. Bao nhiêu phút ngân sách lỗi đã tiêu (bài 9.3).

**Dòng thời gian:**
  14:03  lỗi 5xx đầu tiên (lấy từ chỉ số, không lấy từ trí nhớ)
  14:07  người dùng báo
  14:12  tôi vào xem
  14:31  xác định được nguyên nhân
  14:38  đã giảm nhẹ
  15:02  xử lý xong hẳn

**Nguyên nhân:** CƠ CHẾ, không phải thủ phạm. "Lượt thăm dò
liveness có kiểm Postgres, nên một cú đứng 20 giây của cơ sở dữ
liệu đã khởi động lại mọi container" — một câu giải thích BẰNG
CÁCH NÀO, thứ mà một cái tên người không bao giờ làm được.

**Vì sao mất N phút:** phần trung thực. Những hướng nào đã thử
rồi bỏ, và tín hiệu nào lẽ ra đã cắt ngắn chúng.

**Chúng ta đang thay đổi gì:**
  - [ ] một thay đổi cụ thể, có người chịu trách nhiệm và có hạn
  - [ ] một thay đổi về khả năng PHÁT HIỆN, để lần sau nhanh hơn
  - [ ] bất cứ thứ gì cần XOÁ — một cảnh báo đã dẫn sai đường,
        một phép kiểm đã cho sự tự tin giả</code></pre>

<h3>Dòng thời gian mới là phần trả công</h3>
<pre><code>Hai con số quan trọng hơn cả nguyên nhân:

  THỜI GIAN TỚI LÚC PHÁT HIỆN  14:03 → 14:12  = 9 phút
  THỜI GIAN TỚI LÚC CHẨN ĐOÁN  14:12 → 14:31  = 19 phút

Phát hiện mất 9 phút và một NGƯỜI DÙNG tìm ra trước mọi cảnh báo.
Đó là một khoảng trống về cảnh báo (chương 9), và nó là một cách
chữa hoàn toàn khác với bất cứ thứ gì liên quan tới cái lỗi.

Chẩn đoán mất 19 phút. Đó là một khoảng trống về khả năng quan
sát (chương 1-10), và câu hỏi là MỘT tín hiệu nào lẽ ra đã gộp
phăng nó lại.

Phần lớn bản ghi chỉ ghi lại nguyên nhân, nghĩa là chúng cải
thiện MÃ mà không bao giờ cải thiện KHẢ NĂNG NHÌN. Qua một năm
thì điều đó tạo ra một kho mã ít lỗi hơn mà bộ đo đạc chẳng khá
hơn — nên cái lỗi MỚI kế tiếp vẫn tốn đúng ngần ấy thời gian.</code></pre>

<h3>&quot;Không đổ lỗi&quot; không phải phép lịch sự, nó là sự chính xác</h3>
<pre><code>❌ "Tôi quên thêm -f vào lệnh docker build."
   Đúng, và nó chẳng giải thích gì. Nó cũng bảo đảm rằng hạng mục
   hành động duy nhất sẽ là "cẩn thận hơn", thứ chưa từng hiệu quả
   với bất cứ ai.

✅ "deploy-nha.sh dựng bằng &#96;docker build .&#96;, thứ âm thầm dùng
   Dockerfile mặc định thay vì Dockerfile.backend mà compose dùng.
   Không có gì đối chiếu nền của ảnh vừa dựng với cái nền mà
   compose trông đợi, nên một nền musl mang engine Prisma của
   glibc đã qua được cả dựng, đẩy và tráo."

Phiên bản thứ hai gọi tên một PHÉP KIỂM CÒN THIẾU, thứ dựng được.
Phiên bản thứ nhất gọi tên một con người, thứ không dựng được.

Trên một dự án một người thì điều này còn quan trọng HƠN chứ
không phải ít hơn: bạn đang viết cho một phiên bản tương lai của
chính mình, người sẽ không nhớ ngữ cảnh và không thể bị đổ lỗi
một cách hữu ích. Một bản ghi nói "tôi đã bất cẩn" chẳng nói gì
cho người đó. Một bản nói "không có phép kiểm nào giữa dựng và
tráo" thì nói cho họ chính xác cái cần tìm.</code></pre>

<h3>Hạng mục hành động sống sót qua được tuần sau</h3>
<div class="lz-map">
  <div class="lz-node"><span class="lz-k">Cụ thể</span><span class="lz-t">Gọi tên được trong một câu</span><span class="lz-d">&quot;Thêm /api/v1/gifs vào danh sách kiểm khói trong deploy.sh&quot;, không phải &quot;cải thiện việc kiểm thử deploy&quot;. Cái đầu làm xong trong bốn phút; cái sau một năm nữa vẫn còn mở.</span></div>
  <div class="lz-node"><span class="lz-k">Nhỏ</span><span class="lz-t">Làm được trong tuần này</span><span class="lz-d">Một hạng mục cần một ngày làm việc sẽ thua bất cứ thứ gì đang gấp. Hãy chẻ nó ra, hoặc chấp nhận rằng bạn đang viết một điều ước chứ không phải một kế hoạch.</span></div>
  <div class="lz-node"><span class="lz-k">Phát hiện, không chỉ phòng ngừa</span><span class="lz-t">Ít nhất một cái cho mỗi sự cố</span><span class="lz-d">Ngăn được đúng cái lỗi này thì giá trị kém hơn việc NHÌN THẤY cái lỗi chưa biết kế tiếp nhanh hơn. Mọi bản ghi đều nên thay đổi một thứ gì đó về cái bạn quan sát được.</span></div>
  <div class="lz-node"><span class="lz-k">Đôi khi là một phép XOÁ</span><span class="lz-t">Gỡ bỏ thứ đã dẫn bạn sai đường</span><span class="lz-d">Một cảnh báo đã nổ và chỉ sai hướng, một ô bảng theo dõi bị đọc sai, một phép kiểm cho sự tự tin giả. Gỡ bỏ những thứ đó giá trị ngang với thêm vào, và hiếm hơn nhiều.</span></div>
</div>

<h3>Ví dụ ngược: một quyết định KHÔNG chữa</h3>
<pre><code>Bài kiểm CI về việc bịa số liệu CV của dự án này (bài 7.5) đang
ngủ có chủ ý, và tài liệu ghi lại:

  · VÌ SAO nó tắt — tài khoản AI hết tín dụng, nên một cái khoá
    chỉ đổi HTTP 403 lấy một lỗi hết-tín-dụng và CI đỏ theo cả
    hai đường
  · CÁI GIÁ — không còn gì canh chừng việc AI bịa số liệu trong
    phần nhận xét CV nữa
  · ĐƯỜNG LÙI — npm run eval:cv-fabrication, thứ hôm nay in ra
    SKIPPED vì ở máy cũng không có khoá
  · BẬT LẠI THẾ NÀO — tên bí mật chính xác và nhánh mã đọc nó

Đó là một bản ghi cho một KHÔNG-sự-cố, và nó làm đúng cái việc
ấy: nó chặn người kế tiếp khỏi việc "sửa" một thứ đang hỏng CÓ
CHỦ Ý, và nó làm cho cái điểm mù trở nên NHÌN THẤY ĐƯỢC thay vì
vô hình.

Hãy viết cả những cái này. Một khoảng trống có ghi lại là một
quyết định; một cái không ghi lại thì không phân biệt được với
"đang chạy tốt".</code></pre>

<div class="pitfall">
<p><strong>Bẫy — cái nhìn hồi cố làm mọi nguyên nhân trông hiển nhiên, và một bản ghi đọc lên thấy hiển nhiên thì chẳng dạy được gì.</strong> Một khi bạn đã biết lần deploy dùng nhầm Dockerfile, cả cái sự cố gộp lại thành &quot;chúng ta dùng nhầm Dockerfile&quot; và bảy phút 502 trông như sự bất cẩn. Nhưng vào lúc 14:03 thì cái giả thuyết ấy là một trong bốn mươi cái, và những cái bạn thật sự đã thử mới là dữ liệu thú vị — chúng là thứ mà người kế tiếp cũng sẽ thử. <strong>Một bản ghi bỏ qua những ngã rẽ sai là một câu chuyện đã bị cắt mất phần khó, và người đọc sẽ kết luận rằng họ đã giải nhanh hơn, mà đó là điều ngược lại với việc học.</strong> Hãy đưa những ngã rẽ sai vào, và đặc biệt là đưa vào cái đã làm cho mỗi ngã rẽ ấy trở nên hợp lý VÀO LÚC ĐÓ: &quot;tôi kiểm cái diff trước vì tôi vừa deploy một tiếng trước&quot; chính là cái câu làm cho danh sách kiểm ở bài 11.1 nghe cần thiết chứ không nghe câu nệ.</p>
</div>

<h3>📚 Học sâu thêm</h3>
<div class="link-cards">
<a class="link-card dl" href="https://sre.google/sre-book/postmortem-culture/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Sách SRE của Google — văn hoá biên bản sự cố</span><span class="lc-sub">&quot;Không đổ lỗi&quot; nghĩa là gì trong thực tế, cái mẫu mà bài này rút ra từ đó, và cách giữ cho bản ghi khỏi trở thành một nghi thức.</span></span>
</a>
<a class="link-card dl" href="https://www.etsy.com/codeascraft/blameless-postmortems/" target="_blank" rel="noopener">
  <span class="lc-ico">🕊️</span>
  <span class="lc-body"><span class="lc-title">Etsy — biên bản sự cố không đổ lỗi</span><span class="lc-sub">Lý lẽ gốc rằng gọi tên một con người là kết thúc cuộc điều tra đúng ngay chỗ mà phần hữu ích bắt đầu.</span></span>
</a>
</div>
</div>
`,
    },
    {
      title: '11.5 — Chapter 11 quiz|||11.5 — Kiểm tra chương 11',
      slug: 'obs-11-5-quiz',
      type: 'QUIZ',
      description: 'Sáu câu về năm phút đầu, bảy hình dạng, và bốn sự cố thật của kho này.',
      content: `<div class="ml-en"><span class="eyebrow">Chapter 11 · Quiz</span><h2>Six questions on diagnosis</h2><p class="lead">Four of these are drawn from incidents that actually happened to this repository. The answers are what the project itself concluded.</p></div><div class="ml-vi"><span class="eyebrow">Chương 11 · Kiểm tra</span><h2>Sáu câu về chẩn đoán</h2><p class="lead">Bốn câu trong đây rút ra từ những sự cố đã thật sự xảy ra với kho này. Đáp án chính là thứ mà bản thân dự án đã kết luận.</p></div>`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          {
            question: 'Why is "change nothing in the first five minutes" the first rule of incident response?|||Vì sao "đừng thay đổi gì trong năm phút đầu" là luật đầu tiên khi xử lý sự cố?',
            options: [
              'Because a change made before you understand the failure makes the failure harder to understand — after an untested rollback you can no longer tell whether the current state is the original problem or something the rollback caused. Read first: the precise start time is worth more than any action taken in minute one.|||Vì một thay đổi thực hiện trước khi bạn hiểu cú hỏng sẽ làm cú hỏng khó hiểu hơn — sau một lần quay lui chưa kiểm chứng, bạn không còn phân biệt được trạng thái hiện tại là vấn đề gốc hay là thứ do việc quay lui gây ra. Hãy đọc trước: một mốc bắt đầu chính xác giá trị hơn mọi hành động thực hiện ở phút thứ nhất.',
              'Because most incidents resolve themselves within five minutes|||Vì phần lớn sự cố tự khỏi trong vòng năm phút',
              'Because you need approval before changing production|||Vì bạn cần được duyệt trước khi thay đổi production',
              'Because the metrics are unreliable in the first five minutes|||Vì các chỉ số không đáng tin trong năm phút đầu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Uptime resets every 30–45 seconds while error rate sits flat at 100%. What shape is this and what does the period tell you?|||Uptime về không mỗi 30–45 giây trong khi tỉ lệ lỗi nằm phẳng ở 100%. Đây là hình dạng gì và cái chu kỳ nói cho bạn điều gì?',
            options: [
              'A sawtooth, and the regular period identifies the machine driving it: 30–45s matches this repo\'s healthcheck at interval 15s × 3 retries, so it is the liveness-probe restart loop from lesson 8.2. Read that lesson before assuming the database is at fault — the restarts may be causing the database problem.|||Răng cưa, và cái chu kỳ đều đặn gọi tên luôn cái máy đang điều khiển nó: 30–45 giây khớp với healthcheck của kho này ở chu kỳ 15 giây × 3 lần thử lại, nên đó là vòng lặp khởi-động-lại do thăm dò liveness ở bài 8.2. Hãy đọc bài đó TRƯỚC KHI cho rằng cơ sở dữ liệu có lỗi — chính những lần khởi động lại có thể đang gây ra vấn đề của cơ sở dữ liệu.',
              'A ramp, meaning memory is accumulating|||Con dốc, nghĩa là bộ nhớ đang tích tụ',
              'A spike train from a cron job|||Đoàn tàu gai từ một việc cron',
              'A cliff, since it started instantly|||Vách đá, vì nó bắt đầu tức khắc',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Errors track request rate exactly. How do you tell a capacity limit from a bad code path?|||Lỗi bám chính xác theo tốc độ request. Làm sao phân biệt một giới hạn công suất với một nhánh mã tồi?',
            options: [
              'Plot the RATIO of errors to requests. If it is constant, a fixed percentage of requests hits a bad code path. If the ratio rises with load, it is capacity — pool exhaustion, event loop saturation, an upstream rate limit. The check takes ten seconds and sends you to two completely different places.|||Vẽ TỈ LỆ lỗi trên request. Nếu nó là hằng số thì một phần trăm cố định số request đang đập vào một nhánh mã tồi. Nếu tỉ lệ TĂNG theo tải thì đó là công suất — cạn bể, bão hoà vòng lặp sự kiện, một giới hạn tốc độ ở thượng nguồn. Phép kiểm tốn mười giây và đưa bạn tới hai nơi hoàn toàn khác nhau.',
              'Check whether the errors are 4xx or 5xx|||Kiểm xem các lỗi đó là 4xx hay 5xx',
              'Look at whether p99 latency also rises|||Xem p99 độ trễ có tăng theo không',
              'They cannot be told apart from metrics alone|||Không phân biệt được nếu chỉ có chỉ số',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'The GIF picker was dead and chats were "disappearing", reported together. What was the mistake?|||Trình chọn GIF chết và các cuộc trò chuyện "biến mất", được báo cùng nhau. Sai lầm là gì?',
            options: [
              'Treating two symptoms as one bug. They shared no cause: a stale build never mounted /api/v1/gifs, while "chats disappearing" was a separate per-viewer deletedAt flag. Diagnose reported symptoms independently and only look for a shared cause once each has a start time that matches.|||Coi hai triệu chứng là MỘT cái lỗi. Chúng chẳng chung nguyên nhân nào: một bản dựng cũ chưa bao giờ gắn /api/v1/gifs, còn "trò chuyện biến mất" là một cái cờ deletedAt theo từng người xem, hoàn toàn riêng biệt. Hãy chẩn đoán các triệu chứng được báo một cách ĐỘC LẬP và chỉ đi tìm nguyên nhân chung sau khi mỗi cái đã có một mốc bắt đầu khớp nhau.',
              'Not checking the database first|||Không kiểm cơ sở dữ liệu trước',
              'Trusting the user\'s description of the symptoms|||Tin vào lời mô tả triệu chứng của người dùng',
              'Failing to roll back the deploy immediately|||Không quay lui lần deploy ngay lập tức',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A deploy passed build, push and swap, then the backend restart-looped and the API returned 502 for seven minutes. What is the lesson?|||Một lần deploy qua được dựng, đẩy và tráo, rồi backend lặp vòng khởi động lại và API trả 502 suốt bảy phút. Bài học là gì?',
            options: [
              'A green build does not mean the image runs. &#96;docker build .&#96; silently used the default Dockerfile instead of the Dockerfile.backend that compose uses, producing a musl base carrying a glibc Prisma engine — and nothing compared the built image against what compose expects. The fix is a check between build and swap, not more care.|||Build xanh không có nghĩa là ảnh chạy được. &#96;docker build .&#96; âm thầm dùng Dockerfile mặc định thay vì Dockerfile.backend mà compose dùng, tạo ra một nền musl mang engine Prisma của glibc — và chẳng có gì đối chiếu ảnh vừa dựng với thứ compose trông đợi. Cách chữa là một PHÉP KIỂM giữa dựng và tráo, không phải là cẩn thận hơn.',
              'Docker builds are non-deterministic and must be retried|||Việc dựng Docker không tất định và phải thử lại',
              'The container needed a longer start_period|||Container cần một start_period dài hơn',
              'Prisma engines should be pinned in package.json|||Engine của Prisma nên được ghim trong package.json',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A write-up records the cause but omits the paths that were tried and abandoned. What is lost?|||Một bản ghi có ghi lại nguyên nhân nhưng bỏ qua những hướng đã thử rồi bỏ. Cái gì bị mất?',
            options: [
              'The only part that teaches. Hindsight makes the cause look obvious, so a write-up without the wrong turns is a story with the difficulty edited out — the reader concludes they would have solved it faster, which is the opposite of learning. Include what made each wrong turn plausible at the time.|||Đúng cái phần dạy được người ta. Cái nhìn hồi cố làm nguyên nhân trông hiển nhiên, nên một bản ghi không có những ngã rẽ sai là một câu chuyện đã bị cắt mất phần khó — người đọc kết luận rằng họ đã giải nhanh hơn, mà đó là điều ngược lại với việc học. Hãy đưa vào cái đã làm cho mỗi ngã rẽ sai trở nên hợp lý VÀO LÚC ĐÓ.',
              'Nothing — the cause is the only useful part|||Không gì cả — nguyên nhân là phần hữu ích duy nhất',
              'The timeline, which can be reconstructed from metrics|||Dòng thời gian, thứ dựng lại được từ chỉ số',
              'The action items, which belong in a separate document|||Các hạng mục hành động, thứ thuộc về một tài liệu riêng',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
