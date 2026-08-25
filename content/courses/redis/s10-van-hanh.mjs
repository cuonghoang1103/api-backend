/**
 * Redis — Chương 10: Vận hành Redis — cấu hình, bảo mật và ACL.
 * Tệp cấu hình · phơi ra mạng · ACL · làm cứng · kết nối · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 10 — Running Redis: configuration, security and ACLs|||Chương 10 — Vận hành Redis: cấu hình, bảo mật và ACL',
  description: 'Redis được thiết kế cho một mạng nội bộ tin cậy, và trong nhiều năm nó là cơ sở dữ liệu bị chiếm quyền nhiều nhất trên Internet vì đúng lý do đó. Chương này đi qua tệp cấu hình, cách phơi ra mạng, hệ ACL của bản 6, việc làm cứng tiến trình, và cách quản lý kết nối.',
  lessons: [
    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — The config file, and the settings that matter|||10.1 — Tệp cấu hình, và những thiết lập thật sự quan trọng',
      slug: 'rd-10-1-cau-hinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Redis khởi động thế nào và tệp cấu hình ở đâu, mười hai thiết lập bạn thật sự nên đụng vào, CONFIG GET với SET với REWRITE và cái bẫy khởi động lại, và cách kiểm cấu hình đang chạy khác cấu hình trên đĩa ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>The config file, and the settings that matter</h2>
<p class="lead"><code>redis.conf</code> ships with about two hundred directives and roughly a dozen of them are decisions you actually have to make. The rest are correct by default. Knowing which twelve — and knowing that the running configuration and the file can disagree — is most of what "configuring Redis" means.</p>

<h3>Where the configuration actually comes from</h3>
<pre><code>redis-cli CONFIG GET dir
redis-cli INFO server | grep -E "config_file|redis_version|process_id|uptime_in_days|executable"
ps -o args= -C redis-server
redis-server --version</code></pre>
<div class="out">1) "dir"
2) "/var/lib/redis"
redis_version:7.4.1
process_id:1284
uptime_in_days:41
executable:/usr/bin/redis-server
config_file:/etc/redis/redis.conf
/usr/bin/redis-server 127.0.0.1:6379
Redis server v=7.4.1 sha=00000000:0 malloc=jemalloc-5.3.0 bits=64</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · The file, if one was given</span><span class="lz-t">redis-server /etc/redis/redis.conf</span><span class="lz-d">Read top to bottom, last directive wins on duplicates. <code>config_file</code> in <code>INFO server</code> tells you which file this process actually loaded — trust that, not the file you assume it read.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Command-line overrides</span><span class="lz-t">--maxmemory 2gb --appendonly yes</span><span class="lz-d">Any directive can be passed as a flag, and it overrides the file. This is how the official Docker image is configured, which is why a container may ignore the <code>redis.conf</code> you carefully mounted.</span></div>
  <div class="lz-step"><span class="lz-k">3 · <code>CONFIG SET</code> at runtime</span><span class="lz-t">changes the server, not the file</span><span class="lz-d">Immediate and temporary. It survives until the process restarts and then vanishes — the single most common source of "but we configured that months ago" (Lesson 9.5).</span></div>
  <div class="lz-step"><span class="lz-k">4 · <code>CONFIG REWRITE</code> closes the loop</span><span class="lz-t">writes the live config back to the file</span><span class="lz-d">It preserves your comments and rewrites only the directives that differ. It fails if Redis was started without a config file — so a container started with flags cannot persist anything this way.</span></div>
</div>

<h3>The twelve that matter</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>bind</code> and <code>protected-mode</code></span><span class="v">Which interfaces to listen on, and the safety net when you have not decided. The two most important lines in the file, and Lesson 10.2 is entirely about them.</span></div>
  <div class="kv"><span class="k"><code>requirepass</code> / ACL users</span><span class="v">Authentication. An unauthenticated Redis reachable from anything other than loopback is a compromised Redis (Lesson 10.3).</span></div>
  <div class="kv"><span class="k"><code>maxmemory</code> + <code>maxmemory-policy</code></span><span class="v">The limit and what happens at it. Leaving <code>maxmemory</code> at 0 means Redis grows until the OOM killer arrives, which it will (Lesson 9.2).</span></div>
  <div class="kv"><span class="k"><code>appendonly</code> + <code>save</code></span><span class="v">Your durability posture, and the RPO you are choosing (Lesson 9.5).</span></div>
  <div class="kv"><span class="k"><code>dir</code> and <code>logfile</code></span><span class="v">Where data and logs land. Both must be writable by the Redis user — the two most common causes of a <code>MISCONF</code> and of a silent log going nowhere.</span></div>
  <div class="kv"><span class="k"><code>timeout</code> + <code>tcp-keepalive</code></span><span class="v">Idle connection handling. Defaults are <code>0</code> (never close) and <code>300</code>, which is right for a pooled application and wrong behind an aggressive load balancer (Lesson 10.5).</span></div>
</div>
<pre><code><span class="tok-comment"># A minimal production redis.conf worth starting from</span>
bind 127.0.0.1 -::1
protected-mode yes
port 6379
dir /var/lib/redis
logfile /var/log/redis/redis-server.log
loglevel notice

maxmemory 4gb
maxmemory-policy noeviction

appendonly yes
appendfsync everysec
save 900 1 300 100 60 10000
stop-writes-on-bgsave-error yes

timeout 0
tcp-keepalive 300
maxclients 10000

<span class="tok-comment"># slowlog: 5ms, keep 512 entries (Lesson 6.5)</span>
slowlog-log-slower-than 5000
slowlog-max-len 512
latency-monitor-threshold 100</code></pre>
<div class="callout ok"><strong>That is a complete production configuration and it is thirty lines.</strong> Everything not listed is a default that is already correct: the encoding thresholds (Lesson 5.2), the LRU sample count (Lesson 9.2), the AOF rewrite triggers (Lesson 9.4), the client output buffer limits (Lesson 8.1). Resist the urge to tune them without a measurement — every one of those defaults represents a trade-off someone made carefully, and the graphs in the Redis docs usually show why. The last three lines are the ones people forget and then wish they had during an incident.</div>

<h3>Reading the live configuration</h3>
<pre><code>redis-cli CONFIG GET 'maxmemory*'
redis-cli CONFIG GET 'append*'
redis-cli CONFIG GET '*' | wc -l
<span class="tok-comment"># Which settings differ from the shipped defaults? Diff against a clean start.</span>
redis-server --port 7777 --daemonize yes --dir /tmp &gt;/dev/null
diff &lt;(redis-cli -p 7777 CONFIG GET '*' | paste - -) \\
     &lt;(redis-cli CONFIG GET '*' | paste - -) | head -8
redis-cli -p 7777 SHUTDOWN NOSAVE 2&gt;/dev/null</code></pre>
<div class="out">1) "maxmemory"
2) "4294967296"
3) "maxmemory-policy"
4) "noeviction"
5) "maxmemory-samples"
6) "5"
7) "maxmemory-clients"
8) "0"
1) "appendonly"
2) "yes"
3) "appendfsync"
4) "everysec"
584
&lt; appendonly	no
&gt; appendonly	yes
&lt; maxmemory	0
&gt; maxmemory	4294967296
&lt; maxmemory-policy	noeviction
&gt; maxmemory-policy	noeviction</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>CONFIG GET</code> takes glob patterns</span><span class="v"><code>CONFIG GET 'maxmemory*'</code> returns the whole family. Faster than grepping the file, and it shows what is <em>running</em> rather than what someone wrote down.</span></div>
  <div class="kv"><span class="k">Diffing against a default server</span><span class="v">The trick above starts a throwaway Redis with no config and diffs. It answers "what has actually been changed here" in one command, which is invaluable on an instance you inherited.</span></div>
  <div class="kv"><span class="k">Not everything is settable at runtime</span><span class="v"><code>databases</code>, <code>appendfilename</code>, <code>unixsocket</code> and a few others require a restart. <code>CONFIG SET</code> tells you clearly when it refuses.</span></div>
  <div class="kv"><span class="k"><code>maxmemory-clients</code> is new</span><span class="v">Redis 7.0 added a separate cap on total client output buffer memory, which finally stops a few slow subscribers from consuming the whole instance (Lesson 8.1). <code>0</code> means unlimited; a percentage like <code>5%</code> is a reasonable setting.</span></div>
  <div class="kv"><span class="k">Keep the file in version control</span><span class="v">It is deployment configuration like any other. A <code>redis.conf</code> that only exists on the server is a machine you cannot rebuild.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> the running configuration and the file drifting apart, and nobody noticing until a restart. Someone raises <code>maxmemory</code> during an incident with <code>CONFIG SET</code>, the instance recovers, and eight months later a routine reboot brings it back with the old value and the same incident happens again — except now nobody remembers the fix. The same story plays out with <code>appendonly</code>, with <code>maxmemory-policy</code>, and most dangerously with <code>requirepass</code>, where an authentication requirement added by hand quietly disappears on the next restart. Three habits close it. <strong>Follow every <code>CONFIG SET</code> with <code>CONFIG REWRITE</code></strong> — and check it returned <code>OK</code>, because it fails silently in the sense that people do not read the reply. <strong>Or, better, change the file and reload deliberately</strong>, so the file stays the source of truth. <strong>And add a check to your monitoring</strong> that compares a handful of critical <code>CONFIG GET</code> values against what you expect: <code>appendonly</code>, <code>maxmemory</code>, <code>maxmemory-policy</code>, <code>requirepass</code> being non-empty. That check is ten lines and it catches the drift while it is still a curiosity rather than an outage.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/config/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Redis configuration</span><span class="lc-sub">How the file, the command line and <code>CONFIG SET</code> interact, what <code>CONFIG REWRITE</code> preserves, and which directives need a restart.</span></span>
</a>
<a class="link-card" href="https://raw.githubusercontent.com/redis/redis/7.4/redis.conf" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">The annotated redis.conf</span><span class="lc-sub">The shipped file for 7.4 with its full commentary. It is genuinely well written and reading it end to end once is the fastest way to learn what Redis can be told to do.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: configure an instance</span><span class="lc-sub">Graded exercises: write a production config from a set of requirements, diff a running instance against defaults to find what was changed, and demonstrate config drift and the <code>CONFIG REWRITE</code> that prevents it.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Configuration arrives from four places in order — the file, command-line flags, <code>CONFIG SET</code>, and <code>CONFIG REWRITE</code> writing back — and <code>INFO server</code> tells you which file this process actually loaded, which is not always the one you edited. About a dozen directives are real decisions (bind, auth, maxmemory and its policy, durability, dir and logfile, timeouts) and the rest are defaults chosen carefully enough that changing them without a measurement makes things worse. And the running config drifts from the file every time someone fixes something with <code>CONFIG SET</code> during an incident — follow it with <code>CONFIG REWRITE</code>, and monitor a handful of critical values so the drift surfaces before the next restart.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Tệp cấu hình, và những thiết lập thật sự quan trọng</h2>
<p class="lead"><code>redis.conf</code> đi kèm khoảng hai trăm chỉ thị và cỡ một tá trong đó là những quyết định bạn thật sự phải đưa ra. Số còn lại đã đúng ngay từ mặc định. Biết là mười hai cái nào — và biết rằng cấu hình đang chạy với cấu hình trong tệp có thể khác nhau — đã là phần lớn ý nghĩa của việc "cấu hình Redis".</p>

<h3>Cấu hình thật ra đến từ đâu</h3>
<pre><code>redis-cli CONFIG GET dir
redis-cli INFO server | grep -E "config_file|redis_version|process_id|uptime_in_days|executable"
ps -o args= -C redis-server
redis-server --version</code></pre>
<div class="out">1) "dir"
2) "/var/lib/redis"
redis_version:7.4.1
process_id:1284
uptime_in_days:41
executable:/usr/bin/redis-server
config_file:/etc/redis/redis.conf
/usr/bin/redis-server 127.0.0.1:6379
Redis server v=7.4.1 sha=00000000:0 malloc=jemalloc-5.3.0 bits=64</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Cái tệp, nếu có ai đưa cho</span><span class="lz-t">redis-server /etc/redis/redis.conf</span><span class="lz-d">Đọc từ trên xuống dưới, chỉ thị cuối thắng khi trùng lặp. <code>config_file</code> trong <code>INFO server</code> nói cho bạn biết tiến trình này thật sự đã nạp tệp nào — hãy tin cái đó, đừng tin cái tệp bạn cho là nó đã đọc.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Cờ dòng lệnh ghi đè</span><span class="lz-t">--maxmemory 2gb --appendonly yes</span><span class="lz-d">Mọi chỉ thị đều truyền được dưới dạng cờ, và nó ghi đè tệp. Đó là cách ảnh Docker chính thức được cấu hình, và đó là lý do một container có thể phớt lờ cái <code>redis.conf</code> bạn cẩn thận gắn vào.</span></div>
  <div class="lz-step"><span class="lz-k">3 · <code>CONFIG SET</code> lúc đang chạy</span><span class="lz-t">đổi máy chủ, không đổi tệp</span><span class="lz-d">Có hiệu lực ngay và tạm thời. Nó sống tới khi tiến trình khởi động lại rồi biến mất — nguồn phổ biến nhất của câu "nhưng bọn tôi cấu hình cái đó mấy tháng trước rồi mà" (Bài 9.5).</span></div>
  <div class="lz-step"><span class="lz-k">4 · <code>CONFIG REWRITE</code> khép vòng lại</span><span class="lz-t">ghi cấu hình đang sống trở lại tệp</span><span class="lz-d">Nó giữ nguyên phần chú thích của bạn và chỉ viết lại những chỉ thị đã khác đi. Nó thất bại nếu Redis được khởi động mà không có tệp cấu hình — nên một container khởi động bằng cờ thì không lưu lại được gì theo cách này.</span></div>
</div>

<h3>Mười hai cái thật sự quan trọng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>bind</code> và <code>protected-mode</code></span><span class="v">Nghe trên những giao diện mạng nào, và tấm lưới an toàn cho lúc bạn chưa quyết. Hai dòng quan trọng nhất trong tệp, và Bài 10.2 dành trọn cho chúng.</span></div>
  <div class="kv"><span class="k"><code>requirepass</code> / người dùng ACL</span><span class="v">Xác thực. Một Redis không xác thực mà với tới được từ bất cứ đâu ngoài loopback là một Redis đã bị chiếm quyền (Bài 10.3).</span></div>
  <div class="kv"><span class="k"><code>maxmemory</code> + <code>maxmemory-policy</code></span><span class="v">Cái trần và chuyện xảy ra khi chạm nó. Để <code>maxmemory</code> ở 0 nghĩa là Redis phình lên cho tới khi kẻ giết-vì-hết-bộ-nhớ tới, và nó sẽ tới (Bài 9.2).</span></div>
  <div class="kv"><span class="k"><code>appendonly</code> + <code>save</code></span><span class="v">Tư thế bền vững của bạn, và mức RPO bạn đang chọn (Bài 9.5).</span></div>
  <div class="kv"><span class="k"><code>dir</code> và <code>logfile</code></span><span class="v">Nơi dữ liệu và nhật ký rơi vào. Cả hai đều phải ghi được bởi người dùng Redis — hai nguyên nhân phổ biến nhất của một lỗi <code>MISCONF</code> và của một cuốn nhật ký âm thầm đi vào hư vô.</span></div>
  <div class="kv"><span class="k"><code>timeout</code> + <code>tcp-keepalive</code></span><span class="v">Xử lý kết nối rảnh. Mặc định là <code>0</code> (không bao giờ đóng) và <code>300</code>, đúng với một ứng dụng dùng gáo kết nối và sai khi phía sau một bộ cân tải hung hăng (Bài 10.5).</span></div>
</div>
<pre><code><span class="tok-comment"># Một redis.conf tối thiểu cho production, đáng lấy làm điểm xuất phát</span>
bind 127.0.0.1 -::1
protected-mode yes
port 6379
dir /var/lib/redis
logfile /var/log/redis/redis-server.log
loglevel notice

maxmemory 4gb
maxmemory-policy noeviction

appendonly yes
appendfsync everysec
save 900 1 300 100 60 10000
stop-writes-on-bgsave-error yes

timeout 0
tcp-keepalive 300
maxclients 10000

<span class="tok-comment"># slowlog: 5ms, giữ 512 mục (Bài 6.5)</span>
slowlog-log-slower-than 5000
slowlog-max-len 512
latency-monitor-threshold 100</code></pre>
<div class="callout ok"><strong>Đó là một cấu hình production hoàn chỉnh và nó dài ba mươi dòng.</strong> Mọi thứ không được liệt kê đều là một mặc định vốn đã đúng: các ngưỡng mã hoá (Bài 5.2), số mẫu LRU (Bài 9.2), các mốc kích hoạt ghi lại AOF (Bài 9.4), giới hạn bộ đệm đầu ra của khách (Bài 8.1). Hãy kìm cơn thôi thúc tinh chỉnh chúng khi chưa đo đạc — mỗi mặc định đó đại diện cho một đánh đổi mà ai đó đã cân nhắc kỹ, và các biểu đồ trong tài liệu Redis thường cho thấy vì sao. Ba dòng cuối là những dòng người ta hay quên rồi ước gì mình đã có lúc gặp sự cố.</div>

<h3>Đọc cấu hình đang sống</h3>
<pre><code>redis-cli CONFIG GET 'maxmemory*'
redis-cli CONFIG GET 'append*'
redis-cli CONFIG GET '*' | wc -l
<span class="tok-comment"># Thiết lập nào khác mặc định gốc? Hãy so với một lần khởi động sạch.</span>
redis-server --port 7777 --daemonize yes --dir /tmp &gt;/dev/null
diff &lt;(redis-cli -p 7777 CONFIG GET '*' | paste - -) \\
     &lt;(redis-cli CONFIG GET '*' | paste - -) | head -8
redis-cli -p 7777 SHUTDOWN NOSAVE 2&gt;/dev/null</code></pre>
<div class="out">1) "maxmemory"
2) "4294967296"
3) "maxmemory-policy"
4) "noeviction"
5) "maxmemory-samples"
6) "5"
7) "maxmemory-clients"
8) "0"
1) "appendonly"
2) "yes"
3) "appendfsync"
4) "everysec"
584
&lt; appendonly	no
&gt; appendonly	yes
&lt; maxmemory	0
&gt; maxmemory	4294967296
&lt; maxmemory-policy	noeviction
&gt; maxmemory-policy	noeviction</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>CONFIG GET</code> nhận mẫu glob</span><span class="v"><code>CONFIG GET 'maxmemory*'</code> trả về cả họ. Nhanh hơn grep cái tệp, và nó cho thấy thứ <em>đang chạy</em> chứ không phải thứ ai đó đã viết ra.</span></div>
  <div class="kv"><span class="k">So sánh với một máy chủ mặc định</span><span class="v">Mẹo ở trên khởi động một Redis dùng một lần không có cấu hình rồi so sánh. Nó trả lời câu "ở đây thật sự đã đổi những gì" trong một lệnh, cực kỳ quý giá trên một máy bạn thừa kế lại.</span></div>
  <div class="kv"><span class="k">Không phải cái nào cũng đặt được lúc chạy</span><span class="v"><code>databases</code>, <code>appendfilename</code>, <code>unixsocket</code> và vài cái khác đòi khởi động lại. <code>CONFIG SET</code> nói rõ ràng khi nó từ chối.</span></div>
  <div class="kv"><span class="k"><code>maxmemory-clients</code> là thứ mới</span><span class="v">Redis 7.0 thêm một cái trần riêng cho tổng bộ nhớ bộ đệm đầu ra của các khách, cuối cùng cũng ngăn được vài bên đăng ký chậm ngốn cả cái máy (Bài 8.1). <code>0</code> nghĩa là vô hạn; một tỉ lệ phần trăm như <code>5%</code> là một thiết lập hợp lý.</span></div>
  <div class="kv"><span class="k">Hãy giữ cái tệp trong hệ quản lý phiên bản</span><span class="v">Nó là cấu hình triển khai như mọi cấu hình khác. Một <code>redis.conf</code> chỉ tồn tại trên máy chủ là một cái máy bạn không dựng lại được.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> cấu hình đang chạy và cấu hình trong tệp trôi xa nhau, và không ai nhận ra cho tới một lần khởi động lại. Có người nâng <code>maxmemory</code> lúc đang có sự cố bằng <code>CONFIG SET</code>, cái máy hồi phục, rồi tám tháng sau một lần khởi động lại định kỳ đưa nó về giá trị cũ và đúng cái sự cố ấy lặp lại — chỉ khác là giờ chẳng ai còn nhớ cách chữa. Cùng câu chuyện đó diễn ra với <code>appendonly</code>, với <code>maxmemory-policy</code>, và nguy hiểm nhất là với <code>requirepass</code>, nơi một yêu cầu xác thực thêm bằng tay lặng lẽ biến mất ở lần khởi động lại kế tiếp. Ba thói quen bịt được nó. <strong>Hãy theo sau mọi <code>CONFIG SET</code> bằng một <code>CONFIG REWRITE</code></strong> — và kiểm xem nó có trả về <code>OK</code> không, vì nó thất bại một cách âm thầm theo nghĩa là người ta không đọc câu trả lời. <strong>Hoặc, tốt hơn, hãy sửa cái tệp rồi nạp lại một cách có chủ ý</strong>, để cái tệp vẫn là nguồn sự thật. <strong>Và hãy thêm một phép kiểm vào hệ giám sát</strong> so vài giá trị <code>CONFIG GET</code> then chốt với thứ bạn mong đợi: <code>appendonly</code>, <code>maxmemory</code>, <code>maxmemory-policy</code>, và <code>requirepass</code> khác rỗng. Phép kiểm đó dài mười dòng và nó bắt được sự trôi dạt khi nó còn là chuyện lạ chứ chưa thành sự cố.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/config/" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Redis configuration</span><span class="lc-sub">Cái tệp, dòng lệnh và <code>CONFIG SET</code> tương tác với nhau ra sao, <code>CONFIG REWRITE</code> giữ lại những gì, và chỉ thị nào cần khởi động lại.</span></span>
</a>
<a class="link-card" href="https://raw.githubusercontent.com/redis/redis/7.4/redis.conf" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Tệp redis.conf có chú giải</span><span class="lc-sub">Tệp đi kèm bản 7.4 với toàn bộ phần bình luận. Nó thật sự được viết hay và đọc trọn một lượt là cách nhanh nhất để biết Redis sai khiến được những gì.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: cấu hình một máy</span><span class="lc-sub">Bài chấm điểm: viết một cấu hình production từ một bộ yêu cầu, so một máy đang chạy với mặc định để tìm ra thứ đã bị đổi, và tái hiện sự trôi dạt cấu hình cùng lệnh <code>CONFIG REWRITE</code> ngăn nó.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Cấu hình tới từ bốn nơi theo thứ tự — cái tệp, cờ dòng lệnh, <code>CONFIG SET</code>, và <code>CONFIG REWRITE</code> ghi ngược trở lại — và <code>INFO server</code> nói cho bạn biết tiến trình này thật sự nạp tệp nào, vốn không phải lúc nào cũng là cái tệp bạn vừa sửa. Cỡ một tá chỉ thị là quyết định thật (bind, xác thực, maxmemory và chính sách của nó, độ bền, dir và logfile, các hạn giờ) còn số còn lại là những mặc định được chọn đủ kỹ để việc đổi chúng mà không đo đạc chỉ làm mọi thứ tệ hơn. Và cấu hình đang chạy trôi khỏi cái tệp mỗi lần có người chữa cháy bằng <code>CONFIG SET</code> giữa sự cố — hãy theo sau bằng <code>CONFIG REWRITE</code>, và hãy giám sát vài giá trị then chốt để sự trôi dạt lộ ra trước lần khởi động lại kế tiếp.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Network exposure: why Redis got attacked so often|||10.2 — Phơi ra mạng: vì sao Redis từng bị tấn công nhiều đến thế',
      slug: 'rd-10-2-phoi-ra-mang',
      type: 'LESSON',
      description: 'Redis được thiết kế cho mạng nội bộ tin cậy, và điều đó khiến nó thành cơ sở dữ liệu bị quét nhiều nhất Internet. bind với protected-mode, vì sao requirepass phải rất dài, socket Unix, và bật TLS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Network exposure: why Redis got attacked so often</h2>
<p class="lead">Redis was designed on an explicit assumption: it runs inside a trusted network, behind a firewall, reachable only by your own application. That assumption is stated in the documentation and it is entirely reasonable. It is also the assumption that made an unprotected Redis one of the most reliably compromised services on the public internet.</p>

<h3>Why an open Redis is not "just" a data leak</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Every key is readable and writable</span><span class="lz-lnote">The obvious part: sessions, tokens, cached personal data, queue contents. An attacker with a connection has the same powers your application does — including <code>FLUSHALL</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CONFIG SET</code> turns it into arbitrary file writes</span><span class="lz-lnote">This is the part that surprises people. <code>dir</code> and <code>dbfilename</code> are runtime-settable, so an attacker can point a save at any path the Redis user can write and then trigger one. The saved file contains attacker-controlled data. Whether that becomes remote code execution depends entirely on where the Redis process is allowed to write — and historically, on a default-installed Redis running as root, it did.</span></div>
  <div class="lz-layer"><span class="lz-lname">Scanners find it in minutes, not weeks</span><span class="lz-lnote">Port 6379 on a public IP is indexed continuously. There is no obscurity to rely on: an instance exposed by accident during a deploy is typically probed the same hour, and the payloads are fully automated.</span></div>
  <div class="lz-layer"><span class="lz-lname">Replication can be pointed at an attacker</span><span class="lz-lnote"><code>REPLICAOF</code> is also a runtime command, so an unprotected instance can be told to sync from a server the attacker controls — replacing your entire dataset with theirs (Chapter 11). Instant, total, and reversible only from backups.</span></div>
</div>
<div class="callout warn"><strong>The defence is not a clever configuration, it is not being reachable.</strong> Every mitigation below is real and worth applying, but they are layers on top of the actual answer: Redis should be on a private network or a loopback interface, with a firewall or security group that permits only your application hosts, and nothing else. If an attacker can open a TCP connection to port 6379, you are relying on authentication alone to hold — and authentication is a single configuration line that has been forgotten on a great many instances.</div>

<h3>bind and protected-mode</h3>
<pre><code>redis-cli CONFIG GET bind protected-mode requirepass
<span class="tok-comment"># What is actually listening, and on what?</span>
ss -lntp | grep 6379
<span class="tok-comment"># From another host, with no password set and protected-mode on:</span>
redis-cli -h 10.0.1.42 PING</code></pre>
<div class="out">1) "bind"
2) "127.0.0.1 -::1"
3) "protected-mode"
4) "yes"
5) "requirepass"
6) ""
LISTEN 0 511 127.0.0.1:6379 0.0.0.0:* users:(("redis-server",pid=1284,fd=7))
LISTEN 0 511    [::1]:6379    [::]:*  users:(("redis-server",pid=1284,fd=8))
(error) DENIED Redis is running in protected mode because protected mode is enabled and no password is set for the default user. In this mode connections are only accepted from the loopback interface. If you want to connect from external computers to Redis you may adopt one of the following solutions: ...</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>bind 127.0.0.1 -::1</code> is the default</span><span class="v">And it is the strongest single line in the file: the socket is not even opened on other interfaces, so a firewall mistake cannot expose it. The <code>-</code> prefix means "bind if this address exists, do not fail to start if it does not".</span></div>
  <div class="kv"><span class="k"><code>protected-mode yes</code> is the safety net</span><span class="v">Added in Redis 3.2 precisely because of the attacks. If there is no <code>bind</code> restriction <em>and</em> no password, Redis refuses connections from anything but loopback and returns that long explanatory error. It exists to catch the misconfiguration, not to be your security model.</span></div>
  <div class="kv"><span class="k">Binding to a private IP, not <code>0.0.0.0</code></span><span class="v">If the app is on another host, <code>bind 10.0.1.42 127.0.0.1</code> listens on the private interface only. <code>0.0.0.0</code> means every interface including whatever public one gets attached later.</span></div>
  <div class="kv"><span class="k">Verify with <code>ss</code>, not with the config</span><span class="v">The config says what was requested; <code>ss -lntp</code> says what is actually listening. Those disagree more often than you would like, especially in containers where port publishing happens outside Redis entirely.</span></div>
  <div class="kv"><span class="k">Containers bypass all of this</span><span class="v"><code>docker run -p 6379:6379</code> publishes to <em>every</em> host interface regardless of what Redis binds inside the container. Publish to <code>127.0.0.1:6379:6379</code>, or do not publish at all and use a Docker network.</span></div>
</div>

<h3>Authentication that is worth having</h3>
<pre><code>redis-cli ACL GENPASS
redis-cli ACL GENPASS 256
redis-cli CONFIG SET requirepass "$(redis-cli ACL GENPASS)"
redis-cli PING
redis-cli -a '&lt;the generated password&gt;' --no-auth-warning PING
<span class="tok-comment"># How fast can something guess? Measure it.</span>
redis-benchmark -t auth -n 100000 -q 2&gt;/dev/null || redis-cli --no-auth-warning INFO stats | grep total_connections</code></pre>
<div class="out">d1e4ab9c8f2704b3c0a5e6d78f91b2c3
c8f9d2e1a4b7063f5e8d9c2a1b4e7f60d3c8a9b2e5f1074d6c9b8a3e2f5d1c40
OK
(error) NOAUTH Authentication required.
PONG
AUTH: 158731.02 requests per second</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">158,000 guesses per second</span><span class="lz-t">from one client, on a laptop</span><span class="lz-d">Redis has no login delay, no lockout and no rate limit on <code>AUTH</code> — because it was never meant to be exposed to something that would guess. A dictionary word or a short password is not a password here; it is a formality.</span></div>
  <div class="lz-step"><span class="lz-k"><code>ACL GENPASS</code> generates properly</span><span class="lz-t">256 bits of entropy, hex encoded</span><span class="lz-d">Use it rather than inventing something. <code>ACL GENPASS 256</code> gives you 64 hex characters, which is beyond brute force by any margin that matters.</span></div>
  <div class="lz-step"><span class="lz-k">Never put it on the command line</span><span class="lz-t">-a leaks into ps and shell history</span><span class="lz-d"><code>redis-cli -a secret</code> is visible in the process list to every user on the box. Use <code>REDISCLI_AUTH</code> in the environment, or let <code>redis-cli</code> prompt, or put it in a file only the deploy user can read.</span></div>
  <div class="lz-step"><span class="lz-k">Prefer an ACL user to <code>requirepass</code></span><span class="lz-t">requirepass is the default user's password</span><span class="lz-d">It authenticates you as <code>default</code>, which has <code>+@all ~* &amp;*</code> — every command on every key. A named user with only the permissions your application needs is strictly better, and Lesson 10.3 is how.</span></div>
</div>

<h3>Two ways to remove the network entirely</h3>
<pre><code><span class="tok-comment"># 1 · Unix socket — no TCP at all, filesystem permissions are the ACL</span>
redis-cli CONFIG GET unixsocket unixsocketperm
<span class="tok-comment">#   in redis.conf:  unixsocket /run/redis/redis.sock</span>
<span class="tok-comment">#                   unixsocketperm 770</span>
redis-cli -s /run/redis/redis.sock PING

<span class="tok-comment"># 2 · TLS — encrypted and mutually authenticated (Redis 6.0+)</span>
redis-cli CONFIG GET tls-port tls-cert-file tls-auth-clients
redis-cli --tls --cert client.crt --key client.key --cacert ca.crt -p 6380 PING</code></pre>
<div class="out">1) "unixsocket"
2) "/run/redis/redis.sock"
3) "unixsocketperm"
4) "770"
PONG
1) "tls-port"
2) "6380"
3) "tls-cert-file"
4) "/etc/redis/tls/redis.crt"
5) "tls-auth-clients"
6) "yes"
PONG</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Unix sockets when app and Redis share a host</span><span class="v">No network stack, no port to scan, and roughly 25–50% lower latency than loopback TCP. Access control becomes file permissions, which is a model your OS already enforces well.</span></div>
  <div class="kv"><span class="k">TLS needs an explicit build and port</span><span class="v">Redis 6.0+ supports it, but many distribution packages compile it in while leaving <code>tls-port 0</code>. Setting <code>tls-port 6380</code> runs TLS alongside plain TCP; set <code>port 0</code> to turn plain TCP off entirely.</span></div>
  <div class="kv"><span class="k"><code>tls-auth-clients yes</code> is mutual TLS</span><span class="v">The client must present a certificate your CA signed. That is stronger than a password and it is the setting that makes TLS a real access control rather than only encryption.</span></div>
  <div class="kv"><span class="k">TLS costs throughput</span><span class="v">Expect a noticeable drop versus plain TCP, more on small commands where the crypto dominates. Measure it with <code>redis-benchmark --tls</code> on your hardware before assuming it is free.</span></div>
  <div class="kv"><span class="k">Replication and Cluster need TLS too</span><span class="v">Turning on <code>tls-port</code> without <code>tls-replication yes</code> and <code>tls-cluster yes</code> leaves the internal traffic in plaintext — encrypted clients, unencrypted replication (Chapter 11).</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> assuming a private network is private. The most common way an "internal only" Redis becomes reachable is not a firewall being switched off — it is something changing shape around it. A container is published with <code>-p 6379:6379</code> during debugging and the flag survives into the compose file. A cloud security group is widened to <code>0.0.0.0/0</code> "temporarily" for a migration. A VPN peering or a new subnet route quietly adds hosts you never intended. A Kubernetes <code>Service</code> is changed from <code>ClusterIP</code> to <code>LoadBalancer</code> by someone who needed to test something. In every one of those, nothing about Redis changed and its exposure changed completely. So do not verify the intent, verify the reality, and do it on a schedule: from outside your network, check whether the port answers; from the Redis host, run <code>ss -lntp</code> and confirm the addresses; and make sure <code>requirepass</code> or an ACL user is set <em>even on instances you are certain are unreachable</em>, because that setting is the one that still holds when the network assumption stops being true.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Redis security</span><span class="lc-sub">The official model: the trusted-network assumption stated explicitly, protected mode, authentication, and the section on why <code>CONFIG SET</code> access is equivalent to file-write access.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/encryption/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">TLS in Redis</span><span class="lc-sub">Generating certificates, the <code>tls-*</code> directives, mutual authentication, and the separate flags needed for replication and cluster traffic.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: lock down an instance</span><span class="lc-sub">Graded exercises: audit a running instance for exposure, fix a container that publishes to every interface, switch an app to a Unix socket, and enable TLS with client certificates.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> An open Redis is not only a data leak: <code>CONFIG SET</code> makes <code>dir</code> and <code>dbfilename</code> runtime-settable, and <code>REPLICAOF</code> can be pointed at an attacker's server — so reachability plus no authentication is a full compromise, not a disclosure. The real defence is not being reachable: bind to loopback or a private address, firewall to your application hosts, and verify with <code>ss -lntp</code> rather than trusting the config. And because Redis will happily process 158,000 <code>AUTH</code> attempts a second with no lockout, a password must come from <code>ACL GENPASS</code> and never from your imagination — and it should be set even on instances you are sure nothing can reach.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Phơi ra mạng: vì sao Redis từng bị tấn công nhiều đến thế</h2>
<p class="lead">Redis được thiết kế trên một giả định nói thẳng: nó chạy bên trong một mạng tin cậy, sau tường lửa, chỉ ứng dụng của bạn với tới được. Giả định đó được ghi rõ trong tài liệu và hoàn toàn hợp lý. Nó cũng chính là giả định biến một Redis không được bảo vệ thành một trong những dịch vụ bị chiếm quyền đều đặn nhất trên Internet công cộng.</p>

<h3>Vì sao một Redis mở toang không "chỉ" là rò rỉ dữ liệu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Mọi khoá đều đọc được và ghi được</span><span class="lz-lnote">Phần hiển nhiên: phiên đăng nhập, mã thông báo, dữ liệu cá nhân đã đệm, nội dung hàng đợi. Một kẻ tấn công có kết nối thì có đúng những quyền năng mà ứng dụng của bạn có — kể cả <code>FLUSHALL</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CONFIG SET</code> biến nó thành ghi tệp tuỳ ý</span><span class="lz-lnote">Đây là phần làm người ta bất ngờ. <code>dir</code> và <code>dbfilename</code> đặt được lúc chạy, nên kẻ tấn công có thể trỏ một lần lưu vào bất cứ đường dẫn nào người dùng Redis ghi được rồi kích hoạt nó. Tệp được lưu chứa dữ liệu do kẻ tấn công kiểm soát. Chuyện đó có thành thực thi mã từ xa hay không phụ thuộc hoàn toàn vào nơi tiến trình Redis được phép ghi — và trong lịch sử, trên một Redis cài mặc định chạy dưới quyền root, nó đã thành.</span></div>
  <div class="lz-layer"><span class="lz-lname">Máy quét tìm ra nó trong vài phút, không phải vài tuần</span><span class="lz-lnote">Cổng 6379 trên một IP công cộng bị lập chỉ mục liên tục. Không có sự mờ tối nào để trông cậy: một máy vô tình bị phơi ra trong lúc deploy thường bị dò ngay trong cùng giờ đó, và các gói tấn công đều hoàn toàn tự động.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phép nhân bản có thể bị trỏ về phía kẻ tấn công</span><span class="lz-lnote"><code>REPLICAOF</code> cũng là một lệnh chạy lúc đang chạy, nên một máy không được bảo vệ có thể bị bảo đồng bộ từ một máy chủ do kẻ tấn công kiểm soát — thay toàn bộ tập dữ liệu của bạn bằng của họ (Chương 11). Tức thì, trọn vẹn, và chỉ đảo ngược được từ bản sao lưu.</span></div>
</div>
<div class="callout warn"><strong>Cách phòng thủ không phải một cấu hình khôn ngoan, mà là việc không với tới được.</strong> Mọi biện pháp giảm thiểu dưới đây đều có thật và đáng áp dụng, nhưng chúng là các lớp phủ lên câu trả lời thật sự: Redis nên nằm trên một mạng riêng hoặc một giao diện loopback, với một tường lửa hay nhóm bảo mật chỉ cho phép các máy ứng dụng của bạn, và không cho gì khác. Nếu kẻ tấn công mở được một kết nối TCP tới cổng 6379 thì bạn đang trông cậy vào mỗi phép xác thực để chống đỡ — mà phép xác thực chỉ là một dòng cấu hình duy nhất, và nó đã bị quên trên vô số máy.</div>

<h3>bind và protected-mode</h3>
<pre><code>redis-cli CONFIG GET bind protected-mode requirepass
<span class="tok-comment"># Cái gì đang thật sự lắng nghe, và trên đâu?</span>
ss -lntp | grep 6379
<span class="tok-comment"># Từ một máy khác, khi chưa đặt mật khẩu và protected-mode đang bật:</span>
redis-cli -h 10.0.1.42 PING</code></pre>
<div class="out">1) "bind"
2) "127.0.0.1 -::1"
3) "protected-mode"
4) "yes"
5) "requirepass"
6) ""
LISTEN 0 511 127.0.0.1:6379 0.0.0.0:* users:(("redis-server",pid=1284,fd=7))
LISTEN 0 511    [::1]:6379    [::]:*  users:(("redis-server",pid=1284,fd=8))
(error) DENIED Redis is running in protected mode because protected mode is enabled and no password is set for the default user. In this mode connections are only accepted from the loopback interface. If you want to connect from external computers to Redis you may adopt one of the following solutions: ...</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>bind 127.0.0.1 -::1</code> là mặc định</span><span class="v">Và đó là dòng mạnh nhất trong cả tệp: cái socket thậm chí không được mở trên các giao diện khác, nên một sai sót tường lửa cũng không phơi nó ra được. Tiền tố <code>-</code> nghĩa là "hãy gắn nếu địa chỉ này tồn tại, đừng chết lúc khởi động nếu nó không tồn tại".</span></div>
  <div class="kv"><span class="k"><code>protected-mode yes</code> là tấm lưới an toàn</span><span class="v">Thêm vào ở Redis 3.2 đúng vì những vụ tấn công đó. Nếu không có ràng buộc <code>bind</code> <em>và</em> không có mật khẩu, Redis từ chối mọi kết nối trừ loopback rồi trả về cái lỗi giải thích dài dằng dặc kia. Nó tồn tại để bắt cấu hình sai, không phải để làm mô hình bảo mật của bạn.</span></div>
  <div class="kv"><span class="k">Hãy gắn vào một IP riêng, đừng gắn <code>0.0.0.0</code></span><span class="v">Nếu ứng dụng nằm ở máy khác thì <code>bind 10.0.1.42 127.0.0.1</code> chỉ lắng nghe trên giao diện riêng. <code>0.0.0.0</code> nghĩa là mọi giao diện, kể cả cái giao diện công cộng nào đó được gắn thêm về sau.</span></div>
  <div class="kv"><span class="k">Hãy xác minh bằng <code>ss</code>, đừng xác minh bằng cấu hình</span><span class="v">Cấu hình nói thứ đã được yêu cầu; <code>ss -lntp</code> nói thứ đang thật sự lắng nghe. Hai cái đó lệch nhau thường xuyên hơn bạn muốn, nhất là trong container nơi việc công bố cổng xảy ra hoàn toàn bên ngoài Redis.</span></div>
  <div class="kv"><span class="k">Container đi vòng qua tất cả chuyện này</span><span class="v"><code>docker run -p 6379:6379</code> công bố ra <em>mọi</em> giao diện của máy chủ bất kể Redis gắn vào đâu bên trong container. Hãy công bố ra <code>127.0.0.1:6379:6379</code>, hoặc đừng công bố gì cả mà dùng một mạng Docker.</span></div>
</div>

<h3>Xác thực cho đáng gọi là xác thực</h3>
<pre><code>redis-cli ACL GENPASS
redis-cli ACL GENPASS 256
redis-cli CONFIG SET requirepass "$(redis-cli ACL GENPASS)"
redis-cli PING
redis-cli -a '&lt;mật khẩu vừa sinh&gt;' --no-auth-warning PING
<span class="tok-comment"># Một thứ gì đó đoán nhanh cỡ nào? Hãy đo.</span>
redis-benchmark -t auth -n 100000 -q 2&gt;/dev/null || redis-cli --no-auth-warning INFO stats | grep total_connections</code></pre>
<div class="out">d1e4ab9c8f2704b3c0a5e6d78f91b2c3
c8f9d2e1a4b7063f5e8d9c2a1b4e7f60d3c8a9b2e5f1074d6c9b8a3e2f5d1c40
OK
(error) NOAUTH Authentication required.
PONG
AUTH: 158731.02 requests per second</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">158.000 lượt đoán mỗi giây</span><span class="lz-t">từ một khách duy nhất, trên một cái laptop</span><span class="lz-d">Redis không có độ trễ đăng nhập, không khoá tài khoản và không giới hạn tần suất cho <code>AUTH</code> — vì nó chưa bao giờ được thiết kế để phơi ra trước thứ sẽ đi đoán. Một từ trong từ điển hay một mật khẩu ngắn thì ở đây không phải mật khẩu; nó là một thủ tục hình thức.</span></div>
  <div class="lz-step"><span class="lz-k"><code>ACL GENPASS</code> sinh mật khẩu cho tử tế</span><span class="lz-t">256 bit entropy, mã hoá hex</span><span class="lz-d">Hãy dùng nó thay vì tự nghĩ ra. <code>ACL GENPASS 256</code> cho bạn 64 ký tự hex, vượt xa khả năng dò cạn theo bất kỳ biên độ nào đáng kể.</span></div>
  <div class="lz-step"><span class="lz-k">Đừng bao giờ đặt nó trên dòng lệnh</span><span class="lz-t">-a rò ra ps và lịch sử shell</span><span class="lz-d"><code>redis-cli -a secret</code> hiện ra trong danh sách tiến trình với mọi người dùng trên máy đó. Hãy dùng <code>REDISCLI_AUTH</code> trong biến môi trường, hoặc để <code>redis-cli</code> tự hỏi, hoặc đặt nó vào một tệp mà chỉ người dùng triển khai đọc được.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy ưu tiên một người dùng ACL hơn <code>requirepass</code></span><span class="lz-t">requirepass là mật khẩu của người dùng default</span><span class="lz-d">Nó xác thực bạn thành <code>default</code>, vốn có <code>+@all ~* &amp;*</code> — mọi lệnh trên mọi khoá. Một người dùng có tên với đúng những quyền ứng dụng của bạn cần thì tốt hơn hẳn, và Bài 10.3 chỉ cách làm.</span></div>
</div>

<h3>Hai cách gỡ bỏ hẳn cái mạng</h3>
<pre><code><span class="tok-comment"># 1 · Socket Unix — không TCP gì cả, quyền hệ tệp chính là danh sách kiểm soát</span>
redis-cli CONFIG GET unixsocket unixsocketperm
<span class="tok-comment">#   trong redis.conf:  unixsocket /run/redis/redis.sock</span>
<span class="tok-comment">#                      unixsocketperm 770</span>
redis-cli -s /run/redis/redis.sock PING

<span class="tok-comment"># 2 · TLS — mã hoá và xác thực hai chiều (Redis 6.0+)</span>
redis-cli CONFIG GET tls-port tls-cert-file tls-auth-clients
redis-cli --tls --cert client.crt --key client.key --cacert ca.crt -p 6380 PING</code></pre>
<div class="out">1) "unixsocket"
2) "/run/redis/redis.sock"
3) "unixsocketperm"
4) "770"
PONG
1) "tls-port"
2) "6380"
3) "tls-cert-file"
4) "/etc/redis/tls/redis.crt"
5) "tls-auth-clients"
6) "yes"
PONG</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Socket Unix khi ứng dụng và Redis chung một máy</span><span class="v">Không ngăn xếp mạng, không cổng nào để quét, và độ trễ thấp hơn TCP loopback khoảng 25–50%. Kiểm soát truy cập trở thành quyền tệp, một mô hình mà hệ điều hành của bạn vốn đã thực thi rất tốt.</span></div>
  <div class="kv"><span class="k">TLS cần một bản dựng và một cổng tường minh</span><span class="v">Redis 6.0+ hỗ trợ nó, nhưng nhiều gói của bản phân phối biên dịch nó vào mà vẫn để <code>tls-port 0</code>. Đặt <code>tls-port 6380</code> thì TLS chạy song song với TCP thường; đặt <code>port 0</code> để tắt hẳn TCP thường.</span></div>
  <div class="kv"><span class="k"><code>tls-auth-clients yes</code> là TLS hai chiều</span><span class="v">Khách phải trình ra một chứng chỉ do CA của bạn ký. Cái đó mạnh hơn một mật khẩu và là thiết lập biến TLS thành một cơ chế kiểm soát truy cập thật chứ không chỉ là mã hoá.</span></div>
  <div class="kv"><span class="k">TLS tốn thông lượng</span><span class="v">Hãy chờ đợi một mức giảm thấy rõ so với TCP thường, và giảm nhiều hơn với các lệnh nhỏ nơi phần mật mã chiếm ưu thế. Hãy đo bằng <code>redis-benchmark --tls</code> trên phần cứng của bạn trước khi cho rằng nó miễn phí.</span></div>
  <div class="kv"><span class="k">Nhân bản và Cluster cũng cần TLS</span><span class="v">Bật <code>tls-port</code> mà không bật <code>tls-replication yes</code> và <code>tls-cluster yes</code> thì lưu lượng nội bộ vẫn ở dạng văn bản thô — khách thì mã hoá, nhân bản thì không (Chương 11).</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> cho rằng một mạng riêng thì riêng thật. Cách phổ biến nhất mà một Redis "chỉ nội bộ" trở nên với tới được không phải là tường lửa bị tắt — mà là có thứ gì đó quanh nó đổi hình dạng. Một container được công bố bằng <code>-p 6379:6379</code> lúc gỡ lỗi rồi cái cờ ấy sống sót vào tệp compose. Một nhóm bảo mật đám mây được nới ra <code>0.0.0.0/0</code> "tạm thời" cho một lần di trú. Một cầu nối VPN hay một tuyến mạng con mới lặng lẽ thêm vào những máy bạn chưa từng có ý định cho vào. Một <code>Service</code> Kubernetes được đổi từ <code>ClusterIP</code> sang <code>LoadBalancer</code> bởi một người cần thử một thứ gì đó. Trong mọi trường hợp đó thì bản thân Redis chẳng thay đổi gì mà mức phơi bày của nó đổi hoàn toàn. Nên đừng xác minh ý định, hãy xác minh thực tế, và làm việc đó theo lịch: từ ngoài mạng của bạn, hãy kiểm xem cái cổng có trả lời không; từ chính máy Redis, hãy chạy <code>ss -lntp</code> rồi xác nhận các địa chỉ; và hãy chắc rằng <code>requirepass</code> hoặc một người dùng ACL đã được đặt <em>ngay cả trên những máy bạn chắc chắn là không ai với tới được</em>, vì đó là thiết lập vẫn còn chống đỡ được khi cái giả định về mạng thôi còn đúng.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">Redis security</span><span class="lc-sub">Mô hình chính thức: giả định mạng-tin-cậy được nói thẳng ra, chế độ bảo vệ, xác thực, và mục nói vì sao quyền truy cập <code>CONFIG SET</code> tương đương với quyền ghi tệp.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/encryption/" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">TLS trong Redis</span><span class="lc-sub">Tạo chứng chỉ, các chỉ thị <code>tls-*</code>, xác thực hai chiều, và những cờ riêng cần cho lưu lượng nhân bản với lưu lượng cụm.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: khoá chặt một máy</span><span class="lc-sub">Bài chấm điểm: rà soát một máy đang chạy xem có bị phơi ra không, sửa một container công bố ra mọi giao diện, chuyển một ứng dụng sang socket Unix, và bật TLS kèm chứng chỉ khách.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một Redis mở toang không chỉ là rò rỉ dữ liệu: <code>CONFIG SET</code> làm cho <code>dir</code> và <code>dbfilename</code> đặt được lúc chạy, còn <code>REPLICAOF</code> thì trỏ được về máy chủ của kẻ tấn công — nên với tới được cộng không xác thực là một cú chiếm quyền trọn vẹn, không phải một vụ lộ dữ liệu. Cách phòng thủ thật là việc không với tới được: hãy gắn vào loopback hoặc một địa chỉ riêng, dựng tường lửa chỉ cho các máy ứng dụng của bạn, và xác minh bằng <code>ss -lntp</code> chứ đừng tin cấu hình. Và vì Redis vui vẻ xử lý 158.000 lượt <code>AUTH</code> mỗi giây mà không khoá tài khoản, mật khẩu phải đến từ <code>ACL GENPASS</code> chứ đừng bao giờ từ trí tưởng tượng của bạn — và nó nên được đặt ngay cả trên những máy bạn chắc chắn không gì với tới được.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — ACLs: users, categories and key patterns|||10.3 — ACL: người dùng, nhóm lệnh và mẫu khoá',
      slug: 'rd-10-3-acl',
      type: 'LESSON',
      description: 'ACL SETUSER đọc từng ký tự, các nhóm lệnh @read với @write với @dangerous, mẫu khoá ~ và %R~ và %W~, kênh &, selector của bản 7.0, tệp ACL, và ACL LOG cho biết ai vừa bị chặn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>ACLs: users, categories and key patterns</h2>
<p class="lead">Before Redis 6 there was one password and it gave you everything. ACLs replaced that with named users who can be restricted to specific commands, specific key patterns and specific Pub/Sub channels — which finally makes "the reporting service can read the cache and nothing else" expressible.</p>

<h3>The default user, and why it is the problem</h3>
<pre><code>redis-cli ACL WHOAMI
redis-cli ACL LIST
redis-cli ACL GETUSER default | head -12</code></pre>
<div class="out">"default"
1) "user default on nopass sanitize-payload ~* &amp;* +@all"
1) "flags"
2) 1) "on"
   2) "allkeys"
   3) "allchannels"
   4) "nopass"
3) "passwords"
4) (empty array)
5) "commands"
6) "+@all"
7) "keys"
8) "~*"
9) "channels"
10) "&amp;*"</div>
<div class="callout warn"><strong>Read that first line as a sentence: the user <code>default</code> is enabled, needs no password, and may run every command on every key and every channel.</strong> That is the account your application uses right now, and setting <code>requirepass</code> only adds a password to it — the permissions stay <code>+@all ~* &amp;*</code>. So a leaked connection string, an SSRF that reaches Redis, or a bug in one service gives an attacker <code>FLUSHALL</code>, <code>CONFIG SET</code>, <code>REPLICAOF</code> and every key belonging to every other service. ACLs exist so that the blast radius of a compromised credential is the subset of data that credential actually needed.</div>

<h3>Building a user, one rule at a time</h3>
<pre><code>redis-cli ACL SETUSER webapp on '&gt;s3cr3t-from-genpass' \\
  '~cache:*' '~sess:*' '&amp;events:*' \\
  +@read +@write +@keyspace -@dangerous
redis-cli ACL GETUSER webapp | paste - - | head -6
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 GET cache:x
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 GET other:x
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 FLUSHALL
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 CONFIG GET maxmemory</code></pre>
<div class="out">OK
flags	on
passwords	1) "d1e4ab…"
commands	-@all +@read +@write +@keyspace -@dangerous
keys	~cache:* ~sess:*
channels	&amp;events:*
(nil)
(error) NOPERM No permissions to access a key
(error) NOPERM User webapp has no permissions to run the 'flushall' command
(error) NOPERM User webapp has no permissions to run the 'config|get' command</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Rules apply in order, left to right</span><span class="lz-t">+@read +@write -@dangerous</span><span class="lz-d">Each token modifies the permission set built so far, so a later rule overrides an earlier one. <code>+@all -@dangerous</code> and <code>-@dangerous +@all</code> mean completely different things — the second grants everything back.</span></div>
  <div class="lz-step"><span class="lz-k">Users start with nothing</span><span class="lz-t">off, nopass, -@all, no keys, no channels</span><span class="lz-d">A newly created user cannot connect and cannot do anything. Every capability is something you added on purpose, which is the right default for an access control system.</span></div>
  <div class="lz-step"><span class="lz-k"><code>&gt;password</code> adds, <code>&lt;password</code> removes</span><span class="lz-t">and <code>#hash</code> sets a SHA-256 directly</span><span class="lz-d">A user can hold several passwords, which is how you rotate credentials without downtime: add the new one, deploy, remove the old one. Use <code>#</code> with a pre-hashed value if you would rather not send the plaintext.</span></div>
  <div class="lz-step"><span class="lz-k"><code>on</code> / <code>off</code> is the kill switch</span><span class="lz-t">ACL SETUSER webapp off</span><span class="lz-d">Disables the user immediately without deleting its rules. New connections are refused; existing ones are <em>not</em> dropped, so pair it with <code>CLIENT KILL USER webapp</code> when you mean it (Lesson 10.5).</span></div>
</div>

<h3>Categories, and the ones that matter</h3>
<pre><code>redis-cli ACL CAT | tr '\\n' ' '
redis-cli ACL CAT dangerous | tr '\\n' ' ' | head -c 300
redis-cli ACL CAT admin | tr '\\n' ' '</code></pre>
<div class="out">keyspace read write set sortedset list hash string bitmap hyperloglog geo stream pubsub admin fast slow blocking dangerous connection transaction scripting
flushdb flushall shutdown replicaof monitor debug config acl client cluster failover swapdb restore migrate sort keys sync psync bgsave bgrewriteaof info latency slowlog module lastsave save
flushdb flushall shutdown replicaof monitor debug config acl client cluster failover swapdb slaveof
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>@dangerous</code> is the one to subtract</span><span class="v"><code>FLUSHALL</code>, <code>CONFIG</code>, <code>REPLICAOF</code>, <code>DEBUG</code>, <code>KEYS</code>, <code>MONITOR</code>, <code>SHUTDOWN</code>, <code>MIGRATE</code> — every command that can destroy data, expose it, or take the server down. Almost no application user should have any of them.</span></div>
  <div class="kv"><span class="k"><code>@read</code> and <code>@write</code> cut across types</span><span class="v"><code>+@read</code> grants <code>GET</code>, <code>HGET</code>, <code>SMEMBERS</code>, <code>ZRANGE</code>, <code>XREAD</code> and so on across every data type. A reporting user is often exactly <code>+@read -@dangerous</code> and nothing else.</span></div>
  <div class="kv"><span class="k"><code>@slow</code> and <code>@blocking</code> are useful negatives</span><span class="v"><code>-@slow</code> removes the O(N) commands (Lesson 6.5) and <code>-@blocking</code> removes <code>BLPOP</code> and friends — a good way to stop an analytics user from stalling the server (Lesson 1.1).</span></div>
  <div class="kv"><span class="k">Individual commands work too</span><span class="v"><code>+get +set +hgetall</code> is valid, and so is a subcommand: <code>+config|get</code> allows reading configuration while <code>config|set</code> stays denied. That granularity is genuinely useful for a monitoring user.</span></div>
  <div class="kv"><span class="k"><code>allkeys</code>, <code>allchannels</code>, <code>allcommands</code></span><span class="v">Shorthands for <code>~*</code>, <code>&amp;*</code> and <code>+@all</code>. Convenient in a hurry, and each one silently undoes a restriction you wrote earlier in the same line.</span></div>
</div>

<h3>Keys, channels and selectors</h3>
<pre><code><span class="tok-comment"># Read-only on one prefix, read-write on another (Redis 7.0 syntax)</span>
redis-cli ACL SETUSER reports on '&gt;pw' \\
  '%R~metrics:*' '~report:*' +@read +@write -@dangerous
redis-cli -u redis://reports:pw@127.0.0.1 SET 'metrics:x' 1
redis-cli -u redis://reports:pw@127.0.0.1 GET 'metrics:x'

<span class="tok-comment"># Selectors: a second, independent permission set on the same user</span>
redis-cli ACL SETUSER worker on '&gt;pw' '~jobs:*' +@read +@write \\
  '(%R~config:* +get +mget)'
redis-cli ACL GETUSER worker | tail -6</code></pre>
<div class="out">OK
(error) NOPERM No permissions to access a key
(nil)
OK
selectors
1) 1) "commands"
   2) "-@all +get +mget"
   3) "keys"
   4) "%R~config:*"
   5) "channels"
   6) ""</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>~pattern</code> — read and write</span><span class="lz-lnote">The common case. <code>~cache:*</code> allows any operation on keys starting with <code>cache:</code>. Note it is a glob over the whole key name, not a prefix concept — <code>~*:temp</code> is equally valid.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>%R~</code> read-only · <code>%W~</code> write-only</span><span class="lz-lnote">Redis 7.0 split key permissions by direction. <code>%R~metrics:*</code> lets a dashboard read metrics it must not corrupt; <code>%W~audit:*</code> lets a service append to an audit log it must not read back. <code>%RW~</code> is the same as plain <code>~</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>&amp;pattern</code> — Pub/Sub channels</span><span class="lz-lnote">Separate from keys, because channels are not keys (Lesson 8.1). <code>&amp;events:*</code> permits subscribing and publishing there. <code>resetchannels</code> clears the list, and since Redis 7 new users start with no channels rather than all of them.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>(…)</code> — selectors, added in 7.0</span><span class="lz-lnote">A parenthesised group is an entirely separate permission set: a command is allowed if the root permissions allow it <em>or</em> any selector does. That is how one user reads its own job keys read-write while also reading a shared config prefix read-only — impossible to express with a single flat rule set.</span></div>
</div>

<h3>Persisting them, and seeing who got denied</h3>
<pre><code><span class="tok-comment"># Option A: aclfile — a separate file, reloadable without a restart</span>
redis-cli CONFIG GET aclfile
redis-cli ACL SAVE
redis-cli ACL LOAD
cat /etc/redis/users.acl

<span class="tok-comment"># Option B: users in redis.conf, persisted with CONFIG REWRITE</span>
redis-cli CONFIG REWRITE

<span class="tok-comment"># Who is being denied, and for what?</span>
redis-cli ACL LOG 2 | paste - -
redis-cli ACL LOG RESET</code></pre>
<div class="out">1) "aclfile"
2) "/etc/redis/users.acl"
OK
OK
user default on nopass sanitize-payload ~* &amp;* +@all
user webapp on #a3f1… ~cache:* ~sess:* resetchannels &amp;events:* -@all +@read +@write +@keyspace -@dangerous
count	1
reason	command
context	toplevel
object	flushall
username	webapp
age-seconds	12.043
client-info	id=42 addr=10.0.1.7:51204 name=api-worker cmd=flushall
OK</div>
<div class="callout ok"><strong><code>ACL LOG</code> is the feature that makes ACLs deployable.</strong> It records every denial with the username, the exact command or key that was refused, the client address and the connection name — so rolling out a restrictive user is not a guessing game. Deploy the user with the permissions you believe it needs, run the application, then read <code>ACL LOG</code> to find what you got wrong. It is a ring buffer sized by <code>acl-log-max-len</code> (128 by default), so scrape it or raise the limit if you want history. And an entry appearing weeks later, from a service you thought was scoped correctly, is exactly the signal you built this for.</div>

<div class="pitfall"><strong>Pitfall:</strong> creating good ACL users and leaving <code>default</code> exactly as it was. The whole exercise is undone if <code>user default on nopass ~* &amp;* +@all</code> is still in the file, because anything that can open a connection simply does not authenticate and gets everything — your carefully scoped <code>webapp</code> user is now optional. There are two correct endings. <strong>Disable it:</strong> <code>ACL SETUSER default off</code>, after every client has been migrated to a named user, so an unauthenticated connection can do nothing at all. <strong>Or neuter it:</strong> <code>ACL SETUSER default on &gt;&lt;strong-password&gt; -@all +ping +info</code>, which keeps health checks and monitoring working while removing all data access. Whichever you choose, do it last and verify from a client that you can no longer connect anonymously — and remember that <code>requirepass</code> and the default user's ACL password are the same thing, so setting one in the config file and the other with <code>ACL SETUSER</code> will confuse you later. Pick one mechanism and use it everywhere.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/" target="_blank" rel="noopener">
  <span class="lc-ico">🪪</span>
  <span class="lc-body"><span class="lc-title">Redis ACL</span><span class="lc-sub">The full rule syntax, every category with its members, key and channel patterns, selectors, the ACL file, and the worked examples. The one page to keep open while writing rules.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/acl-setuser/" target="_blank" rel="noopener">
  <span class="lc-ico">➕</span>
  <span class="lc-body"><span class="lc-title">ACL SETUSER</span><span class="lc-sub">Rule-by-rule reference including the ordering semantics, password management with <code>&gt;</code>/<code>&lt;</code>/<code>#</code>, and the exact behaviour of <code>reset</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: scope three services</span><span class="lc-sub">Graded exercises: write ACLs for a web app, a worker and a dashboard; use <code>ACL LOG</code> to find the permission you forgot; add a read-only selector; and safely retire the <code>default</code> user.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> The <code>default</code> user is <code>on nopass ~* &amp;* +@all</code>, and <code>requirepass</code> only adds a password to it — the permissions stay total, so a leaked credential is a full compromise until you create scoped users and retire <code>default</code>. Rules are applied left to right and a user starts with nothing, so <code>+@read +@write -@dangerous</code> plus <code>~prefix:*</code> is the shape of almost every application user, with <code>%R~</code> and selectors for the cases a flat rule set cannot express. And <code>ACL LOG</code> is what makes this deployable: roll out the user you think is right, then read the log to find every permission you got wrong, with the username, command and client address attached.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>ACL: người dùng, nhóm lệnh và mẫu khoá</h2>
<p class="lead">Trước Redis 6 thì chỉ có một mật khẩu và nó cho bạn mọi thứ. ACL thay chuyện đó bằng những người dùng có tên, giới hạn được vào những lệnh cụ thể, những mẫu khoá cụ thể và những kênh Pub/Sub cụ thể — nhờ vậy câu "dịch vụ báo cáo được đọc bộ đệm và không được làm gì khác" cuối cùng cũng diễn đạt được.</p>

<h3>Người dùng default, và vì sao nó là vấn đề</h3>
<pre><code>redis-cli ACL WHOAMI
redis-cli ACL LIST
redis-cli ACL GETUSER default | head -12</code></pre>
<div class="out">"default"
1) "user default on nopass sanitize-payload ~* &amp;* +@all"
1) "flags"
2) 1) "on"
   2) "allkeys"
   3) "allchannels"
   4) "nopass"
3) "passwords"
4) (empty array)
5) "commands"
6) "+@all"
7) "keys"
8) "~*"
9) "channels"
10) "&amp;*"</div>
<div class="callout warn"><strong>Hãy đọc dòng đầu tiên đó như một câu văn: người dùng <code>default</code> đang bật, không cần mật khẩu, và được chạy mọi lệnh trên mọi khoá và mọi kênh.</strong> Đó chính là tài khoản mà ứng dụng của bạn đang dùng ngay lúc này, và đặt <code>requirepass</code> chỉ thêm cho nó một cái mật khẩu — quyền hạn vẫn nguyên <code>+@all ~* &amp;*</code>. Nên một chuỗi kết nối bị lộ, một lỗ SSRF chạm tới được Redis, hay một cái lỗi trong một dịch vụ sẽ trao cho kẻ tấn công <code>FLUSHALL</code>, <code>CONFIG SET</code>, <code>REPLICAOF</code> và mọi khoá của mọi dịch vụ khác. ACL tồn tại để bán kính thiệt hại của một thông tin xác thực bị lộ chỉ bằng đúng phần dữ liệu mà thông tin ấy thật sự cần tới.</div>

<h3>Dựng một người dùng, từng luật một</h3>
<pre><code>redis-cli ACL SETUSER webapp on '&gt;s3cr3t-from-genpass' \\
  '~cache:*' '~sess:*' '&amp;events:*' \\
  +@read +@write +@keyspace -@dangerous
redis-cli ACL GETUSER webapp | paste - - | head -6
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 GET cache:x
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 GET other:x
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 FLUSHALL
redis-cli -u redis://webapp:s3cr3t-from-genpass@127.0.0.1:6379 CONFIG GET maxmemory</code></pre>
<div class="out">OK
flags	on
passwords	1) "d1e4ab…"
commands	-@all +@read +@write +@keyspace -@dangerous
keys	~cache:* ~sess:*
channels	&amp;events:*
(nil)
(error) NOPERM No permissions to access a key
(error) NOPERM User webapp has no permissions to run the 'flushall' command
(error) NOPERM User webapp has no permissions to run the 'config|get' command</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Các luật áp theo thứ tự, trái sang phải</span><span class="lz-t">+@read +@write -@dangerous</span><span class="lz-d">Mỗi mẩu sửa đổi tập quyền đã dựng được cho tới lúc đó, nên luật đứng sau ghi đè luật đứng trước. <code>+@all -@dangerous</code> và <code>-@dangerous +@all</code> mang nghĩa hoàn toàn khác nhau — cái thứ hai cấp lại mọi thứ.</span></div>
  <div class="lz-step"><span class="lz-k">Người dùng bắt đầu với con số không</span><span class="lz-t">off, nopass, -@all, không khoá, không kênh</span><span class="lz-d">Một người dùng vừa tạo thì không kết nối được và không làm được gì. Mọi năng lực đều là thứ bạn thêm vào có chủ ý, đó là mặc định đúng cho một hệ kiểm soát truy cập.</span></div>
  <div class="lz-step"><span class="lz-k"><code>&gt;mật_khẩu</code> thêm, <code>&lt;mật_khẩu</code> gỡ</span><span class="lz-t">và <code>#hash</code> đặt thẳng một mã băm SHA-256</span><span class="lz-d">Một người dùng giữ được nhiều mật khẩu, đó là cách bạn xoay vòng thông tin xác thực mà không có thời gian chết: thêm cái mới, deploy, gỡ cái cũ. Hãy dùng <code>#</code> với một giá trị đã băm sẵn nếu bạn không muốn gửi bản rõ.</span></div>
  <div class="lz-step"><span class="lz-k"><code>on</code> / <code>off</code> là công tắc ngắt</span><span class="lz-t">ACL SETUSER webapp off</span><span class="lz-d">Vô hiệu hoá người dùng ngay lập tức mà không xoá các luật của nó. Kết nối mới bị từ chối; kết nối đang có thì <em>không</em> bị ngắt, nên hãy ghép nó với <code>CLIENT KILL USER webapp</code> khi bạn thật sự có ý đó (Bài 10.5).</span></div>
</div>

<h3>Các nhóm lệnh, và những nhóm thật sự quan trọng</h3>
<pre><code>redis-cli ACL CAT | tr '\\n' ' '
redis-cli ACL CAT dangerous | tr '\\n' ' ' | head -c 300
redis-cli ACL CAT admin | tr '\\n' ' '</code></pre>
<div class="out">keyspace read write set sortedset list hash string bitmap hyperloglog geo stream pubsub admin fast slow blocking dangerous connection transaction scripting
flushdb flushall shutdown replicaof monitor debug config acl client cluster failover swapdb restore migrate sort keys sync psync bgsave bgrewriteaof info latency slowlog module lastsave save
flushdb flushall shutdown replicaof monitor debug config acl client cluster failover swapdb slaveof
</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>@dangerous</code> là nhóm cần trừ đi</span><span class="v"><code>FLUSHALL</code>, <code>CONFIG</code>, <code>REPLICAOF</code>, <code>DEBUG</code>, <code>KEYS</code>, <code>MONITOR</code>, <code>SHUTDOWN</code>, <code>MIGRATE</code> — mọi lệnh có thể phá dữ liệu, phơi bày nó, hoặc hạ gục máy chủ. Gần như không người dùng ứng dụng nào nên có cái nào trong số đó.</span></div>
  <div class="kv"><span class="k"><code>@read</code> và <code>@write</code> cắt ngang các kiểu</span><span class="v"><code>+@read</code> cấp <code>GET</code>, <code>HGET</code>, <code>SMEMBERS</code>, <code>ZRANGE</code>, <code>XREAD</code> và tương tự trên mọi kiểu dữ liệu. Một người dùng báo cáo thường đúng bằng <code>+@read -@dangerous</code> và không gì khác.</span></div>
  <div class="kv"><span class="k"><code>@slow</code> và <code>@blocking</code> là những phép trừ hữu ích</span><span class="v"><code>-@slow</code> gỡ các lệnh O(N) (Bài 6.5) còn <code>-@blocking</code> gỡ <code>BLPOP</code> cùng họ hàng — một cách hay để ngăn một người dùng phân tích làm khựng máy chủ (Bài 1.1).</span></div>
  <div class="kv"><span class="k">Từng lệnh riêng lẻ cũng dùng được</span><span class="v"><code>+get +set +hgetall</code> là hợp lệ, và một lệnh con cũng vậy: <code>+config|get</code> cho phép đọc cấu hình trong khi <code>config|set</code> vẫn bị chặn. Mức chi tiết đó thật sự hữu ích cho một người dùng giám sát.</span></div>
  <div class="kv"><span class="k"><code>allkeys</code>, <code>allchannels</code>, <code>allcommands</code></span><span class="v">Viết tắt cho <code>~*</code>, <code>&amp;*</code> và <code>+@all</code>. Tiện lúc vội, và mỗi cái đều âm thầm huỷ một hạn chế bạn vừa viết ở đầu cùng dòng đó.</span></div>
</div>

<h3>Khoá, kênh và selector</h3>
<pre><code><span class="tok-comment"># Chỉ đọc trên một tiền tố, đọc-ghi trên tiền tố khác (cú pháp Redis 7.0)</span>
redis-cli ACL SETUSER reports on '&gt;pw' \\
  '%R~metrics:*' '~report:*' +@read +@write -@dangerous
redis-cli -u redis://reports:pw@127.0.0.1 SET 'metrics:x' 1
redis-cli -u redis://reports:pw@127.0.0.1 GET 'metrics:x'

<span class="tok-comment"># Selector: một tập quyền thứ hai, độc lập, trên cùng một người dùng</span>
redis-cli ACL SETUSER worker on '&gt;pw' '~jobs:*' +@read +@write \\
  '(%R~config:* +get +mget)'
redis-cli ACL GETUSER worker | tail -6</code></pre>
<div class="out">OK
(error) NOPERM No permissions to access a key
(nil)
OK
selectors
1) 1) "commands"
   2) "-@all +get +mget"
   3) "keys"
   4) "%R~config:*"
   5) "channels"
   6) ""</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>~mẫu</code> — đọc và ghi</span><span class="lz-lnote">Trường hợp thường gặp. <code>~cache:*</code> cho phép mọi phép trên các khoá bắt đầu bằng <code>cache:</code>. Lưu ý nó là một mẫu glob trên toàn bộ tên khoá, không phải một khái niệm tiền tố — <code>~*:temp</code> cũng hợp lệ y hệt.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>%R~</code> chỉ đọc · <code>%W~</code> chỉ ghi</span><span class="lz-lnote">Redis 7.0 tách quyền trên khoá theo chiều. <code>%R~metrics:*</code> cho một bảng điều khiển đọc các số liệu mà nó không được làm hỏng; <code>%W~audit:*</code> cho một dịch vụ ghi thêm vào cuốn nhật ký kiểm toán mà nó không được đọc lại. <code>%RW~</code> thì y hệt <code>~</code> trần.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>&amp;mẫu</code> — kênh Pub/Sub</span><span class="lz-lnote">Tách riêng khỏi khoá, vì kênh không phải khoá (Bài 8.1). <code>&amp;events:*</code> cho phép đăng ký và đăng bài ở đó. <code>resetchannels</code> xoá sạch danh sách, và từ Redis 7 thì người dùng mới bắt đầu với không kênh nào thay vì với tất cả.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>(…)</code> — selector, thêm vào ở bản 7.0</span><span class="lz-lnote">Một nhóm trong ngoặc là một tập quyền hoàn toàn riêng: một lệnh được cho phép nếu quyền gốc cho phép nó <em>hoặc</em> có selector nào cho phép. Đó là cách một người dùng vừa đọc-ghi các khoá việc của riêng nó vừa đọc một tiền tố cấu hình dùng chung ở chế độ chỉ đọc — điều không diễn đạt nổi bằng một tập luật phẳng duy nhất.</span></div>
</div>

<h3>Lưu chúng lại, và xem ai vừa bị chặn</h3>
<pre><code><span class="tok-comment"># Cách A: aclfile — một tệp riêng, nạp lại được mà không cần khởi động lại</span>
redis-cli CONFIG GET aclfile
redis-cli ACL SAVE
redis-cli ACL LOAD
cat /etc/redis/users.acl

<span class="tok-comment"># Cách B: đặt người dùng trong redis.conf, lưu lại bằng CONFIG REWRITE</span>
redis-cli CONFIG REWRITE

<span class="tok-comment"># Ai đang bị chặn, và vì cái gì?</span>
redis-cli ACL LOG 2 | paste - -
redis-cli ACL LOG RESET</code></pre>
<div class="out">1) "aclfile"
2) "/etc/redis/users.acl"
OK
OK
user default on nopass sanitize-payload ~* &amp;* +@all
user webapp on #a3f1… ~cache:* ~sess:* resetchannels &amp;events:* -@all +@read +@write +@keyspace -@dangerous
count	1
reason	command
context	toplevel
object	flushall
username	webapp
age-seconds	12.043
client-info	id=42 addr=10.0.1.7:51204 name=api-worker cmd=flushall
OK</div>
<div class="callout ok"><strong><code>ACL LOG</code> là tính năng khiến ACL triển khai được.</strong> Nó ghi lại mọi lần từ chối kèm tên người dùng, đúng cái lệnh hay cái khoá bị chặn, địa chỉ khách và tên kết nối — nên việc đưa một người dùng hạn chế vào chạy không còn là trò đoán mò. Hãy triển khai người dùng với những quyền bạn tin là nó cần, chạy ứng dụng, rồi đọc <code>ACL LOG</code> để tìm ra chỗ bạn đoán sai. Nó là một bộ đệm vòng có cỡ đặt bằng <code>acl-log-max-len</code> (mặc định 128), nên hãy đi thu gom nó hoặc nâng cái trần lên nếu bạn muốn có lịch sử. Và một mục xuất hiện vài tuần sau đó, từ một dịch vụ bạn tưởng đã được giới hạn đúng, chính xác là tín hiệu mà bạn dựng cái này lên để nhận.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> tạo ra những người dùng ACL đẹp đẽ rồi để nguyên <code>default</code> y như cũ. Cả công cuộc ấy tan biến nếu dòng <code>user default on nopass ~* &amp;* +@all</code> vẫn còn trong tệp, vì bất cứ thứ gì mở được kết nối chỉ cần không xác thực là có tất cả — cái người dùng <code>webapp</code> bạn cẩn thận giới hạn giờ thành tuỳ chọn. Có hai cái kết đúng. <strong>Tắt nó đi:</strong> <code>ACL SETUSER default off</code>, sau khi mọi thư viện khách đã chuyển sang một người dùng có tên, để một kết nối không xác thực chẳng làm được gì cả. <strong>Hoặc thiến nó:</strong> <code>ACL SETUSER default on &gt;&lt;mật-khẩu-mạnh&gt; -@all +ping +info</code>, giữ cho các phép kiểm sức khoẻ và giám sát chạy được trong khi gỡ bỏ mọi quyền truy cập dữ liệu. Chọn cái nào cũng được, hãy làm nó sau cùng và hãy xác minh từ một thư viện khách rằng bạn không còn kết nối ẩn danh được nữa — và hãy nhớ <code>requirepass</code> với mật khẩu ACL của người dùng default là cùng một thứ, nên đặt cái này trong tệp cấu hình và cái kia bằng <code>ACL SETUSER</code> sẽ làm bạn rối về sau. Hãy chọn một cơ chế rồi dùng nó ở mọi nơi.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/" target="_blank" rel="noopener">
  <span class="lc-ico">🪪</span>
  <span class="lc-body"><span class="lc-title">Redis ACL</span><span class="lc-sub">Cú pháp luật đầy đủ, từng nhóm lệnh kèm các thành viên, mẫu khoá và mẫu kênh, selector, tệp ACL, và các ví dụ chạy đủ. Là trang duy nhất nên mở sẵn trong lúc viết luật.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/acl-setuser/" target="_blank" rel="noopener">
  <span class="lc-ico">➕</span>
  <span class="lc-body"><span class="lc-title">ACL SETUSER</span><span class="lc-sub">Tài liệu tra cứu từng luật một, gồm ngữ nghĩa về thứ tự, việc quản lý mật khẩu bằng <code>&gt;</code>/<code>&lt;</code>/<code>#</code>, và hành vi chính xác của <code>reset</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: giới hạn ba dịch vụ</span><span class="lc-sub">Bài chấm điểm: viết ACL cho một ứng dụng web, một worker và một bảng điều khiển; dùng <code>ACL LOG</code> để tìm cái quyền bạn quên; thêm một selector chỉ đọc; và cho <code>default</code> nghỉ hưu một cách an toàn.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Người dùng <code>default</code> là <code>on nopass ~* &amp;* +@all</code>, và <code>requirepass</code> chỉ thêm cho nó một mật khẩu — quyền hạn vẫn là toàn phần, nên một thông tin xác thực bị lộ là một cú chiếm quyền trọn vẹn cho tới khi bạn tạo ra những người dùng có phạm vi và cho <code>default</code> nghỉ hưu. Các luật áp từ trái sang phải và người dùng bắt đầu với con số không, nên <code>+@read +@write -@dangerous</code> cộng <code>~tiền_tố:*</code> là hình dáng của gần như mọi người dùng ứng dụng, với <code>%R~</code> và selector cho những trường hợp mà một tập luật phẳng không diễn đạt nổi. Và <code>ACL LOG</code> là thứ khiến chuyện này triển khai được: hãy đưa người dùng mà bạn nghĩ là đúng vào chạy, rồi đọc nhật ký để tìm ra mọi quyền bạn đoán sai, kèm sẵn tên người dùng, cái lệnh và địa chỉ khách.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.4 ─────────────────────────── */
    {
      title: '10.4 — Hardening: dangerous commands, the process, the container|||10.4 — Làm cứng: lệnh nguy hiểm, tiến trình, container',
      slug: 'rd-10-4-lam-cung',
      type: 'LESSON',
      description: 'Vô hiệu hoá FLUSHALL và CONFIG bằng ACL thay vì rename-command, DEBUG với MODULE bị tắt sẵn từ bản 7.0, chạy dưới quyền không phải root với systemd đã làm cứng, container chỉ-đọc, và giới hạn tài nguyên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Hardening: dangerous commands, the process, the container</h2>
<p class="lead">Authentication decides who may connect. Hardening decides what damage a connection — or a compromised Redis process — can do afterwards. These are separate questions, and the second one is answered mostly outside <code>redis.conf</code>.</p>

<h3>Disabling commands: the old way and the right way</h3>
<pre><code><span class="tok-comment"># The old way, still seen everywhere: rename-command in redis.conf</span>
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_b8f2a91c"
rename-command DEBUG ""

<span class="tok-comment"># The right way since Redis 6: take them away per user</span>
redis-cli ACL SETUSER webapp -flushall -flushdb -config -debug -shutdown
redis-cli ACL SETUSER webapp -@dangerous               <span class="tok-comment"># all of them at once</span>
redis-cli ACL GETUSER webapp | grep -A1 commands</code></pre>
<div class="out">OK
OK
commands
-@all +@read +@write +@keyspace -@dangerous</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>rename-command</code> is global and blunt</span><span class="v">It affects every user including your own operators, cannot be changed at runtime, and a renamed command's new name has to be stored somewhere — usually in the same config file an attacker would read. It is deprecated in favour of ACLs.</span></div>
  <div class="kv"><span class="k">ACLs remove it for the account that should not have it</span><span class="v"><code>-@dangerous</code> on the application user while your admin user keeps <code>+@all</code>. Same protection, per-identity, changeable without a restart, and visible in <code>ACL LIST</code>.</span></div>
  <div class="kv"><span class="k">Renaming still breaks tooling</span><span class="v">If you do rename, remember that <code>redis-cli --bigkeys</code>, monitoring agents, backup scripts and client libraries all issue those commands by their real names and will start failing in ways that are hard to trace.</span></div>
  <div class="kv"><span class="k">The commands worth removing from every app user</span><span class="v"><code>FLUSHALL</code>, <code>FLUSHDB</code>, <code>CONFIG</code>, <code>DEBUG</code>, <code>SHUTDOWN</code>, <code>REPLICAOF</code>, <code>MONITOR</code>, <code>KEYS</code>, <code>MIGRATE</code>, <code>SWAPDB</code> — none of which a normal application needs, and every one of which is a bad afternoon.</span></div>
  <div class="kv"><span class="k">7.0 already disabled two of them</span><span class="v"><code>enable-debug-command</code> and <code>enable-module-command</code> default to <code>no</code>, so <code>DEBUG</code> and <code>MODULE LOAD</code> are off unless you turn them on. That closed a real hole: <code>MODULE LOAD</code> is arbitrary code execution by design.</span></div>
</div>

<h3>The process: not root, and not able to do much</h3>
<pre><code>ps -o user,args -C redis-server
systemd-analyze security redis-server | tail -3
systemctl cat redis-server | grep -E "^User|^Group|NoNewPrivileges|ProtectSystem|ProtectHome|PrivateTmp|ReadWritePaths|CapabilityBoundingSet|MemoryDenyWriteExecute|RestrictAddressFamilies"
ls -ld /var/lib/redis /etc/redis/redis.conf</code></pre>
<div class="out">USER     COMMAND
redis    /usr/bin/redis-server 127.0.0.1:6379
→ Overall exposure level for redis-server.service: 2.4 OK 🙂
User=redis
Group=redis
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
ReadWritePaths=-/var/lib/redis
ReadWritePaths=-/var/log/redis
CapabilityBoundingSet=CAP_SETGID CAP_SETUID CAP_SYS_RESOURCE
MemoryDenyWriteExecute=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
drwxr-x--- 2 redis redis 4096 Aug 23 14:20 /var/lib/redis
-rw-r----- 1 redis redis 1682 Aug 23 09:11 /etc/redis/redis.conf</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Never run Redis as root</span><span class="lz-t">and check, do not assume</span><span class="lz-d">This is the single control that turned the historical <code>CONFIG SET dir</code> attacks (Lesson 10.2) from remote code execution into a failed write. A distribution package already does this; a hand-built install or a hasty container often does not.</span></div>
  <div class="lz-step"><span class="lz-k"><code>ProtectSystem=strict</code> + <code>ReadWritePaths</code></span><span class="lz-t">the whole filesystem is read-only except two directories</span><span class="lz-d">Even if something convinces Redis to write a file somewhere, there is nowhere to write it. This one line does more than any amount of command renaming.</span></div>
  <div class="lz-step"><span class="lz-k"><code>NoNewPrivileges</code> and a tiny capability set</span><span class="lz-t">no setuid escape, no kernel-adjacent powers</span><span class="lz-d">Redis needs almost nothing: dropping to its user, and raising its own file-descriptor limit. Everything else in the capability set is something an exploit would have wanted.</span></div>
  <div class="lz-step"><span class="lz-k"><code>systemd-analyze security</code> scores it</span><span class="lz-t">lower is better; 2.4 is good</span><span class="lz-d">It lists every hardening directive you have not set, with its weight. Run it once on your unit and you have a concrete, ordered list of what to add.</span></div>
</div>
<div class="callout ok"><strong>Check the file permissions too — the last two lines above are doing real work.</strong> <code>/var/lib/redis</code> at <code>0750</code> owned by <code>redis</code> means no other unprivileged user on the box can read your RDB file, which contains every key and value in plaintext. <code>redis.conf</code> at <code>0640</code> matters for the same reason: it holds <code>requirepass</code>. A surprising number of installations leave both world-readable, at which point database credentials sitting in Redis are readable by any process on the machine, and no amount of network hardening helps.</div>

<h3>Containers: what changes and what does not</h3>
<pre><code><span class="tok-comment"># A hardened compose service</span>
services:
  redis:
    image: redis:7.4-alpine
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    user: "999:1000"                    <span class="tok-comment"># the redis user in the official image</span>
    read_only: true                     <span class="tok-comment"># root filesystem immutable</span>
    tmpfs: ["/tmp"]
    cap_drop: ["ALL"]
    security_opt: ["no-new-privileges:true"]
    ports: ["127.0.0.1:6379:6379"]      <span class="tok-comment"># NOT 6379:6379 (Lesson 10.2)</span>
    volumes:
      - ./redis.conf:/usr/local/etc/redis/redis.conf:ro
      - redisdata:/data
    mem_limit: 4g
    ulimits:
      nofile: { soft: 65535, hard: 65535 }
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The image does not read your config unless you say so</span><span class="v">The official image's default command is <code>redis-server</code> with no arguments, so a <code>redis.conf</code> you mounted is ignored until you pass it explicitly. This is the most common containerised-Redis mistake and it silently discards every setting in this chapter.</span></div>
  <div class="kv"><span class="k">Publish to <code>127.0.0.1</code>, or not at all</span><span class="v"><code>ports: ["6379:6379"]</code> binds every host interface regardless of Redis's own <code>bind</code>. If only other containers need it, drop the <code>ports</code> block entirely and let them reach it over the Docker network by service name.</span></div>
  <div class="kv"><span class="k"><code>mem_limit</code> is not <code>maxmemory</code></span><span class="v">The container limit kills the process; <code>maxmemory</code> makes Redis manage itself. Set both, with <code>maxmemory</code> comfortably below the container limit so eviction happens before the OOM killer — and leave room for the fork (Lesson 9.3).</span></div>
  <div class="kv"><span class="k">Host settings are still host settings</span><span class="v"><code>vm.overcommit_memory</code> and Transparent Huge Pages are kernel-wide (Lesson 9.3). No container flag fixes them, and the warnings Redis logs about them are about the host.</span></div>
  <div class="kv"><span class="k">Pin the version and update it</span><span class="v"><code>redis:7.4-alpine</code>, not <code>redis:latest</code>. And subscribe to the security announcements: Redis has had real CVEs, several of them exploitable by an authenticated user, which is exactly the attacker your ACLs assume you have.</span></div>
</div>

<h3>A hardening checklist you can actually run</h3>
<pre><code>echo "=== exposure ==="
redis-cli CONFIG GET bind protected-mode | paste - -
ss -lntp | grep 6379

echo "=== auth ==="
redis-cli ACL LIST
redis-cli ACL GETUSER default | grep -A1 -E "nopass|commands"

echo "=== process ==="
ps -o user= -C redis-server
ls -ld "$(redis-cli CONFIG GET dir | tail -1)"

echo "=== limits ==="
redis-cli CONFIG GET maxmemory maxmemory-policy maxclients | paste - -
redis-cli INFO clients | grep -E "connected_clients|maxclients"

echo "=== durability ==="
redis-cli CONFIG GET appendonly save | paste - -
redis-cli INFO persistence | grep -E "rdb_last_bgsave_status|aof_last_write_status"

echo "=== version ==="
redis-cli INFO server | grep redis_version</code></pre>
<div class="out">=== exposure ===
bind	127.0.0.1 -::1
protected-mode	yes
LISTEN 0 511 127.0.0.1:6379 0.0.0.0:* users:(("redis-server",pid=1284,fd=7))
=== auth ===
1) "user default off -@all"
2) "user webapp on #a3f1… ~cache:* ~sess:* resetchannels &amp;events:* -@all +@read +@write +@keyspace -@dangerous"
=== process ===
redis
drwxr-x--- 2 redis redis 4096 Aug 23 14:20 /var/lib/redis
=== limits ===
maxmemory	4294967296
maxmemory-policy	noeviction
maxclients	10000
connected_clients:52
maxclients:10000
=== durability ===
appendonly	yes
save	900 1 300 100 60 10000
rdb_last_bgsave_status:ok
aof_last_write_status:ok
=== version ===
redis_version:7.4.1</div>

<div class="pitfall"><strong>Pitfall:</strong> hardening the server and leaving the credentials lying around. The password you generated with <code>ACL GENPASS</code> is worth exactly as much as the weakest place it is stored, and it is usually stored in more places than you think: the application's environment file, the CI configuration, a Kubernetes <code>Secret</code> that is base64 — not encrypted — the deploy script, someone's <code>.bashrc</code> because they got tired of typing it, the shell history of every server they ran <code>redis-cli -a</code> on, and a Slack message from the day it was set up. Two habits contain it. <strong>Never pass a secret as a command-line argument</strong>, anywhere: <code>-a</code> puts it in <code>ps</code> output for every user on the box and in shell history forever; use <code>REDISCLI_AUTH</code>, a prompt, or a file mode 600. <strong>And make rotation cheap enough that you actually do it</strong> — ACLs let a user hold two passwords at once (<code>ACL SETUSER webapp &gt;new</code>, deploy, <code>ACL SETUSER webapp &lt;old</code>), so rotation is a zero-downtime operation you can run on a schedule rather than an outage you postpone forever. A credential nobody has rotated since 2023 is not protected by any of the configuration in this chapter.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Redis security</span><span class="lc-sub">The sections on disabling commands, running as a dedicated user, and the explicit statement of what Redis does and does not defend against.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/redis" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">The official Redis image</span><span class="lc-sub">What the entrypoint does, why a mounted config is ignored unless you pass it as an argument, the <code>/data</code> volume, and the user the process runs as.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: harden and audit</span><span class="lc-sub">Graded exercises: run the checklist against a deliberately weak instance and fix every finding, convert a set of <code>rename-command</code> lines to ACL rules, and harden a compose service that publishes to the world.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Use ACLs rather than <code>rename-command</code> to remove dangerous commands: same protection, per-identity, changeable at runtime, and visible — while renaming is global, breaks tooling, and hides the new name in the config file. Most hardening is outside Redis: a non-root user, <code>ProtectSystem=strict</code> with two writable paths, <code>NoNewPrivileges</code>, and <code>0750</code> on the data directory do more against the historical attacks than any Redis setting. And in containers the two things that bite are the mounted <code>redis.conf</code> being ignored unless passed as an argument, and <code>ports: 6379:6379</code> publishing to every host interface no matter what <code>bind</code> says.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Làm cứng: lệnh nguy hiểm, tiến trình, container</h2>
<p class="lead">Xác thực quyết định ai được kết nối. Làm cứng quyết định một kết nối — hoặc một tiến trình Redis đã bị chiếm — gây được bao nhiêu thiệt hại sau đó. Đó là hai câu hỏi tách bạch, và câu thứ hai chủ yếu được trả lời bên ngoài <code>redis.conf</code>.</p>

<h3>Vô hiệu hoá lệnh: cách cũ và cách đúng</h3>
<pre><code><span class="tok-comment"># Cách cũ, vẫn thấy khắp nơi: rename-command trong redis.conf</span>
rename-command FLUSHALL ""
rename-command CONFIG "CONFIG_b8f2a91c"
rename-command DEBUG ""

<span class="tok-comment"># Cách đúng từ Redis 6: gỡ chúng theo từng người dùng</span>
redis-cli ACL SETUSER webapp -flushall -flushdb -config -debug -shutdown
redis-cli ACL SETUSER webapp -@dangerous               <span class="tok-comment"># gỡ tất cả một lượt</span>
redis-cli ACL GETUSER webapp | grep -A1 commands</code></pre>
<div class="out">OK
OK
commands
-@all +@read +@write +@keyspace -@dangerous</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>rename-command</code> là toàn cục và thô thiển</span><span class="v">Nó ảnh hưởng tới mọi người dùng kể cả các kỹ sư vận hành của chính bạn, không đổi được lúc đang chạy, và cái tên mới của lệnh bị đổi phải được cất ở đâu đó — thường là ngay trong cái tệp cấu hình mà kẻ tấn công sẽ đọc. Nó đã bị đánh dấu lỗi thời, nhường chỗ cho ACL.</span></div>
  <div class="kv"><span class="k">ACL gỡ nó khỏi đúng cái tài khoản không nên có nó</span><span class="v"><code>-@dangerous</code> trên người dùng ứng dụng trong khi người dùng quản trị của bạn vẫn giữ <code>+@all</code>. Cùng mức bảo vệ, theo từng danh tính, đổi được mà không khởi động lại, và nhìn thấy được trong <code>ACL LIST</code>.</span></div>
  <div class="kv"><span class="k">Đổi tên vẫn làm hỏng công cụ</span><span class="v">Nếu bạn có đổi tên thì hãy nhớ rằng <code>redis-cli --bigkeys</code>, các tác nhân giám sát, script sao lưu và thư viện khách đều gọi những lệnh đó bằng tên thật và sẽ bắt đầu hỏng theo những cách rất khó lần ra.</span></div>
  <div class="kv"><span class="k">Những lệnh đáng gỡ khỏi mọi người dùng ứng dụng</span><span class="v"><code>FLUSHALL</code>, <code>FLUSHDB</code>, <code>CONFIG</code>, <code>DEBUG</code>, <code>SHUTDOWN</code>, <code>REPLICAOF</code>, <code>MONITOR</code>, <code>KEYS</code>, <code>MIGRATE</code>, <code>SWAPDB</code> — chẳng cái nào một ứng dụng bình thường cần tới, và cái nào cũng là một buổi chiều tồi tệ.</span></div>
  <div class="kv"><span class="k">Bản 7.0 đã tắt sẵn hai cái</span><span class="v"><code>enable-debug-command</code> và <code>enable-module-command</code> mặc định là <code>no</code>, nên <code>DEBUG</code> và <code>MODULE LOAD</code> tắt trừ khi bạn bật lên. Việc đó bịt một cái lỗ thật: <code>MODULE LOAD</code> vốn dĩ là thực thi mã tuỳ ý theo thiết kế.</span></div>
</div>

<h3>Tiến trình: không phải root, và cũng không làm được mấy</h3>
<pre><code>ps -o user,args -C redis-server
systemd-analyze security redis-server | tail -3
systemctl cat redis-server | grep -E "^User|^Group|NoNewPrivileges|ProtectSystem|ProtectHome|PrivateTmp|ReadWritePaths|CapabilityBoundingSet|MemoryDenyWriteExecute|RestrictAddressFamilies"
ls -ld /var/lib/redis /etc/redis/redis.conf</code></pre>
<div class="out">USER     COMMAND
redis    /usr/bin/redis-server 127.0.0.1:6379
→ Overall exposure level for redis-server.service: 2.4 OK 🙂
User=redis
Group=redis
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
ReadWritePaths=-/var/lib/redis
ReadWritePaths=-/var/log/redis
CapabilityBoundingSet=CAP_SETGID CAP_SETUID CAP_SYS_RESOURCE
MemoryDenyWriteExecute=true
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
drwxr-x--- 2 redis redis 4096 Aug 23 14:20 /var/lib/redis
-rw-r----- 1 redis redis 1682 Aug 23 09:11 /etc/redis/redis.conf</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đừng bao giờ chạy Redis dưới quyền root</span><span class="lz-t">và hãy kiểm, đừng đoán</span><span class="lz-d">Đây là biện pháp duy nhất biến những vụ tấn công <code>CONFIG SET dir</code> trong lịch sử (Bài 10.2) từ thực thi mã từ xa thành một lượt ghi thất bại. Một gói của bản phân phối vốn đã làm việc này; một bản cài tay hay một container làm vội thì thường không.</span></div>
  <div class="lz-step"><span class="lz-k"><code>ProtectSystem=strict</code> + <code>ReadWritePaths</code></span><span class="lz-t">cả hệ tệp là chỉ-đọc trừ hai thư mục</span><span class="lz-d">Kể cả khi có thứ gì đó thuyết phục được Redis ghi một tệp ra đâu đó thì cũng chẳng còn chỗ nào để ghi. Riêng dòng này làm được nhiều hơn mọi mức đổi-tên-lệnh cộng lại.</span></div>
  <div class="lz-step"><span class="lz-k"><code>NoNewPrivileges</code> và một bộ capability tí hon</span><span class="lz-t">không thoát bằng setuid, không quyền năng cận-nhân</span><span class="lz-d">Redis gần như chẳng cần gì: tụt xuống người dùng của nó, và tự nâng giới hạn số mô tả tệp của chính nó. Mọi thứ khác trong bộ capability đều là thứ mà một cuộc khai thác sẽ thèm muốn.</span></div>
  <div class="lz-step"><span class="lz-k"><code>systemd-analyze security</code> chấm điểm nó</span><span class="lz-t">càng thấp càng tốt; 2,4 là ổn</span><span class="lz-d">Nó liệt kê mọi chỉ thị làm cứng bạn chưa đặt, kèm trọng số. Chạy nó một lần trên unit của bạn là bạn có một danh sách cụ thể và đã xếp thứ tự những thứ cần thêm.</span></div>
</div>
<div class="callout ok"><strong>Hãy kiểm cả quyền tệp nữa — hai dòng cuối ở trên đang làm việc thật.</strong> <code>/var/lib/redis</code> ở mức <code>0750</code> do <code>redis</code> sở hữu nghĩa là không người dùng thường nào khác trên máy đó đọc được tệp RDB của bạn, vốn chứa mọi khoá và giá trị ở dạng văn bản thô. <code>redis.conf</code> ở mức <code>0640</code> quan trọng vì cùng lý do: nó giữ <code>requirepass</code>. Một số lượng đáng ngạc nhiên các bản cài đặt để cả hai thứ ấy ai cũng đọc được, và tới lúc đó thì thông tin xác thực cơ sở dữ liệu nằm trong Redis lại đọc được bởi mọi tiến trình trên máy, và không mức làm cứng mạng nào giúp được.</div>

<h3>Container: cái gì đổi và cái gì không</h3>
<pre><code><span class="tok-comment"># Một dịch vụ compose đã làm cứng</span>
services:
  redis:
    image: redis:7.4-alpine
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    user: "999:1000"                    <span class="tok-comment"># người dùng redis trong ảnh chính thức</span>
    read_only: true                     <span class="tok-comment"># hệ tệp gốc bất biến</span>
    tmpfs: ["/tmp"]
    cap_drop: ["ALL"]
    security_opt: ["no-new-privileges:true"]
    ports: ["127.0.0.1:6379:6379"]      <span class="tok-comment"># KHÔNG phải 6379:6379 (Bài 10.2)</span>
    volumes:
      - ./redis.conf:/usr/local/etc/redis/redis.conf:ro
      - redisdata:/data
    mem_limit: 4g
    ulimits:
      nofile: { soft: 65535, hard: 65535 }
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái ảnh không đọc cấu hình của bạn trừ khi bạn bảo nó đọc</span><span class="v">Lệnh mặc định của ảnh chính thức là <code>redis-server</code> không kèm tham số nào, nên một tệp <code>redis.conf</code> bạn gắn vào sẽ bị phớt lờ cho tới khi bạn truyền nó vào một cách tường minh. Đây là sai lầm phổ biến nhất khi chạy Redis trong container và nó âm thầm vứt bỏ mọi thiết lập trong chương này.</span></div>
  <div class="kv"><span class="k">Hãy công bố ra <code>127.0.0.1</code>, hoặc đừng công bố gì</span><span class="v"><code>ports: ["6379:6379"]</code> gắn vào mọi giao diện của máy chủ bất kể cấu hình <code>bind</code> của chính Redis. Nếu chỉ các container khác cần tới nó thì hãy bỏ hẳn khối <code>ports</code> và để chúng gọi qua mạng Docker bằng tên dịch vụ.</span></div>
  <div class="kv"><span class="k"><code>mem_limit</code> không phải <code>maxmemory</code></span><span class="v">Giới hạn của container thì giết tiến trình; <code>maxmemory</code> thì bắt Redis tự quản lý mình. Hãy đặt cả hai, với <code>maxmemory</code> thấp hơn hẳn giới hạn container để việc đẩy khoá xảy ra trước kẻ giết-vì-hết-bộ-nhớ — và hãy chừa chỗ cho cú fork (Bài 9.3).</span></div>
  <div class="kv"><span class="k">Thiết lập của máy chủ vẫn là của máy chủ</span><span class="v"><code>vm.overcommit_memory</code> và Transparent Huge Pages ở phạm vi nhân (Bài 9.3). Không cờ container nào chữa được chúng, và những cảnh báo Redis ghi ra về chúng là nói về máy chủ vật lý.</span></div>
  <div class="kv"><span class="k">Hãy ghim phiên bản và cập nhật nó</span><span class="v"><code>redis:7.4-alpine</code>, đừng <code>redis:latest</code>. Và hãy đăng ký nhận thông báo bảo mật: Redis từng có những lỗ hổng CVE thật, vài cái trong đó khai thác được bởi một người dùng đã xác thực, mà đó chính là kẻ tấn công mà ACL của bạn giả định là có.</span></div>
</div>

<h3>Một danh mục làm cứng bạn chạy được thật</h3>
<pre><code>echo "=== exposure ==="
redis-cli CONFIG GET bind protected-mode | paste - -
ss -lntp | grep 6379

echo "=== auth ==="
redis-cli ACL LIST
redis-cli ACL GETUSER default | grep -A1 -E "nopass|commands"

echo "=== process ==="
ps -o user= -C redis-server
ls -ld "$(redis-cli CONFIG GET dir | tail -1)"

echo "=== limits ==="
redis-cli CONFIG GET maxmemory maxmemory-policy maxclients | paste - -
redis-cli INFO clients | grep -E "connected_clients|maxclients"

echo "=== durability ==="
redis-cli CONFIG GET appendonly save | paste - -
redis-cli INFO persistence | grep -E "rdb_last_bgsave_status|aof_last_write_status"

echo "=== version ==="
redis-cli INFO server | grep redis_version</code></pre>
<div class="out">=== exposure ===
bind	127.0.0.1 -::1
protected-mode	yes
LISTEN 0 511 127.0.0.1:6379 0.0.0.0:* users:(("redis-server",pid=1284,fd=7))
=== auth ===
1) "user default off -@all"
2) "user webapp on #a3f1… ~cache:* ~sess:* resetchannels &amp;events:* -@all +@read +@write +@keyspace -@dangerous"
=== process ===
redis
drwxr-x--- 2 redis redis 4096 Aug 23 14:20 /var/lib/redis
=== limits ===
maxmemory	4294967296
maxmemory-policy	noeviction
maxclients	10000
connected_clients:52
maxclients:10000
=== durability ===
appendonly	yes
save	900 1 300 100 60 10000
rdb_last_bgsave_status:ok
aof_last_write_status:ok
=== version ===
redis_version:7.4.1</div>

<div class="pitfall"><strong>Cái bẫy:</strong> làm cứng máy chủ rồi để thông tin xác thực vương vãi khắp nơi. Cái mật khẩu bạn sinh ra bằng <code>ACL GENPASS</code> chỉ có giá trị đúng bằng chỗ yếu nhất mà nó được cất, và nó thường được cất ở nhiều chỗ hơn bạn tưởng: tệp biến môi trường của ứng dụng, cấu hình CI, một <code>Secret</code> của Kubernetes vốn là base64 — chứ không phải mã hoá, script triển khai, tệp <code>.bashrc</code> của ai đó vì họ chán gõ lại, lịch sử shell của mọi máy chủ mà họ từng chạy <code>redis-cli -a</code>, và một tin nhắn Slack từ cái ngày nó được đặt ra. Hai thói quen kìm được chuyện đó. <strong>Đừng bao giờ truyền bí mật làm tham số dòng lệnh</strong>, ở bất cứ đâu: <code>-a</code> đưa nó vào đầu ra của <code>ps</code> cho mọi người dùng trên máy và vào lịch sử shell mãi mãi; hãy dùng <code>REDISCLI_AUTH</code>, một lời nhắc nhập, hoặc một tệp quyền 600. <strong>Và hãy làm cho việc xoay vòng đủ rẻ để bạn thật sự làm nó</strong> — ACL cho một người dùng giữ hai mật khẩu cùng lúc (<code>ACL SETUSER webapp &gt;mới</code>, deploy, <code>ACL SETUSER webapp &lt;cũ</code>), nên việc xoay vòng là một thao tác không có thời gian chết mà bạn chạy được theo lịch, chứ không phải một sự cố bạn hoãn mãi mãi. Một thông tin xác thực chưa ai xoay vòng kể từ năm 2023 thì không được bảo vệ bởi bất kỳ cấu hình nào trong chương này.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/security/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Redis security</span><span class="lc-sub">Các mục về vô hiệu hoá lệnh, chạy dưới một người dùng chuyên trách, và lời phát biểu tường minh về việc Redis phòng thủ trước cái gì và không phòng thủ trước cái gì.</span></span>
</a>
<a class="link-card" href="https://hub.docker.com/_/redis" target="_blank" rel="noopener">
  <span class="lc-ico">🐳</span>
  <span class="lc-body"><span class="lc-title">Ảnh Redis chính thức</span><span class="lc-sub">Điểm vào của ảnh làm gì, vì sao một tệp cấu hình đã gắn vào lại bị phớt lờ trừ khi bạn truyền nó làm tham số, ổ đĩa <code>/data</code>, và tiến trình chạy dưới người dùng nào.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: làm cứng và rà soát</span><span class="lc-sub">Bài chấm điểm: chạy danh mục kiểm tra lên một máy cố ý để yếu rồi sửa mọi phát hiện, chuyển một loạt dòng <code>rename-command</code> thành luật ACL, và làm cứng một dịch vụ compose đang công bố ra toàn thế giới.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Hãy dùng ACL thay cho <code>rename-command</code> để gỡ các lệnh nguy hiểm: cùng mức bảo vệ, theo từng danh tính, đổi được lúc đang chạy, và nhìn thấy được — trong khi đổi tên thì toàn cục, làm hỏng công cụ, và giấu cái tên mới ngay trong tệp cấu hình. Phần lớn việc làm cứng nằm ngoài Redis: một người dùng không phải root, <code>ProtectSystem=strict</code> với hai đường dẫn ghi được, <code>NoNewPrivileges</code>, và quyền <code>0750</code> trên thư mục dữ liệu làm được nhiều hơn mọi thiết lập Redis trước các vụ tấn công trong lịch sử. Và trong container thì hai thứ hay cắn là cái <code>redis.conf</code> đã gắn vào bị phớt lờ nếu không truyền làm tham số, và <code>ports: 6379:6379</code> công bố ra mọi giao diện của máy chủ bất kể <code>bind</code> nói gì.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.5 ─────────────────────────── */
    {
      title: '10.5 — Connections: limits, timeouts and the CLIENT commands|||10.5 — Kết nối: giới hạn, hạn giờ và họ lệnh CLIENT',
      slug: 'rd-10-5-ket-noi',
      type: 'LESSON',
      description: 'maxclients với ulimit và tcp-backlog, timeout với tcp-keepalive, CLIENT LIST đọc từng cột, CLIENT KILL theo mọi tiêu chí, CLIENT NO-EVICT với NO-TOUCH của bản 7.0, và cách chọn cỡ gáo kết nối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.5</span>
<h2>Connections: limits, timeouts and the CLIENT commands</h2>
<p class="lead">A Redis connection is cheap but not free, and the limits around it are set in three different places that must agree. When they do not, the symptom is a service that works fine until it suddenly cannot connect at all — with an error message that points at the wrong layer.</p>

<h3>Three limits that must agree</h3>
<pre><code>redis-cli CONFIG GET maxclients tcp-backlog
redis-cli INFO clients | grep -E "connected_clients|cluster_connections|maxclients|blocked_clients|total_watched_keys"
redis-cli INFO stats | grep -E "total_connections_received|rejected_connections"
ulimit -n
cat /proc/sys/net/core/somaxconn
grep -i "max number of open files" /var/log/redis/redis-server.log | tail -1</code></pre>
<div class="out">1) "maxclients"
2) "10000"
3) "tcp-backlog"
4) "511"
connected_clients:52
cluster_connections:0
maxclients:10000
blocked_clients:3
total_watched_keys:0
total_connections_received:1284119
rejected_connections:0
1024
4096
# You requested maxclients of 10000 requiring at least 10032 max file descriptors.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · <code>maxclients</code> — what Redis will accept</span><span class="lz-t">10000 by default</span><span class="lz-d">Past it, new connections are refused with an error and <code>rejected_connections</code> climbs. That counter being non-zero is a hard signal: something is opening more connections than you planned, and it is usually a pool without a ceiling.</span></div>
  <div class="lz-step"><span class="lz-k">2 · <code>ulimit -n</code> — what the OS will allow</span><span class="lz-t">and it silently wins</span><span class="lz-d">If the process can only open 1024 file descriptors, Redis lowers <code>maxclients</code> to fit and logs a warning at startup — the last line above. So an instance configured for 10,000 clients may actually accept about 990, and the only place that says so is a log line from a week ago.</span></div>
  <div class="lz-step"><span class="lz-k">3 · <code>tcp-backlog</code> and <code>somaxconn</code></span><span class="lz-t">the queue of connections not yet accepted</span><span class="lz-d">Redis asks for 511; the kernel caps it at <code>net.core.somaxconn</code>. Under a burst of simultaneous connects — every pod in a deployment restarting at once — a small backlog means dropped SYNs and clients that see a connection timeout rather than a Redis error.</span></div>
  <div class="lz-step"><span class="lz-k">Raise all three together, or none</span><span class="lz-t">LimitNOFILE, maxclients, somaxconn</span><span class="lz-d">Raising <code>maxclients</code> alone does nothing if the file-descriptor limit does not follow. In systemd that is <code>LimitNOFILE=65535</code> in the unit; in Docker it is the <code>ulimits</code> block.</span></div>
</div>

<h3>Idle connections: two settings with opposite jobs</h3>
<pre><code>redis-cli CONFIG GET timeout tcp-keepalive
redis-cli CONFIG SET timeout 0                <span class="tok-comment"># never close an idle client (default)</span>
redis-cli CONFIG SET tcp-keepalive 300        <span class="tok-comment"># probe every 300s to detect dead peers</span>
redis-cli CLIENT LIST | head -2</code></pre>
<div class="out">1) "timeout"
2) "0"
3) "tcp-keepalive"
4) "300"
OK
OK
id=42 addr=10.0.1.7:51204 laddr=10.0.1.5:6379 fd=9 name=api-worker age=88214 idle=0 flags=N db=0 sub=0 psub=0 ssub=0 multi=-1 watch=0 qbuf=26 qbuf-free=20448 argv-mem=10 multi-mem=0 tot-net-in=1204 tot-net-out=9812 rbs=1024 rbp=0 obl=0 oll=0 omem=0 tot-mem=20512 events=r cmd=get user=webapp redir=-1 resp=2 lib-name=node-redis lib-ver=4.7.0
id=51 addr=10.0.1.9:44118 laddr=10.0.1.5:6379 fd=12 name= age=4102 idle=4102 flags=N db=0 sub=2 psub=0 ssub=0 multi=-1 watch=0 qbuf=0 qbuf-free=0 argv-mem=0 multi-mem=0 tot-net-in=88 tot-net-out=41982 rbs=1024 rbp=0 obl=0 oll=0 omem=0 tot-mem=20512 events=r cmd=subscribe user=default redir=-1 resp=2 lib-name= lib-ver=</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>timeout 0</code> is right for pooled clients</span><span class="v">A connection pool deliberately keeps connections open and idle. Closing them costs a reconnect and a re-<code>AUTH</code> on the next request, which is latency your users pay for nothing.</span></div>
  <div class="kv"><span class="k">Except behind something that kills idle TCP</span><span class="v">Many load balancers and NAT gateways silently drop connections idle for 60–350 seconds. The client does not find out until its next command fails — so set <code>tcp-keepalive</code> below that threshold, or the pool hands out dead sockets.</span></div>
  <div class="kv"><span class="k"><code>idle</code> vs <code>age</code> in CLIENT LIST</span><span class="v"><code>age</code> is how long the connection has existed; <code>idle</code> is seconds since its last command. The second row above has <code>idle=4102</code> — over an hour — which is completely normal for a Pub/Sub subscriber and alarming for anything else.</span></div>
  <div class="kv"><span class="k"><code>omem</code> and <code>tot-mem</code> find the memory hog</span><span class="v">Output buffer and total memory for that client. A subscriber falling behind, or someone running a giant <code>HGETALL</code>, shows up here as megabytes — and it counts toward <code>maxmemory</code> (Lesson 9.1).</span></div>
  <div class="kv"><span class="k"><code>lib-name</code> and <code>lib-ver</code></span><span class="v">Redis 7.2 added them, and clients that set them make an incident much shorter: "which service is this connection" stops being an exercise in matching IP addresses. Call <code>CLIENT SETINFO</code> or set a connection <code>name</code> — your future self will thank you.</span></div>
</div>

<h3>The CLIENT commands you will need at 3am</h3>
<pre><code>redis-cli CLIENT ID
redis-cli CLIENT INFO
redis-cli CLIENT SETNAME importer
redis-cli CLIENT LIST TYPE pubsub | wc -l
redis-cli CLIENT KILL ID 51
redis-cli CLIENT KILL USER webapp
redis-cli CLIENT KILL TYPE normal ADDR 10.0.1.9:44118
redis-cli CLIENT KILL MAXAGE 86400            <span class="tok-comment"># 7.4+: anything older than a day</span>
redis-cli CLIENT NO-EVICT on
redis-cli CLIENT NO-TOUCH on</code></pre>
<div class="out">(integer) 88
id=88 addr=127.0.0.1:51992 laddr=127.0.0.1:6379 fd=14 name= age=0 idle=0 flags=N db=0 ... cmd=client|info user=default resp=2
OK
11
(integer) 1
(integer) 7
(integer) 1
(integer) 3
OK
OK</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT KILL</code> takes filters, not just addresses</span><span class="lz-lnote"><code>ID</code>, <code>ADDR</code>, <code>LADDR</code>, <code>TYPE</code> (normal/master/replica/pubsub), <code>USER</code>, <code>SKIPME</code>, and <code>MAXAGE</code> since 7.4. <code>CLIENT KILL USER webapp</code> is how you make an <code>ACL SETUSER webapp off</code> take effect on connections that are already open (Lesson 10.3).</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT NO-EVICT on</code> — protect this connection</span><span class="lz-lnote">Redis 7.0 can evict <em>clients</em> when their buffers exceed <code>maxmemory-clients</code>. Set this on your admin or monitoring connection so the one client you need during an incident is not the one that gets dropped.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT NO-TOUCH on</code> — read without disturbing</span><span class="lz-lnote">Stops this connection's reads from updating the LRU/LFU metadata (Lesson 9.2). Exactly what a debugging session or a scanning tool wants: inspect keys without making them look hot and skewing what gets evicted.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT PAUSE</code> — freeze, briefly</span><span class="lz-lnote"><code>CLIENT PAUSE 5000 WRITE</code> holds write commands for five seconds while reads continue. It exists for coordinated failovers (Chapter 11), and it is a foot-gun anywhere else — every paused client is a request holding a connection and a thread somewhere upstream.</span></div>
</div>

<h3>Sizing a connection pool</h3>
<pre><code><span class="tok-comment">// Most Node clients: ONE connection, pipelined, is usually correct (Lesson 1.5)</span>
const redis = createClient({ url, socket: { keepAlive: 30000 } });

<span class="tok-comment">// Blocking commands need their own connections — they park the socket</span>
const blocking = redis.duplicate();     <span class="tok-comment">// BLPOP, XREAD BLOCK, BRPOPLPUSH</span>
const sub      = redis.duplicate();     <span class="tok-comment">// SUBSCRIBE (Lesson 8.1)</span>

<span class="tok-comment">// Pooled clients (Java, Go, Python): size from concurrency, not from traffic</span>
<span class="tok-comment">//   pool = concurrent in-flight commands per process, plus a small margin</span>
<span class="tok-comment">//   total = pool x processes x replicas — and that must stay under maxclients</span></code></pre>
<div class="callout ok"><strong>Do the multiplication before you deploy, because nobody does it after.</strong> A pool of 50, times 8 worker processes, times 40 pods, is 16,000 connections asking a server configured for 10,000 — and it will not fail during a rollout, it will fail during the <em>next</em> scale-up, at which point the error is <code>ERR max number of clients reached</code> from a service that has been fine for months. Two rules keep it sane: size pools from concurrency rather than from request rate (a Node process handling 5,000 requests per second may still only need one connection, because commands pipeline on it), and put <code>maxclients</code>, the pool size and the replica count in the same document so the multiplication is visible.</div>

<div class="pitfall"><strong>Pitfall:</strong> a connection leak, which looks exactly like a capacity problem until you graph the right number. The shape is always the same: <code>connected_clients</code> rises slowly and monotonically, never falling even when traffic drops overnight, until it hits <code>maxclients</code> and everything stops. The cause is almost never Redis — it is a client that creates a connection per request instead of reusing a pool, a <code>duplicate()</code> called inside a request handler, a subscriber that reconnects on error without closing the old socket, or a library whose pool has no maximum and grows under load and never shrinks. Diagnose it with three things: graph <code>connected_clients</code> and look for a line that only goes up; run <code>CLIENT LIST</code> and group by <code>addr</code> and <code>name</code> to see which host and which service owns them; and check <code>age</code> — thousands of connections with a large <code>age</code> and an enormous <code>idle</code> are leaked, not busy. Then set a connection <code>name</code> per service so the next occurrence takes one minute instead of an afternoon, and add an alert on <code>connected_clients</code> crossing half of <code>maxclients</code>, which catches the leak while it is still a graph rather than an outage.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/client-list/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">CLIENT LIST</span><span class="lc-sub">Every field in that dense output explained — <code>qbuf</code>, <code>omem</code>, <code>obl</code>, <code>oll</code>, <code>events</code>, <code>flags</code> — which turns the line into a diagnosis instead of a wall of text.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Benchmarking and connection counts</span><span class="lc-sub">How connection count, pipelining and payload size interact with throughput — the measurements to run before deciding what your pool size should be.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the leak</span><span class="lc-sub">Graded exercises: diagnose a rising <code>connected_clients</code> from <code>CLIENT LIST</code>, kill the offending user's connections, compute a safe pool size from a deployment topology, and fix a <code>maxclients</code> silently capped by <code>ulimit</code>.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Three limits must agree — <code>maxclients</code>, the process file-descriptor limit and <code>tcp-backlog</code>/<code>somaxconn</code> — and the OS limit wins silently, lowering <code>maxclients</code> with only a startup log line to say so. <code>timeout 0</code> is right for pooled clients but wrong behind a load balancer that drops idle TCP, so set <code>tcp-keepalive</code> below that threshold or your pool hands out dead sockets. And a rising <code>connected_clients</code> that never falls is a leak, not growth: name your connections, group <code>CLIENT LIST</code> by <code>addr</code> to find the owner, and alert at half of <code>maxclients</code> so you see it as a graph rather than an outage.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.5</span>
<h2>Kết nối: giới hạn, hạn giờ và họ lệnh CLIENT</h2>
<p class="lead">Một kết nối Redis thì rẻ nhưng không miễn phí, và các giới hạn quanh nó được đặt ở ba nơi khác nhau mà chúng buộc phải khớp nhau. Khi chúng không khớp, triệu chứng là một dịch vụ chạy tốt cho tới khi đột nhiên không kết nối được gì cả — kèm một thông báo lỗi chỉ vào sai tầng.</p>

<h3>Ba giới hạn phải khớp nhau</h3>
<pre><code>redis-cli CONFIG GET maxclients tcp-backlog
redis-cli INFO clients | grep -E "connected_clients|cluster_connections|maxclients|blocked_clients|total_watched_keys"
redis-cli INFO stats | grep -E "total_connections_received|rejected_connections"
ulimit -n
cat /proc/sys/net/core/somaxconn
grep -i "max number of open files" /var/log/redis/redis-server.log | tail -1</code></pre>
<div class="out">1) "maxclients"
2) "10000"
3) "tcp-backlog"
4) "511"
connected_clients:52
cluster_connections:0
maxclients:10000
blocked_clients:3
total_watched_keys:0
total_connections_received:1284119
rejected_connections:0
1024
4096
# You requested maxclients of 10000 requiring at least 10032 max file descriptors.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · <code>maxclients</code> — thứ Redis chịu nhận</span><span class="lz-t">mặc định 10000</span><span class="lz-d">Vượt qua nó thì kết nối mới bị từ chối kèm một lỗi và <code>rejected_connections</code> leo lên. Bộ đếm đó khác 0 là một tín hiệu cứng: có thứ gì đó đang mở nhiều kết nối hơn bạn dự tính, và thường là một cái gáo kết nối không có trần.</span></div>
  <div class="lz-step"><span class="lz-k">2 · <code>ulimit -n</code> — thứ hệ điều hành cho phép</span><span class="lz-t">và nó thắng một cách âm thầm</span><span class="lz-d">Nếu tiến trình chỉ mở được 1024 mô tả tệp thì Redis hạ <code>maxclients</code> xuống cho vừa rồi ghi một cảnh báo lúc khởi động — chính là dòng cuối ở trên. Nên một máy cấu hình cho 10.000 khách có thể thật ra chỉ nhận được khoảng 990, và nơi duy nhất nói điều đó là một dòng nhật ký từ tuần trước.</span></div>
  <div class="lz-step"><span class="lz-k">3 · <code>tcp-backlog</code> và <code>somaxconn</code></span><span class="lz-t">hàng đợi các kết nối chưa được nhận</span><span class="lz-d">Redis xin 511; nhân chặn nó lại ở <code>net.core.somaxconn</code>. Dưới một đợt kết nối đồng thời bùng lên — mọi pod trong một bản triển khai cùng khởi động lại — một hàng đợi nhỏ nghĩa là SYN bị rơi và các khách thấy một lỗi hết giờ kết nối chứ không phải một lỗi của Redis.</span></div>
  <div class="lz-step"><span class="lz-k">Hãy nâng cả ba cùng lúc, hoặc đừng nâng cái nào</span><span class="lz-t">LimitNOFILE, maxclients, somaxconn</span><span class="lz-d">Nâng mỗi <code>maxclients</code> thì chẳng làm được gì nếu giới hạn mô tả tệp không đi theo. Trong systemd thì đó là <code>LimitNOFILE=65535</code> trong unit; trong Docker thì đó là khối <code>ulimits</code>.</span></div>
</div>

<h3>Kết nối rảnh: hai thiết lập với hai nhiệm vụ ngược nhau</h3>
<pre><code>redis-cli CONFIG GET timeout tcp-keepalive
redis-cli CONFIG SET timeout 0                <span class="tok-comment"># không bao giờ đóng khách đang rảnh (mặc định)</span>
redis-cli CONFIG SET tcp-keepalive 300        <span class="tok-comment"># dò mỗi 300 giây để phát hiện đầu kia đã chết</span>
redis-cli CLIENT LIST | head -2</code></pre>
<div class="out">1) "timeout"
2) "0"
3) "tcp-keepalive"
4) "300"
OK
OK
id=42 addr=10.0.1.7:51204 laddr=10.0.1.5:6379 fd=9 name=api-worker age=88214 idle=0 flags=N db=0 sub=0 psub=0 ssub=0 multi=-1 watch=0 qbuf=26 qbuf-free=20448 argv-mem=10 multi-mem=0 tot-net-in=1204 tot-net-out=9812 rbs=1024 rbp=0 obl=0 oll=0 omem=0 tot-mem=20512 events=r cmd=get user=webapp redir=-1 resp=2 lib-name=node-redis lib-ver=4.7.0
id=51 addr=10.0.1.9:44118 laddr=10.0.1.5:6379 fd=12 name= age=4102 idle=4102 flags=N db=0 sub=2 psub=0 ssub=0 multi=-1 watch=0 qbuf=0 qbuf-free=0 argv-mem=0 multi-mem=0 tot-net-in=88 tot-net-out=41982 rbs=1024 rbp=0 obl=0 oll=0 omem=0 tot-mem=20512 events=r cmd=subscribe user=default redir=-1 resp=2 lib-name= lib-ver=</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>timeout 0</code> đúng cho thư viện khách dùng gáo</span><span class="v">Một gáo kết nối cố ý giữ các kết nối mở và rảnh. Đóng chúng đi thì tốn một lần kết nối lại và một lần <code>AUTH</code> lại ở yêu cầu kế tiếp, tức là một khoản độ trễ mà người dùng của bạn trả không đổi lấy gì.</span></div>
  <div class="kv"><span class="k">Trừ khi phía sau có thứ gì đó giết TCP rảnh</span><span class="v">Nhiều bộ cân tải và cổng NAT âm thầm bỏ những kết nối rảnh 60–350 giây. Thư viện khách chỉ phát hiện ra khi lệnh kế tiếp của nó hỏng — nên hãy đặt <code>tcp-keepalive</code> dưới ngưỡng đó, không thì cái gáo sẽ phát ra những socket đã chết.</span></div>
  <div class="kv"><span class="k"><code>idle</code> so với <code>age</code> trong CLIENT LIST</span><span class="v"><code>age</code> là kết nối đã tồn tại bao lâu; <code>idle</code> là số giây kể từ lệnh cuối của nó. Dòng thứ hai ở trên có <code>idle=4102</code> — hơn một tiếng — hoàn toàn bình thường với một bên đăng ký Pub/Sub và đáng báo động với mọi thứ khác.</span></div>
  <div class="kv"><span class="k"><code>omem</code> và <code>tot-mem</code> tìm ra kẻ ngốn bộ nhớ</span><span class="v">Bộ đệm đầu ra và tổng bộ nhớ của khách đó. Một bên đăng ký đang tụt lại, hay ai đó đang chạy một lệnh <code>HGETALL</code> khổng lồ, sẽ hiện ra ở đây thành hàng megabyte — và nó tính vào <code>maxmemory</code> (Bài 9.1).</span></div>
  <div class="kv"><span class="k"><code>lib-name</code> và <code>lib-ver</code></span><span class="v">Redis 7.2 thêm chúng vào, và những thư viện khách chịu đặt chúng sẽ làm một sự cố ngắn đi rất nhiều: câu "kết nối này là của dịch vụ nào" thôi còn là bài tập đối chiếu địa chỉ IP. Hãy gọi <code>CLIENT SETINFO</code> hoặc đặt một cái <code>name</code> cho kết nối — bạn của tương lai sẽ cảm ơn bạn.</span></div>
</div>

<h3>Những lệnh CLIENT bạn sẽ cần lúc 3 giờ sáng</h3>
<pre><code>redis-cli CLIENT ID
redis-cli CLIENT INFO
redis-cli CLIENT SETNAME importer
redis-cli CLIENT LIST TYPE pubsub | wc -l
redis-cli CLIENT KILL ID 51
redis-cli CLIENT KILL USER webapp
redis-cli CLIENT KILL TYPE normal ADDR 10.0.1.9:44118
redis-cli CLIENT KILL MAXAGE 86400            <span class="tok-comment"># 7.4+: mọi thứ già hơn một ngày</span>
redis-cli CLIENT NO-EVICT on
redis-cli CLIENT NO-TOUCH on</code></pre>
<div class="out">(integer) 88
id=88 addr=127.0.0.1:51992 laddr=127.0.0.1:6379 fd=14 name= age=0 idle=0 flags=N db=0 ... cmd=client|info user=default resp=2
OK
11
(integer) 1
(integer) 7
(integer) 1
(integer) 3
OK
OK</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT KILL</code> nhận bộ lọc, không chỉ nhận địa chỉ</span><span class="lz-lnote"><code>ID</code>, <code>ADDR</code>, <code>LADDR</code>, <code>TYPE</code> (normal/master/replica/pubsub), <code>USER</code>, <code>SKIPME</code>, và <code>MAXAGE</code> từ bản 7.4. <code>CLIENT KILL USER webapp</code> là cách bạn làm cho một lệnh <code>ACL SETUSER webapp off</code> có hiệu lực lên những kết nối đang mở sẵn (Bài 10.3).</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT NO-EVICT on</code> — bảo vệ kết nối này</span><span class="lz-lnote">Redis 7.0 đẩy được cả <em>khách</em> đi khi bộ đệm của họ vượt <code>maxmemory-clients</code>. Hãy đặt cái này trên kết nối quản trị hay giám sát của bạn để cái khách duy nhất bạn cần lúc có sự cố không phải là cái bị đá ra.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT NO-TOUCH on</code> — đọc mà không làm nhiễu</span><span class="lz-lnote">Ngăn các lượt đọc của kết nối này cập nhật siêu dữ liệu LRU/LFU (Bài 9.2). Đúng thứ mà một phiên gỡ lỗi hay một công cụ quét cần: soi các khoá mà không làm chúng trông nóng lên rồi làm lệch việc chọn khoá để đẩy đi.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>CLIENT PAUSE</code> — đóng băng, trong chốc lát</span><span class="lz-lnote"><code>CLIENT PAUSE 5000 WRITE</code> giữ các lệnh ghi lại năm giây trong khi các lệnh đọc vẫn chạy. Nó sinh ra cho những lần chuyển đổi có phối hợp (Chương 11), và ở mọi chỗ khác thì nó là một khẩu súng tự bắn vào chân — mỗi khách bị giữ lại là một yêu cầu đang ôm một kết nối và một luồng ở đâu đó phía trên.</span></div>
</div>

<h3>Chọn cỡ một gáo kết nối</h3>
<pre><code><span class="tok-comment">// Phần lớn thư viện Node: MỘT kết nối, có pipeline, thường là đúng (Bài 1.5)</span>
const redis = createClient({ url, socket: { keepAlive: 30000 } });

<span class="tok-comment">// Lệnh chặn cần kết nối riêng của nó — chúng đỗ cái socket lại</span>
const blocking = redis.duplicate();     <span class="tok-comment">// BLPOP, XREAD BLOCK, BRPOPLPUSH</span>
const sub      = redis.duplicate();     <span class="tok-comment">// SUBSCRIBE (Bài 8.1)</span>

<span class="tok-comment">// Thư viện dùng gáo (Java, Go, Python): chọn cỡ theo tính đồng thời, không theo lưu lượng</span>
<span class="tok-comment">//   gáo = số lệnh đang bay đồng thời trên mỗi tiến trình, cộng một chút biên</span>
<span class="tok-comment">//   tổng = gáo x số tiến trình x số bản sao — và nó phải nằm dưới maxclients</span></code></pre>
<div class="callout ok"><strong>Hãy làm phép nhân đó trước khi triển khai, vì chẳng ai làm nó sau đâu.</strong> Một cái gáo 50, nhân 8 tiến trình worker, nhân 40 pod, là 16.000 kết nối đòi hỏi một máy chủ cấu hình cho 10.000 — và nó sẽ không hỏng trong lúc triển khai, nó sẽ hỏng vào lần mở rộng <em>kế tiếp</em>, và lúc đó cái lỗi là <code>ERR max number of clients reached</code> từ một dịch vụ vốn vẫn ổn suốt mấy tháng. Hai luật giữ cho chuyện này tỉnh táo: chọn cỡ gáo theo tính đồng thời chứ đừng theo tốc độ yêu cầu (một tiến trình Node xử lý 5.000 yêu cầu mỗi giây có thể vẫn chỉ cần một kết nối, vì các lệnh dồn pipeline trên đó), và hãy đặt <code>maxclients</code>, cỡ gáo và số bản sao vào cùng một tài liệu để phép nhân ấy nhìn thấy được.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> một chỗ rò kết nối, trông y hệt một vấn đề dung lượng cho tới khi bạn vẽ đồ thị đúng con số. Hình dáng của nó luôn giống nhau: <code>connected_clients</code> tăng chậm và đơn điệu, không bao giờ tụt kể cả khi lưu lượng giảm qua đêm, cho tới khi nó chạm <code>maxclients</code> và mọi thứ dừng lại. Nguyên nhân gần như không bao giờ là Redis — mà là một thư viện khách tạo một kết nối cho mỗi yêu cầu thay vì dùng lại một cái gáo, một lệnh <code>duplicate()</code> gọi bên trong một bộ xử lý yêu cầu, một bên đăng ký kết nối lại khi lỗi mà không đóng socket cũ, hay một thư viện có cái gáo không trần rồi phình lên dưới tải và không bao giờ co lại. Hãy chẩn đoán bằng ba thứ: vẽ đồ thị <code>connected_clients</code> và tìm một đường chỉ đi lên; chạy <code>CLIENT LIST</code> rồi gom theo <code>addr</code> và <code>name</code> để xem máy nào và dịch vụ nào sở hữu chúng; và kiểm <code>age</code> — hàng nghìn kết nối có <code>age</code> lớn và <code>idle</code> khổng lồ là rò rỉ, không phải bận. Rồi hãy đặt một cái <code>name</code> cho kết nối theo từng dịch vụ để lần sau việc này mất một phút thay vì mất cả buổi chiều, và hãy thêm một cảnh báo khi <code>connected_clients</code> vượt một nửa <code>maxclients</code>, cái đó bắt được chỗ rò khi nó còn là một cái đồ thị chứ chưa thành một sự cố.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/client-list/" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">CLIENT LIST</span><span class="lc-sub">Giải thích từng trường trong cái đầu ra dày đặc ấy — <code>qbuf</code>, <code>omem</code>, <code>obl</code>, <code>oll</code>, <code>events</code>, <code>flags</code> — biến cái dòng đó thành một chẩn đoán thay vì một bức tường chữ.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Đo hiệu năng và số kết nối</span><span class="lc-sub">Số kết nối, pipeline và kích thước gói dữ liệu tương tác với thông lượng ra sao — những phép đo cần chạy trước khi quyết cỡ gáo của bạn nên là bao nhiêu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: tìm chỗ rò</span><span class="lc-sub">Bài chấm điểm: chẩn đoán một <code>connected_clients</code> đang tăng từ <code>CLIENT LIST</code>, giết các kết nối của người dùng gây chuyện, tính một cỡ gáo an toàn từ một cấu hình triển khai, và sửa một <code>maxclients</code> bị <code>ulimit</code> âm thầm chặn lại.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Ba giới hạn phải khớp nhau — <code>maxclients</code>, giới hạn mô tả tệp của tiến trình và <code>tcp-backlog</code>/<code>somaxconn</code> — và giới hạn của hệ điều hành thắng một cách âm thầm, hạ <code>maxclients</code> xuống mà chỉ có một dòng nhật ký lúc khởi động nói ra chuyện đó. <code>timeout 0</code> đúng cho thư viện dùng gáo nhưng sai khi phía sau có một bộ cân tải bỏ TCP rảnh, nên hãy đặt <code>tcp-keepalive</code> dưới ngưỡng đó không thì cái gáo của bạn phát ra những socket đã chết. Và một <code>connected_clients</code> chỉ tăng mà không bao giờ tụt là một chỗ rò chứ không phải sự tăng trưởng: hãy đặt tên cho kết nối, gom <code>CLIENT LIST</code> theo <code>addr</code> để tìm chủ sở hữu, và đặt cảnh báo ở mức nửa <code>maxclients</code> để bạn thấy nó dưới dạng một cái đồ thị chứ không phải một sự cố.</p>
</div>
`,
    },
    /* ─────────────────────────── 10.6 ─────────────────────────── */
    {
      title: '10.6 — Quiz: running Redis|||10.6 — Trắc nghiệm: vận hành Redis',
      slug: 'rd-10-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về sự trôi dạt cấu hình, vì sao một Redis mở toang là chiếm quyền chứ không chỉ rò rỉ, người dùng default, thứ tự luật ACL, ACL LOG, rename-command với ACL, container công bố cổng, và giới hạn kết nối.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the chapter where the failures are other people's rather than your code's. Half of them are about defaults that were correct for 2010 and are not correct for a machine with a public IP.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: why <code>CONFIG SET</code> access is more than data access (10.2), what <code>requirepass</code> actually does to the <code>default</code> user (10.3), why ACLs beat <code>rename-command</code> (10.4), and which limit silently caps <code>maxclients</code> (10.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về cái chương mà các kiểu hỏng thuộc về người khác chứ không thuộc về mã của bạn. Một nửa số câu nói về những mặc định vốn đúng cho năm 2010 và không còn đúng cho một cái máy có IP công cộng.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: vì sao quyền <code>CONFIG SET</code> hơn cả quyền truy cập dữ liệu (10.2), <code>requirepass</code> thật ra làm gì với người dùng <code>default</code> (10.3), vì sao ACL thắng <code>rename-command</code> (10.4), và giới hạn nào âm thầm chặn <code>maxclients</code> lại (10.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You fix an incident with `CONFIG SET maxmemory 8gb`. Eight months later a routine reboot brings the old value back. What happened?|||Bạn chữa một sự cố bằng `CONFIG SET maxmemory 8gb`. Tám tháng sau, một lần khởi động lại định kỳ đưa giá trị cũ trở lại. Chuyện gì đã xảy ra?',
            options: [
              'CONFIG SET changes only the running server; without CONFIG REWRITE or an edited redis.conf the change vanishes on restart|||CONFIG SET chỉ đổi máy chủ đang chạy; không có CONFIG REWRITE hay một tệp redis.conf đã sửa thì thay đổi biến mất khi khởi động lại',
              'maxmemory is reset automatically whenever the dataset shrinks below the limit|||maxmemory được đặt lại tự động mỗi khi tập dữ liệu co xuống dưới cái trần',
              'The value expired — runtime config changes have a 90-day TTL|||Giá trị đó hết hạn — các thay đổi cấu hình lúc chạy có TTL 90 ngày',
              'A replica overwrote the primary’s configuration during a resync|||Một bản sao ghi đè cấu hình của bản chính trong một lần đồng bộ lại',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is an internet-reachable Redis with no password a compromise rather than just a data leak?|||Vì sao một Redis với tới được từ Internet mà không có mật khẩu lại là một cú chiếm quyền chứ không chỉ là một vụ rò rỉ dữ liệu?',
            options: [
              'Because Redis stores everything in plaintext, so the data is more valuable than usual|||Vì Redis lưu mọi thứ ở dạng văn bản thô, nên dữ liệu có giá trị hơn bình thường',
              'Because CONFIG SET makes dir and dbfilename runtime-settable, so an attacker can make the server write attacker-controlled data to any path it can write — and REPLICAOF can point the instance at their server|||Vì CONFIG SET làm cho dir và dbfilename đặt được lúc chạy, nên kẻ tấn công có thể bắt máy chủ ghi dữ liệu do họ kiểm soát ra bất kỳ đường dẫn nào nó ghi được — và REPLICAOF có thể trỏ cái máy về máy chủ của họ',
              'Because Redis logs every command, so the attacker gets an audit trail of your traffic|||Vì Redis ghi nhật ký mọi lệnh, nên kẻ tấn công có được một bản ghi kiểm toán lưu lượng của bạn',
              'Because the RESP protocol can be tunnelled over HTTP, bypassing the firewall|||Vì giao thức RESP có thể đi ngầm qua HTTP, vượt qua tường lửa',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You set `requirepass` to a 64-character random string. What permissions does an authenticated client have?|||Bạn đặt `requirepass` thành một chuỗi ngẫu nhiên 64 ký tự. Một khách đã xác thực có những quyền gì?',
            options: [
              'Read-only access until you explicitly grant writes|||Chỉ đọc cho tới khi bạn cấp quyền ghi một cách tường minh',
              'Access limited to database 0 and non-administrative commands|||Truy cập giới hạn trong cơ sở dữ liệu 0 và các lệnh không phải quản trị',
              'Whatever the connecting client library requests during the handshake|||Bất cứ thứ gì mà thư viện khách xin trong lúc bắt tay',
              'Everything: requirepass is just the password for the default user, whose ACL remains +@all ~* &* — so a leaked credential is total access|||Mọi thứ: requirepass chỉ là mật khẩu cho người dùng default, mà ACL của người đó vẫn là +@all ~* &* — nên một thông tin xác thực bị lộ là quyền truy cập toàn phần',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'What is the difference between `ACL SETUSER u +@all -@dangerous` and `ACL SETUSER u -@dangerous +@all`?|||`ACL SETUSER u +@all -@dangerous` khác `ACL SETUSER u -@dangerous +@all` ở chỗ nào?',
            options: [
              'Nothing — ACL rules are a set, so order does not matter|||Không khác gì — luật ACL là một tập hợp, nên thứ tự không quan trọng',
              'The second is invalid; a negative rule cannot come first|||Cái thứ hai không hợp lệ; một luật phủ định không được đứng trước',
              'Rules apply left to right, so the first grants everything then removes the dangerous commands, while the second removes them and then grants everything back — the second user has FLUSHALL|||Các luật áp từ trái sang phải, nên cái đầu cấp mọi thứ rồi gỡ đi các lệnh nguy hiểm, còn cái sau gỡ chúng rồi cấp lại mọi thứ — người dùng thứ hai có FLUSHALL',
              'The first applies to keys and the second to commands|||Cái đầu áp cho khoá còn cái sau áp cho lệnh',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You are rolling out a restrictive ACL user and the application starts failing in ways you did not predict. What is the fastest way to find every permission you got wrong?|||Bạn đang đưa một người dùng ACL hạn chế vào chạy và ứng dụng bắt đầu hỏng theo những cách bạn không lường trước. Cách nhanh nhất để tìm ra mọi quyền bạn đoán sai là gì?',
            options: [
              'Run MONITOR and watch every command as it arrives|||Chạy MONITOR và xem từng lệnh khi nó tới',
              'Read ACL LOG: it records every denial with the username, the exact command or key refused, and the client address|||Đọc ACL LOG: nó ghi lại mọi lần từ chối kèm tên người dùng, đúng cái lệnh hay cái khoá bị chặn, và địa chỉ khách',
              'Compare ACL GETUSER against the application source code|||Đối chiếu ACL GETUSER với mã nguồn ứng dụng',
              'Temporarily set the user to +@all and diff the INFO commandstats|||Tạm đặt người dùng thành +@all rồi so sánh INFO commandstats',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why are ACL rules preferred over `rename-command FLUSHALL ""` for removing dangerous commands?|||Vì sao luật ACL được ưu tiên hơn `rename-command FLUSHALL ""` để gỡ các lệnh nguy hiểm?',
            options: [
              'rename-command is global — it affects your operators too, cannot be changed at runtime, breaks tooling that calls commands by their real names, and stores the new name in the same config file an attacker would read|||rename-command là toàn cục — nó ảnh hưởng cả tới các kỹ sư vận hành của bạn, không đổi được lúc đang chạy, làm hỏng các công cụ gọi lệnh bằng tên thật, và cất cái tên mới ngay trong cái tệp cấu hình mà kẻ tấn công sẽ đọc',
              'rename-command was removed in Redis 7.0 and no longer works|||rename-command đã bị gỡ ở bản Redis 7.0 và không còn chạy nữa',
              'ACL rules are faster to evaluate at command-dispatch time|||Luật ACL đánh giá nhanh hơn ở thời điểm điều phối lệnh',
              'rename-command only works for commands that take no key arguments|||rename-command chỉ chạy với những lệnh không nhận tham số khoá',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Your container has `bind 127.0.0.1` in the mounted redis.conf and `ports: ["6379:6379"]` in compose. What is actually exposed?|||Container của bạn có `bind 127.0.0.1` trong tệp redis.conf đã gắn vào và `ports: ["6379:6379"]` trong compose. Thứ gì thật sự bị phơi ra?',
            options: [
              'Nothing — bind 127.0.0.1 inside the container prevents any external access|||Không gì cả — bind 127.0.0.1 bên trong container ngăn mọi truy cập từ bên ngoài',
              'Only the Docker bridge network, because published ports are namespaced|||Chỉ mạng cầu nối Docker, vì các cổng đã công bố nằm trong không gian tên riêng',
              'Two independent problems: the mounted config is ignored unless passed as an argument to redis-server, AND 6379:6379 publishes to every host interface regardless of bind|||Hai vấn đề độc lập: tệp cấu hình đã gắn vào bị phớt lờ trừ khi truyền làm tham số cho redis-server, VÀ 6379:6379 công bố ra mọi giao diện của máy chủ bất kể bind',
              'Only IPv6, since Docker publishes IPv4 separately|||Chỉ IPv6, vì Docker công bố IPv4 riêng',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'redis.conf says `maxclients 10000`, but connections start failing at around 990. Where is the real limit?|||redis.conf ghi `maxclients 10000`, nhưng các kết nối bắt đầu hỏng ở khoảng 990. Cái giới hạn thật nằm ở đâu?',
            options: [
              'tcp-backlog, which caps concurrent connections at 511 plus a margin|||tcp-backlog, vốn chặn số kết nối đồng thời ở 511 cộng một chút biên',
              'The process file-descriptor limit (ulimit -n 1024): Redis lowers maxclients to fit and only says so in a warning logged at startup|||Giới hạn mô tả tệp của tiến trình (ulimit -n 1024): Redis hạ maxclients xuống cho vừa và chỉ nói ra điều đó trong một cảnh báo ghi lúc khởi động',
              'maxmemory-clients, which evicts connections once their buffers are large|||maxmemory-clients, vốn đẩy các kết nối đi khi bộ đệm của chúng lớn lên',
              'protected-mode, which limits non-loopback clients to 1000|||protected-mode, vốn giới hạn các khách không phải loopback ở mức 1000',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
