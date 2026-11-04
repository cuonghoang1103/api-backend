const REF = '?ref=%2Fcourses%2Fobject-storage%2Flearn&reflabel=Object%20Storage';

export default {
  title: 'Section 0 — What object storage actually is|||Mục 0 — Object storage THẬT SỰ LÀ gì',
  slug: 'os-s0-intro',
  description: 'Ba bài về concept cơ bản: object storage ≠ file system, bucket/key/object model, S3 API là chuẩn de facto, R2 vs S3 vs GCS vs Azure Blob.',
  sortOrder: 1,
  lessons: [

    {
      title: 'Start here (1/2) — What object storage is, and why every app you use needs it|||Bắt đầu tại đây (1/2) — Object storage là gì, và vì sao mọi app bạn dùng đều cần nó',
      slug: 'os-0-0-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bài mở cửa cho người chưa từng nghe &quot;object storage&quot;: nó là gì (bằng hình ảnh đời thường trước), vì sao app không nhét ảnh của người dùng vào database hay ổ đĩa máy chủ, chuẩn S3 và Cloudflare R2, bạn gặp nó ở đâu (ngay trên site này — media.cuongthai.com), và khoá này sẽ cho bạn làm được gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Hello. Before any API call, know what object storage is — and why</h2>
<p class="lead">Welcome. If you have never heard the words &quot;object storage&quot;, or you have uploaded an avatar in an app without ever wondering where that file actually went, this lesson is for you. No commands to memorise yet. In fifteen minutes you will know what object storage is, why apps do not keep user files in their database or on the web server, what the &quot;S3 API&quot; and &quot;Cloudflare R2&quot; are, and where you have been using object storage all along — including on this very website.</p>
<p>This lesson and the next are the front door of the course. Lesson 2 of the pair shows why it matters in money and in safety, and gives you a study plan. After that, lesson 0.1 compares object storage with the filesystem you already know, and 0.2 teaches the three concepts every API call rests on.</p>

<h3>What object storage is — an everyday picture first</h3>
<p>Forget the textbook definition for a moment. Picture a <strong>left-luggage counter</strong> at a train station. You hand over a bag, they give you a numbered ticket, and they put the bag on a shelf. You cannot reach into the bag later and swap one shirt — you take the whole bag out and hand in a new one. You cannot browse the shelves; you just present your ticket and get your bag back. And the counter does not care what is in the bag.</p>
<p>Object storage is exactly that, for files: you hand it a file, you choose the <strong>ticket</strong> (called a <em>key</em>, such as <code>users/42/avatars/me.jpg</code>), and it stores the <strong>whole file</strong> (called an <em>object</em>) on a huge distributed shelf (called a <em>bucket</em>). You get the file back by its key. You replace a file by uploading a whole new one — you never edit part of it.</p>
<div class="callout ok"><strong>One sentence to keep:</strong> object storage is an internet service that stores whole files as immutable &quot;objects&quot;, each addressed by a text &quot;key&quot;, inside a container called a &quot;bucket&quot; — reachable over HTTP from anywhere.</div>

<h3>Why not just use the database, or the server's disk?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Not the database</span><span class="v">Databases are built for small, structured, queryable rows. A 50 MB video turns a database slow and huge, and backups become painful. Keep the <em>metadata</em> in the DB, the <em>bytes</em> in object storage.</span></div>
  <div class="kv"><span class="k">Not the web server's disk</span><span class="v">If files live on one server's disk, a second server cannot see them, the disk fills up, and a redeploy or crash can wipe them. Object storage is shared, effectively unlimited, and durable (11 nines).</span></div>
  <div class="kv"><span class="k">Served fast, globally</span><span class="v">A bucket plus a CDN serves the same image from an edge near each user, so your app server never spends bandwidth on it.</span></div>
</div>

<h3>The S3 API and Cloudflare R2</h3>
<p>In 2006 Amazon launched <strong>S3</strong> (Simple Storage Service). Its HTTP API became so common that almost every other provider copied it: today &quot;S3-compatible&quot; is a standard, like USB. <strong>Cloudflare R2</strong> is one such S3-compatible service — the one this course and this repo use. The big reason to pick R2: it charges <strong>nothing for egress</strong> (bytes served out), where AWS S3 charges about $0.09 per GB. Lesson 2.1 does that math; for now just know R2 speaks the S3 API, so everything you learn transfers.</p>

<h3>Where you have already met it — on this site</h3>
<p>Open any avatar or post image on this website and look at its address: the host is <code>media.cuongthai.com</code>, not the app domain. That is a Cloudflare R2 bucket (<code>cuonghoangdev-media</code>) served through Cloudflare's CDN. Every avatar, every post photo and video, every course attachment and music track you see here is an object with a key like <code>posts/1234/media/clip.mp4</code>. This course teaches the exact system running under your feet.</p>

<h3>What you will be able to do by the end</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Upload and serve files correctly</span><span class="lz-lnote">PUT with the right Content-Type and Cache-Control; serve through a CDN; never list the bucket</span></div>
<div class="lz-layer"><span class="lz-lname">Let the browser upload directly</span><span class="lz-lnote">Presigned URLs + CORS, so big files never pass through your server</span></div>
<div class="lz-layer"><span class="lz-lname">Keep it cheap and safe</span><span class="lz-lnote">Egress math, private buckets, signed URLs, key rotation, lifecycle rules</span></div>
<div class="lz-layer"><span class="lz-lname">Diagnose the classic failures</span><span class="lz-lnote">403 SignatureDoesNotMatch, CORS preflight errors, stale CDN cache</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>How beginners start in the wrong place.</strong> A new developer saves uploaded files with <code>fs.writeFile</code> into a folder next to the code, and it works on their laptop. Then they deploy to two servers behind a load balancer: half the image requests 404, because each server only has the files it personally received. Or the disk fills and the container restarts empty. Object storage exists precisely so that &quot;where did my upload go?&quot; has one answer for every server, forever.</div>

<h3>🧪 Practice (10–15 min — guaranteed to work)</h3>
<div class="callout ok"><ol>
<li>Open any app you use (a social network, a shop). Right-click a photo and choose &quot;Open image in new tab&quot;. Look at the <strong>host</strong> in the address bar — it is usually a storage or CDN domain, not the app's main domain.</li>
<li>On this website, open an avatar or a post image the same way and confirm the host is <code>media.cuongthai.com</code> — an R2 bucket served through a CDN.</li>
<li>Get ready for the hands-on lessons: install the AWS CLI (<code>aws --version</code> should print a version), or install Docker so you can run a local MinIO in lesson 0.1. Either is fine — both speak the S3 API.</li>
<li>Write one sentence in your own words: why would an app serve its images from <code>media.cuongthai.com</code> instead of from its own application server?</li>
</ol>
<p><strong>Done when:</strong> you have found at least one real image served from a storage/CDN host, you have a working <code>aws</code> CLI or Docker, and your one sentence does not say &quot;to save the database&quot; alone — it mentions shared access, bandwidth, or durability.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Object storage</span><span class="v">An internet service that stores whole files as immutable objects, each addressed by a key.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">One stored file plus its metadata — the &quot;bag&quot; in the left-luggage picture.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">The text name that addresses an object, e.g. <code>users/42/avatars/me.jpg</code> — the &quot;ticket&quot;.</span></div>
  <div class="kv"><span class="k">Bucket</span><span class="v">The container that holds objects — the &quot;shelf&quot;.</span></div>
  <div class="kv"><span class="k">S3 API</span><span class="v">Amazon's storage API, now a de-facto standard many providers implement.</span></div>
  <div class="kv"><span class="k">Cloudflare R2</span><span class="v">An S3-compatible service with zero egress fees; what this course and repo use.</span></div>
  <div class="kv"><span class="k">CDN</span><span class="v">A network of edge caches that serves a bucket's files from near each user.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Bytes served out of storage — the line AWS charges for and R2 does not.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Object storage keeps whole files as immutable objects, each named by a key, inside a bucket — like a left-luggage counter for files, reachable over HTTP.</li><li>Apps use it instead of the database (too big/slow for blobs) or the server disk (not shared, not durable); metadata goes in the DB, bytes go in storage.</li><li>The S3 API is the de-facto standard; Cloudflare R2 is an S3-compatible service with zero egress cost, which is why this repo uses it.</li><li>You have already used it here — every image on this site is an R2 object served as <code>media.cuongthai.com/...</code> through a CDN.</li><li>By the end you will upload/serve correctly, let browsers upload directly, keep it cheap and safe, and debug the classic failures.</li></ul>

<a class="link-card" href="https://aws.amazon.com/what-is/object-storage/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">AWS — What is object storage?</span><span class="lc-sub">Amazon's own plain introduction; matches the everyday picture above.</span></span>
</a>
<a class="link-card" href="https://developers.cloudflare.com/r2/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Cloudflare R2 documentation</span><span class="lc-sub">The S3-compatible, zero-egress service this course uses.</span></span>
</a>
<p class="note-ct"><strong>Next:</strong> &quot;Start here&quot; part 2 — why object storage matters in money and in safety (a surprise egress bill, a leaked public bucket, the SigV4 bug this repo caught in production), and a study plan.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây</span>
<h2>Chào bạn. Trước khi gọi API nào, hãy biết object storage là gì — và vì sao</h2>
<p class="lead">Chào mừng bạn. Nếu bạn chưa từng nghe cụm &quot;object storage&quot;, hoặc đã từng upload ảnh đại diện trong một app mà chưa bao giờ tự hỏi file đó đi đâu, thì bài này viết cho bạn. Chưa có lệnh nào phải học thuộc. Trong mười lăm phút, bạn sẽ biết object storage là gì, vì sao app không giữ file người dùng trong database hay trên ổ đĩa máy chủ, &quot;S3 API&quot; và &quot;Cloudflare R2&quot; là gì, và bạn đã dùng object storage từ bao giờ — kể cả ngay trên trang web này.</p>
<p>Bài này và bài kế tiếp là cửa vào của cả khoá. Bài thứ hai cho thấy vì sao nó quan trọng về tiền và về an toàn, kèm một kế hoạch học. Sau đó bài 0.1 so object storage với filesystem bạn đã quen, và 0.2 dạy ba concept mà mọi API call dựa trên.</p>

<h3>Object storage là gì — nói bằng hình ảnh đời thường trước</h3>
<p>Tạm quên định nghĩa trong sách. Hãy hình dung một <strong>quầy giữ hành lý</strong> ở nhà ga. Bạn đưa một cái túi, họ đưa lại cho bạn một cái vé có số, rồi đặt túi lên kệ. Sau đó bạn không thò tay vào túi để thay mỗi một cái áo — bạn lấy cả túi ra rồi gửi vào một túi mới. Bạn cũng không lục kệ được; bạn chỉ chìa vé ra và nhận lại túi. Và quầy không quan tâm trong túi có gì.</p>
<p>Object storage đúng là như vậy, nhưng cho file: bạn đưa cho nó một file, bạn chọn cái <strong>vé</strong> (gọi là <em>key</em>, ví dụ <code>users/42/avatars/me.jpg</code>), và nó lưu <strong>cả file</strong> (gọi là <em>object</em>) lên một cái kệ phân tán khổng lồ (gọi là <em>bucket</em>). Bạn lấy lại file bằng key của nó. Bạn thay file bằng cách upload hẳn một file mới — không bao giờ sửa một phần.</p>
<div class="callout ok"><strong>Một câu để nhớ:</strong> object storage là một dịch vụ internet lưu nguyên các file dưới dạng &quot;object&quot; bất biến, mỗi object định danh bằng một &quot;key&quot; dạng chữ, nằm trong một container gọi là &quot;bucket&quot; — truy cập qua HTTP từ bất cứ đâu.</div>

<h3>Vì sao không dùng luôn database, hay ổ đĩa máy chủ?</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không dùng database</span><span class="v">Database sinh ra cho dòng nhỏ, có cấu trúc, query được. Một video 50 MB làm database chậm và phình to, sao lưu thành cực hình. Hãy giữ <em>metadata</em> trong DB, <em>byte</em> trong object storage.</span></div>
  <div class="kv"><span class="k">Không dùng ổ đĩa máy chủ</span><span class="v">File nằm trên ổ của một server thì server thứ hai không thấy, ổ đầy, và một lần redeploy hay crash có thể xoá sạch. Object storage dùng chung, gần như vô hạn, và bền (11 số chín).</span></div>
  <div class="kv"><span class="k">Phục vụ nhanh, toàn cầu</span><span class="v">Bucket cộng CDN phục vụ cùng một ảnh từ một edge gần mỗi người dùng, nên server app không tốn băng thông cho nó.</span></div>
</div>

<h3>S3 API và Cloudflare R2</h3>
<p>Năm 2006 Amazon ra mắt <strong>S3</strong> (Simple Storage Service). API HTTP của nó phổ biến tới mức gần như mọi nhà cung cấp khác đều chép lại: ngày nay &quot;S3-compatible&quot; là một chuẩn, như cổng USB. <strong>Cloudflare R2</strong> là một dịch vụ S3-compatible như vậy — chính là cái khoá này và kho này dùng. Lý do lớn nhất chọn R2: nó <strong>không tính phí egress</strong> (byte phục vụ ra ngoài), trong khi AWS S3 tính khoảng $0,09 mỗi GB. Bài 2.1 sẽ tính con số đó; giờ chỉ cần biết R2 nói tiếng S3 API, nên mọi thứ bạn học đều chuyển được.</p>

<h3>Bạn đã gặp nó rồi — ngay trên site này</h3>
<p>Mở một ảnh đại diện hay ảnh bài viết bất kỳ trên trang web này và nhìn địa chỉ của nó: host là <code>media.cuongthai.com</code>, không phải tên miền của app. Đó là một bucket Cloudflare R2 (<code>cuonghoangdev-media</code>) phục vụ qua CDN của Cloudflare. Mọi ảnh đại diện, mọi ảnh/video bài viết, mọi tệp đính kèm khoá học và bản nhạc bạn thấy ở đây đều là một object với key kiểu <code>posts/1234/media/clip.mp4</code>. Khoá này dạy đúng cái hệ thống đang chạy dưới chân bạn.</p>

<h3>Cuối khoá bạn sẽ làm được gì</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Upload và phục vụ file đúng cách</span><span class="lz-lnote">PUT với đúng Content-Type và Cache-Control; phục vụ qua CDN; không list bucket</span></div>
<div class="lz-layer"><span class="lz-lname">Cho trình duyệt upload thẳng</span><span class="lz-lnote">Presigned URL + CORS, để file lớn không đi qua server của bạn</span></div>
<div class="lz-layer"><span class="lz-lname">Giữ rẻ và an toàn</span><span class="lz-lnote">Tính egress, bucket private, signed URL, xoay key, lifecycle rule</span></div>
<div class="lz-layer"><span class="lz-lname">Chẩn đoán các lỗi kinh điển</span><span class="lz-lnote">403 SignatureDoesNotMatch, lỗi CORS preflight, cache CDN cũ</span></div>
</div>

<div class="pitfall co-tieu-de"><strong>Người mới hay bắt đầu sai chỗ thế này.</strong> Một bạn lập trình lưu file upload bằng <code>fs.writeFile</code> vào một thư mục cạnh mã nguồn, và trên laptop thì chạy ngon. Rồi deploy lên hai server sau một load balancer: một nửa số request ảnh trả 404, vì mỗi server chỉ có những file nó tự nhận. Hoặc ổ đầy và container khởi động lại thì rỗng trơn. Object storage sinh ra chính là để câu hỏi &quot;file mình upload đâu rồi?&quot; chỉ có một câu trả lời cho mọi server, mãi mãi.</div>

<h3>🧪 Thực hành (10–15 phút — chắc chắn làm được)</h3>
<div class="callout ok"><ol>
<li>Mở một app bạn hay dùng (mạng xã hội, trang bán hàng). Chuột phải vào một ảnh rồi chọn &quot;Mở ảnh trong tab mới&quot;. Nhìn <strong>host</strong> trên thanh địa chỉ — thường là một tên miền storage hoặc CDN, không phải tên miền chính của app.</li>
<li>Trên trang web này, mở một ảnh đại diện hoặc ảnh bài viết theo cách đó và xác nhận host là <code>media.cuongthai.com</code> — một bucket R2 phục vụ qua CDN.</li>
<li>Chuẩn bị cho các bài thực hành: cài AWS CLI (<code>aws --version</code> phải in ra số phiên bản), hoặc cài Docker để chạy MinIO cục bộ ở bài 0.1. Cái nào cũng được — cả hai đều nói tiếng S3 API.</li>
<li>Tự viết một câu bằng lời của bạn: vì sao một app lại phục vụ ảnh từ <code>media.cuongthai.com</code> thay vì từ chính server ứng dụng của nó?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tìm được ít nhất một ảnh thật phục vụ từ host storage/CDN, có <code>aws</code> CLI hoặc Docker chạy được, và câu của bạn KHÔNG chỉ nói &quot;để nhẹ database&quot; — mà có nhắc tới dùng chung, băng thông, hoặc độ bền.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Object storage</span><span class="v">Dịch vụ internet lưu nguyên các file dưới dạng object bất biến, mỗi object định danh bằng key.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">Một file đã lưu cộng metadata — cái &quot;túi&quot; trong hình ảnh quầy giữ đồ.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">Tên dạng chữ định danh object, ví dụ <code>users/42/avatars/me.jpg</code> — cái &quot;vé&quot;.</span></div>
  <div class="kv"><span class="k">Bucket</span><span class="v">Container chứa object — cái &quot;kệ&quot;.</span></div>
  <div class="kv"><span class="k">S3 API</span><span class="v">API lưu trữ của Amazon, nay là chuẩn de-facto nhiều nhà cung cấp làm theo.</span></div>
  <div class="kv"><span class="k">Cloudflare R2</span><span class="v">Dịch vụ S3-compatible, không tính phí egress; thứ khoá này và kho này dùng.</span></div>
  <div class="kv"><span class="k">CDN</span><span class="v">Mạng các edge cache phục vụ file của bucket từ nơi gần mỗi người dùng.</span></div>
  <div class="kv"><span class="k">Egress</span><span class="v">Byte phục vụ ra khỏi storage — khoản AWS tính tiền còn R2 thì không.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Object storage giữ nguyên các file dưới dạng object bất biến, mỗi cái đặt tên bằng key, trong một bucket — như quầy giữ hành lý dành cho file, truy cập qua HTTP.</li><li>App dùng nó thay cho database (quá to/chậm cho blob) hay ổ đĩa server (không dùng chung, không bền); metadata vào DB, byte vào storage.</li><li>S3 API là chuẩn de-facto; Cloudflare R2 là dịch vụ S3-compatible không tốn phí egress, đó là lý do kho này dùng nó.</li><li>Bạn đã dùng nó ngay ở đây — mọi ảnh trên site này là một object R2 phục vụ dưới dạng <code>media.cuongthai.com/...</code> qua CDN.</li><li>Cuối khoá bạn sẽ upload/phục vụ đúng cách, cho trình duyệt upload thẳng, giữ rẻ và an toàn, và gỡ được các lỗi kinh điển.</li></ul>

<a class="link-card" href="https://aws.amazon.com/what-is/object-storage/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">AWS — What is object storage?</span><span class="lc-sub">Phần giới thiệu mộc mạc của chính Amazon; khớp với hình ảnh đời thường ở trên.</span></span>
</a>
<a class="link-card" href="https://developers.cloudflare.com/r2/" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Tài liệu Cloudflare R2</span><span class="lc-sub">Dịch vụ S3-compatible, không phí egress mà khoá này dùng.</span></span>
</a>
<p class="note-ct"><strong>Bài kế tiếp:</strong> &quot;Bắt đầu tại đây&quot; phần 2 — vì sao object storage quan trọng về tiền và an toàn (một hoá đơn egress bất ngờ, một bucket public bị lộ, cái bug SigV4 kho này bắt được ở production), và kế hoạch học.</p>
</div>
`,
    },

    {
      title: 'Start here (2/2) — Why it matters: cost, safety, and how to study this course|||Bắt đầu tại đây (2/2) — Vì sao nó quan trọng: tiền, an toàn, và cách học khoá này',
      slug: 'os-0-0b-vi-sao-quan-trong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao object storage đáng học cho nghiêm túc: một hoá đơn egress bất ngờ (R2 zero egress vs S3 $0,09/GB), những vụ lộ bucket public, cái bug SigV4 kho này bắt được ở production, cộng bản đồ 11 mục của khoá và một lộ trình tối thiểu để bạn ship được tính năng upload.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here</span>
<h2>Why object storage is worth learning well</h2>
<p class="lead">In the previous lesson you met object storage. This one answers &quot;does getting it wrong actually hurt?&quot; — yes, in two currencies: <strong>money</strong> and <strong>safety</strong>. Then a map of the course and a minimum route so you can ship an upload feature without reading all eleven chapters first.</p>

<h3>It hurts your wallet: egress</h3>
<p>Storing files is cheap everywhere (cents per GB per month). The surprise is <strong>egress</strong> — every byte served out. AWS S3 charges about $0.09/GB of egress; Cloudflare R2 charges $0. For an app that serves 5 TB of images a month (5,120 GB), that is roughly <strong>$460 a month on S3 just to serve them</strong>, versus $0 on R2 — before you have stored a single new byte. This one line is the main reason this repo runs on R2, and Chapter 2 and Chapter 7 turn it into exact formulas.</p>
<div class="callout warn"><strong>The classic surprise bill</strong> is not storage — it is a popular file (or a hotlinked one) served millions of times. If you only watch the storage number, the egress line is the one that arrives at the end of the month.</div>

<h3>It hurts your users: safety</h3>
<p>Object storage is reachable over the public internet, so a wrong setting leaks data to the whole world. Two failure modes you will learn to prevent:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A public bucket that should be private</span><span class="v">Leaked S3 buckets have exposed millions of records — backups, IDs, private media — simply because &quot;public&quot; was left on. Chapters 3 and 5 teach private buckets + signed URLs.</span></div>
  <div class="kv"><span class="k">A broken signature</span><span class="v">Presigned URLs are signed with SigV4. Get the signed headers wrong and you either lock out real users or, worse, sign something you did not mean to. This repo caught a real SigV4 <code>signableHeaders</code> bug in production — Chapter 4 walks through it.</span></div>
</div>

<h3>What this course does differently</h3>
<p>Every number here is measured against this repo's own <code>src/config/r2.ts</code> and <code>upload.service.ts</code> running on real Cloudflare R2 — not copied from marketing pages. You will see the actual key conventions, the actual Cache-Control values, the actual migration, and the actual bug that got fixed. When a claim is a measurement, the lesson says so and links its source.</p>

<h3>The map — eleven sections</h3>
<table>
  <tr><th>Section</th><th>What you get</th></tr>
  <tr><td>0 · Concepts</td><td>Object storage vs filesystem; bucket/key/object</td></tr>
  <tr><td>1 · S3 API</td><td>SDK v3 client; Put/Get/Head/Delete; multipart upload</td></tr>
  <tr><td>2 · R2 specifics</td><td>Zero egress; R2 quirks; access keys &amp; rotation</td></tr>
  <tr><td>3 · URLs &amp; access</td><td>Three URL types; Cache-Control; signed URLs</td></tr>
  <tr><td>4 · Presigned uploads</td><td>Browser-direct PUT; the SigV4 signature bug</td></tr>
  <tr><td>5 · CORS</td><td>Letting the browser talk to the bucket safely</td></tr>
  <tr><td>6 · Lifecycle</td><td>Expiry rules; aborting dead multipart uploads</td></tr>
  <tr><td>7 · Cost</td><td>Turning storage + operations + egress into a bill</td></tr>
  <tr><td>8 · Migration</td><td>Moving from S3 to R2 without losing objects</td></tr>
  <tr><td>9 · Diagnostics</td><td>403, CORS, stale cache — reading the real cause</td></tr>
  <tr><td>10 · Exam review</td><td>A self-test over the whole course</td></tr>
</table>

<h3>A one-week minimum route</h3>
<p>If all you need right now is &quot;let users upload an avatar and show it back&quot;, you do not need all eleven sections. Do this: Section 0 (concepts) → 1.1 and 1.2 (client + Put/Get/Head/Delete) → 3.1 and 3.2 (URL types + Cache-Control) → 4 (presigned upload) → 5 (CORS). That is enough to ship safely. Come back for multipart, lifecycle, cost and migration when you hit them.</p>

<div class="pitfall co-tieu-de"><strong>Do not learn the wrong lesson from the cost story.</strong> &quot;R2 is free so I can ignore cost&quot; is the trap. R2 has zero <em>egress</em>, but it still bills storage and operations (Class A writes, Class B reads), and a runaway script that does millions of HEAD requests still costs money. Zero egress removes the scariest line, not your responsibility to measure — which is exactly why Chapter 7 exists.</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — What is object storage?</span><span class="lc-sub">aws.amazon.com/what-is/object-storage — introduction from Amazon, matches this lesson.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chapter 2 — R2 specifics</span><span class="lc-sub">/courses/object-storage/learn${REF} — how Cloudflare R2 differs from S3 despite compatibility.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Object storage vs file system: ba khác biệt</h2>
<p class="lead">Bạn biết file. Object storage nhìn giống (URL như path, upload như write) nhưng ba khác biệt sâu nhất lật 90% trực giác của bạn về cách dùng.</p>

<h3>Khác biệt 1: không directory tree, chỉ flat key</h3>
<pre><code class="language-text">Filesystem: /home/user/photos/2026/vacation/beach.jpg
  - directory /photos ton tai la mot entity
  - list /photos thay het con
  - rename /photos/2026 -&gt; /photos/2025

Object storage: photos/2026/vacation/beach.jpg
  - "photos/", "photos/2026/" KHONG ton tai la entity
  - dau "/" trong key chi la ky tu
  - list "photos/" la PREFIX SCAN moi key — dat o scale
  - rename mot "directory" = copy + delete moi object ben duoi
</code></pre>

<div class="callout warn">
<p><strong>Prefix listing là O(N) theo số key match.</strong> OK cho hàng trăm. Kinh khủng cho triệu. Design key sao bạn không bao giờ cần list — track chúng trong DB.</p>
</div>

<h3>Khác biệt 2: không partial update</h3>
<pre><code class="language-text">Filesystem: fs.writeSync(fd, buf, offset)  — write vao giua file
Object storage: KHONG. Phai upload TOAN BO version moi.

Ngoai le: multipart upload cho file LON (5MB-5TB part)
  - Upload part 1, part 2, ..., roi complete
  - S3 gheo lai thanh MOT final object atomically
  - Van la atomic replace cuoi cung; khong edit object hien tai
</code></pre>

<h3>Khác biệt 3: không POSIX permission, chỉ bucket policy</h3>
<pre><code class="language-text">Filesystem: chmod, chown, ACL per file/directory
Object storage: 
  - Bucket-level: public/private, IAM policy
  - Object-level: ACL (deprecated in modern S3), signed URLs
  - Auth via API key hoac IAM role, khong per-user ID
</code></pre>

<div class="callout ok">
<p><strong>Ba khác biệt =&gt; ba design pattern.</strong> (1) Lưu key trong DB, đừng list. (2) Version bằng cách upload key mới, đừng edit. (3) Auth qua signed URL, không per-user ACL.</p>
</div>

<h3>Object storage TỐT cho</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Immutable blob</span><span class="lz-lnote">Ảnh, video, audio, PDF. Upload một lần, serve nhiều lần. Không edit</span></div>
<div class="lz-layer"><span class="lz-lname">File lớn</span><span class="lz-lnote">Multipart upload handle 5 TB per object. Không limit RAM server</span></div>
<div class="lz-layer"><span class="lz-lname">CDN delivery toàn cầu</span><span class="lz-lnote">Bucket + custom domain = phân phối địa lý qua edge</span></div>
<div class="lz-layer"><span class="lz-lname">Backup</span><span class="lz-lnote">Rẻ ($0.015/GB/month R2), durable (11 9s), versioned</span></div>
</div>

<h3>KHÔNG tốt cho</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">Mutable state</span><span class="lz-lnote">Đừng dùng làm database. Mỗi write là full-object replace</span></div>
<div class="lz-layer"><span class="lz-lname">Low-latency read</span><span class="lz-lnote">First-byte latency 50-200ms tuỳ nơi. CDN edge cache giúp nhưng origin chậm</span></div>
<div class="lz-layer"><span class="lz-lname">Query phức tạp</span><span class="lz-lnote">Không SQL, không full-text search. Vài service có S3 Select nhưng giới hạn</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — treat S3 như filesystem qua mount.</strong> s3fs-fuse, s3ql — mount bucket S3 như filesystem. Mỗi read = HTTP GET. Mỗi write = full-object PUT. Latency 50-200ms per op thay vì &lt;1ms. Dùng cho archival mount THÔI, không application workload.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Object storage là distributed, immutable, flat key-value blob store — ba property (không directory, không partial write, không POSIX perms) lật hầu hết trực giác filesystem và định hình mọi quyết định S3 API.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — What is object storage?</span><span class="lc-sub">aws.amazon.com/what-is/object-storage — introduction từ Amazon, khớp bài này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Chương 2 — R2 specifics</span><span class="lc-sub">/courses/object-storage/learn${REF} — cách Cloudflare R2 khác S3 dù compatible.</span></span></div>
</div>
`,
    },

    {
      title: '0.2 — Bucket, key, object: the three-level model|||0.2 — Bucket, key, object: mô hình ba tầng',
      slug: 'os-0-2-model',
      type: 'VIDEO',
      description: 'Bucket là container. Key là identifier UNIQUE trong bucket. Object là data + metadata. Chỉ ba concept — đơn giản mà mạnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Bucket, key, object: the three-level model</h2>
<p class="lead">Every S3-compatible service uses the same three concepts. Learning them well makes every API call obvious.</p>

<h3>The three</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Bucket</span><span class="lz-nsub">container, global unique name</span></span>
<span class="lz-nbody">Top-level container. In AWS S3, bucket name is GLOBALLY unique across all accounts. In R2, unique per Cloudflare account. Named at creation, never renamed.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Key</span><span class="lz-nsub">identifier within bucket</span></span>
<span class="lz-nbody">String, up to 1024 UTF-8 bytes. Any characters (including &quot;/&quot;). The primary key of the object.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Object</span><span class="lz-nsub">data + metadata + ETag</span></span>
<span class="lz-nbody">The actual blob. Size 0 to 5 TB. Content-Type, Cache-Control, x-amz-meta-* custom metadata. ETag = MD5 of content (mostly).</span>
</div>
</div>

<h3>This repo — key naming</h3>
<pre><code class="language-ts">// upload.service.ts
&#96;users/\${userId}/avatars/\${filename}&#96;
&#96;posts/\${postId}/media/\${filename}&#96;
&#96;lessons/\${courseId}/attachments/\${filename}&#96;
&#96;music/\${trackId}.mp3&#96;
</code></pre>

<div class="callout ok">
<p><strong>Convention: <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code>.</strong> Grep-friendly. When you want to delete a user&#39;s files, list prefix <code>users/42/</code>. Naturally namespaced.</p>
</div>

<h3>Bucket configuration</h3>
<pre><code class="language-text">Kho nay 1 bucket:
  cuonghoangdev-media
  
Cai gi trong bucket:
  - Public bucket (custom domain: media.cuongthai.com)
  - Cloudflare CDN caching
  - Versioning: OFF (dua vao DB tracking)
  - Lifecycle: none (files song mai)
</code></pre>

<h3>Object metadata — two kinds</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">system</span><span class="lz-t">Content-Type, Content-Length, ETag, Last-Modified</span><span class="lz-d">Standard HTTP metadata + S3 internals. Cache-Control is here — critical for CDN behavior.</span></div>
<div class="lz-step"><span class="lz-k">user</span><span class="lz-t">x-amz-meta-anything</span><span class="lz-d">Custom key-value pairs. Total size &lt;2 KB. Uses: tags, source URLs, upload timestamps. This repo does not use them — it tracks that in the database instead.</span></div>
</div>

<h3>ETag — hash of content</h3>
<pre><code class="language-ts">// PUT object -&gt; response includes ETag
const res = await client.send(new PutObjectCommand({ ... }));
console.log(res.ETag);   // "d41d8cd98f00b204e9800998ecf8427e"

// Simple upload: ETag = MD5 hash (mostly)
// Multipart upload: ETag = HASH-N where N = part count (not simple MD5)
// Server-side encryption: ETag = opaque, NOT MD5
</code></pre>

<div class="callout warn">
<p><strong>Do not rely on the ETag being an MD5.</strong> For a multipart upload, or with server-side encryption, the ETag is NOT an MD5. If you need a content hash for deduplication, compute MD5/SHA256 client-side and store it in the metadata or in your database.</p>
</div>

<h3>This repo tracks objects in Postgres</h3>
<pre><code class="language-prisma">// prisma/schema.prisma
model MediaFile {
  id         Int      @id @default(autoincrement())
  key        String   @unique       // "users/42/avatars/x.jpg"
  bucket     String                 // "cuonghoangdev-media"
  url        String                 // "https://media.cuongthai.com/users/42/avatars/x.jpg"
  size       Int                    // bytes
  mimeType   String
  uploadedBy Int
  createdAt  DateTime @default(now())
}
</code></pre>

<p>When you need to &quot;delete a user&#39;s files&quot;, query the database by <code>uploadedBy</code> then DELETE the objects by key. Do NOT list the bucket.</p>

<div class="pitfall">
<p><strong>Trap — using a key containing whitespace or emoji.</strong> S3 accepts it, but the URL encoding gets complicated. <code>https://media/logo tết.png</code> → the browser encodes, the server decodes. If the key contains &quot;+&quot; or &quot;#&quot;, the two encodings disagree. Stick to ASCII alphanumerics plus <code>-</code>, <code>_</code>, <code>/</code>.</p>
</div>

<div class="callout">
<p><strong>One sentence.</strong> Bucket (a globally unique container) + key (up to 1024 UTF-8 bytes, unique within the bucket) + object (data + system metadata + user metadata + ETag) — three simple concepts that every S3 API operation rests on; this repo tracks them in a Postgres MediaFile table so it never has to list the bucket.</p>
</div>

<h3>🧪 Practice (15–20 min) — read an object's two kinds of metadata</h3>
<div class="callout ok"><ol>
<li>Against any S3-compatible endpoint (MinIO from lesson 0.1 is fine), upload one object with a key that follows this repo's convention <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> — for example <code>users/42/avatars/me.txt</code> — and set a user metadata field at upload: <code>aws s3api put-object --metadata source=practice --content-type text/plain --key users/42/avatars/me.txt --body me.txt --bucket yourbucket</code>.</li>
<li>Run <code>aws s3api head-object --bucket yourbucket --key users/42/avatars/me.txt</code> and point at which fields are <strong>system</strong> metadata (ContentType, ContentLength, ETag, LastModified) and which is your <strong>user</strong> metadata (<code>Metadata.source</code>, stored as <code>x-amz-meta-source</code>).</li>
<li>Upload the exact same bytes a second time and compare the two ETags — for a simple single-part PUT they match (ETag is the MD5 of the content).</li>
<li>Now force a multipart upload of a file bigger than your part size (or use the SDK <code>Upload</code> class) and look at its ETag: it ends in <code>-N</code> where N is the part count, so it is NOT a plain MD5.</li>
</ol>
<p><strong>Done when:</strong> you can say which metadata is system vs user, why this repo keys objects as <code>users/42/...</code>, and why you must not treat the ETag as an MD5 for deduplication.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">Top-level container, named once at creation and never renamed.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">The object's unique identifier within a bucket, up to 1024 UTF-8 bytes.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">The blob itself plus its metadata and ETag; size 0 to 5 TB.</span></div>
  <div class="kv"><span class="k">System metadata</span><span class="v">Standard fields: Content-Type, Content-Length, ETag, Last-Modified, Cache-Control.</span></div>
  <div class="kv"><span class="k">User metadata</span><span class="v">Custom <code>x-amz-meta-*</code> key-value pairs, under ~2 KB total.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">A content fingerprint — MD5 for a simple PUT, but <code>HASH-N</code> for multipart and opaque under SSE.</span></div>
  <div class="kv"><span class="k">MediaFile table</span><span class="v">This repo's Postgres row per object (key, bucket, url, size, mimeType) so it never lists the bucket.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Three concepts carry all of S3: a bucket (unique container), a key (unique identifier within it), and an object (data + metadata + ETag).</li><li>A good key convention — <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> — namespaces files and makes per-user deletes a prefix, not a scan.</li><li>Metadata comes in two kinds: system (Content-Type, Cache-Control, ETag…) and user (<code>x-amz-meta-*</code>); Cache-Control here drives CDN behaviour.</li><li>The ETag equals an MD5 only for a simple single-part upload — never rely on it for multipart or encrypted objects; compute your own hash if you need one.</li><li>This repo tracks every object in a Postgres MediaFile row, so it deletes and looks up by DB query instead of listing the bucket.</li></ul>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Buckets and objects</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html — official terminology.</span></span></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Bucket, key, object: mô hình ba tầng</h2>
<p class="lead">Mọi service S3-compatible dùng cùng ba concept. Học chúng thật kỹ làm mọi API call trở nên hiển nhiên.</p>

<h3>Ba concept</h3>
<div class="lz-map">
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Bucket</span><span class="lz-nsub">container, tên unique toàn cục</span></span>
<span class="lz-nbody">Container tầng đỉnh. AWS S3: tên bucket unique TOÀN CỤC qua mọi account. R2: unique per Cloudflare account. Đặt lúc tạo, không rename.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Key</span><span class="lz-nsub">identifier trong bucket</span></span>
<span class="lz-nbody">String, tối đa 1024 UTF-8 byte. Ký tự bất kỳ (kể cả &quot;/&quot;). Primary key của object.</span>
</div>
<div class="lz-stage lz-badge">
<span class="lz-node"><span class="lz-ntitle">Object</span><span class="lz-nsub">data + metadata + ETag</span></span>
<span class="lz-nbody">Blob thật. Size 0 đến 5 TB. Content-Type, Cache-Control, x-amz-meta-* custom metadata. ETag = MD5 của content (đa phần).</span>
</div>
</div>

<h3>Kho này — đặt tên key</h3>
<pre><code class="language-ts">// upload.service.ts
&#96;users/\${userId}/avatars/\${filename}&#96;
&#96;posts/\${postId}/media/\${filename}&#96;
&#96;lessons/\${courseId}/attachments/\${filename}&#96;
&#96;music/\${trackId}.mp3&#96;
</code></pre>

<div class="callout ok">
<p><strong>Convention: <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code>.</strong> Grep-friendly. Khi muốn delete file của user, list prefix <code>users/42/</code>. Tự nhiên namespace.</p>
</div>

<h3>Bucket configuration</h3>
<pre><code class="language-text">Kho nay 1 bucket:
  cuonghoangdev-media
  
Cai gi trong bucket:
  - Public bucket (custom domain: media.cuongthai.com)
  - Cloudflare CDN caching
  - Versioning: OFF (dua vao DB tracking)
  - Lifecycle: none (files song mai)
</code></pre>

<h3>Object metadata — hai loại</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">system</span><span class="lz-t">Content-Type, Content-Length, ETag, Last-Modified</span><span class="lz-d">Standard HTTP metadata + S3 internals. Cache-Control ở đây — critical cho CDN behavior.</span></div>
<div class="lz-step"><span class="lz-k">user</span><span class="lz-t">x-amz-meta-anything</span><span class="lz-d">Custom key-value pair. Tổng size &lt;2 KB. Uses: tags, source URLs, upload timestamps. Kho này không dùng — track trong DB.</span></div>
</div>

<h3>ETag — hash của content</h3>
<pre><code class="language-ts">// PUT object -&gt; response includes ETag
const res = await client.send(new PutObjectCommand({ ... }));
console.log(res.ETag);   // "d41d8cd98f00b204e9800998ecf8427e"

// Simple upload: ETag = MD5 hash (da phan)
// Multipart upload: ETag = HASH-N voi N = so part (khong simple MD5)
// Server-side encryption: ETag = opaque, KHONG MD5
</code></pre>

<div class="callout warn">
<p><strong>Đừng rely vào ETag = MD5.</strong> Với multipart upload hoặc server-side encryption, ETag KHÔNG phải MD5. Nếu cần content hash để dedup, tính MD5/SHA256 CLIENT-side và lưu metadata hoặc DB.</p>
</div>

<h3>Kho này track object trong Postgres</h3>
<pre><code class="language-prisma">// prisma/schema.prisma
model MediaFile {
  id         Int      @id @default(autoincrement())
  key        String   @unique       // "users/42/avatars/x.jpg"
  bucket     String                 // "cuonghoangdev-media"
  url        String                 // "https://media.cuongthai.com/users/42/avatars/x.jpg"
  size       Int                    // bytes
  mimeType   String
  uploadedBy Int
  createdAt  DateTime @default(now())
}
</code></pre>

<p>Khi cần &quot;delete user&#39;s files&quot;, query DB theo <code>uploadedBy</code> rồi DELETE objects theo key. KHÔNG list bucket.</p>

<div class="pitfall">
<p><strong>Bẫy — dùng key có whitespace hoặc emoji.</strong> S3 accept nhưng URL encoding phức tạp. <code>https://media/logo tết.png</code> → browser encode → server decode. Nếu key có &quot;+&quot; hoặc &quot;#&quot;, encoding lệch. Dùng ASCII alphanumeric + <code>-</code>, <code>_</code>, <code>/</code>.</p>
</div>

<div class="callout">
<p><strong>Một câu.</strong> Bucket (container, unique toàn cục) + key (đến 1024 UTF-8 byte, unique trong bucket) + object (data + system metadata + user metadata + ETag) — 3 concept đơn giản mà mọi S3 API operation dựa trên; kho này track trong Postgres MediaFile table để không phải list bucket.</p>
</div>

<h3>🧪 Thực hành (15–20 phút) — đọc hai loại metadata của một object</h3>
<div class="callout ok"><ol>
<li>Với một endpoint S3-compatible bất kỳ (MinIO ở bài 0.1 là đủ), upload một object có key theo convention của kho này <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> — ví dụ <code>users/42/avatars/me.txt</code> — và đặt một trường user metadata lúc upload: <code>aws s3api put-object --metadata source=practice --content-type text/plain --key users/42/avatars/me.txt --body me.txt --bucket bucketcuaban</code>.</li>
<li>Chạy <code>aws s3api head-object --bucket bucketcuaban --key users/42/avatars/me.txt</code> và chỉ ra trường nào là metadata <strong>hệ thống</strong> (ContentType, ContentLength, ETag, LastModified) và trường nào là metadata <strong>người dùng</strong> (<code>Metadata.source</code>, lưu dưới dạng <code>x-amz-meta-source</code>).</li>
<li>Upload đúng bộ byte đó lần thứ hai và so hai ETag — với PUT single-part đơn giản chúng trùng nhau (ETag là MD5 của content).</li>
<li>Giờ ép một multipart upload cho file lớn hơn part size (hoặc dùng SDK <code>Upload</code> class) rồi nhìn ETag của nó: nó kết thúc bằng <code>-N</code> với N là số part, nên KHÔNG phải MD5 thường.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói được metadata nào là hệ thống, metadata nào là người dùng, vì sao kho này đặt key kiểu <code>users/42/...</code>, và vì sao không được coi ETag là MD5 khi dedup.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bucket</span><span class="v">Container tầng đỉnh, đặt tên một lần lúc tạo và không rename.</span></div>
  <div class="kv"><span class="k">Key</span><span class="v">Định danh unique của object trong một bucket, tối đa 1024 UTF-8 byte.</span></div>
  <div class="kv"><span class="k">Object</span><span class="v">Bản thân blob cộng metadata và ETag; size 0 đến 5 TB.</span></div>
  <div class="kv"><span class="k">System metadata</span><span class="v">Trường chuẩn: Content-Type, Content-Length, ETag, Last-Modified, Cache-Control.</span></div>
  <div class="kv"><span class="k">User metadata</span><span class="v">Cặp key-value tuỳ ý <code>x-amz-meta-*</code>, tổng dưới ~2 KB.</span></div>
  <div class="kv"><span class="k">ETag</span><span class="v">Vân tay nội dung — MD5 với PUT đơn giản, nhưng <code>HASH-N</code> với multipart và opaque khi SSE.</span></div>
  <div class="kv"><span class="k">MediaFile table</span><span class="v">Dòng Postgres mỗi object của kho này (key, bucket, url, size, mimeType) để không phải list bucket.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba concept gánh toàn bộ S3: bucket (container unique), key (định danh unique trong bucket), object (data + metadata + ETag).</li><li>Convention key tốt — <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> — namespace file và biến việc xoá file của một user thành một prefix, không phải một lần scan.</li><li>Metadata có hai loại: hệ thống (Content-Type, Cache-Control, ETag…) và người dùng (<code>x-amz-meta-*</code>); Cache-Control ở đây điều khiển hành vi CDN.</li><li>ETag bằng MD5 chỉ với upload single-part đơn giản — đừng rely với multipart hay object mã hoá; cần hash thì tự tính.</li><li>Kho này track mọi object bằng một dòng Postgres MediaFile, nên xoá và tra cứu bằng query DB thay vì list bucket.</li></ul>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">AWS S3 — Buckets and objects</span><span class="lc-sub">docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html — terminology chính thức.</span></span></div>
</div>
`,
    },

    {
      title: '0.3 — Section 0 quiz|||0.3 — Kiểm tra Mục 0',
      slug: 'os-0-3-quiz',
      type: 'QUIZ',
      description: 'Bốn câu, sáu phút. Về ba khác biệt object storage vs filesystem và bucket/key/object model.',
      content: `
<div class="ml-en"><span class="eyebrow">Section 0 · Quiz</span><h2>What Section 0 established</h2><p class="lead">Four questions on the core concepts — the fundamental difference between object storage and a filesystem.</p></div>
<div class="ml-vi"><span class="eyebrow">Mục 0 · Kiểm tra</span><h2>Mục 0 đã dựng được gì</h2><p class="lead">Bốn câu về concept cơ bản — sự khác biệt fundamental giữa object storage và filesystem.</p></div>
`,
      quiz: {
        timeLimitSeconds: 360,
        questions: [
          {
            question: 'You want to rename &quot;photos/2026/&quot; to &quot;photos/2025/&quot; in S3. What&#39;s the operation?|||Bạn muốn rename &quot;photos/2026/&quot; thành &quot;photos/2025/&quot; trong S3. Operation gì?',
            options: [
              'COPY each object then DELETE original — S3 has no directories, only flat keys. &quot;/&quot; is just a character. Renaming = full copy + delete of every matching object|||COPY từng object rồi DELETE gốc — S3 không có directory, chỉ flat key. &quot;/&quot; chỉ là ký tự. Rename = full copy + delete của mọi object khớp',
              'S3 has a mv command|||S3 có lệnh mv',
              'Rename the parent folder|||Rename parent folder',
              'Set an alias|||Đặt alias',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Best practice for tracking objects at scale?|||Best practice để track object ở scale?',
            options: [
              'Store keys in your DB (Postgres MediaFile table). Do NOT list buckets — prefix scan is O(N) and expensive|||Lưu key trong DB (Postgres MediaFile table). KHÔNG list bucket — prefix scan là O(N) và đắt',
              'Rely on S3 listing|||Dựa vào listing S3',
              'Use S3 tags exclusively|||Chỉ dùng tags S3',
              'Cache in Redis|||Cache trong Redis',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You want to write byte 100-200 of an existing object. What do you do in S3?|||Bạn muốn write byte 100-200 của một object có sẵn trong S3. Làm gì?',
            options: [
              'Upload the ENTIRE new version — S3 has no partial updates. Every write replaces the whole object atomically|||Upload TOÀN BỘ version mới — S3 không partial update. Mỗi write replace nguyên object atomically',
              'Use S3 Range PUT|||Dùng S3 Range PUT',
              'Modify in place with fs.write|||Modify tại chỗ với fs.write',
              'Impossible|||Không thể',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'ETag = MD5 always?|||ETag luôn = MD5?',
            options: [
              'No — only for simple single-part uploads without server-side encryption. Multipart uploads and SSE give a different opaque ETag format. Never rely on ETag = MD5|||Không — chỉ với single-part upload không server-side encryption. Multipart upload và SSE cho ETag format opaque khác. Không rely vào ETag = MD5',
              'Yes always|||Luôn luôn',
              'Only for images|||Chỉ với ảnh',
              'Only in R2|||Chỉ ở R2',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },

  ],
};
