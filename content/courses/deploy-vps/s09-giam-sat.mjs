const REF = '?ref=%2Fcourses%2Fdeploy-vps%2Flearn&reflabel=Deploy%20VPS';
/**
 * Deploy VPS — Chương 9: Giám sát.
 * Mọi số đo là ĐO THẬT: /proc/stat và /proc/loadavg trên nhân Linux 6.18 với
 * bốn nhân bị ép bận 100%, 200 request thật qua một dịch vụ có đuôi chậm,
 * 200.000 dòng log sinh ra ở hai định dạng, và một cấu hình nginx sai cổng
 * để chốt kiểm sức khoẻ nói dối một cách thuyết phục.
 */

export default {
  title: 'Chapter 9 — Monitoring: the numbers that lie and the ones that do not|||Chương 9 — Giám sát: những con số nói dối và những con số thì không',
  slug: 'deploy-ch9-giam-sat',
  description: 'Load average mất 60 giây mới bò tới 2,62 trong khi CPU đã 100% từ giây số 0. Trung bình 60,8 ms trong khi một phần hai mươi người dùng chờ 900 ms. Và một chốt kiểm sức khoẻ trả 200 qua đúng con proxy người dùng đi qua, trong khi trang chủ trả 502.',
  sortOrder: 10,
  lessons: [

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — What to measure, and the number that lies|||9.1 — Đo cái gì, và con số NÓI DỐI',
      slug: 'deploy-9-1-do-cai-gi',
      type: 'VIDEO',
      description: 'Bốn nhân bị ép bận 100% từ giây số 0. CPU đọc ra 100% ngay. Load average mất 60 giây mới bò tới 2,62 — và giá trị đúng là 4,00. Đo thật cả bảy lần lấy mẫu, kèm cách tính CPU từ /proc/stat cho đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>What to measure, and the number that lies</h2>
<p class="lead">Chapter 8 was about failures the kernel announces. This chapter is about noticing the ones it does not — and the first problem is that the number everybody reaches for first is the slowest one on the machine.</p>

<h3>Load average, measured against the truth</h3>
<p>Four cores pinned at 100% starting at t=0, with the true load therefore 4.00. Sampling both numbers every ten seconds:</p>

<div class="out">  truoc : 0.10 0.12 0.09
  t= 0s  load=0.10 0.12 0.09   CPU_ban=100.0%
  t=10s  load=0.70 0.25 0.13   CPU_ban=100.0%
  t=20s  load=1.21 0.37 0.18   CPU_ban=100.0%
  t=30s  load=1.71 0.51 0.22   CPU_ban=100.0%
  t=40s  load=2.07 0.62 0.26   CPU_ban=100.0%
  t=50s  load=2.36 0.73 0.30   CPU_ban=100.0%
  t=60s  load=2.62 0.84 0.34   CPU_ban=100.0%</div>

<div class="callout warn">
<p><strong>Read the first row.</strong> The machine is <em>completely saturated</em> and the one-minute load average says <strong>0.10</strong>. Sixty seconds later — a full minute into a total CPU outage — it has reached 2.62 against a true value of 4.00, and the fifteen-minute figure is still 0.34. If your alerting looks at load average, your first notification arrives long after your users did.</p>
</div>

<p>This is not a bug. Load average is an exponentially-weighted moving average with time constants of 1, 5 and 15 minutes, and a moving average is by construction a description of the past. It is a good number for "was yesterday busier than today" and a useless one for "is something wrong right now".</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">load average</span><span class="lz-t">minutes late</span><span class="lz-d">good for trends, useless for incidents</span></div>
<div class="lz-step"><span class="lz-k">CPU from /proc/stat</span><span class="lz-t">as current as your sample interval</span><span class="lz-d">what you actually want</span></div>
</div>

<h3>Computing CPU correctly</h3>
<p><code>/proc/stat</code> holds cumulative counters since boot, in units of 1/100 second (<code>getconf CLK_TCK</code> = 100 here). A single reading tells you nothing; you need two, and the difference between them:</p>

<pre><code>head -1 /proc/stat
<span class="tok-comment"># cpu  91419 0 66238 9302856 3770 0 13102 904 0 0</span>
<span class="tok-comment"># user nice system idle iowait irq softirq steal guest guest_nice</span></code></pre>

<pre><code>doc() { awk '/^cpu /{t=0;for(i=2;i&lt;=NF;i++)t+=\$i; print t, \$5}' /proc/stat; }
read T1 I1 &lt; &lt;(doc); sleep 1; read T2 I2 &lt; &lt;(doc)
<span class="tok-comment"># ban% = 100 * (delta tong - delta idle) / delta tong</span></code></pre>

<div class="out">=== may dang ranh ===
  CPU ban: 1.5%  (delta tong=399, delta idle=393)
=== ep mot nhan ban 100% trong 2 giay ===
  CPU ban: 26.9%  (delta tong=802, delta idle=586)</div>

<p>One busy core out of four reads as 26.9%, which is correct — the counters sum across all CPUs, so 100% means every core.</p>

<div class="pitfall">
<p><strong>Bẫy — the <code>steal</code> column is the one that matters on a cheap VPS.</strong> Field eight is time your virtual CPU was ready to run and the hypervisor gave the physical core to somebody else. On an oversubscribed host it can be double digits, and it produces the most confusing possible symptom: your application is slow, your CPU graph shows plenty of idle, and nothing you own is at fault. If <code>steal</code> is consistently above a few percent, the problem is your neighbours and no amount of optimisation on your side will fix it — that is a conversation with the provider, or a different machine.</p>
</div>

<h3>The four things worth watching on a small server</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">saturation</span><span class="lz-lnote">CPU busy%, memory available, disk % and inodes, connection-pool depth. "How close to the wall am I?"</span></div>
<div class="lz-layer"><span class="lz-lname">errors</span><span class="lz-lnote">5xx rate, restart count, the cgroup&#39;s <code>oom_kill</code> counter (8.1). "How often is it already broken?"</span></div>
<div class="lz-layer"><span class="lz-lname">latency</span><span class="lz-lnote">not the mean — p50, p95, p99 (9.2). "How does it feel to use?"</span></div>
<div class="lz-layer"><span class="lz-lname">traffic</span><span class="lz-lnote">requests per second. Only useful as the denominator for the other three, but you cannot interpret them without it</span></div>
</div>

<p>A 5% error rate at ten requests per second is one unhappy person a minute. The same 5% at a thousand requests per second is an outage. The error rate alone does not distinguish them.</p>

<h3>The cost of measuring</h3>
<p>Reading <code>/proc</code> is essentially free — but <em>how</em> you read it is not:</p>

<div class="out">=== doc /proc, 1000 lan moi tep, bang 'cat' (co fork) ===
  /proc/stat          1.647 ms/lan
  /proc/meminfo       1.643 ms/lan
  /proc/loadavg       1.715 ms/lan
  /proc/diskstats     1.580 ms/lan

=== doc TRONG mot tien trinh (khong fork) ===
  /proc/stat         0.0135 ms/lan
  /proc/meminfo      0.0104 ms/lan
  /proc/loadavg      0.0077 ms/lan
  /proc/diskstats    0.0164 ms/lan</div>

<p>0.01 ms to read the file, 1.6 ms to <code>cat</code> it — <strong>120× more</strong>, essentially all of it <code>fork</code> and <code>exec</code>. A shell monitoring loop that spawns a dozen processes every five seconds is spending more effort on the measurement than on anything it measures. Read the files directly from one long-lived process, or accept that your monitoring is a background load of its own.</p>

<div class="callout ok">
<p><strong>What to install on a 1 GB VPS.</strong> Honestly: nothing heavy. A Prometheus server plus Grafana on the same box you are monitoring is a memory-hungry way to guarantee that your monitoring dies at exactly the moment it becomes interesting (8.2 — it will be one of the biggest processes on the machine). Either run <code>node_exporter</code> alone and scrape it from somewhere else, or write twenty lines that read <code>/proc</code>, append a line to a file, and let a cron job look at the trend (9.4). The second option is genuinely enough for one small server.</p>
</div>

<h3>Where the counters live</h3>
<div class="kv-grid">
<div class="kv"><span class="k">/proc/stat</span><span class="v">CPU jiffies per state; also context switches and boot time</span></div>
<div class="kv"><span class="k">/proc/meminfo</span><span class="v"><code>MemAvailable</code> is the line to read — not <code>MemFree</code>, which excludes reclaimable cache</span></div>
<div class="kv"><span class="k">/proc/diskstats</span><span class="v">reads, writes and — field 10 — milliseconds spent doing I/O, the basis of disk utilisation</span></div>
<div class="kv"><span class="k">/proc/net/dev</span><span class="v">bytes and packets per interface, cumulative like everything else here</span></div>
<div class="kv"><span class="k">/proc/pressure/*</span><span class="v">PSI on kernels 4.20+: the fraction of time tasks were stalled on cpu, io or memory. Closer to "is it bad" than anything else in this list</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — every number in <code>/proc</code> here is cumulative, and a single reading is meaningless.</strong> This catches people writing their first monitoring script: they read <code>/proc/diskstats</code>, see a huge number, and report it as a rate. It is a total since boot. Everything in this lesson needs two samples and a subtraction — and the interval between them has to be measured too, not assumed, because <code>sleep 1</code> does not sleep for exactly one second.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/stat and /proc/loadavg</span><span class="lc-sub">man 5 proc — the field order used above, and the definition of load average as a count of runnable <em>and uninterruptible</em> tasks, which is why disk waits inflate it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux load averages: solving the mystery</span><span class="lc-sub">brendangregg.com/blog/2017-08-08/linux-load-averages.html — why Linux counts uninterruptible tasks when other Unixes do not, and what that makes the number mean.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — PSI, pressure stall information</span><span class="lc-sub">docs.kernel.org/accounting/psi.html — <code>/proc/pressure/{cpu,io,memory}</code>, designed specifically to answer "is this resource hurting me" rather than "how much of it is used".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring Distributed Systems</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — the four golden signals the list above is a small-server version of.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — reading /proc, and writing a metrics loop</span><span class="lc-sub">/courses/linux-bash/learn${REF} — the awk and file-reading patterns above, and why avoiding subshells matters in a loop that runs forever.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Đo cái gì, và con số NÓI DỐI</h2>
<p class="lead">Chương 8 nói về những cú hỏng mà nhân hệ điều hành TUYÊN BỐ. Chương này nói về việc nhận ra những cú nó KHÔNG tuyên bố — và vấn đề đầu tiên là cái con số mà ai cũng với tay lấy trước nhất lại là con số CHẬM NHẤT trên cái máy.</p>

<h3>Load average, đo đối chiếu với sự thật</h3>
<p>Bốn nhân bị ghim 100% bắt đầu từ t=0, nên tải thật là 4,00. Lấy mẫu cả hai con số mỗi mười giây:</p>

<div class="out">  truoc : 0.10 0.12 0.09
  t= 0s  load=0.10 0.12 0.09   CPU_ban=100.0%
  t=10s  load=0.70 0.25 0.13   CPU_ban=100.0%
  t=20s  load=1.21 0.37 0.18   CPU_ban=100.0%
  t=30s  load=1.71 0.51 0.22   CPU_ban=100.0%
  t=40s  load=2.07 0.62 0.26   CPU_ban=100.0%
  t=50s  load=2.36 0.73 0.30   CPU_ban=100.0%
  t=60s  load=2.62 0.84 0.34   CPU_ban=100.0%</div>

<div class="callout warn">
<p><strong>Đọc hàng đầu tiên.</strong> Cái máy đang <em>BÃO HOÀ HOÀN TOÀN</em> và load average một phút nói <strong>0,10</strong>. Sáu mươi giây sau — tròn một phút giữa một cú chết CPU toàn phần — nó mới bò tới 2,62 so với giá trị thật 4,00, còn con số mười lăm phút thì vẫn là 0,34. Nếu hệ báo động của bạn nhìn load average, thì thông báo đầu tiên của bạn tới LÂU sau khi người dùng đã tới.</p>
</div>

<p>Đây không phải một con bọ. Load average là một trung bình động có trọng số mũ với hằng số thời gian 1, 5 và 15 phút, mà một trung bình động thì theo cấu tạo là một MÔ TẢ VỀ QUÁ KHỨ. Nó là con số tốt cho câu "hôm qua có bận hơn hôm nay không" và vô dụng cho câu "ngay lúc này có gì sai không".</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">load average</span><span class="lz-t">trễ hàng phút</span><span class="lz-d">tốt cho xu hướng, vô dụng cho sự cố</span></div>
<div class="lz-step"><span class="lz-k">CPU từ /proc/stat</span><span class="lz-t">mới bằng đúng khoảng lấy mẫu của bạn</span><span class="lz-d">thứ bạn thật sự muốn</span></div>
</div>

<h3>Tính CPU cho đúng</h3>
<p><code>/proc/stat</code> giữ các bộ đếm CỘNG DỒN từ lúc khởi động, đơn vị 1/100 giây (<code>getconf CLK_TCK</code> = 100 ở đây). Một lần đọc chẳng nói gì cả; bạn cần HAI lần, và hiệu giữa chúng:</p>

<pre><code>head -1 /proc/stat
<span class="tok-comment"># cpu  91419 0 66238 9302856 3770 0 13102 904 0 0</span>
<span class="tok-comment"># user nice system idle iowait irq softirq steal guest guest_nice</span></code></pre>

<pre><code>doc() { awk '/^cpu /{t=0;for(i=2;i&lt;=NF;i++)t+=\$i; print t, \$5}' /proc/stat; }
read T1 I1 &lt; &lt;(doc); sleep 1; read T2 I2 &lt; &lt;(doc)
<span class="tok-comment"># ban% = 100 * (delta tong - delta idle) / delta tong</span></code></pre>

<div class="out">=== may dang ranh ===
  CPU ban: 1.5%  (delta tong=399, delta idle=393)
=== ep mot nhan ban 100% trong 2 giay ===
  CPU ban: 26.9%  (delta tong=802, delta idle=586)</div>

<p>Một nhân bận trên bốn đọc ra 26,9%, và đó là ĐÚNG — các bộ đếm cộng gộp qua mọi CPU, nên 100% nghĩa là MỌI nhân.</p>

<div class="pitfall">
<p><strong>Bẫy — cột <code>steal</code> mới là cái quan trọng trên một VPS rẻ tiền.</strong> Trường thứ tám là thời gian CPU ảo của bạn SẴN SÀNG chạy mà bộ ảo hoá lại đưa nhân vật lý cho người khác. Trên một máy chủ bán quá tay, nó có thể lên hai chữ số, và nó đẻ ra triệu chứng khó hiểu nhất có thể: ứng dụng của bạn chậm, đồ thị CPU của bạn cho thấy còn thừa mứa chỗ rảnh, và chẳng có gì thuộc về bạn là có lỗi. Nếu <code>steal</code> liên tục trên vài phần trăm, thì vấn đề là HÀNG XÓM của bạn và không có mức tối ưu nào ở phía bạn chữa được — đó là một cuộc nói chuyện với nhà cung cấp, hoặc một cái máy khác.</p>
</div>

<h3>Bốn thứ đáng nhìn trên một máy chủ nhỏ</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">độ bão hoà</span><span class="lz-lnote">CPU bận%, bộ nhớ khả dụng, % đĩa và inode, độ sâu bể kết nối. "Tôi cách bức tường bao xa?"</span></div>
<div class="lz-layer"><span class="lz-lname">lỗi</span><span class="lz-lnote">tỷ lệ 5xx, số lần khởi động lại, bộ đếm <code>oom_kill</code> của cgroup (8.1). "Nó ĐANG hỏng thường xuyên tới mức nào?"</span></div>
<div class="lz-layer"><span class="lz-lname">độ trễ</span><span class="lz-lnote">không phải trung bình — p50, p95, p99 (9.2). "Dùng nó cảm giác thế nào?"</span></div>
<div class="lz-layer"><span class="lz-lname">lưu lượng</span><span class="lz-lnote">số request mỗi giây. Chỉ hữu dụng như MẪU SỐ cho ba cái kia, nhưng thiếu nó thì không diễn giải được ba cái kia</span></div>
</div>

<p>Tỷ lệ lỗi 5% ở mười request mỗi giây là một người khó chịu mỗi phút. Cũng 5% đó ở một nghìn request mỗi giây là một cú sập. Riêng tỷ lệ lỗi không phân biệt được hai chuyện.</p>

<h3>Giá của việc đo</h3>
<p>Đọc <code>/proc</code> về cơ bản là miễn phí — nhưng <em>CÁCH</em> bạn đọc nó thì không:</p>

<div class="out">=== doc /proc, 1000 lan moi tep, bang 'cat' (co fork) ===
  /proc/stat          1.647 ms/lan
  /proc/meminfo       1.643 ms/lan
  /proc/loadavg       1.715 ms/lan
  /proc/diskstats     1.580 ms/lan

=== doc TRONG mot tien trinh (khong fork) ===
  /proc/stat         0.0135 ms/lan
  /proc/meminfo      0.0104 ms/lan
  /proc/loadavg      0.0077 ms/lan
  /proc/diskstats    0.0164 ms/lan</div>

<p>0,01 ms để đọc cái tệp, 1,6 ms để <code>cat</code> nó — <strong>gấp 120 lần</strong>, mà gần như toàn bộ phần chênh là <code>fork</code> với <code>exec</code>. Một vòng lặp giám sát viết bằng shell đẻ ra hàng chục tiến trình mỗi năm giây đang bỏ nhiều công sức vào PHÉP ĐO hơn vào bất cứ thứ gì nó đo. Hãy đọc thẳng các tệp đó từ MỘT tiến trình sống lâu, hoặc chấp nhận rằng hệ giám sát của bạn tự nó là một mức tải nền.</p>

<div class="callout ok">
<p><strong>Cài gì trên một VPS 1 GB.</strong> Thành thật: đừng cài gì nặng. Một máy chủ Prometheus cộng Grafana trên chính cái máy bạn đang giám sát là một cách ngốn bộ nhớ để bảo đảm rằng hệ giám sát của bạn CHẾT đúng vào khoảnh khắc nó trở nên thú vị (8.2 — nó sẽ là một trong những tiến trình lớn nhất trên máy). Hoặc chỉ chạy <code>node_exporter</code> rồi thu thập từ NƠI KHÁC, hoặc viết hai mươi dòng đọc <code>/proc</code>, nối một dòng vào một tệp, và để một cron job nhìn xu hướng (9.4). Lựa chọn thứ hai thật sự là ĐỦ cho một máy chủ nhỏ.</p>
</div>

<h3>Các bộ đếm nằm ở đâu</h3>
<div class="kv-grid">
<div class="kv"><span class="k">/proc/stat</span><span class="v">jiffy CPU theo từng trạng thái; cả số lần chuyển ngữ cảnh và thời điểm khởi động</span></div>
<div class="kv"><span class="k">/proc/meminfo</span><span class="v"><code>MemAvailable</code> mới là dòng cần đọc — không phải <code>MemFree</code>, thứ loại trừ phần bộ đệm thu hồi được</span></div>
<div class="kv"><span class="k">/proc/diskstats</span><span class="v">số lần đọc, ghi và — trường 10 — số mili giây đã dành cho I/O, cơ sở của mức sử dụng đĩa</span></div>
<div class="kv"><span class="k">/proc/net/dev</span><span class="v">byte và gói theo từng giao diện, cộng dồn như mọi thứ ở đây</span></div>
<div class="kv"><span class="k">/proc/pressure/*</span><span class="v">PSI trên nhân 4.20+: tỷ lệ thời gian các tác vụ bị kẹt vì cpu, io hay bộ nhớ. Gần với "nó có tệ không" hơn bất cứ thứ gì khác trong danh sách này</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — MỌI con số trong <code>/proc</code> ở đây là CỘNG DỒN, và một lần đọc thì vô nghĩa.</strong> Cái này bắt được những người viết script giám sát đầu tiên của họ: họ đọc <code>/proc/diskstats</code>, thấy một con số khổng lồ, rồi báo cáo nó như một TỐC ĐỘ. Nó là tổng kể từ lúc khởi động. Mọi thứ trong bài này cần HAI lần lấy mẫu và một phép trừ — và khoảng cách giữa chúng cũng phải được ĐO, chứ đừng giả định, vì <code>sleep 1</code> không ngủ đúng một giây.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">proc(5) — /proc/stat và /proc/loadavg</span><span class="lc-sub">man 5 proc — thứ tự trường dùng ở trên, và định nghĩa load average là số tác vụ CHẠY ĐƯỢC <em>VÀ không ngắt được</em>, đó là lý do chờ đĩa làm nó phồng lên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Brendan Gregg — Linux load averages: solving the mystery</span><span class="lc-sub">brendangregg.com/blog/2017-08-08/linux-load-averages.html — vì sao Linux đếm cả tác vụ không ngắt được trong khi các Unix khác thì không, và điều đó làm con số ấy có nghĩa gì.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Linux kernel — PSI, pressure stall information</span><span class="lc-sub">docs.kernel.org/accounting/psi.html — <code>/proc/pressure/{cpu,io,memory}</code>, thiết kế riêng để trả lời "tài nguyên này có đang làm tôi đau không" thay vì "nó được dùng bao nhiêu".</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Monitoring Distributed Systems</span><span class="lc-sub">sre.google/sre-book/monitoring-distributed-systems/ — bốn tín hiệu vàng mà danh sách ở trên là bản dành cho máy chủ nhỏ của chúng.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — đọc /proc, và viết một vòng lặp thu số đo</span><span class="lc-sub">/courses/linux-bash/learn${REF} — các khuôn mẫu awk và đọc tệp ở trên, và vì sao tránh shell con lại quan trọng trong một vòng lặp chạy mãi mãi.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — The average lies too|||9.2 — Trung bình cũng NÓI DỐI',
      slug: 'deploy-9-2-trung-binh',
      type: 'VIDEO',
      description: '200 request thật qua một dịch vụ có đuôi chậm. Trung bình 60,8 ms — con số đẹp đẽ trên bảng điều khiển. Một nửa người dùng chờ 14,8 ms, và một phần hai mươi chờ 900,8 ms. Không ai chờ 60,8 ms cả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>The average lies too</h2>
<p class="lead">9.1 was about a number that is late. This one is about a number that is on time, correct, and still describes an experience nobody had.</p>

<h3>The measurement</h3>
<p>A service with a realistic latency shape: most requests are quick, and one in twenty has to do something expensive. 200 real HTTP requests, timed by <code>curl</code>:</p>

<div class="out">  n = 200 request
  trung binh :     60.8 ms   ← con so tren bang dieu khien
  p50        :     14.8 ms
  p90        :     19.9 ms
  p95        :    900.8 ms   ← 1 tren 20 nguoi dung
  p99        :    981.6 ms
  max        :    982.4 ms
  so request > 500 ms: 10 (5%)</div>

<div class="callout warn">
<p><strong>Nobody waited 60.8 ms.</strong> Half the users got 14.8 ms — four times better than the average. One in twenty got 900 ms — fifteen times worse. The mean sits in a gap between two populations and describes neither of them. Worse, it is <em>reassuring</em>: 60 ms looks like a healthy API.</p>
</div>

<p>Look at the jump between p90 and p95: 19.9 ms to 900.8 ms, a 45× step in five percentage points. That cliff is the signature of a bimodal distribution — two different code paths, not one path with variance. The mean hides the cliff completely; the percentiles make it the most obvious thing on the page.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">p50</span><span class="lz-t">14.8 ms</span><span class="lz-d">the typical experience — what "it feels fast" means</span></div>
<div class="lz-step"><span class="lz-k">p90 → p95</span><span class="lz-t">19.9 → 900.8 ms</span><span class="lz-d">the cliff. Something different happens here</span></div>
<div class="lz-step"><span class="lz-k">p99</span><span class="lz-t">981.6 ms</span><span class="lz-d">one request in a hundred; at 100 rps that is one per second</span></div>
<div class="lz-step"><span class="lz-k">mean</span><span class="lz-t">60.8 ms</span><span class="lz-d">describes nobody, and hides both halves</span></div>
</div>

<h3>Why the tail matters more than it looks</h3>
<p>Two arguments, and the second is the one people underestimate.</p>

<p>First: a single page view is not one request. If loading a page makes twenty backend calls and each has a 5% chance of being slow, the chance that <em>all twenty</em> are fast is 0.95²⁰ ≈ 36%. Nearly two thirds of page loads hit at least one slow call. A "5% tail" at the request level is a majority experience at the page level.</p>

<p>Second: the slow requests are the ones that hold resources. Ten requests at 900 ms occupy connections, memory and worker slots for the same total time as 600 requests at 15 ms. Under load, the tail is what fills your connection pool — which is how a slow tail turns into a full outage without the mean moving much at all.</p>

<div class="pitfall">
<p><strong>Bẫy — you cannot average percentiles, and every dashboard invites you to.</strong> If one server reports p95=100 ms and another reports p95=300 ms, the fleet p95 is <em>not</em> 200 ms — that quantity has no meaning at all. Percentiles have to be computed from the underlying distribution, which is why real metric systems ship histogram buckets rather than pre-computed percentiles. Averaging p95 across servers, or across time buckets, produces a number that looks plausible and is arithmetic nonsense.</p>
</div>

<h3>Getting percentiles without a metrics stack</h3>
<p>You do not need Prometheus for this. Nginx already logs <code>$request_time</code> per request (the Nginx course covers the log format); the whole calculation is a sort:</p>

<pre><code><span class="tok-comment"># p50/p95/p99 tu mot tep log co truong thoi gian</span>
awk '{print \$NF}' access.log | sort -n | awk '
  {a[NR]=\$1}
  END{printf "p50=%.0fms p95=%.0fms p99=%.0fms max=%.0fms\\n",
      a[int(NR*.50)]*1000, a[int(NR*.95)]*1000, a[int(NR*.99)]*1000, a[NR]*1000}'</code></pre>

<p>Ten seconds of work, run from cron, appending one line an hour to a file. That is a latency history, and on a single small server it is genuinely enough.</p>

<div class="callout ok">
<p><strong>What to alert on.</strong> Not the mean, and not a fixed millisecond threshold either — those go stale as the app changes. Alert when <strong>p95 doubles relative to the same hour last week</strong>. That catches real regressions, ignores the daily traffic shape, and does not need retuning every time you ship a feature. The comparison needs a week of history, which is the argument for starting to record it before you need it.</p>
</div>

<h3>The same trap in every other number</h3>
<div class="kv-grid">
<div class="kv"><span class="k">average CPU over 5 minutes</span><span class="v">hides a 30-second pin at 100% — the exact window in which requests queued and timed out</span></div>
<div class="kv"><span class="k">average memory</span><span class="v">hides the peak, which is the only number the OOM killer cares about (8.5)</span></div>
<div class="kv"><span class="k">average error rate per day</span><span class="v">hides a total outage lasting twenty minutes</span></div>
<div class="kv"><span class="k">the general rule</span><span class="v">averages hide the extremes, and the extremes are the incident. Record max and p95 alongside every mean</span></div>
</div>

<p>Chapter 8 made this argument for memory without naming it: <code>memory.max_usage_in_bytes</code> is worth reading precisely because it is a <em>peak</em>, and a process is killed by its peak, not by its average.</p>

<h3>A note on what my measurement is not</h3>
<p>These 200 samples came from <code>curl</code> on the same machine as the service, so they include no network and no client-side time. Real percentiles measured from the user&#39;s side will be worse — sometimes much worse — because they include TLS handshakes, DNS, and the mobile connection the user is actually on. The shape of the distribution is the point here; the absolute numbers belong to this sandbox and nowhere else.</p>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Gil Tene — How NOT to measure latency</span><span class="lc-sub">A talk worth watching in full (search "Tene coordinated omission"). Its core point: most latency tools stop sending requests while the system is stalled, so they systematically miss the worst numbers.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — histograms and summaries</span><span class="lc-sub">prometheus.io/docs/practices/histograms/ — explains directly why percentiles must be computed from buckets and cannot be averaged, the trap above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Service Level Objectives</span><span class="lc-sub">sre.google/sre-book/service-level-objectives/ — why an SLO is stated as a percentile over a window rather than as an average, and how to pick the window.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — log_format and \$request_time</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — the variable that makes the awk one-liner above possible, plus <code>\$upstream_response_time</code> for separating your app&#39;s time from the proxy&#39;s.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — a log format that answers questions</span><span class="lc-sub">/courses/nginx/learn${REF} — which variables to log so latency, cache status and upstream can be separated afterwards.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Trung bình cũng NÓI DỐI</h2>
<p class="lead">Bài 9.1 nói về một con số ĐẾN MUỘN. Bài này nói về một con số đúng giờ, chính xác, và vẫn mô tả một trải nghiệm mà KHÔNG AI có.</p>

<h3>Phép đo</h3>
<p>Một dịch vụ có hình dạng độ trễ thực tế: phần lớn request thì nhanh, và một trên hai mươi phải làm một việc đắt đỏ. 200 request HTTP thật, bấm giờ bằng <code>curl</code>:</p>

<div class="out">  n = 200 request
  trung binh :     60.8 ms   ← con so tren bang dieu khien
  p50        :     14.8 ms
  p90        :     19.9 ms
  p95        :    900.8 ms   ← 1 tren 20 nguoi dung
  p99        :    981.6 ms
  max        :    982.4 ms
  so request > 500 ms: 10 (5%)</div>

<div class="callout warn">
<p><strong>KHÔNG AI chờ 60,8 ms cả.</strong> Một nửa người dùng nhận 14,8 ms — tốt hơn trung bình bốn lần. Một trên hai mươi nhận 900 ms — tệ hơn mười lăm lần. Cái trung bình ngồi trong khe giữa hai đám đông và không mô tả đám nào. Tệ hơn, nó còn <em>TRẤN AN</em>: 60 ms trông như một API khoẻ mạnh.</p>
</div>

<p>Nhìn cú nhảy giữa p90 và p95: 19,9 ms lên 900,8 ms, một bậc thang gấp 45 lần trong năm điểm phần trăm. Cái vách đó là chữ ký của một phân bố HAI ĐỈNH — hai đường mã khác nhau, chứ không phải một đường mã có độ tản. Trung bình giấu cái vách đi hoàn toàn; các phân vị làm nó thành thứ hiển nhiên nhất trên trang.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">p50</span><span class="lz-t">14,8 ms</span><span class="lz-d">trải nghiệm điển hình — đây là ý nghĩa của "thấy nó nhanh"</span></div>
<div class="lz-step"><span class="lz-k">p90 → p95</span><span class="lz-t">19,9 → 900,8 ms</span><span class="lz-d">cái vách. Ở đây có chuyện gì đó KHÁC đang xảy ra</span></div>
<div class="lz-step"><span class="lz-k">p99</span><span class="lz-t">981,6 ms</span><span class="lz-d">một request trên một trăm; ở 100 rps thì đó là một cái mỗi giây</span></div>
<div class="lz-step"><span class="lz-k">trung bình</span><span class="lz-t">60,8 ms</span><span class="lz-d">mô tả không ai cả, và giấu đi cả hai nửa</span></div>
</div>

<h3>Vì sao cái đuôi quan trọng hơn vẻ ngoài</h3>
<p>Hai lập luận, và cái thứ hai là cái người ta hay đánh giá thấp.</p>

<p>Thứ nhất: một lượt xem trang không phải MỘT request. Nếu tải một trang gọi hai mươi lời gọi backend và mỗi cái có 5% khả năng chậm, thì xác suất <em>CẢ HAI MƯƠI</em> đều nhanh là 0,95²⁰ ≈ 36%. Gần hai phần ba số lượt tải trang dính ít nhất một lời gọi chậm. Một "cái đuôi 5%" ở mức REQUEST là trải nghiệm của ĐA SỐ ở mức TRANG.</p>

<p>Thứ hai: các request chậm là những cái GIỮ tài nguyên. Mười request ở 900 ms chiếm kết nối, bộ nhớ và suất thợ trong cùng tổng thời gian với 600 request ở 15 ms. Dưới tải, cái đuôi mới là thứ làm đầy bể kết nối của bạn — và đó là cách một cái đuôi chậm biến thành một cú sập toàn phần mà trung bình gần như không nhúc nhích.</p>

<div class="pitfall">
<p><strong>Bẫy — bạn KHÔNG lấy trung bình của các phân vị được, và mọi bảng điều khiển đều mời bạn làm thế.</strong> Nếu một máy chủ báo p95=100 ms và một máy khác báo p95=300 ms, thì p95 của cả đội <em>KHÔNG</em> phải 200 ms — cái đại lượng đó không có nghĩa gì cả. Phân vị phải được tính từ PHÂN BỐ nằm dưới, và đó là lý do các hệ số đo nghiêm túc gửi đi các thùng histogram chứ không gửi phân vị tính sẵn. Lấy trung bình p95 qua các máy chủ, hay qua các khoảng thời gian, đẻ ra một con số trông có lý và là vô nghĩa về mặt số học.</p>
</div>

<h3>Có phân vị mà không cần cả một hệ đo</h3>
<p>Bạn không cần Prometheus cho việc này. Nginx vốn đã ghi <code>$request_time</code> cho mỗi request (khoá Nginx nói về định dạng log); toàn bộ phép tính là một lần sắp xếp:</p>

<pre><code><span class="tok-comment"># p50/p95/p99 tu mot tep log co truong thoi gian</span>
awk '{print \$NF}' access.log | sort -n | awk '
  {a[NR]=\$1}
  END{printf "p50=%.0fms p95=%.0fms p99=%.0fms max=%.0fms\\n",
      a[int(NR*.50)]*1000, a[int(NR*.95)]*1000, a[int(NR*.99)]*1000, a[NR]*1000}'</code></pre>

<p>Mười giây công sức, chạy từ cron, nối một dòng mỗi giờ vào một tệp. Đó là một lịch sử độ trễ, và trên một máy chủ nhỏ đơn lẻ thì nó thật sự là ĐỦ.</p>

<div class="callout ok">
<p><strong>Báo động theo cái gì.</strong> Không phải trung bình, và cũng không phải một ngưỡng mili giây cố định — mấy cái đó ôi thiu dần khi ứng dụng đổi. Hãy báo động khi <strong>p95 tăng GẤP ĐÔI so với cùng giờ đó tuần trước</strong>. Nó bắt được các cú thụt lùi thật, phớt lờ hình dạng lưu lượng theo ngày, và không cần chỉnh lại mỗi khi bạn phát hành một tính năng. Phép so sánh ấy cần một tuần lịch sử, và đó là lý lẽ cho việc bắt đầu ghi lại TRƯỚC khi bạn cần tới.</p>
</div>

<h3>Cùng cái bẫy đó trong mọi con số khác</h3>
<div class="kv-grid">
<div class="kv"><span class="k">CPU trung bình trong 5 phút</span><span class="v">giấu đi một cú ghim 100% dài 30 giây — đúng cái cửa sổ mà request xếp hàng rồi hết giờ</span></div>
<div class="kv"><span class="k">bộ nhớ trung bình</span><span class="v">giấu đi cái ĐỈNH, con số duy nhất mà OOM killer quan tâm (8.5)</span></div>
<div class="kv"><span class="k">tỷ lệ lỗi trung bình theo ngày</span><span class="v">giấu đi một cú sập toàn phần dài hai mươi phút</span></div>
<div class="kv"><span class="k">quy tắc chung</span><span class="v">trung bình giấu các cực trị, và các cực trị chính là sự cố. Hãy ghi max và p95 cạnh MỌI con trung bình</span></div>
</div>

<p>Chương 8 đã đưa ra lập luận này cho bộ nhớ mà không gọi tên nó: <code>memory.max_usage_in_bytes</code> đáng đọc CHÍNH VÌ nó là một cái <em>ĐỈNH</em>, và một tiến trình bị giết bởi cái đỉnh của nó, không phải bởi cái trung bình.</p>

<h3>Một ghi chú về việc phép đo của tôi KHÔNG phải cái gì</h3>
<p>200 mẫu này tới từ <code>curl</code> chạy trên cùng cái máy với dịch vụ, nên chúng không gồm mạng và không gồm thời gian phía máy khách. Phân vị thật đo từ phía NGƯỜI DÙNG sẽ tệ hơn — đôi khi tệ hơn nhiều — vì chúng gồm cả bắt tay TLS, DNS, và cái kết nối di động mà người dùng đang thật sự ngồi trên đó. HÌNH DẠNG của phân bố mới là điểm cần rút ra ở đây; các con số tuyệt đối thuộc về hộp cát này và không thuộc về đâu khác.</p>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Gil Tene — How NOT to measure latency</span><span class="lc-sub">Một bài nói đáng xem trọn vẹn (tìm "Tene coordinated omission"). Điểm cốt lõi: phần lớn công cụ đo độ trễ NGỪNG gửi request trong lúc hệ thống đang kẹt, nên chúng bỏ sót một cách có hệ thống đúng những con số tệ nhất.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — histogram và summary</span><span class="lc-sub">prometheus.io/docs/practices/histograms/ — giải thích thẳng vì sao phân vị phải tính từ các thùng và không lấy trung bình được, đúng cái bẫy ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Service Level Objectives</span><span class="lc-sub">sre.google/sre-book/service-level-objectives/ — vì sao một SLO được phát biểu bằng một phân vị trên một cửa sổ chứ không phải bằng trung bình, và chọn cửa sổ thế nào.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — log_format và \$request_time</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — cái biến làm cho dòng awk ở trên khả thi, cộng <code>\$upstream_response_time</code> để tách thời gian của ứng dụng khỏi thời gian của proxy.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — một định dạng log trả lời được câu hỏi</span><span class="lc-sub">/courses/nginx/learn${REF} — ghi những biến nào để sau này tách được độ trễ, trạng thái bộ đệm và upstream.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Logs that answer questions|||9.3 — Log TRẢ LỜI ĐƯỢC câu hỏi',
      slug: 'deploy-9-3-log',
      type: 'VIDEO',
      description: '200.000 dòng log sinh ra ở hai định dạng, rồi hỏi cả hai cùng một câu. Log thuần trả lời trong 82 mili giây — và trả lời SAI, vì nó không có trường thời gian. JSON mất 497 ms và trả lời đúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Logs that answer questions</h2>
<p class="lead">Metrics tell you something is wrong. Logs are supposed to tell you what. Whether they can depends entirely on decisions you made before the incident, and the most consequential one is which fields you wrote down.</p>

<h3>The question</h3>
<p>200,000 requests written to two formats — the nginx <code>combined</code> default and one line of JSON per event — and then a question a real incident would produce: <em>which URIs are returning 5xx and taking more than two seconds?</em></p>

<div class="out">--- tren log THUAN (combined) ---
    830 /api/v1/don
    817 /api/v1/nguoi-dung/42
    792 /health
  → 82 ms  — VA khong tra loi duoc phan 'cham hon 2 giay':
             combined KHONG co truong thoi gian

--- tren log JSON ---
     281 /api/v1/don
     280 /api/v1/nguoi-dung/42
     257 /health
  → 538 ms</div>

<div class="callout warn">
<p><strong>The fast answer is the wrong answer.</strong> <code>awk</code> over the plain log took 82 ms and returned 830 — but that is <em>every</em> 5xx on that URI, because the combined format has no <code>$request_time</code> field. The question cannot be answered from that file at any speed. The correct number is 281, and getting it cost 538 ms. Six times slower and actually true.</p>
</div>

<p><code>jq</code> did the same work in 497 ms, close enough to the hand-written Python to say the parsing cost is inherent to JSON rather than to the tool.</p>

<h3>What that costs in disk</h3>
<div class="out">  json.log           23.5 MB
  ket-hop.log        22.2 MB
  → cung 200.000 su kien: JSON to hon 1.06 lan

  ket-hop.log: 22.2 MB → 1.4 MB (ti le 15.4x)
  json.log: 23.5 MB → 1.9 MB (ti le 12.1x)</div>

<p>Six percent larger — far less than people expect, because the repeated key names compress extremely well. Both formats shrink by more than 12× under plain gzip, which is the real lesson: <strong>rotate and compress, and the format barely matters for storage.</strong> 200,000 requests is about 1.4–1.9 MB compressed, so a small site keeping ninety days of logs is talking about a few hundred megabytes — affordable even on the disk from Chapter 8.</p>

<h3>The fields worth having</h3>
<p>Format is a smaller decision than content. The combined format loses because of what it omits, not because of its syntax:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">timestamp, status, method, path</span><span class="lz-lnote">every format has these; they are not the interesting part</span></div>
<div class="lz-layer"><span class="lz-lname">request duration</span><span class="lz-lnote">the field the whole measurement above turned on. Without it, no percentiles (9.2) and no "slow" query</span></div>
<div class="lz-layer"><span class="lz-lname">upstream duration, separately</span><span class="lz-lnote">splits "my app is slow" from "the proxy is slow" without guessing</span></div>
<div class="lz-layer"><span class="lz-lname">a request id</span><span class="lz-lnote">one identifier tying the proxy line to the application lines. This is what makes a log searchable rather than readable</span></div>
<div class="lz-layer"><span class="lz-lname">release version</span><span class="lz-lnote">so "did this start with the deploy?" is a query rather than an argument (6.3 made the same case for data rows)</span></div>
<div class="lz-layer"><span class="lz-lname">user or tenant id</span><span class="lz-lnote">so "is it everyone or one customer?" is answerable in one command</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — a log line is a place secrets go to be permanently archived.</strong> Logging a full request body captures passwords on the login route. Logging headers captures <code>Authorization</code> and session cookies. Logging a query string captures a password-reset token. And unlike a leak in memory, this one is written to disk, shipped to an aggregator, backed up, and retained for months — Chapter 4&#39;s rules about where secrets may appear apply to logs with more force than anywhere else, because logs are the one place you are deliberately keeping everything. Choose fields explicitly; never log whole objects.</p>
</div>

<h3>Structured does not mean JSON everywhere</h3>
<p>The measurement above compares two extremes, and there is a middle that is often the right answer on a single server: keep the human-readable format and <em>add the fields you need</em>. Nginx makes this trivial:</p>

<pre><code>log_format huu_dung '\$remote_addr \$status \$request_time \$upstream_response_time '
                    '\$upstream_addr \$upstream_status "\$request_uri" '
                    '\$body_bytes_sent \$upstream_cache_status';</code></pre>

<p>Still one line per request, still greppable with <code>awk</code> at 82 ms, and now it contains the duration. You lose JSON&#39;s robustness against fields containing spaces, and you keep the speed. On one server that is usually the better trade; the argument for JSON gets much stronger the moment a machine is shipping logs to something that will parse them.</p>

<div class="callout ok">
<p><strong>What is genuinely worth doing on a small VPS.</strong> Log to files, rotate with <code>logrotate</code> (daily, compress, keep 14–30), and cap the journal with <code>SystemMaxUse=</code> — Chapter 8 measured what an uncapped log does to a disk shared with the database. Do not ship logs off the box until you have a reason to; a single server&#39;s logs are searchable with <code>grep</code> and <code>awk</code> in milliseconds, as measured above.</p>
</div>

<h3>The lines that should never be written</h3>
<p>The most common failure in logging is not too little, it is too much. A log that records every successful request at INFO level, with a full object dump, produces a file nobody reads and a disk that fills. Two rules cut most of it:</p>

<div class="kv-grid">
<div class="kv"><span class="k">log the exceptional</span><span class="v">nginx: <code>access_log … if=\$dang_chu_y</code> with a map that zeroes 2xx/3xx. Errors keep a full log, successes go to the summary file</span></div>
<div class="kv"><span class="k">sample the routine</span><span class="v">one in a hundred successful requests is plenty to establish the shape; keep all the failures</span></div>
<div class="kv"><span class="k">never log in a loop</span><span class="v">a per-item log line inside a batch job is how 40 GB appears overnight</span></div>
<div class="kv"><span class="k">health checks off</span><span class="v"><code>location /health { access_log off; }</code> — a probe every two seconds is 43,200 lines a day saying nothing</span></div>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_log_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — <code>log_format</code>, the <code>if=</code> parameter, <code>escape=json</code>, and buffered writes with <code>buffer=</code>/<code>flush=</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">man 8 logrotate — <code>compress</code>, <code>delaycompress</code>, <code>maxsize</code>, and the <code>copytruncate</code> caveat measured in Lesson 8.4.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd-journald.conf(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/journald.conf.html — <code>SystemMaxUse=</code> and <code>MaxRetentionSec=</code>, the two settings that stop the journal from being the thing that fills your disk.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">jq manual</span><span class="lc-sub">jqlang.github.io/jq/manual/ — <code>select()</code>, <code>group_by()</code> and <code>-r</code>, which cover most of what log analysis needs.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — log formats, conditional logging and buffered writes</span><span class="lc-sub">/courses/nginx/learn${REF} — the measured cost of logging every request versus buffering it, and the <code>map</code> trick behind conditional logging.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Log TRẢ LỜI ĐƯỢC câu hỏi</h2>
<p class="lead">Số đo nói cho bạn biết có gì đó SAI. Log lẽ ra phải nói cho bạn biết đó là GÌ. Chuyện nó làm được hay không phụ thuộc hoàn toàn vào các quyết định bạn đã ra TRƯỚC sự cố, và quyết định nặng ký nhất là bạn đã ghi lại NHỮNG TRƯỜNG NÀO.</p>

<h3>Câu hỏi</h3>
<p>200.000 request ghi ra hai định dạng — mặc định <code>combined</code> của nginx và một dòng JSON cho mỗi sự kiện — rồi hỏi một câu mà một sự cố thật sẽ đẻ ra: <em>URI nào đang trả 5xx VÀ tốn hơn hai giây?</em></p>

<div class="out">--- tren log THUAN (combined) ---
    830 /api/v1/don
    817 /api/v1/nguoi-dung/42
    792 /health
  → 82 ms  — VA khong tra loi duoc phan 'cham hon 2 giay':
             combined KHONG co truong thoi gian

--- tren log JSON ---
     281 /api/v1/don
     280 /api/v1/nguoi-dung/42
     257 /health
  → 538 ms</div>

<div class="callout warn">
<p><strong>Câu trả lời NHANH là câu trả lời SAI.</strong> <code>awk</code> chạy trên log thuần mất 82 ms và trả về 830 — nhưng đó là <em>MỌI</em> cú 5xx trên URI ấy, vì định dạng combined không có trường <code>$request_time</code>. Câu hỏi đó KHÔNG trả lời được từ cái tệp ấy dù với tốc độ nào. Con số đúng là 281, và lấy được nó tốn 538 ms. Chậm hơn sáu lần và thật sự đúng.</p>
</div>

<p><code>jq</code> làm cùng việc đó trong 497 ms, đủ gần với bản Python viết tay để kết luận rằng chi phí phân tích là bản chất của JSON chứ không phải của công cụ.</p>

<h3>Chuyện đó tốn bao nhiêu đĩa</h3>
<div class="out">  json.log           23.5 MB
  ket-hop.log        22.2 MB
  → cung 200.000 su kien: JSON to hon 1.06 lan

  ket-hop.log: 22.2 MB → 1.4 MB (ti le 15.4x)
  json.log: 23.5 MB → 1.9 MB (ti le 12.1x)</div>

<p>Lớn hơn sáu phần trăm — ít hơn nhiều so với người ta tưởng, vì các tên khoá lặp lại nén cực tốt. Cả hai định dạng đều co lại hơn 12 lần dưới gzip thường, và đó mới là bài học thật: <strong>xoay vòng và nén, thì định dạng gần như không ảnh hưởng tới chỗ lưu.</strong> 200.000 request là khoảng 1,4–1,9 MB sau nén, nên một website nhỏ giữ chín mươi ngày log đang nói về vài trăm megabyte — kham được kể cả trên cái đĩa của Chương 8.</p>

<h3>Những trường đáng có</h3>
<p>Định dạng là một quyết định nhỏ hơn NỘI DUNG. Định dạng combined thua vì thứ nó BỎ SÓT, không phải vì cú pháp của nó:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">thời điểm, mã trạng thái, phương thức, đường dẫn</span><span class="lz-lnote">định dạng nào cũng có; chúng không phải phần thú vị</span></div>
<div class="lz-layer"><span class="lz-lname">thời lượng request</span><span class="lz-lnote">cái trường mà cả phép đo ở trên xoay quanh. Thiếu nó thì không có phân vị (9.2) và không truy vấn được "chậm"</span></div>
<div class="lz-layer"><span class="lz-lname">thời lượng upstream, RIÊNG</span><span class="lz-lnote">tách "ứng dụng tôi chậm" khỏi "con proxy chậm" mà không cần đoán</span></div>
<div class="lz-layer"><span class="lz-lname">một mã request</span><span class="lz-lnote">một định danh nối dòng của proxy với các dòng của ứng dụng. Đây là thứ làm một cuốn log TRA CỨU ĐƯỢC chứ không chỉ đọc được</span></div>
<div class="lz-layer"><span class="lz-lname">phiên bản bản phát hành</span><span class="lz-lnote">để "cái này có bắt đầu từ lần deploy không?" thành một câu truy vấn chứ không phải một cuộc tranh cãi (6.3 đã lập luận y hệt cho các dòng dữ liệu)</span></div>
<div class="lz-layer"><span class="lz-lname">mã người dùng hoặc khách thuê</span><span class="lz-lnote">để "là mọi người hay chỉ một khách hàng?" trả lời được bằng một lệnh</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một dòng log là nơi bí mật đi tới để được LƯU TRỮ VĨNH VIỄN.</strong> Ghi log toàn bộ thân request là bắt được mật khẩu ở route đăng nhập. Ghi log các header là bắt được <code>Authorization</code> và cookie phiên. Ghi log chuỗi truy vấn là bắt được token đặt lại mật khẩu. Và khác với một cú rò trong bộ nhớ, cái này được GHI XUỐNG ĐĨA, gửi tới hệ gom, sao lưu, và giữ hàng tháng — các quy tắc của Chương 4 về chỗ bí mật được phép xuất hiện áp cho log MẠNH HƠN bất cứ đâu, vì log là chỗ duy nhất bạn CỐ Ý giữ lại mọi thứ. Hãy chọn trường một cách tường minh; đừng bao giờ ghi log cả một đối tượng.</p>
</div>

<h3>Có cấu trúc KHÔNG có nghĩa là JSON ở mọi nơi</h3>
<p>Phép đo ở trên so hai thái cực, và có một chặng giữa thường là câu trả lời đúng trên một máy chủ đơn lẻ: giữ định dạng người-đọc-được và <em>THÊM những trường bạn cần</em>. Nginx làm chuyện đó dễ như bỡn:</p>

<pre><code>log_format huu_dung '\$remote_addr \$status \$request_time \$upstream_response_time '
                    '\$upstream_addr \$upstream_status "\$request_uri" '
                    '\$body_bytes_sent \$upstream_cache_status';</code></pre>

<p>Vẫn một dòng mỗi request, vẫn grep được bằng <code>awk</code> ở mức 82 ms, và giờ nó CÓ thời lượng. Bạn mất đi tính bền của JSON trước các trường chứa dấu cách, và bạn giữ được tốc độ. Trên một máy chủ thì đó thường là đánh đổi tốt hơn; lý lẽ cho JSON mạnh lên rất nhiều ngay khi một cái máy bắt đầu gửi log tới thứ gì đó sẽ đi phân tích chúng.</p>

<div class="callout ok">
<p><strong>Thứ thật sự đáng làm trên một VPS nhỏ.</strong> Ghi log ra tệp, xoay vòng bằng <code>logrotate</code> (hằng ngày, nén, giữ 14–30), và chặn trần journal bằng <code>SystemMaxUse=</code> — Chương 8 đã đo xem một cuốn log không có trần làm gì với cái đĩa dùng chung với cơ sở dữ liệu. ĐỪNG gửi log ra khỏi máy cho tới khi bạn có lý do; log của một máy chủ đơn lẻ tra cứu được bằng <code>grep</code> và <code>awk</code> trong vài mili giây, như đã đo ở trên.</p>
</div>

<h3>Những dòng KHÔNG BAO GIỜ nên được ghi</h3>
<p>Cú hỏng phổ biến nhất trong việc ghi log không phải là QUÁ ÍT, mà là QUÁ NHIỀU. Một cuốn log ghi lại mọi request thành công ở mức INFO, kèm một bản đổ đối tượng đầy đủ, đẻ ra một tệp không ai đọc và một cái đĩa đầy. Hai quy tắc cắt được phần lớn:</p>

<div class="kv-grid">
<div class="kv"><span class="k">ghi cái BẤT THƯỜNG</span><span class="v">nginx: <code>access_log … if=\$dang_chu_y</code> với một map cho 2xx/3xx về không. Lỗi thì giữ log đầy đủ, thành công thì vào tệp tóm tắt</span></div>
<div class="kv"><span class="k">lấy mẫu cái THƯỜNG NGÀY</span><span class="v">một trên một trăm request thành công là quá đủ để dựng ra hình dạng; giữ TẤT CẢ các cú hỏng</span></div>
<div class="kv"><span class="k">đừng bao giờ ghi log trong vòng lặp</span><span class="v">một dòng log cho mỗi phần tử bên trong một tác vụ lô là cách 40 GB xuất hiện sau một đêm</span></div>
<div class="kv"><span class="k">tắt log chốt kiểm sức khoẻ</span><span class="v"><code>location /health { access_log off; }</code> — một cú thăm dò mỗi hai giây là 43.200 dòng mỗi ngày chẳng nói gì</span></div>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — ngx_http_log_module</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_log_module.html — <code>log_format</code>, tham số <code>if=</code>, <code>escape=json</code>, và ghi có đệm bằng <code>buffer=</code>/<code>flush=</code>.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">logrotate(8)</span><span class="lc-sub">man 8 logrotate — <code>compress</code>, <code>delaycompress</code>, <code>maxsize</code>, và điều kiện kèm theo của <code>copytruncate</code> đo ở Bài 8.4.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">systemd-journald.conf(5)</span><span class="lc-sub">freedesktop.org/software/systemd/man/journald.conf.html — <code>SystemMaxUse=</code> và <code>MaxRetentionSec=</code>, hai thiết lập ngăn cuốn journal trở thành thứ làm đầy đĩa của bạn.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">jq manual</span><span class="lc-sub">jqlang.github.io/jq/manual/ — <code>select()</code>, <code>group_by()</code> và <code>-r</code>, ba thứ bao được phần lớn nhu cầu phân tích log.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — định dạng log, log có điều kiện và ghi có đệm</span><span class="lc-sub">/courses/nginx/learn${REF} — giá đo được của việc ghi log mọi request so với ghi có đệm, và mẹo <code>map</code> nằm sau log có điều kiện.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Alerting on the trend, not the threshold|||9.4 — Báo động theo XU HƯỚNG, không theo ngưỡng',
      slug: 'deploy-9-4-bao-dong',
      type: 'VIDEO',
      description: 'Mô phỏng 48 giờ một cái đĩa đầy dần. Báo động ngưỡng 90% nổ ở giờ thứ 36 với năm giờ còn lại. Báo động xu hướng nổ ở giờ thứ 17 với hai mươi bốn giờ. Chênh nhau 19 giờ, và một cái rơi vào giờ hành chính.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Alerting on the trend, not the threshold</h2>
<p class="lead">An alert has one job: reach a human while there is still time to act. A threshold does not do that — it tells you how full something is, which is not the same as how long you have.</p>

<h3>The two alarms, on identical data</h3>
<p>A 20 GB disk starting at 30% and growing 350 MB an hour, sampled hourly for 48 hours. One alarm fires at 90%. The other computes the rate from the last three samples and fires when the extrapolated time-to-full drops below 24 hours:</p>

<div class="out">  gio | dung  |   %   | bao dong NGUONG | bao dong XU HUONG
  ----+-------+-------+-----------------+------------------
    0 |   6.0G |  30.0 |   im lang       |   im lang
   12 |  10.1G |  50.5 |   im lang       |   im lang
   17 |  11.8G |  59.1 |   im lang       | 🟠 day sau 24h
   24 |  14.2G |  71.0 |   im lang       | 🟠 day sau 17h
   30 |  16.3G |  81.3 |   im lang       | 🟠 day sau 11h
   36 |  18.3G |  91.5 | 🔴 NO           | 🟠 day sau 5h
   40 |  19.7G |  98.4 | 🔴 NO           | 🟠 day sau 1h
   41 |  20.0G | 100.1 | 🔴 NO           | 🟠 day sau -0h</div>

<div class="callout warn">
<p><strong>Nineteen hours of difference.</strong> The trend alarm fires at hour 17 with a full day of warning. The threshold alarm fires at hour 36 with five hours left — and there is no way to choose when in the day that lands. If the disk crosses 90% at 03:00, the threshold alarm wakes somebody at 03:00. The trend alarm would have said something the previous afternoon, while the fix was unhurried and reversible.</p>
</div>

<h3>The arithmetic</h3>
<p>It is one subtraction and one division, over samples you are already collecting:</p>

<pre><code>DUNG=\$(df --output=used /srv | tail -1)
TONG=\$(df --output=size /srv | tail -1)
echo "\$(date +%s) \$DUNG" >> dia.dat

awk -v tong="\$TONG" '
  {t[NR]=\$1; u[NR]=\$2}
  END{
    if (NR&lt;2) exit
    dt=t[NR]-t[1]; du=u[NR]-u[1]
    if (dt&lt;=0 || du&lt;=0) exit          <span class="tok-comment"># khong tang thi khong bao</span>
    toc=du/dt                          <span class="tok-comment"># KB moi giay</span>
    printf "day sau %.1f gio\\n", ((tong-u[NR])/toc)/3600
  }' dia.dat</code></pre>

<p>Run against the real filesystem while filling it deliberately:</p>

<div class="out">  chua du diem do
  dung 4.0% | toc do 15362.0 KB/s | con trong 247697.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15361.0 KB/s | con trong 247667.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15360.7 KB/s | con trong 247637.2 MB → DAY sau 4.6 gio</div>

<p>Four percent used. A threshold alarm has nothing to say. The trend alarm says four and a half hours, and it is right.</p>

<h3>The same shape for everything else</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">disk</span><span class="lz-lnote">time-to-full, as measured. Also apply it to inodes separately (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">memory</span><span class="lz-lnote">a steadily rising RSS with no plateau is a leak, and it is visible days before the OOM kill (8.1)</span></div>
<div class="lz-layer"><span class="lz-lname">latency</span><span class="lz-lnote">p95 against the same hour last week (9.2), not against a fixed millisecond number</span></div>
<div class="lz-layer"><span class="lz-lname">certificates</span><span class="lz-lnote">days remaining, alerting at 21 — the one deadline that is knowable months ahead and still catches people</span></div>
<div class="lz-layer"><span class="lz-lname">error rate</span><span class="lz-lnote">this one is genuinely a threshold, but as a ratio over a window: 5xx per request over five minutes, not a raw count</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — a trend alarm on noisy data fires constantly.</strong> My measurement used a clean monotonic series. Real disk usage goes up and down: a build writes 2 GB and deletes it, a backup lands and is shipped away. Extrapolating from two samples across that produces "full in 20 minutes" several times a day, and an alarm that cries wolf is an alarm somebody mutes. Smooth first — use a linear fit over the last several hours rather than the last two points, require the prediction to hold for two consecutive evaluations, and never alert on a shrinking series. My three-sample version above is the minimum that works on a quiet machine, not a template for a busy one.</p>
</div>

<h3>The alert that is worse than no alert</h3>
<p>Every alarm has a cost that is paid whether or not it is correct: someone reads it. An alarm that fires and is ignored has trained the reader to ignore the next one, including the real one. This is not a discipline problem — it is arithmetic. If five alarms a day are noise, the sixth gets three seconds of attention.</p>

<div class="kv-grid">
<div class="kv"><span class="k">an alert must be actionable</span><span class="v">if the answer is "yes, we know" or "nothing to do", it is a dashboard entry, not an alert</span></div>
<div class="kv"><span class="k">an alert must be urgent</span><span class="v">if it can wait until morning, send it somewhere that waits until morning</span></div>
<div class="kv"><span class="k">an alert must say what to do</span><span class="v">the message should name the command or the runbook page, not the metric</span></div>
<div class="kv"><span class="k">count your alerts</span><span class="v">more than one or two a week that need no action means the thresholds are wrong, not the reader</span></div>
</div>

<h3>What to alert on, on one small server</h3>
<p>Short list, and deliberately short:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">the site is down</span><span class="lz-t">from outside</span><span class="lz-d">checked from another machine — 9.5 is entirely about why this one is not optional</span></div>
<div class="lz-step"><span class="lz-k">disk full in &lt; 24h</span><span class="lz-t">trend</span><span class="lz-d">measured above; include inodes</span></div>
<div class="lz-step"><span class="lz-k">something was OOM-killed</span><span class="lz-t">counter grew</span><span class="lz-d"><code>oom_kill</code> from the cgroup, or <code>dmesg | grep -c oom</code> (8.1)</span></div>
<div class="lz-step"><span class="lz-k">TLS expires in &lt; 21 days</span><span class="lz-t">countdown</span><span class="lz-d">renewal is automated and automation breaks silently</span></div>
<div class="lz-step"><span class="lz-k">5xx rate above 1% for 5 min</span><span class="lz-t">ratio</span><span class="lz-d">the one genuine threshold, and it needs the window</span></div>
</div>

<p>Five alarms. Everything else goes on a page you look at when something already told you to look — which is the actual role of a dashboard.</p>

<div class="callout ok">
<p><strong>The one you will forget: test that the alert can reach you.</strong> An alerting pipeline is code that runs rarely, which by Chapter 7&#39;s rule makes it code that is probably broken. Send yourself a deliberate test alert on a schedule — monthly is enough — and treat its absence as an incident. The failure mode this catches is silent and complete: an expired webhook, a changed phone number, a mail server rejecting the sender. You find out either during a test, or during the outage.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Practical Alerting, and Being On-Call</span><span class="lc-sub">sre.google/sre-book/practical-alerting/ — the argument that alerts should be based on symptoms users feel rather than on causes, and the cost model for alert fatigue.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — predict_linear</span><span class="lc-sub">prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear — the built-in that does exactly the extrapolation above, fitted over a window instead of two points; the canonical example in its docs is disk-full prediction.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">df(1) — the --output flag</span><span class="lc-sub">man 1 df — <code>--output=used,size,pcent</code> gives parseable columns instead of the human table, which is what makes the script above robust.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Rob Ewaschuk — My Philosophy on Alerting</span><span class="lc-sub">The internal Google document that became the SRE book&#39;s alerting chapter; its rule that every page must be actionable, novel and require intelligence is the shortest useful statement of the idea.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — cron, and writing a job that reports failure</span><span class="lc-sub">/courses/linux-bash/learn${REF} — where cron sends output, why a silent cron job is usually a broken one, and how to make it complain.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Báo động theo XU HƯỚNG, không theo ngưỡng</h2>
<p class="lead">Một cái báo động có đúng một việc: CHẠM TỚI một con người trong lúc vẫn còn thời gian để hành động. Một cái ngưỡng KHÔNG làm được việc đó — nó nói cho bạn biết thứ gì đó đầy tới đâu, mà đó không phải cùng một chuyện với việc bạn còn bao lâu.</p>

<h3>Hai cái báo động, trên cùng một bộ dữ liệu</h3>
<p>Một cái đĩa 20 GB bắt đầu ở 30% và tăng 350 MB mỗi giờ, lấy mẫu hằng giờ suốt 48 giờ. Một cái báo động nổ ở 90%. Cái kia tính TỐC ĐỘ từ ba mẫu gần nhất và nổ khi thời gian ngoại suy tới lúc đầy tụt xuống dưới 24 giờ:</p>

<div class="out">  gio | dung  |   %   | bao dong NGUONG | bao dong XU HUONG
  ----+-------+-------+-----------------+------------------
    0 |   6.0G |  30.0 |   im lang       |   im lang
   12 |  10.1G |  50.5 |   im lang       |   im lang
   17 |  11.8G |  59.1 |   im lang       | 🟠 day sau 24h
   24 |  14.2G |  71.0 |   im lang       | 🟠 day sau 17h
   30 |  16.3G |  81.3 |   im lang       | 🟠 day sau 11h
   36 |  18.3G |  91.5 | 🔴 NO           | 🟠 day sau 5h
   40 |  19.7G |  98.4 | 🔴 NO           | 🟠 day sau 1h
   41 |  20.0G | 100.1 | 🔴 NO           | 🟠 day sau -0h</div>

<div class="callout warn">
<p><strong>Mười chín giờ chênh lệch.</strong> Báo động xu hướng nổ ở giờ thứ 17 với trọn một ngày để cảnh báo. Báo động ngưỡng nổ ở giờ thứ 36 với năm giờ còn lại — và không có cách nào chọn xem nó rơi vào lúc nào trong ngày. Nếu cái đĩa vượt 90% lúc 3 giờ sáng, thì báo động ngưỡng đánh thức ai đó lúc 3 giờ sáng. Báo động xu hướng lẽ ra đã nói gì đó vào chiều hôm trước, lúc cách chữa còn thong thả và đảo ngược được.</p>
</div>

<h3>Phép tính</h3>
<p>Nó là một phép trừ và một phép chia, trên những mẫu bạn vốn đã thu thập:</p>

<pre><code>DUNG=\$(df --output=used /srv | tail -1)
TONG=\$(df --output=size /srv | tail -1)
echo "\$(date +%s) \$DUNG" >> dia.dat

awk -v tong="\$TONG" '
  {t[NR]=\$1; u[NR]=\$2}
  END{
    if (NR&lt;2) exit
    dt=t[NR]-t[1]; du=u[NR]-u[1]
    if (dt&lt;=0 || du&lt;=0) exit          <span class="tok-comment"># khong tang thi khong bao</span>
    toc=du/dt                          <span class="tok-comment"># KB moi giay</span>
    printf "day sau %.1f gio\\n", ((tong-u[NR])/toc)/3600
  }' dia.dat</code></pre>

<p>Chạy trên hệ tệp thật trong lúc cố tình đổ dữ liệu vào:</p>

<div class="out">  chua du diem do
  dung 4.0% | toc do 15362.0 KB/s | con trong 247697.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15361.0 KB/s | con trong 247667.2 MB → DAY sau 4.6 gio
  dung 4.0% | toc do 15360.7 KB/s | con trong 247637.2 MB → DAY sau 4.6 gio</div>

<p>Bốn phần trăm đã dùng. Một cái báo động ngưỡng chẳng có gì để nói. Báo động xu hướng nói bốn giờ rưỡi, và nó ĐÚNG.</p>

<h3>Cùng hình dạng đó cho mọi thứ khác</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">đĩa</span><span class="lz-lnote">thời gian tới lúc đầy, như đã đo. Áp riêng cho inode nữa (8.4)</span></div>
<div class="lz-layer"><span class="lz-lname">bộ nhớ</span><span class="lz-lnote">một RSS tăng đều mà không có đoạn bằng phẳng là một chỗ rò, và nó nhìn thấy được HÀNG NGÀY trước cú OOM (8.1)</span></div>
<div class="lz-layer"><span class="lz-lname">độ trễ</span><span class="lz-lnote">p95 so với CÙNG GIỜ ĐÓ tuần trước (9.2), không so với một con số mili giây cố định</span></div>
<div class="lz-layer"><span class="lz-lname">chứng chỉ</span><span class="lz-lnote">số ngày còn lại, báo ở mức 21 — cái hạn chót DUY NHẤT biết trước được hàng tháng mà vẫn tóm được người ta</span></div>
<div class="lz-layer"><span class="lz-lname">tỷ lệ lỗi</span><span class="lz-lnote">cái này đúng là một NGƯỠNG thật, nhưng dưới dạng TỶ LỆ trên một cửa sổ: 5xx trên mỗi request trong năm phút, không phải một con số đếm thô</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — một báo động xu hướng trên dữ liệu NHIỄU thì nổ liên tục.</strong> Phép đo của tôi dùng một chuỗi tăng đơn điệu sạch sẽ. Mức dùng đĩa THẬT thì lên xuống: một bản dựng ghi 2 GB rồi xoá đi, một bản sao lưu đáp xuống rồi được chuyển đi. Ngoại suy từ hai mẫu cắt ngang chuyện đó sẽ đẻ ra "đầy sau 20 phút" vài lần mỗi ngày, và một cái báo động kêu oan là một cái báo động sẽ bị người ta tắt tiếng. Hãy LÀM MƯỢT trước — dùng một phép khớp tuyến tính trên vài giờ gần nhất chứ không phải hai điểm cuối, đòi hỏi dự đoán ấy phải GIỮ NGUYÊN qua hai lần đánh giá liên tiếp, và đừng bao giờ báo động trên một chuỗi đang giảm. Bản ba mẫu của tôi ở trên là mức tối thiểu chạy được trên một cái máy yên tĩnh, không phải khuôn mẫu cho một cái máy bận rộn.</p>
</div>

<h3>Cái báo động còn TỆ HƠN là không có báo động</h3>
<p>Mọi cái báo động đều có một cái giá phải trả bất kể nó đúng hay sai: có người ĐỌC nó. Một cái báo động nổ rồi bị làm ngơ đã HUẤN LUYỆN người đọc làm ngơ cái tiếp theo, kể cả cái thật. Đây không phải vấn đề kỷ luật — đó là số học. Nếu mỗi ngày có năm cái báo động là nhiễu, thì cái thứ sáu nhận được ba giây chú ý.</p>

<div class="kv-grid">
<div class="kv"><span class="k">báo động phải HÀNH ĐỘNG ĐƯỢC</span><span class="v">nếu câu trả lời là "ừ, biết rồi" hay "chẳng làm gì được", thì nó là một mục trên bảng điều khiển, không phải một cái báo động</span></div>
<div class="kv"><span class="k">báo động phải KHẨN</span><span class="v">nếu nó chờ được tới sáng, hãy gửi nó tới nơi biết chờ tới sáng</span></div>
<div class="kv"><span class="k">báo động phải nói LÀM GÌ</span><span class="v">dòng thông báo nên gọi tên cái lệnh hoặc trang sổ tay, không phải gọi tên cái số đo</span></div>
<div class="kv"><span class="k">hãy ĐẾM số báo động của bạn</span><span class="v">nhiều hơn một hai cái mỗi tuần mà chẳng cần hành động gì nghĩa là các ngưỡng sai, không phải người đọc sai</span></div>
</div>

<h3>Báo động cái gì, trên một máy chủ nhỏ</h3>
<p>Danh sách ngắn, và ngắn một cách có chủ đích:</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">website sập</span><span class="lz-t">từ BÊN NGOÀI</span><span class="lz-d">kiểm từ một cái máy khác — bài 9.5 nói trọn vẹn về việc vì sao cái này không phải tuỳ chọn</span></div>
<div class="lz-step"><span class="lz-k">đĩa đầy sau &lt; 24h</span><span class="lz-t">xu hướng</span><span class="lz-d">đo ở trên; gồm cả inode</span></div>
<div class="lz-step"><span class="lz-k">có thứ bị OOM giết</span><span class="lz-t">bộ đếm tăng</span><span class="lz-d"><code>oom_kill</code> của cgroup, hoặc <code>dmesg | grep -c oom</code> (8.1)</span></div>
<div class="lz-step"><span class="lz-k">TLS hết hạn sau &lt; 21 ngày</span><span class="lz-t">đếm ngược</span><span class="lz-d">việc gia hạn đã tự động hoá, mà tự động hoá thì hỏng ÂM THẦM</span></div>
<div class="lz-step"><span class="lz-k">tỷ lệ 5xx trên 1% suốt 5 phút</span><span class="lz-t">tỷ lệ</span><span class="lz-d">cái ngưỡng THẬT duy nhất, và nó cần cái cửa sổ</span></div>
</div>

<p>Năm cái báo động. Mọi thứ khác nằm trên một trang mà bạn nhìn vào KHI đã có thứ gì đó bảo bạn nhìn — và đó mới là vai trò thật của một bảng điều khiển.</p>

<div class="callout ok">
<p><strong>Cái bạn sẽ quên: KIỂM xem báo động có tới được bạn không.</strong> Một đường ống báo động là mã chạy HIẾM KHI, mà theo quy tắc của Chương 7 thì đó là mã có lẽ đang hỏng. Hãy tự gửi cho mình một cái báo động thử có chủ đích theo lịch — hằng tháng là đủ — và coi việc nó KHÔNG tới là một sự cố. Kiểu hỏng mà cái này bắt được thì âm thầm và toàn phần: một webhook hết hạn, một số điện thoại đã đổi, một máy chủ thư từ chối người gửi. Bạn phát hiện ra hoặc trong một lần thử, hoặc giữa lúc đang sập.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google SRE Book — Practical Alerting, và Being On-Call</span><span class="lc-sub">sre.google/sre-book/practical-alerting/ — lập luận rằng báo động nên dựa trên TRIỆU CHỨNG mà người dùng cảm thấy chứ không dựa trên nguyên nhân, và mô hình chi phí cho việc mệt mỏi vì báo động.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Prometheus — predict_linear</span><span class="lc-sub">prometheus.io/docs/prometheus/latest/querying/functions/#predict_linear — hàm dựng sẵn làm đúng phép ngoại suy ở trên, khớp trên một cửa sổ thay vì hai điểm; ví dụ kinh điển trong tài liệu của nó chính là dự đoán đầy đĩa.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">df(1) — cờ --output</span><span class="lc-sub">man 1 df — <code>--output=used,size,pcent</code> cho ra các cột phân tích được thay vì bảng dành cho người đọc, và đó là thứ làm script ở trên bền.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Rob Ewaschuk — My Philosophy on Alerting</span><span class="lc-sub">Tài liệu nội bộ của Google về sau thành chương báo động của cuốn SRE; quy tắc rằng mỗi cú gọi phải HÀNH ĐỘNG ĐƯỢC, MỚI MẺ và ĐÒI HỎI TRÍ TUỆ là phát biểu ngắn gọn hữu dụng nhất của ý tưởng này.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Linux &amp; Bash — cron, và viết một tác vụ biết báo hỏng</span><span class="lc-sub">/courses/linux-bash/learn${REF} — cron gửi output đi đâu, vì sao một cron job im lặng thường là một cron job hỏng, và làm sao bắt nó lên tiếng.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Checking from where the user stands|||9.5 — Kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG',
      slug: 'deploy-9-5-cua-truoc',
      type: 'VIDEO',
      description: 'Chốt kiểm sức khoẻ đi qua ĐÚNG con proxy, ĐÚNG cổng, ĐÚNG đường người dùng đi — và trả 200 trong khi trang chủ trả 502. Đo thật, và cách chữa không phải là một chốt kiểm sâu hơn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Checking from where the user stands</h2>
<p class="lead">Lesson 6.2 showed a health check returning 200 while every endpoint returned 500. This one is worse: the check goes through the real proxy, on the real port, down the path a real user takes — and still says everything is fine while the homepage is dead.</p>

<h3>The measurement</h3>
<p>An application on port 3361 answering everything correctly, behind nginx on 3360. The proxy has two location blocks, and one of them points at a port nobody is listening on:</p>

<pre><code>location /health { proxy_pass http://127.0.0.1:3361; }   <span class="tok-comment"># dung</span>
location /       { proxy_pass http://127.0.0.1:3399; }   <span class="tok-comment"># CONG SAI</span></code></pre>

<div class="out">=== kiem TU BEN TRONG (thang ung dung) ===
  127.0.0.1:3361/health   → 200
  127.0.0.1:3361/         → 200
=== kiem TU BEN NGOAI (qua nginx, dung duong nguoi dung di) ===
  127.0.0.1:3360/health   → 200
  127.0.0.1:3360/         → 502</div>

<div class="callout warn">
<p><strong>The health check is green, through the proxy, on the user-facing port.</strong> It is not a shallow-check problem — the application really is healthy, the proxy really is running, and that URL really does return 200. The homepage returns <strong>502</strong>. The check and the failure live in different location blocks, so no amount of checking harder on <code>/health</code> will ever find it.</p>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">app itself</span><span class="lz-t">200 on everything</span><span class="lz-d">nothing wrong here</span></div>
<div class="lz-step"><span class="lz-k">proxy /health</span><span class="lz-t">200</span><span class="lz-d">correct block, correct upstream</span></div>
<div class="lz-step"><span class="lz-k">proxy /</span><span class="lz-t">502</span><span class="lz-d">wrong upstream port — the site is down and nothing reports it</span></div>
</div>

<h3>What this class of failure actually is</h3>
<p>Everything between your process and your user can break independently of your process:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">a location block pointing at the wrong upstream</span><span class="lz-lnote">measured above — 502 for users, 200 for the check</span></div>
<div class="lz-layer"><span class="lz-lname">a TLS certificate that expired</span><span class="lz-lnote">an HTTP check on 127.0.0.1 never touches TLS and stays green through the whole outage</span></div>
<div class="lz-layer"><span class="lz-lname">DNS pointing at an old address</span><span class="lz-lnote">the server is perfect; nobody can find it</span></div>
<div class="lz-layer"><span class="lz-lname">a firewall rule closing 443</span><span class="lz-lnote">every local check passes; the port is unreachable from the internet</span></div>
<div class="lz-layer"><span class="lz-lname">a cache serving a rolled-back version</span><span class="lz-lnote">measured in 6.5: the app served v1, users got v3 for five minutes</span></div>
<div class="lz-layer"><span class="lz-lname">the machine losing its network</span><span class="lz-lnote">local monitoring is fine and cannot tell anybody</span></div>
</div>

<p>That last one is the argument in one line: <strong>a monitor on the machine it monitors cannot report the failures that matter most.</strong> When the server is unreachable, so is anything running on it.</p>

<h3>What an external check should ask for</h3>
<p>Not <code>/health</code>. The whole point is to exercise the path users take:</p>

<pre><code><span class="tok-comment"># kiem tu MOT MAY KHAC, dung ten mien that, va doi thu THAT SU co tren trang</span>
curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || echo "TRANG CHU HONG"

<span class="tok-comment"># kem: chung chi con bao nhieu ngay</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2>/dev/null \\
  | openssl x509 -noout -enddate</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">the real hostname</span><span class="v">exercises DNS, TLS, the firewall and the proxy — four things an <code>127.0.0.1</code> check cannot see</span></div>
<div class="kv"><span class="k">a real page</span><span class="v">not an endpoint that exists only to be probed. 9.5&#39;s failure lived in the block <code>/health</code> was not in</span></div>
<div class="kv"><span class="k">content, not status</span><span class="v">a 200 that renders an error page is still a 200. Grep for something only the working page contains</span></div>
<div class="kv"><span class="k">from elsewhere</span><span class="v">any other machine. A free uptime service, a cron on a laptop, another VPS — the requirement is only that it is not this one</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — checking content is what catches the failures that return 200.</strong> A single-page app whose JavaScript bundle 404s serves a perfectly valid 200 with an empty <code>&lt;div id="root"&gt;</code>. A backend returning <code>{"error":"database unavailable"}</code> with status 200 — which more frameworks do than you would like — is invisible to a status-code check. And Chapter 6&#39;s cache case returned 200 with the <em>wrong version</em>. In all three the status code is fine and the site is not, which is why the check has to look at the body.</p>
</div>

<h3>Two checks, and they are not interchangeable</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">internal</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the process supervisor</div><div class="lz-nsub">shallow <code>/health</code>, polled every few seconds, restarts the process. Must stay cheap and must not touch the database (6.2)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">external</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">the user-experience check</div><div class="lz-nsub">a real page over the real hostname, from another machine, checking content. Wakes a human, never restarts anything</div></div></div>
</div>
</div>

<p>They answer different questions, and confusing them produces both classic mistakes: a deep health check that gets the app killed during a database blip, and an external monitor so shallow it cannot see an outage.</p>

<h3>The cheapest version that works</h3>
<p>A free uptime service checking one URL every five minutes covers most of this list and costs nothing. If you would rather own it, the whole thing is a cron job on any other machine you have:</p>

<pre><code>*/5 * * * * /usr/bin/curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || /usr/local/bin/bao-dong "trang chu hong"</code></pre>

<p>The important property is not sophistication, it is <em>location</em>. A twelve-line shell script on a different machine detects an entire class of failure that a full observability stack on the same machine cannot.</p>

<div class="callout ok">
<p><strong>The rule this chapter and Chapter 6 both arrive at.</strong> Chapter 6 said a rollback is not done until the front door agrees. Chapter 9 says the same thing about health: <strong>every claim about whether the site works has to be verified from the address users type, checking something only a working page contains.</strong> Everything else — the process is up, the port is bound, <code>/health</code> is 200 — is a statement about your machine, not about your users.</p>
</div>

<h3>Sources</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_pass and location matching</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass — why one location block can be correct while another is not, which is the whole mechanism of the failure above.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --max-time, --fail and --resolve</span><span class="lc-sub">curl.se/docs/manpage.html — <code>--resolve</code> in particular lets you test a specific server by its real hostname before DNS points at it.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">openssl-s_client(1)</span><span class="lc-sub">docs.openssl.org/master/man1/openssl-s_client/ — the certificate-expiry check above, and <code>-servername</code> for SNI, without which you test the wrong virtual host.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness and startup probes</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ — the clearest published statement of why the restart check and the "is it working" check must be separate things.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — location matching order, and diagnosing a 502</span><span class="lc-sub">/courses/nginx/learn${REF} — which block a request actually lands in, and what the error log says when an upstream refuses the connection.</span></span></div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Kiểm từ CHỖ NGƯỜI DÙNG ĐỨNG</h2>
<p class="lead">Bài 6.2 cho thấy một chốt kiểm sức khoẻ trả 200 trong khi mọi endpoint trả 500. Bài này còn tệ hơn: phép kiểm đi qua ĐÚNG con proxy, trên ĐÚNG cổng, xuống ĐÚNG con đường một người dùng thật đi — và vẫn nói mọi thứ ổn trong khi trang chủ đã chết.</p>

<h3>Phép đo</h3>
<p>Một ứng dụng ở cổng 3361 trả lời mọi thứ đúng đắn, đứng sau nginx ở 3360. Con proxy có hai khối location, và một trong hai trỏ vào một cổng chẳng ai nghe:</p>

<pre><code>location /health { proxy_pass http://127.0.0.1:3361; }   <span class="tok-comment"># dung</span>
location /       { proxy_pass http://127.0.0.1:3399; }   <span class="tok-comment"># CONG SAI</span></code></pre>

<div class="out">=== kiem TU BEN TRONG (thang ung dung) ===
  127.0.0.1:3361/health   → 200
  127.0.0.1:3361/         → 200
=== kiem TU BEN NGOAI (qua nginx, dung duong nguoi dung di) ===
  127.0.0.1:3360/health   → 200
  127.0.0.1:3360/         → 502</div>

<div class="callout warn">
<p><strong>Chốt kiểm sức khoẻ XANH, đi qua proxy, trên cổng người dùng vào.</strong> Đây KHÔNG phải vấn đề kiểm-quá-nông — ứng dụng thật sự khoẻ, con proxy thật sự đang chạy, và cái URL đó thật sự trả 200. Trang chủ trả <strong>502</strong>. Phép kiểm và cú hỏng sống trong HAI khối location khác nhau, nên có kiểm <code>/health</code> gắt tới đâu cũng không bao giờ tìm ra.</p>
</div>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">bản thân ứng dụng</span><span class="lz-t">200 với mọi thứ</span><span class="lz-d">chỗ này chẳng sai gì</span></div>
<div class="lz-step"><span class="lz-k">proxy /health</span><span class="lz-t">200</span><span class="lz-d">đúng khối, đúng upstream</span></div>
<div class="lz-step"><span class="lz-k">proxy /</span><span class="lz-t">502</span><span class="lz-d">sai cổng upstream — website sập và chẳng gì báo cả</span></div>
</div>

<h3>Lớp hỏng này THẬT RA là gì</h3>
<p>Mọi thứ nằm giữa tiến trình của bạn và người dùng của bạn đều hỏng ĐỘC LẬP với tiến trình của bạn được:</p>

<div class="lz-stack">
<div class="lz-layer"><span class="lz-lname">một khối location trỏ sai upstream</span><span class="lz-lnote">đo ở trên — 502 cho người dùng, 200 cho phép kiểm</span></div>
<div class="lz-layer"><span class="lz-lname">một chứng chỉ TLS hết hạn</span><span class="lz-lnote">một phép kiểm HTTP trên 127.0.0.1 chẳng đụng tới TLS và giữ màu xanh suốt cả cú sập</span></div>
<div class="lz-layer"><span class="lz-lname">DNS trỏ vào một địa chỉ cũ</span><span class="lz-lnote">máy chủ hoàn hảo; chẳng ai tìm thấy nó</span></div>
<div class="lz-layer"><span class="lz-lname">một luật tường lửa đóng cổng 443</span><span class="lz-lnote">mọi phép kiểm cục bộ đều đạt; cái cổng không với tới được từ internet</span></div>
<div class="lz-layer"><span class="lz-lname">một bộ đệm phục vụ bản đã lùi</span><span class="lz-lnote">đo ở 6.5: ứng dụng phục vụ v1, người dùng nhận v3 suốt năm phút</span></div>
<div class="lz-layer"><span class="lz-lname">cái máy MẤT MẠNG</span><span class="lz-lnote">hệ giám sát cục bộ vẫn ổn và không nói được cho ai</span></div>
</div>

<p>Cái cuối cùng là lập luận gói trong một dòng: <strong>một hệ giám sát nằm trên chính cái máy nó giám sát thì KHÔNG báo được những cú hỏng quan trọng nhất.</strong> Khi máy chủ không với tới được, thì mọi thứ chạy trên nó cũng thế.</p>

<h3>Một phép kiểm từ bên ngoài nên HỎI cái gì</h3>
<p>Không phải <code>/health</code>. Toàn bộ ý nghĩa của nó là đi qua con đường NGƯỜI DÙNG đi:</p>

<pre><code><span class="tok-comment"># kiem tu MOT MAY KHAC, dung ten mien that, va doi thu THAT SU co tren trang</span>
curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || echo "TRANG CHU HONG"

<span class="tok-comment"># kem: chung chi con bao nhieu ngay</span>
echo | openssl s_client -connect vidu.com:443 -servername vidu.com 2>/dev/null \\
  | openssl x509 -noout -enddate</code></pre>

<div class="kv-grid">
<div class="kv"><span class="k">đúng tên miền thật</span><span class="v">đi qua DNS, TLS, tường lửa và proxy — bốn thứ mà một phép kiểm <code>127.0.0.1</code> không thấy được</span></div>
<div class="kv"><span class="k">một trang THẬT</span><span class="v">không phải một endpoint tồn tại chỉ để bị thăm dò. Cú hỏng của 9.5 sống trong đúng cái khối mà <code>/health</code> KHÔNG ở trong</span></div>
<div class="kv"><span class="k">NỘI DUNG, không phải mã trạng thái</span><span class="v">một cái 200 hiển thị ra trang lỗi thì vẫn là 200. Hãy grep một thứ chỉ trang chạy được mới có</span></div>
<div class="kv"><span class="k">từ NƠI KHÁC</span><span class="v">bất kỳ máy nào khác. Một dịch vụ theo dõi miễn phí, một cron trên laptop, một VPS khác — yêu cầu duy nhất là nó KHÔNG phải cái máy này</span></div>
</div>

<div class="pitfall">
<p><strong>Bẫy — kiểm NỘI DUNG mới là thứ bắt được những cú hỏng trả về 200.</strong> Một ứng dụng một-trang mà gói JavaScript của nó 404 sẽ phục vụ một cái 200 hoàn toàn hợp lệ với một <code>&lt;div id="root"&gt;</code> rỗng. Một backend trả <code>{"error":"database unavailable"}</code> kèm mã 200 — mà nhiều framework làm thế hơn bạn muốn — thì vô hình với một phép kiểm mã trạng thái. Và ca bộ đệm ở Chương 6 trả 200 với <em>SAI PHIÊN BẢN</em>. Cả ba ca đều có mã trạng thái ổn còn website thì không, và đó là lý do phép kiểm phải nhìn vào PHẦN THÂN.</p>
</div>

<h3>Hai phép kiểm, và chúng KHÔNG thay thế nhau được</h3>
<div class="lz-map">
<div class="lz-stage">
<span class="lz-badge">bên trong</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">bộ giám sát tiến trình</div><div class="lz-nsub"><code>/health</code> NÔNG, thăm dò vài giây một lần, khởi động lại tiến trình. Phải RẺ và KHÔNG được đụng tới cơ sở dữ liệu (6.2)</div></div></div>
</div>
<div class="lz-stage">
<span class="lz-badge">bên ngoài</span>
<div class="lz-node"><div class="lz-nbody"><div class="lz-ntitle">phép kiểm trải nghiệm người dùng</div><div class="lz-nsub">một trang THẬT qua tên miền THẬT, từ một máy khác, kiểm NỘI DUNG. Đánh thức một con người, không bao giờ khởi động lại thứ gì</div></div></div>
</div>
</div>

<p>Chúng trả lời hai câu hỏi khác nhau, và lẫn lộn chúng đẻ ra cả hai lỗi kinh điển: một chốt kiểm sức khoẻ SÂU làm ứng dụng bị giết trong một cú nấc của cơ sở dữ liệu, và một hệ theo dõi bên ngoài NÔNG tới mức không thấy được một cú sập.</p>

<h3>Bản rẻ nhất mà vẫn chạy</h3>
<p>Một dịch vụ theo dõi miễn phí kiểm một URL mỗi năm phút bao được phần lớn danh sách trên và tốn không đồng nào. Nếu bạn muốn tự sở hữu, thì toàn bộ chuyện đó là một cron job trên bất kỳ cái máy nào khác mà bạn có:</p>

<pre><code>*/5 * * * * /usr/bin/curl -sS --max-time 10 https://vidu.com/ \\
  | grep -q 'id="trang-chu"' || /usr/local/bin/bao-dong "trang chu hong"</code></pre>

<p>Tính chất quan trọng không phải sự tinh vi, mà là <em>VỊ TRÍ</em>. Một script shell mười hai dòng trên một cái máy KHÁC phát hiện được cả một lớp hỏng mà một hệ quan sát đầy đủ trên CÙNG cái máy thì không.</p>

<div class="callout ok">
<p><strong>Quy tắc mà chương này và Chương 6 cùng đi tới.</strong> Chương 6 nói một cú lùi chưa xong cho tới khi CỬA TRƯỚC đồng ý. Chương 9 nói y hệt thế về sức khoẻ: <strong>mọi lời khẳng định về việc website có chạy hay không đều phải được kiểm chứng từ cái địa chỉ người dùng GÕ VÀO, kiểm một thứ mà chỉ trang chạy được mới có.</strong> Mọi thứ khác — tiến trình đang sống, cổng đã gắn, <code>/health</code> trả 200 — là một phát biểu về CÁI MÁY của bạn, không phải về NGƯỜI DÙNG của bạn.</p>
</div>

<h3>Nguồn</h3>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">nginx — proxy_pass và cách khớp location</span><span class="lc-sub">nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass — vì sao một khối location có thể đúng trong khi khối kia thì không, mà đó là toàn bộ cơ chế của cú hỏng ở trên.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">curl(1) — --max-time, --fail và --resolve</span><span class="lc-sub">curl.se/docs/manpage.html — riêng <code>--resolve</code> cho phép bạn kiểm một máy chủ cụ thể bằng tên miền THẬT của nó trước khi DNS trỏ vào đó.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">openssl-s_client(1)</span><span class="lc-sub">docs.openssl.org/master/man1/openssl-s_client/ — phép kiểm hạn chứng chỉ ở trên, và <code>-servername</code> cho SNI, thiếu nó là bạn kiểm nhầm máy chủ ảo.</span></span></div>
<div class="link-card"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Kubernetes — liveness, readiness và startup probe</span><span class="lc-sub">kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ — phát biểu công bố rõ nhất về việc vì sao phép kiểm-để-khởi-động-lại và phép kiểm "nó có chạy không" phải là HAI thứ tách biệt.</span></span></div>
<div class="link-card codelab"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Nginx — thứ tự khớp location, và chẩn đoán một cú 502</span><span class="lc-sub">/courses/nginx/learn${REF} — một request thật ra rơi vào khối nào, và log lỗi nói gì khi một upstream từ chối kết nối.</span></span></div>
</div>
`,
    },

    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: '9.6 — Quiz: monitoring|||9.6 — Quiz: giám sát',
      slug: 'deploy-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về một con số trễ 60 giây, một con số đúng mà mô tả không ai cả, một câu trả lời nhanh mà sai, mười chín giờ chênh giữa hai kiểu báo động, và một chốt kiểm xanh trong khi trang chủ trả 502.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Quiz: monitoring</h2>
<p class="lead">Eight questions from the chapter where three separate numbers are all correct and all misleading.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> With four cores pinned at 100% from t=0, CPU computed from <code>/proc/stat</code> read 100% immediately while the one-minute load average was still <strong>0.10</strong>, and after a full minute had reached only 2.62 against a true 4.00 — because load average is a moving average and describes the past (9.1). Reading <code>/proc</code> in-process cost 0.008–0.016 ms against 1.6 ms via <code>cat</code>, 120× more, essentially all <code>fork</code>. Over 200 real requests the mean was 60.8 ms while p50 was 14.8 and p95 was 900.8 — a 45× cliff between p90 and p95 that the mean hid completely, and percentiles cannot be averaged across servers (9.2). Asking 200,000 log lines which URIs returned 5xx slower than two seconds took 82 ms on the plain format and returned the <em>wrong</em> answer, because <code>combined</code> has no duration field; JSON took 538 ms and answered correctly, at 6% more disk before compression and 12–15× less after (9.3). A threshold alarm at 90% fired at hour 36 with five hours left; a trend alarm on identical data fired at hour 17 with twenty-four — nineteen hours apart (9.4). And a health check through the real proxy on the real port returned 200 while the homepage returned <strong>502</strong>, because the check and the failure were in different location blocks (9.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Quiz: giám sát</h2>
<p class="lead">Tám câu ra từ cái chương mà ba con số riêng biệt đều ĐÚNG và đều gây hiểu lầm.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Với bốn nhân bị ghim 100% từ t=0, CPU tính từ <code>/proc/stat</code> đọc ra 100% NGAY trong khi load average một phút vẫn là <strong>0,10</strong>, và sau trọn một phút mới bò tới 2,62 so với giá trị thật 4,00 — vì load average là một trung bình động và nó mô tả QUÁ KHỨ (9.1). Đọc <code>/proc</code> ngay trong tiến trình tốn 0,008–0,016 ms so với 1,6 ms qua <code>cat</code>, gấp 120 lần, mà gần như toàn bộ phần chênh là <code>fork</code>. Trên 200 request thật, trung bình là 60,8 ms trong khi p50 là 14,8 và p95 là 900,8 — một cái vách gấp 45 lần giữa p90 và p95 mà trung bình giấu đi hoàn toàn, và phân vị thì KHÔNG lấy trung bình qua các máy chủ được (9.2). Hỏi 200.000 dòng log xem URI nào trả 5xx chậm hơn hai giây mất 82 ms trên định dạng thuần và trả về câu trả lời <em>SAI</em>, vì <code>combined</code> không có trường thời lượng; JSON mất 538 ms và trả lời ĐÚNG, với 6% đĩa nhiều hơn trước khi nén và 12–15 lần ít hơn sau khi nén (9.3). Một báo động ngưỡng ở 90% nổ ở giờ 36 với năm giờ còn lại; một báo động xu hướng trên CÙNG dữ liệu nổ ở giờ 17 với hai mươi bốn giờ — cách nhau mười chín giờ (9.4). Và một chốt kiểm sức khoẻ đi qua ĐÚNG proxy trên ĐÚNG cổng trả 200 trong khi trang chủ trả <strong>502</strong>, vì phép kiểm và cú hỏng nằm ở hai khối location khác nhau (9.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Four cores were pinned at 100% from t=0, yet the one-minute load average read 0.10 and reached only 2.62 after sixty seconds. Why?|||Bốn nhân bị ghim 100% từ t=0, vậy mà load average một phút đọc ra 0,10 và sau sáu mươi giây mới tới 2,62. Vì sao?',
            options: [
              'The measurement was wrong|||Phép đo bị sai',
              'Load average is an exponentially-weighted moving average over 1/5/15 minutes — by construction it describes the past, so it is useless for detecting an incident in progress|||Load average là một trung bình động có trọng số mũ trên 1/5/15 phút — theo cấu tạo nó mô tả QUÁ KHỨ, nên vô dụng cho việc phát hiện một sự cố đang diễn ra',
              'Load average only counts one core|||Load average chỉ đếm một nhân',
              'The kernel updates it once per minute|||Nhân chỉ cập nhật nó mỗi phút một lần',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'What must you do to get a meaningful CPU percentage from /proc/stat?|||Bạn phải làm gì để lấy được một tỷ lệ CPU có nghĩa từ /proc/stat?',
            options: [
              'Read it once and divide by the number of cores|||Đọc một lần rồi chia cho số nhân',
              'Take two readings, subtract, and compute 100*(delta total - delta idle)/delta total — the values are cumulative counters since boot|||Lấy HAI lần đọc, trừ đi, rồi tính 100*(delta tổng - delta idle)/delta tổng — các giá trị là bộ đếm CỘNG DỒN từ lúc khởi động',
              'Multiply the first field by CLK_TCK|||Nhân trường đầu tiên với CLK_TCK',
              'Read /proc/loadavg instead|||Đọc /proc/loadavg thay thế',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'The mean latency was 60.8 ms, p50 was 14.8 ms and p95 was 900.8 ms. What does the 45x jump between p90 and p95 indicate?|||Độ trễ trung bình là 60,8 ms, p50 là 14,8 ms và p95 là 900,8 ms. Cú nhảy gấp 45 lần giữa p90 và p95 chỉ ra điều gì?',
            options: [
              'Measurement noise|||Nhiễu trong phép đo',
              'A bimodal distribution — two different code paths, not one path with variance; the mean sits in the gap and describes neither|||Một phân bố HAI ĐỈNH — hai đường mã khác nhau, chứ không phải một đường có độ tản; trung bình ngồi trong khe giữa và không mô tả đám nào',
              'The server was overloaded|||Máy chủ bị quá tải',
              'p95 is always much higher than p90|||p95 lúc nào cũng cao hơn p90 rất nhiều',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Why can you not average p95 across two servers?|||Vì sao bạn KHÔNG lấy trung bình p95 của hai máy chủ được?',
            options: [
              'You can, as long as they have equal traffic|||Được, miễn là chúng có lưu lượng bằng nhau',
              'A percentile is a property of a distribution, not a quantity you can arithmetically combine — the average of two p95 values corresponds to no percentile of the combined data|||Một phân vị là TÍNH CHẤT của một phân bố, không phải một đại lượng gộp lại được bằng số học — trung bình của hai giá trị p95 không tương ứng với phân vị nào của dữ liệu gộp',
              'Because they are measured at different times|||Vì chúng được đo ở những thời điểm khác nhau',
              'Because p95 is already an average|||Vì p95 vốn đã là một giá trị trung bình',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'Querying the plain log took 82 ms and the JSON log took 538 ms for the same question. Which is the better format here?|||Truy vấn log thuần mất 82 ms còn log JSON mất 538 ms cho cùng một câu hỏi. Định dạng nào tốt hơn ở đây?',
            options: [
              'Plain, because it is six times faster|||Thuần, vì nó nhanh hơn sáu lần',
              'JSON, because the plain format has no duration field so its fast answer was simply wrong — the question was unanswerable from that file at any speed|||JSON, vì định dạng thuần KHÔNG có trường thời lượng nên câu trả lời nhanh của nó đơn giản là SAI — câu hỏi đó không trả lời được từ tệp ấy dù với tốc độ nào',
              'Neither; both are unsuitable|||Không cái nào; cả hai đều không phù hợp',
              'Plain, because JSON uses far more disk|||Thuần, vì JSON tốn đĩa hơn nhiều',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A threshold alarm at 90% fired at hour 36; a trend alarm on identical data fired at hour 17. Why does that matter beyond the raw hours?|||Báo động ngưỡng 90% nổ ở giờ 36; báo động xu hướng trên cùng dữ liệu nổ ở giờ 17. Vì sao chuyện đó quan trọng ngoài số giờ thô?',
            options: [
              'It does not; both fire before the disk is full|||Không quan trọng; cả hai đều nổ trước khi đĩa đầy',
              'The threshold gives five hours at whatever hour it happens to land — including 03:00 — while the trend warns a full day ahead, while the fix is unhurried|||Cái ngưỡng cho bạn năm giờ vào bất cứ giờ nào nó rơi trúng — kể cả 3 giờ sáng — còn xu hướng cảnh báo trước trọn một ngày, lúc cách chữa còn thong thả',
              'Trend alarms are more accurate|||Báo động xu hướng chính xác hơn',
              'Threshold alarms cannot be automated|||Báo động ngưỡng không tự động hoá được',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'What is the main risk of a trend alarm, and how do you reduce it?|||Rủi ro chính của một báo động xu hướng là gì, và bạn giảm nó bằng cách nào?',
            options: [
              'It is too slow; sample more often|||Nó quá chậm; hãy lấy mẫu dày hơn',
              'Real usage is noisy, so extrapolating from two points fires constantly — fit over several hours, require the prediction to hold twice, and never alert on a shrinking series|||Mức dùng thật thì NHIỄU, nên ngoại suy từ hai điểm sẽ nổ liên tục — hãy khớp trên vài giờ, đòi dự đoán phải giữ nguyên qua hai lần, và đừng bao giờ báo động trên một chuỗi đang giảm',
              'It needs a metrics database|||Nó cần một cơ sở dữ liệu số đo',
              'It cannot detect sudden growth|||Nó không phát hiện được tăng trưởng đột ngột',
            ],
            correctIndex: 1,
            points: 15,
          },
          {
            question: 'A health check through the real proxy on the real port returned 200 while the homepage returned 502. What does that prove about health checks?|||Một chốt kiểm sức khoẻ đi qua đúng proxy trên đúng cổng trả 200 trong khi trang chủ trả 502. Điều đó chứng minh gì về các chốt kiểm sức khoẻ?',
            options: [
              'The check needed to be deeper|||Phép kiểm cần SÂU hơn',
              'A check only proves the exact path it exercises works; the failure lived in a different location block, so the check must request a real page and inspect its content, from another machine|||Một phép kiểm chỉ chứng minh ĐÚNG cái đường nó đi qua là chạy được; cú hỏng sống trong một khối location KHÁC, nên phép kiểm phải xin một TRANG THẬT và soi NỘI DUNG của nó, từ một cái máy khác',
              'nginx was misconfigured, which monitoring cannot help with|||nginx bị cấu hình sai, mà giám sát thì không giúp gì được',
              'The application should return 502 on /health too|||Ứng dụng lẽ ra cũng nên trả 502 ở /health',
            ],
            correctIndex: 1,
            points: 10,
          },
        ],
      },
    },
  ],
};
