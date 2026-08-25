/**
 * Redis — Chương 11: Mở rộng — nhân bản, Sentinel và Cluster.
 * Nhân bản chạy ra sao · nó cho và không cho gì · Sentinel · Cluster · chọn kiến trúc · quiz.
 * Output CHẠY THẬT Redis 7.4 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fredis%2Flearn&reflabel=Redis';

export default {
  title: 'Chapter 11 — Scaling: replication, Sentinel and Cluster|||Chương 11 — Mở rộng: nhân bản, Sentinel và Cluster',
  description: 'Một máy Redis xử lý được nhiều hơn phần lớn người ta tưởng, nhưng nó vẫn là một điểm hỏng đơn lẻ và vẫn bị chặn bởi RAM của một cái máy. Chương này đi qua nhân bản, chuyển đổi tự động bằng Sentinel, chia mảnh bằng Cluster — và giúp bạn chọn cái nào, vì cả ba đều thêm những kiểu hỏng mới.',
  lessons: [
    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Replication: how a replica catches up and stays up|||11.1 — Nhân bản: bản sao đuổi kịp và bám theo ra sao',
      slug: 'rd-11-1-nhan-ban',
      type: 'LESSON',
      isFreePreview: true,
      description: 'REPLICAOF và cú fork nó gây ra, đồng bộ đầy đủ với đồng bộ một phần cùng bộ đệm nhân bản, replication ID và offset, đồng bộ không qua đĩa, nhân bản dây chuyền, và các dòng của INFO replication cần đọc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Replication: how a replica catches up and stays up</h2>
<p class="lead">A Redis replica is a second server that holds a copy of the primary's data and applies every write the primary applies. Setting one up is a single command. Understanding what happens in the seconds after that command — and what happens when the link breaks — is what separates a replica that helps from a replica that causes an outage.</p>

<h3>Making one</h3>
<pre><code><span class="tok-comment"># On the replica</span>
redis-cli -p 6380 REPLICAOF 127.0.0.1 6379
redis-cli -p 6380 INFO replication
<span class="tok-comment"># On the primary</span>
redis-cli -p 6379 INFO replication | head -8
redis-cli -p 6379 SET k hello
redis-cli -p 6380 GET k
redis-cli -p 6380 SET k other</code></pre>
<div class="out">OK
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_read_repl_offset:1204
slave_repl_offset:1204
slave_priority:100
slave_read_only:1
# Replication
role:master
connected_slaves:1
slave0:ip=127.0.0.1,port=6380,state=online,offset=1204,lag=0
master_failover_state:no-failover
master_replid:8f2a1c04b9e7d3f6a5c8b2e1d9b0a4c7b3e6d1f2
master_repl_offset:1204
second_repl_offset:-1
OK
"hello"
(error) READONLY You can't write against a read only replica.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>REPLICAOF</code> takes effect immediately</span><span class="v">No restart, no coordination. <code>REPLICAOF NO ONE</code> promotes a replica back to a primary, keeping its current data. Both are runtime commands, which is exactly why <code>@dangerous</code> must be removed from application users (Lesson 10.3).</span></div>
  <div class="kv"><span class="k">Replicas are read-only by default</span><span class="v"><code>replica-read-only yes</code>. You can turn it off, and you almost never should: writes to a replica are local only, invisible to the primary, and silently destroyed by the next resync.</span></div>
  <div class="kv"><span class="k"><code>master_link_status:up</code> is the health line</span><span class="v">It reads <code>down</code> while syncing or disconnected. Together with <code>master_last_io_seconds_ago</code> it is what you alert on — a link that has been down for thirty seconds is a replica serving increasingly old data.</span></div>
  <div class="kv"><span class="k">The offset is the position in the stream</span><span class="v"><code>master_repl_offset</code> on the primary and <code>slave_repl_offset</code> on the replica. Their difference is the lag in <em>bytes</em>, which is the most direct measure of how far behind a replica is.</span></div>
  <div class="kv"><span class="k">Put the credentials on the replica</span><span class="v">If the primary requires auth, the replica needs <code>masterauth</code> and, with ACLs, <code>masteruser</code>. A replica that cannot authenticate retries forever with <code>master_link_status:down</code> and a log line nobody reads.</span></div>
</div>

<h3>Full sync: what those first seconds cost</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · The replica asks with PSYNC</span><span class="lz-t">and offers a replication ID it has, if any</span><span class="lz-d">If the primary recognises the ID and still has the missing bytes, it answers with a <em>partial</em> resync and sends only the gap. Otherwise it answers <code>FULLRESYNC</code> and everything below happens.</span></div>
  <div class="lz-step"><span class="lz-k">2 · The primary forks and produces an RDB</span><span class="lz-t">the same fork as a BGSAVE (Lesson 9.3)</span><span class="lz-d">With the same copy-on-write memory spike, on the primary, while it is serving traffic. This is why "just add a replica" is not free, and why the first sync of a large instance is a capacity event, not a configuration change.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Writes buffer while the transfer runs</span><span class="lz-t">in the replica's client output buffer</span><span class="lz-d">Everything the primary accepts during the transfer is queued for that replica. On a write-heavy instance with a slow link, this buffer grows — and <code>client-output-buffer-limit replica 256mb 64mb 60</code> will disconnect the replica when it exceeds the limit, restarting the whole sync from step 1.</span></div>
  <div class="lz-step"><span class="lz-k">4 · The replica loads and starts streaming</span><span class="lz-t">and is unavailable while loading</span><span class="lz-d">By default it flushes its old data and loads the RDB, answering <code>-LOADING</code> throughout. <code>repl-diskless-load swapdb</code> keeps the old dataset in memory as a fallback so a failed sync does not leave an empty replica — at the cost of holding two datasets at once.</span></div>
</div>
<pre><code>redis-cli CONFIG GET repl-diskless-sync repl-diskless-sync-delay repl-diskless-load
redis-cli CONFIG GET client-output-buffer-limit | tail -1
redis-cli INFO stats | grep -E "sync_full|sync_partial_ok|sync_partial_err"
redis-cli INFO replication | grep -E "master_repl_offset|repl_backlog_size|repl_backlog_histlen"</code></pre>
<div class="out">1) "repl-diskless-sync"
2) "yes"
3) "repl-diskless-sync-delay"
4) "5"
5) "repl-diskless-load"
6) "disabled"
normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60
sync_full:3
sync_partial_ok:41
sync_partial_err:0
master_repl_offset:184203912
repl_backlog_size:1048576
repl_backlog_histlen:1048576</div>
<div class="callout warn"><strong><code>repl_backlog_size</code> is 1 MB by default, and that number decides whether a reconnect is cheap or catastrophic.</strong> The backlog is a ring buffer of recent writes kept for exactly this purpose: when a replica reconnects, the primary checks whether the bytes it missed are still in there. If they are, it is a partial resync of a few hundred kilobytes. If they are not — because the replica was gone for twenty seconds and you write 1 MB per second — it is a full resync, with the fork and the transfer and the loading. So on a write-heavy instance, 1 MB of backlog covers about one second of disconnection. Raise <code>repl-backlog-size</code> to cover your realistic worst reconnect (64 MB is a common choice), watch <code>sync_full</code> versus <code>sync_partial_ok</code>, and treat a rising <code>sync_full</code> as the alert it is.</div>

<h3>Diskless, chained, and the tuning that matters</h3>
<pre><code><span class="tok-comment"># Diskless sync: stream the RDB straight to the socket, never touching disk</span>
redis-cli CONFIG SET repl-diskless-sync yes
redis-cli CONFIG SET repl-diskless-sync-delay 5

<span class="tok-comment"># A replica of a replica — the primary forks once for the whole chain</span>
redis-cli -p 6381 REPLICAOF 127.0.0.1 6380
redis-cli -p 6380 INFO replication | grep -E "role|connected_slaves|slave0"

<span class="tok-comment"># A bigger backlog, and how long it survives with no replicas attached</span>
redis-cli CONFIG SET repl-backlog-size 64mb
redis-cli CONFIG GET repl-backlog-ttl repl-ping-replica-period</code></pre>
<div class="out">OK
OK
OK
role:slave
connected_slaves:1
slave0:ip=127.0.0.1,port=6381,state=online,offset=1204,lag=0
OK
1) "repl-backlog-ttl"
2) "3600"
3) "repl-ping-replica-period"
4) "10"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Diskless is the default since 7.0</span><span class="v">The forked child writes the RDB directly into the replica's socket instead of to a file. Faster, and essential when the primary's disk is slow or nearly full — a full sync no longer needs room for a whole extra copy of the dataset.</span></div>
  <div class="kv"><span class="k"><code>repl-diskless-sync-delay 5</code> batches replicas</span><span class="v">Redis waits five seconds before starting a diskless sync, so several replicas connecting together share one fork and one stream. If you are restarting a fleet, that delay is the difference between one fork and six.</span></div>
  <div class="kv"><span class="k">Chained replication moves the cost</span><span class="v">A replica can have its own replicas. The primary forks once for the top of the chain, and the sub-replicas sync from the middle node. Useful for many read replicas or for a cross-region hop — at the price of latency stacking down the chain.</span></div>
  <div class="kv"><span class="k">A replica syncing is a replica not serving</span><span class="v">And a chained sub-replica also stops serving when <em>its</em> upstream resyncs. In a chain, one full sync at the top cascades downward.</span></div>
  <div class="kv"><span class="k">Backups belong on a replica</span><span class="v">Point <code>BGSAVE</code> at a replica and the primary never forks for backups at all (Lesson 9.5). This is the single best reason to run a replica even when you do not need failover.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> adding a replica to a nearly-full primary and taking the primary down with it. Every step of a full sync costs the primary something: the fork adds transient copy-on-write memory (Lesson 9.3), the replica's output buffer holds every write made during the transfer, and on a 20 GB dataset over a slow link that buffer can reach gigabytes — all of it counted against <code>maxmemory</code> (Lesson 9.1). On an instance already at 85% memory, attaching a replica at peak traffic is how you discover this. Three habits avoid it. <strong>Attach replicas during a quiet period</strong>, so the write buffer stays small and the fork's copy-on-write cost is low. <strong>Check the headroom first</strong> — you want room for the fork plus the transfer buffer, which is why 60–70% of machine RAM is the sizing rule. <strong>And watch <code>sync_full</code> after it settles:</strong> a replica that resyncs fully more than once is telling you the backlog is too small or the output buffer limit is too tight, and each of those resyncs is repeating the whole cost.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/replication/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis replication</span><span class="lc-sub">The full mechanism: PSYNC, replication IDs, the backlog, diskless sync and load, chained replicas, and the configuration for each. The definitive page.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/replicaof/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">REPLICAOF</span><span class="lc-sub">What happens on the replica when you issue it, how <code>NO ONE</code> promotes without losing data, and why the command is in the <code>@dangerous</code> category.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build a replica</span><span class="lc-sub">Graded exercises: set up replication and measure the offset lag, force a full resync and watch the fork cost, size the backlog from a write rate, and read <code>INFO replication</code> on both sides.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> <code>REPLICAOF</code> is one runtime command, but the first sync forks the primary exactly like a <code>BGSAVE</code> and buffers every write made during the transfer — so attaching a replica to a nearly-full primary at peak traffic is a capacity event, not a configuration change. The replication backlog is 1 MB by default, which covers about one second of disconnection on a busy instance: raise it, and watch <code>sync_full</code> against <code>sync_partial_ok</code> to know whether reconnects are cheap. And the best reason to run a replica even without failover is that backups can fork there instead of on the primary.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Nhân bản: bản sao đuổi kịp và bám theo ra sao</h2>
<p class="lead">Một bản sao Redis là một máy chủ thứ hai giữ bản sao dữ liệu của bản chính và áp dụng mọi lượt ghi mà bản chính áp dụng. Dựng một cái chỉ tốn đúng một lệnh. Hiểu chuyện gì xảy ra trong mấy giây sau lệnh đó — và chuyện gì xảy ra khi đường liên kết đứt — mới là thứ phân biệt một bản sao có ích với một bản sao gây ra sự cố.</p>

<h3>Tạo một cái</h3>
<pre><code><span class="tok-comment"># Trên bản sao</span>
redis-cli -p 6380 REPLICAOF 127.0.0.1 6379
redis-cli -p 6380 INFO replication
<span class="tok-comment"># Trên bản chính</span>
redis-cli -p 6379 INFO replication | head -8
redis-cli -p 6379 SET k hello
redis-cli -p 6380 GET k
redis-cli -p 6380 SET k other</code></pre>
<div class="out">OK
# Replication
role:slave
master_host:127.0.0.1
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_read_repl_offset:1204
slave_repl_offset:1204
slave_priority:100
slave_read_only:1
# Replication
role:master
connected_slaves:1
slave0:ip=127.0.0.1,port=6380,state=online,offset=1204,lag=0
master_failover_state:no-failover
master_replid:8f2a1c04b9e7d3f6a5c8b2e1d9b0a4c7b3e6d1f2
master_repl_offset:1204
second_repl_offset:-1
OK
"hello"
(error) READONLY You can't write against a read only replica.</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>REPLICAOF</code> có hiệu lực ngay lập tức</span><span class="v">Không khởi động lại, không phối hợp gì. <code>REPLICAOF NO ONE</code> thăng một bản sao trở lại thành bản chính, giữ nguyên dữ liệu hiện tại của nó. Cả hai đều là lệnh chạy lúc đang chạy, và đó chính là lý do phải gỡ <code>@dangerous</code> khỏi những người dùng ứng dụng (Bài 10.3).</span></div>
  <div class="kv"><span class="k">Bản sao mặc định là chỉ đọc</span><span class="v"><code>replica-read-only yes</code>. Bạn tắt được, và gần như không bao giờ nên tắt: các lượt ghi vào một bản sao chỉ có ở tại chỗ, bản chính không thấy, và bị lần đồng bộ lại kế tiếp âm thầm phá huỷ.</span></div>
  <div class="kv"><span class="k"><code>master_link_status:up</code> là dòng báo sức khoẻ</span><span class="v">Nó ghi <code>down</code> trong lúc đang đồng bộ hoặc đang mất kết nối. Cùng với <code>master_last_io_seconds_ago</code>, đó là thứ bạn đặt cảnh báo — một đường liên kết đã đứt ba mươi giây là một bản sao đang phục vụ dữ liệu ngày càng cũ.</span></div>
  <div class="kv"><span class="k">Offset là vị trí trong dòng chảy</span><span class="v"><code>master_repl_offset</code> trên bản chính và <code>slave_repl_offset</code> trên bản sao. Hiệu của chúng là độ trễ tính bằng <em>byte</em>, và đó là phép đo trực tiếp nhất cho biết một bản sao đang tụt lại bao xa.</span></div>
  <div class="kv"><span class="k">Hãy đặt thông tin xác thực trên bản sao</span><span class="v">Nếu bản chính đòi xác thực thì bản sao cần <code>masterauth</code> và, khi có ACL, cần cả <code>masteruser</code>. Một bản sao không xác thực được sẽ thử lại mãi mãi với <code>master_link_status:down</code> và một dòng nhật ký không ai đọc.</span></div>
</div>

<h3>Đồng bộ đầy đủ: mấy giây đầu ấy tốn gì</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bản sao xin bằng PSYNC</span><span class="lz-t">và chìa ra một replication ID nó đang có, nếu có</span><span class="lz-d">Nếu bản chính nhận ra cái ID đó và vẫn còn giữ những byte còn thiếu thì nó trả lời bằng một lần đồng bộ <em>một phần</em> và chỉ gửi phần thiếu. Nếu không thì nó trả lời <code>FULLRESYNC</code> và mọi thứ bên dưới xảy ra.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Bản chính fork và tạo ra một tệp RDB</span><span class="lz-t">đúng cú fork của một lệnh BGSAVE (Bài 9.3)</span><span class="lz-d">Với đúng đợt vọt bộ nhớ sao-chép-khi-ghi ấy, trên bản chính, trong lúc nó đang phục vụ lưu lượng. Đó là lý do "cứ thêm một bản sao" không miễn phí, và là lý do lần đồng bộ đầu tiên của một máy lớn là một sự kiện về dung lượng chứ không phải một thay đổi cấu hình.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Các lượt ghi được đệm lại trong lúc truyền</span><span class="lz-t">trong bộ đệm đầu ra dành cho bản sao</span><span class="lz-d">Mọi thứ bản chính nhận trong lúc truyền đều xếp hàng chờ cho bản sao đó. Trên một máy nặng ghi với đường truyền chậm, cái bộ đệm ấy phình lên — và <code>client-output-buffer-limit replica 256mb 64mb 60</code> sẽ ngắt bản sao khi nó vượt trần, khiến cả lần đồng bộ bắt đầu lại từ bước 1.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Bản sao nạp vào rồi bắt đầu nhận dòng chảy</span><span class="lz-t">và nó không phục vụ được trong lúc nạp</span><span class="lz-d">Mặc định nó xoá dữ liệu cũ rồi nạp tệp RDB, trả lời <code>-LOADING</code> suốt thời gian đó. <code>repl-diskless-load swapdb</code> giữ tập dữ liệu cũ trong bộ nhớ làm phương án dự phòng để một lần đồng bộ thất bại không để lại một bản sao rỗng — với cái giá là ôm hai tập dữ liệu cùng lúc.</span></div>
</div>
<pre><code>redis-cli CONFIG GET repl-diskless-sync repl-diskless-sync-delay repl-diskless-load
redis-cli CONFIG GET client-output-buffer-limit | tail -1
redis-cli INFO stats | grep -E "sync_full|sync_partial_ok|sync_partial_err"
redis-cli INFO replication | grep -E "master_repl_offset|repl_backlog_size|repl_backlog_histlen"</code></pre>
<div class="out">1) "repl-diskless-sync"
2) "yes"
3) "repl-diskless-sync-delay"
4) "5"
5) "repl-diskless-load"
6) "disabled"
normal 0 0 0 slave 268435456 67108864 60 pubsub 33554432 8388608 60
sync_full:3
sync_partial_ok:41
sync_partial_err:0
master_repl_offset:184203912
repl_backlog_size:1048576
repl_backlog_histlen:1048576</div>
<div class="callout warn"><strong><code>repl_backlog_size</code> mặc định là 1 MB, và con số đó quyết định một lần kết nối lại là rẻ hay là thảm hoạ.</strong> Bộ đệm nhân bản là một bộ đệm vòng chứa các lượt ghi gần đây, giữ lại đúng cho mục đích này: khi một bản sao nối lại, bản chính kiểm xem những byte nó bỏ lỡ có còn trong đó không. Nếu còn thì đó là một lần đồng bộ một phần cỡ vài trăm kilobyte. Nếu không còn — vì bản sao vắng mặt hai mươi giây trong khi bạn ghi 1 MB mỗi giây — thì đó là một lần đồng bộ đầy đủ, với cú fork, lần truyền và lần nạp. Nên trên một máy nặng ghi thì 1 MB bộ đệm phủ được khoảng một giây mất kết nối. Hãy nâng <code>repl-backlog-size</code> lên đủ phủ lần mất kết nối tệ nhất trong thực tế của bạn (64 MB là lựa chọn phổ biến), theo dõi <code>sync_full</code> so với <code>sync_partial_ok</code>, và hãy coi một <code>sync_full</code> đang tăng đúng là lời cảnh báo mà nó là.</div>

<h3>Không qua đĩa, dây chuyền, và những tinh chỉnh đáng làm</h3>
<pre><code><span class="tok-comment"># Đồng bộ không qua đĩa: đổ thẳng RDB vào socket, không chạm vào đĩa</span>
redis-cli CONFIG SET repl-diskless-sync yes
redis-cli CONFIG SET repl-diskless-sync-delay 5

<span class="tok-comment"># Một bản sao của bản sao — bản chính chỉ fork một lần cho cả dây chuyền</span>
redis-cli -p 6381 REPLICAOF 127.0.0.1 6380
redis-cli -p 6380 INFO replication | grep -E "role|connected_slaves|slave0"

<span class="tok-comment"># Một bộ đệm lớn hơn, và nó sống bao lâu khi không có bản sao nào bám vào</span>
redis-cli CONFIG SET repl-backlog-size 64mb
redis-cli CONFIG GET repl-backlog-ttl repl-ping-replica-period</code></pre>
<div class="out">OK
OK
OK
role:slave
connected_slaves:1
slave0:ip=127.0.0.1,port=6381,state=online,offset=1204,lag=0
OK
1) "repl-backlog-ttl"
2) "3600"
3) "repl-ping-replica-period"
4) "10"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Không-qua-đĩa là mặc định từ bản 7.0</span><span class="v">Tiến trình con được fork ra ghi tệp RDB thẳng vào socket của bản sao thay vì ghi ra tệp. Nhanh hơn, và thiết yếu khi đĩa của bản chính chậm hoặc gần đầy — một lần đồng bộ đầy đủ không còn cần chỗ cho nguyên một bản sao chép của tập dữ liệu nữa.</span></div>
  <div class="kv"><span class="k"><code>repl-diskless-sync-delay 5</code> gom các bản sao lại</span><span class="v">Redis chờ năm giây trước khi bắt đầu một lần đồng bộ không-qua-đĩa, để vài bản sao nối vào cùng lúc dùng chung một cú fork và một dòng chảy. Nếu bạn đang khởi động lại cả một đội máy thì độ trễ đó là khác biệt giữa một cú fork và sáu cú.</span></div>
  <div class="kv"><span class="k">Nhân bản dây chuyền dời cái chi phí đi chỗ khác</span><span class="v">Một bản sao có thể có bản sao riêng của nó. Bản chính fork một lần cho đỉnh dây chuyền, còn các bản sao con đồng bộ từ nút ở giữa. Có ích cho nhiều bản sao đọc hoặc cho một chặng nhảy liên vùng — với cái giá là độ trễ chồng lên nhau dọc dây chuyền.</span></div>
  <div class="kv"><span class="k">Một bản sao đang đồng bộ là một bản sao không phục vụ</span><span class="v">Và một bản sao con trong dây chuyền cũng ngừng phục vụ khi <em>bên trên nó</em> đồng bộ lại. Trong một dây chuyền, một lần đồng bộ đầy đủ ở trên đỉnh sẽ đổ dồn xuống dưới.</span></div>
  <div class="kv"><span class="k">Việc sao lưu thuộc về bản sao</span><span class="v">Trỏ <code>BGSAVE</code> vào một bản sao là bản chính không bao giờ phải fork để sao lưu nữa (Bài 9.5). Đây là lý do hay nhất để chạy một bản sao kể cả khi bạn không cần chuyển đổi tự động.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> thêm một bản sao vào một bản chính gần đầy rồi kéo luôn bản chính xuống theo. Mỗi bước của một lần đồng bộ đầy đủ đều bắt bản chính trả giá: cú fork thêm bộ nhớ sao-chép-khi-ghi tạm thời (Bài 9.3), bộ đệm đầu ra của bản sao giữ mọi lượt ghi thực hiện trong lúc truyền, và trên một tập dữ liệu 20 GB qua một đường truyền chậm thì cái bộ đệm ấy có thể lên tới hàng gigabyte — tất cả đều tính vào <code>maxmemory</code> (Bài 9.1). Trên một máy vốn đã ở 85% bộ nhớ, gắn một bản sao vào lúc cao điểm là cách bạn khám phá ra điều này. Ba thói quen tránh được nó. <strong>Hãy gắn bản sao vào lúc vắng</strong>, để bộ đệm ghi luôn nhỏ và chi phí sao-chép-khi-ghi của cú fork thấp. <strong>Hãy kiểm chỗ trống trước</strong> — bạn cần chỗ cho cú fork cộng bộ đệm truyền, đó là lý do 60–70% RAM của máy là luật chọn cỡ. <strong>Và hãy theo dõi <code>sync_full</code> sau khi mọi thứ ổn định:</strong> một bản sao đồng bộ lại đầy đủ hơn một lần là đang nói với bạn rằng bộ đệm nhân bản quá nhỏ hoặc trần bộ đệm đầu ra quá chật, và mỗi lần đồng bộ lại như thế là lặp lại trọn cái chi phí kia.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/replication/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">Redis replication</span><span class="lc-sub">Toàn bộ cơ chế: PSYNC, replication ID, bộ đệm nhân bản, đồng bộ và nạp không qua đĩa, bản sao dây chuyền, và cấu hình cho từng thứ. Trang tra cứu chuẩn mực.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/commands/replicaof/" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">REPLICAOF</span><span class="lc-sub">Chuyện gì xảy ra trên bản sao khi bạn gõ nó, <code>NO ONE</code> thăng cấp mà không mất dữ liệu ra sao, và vì sao lệnh này nằm trong nhóm <code>@dangerous</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: dựng một bản sao</span><span class="lc-sub">Bài chấm điểm: dựng nhân bản rồi đo độ trễ theo offset, ép một lần đồng bộ đầy đủ rồi quan sát chi phí fork, chọn cỡ bộ đệm nhân bản từ một tốc độ ghi, và đọc <code>INFO replication</code> ở cả hai phía.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> <code>REPLICAOF</code> chỉ là một lệnh chạy lúc đang chạy, nhưng lần đồng bộ đầu tiên fork bản chính đúng như một lệnh <code>BGSAVE</code> và đệm lại mọi lượt ghi thực hiện trong lúc truyền — nên gắn một bản sao vào một bản chính gần đầy lúc cao điểm là một sự kiện về dung lượng chứ không phải một thay đổi cấu hình. Bộ đệm nhân bản mặc định là 1 MB, phủ được khoảng một giây mất kết nối trên một máy bận: hãy nâng nó lên, và theo dõi <code>sync_full</code> đối chiếu <code>sync_partial_ok</code> để biết các lần nối lại có rẻ không. Và lý do hay nhất để chạy một bản sao kể cả khi không cần chuyển đổi tự động là việc sao lưu có thể fork ở đó thay vì fork trên bản chính.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — What replication gives you, and what it does not|||11.2 — Nhân bản cho bạn cái gì, và không cho cái gì',
      slug: 'rd-11-2-gioi-han-nhan-ban',
      type: 'LESSON',
      description: 'Nhân bản là bất đồng bộ nên một lượt ghi đã được xác nhận vẫn mất được khi chuyển đổi; WAIT và WAITAOF thu hẹp cửa sổ chứ không đóng nó; min-replicas-to-write đổi tính sẵn sàng lấy độ bền; và mở rộng đọc mang theo độ trễ bản sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>What replication gives you, and what it does not</h2>
<p class="lead">Replication buys you three things: a warm copy for failover, somewhere to run backups and read-only work, and a second machine holding your data. It does not buy you durability of acknowledged writes, and it does not buy you automatic failover. Both of those are commonly assumed, and both assumptions cause incidents.</p>

<h3>The write that was acknowledged and then lost</h3>
<pre><code><span class="tok-comment"># Primary                          # Replica</span>
t=0   SET order:9001 confirmed
t=0   → +OK returned to the client   <span class="tok-comment"># the user sees "order placed"</span>
t=0   … the write is queued for the replica, asynchronously …
t=1   ─── the primary's host dies ───
t=2                                  <span class="tok-comment"># replica is promoted; it never received the write</span>
t=3   GET order:9001 → (nil)         <span class="tok-comment"># the order does not exist</span></code></pre>
<div class="callout warn"><strong>Redis replication is asynchronous, and that is a deliberate design choice rather than an oversight.</strong> The primary replies to the client the moment it has applied the command locally; sending it to replicas happens afterwards. That is why a single Redis instance answers in microseconds, and it means the window between "acknowledged" and "replicated" is real. On a healthy LAN it is sub-millisecond, so the exposure is tiny — but it is never zero, and a failover during that window loses those writes permanently, with no error anywhere. If your system cannot tolerate that at all, Redis replication is not the mechanism that fixes it; a database with synchronous commit is.</div>

<h3>WAIT: narrowing the window</h3>
<pre><code>redis-cli SET order:9001 confirmed
redis-cli WAIT 1 100
<span class="tok-comment"># "how many replicas have acknowledged everything I have written?"</span>
redis-cli WAIT 2 100                <span class="tok-comment"># only one replica exists → times out, returns 1</span>
<span class="tok-comment"># 7.0+: also wait for the local AOF fsync and the replicas' AOF</span>
redis-cli WAITAOF 1 1 100</code></pre>
<div class="out">OK
(integer) 1
(integer) 1
1) (integer) 1
2) (integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">It blocks until N replicas catch up</span><span class="lz-t">WAIT numreplicas timeout-ms</span><span class="lz-d">Called after your writes, it waits until that many replicas have acknowledged the current offset, then returns how many actually did. A timeout of 0 waits forever, which is a way to hang your request handler.</span></div>
  <div class="lz-step"><span class="lz-k">The return value is the answer</span><span class="lz-t">not an error, not a guarantee</span><span class="lz-d"><code>WAIT 2 100</code> returning 1 means only one replica confirmed within 100 ms — and your code has to decide what to do about that. Code that ignores the return value has added latency and bought nothing.</span></div>
  <div class="lz-step"><span class="lz-k">It is not synchronous replication</span><span class="lz-t">and the docs say so plainly</span><span class="lz-d">The write already happened before <code>WAIT</code> ran. If the primary dies between the <code>SET</code> and the <code>WAIT</code>, or if a failover promotes a replica that acknowledged but had not yet persisted, the write can still vanish. <code>WAIT</code> shrinks the window; it does not close it.</span></div>
  <div class="lz-step"><span class="lz-k"><code>WAITAOF</code> adds durability to it</span><span class="lz-t">Redis 7.0, and it needs AOF on</span><span class="lz-d"><code>WAITAOF 1 1 100</code> waits for the local AOF fsync <em>and</em> one replica's, returning both counts. That is the strongest guarantee Redis offers — and it costs a disk round trip per call, so reserve it for the handful of writes that genuinely warrant it.</span></div>
</div>

<h3>min-replicas-to-write: trading availability for safety</h3>
<pre><code>redis-cli CONFIG SET min-replicas-to-write 1
redis-cli CONFIG SET min-replicas-max-lag 10
redis-cli SET k v
<span class="tok-comment"># now stop the only replica and try again</span>
redis-cli -p 6380 SHUTDOWN NOSAVE 2&gt;/dev/null; sleep 12
redis-cli SET k v2
redis-cli GET k</code></pre>
<div class="out">OK
OK
OK
(error) NOREPLICAS Not enough good replicas to write.
"v"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">It makes the primary refuse writes</span><span class="v">When fewer than <code>min-replicas-to-write</code> replicas have pinged within <code>min-replicas-max-lag</code> seconds, every write returns <code>NOREPLICAS</code>. Reads keep working — the same asymmetry as <code>noeviction</code> (Lesson 9.2).</span></div>
  <div class="kv"><span class="k">This is a CAP decision, stated in config</span><span class="v">You are choosing consistency over availability: rather than accept writes that might not survive, the primary stops accepting them. That is correct for orders and wrong for a cache, and the config file is where you say which one you have.</span></div>
  <div class="kv"><span class="k">It still does not make replication synchronous</span><span class="v">It only guarantees that replicas <em>existed and were recent</em> when the write was accepted, not that they received that particular write. The window is smaller; it is not gone.</span></div>
  <div class="kv"><span class="k">With one replica it doubles your failure modes</span><span class="v"><code>min-replicas-to-write 1</code> and a single replica means losing the replica takes down writes on a healthy primary. If you set it, run at least two replicas so one can fail without stopping the service.</span></div>
  <div class="kv"><span class="k">Lag is measured by pings, not by data</span><span class="v">A replica sends <code>REPLCONF ACK</code> every second. <code>min-replicas-max-lag</code> counts seconds since the last one — so a replica that is connected but hopelessly behind on data still counts as "good".</span></div>
</div>

<h3>Reading from replicas, and the two surprises</h3>
<pre><code>redis-cli -p 6379 SET profile:1042 '{"bio":"new"}'
redis-cli -p 6380 GET profile:1042        <span class="tok-comment"># may still be the old value</span>
redis-cli -p 6379 INFO replication | grep -E "slave0"
redis-cli -p 6380 CONFIG GET replica-serve-stale-data
<span class="tok-comment"># expiration: the replica does NOT delete on its own</span>
redis-cli -p 6379 SET tmp v EX 1 &gt;/dev/null; sleep 2
redis-cli -p 6380 GET tmp
redis-cli -p 6380 DBSIZE</code></pre>
<div class="out">OK
"{\\"bio\\":\\"old\\"}"
slave0:ip=127.0.0.1,port=6380,state=online,offset=1841204,lag=0
1) "replica-serve-stale-data"
2) "yes"
(nil)
(integer) 41</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Surprise 1: read-your-writes breaks</span><span class="lz-lnote">A user edits their profile, the write goes to the primary, the next read goes to a replica that is 40 ms behind, and they see the old value. Worse, if that read fills a cache, the stale value is now cached for its whole TTL — the exact incident from Lesson 6.4. Pin a user's reads to the primary for a few seconds after their own write, or do not cache from replica reads.</span></div>
  <div class="lz-layer"><span class="lz-lname">Surprise 2: replicas do not expire keys</span><span class="lz-lnote">Only the primary decides a key has expired, and it propagates an explicit <code>DEL</code>. A replica therefore still <em>holds</em> logically-expired keys — <code>DBSIZE</code> counts them — but it will return <code>nil</code> for a read of one, so it never serves stale data. This is why <code>DBSIZE</code> can differ between primary and replica and neither is wrong.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>replica-serve-stale-data yes</code> is the default</span><span class="lz-lnote">When the link to the primary is down, a replica keeps serving whatever it has. Set it to <code>no</code> and it returns <code>SYNC with master in progress</code> instead — which is correct when stale answers are worse than no answers, and wrong for a cache where availability is the point.</span></div>
</div>

<div class="pitfall"><strong>Pitfall:</strong> believing a replica is a high-availability setup. Replication copies data; it does nothing else. When the primary dies, the replica does <em>not</em> promote itself, does not tell anyone, and keeps serving stale reads forever while every write in your application fails — because your clients are still configured with the primary's address, and there is no mechanism in plain replication that changes that. Someone has to notice, run <code>REPLICAOF NO ONE</code> on the replica, and then update every client's configuration to the new address, which usually means a deploy. That is minutes to hours of downtime, at 3am, performed by hand under pressure, and it is the step people discover is missing on the night they need it. The two things that automate it are Sentinel (Lesson 11.3) and Cluster (Lesson 11.4) — and both require the <em>clients</em> to participate, because the hard part was never promoting the replica, it was telling the application where to go. If you have replicas and no plan for that, write the runbook today and rehearse it once; a rehearsed manual failover beats an unrehearsed automatic one.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/wait/" target="_blank" rel="noopener">
  <span class="lc-ico">⏸️</span>
  <span class="lc-body"><span class="lc-title">WAIT and WAITAOF</span><span class="lc-sub">Exactly what each guarantees, why neither is synchronous replication, and the worked description of the failure modes that survive them.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/replication/#configuring-replication-safety" target="_blank" rel="noopener">
  <span class="lc-ico">🛟</span>
  <span class="lc-body"><span class="lc-title">min-replicas-to-write</span><span class="lc-sub">How the setting works, what "good replica" means in terms of ping lag, and the availability trade-off stated explicitly by the people who built it.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: lose a write on purpose</span><span class="lc-sub">Graded exercises: reproduce an acknowledged-then-lost write across a failover, use <code>WAIT</code> and check its return value, configure <code>min-replicas-to-write</code> and observe <code>NOREPLICAS</code>, and demonstrate a stale read from a lagging replica.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Replication is asynchronous, so a write that returned <code>+OK</code> can be lost if the primary dies before it reaches a replica — <code>WAIT</code> and <code>WAITAOF</code> narrow that window and do not close it, and their return values are answers your code must actually check. <code>min-replicas-to-write</code> is a CAP decision written into the config file: the primary refuses writes rather than accept ones that may not survive, which is right for orders and wrong for a cache. And a replica is not high availability: nothing promotes it, nothing tells your clients, so without Sentinel or Cluster a primary failure is a manual runbook executed at 3am.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Nhân bản cho bạn cái gì, và không cho cái gì</h2>
<p class="lead">Nhân bản mua về cho bạn ba thứ: một bản sao ấm sẵn để chuyển đổi, một chỗ để chạy sao lưu và những việc chỉ đọc, và một cái máy thứ hai đang giữ dữ liệu của bạn. Nó không mua về độ bền cho những lượt ghi đã được xác nhận, và nó không mua về khả năng tự động chuyển đổi. Cả hai điều đó đều bị mặc định là có, và cả hai giả định ấy đều gây ra sự cố.</p>

<h3>Lượt ghi đã được xác nhận rồi mất</h3>
<pre><code><span class="tok-comment"># Bản chính                        # Bản sao</span>
t=0   SET order:9001 confirmed
t=0   → trả +OK về cho khách         <span class="tok-comment"># người dùng thấy "đã đặt hàng"</span>
t=0   … lượt ghi được xếp hàng cho bản sao, bất đồng bộ …
t=1   ─── máy chủ của bản chính chết ───
t=2                                  <span class="tok-comment"># bản sao được thăng cấp; nó chưa hề nhận lượt ghi đó</span>
t=3   GET order:9001 → (nil)         <span class="tok-comment"># đơn hàng không tồn tại</span></code></pre>
<div class="callout warn"><strong>Nhân bản của Redis là bất đồng bộ, và đó là một lựa chọn thiết kế có chủ ý chứ không phải một sơ suất.</strong> Bản chính trả lời cho khách ngay khoảnh khắc nó áp dụng xong lệnh tại chỗ; việc gửi lệnh đó sang các bản sao xảy ra sau đó. Đó là lý do một máy Redis đơn lẻ trả lời trong vài micro giây, và nó nghĩa là cái cửa sổ giữa "đã xác nhận" với "đã nhân bản" là có thật. Trên một mạng nội bộ khoẻ mạnh thì nó dưới một mili giây nên mức phơi bày rất nhỏ — nhưng nó không bao giờ bằng 0, và một lần chuyển đổi rơi đúng cửa sổ ấy sẽ làm mất những lượt ghi đó vĩnh viễn, không có lỗi nào ở đâu cả. Nếu hệ thống của bạn hoàn toàn không chịu nổi chuyện đó thì nhân bản của Redis không phải cơ chế chữa nó; một cơ sở dữ liệu có ghi nhận đồng bộ mới là.</div>

<h3>WAIT: thu hẹp cái cửa sổ</h3>
<pre><code>redis-cli SET order:9001 confirmed
redis-cli WAIT 1 100
<span class="tok-comment"># "có bao nhiêu bản sao đã xác nhận mọi thứ tôi vừa ghi?"</span>
redis-cli WAIT 2 100                <span class="tok-comment"># chỉ có một bản sao → hết giờ, trả về 1</span>
<span class="tok-comment"># 7.0+: chờ luôn cả lần fsync AOF tại chỗ và AOF của các bản sao</span>
redis-cli WAITAOF 1 1 100</code></pre>
<div class="out">OK
(integer) 1
(integer) 1
1) (integer) 1
2) (integer) 1</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó chặn cho tới khi N bản sao đuổi kịp</span><span class="lz-t">WAIT numreplicas timeout-ms</span><span class="lz-d">Gọi sau các lượt ghi của bạn, nó chờ tới khi chừng ấy bản sao đã xác nhận offset hiện tại rồi trả về con số thật sự đã xác nhận. Hạn chờ bằng 0 là chờ mãi mãi, tức là một cách treo bộ xử lý yêu cầu của bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Giá trị trả về chính là câu trả lời</span><span class="lz-t">không phải một lỗi, không phải một bảo đảm</span><span class="lz-d"><code>WAIT 2 100</code> trả về 1 nghĩa là chỉ một bản sao xác nhận trong vòng 100 ms — và mã của bạn phải quyết định làm gì với chuyện đó. Mã bỏ qua giá trị trả về thì vừa thêm độ trễ vừa chẳng mua được gì.</span></div>
  <div class="lz-step"><span class="lz-k">Nó không phải nhân bản đồng bộ</span><span class="lz-t">và tài liệu nói thẳng như vậy</span><span class="lz-d">Lượt ghi đã xảy ra rồi mới tới lượt <code>WAIT</code> chạy. Nếu bản chính chết giữa lệnh <code>SET</code> và lệnh <code>WAIT</code>, hoặc nếu một lần chuyển đổi thăng cấp một bản sao đã xác nhận nhưng chưa kịp lưu lâu dài, thì lượt ghi vẫn biến mất được. <code>WAIT</code> thu nhỏ cái cửa sổ; nó không đóng cửa sổ.</span></div>
  <div class="lz-step"><span class="lz-k"><code>WAITAOF</code> thêm độ bền vào đó</span><span class="lz-t">Redis 7.0, và nó cần bật AOF</span><span class="lz-d"><code>WAITAOF 1 1 100</code> chờ lần fsync AOF tại chỗ <em>và</em> của một bản sao, trả về cả hai con số. Đó là bảo đảm mạnh nhất Redis có — và nó tốn một vòng đi-về xuống đĩa cho mỗi lời gọi, nên hãy để dành nó cho nhúm lượt ghi thật sự xứng đáng.</span></div>
</div>

<h3>min-replicas-to-write: đổi tính sẵn sàng lấy sự an toàn</h3>
<pre><code>redis-cli CONFIG SET min-replicas-to-write 1
redis-cli CONFIG SET min-replicas-max-lag 10
redis-cli SET k v
<span class="tok-comment"># giờ hãy dừng bản sao duy nhất rồi thử lại</span>
redis-cli -p 6380 SHUTDOWN NOSAVE 2&gt;/dev/null; sleep 12
redis-cli SET k v2
redis-cli GET k</code></pre>
<div class="out">OK
OK
OK
(error) NOREPLICAS Not enough good replicas to write.
"v"</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó làm bản chính từ chối các lượt ghi</span><span class="v">Khi số bản sao đã ping trong vòng <code>min-replicas-max-lag</code> giây ít hơn <code>min-replicas-to-write</code>, mọi lượt ghi trả về <code>NOREPLICAS</code>. Các lượt đọc vẫn chạy — đúng sự bất đối xứng của <code>noeviction</code> (Bài 9.2).</span></div>
  <div class="kv"><span class="k">Đây là một quyết định CAP, phát biểu ngay trong cấu hình</span><span class="v">Bạn đang chọn tính nhất quán thay vì tính sẵn sàng: thay vì nhận những lượt ghi có thể không sống sót, bản chính ngừng nhận chúng. Điều đó đúng cho đơn hàng và sai cho một bộ đệm, và tệp cấu hình là nơi bạn nói mình đang có cái nào.</span></div>
  <div class="kv"><span class="k">Nó vẫn không làm cho nhân bản thành đồng bộ</span><span class="v">Nó chỉ bảo đảm rằng các bản sao <em>đã tồn tại và còn tươi</em> lúc lượt ghi được nhận, không bảo đảm rằng chúng đã nhận được đúng lượt ghi đó. Cửa sổ nhỏ đi; nó không biến mất.</span></div>
  <div class="kv"><span class="k">Với một bản sao thì nó nhân đôi số kiểu hỏng của bạn</span><span class="v"><code>min-replicas-to-write 1</code> cộng đúng một bản sao nghĩa là mất bản sao đó là mất luôn khả năng ghi trên một bản chính khoẻ mạnh. Nếu bạn đặt nó thì hãy chạy ít nhất hai bản sao để một cái hỏng mà dịch vụ không dừng.</span></div>
  <div class="kv"><span class="k">Độ trễ đo bằng ping, không đo bằng dữ liệu</span><span class="v">Một bản sao gửi <code>REPLCONF ACK</code> mỗi giây. <code>min-replicas-max-lag</code> đếm số giây kể từ cái ping cuối — nên một bản sao đang kết nối mà tụt lại vô vọng về dữ liệu vẫn được tính là "tốt".</span></div>
</div>

<h3>Đọc từ bản sao, và hai điều bất ngờ</h3>
<pre><code>redis-cli -p 6379 SET profile:1042 '{"bio":"new"}'
redis-cli -p 6380 GET profile:1042        <span class="tok-comment"># có thể vẫn là giá trị cũ</span>
redis-cli -p 6379 INFO replication | grep -E "slave0"
redis-cli -p 6380 CONFIG GET replica-serve-stale-data
<span class="tok-comment"># hết hạn: bản sao KHÔNG tự xoá</span>
redis-cli -p 6379 SET tmp v EX 1 &gt;/dev/null; sleep 2
redis-cli -p 6380 GET tmp
redis-cli -p 6380 DBSIZE</code></pre>
<div class="out">OK
"{\\"bio\\":\\"old\\"}"
slave0:ip=127.0.0.1,port=6380,state=online,offset=1841204,lag=0
1) "replica-serve-stale-data"
2) "yes"
(nil)
(integer) 41</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bất ngờ 1: đọc-thấy-cái-mình-vừa-ghi bị hỏng</span><span class="lz-lnote">Một người dùng sửa hồ sơ, lượt ghi đi vào bản chính, lượt đọc kế tiếp đi vào một bản sao đang chậm 40 ms, và họ thấy giá trị cũ. Tệ hơn, nếu lượt đọc ấy nạp vào bộ đệm thì giá trị ôi giờ được đệm suốt trọn TTL của nó — đúng cái sự cố ở Bài 6.4. Hãy ghim lượt đọc của một người vào bản chính trong vài giây sau lượt ghi của chính họ, hoặc đừng nạp bộ đệm từ những lượt đọc trên bản sao.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bất ngờ 2: bản sao không cho khoá hết hạn</span><span class="lz-lnote">Chỉ bản chính quyết định một khoá đã hết hạn, và nó lan truyền một lệnh <code>DEL</code> tường minh. Vì thế một bản sao vẫn <em>đang giữ</em> những khoá đã hết hạn về mặt logic — <code>DBSIZE</code> vẫn đếm chúng — nhưng nó sẽ trả <code>nil</code> khi có ai đọc một cái, nên nó không bao giờ phục vụ dữ liệu ôi. Đó là lý do <code>DBSIZE</code> khác nhau giữa bản chính và bản sao mà chẳng bên nào sai.</span></div>
  <div class="lz-layer"><span class="lz-lname"><code>replica-serve-stale-data yes</code> là mặc định</span><span class="lz-lnote">Khi đường liên kết tới bản chính đứt, bản sao vẫn phục vụ bằng bất cứ thứ gì nó đang có. Đặt nó thành <code>no</code> thì nó trả về <code>SYNC with master in progress</code> thay vào đó — đúng khi câu trả lời ôi còn tệ hơn không có câu trả lời, và sai với một bộ đệm nơi tính sẵn sàng mới là mục đích.</span></div>
</div>

<div class="pitfall"><strong>Cái bẫy:</strong> tin rằng một bản sao là một thiết lập sẵn sàng cao. Nhân bản chép dữ liệu; nó không làm gì khác. Khi bản chính chết thì bản sao <em>không</em> tự thăng cấp, không báo cho ai, và cứ phục vụ những lượt đọc ôi mãi mãi trong khi mọi lượt ghi trong ứng dụng của bạn hỏng — vì các thư viện khách của bạn vẫn được cấu hình với địa chỉ của bản chính, và trong nhân bản trần không có cơ chế nào đổi điều đó. Phải có ai đó nhận ra, chạy <code>REPLICAOF NO ONE</code> trên bản sao, rồi cập nhật cấu hình của mọi thư viện khách sang địa chỉ mới, mà việc đó thường nghĩa là một lần deploy. Đó là hàng phút tới hàng giờ thời gian chết, lúc 3 giờ sáng, làm bằng tay dưới áp lực, và nó là cái bước mà người ta phát hiện ra là mình chưa có vào đúng cái đêm cần tới. Hai thứ tự động hoá nó là Sentinel (Bài 11.3) và Cluster (Bài 11.4) — và cả hai đều đòi <em>thư viện khách</em> phải tham gia, vì phần khó chưa bao giờ là thăng cấp bản sao, mà là báo cho ứng dụng biết phải đi đâu. Nếu bạn có bản sao mà chưa có kế hoạch cho chuyện đó thì hãy viết sổ tay ngay hôm nay và diễn tập một lần; một lần chuyển đổi thủ công có diễn tập thắng một lần chuyển đổi tự động chưa diễn tập.</div>

<a class="link-card" href="https://redis.io/docs/latest/commands/wait/" target="_blank" rel="noopener">
  <span class="lc-ico">⏸️</span>
  <span class="lc-body"><span class="lc-title">WAIT và WAITAOF</span><span class="lc-sub">Chính xác từng lệnh bảo đảm điều gì, vì sao không cái nào là nhân bản đồng bộ, và mô tả chạy đủ về những kiểu hỏng sống sót qua chúng.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/replication/#configuring-replication-safety" target="_blank" rel="noopener">
  <span class="lc-ico">🛟</span>
  <span class="lc-body"><span class="lc-title">min-replicas-to-write</span><span class="lc-sub">Thiết lập này chạy ra sao, "bản sao tốt" nghĩa là gì tính theo độ trễ ping, và sự đánh đổi về tính sẵn sàng được chính những người xây nó nói thẳng ra.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: cố ý làm mất một lượt ghi</span><span class="lc-sub">Bài chấm điểm: tái hiện một lượt ghi được-xác-nhận-rồi-mất qua một lần chuyển đổi, dùng <code>WAIT</code> rồi kiểm giá trị trả về của nó, cấu hình <code>min-replicas-to-write</code> rồi quan sát <code>NOREPLICAS</code>, và tái hiện một lượt đọc ôi từ một bản sao đang tụt lại.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Nhân bản là bất đồng bộ, nên một lượt ghi đã trả về <code>+OK</code> vẫn mất được nếu bản chính chết trước khi nó tới bản sao — <code>WAIT</code> và <code>WAITAOF</code> thu hẹp cửa sổ ấy chứ không đóng nó, và giá trị chúng trả về là những câu trả lời mà mã của bạn phải thật sự kiểm. <code>min-replicas-to-write</code> là một quyết định CAP viết thẳng vào tệp cấu hình: bản chính từ chối lượt ghi thay vì nhận những lượt có thể không sống sót, điều đó đúng cho đơn hàng và sai cho một bộ đệm. Và một bản sao không phải là sẵn sàng cao: không gì thăng cấp nó, không gì báo cho các thư viện khách của bạn, nên nếu không có Sentinel hay Cluster thì một cú hỏng của bản chính là một cuốn sổ tay thi hành bằng tay lúc 3 giờ sáng.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Sentinel: automatic failover|||11.3 — Sentinel: tự động chuyển đổi',
      slug: 'rd-11-3-sentinel',
      type: 'LESSON',
      description: 'Bốn việc Sentinel làm, quorum khác đa số ở chỗ nào và vì sao lẫn hai con số đó là lỗi kinh điển, SDOWN với ODOWN, trình tự chuyển đổi, và vì sao thư viện khách phải hỏi Sentinel chứ không được ghim địa chỉ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Sentinel: automatic failover</h2>
<p class="lead">Sentinel is a separate Redis process — the same binary, a different mode — whose job is to watch your primary, decide when it is genuinely dead, promote a replica, and tell everyone about it. That last clause is the one people skip, and it is the one that makes the whole thing work.</p>

<h3>Four jobs, and the fourth is the important one</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Monitoring</span><span class="lz-lnote">Every Sentinel pings the primary, the replicas and the other Sentinels every second. This is cheap and it is also how Sentinels discover each other and discover replicas — you configure only the primary's address, and the topology is learned.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Notification</span><span class="lz-lnote">Sentinel publishes events to Pub/Sub channels (<code>+sdown</code>, <code>+odown</code>, <code>+switch-master</code>, and a dozen more) and can run a script on each. That is your alerting hook, and it costs nothing to wire up.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Automatic failover</span><span class="lz-lnote">When enough Sentinels agree the primary is down, they elect a leader among themselves, the leader picks the best replica, promotes it with <code>REPLICAOF NO ONE</code>, and reconfigures the remaining replicas to follow it. Typically ten to thirty seconds end to end.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Configuration provider</span><span class="lz-lnote"><strong>This is the part that matters.</strong> Clients do not connect to a fixed address — they ask a Sentinel "where is <code>mymaster</code> right now?" and connect to whatever it says. Without this, a failover promotes a replica that nobody is talking to, which is a successful failover and a total outage.</span></div>
</div>

<h3>Setting it up</h3>
<pre><code><span class="tok-comment"># sentinel.conf — one per Sentinel, three Sentinels on three hosts</span>
port 26379
sentinel monitor mymaster 10.0.1.5 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
sentinel auth-pass mymaster &lt;the primary's password&gt;

<span class="tok-comment"># start it</span>
redis-sentinel /etc/redis/sentinel.conf
<span class="tok-comment"># or: redis-server /etc/redis/sentinel.conf --sentinel</span>

redis-cli -p 26379 SENTINEL master mymaster | paste - - | head -8
redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
redis-cli -p 26379 SENTINEL ckquorum mymaster</code></pre>
<div class="out">name	mymaster
ip	10.0.1.5
port	6379
runid	c8f9d2e1a4b7063f5e8d9c2a1b4e7f60d3c8a9b2
flags	master
num-slaves	2
num-other-sentinels	2
quorum	2
1) "10.0.1.5"
2) "6379"
OK 3 usable Sentinels. Quorum and failover authorization can be reached</div>
<div class="kv-grid">
  <div class="kv"><span class="k">You configure the primary; the rest is discovered</span><span class="v">Sentinels find the replicas by asking the primary, and find each other over a Pub/Sub channel on the monitored instances. Adding a replica requires no Sentinel configuration at all.</span></div>
  <div class="kv"><span class="k">The config file rewrites itself</span><span class="v">Sentinel writes discovered state back into <code>sentinel.conf</code>, including the current primary's address after a failover. It must be writable, and you must not template it back over on every deploy — that is how a Sentinel wakes up pointing at a primary that was demoted last week.</span></div>
  <div class="kv"><span class="k"><code>down-after-milliseconds</code> is the patience</span><span class="v">How long an instance must be unreachable before this Sentinel calls it subjectively down. Too low and a GC pause or a network blip triggers a failover; too high and real outages last longer. Five seconds is a common starting point.</span></div>
  <div class="kv"><span class="k"><code>parallel-syncs 1</code> protects the new primary</span><span class="v">How many replicas resync from the newly promoted primary at once. One at a time means the others keep serving stale reads instead of all going <code>-LOADING</code> together (Lesson 11.1).</span></div>
  <div class="kv"><span class="k"><code>SENTINEL ckquorum</code> before you trust it</span><span class="v">It tells you whether a failover could actually be authorised right now. Run it after any topology change; "OK 3 usable Sentinels" is the sentence you want to have seen before the night you need it.</span></div>
</div>

<h3>Quorum and majority: two numbers, and the classic mistake</h3>
<pre><code><span class="tok-comment"># The trailing 2 is the QUORUM: how many Sentinels must agree it is down</span>
sentinel monitor mymaster 10.0.1.5 6379 2</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SDOWN — subjectively down</span><span class="lz-t">one Sentinel's private opinion</span><span class="lz-d">This Sentinel has not had a reply within <code>down-after-milliseconds</code>. It means nothing on its own — the network between that one Sentinel and the primary may simply be broken.</span></div>
  <div class="lz-step"><span class="lz-k">ODOWN — objectively down</span><span class="lz-t">at least QUORUM Sentinels agree</span><span class="lz-d">They ask each other, and once <code>quorum</code> of them report SDOWN, the primary is declared objectively down. This is what starts a failover attempt.</span></div>
  <div class="lz-step"><span class="lz-k">The leader needs a MAJORITY, not the quorum</span><span class="lz-t">and this is where people get caught</span><span class="lz-d">Declaring ODOWN takes <code>quorum</code> votes; actually <em>performing</em> the failover requires a majority of the whole Sentinel set to authorise a leader. With 3 Sentinels the majority is 2; with 5 it is 3. Setting <code>quorum 1</code> on a 3-Sentinel set does not let one Sentinel fail over alone — it still needs 2 to authorise.</span></div>
  <div class="lz-step"><span class="lz-k">Which is why the majority rule protects you</span><span class="lz-t">a minority partition cannot promote anything</span><span class="lz-d">If a network split leaves one Sentinel on one side and two on the other, only the side with two can act. That is the property that prevents two primaries existing at once — and it is the reason three Sentinels on <em>three separate hosts</em> is the minimum real deployment.</span></div>
</div>
<pre><code>redis-cli -p 26379 SENTINEL sentinels mymaster | grep -c name
redis-cli -p 26379 SENTINEL replicas mymaster | paste - - | grep -E "^name|flags"
<span class="tok-comment"># Force one, to rehearse — no failure required</span>
redis-cli -p 26379 SENTINEL failover mymaster
sleep 12
redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
redis-cli -p 26379 --timeout 3 PSUBSCRIBE '+switch-master' 2&gt;/dev/null | tail -4</code></pre>
<div class="out">2
name	10.0.1.6:6380
flags	slave
name	10.0.1.7:6381
flags	slave
OK
1) "10.0.1.6"
2) "6380"
pmessage
+switch-master
mymaster 10.0.1.5 6379 10.0.1.6 6380</div>
<div class="callout ok"><strong><code>SENTINEL failover</code> is the rehearsal command, and you should run it on purpose.</strong> It performs a real failover without waiting for a real failure — no quorum vote needed, because you are the authority. Run it in staging until you know exactly how long it takes and what your application does during those seconds; run it in production during a quiet window once, so the first real failover is not the first one anybody has watched. The <code>+switch-master</code> message above is what clients subscribe to, and its arguments are the old address followed by the new one.</div>

<h3>The client half, which is not optional</h3>
<pre><code><span class="tok-comment">// A Sentinel-aware client: give it the SENTINELS, not the primary</span>
const client = createSentinel({
  name: 'mymaster',
  sentinelRootNodes: [
    { host: '10.0.1.5', port: 26379 },
    { host: '10.0.1.6', port: 26379 },
    { host: '10.0.1.7', port: 26379 },
  ],
  <span class="tok-comment">// the library asks Sentinel for the current primary, subscribes to</span>
  <span class="tok-comment">// +switch-master, and reconnects itself when the address changes</span>
});
await client.connect();</code></pre>
<div class="pitfall"><strong>Pitfall:</strong> deploying Sentinel and leaving the application pointed at the primary's IP. This is the most common Sentinel failure and it produces a spectacular outcome: the failover works perfectly — Sentinel detects the failure, elects a leader, promotes the best replica, reconfigures the others, publishes <code>+switch-master</code>, and logs a clean success — while every client keeps trying to reach a machine that is dead. Monitoring says the failover succeeded. The application says everything is down. There are exactly two supported ways out, and a popular third that is not. <strong>A Sentinel-aware client library</strong> is the intended answer: it queries Sentinel for the address, subscribes to the switch event, and reconnects on its own. <strong>A proxy that follows Sentinel</strong> — HAProxy with a check that finds the primary, or a virtual IP moved by a Sentinel notification script — keeps clients pointing at one address and moves the address instead. And <strong>DNS is the third option that does not work</strong>: a CNAME updated by a notification script is at the mercy of every resolver cache and every JVM that caches DNS forever, so you will have clients on the old address for minutes after a failover that took twelve seconds. Whichever you pick, test it by running <code>SENTINEL failover</code> and watching the application, because that is the only test that covers this.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/" target="_blank" rel="noopener">
  <span class="lc-ico">🛰️</span>
  <span class="lc-body"><span class="lc-title">Redis Sentinel</span><span class="lc-sub">The complete document: the quorum/majority distinction, SDOWN and ODOWN, leader election, the failover state machine, every configuration directive and every Pub/Sub event.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/#sentinel-clients-implementation" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Sentinel client implementation</span><span class="lc-sub">The specification client libraries follow — worth reading even if you never write one, because it tells you exactly what your library should be doing during a failover.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: survive a primary failure</span><span class="lc-sub">Graded exercises: build a three-Sentinel set, rehearse with <code>SENTINEL failover</code> and time it, prove that a hard-coded client breaks while a Sentinel-aware one recovers, and work out the majority for four different Sentinel counts.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Sentinel does four things and the fourth — being the configuration provider clients ask for the current primary — is the one that makes the other three useful; a failover nobody is told about is an outage. Quorum and majority are different numbers: <code>quorum</code> decides when the primary is declared objectively down, while a majority of the whole Sentinel set must authorise the leader that performs the failover, which is why three Sentinels on three separate hosts is the minimum and why <code>quorum 1</code> does not let a lone Sentinel act. And rehearse with <code>SENTINEL failover</code> before you need it — it is a real failover on demand, and it is the only test that proves your clients follow the switch.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Sentinel: tự động chuyển đổi</h2>
<p class="lead">Sentinel là một tiến trình Redis riêng — cùng một tệp nhị phân, khác chế độ — có nhiệm vụ canh bản chính của bạn, quyết định khi nào nó chết thật, thăng cấp một bản sao, và báo cho mọi người biết. Mệnh đề cuối cùng đó là thứ người ta hay bỏ qua, và nó chính là thứ làm cho cả cỗ máy chạy được.</p>

<h3>Bốn việc, và việc thứ tư mới là việc quan trọng</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Giám sát</span><span class="lz-lnote">Mỗi Sentinel ping bản chính, các bản sao và các Sentinel khác mỗi giây một lần. Việc này rẻ và cũng là cách các Sentinel tìm ra nhau và tìm ra các bản sao — bạn chỉ cấu hình địa chỉ của bản chính, còn hình trạng thì được học ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Thông báo</span><span class="lz-lnote">Sentinel đăng các sự kiện lên các kênh Pub/Sub (<code>+sdown</code>, <code>+odown</code>, <code>+switch-master</code>, và cả tá nữa) và chạy được một script cho mỗi cái. Đó là móc cảnh báo của bạn, và đấu nối nó chẳng tốn gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Tự động chuyển đổi</span><span class="lz-lnote">Khi đủ số Sentinel đồng ý rằng bản chính đã chết, chúng bầu một trưởng nhóm trong số mình, trưởng nhóm chọn bản sao tốt nhất, thăng cấp nó bằng <code>REPLICAOF NO ONE</code>, rồi cấu hình lại các bản sao còn lại để bám theo nó. Thường mất mười tới ba mươi giây từ đầu tới cuối.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Nơi cung cấp cấu hình</span><span class="lz-lnote"><strong>Đây mới là phần quan trọng.</strong> Thư viện khách không nối vào một địa chỉ cố định — chúng hỏi một Sentinel "<code>mymaster</code> đang ở đâu?" rồi nối vào bất cứ chỗ nào nó chỉ. Không có điều này thì một lần chuyển đổi thăng cấp một bản sao mà chẳng ai nói chuyện với nó, tức là một lần chuyển đổi thành công và một sự cố toàn phần.</span></div>
</div>

<h3>Dựng nó lên</h3>
<pre><code><span class="tok-comment"># sentinel.conf — mỗi Sentinel một tệp, ba Sentinel trên ba máy</span>
port 26379
sentinel monitor mymaster 10.0.1.5 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
sentinel auth-pass mymaster &lt;mật khẩu của bản chính&gt;

<span class="tok-comment"># khởi động</span>
redis-sentinel /etc/redis/sentinel.conf
<span class="tok-comment"># hoặc: redis-server /etc/redis/sentinel.conf --sentinel</span>

redis-cli -p 26379 SENTINEL master mymaster | paste - - | head -8
redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
redis-cli -p 26379 SENTINEL ckquorum mymaster</code></pre>
<div class="out">name	mymaster
ip	10.0.1.5
port	6379
runid	c8f9d2e1a4b7063f5e8d9c2a1b4e7f60d3c8a9b2
flags	master
num-slaves	2
num-other-sentinels	2
quorum	2
1) "10.0.1.5"
2) "6379"
OK 3 usable Sentinels. Quorum and failover authorization can be reached</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Bạn cấu hình bản chính; phần còn lại được khám phá ra</span><span class="v">Các Sentinel tìm ra bản sao bằng cách hỏi bản chính, và tìm ra nhau qua một kênh Pub/Sub trên các máy được giám sát. Thêm một bản sao thì không cần cấu hình Sentinel chút nào.</span></div>
  <div class="kv"><span class="k">Tệp cấu hình tự viết lại chính nó</span><span class="v">Sentinel ghi trạng thái đã khám phá ngược vào <code>sentinel.conf</code>, gồm cả địa chỉ bản chính hiện tại sau một lần chuyển đổi. Nó phải ghi được, và bạn không được dùng khuôn mẫu ghi đè lên nó ở mỗi lần deploy — đó là cách một Sentinel tỉnh dậy và trỏ vào một bản chính đã bị giáng cấp từ tuần trước.</span></div>
  <div class="kv"><span class="k"><code>down-after-milliseconds</code> là mức kiên nhẫn</span><span class="v">Một máy phải mất liên lạc bao lâu trước khi Sentinel này gọi nó là chết theo cảm nhận riêng. Quá thấp thì một nhịp dọn rác hay một cú chớp mạng cũng kích hoạt chuyển đổi; quá cao thì sự cố thật kéo dài hơn. Năm giây là điểm xuất phát phổ biến.</span></div>
  <div class="kv"><span class="k"><code>parallel-syncs 1</code> bảo vệ bản chính mới</span><span class="v">Bao nhiêu bản sao được đồng bộ lại từ bản chính vừa thăng cấp cùng lúc. Từng cái một nghĩa là những cái còn lại vẫn phục vụ các lượt đọc hơi cũ thay vì cùng lúc rơi vào <code>-LOADING</code> (Bài 11.1).</span></div>
  <div class="kv"><span class="k"><code>SENTINEL ckquorum</code> trước khi tin nó</span><span class="v">Nó nói cho bạn biết một lần chuyển đổi có thật sự được cho phép ngay lúc này không. Hãy chạy nó sau mọi thay đổi hình trạng; "OK 3 usable Sentinels" là câu bạn muốn đã nhìn thấy trước cái đêm bạn cần tới nó.</span></div>
</div>

<h3>Quorum và đa số: hai con số, và cái lỗi kinh điển</h3>
<pre><code><span class="tok-comment"># Số 2 ở cuối là QUORUM: bao nhiêu Sentinel phải đồng ý rằng nó đã chết</span>
sentinel monitor mymaster 10.0.1.5 6379 2</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SDOWN — chết theo cảm nhận riêng</span><span class="lz-t">ý kiến riêng của một Sentinel</span><span class="lz-d">Sentinel này không nhận được trả lời nào trong vòng <code>down-after-milliseconds</code>. Tự nó thì chẳng nghĩa lý gì — có thể chỉ là đường mạng giữa đúng một Sentinel ấy với bản chính đang hỏng.</span></div>
  <div class="lz-step"><span class="lz-k">ODOWN — chết một cách khách quan</span><span class="lz-t">ít nhất QUORUM Sentinel đồng ý</span><span class="lz-d">Chúng hỏi lẫn nhau, và khi <code>quorum</code> cái báo SDOWN thì bản chính được tuyên là chết một cách khách quan. Đây là thứ khởi động một lần thử chuyển đổi.</span></div>
  <div class="lz-step"><span class="lz-k">Trưởng nhóm cần ĐA SỐ, không phải quorum</span><span class="lz-t">và đây là chỗ người ta bị bắt</span><span class="lz-d">Tuyên ODOWN cần <code>quorum</code> phiếu; nhưng <em>thực hiện</em> lần chuyển đổi thì cần đa số của toàn bộ tập Sentinel cho phép một trưởng nhóm. Với 3 Sentinel thì đa số là 2; với 5 thì là 3. Đặt <code>quorum 1</code> trên một tập 3 Sentinel không cho phép một Sentinel tự mình chuyển đổi — nó vẫn cần 2 cái cho phép.</span></div>
  <div class="lz-step"><span class="lz-k">Và chính luật đa số đó bảo vệ bạn</span><span class="lz-t">một phân vùng thiểu số không thăng cấp được gì</span><span class="lz-d">Nếu một cú chia cắt mạng để một Sentinel ở bên này và hai cái ở bên kia thì chỉ bên có hai cái hành động được. Đó là tính chất ngăn không cho tồn tại hai bản chính cùng lúc — và là lý do ba Sentinel trên <em>ba máy riêng biệt</em> là mức triển khai thật tối thiểu.</span></div>
</div>
<pre><code>redis-cli -p 26379 SENTINEL sentinels mymaster | grep -c name
redis-cli -p 26379 SENTINEL replicas mymaster | paste - - | grep -E "^name|flags"
<span class="tok-comment"># Ép một lần, để diễn tập — không cần có hỏng hóc nào</span>
redis-cli -p 26379 SENTINEL failover mymaster
sleep 12
redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster
redis-cli -p 26379 --timeout 3 PSUBSCRIBE '+switch-master' 2&gt;/dev/null | tail -4</code></pre>
<div class="out">2
name	10.0.1.6:6380
flags	slave
name	10.0.1.7:6381
flags	slave
OK
1) "10.0.1.6"
2) "6380"
pmessage
+switch-master
mymaster 10.0.1.5 6379 10.0.1.6 6380</div>
<div class="callout ok"><strong><code>SENTINEL failover</code> là lệnh để diễn tập, và bạn nên chạy nó một cách có chủ ý.</strong> Nó thực hiện một lần chuyển đổi thật mà không cần chờ một cú hỏng thật — không cần bỏ phiếu quorum, vì chính bạn là người có thẩm quyền. Hãy chạy nó ở môi trường thử cho tới khi bạn biết chính xác nó mất bao lâu và ứng dụng của bạn làm gì trong mấy giây đó; hãy chạy nó ở production một lần vào một khung giờ vắng, để lần chuyển đổi thật đầu tiên không phải là lần đầu tiên có người ngồi xem. Thông điệp <code>+switch-master</code> ở trên là thứ mà các thư viện khách đăng ký nghe, và các tham số của nó là địa chỉ cũ rồi tới địa chỉ mới.</div>

<h3>Nửa việc ở phía thư viện khách, và nó không phải tuỳ chọn</h3>
<pre><code><span class="tok-comment">// Một thư viện khách hiểu Sentinel: hãy đưa cho nó các SENTINEL, đừng đưa bản chính</span>
const client = createSentinel({
  name: 'mymaster',
  sentinelRootNodes: [
    { host: '10.0.1.5', port: 26379 },
    { host: '10.0.1.6', port: 26379 },
    { host: '10.0.1.7', port: 26379 },
  ],
  <span class="tok-comment">// thư viện hỏi Sentinel bản chính hiện tại, đăng ký nghe</span>
  <span class="tok-comment">// +switch-master, và tự kết nối lại khi địa chỉ đổi</span>
});
await client.connect();</code></pre>
<div class="pitfall"><strong>Cái bẫy:</strong> triển khai Sentinel rồi để ứng dụng trỏ vào địa chỉ IP của bản chính. Đây là kiểu hỏng Sentinel phổ biến nhất và nó tạo ra một kết cục ngoạn mục: lần chuyển đổi chạy hoàn hảo — Sentinel phát hiện hỏng hóc, bầu trưởng nhóm, thăng cấp bản sao tốt nhất, cấu hình lại những cái khác, đăng <code>+switch-master</code>, và ghi một dòng nhật ký thành công sạch đẹp — trong khi mọi thư viện khách vẫn cố với tới một cái máy đã chết. Hệ giám sát nói lần chuyển đổi thành công. Ứng dụng nói mọi thứ đã sập. Có đúng hai lối ra được hỗ trợ, và một lối thứ ba phổ biến mà không chạy. <strong>Một thư viện khách hiểu Sentinel</strong> là đáp án được thiết kế sẵn: nó hỏi Sentinel địa chỉ, đăng ký nghe sự kiện chuyển đổi, và tự kết nối lại. <strong>Một proxy bám theo Sentinel</strong> — HAProxy với một phép kiểm tìm ra bản chính, hoặc một IP ảo được một script thông báo của Sentinel dời đi — giữ cho các thư viện khách trỏ vào một địa chỉ duy nhất và dời cái địa chỉ ấy thay vì dời khách. Và <strong>DNS là lựa chọn thứ ba không chạy được</strong>: một bản ghi CNAME được một script thông báo cập nhật thì nằm dưới sự tuỳ hứng của mọi bộ nhớ đệm phân giải và mọi JVM lưu đệm DNS mãi mãi, nên bạn sẽ có những khách còn ở địa chỉ cũ hàng phút sau một lần chuyển đổi chỉ mất mười hai giây. Chọn cái nào cũng được, hãy kiểm nó bằng cách chạy <code>SENTINEL failover</code> rồi ngồi xem ứng dụng, vì đó là phép thử duy nhất phủ được chuyện này.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/" target="_blank" rel="noopener">
  <span class="lc-ico">🛰️</span>
  <span class="lc-body"><span class="lc-title">Redis Sentinel</span><span class="lc-sub">Tài liệu đầy đủ: phân biệt quorum với đa số, SDOWN và ODOWN, bầu trưởng nhóm, máy trạng thái chuyển đổi, mọi chỉ thị cấu hình và mọi sự kiện Pub/Sub.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/#sentinel-clients-implementation" target="_blank" rel="noopener">
  <span class="lc-ico">🔌</span>
  <span class="lc-body"><span class="lc-title">Sentinel client implementation</span><span class="lc-sub">Bản đặc tả mà các thư viện khách tuân theo — đáng đọc kể cả khi bạn không bao giờ viết một cái, vì nó nói chính xác thư viện của bạn nên làm gì trong một lần chuyển đổi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: sống sót qua một cú hỏng của bản chính</span><span class="lc-sub">Bài chấm điểm: dựng một tập ba Sentinel, diễn tập bằng <code>SENTINEL failover</code> rồi bấm giờ, chứng minh một thư viện khách ghim cứng địa chỉ thì hỏng trong khi một thư viện hiểu Sentinel thì hồi phục, và tính ra đa số cho bốn số lượng Sentinel khác nhau.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Sentinel làm bốn việc và việc thứ tư — làm nơi cung cấp cấu hình để thư viện khách hỏi bản chính hiện tại — mới là thứ khiến ba việc kia có ích; một lần chuyển đổi mà không ai được báo là một sự cố. Quorum và đa số là hai con số khác nhau: <code>quorum</code> quyết định khi nào bản chính bị tuyên là chết một cách khách quan, còn đa số của toàn bộ tập Sentinel phải cho phép cái trưởng nhóm thực hiện chuyển đổi, đó là lý do ba Sentinel trên ba máy riêng biệt là mức tối thiểu và là lý do <code>quorum 1</code> không cho một Sentinel đơn độc hành động. Và hãy diễn tập bằng <code>SENTINEL failover</code> trước khi bạn cần tới — nó là một lần chuyển đổi thật theo yêu cầu, và là phép thử duy nhất chứng minh các thư viện khách của bạn bám theo được cú chuyển.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — Cluster: 16384 slots and what they cost you|||11.4 — Cluster: 16384 ô và cái giá của chúng',
      slug: 'rd-11-4-cluster',
      type: 'LESSON',
      description: 'CRC16 chia dư 16384, MOVED với ASK, thư viện khách hiểu cụm giữ bản đồ ô, nhãn băm {} để ghép khoá về một chỗ, lỗi CROSSSLOT, chia lại ô, và danh sách những thứ bạn phải từ bỏ khi vào Cluster.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>Cluster: 16384 slots and what they cost you</h2>
<p class="lead">Cluster is Redis's answer to "my dataset does not fit on one machine". It shards keys across nodes automatically, handles failover per shard, and grows by adding nodes. It also changes what Redis <em>is</em> in ways that break working code — so the list of things you give up matters as much as the mechanism.</p>

<h3>The slot map</h3>
<pre><code>redis-cli --cluster create 10.0.1.5:6379 10.0.1.6:6379 10.0.1.7:6379 \\
  10.0.1.8:6379 10.0.1.9:6379 10.0.1.10:6379 --cluster-replicas 1
redis-cli -c -p 6379 CLUSTER INFO | head -4
redis-cli -c -p 6379 CLUSTER SHARDS | paste - - | grep -E "slots|^id|role"
redis-cli -c -p 6379 CLUSTER KEYSLOT user:1042
redis-cli -c -p 6379 CLUSTER KEYSLOT session:abc
redis-cli -c -p 6379 CLUSTER COUNTKEYSINSLOT 9842</code></pre>
<div class="out">[OK] All 16384 slots covered.
cluster_enabled:1
cluster_state:ok
cluster_slots_assigned:16384
cluster_known_nodes:6
slots	0 5460
role	master
slots	5461 10922
role	master
slots	10923 16383
role	master
(integer) 9842
(integer) 3009
(integer) 1841</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Every key maps to one of 16384 slots</span><span class="lz-t">CRC16(key) mod 16384</span><span class="lz-d">Deterministic, computable by the client without asking anyone, and unchanging: <code>user:1042</code> is always slot 9842. The number 16384 is arbitrary but fixed — it is large enough to spread evenly across hundreds of nodes and small enough that the slot bitmap fits in a cluster heartbeat.</span></div>
  <div class="lz-step"><span class="lz-k">Each node owns a range of slots</span><span class="lz-t">three nodes → roughly 5461 slots each</span><span class="lz-d">Ownership is what moves when you reshard, not the keys themselves conceptually — you migrate slots, and the keys in them come along. Adding a fourth node means taking about 4096 slots from the existing three.</span></div>
  <div class="lz-step"><span class="lz-k">Each shard has its own replicas and its own failover</span><span class="lz-t">--cluster-replicas 1</span><span class="lz-d">There is no Sentinel here: the nodes themselves detect failure and vote. A shard whose primary dies promotes its own replica, and the rest of the cluster carries on serving the slots it owns.</span></div>
  <div class="lz-step"><span class="lz-k">Three primaries is the practical minimum</span><span class="lz-t">because failure detection needs a majority</span><span class="lz-d">The primaries vote on whether a node is failed, so two primaries cannot form a majority when one of them is the suspect. Three primaries plus three replicas — six nodes — is the smallest cluster that survives a node loss.</span></div>
</div>

<h3>MOVED, ASK, and why the client does the work</h3>
<pre><code><span class="tok-comment"># Without -c: redis-cli does not follow redirects, so you see the mechanism</span>
redis-cli -p 6379 GET user:1042
redis-cli -p 6379 GET session:abc
<span class="tok-comment"># With -c: it follows the redirect and reports it</span>
redis-cli -c -p 6379 GET user:1042</code></pre>
<div class="out">(error) MOVED 9842 10.0.1.6:6379
"cached-value"
-&gt; Redirected to slot [9842] located at 10.0.1.6:6379
"cached-value"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>MOVED</code> means "permanently, go there"</span><span class="v">The node does not proxy your request — it tells you where the slot lives and expects you to reconnect. A client that receives <code>MOVED</code> should refresh its whole slot map, because one slot moving usually means several did.</span></div>
  <div class="kv"><span class="k"><code>ASK</code> means "just this once, go there"</span><span class="v">Sent while a slot is mid-migration: some keys are already on the new node. The client must send <code>ASKING</code> first, then the command, and must <em>not</em> update its slot map — the slot has not finished moving.</span></div>
  <div class="kv"><span class="k">A cluster-aware client caches the map</span><span class="v">It calls <code>CLUSTER SHARDS</code> once, computes CRC16 locally, and connects directly to the right node — so the steady state is zero redirects. Redirects are the correction mechanism, not the normal path.</span></div>
  <div class="kv"><span class="k">A non-cluster client mostly works, badly</span><span class="v">It will hit <code>MOVED</code> on most keys and, depending on the library, either error or follow the redirect on every single command — doubling every round trip. "It seems to work" is the worst failure mode here.</span></div>
  <div class="kv"><span class="k">Give the client several seed nodes</span><span class="v">It bootstraps from any of them and learns the rest. One seed address means one machine whose loss stops new clients from starting, which is an outage that only appears during a deploy.</span></div>
</div>

<h3>The thing that breaks your code: multi-key commands</h3>
<pre><code>redis-cli -c -p 6379 MSET user:1 a user:2 b
redis-cli -c -p 6379 SINTER tag:redis tag:docker
<span class="tok-comment"># Hash tags force keys into the same slot</span>
redis-cli -c -p 6379 CLUSTER KEYSLOT '{u1042}:profile'
redis-cli -c -p 6379 CLUSTER KEYSLOT '{u1042}:sessions'
redis-cli -c -p 6379 MSET '{u1042}:profile' a '{u1042}:sessions' b
redis-cli -c -p 6379 MGET '{u1042}:profile' '{u1042}:sessions'</code></pre>
<div class="out">(error) CROSSSLOT Keys in request don't hash to the same slot
(error) CROSSSLOT Keys in request don't hash to the same slot
(integer) 4011
(integer) 4011
OK
1) "a"
2) "b"</div>
<div class="callout warn"><strong>Every multi-key command now requires all its keys in one slot, and that is a design constraint rather than a configuration option.</strong> <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>ZUNIONSTORE</code>, <code>SMOVE</code>, <code>LMOVE</code>, <code>RENAME</code>, a <code>MULTI</code> block spanning keys, and a Lua script declaring several keys — all of them return <code>CROSSSLOT</code> unless the keys hash together. The escape hatch is a <strong>hash tag</strong>: if a key contains <code>{…}</code>, only the text inside the first braces is hashed, so <code>{u1042}:profile</code> and <code>{u1042}:sessions</code> land in the same slot and can be operated on together. That works, and it is also a re-introduction of the problem Cluster exists to solve — every key sharing a tag lives on one node, so a tag chosen too broadly (<code>{global}</code>) puts your whole dataset back on a single machine. Tag by the thing that is genuinely small and self-contained: one user, one tenant, one document.</div>

<h3>What else you give up</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Multiple databases</span><span class="lz-lnote"><code>SELECT</code> only accepts 0 in Cluster mode. Any code using databases 1–15 as namespaces (Lesson 2.5) has to be rewritten around key prefixes before it can move.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cheap Pub/Sub</span><span class="lz-lnote">Classic <code>PUBLISH</code> is broadcast to every node over the cluster bus, so publish traffic grows with the cluster instead of dividing among it. <code>SPUBLISH</code>/<code>SSUBSCRIBE</code> (7.0) hash the channel like a key and fix it — but only if your clients use them (Lesson 8.1).</span></div>
  <div class="lz-layer"><span class="lz-lname">Whole-keyspace operations</span><span class="lz-lnote"><code>KEYS</code>, <code>SCAN</code>, <code>DBSIZE</code>, <code>FLUSHALL</code> and <code>--bigkeys</code> answer for <em>one node</em>. Anything that needs the whole keyspace has to be run against every primary and combined, and <code>redis-cli --cluster call</code> exists for exactly that.</span></div>
  <div class="lz-layer"><span class="lz-lname">Operational simplicity</span><span class="lz-lnote">Six processes instead of one, a slot map that can be inconsistent, resharding as a routine operation, and failure modes — a split brain, a partially covered keyspace, a stuck migration — that simply do not exist on a single instance. <code>cluster-require-full-coverage yes</code> means the whole cluster stops serving if any slot is uncovered; setting it to <code>no</code> trades correctness for availability.</span></div>
</div>
<pre><code>redis-cli --cluster check 10.0.1.5:6379 | tail -4
redis-cli --cluster rebalance 10.0.1.5:6379 --cluster-use-empty-masters
redis-cli --cluster call 10.0.1.5:6379 DBSIZE
redis-cli -c -p 6379 CLUSTER COUNTKEYSINSLOT 9842</code></pre>
<div class="out">[OK] All nodes agree about slots configuration.
&gt;&gt;&gt; Check for open slots...
&gt;&gt;&gt; Check slots coverage...
[OK] All 16384 slots covered.
&gt;&gt;&gt; Rebalancing across 4 nodes. Total weight = 4.00
Moving 4096 slots from 10.0.1.5:6379 to 10.0.1.11:6379
10.0.1.5:6379: 614203
10.0.1.6:6379: 609841
10.0.1.7:6379: 617992
(integer) 1841</div>

<div class="pitfall"><strong>Pitfall:</strong> reaching for Cluster when the actual problem is one hot key or one slow command. Cluster solves exactly one thing well — a dataset larger than one machine's RAM — and it is a poor answer to almost every other symptom. If the instance is slow, the cause is usually an O(N) command blocking the single thread (Lesson 6.5), and sharding six ways means six nodes that each still stall on their own <code>KEYS</code>. If one key is hot, sharding does not help at all: that key lives in exactly one slot on exactly one node, and now that node is the bottleneck while five others idle. If reads are the pressure, replicas are far simpler than Cluster and give you the same relief. And if memory is genuinely the problem, check the cheap fixes first — TTLs on keys that have none (Lesson 2.2), the hash-bucketing trick (Lesson 5.2), a smaller retention on streams (Lesson 8.2) — because those routinely reclaim more than half an instance and cost nothing operationally. Move to Cluster when you have measured that a single instance cannot hold the working set, and go in knowing you are trading a simple system for a distributed one, with <code>CROSSSLOT</code> errors, hash tags, per-node <code>SCAN</code> and resharding as permanent parts of your life.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Scaling with Redis Cluster</span><span class="lc-sub">The tutorial: creating a cluster, hash slots, resharding, adding and removing nodes, and the <code>redis-cli --cluster</code> tooling. Start here.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">The Cluster specification</span><span class="lc-sub">How MOVED and ASK really work, the gossip protocol, failure detection and the consistency guarantees stated precisely — including exactly when Cluster can lose writes.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: shard and reshard</span><span class="lc-sub">Graded exercises: build a six-node cluster, trigger <code>MOVED</code> and <code>CROSSSLOT</code>, fix a multi-key operation with hash tags, add a node and rebalance, and kill a primary to watch the shard fail over.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> Cluster maps every key to one of 16384 slots with <code>CRC16(key) mod 16384</code>, nodes own slot ranges, and clients compute the slot locally and connect straight to the right node — <code>MOVED</code> and <code>ASK</code> are the correction mechanism, not the normal path, so a cluster-aware client is mandatory. Multi-key commands require all keys in one slot: <code>MGET</code>, <code>SINTER</code>, <code>MULTI</code> and multi-key Lua all fail with <code>CROSSSLOT</code>, and hash tags <code>{…}</code> are the escape hatch that re-creates the problem if you choose them too broadly. And Cluster answers one question — a dataset bigger than one machine — so check TTLs, encodings and stream retention before accepting <code>CROSSSLOT</code>, per-node <code>SCAN</code> and resharding as permanent costs.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Cluster: 16384 ô và cái giá của chúng</h2>
<p class="lead">Cluster là câu trả lời của Redis cho câu "tập dữ liệu của tôi không vừa một cái máy". Nó chia khoá ra các nút một cách tự động, lo chuyển đổi cho từng mảnh, và lớn lên bằng cách thêm nút. Nó cũng thay đổi <em>bản chất</em> của Redis theo những cách làm hỏng mã đang chạy tốt — nên danh sách những thứ bạn phải từ bỏ cũng quan trọng ngang cái cơ chế.</p>

<h3>Bản đồ ô</h3>
<pre><code>redis-cli --cluster create 10.0.1.5:6379 10.0.1.6:6379 10.0.1.7:6379 \\
  10.0.1.8:6379 10.0.1.9:6379 10.0.1.10:6379 --cluster-replicas 1
redis-cli -c -p 6379 CLUSTER INFO | head -4
redis-cli -c -p 6379 CLUSTER SHARDS | paste - - | grep -E "slots|^id|role"
redis-cli -c -p 6379 CLUSTER KEYSLOT user:1042
redis-cli -c -p 6379 CLUSTER KEYSLOT session:abc
redis-cli -c -p 6379 CLUSTER COUNTKEYSINSLOT 9842</code></pre>
<div class="out">[OK] All 16384 slots covered.
cluster_enabled:1
cluster_state:ok
cluster_slots_assigned:16384
cluster_known_nodes:6
slots	0 5460
role	master
slots	5461 10922
role	master
slots	10923 16383
role	master
(integer) 9842
(integer) 3009
(integer) 1841</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mọi khoá ánh xạ về một trong 16384 ô</span><span class="lz-t">CRC16(khoá) chia dư 16384</span><span class="lz-d">Tất định, thư viện khách tự tính được mà không cần hỏi ai, và không đổi: <code>user:1042</code> luôn là ô 9842. Con số 16384 là tuỳ chọn nhưng cố định — đủ lớn để trải đều trên hàng trăm nút và đủ nhỏ để bản đồ bit của các ô vừa trong một nhịp tim của cụm.</span></div>
  <div class="lz-step"><span class="lz-k">Mỗi nút sở hữu một dải ô</span><span class="lz-t">ba nút → mỗi nút khoảng 5461 ô</span><span class="lz-d">Thứ dịch chuyển khi bạn chia lại là quyền sở hữu, chứ không phải bản thân các khoá về mặt khái niệm — bạn di trú các ô, và các khoá nằm trong đó đi theo. Thêm nút thứ tư nghĩa là lấy khoảng 4096 ô từ ba nút đang có.</span></div>
  <div class="lz-step"><span class="lz-k">Mỗi mảnh có bản sao riêng và cơ chế chuyển đổi riêng</span><span class="lz-t">--cluster-replicas 1</span><span class="lz-d">Ở đây không có Sentinel: chính các nút phát hiện hỏng hóc và bỏ phiếu. Một mảnh có bản chính chết thì tự thăng cấp bản sao của nó, còn phần còn lại của cụm vẫn phục vụ những ô mà nó sở hữu.</span></div>
  <div class="lz-step"><span class="lz-k">Ba bản chính là mức tối thiểu thực tế</span><span class="lz-t">vì việc phát hiện hỏng hóc cần đa số</span><span class="lz-d">Các bản chính bỏ phiếu xem một nút có hỏng không, nên hai bản chính không lập nổi đa số khi một trong hai chính là kẻ bị nghi. Ba bản chính cộng ba bản sao — sáu nút — là cụm nhỏ nhất sống sót qua việc mất một nút.</span></div>
</div>

<h3>MOVED, ASK, và vì sao thư viện khách phải làm phần việc đó</h3>
<pre><code><span class="tok-comment"># Không có -c: redis-cli không đi theo chuyển hướng, nên bạn thấy được cơ chế</span>
redis-cli -p 6379 GET user:1042
redis-cli -p 6379 GET session:abc
<span class="tok-comment"># Có -c: nó đi theo chuyển hướng và báo lại</span>
redis-cli -c -p 6379 GET user:1042</code></pre>
<div class="out">(error) MOVED 9842 10.0.1.6:6379
"cached-value"
-&gt; Redirected to slot [9842] located at 10.0.1.6:6379
"cached-value"</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>MOVED</code> nghĩa là "vĩnh viễn, hãy sang đó"</span><span class="v">Cái nút không làm proxy cho yêu cầu của bạn — nó nói cho bạn biết cái ô đó nằm ở đâu và trông đợi bạn tự nối lại. Một thư viện khách nhận <code>MOVED</code> nên làm mới cả bản đồ ô của nó, vì một ô dịch chuyển thường nghĩa là vài ô đã dịch chuyển.</span></div>
  <div class="kv"><span class="k"><code>ASK</code> nghĩa là "riêng lần này thôi, hãy sang đó"</span><span class="v">Được gửi khi một ô đang di trú dở: vài khoá đã sang nút mới. Thư viện khách phải gửi <code>ASKING</code> trước, rồi mới gửi lệnh, và <em>không được</em> cập nhật bản đồ ô — cái ô đó chưa di trú xong.</span></div>
  <div class="kv"><span class="k">Một thư viện khách hiểu cụm sẽ nhớ đệm bản đồ</span><span class="v">Nó gọi <code>CLUSTER SHARDS</code> một lần, tự tính CRC16 tại chỗ, và nối thẳng vào đúng nút — nên trạng thái ổn định là không có chuyển hướng nào. Chuyển hướng là cơ chế sửa sai, không phải đường đi bình thường.</span></div>
  <div class="kv"><span class="k">Một thư viện không hiểu cụm thì phần lớn vẫn chạy, một cách tệ hại</span><span class="v">Nó sẽ dính <code>MOVED</code> ở hầu hết các khoá và, tuỳ thư viện, hoặc báo lỗi hoặc đi theo chuyển hướng ở từng lệnh một — nhân đôi mọi vòng đi-về. "Nhìn thì có vẻ chạy" là kiểu hỏng tệ nhất ở đây.</span></div>
  <div class="kv"><span class="k">Hãy đưa cho thư viện khách vài nút mồi</span><span class="v">Nó khởi tạo từ bất kỳ cái nào rồi học ra phần còn lại. Một địa chỉ mồi duy nhất nghĩa là một cái máy mà việc mất nó chặn các thư viện khách mới khởi động, và đó là một sự cố chỉ lộ ra trong lúc deploy.</span></div>
</div>

<h3>Thứ làm hỏng mã của bạn: các lệnh nhiều khoá</h3>
<pre><code>redis-cli -c -p 6379 MSET user:1 a user:2 b
redis-cli -c -p 6379 SINTER tag:redis tag:docker
<span class="tok-comment"># Nhãn băm ép các khoá về cùng một ô</span>
redis-cli -c -p 6379 CLUSTER KEYSLOT '{u1042}:profile'
redis-cli -c -p 6379 CLUSTER KEYSLOT '{u1042}:sessions'
redis-cli -c -p 6379 MSET '{u1042}:profile' a '{u1042}:sessions' b
redis-cli -c -p 6379 MGET '{u1042}:profile' '{u1042}:sessions'</code></pre>
<div class="out">(error) CROSSSLOT Keys in request don't hash to the same slot
(error) CROSSSLOT Keys in request don't hash to the same slot
(integer) 4011
(integer) 4011
OK
1) "a"
2) "b"</div>
<div class="callout warn"><strong>Giờ mọi lệnh nhiều khoá đều đòi tất cả khoá của nó nằm trong một ô, và đó là một ràng buộc thiết kế chứ không phải một tuỳ chọn cấu hình.</strong> <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>ZUNIONSTORE</code>, <code>SMOVE</code>, <code>LMOVE</code>, <code>RENAME</code>, một khối <code>MULTI</code> trải qua nhiều khoá, và một script Lua khai báo vài khoá — tất cả đều trả về <code>CROSSSLOT</code> trừ khi các khoá băm về cùng chỗ. Lối thoát là một <strong>nhãn băm</strong>: nếu một khoá chứa <code>{…}</code> thì chỉ phần chữ nằm trong cặp ngoặc đầu tiên được đem băm, nên <code>{u1042}:profile</code> và <code>{u1042}:sessions</code> rơi vào cùng một ô và thao tác chung được. Cách đó chạy được, và nó cũng là việc dựng lại chính cái bài toán mà Cluster sinh ra để giải — mọi khoá dùng chung một nhãn đều sống trên một nút, nên một cái nhãn chọn quá rộng (<code>{global}</code>) sẽ đưa cả tập dữ liệu của bạn về lại một cái máy. Hãy gắn nhãn theo thứ thật sự nhỏ và khép kín: một người dùng, một khách thuê, một tài liệu.</div>

<h3>Bạn còn phải từ bỏ những gì nữa</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nhiều cơ sở dữ liệu</span><span class="lz-lnote"><code>SELECT</code> chỉ nhận số 0 trong chế độ Cluster. Mọi đoạn mã dùng cơ sở dữ liệu 1–15 làm không gian tên (Bài 2.5) đều phải viết lại xoay quanh tiền tố khoá trước khi chuyển sang được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Pub/Sub giá rẻ</span><span class="lz-lnote">Lệnh <code>PUBLISH</code> cổ điển được phát tới mọi nút qua đường bus của cụm, nên lưu lượng đăng bài tăng theo cụm thay vì chia đều cho cụm. <code>SPUBLISH</code>/<code>SSUBSCRIBE</code> (7.0) băm tên kênh như một cái khoá và chữa được chuyện đó — nhưng chỉ khi các thư viện khách của bạn dùng chúng (Bài 8.1).</span></div>
  <div class="lz-layer"><span class="lz-lname">Các phép trên toàn bộ không gian khoá</span><span class="lz-lnote"><code>KEYS</code>, <code>SCAN</code>, <code>DBSIZE</code>, <code>FLUSHALL</code> và <code>--bigkeys</code> trả lời cho <em>một nút</em>. Mọi thứ cần cả không gian khoá đều phải chạy trên từng bản chính rồi gộp lại, và <code>redis-cli --cluster call</code> sinh ra đúng cho việc đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Sự đơn giản về vận hành</span><span class="lz-lnote">Sáu tiến trình thay vì một, một bản đồ ô có thể không nhất quán, việc chia lại ô trở thành thao tác thường lệ, và những kiểu hỏng — não chia đôi, không gian khoá phủ thiếu, một lần di trú kẹt giữa chừng — đơn giản là không tồn tại trên một máy đơn lẻ. <code>cluster-require-full-coverage yes</code> nghĩa là cả cụm ngừng phục vụ nếu có ô nào không được phủ; đặt nó thành <code>no</code> là đổi tính đúng đắn lấy tính sẵn sàng.</span></div>
</div>
<pre><code>redis-cli --cluster check 10.0.1.5:6379 | tail -4
redis-cli --cluster rebalance 10.0.1.5:6379 --cluster-use-empty-masters
redis-cli --cluster call 10.0.1.5:6379 DBSIZE
redis-cli -c -p 6379 CLUSTER COUNTKEYSINSLOT 9842</code></pre>
<div class="out">[OK] All nodes agree about slots configuration.
&gt;&gt;&gt; Check for open slots...
&gt;&gt;&gt; Check slots coverage...
[OK] All 16384 slots covered.
&gt;&gt;&gt; Rebalancing across 4 nodes. Total weight = 4.00
Moving 4096 slots from 10.0.1.5:6379 to 10.0.1.11:6379
10.0.1.5:6379: 614203
10.0.1.6:6379: 609841
10.0.1.7:6379: 617992
(integer) 1841</div>

<div class="pitfall"><strong>Cái bẫy:</strong> với tay lấy Cluster trong khi vấn đề thật là một cái khoá nóng hoặc một cái lệnh chậm. Cluster giải tốt đúng một chuyện — một tập dữ liệu lớn hơn RAM của một cái máy — và nó là câu trả lời dở cho gần như mọi triệu chứng khác. Nếu cái máy chậm thì nguyên nhân thường là một lệnh O(N) chặn cái luồng đơn (Bài 6.5), và chia làm sáu mảnh nghĩa là sáu cái nút mà mỗi cái vẫn khựng lại vì lệnh <code>KEYS</code> của riêng nó. Nếu một cái khoá đang nóng thì chia mảnh chẳng giúp gì cả: cái khoá đó nằm ở đúng một ô trên đúng một nút, và giờ cái nút ấy là nút thắt cổ chai trong khi năm nút kia ngồi chơi. Nếu áp lực nằm ở lượt đọc thì bản sao đơn giản hơn Cluster nhiều mà cho bạn đúng chừng ấy sự nhẹ nhõm. Và nếu bộ nhớ thật sự là vấn đề thì hãy kiểm những cách chữa rẻ trước — TTL cho những khoá chưa có (Bài 2.2), mẹo chia gáo hash (Bài 5.2), rút ngắn thời gian lưu của stream (Bài 8.2) — vì những cái đó thường xuyên đòi lại được hơn nửa cái máy mà chẳng tốn gì về vận hành. Hãy chuyển sang Cluster khi bạn đã đo được rằng một máy đơn lẻ không giữ nổi tập đang làm việc, và hãy bước vào với ý thức rằng bạn đang đổi một hệ đơn giản lấy một hệ phân tán, với lỗi <code>CROSSSLOT</code>, nhãn băm, <code>SCAN</code> theo từng nút và việc chia lại ô trở thành phần vĩnh viễn trong đời bạn.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Scaling with Redis Cluster</span><span class="lc-sub">Bài hướng dẫn: tạo một cụm, các ô băm, chia lại ô, thêm và gỡ nút, và bộ công cụ <code>redis-cli --cluster</code>. Hãy bắt đầu từ đây.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Bản đặc tả Cluster</span><span class="lc-sub">MOVED và ASK thật sự chạy ra sao, giao thức đồn thổi, việc phát hiện hỏng hóc và các bảo đảm về tính nhất quán nói ra một cách chính xác — gồm cả chính xác khi nào Cluster làm mất lượt ghi.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chia mảnh và chia lại</span><span class="lc-sub">Bài chấm điểm: dựng một cụm sáu nút, kích hoạt <code>MOVED</code> và <code>CROSSSLOT</code>, chữa một phép nhiều khoá bằng nhãn băm, thêm một nút rồi cân bằng lại, và giết một bản chính để xem cái mảnh đó chuyển đổi.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Cluster ánh xạ mọi khoá về một trong 16384 ô bằng <code>CRC16(khoá) chia dư 16384</code>, các nút sở hữu những dải ô, và thư viện khách tự tính ô tại chỗ rồi nối thẳng vào đúng nút — <code>MOVED</code> và <code>ASK</code> là cơ chế sửa sai chứ không phải đường đi bình thường, nên một thư viện khách hiểu cụm là bắt buộc. Các lệnh nhiều khoá đòi mọi khoá nằm trong một ô: <code>MGET</code>, <code>SINTER</code>, <code>MULTI</code> và Lua nhiều khoá đều hỏng với <code>CROSSSLOT</code>, còn nhãn băm <code>{…}</code> là lối thoát, và nó dựng lại chính cái bài toán ấy nếu bạn chọn nhãn quá rộng. Và Cluster trả lời đúng một câu hỏi — một tập dữ liệu lớn hơn một cái máy — nên hãy kiểm TTL, kiểu mã hoá và thời gian lưu của stream trước khi chấp nhận <code>CROSSSLOT</code>, <code>SCAN</code> theo từng nút và việc chia lại ô làm những chi phí vĩnh viễn.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — Choosing an architecture, honestly|||11.5 — Chọn kiến trúc, một cách thành thật',
      slug: 'rd-11-5-chon-kien-truc',
      type: 'LESSON',
      description: 'Một máy Redis đơn lẻ thật sự làm được bao nhiêu, đo bằng redis-benchmark; năm kiến trúc kèm thứ chúng thêm vào và thứ chúng lấy đi; phép tính dung lượng quyết định; và dịch vụ có quản lý cho gì, lấy đi gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Choosing an architecture, honestly</h2>
<p class="lead">Most Redis scaling decisions are made from anxiety rather than measurement, and they are almost always made too early. So before the decision tree, the number that changes the conversation: what one ordinary Redis instance actually does.</p>

<h3>What one instance handles</h3>
<pre><code>redis-benchmark -t set,get -n 1000000 -c 50 -q
redis-benchmark -t set,get -n 1000000 -c 50 -P 16 -q          <span class="tok-comment"># pipelined</span>
redis-benchmark -t get -n 1000000 -c 50 -d 1024 -q            <span class="tok-comment"># 1KB values</span>
redis-cli INFO stats | grep instantaneous_ops_per_sec</code></pre>
<div class="out">SET: 118906.11 requests per second, p50=0.263 msec
GET: 121492.35 requests per second, p50=0.255 msec
SET: 892857.12 requests per second, p50=0.815 msec
GET: 1000000.00 requests per second, p50=0.703 msec
GET: 104166.67 requests per second, p50=0.295 msec
instantaneous_ops_per_sec:0</div>
<div class="callout ok"><strong>Around 120,000 operations per second without pipelining, and near a million with it — on one core, on ordinary hardware.</strong> Put that next to your actual traffic. A busy web application doing 2,000 requests per second with ten Redis calls each is 20,000 ops/s: about 17% of one unpipelined instance. Most services that "need to scale Redis" are using a few percent of one machine and are actually suffering from an O(N) command (Lesson 6.5), a missing index, or a memory problem with a cheap fix. Measure <code>instantaneous_ops_per_sec</code> against these numbers before designing anything — the honest answer is very often "you have 20× headroom and a different problem".</div>

<h3>Five architectures</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · One instance</span><span class="lz-lnote"><strong>Handles:</strong> ~120k ops/s, as much data as the machine's RAM. <strong>Costs:</strong> nothing operationally. <strong>Fails:</strong> a machine loss is a total outage until someone restores a backup. Correct for development, internal tools, and any production service where minutes of downtime are survivable and the data is rebuildable.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · One primary + replicas</span><span class="lz-lnote"><strong>Adds:</strong> backups that fork on the replica, read-only work moved off the primary, a warm copy to promote by hand. <strong>Costs:</strong> another machine, and the replica-lag surprises from Lesson 11.2. <strong>Still fails:</strong> nothing promotes automatically. Almost every Redis deployment should be at least here.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Sentinel</span><span class="lz-lnote"><strong>Adds:</strong> automatic failover in ten to thirty seconds, and an address service for clients. <strong>Costs:</strong> three more processes on three hosts, Sentinel-aware clients or a proxy, and a new class of incident — a failover triggered by a network blip. Correct when a primary loss must not require a human.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Cluster</span><span class="lz-lnote"><strong>Adds:</strong> a dataset larger than one machine, write throughput beyond one core, per-shard failover with no Sentinel. <strong>Costs:</strong> <code>CROSSSLOT</code>, hash tags, one database, per-node <code>SCAN</code>, resharding, and six nodes minimum. Correct when the working set genuinely does not fit — and rarely before.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Managed (ElastiCache, MemoryDB, Upstash, Redis Cloud…)</span><span class="lz-lnote"><strong>Adds:</strong> someone else runs it, patches it, monitors it and pages for it. <strong>Costs:</strong> money, a version usually a year or more behind upstream, restricted commands, and persistence settings you may not control (Lesson 9.5). For most teams this is the right answer and the one they take too long to reach.</span></div>
</div>

<h3>The decision, in order</h3>
<pre><code><span class="tok-comment"># 1 · Does the working set fit in one machine's RAM, with headroom?</span>
redis-cli INFO memory | grep -E "used_memory_human|used_memory_peak_human"
<span class="tok-comment">#     no  → Cluster (or reduce the dataset first — see below)</span>
<span class="tok-comment">#     yes → keep going</span>

<span class="tok-comment"># 2 · Are you anywhere near the throughput of one instance?</span>
redis-cli INFO stats | grep instantaneous_ops_per_sec
<span class="tok-comment">#     &gt;60k sustained → consider Cluster; &lt;20k → throughput is not your problem</span>

<span class="tok-comment"># 3 · Is a manual failover acceptable?</span>
<span class="tok-comment">#     yes → primary + replica, with a rehearsed runbook</span>
<span class="tok-comment">#     no  → Sentinel, or a managed service that does it for you</span>

<span class="tok-comment"># 4 · Do you want to operate any of this?</span>
<span class="tok-comment">#     no  → managed. This is a legitimate and usually correct answer.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Shrink before you shard</span><span class="v">TTLs on keys that have none (Lesson 2.2), the hash-bucketing trick (Lesson 5.2), <code>MAXLEN</code> on streams (Lesson 8.2) and moving cold data out routinely reclaim half an instance. All of them are cheaper than a cluster, forever.</span></div>
  <div class="kv"><span class="k">Replicas do not add write capacity</span><span class="v">Every write still goes through the one primary. Replicas scale reads and give you failover material; if writes are the bottleneck, only Cluster helps.</span></div>
  <div class="kv"><span class="k">Two instances beat one cluster</span><span class="v">If you have two workloads with different needs — a cache that may be evicted and a queue that may not (Lesson 9.2) — two separate instances is simpler, safer and cheaper than one cluster holding both.</span></div>
  <div class="kv"><span class="k">Managed does not remove the design work</span><span class="v">Key naming, TTLs, eviction policy, <code>CROSSSLOT</code> if they gave you a cluster, and the durability posture are all still yours. It removes the operations, not the engineering.</span></div>
  <div class="kv"><span class="k">Check the managed version and features first</span><span class="v">Several offerings are on Redis 6.2 or 7.0, disable <code>EVAL</code> or <code>FUNCTION</code>, and have persistence off. <code>INFO server</code>, <code>CONFIG GET appendonly</code> and <code>COMMAND INFO fcall</code> against the real endpoint answer this in thirty seconds (Lessons 7.4, 9.5).</span></div>
</div>

<h3>Do the capacity arithmetic before the architecture</h3>
<pre><code><span class="tok-comment"># Bytes per item, measured on YOUR data rather than guessed</span>
redis-cli MEMORY USAGE session:9f2a1c
redis-cli EVAL "return redis.call('MEMORY','USAGE',KEYS[1])/redis.call('HLEN',KEYS[1])" 1 bighash
redis-cli INFO memory | grep -E "^used_memory_human|^used_memory_peak_human"
redis-cli INFO keyspace</code></pre>
<div class="out">(integer) 312
(integer) 87
used_memory_human:1.20G
used_memory_peak_human:2.84G
db0:keys=1842033,expires=1799210,avg_ttl=241833</div>
<div class="callout"><strong>312 bytes per session, one million concurrent sessions, is 312 MB — not a cluster.</strong> That arithmetic is the whole capacity plan and it takes two minutes, yet it is the step people skip on the way to a six-node deployment. Do it with the peak, not the average, and add room for a fork (Lesson 9.3): sizing at 60–70% of machine RAM means 1.20 GB of data wants a 2 GB instance, and 2.84 GB of peak wants 4 GB. Then project growth honestly — if the number doubles every year and you are at 4 GB, you have three years before a 32 GB machine is uncomfortable, and by then the decision will be informed by data you do not have yet.</div>

<div class="pitfall"><strong>Pitfall:</strong> adopting Cluster for a future you have not measured. It is a one-way door in practice: <code>CROSSSLOT</code> forces hash tags into your key naming, code loses <code>MGET</code> across unrelated keys, <code>SCAN</code>-based maintenance becomes per-node, <code>SELECT</code> disappears, and every one of those decisions propagates into application code that then cannot easily move back. Teams routinely pay all of that for a dataset that fits in 8 GB, because the plan said "we might grow". Two things make the decision safer. <strong>Write cluster-compatible code without running a cluster:</strong> use one database, keep multi-key operations within a natural entity, avoid whole-keyspace scans on hot paths — this costs almost nothing on a single instance and means the migration is a deployment rather than a rewrite. <strong>And set a trigger instead of a guess:</strong> "when <code>used_memory_peak</code> exceeds 60% of the largest instance we are willing to buy, we start the Cluster project", written down, monitored, and reviewed quarterly. That converts an architectural anxiety into a number, and the number is usually further away than it feels.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">redis-benchmark</span><span class="lc-sub">How to measure honestly: pipelining, payload size, connection count and the pitfalls that produce numbers far higher or lower than your real workload.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Scaling: the official guidance</span><span class="lc-sub">Redis's own framing of when replication is enough and when Cluster is warranted, including the limitations it lists plainly before you commit.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: choose for four systems</span><span class="lc-sub">Graded exercises: pick an architecture for four described workloads and justify it from numbers, do the capacity arithmetic from a measured per-item size, and find the three cheap fixes that remove the need to shard.</span></span>
</a>

<p class="note-ct"><strong>Three things to remember.</strong> One ordinary instance does roughly 120,000 operations a second unpipelined and close to a million pipelined, so a service at 20,000 ops/s has an order of magnitude of headroom and almost certainly a different problem. Work the decision in order — does it fit in RAM, are you near the throughput ceiling, is a manual failover acceptable, do you want to operate this at all — and note that replicas add read capacity and failover material but never write capacity. And before Cluster, do the arithmetic and try the cheap fixes: TTLs, encodings and stream retention routinely reclaim half an instance, while <code>CROSSSLOT</code> and hash tags are permanent additions to your application code.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Chọn kiến trúc, một cách thành thật</h2>
<p class="lead">Phần lớn quyết định mở rộng Redis được đưa ra từ sự lo lắng chứ không từ phép đo, và gần như luôn được đưa ra quá sớm. Nên trước cái cây quyết định là con số làm đổi hẳn cuộc trò chuyện: một máy Redis bình thường thật sự làm được bao nhiêu.</p>

<h3>Một máy làm được bao nhiêu</h3>
<pre><code>redis-benchmark -t set,get -n 1000000 -c 50 -q
redis-benchmark -t set,get -n 1000000 -c 50 -P 16 -q          <span class="tok-comment"># có pipeline</span>
redis-benchmark -t get -n 1000000 -c 50 -d 1024 -q            <span class="tok-comment"># giá trị 1KB</span>
redis-cli INFO stats | grep instantaneous_ops_per_sec</code></pre>
<div class="out">SET: 118906.11 requests per second, p50=0.263 msec
GET: 121492.35 requests per second, p50=0.255 msec
SET: 892857.12 requests per second, p50=0.815 msec
GET: 1000000.00 requests per second, p50=0.703 msec
GET: 104166.67 requests per second, p50=0.295 msec
instantaneous_ops_per_sec:0</div>
<div class="callout ok"><strong>Khoảng 120.000 phép mỗi giây khi không pipeline, và gần một triệu khi có pipeline — trên một nhân, trên phần cứng bình thường.</strong> Hãy đặt con số đó cạnh lưu lượng thật của bạn. Một ứng dụng web bận rộn ở mức 2.000 yêu cầu mỗi giây với mười lời gọi Redis mỗi yêu cầu là 20.000 phép/giây: khoảng 17% của một máy không pipeline. Phần lớn các dịch vụ "cần mở rộng Redis" đang dùng vài phần trăm của một cái máy và thật ra đang khổ vì một lệnh O(N) (Bài 6.5), một chỉ mục còn thiếu, hay một vấn đề bộ nhớ có cách chữa rẻ tiền. Hãy đo <code>instantaneous_ops_per_sec</code> so với những con số này trước khi thiết kế bất cứ thứ gì — câu trả lời thành thật rất thường là "bạn còn thừa 20 lần và đang gặp một vấn đề khác".</div>

<h3>Năm kiến trúc</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Một máy</span><span class="lz-lnote"><strong>Chịu được:</strong> ~120k phép/giây, lượng dữ liệu bằng RAM của máy. <strong>Tốn:</strong> không tốn gì về vận hành. <strong>Hỏng:</strong> mất một cái máy là một sự cố toàn phần cho tới khi có người khôi phục từ bản sao lưu. Đúng cho môi trường phát triển, công cụ nội bộ, và mọi dịch vụ production mà vài phút thời gian chết là sống được và dữ liệu dựng lại được.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Một bản chính + các bản sao</span><span class="lz-lnote"><strong>Thêm được:</strong> sao lưu fork trên bản sao, việc chỉ đọc dời khỏi bản chính, một bản sao ấm sẵn để thăng cấp bằng tay. <strong>Tốn:</strong> thêm một cái máy, và những bất ngờ về độ trễ bản sao ở Bài 11.2. <strong>Vẫn hỏng:</strong> không gì thăng cấp tự động. Gần như mọi bản triển khai Redis đều nên ít nhất ở mức này.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Sentinel</span><span class="lz-lnote"><strong>Thêm được:</strong> tự động chuyển đổi trong mười tới ba mươi giây, và một dịch vụ cung cấp địa chỉ cho các thư viện khách. <strong>Tốn:</strong> ba tiến trình nữa trên ba máy, thư viện khách hiểu Sentinel hoặc một proxy, và một loại sự cố mới — một lần chuyển đổi bị kích hoạt bởi một cú chớp mạng. Đúng khi việc mất bản chính không được phép đòi tới con người.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Cluster</span><span class="lz-lnote"><strong>Thêm được:</strong> một tập dữ liệu lớn hơn một cái máy, thông lượng ghi vượt một nhân, chuyển đổi theo từng mảnh mà không cần Sentinel. <strong>Tốn:</strong> <code>CROSSSLOT</code>, nhãn băm, chỉ một cơ sở dữ liệu, <code>SCAN</code> theo từng nút, việc chia lại ô, và tối thiểu sáu nút. Đúng khi tập đang làm việc thật sự không vừa — và hiếm khi đúng trước lúc đó.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · Dịch vụ có quản lý (ElastiCache, MemoryDB, Upstash, Redis Cloud…)</span><span class="lz-lnote"><strong>Thêm được:</strong> có người khác chạy nó, vá nó, giám sát nó và bị gọi dậy vì nó. <strong>Tốn:</strong> tiền, một phiên bản thường chậm hơn bản gốc cả năm trở lên, các lệnh bị hạn chế, và những thiết lập lưu lâu dài bạn có thể không kiểm soát được (Bài 9.5). Với phần lớn các đội thì đây là câu trả lời đúng và là câu trả lời họ mất quá lâu mới đi tới.</span></div>
</div>

<h3>Quyết định, theo thứ tự</h3>
<pre><code><span class="tok-comment"># 1 · Tập đang làm việc có vừa RAM của một cái máy, kèm chỗ trống, không?</span>
redis-cli INFO memory | grep -E "used_memory_human|used_memory_peak_human"
<span class="tok-comment">#     không → Cluster (hoặc thu nhỏ tập dữ liệu trước — xem bên dưới)</span>
<span class="tok-comment">#     có    → đi tiếp</span>

<span class="tok-comment"># 2 · Bạn có ở đâu đó gần thông lượng của một cái máy không?</span>
redis-cli INFO stats | grep instantaneous_ops_per_sec
<span class="tok-comment">#     &gt;60k duy trì → cân nhắc Cluster; &lt;20k → thông lượng không phải vấn đề của bạn</span>

<span class="tok-comment"># 3 · Một lần chuyển đổi thủ công có chấp nhận được không?</span>
<span class="tok-comment">#     có    → bản chính + bản sao, kèm một cuốn sổ tay đã diễn tập</span>
<span class="tok-comment">#     không → Sentinel, hoặc một dịch vụ có quản lý làm hộ bạn</span>

<span class="tok-comment"># 4 · Bạn có muốn vận hành bất cứ thứ gì trong đó không?</span>
<span class="tok-comment">#     không → có quản lý. Đây là một câu trả lời chính đáng và thường là đúng.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy thu nhỏ trước khi chia mảnh</span><span class="v">TTL cho những khoá chưa có (Bài 2.2), mẹo chia gáo hash (Bài 5.2), <code>MAXLEN</code> trên các stream (Bài 8.2) và dời dữ liệu nguội đi thường xuyên đòi lại được nửa cái máy. Cái nào cũng rẻ hơn một cụm, mãi mãi.</span></div>
  <div class="kv"><span class="k">Bản sao không thêm dung lượng ghi</span><span class="v">Mọi lượt ghi vẫn đi qua đúng một bản chính. Bản sao mở rộng phần đọc và cho bạn vật liệu để chuyển đổi; nếu lượt ghi là nút thắt cổ chai thì chỉ Cluster mới giúp được.</span></div>
  <div class="kv"><span class="k">Hai cái máy thắng một cái cụm</span><span class="v">Nếu bạn có hai khối lượng việc với nhu cầu khác nhau — một bộ đệm được phép bị đẩy khoá và một hàng đợi thì không (Bài 9.2) — thì hai máy tách riêng vừa đơn giản hơn, an toàn hơn và rẻ hơn một cái cụm ôm cả hai.</span></div>
  <div class="kv"><span class="k">Có quản lý không gỡ bỏ phần việc thiết kế</span><span class="v">Đặt tên khoá, TTL, chính sách đẩy khoá, <code>CROSSSLOT</code> nếu họ đưa cho bạn một cái cụm, và tư thế bền vững vẫn là việc của bạn. Nó gỡ bỏ phần vận hành, không gỡ bỏ phần kỹ thuật.</span></div>
  <div class="kv"><span class="k">Hãy kiểm phiên bản và tính năng của dịch vụ trước</span><span class="v">Vài nhà cung cấp còn ở Redis 6.2 hay 7.0, tắt <code>EVAL</code> hoặc <code>FUNCTION</code>, và tắt luôn phần lưu lâu dài. <code>INFO server</code>, <code>CONFIG GET appendonly</code> và <code>COMMAND INFO fcall</code> chạy lên đúng cái đầu nối thật sẽ trả lời chuyện đó trong ba mươi giây (Bài 7.4, 9.5).</span></div>
</div>

<h3>Hãy làm phép tính dung lượng trước phép chọn kiến trúc</h3>
<pre><code><span class="tok-comment"># Số byte mỗi mục, đo trên dữ liệu CỦA BẠN chứ đừng đoán</span>
redis-cli MEMORY USAGE session:9f2a1c
redis-cli EVAL "return redis.call('MEMORY','USAGE',KEYS[1])/redis.call('HLEN',KEYS[1])" 1 bighash
redis-cli INFO memory | grep -E "^used_memory_human|^used_memory_peak_human"
redis-cli INFO keyspace</code></pre>
<div class="out">(integer) 312
(integer) 87
used_memory_human:1.20G
used_memory_peak_human:2.84G
db0:keys=1842033,expires=1799210,avg_ttl=241833</div>
<div class="callout"><strong>312 byte mỗi phiên, một triệu phiên đồng thời, là 312 MB — không phải một cái cụm.</strong> Phép tính đó chính là toàn bộ kế hoạch dung lượng và nó mất hai phút, vậy mà nó là cái bước người ta bỏ qua trên đường tới một bản triển khai sáu nút. Hãy làm nó với con số đỉnh chứ đừng với trung bình, và hãy cộng thêm chỗ cho một cú fork (Bài 9.3): chọn cỡ ở mức 60–70% RAM của máy nghĩa là 1,20 GB dữ liệu cần một máy 2 GB, còn 2,84 GB đỉnh cần 4 GB. Rồi hãy dự phóng mức tăng trưởng một cách thành thật — nếu con số tăng gấp đôi mỗi năm và bạn đang ở 4 GB thì bạn còn ba năm nữa mới thấy một máy 32 GB là chật, và tới lúc đó quyết định sẽ dựa trên dữ liệu mà bây giờ bạn chưa có.</div>

<div class="pitfall"><strong>Cái bẫy:</strong> nhận lấy Cluster cho một tương lai bạn chưa hề đo. Trên thực tế nó là một cánh cửa một chiều: <code>CROSSSLOT</code> ép nhãn băm vào cách đặt tên khoá của bạn, mã mất khả năng <code>MGET</code> qua các khoá không liên quan, việc bảo trì dựa trên <code>SCAN</code> thành từng nút một, <code>SELECT</code> biến mất, và mỗi quyết định đó lan vào mã ứng dụng để rồi không dễ quay lại. Các đội thường xuyên trả hết chừng ấy cho một tập dữ liệu vừa trong 8 GB, chỉ vì kế hoạch nói "biết đâu bọn mình lớn lên". Hai thứ làm cho quyết định an toàn hơn. <strong>Hãy viết mã tương thích với cụm mà không cần chạy cụm:</strong> dùng một cơ sở dữ liệu, giữ các phép nhiều khoá nằm gọn trong một thực thể tự nhiên, tránh quét toàn bộ không gian khoá trên các đường đi nóng — chuyện này gần như chẳng tốn gì trên một máy đơn lẻ và nó biến lần di trú thành một lần triển khai chứ không phải một lần viết lại. <strong>Và hãy đặt một mốc kích hoạt thay vì một phỏng đoán:</strong> "khi <code>used_memory_peak</code> vượt 60% của cái máy lớn nhất mà bọn mình chịu mua thì bắt đầu dự án Cluster", ghi ra giấy, có giám sát, và xem lại mỗi quý. Việc đó biến một nỗi lo kiến trúc thành một con số, và con số ấy thường xa hơn cảm giác nhiều.</div>

<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/benchmarks/" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">redis-benchmark</span><span class="lc-sub">Cách đo cho thành thật: pipeline, kích thước gói dữ liệu, số kết nối và những cái bẫy sinh ra con số cao hơn hay thấp hơn hẳn khối lượng việc thật của bạn.</span></span>
</a>
<a class="link-card" href="https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Mở rộng: hướng dẫn chính thức</span><span class="lc-sub">Cách chính Redis đóng khung chuyện khi nào nhân bản là đủ và khi nào Cluster là chính đáng, kèm những hạn chế nó liệt kê thẳng thắn trước khi bạn cam kết.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/redis${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Thực hành: chọn cho bốn hệ thống</span><span class="lc-sub">Bài chấm điểm: chọn kiến trúc cho bốn khối lượng việc được mô tả rồi biện minh bằng con số, làm phép tính dung lượng từ một kích thước mỗi mục đã đo, và tìm ra ba cách chữa rẻ tiền gỡ bỏ nhu cầu chia mảnh.</span></span>
</a>

<p class="note-ct"><strong>Ba điều cần nhớ.</strong> Một máy bình thường làm được khoảng 120.000 phép mỗi giây khi không pipeline và gần một triệu khi có pipeline, nên một dịch vụ ở mức 20.000 phép/giây còn thừa cả một bậc độ lớn và gần như chắc chắn đang gặp một vấn đề khác. Hãy làm quyết định theo thứ tự — có vừa RAM không, có gần trần thông lượng không, chuyển đổi thủ công có chấp nhận được không, bạn có muốn vận hành thứ này chút nào không — và hãy nhớ rằng bản sao thêm dung lượng đọc cùng vật liệu để chuyển đổi chứ không bao giờ thêm dung lượng ghi. Và trước khi tới Cluster, hãy làm phép tính và thử những cách chữa rẻ: TTL, kiểu mã hoá và thời gian lưu stream thường xuyên đòi lại được nửa cái máy, trong khi <code>CROSSSLOT</code> và nhãn băm là những thứ thêm vào vĩnh viễn trong mã ứng dụng của bạn.</p>
</div>
`,
    },
    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: '11.6 — Quiz: replication, Sentinel and Cluster|||11.6 — Trắc nghiệm: nhân bản, Sentinel và Cluster',
      slug: 'rd-11-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về chi phí của lần đồng bộ đầu tiên, bộ đệm nhân bản, nhân bản bất đồng bộ, WAIT, quorum khác đa số, thư viện khách hiểu Sentinel, CROSSSLOT với nhãn băm, và khi nào Cluster là câu trả lời sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on three mechanisms that each solve one problem and introduce two. Half of them are about guarantees that sound stronger than they are.</p>
<div class="callout ok">Aim for 7/8. The four that matter most: what a first sync costs the primary (11.1), what <code>WAIT</code> does and does not promise (11.2), quorum versus majority (11.3), and why hash tags re-create the problem Cluster solves (11.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Trắc nghiệm</span>
<h2>Kiểm lại xem đọng được gì</h2>
<p class="lead">Tám câu về ba cơ chế mà mỗi cái giải một vấn đề rồi mang tới hai vấn đề mới. Một nửa số câu nói về những bảo đảm nghe mạnh hơn thực tế của chúng.</p>
<div class="callout ok">Nhắm 7/8. Bốn câu quan trọng nhất: lần đồng bộ đầu tiên bắt bản chính trả giá gì (11.1), <code>WAIT</code> hứa gì và không hứa gì (11.2), quorum so với đa số (11.3), và vì sao nhãn băm dựng lại chính cái bài toán mà Cluster giải (11.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'You run REPLICAOF against a busy 20 GB primary at peak traffic. What does the primary actually pay?|||Bạn chạy REPLICAOF lên một bản chính 20 GB đang bận vào lúc cao điểm. Bản chính thật sự phải trả cái gì?',
            options: [
              'Nothing measurable — replication streams incrementally from the current offset|||Không gì đo được — nhân bản chảy tăng dần từ offset hiện tại',
              'Only network bandwidth; the RDB is generated by the replica|||Chỉ băng thông mạng; tệp RDB do bản sao tự tạo ra',
              'A fork with copy-on-write memory, plus an output buffer holding every write made during the transfer — all of it counted against maxmemory|||Một cú fork kèm bộ nhớ sao-chép-khi-ghi, cộng một bộ đệm đầu ra giữ mọi lượt ghi thực hiện trong lúc truyền — tất cả đều tính vào maxmemory',
              'A brief write pause while the snapshot is taken atomically|||Một lần tạm dừng ghi ngắn trong lúc ảnh chụp được lấy một cách nguyên tử',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A replica disconnects for 20 seconds on an instance writing 1 MB/s, with default settings. What happens when it reconnects?|||Một bản sao mất kết nối 20 giây trên một máy đang ghi 1 MB/giây, với các thiết lập mặc định. Chuyện gì xảy ra khi nó nối lại?',
            options: [
              'A partial resync, because the replication backlog keeps the last hour of writes|||Một lần đồng bộ một phần, vì bộ đệm nhân bản giữ lại một giờ lượt ghi gần nhất',
              'A full resync, because the default 1 MB backlog covers about one second of writes at that rate — with the fork, the transfer and the loading all over again|||Một lần đồng bộ đầy đủ, vì bộ đệm mặc định 1 MB chỉ phủ khoảng một giây lượt ghi ở tốc độ đó — kèm cú fork, lần truyền và lần nạp, tất cả làm lại từ đầu',
              'The primary refuses the reconnection until the replica is manually reset|||Bản chính từ chối lần nối lại cho tới khi bản sao được đặt lại bằng tay',
              'Nothing — the replica catches up from its own AOF|||Không sao cả — bản sao đuổi kịp từ AOF của chính nó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A write returns +OK and one second later the primary’s host dies. A replica is promoted. What can you say about that write?|||Một lượt ghi trả về +OK và một giây sau máy chủ của bản chính chết. Một bản sao được thăng cấp. Bạn nói được gì về lượt ghi đó?',
            options: [
              'It is safe — an acknowledgement means the write reached at least one replica|||Nó an toàn — một lời xác nhận nghĩa là lượt ghi đã tới ít nhất một bản sao',
              'It is safe if AOF was enabled, because the replica replays the primary’s AOF|||Nó an toàn nếu AOF đang bật, vì bản sao phát lại AOF của bản chính',
              'It is recoverable from the replication backlog after the promotion|||Nó khôi phục được từ bộ đệm nhân bản sau khi thăng cấp',
              'It may be gone: replication is asynchronous, so the primary replied before sending it onward, and a failover in that window loses it silently|||Nó có thể đã mất: nhân bản là bất đồng bộ, nên bản chính trả lời trước khi gửi nó đi tiếp, và một lần chuyển đổi rơi vào cửa sổ đó sẽ làm mất nó một cách âm thầm',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'What does `WAIT 2 100` returning 1 tell you, and what should your code do?|||`WAIT 2 100` trả về 1 nói cho bạn biết gì, và mã của bạn nên làm gì?',
            options: [
              'One replica confirmed within 100 ms and the second did not — WAIT reports rather than guarantees, so your code has to decide what to do about the shortfall|||Một bản sao đã xác nhận trong vòng 100 ms còn cái thứ hai thì không — WAIT báo cáo chứ không bảo đảm, nên mã của bạn phải quyết định làm gì với phần còn thiếu',
              'One replica exists in total; the command succeeded fully|||Tổng cộng có một bản sao; lệnh đã thành công trọn vẹn',
              'The write was rolled back on the replica that did not confirm|||Lượt ghi đã bị quay lui trên cái bản sao không xác nhận',
              'It returned early; calling it again will always return 2|||Nó trả về sớm; gọi lại lần nữa thì sẽ luôn trả về 2',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You have three Sentinels and set `quorum 1`. Can a single surviving Sentinel perform a failover?|||Bạn có ba Sentinel và đặt `quorum 1`. Một Sentinel sống sót đơn độc có thực hiện được một lần chuyển đổi không?',
            options: [
              'Yes — quorum 1 means one Sentinel is sufficient for the whole process|||Có — quorum 1 nghĩa là một Sentinel là đủ cho toàn bộ quá trình',
              'No. quorum decides when the primary is declared objectively down, but performing the failover requires a MAJORITY of the whole Sentinel set to authorise a leader — 2 of 3 here|||Không. quorum quyết định khi nào bản chính bị tuyên là chết một cách khách quan, nhưng thực hiện chuyển đổi thì cần ĐA SỐ của toàn bộ tập Sentinel cho phép một trưởng nhóm — ở đây là 2 trên 3',
              'Yes, but only if the surviving Sentinel also runs on the primary’s host|||Có, nhưng chỉ khi cái Sentinel sống sót cũng chạy trên máy của bản chính',
              'No, because quorum must always equal the number of Sentinels|||Không, vì quorum luôn phải bằng số lượng Sentinel',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Sentinel logs a clean failover, but your application is completely down. What is the most likely cause?|||Sentinel ghi nhật ký một lần chuyển đổi sạch đẹp, nhưng ứng dụng của bạn sập hoàn toàn. Nguyên nhân khả dĩ nhất là gì?',
            options: [
              'The promoted replica is still loading its RDB and answering -LOADING|||Bản sao vừa thăng cấp vẫn đang nạp RDB và trả lời -LOADING',
              'The clients are configured with the old primary’s address: Sentinel promoted a replica but nothing told the application, because Sentinel is a configuration provider clients must actually query|||Các thư viện khách được cấu hình bằng địa chỉ của bản chính cũ: Sentinel đã thăng cấp một bản sao nhưng không gì báo cho ứng dụng, vì Sentinel là nơi cung cấp cấu hình mà thư viện khách phải thật sự hỏi tới',
              'min-replicas-to-write is now unsatisfied on the new primary|||min-replicas-to-write giờ không thoả trên bản chính mới',
              'The failover reset all ACL users to their default permissions|||Lần chuyển đổi đã đặt lại mọi người dùng ACL về quyền mặc định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: '`MGET user:1 user:2` fails with CROSSSLOT in Cluster. What is the fix, and what does it cost?|||`MGET user:1 user:2` hỏng với lỗi CROSSSLOT trong Cluster. Cách chữa là gì, và nó tốn cái gì?',
            options: [
              'Enable cluster-require-full-coverage no, which permits cross-slot reads|||Bật cluster-require-full-coverage no, việc đó cho phép đọc xuyên ô',
              'Use CLUSTER KEYSLOT to route the command manually to the owning node|||Dùng CLUSTER KEYSLOT để tự định tuyến lệnh tới nút sở hữu',
              'Run the command through a MULTI block, which Cluster resolves internally|||Chạy lệnh qua một khối MULTI, Cluster sẽ tự giải quyết bên trong',
              'A hash tag: {u1042}:profile and {u1042}:sessions hash to one slot — and every key sharing a tag lives on one node, so a tag chosen too broadly puts the whole dataset back on a single machine|||Một nhãn băm: {u1042}:profile và {u1042}:sessions băm về một ô — và mọi khoá dùng chung một nhãn đều sống trên một nút, nên một cái nhãn chọn quá rộng sẽ đưa cả tập dữ liệu về lại một cái máy',
            ],
            correctIndex: 3,
            points: 1,
          },
          {
            question: 'Your instance is slow, holds 6 GB, and sustains 18,000 ops/s. A colleague proposes a six-node Cluster. What is the right response?|||Máy của bạn chậm, đang giữ 6 GB, và duy trì 18.000 phép/giây. Một đồng nghiệp đề xuất một cụm sáu nút. Phản hồi đúng là gì?',
            options: [
              'Agree — 18,000 ops/s is close to the practical ceiling for a single instance|||Đồng ý — 18.000 phép/giây là gần sát trần thực tế của một máy đơn lẻ',
              'Disagree: one instance does roughly 120,000 ops/s unpipelined and 6 GB fits easily, so the slowness is almost certainly an O(N) command — and sharding gives six nodes that each still stall on their own KEYS|||Phản đối: một máy làm được khoảng 120.000 phép/giây khi không pipeline và 6 GB thì vừa thoải mái, nên sự chậm chạp gần như chắc chắn là một lệnh O(N) — và chia mảnh chỉ cho ra sáu nút mà mỗi cái vẫn khựng vì lệnh KEYS của riêng nó',
              'Agree, but with three nodes instead of six to reduce cost|||Đồng ý, nhưng dùng ba nút thay vì sáu để giảm chi phí',
              'Disagree and add replicas instead, since replicas increase write throughput|||Phản đối và thêm bản sao thay vào đó, vì bản sao làm tăng thông lượng ghi',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
