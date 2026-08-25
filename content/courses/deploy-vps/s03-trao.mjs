const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';

export default {
  title: 'Chapter 3 — The swap: changing versions without dropping a request|||Chương 3 — Bước tráo: đổi phiên bản mà không rơi một request nào',
  description: 'Bước tráo ngây thơ làm hỏng 168 trên 514 request. Chương này đo lại đúng lần deploy ấy theo cách khác và thu về số không — kèm một cú SIGTERM mà chính tôi viết sai, trả 503 cho mười request lẽ ra phải được phục vụ tử tế.',
  lessons: [

    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — What the naive swap costs, measured|||3.1 — Bước tráo ngây thơ tốn bao nhiêu, đo thật',
      slug: 'deploy-3-1-trao-ngay-tho-ton-bao-nhieu',
      type: 'LESSON',
      description: '514 request bắn liên tục xuyên qua một lần deploy kiểu dừng-rồi-chạy-lại: 168 cái hỏng. Bài này đo con số đó rồi tách nó ra thành ba khoảng thời gian riêng biệt, mỗi khoảng cần một cách sửa khác nhau.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>What the naive swap costs, measured</h2>
<p class="lead">Everything in Chapters 1 and 2 stopped at the moment the bytes reached the server. At that point nothing has changed for anyone — the old version is still serving. This chapter is about the moment it stops, and the measurement below is why that moment deserves a chapter.</p>

<h3>The measurement</h3>
<p>A client sending requests continuously for six seconds, across a deploy that kills the old process and starts the new one. The application takes 1.5 seconds to become ready:</p>
<div class="out">════ A) DUNG roi KHOI DONG LAI (ung dung khoi dong 1,5s) ════
  200: 346   loi ket noi: 168   ma khac: 0
  phan bo ban: {'A': 120, 'B': 226}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">168 failures out of 514</span><span class="v">Nearly one request in three, for the whole window. Not slow responses — connection errors, with no HTTP status at all.</span></div>
  <div class="kv"><span class="k">The client saw nothing to retry against</span><span class="v"><code>ma khac: 0</code> means not a single request got a 5xx. There was no server to produce one. A browser shows "this site can't be reached"; an API client raises a connection error rather than an HTTP error, which is a different code path in most libraries.</span></div>
  <div class="kv"><span class="k">The version split shows the seam</span><span class="v">120 requests answered by A, 226 by B, and 168 by nobody in between.</span></div>
  <div class="kv"><span class="k">The duration is your startup time</span><span class="v">Lesson 0.1 measured the same deploy against an application that started instantly: one failed request. The only thing that changed here is how long the application takes to be ready.</span></div>
</div>

<h3>Three separate windows, three separate fixes</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Before the kill — requests already in flight</span><span class="lz-d">Requests the old process accepted and has not answered yet. Killing it abandons them: the client gets a closed connection mid-response. Fixed by <em>graceful shutdown</em> — Lesson 3.2, where a measured SIGKILL drops them and a correct SIGTERM does not.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Between the kill and the new process binding the port</span><span class="lz-d">Nothing is listening. Every connection is refused instantly. This is the bulk of the 168, and no amount of care inside the application can fix it — the fix has to be structural, so that something is always listening. Lesson 3.3.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">After it binds but before it is ready</span><span class="lz-d">The subtlest window. The port is open, connections are accepted, and the application cannot answer them properly yet — half-initialised database pools, empty caches, missing config. Fixed by not sending traffic until a readiness check passes, which is the alive-versus-ready distinction from Lesson 0.3.</span></div>
</div>
<div class="callout warn"><strong>Window 2 is the one people try to shrink instead of remove.</strong> Faster startup, a smaller bundle, lazy initialisation — all real improvements, and none of them a fix. They make the outage shorter. The measurement in Lesson 0.1 is the proof: the same deploy on a fast-starting application still dropped a request. The only difference between one dropped request and 168 is how long you were unlucky for.</div>

<h3>The shape of the fix</h3>
<p>Every zero-downtime deploy, at every scale, is the same four steps in the same order:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Start the new version alongside the old</span><span class="lz-lnote">Both running at once, briefly. This is what removes window 2 entirely — there is never a moment with nothing listening.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. Wait until the new one is genuinely ready</span><span class="lz-lnote">Poll its own health endpoint until it answers. Not <code>sleep 5</code> — a real check, because the startup time you guessed is the outage you get when you guess low.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. Move traffic</span><span class="lz-lnote">One atomic action: a proxy reload, a symlink swap plus restart, a load balancer update. Nothing is served by a half-switched state.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. Stop the old one gracefully</span><span class="lz-lnote">Last, not first. Send <code>SIGTERM</code>, let it finish what it accepted, and only then let it exit. Lesson 3.2 measures the difference.</span></div>
</div>
<div class="callout ok"><strong>The naive deploy does exactly these four steps in reverse.</strong> It stops the old one first, then starts the new one, then hopes it is ready, then finds out. Reversing the order is the entire technique — Lesson 3.3 runs the same deploy in this order and measures zero failed requests out of 733.</div>

<h3>What "zero downtime" does not mean</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Not that both versions never run at once</span><span class="v">They must, for a moment — that is the mechanism. Which means your code has to tolerate it: two versions reading the same database, the same cache, the same files. Chapter 5 is about the version of that problem involving schemas.</span></div>
  <div class="kv"><span class="k">Not that in-flight work is safe</span><span class="v">A request that was going to take thirty seconds does not stop being at risk. Graceful shutdown gives it a deadline, not immunity.</span></div>
  <div class="kv"><span class="k">Not that long-lived connections survive</span><span class="v">WebSockets, server-sent events and streaming responses are attached to the old process. They will be closed when it exits, and the client has to reconnect. Zero-downtime for request-response traffic is not the same as zero-downtime for a persistent connection.</span></div>
  <div class="kv"><span class="k">Not that the deploy is safe</span><span class="v">Shipping a broken version with no dropped requests is still shipping a broken version. This chapter removes the outage caused by the <em>swap</em>; Chapter 6 handles the one caused by the <em>code</em>.</span></div>
</div>
<div class="note-ct">A fair question at this point: is this worth doing for a personal site with a hundred visitors a day? Often not — Lesson 0.1 measured 94 ms and one failed request on a fast-starting app, and that is a defensible cost. The reason to build it anyway is that the machinery is small, it is the same machinery that gives you instant rollback in Chapter 6, and the day you actually need it is the day you are deploying an urgent fix under load, which is the worst possible time to be assembling it.</div>
<h3>Where the downtime in a naive swap actually goes</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Window 1 — the old process is stopped</span><span class="lz-lnote">From <code>stop</code> to the socket closing. Short, and it is the only part most people picture when they say &quot;downtime&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">Window 2 — the new process is starting</span><span class="lz-lnote">Node boots, the framework loads, the pool connects. Measured in seconds, and it is usually the largest of the three.</span></div>
  <div class="lz-layer"><span class="lz-lname">Window 3 — it is listening but not ready</span><span class="lz-lnote">The port is open, so the proxy sends traffic, and the app returns 500 until warm-up finishes. This one is invisible without a readiness check.</span></div>
  <div class="lz-layer"><span class="lz-lname">So three windows, three different fixes</span><span class="lz-lnote">Start-before-stop removes the first two; a readiness probe the proxy honours removes the third. Fixing only one leaves the outage roughly as long.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — BlueGreenDeployment</span><span class="lc-sub">martinfowler.com/bliki/BlueGreenDeployment.html — the two-environment pattern this chapter builds, in two pages.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — readiness probes and rolling updates</span><span class="lc-sub">kubernetes.io/docs/concepts/workloads/controllers/deployment — the same four steps, automated. Worth reading even on a single VPS, because it names each step precisely.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — reloading under live traffic</span><span class="lc-sub">/courses/nginx/learn${REF} — the measurement showing three reloads during four hundred requests produced four hundred 200s, which is what makes step 3 above atomic.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — signals, and what a process does when it receives one</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism behind step 4, and why SIGTERM and SIGKILL are not two strengths of the same thing.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Bước tráo ngây thơ tốn bao nhiêu, đo thật</h2>
<p class="lead">Mọi thứ ở Chương 1 và Chương 2 dừng lại ở khoảnh khắc các byte tới được máy chủ. Ở thời điểm đó chưa có gì thay đổi với ai cả — bản cũ vẫn đang phục vụ. Chương này nói về cái khoảnh khắc nó DỪNG, và phép đo dưới đây là lý do khoảnh khắc ấy xứng đáng có một chương riêng.</p>

<h3>Phép đo</h3>
<p>Một client bắn request liên tục trong sáu giây, xuyên qua một lần deploy giết tiến trình cũ rồi khởi động cái mới. Ứng dụng mất 1,5 giây để sẵn sàng:</p>
<div class="out">════ A) DUNG roi KHOI DONG LAI (ung dung khoi dong 1,5s) ════
  200: 346   loi ket noi: 168   ma khac: 0
  phan bo ban: {'A': 120, 'B': 226}</div>
<div class="kv-grid">
  <div class="kv"><span class="k">168 cái hỏng trên tổng 514</span><span class="v">Gần một request trên ba, suốt cả cửa sổ đó. Không phải phản hồi chậm — mà là LỖI KẾT NỐI, không có mã trạng thái HTTP nào cả.</span></div>
  <div class="kv"><span class="k">Client chẳng thấy gì để mà thử lại</span><span class="v"><code>ma khac: 0</code> nghĩa là KHÔNG một request nào nhận được 5xx. Chẳng có máy chủ nào ở đó để sinh ra nó. Trình duyệt hiện "không truy cập được trang này"; một thư viện API thì ném ra lỗi KẾT NỐI chứ không phải lỗi HTTP, mà đó là một nhánh mã hoàn toàn khác trong hầu hết thư viện.</span></div>
  <div class="kv"><span class="k">Phân bố phiên bản cho thấy vết nứt</span><span class="v">120 request do A trả lời, 226 do B, và 168 thì KHÔNG AI trả lời, nằm ở giữa.</span></div>
  <div class="kv"><span class="k">Độ dài của nó chính là thời gian khởi động của bạn</span><span class="v">Bài 0.1 đã đo đúng lần deploy đó trên một ứng dụng khởi động tức thì: MỘT request hỏng. Thứ duy nhất thay đổi ở đây là ứng dụng mất bao lâu để sẵn sàng.</span></div>
</div>

<h3>Ba cửa sổ riêng biệt, ba cách sửa riêng biệt</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trước lúc giết — những request đang bay dở</span><span class="lz-d">Những request mà tiến trình cũ đã NHẬN và chưa trả lời. Giết nó là bỏ rơi chúng: client nhận một kết nối bị đóng giữa chừng phản hồi. Sửa bằng <em>tắt tử tế</em> — Bài 3.2, nơi một cú SIGKILL đo được là làm rơi chúng còn một cú SIGTERM viết đúng thì không.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Giữa lúc giết và lúc tiến trình mới gắn được cổng</span><span class="lz-d">Không có gì lắng nghe. Mọi kết nối bị từ chối ngay lập tức. Đây là PHẦN LỚN trong số 168 đó, và không sự cẩn thận nào bên trong ứng dụng sửa được — cách sửa buộc phải mang tính CẤU TRÚC, sao cho LUÔN có thứ gì đó đang lắng nghe. Bài 3.3.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Sau khi nó gắn cổng nhưng TRƯỚC khi nó sẵn sàng</span><span class="lz-d">Cửa sổ tinh vi nhất. Cổng đã mở, kết nối được nhận, và ứng dụng thì chưa trả lời tử tế nổi — bể kết nối cơ sở dữ liệu mới khởi tạo một nửa, bộ đệm còn rỗng, cấu hình còn thiếu. Sửa bằng cách KHÔNG gửi lưu lượng vào cho tới khi một phép kiểm sẵn sàng qua được, tức là phân biệt còn-sống/sẵn-sàng ở Bài 0.3.</span></div>
</div>
<div class="callout warn"><strong>Cửa sổ 2 là cái mà người ta cố THU NHỎ thay vì LOẠI BỎ.</strong> Khởi động nhanh hơn, gói nhỏ hơn, khởi tạo lười — đều là cải thiện có thật, và chẳng cái nào là một cách SỬA. Chúng làm cho lần gián đoạn NGẮN HƠN. Phép đo ở Bài 0.1 là bằng chứng: cùng lần deploy đó trên một ứng dụng khởi động nhanh vẫn làm rơi một request. Khác biệt duy nhất giữa một request rơi và 168 request rơi là bạn đen đủi trong bao lâu.</div>

<h3>Hình dạng của cách sửa</h3>
<p>Mọi quy trình deploy không-gián-đoạn, ở mọi quy mô, đều là cùng bốn bước theo cùng một thứ tự:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1. Khởi động bản MỚI SONG SONG với bản cũ</span><span class="lz-lnote">Cả hai cùng chạy một lúc, trong chốc lát. Đây là thứ LOẠI BỎ HẲN cửa sổ 2 — không bao giờ có khoảnh khắc nào mà chẳng có gì lắng nghe.</span></div>
  <div class="lz-layer"><span class="lz-lname">2. CHỜ tới khi bản mới thật sự SẴN SÀNG</span><span class="lz-lnote">Hỏi endpoint sức khoẻ của chính nó tới khi nó trả lời. Không phải <code>sleep 5</code> — một phép kiểm THẬT, vì cái thời gian khởi động mà bạn đoán chính là cái gián đoạn bạn nhận khi đoán thiếu.</span></div>
  <div class="lz-layer"><span class="lz-lname">3. CHUYỂN lưu lượng</span><span class="lz-lnote">MỘT hành động nguyên tử: một lần nạp lại proxy, một cú tráo symlink kèm khởi động lại, một lần cập nhật bộ cân bằng tải. Không có gì được phục vụ bởi một trạng thái chuyển dở.</span></div>
  <div class="lz-layer"><span class="lz-lname">4. DỪNG bản cũ một cách tử tế</span><span class="lz-lnote">SAU CÙNG, không phải đầu tiên. Gửi <code>SIGTERM</code>, để nó làm nốt những gì đã nhận, rồi mới để nó thoát. Bài 3.2 đo cái khác biệt đó.</span></div>
</div>
<div class="callout ok"><strong>Lần deploy ngây thơ làm ĐÚNG bốn bước đó theo thứ tự NGƯỢC.</strong> Nó dừng bản cũ trước, rồi khởi động bản mới, rồi hy vọng nó sẵn sàng, rồi mới biết. ĐẢO lại thứ tự chính là toàn bộ kỹ thuật — Bài 3.3 chạy đúng lần deploy đó theo thứ tự này và đo được KHÔNG request nào hỏng trên tổng 733.</div>

<h3>"Không gián đoạn" KHÔNG có nghĩa là gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không có nghĩa là hai phiên bản không bao giờ chạy cùng lúc</span><span class="v">Chúng BẮT BUỘC phải thế, trong chốc lát — đó chính là cơ chế. Nghĩa là mã của bạn phải CHỊU ĐƯỢC chuyện đó: hai phiên bản cùng đọc một cơ sở dữ liệu, một bộ đệm, một bộ tệp. Chương 5 nói về phiên bản của bài toán đó dính tới lược đồ.</span></div>
  <div class="kv"><span class="k">Không có nghĩa là công việc đang bay dở thì AN TOÀN</span><span class="v">Một request lẽ ra mất ba mươi giây không vì thế mà hết rủi ro. Tắt tử tế cho nó một cái HẠN, chứ không cho nó quyền miễn trừ.</span></div>
  <div class="kv"><span class="k">Không có nghĩa là kết nối dài hạn sống sót</span><span class="v">WebSocket, server-sent event và phản hồi dạng dòng chảy đều gắn vào tiến trình CŨ. Chúng sẽ bị đóng khi nó thoát, và client phải kết nối lại. Không-gián-đoạn cho lưu lượng request-response KHÔNG giống không-gián-đoạn cho một kết nối bền.</span></div>
  <div class="kv"><span class="k">Không có nghĩa là lần deploy AN TOÀN</span><span class="v">Gửi đi một bản hỏng mà không rơi request nào thì vẫn là gửi đi một bản hỏng. Chương này gỡ bỏ cái gián đoạn do <em>BƯỚC TRÁO</em> gây ra; Chương 6 xử lý cái do <em>MÃ</em> gây ra.</span></div>
</div>
<div class="note-ct">Một câu hỏi công bằng ở đây: có đáng làm chuyện này cho một website cá nhân trăm khách mỗi ngày không? Thường là KHÔNG — Bài 0.1 đo được 94 ms và một request hỏng trên một ứng dụng khởi động nhanh, và đó là cái giá bảo vệ được. Lý do vẫn nên dựng nó là bộ máy này NHỎ, nó cũng chính là bộ máy đem lại cho bạn khả năng lùi bản tức thì ở Chương 6, và cái ngày bạn THẬT SỰ cần tới nó là ngày bạn đang deploy một bản vá khẩn giữa lúc có tải, tức là thời điểm tệ nhất để mà ngồi lắp ráp nó.</div>
<h3>Thời gian chết trong một bước tráo ngây thơ thật ra đi đâu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cửa sổ 1 — tiến trình cũ bị dừng</span><span class="lz-lnote">Từ lúc <code>stop</code> tới lúc socket đóng. Ngắn, và đó là phần duy nhất mà phần lớn người ta hình dung khi nói &quot;thời gian chết&quot;.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cửa sổ 2 — tiến trình mới đang khởi động</span><span class="lz-lnote">Node khởi động, framework nạp lên, pool kết nối. Đo bằng giây, và thường là cửa sổ lớn nhất trong ba.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cửa sổ 3 — nó đang nghe nhưng chưa sẵn sàng</span><span class="lz-lnote">Cổng đã mở, nên proxy đẩy lưu lượng tới, và ứng dụng trả 500 cho tới khi khởi động xong. Cửa sổ này vô hình nếu không có phép kiểm sẵn-sàng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vậy là ba cửa sổ, ba cách chữa khác nhau</span><span class="lz-lnote">Khởi-động-trước-rồi-mới-dừng gỡ bỏ hai cái đầu; một probe sẵn-sàng mà proxy tôn trọng gỡ bỏ cái thứ ba. Chữa mỗi một cái thì thời gian chết gần như vẫn thế.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Martin Fowler — BlueGreenDeployment</span><span class="lc-sub">martinfowler.com/bliki/BlueGreenDeployment.html — khuôn hai-môi-trường mà chương này dựng, gói trong hai trang.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — readiness probe và rolling update</span><span class="lc-sub">kubernetes.io/docs/concepts/workloads/controllers/deployment — vẫn bốn bước đó, đã tự động hoá. Đáng đọc ngay cả khi bạn chỉ có một con VPS, vì nó gọi tên từng bước rất chính xác.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — nạp lại cấu hình giữa lúc có lưu lượng</span><span class="lc-sub">/courses/nginx/learn${REF} — phép đo cho thấy ba lần reload giữa bốn trăm request cho ra bốn trăm cú 200, và đó là thứ làm cho bước 3 ở trên trở nên nguyên tử.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — tín hiệu, và một tiến trình làm gì khi nhận được</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm sau bước 4, và vì sao SIGTERM với SIGKILL không phải hai mức mạnh yếu của cùng một thứ.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Graceful shutdown, and the drain I got wrong|||3.2 — Tắt tử tế, và cái bước xả tôi viết sai',
      slug: 'deploy-3-2-tat-tu-te',
      type: 'LESSON',
      description: 'SIGKILL làm rơi mười request đang bay. SIGTERM giữ được chúng — nhưng bản xả đầu tiên tôi viết trả 503 cho cả mười, mà từ phía người dùng thì cũng hỏng y như bị giết. Đo cả ba trạng thái.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Graceful shutdown, and the drain I got wrong</h2>
<p class="lead">Step 4 of the fix is stopping the old version. It looks like the easy step. It is the one where a plausible implementation produces exactly the outcome you were trying to avoid — measured below, in code I wrote for this lesson.</p>

<h3>SIGKILL: the baseline</h3>
<p>Ten requests in flight, each taking 400 ms, and the process is killed with <code>SIGKILL</code> 150 ms in:</p>
<div class="out">════ SIGKILL ════
  ma tra ve: 000 000 000 000 RỚT RỚT 000 000 000 000 000 RỚT RỚT 000 RỚT ...</div>
<p><code>000</code> is curl's code for "no HTTP response at all". The connections were open, the server was going to answer, and the process ceased to exist. Nothing was written, nothing was logged, and the client cannot distinguish this from the server never having received the request — which matters when the request was a payment.</p>
<div class="note-ct"><code>SIGKILL</code> cannot be caught, blocked or handled. The process does not get to run any code — no flush, no close, no log line. That is the point of it, and it is why it is the wrong tool for a deploy. It is the right tool only for a process that has already refused to stop.</div>

<h3>SIGTERM: catchable, and therefore useful</h3>
<pre><code>process.on('SIGTERM', () =&gt; {
  dang_dong = true;
  sv.close(() =&gt; { console.log('da dong sach'); process.exit(0); });
  setTimeout(() =&gt; { console.log('het gio, thoat cung'); process.exit(1); }, 10000);
});</code></pre>
<p><code>server.close()</code> in Node stops accepting new connections, keeps serving the ones already accepted, and runs its callback when the last one finishes. The <code>setTimeout</code> is the deadline: if something never finishes, exit anyway rather than hanging forever.</p>

<h3>And then the version I got wrong</h3>
<p>The first implementation set a <code>dang_dong</code> flag and had the request handler check it. Same ten in-flight requests, same <code>SIGTERM</code>:</p>
<div class="out">════ SIGTERM, ban DAU ════
  ma tra ve cho 10 request dang bay: 503 503 503 503 503 503 503 503 503 503
    [G] SIGTERM — dang cho 10 request xong
    [G] da dong sach</div>
<div class="pitfall"><strong>Trap — a drain flag that the request handler consults will answer 503 to requests that were already in flight.</strong> The log says it correctly: it waited for all ten, and it closed cleanly. Every connection was honoured. And every user got an error page, because the handler checked the flag <em>after</em> the request had been accepted and answered <code>503</code> instead of the response it had already computed. From the client's side this is barely better than <code>SIGKILL</code> — it is a failed request either way, just with a status code attached. The bug is subtle enough that it survives review: the shutdown logic is correct, and the handler looks defensive rather than wrong.</div>

<h3>The fix, and the measurement that confirms it</h3>
<pre><code>const sv = http.createServer((req, res) =&gt; {
  <span class="tok-comment">// request DA VAO thi phuc vu TU TE toi cung.</span>
  <span class="tok-comment">// Chi bao client dung ket noi lai, khong tra loi loi.</span>
  setTimeout(() =&gt; {
    res.writeHead(200, {'x-ban': V, ...(dang_dong ? {'connection': 'close'} : {})});
    res.end(V + '\\n');
  }, tre);
});</code></pre>
<div class="out">════ ban DA SUA ════
  ma tra ve: 200 200 200 200 200 200 200 200 200 200
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach
  --- cong 3107 con ai nghe khong? ---
    socket: 0</div>
<div class="callout ok"><strong>All ten answered 200, and the listening socket was gone immediately.</strong> Those two facts together are what graceful shutdown means: nothing new can arrive, because the socket is closed the moment <code>server.close()</code> is called — and everything already accepted is served to completion. The flag does not decide the <em>response</em>; it only adds <code>Connection: close</code>, which tells a client with a keepalive connection not to send another request down it.</div>

<h3>The parts a correct handler needs</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Stop accepting, immediately</span><span class="lz-d"><code>server.close()</code>, or your framework's equivalent. This is the part that must happen first, and it is instant — the measurement above shows the socket gone while requests were still being answered.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Finish what you accepted, unchanged</span><span class="lz-d">Answer with the response you would have given. Do not switch to an error, do not truncate, do not shorten a timeout. The user cannot tell a deploy is happening, which is the goal.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Close what is not a request</span><span class="lz-d">Database pools, message-queue consumers, cron timers, open file handles. A pool that is not drained leaves connections occupied on the database side until they time out — and Chapter 8 measures what happens when those add up.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Have a deadline, and exit non-zero when you hit it</span><span class="lz-d">A shutdown that hangs is worse than a fast one: the supervisor waits, the deploy waits, and eventually something sends <code>SIGKILL</code> anyway. Choosing your own deadline means you choose what gets abandoned.</span></div>
</div>
<div class="pitfall"><strong>Trap — a keepalive connection can keep a "drained" server alive.</strong> <code>server.close()</code> waits for connections to close, and an idle keepalive connection is open with nothing on it. Node will sit there until the client goes away or your deadline fires. <code>server.closeIdleConnections()</code> exists for exactly this, and <code>Connection: close</code> on the responses (above) is the polite half of the same fix. Without one of them, a perfectly correct shutdown routinely takes the full timeout.</div>

<h3>Who sends the signal, and how long you get</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">systemd</span><span class="v"><code>SIGTERM</code>, then <code>SIGKILL</code> after <code>TimeoutStopSec</code> — 90 seconds by default. Set it explicitly to slightly more than your own deadline, so your code decides rather than the supervisor.</span></div>
  <div class="kv"><span class="k">Docker</span><span class="v"><code>docker stop</code> sends <code>SIGTERM</code> and kills after 10 seconds. That default is short: a 30-second shutdown deadline inside a container is silently a 10-second one unless you pass <code>--time</code> or set <code>stop_grace_period</code>.</span></div>
  <div class="kv"><span class="k">A shell script</span><span class="v"><code>kill</code> sends <code>SIGTERM</code>. <code>kill -9</code> sends <code>SIGKILL</code> — and the measurement at the top of this lesson is what that does to users. It should appear in a deploy script only as a last resort after a timeout.</span></div>
  <div class="kv"><span class="k">Your process manager, in a container</span><span class="v">If PID 1 is a shell rather than your app, signals may not reach the app at all. This is the classic <code>docker stop</code> takes exactly ten seconds every time symptom, and the fix is <code>exec</code> in the entrypoint or an init that forwards signals.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — server.close() and closeIdleConnections()</span><span class="lc-sub">nodejs.org/api/http.html#serverclosecallback — the exact semantics: stops accepting, waits for existing connections, and what counts as existing.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/signal.7.html — the table showing which signals can be caught, and the sentence saying SIGKILL cannot.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5) — TimeoutStopSec, KillSignal</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — how long your process actually gets, and how to change it.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — PID 1, signal forwarding and stop_grace_period</span><span class="lc-sub">/courses/docker/learn${REF} — why a container can appear to ignore SIGTERM entirely, and the two ways to fix it.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Tắt tử tế, và cái bước xả tôi viết sai</h2>
<p class="lead">Bước 4 của cách sửa là DỪNG bản cũ. Nó trông như bước dễ. Nó lại là bước mà một cách cài đặt nghe rất hợp lý lại sinh ra ĐÚNG cái kết cục bạn đang cố tránh — đo ngay dưới đây, trong đoạn mã do chính tôi viết cho bài này.</p>

<h3>SIGKILL: mốc đối chiếu</h3>
<p>Mười request đang bay, mỗi cái mất 400 ms, và tiến trình bị giết bằng <code>SIGKILL</code> sau 150 ms:</p>
<div class="out">════ SIGKILL ════
  ma tra ve: 000 000 000 000 RỚT RỚT 000 000 000 000 000 RỚT RỚT 000 RỚT ...</div>
<p><code>000</code> là mã của curl cho "không có phản hồi HTTP nào cả". Kết nối đang mở, máy chủ sắp trả lời, và tiến trình thôi tồn tại. Không có gì được ghi ra, không có gì vào log, và client KHÔNG phân biệt được chuyện này với chuyện máy chủ chưa từng nhận được request — điều đó rất quan trọng khi cái request đó là một giao dịch thanh toán.</p>
<div class="note-ct"><code>SIGKILL</code> không thể bắt, không thể chặn, không thể xử lý. Tiến trình KHÔNG được chạy lấy một dòng mã nào — không xả bộ đệm, không đóng, không một dòng log. Đó chính là mục đích của nó, và đó là lý do nó là công cụ SAI cho một lần deploy. Nó chỉ đúng cho một tiến trình đã TỪ CHỐI dừng lại.</div>

<h3>SIGTERM: bắt được, nên dùng được</h3>
<pre><code>process.on('SIGTERM', () =&gt; {
  dang_dong = true;
  sv.close(() =&gt; { console.log('da dong sach'); process.exit(0); });
  setTimeout(() =&gt; { console.log('het gio, thoat cung'); process.exit(1); }, 10000);
});</code></pre>
<p><code>server.close()</code> trong Node thôi nhận kết nối mới, vẫn phục vụ những cái đã nhận, và chạy callback của nó khi cái cuối cùng xong. Cái <code>setTimeout</code> là HẠN CHÓT: nếu có thứ gì đó không bao giờ xong thì cứ thoát, còn hơn treo mãi mãi.</p>

<h3>Và rồi bản tôi viết SAI</h3>
<p>Bản cài đặt đầu tiên đặt một cờ <code>dang_dong</code> rồi để bộ xử lý request kiểm cái cờ đó. Vẫn mười request đang bay ấy, vẫn <code>SIGTERM</code> ấy:</p>
<div class="out">════ SIGTERM, ban DAU ════
  ma tra ve cho 10 request dang bay: 503 503 503 503 503 503 503 503 503 503
    [G] SIGTERM — dang cho 10 request xong
    [G] da dong sach</div>
<div class="pitfall"><strong>Bẫy — một cái cờ xả mà bộ xử lý request đi kiểm sẽ trả 503 cho những request VỐN ĐÃ đang bay.</strong> Dòng log nói đúng: nó đã chờ đủ mười cái, và nó đã đóng sạch. Mọi kết nối đều được tôn trọng. Và MỌI người dùng đều nhận một trang lỗi, vì bộ xử lý kiểm cái cờ SAU KHI request đã được nhận rồi trả <code>503</code> thay vì cái phản hồi mà nó vốn đã tính xong. Từ phía client thì chuyện này chỉ nhỉnh hơn <code>SIGKILL</code> một chút — đằng nào cũng là một request hỏng, chỉ khác là có kèm một mã trạng thái. Cái lỗi này tinh vi đủ để sống sót qua một buổi review mã: phần logic tắt thì đúng, còn bộ xử lý thì trông như đang PHÒNG THỦ chứ không như đang sai.</div>

<h3>Cách sửa, và phép đo xác nhận nó</h3>
<pre><code>const sv = http.createServer((req, res) =&gt; {
  <span class="tok-comment">// request DA VAO thi phuc vu TU TE toi cung.</span>
  <span class="tok-comment">// Chi bao client dung ket noi lai, khong tra loi loi.</span>
  setTimeout(() =&gt; {
    res.writeHead(200, {'x-ban': V, ...(dang_dong ? {'connection': 'close'} : {})});
    res.end(V + '\\n');
  }, tre);
});</code></pre>
<div class="out">════ ban DA SUA ════
  ma tra ve: 200 200 200 200 200 200 200 200 200 200
    [S] SIGTERM — thoi nhan ket noi moi, phuc vu not cai dang co
    [S] da dong sach
  --- cong 3107 con ai nghe khong? ---
    socket: 0</div>
<div class="callout ok"><strong>Cả mười cái đều trả 200, và cái socket đang lắng nghe biến mất NGAY.</strong> Hai sự thật đó gộp lại chính là nghĩa của "tắt tử tế": không có gì MỚI vào được nữa, vì socket đóng ngay khoảnh khắc <code>server.close()</code> được gọi — và mọi thứ ĐÃ nhận thì được phục vụ tới cùng. Cái cờ KHÔNG quyết định nội dung <em>PHẢN HỒI</em>; nó chỉ thêm <code>Connection: close</code>, thứ bảo một client đang giữ kết nối keepalive rằng đừng gửi request nữa xuống cái kết nối đó.</div>

<h3>Những phần mà một bộ xử lý ĐÚNG cần có</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">THÔI NHẬN, ngay lập tức</span><span class="lz-d"><code>server.close()</code>, hoặc lệnh tương đương của framework bạn dùng. Đây là phần PHẢI xảy ra trước tiên, và nó tức thì — phép đo ở trên cho thấy socket đã biến mất trong khi các request vẫn đang được trả lời.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Làm nốt thứ bạn đã nhận, KHÔNG đổi gì</span><span class="lz-d">Trả lời bằng đúng cái phản hồi bạn vốn sẽ đưa. Đừng đổi sang một lỗi, đừng cắt ngắn, đừng rút ngắn timeout. Người dùng KHÔNG nhận ra là đang có một lần deploy, và đó mới là mục tiêu.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đóng những thứ KHÔNG phải request</span><span class="lz-d">Bể kết nối cơ sở dữ liệu, bộ tiêu thụ hàng đợi tin nhắn, đồng hồ cron, mô tả tệp đang mở. Một cái bể không được xả để lại những kết nối chiếm chỗ ở phía cơ sở dữ liệu cho tới khi chúng hết giờ — và Chương 8 đo chuyện gì xảy ra khi đám đó cộng dồn lại.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Có HẠN CHÓT, và thoát ra khác 0 khi chạm nó</span><span class="lz-d">Một lần tắt bị treo còn tệ hơn một lần tắt nhanh: trình giám sát chờ, lần deploy chờ, và rốt cuộc vẫn có thứ gì đó gửi <code>SIGKILL</code>. Tự chọn hạn chót của mình nghĩa là BẠN chọn cái gì bị bỏ rơi.</span></div>
</div>
<div class="pitfall"><strong>Bẫy — một kết nối keepalive có thể giữ cho một máy chủ "đã xả" tiếp tục sống.</strong> <code>server.close()</code> chờ các kết nối ĐÓNG LẠI, mà một kết nối keepalive đang nhàn rỗi thì vẫn ĐANG MỞ với chẳng có gì trên đó. Node sẽ ngồi đó cho tới khi client bỏ đi hoặc hạn chót của bạn nổ. <code>server.closeIdleConnections()</code> tồn tại đúng cho chuyện này, và cái <code>Connection: close</code> trên các phản hồi (ở trên) là nửa lịch sự của cùng một cách sửa. Thiếu một trong hai, một quy trình tắt HOÀN TOÀN ĐÚNG vẫn thường xuyên mất trọn cả khoảng timeout.</div>

<h3>Ai gửi tín hiệu, và bạn được bao nhiêu thời gian</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">systemd</span><span class="v"><code>SIGTERM</code>, rồi <code>SIGKILL</code> sau <code>TimeoutStopSec</code> — mặc định 90 giây. Hãy đặt nó tường minh, nhỉnh hơn hạn chót của chính bạn một chút, để MÃ CỦA BẠN quyết định chứ không phải trình giám sát.</span></div>
  <div class="kv"><span class="k">Docker</span><span class="v"><code>docker stop</code> gửi <code>SIGTERM</code> rồi giết sau 10 giây. Mặc định đó NGẮN: một hạn chót tắt 30 giây bên trong container thì âm thầm chỉ còn 10 giây, trừ khi bạn truyền <code>--time</code> hoặc đặt <code>stop_grace_period</code>.</span></div>
  <div class="kv"><span class="k">Một script shell</span><span class="v"><code>kill</code> gửi <code>SIGTERM</code>. <code>kill -9</code> gửi <code>SIGKILL</code> — và phép đo ở đầu bài này chính là thứ nó gây ra cho người dùng. Nó chỉ nên xuất hiện trong một script deploy như phương án CUỐI CÙNG sau khi đã hết giờ.</span></div>
  <div class="kv"><span class="k">Trình quản lý tiến trình của bạn, khi ở trong container</span><span class="v">Nếu PID 1 là một cái shell chứ không phải ứng dụng của bạn thì tín hiệu có thể KHÔNG tới được ứng dụng. Đây là triệu chứng kinh điển "docker stop lần nào cũng mất đúng mười giây", và cách sửa là dùng <code>exec</code> trong entrypoint hoặc một init biết chuyển tiếp tín hiệu.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Node.js — server.close() và closeIdleConnections()</span><span class="lc-sub">nodejs.org/api/http.html#serverclosecallback — ngữ nghĩa chính xác: thôi nhận, chờ các kết nối đang có, và cái gì được tính là "đang có".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">signal(7)</span><span class="lc-sub">man7.org/linux/man-pages/man7/signal.7.html — cái bảng liệt kê tín hiệu nào bắt được, và câu nói rằng SIGKILL thì không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5) — TimeoutStopSec, KillSignal</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — tiến trình của bạn THẬT SỰ được bao lâu, và đổi nó thế nào.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Docker — PID 1, chuyển tiếp tín hiệu và stop_grace_period</span><span class="lc-sub">/courses/docker/learn${REF} — vì sao một container trông như đang phớt lờ hoàn toàn SIGTERM, và hai cách sửa.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Blue-green: the same deploy, zero failures|||3.3 — Xanh-lam: cùng lần deploy đó, không cái nào hỏng',
      slug: 'deploy-3-3-xanh-lam',
      type: 'LESSON',
      description: 'Cùng ứng dụng khởi động 1,5 giây, cùng lần deploy, chỉ đổi THỨ TỰ bốn bước: 733 request, 0 lỗi. Kèm một ngõ cụt đo thật — SO_REUSEPORT nhận cờ nhưng không chạy trên Node của máy chủ này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Blue-green: the same deploy, zero failures</h2>
<p class="lead">Lesson 3.1 measured 168 failures out of 514. This lesson runs the identical deploy — same application, same 1.5-second startup, same client hammering it — with the four steps in the right order.</p>

<h3>The result first</h3>
<div class="out">════ B) TRIEN KHAI XANH-LAM ════
  ban B san sang sau 1500ms
  da chuyen upstream sang 3102
  da gui SIGTERM cho ban A
  200: 733   loi ket noi: 0   ma khac: 0
  phan bo ban: {'A': 207, 'B': 526}</div>
<p>Seven hundred and thirty-three requests, none failed, and the version distribution shows the handover: A answered 207, B answered 526, and there is no gap between them. The 168 failures are gone, and nothing about the application changed — it still takes 1.5 seconds to start.</p>

<h3>The arrangement</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Before</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Nginx, on a fixed port — the only thing the outside world knows about.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3101</span><span class="lz-nsub">Version A, serving.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3102</span><span class="lz-nsub">Empty.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">After</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Unchanged. The client never learns anything happened.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3102</span><span class="lz-nsub">Version B, which took no traffic until it passed its check.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3101</span><span class="lz-nsub">Version A, draining and then exiting.</span></div></div>
  </div>
</div>
<p>The fixed port belongs to the proxy, and the application moves between two ports behind it. Nothing outside the machine ever sees the change.</p>
<pre><code><span class="tok-comment"># upstream.conf — tep DUY NHAT ma lan deploy sua</span>
upstream ungdung { server 127.0.0.1:3101; keepalive 16; }

<span class="tok-comment"># nginx.conf — khong bao gio doi</span>
server {
    listen 80;
    location / {
        proxy_pass http://ungdung;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_next_upstream error timeout http_502 http_503;
    }
}</code></pre>
<div class="note-ct"><code>proxy_next_upstream</code> is the safety net: if the chosen backend refuses a connection or returns 502/503, Nginx retries the request against another server in the pool rather than passing the failure to the client. With one server in the pool it does little; with the old and new both listed during the transition it covers the seam entirely.</div>

<h3>The deploy, in four steps</h3>
<pre><code>set -euo pipefail
CU=3101; MOI=3102

<span class="tok-comment"># 1. khoi dong ban moi — ban cu VAN dang phuc vu</span>
V=B CONG=\$MOI setsid nohup node app.mjs &gt;/var/log/app-b.log 2&gt;&amp;1 &lt;/dev/null &amp;

<span class="tok-comment"># 2. CHO toi khi no THAT SU tra loi — khong phai sleep</span>
for i in \$(seq 1 40); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        http://127.0.0.1:\$MOI/health)" = "200" ] &amp;&amp; break
  sleep 0.1
  [ "\$i" = "40" ] &amp;&amp; { echo "ban moi khong len duoc sau 4s" &gt;&amp;2; exit 1; }
done

<span class="tok-comment"># 3. chuyen luu luong — mot thao tac nguyen tu</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; upstream.conf
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. gio moi dung ban cu, TU TE</span>
sleep 2
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>
<div class="callout ok"><strong>Step 2 is the one that earns the zero.</strong> The measurement printed <code>ban B san sang sau 1500ms</code> — the loop polled until the new version genuinely answered, which took exactly as long as its startup. Replacing that loop with <code>sleep 1</code> would have switched traffic to a process that was not ready yet, and the failures would come back in a different shape: 502s from Nginx instead of connection refusals. Replacing it with <code>sleep 10</code> would work and make every deploy eight seconds slower for no reason.</div>
<div class="pitfall"><strong>Trap — the <code>sleep 2</code> in step 4 is not decoration, and it is also not enough.</strong> Nginx finishes its reload asynchronously: old worker processes keep serving their in-flight requests while new workers take new ones. Killing the old application immediately after <code>reload</code> can cut off a request that an old worker is still proxying. Two seconds covers a fast application; the honest version waits until the old backend reports zero in-flight requests, or simply waits longer than your slowest request. This is the same seam as Lesson 3.2, one layer out.</div>

<h3>A dead end worth knowing about</h3>
<p>There is a tidier-looking approach: have both processes bind the <em>same</em> port using <code>SO_REUSEPORT</code>, so no proxy is needed. Measured on this server:</p>
<div class="out">  [A] da gan cong 3198
  [B] HONG: EADDRINUSE
  --- so socket dang nghe cong 3198 ---
  1
  --- 20 request, phan bo vao hai tien trinh ---
       20 A</div>
<div class="callout warn"><strong><code>reusePort: true</code> was accepted and did nothing.</strong> Node v20.20.2 takes the option without complaint, and the second process still failed with <code>EADDRINUSE</code> — one socket, all twenty requests to A. The option landed properly in later Node releases, so this is a version-specific dead end rather than a broken idea. It is worth reporting for two reasons: an option that is silently ignored is worse than one that errors, and a deploy strategy that depends on a runtime feature you have not verified on <em>your</em> runtime is a strategy that fails on the first real deploy.</div>
<p>The proxy approach has no such dependency. It works on every runtime, every language and every version, because the only thing that needs to support it is a reverse proxy you already have.</p>

<h3>Variations of the same shape</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Two ports plus a proxy — measured above</span><span class="lz-lnote">The general answer. Needs a proxy in front, which any site serving TLS already has.</span></div>
  <div class="lz-layer"><span class="lz-lname">Two containers plus a proxy</span><span class="lz-lnote">Identical, with <code>docker compose up -d</code> in place of starting a process. The compose service name replaces the port number.</span></div>
  <div class="lz-layer"><span class="lz-lname">A socket-activated service</span><span class="lz-lnote">systemd holds the listening socket and hands it to whichever process is current, so connections queue in the kernel during the swap instead of being refused. Elegant, and it ties the arrangement to systemd.</span></div>
  <div class="lz-layer"><span class="lz-lname">Several workers, restarted one at a time</span><span class="lz-lnote">A rolling restart, which is what <code>pm2 reload</code> and Nginx's own reload do. Same principle — something is always listening — applied within one process group instead of across two.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_upstream_module — proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — which failures are retried against another backend, and the ones that are deliberately not.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket(7) — SO_REUSEPORT</span><span class="lc-sub">man7.org/linux/man-pages/man7/socket.7.html — what the option promises at the kernel level, which is not what the measurement above showed at the Node level.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.socket(5) — socket activation</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.socket.html — the variation where the kernel queues connections across a restart.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — upstream blocks, keepalive and reloading</span><span class="lc-sub">/courses/nginx/learn${REF} — the proxy side of this lesson in depth, including why the empty Connection header is required for upstream keepalive.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Xanh-lam: cùng lần deploy đó, không cái nào hỏng</h2>
<p class="lead">Bài 3.1 đo được 168 cái hỏng trên 514. Bài này chạy ĐÚNG lần deploy ấy — cùng ứng dụng, cùng thời gian khởi động 1,5 giây, cùng cái client đang nện vào nó — với bốn bước xếp theo đúng thứ tự.</p>

<h3>Kết quả trước đã</h3>
<div class="out">════ B) TRIEN KHAI XANH-LAM ════
  ban B san sang sau 1500ms
  da chuyen upstream sang 3102
  da gui SIGTERM cho ban A
  200: 733   loi ket noi: 0   ma khac: 0
  phan bo ban: {'A': 207, 'B': 526}</div>
<p>Bảy trăm ba mươi ba request, không cái nào hỏng, và phân bố phiên bản cho thấy cú bàn giao: A trả lời 207, B trả lời 526, và giữa chúng KHÔNG có khoảng trống nào. 168 cái hỏng đã biến mất, và chẳng có gì trong ứng dụng thay đổi cả — nó vẫn mất 1,5 giây để khởi động.</p>

<h3>Cách bố trí</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Trước</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Nginx, cổng cố định — cái duy nhất thế giới bên ngoài biết tới.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3101</span><span class="lz-nsub">Bản A, đang phục vụ.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3102</span><span class="lz-nsub">Trống.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Sau</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">client → :3200</span><span class="lz-nsub">Không đổi. Client không hề biết là có chuyện gì xảy ra.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">upstream → :3102</span><span class="lz-nsub">Bản B, không nhận lưu lượng nào cho tới khi nó qua được phép kiểm.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">:3101</span><span class="lz-nsub">Bản A, đang xả nốt rồi thoát.</span></div></div>
  </div>
</div>
<p>Cái cổng cố định thuộc về PROXY, còn ứng dụng thì di chuyển giữa hai cổng nằm sau nó. Không có gì bên ngoài cái máy từng nhìn thấy sự thay đổi đó.</p>
<pre><code><span class="tok-comment"># upstream.conf — tep DUY NHAT ma lan deploy sua</span>
upstream ungdung { server 127.0.0.1:3101; keepalive 16; }

<span class="tok-comment"># nginx.conf — khong bao gio doi</span>
server {
    listen 80;
    location / {
        proxy_pass http://ungdung;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_next_upstream error timeout http_502 http_503;
    }
}</code></pre>
<div class="note-ct"><code>proxy_next_upstream</code> là tấm lưới an toàn: nếu backend được chọn từ chối kết nối hoặc trả 502/503, Nginx thử lại request đó vào một máy khác trong bể thay vì đẩy cái lỗi tới client. Với một máy trong bể thì nó làm được ít; với cả bản cũ lẫn bản mới cùng nằm trong danh sách suốt lúc chuyển thì nó phủ trọn cái vết nứt.</div>

<h3>Lần deploy, bốn bước</h3>
<pre><code>set -euo pipefail
CU=3101; MOI=3102

<span class="tok-comment"># 1. khoi dong ban moi — ban cu VAN dang phuc vu</span>
V=B CONG=\$MOI setsid nohup node app.mjs &gt;/var/log/app-b.log 2&gt;&amp;1 &lt;/dev/null &amp;

<span class="tok-comment"># 2. CHO toi khi no THAT SU tra loi — khong phai sleep</span>
for i in \$(seq 1 40); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        http://127.0.0.1:\$MOI/health)" = "200" ] &amp;&amp; break
  sleep 0.1
  [ "\$i" = "40" ] &amp;&amp; { echo "ban moi khong len duoc sau 4s" &gt;&amp;2; exit 1; }
done

<span class="tok-comment"># 3. chuyen luu luong — mot thao tac nguyen tu</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; upstream.conf
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. gio moi dung ban cu, TU TE</span>
sleep 2
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>
<div class="callout ok"><strong>Bước 2 mới là bước giành được con số không.</strong> Phép đo in ra <code>ban B san sang sau 1500ms</code> — cái vòng lặp hỏi cho tới khi bản mới THẬT SỰ trả lời, và nó mất đúng bằng thời gian khởi động của nó. Thay cái vòng lặp đó bằng <code>sleep 1</code> thì lưu lượng đã bị chuyển sang một tiến trình CHƯA sẵn sàng, và mấy cái hỏng sẽ quay lại dưới một hình dạng khác: 502 từ Nginx thay vì lỗi từ chối kết nối. Thay nó bằng <code>sleep 10</code> thì chạy được và làm MỌI lần deploy chậm thêm tám giây mà chẳng vì lý do gì.</div>
<div class="pitfall"><strong>Bẫy — dòng <code>sleep 2</code> ở bước 4 không phải đồ trang trí, và nó cũng KHÔNG đủ.</strong> Nginx hoàn tất việc nạp lại một cách BẤT ĐỒNG BỘ: các tiến trình worker cũ vẫn phục vụ nốt request đang bay của chúng trong khi worker mới nhận request mới. Giết ứng dụng cũ ngay sau lệnh <code>reload</code> có thể cắt đứt một request mà một worker cũ vẫn đang proxy. Hai giây phủ được một ứng dụng nhanh; bản trung thực thì chờ tới khi backend cũ báo không còn request nào đang bay, hoặc đơn giản là chờ lâu hơn cái request chậm nhất của bạn. Đây vẫn là cái vết nứt ở Bài 3.2, chỉ lùi ra ngoài một lớp.</div>

<h3>Một ngõ cụt đáng biết</h3>
<p>Có một cách trông gọn gàng hơn: cho cả hai tiến trình cùng gắn vào <em>MỘT</em> cổng bằng <code>SO_REUSEPORT</code>, thế thì chẳng cần proxy nào. Đo trên chính máy chủ này:</p>
<div class="out">  [A] da gan cong 3198
  [B] HONG: EADDRINUSE
  --- so socket dang nghe cong 3198 ---
  1
  --- 20 request, phan bo vao hai tien trinh ---
       20 A</div>
<div class="callout warn"><strong><code>reusePort: true</code> được NHẬN và chẳng làm gì cả.</strong> Node v20.20.2 nhận cái tuỳ chọn đó không kêu ca gì, và tiến trình thứ hai vẫn hỏng với <code>EADDRINUSE</code> — một socket, cả hai mươi request vào A. Tuỳ chọn này chạy đúng ở những bản Node về sau, nên đây là ngõ cụt theo PHIÊN BẢN chứ không phải một ý tưởng hỏng. Nó đáng được báo lại vì hai lẽ: một tuỳ chọn bị PHỚT LỜ LẶNG LẼ thì tệ hơn một tuỳ chọn báo lỗi, và một chiến lược deploy phụ thuộc vào một tính năng runtime mà bạn chưa kiểm trên runtime CỦA MÌNH là một chiến lược sẽ hỏng ngay ở lần deploy thật đầu tiên.</div>
<p>Cách dùng proxy thì không có sự phụ thuộc nào như vậy. Nó chạy trên mọi runtime, mọi ngôn ngữ và mọi phiên bản, vì thứ duy nhất cần hỗ trợ nó là một con proxy ngược mà bạn vốn đã có.</p>

<h3>Các biến thể của cùng một hình dạng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hai cổng cộng một proxy — đo ở trên</span><span class="lz-lnote">Câu trả lời tổng quát. Cần một proxy đứng trước, mà mọi website phục vụ TLS thì đều đã có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hai container cộng một proxy</span><span class="lz-lnote">Y hệt, chỉ thay việc khởi động một tiến trình bằng <code>docker compose up -d</code>. Tên dịch vụ trong compose thay cho số cổng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một dịch vụ kích hoạt-bằng-socket</span><span class="lz-lnote">systemd giữ cái socket lắng nghe rồi trao nó cho tiến trình nào đang là hiện hành, nên kết nối XẾP HÀNG trong nhân hệ điều hành suốt lúc tráo thay vì bị từ chối. Thanh lịch, và nó buộc cách bố trí này dính vào systemd.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nhiều worker, khởi động lại từng cái một</span><span class="lz-lnote">Một cú khởi động lại cuốn chiếu, đó là thứ <code>pm2 reload</code> và chính lệnh reload của Nginx đang làm. Cùng nguyên lý — LUÔN có thứ gì đó đang lắng nghe — áp dụng bên trong một nhóm tiến trình thay vì bắc qua hai nhóm.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">ngx_http_upstream_module — proxy_next_upstream</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_upstream_module.html — những kiểu hỏng nào được thử lại vào backend khác, và những kiểu CỐ Ý không.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">socket(7) — SO_REUSEPORT</span><span class="lc-sub">man7.org/linux/man-pages/man7/socket.7.html — cái tuỳ chọn đó hứa gì ở tầng nhân hệ điều hành, mà đó không phải thứ phép đo ở trên cho thấy ở tầng Node.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.socket(5) — kích hoạt bằng socket</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.socket.html — biến thể mà nhân hệ điều hành xếp hàng kết nối xuyên qua một lần khởi động lại.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — khối upstream, keepalive và nạp lại cấu hình</span><span class="lc-sub">/courses/nginx/learn${REF} — phía proxy của bài này ở mức sâu, kể cả vì sao cái header Connection rỗng là bắt buộc cho keepalive lên upstream.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Keeping it running: a service manager instead of nohup|||3.4 — Giữ cho nó chạy: một trình quản lý dịch vụ thay cho nohup',
      slug: 'deploy-3-4-trinh-quan-ly-dich-vu',
      type: 'LESSON',
      description: 'Ứng dụng sập, và năm giây sau vẫn chẳng có gì lắng nghe — nohup không khởi động lại bất cứ thứ gì. Bài này viết một unit systemd thay thế, rồi systemd-analyze verify tìm ra một dòng trong đó bị PHỚT LỜ LẶNG LẼ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Keeping it running: a service manager instead of <code>nohup</code></h2>
<p class="lead">Every measurement so far started the application with <code>setsid nohup node app.mjs &amp;</code>. That is enough to survive the SSH session ending, and it is enough for nothing else. This lesson measures what it does not cover, and replaces it.</p>

<h3>What <code>nohup</code> does when the application crashes</h3>
<div class="out">════ KHONG co trinh giam sat ════
  truoc khi sap:      ma=200  socket=1
  sau khi sap:        ma=000  socket=0
  5 giay sau:         ma=000  socket=0
  → nohup khong khoi dong lai; tien trinh chet la chet</div>
<p>One unhandled exception, and the site is down until a human notices. <code>nohup</code> detaches a process from a terminal; it has no opinion about whether the process should be running. The same applies to a reboot: <code>nohup</code> survives a logout, not a restart, so an unattended reboot at 4 a.m. leaves the machine up and the site down.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A crash is not the main case</span><span class="v">Applications crash rarely. Machines reboot for kernel updates, hosts migrate, and out-of-memory kills happen — Chapter 8 measures one. All of those need something that starts the application again.</span></div>
  <div class="kv"><span class="k">Logs go wherever you redirected them</span><span class="v">Usually a file that grows forever, because nothing rotates it. Chapter 8 measures a disk filling up; an unrotated application log is one of the standard ways.</span></div>
  <div class="kv"><span class="k">There is no way to ask "is it running?"</span><span class="v">Only <code>ps</code> and guesswork. No status, no uptime, no restart count, no record of why it last stopped.</span></div>
  <div class="kv"><span class="k">Environment comes from whoever ran it</span><span class="v">The variables in your interactive shell at that moment. Which is why an application started by hand works and the same application started by cron does not.</span></div>
</div>

<h3>The unit file</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/app.service</span>
[Unit]
Description=Ung dung web
After=network-online.target
Wants=network-online.target
StartLimitBurst=5
StartLimitIntervalSec=60

[Service]
Type=exec
User=trienkhai
WorkingDirectory=/srv/app/hien-tai
EnvironmentFile=/srv/app/chung/.env
ExecStart=/opt/node22/bin/node src/server.js
Restart=on-failure
RestartSec=2s
KillSignal=SIGTERM
TimeoutStopSec=15s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>WorkingDirectory=/srv/app/hien-tai</code></span><span class="lz-d">The symlink from Lesson 0.4. A restart picks up whichever release it currently points at, so the swap and the service manager are the same mechanism rather than two competing ones.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>EnvironmentFile</code> points outside the release</span><span class="lz-d">Configuration lives in the shared directory, so a deploy cannot overwrite it and a rollback cannot revert it. This is Lesson 1.1's category 4, and Chapter 4 is entirely about it.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>Restart=on-failure</code>, not <code>always</code></span><span class="lz-d"><code>on-failure</code> restarts on a crash or a non-zero exit, and leaves it alone after a clean exit or a deliberate <code>systemctl stop</code>. <code>always</code> restarts even after you stopped it on purpose, which turns a maintenance window into a fight.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>KillSignal</code> and <code>TimeoutStopSec</code></span><span class="lz-d">The other half of Lesson 3.2. <code>SIGTERM</code> first, then 15 seconds, then <code>SIGKILL</code>. Set the timeout slightly higher than your own shutdown deadline so your code decides what gets abandoned.</span></div>
</div>

<h3><code>systemd-analyze verify</code>, and the line it caught</h3>
<p>The first version of that unit had <code>StartLimitBurst</code> and <code>StartLimitIntervalSec</code> in the <code>[Service]</code> section, which looks natural — they are about restarting a service. Run through the validator:</p>
<div class="out">$ systemd-analyze verify /tmp/app.service

  app.service:15: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
  app.service: Command /usr/bin/node is not executable: No such file or directory</div>
<div class="pitfall"><strong>Trap — a directive in the wrong section is ignored, not rejected.</strong> systemd loads the unit, starts the service, and simply does not apply that setting. The restart rate-limiting you thought you had configured is absent, so a service in a crash loop restarts forever at two-second intervals instead of giving up after five attempts — which is exactly the state where a broken deploy generates thousands of log lines and hides the original error. Nothing about a running service tells you the line was ignored; the only way to find out is the validator, or reading the journal at boot very carefully.</div>
<p>The second finding is more prosaic and just as useful: the path was wrong. <code>node</code> on this machine is at <code>/opt/node22/bin/node</code>. <code>ExecStart</code> requires an absolute path — there is no <code>PATH</code> lookup — and a unit with the wrong one fails at start with a message people routinely read as "node is not installed".</p>
<div class="out">=== sau khi chuyen StartLimit* sang [Unit] va sua duong dan node ===
  (khong con canh bao nao — unit hop le)</div>
<div class="callout ok"><strong>Run <code>systemd-analyze verify</code> on every unit before enabling it.</strong> It parses the file the way systemd will, checks that every key belongs where you put it, and confirms the binary exists. It is the <code>nginx -t</code> of service files — and like <code>nginx -t</code> (Lesson 11.2 of the Nginx course), it proves the file loads and not that the service works.</div>

<h3>The commands that replace <code>ps</code> and guessing</h3>
<pre><code>systemctl status app          <span class="tok-comment"># dang chay? tu bao gio? khoi dong lai may lan?</span>
systemctl restart app         <span class="tok-comment"># SIGTERM, cho, roi khoi dong lai</span>
systemctl reload app          <span class="tok-comment"># neu unit khai ExecReload</span>
journalctl -u app -f          <span class="tok-comment"># log, dang chay</span>
journalctl -u app -n 50 --no-pager   <span class="tok-comment"># 50 dong cuoi</span>
journalctl -u app --since '10 min ago' -p err   <span class="tok-comment"># chi loi, 10 phut qua</span>
systemctl show app -p NRestarts      <span class="tok-comment"># no da sap bao nhieu lan</span></code></pre>
<div class="note-ct"><code>NRestarts</code> is the one worth putting in a dashboard. A service that is up but has restarted forty times today is a service in trouble, and every other check — the port is open, the health endpoint answers — reports it as healthy between crashes. Chapter 9 covers what else is worth watching.</div>

<h3>Where this meets the swap</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Simple: one unit, restart after the symlink moves</span><span class="lz-lnote"><code>ln -sfn … &amp;&amp; systemctl restart app</code>. Costs the outage measured in Lesson 3.1, so it suits a low-traffic site where 94 ms and one dropped request is acceptable.</span></div>
  <div class="lz-layer"><span class="lz-lname">Zero-downtime: two units, one proxy</span><span class="lz-lnote"><code>app-blue.service</code> and <code>app-green.service</code> on two ports, with the Lesson 3.3 switch between them. The service manager handles crashes and reboots; the proxy handles the swap.</span></div>
  <div class="lz-layer"><span class="lz-lname">A template unit</span><span class="lz-lnote"><code>app@.service</code> started as <code>app@3101</code> and <code>app@3102</code>, with <code>%i</code> as the port. One file for both colours.</span></div>
  <div class="lz-layer"><span class="lz-lname">In containers, the runtime is the service manager</span><span class="lz-lnote"><code>restart: unless-stopped</code> in Compose is <code>Restart=on-failure</code>, and the Docker daemon's own unit is what survives the reboot. Same roles, different names.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — every directive in the unit above, including the table of what <code>Restart=</code> considers a failure.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.unit(5) — section rules</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.unit.html — which keys belong in <code>[Unit]</code> rather than <code>[Service]</code>, which is what the validator caught above.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">systemd-analyze(1) — verify, security, blame</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd-analyze.html — <code>verify</code> for correctness and <code>security</code> for a hardening score on your unit.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — systemd units, timers and the journal</span><span class="lc-sub">/courses/linux-bash/learn${REF} — services, targets and dependency ordering in depth.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Giữ cho nó chạy: một trình quản lý dịch vụ thay cho <code>nohup</code></h2>
<p class="lead">Mọi phép đo từ đầu tới giờ đều khởi động ứng dụng bằng <code>setsid nohup node app.mjs &amp;</code>. Chừng đó đủ để sống sót khi phiên SSH kết thúc, và không đủ cho bất cứ điều gì khác. Bài này đo những thứ nó KHÔNG phủ, rồi thay thế nó.</p>

<h3><code>nohup</code> làm gì khi ứng dụng SẬP</h3>
<div class="out">════ KHONG co trinh giam sat ════
  truoc khi sap:      ma=200  socket=1
  sau khi sap:        ma=000  socket=0
  5 giay sau:         ma=000  socket=0
  → nohup khong khoi dong lai; tien trinh chet la chet</div>
<p>Một ngoại lệ không bắt được, và website chết cho tới khi có người phát hiện. <code>nohup</code> TÁCH một tiến trình khỏi terminal; nó chẳng có ý kiến gì về việc tiến trình đó CÓ NÊN đang chạy hay không. Điều tương tự đúng với một lần khởi động lại máy: <code>nohup</code> sống sót qua một lần đăng xuất, chứ không qua một lần restart, nên một cú reboot tự động lúc 4 giờ sáng để lại cái máy sống và website chết.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Sập KHÔNG phải trường hợp chính</span><span class="v">Ứng dụng ít khi sập. Nhưng máy thì khởi động lại để cập nhật nhân, máy chủ vật lý thì được di trú, và những cú giết vì hết bộ nhớ thì có xảy ra — Chương 8 đo một cú. Tất cả những cái đó đều cần một thứ khởi động ứng dụng LẠI.</span></div>
  <div class="kv"><span class="k">Log đi tới đúng chỗ bạn chuyển hướng nó</span><span class="v">Thường là một cái tệp phình ra mãi mãi, vì chẳng có gì xoay vòng nó. Chương 8 đo một cái đĩa bị làm đầy; một tệp log ứng dụng không được xoay vòng là một trong những cách chuẩn mực để làm chuyện đó.</span></div>
  <div class="kv"><span class="k">Không có cách nào hỏi "nó còn chạy không?"</span><span class="v">Chỉ có <code>ps</code> và phỏng đoán. Không trạng thái, không thời gian sống, không số lần khởi động lại, không ghi chép nào về lý do lần trước nó dừng.</span></div>
  <div class="kv"><span class="k">Biến môi trường tới từ người đã chạy nó</span><span class="v">Đúng những biến trong shell tương tác của bạn ở khoảnh khắc ấy. Đó là lý do một ứng dụng khởi động bằng tay thì chạy còn chính nó khởi động bằng cron thì không.</span></div>
</div>

<h3>Tệp unit</h3>
<pre><code><span class="tok-comment"># /etc/systemd/system/app.service</span>
[Unit]
Description=Ung dung web
After=network-online.target
Wants=network-online.target
StartLimitBurst=5
StartLimitIntervalSec=60

[Service]
Type=exec
User=trienkhai
WorkingDirectory=/srv/app/hien-tai
EnvironmentFile=/srv/app/chung/.env
ExecStart=/opt/node22/bin/node src/server.js
Restart=on-failure
RestartSec=2s
KillSignal=SIGTERM
TimeoutStopSec=15s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t"><code>WorkingDirectory=/srv/app/hien-tai</code></span><span class="lz-d">Chính cái symlink ở Bài 0.4. Một lần khởi động lại sẽ lấy bản phát hành mà nó ĐANG trỏ vào, nên bước tráo và trình quản lý dịch vụ là CÙNG một cơ chế chứ không phải hai thứ giẫm chân nhau.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t"><code>EnvironmentFile</code> trỏ ra NGOÀI bản phát hành</span><span class="lz-d">Cấu hình sống ở thư mục dùng chung, nên một lần deploy KHÔNG ghi đè được nó và một cú lùi bản KHÔNG hoàn tác được nó. Đây là loại 4 ở Bài 1.1, và Chương 4 dành trọn cho nó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t"><code>Restart=on-failure</code>, không phải <code>always</code></span><span class="lz-d"><code>on-failure</code> khởi động lại khi sập hoặc thoát khác 0, và ĐỂ YÊN sau một lần thoát sạch hoặc một lệnh <code>systemctl stop</code> cố ý. <code>always</code> thì khởi động lại ngay cả khi bạn CỐ TÌNH dừng nó, biến một cửa sổ bảo trì thành một cuộc vật lộn.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t"><code>KillSignal</code> và <code>TimeoutStopSec</code></span><span class="lz-d">Nửa còn lại của Bài 3.2. <code>SIGTERM</code> trước, rồi 15 giây, rồi <code>SIGKILL</code>. Hãy đặt timeout nhỉnh hơn hạn chót tắt của chính bạn để MÃ CỦA BẠN quyết định cái gì bị bỏ rơi.</span></div>
</div>

<h3><code>systemd-analyze verify</code>, và cái dòng nó bắt được</h3>
<p>Bản đầu tiên của cái unit đó đặt <code>StartLimitBurst</code> và <code>StartLimitIntervalSec</code> trong mục <code>[Service]</code>, và điều đó trông rất tự nhiên — chúng nói về việc khởi động lại một dịch vụ mà. Đưa qua bộ kiểm:</p>
<div class="out">$ systemd-analyze verify /tmp/app.service

  app.service:15: Unknown key name 'StartLimitIntervalSec' in section 'Service', ignoring.
  app.service: Command /usr/bin/node is not executable: No such file or directory</div>
<div class="pitfall"><strong>Bẫy — một chỉ thị đặt SAI MỤC thì bị PHỚT LỜ, chứ không bị từ chối.</strong> systemd nạp cái unit, khởi động dịch vụ, và đơn giản là KHÔNG áp dụng thiết lập đó. Cái giới hạn tần suất khởi động lại mà bạn tưởng đã cấu hình thì KHÔNG tồn tại, nên một dịch vụ đang trong vòng lặp sập sẽ khởi động lại MÃI MÃI mỗi hai giây thay vì bỏ cuộc sau năm lần — mà đó đúng là cái trạng thái một lần deploy hỏng sinh ra hàng nghìn dòng log và che mất lỗi gốc. Chẳng có gì ở một dịch vụ đang chạy cho bạn biết cái dòng đó đã bị bỏ qua; cách duy nhất để biết là bộ kiểm, hoặc đọc journal lúc khởi động thật kỹ.</div>
<p>Phát hiện thứ hai thì tầm thường hơn và hữu ích chẳng kém: đường dẫn SAI. <code>node</code> trên máy này nằm ở <code>/opt/node22/bin/node</code>. <code>ExecStart</code> đòi một đường dẫn TUYỆT ĐỐI — không hề có chuyện tra <code>PATH</code> — và một unit ghi sai đường dẫn sẽ hỏng lúc khởi động với một thông báo mà người ta thường đọc thành "chưa cài node".</p>
<div class="out">=== sau khi chuyen StartLimit* sang [Unit] va sua duong dan node ===
  (khong con canh bao nao — unit hop le)</div>
<div class="callout ok"><strong>Hãy chạy <code>systemd-analyze verify</code> trên MỌI unit trước khi bật nó.</strong> Nó phân tích tệp theo đúng cách systemd sẽ làm, kiểm xem mọi khoá có nằm đúng chỗ bạn đặt không, và xác nhận cái nhị phân có tồn tại. Nó là <code>nginx -t</code> của tệp dịch vụ — và giống <code>nginx -t</code> (Bài 11.2 của khoá Nginx), nó chứng minh tệp NẠP ĐƯỢC chứ không chứng minh dịch vụ CHẠY ĐƯỢC.</div>

<h3>Những lệnh thay thế cho <code>ps</code> và sự phỏng đoán</h3>
<pre><code>systemctl status app          <span class="tok-comment"># dang chay? tu bao gio? khoi dong lai may lan?</span>
systemctl restart app         <span class="tok-comment"># SIGTERM, cho, roi khoi dong lai</span>
systemctl reload app          <span class="tok-comment"># neu unit khai ExecReload</span>
journalctl -u app -f          <span class="tok-comment"># log, dang chay</span>
journalctl -u app -n 50 --no-pager   <span class="tok-comment"># 50 dong cuoi</span>
journalctl -u app --since '10 min ago' -p err   <span class="tok-comment"># chi loi, 10 phut qua</span>
systemctl show app -p NRestarts      <span class="tok-comment"># no da sap bao nhieu lan</span></code></pre>
<div class="note-ct"><code>NRestarts</code> là con số đáng đưa lên bảng theo dõi. Một dịch vụ đang SỐNG mà hôm nay đã khởi động lại bốn mươi lần là một dịch vụ đang gặp chuyện, và mọi phép kiểm khác — cổng đang mở, endpoint sức khoẻ trả lời — đều báo nó khoẻ mạnh trong những quãng giữa các lần sập. Chương 9 nói về những thứ khác đáng theo dõi.</div>

<h3>Chỗ nó gặp bước tráo</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đơn giản: một unit, khởi động lại sau khi symlink dịch chuyển</span><span class="lz-lnote"><code>ln -sfn … &amp;&amp; systemctl restart app</code>. Tốn đúng cái gián đoạn đo ở Bài 3.1, nên nó hợp với một website ít lưu lượng mà 94 ms cùng một request rơi là chấp nhận được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Không gián đoạn: hai unit, một proxy</span><span class="lz-lnote"><code>app-blue.service</code> và <code>app-green.service</code> trên hai cổng, với cú chuyển ở Bài 3.3 giữa chúng. Trình quản lý dịch vụ lo chuyện sập và reboot; proxy lo chuyện tráo.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một unit dạng khuôn</span><span class="lz-lnote"><code>app@.service</code> khởi động thành <code>app@3101</code> và <code>app@3102</code>, với <code>%i</code> là số cổng. Một tệp cho cả hai màu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trong container, chính runtime là trình quản lý dịch vụ</span><span class="lz-lnote"><code>restart: unless-stopped</code> trong Compose chính là <code>Restart=on-failure</code>, và cái unit của chính Docker daemon mới là thứ sống sót qua lần reboot. Cùng vai trò, khác tên gọi.</span></div>
</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.service(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.service.html — mọi chỉ thị trong cái unit ở trên, kèm bảng nói <code>Restart=</code> coi cái gì là một lần hỏng.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd.unit(5) — luật về các mục</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd.unit.html — khoá nào thuộc về <code>[Unit]</code> chứ không phải <code>[Service]</code>, chính là thứ bộ kiểm đã bắt được ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">systemd-analyze(1) — verify, security, blame</span><span class="lc-sub">freedesktop.org/software/systemd/man/systemd-analyze.html — <code>verify</code> để kiểm tính đúng đắn và <code>security</code> để chấm điểm gia cố cho unit của bạn.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — unit systemd, timer và journal</span><span class="lc-sub">/courses/linux-bash/learn${REF} — dịch vụ, target và thứ tự phụ thuộc ở mức sâu.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — The complete swap script|||3.5 — Script tráo hoàn chỉnh',
      slug: 'deploy-3-5-script-trao-hoan-chinh',
      type: 'LESSON',
      description: 'Ba lần tráo liên tiếp, 1.653 request, không cái nào hỏng. Nhưng lần chạy đầu tiên chỉ tráo được MỘT lần rồi tự khoá chính mình lại vĩnh viễn — và nguyên nhân là một mô tả tệp đi lạc vào chỗ không ai ngờ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>The complete swap script</h2>
<p class="lead">Everything in this chapter, assembled into one script and run three times in a row under continuous load. It works — but only after the first version deadlocked itself permanently on the second deploy, for a reason that took a look inside <code>/proc</code> to find.</p>

<h3>The script</h3>
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh</span>
set -euo pipefail
GOC=/srv/app; CONG_A=3101; CONG_B=3102

<span class="tok-comment"># mot lan trao tai mot thoi diem (Bai 2.5)</span>
exec 9&gt;/var/lock/trao.lock
flock -w 30 9 || { echo "co lan trao khac dang chay" &gt;&amp;2; exit 1; }

<span class="tok-comment"># mau nao dang chay? mau kia la dich</span>
CU=\$(grep -oE '127\\.0\\.0\\.1:[0-9]+' "\$GOC/upstream.conf" | cut -d: -f2)
MOI=\$([ "\$CU" = "\$CONG_A" ] &amp;&amp; echo "\$CONG_B" || echo "\$CONG_A")
echo "  dang chay tren \$CU → se chuyen sang \$MOI"

<span class="tok-comment"># 1. khoi dong ban moi — 9&gt;&amp;- la BAT BUOC, xem duoi</span>
CONG=\$MOI setsid nohup node "\$GOC/hien-tai/app.mjs" \\
     &gt;"/var/log/app-\$MOI.log" 2&gt;&amp;1 &lt;/dev/null 9&gt;&amp;- &amp;

<span class="tok-comment"># 2. cho toi khi no THAT SU tra loi</span>
san_sang=0
for i in \$(seq 1 60); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        "http://127.0.0.1:\$MOI/health")" = "200" ] &amp;&amp; { san_sang=1; break; }
  sleep 0.1
done
if [ "\$san_sang" != 1 ]; then
  echo "ban moi KHONG len duoc — giu nguyen ban cu" &gt;&amp;2
  pkill -f "CONG=\$MOI" || true
  exit 1
fi

<span class="tok-comment"># 3. chuyen luu luong</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; "\$GOC/upstream.conf"
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. kiem qua CUA TRUOC — va lui lai neu hong</span>
sleep 1
MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1/health)
if [ "\$MA" != "200" ]; then
  echo "KIEM HONG (\$MA) — chuyen NGUOC ve \$CU" &gt;&amp;2
  echo "upstream ungdung { server 127.0.0.1:\$CU; keepalive 16; }" &gt; "\$GOC/upstream.conf"
  nginx -s reload
  exit 1
fi

<span class="tok-comment"># 5. gio moi dung ban cu, tu te</span>
sleep 1
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>

<h3>Three deploys in a row, under load</h3>
<div class="out">  dang chay tren 3101 → se chuyen sang 3102
  ban moi san sang sau 200ms
  kiem qua proxy: 200
  da SIGTERM ban cu tren 3101 — XONG
  ── trao 1 xong ──
  dang chay tren 3102 → se chuyen sang 3101
  ...
  ── trao 2 xong ──
  dang chay tren 3101 → se chuyen sang 3102
  ...
  ── trao 3 xong ──

  200: 1653   loi ket noi: 0   ma khac: 0
  phan bo ban: {'v1': 96, 'v2': 338, 'v3': 344, 'v4': 875}</div>
<div class="callout ok"><strong>1,653 requests across three version changes, zero failures.</strong> The port ping-pongs between 3101 and 3102 — there is no "blue is always primary", just two slots and whichever one is not in use. All four versions appear in the distribution, so every swap really happened.</div>

<h3>The bug in the first version</h3>
<p>The first run deployed once, correctly, and then every subsequent deploy printed this:</p>
<div class="out">  co lan trao khac dang chay
  ma thoat: 1</div>
<p>No deploy was running. The lock was held anyway, and it stayed held. Looking at what was holding it:</p>
<div class="out">  tien trinh ung dung dang chay: pid=2944
  --- no dang giu nhung mo ta tep nao trong /var/lock ---
    l-wx------ 1 root root 64 Aug 23 20:55 9 -&gt; /run/lock/trao.lock
  --- ai dang giu khoa tren trao.lock ---
    /run/lock/trao.lock: root 2944 F.... node</div>
<div class="pitfall"><strong>Trap — a background process started inside the locked section inherits the lock file descriptor and holds the lock for as long as it lives.</strong> <code>exec 9&gt;file</code> opens descriptor 9 in the shell; every child inherits it, including the application the deploy just started. The script exits and releases <em>its</em> copy — but the application is still running, still holding fd 9, and <code>flock</code> considers the lock held. So the deploy script locks itself out permanently, and the only cure is killing the application it just started. The application is the last process on earth that should be holding your deploy lock, and nothing about it looks wrong from the outside.</div>
<p>The fix is four characters — <code>9&gt;&amp;-</code> closes descriptor 9 in the child only:</p>
<pre><code>CONG=\$MOI setsid nohup node app.mjs &gt;log 2&gt;&amp;1 &lt;/dev/null <strong>9&gt;&amp;-</strong> &amp;</code></pre>
<div class="note-ct">The general form of this problem is worth carrying: <em>anything a script opens, its children inherit</em> — lock descriptors, log files, sockets, the SSH connection itself. Lesson 0.3 measured the version where an inherited stdin makes <code>ssh</code> hang forever; this is the same mechanism holding a lock instead. When a long-lived process is started from a script, close everything it does not need. <code>lsof -p &lt;pid&gt;</code> or <code>ls -l /proc/&lt;pid&gt;/fd</code> shows what it actually holds.</div>

<h3>The five things this script does that a naive one does not</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">It refuses to run twice at once</span><span class="lz-d">The lock from Lesson 2.5, with <code>-w 30</code> so a concurrent deploy waits rather than failing — the newest change wins.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">It works out its own direction</span><span class="lz-d">Reading the current port out of the config rather than being told. That makes it idempotent in the useful sense: run it twice and you get two deploys, not a broken state, and there is no argument to get wrong.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">It waits for readiness rather than sleeping</span><span class="lz-d">200 ms in the measurement above, because the app was warm. The same loop covers a 30-second startup without being told about it, and gives up after 6 seconds rather than hanging.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">It checks through the front door</span><span class="lz-d">Step 4 tests <code>http://127.0.0.1/health</code> — through Nginx — not the backend port directly. That is what catches a proxy config that reloaded into a broken state, which a backend check cannot see.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">It reverses itself when that check fails</span><span class="lz-d">Switching the upstream back and reloading. The old version is still running at that point — step 5 has not happened yet — so the rollback is instant and complete. This is why stopping the old version is last.</span></div>
</div>
<div class="callout warn"><strong>What this script still does not do.</strong> It does not handle database migrations, which have to happen at a specific point relative to all of this and cannot be reversed by switching a port — Chapter 5. It does not prune old releases, so the disk grows — Lesson 1.5. It does not tell anyone it ran. And its rollback only covers a failure it detects <em>during</em> the deploy; a bug that surfaces twenty minutes later needs Chapter 6.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — redirections, and closing a descriptor</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Redirections — the <code>n&gt;&amp;-</code> form that fixed the lock bug, in the section nobody reads until they need it.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">fuser(1) and lsof(8)</span><span class="lc-sub">man7.org/linux/man-pages/man1/fuser.1.html — finding which process holds a file or a lock, which is how the bug above was identified rather than guessed at.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — the fd directory</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc.html — <code>/proc/&lt;pid&gt;/fd</code>, which shows every descriptor a process holds and where it points.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — file descriptors and what children inherit</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the mechanism behind both this bug and the hanging-ssh one in Lesson 0.3.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Script tráo hoàn chỉnh</h2>
<p class="lead">Toàn bộ chương này, lắp thành một script và chạy ba lần liên tiếp dưới tải liên tục. Nó chạy được — nhưng chỉ SAU KHI bản đầu tiên tự khoá chính nó lại vĩnh viễn ở lần deploy thứ hai, vì một lý do phải ngó vào tận <code>/proc</code> mới tìm ra.</p>

<h3>Cái script</h3>
<pre><code><span class="tok-comment">#!/bin/bash — trao.sh</span>
set -euo pipefail
GOC=/srv/app; CONG_A=3101; CONG_B=3102

<span class="tok-comment"># mot lan trao tai mot thoi diem (Bai 2.5)</span>
exec 9&gt;/var/lock/trao.lock
flock -w 30 9 || { echo "co lan trao khac dang chay" &gt;&amp;2; exit 1; }

<span class="tok-comment"># mau nao dang chay? mau kia la dich</span>
CU=\$(grep -oE '127\\.0\\.0\\.1:[0-9]+' "\$GOC/upstream.conf" | cut -d: -f2)
MOI=\$([ "\$CU" = "\$CONG_A" ] &amp;&amp; echo "\$CONG_B" || echo "\$CONG_A")
echo "  dang chay tren \$CU → se chuyen sang \$MOI"

<span class="tok-comment"># 1. khoi dong ban moi — 9&gt;&amp;- la BAT BUOC, xem duoi</span>
CONG=\$MOI setsid nohup node "\$GOC/hien-tai/app.mjs" \\
     &gt;"/var/log/app-\$MOI.log" 2&gt;&amp;1 &lt;/dev/null 9&gt;&amp;- &amp;

<span class="tok-comment"># 2. cho toi khi no THAT SU tra loi</span>
san_sang=0
for i in \$(seq 1 60); do
  [ "\$(curl -s -o /dev/null -w '%{http_code}' --max-time 1 \\
        "http://127.0.0.1:\$MOI/health")" = "200" ] &amp;&amp; { san_sang=1; break; }
  sleep 0.1
done
if [ "\$san_sang" != 1 ]; then
  echo "ban moi KHONG len duoc — giu nguyen ban cu" &gt;&amp;2
  pkill -f "CONG=\$MOI" || true
  exit 1
fi

<span class="tok-comment"># 3. chuyen luu luong</span>
echo "upstream ungdung { server 127.0.0.1:\$MOI; keepalive 16; }" &gt; "\$GOC/upstream.conf"
nginx -t &amp;&amp; nginx -s reload

<span class="tok-comment"># 4. kiem qua CUA TRUOC — va lui lai neu hong</span>
sleep 1
MA=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1/health)
if [ "\$MA" != "200" ]; then
  echo "KIEM HONG (\$MA) — chuyen NGUOC ve \$CU" &gt;&amp;2
  echo "upstream ungdung { server 127.0.0.1:\$CU; keepalive 16; }" &gt; "\$GOC/upstream.conf"
  nginx -s reload
  exit 1
fi

<span class="tok-comment"># 5. gio moi dung ban cu, tu te</span>
sleep 1
kill -TERM "\$(ss -ltnp | grep \":\$CU \" | grep -o 'pid=[0-9]*' | cut -d= -f2)"</code></pre>

<h3>Ba lần deploy liên tiếp, dưới tải</h3>
<div class="out">  dang chay tren 3101 → se chuyen sang 3102
  ban moi san sang sau 200ms
  kiem qua proxy: 200
  da SIGTERM ban cu tren 3101 — XONG
  ── trao 1 xong ──
  dang chay tren 3102 → se chuyen sang 3101
  ...
  ── trao 2 xong ──
  dang chay tren 3101 → se chuyen sang 3102
  ...
  ── trao 3 xong ──

  200: 1653   loi ket noi: 0   ma khac: 0
  phan bo ban: {'v1': 96, 'v2': 338, 'v3': 344, 'v4': 875}</div>
<div class="callout ok"><strong>1.653 request xuyên qua ba lần đổi phiên bản, KHÔNG cái nào hỏng.</strong> Cái cổng nảy qua nảy lại giữa 3101 và 3102 — không có chuyện "xanh luôn là chính", chỉ có HAI CHỖ và cái nào đang trống thì dùng. Cả bốn phiên bản đều xuất hiện trong bảng phân bố, nên mọi lần tráo đều đã thật sự xảy ra.</div>

<h3>Cái lỗi trong bản đầu tiên</h3>
<p>Lần chạy đầu tiên deploy được MỘT lần, đúng đắn, rồi mọi lần deploy sau đó đều in ra thế này:</p>
<div class="out">  co lan trao khac dang chay
  ma thoat: 1</div>
<p>Chẳng có lần deploy nào đang chạy cả. Cái khoá vẫn bị giữ, và nó cứ bị giữ mãi. Ngó xem cái gì đang giữ nó:</p>
<div class="out">  tien trinh ung dung dang chay: pid=2944
  --- no dang giu nhung mo ta tep nao trong /var/lock ---
    l-wx------ 1 root root 64 Aug 23 20:55 9 -&gt; /run/lock/trao.lock
  --- ai dang giu khoa tren trao.lock ---
    /run/lock/trao.lock: root 2944 F.... node</div>
<div class="pitfall"><strong>Bẫy — một tiến trình nền khởi động BÊN TRONG vùng đã khoá sẽ THỪA HƯỞNG mô tả tệp khoá và giữ cái khoá suốt đời nó.</strong> <code>exec 9&gt;file</code> mở mô tả tệp số 9 trong shell; MỌI tiến trình con đều thừa hưởng nó, kể cả cái ứng dụng mà lần deploy vừa khởi động. Script thoát và nhả bản sao của CHÍNH NÓ — nhưng ứng dụng thì vẫn chạy, vẫn giữ fd 9, và <code>flock</code> coi như cái khoá vẫn đang bị giữ. Thế là script deploy tự khoá mình ra ngoài VĨNH VIỄN, và cách chữa duy nhất là giết cái ứng dụng mà nó vừa khởi động. Ứng dụng là tiến trình cuối cùng trên đời này nên giữ cái khoá deploy của bạn, và nhìn từ bên ngoài thì chẳng có gì ở nó trông sai cả.</div>
<p>Cách sửa gồm bốn ký tự — <code>9&gt;&amp;-</code> đóng mô tả tệp số 9 CHỈ trong tiến trình con:</p>
<pre><code>CONG=\$MOI setsid nohup node app.mjs &gt;log 2&gt;&amp;1 &lt;/dev/null <strong>9&gt;&amp;-</strong> &amp;</code></pre>
<div class="note-ct">Dạng tổng quát của vấn đề này đáng mang theo: <em>bất cứ thứ gì một script MỞ RA thì con của nó THỪA HƯỞNG</em> — mô tả tệp khoá, tệp log, socket, và cả chính kết nối SSH. Bài 0.3 đã đo phiên bản mà một stdin bị thừa hưởng làm <code>ssh</code> treo mãi mãi; đây là cùng cơ chế ấy, chỉ khác là nó đang giữ một cái khoá. Khi khởi động một tiến trình sống lâu từ một script, hãy ĐÓNG mọi thứ nó không cần. <code>lsof -p &lt;pid&gt;</code> hoặc <code>ls -l /proc/&lt;pid&gt;/fd</code> cho thấy nó thật sự đang giữ những gì.</div>

<h3>Năm việc script này làm mà một script ngây thơ thì không</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Nó từ chối chạy hai lần cùng lúc</span><span class="lz-d">Cái khoá ở Bài 2.5, kèm <code>-w 30</code> để một lần deploy chồng lên thì CHỜ chứ không hỏng — thay đổi mới nhất thắng.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Nó tự tính ra hướng đi của mình</span><span class="lz-d">Đọc cổng hiện hành ra từ cấu hình thay vì được người ta bảo. Nhờ đó nó bất biến khi lặp lại theo nghĩa hữu ích: chạy hai lần thì ra hai lần deploy, chứ không ra một trạng thái hỏng, và chẳng có tham số nào để gõ nhầm.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Nó CHỜ sẵn sàng chứ không ngủ</span><span class="lz-d">200 ms trong phép đo ở trên, vì ứng dụng đang nóng. Vẫn vòng lặp đó phủ được một lần khởi động 30 giây mà chẳng cần ai báo trước, và nó bỏ cuộc sau 6 giây thay vì treo.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Nó kiểm qua CỬA TRƯỚC</span><span class="lz-d">Bước 4 thử <code>http://127.0.0.1/health</code> — đi XUYÊN QUA Nginx — chứ không thử thẳng vào cổng backend. Đó mới là thứ bắt được một cấu hình proxy vừa nạp lại vào một trạng thái hỏng, thứ mà một phép kiểm ở backend không nhìn thấy.</span></div>
  <div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Nó TỰ ĐẢO NGƯỢC khi phép kiểm đó hỏng</span><span class="lz-d">Chuyển upstream về lại rồi nạp lại. Ở thời điểm đó bản CŨ VẪN ĐANG CHẠY — bước 5 chưa xảy ra — nên cú lùi bản là tức thì và trọn vẹn. Đây chính là lý do việc dừng bản cũ phải nằm SAU CÙNG.</span></div>
</div>
<div class="callout warn"><strong>Những gì script này VẪN chưa làm.</strong> Nó không xử lý migration cơ sở dữ liệu, thứ phải xảy ra ở một thời điểm cụ thể so với tất cả những cái trên và KHÔNG đảo ngược được bằng cách đổi một số cổng — Chương 5. Nó không dọn bớt bản phát hành cũ, nên đĩa cứ phình ra — Bài 1.5. Nó không báo cho ai biết là nó đã chạy. Và cú lùi bản của nó chỉ phủ được một sự cố mà nó PHÁT HIỆN RA TRONG LÚC deploy; một cái lỗi lộ ra hai mươi phút sau thì cần Chương 6.</div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">bash(1) — chuyển hướng, và đóng một mô tả tệp</span><span class="lc-sub">gnu.org/software/bash/manual/bash.html#Redirections — dạng <code>n&gt;&amp;-</code> đã sửa được lỗi khoá ở trên, nằm trong mục mà chẳng ai đọc cho tới khi cần tới.</span></span></div>
<div class="link-card"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">fuser(1) và lsof(8)</span><span class="lc-sub">man7.org/linux/man-pages/man1/fuser.1.html — tìm xem tiến trình nào đang giữ một tệp hay một cái khoá, và đó là cách cái lỗi ở trên được TÌM RA chứ không phải được đoán.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — thư mục fd</span><span class="lc-sub">man7.org/linux/man-pages/man5/proc.html — <code>/proc/&lt;pid&gt;/fd</code>, nơi cho thấy mọi mô tả tệp một tiến trình đang giữ và chúng trỏ đi đâu.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — mô tả tệp và thứ mà tiến trình con thừa hưởng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cơ chế nằm sau cả cái lỗi này lẫn cái lỗi ssh-treo ở Bài 0.3.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 3.6 ─────────────────────────── */
    {
      title: '3.6 — Quiz: the swap|||3.6 — Quiz: bước tráo',
      slug: 'deploy-3-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về 168 request rơi mất, mười cú 503 đáng lẽ phải là 200, một tuỳ chọn được nhận rồi phớt lờ, một dòng systemd bị bỏ qua trong im lặng, và một ứng dụng giữ khư khư cái khoá deploy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.6</span>
<h2>Quiz: the swap</h2>
<p class="lead">Eight questions from a chapter in which three separate things were accepted without complaint and then silently did nothing — a Node option, a systemd directive, and a drain flag that made everything worse.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> The naive stop-then-start deploy lost <strong>168 of 514</strong> requests, all as connection errors with no HTTP status at all, and the outage lasted exactly as long as the application's startup time (3.1). <code>SIGKILL</code> abandoned ten in-flight requests with no response; <code>SIGTERM</code> kept them — but the first drain implementation answered all ten with <code>503</code>, because the handler consulted the shutdown flag <em>after</em> accepting the request, which from the user's side is a failed request either way. Serving them unchanged and adding only <code>Connection: close</code> produced ten <code>200</code>s with the listening socket already gone (3.2). Reordering the same deploy — start new, wait for readiness, switch traffic, stop old — produced <strong>733 requests and zero failures</strong>; and <code>reusePort: true</code> was accepted by Node v20.20.2 and did nothing, the second process still failing with <code>EADDRINUSE</code> (3.3). <code>nohup</code> does not restart anything: after a crash the port stayed closed indefinitely — and <code>systemd-analyze verify</code> found <code>StartLimitIntervalSec</code> in the wrong section, where systemd ignores it silently (3.4). Finally, the assembled script deployed once and then locked itself out forever, because the application it started inherited the lock file descriptor and held <code>/run/lock/trao.lock</code> for its entire life; <code>9&gt;&amp;-</code> fixed it, and three consecutive swaps then ran 1,653 requests with zero failures (3.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.6</span>
<h2>Quiz: bước tráo</h2>
<p class="lead">Tám câu ra từ một chương mà BA thứ khác nhau đều được chấp nhận không kêu ca gì rồi lặng lẽ chẳng làm gì cả — một tuỳ chọn của Node, một chỉ thị của systemd, và một cái cờ xả làm mọi thứ tệ hơn.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Lần deploy ngây thơ kiểu dừng-rồi-chạy-lại làm mất <strong>168 trên 514</strong> request, tất cả đều là lỗi KẾT NỐI không hề có mã HTTP nào, và cái gián đoạn kéo dài ĐÚNG BẰNG thời gian khởi động của ứng dụng (3.1). <code>SIGKILL</code> bỏ rơi mười request đang bay mà không trả lời gì; <code>SIGTERM</code> giữ được chúng — nhưng bản xả đầu tiên trả lời cả mười bằng <code>503</code>, vì bộ xử lý đi kiểm cái cờ tắt SAU KHI đã nhận request, mà từ phía người dùng thì đằng nào cũng là một request hỏng. Phục vụ chúng NGUYÊN VẸN và chỉ thêm <code>Connection: close</code> thì cho ra mười cú <code>200</code> với cái socket lắng nghe đã biến mất từ trước (3.2). Xếp lại thứ tự đúng lần deploy ấy — khởi động cái mới, chờ sẵn sàng, chuyển lưu lượng, dừng cái cũ — cho ra <strong>733 request và KHÔNG cái nào hỏng</strong>; còn <code>reusePort: true</code> thì được Node v20.20.2 chấp nhận và chẳng làm gì, tiến trình thứ hai vẫn hỏng với <code>EADDRINUSE</code> (3.3). <code>nohup</code> không khởi động lại bất cứ thứ gì: sau một cú sập thì cái cổng đóng vô thời hạn — và <code>systemd-analyze verify</code> tìm ra <code>StartLimitIntervalSec</code> nằm sai mục, chỗ mà systemd phớt lờ nó trong im lặng (3.4). Cuối cùng, cái script đã lắp xong deploy được một lần rồi tự khoá mình ra ngoài vĩnh viễn, vì cái ứng dụng nó vừa khởi động đã thừa hưởng mô tả tệp khoá và giữ <code>/run/lock/trao.lock</code> suốt đời nó; <code>9&gt;&amp;-</code> sửa được, và ba lần tráo liên tiếp sau đó chạy 1.653 request không cái nào hỏng (3.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'A stop-then-start deploy lost 168 requests, all with no HTTP status. Your app now starts in 200 ms instead of 1.5 s. What changed?|||Một lần deploy dừng-rồi-chạy-lại làm mất 168 request, tất cả đều không có mã HTTP. Giờ ứng dụng của bạn khởi động trong 200 ms thay vì 1,5 giây. Điều gì đã thay đổi?',
            options: [
              'The problem is solved — nothing is dropped now|||Vấn đề được giải quyết — giờ không rơi cái nào nữa',
              'The outage is shorter, not gone: it lasts as long as startup, and Lesson 0.1 measured one dropped request even on an app that started instantly|||Cái gián đoạn NGẮN HƠN chứ không biến mất: nó dài đúng bằng thời gian khởi động, và Bài 0.1 đo được VẪN có một request rơi ngay cả trên ứng dụng khởi động tức thì',
              'Nothing changes; the loss is a fixed cost|||Không đổi gì cả; mất mát là một chi phí cố định',
              'It gets worse, because restarts are more frequent|||Nó tệ hơn, vì khởi động lại nhiều hơn',
            ],
            correctIndex: 1,
            points: 10,
          },
          {
            question: 'During shutdown your handler checks a draining flag and returns 503. Ten in-flight requests all got 503, and the log said it closed cleanly. What is wrong?|||Lúc tắt, bộ xử lý của bạn kiểm một cái cờ đang-xả rồi trả 503. Mười request đang bay đều nhận 503, và log nói nó đã đóng sạch. Sai ở đâu?',
            options: [
              'Nothing — 503 correctly tells the client to retry|||Không sai gì — 503 báo đúng cho client biết là hãy thử lại',
              'Those requests were already accepted and should have been served normally; the flag should only add Connection: close, not change the response|||Những request đó đã được NHẬN rồi và lẽ ra phải được phục vụ bình thường; cái cờ chỉ nên thêm Connection: close, không nên đổi nội dung phản hồi',
              'The flag should be checked before server.close()|||Cái cờ nên được kiểm trước khi gọi server.close()',
              'The shutdown timeout was too short|||Hạn chót tắt quá ngắn',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why does calling server.close() stop new requests arriving even before existing ones finish?|||Vì sao gọi server.close() lại chặn được request mới ngay cả khi những cái đang có chưa xong?',
            options: [
              'It sets a flag that the handler checks|||Nó đặt một cái cờ để bộ xử lý đi kiểm',
              'It closes the listening socket immediately — measured as socket count going to 0 while ten requests were still being answered|||Nó ĐÓNG cái socket lắng nghe ngay lập tức — đo được là số socket về 0 trong khi mười request vẫn đang được trả lời',
              'It sends SIGTERM to itself|||Nó tự gửi SIGTERM cho chính mình',
              'It waits for the OS to reclaim the port|||Nó chờ hệ điều hành thu hồi cổng',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'In the zero-downtime deploy, why is waiting on a health check better than sleep 5 before switching traffic?|||Trong lần deploy không gián đoạn, vì sao chờ một phép kiểm sức khoẻ lại tốt hơn sleep 5 trước khi chuyển lưu lượng?',
            options: [
              'It is not; sleep is simpler and equally safe|||Không tốt hơn; sleep đơn giản hơn và an toàn ngang nhau',
              'sleep guesses: too short switches traffic to a process that is not ready and produces 502s, too long makes every deploy slower for no reason|||sleep là ĐOÁN: quá ngắn thì chuyển lưu lượng vào một tiến trình chưa sẵn sàng và sinh ra 502, quá dài thì làm mọi lần deploy chậm đi mà chẳng vì lý do gì',
              'sleep does not work in shell scripts|||sleep không chạy trong script shell',
              'The health check also warms the cache|||Phép kiểm sức khoẻ còn làm nóng bộ đệm luôn',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'You set reusePort: true so two processes can share a port, and the second process fails with EADDRINUSE. What is the lesson?|||Bạn đặt reusePort: true để hai tiến trình dùng chung một cổng, và tiến trình thứ hai hỏng với EADDRINUSE. Bài học là gì?',
            options: [
              'SO_REUSEPORT does not exist on Linux|||SO_REUSEPORT không tồn tại trên Linux',
              'The option was accepted and silently ignored on that Node version — a deploy strategy depending on a runtime feature must be verified on the runtime you actually run|||Tuỳ chọn đó được nhận rồi bị phớt lờ trong im lặng ở phiên bản Node đó — một chiến lược deploy phụ thuộc vào một tính năng runtime thì phải được KIỂM trên đúng cái runtime bạn đang chạy',
              'You must run both processes as root|||Bạn phải chạy cả hai tiến trình dưới quyền root',
              'The port must be above 1024|||Cổng phải lớn hơn 1024',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'systemd-analyze verify says "Unknown key name StartLimitIntervalSec in section Service, ignoring". What is the consequence if you deploy anyway?|||systemd-analyze verify nói "Unknown key name StartLimitIntervalSec in section Service, ignoring". Hậu quả là gì nếu bạn cứ deploy?',
            options: [
              'The service will refuse to start|||Dịch vụ sẽ từ chối khởi động',
              'The service runs fine, but restart rate-limiting is not applied — a crash-looping service restarts forever instead of giving up, burying the original error|||Dịch vụ chạy bình thường, nhưng giới hạn tần suất khởi động lại KHÔNG được áp — một dịch vụ trong vòng lặp sập sẽ khởi động lại mãi mãi thay vì bỏ cuộc, chôn mất lỗi gốc',
              'systemd moves the key to the right section|||systemd tự chuyển cái khoá sang đúng mục',
              'Only the log format is affected|||Chỉ định dạng log bị ảnh hưởng',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Your deploy script takes a flock, starts the app in the background, and exits. Every later deploy says another deploy is running. Why?|||Script deploy của bạn lấy một flock, khởi động ứng dụng ở nền, rồi thoát. Mọi lần deploy sau đều nói là có lần deploy khác đang chạy. Vì sao?',
            options: [
              'The lock file was never deleted|||Tệp khoá chưa bao giờ được xoá',
              'The app inherited the lock file descriptor and holds the lock for its whole life — close it in the child with 9>&-|||Ứng dụng đã THỪA HƯỞNG mô tả tệp khoá và giữ cái khoá suốt đời nó — hãy đóng nó trong tiến trình con bằng 9>&-',
              'flock -w is required|||Bắt buộc phải dùng flock -w',
              'Two deploys really are running|||Đúng là có hai lần deploy đang chạy thật',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'In the complete swap script, why is stopping the old version the last step rather than an earlier one?|||Trong script tráo hoàn chỉnh, vì sao việc dừng bản cũ lại nằm ở bước CUỐI chứ không phải sớm hơn?',
            options: [
              'To save time|||Để tiết kiệm thời gian',
              'Because until it stops, the old version is still a working rollback target — the post-switch check can reverse the upstream instantly and completely|||Vì chừng nào nó chưa dừng thì bản cũ vẫn là một ĐÍCH LÙI BẢN đang chạy được — phép kiểm sau khi chuyển có thể đảo ngược upstream một cách tức thì và trọn vẹn',
              'systemd requires that order|||systemd bắt buộc thứ tự đó',
              'It avoids a port conflict|||Nó tránh xung đột cổng',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
